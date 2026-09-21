/**
 * Player-facing rows for the Expedition, Downtime, and Requisition tables in ../data/expedition and
 * ../data/campaign (ADR-0012, ADR-0020), rendered by CoreTable and StepFlow on Expeditions &
 * Downtime. Every step, number, and order comes from the tables. The sentences a player reads are
 * written here, keyed by each row's id, and a row with no wording fails the build, so a new Post, a
 * new Downtime Action, or a new Requisition row can never go missing from the page.
 *
 * What comes up on the Leg Hazard table and the Night table is the GM's, and is not loaded here.
 */
import { parse } from 'yaml';
import legsText from '../../../data/expedition/legs.yaml?raw';
import hazardsText from '../../../data/expedition/hazards.yaml?raw';
import routeText from '../../../data/expedition/route.yaml?raw';
import downtimeText from '../../../data/campaign/downtime.yaml?raw';
import requisitionText from '../../../data/campaign/requisition.yaml?raw';
import anchorText from '../../../data/engagement/anchor-ratings.yaml?raw';
import catalogText from '../../../data/character/action-catalog.yaml?raw';
import { checkPlayerText, hyphenatedIds } from './player-text';
import { defaultFunding } from './gear-tables';
import type { Cell, CoreTableData } from './core-tables';

// ---------------------------------------------------------------- the tables

interface RawPace {
  id: string;
  name: string;
  rations_multiplier: number;
  hazard_modifier: number;
  leg_roll_entry: string;
}
interface RawPost {
  id: string;
  name: string;
  entry: string;
  hazard_modifier: number;
  special: string;
}
interface RawStep {
  id: string;
  text: string;
}
interface RawRoll {
  id: string;
  name: string;
  entry: string;
  needs: string;
}
interface RawKind {
  id: string;
  name: string;
  anchor_rating: string | null;
}
interface RawEffectRow {
  id: string;
  name: string;
  effect: string;
}
interface RawListRow {
  id: string;
  name: string;
  scarcity: string;
}

const legs = parse(legsText) as {
  day: { steps: string[] };
  pace: RawPace[];
  formation_posts: RawPost[];
  leg_steps: RawStep[];
  leg_outcome: {
    success: { rations: number; hazard_modifier_per_success_beyond_the_first: number };
    failure: { rations: number; hazard_modifier: number };
  };
  night_camp: { steps: RawStep[] };
  rolls: RawRoll[];
};
const hazards = parse(hazardsText) as {
  leg_hazards: { roll: string; modifiers: { distance_band: Record<string, number>; per_night_camp_made: number; signal_relay_flare: number } };
  straggler: {
    victim: { kind_roll: { roll: string; rows: { results: number[]; kind: string }[] } };
    on_failure: { injury_type: string; injury_location: string; cannot_be_lethal: boolean };
  };
  night: { roll: string; modifiers: { camp_roll_failed: number } };
  rolls: RawRoll[];
};
const route = parse(routeText) as {
  route: { bounds: { legs: string; depots: string } };
  distance_bands: { id: string; name: string }[];
  waypoint_kinds: RawKind[];
};
const downtime = parse(downtimeText) as {
  downtime: { days: number };
  steps: RawStep[];
  infirmary: { each_day: { count: number; steps: string[] } };
  downtime_actions: { rows: RawEffectRow[] };
  squadmates: { relief: string; stress: number; grief: number };
  squad_actions: { rows: RawEffectRow[] };
  rolls: RawRoll[];
};
const requisition = parse(requisitionText) as {
  scarcity: { id: string; name: string; needs: number }[];
  funding_gate: { rows: { funding: number[]; tiers: string[] }[] };
  procedure: RawStep[];
  list: { rows: RawListRow[] };
  rolls: RawRoll[];
};
const anchors = parse(anchorText) as { ratings: { id: string; name: string }[] };
const catalog = parse(catalogText) as { entries: { id: string; name: string }[] };

// ---------------------------------------------------------------- the wording

const WHERE = 'src/lib/expedition-tables.ts';

/** Internal ids that must never reach a page. */
const IDS = hyphenatedIds([
  ...legs.formation_posts,
  ...legs.pace,
  ...downtime.downtime_actions.rows,
  ...downtime.squad_actions.rows,
  ...requisition.list.rows,
  ...catalog.entries,
]);

