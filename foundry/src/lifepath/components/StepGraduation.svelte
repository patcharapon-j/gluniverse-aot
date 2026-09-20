<script lang="ts">
  /** Graduation (lifepath.yaml, graduation): Class Rank, Specialty, swap and floor, Top 10, Specialty Talent. */
  import { iconPath } from '../../art.ts';
  import Sec from '../../sheets/components/Sec.svelte';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { ATTRS, attrIcon, attrName, specialtyIcon, talentInfo } from './helpers.ts';
  import { settle } from './motion.ts';
  import Pick from './Pick.svelte';

  let { view, n }: { view: WizardView; n: number } = $props();
  const s = $derived(view.state);
  const r = $derived(view.r);
  const g = $derived(r.grad);
  const act = $derived(view.act);
  const tables = $derived(view.tables);
  const ro = $derived(!view.editable || s.finished);
  const flow = $derived(view.page.flows['fig-graduation'] as { title: string; text: string; exit: string }[]);
  const key = $derived(g?.specialty?.key ?? null);

  const specialties = $derived(
    tables.specialties.map((x) => ({ id: x.id, title: x.name, sub: x.summary, meta: t('WOF.Lifepath.grad.keyAttr', { a: attrName(x.key) }), icon: specialtyIcon(x.id) })),
  );
  // The Specialty's own list, then the general list beside it (lifepath.yaml, step graduation).
  const talentOptions = $derived(
    [...(g?.specialty?.talents ?? []), ...tables.general.filter((id) => !(g?.specialty?.talents ?? []).includes(id))].map((id) => {
      const x = talentInfo(tables, id);
      const own = (g?.specialty?.talents ?? []).includes(id);
      const open = !!g?.talentOptions.includes(id);
      return {
        id,
        title: x.name,
        sub: x.names,
        meta: t(`WOF.Lifepath.talentType.${x.type}`),
        icon: x.icon,
        badge: own ? undefined : t('WOF.Lifepath.grad.generalBadge'),
        disabled: !open,
        note: t('WOF.Lifepath.year.capped'),
        card: x.card,
      };
    }),
  );
  const floorLeft = $derived(g ? g.floor.points - s.grad.floor.length : 0);
</script>

<Sec {n} title={t('WOF.Lifepath.step.graduation')} hint={t('WOF.Lifepath.grad.hint')} />
<ol class="lp-flow">
  {#each flow as f, i (i)}<li><b>{f.title}.</b> {f.text} <span class="note">{f.exit}</span></li>{/each}
</ol>

{#if g}
  <div class="lp-block rank-block">
    <div class="rank-card">
      <span class="lbl">{t('WOF.Lifepath.grad.meritTotal')}</span>
      <span class="big">{g.meritTotal}</span>
    </div>
    <div class="rank-card">
      <span class="lbl">{t('WOF.Actor.Soldier.FIELDS.class_rank.label')}</span>
      <span class="big">{g.rank.rank}</span>
      <span class="note">{t('WOF.Lifepath.grad.ofClass')}</span>
    </div>
    {#if g.rank.top10}
      <div class="rank-card top"><span class="stamp" use:settle>{t('WOF.Lifepath.grad.top10')}</span><span class="note">{t('WOF.Lifepath.grad.declined')}</span></div>
    {/if}
  </div>

  <div class="lp-block">
    <h4 class="lp-q">{t('WOF.Lifepath.grad.specialty')}</h4>
    <Pick options={specialties} value={s.specialty} label={t('WOF.Lifepath.grad.specialty')} disabled={ro} cols={3} onpick={(id) => act.choose('specialty', id)} />
  </div>

  {#if g.specialty && key}
    <div class="lp-block">
      <h4 class="lp-q">{t('WOF.Lifepath.grad.swapFloor')}</h4>
      <div class="swap-grid">
        {#each ATTRS as a (a)}
          <div class="swap-cell s-{a}" class:key={a === key} class:moved={a === g.swapped || (g.after && g.after[a] !== g.before[a])}>
            <img class="ic s16" src={attrIcon(a)} alt="" />
            <span class="lbl">{attrName(a)}</span>
            <span class="swap-v"><b>{g.before[a]}</b>{#if g.after && g.after[a] !== g.before[a]}<i class="fa-solid fa-arrow-right" inert></i><b class="to">{g.after[a]}</b>{/if}</span>
            {#if a === key}<span class="stamp key">{t('WOF.Lifepath.file.key')}</span>{/if}
          </div>
        {/each}
      </div>
      {#if !g.swap}
        <p class="note">{t('WOF.Lifepath.grad.noSwap', { a: attrName(key) })}</p>
      {:else if g.swap.length > 1}
        <p class="note red-text">{t('WOF.Lifepath.grad.swapTie', { a: attrName(key) })}</p>
        <div class="seg">
          {#each g.swap as a (a)}<button type="button" class="s-{a}" aria-pressed={s.grad.swapWith === a} disabled={ro} onclick={() => act.choose('grad.swapWith', a)}><img class="ic s16" src={attrIcon(a)} alt="" />{attrName(a)}</button>{/each}
        </div>
      {:else}
        <p class="note">{t('WOF.Lifepath.grad.swapped', { a: attrName(key), b: attrName(g.swap[0]) })}</p>
      {/if}
      {#if g.floor.points > 0}
        <p class="note red-text">{t('WOF.Lifepath.grad.floor', { a: attrName(key), n: g.floor.points, left: floorLeft })}</p>
        <div class="seg">
          {#each g.floor.needs ?? [] as a (a)}<button type="button" class="s-{a}" disabled={ro} onclick={() => act.choose('grad.floor', [...s.grad.floor, a])}><img class="ic s16" src={attrIcon(a)} alt="" />{t('WOF.Lifepath.grad.lower', { a: attrName(a) })}</button>{/each}
          {#if s.grad.floor.length}<button type="button" disabled={ro} onclick={() => act.choose('grad.floor', [])}>{t('WOF.Lifepath.grad.floorUndo')}</button>{/if}
        </div>
      {/if}
      {#if g.rank.top10 && g.after}<p class="note">{t('WOF.Lifepath.grad.top10Line', { a: attrName(key), v: g.after[key] })}</p>{/if}
    </div>

    <div class="lp-block">
      <h4 class="lp-q"><img class="ic s24" src={iconPath('talent-dice')} alt="" />{t('WOF.Lifepath.grad.talent', { name: g.specialty.name })}</h4>
      <p class="note">{t('WOF.Lifepath.grad.talentHint', { name: g.specialty.name, n: talentOptions.filter((x) => !x.disabled).length })}</p>
      <Pick options={talentOptions} value={s.grad.talent} label={t('WOF.Lifepath.grad.talent', { name: g.specialty.name })} disabled={ro || !g.after} cols={3} onpick={(id) => act.choose('grad.talent', id)} />
    </div>
  {/if}
{/if}
