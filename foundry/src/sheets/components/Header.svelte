<script lang="ts">
  import { contextMenu, tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { deleteItem, openItem, setField } from '../soldier-ops.ts';
  import { icon, type SoldierView } from '../soldier-view.ts';

  let { view }: { view: SoldierView } = $props();
  const { actor } = sheetContext();
  const s = $derived(view.system);
  const d = $derived(view.derived);

  const RANKS = ['private', 'squad-leader', 'section-commander'];
  const serial = $derived(`${t('WOF.Sheet.header.file')} ${view.id.slice(0, 3).toUpperCase()}-${view.id.slice(3, 5).toUpperCase()}`);
  const havens = $derived.by(() => {
    const list = view.origin?.havens ?? [];
    return s.haven && !list.includes(s.haven) ? [...list, s.haven] : list;
  });

  const ordinal = (n: number | null) => (n === null ? '' : t('WOF.Sheet.ordinal', { n }));
  // The Class Rank number carries no caption of its own on a narrow sheet, so its tooltip names it.
  const classRankTip = $derived(
    [t('WOF.Actor.Soldier.FIELDS.class_rank.label'), s.class_rank ? ordinal(s.class_rank) : ''].filter(Boolean).join(': '),
  );

  const tags = $derived.by(() => {
    const out: { cls: string; text: string; tip?: string }[] = [];
    out.push(s.down ? { cls: 'grave', text: t('WOF.Actor.Base.FIELDS.down.label') } : { cls: 'ok', text: t('WOF.Sheet.state.standing') });
    for (const w of view.injuries) out.push({ cls: w.treated ? 'warn' : 'grave', text: `${w.name}, ${t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.untreated')}` });
    for (const r of view.responses) out.push({ cls: 'grave', text: r.name, tip: r.effects.join('; ') });
    if (view.gear.some((g) => g.subtype === 'odm') && s.gas_rating <= 0) out.push({ cls: 'grave', text: t('WOF.Sheet.state.outOfGas') });
    if (d.jammed) out.push({ cls: 'grave', text: t('WOF.Derived.jammed') });
    if (d.lame) out.push({ cls: 'warn', text: t('WOF.Sheet.state.horseLame') });
    if (view.gear.some((g) => g.subtype === 'blade-set') && !view.gear.some((g) => g.subtype === 'blade-set' && g.inHandles))
      out.push({ cls: 'grave', text: t('WOF.Sheet.state.handlesEmpty') });
    if (d.overloaded) out.push({ cls: 'warn', text: t('WOF.Derived.overloaded') });
    if (s.pinned.active) out.push({ cls: 'grave', text: t('WOF.Actor.Base.FIELDS.pinned.label') });
    if (s.airborne) out.push({ cls: 'info', text: t('WOF.Actor.Base.FIELDS.airborne.label') });
    if (s.carrying) out.push({ cls: 'info', text: t('WOF.Sheet.state.carrying', { name: view.comrades.find((c) => c.id === s.carrying)?.name ?? '?' }) });
    if (s.carried_by) out.push({ cls: 'info', text: t('WOF.Sheet.state.carriedBy', { name: view.comrades.find((c) => c.id === s.carried_by)?.name ?? '?' }) });
    if (s.next_roll_penalty > 0) out.push({ cls: 'warn', text: t('WOF.Sheet.state.nextRoll', { dice: s.next_roll_penalty }) });
    if (s.retiring) out.push({ cls: 'warn', text: t('WOF.Actor.Base.FIELDS.retiring.label') });
    return out;
  });

  const itemMenu = (id: string | undefined) => () =>
    id
      ? [
          { label: t('WOF.Sheet.menu.open'), icon: 'fa-solid fa-book-open', onClick: () => openItem(actor, id) },
          { label: t('WOF.Sheet.menu.remove'), icon: 'fa-solid fa-trash', visible: view.editable, onClick: () => deleteItem(actor, id) },
        ]
      : [];
</script>

<header class="hdr">
  <figure class="plate">
    <img
      src={view.img}
      alt={t('WOF.Sheet.header.portrait', { name: view.name })}
      data-edit="img"
      data-action={view.editable ? 'editImage' : undefined}
      use:tooltip={view.editable ? t('WOF.Sheet.header.portraitEdit') : null}
    />
    <figcaption>{t('WOF.Sheet.header.plate')}</figcaption>
  </figure>

  <div class="ident">
    <div class="kicker">
      <img class="ic s16" src={view.specialty?.icon ?? icon('brand-emblem')} alt="" />
      {t('WOF.Sheet.header.kicker')}
      <span class="serial">{serial}</span>
    </div>
    <input
      class="name"
      type="text"
      value={view.name}
      aria-label={t('WOF.Sheet.header.name')}
      disabled={!view.editable}
      onchange={(e) => actor.update({ name: e.currentTarget.value.trim() || view.name })}
    />
    <div class="meta line">
      <span use:contextMenu={itemMenu(view.specialty?.id)} use:tooltip={t('TYPES.Item.specialty')}>
        <span class="cap">{t('TYPES.Item.specialty')}</span>
        {#if view.specialty}
          <button type="button" class="link" onclick={() => openItem(actor, view.specialty!.id)}>{view.specialty.name}</button>
        {:else}<b class="blank" use:tooltip={t('WOF.Sheet.drop.hint')}>{t('WOF.Sheet.none')}</b>{/if}
      </span>
      <span use:contextMenu={itemMenu(view.origin?.id)} use:tooltip={t('TYPES.Item.origin')}>
        <span class="cap">{t('TYPES.Item.origin')}</span>
        {#if view.origin}
          <button type="button" class="link" onclick={() => openItem(actor, view.origin!.id)}>{view.origin.name}</button>
        {:else}<b class="blank" use:tooltip={t('WOF.Sheet.drop.hint')}>{t('WOF.Sheet.none')}</b>{/if}
      </span>
      <label class="grow" use:tooltip={t('WOF.Actor.Soldier.FIELDS.haven.label')}>
        <span class="cap">{t('WOF.Actor.Soldier.FIELDS.haven.label')}</span>
        {#if havens.length}
          <select value={s.haven} disabled={!view.editable} onchange={(e) => setField(actor, 'system.haven', e.currentTarget.value)}>
            <option value="">{t('WOF.Sheet.choose')}</option>
            {#each havens as h (h)}<option value={h}>{h}</option>{/each}
          </select>
        {:else}
          <input type="text" value={s.haven} disabled={!view.editable} onchange={(e) => setField(actor, 'system.haven', e.currentTarget.value)} />
        {/if}
      </label>
      <label class="grow" use:tooltip={t('WOF.Actor.Soldier.FIELDS.canon_tie.label')}>
        <span class="cap">{t('WOF.Actor.Soldier.FIELDS.canon_tie.label')}</span>
        <input type="text" value={s.canon_tie} placeholder={view.origin?.canonTie || ''} disabled={!view.editable} onchange={(e) => setField(actor, 'system.canon_tie', e.currentTarget.value)} />
      </label>
      <!-- Rank and the Class Rank number read as one field, so the line stays five wide. -->
      <span class="rankf">
        <label use:tooltip={t('WOF.Actor.Soldier.FIELDS.rank.label')}>
          <span class="cap">{t('WOF.Actor.Soldier.FIELDS.rank.label')}</span>
          <select value={s.rank} disabled={!view.editable} onchange={(e) => setField(actor, 'system.rank', e.currentTarget.value)}>
            {#each RANKS as r (r)}<option value={r}>{t(`WOF.Rank.${r}`)}</option>{/each}
          </select>
        </label>
        <input
          type="number"
          class="short"
          min="1"
          step="1"
          value={s.class_rank ?? ''}
          aria-label={t('WOF.Actor.Soldier.FIELDS.class_rank.label')}
          use:tooltip={classRankTip}
          disabled={!view.editable}
          onchange={(e) => setField(actor, 'system.class_rank', e.currentTarget.value === '' ? null : Math.max(1, Math.round(Number(e.currentTarget.value))))}
        />
      </span>
    </div>
    <div class="tags">
      {#each tags as tag, i (i)}<span class="tag {tag.cls}" use:tooltip={tag.tip}>{tag.text}</span>{/each}
    </div>
  </div>

  <div class="crest"><img src={icon('brand-emblem')} alt={t('WOF.SystemTitle')} /></div>
</header>
