import { describe, expect, it } from 'vitest';
import {
  blankEffect,
  blankEntry,
  cycleState,
  fillRegeneration,
  freeEntryId,
  freeResults,
  isGrounded,
  meetsBodyParts,
  mostDamaged,
  nextBehaviorFor,
  partsUsedCounts,
  partsUsedList,
  publicFacts,
  readResults,
  regenerate,
  strikeSuccesses,
  withoutEntry,
  withProgress,
  type BehaviorRow,
  type BodyPart,
  type PartState,
} from '../src/rules/titan.ts';
import { loadTables } from '../tools/data/load.ts';

const tables = loadTables();
const medium = tables.titans.find((t) => t.id === 'standard-medium')!;
const sprinter = tables.titans.find((t) => t.id === 'sprinting-abnormal')!;

const partsOf = (states: Partial<Record<string, PartState>> = {}, progress: Partial<Record<string, number>> = {}): BodyPart[] =>
  medium.body_parts.map((b) => ({ ...b, state: states[b.id] ?? 'intact', progress: progress[b.id] ?? 0 }));

describe('Body Part states (data/engagement/titan-harm.yaml)', () => {
  it('cycles intact, wounded, broken, intact and resets the count each time', () => {
    const arm = partsOf({}, { 'left-arm': 1 })[1];
    const wounded = cycleState(arm);
    expect(wounded).toMatchObject({ state: 'wounded', progress: 0 });
    expect(cycleState(cycleState(wounded))).toMatchObject({ state: 'intact', progress: 0 });
  });

  it('keeps the count between 0 and Toughness - 1, and 0 on a Broken part', () => {
    const arm = partsOf()[1];
    expect(withProgress(arm, 5).progress).toBe(arm.toughness - 1);
    expect(withProgress(arm, -1).progress).toBe(0);
    expect(withProgress({ ...arm, state: 'broken' }, 1).progress).toBe(0);
  });

  it('takes strike successes one at a time, then makes Openings once the part is Broken', () => {
    const arm = partsOf()[1]; // Toughness 2
    expect(strikeSuccesses(arm, 1)).toEqual({ part: { ...arm, progress: 1 }, openings: 0 });
    expect(strikeSuccesses(arm, 2).part).toMatchObject({ state: 'wounded', progress: 0 });
    expect(strikeSuccesses(arm, 5)).toEqual({ part: { ...arm, state: 'broken', progress: 0 }, openings: 1 });
  });

  it('is grounded while a leg is Broken', () => {
    expect(isGrounded(partsOf({ 'left-arm': 'broken' }))).toBe(false);
    expect(isGrounded(partsOf({ 'right-leg': 'broken' }))).toBe(true);
  });
});

describe('Regeneration (titan-harm.yaml, regeneration.when_full)', () => {
  it('picks the most damaged part, Broken before Wounded, ties to the first listed', () => {
    expect(mostDamaged(partsOf())).toBe(-1);
    expect(mostDamaged(partsOf({ eyes: 'wounded', 'right-leg': 'broken' }))).toBe(4);
    expect(mostDamaged(partsOf({ 'right-arm': 'wounded', 'left-arm': 'wounded' }))).toBe(1);
  });

  it('erases Openings, clears every count, heals one step, and releases steam only when a part moved', () => {
    const r = regenerate(partsOf({ 'left-arm': 'broken' }, { eyes: 1 }), 3);
    expect(r.erased).toBe(3);
    expect(r.parts.every((p) => p.progress === 0)).toBe(true);
    expect(r.healed).toEqual({ id: 'left-arm', from: 'broken', to: 'wounded' });
    expect(r.steam).toBe(true);
    expect(r.stands).toBe(false);
    const none = regenerate(partsOf({}, { eyes: 1 }), 0);
    expect(none.healed).toBeNull();
    expect(none.steam).toBe(false);
  });

  it('stands a grounded Titan when its only Broken leg heals', () => {
    expect(regenerate(partsOf({ 'left-leg': 'broken' }), 0).stands).toBe(true);
    expect(regenerate(partsOf({ 'left-leg': 'broken', 'right-leg': 'broken' }), 0).stands).toBe(false);
  });

  it('fills one segment at a time and applies when_full at the clock length', () => {
    const parts = partsOf({ eyes: 'wounded' });
    const one = fillRegeneration(0, medium.regeneration_clock, parts, 2);
    expect(one).toMatchObject({ filled: 1, openings: 2, result: null });
    const full = fillRegeneration(medium.regeneration_clock - 1, medium.regeneration_clock, parts, 2);
    expect(full.filled).toBe(0);
    expect(full.openings).toBe(0);
    expect(full.parts[0].state).toBe('intact');
  });
});

