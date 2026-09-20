/**
 * The prompt card's state machine (batch C) and the GM's force path through the tracker request
 * gate (batch B, ADR-0028). Both are kept free of Foundry globals so they can be tested here.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  allAnswered,
  claimEntry,
  CLAIM_STALE,
  dueAt,
  entryOpen,
  newEntry,
  openEntries,
  pressRefusal,
  PROMPT_TIMEOUT_DEFAULT,
  releaseEntry,
  resolveEntry,
  timedOut,
  type PromptAsker,
} from '../src/dice/prompt-state.ts';

const T0 = 1_000_000;
const alice = { actor: 'Actor.A', actorId: 'A', name: 'Alice', detail: 'Health 3/5' };
const bob = { actor: 'Actor.B', actorId: 'B', name: 'Bob', detail: 'Health 5/5' };
const posted = () => [newEntry(alice), newEntry(bob)];

const asker = (userId: string, isGM: boolean, owned: string[]): PromptAsker => ({ userId, isGM, owns: (uuid) => isGM || owned.includes(uuid) });
const player = asker('alice', false, ['Actor.A']);
const other = asker('bob', false, ['Actor.B']);
const gm = asker('gm', true, []);

describe('the prompt card, posted', () => {
  it('starts every button waiting, and answers nobody', () => {
    const entries = posted();
    expect(entries.map((e) => e.state)).toEqual(['waiting', 'waiting']);
    expect(openEntries(entries, T0)).toEqual([0, 1]);
    expect(allAnswered(entries)).toBe(false);
  });

  it('lets only the named soldier’s owner (and the GM) press a button', () => {
    const entries = posted();
    expect(pressRefusal(entries, 0, player, T0)).toBeNull();
    expect(pressRefusal(entries, 0, gm, T0)).toBeNull();
    expect(pressRefusal(entries, 0, other, T0)).toBe('only the soldier’s owner rolls this');
    expect(pressRefusal(entries, 9, player, T0)).toBe('no such prompt');
  });

  it('waits by default, and has a due time only when the world switched a timeout on', () => {
    expect(dueAt(T0, 0)).toBeNull();
    expect(dueAt(T0, PROMPT_TIMEOUT_DEFAULT)).toBe(T0 + 60_000);
    expect(timedOut(posted(), null, T0 + 10 ** 9)).toEqual([]);
  });
});

describe('the prompt card, claimed', () => {
  it('holds the button while the die is in the air, against a second click and the timeout', () => {
    const entries = claimEntry(posted(), 0, 'alice', T0);
    expect(entries[0].state).toBe('claimed');
    expect(entryOpen(entries[0], T0)).toBe(false);
    expect(pressRefusal(entries, 0, other, T0)).toBe('only the soldier’s owner rolls this');
    expect(pressRefusal(entries, 0, gm, T0)).toBe('someone is rolling it');
    // The claim holder may press again (their own retry), and the other button is untouched.
    expect(pressRefusal(entries, 0, player, T0)).toBeNull();
    expect(timedOut(entries, T0 - 1, T0)).toEqual([1]);
  });

  it('gives a stale claim back, so a client that dropped out never holds the prompt shut', () => {
    const entries = claimEntry(posted(), 0, 'alice', T0);
    expect(entryOpen(entries[0], T0 + CLAIM_STALE)).toBe(true);
    expect(pressRefusal(entries, 0, gm, T0 + CLAIM_STALE)).toBeNull();
  });

  it('gives the button back when the roll was cancelled', () => {
    const entries = releaseEntry(claimEntry(posted(), 0, 'alice', T0), 0);
    expect(entries[0]).toMatchObject({ state: 'waiting', claimedBy: '', claimedAt: 0 });
    expect(pressRefusal(entries, 0, gm, T0)).toBeNull();
  });
});

describe('the prompt card, resolved', () => {
  it('records the owner’s own roll and closes that button only', () => {
    const entries = resolveEntry(claimEntry(posted(), 0, 'alice', T0), 0, { by: 'owner', faces: [4], line: 'Alice: 2 damage.' });
    expect(entries[0]).toMatchObject({ state: 'done', by: 'owner', faces: [4], line: 'Alice: 2 damage.' });
    expect(pressRefusal(entries, 0, player, T0)).toBe('the roll was already made');
    expect(openEntries(entries, T0)).toEqual([1]);
    expect(allAnswered(entries)).toBe(false);
  });

  it('records a roll the GM made for them, and marks it as theirs', () => {
    const entries = resolveEntry(posted(), 1, { by: 'gm', faces: [6], line: 'Bob: 3 damage.' });
    expect(entries[1]).toMatchObject({ state: 'done', by: 'gm' });
    expect(pressRefusal(entries, 1, gm, T0)).toBe('the roll was already made');
  });

  it('is answered once every button is, and never times out after that', () => {
    let entries = resolveEntry(posted(), 0, { by: 'owner', faces: [1], line: 'a' });
    entries = resolveEntry(entries, 1, { by: 'timeout', faces: [2], line: 'b' });
    expect(allAnswered(entries)).toBe(true);
    expect(timedOut(entries, T0, T0 + 10 ** 6)).toEqual([]);
  });

  it('takes the unanswered buttons over only once the due time has passed', () => {
    const due = dueAt(T0, PROMPT_TIMEOUT_DEFAULT)!;
    const entries = resolveEntry(posted(), 0, { by: 'owner', faces: [3], line: 'a' });
    expect(timedOut(entries, due, due - 1)).toEqual([]);
    expect(timedOut(entries, due, due)).toEqual([1]);
    const after = resolveEntry(entries, 1, { by: 'timeout', faces: [5], line: 'b' });
    expect(after[1].by).toBe('timeout');
  });
});

// ---------------------------------------------------------------- the GM's force path (ADR-0028)

const permission = vi.fn((_w: unknown, _req: unknown) => null as string | null);
const rules = vi.fn((_w: unknown, _req: unknown) => 'the move is not one step' as string | null);

vi.mock('../src/rules/engagement/guard.ts', () => ({
  checkTrackerPermission: (w: unknown, req: unknown) => permission(w, req),
  checkTrackerRequest: (w: unknown, req: unknown) => rules(w, req),
}));
// requests.ts reaches the running world through these; the gate itself touches none of them.
vi.mock('../src/dice/proxy.ts', () => ({ extViaGM: async () => true, registerProxyExtension: () => {} }));
vi.mock('../src/dice/prompt.ts', () => ({ registerPrompts: () => {} }));
vi.mock('../src/tracker/engine.ts', () => ({ isGM: () => false, performRequest: async () => true, registerEnginePrompts: () => {} }));
vi.mock('../src/tracker/harm.ts', () => ({ registerHarmPrompts: () => {} }));
vi.mock('../src/tracker/results.ts', () => ({ registerResultPrompts: () => {} }));
vi.mock('../src/tracker/snapshot.ts', () => ({ snapshot: () => null }));

const world = { userId: 'u', owns: () => true, snapshot: () => null } as never;
const move = { act: 'fall-back', combat: 'C', soldier: 'A', titan: 'tA' } as never;

describe('the GM is never blocked (ADR-0028)', () => {
  it('runs both checks for an ordinary request, whoever asks', async () => {
    const { trackerRefusal } = await import('../src/tracker/requests.ts');
    permission.mockClear();
    rules.mockClear();
    expect(trackerRefusal(world, move, false)).toBe('the move is not one step');
    expect(trackerRefusal(world, move, true)).toBe('the move is not one step');
    expect(rules).toHaveBeenCalledTimes(2);
  });

  it('skips the rules checks, and only those, for a GM’s forced request', async () => {
    const { trackerRefusal } = await import('../src/tracker/requests.ts');
    permission.mockClear();
    rules.mockClear();
    expect(trackerRefusal(world, { ...(move as object), force: true } as never, true)).toBeNull();
    expect(rules).not.toHaveBeenCalled();
    expect(permission).toHaveBeenCalledTimes(1);
  });

  it('still refuses a forced request the permission check refuses', async () => {
    const { trackerRefusal } = await import('../src/tracker/requests.ts');
    permission.mockReturnValueOnce('the soldier is not taking part');
    expect(trackerRefusal(world, { ...(move as object), force: true } as never, true)).toBe('the soldier is not taking part');
  });

  it('never lets a player carry force', async () => {
    const { trackerRefusal } = await import('../src/tracker/requests.ts');
    permission.mockClear();
    rules.mockClear();
    expect(trackerRefusal(world, { ...(move as object), force: true } as never, false)).toBe('only the GM steps over the rules');
    expect(permission).not.toHaveBeenCalled();
    expect(rules).not.toHaveBeenCalled();
  });
});
