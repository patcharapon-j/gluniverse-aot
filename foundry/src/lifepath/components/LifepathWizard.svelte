<script lang="ts">
  /** The Lifepath wizard (foundry/docs/lifepath-wizard-plan.md, section 7): rail, step, and the running file. */
  import { tick } from 'svelte';
  import { iconPath } from '../../art.ts';
  import { reveal } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { motionMode, viewer } from '../../settings.svelte.ts';
  import DetailCards from '../../sheets/components/DetailCards.svelte';
  import { setHoverCards, setSheetContext, t } from '../../sheets/context.ts';
  import { HoverCards } from '../../sheets/hover.svelte.ts';
  import type { SheetState } from '../../sheets/sheet-state.svelte.ts';
  import type { StepId } from '../../rules/lifepath-state.ts';
  import type { WizardView } from '../wizard-app.ts';
  import FileSummary from './FileSummary.svelte';
  import GmBar from './GmBar.svelte';
  import { stampDown } from './motion.ts';
  import StepAttributes from './StepAttributes.svelte';
  import StepCampaign from './StepCampaign.svelte';
  import StepEnlist from './StepEnlist.svelte';
  import StepExam from './StepExam.svelte';
  import StepFinish from './StepFinish.svelte';
  import StepGraduation from './StepGraduation.svelte';
  import StepMerit from './StepMerit.svelte';
  import StepOrigin from './StepOrigin.svelte';
  import StepRail from './StepRail.svelte';
  import StepSpecialty from './StepSpecialty.svelte';
  import StepSquad from './StepSquad.svelte';
  import StepStories from './StepStories.svelte';
  import StepTalents from './StepTalents.svelte';
  import StepYear from './StepYear.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<WizardView>; sheet: any } = $props();

  // svelte-ignore state_referenced_locally
  setSheetContext({ sheet, actor: sheet.document, state: sheetState as any, uid: `wof-lp-${sheet.id}` });
  const hover = new HoverCards();
  setHoverCards(hover);

  const view = $derived(sheetState.view);
  const s = $derived(view.state);
  const r = $derived(view.r);
  const step = $derived(s.step);
  const n = $derived(r.rail.indexOf(step) + 1);
  const status = $derived(r.status[step]);
  const ro = $derived(!view.editable);
  const procedureLabel = $derived(s.procedure ? t(`WOF.Lifepath.procedure.${s.procedure}.title`) : t('WOF.Lifepath.procedure.none'));

  let main: HTMLElement | undefined = $state();
  let stampEl: HTMLElement | undefined = $state();
  let stamping = $state(false);
  let shown = '';

  $effect(() => {
    const now = step;
    if (now === shown) return;
    const first = shown === '';
    shown = now;
    if (first) return;
    tick().then(() => {
      main?.scrollTo({ top: 0 });
      reveal(main?.querySelector('.lp-page'));
    });
  });

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function confirm(id: StepId) {
    if (status === 'done') {
      await view.act.goTo(r.rail[r.rail.indexOf(id) + 1]);
      return;
    }
    stamping = true;
    await tick();
    stampDown(stampEl);
    if (motionMode() !== 'off') await wait(motionMode() === 'reduced' ? MOTION.reducedMax : MOTION.weighty);
    await view.act.confirm(id);
    stamping = false;
  }

  const statusText = $derived.by(() => {
    if (s.finished && step !== 'squad') return t('WOF.Lifepath.status.filed');
    if (step === 'finish') return t(r.final ? (r.final.name ? 'WOF.Lifepath.status.sign' : 'WOF.Lifepath.status.name') : 'WOF.Lifepath.status.todo');
    if (r.locks.size && ['campaign', 'origin', 'enlist', 'year-1', 'year-2', 'year-3', 'exam'].includes(step) && status === 'done') return t('WOF.Lifepath.status.review');
    return t(`WOF.Lifepath.status.${status}`);
  });
</script>

<div class="wof-sheet lp" data-motion={motionMode()} data-gore={viewer.gore}>
  <i class="eyelet e1"></i><i class="eyelet e2"></i><i class="eyelet e3"></i>
  <header class="lp-head">
    <div class="lp-ident">
      <div class="kicker">
        <img class="ic s16" src={iconPath('brand-emblem')} alt="" />
        {t('WOF.Lifepath.kicker')}
        <span class="serial">{procedureLabel}</span>
      </div>
      <h2 class="lp-name">{s.finish.name.trim() || view.actor.name}</h2>
      <p class="lp-lede">{t(`WOF.Lifepath.lede.${s.procedure ?? 'none'}`)}</p>
    </div>
    <div class="crest"><img src={iconPath('seal-wax')} alt="" /></div>
  </header>

  <div class="lp-grid">
    <StepRail {view} />
    <section class="lp-main" bind:this={main} aria-label={t(`WOF.Lifepath.step.${step}`)}>
      {#if view.isGM}<GmBar {view} {sheet} />{/if}
      <div class="lp-page" data-step={step}>
        {#if step === 'campaign'}<StepCampaign {view} {n} />
        {:else if step === 'origin'}<StepOrigin {view} {n} />
        {:else if step === 'enlist' || step === 'drive'}<StepEnlist {view} {n} />
        {:else if step === 'year-1'}<StepYear {view} {n} i={0} />
        {:else if step === 'year-2'}<StepYear {view} {n} i={1} />
        {:else if step === 'year-3'}<StepYear {view} {n} i={2} />
        {:else if step === 'exam'}<StepExam {view} {n} />
        {:else if step === 'graduation'}<StepGraduation {view} {n} />
        {:else if step === 'specialty'}<StepSpecialty {view} {n} />
        {:else if step === 'attributes'}<StepAttributes {view} {n} />
        {:else if step === 'stories'}<StepStories {view} {n} />
        {:else if step === 'talents'}<StepTalents {view} {n} />
        {:else if step === 'merit'}<StepMerit {view} {n} />
        {:else if step === 'finish'}<StepFinish {view} {n} />
        {:else}<StepSquad {view} {n} />
        {/if}
      </div>
      {#if stamping}<div class="lp-stampover" aria-hidden="true"><span class="stamp big-stamp" bind:this={stampEl}>{t('WOF.Lifepath.filedStamp')}</span></div>{/if}
    </section>
    <FileSummary {view} />
  </div>

  <footer class="lp-foot">
    <button type="button" class="mini" disabled={ro || step === r.rail[0] || stamping} onclick={() => view.act.back()}>
      <i class="fa-solid fa-arrow-left" inert></i>{t('WOF.Lifepath.back')}
    </button>
    <span class="lp-status" class:ok={status === 'ready' || status === 'done' || (step === 'finish' && !!r.final?.name)} aria-live="polite">{statusText}</span>
    {#if step === 'squad'}
      <button type="button" class="mini red" disabled={ro || !s.finished || stamping} onclick={async () => { await view.act.closeFile(); sheet.close(); }}>
        <i class="fa-solid fa-folder-closed" inert></i>{t('WOF.Lifepath.squad.close')}
      </button>
    {:else if step !== 'finish'}
      <button type="button" class="mini red" disabled={ro || stamping || (status !== 'ready' && status !== 'done')} onclick={() => confirm(step)}>
        {#if status === 'done'}{t('WOF.Lifepath.next')}<i class="fa-solid fa-arrow-right" inert></i>{:else}<i class="fa-solid fa-stamp" inert></i>{t('WOF.Lifepath.confirm')}{/if}
      </button>
    {:else}
      <span class="lp-foot-gap"></span>
    {/if}
  </footer>
</div>
<DetailCards {hover} />
