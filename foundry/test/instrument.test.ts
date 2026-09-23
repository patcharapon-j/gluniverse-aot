/**
 * The gas and blade instruments' pure part (sheet-overhaul plan, section 5.1): dial and gauge
 * geometry, stamps, the spare rack, and which document change animates.
 */
import { describe, expect, it } from 'vitest';
import {
  bladeChange,
  bladeState,
  dialFace,
  gasChange,
  gasStamp,
  gaugeBands,
  needleAngle,
  spareBands,
  sparesShown,
  type BladeSnapshot,
  type GasSnapshot,
} from '../src/sheets/instrument.ts';

describe('the pressure dial', () => {
  it('sweeps from -110 at empty to 110 at full', () => {
    expect([0, 1, 2, 3].map((l) => needleAngle(l, 3))).toEqual([-110, -110 + 220 / 3, -110 + 440 / 3, 110]);
  });

  it('reads a full Gas Rating of 4 in quarters', () => {
    expect(needleAngle(1, 4)).toBe(-55);
    expect(needleAngle(2, 4)).toBe(0);
    expect(needleAngle(4, 4)).toBe(110);
  });

  it('clamps a level outside the dial, and a rating of 0 reads empty', () => {
    expect(needleAngle(-1, 3)).toBe(-110);
    expect(needleAngle(5, 3)).toBe(110);
    expect(needleAngle(2, 0)).toBe(-110);
  });

  it('prints four major ticks, three minor, and the red arc at the empty end', () => {
    const face = dialFace(76, 9);
    expect(face.major.match(/M/g)).toHaveLength(4);
    expect(face.minor.match(/M/g)).toHaveLength(3);
    expect(face.major.startsWith('M72.05 10.44L')).toBe(true);
    expect(face.arc).toMatch(/^M71\.5 11\.39A5\.1 5\.1 0 0 1 /);
  });
});

describe('the gauge bands', () => {
  it('lays three bands across the window as the preview draws them', () => {
    expect(gaugeBands(2, 3)).toEqual([
      { x: 18, y: 15.6, width: 13, height: 5.8, on: true },
      { x: 32, y: 15.6, width: 13, height: 5.8, on: true },
      { x: 46, y: 15.6, width: 13, height: 5.8, on: false },
    ]);
  });

  it('gives one band per point of full Gas Rating', () => {
    const four = gaugeBands(1, 4);
    expect(four).toHaveLength(4);
    expect(four.map((b) => b.on)).toEqual([true, false, false, false]);
    expect(four[3].x + four[3].width).toBeCloseTo(59);
  });

  it('stacks a spare canister\'s bands from the bottom', () => {
    expect(spareBands(1, 3).map((b) => [b.y, b.height, b.on])).toEqual([
      [17.8, 4.2, true],
      [13, 4.2, false],
      [8.2, 4.2, false],
    ]);
  });
});

describe('the gas stamp', () => {
  it('is No ODM first, then Jammed, then Dry', () => {
    expect(gasStamp({ hasOdm: false, jammed: true, level: 0 })).toBe('noOdm');
    expect(gasStamp({ hasOdm: true, jammed: true, level: 0 })).toBe('jammed');
    expect(gasStamp({ hasOdm: true, jammed: false, level: 0 })).toBe('dry');
    expect(gasStamp({ hasOdm: true, jammed: false, level: 1 })).toBeNull();
  });
});

describe('the spare rack', () => {
  it('shows every spare when there is room', () => {
    expect(sparesShown([3, 2], 4)).toEqual({ shown: [{ level: 3, index: 0 }, { level: 2, index: 1 }], more: 0 });
  });

  it('shows the first spares and counts the rest', () => {
    const rack = sparesShown([3, 3, 2, 1, 1, 1], 4);
    expect(rack.shown.map((s) => s.index)).toEqual([0, 1, 2, 3]);
    expect(rack.more).toBe(2);
    expect(sparesShown([3, 3, 2, 1], 3).more).toBe(1);
    expect(sparesShown([], 4)).toEqual({ shown: [], more: 0 });
  });
});

describe('the Blade Sets', () => {
  const set = (inHandles: boolean, rating = 1) => ({ subtype: 'blade-set', inHandles, rating });

  it('reads the set in the handles and the stored count', () => {
    expect(bladeState([set(true, 2), set(false), set(false), { subtype: 'odm', inHandles: false, rating: 3 }])).toEqual({ inHand: 2, stored: 2 });
    expect(bladeState([set(false)])).toEqual({ inHand: null, stored: 1 });
    expect(bladeState([])).toEqual({ inHand: null, stored: 0 });
  });
});

describe('which gas change animates', () => {
  const gas = (level: number, spares: number[] = [], mode = 'full'): GasSnapshot => ({ level, spares, mode });

  it('never animates the first draw', () => {
    expect(gasChange(undefined, gas(3), true)).toBeNull();
  });

  it('never animates a change of the Motion setting', () => {
    expect(gasChange(gas(3), gas(2, [], 'reduced'))).toBeNull();
  });

  it('reads a spend and a fill from the level', () => {
    expect(gasChange(gas(3, [3]), gas(2, [3]))).toBe('spend');
    expect(gasChange(gas(3), gas(1))).toBe('spend');
    expect(gasChange(gas(1), gas(3))).toBe('fill');
  });

  it('reads a swap from the spares', () => {
    expect(gasChange(gas(1, [3, 2]), gas(3, [2, 1]))).toBe('swap');
    expect(gasChange(gas(0, [2]), gas(2, []))).toBe('swap');
    expect(gasChange(gas(1, [3, 2]), gas(2, [1, 3]))).toBe('swap');
  });

  it('takes a swap from this viewer\'s own request, even when nothing changed', () => {
    expect(gasChange(gas(2, [2]), gas(2, [2]), true)).toBe('swap');
  });

  it('does not take a spare removed on the Kit tab for a swap', () => {
    expect(gasChange(gas(2, [2, 3]), gas(2, [3]))).toBeNull();
    expect(gasChange(gas(2, [3]), gas(2, [3, 3]))).toBeNull();
  });

  it('ignores an update that leaves the gas alone', () => {
    expect(gasChange(gas(2, [3]), gas(2, [3]))).toBeNull();
  });
});

describe('which blade change animates', () => {
  const blades = (inHand: number | null, stored = 1, mode = 'full'): BladeSnapshot => ({ inHand, stored, mode });

  it('reads a ruin and a fit', () => {
    expect(bladeChange(blades(1, 1), blades(null, 1))).toBe('ruin');
    expect(bladeChange(blades(null, 2), blades(1, 1))).toBe('fit');
  });

  it('never animates the first draw, a Motion change, or a stored count alone', () => {
    expect(bladeChange(undefined, blades(1))).toBeNull();
    expect(bladeChange(blades(1), blades(null, 1, 'off'))).toBeNull();
    expect(bladeChange(blades(1, 1), blades(1, 2))).toBeNull();
  });
});
