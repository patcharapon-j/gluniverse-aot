/**
 * Player-facing rows for the Skirmish tables in ../data/skirmish (ADR-0012, ADR-0020).
 * The row lists, the numbers, and the order come from the tables; the sentences a player
 * reads are written here and keyed by each row's id, so a row with no wording fails the
 * build and a new row can never go missing from the page.
 *
 * Foe stat blocks, the rule every Foe acts by, and Grit itself live in the Commander's copy,
 * so nothing here reads data/skirmish/foes.yaml.
 */
import { parse } from 'yaml';
import skirmishText from '../../../data/skirmish/skirmish.yaml?raw';
import itemsText from '../../../data/gear/items.yaml?raw';
import injuriesText from '../../../data/harm/critical-injuries.yaml?raw';
import catalogText from '../../../data/character/action-catalog.yaml?raw';
import type { Cell, CoreTableData } from './core-tables';

interface Named {
  id: string;
  name: string;
}

interface RawWeapon extends Named {
  used_with: 'fight' | 'shoot';
  injury_type: string;
  damage: number;
  target: 'engaged' | 'apart' | 'either';
  gear_item: string | null;
  spends: string;
  wielded_by: ('soldier' | 'foe')[];
}

interface RawRoll extends Named {
  who: string;
  entry: string;
  needs: string;
  help: string;
  push: string;
  retry: string;
  notes?: string;
}

const doc = parse(skirmishText) as {
  starting: { steps: Named[] };
  engaged_and_apart: { states: (Named & { meaning: string })[]; moves: Named[] };
  ambush: { effects: Named[] };
  rounds: Record<string, unknown>;
  actions: { skirmish_entries: string[]; other_entries: string[] };
  attack: { lands_on_net_successes: number };
  damage: { amount: { per_net_success_beyond_the_first: number }; on_a_foe: { killed_by: string[]; out_cold_by: string[] } };
  weapons: { rows: RawWeapon[] };
  parley: { asks: (Named & { needs_add: number; effect: string })[] };
  ending: { tests: (Named & { text: string })[] };
  rolls: RawRoll[];
};

const itemNames = new Map((parse(itemsText) as { items: Named[] }).items.map((i) => [i.id, i.name]));
const injuryNames = new Map((parse(injuriesText) as { types: Named[] }).types.map((t) => [t.id, t.name]));
const entryNames = new Map((parse(catalogText) as { entries: Named[] }).entries.map((e) => [e.id, e.name]));

const andList = new Intl.ListFormat('en', { type: 'conjunction' });
const orList = new Intl.ListFormat('en', { type: 'disjunction' });

function wording<T>(map: Record<string, T>, id: string, table: string): T {
  const entry = map[id];
  if (!entry) throw new Error(`${table}: the row "${id}" has no player wording.`);
  return entry;
}

function named(map: Map<string, string>, id: string, what: string, table: string): string {
  const name = map.get(id);
  if (!name) throw new Error(`${table}: no ${what} "${id}".`);
  return name;
}

// ---------------------------------------------------------------- setting out

const START_STEP_WORDING: Record<string, { title: string; text: string; icon: string }> = {
  foes: {
    title: 'The Foes are set out.',
    icon: 'ph:users-three',
    text: 'One group of one kind, its Foes numbered 1 upward, each at full Health, with its weapons, and its firearms loaded. One group takes part in a Skirmish.',
  },
  range: {
    title: 'Everyone starts Apart.',
    icon: 'ph:arrows-out-line-horizontal',
    text: 'Every soldier taking part is Apart from every Foe, unless the start says otherwise.',
  },
  ambush: {
    title: 'The Ambush is settled.',
    icon: 'ph:eye-closed',
    text: 'The start may hand it to the Foes. Otherwise, if the GM rules that you can approach unseen, one of you rolls Sneak for it.',
  },
  'round-1': { title: 'Round 1 begins.', icon: 'ph:cards', text: 'Cards are dealt and the fight runs in rounds until one of the ending tests is met.' },
};

export interface FlowStep {
  title: string;
  text: string;
  icon: string;
  exit?: { kind: 'stop' | 'note' | 'cover'; label: string; text: string };
}

