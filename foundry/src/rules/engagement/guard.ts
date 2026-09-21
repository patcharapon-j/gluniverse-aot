/**
 * What a player may ask the GM to change in the running engagement (the `tracker` request of the
 * GM proxy, src/tracker/requests.ts). Kept free of Foundry globals so it can be tested. A request
 * names ids only; the GM's client works out every value from the rules.
 */
import { drawAttentionBlock } from './attention.ts';
import { swapBlock } from './cards.ts';
import { isClose, letGoBlock, moveContext, ratingRows, returnBlock, returnZones, routeOption, type MoveKind } from './positions.ts';
import { spendBlock } from './momentum.ts';
import { retreatBinds, retreatOptions } from './retreat.ts';
import { wingBlock, type RoundCore } from './round.ts';
import type { Snapshot } from './types.ts';
import { withinZones, type Placement } from './zones.ts';

export type TrackerRequest =
  | { act: 'wing'; combat: string; mate: string; pc: string | null }
  | { act: 'swap-propose'; combat: string; a: string; b: string }
  | { act: 'swap-accept'; combat: string }
  | { act: 'swap-cancel'; combat: string }
  | { act: 'odm'; combat: string; soldier: string }
  | { act: 'left'; combat: string; soldier: string }
  | { act: 'loud'; combat: string; soldier: string; titan: string }
  | { act: 'loud-move'; combat: string; soldier: string; titan: string }
  | { act: 'move-spent'; combat: string; soldier: string }
  | { act: 'fall-back'; combat: string; soldier: string; titan: string }
  | { act: 'let-go'; combat: string; soldier: string; titan?: string }
  | { act: 'zone-move'; combat: string; soldier: string; kind: MoveKind; steps: Placement[]; chargeOn?: string; quiet?: boolean; mount?: boolean; dismount?: boolean; mountAfter?: boolean; dismountAfter?: boolean }
  | { act: 'quiet'; combat: string; soldier: string }
  | { act: 'return'; combat: string; soldier: string; zone: number }
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
  if (!sa || !sb) return { key: 'unknown' };
  // One Position step between two soldiers reads the same zone or an adjacent one (16-11).
  return swapBlock({ step: s.step, a: sa, b: sb, cards: s.cards, swapped: s.swapped, wings: s.wings, grabbed: grabbedIn(s), near: (x, y) => withinZones(s.field, x, y, 1) });
}

/**
 * Why the user may not have the GM make this change, or null: the permission checks followed by the
 * rules checks (ADR-0028). A player's request must pass both, which is what it has always had to do;
 * the GM's own client runs the permission checks alone, so automation never blocks the GM.
 */
export function checkTrackerRequest(w: TrackerWorld, req: TrackerRequest): string | null {
  return checkTrackerPermission(w, req) ?? checkTrackerRules(w, req);
}

/**
 * The reasons that are about WHO is asking (ADR-0028): the request is well formed, the engagement
 * exists, the ids name people taking part, and the user owns the actor whose change this is. Never a
 * reason about whether the rules allow the change; those are checkTrackerRules. The GM's own client
 * is held to these and to nothing else.
 */
