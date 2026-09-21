/**
 * The engagement board's pure layers (16-34; plan section 3, P4): layout, scene, drag and drop, and
 * the set pieces' plans. Fixtures follow the contract of plan section 5.3 (FieldState, Placement,
 * ZoneMoveOption) and the Standard field of section 5.1.
 */
import { describe, expect, it } from 'vitest';
import { boardFx, boardRim, boardTile, boardTitan } from '../src/art.ts';
import { directPlacement, directTargets, hitTarget, isLetGo, litTargets, optionsOn, quietNow, quietOffered, rankOptions, targetKey, type ZoneMoveOption } from '../src/board/interaction.ts';
import { fitView, hexCentre, hexCorners, inHex, TILE_H, TILE_W, toBoard, toScreen } from '../src/board/layout.ts';
import { arcPoint, planEvent, samplePlan } from '../src/board/motion.ts';
import { buildScene, facingOf, figureHeight, pointOf } from '../src/board/scene.ts';
import { emptyMemory, type BoardExtras, type BoardSoldier, type BoardState, type BoardTitan, type FieldState, type Placement } from '../src/board/types.ts';

const STANDARD: [number, number, number][] = [
  [1, -2, 0], [2, -2, 1], [3, -2, 2], [4, -1, 0], [5, -1, 1], [6, 0, -1], [7, 0, 0],
  [8, 0, 1], [9, 1, -1], [10, 1, 0], [11, 2, -2], [12, 2, -1], [13, 2, 0],
];

function field(over: Record<number, { rating?: string; start?: string; effects?: ('steam' | 'dust' | 'fire')[] }> = {}): FieldState {
  return {
    size: 'standard',
    rating: 'wooded',
    centre: 7,
    squadStart: 8,
    zones: STANDARD.map(([n, q, r]) => ({ n, q, r, rating: over[n]?.rating ?? 'wooded', start: over[n]?.start ?? over[n]?.rating ?? 'wooded', graceUsed: false, effects: over[n]?.effects ?? [] })),
  };
}

const soldier = (id: string, zone: number | null, kind: BoardSoldier['attachment']['kind'] = 'ground', body: string | null = null, more: Partial<BoardSoldier> = {}): BoardSoldier => ({
  id, name: id.toUpperCase(), alive: true, down: false, left: false, mounted: false, airborne: false, carriedBy: null, zone, attachment: { kind, body }, horseZone: null, ...more,
});
const titan = (key: string, label: string, zone: number, holder = '', more: Partial<BoardTitan> = {}): BoardTitan => ({ key, label, status: 'focus', holder, grounded: false, zone, grab: null, figure: 'medium', ...more });

const extras: BoardExtras = {
  titans: { ta: { colour: 0x8e2323, openings: 2, parts: [{ id: 'left-arm', state: 2 }, { id: 'eyes', state: 0 }] } },
  soldiers: { s1: { momentum: 1, cap: 2, gas: 3, gasMax: 4, owner: true } },
};

const place = (zone: number | null, kind: Placement['attachment']['kind'] = 'ground', body: string | null = null): Placement => ({ zone, attachment: { kind, body } });
const option = (to: Placement, more: Partial<ZoneMoveOption> = {}): ZoneMoveOption => ({ to, kind: 'odm', steps: [to], carries: 0, momentum: 0, crosses: [], charge: [], fly: true, leaves: to.zone === null, ...more }) as ZoneMoveOption;

