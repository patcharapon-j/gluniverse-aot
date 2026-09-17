/**
 * Harm and gear helpers the sheet applies (pure, unit tested). Sources:
 * data/harm/critical-injuries.yaml (gaining, type-rider and record steps; sides) and
 * data/gear/odm-gear.yaml (change_canister).
 */

import type { HealthBox } from './derived.ts';

export type InjuryType = 'crush' | 'bite' | 'burn' | 'cut' | 'pierce';
export type Side = 'left' | 'right';

export interface InjuryRowData {
  lethal: boolean;
  time_limit: 'turn' | 'engagement' | 'day' | null;
  healing_days: number;
}

export interface TypeRider {
  injury_type: InjuryType;
  rider: {
    rows?: string[];
    all_rows?: boolean;
    lethal_rows?: boolean;
    sets?: { time_limit?: 'turn' | 'engagement' | 'day'; healing_days_multiplier?: number; heals_untreated?: boolean };
    treat_injury?: unknown;
  };
}

/** The riders a table's type_riders pick for this row and Injury Type (by rows, all_rows, or lethal_rows). */
export function ridersFor(rowId: string, row: InjuryRowData, type: InjuryType, riders: readonly TypeRider[]): TypeRider['rider'][] {
  return riders
    .filter((r) => r.injury_type === type)
    .map((r) => r.rider)
    .filter((r) => r.all_rows || (r.lethal_rows && row.lethal) || (r.rows ?? []).includes(rowId));
}

/**
 * The held state recorded when a Critical Injury row is gained with its Injury Type and side
 * (the type-rider and record steps): a rider's time_limit replaces the row's, a
 * healing_days_multiplier multiplies healing_days. Torso and head take no side.
 */
export function gainedInjuryState(opts: {
  rowId: string;
  location: string;
  row: InjuryRowData;
  riders: readonly TypeRider[];
  type: InjuryType;
  side: Side | null;
  sidedLocations: readonly string[];
}) {
  const picked = ridersFor(opts.rowId, opts.row, opts.type, opts.riders);
  let timeLimit = opts.row.time_limit;
  let multiplier = 1;
  let healsUntreated = true;
  for (const r of picked) {
    if (r.sets?.time_limit) timeLimit = r.sets.time_limit;
    if (r.sets?.healing_days_multiplier) multiplier *= r.sets.healing_days_multiplier;
    if (r.sets?.heals_untreated === false) healsUntreated = false;
  }
  const sided = opts.sidedLocations.includes(opts.location);
  return {
    state: {
      injury_type: opts.type,
      side: sided ? (opts.side ?? 'left') : null,
      treated: false,
      time_limit: timeLimit,
      healing_days_left: Math.round(opts.row.healing_days * multiplier),
      halved: false,
    },
    healsUntreated,
  };
}

/** The total healing days a held injury started with, riders applied (for the day boxes). */
export function healingDaysTotal(rowId: string, row: InjuryRowData, type: InjuryType, riders: readonly TypeRider[]): number {
  const m = ridersFor(rowId, row, type, riders).reduce((n, r) => n * (r.sets?.healing_days_multiplier ?? 1), 1);
  return Math.round(row.healing_days * m);
}

/**
 * Change Canister: the chosen spare is fitted and its Gas Rating becomes the soldier's; the
 * canister it replaces becomes a spare if it still has gas, and is discarded at 0.
 */
export function changeCanister(gasRating: number, spares: readonly number[], index: number): { gas_rating: number; spare_canisters: number[] } | null {
  if (index < 0 || index >= spares.length) return null;
  const rest = spares.filter((_, i) => i !== index);
  if (gasRating > 0) rest.push(gasRating);
  return { gas_rating: spares[index], spare_canisters: rest };
}

/**
 * Health boxes clicked on the paper row: a clean box marks damage up to it, a damaged box clears
 * damage from it on. Crossed boxes belong to untreated Critical Injuries and do not change here.
 * Returns the new health_lost, never above the boxes left clean.
 */
export function healthLostAfterClick(boxIndex: number, healthRating: number, crossed: number, healthLost: number): number {
  const maxLost = healthRating - Math.min(crossed, healthRating);
  const lost = Math.min(Math.max(healthLost, 0), maxLost);
  if (boxIndex < crossed) return lost;
  const pos = boxIndex - crossed; // 0-based among the non-crossed boxes
  const next = pos < lost ? pos : pos + 1;
  return Math.min(Math.max(next, 0), maxLost);
}

/** One Health box as the sheet draws it, with the untreated Critical Injury that crosses it off. */
export interface HealthCell<T> {
  state: HealthBox;
  blocker: T | null;
}

/**
 * Pairs the Health row with the injuries that block it. Each untreated Critical Injury crosses off
 * one box, up to Health, in the order the injuries are held; the crossed boxes lead the row.
 */
export function healthCells<T extends { treated: boolean }>(boxes: readonly HealthBox[], injuries: readonly T[]): HealthCell<T>[] {
  const untreated = injuries.filter((w) => !w.treated);
  let n = 0;
  return boxes.map((state) => ({ state, blocker: state === 'crossed' ? (untreated[n++] ?? null) : null }));
}

/** Stress boxes clicked: filling box i sets Stress to i + 1; clicking the last filled box clears it. Never below the minimum. */
export function stressAfterClick(boxIndex: number, stress: number, minimum: number): number {
  const next = boxIndex === stress - 1 ? boxIndex : boxIndex + 1;
  return Math.max(minimum, next);
}
