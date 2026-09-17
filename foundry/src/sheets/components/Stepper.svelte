<script lang="ts">
  import { t } from '../context.ts';
  /** − value + for a whole-number field. */
  let {
    value,
    min = 0,
    max = Infinity,
    label,
    disabled = false,
    show = true,
    onset,
  }: { value: number; min?: number; max?: number; label: string; disabled?: boolean; show?: boolean; onset: (v: number) => void } = $props();
</script>

<span class="stepper" role="group" aria-label={label}>
  <button type="button" disabled={disabled || value <= min} aria-label={t('WOF.Sheet.aria.lower', { label })} onclick={() => onset(value - 1)}>−</button>
  {#if show}<output>{value}</output>{/if}
  <button type="button" disabled={disabled || value >= max} aria-label={t('WOF.Sheet.aria.raise', { label })} onclick={() => onset(value + 1)}>+</button>
</span>
