/**
 * Player-facing rows for the core rules tables in ../data/core (ADR-0012, ADR-0020).
 * The row list and every number come from the tables. The wording for each row is
 * written here for players, keyed by the row's id, and a row with no wording fails
 * the build, so a new row can never go missing from a page.
 */
import { parse } from 'yaml';
import dicePoolText from '../../../data/core/dice-pool.yaml?raw';
import stressText from '../../../data/core/stress-changes.yaml?raw';
import bonusText from '../../../data/core/bonus-dice-sources.yaml?raw';

/** A Player's Guide chapter slug ("fighting-titans") or an anchor on the same page ("#help"). */
export type SeeRef = string;

export interface TableRow {
  cells: string[];
  see: SeeRef[];
}

export interface TableGroup {
  heading?: string;
  rows: TableRow[];
}

export interface CoreTableData {
  caption: string;
  note?: string;
  /** Column headings, the last of which is the "See" column. */
  columns: string[];
  groups: TableGroup[];
}

/** Labels for same-page anchors a table row can point to. */
export const PAGE_ANCHORS: Record<string, string> = {
  '#pushing-your-luck': 'Pushing Your Luck',
  '#covering': 'Covering',
  '#help': 'Help',
};

const andList = new Intl.ListFormat('en', { type: 'conjunction' });
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function wording<T>(map: Record<string, T>, id: string, table: string): T {
  const entry = map[id];
  if (!entry) throw new Error(`${table}: the row "${id}" has no player wording.`);
  return entry;
}

// ---------------------------------------------------------------- Dice pool

interface RawComponent {
  id: string;
  name: string;
  min?: number | string;
  max?: number | null;
  max_exception?: { max: number };
  min_when_worn?: number;
  min_base_dice_after?: number;
  never_removes?: string[];
}
interface RawException {
  roll: string;
  name: string;
  attribute: string;
  components_excluded: string[];
  bonus_sources_excluded: string[];
  push_allowed: boolean;
  talent_dice_allowed: boolean;
}

const dicePool = parse(dicePoolText) as { components: RawComponent[]; roll_exceptions: RawException[] };

const POOL_ORDER = ['attribute', 'talent', 'bonus', 'penalty', 'gear', 'stress'] as const;
type PoolId = (typeof POOL_ORDER)[number];

export interface PoolStep {
  name: string;
  /** How many dice the step adds or removes, in words. */
  count: string;
}

/** The pool components in build order, with their limits in words. */
export function poolSteps(): Record<PoolId, PoolStep> {
  const ids = dicePool.components.map((c) => c.id);
  if (ids.join() !== POOL_ORDER.join()) throw new Error(`Dice pool: the components changed (${ids.join(', ')}).`);
  const c = Object.fromEntries(dicePool.components.map((x) => [x.id, x])) as Record<PoolId, RawComponent>;
  const names = new Map(dicePool.components.map((x) => [x.id, x.name]));
  const range = (x: RawComponent) => `${x.min} to ${x.max}`;
  const floor = c.penalty.min_base_dice_after ?? 1;
  const never = (c.penalty.never_removes ?? []).map((id) => names.get(id) ?? id);
  if (!c.attribute.max_exception) throw new Error('Dice pool: the attribute exception is missing.');

  return {
    attribute: { name: c.attribute.name, count: `${range(c.attribute)}, or ${c.attribute.max_exception.max} on your Specialty's key attribute` },
    talent: { name: c.talent.name, count: `${range(c.talent)}, from one Talent` },
    bonus: { name: c.bonus.name, count: range(c.bonus) },
    penalty: {
      name: 'Penalties',
      count: `Never below ${floor} base ${floor === 1 ? 'die' : 'dice'}, and never ${new Intl.ListFormat('en', { type: 'disjunction' }).format(never)}`,
    },
    gear: { name: c.gear.name, count: `${range(c.gear)} from one item, or ${c.gear.min_when_worn ?? 0} when it is worn down` },
    stress: { name: c.stress.name, count: c.stress.max == null ? 'Your current Stress, with no maximum' : `Your current Stress, up to ${c.stress.max}` },
  };
}

const EXCEPTION_WORDING: Record<string, { attribute?: string; see: SeeRef[] }> = {
  'death-roll': { see: ['wounds-and-fear'] },
  'performance-roll': { attribute: "The higher of the Training Year's performance attributes", see: ['making-your-soldier'] },
};

