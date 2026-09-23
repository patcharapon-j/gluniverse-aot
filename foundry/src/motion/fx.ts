/**
 * DOM motion through anime.js v4, gated by the viewer's Motion setting (ADR-0027). Off does
 * nothing; Reduced keeps opacity and colour only and stays short; Full uses the tokens.
 */
import { animate } from 'animejs/animation';
import { cubicBezier } from 'animejs/easings/cubic-bezier';
import { stagger } from 'animejs/utils';
import { motionMode } from '../settings.svelte.ts';
import { MOTION } from './tokens.ts';

type Targets = Element | Element[] | NodeListOf<Element> | null | undefined;
type Params = Record<string, unknown>;
type Anim = ReturnType<typeof animate> | null;

const REDUCED_KEYS = ['opacity', 'backgroundColor', 'color', 'delay'];

function empty(t: Targets): boolean {
  if (!t) return true;
  if (t instanceof Element) return !t.isConnected;
  return (t as ArrayLike<Element>).length === 0;
}

/** Runs one animation if the viewer's Motion setting allows it. */
export function fx(targets: Targets, props: Params) {
  const mode = motionMode();
  if (mode === 'off' || empty(targets)) return null;
  if (mode === 'reduced') {
    const keep: Params = {};
    for (const k of REDUCED_KEYS) if (k in props) keep[k] = props[k];
    if (!('opacity' in keep)) keep.opacity = [0.4, 1];
    keep.duration = Math.min(Number(props.duration ?? MOTION.base), MOTION.reducedMax);
    keep.ease = 'linear';
    return animate(targets as never, keep as never);
  }
  return animate(targets as never, { ease: MOTION.ease, duration: MOTION.base, ...props } as never);
}

/** A flash of colour around an element, cleared after the weighty beat. */
export function flash(el: Element | null | undefined, color: string): void {
  const mode = motionMode();
  if (mode === 'off' || !(el instanceof HTMLElement)) return;
  el.style.setProperty('--wof-flash', color);
  el.classList.add('wof-flash');
  const w = el as HTMLElement & { _wofFlash?: number };
  window.clearTimeout(w._wofFlash);
  w._wofFlash = window.setTimeout(() => el.classList.remove('wof-flash'), mode === 'reduced' ? MOTION.reducedMax : MOTION.weighty);
}

/** Something got worse: a short shake and a red flash. */
export function jolt(el: Element | null | undefined, color: string = MOTION.colors.harm): void {
  fx(el, { translateX: [0, -4, 4, -2, 0], duration: MOTION.weighty, ease: MOTION.jolt });
  flash(el, color);
}

/** Something got better or was set: a settle and a blue flash. */
export function pulse(el: Element | null | undefined, color: string = MOTION.colors.relief): void {
  fx(el, { scale: [1.04, 1], duration: MOTION.weighty, ease: MOTION.settle });
  flash(el, color);
}

/** Boxes or dots popping in, staggered. */
export function popIn(els: Element[]): void {
  fx(els, { scale: [0, 1], duration: MOTION.base, ease: MOTION.settle, delay: stagger(MOTION.stagger) });
}

/** Boxes being struck, staggered. */
export function strike(els: Element[]): void {
  fx(els, { scale: [1.3, 1], rotate: [-12, 0], duration: MOTION.weighty, ease: MOTION.settle, delay: stagger(MOTION.stagger) });
}

/** A panel coming into view. */
export function reveal(el: Element | null | undefined): void {
  fx(el, { opacity: [0, 1], translateY: [6, 0], duration: MOTION.base });
}

/** Track boxes being marked: the box settles like a stamp and its ink stroke draws in. */
export function inkIn(els: Element[]): void {
  fx(els, { scale: [1.22, 1], rotate: [-5, 0], duration: MOTION.base, ease: MOTION.settle, delay: stagger(MOTION.stagger) });
  fx(
    els.flatMap((e) => [...e.querySelectorAll('.ink path')]),
    { strokeDashoffset: [1, 0], duration: MOTION.base, ease: MOTION.ease, delay: stagger(MOTION.stagger) },
  );
}

