/** The tab keys (sheet-overhaul plan, section 8): arrows in both axes, wrap-around, Home and End. */
import { describe, expect, it } from 'vitest';
import { nextTab } from '../src/sheets/tab-keys.ts';

describe('nextTab', () => {
  it('moves forward on ArrowDown and ArrowRight', () => {
    expect(nextTab('ArrowDown', 0, 4)).toBe(1);
    expect(nextTab('ArrowRight', 2, 4)).toBe(3);
  });

  it('moves back on ArrowUp and ArrowLeft', () => {
    expect(nextTab('ArrowUp', 3, 4)).toBe(2);
    expect(nextTab('ArrowLeft', 1, 4)).toBe(0);
  });

  it('wraps around both ends', () => {
    expect(nextTab('ArrowDown', 3, 4)).toBe(0);
    expect(nextTab('ArrowRight', 3, 4)).toBe(0);
    expect(nextTab('ArrowUp', 0, 4)).toBe(3);
    expect(nextTab('ArrowLeft', 0, 4)).toBe(3);
  });

  it('goes to the first tab on Home and the last on End', () => {
    expect(nextTab('Home', 2, 4)).toBe(0);
    expect(nextTab('End', 1, 4)).toBe(3);
    expect(nextTab('End', 1, 3)).toBe(2);
  });

  it('ignores every other key', () => {
    for (const key of ['Enter', ' ', 'Tab', 'a', 'PageDown', 'Escape']) expect(nextTab(key, 1, 4)).toBeNull();
  });

  it('answers nothing with no tabs', () => {
    expect(nextTab('ArrowDown', 0, 0)).toBeNull();
    expect(nextTab('Home', 0, 0)).toBeNull();
  });
});
