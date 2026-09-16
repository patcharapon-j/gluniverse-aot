<script lang="ts">
  /** The numbered folder tabs every sheet uses; arrow keys move between them. */
  import { t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';

  let {
    tabs,
    sheetState,
    sheet,
    onselect,
    label,
  }: { tabs: { id: string; label: string }[]; sheetState: SheetState<unknown>; sheet: any; onselect: (id: string) => void; label: string } = $props();

  function onKey(event: KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    onselect(next.id);
    (event.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)?.focus();
  }
</script>

<div class="tabs" role="tablist" aria-label={label}>
  {#each tabs as tab, i (tab.id)}
    <button
      type="button"
      role="tab"
      id="{sheet.id}-tab-{tab.id}"
      data-tab={tab.id}
      aria-selected={sheetState.tab === tab.id}
      aria-controls="{sheet.id}-panel"
      tabindex={sheetState.tab === tab.id ? 0 : -1}
      onclick={() => onselect(tab.id)}
      onkeydown={(e) => onKey(e, i)}
    ><span class="n">{String(i + 1).padStart(2, '0')}</span><span class="tl">{t(tab.label)}</span></button>
  {/each}
</div>
