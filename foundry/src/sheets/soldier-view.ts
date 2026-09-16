/**
 * The plain view of a soldier the Svelte sheet renders: the actor's recorded fields, its derived
 * values, its embedded Items in sheet order, and each Action Catalog quick roll with its preview
 * pool. Rebuilt on every Foundry render and handed to Svelte as one raw state value.
 */
import { SYSTEM_ID } from '../config.ts';
import type { SoldierDerived } from '../rules/derived.ts';
import { healingDaysTotal, type InjuryType, type TypeRider } from '../rules/harm.ts';
import { previewPool, type PoolComponent, type PoolPenalty, type PoolPreview } from '../rules/pool.ts';
import type { MindEffect } from '../../tools/config-data.ts';
import { severityOf, type Severity } from './figure.ts';

export const ICONS = `systems/${SYSTEM_ID}/assets/icons`;
export const icon = (name: string) => `${ICONS}/${name}.webp`;

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export interface TalentView {
  id: string;
  talentId: string;
  name: string;
  img: string;
  type: 'dice' | 'rule';
  level: number;
  maxLevel: number;
  used: boolean;
  limit: string;
  hasLimit: boolean;
  text: string;
  forLine: string;
}

export interface GearView {
  id: string;
  name: string;
  img: string;
  icon: string;
  itemId: string;
  subtype: string;
  rated: boolean;
  rating: number;
  current: number;
  gearDice: number;
  kept: boolean;
  inHandles: boolean;
  loaded: boolean;
  mounted: boolean;
  side: 'left' | 'right' | null;
  itemsCounted: number;
  passable: boolean;
  position: { position: string | null; titan: string; left: boolean };
  status: { label: string; bad: boolean };
}

export interface InjuryView {
  id: string;
  n: number;
  name: string;
  img: string;
  row: string;
  location: string;
  locationLabel: string;
  side: 'left' | 'right' | null;
  sided: boolean;
  type: InjuryType;
  treated: boolean;
  timeLimit: string | null;
  healingLeft: number;
  healingTotal: number;
  halved: boolean;
  lethal: boolean;
  down: boolean;
  range: string;
  penaltyDice: number;
  effects: string[];
  permanent: string[];
  severity: Severity;
}

export interface RollView {
  id: string;
  name: string;
  kind: string;
  context: string;
  fixed: boolean;
  /** How many D6 a fixed roll throws. */
  fixedDice: number;
  attribute: string | null;
  pool: PoolPreview;
  /** Shown under the name: the pool's sources, or why it cannot be rolled. */
  why: string;
  blockedReason: string | null;
  icon: string;
}

export interface MindRowView {
  index: number;
  row: string;
  name: string;
  text: string;
  effects: string[];
  known: boolean;
}

export interface SoldierView {
  id: string;
  uuid: string;
  name: string;
  img: string;
  editable: boolean;
  isGM: boolean;
  system: any;
  derived: SoldierDerived;
  keyAttribute: string | null;
  attributeMax: Record<string, number>;
  specialty: { id: string; name: string; img: string; specialtyId: string; icon: string } | null;
  origin: { id: string; name: string; img: string; havens: string[]; canonTie: string } | null;
  talents: TalentView[];
  gear: GearView[];
  injuries: InjuryView[];
  rolls: RollView[];
  scars: MindRowView[];
  responses: (MindRowView & { ends: string; endsNote: string })[];
  comrades: { id: string; name: string }[];
  fullGas: number;
  bonusCap: number;
  notesHTML: string;
}

const specialtyIcon = (id: string) => icon(`specialty-${id}`);

const GEAR_ICONS: Record<string, string> = {
  'odm-gear': 'gear-odm',
  'blade-set': 'gear-blades',
  'flintlock-pistol': 'gear-firearm',
  musket: 'gear-firearm',
  horse: 'gear-horse',
  'medical-kit': 'gear-medical-kit',
  'tool-kit': 'gear-medical-kit',
  'prosthetic-arm': 'gear-prosthetic',
  'prosthetic-leg': 'gear-prosthetic',
};

const ACTION_ICONS: Record<string, string> = {
  'nape-strike': 'action-nape-strike',
  fly: 'action-fly',
  dodge: 'action-dodge',
  rally: 'action-rally',
  'fear-roll': 'harm-fear',
  'stress-response-roll': 'roll-stress',
  'gas-roll': 'gear-gas-canister',
  'death-roll': 'harm-death-roll',
  'treat-injury': 'gear-medical-kit',
  ride: 'gear-horse',
  shoot: 'gear-firearm',
};

