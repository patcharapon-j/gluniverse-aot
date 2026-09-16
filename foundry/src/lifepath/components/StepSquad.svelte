<script lang="ts">
  /** Join the Squad (lifepath.yaml, join-the-squad): starting Squadmates are the table's; a named comrade if the Drive needs one. */
  import { iconPath } from '../../art.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const act = $derived(view.act);
  const ro = $derived(!view.editable || !s.finished);
  const drive = $derived(view.tables.enlistment.find((x) => x.id === s.enlist.drive)?.drive ?? null);
</script>

<Sec {n} title={t('WOF.Lifepath.step.squad')} hint={t('WOF.Lifepath.squad.hint')} />
<WordText blocks={view.page.sections.finishing.slice(2)} />

<div class="lp-block">
  <h4 class="lp-q"><img class="ic s24" src={iconPath('action-help')} alt="" />{t('WOF.Lifepath.squad.comrade')}</h4>
  {#if !s.finished}
    <p class="note">{t('WOF.Lifepath.squad.notYet')}</p>
  {:else if drive?.namedComrade}
    <p><b>{drive.name}</b> {drive.trigger}</p>
    {#if view.comrades.length}
      <select class="lp-select" value={s.finish.comrade} disabled={ro} aria-label={t('WOF.Lifepath.squad.comrade')} onchange={(e) => act.choose('finish.comrade', e.currentTarget.value)}>
        <option value="">{t('WOF.Lifepath.squad.later')}</option>
        {#each view.comrades as c (c.id)}<option value={c.name}>{c.name}</option>{/each}
      </select>
    {:else}
      <p class="note red-text">{t('WOF.Lifepath.squad.nobody')}</p>
    {/if}
    <WordText blocks={view.page.sections['named-comrades']} compact />
  {:else}
    <p class="note">{t('WOF.Lifepath.squad.noComrade', { name: drive?.name ?? '' })}</p>
  {/if}
</div>

<div class="lp-block">
  <h4 class="lp-q"><img class="ic s24" src={iconPath('action-squad-tactic')} alt="" />{t('WOF.Lifepath.squad.squadmates')}</h4>
  <WordText blocks={view.page.sections['the-starting-squad']} compact />
  <p class="note">{t('WOF.Lifepath.squad.pack')}</p>
</div>
