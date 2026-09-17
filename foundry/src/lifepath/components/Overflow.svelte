<script lang="ts">
  /** A point that would pass 5 goes to another attribute below 5, which the player names (attributes.yaml, overflow). */
  import { t } from '../../sheets/context.ts';
  import { attrIcon, attrName } from './helpers.ts';

  let { from, needs, value, cap, locked = false, disabled = false, onpick }: { from: string; needs: string[] | null; value: string | null; cap: number; locked?: boolean; disabled?: boolean; onpick: (a: string) => void } = $props();
  const list = $derived(needs ?? (value ? [value] : []));
</script>

<div class="lp-overflow" role="group" aria-label={t('WOF.Lifepath.overflow.label')}>
  <p class="note red-text">{t('WOF.Lifepath.overflow.text', { a: attrName(from), cap })}</p>
  <div class="seg">
    {#each list as a (a)}
      <button type="button" class="s-{a}" aria-pressed={value === a} disabled={disabled || locked} onclick={() => onpick(a)}><img class="ic s16" src={attrIcon(a)} alt="" />{attrName(a)}</button>
    {/each}
  </div>
  {#if value && !needs}<p class="note">{t('WOF.Lifepath.overflow.done', { a: attrName(value) })}</p>{/if}
</div>
