import { describe, expect, it } from 'vitest';
import { DataShapeError, fileReader, loadTables, type Reader } from '../tools/data/load.ts';
import { buildTestConfig } from './wording-fixture.ts';

/** A reader that edits one file's text before it is parsed. */
const altered = (path: string, edit: (text: string) => string): Reader => (p) => (p === path ? edit(fileReader(p)) : fileReader(p));

const expectShapeError = (read: Reader, match: RegExp) => {
  expect(() => loadTables(read)).toThrow(DataShapeError);
  expect(() => loadTables(read)).toThrow(match);
};

describe('the live data/', () => {
  const t = loadTables();

  it('loads and cross-checks every file the system reads', () => {
    expect(t.talents.talents.length).toBeGreaterThan(0);
    expect(t.titans.map((x) => x.id)).toEqual(['standard-small', 'standard-medium', 'standard-large', 'sprinting-abnormal']);
  });

  it('builds the system config with the whole Action Catalog', () => {
    const c = buildTestConfig(t);
    expect(c.actionCatalog).toHaveLength(t.actionCatalog.entries.length);
    expect(c.actionCatalog.find((e) => e.id === 'nape-strike')).toMatchObject({ attribute: 'strength', gear: ['blade-set'], requiresGear: true, withoutGear: 'not_possible' });
    expect(c.actionCatalog.find((e) => e.id === 'nape-strike')!.talents).toContain('clean-cut');
    expect(c.gas.full).toBe(t.odmGear.gas.full_gas_rating);
    expect(c.circumstances.map((s) => s.dice)).toEqual([3, 2, 1, 0, -1, -2, -3]);
    expect(c.titanDice.successFaces).toEqual([5, 6]);
    expect(c.attentionLadders[0].rungs).toEqual(['hooked-into-its-body', 'nearest-person-in-reach', 'just-hurt-it', 'loudest-or-brightest', 'nearest']);
    expect(c.weapons.find((w) => w.id === 'sabre')).toBeTruthy();
  });

  it('carries the Flight, Momentum, and Anchor rows the tracker reads (decision batch 10)', () => {
    const c = buildTestConfig(t);
    // The Fly entry is made for every ODM move and its successes are tracked as Momentum.
    const fly = c.actionCatalog.find((e) => e.id === 'fly')!;
    expect(fly.changes).toContain('momentum-gain');
    expect(fly.needsCount).toBeNull();
    expect(c.trackedValues.map((v) => v.id)).toEqual(expect.arrayContaining(['momentum-gain', 'anchor-wreck']));
    // The two new Bonus Dice sources.
    expect(t.bonusDice.sources.map((x) => x.id)).toEqual(expect.arrayContaining(['momentum', 'terrain-trait']));
    // The round's momentum end step, and the wreck effect type.
    expect(c.engagement.endSteps).toEqual(['gas-rolls', 'regeneration', 'background-clocks', 'momentum', 'round-ends']);
    expect(t.titanFormat.effect_types.map((x) => x.id)).toContain('wreck');
    // No step row asks for a Fly roll of its own any more.
    expect(c.engagement.ratings.every((r) => r.steps.every((x) => !('fly' in x)))).toBe(true);
  });
});

describe('a changed shape fails loudly', () => {
  it('a new field on a Talent row', () => {
    expectShapeError(
      altered('data/character/talents.yaml', (s) => s.replace('  - id: clean-cut\n', '  - id: clean-cut\n    cost: 2\n')),
      /talents\.yaml[\s\S]*Unrecognized key/,
    );
  });

  it('a retyped Titan field', () => {
    expectShapeError(
      altered('data/titans/standard-medium.yaml', (s) => s.replace('nape_depth: 4', 'nape_depth: four')),
      /standard-medium\.yaml[\s\S]*nape_depth/,
    );
  });

  it('a changed Health formula', () => {
    expectShapeError(
      altered('data/character/attributes.yaml', (s) => s.replace('formula: 2 + (strength + agility) / 2', 'formula: 2 + (strength + agility + 1) / 2')),
      /attributes\.yaml[\s\S]*derived_values/,
    );
  });

  it('a changed carrying limit', () => {
    expectShapeError(
      altered('data/gear/carrying.yaml', (s) => s.replace('formula: strength + 4', 'formula: strength + 5')),
      /carrying\.yaml[\s\S]*limit\.formula/,
    );
  });

  it('a renamed harm sheet field', () => {
    expectShapeError(
      altered('data/harm/sheet-fields.yaml', (s) => s.replace('- id: next_roll_penalty', '- id: next_roll_malus')),
      /sheet-fields\.yaml/,
    );
  });

  it('a Talent that names an entry the Catalog lacks', () => {
    expectShapeError(
      altered('data/character/talents.yaml', (s) => s.replace('names: [nape-strike]\n    specialties: [slayer]', 'names: [nape-slice]\n    specialties: [slayer]')),
      /names "nape-slice"/,
    );
  });

  it('a Rule Talent with no player wording', () => {
    expectShapeError(
      altered('site/src/content/compendium/talent-text.yaml', (s) => s.replace(/  relentless:\n(    .*\n)+/, '')),
      /"relentless" has no player wording/,
    );
  });

  it('a new gear item', () => {
    expectShapeError(
      altered('data/gear/items.yaml', (s) => s.replace('  - id: musket\n', '  - id: rifle\n')),
      /items\.yaml/,
    );
  });

  it('a changed Regeneration step', () => {
    expectShapeError(
      altered('data/engagement/titan-harm.yaml', (s) => s.replace('    - Erase every Opening on the Titan.\n', '    - Erase half the Openings on the Titan.\n')),
      /titan-harm\.yaml[\s\S]*Regeneration steps changed/,
    );
  });

  it('a Foe that names a missing weapon', () => {
    expectShapeError(
      altered('data/skirmish/foes.yaml', (s) => s.replace('fight_weapon: sabre', 'fight_weapon: halberd')),
      /missing weapon "halberd"/,
    );
  });

  it('broken YAML', () => {
    expectShapeError(altered('data/skirmish/foes.yaml', (s) => `${s}\n  : : [`), /foes\.yaml[\s\S]*YAML/);
  });
});
