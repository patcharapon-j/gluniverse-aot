/**
 * Everything the digital GM screen needs, in one JSON-serialisable blob built from the
 * shared tables (ADR-0012, ADR-0020). The screen is a play aid: it never states a rule of
 * its own, and every number it shows comes from these files, so it cannot drift from a
 * chapter. Wording written for the GM is keyed by row here, as in gm-tables.ts.
 */
import { parse } from 'yaml';
import anchorText from '../../../data/engagement/anchor-ratings.yaml?raw';
import roundText from '../../../data/engagement/round.yaml?raw';
import setupText from '../../../data/engagement/engagement-setup.yaml?raw';
import smallText from '../../../data/titans/standard-small.yaml?raw';
import mediumText from '../../../data/titans/standard-medium.yaml?raw';
import largeText from '../../../data/titans/standard-large.yaml?raw';
import abnormalText from '../../../data/titans/sprinting-abnormal.yaml?raw';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface RawEffect {
  type: string;
  amount?: number;
  location?: string;
  injury_type?: string;
  lethal?: boolean;
}
interface RawEntry {
  id: string;
  name: string;
  results: number[];
  tier: string;
  targets: string;
  position_requirement: string[];
  body_parts_used: string[];
  attack_dice?: number;
  effects: RawEffect[];
  fallback: string;
  text: string;
}
interface RawTitan {
  id: string;
  name: string;
  size_class: string;
  abnormal: boolean;
  tempo: number;
  nape_depth: number;
  regeneration_clock: number;
  heave?: number;
  body_parts: { id: string; kind: string; toughness: number }[];
  behavior_table: { entries: RawEntry[] };
}

const RAW = [smallText, mediumText, largeText, abnormalText].map((t) => parse(t) as RawTitan);
const anchors = parse(anchorText) as {
  ratings: { id: string; name: string; anchors: number; terrain_trait: string }[];
};
const setup = parse(setupText) as { retreat_clock: number };

const POSITIONS = ['distant', 'in-reach', 'on-body', 'blind-spot'] as const;
const POSITION_NAMES: Record<string, string> = {
  distant: 'Distant',
  'in-reach': 'In Reach',
  'on-body': 'On Body',
  'blind-spot': 'Blind Spot',
};

/** A Terrain Trait in one line for the screen, with the source file's cross-references dropped. */
const trait = (text: string) => text.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();

/** What an effect does, in the fewest words that still tell the GM what to apply. */
function effectLabel(e: RawEffect): string {
  switch (e.type) {
    case 'stress':
      return `${e.amount ?? 1} Stress`;
    case 'critical-injury':
      return `Critical Injury${e.location ? `, ${POSITION_NAMES[e.location] ?? titleCase(e.location.replace(/-/g, ' '))}` : ', rolled location'}${e.lethal === false ? ' (never lethal)' : ''}`;
    case 'grab':
      return 'Grab';
    case 'knock-loose':
      return 'Knock loose';
    case 'telegraph':
      return 'Telegraph: reveal the new Next Behavior';
    case 'wreck':
      return 'Wreck: the fight loses 1 Anchor';
    case 'pin':
      return 'Pin';
    default:
      return titleCase(e.type.replace(/-/g, ' '));
  }
}

export interface ScreenBehavior {
  id: string;
  name: string;
  results: number[];
  roll: string;
  tier: string;
  targets: string;
  positions: string[];
  parts: string[];
  attackDice: number | null;
  effects: string[];
  fallback: string;
  text: string;
  isGrab: boolean;
  wrecks: boolean;
}
export interface ScreenTitan {
  id: string;
  name: string;
  sizeClass: string;
  abnormal: boolean;
  tempo: number;
  napeDepth: number;
  regeneration: number;
  heave: number | null;
  parts: { id: string; name: string; kind: string; toughness: number }[];
  behaviors: ScreenBehavior[];
  thrash: ScreenBehavior | null;
}

const rollLabel = (r: number[]) => (r.length === 1 ? String(r[0]) : `${Math.min(...r)}–${Math.max(...r)}`);

