/**
 * DOM motion through anime.js v4, gated by the viewer's Motion setting (ADR-0027). Off does
 * nothing; Reduced keeps opacity and colour only and stays short; Full uses the tokens.
 */
import { animate } from 'animejs/animation';
import { stagger } from 'animejs/utils';
import { motionMode } from '../settings.svelte.ts';
import { MOTION } from './tokens.ts';

type Targets = Element | Element[] | NodeListOf<Element> | null | undefined;
type Params = Record<string, unknown>;

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

/** Track boxes being cleared: a small lift back onto the paper. */
export function inkOut(els: Element[]): void {
  fx(els, { scale: [0.86, 1], opacity: [0.55, 1], duration: MOTION.base, ease: MOTION.settle, delay: stagger(MOTION.stagger) });
}
