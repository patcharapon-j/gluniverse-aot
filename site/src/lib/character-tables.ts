/**
 * Player-facing rows for the character creation tables in ../data/character (ADR-0012, ADR-0020),
 * rendered by CoreTable. The row lists, numbers, and table text come from the tables, and every
 * attribute, Talent, Specialty, and Action Catalog name is looked up in its own table. Any value
 * with no player wording here fails the build, so a new row or value can never go missing.
 */
import { parse } from 'yaml';
import attributesText from '../../../data/character/attributes.yaml?raw';
import catalogText from '../../../data/character/action-catalog.yaml?raw';
import classRankText from '../../../data/character/class-rank.yaml?raw';
import enlistmentText from '../../../data/character/enlistment.yaml?raw';
import examText from '../../../data/character/graduation-exam.yaml?raw';
import originsText from '../../../data/character/origins.yaml?raw';
import specialtiesText from '../../../data/character/specialties.yaml?raw';
import squadmatesText from '../../../data/character/squadmates.yaml?raw';
import talentsText from '../../../data/character/talents.yaml?raw';
import trainingText from '../../../data/character/training-years.yaml?raw';
import type { Cell, CoreTableData, SeeRef } from './core-tables';

const andList = new Intl.ListFormat('en', { type: 'conjunction' });
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Named {
  id: string;
  name: string;
}

const attributeDoc = parse(attributesText) as { attributes: (Named & { summary: string; used_by: string[]; key_attribute_of: string[] })[] };
const talentDoc = parse(talentsText) as { talents: Named[] };
const catalogDoc = parse(catalogText) as { entries: Named[] };
const specialtyDoc = parse(specialtiesText) as {
  specialties: (Named & { key_attribute: string; summary: string; talents: string[] })[];
  general: Named & { summary: string; talents: string[] };
};

function lookup(list: Named[], what: string) {
  const names = new Map(list.map((x) => [x.id, x.name]));
  return (id: string, table: string): string => {
    const name = names.get(id);
    if (!name) throw new Error(`${table}: no ${what} "${id}".`);
    return name;
  };
}
const attribute = lookup(attributeDoc.attributes, 'attribute');
const talent = lookup(talentDoc.talents, 'Talent');
const entry = lookup(catalogDoc.entries, 'Action Catalog entry');
const specialty = lookup(specialtyDoc.specialties, 'Specialty');

/** "11–13" for the results a D66 row covers. */
function results(values: number[]): string {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return lo === hi ? String(lo) : `${lo}–${hi}`;
}

/** "2", "0 to 1", "3 or more", or "0 or less" for a band whose ends may be open. */
function band(min: number | null, max: number | null): string {
  if (min == null && max == null) throw new Error('A band has no bounds.');
  if (min == null) return `${max} or less`;
  if (max == null) return `${min} or more`;
  return min === max ? String(min) : `${min} to ${max}`;
}

const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
const choice = (items: string[]): Cell => (items.length === 1 ? items[0] : { options: items });
const withNote = (text: string, note: string | null | undefined): Cell => (note ? { text, note } : text);
const yesNo = (b: boolean) => (b ? 'Yes' : 'No');

// ---------------------------------------------------------------- Attributes

