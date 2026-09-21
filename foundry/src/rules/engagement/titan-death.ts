/**
 * A Focus Titan dies (data/engagement/titan-harm.yaml, titan_death; positions.yaml, corpse and
 * two_focus_titans a_focus_titan_dies; grab.yaml, release titan_dead). Pure and unit tested; the
 * engine (src/tracker/engine.ts, titanDies) writes the plan.
 */
import { holdsAPosition, isClose } from './positions.ts';
import type { SoldierState, TitanRow } from './types.ts';
import { detached, type Placement } from './zones.ts';

/** One of the Titan's cards: its place in this round's turn order, or null when it is not in it. */
export interface DeathCard {
  id: string;
  titan: string;
  order: number | null;
}

export interface DeathInput {
  soldiers: readonly SoldierState[];
  titans: readonly TitanRow[];
  key: string;
  cards: readonly DeathCard[];
  /** The current turn's index, or null when no card is in play. */
  turn: number | null;
  grounded: boolean;
}

export interface DeathPlan {
  /**
   * Soldier id to their placement after the death, for every soldier whose attachment named the body
   * (but pinned), after its steam and fall steps (positions.yaml, corpse, 16-24): ground after a fall,
   * else the detach rule. Their Positions relative to the corpse are then derived.
   */
  placements: Record<string, Placement>;
  /** Cards taken out of this round: the Titan's cards after the current one. */
  clearCards: string[];
  /** Soldiers who feel the relief (everyone holding a Position). */
  relief: string[];
  /** The Grabbed soldier it held, freed. */
  freed: string | null;
  /** Soldiers in the steam (close to the body, or freed from its hand). */
  steam: string[];
  /** Soldiers who fall with a body that was standing. */
  fall: string[];
}

export function planTitanDeath(x: DeathInput): DeathPlan | null {
  const row = x.titans.find((t) => t.key === x.key);
  if (!row || row.status !== 'focus') return null;
  const label = row.label;
  const freed = row.grab?.soldier ?? null;
  const close = x.soldiers.filter((s) => s.alive && (isClose(s.positions[label]) || s.id === freed)).map((s) => s.id);
  const placements: DeathPlan['placements'] = {};
  const falls = !x.grounded;
  for (const s of x.soldiers) {
    if (!s.alive || s.attachment.body !== label || s.attachment.kind === 'pinned') continue;
    // The freed soldier holds on-body for the steam and fall steps, then ground in the corpse's zone
    // (grab.yaml, release, titan_dead); a soldier who falls with the body lands on the ground (16-22).
    const attachment = s.id === freed || falls ? { kind: 'ground' as const, body: null } : detached(s.airborne);
    placements[s.id] = { zone: row.zone, attachment };
  }
  // Played cards stay in the turn order, so the current turn's index does not move (core keeps combat.turn).
  const clearCards = x.cards.filter((c) => c.titan === x.key && c.order !== null && (x.turn === null || c.order > x.turn)).map((c) => c.id);
  return {
    placements,
    clearCards,
    relief: x.soldiers.filter((s) => holdsAPosition(s, x.titans)).map((s) => s.id),
    freed,
    steam: close,
    fall: x.grounded ? [] : close,
  };
}
