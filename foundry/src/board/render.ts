/**
 * Draws a board scene with PIXI, which ships in Foundry (ADR-0027 as amended, 16-34). One PIXI
 * application, so one WebGL context, created when the board comes up and destroyed with it; every
 * board texture loaded once per engagement and unloaded at the end; rendering on demand, never a
 * free-running ticker. The grapple line, the gas trail, the Attention line, the Momentum pips and the
 * gas gauge are drawn in code. This file reads only the scene (scene.ts) and the UI state the app
 * hands it; it never reads a document or decides a rule.
 */
import { boardAssets, boardFx, iconPath } from '../art.ts';
import type { Lit } from './interaction.ts';
import { hexCorners, TILE_H, TILE_W, type View } from './layout.ts';
import { samplePlan, type Plan } from './motion.ts';
import { FIGURE_RATIO, type Scene, type SoldierNode, type TitanNode } from './scene.ts';
import type { Pt } from './types.ts';

const PIXIof = () => (globalThis as any).PIXI;

/** The locked palette (ADR-0027), as the token badges use it. */
export const PALETTE = {
  paper: 0xf4ecd8,
  ink: 0x14100c,
  brass: 0xb9924a,
  brassHi: 0xf3dc9f,
  brassLo: 0x6e5325,
  harm: 0x8e2323,
  wound: 0x8a6415,
  relief: 0x2f4a6e,
  ok: 0x3f6146,
  ground: 0x1b1712,
};
/** The Titans' tracker colours by letter (tracker/badges.ts). */
export const TITAN_COLOURS: Record<string, number> = { A: 0x8e2323, B: 0x2f4a6e, C: 0x3f6146, D: 0x6e5325 };
/** The rim's colour per anchor rating, beside its glyph: sparse to dense, dust to deep green. */
export const RATING_TINT: Record<string, number> = { open: 0xc9b27a, sparse: 0x9aa05a, wooded: 0x3f6146, urban: 0x7a6a58, 'giant-forest': 0x24402c };

const EXTRA_ICONS = { horse: iconPath('gear-horse'), opening: iconPath('titan-opening') };

export interface DrawState {
  lit: Lit[];
  /** The lit target under the pointer while dragging. */
  over: string | null;
  /** The zone under the pointer, when not dragging. */
  hover: number | null;
  drag: { kind: 'soldier' | 'titan' | 'horse'; id: string; at: Pt } | null;
  direct: boolean;
  /** The set piece playing, and its progress 0 to 1. */
  anim: { plan: Plan; t: number; trail: Pt[] } | null;
  labels: { fly: string; free: string; momentum: (n: number) => string; leave: string; letGo: string; crossing: string };
}

export class BoardRenderer {
  app: any;
  world: any;
  private textures = new Map<string, any>();
  private loaded: string[] = [];

  constructor(host: HTMLElement) {
    const PIXI = PIXIof();
    this.app = new PIXI.Application({
      width: Math.max(1, host.clientWidth),
      height: Math.max(1, host.clientHeight),
      backgroundColor: PALETTE.ground,
      backgroundAlpha: 1,
      antialias: true,
      autoStart: false,
      autoDensity: true,
      resolution: Math.min(2, window.devicePixelRatio || 1),
    });
    // Rendering is on demand: no ticker runs between state changes and animations.
    this.app.ticker?.stop?.();
    const view = this.app.view as HTMLCanvasElement;
    view.classList.add('wof-board-canvas');
    host.appendChild(view);
    this.world = new PIXI.Container();
    this.app.stage.addChild(this.world);
  }

  /** Loads every board texture once for the engagement. */
  async load(): Promise<void> {
    const PIXI = PIXIof();
    const all = [...boardAssets(), ...Object.values(EXTRA_ICONS)];
    const out = await PIXI.Assets.load(all);
    for (const src of all) if (out?.[src]) this.textures.set(src, out[src]);
    // Only the board's own files are unloaded at the end: the two shared icons may be on a token too.
    this.loaded = boardAssets();
  }

  resize(w: number, h: number): void {
    this.app.renderer.resize(Math.max(1, w), Math.max(1, h));
  }

