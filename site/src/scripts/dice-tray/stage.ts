/**
 * The Dice Tray's 3D field box (ADR-0023): a wooden box lined with Survey Corps
 * green cloth, with dice of bone, blued gunmetal, wax-seal lacquer, and flesh.
 *
 * Each throw runs to rest in ./physics first, so the result is read from the
 * settled faces before anything is drawn; the recorded motion is then played
 * back. The result never waits on animation frames, so a hidden tab still gets
 * its numbers. Dice a Push keeps stay frozen where they lie.
 */
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Texture,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { DieKind } from '~/lib/dice';
import { drawWings, type WingStyle } from '../emblem';
import { createDiceWorld, FACE_VALUES, traySize } from './physics';

export interface ThrowDie {
  id: number;
  kind: DieKind;
}

export interface TrayStage {
  /** Clears the box and throws every die. Resolves with each die's settled face by id. */
  roll(dice: readonly ThrowDie[]): Promise<Map<number, number>>;
  /** Freezes every other die where it lies and throws these (existing ids are picked up, new ids added). */
  reroll(dice: readonly ThrowDie[]): Promise<Map<number, number>>;
  clear(): void;
  dispose(): void;
}

const RIM = 0.75;
const RIM_H = 1.5;
const FACE_PX = 192;
const MAX_PIXEL_RATIO = 1.75;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/* ---------- procedural textures ---------- */

function canvas2d(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('No 2D canvas');
  return [c, ctx];
}

function speckle(ctx: CanvasRenderingContext2D, size: number, colour: string, count: number, max = 1.6) {
  ctx.fillStyle = colour;
  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, rand(0.3, max), 0, Math.PI * 2);
    ctx.fill();
  }
}

const PIPS: Record<number, ReadonlyArray<readonly [number, number]>> = {
  1: [[0.5, 0.5]],
  2: [[0.28, 0.28], [0.72, 0.72]],
  3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]],
  4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.26, 0.26], [0.74, 0.26], [0.5, 0.5], [0.26, 0.74], [0.74, 0.74]],
  6: [[0.28, 0.23], [0.72, 0.23], [0.28, 0.5], [0.72, 0.5], [0.28, 0.77], [0.72, 0.77]],
};

