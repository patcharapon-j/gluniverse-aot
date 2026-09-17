/**
 * The wizard end to end, without Foundry: a soldier built by rolling (the website's Mira example, and
 * hundreds of seeded Lifepaths with and without the Exam) and soldiers built by choosing (the website's
 * Tomas example and a Template Build), each driven through the state operations to the commit plan.
 */
import { describe, expect, it } from 'vitest';
import { commitPlan } from '../src/lifepath/commit-plan.ts';
import { ATTRIBUTE_ORDER, attributeTotal, classRankFor, creationMax, type LpTables } from '../src/rules/lifepath.ts';
import {
  confirmStep,
  emptyState,
  finalChecks,
  markFinished,
  pushNeeds,
  recordD66,
  recordOrder,
  recordPerformance,
  recordPush,
  recordTrial,
  replay,
  setChoice,
  type LifepathState,
  type Replay,
} from '../src/rules/lifepath-state.ts';
import { buildTestConfig } from './wording-fixture.ts';

const config = buildTestConfig();
const t = config.lifepath as LpTables;
const o = { allowed: ['lifepath', 'template-build', 'free-build'] as ('lifepath' | 'template-build' | 'free-build')[] };

function rng(seed: number) {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 6) + 1;
  };
}

const faces = (n: number, d6: () => number) => Array.from({ length: n }, d6);

/** Plays one Lifepath to Finish with seeded dice, taking the first option at every choice. */
function autoLifepath(seed: number, exam: boolean, alone: boolean): { state: LifepathState; r: Replay; pushes: number } {
  const d6 = rng(seed);
  let s = emptyState();
  s = setChoice(s, 'procedure', 'lifepath', t, o);
  s = setChoice(s, 'year', 845 + (seed % 6), t, o);
  s = setChoice(s, 'exam', exam, t, o);
  let pushes = 0;
  for (let guard = 0; guard < 200; guard++) {
    const r = replay(s, t, o);
    if (r.final && r.current === 'finish') return { state: s, r, pushes };
    const step = r.current;
    const next = (() => {
      switch (step) {
        case 'campaign':
          return confirmStep(s, step, t, o);
        case 'origin': {
          if (!r.origin?.row) return recordD66(s, 'origin', { tens: d6(), units: d6() }, t, o);
          if (!s.origin.talent) return setChoice(s, 'origin.talent', r.origin.row.talents[seed % 2], t, o);
          if (!s.origin.haven) return setChoice(s, 'origin.haven', r.origin.row.havens[0], t, o);
          return confirmStep(s, step, t, o);
        }
        case 'enlist': {
          if (!s.enlist.roll) return recordD66(s, 'enlist', { tens: d6(), units: d6() }, t, o);
          if (r.enlist?.overflowNeeds) return setChoice(s, 'enlist.overflow', r.enlist.overflowNeeds[0], t, o);
          return confirmStep(s, step, t, o);
        }
        case 'year-1':
        case 'year-2':
        case 'year-3': {
          const i = Number(step.slice(-1)) - 1;
          const y = r.years[i];
          if (!s.years[i].roll) return recordD66(s, i as 0 | 1 | 2, { tens: d6(), units: d6() }, t, o);
          if (!s.years[i].talent && y.talentOptions.length) return setChoice(s, `years.${i}.talent`, y.talentOptions[seed % y.talentOptions.length], t, o);
          if (y.overflowNeeds) return setChoice(s, `years.${i}.overflow`, y.overflowNeeds[0], t, o);
          if (y.perf?.choose && !y.perf.attribute) return setChoice(s, `years.${i}.perfAttr`, y.perf.choose[1], t, o);
          if (!y.skipPerformance && !s.years[i].perf) return recordPerformance(s, i, faces(y.perf!.dice, d6), t, o);
          return confirmStep(s, step, t, o);
        }
        case 'exam': {
          if (!alone && s.alone) return setChoice(s, 'alone', false, t, o);
          const k = s.trials.findIndex((x) => !x.dice);
          if (k < 0) {
            // Push the squad field exercise once when the rules allow it.
            const d = r.trials[2];
            if (d.push === null && pushes === 0) {
              const covered = !alone && seed % 3 === 0;
              const need = pushNeeds(s, 2, covered)!;
              pushes++;
              return recordPush(s, 2, covered, { base: faces(need.base, d6), stress: faces(need.stress, d6) }, t, o);
            }
            return confirmStep(s, step, t, o);
          }
          const ts = s.trials[k];
          if (!alone && !ts.order.length) return recordOrder(s, k, d6(), t, o);
          if (!ts.entry) return setChoice(s, `trials.${k}.entry`, t.exam.trials[k].choices[seed % t.exam.trials[k].choices.length].entry, t, o);
          if (k === 2 && !alone && !ts.helped) return setChoice(s, `trials.${k}.helped`, true, t, o);
          if (k === 2 && !alone && ts.coverStress === 0 && seed % 4 === 0) return setChoice(s, `trials.${k}.coverStress`, 1, t, o);
          const p = r.trials[k].pool!;
          return recordTrial(s, k, { base: faces(p.base, d6), gear: faces(p.gear, d6), stress: faces(p.stress, d6) }, t, o);
        }
        case 'graduation': {
          const g = r.grad!;
          if (!s.specialty) return setChoice(s, 'specialty', t.specialties[seed % t.specialties.length].id, t, o);
          if (g.swap && g.swap.length > 1 && !s.grad.swapWith) return setChoice(s, 'grad.swapWith', g.swap[g.swap.length - 1], t, o);
          if (g.floor.needs) return setChoice(s, 'grad.floor', [...s.grad.floor, g.floor.needs[0]], t, o);
          if (!s.grad.talent) return setChoice(s, 'grad.talent', g.talentOptions[0], t, o);
          return confirmStep(s, step, t, o);
        }
        default:
          throw new Error(`stuck at ${step}`);
      }
    })();
    if (next === s) throw new Error(`no progress at ${step} (seed ${seed})`);
    s = next;
  }
  throw new Error(`seed ${seed} did not finish`);
}

