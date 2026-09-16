/**
 * Foundry-side player wording (foundry/wording/*.yaml): the few sentences the system shows that
 * neither the website nor the data tables word for players. Each entry names the source it was
 * written from. `entry` is a dot path into a data file (`list[id]` picks a list item by id); with no
 * entry the whole file is the source. The build checks every sentence with the website's guard and
 * warns, without failing, when a source changed after its sentence was written (the website's
 * resync check, scripts/check-sync.mjs, per entry).
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { FOUNDRY_ROOT, REPO_ROOT } from './load.ts';
import { blobSha } from './site-wording.ts';
import { checkPlayerText } from './wording.ts';

const from = z.strictObject({ path: z.string(), entry: z.string().optional(), sha: z.string().regex(/^[0-9a-f]{12,40}$/) });
const sentence = z.strictObject({ text: z.string(), from });
const statusesFile = z.strictObject({ statuses: z.record(z.string(), sentence) });
const titansFile = z.strictObject({
  figures: z.strictObject({ tempo: sentence, napeDepth: sentence, regeneration: sentence }),
  readWords: z.strictObject({ toughness: sentence, napeDepth: sentence, regeneration: sentence, attentionLadder: sentence }),
  readNote: sentence,
  unknown: sentence,
  toughnessByRead: sentence,
  fallback: sentence,
});

export const WORDING_FILES = {
  statuses: ['foundry/wording/statuses.yaml', statusesFile],
  titans: ['foundry/wording/titans.yaml', titansFile],
} as const;

type Sentence = z.infer<typeof sentence>;
type From = z.infer<typeof from>;

/** The node a dot path names; `name[id]` picks the list item whose id is `id`. */
function nodeAt(doc: unknown, entry: string, where: string): unknown {
  let node: any = doc;
  for (const part of entry.split('.')) {
    const m = /^([\w-]+)(?:\[([\w-]+)\])?$/.exec(part);
    if (!m) throw new Error(`${where}: the entry path "${entry}" cannot be read.`);
    node = node?.[m[1]];
    if (m[2] !== undefined) node = Array.isArray(node) ? node.find((x: any) => x?.id === m[2]) : undefined;
    if (node === undefined) throw new Error(`${where}: the source entry "${entry}" no longer exists. Rewrite the sentence from its new source.`);
  }
  return node;
}

/** The sha a sentence records: an entry's canonical JSON hash (12 hex), or the file's git blob sha. */
export function sourceSha(src: Pick<From, 'path' | 'entry'>, where = src.path): string {
  if (!src.entry) return blobSha(src.path);
  const doc = parse(readFileSync(resolve(REPO_ROOT, src.path), 'utf8'));
  return createHash('sha1').update(JSON.stringify(nodeAt(doc, src.entry, where))).digest('hex').slice(0, 12);
}

/** A resync line when the source changed after the sentence was written; null when it did not. */
export function staleLine(where: string, src: From): string | null {
  const now = sourceSha(src, where);
  if (now.startsWith(src.sha) || src.sha.startsWith(now)) return null;
  return `${where}: ${src.path}${src.entry ? ` (${src.entry})` : ''} changed (written at ${src.sha.slice(0, 12)}, now ${now.slice(0, 12)})`;
}

export interface FoundryWording {
  statuses: Record<string, string>;
  titans: {
    figures: { tempo: string; napeDepth: string; regeneration: string };
    readWords: Record<'toughness' | 'napeDepth' | 'regeneration' | 'attentionLadder', string>;
    readNote: string;
    unknown: string;
    toughnessByRead: string;
    fallback: string;
  };
  /** One line per sentence whose source changed since it was written. */
  stale: string[];
  /** Every sentence, by file and key, for the audit. */
  entries: { file: string; key: string; text: string }[];
}

let cached: FoundryWording | null = null;

/** Loads the Foundry wording, once per process unless `fresh` (watch mode) asks again. */
export function loadFoundryWording(opts: { fresh?: boolean } = {}): FoundryWording {
  if (cached && !opts.fresh) return cached;
  const stale: string[] = [];
  const entries: FoundryWording['entries'] = [];
  const read = <T extends z.ZodType>(file: string, schema: T): z.infer<T> => {
    const parsed = schema.safeParse(parse(readFileSync(resolve(REPO_ROOT, file), 'utf8')));
    if (!parsed.success) throw new Error(`${file} does not match its shape:\n  ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n  ')}`);
    return parsed.data;
  };
  const take = (file: string, key: string, s: Sentence): string => {
    const where = `${file} (${key})`;
    const text = checkPlayerText(`The sentence "${key}"`, s.text, new Set(), `Reword it in ${file}.`);
    const line = staleLine(where, s.from);
    if (line) stale.push(line);
    entries.push({ file, key, text });
    return text;
  };
  const [sPath, sSchema] = WORDING_FILES.statuses;
  const st = read(sPath, sSchema);
  const [tPath, tSchema] = WORDING_FILES.titans;
  const ti = read(tPath, tSchema);
  const map = <K extends string>(file: string, prefix: string, rec: Record<K, Sentence>) =>
    Object.fromEntries(Object.entries<Sentence>(rec).map(([k, v]) => [k, take(file, `${prefix}${k}`, v)])) as Record<K, string>;
  cached = {
    statuses: map(sPath, 'statuses.', st.statuses),
    titans: {
      figures: map(tPath, 'figures.', ti.figures),
      readWords: map(tPath, 'readWords.', ti.readWords),
      readNote: take(tPath, 'readNote', ti.readNote),
      unknown: take(tPath, 'unknown', ti.unknown),
      toughnessByRead: take(tPath, 'toughnessByRead', ti.toughnessByRead),
      fallback: take(tPath, 'fallback', ti.fallback),
    },
    stale,
    entries,
  };
  return cached;
}

/** Prints the resync list; used by the pack build and the Vite plugin. */
export function warnStale(w: FoundryWording, log: (msg: string) => void = console.warn): void {
  if (!w.stale.length) return;
  log(`[wording] ${w.stale.length} Foundry wording ${w.stale.length === 1 ? 'entry needs' : 'entries need'} resync:\n  ${w.stale.join('\n  ')}\n  Check each sentence against its source, then record the new sha.`);
}

export const WORDING_DIR = resolve(FOUNDRY_ROOT, 'wording');
