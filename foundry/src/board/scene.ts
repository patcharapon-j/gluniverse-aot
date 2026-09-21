/**
 * The board's scene: where every tile, figure, line and mark goes, built from the board state, the
 * display extras, and the board's own display memory (16-34). Pure: the PIXI renderer (render.ts)
 * draws this and the pointer layer (interaction.ts) hit-tests it. Nothing here decides a rule: a
 * soldier's Position, a legal move, a Carry cost all come from the rules layer through the Snapshot
 * and `moveOptionsFor`.
 */
import { boardFx, boardRim, boardSoldier, boardTile, boardTitan, tileVariant } from '../art.ts';
import { fieldBounds, hexCentre, TILE_H, TILE_W } from './layout.ts';
import type { BoardExtras, BoardMemory, BoardSoldier, BoardState, BoardTitan, Pt, Rect, TitanSize, ZoneEffectId, ZoneId } from './types.ts';

/** Figure heights in board units; the figures ship at 4:5 (820 x 1024). */
export const FIGURE_RATIO = 820 / 1024;
export const SOLDIER_H = TILE_W * 0.34;
/** An On Body figure is drawn smaller, so it reads as on the Titan and not beside it. */
export const ON_BODY_SCALE = 0.62;
export const TITAN_H: Record<TitanSize, number> = { small: TILE_W * 0.78, medium: TILE_W * 1.02, large: TILE_W * 1.32 };
/** A figure's height: its Size Class's; an Abnormal's own figure stands at its Size Class (the Sprinting Abnormal is Medium). */
export const figureHeight = (figure: string) => TITAN_H[(figure in TITAN_H ? figure : 'medium') as TitanSize];
/** How far an airborne figure is lifted over its tile. */
export const AIR_LIFT = TILE_W * 0.42;
/** How far an anchored figure hangs above the ground on its line. */
export const ANCHOR_LIFT = TILE_W * 0.2;

/**
 * Points on a Titan figure as fractions of its box, for the figure as drawn (facing left, slightly
 * toward the viewer: art-style.md, "Board figures"). A figure facing right mirrors x.
 */
export const PART_POINT: Record<string, Pt> = {
  eyes: { x: 0.42, y: 0.13 },
  'right-arm': { x: 0.3, y: 0.44 },
  'left-arm': { x: 0.7, y: 0.44 },
  'right-leg': { x: 0.42, y: 0.8 },
  'left-leg': { x: 0.58, y: 0.8 },
};
/** The hands, where a Grabbed soldier is held, by the holding arm's id. */
export const HAND_POINT: Record<string, Pt> = { 'right-arm': { x: 0.2, y: 0.6 }, 'left-arm': { x: 0.8, y: 0.6 } };
/** On Body anchors in order of arrival: shoulder, arm, leg, then the far side's (16-34). */
export const ON_BODY_POINTS: Pt[] = [
  { x: 0.56, y: 0.27 },
  { x: 0.3, y: 0.46 },
  { x: 0.44, y: 0.72 },
  { x: 0.4, y: 0.25 },
  { x: 0.7, y: 0.46 },
  { x: 0.58, y: 0.72 },
];
const HEAD_POINT: Pt = { x: 0.46, y: 0.1 };

export interface TileNode {
  n: ZoneId;
  centre: Pt;
  /** The tile art: the zone's start rating, in its fixed variant. */
  tile: string;
  /** The rim glyph: the zone's current rating. */
  rim: string;
  rating: string;
  start: string;
  /**
   * The zone's rating is below its start, so it wears fx-dust at low opacity (16-34). The rules layer
   * puts `dust` in the zone's effects exactly then (zones.ts, withDust); the board only reads it.
   */
  dusted: boolean;
  /** Every other effect, drawn at full strength. */
  effects: { id: ZoneEffectId; art: string }[];
}

