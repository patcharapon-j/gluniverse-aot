import { describe, expect, it } from 'vitest';
import { previewPool } from '../src/rules/pool.ts';
import {
  applyPush,
  attackResult,
  buildRollPool,
  deathOutcome,
  entryNeeds,
  finalSuccesses,
  gasAfter,
  gasRollDice,
  initialState,
  listValue,
  nextStates,
  numValue,
  pushBlock,
  pushStress,
  rawSuccesses,
  rerollCounts,
  responseDue,
  responseRow,
  tableRow,
  tableTotal,
  titanSuccesses,
  undoButton,
  wearOutcome,
  wearPoints,
  type Op,
} from '../src/rules/roll.ts';
import { buildTestConfig } from './wording-fixture.ts';

const config = buildTestConfig();
const entry = (id: string) => config.actionCatalog.find((e) => e.id === id)!;
const step = (id: string) => config.circumstances.find((c) => c.id === id)!;
const attrs = { strength: 4, agility: 3, wits: 3, perception: 3, instinct: 2, empathy: 2 };
const gear = [
  { id: 'b1', itemId: 'blade-set', name: 'Blade Set', dice: 1 },
  { id: 'o1', itemId: 'odm-gear', name: 'ODM Gear', dice: 3 },
  { id: 'h1', itemId: 'horse', name: 'Horse', dice: 2 },
];
const base = (id: string, extra = {}) => ({ entry: entry(id), attributes: attrs, talents: [], gear, penalties: [], stress: 2, bonusCap: config.bonusDiceCap, penaltyFloor: config.penaltyFloor, ...extra });

describe('die kinds (data/core/dice-pool.yaml, die_types; titan-format.yaml)', () => {
  it('counts 6s on base, Gear, and Stress Dice, and 5s and 6s on Titan Dice', () => {
    for (const d of config.dieTypes) expect(d.successFaces).toEqual([6]);
    expect(config.titanDice.successFaces).toEqual([5, 6]);
    expect(rawSuccesses({ base: [6, 5, 1], gear: [6, 1], stress: [6, 6, 5] })).toBe(4);
    expect(titanSuccesses([5, 2, 6, 1, 3, 5])).toBe(3);
  });

  it('applies a Stress Response to the count: Flinch loses one, Everything Slips zeroes it', () => {
    const flinch = config.stressResponses.find((r) => r.id === 'flinch')!;
    const botched = config.stressResponses.find((r) => r.id === 'botched')!;
    expect(finalSuccesses(3, flinch.effects)).toBe(2);
    expect(finalSuccesses(0, flinch.effects)).toBe(0);
    expect(finalSuccesses(3, botched.effects)).toBe(0);
  });
});