describe('Next Behavior (behavior-procedure.yaml)', () => {
  const entries = medium.behavior_table.entries;

  it('reads body_parts_used, a kind listed twice needing two parts', () => {
    const lunge = sprinter.behavior_table.entries.find((e) => e.id === 'headlong-lunge')!;
    const sParts = sprinter.body_parts.map((b) => ({ ...b, state: 'intact' as PartState, progress: 0 }));
    expect(meetsBodyParts(lunge, sParts)).toBe(true);
    sParts[3].state = 'broken';
    expect(meetsBodyParts(lunge, sParts)).toBe(false);
  });

  it('rolls the entry holding the result when it can happen', () => {
    for (const e of entries.filter((x) => x.results.length)) {
      expect(nextBehaviorFor(entries, partsOf(), '', e.results[0])).toBe(e.id);
    }
  });

  it('moves up past the previous behavior and past entries whose Body Parts are Broken', () => {
    const one = entries.find((e) => e.results.includes(1))!;
    const two = entries.find((e) => e.results.includes(2))!;
    const expected = one.id === two.id ? entries.find((e) => e.results.includes(3))!.id : two.id;
    expect(nextBehaviorFor(entries, partsOf(), one.id, 1)).toBe(expected);
    const armEntry = entries.find((e) => e.body_parts_used.includes('arm'))!;
    const noArms = partsOf({ 'left-arm': 'broken', 'right-arm': 'broken' });
    const got = nextBehaviorFor(entries, noArms, '', armEntry.results[0]);
    expect(got).not.toBe(armEntry.id);
    expect(meetsBodyParts(entries.find((e) => e.id === got)!, noArms)).toBe(true);
  });

  it('falls back to Thrash when nothing can be rolled', () => {
    const tiny = [
      { id: 'a', name: 'A', results: [1, 2, 3, 4, 5, 6], tier: 'kill', body_parts_used: ['arm'] },
      { id: 'thrash', name: 'Thrash', results: [], tier: 'thrash', body_parts_used: [] },
    ];
    expect(nextBehaviorFor(tiny, partsOf({ 'left-arm': 'broken', 'right-arm': 'broken' }), '', 4)).toBe('thrash');
    expect(nextBehaviorFor(tiny, partsOf(), 'a', 4)).toBe('thrash');
  });

  it('wraps at Frenzy 0 but turns back down at Frenzy 1+ (move-up, as amended after round 3 review 1, C3)', () => {
    const wrap = [
      { id: 'a', name: 'A', results: [1, 2], tier: 'terrorize', body_parts_used: [] },
      { id: 'b', name: 'B', results: [3, 4, 5], tier: 'control', body_parts_used: [] },
      { id: 'c', name: 'C', results: [6], tier: 'kill', body_parts_used: [] },
    ];
    // The entry at 6 is the previous behavior, so it cannot be rolled either way.
    expect(nextBehaviorFor(wrap, partsOf(), 'c', 6)).toBe('a'); // Frenzy 0: after 6 comes 1.
    expect(nextBehaviorFor(wrap, partsOf(), 'c', 6, 0)).toBe('a');
    expect(nextBehaviorFor(wrap, partsOf(), 'c', 6, 1)).toBe('b'); // Frenzy 1+: turns back down instead.
    expect(nextBehaviorFor(wrap, partsOf(), 'c', 6, 3)).toBe('b');
  });
});

