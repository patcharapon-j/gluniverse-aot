import { describe, expect, it } from 'vitest';
import { barCard, barRules, emptyCounts, MAX_PER_KIND, poolSize, stepCount, type BarRoller } from '../src/chat-bar/pool.ts';
import { successesOf } from '../src/dice/card.ts';
import { pushBlock } from '../src/rules/roll.ts';

const soldier: BarRoller = { uuid: 'Actor.a', name: 'Ilse', img: 'a.webp', type: 'soldier', owned: true };

describe('chat bar pool', () => {
  it('steps each kind between 0 and the cap', () => {
    let c = emptyCounts();
    c = stepCount(c, 'base', 3);
    c = stepCount(c, 'stress', -1);
    expect(c).toEqual({ base: 3, gear: 0, stress: 0, titan: 0 });
    expect(stepCount(c, 'gear', 99).gear).toBe(MAX_PER_KIND);
    expect(poolSize(stepCount(c, 'titan', 2))).toBe(5);
  });

  it('allows Push only for an owned Soldier, and Stress Responses for an owned Soldier or Squadmate', () => {
    expect(barRules(soldier)).toEqual({ pushAllowed: true, responses: true });
    expect(barRules({ ...soldier, type: 'squadmate' })).toEqual({ pushAllowed: false, responses: true });
    expect(barRules({ ...soldier, owned: false })).toEqual({ pushAllowed: false, responses: false });
    expect(barRules({ ...soldier, type: 'titan' })).toEqual({ pushAllowed: false, responses: false });
    expect(barRules(null)).toEqual({ pushAllowed: false, responses: false });
  });

  const make = (roller: BarRoller | null) =>
    barCard({
      counts: { base: 2, gear: 1, stress: 1, titan: 2 },
      dice: { base: [6, 2], gear: [1], stress: [3] },
      titan: [5, 1],
      roller,
      fallback: { name: 'Player', img: 'p.webp' },
      label: { name: 'Dice Pool', gear: 'Gear Dice', why: '2db + 1dg + 1ds + 2dt' },
      time: '12:00',
    });

  it('posts an action card that counts Titan Dice on 5 and 6 and Pushes by the usual rules', () => {
    const card = make(soldier);
    expect(card.actor).toBe('Actor.a');
    expect(successesOf(card)).toBe(2);
    expect(card.pool.gear?.id).toBeUndefined();
    expect(pushBlock({ dice: card.dice, pushes: 0, maxPushes: card.maxPushes, pushAllowed: card.pushAllowed, down: false })).toBeNull();
  });

  it('has no actor and no Push without an owned speaker', () => {
    const card = make(null);
    expect(card.actor).toBe('');
    expect(card.actorName).toBe('Player');
    expect(pushBlock({ dice: card.dice, pushes: 0, maxPushes: card.maxPushes, pushAllowed: card.pushAllowed, down: false })).toBe('not-allowed');
    expect(make({ ...soldier, owned: false }).actor).toBe('');
  });
});
