/** The wizard's state and replay (src/rules/lifepath-state.ts): statuses, locks, Back, and the stored shape. */
import { describe, expect, it } from 'vitest';
import type { LpTables } from '../src/rules/lifepath.ts';
import {
  clearRoll,
  clearStep,
  confirmStep,
  emptyState,
  facesFor,
  goToStep,
  locksOf,
  normalizeState,
  railFor,
  recordBoard,
  recordD66,
  recordPerformance,
  replay,
  restartState,
  setChoice,
  setPerformanceResult,
  unfinish,
  type LifepathState,
} from '../src/rules/lifepath-state.ts';
import { buildTestConfig } from './wording-fixture.ts';

const t = buildTestConfig().lifepath as LpTables;
const opts = { allowed: ['lifepath', 'template-build', 'free-build'] as const };
const o = { allowed: [...opts.allowed] };

/** Campaign 846, no Exam, Origin 25 (Wall Rose Farm) with Horsemanship and the family farm. */
function throughOrigin(): LifepathState {
  let s = emptyState();
  s = setChoice(s, 'procedure', 'lifepath', t, o);
  s = setChoice(s, 'year', 846, t, o);
  s = setChoice(s, 'exam', false, t, o);
  s = confirmStep(s, 'campaign', t, o);
  s = recordD66(s, 'origin', { tens: 2, units: 5 }, t, o);
  s = setChoice(s, 'origin.talent', 'horsemanship', t, o);
  s = setChoice(s, 'origin.haven', 'The family farm', t, o);
  return confirmStep(s, 'origin', t, o);
}

