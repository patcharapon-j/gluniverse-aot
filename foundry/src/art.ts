/**
 * Where the shipped art lives (ADR-0027; foundry/design/asset-inventory.md; copied into static/assets
 * by tools/import-art.sh). Pure: no Foundry globals, so the pack build uses the same paths.
 */
export const SYSTEM_PATH = 'systems/wings-of-freedom';
export const ASSETS = `${SYSTEM_PATH}/assets`;

export const iconPath = (name: string) => `${ASSETS}/icons/${name}.webp`;

/** Foundry's own placeholder images, which a system default may replace. */
export const CORE_DEFAULT_IMGS = new Set(['icons/svg/mystery-man.svg', 'icons/svg/item-bag.svg', '', 'icons/svg/skull.svg', 'icons/svg/sword.svg']);

/** Every Action Catalog entry has its own stamp icon (style lock plus batch 1). */
export const actionIcon = (entryId: string) => iconPath(`action-${entryId}`);

/** An entry's stamp icon; a called roll on an attribute alone ("attribute-<id>") shows that attribute. */
export function entryIcon(entry: { id: string; attribute?: string | null }): string {
  return entry.id.startsWith('attribute-') && entry.attribute ? iconPath(`attr-${entry.attribute}`) : actionIcon(entry.id);
}

export const SPECIALTY_IDS = ['brawler', 'engineer', 'flier', 'hunter', 'leader', 'medic', 'rider', 'slayer', 'tactician'] as const;

/** The default Soldier and Squadmate portrait for a Specialty; null for an unknown id. */
export function specialtyPortrait(specialtyId: string | null | undefined): string | null {
  return specialtyId && (SPECIALTY_IDS as readonly string[]).includes(specialtyId) ? `${ASSETS}/portraits/portrait-${specialtyId}.webp` : null;
}

/** True when the image is one of the system's Specialty portraits (so a new Specialty may replace it). */
export function isSpecialtyPortrait(img: string | null | undefined): boolean {
  return !!img && img.startsWith(`${ASSETS}/portraits/portrait-`);
}

export const FOE_KINDS = ['bandit', 'military-police-trooper', 'garrison-sentry'] as const;

/** A Foe's plate by its row id; an unknown or custom kind takes the bandit's. */
export function foePlate(kind: string | null | undefined): string {
  const k = kind && (FOE_KINDS as readonly string[]).includes(kind) ? kind : 'bandit';
  return `${ASSETS}/plates/plate-foe-${k}.webp`;
}

/** A Titan's plate: the named Abnormal's own, or the standard plate of its Size Class. */
export function titanPlate(id: string, sizeClass: string): string {
  return `${ASSETS}/plates/plate-titan-${!id || id.startsWith('standard-') ? sizeClass : id}.webp`;
}

export const SETUP_BACKGROUND = `${ASSETS}/plates/setup-sortie-dawn.webp`;

export const GEAR_ICONS: Record<string, string> = {
  'odm-gear': 'gear-odm',
  'blade-set': 'gear-blades',
  'flintlock-pistol': 'gear-firearm',
  musket: 'gear-firearm',
  horse: 'gear-horse',
  'medical-kit': 'gear-medical-kit',
  'tool-kit': 'gear-medical-kit',
  'prosthetic-arm': 'gear-prosthetic',
  'prosthetic-leg': 'gear-prosthetic',
};
export const gearIcon = (itemId: string) => iconPath(GEAR_ICONS[itemId] ?? 'gear-odm');

/**
 * The token status effects (asset-inventory.md, batch-1 inventory): Down and Grabbed from the style
 * lock, eleven from batch 1. How each is bound to the actor's data is `statusBinding` in
 * src/rules/statuses.ts.
 */
export interface StatusDef {
  id: string;
  icon: string;
  /** Actor types whose Token HUD offers it. */
  types: string[];
}
const PC = ['soldier', 'squadmate'];
export const STATUSES: StatusDef[] = [
  { id: 'down', icon: 'status-down', types: PC },
  { id: 'untreated-injury', icon: 'status-untreated-injury', types: PC },
  { id: 'grabbed', icon: 'status-grabbed', types: PC },
  { id: 'pinned', icon: 'status-pinned', types: PC },
  { id: 'held', icon: 'status-held', types: [...PC, 'foe'] },
  { id: 'engaged', icon: 'status-engaged', types: [...PC, 'foe'] },
  { id: 'airborne', icon: 'status-airborne', types: PC },
  { id: 'jammed', icon: 'status-jammed', types: PC },
  { id: 'overloaded', icon: 'status-overloaded', types: PC },
  { id: 'mounted', icon: 'status-mounted', types: PC },
  { id: 'lame-horse', icon: 'status-lame-horse', types: PC },
  { id: 'carrying', icon: 'status-carrying', types: PC },
  { id: 'carried', icon: 'status-carried', types: PC },
];

/** Foundry's default actor image (CONST.DEFAULT_TOKEN is the same file). */
export const CORE_ACTOR_ICON = 'icons/svg/mystery-man.svg';

/** True for an image a system default may replace: Foundry's placeholders or a Specialty portrait. */
export function isReplaceableImg(img: string | null | undefined): boolean {
  return !img || CORE_DEFAULT_IMGS.has(img) || isSpecialtyPortrait(img);
}

/** A Titan token's round stamp by Size Class, or the Abnormal's. */
export function titanTokenIcon(sizeClass: string | undefined, abnormal: boolean | undefined): string {
  return iconPath(`titan-${abnormal ? 'abnormal' : (sizeClass ?? 'medium')}`);
}

/**
 * The default portrait and token image of a new actor (WofActor.getDefaultArtwork): a Soldier or
 * Squadmate takes its Specialty's portrait, a Foe its plate, a Titan its Size Class plate and stamp.
 */
export function defaultArtwork(data: { type?: string; system?: Record<string, any>; items?: { type?: string; system?: Record<string, any> }[] }): { img: string; texture: { src: string } } | null {
  const sys = data.system ?? {};
  switch (data.type) {
    case 'soldier':
    case 'squadmate': {
      const specialty = (data.items ?? []).find((i) => i.type === 'specialty');
      const img = specialtyPortrait(specialty?.system?.specialty_id);
      return img ? { img, texture: { src: img } } : null;
    }
    case 'foe': {
      const img = foePlate(sys.kind);
      return { img, texture: { src: img } };
    }
    case 'titan':
      return { img: titanPlate('', sys.size_class ?? 'medium'), texture: { src: titanTokenIcon(sys.size_class, sys.abnormal) } };
    default:
      return null;
  }
}
