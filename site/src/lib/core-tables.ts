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
import circumstancesText from '../../../data/core/circumstances.yaml?raw';

/** A Player's Guide chapter slug ("fighting-titans") or an anchor on the same page ("#help"). */
export type SeeRef = string;

/**
 * A cell: plain text, a choice between options ("A or B"), a list of lines each on its own
 * row, or text with a smaller note under it.
 */
export type Cell = string | { options: string[] } | { lines: string[] } | { text: string; note: string };

export interface TableRow {
  cells: Cell[];
  /** Links for the "See" column; a table with no "See" column leaves it out. */
  see?: SeeRef[];
}

export interface TableGroup {
  heading?: string;
  /** A line under the heading, for a group whose rows work differently from the rest. */
  note?: string;
  rows: TableRow[];
}

export interface CoreTableData {
  caption: string;
  note?: string;
  /** Column headings. The last is the "See" column unless `see` is false. */
  columns: string[];
  groups: TableGroup[];
  /** False for a table with no "See" column. */
  see?: boolean;
  /** True when the first column is a die result, kept on one line. */
  roll?: boolean;
}

/** Labels for same-page anchors a table row can point to. */
export const PAGE_ANCHORS: Record<string, string> = {
  '#pushing-your-luck': 'Pushing Your Luck',
  '#covering': 'Covering',
  '#help': 'Help',
  '#circumstances': 'Circumstances',
  '#called-rolls': 'Called rolls',
  '#passive-rolls': 'Passive rolls',
};

const andList = new Intl.ListFormat('en', { type: 'conjunction' });
const orList = new Intl.ListFormat('en', { type: 'disjunction' });
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
  /** Player wording written in the source table, where a row has one. */
  player_text?: string;
}
interface RawFailure {
  id: string;
}

const dicePool = parse(dicePoolText) as {
  components: RawComponent[];
  roll_exceptions: RawException[];
  called_roll: { failure_menu: RawFailure[] };
};

const POOL_ORDER = ['attribute', 'talent', 'bonus', 'penalty', 'gear', 'stress'] as const;
type PoolId = (typeof POOL_ORDER)[number];

export interface PoolStep {
  name: string;
  /** How many dice the step adds or removes, in words. */
  count: string;
}

/**
 * The player wording a roll exception carries in the source table, so a rule
 * written for players lives in one place instead of two.
 */
