/**
 * The Commander's copy of the Foes in ../data/skirmish (ADR-0012, ADR-0020): each Foe kind's
 * record, its weapons, the closed foe rule every Foe acts by, and what a Parley against a group
 * needs.
 *
 * Every number comes from the tables. The sentence a GM reads is written here, keyed by the row's
 * id, and a row with no wording fails the build, so a new Foe kind or a new step of the foe rule
 * can never go missing from the page. The values a Squad learns only by fighting or by a Size Up
 * are marked so the page can cover them with a bar (ADR-0023).
 */
import { parse } from 'yaml';
import foesText from '../../../data/skirmish/foes.yaml?raw';
import skirmishText from '../../../data/skirmish/skirmish.yaml?raw';
import { checkPlayerText } from './player-text';
import type { GmTableData, GmTableRow } from './gm-expedition-tables';

const WHERE = 'src/lib/gm-foe-tables.ts';
const gm = (what: string, text: string) => checkPlayerText(what, text, new Set(), `Write the GM's wording in ${WHERE}.`);

// ---------------------------------------------------------------- the tables as they are written

interface RawWeapon {
  id: string;
  name: string;
  used_with: string;
  injury_type: string;
  damage: number;
  target: string;
  spends: string;
  wielded_by: string[];
}
interface RawFoe {
  id: string;
  name: string;
  who: string;
  attack_dice: number;
  guard_dice: number;
  health: number;
  grit: number;
  parley: number;
  watch: number;
  group_size: { fixed: number };
  fight_weapon: string | { roll: string; rows: { results: number[]; weapon: string }[]; at_night?: { replaces: string; with: string } };
  shoot_weapon: string | null;
}
interface RawStep {
  id: string;
  test: string;
  does: string;
}

const foesFile = parse(foesText) as {
  foes: RawFoe[];
  firearms: { start: string; reload: string; empty: string };
  guard: { every_attack: string; never: string[]; spends: string };
  foe_rule: {
    when: string;
    candidates: string;
    last_attacker: string;
    lowest_card: string;
    steps: RawStep[];
    first_match: string;
    never: string[];
    no_stress: string;
  };
};
const skirmish = parse(skirmishText) as {
  weapons: { rows: RawWeapon[] };
  parley: { asks: { id: string; name: string; needs_add: number }[] };
  grit: { breaks_when: string };
};

const weapon = (id: string): RawWeapon => {
  const row = skirmish.weapons.rows.find((w) => w.id === id);
  if (!row) throw new Error(`A Foe carries a weapon, "${id}", the weapons table does not list.`);
  return row;
};

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const rollLabel = (results: number[]) => (results.length === 1 ? String(results[0]) : `${Math.min(...results)} to ${Math.max(...results)}`);

const TARGET_WORDING: Record<string, string> = {
  engaged: 'Engaged only',
  apart: 'Apart only',
  either: 'Engaged or Apart',
};

/** "Cut 2, Engaged only", as the weapons table gives it. */
function weaponLine(id: string): string {
  const w = weapon(id);
  const target = TARGET_WORDING[w.target];
  if (!target) throw new Error(`The "${w.name}" row names a target the site does not know.`);
  return `${capitalise(w.injury_type)} ${w.damage}, ${target}`;
}

// ---------------------------------------------------------------- the Foes

export interface FoeWeapon {
  name: string;
  line: string;
  note?: string;
}
export interface FoeStat {
  label: string;
  value: string;
  note: string;
  /** True for a value the Squad learns only by fighting or by a Size Up. */
  hidden: boolean;
}
export interface FoeRecord {
  id: string;
  name: string;
  who: string;
  stats: FoeStat[];
  group: string;
  weapons: FoeWeapon[];
  running: string;
}

/** What each kind is worth knowing for, in the GM's own words. */
const FOE_WORDING: Record<string, string> = {
  bandit:
    'Three of them, and the first one down breaks the rest. They are dangerous for one round and then they are running, which is what they are for: a night that costs blood without costing a soldier.',
  'military-police-trooper':
    'The hardest people in these rules, and the only ones who fight to the last. A patrol under orders does not run, so the fight ends when the Squad puts four of them down, talks them round, or walks away.',
  'garrison-sentry':
    'Two men with muskets who do not want to be here. The muskets are the danger, and the danger ends the moment a soldier closes in: a sentry Engaged has only his hands.',
};

