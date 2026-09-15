/**
 * Guards every sentence a Compendium page shows. Text that still carries a file path, a section
 * number, design vocabulary, or an internal id fails the build, and the error says where the
 * player wording belongs, so nothing written for the design drafts reaches a page.
 */

const PATTERNS: [RegExp, string][] = [
  [/\b[\w-]+\/[\w./-]+/, 'a file path'],
  [/\.ya?ml\b/i, 'a file name'],
  [/\b(?:chapter|section)\s+\d/i, 'a section number'],
  [/\bADR\b|\bADR-\d|\bOQ-\d|\bdecision batch\b/i, 'a design decision'],
  [/\b[a-z]+_[a-z_]+\b/, 'a table field name'],
  [/\b(?:playtest|provisional|dormant|reserved|schema|probe|simulat\w*|monte carlo|tracked values?|catalog id|row id|data|flags?)\b/i, 'a design word'],
  [/—/, 'an em dash'],
];

/**
 * The ids that read as ids: they contain a hyphen and differ from their own name in lower case.
 * `treat-injury` ("Treat Injury") is one; `hand-to-hand` ("Hand-to-Hand") is also plain English.
 */
export function hyphenatedIds(entries: Iterable<{ id: string; name: string }>): Set<string> {
  return new Set([...entries].filter((e) => e.id.includes('-') && e.id !== e.name.toLowerCase()).map((e) => e.id));
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Returns the text with its whitespace collapsed, or throws if it is not written for players.
 * `where` names the entry; `fix` tells the reader where the player wording belongs.
 */
export function checkPlayerText(where: string, text: string, ids: ReadonlySet<string>, fix: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) throw new Error(`${where} is empty. ${fix}`);
  for (const [pattern, what] of PATTERNS) {
    const found = pattern.exec(clean);
    if (found) throw new Error(`${where} contains ${what} ("${found[0]}"), which never goes on a page. ${fix}`);
  }
  for (const id of ids) {
    if (new RegExp(`(^|[^A-Za-z-])${escape(id)}($|[^A-Za-z-])`).test(clean)) {
      throw new Error(`${where} contains the internal id "${id}", which never goes on a page. ${fix}`);
    }
  }
  return clean;
}
