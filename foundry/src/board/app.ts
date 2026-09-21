/**
 * The engagement board's life in Foundry (16-34; ADR-0027 as amended; zone-combat-design.md 7).
 *
 * While a Titan Engagement has a field, the board mounts full-bleed over the canvas area and the scene
 * canvas is hidden; when the field goes (the engagement ends or is deleted) everything is torn down and
 * the canvas comes back. The board reads the engagement only through `snapshot(combat)`, its display
 * readouts from the tracker's view, motion from `motionMode()`, and Direct Control from
 * `tracker.direct`, all read-only. It acts only through the engine API (plan section 5.3). The set
 * pieces play from `combat.system.boardEvent`, which the engine writes in the same update as the change,
 * so every client animates without a socket of the board's own.
 */
import { moveOptionsFor } from '../rules/engagement/positions.ts';
import { motionMode } from '../settings.svelte.ts';
import { currentEngagement } from '../tracker/combat.ts';
import { gmPlace, gmPlaceHorse, gmPlaceTitan, isGM, isTitanEngagement, letGo, requestZoneMove, setZoneRating } from '../tracker/engine.ts';
import { snapshot, titanToken } from '../tracker/snapshot.ts';
import { onRefresh, tracker } from '../tracker/state.svelte.ts';
import { directPlacement, directTargets, hitSoldier, hitTarget, hitTitan, isLetGo, litTargets, optionsOn, rankOptions, targetKey, type DropTarget, type Lit, type ZoneMoveOption } from './interaction.ts';
import { fitView, inRect, toBoard, type View } from './layout.ts';
import { planEvent, samplePlan, type Plan } from './motion.ts';
import { BoardRenderer, TITAN_COLOURS, type DrawState } from './render.ts';
import { buildScene, type Scene } from './scene.ts';
import { watchDirect } from './watch.svelte.ts';
import { emptyMemory, type BoardEvent, type BoardExtras, type BoardMemory, type BoardState, type Pt } from './types.ts';

const L = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(`WOF.Board.${key}`, data) : game.i18n.localize(`WOF.Board.${key}`));

/** The HUD strip's band at the top is kept clear of the field. */
const HUD_BAND = 96;
const DRAG_START = 6;

interface Drag {
  kind: 'soldier' | 'titan' | 'horse';
  id: string;
  start: Pt;
  at: Pt;
  moved: boolean;
  options: ZoneMoveOption[];
  lit: Lit[];
}

class Board {
  host: HTMLElement;
  renderer: BoardRenderer;
  combatId: string;
  scene: Scene | null = null;
  view: View = { scale: 1, ox: 0, oy: 0 };
  memory: BoardMemory = emptyMemory();
  lastSeq: number;
  drag: Drag | null = null;
  over: string | null = null;
  hover: number | null = null;
  anim: { plan: Plan; t: number; trail: Pt[] } | null = null;
  queue: Plan[] = [];
  frame = 0;
  tip: HTMLElement;
  badge: HTMLElement;
  menu: HTMLElement | null = null;
  observer: ResizeObserver;
  ready = false;

  constructor(combat: any) {
    this.combatId = combat.id;
    this.lastSeq = Number(combat.system.boardEvent?.seq ?? 0);
    this.host = document.createElement('section');
    this.host.id = 'wof-board-host';
    this.host.setAttribute('aria-label', L('title'));
    const canvas = document.getElementById('board');
    if (canvas?.parentElement) canvas.after(this.host);
    else document.body.prepend(this.host);
    document.body.classList.add('wof-board-on');
    this.renderer = new BoardRenderer(this.host);
    this.tip = document.createElement('div');
    this.tip.className = 'wof-board-tip';
    this.tip.hidden = true;
    this.badge = document.createElement('div');
    this.badge.className = 'wof-board-direct-badge';
    this.badge.textContent = L('direct');
    this.host.append(this.tip, this.badge);
    const view = this.renderer.app.view as HTMLCanvasElement;
    view.addEventListener('pointerdown', this.onDown);
    view.addEventListener('pointermove', this.onMove);
    view.addEventListener('pointerup', this.onUp);
    view.addEventListener('pointerleave', this.onLeave);
    view.addEventListener('contextmenu', this.onContext);
    this.observer = new ResizeObserver(() => {
      this.renderer.resize(this.host.clientWidth, this.host.clientHeight);
      this.redraw();
    });
    this.observer.observe(this.host);
  }

