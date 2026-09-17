/**
 * The round as a state machine, Wings, and the round-end steps with their ops and Undo
 * (data/engagement/round.yaml: round_steps, end_steps, wings; data/engagement/background-titans.yaml:
 * ticks, full_clock, retreat_clock, retreat; data/engagement/titan-harm.yaml: regeneration;
 * data/skirmish/skirmish.yaml: rounds, grit; ADR-0026). Pure and unit tested.
 */
import { fillRegeneration, type BodyPart, type RegenerationResult } from '../titan.ts';
import type { Mode, Step } from './types.ts';

// ---------------------------------------------------------------- steps

export const TITAN_STEPS: readonly Step[] = ['wings', 'deal', 'swap', 'play', 'end'];
export const SKIRMISH_STEPS: readonly Step[] = ['deal', 'play', 'end'];

export type EndCheck = 'gas-rolls' | 'regeneration' | 'background-clocks' | 'retreat-clock' | 'round-ends' | 'broken-leave' | 'ending';

/** The round-end checklist (end_steps; the background-clocks step's retreat clock is its own check). */
export const TITAN_CHECKS: readonly EndCheck[] = ['gas-rolls', 'regeneration', 'background-clocks', 'retreat-clock', 'round-ends'];
export const SKIRMISH_CHECKS: readonly EndCheck[] = ['broken-leave', 'ending'];

export type TrackerCategory = 'roundGas' | 'regeneration' | 'clocks' | 'strikes' | 'attacks' | 'skirmish';
export const TRACKER_CATEGORIES: readonly TrackerCategory[] = ['roundGas', 'regeneration', 'clocks', 'strikes', 'attacks', 'skirmish'];

/** The GM switch a check answers to; null for a check that changes nothing. */
export function checkCategory(check: EndCheck): TrackerCategory | null {
  switch (check) {
    case 'gas-rolls':
      return 'roundGas';
    case 'regeneration':
      return 'regeneration';
    case 'background-clocks':
    case 'retreat-clock':
      return 'clocks';
    case 'broken-leave':
      return 'skirmish';
    default:
      return null;
  }
}

export const stepsOf = (mode: Mode) => (mode === 'skirmish' ? SKIRMISH_STEPS : TITAN_STEPS);
export const checksOf = (mode: Mode) => (mode === 'skirmish' ? SKIRMISH_CHECKS : TITAN_CHECKS);

export type EntryState = 'waiting' | 'done' | 'undone' | 'skipped';

/** One document change a tracker step made. */
export type TrackerOp =
  | { t: 'set'; uuid: string; path: string; from: unknown; to: unknown }
  | { t: 'create'; uuid: string; parent: string; collection: string; data: Record<string, unknown> }
  | { t: 'message'; id: string };

export interface EndEntry {
  check: EndCheck;
  state: EntryState;
  ops: TrackerOp[];
  /** Plain lines the checklist shows under the step once it has run. */
  lines: string[];
}

export interface RoundCore {
  mode: Mode;
  step: Step;
  round: number;
  /** Wings have been assigned at a wings step of this engagement. */
  wingsSet: boolean;
  /** A change of Wings is allowed at the next wings step (wings.when). */
  wingsOpen: boolean;
  /** Squadmates whose player character died or left: assigned again at the next wings step. */
  reassign: string[];
  endLog: EndEntry[];
}

export type RoundAction = 'keep-wings' | 'deal' | 'begin-play' | 'finish-play' | 'next-round';

/** Why the action cannot be taken now (a key under WOF.Tracker.round), or null. */
export function roundBlock(core: RoundCore, action: RoundAction): string | null {
  const need = (step: Step) => (core.step === step ? null : 'wrongStep');
  switch (action) {
    case 'keep-wings':
      return core.mode === 'skirmish' ? 'skirmish' : need('wings');
    case 'deal':
      return need('deal');
    case 'begin-play':
      return core.mode === 'skirmish' ? 'skirmish' : need('swap');
    case 'finish-play':
      return need('play');
    case 'next-round':
      if (core.step !== 'end') return 'wrongStep';
      return endComplete(core) ? null : 'endOpen';
  }
}

