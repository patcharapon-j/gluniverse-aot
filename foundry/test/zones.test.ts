import { describe, expect, it } from 'vitest';
import { checkTrackerRequest } from '../src/rules/engagement/guard.ts';
import { configureRatings, moveFlags, moveOptions, moveOptionsFor, routeOption, type MoveContext } from '../src/rules/engagement/positions.ts';
import { breakAttentionTerrainDice, flightResult } from '../src/rules/engagement/momentum.ts';
import { reconcilePin, strideMomentum, titanStands, zoneOpened } from '../src/rules/engagement/field.ts';
import { strideMoves, strideOf, strideRoute } from '../src/rules/engagement/stride.ts';
import { emptyFlags, type AnchorRating, type Snapshot, type SoldierState, type TitanRow } from '../src/rules/engagement/types.ts';
import {
  configureZones,
  crossedZones,
  derivePositions,
  entryZone,
  generateField,
  isEdge,
  layoutOf,
  momentumCapAt,
  neighbours,
  ringOf,
  setRating,
  wreckZone,
  ZONE_DEFAULTS,
  zoneDistance,
  type FieldState,
} from '../src/rules/engagement/zones.ts';
import { engagementConfig } from '../tools/config-data.ts';
import { loadTables } from '../tools/data/load.ts';

const tables = loadTables();
const E = engagementConfig(tables);
configureZones(E.zones);
configureRatings(E.ratings as AnchorRating[]);
const rating = (id: string) => (E.ratings.find((r) => r.id === id) as AnchorRating | undefined) ?? null;

/** A Standard field of one rating everywhere, with any zone's rating named. */
const standard = (named: Record<number, string> = {}, base = 'wooded'): FieldState => generateField('standard', base, { ...Object.fromEntries(layoutOf('standard').zones.map((z) => [z.n, base])), ...named }, () => 3);

function soldier(id: string, extra: Partial<SoldierState> = {}): SoldierState {
  return { id, name: id, pc: true, alive: true, down: false, left: false, carriedBy: null, carrying: null, pinned: null, mounted: false, airborne: false, odmHad: true, zone: 8, attachment: { kind: 'ground', body: null }, horseZone: null, positions: {}, momentum: 0, untreated: 0, ...extra };
}

function titan(label: string, zone: number, extra: Partial<TitanRow> = {}): TitanRow {
  return { key: `t${label}`, label, status: 'focus', tempo: 1, frenzy: 0, ladder: [], holder: '', grab: null, decoy: null, decoysInRow: 0, flags: emptyFlags(), grounded: false, entered: 1, zone, stride: 2, figure: 'medium', ...extra };
}

const ctx = (field: FieldState, titans: TitanRow[], momentum = 5): MoveContext => ({ field, titans, rating, grabbed: false, momentum });

describe('the data and the defaults agree (zones.yaml, anchor-ratings.yaml, engagement-setup.yaml)', () => {
  it('reads the same layouts, ratings, Flight, mounted pace, and terrain mix as ZONE_DEFAULTS', () => {
    expect(E.zones).toEqual(ZONE_DEFAULTS);
  });
});

