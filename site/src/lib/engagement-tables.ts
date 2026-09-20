/**
 * Player-facing rows for the Titan Engagement tables in ../data/engagement and ../data/harm
 * (ADR-0012, ADR-0020), rendered by CoreTable. The row lists and every number come from the
 * tables. The wording each row needs for players is written here, keyed by the row's id, and a
 * row with no wording fails the build, so a new row can never go missing from a page.
 */
import { parse } from 'yaml';
import anchorText from '../../../data/engagement/anchor-ratings.yaml?raw';
import attentionText from '../../../data/engagement/attention.yaml?raw';
import grabText from '../../../data/engagement/grab.yaml?raw';
import harmEffectsText from '../../../data/harm/effect-types.yaml?raw';
import positionsText from '../../../data/engagement/positions.yaml?raw';
import readText from '../../../data/engagement/read.yaml?raw';
import roundText from '../../../data/engagement/round.yaml?raw';
import sizesText from '../../../data/engagement/size-classes.yaml?raw';
import squadTacticsText from '../../../data/engagement/squad-tactics.yaml?raw';
import titanFormatText from '../../../data/engagement/titan-format.yaml?raw';
import titanHarmText from '../../../data/engagement/titan-harm.yaml?raw';
import catalogText from '../../../data/character/action-catalog.yaml?raw';
import type { Cell, CoreTableData } from './core-tables';

const andList = new Intl.ListFormat('en', { type: 'conjunction' });
const orList = new Intl.ListFormat('en', { type: 'disjunction' });

function wording<T>(map: Record<string, T>, id: string, table: string): T {
  const entry = map[id];
  if (entry === undefined) throw new Error(`${table}: the row "${id}" has no player wording.`);
  return entry;
}

const withNote = (text: string, note: string | null | undefined): Cell => (note ? { text, note } : text);

// ---------------------------------------------------------------- shared lookups

interface RawPosition {
  id: string;
  name: string;
  meaning: string;
}
const positionDoc = parse(positionsText) as { positions: RawPosition[] };
const POSITION_NAMES = new Map(positionDoc.positions.map((p) => [p.id, p.name]));

function position(id: string, table: string): string {
  const name = POSITION_NAMES.get(id);
  if (!name) throw new Error(`${table}: no Position "${id}".`);
  return name;
}

const catalogDoc = parse(catalogText) as { entries: { id: string; name: string }[] };
const ENTRY_NAMES = new Map(catalogDoc.entries.map((e) => [e.id, e.name]));

function entryName(id: string, table: string): string {
  const name = ENTRY_NAMES.get(id);
  if (!name) throw new Error(`${table}: no Action Catalog entry "${id}".`);
  return name;
}

// ---------------------------------------------------------------- the Positions

/** What each Position means, written for players. The table's own wording cites draft chapters. */
const POSITION_WORDING: Record<string, string> = {
  distant: "Out of a standing Titan's reach. A few behaviors still reach you here.",
  'in-reach': "Within reach of its hands, on the ground or on anchors beside it.",
  'on-body': 'Hooked into the Titan or standing on it, anywhere but the Nape.',
  'blind-spot':
    "Out of its sight with its Nape within reach. You are anchored to terrain behind the Titan, a tree or a roof, and you are not touching it: Blind Spot is a place in the world, not a place on the monster. The only Position a Nape strike is made from.",
};

/** The icon for each Position, from the site's Position set. */
export const POSITION_ICONS: Record<string, string> = {
  distant: 'pos-distant',
  'in-reach': 'pos-in-reach',
  'on-body': 'pos-on-body',
  'blind-spot': 'pos-blind-spot',
};

