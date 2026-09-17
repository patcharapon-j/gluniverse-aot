/**
 * What a player may ask the GM to change in the running engagement (the `tracker` request of the
 * GM proxy, src/tracker/requests.ts). Kept free of Foundry globals so it can be tested. A request
 * names ids only; the GM's client works out every value from the rules.
 */
import { drawAttentionBlock } from './attention.ts';
import { swapBlock } from './cards.ts';
import { comparisonLabel, isClose, nearEachOther } from './positions.ts';
import { wingBlock, type RoundCore } from './round.ts';
import type { Snapshot } from './types.ts';

export type TrackerRequest =
  | { act: 'wing'; combat: string; mate: string; pc: string | null }
  | { act: 'swap-propose'; combat: string; a: string; b: string }
  | { act: 'swap-accept'; combat: string }
  | { act: 'swap-cancel'; combat: string }
  | { act: 'odm'; combat: string; soldier: string }
  | { act: 'left'; combat: string; soldier: string }
  | { act: 'loud'; combat: string; soldier: string; titan: string }
  | { act: 'fall-back'; combat: string; soldier: string; titan: string }
  | { act: 'engage'; combat: string; soldier: string; foe: string };

export interface TrackerWorld {
  userId: string;
  /** Does the asking user own this actor (by id)? */
  owns(actorId: string): boolean;
  /** The engagement the request names, or null. */
  snapshot(combatId: string): Snapshot | null;
  /** A Skirmish's Foes still in it, and who holds or is held (engaged_and_apart, held). */
  skirmish?(combatId: string): { foes: string[]; holding: string[] } | null;
}

export const coreOf = (s: Snapshot): RoundCore => ({ mode: s.mode, step: s.step, round: s.round, wingsSet: s.wingsSet, wingsOpen: s.wingsOpen, reassign: s.reassign, endLog: [] });

export const grabbedIn = (s: Snapshot) => (id: string) => s.titans.some((t) => t.status === 'focus' && t.grab?.soldier === id);

/** Could these two soldiers swap now (round.yaml, swapping)? */
export function swapCheck(s: Snapshot, a: string, b: string) {
  const sa = s.soldiers.find((x) => x.id === a);
  const sb = s.soldiers.find((x) => x.id === b);
  if (!sa || !sb || !s.anchor) return { key: 'unknown' };
  const label = comparisonLabel(s.titans);
  const rating = s.anchor;
  return swapBlock({ step: s.step, a: sa, b: sb, cards: s.cards, swapped: s.swapped, wings: s.wings, grabbed: grabbedIn(s), near: (x, y) => nearEachOther(x, y, label, rating, s.titans) });
}

