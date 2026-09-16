<script lang="ts">
  /** The Graduation Exam (graduation-exam.yaml): three Trials in order, replacing the Year 3 performance roll. */
  import { iconPath } from '../../art.ts';
  import Stepper from '../../sheets/components/Stepper.svelte';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { attrName, die, entryIcon, entryName, signed } from './helpers.ts';
  import { slideIn, tumble } from './motion.ts';
  import Pick from './Pick.svelte';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const act = $derived(view.act);
  const ro = $derived(!view.editable || s.finished);
  const locks = $derived(r.locks);
  const levels = $derived(r.levels['year-3'] ?? {});
  /** A Trial opens once every Trial before it is rolled (every Cadet finishes one before the next). */
  const opened = $derived(s.trials.map((_, k) => k === 0 || !!s.trials[k - 1].dice));

  const company = $derived([
    { id: 'alone', title: t('WOF.Lifepath.exam.alone'), sub: t('WOF.Lifepath.exam.aloneSub') },
    { id: 'group', title: t('WOF.Lifepath.exam.group'), sub: t('WOF.Lifepath.exam.groupSub') },
  ]);
  const blockText = (b: string | null) => (b ? t(`WOF.Lifepath.exam.block.${b}`) : '');
</script>

<Sec {n} title={t('WOF.Lifepath.step.exam')} hint={t('WOF.Lifepath.exam.hint')} />
<WordText blocks={view.page.sections['how-the-exam-is-played']} compact />
<details class="lp-more">
  <summary>{t('WOF.Lifepath.exam.trialsRules')}</summary>
  <WordText blocks={view.page.sections['the-three-trials']} compact />
</details>

<div class="lp-block">
  <h4 class="lp-q">{t('WOF.Lifepath.exam.company')}</h4>
  <Pick options={company} value={s.alone ? 'alone' : 'group'} label={t('WOF.Lifepath.exam.company')} locked={locks.has('alone')} disabled={ro} onpick={(id) => act.choose('alone', id === 'alone')} />
</div>

