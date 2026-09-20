/**
 * The hover card (src/sheets/detail.ts): what a Talent's and an action's card say, and where the
 * card is placed beside the row that raised it. The builders localize through game.i18n, which is
 * stubbed to hand back its key, so the assertions are about the text the data gives.
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { actionDetail, placeCard, plainText, poolLines, talentDetail, type CatalogEntry } from '../src/sheets/detail.ts';
import { previewPool, type PoolPreview } from '../src/rules/pool.ts';
import { loadTables } from '../tools/data/load.ts';
import { buildTestConfig } from './wording-fixture.ts';

const config = buildTestConfig(loadTables());
const entry = (id: string) => config.actionCatalog.find((e) => e.id === id)! as unknown as CatalogEntry;

beforeAll(() => {
  vi.stubGlobal('game', { i18n: { localize: (key: string) => key, format: (key: string, data: Record<string, unknown>) => `${key}(${Object.values(data).join('|')})` } });
});

const lines = (card: { sections: { label: string; lines: string[] }[] }, label: string) => card.sections.find((s) => s.label === label)?.lines ?? [];

describe('the card an action raises (detail.ts)', () => {
  it('opens with what the entry does and carries what it requires and needs', () => {
    const e = entry('nape-strike');
    const card = actionDetail({ entry: e, icon: 'x.webp', rollLabel: 'Strength' });
    expect(card.kind).toBe('action');
    expect(card.title).toBe(e.name);
    expect(card.lead).toEqual(e.text!.does);
    expect(card.lead.length).toBeGreaterThan(0);
    expect(lines(card, 'WOF.Sheet.detail.requires')).toEqual(e.text!.requires);
    expect(lines(card, 'WOF.Sheet.detail.needs')).toEqual([e.text!.needs]);
    // Away from a character there is no pool to preview, so the stamp says what the roll is on.
    expect(card.stamp).toBe('Strength');
    expect(lines(card, 'WOF.Sheet.detail.dice')).toEqual([]);
  });

  it('says what a gear requirement costs the entry', () => {
    const card = actionDetail({ entry: entry('nape-strike'), icon: 'x.webp', rollLabel: 'Strength' });
    expect(lines(card, 'WOF.Sheet.detail.gear')).toContain('WOF.Sheet.detail.withoutGear.not_possible');
  });

  it('previews the pool for a character, one line per source, and stamps the dice', () => {
    const pool = previewPool({
      entry: config.actionCatalog.find((e) => e.id === 'nape-strike')!,
      attributes: { strength: 4, agility: 3, wits: 3, perception: 3, instinct: 2, empathy: 2 },
      talents: [{ id: 'clean-cut', name: 'Clean Cut', type: 'dice', level: 2, names: ['nape-strike'], condition: {} }],
      gear: [{ itemId: 'blade-set', name: 'Blade Set', dice: 1 }],
      penalties: [],
      stress: 3,
    });
    const card = actionDetail({ entry: entry('nape-strike'), icon: 'x.webp', rollLabel: 'Strength', pool, why: 'why', fixed: false });
    expect(card.stamp).toBe(`WOF.Sheet.detail.stampDice(${pool.total})`);
    expect(lines(card, 'WOF.Sheet.detail.dice')).toEqual(poolLines(pool, 'Strength'));
    expect(poolLines(pool, 'Strength')).toEqual([
      'WOF.Sheet.detail.poolAttribute(Strength|4)',
      'WOF.Sheet.detail.poolTalent(Clean Cut|2)',
      'WOF.Sheet.detail.poolGear(Blade Set|1)',
      'WOF.Sheet.detail.poolStress(3)',
    ]);
  });

  it('gives the reason instead of the dice when the roll is blocked', () => {
    const card = actionDetail({ entry: entry('nape-strike'), icon: 'x.webp', rollLabel: 'Strength', pool: {} as PoolPreview, why: 'why', blockedReason: 'No Blade Set' });
    expect(card.blocked).toBe('No Blade Set');
    expect(card.foot).toBe('No Blade Set');
    expect(card.stamp).toBe('Strength');
    expect(lines(card, 'WOF.Sheet.detail.dice')).toEqual([]);
  });
});

describe('the card a Talent raises (detail.ts)', () => {
  const base = {
    id: 'i1',
    name: 'Clean Cut',
    icon: 'talent.webp',
    type: 'dice' as const,
    description: '<p>Practice at the single deep cut.</p>',
    trigger: '',
    effect: '+1 die per level on a Nape strike.',
    maxLevel: 3,
    limit: '',
    specialties: ['Slayer'],
    forLine: 'Nape strike',
    entries: [{ id: 'nape-strike', name: 'Nape strike', icon: 'a.webp', note: '', card: null }],
  };

  it('opens with the description as plain text and names what it names', () => {
    const card = talentDetail({ ...base, level: 2, effectiveLevel: 2, used: false });
    expect(card.lead).toEqual(['Practice at the single deep cut.']);
    expect(lines(card, 'WOF.Sheet.detail.effect')).toEqual(['+1 die per level on a Nape strike.']);
    expect(card.refs.map((r) => r.id)).toEqual(['nape-strike']);
    expect(card.stamp).toBe('WOF.Sheet.detail.level(2|3)');
    expect(lines(card, 'WOF.Sheet.detail.dice')).toEqual(['WOF.Sheet.detail.talentDice(2)']);
  });

  it('holds no level away from a character, and no line for a Talent with no limit', () => {
    const card = talentDetail(base);
    expect(card.stamp).toBe('WOF.Sheet.detail.upToLevel(3)');
    expect(lines(card, 'WOF.Sheet.detail.limit')).toEqual([]);
    expect(lines(card, 'WOF.Sheet.detail.dice')).toEqual([]);
  });

  it('says whether a once-per use is spent, only where a character holds it', () => {
    const limited = { ...base, limit: 'Once per Titan Engagement' };
    expect(lines(talentDetail({ ...limited, used: true }), 'WOF.Sheet.detail.limit')).toEqual(['Once per Titan Engagement', 'WOF.Sheet.detail.spent']);
    expect(lines(talentDetail(limited), 'WOF.Sheet.detail.limit')).toEqual(['Once per Titan Engagement']);
  });
});

describe('plainText (detail.ts)', () => {
  it('strips the tags and settles the entities of a description field', () => {
    expect(plainText('<p>Hold the <b>line</b>.</p><p>Then&nbsp;fall back.</p>')).toBe('Hold the line. Then fall back.');
    expect(plainText('Blades &amp; gas')).toBe('Blades & gas');
    expect(plainText('')).toBe('');
  });
});

describe('placeCard (detail.ts)', () => {
  const view = { width: 1000, height: 800 };
  const card = { width: 300, height: 200 };

  it('puts the card beside the row, centred on it, when there is room to the right', () => {
    const p = placeCard({ left: 100, top: 300, width: 200, height: 40 }, card, view);
    expect(p.side).toBe('right');
    expect(p.left).toBe(100 + 200 + 12);
    expect(p.top).toBe(300 + 20 - 100);
  });

  it('crosses to the left when the right has no room', () => {
    const p = placeCard({ left: 700, top: 300, width: 200, height: 40 }, card, view);
    expect(p.side).toBe('left');
    expect(p.left).toBe(700 - 12 - 300);
  });

  it('drops under the row when neither side has room, and stays inside the window', () => {
    const narrow = { width: 420, height: 800 };
    const p = placeCard({ left: 60, top: 100, width: 300, height: 40 }, card, narrow);
    expect(p.side).toBe('below');
    expect(p.top).toBe(100 + 40 + 12);
    expect(p.left).toBeGreaterThanOrEqual(8);
    expect(p.left + card.width).toBeLessThanOrEqual(narrow.width - 8);
  });

  it('rises above the row when there is no room under it either', () => {
    const short = { width: 420, height: 300 };
    const p = placeCard({ left: 60, top: 230, width: 300, height: 40 }, card, short);
    expect(p.side).toBe('above');
    expect(p.top).toBe(230 - 12 - 200);
  });

  it('never leaves the window, however the row sits', () => {
    for (const anchor of [{ left: -40, top: -30, width: 200, height: 40 }, { left: 980, top: 790, width: 200, height: 40 }]) {
      const p = placeCard(anchor, card, view);
      expect(p.left).toBeGreaterThanOrEqual(8);
      expect(p.top).toBeGreaterThanOrEqual(8);
      expect(p.left + card.width).toBeLessThanOrEqual(view.width - 8);
      expect(p.top + card.height).toBeLessThanOrEqual(view.height - 8);
    }
  });
});
