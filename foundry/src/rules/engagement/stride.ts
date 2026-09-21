/**
 * The Stride (data/engagement/behavior-procedure.yaml, resolving_a_card, stride; zones.yaml, stride;
 * decision batch 16, 16-16 to 16-19). A step of a Focus Titan's card, after attention and before
 * choose: the Titan moves toward its Attention holder's zone, one zone at a time, up to its Stride, and
 * stops as soon as it enters that zone. It is not a roll, an entry, or an action; it harms nobody, sets
 * and clears no flag, and wrecks nothing. Pure and unit tested.
 */
import type { SoldierState, TitanRow } from './types.ts';
import { derivePositions, detached, neighbours, zoneDistance, type FieldState, type Placement, type ZoneId } from './zones.ts';

/** A Focus Titan's Stride: its row's value, 0 when grounded (titan-harm.yaml, grounded) or a corpse. */
export function strideOf(t: TitanRow): number {
  if (t.status !== 'focus' || t.grounded) return 0;
  return Math.max(0, t.stride);
}

/**
 * The zones a Stride enters, in order: each an adjacent zone one closer to `to`, the lower-numbered
 * on a tie, stopping on entering `to` or after `stride` zones. Empty when already there or stride 0.
 */
export function strideRoute(field: FieldState, from: ZoneId, to: ZoneId, stride: number): ZoneId[] {
  const out: ZoneId[] = [];
  let at = from;
  if (!Number.isFinite(zoneDistance(field, from, to))) return out;
  while (out.length < stride && at !== to) {
    const d = zoneDistance(field, at, to);
    const next = neighbours(field, at).find((n) => zoneDistance(field, n, to) === d - 1);
    if (next === undefined) break;
    out.push(next);
    at = next;
  }
  return out;
}

/** The holder a card strides toward, and the route (stride, holder): empty when nothing strides. */
export function strideFor(field: FieldState, t: TitanRow, holder: SoldierState | undefined): ZoneId[] {
  if (!holder || !holder.alive || holder.left || holder.zone === null) return [];
  if (t.status !== 'focus' || holder.zone === t.zone) return [];
  return strideRoute(field, t.zone, holder.zone, strideOf(t));
}

export interface StrideMove {
  /** The soldier's placement after the Stride, by id, for every soldier whose placement changes. */
  placements: Record<string, Placement>;
  /** Soldiers who moved with the Titan (on-body, grabbed, and anyone they carry). */
  carried: string[];
  /** Soldiers left behind at Blind Spot, now under the detach rule. */
  left: string[];
}

/**
 * What a Stride carries and leaves (positions.yaml, stride_moves): every soldier on-body or grabbed
 * naming the Titan moves with it, with any comrade they carry; one at Blind Spot stays in the zone it
 * leaves under the detach rule. Horses, left items, other soldiers, and corpses never move.
 */
export function strideMoves(soldiers: readonly SoldierState[], label: string, to: ZoneId | null): StrideMove {
  const out: StrideMove = { placements: {}, carried: [], left: [] };
  if (to === null) return out;
  for (const s of soldiers) {
    if (!s.alive || s.left || s.carriedBy) continue;
    const a = s.attachment;
    if (a.body !== label) continue;
    if (a.kind === 'on-body' || a.kind === 'grabbed') {
      out.placements[s.id] = { zone: to, attachment: { ...a } };
      out.carried.push(s.id);
      if (s.carrying) {
        out.placements[s.carrying] = { zone: to, attachment: { ...a } };
        out.carried.push(s.carrying);
      }
    } else if (a.kind === 'blind-spot') {
      out.placements[s.id] = { zone: s.zone, attachment: detached(s.airborne) };
      out.left.push(s.id);
    }
  }
  return out;
}

/** The holder is brought into reach by this Stride (16-38's reported share): the route ends in their zone. */
export function strideReaches(route: readonly ZoneId[], holder: SoldierState | undefined): boolean {
  return !!holder && route.length > 0 && route[route.length - 1] === holder.zone;
}

/** The Positions every soldier holds after the Titan stands in `zone` (derived, never written). */
export function positionsAfterStride(soldiers: readonly SoldierState[], titans: readonly TitanRow[], key: string, zone: ZoneId, moves: StrideMove): SoldierState[] {
  const bodies = titans.map((t) => (t.key === key ? { ...t, zone } : t));
  return soldiers.map((s) => {
    const p = moves.placements[s.id];
    const next = p ? { ...s, zone: p.zone, attachment: p.attachment } : s;
    return { ...next, positions: derivePositions(next, bodies) };
  });
}
