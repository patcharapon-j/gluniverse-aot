/**
 * The site's guard on player-facing text (site/src/lib/player-text.ts), applied to every string a
 * pack shows: no file paths, section numbers, design vocabulary, table field names, internal ids,
 * or em dashes (ADR-0020). A failure names the entry and where the wording belongs.
 */
const EM_DASH = String.fromCharCode(0x2014);

const PATTERNS: [RegExp, string][] = [
  [/\b[\w-]+\/[\w./-]+/, 'a file path'],
  [/\.ya?ml\b/i, 'a file name'],
  [/\b(?:chapter|section)\s+\d/i, 'a section number'],
  [/\bADR\b|\bADR-\d|\bOQ-\d|\bdecision batch\b/i, 'a design decision'],
  [/\b[a-z]+_[a-z_]+\b/, 'a table field name'],
  [/\b(?:playtest|provisional|dormant|reserved|schema|probe|simulat\w*|monte carlo|tracked values?|catalog id|row id|data|flags?)\b/i, 'a design word'],
  [new RegExp(EM_DASH), 'an em dash'],
];

/** Ids that read as ids: they contain a hyphen and differ from their own name in lower case. */
export function hyphenatedIds(entries: Iterable<{ id: string; name: string }>): Set<string> {
  return new Set([...entries].filter((e) => e.id.includes('-') && e.id !== e.name.toLowerCase()).map((e) => e.id));
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class WordingError extends Error {
  override name = 'WordingError';
}

/** Returns the text with whitespace collapsed, or throws if it is not written for players. */
export function checkPlayerText(where: string, text: string, ids: ReadonlySet<string>, fix: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) throw new WordingError(`${where} is empty. ${fix}`);
  for (const [pattern, what] of PATTERNS) {
    const found = pattern.exec(clean);
    if (found) throw new WordingError(`${where} contains ${what} ("${found[0]}"), which never goes on a page. ${fix}`);
  }
  for (const id of ids) {
    if (new RegExp(`(^|[^A-Za-z-])${escapeRe(id)}($|[^A-Za-z-])`).test(clean)) {
      throw new WordingError(`${where} contains the internal id "${id}", which never goes on a page. ${fix}`);
    }
  }
  return clean;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Fills {name} placeholders the way game.i18n.format does. */
export function format(template: string, data: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (m, k: string) => (k in data ? String(data[k]) : m));
}
