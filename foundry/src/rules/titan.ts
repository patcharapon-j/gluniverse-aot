/**
 * Titan play state as pure functions (unit tested). Sources: data/engagement/titan-harm.yaml
 * (states, body_part_strikes, grounded, openings, regeneration), data/engagement/titan-format.yaml
 * (entry_fields, body_parts_used), data/engagement/behavior-procedure.yaml (next_behavior, roll),
 * and data/engagement/read.yaml (public_without_a_read, hidden_until_read).
 */

export type PartKind = 'eyes' | 'arm' | 'leg';
export type PartState = 'intact' | 'wounded' | 'broken';

/** titan-harm.yaml, states.order. */
export const PART_STATES: readonly PartState[] = ['intact', 'wounded', 'broken'];

export interface BodyPart {
  id: string;
  kind: PartKind;
  toughness: number;
  state: PartState;
  /** Successes toward the next state, 0 to toughness - 1 (states.count). */
  progress: number;
}

export interface BehaviorEntry {
  id: string;
  name: string;
  results: number[];
  tier: string;
  body_parts_used: string[];
}

const rank = (s: PartState) => PART_STATES.indexOf(s);

/** Sets a part's state; the count returns to 0 on every change (states.count, body_part_strikes). */
export function withState(part: BodyPart, state: PartState): BodyPart {
  return { ...part, state, progress: 0 };
}

/** The sheet's click: intact, wounded, broken, then back to intact. */
export function cycleState(part: BodyPart): BodyPart {
  return withState(part, PART_STATES[(rank(part.state) + 1) % PART_STATES.length]);
}

/** Sets the count, kept within 0 to Toughness - 1; a Broken part keeps 0. */
export function withProgress(part: BodyPart, progress: number): BodyPart {
  if (part.state === 'broken') return { ...part, progress: 0 };
  return { ...part, progress: Math.max(0, Math.min(part.toughness - 1, Math.round(progress))) };
}

/**
 * A Body Part strike's successes, taken one at a time (body_part_strikes, resolving): each adds 1 to
 * the count; at Toughness the part moves one state toward Broken and the count returns to 0; once it
 * is Broken each remaining success creates 1 Opening.
 */
export function strikeSuccesses(part: BodyPart, successes: number): { part: BodyPart; openings: number } {
  let p = { ...part };
  let openings = 0;
  for (let i = 0; i < successes; i++) {
    if (p.state === 'broken') {
      openings++;
      continue;
    }
    const count = p.progress + 1;
    p = count >= p.toughness ? withState(p, PART_STATES[rank(p.state) + 1]) : { ...p, progress: count };
  }
  return { part: p, openings };
}

/** grounded.when: at least one leg is Broken. */
export function isGrounded(parts: readonly BodyPart[]): boolean {
  return parts.some((p) => p.kind === 'leg' && p.state === 'broken');
}

/**
 * regeneration.when_full, step 3: the most damaged part (Broken before Wounded, ties to the one listed
 * first), or -1 when every part is Intact.
 */
export function mostDamaged(parts: readonly BodyPart[]): number {
  let best = -1;
  parts.forEach((p, i) => {
    if (rank(p.state) > 0 && (best < 0 || rank(p.state) > rank(parts[best].state))) best = i;
  });
  return best;
}

export interface RegenerationResult {
  parts: BodyPart[];
  /** Openings erased (step 1). */
  erased: number;
  /** The part moved one state toward Intact (step 3), if any. */
  healed: { id: string; from: PartState; to: PartState } | null;
  /** Step 4: soldiers On Body roll on the steam table. */
  steam: boolean;
  /** Step 4: a Broken leg healed and no leg is Broken now, so the Titan stands. */
  stands: boolean;
}

/** The five when_full steps, in order. The clock is emptied by the caller (step 5). */
export function regenerate(parts: readonly BodyPart[], openings: number): RegenerationResult {
  const counted = parts.map((p) => ({ ...p, progress: 0 }));
  const i = mostDamaged(counted);
  let healed: RegenerationResult['healed'] = null;
  let stands = false;
  if (i >= 0) {
    const before = counted[i];
    const to = PART_STATES[rank(before.state) - 1];
    const wasGrounded = isGrounded(counted);
    counted[i] = withState(before, to);
    healed = { id: before.id, from: before.state, to };
    stands = before.kind === 'leg' && before.state === 'broken' && wasGrounded && !isGrounded(counted);
  }
  return { parts: counted, erased: Math.max(0, openings), healed, steam: healed !== null, stands };
}

/**
 * One filled segment (regeneration, tick). When the clock is full the when_full steps apply and the
 * clock empties; `result` then says what they did.
 */
export function fillRegeneration(
  filled: number,
  clock: number,
  parts: readonly BodyPart[],
  openings: number,
): { filled: number; parts: BodyPart[]; openings: number; result: RegenerationResult | null } {
  const next = Math.min(clock, Math.max(0, filled) + 1);
  if (next < clock) return { filled: next, parts: [...parts], openings, result: null };
  const result = regenerate(parts, openings);
  return { filled: 0, parts: result.parts, openings: 0, result };
}

/**
 * entry_fields.body_parts_used: for each listed kind, the Titan has at least that many parts of the
 * kind that are not Broken (a kind listed twice needs two).
 */
export function meetsBodyParts(entry: Pick<BehaviorEntry, 'body_parts_used'>, parts: readonly BodyPart[]): boolean {
  const need = new Map<string, number>();
  for (const k of entry.body_parts_used) need.set(k, (need.get(k) ?? 0) + 1);
  for (const [kind, n] of need) {
    if (parts.filter((p) => p.kind === kind && p.state !== 'broken').length < n) return false;
  }
  return true;
}

/**
 * behavior-procedure.yaml, next_behavior.roll: the entry holding the D6 result, moved up (after 6
 * comes 1, skipping entries already checked) past any entry that is the previous behavior or whose
 * Body Parts the Titan lacks; Thrash when none can be rolled.
 */
export function nextBehaviorFor(entries: readonly BehaviorEntry[], parts: readonly BodyPart[], previous: string, d6: number): string {
  const thrash = entries.find((e) => e.tier === 'thrash')?.id ?? 'thrash';
  const checked = new Set<string>();
  for (let step = 0; step < 6; step++) {
    const result = ((d6 - 1 + step) % 6) + 1;
    const entry = entries.find((e) => e.results.includes(result));
    if (!entry || checked.has(entry.id)) continue;
    checked.add(entry.id);
    if (entry.id !== previous && meetsBodyParts(entry, parts)) return entry.id;
  }
  return thrash;
}

export interface TitanFacts {
  toughness: boolean;
  nape_depth: boolean;
  regeneration_clock: boolean;
  attention_ladder: boolean;
}

/**
 * Which stat block values a player may see (read.yaml): a standard Titan's are public; an Abnormal's
 * each wait for a Read (hidden_until_read, recorded as revealed flags).
 */
export function publicFacts(abnormal: boolean, revealed: TitanFacts): TitanFacts {
  if (!abnormal) return { toughness: true, nape_depth: true, regeneration_clock: true, attention_ladder: true };
  return { ...revealed };
}
