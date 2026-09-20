/**
 * Token readouts (owner decision, round 3 batch D; ASSESSMENT item 7).
 *
 * On a soldier token, above it: one small badge per Focus Titan (and corpse), the Position's icon and
 * the Titan's letter, filled in that Titan's colour, hollow at Distant, ringed while that Titan holds
 * the soldier; a second badge in the same colour, stamped with the Nape strike icon, while the soldier
 * carries that Titan's `hooked-by-strike` flag (batch A9: it is what puts them on the Attention
 * Ladder's first rung, and it was invisible); brass Foe badges for Engaged pairs. Under the badges, a
 * row of Momentum pips, filled to the Momentum held and outlined to the cap, so the cap the Anchors
 * give and the terrain's contribution read at a glance (anchor-ratings.yaml, momentum).
 *
 * On a Focus Titan's own token: its letter badge, one brass mark per Opening in the Titan's colour,
 * and a Body Part readout of whatever is Wounded or Broken. Openings are the most decision-relevant
 * Titan state a player can see and were invisible on the canvas.
 *
 * The anchor rating is a property of the engagement and not of a soldier, so it is not drawn here at
 * all: it lives on the tracker HUD's plate (hud.ts, components/Hud.svelte), and the Momentum pip
 * track carries its cap.
 */
import { iconPath } from '../art.ts';
import { tracker } from './state.svelte.ts';

const FILL: Record<string, number> = { A: 0x8e2323, B: 0x2f4a6e, C: 0x3f6146, D: 0x6e5325, F: 0x6e5325 };
const HOLLOW_TEXT: Record<string, number> = { A: 0xe89a8c, B: 0x9fb8da, C: 0xa9c7ae, D: 0xe2c078, F: 0xe2c078 };
const KEY = 'wofBadges';

/** The locked palette (ADR-0027): paper, ink, brass, and the Body Part State inks the board uses. */
const PAPER = 0xf4ecd8;
const DARK = 0x14100c;
const BRASS = 0xb9924a;
const BRASS_HI = 0xf3dc9f;
const BRASS_LO = 0x6e5325;
const PART_TONE = [0x3f6146, 0x8a6415, 0x8e2323];

const HOOK_ICON = iconPath('action-nape-strike');

interface Spec {
  icon: string;
  text: string;
  colour: string;
  hollow: boolean;
  ring: boolean;
}

interface TitanSpec {
  label: string;
  colour: string;
  openings: number;
  corpse: boolean;
  parts: { short: string; letter: string; state: number }[];
}

function specsFor(actorId: string): Spec[] {
  const v = tracker.view;
  const row = v?.rows.find((r) => r.id === actorId);
  if (!v || !row || row.dead || row.left) return [];
  if (v.mode === 'skirmish') {
    return row.engaged.map((foe) => ({ icon: iconPath('status-engaged'), text: String(v.foes.find((f) => f.id === foe)?.label ?? '?'), colour: 'F', hollow: false, ring: false }));
  }
  return row.cells
    .filter((c) => c.position)
    .flatMap((c) => {
      const colour = c.corpse ? 'D' : c.colour;
      const out: Spec[] = [{ icon: c.icon, text: c.label, colour, hollow: c.position === 'distant', ring: c.grab }];
      // The hooked-by-strike flag as its own badge: an Attention fact, not a Position (batch A9).
      if (c.hooked) out.push({ icon: HOOK_ICON, text: c.label, colour, hollow: false, ring: false });
      return out;
    });
}

/** The soldier's Momentum and the cap the Anchors left give, or null when there is nothing to draw. */
function momentumFor(actorId: string): { filled: number; cap: number } | null {
  const v = tracker.view;
  const row = v?.rows.find((r) => r.id === actorId);
  if (!v || v.mode !== 'titan' || !row || row.dead || row.left) return null;
  const cap = Math.max(0, row.momentumCap);
  const filled = Math.max(0, Math.min(row.momentum, cap));
  return cap > 0 || filled > 0 ? { filled, cap } : null;
}

function titanSpecFor(tokenId: string): TitanSpec | null {
  const v = tracker.view;
  if (!v || v.mode !== 'titan') return null;
  const ti = v.titans.find((t) => t.key === tokenId);
  if (!ti) return null;
  return {
    label: ti.label,
    colour: ti.corpse ? 'D' : ti.colour,
    openings: ti.openings.length,
    corpse: ti.corpse,
    parts: ti.parts.filter((p) => p.state > 0).map((p) => ({ short: p.short, letter: p.letter, state: p.state })),
  };
}

