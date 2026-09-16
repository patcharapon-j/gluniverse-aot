/**
 * The two three.js vitals widgets, gas canisters and blade sets (ADR-0027, WebGL scope; ported from
 * the locked preview, foundry/design/preview-v2-1-personnel-file.html).
 *
 * One WebGLRenderer serves the whole client, however many sheets are open: it is never attached to
 * the page. A widget owns a plain 2D canvas; to paint it, the renderer draws that widget's scene into
 * the bottom-left corner of its fixed-size buffer and the widget copies that corner with drawImage,
 * in the same task. Nothing renders every frame: a widget paints when its values change, and runs
 * frames only while its short settle animation lasts. The renderer and every GPU resource are
 * disposed when the last widget unmounts.
 *
 * Motion Full animates; Reduced keeps a short colour flash; Off, or a client without WebGL, shows the
 * static SVG stand-ins the Svelte component draws instead.
 */
import { animate } from 'animejs/animation';
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  PMREMGenerator,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type Material,
  type Object3D,
  type Texture,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { motionMode } from '../settings.svelte.ts';
import { MOTION } from './tokens.ts';

export interface GasState {
  /** Gas Rating of the fitted canister. */
  level: number;
  /** Full Gas Rating (bands on a canister). */
  full: number;
  /** Each spare canister's Gas Rating. */
  spares: number[];
  /** No ODM Gear, or Jammed: the fitted canister is drawn dull. */
  dull: boolean;
}

export interface BladeState {
  inHandles: boolean;
  carried: number;
}

export type WidgetKind = 'gas' | 'blades';
type StateOf<K extends WidgetKind> = K extends 'gas' ? GasState : BladeState;

/** CSS size of each widget's canvas (the locked preview's slots). */
export const WIDGET_SIZE: Record<WidgetKind, { w: number; h: number }> = { gas: { w: 96, h: 56 }, blades: { w: 120, h: 56 } };
const MAX_DPR = 2;
const BUFFER = { w: 120 * MAX_DPR, h: 56 * MAX_DPR };
const MAX_SPARES = 3;
const MAX_CARRIED = 4;

// ------------------------------------------------------------------ shared renderer

interface Shared {
  renderer: WebGLRenderer;
  /** Marks WebGL unavailable if the browser takes the context away (not when the system releases it). */
  onLost: () => void;
  env: Texture;
  gas: GasScene;
  blades: BladeScene;
  disposables: Set<{ dispose(): void }>;
}

let shared: Shared | null = null;
let unavailable = false;
const widgets = new Set<Widget<WidgetKind>>();
const dirty = new Set<Widget<WidgetKind>>();
let frame = 0;
/** For the browser check: renderers created in this client, and whether one is alive now. */
export const widgetStats = { contextsCreated: 0, live: 0, paints: 0 };

/** Whether the widgets can draw with WebGL here; false once creating the renderer has failed. */
export function webglAvailable(): boolean {
  return !unavailable && typeof window.WebGL2RenderingContext === 'function';
}

function track<T extends { dispose(): void }>(s: Set<{ dispose(): void }>, x: T): T {
  s.add(x);
  return x;
}

