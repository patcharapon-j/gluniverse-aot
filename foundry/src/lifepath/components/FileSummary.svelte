<script lang="ts">
  /** The running file: the soldier as the steps up to this one leave them. */
  import type { Attributes } from '../../rules/derived.ts';
  import { attributeTotal, classRankFor, levelTotal, type Levels } from '../../rules/lifepath.ts';
  import { t } from '../../sheets/context.ts';
  import type { WizardView } from '../wizard-app.ts';
  import { ATTRS, attrIcon, attrName, signed, specialtyIcon, talentInfo } from './helpers.ts';

  let { view }: { view: WizardView } = $props();
  const r = $derived(view.r);
  const s = $derived(view.state);
  const tables = $derived(view.tables);
  const built = $derived(s.procedure === 'template-build' || s.procedure === 'free-build');

  /** The last step at or before the open one that has computed values. */
  function upTo<T>(map: Partial<Record<string, T>>): T | null {
    const idx = r.rail.indexOf(s.step);
    let out: T | null = null;
    for (const id of r.rail.slice(0, idx + 1)) if (map[id] !== undefined) out = map[id] as T;
    return out;
  }
  function before<T>(map: Partial<Record<string, T>>): T | null {
    const idx = r.rail.indexOf(s.step);
    let out: T | null = null;
    for (const id of r.rail.slice(0, idx)) if (map[id] !== undefined) out = map[id] as T;
    return out;
  }

  const start = $derived(Object.fromEntries(ATTRS.map((a) => [a, tables.rules.start])) as Attributes);
  const attrs = $derived(upTo(r.attrs) ?? (built ? null : start));
  const prev = $derived(before(r.attrs) ?? (built ? null : start));
  const levels = $derived(upTo(r.levels) ?? ({} as Levels));
  const merit = $derived(built ? null : (upTo(r.merit) ?? 0));
  const specialty = $derived(tables.specialties.find((x) => x.id === s.specialty) ?? null);
  const key = $derived(specialty?.key ?? null);
  const origin = $derived(r.origin?.row ?? null);
  const drive = $derived(tables.enlistment.find((x) => x.id === s.enlist.drive)?.drive ?? null);
  const rank = $derived(!built && merit !== null && (s.step === 'graduation' || r.rail.indexOf(s.step) > r.rail.indexOf('graduation')) ? classRankFor(tables.classRank, merit) : null);
  const talents = $derived(Object.entries(levels).filter(([, v]) => v > 0).map(([id, v]) => ({ ...talentInfo(tables, id), level: v })));
  const maxOf = (a: string) => (a === key ? tables.rules.keyMax : tables.rules.cap);
</script>

<aside class="lp-file" aria-label={t('WOF.Lifepath.file.title')}>
  <h3 class="sec"><span class="n">§</span>{t('WOF.Lifepath.file.title')}</h3>
  <div class="lf-attrs">
    {#each ATTRS as a (a)}
      {@const v = attrs?.[a] ?? null}
      {@const up = v !== null && prev !== null && v !== prev[a]}
      <div class="lf-attr s-{a}" class:key={a === key} class:up>
        <img class="ic s16" src={attrIcon(a)} alt="" />
        <span class="lf-an">{attrName(a)}{#if a === key}<span class="stamp key">{t('WOF.Lifepath.file.key')}</span>{/if}</span>
        <span class="dots sm" role="img" aria-label={t('WOF.Sheet.aria.rating', { label: attrName(a), value: v ?? 0, max: maxOf(a) })}>
          <span class="grp">{#each Array.from({ length: maxOf(a) }) as _, i (i)}<i class="da{v !== null && i < v ? '' : ' o'}"></i>{/each}</span>
        </span>
        <b class="lf-av">{v ?? '–'}</b>
      </div>
    {/each}
    {#if attrs}<p class="lf-total"><span class="lbl">{t('WOF.Lifepath.file.total')}</span><b>{attributeTotal(attrs)}</b></p>{/if}
  </div>

  <dl class="facts lf-facts">
    <dt>{t('TYPES.Item.origin')}</dt><dd>{origin?.name ?? '–'}</dd>
    {#if s.origin.haven}<dt>{t('WOF.Actor.Soldier.FIELDS.haven.label')}</dt><dd>{s.origin.haven}</dd>{/if}
    <dt>{t('WOF.Actor.Soldier.FIELDS.drive.label')}</dt><dd class="lf-drive">{drive?.name ?? '–'}</dd>
    <dt>{t('TYPES.Item.specialty')}</dt>
    <dd>{#if specialty}<img class="ic s16" src={specialtyIcon(specialty.id)} alt="" /> {specialty.name}{:else}–{/if}</dd>
    {#if !built}
      <dt>{t('WOF.Actor.Soldier.FIELDS.merit.label')}</dt><dd><b>{signed(merit ?? 0).replace('−', '-')}</b></dd>
      {#if rank}<dt>{t('WOF.Actor.Soldier.FIELDS.class_rank.label')}</dt><dd>{t('WOF.Sheet.ordinal', { n: rank.rank })}{#if rank.top10}<span class="stamp lf-top">{t('WOF.Lifepath.grad.top10')}</span>{/if}</dd>{/if}
    {:else}
      <dt>{t('WOF.Actor.Soldier.FIELDS.merit.label')}</dt><dd>{t('WOF.Lifepath.none')}</dd>
    {/if}
  </dl>

  <h4 class="lbl lf-h">{t('WOF.Lifepath.file.talents', { n: levelTotal(levels) })}</h4>
  {#each talents as x (x.id)}
    <div class="lf-tal">
      <img class="ic s16" src={x.icon} alt="" />
      <span>{x.name}</span>
      <span class="dots sm" role="img" aria-label={t('WOF.Lifepath.file.level', { name: x.name, level: x.level })}><span class="grp">{#each Array.from({ length: Math.min(2, x.maxLevel) }) as _, i (i)}<i class="dt{i < x.level ? '' : ' o'}"></i>{/each}</span></span>
    </div>
  {:else}
    <p class="empty">{t('WOF.Lifepath.file.noTalents')}</p>
  {/each}
</aside>
