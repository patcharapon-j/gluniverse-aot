<script lang="ts">
  import { tick } from 'svelte';
  import { reveal } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { motionMode, viewer } from '../../settings.svelte.ts';
  import { setSheetContext, t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import type { SoldierView } from '../soldier-view.ts';
  import Header from './Header.svelte';
  import TabKit from './TabKit.svelte';
  import TabRecord from './TabRecord.svelte';
  import TabSoldier from './TabSoldier.svelte';
  import TabWounds from './TabWounds.svelte';
  import Vitals from './Vitals.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<SoldierView>; sheet: any } = $props();

  // svelte-ignore state_referenced_locally
  setSheetContext({ sheet, actor: sheet.document, state: sheetState, uid: `wof-${sheet.id}` });

  const view = $derived(sheetState.view);
  const TABS = [
    { id: 'soldier', n: '01', label: 'WOF.Sheet.tab.soldier' },
    { id: 'kit', n: '02', label: 'WOF.Sheet.tab.kit' },
    { id: 'wounds', n: '03', label: 'WOF.Sheet.tab.wounds' },
    { id: 'record', n: '04', label: 'WOF.Sheet.tab.record' },
  ];

  let body: HTMLElement | undefined = $state();

  async function select(id: string) {
    if (sheetState.tab === id) return;
    sheetState.tab = id;
    await tick();
    body?.scrollTo({ top: 0 });
    reveal(body?.firstElementChild);
  }

  function onTabKey(event: KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = TABS[(index + step + TABS.length) % TABS.length];
    select(next.id);
    (event.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)?.focus();
  }
</script>

<div class="wof-sheet" data-gore={viewer.gore} data-motion={motionMode()} style="--wof-loop: {MOTION.loop}ms">
  <i class="eyelet e1"></i><i class="eyelet e2"></i><i class="eyelet e3"></i>
  <Header {view} />
  <Vitals {view} />

  <div class="tabs" role="tablist" aria-label={t('WOF.Sheet.tab.label')}>
    {#each TABS as tab, i (tab.id)}
      <button
        type="button"
        role="tab"
        id="{sheet.id}-tab-{tab.id}"
        data-tab={tab.id}
        aria-selected={sheetState.tab === tab.id}
        aria-controls="{sheet.id}-panel"
        tabindex={sheetState.tab === tab.id ? 0 : -1}
        onclick={() => select(tab.id)}
        onkeydown={(e) => onTabKey(e, i)}
      ><span class="n">{tab.n}</span><span class="tl">{t(tab.label)}</span></button>
    {/each}
  </div>

  <div class="body" bind:this={body} id="{sheet.id}-panel" role="tabpanel" aria-labelledby="{sheet.id}-tab-{sheetState.tab}">
    {#if sheetState.tab === 'soldier'}
      <section class="panel"><TabSoldier {view} /></section>
    {:else if sheetState.tab === 'kit'}
      <section class="panel"><TabKit {view} /></section>
    {:else if sheetState.tab === 'wounds'}
      <section class="panel"><TabWounds {view} /></section>
    {:else}
      <section class="panel"><TabRecord {view} /></section>
    {/if}
  </div>

  <footer class="foot"><span class="lbl">{t('WOF.Sheet.foot.left')}</span><span class="lbl">{t('WOF.Sheet.foot.right')}</span></footer>
</div>
