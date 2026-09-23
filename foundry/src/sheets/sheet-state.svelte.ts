import { SvelteSet } from 'svelte/reactivity';

/**
 * The card a band chip points at: a held Critical Injury (its item id) or a lasting Stress
 * Response (its index, as a string). `seq` changes on every click, so the same chip clicked twice
 * highlights its card twice.
 */
export interface Spotlight {
  kind: 'injury' | 'response';
  id: string;
  seq: number;
}

/** The reactive holder a mounted sheet reads; the ApplicationV2 shell replaces `view` on each render. */
export class SheetState<V> {
  view = $state.raw<V>() as V;
  tab = $state('');
  bonus = $state(0);
  /** The Talents open to their rules text, by item id: kept across re-renders and tab switches. */
  readonly openTalents = new SvelteSet<string>();
  /** The Wounds & Mind card to highlight on arrival; the tab clears it once it has. */
  spotlight = $state<Spotlight | null>(null);
  #seq = 0;

  constructor(view: V, tab = '') {
    this.view = view;
    this.tab = tab;
  }

  /** Opens Wounds & Mind on the card a band chip names. */
  spot(kind: Spotlight['kind'], id: string): void {
    this.spotlight = { kind, id, seq: ++this.#seq };
    this.tab = 'wounds';
  }
}