export function exceptionText(roll: string): string {
  const row = dicePool.roll_exceptions.find((r) => r.roll === roll);
  if (!row) throw new Error(`Roll exceptions: no row named "${roll}".`);
  if (!row.player_text) throw new Error(`Roll exceptions: "${roll}" has no player wording.`);
  return row.player_text.trim();
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
  'passive-roll': { attribute: 'The attribute of the entry the GM rolls for', see: ['#passive-rolls'] },
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

// ---------------------------------------------------------------- What a failed called roll costs

const FAILURE_WORDING: Record<string, { name: string; text: string }> = {
  'it-does-not-happen': {
    name: 'It does not happen',
    text: 'Nothing beyond the failure itself. The GM can always stake this, and it is what a roll costs when the GM stakes nothing else.',
  },
  stress: { name: '1 Stress', text: 'You gain 1 Stress: once for the roll, however many times you Pushed it, and never on a success.' },
  fall: {
    name: 'A fall',
    text: "A low or a high fall, as the GM names from the height, or low if the GM names none, and never an extreme one. In a fight it is a fall in full, and where it drops you is the fall rule's to say, not the ruling's.",
  },
  damage: {
    name: 'Damage',
    text: '1 to 3 damage of a named Injury Type, such as Crush for a blow, Cut for an edge, Pierce for a point, or Burn for fire. Never 4 or more. The GM states your current Health with any stake that names damage or a fall.',
  },
  'lost-item-or-unit': {
    name: 'A lost item or unit',
    text: 'One item you carry is lost, or 1 unit of one kind of Squad Supply is spent. Never gear wear, which is the price of a Push.',
  },
  'time-or-position': {
    name: 'Time or position',
    text: 'The situation changes, described, and the next roll has to reckon with it: the window closes, the patrol arrives, the door is barred, the Squad is noticed, or a fight begins. In a fight it touches nothing the fight tracks: never a Position, a card, a turn, a move, an action beyond the one the act spent, Attention, an Opening, or a clock.',
  },
};

/** The closed menu of what a failed called roll can cost. */
export function failureMenu(): CoreTableData {
  return {
    caption: 'What a failed called roll costs',
    note: 'The GM stakes one of these before the dice are rolled. A failed roll costs that, and nothing else.',
    columns: ['Cost', 'What it means'],
    see: false,
    groups: [
      {
        rows: dicePool.called_roll.failure_menu.map((r) => {
          const w = wording(FAILURE_WORDING, r.id, 'Called roll costs');
          return { cells: [w.name, w.text] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Circumstances

interface RawStep {
  id: string;
  name: string;
  dice: number;
  kind: 'bonus' | 'penalty' | 'none';
}

const circumstances = parse(circumstancesText) as { default: string; steps: RawStep[] };

const CIRCUMSTANCE_WORDING: Record<string, string> = {
  effortless: 'You could hardly fail. An easier task than this is not rolled at all.',
  routine: 'Nothing stands in your way but the task itself.',
  easy: 'Something about the moment is on your side.',
  standard: 'The assumption behind every roll, and the step you are at when the GM names none.',
  hard: 'Something is working against you.',
  harsh: 'The moment is badly against you.',
  desperate: 'As bad as it gets and still possible. Nothing is worse than this.',
};

/** What a step does to your pool, in words, from its kind and its dice. */
function stepDice(step: RawStep): string {
  const n = Math.abs(step.dice);
  if (step.kind === 'none') {
    if (step.dice !== 0) throw new Error(`Circumstances: "${step.id}" changes dice but counts as neither a source nor a penalty.`);
    return 'No change';
  }
  if (step.kind === 'bonus') {
    if (step.dice <= 0) throw new Error(`Circumstances: "${step.id}" is a Bonus Dice source but adds no dice.`);
    return `+${n} Bonus ${n === 1 ? 'Die' : 'Dice'}`;
  }
  if (step.kind === 'penalty') {
    if (step.dice >= 0) throw new Error(`Circumstances: "${step.id}" is a penalty but removes no dice.`);
    return `A ${n}-die penalty`;
  }
  throw new Error(`Circumstances: "${step.id}" has a kind with no player wording.`);
}

export function circumstancesLadder(): CoreTableData {
  const fallback = circumstances.steps.find((s) => s.id === circumstances.default);
  if (!fallback) throw new Error('Circumstances: the default step is not on the ladder.');
  return {
    caption: 'Circumstances',
    note: `One step for the roll, named by the GM before any Bonus Dice are declared. A roll the GM names no step for is ${fallback.name}.`,
    columns: ['Step', 'Your pool', 'What it means'],
    see: false,
    groups: [
      {
        rows: circumstances.steps.map((s) => ({ cells: [s.name, stepDice(s), wording(CIRCUMSTANCE_WORDING, s.id, 'Circumstances')] })),
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
  ruling: { trigger: 'You fail a called roll whose stakes, named before the roll, were Stress.', who: 'You', see: ['#called-rolls'] },
  'named-gain': {
    trigger:
      'A table result, a Talent, or an Expedition rule such as hunger names a gain. A Fear Roll result that spreads fear gives its Stress to every comrade in the soldier’s zone or an adjacent zone: that is Stress, not a roll, and causes no Fear Roll.',
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
  /** A source counted in units gives these three; one whose dice a rule states gives `dice` instead. */
  dice_per_unit?: number | Record<string, number>;
  unit?: string;
  max_units?: number | null;
  dice?: string;
  spends?: string;
}

const BONUS_WORDING: Record<string, { unit?: [string, string]; addsTo: string; when: string; spends?: string; see: SeeRef[] }> = {
  help: {
    unit: ['helper', 'helpers'],
    addsTo:
      'Any attribute roll except the Death Roll, the performance roll, a passive roll, and a roll whose own rule forbids Help, such as the first two Trials of the Graduation Exam.',
    when: 'The helper meets every Help requirement.',
    spends:
      "In a Titan Engagement or a Skirmish, the helper's action. On a roll a rule calls for outside both, what that rule states. On a called roll outside both, nothing, unless the GM names a cost of time or position before the dice.",
    see: ['#help'],
  },
  circumstances: {
    addsTo: 'Any attribute roll you or a Squadmate make, except the rolls that take no Circumstances.',
    when: 'The GM named Easy, Routine, or Effortless as the Circumstances, with the stakes and before any Bonus Dice are declared.',
    see: ['#circumstances'],
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
  momentum: {
    addsTo: 'A strike or a Break Attention this turn against the Titan you flew relative to, for Bite. Your next dodge this round, for Brace.',
    when: 'You are in a Titan Engagement and hold the Momentum to spend.',
    spends: '1 Momentum per die',
    see: ['fighting-titans'],
  },
  'terrain-trait': {
    addsTo: "A mounted soldier's Break Attention, which is the only Terrain Trait that gives dice.",
    when: 'The fight is at the Open Anchor Rating.',
    spends: 'Nothing',
    see: ['fighting-titans'],
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
          if (s.dice !== undefined) dice = capitalise(s.dice);
          else if (typeof s.dice_per_unit === 'object') {
            // A source whose dice depend on a named step, such as Circumstances.
            const steps = new Map(circumstances.steps.map((step) => [step.id, step.name]));
            dice = orList.format(
              Object.entries(s.dice_per_unit)
                .sort((a, b) => a[1] - b[1])
                .map(([id, n]) => {
                  const name = steps.get(id);
                  if (!name) throw new Error(`Bonus Dice sources: "${s.id}" names a step "${id}" that is not on the Circumstances ladder.`);
                  return `${n} at ${name}`;
                }),
            );
          } else if (s.dice_per_unit === undefined) throw new Error(`Bonus Dice sources: "${s.id}" states no dice.`);
          else if (s.unit === 'roll' || s.max_units === 1) dice = String(s.dice_per_unit);
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
