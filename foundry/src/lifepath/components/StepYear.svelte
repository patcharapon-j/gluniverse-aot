<script lang="ts">
  /** Steps 3 to 5: a Training Year's event, its Talent and point, then the performance roll (or the Exam). */
  import { iconPath } from '../../art.ts';
  import { band, sixes } from '../../rules/lifepath.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { attrIcon, attrName, die, signed, talentInfo } from './helpers.ts';
  import { slideIn, tumble } from './motion.ts';
  import Overflow from './Overflow.svelte';
  import Pick from './Pick.svelte';
  import WordText from './WordText.svelte';

  let { view, n, i }: { view: WizardView; n: number; i: 0 | 1 | 2 } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const act = $derived(view.act);
  const tables = $derived(view.tables);
  const ro = $derived(!view.editable || s.finished);
  const year = $derived(tables.years[i]);
  const ys = $derived(s.years[i]);
  const d = $derived(r.years[i]);
  const locks = $derived(r.locks);
  const perfBlocks = $derived(view.page.sections['the-performance-roll']);

  // The event's own three Talents, then the year's whole curriculum beside them (talent_cap).
  const talentOptions = $derived.by(() => {
    if (!d?.event) return [];
    const ids = d.fallback === 'all-capped' ? d.talentOptions : [...new Set([...d.event.talents, ...year.curriculum])];
    return ids.map((id) => {
      const x = talentInfo(tables, id);
      const open = d.talentOptions.includes(id);
      return {
        id,
        title: x.name,
        sub: x.names,
        meta: t(`WOF.Lifepath.talentType.${x.type}`),
        icon: x.icon,
        badge: d.event!.talents.includes(id) ? undefined : t('WOF.Lifepath.year.curriculumBadge'),
        disabled: !open,
        card: x.card,
        note: open ? undefined : t('WOF.Lifepath.year.capped'),
      };
    });
  });
  const perfAttrs = $derived(year.performance);
  const perfReady = $derived(!!d?.perf?.attribute && !ys.perf);
</script>

<Sec {n} title={year.title} hint={year.subtitle} />
<WordText blocks={view.page.sections['training-years'].slice(1, 2)} />
<details class="lp-more">
  <summary>{t('WOF.Lifepath.year.limits')}</summary>
  <div class="box-pair">
    <div class="box"><h5 class="lp-q">{t('WOF.Lifepath.year.capBox')}</h5><WordText blocks={view.page.boxes['Attribute cap']} compact /></div>
    <div class="box"><h5 class="lp-q">{t('WOF.Lifepath.year.talentBox')}</h5><WordText blocks={view.page.boxes['Talent cap']} compact /></div>
  </div>
</details>

<div class="lp-rollbar">
  <button type="button" class="mini red" disabled={ro || !!ys.roll} onclick={() => act.rollEvent(i)}><i class="fa-solid fa-dice" inert></i>{t('WOF.Lifepath.year.rollEvent')}</button>
  <span class="note">{ys.roll ? t('WOF.Lifepath.rolled') : t('WOF.Lifepath.year.rollNote', { year: year.title })}</span>
</div>

