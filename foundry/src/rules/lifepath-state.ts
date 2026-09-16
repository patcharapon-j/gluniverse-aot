/**
 * The Lifepath wizard's state and its replay (foundry/docs/lifepath-wizard-plan.md, sections 3 and 4).
 * The state holds inputs only: the procedure, each roll's faces, and each choice. `replay` runs the
 * steps in rules order from those inputs, clears any later choice an earlier edit made invalid, and
 * returns everything the wizard shows and the soldier Finish commits. Pure: no Foundry globals.
 */
import type { Attributes, AttributeId } from './derived.ts';
import {
  addPoint,
  applyFloor,
  applySwap,
  applyTop10,
  ATTRIBUTE_ORDER,
  attributeTotal,
  band,
  builtAttributesValid,
  builtCanGain,
  canGain,
  classRankFor,
  d66,
  d66Row,
  eventTalentOptions,
  finishValues,
  freeBuildValid,
  gain,
  levelTotal,
  originAllowed,
  performanceAttribute,
  sixes,
  startingAttributes,
  swapOptions,
  templateAttributes,
  trialMerit,
  trialPool,
  type Levels,
  type LpEnlist,
  type LpEvent,
  type LpOrigin,
  type LpRank,
  type LpSpecialty,
  type LpTables,
  type LpTrial,
  type LpTrialChoice,
  type Procedure,
  type TrialPool,
} from './lifepath.ts';
import { applyPush, pushBlock, rerollCounts, type DiceFaces, type PushBlock } from './roll.ts';

export type StepId = 'campaign' | 'origin' | 'enlist' | 'year-1' | 'year-2' | 'year-3' | 'exam' | 'graduation' | 'specialty' | 'attributes' | 'drive' | 'stories' | 'talents' | 'merit' | 'finish' | 'squad';

export const LIFEPATH_RAIL: StepId[] = ['campaign', 'origin', 'enlist', 'year-1', 'year-2', 'year-3', 'exam', 'graduation', 'finish', 'squad'];
export const BUILT_RAIL: StepId[] = ['campaign', 'specialty', 'attributes', 'origin', 'drive', 'stories', 'talents', 'merit', 'finish', 'squad'];
const YEAR_STEPS: StepId[] = ['year-1', 'year-2', 'year-3'];

export interface D66Roll {
  tens: number;
  units: number;
}
export interface YearState {
  roll: D66Roll | null;
  talent: string | null;
  overflow: string | null;
  perfAttr: string | null;
  /** The performance roll's faces, once rolled. */
  perf: number[] | null;
}
export interface TrialState {
  /** D6 rolls for the order (again on a tie). */
  order: number[];
  entry: string | null;
  helped: boolean;
  hunterEye: boolean;
  /** Stress gained Covering another Cadet's Push in this Trial before this Cadet's own roll. */
  coverStress: number;
  dice: DiceFaces | null;
  /** One entry per Push: whether a Cadet Covered it. */
  covers: boolean[];
  /** The Stress Die the last Push added, or -1. */
  fresh: number;
  /** A Stress Die showed 1 on this roll (the Exam's own resolution: 1 Merit). */
  response: boolean;
  /** The chat message of this Trial's roll, which a Push updates. */
  message: string;
}
export interface LifepathState {
  v: 1;
  step: StepId;
  confirmed: StepId[];
  finished: boolean;
  procedure: Procedure | null;
  year: number | null;
  exam: boolean | null;
  origin: { rolls: D66Roll[]; row: string | null; talent: string | null; haven: string | null; canonTie: boolean };
  enlist: { roll: D66Roll | null; drive: string | null; overflow: string | null };
  years: YearState[];
  alone: boolean;
  trials: TrialState[];
  specialty: string | null;
  grad: { swapWith: string | null; floor: string[]; talent: string | null };
  built: { shape: string | null; placement: Record<AttributeId, number | null>; stories: (number | null)[]; any: string[] };
  finish: { name: string; spares: number; blades: number; item: boolean; comrade: string };
}

const emptyYear = (): YearState => ({ roll: null, talent: null, overflow: null, perfAttr: null, perf: null });
const emptyTrial = (): TrialState => ({ order: [], entry: null, helped: false, hunterEye: false, coverStress: 0, dice: null, covers: [], fresh: -1, response: false, message: '' });

