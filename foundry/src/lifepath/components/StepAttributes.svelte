<script lang="ts">
  /** A build's attributes (attributes.yaml, creation.built): the template's ratings, or a Free Build shape placed. */
  import { freeBuildLeft } from '../../rules/lifepath.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { ATTRS, attrIcon, attrName } from './helpers.ts';
  import Pick from './Pick.svelte';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const act = $derived(view.act);
  const tables = $derived(view.tables);
  const ro = $derived(!view.editable || s.finished);
  const item = $derived(view.page.sections['the-build-steps'][0].items[2]);
  const specialty = $derived(tables.specialties.find((x) => x.id === s.specialty) ?? null);
  const free = $derived(s.procedure === 'free-build');
  const left = $derived(freeBuildLeft(tables, s.built.shape, s.built.placement));
  const shapes = $derived(tables.rules.built.shapes.map((x) => ({ id: x.id, title: x.ratings.join(', '), sub: t(`WOF.Lifepath.attributes.shapeSub.${x.id}`) })));
  const attrs = $derived(r.attrs.attributes ?? null);

  /** The ratings an attribute can take: what is left of the shape, plus its own. */
  function choices(a: string): number[] {
    const own = s.built.placement[a as keyof typeof s.built.placement];
    const list = own === null ? [...left] : [...left, own];
    return [...new Set(list)].sort((x, y) => y - x);
  }
  function place(a: string, value: string) {
    view.act.choose(`built.placement.${a}`, value === '' ? null : Number(value));
  }
</script>

<Sec {n} title={t('WOF.Lifepath.step.attributes')} hint={t(free ? 'WOF.Lifepath.attributes.hintFree' : 'WOF.Lifepath.attributes.hintTemplate')} />
<WordText blocks={[{ kind: 'ol', items: [item] }]} start={3} />

{#if free}
  <div class="lp-block">
    <h4 class="lp-q">{t('WOF.Lifepath.attributes.shape')}</h4>
    <Pick options={shapes} value={s.built.shape} label={t('WOF.Lifepath.attributes.shape')} disabled={ro} onpick={(id) => act.choose('built.shape', id)} />
  </div>
{/if}

<div class="lp-block">
  <h4 class="lp-q">{t('WOF.Lifepath.attributes.ratings')}</h4>
  <div class="swap-grid">
    {#each ATTRS as a (a)}
      <div class="swap-cell s-{a}" class:key={a === specialty?.key}>
        <img class="ic s16" src={attrIcon(a)} alt="" />
        <span class="lbl">{attrName(a)}</span>
        {#if free}
          <select class="lp-select small" value={s.built.placement[a] === null ? '' : String(s.built.placement[a])} disabled={ro || !s.built.shape} aria-label={attrName(a)} onchange={(e) => place(a, e.currentTarget.value)}>
            <option value="">–</option>
            {#each choices(a) as v (v)}<option value={String(v)}>{v}</option>{/each}
          </select>
        {:else}
          <b class="swap-v">{attrs?.[a] ?? '–'}</b>
        {/if}
        {#if a === specialty?.key}<span class="stamp key">{t('WOF.Lifepath.file.key')}</span>{/if}
      </div>
    {/each}
  </div>
  {#if free && s.built.shape}
    <p class="note" class:red-text={r.status.attributes !== 'ready' && r.status.attributes !== 'done'}>
      {left.length ? t('WOF.Lifepath.attributes.left', { values: left.join(', ') }) : r.status.attributes === 'todo' ? t('WOF.Lifepath.attributes.keyFour', { a: attrName(specialty?.key ?? 'strength') }) : t('WOF.Lifepath.attributes.placed')}
    </p>
  {/if}
</div>
