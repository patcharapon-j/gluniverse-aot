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
  { slug: 'talents', title: 'Talents', tab: 'Talents', summary: 'The trained abilities a soldier grows into, by Specialty and by the rolls they improve.', filed: true },
  { slug: 'actions', title: 'Actions', tab: 'Actions', summary: 'Every action, Reaction, and roll a soldier can make, the attribute it uses, and the Talents that add to it.', filed: true },
  { slug: 'specialties', title: 'Specialties', tab: 'Specialties', summary: 'The nine Specialties, each with its key attribute and its list of Talents.', filed: true },
  { slug: 'origins', title: 'Origins & Lifepath', tab: 'Origins', summary: 'Where your soldier comes from, why they enlisted, and the three Training Years before Graduation.', filed: true },
  { slug: 'gear', title: 'Gear', tab: 'Gear', summary: 'ODM Gear, Blade Sets, horses, and the kit a squad carries beyond the Walls.', filed: false },
  { slug: 'squad-tactics', title: 'Squad Tactics', tab: 'Tactics', summary: 'Drilled manoeuvres that let soldiers set up the cut for each other.', filed: false },
  { slug: 'scars', title: 'Scars', tab: 'Scars', summary: 'The lasting marks fear leaves on a soldier, and what each one changes.', filed: false },
  { slug: 'titans', title: 'Titans', tab: 'Titans', summary: 'Titans as your squad sees them: size, Tempo, Body Parts, and the Behavior Table.', filed: true },
];

export const COMPENDIUM_TABS: IndexTab[] = COMPENDIUM_SECTIONS.map((s) => ({ href: `/compendium/${s.slug}/`, label: s.tab }));

/** Filter chip options from each entry's list of named values, in the values' own order. */
export function tally(lists: { slug: string; name: string; order: number }[][]) {
  const found = new Map<string, { value: string; label: string; count: number; order: number }>();
  for (const list of lists) {
    for (const item of list) {
      const row = found.get(item.slug) ?? { value: item.slug, label: item.name, count: 0, order: item.order };
      row.count += 1;
      found.set(item.slug, row);
    }
  }
  return [...found.values()].sort((a, b) => a.order - b.order).map(({ value, label, count }) => ({ value, label, count }));
}
