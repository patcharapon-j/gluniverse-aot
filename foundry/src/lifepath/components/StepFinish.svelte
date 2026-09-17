<script lang="ts">
  /** Finish (lifepath.yaml, finish): derived values, Standard Issue with its declines, the name, and the commit. */
  import { gearIcon, iconPath } from '../../art.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import Stepper from '../../sheets/components/Stepper.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { settle } from './motion.ts';
  import WordText from './WordText.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const f = $derived(r.final);
  const issue = $derived(view.issue);
  const act = $derived(view.act);
  const ro = $derived(!view.editable || s.finished);
  const gearName = (id: string) => (CONFIG.WOF.gearItems as { id: string; name: string }[]).find((g) => g.id === id)?.name ?? id;
  const finishing = $derived(view.page.sections.finishing);
  const storedName = $derived(s.finish.name);
  let name = $state('');
  let busy = $state(false);
  $effect(() => {
    name = storedName;
  });

  const given = $derived.by(() => {
    if (!issue) return [];
    const out: { icon: string; label: string; detail: string }[] = [];
    const count = (id: string) => issue.create.filter((c) => c.itemId === id);
    for (const id of ['odm-gear', 'horse']) for (const c of count(id)) out.push({ icon: gearIcon(id), label: gearName(id), detail: t('WOF.Lifepath.finish.rating', { n: c.rating }) });
    const blades = count('blade-set');
    if (blades.length) out.push({ icon: gearIcon('blade-set'), label: t('WOF.Lifepath.finish.blades', { n: blades.length, name: gearName('blade-set') }), detail: blades.some((b) => b.inHandles) ? t('WOF.Lifepath.finish.inHandles') : '' });
    out.push({ icon: iconPath('gear-gas-canister'), label: t('WOF.Lifepath.finish.canisters', { n: issue.spareCanisters.length }), detail: t('WOF.Lifepath.finish.fitted', { n: issue.gasRating }) });
    if (issue.given.item) out.push({ icon: gearIcon(issue.given.item.itemId), label: gearName(issue.given.item.itemId), detail: t('WOF.Lifepath.finish.rating', { n: issue.given.item.rating }) });
    return out;
  });

  async function sign() {
    busy = true;
    try {
      if (name.trim() !== s.finish.name) await act.choose('finish.name', name.trim());
      await act.finish();
    } finally {
      busy = false;
    }
  }
</script>

<Sec {n} title={t('WOF.Lifepath.step.finish')} hint={t('WOF.Lifepath.finish.hint')} />
<WordText blocks={s.procedure === 'lifepath' ? finishing.slice(1, 2) : finishing.slice(0, 2)} />

{#if f}
  <div class="lp-block finish-grid">
    <div class="box">
      <h5 class="lp-q"><img class="ic s16" src={iconPath('harm-health')} alt="" />{t('WOF.Lifepath.finish.health', { n: f.health })}</h5>
      <div class="boxes">{#each Array.from({ length: f.health }) as _, i (i)}<span class="hbox clean"></span>{/each}</div>
      <dl class="facts">
        <dt>{t('WOF.Lifepath.finish.resolve')}</dt><dd><b>{f.resolve}</b></dd>
        <dt>{t('WOF.Lifepath.finish.stress')}</dt><dd>{t('WOF.Lifepath.finish.stressLine')}</dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.rank.label')}</dt><dd>{t('WOF.Rank.private')}</dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.merit.label')}</dt><dd>{f.merit ?? t('WOF.Lifepath.none')}</dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.class_rank.label')}</dt><dd>{f.classRank ?? t('WOF.Lifepath.none')}</dd>
        {#if f.declined}<dt>{t('WOF.Lifepath.grad.top10')}</dt><dd><span class="stamp">{t('WOF.Lifepath.grad.declinedShort')}</span></dd>{/if}
      </dl>
    </div>
    <div class="box">
      <h5 class="lp-q"><img class="ic s16" src={gearIcon('odm-gear')} alt="" />{t('WOF.Lifepath.finish.issue', { funding: view.tables.issue.funding })}</h5>
      {#if s.finished}
        <p class="note">{t('WOF.Lifepath.finish.issued')}</p>
      {:else if issue}
        <ul class="issue">
          {#each given as g, i (i)}<li><img class="ic s24" src={g.icon} alt="" /><span>{g.label}</span><span class="note">{g.detail}</span></li>{/each}
        </ul>
        <div class="grid-form decl">
          {#if issue.offered.spares}
            <span class="lbl">{t('WOF.Lifepath.finish.declineSpares')}</span>
            <Stepper value={s.finish.spares} max={issue.offered.spares} label={t('WOF.Lifepath.finish.declineSpares')} disabled={ro} onset={(v) => act.choose('finish.spares', v)} />
          {/if}
          {#if issue.offered.blades}
            <span class="lbl">{t('WOF.Lifepath.finish.declineBlades')}</span>
            <Stepper value={s.finish.blades} max={issue.offered.blades} label={t('WOF.Lifepath.finish.declineBlades')} disabled={ro} onset={(v) => act.choose('finish.blades', v)} />
          {/if}
          {#if issue.offered.item}
            <span class="lbl">{t('WOF.Lifepath.finish.declineItem')}</span>
            <input type="checkbox" checked={s.finish.item} disabled={ro} aria-label={t('WOF.Lifepath.finish.declineItem')} onchange={(e) => act.choose('finish.item', e.currentTarget.checked)} />
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <div class="lp-block sign">
    <label class="lp-name-field">
      <span class="lbl">{t('WOF.Lifepath.finish.name')}</span>
      <input type="text" class="name" bind:value={name} placeholder={t('WOF.Lifepath.finish.namePlaceholder')} disabled={ro} onchange={() => act.choose('finish.name', name.trim())} />
    </label>
    {#if view.replaced.length && !s.finished}<p class="note red-text">{t('WOF.Lifepath.finish.replaces', { names: view.replaced.join(', ') })}</p>{/if}
    {#if s.finished}
      <span class="stamp big-stamp ok" use:settle>{t('WOF.Lifepath.filedStamp')}</span>
    {:else}
      <button type="button" class="mini red sign-btn" disabled={ro || busy || !name.trim()} onclick={sign}><i class="fa-solid fa-file-signature" inert></i>{t('WOF.Lifepath.finish.sign')}</button>
      <p class="note">{t('WOF.Lifepath.finish.signNote')}</p>
    {/if}
  </div>
{/if}