{#each r.trials as d, k (d.trial.id)}
  {@const ts = s.trials[k]}
  {#if opened[k]}
    <article class="slip trial" use:slideIn>
      <header class="slip-h">
        <img class="ic s32" src={d.choice ? entryIcon(d.choice.entry) : iconPath('action-squad-action')} alt="" />
        <div>
          <h4><span class="lbl">{t('WOF.Lifepath.exam.trialN', { n: k + 1 })}</span> {d.trial.name}</h4>
          <p class="slip-d">{d.trial.description}</p>
        </div>
        {#if ts.dice}<span class="stamp trial-stamp" class:ok={(d.merit ?? 0) > 0}>{t('WOF.Lifepath.meritChip', { merit: signed(d.merit ?? 0) })}</span>{/if}
      </header>

      {#if !s.alone}
        <div class="lp-rollbar">
          <button type="button" class="mini" disabled={ro || !!ts.dice} onclick={() => act.rollOrder(k)}><img src={iconPath('die-base')} alt="" />{t('WOF.Lifepath.exam.rollOrder')}</button>
          {#if ts.order.length}
            <span class="dset" use:tumble>{#each ts.order as f, j (j)}{@html die('base', f, { plain: true })}{/each}</span>
            <span class="note">{t('WOF.Lifepath.exam.orderNote')}</span>
          {:else}
            <span class="note">{t('WOF.Lifepath.exam.orderFirst')}</span>
          {/if}
        </div>
      {/if}

      {#if d.trial.choices.length > 1}
        <h5 class="lp-q">{t('WOF.Lifepath.exam.entry', { needs: d.trial.needs })}</h5>
        <Pick
          options={d.trial.choices.map((c) => ({ id: c.entry, title: entryName(c.entry), sub: c.gear ?? t('WOF.Lifepath.exam.noGear'), meta: attrName(view.tables.entryAttributes[c.entry]), icon: entryIcon(c.entry) }))}
          value={ts.entry}
          label={t('WOF.Lifepath.exam.entry', { needs: d.trial.needs })}
          locked={locks.has(`trials.${k}.entry`)}
          disabled={ro}
          cols={3}
          onpick={(id) => act.choose(`trials.${k}.entry`, id)}
        />
      {/if}

      {#if d.choice}
        <div class="trial-opts">
          {#if d.choice.entry === 'read' && (levels['hunters-eye'] ?? 0) > 0}
            <label class="check"><input type="checkbox" checked={ts.hunterEye} disabled={ro || locks.has(`trials.${k}.hunterEye`)} onchange={(e) => act.choose(`trials.${k}.hunterEye`, e.currentTarget.checked)} />{t('WOF.Lifepath.exam.hunterEye')}</label>
          {/if}
          {#if d.trial.help && !s.alone}
            <label class="check"><input type="checkbox" checked={ts.helped} disabled={ro || locks.has(`trials.${k}.helped`)} onchange={(e) => act.choose(`trials.${k}.helped`, e.currentTarget.checked)} />{t('WOF.Lifepath.exam.helped')}</label>
            <span class="trial-cover">
              <span class="lbl">{t('WOF.Lifepath.exam.coverStress')}</span>
              <Stepper value={ts.coverStress} min={0} max={9} label={t('WOF.Lifepath.exam.coverStress')} disabled={ro || locks.has(`trials.${k}.coverStress`)} onset={(v) => act.choose(`trials.${k}.coverStress`, v)} />
            </span>
          {/if}
        </div>
        {#if d.pool}
          <div class="lp-rollbar">
            <span class="dots" role="img" aria-label={t('WOF.Lifepath.exam.poolAria', { base: d.pool.base, gear: d.pool.gear, stress: d.pool.stress })}>
              <span class="grp">{#each Array.from({ length: d.pool.attributeDice }) as _, j (j)}<i class="da"></i>{/each}</span>
              {#if d.pool.talent}<span class="grp">{#each Array.from({ length: d.pool.talent.dice }) as _, j (j)}<i class="dt"></i>{/each}</span>{/if}
              {#if d.pool.bonus}<span class="grp">{#each Array.from({ length: d.pool.bonus }) as _, j (j)}<i class="db"></i>{/each}</span>{/if}
              {#if d.pool.gear}<span class="grp">{#each Array.from({ length: d.pool.gear }) as _, j (j)}<i class="dg"></i>{/each}</span>{/if}
              {#if d.pool.stress}<span class="grp">{#each Array.from({ length: d.pool.stress }) as _, j (j)}<i class="ds"></i>{/each}</span>{/if}
            </span>
            <span class="note pool-why">{t('WOF.Lifepath.exam.poolWhy', { attr: attrName(d.pool.attribute), a: d.pool.attributeDice, talent: d.pool.talent ? `${d.pool.talent.name} ${d.pool.talent.dice}` : t('WOF.Lifepath.exam.noTalent'), gear: d.choice.gear ?? t('WOF.Lifepath.exam.noGear') })}</span>
            <button type="button" class="mini red" disabled={ro || !!ts.dice || (!s.alone && !ts.order.length)} onclick={() => act.rollTrial(k)}><img src={iconPath('die-base')} alt="" />{t('WOF.Lifepath.exam.roll')}</button>
          </div>
        {/if}
      {/if}

      {#if ts.dice}
        <div class="perf-result" use:tumble>
          <span class="dset">
            {#each ts.dice.base as f, j (j)}{@html die('base', f)}{/each}
            {#each ts.dice.gear as f, j (j)}{@html die('gear', f, { locked: f === 1 && ts.covers.length > 0 })}{/each}
            {#each ts.dice.stress as f, j (j)}{@html die('stress', f, { fresh: j === ts.fresh })}{/each}
          </span>
          <span class="big" class:none={(d.successes ?? 0) < d.trial.needs}>{d.successes}</span>
          <span class="rt"><b>{t('WOF.Lifepath.exam.ofNeeds', { needs: d.trial.needs })}</b>{t('WOF.Lifepath.meritChip', { merit: signed(d.merit ?? 0) })}</span>
        </div>
        {#if ts.response}<p class="resp"><img src={iconPath('roll-stress')} alt="" /><span>{t('WOF.Lifepath.exam.response')}</span></p>{/if}
        {#if ts.covers.length}<p class="note">{t(ts.covers[ts.covers.length - 1] ? 'WOF.Lifepath.exam.pushedCovered' : 'WOF.Lifepath.exam.pushedStress')}</p>{/if}
        {#if d.trial.push}
          <div class="acts">
            <button type="button" class="mini red" disabled={ro || d.push !== null} onclick={() => act.push(k, false)}><img src={iconPath('roll-push')} alt="" />{t('WOF.Lifepath.exam.push')}</button>
            {#if !s.alone}<button type="button" class="mini" disabled={ro || d.push !== null} onclick={() => act.push(k, true)}>{t('WOF.Lifepath.exam.pushCovered')}</button>{/if}
            {#if d.push && d.push !== 'not-allowed'}<span class="note">{blockText(d.push)}</span>{/if}
          </div>
        {:else}
          <p class="note">{t('WOF.Lifepath.exam.noPushHere')}</p>
        {/if}
      {/if}
    </article>
  {/if}
{/each}

<p class="lp-merit">{t('WOF.Lifepath.exam.total', { merit: signed(r.examMerit ?? 0), total: r.merit.exam ?? r.merit['year-3'] ?? 0 })}</p>