/** The core after an action (the caller has checked roundBlock). */
export function roundNext(core: RoundCore, action: RoundAction): RoundCore {
  const block = roundBlock(core, action);
  if (block) throw new Error(`round action ${action} refused: ${block}`);
  switch (action) {
    case 'keep-wings':
      return { ...core, step: 'deal', wingsSet: true, wingsOpen: false, reassign: [] };
    case 'deal':
      return { ...core, step: core.mode === 'skirmish' ? 'play' : 'swap' };
    case 'begin-play':
      return { ...core, step: 'play' };
    case 'finish-play':
      return { ...core, step: 'end', endLog: checksOf(core.mode).map((check) => ({ check, state: 'waiting', ops: [], lines: [] })) };
    case 'next-round':
      return { ...core, step: core.mode === 'skirmish' ? 'deal' : 'wings', round: core.round + 1, endLog: [] };
  }
}

export const endComplete = (core: Pick<RoundCore, 'endLog'>) => core.endLog.length > 0 && core.endLog.every((e) => e.state === 'done' || e.state === 'skipped');

/** The next check to run in order, or -1. */
export const nextCheck = (log: readonly EndEntry[]) => log.findIndex((e) => e.state === 'waiting' || e.state === 'undone');

/**
 * The checks the automation runs now (ADR-0026): from the next open one onward while its category
 * is switched on. A switched-off check stops the run, since later checks read its result.
 */
export function autoChecks(log: readonly EndEntry[], enabled: Record<TrackerCategory, boolean>): number[] {
  const out: number[] = [];
  for (let i = nextCheck(log); i >= 0 && i < log.length; i++) {
    const e = log[i];
    if (e.state === 'done' || e.state === 'skipped') continue;
    if (e.state === 'undone') break;
    const cat = checkCategory(e.check);
    if (cat && !enabled[cat]) break;
    out.push(i);
  }
  return out;
}

/** Undoing a check first undoes every later check that ran, in reverse order. */
export function undoOrder(log: readonly EndEntry[], index: number): number[] {
  const out: number[] = [];
  for (let i = log.length - 1; i >= index; i--) if (log[i].state === 'done') out.push(i);
  return out;
}

const stable = (x: unknown) => JSON.stringify(x, (_k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v));

/**
 * The value Undo writes back for a set op: the value before, when the document still holds the
 * value the op wrote; a number another change moved since is moved back by the op's own delta; any
 * other later change is kept (undefined: skip and warn).
 */
export function revertValue(op: Extract<TrackerOp, { t: 'set' }>, current: unknown): { value: unknown } | undefined {
  if (stable(current) === stable(op.to)) return { value: op.from };
  if (typeof current === 'number' && typeof op.from === 'number' && typeof op.to === 'number') return { value: Math.max(0, current - (op.to - op.from)) };
  return undefined;
}

// ---------------------------------------------------------------- Wings

export interface WingInput {
  core: RoundCore;
  mate: { id: string; alive: boolean; pc: boolean };
  /** The player character, or null for no Wing. */
  pc: { id: string; alive: boolean; left: boolean; pc: boolean } | null;
  wings: Record<string, string>;
}

/** Whether Wings may be set now (wings.when): the first wings step, a change event, or a Squadmate to assign again. */
export function wingsEditable(core: RoundCore, mateId?: string): boolean {
  if (core.mode !== 'titan' || core.step !== 'wings') return false;
  return !core.wingsSet || core.wingsOpen || (mateId !== undefined && core.reassign.includes(mateId));
}

/** Why a Squadmate may not be put on this Wing (wings.assign), or null. */
export function wingBlock(x: WingInput): string | null {
  if (!wingsEditable(x.core, x.mate.id)) return 'closed';
  if (x.mate.pc) return 'notSquadmate';
  if (!x.mate.alive) return 'dead';
  if (!x.pc) return null;
  if (!x.pc.pc) return 'notPlayer';
  if (!x.pc.alive || x.pc.left) return 'pcGone';
  const taken = Object.entries(x.wings).find(([m, p]) => p === x.pc!.id && m !== x.mate.id);
  return taken ? 'full' : null;
}

export type WingEvent = { kind: 'death' | 'left'; soldier: string } | { kind: 'down' | 'grabbed'; soldier: string } | { kind: 'titan' };