function behavior(e: RawEntry): ScreenBehavior {
  return {
    id: e.id,
    name: e.name,
    results: e.results,
    roll: e.results.length ? rollLabel(e.results) : '—',
    tier: titleCase(e.tier),
    targets: e.targets === 'holder' ? 'The holder' : 'The holder and everyone at their Position',
    positions: e.position_requirement,
    parts: e.body_parts_used,
    attackDice: e.attack_dice ?? null,
    effects: e.effects.map(effectLabel),
    fallback: e.fallback,
    text: e.text.trim(),
    isGrab: e.effects.some((x) => x.type === 'grab'),
    wrecks: e.effects.some((x) => x.type === 'wreck'),
  };
}

export const TITANS: ScreenTitan[] = RAW.map((t) => {
  const entries = t.behavior_table.entries;
  return {
    id: slugify(t.name.replace(/^Standard\s+/, '')),
    name: t.name.replace(/^Standard\s+/, ''),
    sizeClass: titleCase(t.size_class),
    abnormal: t.abnormal,
    tempo: t.tempo,
    napeDepth: t.nape_depth,
    regeneration: t.regeneration_clock,
    heave: t.heave ?? null,
    parts: t.body_parts.map((p) => ({ id: p.id, name: titleCase(p.id.replace(/-/g, ' ')), kind: p.kind, toughness: p.toughness })),
    behaviors: entries
      .filter((e) => e.results.length > 0)
      .sort((a, b) => Math.min(...a.results) - Math.min(...b.results))
      .map(behavior),
    thrash: (() => {
      const f = entries.find((e) => e.results.length === 0);
      return f ? behavior(f) : null;
    })(),
  };
});

export const ANCHOR_RATINGS = anchors.ratings.map((r) => ({
  id: r.id,
  name: r.name,
  anchors: r.anchors,
  trait: r.terrain_trait.trim() === 'none' || !r.terrain_trait ? 'No Terrain Trait — the plain ground the other ratings are read against.' : trait(r.terrain_trait),
}));

export const RETREAT_CLOCK = setup.retreat_clock;

export const POSITION_LIST = POSITIONS.map((id) => ({ id, name: POSITION_NAMES[id] }));

/** The five steps of a round, and the five end steps, written for a GM running the screen. */
export const ROUND_STEPS = [
  { id: 'wings', text: 'Assign Wings, or keep them.' },
  { id: 'deal', text: 'Deal one card to every soldier and as many as its Tempo to each Focus Titan.' },
  { id: 'swap', text: 'Soldiers may swap cards.' },
  { id: 'play', text: 'Play the cards in ascending order.' },
  { id: 'end', text: 'Work the end steps.' },
];

/**
 * The end steps, in the order the round table gives them. The order is the table's, never a list
 * written here: it is what leaves a Titan that entered at the clocks step on Frenzy 0 through its
 * first full round. Only the wording is the screen's, keyed by the table's row id.
 */
const END_STEP_WORDING: Record<string, string> = {
  'gas-rolls': 'Gas Rolls for everyone who used ODM Gear. Roll them together.',
  regeneration: "Fill 1 segment of every living Focus Titan's Regeneration clock.",
  frenzy: 'Every living Focus Titan gains 1 Frenzy, to a cap of 3. Say the new number aloud.',
  'background-clocks': 'Fill every Background clock and resolve any that is full. Then the retreat clock, last of the two.',
  momentum: 'Everyone who made no ODM move loses all their Momentum.',
  'round-ends': 'Unspent moves and actions are lost, and round-long effects end.',
};

export const END_STEPS = (parse(roundText) as { end_steps: { id: string }[] }).end_steps.map((s) => {
  const text = END_STEP_WORDING[s.id];
  if (text === undefined) throw new Error(`The end steps: the step "${s.id}" has no GM wording.`);
  return { id: s.id, text };
});

/** The reading procedure for the standard ladder, in the order the screen asks it. */
export const LADDER_STEPS = [
  'Highest rung anyone meets — those who meet it are tied.',
  'Add everyone marked loudest, unless that rung is hooked into its body.',
  'At that rung, anyone hooked in by a strike keeps it alone.',
  'Narrow by each lower rung, then by closest Position.',
  'Still tied: the current holder, else the lowest card, else nothing.',
];

export const NEVER_YOURS = [
  "A Titan's numbers, the rows its tables give, and its Frenzy.",
  'Any die once it is rolled, yours or theirs.',
  'The hidden Next Behavior, rolled once and standing.',
  'Anchors and Momentum — the players hold those.',
  'The clocks, the retreat, and the two tests that end a fight.',
];
