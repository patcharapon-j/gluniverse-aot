/**
 * Attention (data/engagement/attention.yaml; data/titans/index.yaml, ladders) and the choose step of
 * a Focus Titan's card (data/engagement/behavior-procedure.yaml, resolving_a_card). Pure and unit
 * tested; the GM never picks the holder (evaluation, gm_choices).
 */
import { meetsBodyParts, type BodyPart } from '../titan.ts';
import { tieCard } from './cards.ts';
import { entering, holdsAPosition } from './positions.ts';
import type { Position, Snapshot, SoldierState, TitanRow } from './types.ts';

/** tests.nearest: the order Positions count as close. */
const NEAREST_ORDER: readonly Position[] = ['on-body', 'in-reach', 'blind-spot', 'distant'];

export interface LadderInput {
  titan: TitanRow;
  soldiers: readonly SoldierState[];
  /** Which Focus Titan holds each Grabbed soldier (label), if any. */
  grabbedBy: (id: string) => string | null;
  /** tests[].down_can_meet by test id. */
  downCanMeet: Record<string, boolean>;
  /** The tie-break card of a soldier this round (a Wing counts as its player character's, after them), or null. */
  cardOf: (id: string) => number | null;
  /** False when no cards are dealt, or at an end step: cards then choose nothing. */
  useCards: boolean;
}

export interface LadderResult {
  holder: string | null;
  /** The highest rung met. */
  rung: string | null;
  tied: string[];
  /** Which evaluation step decided it. */
  by: 'none' | 'one' | 'holder' | 'card' | 'tie';
}

/** candidates: every living soldier who holds a Position relative to the Titan, not departed, not held by another Focus Titan. */
export function candidates(inp: Pick<LadderInput, 'titan' | 'soldiers' | 'grabbedBy'>): SoldierState[] {
  return inp.soldiers.filter((s) => {
    if (!s.alive || s.left) return false;
    if (s.positions[inp.titan.label] === undefined) return false;
    const by = inp.grabbedBy(s.id);
    return !by || by === inp.titan.label;
  });
}

function test(id: string, s: SoldierState, inp: LadderInput, pool: readonly SoldierState[]): boolean {
  const limited = s.down || !!s.carriedBy;
  if (limited && !inp.downCanMeet[id]) return false;
  const t = inp.titan;
  const p = s.positions[t.label];
  switch (id) {
    case 'hooked-into-its-body':
      return p === 'on-body' || t.flags.hooked.includes(s.id);
    case 'nearest-person-in-reach':
      return p === 'in-reach';
    case 'just-hurt-it':
      return t.flags.hurt.includes(s.id);
    case 'loudest-or-brightest':
      return t.flags.loud.includes(s.id);
    case 'current-holder':
      return t.holder === s.id && p !== 'distant';
    case 'mounted':
      return s.mounted;
    case 'airborne':
      return s.airborne;
    case 'carrying-a-comrade':
      return !!s.carrying;
    case 'most-harmed': {
      const most = Math.max(...pool.map((x) => x.untreated));
      return most > 0 && s.untreated === most;
    }
    case 'down':
      return s.down;
    default:
      throw new Error(`unknown Attention test "${id}"`);
  }
}

/** tests.nearest over a set: the soldiers at the closest Position any of them holds. */
function closest(set: readonly SoldierState[], label: string): SoldierState[] {
  const rank = (s: SoldierState) => NEAREST_ORDER.indexOf(s.positions[label]);
  const best = Math.min(...set.map(rank));
  return set.filter((s) => rank(s) === best);
}

function meeting(rung: string, set: readonly SoldierState[], inp: LadderInput, pool: readonly SoldierState[]): SoldierState[] {
  if (rung === 'nearest') return set.length ? closest(set, inp.titan.label) : [];
  return set.filter((s) => test(rung, s, inp, pool));
}

