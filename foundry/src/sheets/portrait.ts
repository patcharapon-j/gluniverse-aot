/**
 * The character image on a sheet's plate (core-plan 2b): browse Foundry's files for one, upload a
 * new one straight from the viewer's disk (dropping a file on the plate does the same), put it on
 * the portrait, the prototype Token, or both, and put it back to the system default.
 *
 * The Token itself is handed to Phil's Token Studio where that module is installed, and to
 * Foundry's own prototype Token sheet where it is not.
 */
import { CORE_ACTOR_ICON, defaultArtwork } from '../art.ts';
import { SYSTEM_ID } from '../config.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export const TOKEN_STUDIO_ID = 'phils-token-studio';
/** Where Token Studio keeps the class that opens its editor (its own scripts/main.js imports this). */
export const TOKEN_STUDIO_ENTRY = `modules/${TOKEN_STUDIO_ID}/scripts/token-studio.js`;

export const PORTRAIT_FOLDER_SETTING = 'portraitFolder';

const FilePicker = () => foundry.applications.apps.FilePicker.implementation ?? foundry.applications.apps.FilePicker;

/** Which parts of an actor's art an image is written to. */
export interface ImageTargets {
  portrait?: boolean;
  token?: boolean;
}

export function tokenStudioActive(): boolean {
  return !!game.modules?.get(TOKEN_STUDIO_ID)?.active;
}

export function canUploadFiles(): boolean {
  return !!game.user?.can?.('FILES_UPLOAD');
}

/** A file name of the character's own, so two uploads for one soldier never overwrite each other. */
export function uploadName(actorName: string, fileName: string, now = Date.now()): string {
  const ext = (/\.([a-z0-9]+)$/i.exec(fileName)?.[1] ?? 'png').toLowerCase();
  const stem = (actorName || 'portrait')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${stem || 'portrait'}-${now}.${ext}`;
}

/** Where uploads go: the folder set in the preferences, else one of the world's own. */
export function uploadFolder(): string {
  let set = '';
  try {
    set = (game.settings.get(SYSTEM_ID, PORTRAIT_FOLDER_SETTING) as string) ?? '';
  } catch {
    set = '';
  }
  const folder = set.trim() || `worlds/${game.world?.id ?? 'world'}/${SYSTEM_ID}/portraits`;
  return folder.replace(/^\/+|\/+$/g, '');
}

/** Makes the upload folder and every folder above it, ignoring the ones already there. */
async function ensureFolder(path: string): Promise<void> {
  const FP = FilePicker();
  let sofar = '';
  for (const part of path.split('/').filter(Boolean)) {
    sofar = sofar ? `${sofar}/${part}` : part;
    try {
      await FP.browse('data', sofar);
    } catch {
      await FP.createDirectory('data', sofar, {}).catch(() => undefined);
    }
  }
}

/**
 * Uploads one image file to the portrait folder and gives back its path, or null when the viewer
 * may not upload, the file is not an image, or Foundry turns it down.
 */
export async function uploadImage(actor: any, file: File): Promise<string | null> {
  if (!file.type?.startsWith('image/')) {
    ui.notifications.warn(t('WOF.Sheet.portrait.notImage', { name: file.name }));
    return null;
  }
  if (!canUploadFiles()) {
    ui.notifications.warn(t('WOF.Sheet.portrait.noUpload'));
    return null;
  }
  const folder = uploadFolder();
  try {
    await ensureFolder(folder);
    const named = new File([file], uploadName(actor?.name ?? '', file.name), { type: file.type });
    const result = await FilePicker().upload('data', folder, named, {}, { notify: false });
    const path = typeof result === 'string' ? result : result?.path;
    if (!path) throw new Error(result?.message ?? 'upload refused');
    return path;
  } catch (error) {
    console.error(`${SYSTEM_ID} | portrait upload`, error);
    ui.notifications.error(t('WOF.Sheet.portrait.uploadFailed', { folder }));
    return null;
  }
}

/** Writes an image onto the actor's portrait, its prototype Token, or both. */
export async function applyImage(actor: any, src: string, targets: ImageTargets = { portrait: true }): Promise<void> {
  const update: Record<string, unknown> = {};
  if (targets.portrait) update.img = src;
  if (targets.token) update['prototypeToken.texture.src'] = src;
  if (!Object.keys(update).length) return;
  await actor.update(update);
}

/** Uploads a dropped or chosen file and saves it straight onto the actor. */
export async function saveUploadedImage(actor: any, file: File, targets: ImageTargets = { portrait: true }): Promise<string | null> {
  const path = await uploadImage(actor, file);
  if (!path) return null;
  await applyImage(actor, path, targets);
  ui.notifications.info(t('WOF.Sheet.portrait.uploaded', { name: actor.name }));
  return path;
}

/** Foundry's file browser, opened on the image the target already wears. */
export async function browseImage(actor: any, targets: ImageTargets = { portrait: true }): Promise<void> {
  const current = targets.portrait ? actor.img : actor.prototypeToken?.texture?.src;
  const picker = new (FilePicker())({
    type: 'image',
    current: current || undefined,
    redirectToRoot: [CORE_ACTOR_ICON],
    callback: (path: string) => applyImage(actor, path, targets),
  });
  if (typeof picker.browse === 'function') await picker.browse();
  else picker.render(true);
}

/** The image a fresh actor of this type and career would be given, or Foundry's placeholder. */
export function defaultImage(actor: any): string {
  const items = [...(actor?.items ?? [])].map((i: any) => ({ type: i.type, system: i.system }));
  return defaultArtwork({ type: actor?.type, system: actor?.system, items })?.img ?? CORE_ACTOR_ICON;
}

export function resetImage(actor: any, targets: ImageTargets = { portrait: true }): Promise<void> {
  return applyImage(actor, defaultImage(actor), targets);
}

/** Foundry's own prototype Token sheet, the fallback when Token Studio is not installed. */
export function openPrototypeToken(actor: any): void {
  const proto = actor?.prototypeToken;
  try {
    const sheet = proto?.sheet;
    if (sheet) {
      sheet.render(true);
      return;
    }
  } catch (error) {
    console.warn(`${SYSTEM_ID} | prototype Token sheet`, error);
  }
  new foundry.applications.sheets.PrototypeTokenConfig({ document: proto, actor }).render(true);
}

/**
 * Opens Phil's Token Studio on this actor. The module publishes no API, so the sheet loads the
 * same module file its own menu entry uses and opens the same window; anything short of that
 * (module absent, or a version that moved the file) falls back to Foundry's Token sheet.
 */
export async function openTokenStudio(actor: any): Promise<boolean> {
  if (!tokenStudioActive()) {
    ui.notifications.info(t('WOF.Sheet.portrait.studioMissing'));
    openPrototypeToken(actor);
    return false;
  }
  try {
    const url = foundry.utils?.getRoute?.(`/${TOKEN_STUDIO_ENTRY}`) ?? `/${TOKEN_STUDIO_ENTRY}`;
    const mod: any = await import(/* @vite-ignore */ url);
    const Studio = mod?.QuickTokenStudio ?? mod?.default;
    if (typeof Studio !== 'function') throw new Error('QuickTokenStudio is not exported');
    new Studio({ actor }).render(true);
    return true;
  } catch (error) {
    console.error(`${SYSTEM_ID} | Token Studio`, error);
    ui.notifications.warn(t('WOF.Sheet.portrait.studioFailed'));
    openPrototypeToken(actor);
    return false;
  }
}