const PIXIof = () => (globalThis as any).PIXI;

function label(text: string, size: number, fill: number): any {
  const PreciseText = foundry.canvas.containers.PreciseText;
  return new PreciseText(text, PreciseText.getTextStyle({ fontFamily: 'Special Elite', fontSize: size, fill, stroke: 0x000000, strokeThickness: 0 }));
}

/** One Position or hook badge, drawn exactly as the badge row has always drawn them. */
function badge(s: Spec, h: number): any {
  const PIXI = PIXIof();
  const pad = Math.round(h * 0.15);
  const g = new PIXI.Container();
  const text = label(s.text, Math.round(h * 0.72), s.hollow ? HOLLOW_TEXT[s.colour] : PAPER);
  const icon = PIXI.Sprite.from(s.icon);
  icon.width = icon.height = h - pad * 2;
  icon.position.set(pad, pad);
  if (s.hollow) icon.alpha = 0.8;
  const filter = new PIXI.ColorMatrixFilter();
  filter.negative(false);
  icon.filters = [filter];
  text.position.set(h - pad + 1, Math.round((h - text.height) / 2));
  const w = Math.round(h + text.width + pad);
  const bg = new PIXI.Graphics();
  if (s.ring) bg.lineStyle(2, PAPER, 1).drawRect(-2, -2, w + 4, h + 4);
  bg.lineStyle(1, s.hollow ? HOLLOW_TEXT[s.colour] : 0x000000, 1);
  bg.beginFill(s.hollow ? DARK : FILL[s.colour], s.hollow ? 0.85 : 1).drawRect(0, 0, w, h).endFill();
  g.addChild(bg, icon, text);
  (g as any).wofWidth = w;
  return g;
}

/**
 * The Momentum track: one pip a point of the cap, filled to the Momentum held. The outline is the cap,
 * so a cap that falls with the Anchors is as visible as the Momentum itself.
 */
function momentumRow(m: { filled: number; cap: number }, h: number): any {
  const PIXI = PIXIof();
  const pw = Math.max(4, Math.round(h * 0.34));
  const ph = Math.max(5, Math.round(h * 0.42));
  const gap = Math.max(2, Math.round(h * 0.12));
  const slots = Math.max(m.cap, m.filled, 1);
  const g = new PIXI.Container();
  const bg = new PIXI.Graphics();
  const w = slots * pw + (slots - 1) * gap;
  const pad = Math.max(2, Math.round(h * 0.1));
  bg.beginFill(DARK, 0.55).drawRect(-pad, -pad, w + pad * 2, ph + pad * 2).endFill();
  g.addChild(bg);
  for (let i = 0; i < slots; i++) {
    const pip = new PIXI.Graphics();
    const x = i * (pw + gap);
    pip.lineStyle(1, i < m.cap ? BRASS : BRASS_LO, i < m.cap ? 1 : 0.5);
    if (i < m.filled) pip.beginFill(BRASS_HI, 1);
    else pip.beginFill(DARK, 0.2);
    pip.drawRect(x, 0, pw, ph).endFill();
    g.addChild(pip);
  }
  (g as any).wofWidth = w;
  return g;
}

/** The Titan's own badge: its letter, then one brass mark an Opening. */
function titanBadge(spec: TitanSpec, h: number): any {
  const PIXI = PIXIof();
  const pad = Math.round(h * 0.18);
  const g = new PIXI.Container();
  const text = label(spec.label, Math.round(h * 0.76), PAPER);
  const dot = Math.max(5, Math.round(h * 0.4));
  const gap = Math.max(2, Math.round(h * 0.11));
  const marksW = spec.openings > 0 ? spec.openings * dot + (spec.openings - 1) * gap + pad : 0;
  const w = Math.round(pad + text.width + marksW + pad);
  const bg = new PIXI.Graphics();
  bg.lineStyle(1, spec.corpse ? BRASS_LO : 0x000000, 1);
  bg.beginFill(FILL[spec.colour], spec.corpse ? 0.75 : 1).drawRect(0, 0, w, h).endFill();
  g.addChild(bg, text);
  text.position.set(pad, Math.round((h - text.height) / 2));
  let x = Math.round(pad + text.width + pad);
  for (let i = 0; i < spec.openings; i++) {
    const mark = new PIXI.Graphics();
    mark.lineStyle(1, BRASS_LO, 1).beginFill(BRASS_HI, 1).drawCircle(x + dot / 2, h / 2, dot / 2).endFill();
    g.addChild(mark);
    x += dot + gap;
  }
  (g as any).wofWidth = w;
  return g;
}

