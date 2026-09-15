/**
 * Player-facing rows for the Lifepath tables in ../data/character (ADR-0012, ADR-0020): Origins,
 * Why You Enlisted, Training Years, and Class Rank. Every row and number comes from the tables.
 * How to roll them lives in Making Your Soldier; the Compendium only lays the options side by side.
 */
import { parse } from 'yaml';
import originsText from '../../../data/character/origins.yaml?raw';
import enlistmentText from '../../../data/character/enlistment.yaml?raw';
import trainingText from '../../../data/character/training-years.yaml?raw';
import classRankText from '../../../data/character/class-rank.yaml?raw';
import attributesText from '../../../data/character/attributes.yaml?raw';
import talentsText from '../../../data/character/talents.yaml?raw';
import catalogText from '../../../data/character/action-catalog.yaml?raw';
import { checkPlayerText, hyphenatedIds } from './player-text';

export interface Ref {
  slug: string;
  name: string;
}
export interface OriginRow {
  id: string;
  roll: string;
  name: string;
  description: string;
  attributes: Ref[];
  talents: Ref[];
  havens: string[];
  canonTie: { character: string; link: string } | null;
  campaignYearMin: number | null;
}
export interface EnlistmentRow {
  id: string;
  roll: string;
  reason: string;
  attribute: Ref;
  drive: { name: string; trigger: string; namedComrade: boolean };
}
export interface TrainingEvent {
  id: string;
  roll: string;
  name: string;
  description: string;
  attribute: Ref;
  talents: Ref[];
  merit: number;
}
export interface TrainingYear {
  id: string;
  title: string;
  subtitle: string;
  performance: Ref[];
  curriculum: Ref[];
  events: TrainingEvent[];
}
export interface ClassRankRow {
  merit: string;
  rank: number;
  top10: boolean;
}
export interface LifepathTables {
  /** The six attributes, in their own order. */
  attributes: Ref[];
  origins: OriginRow[];
  enlistment: EnlistmentRow[];
  years: TrainingYear[];
  classRank: { classSize: number; rows: ClassRankRow[]; keyAttributeBonus: number };
}

interface RawOrigin {
  id: string;
  results: number[];
  name: string;
  description: string;
  attributes: string[];
  talent_choice: string[];
  haven_choice: string[];
  canon_tie: { character: string; link: string } | null;
  condition: { campaign_year_min?: number } | null;
}
interface RawEnlistment {
  id: string;
  results: number[];
  reason: string;
  attribute: string;
  drive: { name: string; trigger: string; needs_named_comrade: boolean };
}
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
interface RawRank {
  merit_min: number | null;
  merit_max: number | null;
  class_rank: number;
  top_10: boolean;
}

const roll = (results: number[]) => (results.length === 1 ? String(results[0]) : `${Math.min(...results)} to ${Math.max(...results)}`);
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function lifepathTables(): LifepathTables {
  const attributes = new Map(
    (parse(attributesText) as { attributes: { id: string; name: string }[] }).attributes.map((a) => [a.id, { slug: a.id, name: a.name }]),
  );
  const talentRows = (parse(talentsText) as { talents: { id: string; name: string }[] }).talents;
  const talents = new Map(talentRows.map((t) => [t.id, { slug: t.id, name: t.name }]));
  const catalogRows = (parse(catalogText) as { entries: { id: string; name: string }[] }).entries;
  const ids = hyphenatedIds([...talentRows, ...catalogRows]);

  const attr = (id: string, where: string): Ref => {
    const found = attributes.get(id);
    if (!found) throw new Error(`${where} names an attribute that does not exist.`);
    return found;
  };
  const talent = (id: string, where: string): Ref => {
    const found = talents.get(id);
    if (!found) throw new Error(`${where} names a Talent that does not exist.`);
    return found;
  };
  const text = (where: string, s: string) => checkPlayerText(where, s, ids, 'Fix the table row; the Origins page shows it as written.');

  const origins = (parse(originsText) as { rows: RawOrigin[] }).rows.map((row) => ({
    id: row.id,
    roll: roll(row.results),
    name: row.name,
    description: text(`The Origin "${row.name}"`, row.description),
    attributes: row.attributes.map((a) => attr(a, `The Origin "${row.name}"`)),
    talents: row.talent_choice.map((t) => talent(t, `The Origin "${row.name}"`)),
    havens: row.haven_choice.map((h) => text(`A Haven of "${row.name}"`, h)),
    canonTie: row.canon_tie ? { character: row.canon_tie.character, link: text(`The Canon Tie of "${row.name}"`, row.canon_tie.link) } : null,
    campaignYearMin: row.condition?.campaign_year_min ?? null,
  }));

  const enlistment = (parse(enlistmentText) as { rows: RawEnlistment[] }).rows.map((row) => ({
    id: row.id,
    roll: roll(row.results),
    reason: text(`The Why You Enlisted row "${row.drive.name}"`, row.reason),
    attribute: attr(row.attribute, `The Why You Enlisted row "${row.drive.name}"`),
    drive: {
      name: row.drive.name,
      trigger: text(`The Drive "${row.drive.name}"`, row.drive.trigger),
      namedComrade: row.drive.needs_named_comrade,
    },
  }));

  const years = (parse(trainingText) as { years: RawYear[] }).years.map((year) => {
    const [title, ...rest] = year.name.split(', ');
    return {
      id: year.id,
      title,
      subtitle: rest.join(', '),
      performance: year.performance_attributes.map((a) => attr(a, year.name)),
      curriculum: year.curriculum.map((t) => talent(t, year.name)),
      events: year.events.map((e) => ({
        id: slugify(e.name),
        roll: roll(e.results),
        name: e.name,
        description: text(`The event "${e.name}"`, e.description),
        attribute: attr(e.attribute, `The event "${e.name}"`),
        talents: e.talent_choice.map((t) => talent(t, `The event "${e.name}"`)),
        merit: e.merit_change,
      })),
    };
  });

  const rank = parse(classRankText) as { class_size: number; rows: RawRank[]; top_10: { key_attribute_bonus: number } };
  const classRank = {
    classSize: rank.class_size,
    keyAttributeBonus: rank.top_10.key_attribute_bonus,
    rows: rank.rows.map((row) => ({
      merit: row.merit_min === null ? `${row.merit_max} or less` : row.merit_max === null ? `${row.merit_min} or more` : String(row.merit_min),
      rank: row.class_rank,
      top10: row.top_10,
    })),
  };

  return { attributes: [...attributes.values()], origins, enlistment, years, classRank };
}