/** A fresh state; every key is always present so a flag merge never keeps a stale one. */
export function emptyState(): LifepathState {
  return {
    v: 1,
    step: 'campaign',
    confirmed: [],
    finished: false,
    procedure: null,
    year: null,
    exam: null,
    origin: { rolls: [], row: null, talent: null, haven: null, canonTie: false },
    enlist: { roll: null, drive: null, overflow: null },
    years: [emptyYear(), emptyYear(), emptyYear()],
    alone: true,
    trials: [emptyTrial(), emptyTrial(), emptyTrial()],
    specialty: null,
    grad: { swapWith: null, floor: [], talent: null },
    built: { shape: null, placement: { strength: null, agility: null, wits: null, perception: null, instinct: null, empathy: null }, stories: [null, null, null], any: [] },
    finish: { name: '', spares: 0, blades: 0, item: false, comrade: '' },
  };
}

/** Reads a stored state (or nothing) into the full shape, dropping unknown keys. */
export function normalizeState(raw: unknown): LifepathState {
  const base = emptyState();
  if (!raw || typeof raw !== 'object' || (raw as { v?: unknown }).v !== 1) return base;
  const r = raw as Partial<LifepathState>;
  const merge = <T extends object>(def: T, v: unknown): T => (v && typeof v === 'object' && !Array.isArray(v) ? { ...def, ...(Object.fromEntries(Object.entries(v).filter(([k]) => k in def)) as Partial<T>) } : def);
  return {
    ...base,
    step: typeof r.step === 'string' ? r.step : base.step,
    confirmed: Array.isArray(r.confirmed) ? [...r.confirmed] : [],
    finished: !!r.finished,
    procedure: r.procedure ?? null,
    year: typeof r.year === 'number' ? r.year : null,
    exam: typeof r.exam === 'boolean' ? r.exam : null,
    origin: merge(base.origin, r.origin),
    enlist: merge(base.enlist, r.enlist),
    years: [0, 1, 2].map((i) => merge(emptyYear(), r.years?.[i])),
    alone: r.alone ?? true,
    trials: [0, 1, 2].map((i) => merge(emptyTrial(), r.trials?.[i])),
    specialty: r.specialty ?? null,
    grad: merge(base.grad, r.grad),
    built: { ...merge(base.built, r.built), placement: merge(base.built.placement, r.built?.placement), stories: [0, 1, 2].map((i) => r.built?.stories?.[i] ?? null) },
    finish: merge(base.finish, r.finish),
  };
}

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

// ---------------------------------------------------------------- replay

export type StepStatus = 'done' | 'ready' | 'todo' | 'blocked';

export interface OriginDetail {
  rolls: { roll: number; row: LpOrigin; kept: boolean }[];
  row: LpOrigin | null;
  /** The last roll's row fails its condition: roll again. */
  rollAgain: boolean;
}
export interface YearDetail {
  event: LpEvent | null;
  roll: number | null;
  talentOptions: string[];
  fallback: 'none' | 'both-capped' | 'dormant';
  overflowNeeds: AttributeId[] | null;
  overflowFrom: AttributeId | null;
  /** The Exam replaces this year's performance roll. */
  skipPerformance: boolean;
  perf: { attribute: AttributeId | null; dice: number; choose: AttributeId[] | null } | null;
  perfSuccesses: number | null;
  perfMerit: number | null;
  merit: number;
}
export interface TrialDetail {
  trial: LpTrial;
  choice: LpTrialChoice | null;
  pool: TrialPool | null;
  successes: number | null;
  merit: number | null;
  push: PushBlock;
  /** Dice a Push would pick up (base, Stress, and whether a new Stress Die joins). */
  reroll: { base: number; stress: number } | null;
}
export interface GradDetail {
  meritTotal: number;
  rank: LpRank;
  specialty: LpSpecialty | null;
  swap: AttributeId[] | null;
  swapped: AttributeId | null;
  floor: { points: number; needs: AttributeId[] | null };
  before: Attributes;
  after: Attributes | null;
  talentOptions: string[];
}
export interface FinalSoldier {
  procedure: Procedure;
  name: string;
  attributes: Attributes;
  origin: string;
  haven: string;
  canonTie: string;
  drive: string;
  driveNeedsComrade: boolean;
  specialty: string;
  talents: Levels;
  merit: number | null;
  classRank: number | null;
  declined: boolean;
  health: number;
  resolve: number;
  stories: { year: string; event: string }[];
}

