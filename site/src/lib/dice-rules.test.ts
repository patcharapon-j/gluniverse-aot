import { describe, expect, it } from 'vitest';
import {
  applyPush,
  checkPush,
  clampPool,
  clampPushes,
  d6,
  planPush,
  planSize,
  poolKinds,
  push,
  startRoll,
  summarize,
  type Pool,
} from './dice-rules';

const pool = (p: Partial<Pool>): Pool => ({ base: 0, gear: 0, stress: 0, titan: 0, ...p });
const values = (state: ReturnType<typeof startRoll>) => state.dice.map((d) => d.value);

describe('building and rolling a pool', () => {
  it('lists dice in build order: base, Gear, Stress, Titan', () => {
    expect(poolKinds(pool({ base: 2, gear: 1, stress: 1, titan: 1 }))).toEqual(['base', 'base', 'gear', 'stress', 'titan']);
  });

  it('clamps counts and Push allowances to the tray limits', () => {
    expect(clampPool({ base: 40, gear: 9, stress: -2, titan: '4' })).toEqual({ base: 12, gear: 3, stress: 0, titan: 4 });
    expect(clampPool(undefined)).toEqual({ base: 0, gear: 0, stress: 0, titan: 0 });
    expect(clampPushes(0)).toBe(1);
    expect(clampPushes(9)).toBe(5);
  });

  it('rejects the wrong number of values or values outside 1 to 6', () => {
    expect(() => startRoll(pool({ base: 2 }), [6])).toThrow();
    expect(() => startRoll(pool({ base: 1 }), [7])).toThrow();
  });

  it('keeps d6 within 1 to 6 at the edges of the random source', () => {
    expect(d6(() => 0)).toBe(1);
    expect(d6(() => 0.999999)).toBe(6);
    expect(d6(() => 1)).toBe(6);
  });

  it('counts a 6 on base, Gear, and Stress Dice as a success', () => {
    const state = startRoll(pool({ base: 2, gear: 1, stress: 1 }), [6, 5, 6, 6]);
    expect(summarize(state).successes).toBe(3);
  });

  it('counts a 5 or 6 on Titan Dice, apart from soldier successes', () => {
    const state = startRoll(pool({ base: 1, titan: 3 }), [5, 5, 6, 4]);
    const s = summarize(state);
    expect(s.successes).toBe(0);
    expect(s.titanSuccesses).toBe(2);
  });
});

describe('Stress Dice showing 1', () => {
  it('causes a Stress Response on the first roll and forbids a Push', () => {
    const state = startRoll(pool({ base: 3, stress: 2 }), [6, 2, 3, 1, 4]);
    expect(summarize(state).stressResponse).toBe(true);
    expect(checkPush(state)).toMatchObject({ allowed: false, code: 'stress-one' });
    expect(() => planPush(state)).toThrow();
  });

  it('causes only one Stress Response however many Stress Dice show 1', () => {
    const state = startRoll(pool({ stress: 3 }), [1, 1, 1]);
    expect(summarize(state).stressResponse).toBe(true);
  });

  it('a base die or Gear Die showing 1 causes no Stress Response', () => {
    const state = startRoll(pool({ base: 1, gear: 1, stress: 1 }), [1, 1, 3]);
    expect(summarize(state).stressResponse).toBe(false);
    expect(checkPush(state).allowed).toBe(true);
  });
});