/**
 * Records an event that opens the next wings step (wings.when). A player character's death or
 * departure also puts the Squadmate on their Wing on the list to be assigned again.
 */
export function noteWingEvent(core: RoundCore, event: WingEvent, wings: Record<string, string>): RoundCore {
  if (core.mode !== 'titan') return core;
  const reassign = [...core.reassign];
  if (event.kind === 'death' || event.kind === 'left') {
    for (const [mate, pc] of Object.entries(wings)) if (pc === event.soldier && !reassign.includes(mate)) reassign.push(mate);
  }
  return { ...core, wingsOpen: true, reassign };
}

// ---------------------------------------------------------------- round-end plans

/** gas-rolls: every soldier who used ODM Gear this round and is alive (odm-gear.yaml, gas_roll). */
export function gasRollsDue(odmUsed: readonly string[], alive: (id: string) => boolean): string[] {
  return [...new Set(odmUsed)].filter(alive);
}

export interface RegenInput {
  key: string;
  filled: number;
  clock: number;
  parts: readonly BodyPart[];
  openingsBy: readonly string[];
}

export interface RegenPlan {
  key: string;
  filled: number;
  parts: BodyPart[];
  openingsBy: string[];
  result: RegenerationResult | null;
}

/** regeneration: 1 segment on every living Focus Titan's clock, the when_full steps on a full one. */
export function planRegeneration(titans: readonly RegenInput[]): RegenPlan[] {
  return titans.map((t) => {
    const r = fillRegeneration(t.filled, t.clock, t.parts, t.openingsBy.length);
    return { key: t.key, filled: r.filled, parts: r.parts, openingsBy: r.result ? [] : [...t.openingsBy], result: r.result };
  });
}

export interface ClockRow {
  name: string;
  length: number;
  filled: number;
  /** The round it entered as a Focus Titan, or 0. */
  entered: number;
}

export interface BackgroundPlan {
  clocks: ClockRow[];
  /** Indexes of clocks that enter as Focus Titans, in tracker order. */
  enter: number[];
  /** A full clock with two Focus Titans alive: the engagement becomes a retreat. */
  retreat: boolean;
}

/**
 * background-clocks (ticks, end-of-round; full_clock): during no retreat, 1 segment on every
 * Background clock, then full clocks resolve in tracker order: one enters while fewer Focus Titans
 * than the limit are alive, else the engagement becomes a retreat.
 */
export function planBackground(clocks: readonly ClockRow[], focusAlive: number, limit: number, retreatActive: boolean, round: number, fill = 1): BackgroundPlan {
  const out = clocks.map((c) => ({ ...c }));
  if (retreatActive) return { clocks: out, enter: [], retreat: false };
  for (const c of out) if (!c.entered) c.filled = Math.min(c.length, c.filled + fill);
  let alive = focusAlive;
  const enter: number[] = [];
  let retreat = false;
  out.forEach((c, i) => {
    if (c.entered || c.filled < c.length) return;
    if (alive < limit) {
      c.entered = round;
      enter.push(i);
      alive++;
    } else retreat = true;
  });
  return { clocks: out, enter, retreat };
}

export interface RetreatClock {
  length: number;
  filled: number;
  active: boolean;
  /** The round it began, or 0. */
  began: number;
}

/** retreat-clock (ticks, retreat-clock): during no retreat, 1 segment; full makes a retreat. */
export function planRetreat(clock: RetreatClock, round: number): RetreatClock {
  if (clock.active) return { ...clock };
  const filled = Math.min(clock.length, clock.filled + 1);
  const full = filled >= clock.length;
  return { ...clock, filled, active: full, began: full ? round : clock.began };
}

/** A retreat that starts now (a Background clock with two Focus Titans alive). */
export const startRetreat = (clock: RetreatClock, round: number): RetreatClock => (clock.active ? { ...clock } : { ...clock, active: true, began: round });

/** The stay limit's rounds (retreat, moves): as many as the retreat clock has segments, counted from the round after it began. */
export function stayLimitLeft(clock: RetreatClock, round: number): number | null {
  if (!clock.active) return null;
  return Math.max(0, clock.length - Math.max(0, round - clock.began - 1));
}
