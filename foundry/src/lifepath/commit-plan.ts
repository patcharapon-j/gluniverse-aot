/**
 * What Finish writes (foundry/docs/lifepath-wizard-plan.md, section 6), as a pure plan: the actor's
 * system fields, the Items to take from the compendia, the Items to remove, and the Standard Issue.
 * src/lifepath/commit.ts carries it out in one actor update and one batch of Item changes.
 */
import { standardIssue, type HeldGear, type IssuePlan, type LpTables } from '../rules/lifepath.ts';
import type { FinalSoldier, LifepathState } from '../rules/lifepath-state.ts';

export type PackName = 'origins' | 'specialties' | 'talents' | 'gear';

export interface HeldItem {
  id: string;
  type: string;
  gear?: HeldGear;
}

export interface CommitPlan {
  name: string;
  system: Record<string, unknown>;
  create: { pack: PackName; key: string; system: Record<string, unknown> }[];
  remove: string[];
  /** Held Items to update (a Blade Set fitted into the handles). */
  update: { id: string; system: Record<string, unknown> }[];
  issue: IssuePlan;
}

/** Items the Lifepath replaces: the Origin, the Specialty, the Talents, and any Critical Injury. */
export const REPLACED_TYPES = ['origin', 'specialty', 'talent', 'critical-injury'];

export function commitPlan(final: FinalSoldier, state: LifepathState, t: LpTables, held: readonly HeldItem[], spares: readonly number[], notes: string): CommitPlan {
  const gear = held.flatMap((h) => (h.gear ? [h.gear] : []));
  const issue = standardIssue(t.issue, final.specialty, gear, spares, { spares: state.finish.spares, blades: state.finish.blades, item: state.finish.item });
  const stories = final.stories.length ? `<p>${final.stories.map((s) => `${escapeHtml(s.year)}: ${escapeHtml(s.event)}`).join('<br>')}</p>` : '';
  const system: Record<string, unknown> = {
    attributes: { ...final.attributes },
    haven: final.haven,
    canon_tie: final.canonTie,
    drive: final.drive,
    drive_named_comrade: '',
    drive_used_this_session: false,
    merit: final.merit,
    class_rank: final.classRank,
    declined_military_police: final.declined,
    rank: 'private',
    xp: 0,
    // Finish: Health lost 0, not Down, Stress 0, Grief 0, no Scars or Critical Injuries.
    health_lost: 0,
    down: false,
    stress: 0,
    grief: 0,
    scars: [],
    healed_permanent_injuries: [],
    lasting_stress_responses: [],
    rallied_outside_titan_engagement_by: [],
    next_roll_penalty: 0,
    pending_fear_results: [],
    dropped_blade_sets: 0,
    pinned: { active: false, body: '', corpse: false, limb: null, side: null, by_part: '' },
    faced_a_titan: false,
    killed_a_person: false,
    stabilized_injuries_scarred: [],
    retiring: false,
    gas_rating: issue.gasRating,
    spare_canisters: issue.spareCanisters,
    notes: stories ? `${notes}${stories}` : notes,
  };
  const create: CommitPlan['create'] = [
    { pack: 'origins', key: final.origin, system: {} },
    { pack: 'specialties', key: final.specialty, system: {} },
    ...Object.entries(final.talents)
      .filter(([, level]) => level > 0)
      .map(([key, level]) => ({ pack: 'talents' as const, key, system: { level, used: false } })),
    ...issue.create.map((c) => ({
      pack: 'gear' as const,
      key: c.itemId,
      system: { rating: c.rating, current: c.current, kept: false, ...(c.itemId === 'blade-set' ? { in_handles: !!c.inHandles } : {}) },
    })),
  ];
  const remove = [...held.filter((h) => REPLACED_TYPES.includes(h.type)).map((h) => h.id), ...issue.remove];
  return {
    name: final.name,
    system,
    create,
    remove,
    update: issue.fit.map((id) => ({ id, system: { in_handles: true } })),
    issue,
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