  async start(): Promise<void> {
    await this.renderer.load();
    this.ready = true;
    this.redraw();
  }

  get combat(): any {
    return game.combats?.get(this.combatId) ?? null;
  }

  destroy(): void {
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.closeMenu();
    this.renderer.destroy();
    this.host.remove();
    document.body.classList.remove('wof-board-on');
  }

  /** The state, the display readouts, and the board's memory into a scene. */
  rebuild(): void {
    const combat = this.combat;
    if (!combat) return;
    const snap = snapshot(combat);
    // The Snapshot is assignable to what the board draws: it reads nothing else of the engagement.
    const state: BoardState = snap;
    this.scene = buildScene(state, extrasFor(snap), this.memory);
    if (this.scene) this.view = fitView(this.scene.bounds, this.host.clientWidth, this.host.clientHeight, 24, HUD_BAND);
  }

  redraw(rebuild = true): void {
    if (!this.ready) return;
    if (rebuild) this.rebuild();
    if (!this.scene) return;
    const direct = isGM() && tracker.direct;
    this.host.classList.toggle('wof-board-direct', direct);
    const ui: DrawState = {
      lit: this.drag?.moved ? this.drag.lit : [],
      over: this.over,
      hover: this.hover,
      drag: this.drag?.moved ? { kind: this.drag.kind, id: this.drag.id, at: this.drag.at } : null,
      direct,
      anim: this.anim,
      labels: { fly: L('fly'), free: L('free'), momentum: (n) => L('momentum', { n }), leave: L('leave'), letGo: L('letGo') },
    };
    this.renderer.draw(this.scene, this.view, ui);
  }

  // ------------------------------------------------------------------ set pieces

  /** A board event from the engine: plan it at this client's motion mode and play it. */
  onEvent(ev: BoardEvent): void {
    // seq only rises (Undo never reverts it), so an event at or below the last one is a replay.
    if (!ev || ev.seq <= this.lastSeq) return;
    this.lastSeq = ev.seq;
    this.rebuild();
    if (!this.scene) return;
    const plan = planEvent(ev, this.scene, motionMode());
    if (ev.kind === 'stride' || ev.kind === 'enter') {
      // The Titan turns the way it went, whatever the motion mode.
      const facing = (plan ?? planEvent(ev, this.scene, 'full'))?.facing;
      if (facing) {
        this.memory.facing[String(ev.data.key)] = facing;
        this.rebuild();
      }
    }
    if (!plan) return this.redraw(false);
    this.queue.push(plan);
    if (!this.anim) this.next();
  }

  next(): void {
    const plan = this.queue.shift();
    if (!plan) {
      this.anim = null;
      return this.redraw();
    }
    this.anim = { plan, t: 0, trail: [] };
    const began = performance.now();
    const tick = (now: number) => {
      if (!this.anim) return;
      this.anim.t = Math.min(1, (now - began) / Math.max(1, plan.duration));
      if (plan.kind === 'arc') {
        this.anim.trail.push(samplePlan(plan, this.anim.t).at);
        if (this.anim.trail.length > 14) this.anim.trail.shift();
      }
      this.redraw(false);
      if (this.anim.t < 1) this.frame = requestAnimationFrame(tick);
      else this.next();
    };
    this.frame = requestAnimationFrame(tick);
  }

  // ------------------------------------------------------------------ pointer

  point(e: PointerEvent | MouseEvent): Pt {
    const r = (this.renderer.app.view as HTMLCanvasElement).getBoundingClientRect();
    return toBoard(this.view, e.clientX - r.left, e.clientY - r.top);
  }

