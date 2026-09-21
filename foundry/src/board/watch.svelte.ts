/**
 * Follows the GM's Direct Control toggle (ADR-0028), which is Svelte state in the tracker and changes
 * without a tracker refresh, so the board's frame tints the moment it is switched. Read-only.
 */
import { tracker } from '../tracker/state.svelte.ts';

export function watchDirect(fn: (on: boolean) => void): () => void {
  return $effect.root(() => {
    $effect(() => fn(tracker.direct));
  });
}