describe('board layout', () => {
  it('lays flat-top tiles at a column step of 0.75 W and a row step of H, odd columns dropped H/2', () => {
    expect(hexCentre(0, 0)).toEqual({ x: 0, y: 0 });
    expect(hexCentre(1, 0)).toEqual({ x: 0.75 * TILE_W, y: TILE_H / 2 });
    expect(hexCentre(0, 1)).toEqual({ x: 0, y: TILE_H });
    expect(hexCentre(2, -1)).toEqual({ x: 1.5 * TILE_W, y: 0 });
    expect(TILE_H / TILE_W).toBeCloseTo(577 / 1024, 2);
  });

  it('shares edges between neighbours, so the field tessellates', () => {
    const a = hexCorners(hexCentre(0, 0));
    const b = hexCorners(hexCentre(1, 0));
    // a's lower-right edge (corners 3 and 4) is b's upper-left edge (corners 0 and 1).
    expect(b[0].x).toBeCloseTo(a[4].x);
    expect(b[0].y).toBeCloseTo(a[4].y);
    expect(b[1].x).toBeCloseTo(a[3].x);
    expect(b[1].y).toBeCloseTo(a[3].y);
  });

  it('hit-tests a hex, and maps screen and board points both ways', () => {
    const c = hexCentre(0, 0);
    expect(inHex({ x: 0, y: 0 }, c)).toBe(true);
    expect(inHex({ x: TILE_W / 2 - 1, y: 0 }, c)).toBe(true);
    expect(inHex({ x: TILE_W / 2 - 2, y: TILE_H / 2 - 2 }, c)).toBe(false);
    const v = fitView({ x: -500, y: -300, w: 1000, h: 600 }, 1200, 800, 20, 60);
    const p = toBoard(v, 600, 400);
    expect(toScreen(v, p).x).toBeCloseTo(600);
    expect(toScreen(v, p).y).toBeCloseTo(400);
  });
});

