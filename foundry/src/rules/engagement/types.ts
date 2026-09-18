/**
 * The plain shapes the Engagement tracker's rules read (foundry/docs/tracker-plan.md, section 2).
 * The Foundry side builds them from the Combat and the actors (src/tracker/snapshot.ts); the rules
 * never touch a document.
 */

import type { TerrainTrait } from './momentum.ts';

export type Position = 'distant' | 'in-reach' | 'on-body' | 'blind-spot';
export const POSITION_IDS: readonly Position[] = ['distant', 'in-reach', 'on-body', 'blind-spot'];

export type Mode = 'titan' | 'skirmish';
export type Step = 'setup' | 'wings' | 'deal' | 'swap' | 'play' | 'end' | 'closing';

/** One soldier or Squadmate taking part. */
export interface SoldierState {
  id: string;
  name: string;
  /** A player character (soldier), not a Squadmate. */
  pc: boolean;
  alive: boolean;
  down: boolean;
  /** Has left the Titan Engagement. */
  left: boolean;
  carriedBy: string | null;
  carrying: string | null;
  /** The label of the body that pins them, and whether the pin is on the whole body. */
  pinned: { body: string; bodyPin: boolean } | null;
  mounted: boolean;
  airborne: boolean;
  /** ODM Gear counts as had: held, not Jammed, Gas Rating above 0. */
  odmHad: boolean;
  /** Position by Focus Titan (or corpse) label. */
  positions: Record<string, Position>;
  /** Momentum held, 0 to the Anchors left (anchor-ratings.yaml, momentum). */
  momentum: number;
  /** Untreated Critical Injuries held (the most-harmed test). */
  untreated: number;
}

export interface TitanFlags {
  hooked: string[];
  hurt: string[];
  loud: string[];
}

export interface GrabState {
  soldier: string;
  /** Counted turns so far (0, 1). */
  counted: number;
  lifted: boolean;
  /** The id of the holding arm. */
  arm: string;
}

/** One Focus Titan or corpse row of the tracker (round.yaml, gm_tracker). */
export interface TitanRow {
  key: string;
  label: string;
  status: 'focus' | 'corpse';
  tempo: number;
  /** The Attention Ladder's rungs, highest first. */
  ladder: string[];
  /** A soldier id, 'decoy', or '' (nothing). */
  holder: string;
  grab: GrabState | null;
  decoy: { name: string; left: number } | null;
  decoysInRow: number;
  flags: TitanFlags;
  grounded: boolean;
  /** The round it became a Focus Titan. */
  entered: number;
}

export const emptyFlags = (): TitanFlags => ({ hooked: [], hurt: [], loud: [] });

/** A card slot in turn order. A Wing Squadmate holds no card and acts after `of`. */
export interface Slot {
  kind: 'soldier' | 'wing' | 'titan' | 'foe-group';
  id: string;
  card: number | null;
  of?: string;
  index?: number;
}

export interface StepRow {
  a: Position;
  b: Position;
  onFoot: boolean;
  mounted: boolean;
  odm: boolean;
}

export interface AnchorRating {
  id: string;
  name: string;
  /** The Anchors the field starts with (anchor-ratings.yaml, ratings, anchors). */
  anchors: number;
  /** The rating's Terrain Trait (momentum.ts, TERRAIN_TRAITS). */
  trait: TerrainTrait;
  steps: StepRow[];
}

/** The running engagement as the rules read it (built by src/tracker/snapshot.ts). */
export interface Snapshot {
  combat: string;
  mode: Mode;
  step: Step;
  round: number;
  anchor: AnchorRating | null;
  /** The Anchors left, which is every soldier's Momentum cap (anchor-ratings.yaml, anchors). */
  anchors: number;
  /** Anchors wrecked so far, for the Sparse Terrain Trait's first-wreck grace. */
  wrecks: number;
  /** Soldiers who made an ODM move this round (odm-gear.yaml, odm_use). */
  odmUsed: string[];
  /** Soldiers whose move is spent this round (blade-sets.yaml, swap). */
  movesSpent: string[];
  soldiers: SoldierState[];
  titans: TitanRow[];
  /** Squadmate id to player character id. */
  wings: Record<string, string>;
  /** Each soldier's card this round (null when none). */
  cards: Record<string, number | null>;
  /** Each Focus Titan's cards this round. */
  titanCards: Record<string, number[]>;
  swapped: string[];
  proposal: { a: string; b: string; by: string } | null;
  retreat: boolean;
  wingsSet: boolean;
  wingsOpen: boolean;
  reassign: string[];
  tactics: { held: string[]; used: string[] };
  cloaks: string[];
}
