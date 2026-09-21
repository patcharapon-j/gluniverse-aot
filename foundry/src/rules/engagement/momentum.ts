/**
 * Flight, Momentum, and the Terrain Traits (data/engagement/anchor-ratings.yaml: momentum,
 * ratings[].terrain_trait; data/engagement/positions.yaml, moves, flight; decision batch 10, OQ-182
 * and OQ-183; decision batch 16, 16-4, 16-5, 16-14). Each reads one zone: a soldier's Momentum cap is
 * the anchors of the zone they are in, and each Terrain Trait reads the zone it concerns. Pure and unit
 * tested: the tracker writes what these return.
 */
import type { AnchorRating, Position, SoldierState } from './types.ts';
import { momentumCapAt, type FieldState } from './zones.ts';

// ---------------------------------------------------------------- Terrain Traits

/** One printed line per Anchor Rating (ratings[].terrain_trait); the schema pins each to its wording. */
export type TerrainTrait = 'none' | 'mounted-break-attention' | 'first-wreck-ignored' | 'blind-spot-anchored' | 'fall-raised';

/**
 * 16-5: Sparse's grace is per zone (zones.ts, wreckZone); Giant Forest's first-Carry-free trait is
 * withdrawn into its Carry cost of 0, and the trait reads the fall band a Giant Forest zone raises.
 */
export const TERRAIN_TRAITS: Record<string, TerrainTrait> = {
  open: 'mounted-break-attention',
  sparse: 'first-wreck-ignored',
  wooded: 'none',
  urban: 'blind-spot-anchored',
  'giant-forest': 'fall-raised',
};

export const terrainTrait = (ratingId: string): TerrainTrait => TERRAIN_TRAITS[ratingId] ?? 'none';

/** Open: a mounted soldier in an Open zone gains 1 Bonus Die on Break Attention (bonus-dice-sources.yaml, terrain-trait). Pass the rating of the soldier's zone. */
export const terrainBreakAttentionDice = (rating: Pick<AnchorRating, 'trait'> | null, mounted: boolean): number =>
  rating?.trait === 'mounted-break-attention' && mounted ? 1 : 0;

/**
 * Urban: a soldier who holds blind-spot relative to a Focus Titan in an Urban zone is anchored to a
 * roof and is not airborne, so a Jam does not drop them (odm-gear.yaml, jam). Pass that zone's rating.
 */
export const jamDrops = (rating: Pick<AnchorRating, 'trait'> | null, position: Position | undefined, airborne: boolean): boolean => {
  if (rating?.trait === 'blind-spot-anchored' && position === 'blind-spot') return false;
  return airborne;
};

// ---------------------------------------------------------------- Momentum

export const MOMENTUM_SPENDS = ['carry', 'bite', 'brace', 'quiet', 'clean-line'] as const;
export type MomentumSpend = (typeof MOMENTUM_SPENDS)[number];

/** Every spend costs 1 (momentum, spends, list). */
export const SPEND_COST = 1;

/** momentum, cap: a soldier's cap is the anchors of the zone they are in (zones.ts, momentumCapAt). */
export const momentumCap = (anchors: number): number => Math.max(0, anchors);

/** The cap of a soldier where they stand: the anchors of their zone, 0 off field. */
export const capOf = (s: Pick<SoldierState, 'zone'>, field: FieldState | null): number => (field && s.zone !== null ? momentumCapAt(field, s.zone) : 0);

/** A soldier in no state to hold Momentum (momentum, lost). */
export const holdsNoMomentum = (s: SoldierState, grabbed: boolean): boolean => !s.alive || s.left || s.down || grabbed || !!s.carriedBy || !!s.pinned;

export interface FlightResult {
  /** The Momentum the soldier holds after the Flight. */
  momentum: number;
  /** What this Flight gave, after the cap. */
  gained: number;
  /** No successes: the soldier comes in loud and sets the loudest flag. */
  loud: boolean;
}

/**
 * A Flight (positions.yaml, moves, flight). The move happens whatever the roll gives, so nothing
 * here decides where it ends: each success is 1 Momentum up to the anchors of the zone the Flight
 * starts in (16-14), and no successes sets the loudest flag. Momentum spent on Quiet stops the flag.
 */
export function flightResult(successes: number, held: number, cap: number, opts: { quiet?: boolean } = {}): FlightResult {
  const room = Math.max(0, momentumCap(cap) - held);
  const gained = Math.max(0, Math.min(successes, room));
  return { momentum: held + gained, gained, loud: successes <= 0 && !opts.quiet };
}

/**
 * momentum, cap: when a soldier's zone changes, or its rating falls, a soldier whose Momentum is above
 * the new cap loses the excess at once. Returns only the soldiers whose Momentum changes, by id.
 */
export function trimToCap(soldiers: readonly Pick<SoldierState, 'id' | 'momentum' | 'zone'>[], field: FieldState | null): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of soldiers) {
    const cap = capOf(s, field);
    if (s.momentum > cap) out[s.id] = cap;
  }
  return out;
}

/**
 * momentum, lost: at the round's momentum end step every soldier who made no ODM move this round
 * loses all their Momentum, as does anyone in no state to hold it. Returns the soldiers whose
 * Momentum changes, by id.
 */
export function momentumEnd(soldiers: readonly SoldierState[], odmUsed: readonly string[], grabbed: (id: string) => boolean = () => false): Record<string, number> {
  const flew = new Set(odmUsed);
  const out: Record<string, number> = {};
  for (const s of soldiers) {
    if (s.momentum <= 0) continue;
    if (flew.has(s.id) && !holdsNoMomentum(s, grabbed(s.id))) continue;
    out[s.id] = 0;
  }
  return out;
}

/** Why the soldier cannot spend Momentum on this now (a key under WOF.Tracker.momentum), or null. */
export function spendBlock(s: SoldierState, spend: MomentumSpend, grabbed: boolean): string | null {
  if (!s.alive) return 'dead';
  if (s.left) return 'left';
  if (holdsNoMomentum(s, grabbed)) return 'cannotHold';
  if (s.momentum < SPEND_COST) return 'noMomentum';
  return null;
}

// ---------------------------------------------------------------- what a change of Position causes

/** How a soldier's Position changed (positions.yaml, moves; background-titans.yaml, retreat, moves). */
export type PositionChange = 'move' | 'retreat-move' | 'forced-step' | 'rule';

export interface ChangeEffects {
  /** Rolled for fly, each success 1 Momentum, no successes the loudest flag (moves, flight). */
  flight: boolean;
  /** ODM use, so it makes that round's Gas Roll (odm-gear.yaml, odm_use). */
  odmUse: boolean;
  /** The soldier is airborne after it, as after any ODM move. */
  airborne: boolean;
  /** It spends the soldier's move. */
  spendsTheMove: boolean;
}

/**
 * The split decision batch 10 item 10-5 (OQ-186) draws. A retreat narrows the soldier's own move
 * rather than replacing it, so an ODM move under a retreat is a Flight like any other. A Fear Roll
 * result's forced step is a change of Position a rule names, not the soldier's own move: it is never
 * a Flight, so it is not rolled, gives no Momentum, and sets no loudest flag, whichever kind of step
 * it is; an ODM forced step is still ODM use and still leaves the soldier airborne.
 */
export function changeEffects(how: PositionChange, kind: 'onFoot' | 'mounted' | 'odm' | null): ChangeEffects {
  const own = how === 'move' || how === 'retreat-move';
  const odm = kind === 'odm';
  return { flight: own && odm, odmUse: odm, airborne: odm, spendsTheMove: own };
}