/** Dice landing on the paper: each one drops in and settles, staggered down the row. */
export function tumbleIn(els: Element[], delay = 0): void {
  fx(els, { opacity: [0, 1], scale: [0.35, 1], rotate: [-100, 0], duration: MOTION.weighty, ease: MOTION.settle, delay: stagger(MOTION.stagger, { start: delay }) });
}

/** A die that counts, marked once the pool has landed. */
export function popMark(els: Element[], delay = 0): void {
  fx(els, { scale: [1.35, 1], duration: MOTION.base, ease: MOTION.settle, delay: stagger(MOTION.stagger, { start: delay }) });
}

/**
 * A whole number climbing to the value the element already reads. Only Full motion counts: Reduced
 * and Off leave the text as it was drawn, and a backstop writes the value even if the tab sleeps
 * before the animation ends.
 */
export function countUp(el: Element | null | undefined, delay = 0, duration = MOTION.weighty): void {
  if (!(el instanceof HTMLElement) || motionMode() !== 'full') return;
  const to = Number(el.textContent);
  if (!Number.isInteger(to) || to <= 0) return;
  const box = { n: 0 };
  const write = (v: number) => (el.textContent = String(v));
  write(0);
  animate(box as never, {
    n: to,
    duration,
    delay,
    ease: MOTION.ease,
    onUpdate: () => write(Math.round(box.n)),
    onComplete: () => write(to),
  } as never);
  window.setTimeout(() => {
    if (el.isConnected && Number(el.textContent) !== to) write(to);
  }, delay + duration + MOTION.weighty);
}

/** Track boxes being cleared: a small lift back onto the paper. */
export function inkOut(els: Element[]): void {
  fx(els, { scale: [0.86, 1], opacity: [0.55, 1], duration: MOTION.base, ease: MOTION.settle, delay: stagger(MOTION.stagger) });
}

/*
 * The instruments of the Soldier sheet's band and the Dossier frame (sheet-overhaul plan, 5.3):
 * each helper plays its Full motion, its own short fade under Reduced, and nothing under Off.
 * Timings and curves are the Refined Dossier preview's keyframes.
 */

/** The preview's curves: --ease, the drain, the snap, the needle's overshoot, and CSS ease-out. */
const CURVE = {
  ease: cubicBezier(0.2, 0.8, 0.2, 1),
  drain: cubicBezier(0.5, 0, 0.8, 0.4),
  snap: cubicBezier(0.4, 0, 0.8, 0.4),
  swing: cubicBezier(0.3, 1.45, 0.55, 1),
  out: cubicBezier(0, 0, 0.58, 1),
  linear: cubicBezier(0, 0, 1, 1),
};

/**
 * Resolves once every animation has finished, or after a backstop, so a tab that sleeps mid-way
 * cannot leave a ghost drawn.
 */
export function settled(anims: readonly Anim[], ms: number): Promise<void> {
  const live = anims.filter((a): a is NonNullable<Anim> => !!a);
  if (!live.length) return Promise.resolve();
  return new Promise((resolve) => {
    const backstop = window.setTimeout(resolve, ms + MOTION.weighty);
    Promise.all(live.map((a) => new Promise<void>((r) => void a.then(() => r())))).then(() => {
      window.clearTimeout(backstop);
      resolve();
    });
  });
}

/** A page coming in from the right (the index tabs' switch). Reduced: a fade. */
export function slideIn(el: Element | null | undefined): Anim {
  if (motionMode() === 'reduced') return fx(el, { opacity: [0, 1] });
  return fx(el, { opacity: [0, 1], translateX: [14, 0], duration: 200, ease: CURVE.ease });
}

/**
 * A rubber stamp landing. `rotate` is the stamp's resting tilt when it is set through `transform`;
 * leave it out for a stamp tilted by the CSS `rotate` property. Reduced: a fade.
 */
export function thud(el: Element | null | undefined, rotate?: number): Anim {
  if (motionMode() === 'reduced') return fx(el, { opacity: [0, 1] });
  const tilt = rotate === undefined ? {} : { rotate };
  return fx(el, {
    keyframes: {
      '0%': { scale: 1.6, opacity: 0, ...tilt },
      '55%': { scale: 0.94, opacity: 1, ...tilt },
      '100%': { scale: 1, opacity: 1, ...tilt },
    },
    duration: 220,
    ease: CURVE.ease,
  });
}