describe('the stored state', () => {
  it('always has every key, and reads a partial or foreign value into that shape', () => {
    const empty = emptyState();
    expect(normalizeState(undefined)).toEqual(empty);
    expect(normalizeState({ v: 2 })).toEqual(empty);
    const partial = normalizeState({ v: 1, year: 847, origin: { talent: 'lure', junk: 1 }, years: [{ roll: { tens: 1, units: 1 } }] });
    expect(Object.keys(partial)).toEqual(Object.keys(empty));
    expect(partial.origin).toEqual({ ...empty.origin, talent: 'lure' });
    expect(partial.years[0]).toEqual({ ...empty.years[0], roll: { tens: 1, units: 1 } });
    expect(partial.years).toHaveLength(3);
  });

  it('survives a JSON round trip unchanged', () => {
    const s = throughOrigin();
    expect(normalizeState(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });
});

describe('replay', () => {
  it('starts at the campaign step and blocks the rest', () => {
    const r = replay(emptyState(), t, o);
    expect(r.current).toBe('campaign');
    expect(r.status.campaign).toBe('todo');
    expect(r.status.origin).toBe('blocked');
    expect(r.rail).not.toContain('exam');
  });

  it('refuses a procedure the campaign does not allow', () => {
    const s = setChoice(setChoice(emptyState(), 'procedure', 'free-build', t), 'year', 846, t);
    expect(replay(s, t, { allowed: ['lifepath'] }).status.campaign).toBe('todo');
    expect(replay(s, t, o).status.campaign).toBe('ready');
    expect(railFor(s)).toContain('attributes');
  });

  it("uses the world's Campaign Year until the Origin is rolled", () => {
    const s = setChoice(emptyState(), 'year', 845, t);
    expect(replay(s, t, { worldYear: 849 }).state.year).toBe(849);
  });

  it('rolls the Origin again while its row fails the Campaign Year', () => {
    let s = emptyState();
    for (const [k, v] of [['procedure', 'lifepath'], ['year', 846], ['exam', false]] as const) s = setChoice(s, k, v, t, o);
    s = confirmStep(s, 'campaign', t, o);
    s = recordD66(s, 'origin', { tens: 1, units: 5 }, t, o); // Wall Maria Refugee needs 848
    let r = replay(s, t, o);
    expect(r.origin).toMatchObject({ row: null, rollAgain: true });
    s = recordD66(s, 'origin', { tens: 6, units: 4 }, t, o);
    r = replay(s, t, o);
    expect(r.origin?.row?.id).toBe('horse-ranch');
    expect(r.origin?.rolls.map((x) => x.kept)).toEqual([false, true]);
    // A kept row takes no further roll.
    expect(recordD66(s, 'origin', { tens: 1, units: 1 }, t, o)).toBe(s);
  });

  it('records the rolled Drive by default and keeps the attribute point with the rolled row', () => {
    let s = throughOrigin();
    s = recordD66(s, 'enlist', { tens: 4, units: 2 }, t, o);
    expect(s.enlist.drive).toBe('protect-the-people');
    s = setChoice(s, 'enlist.drive', 'family-duty', t, o);
    const r = replay(s, t, o);
    expect(r.attrs.enlist).toMatchObject({ strength: 4, empathy: 2 });
    expect(r.status.enlist).toBe('ready');
  });

  it('never takes a second roll where one was made', () => {
    let s = throughOrigin();
    s = recordD66(s, 'enlist', { tens: 4, units: 2 }, t, o);
    expect(recordD66(s, 'enlist', { tens: 1, units: 1 }, t, o)).toBe(s);
  });
});

/** Through the Origin, Why You Enlisted, and Year 1's event (Stable duty: 54). */
function throughYear1Event(): LifepathState {
  let s = throughOrigin();
  s = recordD66(s, 'enlist', { tens: 4, units: 2 }, t, o);
  s = confirmStep(s, 'enlist', t, o);
  return recordD66(s, 0, { tens: 5, units: 4 }, t, o);
}

describe('Back and locks', () => {
  it('lets an earlier choice change before a pool roll, clearing a later choice it made invalid', () => {
    // Church Orphanage (54): Steady Voice or Iron Nerve. Year 1, The first inspection (11): Iron Nerve or Long Haul.
    let s = emptyState();
    for (const [k, v] of [['procedure', 'lifepath'], ['year', 846], ['exam', false]] as const) s = setChoice(s, k, v, t, o);
    s = confirmStep(s, 'campaign', t, o);
    s = recordD66(s, 'origin', { tens: 5, units: 4 }, t, o);
    s = setChoice(s, 'origin.talent', 'steady-voice', t, o);
    s = setChoice(s, 'origin.haven', 'The priest who raised you', t, o);
    s = confirmStep(s, 'origin', t, o);
    s = recordD66(s, 'enlist', { tens: 1, units: 1 }, t, o);
    s = confirmStep(s, 'enlist', t, o);
    s = recordD66(s, 0, { tens: 1, units: 1 }, t, o);
    s = setChoice(s, 'years.0.talent', 'iron-nerve', t, o);
    expect(replay(s, t, o).levels['year-1']).toEqual({ 'steady-voice': 1, 'iron-nerve': 1 });
    // Back to the Origin: Iron Nerve there leaves Year 1's Iron Nerve over its max level.
    s = goToStep(s, 'origin', t, o);
    expect(s.step).toBe('origin');
    s = setChoice(s, 'origin.talent', 'iron-nerve', t, o);
    const r = replay(s, t, o);
    expect(r.state.years[0].talent).toBeNull();
    expect(r.years[0].talentOptions).not.toContain('iron-nerve');
    expect(r.years[0].eventTalents).toEqual(['long-haul', 'steady-heart']);
    expect(r.status.origin).toBe('done');
    expect(r.status['year-1']).toBe('todo');
    // The rolls stay.
    expect(r.state.years[0].roll).toEqual({ tens: 1, units: 1 });
    expect(r.attrs['year-1']).toMatchObject({ strength: 4, instinct: 3, empathy: 3 });
  });

  it('drops the confirmation of every step after one that is no longer complete', () => {
    let s = throughYear1Event();
    s = setChoice(s, 'years.0.talent', 'fieldcraft', t, o);
    const broken = replay({ ...s, confirmed: [...s.confirmed, 'year-1', 'year-2'], origin: { ...s.origin, haven: null } }, t, o);
    expect(broken.current).toBe('origin');
    expect(broken.state.confirmed).toEqual(['campaign']);
    expect(broken.status['year-1']).toBe('blocked');
  });

  it('fixes every choice a performance roll read, and the procedure and Campaign Year once rolled', () => {
    let s = throughYear1Event();
    s = setChoice(s, 'years.0.talent', 'fieldcraft', t, o);
    expect(locksOf(s).has('procedure')).toBe(true);
    expect(locksOf(s).has('year')).toBe(true);
    expect(locksOf(s).has('origin.talent')).toBe(false);
    const r = replay(s, t, o);
    s = recordPerformance(s, 0, Array.from({ length: r.years[0].perf!.dice }, () => 6), t, o);
    const locks = locksOf(s);
    for (const k of ['origin.talent', 'enlist.overflow', 'years.0.talent', 'years.0.overflow', 'years.0.perfAttr', 'exam']) expect(locks.has(k)).toBe(k !== 'exam');
    expect(setChoice(s, 'origin.talent', 'strong-back', t, o)).toBe(s);
    expect(setChoice(s, 'years.0.talent', 'horsemanship', t, o)).toBe(s);
    expect(setChoice(s, 'year', 850, t, o)).toBe(s);
    // A choice no roll read stays open.
    expect(setChoice(s, 'origin.haven', 'A grandparent too old to work the fields', t, o).origin.haven).toBe('A grandparent too old to work the fields');
    expect(setChoice(s, 'enlist.drive', 'nothing-left', t, o).enlist.drive).toBe('nothing-left');
  });

  it('refuses a performance roll with the wrong number of dice, or a second one', () => {
    let s = throughYear1Event();
    s = setChoice(s, 'years.0.talent', 'fieldcraft', t, o);
    const dice = replay(s, t, o).years[0].perf!.dice;
    expect(recordPerformance(s, 0, [6], t, o)).toBe(s);
    const once = recordPerformance(s, 0, Array.from({ length: dice }, () => 1), t, o);
    expect(once.years[0].perf).toHaveLength(dice);
    expect(recordPerformance(once, 0, Array.from({ length: dice }, () => 6), t, o)).toBe(once);
  });

  it('only opens a step once every step before it is done', () => {
    const s = throughYear1Event();
    expect(goToStep(s, 'graduation', t, o).step).toBe(s.step);
    expect(goToStep(s, 'campaign', t, o).step).toBe('campaign');
  });
});

describe("the Exam board", () => {
  /** Campaign 846 with the Exam voted, through the Origin. */
  function withExam(): LifepathState {
    let s = emptyState();
    s = setChoice(s, 'procedure', 'lifepath', t, o);
    s = setChoice(s, 'year', 846, t, o);
    s = setChoice(s, 'exam', true, t, o);
    return confirmStep(s, 'campaign', t, o);
  }

  it("records the tens die as the Stage's Trial and the units die as its condition", () => {
    const s = recordBoard(withExam(), 0, { tens: 3, units: 1 }, t, o);
    expect(s.trials[0].board).toEqual({ tens: 3, units: 1 });
    // The rest of the Lifepath is still to come, so the Exam step is not computed yet; the
    // Trial and the condition the board names are read from the tables (lifepath-rules.test.ts).
    expect(t.exam.stages[0].trials.find((x) => x.result === 3)).toBeDefined();
    expect(t.exam.conditions.find((c) => c.result === 1)).toBeDefined();
  });

  it('refuses a board that is not two dice, and refuses a second roll', () => {
    const s = withExam();
    expect(recordBoard(s, 0, { tens: 7, units: 1 }, t, o)).toBe(s);
    expect(recordBoard(s, 0, { tens: 0, units: 3 }, t, o)).toBe(s);
    const once = recordBoard(s, 0, { tens: 2, units: 3 }, t, o);
    expect(recordBoard(once, 0, { tens: 5, units: 5 }, t, o)).toBe(once);
    // The GM's override rolls it again.
    expect(recordBoard(once, 0, { tens: 5, units: 5 }, t, { ...o, gm: true }).trials[0].board).toEqual({ tens: 5, units: 5 });
  });

  it("takes the campaign's board over this Cadet's own, so the whole class sits the same Trial", () => {
    const s = recordBoard(withExam(), 0, { tens: 1, units: 3 }, t, o);
    const shared = replay(s, t, { ...o, worldBoard: [64, null, null] });
    expect(shared.state.trials[0].board).toEqual({ tens: 6, units: 4 });
    // A Stage the campaign has not rolled is left as this Cadet has it.
    expect(replay(s, t, { ...o, worldBoard: [null, null, null] }).state.trials[0].board).toEqual({ tens: 1, units: 3 });
  });
});

describe("the GM's overrides", () => {
  it('turns every lock off, so a choice a later roll fixed can still change', () => {
    let s = throughYear1Event();
    s = setChoice(s, 'years.0.talent', 'fieldcraft', t, o);
    const dice = replay(s, t, o).years[0].perf!.dice;
    s = recordPerformance(s, 0, Array.from({ length: dice }, () => 1), t, o);
    expect(locksOf(s).has('origin.talent')).toBe(true);
    expect(setChoice(s, 'origin.talent', 'long-haul', t, o)).toBe(s);
    const gm = { ...o, gm: true };
    expect(setChoice(s, 'origin.talent', 'long-haul', t, gm).origin.talent).toBe('long-haul');
    expect(replay(s, t, gm).locks.size).toBe(0);
  });

  it('clears a step and everything after it, and opens the cleared step', () => {
    const s = throughYear1Event();
    const cleared = clearStep(s, 'enlist', t, { ...o, gm: true });
    expect(cleared.enlist).toEqual(emptyState().enlist);
    expect(cleared.years[0]).toEqual(emptyState().years[0]);
    expect(cleared.origin.row).toBe(s.origin.row);
    expect(cleared.confirmed).not.toContain('enlist');
    expect(cleared.step).toBe('enlist');
  });

  it('throws one roll away without touching the rest of its step', () => {
    let s = throughYear1Event();
    s = setChoice(s, 'years.0.talent', 'fieldcraft', t, o);
    const dice = replay(s, t, o).years[0].perf!.dice;
    s = recordPerformance(s, 0, Array.from({ length: dice }, () => 6), t, o);
    const again = clearRoll(s, 'years.0.perf', t, { ...o, gm: true });
    expect(again.years[0].perf).toBeNull();
    expect(again.years[0].roll).toEqual(s.years[0].roll);
    expect(again.years[0].talent).toBe('fieldcraft');
  });

  it('writes a performance roll straight to a number of successes', () => {
    let s = throughYear1Event();
    s = setChoice(s, 'years.0.talent', 'fieldcraft', t, o);
    const gm = { ...o, gm: true };
    const dice = replay(s, t, gm).years[0].perf!.dice;
    const two = setPerformanceResult(s, 0, 2, t, gm);
    expect(two.years[0].perf).toEqual(facesFor(dice, 2));
    expect(replay(two, t, gm).years[0].perfSuccesses).toBe(2);
    // More successes than dice is clamped, and no face is ever a 1.
    const all = setPerformanceResult(s, 0, 99, t, gm);
    expect(replay(all, t, gm).years[0].perfSuccesses).toBe(dice);
    expect(all.years[0].perf).not.toContain(1);
  });

  it('starts a file over, keeping only the name, and re-opens a filed one', () => {
    let s = throughYear1Event();
    s = { ...s, finished: true, finish: { ...s.finish, name: 'Mira' } };
    expect(unfinish(s, t, { ...o, gm: true }).finished).toBe(false);
    const fresh = restartState(s, { name: true });
    expect(fresh.finish.name).toBe('Mira');
    expect(fresh.origin).toEqual(emptyState().origin);
    expect(restartState(s).finish.name).toBe('');
  });
});