  onDown = (e: PointerEvent) => {
    if (e.button !== 0 || !this.scene) return;
    this.closeMenu();
    const p = this.point(e);
    const combat = this.combat;
    const direct = isGM() && tracker.direct;
    const sid = hitSoldier(this.scene, p);
    if (sid) {
      const node = this.scene.soldiers.find((s) => s.id === sid);
      if (!direct && !node?.owner) return;
      const options = direct ? [] : safeOptions(combat, sid);
      const s = snapshot(combat).soldiers.find((x) => x.id === sid);
      const lit = direct ? directTargets(this.scene) : litTargets(this.scene, options);
      // Letting go lights the soldier's own zone when no move ends there (7.6).
      if (!direct && s && isLetGo({ kind: 'zone', zone: s.zone ?? -1 }, s, options)) lit.push({ key: `zone:${s.zone}`, target: { kind: 'zone', zone: s.zone! }, momentum: 0, fly: false, crosses: false, ways: 1 });
      this.drag = { kind: 'soldier', id: sid, start: p, at: p, moved: false, options, lit };
    } else if (direct) {
      const key = hitTitan(this.scene, p);
      const horse = this.scene.horses.find((h) => inRect(p, { x: h.at.x - 18, y: h.at.y - 36, w: 36, h: 36 }));
      const zones = directTargets(this.scene).filter((l) => l.target.kind === 'zone');
      if (key) this.drag = { kind: 'titan', id: key, start: p, at: p, moved: false, options: [], lit: zones };
      else if (horse) this.drag = { kind: 'horse', id: horse.soldier, start: p, at: p, moved: false, options: [], lit: [...zones, ...directTargets(this.scene).filter((l) => l.target.kind === 'off')] };
    } else {
      // A click on a Titan targets its token, so chat cards and the tracker keep working (7.2).
      const key = hitTitan(this.scene, p);
      if (key && combat) titanToken(combat, key)?.object?.setTarget?.(true, { releaseOthers: !e.shiftKey });
    }
    if (this.drag) (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  onMove = (e: PointerEvent) => {
    if (!this.scene) return;
    const p = this.point(e);
    if (this.drag) {
      this.drag.at = p;
      if (!this.drag.moved && Math.hypot(p.x - this.drag.start.x, p.y - this.drag.start.y) * this.view.scale > DRAG_START) this.drag.moved = true;
      const key = targetKey(hitTarget(this.scene, p));
      this.over = this.drag.lit.some((l) => l.key === key) ? key : null;
      this.tip.hidden = true;
      return this.redraw(false);
    }
    const t = hitTarget(this.scene, p);
    const zone = t.kind === 'off' ? null : t.zone;
    if (zone !== this.hover) {
      this.hover = zone;
      this.redraw(false);
    }
    this.showTip(zone, e);
  };

  onUp = async (e: PointerEvent) => {
    const drag = this.drag;
    this.drag = null;
    this.over = null;
    if (!drag || !this.scene) return;
    if (!drag.moved) return this.redraw(false);
    const target = hitTarget(this.scene, this.point(e));
    const allowed = drag.lit.some((l) => l.key === targetKey(target));
    this.redraw(false);
    if (!allowed) return;
    const combat = this.combat;
    if (!combat) return;
    const direct = isGM() && tracker.direct;
    try {
      if (drag.kind === 'titan') {
        if (target.kind !== 'off') await gmPlaceTitan(combat, drag.id, target.zone);
        return;
      }
      if (drag.kind === 'horse') {
        await gmPlaceHorse(combat, drag.id, target.kind === 'off' ? null : target.zone);
        return;
      }
      const s = snapshot(combat).soldiers.find((x) => x.id === drag.id);
      if (!s) return;
      if (direct) {
        await gmPlace(combat, drag.id, directPlacement(target, s));
        return;
      }
      if (isLetGo(target, s, drag.options)) {
        const body = s.attachment.body ?? '';
        const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: L('letGoTitle') }, content: `<p>${L('letGoWarn', { body })}</p>` });
        if (ok) await letGo(combat, game.actors.get(s.id), s);
        return;
      }
      const ways = rankOptions(optionsOn(drag.options, target));
      if (ways.length === 1) await requestZoneMove(combat, drag.id, ways[0]);
      else if (ways.length > 1) this.choose(ways, e, (o) => requestZoneMove(combat, drag.id, o));
    } catch (err) {
      console.error('wings-of-freedom | the board move failed', err);
    }
  };

  onLeave = () => {
    this.tip.hidden = true;
    if (this.hover !== null && !this.drag) {
      this.hover = null;
      this.redraw(false);
    }
  };

  /** Direct Control: a right-click on a zone sets its rating (ADR-0028; the start rating is kept). */
  onContext = (e: MouseEvent) => {
    e.preventDefault();
    if (!this.scene || !(isGM() && tracker.direct)) return;
    const t = hitTarget(this.scene, this.point(e));
    if (t.kind !== 'zone') return;
    const ratings = (CONFIG.WOF.engagement?.ratings ?? []) as { id: string; name: string }[];
    const combat = this.combat;
    this.menu = this.popup(
      e,
      L('setRating', { n: t.zone }),
      ratings.map((r) => ({ label: r.name, run: () => setZoneRating(combat, t.zone, r.id) })),
    );
  };

  /** More than one way to the same place: the player picks (on foot, mounted, or a Flight). */
  choose(ways: ZoneMoveOption[], e: MouseEvent, run: (o: ZoneMoveOption) => Promise<boolean>): void {
    this.menu = this.popup(
      e,
      L('choose'),
      ways.map((o) => ({
        label: [L(`kind.${o.kind}`), o.momentum > 0 ? L('momentum', { n: o.momentum }) : L('free'), o.fly ? L('fly') : '', o.crosses.length ? L('crosses', { labels: o.crosses.join(', ') }) : ''].filter(Boolean).join(' · '),
        run: () => run(o),
      })),
    );
  }

  popup(e: MouseEvent, title: string, items: { label: string; run: () => Promise<unknown> }[]): HTMLElement {
    this.closeMenu();
    const menu = document.createElement('div');
    menu.className = 'wof-board-menu';
    const head = document.createElement('header');
    head.textContent = title;
    menu.appendChild(head);
    for (const it of items) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = it.label;
      b.addEventListener('click', async () => {
        this.closeMenu();
        try {
          await it.run();
        } catch (err) {
          console.error('wings-of-freedom | the board action failed', err);
        }
      });
      menu.appendChild(b);
    }
    const r = this.host.getBoundingClientRect();
    menu.style.left = `${e.clientX - r.left + 8}px`;
    menu.style.top = `${e.clientY - r.top + 8}px`;
    this.host.appendChild(menu);
    return menu;
  }

  closeMenu(): void {
    this.menu?.remove();
    this.menu = null;
  }

  /** Hover a zone: its number, rating (and start where it differs), occupants, and effects (7.6). */
  showTip(zone: number | null, e: PointerEvent): void {
    const combat = this.combat;
    const z = zone !== null ? combat?.system?.field?.zones?.find((x: any) => x.n === zone) : null;
    if (!z || !this.scene) {
      this.tip.hidden = true;
      return;
    }
    const ratings = (CONFIG.WOF.engagement?.ratings ?? []) as { id: string; name: string }[];
    const name = (id: string) => ratings.find((r) => r.id === id)?.name ?? id;
    const here = [
      ...this.scene.titans.filter((t) => t.zone === zone).map((t) => `${t.corpse ? L('corpse') : L('titan')} ${t.label}`),
      ...this.scene.soldiers.filter((s) => s.zone === zone).map((s) => s.name),
    ];
    const lines = [
      `<strong>${L('zone', { n: zone })}</strong> · ${z.rating === z.start ? name(z.rating) : L('ratingWas', { rating: name(z.rating), start: name(z.start) })}`,
      here.length ? L('occupants', { names: here.join(', ') }) : L('empty'),
    ];
    const effects = (z.effects ?? []) as string[];
    if (effects.length) lines.push(effects.map((id) => L(`effect.${id}`)).join(', '));
    this.tip.innerHTML = lines.map((l) => `<div>${l}</div>`).join('');
    const r = this.host.getBoundingClientRect();
    this.tip.style.left = `${e.clientX - r.left + 16}px`;
    this.tip.style.top = `${e.clientY - r.top + 16}px`;
    this.tip.hidden = false;
  }
}

