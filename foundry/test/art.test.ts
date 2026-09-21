import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { actionIcon, boardAssets, boardFx, boardPath, boardRim, boardSoldier, boardTile, boardTitan, boardTitanFigure, defaultArtwork, entryIcon, foePlate, isReplaceableImg, specialtyPortrait, STATUSES, tileVariant, titanPlate } from '../src/art.ts';
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

describe('engagement board art', () => {
  it('ships all 29 board assets and reads every one through boardPath', () => {
    const all = boardAssets();
    expect(all).toHaveLength(29);
    expect(new Set(all).size).toBe(29);
    for (const src of all) {
      expect(src).toMatch(/^systems\/wings-of-freedom\/assets\/board\/[a-z-]+(-\d)?\.webp$/);
      expect(shipped(src), src).toBe(true);
    }
    expect(boardTile('giant-forest', 2)).toBe(boardPath('hex-giant-forest-2'));
    expect(boardRim('urban')).toBe(boardPath('rim-urban'));
    expect(boardSoldier('hanging')).toBe(boardPath('soldier-hanging'));
    expect(boardFx('steam')).toBe(boardPath('fx-steam'));
  });

  it('fixes the tile variant by the zone number', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 13, 19].map(tileVariant)).toEqual([1, 2, 3, 1, 2, 3, 1, 1, 1]);
  });

  it('stands a Titan as its Abnormal figure where one ships, else its Size Class', () => {
    expect(boardTitanFigure('medium', 'sprinting-abnormal')).toBe(boardTitan('sprinting-abnormal'));
    expect(boardTitanFigure('large', 'standard-large')).toBe(boardTitan('large'));
    expect(boardTitanFigure(undefined, null)).toBe(boardTitan('medium'));
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
    expect(statusBinding('soldier', 'grabbed')).toEqual({ kind: 'engagement' });
    expect(statusBinding('soldier', 'held')).toEqual({ kind: 'engagement' });
    expect(boundStatuses('squadmate', {}, [], ['engaged', 'grabbed'])).toEqual(['grabbed', 'engaged']);
    expect(statusBinding('foe', 'engaged')).toEqual({ kind: 'manual' });
  });
});

describe('chat card die icons', () => {
  const t = (key: string, data?: Record<string, unknown>) => (data ? `${key}:${JSON.stringify(data)}` : key);

  it('draws a kind die with the same face art as its Dice So Nice die', async () => {
    const { dieIcon } = await import('../src/dice/card.ts');
    for (const p of KIND_PRESETS) {
      const kind = ({ db: 'base', dg: 'gear', ds: 'stress', dt: 'titan' } as const)[p.type];
      const { labels } = presetFaces(p);
      for (let face = 1; face <= 6; face++) {
        const html = dieIcon(t, kind, face);
        expect(html).toContain(p.colorset.background);
        if (p.faces[face]) expect(html).toContain(`href="${labels[face - 1]}"`);
        else expect(html).toMatch(new RegExp(`<text[^>]*>${face}</text>`));
        expect(html).toContain(`&quot;face&quot;:${face}}`);
      }
    }
    expect(dieIcon(t, 'gear', 1, { locked: true })).toMatch(/class="die gear miss one locked"/);
    expect(dieIcon(t, 'base', 3, { plain: true })).not.toContain('<image');
  });
});
