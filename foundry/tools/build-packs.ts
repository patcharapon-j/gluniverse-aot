/**
 * Builds the compendium packs (ADR-0025): validates data/, builds the documents, writes them as
 * JSON sources to build/packs-src/<pack>/, and compiles each into LevelDB at dist/packs/<pack>
 * with @foundryvtt/foundryvtt-cli. Close any world that uses the system first: a running world
 * holds a lock on its packs.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { compilePack } from '@foundryvtt/foundryvtt-cli';
import { FOUNDRY_ROOT, loadTables } from './data/load.ts';
import { buildPackDocs, PACKS, type Lang } from './pack-docs.ts';

const SRC = join(FOUNDRY_ROOT, 'build', 'packs-src');
const OUT = join(FOUNDRY_ROOT, 'dist', 'packs');

const system = JSON.parse(readFileSync(join(FOUNDRY_ROOT, 'static', 'system.json'), 'utf8')) as { version: string; packs: { name: string; type: string }[] };
const lang = JSON.parse(readFileSync(join(FOUNDRY_ROOT, 'static', 'lang', 'en.json'), 'utf8')) as Lang;

for (const pack of PACKS) {
  const declared = system.packs.find((x) => x.name === pack.name);
  if (!declared || declared.type !== pack.type) throw new Error(`static/system.json does not declare the ${pack.type} pack "${pack.name}".`);
}

const docs = buildPackDocs(loadTables(), lang, { systemVersion: system.version });

rmSync(SRC, { recursive: true, force: true });
rmSync(OUT, { recursive: true, force: true });
for (const { name } of PACKS) {
  const dir = join(SRC, name);
  mkdirSync(dir, { recursive: true });
  for (const doc of docs[name]) {
    const file = `${doc.flags['wings-of-freedom'].sourceId}_${doc._id}.json`;
    writeFileSync(join(dir, file), JSON.stringify(doc, null, 2) + '\n');
  }
  await compilePack(dir, join(OUT, name), { recursive: false });
  console.log(`packs/${name}: ${docs[name].length} entries`);
}
