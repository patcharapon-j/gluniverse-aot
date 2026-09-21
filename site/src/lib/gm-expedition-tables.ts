/**
 * The Commander's copy of the Expedition tables in ../data/expedition (ADR-0012, ADR-0020):
 * the Leg Hazard table, the Night table, what adds to each roll, the Waypoint kinds, the
 * Straggler's victim, and the interim route.
 *
 * The row list and every number come from the tables. The sentence a GM reads is written here,
 * keyed by the row's id, and a row with no wording fails the build, so a new hazard can never go
 * missing from the page. A row that puts a Titan, a Foe, or harm in front of the Squad is marked
 * so the page can cover it with a bar (ADR-0023).
 */
import { parse } from 'yaml';
import hazardsText from '../../../data/expedition/hazards.yaml?raw';
import legsText from '../../../data/expedition/legs.yaml?raw';
import routeText from '../../../data/expedition/route.yaml?raw';
import anchorText from '../../../data/engagement/anchor-ratings.yaml?raw';
import { checkPlayerText } from './player-text';
import type { Cell, CoreTableData, TableGroup, TableRow } from './core-tables';

// ---------------------------------------------------------------- a Commander's table

/** A cell the page covers with a bar until the GM lifts it. */
export interface RedactedCell {
  redact: string;
  label: string;
}
export type GmCell = Cell | RedactedCell;
export interface GmTableRow extends Omit<TableRow, 'cells'> {
  cells: GmCell[];
}
export interface GmTableGroup extends Omit<TableGroup, 'rows'> {
  rows: GmTableRow[];
}
export interface GmTableData extends Omit<CoreTableData, 'groups'> {
  groups: GmTableGroup[];
}

const WHERE = 'src/lib/gm-expedition-tables.ts';
const gm = (what: string, text: string) => checkPlayerText(`${what}`, text, new Set(), `Write the GM's wording in ${WHERE}.`);

// ---------------------------------------------------------------- the tables as they are written

interface Results {
  min: number | null;
  max: number | null;
}
interface Effect {
  type: string;
  [key: string]: unknown;
}
interface HazardRow {
  id: string;
  name: string;
  results: Results;
  text: string;
  effects: Effect[];
}
interface RawPost {
  id: string;
  name: string;
  entry: string;
  hazard_modifier: number;
  special: string;
}
interface RawPace {
  id: string;
  name: string;
  hazard_modifier: number;
  rations_multiplier: number;
}

const hazards = parse(hazardsText) as {
  leg_hazards: {
    roll: string;
    modifiers: { distance_band: Record<string, number>; per_night_camp_made: number; signal_relay_flare: number };
    rows: HazardRow[];
  };
  straggler: {
    victim: { kind_roll: { roll: string; rows: { results: number[]; kind: string }[] } };
    on_failure: { injury_type: string; injury_location: string; cannot_be_lethal: boolean };
  };
  night: { roll: string; modifiers: { camp_roll_failed: number }; rows: HazardRow[] };
};
const legs = parse(legsText) as {
  pace: RawPace[];
  formation_posts: RawPost[];
  leg_outcome: {
    success: { rations: number; hazard_modifier_per_success_beyond_the_first: number };
    failure: { rations: number; hazard_modifier: number };
  };
};
const route = parse(routeText) as {
  distance_bands: { id: string; name: string }[];
  waypoint_kinds: { id: string; name: string; anchor_rating: string | null; interim_roll: number[] }[];
  interim_route: {
    steps: { id: string; text: string }[];
    formation_post_roll: { roll: string; rows: { results: number[]; post: string }[] };
    hard_ride_on: number[];
  };
};
const anchors = parse(anchorText) as { ratings: { id: string; name: string }[] };

function named<T extends { id: string; name: string }>(rows: T[], id: string, what: string): T {
  const row = rows.find((r) => r.id === id);
  if (!row) throw new Error(`An Expedition table names ${what} ("${id}") its own table does not list.`);
  return row;
}

