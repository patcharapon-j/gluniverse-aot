/**
 * Dice Tray rules: rolling a pool, Pushing it, and reading the result
 * (Chapter 1, sections 1.4 to 1.6; data/core/dice-pool.yaml).
 *
 * Pure and renderer-free. Die values come in from outside, either from a
 * random source or from the faces a physics throw settled on, so the 3D tray
 * and the 2D fallback share exactly the same logic.
 */
import { isSuccess, type DieKind } from './dice';

export type { DieKind };

export interface Pool {
  base: number;
  gear: number;
  stress: number;
  titan: number;
}

/** What the last step did to a die. */
export type DieStatus =
  | 'rolled' // thrown in the first roll
  | 'kept' // a base or Stress Die showing 6, left in place by a Push
  | 'rerolled' // picked up and thrown again by a Push
  | 'new' // the Stress Die a Push added
  | 'locked' // a Gear Die showing 1, never re-rolled by a Push
  | 'held'; // a Titan Die, never Pushed

export interface Die {
  id: number;
  kind: DieKind;
  value: number;
  status: DieStatus;
}

export interface RollState {
  dice: Die[];
  /** False when the roll's own rule forbids a Push. */
  pushable: boolean;
  /** Pushes this roll may take: 1, unless a Talent allows more. */
  pushesAllowed: number;
  pushes: number;
  coveredPushes: number;
  /** At most one Stress Response per roll, however many Stress Dice show 1. */
  stressResponse: boolean;
}

export interface RollOptions {
  pushable?: boolean;
  pushesAllowed?: number;
}

export type Rng = () => number;
/** Die values in the order the dice are listed, or a random source. */
export type Values = readonly number[] | Rng;

export const POOL_LIMITS: Readonly<Record<DieKind, { min: number; max: number }>> = {
  base: { min: 0, max: 12 },
  gear: { min: 0, max: 3 },
  stress: { min: 0, max: 10 },
  titan: { min: 0, max: 12 },
};
export const PUSH_LIMITS = { min: 1, max: 5 } as const;

const KINDS: readonly DieKind[] = ['base', 'gear', 'stress', 'titan'];

const clampInt = (n: unknown, min: number, max: number): number => {
  const v = typeof n === 'number' ? n : Number.parseInt(String(n ?? ''), 10);
  return Number.isFinite(v) ? Math.min(max, Math.max(min, Math.trunc(v))) : min;
};

export function clampPool(pool: Partial<Record<DieKind, unknown>> | null | undefined): Pool {
  const p = pool ?? {};
  return {
    base: clampInt(p.base, POOL_LIMITS.base.min, POOL_LIMITS.base.max),
    gear: clampInt(p.gear, POOL_LIMITS.gear.min, POOL_LIMITS.gear.max),
    stress: clampInt(p.stress, POOL_LIMITS.stress.min, POOL_LIMITS.stress.max),
    titan: clampInt(p.titan, POOL_LIMITS.titan.min, POOL_LIMITS.titan.max),
  };
}

export const clampPushes = (n: unknown): number => clampInt(n, PUSH_LIMITS.min, PUSH_LIMITS.max);

export const poolSize = (pool: Pool): number => pool.base + pool.gear + pool.stress + pool.titan;

export const d6 = (rng: Rng = Math.random): number => 1 + Math.min(5, Math.floor(rng() * 6));

function takeValues(values: Values, count: number): number[] {
  if (typeof values === 'function') return Array.from({ length: count }, () => d6(values));
  if (values.length !== count) throw new Error(`Expected ${count} die values, got ${values.length}`);
  return values.map((v) => {
    if (!Number.isInteger(v) || v < 1 || v > 6) throw new Error(`Die value ${v} is not 1 to 6`);
    return v;
  });
}

const showsStressOne = (dice: readonly Die[]): boolean => dice.some((d) => d.kind === 'stress' && d.value === 1);

/** The dice a pool throws, in build order: base, Gear, Stress, then Titan Dice. */
export function poolKinds(pool: Pool): DieKind[] {
  return KINDS.flatMap((kind) => Array.from({ length: pool[kind] }, () => kind));
}

/** The first roll. `values` follows the order of `poolKinds(pool)`. */
export function startRoll(pool: Pool, values: Values, options: RollOptions = {}): RollState {
  const kinds = poolKinds(pool);
  const rolled = takeValues(values, kinds.length);
  const dice = kinds.map((kind, id): Die => ({ id, kind, value: rolled[id]!, status: 'rolled' }));
  return {
    dice,
    pushable: options.pushable ?? true,
    pushesAllowed: clampPushes(options.pushesAllowed ?? 1),
    pushes: 0,
    coveredPushes: 0,
    stressResponse: showsStressOne(dice),
  };
}

/**
  * Dice a Push picks up: base and Stress Dice not showing 6, and Gear Dice showing 2 to 5
  * (data/core/dice-pool.yaml, die_types; decision batch 11). A Gear Die showing 1 is locked.
  */