  destroy(): void {
    const PIXI = PIXIof();
    try {
      this.clear(this.world);
      this.app.destroy(true, { children: true, texture: false, baseTexture: false });
    } finally {
      // Every board texture goes with the engagement (ADR-0027 budget).
      void PIXI.Assets.unload(this.loaded).catch(() => undefined);
      this.textures.clear();
    }
  }

  private clear(c: any): void {
    for (const child of c.removeChildren()) child.destroy({ children: true, texture: false, baseTexture: false });
  }

  private sprite(src: string, w: number, h: number): any {
    const PIXI = PIXIof();
    const tex = this.textures.get(src);
    const s = tex ? new PIXI.Sprite(tex) : new PIXI.Sprite(PIXI.Texture.WHITE);
    if (!tex) s.alpha = 0;
    s.width = w;
    s.height = h;
    return s;
  }

  private text(str: string, size: number, fill: number = PALETTE.paper): any {
    const PIXI = PIXIof();
    const t = new PIXI.Text(str, { fontFamily: 'Special Elite, serif', fontSize: size, fill, stroke: PALETTE.ink, strokeThickness: Math.max(2, size / 5) });
    t.resolution = 2;
    return t;
  }

  /** Draws the whole scene. Cheap enough at 7 to 19 zones to redraw on every change. */
  draw(scene: Scene, view: View, ui: DrawState): void {
    const PIXI = PIXIof();
    this.clear(this.world);
    this.world.scale.set(view.scale);
    this.world.position.set(view.ox, view.oy);

    const layer = () => this.world.addChild(new PIXI.Container());
    const ground = layer();
    const marks = layer();
    const figures = layer();
    const over = layer();

    // Animation offsets: a striding Titan carries its riders and its Attention line with it.
    const anim = ui.anim ? samplePlan(ui.anim.plan, ui.anim.t) : null;
    const subject = ui.anim?.plan.subject;
    const titanShift = new Map<string, Pt>();
    let titanAlpha: { key: string; alpha: number } | null = null;
    if (anim && subject?.type === 'titan') {
      const t = scene.titans.find((n) => n.key === subject.id);
      if (t) {
        titanShift.set(t.label, { x: anim.at.x - t.foot.x, y: anim.at.y - t.foot.y });
        titanAlpha = { key: t.key, alpha: anim.alpha };
      }
    }
    const shiftOf = (s: SoldierNode): Pt => (s.body && (s.attachment === 'on-body' || s.attachment === 'grabbed') ? (titanShift.get(s.body) ?? { x: 0, y: 0 }) : { x: 0, y: 0 });

    // Tiles, rims, numbers, effects.
    const litBy = new Map(ui.lit.map((l) => [l.key, l]));
    for (const z of scene.tiles) {
      const tile = this.sprite(z.tile, TILE_W, TILE_H);
      tile.anchor?.set(0.5);
      tile.position.set(z.centre.x, z.centre.y);
      ground.addChild(tile);
      if (z.dusted) {
        const d = this.sprite(boardFx('dust'), TILE_W * 0.72, TILE_H * 1.1);
        d.anchor?.set(0.5, 0.6);
        d.position.set(z.centre.x, z.centre.y);
        d.alpha = 0.35;
        ground.addChild(d);
      }
      for (const e of z.effects) {
        const fx = this.sprite(e.art, TILE_W * 0.62, TILE_W * 0.62);
        fx.anchor?.set(0.5, 0.8);
        fx.position.set(z.centre.x, z.centre.y + TILE_H * 0.2);
        fx.alpha = 0.85;
        marks.addChild(fx);
      }
      const rim = new PIXI.Graphics();
      const lit = litBy.get(`zone:${z.n}`);
      const pts = hexCorners(z.centre, TILE_W - 4, TILE_H - 3).flatMap((p) => [p.x, p.y]);
      if (lit) {
        const on = ui.over === lit.key;
        rim.beginFill(ui.direct ? PALETTE.harm : PALETTE.brassHi, on ? 0.34 : 0.16).drawPolygon(pts).endFill();
        rim.lineStyle(on ? 4 : 2.5, ui.direct ? PALETTE.harm : PALETTE.brass, 1).drawPolygon(pts);
      } else {
        rim.lineStyle(2, RATING_TINT[z.rating] ?? PALETTE.brassLo, ui.hover === z.n ? 1 : 0.55).drawPolygon(pts);
      }
      ground.addChild(rim);
      const glyph = this.sprite(z.rim, TILE_W * 0.13, TILE_W * 0.13);
      glyph.anchor?.set(0.5);
      glyph.position.set(z.centre.x - TILE_W * 0.3, z.centre.y - TILE_H * 0.24);
      ground.addChild(glyph);
      const num = this.text(String(z.n), 15);
      num.anchor.set(0.5);
      num.position.set(z.centre.x + TILE_W * 0.18, z.centre.y - TILE_H * 0.36);
      ground.addChild(num);
      if (lit && !ui.direct) over.addChild(this.costTag(lit, ui, { x: z.centre.x, y: z.centre.y + TILE_H * 0.36 }));
    }

    // The Blind Spot's rear marker on the ground, and lit body and rear targets.
    for (const t of scene.titans) {
      if (t.corpse) continue;
      const shift = titanShift.get(t.label) ?? { x: 0, y: 0 };
      const g = new PIXI.Graphics();
      const rear = { x: t.rear.x + shift.x, y: t.rear.y + shift.y };
      const litRear = litBy.get(`rear:${t.label}`);
      g.lineStyle(litRear ? 3 : 1.5, litRear ? (ui.direct ? PALETTE.harm : PALETTE.brass) : t.colour, litRear ? 1 : 0.7);
      g.beginFill(litRear ? PALETTE.brassHi : t.colour, litRear ? (ui.over === litRear.key ? 0.45 : 0.2) : 0.12);
      g.drawEllipse(rear.x, rear.y, TILE_W * 0.08, TILE_H * 0.07).endFill();
      marks.addChild(g);
      if (litRear && !ui.direct) over.addChild(this.costTag(litRear, ui, { x: rear.x, y: rear.y + TILE_H * 0.14 }));
      const litBody = litBy.get(`body:${t.label}`);
      if (litBody) {
        const b = new PIXI.Graphics();
        b.lineStyle(ui.over === litBody.key ? 4 : 2.5, ui.direct ? PALETTE.harm : PALETTE.brass, 1).drawRoundedRect(t.hit.x + shift.x, t.hit.y + shift.y, t.hit.w, t.hit.h, 12);
        over.addChild(b);
        if (!ui.direct) over.addChild(this.costTag(litBody, ui, { x: t.foot.x, y: t.hit.y + t.hit.h * 0.35 }));
      }
    }
    const litOff = litBy.get('off');
    if (litOff) {
      const b = scene.bounds;
      const g = new PIXI.Graphics();
      g.lineStyle(ui.over === 'off' ? 5 : 3, ui.direct ? PALETTE.harm : PALETTE.brass, ui.over === 'off' ? 1 : 0.6).drawRoundedRect(b.x - 12, b.y - 12, b.w + 24, b.h + 24, 18);
      over.addChild(g);
      const tag = this.text(ui.labels.leave, 16, PALETTE.brassHi);
      tag.anchor.set(0.5, 1);
      tag.position.set(b.x + b.w / 2, b.y + b.h + 10);
      over.addChild(tag);
    }

    // Horses on their own.
    for (const h of scene.horses) {
      const rider = scene.soldiers.find((s) => s.id === h.soldier);
      if (rider?.mounted && rider.foot.x === h.at.x && rider.foot.y === h.at.y) continue;
      const icon = this.sprite(EXTRA_ICONS.horse, TILE_W * 0.13, TILE_W * 0.13);
      icon.anchor?.set(0.5, 1);
      icon.position.set(h.at.x, h.at.y);
      if (ui.drag?.kind === 'horse' && ui.drag.id === h.soldier) icon.alpha = 0.35;
      (icon as any).zIndex = h.at.y;
      figures.addChild(icon);
    }

    // Left items: a small satchel marker drawn in code, with the count when more than one.
    for (const it of scene.items) {
      const g = new PIXI.Graphics();
      g.lineStyle(1.5, PALETTE.ink, 1).beginFill(PALETTE.brass, 1).drawRoundedRect(-9, -12, 18, 12, 3).endFill();
      g.lineStyle(1.5, PALETTE.ink, 1).moveTo(-5, -12).quadraticCurveTo(0, -19, 5, -12);
      g.position.set(it.at.x, it.at.y);
      (g as any).zIndex = it.at.y;
      if (it.count > 1) {
        const n = this.text(String(it.count), 11, PALETTE.paper);
        n.anchor.set(0.5);
        n.position.set(9, -14);
        g.addChild(n);
      }
      figures.addChild(g);
    }

    // Figures in depth order: a rider on a Titan is drawn over it.
    const titanFoot = new Map(scene.titans.map((t) => [t.label, t.foot.y]));
    figures.sortableChildren = true;
    for (const t of scene.titans) {
      const c = this.titan(t, titanShift.get(t.label) ?? { x: 0, y: 0 }, ui);
      if (titanAlpha?.key === t.key) c.alpha *= titanAlpha.alpha;
      c.zIndex = t.foot.y;
      figures.addChild(c);
    }
    for (const s of scene.soldiers) {
      let foot = s.foot;
      let alpha = 1;
      let pose: SoldierNode['pose'] = s.pose;
      if (anim && subject?.type === 'soldier' && subject.id === s.id) {
        foot = anim.at;
        alpha = anim.alpha;
        pose = 'hanging';
      } else {
        const sh = shiftOf(s);
        foot = { x: s.foot.x + sh.x, y: s.foot.y + sh.y };
      }
      const c = this.soldier({ ...s, foot, pose, art: pose === s.pose ? s.art : s.art.replace('standing', 'hanging') }, ui, alpha);
      c.zIndex = s.body && s.attachment !== 'blind-spot' && s.attachment !== 'pinned' ? (titanFoot.get(s.body) ?? s.foot.y) + 1 + s.foot.y / 1e4 : s.foot.y;
      figures.addChild(c);
    }

    // The Attention line, drawn over the figures so it is never lost behind a Titan.
    for (const l of scene.lines) {
      const t = scene.titans.find((n) => n.key === l.key);
      const holder = scene.soldiers.find((s) => s.id === l.holder);
      const sh = t ? (titanShift.get(t.label) ?? { x: 0, y: 0 }) : { x: 0, y: 0 };
      let to = l.to;
      if (holder && anim && subject?.type === 'soldier' && subject.id === holder.id) to = { x: anim.at.x, y: anim.at.y - holder.h * 0.7 };
      over.addChild(this.dashed({ x: l.from.x + sh.x, y: l.from.y + sh.y }, to, l.colour));
    }

    // The set piece's own marks: the grapple line to the next anchor and the gas trail, or a puff.
    if (ui.anim && anim) this.setPiece(over, ui.anim, anim);

    // The dragged figure follows the pointer.
    if (ui.drag?.kind === 'soldier') {
      const s = scene.soldiers.find((n) => n.id === ui.drag!.id);
      if (s) over.addChild(this.soldier({ ...s, foot: ui.drag.at, laid: false, line: null, shadow: null }, ui, 0.8, true));
    } else if (ui.drag?.kind === 'titan') {
      const t = scene.titans.find((n) => n.key === ui.drag!.id);
      if (t) {
        const ghost = this.sprite(t.figure, t.w, t.h);
        ghost.anchor?.set(0.5, 1);
        ghost.position.set(ui.drag.at.x, ui.drag.at.y);
        ghost.alpha = 0.6;
        over.addChild(ghost);
      }
    } else if (ui.drag?.kind === 'horse') {
      const icon = this.sprite(EXTRA_ICONS.horse, TILE_W * 0.13, TILE_W * 0.13);
      icon.anchor?.set(0.5, 1);
      icon.position.set(ui.drag.at.x, ui.drag.at.y);
      over.addChild(icon);
    }
    this.app.render();
  }