export function positionsTable(): CoreTableData {
  const T = 'Positions';
  return {
    caption: 'The four Positions',
    note: 'You hold one Position relative to each Focus Titan, and one relative to each corpse on the field. On Body means on the Titan. Blind Spot does not.',
    columns: ['Position', 'Where you are'],
    see: false,
    groups: [
      {
        rows: positionDoc.positions.map((p) => ({
          cells: [p.name, wording(POSITION_WORDING, p.id, T)],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- what changes a Position

interface RawPositionChange {
  id: string;
  what: string;
  effect: string;
}

/**
 * What each entry of the closed list does, written for players. The list, its order, and the
 * principle at its head come from the Positions table; a new entry with no wording fails the build.
 */
const POSITION_CHANGE_WORDING: Record<string, string> = {
  'own-move': 'One step the ground allows, or a mount, a dismount, or leaving. An ODM move is a Flight, and crosses two steps only by spending Momentum on Carry.',
  'letting-go': 'Taken instead of a move: you fall, and land In Reach.',
  fall: 'Any fall from On Body or Blind Spot leaves you In Reach of the Titan the fall is read against. From further out, your Position holds.',
  'fear-roll-forced-move': 'One step at the start of your next turn. It is the result moving you, not a move of your own.',
  'grab-lands': 'The Grabbed soldier holds On Body relative to the hand that holds them.',
  'freed-from-a-grab': 'In Reach, with a fall first if you had already been lifted.',
  'knock-loose': 'A target who is airborne or on the body falls, and lands In Reach.',
  'close-rule': "Coming to On Body or Blind Spot on one Titan makes every other Titan's On Body or Blind Spot read In Reach.",
  'titan-becomes-focus': 'Everyone holding a Position holds Distant relative to it.',
  'focus-titan-dies': 'Your Positions carry over to its corpse, with On Body and Blind Spot reading In Reach.',
  'fall-back': 'At the Wings step, each soldier on the body or at Blind Spot may take In Reach instead, their own choice. It is not a fall and it is not ODM use.',
  'titan-stands-up': 'On Open ground only: a Titan that gets its legs back has no Blind Spot to stand behind, so a soldier there holds On Body instead. Everywhere else you keep the Position you hold.',
  carried: 'You move with whoever carries you, and your own move changes nothing.',
  'placement-leaving-returning-retreat': 'As each rule states. A retreat narrows the move you may make; it moves nobody by itself.',
};

const positionChangeDoc = parse(positionsText) as {
  changes_to_position: { list: RawPositionChange[] };
};

export function positionChangesTable(): CoreTableData {
  const T = 'What changes a Position';
  return {
    caption: 'Everything that changes a Position',
    note: 'A closed list. An action is never on it: nothing you roll moves you, whatever it rolls.',
    columns: ['What', 'Where it leaves you'],
    see: false,
    groups: [
      {
        rows: positionChangeDoc.changes_to_position.list.map((change) => ({
          cells: [change.what, wording(POSITION_CHANGE_WORDING, change.id, T)],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- Position steps

interface RawStep {
  between: [string, string];
  on_foot: boolean;
  mounted: boolean;
  odm: boolean;
}
interface RawRating {
  id: string;
  name: string;
  meaning: string;
  anchors: number;
  terrain_trait: string;
  steps: RawStep[];
}

/** Each Anchor Rating in a sentence a player can picture. */
const RATING_WORDING: Record<string, string> = {
  open: 'Flat ground with nothing to anchor to but the Titan itself.',
  sparse: 'A few anchors: scattered trees, a ruined farmstead, a supply wagon.',
  wooded: 'Ordinary woodland. The Survey Corps fights here most often.',
  urban: 'Streets and rooftops, inside or beyond the Walls.',
  'giant-forest': 'Trees taller than any Titan. Every fall that is not from a horse is one band worse here.',
};

export function positionStepsTable(): CoreTableData {
  const doc = parse(anchorText) as { ratings: RawRating[] };
  const T = 'Position steps';
  return {
    caption: 'Position steps by Anchor Rating',
    note: 'Two Positions joined by a row are one Position step apart, whichever kinds of move can make it. A step can be made either way. No step asks for a roll of its own: every ODM move is a Flight, and a move that crosses two steps spends Momentum on Carry.',
    columns: ['Position step', 'On foot', 'Mounted', 'ODM'],
    see: false,
    groups: doc.ratings.map((rating) => ({
      heading: `${rating.name}: ${wording(RATING_WORDING, rating.id, T)}`,
      rows: rating.steps.map((step) => ({
        cells: [
          `${position(step.between[0], T)} to ${position(step.between[1], T)}`,
          step.on_foot ? 'Yes' : 'No',
          step.mounted ? 'Yes' : 'No',
          step.odm ? 'Yes' : 'No',
        ] as Cell[],
      })),
    })),
  };
}

// ---------------------------------------------------------------- Anchors, Terrain Traits, Momentum

interface RawSpend {
  id: string;
  cost: number;
  effect: string;
  giant_forest?: string;
}

/** What the ground gives a soldier on the wires, one line per rating. */
const TERRAIN_WORDING: Record<string, string> = {
  open: 'A mounted soldier’s Break Attention gains 1 Bonus Die. The plain is the horse’s.',
  sparse: 'The first Anchor wrecked in the fight is not lost. One good tree survives.',
  wooded: 'None. This is the plain baseline every other rating is read against.',
  urban: 'A soldier at Blind Spot is anchored to a roof and is not airborne, so a Jam does not drop them.',
  'giant-forest': 'The first step a Flight Carries costs no Momentum. The Corps fights best here.',
};

export function anchorsTable(): CoreTableData {
  const doc = parse(anchorText) as { ratings: RawRating[] };
  const T = 'Anchors';
  return {
    caption: 'Anchors and Terrain Traits by Anchor Rating',
    note: 'The Anchors are the fight’s own pool, public and never restored. However many are left is every soldier’s Momentum cap.',
    columns: ['Anchor Rating', 'Anchors', 'Terrain Trait'],
    see: false,
    groups: [
      {
        rows: doc.ratings.map((rating) => ({
          cells: [rating.name, String(rating.anchors), wording(TERRAIN_WORDING, rating.id, T)] as Cell[],
        })),
      },
    ],
  };
}

/** What each point of Momentum buys, in the order the table lists it. */
const SPEND_WORDING: Record<string, { name: string; effect: string }> = {
  carry: {
    name: 'Carry',
    effect: 'One more Position step on this move, along steps your kind of move could make, relative to the same Titan. You may Carry more than once on one move.',
  },
  bite: { name: 'Bite', effect: '1 Bonus Die on a strike or a Break Attention you take this turn against the Titan you flew relative to.' },
  brace: { name: 'Brace', effect: '1 Bonus Die on your next dodge this round.' },
  quiet: { name: 'Quiet', effect: 'You set no mark this turn, the loudest mark a Flight with no successes would set included. A mark already set is not cleared.' },
  'clean-line': { name: 'Clean line', effect: 'You make no Gas Roll for this round.' },
};

export function momentumTable(): CoreTableData {
  const doc = parse(anchorText) as { momentum: { spends: { list: RawSpend[] } } };
  const T = 'Momentum';
  return {
    caption: 'What you spend Momentum on',
    note: 'Any amount at any point in your own turn. Carry is spent as part of the move it extends; every other spend is declared before the roll it names.',
    columns: ['Spend', 'Cost', 'What it buys'],
    see: false,
    groups: [
      {
        rows: doc.momentum.spends.list.map((spend) => {
          const w = wording(SPEND_WORDING, spend.id, T);
          return { cells: [w.name, String(spend.cost), spend.giant_forest ? { text: w.effect, note: 'At Giant Forest the first step a Flight Carries costs nothing.' } : w.effect] as Cell[] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Titans by Size Class

interface RawSizeClass {
  id: string;
  name: string;
  height: string;
  tempo: number;
  nape_depth: number;
  regeneration_clock: number;
  toughness: Record<string, number>;
  attack_dice: Record<string, number>;
  raises_fall_band: boolean;
  heave: number;
}

/** The Body Part kinds a Toughness column can name. */
const TOUGHNESS_COLUMNS: Record<string, string> = { eyes: 'Eyes', arm: 'Arm', leg: 'Leg' };
/** The tiers an Attack Dice column can name. */
const TIER_COLUMNS: Record<string, string> = { terrorize: 'Terrorize', control: 'Control', kill: 'Kill' };

const sizeDoc = () => parse(sizesText) as { classes: RawSizeClass[] };

export function titanSizesTable(): CoreTableData {
  const doc = sizeDoc();
  const T = 'Size Classes';
  const kinds = Object.keys(doc.classes[0].toughness);
  for (const kind of kinds) wording(TOUGHNESS_COLUMNS, kind, T);
  return {
    caption: 'What a standard Titan takes from its Size Class',
    note: 'An Abnormal lists its own numbers, and keeps some of them hidden until a Read.',
    columns: ['Size Class', 'Height', 'Tempo', 'Nape Depth', 'Regeneration', 'Heave rating', ...kinds.map((k) => `${TOUGHNESS_COLUMNS[k]} Toughness`)],
    see: false,
    groups: [
      {
        rows: doc.classes.map((c) => {
          if (Object.keys(c.toughness).length !== kinds.length) throw new Error(`${T}: "${c.id}" rates a different set of Body Part kinds.`);
          return {
            cells: [
              withNote(c.name, c.raises_fall_band ? 'Every fall from a Position held relative to it is one band worse.' : null),
              c.height,
              `${c.tempo} card${c.tempo === 1 ? '' : 's'} a round`,
              String(c.nape_depth),
              `${c.regeneration_clock} segments`,
              String(c.heave),
              ...kinds.map((k) => String(c.toughness[k])),
            ] as Cell[],
          };
        }),
      },
    ],
  };
}

export function titanAttackDiceTable(): CoreTableData {
  const doc = sizeDoc();
  const T = 'Attack Dice';
  const tiers = Object.keys(doc.classes[0].attack_dice);
  for (const tier of tiers) wording(TIER_COLUMNS, tier, T);
  return {
    caption: "A standard Titan's Attack Dice",
    note: 'Thrash rolls the control pool. An entry whose only effect is a telegraph rolls nothing.',
    columns: ['Size Class', ...tiers.map((t) => TIER_COLUMNS[t])],
    see: false,
    groups: [
      {
        rows: doc.classes.map((c) => {
          if (Object.keys(c.attack_dice).length !== tiers.length) throw new Error(`${T}: "${c.id}" rates a different set of tiers.`);
          return { cells: [c.name, ...tiers.map((t) => String(c.attack_dice[t]))] as Cell[] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- tiers and effects

interface RawTierRule {
  effects_allowed: string[];
  critical_injury?: string;
  grab?: string;
}

/** Names for the effect types, used in the tier table and the effects table. */
const EFFECT_NAMES: Record<string, string> = {
  stress: 'Stress',
  telegraph: 'a telegraph',
  'knock-loose': 'a knock loose',
  'critical-injury': 'a Critical Injury',
  grab: 'a Grab',
  wreck: 'a wreck',
};

/** What each effect does to a soldier the behavior lands on. */
const EFFECT_WORDING: Record<string, string> = {
  stress: 'You gain that much Stress, once, whatever the Net Successes.',
  'critical-injury':
    'A Titan attack at the location and of the type the entry lists, lethal or not as it lists. Its roll adds 1 for each Net Success beyond the first.',
  'knock-loose': 'If you are airborne, or hold On Body or Blind Spot relative to it, you fall. A mounted soldier is not affected. The fall is the same whatever the Net Successes.',
  grab: "Its hand closes on you. The Grab is the same whatever the Net Successes.",
  telegraph: 'Its next move is revealed to every soldier. It happens whether the behavior landed or whiffed.',
  wreck: 'Nothing, to you. The fight loses 1 Anchor, so every soldier’s Momentum cap drops. It happens whether the behavior landed or whiffed, because it is the Titan going through the place rather than a blow at a person.',
};

/** The limit each tier carries beyond the effects it may use. */
const TIER_LIMIT_WORDING: Record<string, string> = {
  terrorize: 'Nothing else. It frightens you and shows you what is coming.',
  control: 'No Critical Injury it inflicts can be lethal.',
  kill: 'A Critical Injury it inflicts can be lethal. Only this tier Grabs, and a Grab entry inflicts nothing else.',
  thrash: 'It works at any Position, needs no Body Part, and nothing it inflicts is lethal.',
};

const TIER_RESULTS: Record<string, string> = {
  terrorize: '1 and 2',
  control: '3 and 4',
  kill: '5 and 6',
  thrash: 'Never rolled',
};

export function behaviorTiersTable(): CoreTableData {
  const doc = parse(titanFormatText) as { tier_rules: Record<string, RawTierRule> };
  const T = 'Behavior tiers';
  const tiers = Object.entries(doc.tier_rules).filter(([id]) => id !== 'every_entry');
  return {
    caption: 'What each tier can do',
    note: "A Behavior Table's results rise through the tiers. Every table has one Thrash entry, which is what the Titan does when nothing else can happen.",
    columns: ['Tier', 'D6', 'Effects it may use', 'Limit'],
    see: false,
    groups: [
      {
        rows: tiers.map(([id, rule]) => ({
          cells: [
            id.charAt(0).toUpperCase() + id.slice(1),
            wording(TIER_RESULTS, id, T),
            andList.format(rule.effects_allowed.map((e) => wording(EFFECT_NAMES, e, T))),
            wording(TIER_LIMIT_WORDING, id, T),
          ] as Cell[],
        })),
      },
    ],
  };
}

export function behaviorEffectsTable(): CoreTableData {
  const doc = parse(titanFormatText) as { effect_types: { id: string }[] };
  const T = 'Behavior effects';
  const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    caption: 'The effects a behavior can have',
    note: 'A closed list. Nothing a Titan does to you is outside it.',
    columns: ['Effect', 'What it does to a soldier it lands on'],
    see: false,
    groups: [
      {
        rows: doc.effect_types.map((e) => ({
          cells: [capital(wording(EFFECT_NAMES, e.id, T).replace(/^an? /, '')), wording(EFFECT_WORDING, e.id, T)],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- Attention

interface RawTest {
  id: string;
  meaning: string;
  down_can_meet: boolean;
}
interface RawLadder {
  id: string;
  name: string;
  rungs: string[];
}
interface RawFlag {
  id: string;
  set_when: string;
}

/** Each rung of a ladder, named and explained for players. */
const TEST_WORDING: Record<string, { name: string; meaning: string }> = {
  'hooked-into-its-body': { name: 'Hooked into its body', meaning: 'You hold On Body relative to it, or you are marked hooked in by a strike.' },
  'nearest-person-in-reach': { name: 'Nearest person in reach', meaning: 'You hold In Reach relative to it.' },
  'just-hurt-it': { name: 'Just hurt it', meaning: 'You are marked as having just hurt it.' },
  'loudest-or-brightest': { name: 'Loudest or brightest', meaning: 'You are marked loudest.' },
  nearest: { name: 'Nearest', meaning: 'You are at the closest Position anyone still in the running holds, in the order On Body, In Reach, Blind Spot, Distant.' },
  'current-holder': { name: 'Still on you', meaning: 'You already hold its Attention and are not at Distant. Only an Abnormal turns on this.' },
  mounted: { name: 'Mounted', meaning: 'You are on your horse. Only an Abnormal turns on this.' },
  airborne: { name: 'Airborne', meaning: 'You are in the air on your lines. Only an Abnormal turns on this.' },
  'carrying-a-comrade': { name: 'Carrying a comrade', meaning: 'You are carrying someone. Only an Abnormal turns on this.' },
  'most-harmed': { name: 'Most harmed', meaning: 'You carry the most untreated Critical Injuries of anyone in the running. Only an Abnormal turns on this.' },
  down: { name: 'Down', meaning: 'You are Down. Only an Abnormal turns on this.' },
};

/** Each mark a soldier can carry, and what sets it. */
const FLAG_WORDING: Record<string, { name: string; set: string }> = {
  'hooked-by-strike': { name: 'Hooked in by a strike', set: 'You make a Nape strike against it, whatever the result.' },
  'just-hurt': { name: 'Just hurt it', set: 'You make a Body Part strike against it with at least 1 success.' },
  loudest: {
    name: 'Loudest',
    set: 'You take Draw Attention against it, never from Distant, or a Fear Roll result sets it for you. A Flight with no successes sets it from any Position, Distant included, and so may a mounted charge. Momentum spent on Quiet stops it.',
  },
};

const attentionDoc = () =>
  parse(attentionText) as {
    tests: RawTest[];
    ladders: RawLadder[];
    flags: RawFlag[];
    break_attention: {
      needs: Record<string, number>;
      decoys: { id: string; name: string; requirement: string; spends_when_declared: string; on_success: string }[];
    };
  };

export function attentionLadderTable(): CoreTableData {
  const doc = attentionDoc();
  const T = 'Attention Ladder';
  const tests = new Map(doc.tests.map((t) => [t.id, t]));
  const standard = doc.ladders.find((l) => l.id === 'standard');
  if (!standard) throw new Error(`${T}: there is no standard ladder.`);
  return {
    caption: 'The standard Attention Ladder',
    note: 'Highest rung first. The Titan turns to whoever meets the highest rung anyone meets.',
    columns: ['Rung', 'Who meets it', 'A Down soldier'],
    see: false,
    groups: [
      {
        rows: standard.rungs.map((id, i) => {
          const test = tests.get(id);
          if (!test) throw new Error(`${T}: the standard ladder names a rung "${id}" that does not exist.`);
          const w = wording(TEST_WORDING, id, T);
          return {
            cells: [`${i + 1}. ${w.name}`, w.meaning, test.down_can_meet ? 'Can meet it' : 'Never meets it'],
          };
        }),
      },
    ],
  };
}

export function attentionFlagsTable(): CoreTableData {
  const doc = attentionDoc();
  const T = 'Attention marks';
  return {
    caption: 'The three marks',
    note: "Every mark is public, sits on you for one Titan, and lasts until the end of that Titan's next card that resolves a behavior.",
    columns: ['Mark', 'You set it when'],
    see: false,
    groups: [
      {
        rows: doc.flags.map((f) => {
          const w = wording(FLAG_WORDING, f.id, T);
          return { cells: [w.name, w.set] };
        }),
      },
    ],
  };
}

/** The Break Attention needs, in the order the table lists them. */
const NEED_WORDING: Record<string, string> = {
  holder: 'You hold the Titan’s Attention',
  anyone_else: 'Anyone else, including while nothing holds it',
  titan_holds_a_grabbed_soldier: 'The Titan holds a Grabbed soldier, whoever rolls',
  feint_extra: 'Add for a Feint',
  per_decoy_in_a_row: 'Add for each of its decoys in a row',
};
const NEED_ADDED = new Set(['feint_extra', 'per_decoy_in_a_row']);

export function breakAttentionNeedsTable(): CoreTableData {
  const doc = attentionDoc();
  const T = 'Break Attention';
  return {
    caption: 'Successes a Break Attention needs',
    note: 'Take the first line that fits, then add the lines below it that apply.',
    columns: ['Case', 'Successes'],
    see: false,
    groups: [
      {
        rows: Object.entries(doc.break_attention.needs).map(([id, value]) => ({
          cells: [wording(NEED_WORDING, id, T), NEED_ADDED.has(id) ? `+${value}` : String(value)],
        })),
      },
    ],
  };
}

/** Each decoy, written for players. The table's own wording cites gear and Titan files. */
const DECOY_WORDING: Record<string, { needs: string; spends: string; also: string }> = {
  flare: {
    needs: 'A flare in Squad Supply, and the Titan’s eyes not Broken.',
    spends: 'The flare, as you declare it.',
    also: 'Fills 1 segment of every Background Titan’s clock once the Break Attention is fully resolved, whether it succeeded or not.',
  },
  'riderless-horse': {
    needs: 'Your own horse, not lame, with you mounted on it or the horse at your Position. It works against Broken eyes.',
    spends: 'Nothing as you declare it.',
    also: 'On a success you are dismounted with no fall and the horse bolts. It leaves the fight: no Position, no Gear Dice, and it cannot be sent again.',
  },
  'thrown-cloak': {
    needs: 'You at On Body or Blind Spot, your cloak not yet thrown, and the Titan’s eyes not Broken.',
    spends: 'Your cloak, for the rest of the fight.',
    also: 'Once per fight, because the cloak is gone either way.',
  },
  feint: {
    needs: 'You at In Reach or On Body, with working ODM Gear, or mounted on your own sound horse, or on foot against a grounded Titan. It works against Broken eyes.',
    spends: 'Nothing, ever.',
    also: 'Needs 1 success more than the case above. Its Gear Dice come from that ODM Gear or that horse; on foot against a grounded Titan it is Perception alone, with no Gas Roll and no wear. Name your way before rolling.',
  },
};

export function decoysTable(): CoreTableData {
  const doc = attentionDoc();
  const T = 'Decoys';
  return {
    caption: 'The four decoys',
    note: 'Name one before you roll, and meet its requirement. No decoy can be laid over one that already holds.',
    columns: ['Decoy', 'What it needs', 'What it spends', 'And'],
    see: false,
    groups: [
      {
        rows: doc.break_attention.decoys.map((d) => {
          const w = wording(DECOY_WORDING, d.id, T);
          return { cells: [d.name, w.needs, w.spends, w.also] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- harming Titans

interface RawBodyPartKind {
  id: string;
  strike_from: string[];
  when_broken: string;
}

/** Each Body Part kind, named for players, with what Breaking it does. */
const BODY_PART_WORDING: Record<string, { name: string; broken: string }> = {
  eyes: { name: 'Eyes', broken: 'Flares and thrown cloaks no longer work as decoys against it.' },
  arm: { name: 'Arm', broken: 'A Broken arm cannot Grab, and frees any soldier it holds.' },
  leg: { name: 'Leg', broken: 'The Titan is grounded.' },
};

const harmDoc = () =>
  parse(titanHarmText) as {
    body_part_kinds: RawBodyPartKind[];
    steam: { table: { roll: string; rows: { results: { min: number | null; max: number | null }; damage: number }[] } };
  };

export function bodyPartsTable(): CoreTableData {
  const doc = harmDoc();
  const T = 'Body Parts';
  return {
    caption: 'Body Parts and where they are struck from',
    note: 'A Body Part strike is Strength with Gear Dice from a Blade Set. Each success adds 1 to the part’s count; when the count reaches its Toughness, the part moves one state toward Broken and the count returns to 0.',
    columns: ['Kind', 'Struck from', 'Broken'],
    see: false,
    groups: [
      {
        rows: doc.body_part_kinds.map((kind) => {
          const w = wording(BODY_PART_WORDING, kind.id, T);
          return { cells: [w.name, orList.format(kind.strike_from.map((p) => position(p, T))), w.broken] };
        }),
      },
    ],
  };
}

/** "3 or less", "4 to 5", "6 or more" for a steam row whose ends may be open. */
function resultBand(min: number | null, max: number | null): string {
  if (min == null && max == null) throw new Error('A steam row has no bounds.');
  if (min == null) return `${max} or less`;
  if (max == null) return `${min} or more`;
  return min === max ? String(min) : `${min} to ${max}`;
}

export function steamTable(): CoreTableData {
  const doc = harmDoc();
  const table = doc.steam.table;
  return {
    caption: `Steam (${table.roll})`,
    note: 'Burn damage. It rolls no Attack Dice, and no Reaction answers it.',
    columns: [table.roll, 'Damage'],
    see: false,
    roll: true,
    groups: [
      {
        rows: table.rows.map((row) => ({
          cells: [resultBand(row.results.min, row.results.max), row.damage === 0 ? 'None' : String(row.damage)],
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------- Pinned

interface RawPinned {
  allowed_entries: string[];
  forbids_entries: string[];
  body_part_strike?: string;
}

const PIN_WORDING: Record<string, { name: string; note: string }> = {
  limb_pin: { name: 'Limb pin', note: 'An arm or leg result. It forbids Covering and Reactions.' },
  body_pin: { name: 'Body pin', note: 'A torso or head result. It forbids Help, Covering, and Reactions, and you are not standing.' },
};
/** Notes an allowed entry carries under a pin. */
const PIN_ENTRY_NOTES: Record<string, string> = {
  'body-part-strike': ' (only against the Body Part that pins you)',
};

export function pinnedEntriesTable(): CoreTableData {
  const doc = parse(harmEffectsText) as { pinned: Record<string, RawPinned> };
  const T = 'Pinned';
  const pins = Object.entries(doc.pinned).filter(([id]) => id in PIN_WORDING);
  if (pins.length === 0) throw new Error(`${T}: no pin kinds have player wording.`);
  return {
    caption: 'What a Pinned soldier can still do',
    note: 'Help, Covering, and Reactions are set by the pin itself.',
    columns: ['Pin', 'You may still take', 'You cannot take'],
    see: false,
    groups: [
      {
        rows: pins.map(([id, pin]) => {
          const w = wording(PIN_WORDING, id, T);
          const name = (entryId: string) => `${entryName(entryId, T)}${PIN_ENTRY_NOTES[entryId] ?? ''}`;
          return {
            cells: [
              { text: w.name, note: w.note },
              pin.allowed_entries.map(name).join(', '),
              pin.forbids_entries.map((e) => entryName(e, T)).join(', '),
            ] as Cell[],
          };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Read and Call It

interface RawFact {
  id: string;
  for: string[];
  reveals: string;
  stays_revealed: string;
}

const FACT_WORDING: Record<string, { name: string; reveals: string }> = {
  'next-behavior': {
    name: 'The Next Behavior',
    reveals: 'In full: its name, tier, targets, the Position it needs, the Body Parts it uses, its Attack Dice, its effects, and its fallback. Its Severity comes only when the card rolls.',
  },
  'body-part': { name: 'A Body Part’s Toughness', reveals: 'The Toughness of one Body Part you name.' },
  'nape-depth': { name: 'Its Nape Depth', reveals: 'The successes one Nape strike needs to kill it.' },
  'regeneration-clock': { name: 'Its Regeneration clock', reveals: 'How many segments the clock has.' },
  'attention-ladder': { name: 'Its Attention Ladder', reveals: 'The ladder it uses, with its rungs in order.' },
};
const FACT_FOR_WORDING: Record<string, string> = { standard: 'Any Titan', abnormal: 'An Abnormal only' };
const FACT_STAYS_WORDING: Record<string, string> = {
  'next-behavior': 'Until a card resolves it, or a decoy’s card spends it',
  'body-part': 'The rest of the fight',
  'nape-depth': 'The rest of the fight',
  'regeneration-clock': 'The rest of the fight',
  'attention-ladder': 'The rest of the fight',
};

export function readFactsTable(): CoreTableData {
  const doc = parse(readText) as { facts: RawFact[]; read: { needs: number } };
  const T = 'Read';
  return {
    caption: 'What a Read can learn',
    note: `A Read needs ${doc.read.needs} success. For each success you pick one fact, each once per Read, and the GM reveals it to every soldier.`,
    columns: ['Fact', 'What you learn', 'For', 'It stands'],
    see: false,
    groups: [
      {
        rows: doc.facts.map((f) => {
          const w = wording(FACT_WORDING, f.id, T);
          const forWhich = f.for.includes('standard') ? FACT_FOR_WORDING.standard : FACT_FOR_WORDING.abnormal;
          for (const kind of f.for) wording(FACT_FOR_WORDING, kind, T);
          return { cells: [w.name, w.reveals, forWhich, wording(FACT_STAYS_WORDING, f.id, T)] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- the Grab

interface RawEscape {
  id: string;
  who: string;
  needs?: number;
  lifted_penalty?: number;
  reach_before_lift?: string[];
  reach_after_lift?: string[];
  successes_to_free?: string;
}

const ESCAPE_WORDING: Record<string, { name: string; who: string; needs: (e: RawEscape, t: string) => string }> = {
  'break-free': {
    name: 'Break Free',
    who: 'The Grabbed soldier, if not Down',
    needs: (e) => `${e.needs} successes. Strength with Gear Dice from a Blade Set, and Help as usual.`,
  },
  'pry-loose': {
    name: 'Pry Loose',
    who: 'A comrade with the Pry Loose Talent, at On Body',
    needs: (e) => `${e.needs} successes, rolled on your behalf with their own pool.`,
  },
  'strike-the-holding-arm': {
    name: 'Strike the holding arm',
    who: 'Anyone not Grabbed',
    needs: (e) => `${e.successes_to_free} The arm’s Toughness is 1 while it holds you.`,
  },
  'break-attention': {
    name: 'Break Attention',
    who: 'Anyone who can take it',
    needs: () => '2 successes, 1 more for a Feint, plus 1 for each of the Titan’s decoys in a row.',
  },
  'titan-dies': {
    name: 'Kill the Titan',
    who: 'Whoever cuts the Nape',
    needs: () => 'Its Nape Depth, in one strike.',
  },
};

/** What the lift changes for each way out. A way the lift does not touch says so. */
const ESCAPE_LIFT_WORDING: Record<string, { before: string; after: string }> = {
  'break-free': { before: 'No penalty', after: '2-die penalty' },
  'pry-loose': { before: 'No penalty', after: '2-die penalty' },
  'strike-the-holding-arm': { before: 'From In Reach, On Body, or Blind Spot. No penalty', after: 'From On Body or Blind Spot only. No penalty' },
  'break-attention': { before: 'Frees you', after: 'Frees you' },
  'titan-dies': { before: 'Frees you', after: 'Frees you' },
};

export function grabEscapesTable(): CoreTableData {
  const doc = parse(grabText) as { escapes: RawEscape[] };
  const T = 'The Grab';
  return {
    caption: 'Every way out of a Grab',
    note: 'There are no others. Each is taken as its own action, on the turn of whoever takes it.',
    columns: ['Way out', 'Who', 'What it takes', 'Before the lift', 'After the lift'],
    see: false,
    groups: [
      {
        rows: doc.escapes.map((e) => {
          const w = wording(ESCAPE_WORDING, e.id, T);
          const lift = wording(ESCAPE_LIFT_WORDING, e.id, T);
          // The reach columns are read from the table, so a change there fails the wording check.
          if (e.reach_before_lift && !lift.before.includes(position(e.reach_before_lift[0], T))) {
            throw new Error(`${T}: the reach of "${e.id}" before the lift no longer matches its player wording.`);
          }
          if (e.reach_after_lift && !lift.after.includes(position(e.reach_after_lift[0], T))) {
            throw new Error(`${T}: the reach of "${e.id}" after the lift no longer matches its player wording.`);
          }
          if (e.lifted_penalty && !lift.after.includes(String(e.lifted_penalty))) {
            throw new Error(`${T}: the lifted penalty of "${e.id}" no longer matches its player wording.`);
          }
          return { cells: [w.name, w.who, w.needs(e, T), lift.before, lift.after] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- Squad Tactics

interface RawTactic {
  id: string;
  name: string;
  condition: string;
  declared_by: string;
  when: string;
  effect: string;
}

const TACTIC_WORDING: Record<string, { condition: string; declared: string; effect: string; icon: string }> = {
  'hook-and-cut': {
    condition: 'A Break Attention against a Focus Titan has just succeeded, and a comrade at Blind Spot relative to that Titan is neither Down nor Grabbed, has an unspent action this round, and meets the Nape strike’s requirements, with no retreat under way.',
    declared: 'That comrade’s player, once every step of the Break Attention is resolved, a freed soldier’s release included, and before any other rule acts.',
    effect: 'That comrade strikes the Nape at once, spending their action, whether or not their card has come up. They may spend the Openings the Break Attention created.',
    icon: 'tactic-hook-and-cut',
  },
  'hamstring-line': {
    condition: 'A soldier declares a Body Part strike against a leg, and at least one comrade Helps it.',
    declared: 'The striker’s player, after every Help is declared and before the roll.',
    effect: 'If the strike has at least 1 success, it gains 1 more.',
    icon: 'tactic-hamstring-line',
  },
  'clear-the-hand': {
    condition: 'A soldier has been Grabbed and lifted, and a comrade declares a strike on the holding arm that only this tactic allows.',
    declared: 'That comrade’s player, as the strike is declared.',
    effect: 'Until that Grab ends, every strike on the holding arm can also be made from In Reach, and none needs working ODM Gear.',
    icon: 'tactic-clear-the-hand',
  },
  'fall-back': {
    condition: 'The wings step begins, with a soldier at On Body or Blind Spot relative to a Focus Titan who is not Down, Grabbed, or carried.',
    declared: 'Any such soldier’s player, before Wings are assigned or kept.',
    effect: 'Each such soldier may hold In Reach relative to that Titan instead, and each player chooses for their own soldier. The change is made by this rule, not by the soldier’s own move: it is not a fall, it is not ODM use, and it leaves you airborne or not exactly as you were.',
    icon: 'tactic-fall-back',
  },
};

/** The icon for each Squad Tactic, for the page's card list. */
export function squadTacticIcons(): { slug: string; name: string; icon: string }[] {
  const doc = parse(squadTacticsText) as { tactics: RawTactic[] };
  return doc.tactics.map((t) => ({ slug: t.id, name: t.name, icon: wording(TACTIC_WORDING, t.id, 'Squad Tactics').icon }));
}

/** What each Squad Tactic is for, as a filter chip. */
const TACTIC_KINDS: Record<string, { slug: string; name: string; order: number }> = {
  'hook-and-cut': { slug: 'attack', name: 'Setting up a cut', order: 1 },
  'hamstring-line': { slug: 'attack', name: 'Setting up a cut', order: 1 },
  'clear-the-hand': { slug: 'rescue', name: 'Getting a comrade out', order: 2 },
  'fall-back': { slug: 'ground', name: 'Getting off the body', order: 3 },
};

export interface SquadTacticEntry {
  slug: string;
  name: string;
  icon: string;
  condition: string;
  declared: string;
  effect: string;
  kind: { slug: string; name: string; order: number };
  search: string;
}

/** Every Squad Tactic as a Compendium card, in the table's order. */
export function squadTacticEntries(): SquadTacticEntry[] {
  const doc = parse(squadTacticsText) as { tactics: RawTactic[] };
  return doc.tactics.map((t) => {
    const w = wording(TACTIC_WORDING, t.id, 'Squad Tactics');
    return {
      slug: t.id,
      name: t.name,
      icon: w.icon,
      condition: w.condition,
      declared: w.declared,
      effect: w.effect,
      kind: wording(TACTIC_KINDS, t.id, 'Squad Tactics'),
      search: [t.name, w.condition, w.effect].join(' '),
    };
  });
}

/** How many Squad Tactics a Squad holds. */
export function squadTacticsHeld(): number {
  const doc = parse(squadTacticsText) as { rules: { held: string } };
  const found = /holds (\d+) Squad Tactics/.exec(doc.rules.held);
  if (!found) throw new Error('Squad Tactics: how many a Squad holds is no longer stated.');
  return Number(found[1]);
}

export function squadTacticsTable(): CoreTableData {
  const doc = parse(squadTacticsText) as { rules: { held: string }; tactics: RawTactic[] };
  const T = 'Squad Tactics';
  return {
    caption: 'Squad Tactics',
    note: 'Your Squad holds two, chosen together before its first Titan Engagement. Each can be used once per Titan Engagement.',
    columns: ['Tactic', 'Condition', 'Declared by, and when', 'Effect'],
    see: false,
    groups: [
      {
        rows: doc.tactics.map((t) => {
          const w = wording(TACTIC_WORDING, t.id, T);
          return { cells: [t.name, w.condition, w.declared, w.effect] };
        }),
      },
    ],
  };
}

// ---------------------------------------------------------------- the table registry

export const ENGAGEMENT_TABLES = {
  positions: positionsTable,
  'position-changes': positionChangesTable,
  'position-steps': positionStepsTable,
  anchors: anchorsTable,
  momentum: momentumTable,
  'titan-sizes': titanSizesTable,
  'titan-attack-dice': titanAttackDiceTable,
  'behavior-tiers': behaviorTiersTable,
  'behavior-effects': behaviorEffectsTable,
  'attention-ladder': attentionLadderTable,
  'attention-marks': attentionFlagsTable,
  'break-attention-needs': breakAttentionNeedsTable,
  decoys: decoysTable,
  'body-parts': bodyPartsTable,
  steam: steamTable,
  pinned: pinnedEntriesTable,
  'read-facts': readFactsTable,
  'grab-escapes': grabEscapesTable,
  'squad-tactics': squadTacticsTable,
} satisfies Record<string, () => CoreTableData>;

export type EngagementTableId = keyof typeof ENGAGEMENT_TABLES;

// ---------------------------------------------------------------- the round

/** Each step of a round and of the end steps, in the table's order, written for players. */
const ROUND_STEP_WORDING: Record<string, { title: string; text: string; icon: string; exit?: { kind: 'stop' | 'note' | 'cover'; label: string; text: string } }> = {
  wings: {
    title: 'Wings.',
    icon: 'ph:users-three',
    text: 'Assign each Squadmate to one player character’s Wing, or to none. A Wing holds at most one Squadmate. Wings may be changed at a later wings step only if, since the last one, a soldier died, left, went Down, or was Grabbed, or a Focus Titan entered or died.',
    exit: { kind: 'note', label: 'Fall Back', text: 'This is the moment the Fall Back Squad Tactic is declared, before Wings are assigned or kept.' },
  },
  deal: {
    title: 'Deal.',
    icon: 'ph:cards',
    text: 'Twenty cards numbered 1 to 20, dealt face up: one to each living soldier, except a Squadmate on a Wing, and as many to each living Focus Titan as its Tempo. No two cards share a number.',
    exit: { kind: 'note', label: 'Still dealt', text: 'A soldier who is Down, Grabbed, carried, or has left still gets a card, because their turns still happen.' },
  },
  swap: {
    title: 'Swap.',
    icon: 'ph:arrows-left-right',
    text: 'Two soldiers who each hold a card, neither Down nor Grabbed, at the same Position or one step apart, or both having left, may exchange cards. Each soldier takes part in at most one swap.',
    exit: { kind: 'stop', label: 'Never', text: 'A Titan’s card is never swapped, and swapping is not an action.' },
  },
  play: {
    title: 'Play the cards, lowest first.',
    icon: 'ph:sort-ascending',
    text: 'On your card you take your turn: one move and one action, in either order, never splitting the move around the action. Then the Squadmate on your Wing takes its turn, even when that turn was spent in advance. On a Focus Titan’s card, the card resolves.',
    exit: { kind: 'cover', label: 'Under a retreat', text: 'The forced move comes first.' },
  },
  end: {
    title: 'End the round.',
    icon: 'ph:hourglass',
    text: 'Work through the end steps below, then begin the next round at its Wings step.',
  },
  'gas-rolls': {
    title: 'Gas Rolls.',
    icon: 'gear-gas-canister',
    text: 'Everyone who used ODM Gear this round rolls, all together. If the fight ends mid-round, these are made at once, before the steps that follow a fight.',
  },
  regeneration: {
    title: 'Regeneration.',
    icon: 'ph:arrow-counter-clockwise',
    text: 'Every living Focus Titan’s Regeneration clock fills 1 segment. This happens in a retreat too.',
  },
  'background-clocks': {
    title: 'Clocks.',
    icon: 'ph:clock-countdown',
    text: 'Every Background Titan’s clock fills 1 segment, and full clocks resolve. Then the retreat clock fills 1 segment, and if it is full the fight becomes a retreat.',
    exit: { kind: 'stop', label: 'In a retreat', text: 'No Background clock fills and the retreat clock does not fill.' },
  },
  momentum: {
    title: 'Momentum.',
    icon: 'ph:wind',
    text: 'Everyone who made no ODM move this round loses all their Momentum. Anyone who flew keeps what they hold, up to the Anchors left.',
    exit: { kind: 'stop', label: 'Keep flying', text: 'A round spent standing still costs you everything you were carrying.' },
  },
  frenzy: {
    title: 'Frenzy.',
    icon: 'ph:flame',
    text: 'Every living Focus Titan gains 1 Frenzy, up to 3. Frenzy is added to its next behavior roll, and every table runs from terrorising to killing.',
    exit: { kind: 'stop', label: 'It gets worse', text: 'Round one it postures. By round three it is trying to kill you. A long fight is a losing one.' },
  },
  'round-ends': {
    title: 'Round ends.',
    icon: 'ph:x-circle',
    text: 'Every move and action left unspent is lost, and every effect that lasts until the end of the round ends.',
  },
};

export interface RoundStep {
  id: string;
  title: string;
  text: string;
  icon: string;
  exit?: { kind: 'stop' | 'note' | 'cover'; label: string; text: string };
}

/** The round's steps and its end steps, in the table's order. */
export function roundSteps(): { round: RoundStep[]; end: RoundStep[] } {
  const doc = parse(roundText) as { round_steps: { id: string }[]; end_steps: { id: string }[] };
  const T = 'The round';
  const step = (s: { id: string }): RoundStep => ({ id: s.id, ...wording(ROUND_STEP_WORDING, s.id, T) });
  return { round: doc.round_steps.map(step), end: doc.end_steps.map(step) };
}

/** The Positions and their step rows, for the Positions map drawing. */
export function positionsMap(): {
  positions: { id: string; name: string; icon: string }[];
  ratings: { id: string; name: string; anchors: number; steps: { from: string; to: string; kinds: string[] }[] }[];
} {
  const doc = parse(anchorText) as { ratings: RawRating[] };
  const T = 'Positions map';
  return {
    positions: positionDoc.positions.map((p) => ({ id: p.id, name: p.name, icon: wording(POSITION_ICONS, p.id, T) })),
    ratings: doc.ratings.map((r) => ({
      id: r.id,
      name: r.name,
      anchors: r.anchors,
      steps: r.steps.map((s) => ({
        from: s.between[0],
        to: s.between[1],
        kinds: [s.on_foot && 'On foot', s.mounted && 'Mounted', s.odm && 'ODM'].filter((k): k is string => Boolean(k)),
      })),
    })),
  };
}

/**
 * The Position maps: the shape the step rows make, one per shape of ground.
 *
 * The named maps, the ground each covers, and the sentence each carries come from the Anchor
 * Ratings table. The nodes and the links are derived here from that same table's own step rows,
 * so a drawn map can never disagree with the rows it is drawn from: a rating whose rows do not
 * match the others its map covers fails the build.
 */
export interface PositionShape {
  id: string;
  name: string;
  /** "chain" or "branch", as the table names it. */
  shape: string;
  anchors: string;
  ratings: string[];
  says: string;
  /** The Positions this ground reaches, in the order a soldier closes on a Titan. */
  nodes: { id: string; name: string; icon: string }[];
  /** Each step row of this ground, as a pair of Position ids. */
  links: { from: string; to: string }[];
  reachesBlindSpot: boolean;
}

export function positionShapes(): PositionShape[] {
  const doc = parse(anchorText) as {
    ratings: RawRating[];
    position_maps: {
      maps: {
        id: string;
        name: string;
        ratings: string[];
        anchors: number | string;
        shape: string;
        reaches_blind_spot: boolean;
        says: string;
      }[];
    };
  };
  const T = 'Position maps';
  const maps = doc.position_maps?.maps;
  if (!Array.isArray(maps) || maps.length === 0) throw new Error(`${T}: the table draws no maps.`);

  /** A ground's step rows as a sorted, comparable list of Position pairs. */
  const edgesOf = (ratingId: string) => {
    const rating = doc.ratings.find((r) => r.id === ratingId);
    if (!rating) throw new Error(`${T}: a map names a ground, "${ratingId}", the table does not rate.`);
    return rating.steps.map((s) => [s.between[0], s.between[1]].sort().join('>')).sort();
  };

  /** Left to right, the way a soldier closes on a Titan. */
  const LANE = ['distant', 'in-reach', 'on-body', 'blind-spot'];

  return maps.map((map) => {
    const edges = edgesOf(map.ratings[0]);
    for (const other of map.ratings.slice(1)) {
      if (edgesOf(other).join('|') !== edges.join('|')) {
        throw new Error(`${T}: "${map.name}" draws one shape for grounds whose step rows differ ("${map.ratings[0]}" and "${other}").`);
      }
    }
    const links = edges
      .map((edge) => {
        const [a, b] = edge.split('>');
        return LANE.indexOf(a) < LANE.indexOf(b) ? { from: a, to: b } : { from: b, to: a };
      })
      .sort((x, y) => LANE.indexOf(x.from) - LANE.indexOf(y.from) || LANE.indexOf(x.to) - LANE.indexOf(y.to));
    const reached = new Set(links.flatMap((l) => [l.from, l.to]));
    if (reached.has('blind-spot') !== map.reaches_blind_spot) {
      throw new Error(`${T}: "${map.name}" says whether it reaches the Blind Spot, and its step rows say otherwise.`);
    }
    const nodes = LANE.filter((id) => reached.has(id)).map((id) => ({
      id,
      name: position(id, T),
      icon: wording(POSITION_ICONS, id, T),
    }));
    return {
      id: map.id,
      name: map.name,
      shape: map.shape,
      anchors: String(map.anchors),
      ratings: map.ratings,
      says: map.says.replace(/\s+/g, ' ').trim(),
      nodes,
      links,
      reachesBlindSpot: map.reaches_blind_spot,
    };
  });
}

/** The Grab countdown, for the countdown drawing. */
export function grabCountdown(): { lift: string; devour: string; crushLocation: string } {
  const doc = parse(grabText) as {
    countdown: { steps: { id: string; at: string }[] };
    grab_lands: { crush_harm: { injury_location: string } };
  };
  const T = 'The Grab';
  const at = (id: string) => {
    const step = doc.countdown.steps.find((s) => s.id === id);
    if (!step) throw new Error(`${T}: the countdown has no "${id}" step.`);
    return step.at;
  };
  return { lift: at('lift'), devour: at('devour'), crushLocation: doc.grab_lands.crush_harm.injury_location };
}
