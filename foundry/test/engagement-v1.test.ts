/**
 * Milestone 4's v1 additions (foundry/docs/tracker-plan.md, section 10): Fear Rolls from the
 * tracker, steam and fall rolls, the engagement-end steps, forced retreat moves, and the HUD fade.
 */
import { describe, expect, it } from 'vitest';
import { CLOSING_CHECKS, engagementLimited, griefGains, keptResponses, relievedStress, retiring, turnLimitsToChange } from '../src/rules/engagement/closing.ts';
import { fearPlan, type FearSoldier } from '../src/rules/engagement/fear.ts';
import { autoChecks, closingLog, endComplete, roundBlock, TRACKER_CATEGORIES, type TrackerCategory } from '../src/rules/engagement/round.ts';
import { checkTrackerRequest, type TrackerWorld } from '../src/rules/engagement/guard.ts';
import { damageSoldier, fallBand, fallDamage, referenceBody, steamDamage, steamRollers } from '../src/rules/engagement/harm-rolls.ts';
import { configureRatings } from '../src/rules/engagement/positions.ts';
import { moveKinds, retreatBinds, retreatOptions, stayOpen } from '../src/rules/engagement/retreat.ts';
import { configureZones, derivePositions, generateField } from '../src/rules/engagement/zones.ts';
import type { AnchorRating, Snapshot } from '../src/rules/engagement/types.ts';
import { DiceFade } from '../src/tracker/dice-fade.ts';
import { emptyFlags, type SoldierState, type TitanRow } from '../src/rules/engagement/types.ts';
import { engagementConfig } from '../tools/config-data.ts';
import { loadTables } from '../tools/data/load.ts';

const tables = loadTables();
const E = engagementConfig(tables);
configureZones(E.zones);
configureRatings(E.ratings as AnchorRating[]);
const field = generateField('standard', 'wooded', Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 1, 'wooded'])), () => 3);

function soldier(id: string, extra: Partial<SoldierState> = {}): SoldierState {
  return { id, name: id, pc: true, alive: true, down: false, left: false, carriedBy: null, carrying: null, pinned: null, mounted: false, airborne: false, odmHad: true, zone: 8, attachment: { kind: 'ground', body: null }, horseZone: null, positions: { A: 'distant' }, momentum: 0, untreated: 0, ...extra };
}

