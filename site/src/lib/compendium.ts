import type { IndexTab } from './nav';

export interface CompendiumSection {
  slug: string;
  title: string;
  tab: string;
  summary: string;
  /** Sections filled from the shared tables today. The rest are page shells. */
  filed: boolean;
}

export const COMPENDIUM_SECTIONS: CompendiumSection[] = [
  { slug: 'talents', title: 'Talents', tab: 'Talents', summary: 'The practiced skills a soldier grows into, by Specialty and by the rolls they improve.', filed: true },
  { slug: 'actions', title: 'Actions', tab: 'Actions', summary: 'Every action, Reaction, and roll a soldier can make, and the attribute behind it.', filed: false },
  { slug: 'specialties', title: 'Specialties', tab: 'Specialties', summary: 'The nine Survey Corps specialties chosen at Graduation, each with its own Talent list.', filed: false },
  { slug: 'origins', title: 'Origins & Lifepath', tab: 'Origins', summary: 'Where your soldier comes from and the years that shaped them before they enlisted.', filed: false },
  { slug: 'gear', title: 'Gear', tab: 'Gear', summary: 'ODM Gear, Blade Sets, horses, and the kit a squad carries beyond the Walls.', filed: false },
  { slug: 'squad-tactics', title: 'Squad Tactics', tab: 'Tactics', summary: 'Drilled manoeuvres that let soldiers set up the cut for each other.', filed: false },
  { slug: 'scars', title: 'Scars', tab: 'Scars', summary: 'The lasting marks fear leaves on a soldier, and what each one changes.', filed: false },
  { slug: 'titans', title: 'Titans', tab: 'Titans', summary: 'Titans as your squad sees them: size, Tempo, Body Parts, and the Behavior Table.', filed: true },
];

export const COMPENDIUM_TABS: IndexTab[] = COMPENDIUM_SECTIONS.map((s) => ({ href: `/compendium/${s.slug}/`, label: s.tab }));
