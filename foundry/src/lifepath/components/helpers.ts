/** Small shared helpers for the wizard's components. */
import { actionIcon, iconPath } from '../../art.ts';
import { dieIcon, esc } from '../../dice/card.ts';
import type { AttributeId } from '../../rules/derived.ts';
import type { LpTables } from '../../rules/lifepath.ts';
import type { DieKind } from '../../rules/roll.ts';
import { talentCard } from '../../sheets/catalog-cards.ts';
import { t } from '../../sheets/context.ts';
import type { DetailCard } from '../../sheets/detail.ts';

export const attrName = (id: string): string => t(`WOF.Attribute.${id}`);
export const attrIcon = (id: string): string => iconPath(`attr-${id}`);

/** Website text with its bold kept: escaped, then **x** as <b>x</b>. */
export const rich = (s: string): string => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

/** A D66 row's results as the website writes them: "11 to 13". */
export const rangeText = (results: readonly number[]): string =>
  results.length > 1 ? t('WOF.Lifepath.range', { a: results[0], b: results[results.length - 1] }) : String(results[0]);

export const signed = (n: number): string => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');

export function die(kind: DieKind, face: number, flags: { plain?: boolean; fresh?: boolean; locked?: boolean } = {}): string {
  return dieIcon(t, kind, face, flags);
}

export interface TalentInfo {
  id: string;
  name: string;
  type: 'dice' | 'rule';
  icon: string;
  names: string;
  maxLevel: number;
  specialties: string;
  /** The hover card the choice raises, so a Talent is read in full before it is taken. */
  card: DetailCard | null;
}

export function talentInfo(tables: LpTables, id: string): TalentInfo {
  const x = tables.talents.find((y) => y.id === id);
  const cat = CONFIG.WOF.actionCatalogById as Record<string, { name: string }>;
  if (!x) return { id, name: id, type: 'rule', icon: iconPath('talent-rule'), names: '', maxLevel: 1, specialties: '', card: null };
  return {
    id,
    name: x.name,
    type: x.type,
    icon: iconPath(`talent-${x.type}`),
    names: x.names.map((n) => cat[n]?.name ?? n).join(', '),
    maxLevel: x.maxLevel,
    specialties: x.specialties.map((s) => tables.specialties.find((sp) => sp.id === s)?.name ?? s).join(', '),
    card: talentCard(id),
  };
}

export const specialtyIcon = (id: string): string => iconPath(`specialty-${id}`);
export const entryIcon = (id: string): string => actionIcon(id);
export const entryName = (id: string): string => (CONFIG.WOF.actionCatalogById as Record<string, { name: string }>)[id]?.name ?? id;

export const ATTRS: AttributeId[] = ['strength', 'agility', 'wits', 'perception', 'instinct', 'empathy'];

/** One choice slip (Pick.svelte). */
export interface PickOption {
  id: string;
  title: string;
  sub?: string;
  meta?: string;
  icon?: string;
  /** An ink class (an attribute's colour). */
  ink?: string;
  badge?: string;
  disabled?: boolean;
  note?: string;
  /** The hover card this choice raises, where the thing chosen has one (sheets/detail.ts). */
  card?: DetailCard | null;
}