describe('board scene', () => {
  const state = (soldiers: BoardSoldier[], titans: BoardTitan[] = [titan('ta', 'A', 7, 's1')], f = field(), more: Partial<BoardState> = {}): BoardState => ({ field: f, soldiers, titans, leftItems: [], arrivals: {}, ...more });

  it('is not up without a field', () => {
    expect(buildScene({ field: null, soldiers: [], titans: [], leftItems: [], arrivals: {} }, extras, emptyMemory())).toBeNull();
  });

  it('draws each tile from its start rating in the fixed variant, the rim from its current rating, and dust below the start', () => {
    const scene = buildScene(state([], [], field({ 5: { rating: 'wooded', start: 'urban', effects: ['dust'] }, 9: { rating: 'open', effects: ['steam'] } })), extras, emptyMemory())!;
    const z = (n: number) => scene.tiles.find((t) => t.n === n)!;
    expect(scene.tiles.map((t) => t.n)).toEqual(STANDARD.map(([n]) => n));
    expect(z(5).tile).toBe(boardTile('urban', 2));
    expect(z(5).rim).toBe(boardRim('wooded'));
    expect(z(5).dusted).toBe(true);
    expect(z(7).tile).toBe(boardTile('wooded', 1));
    expect(z(9).tile).toBe(boardTile('open', 3));
    expect(z(9).dusted).toBe(false);
    expect(z(9).effects).toEqual([{ id: 'steam', art: boardFx('steam') }]);
    expect(z(5).effects).toEqual([]);
  });

  it('faces a Titan toward its holder, else its last Stride, else as drawn; the rear marker sits away from the facing', () => {
    const toRight = buildScene(state([soldier('s1', 10)]), extras, emptyMemory())!;
    const t = toRight.titans[0];
    expect(t.flip).toBe(true);
    expect(t.rear.x).toBeLessThan(t.foot.x);
    const toLeft = buildScene(state([soldier('s1', 4)]), extras, emptyMemory())!;
    expect(toLeft.titans[0].flip).toBe(false);
    expect(toLeft.titans[0].rear.x).toBeGreaterThan(toLeft.titans[0].foot.x);
    // Same zone as the holder: the memory of the last Stride.
    const centre = (n: number) => hexCentre(STANDARD[n - 1][1], STANDARD[n - 1][2]);
    expect(facingOf(titan('ta', 'A', 7, 's1'), centre, 7, { facing: { ta: 'right' } })).toBe('right');
    expect(facingOf(titan('ta', 'A', 7), centre, null, emptyMemory())).toBe('left');
  });

  it('marks Wounded and Broken Body Parts and Openings on the figure, and draws the Attention line to the holder', () => {
    const scene = buildScene(state([soldier('s1', 8)]), extras, emptyMemory())!;
    const t = scene.titans[0];
    expect(t.parts.map((p) => p.id)).toEqual(['left-arm']);
    expect(t.openings).toBe(2);
    expect(scene.lines).toHaveLength(1);
    expect(scene.lines[0].from).toEqual(t.head);
    const s1 = scene.soldiers.find((s) => s.id === 's1')!;
    expect(scene.lines[0].to.x).toBeCloseTo(s1.foot.x);
  });

  it('puts soldiers on the vertical axis by attachment', () => {
    const scene = buildScene(
      state([
        soldier('s1', 8),
        soldier('air', 8, 'ground', null, { airborne: true }),
        soldier('anc', 8, 'anchored'),
        soldier('on1', 7, 'on-body', 'A'),
        soldier('on2', 7, 'on-body', 'A'),
        soldier('bs', 7, 'blind-spot', 'A'),
        soldier('pin', 7, 'pinned', 'A'),
        soldier('gone', null, 'ground', null, { left: true }),
      ], undefined, undefined, { arrivals: { on2: 1, on1: 2 } }),
      extras,
      emptyMemory(),
    )!;
    const s = (id: string) => scene.soldiers.find((n) => n.id === id)!;
    const t = scene.titans[0];
    expect(scene.soldiers.find((n) => n.id === 'gone')).toBeUndefined();
    expect(s('s1').pose).toBe('standing');
    expect(s('air').pose).toBe('hanging');
    expect(s('air').line).not.toBeNull();
    expect(s('air').shadow!.y).toBeGreaterThan(s('air').foot.y);
    expect(s('anc').pose).toBe('hanging');
    // On Body: on the figure's box, in order of arrival (on2 took the shoulder first).
    for (const id of ['on1', 'on2']) {
      expect(s(id).foot.y).toBeLessThan(t.foot.y);
      expect(s(id).h).toBeLessThan(s('s1').h);
    }
    expect(s('on2').foot.y).toBeLessThan(s('on1').foot.y);
    // The Blind Spot stands behind, visibly off the body: at ground level beside it.
    expect(s('bs').foot.y).toBeCloseTo(t.rear.y);
    expect(s('bs').pose).toBe('standing');
    expect(s('pin').laid).toBe(true);
  });

  it('holds a Grabbed soldier in the holding arm and draws horses in their zones', () => {
    const scene = buildScene(
      state([soldier('g', 7, 'grabbed', 'A'), soldier('rider', 8, 'ground', null, { mounted: true, horseZone: 8 }), soldier('walker', 5, 'ground', null, { horseZone: 10 })], [titan('ta', 'A', 7, '', { grab: { soldier: 'g', arm: 'left-arm' } })]),
      extras,
      emptyMemory(),
    )!;
    const t = scene.titans[0];
    expect(scene.soldiers.find((n) => n.id === 'g')!.foot.x).toBeGreaterThan(t.foot.x);
    const rider = scene.soldiers.find((n) => n.id === 'rider')!;
    expect(scene.horses.find((h) => h.soldier === 'rider')!.at).toEqual(rider.foot);
    const z10 = scene.tiles.find((z) => z.n === 10)!.centre;
    expect(Math.abs(scene.horses.find((h) => h.soldier === 'walker')!.at.x - z10.x)).toBeLessThan(TILE_W / 2);
  });

  it('marks left items in their zones, one pile per soldier', () => {
    const scene = buildScene(state([soldier('s1', 8)], undefined, undefined, { leftItems: [{ soldier: 's1', zone: 5, items: ['a', 'b'] }, { soldier: 's2', zone: 5, items: ['c'] }, { soldier: 's3', zone: 99, items: ['d'] }] }), extras, emptyMemory())!;
    expect(scene.items.map((i) => [i.soldier, i.zone, i.count])).toEqual([['s1', 5, 2], ['s2', 5, 1]]);
    expect(scene.items[0].at).not.toEqual(scene.items[1].at);
  });

  it('follows the applied steps of a Flight steps, not the requested route', () => {
    const scene = buildScene(state([soldier('s1', 7)]), extras, emptyMemory())!;
    const cut = planEvent({ seq: 9, kind: 'flight', data: { soldier: 's1', from: place(8), steps: [place(7, 'anchored')] } }, scene, 'full')!;
    expect(cut.points).toHaveLength(2);
  });

  it('lays a corpse down and draws no Attention line from it', () => {
    const scene = buildScene(state([soldier('s1', 8)], [titan('ta', 'A', 7, 's1', { status: 'corpse' })]), extras, emptyMemory())!;
    expect(scene.titans[0].corpse).toBe(true);
    expect(scene.titans[0].figure).toBe(boardTitan('medium'));
    expect(figureHeight('sprinting-abnormal')).toBe(figureHeight('medium'));
    expect(figureHeight('large')).toBeGreaterThan(figureHeight('small'));
    expect(scene.lines).toHaveLength(0);
  });
});

