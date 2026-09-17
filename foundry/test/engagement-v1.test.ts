/**
 * Milestone 4's v1 additions (foundry/docs/tracker-plan.md, section 10): Fear Rolls from the
 * tracker, steam and fall rolls, the engagement-end steps, forced retreat moves, and the HUD fade.
 */
import { describe, expect, it } from 'vitest';
import { fearPlan, type FearSoldier } from '../src/rules/engagement/fear.ts';
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
