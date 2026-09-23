/**
 * The hover cards one window has open, as a stack: the row's own card, and a card for each
 * reference followed out of it (a Talent names an action, so the action's card opens beside the
 * Talent's). The pointer opens a card after a short rest, so a sweep down a list does not flash a
 * card per row, and closes it after a grace, so the pointer can travel from the row onto the card.
 * The keyboard opens and closes at once, because a focus is deliberate.
 */
import type { Anchor, DetailCard } from './detail.ts';

/** How long the pointer rests on a row before its card opens. */
export const HOVER_DELAY = 240;
/** How long a card stays after the pointer leaves, so it can be reached. */
export const HOVER_GRACE = 180;
/** A row's card, a card it names, and one more: past that a chain is no longer reading. */
export const MAX_DEPTH = 2;

export interface HoverLayer {
  depth: number;
  card: DetailCard;
  anchor: Anchor;
}

/**
 * A row on the Dossier file (`.wof-file-main`) stands beside the index tab column (`.itabs`),
 * outside the paper but still inside the window; `placeCard` reads this as the anchor's `maxRight`
 * so a card never opens over the tabs. Unset for a row anywhere else.
 */
const tabColumnLeft = (el: HTMLElement): number | undefined =>
  el.closest('.wof-file-main')?.querySelector<HTMLElement>('.itabs')?.getBoundingClientRect().left;

const boxOf = (el: HTMLElement): Anchor => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height, maxRight: tabColumnLeft(el) };
};

let seq = 0;

export class HoverCards {
  layers = $state.raw<HoverLayer[]>([]);
  /** This window's own id prefix: two open windows must not both hold "wof-detail-0". */
  readonly uid = `wof-detail-${++seq}`;
  /** The element each open layer belongs to: a re-render refreshes that layer and no other. */
  #owners: (HTMLElement | null)[] = [];
  #open = 0;
  #close = 0;

  /** Opens this row's card once the pointer has rested on it. */
  show(el: HTMLElement, card: DetailCard | null, depth = 0): void {
    this.#stopClose();
    this.#stopOpen();
    if (!card || depth > MAX_DEPTH) return;
    this.#open = window.setTimeout(() => this.open(el, card, depth), HOVER_DELAY);
  }

  /** Opens this row's card now, dropping any card opened past it. */
  open(el: HTMLElement, card: DetailCard | null, depth = 0): void {
    this.#stopOpen();
    this.#stopClose();
    if (!card || depth > MAX_DEPTH || !el.isConnected) return;
    this.#owners = [...this.#owners.slice(0, depth), el];
    this.layers = [...this.layers.slice(0, depth), { depth, card, anchor: boxOf(el) }];
  }

  /** The pointer is on an open card: it stays, and anything opened past it closes. */
  enter(depth: number): void {
    this.#stopClose();
    this.#stopOpen();
    this.#truncate(depth + 1);
  }

  /** The pointer has left: the card closes unless the pointer reaches it, or another row, in time. */
  leave(depth: number): void {
    this.#stopOpen();
    this.#stopClose();
    this.#close = window.setTimeout(() => this.#truncate(depth), HOVER_GRACE);
  }

  /** Re-reads the card of a row that has one open, after its window rebuilt its view. */
  refresh(el: HTMLElement, card: DetailCard | null, depth = 0): void {
    if (this.#owners[depth] === el && this.layers.length > depth) this.open(el, card, depth);
  }

  /** Closes every card at once: a click, a drag, a scroll, or the row leaving the page. */
  hide(): void {
    this.#stopOpen();
    this.#stopClose();
    this.#truncate(0);
  }

  #truncate(depth: number): void {
    if (this.layers.length <= depth) return;
    this.#owners = this.#owners.slice(0, depth);
    this.layers = this.layers.slice(0, depth);
  }

  #stopOpen(): void {
    window.clearTimeout(this.#open);
    this.#open = 0;
  }

  #stopClose(): void {
    window.clearTimeout(this.#close);
    this.#close = 0;
  }
}