export interface Replay {
  state: LifepathState;
  rail: StepId[];
  status: Record<string, StepStatus>;
  /** The first step not done. */
  current: StepId;
  /** Attributes, Talent levels, and Merit after each step that has run. */
  attrs: Partial<Record<StepId, Attributes>>;
  levels: Partial<Record<StepId, Levels>>;
  merit: Partial<Record<StepId, number>>;
  /** Choice keys that a later roll has fixed. */
  locks: Set<string>;
  origin: OriginDetail | null;
  enlist: { row: LpEnlist | null; roll: number | null; overflowNeeds: AttributeId[] | null } | null;
  years: YearDetail[];
  trials: TrialDetail[];
  examMerit: number | null;
  grad: GradDetail | null;
  builtTalents: { specialtyOptions: string[]; anyOptions: string[]; afterOrigin: Levels } | null;
  final: FinalSoldier | null;
}

export function railFor(state: LifepathState): StepId[] {
  if (state.procedure && state.procedure !== 'lifepath') return BUILT_RAIL;
  return LIFEPATH_RAIL.filter((s) => s !== 'exam' || state.exam === true);
}

/** Choice keys fixed by a roll made after them (plan section 4). */
export function locksOf(s: LifepathState): Set<string> {
  const locks = new Set<string>();
  const perf = s.years.map((y) => y.perf !== null);
  const trialRolled = s.trials.map((x) => x.dice !== null);
  const anyTrial = trialRolled.some(Boolean) || s.trials.some((x) => x.order.length > 0);
  const poolFrom = (i: number) => perf.slice(i).some(Boolean) || (s.exam === true && trialRolled.some(Boolean));
  const anyRoll = s.origin.rolls.length > 0 || s.enlist.roll !== null || s.years.some((y) => y.roll !== null || y.perf !== null) || anyTrial;
  if (anyRoll) locks.add('procedure');
  if (s.origin.rolls.length) locks.add('year');
  if (perf[2] || anyTrial) locks.add('exam');
  if (poolFrom(0)) {
    locks.add('origin.talent');
    locks.add('enlist.overflow');
  }
  for (let i = 0; i < 3; i++) {
    if (poolFrom(i)) for (const k of ['talent', 'overflow', 'perfAttr']) locks.add(`years.${i}.${k}`);
  }
  if (anyTrial) locks.add('alone');
  s.trials.forEach((x, k) => {
    if (x.dice) for (const f of ['entry', 'helped', 'hunterEye', 'coverStress']) locks.add(`trials.${k}.${f}`);
  });
  return locks;
}

function stepOf(key: string): StepId | null {
  if (key === 'procedure' || key === 'year' || key === 'exam') return 'campaign';
  const [head, idx] = key.split('.');
  if (head === 'origin') return 'origin';
  if (head === 'enlist') return 'enlist';
  if (head === 'years') return YEAR_STEPS[Number(idx)] ?? null;
  if (head === 'alone' || head === 'trials') return 'exam';
  return null;
}