/** Setting out a Skirmish, in the order the table gives the steps. */
export function startingSteps(): FlowStep[] {
  return doc.starting.steps.map((step) => wording(START_STEP_WORDING, step.id, 'Setting out'));
}

// ---------------------------------------------------------------- Engaged and Apart

const MOVE_WORDING: Record<string, { name: string; text: string }> = {
  'close-in': { name: 'Close in', text: 'You become Engaged with one Foe you name.' },
  'break-away': { name: 'Break away', text: 'You become Apart from every Foe you are Engaged with.' },
  stay: { name: 'Stay', text: 'Nothing changes. A move that changes nothing is still your move.' },
};

/** The two ranges, with the meaning each carries. */
export function ranges(): { id: string; name: string; meaning: string }[] {
  return doc.engaged_and_apart.states.map((s) => ({ id: s.id, name: s.name, meaning: s.meaning }));
}

/** What a move in a Skirmish can do, in the table's order. */
export function moves(): { name: string; text: string }[] {
  return doc.engaged_and_apart.moves.map((m) => wording(MOVE_WORDING, m.id, 'Moves'));
}

// ---------------------------------------------------------------- the Ambush

const AMBUSH_WORDING: Record<string, { what: string; text: string }> = {
  order: {
    what: 'The order of round 1',
    text: 'Every card of the side with the Ambush comes up before every card of the other side. Cards within a side keep their order.',
  },
  dice: {
    what: 'Dice',
    text: 'Your Fight or Shoot roll against a Foe that has not yet acted gains 2 Bonus Dice. A Foe with the Ambush rolls 2 more Attack Dice against a soldier who has not yet acted.',
  },
  'no-cancelling-roll': {
    what: 'No answer',
    text: 'An attack by the side with the Ambush on a target that has not yet acted cannot be answered: you make no Reaction, the Foe rolls no Guard, and every success of the attack counts.',
  },
};

export function ambushTable(): CoreTableData {
  const T = 'The Ambush';
  return {
    caption: 'What the Ambush does',
    note: 'A soldier or a Foe has not yet acted until its first card of the Skirmish has come up. Once it has, the Ambush does nothing more against it.',
    columns: ['What it changes', 'How'],
    see: false,
    groups: [{ rows: doc.ambush.effects.map((e) => ({ cells: [wording(AMBUSH_WORDING, e.id, T).what, wording(AMBUSH_WORDING, e.id, T).text] as Cell[] })) }],
  };
}

// ---------------------------------------------------------------- the round

const ROUND_KEYS = ['cards', 'soldier_card', 'foe_card', 'end_of_round', 'turns_count'];

/** A Skirmish round, drawn step by step. */
export function roundSteps(): FlowStep[] {
  for (const key of ROUND_KEYS) {
    if (!(key in doc.rounds)) throw new Error(`The Skirmish round: the table no longer states "${key}".`);
  }
  return [
    {
      title: 'Deal the cards.',
      icon: 'ph:cards',
      text: 'One initiative card to each soldier taking part, living or Down, and one to the Foe group while any of its Foes is still in the Skirmish. There are no Wings and no swap step.',
      exit: { kind: 'note', label: 'Lowest first', text: 'Cards come up lowest first, as in a Titan fight. In round 1 the side with the Ambush goes first whatever the cards say.' },
    },
    {
      title: 'A soldier’s card.',
      icon: 'ph:person-simple-run',
      text: 'One turn: one move and one action, in either order. A Squadmate takes its turn on its own card, and never Pushes or Covers.',
      exit: { kind: 'note', label: 'It counts', text: 'A Skirmish turn counts for every rule that counts turns: a turn limit on a lethal wound, a turn spent in advance, and a Drive’s turn triggers.' },
    },
    {
      title: 'The Foe group’s card.',
      icon: 'ph:users-three',
      text: 'Each Foe still in the Skirmish takes one turn, in number order. Whatever it does, it never attacks a Down soldier.',
      exit: { kind: 'cover', label: 'Answer it', text: 'Each attack on you can be answered with a Block or a Dodge, one Reaction against each Foe per round.' },
    },
    {
      title: 'End of the round.',
      icon: 'ph:flag-banner',
      text: 'Every Foe of a group that has broken leaves. Then check the ending tests.',
      exit: { kind: 'stop', label: 'The Squad leaves', text: 'This is the moment you may declare it, when everyone still standing is Apart, is not Held, holds no Foe, and every Down comrade is carried.' },
    },
  ];
}