  private costTag(lit: Lit, ui: DrawState, at: Pt): any {
    const PIXI = PIXIof();
    const parts = [lit.momentum > 0 ? ui.labels.momentum(lit.momentum) : ui.labels.free];
    if (lit.fly) parts.push(ui.labels.fly);
    if (lit.crosses) parts.push(ui.labels.crossing);
    const c = new PIXI.Container();
    const t = this.text(parts.join(' · '), 15, lit.fly ? PALETTE.brassHi : PALETTE.paper);
    t.anchor.set(0.5);
    const bg = new PIXI.Graphics();
    bg.lineStyle(1, lit.crosses ? PALETTE.harm : PALETTE.brass, 1)
      .beginFill(PALETTE.ink, 0.72)
      .drawRoundedRect(-t.width / 2 - 8, -t.height / 2 - 3, t.width + 16, t.height + 6, 6)
      .endFill();
    c.addChild(bg, t);
    c.position.set(at.x, at.y);
    return c;
  }

  private titan(t: TitanNode, shift: Pt, ui: DrawState): any {
    const PIXI = PIXIof();
    const c = new PIXI.Container();
    c.position.set(t.foot.x + shift.x, t.foot.y + shift.y);
    const fig = this.sprite(t.figure, t.w, t.h);
    fig.anchor?.set(0.5, 1);
    if (t.flip) fig.scale.x *= -1;
    if (ui.drag?.kind === 'titan' && ui.drag.id === t.key) c.alpha = 0.4;
    if (t.corpse) {
      // A corpse is its figure laid down, desaturated, under steam (16-34).
      fig.anchor?.set(0.5, 0.5);
      fig.rotation = (t.flip ? 1 : -1) * (Math.PI / 2);
      fig.position.set(0, -t.w * 0.3);
      const m = new PIXI.ColorMatrixFilter();
      m.desaturate();
      m.brightness(0.7, true);
      fig.filters = [m];
      c.addChild(fig);
      const steam = this.sprite(boardFx('steam'), t.h * 0.9, t.h * 0.7);
      steam.anchor?.set(0.5, 0.9);
      steam.alpha = 0.7;
      c.addChild(steam);
      return c;
    }
    if (t.grounded) fig.rotation = (t.flip ? -1 : 1) * 0.18;
    c.addChild(fig);
    // Wounded and Broken Body Parts, marked on the figure.
    for (const p of t.parts) {
      const g = new PIXI.Graphics();
      const x = p.at.x - t.foot.x;
      const y = p.at.y - t.foot.y;
      const r = t.w * 0.07;
      g.lineStyle(3, p.state >= 2 ? PALETTE.harm : PALETTE.wound, 0.95).drawCircle(x, y, r);
      if (p.state >= 2) g.moveTo(x - r * 0.6, y - r * 0.6).lineTo(x + r * 0.6, y + r * 0.6).moveTo(x + r * 0.6, y - r * 0.6).lineTo(x - r * 0.6, y + r * 0.6);
      c.addChild(g);
    }
    // The Titan's letter and its Openings over its head.
    const top = -t.h - 8;
    const badge = new PIXI.Graphics();
    badge.lineStyle(1.5, PALETTE.ink, 1).beginFill(t.colour, 1).drawRoundedRect(-14, top - 26, 28, 24, 4).endFill();
    c.addChild(badge);
    const letter = this.text(t.label, 17);
    letter.anchor.set(0.5);
    letter.position.set(0, top - 14);
    c.addChild(letter);
    for (let i = 0; i < t.openings; i++) {
      const d = this.sprite(EXTRA_ICONS.opening, 18, 18);
      d.anchor?.set(0.5);
      d.position.set(22 + i * 18, top - 14);
      c.addChild(d);
    }
    return c;
  }