const post = (id: string) => named(legs.formation_posts, id, 'a Formation Post');
const band = (id: string) => named(route.distance_bands, id, 'a Distance Band');
const signed = (n: number) => (n < 0 ? String(n) : `+${n}`);
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** "1", "1 or less", "10 or more", or "3 to 4", as the row's own results give it. */
function totalLabel({ min, max }: Results): string {
  if (min === null && max === null) throw new Error('A hazard row covers no result at all.');
  if (min === null) return `${max} or less`;
  if (max === null) return `${min} or more`;
  return min === max ? String(min) : `${min} to ${max}`;
}

/** The one effect of a kind a row's wording reads, or a build error naming the row. */
function effect(row: HazardRow, type: string): Effect {
  const found = row.effects.find((e) => e.type === type);
  if (!found) throw new Error(`The "${row.name}" row no longer carries a ${type} effect. Rewrite its wording in ${WHERE}.`);
  return found;
}

const num = (value: unknown, row: HazardRow, what: string): number => {
  if (typeof value !== 'number') throw new Error(`The "${row.name}" row gives no ${what}. Rewrite its wording in ${WHERE}.`);
  return value;
};

const POSITION_NAMES: Record<string, string> = { distant: 'Distant', 'in-reach': 'In Reach', 'on-body': 'On Body', 'blind-spot': 'Blind Spot' };

/** "every soldier at Distant", or the victim and everyone else, as the row places them. */
function placement(row: HazardRow): string {
  const place = effect(row, 'titan-engagement').placement as Record<string, string> | undefined;
  if (!place) throw new Error(`The "${row.name}" row places nobody. Rewrite its wording in ${WHERE}.`);
  const where = (key: string) => {
    const name = POSITION_NAMES[place[key]!];
    if (!name) throw new Error(`The "${row.name}" row names a Position the site does not know.`);
    return name;
  };
  if (place.every_soldier) return `every soldier at ${where('every_soldier')}`;
  if (place.victim && place.every_other_soldier) return `the victim at ${where('victim')} and every other soldier at ${where('every_other_soldier')}`;
  throw new Error(`The "${row.name}" row places its soldiers in a way the site does not know.`);
}

// ---------------------------------------------------------------- what the GM reads out

/** The effects that put a Titan, a Foe, or harm in front of the Squad, and so sit under a bar. */
const UNDER_A_BAR = new Set(['titan-engagement', 'skirmish', 'straggler', 'fall', 'choice']);
const covered = (row: HazardRow) => row.effects.some((e) => UNDER_A_BAR.has(e.type));