const fix = (key: string) => `Write player wording for "${key}" in ${WHERE}.`;

/** Checks one sentence and returns it, or fails the build naming where the wording belongs. */
function say(what: string, text: string | undefined, key: string): string {
  if (!text) throw new Error(`Expeditions: ${what} has no player wording. ${fix(key)}`);
  return checkPlayerText(`Expeditions: ${what}`, text, IDS, fix(key));
}

const ENTRY_NAMES = new Map(catalog.entries.map((e) => [e.id, e.name]));
function entryName(id: string): string {
  const name = ENTRY_NAMES.get(id);
  if (!name) throw new Error(`Expeditions: no Action Catalog entry "${id}".`);
  return name;
}

const ANCHOR_NAMES = new Map(anchors.ratings.map((r) => [r.id, r.name]));
function anchorName(id: string): string {
  const name = ANCHOR_NAMES.get(id);
  if (!name) throw new Error(`Expeditions: no Anchor Rating "${id}".`);
  return name;
}

const signed = (n: number) => (n > 0 ? `+${n}` : n === 0 ? '+0' : String(n));

/** A step of a drawing, as StepFlow takes it. */
export interface FlowStep {
  title: string;
  text: string;
  icon?: string;
  exit?: { kind: 'stop' | 'note' | 'cover'; label: string; text: string };
}

interface StepWording {
  title: string;
  text: string;
  icon?: string;
  exit?: { kind: 'stop' | 'note' | 'cover'; label: string; text: string };
}

/** Builds a drawing from a table's own steps, so a new step fails the build until it has wording. */
function flow(what: string, steps: { id: string }[], wording: Record<string, StepWording>): FlowStep[] {
  return steps.map((step) => {
    const w = wording[step.id];
    if (!w) throw new Error(`Expeditions: the ${what} step "${step.id}" has no player wording. ${fix(step.id)}`);
    return {
      title: say(`the ${what} step "${step.id}"`, w.title, step.id),
      text: say(`the ${what} step "${step.id}"`, w.text, step.id),
      icon: w.icon,
      exit: w.exit && { ...w.exit, text: say(`the ${what} step "${step.id}", exit`, w.exit.text, step.id) },
    };
  });
}

// ---------------------------------------------------------------- the day, the Leg, the night

const DAY_STEPS: StepWording[] = [
  {
    title: 'The first two Legs',
    text: 'Ride the day’s first Leg, then its second. After each, the GM may frame a scene at the Waypoint you reached.',
    icon: 'gear-horse',
  },
  {
    title: 'A Hard Ride, if Command orders one',
    text: 'If a Leg is left on the route after the second and Command orders a Hard Ride, ride it as the day’s third. A first or second Leg is never a Hard Ride.',
    icon: 'ph:sun-horizon',
    exit: { kind: 'note', label: 'Never more than one', text: 'At most one Hard Ride a day, and only as the third Leg.' },
  },
  { title: 'Make camp', text: 'Make the Night Camp where the day’s last Leg left you. Legs are never ridden at night.', icon: 'ph:tent' },
];

/** The day: two Legs, a Hard Ride if one is ordered, and the Night Camp. */
export function dayFlow(): FlowStep[] {
  const steps = legs.day.steps;
  if (steps.length !== DAY_STEPS.length) throw new Error(`Expeditions: the day now holds ${steps.length} steps; the drawing has ${DAY_STEPS.length}.`);
  return DAY_STEPS.map((w, i) => ({
    title: say(`the day, step ${i + 1}`, w.title, 'day'),
    text: say(`the day, step ${i + 1}`, w.text, 'day'),
    icon: w.icon,
    exit: w.exit && { ...w.exit, text: say(`the day, step ${i + 1}, exit`, w.exit.text, 'day') },
  }));
}

