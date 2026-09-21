/**
 * The engagement board's plain shapes (16-34; ADR-0027 as amended; zone-combat-design.md section 7).
 *
 * The board is a renderer over `snapshot(combat)` and holds no rule state. `BoardState` is the part of
 * the tracker's Snapshot it draws, picked structurally so the real Snapshot is assignable to it
 * (app.ts checks that at compile time). `BoardExtras` are display-only readouts the Snapshot does not
 * carry (a Titan's Openings and Body Part marks; a soldier's Momentum cap and gas), which the
 * app reads from the tracker's view and the Titan's actor. No rule reads any of them.
 */
import type { Attachment, FieldState, Placement, ZoneEffectId, ZoneId } from '../rules/engagement/zones.ts';

export type { Attachment, FieldState, Placement, ZoneEffectId, ZoneId };

export interface Pt {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** One soldier as the board draws them (a subset of the Snapshot's SoldierState). */
export interface BoardSoldier {
  id: string;
  name: string;
  alive: boolean;
  down: boolean;
  left: boolean;
  mounted: boolean;
  airborne: boolean;
  carriedBy: string | null;
  zone: ZoneId | null;
  attachment: Attachment;
  horseZone: ZoneId | null;
}

/** One Focus Titan or corpse as the board draws it (a subset of the Snapshot's TitanRow). */
export interface BoardTitan {
  key: string;
  label: string;
  status: 'focus' | 'corpse';
  /** A soldier id, 'decoy', or ''. */
  holder: string;
  grounded: boolean;
  zone: ZoneId;
  grab: { soldier: string; arm: string } | null;
  /** Its board figure: small, medium, large, or an Abnormal's own id (art.ts, boardTitan). */
  figure: string;
}

export interface BoardState {
  field: FieldState | null;
  soldiers: readonly BoardSoldier[];
  titans: readonly BoardTitan[];
  /** Items a soldier left, by the zone they lie in (16-35). */
  leftItems: readonly { soldier: string; zone: ZoneId; items: readonly string[] }[];
  /** A rising stamp for when each soldier became On Body, Blind Spot, or Grabbed: their order of arrival (16-34). */
  arrivals: Readonly<Record<string, number>>;
}

export type TitanSize = 'small' | 'medium' | 'large';

export interface TitanExtra {
  /** The Titan's tracker colour, as a PIXI colour. */
  colour: number;
  openings: number;
  /** Body Part marks: 0 intact, 1 wounded, 2 broken. */
  parts: { id: string; state: number }[];
}

export interface SoldierExtra {
  momentum: number;
  cap: number;
  gas: number;
  gasMax: number;
  /** This client may move them (their owner, or the GM). */
  owner: boolean;
}

export interface BoardExtras {
  titans: Readonly<Record<string, TitanExtra>>;
  soldiers: Readonly<Record<string, SoldierExtra>>;
}

/** The board's own display memory, which no rule reads: the side each Titan last faced (its last Stride's direction, 16-34). */
export interface BoardMemory {
  facing: Record<string, 'left' | 'right'>;
}

export const emptyMemory = (): BoardMemory => ({ facing: {} });

/**
 * A board event written by the engine in the same update as the change it describes (plan 5.3). It is
 * written through a path Undo never reverts, so `seq` only rises. A Flight's `steps` are the steps
 * applied, which may stop short of the requested route when the rolled Momentum cannot pay every Carry
 * (16-14); the arc follows them.
 */
export interface BoardEvent {
  seq: number;
  kind: 'stride' | 'flight' | 'wreck' | 'fall' | 'steam' | 'enter';
  data: Record<string, unknown>;
}

export type { MotionMode } from '../motion/tokens.ts';