/** Why the user may not have the GM make this change, or null. */
export function checkTrackerRequest(w: TrackerWorld, req: TrackerRequest): string | null {
  if (!req || typeof req !== 'object' || typeof req.combat !== 'string') return 'malformed request';
  const s = w.snapshot(req.combat);
  if (!s) return 'no such engagement';
  const taking = (id: unknown) => typeof id === 'string' && s.soldiers.some((x) => x.id === id);
  switch (req.act) {
    case 'wing': {
      if (!taking(req.mate) || (req.pc !== null && !taking(req.pc))) return 'the soldiers are not taking part';
      const mate = s.soldiers.find((x) => x.id === req.mate)!;
      const pc = req.pc ? s.soldiers.find((x) => x.id === req.pc)! : null;
      const current = s.wings[req.mate] ?? null;
      const mine = (pc && w.owns(pc.id)) || (current && w.owns(current)) || w.owns(mate.id);
      if (!mine) return 'the user owns neither the Squadmate nor the player character';
      const why = wingBlock({ core: coreOf(s), mate, pc, wings: s.wings });
      return why ? `the Wing cannot be set (${why})` : null;
    }
    case 'swap-propose': {
      if (!taking(req.a) || !taking(req.b)) return 'the soldiers are not taking part';
      if (!w.owns(req.a)) return 'a swap is proposed for the user’s own soldier';
      const why = swapCheck(s, req.a, req.b);
      return why ? `the swap is not allowed (${why.key})` : null;
    }
    case 'swap-accept': {
      const p = s.proposal;
      if (!p) return 'no swap is proposed';
      if (!w.owns(p.b)) return 'only the other soldier’s owner accepts';
      const why = swapCheck(s, p.a, p.b);
      return why ? `the swap is not allowed (${why.key})` : null;
    }
    case 'swap-cancel': {
      const p = s.proposal;
      if (!p) return 'no swap is proposed';
      return w.owns(p.a) || w.owns(p.b) ? null : 'the user owns neither soldier';
    }
    case 'odm': {
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      if (!w.owns(req.soldier)) return 'only the soldier’s owner marks ODM use';
      if (s.mode !== 'titan' || s.step !== 'play') return 'ODM use is marked during play';
      return null;
    }
    case 'left': {
      // The departure itself is the owner's own actor change; the GM only opens the next wings step.
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      if (!w.owns(req.soldier)) return 'only the soldier’s owner reports their departure';
      if (s.mode !== 'titan') return 'only a Titan Engagement has Wings';
      return s.soldiers.find((x) => x.id === req.soldier)!.left ? null : 'the soldier has not left';
    }
    case 'loud': {
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      if (!w.owns(req.soldier)) return 'only the soldier’s owner takes Draw Attention';
      if (s.step !== 'play') return 'Draw Attention is taken during play';
      const soldier = s.soldiers.find((x) => x.id === req.soldier)!;
      const titan = s.titans.find((t) => t.key === req.titan);
      if (!titan) return 'no such Titan';
      const why = drawAttentionBlock(soldier, titan, grabbedIn(s)(soldier.id));
      return why ? `Draw Attention is not allowed (${why})` : null;
    }
    case 'fall-back': {
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      if (!w.owns(req.soldier)) return 'only the soldier’s owner chooses Fall Back';
      const why = fallBackBlock(s, req.soldier, req.titan);
      return why ? `Fall Back is not allowed (${why})` : null;
    }
    case 'engage': {
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      if (!w.owns(req.soldier)) return 'only the soldier’s owner moves them';
      if (s.mode !== 'skirmish' || s.step !== 'play') return 'Engaged and Apart change during a Skirmish’s play';
      const sk = w.skirmish?.(req.combat);
      if (!sk || !sk.foes.includes(req.foe)) return 'the Foe is not in the Skirmish';
      const soldier = s.soldiers.find((x) => x.id === req.soldier)!;
      if (soldier.down || !soldier.alive) return 'a Down soldier’s move changes nothing';
      if (sk.holding.includes(req.soldier)) return 'a Held soldier, or one who holds a Foe, cannot move';
      return null;
    }
    default:
      return 'unknown request';
  }
}

/** Fall Back (squad-tactics.yaml): at the wings step, held and unused (or declared this step), for a soldier on-body or blind-spot, not Down, Grabbed, or carried. */
export function fallBackBlock(s: Snapshot, soldierId: string, titanKey: string): string | null {
  if (s.mode !== 'titan' || s.step !== 'wings') return 'wrongStep';
  if (!s.tactics.held.includes('fall-back')) return 'notHeld';
  if (s.tactics.used.includes('fall-back') && !s.tactics.used.includes(`fall-back@${s.round}`)) return 'used';
  const soldier = s.soldiers.find((x) => x.id === soldierId);
  const titan = s.titans.find((t) => t.key === titanKey);
  if (!soldier || !titan || titan.status !== 'focus') return 'unknown';
  if (!isClose(soldier.positions[titan.label])) return 'notClose';
  if (soldier.down || soldier.carriedBy || grabbedIn(s)(soldier.id)) return 'cannot';
  return null;
}