describe('the Standard field (5.5 shared cases)', () => {
  const f = standard();

  it('measures distance in zones', () => {
    expect(zoneDistance(f, 7, 1)).toBe(2);
    expect(zoneDistance(f, 8, 11)).toBe(3);
    expect(zoneDistance(f, 1, 13)).toBe(4);
  });

  it('lists neighbours ascending, and knows its edge', () => {
    expect(neighbours(f, 4)).toEqual([1, 2, 5, 6, 7]);
    expect(isEdge(f, 7)).toBe(false);
    expect(isEdge(f, 4)).toBe(true);
    expect(ringOf(f, 7)).toBe(0);
    expect(ringOf(f, 1)).toBe(2);
  });

  it('strides toward the holder, the lower-numbered zone on a tie', () => {
    expect(strideRoute(f, 7, 1, 2)).toEqual([4, 1]);
    expect(strideRoute(f, 7, 2, 1)).toEqual([4]);
    expect(strideRoute(f, 7, 2, 2)).toEqual([4, 2]);
    expect(strideRoute(f, 8, 11, 3)).toEqual([7, 9, 11]);
    expect(strideRoute(f, 7, 1, 0)).toEqual([]);
    expect(strideRoute(f, 7, 7, 2)).toEqual([]);
  });

  it('puts a promoted Titan at the farthest empty edge zone, the lowest on a tie', () => {
    expect(entryZone(f, [8, 8, 8])).toBe(1);
  });

  it('prices a Flight into a Titan zone and onto its Blind Spot at one Carry', () => {
    const opts = moveOptions(soldier('a', { zone: 8 }), ctx(f, [titan('A', 7)]));
    const o = opts.find((x) => x.kind === 'odm' && x.to.zone === 7 && x.to.attachment.kind === 'blind-spot')!;
    expect(o.steps.map((s) => [s.zone, s.attachment.kind])).toEqual([
      [7, 'anchored'],
      [7, 'blind-spot'],
    ]);
    expect(o.carries).toBe(1);
    expect(o.momentum).toBe(1);
    expect(o.crosses).toEqual([]);
  });

  it('crosses a Focus Titan zone on a Flight through it, at the far zone Carry cost', () => {
    const g = standard({ 10: 'sparse' });
    const free = { kind: 'anchored' as const, body: null };
    const through = routeOption(soldier('a', { zone: 5 }), ctx(g, [titan('A', 7)]), 'odm', [
      { zone: 7, attachment: free },
      { zone: 10, attachment: free },
    ])!;
    expect(through).toBeTruthy();
    expect(through.crosses).toEqual(['A']);
    expect(through.momentum).toBe(1);
    expect(crossedZones(5, [7, 10])).toEqual([7]);
    // The quieter way round through 8 costs the same, so it is the one offered.
    const offered = moveOptions(soldier('a', { zone: 5 }), ctx(g, [titan('A', 7)])).find((x) => x.kind === 'odm' && x.to.zone === 10)!;
    expect(offered.crosses).toEqual([]);
  });

  it('never ends a Flight free in an Open zone', () => {
    const g = standard({ 7: 'open' });
    const opts = moveOptions(soldier('a', { zone: 8 }), ctx(g, []));
    const into7 = opts.filter((x) => x.kind === 'odm' && x.steps[0].zone === 7);
    expect(into7.length).toBeGreaterThan(0);
    expect(into7.every((x) => x.to.zone !== 7)).toBe(true);
  });

  it('wrecks one rating step toward Open, graced once per zone at Sparse', () => {
    const g = standard({ 3: 'urban', 5: 'sparse' });
    expect(wreckZone(g, 3)).toMatchObject({ from: 'urban', to: 'wooded', graced: false });
    const first = wreckZone(g, 5);
    expect(first).toMatchObject({ from: 'sparse', to: 'sparse', graced: true });
    expect(wreckZone(first.field, 5)).toMatchObject({ from: 'sparse', to: 'open', graced: false });
    expect(wreckZone(g, 3).field.zones.find((z) => z.n === 3)!.effects).toContain('dust');
  });

  it('derives Positions from zone and attachment, and a Stride leaves the Blind Spot behind', () => {
    const a = titan('A', 7);
    const b = titan('B', 7);
    const s = soldier('s', { zone: 7, attachment: { kind: 'blind-spot', body: 'A' }, airborne: true });
    expect(derivePositions(s, [a, b])).toEqual({ A: 'blind-spot', B: 'in-reach' });
    const moved = strideMoves([s], 'A', 4);
    expect(moved.placements.s).toEqual({ zone: 7, attachment: { kind: 'anchored', body: null } });
    const after = { ...s, ...moved.placements.s };
    expect(derivePositions(after, [{ ...a, zone: 4 }, b])).toEqual({ A: 'distant', B: 'in-reach' });
  });
});

