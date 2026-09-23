<script lang="ts">
  /**
   * The Soldier sheet, the Refined Dossier (sheet-overhaul plan): the slim header and the vitals
   * band over the pages, the index tabs on the file's right edge, the footer on the binder
   * (FileFrame). The Lifepath banner stands between the band and the pages.
   */
  import { setHoverCards, setSheetContext, t } from '../context.ts';
  import { HoverCards } from '../hover.svelte.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import type { SoldierView } from '../soldier-view.ts';
  import DetailCards from './DetailCards.svelte';
  import FileFrame from './FileFrame.svelte';
  import Header from './Header.svelte';
  import LifepathBanner from './LifepathBanner.svelte';
  import TabKit from './TabKit.svelte';
  import TabRecord from './TabRecord.svelte';
  import TabSoldier from './TabSoldier.svelte';
  import TabWounds from './TabWounds.svelte';
  import Vitals from './Vitals.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<SoldierView>; sheet: any } = $props();

  // svelte-ignore state_referenced_locally
  setSheetContext({ sheet, actor: sheet.document, state: sheetState, uid: `wof-${sheet.id}` });
  const hover = new HoverCards();
  setHoverCards(hover);

  const view = $derived(sheetState.view);
  /** The index tabs, each with its colour mark (the preview's red, iron, green, brass). */
  const TABS = [
    { id: 'soldier', label: 'WOF.Sheet.tab.soldier', tc: 'var(--red)' },
    { id: 'kit', label: 'WOF.Sheet.tab.kit', tc: 'var(--iron-hi)' },
    { id: 'wounds', label: 'WOF.Sheet.tab.wounds', tc: 'var(--agi)' },
    { id: 'record', label: 'WOF.Sheet.tab.record', tc: 'var(--brass)' },
  ];
</script>

<FileFrame
  {sheet}
  {sheetState}
  mode={view.mode}
  tabs={TABS}
  tabLabel={t('WOF.Sheet.tab.label')}
  footLeft={t('WOF.Sheet.foot.left')}
  footRight={t('WOF.Sheet.foot.right')}
  cls="soldier"
>
  {#snippet top()}
    <Header {view} />
    <Vitals {view} />
    {#if view.lifepath}<LifepathBanner offer={view.lifepath} {sheet} />{/if}
  {/snippet}
  {#snippet page(tab)}
    {#if tab === 'kit'}
      <TabKit {view} />
    {:else if tab === 'wounds'}
      <TabWounds {view} />
    {:else if tab === 'record'}
      <TabRecord {view} />
    {:else}
      <TabSoldier {view} />
    {/if}
  {/snippet}
</FileFrame>
<DetailCards {hover} />
