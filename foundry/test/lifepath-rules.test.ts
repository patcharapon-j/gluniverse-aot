/** The Lifepath and the builds as pure rules (src/rules/lifepath.ts), against the live tables. */
import { describe, expect, it } from 'vitest';
import type { Attributes } from '../src/rules/derived.ts';
import {
  addPoint,
  applyFloor,
  applySwap,
  applyTop10,
  attributeTotal,
  band,
  builtAttributesValid,
  builtCanGain,
  canGain,
  classRankFor,
  creationMax,
  d66,
  d66Row,
  eventTalentOptions,
  finishValues,
  freeBuildLeft,
  freeBuildValid,
  originAllowed,
  performanceAttribute,
  standardIssue,
  swapOptions,
  templateAttributes,
  specialtyTalentOptions,
  trialBands,
  trialMerit,
  trialNeeds,
  trialPool,
  type LpTables,
} from '../src/rules/lifepath.ts';
import { DataShapeError, fileReader, loadTables } from '../tools/data/load.ts';
import { blocks, inline, LIFEPATH_PAGE, loadLifepathWording } from '../tools/data/lifepath-wording.ts';
import { buildTestConfig } from './wording-fixture.ts';

const config = buildTestConfig();
const t = config.lifepath as LpTables;
const A = (strength: number, agility: number, wits: number, perception: number, instinct: number, empathy: number): Attributes => ({ strength, agility, wits, perception, instinct, empathy });
const all36 = [1, 2, 3, 4, 5, 6].flatMap((a) => [1, 2, 3, 4, 5, 6].map((b) => d66(a, b)));

describe('D66 tables', () => {
  it('reads every D66 result of every table to exactly one row', () => {
    for (const rows of [t.origins, t.enlistment, ...t.years.map((y) => y.events)]) {
      for (const n of all36) expect(rows.filter((r) => r.results.includes(n))).toHaveLength(1);
    }
  });

  it('reads tens then units', () => {
    expect(d66(2, 5)).toBe(25);
    expect(d66Row(t.origins, 25).id).toBe('wall-rose-farm');
    expect(d66Row(t.enlistment, 42).drive.id).toBe('shield-the-walls');
    expect(d66Row(t.years[0].events, 44).name).toBe('Fire in the stables');
    expect(() => d66Row(t.origins, 17)).toThrow();
  });

  it('keeps an Origin only in a Campaign Year its condition meets', () => {
    const refugee = t.origins.find((o) => o.id === 'wall-maria-refugee')!;
    expect(refugee.yearMin).toBe(848);
    expect(originAllowed(refugee, 847)).toBe(false);
    expect(originAllowed(refugee, 848)).toBe(true);
    expect(originAllowed(refugee, null)).toBe(false);
    expect(originAllowed(t.origins[0], 845)).toBe(true);
    expect(refugee.condition).toMatch(/848/);
  });

  it('pays performance Merit by successes, 3 or more paying 3', () => {
    expect([0, 1, 2, 3, 4, 7].map((n) => band(t.performanceMerit, n))).toEqual([0, 1, 2, 3, 3, 3]);
  });

  it('finds the Class Rank for any Merit total', () => {
    expect(classRankFor(t.classRank, -3)).toMatchObject({ rank: 180, top10: false });
    expect(classRankFor(t.classRank, 0).rank).toBe(180);
    expect(classRankFor(t.classRank, 5)).toMatchObject({ rank: 25, top10: false });
    expect(classRankFor(t.classRank, 6)).toMatchObject({ rank: 10, top10: true });
    expect(classRankFor(t.classRank, 14)).toMatchObject({ rank: 1, top10: true });
  });
});