describe('the pool at roll time (circumstances.yaml, bonus-dice-sources.yaml)', () => {
  it('adds a plus step as Bonus Dice under the cap of 4', () => {
    const p = buildRollPool(base('fly', { bonus: 3 }), step('routine'));
    expect(p.bonus).toBe(4);
    expect(p.base).toBe(3 + 4);
  });

  it('takes a minus step off base dice after the cap, never below 1, never off Gear or Stress Dice', () => {
    const p = buildRollPool(base('nape-strike', { bonus: 1 }), step('desperate'));
    expect(p.removed).toEqual({ bonus: 1, talent: 0, attribute: 2 });
    expect(p.base).toBe(2);
    expect(p.gear?.dice).toBe(1);
    expect(p.stress).toBe(2);
    const floor = buildRollPool(base('rally', { attributes: { ...attrs, empathy: 2 } }), step('desperate'));
    expect(floor.base).toBe(1);
  });

  it('uses the dialog choices: one gear item, a chosen Talent, a met condition, another attribute', () => {
    const dodge = buildRollPool(base('dodge', { gearChoice: 'h1' }), null);
    expect(dodge.gear).toMatchObject({ id: 'h1', dice: 2 });
    expect(buildRollPool(base('dodge', { gearChoice: 'none' }), null).gear).toBeNull();
    const cond = { id: 'x', name: 'X', type: 'dice' as const, level: 2, names: ['dodge'], condition: { dodge: 'while mounted' } };
    expect(previewPool(base('dodge', { talents: [cond] })).talent).toBeNull();
    expect(previewPool(base('dodge', { talents: [cond], talentChoice: 'x' })).talent).toMatchObject({ id: 'x', dice: 2 });
    const scar = { source: 'Scar', dice: 1, entries: ['dodge'], conditional: 'against a Grab' };
    expect(previewPool(base('dodge', { penalties: [scar] })).penalties).toEqual([]);
    expect(previewPool(base('dodge', { penalties: [scar], conditionsMet: ['Scar'] })).penalties).toEqual([{ source: 'Scar', dice: 1 }]);
    expect(previewPool(base('read', { attribute: 'perception' })).attribute).toEqual({ id: 'perception', dice: 3 });
  });

  it('keeps Talent dice on an attribute-alone Field Repair only with Make Do', () => {
    const talent = { id: 'tinker', name: 'T', type: 'dice' as const, level: 1, names: ['field-repair'], condition: {} };
    expect(previewPool(base('field-repair', { talents: [talent] })).talent).toBeNull();
    expect(previewPool(base('field-repair', { talents: [talent], talentWhenAlone: true })).talent).toMatchObject({ dice: 1 });
  });

  it('reads the plain needs of an entry, and none where the fight sets them', () => {
    expect(entryNeeds(entry('read').needs)).toBe(1);
    expect(entryNeeds(entry('break-free').needs)).toBe(2);
    expect(entryNeeds(entry('ride').needs)).toBe(1);
    expect(entryNeeds(entry('death-roll').needs)).toBe(1);
    expect(entryNeeds(entry('nape-strike').needs)).toBeNull();
    expect(entryNeeds(entry('break-attention').needs)).toBeNull();
    expect(entryNeeds(entry('fight').needs)).toBeNull();
    expect(entry('field-repair').needsCount).toBe(1);
    expect(config.calledRoll.needs).toBe(1);
  });
});

describe('Push (ADR-0004; stress-changes.yaml)', () => {
  const state = (dice: { base: number[]; gear: number[]; stress: number[] }, extra = {}) => ({ dice, pushes: 0, maxPushes: 1, pushAllowed: true, down: false, ...extra });

  it('re-rolls base and Stress Dice not showing 6, keeps 6s and every Gear Die, and adds the new Stress Die last', () => {
    const d = { base: [2, 6, 3, 5], gear: [4, 1, 2], stress: [3, 6, 2] };
    expect(rerollCounts(d)).toEqual({ base: 3, stress: 2 });
    const out = applyPush(d, { base: [6, 4, 1], stress: [6, 2, 3] }, true);
    expect(out.dice).toEqual({ base: [6, 6, 4, 1], gear: [4, 1, 2], stress: [6, 6, 2, 3] });
    expect(out.fresh).toBe(3);
    const covered = applyPush(d, { base: [1, 1, 1], stress: [1, 1] }, false);
    expect(covered.dice.stress).toHaveLength(3);
    expect(covered.fresh).toBe(-1);
    expect(() => applyPush(d, { base: [1], stress: [] }, false)).toThrow();
  });

  it('is blocked by a Stress Die 1, by Down, by the roll exceptions, after the Push, and when every die shows 6', () => {
    expect(pushBlock(state({ base: [2], gear: [], stress: [1, 4] }))).toBe('stress-one');
    expect(pushBlock(state({ base: [2], gear: [], stress: [] }, { down: true }))).toBe('down');
    expect(pushBlock(state({ base: [2], gear: [], stress: [] }, { pushAllowed: false }))).toBe('not-allowed');
    expect(pushBlock(state({ base: [2], gear: [], stress: [] }, { pushes: 1 }))).toBe('already-pushed');
    expect(pushBlock(state({ base: [2], gear: [], stress: [] }, { pushes: 1, maxPushes: 2 }))).toBeNull();
    expect(pushBlock(state({ base: [6, 6], gear: [1], stress: [6] }))).toBe('nothing');
    expect(pushBlock(state({ base: [2], gear: [1], stress: [3] }))).toBeNull();
  });

  it('forbids a Push on the Death Roll, the Performance roll, and the passive roll', () => {
    const rows = Object.fromEntries(config.rollExceptions.map((r) => [r.roll, r]));
    expect(rows['death-roll'].pushAllowed).toBe(false);
    expect(rows['death-roll'].circumstances).toBe(false);
    expect(rows['death-roll'].excluded).toContain('stress');
    expect(rows['passive-roll']).toMatchObject({ pushAllowed: false, coverAllowed: false, secret: true, stressResponse: false });
    expect(config.downForbids).toEqual(expect.arrayContaining(['push', 'cover', 'reaction']));
  });

  it('costs the pusher 1 Stress, more with Wound Tight, and nothing when Covered', () => {
    expect(pushStress(false)).toBe(1);
    const woundTight = config.stressResponses.find((r) => r.id === 'hair-trigger')!;
    expect(pushStress(false, woundTight.effects)).toBe(2);
    expect(pushStress(true, woundTight.effects)).toBe(0);
  });

  it('wears gear only on a Pushed roll: 1 per Gear Die showing 1, a Blade Set ruined by any wear left', () => {
    expect(wearPoints([1, 1, 4], false)).toBe(0);
    expect(wearPoints([1, 1, 4], true)).toBe(2);
    expect(wearOutcome('odm-gear', 3, 2, 0)).toMatchObject({ after: 1, ruined: false, left: 2 });
    expect(wearOutcome('odm-gear', 1, 2, 0)).toMatchObject({ after: 0 });
    expect(wearOutcome('odm-gear', 3, 2, 1)).toMatchObject({ after: 2, ignored: 1 });
    expect(wearOutcome('blade-set', 1, 1, 0)).toMatchObject({ ruined: true, after: 1 });
    expect(wearOutcome('blade-set', 1, 1, 1)).toMatchObject({ ruined: false, ignored: 1 });
    expect(wearOutcome('blade-set', 2, 2, 1)).toMatchObject({ ruined: true });
  });
});

