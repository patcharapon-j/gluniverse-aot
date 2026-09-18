<script lang="ts">
  /** Step 1: the Origin, rolled on the Lifepath (again while its condition fails) or chosen in a build. */
  import { iconPath, originIcon } from '../../art.ts';
  import { originAllowed } from '../../rules/lifepath.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { attrIcon, attrName, die, rangeText, talentInfo } from './helpers.ts';
  import { slideIn, tumble } from './motion.ts';
  import Pick from './Pick.svelte';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const act = $derived(view.act);
  const tables = $derived(view.tables);
  const ro = $derived(!view.editable || s.finished);
  const built = $derived(s.procedure !== 'lifepath');
  const row = $derived(r.origin?.row ?? null);
  const canRoll = $derived(!ro && !built && !row);
  const buildItem = $derived(view.page.sections['the-build-steps'][0].items[3]);

  const rows = $derived(
    tables.origins.map((o) => ({
      id: o.id,
      title: o.name,
      sub: o.attributes.map(attrName).join(', '),
      meta: rangeText(o.results),
      icon: originIcon(o.id),
      disabled: !originAllowed(o, s.year),
      note: o.condition ?? undefined,
    })),
  );
  const talentOptions = $derived(
    (row?.talents ?? []).map((id) => {
      const x = talentInfo(tables, id);
      return { id, title: x.name, sub: x.names, meta: t(`WOF.Lifepath.talentType.${x.type}`), icon: x.icon };
    }),
  );
  const havenOptions = $derived((row?.havens ?? []).map((h) => ({ id: h, title: h })));
</script>

<Sec {n} title={t('WOF.Lifepath.step.origin')} hint={built ? t('WOF.Lifepath.origin.hintBuilt') : t('WOF.Lifepath.origin.hint')} />
{#if built}
  <WordText blocks={[{ kind: 'ol', items: [buildItem] }]} start={4} />
  <div class="lp-block">
    <Pick options={rows} value={s.origin.row} label={t('WOF.Lifepath.origin.choose')} disabled={ro} cols={3} onpick={(id) => act.choose('origin.row', id)} />
  </div>
{:else}
  <WordText blocks={view.page.sections.origin} />
  <div class="lp-rollbar">
    <button type="button" class="mini red" disabled={!canRoll} onclick={() => act.rollOrigin()}>
      <i class="fa-solid fa-dice" inert></i>{t(r.origin?.rollAgain ? 'WOF.Lifepath.origin.rollAgain' : 'WOF.Lifepath.rollD66')}
    </button>
    <span class="note">{row ? t('WOF.Lifepath.rolled') : t('WOF.Lifepath.origin.rollNote')}</span>
  </div>
  {#each r.origin?.rolls ?? [] as x, i (i)}
    <div class="d66" class:struck={!x.kept} use:tumble>
      <span class="dset">{@html die('base', Math.floor(x.roll / 10), { plain: true })}{@html die('base', x.roll % 10, { plain: true })}</span>
      <b class="d66-n">{x.roll}</b>
      <span class="d66-row">{x.row.name}</span>
      {#if !x.kept}<span class="note red-text">{x.row.condition} {t('WOF.Lifepath.origin.again')}</span>{/if}
    </div>
  {/each}
{/if}

{#if row}
  <article class="slip" use:slideIn>
    <div class="slip-h">
      <img class="ic s32" src={originIcon(row.id)} alt="" />
      <div>
        <h4>{row.name}</h4>
        <p class="slip-d">{row.description}</p>
      </div>
    </div>
    {#if built}
      <p class="note">{t('WOF.Lifepath.origin.noPoints')}</p>
    {:else}
      <div class="chips-row">
        {#each row.attributes as a (a)}<span class="attr-chip s-{a}"><img src={attrIcon(a)} alt="" />{t('WOF.Lifepath.plusOne', { a: attrName(a) })}</span>{/each}
      </div>
    {/if}
    <h5 class="lp-q">{t('WOF.Lifepath.origin.talent')}</h5>
    <Pick options={talentOptions} value={s.origin.talent} label={t('WOF.Lifepath.origin.talent')} locked={r.locks.has('origin.talent')} disabled={ro} onpick={(id) => act.choose('origin.talent', id)} />
    <h5 class="lp-q">{t('WOF.Lifepath.origin.haven')}</h5>
    <Pick options={havenOptions} value={s.origin.haven} label={t('WOF.Lifepath.origin.haven')} disabled={ro} cols={1} onpick={(id) => act.choose('origin.haven', id)} />
    {#if row.canonTie}
      <h5 class="lp-q">{t('WOF.Lifepath.origin.canonTie')}</h5>
      <label class="check lp-tie">
        <input type="checkbox" checked={s.origin.canonTie} disabled={ro} onchange={(e) => act.choose('origin.canonTie', e.currentTarget.checked)} />
        <span><b>{row.canonTie.character}</b> {row.canonTie.link}</span>
      </label>
    {/if}
  </article>
{/if}
