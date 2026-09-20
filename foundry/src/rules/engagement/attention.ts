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

/**
 * evaluation.steps, loudest-matches (flags, loudest, matches; decision batch 10, OQ-184): while a
 * soldier holds the loudest flag they count, for this Titan's ladder, as meeting every rung any
 * other candidate meets except hooked-into-its-body, which is the room ADR-0010 leaves. They are
 * kept whatever Position they hold, so a soldier who came in loud from Distant stays in the set; a
 * Down or carried candidate is kept only where that rung's down_can_meet allows it. It adds no one
 * where no candidate meets the rung.
 */
function loudAlso(rung: string, set: readonly SoldierState[], met: readonly SoldierState[], inp: LadderInput, pool: readonly SoldierState[]): SoldierState[] {
  if (rung === 'hooked-into-its-body') return [...met];
  const anyone = met.length > 0 || (rung !== 'nearest' && pool.some((s) => test(rung, s, inp, pool)));
  if (!anyone) return [...met];
  const has = new Set(met.map((s) => s.id));
  const extra = set.filter((s) => !has.has(s.id) && inp.titan.flags.loud.includes(s.id) && (inp.downCanMeet[rung] || !(s.down || s.carriedBy)));
  return extra.length ? [...met, ...extra] : [...met];
}

function meeting(rung: string, set: readonly SoldierState[], inp: LadderInput, pool: readonly SoldierState[]): SoldierState[] {
  const met = rung === 'nearest' ? (set.length ? closest(set, inp.titan.label) : []) : set.filter((s) => test(rung, s, inp, pool));
  return loudAlso(rung, set, met, inp, pool);
}

/** evaluation.steps: top, loudest-matches, struck-first, narrow, holder, card, none. */
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
 * its fallback when the holder does not meet the requirement. Since decision batch 13 (13-9) the
 * card retargets first: call retargetForEntry and pass the Position of the soldier it returns, so
 * the fallback is reached only where no candidate meets the rolled entry's requirement at all. The
 * fallback is then tested the same way (completed after round 3 review 1, M1): Thrash if it is
 * thrash, is the previous behavior, or the Titan lacks its Body Parts; otherwise, if the holder does
 * not meet the fallback's own position_requirement, `retarget` is asked whether any candidate does
 * (the same Attention Ladder evaluation, over the narrowed set) — Thrash only when nobody meets that
 * either. `retarget` is optional so this stays testable without a Ladder context; omitting it when a
 * fallback needs one is the same as no candidate qualifying.
 */
export function chooseEntry(
  entries: readonly EntryLike[],
  next: string,
  previous: string,
  parts: readonly BodyPart[],
  holderPosition: Position,
  retarget?: (entry: EntryLike) => Position | null,
): EntryLike {
  const thrash = entries.find((e) => e.tier === 'thrash')!;
  const e = entries.find((x) => x.id === next);
  if (!e || !meetsBodyParts(e, parts)) return thrash;
  if (e.position_requirement.includes(holderPosition)) return e;
  if (e.fallback === 'thrash' || e.fallback === 'none') return thrash;
  const f = entries.find((x) => x.id === e.fallback);
  if (!f || f.id === previous || !meetsBodyParts(f, parts)) return thrash;
  if (f.position_requirement.includes(holderPosition)) return f;
  if (retarget && retarget(f) !== null) return f;
  return thrash;
}

/**
 * Everything the Attention Ladder is evaluated with. Retargeting reads the same context the choose
 * step already built, so it re-runs the Ladder rather than inventing a second selection rule.
 */
export type LadderContext = LadderInput;

/** What retargeting reads off a Behavior Table entry (titan-format.yaml, entry_fields). */
export interface RetargetEntry {
  position_requirement?: readonly string[];
}

/**
 * Retargeting (round 3, decision 12, part 1; behavior-procedure.yaml, choose): a Focus Titan whose
 * Attention holder does not meet the rolled entry's position_requirement turns on whoever it can
 * reach. The holder is returned unchanged when they already meet the requirement; otherwise the
 * Attention Ladder is evaluated again over only those soldiers who do meet it, with its own rungs
 * and tie-breaks, and the soldier it picks is returned. Null when nobody qualifies (the behavior is
 * then Thrash) or when the restricted Ladder ties with nothing left to break it. An entry with no
 * requirement at all is reachable from anywhere, so the holder keeps it. Pure.
 */
export function retargetForEntry(ctx: LadderContext, entry: RetargetEntry, holder: string | null): string | null {
  const need = entry.position_requirement;
  if (!need || need.length === 0) return holder;
  const label = ctx.titan.label;
  const meets = (s: SoldierState) => need.includes(s.positions[label]);
  const held = holder ? ctx.soldiers.find((s) => s.id === holder) : undefined;
  if (held && meets(held)) return holder;
  const able = ctx.soldiers.filter(meets);
  if (!able.length) return null;
  return evaluateLadder({ ...ctx, soldiers: able }).holder;
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