describe('attributes', () => {
  it('adds a point, and sends one past 5 to an attribute the player names', () => {
    const a = A(5, 2, 2, 4, 2, 3);
    expect(addPoint(a, 'wits', 5, null)).toMatchObject({ overflow: false, needs: null, attrs: { wits: 3 } });
    const over = addPoint(a, 'strength', 5, null);
    expect(over.overflow).toBe(true);
    expect(over.needs).toEqual(['agility', 'wits', 'perception', 'instinct', 'empathy']);
    expect(over.attrs).toEqual(a);
    expect(addPoint(a, 'strength', 5, 'strength').needs).not.toBeNull();
    expect(addPoint(a, 'strength', 5, 'perception').attrs).toMatchObject({ strength: 5, perception: 5 });
  });

  it('rolls the higher performance attribute, and lets the player pick on a tie', () => {
    expect(performanceAttribute(A(4, 2, 2, 4, 2, 2), ['strength', 'instinct'], null)).toEqual({ attribute: 'strength', dice: 4, choose: null });
    expect(performanceAttribute(A(2, 3, 2, 3, 2, 2), ['agility', 'perception'], null)).toEqual({ attribute: null, dice: 3, choose: ['agility', 'perception'] });
    expect(performanceAttribute(A(2, 3, 2, 3, 2, 2), ['agility', 'perception'], 'perception').attribute).toBe('perception');
  });

  it('swaps the highest rating onto the key attribute, with the player picking between equals', () => {
    const a = A(2, 4, 4, 3, 3, 2);
    expect(swapOptions(a, 'agility')).toBeNull();
    expect(swapOptions(a, 'instinct')).toEqual(['agility', 'wits']);
    const swapped = applySwap(a, 'instinct', 'wits');
    expect(swapped).toEqual(A(2, 4, 3, 3, 4, 2));
    expect(attributeTotal(swapped)).toBe(attributeTotal(a));
    // Mira as a Tactician: her Instinct 2 swaps with her Strength 5.
    expect(swapOptions(A(5, 2, 2, 4, 2, 3), 'instinct')).toEqual(['strength']);
  });

  it('raises the key attribute to 4 and lowers another attribute rated 3 or more for each point', () => {
    const a = A(3, 3, 3, 3, 3, 3);
    expect(applyFloor(a, 'wits', 4, [])).toMatchObject({ points: 1, needs: ['strength', 'agility', 'perception', 'instinct', 'empathy'] });
    const f = applyFloor(a, 'wits', 4, ['empathy']);
    expect(f).toMatchObject({ points: 1, needs: null, valid: true });
    expect(f.attrs).toEqual(A(3, 3, 4, 3, 3, 2));
    expect(attributeTotal(f.attrs)).toBe(18);
    expect(applyFloor(A(2, 2, 3, 2, 2, 2), 'wits', 4, ['strength']).needs).toEqual([]);
    expect(applyFloor(A(5, 2, 2, 4, 2, 3), 'strength', 4, []).points).toBe(0);
  });

  it('gives a Top 10 graduate 1 more on the key attribute, never above 6', () => {
    expect(applyTop10(A(5, 2, 2, 4, 2, 3), 'strength', 1, 6).strength).toBe(6);
    expect(applyTop10(A(6, 2, 2, 4, 2, 3), 'strength', 1, 6).strength).toBe(6);
    expect(applyTop10(A(4, 3, 3, 3, 2, 3), 'agility', 1, 6).agility).toBe(4);
  });

  it('derives Health and Resolve from the final ratings, rounding up', () => {
    expect(finishValues(A(5, 2, 2, 4, 2, 3))).toEqual({ health: 6, resolve: 3, stress: 0, minimumStress: 0 });
    expect(finishValues(A(2, 2, 4, 3, 3, 4))).toMatchObject({ health: 4, resolve: 4 });
  });
});