describe('board drag and drop', () => {
  const scene = buildScene({ field: field(), soldiers: [soldier('s1', 8)], titans: [titan('ta', 'A', 7, 's1')], leftItems: [], arrivals: {} }, extras, emptyMemory())!;
  const t = scene.titans[0];
  const options: ZoneMoveOption[] = [
    option(place(7), { kind: 'onFoot', fly: false }),
    option(place(7, 'anchored'), { momentum: 0 }),
    option(place(7, 'blind-spot', 'A'), { carries: 1, momentum: 1 }),
    option(place(10, 'anchored'), { carries: 2, momentum: 2, crosses: ['A'] }),
    option(place(null), { leaves: true, momentum: 1 }),
  ];

  it('hit-tests the rear marker, then the body, then a zone, then off field', () => {
    expect(hitTarget(scene, { x: t.rearHit.x + 2, y: t.rearHit.y + 2 })).toEqual({ kind: 'rear', label: 'A', zone: 7 });
    expect(hitTarget(scene, { x: t.foot.x, y: t.foot.y - t.h / 2 })).toEqual({ kind: 'body', label: 'A', zone: 7 });
    const z1 = scene.tiles.find((z) => z.n === 1)!.centre;
    expect(hitTarget(scene, z1)).toEqual({ kind: 'zone', zone: 1 });
    expect(hitTarget(scene, { x: 99999, y: 0 })).toEqual({ kind: 'off' });
  });

  it('matches a drop only to an offered move that ends there', () => {
    expect(optionsOn(options, { kind: 'zone', zone: 7 })).toHaveLength(2);
    expect(optionsOn(options, { kind: 'rear', label: 'A', zone: 7 })).toHaveLength(1);
    expect(optionsOn(options, { kind: 'body', label: 'A', zone: 7 })).toHaveLength(0);
    expect(optionsOn(options, { kind: 'off' })).toHaveLength(1);
    expect(rankOptions(optionsOn(options, { kind: 'zone', zone: 7 }))[0].fly).toBe(false);
  });

  it('lights legal destinations with the cheapest Carry cost and Fly', () => {
    const lit = litTargets(scene, options);
    const by = (k: string) => lit.find((l) => l.key === k);
    expect(by('zone:7')).toMatchObject({ momentum: 0, fly: false, ways: 2 });
    expect(by('rear:A')).toMatchObject({ momentum: 1, fly: true });
    expect(by('zone:10')).toMatchObject({ momentum: 2, fly: true, crosses: true });
    expect(by('off')).toBeDefined();
    expect(by('zone:1')).toBeUndefined();
    expect(by('body:A')).toBeUndefined();
  });

  it('lights everything under Direct Control and places without checks', () => {
    expect(directTargets(scene)).toHaveLength(13 + 2 + 1);
    const s = soldier('s1', 8, 'anchored');
    expect(directPlacement({ kind: 'zone', zone: 3 }, s)).toEqual(place(3, 'anchored'));
    expect(directPlacement({ kind: 'zone', zone: 3 }, soldier('s2', 8))).toEqual(place(3));
    expect(directPlacement({ kind: 'body', label: 'A', zone: 7 }, s)).toEqual(place(7, 'on-body', 'A'));
    expect(directPlacement({ kind: 'rear', label: 'A', zone: 7 }, s)).toEqual(place(7, 'blind-spot', 'A'));
    expect(directPlacement({ kind: 'off' }, s)).toEqual(place(null));
    expect(targetKey({ kind: 'body', label: 'A', zone: 7 })).toBe('body:A');
  });

  it('offers Quiet on a move that would set a flag, when unspent and payable', () => {
    const cross = { crosses: ['A'], charge: [], fly: true };
    expect(quietOffered(cross, null, false)).toBe(true);
    // A Flight pays from what the roll brings, so an empty purse still may buy it.
    expect(quietOffered(cross, 'noMomentum', false)).toBe(true);
    expect(quietOffered({ ...cross, fly: false }, 'noMomentum', false)).toBe(false);
    expect(quietOffered(cross, 'cannotHold', false)).toBe(false);
    expect(quietOffered(cross, null, true)).toBe(false);
    expect(quietOffered({ crosses: [], fly: true }, null, false)).toBe(false);
    // A charge is the rider's choice, so Quiet is never offered for one (review M5).
    expect(quietOffered({ crosses: [], fly: false }, null, false)).toBe(false);
    expect(quietNow(null, false)).toBe(true);
    expect(quietNow('noMomentum', false)).toBe(false);
    expect(quietNow(null, true)).toBe(false);
  });

  it('treats dragging off a held body into the own zone as letting go', () => {
    const held = soldier('s1', 7, 'on-body', 'A');
    expect(isLetGo({ kind: 'zone', zone: 7 }, held, [])).toBe(true);
    expect(isLetGo({ kind: 'zone', zone: 7 }, held, options)).toBe(false);
    expect(isLetGo({ kind: 'zone', zone: 4 }, held, [])).toBe(false);
    expect(isLetGo({ kind: 'zone', zone: 8 }, soldier('s1', 8), [])).toBe(false);
  });
});

