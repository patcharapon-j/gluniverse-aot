<script lang="ts">
  import { tick } from 'svelte';
  import { reveal } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { motionMode, viewer } from '../../settings.svelte.ts';
  import { setSheetContext, t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import type { SoldierView } from '../soldier-view.ts';
  import EditBanner from './EditBanner.svelte';
  import Header from './Header.svelte';
  import LifepathBanner from './LifepathBanner.svelte';
  import TabKit from './TabKit.svelte';
  import TabRecord from './TabRecord.svelte';
  import TabSoldier from './TabSoldier.svelte';
  import Tabs from './Tabs.svelte';
  import TabWounds from './TabWounds.svelte';
  import Vitals from './Vitals.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<SoldierView>; sheet: any } = $props();

  // svelte-ignore state_referenced_locally
  setSheetContext({ sheet, actor: sheet.document, state: sheetState, uid: `wof-${sheet.id}` });

  const view = $derived(sheetState.view);
  const TABS = [
    { id: 'soldier', label: 'WOF.Sheet.tab.soldier' },
    { id: 'kit', label: 'WOF.Sheet.tab.kit' },
    { id: 'wounds', label: 'WOF.Sheet.tab.wounds' },
    { id: 'record', label: 'WOF.Sheet.tab.record' },
  ];

  let body: HTMLElement | undefined = $state();

  async function select(id: string) {
    if (sheetState.tab === id) return;
    sheetState.tab = id;
    await tick();
    body?.scrollTo({ top: 0 });
    reveal(body?.firstElementChild);
  }
</script>

<div class="wof-sheet" data-gore={viewer.gore} data-motion={motionMode()} data-mode={view.mode} style="--wof-loop: {MOTION.loop}ms">
  <i class="eyelet e1"></i><i class="eyelet e2"></i><i class="eyelet e3"></i>
  {#if view.mode === 'edit'}<EditBanner edge="top" text={t('WOF.Sheet.mode.bannerText')} label={t('WOF.Sheet.mode.bannerLabel')} />{/if}
  <Header {view} />
  <Vitals {view} />
  {#if view.lifepath}<LifepathBanner offer={view.lifepath} {sheet} />{/if}

  <Tabs tabs={TABS} {sheetState} {sheet} onselect={select} label={t('WOF.Sheet.tab.label')} />

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
  {#if view.mode === 'edit'}<EditBanner edge="bottom" text={t('WOF.Sheet.mode.bannerText')} label={t('WOF.Sheet.mode.bannerLabel')} />{/if}
</div>
