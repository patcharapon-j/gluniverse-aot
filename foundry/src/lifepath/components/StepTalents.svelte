<script lang="ts">
  /** A build's Talents (built_steps.talent_levels): one level from the Specialty's list, then three in any Talents. */
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { talentInfo } from './helpers.ts';
  import Pick from './Pick.svelte';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const act = $derived(view.act);
  const tables = $derived(view.tables);
  const ro = $derived(!view.editable || s.finished);
  const item = $derived(view.page.sections['the-build-steps'][0].items[6]);
  const specialty = $derived(tables.specialties.find((x) => x.id === s.specialty) ?? null);
  const bt = $derived(r.builtTalents);
  const any = $derived(s.built.any);
  const slots = $derived(tables.rules.built.anyLevels);

  const specialtyOptions = $derived(
    [...(specialty?.talents ?? []), ...tables.general.filter((id) => !(specialty?.talents ?? []).includes(id))].map((id) => {
      const x = talentInfo(tables, id);
      const open = !!bt?.specialtyOptions.includes(id);
      const own = (specialty?.talents ?? []).includes(id);
      return {
        id,
        title: x.name,
        sub: x.names,
        meta: t(`WOF.Lifepath.talentType.${x.type}`),
        icon: x.icon,
        badge: own ? undefined : t('WOF.Lifepath.grad.generalBadge'),
        disabled: !open,
        note: t('WOF.Lifepath.talents.cannot'),
      };
    }),
  );
  const levelOf = (id: string) => (bt?.afterOrigin[id] ?? 0) + (s.grad.talent === id ? 1 : 0) + any.filter((x) => x === id).length;
  const grouped = $derived.by(() => {
    const byType = { dice: [] as string[], rule: [] as string[] };
    for (const id of bt?.anyOptions ?? []) byType[talentInfo(tables, id).type].push(id);
    return byType;
  });
  let pick = $state('');
</script>

<Sec {n} title={t('WOF.Lifepath.step.talents')} hint={t('WOF.Lifepath.talents.hint')} />
<WordText blocks={[{ kind: 'ol', items: [item] }]} start={7} />
<details class="lp-more" open>
  <summary>{t('WOF.Lifepath.talents.limits')}</summary>
  <WordText blocks={view.page.boxes['Talent limits']} compact />
</details>

<div class="lp-block">
  <h4 class="lp-q">{t('WOF.Lifepath.talents.fromList', { name: specialty?.name ?? '' })}</h4>
  <Pick options={specialtyOptions} value={s.grad.talent} label={t('WOF.Lifepath.talents.fromList', { name: specialty?.name ?? '' })} disabled={ro} cols={3} onpick={(id) => act.choose('grad.talent', id)} />
</div>

<div class="lp-block">
  <h4 class="lp-q">{t('WOF.Lifepath.talents.any', { n: any.length, of: slots })}</h4>
  <ol class="any-list">
    {#each any as id, k (k)}
      {@const x = talentInfo(tables, id)}
      <li><img class="ic s16" src={x.icon} alt="" /><b>{x.name}</b><span class="note">{x.names}</span>
        {#if k === any.length - 1}<button type="button" class="mini" disabled={ro} onclick={() => act.choose('built.any', any.slice(0, -1))}>{t('WOF.Lifepath.talents.remove')}</button>{/if}
      </li>
    {/each}
  </ol>
  {#if any.length < slots}
    <div class="adder">
      <select bind:value={pick} disabled={ro || !s.grad.talent} aria-label={t('WOF.Lifepath.talents.add')}>
        <option value="">{t(s.grad.talent ? 'WOF.Lifepath.talents.add' : 'WOF.Lifepath.talents.listFirst')}</option>
        {#each ['dice', 'rule'] as type (type)}
          <optgroup label={t(`WOF.Lifepath.talentType.${type}`)}>
            {#each grouped[type as 'dice' | 'rule'] as id (id)}
              {@const x = talentInfo(tables, id)}
              <option value={id}>{x.name}{levelOf(id) ? ` (${levelOf(id)} → ${levelOf(id) + 1})` : ''}</option>
            {/each}
          </optgroup>
        {/each}
      </select>
      <button type="button" class="mini red" disabled={ro || !pick} onclick={() => { act.choose('built.any', [...any, pick]); pick = ''; }}>{t('WOF.Lifepath.talents.addBtn')}</button>
    </div>
  {/if}
</div>
