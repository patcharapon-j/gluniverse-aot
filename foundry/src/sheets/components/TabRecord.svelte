<script lang="ts">
  import { proseMirror } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { setField } from '../soldier-ops.ts';
  import type { SoldierView } from '../soldier-view.ts';
  import Sec from './Sec.svelte';
  import Stepper from './Stepper.svelte';

  let { view }: { view: SoldierView } = $props();
  const { actor } = sheetContext();
  const s = $derived(view.system);
  const ro = $derived(!view.editable);
  const RANKS = ['private', 'squad-leader', 'section-commander'];
  const XP_BOXES = 10;

  const milestones = $derived([
    { text: t('WOF.Sheet.record.enlisted'), on: true },
    { text: view.specialty ? view.specialty.name : t('WOF.Sheet.record.noSpecialty'), on: !!view.specialty },
    { text: t('WOF.Sheet.record.top10'), on: s.class_rank !== null && s.class_rank <= 10 },
    { text: t('WOF.Actor.Base.FIELDS.faced_a_titan.label'), on: s.faced_a_titan },
    { text: t('WOF.Actor.Base.FIELDS.killed_a_person.label'), on: s.killed_a_person },
    { text: t('WOF.Actor.Soldier.FIELDS.declined_military_police.label'), on: s.declined_military_police },
    { text: t('WOF.Actor.Base.FIELDS.retiring.label'), on: s.retiring },
  ]);

</script>

<div class="block">
  <Sec n="1" title={t('WOF.Sheet.record.service')} />
  <div class="record">
    <div class="card-typed">
      <dl class="facts">
        <dt>{t('WOF.Sheet.record.name')}</dt><dd>{view.name}</dd>
        <dt>{t('TYPES.Item.specialty')}</dt>
        <dd>{view.specialty ? t('WOF.Sheet.record.specialtyLine', { name: view.specialty.name, attr: view.keyAttribute ? t(`WOF.Attribute.${view.keyAttribute}`) : '' }) : t('WOF.Sheet.none')}</dd>
        <dt>{t('TYPES.Item.origin')}</dt><dd>{view.origin?.name ?? t('WOF.Sheet.none')}</dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.haven.label')}</dt><dd>{s.haven || '—'}</dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.canon_tie.label')}</dt><dd>{s.canon_tie || '—'}</dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.class_rank.label')}</dt>
        <dd>
          <input
            type="number"
            min="1"
            value={s.class_rank ?? ''}
            placeholder="—"
            disabled={ro}
            onchange={(e) => setField(actor, 'system.class_rank', e.currentTarget.value === '' ? null : Math.max(1, Math.round(Number(e.currentTarget.value))))}
          />
        </dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.merit.label')}</dt>
        <dd>
          <input
            type="number"
            value={s.merit ?? ''}
            placeholder="—"
            disabled={ro}
            onchange={(e) => setField(actor, 'system.merit', e.currentTarget.value === '' ? null : Math.round(Number(e.currentTarget.value)))}
          />
        </dd>
        <dt>{t('WOF.Sheet.record.declined')}</dt>
        <dd>
          <input
            type="checkbox"
            checked={s.declined_military_police}
            disabled={ro}
            aria-label={t('WOF.Actor.Soldier.FIELDS.declined_military_police.label')}
            onchange={(e) => setField(actor, 'system.declined_military_police', e.currentTarget.checked)}
          />
        </dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.rank.label')}</dt>
        <dd>
          <select value={s.rank} disabled={ro} onchange={(e) => setField(actor, 'system.rank', e.currentTarget.value)}>
            {#each RANKS as r (r)}<option value={r}>{t(`WOF.Rank.${r}`)}</option>{/each}
          </select>
        </dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.xp.label')}</dt>
        <dd class="vrow">
          <span class="xp" role="img" aria-label={t('WOF.Sheet.record.xpAria', { n: s.xp })}>
            {#each Array.from({ length: Math.max(XP_BOXES, s.xp) }) as _, i (i)}<i class:on={i < s.xp}></i>{/each}
          </span>
          <Stepper value={s.xp} label={t('WOF.Actor.Soldier.FIELDS.xp.label')} disabled={ro} onset={(n) => setField(actor, 'system.xp', n)} />
        </dd>
      </dl>
    </div>
    <div class="milestones">
      {#each milestones as m, i (i)}<span class="stamp" class:off={!m.on}>{m.text}</span>{/each}
    </div>
  </div>
</div>

<div class="block notes">
  <Sec n="2" title={t('WOF.Actor.Base.FIELDS.notes.label')} hint={t('WOF.Sheet.record.notesHint')} />
  {#key s.notes}
    <div use:proseMirror={{ name: 'system.notes', value: s.notes, enriched: view.notesHTML, editable: view.editable, documentUUID: view.uuid, onsave: (html) => setField(actor, 'system.notes', html) }}></div>
  {/key}
</div>