describe('board set pieces', () => {
  const scene = buildScene({ field: field(), soldiers: [soldier('s1', 8)], titans: [titan('ta', 'A', 7, 's1')], leftItems: [], arrivals: {} }, extras, emptyMemory())!;
  const stride = { seq: 3, kind: 'stride' as const, data: { key: 'ta', from: 7, route: [4, 1] } };
  const flight = { seq: 4, kind: 'flight' as const, data: { soldier: 's1', from: place(5), steps: [place(7), place(10, 'anchored')] } };

  it('walks the Stride zone by zone at Full, fades at Reduced, and plays nothing at Off', () => {
    const full = planEvent(stride, scene, 'full')!;
    expect(full.kind).toBe('walk');
    expect(full.points).toHaveLength(3);
    expect(full.facing).toBe('left');
    const reduced = planEvent(stride, scene, 'reduced')!;
    expect(reduced.kind).toBe('fade');
    expect(reduced.points).toHaveLength(2);
    expect(reduced.duration).toBeLessThanOrEqual(160);
    expect(planEvent(stride, scene, 'off')).toBeNull();
    // Halfway through a two-step walk it stands on the middle zone.
    const z4 = scene.tiles.find((z) => z.n === 4)!.centre;
    expect(samplePlan(full, 0.5).at.x).toBeCloseTo(z4.x);
  });

  it('arcs the Flight over each step, lifted above the line between zones', () => {
    const full = planEvent(flight, scene, 'full')!;
    expect(full.kind).toBe('arc');
    expect(full.points).toHaveLength(3);
    const mid = samplePlan(full, 0.25);
    expect(mid.step).toBe(0);
    expect(mid.at.y).toBeLessThan(Math.min(full.points[0].y, full.points[1].y));
    expect(arcPoint({ x: 0, y: 0 }, { x: 10, y: 0 }, 1, 50)).toEqual({ x: 10, y: 0 });
    expect(planEvent(flight, scene, 'off')).toBeNull();
    expect(planEvent(flight, scene, 'reduced')!.kind).toBe('fade');
  });

  it('puffs dust on a wreck, steam on steam, and walks a Titan in from past the edge', () => {
    expect(planEvent({ seq: 5, kind: 'wreck', data: { zone: 7, from: 'urban', to: 'wooded' } }, scene, 'full')).toMatchObject({ kind: 'puff', fx: 'dust' });
    expect(planEvent({ seq: 6, kind: 'steam', data: { key: 'ta', zone: 7 } }, scene, 'full')).toMatchObject({ kind: 'puff', fx: 'steam' });
    const enter = planEvent({ seq: 7, kind: 'enter', data: { key: 'tb', zone: 1 } }, scene, 'full')!;
    const z1 = scene.tiles.find((z) => z.n === 1)!.centre;
    expect(enter.points[0].x).toBeLessThan(z1.x);
    expect(planEvent({ seq: 8, kind: 'wreck', data: { zone: 99 } }, scene, 'full')).toBeNull();
  });

  it('places an off-field step past the board edge', () => {
    const z1 = scene.tiles.find((z) => z.n === 1)!.centre;
    const out = pointOf(scene, place(null), z1);
    expect(out.x).toBeLessThan(z1.x);
  });
});
