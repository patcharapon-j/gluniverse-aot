/**
 * The Lifepath and the two builds as pure rules (data/character/lifepath.yaml, attributes.yaml,
 * origins.yaml, enlistment.yaml, training-years.yaml, graduation-exam.yaml, class-rank.yaml,
 * specialties.yaml, talents.yaml; data/gear/standard-issue.yaml). No Foundry globals: every rule the
 * wizard applies is here and unit tested. The tables arrive as `LpTables`, which the build bakes into
 * CONFIG.WOF.lifepath (tools/config-data.ts).
 */
import { health, resolve, type AttributeId, type Attributes } from './derived.ts';

/** The six attributes in the order the tables and the sheet list them. */
export const ATTRIBUTE_ORDER: AttributeId[] = ['strength', 'agility', 'wits', 'perception', 'instinct', 'empathy'];

export type Procedure = 'lifepath' | 'template-build' | 'free-build';
export const PROCEDURES: Procedure[] = ['lifepath', 'template-build', 'free-build'];

export interface LpTalent {
  id: string;
  name: string;
  type: 'dice' | 'rule';
  maxLevel: number;
  names: string[];
  /** Entries this Talent adds dice to only under a condition. */
  conditional: string[];
  specialties: string[];
}
export interface LpOrigin {
  id: string;
  results: number[];
  name: string;
  description: string;
  attributes: AttributeId[];
  talents: string[];
  havens: string[];
  canonTie: { character: string; link: string } | null;
  yearMin: number | null;
  /** The website's line for the condition, or null. */
  condition: string | null;
}
export interface LpEnlist {
  id: string;
  results: number[];
  reason: string;
  attribute: AttributeId;
  drive: { id: string; name: string; trigger: string; namedComrade: boolean };
}
export interface LpEvent {
  results: number[];
  name: string;
  description: string;
  attribute: AttributeId;
  talents: string[];
  merit: number;
}
export interface LpYear {
  id: string;
  title: string;
  subtitle: string;
  performance: AttributeId[];
  curriculum: string[];
  events: LpEvent[];
}
export interface Band {
  min: number | null;
  max: number | null;
  value: number;
}
export interface LpRank {
  min: number | null;
  max: number | null;
  rank: number;
  top10: boolean;
}
export interface LpTrialChoice {
  entry: string;
  /** The exam issue item's name, or null for none. */
  gear: string | null;
  dice: number;
}
export interface LpTrial {
  id: string;
  name: string;
  description: string;
  choices: LpTrialChoice[];
  /** Successes that earn Merit. */
  needs: number;
  push: boolean;
  /** The Trial allows Help (the squad field exercise). */
  help: boolean;
  merit: Band[];
}
export interface LpSpecialty {
  id: string;
  name: string;
  key: AttributeId;
  talents: string[];
  summary: string;
  template: Attributes;
}
export interface LpIssue {
  funding: number;
  odm: number;
  spares: number;
  blades: number;
  horse: number;
  bladeRating: number;
  fullGas: number;
  bySpecialty: { specialty: string; item: string; rating: number }[];
}
export interface LpRules {
  start: number;
  cap: number;
  keyMin: number;
  keyMax: number;
  top10Bonus: number;
  talentCap: number;
  built: { total: number; min: number; max: number; key: number; maxAt4: number; shapes: { id: string; ratings: number[] }[]; talentMax: number; maxAtTwo: number; anyLevels: number };
}
export interface LpTables {
  campaignYears: { min: number; max: number };
  /** The GM's campaign_choice options, each with the procedures it allows. */
  campaignChoices: { id: string; procedures: Procedure[] }[];
  origins: LpOrigin[];
  enlistment: LpEnlist[];
  years: LpYear[];
  performanceMerit: Band[];
  classRank: LpRank[];
  exam: { trials: LpTrial[]; responseCost: number };
  talents: LpTalent[];
  specialties: LpSpecialty[];
  general: string[];
  /** Action Catalog entries marked dormant or reserved (none today). */
  dormant: string[];
  /** The attribute each entry a Trial can roll uses. */
  entryAttributes: Record<string, AttributeId>;
  rules: LpRules;
  issue: LpIssue;
}