/** Entry names joined as the sheet writes them. */
export function entryNames(ids: readonly string[]): string {
  const cat = CONFIG.WOF.actionCatalogById as Record<string, { name: string }>;
  return ids.map((id) => cat[id]?.name ?? id).join(', ');
}

/** One line per effect, in the sheet's short wording. */
export function effectLines(effects: readonly (MindEffect | Record<string, any>)[]): string[] {
  return effects.map((e: any) => {
    switch (e.type) {
      case 'penalty':
        return t('WOF.Sheet.effect.penalty', { dice: e.dice, entries: entryNames(e.entries ?? []) }) + (e.appliesTo ? ` (${e.appliesTo})` : '');
      case 'stress-gain':
        return t('WOF.Sheet.effect.stressGain', { amount: e.amount ?? 1 });
      case 'fear-roll-total':
        return t('WOF.Sheet.effect.fearRollTotal', { amount: e.amount ?? 1 });
      case 'push-stress':
        return t('WOF.Sheet.effect.pushStress', { amount: e.amount ?? 1 });
      case 'lose-successes':
        return t('WOF.Sheet.effect.loseSuccesses', { amount: e.amount ?? 1 });
      case 'spend-next-turn':
        return t('WOF.Sheet.effect.spendNextTurn');
      case 'zero-successes':
        return t('WOF.Sheet.effect.zeroSuccesses');
      default:
        return e.text ?? String(e.type);
    }
  });
}

function rangeLabel(r: { min: number | null; max: number | null }): string {
  if (r.min === null && r.max !== null) return t('WOF.Card.Injury.rangeUpTo', { max: r.max });
  if (r.max === null && r.min !== null) return t('WOF.Card.Injury.rangeFrom', { min: r.min });
  if (r.min === r.max) return String(r.min);
  return t('WOF.Card.Injury.range', { min: r.min, max: r.max });
}

function gearStatus(g: any, subtype: string): { label: string; bad: boolean } {
  const s = g.system;
  if (subtype === 'odm') return s.current <= 0 ? { label: t('WOF.Derived.jammed'), bad: true } : { label: t('WOF.Sheet.status.carried'), bad: false };
  if (subtype === 'horse') return s.current <= 0 ? { label: t('WOF.Derived.lame'), bad: true } : { label: s.mounted ? t('WOF.Sheet.status.mounted') : t('WOF.Sheet.status.dismounted'), bad: false };
  if (subtype === 'blade-set') return { label: s.in_handles ? t('WOF.Sheet.status.inHandles') : t('WOF.Sheet.status.carried'), bad: false };
  if (subtype === 'firearm') return { label: s.loaded ? t('WOF.Sheet.status.loaded') : t('WOF.Sheet.status.empty'), bad: !s.loaded };
  if (subtype === 'prosthetic') return { label: s.side ? t(`WOF.Side.${s.side}`) : t('WOF.Sheet.status.fitted'), bad: false };
  if (s.rated && s.current <= 0) {
    const state = (CONFIG.WOF.gearItems as { id: string; atZero: string | null }[]).find((x) => x.id === s.item_id)?.atZero;
    return { label: t(state && state !== 'none' ? `WOF.GearState.${state}` : 'WOF.Sheet.status.spent'), bad: true };
  }
  return { label: t('WOF.Sheet.status.carried'), bad: false };
}

const sortBy = (a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0) || a.name.localeCompare(b.name);

