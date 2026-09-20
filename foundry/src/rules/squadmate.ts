/**
 * The Squadmate stat block (data/character/squadmates.yaml, templates). A Squadmate is built from
 * one of the nine templates: the template names its Specialty, its one Talent at level 1, and the
 * attributes the rest of its file derives from. The sheet sets a template in Edit mode; what that
 * costs the file is worked out here, so the sheet only carries the plan out.
 */

export type SquadmateTemplate = {
  id: string;
  specialty: string;
  talent: { id: string; level: number };
  attributes: Record<string, number>;
};

/** A build Item the file already carries: its document id, its kind, and the row it came from. */
export type HeldBuild = { id: string; type: string; key: string };

export type TemplatePlan = {
  /** Every field the actor update writes, already pathed. */
  update: Record<string, unknown>;
  /** The Specialty and Talent documents the template replaces. */
  remove: string[];
  /** What to take from the compendia in their place. */
  create: { pack: 'specialties' | 'talents'; key: string; system: Record<string, unknown> }[];
  /** The names of what changes, for the confirmation the sheet asks first. */
  changes: ('attributes' | 'specialty' | 'talent')[];
};

const sameAttributes = (a: Record<string, number>, b: Record<string, number>) =>
  Object.entries(a).every(([id, v]) => b[id] === v);

/**
 * What setting `template` on a Squadmate writes. The Specialty and the Talent are replaced only
 * when the file does not already hold the template's; the attributes are written only when they
 * differ, so re-picking the template a Squadmate already has changes nothing. Gear is never
 * touched: Standard Issue is the kit ledger's, not the template's.
 */
export function planTemplate(template: SquadmateTemplate, held: HeldBuild[], attributes: Record<string, number>): TemplatePlan {
  const plan: TemplatePlan = { update: { 'system.template': template.id }, remove: [], create: [], changes: [] };

  if (!sameAttributes(template.attributes, attributes)) {
    for (const [id, v] of Object.entries(template.attributes)) plan.update[`system.attributes.${id}`] = v;
    plan.changes.push('attributes');
  }

  const specialties = held.filter((i) => i.type === 'specialty');
  if (specialties.length !== 1 || specialties[0].key !== template.specialty) {
    plan.remove.push(...specialties.map((i) => i.id));
    plan.create.push({ pack: 'specialties', key: template.specialty, system: {} });
    plan.changes.push('specialty');
  }

  // A Squadmate carries one Talent, at the template's level (stat_block.talent).
  const talents = held.filter((i) => i.type === 'talent');
  if (talents.length !== 1 || talents[0].key !== template.talent.id) {
    plan.remove.push(...talents.map((i) => i.id));
    plan.create.push({ pack: 'talents', key: template.talent.id, system: { level: template.talent.level, used: false } });
    plan.changes.push('talent');
  }

  return plan;
}

/** True when the plan writes nothing but the template's own name. */
export const planIsEmpty = (plan: TemplatePlan): boolean => plan.changes.length === 0;
