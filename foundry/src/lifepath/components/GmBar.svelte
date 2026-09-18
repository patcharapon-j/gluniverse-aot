<script lang="ts">
  /**
   * The GM's controls over one soldier's Lifepath file. The rules give the GM no part in the Lifepath
   * (Chapter 2, section 2.3), so nothing here is a rule: it exists so a table can correct a misclick,
   * run a step again, override a roll, or hand a player a file made away from the table (ADR-0024).
   * Every button below is refused for a player by wizard.ts, whatever the sheet shows.
   */
  import { t } from '../../sheets/context.ts';
  import type { StepId } from '../../rules/lifepath-state.ts';
  import type { WizardView } from '../wizard-app.ts';

  let { view, sheet }: { view: WizardView; sheet: any } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const act = $derived(view.act);
  const step = $derived(s.step);
  const yearIndex = $derived(['year-1', 'year-2', 'year-3'].indexOf(step));

  let tens = $state(1);
  let units = $state(1);
  let successes = $state(0);

  async function confirmThen(title: string, hint: string, run: () => Promise<void>) {
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title },
      classes: ['wof-pick'],
      content: `<p class="hint">${foundry.utils.escapeHTML(hint)}</p>`,
    });
    if (ok) await run();
  }
</script>

<section class="lp-gm" aria-label={t('WOF.Lifepath.gm.title')}>
  <div class="gm-row">
    <span class="gm-tag">{t('WOF.Lifepath.gm.tag')}</span>
    <label class="check">
      <input type="checkbox" checked={view.gmOverride} onchange={() => sheet.toggleOverride()} />
      {t('WOF.Lifepath.gm.override')}
    </label>
    <span class="note">{t(view.gmOverride ? 'WOF.Lifepath.gm.overrideOn' : 'WOF.Lifepath.gm.overrideOff')}</span>
  </div>

  <div class="gm-row">
    <label class="gm-field">
      <span class="lbl">{t('WOF.Lifepath.gm.step')}</span>
      <select value={step} onchange={(e) => act.gmGoTo(e.currentTarget.value as StepId)}>
        {#each r.rail as id, i (id)}<option value={id}>{String(i + 1).padStart(2, '0')} · {t(`WOF.Lifepath.step.${id}`)}</option>{/each}
      </select>
    </label>
    <button type="button" class="mini" onclick={() => confirmThen(t('WOF.Lifepath.gm.clearStep.title'), t('WOF.Lifepath.gm.clearStep.hint'), async () => act.gmClearStep(step))}>
      <i class="fa-solid fa-eraser" inert></i>{t('WOF.Lifepath.gm.clearFrom')}
    </button>
    {#if s.finished}
      <button type="button" class="mini" onclick={() => act.gmUnfinish()}><i class="fa-solid fa-folder-open" inert></i>{t('WOF.Lifepath.gm.reopen')}</button>
    {/if}
    <button type="button" class="mini red" onclick={() => confirmThen(t('WOF.Lifepath.gm.restart.title'), t('WOF.Lifepath.gm.restart.hint'), async () => act.gmRestart(true))}>
      <i class="fa-solid fa-rotate-left" inert></i>{t('WOF.Lifepath.gm.restartLabel')}
    </button>
  </div>

  <!-- The rolls of the open step, so a misrolled table can be written by hand or thrown away. -->
  {#if step === 'origin' || step === 'enlist' || yearIndex >= 0}
    <div class="gm-row">
      <span class="lbl">{t('WOF.Lifepath.gm.setD66')}</span>
      <input type="number" min="1" max="6" bind:value={tens} aria-label={t('WOF.Lifepath.card.tens')} />
      <input type="number" min="1" max="6" bind:value={units} aria-label={t('WOF.Lifepath.card.units')} />
      <button type="button" class="mini" onclick={() => act.gmSetD66(step === 'origin' ? 'origin' : step === 'enlist' ? 'enlist' : (yearIndex as 0 | 1 | 2), tens, units)}>
        {t('WOF.Lifepath.gm.write')}
      </button>
      <button type="button" class="mini" onclick={() => act.gmClearRoll(step === 'origin' ? 'origin' : step === 'enlist' ? 'enlist' : `years.${yearIndex}.event`)}>
        {t('WOF.Lifepath.gm.clearRoll')}
      </button>
    </div>
    {#if yearIndex >= 0 && !r.years[yearIndex]?.skipPerformance}
      <div class="gm-row">
        <span class="lbl">{t('WOF.Lifepath.gm.setSuccesses')}</span>
        <input type="number" min="0" max="12" bind:value={successes} aria-label={t('WOF.Lifepath.gm.setSuccesses')} />
        <button type="button" class="mini" onclick={() => act.gmSetPerformance(yearIndex, successes)}>{t('WOF.Lifepath.gm.writePerformance')}</button>
        <button type="button" class="mini" onclick={() => act.gmClearRoll(`years.${yearIndex}.perf`)}>{t('WOF.Lifepath.gm.clearRoll')}</button>
      </div>
    {/if}
  {/if}

  {#if step === 'exam'}
    <div class="gm-row">
      <span class="lbl">{t('WOF.Lifepath.gm.board')}</span>
      <input type="number" min="1" max="6" bind:value={tens} aria-label={t('WOF.Lifepath.card.tens')} />
      <input type="number" min="1" max="6" bind:value={units} aria-label={t('WOF.Lifepath.card.units')} />
      <span class="note">{t('WOF.Lifepath.gm.boardNote')}</span>
      <button type="button" class="mini" onclick={() => act.gmClearBoard(null)}>{t('WOF.Lifepath.gm.clearBoardAll')}</button>
    </div>
    {#each r.trials as d, k (d.stage.id)}
      <div class="gm-row">
        <span class="lbl">{k + 1}. {d.stage.name}</span>
        <button type="button" class="mini" onclick={() => act.gmSetBoard(k, tens, units)}>{t('WOF.Lifepath.gm.write')}</button>
        <button type="button" class="mini" onclick={() => act.gmClearBoard(k)}>{t('WOF.Lifepath.gm.clearBoard')}</button>
        <input type="number" min="0" max="12" bind:value={successes} aria-label={t('WOF.Lifepath.gm.setSuccesses')} />
        <button type="button" class="mini" onclick={() => act.gmSetTrial(k, successes)}>{t('WOF.Lifepath.gm.writeTrial')}</button>
        <button type="button" class="mini" onclick={() => act.gmClearRoll(`trials.${k}.dice`)}>{t('WOF.Lifepath.gm.clearRoll')}</button>
      </div>
    {/each}
  {/if}
</section>
