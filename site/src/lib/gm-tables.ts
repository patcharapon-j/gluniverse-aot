/**
 * GM-facing rows for the Titan Engagement tables in ../data/engagement and ../data/titans
 * (ADR-0012, ADR-0020). The row list and every number come from the tables. The wording for each
 * row is written here for the GM, keyed by the row, and a row with no wording fails the build, so
 * a new row can never go missing from a page.
 */
import { parse } from 'yaml';
import setupText from '../../../data/engagement/engagement-setup.yaml?raw';
import anchorText from '../../../data/engagement/anchor-ratings.yaml?raw';
import sizeText from '../../../data/engagement/size-classes.yaml?raw';
import roundText from '../../../data/engagement/round.yaml?raw';
import attentionText from '../../../data/engagement/attention.yaml?raw';
import titanIndexText from '../../../data/titans/index.yaml?raw';
import smallText from '../../../data/titans/standard-small.yaml?raw';
import mediumText from '../../../data/titans/standard-medium.yaml?raw';
import largeText from '../../../data/titans/standard-large.yaml?raw';
import abnormalText from '../../../data/titans/sprinting-abnormal.yaml?raw';
import type { CoreTableData, TableRow } from './core-tables';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function wording<T>(map: Record<string, T>, key: string, table: string): T {
  const entry = map[key];
  if (!entry) throw new Error(`${table}: the row "${key}" has no wording. Write it in lib/gm-tables.ts.`);
  return entry;
}

/** "1", or "3 to 4" for a row that covers a run of results. */
const rollLabel = (results: number[]) => (results.length === 1 ? String(results[0]) : `${Math.min(...results)} to ${Math.max(...results)}`);

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// ---------------------------------------------------------------- the tables as they are written

interface RollRows<T> {
  roll: string;
  rows: T[];
}
interface Setup {
  anchor_rating: RollRows<{ results: number[]; anchor_rating: string }>;
  size_class: RollRows<{ results: number[]; size_class: string }>;
  medium_abnormal: RollRows<{ results: number[]; titan: string }>;
  background_titans: RollRows<{ results: number[]; clocks: number[] }>;
  retreat_clock: number;
}

const setup = parse(setupText) as Setup;
const anchors = parse(anchorText) as { ratings: { id: string; name: string }[] };
const sizes = parse(sizeText) as { classes: { id: string; name: string; height: string }[] };
const round = parse(roundText) as { gm_tracker: Tracker };
const attention = parse(attentionText) as { tests: { id: string; meaning: string }[] };
const titanIndex = parse(titanIndexText) as { standard_titans: Record<string, string>; ladders?: { id: string; name: string; rungs: string[] }[] };

const TITAN_FILES = [smallText, mediumText, largeText, abnormalText].map((text) => parse(text) as RawTitanFile);

const anchorRows = anchors.ratings;
const sizeRows = sizes.classes;
if (!Array.isArray(anchorRows) || !Array.isArray(sizeRows)) throw new Error('The Anchor Ratings or the Size Classes could not be found in their tables.');

/** The name a Titan goes by on a page, such as "Small Titan" for the standard Small Titan. */
function titanName(id: string): string {
  const titan = TITAN_FILES.find((t) => t.id === id);
  if (!titan) throw new Error(`The interim setup table names a Titan, "${id}", the site does not load.`);
  return titan.name.replace(/^Standard\s+/, '');
}

function named<T extends { id: string; name: string }>(rows: T[], id: string, what: string): T {
  const row = rows.find((r) => r.id === id);
  if (!row) throw new Error(`The interim setup table names ${what} ("${id}") that its own table does not list.`);
  return row;
}

// ---------------------------------------------------------------- the interim setup table

/** Segments on the retreat clock of every Titan Engagement this table sets up. */
export const RETREAT_CLOCK = setup.retreat_clock;

/**
 * How often the setup table makes the Sprinting Abnormal the Focus Titan, in words:
 * the Medium share of the Size Class roll times the Abnormal share of the roll it triggers.
 */
export function abnormalShare(): string {
  const faces = 6;
  const medium = setup.size_class.rows.find((r) => r.size_class === 'medium');
  const abnormal = setup.medium_abnormal.rows.find((r) => r.titan !== titanIndex.standard_titans.medium);
  if (!medium || !abnormal) throw new Error('The interim setup table no longer rolls an Abnormal on a Medium result.');
  const share = (medium.results.length / faces) * (abnormal.results.length / faces);
  const inN = Math.round(1 / share);
  if (!Number.isFinite(inN) || inN < 2) throw new Error('The Abnormal share of the interim setup table cannot be read as one in a whole number.');
  return `1 Titan Engagement in ${inN}`;
}

