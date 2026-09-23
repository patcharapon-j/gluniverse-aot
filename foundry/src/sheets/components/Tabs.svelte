<script lang="ts">
  /**
   * The numbered tabs of a sheet. The default is the row of folder tabs the Titan window uses;
   * `edge="right"` draws the Dossier's index tabs standing out of the file's right edge, each with
   * its colour mark (`tc`). Both answer the arrows in either axis, Home and End (tab-keys.ts).
   */
  import { t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import { nextTab } from '../tab-keys.ts';

  let {
    tabs,
    sheetState,
    sheet,
    onselect,
    label,
    edge = 'row',
  }: {
    tabs: { id: string; label: string; tc?: string }[];
    sheetState: SheetState<unknown>;
    sheet: any;
    onselect: (id: string) => void;
    label: string;
    edge?: 'row' | 'right';
  } = $props();

  function onKey(event: KeyboardEvent, index: number) {
    const to = nextTab(event.key, index, tabs.length);
    if (to === null) return;
    event.preventDefault();
    const next = tabs[to];
    onselect(next.id);
    (event.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)?.focus();
  }
</script>

<div
  class={edge === 'right' ? 'itabs' : 'tabs'}
  role="tablist"
  aria-label={label}
  aria-orientation={edge === 'right' ? 'vertical' : 'horizontal'}
>
  {#each tabs as tab, i (tab.id)}
    <button
      type="button"
      role="tab"
      class:itab={edge === 'right'}
      id="{sheet.id}-tab-{tab.id}"
      data-tab={tab.id}
      style={tab.tc ? `--tc:${tab.tc}` : undefined}
      aria-selected={sheetState.tab === tab.id}
      aria-controls="{sheet.id}-panel"
      tabindex={sheetState.tab === tab.id ? 0 : -1}
      onclick={() => onselect(tab.id)}
      onkeydown={(e) => onKey(e, i)}
    ><span class="n">{String(i + 1).padStart(2, '0')}</span><span class="tl">{t(tab.label)}</span></button>
  {/each}
</div>
