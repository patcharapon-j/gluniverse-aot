/**
 * The hover cards of things no character holds yet: an Action Catalog entry, and a Talent as the
 * rules define it (CONFIG.WOF). The Lifepath wizard's choices and the item slips both read from
 * here, so a Talent offered by the wizard and a Talent on its own slip say the same thing. A
 * character's own rows build their cards from the character instead (soldier-view.ts), so the pool
 * shown is the pool they would throw.
 */
import { actionIcon, iconPath } from '../art.ts';
import type { LpTables, LpTalent } from '../rules/lifepath.ts';
import { t } from './context.ts';
import { actionDetail, talentDetail, type CatalogEntry, type DetailCard, type DetailRef } from './detail.ts';

const tables = (): LpTables => CONFIG.WOF.lifepath as LpTables;
const catalogById = (): Record<string, CatalogEntry> => CONFIG.WOF.actionCatalogById as Record<string, CatalogEntry>;
const talentIcon = (type: 'dice' | 'rule') => iconPath(`talent-${type}`);
const specialtyName = (id: string) => tables().specialties.find((sp) => sp.id === id)?.name ?? id;

function cardOf(x: LpTalent, entries: DetailRef[]): DetailCard {
  return talentDetail({
    id: x.id,
    name: x.name,
    icon: talentIcon(x.type),
    type: x.type,
    description: x.description,
    trigger: x.trigger ?? '',
    effect: x.effect,
    maxLevel: x.maxLevel,
    limit: x.limit ?? '',
    entries,
    specialties: x.specialties.map(specialtyName),
    forLine: x.actions.map((a) => a.name).join(', '),
  });
}

/** The card an Action Catalog entry raises, naming the Talents that name it. */
export function actionCard(id: string): DetailCard | null {
  const entry = catalogById()[id];
  if (!entry) return null;
  const talents = tables()
    .talents.filter((x) => x.names.includes(id))
    .map((x) => ({ id: x.id, name: x.name, icon: talentIcon(x.type), note: x.actions.find((a) => a.id === id)?.condition ?? '', card: cardOf(x, []) }));
  return actionDetail({ entry, icon: actionIcon(id), rollLabel: entry.attribute ? t(`WOF.Attribute.${entry.attribute}`) : t('WOF.Sheet.rolls.fixed'), talents });
}

/** The card a Talent raises, naming the entries it names. */
export function talentCard(id: string): DetailCard | null {
  const x = tables().talents.find((y) => y.id === id);
  if (!x) return null;
  return cardOf(
    x,
    x.actions.map((a) => ({ id: a.id, name: a.name, icon: actionIcon(a.id), note: a.condition ?? '', card: actionCard(a.id) })),
  );
}