function checkLifepathSoldier(r: Replay, seed: number) {
  const f = r.final!;
  const key = t.specialties.find((x) => x.id === f.specialty)!.key;
  const c = finalChecks(f);
  const top10 = classRankFor(t.classRank, f.merit!).top10;
  expect(c.points, `seed ${seed}`).toBe(top10 ? 19 : 18);
  expect(c.levels, `seed ${seed}`).toBe(5);
  for (const [id, lv] of Object.entries(f.talents)) expect(lv, `seed ${seed} ${id}`).toBeLessThanOrEqual(creationMax(t, id));
  for (const a of ATTRIBUTE_ORDER) {
    expect(f.attributes[a]).toBeGreaterThanOrEqual(2);
    expect(f.attributes[a]).toBeLessThanOrEqual(a === key ? 6 : 5);
    expect(f.attributes[key]).toBeGreaterThanOrEqual(f.attributes[a]);
  }
  expect(f.attributes[key]).toBeGreaterThanOrEqual(4);
  expect(f.health).toBe(Math.ceil((f.attributes.strength + f.attributes.agility) / 2));
  expect(f.resolve).toBe(Math.ceil((f.attributes.instinct + f.attributes.empathy) / 2));
  expect(f.classRank).toBe(classRankFor(t.classRank, f.merit!).rank);
  expect(f.declined).toBe(top10);
}

