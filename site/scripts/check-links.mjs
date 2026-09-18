#!/usr/bin/env node
// Internal link check (ADR-0020). Every href into the site must resolve to a built page,
// and every #anchor to an id on that page. Runs over dist/ after the build, and fails it:
// a dead deep link is a reader sent to the top of the wrong chapter mid-fight.
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const ASSET = /\.(webp|png|jpe?g|svg|xml|txt|json|js|css|ico|pdf|woff2?)$/;

const pages = new Map();
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    const html = await readFile(path, 'utf8');
    const route = '/' + relative(dist, path).replace(/index\.html$/, '').replace(/\.html$/, '/');
    pages.set(route, {
      ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
      links: [...html.matchAll(/href="(\/[^"#]*)?(#[^"]+)?"/g)]
        .map((m) => ({ path: m[1] ?? '', hash: (m[2] ?? '').slice(1) }))
        .filter((l) => l.path || l.hash),
    });
  }
}
await walk(dist);

const withSlash = (p) => (p === '' || p.endsWith('/') ? p : `${p}/`);
const problems = [];
for (const [route, page] of pages) {
  for (const link of page.links) {
    const target = link.path ? (pages.get(withSlash(link.path)) ?? pages.get(link.path)) : page;
    if (link.path && !target) {
      if (!ASSET.test(link.path)) problems.push(`${route} → ${link.path} (no such page)`);
      continue;
    }
    if (link.hash && target && !target.ids.has(decodeURIComponent(link.hash))) {
      problems.push(`${route} → ${link.path}#${link.hash} (no such anchor)`);
    }
  }
}

if (problems.length) {
  console.error(`[links] ${problems.length} broken link${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nFix the link, or give the target its id back.');
  process.exit(1);
}
console.log(`[links] ${pages.size} pages, every internal link and anchor resolves.`);