function ensureShared(): Shared | null {
  if (shared) return shared;
  if (unavailable) return null;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (err) {
    console.warn('wings-of-freedom | 3D widgets unavailable, showing static icons', err);
    unavailable = true;
    for (const w of widgets) w.onUnavailable();
    return null;
  }
  widgetStats.contextsCreated += 1;
  widgetStats.live = 1;
  renderer.setPixelRatio(1);
  renderer.setSize(BUFFER.w, BUFFER.h, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.setScissorTest(true);
  const onLost = () => {
    unavailable = true;
    for (const w of widgets) w.onUnavailable();
  };
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  const disposables = new Set<{ dispose(): void }>();
  const pm = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = track(disposables, pm.fromScene(room, 0.04).texture);
  pm.dispose();
  room.dispose?.();
  shared = { renderer, onLost, env, disposables, gas: gasScene(env, disposables), blades: bladeScene(env, disposables) };
  return shared;
}

function disposeShared(): void {
  if (!shared) return;
  cancelAnimationFrame(frame);
  frame = 0;
  for (const d of shared.disposables) d.dispose();
  shared.renderer.domElement.removeEventListener('webglcontextlost', shared.onLost);
  shared.renderer.dispose();
  shared.renderer.forceContextLoss();
  shared = null;
  widgetStats.live = 0;
}

function schedule(w: Widget<WidgetKind>): void {
  // A late tween callback of an unmounted widget must not bring the renderer back.
  if (w.destroyed) return;
  dirty.add(w);
  if (!frame) frame = requestAnimationFrame(flush);
}

function flush(): void {
  frame = 0;
  if (!widgets.size) {
    dirty.clear();
    return;
  }
  const s = ensureShared();
  if (!s) return;
  const list = [...dirty];
  dirty.clear();
  for (const w of list) {
    if (w.destroyed || !w.canvas.isConnected) continue;
    w.paint(s);
    if (w.animating) dirty.add(w);
  }
  if (dirty.size) frame = requestAnimationFrame(flush);
}

function sceneBase(env: Texture): Scene {
  const s = new Scene();
  s.environment = env;
  s.add(new HemisphereLight(0xfff2dc, 0x2b1c12, 0.8));
  const key = new DirectionalLight(0xffe4bc, 2.2);
  key.position.set(-3, 4, 6);
  s.add(key);
  return s;
}

function mat(d: Set<{ dispose(): void }>, params: ConstructorParameters<typeof MeshStandardMaterial>[0]): MeshStandardMaterial {
  return track(d, new MeshStandardMaterial(params));
}

// ------------------------------------------------------------------ gas

interface Canister {
  group: Group;
  body: MeshStandardMaterial;
  bands: Mesh<CylinderGeometry, MeshStandardMaterial>[];
}
interface GasScene {
  scene: Scene;
  cam: OrthographicCamera;
  fitted: Canister;
  spares: Canister[];
}

const BAND_LIT = 0x9a2626;
const BAND_EMPTY = 0x3c4147;

function gasScene(env: Texture, d: Set<{ dispose(): void }>): GasScene {
  const scene = sceneBase(env);
  const cam = new OrthographicCamera(-4.8, 4.8, 2.8, -2.8, 0.1, 50);
  cam.position.set(0, 0.6, 10);
  cam.lookAt(0, 0, 0);
  const profile = [[0, -2.2], [0.62, -2.18], [0.78, -2.05], [0.8, -1.8], [0.8, 1.7], [0.72, 1.95], [0.45, 2.1], [0.2, 2.15], [0, 2.15]].map(([x, y]) => new Vector2(x, y));
  const body = track(d, new LatheGeometry(profile, 32));
  const valveGeo = track(d, new CylinderGeometry(0.22, 0.26, 0.5, 16));
  const valveMat = mat(d, { color: 0xd0a85e, metalness: 1, roughness: 0.3 });
  const make = (x: number, scale: number): Canister => {
    const group = new Group();
    group.position.set(x, -0.2, 0);
    group.scale.setScalar(scale);
    group.userData.rest = { x, y: -0.2 };
    const bodyMat = mat(d, { color: 0xd7dde2, metalness: 0.95, roughness: 0.25 });
    group.add(new Mesh(body, bodyMat));
    const valve = new Mesh(valveGeo, valveMat);
    valve.position.y = 2.4;
    group.add(valve);
    scene.add(group);
    return { group, body: bodyMat, bands: [] };
  };
  return { scene, cam, fitted: make(-2.4, 1), spares: [0, 1, 2].slice(0, MAX_SPARES).map((i) => make(0.9 + i * 1.45, 0.6)) };
}

/** Rebuilds a canister's bands when the full rating changes (a band per point of Gas Rating). */
function setBands(c: Canister, full: number, d: Set<{ dispose(): void }>): void {
  if (c.bands.length === full) return;
  for (const b of c.bands) {
    c.group.remove(b);
    for (const x of [b.geometry, b.material]) {
      x.dispose();
      d.delete(x);
    }
  }
  const span = 3.4;
  const h = Math.min(0.5, (span / Math.max(1, full)) * 0.55);
  c.bands = Array.from({ length: full }, (_, i) => {
    const geo = track(d, new CylinderGeometry(0.83, 0.83, h, 32, 1, true));
    const m = mat(d, { color: BAND_EMPTY, metalness: 0.8, roughness: 0.5 });
    const band = new Mesh(geo, m);
    band.position.y = -1.6 + (i + 0.5) * (span / Math.max(1, full));
    c.group.add(band);
    return band;
  });
}

function lightBands(c: Canister, level: number, flash: number, flashBand: number): void {
  c.bands.forEach((b, i) => {
    const lit = i < level;
    b.material.color.setHex(lit ? BAND_LIT : BAND_EMPTY);
    b.material.metalness = lit ? 0.2 : 0.8;
    b.material.emissive.setHex(i === flashBand ? 0x662222 : 0);
    b.material.emissiveIntensity = i === flashBand ? flash : 0;
    // Reduced motion keeps the colour flash only; the band swells only at Full.
    const grow = i === flashBand && motionMode() === 'full' ? 1 + 0.15 * flash : 1;
    b.scale.set(grow, 1, grow);
  });
}

// ------------------------------------------------------------------ blades

interface BladeScene {
  scene: Scene;
  cam: OrthographicCamera;
  held: Group[];
  stubs: Group;
  carried: Group[];
}

function bladeScene(env: Texture, d: Set<{ dispose(): void }>): BladeScene {
  const scene = sceneBase(env);
  const cam = new OrthographicCamera(-6, 6, 2.8, -2.8, 0.1, 50);
  cam.position.set(0, 1.2, 10);
  cam.lookAt(0, 0, 0);
  const shape = new Shape();
  shape.moveTo(0, -0.16);
  shape.lineTo(6, -0.16);
  shape.lineTo(6.6, 0.16);
  shape.lineTo(0, 0.16);
  shape.closePath();
  const bladeGeo = track(d, new ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false }));
  const stubShape = new Shape();
  stubShape.moveTo(0, -0.16);
  stubShape.lineTo(1.3, -0.16);
  stubShape.lineTo(1.0, 0.02);
  stubShape.lineTo(1.5, 0.16);
  stubShape.lineTo(0, 0.16);
  stubShape.closePath();
  const stubGeo = track(d, new ExtrudeGeometry(stubShape, { depth: 0.04, bevelEnabled: false }));
  const steel = (): MeshStandardMaterial => mat(d, { color: 0xe6ebef, metalness: 1, roughness: 0.22, transparent: true });

  const box = new Mesh(track(d, new BoxGeometry(3, 1.9, 1)), mat(d, { color: 0x7c848b, metalness: 0.75, roughness: 0.35 }));
  box.position.set(-4.3, -1.4, 0);
  scene.add(box);
  const strap = new Mesh(track(d, new BoxGeometry(0.4, 2.05, 1.1)), mat(d, { color: 0x4a3120, roughness: 0.8 }));
  strap.position.copy(box.position);
  scene.add(strap);
  const grip = new Group();
  grip.position.set(-4.6, 1.3, 0);
  const gunmetal = mat(d, { color: 0x2a2d31, metalness: 0.6, roughness: 0.45 });
  grip.add(new Mesh(track(d, new BoxGeometry(2.2, 0.7, 0.5)), gunmetal));
  const trigger = new Mesh(track(d, new BoxGeometry(0.4, 1.1, 0.4)), gunmetal);
  trigger.position.set(-0.3, -0.8, 0);
  trigger.rotation.z = 0.25;
  grip.add(trigger);
  scene.add(grip);

  const heldBlade = (y: number, z: number) => {
    const g = new Group();
    g.add(new Mesh(bladeGeo, steel()));
    g.position.set(-3.5, y, z);
    g.userData.rest = g.position.clone();
    scene.add(g);
    return g;
  };
  const held = [heldBlade(1.45, 0.1), heldBlade(1.1, -0.1)];
  const stubs = new Group();
  for (const [y, z] of [[1.45, 0.1], [1.1, -0.1]]) {
    const m = new Mesh(stubGeo, mat(d, { color: 0x9aa1a7, metalness: 0.9, roughness: 0.5 }));
    m.position.set(-3.5, y, z);
    stubs.add(m);
  }
  scene.add(stubs);
  const carried = Array.from({ length: MAX_CARRIED }, (_, i) => {
    const g = new Group();
    for (const j of [0, 1]) {
      const m = new Mesh(bladeGeo, steel());
      m.position.set(0, j * 0.22, -0.1 * j);
      m.scale.x = 0.72;
      g.add(m);
    }
    g.position.set(-3.1, -2.05 + i * 0.5, 0.2);
    g.userData.rest = g.position.clone();
    scene.add(g);
    return g;
  });
  return { scene, cam, held, stubs, carried };
}

