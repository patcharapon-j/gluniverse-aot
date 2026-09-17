import { describe, expect, it } from 'vitest';
import { previewPool, type PoolInputs } from '../src/rules/pool.ts';
import { changeCanister, gainedInjuryState, healingDaysTotal, healthCells, healthLostAfterClick, stressAfterClick } from '../src/rules/harm.ts';
import { loadTables } from '../tools/data/load.ts';
import { buildTestConfig } from './wording-fixture.ts';

const tables = loadTables();
const config = buildTestConfig(tables);
const entry = (id: string) => config.actionCatalog.find((e) => e.id === id)!;
const attrs = { strength: 4, agility: 4, wits: 3, perception: 3, instinct: 2, empathy: 2 };
const cleanCut = { id: 'clean-cut', name: 'Clean Cut', type: 'dice' as const, level: 2, names: ['nape-strike'], condition: {} };

const base = (id: string, extra: Partial<PoolInputs> = {}): PoolInputs => ({
  entry: entry(id),
  attributes: attrs,
  talents: [cleanCut],
  gear: [{ itemId: 'blade-set', name: 'Blade Set', dice: 1 }, { itemId: 'odm-gear', name: 'ODM Gear', dice: 3 }],
  penalties: [],
  stress: 3,
  ...extra,
});

describe('previewPool (data/core/dice-pool.yaml)', () => {
  it('builds the preview Nape strike: Strength 4, Clean Cut 2, the Blade Set, Stress 3', () => {
    const p = previewPool(base('nape-strike'));
    expect(p).toMatchObject({ blocked: null, base: 6, gear: { itemId: 'blade-set', dice: 1 }, stress: 3, total: 10 });
    expect(p.talent).toMatchObject({ id: 'clean-cut', dice: 2 });
  });

  it('takes penalties from Bonus Dice first, then Talent dice, then the attribute, leaving at least 1 base die', () => {
    const p = previewPool(base('nape-strike', { bonus: 1, penalties: [{ source: 'Battered Forearm', dice: 2, entries: ['nape-strike'] }] }));
    expect(p.removed).toEqual({ bonus: 1, talent: 1, attribute: 0 });
    expect(p.base).toBe(5);
    const floor = previewPool(base('nape-strike', { penalties: [{ source: 'x', dice: 20, entries: 'all' }] }));
    expect(floor.base).toBe(config.penaltyFloor);
    expect(floor.removed).toEqual({ bonus: 0, talent: 2, attribute: 3 });
  });

  it('never removes Gear or Stress Dice, and lists conditional penalties without counting them', () => {
    const p = previewPool(base('dodge', { penalties: [{ source: 'The Closing Hand', dice: 1, entries: ['dodge'], conditional: 'that dodge only' }] }));
    expect(p.base).toBe(4);
    expect(p.gear?.dice).toBe(3);
    expect(p.conditionalPenalties).toHaveLength(1);
  });

  it('blocks an entry whose required gear is not had, and rolls the attribute alone where the entry says so', () => {
    expect(previewPool(base('nape-strike', { gear: [{ itemId: 'blade-set', name: 'Blade Set', dice: 0 }] })).blocked).toBe('no-gear');
    const treat = previewPool(base('treat-injury', { talents: [{ ...cleanCut, id: 'field-medic', names: ['treat-injury'] }] }));
    expect(treat).toMatchObject({ blocked: null, attributeAlone: true, talent: null, gear: null, base: 3 });
  });

  it('uses the best had item and at most one dice Talent', () => {
    const p = previewPool(base('dodge', {
      gear: [{ itemId: 'horse', name: 'Horse', dice: 1 }, { itemId: 'odm-gear', name: 'ODM Gear', dice: 2 }],
      talents: [{ ...cleanCut, names: ['dodge'], level: 1 }, { ...cleanCut, id: 'b', names: ['dodge'], level: 3 }],
    }));
    expect(p.gear?.itemId).toBe('odm-gear');
    expect(p.talent?.dice).toBe(3);
  });

  it('keeps conditional dice Talents apart', () => {
    const p = previewPool(base('nape-strike', { talents: [{ ...cleanCut, condition: { 'nape-strike': 'when grounded' } }] }));
    expect(p.talent).toBeNull();
    expect(p.conditionalTalents[0]).toMatchObject({ dice: 2, condition: 'when grounded' });
  });

  it('leaves out the components a roll exception names (the Death Roll has no Stress Dice)', () => {
    const ex = config.rollExceptions.find((r) => r.roll === 'death-roll')!;
    const p = previewPool(base('death-roll', { excluded: ex.excluded }));
    expect(p.stress).toBe(0);
    expect(p.total).toBe(4);
  });

  it('has no pool for a fixed roll', () => {
    expect(previewPool(base('fear-roll')).blocked).toBe('no-attribute');
  });
});

