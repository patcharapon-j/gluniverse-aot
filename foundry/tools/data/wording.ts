/**
 * The website's guard on player-facing text (site/src/lib/player-text.ts), reused as is and applied
 * to every string a pack or a sheet shows: no file paths, section numbers, design vocabulary, table
 * field names, internal ids, or em dashes (ADR-0020). A failure names the entry and where the
 * wording belongs.
 */
import { checkPlayerText as siteCheck, hyphenatedIds } from '../../../site/src/lib/player-text.ts';

export { hyphenatedIds };

export class WordingError extends Error {
  override name = 'WordingError';
}

/** Returns the text with whitespace collapsed, or throws if it is not written for players. */
export function checkPlayerText(where: string, text: string, ids: ReadonlySet<string>, fix: string): string {
  try {
    return siteCheck(where, text, ids, fix);
  } catch (err) {
    throw new WordingError((err as Error).message);
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Fills {name} placeholders the way game.i18n.format does. */
export function format(template: string, data: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (m, k: string) => (k in data ? String(data[k]) : m));
}

/** The text a reader sees in an HTML string: tags dropped, entities decoded. */
export function visibleText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