export function replay(input: LifepathState, t: LpTables, opts: { allowed?: Procedure[]; worldYear?: number | null } = {}): Replay {
  const s = clone(input);
  const allowed = opts.allowed ?? ['lifepath'];
  if (opts.worldYear != null && !s.origin.rolls.length) s.year = opts.worldYear;
  const rail = railFor(s);
  const complete: Record<string, boolean> = {};
  const attrs: Replay['attrs'] = {};
  const levels: Replay['levels'] = {};
  const merit: Replay['merit'] = {};
  const out: Replay = { state: s, rail, status: {}, current: rail[0], attrs, levels, merit, locks: locksOf(s), origin: null, enlist: null, years: [], trials: [], examMerit: null, grad: null, builtTalents: null, final: null };
  const built = s.procedure === 'template-build' || s.procedure === 'free-build';
  const rules = t.rules;
  let a: Attributes = startingAttributes(rules.start);
  let lv: Levels = {};
  let m = 0;
  let broken = false; // an earlier step is incomplete: later ones are not computed

  // ---- campaign
  complete.campaign = !!s.procedure && allowed.includes(s.procedure) && s.year !== null && s.year >= t.campaignYears.min && s.year <= t.campaignYears.max && (built || s.exam !== null);
  if (built) s.exam = s.exam ?? false;
  if (!complete.campaign) broken = true;

  const specialty = t.specialties.find((x) => x.id === s.specialty) ?? null;
  if (s.specialty && !specialty) s.specialty = null;

  if (!built) {
    // ---- origin
    if (!broken) {
      const rolls = s.origin.rolls.map((r) => {
        const row = d66Row(t.origins, d66(r.tens, r.units));
        return { roll: d66(r.tens, r.units), row, kept: originAllowed(row, s.year) };
      });
      const last = rolls[rolls.length - 1];
      const row = last?.kept ? last.row : null;
      out.origin = { rolls, row, rollAgain: !!last && !last.kept };
      s.origin.row = row?.id ?? null;
      if (row) {
        if (s.origin.talent && !row.talents.includes(s.origin.talent)) s.origin.talent = null;
        if (s.origin.haven && !row.havens.includes(s.origin.haven)) s.origin.haven = null;
        if (!row.canonTie) s.origin.canonTie = false;
        for (const x of row.attributes) a = addPoint(a, x, rules.cap, null).attrs;
        if (s.origin.talent) lv = gain(lv, s.origin.talent);
      }
      complete.origin = !!row && !!s.origin.talent && !!s.origin.haven;
      attrs.origin = a;
      levels.origin = lv;
      merit.origin = m;
      if (!complete.origin) broken = true;
    }
    // ---- why you enlisted
    if (!broken) {
      const roll = s.enlist.roll ? d66(s.enlist.roll.tens, s.enlist.roll.units) : null;
      const row = roll !== null ? d66Row(t.enlistment, roll) : null;
      let needs: AttributeId[] | null = null;
      if (row) {
        if (s.enlist.drive && !t.enlistment.some((r) => r.id === s.enlist.drive)) s.enlist.drive = null;
        const p = addPoint(a, row.attribute, rules.cap, s.enlist.overflow);
        needs = p.needs;
        if (!p.overflow) s.enlist.overflow = null;
        if (needs) s.enlist.overflow = null;
        a = p.attrs;
      }
      out.enlist = { row, roll, overflowNeeds: needs };
      complete.enlist = !!row && !!s.enlist.drive && !needs;
      attrs.enlist = a;
      levels.enlist = lv;
      merit.enlist = m;
      if (!complete.enlist) broken = true;
    }
    // ---- Training Years
    for (let i = 0; i < 3; i++) {
      const id = YEAR_STEPS[i];
      const ys = s.years[i];
      const year = t.years[i];
      const detail: YearDetail = { event: null, roll: null, talentOptions: [], fallback: 'none', overflowNeeds: null, overflowFrom: null, skipPerformance: i === 2 && s.exam === true, perf: null, perfSuccesses: null, perfMerit: null, merit: 0 };
      if (broken) {
        out.years.push(detail);
        continue;
      }
      if (ys.roll) {
        detail.roll = d66(ys.roll.tens, ys.roll.units);
        const event = d66Row(year.events, detail.roll);
        detail.event = event;
        const opts = eventTalentOptions(t, lv, event, year);
        detail.talentOptions = opts.options;
        detail.fallback = opts.fallback;
        if (ys.talent && !opts.options.includes(ys.talent)) ys.talent = null;
        const p = addPoint(a, event.attribute, rules.cap, ys.overflow);
        if (!p.overflow || p.needs) ys.overflow = null;
        detail.overflowNeeds = p.needs;
        detail.overflowFrom = p.overflow ? event.attribute : null;
        a = p.attrs;
        if (ys.talent) lv = gain(lv, ys.talent);
        m += event.merit;
        detail.merit = event.merit;
      }
      const choicesDone = !!detail.event && (!!ys.talent || detail.talentOptions.length === 0) && !detail.overflowNeeds;
      if (choicesDone && !detail.skipPerformance) {
        detail.perf = performanceAttribute(a, year.performance, ys.perfAttr);
        if (!detail.perf.choose) ys.perfAttr = null;
        else if (!detail.perf.attribute) ys.perfAttr = null;
        if (ys.perf) {
          detail.perfSuccesses = sixes(ys.perf);
          detail.perfMerit = band(t.performanceMerit, detail.perfSuccesses);
          m += detail.perfMerit;
          detail.merit += detail.perfMerit;
        }
      }
      if (detail.skipPerformance) ys.perfAttr = null;
      complete[id] = choicesDone && (detail.skipPerformance || (!!ys.perf && !!detail.perf?.attribute));
      attrs[id] = a;
      levels[id] = lv;
      merit[id] = m;
      out.years.push(detail);
      if (!complete[id]) broken = true;
    }
    // ---- the Graduation Exam
    if (s.exam === true) {
      let examMerit = 0;
      t.exam.trials.forEach((trial, k) => {
        const ts = s.trials[k];
        const detail: TrialDetail = { trial, choice: null, pool: null, successes: null, merit: null, push: 'not-allowed', reroll: null };
        out.trials.push(detail);
        if (broken) return;
        if (s.alone) {
          ts.helped = false;
          ts.coverStress = 0;
        }
        if (!trial.help) ts.helped = false;
        if (trial.choices.length === 1) ts.entry = trial.choices[0].entry;
        else if (ts.entry && !trial.choices.some((c) => c.entry === ts.entry)) ts.entry = null;
        if (ts.hunterEye && !(ts.entry === 'read' && (lv['hunters-eye'] ?? 0) > 0)) ts.hunterEye = false;
        const choice = trial.choices.find((c) => c.entry === ts.entry) ?? null;
        detail.choice = choice;
        if (choice) detail.pool = trialPool(t, a, lv, trial, choice, { helped: ts.helped, stress: k === 2 ? ts.coverStress : 0, hunterEye: ts.hunterEye });
        if (ts.dice) {
          detail.successes = sixes([...ts.dice.base, ...ts.dice.gear, ...ts.dice.stress]);
          detail.merit = trialMerit(t, trial, detail.successes, ts.response);
          examMerit += detail.merit;
          detail.push = pushBlock({ dice: ts.dice, pushes: ts.covers.length, maxPushes: detail.pool?.maxPushes ?? 0, pushAllowed: trial.push, down: false });
          if (ts.response && !detail.push) detail.push = 'stress-one';
          detail.reroll = detail.push ? null : rerollCounts(ts.dice);
        }
        const ordered = s.alone || ts.order.length > 0;
        if (!(ordered && ts.dice)) broken = true;
      });
      out.examMerit = examMerit;
      m += examMerit;
      complete.exam = !broken;
      attrs.exam = a;
      levels.exam = lv;
      merit.exam = m;
    }
    // ---- Graduation
    if (!broken) {
      const before = a;
      const rank = classRankFor(t.classRank, m);
      const g: GradDetail = { meritTotal: m, rank, specialty, swap: null, swapped: null, floor: { points: 0, needs: null }, before, after: null, talentOptions: [] };
      out.grad = g;
      let ok = !!specialty;
      if (specialty) {
        const key = specialty.key;
        g.swap = swapOptions(a, key);
        let pick: AttributeId | null = null;
        if (!g.swap) s.grad.swapWith = null;
        else if (g.swap.length === 1) {
          pick = g.swap[0];
          s.grad.swapWith = null;
        } else if ((g.swap as string[]).includes(s.grad.swapWith ?? '')) pick = s.grad.swapWith as AttributeId;
        else s.grad.swapWith = null;
        if (g.swap && !pick) ok = false;
        if (pick) {
          a = applySwap(a, key, pick);
          g.swapped = pick;
        }
        if (ok) {
          const points = Math.max(0, rules.keyMin - a[key]);
          s.grad.floor = s.grad.floor.slice(0, points);
          let f = applyFloor(a, key, rules.keyMin, s.grad.floor);
          if (f.needs) {
            // Keep the picks that were valid, in order; the next one is still to choose.
            s.grad.floor = floorPrefix(a, key, rules.keyMin, s.grad.floor);
            f = applyFloor(a, key, rules.keyMin, s.grad.floor);
          }
          g.floor = { points: f.points, needs: f.needs };
          if (f.needs) ok = false;
          else {
            a = f.attrs;
            if (rank.top10) a = applyTop10(a, key, rules.top10Bonus, rules.keyMax);
            g.after = a;
          }
        }
        g.talentOptions = specialty.talents.filter((id) => canGain(t, lv, id));
        if (s.grad.talent && !g.talentOptions.includes(s.grad.talent)) s.grad.talent = null;
        if (ok && s.grad.talent) lv = gain(lv, s.grad.talent);
      } else {
        s.grad.swapWith = null;
        s.grad.floor = [];
        s.grad.talent = null;
      }
      complete.graduation = ok && !!s.grad.talent;
      attrs.graduation = a;
      levels.graduation = lv;
      merit.graduation = m;
      if (!complete.graduation) broken = true;
    }
  } else {
    // ---- built: Specialty
    if (!broken) {
      complete.specialty = !!specialty;
      if (!complete.specialty) broken = true;
    }
    // ---- built: attributes
    if (!broken && specialty) {
      if (s.procedure === 'template-build') {
        a = templateAttributes(t, specialty.id);
        complete.attributes = builtAttributesValid(t, a, specialty.key);
      } else {
        const shape = rules.built.shapes.find((x) => x.id === s.built.shape);
        if (!shape) s.built.shape = null;
        complete.attributes = freeBuildValid(t, s.built.shape, s.built.placement, specialty.key);
        if (complete.attributes) a = Object.fromEntries(ATTRIBUTE_ORDER.map((k) => [k, s.built.placement[k] as number])) as Attributes;
        complete.attributes = complete.attributes && builtAttributesValid(t, a, specialty.key);
      }
      // Unplaced ratings are not a soldier yet: the file shows the placement instead.
      if (complete.attributes) attrs.attributes = a;
      levels.attributes = lv;
      if (!complete.attributes) broken = true;
    }
    // ---- built: Origin (chosen; its attributes add nothing)
    if (!broken) {
      const row = t.origins.find((o) => o.id === s.origin.row) ?? null;
      if (row && !originAllowed(row, s.year)) s.origin.row = null;
      const ok = row && originAllowed(row, s.year) ? row : null;
      out.origin = { rolls: [], row: ok, rollAgain: false };
      if (ok) {
        if (s.origin.talent && !ok.talents.includes(s.origin.talent)) s.origin.talent = null;
        if (s.origin.haven && !ok.havens.includes(s.origin.haven)) s.origin.haven = null;
        if (!ok.canonTie) s.origin.canonTie = false;
        if (s.origin.talent) lv = gain(lv, s.origin.talent);
      } else {
        s.origin.talent = null;
        s.origin.haven = null;
        s.origin.canonTie = false;
      }
      complete.origin = !!ok && !!s.origin.talent && !!s.origin.haven;
      attrs.origin = a;
      levels.origin = lv;
      if (!complete.origin) broken = true;
    }
    // ---- built: Drive
    if (!broken) {
      if (s.enlist.drive && !t.enlistment.some((r) => r.id === s.enlist.drive)) s.enlist.drive = null;
      complete.drive = !!s.enlist.drive;
      if (!complete.drive) broken = true;
    }
    // ---- built: the Training Years, for the story
    if (!broken) {
      s.built.stories = s.built.stories.map((x, i) => (x !== null && t.years[i].events[x] ? x : null));
      complete.stories = true;
    }
    // ---- built: Talents
    if (!broken && specialty) {
      const afterOrigin = lv;
      const specialtyOptions = specialty.talents.filter((id) => builtCanGain(t, lv, id));
      if (s.grad.talent && !specialtyOptions.includes(s.grad.talent)) s.grad.talent = null;
      if (s.grad.talent) lv = gain(lv, s.grad.talent);
      const any: string[] = [];
      for (const id of s.built.any) {
        if (any.length >= rules.built.anyLevels || !s.grad.talent || !builtCanGain(t, lv, id)) break;
        any.push(id);
        lv = gain(lv, id);
      }
      s.built.any = any;
      const anyOptions = s.grad.talent && any.length < rules.built.anyLevels ? t.talents.map((x) => x.id).filter((id) => builtCanGain(t, lv, id)) : [];
      out.builtTalents = { specialtyOptions, anyOptions, afterOrigin };
      complete.talents = !!s.grad.talent && any.length === rules.built.anyLevels;
      levels.talents = lv;
      if (!complete.talents) broken = true;
    }
    if (!broken) complete.merit = true;
    // A built soldier takes no Exam.
    s.exam = false;
  }

  // ---- Finish
  if (!broken && specialty) {
    const originRow = t.origins.find((o) => o.id === s.origin.row)!;
    const drive = t.enlistment.find((r) => r.id === s.enlist.drive)!.drive;
    const derived = finishValues(a);
    const rank = built ? null : out.grad!.rank;
    out.final = {
      procedure: s.procedure!,
      name: s.finish.name.trim(),
      attributes: a,
      origin: originRow.id,
      haven: s.origin.haven!,
      canonTie: s.origin.canonTie && originRow.canonTie ? `${originRow.canonTie.character}: ${originRow.canonTie.link}` : '',
      drive: `${drive.name}: ${drive.trigger}`,
      driveNeedsComrade: drive.namedComrade,
      specialty: specialty.id,
      talents: lv,
      merit: built ? null : m,
      classRank: rank ? rank.rank : null,
      declined: !!rank?.top10,
      health: derived.health,
      resolve: derived.resolve,
      stories: built ? s.built.stories.flatMap((x, i) => (x === null ? [] : [{ year: t.years[i].title, event: t.years[i].events[x].name }])) : [],
    };
    complete.finish = s.finished;
    complete.squad = s.finished;
  }

  // ---- statuses: a step is done once complete and confirmed, in order
  s.confirmed = s.confirmed.filter((id) => rail.includes(id) && complete[id]);
  if (s.finished && !s.confirmed.includes('finish')) s.confirmed.push('finish');
  let reachable = true;
  let current: StepId | null = null;
  for (const id of rail) {
    const done = reachable && !!complete[id] && s.confirmed.includes(id);
    out.status[id] = done ? 'done' : !reachable ? 'blocked' : complete[id] ? 'ready' : 'todo';
    if (!done && reachable) {
      current = id;
      reachable = false;
    }
  }
  // Confirmations past the first step not done no longer hold.
  if (current) {
    const cut = rail.indexOf(current);
    s.confirmed = s.confirmed.filter((id) => rail.indexOf(id) < cut || (id === 'finish' && s.finished));
  }
  out.current = current ?? rail[rail.length - 1];
  if (!rail.includes(s.step) || rail.indexOf(s.step) > rail.indexOf(out.current)) s.step = out.current;
  out.locks = locksOf(s);
  return out;
}

