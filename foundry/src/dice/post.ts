/**
 * Shared steps of every roll card: posting and saving the card, rolling a Stress Response, and the
 * ops a Stress Response or a called roll's stakes leave (ADR-0026).
 */
import { SYSTEM_ID } from '../config.ts';
import { responseRow, tableTotal, type ApplyCategory, type Op } from '../rules/roll.ts';
import type { ActorPool } from './actor-pool.ts';
import { ops } from './apply.ts';
import { FLAG, plainSummary, successesOf, type ActionCard, type Card, type ResponseRoll } from './card.ts';
import { writeCard } from './proxy.ts';
import { showDice } from './terms.ts';

export const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export const clock = () => new Date().toTimeString().slice(0, 5);

export const cardOf = (message: any): Card | undefined => message?.getFlag?.(SYSTEM_ID, FLAG);

export const holds = (ap: ActorPool, id: string) => ap.ruleTalents.has(id);

/** A limited Talent that has not been used, or an unlimited one; null when not held. */
export function readyTalent(ap: ActorPool, id: string) {
  const x = ap.ruleTalents.get(id);
  if (!x) return null;
  return x.limited && x.used ? null : x;
}

/** Marks a limited Talent used, as its own op so Undo gives the use back. Null for an unlimited Talent. */
export function usedTalentOp(ap: ActorPool, id: string, cat: ApplyCategory): Op | null {
  const x = ap.ruleTalents.get(id);
  if (!x?.limited) return null;
  const item = ap.actor.items.get(x.id);
  return ops.set(cat, ap.actor, item, 'system.used', false, true, t('WOF.Roll.op.talentUsed', { name: x.name }));
}

export async function postCard(actor: any, card: Card, rolls: any[], mode?: string): Promise<any> {
  const Msg = foundry.utils.getDocumentClass('ChatMessage');
  const data: Record<string, any> = {
    author: game.user.id,
    speaker: Msg.getSpeaker({ actor }),
    content: `<p class="wof-summary">${foundry.utils.escapeHTML(plainSummary(card))}</p>`,
    rolls,
    flags: { [SYSTEM_ID]: { [FLAG]: card } },
  };
  if (rolls.length) data.sound = CONFIG.sounds.dice;
  Msg.applyMode(data, mode);
  return Msg.create(data);
}

/** Writes the card back to its message (through the GM when the user did not post it). */
export async function saveCard(message: any, card: Card, rolls?: any[]): Promise<boolean> {
  return writeCard(message, card, rolls?.map((r) => (typeof r === 'string' ? r : JSON.stringify(r))));
}

/** The lasting Stress Response's end, as the sheet records it (data/harm/sheet-fields.yaml). */
function responseEnds(): string {
  return game.combat?.started ? 'titan-engagement-end' : 'day';
}

/**
 * Rolls a Stress Response: D6 + Stress - Resolve, Iron Nerve counting Resolve 1 higher, moved past
 * lasting rows already held (data/mind/stress-responses.yaml). Returns the roll, the card's line,
 * and the ops its row leaves (the lasting result held, Everything Slips' Stress).
 */
export async function rollResponse(ap: ActorPool, stress: number, opts: { show?: boolean } = {}): Promise<{ roll: any; response: ResponseRoll; ops: Op[] }> {
  const roll = await new foundry.dice.Roll('1d6').evaluate();
  if (opts.show) await showDice(roll);
  const d6 = roll.total as number;
  const bonus = holds(ap, 'iron-nerve') ? 1 : 0;
  const total = tableTotal(d6, stress, ap.resolve, bonus);
  const rows = CONFIG.WOF.stressResponses as { id: string; name: string; min: number | null; max: number | null; lasting: boolean; text: string; effects: any[]; effectText: string[] }[];
  const row = responseRow(rows, total, ap.heldResponses);
  const response: ResponseRoll = {
    d6,
    stress,
    resolve: ap.resolve,
    bonus,
    total,
    row: row.id,
    name: row.name,
    lasting: row.lasting,
    text: row.text,
    effects: row.effects.map((e) => ({ type: e.type, amount: e.amount, dice: e.dice })),
    lines: row.effectText,
    rerolled: false,
  };
  const out: Op[] = [];
  if (row.lasting) {
    out.push({ ...ops.add('stressResponse', ap.actor, 'system.lasting_stress_responses', { row: row.id, ends: responseEnds(), ends_note: '' }, t('WOF.Roll.op.lasting', { name: row.name })), response: true });
  }
  for (const e of row.effects) {
    if (e.type === 'stress-gain') out.push({ ...ops.stress(ap.actor, e.amount ?? 1, t('WOF.Roll.op.stress', { n: e.amount ?? 1, why: row.name })), response: true });
  }
  return { roll, response, ops: out };
}

/** A failed called roll whose stakes were Stress costs 1 Stress, once, however often it was Pushed (stress-changes.yaml, ruling). */
export function stakesOps(card: ActionCard, actor: any): Op[] {
  if (card.stakes?.id !== 'stress' || card.needs === null || card.attack) return [];
  if (successesOf(card) >= card.needs) return [];
  return [{ ...ops.stress(actor, 1, t('WOF.Roll.op.stakes')), outcome: true }];
}

/** Picks one of the user's own soldiers (or the GM's pick of any), for Cover and Dodge. */
export async function pickSoldier(candidates: any[], title: string): Promise<any | null> {
  if (!candidates.length) {
    ui.notifications.warn(t('WOF.Roll.noSoldier'));
    return null;
  }
  if (candidates.length === 1) return candidates[0];
  const options = candidates.map((a) => `<option value="${a.uuid}">${foundry.utils.escapeHTML(a.name)}</option>`).join('');
  const result = await foundry.applications.api.DialogV2.input({
    window: { title },
    classes: ['wof-pick'],
    content: `<label class="wof-field"><span>${foundry.utils.escapeHTML(t('WOF.Roll.pickSoldier'))}</span><select name="uuid">${options}</select></label>`,
    ok: { label: t('WOF.Roll.choose') },
  });
  return result?.uuid ? foundry.utils.fromUuid(result.uuid) : null;
}

/** Soldiers (and, unless only player characters may act, Squadmates) this user owns; for the GM, every one. */
export function ownSoldiers(except: string[] = [], playerCharactersOnly = false): any[] {
  return [...(game.actors ?? [])]
    .filter((a: any) => (a.type === 'soldier' || (!playerCharactersOnly && a.type === 'squadmate')) && a.isOwner && !except.includes(a.uuid))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));
}
