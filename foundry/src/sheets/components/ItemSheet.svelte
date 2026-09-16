<script lang="ts">
  /**
   * The item slips (core-plan 2c): one compact card per Item type in the Personnel File language,
   * every model field shown and editable by the owner, and the description in Foundry's editor.
   */
  import { tick } from 'svelte';
  import { fx, jolt, pulse } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { gainedInjuryState, type InjuryType } from '../../rules/harm.ts';
  import { motionMode } from '../../settings.svelte.ts';
  import { proseMirror, tooltip } from '../actions.ts';
  import { setSheetContext, t } from '../context.ts';
  import type { ItemView } from '../item-view.ts';
  import { TALENT_LIMITS } from '../item-view.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import { icon } from '../soldier-view.ts';
  import Chips from './Chips.svelte';
  import Pips from './Pips.svelte';
  import Sec from './Sec.svelte';
  import Stepper from './Stepper.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<ItemView>; sheet: any } = $props();
  // svelte-ignore state_referenced_locally
  setSheetContext({ sheet, actor: sheet.document, state: sheetState, uid: `wof-${sheet.id}` });
  // svelte-ignore state_referenced_locally
  const item = sheet.document;

  const W = CONFIG.WOF;
  const view = $derived(sheetState.view);
  const s = $derived(view.system);
  const ro = $derived(!view.editable);
  const set = (path: string, value: unknown) => item.update({ [path]: value });

  const POSITIONS = ['distant', 'in-reach', 'on-body', 'blind-spot'];
  const TIME_LIMITS = ['turn', 'engagement', 'day'];
  const attributeOptions = (W.attributes as { id: string }[]).map((a) => ({ id: a.id, name: t(`WOF.Attribute.${a.id}`) }));
  const entryOptions = (W.actionCatalog as { id: string; name: string; kind: string }[]).filter((e) => e.kind !== 'option').map((e) => ({ id: e.id, name: e.name }));
  const specialtyOptions = (W.specialties as { id: string; name: string }[]).map((x) => ({ id: x.id, name: x.name }));
  const talentOptions = Object.entries(W.talentNames as Record<string, string>)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const gearOptions = (W.gearItems as { id: string; name: string; subtype: string | null }[]).filter((g) => g.subtype);

  const atZero = $derived((W.gearItems as { id: string; atZero: string | null }[]).find((g) => g.id === s.item_id)?.atZero ?? null);

  let slipEl: HTMLElement | undefined = $state();
  let typesEl: HTMLElement | undefined = $state();

  const commaList = (v: string) => v.split(',').map((x) => x.trim()).filter(Boolean);

  /** Choosing another gear item takes that row's fixed fields (data/gear/items.yaml) and keeps the state. */
  function setGearItem(id: string) {
    const row = (W.gearItems as any[]).find((g) => g.id === id);
    if (!row) return;
    return item.update({
      'system.item_id': id,
      'system.subtype': row.subtype,
      'system.rated': row.rated,
      'system.gear_dice_for': row.gearDiceFor,
      'system.items_counted': row.itemsCounted,
      'system.passable': row.passable,
      ...(view.embedded ? {} : { name: row.name }),
    });
  }

  /** A new Injury Type re-applies the table's type riders; a held injury also takes that type's name. */
  async function setInjuryType(type: InjuryType) {
    if (type === s.injury_type) return;
    const { state } = gainedInjuryState({
      rowId: s.row,
      location: s.location,
      row: s.row_data,
      riders: s.type_riders,
      type,
      side: s.side,
      sidedLocations: W.sidedLocations,
    });
    await item.update({
      'system.injury_type': type,
      'system.time_limit': state.time_limit,
      'system.healing_days_left': state.healing_days_left,
      ...(view.embedded && s.row_data.names[type] ? { name: s.row_data.names[type] } : {}),
    });
    await tick();
    fx(typesEl?.querySelector('[aria-pressed="true"]'), { scale: [1.2, 1], duration: MOTION.base, ease: MOTION.settle });
    pulse(slipEl?.querySelector('.slip-h'), MOTION.colors.notice);
  }

  async function toggleTreated() {
    await set('system.treated', !s.treated);
    await tick();
    if (s.treated) pulse(slipEl?.querySelector('.slip-h'), MOTION.colors.ok);
    else jolt(slipEl?.querySelector('.slip-h'));
  }

  function setDays(i: number, total: number) {
    const done = total - s.healing_days_left;
    const nextDone = i < done ? i : i + 1;
    return set('system.healing_days_left', Math.max(0, total - nextDone));
  }
