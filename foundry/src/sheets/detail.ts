/**
 * The hover card: everything a Talent or an Action Catalog entry says, laid out for the floating
 * panel a row raises under the pointer. A sheet row has space for a line (§2, §3); the card carries
 * the rest — what the entry does, what it requires, what it needs, and the dice it would throw —
 * so a player reads a Talent or an action in play without opening its slip.
 *
 * The builders are plain functions over the view's own values, and placeCard is plain geometry, so
 * both are tested without a browser (test/detail-card.test.ts).
 */
import type { PoolPreview } from '../rules/pool.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

/** One labelled block of lines under the card's opening text. */
export interface DetailSection {
  label: string;
  lines: string[];
}

/**
 * Something the card names that has a card of its own: a Talent's action, an action's Talent. Its
 * card carries no references itself, so a chain stops at the thing named.
 */
export interface DetailRef {
  id: string;
  name: string;
  icon: string;
  /** The condition that narrows this reference, if one does. */
  note: string;
  card: DetailCard | null;
}

export interface DetailCard {
  kind: 'talent' | 'action';
  id: string;
  /** The kicker over the title: what kind of thing this is. */
  kicker: string;
  title: string;
  /** The right of the head: the level held, or the dice the roll would throw. */
  stamp: string;
  icon: string;
  /** The opening paragraphs, in the rules' own words. */
  lead: string[];
  sections: DetailSection[];
  /** What the card names, each raising its own card under the pointer. */
  refs: DetailRef[];
  /** The label over the references. */
  refsLabel: string;
  /** The line under the rule, dimmer than the rest: how the row is used. */
  foot: string;
  /** Why the row cannot be used right now, if it cannot. */
  blocked: string | null;
}

/** A block, or nothing where the data has nothing to say. */
const section = (label: string, lines: (string | null | undefined | false)[]): DetailSection | null => {
  const said = lines.filter((l): l is string => typeof l === 'string' && l.trim() !== '');
  return said.length ? { label, lines: said } : null;
};

const kept = (sections: (DetailSection | null)[]): DetailSection[] => sections.filter((s): s is DetailSection => s !== null);