export function checkTrackerPermission(w: TrackerWorld, req: TrackerRequest): string | null {
  if (!req || typeof req !== 'object' || typeof req.combat !== 'string') return 'malformed request';
  const s = w.snapshot(req.combat);
  if (!s) return 'no such engagement';
  const taking = (id: unknown) => typeof id === 'string' && s.soldiers.some((x) => x.id === id);
  const titanOf = (key: string) => s.titans.find((t) => t.key === key) ?? null;
  switch (req.act) {
    case 'wing': {
      if (!taking(req.mate) || (req.pc !== null && !taking(req.pc))) return 'the soldiers are not taking part';
      const current = s.wings[req.mate] ?? null;
      const mine = (req.pc && w.owns(req.pc)) || (current && w.owns(current)) || w.owns(req.mate);
      return mine ? null : 'the user owns neither the Squadmate nor the player character';
    }
    case 'swap-propose':
      if (!taking(req.a) || !taking(req.b)) return 'the soldiers are not taking part';
      return w.owns(req.a) ? null : 'a swap is proposed for the user’s own soldier';
    case 'swap-accept':
      if (!s.proposal) return 'no swap is proposed';
      return w.owns(s.proposal.b) ? null : 'only the other soldier’s owner accepts';
    case 'swap-cancel':
      if (!s.proposal) return 'no swap is proposed';
      return w.owns(s.proposal.a) || w.owns(s.proposal.b) ? null : 'the user owns neither soldier';
    case 'odm':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      return w.owns(req.soldier) ? null : 'only the soldier’s owner marks ODM use';
    case 'left':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      return w.owns(req.soldier) ? null : 'only the soldier’s owner reports their departure';
    case 'loud':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      if (!w.owns(req.soldier)) return 'only the soldier’s owner takes Draw Attention';
      return titanOf(req.titan) ? null : 'no such Titan';
    case 'loud-move':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      if (!w.owns(req.soldier)) return 'only the soldier’s owner makes their move';
      return titanOf(req.titan) ? null : 'no such Focus Titan';
    case 'move-spent':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      return w.owns(req.soldier) ? null : 'only the soldier’s owner spends their move';
    case 'fall-back':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      return w.owns(req.soldier) ? null : 'only the soldier’s owner chooses Fall Back';
    case 'let-go':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      return w.owns(req.soldier) ? null : 'only the soldier’s owner lets go';
    case 'zone-move':
    case 'quiet':
    case 'return':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      return w.owns(req.soldier) ? null : 'only the soldier’s owner makes their move';
    case 'engage':
      if (!taking(req.soldier)) return 'the soldier is not taking part';
      return w.owns(req.soldier) ? null : 'only the soldier’s owner moves them';
    default:
      return 'unknown request';
  }
}

/**
 * The reasons that are about whether the rules allow the change: the step, the Positions, Grabbed,
 * and every other fact about the running fight (ADR-0028). A GM stepping over the automation skips
 * exactly these. It assumes the permission checks passed, and says nothing when they did not.
 */
