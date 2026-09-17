/**
 * Roll math as pure functions (core-plan 2d; data/core/dice-pool.yaml, stress-changes.yaml,
 * circumstances.yaml; data/mind/stress-responses.yaml and fear-rolls.yaml; data/gear/items.yaml
 * wear; data/gear/odm-gear.yaml gas_roll; data/harm/death-rolls.yaml; ADR-0004, ADR-0019,
 * ADR-0026). No Foundry globals, so every rule here is unit tested in node.
 */
import { previewPool, type PoolInputs, type PoolPreview } from './pool.ts';

export type DieKind = 'base' | 'gear' | 'stress' | 'titan';

/** The faces a roll card holds, by die kind, in the order they were rolled. */
export interface DiceFaces {
  base: number[];
  gear: number[];
  stress: number[];
}

/**
 * Rule Talents the roll code applies, with the Action Catalog entries each must name. The build
 * fails if data/character/talents.yaml stops naming them (tools/config-data.ts).
 */
export const ROLL_TALENTS = {
  'iron-nerve': ['stress-response-roll'],
  'steady-heart': ['fear-roll'],
  'blade-discipline': ['nape-strike', 'body-part-strike', 'break-free', 'block', 'fight'],
  'well-kept-rig': ['dodge', 'fly', 'break-attention'],
  'sure-seat': ['dodge', 'ride', 'break-attention'],
  gunsmith: ['shoot'],
  'light-trigger': ['gas-roll'],
  'sure-hands': ['treat-injury'],
  'stay-with-the-column': ['endure'],
  'hunters-eye': ['read'],
  'loose-the-horse': ['break-attention'],
  'make-do': ['field-repair'],
  'gallows-humour': ['stress-response-roll'],
} as const satisfies Record<string, readonly string[]>;

export type RollTalentId = keyof typeof ROLL_TALENTS;

/** Which wear-ignoring Talent covers a gear item (data/character/talents.yaml). */
export const WEAR_TALENTS: Record<string, RollTalentId> = {
  'blade-set': 'blade-discipline',
  'odm-gear': 'well-kept-rig',
  horse: 'sure-seat',
  'flintlock-pistol': 'gunsmith',
  musket: 'gunsmith',
};

/**
 * The success count an entry's needs names, when it names one plainly ("1; ...", "2, with ...",
 * "1 on a Leg roll", "1 (Chapter 3 ...)"). Needs that depend on the fight ("the struck Titan's
 * Nape Depth", "1 for the soldier holding ...") give null: the roller or the GM sets them.
 */
