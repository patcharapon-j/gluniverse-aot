/**
 * Player-facing rows for the gear tables in ../data/gear (ADR-0012, ADR-0020), rendered by
 * CoreTable on Gear & ODM and by the Compendium's Gear section. Every item, number, band, and
 * order comes from the tables. The sentences a player reads live in
 * src/content/compendium/gear-text.yaml, keyed by each row's id, and a row with no wording fails
 * the build, so a new item, band, or kind of Squad Supply can never go missing from a page.
 */
import { parse } from 'yaml';
import itemsText from '../../../data/gear/items.yaml?raw';
import odmText from '../../../data/gear/odm-gear.yaml?raw';
import bladeText from '../../../data/gear/blade-sets.yaml?raw';
import horsesText from '../../../data/gear/horses.yaml?raw';
import fallsText from '../../../data/gear/falls.yaml?raw';
import carryingText from '../../../data/gear/carrying.yaml?raw';
import repairText from '../../../data/gear/field-repair.yaml?raw';
import issueText from '../../../data/gear/standard-issue.yaml?raw';
import supplyText from '../../../data/gear/squad-supply.yaml?raw';
import catalogText from '../../../data/character/action-catalog.yaml?raw';
import wordingText from '../content/compendium/gear-text.yaml?raw';
import { checkPlayerText, hyphenatedIds } from './player-text';
import type { Cell, CoreTableData } from './core-tables';

const andList = new Intl.ListFormat('en', { type: 'conjunction' });

const WORDING_FILE = 'src/content/compendium/gear-text.yaml';

// ---------------------------------------------------------------- the tables

interface RawItem {
  id: string;
  name: string;
  rated: boolean;
  gear_dice_for?: string[];
  counts_as_not_had?: string[];
  restored_by?: string[];
  items_counted: number;
}
interface RawBand {
  id: string;
  adds: number;
}
interface RawDamageRow {
  id: string;
  results: { min: number | null; max: number | null };
  damage: number;
}
interface RawCarried {
  what: string;
  items: number;
}
interface RawIssueRow {
  funding: number;
  odm_gear_rating: number;
  spare_canisters: number;
  blade_sets: number;
  horse_rating: number;
}
interface RawKind {
  id: string;
  name: string;
}
interface RawStockRow {
  funding: number;
  [kind: string]: number;
}

const itemsDoc = parse(itemsText) as { rating_rules: Record<string, string>; items: RawItem[] };
const odmDoc = parse(odmText) as {
  rolls_it_rates: string[];
  gas: { full_gas_rating: number };
  gas_roll: { dice: { standard: number; after_pushed_odm_roll: number; maximum: number } };
  odm_use: { not_odm_use: string[] };
};
const bladeDoc = parse(bladeText) as { handles: Record<string, string> };
const horsesDoc = parse(horsesText) as { gear_dice: Record<string, string> };
const fallsDoc = parse(fallsText) as {
  height: { bands: RawBand[] };
  damage_table: { rows: RawDamageRow[] };
  procedure: string[];
};
const carryingDoc = parse(carryingText) as {
  limit: { formula: string };
  items_counted: RawCarried[];
  passing_items: { passable: string[]; not_passable: string };
};
const repairDoc = parse(repairText) as { needs: number; target: { items: string[] } };
const issueDoc = parse(issueText) as {
  funding: { until_funding_rules: number };
  by_funding: RawIssueRow[];
  every_row: { fitted_canister: string; blade_set_rating: number };
  by_specialty: { rows: { specialty: string; item: string; rating: number }[] };
  receiving: { steps: { id: string }[] };
};
const supplyDoc = parse(supplyText) as {
  kinds: RawKind[];
  stock: { by_funding: RawStockRow[] };
};
const catalogDoc = parse(catalogText) as { entries: { id: string; name: string }[] };

// ---------------------------------------------------------------- the wording

interface ItemWording {
  what: string;
  not_had: string[];
  at_zero: string;
  wear: string;
  restore: string[];
  carried: string;
  extra?: string[];
}
interface SupplyWording {
  what: string;
  spent_by: string;
}
interface IssueWording {
  title: string;
  text: string;
}

