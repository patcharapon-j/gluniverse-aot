/**
 * Which roll cards the active GM's tracker may act on (src/tracker/results.ts). A player can post or
 * edit their own chat message, so the GM checks the card before it applies anything: who wrote it,
 * what changed since the GM last saw it, whether the roll's requirements hold now, and whether the
 * result the message carries is the one the GM wrote. Kept free of Foundry globals so it can be tested.
 */
import type { ActionCard, Card, RollTarget } from '../../dice/card.ts';
import { stable } from '../../dice/proxy-guard.ts';
import { pushBlock } from '../roll.ts';
import type { BodyPart } from '../titan.ts';
import { grabbedIn } from './guard.ts';
import { bodyPartStrikeBlock, breakAttentionBlock, breakFreeBlock, napeStrikeBlock, spendableOpenings, type DecoyId } from './strikes.ts';
import type { Snapshot } from './types.ts';

export interface CardTrustWorld {
  isGM(userId: string | null): boolean;
  /** Does this user own the actor at this uuid? */
  owns(userId: string | null, actorUuid: string): boolean;
}

export interface CardUpdate {
  /** The user who made the change. */
  userId: string;
  /** The card as the GM last accepted it, or undefined when it holds none. */
  previous: Card | undefined;
}

/** Why the GM must not act on this card, or null. `update` is set when the message was changed. */
export function cardRefusal(w: CardTrustWorld, author: string | null, card: Card, update?: CardUpdate): string | null {
  if (!card || typeof card !== 'object') return 'the message has no card';
  if (card.kind === 'attack' || card.kind === 'foe-attack') {
    if (!w.isGM(author)) return 'a Titan or Foe attack card comes from a GM';
  } else if (!w.isGM(author) && !w.owns(author, card.actor)) return 'the card’s author does not own its roller';
  if (!update || w.isGM(update.userId)) return null;
  if (!update.previous) return 'the GM holds no earlier copy of the card';
  if (card.kind !== 'action' || update.previous.kind !== 'action') return 'only a GM changes this card';
  return ownRewriteRefusal(update.previous, card);
}

const PUSH_FIELDS = ['cover', 'ops', 'dice', 'fresh', 'pushes', 'response'] as const;

function strip(c: ActionCard): Record<string, unknown> {
  const x: Record<string, unknown> = { ...c, pool: { ...c.pool, stress: 0 } };
  for (const k of PUSH_FIELDS) delete x[k];
  return x;
}

const face = (f: unknown) => Number.isInteger(f) && (f as number) >= 1 && (f as number) <= 6;

/**
 * What a roller may write over their own card (src/dice/card-actions.ts): a Push, a Cover, op
 * states, and a Stress Response rolled again. Nothing the result is worked out from changes except
 * by a Push that keeps every 6 and the Gear Dice.
 */
export function ownRewriteRefusal(prev: ActionCard, next: ActionCard): string | null {
  if (stable(strip(prev)) !== stable(strip(next))) return 'the card changed beyond a Push, Cover and op state';
  const d = next.dice;
  if (!d || !Array.isArray(d.base) || !Array.isArray(d.stress) || !Array.isArray(d.gear)) return 'malformed dice';
  if (next.pushes === prev.pushes) return stable(prev.dice) === stable(d) ? null : 'the dice changed without a Push';
  if (next.pushes !== prev.pushes + 1) return 'a Push adds one';
  if (pushBlock({ dice: prev.dice, pushes: prev.pushes, maxPushes: prev.maxPushes, pushAllowed: prev.pushAllowed, down: false })) return 'the roll could not be Pushed';
  if (stable(prev.dice.gear) !== stable(d.gear)) return 'a Push never changes Gear Dice';
  const added = prev.cover ? 0 : 1;
  if (d.base.length !== prev.dice.base.length || d.stress.length !== prev.dice.stress.length + added) return 'a Push keeps the dice count';
  if (![...d.base, ...d.stress].every(face)) return 'malformed dice';
  const kept = (before: number[], after: number[]) => before.every((f, i) => f !== 6 || after[i] === 6);
  if (!kept(prev.dice.base, d.base) || !kept(prev.dice.stress, d.stress)) return 'a Push keeps every 6';
  return null;
}

// ---------------------------------------------------------------- the roll's requirements

/** What the GM reads about the Titan and the soldier for a strike's requirements. */
export interface StrikeFacts {
  parts: readonly BodyPart[];
  /** body_part_kinds[].strike_from by kind. */
  strikeFrom: Record<string, readonly string[]>;
  holdingReach: { before: readonly string[]; after: readonly string[] };
  clearTheHand: boolean;
  openingsBy: readonly string[];
  decoys: readonly string[];
  horseReady: boolean;
  pryLoose: boolean;
}

/** Why a strike, Break Attention, or Break Free card may not be applied now (a WOF.Tracker.block key), or null. */
export function strikeRefusal(snap: Snapshot, soldierId: string, entry: string, target: RollTarget, facts: StrikeFacts): string | null {
  if (snap.mode !== 'titan') return 'noTitan';
  const soldier = snap.soldiers.find((s) => s.id === soldierId);
  const titan = snap.titans.find((t) => t.key === target.titan);
  if (!soldier) return 'noPosition';
  if (!titan) return 'noTitan';
  const grabbed = grabbedIn(snap)(soldier.id);
  const ctx = { soldier, titan, grabbed, retreat: snap.retreat };
  switch (entry) {
    case 'nape-strike': {
      const why = napeStrikeBlock(ctx);
      if (why) return why;
      const n = target.openings ?? 0;
      return Number.isInteger(n) && n >= 0 && n <= spendableOpenings(facts.openingsBy, soldier.id) ? null : 'openings';
    }
    case 'body-part-strike':
      return bodyPartStrikeBlock({ ...ctx, parts: facts.parts, partId: target.part ?? '', strikeFrom: facts.strikeFrom, grab: titan.grab, holdingReach: facts.holdingReach, clearTheHand: facts.clearTheHand });
    case 'break-attention': {
      const decoy = (target.decoy ?? 'flare') as DecoyId;
      if (!facts.decoys.includes(decoy)) return 'pickDecoy';
      const eyesBroken = facts.parts.some((p) => p.kind === 'eyes' && p.state === 'broken');
      return breakAttentionBlock({ ...ctx, decoy, eyesBroken, cloakThrown: snap.cloaks.includes(soldier.id), horseReady: facts.horseReady });
    }
    case 'break-free': {
      if (titan.status !== 'focus') return 'corpse';
      const who = target.forSoldier ?? soldier.id;
      if (who === soldier.id) return breakFreeBlock(soldier, titan.grab);
      // Pry Loose: on a Grabbed comrade's behalf, from On Body relative to the holding Titan.
      if (!facts.pryLoose || grabbed || !soldier.alive || titan.grab?.soldier !== who) return 'notGrabbed';
      return soldier.positions[titan.label] === 'on-body' ? null : 'pryReach';
    }
  }
  return 'noTitan';
}

// ---------------------------------------------------------------- the result on the message

/** A 53-bit hash of a result (cyrb53), kept on the engagement, which only a GM can write. */
export function resultDigest(result: unknown): string {
  const text = stable(result);
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/**
 * Whether the result a message carries is the one the GM wrote: `none` when the GM recorded none,
 * `tampered` when the message's result differs from the GM's record.
 */
export function resultTrust(result: unknown, recorded: string | undefined): 'trusted' | 'none' | 'tampered' {
  if (recorded === undefined) return result === undefined ? 'none' : 'tampered';
  return result !== undefined && resultDigest(result) === recorded ? 'trusted' : 'tampered';
}