describe('zones beyond the shared cases', () => {
  it('lays out 7, 13, and 19 zones around their centres', () => {
    expect(layoutOf('skirmish').zones).toHaveLength(7);
    expect(layoutOf('standard').zones).toHaveLength(13);
    expect(layoutOf('set-piece').zones).toHaveLength(19);
    const sp = generateField('set-piece', 'wooded', {}, () => 3);
    expect(sp.zones.filter((z) => isEdge(sp, z.n))).toHaveLength(12);
    expect(sp.zones.find((z) => z.n === sp.centre)).toMatchObject({ q: 0, r: 0 });
  });

  it('generates the terrain mix, keeping the centre and the start zone at the field rating', () => {
    const rolls = [1, 6, 2, 1, 6, 5, 4, 3, 2, 1, 6];
    let i = 0;
    const f = generateField('standard', 'wooded', { 13: 'urban' }, () => rolls[i++]);
    expect(f.zones.find((z) => z.n === 7)!.rating).toBe('wooded');
    expect(f.zones.find((z) => z.n === 8)!.rating).toBe('wooded');
    expect(f.zones.find((z) => z.n === 1)!.rating).toBe('sparse');
    expect(f.zones.find((z) => z.n === 2)!.rating).toBe('giant-forest');
    expect(f.zones.find((z) => z.n === 13)!.rating).toBe('urban');
    expect(f.zones.every((z) => z.start === z.rating)).toBe(true);
    // Ten rolled zones: every zone but 7, 8, and the named 13.
    expect(i).toBe(10);
  });

  it('caps Momentum at the anchors of the zone', () => {
    const f = standard({ 1: 'open', 2: 'urban' });
    expect(momentumCapAt(f, 1)).toBe(0);
    expect(momentumCapAt(f, 2)).toBe(3);
    expect(momentumCapAt(setRating(f, 2, 'sparse'), 2)).toBe(1);
  });

  it('strides at 0 when grounded, and carries the on-body with it', () => {
    expect(strideOf(titan('A', 7, { grounded: true }))).toBe(0);
    const on = soldier('on', { zone: 7, attachment: { kind: 'on-body', body: 'A' }, carrying: 'c' });
    const moved = strideMoves([on], 'A', 4);
    expect(moved.carried).toEqual(['on', 'c']);
    expect(moved.placements.on.zone).toBe(4);
  });

  it('moves on foot one step, mounted up to two zones stopping at a standing Titan, and leaves only from a clear edge', () => {
    const f = standard();
    const walk = moveOptions(soldier('a', { zone: 8, odmHad: false }), ctx(f, [titan('A', 7)]));
    expect(walk.map((o) => o.to.zone).sort()).toEqual([5, 7, 10, null].sort());
    const ride = moveOptions(soldier('r', { zone: 8, mounted: true, odmHad: false }), ctx(f, [titan('A', 7)]));
    expect(ride.some((o) => o.steps.length === 2 && o.steps[0].zone === 7)).toBe(false);
    expect(ride.find((o) => o.to.zone === 7)!.charge).toEqual(['A']);
    const blocked = moveOptions(soldier('b', { zone: 7, odmHad: false }), ctx(f, [titan('A', 7)]));
    expect(blocked.some((o) => o.leaves)).toBe(false);
  });

  it('gives a Down soldier only a step out of a body zone into an empty one', () => {
    const f = standard();
    const down = moveOptions(soldier('d', { zone: 7, down: true }), ctx(f, [titan('A', 7), titan('B', 4)]));
    expect(down.map((o) => o.to.zone)).toEqual([5, 6, 8, 9, 10]);
  });
});

describe('a player’s move request (the GM proxy guard, zone-move)', () => {
  const f = standard();
  const snap: Snapshot = {
    combat: 'C', mode: 'titan', step: 'play', round: 1, anchor: rating('wooded'), field: f, leftItems: [], arrivals: {},
    soldiers: [soldier('a', { zone: 8 })], titans: [titan('A', 7)], wings: {}, cards: {}, titanCards: {}, swapped: [], proposal: null,
    retreat: false, wingsSet: true, wingsOpen: false, reassign: [], tactics: { held: [], used: [] }, cloaks: [], odmUsed: [], movesSpent: [],
  };
  const w = (owned: string[]) => ({ userId: 'u', owns: (id: string) => owned.includes(id), snapshot: () => snap });
  const ground = { kind: 'ground' as const, body: null };

  it('accepts a legal route for the owner and refuses a stranger or an illegal step', () => {
    expect(checkTrackerRequest(w(['a']), { act: 'zone-move', combat: 'C', soldier: 'a', kind: 'onFoot', steps: [{ zone: 7, attachment: ground }] })).toBeNull();
    expect(checkTrackerRequest(w([]), { act: 'zone-move', combat: 'C', soldier: 'a', kind: 'onFoot', steps: [{ zone: 7, attachment: ground }] })).toMatch(/owner/);
    expect(checkTrackerRequest(w(['a']), { act: 'zone-move', combat: 'C', soldier: 'a', kind: 'onFoot', steps: [{ zone: 1, attachment: ground }] })).toMatch(/not one/);
    expect(moveOptionsFor(snap, 'a').length).toBeGreaterThan(0);
  });

  it('refuses a second move in one turn, and lights nothing for a spent soldier (review M6)', () => {
    const spent = { ...snap, movesSpent: ['a'] };
    const ws = { userId: 'u', owns: () => true, snapshot: () => spent };
    expect(checkTrackerRequest(ws, { act: 'zone-move', combat: 'C', soldier: 'a', kind: 'onFoot', steps: [{ zone: 7, attachment: ground }] })).toMatch(/spent/);
    expect(moveOptionsFor(spent, 'a')).toEqual([]);
  });
});