</script>

<div class="wof-sheet compact slip-sheet slip-{view.type}" data-motion={motionMode()} bind:this={slipEl}>
  <header class="slip-h">
    <img class="slip-img" src={view.img} alt="" data-edit="img" data-action={view.editable ? 'editImage' : undefined} use:tooltip={view.editable ? t('WOF.ItemSheet.imageEdit') : null} />
    <div class="ident">
      <div class="kicker"><img class="ic s16" src={view.icon} alt="" />{view.typeLabel}<span class="serial">{view.embedded ? t('WOF.ItemSheet.heldBy', { name: view.ownerName }) : t('WOF.ItemSheet.compendiumSlip')}</span></div>
      <input class="name" type="text" value={view.name} aria-label={t('WOF.ItemSheet.name')} disabled={ro} onchange={(e) => item.update({ name: e.currentTarget.value.trim() || view.name })} />
      {#if view.type === 'critical-injury' && view.injury}
        <p class="sub">{t('WOF.ItemSheet.injuryLine', { name: view.injury.shownName, location: view.injury.locationLabel, range: view.injury.range })}</p>
      {/if}
    </div>
    {#if view.type === 'critical-injury' && view.embedded}
      <button type="button" class="stamp st {s.treated ? 'ok' : ''}" disabled={ro} aria-pressed={s.treated} onclick={toggleTreated}>{t(s.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.bleeding')}</button>
    {/if}
  </header>

  <div class="body">
    {#if view.type === 'talent'}
      <div class="block">
        <Sec n="1" title={t('WOF.ItemSheet.rule')} />
        <div class="grid-form">
          <span class="lbl">{t('WOF.Item.Talent.FIELDS.type.label')}</span>
          <select value={s.type} disabled={ro} onchange={(e) => set('system.type', e.currentTarget.value)}>
            <option value="dice">{t('WOF.TalentType.dice')}</option>
            <option value="rule">{t('WOF.TalentType.rule')}</option>
          </select>
          <span class="lbl">{t('WOF.Item.Talent.FIELDS.max_level.label')}</span>
          <Stepper value={s.max_level} min={1} max={3} label={t('WOF.Item.Talent.FIELDS.max_level.label')} disabled={ro} onset={(n) => item.update({ 'system.max_level': n, 'system.level': Math.min(s.level, n) })} />
          <span class="lbl">{t('WOF.Item.Talent.FIELDS.level.label')}</span>
          <Pips value={s.level} max={s.max_level} min={view.embedded ? 1 : 0} cls={s.type === 'dice' ? 'dt' : 'da'} disabled={ro} label={t('WOF.Item.Talent.FIELDS.level.label')} onset={(n) => set('system.level', n)} />
          <span class="lbl">{t('WOF.Item.Talent.FIELDS.limit.label')}</span>
          <select value={s.limit} disabled={ro} onchange={(e) => set('system.limit', e.currentTarget.value)}>
            {#each TALENT_LIMITS as l (l)}<option value={l}>{t(`WOF.TalentLimit.${l}`)}</option>{/each}
          </select>
          {#if s.limit !== 'none'}
            <span class="lbl">{t('WOF.Item.Talent.FIELDS.used.label')}</span>
            <label class="check"><input type="checkbox" checked={s.used} disabled={ro} onchange={(e) => set('system.used', e.currentTarget.checked)} />{t('WOF.Item.Talent.FIELDS.used.hint')}</label>
          {/if}
          <span class="lbl">{t('WOF.Item.Talent.FIELDS.names.label')}</span>
          <Chips items={view.entries} options={entryOptions} label={t('WOF.Item.Talent.FIELDS.names.label')} disabled={ro} onchange={(ids) => set('system.names', ids)} />
          <span class="lbl">{t('WOF.Item.Talent.FIELDS.specialties.label')}</span>
          <Chips items={view.specialties} options={specialtyOptions} label={t('WOF.Item.Talent.FIELDS.specialties.label')} disabled={ro} onchange={(ids) => set('system.specialties', ids)} />
        </div>
        {#if s.type === 'rule'}
          <label class="stack"><span class="lbl">{t('WOF.Item.Talent.FIELDS.trigger.label')}</span><textarea rows="2" value={s.trigger} disabled={ro} onchange={(e) => set('system.trigger', e.currentTarget.value)}></textarea></label>
        {/if}
        <label class="stack"><span class="lbl">{t('WOF.Item.Talent.FIELDS.effect.label')}</span><textarea rows="2" value={s.effect} disabled={ro} onchange={(e) => set('system.effect', e.currentTarget.value)}></textarea></label>
        {#if view.conditions.length}
          <p class="lbl" style="margin-top:8px">{t('WOF.Item.Talent.FIELDS.condition.label')}</p>
          <dl class="facts">{#each view.conditions as c (c.entry)}<dt>{c.entry}</dt><dd>{c.text}</dd>{/each}</dl>
        {/if}
      </div>
    {:else if view.type === 'specialty'}
      <div class="block">
        <Sec n="1" title={t('WOF.ItemSheet.rule')} />
        <div class="grid-form">
          <span class="lbl">{t('WOF.Item.Specialty.FIELDS.key_attribute.label')}</span>
          <select value={s.key_attribute} disabled={ro} onchange={(e) => set('system.key_attribute', e.currentTarget.value)}>
            {#each attributeOptions as a (a.id)}<option value={a.id}>{a.name}</option>{/each}
          </select>
          <span class="lbl">{t('WOF.Item.Specialty.FIELDS.talents.label')}</span>
          <Chips items={view.talents} options={talentOptions} label={t('WOF.Item.Specialty.FIELDS.talents.label')} disabled={ro} onchange={(ids) => set('system.talents', ids)} />
          <span class="lbl">{t('WOF.Item.Specialty.FIELDS.squadmate_template.label')}</span>
          <input type="text" value={s.squadmate_template} disabled={ro} onchange={(e) => set('system.squadmate_template', e.currentTarget.value.trim())} />
          <span class="lbl">{t('WOF.Item.Specialty.FIELDS.specialty_id.label')}</span>
          <input type="text" value={s.specialty_id} disabled={ro} onchange={(e) => set('system.specialty_id', e.currentTarget.value.trim())} />
        </div>
      </div>
    {:else if view.type === 'origin'}
      <div class="block">
        <Sec n="1" title={t('WOF.ItemSheet.rule')} />
        <div class="grid-form">
          <span class="lbl">{t('WOF.Item.Origin.FIELDS.results.label')}</span>
          <input type="text" value={s.results.join(', ')} disabled={ro} onchange={(e) => set('system.results', commaList(e.currentTarget.value).map(Number).filter((n) => n >= 11 && n <= 66))} />
          <span class="lbl">{t('WOF.Item.Origin.FIELDS.attributes.label')}</span>
          <Chips items={view.attributes} options={attributeOptions} label={t('WOF.Item.Origin.FIELDS.attributes.label')} disabled={ro} onchange={(ids) => set('system.attributes', ids)} />
          <span class="lbl">{t('WOF.Item.Origin.FIELDS.talent_choice.label')}</span>
          <Chips items={view.talents} options={talentOptions} label={t('WOF.Item.Origin.FIELDS.talent_choice.label')} disabled={ro} onchange={(ids) => set('system.talent_choice', ids)} />
          <span class="lbl">{t('WOF.Item.Origin.FIELDS.haven_choice.label')}</span>
          <textarea rows={Math.max(2, s.haven_choice.length)} value={s.haven_choice.join('\n')} placeholder={t('WOF.ItemSheet.lineList')} disabled={ro} onchange={(e) => set('system.haven_choice', e.currentTarget.value.split('\n').map((x) => x.trim()).filter(Boolean))}></textarea>
          <span class="lbl">{t('WOF.Item.Origin.FIELDS.canon_tie.character.label')}</span>
          <input type="text" value={s.canon_tie.character} disabled={ro} onchange={(e) => set('system.canon_tie.character', e.currentTarget.value)} />
          <span class="lbl">{t('WOF.Item.Origin.FIELDS.canon_tie.link.label')}</span>
          <input type="text" value={s.canon_tie.link} disabled={ro} onchange={(e) => set('system.canon_tie.link', e.currentTarget.value)} />
          <span class="lbl">{t('WOF.Item.Origin.FIELDS.condition.campaign_year_min.label')}</span>
          <input type="number" value={s.condition.campaign_year_min ?? ''} placeholder="—" disabled={ro} onchange={(e) => set('system.condition.campaign_year_min', e.currentTarget.value === '' ? null : Math.round(Number(e.currentTarget.value)))} />
        </div>
      </div>
    {:else if view.type === 'gear'}
      <div class="block">
        <Sec n="1" title={t('WOF.ItemSheet.article')} hint={t(`WOF.GearSubtype.${s.subtype}`)} />
        <div class="grid-form">
          <span class="lbl">{t('WOF.Item.Gear.FIELDS.item_id.label')}</span>
          <select value={s.item_id} disabled={ro} onchange={(e) => setGearItem(e.currentTarget.value)}>
            {#each gearOptions as g (g.id)}<option value={g.id}>{g.name}</option>{/each}
          </select>
          <span class="lbl">{t('WOF.Item.Gear.FIELDS.gear_dice_for.label')}</span>
          <span>{view.gearDiceFor.length ? view.gearDiceFor.map((x) => x.name).join(', ') : t('WOF.Sheet.none')}</span>
          <span class="lbl">{t('WOF.Item.Gear.FIELDS.items_counted.label')}</span>
          <span>{s.items_counted}{#if s.subtype === 'blade-set'} <span class="note">{t('WOF.ItemSheet.bladeCount')}</span>{/if}</span>
          <span class="lbl">{t('WOF.Item.Gear.FIELDS.passable.label')}</span>
          <span>{t(s.passable ? 'WOF.ItemSheet.yes' : 'WOF.ItemSheet.no')}</span>
          <span class="lbl">{t('WOF.Item.Gear.FIELDS.kept.label')}</span>
          <input type="checkbox" checked={s.kept} disabled={ro} onchange={(e) => set('system.kept', e.currentTarget.checked)} />
        </div>
      </div>
      <div class="block">
        <Sec n="2" title={t('WOF.ItemSheet.state')} />
        {#if s.rated}
          <div class="grid-form">
            <span class="lbl">{t('WOF.Item.Gear.FIELDS.rating.label')}</span>
            <Stepper value={s.rating} min={1} max={3} label={t('WOF.Item.Gear.FIELDS.rating.label')} disabled={ro} onset={(n) => item.update({ 'system.rating': n, 'system.current': Math.min(s.current, n) })} />
            <span class="lbl">{t('WOF.Item.Gear.FIELDS.current.label')}</span>
            <span class="vrow">
              <Pips value={s.current} max={s.rating} cls="dg" disabled={ro} label={t('WOF.Item.Gear.FIELDS.current.label')} onset={(n) => set('system.current', n)} />
              {#if s.current <= 0 && atZero && atZero !== 'none'}<span class="tag grave">{t(`WOF.GearState.${atZero}`)}</span>{/if}
            </span>
          </div>
        {:else}
          <p class="note">{t('WOF.Sheet.kit.unrated')}</p>
        {/if}
        <div class="subpanel">
          {#if s.subtype === 'blade-set'}
            <label class="check"><input type="checkbox" checked={s.in_handles} disabled={ro} onchange={(e) => set('system.in_handles', e.currentTarget.checked)} />{t('WOF.Item.Gear.FIELDS.in_handles.label')}</label>
          {:else if s.subtype === 'firearm'}
            <label class="check"><input type="checkbox" checked={s.loaded} disabled={ro} onchange={(e) => set('system.loaded', e.currentTarget.checked)} />{t('WOF.Item.Gear.FIELDS.loaded.label')}</label>
          {:else if s.subtype === 'horse'}
            <label class="check"><input type="checkbox" checked={s.mounted} disabled={ro} onchange={(e) => item.update({ 'system.mounted': e.currentTarget.checked, ...(e.currentTarget.checked ? { 'system.position.position': null, 'system.position.titan': '', 'system.position.left': false } : {}) })} />{t('WOF.Item.Gear.FIELDS.mounted.label')}</label>
            {#if !s.mounted}
              <div class="grid-form">
                <span class="lbl">{t('WOF.Item.Gear.FIELDS.position.position.label')}</span>
                <select value={s.position.position ?? ''} disabled={ro} onchange={(e) => set('system.position.position', e.currentTarget.value || null)}>
                  <option value="">—</option>
                  {#each POSITIONS as p (p)}<option value={p}>{t(`WOF.Position.${p}`)}</option>{/each}
                </select>
                <span class="lbl">{t('WOF.Item.Gear.FIELDS.position.titan.label')}</span>
                <input type="text" value={s.position.titan} disabled={ro} onchange={(e) => set('system.position.titan', e.currentTarget.value)} />
                <span class="lbl">{t('WOF.Item.Gear.FIELDS.position.left.label')}</span>
                <input type="checkbox" checked={s.position.left} disabled={ro} onchange={(e) => set('system.position.left', e.currentTarget.checked)} />
              </div>
            {/if}
          {:else if s.subtype === 'prosthetic'}
            <div class="grid-form">
              <span class="lbl">{t('WOF.Item.Gear.FIELDS.side.label')}</span>
              <select value={s.side ?? ''} disabled={ro} onchange={(e) => set('system.side', e.currentTarget.value || null)}>
                <option value="">—</option>
                <option value="left">{t('WOF.Side.left')}</option>
                <option value="right">{t('WOF.Side.right')}</option>
              </select>
            </div>
          {:else if s.subtype === 'kit'}
            <p class="note">{t(s.item_id === 'tool-kit' ? 'WOF.ItemSheet.toolKit' : 'WOF.ItemSheet.medicalKit')}</p>
          {:else if s.subtype === 'odm'}
            <p class="note">{t('WOF.ItemSheet.odmNote')}</p>
          {/if}
        </div>
      </div>
    {:else if view.type === 'critical-injury' && view.injury}
      {@const inj = view.injury}
      <div class="block">
        <Sec n="1" title={t('WOF.Item.CriticalInjury.FIELDS.injury_type.label')} hint={t('WOF.ItemSheet.typeHint')} />
        <div class="typepick" role="group" aria-label={t('WOF.Item.CriticalInjury.FIELDS.injury_type.label')} bind:this={typesEl}>
          {#each inj.names as n (n.type)}
            <button type="button" aria-pressed={s.injury_type === n.type} disabled={ro} onclick={() => setInjuryType(n.type as InjuryType)}>
              <img src={icon(`injury-${n.type}`)} alt="" />
              <span class="lbl">{t(`WOF.InjuryType.${n.type}`)}</span>
              <span class="tn">{n.name}</span>
            </button>
          {/each}
        </div>
      </div>
      <div class="two even">
        <div class="block">
          <Sec n="2" title={t('WOF.ItemSheet.held')} />
          <div class="grid-form">
            {#if inj.sided}
              <span class="lbl">{t('WOF.Item.CriticalInjury.FIELDS.side.label')}</span>
              <select value={s.side ?? ''} disabled={ro} onchange={(e) => set('system.side', e.currentTarget.value || null)}>
                <option value="">—</option>
                <option value="left">{t('WOF.Side.left')}</option>
                <option value="right">{t('WOF.Side.right')}</option>
              </select>
            {/if}
            <span class="lbl">{t('WOF.Item.CriticalInjury.FIELDS.time_limit.label')}</span>
            <select value={s.time_limit ?? ''} disabled={ro} onchange={(e) => set('system.time_limit', e.currentTarget.value || null)}>
              <option value="">{t('WOF.Sheet.injury.noLimit')}</option>
              {#each TIME_LIMITS as tl (tl)}<option value={tl}>{t(`WOF.TimeLimit.${tl}`)}</option>{/each}
            </select>
            <span class="lbl">{t('WOF.Item.CriticalInjury.FIELDS.treated.label')}</span>
            <input type="checkbox" checked={s.treated} disabled={ro} onchange={() => toggleTreated()} />
            <span class="lbl">{t('WOF.Item.CriticalInjury.FIELDS.halved.label')}</span>
            <input type="checkbox" checked={s.halved} disabled={ro} onchange={(e) => set('system.halved', e.currentTarget.checked)} />
          </div>
          <p class="lbl" style="margin:8px 0 4px">{t('WOF.Sheet.injury.days', { left: s.healing_days_left })}</p>
          <span class="days" role="group" aria-label={t('WOF.Sheet.injury.days', { left: s.healing_days_left })}>
            {#each Array.from({ length: inj.healingTotal }) as _, i (i)}
              {@const done = i < inj.healingTotal - s.healing_days_left}
              <button type="button" class="day" class:done disabled={ro} aria-label={t(done ? 'WOF.Sheet.injury.dayDone' : 'WOF.Sheet.injury.day', { n: i + 1 })} onclick={() => setDays(i, inj.healingTotal)}>{i + 1}</button>
            {:else}<span class="note">{t('WOF.ItemSheet.noHealing')}</span>{/each}
          </span>
        </div>
        <div class="block">
          <Sec n="3" title={t('WOF.ItemSheet.row')} hint={inj.range} />
          <ul class="facts-list">
            {#if s.row_data.instant_death}<li class="red-text">{t('WOF.Card.Injury.instantDeath')}</li>{/if}
            {#if s.row_data.down === 'until_treated'}<li class="red-text">{t('WOF.Card.Injury.down')}</li>{/if}
            {#if s.row_data.lethal && !s.row_data.instant_death}<li class="red-text">{t('WOF.Sheet.injury.lethal', { limit: s.row_data.time_limit ? t(`WOF.TimeLimit.${s.row_data.time_limit}`) : '—' })}</li>{/if}
            {#if s.row_data.death_roll_penalty}<li>{t('WOF.ItemSheet.deathPenalty', { n: s.row_data.death_roll_penalty })}</li>{/if}
            {#each inj.effects as line, i (i)}<li>{line}</li>{/each}
            {#each inj.permanent as line, i (i)}<li class="red-text">{t('WOF.Sheet.injury.permanent')}: {line}</li>{/each}
            {#if !s.row_data.instant_death}<li>{t('WOF.Card.Injury.healing', { days: s.row_data.healing_days })}</li>{/if}
            {#each inj.riders as line, i (i)}<li class="note">{line}</li>{/each}
          </ul>
        </div>
      </div>
    {/if}

    <div class="block notes">
      <Sec n={view.type === 'critical-injury' ? 4 : view.type === 'gear' ? 3 : 2} title={t(view.htmlField === 'summary' ? 'WOF.Item.Specialty.FIELDS.summary.label' : 'WOF.Item.Talent.FIELDS.description.label')} />
      {#key view.html}
        <div use:proseMirror={{ name: `system.${view.htmlField}`, value: view.html, enriched: view.enriched, editable: view.editable, documentUUID: view.uuid, height: 160, onsave: (html) => set(`system.${view.htmlField}`, html) }}></div>
      {/key}
    </div>
  </div>
</div>