const LEG_WORDING: Record<string, (row: HazardRow) => string> = {
  'quiet-ride': () => 'Nothing happens. Say what the ride is instead: the grass, the formation strung out, nobody speaking.',
  'broken-ground': (row) =>
    `The Lead's horse takes ${plural(num(effect(row, 'horse-wear').points, row, 'a count of wear'), 'point', 'points')} of wear. With no Lead, or a Lead who is not mounted, nothing happens.`,
  'dropped-supplies': (row) => {
    const loss = effect(row, 'supply-loss');
    const units = num(loss.units, row, 'a count of units');
    const wagon = num(loss.units_at_supply_wagon, row, 'a count of units at the Supply Wagon');
    return `Squad Supply loses ${plural(units, 'unit', 'units')} of one kind that holds one, the players' choice. At the ${post('supply-wagon').name} Post it loses ${wagon} of that kind, or all it holds if fewer. If no kind holds a unit, nothing happens.`;
  },
  'long-hours': (row) => `Every soldier on the Expedition gains ${num(effect(row, 'stress-gain').amount, row, 'a Stress amount')} Stress.`,
  thrown: () => "One mounted soldier, the players' choice, falls from a horse. If nobody is mounted, nothing happens.",
  'titans-far-off': (row) => {
    const options = effect(row, 'choice').options as { spend?: { flares: number; rations: number } }[];
    const spend = options.find((o) => o.spend)?.spend;
    if (!spend) throw new Error(`The "${row.name}" row no longer offers a way around. Rewrite its wording in ${WHERE}.`);
    return `The players choose: spend ${plural(spend.flares, 'flare', 'flares')} and ${plural(spend.rations, 'ration', 'rations')} and ride around them, or take the fight, with every soldier at Distant. Short of either the fight begins, and the choice is theirs, not yours.`;
  },
  'titan-on-the-formation': (row) => `A Titan Engagement begins with ${placement(row)}.`,
  straggler: (row) =>
    `Roll the victim at random, then their Endure roll. On a failure they take a Bite Critical Injury at a rolled Injury Location, which can kill. Then a Titan Engagement begins with ${placement(row)}.`,
  abnormal: (row) => `A Titan Engagement begins with ${placement(row)}, against the Sprinting Abnormal, or the Abnormal your Brief names.`,
  overrun: (row) => {
    const clocks = effect(row, 'titan-engagement').background_clocks as number[] | undefined;
    if (!clocks?.length) throw new Error(`The "${row.name}" row no longer names its Background clocks. Rewrite its wording in ${WHERE}.`);
    return `A Titan Engagement begins with ${placement(row)} and ${plural(clocks.length, 'Background Titan', 'Background Titans')}, on clocks of ${clocks.join(' and ')} segments.`;
  },
};

const NIGHT_WORDING: Record<string, (row: HazardRow) => string> = {
  'quiet-night': () => 'Nothing happens. The watch changes, and the night passes.',
  restless: (row) => `Every soldier on the Expedition gains ${num(effect(row, 'stress-gain').amount, row, 'a Stress amount')} Stress.`,
  spoiled: (row) => `Squad Supply loses ${plural(num(effect(row, 'supply-loss').units, row, 'a count of rations'), 'ration', 'rations')}, or all it holds if fewer.`,
  'spooked-horses': () => "One horse on the Expedition that is not lame, the players' choice, goes lame. If none is left, nothing happens.",
  prowlers: (row) => {
    const skirmish = effect(row, 'skirmish');
    const foes = skirmish.foes as { number: number } | undefined;
    const at = skirmish.at as string[] | undefined;
    const fallback = row.effects.find((e) => e.type === 'as-row');
    if (!foes || !at || !fallback) throw new Error(`The "${row.name}" row no longer names its Foes or its deep-country reading. Rewrite its wording in ${WHERE}.`);
    const where = at.map((id) => band(id).name).join(' or ');
    const deep = band((fallback.at as string[])[0]!).name;
    const other = named(hazards.night.rows, String(fallback.row), 'a Night row');
    return `At ${where}, a Skirmish begins against ${foes.number} Bandits who have the Ambush and carry firebrands in place of clubs. At ${deep}, read ${other.name} instead.`;
  },
  'abnormal-at-night': (row) =>
    `A Titan Engagement begins against the Sprinting Abnormal, or the Abnormal your Brief names, with ${placement(row)}, every one of them dismounted. If it becomes a retreat, the Squad falls back overnight.`,
};

function hazardRows(rows: HazardRow[], wording: Record<string, (row: HazardRow) => string>, table: string): GmTableRow[] {
  return rows.map((row) => {
    const write = wording[row.id];
    if (!write) throw new Error(`${table}: the row "${row.name}" has no wording. Write it in ${WHERE}.`);
    const text = gm(`${table}, ${row.name}`, write(row));
    const cells: GmCell[] = [totalLabel(row.results), row.name, covered(row) ? { redact: text, label: `the ${row.name} row` } : text];
    return { cells };
  });
}

/** The Leg Hazard table, as the GM rolls it. */
export function legHazards(): GmTableData {
  return {
    caption: 'Leg Hazard table',
    note: `Roll ${hazards.leg_hazards.roll} and add every line of the modifiers. Read the row the total lands on, and read it as it came up.`,
    columns: ['Total', 'Hazard', 'What happens'],
    see: false,
    roll: true,
    groups: [{ rows: hazardRows(hazards.leg_hazards.rows, LEG_WORDING, 'The Leg Hazard table') }],
  };
}