/** The longest run of the player's floor picks that each lower an attribute still rated 3 or more. */
export function floorPrefix(attrs: Attributes, key: AttributeId, minimum: number, picks: readonly string[]): string[] {
  let probe: Attributes = { ...attrs, [key]: Math.max(minimum, attrs[key]) };
  const out: string[] = [];
  for (const pick of picks) {
    if (pick === key || !(pick in probe) || probe[pick as AttributeId] < 3) break;
    probe = { ...probe, [pick]: probe[pick as AttributeId] - 1 };
    out.push(pick);
  }
  return out;
}

// ---------------------------------------------------------------- edits

/** Sets one choice by path ("origin.talent", "years.1.overflow", "trials.2.entry"), unless a later roll fixed it. */
export function setChoice(state: LifepathState, key: string, value: unknown, t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  if (state.finished && key !== 'finish.comrade') return state;
  if (locksOf(state).has(key)) return state;
  const s = clone(state);
  const parts = key.split('.');
  let target: any = s;
  for (const p of parts.slice(0, -1)) target = target[p];
  target[parts[parts.length - 1]] = value;
  if (key === 'procedure' && value !== state.procedure) {
    s.confirmed = s.confirmed.filter((c) => c === 'campaign');
    // A built soldier recorded no Exam vote; the Lifepath asks for one again.
    if (value === 'lifepath') s.exam = null;
  }
  // A new Free Build shape starts an empty placement.
  if (key === 'built.shape' && value !== state.built.shape) s.built.placement = emptyState().built.placement;
  const step = stepOf(key);
  if (step && step !== 'campaign' && railFor(s).includes(step)) s.step = step;
  return replay(s, t, opts).state;
}