const STAT_NOTES: Record<string, string> = {
  'attack-dice': 'Base dice for every attack it makes, in the open, never Pushed.',
  guard: 'Base dice against every attack on it, in the open, never Pushed.',
  health: 'The damage it takes before it is out of the Skirmish.',
  grit: 'How many of the group must be out before it breaks, at the latest.',
  parley: 'The base a Parley against the group needs.',
  watch: 'The successes a Sneak roll needs for the Ambush.',
};

function statNote(id: string): string {
  const note = STAT_NOTES[id];
  if (!note) throw new Error(`The Foe record: the value "${id}" has no wording. Write it in ${WHERE}.`);
  return note;
}

/** Every Foe kind, with its weapons and the values that sit under bars. */
export function foeRecords(): FoeRecord[] {
  return foesFile.foes.map((foe) => {
    const running = FOE_WORDING[foe.id];
    if (!running) throw new Error(`The Foes: the kind "${foe.name}" has no wording. Write it in ${WHERE}.`);

    const stats: FoeStat[] = [
      { label: 'Attack Dice', value: String(foe.attack_dice), note: statNote('attack-dice'), hidden: true },
      { label: 'Guard', value: String(foe.guard_dice), note: statNote('guard'), hidden: true },
      { label: 'Health', value: String(foe.health), note: statNote('health'), hidden: true },
      { label: 'Grit', value: String(foe.grit), note: statNote('grit'), hidden: true },
      { label: 'Parley value', value: String(foe.parley), note: statNote('parley'), hidden: true },
      { label: 'Watch', value: String(foe.watch), note: statNote('watch'), hidden: true },
    ];

    const weapons: FoeWeapon[] = [];
    if (typeof foe.fight_weapon === 'string') {
      weapons.push({ name: weapon(foe.fight_weapon).name, line: weaponLine(foe.fight_weapon) });
    } else {
      const roll = foe.fight_weapon;
      for (const row of roll.rows) {
        weapons.push({ name: weapon(row.weapon).name, line: weaponLine(row.weapon), note: `${roll.roll.split(' ')[0]} ${rollLabel(row.results)}` });
      }
      if (roll.at_night) {
        const replaced = weapon(roll.at_night.replaces).name;
        const carried = weapon(roll.at_night.with).name;
        weapons.push({ name: `${carried}, at night`, line: weaponLine(roll.at_night.with), note: `In place of the ${replaced.toLowerCase()}` });
      }
    }
    if (foe.shoot_weapon) weapons.push({ name: weapon(foe.shoot_weapon).name, line: weaponLine(foe.shoot_weapon), note: 'Loaded at the start' });

    return {
      id: foe.id,
      name: foe.name,
      who: gm(`The Foes, ${foe.name}`, foe.who),
      stats,
      group: `${foe.group_size.fixed}`,
      weapons,
      running: gm(`The Foes, ${foe.name}`, running),
    };
  });
}

// ---------------------------------------------------------------- the foe rule

export interface FoeRuleStep {
  title: string;
  text: string;
  exit?: { kind: 'stop' | 'note' | 'cover'; label: string; text: string };
}

