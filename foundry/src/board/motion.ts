/**
 * The board's set pieces (zone-combat-design.md 7.5; 16-34): the Flight arcs zone by zone along its
 * steps, the Stride walks zone by zone before the card resolves, and a wreck, a fall, a burst of steam,
 * or a Titan entering plays a short effect. Full motion plays them; Reduced shortens each to a fade
 * no longer than MOTION.reducedMax; Off plays nothing and leaves a complete, playable board (ADR-0027).
 *
 * Pure: an event and the scene in, a plan out, sampled by the renderer frame by frame. The event
 * arrives in the same combat update as the state it describes, so the scene already shows where
 * things ended; a plan only draws the way there, over the top.
 */
import { MOTION } from '../motion/tokens.ts';
import { TILE_H, TILE_W } from './layout.ts';
import { pointOf, type Scene } from './scene.ts';
import type { BoardEvent, MotionMode, Placement, Pt, ZoneId } from './types.ts';

/** Per zone stepped: a Titan's stride and a Flight's arc. */
export const STEP_MS = { stride: 520, flight: MOTION.weighty } as const;
export const PUFF_MS = 700;

export interface Plan {
  kind: 'walk' | 'arc' | 'fade' | 'puff';
  subject: { type: 'titan' | 'soldier' | 'zone'; id: string };
  /** The way, in board points: the start, then one per step. */
  points: Pt[];
  duration: number;
  /** The overlay art a puff draws (fx-dust, fx-steam), when it draws one. */
  fx?: 'dust' | 'steam';
  /** A Titan's facing after a Stride, for the board's memory. */
  facing?: 'left' | 'right';
  /** An arc's peak height over each step. */
  lift?: number;
}

const zonePoint = (scene: Scene, n: unknown): Pt | null => {
  const t = scene.tiles.find((z) => z.n === Number(n));
  return t ? { x: t.centre.x, y: t.centre.y - TILE_H * 0.04 } : null;
};

/** The plan an event draws at a motion mode, or null when nothing plays. */
export function planEvent(ev: BoardEvent, scene: Scene, motion: MotionMode): Plan | null {
  if (motion === 'off') return null;
  const d = ev.data ?? {};
  const fade = (p: Plan): Plan => (motion === 'reduced' ? { ...p, kind: 'fade', points: [p.points[0], p.points[p.points.length - 1]], duration: MOTION.reducedMax } : p);
  switch (ev.kind) {
    case 'stride': {
      const route = Array.isArray(d.route) ? (d.route as ZoneId[]) : [];
      const pts = [d.from, ...route].map((n) => zonePoint(scene, n));
      if (pts.some((p) => !p) || pts.length < 2) return null;
      const points = pts as Pt[];
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      const facing = Math.abs(last.x - prev.x) > 1 ? (last.x < prev.x ? 'left' : 'right') : undefined;
      return fade({ kind: 'walk', subject: { type: 'titan', id: String(d.key ?? '') }, points, duration: STEP_MS.stride * route.length, facing });
    }
    case 'flight': {
      // The applied steps, which may stop short of the requested route (16-14), never the route itself.
      const from = d.from as Placement | undefined;
      const steps = Array.isArray(d.steps) ? (d.steps as Placement[]) : [];
      if (!from || !steps.length) return null;
      const points: Pt[] = [pointOf(scene, from)];
      for (const s of steps) points.push(pointOf(scene, s, points[points.length - 1]));
      return fade({ kind: 'arc', subject: { type: 'soldier', id: String(d.soldier ?? '') }, points, duration: STEP_MS.flight * steps.length, lift: TILE_W * 0.45 });
    }
    case 'wreck':
    case 'fall':
    case 'steam': {
      const at = zonePoint(scene, d.zone);
      if (!at) return null;
      const fx = ev.kind === 'steam' ? 'steam' : 'dust';
      return { kind: motion === 'reduced' ? 'fade' : 'puff', subject: { type: 'zone', id: String(d.zone) }, points: [at, at], duration: motion === 'reduced' ? MOTION.reducedMax : PUFF_MS, fx };
    }
    case 'enter': {
      const at = zonePoint(scene, d.zone);
      if (!at) return null;
      // A Titan walks in from past the field's edge: straight out from the board's middle.
      const b = scene.bounds;
      const mid = { x: b.x + b.w / 2, y: b.y + b.h * 0.6 };
      const dx = at.x - mid.x || 1;
      const dy = at.y - mid.y;
      const k = TILE_W / Math.hypot(dx, dy);
      const start = { x: at.x + dx * k, y: at.y + dy * k };
      return fade({ kind: 'walk', subject: { type: 'titan', id: String(d.key ?? '') }, points: [start, at], duration: STEP_MS.stride, facing: dx > 0 ? 'left' : 'right' });
    }
  }
  return null;
}

/** A quadratic arc from a to b whose middle is lifted by `lift`: the Flight's hop, zone to zone. */
export function arcPoint(a: Pt, b: Pt, t: number, lift: number): Pt {
  const c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - lift };
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export interface Sample {
  at: Pt;
  alpha: number;
  /** Which step the sample is on (0-based), for the grapple line's next anchor. */
  step: number;
  /** For a puff: 0 to 1 over its life. */
  life: number;
}

/** Where the plan's subject is at progress t (0 to 1). */
export function samplePlan(plan: Plan, t: number): Sample {
  const k = Math.max(0, Math.min(1, t));
  const pts = plan.points;
  if (plan.kind === 'fade') {
    // Out at the start, in at the end.
    return k < 0.5 ? { at: pts[0], alpha: 1 - k * 2, step: 0, life: k } : { at: pts[pts.length - 1], alpha: (k - 0.5) * 2, step: Math.max(0, pts.length - 2), life: k };
  }
  if (plan.kind === 'puff') return { at: pts[0], alpha: k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8, step: 0, life: k };
  const segs = Math.max(1, pts.length - 1);
  const pos = k * segs;
  const i = Math.min(segs - 1, Math.floor(pos));
  const local = ease(pos - i);
  const a = pts[i];
  const b = pts[Math.min(i + 1, pts.length - 1)];
  const at = plan.kind === 'arc' ? arcPoint(a, b, local, plan.lift ?? 0) : { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local - Math.abs(Math.sin(local * Math.PI * 2)) * 4 };
  return { at, alpha: 1, step: i, life: k };
}
