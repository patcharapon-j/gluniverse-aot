/**
 * Position badges on soldier tokens (owner decision): one small badge per Focus Titan (and corpse)
 * above the token, the Position's icon and the Titan's letter, filled in that Titan's colour, hollow
 * at Distant, ringed while that Titan holds the soldier; brass Foe badges for Engaged pairs.
 */
import { tracker } from './state.svelte.ts';

const FILL: Record<string, number> = { A: 0x8e2323, B: 0x2f4a6e, C: 0x3f6146, D: 0x6e5325, F: 0x6e5325 };
const HOLLOW_TEXT: Record<string, number> = { A: 0xe89a8c, B: 0x9fb8da, C: 0xa9c7ae, D: 0xe2c078, F: 0xe2c078 };
const KEY = 'wofBadges';

interface Spec {
  icon: string;
  text: string;
  colour: string;
  hollow: boolean;
  ring: boolean;
}

function specsFor(actorId: string): Spec[] {
  const v = tracker.view;
  const row = v?.rows.find((r) => r.id === actorId);
  if (!v || !row || row.dead || row.left) return [];
  if (v.mode === 'skirmish') {
    return row.engaged.map((foe) => ({ icon: 'systems/wings-of-freedom/assets/icons/status-engaged.webp', text: String((v.foes.find((f) => f.id === foe)?.label ?? '?')), colour: 'F', hollow: false, ring: false }));
  }
  return row.cells.filter((c) => c.position).map((c) => ({ icon: c.icon, text: c.label, colour: c.corpse ? 'D' : c.colour, hollow: c.position === 'distant', ring: c.grab }));
}

export function drawBadges(token: any): void {
  const actor = token?.actor;
  let box = token?.[KEY];
  const specs = actor && (actor.type === 'soldier' || actor.type === 'squadmate') ? specsFor(actor.id) : [];
  if (!specs.length) {
    if (box) box.visible = false;
    return;
  }
  const PIXI = (globalThis as any).PIXI;
  const PreciseText = foundry.canvas.containers.PreciseText;
  if (!box || box.destroyed) {
    box = token.addChild(new PIXI.Container());
    box.eventMode = 'none';
    token[KEY] = box;
  }
  box.visible = true;
  for (const child of box.removeChildren()) child.destroy({ children: true });
  const grid = token.scene?.grid?.size ?? (globalThis as any).canvas?.grid?.size ?? 100;
  const h = Math.max(16, Math.round(grid * 0.2));
  const pad = Math.round(h * 0.15);
  let x = 0;
  const parts: any[] = [];
  for (const s of specs) {
    const g = new PIXI.Container();
    const text = new PreciseText(s.text, PreciseText.getTextStyle({ fontFamily: 'Special Elite', fontSize: Math.round(h * 0.72), fill: s.hollow ? HOLLOW_TEXT[s.colour] : 0xf4ecd8, stroke: 0x000000, strokeThickness: 0 }));
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
    if (s.ring) bg.lineStyle(2, 0xf4ecd8, 1).drawRect(-2, -2, w + 4, h + 4);
    bg.lineStyle(1, s.hollow ? HOLLOW_TEXT[s.colour] : 0x000000, 1);
    bg.beginFill(s.hollow ? 0x14100c : FILL[s.colour], s.hollow ? 0.85 : 1).drawRect(0, 0, w, h).endFill();
    g.addChild(bg, icon, text);
    g.position.set(x, 0);
    x += w + 2;
    parts.push(g);
  }
  box.addChild(...parts);
  box.position.set(Math.round((token.w - x + 2) / 2), -h - 4);
}

/** Redraws every soldier token's badges. */
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