describe('Talents at creation', () => {
  it('caps every Talent at 2, and a rule Talent at its max level', () => {
    expect(creationMax(t, 'clean-cut')).toBe(2);
    expect(creationMax(t, 'blade-discipline')).toBe(1);
    expect(canGain(t, { 'clean-cut': 1 }, 'clean-cut')).toBe(true);
    expect(canGain(t, { 'clean-cut': 2 }, 'clean-cut')).toBe(false);
    expect(canGain(t, { 'iron-nerve': 1 }, 'iron-nerve')).toBe(false);
  });

  it("offers an event's own Talents and the year's whole curriculum beside them", () => {
    const year = t.years[0];
    const inspection = year.events[0]; // Iron Nerve (rule), Long Haul, or Steady Heart
    const open = eventTalentOptions(t, {}, inspection, year);
    expect(open.event).toEqual(inspection.talents);
    expect(open.options.slice(0, inspection.talents.length)).toEqual(inspection.talents);
    expect(open.options).toEqual(expect.arrayContaining(year.curriculum));
    expect(open.options.length).toBeGreaterThanOrEqual(year.curriculum.length);
    expect(open.fallback).toBe('none');
    // A capped Talent drops off both lists; the rest of the year is still open.
    const some = eventTalentOptions(t, { 'iron-nerve': 1 }, inspection, year);
    expect(some.options).not.toContain('iron-nerve');
    expect(some.event).toEqual(['long-haul', 'steady-heart']);
    expect(some.fallback).toBe('none');
  });

  it('opens every Talent when neither the event nor the curriculum can gain a level', () => {
    const year = t.years[0];
    const inspection = year.events[0];
    const capped: Record<string, number> = {};
    for (const id of [...inspection.talents, ...year.curriculum]) capped[id] = 2;
    const all = eventTalentOptions(t, capped, inspection, year);
    expect(all.fallback).toBe('all-capped');
    expect(all.options).toContain('clean-cut');
    expect(all.options).not.toContain('long-haul');
  });

  it("offers the Specialty's list and the general list at Graduation", () => {
    const slayer = t.specialties.find((x) => x.id === 'slayer')!;
    const g = specialtyTalentOptions(t, {}, slayer);
    expect(g.specialty).toEqual(slayer.talents);
    expect(g.general).toEqual(t.general);
    expect(g.options.length).toBe(slayer.talents.length + t.general.length);
    expect(specialtyTalentOptions(t, { 'clean-cut': 2, 'iron-nerve': 1 }, slayer).options).toEqual(expect.not.arrayContaining(['clean-cut', 'iron-nerve']));
  });

  it('keeps a built soldier to one Talent at level 2', () => {
    expect(builtCanGain(t, { 'clean-cut': 1 }, 'clean-cut')).toBe(true);
    expect(builtCanGain(t, { 'clean-cut': 2 }, 'clean-cut')).toBe(false);
    expect(builtCanGain(t, { 'clean-cut': 2, hamstringer: 1 }, 'hamstringer')).toBe(false);
    expect(builtCanGain(t, { 'clean-cut': 2, hamstringer: 1 }, 'lure')).toBe(true);
    expect(builtCanGain(t, { 'blade-discipline': 1 }, 'blade-discipline')).toBe(false);
  });
});

