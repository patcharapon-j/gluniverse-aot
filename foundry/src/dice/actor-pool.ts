/**
 * What a soldier or Squadmate brings to any roll, read from the actor: attributes, dice Talents,
 * gear that can give Gear Dice, the penalties they carry, and the states that forbid a roll. The
 * sheet's quick rolls and the roll dialog both build their pools from this.
 */
import type { MindEffect } from '../../tools/config-data.ts';
import type { AttributeId } from '../rules/derived.ts';
import type { PoolComponent, PoolGear, PoolInputs, PoolPenalty, PoolTalent } from '../rules/pool.ts';
import type { ResponseEffect } from '../rules/roll.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export interface ActorPool {
  actor: any;
  attributes: Record<AttributeId, number>;
  talents: PoolTalent[];
  gear: PoolGear[];
  penalties: PoolPenalty[];
  stress: number;
  resolve: number;
  down: boolean;
  squadmate: boolean;
  /** Ids of the lasting Stress Responses held. */
  heldResponses: string[];
  /** Effects of the lasting Stress Responses held (Wound Tight's push-stress). */
  heldEffects: ResponseEffect[];
  odm: { id: string; current: number } | null;
  gas: number;
  nextRollPenalty: number;
  /** Rule Talents held (level above 0) by Talent id, with the embedded item id and used mark. */
  ruleTalents: Map<string, { id: string; used: boolean; limited: boolean; name: string }>;
}

export interface RollException {
  roll: string;
  entries: string[];
  excluded: PoolComponent[];
  pushAllowed: boolean;
  coverAllowed: boolean;
  circumstances: boolean;
  secret: boolean;
  stressResponse: boolean;
}

/** The roll_exceptions row for an entry. The passive roll is a GM choice, not an entry default. */
export function exceptionFor(entryId: string, passive = false): RollException | null {
  const rows = CONFIG.WOF.rollExceptions as RollException[];
  return rows.find((r) => r.entries.includes(entryId) && (passive ? r.roll === 'passive-roll' : r.roll !== 'passive-roll')) ?? null;
}

export function actorPool(actor: any): ActorPool {
  const W = CONFIG.WOF;
  const sys = actor.system;
  const source = sys.toObject();
  const items = [...actor.items];
  const scarRows = new Map<string, any>(W.scars.map((r: any) => [r.id, r]));
  const responseRows = new Map<string, any>(W.stressResponses.map((r: any) => [r.id, r]));

  const penalties: PoolPenalty[] = [];
  for (const inj of items.filter((i) => i.type === 'critical-injury')) {
    const name = inj.system.shown_name || inj.name;
    for (const e of inj.system.row_data.effects as any[]) {
      if (e.type === 'penalty') penalties.push({ source: name, dice: e.dice, entries: e.entries });
    }
  }
  for (const sc of source.scars as { row: string }[]) {
    const row = scarRows.get(sc.row);
    for (const e of (row?.effects ?? []) as MindEffect[]) {
      if (e.type === 'penalty') penalties.push({ source: row.name, dice: e.dice ?? 0, entries: e.entries ?? [], conditional: e.appliesTo });
    }
  }
  const heldEffects: ResponseEffect[] = [];
  for (const r of source.lasting_stress_responses as { row: string }[]) {
    const row = responseRows.get(r.row);
    for (const e of (row?.effects ?? []) as MindEffect[]) {
      if (e.type === 'penalty') penalties.push({ source: row.name, dice: e.dice ?? 0, entries: e.entries ?? [] });
      else heldEffects.push({ type: e.type, amount: e.amount });
    }
  }
  if (source.next_roll_penalty > 0) penalties.push({ source: t('WOF.Actor.Base.FIELDS.next_roll_penalty.label'), dice: source.next_roll_penalty, entries: 'all' });

  const talentItems = items.filter((i) => i.type === 'talent');
  const talents: PoolTalent[] = talentItems.map((i) => ({
    id: i.system.talent_id,
    name: i.name,
    type: i.system.type,
    level: i.system.effective_level,
    names: i.system.names,
    condition: i.system.condition,
  }));
  const ruleTalents = new Map<string, { id: string; used: boolean; limited: boolean; name: string }>();
  for (const i of talentItems) {
    if (i.system.type === 'rule' && i.system.effective_level > 0) ruleTalents.set(i.system.talent_id, { id: i.id, used: i.system.used, limited: i.system.limit !== 'none', name: i.name });
  }

  const gearItems = items.filter((i) => i.type === 'gear');
  const gear: PoolGear[] = gearItems
    .filter((i) => i.system.subtype !== 'blade-set' || i.system.in_handles)
    .map((i) => {
      // data/gear/items.yaml counts_as_not_had: ODM Gear with no gas; a horse the soldier is not mounted on.
      const notHad = (i.system.subtype === 'odm' && source.gas_rating <= 0) || (i.system.subtype === 'horse' && !i.system.mounted);
      return { id: i.id, itemId: i.system.item_id, name: i.name, dice: notHad ? 0 : i.system.gear_dice };
    });
  const odmItem = gearItems.find((i) => i.system.subtype === 'odm');

  const derived = sys.derived;
  return {
    actor,
    attributes: source.attributes,
    talents,
    gear,
    penalties,
    stress: derived.stress_effective,
    resolve: derived.resolve,
    down: !!(source.down || derived.down_by_rule),
    squadmate: actor.type === 'squadmate',
    heldResponses: (source.lasting_stress_responses as { row: string }[]).map((r) => r.row),
    heldEffects,
    odm: odmItem ? { id: odmItem.id, current: odmItem.system.current } : null,
    gas: source.gas_rating,
    nextRollPenalty: source.next_roll_penalty,
    ruleTalents,
  };
}

