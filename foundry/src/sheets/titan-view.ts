/**
 * The plain view the Titan sheet renders (core-plan 2c). A GM (any owner) gets everything; a player
 * with Observer gets only what data/engagement/read.yaml makes public: no Behavior Table, no
 * unrevealed Next Behavior, and an Abnormal's stat block values only once a Read revealed them.
 * Hidden values are left out of the view itself, not just hidden by CSS.
 */
import { SYSTEM_ID } from '../config.ts';
import { isGrounded, meetsBodyParts, publicFacts, type BodyPart, type TitanFacts } from '../rules/titan.ts';
import { titanRegions } from './figure.ts';
import { icon } from './soldier-view.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export interface PartView extends Omit<BodyPart, 'toughness'> {
  index: number;
  side: 'left' | 'right' | null;
  label: string;
  icon: string;
  /** Toughness, or null while it is hidden from this viewer. */
  shownToughness: number | null;
  whenBroken: string;
}

export interface EntryView {
  id: string;
  name: string;
  results: number[];
  resultLabel: string;
  tier: string;
  tierLabel: string;
  tierIcon: string | null;
  targets: string;
  positions: string;
  bodyParts: string;
  attackDice: number | null;
  effects: string[];
  fallback: string;
  text: string;
  canHappen: boolean;
  grab: boolean;
}

export interface TitanView {
  id: string;
  uuid: string;
  name: string;
  img: string;
  editable: boolean;
  /** Sees every value (the GM, or an owner). */
  full: boolean;
  /** Below Observer: the plate and name only. */
  limited: boolean;
  sizeClass: { id: string; label: string; height: string };
  kindIcon: string;
  abnormal: boolean;
  facts: TitanFacts;
  shown: TitanFacts;
  tempo: number;
  napeDepth: number | null;
  regenClock: number | null;
  regeneration: number;
  heave: number;
  heaveCount: number;
  openings: number;
  corpse: boolean;
  grounded: boolean;
  parts: PartView[];
  ladder: { id: string; name: string; rungs: { id: string; label: string }[] } | null;
  holder: { value: string; name: string };
  focusLabel: string;
  next: { entryId: string; entry: EntryView | null; revealed: boolean };
  previous: EntryView | null;
  entries: EntryView[];
  candidates: { id: string; name: string }[];
  notesHTML: string;
}

const list = new Intl.ListFormat('en', { type: 'conjunction' });
const orList = new Intl.ListFormat('en', { type: 'disjunction' });

export function partLabel(p: { id: string; kind: string }, side: 'left' | 'right' | null): string {
  if (p.kind === 'eyes') return t('WOF.BodyPart.eyes');
  return t(`WOF.BodyPart.${side ?? 'left'}-${p.kind}`);
}

function effectLine(e: Record<string, any>): string {
  switch (e.type) {
    case 'stress':
      return t('WOF.TitanEffect.stress', { amount: e.amount ?? 1 });
    case 'critical-injury':
      return t(e.cannot_be_lethal ? 'WOF.TitanEffect.injuryNotLethal' : 'WOF.TitanEffect.injury', {
        type: t(`WOF.InjuryType.${e.injury_type}`),
        location: e.injury_location === 'rolled' ? t('WOF.TitanEffect.rolledLocation') : t(`WOF.InjuryLocation.${e.injury_location}`),
      });
    case 'knock-loose':
      return t('WOF.TitanEffect.knockLoose');
    case 'grab':
      return t('WOF.TitanEffect.grab');
    case 'telegraph':
      return t('WOF.TitanEffect.telegraph');
    default:
      return String(e.type);
  }
}

export function entryView(e: any, all: any[], parts: readonly BodyPart[]): EntryView {
  const W = CONFIG.WOF;
  const byId = new Map(all.map((x: any) => [x.id, x]));
  const kinds = (e.body_parts_used as string[]).map((k) => t(`WOF.BodyPartKind.${k}`));
  const positions = e.position_requirement as string[];
  return {
    id: e.id,
    name: e.name,
    results: [...e.results],
    resultLabel: e.results.length ? e.results.join(', ') : '—',
    tier: e.tier,
    tierLabel: t(`WOF.Tier.${e.tier}`),
    tierIcon: e.tier === 'thrash' ? null : icon(`tier-${e.tier}`),
    targets: t(`WOF.Targets.${e.targets}`),
    positions: positions.length >= 4 ? t('WOF.TitanSheet.anyPosition') : orList.format(positions.map((p) => t(W.labels.positions[p]))),
    bodyParts: kinds.length ? list.format(kinds) : t('WOF.Sheet.none'),
    attackDice: e.attack_dice ?? null,
    effects: (e.effects as any[]).map(effectLine),
    fallback: e.fallback === 'none' ? t('WOF.Sheet.none') : (byId.get(e.fallback)?.name ?? e.fallback),
    text: e.text,
    canHappen: meetsBodyParts(e, parts),
    grab: (e.effects as any[]).some((x) => x.type === 'grab'),
  };
}