describe('a soldier built by rolling', () => {
  it("rolls the website's Mira Hollen exactly", () => {
    let s = emptyState();
    s = setChoice(s, 'procedure', 'lifepath', t, o);
    s = setChoice(s, 'year', 846, t, o);
    s = setChoice(s, 'exam', false, t, o);
    s = confirmStep(s, 'campaign', t, o);
    s = recordD66(s, 'origin', { tens: 2, units: 5 }, t, o);
    s = setChoice(s, 'origin.talent', 'horsemanship', t, o);
    s = setChoice(s, 'origin.haven', 'The family farm', t, o);
    s = confirmStep(s, 'origin', t, o);
    s = recordD66(s, 'enlist', { tens: 4, units: 2 }, t, o);
    s = confirmStep(s, 'enlist', t, o);
    // First Year: 44, Fire in the stables; Keen Eyes; Strength 4 against Instinct 2, one success.
    s = recordD66(s, 0, { tens: 4, units: 4 }, t, o);
    s = setChoice(s, 'years.0.talent', 'keen-eyes', t, o);
    let r = replay(s, t, o);
    expect(r.years[0].perf).toEqual({ attribute: 'strength', dice: 4, choose: null });
    expect(r.merit['year-1']).toBe(1);
    s = recordPerformance(s, 0, [6, 4, 2, 1], t, o);
    expect(replay(s, t, o).merit['year-1']).toBe(2);
    s = confirmStep(s, 'year-1', t, o);
    // Second Year: 13, The wooden nape; Clean Cut; Perception 4 over Agility 2.
    s = recordD66(s, 1, { tens: 1, units: 3 }, t, o);
    s = setChoice(s, 'years.1.talent', 'clean-cut', t, o);
    r = replay(s, t, o);
    expect(r.years[1].perf).toMatchObject({ attribute: 'perception', dice: 4 });
    s = recordPerformance(s, 1, [6, 3, 3, 2], t, o);
    s = confirmStep(s, 'year-2', t, o);
    expect(replay(s, t, o).merit['year-2']).toBe(5);
    // Third Year: 34, Arguing with an instructor; Silver Tongue; Empathy 3 over Wits 2.
    s = recordD66(s, 2, { tens: 3, units: 4 }, t, o);
    s = setChoice(s, 'years.2.talent', 'silver-tongue', t, o);
    r = replay(s, t, o);
    expect(r.years[2].perf).toMatchObject({ attribute: 'empathy', dice: 3 });
    expect(r.merit['year-3']).toBe(4);
    s = recordPerformance(s, 2, [5, 6, 1], t, o);
    s = confirmStep(s, 'year-3', t, o);
    // Graduation: Merit 5 is Class Rank 25; Slayer; nothing swaps; Clean Cut to 2.
    s = setChoice(s, 'specialty', 'slayer', t, o);
    r = replay(s, t, o);
    expect(r.grad).toMatchObject({ meritTotal: 5, rank: { rank: 25, top10: false }, swap: null });
    expect(r.grad!.talentOptions).toContain('clean-cut');
    s = setChoice(s, 'grad.talent', 'clean-cut', t, o);
    s = confirmStep(s, 'graduation', t, o);
    s = setChoice(s, 'finish.name', 'Mira Hollen', t, o);
    r = replay(s, t, o);
    expect(r.current).toBe('finish');
    expect(r.final).toMatchObject({
      name: 'Mira Hollen',
      attributes: { strength: 5, agility: 2, wits: 2, perception: 4, instinct: 2, empathy: 3 },
      talents: { 'clean-cut': 2, horsemanship: 1, 'keen-eyes': 1, 'silver-tongue': 1 },
      merit: 5,
      classRank: 25,
      declined: false,
      health: 4,
      resolve: 3,
      haven: 'The family farm',
      origin: 'wall-rose-farm',
      specialty: 'slayer',
      canonTie: '',
    });
    expect(r.final!.drive).toMatch(/^Shield the Walls: When I took Draw Attention/);
    // As a Tactician, her Instinct 2 would have swapped with her Strength 5.
    expect(replay(setChoice(s, 'specialty', 'tactician', t, o), t, o).grad!.swap).toEqual(['strength']);

    const plan = commitPlan(r.final!, s, t, [{ id: 'x1', type: 'talent' }, { id: 'x2', type: 'origin' }], [], '');
    expect(plan.system).toMatchObject({ attributes: r.final!.attributes, merit: 5, class_rank: 25, declined_military_police: false, rank: 'private', stress: 0, health_lost: 0, down: false, grief: 0, scars: [], gas_rating: 3, spare_canisters: [3] });
    expect(plan.remove).toEqual(['x1', 'x2']);
    expect(plan.create.filter((c) => c.pack === 'talents')).toEqual([
      { pack: 'talents', key: 'horsemanship', system: { level: 1, used: false } },
      { pack: 'talents', key: 'keen-eyes', system: { level: 1, used: false } },
      { pack: 'talents', key: 'clean-cut', system: { level: 2, used: false } },
      { pack: 'talents', key: 'silver-tongue', system: { level: 1, used: false } },
    ]);
    expect(plan.create.filter((c) => c.pack === 'gear').map((c) => c.key)).toEqual(['odm-gear', 'blade-set', 'blade-set', 'blade-set', 'horse']);

    const done = markFinished(s, t, o);
    const after = replay(done, t, o);
    expect(after.status.finish).toBe('done');
    expect(after.current).toBe('squad');
    expect(setChoice(done, 'origin.haven', 'x', t, o)).toBe(done);
    expect(setChoice(done, 'finish.comrade', 'Bruno', t, o).finish.comrade).toBe('Bruno');
  });

  it('finishes every seeded Lifepath inside the rules, without the Exam', () => {
    for (let seed = 1; seed <= 250; seed++) checkLifepathSoldier(autoLifepath(seed, false, true).r, seed);
  });

  it('finishes every seeded Lifepath inside the rules, with the Exam alone or in a group', () => {
    let pushed = 0;
    for (let seed = 1; seed <= 250; seed++) {
      const { r, state, pushes } = autoLifepath(seed * 7 + 3, true, seed % 2 === 0);
      checkLifepathSoldier(r, seed);
      pushed += pushes;
      expect(state.years[2].perf).toBeNull();
      const exam = r.trials.reduce((n, x) => n + (x.merit ?? 0), 0);
      expect(r.examMerit).toBe(exam);
      for (const [k, x] of r.trials.entries()) {
        const tr = state.trials[k];
        const hits = [...tr.dice!.base, ...tr.dice!.gear, ...tr.dice!.stress].filter((f) => f === 6).length;
        expect(x.merit).toBe((hits >= x.trial.needs ? 1 : 0) - (tr.response ? 1 : 0));
        if (k < 2) expect(tr.covers).toEqual([]);
      }
    }
    expect(pushed).toBeGreaterThan(0);
  });

  it('charges a Stress Response in the squad field exercise and blocks the Push', () => {
    let { state: s } = autoLifepath(11, true, false);
    // Replay the last Trial with a Stress Die showing 1.
    s = { ...s, trials: s.trials.map((x, k) => (k === 2 ? { ...x, dice: null, covers: [], fresh: -1, response: false, coverStress: 1 } : x)) };
    const r = replay(s, t, o);
    const p = r.trials[2].pool!;
    expect(p.stress).toBe(1);
    s = recordTrial(s, 2, { base: Array(p.base).fill(6), gear: Array(p.gear).fill(2), stress: [1] }, t, o);
    const after = replay(s, t, o);
    expect(s.trials[2].response).toBe(true);
    expect(after.trials[2].push).toBe('stress-one');
    expect(after.trials[2].merit).toBe(0);
  });

  it('pushes the squad field exercise: re-rolls the non-6 dice and adds a Stress Die unless Covered', () => {
    let { state: s } = autoLifepath(5, true, false);
    s = { ...s, trials: s.trials.map((x, k) => (k === 2 ? { ...x, entry: 'rally', dice: null, covers: [], fresh: -1, response: false, coverStress: 0, helped: true } : x)) };
    const pool = replay(s, t, o).trials[2].pool!;
    s = recordTrial(s, 2, { base: [6, ...Array(pool.base - 1).fill(3)], gear: [], stress: [] }, t, o);
    expect(pushNeeds(s, 2, false)).toEqual({ base: pool.base - 1, stress: 1 });
    expect(pushNeeds(s, 2, true)).toEqual({ base: pool.base - 1, stress: 0 });
    const pushed = recordPush(s, 2, false, { base: Array(pool.base - 1).fill(6), stress: [4] }, t, o);
    expect(pushed.trials[2].dice).toEqual({ base: Array(pool.base).fill(6), gear: [], stress: [4] });
    expect(pushed.trials[2].fresh).toBe(0);
    expect(replay(pushed, t, o).trials[2]).toMatchObject({ successes: pool.base, merit: 1, push: 'already-pushed' });
    // No second Push without Sure Hands.
    expect(recordPush(pushed, 2, true, { base: [], stress: [] }, t, o)).toBe(pushed);
  });
});