function titan(label: string, extra: Partial<TitanRow> = {}): TitanRow {
  return { key: `t${label}`, label, status: 'focus', tempo: 1, frenzy: 0, ladder: [], holder: '', grab: null, decoy: null, decoysInRow: 0, flags: emptyFlags(), grounded: false, entered: 1, zone: 7, stride: 2, figure: 'medium', ...extra };
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

  it('reads the fall against the body the attachment named, else the causing Titan, else the nearest (16-22)', () => {
    const ts = [titan('A', { zone: 7 }), titan('B', { zone: 1 })];
    expect(referenceBody({ kind: 'blind-spot', body: 'B' }, 'A', 1, ts, field)).toBe('B');
    expect(referenceBody({ kind: 'grabbed', body: 'A' }, null, 7, ts, field)).toBe('A');
    expect(referenceBody({ kind: 'anchored', body: null }, 'B', 8, ts, field)).toBe('B');
    expect(referenceBody({ kind: 'ground', body: null }, null, 2, ts, field)).toBe('B');
    expect(referenceBody({ kind: 'ground', body: null }, null, 8, ts, field)).toBe('A');
    expect(referenceBody({ kind: 'ground', body: null }, null, 8, [], field)).toBeNull();
  });

  it('falls back to the nearest corpse with no Focus Titan alive, and raises a bodiless fall in a Giant Forest zone (OQ-206)', () => {
    const corpses = [titan('B', { zone: 13, status: 'corpse' }), titan('A', { zone: 1, status: 'corpse' }), titan('C', { zone: 3, status: 'corpse' })];
    expect(referenceBody({ kind: 'ground', body: null }, null, 2, corpses, field)).toBe('A');
    expect(referenceBody({ kind: 'ground', body: null }, null, 7, corpses, field)).toBe('A');
    expect(referenceBody({ kind: 'ground', body: null }, null, 8, [titan('D', { zone: 13 }), ...corpses], field)).toBe('D');
    expect(fallBand({ position: null, anchor: 'giant-forest', referenceSize: null })).toBe('high');
    expect(fallBand({ position: null, anchor: 'wooded', referenceSize: null })).toBe('low');
    expect(fallBand({ position: 'in-reach', anchor: 'giant-forest', referenceSize: 'large' })).toBe('high');
    expect(fallBand({ position: null, anchor: 'wooded', referenceSize: null, fromHorse: true })).toBe('low');
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
      soldiers: [soldier('mine', { zone: 7, attachment: { kind: 'on-body', body: 'A' }, positions: { A: 'on-body' } }), soldier('far', { positions: { A: 'distant' } })],
      titans: [titan('A')], wings: {}, cards: {}, titanCards: {}, swapped: [], proposal: null,
      retreat: false, wingsSet: true, wingsOpen: false, reassign: [], tactics: { held: [], used: [] }, cloaks: [],
      field, leftItems: [], arrivals: {}, odmUsed: [], movesSpent: [],
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

describe('the retreat forced moves (background-titans.yaml, retreat, moves; 16-27)', () => {
  const clock = { length: 2, filled: 2, active: true, began: 3 };
  const placed = (s: SoldierState, titans: TitanRow[]) => ({ ...s, positions: derivePositions(s, titans) });
  const snap = (soldiers: SoldierState[], titans: TitanRow[], round = 4): Snapshot => ({
    combat: 'c', mode: 'titan', step: 'play', round, anchor: null, field, leftItems: [], arrivals: {},
    soldiers: soldiers.map((s) => placed(s, titans)), titans, wings: {}, cards: {}, titanCards: {}, swapped: [], proposal: null,
    retreat: true, wingsSet: true, wingsOpen: false, reassign: [], tactics: { held: [], used: [] }, cloaks: [], odmUsed: [], movesSpent: [],
  });
  const ends = (s: SoldierState, sn: Snapshot) => retreatOptions(s, sn, E.ratings as AnchorRating[], undefined, clock).map((o) => `${o.kind}:${o.to.zone ?? 'off'}:${o.to.attachment.kind}`).sort();

  it('binds a soldier on the field who is not Down, Grabbed, or carried, and only during a retreat', () => {
    const w = { clock, grabbedBy: () => null };
    expect(retreatBinds(soldier('s'), w)).toBe(true);
    expect(retreatBinds(soldier('d', { down: true }), w)).toBe(false);
    expect(retreatBinds(soldier('c', { carriedBy: 'x' }), w)).toBe(false);
    expect(retreatBinds(soldier('g'), { clock, grabbedBy: (id) => (id === 'g' ? 'A' : null) })).toBe(false);
    expect(retreatBinds(soldier('o', { zone: null, left: true }), w)).toBe(false);
    expect(retreatBinds(soldier('s'), { clock: { ...clock, active: false }, grabbedBy: () => null })).toBe(false);
  });

  it('takes a soldier on a body to free first, then one ring out away from the Titan, then off from the edge', () => {
    const ts = [titan('A', { zone: 7 })];
    const on = soldier('s', { zone: 7, attachment: { kind: 'on-body', body: 'A' } });
    expect(ends(on, snap([on], ts))).toEqual(['odm:7:anchored']);
    const free = soldier('s', { zone: 7, odmHad: false });
    // Every ring 1 zone holds no body and lies one from A: the soldier's choice among them.
    expect(ends(free, snap([free], ts))).toEqual(['onFoot:10:ground', 'onFoot:4:ground', 'onFoot:5:ground', 'onFoot:6:ground', 'onFoot:8:ground', 'onFoot:9:ground']);
    const edge = soldier('s', { zone: 8, odmHad: false });
    expect(ends(edge, snap([edge], ts))).toEqual(['onFoot:off:ground']);
  });

  it('leaves from an edge zone even with a body in it, during a retreat', () => {
    const ts = [titan('A', { zone: 8 })];
    const s = soldier('s', { zone: 8, odmHad: false });
    expect(ends(s, snap([s], ts))).toContain('onFoot:off:ground');
  });

  it('opens a step toward a Down comrade while a Focus Titan lives, and after the stay limit only while one lives', () => {
    const s = soldier('s', { zone: 1, odmHad: false });
    const down = soldier('d', { zone: 7, down: true });
    const alive = [titan('A', { zone: 13 })];
    expect(ends(s, snap([s, down], alive, 9))).toContain('onFoot:4:ground');
    const dead = [titan('A', { zone: 13, status: 'corpse' })];
    expect(stayOpen(down, { titans: dead, clock, round: 5 })).toBe(true);
    expect(stayOpen(down, { titans: dead, clock, round: 6 })).toBe(false);
    expect(ends(s, snap([s, down], dead, 6))).not.toContain('onFoot:4:ground');
    expect(moveKinds(soldier('m', { mounted: true, odmHad: false }))).toEqual(['mounted']);
  });
});

describe('the HUD fade while Dice So Nice dice are on screen', () => {
  function clock() {
    let now = 0;
    const jobs = new Map<number, { at: number; fn: () => void }>();
    let id = 0;
    return {
      timers: { set: (fn: () => void, ms: number) => (jobs.set(++id, { at: now + ms, fn }), id), clear: (h: unknown) => void jobs.delete(h as number) },
      tick(ms: number) {
        now += ms;
        for (const [k, j] of [...jobs]) if (j.at <= now) {
          jobs.delete(k);
          j.fn();
        }
      },
    };
  }

  it('fades on the first roll, stays faded while any roll is on screen, and returns after the last one hides', () => {
    const c = clock();
    const seen: boolean[] = [];
    const fade = new DiceFade((a) => seen.push(a), 20000, c.timers);
    fade.start('m:1');
    fade.start('r:1');
    expect(seen).toEqual([true]);
    fade.finish('m:1', 3000);
    c.tick(3000);
    expect(fade.active).toBe(true);
    fade.finish('r:1', 0);
    expect(seen).toEqual([true, false]);
    fade.finish('unknown', 0);
    expect(seen).toEqual([true, false]);
  });

  it('never stays faded: a roll that never completes ends after the cap', () => {
    const c = clock();
    const seen: boolean[] = [];
    const fade = new DiceFade((a) => seen.push(a), 5000, c.timers);
    fade.start('m:2');
    c.tick(4999);
    expect(fade.active).toBe(true);
    c.tick(1);
    expect(seen).toEqual([true, false]);
  });
});
