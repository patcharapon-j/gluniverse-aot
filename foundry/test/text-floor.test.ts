/**
 * The Dossier's text floor (sheet-overhaul plan, section 4 and 8): no text under 10px in the new
 * dossier and instrument stylesheets, and the DRY, EMPTY and stored-count numbers over the
 * instrument drawings are HTML stamps at `--t-xs`, not SVG `<text>`, so this floor actually holds
 * for them.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FOUNDRY_ROOT } from '../tools/data/load.ts';

const DOSSIER_STYLES = ['instrument.css', 'dossier.css', 'dossier-soldier.css', 'dossier-kit.css', 'dossier-wounds.css', 'dossier-record.css'];

const FLOOR = 10;

/** Every literal px size a `font` or `font-size` declaration sets, wherever it sits in the value. */
function pxFontSizes(css: string): number[] {
  const sizes: number[] = [];
  for (const m of css.matchAll(/font-size\s*:\s*(-?\d+(?:\.\d+)?)px/g)) sizes.push(Number(m[1]));
  // The `font` shorthand's size is the px token right before an optional `/line-height` or the
  // family list; a weight or a stretch keyword never carries a `px` unit, so any px token found
  // in a `font:` declaration is a size (or a line-height given in px, which the same floor covers).
  for (const decl of css.matchAll(/font\s*:\s*([^;{}]+);/g)) {
    for (const m of decl[1].matchAll(/(-?\d+(?:\.\d+)?)px/g)) sizes.push(Number(m[1]));
  }
  return sizes;
}

describe('the Dossier stylesheets keep the 10px text floor', () => {
  for (const file of DOSSIER_STYLES) {
    it(`sets no font or font-size under ${FLOOR}px in ${file}`, () => {
      const css = readFileSync(join(FOUNDRY_ROOT, 'static/styles', file), 'utf8');
      const sizes = pxFontSizes(css);
      const short = sizes.filter((n) => n < FLOOR);
      expect(short, `${file} sets a px text size under ${FLOOR}px: ${short.join(', ')}`).toEqual([]);
    });
  }
});

describe('the Instrument draws no SVG text', () => {
  for (const file of ['GasInstrument.svelte', 'BladeInstrument.svelte']) {
    it(`has no <text> element in ${file} (the DRY, EMPTY and stored-count numbers are HTML stamps)`, () => {
      const markup = readFileSync(join(FOUNDRY_ROOT, 'src/sheets/components', file), 'utf8');
      expect(markup).not.toMatch(/<text[\s>]/i);
    });
  }
});