export function buildTitanView(actor: any, opts: { editable: boolean; notesHTML: string }): TitanView {
  const W = CONFIG.WOF;
  const sys = actor.system;
  const src = sys.toObject();
  const full = !!actor.isOwner;
  const limited = !actor.testUserPermission(game.user, 'OBSERVER');
  const size = (W.sizeClasses as any[]).find((c) => c.id === src.size_class);
  const facts: TitanFacts = { ...src.hidden_until_read };
  const shown = full ? { toughness: true, nape_depth: true, regeneration_clock: true, attention_ladder: true } : publicFacts(src.abnormal, facts);
  const parts = src.body_parts as BodyPart[];
  const sides = titanRegions(parts);
  const partViews: PartView[] = parts.map((p, index) => ({
    id: p.id,
    kind: p.kind,
    state: p.state,
    progress: p.progress,
    index,
    side: sides[index],
    label: partLabel(p, sides[index]),
    icon: icon(`body-${p.kind}`),
    shownToughness: shown.toughness ? p.toughness : null,
    whenBroken: t(`WOF.BodyPartKind.broken.${p.kind}`),
  }));

  const ladderRow = (W.attentionLadders as any[]).find((l) => l.id === src.attention_ladder);
  const ladder =
    shown.attention_ladder && ladderRow
      ? {
          id: ladderRow.id,
          name: ladderRow.name ?? t('WOF.Ladder.standard'),
          rungs: (ladderRow.rungs as string[]).map((r) => ({ id: r, label: t(`WOF.Rung.${r}`) })),
        }
      : null;

  const candidates = [...(game.actors ?? [])]
    .filter((a: any) => a.type === 'soldier' || a.type === 'squadmate')
    .map((a: any) => ({ id: a.id, name: a.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const holderName =
    src.attention_holder === ''
      ? t('WOF.TitanSheet.holder.nothing')
      : src.attention_holder === 'decoy'
        ? t('WOF.TitanSheet.holder.decoy')
        : (candidates.find((c) => c.id === src.attention_holder)?.name ?? src.attention_holder);

  const all = src.behavior_table.entries as any[];
  const views = all.map((e) => entryView(e, all, parts));
  const find = (id: string) => views.find((v) => v.id === id) ?? null;
  const nextEntry = find(src.next_behavior.entry);
  const nextShown = full || src.next_behavior.revealed;

  return {
    id: actor.id,
    uuid: actor.uuid,
    name: actor.name,
    img: actor.img,
    editable: opts.editable,
    full,
    limited,
    sizeClass: { id: src.size_class, label: t(`WOF.SizeClass.${src.size_class}`), height: size?.height ?? '' },
    kindIcon: `systems/${SYSTEM_ID}/assets/icons/titan-${src.abnormal ? 'abnormal' : src.size_class}.webp`,
    abnormal: src.abnormal,
    facts,
    shown,
    tempo: src.tempo,
    napeDepth: shown.nape_depth ? src.nape_depth : null,
    regenClock: shown.regeneration_clock ? src.regeneration_clock : null,
    regeneration: src.regeneration,
    heave: src.heave,
    heaveCount: src.heave_count,
    openings: src.openings,
    corpse: src.corpse,
    grounded: isGrounded(parts),
    parts: partViews,
    ladder,
    holder: { value: src.attention_holder, name: holderName },
    focusLabel: src.focus_titan_label,
    next: { entryId: nextShown ? src.next_behavior.entry : '', entry: nextShown ? nextEntry : null, revealed: src.next_behavior.revealed },
    previous: find(src.previous_behavior),
    entries: full ? views : [],
    candidates,
    notesHTML: opts.notesHTML,
  };
}
