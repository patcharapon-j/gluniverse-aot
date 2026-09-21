/**
 * The plain shapes the Engagement tracker's rules read (foundry/docs/tracker-plan.md, section 2).
 * The Foundry side builds them from the Combat and the actors (src/tracker/snapshot.ts); the rules
 * never touch a document.
 */

import type { TerrainTrait } from './momentum.ts';
import type { Attachment, FieldState, ZoneId } from './zones.ts';

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
  /** The zone they are in, or null off field (zones.yaml; decision batch 16). A carried soldier's is their carrier's. */
  zone: ZoneId | null;
  /** Where they are within their zone (zones.yaml, attachments). */
  attachment: Attachment;
  /** Their horse's zone, or null when it is not on the field or they have none (16-25). */
  horseZone: ZoneId | null;
  /**
   * Position by Focus Titan (or corpse) label, derived from zone and attachment by snapshot()
   * (zones.ts, derivePositions). Nothing writes it.
   */
  positions: Record<string, Position>;
  /** Momentum held, 0 to the anchors of their zone (anchor-ratings.yaml, momentum). */
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
  /** Frenzy held: 0 on entry, 1 more at the end of every even-numbered round to FRENZY_CAP, added to the behavior roll. */
  frenzy: number;
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
  /** The zone it stands in; a corpse's never changes (16-24). */
  zone: ZoneId;
  /** Its Stride as its stat block gives it (size-classes.yaml, stride); stride.ts, strideOf, reads 0 when grounded. */
  stride: number;
  /** Its board figure: the Size Class, or the Abnormal's own id (small, medium, large, sprinting-abnormal). */
  figure: string;
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
  /** A zone of this rating's anchors: the Momentum cap there (anchor-ratings.yaml, ratings, anchors). */
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
  /** The field rating's row (16-6). Each zone's own rating is on `field`. */
  anchor: AnchorRating | null;
  /** The field of a Titan Engagement (zones.yaml), or null in a Skirmish. */
  field: FieldState | null;
  /** Where each dead soldier's left items lie, by zone (16-25). */
  leftItems: { soldier: string; zone: ZoneId; items: string[] }[];
  /** The order soldiers took their attachment to a body (a rising stamp by soldier id): the board's order of arrival. */
  arrivals: Record<string, number>;
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