/** The Night table, as the GM rolls it after the camp roll. */
export function nightHazards(): GmTableData {
  return {
    caption: 'Night table',
    note: `Roll ${hazards.night.roll}, add the Distance Band of the day's last Leg, and add ${hazards.night.modifiers.camp_roll_failed} if the camp roll failed. Nothing else adds to it.`,
    columns: ['Total', 'Night', 'What happens'],
    see: false,
    roll: true,
    groups: [{ rows: hazardRows(hazards.night.rows, NIGHT_WORDING, 'The Night table') }],
  };
}

// ---------------------------------------------------------------- what adds to the hazard roll

/** Every line that moves a Leg's hazard total, with the amount each gives. */
export function legHazardModifiers(): GmTableData {
  const mods = hazards.leg_hazards.modifiers;
  const bands = Object.entries(mods.distance_band)
    .map(([id, amount]) => `${band(id).name} ${signed(amount)}`)
    .join(', ');
  const posts = legs.formation_posts.map((p) => `${p.name} ${signed(p.hazard_modifier)}`).join(', ');
  const paces = legs.pace.map((p) => `${p.name} ${signed(p.hazard_modifier)}`).join(', ');
  const outcome = legs.leg_outcome;

  const rows: [string, string][] = [
    ["The Leg's Distance Band", bands],
    ['Each Night Camp already made on this Expedition', signed(mods.per_night_camp_made)],
    ['The Formation Post', posts],
    ['The Pace', paces],
    ['The Leg roll failed', signed(outcome.failure.hazard_modifier)],
    ['The Leg roll succeeded', `${signed(outcome.success.hazard_modifier_per_success_beyond_the_first)} for each success beyond the first`],
    [`The Squad spent the ${post('signal-relay').name}'s flare`, signed(mods.signal_relay_flare)],
  ];

  return {
    caption: 'What adds to a Leg hazard',
    note: 'The route, the camps already made, the Leg roll, and the flare decide which lines apply. You add none of your own, and you change none of these.',
    columns: ['The hazard roll adds', 'Amount'],
    see: false,
    groups: [{ rows: rows.map(([what, amount]): GmTableRow => ({ cells: [what, amount] })) }],
  };
}

// ---------------------------------------------------------------- the route

/** The Waypoint kinds, each with the field rating it sets and its place on the interim route. */
export function waypointKinds(): GmTableData {
  const anchorName = (id: string) => named(anchors.ratings, id, 'an Anchor Rating').name;
  const rollCell = (results: number[]): string => {
    if (results.length === 0) return 'Never rolled: always the route’s last Waypoint';
    return results.length === 1 ? String(results[0]) : `${Math.min(...results)} to ${Math.max(...results)}`;
  };
  return {
    caption: 'Waypoint kinds',
    note: 'A Waypoint’s kind sets the field rating of a Titan Engagement on the Leg that leads to it, and so decides more of that fight than the Titan does.',
    columns: ['Waypoint kind', 'Field rating', 'Interim route (D6)'],
    see: false,
    groups: [
      {
        rows: route.waypoint_kinds.map(
          (kind): GmTableRow => ({
            cells: [kind.name, kind.anchor_rating ? anchorName(kind.anchor_rating) : 'None: roll it on the setup table', rollCell(kind.interim_roll)],
          }),
        ),
      },
    ],
  };
}

/** The D6 that gives each Leg its Formation Post on the interim route. */
export function formationPostRoll(): GmTableData {
  const rollRow = route.interim_route.formation_post_roll;
  return {
    caption: 'Formation Post',
    note: `Roll ${rollRow.roll} for each Leg of an interim route. What each Post does on a Leg is on the Squad’s own pages.`,
    columns: ['D6', 'Formation Post'],
    see: false,
    roll: true,
    groups: [
      {
        rows: rollRow.rows.map(
          (r): GmTableRow => ({
            cells: [r.results.length === 1 ? String(r.results[0]) : `${Math.min(...r.results)} to ${Math.max(...r.results)}`, post(r.post).name],
          }),
        ),
      },
    ],
  };
}