// ---------------------------------------------------------------- what a soldier can do

const ACTION_WORDING: Record<string, { does: string; note?: string }> = {
  fight: {
    does: 'Strength against a Foe you are Engaged with, with the Blade Set in your handles for Gear Dice, or bare-handed or with an object that is not a gear item, which gives none.',
    note: 'Declared as a Grapple, it takes no Gear Dice and deals no damage.',
  },
  shoot: {
    does: 'Agility with a loaded firearm, which gives its Gear Dice, against a Foe the weapon can target. The firearm is empty after the roll.',
    note: 'A musket is never fired at a Foe you are Engaged with. You may also Shoot a flare at a person: 1 flare of Squad Supply, no Shot, and no Gear Dice.',
  },
  'break-free': { does: 'Ends a hold a person has on you. It needs 2 successes.' },
  reload: { does: 'Loads one empty firearm, spending 1 Shot of Squad Supply and your action. For a musket it spends your move as well.' },
  release: { does: 'Lets go of a Foe you hold. No roll, and it spends nothing, at any point of your turn.' },
  persuade: { does: 'A Parley with the whole Foe group: Empathy, or Strength as a threat. Once per Skirmish for each soldier.' },
  'size-up': { does: 'Instinct, needing 1 success, to read the group: what it will take to break it and what its Foes are about to do. Once per group, for the whole Squad.' },
  help: { does: 'Adds 1 die to a comrade’s roll. Up to 3 comrades taking part who are not Down may Help, each spending their action, Engaged or Apart.' },
  'treat-injury': { does: 'Wits, as it works in a Titan fight, with no Position requirement. The patient is any other soldier taking part, or yourself where the wound rules allow it.' },
  rally: { does: 'Empathy, as it works in a Titan fight, with no Position requirement. A failed Treat Injury or Rally can be tried again on a later turn.' },
  'lift-comrade': { does: 'Picks up a Down comrade and carries them. Carrying a Down comrade is what lets the Squad leave.' },
  'pass-item': { does: 'Hands one item to a comrade.' },
  'take-item': { does: 'Takes one item from a comrade, or picks one up.' },
  'change-canister': { does: 'Fits a fresh gas canister to your ODM Gear.' },
  'swap-blade-set': { does: 'Swaps the Blade Set in your handles for a fresh one, as the gear rules give it.' },
  'shed-load': { does: 'Drops what you carry to get out from under your carrying limit, as the gear rules give it.' },
  'mount-or-dismount': { does: 'Mounts or dismounts your horse. A move may include one of these as well.' },
};

/**
 * The entries the Skirmish lists that are not actions: Release spends nothing, and the other
 * three are options the gear rules give (data/character/action-catalog.yaml, kind: option).
 * They are listed apart so the action list stays the list of things an action can buy.
 */
const NOT_ACTIONS = ['release', 'swap-blade-set', 'shed-load', 'mount-or-dismount'];

export function actionsTable(): CoreTableData {
  const T = 'What a soldier can do';
  const row = (id: string): { cells: Cell[] } => {
    const w = wording(ACTION_WORDING, id, T);
    const name = named(entryNames, id, 'Catalog entry', T);
    return { cells: [name, w.note ? { text: w.does, note: w.note } : w.does] };
  };
  const listed = [...doc.actions.skirmish_entries, ...doc.actions.other_entries];
  for (const id of NOT_ACTIONS) {
    if (!listed.includes(id)) throw new Error(`${T}: "${id}" is no longer one of the Skirmish's entries.`);
  }
  const isAction = (id: string) => !NOT_ACTIONS.includes(id);
  return {
    caption: 'What a soldier can do in a Skirmish',
    note: 'One action a turn, and one of the actions below. Nothing used only against Titans can be taken.',
    columns: ['Entry', 'What it does here'],
    see: false,
    groups: [
      { heading: 'Actions: the Skirmish’s own', rows: doc.actions.skirmish_entries.filter(isAction).map(row) },
      { heading: 'Actions: carried over from the rest of the rules', rows: doc.actions.other_entries.filter(isAction).map(row) },
      {
        heading: 'Not actions',
        note: 'These four cost you no action. Release spends nothing at all, and the other three are taken as the gear rules give them, at any point of your turn.',
        rows: NOT_ACTIONS.map(row),
      },
    ],
  };
}