interface KindLook {
  /** Corner radius: bone is turned, gunmetal machined, lacquer soft, flesh swollen. */
  radius: number;
  /** Faces that show the Wings emblem instead of pips: the successes. */
  emblemFaces: readonly number[];
  wings: WingStyle;
  surface(ctx: CanvasRenderingContext2D, s: number): void;
  pip(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void;
  material(map: Texture): Material;
}

const LOOKS: Record<DieKind, KindLook> = {
  // Bone with inked pips.
  base: {
    radius: 0.12,
    emblemFaces: [6],
    wings: { fill: '#211b14', edge: '#e6dcc2', edgeWidth: 2.4 },
    surface(ctx, s) {
      ctx.fillStyle = '#e6dcc2';
      ctx.fillRect(0, 0, s, s);
      const g = ctx.createRadialGradient(s * 0.42, s * 0.38, s * 0.08, s * 0.5, s * 0.5, s * 0.78);
      g.addColorStop(0, 'rgba(255,250,235,.4)');
      g.addColorStop(1, 'rgba(150,118,68,.3)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = 'rgba(120,96,58,.12)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const y = rand(0, s);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(s * 0.3, y + rand(-8, 8), s * 0.7, y + rand(-8, 8), s, y + rand(-6, 6));
        ctx.stroke();
      }
      speckle(ctx, s, 'rgba(90,70,40,.12)', 160, 1.1);
    },
    pip(ctx, x, y, r) {
      ctx.fillStyle = 'rgba(33,27,20,.35)';
      ctx.beginPath();
      ctx.arc(x + r * 0.08, y + r * 0.1, r * 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#211b14';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    },
    material: (map) => new MeshStandardMaterial({ map, roughness: 0.55, metalness: 0, bumpMap: map, bumpScale: 1.4 }),
  },
  // Blued gunmetal with engraved ring pips.
  gear: {
    radius: 0.05,
    emblemFaces: [6],
    wings: { fill: '#c3ccd0', edge: '#1b2228', edgeWidth: 2.6 },
    surface(ctx, s) {
      const g = ctx.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, '#41515f');
      g.addColorStop(1, '#232c35');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 110; i++) {
        ctx.fillStyle = `rgba(200,222,240,${rand(0.02, 0.07)})`;
        ctx.fillRect(0, rand(0, s), s, rand(0.5, 1.2));
      }
      speckle(ctx, s, 'rgba(10,14,18,.25)', 60, 0.9);
      ctx.strokeStyle = 'rgba(210,225,235,.18)';
      ctx.lineWidth = 3;
      ctx.strokeRect(5, 5, s - 10, s - 10);
    },
    pip(ctx, x, y, r) {
      ctx.fillStyle = '#12171c';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c3ccd0';
      ctx.lineWidth = r * 0.34;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.78, 0, Math.PI * 2);
      ctx.stroke();
    },
    material: (map) => new MeshStandardMaterial({ map, metalness: 0.85, roughness: 0.34, bumpMap: map, bumpScale: -1.2 }),
  },
  // Wax-seal red lacquer.
  stress: {
    radius: 0.17,
    emblemFaces: [6],
    wings: { fill: '#f0dfc9', edge: '#5e1a13', edgeWidth: 2.4 },
    surface(ctx, s) {
      ctx.fillStyle = '#7f241c';
      ctx.fillRect(0, 0, s, s);
      const g = ctx.createRadialGradient(s * 0.35, s * 0.3, s * 0.05, s * 0.5, s * 0.5, s * 0.8);
      g.addColorStop(0, 'rgba(255,180,160,.2)');
      g.addColorStop(0.6, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(40,5,3,.4)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = 'rgba(30,4,2,.12)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(rand(0, s), rand(0, s), rand(s * 0.1, s * 0.4), rand(0, 6), rand(0, 6) + 1.4);
        ctx.stroke();
      }
    },
    pip(ctx, x, y, r) {
      ctx.fillStyle = '#f0dfc9';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(60,10,6,.55)';
      ctx.lineWidth = r * 0.22;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.92, 0, Math.PI * 2);
      ctx.stroke();
    },
    material: (map) =>
      new MeshPhysicalMaterial({ map, roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, bumpMap: map, bumpScale: -0.8 }),
  },
  // Raw flesh, with the emblem on both successes: 5 and 6.
  titan: {
    radius: 0.24,
    emblemFaces: [5, 6],
    wings: { fill: '#4a261d', edge: '#c08e74', edgeWidth: 2.4 },
    surface(ctx, s) {
      ctx.fillStyle = '#b8866a';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 40; i++) {
        const x = rand(0, s);
        const y = rand(0, s);
        const r = rand(s * 0.04, s * 0.18);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, Math.random() < 0.5 ? 'rgba(205,156,130,.35)' : 'rgba(150,92,74,.3)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      ctx.strokeStyle = 'rgba(122,58,58,.28)';
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(rand(0, s), rand(0, s));
        ctx.bezierCurveTo(rand(0, s), rand(0, s), rand(0, s), rand(0, s), rand(0, s), rand(0, s));
        ctx.stroke();
      }
      speckle(ctx, s, 'rgba(90,40,30,.18)', 120, 1);
    },
    pip(ctx, x, y, r) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand(0, Math.PI));
      ctx.scale(rand(0.85, 1.15), rand(0.85, 1.15));
      ctx.fillStyle = '#4a261d';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,215,195,.25)';
      ctx.lineWidth = r * 0.2;
      ctx.stroke();
      ctx.restore();
    },
    material: (map) =>
      new MeshPhysicalMaterial({
        map,
        roughness: 0.78,
        metalness: 0,
        sheen: 0.6,
        sheenColor: new Color('#e3a58f'),
        sheenRoughness: 0.6,
        bumpMap: map,
        bumpScale: 1.2,
      }),
  },
};

