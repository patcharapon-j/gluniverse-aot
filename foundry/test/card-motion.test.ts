/**
 * Which redraws of a roll card are animated (ADR-0027). A card is redrawn whenever its actor
 * changes, a viewer's rights change, or the chat log is rebuilt, so only a card whose face changed
 * may play. anime.js and the viewer's Motion setting are stubbed: no DOM here.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/motion/fx.ts', () => ({ countUp: vi.fn(), flash: vi.fn(), fx: vi.fn(), popMark: vi.fn(), reveal: vi.fn(), tumbleIn: vi.fn() }));
vi.mock('../src/settings.svelte.ts', () => ({ motionMode: () => 'full' }));

const { CardMotion, cardSignature, FRESH_MS } = await import('../src/dice/card-motion.ts');
type AnyCard = Parameters<typeof cardSignature>[0];

const action = (over: Record<string, unknown> = {}): AnyCard =>
  ({
    v: 1,
    kind: 'action',
    actor: 'Actor.a',
    ops: [],
    dice: { base: [6, 2, 4], gear: [1], stress: [3] },
    fresh: -1,
    pushes: 0,
    ...over,
  }) as unknown as AnyCard;

const NOW = 1_700_000_000_000;

describe('the signature of a roll card', () => {
  it('is the same for a redraw that shows the same roll', () => {
    expect(cardSignature(action())).toBe(cardSignature(action()));
  });

  it('changes when a Push re-rolls the pool and adds its Stress Die', () => {
    const pushed = action({ dice: { base: [6, 5, 4], gear: [1], stress: [3, 1] }, fresh: 1, pushes: 1 });
    expect(cardSignature(pushed)).not.toBe(cardSignature(action()));
  });

  it('changes when the applied changes are undone, and again when they are redone', () => {
    const done = action({ ops: [{ state: 'done' }] });
    const undone = action({ ops: [{ state: 'undone' }] });
    expect(cardSignature(done)).not.toBe(cardSignature(undone));
    expect(cardSignature(action({ ops: [{ state: 'done' }] }))).toBe(cardSignature(done));
  });

  it('reads the faces of a table, Gas, or Titan attack card too', () => {
    const attack = { v: 1, kind: 'attack', ops: [], faces: [6, 5, 2], severity: 2, targets: [{}] } as unknown as AnyCard;
    const harder = { v: 1, kind: 'attack', ops: [], faces: [6, 5, 6], severity: 3, targets: [{}] } as unknown as AnyCard;
    expect(cardSignature(attack)).not.toBe(cardSignature(harder));
    expect(cardSignature(attack)).toBe(cardSignature(attack));
  });
});

describe('what a redraw plays', () => {
  let motion: InstanceType<typeof CardMotion>;
  beforeEach(() => (motion = new CardMotion()));

  it('deals a card just posted, and plays nothing when it is drawn again unchanged', () => {
    const sig = cardSignature(action());
    expect(motion.plan('m1', sig, NOW, NOW)).toBe('enter');
    expect(motion.plan('m1', sig, NOW, NOW + 50)).toBe('none');
    expect(motion.plan('m1', sig, NOW, NOW + 60_000)).toBe('none');
  });

  it('plays the short beat when a card the viewer has seen changes in place', () => {
    motion.plan('m1', cardSignature(action()), NOW, NOW);
    const pushed = cardSignature(action({ dice: { base: [6, 5, 4], gear: [1], stress: [3, 1] }, fresh: 1, pushes: 1 }));
    expect(motion.plan('m1', pushed, NOW, NOW + 4000)).toBe('update');
    expect(motion.plan('m1', pushed, NOW, NOW + 4100)).toBe('none');
  });

  it('leaves the backlog alone: an old card drawn for the first time does not deal itself', () => {
    const sig = cardSignature(action());
    expect(motion.plan('old', sig, NOW - FRESH_MS - 1, NOW)).toBe('none');
    // A card from a client whose clock runs ahead is backlog too, not a fresh deal.
    expect(motion.plan('ahead', sig, NOW + FRESH_MS + 1, NOW)).toBe('none');
    // Once seen, a real change to it still plays.
    expect(motion.plan('old', cardSignature(action({ pushes: 1 })), NOW - FRESH_MS - 1, NOW)).toBe('update');
  });

  it('remembers only the last cards drawn, so a long session does not grow without end', () => {
    const small = new CardMotion(2);
    const sig = cardSignature(action());
    for (const id of ['a', 'b', 'c']) expect(small.plan(id, sig, NOW, NOW)).toBe('enter');
    // "a" was dropped to make room, so its redraw is treated as a first draw of an old card.
    expect(small.plan('a', sig, NOW - FRESH_MS - 1, NOW)).toBe('none');
    expect(small.plan('c', sig, NOW, NOW)).toBe('none');
  });
});