function setOpacity(o: Object3D, v: number): void {
  o.traverse((c) => {
    const m = (c as Mesh).material as Material | undefined;
    if (m) m.opacity = v;
  });
}

// ------------------------------------------------------------------ widget

/** Animated values a widget tweens; they are reset to rest when an animation ends. */
interface Anim {
  /** Gas: jolt rotation, drop-in of the new canister, band flash. Blades: fall and fade, slide-in. */
  jolt: number;
  drop: number;
  spin: number;
  flash: number;
  fall: number;
  slide: number;
}
const REST: Anim = { jolt: 0, drop: 0, spin: 0, flash: 0, fall: 0, slide: 0 };

class Widget<K extends WidgetKind> {
  readonly ctx: CanvasRenderingContext2D | null;
  state: StateOf<K>;
  anim: Anim = { ...REST };
  running = 0;
  /** Gas band that flashes; blades: the handles were emptied by a ruin (stubs shown until a swap). */
  flashBand = -1;
  ruined = false;
  destroyed = false;
  /** The running tweens, cancelled when the widget unmounts. */
  #tweens = new Set<{ cancel(): unknown }>();
  #onFail: () => void;

  constructor(
    readonly kind: K,
    readonly canvas: HTMLCanvasElement,
    state: StateOf<K>,
    onFail: () => void,
  ) {
    this.ctx = canvas.getContext('2d');
    this.state = state;
    this.#onFail = onFail;
    this.#size();
  }

