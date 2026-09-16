import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { actionIcon, defaultArtwork, entryIcon, foePlate, isReplaceableImg, specialtyPortrait, STATUSES, titanPlate } from '../src/art.ts';
import { KIND_PRESETS, presetFaces, TEXTURES } from '../src/dice/dsn.ts';
import { boundStatuses, statusBinding } from '../src/rules/statuses.ts';
import { FOUNDRY_ROOT, loadTables } from '../tools/data/load.ts';

const shipped = (src: string) => existsSync(join(FOUNDRY_ROOT, 'static', src.replace('systems/wings-of-freedom/', '')));
const tables = loadTables();

describe('shipped art', () => {
  it('has a stamp icon for every Action Catalog entry', () => {
    for (const e of tables.actionCatalog.entries) expect(shipped(actionIcon(e.id)), e.id).toBe(true);
    expect(entryIcon({ id: 'attribute-wits', attribute: 'wits' })).toMatch(/attr-wits\.webp$/);
  });

  it('has a portrait per Specialty and a plate per Foe', () => {
    for (const s of tables.specialties.specialties) expect(shipped(specialtyPortrait(s.id)!), s.id).toBe(true);
    for (const f of tables.foes.foes) expect(shipped(foePlate(f.id)), f.id).toBe(true);
    expect(foePlate('someone-new')).toBe(foePlate('bandit'));
    expect(shipped(titanPlate('', 'small'))).toBe(true);
  });

  it('has the thirteen token status icons', () => {
    expect(STATUSES).toHaveLength(13);
    for (const s of STATUSES) expect(shipped(`assets/icons/${s.icon}.webp`), s.id).toBe(true);
  });

  it('picks default artwork by actor type', () => {
    expect(defaultArtwork({ type: 'soldier', items: [] })).toBeNull();
    expect(defaultArtwork({ type: 'squadmate', items: [{ type: 'specialty', system: { specialty_id: 'medic' } }] })?.img).toMatch(/portrait-medic\.webp$/);
    expect(defaultArtwork({ type: 'foe', system: { kind: 'garrison-sentry' } })?.img).toMatch(/plate-foe-garrison-sentry\.webp$/);
    const titan = defaultArtwork({ type: 'titan', system: { size_class: 'large' } })!;
    expect(titan.img).toMatch(/plate-titan-large\.webp$/);
    expect(titan.texture.src).toMatch(/icons\/titan-large\.webp$/);
    expect(isReplaceableImg('icons/svg/mystery-man.svg')).toBe(true);
    expect(isReplaceableImg(specialtyPortrait('rider'))).toBe(true);
    expect(isReplaceableImg('worlds/x/me.webp')).toBe(false);
  });
});

describe('Dice So Nice presets', () => {
  it('registers the four die kinds with six labels and six bump maps each, all shipped', () => {
    expect(KIND_PRESETS.map((p) => p.type)).toEqual(['db', 'dg', 'ds', 'dt']);
    for (const p of KIND_PRESETS) {
      const { labels, bumpMaps } = presetFaces(p);
      expect(labels).toHaveLength(6);
      expect(bumpMaps).toHaveLength(6);
      for (const f of [...labels, ...bumpMaps]) expect(shipped(f), f).toBe(true);
    }
    for (const t of Object.values(TEXTURES)) expect(shipped(t.source) && shipped(t.bump)).toBe(true);
  });

  it('marks only the faces with a rules effect (asset-inventory.md)', () => {
    const marked = (type: string) => Object.keys(KIND_PRESETS.find((p) => p.type === type)!.faces).map(Number);
    expect(marked('db')).toEqual([6]);
    expect(marked('dg')).toEqual([1, 6]);
    expect(marked('ds')).toEqual([1, 6]);
    expect(marked('dt')).toEqual([5, 6]);
    const titan = presetFaces(KIND_PRESETS.find((p) => p.type === 'dt')!);
    expect(titan.labels.filter((l) => l.includes('fang'))).toHaveLength(2);
    expect(KIND_PRESETS.map((p) => [p.colorset.name, p.colorset.background, p.colorset.material, p.colorset.texture])).toEqual([
      ['wof-bone', '#EDE6D2', 'plastic', 'wof-bone'],
      ['wof-gunmetal', '#56605F', 'metal', 'none'],
      ['wof-wax', '#8B2A21', 'pristine', 'none'],
      ['wof-flesh', '#D9B7A0', 'pristine', 'wof-flesh'],
    ]);
  });

  it('uses the DiceTerm denominations as preset types', async () => {
    const { DENOMINATIONS } = await import('../src/dice/terms.ts');
    expect(Object.values(DENOMINATIONS).map((d) => `d${d}`)).toEqual(KIND_PRESETS.map((p) => p.type));
  });
});

describe('token statuses bound to the model', () => {
  const injury = (treated: boolean) => ({ type: 'critical-injury', system: { treated } });
  const horse = (mounted: boolean) => ({ type: 'gear', system: { subtype: 'horse', mounted } });

  it('reads the recorded and derived states of a soldier', () => {
    expect(boundStatuses('soldier', {}, [])).toEqual([]);
    expect(
      boundStatuses(
        'soldier',
        { down: true, pinned: { active: true }, airborne: true, carrying: 'a', carried_by: 'b', derived: { jammed: true, overloaded: true, lame: true } },
        [injury(false), horse(true)],
      ),
    ).toEqual(['down', 'untreated-injury', 'pinned', 'airborne', 'jammed', 'overloaded', 'mounted', 'lame-horse', 'carrying', 'carried']);
    expect(boundStatuses('squadmate', {}, [injury(true), horse(false)])).toEqual([]);
    expect(boundStatuses('foe', { held: true }, [])).toEqual(['held']);
    expect(boundStatuses('titan', { down: true }, [])).toEqual([]);
  });

  it('toggles fields, refuses derived states, and leaves the rest to Active Effects', () => {
    expect(statusBinding('soldier', 'down')).toEqual({ kind: 'field', path: 'system.down' });
    expect(statusBinding('squadmate', 'pinned')).toEqual({ kind: 'field', path: 'system.pinned.active' });
    expect(statusBinding('foe', 'held')).toEqual({ kind: 'field', path: 'system.held' });
    expect(statusBinding('soldier', 'jammed')).toEqual({ kind: 'derived' });
    expect(statusBinding('soldier', 'grabbed')).toEqual({ kind: 'manual' });
    expect(statusBinding('soldier', 'held')).toEqual({ kind: 'manual' });
    expect(statusBinding('foe', 'engaged')).toEqual({ kind: 'manual' });
  });
});
