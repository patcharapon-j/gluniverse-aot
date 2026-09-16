<script lang="ts">
  /**
   * A set of choice slips: one is picked (stamped), the rest stay open. A locked set shows the pick
   * and why it cannot change.
   */
  import type { Snippet } from 'svelte';
  import { t } from '../../sheets/context.ts';
  import type { PickOption } from './helpers.ts';
  import { settle } from './motion.ts';

  let {
    options,
    value,
    label,
    locked = false,
    disabled = false,
    cols = 2,
    onpick,
    extra,
  }: {
    options: PickOption[];
    value: string | null;
    label: string;
    locked?: boolean;
    disabled?: boolean;
    cols?: number;
    onpick: (id: string) => void;
    extra?: Snippet<[PickOption]>;
  } = $props();
</script>

<div class="picks" role="radiogroup" aria-label={label} style="--cols: {cols}">
  {#each options as o (o.id)}
    {@const on = o.id === value}
    <button
      type="button"
      role="radio"
      class="pick {o.ink ?? ''}"
      class:on
      aria-checked={on}
      disabled={disabled || o.disabled || (locked && !on)}
      title={locked ? t('WOF.Lifepath.locked') : o.note}
      onclick={() => !on && !locked && onpick(o.id)}
    >
      {#if o.icon}<img class="pk-ic" src={o.icon} alt="" />{/if}
      <span class="pk-body">
        <span class="pk-title">{o.title}{#if o.badge}<span class="pk-badge">{o.badge}</span>{/if}</span>
        {#if o.sub}<span class="pk-sub">{o.sub}</span>{/if}
        {#if o.meta}<span class="pk-meta">{o.meta}</span>{/if}
        {#if o.note && o.disabled}<span class="pk-note">{o.note}</span>{/if}
        {#if extra}{@render extra(o)}{/if}
      </span>
      {#if on}<span class="stamp pk-stamp" use:settle>{t(locked ? 'WOF.Lifepath.fixed' : 'WOF.Lifepath.chosen')}</span>{/if}
    </button>
  {/each}
</div>
