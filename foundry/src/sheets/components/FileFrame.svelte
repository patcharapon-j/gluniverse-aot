<script lang="ts">
  /**
   * The Dossier frame the Soldier and Squadmate sheets share (sheet-overhaul plan, 3.1 and 12.1):
   * the paper (`.wof-sheet.file`) with its eyelets and the Edit strips on its top and bottom edge,
   * the index tabs standing out of its right edge, and the footer tooled into the binder below.
   *
   * `top` is what stands above the pages (the header, the band, a banner); `page` renders the
   * selected tab. Whatever changes the tab (an index tab, the keyboard, a band chip) brings the
   * page in from the right and scrolls it to the top.
   */
  import { tick, untrack, type Snippet } from 'svelte';
  import { slideIn } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { motionMode, viewer } from '../../settings.svelte.ts';
  import { t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import EditBanner from './EditBanner.svelte';
  import Tabs from './Tabs.svelte';

  let {
    sheet,
    sheetState,
    mode,
    tabs,
    tabLabel,
    footLeft,
    footRight,
    cls = '',
    top,
    page,
  }: {
    sheet: any;
    sheetState: SheetState<any>;
    mode: string;
    tabs: { id: string; label: string; tc?: string }[];
    tabLabel: string;
    footLeft: string;
    footRight: string;
    /** Extra classes on the paper (`soldier`, `squad`). */
    cls?: string;
    top: Snippet;
    page: Snippet<[string]>;
  } = $props();

  let panel: HTMLElement | undefined = $state();
  let shownTab: string | null = null;

  function select(id: string) {
    sheetState.tab = id;
  }

  $effect(() => {
    const tab = sheetState.tab;
    untrack(() => {
      const first = shownTab === null;
      if (tab === shownTab) return;
      shownTab = tab;
      if (first) return;
      tick().then(() => {
        panel?.scrollTo({ top: 0 });
        slideIn(panel);
      });
    });
  });
</script>

<div class="wof-file" data-motion={motionMode()} data-tooltip-class="wof-tip">
  <div class="wof-file-main">
    <div class="wof-sheet file {cls}" data-gore={viewer.gore} data-motion={motionMode()} data-mode={mode} style="--wof-loop: {MOTION.loop}ms">
      <i class="eyelet e1"></i><i class="eyelet e2"></i><i class="eyelet e3"></i>
      {#if mode === 'edit'}<EditBanner edge="top" text={t('WOF.Sheet.mode.bannerText')} label={t('WOF.Sheet.mode.bannerLabel')} />{/if}
      {@render top()}
      <div class="pages">
        <div class="panel" bind:this={panel} id="{sheet.id}-panel" role="tabpanel" aria-labelledby="{sheet.id}-tab-{sheetState.tab}">
          {@render page(sheetState.tab)}
        </div>
      </div>
      {#if mode === 'edit'}<EditBanner edge="bottom" text={t('WOF.Sheet.mode.bannerText')} label={t('WOF.Sheet.mode.bannerLabel')} />{/if}
    </div>
    <Tabs {tabs} {sheetState} {sheet} onselect={select} label={tabLabel} edge="right" />
  </div>
  <footer class="wof-file-foot" aria-hidden="true"><span>{footLeft}</span><span>{footRight}</span></footer>
</div>
