<script lang="ts">
  /** A build's Specialty step (built_steps, specialty). */
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { attrName, specialtyIcon } from './helpers.ts';
  import Pick from './Pick.svelte';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const ro = $derived(!view.editable || s.finished);
  const item = $derived(view.page.sections['the-build-steps'][0].items[1]);
  const options = $derived(view.tables.specialties.map((x) => ({ id: x.id, title: x.name, sub: x.summary, meta: t('WOF.Lifepath.grad.keyAttr', { a: attrName(x.key) }), icon: specialtyIcon(x.id) })));
</script>

<Sec {n} title={t('WOF.Lifepath.step.specialty')} hint={t('WOF.Lifepath.specialty.hint')} />
<WordText blocks={[{ kind: 'ol', items: [item] }]} start={2} />
<div class="lp-block">
  <Pick {options} value={s.specialty} label={t('WOF.Lifepath.step.specialty')} disabled={ro} cols={3} onpick={(id) => view.act.choose('specialty', id)} />
</div>
