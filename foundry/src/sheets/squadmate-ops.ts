/**
 * The changes the Squadmate sheet makes to its actor beyond the Soldier's (soldier-ops.ts): setting
 * the stat block template in Edit mode, which writes the template's attributes and replaces its
 * Specialty and its one Talent from the compendia (data/character/squadmates.yaml, templates).
 */
import { packItemData } from '../pack-items.ts';
import { planTemplate, planIsEmpty, type HeldBuild, type SquadmateTemplate } from '../rules/squadmate.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));
const esc = (s: string) => foundry.utils.escapeHTML(s);

/** The template rows the sheet offers, named for their Specialty as the stat block is. */
export function squadmateTemplates(): { id: string; name: string }[] {
  const specialties = CONFIG.WOF.specialties as { id: string; name: string }[];
  return (CONFIG.WOF.squadmateTemplates as SquadmateTemplate[]).map((m) => ({
    id: m.id,
    name: specialties.find((s) => s.id === m.specialty)?.name ?? m.id,
  }));
}

/** The Specialty and Talent the file carries, with the row each came from. */
function heldBuild(actor: any): HeldBuild[] {
  return [...actor.items]
    .filter((i: any) => i.type === 'specialty' || i.type === 'talent')
    .map((i: any) => ({ id: i.id, type: i.type, key: i.type === 'specialty' ? i.system.specialty_id : i.system.talent_id }));
}

/**
 * Sets a Squadmate's template. What it would change is named first, and nothing is written until
 * the viewer says yes; picking the template a Squadmate already has only records the name.
 */
export async function setTemplate(actor: any, templateId: string): Promise<void> {
  if (!templateId) return void actor.update({ 'system.template': '' });
  const template = (CONFIG.WOF.squadmateTemplates as SquadmateTemplate[]).find((m) => m.id === templateId);
  if (!template) return;
  const name = squadmateTemplates().find((m) => m.id === templateId)?.name ?? templateId;
  const plan = planTemplate(template, heldBuild(actor), actor.system.attributes);

  if (!planIsEmpty(plan)) {
    const lines = plan.changes.map((c) => `<li>${esc(t(`WOF.Squad.applies.${c}`))}</li>`).join('');
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: t('WOF.Squad.applyTitle') },
      classes: ['wof-pick'],
      content: `<p class="hint">${esc(t('WOF.Squad.applyHint', { name }))}</p><ul>${lines}</ul>`,
    });
    if (!ok) return;
  }

  const create: Record<string, any>[] = [];
  for (const c of plan.create) {
    const data = await packItemData(c.pack, c.key);
    if (!data) {
      ui.notifications.warn(t('WOF.Squad.applyMissing', { name }));
      return;
    }
    data.system = { ...data.system, ...c.system };
    create.push(data);
  }

  if (plan.remove.length) await actor.deleteEmbeddedDocuments('Item', plan.remove);
  if (create.length) await actor.createEmbeddedDocuments('Item', create);
  await actor.update(plan.update);
  if (!planIsEmpty(plan)) ui.notifications.info(t('WOF.Squad.applied', { name }));
}