describe('a soldier built by choosing', () => {
  function build(procedure: 'free-build' | 'template-build', specialty: string, talents: string[]) {
    let s = emptyState();
    s = setChoice(s, 'procedure', procedure, t, o);
    s = setChoice(s, 'year', 847, t, o);
    s = confirmStep(s, 'campaign', t, o);
    s = setChoice(s, 'specialty', specialty, t, o);
    s = confirmStep(s, 'specialty', t, o);
    return { s, talents };
  }

  it("builds the website's Tomas Wendel with the Free Build", () => {
    let { s } = build('free-build', 'slayer', []);
    s = setChoice(s, 'built.shape', 'two-fours', t, o);
    for (const [a, v] of Object.entries({ strength: 4, agility: 4, perception: 3, instinct: 3, wits: 2, empathy: 2 })) s = setChoice(s, `built.placement.${a}`, v, t, o);
    expect(replay(s, t, o).status.attributes).toBe('ready');
    // A 4 off the key attribute is refused.
    const wrong = setChoice(setChoice(s, 'built.placement.strength', 3, t, o), 'built.placement.perception', 4, t, o);
    expect(replay(wrong, t, o).status.attributes).toBe('todo');
    s = confirmStep(s, 'attributes', t, o);
    s = setChoice(s, 'origin.row', 'underground-city', t, o);
    s = setChoice(s, 'origin.talent', 'grip-breaker', t, o);
    s = setChoice(s, 'origin.haven', 'Friends still living below', t, o);
    let r = replay(s, t, o);
    // The row's Agility and Instinct gain nothing.
    expect(r.attrs.origin).toMatchObject({ agility: 4, instinct: 3 });
    s = confirmStep(s, 'origin', t, o);
    s = setChoice(s, 'enlist.drive', 'family-duty', t, o);
    s = confirmStep(s, 'drive', t, o);
    s = setChoice(s, 'built.stories', [0, null, 5], t, o);
    s = confirmStep(s, 'stories', t, o);
    s = setChoice(s, 'grad.talent', 'clean-cut', t, o);
    s = setChoice(s, 'built.any', ['clean-cut', 'hamstringer', 'field-medicine'], t, o);
    r = replay(s, t, o);
    expect(r.status.talents).toBe('ready');
    // Only one Talent at level 2: a second 2 is not offered.
    expect(r.builtTalents!.anyOptions).toEqual([]);
    const two = replay(setChoice(s, 'built.any', ['clean-cut', 'hamstringer', 'hamstringer'], t, o), t, o);
    expect(two.state.built.any).toEqual(['clean-cut', 'hamstringer']);
    expect(two.builtTalents!.anyOptions).not.toContain('hamstringer');
    expect(two.builtTalents!.anyOptions).not.toContain('clean-cut');
    s = confirmStep(s, 'talents', t, o);
    s = confirmStep(s, 'merit', t, o);
    s = setChoice(s, 'finish.name', 'Tomas Wendel', t, o);
    r = replay(s, t, o);
    expect(r.current).toBe('finish');
    expect(r.final).toMatchObject({
      procedure: 'free-build',
      attributes: { strength: 4, agility: 4, wits: 2, perception: 3, instinct: 3, empathy: 2 },
      talents: { 'grip-breaker': 1, 'clean-cut': 2, hamstringer: 1, 'field-medicine': 1 },
      merit: null,
      classRank: null,
      declined: false,
      health: 4,
      resolve: 3,
    });
    expect(r.final!.stories).toEqual([
      { year: t.years[0].title, event: t.years[0].events[0].name },
      { year: t.years[2].title, event: t.years[2].events[5].name },
    ]);
    expect(finalChecks(r.final!)).toEqual({ points: 18, levels: 5, top: 2 });
    const plan = commitPlan(r.final!, s, t, [], [], '<p>Notes</p>');
    expect(plan.system).toMatchObject({ merit: null, class_rank: null, declined_military_police: false });
    expect(plan.system.notes).toContain(t.years[0].events[0].name);
    expect(String(plan.system.notes).startsWith('<p>Notes</p>')).toBe(true);
  });

  it('builds a Template Build Medic with its template ratings and a medical kit, honouring declines', () => {
    let { s } = build('template-build', 'medic', []);
    let r = replay(s, t, o);
    expect(r.status.attributes).toBe('ready');
    expect(r.attrs.attributes).toEqual(t.specialties.find((x) => x.id === 'medic')!.template);
    s = confirmStep(s, 'attributes', t, o);
    // An Origin the Campaign Year does not allow is refused.
    expect(setChoice(s, 'origin.row', 'wall-maria-refugee', t, o).origin.row).toBeNull();
    s = setChoice(s, 'origin.row', 'doctors-household', t, o);
    s = setChoice(s, 'origin.talent', 'field-medicine', t, o);
    s = setChoice(s, 'origin.haven', "Your parent's clinic", t, o);
    s = setChoice(s, 'origin.canonTie', true, t, o);
    expect(s.origin.canonTie).toBe(false); // the row has no Canon Tie
    s = confirmStep(s, 'origin', t, o);
    s = setChoice(s, 'enlist.drive', 'followed-a-friend', t, o);
    s = confirmStep(s, 'drive', t, o);
    s = confirmStep(s, 'stories', t, o);
    r = replay(s, t, o);
    expect(r.builtTalents!.specialtyOptions).toContain('field-medicine');
    expect(r.builtTalents!.specialtyOptions).not.toContain('lure');
    s = setChoice(s, 'grad.talent', 'sure-hands', t, o);
    s = setChoice(s, 'built.any', ['field-medicine', 'careful-nursing', 'iron-nerve'], t, o);
    s = confirmStep(s, 'talents', t, o);
    s = confirmStep(s, 'merit', t, o);
    s = setChoice(s, 'finish.name', 'Ada Brandt', t, o);
    s = setChoice(s, 'finish.blades', 1, t, o);
    r = replay(s, t, o);
    const f = r.final!;
    expect(f).toMatchObject({ procedure: 'template-build', driveNeedsComrade: true, talents: { 'field-medicine': 2, 'sure-hands': 1, 'careful-nursing': 1, 'iron-nerve': 1 } });
    expect(attributeTotal(f.attributes)).toBe(18);
    expect(f.attributes.wits).toBe(4);
    const plan = commitPlan(f, s, t, [], [], '');
    expect(plan.create.filter((c) => c.pack === 'gear').map((c) => c.key)).toEqual(['odm-gear', 'blade-set', 'blade-set', 'horse', 'medical-kit']);
    expect(plan.issue.offered).toEqual({ spares: 1, blades: 3, item: true });
  });
});