export type Levels = Record<string, number>;

// ---------------------------------------------------------------- tables

/** A D66 read tens then units. */
export const d66 = (tens: number, units: number): number => tens * 10 + units;

export function d66Row<R extends { results: number[] }>(rows: readonly R[], roll: number): R {
  const row = rows.find((r) => r.results.includes(roll));
  if (!row) throw new Error(`no row for the D66 result ${roll}`);
  return row;
}

/** An Origin row can be kept only if the Campaign Year is its year or later. */
export const originAllowed = (row: LpOrigin, year: number | null): boolean => row.yearMin === null || (year !== null && year >= row.yearMin);

export function band(bands: readonly Band[], n: number): number {
  const b = bands.find((x) => (x.min === null || n >= x.min) && (x.max === null || n <= x.max));
  if (!b) throw new Error(`no band for ${n}`);
  return b.value;
}

export function classRankFor(rows: readonly LpRank[], merit: number): LpRank {
  const row = rows.find((r) => (r.min === null || merit >= r.min) && (r.max === null || merit <= r.max));
  if (!row) throw new Error(`no Class Rank for Merit ${merit}`);
  return row;
}

export const sixes = (faces: readonly number[]): number => faces.filter((f) => f === 6).length;

// ---------------------------------------------------------------- attributes

export const startingAttributes = (start: number): Attributes => Object.fromEntries(ATTRIBUTE_ORDER.map((a) => [a, start])) as Attributes;

export const attributeTotal = (a: Attributes): number => ATTRIBUTE_ORDER.reduce((n, k) => n + a[k], 0);

/**
 * One Lifepath point (attributes.yaml, creation.overflow): +1 to the named attribute, or, if that
 * would pass the cap, +1 to another attribute below the cap that the player names. Without a valid
 * target the point waits: `needs` lists the attributes that can take it.
 */
export function addPoint(attrs: Attributes, attr: AttributeId, cap: number, target: string | null): { attrs: Attributes; overflow: boolean; needs: AttributeId[] | null } {
  if (attrs[attr] < cap) return { attrs: { ...attrs, [attr]: attrs[attr] + 1 }, overflow: false, needs: null };
  const options = ATTRIBUTE_ORDER.filter((a) => a !== attr && attrs[a] < cap);
  if (target && (options as string[]).includes(target)) return { attrs: { ...attrs, [target]: attrs[target as AttributeId] + 1 }, overflow: true, needs: null };
  return { attrs, overflow: true, needs: options };
}

/** The Training Year's performance roll: the higher attribute's dice; `choose` when the two are equal. */
export function performanceAttribute(attrs: Attributes, pair: readonly AttributeId[], picked: string | null): { attribute: AttributeId | null; dice: number; choose: AttributeId[] | null } {
  const [a, b] = pair;
  if (attrs[a] !== attrs[b]) {
    const attribute = attrs[a] > attrs[b] ? a : b;
    return { attribute, dice: attrs[attribute], choose: null };
  }
  const attribute = picked === a || picked === b ? (picked as AttributeId) : null;
  return { attribute, dice: attrs[a], choose: [a, b] };
}

/** The Graduation swap (creation.graduation.key_attribute_swap): null when nothing swaps. */
export function swapOptions(attrs: Attributes, key: AttributeId): AttributeId[] | null {
  const others = ATTRIBUTE_ORDER.filter((a) => a !== key);
  const top = Math.max(...others.map((a) => attrs[a]));
  if (top <= attrs[key]) return null;
  return others.filter((a) => attrs[a] === top);
}

export function applySwap(attrs: Attributes, key: AttributeId, other: AttributeId): Attributes {
  return { ...attrs, [key]: attrs[other], [other]: attrs[key] };
}

/**
 * The floor (creation.graduation.key_attribute_floor): raise the key attribute to the minimum; for each
 * point added, lower by 1 another attribute rated 3 or more, as the player names them in order.
 * Returns the ratings once every point is paid for, or the attributes the next point can come from.
 */