describe('the Push', () => {
  const first = () => startRoll(pool({ base: 3, gear: 2, stress: 2 }), [6, 4, 1, 1, 5, 6, 3]);

  it('re-rolls base and Stress Dice not showing 6 and Gear Dice showing 2 to 5, adds a Stress Die, and locks a Gear Die showing 1', () => {
    const state = first();
    const plan = planPush(state);
    expect(plan.rerollIds).toEqual([1, 2, 4, 6]);
    expect(plan.newDieId).toBe(7);
    expect(planSize(plan)).toBe(5);

    const pushed = applyPush(state, plan, [2, 6, 3, 4, 5]);
    expect(values(pushed)).toEqual([6, 2, 6, 1, 3, 6, 4, 5]);
    expect(pushed.dice.map((d) => d.status)).toEqual(['kept', 'rerolled', 'rerolled', 'locked', 'rerolled', 'kept', 'rerolled', 'new']);
    expect(pushed.dice[7]).toMatchObject({ kind: 'stress', status: 'new' });
    const s = summarize(pushed);
    expect(s.successes).toBe(3);
    expect(s.stressAdded).toBe(1);
    expect(s.coverStress).toBe(0);
    expect(s.pushes).toBe(1);
  });

  it('a Covered Push adds no Stress Die and gives the Stress to the comrade', () => {
    const state = first();
    const plan = planPush(state, { covered: true });
    expect(plan.newDieId).toBeNull();
    const pushed = applyPush(state, plan, [2, 3, 4, 5]);
    expect(pushed.dice).toHaveLength(7);
    expect(summarize(pushed)).toMatchObject({ stressAdded: 0, coverStress: 1 });
  });

  it('a Stress Die showing 1 after the Push causes a Stress Response and forbids further Pushes', () => {
    const state = { ...first(), pushesAllowed: 3 };
    const pushed = applyPush(state, planPush(state), [2, 3, 4, 1, 5]);
    expect(summarize(pushed).stressResponse).toBe(true);
    expect(checkPush(pushed)).toMatchObject({ allowed: false, code: 'stress-one' });
  });

  it('the new Stress Die showing 1 also causes the Stress Response', () => {
    const state = first();
    const pushed = applyPush(state, planPush(state), [2, 3, 4, 5, 1]);
    expect(summarize(pushed).stressResponse).toBe(true);
  });

  it('allows one Push by default', () => {
    const pushed = applyPush(first(), planPush(first()), [2, 3, 4, 5, 6]);
    expect(checkPush(pushed)).toMatchObject({ allowed: false, code: 'limit' });
    expect(checkPush(pushed).allowed === false && checkPush(pushed)).toMatchObject({ reason: expect.stringContaining('once') });
  });

  it('allows extra Pushes when a Talent grants them, each adding a Stress Die', () => {
    const state = startRoll(pool({ base: 2, stress: 1 }), [2, 3, 4], { pushesAllowed: 2 });
    const once = applyPush(state, planPush(state), [6, 3, 4, 5]);
    expect(checkPush(once).allowed).toBe(true);
    const plan = planPush(once);
    expect(plan.rerollIds).toEqual([1, 2, 3]);
    const twice = applyPush(once, plan, [6, 2, 3, 2]);
    expect(twice.dice).toHaveLength(5);
    expect(summarize(twice)).toMatchObject({ pushes: 2, stressAdded: 2, successes: 2 });
    expect(checkPush(twice)).toMatchObject({ allowed: false, code: 'limit' });
  });

  it('is forbidden when the roll does not allow it', () => {
    const state = startRoll(pool({ base: 2 }), [2, 3], { pushable: false });
    expect(checkPush(state)).toMatchObject({ allowed: false, code: 'forbidden' });
  });

  it('never Pushes Titan Dice', () => {
    const titanOnly = startRoll(pool({ titan: 4 }), [1, 2, 3, 4]);
    expect(checkPush(titanOnly)).toMatchObject({ allowed: false, code: 'titan-only' });

    const mixed = startRoll(pool({ base: 1, titan: 1 }), [2, 2]);
    const plan = planPush(mixed);
    expect(plan.rerollIds).toEqual([0]);
    const pushed = applyPush(mixed, plan, [3, 4]);
    expect(pushed.dice[1]).toMatchObject({ kind: 'titan', value: 2, status: 'held' });
  });

  it('cannot be Covered when every die a Push would pick up already shows 6, but can still be Pushed', () => {
    const state = startRoll(pool({ base: 2, gear: 1, stress: 1 }), [6, 6, 1, 6]);
    expect(checkPush(state, { covered: true })).toMatchObject({ allowed: false, code: 'cover-nothing' });
    const plan = planPush(state);
    expect(plan.rerollIds).toEqual([]);
    expect(planSize(plan)).toBe(1);
  });

  it('rejects values that do not match the plan', () => {
    const state = first();
    expect(() => applyPush(state, planPush(state), [1, 2])).toThrow();
  });

  it('pushes with a random source', () => {
    const pushed = push(first(), {}, () => 0.5);
    expect(values(pushed)).toEqual([6, 4, 4, 1, 4, 6, 4, 4]);
  });
});

describe('gear wear', () => {
  it('a roll that was not Pushed causes no wear, even with Gear Dice showing 1', () => {
    const state = startRoll(pool({ base: 1, gear: 2 }), [3, 1, 1]);
    expect(summarize(state).gearWear).toBe(0);
  });

  it('a Pushed roll wears the gear by 1 point, however many Gear Dice show 1', () => {
    const state = startRoll(pool({ base: 1, gear: 3 }), [3, 1, 1, 6]);
    const pushed = applyPush(state, planPush(state, { covered: true }), [2]);
    expect(summarize(pushed).gearWear).toBe(1);
  });

  it('a Gear Die re-rolled into a 1 wears the gear, and one re-rolled off a 1 cannot', () => {
    const onto = startRoll(pool({ gear: 1, stress: 1 }), [4, 3]);
    expect(summarize(applyPush(onto, planPush(onto, { covered: true }), [1, 3])).gearWear).toBe(1);
    const off = startRoll(pool({ gear: 1, stress: 1 }), [1, 3]);
    const offPushed = applyPush(off, planPush(off, { covered: true }), [3]);
    expect(offPushed.dice[0]).toMatchObject({ value: 1, status: 'locked' });
    expect(summarize(offPushed).gearWear).toBe(1);
  });
});

describe('the Chapter 1 example: a Pushed Reaction with Help and Covering', () => {
  it('gives two successes, a Stress Response, one wear, and the Stress to the Covering comrade', () => {
    // Agility 4 + Help 1 base dice, ODM Gear 2 (worn), Stress 1.
    const state = startRoll(pool({ base: 5, gear: 2, stress: 1 }), [6, 4, 3, 1, 2, 1, 5, 3]);
    expect(summarize(state).successes).toBe(1);
    expect(checkPush(state).allowed).toBe(true);

    const plan = planPush(state, { covered: true });
    expect(plan.rerollIds).toEqual([1, 2, 3, 4, 6, 7]);
    const pushed = applyPush(state, plan, [6, 2, 5, 1, 5, 1]);
    expect(pushed.dice.filter((d) => d.kind === 'gear').map((d) => d.value)).toEqual([1, 5]);
    expect(summarize(pushed)).toEqual({
      successes: 2,
      titanSuccesses: 0,
      hasSoldierDice: true,
      hasTitanDice: false,
      stressResponse: true,
      pushes: 1,
      gearWear: 1,
      stressAdded: 0,
      coverStress: 1,
    });
  });
});
