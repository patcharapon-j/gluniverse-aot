<script lang="ts">
  /** A clickable rating: click a pip to set the value to it, click the last filled pip to lower it by one. */
  import { t } from '../context.ts';

  let {
    value,
    max,
    min = 0,
    cls = 'da',
    disabled = false,
    label,
    onset,
  }: { value: number; max: number; min?: number; cls?: string; disabled?: boolean; label: string; onset: (v: number) => void } = $props();

  function pick(i: number) {
    const next = i === value ? i - 1 : i;
    const v = Math.min(max, Math.max(min, next));
    if (v !== value) onset(v);
  }
</script>

<span class="dots" role="group" aria-label={t('WOF.Sheet.aria.rating', { label, value, max })}>
  <span class="grp">
    {#each Array.from({ length: max }) as _, i (i)}
      <button
        type="button"
        class="pip"
        disabled={disabled || i + 1 < min}
        aria-label={t('WOF.Sheet.aria.setTo', { label, value: i + 1 })}
        aria-pressed={i < value}
        onclick={() => pick(i + 1)}
      ><i class="{cls}{i < value ? '' : ' o'}"></i></button>
    {/each}
  </span>
</span>