describe('what players see (data/engagement/read.yaml)', () => {
  const none = { toughness: false, nape_depth: false, regeneration_clock: false, attention_ladder: false };
  it('shows a standard Titan’s stat block and hides an Abnormal’s until a Read', () => {
    expect(publicFacts(false, none)).toEqual({ toughness: true, nape_depth: true, regeneration_clock: true, attention_ladder: true });
    expect(publicFacts(true, none)).toEqual(none);
    expect(publicFacts(true, { ...none, nape_depth: true }).nape_depth).toBe(true);
  });
});

describe('writing a Behavior Table by hand (titan-format.yaml, entry_fields)', () => {
  const row = (over: Partial<BehaviorRow>): BehaviorRow => ({
    id: 'a',
    name: 'A',
    results: [1],
    tier: 'terrorize',
    targets: 'holder',
    position_requirement: ['distant'],
    body_parts_used: [],
    attack_dice: null,
    effects: [],
    fallback: 'thrash',
    text: '',
    ...over,
  });

  it('reads the D6 results a GM typed, and drops what a D6 cannot roll', () => {
    expect(readResults('1, 2')).toEqual([1, 2]);
    expect(readResults('3 and 5')).toEqual([3, 5]);
    expect(readResults('6, 6, 2')).toEqual([2, 6]);
    expect(readResults('0, 7, nine')).toEqual([]);
    expect(readResults('')).toEqual([]);
  });

  it('knows which results the table has left, and gives a new entry the first of them', () => {
    const table = [row({ id: 'a', results: [1, 2] }), row({ id: 'b', results: [4] })];
    expect(freeResults(table)).toEqual([3, 5, 6]);
    const fresh = blankEntry(table, 'New behavior');
    expect(fresh.results).toEqual([3]);
    expect(fresh.id).not.toBe('a');
    expect(freeResults([...table, fresh])).toEqual([5, 6]);
    // A full table still adds an entry, with no result of its own until the GM types one.
    expect(blankEntry([row({ results: [1, 2, 3, 4, 5, 6] })], 'New behavior').results).toEqual([]);
  });

  it('never reuses an entry id, whatever the table already holds', () => {
    expect(freeEntryId([])).toBe('behavior-1');
    expect(freeEntryId([row({ id: 'behavior-1' }), row({ id: 'behavior-2' })])).toBe('behavior-3');
    expect(freeEntryId([row({ id: 'behavior-3' })])).toBe('behavior-2');
  });

  it('lets an entry go, and the entries that fell back to it thrash instead', () => {
    const table = [row({ id: 'swat' }), row({ id: 'bite', fallback: 'swat' }), row({ id: 'thrash', tier: 'thrash', fallback: 'none' })];
    const left = withoutEntry(table, 'swat');
    expect(left.map((e) => e.id)).toEqual(['bite', 'thrash']);
    expect(left[0].fallback).toBe('thrash');
    expect(left[1].fallback).toBe('none');
  });

  it('counts the Body Parts an entry needs, and writes the counts back in the kinds’ own order', () => {
    expect(partsUsedCounts(['arm', 'arm', 'eyes'])).toEqual({ eyes: 1, arm: 2, leg: 0 });
    expect(partsUsedList({ eyes: 1, arm: 2, leg: 0 })).toEqual(['eyes', 'arm', 'arm']);
    expect(partsUsedList(partsUsedCounts([]))).toEqual([]);
    // Two arms needed, one Broken: the entry cannot happen.
    const two = { body_parts_used: partsUsedList({ eyes: 0, arm: 2, leg: 0 }) };
    expect(meetsBodyParts(two, partsOf({ 'left-arm': 'broken' }))).toBe(false);
  });

  it('gives each effect the fields its kind carries', () => {
    expect(blankEffect('stress')).toEqual({ type: 'stress', amount: 1 });
    expect(blankEffect('critical-injury')).toEqual({ type: 'critical-injury', injury_location: 'rolled', injury_type: 'crush', cannot_be_lethal: false });
    expect(blankEffect('grab')).toEqual({ type: 'grab' });
  });
});
