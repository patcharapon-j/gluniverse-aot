/**
 * Fades the HUD strip while Dice So Nice dice are on screen (owner decision, milestone 4): reduced
 * opacity and no pointer events from a roll's start until its dice are hidden, then back. Nothing
 * happens when Dice So Nice is not active.
 */

type Timers = { set: (fn: () => void, ms: number) => unknown; clear: (handle: unknown) => void };

/** Keeps the rolls on screen; `active` is true while any is. Each roll ends on its own after `cap` ms. */
export class DiceFade {
  #live = new Map<string, unknown>();
  #timers: Timers;
  #cap: number;
  #onChange: (active: boolean) => void;

  constructor(onChange: (active: boolean) => void, cap = 20000, timers: Timers = { set: (fn, ms) => setTimeout(fn, ms), clear: (h) => clearTimeout(h as number) }) {
    this.#onChange = onChange;
    this.#cap = cap;
    this.#timers = timers;
  }

  get active(): boolean {
    return this.#live.size > 0;
  }

  /** A roll's dice appear. */
  start(key: string): void {
    const was = this.active;
    this.#arm(key, this.#cap);
    if (!was) this.#onChange(true);
  }

  /** A roll's animation is done; its dice leave the screen after `delay` ms. */
  finish(key: string, delay: number): void {
    if (!this.#live.has(key)) return;
    if (delay > 0) this.#arm(key, delay);
    else this.#end(key);
  }

  #arm(key: string, ms: number): void {
    const old = this.#live.get(key);
    if (old !== undefined) this.#timers.clear(old);
    this.#live.set(key, this.#timers.set(() => this.#end(key), ms));
  }

  #end(key: string): void {
    const handle = this.#live.get(key);
    if (handle === undefined) return;
    this.#timers.clear(handle);
    this.#live.delete(key);
    if (!this.active) this.#onChange(false);
  }
}

const FADE_MS = 1000;

/** How long Dice So Nice keeps the dice after a roll: its hide delay and fade, or none when it keeps them. */
function hideDelay(): number {
  const cfg = game.user?.getFlag?.('dice-so-nice', 'settings') ?? {};
  if (cfg.hideAfterRoll === false) return 0;
  return (typeof cfg.timeBeforeHide === 'number' ? cfg.timeBeforeHide : 2000) + FADE_MS;
}

export function registerDiceFade(host: () => HTMLElement | null): void {
  const fade = new DiceFade((active) => host()?.classList.toggle('wof-dice-fade', active));
  Hooks.on('diceSoNiceRollStart', (id: string | null) => {
    if (id) fade.start(`m:${id}`);
  });
  Hooks.on('diceSoNiceRollComplete', (id: string) => fade.finish(`m:${id}`, hideDelay()));
  // A roll shown without a message (the tracker's steam and fall dice) fires no completion hook.
  Hooks.once('diceSoNiceReady', (dice3d: any) => {
    const show = dice3d.showForRoll.bind(dice3d);
    let n = 0;
    dice3d.showForRoll = async (...args: any[]) => {
      if (args[5]) return show(...args);
      const key = `r:${++n}`;
      fade.start(key);
      try {
        return await show(...args);
      } finally {
        fade.finish(key, hideDelay());
      }
    };
  });
}