export function applyFloor(attrs: Attributes, key: AttributeId, minimum: number, lowered: readonly string[]): { attrs: Attributes; points: number; needs: AttributeId[] | null; valid: boolean } {
  const points = Math.max(0, minimum - attrs[key]);
  if (!points) return { attrs, points, needs: null, valid: lowered.length === 0 };
  let out: Attributes = { ...attrs, [key]: minimum };
  for (let i = 0; i < points; i++) {
    const options = ATTRIBUTE_ORDER.filter((a) => a !== key && out[a] >= 3);
    const pick = lowered[i];
    if (!pick || !(options as string[]).includes(pick)) return { attrs: out, points, needs: options, valid: false };
    out = { ...out, [pick]: out[pick as AttributeId] - 1 };
  }
  return { attrs: out, points, needs: null, valid: lowered.length === points };
}

export function applyTop10(attrs: Attributes, key: AttributeId, bonus: number, keyMax: number): Attributes {
  return { ...attrs, [key]: Math.min(keyMax, attrs[key] + bonus) };
}

// ---------------------------------------------------------------- Talents

export const talentById = (t: LpTables, id: string): LpTalent => {
  const x = t.talents.find((y) => y.id === id);
  if (!x) throw new Error(`no Talent "${id}"`);
  return x;
};

/** The highest level a Talent can reach at creation: 2, or its max level if lower. */
export const creationMax = (t: LpTables, id: string, cap = t.rules.talentCap): number => Math.min(cap, talentById(t, id).maxLevel);

export const canGain = (t: LpTables, levels: Levels, id: string, cap = t.rules.talentCap): boolean => (levels[id] ?? 0) < creationMax(t, id, cap);

export const gain = (levels: Levels, id: string): Levels => ({ ...levels, [id]: (levels[id] ?? 0) + 1 });

/** A Talent that names only dormant or reserved entries. */
export const namesOnlyDormant = (t: LpTables, id: string): boolean => {
  const names = talentById(t, id).names;
  return names.length > 0 && names.every((n) => t.dormant.includes(n));
};

/**
 * The Talents an event lets the Cadet take a level in (training-years.yaml, talent_cap): the event's
 * two when they can gain; the year's curriculum when neither can; either when the only one that can
 * names only dormant entries.
 */
export function eventTalentOptions(t: LpTables, levels: Levels, event: LpEvent, year: LpYear): { options: string[]; fallback: 'none' | 'both-capped' | 'dormant' } {
  const gainable = event.talents.filter((id) => canGain(t, levels, id));
  const curriculum = year.curriculum.filter((id) => canGain(t, levels, id));
  if (!gainable.length) return { options: curriculum, fallback: 'both-capped' };
  if (gainable.length === 1 && namesOnlyDormant(t, gainable[0])) return { options: [...new Set([...gainable, ...curriculum])], fallback: 'dormant' };
  return { options: gainable, fallback: 'none' };
}

/** Built Talent limits (built_steps.talent_levels): one more level, none above 2, at most one at 2, rule Talents at their max. */
export function builtCanGain(t: LpTables, levels: Levels, id: string): boolean {
  if (!canGain(t, levels, id, t.rules.built.talentMax)) return false;
  const next = (levels[id] ?? 0) + 1;
  if (next < t.rules.built.talentMax) return true;
  const atTop = Object.entries(levels).filter(([k, v]) => k !== id && v >= t.rules.built.talentMax).length;
  return atTop < t.rules.built.maxAtTwo;
}

export const levelTotal = (levels: Levels): number => Object.values(levels).reduce((n, v) => n + v, 0);

// ---------------------------------------------------------------- the Graduation Exam

export interface TrialPool {
  attribute: AttributeId;
  base: number;
  attributeDice: number;
  talent: { id: string; name: string; dice: number } | null;
  bonus: number;
  gear: number;
  stress: number;
  maxPushes: number;
}

