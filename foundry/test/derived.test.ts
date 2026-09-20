import { describe, expect, it } from 'vitest';
import {
  boxesCrossedOff,
  carryingLimit,
  currentHealth,
  deriveSoldier,
  downByRule,
  health,
  healthBoxes,
  itemsCarried,
  jammed,
  lame,
  maxHealthLost,
  minimumStress,
  overloaded,
  resolve,
  resolveUnclamped,
  foeCurrentHealth,
  effectiveStress,
} from '../src/rules/derived.ts';
import { loadTables } from '../tools/data/load.ts';

const tables = loadTables();

describe('Health and Resolve (data/character/attributes.yaml)', () => {
  it('matches every Squadmate template, whose Health and Resolve are precalculated', () => {
    for (const m of tables.squadmates.templates) {
      expect(health(m.attributes), m.id).toBe(m.health);
      expect(resolve(m.attributes, 0, 0), m.id).toBe(m.resolve);
    }
  });

  it('matches the reported Free Build Squads', () => {
    const built = (tables.attributes as any).creation.built.free_build;
    for (const squad of [built.reported_squad, built.reported_squad_fragile]) {
      expect(health(squad.attributes)).toBe(squad.health);
      expect(resolve(squad.attributes, 0, 0)).toBe(squad.resolve);
    }
  });

  // Round 3, decision 1: Health is 2 + (strength + agility) / 2, rounded up, so it runs 4 to 8.
  it('adds 2 and rounds Health up, over the whole range', () => {
    expect(health({ strength: 2, agility: 2 })).toBe(4);
    expect(health({ strength: 4, agility: 3 })).toBe(6);
    expect(health({ strength: 6, agility: 5 })).toBe(8);
    // The odd sums round up, and the two ends of the attribute scale are the two ends of Health.
    expect(health({ strength: 2, agility: 3 })).toBe(5);
    expect(health({ strength: 4, agility: 4 })).toBe(6);
    expect(health({ strength: 5, agility: 6 })).toBe(8);
    expect(health({ strength: 6, agility: 6 })).toBe(8);
  });

  it('adds 1 per Scar and removes 1 per Grief, counting at most 3 Grief', () => {
    // The preview soldier: Instinct 2, Empathy 2, 1 Scar, 0 Grief gives Resolve 3.
    expect(resolve({ instinct: 2, empathy: 2 }, 1, 0)).toBe(3);
    expect(resolve({ instinct: 3, empathy: 4 }, 0, 2)).toBe(2);
    expect(resolve({ instinct: 3, empathy: 4 }, 0, 5)).toBe(1);
    expect(resolve({ instinct: 3, empathy: 4 }, 2, 3)).toBe(3);
  });

  it('never goes below 0 (owner decision; the rules set no floor)', () => {
    expect(resolveUnclamped({ instinct: 2, empathy: 2 }, 0, 3)).toBe(-1);
    expect(resolve({ instinct: 2, empathy: 2 }, 0, 3)).toBe(0);
    expect(resolve({ instinct: 2, empathy: 2 }, 0, 2)).toBe(0);
    expect(resolve({ instinct: 2, empathy: 2 }, 1, 3)).toBe(0);
    expect(resolve({ instinct: 3, empathy: 2 }, 0, 2)).toBe(1);
  });

  it('sets minimum Stress to the number of Scars', () => {
    expect(minimumStress(0)).toBe(0);
    expect(minimumStress(2)).toBe(2);
    expect(effectiveStress(0, 2)).toBe(2);
    expect(effectiveStress(3, 2)).toBe(3);
  });
});

