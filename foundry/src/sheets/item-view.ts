/**
 * The plain view the item slips render (core-plan 2c): one per Item type, with the names the ids in
 * its fields point at, so the slip never shows a bare id.
 */
import { healingDaysTotal, type TypeRider } from '../rules/harm.ts';
import { effectLines, entryNames, icon } from './soldier-view.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export const TALENT_LIMITS = ['none', 'once_per_titan_engagement', 'once_per_leg', 'once_per_night_camp', 'once_per_skirmish', 'once_per_downtime'];

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

export interface Named {
  id: string;
  name: string;
}

export interface ItemView {
  id: string;
  uuid: string;
  type: 'talent' | 'specialty' | 'origin' | 'gear' | 'critical-injury';
  name: string;
  img: string;
  icon: string;
  typeLabel: string;
  editable: boolean;
  embedded: boolean;
  ownerName: string;
  system: any;
  htmlField: 'description' | 'summary';
  html: string;
  enriched: string;
  // talent
  entries: Named[];
  specialties: Named[];
  conditions: { entry: string; text: string }[];
  // specialty and origin
  talents: Named[];
  attributes: Named[];
  // gear
  gearDiceFor: Named[];
  // critical injury
  injury: {
    names: { type: string; name: string }[];
    sided: boolean;
    range: string;
    effects: string[];
    permanent: string[];
    healingTotal: number;
    locationLabel: string;
    shownName: string;
    riders: string[];
  } | null;
}

function rangeLabel(r: { min: number | null; max: number | null }): string {
  if (r.min === null && r.max !== null) return t('WOF.Card.Injury.rangeUpTo', { max: r.max });
  if (r.max === null && r.min !== null) return t('WOF.Card.Injury.rangeFrom', { min: r.min });
  if (r.min === r.max) return String(r.min);
  return t('WOF.Card.Injury.range', { min: r.min, max: r.max });
}

function riderLine(r: TypeRider): string {
  const sets = r.rider.sets ?? {};
  const bits: string[] = [];
  if (sets.time_limit) bits.push(t('WOF.ItemSheet.rider.timeLimit', { limit: t(`WOF.TimeLimit.${sets.time_limit}`) }));
  if (sets.healing_days_multiplier) bits.push(t('WOF.ItemSheet.rider.healing', { n: sets.healing_days_multiplier }));
  if (sets.heals_untreated === false) bits.push(t('WOF.ItemSheet.rider.noHealUntreated'));
  if (r.rider.treat_injury) bits.push(t('WOF.ItemSheet.rider.treat'));
  return `${t(`WOF.InjuryType.${r.injury_type}`)}: ${bits.join('; ') || t('WOF.ItemSheet.rider.other')}`;
}

export function itemIcon(item: any): string {
  switch (item.type) {
    case 'talent':
      return icon(item.system.type === 'dice' ? 'talent-dice' : 'talent-rule');
    case 'specialty':
      return icon(`specialty-${item.system.specialty_id || 'slayer'}`);
    case 'origin':
      return icon('brand-emblem');
    case 'gear':
      return icon(GEAR_ICONS[item.system.item_id] ?? 'gear-odm');
    default:
      return icon(`injury-${item.system.injury_type}`);
  }
}

export function buildItemView(item: any, opts: { editable: boolean; enriched: string }): ItemView {
  const W = CONFIG.WOF;
  const s = item.system.toObject();
  const htmlField = item.type === 'specialty' ? 'summary' : 'description';
  const catalog = W.actionCatalogById as Record<string, { name: string }>;
  const specialtyName = (id: string) => (W.specialties as any[]).find((x) => x.id === id)?.name ?? id;
  const talentName = (id: string) => (W.talentNames as Record<string, string>)[id] ?? id;
  const view: ItemView = {
    id: item.id,
    uuid: item.uuid,
    type: item.type,
    name: item.name,
    img: item.img,
    icon: itemIcon(item),
    typeLabel: t(`TYPES.Item.${item.type}`),
    editable: opts.editable,
    embedded: !!item.parent,
    ownerName: item.parent?.name ?? '',
    system: s,
    htmlField,
    html: s[htmlField] ?? '',
    enriched: opts.enriched,
    entries: [],
    specialties: [],
    conditions: [],
    talents: [],
    attributes: [],
    gearDiceFor: [],
    injury: null,
  };
  switch (item.type) {
    case 'talent':
      view.entries = (s.names as string[]).map((id) => ({ id, name: catalog[id]?.name ?? id }));
      view.specialties = (s.specialties as string[]).map((id) => ({ id, name: specialtyName(id) }));
      view.conditions = Object.entries(s.condition as Record<string, string>).map(([k, v]) => ({ entry: catalog[k]?.name ?? k, text: v }));
      break;
    case 'specialty':
      view.talents = (s.talents as string[]).map((id) => ({ id, name: talentName(id) }));
      break;
    case 'origin':
      view.talents = (s.talent_choice as string[]).map((id) => ({ id, name: talentName(id) }));
      view.attributes = (s.attributes as string[]).map((id) => ({ id, name: t(`WOF.Attribute.${id}`) }));
      break;
    case 'gear':
      view.gearDiceFor = (s.gear_dice_for as string[]).map((id) => ({ id, name: entryNames([id]) }));
      break;
    case 'critical-injury': {
      const rd = s.row_data;
      view.injury = {
        names: (W.injuryTypes as { id: string }[]).map((x) => ({ type: x.id, name: rd.names[x.id] })),
        sided: (W.sidedLocations as string[]).includes(s.location),
        range: rangeLabel(rd.results),
        effects: effectLines(rd.effects),
        permanent: effectLines(rd.permanent_effects),
        healingTotal: Math.max(healingDaysTotal(s.row, rd, s.injury_type, s.type_riders), s.healing_days_left),
        locationLabel: t(`WOF.InjuryLocation.${s.location}`),
        shownName: rd.names[s.injury_type] || item.name,
        riders: (s.type_riders as TypeRider[]).map(riderLine),
      };
      break;
    }
  }
  return view;
}
