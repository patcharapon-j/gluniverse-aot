<script lang="ts">
  /** Step 0: the procedure, the Campaign Year, and the Exam vote (lifepath.yaml, campaign-year). */
  import { PROCEDURES } from '../../rules/lifepath.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { iconPath } from '../../art.ts';
  import Pick from './Pick.svelte';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const locks = $derived(view.r.locks);
  const ro = $derived(!view.editable || s.finished);
  const act = $derived(view.act);
  const years = $derived(Array.from({ length: view.tables.campaignYears.max - view.tables.campaignYears.min + 1 }, (_, i) => view.tables.campaignYears.min + i));
  const built = $derived(s.procedure === 'template-build' || s.procedure === 'free-build');
  const buildSteps = $derived(view.page.sections['the-build-steps']);

  const procedures = $derived(
    PROCEDURES.map((p) => ({
      id: p,
      title: t(`WOF.Lifepath.procedure.${p}.title`),
      sub: t(`WOF.Lifepath.procedure.${p}.sub`),
      icon: iconPath(p === 'lifepath' ? 'die-base' : p === 'template-build' ? 'specialty-slayer' : 'seal-wax'),
      disabled: !view.allowed.includes(p),
      note: t('WOF.Lifepath.procedure.notAllowed'),
    })),
  );
  const exam = $derived([
    { id: 'yes', title: t('WOF.Lifepath.exam.run'), sub: t('WOF.Lifepath.exam.runSub'), icon: iconPath('action-squad-action') },
    { id: 'no', title: t('WOF.Lifepath.exam.skip'), sub: t('WOF.Lifepath.exam.skipSub'), icon: iconPath('action-performance-roll') },
  ]);
</script>

<Sec {n} title={t('WOF.Lifepath.step.campaign')} hint={t('WOF.Lifepath.campaign.hint')} />
<WordText blocks={view.page.sections['before-the-lifepath'].slice(0, 2)} />

<div class="lp-block">
  <h4 class="lp-q">{t('WOF.Lifepath.campaign.procedure')}</h4>
  <Pick options={procedures} value={s.procedure} label={t('WOF.Lifepath.campaign.procedure')} locked={locks.has('procedure')} disabled={ro} cols={3} onpick={(id) => act.choose('procedure', id)} />
  {#if view.allowed.length === 1}<p class="note">{t('WOF.Lifepath.procedure.onlyLifepath')}</p>{/if}
  {#if built && buildSteps}<WordText blocks={view.page.boxes['What only the Lifepath reaches']} compact />{/if}
</div>

<div class="lp-block">
  <h4 class="lp-q">{t('WOF.Lifepath.campaign.year')}</h4>
  {#if view.worldYear !== null}
    <p class="lp-fixed"><b class="lp-year">{view.worldYear}</b><span class="note">{t('WOF.Lifepath.campaign.yearFixed')}</span></p>
  {:else}
    <div class="seg lp-years" role="group" aria-label={t('WOF.Lifepath.campaign.year')}>
      {#each years as y (y)}
        <button type="button" aria-pressed={s.year === y} disabled={ro || locks.has('year')} onclick={() => act.choose('year', y)}>{y}</button>
      {/each}
    </div>
    <p class="note">{t(locks.has('year') ? 'WOF.Lifepath.campaign.yearLocked' : 'WOF.Lifepath.campaign.yearOpen')}</p>
  {/if}
</div>

{#if !built}
  <div class="lp-block">
    <h4 class="lp-q">{t('WOF.Lifepath.campaign.exam')}</h4>
    <Pick options={exam} value={s.exam === null ? null : s.exam ? 'yes' : 'no'} label={t('WOF.Lifepath.campaign.exam')} locked={locks.has('exam')} disabled={ro || !s.procedure} onpick={(id) => act.choose('exam', id === 'yes')} />
    <WordText blocks={view.page.sections['using-the-exam']} compact />
  </div>
{/if}