const LEG_STEPS: Record<string, StepWording> = {
  post: { title: 'Take your post', text: 'The whole Squad rides at the Formation Post the route gives this Leg.', icon: 'ph:users-three' },
  'leg-roll': {
    title: 'The Leg roll',
    text: 'The Lead rolls the Post’s entry, or Ride on a Hard Ride. It needs 1 success, and up to 3 comrades may Help.',
    icon: 'die-base',
  },
  arrive: {
    title: 'Arrive',
    text: 'You always reach the Waypoint. Spend the rations the roll costs, doubled on a Hard Ride, and record what the Leg roll adds to the hazard.',
    icon: 'gear-rations',
    exit: { kind: 'note', label: 'Short of rations', text: 'Spend every ration you hold, and every soldier gains 1 Stress.' },
  },
  hazard: {
    title: 'The hazard',
    text: 'At the Signal Relay Post the Squad may spend 1 flare first. Then the GM rolls the Leg’s hazard in the open and reads the row it gives.',
    icon: 'gear-flares',
  },
  harm: { title: 'Harm', text: 'Harm a row inflicts outside a fight opens a care window, with every soldier on the Expedition in its scope.', icon: 'harm-health' },
  'titan-engagement': {
    title: 'A Titan Engagement, if the row begins one',
    text: 'The Waypoint ahead sets the field rating, and every living soldier takes part, mounted or not as they rode.',
    icon: 'titan-medium',
    exit: { kind: 'stop', label: 'A retreat', text: 'Fall back to the Waypoint you started from and ride this Leg again from step 1, with a new Leg roll and a new hazard.' },
  },
  waypoint: { title: 'The Waypoint', text: 'The Leg ends. At a Depot every soldier receives a full Standard Issue. At the gate the Expedition ends.', icon: 'ph:path' },
};

export function legFlow(): FlowStep[] {
  return flow('Leg', legs.leg_steps, LEG_STEPS);
}

const NIGHT_STEPS: Record<string, StepWording> = {
  'camp-roll': {
    title: 'The camp roll',
    text: 'One soldier who is not Down rolls Survive, needing 1 success. Up to 3 comrades may Help, and it can be Pushed and Covered.',
    icon: 'die-base',
  },
  rations: { title: 'Rations', text: 'Spend 1 ration. A Squad that holds none meets hunger.', icon: 'gear-rations' },
  'camp-relief': {
    title: 'Camp Relief',
    text: 'If the camp roll succeeded and the camp did not meet hunger, every soldier on the Expedition loses 1 Stress.',
    icon: 'die-stress',
  },
  'night-hazard': {
    title: 'The night',
    text: 'The GM rolls the night in the open, adding the Distance Band of the day’s last Leg and 1 more if the camp roll failed.',
    icon: 'ph:moon-stars',
    exit: { kind: 'stop', label: 'A retreat at night', text: 'Fall back overnight to the Waypoint the day’s last Leg started from. The camp goes on there at the last step.' },
  },
  'day-passes': {
    title: 'A day passes',
    text: 'A care window with every soldier on the Expedition in its scope, Field Repair among its rolls, then the Death Rolls that fall due, Health back, and a day of healing.',
    icon: 'harm-health',
  },
};

export function nightFlow(): FlowStep[] {
  return flow('Night Camp', legs.night_camp.steps, NIGHT_STEPS);
}

// ---------------------------------------------------------------- Downtime

const DOWNTIME_STEPS: Record<string, StepWording> = {
  infirmary: {
    title: 'The infirmary',
    text: 'One care window for the whole Squad, then the seven days, each with its infirmary rolls, its Death Rolls, and its healing.',
    icon: 'ph:first-aid-kit',
  },
  'downtime-actions': {
    title: 'Downtime Actions',
    text: 'Each player character takes one, in the order the players choose. Each Squadmate takes the Squadmate relief instead.',
    icon: 'ph:clipboard-text',
  },
  'squad-action': { title: 'The Squad Action', text: 'The Squad takes one, chosen by the players. In these rules that is Honoring the Fallen, since Recruit is not offered.', icon: 'specialty-leader' },
  'after-actions': {
    title: 'After the actions',
    text: 'In order: what Command granted arrives, prosthetics are fitted, medical Retirement is offered again, then every Retirement and promotion due resolves.',
    icon: 'ph:package',
  },
};

export function downtimeFlow(): FlowStep[] {
  return flow('Downtime', downtime.steps, DOWNTIME_STEPS);
}

/** The days Downtime spends at the infirmary. */
export function downtimeDays(): number {
  const { days } = downtime.downtime;
  if (days !== downtime.infirmary.each_day.count) throw new Error('Expeditions: Downtime’s days and the infirmary’s days no longer agree.');
  return days;
}

