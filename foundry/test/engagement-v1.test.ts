/**
 * Milestone 4's v1 additions (foundry/docs/tracker-plan.md, section 10): Fear Rolls from the
 * tracker, steam and fall rolls, the engagement-end steps, forced retreat moves, and the HUD fade.
 */
import { describe, expect, it } from 'vitest';
import { CLOSING_CHECKS, engagementLimited, griefGains, keptResponses, relievedStress, retiring, turnLimitsToChange } from '../src/rules/engagement/closing.ts';
import { fearPlan, type FearSoldier } from '../src/rules/engagement/fear.ts';
import { autoChecks, closingLog, endComplete, roundBlock, TRACKER_CATEGORIES, type TrackerCategory } from '../src/rules/engagement/round.ts';
import { checkTrackerRequest, type TrackerWorld } from '../src/rules/engagement/guard.ts';
import { damageSoldier, fallBand, fallDamage, fallLands, referenceLabel, steamDamage, steamRollers } from '../src/rules/engagement/harm-rolls.ts';
import { emptyFlags, type SoldierState, type TitanRow } from '../src/rules/engagement/types.ts';
import { engagementConfig } from '../tools/config-data.ts';
import { loadTables } from '../tools/data/load.ts';

const tables = loadTables();
const E = engagementConfig(tables);

function soldier(id: string, extra: Partial<SoldierState> = {}): SoldierState {
  return { id, name: id, pc: true, alive: true, down: false, left: false, carriedBy: null, carrying: null, pinned: null, mounted: false, airborne: false, odmHad: true, positions: { A: 'distant' }, untreated: 0, ...extra };
}

function titan(label: string, extra: Partial<TitanRow> = {}): TitanRow {
  return { key: `t${label}`, label, status: 'focus', tempo: 1, ladder: [], holder: '', grab: null, decoy: null, decoysInRow: 0, flags: emptyFlags(), grounded: false, entered: 1, ...extra };
}

const fs = (id: string, extra: Partial<FearSoldier> = {}): FearSoldier => ({ ...soldier(id), faced: true, numb: false, ...extra });

describe('Fear Rolls from the tracker (fear-rolls.yaml)', () => {
  const A = [titan('A')];

  it('rolls a first Titan Engagement once, sets faced_a_titan for a Down soldier too, and never rolls for the Down one', () => {
    const plan = fearPlan([fs('new', { faced: false }), fs('old'), fs('down', { faced: false, down: true })], A, { kind: 'start', abnormal: false });
    expect(plan.rollers).toEqual([{ id: 'new', trigger: 'first-titan-engagement' }]);
    expect(plan.faced).toEqual(['new', 'down']);
  });

  it('rolls once per soldier when a first Titan Engagement is against an Abnormal', () => {
    const plan = fearPlan([fs('new', { faced: false }), fs('old')], A, { kind: 'start', abnormal: true });
    expect(plan.rollers).toEqual([
      { id: 'new', trigger: 'first-titan-engagement' },
      { id: 'old', trigger: 'abnormal' },
    ]);
  });

  it('rolls for a second Focus Titan, once even when it is an Abnormal, and not for a first one entering', () => {
    const two = [titan('A'), titan('B')];
    const s = [fs('a', { positions: { A: 'distant', B: 'distant' } }), fs('gone', { left: true, positions: {} })];
    expect(fearPlan(s, two, { kind: 'enter', abnormal: false, focusCount: 2 }).rollers).toEqual([{ id: 'a', trigger: 'second-focus-titan' }]);
    expect(fearPlan(s, two, { kind: 'enter', abnormal: true, focusCount: 2 }).rollers).toEqual([{ id: 'a', trigger: 'abnormal' }]);
    expect(fearPlan(s, two, { kind: 'enter', abnormal: false, focusCount: 1 }).rollers).toEqual([]);
  });

  it('rolls for the witnesses of a Grab or a death: never the subject, the dead, the departed, or a Down witness', () => {
    const s = [fs('grabbed'), fs('w1'), fs('w2', { down: true }), fs('dead', { alive: false }), fs('left', { left: true, positions: {} })];
    expect(fearPlan(s, A, { kind: 'grabbed', soldier: 'grabbed' }).rollers).toEqual([{ id: 'w1', trigger: 'comrade-grabbed' }]);
    expect(fearPlan(s, A, { kind: 'dies', soldier: 'dead' }).rollers.map((r) => r.id)).toEqual(['grabbed', 'w1']);
  });

  it('skips a witness with the Numb Scar for a death, not for a Grab', () => {
    const s = [fs('x'), fs('numb', { numb: true })];
    expect(fearPlan(s, A, { kind: 'dies', soldier: 'x' }).rollers).toEqual([]);
    expect(fearPlan(s, A, { kind: 'grabbed', soldier: 'x' }).rollers).toEqual([{ id: 'numb', trigger: 'comrade-grabbed' }]);
  });

  it('counts a soldier who holds a Position only relative to a corpse as a witness', () => {
    const s = [fs('x', { positions: { A: 'in-reach' } }), fs('y', { positions: { A: 'distant' } })];
    expect(fearPlan(s, [titan('A', { status: 'corpse' })], { kind: 'dies', soldier: 'x' }).rollers).toEqual([{ id: 'y', trigger: 'comrade-dies' }]);
  });

  it('names only triggers the data lists', () => {
    const ids = tables.fearRolls.triggers.map((t) => t.id);
    for (const t of ['first-titan-engagement', 'abnormal', 'second-focus-titan', 'comrade-grabbed', 'comrade-dies']) expect(ids).toContain(t);
    expect(E.cards).toBe(20);
  });
});