/** Records a D66 for the Origin (each re-roll kept), Why You Enlisted, or a Training Year's event. */
export function recordD66(state: LifepathState, where: 'origin' | 'enlist' | 0 | 1 | 2, roll: D66Roll, t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  const s = clone(state);
  if (where === 'origin') {
    const r = replay(s, t, opts);
    if (r.origin?.row) return state;
    s.origin.rolls.push(roll);
  } else if (where === 'enlist') {
    if (s.enlist.roll) return state;
    s.enlist.roll = roll;
    // The rolled row's Drive is recorded unless the player picks another.
    s.enlist.drive = d66Row(t.enlistment, d66(roll.tens, roll.units)).id;
  } else {
    if (s.years[where].roll) return state;
    s.years[where].roll = roll;
  }
  return replay(s, t, opts).state;
}

export function recordPerformance(state: LifepathState, i: number, faces: number[], t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  const r = replay(state, t, opts);
  const d = r.years[i];
  if (!d?.perf?.attribute || state.years[i].perf || d.skipPerformance || faces.length !== d.perf.dice) return state;
  const s = clone(r.state);
  s.years[i].perf = [...faces];
  return replay(s, t, opts).state;
}

export function recordOrder(state: LifepathState, k: number, d6: number, t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  if (state.alone || state.trials[k].dice) return state;
  const s = clone(state);
  s.trials[k].order.push(d6);
  return replay(s, t, opts).state;
}

