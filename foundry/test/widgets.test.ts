/**
 * The vitals widgets' lifecycle and Reduced motion (milestone 2 review, M1 and M2), with three.js,
 * anime.js and the settings stubbed: no WebGL in Node.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => {
  class Vec {
    x = 0;
    y = 0;
    z = 0;
    set(x: number, y = 0, z = 0) {
      Object.assign(this, { x, y, z });
      return this;
    }
    setScalar(n: number) {
      return this.set(n, n, n);
    }
    copy(v: Vec) {
      return this.set(v.x, v.y, v.z);
    }
    clone() {
      return new Vec().copy(this);
    }
  }
  /** Any three.js object: every unknown member is a no-op function or a nested stub. */
  const stub = (): any => {
    const store: Record<PropertyKey, unknown> = {};
    const fn = () => proxy;
    const proxy: any = new Proxy(fn, {
      get: (_t, k) => {
        if (k === 'then') return undefined;
        if (k === Symbol.toPrimitive) return () => 0;
        if (!(k in store)) store[k] = stub();
        return store[k];
      },
      set: (_t, k, v) => {
        store[k] = v;
        return true;
      },
      apply: () => proxy,
    });
    return proxy;
  };
  class Obj {
    position = new Vec();
    rotation = new Vec();
    scale = new Vec();
    userData: Record<string, any> = {};
    visible = true;
    children: Obj[] = [];
    add(...o: Obj[]) {
      this.children.push(...o);
    }
    remove() {}
    lookAt() {}
    traverse(f: (o: Obj) => void) {
      f(this);
      for (const c of this.children) c.traverse(f);
    }
  }
  const groups: Obj[] = [];
  class Group extends Obj {
    constructor() {
      super();
      groups.push(this);
    }
  }
  class Mesh extends Obj {
    constructor(
      public geometry: any,
      public material: any,
    ) {
      super();
    }
  }
  const renderers: any[] = [];
  class WebGLRenderer {
    domElement = { addEventListener() {}, removeEventListener() {} };
    disposed = false;
    constructor() {
      renderers.push(this);
    }
    dispose() {
      this.disposed = true;
    }
  }
  for (const k of ['setPixelRatio', 'setSize', 'setClearColor', 'setScissorTest', 'setViewport', 'setScissor', 'clear', 'render', 'forceContextLoss']) {
    (WebGLRenderer.prototype as any)[k] = () => {};
  }
  class Generic {
    constructor() {
      return stub();
    }
  }
  const tweens: { target: any; params: any; cancel: ReturnType<typeof vi.fn> }[] = [];
  const motion = { mode: 'full' as 'full' | 'reduced' | 'off' };
  return { Vec, Obj, Group, Mesh, WebGLRenderer, Generic, groups, renderers, tweens, motion, stub };
});

vi.mock('three', () => ({
  ACESFilmicToneMapping: 1,
  SRGBColorSpace: 'srgb',
  WebGLRenderer: h.WebGLRenderer,
  Group: h.Group,
  Mesh: h.Mesh,
  Scene: h.Obj,
  Vector2: h.Vec,
  BoxGeometry: h.Generic,
  CylinderGeometry: h.Generic,
  DirectionalLight: h.Obj,
  ExtrudeGeometry: h.Generic,
  HemisphereLight: h.Obj,
  LatheGeometry: h.Generic,
  MeshStandardMaterial: h.Generic,
  OrthographicCamera: h.Obj,
  PMREMGenerator: h.Generic,
  Shape: h.Generic,
}));
vi.mock('three/addons/environments/RoomEnvironment.js', () => ({ RoomEnvironment: h.Generic }));
vi.mock('animejs/animation', () => ({
  animate: (target: any, params: any) => {
    const tween = { target, params, cancel: vi.fn() };
    h.tweens.push(tween);
    return tween;
  },
}));
vi.mock('../src/settings.svelte.ts', () => ({ motionMode: () => h.motion.mode }));

const { mountWidget, widgetStats } = await import('../src/motion/widgets.ts');

let frames = new Map<number, () => void>();
let nextFrame = 1;

/** Runs every queued animation frame (and the ones those queue), like the browser would. */
function runFrames(): void {
  for (let i = 0; i < 20 && frames.size; i++) {
    const now = [...frames.values()];
    frames.clear();
    for (const f of now) f();
  }
}

const canvas = () => ({ isConnected: true, width: 0, height: 0, getContext: () => ({ clearRect() {}, drawImage() {} }) }) as unknown as HTMLCanvasElement;

beforeEach(() => {
  frames = new Map();
  vi.stubGlobal('window', { devicePixelRatio: 1, WebGL2RenderingContext: function WebGL2RenderingContext() {} });
  vi.stubGlobal('requestAnimationFrame', (f: () => void) => {
    const id = nextFrame++;
    frames.set(id, f);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  h.renderers.length = 0;
  h.tweens.length = 0;
  h.groups.length = 0;
  h.motion.mode = 'full';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('vitals widgets: closing a sheet mid-animation (M1)', () => {
  it('cancels the tweens and a late callback does not create a renderer', () => {
    const w = mountWidget('blades', canvas(), { inHandles: true, carried: 2 }, () => {})!;
    runFrames();
    expect(h.renderers).toHaveLength(1);
    w.update({ inHandles: false, carried: 2 });
    expect(h.tweens).toHaveLength(1);

    w.destroy();
    expect(h.tweens[0].cancel).toHaveBeenCalled();
    expect(h.renderers[0].disposed).toBe(true);
    expect(widgetStats.live).toBe(0);

    // A tween that finished in the same tick still calls back.
    h.tweens[0].params.onComplete();
    runFrames();
    expect(h.renderers).toHaveLength(1);
    expect(widgetStats.live).toBe(0);
  });

  it('a frame already queued when the last widget went does not create a renderer', () => {
    const w = mountWidget('gas', canvas(), { level: 3, full: 3, spares: [], dull: false }, () => {})!;
    const queued = [...frames.values()];
    w.destroy();
    for (const f of queued) f();
    expect(h.renderers).toHaveLength(1);
    expect(widgetStats.live).toBe(0);
  });
});

describe('vitals widgets: Reduced motion (M2)', () => {
  const heldBlades = () => h.groups.filter((g) => g.userData.role === 'held');

  function midFall(mode: 'full' | 'reduced') {
    h.motion.mode = mode;
    const w = mountWidget('blades', canvas(), { inHandles: true, carried: 0 }, () => {})!;
    runFrames();
    w.update({ inHandles: false, carried: 0 });
    const fall = h.tweens.find((t) => 'fall' in t.params)!;
    expect(fall).toBeDefined();
    fall.target.fall = 0.5;
    runFrames();
    const blades = heldBlades().map((g) => ({ moved: g.position.x !== g.userData.rest.x || g.position.y !== g.userData.rest.y, turned: g.rotation.z !== 0, opacity: (g.children[0] as any).material.opacity }));
    w.destroy();
    return blades;
  }

  it('at Reduced the blades only fade', () => {
    const blades = midFall('reduced');
    expect(blades).toHaveLength(2);
    for (const b of blades) expect(b).toEqual({ moved: false, turned: false, opacity: 0.5 });
  });

  it('at Full the blades fall and turn as they fade', () => {
    const blades = midFall('full');
    for (const b of blades) expect(b).toEqual({ moved: true, turned: true, opacity: 0.5 });
  });
});
