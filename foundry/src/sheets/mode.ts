/**
 * Edit mode and Play mode (core-plan 2b). A sheet is either open for amendment, where the core of a
 * character -- its name, attributes, career and record -- may be rewritten, or closed for play,
 * where only what moves in the field does: health, stress, gas, blades, wounds, kit and notes.
 *
 * The choice is a client setting per actor, so one player switching to Edit never touches the world
 * or what anybody else sees.
 */
import { SYSTEM_ID } from '../config.ts';

export type SheetMode = 'edit' | 'play';

export const MODE_SETTING = 'sheetModes';

/** The Item types a built character carries; a file holding none of them is still blank. */
export const BUILD_ITEM_TYPES = ['origin', 'specialty', 'talent'] as const;

export const isMode = (value: unknown): value is SheetMode => value === 'edit' || value === 'play';

/**
 * The mode a sheet opens in: the one this viewer last left it in, and failing that Edit while the
 * file is still blank (a new soldier the Lifepath has not written yet), Play once it holds a career.
 */
export function chooseMode(stored: unknown, blank: boolean): SheetMode {
  if (isMode(stored)) return stored;
  return blank ? 'edit' : 'play';
}

/** True while the actor carries none of the Items a built character has. */
export function isBlankFile(actor: { items?: Iterable<{ type?: string }> } | null | undefined): boolean {
  const types = BUILD_ITEM_TYPES as readonly string[];
  return ![...(actor?.items ?? [])].some((i) => types.includes(i?.type ?? ''));
}

/** Every remembered choice, by actor id; an unreadable setting reads as none remembered. */
export function storedModes(): Record<string, SheetMode> {
  try {
    const stored = game.settings.get(SYSTEM_ID, MODE_SETTING) as Record<string, SheetMode> | null;
    return stored && typeof stored === 'object' ? stored : {};
  } catch {
    return {};
  }
}

export function initialMode(actor: any): SheetMode {
  return chooseMode(storedModes()[actor?.id], isBlankFile(actor));
}

/**
 * Remembers the viewer's choice for this actor. A choice that matches what the actor would open in
 * anyway is dropped instead of stored, so the setting keeps only the sheets actually switched.
 */
export function rememberMode(actor: any, mode: SheetMode): Promise<unknown> {
  const modes = { ...storedModes() };
  if (mode === chooseMode(undefined, isBlankFile(actor))) delete modes[actor.id];
  else modes[actor.id] = mode;
  return game.settings.set(SYSTEM_ID, MODE_SETTING, modes);
}