/** evaluation.steps: top, struck-first, narrow, holder, card, none. */
export function evaluateLadder(inp: LadderInput): LadderResult {
  const pool = candidates(inp);
  if (!pool.length) return { holder: null, rung: null, tied: [], by: 'none' };
  const rungs = inp.titan.ladder;
  let top = -1;
  let tied: SoldierState[] = [];
  for (let i = 0; i < rungs.length; i++) {
    const met = meeting(rungs[i], pool, inp, pool);
    if (met.length) {
      top = i;
      tied = met;
      break;
    }
  }
  if (top < 0) return { holder: null, rung: null, tied: [], by: 'none' };
  if (rungs[top] === 'hooked-into-its-body') {
    const struck = tied.filter((s) => inp.titan.flags.hooked.includes(s.id));
    if (struck.length) tied = struck;
  }
  for (const rung of rungs.slice(top + 1)) {
    const met = meeting(rung, tied, inp, pool);
    if (met.length) tied = met;
  }
  const ids = tied.map((s) => s.id);
  const result = (holder: string | null, by: LadderResult['by']): LadderResult => ({ holder, rung: rungs[top], tied: ids, by });
  if (ids.length === 1) return result(ids[0], 'one');
  if (inp.titan.holder && ids.includes(inp.titan.holder)) return result(inp.titan.holder, 'holder');
  if (inp.useCards) {
    const withCards = ids.map((id) => ({ id, card: inp.cardOf(id) })).filter((x) => x.card !== null) as { id: string; card: number }[];
    if (withCards.length) {
      withCards.sort((a, b) => a.card - b.card);
      if (withCards.length === 1 || withCards[0].card !== withCards[1].card) return result(withCards[0].id, 'card');
    }
  }
  return result(null, 'tie');
}

export interface EntryLike {
  id: string;
  tier: string;
  results: number[];
  body_parts_used: string[];
  position_requirement: string[];
  fallback: string;
  targets: string;
}

/**
 * resolving_a_card, choose: the Next Behavior's entry; Thrash when the Titan lacks its Body Parts;
 * its fallback when the holder does not meet the requirement; Thrash when that fallback is thrash,
 * is the previous behavior, or fails either test.
 */
export function chooseEntry(entries: readonly EntryLike[], next: string, previous: string, parts: readonly BodyPart[], holderPosition: Position): EntryLike {
  const thrash = entries.find((e) => e.tier === 'thrash')!;
  const e = entries.find((x) => x.id === next);
  if (!e || !meetsBodyParts(e, parts)) return thrash;
  if (e.position_requirement.includes(holderPosition)) return e;
  if (e.fallback === 'thrash' || e.fallback === 'none') return thrash;
  const f = entries.find((x) => x.id === e.fallback);
  if (!f || f.id === previous || !meetsBodyParts(f, parts) || !f.position_requirement.includes(holderPosition)) return thrash;
  return f;
}

/**
 * entry_fields.targets: the holder, or the holder and every other soldier who holds the same
 * Position relative to the Titan, except a Grabbed soldier.
 */
export function entryTargets(entry: Pick<EntryLike, 'targets'>, holder: string, titan: TitanRow, soldiers: readonly SoldierState[], grabbed: (id: string) => boolean): string[] {
  if (entry.targets !== 'holder-and-position') return [holder];
  const h = soldiers.find((s) => s.id === holder);
  const p = h?.positions[titan.label];
  const others = soldiers.filter((s) => s.id !== holder && s.alive && !s.left && p !== undefined && s.positions[titan.label] === p && !grabbed(s.id));
  return [holder, ...others.map((s) => s.id)];
}

/** Draw Attention's requirements (draw_attention), or null. */
export function drawAttentionBlock(s: SoldierState, titan: TitanRow, grabbed: boolean): string | null {
  if (titan.status !== 'focus') return 'corpse';
  const p = s.positions[titan.label];
  if (p === undefined || s.left) return 'noPosition';
  if (p === 'distant') return 'distant';
  if (grabbed) return 'grabbed';
  if (s.down) return 'down';
  return null;
}

/**
 * A Titan that enters as a Focus Titan evaluates its Attention Ladder at once (background-titans.yaml,
 * full_clock): every soldier who holds a Position holds distant relative to it, and only mid-round do
 * this round's cards break a tie (evaluation, card and none).
 */
export function enteringAttention(snap: Snapshot, titan: TitanRow, downCanMeet: Record<string, boolean>): LadderResult {
  const soldiers = snap.soldiers.map((s) => ({ ...s, positions: entering(s, titan.label, holdsAPosition(s, snap.titans)) }));
  const held = (id: string) => snap.titans.find((t) => t.status === 'focus' && t.grab?.soldier === id)?.label ?? null;
  return evaluateLadder({
    titan,
    soldiers,
    grabbedBy: held,
    downCanMeet,
    cardOf: (id) => tieCard(id, snap.cards, snap.wings),
    useCards: snap.step === 'play',
  });
}
