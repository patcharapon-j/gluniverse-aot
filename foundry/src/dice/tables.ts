/**
 * Fixed rolls read on a table (core-plan 2d): the Fear Roll and the Stress Response roll (D6 +
 * Stress - Resolve; data/mind/fear-rolls.yaml, stress-responses.yaml) and the Gas Roll (count the
 * 1s; data/gear/odm-gear.yaml, gas_roll). None of them is Pushed, Helped, or given Circumstances.
 */
import { SYSTEM_ID } from '../config.ts';
import { gasAfter, gasRollDice, tableRow, tableTotal, type Op } from '../rules/roll.ts';
import { effectLines } from '../sheets/soldier-view.ts';
import { actorPool, entryBlock, type ActorPool } from './actor-pool.ts';
import { applyNew, ops } from './apply.ts';
import type { GasCard, ResponseRoll, TableCard } from './card.ts';
import { clock, postCard, readyTalent, rollResponse, t, usedTalentOp } from './post.ts';

/** Set when a Pushed roll's gear item was ODM Gear, read (and cleared) by the round's Gas Roll. */
export const PUSHED_ODM_FLAG = `flags.${SYSTEM_ID}.pushedOdm`;

const esc = (s: string) => foundry.utils.escapeHTML(s);

function blocked(ap: ActorPool, id: string): boolean {
  const reason = entryBlock(ap, CONFIG.WOF.actionCatalogById[id]);
  if (reason) ui.notifications.warn(`${CONFIG.WOF.actionCatalogById[id].name}: ${reason}`);
  return !!reason;
}

/** The ops a Fear row leaves: Stress, a next-roll penalty, a pending forced move or strike. The rest is read from the card. */
export function fearOps(actor: any, row: { name: string; effects: any[] }): Op[] {
  const out: Op[] = [];
  for (const e of row.effects) {
    if (e.type === 'stress-gain') out.push(ops.stress(actor, e.amount ?? 1, t('WOF.Roll.op.stress', { n: e.amount ?? 1, why: row.name })));
    if (e.type === 'next-roll-penalty') {
      const now = actor.system.next_roll_penalty ?? 0;
      out.push(ops.num('fear', actor, null, 'system.next_roll_penalty', now, now + (e.dice ?? 1), t('WOF.Roll.op.penalty', { n: e.dice ?? 1 })));
    }
    if (e.type === 'forced-move') out.push(ops.add('fear', actor, 'system.pending_fear_results', { effect: 'forced-move', toward: e.toward ?? 'distant', titan: '' }, t('WOF.Roll.op.forcedMove')));
    if (e.type === 'forced-action') out.push(ops.add('fear', actor, 'system.pending_fear_results', { effect: 'forced-action', toward: '', titan: '' }, t('WOF.Roll.op.forcedAction')));
  }
  return out;
}

export async function rollFear(actor: any): Promise<any> {
  const ap = actorPool(actor);
  if (blocked(ap, 'fear-roll')) return null;
  const W = CONFIG.WOF;
  const triggers = W.fearTriggers as { id: string; event: string }[];
  const steady = readyTalent(ap, 'steady-heart');
  const options = triggers.map((x) => `<option value="${x.id}">${esc(t(`WOF.Roll.fear.triggers.${x.id}`))}</option>`).join('');
  const result = await foundry.applications.api.DialogV2.input({
    window: { title: t('WOF.Roll.fear.title') },
    classes: ['wof-pick'],
    content: `<p class="hint">${esc(t('WOF.Roll.fear.hint', { stress: ap.stress, resolve: ap.resolve }))}</p>
<label class="wof-field"><span>${esc(t('WOF.Roll.fear.trigger'))}</span><select name="trigger">${options}</select></label>
${steady ? `<p class="hint">${esc(t('WOF.Roll.fear.steady', { name: steady.name }))}</p>` : ''}`,
    ok: { label: t('WOF.Roll.dialog.roll') },
  });
  if (!result) return null;
  const trigger = String(result.trigger ?? '');
  const steadyUsed = !!steady && (trigger === 'comrade-grabbed' || trigger === 'comrade-dies');

  const roll = await new foundry.dice.Roll('1d6').evaluate();
  const d6 = roll.total as number;
  const bonus = steadyUsed ? 1 : 0;
  const total = tableTotal(d6, ap.stress, ap.resolve, bonus);
  const row = tableRow(W.fearRows as { id: string; name: string; min: number | null; max: number | null; text: string; effects: any[] }[], total);
  const response: ResponseRoll = {
    d6,
    stress: ap.stress,
    resolve: ap.resolve,
    bonus,
    total,
    row: row.id,
    name: row.name,
    lasting: false,
    text: row.text,
    effects: row.effects,
    lines: effectLines(row.effects),
    rerolled: false,
  };
  const fresh = fearOps(actor, row);
  if (steadyUsed) {
    const used = usedTalentOp(ap, 'steady-heart', 'fear');
    if (used) fresh.push(used);
  }
  const card: TableCard = {
    v: 1,
    kind: 'table',
    table: 'fear',
    actor: actor.uuid,
    actorName: actor.name,
    img: actor.img,
    time: clock(),
    ops: await applyNew(fresh),
    trigger: t(`WOF.Roll.fear.triggers.${trigger}`),
    response,
    shrugged: false,
    gasRoll: row.effects.some((e) => e.type === 'gas-roll'),
  };
  return postCard(actor, card, [roll]);
}