/** A Trial roll: its faces by kind; a Stress Die showing 1 is the Exam's Stress Response. */
export function recordTrial(state: LifepathState, k: number, dice: DiceFaces, t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  const r = replay(state, t, opts);
  const d = r.trials[k];
  if (!d?.pool || state.trials[k].dice) return state;
  if (dice.base.length !== d.pool.base || dice.gear.length !== d.pool.gear || dice.stress.length !== d.pool.stress) return state;
  const s = clone(r.state);
  s.trials[k].dice = { base: [...dice.base], gear: [...dice.gear], stress: [...dice.stress] };
  s.trials[k].response = dice.stress.includes(1);
  return replay(s, t, opts).state;
}

/** The dice a Push of Trial k rolls: the non-6 base and Stress Dice, plus a new Stress Die unless Covered. */
export function pushNeeds(state: LifepathState, k: number, covered: boolean): { base: number; stress: number } | null {
  const x = state.trials[k];
  if (!x.dice) return null;
  const r = rerollCounts(x.dice);
  return { base: r.base, stress: r.stress + (covered ? 0 : 1) };
}

export function recordPush(state: LifepathState, k: number, covered: boolean, rolled: { base: number[]; stress: number[] }, t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  const r = replay(state, t, opts);
  const d = r.trials[k];
  const x = r.state.trials[k];
  if (!x.dice || d.push !== null) return state;
  const s = clone(r.state);
  const pushed = applyPush(x.dice, rolled, !covered);
  const ts = s.trials[k];
  ts.dice = pushed.dice;
  ts.fresh = pushed.fresh;
  ts.covers.push(covered);
  // A roll never causes more than one Stress Response.
  ts.response = ts.response || pushed.dice.stress.includes(1);
  return replay(s, t, opts).state;
}