/** The interim setup table: the rolls that fill whatever the starting rule and the GM leave unnamed. */
export function interimSetup(): CoreTableData {
  const clocks = (row: { clocks: number[] }): string => {
    if (row.clocks.length === 0) return 'None';
    const list = row.clocks.map((c) => String(c)).join(' and ');
    return `${plural(row.clocks.length, 'Background Titan', 'Background Titans')}, on ${row.clocks.length === 1 ? 'a clock' : 'clocks'} of ${list} segments`;
  };

  return {
    caption: 'Interim Titan Engagement setup',
    note: `Roll each part the starting rule and your framing leave unnamed, in this order. The retreat clock is never rolled: it has ${RETREAT_CLOCK} segments in every Titan Engagement this table sets up.`,
    columns: ['D6', 'What it gives'],
    see: false,
    roll: true,
    groups: [
      {
        heading: 'Anchor Rating',
        rows: setup.anchor_rating.rows.map((row) => ({ cells: [rollLabel(row.results), named(anchorRows, row.anchor_rating, 'an Anchor Rating').name] })),
      },
      {
        heading: 'Size Class, for the Focus Titan and then for each Background Titan',
        rows: setup.size_class.rows.map((row) => {
          const size = named(sizeRows, row.size_class, 'a Size Class');
          const standard = titanIndex.standard_titans[row.size_class];
          if (!standard) throw new Error(`No standard Titan is named for the "${row.size_class}" Size Class.`);
          return { cells: [rollLabel(row.results), { text: `${size.name} (${size.height})`, note: `The ${titanName(standard)}` }] };
        }),
      },
      {
        heading: 'On a Medium Focus Titan only, roll again',
        rows: setup.medium_abnormal.rows.map((row) => ({ cells: [rollLabel(row.results), `The ${titanName(row.titan)}`] })),
      },
      {
        heading: 'Background Titans, with their clocks in the order listed',
        rows: setup.background_titans.rows.map((row) => ({ cells: [rollLabel(row.results), clocks(row)] })),
      },
    ],
  };
}

// ---------------------------------------------------------------- what the GM tracks

interface TrackerLine {
  fields: string[];
  example: string;
}
interface Tracker {
  engagement_line: TrackerLine;
  focus_titan_row: TrackerLine;
  corpse_row: TrackerLine;
  background_titan_row: TrackerLine;
}

const LINES: { id: keyof Tracker; heading: string }[] = [
  { id: 'engagement_line', heading: 'The Engagement line, one for the whole fight' },
  { id: 'focus_titan_row', heading: 'A Focus Titan row, one per living Focus Titan' },
  { id: 'corpse_row', heading: 'A corpse row, which stays for the rest of the fight' },
  { id: 'background_titan_row', heading: 'A Background Titan row, one per Background Titan' },
];

/**
 * The key a tracker line's wording is written under: the line, then the opening words of the
 * table's own text for that entry. A reworded entry loses its wording and fails the build, which
 * is how a change in the table reaches this page.
 */
