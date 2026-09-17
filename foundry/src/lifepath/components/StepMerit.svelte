<script lang="ts">
  /** A build's Merit step (built_steps, no-merit): Merit and Class Rank none. */
  import { iconPath } from '../../art.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const item = $derived(view.page.sections['the-build-steps'][0].items[7]);
</script>

<Sec {n} title={t('WOF.Lifepath.step.merit')} hint={t('WOF.Lifepath.merit.hint')} />
<WordText blocks={[{ kind: 'ol', items: [item] }]} start={8} />
<div class="lp-block rank-block">
  <div class="rank-card"><span class="lbl">{t('WOF.Actor.Soldier.FIELDS.merit.label')}</span><span class="big">{t('WOF.Lifepath.none')}</span></div>
  <div class="rank-card"><span class="lbl">{t('WOF.Actor.Soldier.FIELDS.class_rank.label')}</span><span class="big">{t('WOF.Lifepath.none')}</span></div>
  <div class="rank-card"><img class="ic s32" src={iconPath('seal-wax')} alt="" /><span class="note">{t('WOF.Lifepath.merit.note')}</span></div>
</div>
