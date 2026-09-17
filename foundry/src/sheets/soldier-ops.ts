/**
 * The changes the Soldier sheet makes to its actor. Each is one document update, so Foundry's
 * render follows and the Svelte view is rebuilt from the new data.
 */
import { changeCanister, gainedInjuryState, healthLostAfterClick, stressAfterClick, type InjuryType, type Side } from '../rules/harm.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export function setField(actor: any, path: string, value: unknown) {
  return actor.update({ [path]: value });
}

export function setItem(actor: any, id: string, data: Record<string, unknown>) {
  return actor.items.get(id)?.update(data);
}

export function openItem(actor: any, id: string) {
  return actor.items.get(id)?.sheet?.render({ force: true });
}

export async function deleteItem(actor: any, id: string) {
  const item = actor.items.get(id);
  if (!item) return;
  const ok = await foundry.applications.api.DialogV2.confirm({
    window: { title: t('WOF.Sheet.remove.title') },
    content: `<p>${foundry.utils.escapeHTML(t('WOF.Sheet.remove.body', { name: item.name }))}</p>`,
  });
  if (ok) return item.delete();
}

export function clickHealthBox(actor: any, index: number) {
  const d = actor.system.derived;
  const next = healthLostAfterClick(index, d.health, d.boxes_crossed_off, actor.system.health_lost);
  if (next === actor.system.health_lost) return null;
  return actor.update({ 'system.health_lost': next });
}

export function clickStressBox(actor: any, index: number) {
  const d = actor.system.derived;
  return actor.update({ 'system.stress': stressAfterClick(index, d.stress_effective, d.minimum_stress) });
}

export function stepStress(actor: any, by: number) {
  const d = actor.system.derived;
  return actor.update({ 'system.stress': Math.max(d.minimum_stress, d.stress_effective + by) });
}

export function spendGas(actor: any) {
  const g = actor.system.gas_rating;
  if (g <= 0) return null;
  return actor.update({ 'system.gas_rating': g - 1 });
}

export function fitCanister(actor: any, index: number) {
  const next = changeCanister(actor.system.gas_rating, actor.system.spare_canisters, index);
  return next ? actor.update({ 'system.gas_rating': next.gas_rating, 'system.spare_canisters': next.spare_canisters }) : null;
}

export function setSpares(actor: any, spares: number[]) {
  return actor.update({ 'system.spare_canisters': spares });
}

/** Any wear ruins a Blade Set: it is discarded and the handles are empty (data/gear/blade-sets.yaml). */
export function ruinBladeInHandles(actor: any) {
  const set = actor.items.find((i: any) => i.type === 'gear' && i.system.subtype === 'blade-set' && i.system.in_handles);
  return set?.delete();
}

/**
 * Swap Blade Set (data/gear/blade-sets.yaml, swap): fit a carried Blade Set into empty handles. In a
 * Titan Engagement it spends the soldier's move and never the action, so a soldier whose move is
 * already spent cannot swap this turn (decision batch 10, OQ-185). Outside one it spends nothing.
 */
export async function fitBladeSet(actor: any, id?: string) {
  const sets = actor.items.filter((i: any) => i.type === 'gear' && i.system.subtype === 'blade-set');
  const pick = id ? sets.find((i: any) => i.id === id) : sets.find((i: any) => !i.system.in_handles);
  const { swapBladeSetBlock } = await import('../rules/engagement/positions.ts');
  const { currentEngagement } = await import('../tracker/combat.ts');
  const { snapshot } = await import('../tracker/snapshot.ts');
  const combat = currentEngagement();
  const inEngagement = !!combat && combat.system.mode === 'titan' && (combat.system.soldiers as string[]).includes(actor.id);
  const snap = inEngagement ? snapshot(combat) : null;
  const state = snap?.soldiers.find((x) => x.id === actor.id);
  const why = swapBladeSetBlock(state ?? { alive: !actor.statuses?.has?.('dead'), down: !!actor.system.down } as any, {
    inEngagement,
    handlesFull: sets.some((i: any) => i.system.in_handles),
    carries: !!pick,
    moveSpent: !!snap?.movesSpent.includes(actor.id),
    grabbed: !!snap?.titans.some((x) => x.status === 'focus' && x.grab?.soldier === actor.id),
  });
  if (why) {
    ui.notifications?.warn(t(`WOF.Tracker.swapBlades.${why}`));
    return null;
  }
  await pick.update({ 'system.in_handles': true });
  if (inEngagement) {
    const { markMoveSpent } = await import('../tracker/engine.ts');
    await markMoveSpent(combat, actor.id);
  }
  return pick;
}

export function setListEntry(actor: any, field: string, index: number, patch: Record<string, unknown>) {
  const list = foundry.utils.deepClone(foundry.utils.getProperty(actor.system.toObject(), field)) as any[];
  if (!list[index]) return null;
  list[index] = { ...list[index], ...patch };
  return actor.update({ [`system.${field}`]: list });
}

export function addListEntry(actor: any, field: string, entry: unknown) {
  const list = foundry.utils.deepClone(foundry.utils.getProperty(actor.system.toObject(), field)) as unknown[];
  list.push(entry);
  return actor.update({ [`system.${field}`]: list });
}

export function removeListEntry(actor: any, field: string, index: number) {
  const list = foundry.utils.deepClone(foundry.utils.getProperty(actor.system.toObject(), field)) as unknown[];
  list.splice(index, 1);
  return actor.update({ [`system.${field}`]: list });
}

/** Asks for the Injury Type and side of a dropped Critical Injury row (owner decision: chosen when applied). */
export async function chooseInjury(item: any): Promise<{ type: InjuryType; side: Side | null } | null> {
  const W = CONFIG.WOF;
  const sided = W.sidedLocations.includes(item.system.location);
  const esc = foundry.utils.escapeHTML;
  const types = W.injuryTypes
    .map((x: { id: string }) => `<option value="${x.id}">${esc(t(`WOF.InjuryType.${x.id}`))}: ${esc(item.system.row_data.names[x.id])}</option>`)
    .join('');
  const side = sided
    ? `<div class="form-group"><label>${esc(t('WOF.Item.CriticalInjury.FIELDS.side.label'))}</label><select name="side"><option value="left">${esc(t('WOF.Side.left'))}</option><option value="right">${esc(t('WOF.Side.right'))}</option></select></div>`
    : '';
  const result = await foundry.applications.api.DialogV2.input({
    window: { title: t('WOF.Sheet.injury.dialogTitle', { name: item.name }) },
    content: `<p class="hint">${esc(t('WOF.Sheet.injury.dialogHint'))}</p><div class="form-group"><label>${esc(t('WOF.Item.CriticalInjury.FIELDS.injury_type.label'))}</label><select name="type">${types}</select></div>${side}`,
    ok: { label: t('WOF.Sheet.injury.apply') },
  });
  if (!result) return null;
  return { type: result.type as InjuryType, side: sided ? ((result.side as Side) ?? 'left') : null };
}

/** The item data for a Critical Injury row gained with its type and side. */
export function injuryData(item: any, choice: { type: InjuryType; side: Side | null }) {
  const data = item.toObject();
  const { state } = gainedInjuryState({
    rowId: item.system.row,
    location: item.system.location,
    row: item.system.row_data,
    riders: item.system.type_riders,
    type: choice.type,
    side: choice.side,
    sidedLocations: CONFIG.WOF.sidedLocations,
  });
  Object.assign(data.system, state);
  data.name = item.system.row_data.names[choice.type] || data.name;
  return data;
}