// ---------------------------------------------------------------- the attack

const TARGET_WORDING: Record<RawWeapon['target'], string> = {
  engaged: 'Engaged only',
  apart: 'Apart only',
  either: 'Engaged or Apart',
};

const ATTACK_WORDING: Record<RawWeapon['used_with'], string> = { fight: 'Fight', shoot: 'Shoot' };

/** The attack and its cancelling roll, drawn step by step. */
export function attackSteps(): FlowStep[] {
  const net = doc.attack.lands_on_net_successes;
  const extra = doc.damage.amount.per_net_success_beyond_the_first;
  return [
    {
      title: 'The attacker rolls.',
      icon: 'ph:sword',
      text: 'You roll Fight or Shoot with your whole pool and may Push before any answer is made. A Foe rolls its Attack Dice as base dice, succeeding on 6, never Pushed, with nothing added. The successes are the attack’s Severity, announced.',
      exit: { kind: 'note', label: 'In the open', text: 'A Foe’s Attack Dice and Guard are rolled where everyone can see them, and neither ever takes Circumstances.' },
    },
    {
      title: 'The target answers.',
      icon: 'ph:shield',
      text: 'A soldier may make a Reaction: a Block against a Fight attack, a Dodge against either. A Foe rolls its Guard against every attack on it, never Pushed, spending nothing.',
      exit: { kind: 'cover', label: 'No answer', text: 'Against a target who makes no cancelling roll, every success of the attack is net.' },
    },
    {
      title: 'Cancel.',
      icon: 'ph:minus-circle',
      text: `Each success of the cancelling roll cancels one success of the attack. What is left is the Net Successes. The attack lands on ${net} or more and does nothing on 0.`,
      exit: { kind: 'stop', label: 'Nothing', text: 'An attack cancelled to 0 does nothing at all: no damage, no hold, no wear.' },
    },
    {
      title: 'Damage.',
      icon: 'ph:drop',
      text: `A landed attack deals its weapon's damage plus ${extra} for each Net Success beyond the first, with the weapon's Injury Type. So a Reaction that cancels part of an attack still lightens it.`,
      exit: { kind: 'note', label: 'A Grapple', text: 'A Grapple that lands deals no damage at all. It takes hold instead.' },
    },
  ];
}

const WEAPON_NOTES: Record<string, string> = {
  'blade-set': 'The Blade Set in your handles gives the Gear Dice. A Pushed roll whose Gear Die shows 1 ruins it.',
  'bare-hands': 'A Grapple is made with it and deals no damage. Bare hands never kill a Foe. Thrown at a Foe, Engaged or Apart, such an object is a Shoot at this damage with no Gear Dice.',
  'flintlock-pistol': 'Your own firearm gives its Gear Dice, and a Pushed roll whose Gear Dice show any 1 wears it by 1 point.',
  musket: 'Reload spends the move as well. A ball that lands at 1 Net Success deals 4, which brings a Rookie at Health 4 to 0: Down, with a Pierce Critical Injury.',
  'fired-flare': 'A flare is a signal first. Fired at a person it is a Shoot roll with no Gear Dice, and fire kills a Foe it brings to 0 Health.',
  sabre: 'A Foe’s blade. In your hands it is an object that is not a gear item.',
  knife: 'A Foe’s blade. In your hands it is an object that is not a gear item.',
  club: 'A Foe’s cudgel. In your hands it is an object that is not a gear item.',
  firebrand: 'A Bandit at night carries it in place of a club. Fire kills a Foe, and against you it is Burn damage.',
};