export function buildSoldierView(actor: any, opts: { editable: boolean; notesHTML: string; bonus: number }): SoldierView {
  const W = CONFIG.WOF;
  const sys = actor.system;
  const source = sys.toObject();
  const derived: SoldierDerived = sys.derived;
  const items = [...actor.items].sort(sortBy);

  const specialtyItem = items.find((i) => i.type === 'specialty');
  const originItem = items.find((i) => i.type === 'origin');
  const keyAttribute: string | null = specialtyItem?.system.key_attribute ?? null;
  const attributeMax = Object.fromEntries(
    W.attributes.map((a: { id: string }) => [a.id, a.id === keyAttribute ? W.attributeScale.maxKey : W.attributeScale.max]),
  );

  const talentItems = items.filter((i) => i.type === 'talent');
  const talents: TalentView[] = talentItems.map((i) => {
    const s = i.system;
    const isDice = s.type === 'dice';
    return {
      id: i.id,
      talentId: s.talent_id,
      name: i.name,
      img: i.img,
      type: s.type,
      level: s.level,
      maxLevel: s.max_level,
      used: s.used,
      limit: s.limit,
      hasLimit: s.limit !== 'none',
      text: isDice ? s.effect : [s.trigger, s.effect].filter(Boolean).join(' '),
      forLine: isDice
        ? t('WOF.Sheet.talentDice', { dice: s.effective_level, entries: entryNames(s.names) })
        : s.limit !== 'none'
          ? t(`WOF.TalentLimit.${s.limit}`)
          : entryNames(s.names),
    };
  });

  const gearItems = items.filter((i) => i.type === 'gear');
  const gear: GearView[] = gearItems.map((i) => {
    const s = i.system;
    return {
      id: i.id,
      name: i.name,
      img: i.img,
      icon: icon(GEAR_ICONS[s.item_id] ?? 'gear-odm'),
      itemId: s.item_id,
      subtype: s.subtype,
      rated: s.rated,
      rating: s.rating,
      current: s.current,
      gearDice: s.gear_dice,
      kept: s.kept,
      inHandles: s.in_handles,
      loaded: s.loaded,
      mounted: s.mounted,
      side: s.side,
      itemsCounted: s.items_counted,
      passable: s.passable,
      position: { ...s.position },
      status: gearStatus(i, s.subtype),
    };
  });

  const sided: string[] = W.sidedLocations;
  const injuryItems = items.filter((i) => i.type === 'critical-injury');
  const injuries: InjuryView[] = injuryItems.map((i, n) => {
    const s = i.system;
    const rd = s.row_data;
    const penaltyDice = (rd.effects as any[]).filter((e) => e.type === 'penalty').reduce((a, e) => a + e.dice, 0);
    const riders = s.type_riders as TypeRider[];
    return {
      id: i.id,
      n: n + 1,
      name: s.shown_name || i.name,
      img: icon(`injury-${s.injury_type}`),
      row: s.row,
      location: s.location,
      locationLabel: t(`WOF.InjuryLocation.${s.location}`),
      side: s.side,
      sided: sided.includes(s.location),
      type: s.injury_type,
      treated: s.treated,
      timeLimit: s.time_limit,
      healingLeft: s.healing_days_left,
      healingTotal: Math.max(healingDaysTotal(s.row, rd, s.injury_type, riders), s.healing_days_left),
      halved: s.halved,
      lethal: rd.lethal,
      down: rd.down === 'until_treated',
      range: rangeLabel(rd.results),
      penaltyDice,
      effects: effectLines(rd.effects),
      permanent: effectLines(rd.permanent_effects),
      severity: severityOf({ lethal: rd.lethal, instant_death: rd.instant_death, down: rd.down, healing_days: rd.healing_days, penaltyDice }),
    };
  });

  // Penalties the quick rolls read: held Critical Injuries, Scars, lasting Stress Responses, the next-roll penalty.
  const scarRows = new Map<string, any>(W.scars.map((r: any) => [r.id, r]));
  const responseRows = new Map<string, any>(W.stressResponses.map((r: any) => [r.id, r]));
  const penalties: PoolPenalty[] = [];
  for (const inj of injuryItems) {
    for (const e of inj.system.row_data.effects as any[]) {
      if (e.type === 'penalty') penalties.push({ source: inj.system.shown_name || inj.name, dice: e.dice, entries: e.entries });
    }
  }
  for (const sc of source.scars as { row: string }[]) {
    const row = scarRows.get(sc.row);
    for (const e of (row?.effects ?? []) as MindEffect[]) {
      if (e.type === 'penalty') penalties.push({ source: row.name, dice: e.dice ?? 0, entries: e.entries ?? [], conditional: e.appliesTo });
    }
  }
  for (const r of source.lasting_stress_responses as { row: string }[]) {
    const row = responseRows.get(r.row);
    for (const e of (row?.effects ?? []) as MindEffect[]) {
      if (e.type === 'penalty') penalties.push({ source: row.name, dice: e.dice ?? 0, entries: e.entries ?? [] });
    }
  }
  if (source.next_roll_penalty > 0) penalties.push({ source: t('WOF.Actor.Base.FIELDS.next_roll_penalty.label'), dice: source.next_roll_penalty, entries: 'all' });

  const poolTalents = talentItems.map((i) => ({
    id: i.system.talent_id,
    name: i.name,
    type: i.system.type,
    level: i.system.effective_level,
    names: i.system.names,
    condition: i.system.condition,
  }));
  const poolGear = gearItems
    .filter((i) => i.system.subtype !== 'blade-set' || i.system.in_handles)
    .map((i) => {
      // data/gear/items.yaml counts_as_not_had: ODM Gear with no gas; a horse the soldier is not mounted on
      // (the preview reads the mounted case; break-attention's dismounted Position case is judged at the roll).
      const notHad = (i.system.subtype === 'odm' && source.gas_rating <= 0) || (i.system.subtype === 'horse' && !i.system.mounted);
      return { itemId: i.system.item_id, name: i.name, dice: notHad ? 0 : i.system.gear_dice };
    });

  const exceptions = new Map<string, PoolComponent[]>();
  for (const r of W.rollExceptions as { entries: string[]; excluded: PoolComponent[]; roll: string }[]) {
    if (r.roll === 'passive-roll') continue; // a GM's secret roll; the open roll uses every component
    for (const e of r.entries) exceptions.set(e, r.excluded);
  }

  const attrName = (id: string | null) => (id ? t(`WOF.Attribute.${id}`) : '');
  const rolls: RollView[] = [];
  for (const e of W.actionCatalog as any[]) {
    const fixed = e.kind === 'fixed-roll';
    const rolled = e.rolled !== 'never' && e.kind !== 'option';
    if (!rolled || e.context === 'lifepath') continue;
    if (!fixed && !W.attributes.some((a: any) => a.id === e.attribute)) continue;
    const pool = previewPool({
      entry: e,
      attributes: source.attributes,
      talents: poolTalents,
      gear: poolGear,
      penalties,
      stress: derived.stress_effective,
      bonus: opts.bonus,
      bonusCap: W.bonusDiceCap,
      penaltyFloor: W.penaltyFloor,
      excluded: exceptions.get(e.id),
    });
    let blockedReason: string | null = null;
    if (pool.blocked === 'no-gear') blockedReason = t('WOF.Sheet.roll.noGear', { gear: e.gear.map((g: string) => W.gearItems.find((x: any) => x.id === g)?.name ?? g).join(', ') });
    const why = fixed
      ? t(`WOF.Sheet.roll.fixed.${e.id}`, { stress: derived.stress_effective, resolve: derived.resolve })
      : blockedReason ??
        [
          `${attrName(e.attribute)} ${pool.attribute?.dice ?? 0}`,
          pool.talent && `${pool.talent.name} +${pool.talent.dice}`,
          pool.bonus && `${t('WOF.Sheet.roll.bonus')} +${pool.bonus}`,
          ...pool.penalties.map((p) => `${p.source} −${p.dice}`),
          pool.attributeAlone ? t('WOF.Sheet.roll.attributeAlone') : pool.gear ? `${pool.gear.name} ${pool.gear.dice}` : t('WOF.Sheet.roll.noGearDice'),
          pool.stress ? `${t('WOF.Derived.stress')} ${pool.stress}` : null,
        ]
          .filter(Boolean)
          .join(' · ');
    rolls.push({
      id: e.id,
      name: e.name,
      kind: e.kind,
      context: e.context,
      fixed,
      fixedDice: e.id === 'gas-roll' ? W.gas.rollDice : 1,
      attribute: e.attribute ?? null,
      pool,
      why,
      blockedReason,
      icon: icon(ACTION_ICONS[e.id] ?? (e.attribute ? `attr-${e.attribute}` : 'harm-fear')),
    });
  }

  const scars: MindRowView[] = (source.scars as { row: string }[]).map((s, index) => {
    const row = scarRows.get(s.row);
    return { index, row: s.row, name: row?.name ?? s.row, text: row?.trigger ?? '', effects: effectLines(row?.effects ?? []), known: !!row };
  });
  const responses = (source.lasting_stress_responses as { row: string; ends: string; ends_note: string }[]).map((r, index) => {
    const row = responseRows.get(r.row);
    return {
      index,
      row: r.row,
      name: row?.name ?? r.row,
      text: row?.text ?? '',
      effects: effectLines(row?.effects ?? []),
      known: !!row,
      ends: r.ends,
      endsNote: r.ends_note,
    };
  });

  const comrades = [...(game.actors ?? [])]
    .filter((a: any) => a.id !== actor.id && (a.type === 'soldier' || a.type === 'squadmate'))
    .map((a: any) => ({ id: a.id, name: a.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    id: actor.id,
    uuid: actor.uuid,
    name: actor.name,
    img: actor.img,
    editable: opts.editable,
    isGM: !!game.user?.isGM,
    system: source,
    derived,
    keyAttribute,
    attributeMax,
    specialty: specialtyItem
      ? { id: specialtyItem.id, name: specialtyItem.name, img: specialtyItem.img, specialtyId: specialtyItem.system.specialty_id, icon: specialtyIcon(specialtyItem.system.specialty_id) }
      : null,
    origin: originItem
      ? { id: originItem.id, name: originItem.name, img: originItem.img, havens: [...originItem.system.haven_choice], canonTie: originItem.system.canon_tie?.character ?? '' }
      : null,
    talents,
    gear,
    injuries,
    rolls,
    scars,
    responses,
    comrades,
    fullGas: W.gas.full,
    bonusCap: W.bonusDiceCap,
    notesHTML: opts.notesHTML,
  };
}
