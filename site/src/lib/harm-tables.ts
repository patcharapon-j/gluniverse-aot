/**
 * Player-facing rows for the harm and mind tables in ../data/harm and ../data/mind
 * (ADR-0012, ADR-0020), rendered by CoreTable. The row lists, every number, every name,
 * and every effect come from the tables. The wording each row needs for players is
 * written here, keyed by the row's id, and a row with no wording fails the build, so a
 * new row can never go missing from a page.
 */
import { parse } from 'yaml';
import healthText from '../../../data/harm/health.yaml?raw';
import injuriesText from '../../../data/harm/critical-injuries.yaml?raw';
import downText from '../../../data/harm/down.yaml?raw';
import deathText from '../../../data/harm/death-rolls.yaml?raw';
import treatText from '../../../data/harm/treat-injury.yaml?raw';
import healingText from '../../../data/harm/healing.yaml?raw';
import endText from '../../../data/harm/engagement-end.yaml?raw';
import effectsText from '../../../data/harm/effect-types.yaml?raw';
import responsesText from '../../../data/mind/stress-responses.yaml?raw';
import fearText from '../../../data/mind/fear-rolls.yaml?raw';
import scarsText from '../../../data/mind/scars.yaml?raw';
import griefText from '../../../data/mind/grief.yaml?raw';
import catalogText from '../../../data/character/action-catalog.yaml?raw';
import type { Cell, CoreTableData } from './core-tables';

const andList = new Intl.ListFormat('en', { type: 'conjunction' });

interface Exit {
  kind: 'stop' | 'note' | 'cover';
  label: string;
  text: string;
}

/** One station of a drafted procedure, as StepFlow draws it. */
export interface FlowStep {
  title: string;
  text: string;
  icon?: string;
  /** Compact dice notation for the small drawing, for example "base:4,5". */
  dice?: string;
  exit?: Exit;
}

function wording<T>(map: Record<string, T>, id: string, table: string): T {
  const entry = map[id];
  if (entry === undefined) throw new Error(`${table}: the row "${id}" has no player wording.`);
  return entry;
}

const catalog = parse(catalogText) as { entries: { id: string; name: string }[] };
const ENTRY_NAMES = new Map(catalog.entries.map((e) => [e.id, e.name]));

function entryName(id: string, table: string): string {
  const name = ENTRY_NAMES.get(id);
  if (!name) throw new Error(`${table}: no Action Catalog entry "${id}".`);
  return name;
}

const entryNames = (ids: string[], table: string) => andList.format(ids.map((id) => entryName(id, table)));

// ---------------------------------------------------------------- shared shapes

interface Results {
  min: number | null;
  max: number | null;
}

/** "4 or less", "10 to 11", "13 or more", "7". */
function resultLabel(results: Results): string {
  const { min, max } = results;
  if (min === null && max === null) return 'Any';
  if (min === null) return `${max} or less`;
  if (max === null) return `${min} or more`;
  return min === max ? String(min) : `${min} to ${max}`;
}

interface RawEffect {
  type: string;
  dice?: number;
  amount?: number;
  turns?: number;
  entries?: string[];
  toward?: string;
  text?: string;
  applies_to?: string;
  applies_after?: string;
}

const days = (n: number) => `${n} day${n === 1 ? '' : 's'}`;

/**
 * One row effect, written for players. Keyed by effect type, so a table row that names a
 * type with no wording fails the build rather than printing nothing.
 */
const EFFECT_TEXT: Record<string, (e: RawEffect, table: string) => string> = {
  penalty: (e, t) => `${e.dice}-die penalty on ${entryNames(e.entries ?? [], t)}`,
  'next-roll-penalty': (e) => `${e.dice}-die penalty on your next roll`,
  'stress-gain': (e) => `gain ${e.amount} Stress`,
  'push-stress': (e) => `${e.amount} extra Stress on every Push`,
  'lose-successes': (e) => `lose ${e.amount} success${e.amount === 1 ? '' : 'es'}`,
  'zero-successes': () => 'the roll fails',
  'spend-next-turn': (e) => `next ${e.turns === 1 ? 'turn' : `${e.turns} turns`} spent`,
  'spend-next-action': () => 'next action spent',
  'no-reactions': () => 'no Reactions',
  'fear-roll-total': (e) => `Fear Roll total raised by ${e.amount}`,
  'gain-scar': () => 'gain a Scar',
  'draw-attention': () => "you take the loudest mark on the event's Titan, never from Distant",
  'stress-gain-nearby': (e) => `comrades within 1 Position step gain ${e.amount} Stress`,
  'forced-move': (e) => `1 step toward ${e.toward === 'distant' ? 'Distant' : 'the nearest comrade'} at the start of your next turn`,
  'forced-action': () => "your next action is a strike on the event's Titan, Pushed if it falls short",
  'drop-blade-set': () => 'drop the Blade Set in your handles',
  'gas-roll': () => 'a Gas Roll at once',
  other: (e) => e.text ?? '',
};

/** Qualifiers a row may hang on an effect. Their own wording, keyed by the exact phrase. */
const QUALIFIER_TEXT: Record<string, string> = {
  'that dodge only': 'that dodge only',
  'in addition to the Covering Stress': 'on top of the Covering Stress',
};

function effectText(effect: RawEffect, table: string): string {
  const write = EFFECT_TEXT[effect.type];
  if (!write) throw new Error(`${table}: the effect "${effect.type}" has no player wording.`);
  let text = write(effect, table);
  if (effect.applies_to) text += ` (${wording(QUALIFIER_TEXT, effect.applies_to, table)})`;
  return text;
}

function effectList(effects: RawEffect[] | undefined, table: string, none = 'None'): string {
  if (!effects?.length) return none;
  const joined = effects.map((e) => effectText(e, table)).join('; ');
  return `${joined.charAt(0).toUpperCase()}${joined.slice(1)}.`;
}

// ---------------------------------------------------------------- Health and harm

interface RawHarmKind {
  id: string;
  name: string;
}
interface RawRestoring {
  id: string;
  name: string;
}

const healthDoc = parse(healthText) as {
  health: { boxes_crossed_off: string; current_min: number };
  harm_kinds: (RawHarmKind & { by_ruling?: { amount: { min: number; max: number } } })[];
  restoring: RawRestoring[];
};

/** What each kind of harm does to a soldier, and what names it. */
const HARM_KIND_WORDING: Record<string, { does: string; named: string }> = {
  damage: {
    does: 'Marks that many Health boxes. Damage that brings you to 0 marks the boxes and gives a Critical Injury of its own Injury Type; damage taken while you are already at 0 gives one instead of marking anything.',
    named: 'A fall, steam, a Heave against a corpse, a Foe’s weapon, and a called roll whose stakes named it.',
  },
  'critical-injury': {
    does: 'A lasting wound at an Injury Location, of a named Injury Type. While untreated it crosses off one Health box, and it never adds to Health lost.',
    named: 'Every Titan attack, the Grab’s crush, the falling Titan’s pin, corpse heat, and damage that reaches or is taken at 0 current Health.',
  },
  death: {
    does: 'The soldier dies and leaves play.',
    named: 'A failed Death Roll, an instant-death row, and the Grab’s devour step. No Behavior Table entry names it.',
  },
};

export function harmKindsTable(): CoreTableData {
  const T = 'The kinds of harm';
  return {
    caption: 'The three kinds of harm',
    note: 'A rule that harms you names one kind and its parameters. Nothing else harms a soldier.',
    columns: ['Kind', 'What it does', 'Named by'],
    see: false,
    groups: [
      {
        rows: healthDoc.harm_kinds.map((kind) => {
          const w = wording(HARM_KIND_WORDING, kind.id, T);
          return { cells: [kind.name, w.does, w.named] as Cell[] };
        }),
      },
    ],
  };
}

