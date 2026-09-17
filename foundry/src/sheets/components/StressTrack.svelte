<script lang="ts">
  /**
   * The Stress row as square track boxes: marked boxes are red stamps; boxes under the Scar floor
   * carry an inked bar. The row wraps, and a track longer than `max` stops there and counts the rest
   * on a tally chip, so a soldier carrying a lot of Stress cannot push the strip out of the sheet.
   */
  import { tick } from 'svelte';
  import { inkIn, inkOut } from '../../motion/fx.ts';
  import { t } from '../context.ts';

  let {
    count,
    value,
    minimum,
    disabled = false,
    size = 'md',
    max = 24,
    onbox,
  }: { count: number; value: number; minimum: number; disabled?: boolean; size?: 'md' | 'lg'; max?: number; onbox: (i: number) => void } = $props();

  const shown = $derived(Math.max(1, Math.min(count, max)));
  const over = $derived(Math.max(0, value - shown));

  let el: HTMLElement | undefined = $state();
  let prev: number | null = null;

  $effect(() => {
    const now = value;
    const before = prev;
    prev = now;
    if (before === null || before === now) return;
    tick().then(() => {
      const boxes = [...(el?.querySelectorAll('.sbox') ?? [])];
      if (now > before) inkIn(boxes.slice(before, now));
      else inkOut(boxes.slice(now, before).reverse());
    });
  });
</script>

<div class="boxes track-row {size}" role="group" aria-label={t('WOF.Sheet.stress.boxes')} bind:this={el}>
  {#each Array.from({ length: shown }) as _, i (i)}
    <button
      type="button"
      class="sbox"
      class:on={i < value}
      class:min={i < minimum}
      {disabled}
      aria-label={t('WOF.Sheet.stress.box', { n: i + 1 })}
      aria-pressed={i < value}
      onclick={() => onbox(i)}
    >
      {#if i < value}<svg class="ink" viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="M5 5.2 14.8 14.9M14.9 5 5.1 14.8" /></svg>{/if}
    </button>
  {/each}
  {#if over}<span class="sover" role="img" aria-label={t('WOF.Sheet.stress.over', { n: over })}>+{over}</span>{/if}
</div>