describe('quiet stops the flags a move sets (16-14, 16-15)', () => {
  it('lands the crossing and the charge flags without quiet, and none with it', () => {
    const g = standard();
    const free = { kind: 'anchored' as const, body: null };
    const through = routeOption(soldier('a', { zone: 5 }), ctx(g, [titan('A', 7)]), 'odm', [
      { zone: 7, attachment: free },
      { zone: 10, attachment: free },
    ])!;
    expect(moveFlags(through, false)).toEqual(['A']);
    expect(moveFlags(through, true)).toEqual([]);
    expect(moveFlags({ crosses: [], charge: ['B'] }, true)).toEqual([]);
    expect(flightResult(0, 1, 2, { quiet: true }).loud).toBe(false);
  });
});

describe('the field under the soldiers (review C2, M1 to M4)', () => {
  const f = standard({ 4: 'sparse', 2: 'open' });

  it('frees a Titan’s Pinned to the ground when it stands, and a cleared sheet Pin frees the placement (C2)', () => {
    const p = soldier('p', { zone: 7, attachment: { kind: 'pinned', body: 'A' }, pinned: { body: 'A', bodyPin: false } });
    const ch = titanStands([p], titan('A', 7), 'wooded');
    expect(ch.freed).toEqual(['p']);
    expect(ch.placements.p).toEqual({ zone: 7, attachment: { kind: 'ground', body: null } });
    expect(reconcilePin({ kind: 'pinned', body: 'A' }, null)).toEqual({ kind: 'ground', body: null });
    expect(reconcilePin({ kind: 'pinned', body: 'A' }, { body: 'A', bodyPin: false })).toEqual({ kind: 'pinned', body: 'A' });
  });

  it('trims the Momentum of soldiers a Stride carries into a sparser zone (M1)', () => {
    const on = soldier('on', { zone: 7, attachment: { kind: 'on-body', body: 'A' }, momentum: 2 });
    const stay = soldier('st', { zone: 7, momentum: 2 });
    expect(strideMomentum([on, stay], strideMoves([on, stay], 'A', 4), f)).toEqual({ on: 1 });
  });

  it('lands every anchored soldier in a zone turned Open, whatever stands there; the Blind Spot moves only under a standing Titan (OQ-205)', () => {
    const bs = soldier('b', { zone: 2, attachment: { kind: 'blind-spot', body: 'A' }, airborne: true });
    const an = soldier('a', { zone: 2, attachment: { kind: 'anchored', body: null }, airborne: true });
    const standingIn2 = zoneOpened([bs, an], [titan('A', 2)], 2);
    expect(standingIn2.onBody).toEqual(['b']);
    expect(standingIn2.landed).toEqual(['a']);
    const corpse = zoneOpened([bs, an], [titan('A', 2, { status: 'corpse' })], 2);
    expect(corpse.onBody).toEqual([]);
    expect(corpse.landed).toEqual(['a']);
    expect(zoneOpened([an], [], 2).landed).toEqual(['a']);
  });

  it('moves a Blind Spot to On Body when a Titan stands up in an Open zone, not elsewhere (M3)', () => {
    const bs = soldier('b', { zone: 2, attachment: { kind: 'blind-spot', body: 'A' } });
    expect(titanStands([bs], titan('A', 2), 'open').onBody).toEqual(['b']);
    expect(titanStands([bs], titan('A', 2), 'wooded').onBody).toEqual([]);
  });

  it('reads the Open Terrain Trait from the soldier’s zone, not the field rating (M4)', () => {
    const r = (id: string) => rating(id);
    expect(breakAttentionTerrainDice({ zone: 2, mounted: true }, f, r)).toBe(1);
    expect(breakAttentionTerrainDice({ zone: 8, mounted: true }, f, r)).toBe(0);
    expect(breakAttentionTerrainDice({ zone: 2, mounted: false }, f, r)).toBe(0);
  });
});