export interface TitanNode {
  key: string;
  label: string;
  zone: ZoneId;
  /** The figure's feet, bottom centre. */
  foot: Pt;
  w: number;
  h: number;
  figure: string;
  /** Drawn mirrored, facing right. */
  flip: boolean;
  corpse: boolean;
  grounded: boolean;
  colour: number;
  openings: number;
  parts: { id: string; state: number; at: Pt }[];
  head: Pt;
  /** The Blind Spot's rear marker: the side away from the facing (16-3, display only). */
  rear: Pt;
  hit: Rect;
  rearHit: Rect;
}

export interface SoldierNode {
  id: string;
  name: string;
  zone: ZoneId | null;
  /** The figure's feet, bottom centre, after any lift. */
  foot: Pt;
  h: number;
  pose: 'standing' | 'hanging';
  art: string;
  /** Laid down: Pinned, Down, or dead. */
  laid: boolean;
  dead: boolean;
  mounted: boolean;
  airborne: boolean;
  /** Where the grapple line runs to (airborne and anchored figures). */
  line: Pt | null;
  /** The shadow on the ground under a lifted figure. */
  shadow: Pt | null;
  attachment: string;
  body: string | null;
  momentum: number;
  cap: number;
  gas: number;
  gasMax: number;
  owner: boolean;
  hit: Rect;
}

export interface ItemNode {
  soldier: string;
  zone: ZoneId;
  at: Pt;
  count: number;
}

export interface HorseNode {
  soldier: string;
  at: Pt;
}

export interface AttentionLine {
  key: string;
  /** The holder's soldier id. */
  holder: string;
  from: Pt;
  to: Pt;
  colour: number;
}

export interface Scene {
  tiles: TileNode[];
  titans: TitanNode[];
  soldiers: SoldierNode[];
  horses: HorseNode[];
  items: ItemNode[];
  lines: AttentionLine[];
  bounds: Rect;
}

const DEFAULT_EXTRA = { colour: 0x8e2323, openings: 0, parts: [] };
const box = (foot: Pt, w: number, h: number): Rect => ({ x: foot.x - w / 2, y: foot.y - h, w, h });
const onFigure = (t: { foot: Pt; w: number; h: number; flip: boolean }, f: Pt): Pt => ({
  x: t.foot.x - t.w / 2 + (t.flip ? 1 - f.x : f.x) * t.w,
  y: t.foot.y - t.h + f.y * t.h,
});

/** Where the zone's Titans stand: side by side about the centre, a little behind it. */
function titanSpots(n: number, c: Pt): Pt[] {
  const gap = TILE_W * 0.3;
  return Array.from({ length: n }, (_, i) => ({ x: c.x + (i - (n - 1) / 2) * gap, y: c.y - TILE_H * 0.04 }));
}

/** Evenly spaced slots along a line through the zone, for its free figures. */
function row(n: number, c: Pt, dy: number, span = TILE_W * 0.56): Pt[] {
  if (n <= 0) return [];
  const step = n > 1 ? Math.min(TILE_W * 0.16, span / (n - 1)) : 0;
  return Array.from({ length: n }, (_, i) => ({ x: c.x + (i - (n - 1) / 2) * step, y: c.y + dy }));
}

/**
 * Which way a Titan faces: toward its Attention holder's zone, else its last Stride's direction, else
 * as drawn (left). Display only (16-34).
 */
export function facingOf(t: BoardTitan, centre: (n: ZoneId) => Pt | null, holderZone: ZoneId | null, memory: BoardMemory): 'left' | 'right' {
  const here = centre(t.zone);
  const there = holderZone !== null && holderZone !== t.zone ? centre(holderZone) : null;
  if (here && there && Math.abs(there.x - here.x) > 1) return there.x < here.x ? 'left' : 'right';
  return memory.facing[t.key] ?? 'left';
}

