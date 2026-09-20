<script lang="ts">
  /** Play or Edit: the two-state switch every character sheet carries in its header (mode.ts). */
  import { tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import type { SheetMode } from '../mode.ts';

  let { mode, editable = false }: { mode: SheetMode; editable?: boolean } = $props();
  const { sheet } = sheetContext();

  const MODES: { id: SheetMode; label: string; tip: string; icon: string }[] = [
    { id: 'play', label: 'WOF.Sheet.mode.play', tip: 'WOF.Sheet.mode.playTip', icon: 'fa-dice-d6' },
    { id: 'edit', label: 'WOF.Sheet.mode.edit', tip: 'WOF.Sheet.mode.editTip', icon: 'fa-pen-to-square' },
  ];
</script>

{#if editable}
  <span class="modesw" role="group" aria-label={t('WOF.Sheet.mode.label')}>
    {#each MODES as m (m.id)}
      <button
        type="button"
        class="mini tiny"
        class:on={mode === m.id}
        aria-pressed={mode === m.id}
        use:tooltip={t(m.tip)}
        onclick={() => sheet.setSheetMode(m.id)}
      ><i class="fa-solid {m.icon}" inert></i>{t(m.label)}</button>
    {/each}
  </span>
{/if}