/**
 * The four steps of one infirmary day. The table holds them as sentences with no ids, so the
 * wording is keyed by the opening words of each: a reworded step loses its wording and fails
 * the build, which is deliberate.
 */
const INFIRMARY_DAY: Record<string, string> = {
  'every-lethal-critical-injury-with': 'Every lethal Critical Injury on a day limit gets one infirmary roll: 4 dice, needing 1 success. A success stabilizes it without treating it.',
  'every-lethal-critical-injury-that': 'Every lethal Critical Injury that still has a day limit runs out, and the soldier holding it makes a Death Roll.',
  'every-living-soldier-gets-back': 'Every living soldier gets back all the Health they had lost to damage.',
  'every-held-critical-injurys-remaining': 'Every Critical Injury still held heals 1 day closer, and one that reaches 0 heals. One that cannot heal untreated keeps its time, and a lethal one never heals while it is still lethal.',
};

const key = (line: string) =>
  line
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(/\s+/)
    .slice(0, 5)
    .join('-');

export function infirmaryDay(): string[] {
  return downtime.infirmary.each_day.steps.map((line) => {
    const k = key(line);
    return say(`the infirmary day step "${k}"`, INFIRMARY_DAY[k], k);
  });
}

// ---------------------------------------------------------------- Requisition

const REQUISITION_STEPS: Record<string, StepWording> = {
  'name-a-row': {
    title: 'Name what you want',
    text: 'One row of the list whose Scarcity Funding reaches, with any choice it asks for, and the soldier it is for.',
    icon: 'ph:scroll',
  },
  roll: {
    title: 'Talk or cite',
    text: 'Roll Persuade or Recall, chosen before you roll. It needs the row’s Scarcity plus the ledger, and up to 3 comrades may Help.',
    icon: 'ph:handshake',
    exit: { kind: 'cover', label: 'Leverage', text: 'A favour owed, a Commendation, or a captured specimen can move the Circumstances, never what the roll needs.' },
  },
  result: {
    title: 'Command answers',
    text: 'On a success Command grants the row and the ledger rises by 1. On a failure Command says no. Successes beyond the needs do nothing.',
    icon: 'ph:signature',
    exit: { kind: 'stop', label: 'One ask each', text: 'Granted or refused, that was the soldier’s one Requisition this Downtime.' },
  },
};

export function requisitionFlow(): FlowStep[] {
  return flow('Requisition', requisition.procedure, REQUISITION_STEPS);
}

// ---------------------------------------------------------------- numbers the page states

/** What a Leg costs and what its roll does to the hazard, and the Straggler's own numbers. */
export function legNumbers(): {
  successRations: number;
  failureRations: number;
  hardRideMultiplier: number;
  failureHazard: string;
  successHazard: string;
  campRollFailed: string;
  perNightCamp: string;
  flare: string;
  bands: string;
} {
  const { success, failure } = legs.leg_outcome;
  const hard = legs.pace.find((p) => p.id === 'hard-ride');
  if (!hard) throw new Error('Expeditions: the Hard Ride Pace is gone.');
  const bands = route.distance_bands.map((band) => {
    const add = hazards.leg_hazards.modifiers.distance_band[band.id];
    if (typeof add !== 'number') throw new Error(`Expeditions: the Distance Band "${band.id}" adds nothing to the hazard.`);
    return `${band.name} ${signed(add)}`;
  });
  return {
    successRations: success.rations,
    failureRations: failure.rations,
    hardRideMultiplier: hard.rations_multiplier,
    failureHazard: signed(failure.hazard_modifier),
    successHazard: signed(success.hazard_modifier_per_success_beyond_the_first),
    campRollFailed: signed(hazards.night.modifiers.camp_roll_failed),
    perNightCamp: signed(hazards.leg_hazards.modifiers.per_night_camp_made),
    flare: signed(hazards.leg_hazards.modifiers.signal_relay_flare),
    bands: bands.join(', '),
  };
}