/** Whatever of the Titan is Wounded or Broken, one small chip a part, in the board's Body Part inks. */
function partsRow(parts: TitanSpec['parts'], h: number): any {
  const PIXI = PIXIof();
  const ch = Math.max(9, Math.round(h * 0.6));
  const gap = 2;
  const g = new PIXI.Container();
  let x = 0;
  for (const p of parts) {
    const text = label(`${p.short} ${p.letter}`, Math.round(ch * 0.66), PAPER);
    const w = Math.round(text.width + 6);
    const bg = new PIXI.Graphics();
    bg.lineStyle(1, 0x000000, 0.8).beginFill(PART_TONE[p.state] ?? PART_TONE[0], 1).drawRect(0, 0, w, ch).endFill();
    const chip = new PIXI.Container();
    text.position.set(3, Math.round((ch - text.height) / 2));
    chip.addChild(bg, text);
    chip.position.set(x, 0);
    g.addChild(chip);
    x += w + gap;
  }
  (g as any).wofWidth = Math.max(0, x - gap);
  return g;
}

const widthOf = (row: any): number => (row as any).wofWidth ?? 0;

export function drawBadges(token: any): void {
  const actor = token?.actor;
  const tokenId = token?.document?.id ?? token?.id ?? '';
  let box = token?.[KEY];
  const soldier = !!actor && (actor.type === 'soldier' || actor.type === 'squadmate');
  const specs = soldier ? specsFor(actor.id) : [];
  const momentum = soldier ? momentumFor(actor.id) : null;
  const titan = !soldier && actor?.type === 'titan' ? titanSpecFor(tokenId) : null;
  if (!specs.length && !momentum && !titan) {
    if (box) box.visible = false;
    return;
  }
  const PIXI = PIXIof();
  if (!box || box.destroyed) {
    box = token.addChild(new PIXI.Container());
    box.eventMode = 'none';
    token[KEY] = box;
  }
  box.visible = true;
  for (const child of box.removeChildren()) child.destroy({ children: true });
  const grid = token.scene?.grid?.size ?? (globalThis as any).canvas?.grid?.size ?? 100;
  const h = Math.max(20, Math.round(grid * 0.28));

  // Each row is laid out on its own, then every row is centred over the token and stacked upward.
  const rows: { node: any; width: number }[] = [];
  if (specs.length) {
    const line = new PIXI.Container();
    let x = 0;
    for (const s of specs) {
      const g = badge(s, h);
      g.position.set(x, 0);
      x += widthOf(g) + 2;
      line.addChild(g);
    }
    rows.push({ node: line, width: Math.max(0, x - 2) });
  }
  if (titan) {
    const line = new PIXI.Container();
    const g = titanBadge(titan, h);
    line.addChild(g);
    rows.push({ node: line, width: widthOf(g) });
    if (titan.parts.length) {
      const pr = partsRow(titan.parts, h);
      rows.push({ node: pr, width: widthOf(pr) });
    }
  }
  if (momentum) {
    const pr = momentumRow(momentum, h);
    rows.push({ node: pr, width: widthOf(pr) });
  }

  const gapY = 3;
  let height = 0;
  for (const r of rows) height += r.node.height + gapY;
  height = Math.max(0, height - gapY);
  let y = 0;
  for (const r of rows) {
    r.node.position.set(Math.round((token.w - r.width) / 2), Math.round(y));
    y += r.node.height + gapY;
    box.addChild(r.node);
  }
  box.position.set(0, -height - 4);
}

/** Redraws every token's readouts. */
export function refreshBadges(): void {
  const layer = (globalThis as any).canvas?.tokens;
  if (!layer?.placeables) return;
  for (const token of layer.placeables) drawBadges(token);
}

export function registerBadges(): void {
  Hooks.on('refreshToken', (token: any) => drawBadges(token));
  Hooks.on('destroyToken', (token: any) => {
    token?.[KEY]?.destroy?.({ children: true });
    if (token) token[KEY] = null;
  });
  Hooks.on('canvasReady', () => refreshBadges());
}