  private soldier(s: SoldierNode, ui: DrawState, alpha = 1, ghost = false): any {
    const PIXI = PIXIof();
    const c = new PIXI.Container();
    c.alpha = alpha;
    if (!ghost && ui.drag?.kind === 'soldier' && ui.drag.id === s.id) c.alpha = 0.35;
    if (s.shadow) {
      const sh = new PIXI.Graphics();
      sh.beginFill(PALETTE.ink, 0.35).drawEllipse(s.shadow.x - s.foot.x, s.shadow.y - s.foot.y, s.h * 0.22, s.h * 0.07).endFill();
      c.addChild(sh);
    }
    if (s.line) {
      // The grapple line, from the hand to its anchor.
      const g = new PIXI.Graphics();
      g.lineStyle(1.6, PALETTE.ink, 0.85).moveTo(0, -s.h * 0.82).lineTo(s.line.x - s.foot.x, s.line.y - s.foot.y);
      g.beginFill(PALETTE.brassHi, 1).drawCircle(s.line.x - s.foot.x, s.line.y - s.foot.y, 2.5).endFill();
      c.addChild(g);
    }
    if (s.mounted) {
      const horse = this.sprite(EXTRA_ICONS.horse, s.h * 0.55, s.h * 0.55);
      horse.anchor?.set(0.5, 1);
      horse.position.set(-s.h * 0.08, 4);
      c.addChild(horse);
    }
    const fig = this.sprite(s.art, s.h * FIGURE_RATIO, s.h);
    fig.anchor?.set(0.5, 1);
    if (s.laid) {
      fig.anchor?.set(0.5, 0.5);
      fig.rotation = Math.PI / 2;
      fig.position.set(0, -s.h * FIGURE_RATIO * 0.3);
    }
    if (s.dead) {
      const m = new PIXI.ColorMatrixFilter();
      m.desaturate();
      fig.filters = [m];
      fig.alpha = 0.6;
    }
    c.addChild(fig);
    if (!s.dead && !ghost) c.addChild(this.gauges(s));
    c.position.set(s.foot.x, s.foot.y);
    return c;
  }