describe('gaining a Critical Injury (data/harm/critical-injuries.yaml)', () => {
  const arm = tables.criticalInjuries.tables.arm!;
  const riders = Object.entries(arm.type_riders).flatMap(([type, list]) => (list ?? []).map((rider) => ({ injury_type: type as 'bite', rider: rider as never })));
  const row = (id: string) => arm.rows.find((r) => r.id === id) as { id: string; lethal: boolean; time_limit: null; healing_days: number };

  it('records side, type, and healing days, doubling them for a Burn', () => {
    const r = row('arm-gashed-forearm');
    const crush = gainedInjuryState({ rowId: r.id, location: 'arm', row: r, riders, type: 'crush', side: 'right', sidedLocations: config.sidedLocations });
    expect(crush.state).toMatchObject({ injury_type: 'crush', side: 'right', treated: false, healing_days_left: r.healing_days, time_limit: null });
    const burn = gainedInjuryState({ rowId: r.id, location: 'arm', row: r, riders, type: 'burn', side: 'left', sidedLocations: config.sidedLocations });
    expect(burn.state.healing_days_left).toBe(r.healing_days * 2);
    expect(healingDaysTotal(r.id, r, 'burn', riders)).toBe(r.healing_days * 2);
  });

  it('applies a Bite rider time limit and the Pierce no-healing rider', () => {
    const r = row('arm-mangled-arm');
    expect(gainedInjuryState({ rowId: r.id, location: 'arm', row: r, riders, type: 'bite', side: 'left', sidedLocations: config.sidedLocations }).state.time_limit).toBe('turn');
    const p = row('arm-fractured-arm');
    expect(gainedInjuryState({ rowId: p.id, location: 'arm', row: p, riders, type: 'pierce', side: 'left', sidedLocations: config.sidedLocations }).healsUntreated).toBe(false);
  });

  it('gives the torso and head no side', () => {
    const torso = tables.criticalInjuries.tables.torso!.rows[0] as never as { id: string; lethal: boolean; time_limit: null; healing_days: number };
    expect(gainedInjuryState({ rowId: torso.id, location: 'torso', row: torso, riders: [], type: 'cut', side: 'left', sidedLocations: config.sidedLocations }).state.side).toBeNull();
  });
});

describe('sheet clicks', () => {
  it('changes a canister, keeping the old one as a spare only if it has gas (data/gear/odm-gear.yaml)', () => {
    expect(changeCanister(1, [3, 2], 0)).toEqual({ gas_rating: 3, spare_canisters: [2, 1] });
    expect(changeCanister(0, [3], 0)).toEqual({ gas_rating: 3, spare_canisters: [] });
    expect(changeCanister(2, [], 0)).toBeNull();
  });

  it('marks and clears Health boxes after the crossed ones, never past the clean boxes', () => {
    // Health 4, 1 crossed, 1 lost: [X, /, _, _]
    expect(healthLostAfterClick(3, 4, 1, 1)).toBe(3);
    expect(healthLostAfterClick(1, 4, 1, 1)).toBe(0);
    expect(healthLostAfterClick(2, 4, 1, 1)).toBe(2);
    expect(healthLostAfterClick(0, 4, 1, 1)).toBe(1);
    expect(healthLostAfterClick(3, 4, 5, 0)).toBe(0);
  });

  it('names the untreated Critical Injury that blocks each crossed Health box', () => {
    const held = [
      { id: 'a', treated: false },
      { id: 'b', treated: true },
      { id: 'c', treated: false },
    ];
    const cells = healthCells(['crossed', 'crossed', 'damaged', 'clean'], held);
    expect(cells.map((c) => c.blocker?.id ?? null)).toEqual(['a', 'c', null, null]);
    expect(cells.map((c) => c.state)).toEqual(['crossed', 'crossed', 'damaged', 'clean']);
    // More untreated injuries than Health: only the boxes that exist are blocked.
    expect(healthCells(['crossed'], held).map((c) => c.blocker?.id)).toEqual(['a']);
    expect(healthCells(['clean', 'clean'], held).every((c) => c.blocker === null)).toBe(true);
  });

  it('fills and clears Stress boxes, never below minimum Stress', () => {
    expect(stressAfterClick(4, 3, 1)).toBe(5);
    expect(stressAfterClick(2, 3, 1)).toBe(2);
    expect(stressAfterClick(0, 1, 1)).toBe(1);
    expect(stressAfterClick(0, 3, 0)).toBe(1);
  });
});
