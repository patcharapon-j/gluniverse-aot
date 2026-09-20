<script lang="ts">
  /**
   * The Health row as square track boxes: held boxes are red stamps, damage is an inked slash, and a
   * box an untreated Critical Injury crosses off is barred dark with the injury's glyph.
   *
   * The Health formula is `2 + ceil((Strength + Agility) / 2)` (round 3, decision 1), so the row is 4
   * to 8 boxes rather than 2 to 4. A row of 8 at this box size is wider than the Health column of the
   * vitals strip, so a long row lays out as two even rows of at most four rather than stretching the
   * column or leaving one box hanging: the pairs stay easy to count at the table, and the strip's
   * proportions are untouched.
   */
  import { tick } from 'svelte';
  import { inkIn, inkOut } from '../../motion/fx.ts';
  import type { HealthCell } from '../../rules/harm.ts';
  import { tooltip } from '../actions.ts';
  import { t } from '../context.ts';
  import type { InjuryView } from '../soldier-view.ts';

  let {
    cells,
    disabled = false,
    size = 'md',
    onbox,
  }: { cells: HealthCell<InjuryView>[]; disabled?: boolean; size?: 'md' | 'lg'; onbox: (i: number) => void } = $props();

  let el: HTMLElement | undefined = $state();
  let prev: string[] | null = null;

  /**
   * Boxes a row. The large row of the Wounds tab has the width for all eight on one line; the row in
   * the vitals strip does not, so it lays out as two even rows of at most four.
   */
  const cols = $derived(size === 'lg' || cells.length <= 4 ? Math.max(1, cells.length) : Math.min(4, Math.ceil(cells.length / 2)));

  const where = (w: InjuryView) => [w.side ? t(`WOF.Side.${w.side}`) : '', w.locationLabel].filter(Boolean).join(' ');
  const label = (c: HealthCell<InjuryView>, i: number) =>
    c.blocker ? t('WOF.Sheet.health.box.blocked', { n: i + 1, name: c.blocker.name }) : t(`WOF.Sheet.health.box.${c.state}`, { n: i + 1 });
  const tip = (c: HealthCell<InjuryView>) =>
    c.state !== 'crossed' ? null : c.blocker ? t('WOF.Sheet.health.blockedTip', { name: c.blocker.name, where: where(c.blocker) }) : t('WOF.Sheet.health.crossedTip');

  // Animate whichever boxes changed, whatever changed them (a click, the stepper, another client).
  $effect(() => {
    const now = cells.map((c) => c.state);
    const before = prev;
    prev = now;
    if (!before) return;
    tick().then(() => {
      const boxes = [...(el?.querySelectorAll('.hbox') ?? [])];
      const changed = (want: (s: string) => boolean) => boxes.filter((_, i) => now[i] !== before[i] && want(now[i]));
      inkIn(changed((s) => s !== 'clean'));
      inkOut(changed((s) => s === 'clean'));
    });
  });
</script>

<div class="boxes track-row health-row {size}" style="--track-cols:{cols}" role="group" aria-label={t('WOF.Sheet.health.boxes')} bind:this={el}>
  {#each cells as c, i (i)}
    <button
      type="button"
      class="hbox {c.state === 'clean' ? 'held' : c.state}"
      class:blocked={c.state === 'crossed'}
      disabled={disabled || c.state === 'crossed'}
      aria-label={label(c, i)}
      use:tooltip={tip(c)}
      onclick={() => onbox(i)}
    >
      {#if c.state === 'damaged'}
        <svg class="ink" viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="M4.2 16.3C8 12.1 11.6 8.2 15.9 3.6" /></svg>
      {:else if c.state === 'crossed'}
        {#if c.blocker}<img class="glyph" src={c.blocker.img} alt="" />{:else}<i class="glyph fa-solid fa-xmark" aria-hidden="true"></i>{/if}
      {/if}
    </button>
  {/each}
</div>