export const rerollableDice = (state: RollState): Die[] =>
  state.dice.filter((d) =>
    d.kind === 'gear' ? d.value !== 1 && d.value !== 6 : (d.kind === 'base' || d.kind === 'stress') && d.value !== 6,
  );

export type PushBlock = 'forbidden' | 'titan-only' | 'stress-one' | 'limit' | 'cover-nothing';
export type PushCheck = { allowed: true } | { allowed: false; code: PushBlock; reason: string };

const times = (n: number) => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`);

/** Whether the roll can be Pushed now, and why not. `covered` asks about a Covered Push. */
export function checkPush(state: RollState, { covered = false }: { covered?: boolean } = {}): PushCheck {
  if (!state.pushable) return { allowed: false, code: 'forbidden', reason: "This roll's rule forbids a Push." };
  if (state.dice.every((d) => d.kind === 'titan'))
    return { allowed: false, code: 'titan-only', reason: 'Titan Dice are never Pushed.' };
  if (state.stressResponse || showsStressOne(state.dice))
    return { allowed: false, code: 'stress-one', reason: 'A Stress Die shows a 1, so this roll cannot be Pushed.' };
  if (state.pushes >= state.pushesAllowed)
    return {
      allowed: false,
      code: 'limit',
      reason: `Already Pushed ${times(state.pushes)}, the most this roll allows.`,
    };
  if (covered && rerollableDice(state).length === 0)
    return {
      allowed: false,
      code: 'cover-nothing',
      reason: 'Every die a Push would pick up already shows 6, so this Push cannot be Covered.',
    };
  return { allowed: true };
}

export interface PushPlan {
  covered: boolean;
  /** Ids of existing dice to throw again. */
  rerollIds: number[];
  /** Id of the Stress Die the Push adds, or null when the Push is Covered. */
  newDieId: number | null;
}

/** What a Push throws. Throws if the Push is not allowed. */
export function planPush(state: RollState, { covered = false }: { covered?: boolean } = {}): PushPlan {
  const check = checkPush(state, { covered });
  if (!check.allowed) throw new Error(check.reason);
  return {
    covered,
    rerollIds: rerollableDice(state).map((d) => d.id),
    newDieId: covered ? null : state.dice.length,
  };
}

/** Dice a plan throws, in the order `applyPush` expects values: re-rolled dice, then the new die. */
export const planSize = (plan: PushPlan): number => plan.rerollIds.length + (plan.newDieId === null ? 0 : 1);

/** Applies a Push. `values` follows `plan.rerollIds`, then the new Stress Die if any. */
export function applyPush(state: RollState, plan: PushPlan, values: Values): RollState {
  const thrown = takeValues(values, planSize(plan));
  const byId = new Map(plan.rerollIds.map((id, i) => [id, thrown[i]!]));
  const dice = state.dice.map((d): Die => {
    const value = byId.get(d.id);
    if (value !== undefined) return { ...d, value, status: 'rerolled' };
    const status: DieStatus = d.kind === 'gear' && d.value === 1 ? 'locked' : d.kind === 'titan' ? 'held' : 'kept';
    return { ...d, status };
  });
  if (plan.newDieId !== null) dice.push({ id: plan.newDieId, kind: 'stress', value: thrown[thrown.length - 1]!, status: 'new' });
  return {
    ...state,
    dice,
    pushes: state.pushes + 1,
    coveredPushes: state.coveredPushes + (plan.covered ? 1 : 0),
    stressResponse: state.stressResponse || showsStressOne(dice),
  };
}

/** Plans and applies a Push in one step, with random values. */
export function push(state: RollState, options: { covered?: boolean } = {}, rng: Rng = Math.random): RollState {
  const plan = planPush(state, options);
  return applyPush(state, plan, rng);
}

export interface RollSummary {
  /** Successes on base, Gear, and Stress Dice (each 6). */
  successes: number;
  /** Successes on Titan Dice (each 5 or 6). */
  titanSuccesses: number;
  hasSoldierDice: boolean;
  hasTitanDice: boolean;
  stressResponse: boolean;
  pushes: number;
  /** Wear on the gear item: 1 point if the roll was Pushed and any Gear Die shows 1. */
  gearWear: number;
  /** Stress the rolling soldier gained from Pushes. */
  stressAdded: number;
  /** Stress a Covering comrade gained. */
  coverStress: number;
}

export function summarize(state: RollState): RollSummary {
  const soldier = state.dice.filter((d) => d.kind !== 'titan');
  const titan = state.dice.filter((d) => d.kind === 'titan');
  return {
    successes: soldier.filter((d) => isSuccess(d.kind, d.value)).length,
    titanSuccesses: titan.filter((d) => isSuccess(d.kind, d.value)).length,
    hasSoldierDice: soldier.length > 0,
    hasTitanDice: titan.length > 0,
    stressResponse: state.stressResponse,
    pushes: state.pushes,
    gearWear: state.pushes > 0 && state.dice.some((d) => d.kind === 'gear' && d.value === 1) ? 1 : 0,
    stressAdded: state.pushes - state.coveredPushes,
    coverStress: state.coveredPushes,
  };
}