interface MovedWording {
  item: string;
  note: string;
}

const wording = parse(wordingText) as {
  items: Record<string, ItemWording>;
  carrying: Record<string, string>;
  passing: { can: MovedWording[]; cannot: MovedWording };
  falls: { bands: Record<string, string>; landings: Record<string, string> };
  supply: Record<string, SupplyWording>;
  issue: Record<string, IssueWording>;
};

/** Internal ids that must never reach a page: the gear items and the Catalog entries. */
const IDS = hyphenatedIds([...itemsDoc.items, ...catalogDoc.entries]);

const fix = (where: string) => `Write player wording under ${where} in ${WORDING_FILE}.`;

/** Checks one sentence and returns it, or fails the build naming where the wording belongs. */
function say(where: string, text: string | undefined, key: string): string {
  if (!text) throw new Error(`Gear: ${where} has no player wording. ${fix(key)}`);
  return checkPlayerText(`Gear: ${where}`, text, IDS, fix(key));
}

/** Checks a list that must match a table's rows one for one, so a new row fails the build. */
function sayEach(where: string, texts: string[] | undefined, rows: number, key: string): string[] {
  const list = texts ?? [];
  if (list.length !== rows) {
    throw new Error(`Gear: ${where} has ${list.length} lines for ${rows} rows. ${fix(key)}`);
  }
  return list.map((t, i) => say(`${where}, line ${i + 1}`, t, key));
}

const ENTRY_NAMES = new Map(catalogDoc.entries.map((e) => [e.id, e.name]));