export function checkTrackerRules(w: TrackerWorld, req: TrackerRequest): string | null {
  if (!req || typeof req !== 'object' || typeof req.combat !== 'string') return null;
  const s = w.snapshot(req.combat);
  if (!s) return null;
  const soldierOf = (id: string) => s.soldiers.find((x) => x.id === id) ?? null;
  const titanOf = (key: string) => s.titans.find((t) => t.key === key) ?? null;
  switch (req.act) {
    case 'wing': {
      const mate = soldierOf(req.mate);
      if (!mate) return null;
      const pc = req.pc ? soldierOf(req.pc) : null;
      if (req.pc && !pc) return null;
      const why = wingBlock({ core: coreOf(s), mate, pc, wings: s.wings });
      return why ? `the Wing cannot be set (${why})` : null;
    }
    case 'swap-propose': {
      if (!soldierOf(req.a) || !soldierOf(req.b)) return null;
      const why = swapCheck(s, req.a, req.b);
      return why ? `the swap is not allowed (${why.key})` : null;
    }
    case 'swap-accept': {
      const p = s.proposal;
      if (!p) return null;
      const why = swapCheck(s, p.a, p.b);
      return why ? `the swap is not allowed (${why.key})` : null;
    }
    case 'swap-cancel':
      return null;
    case 'odm':
      return s.mode !== 'titan' || s.step !== 'play' ? 'ODM use is marked during play' : null;
    case 'left': {
      // The departure itself is the owner's own actor change; the GM only opens the next wings step.
      if (s.mode !== 'titan') return 'only a Titan Engagement has Wings';
      const soldier = soldierOf(req.soldier);
      if (!soldier) return null;
      return soldier.left ? null : 'the soldier has not left';
    }
    case 'loud': {
      if (s.step !== 'play') return 'Draw Attention is taken during play';
      const soldier = soldierOf(req.soldier);
      const titan = titanOf(req.titan);
      if (!soldier || !titan) return null;
      const why = drawAttentionBlock(soldier, titan, grabbedIn(s)(soldier.id));
      return why ? `Draw Attention is not allowed (${why})` : null;
    }
    // The loudest flag a Flight with no successes or a mounted charge sets: from any Position,
    // Distant included (attention.yaml, flags, loudest; positions.yaml, moves, flight, no_successes).
    case 'loud-move': {
      if (s.mode !== 'titan' || s.step !== 'play') return 'a move is made during play';
      const soldier = soldierOf(req.soldier);
      const titan = titanOf(req.titan);
      if (!soldier || !titan) return null;
      if (titan.status !== 'focus') return 'no such Focus Titan';
      if (!soldier.alive || soldier.left) return 'the soldier is not in the fight';
      if (soldier.zone === null) return 'the soldier is off field';
      return grabbedIn(s)(soldier.id) ? 'a Grabbed soldier’s move changes nothing' : null;
    }
    case 'move-spent':
      return s.mode !== 'titan' || s.step !== 'play' ? 'a move is spent during play' : null;
    case 'fall-back': {
      const why = fallBackBlock(s, req.soldier, req.titan);
      return why ? `Fall Back is not allowed (${why})` : null;
    }
    case 'let-go': {
      const soldier = soldierOf(req.soldier);
      if (!soldier) return null;
      const why = letGoBlock(soldier, grabbedIn(s)(soldier.id));
      return why ? `letting go is not allowed (${why})` : null;
    }
    case 'zone-move': {
      if (s.mode !== 'titan' || s.step !== 'play') return 'a move is made during play';
      const soldier = soldierOf(req.soldier);
      if (!soldier) return null;
      if (!Array.isArray(req.steps) || !req.steps.length) return 'the move names no step';
      // One move a turn (review M6); the GM's Direct Control is the override.
      if (s.movesSpent.includes(soldier.id)) return 'the soldier’s move is spent this turn';
      const ctx = moveContext(s, soldier, ratingRows());
      if (!ctx) return 'the engagement has no field';
      const o = routeOption(soldier, ctx, req.kind, req.steps, { mountAfter: !!req.mountAfter, dismountAfter: !!req.dismountAfter });
      if (!o) return 'the move is not one the soldier’s move can make';
      // A retreat narrows the soldier's own move (background-titans.yaml, retreat, moves; 16-27).
      if (retreatBinds(soldier, { clock: { length: 0, filled: 0, active: s.retreat, began: 0 }, grabbedBy: (id) => (grabbedIn(s)(id) ? 'x' : null) })) {
        const same = (a: Placement, b: Placement) => a.zone === b.zone && a.attachment.kind === b.attachment.kind && a.attachment.body === b.attachment.body;
        if (!retreatOptions(soldier, s).some((r) => r.kind === o.kind && same(r.to, o.to) && r.steps.length === o.steps.length)) return 'the retreat does not allow that move';
      }
      return null;
    }
    case 'quiet': {
      if (s.mode !== 'titan' || s.step !== 'play') return 'Momentum is spent during play';
      const soldier = soldierOf(req.soldier);
      if (!soldier) return null;
      const why = spendBlock(soldier, 'quiet', grabbedIn(s)(soldier.id));
      return why ? `quiet cannot be spent (${why})` : null;
    }
    case 'return': {
      const soldier = soldierOf(req.soldier);
      if (!soldier || !s.field) return null;
      const why = returnBlock(soldier, s.retreat);
      if (why) return `returning is not allowed (${why})`;
      return returnZones(s.field, s.titans).includes(req.zone) ? null : 'a returner enters an edge zone holding no Focus Titan and no corpse';
    }
    case 'engage': {
      if (s.mode !== 'skirmish' || s.step !== 'play') return 'Engaged and Apart change during a Skirmish’s play';
      const sk = w.skirmish?.(req.combat);
      if (!sk || !sk.foes.includes(req.foe)) return 'the Foe is not in the Skirmish';
      const soldier = soldierOf(req.soldier);
      if (!soldier) return null;
      if (soldier.down || !soldier.alive) return 'a Down soldier’s move changes nothing';
      if (sk.holding.includes(req.soldier)) return 'a Held soldier, or one who holds a Foe, cannot move';
      return null;
    }
    default:
      return null;
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
