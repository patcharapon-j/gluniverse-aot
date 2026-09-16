<script lang="ts">
  /** Step 2: Why You Enlisted, rolled on the Lifepath; a build's Drive step chooses a Drive only. */
  import { iconPath } from '../../art.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { attrIcon, attrName, die, rangeText } from './helpers.ts';
  import { slideIn, tumble } from './motion.ts';
  import Overflow from './Overflow.svelte';
  import Pick from './Pick.svelte';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const act = $derived(view.act);
  const tables = $derived(view.tables);
  const ro = $derived(!view.editable || s.finished);
  const built = $derived(s.procedure !== 'lifepath');
  const e = $derived(r.enlist);
  const row = $derived(e?.row ?? null);
  const buildItem = $derived(view.page.sections['the-build-steps'][0].items[4]);

  const drives = $derived(
    tables.enlistment.map((x) => ({
      id: x.id,
      title: x.drive.name,
      sub: x.drive.trigger,
      meta: built ? x.reason : `${rangeText(x.results)} · ${t('WOF.Lifepath.plusOne', { a: attrName(x.attribute) })}`,
      badge: row?.id === x.id ? t('WOF.Lifepath.enlist.rolledBadge') : x.drive.namedComrade ? t('WOF.Lifepath.enlist.comradeBadge') : undefined,
    })),
  );
  const chosen = $derived(tables.enlistment.find((x) => x.id === s.enlist.drive) ?? null);
</script>

<Sec {n} title={t(built ? 'WOF.Lifepath.step.drive' : 'WOF.Lifepath.step.enlist')} hint={t(built ? 'WOF.Lifepath.enlist.hintBuilt' : 'WOF.Lifepath.enlist.hint')} />
{#if built}
  <WordText blocks={[{ kind: 'ol', items: [buildItem] }]} start={5} />
{:else}
  <WordText blocks={view.page.sections['why-you-enlisted']} />
  <div class="lp-rollbar">
    <button type="button" class="mini red" disabled={ro || !!s.enlist.roll} onclick={() => act.rollEnlist()}><img src={iconPath('die-base')} alt="" />{t('WOF.Lifepath.rollD66')}</button>
    <span class="note">{s.enlist.roll ? t('WOF.Lifepath.rolled') : t('WOF.Lifepath.enlist.rollNote')}</span>
  </div>
  {#if row && e}
    <div class="d66" use:tumble>
      <span class="dset">{@html die('base', s.enlist.roll!.tens, { plain: true })}{@html die('base', s.enlist.roll!.units, { plain: true })}</span>
      <b class="d66-n">{e.roll}</b>
      <span class="d66-row">{row.reason}</span>
    </div>
    <article class="slip" use:slideIn>
      <div class="chips-row"><span class="attr-chip s-{row.attribute}"><img src={attrIcon(row.attribute)} alt="" />{t('WOF.Lifepath.plusOne', { a: attrName(row.attribute) })}</span></div>
      {#if e.overflowNeeds || s.enlist.overflow}
        <Overflow from={row.attribute} needs={e.overflowNeeds} value={s.enlist.overflow} cap={tables.rules.cap} locked={r.locks.has('enlist.overflow')} disabled={ro} onpick={(a) => act.choose('enlist.overflow', a)} />
      {/if}
      <p class="note">{t('WOF.Lifepath.enlist.fixedPoint')}</p>
    </article>
  {/if}
{/if}

{#if built || row}
  <div class="lp-block">
    <h4 class="lp-q">{t('WOF.Lifepath.enlist.drive')}</h4>
    <Pick options={drives} value={s.enlist.drive} label={t('WOF.Lifepath.enlist.drive')} disabled={ro} cols={2} onpick={(id) => act.choose('enlist.drive', id)} />
    {#if chosen?.drive.namedComrade}<p class="note">{t('WOF.Lifepath.enlist.comradeNote')}</p>{/if}
  </div>
{/if}