describe('steam and fall rolls (titan-harm.yaml, steam; falls.yaml)', () => {
  it('reads the steam table: 1 to 3 nothing, 4 and 5 one, 6 two', () => {
    expect([1, 2, 3, 4, 5, 6].map((d) => steamDamage(E.steam.rows, d))).toEqual([0, 0, 0, 1, 1, 2]);
    expect(E.steam.type).toBe('burn');
  });

  it('names On Body and Blind Spot and the freed soldier at a kill, only On Body at a Regeneration fill', () => {
    const s = [
      { id: 'on', alive: true, left: false, positions: { A: 'on-body' as const } },
      { id: 'blind', alive: true, left: false, positions: { A: 'blind-spot' as const } },
      { id: 'reach', alive: true, left: false, positions: { A: 'in-reach' as const } },
      { id: 'held', alive: true, left: false, positions: { A: 'in-reach' as const } },
      { id: 'dead', alive: false, left: false, positions: { A: 'on-body' as const } },
    ];
    expect(steamRollers('kill', s, 'A', 'held')).toEqual(['on', 'blind', 'held']);
    expect(steamRollers('regeneration-fill', s, 'A')).toEqual(['on']);
  });

  it('finds the fall band: low from Distant or In Reach, high from the body, one step up in the Giant Forest or by a Large Titan', () => {
    expect(fallBand({ position: 'in-reach', anchor: 'wooded', referenceSize: 'medium' })).toBe('low');
    expect(fallBand({ position: 'on-body', anchor: 'wooded', referenceSize: 'medium' })).toBe('high');
    expect(fallBand({ position: 'blind-spot', anchor: 'giant-forest', referenceSize: 'large' })).toBe('extreme');
    expect(fallBand({ position: 'distant', anchor: 'open', referenceSize: 'large' })).toBe('high');
    expect(fallBand({ position: 'on-body', anchor: 'giant-forest', referenceSize: 'small', fromHorse: true })).toBe('low');
    expect(fallBand({ position: 'on-body', anchor: 'giant-forest', referenceSize: 'small', named: 'low' })).toBe('low');
    expect(fallBand({ position: null, anchor: null, referenceSize: null })).toBe('low');
  });

  it('rolls D6 plus the band on the damage table', () => {
    expect(E.falls.bands).toEqual({ low: 0, high: 2, extreme: 4 });
    expect([1, 2, 3, 4, 5, 6].map((d) => fallDamage(E.falls.rows, E.falls.bands, 'low', d))).toEqual([0, 0, 1, 1, 2, 2]);
    expect([1, 6].map((d) => fallDamage(E.falls.rows, E.falls.bands, 'extreme', d))).toEqual([2, 4]);
    expect(E.falls.type).toBe('crush');
  });

  it('lands On Body and Blind Spot at In Reach, and picks the closest Titan, the causing one on a tie', () => {
    expect(fallLands('blind-spot')).toBe('in-reach');
    expect(fallLands('distant')).toBe('distant');
    expect(referenceLabel({ A: 'in-reach', B: 'on-body' }, ['A', 'B'], 'A')).toBe('B');
    expect(referenceLabel({ A: 'on-body', B: 'blind-spot' }, ['A', 'B'], 'B')).toBe('A');
    expect(referenceLabel({ A: 'in-reach', B: 'in-reach' }, ['A', 'B'], 'B')).toBe('B');
    expect(referenceLabel({ A: 'in-reach', B: 'in-reach' }, ['A', 'B'], null)).toBe('A');
    expect(referenceLabel({}, ['A'], null)).toBeNull();
  });

  it('applies damage: nothing for 0, Health lost to 0 then a Critical Injury, and at 0 only the injury', () => {
    expect(damageSoldier(1, 3, 0)).toEqual({ lost: 1, injury: false });
    expect(damageSoldier(1, 3, 2)).toEqual({ lost: 3, injury: false });
    expect(damageSoldier(1, 3, 3)).toEqual({ lost: 4, injury: true });
    expect(damageSoldier(1, 2, 4)).toEqual({ lost: 3, injury: true });
    expect(damageSoldier(4, 0, 1)).toEqual({ lost: 4, injury: true });
  });

  it('lets a player ask the GM to let go only for their own soldier close to the body', () => {
    const snap = {
      combat: 'c', mode: 'titan', step: 'play', round: 1, anchor: null,
      soldiers: [soldier('mine', { positions: { A: 'on-body' } }), soldier('far', { positions: { A: 'distant' } })],
      titans: [titan('A')], wings: {}, cards: {}, titanCards: {}, swapped: [], proposal: null,
      retreat: false, wingsSet: true, wingsOpen: false, reassign: [], tactics: { held: [], used: [] }, cloaks: [],
    } as never;
    const w = (owned: string[]): TrackerWorld => ({ userId: 'u', owns: (id) => owned.includes(id), snapshot: () => snap });
    expect(checkTrackerRequest(w(['mine']), { act: 'let-go', combat: 'c', soldier: 'mine', titan: 'tA' })).toBeNull();
    expect(checkTrackerRequest(w([]), { act: 'let-go', combat: 'c', soldier: 'mine', titan: 'tA' })).toMatch(/owner/);
    expect(checkTrackerRequest(w(['far']), { act: 'let-go', combat: 'c', soldier: 'far', titan: 'tA' })).toMatch(/notClose/);
  });
});