/**
 * A Trial roll's pool (graduation-exam.yaml, conditions.pools): the entry's attribute (Perception on a
 * Read with Hunter's Eye, when the Cadet uses it), the best held dice Talent that names the entry
 * without a condition, one Bonus Die from Help where the Trial allows it, the exam issue item's Gear
 * Dice, and the Stress Dice of the Exam Stress. Sure Hands allows a second Push on Treat Injury.
 */
export function trialPool(t: LpTables, attrs: Attributes, levels: Levels, trial: LpTrial, choice: LpTrialChoice, opts: { helped: boolean; stress: number; hunterEye: boolean }): TrialPool {
  const base = t.entryAttributes[choice.entry];
  const useEye = opts.hunterEye && choice.entry === 'read' && (levels['hunters-eye'] ?? 0) > 0;
  const attribute: AttributeId = useEye ? 'perception' : base;
  let talent: TrialPool['talent'] = null;
  for (const x of t.talents) {
    const lv = levels[x.id] ?? 0;
    if (x.type !== 'dice' || lv <= 0 || !x.names.includes(choice.entry) || x.conditional.includes(choice.entry)) continue;
    if (!talent || lv > talent.dice) talent = { id: x.id, name: x.name, dice: lv };
  }
  const bonus = trial.help && opts.helped ? 1 : 0;
  const attributeDice = attrs[attribute];
  const maxPushes = trial.push ? (choice.entry === 'treat-injury' && (levels['sure-hands'] ?? 0) > 0 ? 2 : 1) : 0;
  return { attribute, attributeDice, talent, bonus, base: attributeDice + (talent?.dice ?? 0) + bonus, gear: choice.dice, stress: Math.max(0, opts.stress), maxPushes };
}

/** A Trial's Merit: its band for the successes, less the Stress Response cost when its roll caused one. */
export const trialMerit = (t: LpTables, trial: LpTrial, successes: number, response: boolean): number => band(trial.merit, successes) - (response ? t.exam.responseCost : 0);

// ---------------------------------------------------------------- the builds

export function templateAttributes(t: LpTables, specialty: string): Attributes {
  const s = t.specialties.find((x) => x.id === specialty);
  if (!s) throw new Error(`no Specialty "${specialty}"`);
  return { ...s.template };
}

/** Whether a Free Build placement uses the shape's six ratings once each with a 4 on the key attribute. */
export function freeBuildValid(t: LpTables, shapeId: string | null, placement: Record<string, number | null>, key: AttributeId): boolean {
  const shape = t.rules.built.shapes.find((s) => s.id === shapeId);
  if (!shape) return false;
  const values = ATTRIBUTE_ORDER.map((a) => placement[a]);
  if (values.some((v) => v === null || v === undefined)) return false;
  const sorted = [...(values as number[])].sort();
  if (sorted.join() !== [...shape.ratings].sort().join()) return false;
  return placement[key] === t.rules.built.key;
}

/** The ratings still free to place in a shape, given what is placed. */
export function freeBuildLeft(t: LpTables, shapeId: string | null, placement: Record<string, number | null>): number[] {
  const shape = t.rules.built.shapes.find((s) => s.id === shapeId);
  if (!shape) return [];
  const left = [...shape.ratings];
  for (const a of ATTRIBUTE_ORDER) {
    const v = placement[a];
    if (v === null || v === undefined) continue;
    const i = left.indexOf(v);
    if (i >= 0) left.splice(i, 1);
  }
  return left;
}

/** The checks every built soldier's ratings meet (attributes.yaml, creation.built). */
export function builtAttributesValid(t: LpTables, attrs: Attributes, key: AttributeId): boolean {
  const b = t.rules.built;
  const values = ATTRIBUTE_ORDER.map((a) => attrs[a]);
  return attributeTotal(attrs) === b.total && values.every((v) => v >= b.min && v <= b.max) && attrs[key] === b.key && values.filter((v) => v === b.max).length <= b.maxAt4;
}

// ---------------------------------------------------------------- Standard Issue

