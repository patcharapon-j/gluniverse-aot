import { getCollection, type CollectionEntry } from 'astro:content';
import { numeral, type IndexTab } from './nav';

export type Chapter = CollectionEntry<'rules'> | CollectionEntry<'gm'>;

export interface ChapterLink {
  href: string;
  title: string;
}

export async function guideChapters(): Promise<CollectionEntry<'rules'>[]> {
  return (await getCollection('rules')).sort((a, b) => a.data.order - b.data.order);
}

export async function gmChapters(): Promise<CollectionEntry<'gm'>[]> {
  return (await getCollection('gm')).sort((a, b) => a.data.order - b.data.order);
}

export function chapterTabs(entries: Chapter[], base: string): IndexTab[] {
  return entries.map((e, i) => ({ href: `${base}${e.id}/`, label: e.data.tab, numeral: numeral(i) }));
}

export function chapterLink(entry: Chapter | undefined, base: string): ChapterLink | undefined {
  return entry ? { href: `${base}${entry.id}/`, title: entry.data.title } : undefined;
}

export async function gmTabs(): Promise<IndexTab[]> {
  const chapters = await gmChapters();
  return [{ href: '/gm/', label: 'Briefing' }, ...chapterTabs(chapters, '/gm/'), { href: '/gm/titan-dossiers/', label: 'Dossiers' }];
}
