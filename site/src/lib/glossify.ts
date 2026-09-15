/**
 * Glossary pop-ups for text that comes from the shared tables, such as Compendium card text.
 * Terms are found by the glossary's own spelling, case and all, and only the first use of each
 * term in one card is marked, so a filtered list still has a pop-up on every card it shows.
 */
import { GLOSSARY, getGlossaryEntry } from './glossary';

export type GlossSegment = string | { text: string; slug: string };

const startsLower = (s: string) => s.charAt(0) !== s.charAt(0).toUpperCase();

/** Every spelling of every term, mapped to its glossary slug. */
const FORMS = new Map<string, string>();
for (const entry of GLOSSARY) {
  const forms = [entry.term, ...entry.aliases];
  // A term with a lowercase alias ("base die") is also a term in lowercase prose ("base dice").
  if (entry.aliases.some(startsLower)) forms.push(entry.term.charAt(0).toLowerCase() + entry.term.slice(1));
  for (const form of forms) if (!FORMS.has(form)) FORMS.set(form, entry.slug);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Longest spellings first, so "Stress Dice" wins over "Stress" and "Nape Depth" over "Nape".
const PATTERN = new RegExp(
  `(?<![\\p{L}\\p{N}-])(?:${[...FORMS.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join('|')})(?![\\p{L}\\p{N}-])`,
  'gu',
);

/**
 * Returns a function that splits one card's texts into plain text and glossary terms. Call it
 * for each text in reading order; a term is marked only where the card first uses it.
 * `exclude` names terms never to mark, such as "Titan" on a page of Titans.
 */
export function glossifier(exclude: string[] = []): (text: string | null | undefined) => GlossSegment[] {
  const seen = new Set<string>();
  for (const term of exclude) {
    const entry = getGlossaryEntry(term);
    if (!entry) throw new Error(`glossifier: "${term}" has no glossary entry.`);
    seen.add(entry.slug);
  }

  return (text) => {
    if (!text) return [];
    const parts: GlossSegment[] = [];
    let last = 0;
    for (const match of text.matchAll(PATTERN)) {
      const slug = FORMS.get(match[0]);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const start = match.index ?? 0;
      if (start > last) parts.push(text.slice(last, start));
      parts.push({ text: match[0], slug });
      last = start + match[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };
}