export function weaponsTable(): CoreTableData {
  const T = 'Weapons';
  const carried = (by: RawWeapon['wielded_by']) => {
    const names = by.map((w) => (w === 'soldier' ? 'Soldiers' : 'Foes'));
    if (!names.length) throw new Error(`${T}: a weapon nobody carries.`);
    return andList.format(names);
  };
  return {
    caption: 'Weapons in a Skirmish',
    note: 'Your own weapons are a Blade Set, bare hands, a firearm, and a flare. A sabre, a knife, a club, or a firebrand in your hands is an object that is not a gear item. Firearms have no use against a Titan.',
    columns: ['Weapon', 'Attack', 'Damage', 'Target', 'Gear Dice from', 'Spends', 'Used by', 'What else'],
    see: false,
    groups: [
      {
        rows: doc.weapons.rows.map((w) => ({
          cells: [
            w.name,
            wording(ATTACK_WORDING, w.used_with, T),
            { text: String(w.damage), note: named(injuryNames, w.injury_type, 'Injury Type', T) },
            wording(TARGET_WORDING, w.target, T),
            w.gear_item ? named(itemNames, w.gear_item, 'gear item', T) : 'None',
            w.spends === 'nothing' ? 'Nothing' : w.spends.replace(/;.*/, '').trim(),
            carried(w.wielded_by),
            wording(WEAPON_NOTES, w.id, T),
          ] as Cell[],
        })),
      },
    ],
  };
}

/** How a Foe at 0 Health ends, by the Injury Type that took it there. */
export function foeAtZero(): { killed: string; outCold: string } {
  const T = 'Damage on a Foe';
  const names = (ids: string[]) => orList.format(ids.map((id) => named(injuryNames, id, 'Injury Type', T)));
  return { killed: names(doc.damage.on_a_foe.killed_by), outCold: names(doc.damage.on_a_foe.out_cold_by) };
}

// ---------------------------------------------------------------- the Grapple

export interface GrappleState {
  kind: 'free' | 'held' | 'end';
  label: string;
  icon: string;
  text: string;
  note: string | null;
}

/** The Grapple, drawn as the three states a hold passes through. */
export function grappleStates(): GrappleState[] {
  return [
    {
      kind: 'free',
      label: 'The Grapple',
      icon: 'ph:hand-grabbing',
      text: 'A Fight roll against a Foe you are Engaged with, declared as a Grapple before you roll. It takes no Gear Dice, and Talents that name Fight still apply. The Foe rolls Guard as always.',
      note: 'If it lands, the Foe is Held by you, and the attack deals no damage.',
    },
    {
      kind: 'held',
      label: 'You hold it',
      icon: 'ph:lock-simple',
      text: 'You cannot move, Shoot, or Reload, and your action is a bare-handed Fight against the Held Foe or Help, and nothing else. Your move changes nothing.',
      note: 'A bare-handed Fight deals 1 Crush, and bare hands never kill a Foe. Crush at 0 Health puts it out cold.',
    },
    {
      kind: 'held',
      label: 'It is Held',
      icon: 'ph:user-focus',
      text: 'A Held Foe cannot move and attacks only you, bare-handed. It still rolls Guard against every attack on it.',
      note: 'A Foe never Breaks Free and never lets go. A Held Foe of a group that breaks stays Held.',
    },
    {
      kind: 'end',
      label: 'The hold ends',
      icon: 'ph:hand-waving',
      text: 'When you take Release, when you become Down or die, or when the Foe is out of the Skirmish. Release spends nothing and needs no roll.',
      note: 'Held by a person, you cannot move or Dodge, attack only the holder bare-handed, and end it with Break Free, needing 2 successes.',
    },
  ];
}

// ---------------------------------------------------------------- Parley

const ASK_WORDING: Record<string, string> = {
  'stand-down': 'The group leaves.',
  'let-us-pass': 'The group lets the Squad go its way.',
  answer: 'The group answers one question truthfully, from what its Foes know.',
  surrender: 'The group lays down its arms and gives itself up to the Squad.',
};