const INTERIM_WORDING: Record<string, string> = {
  legs: 'Roll D3+3 for the number of Legs, and so of Waypoints. A D3 is a D6 read 1 or 2 as 1, 3 or 4 as 2, and 5 or 6 as 3.',
  'distance-bands': "Set the Distance Bands by each Leg's place: the first and last are Near, the second and second-to-last are Far, and every Leg between them is Deep.",
  waypoints: 'Roll D6 on the Waypoint kinds for every Waypoint but the last, which is the gate. No Waypoint is a Depot.',
  posts: 'Roll D6 on the Formation Post table for each Leg.',
  pace: 'Leave the Pace until the ride. After each day’s second Leg, if a Leg is left, roll D6: on a 5 or a 6 Command orders a Hard Ride.',
};

/** The interim route, rolled when the Squad rides with no Brief or a Brief that names no route. */
export function interimRouteSteps(): { title: string; text: string }[] {
  const TITLES: Record<string, string> = {
    legs: 'How many Legs',
    'distance-bands': 'How deep each one runs',
    waypoints: 'What stands at each Waypoint',
    posts: 'Where the Squad rides',
    pace: 'Whether Command pushes on',
  };
  return route.interim_route.steps.map((step) => {
    const text = INTERIM_WORDING[step.id];
    const title = TITLES[step.id];
    if (!text || !title) throw new Error(`The interim route: the step "${step.id}" has no wording. Write it in ${WHERE}.`);
    return { title, text: gm(`The interim route, ${step.id}`, text) };
  });
}

/** The days a Hard Ride comes up on an interim route, as the table gives them. */
export function hardRideOn(): string {
  const on = route.interim_route.hard_ride_on;
  return on.join(' or ');
}

// ---------------------------------------------------------------- the Straggler

const VICTIM_WORDING: Record<string, string> = {
  squadmate: 'A Squadmate',
  'player-character': 'A player character',
};

/** The roll that decides which kind of soldier the Straggler row takes. */
export function stragglerVictim(): GmTableData {
  const kindRoll = hazards.straggler.victim.kind_roll;
  return {
    caption: "The Straggler's victim",
    note: 'The victim is rolled, never chosen. Only living soldiers on the Expedition who are not Down count.',
    columns: [kindRoll.roll, 'The Titan takes'],
    see: false,
    roll: true,
    groups: [
      {
        rows: kindRoll.rows.map((r): GmTableRow => {
          const who = VICTIM_WORDING[r.kind];
          if (!who) throw new Error(`The Straggler's victim roll names a kind of soldier, "${r.kind}", with no wording. Write it in ${WHERE}.`);
          return { cells: [r.results.length === 1 ? String(r.results[0]) : `${Math.min(...r.results)} to ${Math.max(...r.results)}`, who] };
        }),
      },
    ],
  };
}

/** The Injury Type the Straggler's failed Endure roll inflicts, named from the table. */
export function stragglerInjury(): { type: string; lethal: boolean } {
  const fail = hazards.straggler.on_failure;
  return { type: fail.injury_type.charAt(0).toUpperCase() + fail.injury_type.slice(1), lethal: !fail.cannot_be_lethal };
}

export const GM_EXPEDITION_TABLES = {
  'leg-hazards': legHazards,
  'leg-hazard-modifiers': legHazardModifiers,
  'night-hazards': nightHazards,
  'waypoint-kinds': waypointKinds,
  'formation-post-roll': formationPostRoll,
  'straggler-victim': stragglerVictim,
} as const;

export type GmExpeditionTableId = keyof typeof GM_EXPEDITION_TABLES;
