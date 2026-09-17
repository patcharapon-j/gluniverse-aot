import { describe, expect, it } from 'vitest';
import { KeyedLock } from '../src/tracker/busy.ts';

describe('the round-end lock (milestone 4 review, M1)', () => {
  it('refuses a second apply while a step is under way, per engagement', async () => {
    const lock = new KeyedLock();
    let applied = 0;
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const first = lock.run('C', async () => {
      await gate;
      applied++;
      return 'first';
    });
    expect(lock.held('C')).toBe(true);
    // A click or the automation during the run: nothing happens (Regeneration is not added twice).
    expect(await lock.run('C', async () => void applied++)).toBeUndefined();
    // Another engagement is not held up.
    expect(await lock.run('D', async () => 'other')).toBe('other');
    release();
    expect(await first).toBe('first');
    expect(applied).toBe(1);
    expect(lock.held('C')).toBe(false);
    expect(await lock.run('C', async () => ++applied)).toBe(2);
  });

  it('lets go after a failure and tells the view each change', async () => {
    const lock = new KeyedLock();
    const seen: boolean[] = [];
    const off = lock.onChange(() => seen.push(lock.held('C')));
    await expect(lock.run('C', async () => Promise.reject(new Error('boom')))).rejects.toThrow('boom');
    expect(lock.held('C')).toBe(false);
    expect(seen).toEqual([true, false]);
    off();
    await lock.run('C', async () => undefined);
    expect(seen).toEqual([true, false]);
  });
});