/** Builds the board's scene. Returns null when the engagement has no field (the board is not up). */
export function buildScene(state: BoardState, extras: BoardExtras, memory: BoardMemory): Scene | null {
  const field = state.field;
  if (!field) return null;
  const centres = new Map<ZoneId, Pt>(field.zones.map((z) => [z.n, hexCentre(z.q, z.r)]));
  const centre = (n: ZoneId) => centres.get(n) ?? null;

  const tiles: TileNode[] = field.zones
    .slice()
    .sort((a, b) => a.n - b.n)
    .map((z) => ({
      n: z.n,
      centre: centres.get(z.n)!,
      tile: boardTile(z.start, tileVariant(z.n)),
      rim: boardRim(z.rating),
      rating: z.rating,
      start: z.start,
      dusted: z.effects.includes('dust'),
      effects: z.effects.filter((id) => id !== 'dust').map((id) => ({ id, art: boardFx(id) })),
    }));

  const soldierById = new Map(state.soldiers.map((s) => [s.id, s]));
  const onField = (s: BoardSoldier | undefined) => !!s && !s.left && s.zone !== null && centres.has(s.zone);

  // Titans, grouped by zone.
  const titans: TitanNode[] = [];
  const byZone = new Map<ZoneId, BoardTitan[]>();
  for (const t of state.titans) if (centres.has(t.zone)) byZone.set(t.zone, [...(byZone.get(t.zone) ?? []), t]);
  for (const [zone, list] of byZone) {
    const spots = titanSpots(list.length, centres.get(zone)!);
    list.forEach((t, i) => {
      const x = extras.titans[t.key] ?? DEFAULT_EXTRA;
      const holder = soldierById.get(t.holder);
      const face = facingOf(t, centre, onField(holder) ? holder!.zone : null, memory);
      const corpse = t.status === 'corpse';
      const h = figureHeight(t.figure);
      const w = h * FIGURE_RATIO;
      const foot = spots[i];
      const flip = face === 'right';
      const node = { foot, w, h, flip };
      const rearX = foot.x + (flip ? -1 : 1) * (w * 0.5 + TILE_W * 0.04);
      const rear = { x: rearX, y: foot.y + TILE_H * 0.02 };
      titans.push({
        key: t.key,
        label: t.label,
        zone,
        foot,
        w,
        h,
        figure: boardTitan(t.figure || 'medium'),
        flip,
        corpse,
        grounded: t.grounded,
        colour: x.colour,
        openings: x.openings,
        parts: x.parts.filter((p) => p.state > 0 && PART_POINT[p.id]).map((p) => ({ id: p.id, state: p.state, at: onFigure(node, PART_POINT[p.id]) })),
        head: onFigure(node, HEAD_POINT),
        rear,
        // A corpse lies down, so its hit box is the laid figure's.
        hit: corpse ? { x: foot.x - h / 2, y: foot.y - w * 0.6, w: h, h: w * 0.6 } : box(foot, w * 0.8, h),
        rearHit: { x: rear.x - TILE_W * 0.08, y: rear.y - SOLDIER_H * 0.9, w: TILE_W * 0.16, h: SOLDIER_H },
      });
    });
  }
  const titanByLabel = new Map(titans.map((t) => [t.label, t]));

  // Soldiers.
  const soldiers: SoldierNode[] = [];
  const free = new Map<ZoneId, BoardSoldier[]>();
  const anchored = new Map<ZoneId, BoardSoldier[]>();
  const onBody = new Map<string, BoardSoldier[]>();
  const rearOf = new Map<string, BoardSoldier[]>();
  const pinnedUnder = new Map<string, BoardSoldier[]>();
  const carried: BoardSoldier[] = [];
  const push = <K>(m: Map<K, BoardSoldier[]>, k: K, s: BoardSoldier) => m.set(k, [...(m.get(k) ?? []), s]);
  for (const s of state.soldiers) {
    if (!onField(s)) continue;
    const a = s.attachment;
    const body = a.body ? titanByLabel.get(a.body) : undefined;
    if (s.carriedBy && soldierById.has(s.carriedBy)) carried.push(s);
    else if ((a.kind === 'on-body' || a.kind === 'grabbed') && body) push(onBody, body.label, s);
    else if (a.kind === 'blind-spot' && body) push(rearOf, body.label, s);
    else if (a.kind === 'pinned' && body) push(pinnedUnder, body.label, s);
    else if (a.kind === 'anchored' && !s.airborne) push(anchored, s.zone!, s);
    else push(free, s.zone!, s);
  }

  const extraOf = (id: string) => extras.soldiers[id] ?? { momentum: 0, cap: 0, gas: 0, gasMax: 0, owner: false };
  const place = (s: BoardSoldier, foot: Pt, opts: { h?: number; pose?: 'standing' | 'hanging'; line?: Pt | null; shadow?: Pt | null; laid?: boolean }) => {
    const h = opts.h ?? SOLDIER_H;
    const pose = opts.pose ?? 'standing';
    const laid = opts.laid ?? (!s.alive || s.down);
    const e = extraOf(s.id);
    soldiers.push({
      id: s.id,
      name: s.name,
      zone: s.zone,
      foot,
      h,
      pose,
      art: boardSoldier(pose),
      laid,
      dead: !s.alive,
      mounted: s.mounted,
      airborne: s.airborne,
      line: opts.line ?? null,
      shadow: opts.shadow ?? null,
      attachment: s.attachment.kind,
      body: s.attachment.body,
      momentum: e.momentum,
      cap: e.cap,
      gas: e.gas,
      gasMax: e.gasMax,
      owner: e.owner,
      hit: laid ? { x: foot.x - h / 2, y: foot.y - h * FIGURE_RATIO * 0.6, w: h, h: h * FIGURE_RATIO * 0.6 } : box(foot, h * FIGURE_RATIO * 0.7, h),
    });
  };

  for (const [zone, list] of free) {
    const c = centres.get(zone)!;
    const ground = list.filter((s) => !s.airborne);
    const air = list.filter((s) => s.airborne);
    row(ground.length, c, TILE_H * 0.22).forEach((p, i) => place(ground[i], p, {}));
    row(air.length, c, TILE_H * 0.1).forEach((p, i) =>
      place(air[i], { x: p.x, y: p.y - AIR_LIFT }, { pose: 'hanging', line: { x: c.x + (p.x - c.x) * 0.3, y: c.y - TILE_H * 0.1 }, shadow: p }),
    );
  }
  for (const [zone, list] of anchored) {
    const c = centres.get(zone)!;
    row(list.length, c, -TILE_H * 0.12).forEach((p, i) =>
      place(list[i], { x: p.x, y: p.y - ANCHOR_LIFT }, { pose: 'hanging', line: { x: p.x, y: p.y - ANCHOR_LIFT - SOLDIER_H * 1.1 } }),
    );
  }
  for (const t of titans) {
    const node = { foot: t.foot, w: t.w, h: t.h, flip: t.flip };
    const hs = SOLDIER_H * ON_BODY_SCALE;
    // Grabbed in the holding arm's hand; On Body on the anchors in order of arrival.
    const list = onBody.get(t.label) ?? [];
    const grabbed = list.filter((s) => s.attachment.kind === 'grabbed');
    const on = list.filter((s) => s.attachment.kind !== 'grabbed').sort((a, b) => (state.arrivals[a.id] ?? 0) - (state.arrivals[b.id] ?? 0) || a.id.localeCompare(b.id));
    const arm = state.titans.find((r) => r.key === t.key)?.grab?.arm ?? 'right-arm';
    grabbed.forEach((s, i) => {
      const hand = onFigure(node, HAND_POINT[arm] ?? HAND_POINT['right-arm']);
      place(s, { x: hand.x + i * 6, y: hand.y + hs * 0.55 }, { h: hs, pose: 'hanging' });
    });
    on.forEach((s, i) => {
      const at = onFigure(node, ON_BODY_POINTS[i % ON_BODY_POINTS.length]);
      place(s, { x: at.x + Math.floor(i / ON_BODY_POINTS.length) * 8, y: at.y + hs * 0.5 }, { h: hs, pose: 'hanging' });
    });
    // The Blind Spot: standing behind the Titan at its rear marker, visibly not on it.
    const rear = (rearOf.get(t.label) ?? []).sort((a, b) => (state.arrivals[a.id] ?? 0) - (state.arrivals[b.id] ?? 0) || a.id.localeCompare(b.id));
    rear.forEach((s, i) => place(s, { x: t.rear.x + (t.flip ? -1 : 1) * i * TILE_W * 0.09, y: t.rear.y - i * 3 }, {}));
    // Pinned: laid at the body's base.
    const pinned = pinnedUnder.get(t.label) ?? [];
    pinned.forEach((s, i) => place(s, { x: t.foot.x + (i - (pinned.length - 1) / 2) * TILE_W * 0.14, y: t.foot.y + TILE_H * 0.08 }, { laid: true }));
  }
  // Carried soldiers are drawn beside the soldier who carries them.
  for (const s of carried) {
    const by = soldiers.find((n) => n.id === s.carriedBy);
    if (by) place(s, { x: by.foot.x + by.h * 0.3, y: by.foot.y + 2 }, { laid: true, h: by.h });
    else if (s.zone !== null) place(s, centres.get(s.zone)!, { laid: true });
  }

  // Horses in their zones: a rider's horse under them, a left horse at the zone's side.
  const horses: HorseNode[] = [];
  for (const s of state.soldiers) {
    if (s.horseZone === null || !centres.has(s.horseZone)) continue;
    const node = soldiers.find((n) => n.id === s.id);
    const c = centres.get(s.horseZone)!;
    horses.push({ soldier: s.id, at: s.mounted && node && node.zone === s.horseZone ? { x: node.foot.x, y: node.foot.y } : { x: c.x - TILE_W * 0.3, y: c.y + TILE_H * 0.05 } });
  }

  // Left items: a small marker per soldier's pile, along the zone's lower right.
  const items: ItemNode[] = [];
  const perZone = new Map<ZoneId, number>();
  for (const it of state.leftItems ?? []) {
    const c = centres.get(it.zone);
    if (!c || !it.items.length) continue;
    const i = perZone.get(it.zone) ?? 0;
    perZone.set(it.zone, i + 1);
    items.push({ soldier: it.soldier, zone: it.zone, at: { x: c.x + TILE_W * (0.24 - i * 0.07), y: c.y + TILE_H * (0.3 - i * 0.03) }, count: it.items.length });
  }

  // The Attention line, from each Focus Titan's head to its holder's figure.
  const lines: AttentionLine[] = [];
  for (const t of titans) {
    if (t.corpse) continue;
    const row = state.titans.find((r) => r.key === t.key);
    const holder = row?.holder ? soldiers.find((n) => n.id === row.holder) : undefined;
    if (holder) lines.push({ key: t.key, holder: holder.id, from: t.head, to: { x: holder.foot.x, y: holder.foot.y - holder.h * 0.7 }, colour: t.colour });
  }

  const headroom = Math.max(...titans.map((t) => t.h), SOLDIER_H + AIR_LIFT) - TILE_H / 2;
  return { tiles, titans, soldiers, horses, items, lines, bounds: fieldBounds([...centres.values()], Math.max(0, headroom)) };
}

/** Where a Placement is drawn, for animations: a zone's ground, a body's shoulder, or past the edge. */
export function pointOf(scene: Scene, p: { zone: ZoneId | null; attachment: { kind: string; body: string | null } }, from?: Pt): Pt {
  const tile = p.zone !== null ? scene.tiles.find((t) => t.n === p.zone) : undefined;
  if (!tile) {
    // Off field: straight out from the board's middle past the last point.
    const b = scene.bounds;
    const mid = { x: b.x + b.w / 2, y: b.y + b.h * 0.6 };
    const o = from ?? mid;
    const dx = o.x - mid.x || 1;
    const dy = o.y - mid.y;
    const k = TILE_W / Math.hypot(dx, dy);
    return { x: o.x + dx * k, y: o.y + dy * k };
  }
  const t = p.attachment.body ? scene.titans.find((n) => n.label === p.attachment.body) : undefined;
  if (t && p.attachment.kind === 'blind-spot') return t.rear;
  if (t && p.attachment.kind !== 'ground' && p.attachment.kind !== 'anchored') return onFigure(t, ON_BODY_POINTS[0]);
  return { x: tile.centre.x, y: tile.centre.y + TILE_H * 0.2 };
}