/** The moves the rules layer offers a soldier, or none while it cannot say. */
function safeOptions(combat: any, soldierId: string): ZoneMoveOption[] {
  try {
    return combat ? moveOptionsFor(snapshot(combat), soldierId) : [];
  } catch (err) {
    console.error('wings-of-freedom | the board could not read the moves', err);
    return [];
  }
}

/** Display readouts the Snapshot does not carry, from the tracker's view. No rule reads them. */
function extrasFor(snap: { titans: readonly { key: string }[]; soldiers: readonly { id: string }[] }): BoardExtras {
  const v = tracker.view;
  const titans: Record<string, BoardExtras['titans'][string]> = {};
  snap.titans.forEach((t, i) => {
    const tv = v?.titans?.find((x) => x.key === t.key);
    titans[t.key] = {
      colour: TITAN_COLOURS[tv?.colour ?? ['A', 'B', 'C', 'D'][i] ?? 'A'] ?? TITAN_COLOURS.A,
      openings: tv?.openings?.length ?? 0,
      parts: (tv?.parts ?? []).map((p) => ({ id: p.id, state: p.state })),
    };
  });
  const soldiers: Record<string, BoardExtras['soldiers'][string]> = {};
  for (const s of snap.soldiers) {
    const row = v?.rows?.find((r) => r.id === s.id);
    const actor = game.actors?.get(s.id);
    soldiers[s.id] = {
      momentum: row?.momentum ?? 0,
      cap: row?.momentumCap ?? 0,
      gas: row?.gas ?? 0,
      gasMax: row?.gasMax ?? 0,
      owner: isGM() || !!actor?.isOwner,
    };
  }
  return { titans, soldiers };
}

