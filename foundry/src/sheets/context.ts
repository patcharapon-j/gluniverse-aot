/** What every sheet component reads from its root: the sheet, its document, and the localizer. */
import { getContext, setContext } from 'svelte';
import type { HoverCards } from './hover.svelte.ts';
import type { SheetState } from './sheet-state.svelte.ts';
import type { SoldierView } from './soldier-view.ts';

export interface SheetContext<V = SoldierView> {
  sheet: any;
  /** The sheet's document (an Actor for actor sheets, an Item for item sheets). */
  actor: any;
  state: SheetState<V>;
  /** A unique id prefix for SVG ids and label targets inside this sheet. */
  uid: string;
}

const KEY = Symbol('wof-sheet');
const HOVER = Symbol('wof-hover');

export const setSheetContext = <V>(ctx: SheetContext<V>) => setContext(KEY, ctx);
export const sheetContext = <V = SoldierView>() => getContext<SheetContext<V>>(KEY);

/**
 * The hover cards of one window (hover.svelte.ts). Every root that shows detail cards holds one and
 * renders one <DetailCards>, so the sheets and the Lifepath wizard each have their own.
 */
export const setHoverCards = (cards: HoverCards) => setContext(HOVER, cards);
export const hoverCards = (): HoverCards => getContext<HoverCards>(HOVER);

/** Localize, or format when data is given. */
export function t(key: string, data?: Record<string, unknown>): string {
  return data ? game.i18n.format(key, data) : game.i18n.localize(key);
}