export interface HeldGear {
  id: string;
  itemId: string;
  rating: number;
  current: number;
  inHandles: boolean;
  kept: boolean;
}
export interface IssueDeclines {
  spares: number;
  blades: number;
  item: boolean;
}
export interface IssuePlan {
  create: { itemId: string; rating: number; current: number; inHandles?: boolean }[];
  remove: string[];
  /** Held Blade Sets fitted into empty handles. */
  fit: string[];
  gasRating: number;
  spareCanisters: number[];
  /** What each step gave, for the wizard's list. */
  given: { odm: number | null; horse: number | null; blades: number; spares: number; item: { itemId: string; rating: number } | null };
  /** How many of each the soldier could decline. */
  offered: { spares: number; blades: number; item: boolean };
}

/**
 * A full Standard Issue (standard-issue.yaml, receiving.steps) for a soldier holding `held`: ODM Gear,
 * canisters, Blade Sets, a horse, the Specialty item, each with the soldier's declines. Kept items are
 * kept (the default of kept_item_exchange).
 */
export function standardIssue(issue: LpIssue, specialty: string | null, held: readonly HeldGear[], spares: readonly number[], declines: IssueDeclines): IssuePlan {
  const plan: IssuePlan = {
    create: [],
    remove: [],
    fit: [],
    gasRating: issue.fullGas,
    spareCanisters: [],
    given: { odm: null, horse: null, blades: 0, spares: 0, item: null },
    offered: { spares: 0, blades: 0, item: false },
  };
  const replaceRated = (itemId: string, rating: number, extra = (_: HeldGear) => false) => {
    const mine = held.filter((g) => g.itemId === itemId);
    const keep = mine.find((g) => g.kept || !(g.current <= 0 || g.current < g.rating || g.rating < rating || extra(g)));
    if (keep) return null;
    plan.remove.push(...mine.map((g) => g.id));
    plan.create.push({ itemId, rating, current: rating });
    return rating;
  };
  plan.given.odm = replaceRated('odm-gear', issue.odm);
  // Canisters: every held one refilled, then full spares added up to the row, less declines.
  const refilled = spares.map(() => issue.fullGas);
  const addable = Math.max(0, issue.spares - refilled.length);
  plan.offered.spares = addable;
  const addSpares = Math.max(0, addable - Math.max(0, declines.spares));
  plan.spareCanisters = [...refilled, ...Array.from({ length: addSpares }, () => issue.fullGas)];
  plan.given.spares = addSpares;
  // Blade Sets: added up to the row, counting the one in the handles; one fitted if the handles are empty.
  const blades = held.filter((g) => g.itemId === 'blade-set');
  const handlesFull = blades.some((g) => g.inHandles);
  const bladeAdd = Math.max(0, issue.blades - blades.length);
  plan.offered.blades = bladeAdd;
  const bladeTake = Math.max(0, bladeAdd - Math.max(0, declines.blades));
  plan.given.blades = bladeTake;
  let fitted = handlesFull;
  if (!fitted && blades.length) {
    plan.fit.push(blades[0].id);
    fitted = true;
  }
  for (let i = 0; i < bladeTake; i++) {
    plan.create.push({ itemId: 'blade-set', rating: issue.bladeRating, current: issue.bladeRating, inHandles: !fitted });
    fitted = true;
  }
  plan.given.horse = replaceRated('horse', issue.horse);
  const row = issue.bySpecialty.find((r) => r.specialty === specialty);
  if (row) {
    const mine = held.filter((g) => g.itemId === row.item);
    if (!mine.some((g) => g.current > 0)) {
      plan.offered.item = true;
      if (!declines.item) {
        plan.remove.push(...mine.map((g) => g.id));
        plan.create.push({ itemId: row.item, rating: row.rating, current: row.rating });
        plan.given.item = { itemId: row.item, rating: row.rating };
      }
    }
  }
  return plan;
}

// ---------------------------------------------------------------- derived at the finish

export function finishValues(attrs: Attributes): { health: number; resolve: number; stress: number; minimumStress: number } {
  // A new soldier has no Scars and no Grief (derived_values, resolve.at_creation).
  return { health: health(attrs), resolve: resolve(attrs, 0, 0), stress: 0, minimumStress: 0 };
}