function faceTexture(kind: DieKind, value: number, anisotropy: number): CanvasTexture {
  const look = LOOKS[kind];
  const [c, ctx] = canvas2d(FACE_PX, FACE_PX);
  look.surface(ctx, FACE_PX);
  if (look.emblemFaces.includes(value)) {
    ctx.save();
    ctx.translate(FACE_PX / 2, FACE_PX / 2);
    const k = (FACE_PX * 0.74) / 82;
    ctx.scale(k, k);
    drawWings(ctx, look.wings);
    ctx.restore();
  } else {
    for (const [x, y] of PIPS[value] ?? []) look.pip(ctx, x * FACE_PX, y * FACE_PX, FACE_PX * 0.085);
  }
  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}

function clothTexture(): CanvasTexture {
  const size = 256;
  const [c, ctx] = canvas2d(size, size);
  ctx.fillStyle = '#2d4839';
  ctx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 2) {
    ctx.fillStyle = `rgba(210,235,215,${rand(0.01, 0.05)})`;
    ctx.fillRect(0, y, size, 1);
  }
  for (let x = 0; x < size; x += 2) {
    ctx.fillStyle = `rgba(0,0,0,${rand(0.03, 0.1)})`;
    ctx.fillRect(x, 0, 1, size);
  }
  speckle(ctx, size, 'rgba(0,0,0,.12)', 500, 0.8);
  speckle(ctx, size, 'rgba(200,220,200,.05)', 300, 0.8);
  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return texture;
}