export function attributesTable(): CoreTableData {
  const T = 'Attributes';
  return {
    caption: 'The six attributes',
    note: 'Which attribute a roll uses is set only by its Action Catalog entry.',
    columns: ['Attribute', 'Covers', 'Catalog entries that name it', 'Key attribute of'],
    see: false,
    groups: [
      {
        rows: attributeDoc.attributes.map((a) => ({
          cells: [
            a.name,
            a.summary,
            a.used_by.map((id) => entry(id, T)).join(', '),
            a.key_attribute_of.length ? andList.format(a.key_attribute_of.map((id) => specialty(id, T))) : 'None',
          ],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- Origin

interface RawOrigin {
  id: string;
  results: number[];
  name: string;
  description: string;
  attributes: string[];
  talent_choice: string[];
  haven_choice: string[];
  canon_tie: { character: string; link: string } | null;
  condition: Record<string, number> | null;
}

const ORIGIN_CONDITION_WORDING: Record<string, (value: number) => string> = {
  campaign_year_min: (year) => `Keep only in Campaign Year ${year} or later.`,
};

export function originTable(): CoreTableData {
  const doc = parse(originsText) as { roll: string; rows: RawOrigin[] };
  const T = 'Origin';
  return {
    caption: `Origin (${doc.roll})`,
    note: "If the current Campaign Year does not meet a row's condition, roll again.",
    columns: [doc.roll, 'Origin', '+1 to each', 'Talent at level 1', 'Haven', 'Canon Tie, optional'],
    see: false,
    roll: true,
    groups: [
      {
        rows: doc.rows.map((r) => {
          const conditions = Object.entries(r.condition ?? {}).map(([key, value]) => {
            const words = ORIGIN_CONDITION_WORDING[key];
            if (!words) throw new Error(`${T}: the condition "${key}" on "${r.id}" has no player wording.`);
            return words(value);
          });
          return {
            cells: [
              results(r.results),
              { text: r.name, note: [...conditions, r.description.trim()].join(' ') },
              andList.format(r.attributes.map((a) => attribute(a, T))),
              choice(r.talent_choice.map((t) => talent(t, T))),
              choice(r.haven_choice),
              r.canon_tie ? { text: r.canon_tie.character, note: r.canon_tie.link.trim() } : 'None',
            ],
          };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Why You Enlisted

interface RawDrive {
  id: string;
  name: string;
  trigger: string;
  test: string;
  acts?: string[];
  target: string;
  notes?: string;
  needs_named_comrade: boolean;
}
interface RawEnlistment {
  id: string;
  results: number[];
  reason: string;
  attribute: string;
  drive: RawDrive;
}

const DRIVE_TEST_WORDING: Record<string, string> = {
  own_state: 'Your own state',
  most_recent_turn: 'Your most recent turn',
  since_most_recent_turn_start: 'Since your most recent turn began',
};
const DRIVE_TARGET_WORDING: Record<string, string | null> = {
  any: null,
  named_comrade: 'Acts count only on your named comrade.',
  grabbed_or_down_comrade: 'Acts count only on a comrade who is Grabbed or Down.',
};
const DRIVE_NOTE_WORDING: Record<string, string> = {
  freedom: 'Gear & ODM defines airborne.',
};

export function enlistmentTable(): CoreTableData {
  const doc = parse(enlistmentText) as { roll: string; rows: RawEnlistment[] };
  const T = 'Why You Enlisted';
  return {
    caption: `Why You Enlisted (${doc.roll})`,
    note: "The attribute point always comes from the rolled row, whichever row's Drive you take.",
    columns: [doc.roll, 'Why you enlisted', '+1', 'Drive', 'Test'],
    see: false,
    roll: true,
    groups: [
      {
        rows: doc.rows.map((r) => {
          const d = r.drive;
          const test = DRIVE_TEST_WORDING[d.test];
          if (!test) throw new Error(`${T}: the test "${d.test}" on "${d.id}" has no player wording.`);
          if (!(d.target in DRIVE_TARGET_WORDING)) throw new Error(`${T}: the target "${d.target}" on "${d.id}" has no player wording.`);
          for (const act of d.acts ?? []) if (act !== 'push') entry(act, T);
          let trigger = d.trigger.trim();
          if (d.notes) {
            const note = DRIVE_NOTE_WORDING[d.id];
            if (!note) throw new Error(`${T}: the note on "${d.id}" has no player wording.`);
            trigger += ` ${note}`;
          }
          if (d.needs_named_comrade) trigger += ' Needs a named comrade.';
          return {
            cells: [results(r.results), r.reason.trim(), attribute(r.attribute, T), { text: d.name, note: trigger }, withNote(test, DRIVE_TARGET_WORDING[d.target])],
          };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Training Years

interface RawEvent {
  results: number[];
  name: string;
  description: string;
  attribute: string;
  talent_choice: string[];
  merit_change: number;
}
interface RawYear {
  id: string;
  name: string;
  performance_attributes: string[];
  curriculum: string[];
  events: RawEvent[];
}
interface RawBand {
  successes_min: number;
  successes_max: number | null;
  merit: number;
}
interface RawTraining {
  event_roll: string;
  performance_roll: { merit_from_successes: RawBand[] };
  years: RawYear[];
}

const training = () => parse(trainingText) as RawTraining;

export function trainingYearsTable(): CoreTableData {
  const T = 'Training Years';
  return {
    caption: 'The three Training Years',
    columns: ['Training Year', 'Performance attributes', 'Curriculum'],
    see: false,
    groups: [
      {
        rows: training().years.map((y) => ({
          cells: [y.name, andList.format(y.performance_attributes.map((a) => attribute(a, T))), y.curriculum.map((t) => talent(t, T)).join(', ')],
        })),
      },
    ],
  };
}

function trainingEvents(yearId: string) {
  return (): CoreTableData => {
    const doc = training();
    const year = doc.years.find((y) => y.id === yearId);
    if (!year) throw new Error(`Training Years: no year "${yearId}".`);
    return {
      caption: `${year.name}: events (${doc.event_roll})`,
      columns: [doc.event_roll, 'Event', '+1', 'Talent level', 'Merit'],
      see: false,
      roll: true,
      groups: [
        {
          rows: year.events.map((e) => ({
            cells: [
              results(e.results),
              { text: e.name, note: e.description.trim() },
              attribute(e.attribute, year.name),
              choice(e.talent_choice.map((t) => talent(t, year.name))),
              signed(e.merit_change),
            ],
          })),
        },
      ],
    };
  };
}

const successes = (b: RawBand) => `${band(b.successes_min, b.successes_max)} ${b.successes_min === 1 && b.successes_max === 1 ? 'success' : 'successes'}`;

export function performanceMeritTable(): CoreTableData {
  return {
    caption: 'Performance roll Merit',
    columns: ['Successes', 'Merit'],
    see: false,
    groups: [{ rows: training().performance_roll.merit_from_successes.map((b) => ({ cells: [band(b.successes_min, b.successes_max), String(b.merit)] })) }],
  };
}

// ---------------------------------------------------------------- Class Rank

export function classRankTable(): CoreTableData {
  const doc = parse(classRankText) as { class_size: number; rows: { merit_min: number | null; merit_max: number | null; class_rank: number; top_10: boolean }[] };
  return {
    caption: 'Class Rank',
    note: `A place in a class of ${doc.class_size} graduates. Several graduates can share a Class Rank.`,
    columns: ['Merit total', 'Class Rank', 'Top 10'],
    see: false,
    groups: [{ rows: doc.rows.map((r) => ({ cells: [band(r.merit_min, r.merit_max), String(r.class_rank), yesNo(r.top_10)] })) }],
  };
}

// ---------------------------------------------------------------- Graduation Exam

interface RawTrial {
  id: string;
  name: string;
  description: string;
  entry?: string;
  gear_item?: string | null;
  entry_choice?: { entry: string; gear_item: string | null }[];
  push: boolean;
  help: string;
  merit: RawBand[];
}
interface RawExam {
  conditions: { exam_issue: { item: string; counts_as: string; gear_dice: number }[] };
  order: string[];
  trials: RawTrial[];
}

const TRIAL_HELP_WORDING: Record<string, string> = {
  'squad-field-exercise': 'One helper: the next Cadet in the roll order. The first roller Helps the last.',
};
const EXAM_ITEM_WORDING: Record<string, string> = {
  'odm-gear': 'ODM Gear',
  'blade-set': 'A Blade Set',
  'medical-kit': 'A medical kit',
  'tool-kit': 'A tool kit',
};

export function examTrialsTable(): CoreTableData {
  const doc = parse(examText) as RawExam;
  const T = 'Graduation Exam';
  const byId = new Map(doc.trials.map((t) => [t.id, t]));
  if (doc.order.length !== doc.trials.length) throw new Error(`${T}: the Trial order and the Trials disagree.`);
  const gearWords = (item: string | null | undefined) => (item ? capitalise(item) : 'No gear');
  return {
    caption: 'The three Trials',
    note: 'Every Cadet finishes a Trial before the next begins.',
    columns: ['Order', 'Trial', 'Roll for', 'Gear item', 'Push', 'Help', 'Merit'],
    see: false,
    roll: true,
    groups: [
      {
        rows: doc.order.map((id, i) => {
          const t = byId.get(id);
          if (!t) throw new Error(`${T}: no Trial "${id}".`);
          let roll: Cell;
          let gear: Cell;
          if (t.entry) {
            roll = entry(t.entry, T);
            gear = gearWords(t.gear_item);
          } else if (t.entry_choice) {
            roll = { options: t.entry_choice.map((c) => `${entry(c.entry, T)}, ${c.gear_item ? `with ${c.gear_item}` : 'no gear'}`) };
            gear = 'With the roll chosen';
          } else {
            throw new Error(`${T}: "${id}" names no roll.`);
          }
          const help = t.help === 'none' ? 'None' : TRIAL_HELP_WORDING[t.id];
          if (!help) throw new Error(`${T}: the Help on "${id}" has no player wording.`);
          return {
            cells: [String(i + 1), { text: t.name, note: t.description.trim() }, roll, gear, yesNo(t.push), help, t.merit.map((b) => `${successes(b)}: ${b.merit} Merit`).join('; ')],
          };
        }),
      },
    ],
  };
}

export function examIssueTable(): CoreTableData {
  const doc = parse(examText) as RawExam;
  return {
    caption: 'Exam issue',
    note: 'Handed back when the Exam ends. Wear from Pushed rolls applies during the Exam and has no effect after it.',
    columns: ['Item', 'Counts as', 'Gear Dice'],
    see: false,
    groups: [
      {
        rows: doc.conditions.exam_issue.map((x) => {
          const counts = EXAM_ITEM_WORDING[x.counts_as];
          if (!counts) throw new Error(`Exam issue: "${x.counts_as}" has no player wording.`);
          return { cells: [capitalise(x.item), counts, String(x.gear_dice)] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Specialties

export function specialtiesTable(): CoreTableData {
  const T = 'Specialties';
  const general = specialtyDoc.general;
  return {
    caption: 'Specialties',
    columns: ['Specialty', 'Key attribute', 'Talent list'],
    see: false,
    groups: [
      {
        rows: specialtyDoc.specialties.map((s) => ({
          cells: [{ text: s.name, note: s.summary.trim() }, attribute(s.key_attribute, T), s.talents.map((t) => talent(t, T)).join(', ')],
        })),
      },
      {
        heading: "On no Specialty's list",
        rows: [{ cells: [{ text: general.name, note: general.summary.trim() }, 'None', general.talents.map((t) => talent(t, T)).join(', ')] }],
      },
    ],
  };
}

// ---------------------------------------------------------------- Squadmates

interface RawTemplate {
  id: string;
  specialty: string;
  attributes: Record<string, number>;
  talent: { id: string; level: number };
  health: number;
  resolve: number;
}

export function squadmateTemplatesTable(): CoreTableData {
  const doc = parse(squadmatesText) as { templates: RawTemplate[] };
  const T = 'Squadmate templates';
  const attrs = attributeDoc.attributes;
  return {
    caption: 'Squadmate templates',
    columns: ['Template', ...attrs.map((a) => a.name), 'Talent', 'Health', 'Resolve'],
    see: false,
    groups: [
      {
        rows: doc.templates.map((t) => {
          if (Object.keys(t.attributes).length !== attrs.length) throw new Error(`${T}: "${t.id}" does not rate every attribute.`);
          const rating = (id: string) => {
            const v = t.attributes[id];
            if (v == null) throw new Error(`${T}: "${t.id}" has no ${id} rating.`);
            return v;
          };
          const health = Math.ceil((rating('strength') + rating('agility')) / 2);
          const resolve = Math.ceil((rating('instinct') + rating('empathy')) / 2);
          if (health !== t.health || resolve !== t.resolve) throw new Error(`${T}: "${t.id}" records a Health or Resolve its ratings do not give.`);
          return {
            cells: [specialty(t.specialty, T), ...attrs.map((a) => String(rating(a.id))), `${talent(t.talent.id, T)} ${t.talent.level}`, String(t.health), String(t.resolve)],
          };
        }),
      },
    ],
  };
}

const CHAPTER_OF_SOURCE: Record<string, SeeRef> = {
  '01-core-rules': 'rules-of-play',
  '03-harm-and-mind': 'wounds-and-fear',
  '04-gear': 'gear-and-odm',
  '07-playtest-rules': 'expeditions-and-downtime',
};

const SQUADMATE_RULE_WORDING: Record<string, { rule: string; note?: string; applies?: string }> = {
  'attribute rolls and dice pools': { rule: 'Attribute rolls and dice pools' },
  'Stress Dice': { rule: 'Stress Dice' },
  'Stress Responses': { rule: 'Stress Responses' },
  Push: { rule: 'Pushing', note: 'A Squadmate never Pushes.' },
  'Help (as helper)': { rule: 'Helping a comrade', note: 'Help is on its action list.' },
  'Help (as roller)': { rule: 'Being Helped' },
  'Cover (as the Covering soldier)': { rule: "Covering a comrade's Push" },
  'Cover (as the Pushing soldier)': { rule: 'Being Covered', note: 'It never Pushes, so there is no Push to Cover.' },
  'field Stress relief (end of Titan Engagement and Nape kill)': { rule: 'Stress lost when a Titan Engagement ends or a Nape strike kills' },
  Reactions: { rule: 'Reactions' },
  'Fear Rolls': { rule: 'Fear Rolls' },
  'Health, Critical Injuries, Down, and Death Rolls': { rule: 'Health, Critical Injuries, Down, and Death Rolls' },
  'Scars and Retirement': { rule: 'Scars and Retirement' },
  Grief: { rule: 'Grief' },
  Drive: { rule: 'Drive' },
  'Gas Rolls': { rule: 'Gas Rolls', note: 'Always two dice, because it never Pushes.' },
  'Blade Sets, carried items, and Overloaded': { rule: 'Blade Sets, carried items, and Overloaded' },
  'Talent dice and rule Talents': { rule: 'Talent dice and rule Talents', note: 'Only its template Talent.' },
  'XP and gaining Talents': { rule: 'XP and new Talent levels', applies: 'Set by the advancement rules', note: 'Advancement rules are not covered yet.' },
  'Downtime Actions': { rule: 'Downtime Actions', note: 'Each Downtime it takes the Squadmate relief instead.' },
};

export function squadmateRulesTable(): CoreTableData {
  const doc = parse(squadmatesText) as { rules_applicability: { rule: string; applies: boolean | string; source?: string }[] };
  const T = 'Squadmate rules';
  return {
    caption: 'Which rules apply to a Squadmate',
    columns: ['Rule', 'Applies', 'See'],
    groups: [
      {
        rows: doc.rules_applicability.map((x) => {
          const w = SQUADMATE_RULE_WORDING[x.rule];
          if (!w) throw new Error(`${T}: "${x.rule}" has no player wording.`);
          let applies: string;
          if (typeof x.applies === 'boolean') applies = yesNo(x.applies);
          else if (w.applies) applies = w.applies;
          else throw new Error(`${T}: "${x.rule}" applies in a way with no player wording.`);
          const see: SeeRef[] = [];
          if (x.source) {
            const slug = CHAPTER_OF_SOURCE[x.source];
            if (!slug) throw new Error(`${T}: "${x.rule}" points to a chapter with no page.`);
            see.push(slug);
          }
          return { cells: [withNote(w.rule, w.note), applies], see };
        }),
      },
    ],
  };
}

export const CHARACTER_TABLES = {
  attributes: attributesTable,
  origins: originTable,
  'why-you-enlisted': enlistmentTable,
  'training-years': trainingYearsTable,
  'training-year-1': trainingEvents('year-1'),
  'training-year-2': trainingEvents('year-2'),
  'training-year-3': trainingEvents('year-3'),
  'performance-merit': performanceMeritTable,
  'class-rank': classRankTable,
  'exam-trials': examTrialsTable,
  'exam-issue': examIssueTable,
  specialties: specialtiesTable,
  'squadmate-templates': squadmateTemplatesTable,
  'squadmate-rules': squadmateRulesTable,
} satisfies Record<string, () => CoreTableData>;

export type CharacterTableId = keyof typeof CHARACTER_TABLES;