/** The Straggler's two rolls, in words. */
export function stragglerNumbers(): { die: string; squadmate: string; character: string; injury: string } {
  const rows = hazards.straggler.victim.kind_roll.rows;
  const list = (kind: string) => {
    const row = rows.find((r) => r.kind === kind);
    if (!row) throw new Error(`Expeditions: the Straggler no longer picks a ${kind}.`);
    const results = row.results;
    return results.length === 2 ? `${results[0]} or ${results[1]}` : `${results[0]} to ${results[results.length - 1]}`;
  };
  const { injury_type, injury_location, cannot_be_lethal } = hazards.straggler.on_failure;
  if (injury_location !== 'rolled' || cannot_be_lethal) throw new Error('Expeditions: the Straggler’s Critical Injury has changed.');
  return {
    die: hazards.straggler.victim.kind_roll.roll,
    squadmate: list('squadmate'),
    character: list('player-character'),
    injury: injury_type.charAt(0).toUpperCase() + injury_type.slice(1),
  };
}

/** What a Mission Brief's route may hold, in the bounds the tables set. */
export function routeBounds(): { legs: string; depots: string } {
  const legsBound = /(\d+) to (\d+)/.exec(route.route.bounds.legs);
  if (!legsBound) throw new Error('Expeditions: the route no longer states how many Legs it holds.');
  if (!/^At most one Waypoint/.test(route.route.bounds.depots)) throw new Error('Expeditions: a route can now hold more than one Depot.');
  return { legs: `${legsBound[1]} to ${legsBound[2]}`, depots: 'at most one' };
}

/** What the Squadmate relief gives, in words. */
export function squadmateRelief(): string {
  const { stress, grief } = downtime.squadmates;
  return `${Math.abs(stress)} Stress and ${Math.abs(grief)} Grief`;
}

// ---------------------------------------------------------------- the Pace and the Posts

const PACE_TEXT: Record<string, { when: string; rations: string }> = {
  steady: { when: 'Every Leg that is not a Hard Ride.', rations: 'As the Leg roll gives.' },
  'hard-ride': {
    when: 'A third Leg squeezed in before dark, when a Leg is left on the route and Command orders one. A day’s first or second Leg is never a Hard Ride.',
    rations: 'Twice what the Leg roll gives.',
  },
};

export function paceTable(): CoreTableData {
  return {
    caption: 'The two Paces',
    note: 'The route sets which Legs are ridden hard. Nothing else changes a Pace once the Expedition begins.',
    columns: ['Pace', 'When', 'Leg roll', 'Rations', 'Hazard roll'],
    see: false,
    groups: [
      {
        rows: legs.pace.map((pace) => {
          const w = PACE_TEXT[pace.id];
          if (!w) throw new Error(`Expeditions: the Pace "${pace.id}" has no player wording. ${fix(pace.id)}`);
          const entry = pace.leg_roll_entry.includes(' ') ? 'The Formation Post’s entry' : entryName(pace.leg_roll_entry);
          return {
            cells: [
              pace.name,
              say(`the Pace "${pace.id}"`, w.when, pace.id),
              entry === 'Ride' ? { text: 'Ride', note: 'With the horse’s Gear Dice' } : entry,
              say(`the Pace "${pace.id}", rations`, w.rations, pace.id),
              signed(pace.hazard_modifier),
            ] as Cell[],
          };
        }),
      },
    ],
  };
}

const POST_TEXT: Record<string, { picture: string; special: string }> = {
  vanguard: { picture: 'The first to see, and the first seen.', special: 'Nothing else.' },
  'flank-scout': { picture: 'Reading the land at the formation’s edge.', special: 'Nothing else.' },
  'signal-relay': {
    picture: 'Watching the sky for flares.',
    special: 'Once per Leg, before the hazard is rolled, the Squad may spend 1 flare of Squad Supply to lower that Leg’s hazard total by 2.',
  },
  center: { picture: 'The long hours in the saddle.', special: 'Nothing else.' },
  'supply-wagon': { picture: 'Keeping the wagons whole.', special: 'The hazard row that costs the Squad supplies costs it 2 units in place of 1.' },
  'rear-guard': { picture: 'The last to leave.', special: 'Nothing else.' },
};