function entryName(id: string): string {
  const name = ENTRY_NAMES.get(id);
  if (!name) throw new Error(`Gear: no Action Catalog entry "${id}".`);
  return name;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const titleCase = (id: string) => {
  const words = id.split('-');
  return words
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
};

// ---------------------------------------------------------------- numbers other pages need

/** The gas a full canister holds, and the dice of a Gas Roll. */
export function gasNumbers(): { full: number; dice: number; pushedDice: number } {
  const { standard, after_pushed_odm_roll, maximum } = odmDoc.gas_roll.dice;
  if (after_pushed_odm_roll !== maximum) throw new Error('Gear: a Gas Roll can now be larger than a Pushed one.');
  return { full: odmDoc.gas.full_gas_rating, dice: standard, pushedDice: after_pushed_odm_roll };
}

/** The successes a Field Repair roll needs, and the items it can mend. */
export function repairNumbers(): { needs: number; items: string[] } {
  return { needs: repairDoc.needs, items: repairDoc.target.items.map((id) => itemName(id)) };
}

/** The Funding every table uses until the Funding rules are written. */
export function defaultFunding(): number {
  return issueDoc.funding.until_funding_rules;
}

/** The carrying limit, in words. */
export function carryingLimit(): string {
  if (carryingDoc.limit.formula !== 'strength + 4') throw new Error('Gear: the carrying limit formula changed.');
  return 'Strength + 4';
}

function itemName(id: string): string {
  const item = itemsDoc.items.find((i) => i.id === id);
  if (!item) throw new Error(`Gear: no gear item "${id}".`);
  return item.name;
}

/** What the Compendium and the chapter call each item's Gear Dice entries. */
function gearDiceFor(item: RawItem): string {
  const list = (item.gear_dice_for ?? []).map(entryName);
  return list.length ? andList.format(list) : 'None. It adds no dice to any roll.';
}

const ratingLabel = (item: RawItem) => (item.rated ? 'Rated 1 to 3' : 'Not rated');

const itemsLabel = (n: number) => (n === 0 ? 'No item' : n === 1 ? '1 item' : `${n} items`);

// ---------------------------------------------------------------- the gear items

export function gearItemsTable(): CoreTableData {
  return {
    caption: 'The gear items',
    note: 'Nothing else is a gear item. Any other object you describe adds no Gear Dice and counts as no item.',
    columns: ['Item', 'Gear Dice on', 'Counts as not had when', 'At 0'],
    see: false,
    groups: [
      {
        rows: itemsDoc.items.map((item) => {
          const w = wording.items[item.id];
          const notHad = sayEach(`"${item.name}" not had`, w?.not_had, (item.counts_as_not_had ?? []).length, `"${item.id}" (not_had)`);
          const needed = (item.gear_dice_for ?? []).length > 0;
          return {
            cells: [
              { text: item.name, note: ratingLabel(item) },
              gearDiceFor(item),
              notHad.length ? { options: notHad } : needed ? 'It always counts as had.' : 'No entry needs it.',
              say(`"${item.name}" at 0`, w?.at_zero, `"${item.id}" (at_zero)`),
            ] as Cell[],
          };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- falls

export function fallBandsTable(): CoreTableData {
  return {
    caption: 'The three height bands',
    note: 'A band adds to the fall roll, and nothing else about the fall changes.',
    columns: ['Band', 'Adds to the D6', 'Where it comes from'],
    see: false,
    groups: [
      {
        rows: fallsDoc.height.bands.map((band) => ({
          cells: [titleCase(band.id), `+${band.adds}`, say(`the ${band.id} band`, wording.falls.bands[band.id], `"${band.id}" (falls, bands)`)],
        })),
      },
    ],
  };
}

export function fallDamageTable(): CoreTableData {
  const total = (row: RawDamageRow) => {
    const { min, max } = row.results;
    if (min === null && max !== null) return `${max} or less`;
    if (max === null && min !== null) return `${min} or more`;
    if (min === max) return String(min);
    return `${min} to ${max}`;
  };
  return {
    caption: 'What a fall does',
    note: 'Roll D6 and add the band. Every total has a row.',
    columns: ['D6 plus the band', 'Landing', 'Damage'],
    see: false,
    roll: true,
    groups: [
      {
        rows: fallsDoc.damage_table.rows.map((row) => ({
          cells: [
            total(row),
            say(`the "${row.id}" landing`, wording.falls.landings[row.id], `"${row.id}" (falls, landings)`),
            row.damage === 0 ? 'None' : String(row.damage),
          ],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- carrying

export function carryingTable(): CoreTableData {
  return {
    caption: 'What counts toward your carrying limit',
    note: `Your limit is ${carryingLimit()} items. Nothing outside this list counts.`,
    columns: ['What you carry', 'Items'],
    see: false,
    groups: [
      {
        rows: carryingDoc.items_counted.map((row) => {
          const key = slugify(row.what);
          return {
            cells: [say(`the carried "${row.what}"`, wording.carrying[key], `"${key}" (carrying)`), itemsLabel(row.items)],
          };
        }),
      },
    ],
  };
}

export function passingTable(): CoreTableData {
  const rows = carryingDoc.passing_items.passable.length;
  const can = wording.passing.can ?? [];
  if (can.length !== rows) throw new Error(`Gear: what can be passed has ${can.length} lines for ${rows} rows. ${fix('passing (can)')}`);
  const cannot = wording.passing.cannot;
  if (!cannot) throw new Error(`Gear: what cannot be passed has no player wording. ${fix('passing (cannot)')}`);
  return {
    caption: 'What moves between soldiers',
    note: 'Passing and taking each spend an action in a Titan Engagement and nothing outside one, and neither is rolled, so neither is Helped or Covered.',
    columns: ['What moves', 'How it moves'],
    see: false,
    groups: [
      {
        heading: 'Passed, taken from a comrade who is Down, or shared out',
        rows: can.map((row, i) => ({
          cells: [say(`passed item ${i + 1}`, row.item, 'passing (can)'), say(`passed item ${i + 1}, how`, row.note, 'passing (can)')],
        })),
      },
      {
        heading: 'Never leaves you',
        rows: [{ cells: [say('what cannot be passed', cannot.item, 'passing (cannot)'), say('what cannot be passed, how', cannot.note, 'passing (cannot)')] }],
      },
    ],
  };
}

// ---------------------------------------------------------------- Standard Issue

export function standardIssueTable(): CoreTableData {
  const { fitted_canister, blade_set_rating } = issueDoc.every_row;
  if (!/^one, full/.test(fitted_canister)) throw new Error('Gear: the fitted canister of Standard Issue is no longer one full canister.');
  const current = defaultFunding();
  return {
    caption: 'Standard Issue by Funding',
    note: `The Survey Corps' Funding runs from 1 to 6. Until the Funding rules are written it is ${current}.`,
    columns: ['Funding', 'ODM Gear', 'Canisters', 'Blade Sets', 'Horse'],
    see: false,
    roll: true,
    groups: [
      {
        rows: issueDoc.by_funding.map((row) => ({
          cells: [
            row.funding === current ? { text: String(row.funding), note: 'In use now' } : String(row.funding),
            `Rated ${row.odm_gear_rating}`,
            row.spare_canisters === 0
              ? 'One full canister fitted, no spares'
              : `One full canister fitted, and ${row.spare_canisters} full spare${row.spare_canisters === 1 ? '' : 's'}`,
            { text: `${row.blade_sets}, each rated ${blade_set_rating}`, note: 'Counting the one in your handles' },
            `Rated ${row.horse_rating}`,
          ] as Cell[],
        })),
      },
    ],
  };
}

const SPECIALTY_NAMES: Record<string, string> = { medic: 'Medic', engineer: 'Engineer' };

export function standardIssueSpecialtyTable(): CoreTableData {
  return {
    caption: 'Standard Issue by Specialty',
    note: 'No other Specialty receives an item. A Squadmate uses its own Specialty.',
    columns: ['Specialty', 'Item', 'Rating'],
    see: false,
    groups: [
      {
        rows: issueDoc.by_specialty.rows.map((row) => {
          const specialty = SPECIALTY_NAMES[row.specialty];
          if (!specialty) throw new Error(`Gear: the Specialty "${row.specialty}" has no player wording.`);
          return { cells: [specialty, itemName(row.item), String(row.rating)] };
        }),
      },
    ],
  };
}

/** The steps of receiving Standard Issue, in the table's order. */
export function issueSteps(): { id: string; title: string; text: string }[] {
  return issueDoc.receiving.steps.map((step) => {
    const w = wording.issue[step.id];
    if (!w) throw new Error(`Gear: the Standard Issue step "${step.id}" has no player wording. ${fix(`"${step.id}" (issue)`)}`);
    return {
      id: step.id,
      title: say(`the "${step.id}" step's name`, w.title, `"${step.id}" (issue)`),
      text: say(`the "${step.id}" step`, w.text, `"${step.id}" (issue)`),
    };
  });
}

// ---------------------------------------------------------------- Squad Supply

function supplyWording(kind: RawKind): SupplyWording {
  const w = wording.supply[kind.id];
  if (!w) throw new Error(`Gear: the Squad Supply kind "${kind.name}" has no player wording. ${fix(`"${kind.id}" (supply)`)}`);
  return {
    what: say(`the Squad Supply kind "${kind.name}"`, w.what, `"${kind.id}" (supply)`),
    spent_by: say(`what spends "${kind.name}"`, w.spent_by, `"${kind.id}" (supply)`),
  };
}

export function squadSupplyKindsTable(): CoreTableData {
  return {
    caption: 'The four kinds of Squad Supply',
    note: 'The Squad holds all of it. No soldier carries it, and no death or Retirement takes any of it away.',
    columns: ['Kind', 'What spends it'],
    see: false,
    groups: [
      {
        rows: supplyDoc.kinds.map((kind) => {
          const w = supplyWording(kind);
          return { cells: [{ text: kind.name, note: w.what }, w.spent_by] as Cell[] };
        }),
      },
    ],
  };
}

export function squadSupplyStockTable(): CoreTableData {
  const current = defaultFunding();
  return {
    caption: 'Squad Supply stock by Funding',
    note: 'Each kind is set to its row when the Squad forms, and rises to it whenever the whole Squad receives Standard Issue. None is ever lowered.',
    columns: ['Funding', ...supplyDoc.kinds.map((k) => k.name)],
    see: false,
    roll: true,
    groups: [
      {
        rows: supplyDoc.stock.by_funding.map((row) => ({
          cells: [
            row.funding === current ? { text: String(row.funding), note: 'In use now' } : String(row.funding),
            ...supplyDoc.kinds.map((kind) => {
              const units = row[kind.id];
              if (typeof units !== 'number') throw new Error(`Gear: the stock row for Funding ${row.funding} holds no "${kind.name}".`);
              return String(units);
            }),
          ] as Cell[],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- drawings

export interface FlowStep {
  title: string;
  text: string;
  icon?: string;
  dice?: string;
  exit?: { kind: 'stop' | 'note' | 'cover'; label: string; text: string };
}

/** The Gas Roll, from what counts as ODM use to running dry. */
export function gasRollFlow(): FlowStep[] {
  const { full, dice, pushedDice } = gasNumbers();
  return [
    {
      title: 'Did you use ODM Gear?',
      icon: 'ph:wind',
      text: 'You used it this round if you made an ODM move, made a roll whose gear item was your own ODM Gear, or took an act a rule names as ODM use.',
      exit: {
        kind: 'stop',
        label: 'Not ODM use',
        text: 'Holding a Position without moving, airborne or not; a mounted charge; a roll made with a Blade Set, a horse, or a kit, every Nape strike included; and being carried. No use, no roll.',
      },
    },
    {
      title: 'Roll at the end of the round.',
      icon: 'ph:hourglass-medium',
      text: 'One Gas Roll for each such soldier, however many times they used the harness. A Squadmate rolls like anyone else.',
      exit: {
        kind: 'note',
        label: 'A fight cut short',
        text: 'If the Titan Engagement ends partway through a round, that round’s Gas Rolls are made at once, before anything the ending sets off.',
      },
    },
    {
      title: `${dice} dice, or ${pushedDice} after a Push.`,
      icon: 'ph:dice-three',
      text: `${pushedDice} dice if any roll you Pushed this round had your ODM Gear as its gear item, however many such rolls there were. A Pushed dodge made with your horse does not count. Light Trigger turns a ${pushedDice}-die roll back into ${dice}, once per Titan Engagement.`,
      exit: { kind: 'note', label: 'One roll', text: `The extra gas a Push costs is the ${pushedDice === 3 ? 'third' : `${pushedDice}th`} die of that one roll, never a second roll.` },
    },
    {
      title: 'Count the 1s.',
      icon: 'ph:dice-one',
      text: 'The dice are not added and a 6 does nothing. Lower your Gas Rating by 1 for each 1, to a minimum of 0.',
      exit: {
        kind: 'stop',
        label: 'Not an attribute roll',
        text: 'No attribute, Talent dice, Bonus Dice, Gear Dice, Stress Dice, or Circumstances. It cannot be Pushed, Helped, or Covered, and it never gives a Stress Response.',
      },
    },
    {
      title: 'At 0 you have run dry.',
      icon: 'ph:drop-half',
      text: 'Your ODM Gear counts as not had: no Gear Dice, no ODM move, and no Nape strike or close Body Part strike. You make no further Gas Roll until you have gas again.',
      exit: { kind: 'note', label: 'No fall', text: 'Running dry never drops you. Airborne, you hang where you are until something else brings you down.' },
    },
    {
      title: 'Fit a spare.',
      icon: 'ph:arrows-clockwise',
      text: `Change Canister takes your action in a fight and nothing outside one, and you can take it airborne. A full canister is Gas Rating ${full}, and the one you take off is kept as a spare unless it is empty.`,
      exit: { kind: 'cover', label: 'Handed over', text: 'A canister owing gas is rolled for before it moves. If that roll empties it, it is discarded, nothing moves, and the pass or take spends nothing.' },
    },
  ];
}

/** Wear, from a Pushed roll to a Jam. */
export function wearFlow(): FlowStep[] {
  return [
    {
      title: 'You Push a roll with a gear item.',
      icon: 'roll-push',
      text: 'What matters is the faces its Gear Dice show once the roll is final, after the Push has rolled the ones showing 2 to 5.',
      exit: { kind: 'stop', label: 'No Push', text: 'A roll you did not Push wears nothing, whatever its Gear Dice showed.' },
    },
    {
      title: 'Any Gear Die showing 1 is 1 point of wear.',
      dice: 'gear:1xl,4l',
      text: 'One point per Pushed roll, whether one Gear Die shows a 1 or all three. It falls on the item that supplied the dice, and on that item alone.',
      exit: { kind: 'note', label: 'Your horse', text: 'A Pushed roll made with the horse wears the horse, not your ODM Gear.' },
    },
    {
      title: 'A Talent takes the point off first.',
      icon: 'talent-rule',
      text: 'Well-Kept Rig, Blade Discipline, and Sure Seat each remove a point before it applies, once per Titan Engagement.',
      exit: { kind: 'cover', label: 'Nothing left', text: 'With the point removed, the item is untouched.' },
    },
    {
      title: 'Lower the current rating by 1 for the point left.',
      icon: 'ph:arrow-down',
      text: 'Never below 0, and the rating itself never changes. Only the current rating moves, up or down.',
      exit: { kind: 'stop', label: 'A Blade Set', text: 'The one exception. Any point left ruins the set outright: it is discarded at once and your handles are empty.' },
    },
    {
      title: 'At 0 the item stops working.',
      icon: 'ph:warning-octagon',
      text: 'ODM Gear Jams, a horse goes lame, a medical kit is spent, and a tool kit or a firearm is worn out. At 0 an item gives no Gear Dice and counts as not had for every entry.',
      exit: { kind: 'note', label: 'Lame', text: 'A lame horse drops its rider, who falls from a horse.' },
    },
    {
      title: 'A Jam.',
      icon: 'gear-odm',
      text: 'No Gear Dice, no ODM move, and no Nape strike or Body Part strike from On Body or Blind Spot. Your Gas Rating does not change, and you still make the Gas Roll for the round it Jammed in, but none while it stays Jammed.',
      exit: { kind: 'stop', label: 'Airborne', text: 'You fall, once the roll that Jammed it is finished. It ends when Field Repair or a Standard Issue harness lifts the current rating above 0.' },
    },
  ];
}

/** A fall, from finding the band to the damage. */
export function fallFlow(): FlowStep[] {
  const bands = fallsDoc.height.bands;
  if (bands.length !== 3) throw new Error('Gear: the fall drawing is drawn for three bands.');
  const bandNames = andList.format(bands.map((b) => b.id));
  const bandAdds = andList.format(bands.map((b) => `+${b.adds}`));
  return [
    {
      title: 'Is the band already named?',
      icon: 'ph:seal-check',
      text: 'A rule that names a fall and its band gives that band, and nothing below changes it. A fall the GM stakes on a called roll is low or high as named before the dice, never extreme, in a fight as outside one.',
      exit: { kind: 'note', label: 'No band named', text: 'A rule that names a fall and no band, such as a knock loose, letting go, or a release from a lift, reads the steps below.' },
    },
    {
      title: 'Find the fall’s Titan.',
      icon: 'ph:crosshair',
      text: 'In a fight, the Focus Titan you held the closest Position to when you fell, in the order On Body, Blind Spot, In Reach, Distant. On a tie it is the Titan whose card, Grab, or effect caused the fall, and otherwise the living Focus Titan with the earliest label.',
      exit: { kind: 'stop', label: 'Outside a fight', text: 'There is no Titan and no Position to read, so the fall is low unless a rule or the GM named a band.' },
    },
    {
      title: 'From a horse is low.',
      icon: 'gear-horse',
      text: 'No later step changes it, however high the ground or big the Titan.',
      exit: { kind: 'note', label: 'Otherwise', text: 'Read the Position you held relative to that Titan: Distant or In Reach is low, On Body or Blind Spot is high.' },
    },
    {
      title: 'Raise it one band for the ground or the size.',
      icon: 'titan-large',
      text: 'A fall that is not from a horse goes up one band at Giant Forest, or against a Large Titan. Both at once still raise it one, and nothing goes past extreme.',
      exit: { kind: 'note', label: 'The three bands', text: `The bands are ${bandNames}, adding ${bandAdds} to the roll.` },
    },
    {
      title: 'Let go of everything.',
      icon: 'ph:hand-waving',
      text: 'You stop being airborne, mounted, and carried. A comrade you carry stops being carried and falls at the same moment from the same band.',
      exit: { kind: 'cover', label: 'Never twice', text: 'This happens before the damage, so a fall that puts you Down starts no second fall.' },
    },
    {
      title: 'Roll D6, add the band, read the table.',
      dice: 'base:?',
      text: 'On 0 damage the fall does no harm. Otherwise take that damage. A Critical Injury it gives has a rolled location and the Crush type, as every fall’s does.',
      exit: { kind: 'stop', label: 'No Reaction', text: 'The fall roll takes no Circumstances and cannot be Pushed or Helped. A fall is not a Titan attack, nothing answers it, and it is no Fear Roll trigger.' },
    },
  ];
}

// ---------------------------------------------------------------- the Compendium

/** The icon each gear item and kind of Squad Supply is filed under. */
const ICONS: Record<string, string> = {
  'odm-gear': 'gear-odm',
  'gas-canister': 'gear-gas-canister',
  'blade-set': 'gear-blades',
  horse: 'gear-horse',
  'medical-kit': 'gear-medical-kit',
  'tool-kit': 'gear-tool-kit',
  'flintlock-pistol': 'gear-firearm',
  musket: 'gear-firearm',
  'prosthetic-arm': 'gear-prosthetic',
  'prosthetic-leg': 'gear-prosthetic',
  rations: 'gear-rations',
  flares: 'gear-flares',
  medical: 'gear-medical-kit',
  shot: 'gear-firearm',
};

function icon(id: string): string {
  const name = ICONS[id];
  if (!name) throw new Error(`Gear: "${id}" has no icon.`);
  return name;
}

export interface GearEntry {
  id: string;
  name: string;
  icon: string;
  rating: string;
  rated: boolean;
  carriedAs: string;
  /** The shelf the Compendium files it on, and the filter chip it answers to. */
  family: { slug: string; name: string; order: number };
  /** The section of Gear & ODM that holds its full rules. */
  href: string;
  what: string;
  gearDice: string;
  notHad: string[];
  atZero: string;
  wear: string;
  restore: string[];
  carried: string;
  extra: string[];
  search: string;
}

/** Which shelf of the Compendium each item sits on, and the section that holds its full rules. */
const FILED: Record<string, { family: { slug: string; name: string; order: number }; anchor: string }> = {
  'odm-gear': { family: { slug: 'flight', name: 'Flight', order: 0 }, anchor: 'odm-gear-and-gas' },
  'gas-canister': { family: { slug: 'flight', name: 'Flight', order: 0 }, anchor: 'the-gas-roll' },
  'blade-set': { family: { slug: 'arms', name: 'Arms', order: 1 }, anchor: 'blades' },
  'flintlock-pistol': { family: { slug: 'arms', name: 'Arms', order: 1 }, anchor: 'firearms' },
  musket: { family: { slug: 'arms', name: 'Arms', order: 1 }, anchor: 'firearms' },
  horse: { family: { slug: 'mount', name: 'Mount', order: 2 }, anchor: 'horses' },
  'medical-kit': { family: { slug: 'kits', name: 'Kits', order: 3 }, anchor: 'restoring' },
  'tool-kit': { family: { slug: 'kits', name: 'Kits', order: 3 }, anchor: 'field-repair' },
  'prosthetic-arm': { family: { slug: 'fitted', name: 'Fitted', order: 4 }, anchor: 'prosthetics' },
  'prosthetic-leg': { family: { slug: 'fitted', name: 'Fitted', order: 4 }, anchor: 'prosthetics' },
};

/** Every gear item, in the table's order, as the Compendium files it. */
export function gearEntries(): GearEntry[] {
  return itemsDoc.items.map((item) => {
    const w = wording.items[item.id];
    if (!w) throw new Error(`Gear: the item "${item.name}" has no player wording. ${fix(`"${item.id}"`)}`);
    const filed = FILED[item.id];
    if (!filed) throw new Error(`Gear: the item "${item.name}" is filed under no heading.`);
    const key = `"${item.id}"`;
    const entry: GearEntry = {
      id: item.id,
      name: item.name,
      icon: icon(item.id),
      rating: ratingLabel(item),
      rated: item.rated,
      carriedAs: itemsLabel(item.items_counted),
      family: filed.family,
      href: `/guide/gear-and-odm/#${filed.anchor}`,
      what: say(`the item "${item.name}"`, w.what, key),
      gearDice: gearDiceFor(item),
      notHad: sayEach(`"${item.name}" not had`, w.not_had, (item.counts_as_not_had ?? []).length, `${key} (not_had)`),
      atZero: say(`"${item.name}" at 0`, w.at_zero, `${key} (at_zero)`),
      wear: say(`"${item.name}" wear`, w.wear, `${key} (wear)`),
      restore: sayEach(`"${item.name}" restored`, w.restore, (item.restored_by ?? []).length, `${key} (restore)`),
      carried: say(`"${item.name}" carried`, w.carried, `${key} (carried)`),
      extra: (w.extra ?? []).map((t, i) => say(`"${item.name}" note ${i + 1}`, t, `${key} (extra)`)),
      search: '',
    };
    entry.search = [entry.name, entry.rating, entry.what, entry.gearDice, entry.atZero, ...entry.extra].join(' ').toLowerCase();
    return entry;
  });
}

export interface SupplyEntry {
  id: string;
  name: string;
  icon: string;
  what: string;
  spentBy: string;
  stock: number;
  search: string;
}

/** The four kinds of Squad Supply, with the stock the Squad holds at the Funding in use. */
export function supplyEntries(): SupplyEntry[] {
  const current = defaultFunding();
  const row = supplyDoc.stock.by_funding.find((r) => r.funding === current);
  if (!row) throw new Error(`Gear: Squad Supply has no stock row for Funding ${current}.`);
  return supplyDoc.kinds.map((kind) => {
    const w = supplyWording(kind);
    const units = row[kind.id];
    if (typeof units !== 'number') throw new Error(`Gear: the stock row for Funding ${current} holds no "${kind.name}".`);
    return {
      id: kind.id,
      name: kind.name,
      icon: icon(kind.id),
      what: w.what,
      spentBy: w.spent_by,
      stock: units,
      search: [kind.name, w.what, w.spent_by].join(' ').toLowerCase(),
    };
  });
}

export const GEAR_TABLES = {
  'gear-items': gearItemsTable,
  'fall-bands': fallBandsTable,
  'fall-damage': fallDamageTable,
  carrying: carryingTable,
  'passing-items': passingTable,
  'standard-issue': standardIssueTable,
  'standard-issue-specialty': standardIssueSpecialtyTable,
  'squad-supply-kinds': squadSupplyKindsTable,
  'squad-supply-stock': squadSupplyStockTable,
} satisfies Record<string, () => CoreTableData>;

export type GearTableId = keyof typeof GEAR_TABLES;

/** Kept so a change to a rule the page states in prose is noticed here rather than on the page. */
function gearRuleChecks(): void {
  if (!bladeDoc.handles.holds.includes('At most one')) throw new Error('Gear: the handles no longer hold at most one Blade Set.');
  if (!horsesDoc.gear_dice.dodge.includes('mounted')) throw new Error('Gear: the horse no longer needs you mounted for a dodge.');
  if (!itemsDoc.rating_rules.one_item_per_roll.includes('at most one item')) throw new Error('Gear: a roll can now take Gear Dice from more than one item.');
  if (odmDoc.rolls_it_rates.length !== (itemsDoc.items.find((i) => i.id === 'odm-gear')?.gear_dice_for ?? []).length) {
    throw new Error('Gear: the entries ODM Gear rates no longer match its item row.');
  }
  if (odmDoc.odm_use.not_odm_use.length !== 4) throw new Error('Gear: what is not ODM use has changed; the Gas Roll drawing lists four.');
  if (fallsDoc.procedure.length !== 5) throw new Error('Gear: the fall procedure no longer has five steps.');
}

gearRuleChecks();
