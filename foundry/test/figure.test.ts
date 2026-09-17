import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ANATOMY, soldierFigure, titanFigure, type FigureInjury } from '../src/sheets/figure.ts';
import { SYSTEM_PATH } from '../src/art.ts';

const injury = (over: Partial<FigureInjury>): FigureInjury => ({
  id: 'i1',
  row: 'arm-gashed-forearm',
  label: 'Gashed Forearm',
  location: 'arm',
  side: 'right',
  type: 'cut',
  severity: 'minor',
  treated: false,
  ...over,
});

const onDisk = (href: string) => existsSync(resolve(__dirname, '../static', href.slice(SYSTEM_PATH.length + 1)));

describe('body figures', () => {
  it('uses the painted anatomy art the system ships', () => {
    for (const href of Object.values(ANATOMY)) expect(onDisk(href), href).toBe(true);
    const { svg } = soldierFigure([injury({})], 'u', 'aria');
    const hrefs = [...svg.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toContain(ANATOMY.cadet);
    expect(hrefs).toContain(ANATOMY.wounds);
    expect(svg).not.toContain('class="skin"');
  });

  it('pins each injury on its side, character right on the viewer left', () => {
    const { pins } = soldierFigure([injury({ id: 'a', side: 'right' }), injury({ id: 'b', side: 'left' })], 'u', 'aria');
    expect(pins.map((p) => p.n)).toEqual([1, 2]);
    expect(parseFloat(pins[0].left)).toBeLessThan(50);
    expect(parseFloat(pins[1].left)).toBeGreaterThan(50);
  });

  it('maps the WoF injury types to the atlas cells', () => {
    const cell = (type: FigureInjury['type']) => soldierFigure([injury({ type })], 'u', 'aria').svg.match(/decal-(\w+)" x="[^"]+" y="[^"]+" width="[^"]+" height="[^"]+" viewBox="(\d+) (\d+)/)!.slice(1);
    expect(cell('cut')).toEqual(['cutting', '0', '0']);
    expect(cell('pierce')).toEqual(['piercing', '627', '0']);
    expect(cell('bite')).toEqual(['piercing', '627', '0']);
    expect(cell('crush')).toEqual(['blunt', '0', '627']);
    expect(cell('burn')).toEqual(['burn', '627', '627']);
  });

  it('dresses treated wounds and cuts a lost limb to its stump', () => {
    const treated = soldierFigure([injury({ treated: true })], 'u', 'aria').svg;
    expect(treated).toContain('treatment-wrap');
    const bleeding = soldierFigure([injury({ row: 'arm-lost-arm', severity: 'crippling' })], 'u', 'aria').svg;
    expect(bleeding).toContain('class="piece lower lost"');
    expect(bleeding).toContain('stump bleeding');
    const dressed = soldierFigure([injury({ row: 'arm-lost-arm', severity: 'crippling', treated: true })], 'u', 'aria').svg;
    expect(dressed).toContain('stump dressed');
    const healed = soldierFigure([], 'u', 'aria', { healedLost: [{ location: 'leg', side: 'left' }] }).svg;
    expect(healed).toContain('data-stump="leftLeg"');
    expect(healed).toContain('stump healed');
  });

  it('marks a dead or Down soldier', () => {
    expect(soldierFigure([], 'u', 'aria', { dead: true }).svg).toMatch(/class="fig human dead"/);
    expect(soldierFigure([], 'u', 'aria', { down: true }).svg).toMatch(/class="fig human down"/);
  });

  it('paints the Titan and keeps its parts clickable', () => {
    const svg = titanFigure(
      [
        { index: 0, kind: 'eyes', side: null, state: 'broken' },
        { index: 1, kind: 'arm', side: 'left', state: 'wounded' },
        { index: 2, kind: 'leg', side: 'right', state: 'broken' },
      ],
      't',
      'aria',
      'Nape',
    );
    expect(svg).toContain(ANATOMY.titan);
    expect(svg).toContain('data-part="1"');
    expect(svg).toContain('class="lying"');
    expect(svg).toContain('class="nape"');
  });
});
