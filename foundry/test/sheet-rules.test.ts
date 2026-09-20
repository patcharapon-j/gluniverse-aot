import { describe, expect, it } from 'vitest';
import { previewPool, type PoolInputs } from '../src/rules/pool.ts';
import { groupRollsByAttribute } from '../src/sheets/soldier-view.ts';
import { changeCanister, gainedInjuryState, healingDaysTotal, healthCells, healthLostAfterClick, stressAfterClick } from '../src/rules/harm.ts';
import { planIsEmpty, planTemplate } from '../src/rules/squadmate.ts';
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

  it('lets a custom roll bring any Talent and any gear, but fills neither in by itself', () => {
    const custom = {
      id: 'attribute-strength',
      attribute: 'strength',
      gear: [] as string[],
      requiresGear: false,
      withoutGear: null,
    };
    const inputs = base('nape-strike', { entry: custom, anyTalent: true, anyGear: true });
    const bare = previewPool(inputs);
    expect(bare).toMatchObject({ blocked: null, base: 4, gear: null, total: 7 });
    expect(bare.talent).toBeNull();

    const picked = previewPool({ ...inputs, talentChoice: 'clean-cut', gearChoice: 'odm-gear' });
    expect(picked.talent).toMatchObject({ id: 'clean-cut', dice: 2 });
    expect(picked.gear).toMatchObject({ itemId: 'odm-gear', dice: 3 });
    expect(picked.total).toBe(4 + 2 + 3 + 3);
  });

  it('keeps an entry naming its own Talent and gear: a custom roll only stops reading that list', () => {
    const p = previewPool(base('nape-strike'));
    expect(p.talent).toMatchObject({ id: 'clean-cut' });
    expect(p.gear).toMatchObject({ itemId: 'blade-set' });
    // Clean Cut names the Nape strike only, so a Fight never picks it up.
    expect(previewPool(base('fight')).talent).toBeNull();
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

describe('the quick rolls laid out by attribute', () => {
  const attributes = config.attributes.map((a) => ({ id: a.id, name: a.name }));
  const labels = { attribute: (id: string) => `A:${id}`, fixed: 'Fixed rolls', other: 'Anywhere' };
  const row = (id: string, attribute: string | null, extra: { fixed?: boolean; context?: string } = {}) => ({
    id,
    attribute,
    fixed: extra.fixed ?? false,
    context: extra.context ?? 'any',
  });

  it('puts each entry under its own attribute, in the attributes’ order, with the fixed rolls last', () => {
    const groups = groupRollsByAttribute(
      [row('spot', 'perception'), row('fear-roll', null, { fixed: true }), row('nape-strike', 'strength', { context: 'titan-engagement' })],
      attributes,
      labels,
    );
    expect(groups.map((g) => g.id)).toEqual(['strength', 'perception', 'fixed']);
    expect(groups[0].label).toBe('A:strength');
    expect(groups.at(-1)!.rolls.map((r) => r.id)).toEqual(['fear-roll']);
  });

  it('keeps the catalog order inside a group, Titan Engagement entries first, and drops empty groups', () => {
    const groups = groupRollsByAttribute(
      [row('a', 'agility'), row('b', 'agility', { context: 'titan-engagement' }), row('c', 'agility'), row('d', 'agility', { context: 'titan-engagement' })],
      attributes,
      labels,
    );
    expect(groups).toHaveLength(1);
    expect(groups[0].rolls.map((r) => r.id)).toEqual(['b', 'd', 'a', 'c']);
  });

  it('gathers a roll on no known attribute under its own heading', () => {
    const groups = groupRollsByAttribute([row('odd', 'luck')], attributes, labels);
    expect(groups.map((g) => [g.id, g.label])).toEqual([['other', 'Anywhere']]);
  });
});

describe('setting a Squadmate stat block template (data/character/squadmates.yaml)', () => {
  const template = config.squadmateTemplates.find((m) => m.id === 'medic')!;
  const built = (over: Partial<{ specialty: string; talent: string }> = {}) => [
    { id: 'sp1', type: 'specialty', key: over.specialty ?? template.specialty },
    { id: 'ta1', type: 'talent', key: over.talent ?? template.talent.id },
  ];

  it('ships the nine templates with their Specialty, their Talent, and their attributes', () => {
    expect(config.squadmateTemplates).toHaveLength(tables.squadmates.templates.length);
    expect(template).toMatchObject({ specialty: 'medic', talent: { id: 'field-medicine', level: 1 } });
    expect(Object.keys(template.attributes).sort()).toEqual(config.attributes.map((a) => a.id).sort());
  });

  it('writes the attributes and takes the Specialty and the Talent from the compendia', () => {
    const plan = planTemplate(template, built({ specialty: 'slayer', talent: 'clean-cut' }), { ...template.attributes, wits: 2 });
    expect(plan.update).toMatchObject({ 'system.template': 'medic', 'system.attributes.wits': template.attributes.wits });
    expect(plan.remove).toEqual(['sp1', 'ta1']);
    expect(plan.create).toEqual([
      { pack: 'specialties', key: 'medic', system: {} },
      { pack: 'talents', key: 'field-medicine', system: { level: 1, used: false } },
    ]);
    expect(plan.changes).toEqual(['attributes', 'specialty', 'talent']);
    expect(planIsEmpty(plan)).toBe(false);
  });

  it('changes nothing but the name when the file already reads as the template', () => {
    const plan = planTemplate(template, built(), { ...template.attributes });
    expect(plan).toEqual({ update: { 'system.template': 'medic' }, remove: [], create: [], changes: [] });
    expect(planIsEmpty(plan)).toBe(true);
  });

  it('replaces the Talent of a file that carries more than one, and builds a blank file from nothing', () => {
    const two = planTemplate(template, [...built(), { id: 'ta2', type: 'talent', key: 'lure' }], { ...template.attributes });
    expect(two.remove).toEqual(['ta1', 'ta2']);
    expect(two.changes).toEqual(['talent']);
    const blank = planTemplate(template, [], {});
    expect(blank.remove).toEqual([]);
    expect(blank.create.map((c) => c.pack)).toEqual(['specialties', 'talents']);
    expect(blank.changes).toEqual(['attributes', 'specialty', 'talent']);
  });
});