/** Dice flicked as a roll leaves the row. Full only. */
export function flick(els: Element[]): Anim {
  if (motionMode() !== 'full') return null;
  return fx(els, {
    keyframes: {
      '0%': { translateY: 0, rotate: 0 },
      '40%': { translateY: -3, rotate: -25 },
      '100%': { translateY: 0, rotate: 0 },
    },
    duration: 240,
    ease: CURVE.ease,
    delay: stagger(MOTION.stagger),
  });
}

/** Spent gas: the emptied bands drain away. Reduced: the gauge flashes instead. */
export function drain(bands: Element[], gauge?: Element | null): Anim {
  if (motionMode() === 'reduced') return fx(gauge, { opacity: [0.4, 1] });
  return fx(bands, { scaleX: [1, 0], opacity: [1, 0.5], duration: 260, ease: CURVE.drain });
}

/** The valve's puff as gas is spent. Full only. */
export function puff(el: Element | null | undefined): Anim {
  if (motionMode() !== 'full') return null;
  return fx(el, { opacity: [1, 0], scale: [0.35, 1.6], translateX: [0, -7], translateY: [0, -1.5], duration: 300, ease: CURVE.out });
}

/** The dial's needle swinging from the old reading to the new one. Full only: otherwise it jumps. */
export function swing(el: Element | null | undefined, from: number, to: number): Anim {
  if (motionMode() !== 'full' || from === to) return null;
  return fx(el, { rotate: [from, to], duration: 300, ease: CURVE.swing });
}

/**
 * A canister or a blade sliding home from `dx` px to the right, past its seat by `overshoot` and
 * back. Reduced: a fade from `fromOpacity`.
 */
export function slideHome(el: Element | null | undefined, { dx = 12, overshoot = 1.2, fromOpacity = 0.25, duration = 240 } = {}): Anim {
  if (motionMode() === 'reduced') return fx(el, { opacity: [fromOpacity, 1] });
  return fx(el, {
    keyframes: {
      '0%': { translateX: dx, opacity: fromOpacity },
      '70%': { translateX: -overshoot, opacity: 1 },
      '100%': { translateX: 0, opacity: 1 },
    },
    duration,
    ease: CURVE.ease,
  });
}

/** The click marks as a part seats. Full only. */
export function clickMarks(el: Element | null | undefined): Anim {
  if (motionMode() !== 'full') return null;
  return fx(el, {
    keyframes: { '0%': { opacity: 0 }, '60%': { opacity: 0 }, '75%': { opacity: 1 }, '100%': { opacity: 0 } },
    duration: 260,
    ease: CURVE.linear,
  });
}

/** A returned canister settling into the rack. Full only. */
export function rackIn(el: Element | null | undefined): Anim {
  if (motionMode() !== 'full') return null;
  return fx(el, { opacity: [0, 1], duration: MOTION.base });
}

/**
 * A ruined blade: its tip snaps away, a spark, the base fades. Reduced: the whole ghost fades.
 * Pass the ghost's parts; `ghost` is their group.
 */
export function snap(parts: { ghost: Element | null | undefined; tip: Element | null | undefined; base: Element | null | undefined; spark: Element | null | undefined }): Anim[] {
  if (motionMode() === 'reduced') return [fx(parts.ghost, { opacity: [1, 0] })];
  return [
    fx(parts.tip, {
      keyframes: {
        '0%': { translateX: 0, translateY: 0, rotate: 0, opacity: 1 },
        '25%': { translateX: 1, translateY: -1.2, rotate: -7 },
        '100%': { translateX: 9, translateY: 13, rotate: 32, opacity: 0 },
      },
      duration: 260,
      ease: CURVE.snap,
    }),
    fx(parts.base, {
      keyframes: { '0%': { opacity: 1 }, '65%': { opacity: 1 }, '100%': { opacity: 0.15 } },
      duration: 260,
      ease: CURVE.out,
    }),
    fx(parts.spark, { opacity: [1, 0], scale: [0.3, 1.35], duration: 180, ease: CURVE.out }),
  ];
}