describe('Stress Responses and Fear Rolls (mind/*.yaml)', () => {
  const rows = config.stressResponses;

  it('rolls a response once per roll, on a Stress Die 1, never on a passive roll', () => {
    expect(responseDue({ base: [1], gear: [1], stress: [2] }, false)).toBe(false);
    expect(responseDue({ base: [], gear: [], stress: [1] }, false)).toBe(true);
    expect(responseDue({ base: [], gear: [], stress: [1] }, true)).toBe(false);
    expect(responseDue({ base: [], gear: [], stress: [1] }, false, false)).toBe(false);
  });

  it('reads D6 + Stress - Resolve, with Iron Nerve counting Resolve 1 higher', () => {
    expect(tableTotal(4, 3, 2)).toBe(5);
    expect(tableTotal(4, 3, 2, 1)).toBe(4);
    expect(tableRow(rows, -3).id).toBe('steady');
    expect(tableRow(rows, 3).id).toBe('shaking-hands');
    expect(tableRow(rows, 12).id).toBe('botched');
  });

  it('moves past lasting rows the soldier already holds', () => {
    expect(responseRow(rows, 1, []).id).toBe('racing-thoughts');
    expect(responseRow(rows, 1, ['racing-thoughts']).id).toBe('narrowed-sight');
    expect(responseRow(rows, 4, ['weak-knees', 'hair-trigger']).id).toBe('flinch');
    expect(responseRow(rows, 6, ['flinch']).id).toBe('flinch');
  });

  it('finds every Fear row for its total, and the Death Roll outcome for its successes', () => {
    expect(tableRow(config.fearRows, 0).id).toBe('steeled');
    expect(tableRow(config.fearRows, 2).effects.map((e) => e.type)).toEqual(['stress-gain', 'next-roll-penalty']);
    expect(tableRow(config.fearRows, 20).id).toBe('nothing-left');
    expect(deathOutcome(config.deathRoll.outcomes, 0).id).toBe('dies');
    expect(deathOutcome(config.deathRoll.outcomes, 1).id).toBe('holds-on');
    expect(deathOutcome(config.deathRoll.outcomes, 4).id).toBe('fights-back');
  });
});