  /** Momentum pips filled to the Momentum held and outlined to the cap, and the gas gauge (item 7). */
  private gauges(s: SoldierNode): any {
    const PIXI = PIXIof();
    const g = new PIXI.Graphics();
    const cap = Math.max(0, s.cap);
    const pip = 5;
    const w = Math.max(cap, 1) * (pip + 3);
    const y = 6;
    for (let i = 0; i < cap; i++) {
      g.lineStyle(1, PALETTE.brass, 1);
      g.beginFill(i < s.momentum ? PALETTE.brassHi : PALETTE.ink, i < s.momentum ? 1 : 0.4)
        .drawCircle(-w / 2 + i * (pip + 3) + pip / 2 + 1, y + pip / 2, pip / 2)
        .endFill();
    }
    if (s.gasMax > 0) {
      const gw = 30;
      const f = Math.max(0, Math.min(1, s.gas / s.gasMax));
      g.lineStyle(1, PALETTE.ink, 1).beginFill(PALETTE.ink, 0.55).drawRect(-gw / 2, y + pip + 3, gw, 4).endFill();
      g.lineStyle(0).beginFill(f > 0.25 ? PALETTE.relief : PALETTE.harm, 1).drawRect(-gw / 2, y + pip + 3, gw * f, 4).endFill();
    }
    return g;
  }

