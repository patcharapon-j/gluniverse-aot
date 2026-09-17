/**
 * Who makes a Fear Roll in a Titan Engagement, and for which trigger (data/mind/fear-rolls.yaml,
 * triggers and limits; data/engagement/engagement-flow.yaml, witnesses; data/mind/scars.yaml, numb).
 * Pure and unit tested; the engine (src/tracker/engine.ts, fearRolls) rolls them.
 */
import { holdsAPosition } from './positions.ts';
import type { SoldierState, TitanRow } from './types.ts';

export type FearTrigger = 'first-titan-engagement' | 'abnormal' | 'second-focus-titan' | 'comrade-grabbed' | 'comrade-dies';

/** The data's order: one event matching several triggers rolls once, for the first listed. */
export const FEAR_ORDER: readonly FearTrigger[] = ['first-titan-engagement', 'abnormal', 'second-focus-titan', 'comrade-grabbed', 'comrade-dies'];

export interface FearSoldier extends SoldierState {
  /** faced_a_titan: has held a Position in a Titan Engagement before. */
  faced: boolean;
  /** Holds the Numb Scar (no Fear Roll for a comrade's death). */
  numb: boolean;
}

export type FearEvent =
  /** A Titan Engagement starts (its first Focus Titan an Abnormal or not). */
  | { kind: 'start'; abnormal: boolean }
  /** A Background Titan enters as a Focus Titan. */
  | { kind: 'enter'; abnormal: boolean; focusCount: number }
  | { kind: 'grabbed'; soldier: string }
  | { kind: 'dies'; soldier: string };

export interface FearRoller {
  id: string;
  trigger: FearTrigger;
}

export interface FearPlan {
  rollers: FearRoller[];
  /** Soldiers whose faced_a_titan is set now (a Down soldier's too). */
  faced: string[];
}

/** One Fear Roll per soldier per event (limits, one_per_event), none for a Down soldier (limits, not_down). */
export function fearPlan(soldiers: readonly FearSoldier[], titans: readonly TitanRow[], event: FearEvent): FearPlan {
  const rollers: FearRoller[] = [];
  const faced: string[] = [];
  for (const s of soldiers) {
    if (!holdsAPosition(s, titans)) continue;
    const matched: FearTrigger[] = [];
    switch (event.kind) {
      case 'start':
        if (!s.faced) {
          matched.push('first-titan-engagement');
          faced.push(s.id);
        }
        if (event.abnormal) matched.push('abnormal');
        break;
      case 'enter':
        if (event.abnormal) matched.push('abnormal');
        if (event.focusCount === 2) matched.push('second-focus-titan');
        break;
      case 'grabbed':
        if (s.id !== event.soldier) matched.push('comrade-grabbed');
        break;
      case 'dies':
        if (s.id !== event.soldier && !s.numb) matched.push('comrade-dies');
        break;
    }
    if (!matched.length || s.down) continue;
    const trigger = FEAR_ORDER.find((x) => matched.includes(x))!;
    rollers.push({ id: s.id, trigger });
  }
  return { rollers, faced };
}
