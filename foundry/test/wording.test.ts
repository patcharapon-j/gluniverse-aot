import { describe, expect, it } from 'vitest';
import { STATUSES } from '../src/art.ts';
import { sweepConfigText } from '../tools/config-data.ts';
import { sourceSha, staleLine } from '../tools/data/foundry-wording.ts';
import { blobSha } from '../tools/data/site-wording.ts';
import { buildTestConfig, foundryWording, site, tables } from './wording-fixture.ts';

const config = buildTestConfig();

describe('sheet and card wording (2f)', () => {
  it('passes the website text guard on every sentence the config gives a sheet or a card', () => {
    expect(sweepConfigText(config, tables)).toBeGreaterThan(300);
  });

  it('words Scars, Stress Responses, and Fear results as the website does', () => {
    const hand = config.scars.find((r) => r.id === 'the-closing-hand')!;
    expect(hand.trigger).toBe(site.scars['the-closing-hand'].trigger);
    expect(hand.trigger).not.toMatch(/data\/|Chapter/);
    expect(hand.effectText).toEqual(['1-die penalty on that dodge only.']);
    expect(config.stressResponses.find((r) => r.min === null)!.effectText).toEqual([]);
    const scream = config.fearRows.find((r) => r.id === 'scream')!;
    expect(scream.forbidsText).toEqual(['Reactions']);
    expect(config.fearTriggers[0].name).toBe('Your first Titan');
  });

  it('gives every Action Catalog entry its website text', () => {
    for (const e of config.actionCatalog) expect(e.text.does.length, e.id).toBeGreaterThan(0);
  });

  it('gives each Critical Injury row its website lines and riders', () => {
    const rows = Object.values(config.injuryRows);
    expect(rows).toHaveLength(Object.values(tables.criticalInjuries.tables).reduce((n, x) => n + x.rows.length, 0));
    expect(config.injuryRows['arm-torn-artery'].riders.some((r) => r.startsWith('Burn: Healing time is multiplied by 2'))).toBe(true);
  });

  it('gives every token status its rule: the glossary, else the Foundry wording', () => {
    for (const s of STATUSES) expect(config.statusText[s.id], s.id).toBeTruthy();
    expect(config.statusText.down).toBe(site.glossary.find((g) => g.term === 'Down')!.definition);
    expect(config.statusText.carrying).toBe(foundryWording.statuses.carrying);
  });
});

describe('the Foundry wording resync check', () => {
  it('hashes a whole file as git does, and an entry by its content', () => {
    expect(blobSha('foundry/wording/statuses.yaml')).toMatch(/^[0-9a-f]{40}$/);
    expect(sourceSha({ path: 'data/gear/carrying.yaml', entry: 'carrying_a_comrade' })).toMatch(/^[0-9a-f]{12}$/);
    expect(() => sourceSha({ path: 'data/gear/carrying.yaml', entry: 'no_such_entry' })).toThrow(/no longer exists/);
  });

  it('warns when a source changed after its sentence was written', () => {
    const src = { path: 'data/gear/carrying.yaml', entry: 'carrying_a_comrade' };
    expect(staleLine('x', { ...src, sha: sourceSha(src) })).toBeNull();
    expect(staleLine('x', { ...src, sha: '000000000000' })).toMatch(/changed/);
  });
});
