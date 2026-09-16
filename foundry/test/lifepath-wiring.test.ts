/** The wizard's wiring that the browser alone would catch: pack ids for Finish, and every string it asks for. */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FOUNDRY_ROOT } from '../tools/data/load.ts';
import { buildPackDocs, type Lang } from '../tools/pack-docs.ts';
import { buildTestConfig, foundryWording, site, tables } from './wording-fixture.ts';

const lang = JSON.parse(readFileSync(join(FOUNDRY_ROOT, 'static/lang/en.json'), 'utf8')) as Lang;
const config = buildTestConfig();

describe('Finish takes Items from the compendia', () => {
  const docs = buildPackDocs(tables, lang, site, foundryWording, { systemVersion: '0.0.0-test' });
  it('knows the id of every Origin, Specialty, Talent, and gear entry', () => {
    for (const pack of ['origins', 'specialties', 'talents', 'gear'] as const) {
      const ids = new Set(docs[pack].map((d: any) => d._id));
      const keys = Object.entries(config.packIds[pack]);
      expect(keys.length).toBe(docs[pack].length);
      for (const [key, id] of keys) {
        expect(ids.has(id), `${pack}/${key}`).toBe(true);
        expect(docs[pack].find((d: any) => d._id === id)!.flags['wings-of-freedom'].sourceId).toBe(key);
      }
    }
    for (const g of ['odm-gear', 'blade-set', 'horse', 'medical-kit', 'tool-kit']) expect(config.packIds.gear[g]).toBeTruthy();
  });
});

describe('the wizard strings', () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.(ts|svelte)$/.test(f.name)) files.push(p);
    }
  };
  walk(join(FOUNDRY_ROOT, 'src/lifepath'));
  files.push(join(FOUNDRY_ROOT, 'src/sheets/components/LifepathBanner.svelte'), join(FOUNDRY_ROOT, 'src/settings-menu.ts'));
  const get = (key: string) => key.split('.').reduce<any>((o, k) => o?.[k], lang);

  it('finds every fixed key in the lang file', () => {
    const missing: string[] = [];
    for (const f of files) {
      for (const m of readFileSync(f, 'utf8').matchAll(/['"`](WOF\.[A-Za-z0-9_.-]+)['"`]/g)) {
        if (typeof get(m[1]) !== 'string') missing.push(`${m[1]} (${f.slice(FOUNDRY_ROOT.length)})`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('has the keys it builds from ids', () => {
    const L = (lang as any).WOF.Lifepath;
    for (const id of ['campaign', 'origin', 'enlist', 'year-1', 'year-2', 'year-3', 'exam', 'graduation', 'specialty', 'attributes', 'drive', 'stories', 'talents', 'merit', 'finish', 'squad']) expect(typeof L.step[id]).toBe('string');
    for (const st of ['done', 'ready', 'todo', 'blocked']) expect(typeof L.status[st]).toBe('string');
    for (const p of ['lifepath', 'template-build', 'free-build']) expect(typeof L.procedure[p].title).toBe('string');
    for (const p of ['none', 'lifepath', 'template-build', 'free-build']) expect(typeof L.lede[p]).toBe('string');
    for (const b of ['not-allowed', 'down', 'stress-one', 'already-pushed', 'nothing']) expect(typeof L.exam.block[b]).toBe('string');
    for (const x of config.lifepath.rules.built.shapes) expect(typeof L.attributes.shapeSub[x.id]).toBe('string');
    config.lifepath.campaignChoices.forEach((_, i) => expect(typeof (lang as any).WOF.Settings.campaignChoice[`option${i}`]).toBe('string'));
  });
});