const LEFT_OUT: Record<string, string> = { talent: 'Talent dice' };

export function rollExceptions(): CoreTableData {
  const names = new Map(dicePool.components.map((c) => [c.id, c.name]));
  const yesNo = (b: boolean) => (b ? 'Yes' : 'No');
  return {
    caption: 'Rolls with exceptions',
    note: 'Every other attribute roll uses the whole pool.',
    columns: ['Roll', 'Attribute', 'Leaves out', 'Help', 'Push', 'See'],
    groups: [
      {
        rows: dicePool.roll_exceptions.map((r) => {
          const w = wording(EXCEPTION_WORDING, r.roll, 'Roll exceptions');
          const attribute = w.attribute ?? (/^[a-z]+$/.test(r.attribute) ? capitalise(r.attribute) : null);
          if (!attribute) throw new Error(`Roll exceptions: "${r.roll}" has an attribute with no player wording.`);
          if (r.talent_dice_allowed === r.components_excluded.includes('talent')) {
            throw new Error(`Roll exceptions: "${r.roll}" disagrees with itself about Talent dice.`);
          }
          const out = r.components_excluded.map((id) => {
            const name = LEFT_OUT[id] ?? names.get(id);
            if (!name) throw new Error(`Roll exceptions: "${r.roll}" leaves out an unknown component "${id}".`);
            return name;
          });
          return {
            cells: [r.name, attribute, out.length ? andList.format(out) : 'Nothing', yesNo(!r.bonus_sources_excluded.includes('help')), yesNo(r.push_allowed)],
            see: w.see,
          };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Stress changes

interface RawStressRow {
  id: string;
  amount: number | string;
}
interface RawStress {
  starting_value: string;
  minimum: { base: number; per_scar: number; reductions_stop_at_minimum: boolean };
  maximum: number | null;
  gains: RawStressRow[];
  reductions: RawStressRow[];
}

const STRESS_WORDING: Record<string, { trigger: string; who: string; amount?: string; see: SeeRef[] }> = {
  push: { trigger: 'You Push a roll, and no one Covers the Push.', who: 'You', see: ['#pushing-your-luck'] },
  cover: { trigger: "You Cover a comrade's Push.", who: 'You', see: ['#covering'] },
  'named-gain': {
    trigger:
      'A table result, a Talent, or an Expedition rule such as hunger names a gain. A Fear Roll result that spreads fear gives its Stress to every comrade within one Position step of the soldier who rolled: that is Stress, not a roll, and causes no Fear Roll.',
    who: 'As that rule states',
    amount: 'As that rule states',
    see: ['wounds-and-fear', 'expeditions-and-downtime'],
  },
  'engagement-ends': {
    trigger: 'A Titan Engagement ends, for any reason, including a retreat.',
    who: 'Every soldier, player character or Squadmate, who held a Position at any point during it',
    see: ['fighting-titans'],
  },
  'nape-kill': {
    trigger: 'A Nape strike kills a Titan.',
    who: 'Every soldier, player character or Squadmate, who holds a Position in that Titan Engagement when the kill happens',
    see: ['fighting-titans'],
  },
  'named-reduction': { trigger: 'A table result or a Talent names a loss.', who: 'As that rule states', amount: 'As that rule states', see: ['wounds-and-fear'] },
  'camp-relief': {
    trigger: 'At a Night Camp, the camp roll succeeds and the camp does not meet hunger.',
    who: 'Every soldier on the Expedition',
    see: ['expeditions-and-downtime'],
  },
  'skirmish-ends': { trigger: 'A Skirmish ends, for any reason.', who: 'Every soldier, player character or Squadmate, who took part in it', see: ['skirmishes'] },
  downtime: {
    trigger: 'A player character takes Recover or Visit Haven, or a Squadmate takes the Squadmate relief.',
    who: 'That soldier',
    see: ['expeditions-and-downtime'],
  },
  'graduation-exam-ends': { trigger: 'The Graduation Exam ends.', who: 'Every Cadet who took it', amount: 'Lose all', see: ['making-your-soldier'] },
};

export function stressChanges(): CoreTableData {
  const doc = parse(stressText) as RawStress;
  if (doc.starting_value !== 'minimum') throw new Error('Stress changes: the starting value changed.');
  const row =
    (verb: 'Gain' | 'Lose') =>
    (r: RawStressRow): TableRow => {
      const w = wording(STRESS_WORDING, r.id, 'Stress changes');
      let amount: string;
      if (typeof r.amount === 'number') amount = `${verb} ${r.amount}`;
      else if (w.amount) amount = w.amount;
      else throw new Error(`Stress changes: "${r.id}" has an amount with no player wording.`);
      return { cells: [w.trigger, w.who, amount], see: w.see };
    };
  const max = doc.maximum == null ? 'has no maximum' : `has a maximum of ${doc.maximum}`;
  return {
    caption: 'Stress changes',
    note: `Stress starts at your minimum Stress and ${max}.${doc.minimum.reductions_stop_at_minimum ? ' A loss stops at your minimum.' : ''}`,
    columns: ['When', 'Who', 'Change', 'See'],
    groups: [
      { heading: 'Gaining Stress', rows: doc.gains.map(row('Gain')) },
      { heading: 'Losing Stress', rows: doc.reductions.map(row('Lose')) },
    ],
  };
}

// ---------------------------------------------------------------- Bonus Dice sources

interface RawSource {
  id: string;
  name: string;
  dice_per_unit: number;
  unit: string;
  max_units: number | null;
  spends?: string;
}

const BONUS_WORDING: Record<string, { unit?: [string, string]; addsTo: string; when: string; spends?: string; see: SeeRef[] }> = {
  help: {
    unit: ['helper', 'helpers'],
    addsTo:
      'Any attribute roll except the Death Roll, the performance roll, and a roll whose own rule forbids Help, such as the first two Trials of the Graduation Exam.',
    when: 'The helper meets every Help requirement.',
    spends: "In a Titan Engagement, the helper's action. Outside one, what the rule calling for the roll states.",
    see: ['#help'],
  },
  opening: {
    unit: ['Opening spent', 'Openings spent'],
    addsTo: 'Nape strike',
    when: 'The struck Titan has at least one Opening, and you did not create it.',
    spends: 'The Opening',
    see: ['fighting-titans'],
  },
  'grounded-titan': { addsTo: 'Nape strike', when: 'The struck Titan has a Broken leg.', see: ['fighting-titans'] },
  'read-from-distant': { addsTo: 'Read', when: 'You hold Distant relative to the Focus Titan you Read.', see: ['fighting-titans'] },
  'call-it': {
    addsTo: 'Dodge',
    when: "A comrade's Read Called the behavior you dodge. The reader's own dodge gains nothing.",
    see: ['fighting-titans'],
  },
  'medical-supplies': {
    addsTo: 'A Treat Injury roll in a care window. Never a roll in a Titan Engagement, and never an aftermath roll.',
    when: 'The Squad Supply holds at least 1 medical unit.',
    spends: '1 medical unit of Squad Supply',
    see: ['wounds-and-fear', 'gear-and-odm'],
  },
  ambush: {
    addsTo: "A soldier's Fight or Shoot roll in a Skirmish",
    when: 'The Squad has the ambush in that Skirmish, and the attacked Foe has not yet acted in it.',
    see: ['skirmishes'],
  },
};

export function bonusDiceSources(): CoreTableData {
  const doc = parse(bonusText) as { cap_per_roll: number; sources: RawSource[] };
  return {
    caption: 'Bonus Dice sources',
    note: `At most ${doc.cap_per_roll} Bonus Dice per roll, from every source together.`,
    columns: ['Source', 'Dice', 'Adds to', 'When', 'Spends', 'See'],
    groups: [
      {
        rows: doc.sources.map((s) => {
          const w = wording(BONUS_WORDING, s.id, 'Bonus Dice sources');
          let dice: string;
          if (s.unit === 'roll' || s.max_units === 1) dice = String(s.dice_per_unit);
          else if (w.unit) dice = `${s.dice_per_unit} per ${w.unit[0]}${s.max_units ? `, up to ${s.max_units} ${w.unit[1]}` : ''}`;
          else throw new Error(`Bonus Dice sources: "${s.id}" has a unit with no player wording.`);
          const spends = w.spends ?? (s.spends === 'nothing' ? 'Nothing' : null);
          if (!spends) throw new Error(`Bonus Dice sources: "${s.id}" spends something with no player wording.`);
          return { cells: [s.name, dice, w.addsTo, w.when, spends], see: w.see };
        }),
      },
    ],
  };
}
