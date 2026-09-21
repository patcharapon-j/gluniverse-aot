/**
 * The board's geometry: flat-top hexes in shallow isometric, assembled as site/design/art-style.md,
 * "The engagement board", lays them: a column step of three quarters of the tile width, a row step of
 * the tile height, odd columns dropped by half a row. With axial coordinates (zones.yaml,
 * `axial-flat-top`) that is x = 0.75 W q and y = H (r + q / 2), so the two-to-one foreshortening is
 * the tile art's own and no further projection is applied. Pure: no PIXI, no Foundry.
 */
import type { Pt, Rect } from './types.ts';

/** The tile's world width. Tiles ship 1024 wide; the board works in its own units and scales to fit. */
export const TILE_W = 256;
/** The shipped tiles are 1024 x 577; every tile is drawn at this one height so the field tessellates. */
export const TILE_H = Math.round((TILE_W * 577) / 1024);

/** A zone's centre in board units. */
export function hexCentre(q: number, r: number): Pt {
  return { x: 0.75 * TILE_W * q, y: TILE_H * (r + q / 2) };
}

/** The six corners of a flat-top hex around a centre, from the left point clockwise. */
export function hexCorners(c: Pt, w = TILE_W, h = TILE_H): Pt[] {
  return [
    { x: c.x - w / 2, y: c.y },
    { x: c.x - w / 4, y: c.y - h / 2 },
    { x: c.x + w / 4, y: c.y - h / 2 },
    { x: c.x + w / 2, y: c.y },
    { x: c.x + w / 4, y: c.y + h / 2 },
    { x: c.x - w / 4, y: c.y + h / 2 },
  ];
}

/** True when a board point lies in the flat-top hex around c (edges included). */
export function inHex(p: Pt, c: Pt, w = TILE_W, h = TILE_H): boolean {
  const dx = Math.abs(p.x - c.x) / (w / 2);
  const dy = Math.abs(p.y - c.y) / (h / 2);
  return dy <= 1 && dx + dy / 2 <= 1;
}

export const inRect = (p: Pt, r: Rect) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;

/** The box every tile and a headroom above them covers, so a tall figure in the top row is not cut. */
export function fieldBounds(centres: readonly Pt[], headroom: number): Rect {
  if (!centres.length) return { x: 0, y: 0, w: TILE_W, h: TILE_H };
  const xs = centres.map((c) => c.x);
  const ys = centres.map((c) => c.y);
  const x = Math.min(...xs) - TILE_W / 2;
  const y = Math.min(...ys) - TILE_H / 2 - headroom;
  return { x, y, w: Math.max(...xs) + TILE_W / 2 - x, h: Math.max(...ys) + TILE_H / 2 + TILE_H * 0.35 - y };
}

export interface View {
  scale: number;
  /** Screen position of the board origin. */
  ox: number;
  oy: number;
}

/** Fits the bounds into a viewport of w x h with a padding, centred; the HUD strip's band is kept clear at the top. */
export function fitView(bounds: Rect, w: number, h: number, pad = 24, top = 0): View {
  const aw = Math.max(1, w - pad * 2);
  const ah = Math.max(1, h - pad * 2 - top);
  const scale = Math.min(aw / bounds.w, ah / bounds.h);
  return { scale, ox: pad + (aw - bounds.w * scale) / 2 - bounds.x * scale, oy: pad + top + (ah - bounds.h * scale) / 2 - bounds.y * scale };
}

export const toBoard = (v: View, sx: number, sy: number): Pt => ({ x: (sx - v.ox) / v.scale, y: (sy - v.oy) / v.scale });
export const toScreen = (v: View, p: Pt): Pt => ({ x: p.x * v.scale + v.ox, y: p.y * v.scale + v.oy });