function woodTexture(): CanvasTexture {
  const [c, ctx] = canvas2d(512, 128);
  ctx.fillStyle = '#6a4629';
  ctx.fillRect(0, 0, 512, 128);
  for (let i = 0; i < 46; i++) {
    const y = rand(-10, 138);
    ctx.strokeStyle = Math.random() < 0.7 ? `rgba(38,20,8,${rand(0.08, 0.26)})` : `rgba(176,126,76,${rand(0.06, 0.16)})`;
    ctx.lineWidth = rand(0.6, 2.4);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + rand(-9, 9), 340, y + rand(-9, 9), 512, y + rand(-6, 6));
    ctx.stroke();
  }
  for (let i = 0; i < 2; i++) {
    const x = rand(40, 470);
    const y = rand(24, 104);
    ctx.strokeStyle = 'rgba(40,20,8,.35)';
    ctx.lineWidth = 1.4;
    for (let r = 3; r < 16; r += 3.5) {
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.8, r * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/* ---------- the stage ---------- */

export function createStage(host: HTMLElement): TrayStage {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0x140e08);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.45;

  const aspect = host.clientWidth > 0 && host.clientHeight > 0 ? host.clientWidth / host.clientHeight : 1.6;
  const physics = createDiceWorld(traySize(aspect));
  const { width: W, depth: D } = physics.size;

  const camera = new PerspectiveCamera(30, aspect, 0.5, 200);

  scene.add(new HemisphereLight(0xfff0d8, 0x1e1a12, 0.55));
  const sun = new DirectionalLight(0xffe4bc, 2.4);
  sun.position.set(-6, 14, -7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  const reach = Math.max(W, D) / 2 + 2.5;
  Object.assign(sun.shadow.camera, { left: -reach, right: reach, top: reach, bottom: -reach, near: 1, far: 40 });
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun, sun.target);

  // The box: cloth floor and wooden rims.
  const disposables: Array<{ dispose(): void }> = [pmrem, environment];
  const anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const cloth = clothTexture();
  cloth.repeat.set(W / 2.5, D / 2.5);
  cloth.anisotropy = anisotropy;
  const floorGeometry = new PlaneGeometry(W + 0.2, D + 0.2);
  const floorMaterial = new MeshStandardMaterial({ map: cloth, roughness: 0.96 });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const wood = woodTexture();
  wood.anisotropy = anisotropy;
  const woodMaterial = new MeshStandardMaterial({ map: wood, roughness: 0.62 });
  disposables.push(cloth, floorGeometry, floorMaterial, wood, woodMaterial);
  const rims: Array<[number, number, number, number]> = [
    [RIM, D + RIM * 2, -(W / 2 + RIM / 2), 0],
    [RIM, D + RIM * 2, W / 2 + RIM / 2, 0],
    [W, RIM, 0, -(D / 2 + RIM / 2)],
    [W, RIM, 0, D / 2 + RIM / 2],
  ];
  for (const [w, d, x, z] of rims) {
    const geometry = new BoxGeometry(w, RIM_H, d);
    const rim = new Mesh(geometry, woodMaterial);
    rim.position.set(x, RIM_H / 2 - 0.05, z);
    rim.castShadow = true;
    rim.receiveShadow = true;
    scene.add(rim);
    disposables.push(geometry);
  }

  // Dice looks, built once per kind. Material order follows the box faces in ./physics.
  const geometries = {} as Record<DieKind, BufferGeometry>;
  const materials = {} as Record<DieKind, Material[]>;
  for (const kind of Object.keys(LOOKS) as DieKind[]) {
    geometries[kind] = new RoundedBoxGeometry(1, 1, 1, 4, LOOKS[kind].radius);
    materials[kind] = FACE_VALUES.map((value) => {
      const map = faceTexture(kind, value, anisotropy);
      disposables.push(map);
      return LOOKS[kind].material(map);
    });
    disposables.push(geometries[kind], ...materials[kind]);
  }

  const meshes = new Map<number, Mesh>();

  function render() {
    renderer.render(scene, camera);
  }

  function fit() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const vHalf = ((camera.fov / 2) * Math.PI) / 180;
    const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
    const halfW = W / 2 + RIM + 0.15;
    const halfD = D / 2 + RIM + 0.15;
    const distance = Math.max(halfW / Math.tan(hHalf), (halfD / Math.tan(vHalf)) * 1.04) + 0.5;
    const tilt = 0.2;
    camera.position.set(0, distance * Math.cos(tilt), distance * Math.sin(tilt));
    camera.lookAt(0, 0, 0.1);
    camera.updateProjectionMatrix();
    render();
  }

  function meshFor({ id, kind }: ThrowDie): Mesh {
    let mesh = meshes.get(id);
    if (!mesh) {
      mesh = new Mesh(geometries[kind], materials[kind]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.visible = false;
      scene.add(mesh);
      meshes.set(id, mesh);
    }
    return mesh;
  }

  let playToken = 0;
  function play(list: readonly Mesh[], frames: readonly Float32Array[]): Promise<void> {
    const token = ++playToken;
    return new Promise((resolve) => {
      const last = frames.length - 1;
      const apply = (index: number) => {
        const frame = frames[index]!;
        list.forEach((mesh, i) => {
          const o = i * 7;
          mesh.position.set(frame[o]!, frame[o + 1]!, frame[o + 2]!);
          mesh.quaternion.set(frame[o + 3]!, frame[o + 4]!, frame[o + 5]!, frame[o + 6]!);
          mesh.visible = true;
        });
      };
      let finished = false;
      let timer = 0;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timer);
        if (token === playToken) {
          apply(last);
          render();
        }
        resolve();
      };
      if (document.hidden || last <= 0) return finish();
      // Frames can stop in a hidden or throttled tab; the result must still arrive.
      timer = window.setTimeout(finish, (last / 60) * 1000 + 900);
      const start = performance.now();
      const tick = (now: number) => {
        if (finished) return;
        if (token !== playToken) return finish();
        // A frame's timestamp can precede `start`, so never index before the first frame.
        const index = Math.max(0, Math.floor(((now - start) / 1000) * 60));
        if (index >= last) return finish();
        apply(index);
        render();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  async function throwDice(dice: readonly ThrowDie[]): Promise<Map<number, number>> {
    const list = dice.map(meshFor);
    const result = physics.throwDice(dice.map((d) => d.id));
    await play(list, result.frames);
    return result.values;
  }

  function clear() {
    playToken++;
    for (const mesh of meshes.values()) scene.remove(mesh);
    meshes.clear();
    physics.clear();
    render();
  }

  const resizeObserver = new ResizeObserver(() => fit());
  resizeObserver.observe(host);
  fit();

  return {
    roll(dice) {
      clear();
      return throwDice(dice);
    },
    reroll: throwDice,
    clear,
    dispose() {
      clear();
      resizeObserver.disconnect();
      for (const item of disposables) item.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