describe('the Graduation Exam', () => {
  const [individual, titan, squad] = t.exam.stages;
  const fair = t.exam.conditions.find((c) => c.id === 'a-fair-run')!;
  const rain = t.exam.conditions.find((c) => c.id === 'driving-rain')!;
  const worn = t.exam.conditions.find((c) => c.id === 'worn-training-gear')!;
  const twice = t.exam.conditions.find((c) => c.id === 'best-of-two')!;
  const short = t.exam.conditions.find((c) => c.id === 'a-short-course')!;
  const balance = individual.trials.find((x) => x.id === 'odm-balance-test')!;
  const dummy = titan.trials.find((x) => x.id === 'titan-dummy-course')!;
  const field = squad.trials.find((x) => x.id === 'the-squad-field-exercise')!;
  const levels = { 'clean-cut': 1, 'titan-reader': 1, 'hunters-eye': 1, 'ground-work': 2, 'field-medicine': 1, 'sure-hands': 1 };
  const a = A(4, 3, 2, 4, 2, 3);

  it('gives every Stage six Trials, one per tens die, and six conditions', () => {
    expect(t.exam.stages.length).toBe(3);
    for (const st of t.exam.stages) expect(st.trials.map((x) => x.result)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(t.exam.conditions.map((c) => c.result)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('builds each Trial pool from the attribute, a dice Talent, Help, exam issue, and Exam Stress', () => {
    expect(trialPool(t, a, levels, individual, fair, balance.choices[0], { helped: true, stress: 0, hunterEye: false })).toMatchObject({ attribute: 'agility', base: 3, talent: null, bonus: 0, gear: 1, stress: 0, maxPushes: 0 });
    // Ground Work is conditional (a grounded Titan): Clean Cut counts, Ground Work never does.
    expect(trialPool(t, a, levels, titan, fair, dummy.choices[0], { helped: false, stress: 0, hunterEye: false })).toMatchObject({ base: 5, talent: { id: 'clean-cut', dice: 1 }, gear: 1 });
    const read = field.choices.find((c) => c.entry === 'read')!;
    expect(trialPool(t, a, levels, squad, fair, read, { helped: true, stress: 1, hunterEye: false })).toMatchObject({ attribute: 'instinct', base: 2 + 1 + 1, gear: 0, stress: 1, maxPushes: 1 });
    expect(trialPool(t, a, levels, squad, fair, read, { helped: false, stress: 0, hunterEye: true })).toMatchObject({ attribute: 'perception', base: 4 + 1 });
    const treat = field.choices.find((c) => c.entry === 'treat-injury')!;
    expect(trialPool(t, a, levels, squad, fair, treat, { helped: false, stress: 0, hunterEye: false })).toMatchObject({ attribute: 'wits', gear: 1, maxPushes: 2 });
  });

  it("applies the Trial's condition to the pool", () => {
    // Worn training gear takes the Gear Dice; run it twice adds a Bonus Die and one more Push.
    expect(trialPool(t, a, levels, individual, worn, balance.choices[0], { helped: false, stress: 0, hunterEye: false })).toMatchObject({ gear: 0, bonus: 0, maxPushes: 0 });
    expect(trialPool(t, a, levels, individual, twice, balance.choices[0], { helped: false, stress: 0, hunterEye: false })).toMatchObject({ gear: 1, bonus: 1, maxPushes: 1 });
    expect(trialPool(t, a, levels, squad, twice, field.choices[0], { helped: false, stress: 0, hunterEye: false })).toMatchObject({ bonus: 1, maxPushes: 2 });
  });

  it('moves the successes needed and the Merit bands together', () => {
    expect(trialNeeds(individual, fair)).toBe(2);
    expect(trialNeeds(individual, rain)).toBe(3);
    expect(trialNeeds(individual, short)).toBe(1);
    expect(trialNeeds(squad, rain)).toBe(4);
    expect([0, 1, 2, 3].map((n) => trialMerit(t, individual, rain, n, false))).toEqual([0, 0, 0, 1]);
    expect([0, 1, 2].map((n) => trialMerit(t, individual, short, n, false))).toEqual([0, 1, 1]);
    // The lowest band always keeps an open bottom, so no result falls outside the table.
    expect(trialBands(individual, rain)[0].min).toBeNull();
  });

  it('pays Merit at its threshold and charges 1 for a Stress Response', () => {
    expect([0, 1, 2, 5].map((n) => trialMerit(t, individual, fair, n, false))).toEqual([0, 0, 1, 1]);
    expect(squad.needs).toBe(3);
    expect([2, 3].map((n) => trialMerit(t, squad, fair, n, false))).toEqual([0, 1]);
    expect(trialMerit(t, squad, fair, 2, true)).toBe(-1);
    expect(trialMerit(t, squad, fair, 3, true)).toBe(0);
    expect(individual.push).toBe(false);
    expect(titan.push).toBe(false);
    expect(squad.push && squad.help).toBe(true);
  });
});

describe('the builds', () => {
  it('takes a template ratings unchanged, every one a legal build', () => {
    for (const s of t.specialties) {
      const a = templateAttributes(t, s.id);
      expect(builtAttributesValid(t, a, s.key)).toBe(true);
    }
    expect(templateAttributes(t, 'slayer')).toEqual(A(4, 3, 2, 3, 3, 3));
  });

  it('checks a Free Build placement against its shape and the key attribute', () => {
    const p = { strength: 4, agility: 4, perception: 3, instinct: 3, wits: 2, empathy: 2 };
    expect(freeBuildValid(t, 'two-fours', p, 'strength')).toBe(true);
    expect(freeBuildValid(t, 'two-fours', p, 'wits')).toBe(false);
    expect(freeBuildValid(t, 'one-four', p, 'strength')).toBe(false);
    expect(freeBuildValid(t, 'two-fours', { ...p, empathy: null }, 'strength')).toBe(false);
    expect(freeBuildLeft(t, 'two-fours', { strength: 4, agility: null, wits: 2, perception: null, instinct: null, empathy: null })).toEqual([4, 3, 3, 2]);
    expect(builtAttributesValid(t, A(4, 4, 4, 2, 2, 2), 'strength')).toBe(false);
  });
});

describe('Standard Issue', () => {
  const issue = t.issue;

  it('gives a new soldier the Funding row, with a Specialty item for a Medic', () => {
    const plan = standardIssue(issue, 'medic', [], [], { spares: 0, blades: 0, item: false });
    expect(issue.funding).toBe(3);
    expect(plan.create).toEqual([
      { itemId: 'odm-gear', rating: 3, current: 3 },
      { itemId: 'blade-set', rating: 1, current: 1, inHandles: true },
      { itemId: 'blade-set', rating: 1, current: 1, inHandles: false },
      { itemId: 'blade-set', rating: 1, current: 1, inHandles: false },
      { itemId: 'horse', rating: 2, current: 2 },
      { itemId: 'medical-kit', rating: 1, current: 1 },
    ]);
    expect(plan.gasRating).toBe(3);
    expect(plan.spareCanisters).toEqual([3]);
    expect(plan.offered).toEqual({ spares: 1, blades: 3, item: true });
    expect(standardIssue(issue, 'slayer', [], [], { spares: 0, blades: 0, item: false }).given.item).toBeNull();
    expect(standardIssue(issue, 'engineer', [], [], { spares: 0, blades: 0, item: false }).given.item).toEqual({ itemId: 'tool-kit', rating: 1 });
  });

  it('honours declines, fitting the first Blade Set received into empty handles', () => {
    const plan = standardIssue(issue, 'medic', [], [], { spares: 1, blades: 2, item: true });
    expect(plan.spareCanisters).toEqual([]);
    expect(plan.create.filter((c) => c.itemId === 'blade-set')).toEqual([{ itemId: 'blade-set', rating: 1, current: 1, inHandles: true }]);
    expect(plan.create.some((c) => c.itemId === 'medical-kit')).toBe(false);
  });

  it('counts and keeps gear already held, and replaces worn ODM Gear', () => {
    const held = [
      { id: 'o1', itemId: 'odm-gear', rating: 2, current: 1, inHandles: false, kept: false },
      { id: 'b1', itemId: 'blade-set', rating: 1, current: 1, inHandles: false, kept: false },
      { id: 'h1', itemId: 'horse', rating: 2, current: 2, inHandles: false, kept: false },
    ];
    const plan = standardIssue(issue, 'slayer', held, [1], { spares: 0, blades: 0, item: false });
    expect(plan.remove).toEqual(['o1']);
    expect(plan.fit).toEqual(['b1']);
    expect(plan.create).toEqual([
      { itemId: 'odm-gear', rating: 3, current: 3 },
      { itemId: 'blade-set', rating: 1, current: 1, inHandles: false },
      { itemId: 'blade-set', rating: 1, current: 1, inHandles: false },
    ]);
    expect(plan.spareCanisters).toEqual([3]);
    expect(plan.given.horse).toBeNull();
  });
});

describe('the tables and wording the wizard reads', () => {
  it('fails the build when a Lifepath table changes shape', () => {
    const edit = (path: string, from: string, to: string) => (p: string) => (p === path ? fileReader(p).replace(from, to) : fileReader(p));
    expect(() => loadTables(edit('data/character/lifepath.yaml', '  - id: why-you-enlisted\n', '  - id: why-you-joined\n'))).toThrow(DataShapeError);
    expect(() => loadTables(edit('data/character/training-years.yaml', '        merit_change: 1\n', '        merit_change: one\n'))).toThrow(/training-years\.yaml/);
    expect(() => loadTables(edit('data/character/enlistment.yaml', 'results: [11, 12, 13]', 'results: [11, 12]'))).toThrow(/13/);
    expect(() => loadTables(edit('data/character/class-rank.yaml', 'key_attribute_bonus: 1', 'key_attribute_bonus: 2'))).toThrow(DataShapeError);
    expect(() => loadTables(edit('data/character/attributes.yaml', 'cap_before_graduation: 5', 'cap_before_graduation: 6'))).toThrow(DataShapeError);
  });

  it("reads each step's text from Making Your Soldier", () => {
    const w = loadLifepathWording();
    expect(w.sections.origin[0]).toMatchObject({ kind: 'p' });
    expect(w.sections.origin[0].items[0].text).toMatch(/roll D66 on the Origin table/);
    expect(w.sections['the-build-steps'][1]).toMatchObject({ kind: 'ol' });
    expect(w.sections['the-build-steps'][1].items[2].text).toMatch(/\*\*Template Build:\*\*/);
    expect(w.boxes['Talent cap'][1].items).toHaveLength(2);
    expect(w.flows['fig-graduation'].map((x) => x.title)).toEqual(['Class Rank', 'Specialty', 'Swap and floor', 'Top 10', 'Specialty Talent']);
    expect(config.lifepathPage.sections.finishing).toEqual(w.sections.finishing);
  });

  it('turns the page markup into plain words, and fails when a section is gone', () => {
    expect(inline('Record a <GlossaryTerm term="Haven" />, as <a href="/x/">the Lifepath</a> does.')).toBe('Record a Haven, as the Lifepath does.');
    expect(blocks('1. **One.** First\n2. Two\n   - sub a\n   more\n\nA paragraph\nwraps.\n- bullet')).toEqual([
      { kind: 'ol', start: 1, items: [{ text: '**One.** First', sub: [] }, { text: 'Two', sub: ['sub a', 'more'] }] },
      { kind: 'p', items: [{ text: 'A paragraph wraps.', sub: [] }] },
      { kind: 'ul', items: [{ text: 'bullet', sub: [] }] },
    ]);
    expect(() => loadLifepathWording((p) => (p === LIFEPATH_PAGE ? fileReader(p).replace('id="origin"', 'id="origins"') : fileReader(p)))).toThrow(/"origin"/);
  });
});