{#if d?.event && ys.roll}
  <div class="d66" use:tumble>
    <span class="dset">{@html die('base', ys.roll.tens, { plain: true })}{@html die('base', ys.roll.units, { plain: true })}</span>
    <b class="d66-n">{d.roll}</b>
    <span class="d66-row">{d.event.name}</span>
  </div>
  <article class="slip" use:slideIn>
    <div class="slip-h">
      <img class="ic s32" src={iconPath('action-performance-roll')} alt="" />
      <div>
        <h4>{d.event.name}</h4>
        <p class="slip-d">{d.event.description}</p>
      </div>
    </div>
    <div class="chips-row">
      <span class="attr-chip s-{d.event.attribute}"><img src={attrIcon(d.event.attribute)} alt="" />{t('WOF.Lifepath.plusOne', { a: attrName(d.event.attribute) })}</span>
      <span class="merit-chip" class:neg={d.event.merit < 0}>{t('WOF.Lifepath.meritChip', { merit: signed(d.event.merit) })}</span>
    </div>
    {#if d.overflowNeeds || ys.overflow}
      <Overflow from={d.event.attribute} needs={d.overflowNeeds} value={ys.overflow} cap={tables.rules.cap} locked={locks.has(`years.${i}.overflow`)} disabled={ro} onpick={(a) => act.choose(`years.${i}.overflow`, a)} />
    {/if}
    <h5 class="lp-q">{t('WOF.Lifepath.year.talent')}</h5>
    <p class="note">{t('WOF.Lifepath.year.talentHint', { n: talentOptions.filter((x) => !x.disabled).length })}</p>
    {#if d.fallback === 'all-capped'}<p class="note red-text">{t('WOF.Lifepath.year.allCapped')}</p>{/if}
    <Pick options={talentOptions} value={ys.talent} label={t('WOF.Lifepath.year.talent')} locked={locks.has(`years.${i}.talent`)} disabled={ro} cols={talentOptions.length > 2 ? 3 : 2} onpick={(id) => act.choose(`years.${i}.talent`, id)} />
  </article>

  <div class="lp-block perf">
    <h4 class="lp-q"><img class="ic s24" src={iconPath('action-performance-roll')} alt="" />{t('WOF.Lifepath.year.performance')}</h4>
    {#if d.skipPerformance}
      <p class="stamp info">{t('WOF.Lifepath.year.examReplaces')}</p>
    {:else}
      <WordText blocks={perfBlocks.slice(0, 2)} compact />
      <table class="lp-bands" aria-label={t('WOF.Lifepath.year.bands')}>
        <tbody>
          <tr><th>{t('WOF.Lifepath.successes')}</th>{#each tables.performanceMerit as b, k (k)}<td>{b.max === null ? t('WOF.Lifepath.orMore', { n: b.min }) : b.min}</td>{/each}</tr>
          <tr><th>{t('WOF.Actor.Soldier.FIELDS.merit.label')}</th>{#each tables.performanceMerit as b, k (k)}<td>{b.value}</td>{/each}</tr>
        </tbody>
      </table>
      <div class="perf-row">
        {#each perfAttrs as a (a)}
          {@const value = r.attrs[`year-${i + 1}` as 'year-1']?.[a] ?? 0}
          {@const pick = d.perf?.attribute === a}
          <button type="button" class="attr-chip big s-{a}" class:on={pick} aria-pressed={pick} disabled={ro || !d.perf?.choose || locks.has(`years.${i}.perfAttr`)} onclick={() => act.choose(`years.${i}.perfAttr`, a)}>
            <img src={attrIcon(a)} alt="" />{attrName(a)} <b>{value}</b>
          </button>
        {/each}
        {#if d.perf?.choose && !d.perf.attribute}<span class="note">{t('WOF.Lifepath.year.tie')}</span>{/if}
      </div>
      {#if d.perf}
        <div class="lp-rollbar">
          <span class="dots" role="img" aria-label={t('WOF.Lifepath.year.dice', { n: d.perf.dice })}><span class="grp">{#each Array.from({ length: d.perf.dice }) as _, k (k)}<i class="da"></i>{/each}</span></span>
          <button type="button" class="mini red" disabled={ro || !perfReady} onclick={() => act.rollPerformance(i)}><i class="fa-solid fa-dice" inert></i>{t('WOF.Lifepath.year.rollPerformance', { n: d.perf.dice })}</button>
          <span class="note">{t('WOF.Lifepath.year.noPush')}</span>
        </div>
      {:else}
        <p class="note">{t('WOF.Lifepath.year.choicesFirst')}</p>
      {/if}
      {#if ys.perf}
        <div class="perf-result" use:tumble>
          <span class="dset">{#each ys.perf as f, k (k)}{@html die('base', f)}{/each}</span>
          <span class="big">{sixes(ys.perf)}</span>
          <span class="rt"><b>{t('WOF.Lifepath.successes')}</b>{t('WOF.Lifepath.meritChip', { merit: signed(band(tables.performanceMerit, sixes(ys.perf))) })}</span>
        </div>
      {/if}
    {/if}
    <p class="lp-merit">{t('WOF.Lifepath.year.meritTotal', { merit: r.merit[`year-${i + 1}` as 'year-1'] ?? 0 })}</p>
  </div>
{/if}