function trackerKey(line: keyof Tracker, field: string): string {
  const head = field.split(/[(:;]/)[0].trim().split(/\s+/).slice(0, 5).join(' ');
  return `${line}/${slugify(head)}`;
}

const TRACKER_WORDING: Record<string, { name: string; text: string }> = {
  'engagement_line/anchor-rating': { name: 'Anchor Rating', text: 'The ground, which decides the Position steps ODM Gear allows.' },
  'engagement_line/round-number': { name: 'Round', text: 'Which round the fight is in.' },
  'engagement_line/retreat-clock-filled-segments-of': { name: 'Retreat clock', text: 'Filled segments of its length, such as 2 of 8. Public.' },
  'engagement_line/whether-the-titan-engagement-is': {
    name: 'Retreat, and the round it began',
    text: 'Whether the fight is a retreat, and the round at whose end step, or during which, it became one. That round is what the stay limit counts from.',
  },
  'engagement_line/squad-tactics-the-squad-holds': { name: 'Squad Tactics', text: 'Which the Squad holds, and which it has already used in this fight.' },
  'engagement_line/which-soldiers-have-thrown-their': { name: 'Cloaks', text: 'Which soldiers have thrown their cloak.' },
  'engagement_line/the-round-in-which-no': { name: 'No one standing since', text: 'The round in which no soldier was left standing, while a returner decides how soon the fight ends.' },

  'focus_titan_row/label': { name: 'Label', text: 'A, B, and so on. Every Position is held relative to a label.' },
  'focus_titan_row/size-class-and-stat-block': { name: 'Size Class and Titan', text: 'Which Titan it is, and which dossier you are running it from.' },
  'focus_titan_row/cards-this-round': { name: 'Cards this round', text: 'The numbers it was dealt, one per point of Tempo.' },
  'focus_titan_row/attention-holder-the-decoy-that': {
    name: 'Attention',
    text: 'The soldier who holds it, or the decoy that holds it with the cards its hold has left, or nothing.',
  },
  'focus_titan_row/next-behavior-face-down-until': { name: 'Next Behavior', text: 'Face down until a Read, a telegraph, or a card reveals it. The one thing on the tracker the squad never sees.' },
  'focus_titan_row/previous-behavior': { name: 'Previous behavior', text: 'What it last resolved. Nothing can be rolled back to back.' },
  'focus_titan_row/call-it-on-the-next': { name: 'Call It', text: 'Whether a Read has Called the Next Behavior, which gives every other target Bonus Dice on a dodge against it.' },
  'focus_titan_row/each-body-part-s-state-and': { name: 'Body Parts', text: "Each part's state and its count of successes toward the next state." },
  'focus_titan_row/openings-with-the-soldier-who': { name: 'Openings', text: 'How many stand, and who made each, since no one spends an Opening they made themselves.' },
  'focus_titan_row/regeneration-clock-filled-segments-of': {
    name: 'Regeneration clock',
    text: 'Filled segments of its length. For an Abnormal whose length no Read has revealed, show the filled segments alone.',
  },
  'focus_titan_row/decoys-in-a-row-the': { name: 'Decoys in a row', text: 'How many decoys have held its Attention since the last of its cards that resolved a behavior.' },
  'focus_titan_row/grabbed-soldier-held-with-countdown': { name: 'Grabbed soldier', text: 'Who it holds, their countdown turns, and whether it has lifted them.' },
  'focus_titan_row/flags-this-titan-has-set': {
    name: 'What it has noticed',
    text: 'Which soldiers count as hooked into it by a strike, as having just hurt it, and as loudest. They clear only when one of its cards resolves a behavior.',
  },
  'focus_titan_row/heave-count-of-its-heave': {
    name: 'Heave count and pins',
    text: 'Its heave count of its Heave rating, cleared when it stands, and each soldier its body pins, by limb with the pinning Body Part or by the body.',
  },

  'corpse_row/label-marked-corpse': { name: 'Label, marked a corpse', text: 'It keeps the label it had alive, and soldiers keep Positions relative to it.' },
  'corpse_row/each-body-part-s-state-and': { name: 'Body Parts', text: 'Each state and count, which never regenerate now.' },
  'corpse_row/heave-count-of-its-heave': { name: 'Heave count', text: 'Of its Heave rating, which is what frees everyone it pins.' },
  'corpse_row/each-soldier-it-pins-by': { name: 'Pins', text: 'Each soldier it pins, by limb with the pinning Body Part, or by the body.' },

  'background_titan_row/size-class-and-stat-block': { name: 'Size Class and Titan', text: 'Public, except the values an Abnormal keeps until a Read.' },
  'background_titan_row/clock-filled-segments-of-its': { name: 'Clock', text: 'Filled segments of its length. Public, and no soldier holds a Position relative to it.' },
};

/** The tracker the GM keeps, line by line. */
export function gmTracker(): CoreTableData {
  const tracker = round.gm_tracker;
  return {
    caption: "The GM's tracker",
    note: 'Everything here is public except an unrevealed Next Behavior and the values an Abnormal keeps until a Read. Players keep their own Positions, Stress, harm, and gear.',
    columns: ['You keep', 'What it is'],
    see: false,
    groups: LINES.map(({ id, heading }) => ({
      heading,
      rows: tracker[id].fields.map((field): TableRow => {
        const w = wording(TRACKER_WORDING, trackerKey(id, field), "The GM's tracker");
        return { cells: [w.name, w.text] };
      }),
    })),
  };
}

// ---------------------------------------------------------------- what each entry needs

interface RawEntry {
  id: string;
  name: string;
  results: number[];
  targets: string;
  position_requirement: string[];
  body_parts_used: string[];
  effects: { type: string }[];
  fallback: string;
}
interface RawTitanFile {
  id: string;
  name: string;
  behavior_table: { entries: RawEntry[] };
}

const POSITION_NAMES: Record<string, string> = {
  distant: 'Distant',
  'in-reach': 'In Reach',
  'on-body': 'On Body',
  'blind-spot': 'Blind Spot',
};

const PART_NAMES: Record<string, string> = { eyes: 'Its eyes', arm: 'An arm', leg: 'A leg' };

const TARGET_NAMES: Record<string, string> = {
  holder: 'The holder',
  'holder-and-position': 'The holder and everyone at their Position',
};

/** "Any", or the Positions the Attention holder must hold for the entry to happen. */
function positionText(positions: string[]): string {
  if (positions.length === Object.keys(POSITION_NAMES).length) return 'Any';
  return positions
    .map((p) => {
      const name = POSITION_NAMES[p];
      if (!name) throw new Error(`A Behavior Table entry names a Position, "${p}", the site does not know.`);
      return name;
    })
    .join(', ');
}

/** "None", or the unbroken Body Parts the entry needs, with a kind listed twice needing two. */
function partsText(parts: string[]): string {
  if (parts.length === 0) return 'None';
  const counts = new Map<string, number>();
  for (const part of parts) counts.set(part, (counts.get(part) ?? 0) + 1);
  return [...counts]
    .map(([kind, n]) => {
      const name = PART_NAMES[kind];
      if (!name) throw new Error(`A Behavior Table entry needs a Body Part kind, "${kind}", the site does not know.`);
      return n === 1 ? name : `Both ${kind}s`;
    })
    .join(' and ');
}

/**
 * The columns the dossier's Behavior Table leaves out: what each entry needs before it can
 * happen, what it falls back to, and which entry is the Grab.
 */
export function behaviorRequirements(titan: string): CoreTableData {
  const file = TITAN_FILES.find((t) => slugify(t.name.replace(/^Standard\s+/, '')) === titan);
  if (!file) throw new Error(`There is no Titan "${titan}" to read a Behavior Table from.`);
  const entries = file.behavior_table.entries;
  const byId = new Map(entries.map((e) => [e.id, e.name]));
  const rolled = [...entries].sort((a, b) => (a.results[0] ?? 99) - (b.results[0] ?? 99));

  const fallbackText = (entry: RawEntry): string => {
    if (entry.fallback === 'none') return 'Nothing: it is the fallback';
    const name = byId.get(entry.fallback);
    if (!name) throw new Error(`"${entry.name}" falls back to an entry its own table does not list.`);
    return name;
  };
  const target = (entry: RawEntry): string => {
    const name = TARGET_NAMES[entry.targets];
    if (!name) throw new Error(`"${entry.name}" has targets the site does not know.`);
    return entry.effects.some((e) => e.type === 'grab') ? `${name}. This is its Grab.` : name;
  };

  return {
    caption: `Running the ${file.name.replace(/^Standard\s+/, '')}`,
    note: 'Before a card resolves an entry, the Titan must have the Body Parts it uses, and the Attention holder must hold one of its Positions. Otherwise the entry falls back.',
    columns: ['D6', 'Behavior', 'Targets', 'Holder holds', 'Needs unbroken', 'Falls back to'],
    see: false,
    roll: true,
    groups: [
      {
        rows: rolled.map((entry) => ({
          cells: [
            entry.results.length ? rollLabel(entry.results) : 'Never rolled',
            entry.name,
            target(entry),
            positionText(entry.position_requirement),
            partsText(entry.body_parts_used),
            fallbackText(entry),
          ],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- an Abnormal's Attention Ladder

const RUNG_WORDING: Record<string, Rung> = {
  'hooked-into-its-body': {
    name: 'Hooked into it',
    text: 'A soldier On Body, or one whose strike has just hooked into it. A Nape striker who falls short turns it first, as on every ladder.',
  },
  'loudest-or-brightest': { name: 'The loudest or brightest', text: 'A soldier who has made themselves heard or seen, wherever they stand. Only Draw Attention does that, and never from Distant.' },
  'current-holder': {
    name: 'Whoever it is already running down',
    text: 'The soldier who holds its Attention, while they hold a Position other than Distant. A holder who gets away to Distant, mounted or on foot, is no longer its quarry. A Down soldier can meet this.',
  },
  nearest: {
    name: 'Whoever is nearest',
    text: 'The soldiers at the closest Position anyone holds, in the order On Body, In Reach, Blind Spot, Distant. A tie goes to the holder, then to the lowest card, and a tie no card can break leaves nothing holding its Attention until its next card. A Down soldier can meet this.',
  },
};

export interface Rung {
  name: string;
  text: string;
}

/** The rungs of an Abnormal's own Attention Ladder, highest first. */
export function abnormalLadder(titan: string): { name: string; rungs: Rung[] } {
  const ladder = titanIndex.ladders?.find((l) => l.id === titan);
  if (!ladder) throw new Error(`No Attention Ladder is written for "${titan}".`);
  const tests = new Map(attention.tests.map((t) => [t.id, t]));
  return {
    name: ladder.name,
    rungs: ladder.rungs.map((id) => {
      if (!tests.has(id)) throw new Error(`The ${ladder.name} names a rung, "${id}", the Attention rules do not list.`);
      return wording(RUNG_WORDING, id, 'Attention Ladder rungs');
    }),
  };
}