/** The damage a called roll's stakes may name, from the table's own limits. */
export function rulingDamage(): { min: number; max: number } {
  const damage = healthDoc.harm_kinds.find((k) => k.id === 'damage');
  if (!damage?.by_ruling) throw new Error('Health: damage has no ruling limits.');
  return damage.by_ruling.amount;
}

const RESTORING_WORDING: Record<string, { who: string; what: string }> = {
  revive: {
    who: 'A Down soldier at 0 current Health with Health lost above 0',
    what: 'A successful Treat Injury restores 1 Health lost per success, erasing that many damage marks. Crossed-off boxes do not come back.',
  },
  'treated-or-healed': {
    who: 'A soldier whose untreated Critical Injury is treated or heals',
    what: 'The box it crossed off comes back, unless you still hold at least as many untreated Critical Injuries as Health.',
  },
  'day-passes': {
    who: 'Every living soldier, each time a day passes',
    what: 'All Health lost to damage comes back, erasing every damage mark. Crossed-off boxes stay crossed off.',
  },
};

export function healthRestoreTable(): CoreTableData {
  const T = 'Getting Health back';
  return {
    caption: 'Getting Health back',
    note: 'Nothing else restores Health lost in the field.',
    columns: ['How', 'Who', 'What comes back'],
    see: false,
    groups: [
      {
        rows: healthDoc.restoring.map((row) => {
          const w = wording(RESTORING_WORDING, row.id, T);
          return { cells: [row.name, w.who, w.what] as Cell[] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- effects

interface RawEffectType {
  id: string;
  name: string;
  outside_titan_engagement: string;
}

const effectsDoc = parse(effectsText) as { effect_types: RawEffectType[] };

/**
 * Every effect a row in this chapter can carry, written for players. The name is written
 * here rather than taken from the table, because two of the table's names use words the
 * site does not put on a page.
 */
const EFFECT_WORDING: Record<string, { name: string; does: string; outside?: string }> = {
  penalty: {
    name: 'Dice penalty',
    does: 'Every roll you make for a named entry loses that many base dice. Penalties from every source add up, never take you below 1 base die, and never touch Gear Dice or Stress Dice.',
  },
  'next-roll-penalty': {
    name: 'Penalty on your next roll',
    does: 'Your next attribute roll other than a Death Roll loses that many base dice. Then it is used up.',
  },
  'stress-gain': {
    name: 'Stress gain',
    does: 'You gain that much Stress once, each time the row takes effect. A Critical Injury gains it once, when it is recorded; holding it gains nothing more.',
  },
  'push-stress': {
    name: 'Extra Stress on every Push',
    does: 'Each Push costs that much Stress on top of the Push’s own, Covered or not. It adds no Stress Die.',
  },
  'lose-successes': {
    name: 'Lose successes',
    does: 'The roll that caused the result loses that many successes, to a minimum of 0. The lowered count is the roll’s count for everything afterwards, a dodge’s later cancelling included.',
  },
  'zero-successes': { name: 'The roll fails', does: 'The roll that caused the result has 0 successes.' },
  'spend-next-turn': {
    name: 'Next turn spent',
    does: 'It spends your earliest turn whose move and action are both unspent, exactly as a Reaction spends one. The turn still happens and still counts, but begins with nothing left.',
    outside: 'Nothing, unless the rule that called for the roll says otherwise.',
  },
  'spend-next-action': {
    name: 'Next action spent',
    does: 'It spends the action of your earliest turn whose action is unspent. That turn keeps its move. You cannot Help that round, or make a Reaction with that turn.',
    outside: 'Nothing, unless the rule that called for the roll says otherwise.',
  },
  'no-reactions': {
    name: 'No Reactions',
    does: 'You make no Reaction until the end of the first of your turns to begin after the result, or the second on a row that spends two turns. A Titan’s card then lands on 1 or more of its successes, and a card scoring 0 still whiffs. It ends when the fight ends.',
    outside: 'Nothing, unless the rule that called for the roll says otherwise.',
  },
  'fear-roll-total': { name: 'Fear Roll total raised', does: 'The named Fear Roll’s total is raised by that much before its row is read.' },
  'gain-scar': { name: 'Gain a Scar', does: 'You gain a Scar, rolled on the Scar table.' },
  'draw-attention': {
    name: 'The loudest mark',
    does: 'You take the loudest mark on the event’s Titan, the mark Draw Attention sets, unless you hold Distant relative to it. It lasts as every mark does. A scream from beyond its reach turns nothing.',
    outside: 'Nothing.',
  },
  'stress-gain-nearby': {
    name: 'Stress to comrades nearby',
    does: 'Every comrade at your Position or one step away, compared relative to the event’s Titan, gains that much Stress once. It is Stress, not a roll, and it applies only after every Fear Roll of that event has found its row.',
    outside: 'In a Skirmish, every other soldier in it gains the Stress. Anywhere else, nothing.',
  },
  'forced-move': {
    name: 'A forced step',
    does: 'At the start of your next turn, before anything else in it, your Position changes by one step: toward Distant by the retreat’s first option, or toward the nearest comrade. It is a result and not your move, so it spends nothing and happens even on a turn spent in advance. No step is made for a soldier who is Down, Grabbed, Pinned, carried, or has left, who has no such step, or who is already there, and it never makes you leave or let go.',
    outside: 'Nothing.',
  },
  'forced-action': {
    name: 'A forced strike',
    does: 'Your next action must be a Nape strike or a Body Part strike against the event’s Titan, with every requirement those entries have, Pushed if it falls short and you may Push. Until you make it you take no other action but Swap Blade Set, and you cannot Help or Cover. It waits while you are Grabbed, Down, or Pinned, and a strike you cannot legally make does not end it.',
    outside: 'In a Skirmish, your next action must be a Fight or a Shoot against a Foe, under the same rules. Anywhere else, nothing.',
  },
  'drop-blade-set': {
    name: 'Blade Set dropped',
    does: 'The Blade Set in your handles falls and lies at your Position. Nobody takes it during the fight, and it is shared out with the left items when the fight ends. With empty handles, nothing happens. The swap refits you from a carried set.',
    outside: 'It applies, and the dropped set is shared out when the scene ends.',
  },
  'gas-roll': {
    name: 'A Gas Roll at once',
    does: 'If a canister with a Gas Rating above 0 is fitted, you make a two-die Gas Roll on it at once. It is not the round’s Gas Roll and it is not ODM use.',
  },
  'forbids-entries': {
    name: 'Entries you cannot take',
    does: 'You cannot take, make, or use any listed entry, and nothing that needs its roll can be done. A Talent on a listed entry does nothing for you. It removes no die from any other roll.',
  },
  other: { name: 'Stated effect', does: 'The row’s own words are the whole effect. Only Scars use it.' },
};

const OUTSIDE_STANDARD: Record<string, string> = {
  applies: 'It applies.',
};

export function effectTypesTable(): CoreTableData {
  const T = 'Effects';
  return {
    caption: 'How to read an effect',
    note: 'Every row in this chapter names its effects from this list, so each one has exactly one reading. Outside a Titan Engagement there are no turns and no Reactions.',
    columns: ['Effect', 'What it does', 'Outside a Titan Engagement'],
    see: false,
    groups: [
      {
        rows: effectsDoc.effect_types.map((type) => {
          const w = wording(EFFECT_WORDING, type.id, T);
          const outside = OUTSIDE_STANDARD[type.outside_titan_engagement] ?? w.outside;
          if (!outside) throw new Error(`${T}: the effect "${type.id}" has no wording for outside a Titan Engagement.`);
          return { cells: [w.name, w.does, outside] as Cell[] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Critical Injuries

interface RawInjuryRow {
  id: string;
  names: Record<string, string>;
  results: Results;
  down?: false | 'until_treated';
  lethal?: boolean;
  time_limit?: string | null;
  death_roll_penalty?: number;
  instant_death?: boolean;
  effects?: RawEffect[];
  healing_days?: number;
  permanent_effects?: RawEffect[];
  repeat_row?: string;
}
interface RawRider {
  rows?: string[];
  all_rows?: boolean;
  lethal_rows?: boolean;
  sets?: { time_limit?: string; healing_days_multiplier?: number; heals_untreated?: boolean };
  treat_injury?: string | { penalty: number };
}
interface RawInjuryTable {
  injury_location: string;
  non_lethal_cap: string;
  type_riders: Record<string, RawRider[]>;
  rows: RawInjuryRow[];
}
interface RawGrade {
  id: string;
  name: string;
  row: string;
  sides_lost: number;
  penalties: RawEffect[];
  forbids_entries: string[];
  forbids_decoys: string[];
  no_gear_dice_from: { item: string; entries: string[] }[];
  mount_or_dismount: string;
  moves: Record<string, string>;
}

const injuriesDoc = parse(injuriesText) as {
  types: { id: string; name: string }[];
  sides: { side_roll: { roll: string; odd: string; even: string } };
  gaining: { steps: { id: string }[]; net_success_rider: { add_per_net_success_beyond_first: number } };
  worsening: { per_held_injury: number };
  injury_location_table: { roll: string; rows: { results: Results; injury_location: string; side: string | null }[] };
  tables: Record<string, RawInjuryTable>;
  lost_limb_riders: { grades: RawGrade[] };
};

/** Where each Injury Type comes from, written for players. */
const INJURY_TYPE_WORDING: Record<string, string> = {
  crush: 'Every Titan behavior that is not a Bite, the Grab’s crush, the falling Titan’s pin, every fall, and a club or a fist.',
  bite: 'A Titan’s Bite, and the Straggler on an Expedition.',
  burn: 'Steam at a kill and at a Regeneration fill, corpse heat on a Pinned soldier and on a soldier who Heaves a corpse, a Bandit’s firebrand, and a flare fired at a person.',
  cut: 'A Blade Set, a sabre, or a knife.',
  pierce: 'A shot.',
};

/** The icon for each Injury Type, from the site's injury set. */
export const INJURY_TYPE_ICONS: Record<string, string> = {
  crush: 'injury-crush',
  bite: 'injury-bite',
  burn: 'injury-burn',
  cut: 'injury-cut',
  pierce: 'injury-pierce',
};

const TYPE_NAMES = new Map(injuriesDoc.types.map((t) => [t.id, t.name]));

const typeName = (id: string) => {
  const name = TYPE_NAMES.get(id);
  if (!name) throw new Error(`Critical Injuries: no Injury Type "${id}".`);
  return name;
};

export function injuryTypesTable(): CoreTableData {
  const T = 'Injury Types';
  return {
    caption: 'The five Injury Types',
    note: 'Every rule that wounds you names the type. The GM never picks one.',
    columns: ['Injury Type', 'Where it comes from'],
    see: false,
    groups: [
      {
        rows: injuriesDoc.types.map((type) => ({ cells: [type.name, wording(INJURY_TYPE_WORDING, type.id, T)] as Cell[] })),
      },
    ],
  };
}

/** The Injury Types, for the icon key. */
export function injuryTypes(): { id: string; name: string; icon: string; note: string }[] {
  const T = 'Injury Types';
  return injuriesDoc.types.map((type) => ({
    id: type.id,
    name: type.name,
    icon: wording(INJURY_TYPE_ICONS, type.id, T),
    note: wording(INJURY_TYPE_WORDING, type.id, T),
  }));
}

const LOCATION_NAMES: Record<string, string> = { arm: 'arm', leg: 'leg', torso: 'torso', head: 'head' };
const SIDE_NAMES: Record<string, string> = { left: 'Left', right: 'Right' };

function locationLabel(location: string, side: string | null, table: string): string {
  const name = wording(LOCATION_NAMES, location, table);
  if (!side) return name.charAt(0).toUpperCase() + name.slice(1);
  return `${wording(SIDE_NAMES, side, table)} ${name}`;
}

export function injuryLocationTable(): CoreTableData {
  const T = 'Injury Location';
  const loc = injuriesDoc.injury_location_table;
  const roll = injuriesDoc.sides.side_roll;
  return {
    caption: 'Injury Location',
    note: `Rolled unless the harm’s rule names one. When a rule names an arm or a leg with no side, roll ${roll.roll} for the side instead: odd is ${roll.odd}, even is ${roll.even}.`,
    columns: [loc.roll, 'Where it lands'],
    see: false,
    roll: true,
    groups: [
      {
        rows: loc.rows.map((row) => ({ cells: [resultLabel(row.results), locationLabel(row.injury_location, row.side, T)] as Cell[] })),
      },
    ],
  };
}

/** What a lethal row's time limit means in the Lethal column. */
const LETHAL_COLUMN: Record<string, string> = {
  turn: 'Yes, at the end of each of your turns',
  engagement: 'Yes, when the fight ends',
  day: 'Yes, each day',
};

const DOWN_COLUMN: Record<string, string> = { until_treated: 'Until treated' };

function injuryRowCells(table: RawInjuryTable, row: RawInjuryRow, T: string): Cell[] {
  const names = { lines: injuriesDoc.types.map((type) => `${type.name}: ${row.names[type.id]}`) };
  for (const type of injuriesDoc.types) {
    if (!row.names[type.id]) throw new Error(`${T}: the row "${row.id}" has no name for ${type.name}.`);
  }
  if (row.instant_death) {
    return [resultLabel(row.results), names, 'Instant death', 'You die at once', 'None', 'None', 'None', 'None', 'None'];
  }
  const lethal = row.lethal ? wording(LETHAL_COLUMN, row.time_limit ?? '', T) : 'No';
  let repeat = 'None';
  if (row.repeat_row) {
    const target = table.rows.find((r) => r.id === row.repeat_row);
    if (!target) throw new Error(`${T}: the row "${row.id}" repeats to a row this table does not have.`);
    repeat = `The ${resultLabel(target.results)} row`;
  }
  return [
    resultLabel(row.results),
    names,
    row.down ? wording(DOWN_COLUMN, row.down, T) : 'No',
    lethal,
    String(row.death_roll_penalty ?? 0),
    effectList(row.effects, T),
    days(row.healing_days ?? 0),
    effectList(row.permanent_effects, T),
    repeat,
  ];
}

function injuryTable(location: string): () => CoreTableData {
  return () => {
    const T = `Critical Injuries, ${location}`;
    const table = injuriesDoc.tables[location];
    if (!table) throw new Error(`${T}: the tables have no "${location}" Injury Location.`);
    const cap = table.rows.find((r) => r.id === table.non_lethal_cap);
    if (!cap) throw new Error(`${T}: the cap row is not on this table.`);
    const sided = location === 'arm' || location === 'leg';
    return {
      caption: `${locationLabel(location, null, T)} Critical Injuries`,
      note: `Roll 2D6 and add ${injuriesDoc.worsening.per_held_injury} for each Critical Injury that counts toward worsening at that ${
        sided ? `${location}, on the same side` : location
      }. One that cannot be lethal uses the ${resultLabel(cap.results)} row in place of a lethal or instant-death row.`,
      columns: [
        '2D6',
        'What you take',
        'Down',
        'Lethal',
        'Death Roll penalty',
        'While you hold it',
        'Healing',
        'Permanent',
        'Gained before at that side',
      ],
      see: false,
      roll: true,
      groups: [{ rows: table.rows.map((row) => ({ cells: injuryRowCells(table, row, T) })) }],
    };
  };
}

/** What each field a type rider sets does to the Critical Injury. */
const RIDER_SETS: Record<string, (value: unknown, table: string) => string> = {
  time_limit: (value, table) => `The Death Roll comes ${wording(RIDER_LIMITS, String(value), table)}`,
  healing_days_multiplier: (value) => `Healing time is multiplied by ${value}`,
  heals_untreated: (value) => {
    if (value !== false) throw new Error('Type riders: only a rider that stops healing has player wording.');
    return 'It does not heal at all until a Treat Injury roll succeeds on it';
  },
};

const RIDER_LIMITS: Record<string, string> = {
  turn: 'at the end of each of your turns until it is treated',
  engagement: 'when the fight ends',
  day: 'each day',
};

const RIDER_TREATMENT: Record<string, string> = {
  requires_kit_or_supplies: 'Treat Injury on it needs a medical kit, or 1 medical unit of Squad Supply spent on the roll. Without either the roll is not made',
};

function riderText(rider: RawRider, T: string): string {
  const parts: string[] = [];
  for (const [field, value] of Object.entries(rider.sets ?? {})) {
    const write = RIDER_SETS[field];
    if (!write) throw new Error(`${T}: a rider sets "${field}", which has no player wording.`);
    parts.push(write(value, T));
  }
  if (rider.treat_injury) {
    if (typeof rider.treat_injury === 'string') parts.push(wording(RIDER_TREATMENT, rider.treat_injury, T));
    else parts.push(`${rider.treat_injury.penalty}-die penalty on every Treat Injury roll on it`);
  }
  if (!parts.length) throw new Error(`${T}: a rider changes nothing a player can read.`);
  return `${parts.join('. ')}.`;
}

function riderRows(rider: RawRider, table: RawInjuryTable, T: string): string {
  if (rider.all_rows) return 'Every row';
  if (rider.lethal_rows) return 'Every lethal row';
  const rows = (rider.rows ?? []).map((id) => {
    const row = table.rows.find((r) => r.id === id);
    if (!row) throw new Error(`${T}: a rider names a row this table does not have.`);
    return resultLabel(row.results);
  });
  if (!rows.length) throw new Error(`${T}: a rider picks no rows.`);
  return `The ${andList.format(rows)} row${rows.length === 1 ? '' : 's'}`;
}

export function injuryRidersTable(): CoreTableData {
  const T = 'Type riders';
  return {
    caption: 'What an Injury Type changes',
    note: 'The type picks which of the row’s names your wound shows. Where a table carries a rider for that type, it also changes the fields below, for that Critical Injury alone. A type with no rider on a table changes nothing else.',
    columns: ['Injury Type', 'Rows it changes', 'What it changes'],
    see: false,
    groups: Object.entries(injuriesDoc.tables).map(([location, table]) => ({
      heading: `${locationLabel(location, null, T)}`,
      rows: Object.entries(table.type_riders).flatMap(([type, riders]) =>
        riders.map((rider) => ({ cells: [typeName(type), riderRows(rider, table, T), riderText(rider, T)] as Cell[] })),
      ),
    })),
  };
}

const MOVE_WORDING: Record<string, string> = {
  unchanged: 'as usual',
  spends_action: 'also spends your action',
  forbidden: 'cannot be made',
};
const MOVE_KIND_NAMES: Record<string, string> = { on_foot: 'On foot', mounted: 'Mounted', odm: 'ODM' };
const MOUNT_WORDING: Record<string, string> = {
  unchanged: 'Mount and Dismount as usual.',
  with_help: 'Mount or Dismount only with a comrade’s help.',
};
const DECOY_NAMES: Record<string, string> = {
  feint: 'the Feint',
  flare: 'the flare',
  'thrown-cloak': 'the thrown cloak',
  'riderless-horse': 'the riderless horse',
};
const GEAR_NAMES: Record<string, string> = { 'odm-gear': 'ODM Gear', horse: 'the horse' };

/** What each grade leaves alone, and what a helped mount asks for. */
const GRADE_WORDING: Record<string, { keeps: string; mount?: string }> = {
  'one-arm': { keeps: 'Everything else: Ride, the dodge, Read, Rally, Break Attention, Draw Attention, Help, and command from the saddle.' },
  'both-arms': {
    keeps: 'Shed Load; Mount or Dismount with a comrade’s help, and Ride while mounted; the dodge and Leap Clear, with the horse’s Gear Dice while mounted; the riderless-horse decoy; Read; Call It; Rally; Draw Attention; Help; Cover; and Swap Initiative Card.',
    mount: 'In a Titan Engagement a comrade at your Position who is not Down spends their action; in a Skirmish a comrade taking part who is not Down spends theirs; anywhere else a comrade in the Squad who is not Down, on the same Expedition or in the Squad when none is under way, helps and spends nothing. Without that help there is no mount and no dismount.',
  },
  'one-leg': { keeps: 'Everything else, flight included.' },
  'both-legs': {
    keeps: 'The dodge and Leap Clear, with the rows’ penalties, which stack; Heave; a strike at a Titan at In Reach; Read; Rally; Break Attention; Draw Attention; Treat Injury; Field Repair; and being carried by Lift Comrade, at your consent. You travel across a comrade’s saddle or in the wagon.',
  },
};

export function lostLimbsTable(): CoreTableData {
  const T = 'Lost limbs';
  return {
    caption: 'What a lost limb costs',
    note: 'A grade applies from the moment you meet it, for as long as you live, on top of the row’s own permanent effects, which stack. Lose the second arm or leg and you move from the one-limb grade to the both-limbs grade.',
    columns: ['Grade', 'Penalties it adds', 'Cannot take', 'Moves', 'Keeps'],
    see: false,
    groups: [
      {
        rows: injuriesDoc.lost_limb_riders.grades.map((grade) => {
          const w = wording(GRADE_WORDING, grade.id, T);
          const forbidden = [
            ...grade.forbids_entries.map((id) => entryName(id, T)),
            ...grade.forbids_decoys.map((id) => wording(DECOY_NAMES, id, T)),
          ];
          const gear = grade.no_gear_dice_from.map(
            (row) => `No Gear Dice from ${wording(GEAR_NAMES, row.item, T)} on ${entryNames(row.entries, T)}`,
          );
          const moves = Object.entries(grade.moves).map(
            ([kind, value]) => `${wording(MOVE_KIND_NAMES, kind, T)}: ${wording(MOVE_WORDING, value, T)}`,
          );
          const mount = wording(MOUNT_WORDING, grade.mount_or_dismount, T);
          const penalties = [effectList(grade.penalties, T, ''), ...gear].filter(Boolean);
          return {
            cells: [
              grade.name,
              penalties.length ? { lines: penalties } : 'None. The row’s own penalties still stack.',
              forbidden.length ? { lines: forbidden } : 'Nothing',
              { lines: [...moves, w.mount ? `${mount} ${w.mount}` : mount] },
              w.keeps,
            ] as Cell[],
          };
        }),
      },
    ],
  };
}

/** The steps of gaining a Critical Injury, for the walkthrough drawing. */
const INJURY_STEP_WORDING: Record<string, FlowStep> = {
  'injury-location': {
    title: 'Where it lands.',
    icon: 'ph:crosshair-simple',
    text: 'Use the Injury Location the harm’s rule names. If it names an arm or a leg without a side, roll D6 for the side. If it names none, roll D6 on the Injury Location table, which gives the side with it.',
    exit: { kind: 'note', label: 'Four tables', text: 'The arm table serves both arms and the leg table both legs. The torso and the head have no side.' },
  },
  roll: {
    title: 'Roll 2D6, plus worsening.',
    dice: 'base:4,5',
    text: 'Add 2 for each Critical Injury that counts toward worsening at that same Injury Location and side: every one you hold there, treated or not, and every healed one there whose row has permanent effects. Find the row whose totals include yours.',
    exit: { kind: 'cover', label: 'Not a comparison', text: 'The row comes from the new total alone. It is never measured against an earlier Critical Injury’s row.' },
  },
  'net-success-rider': {
    title: 'A Titan attack that landed hard.',
    icon: 'ph:lightning',
    text: 'If this is a Titan attack’s Critical Injury and the attack landed with more than 1 Net Success, add 1 for each Net Success beyond the first and find the row again. Against a soldier who made no Reaction, every success is net.',
    exit: { kind: 'stop', label: 'Nothing else', text: 'No other harm takes the rider: not the Grab’s crush, a fall, damage, or a Stress gain.' },
  },
  'repeat-permanent': {
    title: 'Gained before.',
    icon: 'ph:arrow-u-up-left',
    text: 'If the row has permanent effects and you have gained it before at that same side, held or healed, use the row it repeats to instead. You lose each arm and each leg at most once, and an eye at most once.',
  },
  'cannot-be-lethal': {
    title: 'A wound that cannot kill.',
    icon: 'ph:shield',
    text: 'If the harm’s rule says the Critical Injury cannot be lethal and the row found is lethal or instant death, use the table’s capped row instead.',
  },
  'type-rider': {
    title: 'The Injury Type’s rider.',
    icon: 'injury-burn',
    text: 'The type picks which of the row’s names you take. If the table carries a rider for that type covering this row, apply what it sets: a time limit, healing time, whether it heals untreated, and what Treat Injury asks of a treater.',
  },
  record: {
    title: 'Write it down.',
    icon: 'harm-critical-injury',
    text: 'Record it as untreated, with its side, its Injury Type, its time limit, and its healing time. It crosses off one Health box. Apply its effects, its permanent effects, and any lost-limb grade you now meet. A Stress gain on the row is gained once, now. On an instant-death row you die instead.',
    exit: { kind: 'note', label: 'Treating it', text: 'A successful Treat Injury stabilizes a lethal one, ends a Down row’s hold, and gives back the box, but never removes its effects.' },
  },
  'down-check': {
    title: 'Check Down.',
    icon: 'harm-down',
    text: 'If the Critical Injury crossed off your last box you are Down, and no further Critical Injury follows.',
  },
};

/** The gaining procedure, in the table's order, for StepFlow. */
export function criticalInjurySteps(): FlowStep[] {
  const T = 'Gaining a Critical Injury';
  const rider = injuriesDoc.gaining.net_success_rider.add_per_net_success_beyond_first;
  if (rider !== 1) throw new Error(`${T}: the Net Success rider no longer adds 1.`);
  return injuriesDoc.gaining.steps.map((step) => wording(INJURY_STEP_WORDING, step.id, T));
}

// ---------------------------------------------------------------- Down, lethal, Death Rolls

const downDoc = parse(downText) as {
  conditions: { id: string }[];
  forbids: string[];
  while_down: { cannot: { id: string }[]; can: string[] };
};

const deathDoc = parse(deathText) as {
  time_limits: { id: string; slows_to?: string }[];
  death_roll: { attribute: string; needs: number };
  outcomes: { id: string; successes: Results }[];
};

const TIME_LIMIT_WORDING: Record<string, { name: string; when: string }> = {
  turn: {
    name: 'Each turn',
    when: 'At the end of each of your turns in a Titan Engagement or a Skirmish, starting with the first that begins after you took the wound. A turn spent in advance, a turn spent by a result, a Down soldier’s turn, and the turn of a soldier who has left all count. When the fight ends it becomes the next limit down.',
  },
  engagement: {
    name: 'The end of the fight',
    when: 'Once, when the Titan Engagement or Skirmish it was gained in ends, after the aftermath rolls and before the care window. Only treatment during the fight, or a successful aftermath roll, prevents that Death Roll.',
  },
  day: {
    name: 'Each day',
    when: 'Each time a day passes, after that day’s care window, or after the infirmary roll on a day in Downtime.',
  },
  stabilized: {
    name: 'Stabilized',
    when: 'Not lethal any more. It has no time limit and never causes a Death Roll again.',
  },
};

export function timeLimitsTable(): CoreTableData {
  const T = 'Time limits';
  const limits = deathDoc.time_limits;
  return {
    caption: 'The three time limits',
    note: 'Listed fastest first. Two or more successes on a Death Roll slows a limit one step down this table.',
    columns: ['Limit', 'When it runs out', 'Slows to'],
    see: false,
    groups: [
      {
        rows: limits.map((limit) => {
          const w = wording(TIME_LIMIT_WORDING, limit.id, T);
          const slow = limit.slows_to ? wording(TIME_LIMIT_WORDING, limit.slows_to, T).name : 'Nothing. It is already safe.';
          return { cells: [w.name, w.when, slow] as Cell[] };
        }),
      },
    ],
  };
}

const OUTCOME_WORDING: Record<string, string> = {
  dies: 'You die.',
  'holds-on': 'You live, and the time limit runs out again as it stands. Outside both a Titan Engagement and a Skirmish, a surviving turn or end-of-fight limit becomes a daily one instead.',
  'fights-back': 'You live, and the time limit slows one step. A daily limit that slows is stabilized.',
};

export function deathRollOutcomesTable(): CoreTableData {
  const T = 'Death Roll outcomes';
  return {
    caption: 'Death Roll outcomes',
    note: `Strength alone, minus the Critical Injury’s Death Roll penalty, plus the dice of one Talent that names the Death Roll. It needs ${deathDoc.death_roll.needs} success.`,
    columns: ['Successes', 'What happens'],
    see: false,
    roll: true,
    groups: [
      {
        rows: deathDoc.outcomes.map((outcome) => ({
          cells: [resultLabel(outcome.successes), wording(OUTCOME_WORDING, outcome.id, T)] as Cell[],
        })),
      },
    ],
  };
}

/** What the Death Roll needs, for the harm drawing. */
export function deathRoll(): { attribute: string; needs: number } {
  return { attribute: deathDoc.death_roll.attribute, needs: deathDoc.death_roll.needs };
}

/** What Down forbids, from the state's own row. */
export function downForbids(): string[] {
  const T = 'Down';
  const NAMES: Record<string, string> = { push: 'Pushing', help: 'Help', cover: 'Covering', reaction: 'Reactions' };
  return downDoc.forbids.map((id) => wording(NAMES, id, T));
}

// ---------------------------------------------------------------- Treat Injury

const treatDoc = parse(treatText) as {
  needs: number;
  uses: { id: string; changes: string[] }[];
  patients: Record<string, string>;
  care_windows: { held: { id: string }[] };
};

const USE_WORDING: Record<string, { name: string; patient: string; success: string }> = {
  revive: {
    name: 'Revive',
    patient: 'A Down comrade at 0 current Health whose Health lost is above 0. Nobody revives themselves.',
    success: 'Restore 1 Health lost per success, up to their Health lost, erasing that many damage marks. Crossed-off boxes do not come back, and Down goes on if a Down row still holds them.',
  },
  treat: {
    name: 'Treat',
    patient: 'A soldier holding at least one untreated Critical Injury. Name one of them before you roll. You may treat your own, at a 2-die penalty.',
    success: 'It becomes treated and gives back the Health box it crossed off, unless the patient still holds at least as many untreated Critical Injuries as Health. A lethal one is stabilized.',
  },
};

export function treatUsesTable(): CoreTableData {
  const T = 'Treat Injury';
  return {
    caption: 'The two uses of Treat Injury',
    note: `Declare one use and one patient before rolling. Each needs ${treatDoc.needs} success, and on a failure nothing happens.`,
    columns: ['Use', 'Patient', 'On a success'],
    see: false,
    groups: [
      {
        rows: treatDoc.uses.map((use) => {
          const w = wording(USE_WORDING, use.id, T);
          return { cells: [w.name, w.patient, w.success] as Cell[] };
        }),
      },
    ],
  };
}

const WINDOW_WORDING: Record<string, { name: string; when: string; who: string }> = {
  'engagement-end': {
    name: 'A Titan Engagement ends',
    when: 'At the end steps, after that fight’s Death Rolls.',
    who: 'Every soldier in the Squad who held a Position at any point during it.',
  },
  'outside-harm': {
    name: 'Harm away from a fight',
    when: 'Once for each event outside both a Titan Engagement and a Skirmish that makes a soldier Down, or gives one a lethal Critical Injury that runs out by turn or by the end of a fight. One window per event, however many it harmed, held as soon as the event is resolved unless its own rule names a later moment. The Death Rolls follow it.',
    who: 'The soldiers that rule names as taking part, such as a Chase’s riders. If it names none, every soldier in the Squad on the same Expedition as a harmed soldier, or every soldier in the Squad when none is under way. A roll here may only treat a Critical Injury the event gave, or revive a soldier it made Down.',
  },
  day: {
    name: 'A day passes',
    when: 'Each time a day passes, before daily limits run out. No window is held on a day that passes in Downtime.',
    who: 'Every soldier on that Expedition, or every soldier in the Squad on the day that passes at the start of a session.',
  },
  downtime: { name: 'Downtime', when: 'Once in each Downtime, at the infirmary, before its seven days pass.', who: 'Every soldier in the Squad.' },
  'skirmish-end': { name: 'A Skirmish ends', when: 'At its end steps, after its Death Rolls.', who: 'Every soldier who took part.' },
};

export function careWindowsTable(): CoreTableData {
  const T = 'Care windows';
  return {
    caption: 'When a care window is held',
    note: 'Away from a Titan Engagement and a Skirmish, Treat Injury is rolled only in a care window or as an aftermath roll.',
    columns: ['Window', 'When', 'Who is in it'],
    see: false,
    groups: [
      {
        rows: treatDoc.care_windows.held.map((window) => {
          const w = wording(WINDOW_WORDING, window.id, T);
          return { cells: [w.name, w.when, w.who] as Cell[] };
        }),
      },
    ],
  };
}

const healingDoc = parse(healingText) as { each_day: string[] };

const DAY_STEP_WORDING: Record<string, string> = {
  'Hold a care window': 'Hold a care window.',
  'Every lethal Critical Injury with a day limit': 'Every lethal Critical Injury with a daily limit runs out and causes a Death Roll.',
  'Every living soldier gets back all': 'Every living soldier gets back all Health lost to damage, erasing every damage mark. Crossed-off boxes stay crossed off.',
  'Every held Critical Injury': 'Every held Critical Injury’s remaining healing time drops by 1 day, and one that reaches 0 heals. An untreated Pierce from the 7 row up does not drop.',
};

/** Each day's steps, in the table's order. Keyed by the opening words of the table's own line. */
export function dayStepsList(): string[] {
  const T = 'When a day passes';
  return healingDoc.each_day.map((line) => {
    const key = Object.keys(DAY_STEP_WORDING).find((k) => line.startsWith(k));
    if (!key) throw new Error(`${T}: the step "${line.slice(0, 40)}" has no player wording.`);
    return DAY_STEP_WORDING[key];
  });
}

// ---------------------------------------------------------------- Stress Responses and Rally

interface RawResultRow {
  id: string;
  name: string;
  results: Results;
  duration?: string;
  text: string;
  effects: RawEffect[];
  forbids?: string[];
}

const responsesDoc = parse(responsesText) as { table: { roll: string; rows: RawResultRow[] }; rally: { needs: number } };

const DURATIONS: Record<string, string> = { instant: 'Instant', lasting: 'Lasting' };

const rollHeading = (roll: string) => roll.replace(/-/g, '−');

export function stressResponsesTable(): CoreTableData {
  const T = 'Stress Responses';
  return {
    caption: 'Stress Responses',
    note: 'The name and the line beside it are fiction. Only the duration and the effects are rules.',
    columns: [rollHeading(responsesDoc.table.roll), 'Response', 'What happens', 'Duration', 'Effects'],
    see: false,
    roll: true,
    groups: [
      {
        rows: responsesDoc.table.rows.map((row) => ({
          cells: [
            resultLabel(row.results),
            row.name,
            row.text,
            wording(DURATIONS, row.duration ?? '', T),
            effectList(row.effects, T, 'None'),
          ] as Cell[],
        })),
      },
    ],
  };
}

/** What Rally needs. */
export function rallyNeeds(): number {
  return responsesDoc.rally.needs;
}

// ---------------------------------------------------------------- Fear Rolls

const fearDoc = parse(fearText) as {
  triggers: { id: string; can_arise_outside_titan_engagement: boolean }[];
  table: { roll: string; rows: RawResultRow[] };
  placement: Record<string, string>;
};

const TRIGGER_WORDING: Record<string, { name: string; event: string; who: string }> = {
  'first-titan-engagement': {
    name: 'Your first Titan',
    event: 'A Titan Engagement starts and you have never held a Position in one before.',
    who: 'You alone, when you first hold a Position in it. Facing a Titan is recorded even if you make no roll, so the trigger never comes again.',
  },
  abnormal: {
    name: 'An Abnormal',
    event: 'A Titan Engagement starts with an Abnormal as a Focus Titan, or one becomes a Focus Titan during it.',
    who: 'Every soldier holding a Position in that fight.',
  },
  'second-focus-titan': {
    name: 'A second Focus Titan',
    event: 'A Background Titan enters as a second Focus Titan.',
    who: 'Every soldier holding a Position in that fight.',
  },
  'comrade-grabbed': { name: 'A comrade Grabbed', event: 'A comrade is taken into a Titan’s hand.', who: 'Every witness. Never the Grabbed soldier.' },
  'comrade-dies': {
    name: 'A comrade dies',
    event: 'A comrade dies.',
    who: 'Every witness. A witness who is Grabbed still rolls. In a Skirmish, every other soldier taking part who is alive.',
  },
  'first-human-kill': {
    name: 'Your first kill',
    event: 'You kill a person for the first time, in a Skirmish.',
    who: 'You alone, when the kill resolves. It is recorded, so the trigger never comes again.',
  },
  'gm-horror': {
    name: 'Horror the GM names',
    event: 'Outside a Titan Engagement, an event the GM judges at least as horrifying as a listed trigger: a village found devoured, a comrade’s body found days after, a Titan seen from the Wall tearing through a breach.',
    who: 'The witnesses the GM names, each a soldier who saw it.',
  },
};

export function fearTriggersTable(): CoreTableData {
  const T = 'Fear Roll triggers';
  return {
    caption: 'The Fear Roll triggers',
    note: 'The list is closed. The dice never cause a Fear Roll, and no other ruling calls one.',
    columns: ['Trigger', 'The event', 'Who rolls', 'Away from a Titan fight'],
    see: false,
    groups: [
      {
        rows: fearDoc.triggers.map((trigger) => {
          const w = wording(TRIGGER_WORDING, trigger.id, T);
          return {
            cells: [
              w.name,
              w.event,
              w.who,
              trigger.can_arise_outside_titan_engagement
                ? 'It can happen there, and causes Fear Rolls only if the rule that creates it says who rolls.'
                : 'It cannot happen there.',
            ] as Cell[],
          };
        }),
      },
    ],
  };
}

const FORBIDS_NAMES: Record<string, string> = { reaction: 'Reactions', help: 'Help', cover: 'Covering' };

export function fearRollsTable(): CoreTableData {
  const T = 'Fear Rolls';
  return {
    caption: 'Fear Roll results',
    note: 'Every row is instant. The name and the line beside it are fiction. Only the effects and what the row forbids are rules.',
    columns: [rollHeading(fearDoc.table.roll), 'Result', 'What happens', 'Effects', 'Forbids'],
    see: false,
    roll: true,
    groups: [
      {
        rows: fearDoc.table.rows.map((row) => ({
          cells: [
            resultLabel(row.results),
            row.name,
            row.text,
            effectList(row.effects, T, 'None'),
            row.forbids?.length ? andList.format(row.forbids.map((id) => wording(FORBIDS_NAMES, id, T))) : 'Nothing',
          ] as Cell[],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- Scars and Grief

interface RawScar {
  id: string;
  name: string;
  results: number[];
  squadmate_rerolls?: boolean;
  effects: RawEffect[];
}

const scarsDoc = parse(scarsText) as {
  gaining: { maximum: number };
  every_scar: { minimum_stress: string; resolve: string };
  table: { roll: string; rows: RawScar[] };
};

/** Each Scar's trigger and effect, written for players. */
const SCAR_WORDING: Record<string, { trigger: string; effect: string }> = {
  'the-closing-hand': {
    trigger: 'You dodge a behavior that can Grab, which its Behavior Table marks.',
    effect: '1-die penalty on that dodge only.',
  },
  'survivors-guilt': {
    trigger: 'A comrade in the Squad dies.',
    effect: 'Gain 1 Stress, after your Fear Roll for that death if you make one, and otherwise when the death happens.',
  },
  'unsteady-hands': { trigger: 'You roll Treat Injury or Field Repair.', effect: '1-die penalty on Treat Injury and Field Repair.' },
  'cannot-look-away': { trigger: 'You make a Fear Roll for a comrade Grabbed.', effect: 'That Fear Roll’s total is raised by 1.' },
  numb: { trigger: 'A comrade in the Squad dies.', effect: 'You make no Fear Roll for that death, and you gain 1 more Grief from it.' },
  'reckless-blade': {
    trigger: 'Your Nape strike or Body Part strike falls short of what it needs and you are allowed to Push it.',
    effect: 'You must Push that roll.',
  },
  'nerves-on-edge': { trigger: 'For the first time in a Titan Engagement, a Titan’s card resolves a behavior against you.', effect: 'Gain 1 Stress.' },
  'fear-of-falling': { trigger: 'You roll Fly.', effect: '1-die penalty on Fly.' },
  'blood-on-the-blade': { trigger: 'Your Nape strike kills a Titan.', effect: 'Gain 1 Stress, after the Nape-kill Stress relief.' },
  'carrying-their-weight': { trigger: 'You Cover a comrade’s Push.', effect: 'Gain 1 Stress, on top of the Covering Stress.' },
  'second-guessing': { trigger: 'You roll Read or Break Attention.', effect: '1-die penalty on Read and Break Attention.' },
  'old-nightmare': { trigger: 'You make a Fear Roll for an Abnormal or a second Focus Titan.', effect: 'That Fear Roll’s total is raised by 1.' },
};

/** "11 to 13" from the row's D66 results. */
function scarLabel(results: number[]): string {
  const min = Math.min(...results);
  const max = Math.max(...results);
  return min === max ? String(min) : `${min} to ${max}`;
}

export function scarsTable(): CoreTableData {
  const T = 'Scars';
  return {
    caption: 'The Scar table',
    note: 'Every Scar raises your minimum Stress and your Resolve by 1. Each row also names a moment that bites.',
    columns: [scarsDoc.table.roll, 'Scar', 'Trigger', 'Effect', 'A Squadmate rolls again'],
    see: false,
    roll: true,
    groups: [
      {
        rows: scarsDoc.table.rows.map((row) => {
          const w = wording(SCAR_WORDING, row.id, T);
          if (!row.effects.length) throw new Error(`${T}: the Scar "${row.id}" carries no effect.`);
          return { cells: [scarLabel(row.results), row.name, w.trigger, w.effect, row.squadmate_rerolls ? 'Yes' : 'No'] as Cell[] };
        }),
      },
    ],
  };
}

/** What a Scar changes, as a filter chip: one kind per row, from the row's first effect. */
const SCAR_KINDS: Record<string, { slug: string; name: string; order: number }> = {
  penalty: { slug: 'penalty', name: 'A penalty', order: 1 },
  'stress-gain': { slug: 'stress', name: 'Stress', order: 2 },
  'fear-roll-total': { slug: 'fear', name: 'A worse Fear Roll', order: 3 },
  other: { slug: 'other', name: 'Its own words', order: 4 },
};

export interface ScarEntry {
  slug: string;
  name: string;
  roll: string;
  trigger: string;
  effect: string;
  kind: { slug: string; name: string; order: number };
  squadmateRerolls: boolean;
  search: string;
}

/** Every Scar as a Compendium card, in the table's order. */
export function scarEntries(): ScarEntry[] {
  const T = 'Scars';
  return scarsDoc.table.rows.map((row) => {
    const w = wording(SCAR_WORDING, row.id, T);
    const first = row.effects[0];
    if (!first) throw new Error(`${T}: the Scar "${row.id}" carries no effect.`);
    return {
      slug: row.id,
      name: row.name,
      roll: scarLabel(row.results),
      trigger: w.trigger,
      effect: w.effect,
      kind: wording(SCAR_KINDS, first.type, T),
      squadmateRerolls: row.squadmate_rerolls === true,
      search: [row.name, w.trigger, w.effect].join(' '),
    };
  });
}

/** The D66 the Scar table is rolled on, as the table names it. */
export function scarRoll(): string {
  return scarsDoc.table.roll;
}

/** How many Scars retire a soldier. */
export function scarMaximum(): number {
  return scarsDoc.gaining.maximum;
}

const griefDoc = parse(griefText) as { maximum: number };

/** The most Grief a soldier holds. */
export function griefMaximum(): number {
  return griefDoc.maximum;
}

// ---------------------------------------------------------------- After the fight

const endDoc = parse(endText) as { steps: { id: string }[] };

const END_STEP_WORDING: Record<string, { title: string; text: string }> = {
  turns: {
    title: 'Turns',
    text: 'Turns spent in advance that have not come up are cancelled, and so are turns and actions a result would have spent. Every ban on Reactions ends, and every pending Fear result, a forced step or a forced strike not yet made, is cancelled.',
  },
  'stress-relief': {
    title: 'Stress relief',
    text: 'Everyone who held a Position takes the end-of-fight Stress relief. A Nape kill that ended the fight already gave its own when the kill happened.',
  },
  'lasting-stress-responses': { title: 'Stress Responses', text: 'Every lasting Stress Response gained during the fight ends.' },
  'turn-limits': { title: 'Time limits', text: 'Every lethal Critical Injury with a turn limit now runs out at the end of the fight instead.' },
  'aftermath-rolls': {
    title: 'Aftermath rolls',
    text: 'Each patient with an untreated lethal Critical Injury that runs out now gets at most one aftermath roll, from a treater the players choose, and each soldier makes at most one. A success gives back the Health box as treating does, and can end Down.',
  },
  'death-rolls': {
    title: 'Death Rolls',
    text: 'Every lethal Critical Injury that still runs out at the end of the fight does so, and causes a Death Roll. These are made outside the fight, so a limit you survive becomes a daily one. A death here causes no Fear Roll.',
  },
  'care-window': { title: 'Care window', text: 'Hold a care window. A lethal Critical Injury stabilized here, or at the aftermath rolls, gives its Scar as usual.' },
  grief: { title: 'Grief', text: 'Everyone gains the Grief for the deaths during the fight, including the deaths at the Death Rolls step.' },
  'retirement-and-promotion': {
    title: 'Retirement and promotion',
    text: 'Everyone with five Scars retires, including a soldier who gained the fifth earlier, and a retiring Squadmate leaves the Squad Pool. Left items, and every Blade Set a Fear result dropped, are shared out. Then promotion replaces, as one batch, every player character who died or retired during the fight or at any end step.',
  },
};

export function engagementEndTable(): CoreTableData {
  const T = 'When a fight ends';
  return {
    caption: 'The end of a fight, in order',
    note: 'Every step is resolved outside the Titan Engagement. A Skirmish ends with the same steps. Nobody retires, and no promotion happens, before the last one.',
    columns: ['Step', 'What happens'],
    see: false,
    groups: [
      {
        rows: endDoc.steps.map((step, i) => {
          const w = wording(END_STEP_WORDING, step.id, T);
          return { cells: [`${i + 1}. ${w.title}`, w.text] as Cell[] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- the drawings

export interface HarmMark {
  kind: 'damage' | 'injury' | 'down' | 'death';
  label: string;
  icon: string | null;
  slot: string | null;
  text: string;
  note: string | null;
}

/** The path from damage through Down to a Death Roll, for the harm drawing. */
export function harmTrack(): { marks: HarmMark[]; forbids: string[]; needs: number } {
  const T = 'Losing Health';
  const roll = deathRoll();
  const conditions = downDoc.conditions.map((c) => c.id);
  for (const id of ['zero-health', 'down-row']) {
    if (!conditions.includes(id)) throw new Error(`${T}: Down no longer has the "${id}" condition.`);
  }
  const marks: HarmMark[] = [
    {
      kind: 'damage',
      label: 'Damage arrives',
      icon: null,
      slot: 'harm-health',
      text: 'A fall, steam, a Foe’s weapon, or a called roll you failed. It names an amount and an Injury Type. An amount of 0 does nothing at all, whatever your current Health.',
      note: 'A Titan attack is never damage. It skips all of this and gives a Critical Injury outright.',
    },
    {
      kind: 'damage',
      label: 'Mark the boxes',
      icon: 'ph:squares-four',
      slot: null,
      text: 'While your current Health is above 0, add the amount to Health lost, up to your Health minus the boxes crossed off. Each point marks one box.',
      note: null,
    },
    {
      kind: 'injury',
      label: 'At 0, the wound turns critical',
      icon: null,
      slot: 'harm-critical-injury',
      text: 'Damage that brings you to 0 puts you Down and gives one Critical Injury of its Injury Type at once. Damage taken while already at 0 adds no Health lost and gives one instead.',
      note: 'A new untreated Critical Injury crosses off a clean box, or a marked one if no clean box is left, and then Health lost falls by 1.',
    },
    {
      kind: 'down',
      label: 'Down',
      icon: null,
      slot: 'harm-down',
      text: 'You are Down while your current Health is 0, or while you hold an untreated Critical Injury whose row says so. A Critical Injury that crosses off your last box puts you Down and gives no further one.',
      note: 'Each turn has its move and no action. Down ends the moment your current Health is above 0 and no untreated Down row holds you.',
    },
    {
      kind: 'death',
      label: 'The limit runs out',
      icon: null,
      slot: 'harm-death-roll',
      text: `A lethal Critical Injury has a time limit. Each time it runs out you make a Death Roll: ${roll.attribute} alone, minus that Critical Injury’s Death Roll penalty, needing ${roll.needs} success. One roll per Critical Injury, in the order you choose.`,
      note: 'No Stress Dice, no Help, no Push, no Circumstances, no gear. The first failed roll kills you, and no more are made.',
    },
    {
      kind: 'death',
      label: 'What the dice say',
      icon: 'ph:skull',
      slot: null,
      text: '0 successes and you die. 1 and you live, with the limit running out again. 2 or more and you live, and the limit slows one step. A daily limit that slows is stabilized, and never rolls again.',
      note: null,
    },
  ];
  return { marks, forbids: downForbids(), needs: roll.needs };
}

export interface MindPath {
  id: string;
  title: string;
  total: string;
  steps: { title: string; text: string }[];
  foot: string;
}

/** The two rolls of the mind, side by side, for the mind drawing. */
export function mindPaths(): MindPath[] {
  return [
    {
      id: 'stress-response',
      title: 'A Stress Response',
      total: rollHeading(responsesDoc.table.roll),
      steps: [
        { title: 'A Stress Die shows 1.', text: 'On any attribute roll, or after a Push of it. One roll causes at most one Stress Response, and it is resolved before the roll takes effect.' },
        { title: 'Roll the total.', text: 'No pool, no Push, no Help, no Stress Dice, no Circumstances. Use your Stress after any Push, and your current Resolve.' },
        { title: 'Read the row.', text: 'An instant row acts on the roll that caused it. A lasting row you hold from the next roll on, and a lasting row you already hold sends you one row further down the table.' },
        { title: 'It ends.', text: 'Rally clears it, or the Titan Engagement it was gained in ends. Gained outside one, it ends as the calling rule says, or when a day passes.' },
      ],
      foot: 'The dice can only ever cause this one. They never cause a Fear Roll.',
    },
    {
      id: 'fear-roll',
      title: 'A Fear Roll',
      total: rollHeading(fearDoc.table.roll),
      steps: [
        { title: 'A listed trigger happens.', text: 'Only an event on the closed list, resolved in full first. One Fear Roll per soldier per event, and a Down soldier makes none.' },
        { title: 'Take the snapshot.', text: 'Everyone who rolls for one event rolls together, each from their Stress, Resolve, and Scars as they stood when the event was resolved.' },
        { title: 'Find every row first.', text: 'Every rolling soldier finds their row before anything applies, so no result of this event can change another soldier’s total for it, and the order of the rolls changes nothing.' },
        { title: 'Then each Drive decides.', text: 'A Drive shrugs off the whole result: none of the row’s effects happen, the Stress to comrades included. The Fear Roll still counts as made.' },
        { title: 'The rest applies.', text: 'Every result not shrugged off takes effect. Grief from a death waits until every Fear Roll that death caused has resolved.' },
      ],
      foot: 'Resolve counts against both totals, so a Scar steadies you and Grief does the opposite.',
    },
  ];
}

// ---------------------------------------------------------------- registry

export const HARM_TABLES = {
  'harm-kinds': harmKindsTable,
  'health-restore': healthRestoreTable,
  'harm-effects': effectTypesTable,
  'injury-types': injuryTypesTable,
  'injury-location': injuryLocationTable,
  'injuries-arm': injuryTable('arm'),
  'injuries-leg': injuryTable('leg'),
  'injuries-torso': injuryTable('torso'),
  'injuries-head': injuryTable('head'),
  'injury-riders': injuryRidersTable,
  'lost-limbs': lostLimbsTable,
  'time-limits': timeLimitsTable,
  'death-roll-outcomes': deathRollOutcomesTable,
  'treat-injury-uses': treatUsesTable,
  'care-windows': careWindowsTable,
  'stress-responses': stressResponsesTable,
  'fear-triggers': fearTriggersTable,
  'fear-rolls': fearRollsTable,
  scars: scarsTable,
  'engagement-end': engagementEndTable,
} satisfies Record<string, () => CoreTableData>;

export type HarmTableId = keyof typeof HARM_TABLES;
