export type SectionKey = 'home' | 'learn' | 'guide' | 'compendium' | 'gm' | 'reference' | 'updates';

export interface NavItem {
  key: SectionKey;
  href: string;
  label: string;
}

/** The masthead. This is the only place a player page links into the GM's Guide. */
export const MAIN_NAV: NavItem[] = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'learn', href: '/learn/', label: 'Learn to Play' },
  { key: 'guide', href: '/guide/', label: "Player's Guide" },
  { key: 'compendium', href: '/compendium/', label: 'Compendium' },
  { key: 'gm', href: '/gm/', label: "GM's Guide" },
  { key: 'reference', href: '/reference/', label: 'Reference' },
  { key: 'updates', href: '/updates/', label: 'Updates' },
];

export interface IndexTab {
  href: string;
  label: string;
  numeral?: string;
}

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export function numeral(index: number): string {
  return NUMERALS[index] ?? String(index + 1);
}

export const REFERENCE_TABS: IndexTab[] = [
  { href: '/reference/glossary/', label: 'Glossary' },
  { href: '/reference/quick-reference/', label: 'Quick Ref' },
  { href: '/reference/dice-tray/', label: 'Dice Tray' },
];

/** Normalises a path to always end with a slash, so tabs compare cleanly. */
export function withSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}
