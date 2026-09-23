/**
 * The pure part of the gas and blade instruments on the Soldier sheet's band (sheet-overhaul plan,
 * section 5; the "1 Instrument" drawing of design/preview-sheet-a-refined-dossier.html): the dial
 * and gauge geometry, which stamp shows, how many spares stand in the rack, and which change of
 * the document animates. No DOM and no Foundry here, so it is unit tested.
 */

/** The dial sweeps 220 degrees, from -110 (empty, under the red arc) to 110 (full). */
export const DIAL = Object.freeze({ cx: 76, cy: 9, min: -110, sweep: 220 });

/** The canister's glass gauge window (viewBox 0 0 100 30), the bands laid across its 42 px. */
const GAUGE = Object.freeze({ x: 18, width: 42, y: 15.6, height: 5.8 });

/** A spare canister's upright window (viewBox 0 0 11 28), bands stacked from the bottom. */
const SPARE = Object.freeze({ x: 4.1, width: 2.8, bottom: 22.6, span: 14.4 });

/** Spares the band's rack shows as canisters: 4, or 3 when the paper is under 700 px. */
export const RACK_ROOM = Object.freeze({ wide: 4, narrow: 3 });

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round2 = (n: number) => Number(n.toFixed(2));

/** The needle's angle in degrees for a level of a full Gas Rating, clamped to the dial. */
export function needleAngle(level: number, full: number): number {
  if (!(full > 0)) return DIAL.min;
  return DIAL.min + (clamp(level, 0, full) / full) * DIAL.sweep;
}

/** A point on the dial's face at radius r and angle a (degrees, 0 is straight up). */
export function polar(cx: number, cy: number, r: number, a: number): [number, number] {
  const rad = (a * Math.PI) / 180;
  return [round2(cx + r * Math.sin(rad)), round2(cy - r * Math.cos(rad))];
}

function tick(cx: number, cy: number, r1: number, r2: number, a: number): string {
  const [x1, y1] = polar(cx, cy, r1, a);
  const [x2, y2] = polar(cx, cy, r2, a);
  return `M${x1} ${y1}L${x2} ${y2}`;
}

/** The dial's printed face: four major ticks, three minor, and the red arc at the empty end. */
export function dialFace(cx: number = DIAL.cx, cy: number = DIAL.cy): { major: string; minor: string; arc: string } {
  const at = (f: number) => DIAL.min + f * DIAL.sweep;
  const major = [0, 1, 2, 3].map((l) => tick(cx, cy, 4.2, 5.9, at(l / 3))).join('');
  const minor = [0.5, 1.5, 2.5].map((l) => tick(cx, cy, 5.1, 5.9, at(l / 3))).join('');
  const [ax, ay] = polar(cx, cy, 5.1, -118);
  const [bx, by] = polar(cx, cy, 5.1, -84);
  return { major, minor, arc: `M${ax} ${ay}A5.1 5.1 0 0 1 ${bx} ${by}` };
}

export interface Band {
  x: number;
  y: number;
  width: number;
  height: number;
  on: boolean;
}

/** One band per point of full Gas Rating across the fitted canister's gauge window, on or off. */
export function gaugeBands(level: number, full: number): Band[] {
  const n = Math.max(1, Math.floor(full) || 1);
  const step = GAUGE.width / n;
  return Array.from({ length: n }, (_, i) => ({
    x: round2(GAUGE.x + i * step),
    y: GAUGE.y,
    width: round2(step - 1),
    height: GAUGE.height,
    on: i < level,
  }));
}

/** The same bands in a spare canister's upright window, filling from the bottom. */
export function spareBands(level: number, full: number): Band[] {
  const n = Math.max(1, Math.floor(full) || 1);
  const step = SPARE.span / n;
  return Array.from({ length: n }, (_, i) => ({
    x: SPARE.x,
    y: round2(SPARE.bottom - (i + 1) * step),
    width: SPARE.width,
    height: round2(step - 0.6),
    on: i < level,
  }));
}