export async function rollStressResponse(actor: any): Promise<any> {
  const ap = actorPool(actor);
  if (blocked(ap, 'stress-response-roll')) return null;
  const r = await rollResponse(ap, ap.stress);
  const card: TableCard = {
    v: 1,
    kind: 'table',
    table: 'stress-response',
    actor: actor.uuid,
    actorName: actor.name,
    img: actor.img,
    time: clock(),
    ops: await applyNew(r.ops),
    trigger: null,
    response: r.response,
    shrugged: false,
    gasRoll: false,
  };
  return postCard(actor, card, [r.roll]);
}

/** The Gas Roll: two dice, three after a Pushed ODM Gear roll this round (Light Trigger: two), 1s lower the Gas Rating. */
export async function rollGas(actor: any, opts: { pushedOdm?: boolean } = {}): Promise<any> {
  const ap = actorPool(actor);
  if (blocked(ap, 'gas-roll')) return null;
  const W = CONFIG.WOF;
  const flagged = !!foundry.utils.getProperty(actor, PUSHED_ODM_FLAG);
  const light = readyTalent(ap, 'light-trigger');
  const result = ap.squadmate
    ? { pushed: false, light: false }
    : await foundry.applications.api.DialogV2.input({
        window: { title: t('WOF.Roll.gas.title') },
        classes: ['wof-pick'],
        content: `<p class="hint">${esc(t('WOF.Roll.gas.hint', { gas: ap.gas }))}</p>
<label class="wof-check"><input type="checkbox" name="pushed" ${opts.pushedOdm || flagged ? 'checked' : ''}> ${esc(t('WOF.Roll.gas.pushed', { n: W.gas.rollDicePushed }))}</label>
${light ? `<label class="wof-check"><input type="checkbox" name="light" checked> ${esc(t('WOF.Roll.gas.useLight', { name: light.name }))}</label>` : ''}`,
        ok: { label: t('WOF.Roll.dialog.roll') },
      });
  if (!result) return null;
  const n = gasRollDice({
    standard: W.gas.rollDice,
    pushed: W.gas.rollDicePushed,
    maximum: W.gas.rollDiceMax,
    squadmateDice: W.gas.rollDiceSquadmate,
    squadmate: ap.squadmate,
    pushedOdmThisRound: !!result.pushed,
    lightTrigger: !!light && !!result.light,
  });
  const roll = await new foundry.dice.Roll(`${n.dice}d6`).evaluate();
  const faces = roll.dice.flatMap((d: any) => d.results.map((r: any) => r.result as number));
  const gas = gasAfter(ap.gas, faces);
  const fresh: Op[] = [];
  if (gas.lost) fresh.push(ops.num('gas', actor, null, 'system.gas_rating', ap.gas, gas.after, t('WOF.Roll.op.gas', { from: ap.gas, to: gas.after }), 0, W.gas.full));
  if (n.lightTriggerUsed) {
    const used = usedTalentOp(ap, 'light-trigger', 'gas');
    if (used) fresh.push(used);
  }
  if (flagged) fresh.push(ops.set('gas', actor, null, PUSHED_ODM_FLAG, true, false, t('WOF.Roll.op.pushedOdmCleared')));
  const card: GasCard = {
    v: 1,
    kind: 'gas',
    actor: actor.uuid,
    actorName: actor.name,
    img: actor.img,
    time: clock(),
    ops: await applyNew(fresh),
    faces,
    lost: gas.lost,
    from: ap.gas,
    to: gas.after,
    lightTrigger: n.lightTriggerUsed,
  };
  return postCard(actor, card, [roll]);
}
