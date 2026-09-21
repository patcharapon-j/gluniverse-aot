/**
 * What changes on the field when a zone or a body changes under the soldiers (decision batch 16,
 * 16-4, 16-21, 16-23): a zone turned Open under a standing Titan, a Titan standing up, a Pin that ends,
 * and the Momentum a carried soldier loses to a new zone's cap. Pure and unit tested; the engine
 * (src/tracker/engine.ts) writes what these return.
 */
import { trimToCap } from './momentum.ts';
import type { StrideMove } from './stride.ts';
import type { SoldierState, TitanRow } from './types.ts';
import { zoneRules, type Attachment, type FieldState, type Placement, type ZoneId } from './zones.ts';

export interface FieldChange {
  /** New placements by soldier id. */
  placements: Record<string, Placement>;
  /** Soldiers who stop being airborne, with no fall. */
  landed: string[];
  /** Soldiers whose Blind Spot became On Body. */
  onBody: string[];
  /** Soldiers freed from a Pin. */
  freed: string[];
}

const empty = (): FieldChange => ({ placements: {}, landed: [], onBody: [], freed: [] });

/**
 * zone-becomes-open (positions.yaml, changes_to_position; 16-21; OQ-205): every soldier anchored in
 * the zone is on the ground and stops being airborne, with no fall, whatever stands in it; and while a
 * standing Focus Titan is in it, every soldier at its Blind Spot holds On Body instead (not a fall).
 */
export function zoneOpened(soldiers: readonly SoldierState[], titans: readonly TitanRow[], zone: ZoneId): FieldChange {
  const out = empty();
  const standing = titans.filter((t) => t.status === 'focus' && t.zone === zone && !t.grounded).map((t) => t.label);
  for (const s of soldiers) {
    if (s.zone !== zone || !s.alive || s.left) continue;
    if (s.attachment.kind === 'blind-spot' && s.attachment.body && standing.includes(s.attachment.body)) {
      out.placements[s.id] = { zone, attachment: { kind: 'on-body', body: s.attachment.body } };
      out.onBody.push(s.id);
    } else if (s.attachment.kind === 'anchored') {
      out.placements[s.id] = { zone, attachment: { kind: 'ground', body: null } };
      out.landed.push(s.id);
    }
  }
  return out;
}

/**
 * A Titan stands up (anchor-ratings.yaml, grounded_titan, ends; titan-harm.yaml, pinned; 16-21,
 * 16-23): every soldier it pins is freed, on the ground in its zone; and in an Open zone every soldier
 * at its Blind Spot holds On Body instead.
 */
export function titanStands(soldiers: readonly SoldierState[], titan: Pick<TitanRow, 'label' | 'zone'>, zoneRating: string): FieldChange {
  const out = empty();
  const open = zoneRating === zoneRules().openRating;
  for (const s of soldiers) {
    if (!s.alive || s.attachment.body !== titan.label) continue;
    if (s.attachment.kind === 'pinned' || s.pinned?.body === titan.label) {
      out.placements[s.id] = { zone: s.zone ?? titan.zone, attachment: { kind: 'ground', body: null } };
      out.freed.push(s.id);
    } else if (open && s.attachment.kind === 'blind-spot') {
      out.placements[s.id] = { zone: s.zone, attachment: { kind: 'on-body', body: titan.label } };
      out.onBody.push(s.id);
    }
  }
  for (const s of soldiers) {
    if (s.pinned?.body === titan.label && !out.freed.includes(s.id)) {
      out.placements[s.id] = { zone: s.zone ?? titan.zone, attachment: { kind: 'ground', body: null } };
      out.freed.push(s.id);
    }
  }
  return out;
}

/**
 * The placement and the actor's Pinned field are one fact (16-23): a pinned attachment with no Pin
 * on the soldier (the sheet's checkbox cleared it) reads as the ground in the same zone.
 */
export function reconcilePin(attachment: Attachment, pinned: SoldierState['pinned']): Attachment {
  if (attachment.kind === 'pinned' && !pinned) return { kind: 'ground', body: null };
  return attachment;
}

/**
 * The Momentum soldiers lose when a Stride carries them into another zone (16-4, momentum, cap):
 * above the new zone's anchors, the excess at once. Returns only the soldiers whose Momentum changes.
 */
export function strideMomentum(soldiers: readonly SoldierState[], moves: StrideMove, field: FieldState): Record<string, number> {
  const moved = soldiers.filter((s) => moves.placements[s.id]).map((s) => ({ ...s, zone: moves.placements[s.id].zone }));
  return trimToCap(moved, field);
}
