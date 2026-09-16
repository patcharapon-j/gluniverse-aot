<script lang="ts">
  /** A build's Training Years, for the story only (built_steps, training-years). */
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const ro = $derived(!view.editable || s.finished);
  const item = $derived(view.page.sections['the-build-steps'][0].items[5]);

  function pick(i: number, value: string) {
    const next = [...s.built.stories];
    next[i] = value === '' ? null : Number(value);
    view.act.choose('built.stories', next);
  }
</script>

<Sec {n} title={t('WOF.Lifepath.step.stories')} hint={t('WOF.Lifepath.stories.hint')} />
<WordText blocks={[{ kind: 'ol', items: [item] }]} start={6} />
{#each view.tables.years as y, i (y.id)}
  {@const chosen = s.built.stories[i]}
  <div class="lp-block story">
    <h4 class="lp-q">{y.title} <span class="note">{y.subtitle}</span></h4>
    <select class="lp-select" value={chosen === null ? '' : String(chosen)} disabled={ro} aria-label={y.title} onchange={(e) => pick(i, e.currentTarget.value)}>
      <option value="">{t('WOF.Lifepath.stories.none')}</option>
      {#each y.events as e, k (k)}<option value={String(k)}>{e.name}</option>{/each}
    </select>
    {#if chosen !== null}<p class="slip-d">{y.events[chosen].description}</p>{/if}
  </div>
{/each}
