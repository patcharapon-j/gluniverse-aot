/**
 * Finish (foundry/docs/lifepath-wizard-plan.md, section 6): writes the finished soldier in one batch.
 * The Origin, Specialty, Talents, and Standard Issue come from the system's compendia by their fixed
 * ids; the actor's fields and the finished state go in one update.
 */
import { SYSTEM_ID } from '../config.ts';
import type { LpTables } from '../rules/lifepath.ts';
import { markFinished, replay, type LifepathState } from '../rules/lifepath-state.ts';
import { allowedProcedures, worldYear } from './campaign.ts';
import { commitPlan, REPLACED_TYPES, type HeldItem, type PackName } from './commit-plan.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));
const esc = (s: string) => foundry.utils.escapeHTML(s);

function heldItems(actor: any): HeldItem[] {
  return [...actor.items].map((i: any) => ({
    id: i.id,
    type: i.type,
    gear:
      i.type === 'gear'
        ? { id: i.id, itemId: i.system.item_id, rating: i.system.rating, current: i.system.current, inHandles: !!i.system.in_handles, kept: !!i.system.kept }
        : undefined,
  }));
}

async function packData(pack: PackName, key: string): Promise<Record<string, any>> {
  const ids = CONFIG.WOF.packIds as Record<PackName, Record<string, string>>;
  const id = ids[pack]?.[key];
  const collection = game.packs.get(`${SYSTEM_ID}.${pack}`);
  const doc = id && collection ? await collection.getDocument(id) : null;
  if (!doc) throw new Error(t('WOF.Lifepath.finish.missing', { key, pack }));
  const data = doc.toObject();
  delete data._id;
  data._stats = { compendiumSource: doc.uuid };
  return data;
}

/** Commits the soldier and returns the finished state (or the state unchanged if the player backs out). */
export async function commitLifepath(actor: any, state: LifepathState): Promise<LifepathState> {
  const tables = CONFIG.WOF.lifepath as LpTables;
  const opts = { allowed: allowedProcedures(), worldYear: worldYear() };
  const r = replay(state, tables, opts);
  if (!r.final || r.current !== 'finish' || !r.final.name || state.finished) return state;
  const held = heldItems(actor);
  const plan = commitPlan(r.final, r.state, tables, held, [...actor.system.spare_canisters], actor.system.notes ?? '');

  const replaced = [...actor.items].filter((i: any) => REPLACED_TYPES.includes(i.type) || plan.issue.remove.includes(i.id));
  if (replaced.length) {
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: t('WOF.Lifepath.finish.replaceTitle') },
      classes: ['wof-pick'],
      content: `<p class="hint">${esc(t('WOF.Lifepath.finish.replaceHint'))}</p><ul>${replaced.map((i: any) => `<li>${esc(i.name)}</li>`).join('')}</ul>`,
    });
    if (!ok) return state;
  }

  const create = await Promise.all(
    plan.create.map(async (c) => {
      const data = await packData(c.pack, c.key);
      data.system = { ...data.system, ...c.system };
      return data;
    }),
  );
  if (plan.remove.length) await actor.deleteEmbeddedDocuments('Item', plan.remove);
  if (plan.update.length) await actor.updateEmbeddedDocuments('Item', plan.update.map((u) => ({ _id: u.id, ...Object.fromEntries(Object.entries(u.system).map(([k, v]) => [`system.${k}`, v])) })));
  await actor.createEmbeddedDocuments('Item', create);
  const done = markFinished(r.state, tables, opts);
  await actor.update({
    name: plan.name,
    'prototypeToken.name': plan.name,
    system: plan.system,
    [`flags.${SYSTEM_ID}.lifepath`]: done,
  });
  ui.notifications.info(t('WOF.Lifepath.finish.done', { name: plan.name }));
  return done;
}
