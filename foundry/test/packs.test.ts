import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FOUNDRY_ROOT, loadTables } from '../tools/data/load.ts';
import { buildPackDocs, PACKS, type Lang } from '../tools/pack-docs.ts';

const tables = loadTables();
const lang = JSON.parse(readFileSync(join(FOUNDRY_ROOT, 'static/lang/en.json'), 'utf8')) as Lang;
const system = JSON.parse(readFileSync(join(FOUNDRY_ROOT, 'static/system.json'), 'utf8'));
const docs = buildPackDocs(tables, lang, { systemVersion: '0.0.0-test' });
const all = Object.values(docs).flat();

describe('pack documents', () => {
  it('has one entry per table row', () => {
    expect(docs.talents).toHaveLength(tables.talents.talents.length);
    expect(docs.specialties).toHaveLength(tables.specialties.specialties.length);
    expect(docs.origins).toHaveLength(tables.origins.rows.length);
    expect(docs.gear).toHaveLength(tables.gearItems.items.length - 1); // the gas canister is an actor field
    expect(docs['critical-injuries']).toHaveLength(Object.values(tables.criticalInjuries.tables).reduce((n, x) => n + x.rows.length, 0));
    expect(docs.titans).toHaveLength(tables.titans.length);
    expect(docs.squadmates).toHaveLength(tables.squadmates.templates.length);
    expect(docs.foes).toHaveLength(tables.foes.foes.length);
  });

  it('declares every pack in system.json with its document type', () => {
    for (const p of PACKS) expect(system.packs).toContainEqual(expect.objectContaining({ name: p.name, type: p.type, path: `packs/${p.name}` }));
    expect(system.packs).toHaveLength(PACKS.length);
  });

  it('uses unique, stable, 16-character ids and matching keys', () => {
    const ids = new Set<string>();
    const check = (d: any, key: string) => {
      expect(d._id).toMatch(/^[A-Za-z0-9]{16}$/);
      expect(ids.has(d._id)).toBe(false);
      ids.add(d._id);
      expect(d._key).toBe(key);
    };
    for (const d of all) {
      const collection = d.type in lang.TYPES.Actor ? 'actors' : 'items';
      check(d, `!${collection}!${d._id}`);
      for (const e of d.items ?? []) check(e, `!actors.items!${d._id}.${e._id}`);
    }
    const again = buildPackDocs(tables, lang, { systemVersion: '0.0.0-test' });
    expect(again.talents.map((d) => d._id)).toEqual(docs.talents.map((d) => d._id));
  });

  it('only uses document types system.json declares', () => {
    for (const d of all) {
      const kind = d._key.startsWith('!actors') ? 'Actor' : 'Item';
      expect(Object.keys(system.documentTypes[kind])).toContain(d.type);
      for (const e of d.items ?? []) expect(Object.keys(system.documentTypes.Item)).toContain(e.type);
    }
  });

  it('gives each Squadmate its template Talent at level 1, its Specialty, and Standard Issue', () => {
    const slayer = docs.squadmates.find((d) => d.system.template === 'slayer')!;
    const talent = slayer.items.filter((i: any) => i.type === 'talent');
    expect(talent).toHaveLength(1);
    expect(talent[0].system).toMatchObject({ talent_id: 'clean-cut', level: 1 });
    expect(slayer.items.filter((i: any) => i.type === 'specialty')[0].system.specialty_id).toBe('slayer');
    const blades = slayer.items.filter((i: any) => i.system.subtype === 'blade-set');
    const row = tables.standardIssue.by_funding.find((r) => r.funding === tables.standardIssue.funding.until_funding_rules)!;
    expect(blades).toHaveLength(row.blade_sets);
    expect(blades.filter((b: any) => b.system.in_handles)).toHaveLength(1);
    expect(slayer.system.spare_canisters).toHaveLength(row.spare_canisters);
    const medic = docs.squadmates.find((d) => d.system.template === 'medic')!;
    expect(medic.items.some((i: any) => i.system.item_id === 'medical-kit')).toBe(true);
    expect(slayer.items.some((i: any) => i.system.subtype === 'kit')).toBe(false);
  });

  it('keeps the Titan stat blocks as the data writes them', () => {
    const medium = docs.titans.find((d) => d.flags['wings-of-freedom'].sourceId === 'standard-medium')!;
    expect(medium.system).toMatchObject({ size_class: 'medium', tempo: 1, nape_depth: 4, regeneration_clock: 3, heave: 3 });
    expect(medium.system.body_parts.map((b: any) => b.state)).toEqual(['intact', 'intact', 'intact', 'intact', 'intact']);
    expect(medium.system.behavior_table.entries.find((e: any) => e.id === 'bite').attack_dice).toBe(9);
  });

  it('gives each Actor type its prototype Token defaults and each Titan its plate', () => {
    for (const d of docs.titans) {
      expect(d.img).toMatch(/assets\/plates\/plate-titan-(small|medium|large|sprinting-abnormal)\.webp$/);
      expect(existsSync(join(FOUNDRY_ROOT, 'static', d.img.replace('systems/wings-of-freedom/', '')))).toBe(true);
      expect(d.prototypeToken).toMatchObject({ actorLink: false, disposition: -1, displayBars: 0, bar1: { attribute: null } });
    }
    const large = docs.titans.find((d) => d.system.size_class === 'large')!;
    expect(large.prototypeToken).toMatchObject({ width: 4, height: 4 });
    for (const d of [...docs.foes, ...docs.squadmates]) expect(d.prototypeToken.bar1).toEqual({ attribute: 'health_bar' });
    expect(docs.squadmates[0].prototypeToken).toMatchObject({ actorLink: true, disposition: 1 });
    expect(docs.foes[0].prototypeToken).toMatchObject({ actorLink: false, disposition: -1 });
  });

  it('records the row riders on each Critical Injury', () => {
    const torn = docs['critical-injuries'].find((d) => d.system.row === 'arm-torn-artery')!;
    expect(torn.system.type_riders.map((r: any) => r.injury_type).sort()).toEqual(['burn', 'burn', 'cut', 'pierce']);
    expect(torn.system.time_limit).toBe('engagement');
    const wrenched = docs['critical-injuries'].find((d) => d.system.row === 'arm-wrenched-shoulder')!;
    expect(wrenched.system.type_riders.map((r: any) => r.injury_type)).toEqual(['burn']);
  });

  it('writes descriptions from the site wording, with no references left in them', () => {
    const relentless = docs.talents.find((d) => d.system.talent_id === 'relentless')!;
    expect(relentless.system.trigger).toMatch(/^Your Nape strike falls short/);
    const odm = docs.gear.find((d) => d.system.item_id === 'odm-gear')!;
    expect(odm.system.description).toContain('gas-powered harness');
    for (const d of all) {
      const html = JSON.stringify([d.system.description, d.system.summary, d.system.who]);
      expect(html, d.name).not.toMatch(/data\/|\.yaml|ADR-|OQ-/);
    }
  });
});