export function formationPostsTable(): CoreTableData {
  return {
    caption: 'The six Formation Posts',
    note: 'The whole Squad rides at one Post, and it changes only at a Waypoint.',
    columns: ['Post', 'Leg roll on a Steady Leg', 'Hazard roll', 'What else it gives'],
    see: false,
    groups: [
      {
        rows: legs.formation_posts.map((post) => {
          const w = POST_TEXT[post.id];
          if (!w) throw new Error(`Expeditions: the Formation Post "${post.id}" has no player wording. ${fix(post.id)}`);
          const special = say(`the Post "${post.id}"`, w.special, post.id);
          if ((post.special === 'none') !== (special === 'Nothing else.')) {
            throw new Error(`Expeditions: the Formation Post "${post.id}" gained or lost its own rule. ${fix(post.id)}`);
          }
          return {
            cells: [
              { text: post.name, note: say(`the Post "${post.id}", the post`, w.picture, post.id) },
              entryName(post.entry),
              signed(post.hazard_modifier),
              special,
            ] as Cell[],
          };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- what the hazard counts

export function hazardCountTable(): CoreTableData {
  const n = legNumbers();
  const paceLine = legs.pace.map((p) => `${p.name} ${signed(p.hazard_modifier)}`).join(', ');
  const posts = legs.formation_posts.map((p) => p.hazard_modifier);
  const postLine = `${signed(Math.max(...posts))} to ${signed(Math.min(...posts))}, as the Post gives`;
  return {
    caption: 'What the hazard roll counts',
    note: `The GM rolls ${hazards.leg_hazards.roll} in the open and adds every line that applies. What each total brings is the GM’s to read.`,
    columns: ['What counts', 'Adds'],
    see: false,
    groups: [
      {
        heading: 'A Leg',
        rows: [
          { cells: ['The Leg’s Distance Band', n.bands] },
          { cells: ['Each night already camped on this Expedition', n.perNightCamp] },
          { cells: ['The Formation Post', postLine] },
          { cells: ['The Pace', paceLine] },
          { cells: ['The Leg roll failed', n.failureHazard] },
          { cells: ['The Leg roll succeeded', `${n.successHazard} for each success beyond the first`] },
          { cells: ['The Squad spent the Signal Relay’s flare', n.flare] },
        ],
      },
      {
        heading: 'A night',
        rows: [
          { cells: ['The Distance Band of the day’s last Leg', n.bands] },
          { cells: ['The camp roll failed', n.campRollFailed] },
          { cells: ['Everything else', 'Nothing. Nights outside, the Post, the Pace, and the Leg roll add nothing to the night.'] },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------- the route

const KIND_TEXT: Record<string, string> = {
  'open-plain': 'Grass to the horizon, and nothing to anchor to.',
  hedgerows: 'Field walls and thin trees, enough to swing from if you pick your line.',
  forest: 'Trunks close enough to fly between.',
  'abandoned-town': 'Roofs, chimneys, and standing walls.',
  'giant-forest': 'Trees taller than any Titan, and a long way down.',
  gate: 'The Walls, and the end of the Expedition.',
};

export function waypointKindsTable(): CoreTableData {
  return {
    caption: 'What a Waypoint is made of',
    note: 'A Waypoint’s kind sets the field rating of a Titan Engagement on the Leg that leads to it.',
    columns: ['Waypoint', 'The ground', 'Field rating'],
    see: false,
    groups: [
      {
        rows: route.waypoint_kinds.map((kind) => ({
          cells: [
            kind.name,
            say(`the Waypoint kind "${kind.id}"`, KIND_TEXT[kind.id], kind.id),
            kind.anchor_rating ? anchorName(kind.anchor_rating) : { text: 'None', note: 'A fight on the Leg to the gate rolls for its ground' },
          ] as Cell[],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- Downtime Actions

const DOWNTIME_ACTION_TEXT: Record<string, string> = {
  recover: 'You rest, and lose 2 Stress.',
  'visit-haven': 'You go home to your Haven, and lose 2 Stress and 2 Grief.',
  requisition: 'You make one Requisition, or spend the action Helping a comrade’s Requisition roll.',
  'maintain-gear': 'Every rated item you hold returns to its rating: ODM Gear is no longer Jammed, a lame horse is sound, a worn kit or firearm is whole. A ruined Blade Set stays ruined.',
};

const SQUAD_ACTION_TEXT: Record<string, string> = {
  'honoring-the-fallen': 'The Squad buries its dead properly. Every soldier in the Squad loses 1 Grief.',
  recruit: 'Not offered in these rules, and it brings no Squadmate. When it is offered, new Squadmates join until the Squad holds 6 soldiers counting the player characters. The players choose each one’s template and name it, and it joins with Standard Issue.',
};

export function downtimeActionsTable(): CoreTableData {
  return {
    caption: 'Downtime Actions and the Squad Action',
    note: `Each player character takes one Downtime Action. Each Squadmate takes the relief instead, losing ${squadmateRelief()}. The Squad takes one Squad Action.`,
    columns: ['Action', 'What it does'],
    see: false,
    groups: [
      {
        heading: 'One each, for every player character',
        rows: downtime.downtime_actions.rows.map((row) => ({
          cells: [row.name, say(`the Downtime Action "${row.id}"`, DOWNTIME_ACTION_TEXT[row.id], row.id)],
        })),
      },
      {
        heading: 'One for the Squad',
        rows: downtime.squad_actions.rows.map((row) => ({
          cells: [row.name, say(`the Squad Action "${row.id}"`, SQUAD_ACTION_TEXT[row.id], row.id)],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- Requisition

export function requisitionGateTable(): CoreTableData {
  const current = defaultFunding();
  const reach = (tier: string) => {
    const rows = requisition.funding_gate.rows.filter((r) => r.tiers.includes(tier));
    if (rows.length === 0) throw new Error(`Expeditions: no Funding reaches "${tier}".`);
    const low = Math.min(...rows.flatMap((r) => r.funding));
    const high = Math.max(...rows.flatMap((r) => r.funding));
    return { text: `Funding ${low} to ${high}`, note: low <= current && current <= high ? 'Open to you now' : 'Closed to you now' };
  };
  return {
    caption: 'Scarcity and the Funding gate',
    note: `Funding decides which Scarcity Command will even consider. Until the Funding rules are written it is ${current}.`,
    columns: ['Scarcity', 'Successes needed, before the ledger', 'Funding that reaches it'],
    see: false,
    groups: [
      {
        rows: requisition.scarcity.map((tier) => ({ cells: [tier.name, String(tier.needs), reach(tier.id)] as Cell[] })),
      },
    ],
  };
}

const LIST_TEXT: Record<string, string> = {
  'spare-canister': 'One more full canister than your Funding gives.',
  'blade-set-1': 'One more set than your Funding gives.',
  'medical-kit-1': 'Standard Issue gives one only to a Medic.',
  'tool-kit-1': 'Standard Issue gives one only to an Engineer.',
  supplies: 'Name which when you name the row. It is added to Squad Supply above its stock.',
  shot: 'Added to Squad Supply above its stock. One unit loads one firearm.',
  'blade-set-2': 'Any wear still ruins it.',
  'medical-kit-2': 'Nothing else.',
  'tool-kit-2': 'Nothing else.',
  'flintlock-pistol': 'It arrives empty.',
  musket: 'It arrives empty, and counts as 2 items.',
  prosthetic: 'One per Requisition, of the kind of a side the named soldier has lost and has no prosthetic on, and only once that loss has healed. You may name a Squadmate as its soldier. It is fitted during a Downtime.',
  'odm-gear-3': 'It replaces your own harness, which leaves play.',
  'horse-3': 'It replaces your own horse, which leaves play.',
  'blade-set-3': 'Any wear still ruins it.',
};

export function requisitionListTable(): CoreTableData {
  const names = new Map(requisition.scarcity.map((t) => [t.id, t.name]));
  return {
    caption: 'What Command will consider',
    note: 'There are no prices. Your GM may add a row for their table, and an added item that rates a measured roll is Limited or rarer.',
    columns: ['Item', 'Scarcity', 'What else the row says'],
    see: false,
    groups: requisition.scarcity.map((tier) => ({
      heading: `${tier.name}: ${tier.needs} ${tier.needs === 1 ? 'success' : 'successes'}, plus the ledger`,
      rows: requisition.list.rows
        .filter((row) => row.scarcity === tier.id)
        .map((row) => {
          if (!names.has(row.scarcity)) throw new Error(`Expeditions: the Requisition row "${row.id}" has no Scarcity.`);
          return { cells: [row.name, names.get(row.scarcity)!, say(`the Requisition row "${row.id}"`, LIST_TEXT[row.id], row.id)] as Cell[] };
        }),
    })),
  };
}

// ---------------------------------------------------------------- every roll

interface RollWording {
  who: string;
  help: string;
  push: string;
}

const ROLL_TEXT: Record<string, RollWording> = {
  'leg-roll': {
    who: 'The Lead: one soldier on the Expedition who is not Down, chosen by the players. On a Hard Ride the Lead must be mounted on their own horse.',
    help: 'Up to 3 comrades on the Expedition who are not Down, spending nothing. Each soldier Helps at most once a Leg.',
    push: 'Pushed and Covered as usual. Never tried again: a Leg ridden again makes a new roll.',
  },
  'camp-roll': {
    who: 'One soldier on the Expedition who is not Down, chosen by the players.',
    help: 'Up to 3 comrades on the Expedition who are not Down, spending nothing.',
    push: 'Pushed and Covered as usual. Never tried again.',
  },
  'hazard-roll': {
    who: 'Nobody. The GM rolls it in the open for the whole Squad.',
    help: 'Never.',
    push: 'Never, and never tried again. It takes no Circumstances, and the row that comes up is never softened or swapped.',
  },
  'straggler-endure': {
    who: 'The soldier the Straggler picked.',
    help: 'Never.',
    push: 'Pushed, but never Covered, since nobody qualifies to Help. Never tried again.',
  },
  'infirmary-roll': {
    who: 'Nobody rolls it: it is rolled for the patient, a patient who is Down included.',
    help: 'Never.',
    push: 'Never. It comes again on each later day while that Critical Injury is still lethal.',
  },
  'requisition-roll': {
    who: 'The player character spending their Downtime Action on the Requisition.',
    help: 'Up to 3 comrades in the Squad who are not Down. A player character Helps by spending their own Downtime Action on it; a Squadmate Helps once a Downtime, spending nothing.',
    push: 'Pushed and Covered as usual, and Stress gained rides out on the next Expedition. Never tried again this Downtime.',
  },
  'size-up-for-the-ledger': {
    who: 'One soldier in the Squad who is not Down, a Squadmate included, chosen by the players. It is not a Downtime Action.',
    help: 'Never.',
    push: 'Pushed, but never Covered, since nobody qualifies to Help. One Size Up a Downtime.',
  },
};

export function rollsTable(): CoreTableData {
  const rows = [...legs.rolls, ...hazards.rolls, ...downtime.rolls, ...requisition.rolls];
  return {
    caption: 'Every roll beyond the Walls and inside them',
    note: 'Circumstances reach the Leg roll, the camp roll, the Straggler’s Endure, the Requisition roll, the Size Up, and every called roll in a Waypoint scene. They never change what a roll needs.',
    columns: ['Roll', 'Who rolls', 'Entry', 'Needs', 'Help', 'Push and again'],
    see: false,
    groups: [
      {
        rows: rows.map((roll) => {
          const w = ROLL_TEXT[roll.id];
          if (!w) throw new Error(`Expeditions: the roll "${roll.id}" has no player wording. ${fix(roll.id)}`);
          const entry = roll.entry.startsWith('none') ? { text: 'No entry', note: roll.id === 'infirmary-roll' ? '4 dice, and nothing adds to them' : 'A table roll: D6 and what the table adds' } : roll.entry;
          return {
            cells: [
              roll.name,
              say(`the roll "${roll.id}", who`, w.who, roll.id),
              entry as Cell,
              roll.needs.startsWith('none') ? 'None' : roll.needs === '1' ? '1 success' : 'The row’s Scarcity, plus the ledger',
              say(`the roll "${roll.id}", Help`, w.help, roll.id),
              say(`the roll "${roll.id}", Push`, w.push, roll.id),
            ] as Cell[],
          };
        }),
      },
    ],
  };
}

export const EXPEDITION_TABLES = {
  pace: paceTable,
  'formation-posts': formationPostsTable,
  'hazard-count': hazardCountTable,
  'waypoint-kinds': waypointKindsTable,
  'downtime-actions': downtimeActionsTable,
  'requisition-gate': requisitionGateTable,
  'requisition-list': requisitionListTable,
  'expedition-rolls': rollsTable,
} satisfies Record<string, () => CoreTableData>;

export type ExpeditionTableId = keyof typeof EXPEDITION_TABLES;