export type GasStamp = 'noOdm' | 'jammed' | 'dry';

/** The lang key each gas stamp prints. */
export const GAS_STAMP_KEY: Readonly<Record<GasStamp, string>> = Object.freeze({
  noOdm: 'WOF.Sheet.gas.stampNoOdm',
  jammed: 'WOF.Derived.jammed',
  dry: 'WOF.Sheet.gas.dry',
});

/** The stamp over the gauge: no ODM Gear, then jammed, then dry (the band note's order). */
export function gasStamp({ hasOdm, jammed, level }: { hasOdm: boolean; jammed: boolean; level: number }): GasStamp | null {
  if (!hasOdm) return 'noOdm';
  if (jammed) return 'jammed';
  if (level <= 0) return 'dry';
  return null;
}

/** The first `room` spares stand in the rack as canisters; the rest are a count. */
export function sparesShown(spares: readonly number[], room: number): { shown: { level: number; index: number }[]; more: number } {
  const n = Math.max(0, Math.floor(room));
  return {
    shown: spares.slice(0, n).map((level, index) => ({ level, index })),
    more: Math.max(0, spares.length - n),
  };
}

export interface BladeGear {
  subtype: string;
  inHandles: boolean;
  rating: number;
}

/** The Blade Set in the handles (its Gear Dice) or none, and how many are stored. */
export function bladeState(gear: readonly BladeGear[]): { inHand: number | null; stored: number } {
  const sets = gear.filter((g) => g.subtype === 'blade-set');
  const hand = sets.find((g) => g.inHandles);
  return { inHand: hand ? hand.rating : null, stored: sets.filter((g) => !g.inHandles).length };
}

/** What the gas instrument last drew, and under which Motion setting. */
export interface GasSnapshot {
  level: number;
  spares: readonly number[];
  mode: string;
}

export interface BladeSnapshot {
  inHand: number | null;
  stored: number;
  mode: string;
}

export type GasChange = 'spend' | 'fill' | 'swap';
export type BladeChange = 'ruin' | 'fit';

const sameList = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((v, i) => v === b[i]);
const sorted = (a: readonly number[]) => [...a].sort((x, y) => x - y);

/**
 * A spare was fitted: the new level is one of the old spares, and the spares are the old ones less
 * that one, plus the old canister if it still held gas (rules/harm.ts, changeCanister). Order is
 * ignored, so a Kit tab sort does not hide it.
 */
function isSwap(prev: GasSnapshot, next: GasSnapshot): boolean {
  if (sameList(prev.spares, next.spares) && prev.level === next.level) return false;
  for (let i = 0; i < prev.spares.length; i++) {
    if (prev.spares[i] !== next.level) continue;
    const rest = prev.spares.filter((_, j) => j !== i);
    if (prev.level > 0) rest.push(prev.level);
    if (sameList(sorted(rest), sorted(next.spares))) return true;
  }
  return false;
}

/**
 * Which change of the fitted canister animates. The first draw and a change of the Motion setting
 * never do. A swap is read from the data, or taken from this viewer's own Change or spare click
 * (`swapRequested`), which also covers fitting a spare at the level already fitted.
 */
export function gasChange(prev: GasSnapshot | undefined, next: GasSnapshot, swapRequested = false): GasChange | null {
  if (!prev || prev.mode !== next.mode) return null;
  if (isSwap(prev, next) || swapRequested) return 'swap';
  if (next.level < prev.level) return 'spend';
  if (next.level > prev.level) return 'fill';
  return null;
}

/** Which change of the handles animates: a set lost from them, or a set fitted into empty ones. */
export function bladeChange(prev: BladeSnapshot | undefined, next: BladeSnapshot): BladeChange | null {
  if (!prev || prev.mode !== next.mode) return null;
  if (prev.inHand !== null && next.inHand === null) return 'ruin';
  if (prev.inHand === null && next.inHand !== null) return 'fit';
  return null;
}
