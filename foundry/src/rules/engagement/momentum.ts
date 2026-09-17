/**
 * Flight, Momentum, Anchors, and the Terrain Traits (data/engagement/anchor-ratings.yaml: anchors,
 * momentum, ratings[].terrain_trait, mounted_charge; data/engagement/positions.yaml, moves, flight;
 * decision batch 10, OQ-182 and OQ-183). Pure and unit tested: the tracker writes what these return.
 */
import type { AnchorRating, Position, SoldierState } from './types.ts';

// ---------------------------------------------------------------- Terrain Traits

/** One printed line per Anchor Rating (ratings[].terrain_trait); the schema pins each to its wording. */
export type TerrainTrait = 'none' | 'mounted-break-attention' | 'first-wreck-ignored' | 'blind-spot-anchored' | 'first-carry-free';

export const TERRAIN_TRAITS: Record<string, TerrainTrait> = {
  open: 'mounted-break-attention',
  sparse: 'first-wreck-ignored',
  wooded: 'none',
  urban: 'blind-spot-anchored',
  'giant-forest': 'first-carry-free',
};

export const terrainTrait = (ratingId: string): TerrainTrait => TERRAIN_TRAITS[ratingId] ?? 'none';

/** Open: a mounted soldier's Break Attention gains 1 Bonus Die (bonus-dice-sources.yaml, terrain-trait). */
export const terrainBreakAttentionDice = (rating: Pick<AnchorRating, 'trait'> | null, mounted: boolean): number =>
  rating?.trait === 'mounted-break-attention' && mounted ? 1 : 0;

/**
 * Urban: a soldier who holds blind-spot is anchored to a roof and is not airborne, so a Jam does not
 * drop them (odm-gear.yaml, jam).
 */
export const jamDrops = (rating: Pick<AnchorRating, 'trait'> | null, position: Position | undefined, airborne: boolean): boolean => {
  if (rating?.trait === 'blind-spot-anchored' && position === 'blind-spot') return false;
  return airborne;
};

// ---------------------------------------------------------------- Anchors

/** The Titan Engagement's public pool: what is left, and how many wreckings it has seen. */
export interface AnchorState {
  anchors: number;
  wrecks: number;
}

/** anchors, set_when: the Anchor Rating gives the pool, and nothing is rolled. */
export const startingAnchors = (rating: Pick<AnchorRating, 'anchors'> | null): AnchorState => ({ anchors: Math.max(0, rating?.anchors ?? 0), wrecks: 0 });

export interface WreckResult extends AnchorState {
  /** The Sparse Terrain Trait kept this one: no Anchor was lost. */
  ignored: boolean;
}

/**
 * anchors, wrecking: a wreck effect or a falling Titan destroys 1 Anchor, never below 0. At the
 * Sparse rating the first wrecking of the Titan Engagement is not lost, whatever caused it.
 */
export function wreckAnchor(state: AnchorState, rating: Pick<AnchorRating, 'trait'> | null): WreckResult {
  const wrecks = state.wrecks + 1;
  if (rating?.trait === 'first-wreck-ignored' && state.wrecks === 0) return { anchors: state.anchors, wrecks, ignored: true };
  return { anchors: Math.max(0, state.anchors - 1), wrecks, ignored: false };
}

// ---------------------------------------------------------------- Momentum

export const MOMENTUM_SPENDS = ['carry', 'bite', 'brace', 'quiet', 'clean-line'] as const;
export type MomentumSpend = (typeof MOMENTUM_SPENDS)[number];

/** Every spend costs 1 (momentum, spends, list). */
export const SPEND_COST = 1;

/** momentum, cap: every soldier's cap is the Anchors left. */
export const momentumCap = (anchors: number): number => Math.max(0, anchors);

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
 * A Flight (positions.yaml, moves, flight). The step happens whatever the roll gives, so nothing
 * here decides where the move ends: each success is 1 Momentum to the cap, and no successes sets the
 * loudest flag, from any Position, Distant included. Momentum spent on Quiet stops the flag.
 */
export function flightResult(successes: number, held: number, cap: number, opts: { quiet?: boolean } = {}): FlightResult {
  const room = Math.max(0, momentumCap(cap) - held);
  const gained = Math.max(0, Math.min(successes, room));
  return { momentum: held + gained, gained, loud: successes <= 0 && !opts.quiet };
}

/**
 * anchors, momentum_cap: when Anchors fall, every soldier above the new cap loses the excess at
 * once. Returns only the soldiers whose Momentum changes, by id.
 */
export function trimToCap(soldiers: readonly Pick<SoldierState, 'id' | 'momentum'>[], anchors: number): Record<string, number> {
  const cap = momentumCap(anchors);
  const out: Record<string, number> = {};
  for (const s of soldiers) if (s.momentum > cap) out[s.id] = cap;
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

/**
 * momentum, spends, carry: the Momentum one move spends to make `extra` more Position steps. At the
 * Giant Forest rating the first step a Flight Carries is free; every later Carry on that move costs 1.
 */
export function carryCost(rating: Pick<AnchorRating, 'trait'> | null, extra: number, flight: boolean): number {
  const steps = Math.max(0, extra);
  if (flight && rating?.trait === 'first-carry-free') return Math.max(0, steps - 1);
  return steps;
}

/** Why the soldier cannot spend Momentum on this now (a key under WOF.Tracker.momentum), or null. */
export function spendBlock(s: SoldierState, spend: MomentumSpend, grabbed: boolean): string | null {
  if (!s.alive) return 'dead';
  if (s.left) return 'left';
  if (holdsNoMomentum(s, grabbed)) return 'cannotHold';
  if (s.momentum < SPEND_COST) return 'noMomentum';
  return null;
}

// ---------------------------------------------------------------- the mounted charge

/** mounted_charge, open_double_step: at the Open rating only, one mounted move may make that step twice. */
export const chargeDoubleStep = (rating: Pick<AnchorRating, 'id'> | null): boolean => rating?.id === 'open';

/**
 * mounted_charge: a mounted move that makes the distant to in-reach step, in either direction, may
 * also set the loudest flag. It is never rolled, is not ODM use, and spends nothing beyond the move.
 */
export function chargeBlock(s: SoldierState, rating: AnchorRating | null, position: Position | undefined, grabbed: boolean): string | null {
  if (!s.alive) return 'dead';
  if (s.left) return 'left';
  if (grabbed) return 'grabbed';
  if (s.carriedBy) return 'carried';
  if (s.pinned) return 'pinned';
  if (!s.mounted) return 'notMounted';
  if (position !== 'distant' && position !== 'in-reach') return 'chargeReach';
  const row = (rating?.steps ?? []).find((r) => r.mounted && ((r.a === 'distant' && r.b === 'in-reach') || (r.a === 'in-reach' && r.b === 'distant')));
  return row ? null : 'notOneStep';
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