const STEP_WORDING: Record<string, { title: string; text: string; exit?: FoeRuleStep['exit'] }> = {
  held: {
    title: 'Is it Held?',
    text: 'A Foe in a soldier’s grip Fights that holder, bare-handed, and nothing else. It still rolls Guard against every attack.',
  },
  engaged: {
    title: 'Is a candidate Engaged with it?',
    text: 'It Fights with its Fight weapon: its last attacker if they are Engaged with it, and otherwise the Engaged candidate with the lowest card.',
    exit: { kind: 'note', label: 'Last attacker', text: 'Whoever most recently rolled Fight or Shoot against this Foe, whether it landed or not. A soldier who strikes it takes it off a comrade.' },
  },
  loaded: {
    title: 'Does it hold a loaded firearm, with a candidate left?',
    text: 'It Shoots its last attacker, or, with none, the candidate with the lowest card. A musket is never fired at a soldier the Foe is Engaged with, which is why step 2 comes first.',
  },
  empty: { title: 'Is its firearm empty?', text: 'It reloads, and that is its whole turn. A Foe never runs out of shot.' },
  'close-in': {
    title: 'Is any candidate left?',
    text: 'It becomes Engaged with the candidate with the lowest card and Fights them with its Fight weapon.',
    exit: { kind: 'note', label: 'Lowest card', text: 'The lowest initiative card this round among the candidates the step names. It moves each round, so the rule never fixes on one soldier.' },
  },
  none: {
    title: 'Nothing is left to do.',
    text: 'With no candidate, the Foe does nothing this turn.',
    exit: { kind: 'stop', label: 'It stays', text: 'A Foe never leaves on its own. It leaves at 0 Health, or when its group breaks or surrenders.' },
  },
};

/** The foe rule, step by step, as a drawing. */
export function foeRuleSteps(): FoeRuleStep[] {
  return foesFile.foe_rule.steps.map((step) => {
    const written = STEP_WORDING[step.id];
    if (!written) throw new Error(`The foe rule: the step "${step.id}" has no wording. Write it in ${WHERE}.`);
    return { title: written.title, text: gm(`The foe rule, ${step.id}`, written.text), exit: written.exit };
  });
}

const NEVER_WORDING: Record<string, string> = {
  push: 'Push',
  help: 'Help',
  cover: 'Cover',
  grapple: 'Grapple',
  'break-free': 'Break Free',
  release: 'Release',
  parley: 'Parley',
  'size-up': 'Size Up',
  reaction: 'a Reaction of any kind',
};

/** What no Foe ever does, as the table lists it. */
export function foeNever(): string {
  const names = foesFile.foe_rule.never.map((id) => {
    const name = NEVER_WORDING[id];
    if (!name) throw new Error(`The foe rule bars "${id}", which has no wording. Write it in ${WHERE}.`);
    return name;
  });
  return new Intl.ListFormat('en', { type: 'disjunction' }).format(names);
}

const GUARD_NEVER_WORDING: Record<string, string> = {
  push: 'a Push',
  help: 'Help from a comrade',
  'bonus-dice': 'Bonus Dice',
  'stress-dice': 'Stress Dice',
  'gear-dice': 'Gear Dice',
};

/** What never touches a Guard roll, as the table lists it. */
export function guardNever(): string {
  const names = foesFile.guard.never.map((id) => {
    const name = GUARD_NEVER_WORDING[id];
    if (!name) throw new Error(`Guard bars "${id}", which has no wording. Write it in ${WHERE}.`);
    return name;
  });
  return new Intl.ListFormat('en', { type: 'conjunction' }).format(names);
}

// ---------------------------------------------------------------- what a Parley needs

/** What a Parley against each group needs at full strength, worked from the tables. */
export function parleyNeeds(): GmTableData {
  const asks = skirmish.parley.asks;
  const stand = asks.find((a) => a.needs_add === 0);
  const surrender = asks.find((a) => a.needs_add > 0);
  if (!stand || !surrender) throw new Error(`The Parley asks no longer split into a plain ask and a costlier one. Rewrite the table in ${WHERE}.`);

  return {
    caption: 'What a Parley needs, before anyone falls',
    note: `The group's Parley value plus 1, minus 1 for each of its Foes out of the Skirmish, never below 1, plus the ask's own number. Every Foe put down makes the next ask easier by one.`,
    columns: ['Foe group', `${stand.name}, and the asks that add nothing`, `${surrender.name}`],
    see: false,
    groups: [
      {
        rows: foesFile.foes.map((foe): GmTableRow => {
          const base = foe.parley + 1;
          return {
            cells: [
              foe.name,
              { redact: String(base), label: `${foe.name}: what ${stand.name} needs` },
              { redact: String(base + surrender.needs_add), label: `${foe.name}: what ${surrender.name} needs` },
            ],
          };
        }),
      },
    ],
  };
}

export const GM_FOE_TABLES = {
  'parley-needs': parleyNeeds,
} as const;

export type GmFoeTableId = keyof typeof GM_FOE_TABLES;