export function entryNeeds(needs: string | number | null | undefined): number | null {
  if (typeof needs === 'number') return needs;
  if (!needs) return null;
  const m = /^(\d+)(?=\s*(?:[;,(]|$|on\b))/.exec(needs.trim());
  return m ? Number(m[1]) : null;
}

// ---------------------------------------------------------------- successes

export function countFaces(faces: readonly number[], wanted: readonly number[]): number {
  return faces.filter((f) => wanted.includes(f)).length;
}

/** Successes before any Stress Response: every 6 on base, Gear, and Stress Dice. */
export function rawSuccesses(d: DiceFaces, successFaces: readonly number[] = [6]): number {
  return countFaces(d.base, successFaces) + countFaces(d.gear, successFaces) + countFaces(d.stress, successFaces);
}

export interface ResponseEffect {
  type: string;
  amount?: number;
}

/** Successes after the Stress Response's own effects (Flinch, Seized Up, Everything Slips). */
export function finalSuccesses(raw: number, effects: readonly ResponseEffect[] = []): number {
  if (effects.some((e) => e.type === 'zero-successes')) return 0;
  const lost = effects.filter((e) => e.type === 'lose-successes').reduce((n, e) => n + (e.amount ?? 1), 0);
  return Math.max(0, raw - lost);
}

/** Titan Dice: 5 and 6 succeed (data/engagement/titan-format.yaml, titan_dice). */
export function titanSuccesses(faces: readonly number[], successFaces: readonly number[] = [5, 6]): number {
  return countFaces(faces, successFaces);
}

/** ADR-0019: each Reaction success cancels one; the card lands on 1 or more net; the rider is 1 per net beyond the first. */
export function attackResult(severity: number, reaction: number | null) {
  const net = Math.max(0, severity - Math.max(0, reaction ?? 0));
  return { whiff: severity <= 0, net, lands: severity > 0 && net >= 1, rider: Math.max(0, net - 1) };
}

// ---------------------------------------------------------------- the pool at roll time

export interface Circumstance {
  id: string;
  name: string;
  dice: number;
  kind: 'bonus' | 'none' | 'penalty';
}

/**
 * The pool rolled: the preview pool plus the roll's Circumstances. A plus step is the circumstances
 * Bonus Dice source (capped with every other source at the Bonus Dice cap); a minus step is one dice
 * penalty, applied after the cap, removing base dice only, never below the floor
 * (data/core/circumstances.yaml, bonus_step and penalty_step).
 */
export function buildRollPool(i: PoolInputs, step: Circumstance | null): PoolPreview {
  const plus = step?.kind === 'bonus' ? step.dice : 0;
  const minus = step?.kind === 'penalty' ? -step.dice : 0;
  const penalties = minus > 0 ? [...i.penalties, { source: step!.name, dice: minus, entries: 'all' as const }] : i.penalties;
  return previewPool({ ...i, bonus: (i.bonus ?? 0) + plus, penalties });
}

// ---------------------------------------------------------------- Push

export type PushBlock = 'not-allowed' | 'down' | 'stress-one' | 'already-pushed' | 'nothing' | null;

export interface PushState {
  dice: DiceFaces;
  pushes: number;
  /** 1, or 2 with Sure Hands or Stay with the Column. */
  maxPushes: number;
  /** false when the roll's exception row or its own rule forbids a Push. */
  pushAllowed: boolean;
  /** Down forbids a Push (data/harm/down.yaml, forbids). */
  down: boolean;
}

/** The dice a Push picks up: base and Stress Dice not showing 6 (dice-pool.yaml, die_types). */
export function rerollCounts(d: DiceFaces): { base: number; stress: number } {
  return { base: d.base.filter((f) => f !== 6).length, stress: d.stress.filter((f) => f !== 6).length };
}

/** The dice a Push rolls, and so the only dice Dice So Nice shows for it: the non-6 base and Stress Dice, plus the new Stress Die unless Covered. */
export function pushRollCounts(d: DiceFaces, covered: boolean): { base: number; stress: number } {
  const r = rerollCounts(d);
  return { base: r.base, stress: r.stress + (covered ? 0 : 1) };
}

/** Why a roll cannot be Pushed now, or null (ADR-0004 order: a Stress Die 1 forbids it). */
export function pushBlock(s: PushState): PushBlock {
  if (!s.pushAllowed) return 'not-allowed';
  if (s.down) return 'down';
  if (s.dice.stress.includes(1)) return 'stress-one';
  if (s.pushes >= s.maxPushes) return 'already-pushed';
  const r = rerollCounts(s.dice);
  if (r.base + r.stress === 0) return 'nothing';
  return null;
}

/**
 * Applies a Push: the re-rolled faces replace base and Stress Dice not showing 6, in order, and a
 * new Stress Die (unless Covered) is the last of the rolled Stress faces. Gear Dice never change.
 */
export function applyPush(d: DiceFaces, rolled: { base: number[]; stress: number[] }, addStressDie: boolean): { dice: DiceFaces; fresh: number } {
  const need = rerollCounts(d);
  if (rolled.base.length !== need.base || rolled.stress.length !== need.stress + (addStressDie ? 1 : 0)) {
    throw new Error(`applyPush: expected ${need.base} base and ${need.stress + (addStressDie ? 1 : 0)} Stress faces`);
  }
  let bi = 0;
  let si = 0;
  const base = d.base.map((f) => (f === 6 ? 6 : rolled.base[bi++]));
  const stress = d.stress.map((f) => (f === 6 ? 6 : rolled.stress[si++]));
  if (addStressDie) stress.push(rolled.stress[si++]);
  return { dice: { base, stress, gear: [...d.gear] }, fresh: addStressDie ? stress.length - 1 : -1 };
}

/** The Stress a Push costs the pusher: 1, plus a held push-stress effect (Wound Tight); nothing when Covered. */
export function pushStress(covered: boolean, heldEffects: readonly ResponseEffect[] = []): number {
  if (covered) return 0;
  return 1 + heldEffects.filter((e) => e.type === 'push-stress').reduce((n, e) => n + (e.amount ?? 1), 0);
}

// ---------------------------------------------------------------- tables

export interface RangeRow {
  id: string;
  min: number | null;
  max: number | null;
}

export function inRange(row: { min: number | null; max: number | null }, n: number): boolean {
  return (row.min === null || n >= row.min) && (row.max === null || n <= row.max);
}

export function tableRow<R extends RangeRow>(rows: readonly R[], total: number): R {
  const row = rows.find((r) => inRange(r, total));
  if (!row) throw new Error(`no table row for ${total}`);
  return row;
}

/** D6 + Stress - Resolve (stress-responses.yaml and fear-rolls.yaml, roll.total). */
export function tableTotal(d6: number, stress: number, resolve: number, resolveBonus = 0): number {
  return d6 + stress - (resolve + resolveBonus);
}

/**
 * The Stress Response row: the row for the total, moved down the table past lasting rows the
 * soldier already holds (stress-responses.yaml, result_rules, already_held).
 */
export function responseRow<R extends RangeRow & { lasting: boolean }>(rows: readonly R[], total: number, held: readonly string[]): R {
  let i = rows.indexOf(tableRow(rows, total));
  while (rows[i].lasting && held.includes(rows[i].id) && i < rows.length - 1) i++;
  return rows[i];
}

/** Whether a Stress Response is due: any Stress Die showing 1, once per roll (ADR-0004). */
export function responseDue(d: DiceFaces, alreadyRolled: boolean, rollHasResponses = true): boolean {
  return rollHasResponses && !alreadyRolled && d.stress.includes(1);
}

export function deathOutcome<R extends { id: string; min: number | null; max: number | null }>(rows: readonly R[], successes: number): R {
  return tableRow(rows, successes);
}

// ---------------------------------------------------------------- wear and gas

/** Wear points: each Gear Die showing 1 once the roll was Pushed (data/gear/items.yaml, wear). */
export function wearPoints(gear: readonly number[], pushed: boolean): number {
  return pushed ? countFaces(gear, [1]) : 0;
}

export interface WearResult {
  points: number;
  ignored: number;
  left: number;
  /** The current rating after wear (rated items); unchanged for a Blade Set. */
  after: number;
  /** A Blade Set with any wear left is ruined and discarded (data/gear/blade-sets.yaml, wear). */
  ruined: boolean;
}

export function wearOutcome(itemId: string, current: number, points: number, ignore: number): WearResult {
  const ignored = Math.min(points, Math.max(0, ignore));
  const left = points - ignored;
  if (itemId === 'blade-set') return { points, ignored, left, after: current, ruined: left > 0 };
  return { points, ignored, left, after: Math.max(0, current - left), ruined: false };
}

export interface GasDiceInputs {
  standard: number;
  pushed: number;
  maximum: number;
  squadmateDice: number;
  squadmate: boolean;
  pushedOdmThisRound: boolean;
  lightTrigger: boolean;
}

/** The Gas Roll's dice (odm-gear.yaml, gas_roll.dice; Light Trigger makes a three-die roll two). */
export function gasRollDice(i: GasDiceInputs): { dice: number; lightTriggerUsed: boolean } {
  if (i.squadmate) return { dice: i.squadmateDice, lightTriggerUsed: false };
  if (!i.pushedOdmThisRound) return { dice: i.standard, lightTriggerUsed: false };
  if (i.lightTrigger) return { dice: i.standard, lightTriggerUsed: true };
  return { dice: Math.min(i.pushed, i.maximum), lightTriggerUsed: false };
}

/** Gas lost: one per die showing 1, never below 0 (odm-gear.yaml, gas_roll.reading and effect). */
export function gasAfter(current: number, faces: readonly number[]): { lost: number; after: number } {
  const lost = countFaces(faces, [1]);
  return { lost, after: Math.max(0, current - lost) };
}

// ---------------------------------------------------------------- applied changes and Undo

/** The auto-apply categories a GM can switch off (ADR-0026). */
export const APPLY_CATEGORIES = ['stress', 'wear', 'stressResponse', 'gas', 'fear'] as const;
export type ApplyCategory = (typeof APPLY_CATEGORIES)[number];

export type OpState = 'done' | 'undone' | 'pending';

interface OpBase {
  cat: ApplyCategory;
  /** The actor's uuid. */
  actor: string;
  label: string;
  state: OpState;
  /** An op tied to the roll's result: a Push reverts it and works it out again. */
  outcome?: boolean;
  /** An op a Stress Response caused: a second D6 (Gallows Humour) replaces it. */
  response?: boolean;
}

/** A number moved by a delta, clamped: Stress, Gas Rating, a gear item's current rating, a next-roll penalty. */
export interface NumOp extends OpBase {
  t: 'num';
  item: string | null;
  path: string;
  from: number;
  to: number;
  min: number;
  max: number | null;
}

/** A value set outright: a Talent's used mark, a flag. */
export interface SetOp extends OpBase {
  t: 'set';
  item: string | null;
  path: string;
  from: unknown;
  to: unknown;
}

/** A row appended to an actor array: a lasting Stress Response, a pending Fear result. */
export interface AddOp extends OpBase {
  t: 'add';
  path: string;
  value: Record<string, unknown>;
}

/** An embedded item removed (a ruined Blade Set); Undo creates it again with its id. */
export interface DeleteOp extends OpBase {
  t: 'delete';
  item: string;
  data: Record<string, unknown>;
}

export type Op = NumOp | SetOp | AddOp | DeleteOp;

const clamp = (n: number, min: number, max: number | null) => Math.max(min, max === null ? n : Math.min(max, n));

/**
 * The value a number op leaves, applied (dir 1) or undone (dir -1), from whatever the value is now.
 * Deltas keep later changes made by other cards. A stored value below the floor counts as the floor
 * (Stress below minimum Stress counts as minimum Stress: data/core/stress-changes.yaml, minimum).
 */
export function numValue(op: Pick<NumOp, 'from' | 'to' | 'min' | 'max'>, current: number, dir: 1 | -1): number {
  return clamp(Math.max(current, op.min) + dir * (op.to - op.from), op.min, op.max);
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** An actor array after an add op is applied, or undone (the last equal row removed). */
export function listValue<T>(op: Pick<AddOp, 'value'>, list: readonly T[], dir: 1 | -1): T[] {
  if (dir === 1) return [...list, op.value as T];
  const i = list.map((x) => same(x, op.value)).lastIndexOf(true);
  return i < 0 ? [...list] : [...list.slice(0, i), ...list.slice(i + 1)];
}

/** The state each op takes on a card action: Undo, Redo, or Apply (pending ones). */
export function nextStates(ops: readonly Op[], action: 'undo' | 'redo' | 'apply'): { index: number; dir: 1 | -1 }[] {
  const out: { index: number; dir: 1 | -1 }[] = [];
  ops.forEach((op, index) => {
    if (action === 'undo' && op.state === 'done') out.push({ index, dir: -1 });
    if (action === 'redo' && op.state === 'undone') out.push({ index, dir: 1 });
    if (action === 'apply' && op.state === 'pending') out.push({ index, dir: 1 });
  });
  // Undo walks back in reverse order.
  return action === 'undo' ? out.reverse() : out;
}

/** The card's Undo button reads this: Undo if anything is applied, Redo if everything applied was undone. */
export function undoButton(ops: readonly Op[]): 'undo' | 'redo' | null {
  if (ops.some((o) => o.state === 'done')) return 'undo';
  if (ops.some((o) => o.state === 'undone')) return 'redo';
  return null;
}

/** A new op's first state: applied now, or waiting for a click when the GM switched its category off. */
export function initialState(cat: ApplyCategory, enabled: Readonly<Record<ApplyCategory, boolean>>): OpState {
  return enabled[cat] ? 'done' : 'pending';
}
