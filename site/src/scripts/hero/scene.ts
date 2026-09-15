/**
 * The cover hero (ADR-0023): dust drifting in 3D through a beam of raking
 * light, and the Wings emblem pressed into the paper, lit from the pointer.
 *
 * The canvas is transparent: it only adds light, shadow, and motes over the
 * paper, so an art plate can sit behind it or beside it. The emblem is placed
 * over an anchor element, so CSS decides where the seal is pressed.
 */
import {
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import { drawWings } from '../emblem';

export interface HeroOptions {
  /** The element whose box the emblem is pressed into. No emblem without it. */
  emblemAnchor?: HTMLElement | null;
  /** Where pointer movement is read. Defaults to the host's parent. */
  pointerArea?: HTMLElement | null;
  maxPixelRatio?: number;
}

export interface HeroScene {
  dispose(): void;
}

const FOV = 30;
const HEIGHT_PX = 512;

const EMBLEM_VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vPos;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPos = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const EMBLEM_FRAGMENT = /* glsl */ `
uniform sampler2D uHeight;
uniform float uTexel;
uniform vec3 uLight;
uniform float uDepth;
uniform float uOpacity;
varying vec2 vUv;
varying vec3 vPos;
float hgt(vec2 uv) { return texture2D(uHeight, uv).r; }
void main() {
  float e = uTexel * 2.0;
  float hx = hgt(vUv + vec2(e, 0.0)) - hgt(vUv - vec2(e, 0.0));
  float hy = hgt(vUv + vec2(0.0, e)) - hgt(vUv - vec2(0.0, e));
  float h = hgt(vUv);
  // Pressed in: the surface sinks where the emblem is, so its walls face inward.
  vec3 n = normalize(vec3(hx * uDepth, hy * uDepth, 1.0));
  vec3 l = normalize(uLight - vPos);
  float diff = dot(n, l) - l.z;
  // A blind press: no ink, only a faint rim of light and shadow.
  float hi = clamp(diff * 1.1, 0.0, 0.24) * uOpacity;
  float sh = clamp(-diff * 1.3 + h * 0.03, 0.0, 0.26) * uOpacity;
  float a = hi + sh - hi * sh;
  vec3 rgb = vec3(1.0, 0.972, 0.886) * hi * (1.0 - sh) + vec3(0.23, 0.18, 0.11) * sh;
  gl_FragColor = vec4(rgb, a);
}`;

const DUST_VERTEX = /* glsl */ `
attribute vec4 aSeed; // radius px, phase, speed, twinkle rate
uniform float uTime;
uniform vec2 uBox;
uniform float uPixelRatio;
uniform float uCamZ;
uniform float uBeamShift;
varying float vLit;
varying float vTwinkle;
varying float vRadius;
void main() {
  vec3 p = position;
  float t = uTime;
  p.x += t * (4.0 + aSeed.z * 12.0);
  p.y += t * (1.5 - aSeed.z * 4.0) + sin(aSeed.y + t * (0.25 + aSeed.z * 0.4)) * 8.0;
  p.z += sin(aSeed.y * 1.7 + t * 0.15) * 26.0;
  vec2 span = uBox + 40.0;
  p.xy = mod(p.xy + span * 0.5, span) - span * 0.5;
  // Distance across the beam, which rakes in at 112 degrees and leans through depth.
  float across = uBox.x * 0.927 + uBox.y * 0.375;
  float s = (p.x * 0.927 - p.y * 0.375 + p.z * 0.35) / across + 0.5;
  vLit = exp(-pow((s - 0.47 - uBeamShift) / 0.1, 2.0));
  vTwinkle = 0.65 + 0.35 * sin(aSeed.y + t * aSeed.w);
  vRadius = aSeed.x;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSeed.x * 7.2 * (1.0 + vLit * 0.6) * (uCamZ / max(1.0, -mv.z)) * uPixelRatio;
}`;

const DUST_FRAGMENT = /* glsl */ `
varying float vLit;
varying float vTwinkle;
varying float vRadius;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  const float edge = 0.2778; // the mote's core inside its glow sprite
  float core = 1.0 - smoothstep(edge * 0.6, edge, d);
  float glow = vRadius > 1.1 ? exp(-d * d * 5.0) * 0.14 : 0.0;
  float lit = smoothstep(0.03, 0.12, vLit);
  float aLit = (core * (0.2 + 0.75 * vLit) + glow * vLit) * vTwinkle;
  float aDark = (1.0 - smoothstep(edge * 0.45, edge * 0.75, d)) * 0.2 * vTwinkle;
  float a = mix(aDark, aLit, lit);
  vec3 col = mix(vec3(0.282, 0.227, 0.141), vec3(1.0, 0.976, 0.91), lit);
  gl_FragColor = vec4(col * a, a);
}`;

/** A soft height map of the seal: two rings and the crossed wings. */
function emblemHeightMap(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = HEIGHT_PX;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2D canvas');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, HEIGHT_PX, HEIGHT_PX);
  const unit = (HEIGHT_PX / 124) * 0.94;

  const shapes = () => {
    const paint = '#fff';
    ctx.strokeStyle = paint;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, 53, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.save();
    ctx.translate(0, -2);
    ctx.scale(1.12, 1.12);
    drawWings(ctx, { fill: paint, edge: '#000', edgeWidth: 2.2 });
    ctx.restore();
  };

  // A blurred pass gives the pressed slope; shadowBlur is used because canvas
  // filters are not available in every browser. The shape is drawn off-canvas
  // and only its shadow lands on the map.
  const offset = HEIGHT_PX * 4;
  ctx.save();
  ctx.setTransform(unit, 0, 0, unit, HEIGHT_PX / 2 - offset, HEIGHT_PX / 2);
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = offset;
  shapes();
  ctx.restore();
  // A crisp pass keeps the rim of the press sharp.
  ctx.save();
  ctx.setTransform(unit, 0, 0, unit, HEIGHT_PX / 2, HEIGHT_PX / 2);
  ctx.globalAlpha = 0.6;
  shapes();
  ctx.restore();
  return canvas;
}

export function mountHero(host: HTMLElement, options: HeroOptions = {}): HeroScene {
  const renderer = new WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxPixelRatio ?? 1.5));
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 10000);

  // Emblem
  const heightTexture = new CanvasTexture(emblemHeightMap());
  heightTexture.minFilter = LinearFilter;
  heightTexture.magFilter = LinearFilter;
  heightTexture.generateMipmaps = false;
  const emblemMaterial = new ShaderMaterial({
    vertexShader: EMBLEM_VERTEX,
    fragmentShader: EMBLEM_FRAGMENT,
    uniforms: {
      uHeight: { value: heightTexture },
      uTexel: { value: 1 / HEIGHT_PX },
      uLight: { value: new Vector3() },
      uDepth: { value: 5 },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    premultipliedAlpha: true,
  });
  const emblemGeometry = new PlaneGeometry(1, 1);
  const emblem = new Mesh(emblemGeometry, emblemMaterial);
  emblem.visible = false;
  emblem.renderOrder = 0;
  scene.add(emblem);

  // Dust
  const dustGeometry = new BufferGeometry();
  const dustMaterial = new ShaderMaterial({
    vertexShader: DUST_VERTEX,
    fragmentShader: DUST_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uBox: { value: { x: 1, y: 1 } },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uCamZ: { value: 1 },
      uBeamShift: { value: 0 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    premultipliedAlpha: true,
  });
  const dust = new Points(dustGeometry, dustMaterial);
  dust.frustumCulled = false;
  dust.renderOrder = 1;
  scene.add(dust);

  let width = 0;
  let height = 0;
  let moteCount = 0;
  const emblemCenter = new Vector3();
  let emblemSize = 0;

  function seedDust(count: number) {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * (width + 40);
      positions[i * 3 + 1] = (Math.random() - 0.5) * (height + 40);
      positions[i * 3 + 2] = -100 + Math.random() * 340;
      seeds[i * 4] = 0.35 + Math.pow(Math.random(), 2.2) * 2.1;
      seeds[i * 4 + 1] = Math.random() * Math.PI * 2;
      seeds[i * 4 + 2] = Math.random();
      seeds[i * 4 + 3] = 0.6 + Math.random() * 1.4;
    }
    dustGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    dustGeometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 4));
    moteCount = count;
  }

  function placeEmblem() {
    const anchor = options.emblemAnchor;
    if (!anchor) return;
    const h = host.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    if (a.width < 8) {
      emblem.visible = false;
      return;
    }
    emblemSize = a.width;
    emblemCenter.set(a.left - h.left + a.width / 2 - width / 2, height / 2 - (a.top - h.top + a.height / 2), 0);
    emblem.position.copy(emblemCenter);
    emblem.scale.set(a.width, a.width, 1);
    emblem.visible = true;
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    const distance = height / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);
    camera.aspect = width / height;
    camera.position.set(0, 0, distance);
    camera.near = Math.max(1, distance - 1200);
    camera.far = distance + 1200;
    camera.updateProjectionMatrix();
    dustMaterial.uniforms.uBox!.value = { x: width, y: height };
    dustMaterial.uniforms.uCamZ!.value = distance;
    const wanted = Math.round(Math.min(240, Math.max(60, (width * height) / 6000)));
    if (Math.abs(wanted - moteCount) > 12 || moteCount === 0) seedDust(wanted);
    placeEmblem();
    renderFrame(0);
  }

  // Pointer light: raking from the upper left by default, following the pointer when it moves.
  const light = new Vector3();
  const target = new Vector3();
  let pointerActive = false;
  const pointerArea = options.pointerArea ?? host.parentElement ?? host;
  const onPointerMove = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    target.set(event.clientX - rect.left - width / 2, height / 2 - (event.clientY - rect.top), 0);
    pointerActive = true;
  };
  const onPointerLeave = () => {
    pointerActive = false;
  };
  pointerArea.addEventListener('pointermove', onPointerMove, { passive: true });
  pointerArea.addEventListener('pointerleave', onPointerLeave);

  let time = 0;
  // The seal presses in as the scene appears; a page opened in the background shows it already pressed.
  let intro = document.hidden ? 1 : 0;
  let last = 0;
  let initialised = false;

  function renderFrame(dt: number) {
    time += dt;
    intro = Math.min(1, intro + dt / 1.6);
    const sway = Math.sin(time * 0.21) * 0.18;
    if (!pointerActive) {
      target.set(emblemCenter.x - emblemSize * (0.95 + sway), emblemCenter.y + emblemSize * (0.7 - sway * 0.5), 0);
    }
    if (!initialised) {
      light.copy(target);
      initialised = true;
    }
    light.lerp(target, 1 - Math.exp(-dt * 3.5));
    const lightHeight = 150 + emblemSize * 0.35;
    emblemMaterial.uniforms.uLight!.value.set(light.x, light.y, lightHeight);
    emblemMaterial.uniforms.uOpacity!.value = intro * intro * (3 - 2 * intro);
    dustMaterial.uniforms.uTime!.value = time;
    dustMaterial.uniforms.uBeamShift!.value = width > 0 ? ((light.x / width) * 0.05) : 0;
    renderer.render(scene, camera);
  }

  let running = false;
  let onScreen = true;
  const tick = (now: number) => {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    renderFrame(dt);
  };
  function update() {
    const shouldRun = onScreen && !document.hidden;
    if (shouldRun === running) return;
    running = shouldRun;
    last = 0;
    renderer.setAnimationLoop(shouldRun ? tick : null);
  }

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(host);
  if (options.emblemAnchor) resizeObserver.observe(options.emblemAnchor);
  const intersectionObserver = new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    update();
  });
  intersectionObserver.observe(host);
  const onVisibility = () => update();
  document.addEventListener('visibilitychange', onVisibility);

  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    pointerArea.removeEventListener('pointermove', onPointerMove);
    pointerArea.removeEventListener('pointerleave', onPointerLeave);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    emblemGeometry.dispose();
    emblemMaterial.dispose();
    heightTexture.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
    renderer.dispose();
    canvas.remove();
    host.classList.remove('is-live');
  }
  const onContextLost = (event: Event) => {
    event.preventDefault();
    dispose();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  resize();
  update();
  requestAnimationFrame(() => host.classList.add('is-live'));

  return { dispose };
}