/** Tags stripped and entities settled: the compendium's description fields are HTML. */
export function plainText(html: string): string {
  return (html ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h\d)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&(#39|apos);/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface TalentDetailInput {
  id: string;
  name: string;
  icon: string;
  type: 'dice' | 'rule';
  description: string;
  trigger: string;
  effect: string;
  /** The level held, where a character holds one. */
  level?: number;
  maxLevel: number;
  /** The level that counts, where a character holds one. */
  effectiveLevel?: number;
  /** The once-per limit in words, or '' for a Talent with none. */
  limit: string;
  /** Whether the once-per use is spent; away from a character, nothing is spent yet. */
  used?: boolean;
  /** The Action Catalog entries the Talent names, each with its own card. */
  entries: DetailRef[];
  /** The Specialties that offer the Talent, by name. */
  specialties: string[];
  forLine: string;
}

/** The card a Talent row raises. */
export function talentDetail(i: TalentDetailInput): DetailCard {
  const dice = i.type === 'dice';
  return {
    kind: 'talent',
    id: i.id,
    kicker: t(dice ? 'WOF.Sheet.talent.dice' : 'WOF.Sheet.talent.rule'),
    title: i.name,
    stamp: i.maxLevel <= 1 ? '' : i.level === undefined ? t('WOF.Sheet.detail.upToLevel', { max: i.maxLevel }) : t('WOF.Sheet.detail.level', { level: i.level, max: i.maxLevel }),
    icon: i.icon,
    lead: [plainText(i.description)].filter(Boolean),
    sections: kept([
      section(t('WOF.Sheet.detail.trigger'), [i.trigger]),
      section(t('WOF.Sheet.detail.effect'), [i.effect]),
      section(t('WOF.Sheet.detail.limit'), [i.limit, i.limit && i.used !== undefined ? t(i.used ? 'WOF.Sheet.detail.spent' : 'WOF.Sheet.detail.ready') : '']),
      section(t('WOF.Sheet.detail.taught'), [i.specialties.join(', ')]),
      dice && i.effectiveLevel ? section(t('WOF.Sheet.detail.dice'), [t('WOF.Sheet.detail.talentDice', { dice: i.effectiveLevel })]) : null,
    ]),
    refs: i.entries,
    refsLabel: t('WOF.Sheet.detail.names'),
    foot: i.forLine,
    blocked: null,
  };
}

/** The Action Catalog entry as the config carries it (tools/config-data.ts, actionCatalog). */
export interface CatalogEntry {
  id: string;
  name: string;
  kind: string;
  attribute: string | null;
  requiresGear?: boolean;
  withoutGear?: string | null;
  text?: { does?: string[]; requires?: string[]; needs?: string | null; help?: string | null; gear?: string; rollLabel?: string };
}

export interface ActionDetailInput {
  entry: CatalogEntry;
  icon: string;
  /** The attribute's own name, or the fixed roll's label. */
  rollLabel: string;
  /** The pool the roll would throw for this character, where there is a character. */
  pool?: PoolPreview | null;
  /** The pool's sources as the row writes them, or why the roll is blocked. */
  why?: string;
  blockedReason?: string | null;
  fixed?: boolean;
  fixedDice?: number;
  /** The Talents that name the entry, each with its own card. */
  talents?: DetailRef[];
}

/** The lines of the pool the action would throw, one source each. */
export function poolLines(pool: PoolPreview, rollLabel: string): string[] {
  const lines: string[] = [];
  if (pool.attribute) lines.push(t('WOF.Sheet.detail.poolAttribute', { attr: rollLabel, dice: pool.attribute.dice }));
  if (pool.talent) lines.push(t('WOF.Sheet.detail.poolTalent', { name: pool.talent.name, dice: pool.talent.dice }));
  if (pool.bonus) lines.push(t('WOF.Sheet.detail.poolBonus', { dice: pool.bonus }));
  if (pool.gear) lines.push(t('WOF.Sheet.detail.poolGear', { name: pool.gear.name, dice: pool.gear.dice }));
  else if (pool.attributeAlone) lines.push(t('WOF.Sheet.roll.attributeAlone'));
  for (const p of pool.penalties) lines.push(t('WOF.Sheet.detail.poolPenalty', { source: p.source, dice: p.dice }));
  if (pool.stress) lines.push(t('WOF.Sheet.detail.poolStress', { dice: pool.stress }));
  return lines;
}

/** The dice a Talent or a penalty adds only under its own condition. */
export function conditionalLines(pool: PoolPreview): string[] {
  return [
    ...(pool.conditionalTalents ?? []).map((c) => t('WOF.Sheet.detail.conditionalTalent', { name: c.name, dice: c.dice, condition: c.condition })),
    ...(pool.conditionalPenalties ?? []).map((c) => t('WOF.Sheet.detail.conditionalPenalty', { source: c.source, dice: c.dice, condition: c.condition })),
  ];
}

/**
 * The card an action row raises. Away from a character — the Lifepath's own choices — there is no
 * pool to preview, so the card is the entry itself: what it does, what it takes, what it needs.
 */
export function actionDetail(i: ActionDetailInput): DetailCard {
  const text = i.entry.text ?? {};
  const pool = i.pool ?? null;
  const blocked = i.blockedReason ?? null;
  const dice = i.fixed ? (i.fixedDice ?? 1) : (pool?.total ?? 0);
  return {
    kind: 'action',
    id: i.entry.id,
    kicker: t(`WOF.Sheet.detail.kind.${i.entry.kind}`),
    title: i.entry.name,
    stamp: pool && !blocked ? t(i.fixed ? 'WOF.Sheet.detail.stampD6' : 'WOF.Sheet.detail.stampDice', { dice }) : i.rollLabel,
    icon: i.icon,
    lead: [...(text.does ?? [])],
    sections: kept([
      section(t('WOF.Sheet.detail.requires'), text.requires ?? []),
      section(t('WOF.Sheet.detail.needs'), [text.needs ?? '']),
      section(t('WOF.Sheet.detail.gear'), [
        text.gear ?? '',
        i.entry.requiresGear && i.entry.withoutGear ? t(`WOF.Sheet.detail.withoutGear.${i.entry.withoutGear}`) : '',
      ]),
      section(t('WOF.Sheet.detail.help'), [text.help ?? '']),
      pool && !blocked ? section(t('WOF.Sheet.detail.dice'), poolLines(pool, i.rollLabel)) : null,
      pool ? section(t('WOF.Sheet.detail.sometimes'), conditionalLines(pool)) : null,
    ]),
    refs: i.talents ?? [],
    refsLabel: t('WOF.Sheet.detail.namedBy'),
    foot: blocked ?? i.why ?? '',
    blocked,
  };
}

export interface Box {
  width: number;
  height: number;
}

export interface Anchor extends Box {
  left: number;
  top: number;
  /**
   * The Dossier file's index tab column stands just outside the paper's right edge (still inside
   * the window); a row anchored on that paper reports this as the x its card must not cross, so a
   * card never opens over the tabs. Unset outside the file frame, where the window edge is the
   * only limit.
   */
  maxRight?: number;
}

export type CardSide = 'right' | 'left' | 'below' | 'above';

export interface Placement {
  left: number;
  top: number;
  side: CardSide;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/**
 * Where the card goes: beside the row it belongs to when there is room, otherwise under or over it,
 * and always inside the window with a margin to spare, and never past the anchor's `maxRight` (the
 * Dossier's index tab column, when the row is on that paper). The side the card takes is reported
 * so its pointer leans the right way.
 */
export function placeCard(anchor: Anchor, card: Box, view: Box, gap = 12, margin = 8): Placement {
  const right = anchor.maxRight !== undefined ? Math.min(view.width, anchor.maxRight) : view.width;
  const room = { right: right - (anchor.left + anchor.width), left: anchor.left, below: view.height - (anchor.top + anchor.height), above: anchor.top };
  const need = card.width + gap + margin;
  const side: CardSide =
    room.right >= need ? 'right'
      : room.left >= need ? 'left'
        : room.below >= card.height + gap + margin ? 'below'
          : room.above >= card.height + gap + margin ? 'above'
            : room.right >= room.left ? 'right' : 'left';
  const beside = side === 'right' || side === 'left';
  const left = beside
    ? (side === 'right' ? anchor.left + anchor.width + gap : anchor.left - gap - card.width)
    : anchor.left + anchor.width / 2 - card.width / 2;
  const top = beside
    ? anchor.top + anchor.height / 2 - card.height / 2
    : (side === 'below' ? anchor.top + anchor.height + gap : anchor.top - gap - card.height);
  return {
    left: clamp(left, margin, Math.max(margin, right - card.width - margin)),
    top: clamp(top, margin, Math.max(margin, view.height - card.height - margin)),
    side,
  };
}