describe('current Health (data/harm/sheet-fields.yaml)', () => {
  it('crosses off one box per untreated Critical Injury, up to Health', () => {
    expect(boxesCrossedOff(0, 4)).toBe(0);
    expect(boxesCrossedOff(2, 4)).toBe(2);
    expect(boxesCrossedOff(6, 4)).toBe(4);
  });

  it('is Health minus boxes crossed off minus Health lost, never below 0', () => {
    expect(currentHealth(4, 0, 0)).toBe(4);
    expect(currentHealth(4, 0, 1)).toBe(3); // the preview soldier: one box lost
    expect(currentHealth(4, 1, 1)).toBe(2);
    expect(currentHealth(4, 3, 3)).toBe(0);
    expect(currentHealth(3, 5, 0)).toBe(0);
  });

  it('caps Health lost at the boxes left clean', () => {
    expect(maxHealthLost(4, 1)).toBe(3);
    expect(maxHealthLost(4, 9)).toBe(0);
  });

  it('draws crossed boxes first, then damaged, then clean', () => {
    expect(healthBoxes(4, 1, 1)).toEqual(['crossed', 'damaged', 'clean', 'clean']);
    expect(healthBoxes(3, 0, 5)).toEqual(['damaged', 'damaged', 'damaged']);
    expect(healthBoxes(2, 3, 1)).toEqual(['crossed', 'crossed']);
  });

  it('is Down at 0 current Health, or while an untreated down row is held (data/harm/down.yaml)', () => {
    expect(downByRule(0, [])).toBe(true);
    expect(downByRule(2, [])).toBe(false);
    expect(downByRule(2, [{ treated: false, down: 'until_treated' }])).toBe(true);
    expect(downByRule(2, [{ treated: true, down: 'until_treated' }])).toBe(false);
    expect(downByRule(2, [{ treated: false, down: false }])).toBe(false);
  });
});

describe('carrying (data/gear/carrying.yaml)', () => {
  const counted = (id: string) => tables.gearItems.items.find((g) => g.id === id)!.items_counted;

  it('limits items to Strength + 4', () => {
    expect(carryingLimit(4)).toBe(8);
    expect(carryingLimit(2)).toBe(6);
  });

  it('counts spares, carried Blade Sets, kits, and firearms, but not the set in the handles, ODM Gear, or a horse', () => {
    const gear = [
      { itemsCounted: counted('odm-gear') },
      { itemsCounted: counted('blade-set'), inHandles: true },
      { itemsCounted: counted('blade-set') },
      { itemsCounted: counted('blade-set') },
      { itemsCounted: counted('horse') },
      { itemsCounted: counted('medical-kit') },
      { itemsCounted: counted('musket') },
      { itemsCounted: counted('prosthetic-arm') },
    ];
    // 1 spare + 2 carried sets + 1 kit + 2 for the musket
    expect(itemsCarried({ spareCanisters: 1, gear })).toBe(6);
  });

  it('adds a carried comrade as 5 plus their items, or only their items with Strong Back', () => {
    expect(itemsCarried({ spareCanisters: 0, gear: [], comrade: { itemsCarried: 3 } })).toBe(8);
    expect(itemsCarried({ spareCanisters: 0, gear: [], comrade: { itemsCarried: 3 }, strongBack: true })).toBe(3);
  });

  it('is Overloaded only above the limit', () => {
    expect(overloaded(8, 8)).toBe(false);
    expect(overloaded(9, 8)).toBe(true);
  });
});

describe('gear states (data/gear/sheet-fields.yaml)', () => {
  it('is Jammed at ODM current 0 and Lame at horse current 0', () => {
    expect(jammed({ current: 0 })).toBe(true);
    expect(jammed({ current: 2 })).toBe(false);
    expect(jammed(null)).toBe(false);
    expect(lame({ current: 0 })).toBe(true);
    expect(lame(undefined)).toBe(false);
  });
});

describe('deriveSoldier', () => {
  it('derives the preview soldier (preview-spec-v2.md)', () => {
    const d = deriveSoldier({
      attributes: { strength: 4, agility: 4, wits: 3, perception: 3, instinct: 2, empathy: 2 },
      scars: 1,
      grief: 0,
      stress: 3,
      healthLost: 1,
      injuries: [{ treated: true, down: false }],
      spareCanisters: 1,
      gear: [
        { itemsCounted: 0 },
        { itemsCounted: 1, inHandles: true },
        { itemsCounted: 1 },
        { itemsCounted: 1 },
        { itemsCounted: 1 },
      ],
      odm: { current: 3 },
      horse: null,
    });
    expect(d).toMatchObject({
      health: 6,
      resolve: 3,
      minimum_stress: 1,
      stress_effective: 3,
      current_health: 5,
      down_by_rule: false,
      carrying_limit: 8,
      items_carried: 4,
      overloaded: false,
      jammed: false,
      lame: false,
    });
  });
});

describe('Foe Health (data/skirmish/foes.yaml)', () => {
  it('never goes below 0', () => {
    expect(foeCurrentHealth(4, 1)).toBe(3);
    expect(foeCurrentHealth(3, 7)).toBe(0);
  });
});
