/** What every Soldier sheet component reads from its root: the sheet, its actor, and the localizer. */
import { getContext, setContext } from 'svelte';
import type { SheetState } from './sheet-state.svelte.ts';
import type { SoldierView } from './soldier-view.ts';

export interface SheetContext {
  sheet: any;
  actor: any;
  state: SheetState<SoldierView>;
  /** A unique id prefix for SVG ids and label targets inside this sheet. */
  uid: string;
}

const KEY = Symbol('wof-sheet');

export const setSheetContext = (ctx: SheetContext) => setContext(KEY, ctx);
export const sheetContext = () => getContext<SheetContext>(KEY);

/** Localize, or format when data is given. */
export function t(key: string, data?: Record<string, unknown>): string {
  return data ? game.i18n.format(key, data) : game.i18n.localize(key);
}