  private dashed(a: Pt, b: Pt, colour: number): any {
    const PIXI = PIXIof();
    const g = new PIXI.Graphics();
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const n = Math.max(1, Math.floor(len / 14));
    g.lineStyle(3, colour, 0.9);
    for (let i = 0; i < n; i += 2) {
      const t0 = i / n;
      const t1 = Math.min(1, (i + 1) / n);
      g.moveTo(a.x + (b.x - a.x) * t0, a.y + (b.y - a.y) * t0).lineTo(a.x + (b.x - a.x) * t1, a.y + (b.y - a.y) * t1);
    }
    g.lineStyle(1.5, PALETTE.ink, 1).beginFill(colour, 1).drawCircle(b.x, b.y, 5).endFill();
    return g;
  }

  private setPiece(layer: any, anim: NonNullable<DrawState['anim']>, s: ReturnType<typeof samplePlan>): void {
    const PIXI = PIXIof();
    const plan = anim.plan;
    if (plan.kind === 'arc') {
      const g = new PIXI.Graphics();
      // Gas trail: fading puffs behind the figure.
      anim.trail.forEach((p, i) => {
        const k = (i + 1) / anim.trail.length;
        g.beginFill(PALETTE.paper, 0.35 * k).drawCircle(p.x, p.y - 20, 3 + 5 * (1 - k)).endFill();
      });
      // The grapple fired ahead to the next anchor.
      const next = plan.points[Math.min(plan.points.length - 1, s.step + 1)];
      g.lineStyle(1.6, PALETTE.ink, 0.9).moveTo(s.at.x, s.at.y - 30).lineTo(next.x, next.y - TILE_H * 0.6);
      g.beginFill(PALETTE.brassHi, 1).drawCircle(next.x, next.y - TILE_H * 0.6, 3).endFill();
      layer.addChild(g);
    } else if (plan.fx && (plan.kind === 'puff' || plan.subject.type === 'zone')) {
      const size = TILE_W * (0.5 + 0.4 * s.life);
      const fx = this.sprite(boardFx(plan.fx), size, size);
      fx.anchor?.set(0.5, 0.75);
      fx.position.set(s.at.x, s.at.y);
      fx.alpha = s.alpha;
      layer.addChild(fx);
    }
  }
}
