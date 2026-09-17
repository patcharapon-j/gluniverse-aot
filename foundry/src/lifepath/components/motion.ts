/**
 * The wizard's motion (ADR-0027): the shared tokens through fx.ts, so Reduced keeps colour and opacity
 * only and Off shows the end state.
 */
import { stagger } from 'animejs/utils';
import { fx } from '../../motion/fx.ts';
import { MOTION } from '../../motion/tokens.ts';

/** A stamp coming down on the paper. */
export function stampDown(el: Element | null | undefined): void {
  fx(el, { scale: [1.9, 1], opacity: [0, 0.9], rotate: [-18, -6], duration: MOTION.weighty, ease: MOTION.settle });
}

/** Svelte action: a stamp lands when it appears. */
export function settle(node: HTMLElement): void {
  stampDown(node);
}

/** Svelte action: dice tumble into place, staggered. */
export function tumble(node: HTMLElement): void {
  fx(node.querySelectorAll('.die'), { opacity: [0, 1], rotate: [-90, 0], scale: [0.4, 1], duration: MOTION.base, ease: MOTION.settle, delay: stagger(MOTION.stagger) });
}

/** Svelte action: a slip slides in when it appears. */
export function slideIn(node: HTMLElement): void {
  fx(node, { opacity: [0, 1], translateY: [8, 0], duration: MOTION.base });
}
