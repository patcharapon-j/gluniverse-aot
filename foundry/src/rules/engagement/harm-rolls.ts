/**
 * The fixed harm rolls the tracker makes itself: steam (data/engagement/titan-harm.yaml, steam), a
 * fall's band and damage (data/gear/falls.yaml, height and damage_table; data/engagement/positions.yaml,
 * falls_land), and damage on a soldier (data/harm/health.yaml, harm_kinds, damage). Pure and unit tested.
 */
import { isClose } from './positions.ts';
import type { Position, TitanRow } from './types.ts';
import { zoneDistance, zoneRules, type Attachment, type FieldState, type ZoneId } from './zones.ts';

export interface DamageRow {
  min: number | null;
  max: number | null;
  damage: number;
}

const inRow = (r: { min: number | null; max: number | null }, n: number) => (r.min === null || n >= r.min) && (r.max === null || n <= r.max);

/** The damage a table roll gives (a total below every row reads the first, above every row the last). */
export function tableDamage(rows: readonly DamageRow[], total: number): number {
  const row = rows.find((r) => inRow(r, total)) ?? (total < (rows[0].min ?? -Infinity) ? rows[0] : rows[rows.length - 1]);
  return row.damage;
}

/** Steam: D6 on the steam table (steam, roll). */
export const steamDamage = (rows: readonly DamageRow[], d6: number) => tableDamage(rows, d6);

/** Who a steam trigger names (steam, triggers): kill reads On Body and Blind Spot and the freed soldier; a Regeneration fill reads On Body. */
export function steamRollers(trigger: 'kill' | 'regeneration-fill', soldiers: readonly { id: string; alive: boolean; left: boolean; positions: Record<string, Position> }[], label: string, freed: string | null = null): string[] {
  return soldiers
    .filter((s) => s.alive && !s.left && (s.id === freed || (trigger === 'kill' ? isClose(s.positions[label]) : s.positions[label] === 'on-body')))
    .map((s) => s.id);
}

export type Band = 'low' | 'high' | 'extreme';

export interface FallInput {
  /** The Position held relative to the reference Titan when the soldier fell, or null outside one. */
  position: Position | null;
  /** The rating of the zone the soldier falls in (the Giant Forest raise, 16-22). */
  anchor: string | null;
  referenceSize: string | null;
  fromHorse?: boolean;
  /** A band another rule names. */
  named?: Band | null;
}

/** The fall's band (falls.yaml, height, steps). */
export function fallBand(x: FallInput): Band {
  if (x.named) return x.named;
  if (x.fromHorse) return 'low';
  if (!x.position) return 'low';
  const base: Band = isClose(x.position) ? 'high' : 'low';
  const raise = (!!x.anchor && zoneRules().fallRaise.includes(x.anchor)) || x.referenceSize === 'large';
  if (!raise) return base;
  return base === 'low' ? 'high' : 'extreme';
}

/** The fall damage roll: D6 plus the band's adds on the damage table. */
export const fallDamage = (rows: readonly DamageRow[], adds: Record<Band, number>, band: Band, d6: number) => tableDamage(rows, d6 + adds[band]);

/**
 * The reference body (falls.yaml, height, steps; decision batch 16, 16-22): the body the soldier's
 * attachment named when they fell (on-body, blind-spot, or grabbed); otherwise the Focus Titan whose
 * card, Grab, or effect caused the fall; otherwise the Focus Titan nearest the soldier's zone, a tie
 * going to the earliest label. The soldier lands in the zone they are in, with attachment ground.
 */
export function referenceBody(attachment: Attachment, causing: string | null, zone: ZoneId | null, titans: readonly Pick<TitanRow, 'label' | 'status' | 'zone'>[], field: FieldState | null): string | null {
  if ((attachment.kind === 'on-body' || attachment.kind === 'blind-spot' || attachment.kind === 'grabbed') && attachment.body) return attachment.body;
  if (causing) return causing;
  const focus = titans.filter((t) => t.status === 'focus').sort((a, b) => a.label.localeCompare(b.label));
  if (!focus.length) return null;
  if (zone === null || !field) return focus[0].label;
  let best = focus[0];
  for (const t of focus) if (zoneDistance(field, zone, t.zone) < zoneDistance(field, zone, best.zone)) best = t;
  return best.label;
}

export interface DamageResult {
  /** Health lost after the damage. */
  lost: number;
  /** A Critical Injury is gained. */
  injury: boolean;
}

/** Damage on a soldier (health.yaml, harm_kinds, damage, procedure). */
export function damageSoldier(lost: number, current: number, amount: number): DamageResult {
  if (amount <= 0) return { lost, injury: false };
  if (current <= 0) return { lost, injury: true };
  const add = Math.min(amount, current);
  return { lost: lost + add, injury: add >= current };
}
