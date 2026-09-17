/**
 * The steps a Titan Engagement or a Skirmish ends with (data/harm/engagement-end.yaml; stress-changes.yaml,
 * engagement-ends and skirmish-ends; data/mind/grief.yaml; data/mind/scars.yaml, retirement). Pure and
 * unit tested; the engine runs them as a stamped checklist with Undo, as it runs the round-end steps.
 */

/** The steps, in the data's order (the schema fails the build when that list changes). */
export const CLOSING_CHECKS = ['turns', 'stress-relief', 'lasting-stress-responses', 'turn-limits', 'aftermath-rolls', 'death-rolls', 'care-window', 'grief', 'retirement-and-promotion'] as const;
export type ClosingCheck = (typeof CLOSING_CHECKS)[number];

/** Steps the players resolve at the table (their treaters, their Death Rolls, their care): the GM stamps them. */
export const MANUAL_CLOSING: readonly ClosingCheck[] = ['aftermath-rolls', 'death-rolls', 'care-window'];

/** Stress after the end relief: the effective Stress less the amount, never below the minimum. */
export const relievedStress = (effective: number, minimum: number, amount: number) => Math.max(minimum, effective - amount);

/** Lasting Stress Responses gained in the engagement end with it (stress-responses.yaml). */
export const keptResponses = <T extends { ends: string }>(list: readonly T[]) => list.filter((r) => r.ends !== 'titan-engagement-end');

export interface InjuryState {
  id: string;
  lethal: boolean;
  treated: boolean;
  limit: 'turn' | 'engagement' | 'day' | null;
}

/** turn-limits: every lethal Critical Injury with a turn limit now has an engagement limit. */
export const turnLimitsToChange = (items: readonly InjuryState[]) => items.filter((i) => i.lethal && i.limit === 'turn').map((i) => i.id);

/** aftermath-rolls and death-rolls: the untreated lethal Critical Injuries with an engagement limit (after turn-limits). */
export const engagementLimited = (items: readonly InjuryState[]) => items.filter((i) => i.lethal && !i.treated && (i.limit === 'engagement' || i.limit === 'turn')).map((i) => i.id);

export interface GriefSoldier {
  id: string;
  alive: boolean;
  grief: number;
  /** The soldier id the Drive names, or ''. */
  driveNamed: string;
  numb: boolean;
}

/**
 * grief (grief.yaml, gaining): every other living soldier who took part gains 1 Grief for the
 * engagement's deaths in total, 1 more for each dead soldier their Drive named, and with the Numb
 * Scar 1 more for each death; Grief above the maximum is lost.
 */
export function griefGains(soldiers: readonly GriefSoldier[], max: number): Record<string, number> {
  const dead = soldiers.filter((s) => !s.alive).map((s) => s.id);
  const out: Record<string, number> = {};
  for (const s of soldiers) {
    if (!s.alive) continue;
    const others = dead.filter((d) => d !== s.id);
    if (!others.length) continue;
    const gain = 1 + others.filter((d) => d === s.driveNamed).length + (s.numb ? others.length : 0);
    const next = Math.min(max, s.grief + gain);
    if (next !== s.grief) out[s.id] = next;
  }
  return out;
}

/** retirement-and-promotion: every living soldier with five Scars retires (scars.yaml, retirement). */
export const retiring = (soldiers: readonly { id: string; alive: boolean; scars: number; retiring: boolean }[], at = 5) =>
  soldiers.filter((s) => s.alive && !s.retiring && s.scars >= at).map((s) => s.id);
