import { describe, expect, it } from 'vitest';
import { glossifier } from './glossify';

describe('glossifier', () => {
  it('marks the longest spelling of a term', () => {
    expect(glossifier()('Add your Stress Dice.')).toEqual(['Add your ', { text: 'Stress Dice', slug: 'stress-dice' }, '.']);
  });

  it('marks only the first use of a term across one card', () => {
    const gloss = glossifier();
    expect(gloss('Push once.')).toEqual([{ text: 'Push', slug: 'push' }, ' once.']);
    expect(gloss('Pushed again, then Push.')).toEqual(['Pushed again, then Push.']);
  });

  it('starts fresh for each card', () => {
    expect(glossifier()('Push.')).toEqual([{ text: 'Push', slug: 'push' }, '.']);
    expect(glossifier()('Push.')).toEqual([{ text: 'Push', slug: 'push' }, '.']);
  });

  it('skips excluded terms and every alias of them', () => {
    expect(glossifier(['Titan'])('The Titans turn.')).toEqual(['The Titans turn.']);
  });

  it('matches lowercase base dice but not words that merely start with a term', () => {
    expect(glossifier()('Reroll base dice. Pushes and Helpers.')).toEqual([
      'Reroll ',
      { text: 'base dice', slug: 'base-dice' },
      '. Pushes and Helpers.',
    ]);
  });

  it('keeps possessives outside the term', () => {
    expect(glossifier()("A Titan's hand")).toEqual(['A ', { text: 'Titan', slug: 'titan' }, "'s hand"]);
  });

  it('returns nothing for missing text and fails on an unknown exclusion', () => {
    expect(glossifier()(null)).toEqual([]);
    expect(() => glossifier(['Not a term'])).toThrow();
  });
});