// -------------------------------------------------------------------- lifecycle

let board: Board | null = null;
let starting = false;

/** The engagement the board draws: a Titan Engagement with a field, or null. */
function fieldEngagement(): any | null {
  const combat = currentEngagement();
  return combat && isTitanEngagement(combat) && combat.system.field && !combat.system.ended ? combat : null;
}

/** Brings the board up, redraws it, or tears it down, to match the engagement. */
export async function syncBoard(): Promise<void> {
  const combat = fieldEngagement();
  if (board && (!combat || combat.id !== board.combatId)) {
    board.destroy();
    board = null;
  }
  if (!combat) return;
  if (board) return board.redraw();
  if (starting) return;
  starting = true;
  try {
    const b = new Board(combat);
    board = b;
    await b.start();
  } catch (err) {
    console.error('wings-of-freedom | the engagement board failed to start', err);
    board?.destroy();
    board = null;
  } finally {
    starting = false;
  }
}

export function registerBoard(): void {
  const sync = () => void syncBoard();
  Hooks.on('updateCombat', (combat: any, change: any) => {
    const ev = change?.system?.boardEvent;
    if (board && combat.id === board.combatId && ev && typeof ev.seq === 'number') board.onEvent(combat.system.boardEvent as BoardEvent);
    sync();
  });
  for (const hook of ['createCombat', 'deleteCombat', 'combatStart', 'canvasReady']) Hooks.on(hook, sync);
  Hooks.once('ready', () => {
    // Actor, item, and Direct Control changes arrive through the tracker's own refresh.
    onRefresh(sync);
    watchDirect(() => board?.redraw(false));
    sync();
  });
}

export type { DropTarget };