describe('Gas and Titan attacks (odm-gear.yaml; ADR-0019)', () => {
  const g = { standard: config.gas.rollDice, pushed: config.gas.rollDicePushed, maximum: config.gas.rollDiceMax, squadmateDice: config.gas.rollDiceSquadmate };

  it('rolls two dice, three after a Pushed ODM Gear roll, two with Light Trigger, two for a Squadmate', () => {
    expect(gasRollDice({ ...g, squadmate: false, pushedOdmThisRound: false, lightTrigger: true })).toEqual({ dice: 2, lightTriggerUsed: false });
    expect(gasRollDice({ ...g, squadmate: false, pushedOdmThisRound: true, lightTrigger: false })).toEqual({ dice: 3, lightTriggerUsed: false });
    expect(gasRollDice({ ...g, squadmate: false, pushedOdmThisRound: true, lightTrigger: true })).toEqual({ dice: 2, lightTriggerUsed: true });
    expect(gasRollDice({ ...g, squadmate: true, pushedOdmThisRound: true, lightTrigger: false }).dice).toBe(2);
  });

  it('lowers the Gas Rating by 1 per die showing 1, never below 0', () => {
    expect(gasAfter(3, [1, 6, 1])).toEqual({ lost: 2, after: 1 });
    expect(gasAfter(1, [1, 1, 1])).toEqual({ lost: 3, after: 0 });
  });

  it('cancels one Titan success per dodge success, lands on 1 net, and adds the rider beyond the first', () => {
    expect(attackResult(0, null)).toMatchObject({ whiff: true, lands: false });
    expect(attackResult(3, null)).toMatchObject({ net: 3, lands: true, rider: 2 });
    expect(attackResult(3, 2)).toMatchObject({ net: 1, lands: true, rider: 0 });
    expect(attackResult(3, 5)).toMatchObject({ net: 0, lands: false });
  });
});

describe('applied changes and Undo (ADR-0026)', () => {
  const stress: Op = { t: 'num', cat: 'stress', actor: 'A', item: null, path: 'system.stress', from: 2, to: 3, min: 2, max: null, label: '+1', state: 'done' };

  it('moves numbers by their delta, so Undo keeps changes other cards made', () => {
    expect(numValue(stress, 2, 1)).toBe(3);
    expect(numValue(stress, 3, -1)).toBe(2);
    expect(numValue(stress, 5, -1)).toBe(4);
    // Stored Stress below minimum counts as the minimum.
    expect(numValue(stress, 0, 1)).toBe(3);
    expect(numValue(stress, 2, -1)).toBe(2);
    const gas = { from: 3, to: 1, min: 0, max: 3 };
    expect(numValue(gas, 3, 1)).toBe(1);
    expect(numValue(gas, 1, -1)).toBe(3);
    expect(numValue(gas, 3, -1)).toBe(3);
  });

  it('adds and removes a held row', () => {
    const op = { value: { row: 'flinch', ends: 'day', ends_note: '' } };
    const held = [{ row: 'racing-thoughts', ends: 'day', ends_note: '' }];
    const after = listValue(op, held, 1);
    expect(after).toHaveLength(2);
    expect(listValue(op, after, -1)).toEqual(held);
    expect(listValue(op, held, -1)).toEqual(held);
  });

  it('undoes in reverse, redoes forward, applies only pending changes, and follows the GM toggles', () => {
    const ops: Op[] = [
      { ...stress, state: 'done' },
      { t: 'set', cat: 'wear', actor: 'A', item: 'i', path: 'system.used', from: false, to: true, label: 'used', state: 'done' },
      { t: 'add', cat: 'stressResponse', actor: 'A', path: 'p', value: {}, label: 'held', state: 'pending' },
    ];
    expect(nextStates(ops, 'undo')).toEqual([
      { index: 1, dir: -1 },
      { index: 0, dir: -1 },
    ]);
    expect(nextStates(ops, 'apply')).toEqual([{ index: 2, dir: 1 }]);
    expect(undoButton(ops)).toBe('undo');
    const undone = ops.map((o) => (o.state === 'done' ? { ...o, state: 'undone' as const } : o));
    expect(undoButton(undone)).toBe('redo');
    expect(nextStates(undone, 'redo').map((x) => x.index)).toEqual([0, 1]);
    expect(undoButton([])).toBeNull();
    const on = { stress: true, wear: false, stressResponse: true, gas: true, fear: true };
    expect(initialState('stress', on)).toBe('done');
    expect(initialState('wear', on)).toBe('pending');
  });
});