/** The pool inputs for one entry, before the dialog's choices. */
export function poolInputs(ap: ActorPool, entry: any, opts: { bonus?: number; passive?: boolean } = {}): PoolInputs {
  const ex = exceptionFor(entry.id, opts.passive);
  return {
    entry,
    attributes: ap.attributes,
    talents: ap.talents,
    gear: ap.gear,
    penalties: ap.penalties,
    stress: ap.stress,
    bonus: opts.bonus ?? 0,
    bonusCap: CONFIG.WOF.bonusDiceCap,
    penaltyFloor: CONFIG.WOF.penaltyFloor,
    excluded: ex?.excluded,
    talentWhenAlone: entry.id === 'field-repair' && ap.ruleTalents.has('make-do'),
  };
}

/**
 * Why an entry cannot be rolled now, as a sentence for the quick-roll row and the dialog, or null.
 * Down forbids every attribute roll but the Death Roll, and every Fear Roll (data/harm/down.yaml,
 * while_down); a Nape strike needs ODM Gear that counts as had (data/gear/odm-gear.yaml, strikes).
 * Requirements that depend on the fight (Positions, Attention, Grabbed) and the lost-limb grades'
 * forbidden entries are the table's to judge until the tracker (milestone 4) records them.
 */
function groundedTitanInScene(): boolean {
  const tokens = (globalThis as any).canvas?.scene?.tokens ?? [];
  return [...tokens].some((tok: any) => tok.actor?.type === 'titan' && tok.actor.system.grounded && !tok.actor.system.corpse);
}

export function entryBlock(ap: ActorPool, entry: any): string | null {
  if (ap.down && entry.id !== 'death-roll' && entry.id !== 'gas-roll') {
    return entry.id === 'fear-roll' ? t('WOF.Roll.block.downFear') : t('WOF.Roll.block.down');
  }
  // A Titan grounded by a Broken leg lifts the ODM requirement (titan-harm.yaml, grounded); the
  // system reads it from the Titans on the viewed scene.
  if (entry.id === 'nape-strike' && !groundedTitanInScene()) {
    if (!ap.odm) return t('WOF.Roll.block.noOdm');
    if (ap.odm.current <= 0) return t('WOF.Roll.block.jammed');
    if (ap.gas <= 0) return t('WOF.Roll.block.dry');
  }
  if (entry.id === 'gas-roll' && !ap.odm) return t('WOF.Roll.block.noOdm');
  return null;
}
