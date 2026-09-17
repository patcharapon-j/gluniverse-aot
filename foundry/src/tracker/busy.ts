/**
 * A lock per key (an engagement's id): while one round-end run, apply, skip, or undo is under way,
 * another is refused, so a click or the automation never applies a step twice. Free of Foundry
 * globals so it can be tested.
 */
export class KeyedLock {
  readonly #held = new Set<string>();
  readonly #listeners = new Set<() => void>();

  held(key: string): boolean {
    return this.#held.has(key);
  }

  /** Called whenever a key is taken or let go. */
  onChange(fn: () => void): () => void {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  /** Runs `fn` holding the key, or does nothing (undefined) while the key is held. */
  async run<T>(key: string, fn: () => Promise<T>): Promise<T | undefined> {
    if (this.#held.has(key)) return undefined;
    this.#held.add(key);
    this.#notify();
    try {
      return await fn();
    } finally {
      this.#held.delete(key);
      this.#notify();
    }
  }

  #notify(): void {
    for (const fn of this.#listeners) fn();
  }
}