  get animating(): boolean {
    return this.running > 0;
  }

  #size(): void {
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    const { w, h } = WIDGET_SIZE[this.kind];
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
  }

  onUnavailable(): void {
    this.#onFail();
  }

  update(next: StateOf<K>): void {
    const prev = this.state;
    this.state = next;
    if (this.kind === 'gas') this.#gasChange(prev as GasState, next as GasState);
    else this.#bladeChange(prev as BladeState, next as BladeState);
    schedule(this);
  }

  /** Runs one tween on the widget's animated values; frames are drawn only while it runs. */
  #tween(props: Partial<Record<keyof Anim, number[]>>, opts: { duration?: number; ease?: string; delay?: number } = {}): void {
    const mode = motionMode();
    if (mode === 'off') return;
    let keys = Object.keys(props) as (keyof Anim)[];
    if (mode === 'reduced') keys = keys.filter((k) => k === 'flash' || k === 'fall');
    if (!keys.length) return;
    const target: Record<string, unknown> = {};
    for (const k of keys) target[k] = props[k];
    this.running += 1;
    const duration = mode === 'reduced' ? Math.min(opts.duration ?? MOTION.weighty, MOTION.reducedMax) : (opts.duration ?? MOTION.weighty);
    let tween: { cancel(): unknown } | undefined;
    tween = animate(this.anim as never, {
      ...target,
      duration,
      delay: mode === 'reduced' ? 0 : (opts.delay ?? 0),
      ease: mode === 'reduced' ? 'linear' : (opts.ease ?? MOTION.ease),
      onComplete: () => {
        if (tween) this.#tweens.delete(tween);
        this.running = Math.max(0, this.running - 1);
        if (!this.running) {
          this.anim = { ...REST };
          this.flashBand = -1;
        }
        schedule(this);
      },
    } as never);
    this.#tweens.add(tween);
  }

  #gasChange(prev: GasState, next: GasState): void {
    if (next.level < prev.level && next.spares.length === prev.spares.length) {
      // Spend: a jolt and the emptied band flashes.
      this.flashBand = next.level;
      this.#tween({ jolt: [0, 0.12, -0.1, 0.05, 0] }, { ease: MOTION.jolt });
      this.#tween({ flash: [1, 0] });
    } else if (next.level > prev.level || next.spares.length < prev.spares.length) {
      // A canister changed: the new one drops in with a turn, the spares settle.
      this.#tween({ drop: [1.6, 0] }, { ease: 'outBounce' });
      this.#tween({ spin: [Math.PI * 2, 0] });
      this.flashBand = Math.max(0, next.level - 1);
      this.#tween({ flash: [1, 0] });
    }
  }

  #bladeChange(prev: BladeState, next: BladeState): void {
    if (prev.inHandles && !next.inHandles) {
      this.ruined = true;
      this.#tween({ fall: [0, 1] }, { ease: 'inQuad' });
    } else if (!prev.inHandles && next.inHandles) {
      this.ruined = false;
      this.#tween({ slide: [1, 0] }, { ease: MOTION.settle });
    }
  }

  paint(s: Shared): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const { w, h } = { w: this.canvas.width, h: this.canvas.height };
    const view = this.kind === 'gas' ? this.#poseGas(s.gas, s.disposables) : this.#poseBlades(s.blades);
    s.renderer.setViewport(0, 0, w, h);
    s.renderer.setScissor(0, 0, w, h);
    s.renderer.clear();
    s.renderer.render(view.scene, view.cam);
    ctx.clearRect(0, 0, w, h);
    // WebGL's origin is bottom-left: the widget's pixels are the buffer's bottom rows.
    ctx.drawImage(s.renderer.domElement, 0, BUFFER.h - h, w, h, 0, 0, w, h);
    widgetStats.paints += 1;
  }

  #poseGas(g: GasScene, d: Set<{ dispose(): void }>): { scene: Scene; cam: OrthographicCamera } {
    const st = this.state as GasState;
    const a = this.anim;
    setBands(g.fitted, st.full, d);
    lightBands(g.fitted, st.level, a.flash, this.flashBand);
    g.fitted.body.color.setHex(st.dull || st.level <= 0 ? 0x7a8087 : 0xd7dde2);
    g.fitted.group.rotation.set(0, a.spin, a.jolt);
    g.fitted.group.position.y = g.fitted.group.userData.rest.y + a.drop;
    g.spares.forEach((c, i) => {
      const level = st.spares[i];
      c.group.visible = level !== undefined;
      if (level === undefined) return;
      setBands(c, st.full, d);
      lightBands(c, level, 0, -1);
      c.body.color.setHex(0xc9cfd4);
      c.group.position.y = c.group.userData.rest.y + a.drop * 0.25;
    });
    return g;
  }

  #poseBlades(b: BladeScene): { scene: Scene; cam: OrthographicCamera } {
    const st = this.state as BladeState;
    const a = this.anim;
    const falling = a.fall > 0 && a.fall < 1;
    b.held.forEach((g, i) => {
      const rest = g.userData.rest;
      g.visible = st.inHandles || falling;
      g.position.set(rest.x + (1 + i) * a.fall + 4 * a.slide, rest.y - 2.4 * a.fall - 2.4 * a.slide, rest.z);
      g.rotation.set(0, 0, -(0.7 + i * 0.3) * a.fall);
      setOpacity(g, st.inHandles ? 1 : 1 - a.fall);
    });
    b.stubs.visible = !st.inHandles && this.ruined && !falling;
    b.carried.forEach((g, i) => {
      g.visible = i < st.carried;
    });
    return b;
  }

  destroy(): void {
    this.destroyed = true;
    for (const tween of this.#tweens) tween.cancel();
    this.#tweens.clear();
    this.running = 0;
    dirty.delete(this);
    widgets.delete(this as Widget<WidgetKind>);
    if (!widgets.size) disposeShared();
  }
}

export interface WidgetHandle<K extends WidgetKind> {
  update(state: StateOf<K>): void;
  destroy(): void;
}

/**
 * Mounts a widget on a canvas. Returns null when WebGL is unavailable (the caller shows the static
 * icon); `onFail` runs if the renderer is lost later.
 */
export function mountWidget<K extends WidgetKind>(kind: K, canvas: HTMLCanvasElement, state: StateOf<K>, onFail: () => void): WidgetHandle<K> | null {
  if (!webglAvailable()) return null;
  const w = new Widget(kind, canvas, state, onFail);
  widgets.add(w as Widget<WidgetKind>);
  if (!ensureShared()) {
    widgets.delete(w as Widget<WidgetKind>);
    return null;
  }
  schedule(w as Widget<WidgetKind>);
  return {
    update: (s) => w.update(s),
    destroy: () => w.destroy(),
  };
}