describe('the engagement-end steps (engagement-end.yaml)', () => {
  const on = Object.fromEntries(TRACKER_CATEGORIES.map((c) => [c, true])) as Record<TrackerCategory, boolean>;

  it('lists the data steps in order', () => {
    expect(CLOSING_CHECKS).toEqual(tables.engagementEnd.steps.map((x) => x.id));
    expect(E.closing.relief).toEqual({ titan: 1, skirmish: 1 });
    expect(E.closing.griefMax).toBe(3);
  });

  it('runs the automatic steps and stops before a step the table resolves, then goes on once it is stamped', () => {
    const log = closingLog();
    expect(autoChecks(log, on)).toEqual([0, 1, 2, 3]);
    const done = log.map((e, i) => (i < 4 ? { ...e, state: 'done' as const } : e));
    expect(autoChecks(done, on)).toEqual([]);
    const stamped = done.map((e, i) => (i < 7 ? { ...e, state: 'done' as const } : e));
    expect(autoChecks(stamped, on)).toEqual([7, 8]);
    expect(endComplete({ endLog: stamped.map((e) => ({ ...e, state: 'done' as const })) })).toBe(true);
    expect(roundBlock({ mode: 'titan', step: 'closing', round: 3, wingsSet: true, wingsOpen: false, reassign: [], endLog: stamped }, 'next-round')).toBe('wrongStep');
  });

  it('lowers Stress to no less than the minimum, and ends only the responses gained in the engagement', () => {
    expect(relievedStress(3, 0, 1)).toBe(2);
    expect(relievedStress(1, 1, 1)).toBe(1);
    expect(keptResponses([{ ends: 'titan-engagement-end' }, { ends: 'day' }])).toEqual([{ ends: 'day' }]);
  });

  it('turns lethal turn limits into engagement limits, and lists the untreated limited ones for aftermath and Death Rolls', () => {
    const items = [
      { id: 'a', lethal: true, treated: false, limit: 'turn' as const },
      { id: 'b', lethal: true, treated: true, limit: 'engagement' as const },
      { id: 'c', lethal: false, treated: false, limit: 'turn' as const },
      { id: 'd', lethal: true, treated: false, limit: 'day' as const },
      { id: 'e', lethal: true, treated: false, limit: 'engagement' as const },
    ];
    expect(turnLimitsToChange(items)).toEqual(['a']);
    expect(engagementLimited(items)).toEqual(['a', 'e']);
  });

  it('gives 1 Grief for all the deaths, 1 more per dead soldier a Drive named, the Numb Scar 1 more per death, to at most 3', () => {
    const g = (id: string, extra = {}) => ({ id, alive: true, grief: 0, driveNamed: '', numb: false, ...extra });
    const soldiers = [g('d1', { alive: false }), g('d2', { alive: false }), g('plain'), g('named', { driveNamed: 'd1' }), g('numb', { numb: true }), g('full', { grief: 3 })];
    expect(griefGains(soldiers, 3)).toEqual({ plain: 1, named: 2, numb: 3 });
    expect(griefGains([g('alone')], 3)).toEqual({});
  });

  it('retires the living with five Scars once', () => {
    expect(retiring([{ id: 'a', alive: true, scars: 5, retiring: false }, { id: 'b', alive: true, scars: 5, retiring: true }, { id: 'c', alive: false, scars: 6, retiring: false }, { id: 'd', alive: true, scars: 4, retiring: false }])).toEqual(['a']);
  });
});