/** Confirms a complete step and moves to the next. */
export function confirmStep(state: LifepathState, step: StepId, t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  const r = replay(state, t, opts);
  if (!['ready', 'done'].includes(r.status[step]) || step === 'finish') return r.state;
  const s = clone(r.state);
  if (!s.confirmed.includes(step)) s.confirmed.push(step);
  const next = replay(s, t, opts);
  const i = next.rail.indexOf(step);
  next.state.step = next.rail[Math.min(i + 1, next.rail.length - 1)];
  return replay(next.state, t, opts).state;
}

/** Opens a step, if every step before it is done. */
export function goToStep(state: LifepathState, step: StepId, t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  const r = replay(state, t, opts);
  if (!r.rail.includes(step) || r.status[step] === 'blocked') return r.state;
  if (r.rail.indexOf(step) > r.rail.indexOf(r.current)) return r.state;
  return { ...r.state, step };
}

/** The step before this one on the rail. */
export function previousStep(state: LifepathState): StepId {
  const rail = railFor(state);
  return rail[Math.max(0, rail.indexOf(state.step) - 1)];
}

/** Marks the state finished once the soldier is written. */
export function markFinished(state: LifepathState, t: LpTables, opts: Parameters<typeof replay>[2] = {}): LifepathState {
  const s = clone(state);
  s.finished = true;
  if (!s.confirmed.includes('finish')) s.confirmed.push('finish');
  s.step = 'squad';
  return replay(s, t, opts).state;
}

/** Totals a finished soldier must meet (for the tests and the Finish page). */
export function finalChecks(f: FinalSoldier): { points: number; levels: number; top: number } {
  return { points: attributeTotal(f.attributes), levels: levelTotal(f.talents), top: Math.max(...Object.values(f.talents)) };
}
