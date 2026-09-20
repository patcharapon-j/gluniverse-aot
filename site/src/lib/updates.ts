import { getCollection, type CollectionEntry } from 'astro:content';
import type { ChapterLink } from './chapters';
import type { IndexTab } from './nav';

export type Release = CollectionEntry<'updates'>;

/** Every release, newest first. */
export async function releases(): Promise<Release[]> {
  return (await getCollection('updates')).sort((a, b) => b.data.date.localeCompare(a.data.date));
}

/** "20 September 2026", the way the manual dates an order. */
export function issued(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function releaseTabs(entries: Release[]): IndexTab[] {
  return [{ href: '/updates/', label: 'All' }, ...entries.map((e) => ({ href: `/updates/${e.id}/`, label: e.data.tab }))];
}

export function releaseLink(entry: Release | undefined): ChapterLink | undefined {
  return entry ? { href: `/updates/${entry.id}/`, title: entry.data.title } : undefined;
}
