/**
 * The roll cards' motion (ADR-0027, the locked card in foundry/design/preview-v2-1-personnel-file.html).
 * A card that has just been posted deals its dice onto the paper, rings the ones that count, and
 * climbs its count; a Push drops only its new Stress Die and re-reads the count.
 *
 * Cards redraw for many reasons other than a new roll (an actor changed, a Cover was taken, the chat
 * log scrolled back), so a redraw is animated only when what the card shows has changed. `CardMotion`
 * holds that decision and is pure; `playCard` is the only part that touches the DOM.
 */
import { countUp, flash, fx, popMark, reveal, tumbleIn } from '../motion/fx.ts';
import { MOTION } from '../motion/tokens.ts';
import { motionMode } from '../settings.svelte.ts';
import type { Card } from './card.ts';

/** How old a card may be, in either direction, and still be dealt in: older ones are the backlog. */
export const FRESH_MS = 15000;
/** How long to wait for a card hidden behind the 3D dice before playing anyway. */
export const HIDDEN_WAIT_MS = 8000;

export type CardPlan = 'none' | 'enter' | 'update';

const faces = (x: unknown): string => (Array.isArray(x) ? x.join('') : '');

/** What the card shows, as one line: two renders with the same line look the same. */
export function cardSignature(c: Card): string {
  const a = c as Record<string, any>;
  const dice = a.dice ? [faces(a.dice.base), faces(a.dice.gear), faces(a.dice.stress)].join('/') : '';
  const rolled = [dice, faces(a.faces), faces(a.titan), faces(a.plain), faces(a.d66)].join('|');
  const rest = [
    c.kind,
    a.pushes ?? 0,
    a.fresh ?? -1,
    a.response ? `${a.response.d6}:${a.response.total}:${a.response.rerolled ? 1 : 0}` : '',
    a.severity ?? '',
    a.cover?.actor ?? '',
    a.shrugged ? 1 : 0,
    a.rolled ?? '',
    (a.reactions ?? []).map((r: { successes: number }) => r.successes).join('+'),
    (a.targets ?? []).length,
    c.ops.map((o) => o.state[0]).join(''),
  ].join(',');
  return `${rolled};${rest}`;
}

/** Which cards this client has drawn already, and what they showed when it last drew them. */
export class CardMotion {
  #seen = new Map<string, string>();
  #cap: number;

  constructor(cap = 200) {
    this.#cap = cap;
  }

  /**
   * What to play for this draw: nothing when the card is unchanged or came out of the backlog,
   * the full deal for a card just posted, the short beat for one that changed in place.
   */
  plan(id: string, signature: string, timestamp: number, now: number): CardPlan {
    const before = this.#seen.get(id);
    this.#remember(id, signature);
    if (before === signature) return 'none';
    if (before !== undefined) return 'update';
    return Math.abs(now - timestamp) <= FRESH_MS ? 'enter' : 'none';
  }

  #remember(id: string, signature: string): void {
    this.#seen.delete(id);
    this.#seen.set(id, signature);
    while (this.#seen.size > this.#cap) this.#seen.delete(this.#seen.keys().next().value as string);
  }
}

/**
 * Plays once the card is on screen. Dice So Nice hides a message until its 3D dice have landed, so
 * a card that is not laid out yet waits for its turn rather than playing to nobody.
 */
export function whenShown(el: HTMLElement, play: () => void, wait = HIDDEN_WAIT_MS, step = 120): void {
  const start = Date.now();
  const tick = () => {
    if (!el.isConnected) return;
    if (el.offsetParent !== null || Date.now() - start >= wait) play();
    else window.setTimeout(tick, step);
  };
  requestAnimationFrame(tick);
}

/**
 * Holds the dice off the paper until the deal runs, so a card kept back by the 3D dice does not
 * show its pool and then deal it again. `playCard` clears the mark, whether it animates or not.
 */
export function armCard(card: HTMLElement | null | undefined, plan: CardPlan): void {
  if (card && plan === 'enter' && motionMode() !== 'off') card.classList.add('wof-dealing');
}

/** When the last die of a pool has settled, for the beats that follow the deal. */
function landed(count: number): number {
  return Math.min(count, 14) * MOTION.stagger + MOTION.base;
}

/** Runs a card's motion. `enter` deals the whole card; `update` marks only what the change added. */
export function playCard(card: HTMLElement | null | undefined, plan: CardPlan): void {
  if (!card) return;
  card.classList.remove('wof-dealing');
  if (plan === 'none' || motionMode() === 'off') return;
  const all = <T extends Element>(sel: string) => [...card.querySelectorAll<T>(sel)];
  const big = card.querySelector<HTMLElement>('.result .big');

  if (plan === 'update') {
    const fresh = all('.die.fresh');
    if (fresh.length) tumbleIn(fresh);
    fx(big, { scale: [1.3, 1], duration: MOTION.weighty, ease: MOTION.settle });
    flash(card.querySelector('.applied'), MOTION.colors.notice);
    return;
  }

  reveal(card);
  const dice = all('.die');
  tumbleIn(dice);
  const beat = landed(dice.length);
  popMark(all('.die.hit'), beat);
  popMark(all('.die.one'), beat);
  fx(big, { scale: [1.6, 1], duration: MOTION.weighty, ease: MOTION.settle, delay: beat });
  countUp(big, beat);
  // A Titan's attack card lands red; a Stress Response or a Fear result comes in under it.
  if (card.classList.contains('titanic')) window.setTimeout(() => flash(card, MOTION.colors.harm), beat);
  fx(all('.sresp'), { opacity: [0, 1], translateX: [-8, 0], duration: MOTION.base, delay: beat + MOTION.quick });
}
