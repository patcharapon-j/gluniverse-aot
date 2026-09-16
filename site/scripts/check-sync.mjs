#!/usr/bin/env node
// Resync check (ADR-0020). Every rules and GM page records the chapters and tables it was
// written from, with each file's git blob sha at the time it was last synced. So does every
// Compendium wording file (src/content/compendium/*.yaml, under `sources`), and so does every
// page that is an Astro page rather than a content entry, through a `<page>.sources.yaml`
// sidecar beside it under src/pages (Learn to Play is one). This compares those shas with the
// files as they are now and prints a "needs resync" list.
// It only warns: it never fails the build. A Compendium row with no wording fails the build
// separately, in the loaders.

import { readdir, readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const siteDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(siteDir, '..');
const contentDir = join(siteDir, 'src', 'content');
const wordingDir = join(contentDir, 'compendium');
const pagesDir = join(siteDir, 'src', 'pages');

async function* walk(dir, pattern) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full, pattern);
    else if (pattern.test(entry.name)) yield full;
  }
}

function frontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  return match ? parse(match[1]) ?? {} : {};
}

const shaCache = new Map();
function blobSha(absPath) {
  if (!shaCache.has(absPath)) {
    shaCache.set(absPath, execFileSync('git', ['hash-object', absPath], { encoding: 'utf8' }).trim());
  }
  return shaCache.get(absPath);
}

async function main() {
  const stale = [];
  let pages = 0;
  let sources = 0;

  const files = [];
  for await (const file of walk(contentDir, /\.mdx?$/)) files.push({ file, read: (text) => frontmatter(text) });
  for await (const file of walk(wordingDir, /\.ya?ml$/)) files.push({ file, read: (text) => parse(text) ?? {} });
  // A page with no frontmatter of its own records its sources in a sidecar beside it.
  for await (const file of walk(pagesDir, /\.sources\.ya?ml$/)) {
    files.push({ file, read: (text) => parse(text) ?? {}, page: file.replace(/\.sources\.ya?ml$/, '.astro') });
  }

  for (const { file, read, page: pageFile } of files) {
    pages += 1;
    const page = relative(siteDir, pageFile ?? file);
    // A sidecar left behind by a renamed or deleted page would go on passing silently.
    if (pageFile) {
      try {
        await access(pageFile);
      } catch {
        stale.push({ page, source: relative(siteDir, file), reason: 'records sources for a page that no longer exists' });
        continue;
      }
    }
    let data;
    try {
      data = read(await readFile(file, 'utf8'));
    } catch (error) {
      stale.push({ page, source: '(sources)', reason: `could not be read: ${error.message}` });
      continue;
    }
    const list = Array.isArray(data.sources) ? data.sources : [];
    if (list.length === 0) {
      stale.push({ page, source: '(none)', reason: 'records no sources' });
      continue;
    }
    for (const source of list) {
      sources += 1;
      const abs = resolve(repoRoot, source.path);
      try {
        await access(abs);
      } catch {
        stale.push({ page, source: source.path, reason: 'source file no longer exists' });
        continue;
      }
      const current = blobSha(abs);
      if (current !== source.sha) {
        stale.push({ page, source: source.path, reason: `changed (synced ${String(source.sha).slice(0, 7)}, now ${current.slice(0, 7)})` });
      }
    }
  }

  if (stale.length === 0) {
    console.log(`[sync] ${pages} pages and wording files, ${sources} sources: all in sync.`);
    return;
  }

  const byPage = new Map();
  for (const item of stale) {
    if (!byPage.has(item.page)) byPage.set(item.page, []);
    byPage.get(item.page).push(item);
  }
  console.warn(`\n[sync] ${byPage.size} of ${pages} pages and wording files need resync:\n`);
  for (const [page, items] of byPage) {
    console.warn(`  ${page}`);
    for (const item of items) console.warn(`    - ${item.source}: ${item.reason}`);
  }
  console.warn('\n[sync] Update the page or wording, then record the new sha from `git hash-object <source>`.\n');
}

main().catch((error) => {
  console.warn(`[sync] Resync check skipped: ${error.message}`);
});