export function parleyAsksTable(): CoreTableData {
  const T = 'Parley asks';
  return {
    caption: 'What you can ask for',
    note: 'Name the ask before the roll. A success ends the Skirmish; a failure changes nothing, except that a failed threat hardens the group.',
    columns: ['Ask', 'Successes it adds', 'On a success'],
    see: false,
    groups: [
      {
        rows: doc.parley.asks.map((ask) => ({
          cells: [ask.name, ask.needs_add === 0 ? 'None' : `+${ask.needs_add}`, wording(ASK_WORDING, ask.id, T)] as Cell[],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- ending

const ENDING_WORDING: Record<string, { title: string; text: string }> = {
  'foes-gone': { title: 'The group is finished', text: 'Every Foe of it is out of the Skirmish, has left, or has yielded.' },
  'squad-leaves': {
    title: 'The Squad leaves',
    text: 'At the end of a round, if every soldier taking part who is not Down is Apart from every Foe, is not Held, and holds no Foe, and every Down soldier taking part is carried by a comrade, the players may declare it.',
  },
  'no-soldier-standing': { title: 'Nobody is standing', text: 'Every soldier taking part is Down or dead. The Foe group leaves, and takes nothing.' },
};

/** The three tests that end a Skirmish, in the table's order. */
export function endingTests(): { title: string; text: string }[] {
  return doc.ending.tests.map((test) => wording(ENDING_WORDING, test.id, 'Ending a Skirmish'));
}

// ---------------------------------------------------------------- every roll

const ROLL_WORDING: Record<string, { name: string; who: string; entry: string; needs: string; retry: string; notes: string }> = {
  'sneak-for-the-ambush': {
    name: 'Sneak for the Ambush',
    who: 'One soldier taking part who is not Down, chosen by the players.',
    entry: 'Sneak',
    needs: 'The Foe group’s Watch',
    retry: 'Never',
    notes: 'Made only if the GM rules that the Squad can approach unseen. If not, no side has the Ambush.',
  },
  fight: {
    name: 'Fight, or a Grapple',
    who: 'You, on your action, against a Foe you are Engaged with.',
    entry: 'Fight',
    needs: '1 Net Success after the Foe’s Guard',
    retry: 'On a later turn',
    notes: 'None',
  },
  shoot: {
    name: 'Shoot',
    who: 'You, on your action, with a loaded firearm or a flare, against a Foe the weapon can target.',
    entry: 'Shoot',
    needs: '1 Net Success after the Foe’s Guard',
    retry: 'On a later turn, once the firearm is loaded again, or with another flare',
    notes: 'None',
  },
  reaction: {
    name: 'Block or Dodge',
    who: 'The soldier a Foe’s attack targets.',
    entry: 'Block, against a Fight attack only, or Dodge',
    needs: 'None of its own: each success cancels one success of the attack',
    retry: 'Never against the same Foe that round. Its successes stand against that Foe’s later attacks that round',
    notes: 'Takes the Circumstances in force when the Foe group’s card came up, and no step is named or changed for it after.',
  },
  'break-free': {
    name: 'Break Free',
    who: 'A soldier Held by a person, on their action.',
    entry: 'Break Free',
    needs: '2',
    retry: 'On a later turn',
    notes: 'None',
  },
  parley: {
    name: 'Parley',
    who: 'You, on your action.',
    entry: 'Persuade, with Empathy, or Strength as a threat',
    needs: 'The group’s Parley value, plus 1, minus 1 for each of its Foes out of the Skirmish, never below 1, plus the ask’s number',
    retry: 'Never. Each soldier Parleys at most once per Skirmish',
    notes: 'A failed threat raises the group’s Grit and its Parley value by 1 each for the rest of the Skirmish.',
  },
  'parley-outside-a-skirmish': {
    name: 'Parley with no Skirmish under way',
    who: 'A soldier set before a Foe group by a Mission Brief or by the scene.',
    entry: 'Persuade, with Empathy, or Strength as a threat',
    needs: 'The group’s Parley value, plus the ask’s number',
    retry: 'Never by the same soldier with that group',
    notes: 'Talking with anyone who is not a Foe group is a called roll instead.',
  },
  'size-up': {
    name: 'Size Up',
    who: 'You, on your action.',
    entry: 'Size Up',
    needs: '1',
    retry: 'Never. Once per Foe group per Skirmish, for the whole Squad',
    notes: 'None',
  },
  'called-roll': {
    name: 'A called roll',
    who: 'You, on your action, for an act no allowed entry could model that changes nothing the Skirmish tracks.',
    entry: 'The entry the GM names, or the attribute alone',
    needs: '1',
    retry: 'On a later turn, spending that turn’s action',
    notes: 'A fall it stakes is low or high, never extreme.',
  },
  'treat-injury-or-rally': {
    name: 'Treat Injury or Rally',
    who: 'You, on your action.',
    entry: 'Treat Injury or Rally',
    needs: 'As the wound rules give it',
    retry: 'On a later turn',
    notes: 'Sure Hands allows a second Push on Treat Injury.',
  },
  'foe-attack': {
    name: 'A Foe’s attack',
    who: 'A Foe, on its group’s card.',
    entry: 'None: the Foe’s Attack Dice',
    needs: '1 Net Success after your Reaction, if you make one',
    retry: 'Never',
    notes: 'Rolled in the open and never adjusted. It takes no Circumstances.',
  },
  guard: {
    name: 'A Foe’s Guard',
    who: 'The Foe your Fight or Shoot roll targets.',
    entry: 'None: the Foe’s Guard dice',
    needs: 'None of its own: each success cancels one success of your attack',
    retry: 'Never',
    notes: 'Rolled in the open and never adjusted. It takes no Circumstances.',
  },
};

/** "Up to 3 comrades ..." shortened for the table, or "Never". The full rule sits in the table's note. */
function helpCell(raw: string): Cell {
  if (/^never/i.test(raw)) return 'Never';
  if (/^Up to 3 comrades/.test(raw)) return 'Up to 3';
  throw new Error(`Every roll: Help reads "${raw}", which has no player wording.`);
}

/** "Allowed ..." and "Never" shortened for the table, keeping the timing a row adds. */
function pushCell(raw: string): Cell {
  if (/^never/i.test(raw)) return 'Never';
  if (!/^Allowed/.test(raw)) throw new Error(`Every roll: Push reads "${raw}", which has no player wording.`);
  if (/before the Foe's Guard/.test(raw)) return { text: 'Yes', note: 'Before the Guard is rolled.' };
  if (/after the Foe's roll/.test(raw)) return { text: 'Yes', note: 'The reacting side Pushes last.' };
  return 'Yes';
}

export function rollsTable(): CoreTableData {
  const T = 'Every roll';
  return {
    caption: 'Every roll in a Skirmish',
    note:
      'Help, where a row allows it, is up to 3 comrades taking part who are not Down, each spending their action, Engaged or Apart, and one of them may Cover the Push. Where nobody qualifies to Help, nobody can Cover. Circumstances reach every soldier’s roll here and none of a Foe’s, and they change dice, never what a roll needs: Watch, the Parley value, Break Free’s 2, and the Net Successes an attack needs never move.',
    columns: ['Roll', 'Who rolls', 'Entry', 'Needs', 'Help', 'Push', 'Tried again', 'What else'],
    see: false,
    groups: [
      {
        rows: doc.rolls.map((r) => {
          const w = wording(ROLL_WORDING, r.id, T);
          if (!r.retry) throw new Error(`${T}: the roll "${r.id}" no longer states whether it is tried again.`);
          if (/^never/i.test(r.retry) !== /^never/i.test(w.retry)) throw new Error(`${T}: the roll "${r.id}" disagrees with its wording about being tried again.`);
          return {
            cells: [w.name, w.who, w.entry, w.needs, helpCell(r.help), pushCell(r.push), w.retry, w.notes] as Cell[],
          };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- the table registry

export const SKIRMISH_TABLES = {
  'skirmish-ambush': ambushTable,
  'skirmish-actions': actionsTable,
  'skirmish-weapons': weaponsTable,
  'parley-asks': parleyAsksTable,
  'skirmish-rolls': rollsTable,
} satisfies Record<string, () => CoreTableData>;

export type SkirmishTableId = keyof typeof SKIRMISH_TABLES;
