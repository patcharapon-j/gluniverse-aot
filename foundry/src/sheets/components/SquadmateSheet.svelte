<script lang="ts">
  /**
   * The compact Squadmate sheet (core-plan 2c): the stat block of data/character/squadmates.yaml on
   * one card, reusing the Soldier sheet's vitals strip, Wounds & Mind tab, and Kit ledger.
   */
  import { tick } from 'svelte';
  import { jolt, pulse, reveal } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { motionMode, viewer } from '../../settings.svelte.ts';
  import { contextMenu, dragItem, proseMirror, tooltip } from '../actions.ts';
  import { setSheetContext, t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import { deleteItem, openItem, setField, setItem } from '../soldier-ops.ts';
  import { icon, type SoldierView } from '../soldier-view.ts';
  import Dots from './Dots.svelte';
  import Sec from './Sec.svelte';
  import TabKit from './TabKit.svelte';
  import TabWounds from './TabWounds.svelte';
  import Tabs from './Tabs.svelte';
  import Vitals from './Vitals.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<SoldierView>; sheet: any } = $props();
  // svelte-ignore state_referenced_locally
  setSheetContext({ sheet, actor: sheet.document, state: sheetState, uid: `wof-${sheet.id}` });
  // svelte-ignore state_referenced_locally
  const actor = sheet.document;

  const view = $derived(sheetState.view);
  const s = $derived(view.system);
  const d = $derived(view.derived);
  const ro = $derived(!view.editable);
  const attributes = CONFIG.WOF.attributes as { id: string; summary: string }[];
  const TABS = [
    { id: 'stat', label: 'WOF.Squad.tab.stat' },
    { id: 'wounds', label: 'WOF.Sheet.tab.wounds' },
    { id: 'kit', label: 'WOF.Sheet.tab.kit' },
  ];

  const talent = $derived(view.talents[0] ?? null);
  const soldiers = $derived(
    [...(game.actors ?? [])]
      .filter((a: any) => a.type === 'soldier')
      .map((a: any) => ({ id: a.id, name: a.name }))
      .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)),
  );
  const wingName = $derived(soldiers.find((x) => x.id === s.wing)?.name ?? '');

  let body: HTMLElement | undefined = $state();
  let paper: HTMLElement | undefined = $state();
  let injEl: HTMLElement | undefined = $state();

  async function select(id: string) {
    if (sheetState.tab === id) return;
    sheetState.tab = id;
    await tick();
    const tabs = paper?.querySelector<HTMLElement>('.tabs');
    if (paper && tabs && paper.scrollTop > tabs.offsetTop) paper.scrollTo({ top: tabs.offsetTop - 8 });
    reveal(body?.firstElementChild);
  }

  async function toggleTreated(id: string, treated: boolean) {
    await setItem(actor, id, { 'system.treated': !treated });
    await tick();
    const row = injEl?.querySelector(`[data-item-id="${id}"]`);
    if (treated) jolt(row);
    else pulse(row, MOTION.colors.ok);
  }

  const itemMenu = (id: string) => () => [
    { label: t('WOF.Sheet.menu.open'), icon: 'fa-solid fa-book-open', onClick: () => openItem(actor, id) },
    { label: t('WOF.Sheet.menu.remove'), icon: 'fa-solid fa-trash', visible: view.editable, onClick: () => deleteItem(actor, id) },
  ];

  const tags = $derived.by(() => {
    const out: { cls: string; text: string }[] = [];
    out.push(s.down ? { cls: 'grave', text: t('WOF.Actor.Base.FIELDS.down.label') } : { cls: 'ok', text: t('WOF.Sheet.state.standing') });
    if (wingName) out.push({ cls: 'info', text: t('WOF.Squad.onWing', { name: wingName }) });
    const untreated = view.injuries.filter((w) => !w.treated).length;
    if (untreated) out.push({ cls: 'grave', text: t('WOF.Squad.untreated', { n: untreated }) });
    if (d.jammed) out.push({ cls: 'grave', text: t('WOF.Derived.jammed') });
    if (d.overloaded) out.push({ cls: 'warn', text: t('WOF.Derived.overloaded') });
    if (s.pinned.active) out.push({ cls: 'grave', text: t('WOF.Actor.Base.FIELDS.pinned.label') });
    return out;
  });
</script>

<div class="wof-sheet compact" bind:this={paper} data-gore={viewer.gore} data-motion={motionMode()} style="--wof-loop: {MOTION.loop}ms">
  <header class="hdr">
    <figure class="plate">
      <img src={view.img} alt={t('WOF.Sheet.header.portrait', { name: view.name })} data-edit="img" data-action={view.editable ? 'editImage' : undefined} use:tooltip={view.editable ? t('WOF.Sheet.header.portraitEdit') : null} />
      <figcaption>{t('WOF.Sheet.header.plate')}</figcaption>
    </figure>
    <div class="ident">
      <div class="kicker">
        <img class="ic s16" src={view.specialty?.icon ?? icon('brand-emblem')} alt="" />
        {t('WOF.Squad.kicker')}
        <span class="serial">{s.template ? t('WOF.Squad.template', { id: s.template }) : ''}</span>
      </div>
      <input class="name" type="text" value={view.name} aria-label={t('WOF.Squad.name')} disabled={ro} onchange={(e) => actor.update({ name: e.currentTarget.value.trim() || view.name })} />
      <div class="meta">
        <span use:contextMenu={view.specialty ? itemMenu(view.specialty.id) : () => []}>
          {t('TYPES.Item.specialty')}
          {#if view.specialty}<button type="button" class="link" onclick={() => openItem(actor, view.specialty!.id)}>{view.specialty.name}</button>
          {:else}<b class="blank" use:tooltip={t('WOF.Sheet.drop.hint')}>{t('WOF.Sheet.none')}</b>{/if}
        </span>
        <label>
          {t('WOF.Actor.Squadmate.FIELDS.wing.label')}
          <select value={s.wing} disabled={ro} onchange={(e) => setField(actor, 'system.wing', e.currentTarget.value)}>
            <option value="">{t('WOF.Squad.noWing')}</option>
            {#each soldiers as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
            {#if s.wing && !wingName}<option value={s.wing}>{s.wing}</option>{/if}
          </select>
        </label>
      </div>
      <div class="tags">
        {#each tags as tag, i (i)}<span class="tag {tag.cls}">{tag.text}</span>{/each}
      </div>
    </div>
  </header>

  <Vitals {view} compact />

  <Tabs tabs={TABS} {sheetState} {sheet} onselect={select} label={t('WOF.Squad.tab.label')} />

  <div class="body" bind:this={body} id="{sheet.id}-panel" role="tabpanel" aria-labelledby="{sheet.id}-tab-{sheetState.tab}">
    {#if sheetState.tab === 'wounds'}
      <section class="panel"><TabWounds {view} /></section>
    {:else if sheetState.tab === 'kit'}
      <section class="panel"><TabKit {view} /></section>
    {:else}
      <section class="panel">
        <div class="block">
          <Sec n="1" title={t('WOF.Sheet.soldier.attributes')} hint={t('WOF.Squad.attributesHint')} />
          <div class="attrlist">
            {#each attributes as a (a.id)}
              {@const v = s.attributes[a.id]}
              <div class="attr s-{a.id}">
                <img class="ic" src={icon(`attr-${a.id}`)} alt="" />
                <span class="nm">{t(`WOF.Attribute.${a.id}`)}{#if view.keyAttribute === a.id}<span class="stamp key">{t('WOF.Sheet.soldier.key')}</span>{/if}</span>
                <Dots groups={[{ cls: 'da', n: v }, { cls: 'da o', n: Math.max(0, view.attributeMax[a.id] - v) }]} label={t('WOF.Sheet.aria.rating', { label: t(`WOF.Attribute.${a.id}`), value: v, max: view.attributeMax[a.id] })} />
                <b>{v}</b>
              </div>
            {/each}
          </div>
        </div>

        <div class="two even">
          <div class="block">
            <Sec n="2" title={t('TYPES.Item.talent')} hint={t('WOF.Squad.talentHint')} />
            {#if talent}
              <div class="tal" data-item-id={talent.id} use:dragItem={{ item: actor.items.get(talent.id) }} use:contextMenu={itemMenu(talent.id)}>
                <div class="tal-h">
                  <img class="ic" src={icon(talent.type === 'dice' ? 'talent-dice' : 'talent-rule')} alt="" />
                  <strong><button type="button" class="link" onclick={() => openItem(actor, talent.id)}>{talent.name}</button></strong>
                  <Dots groups={[{ cls: talent.type === 'dice' ? 'dt' : 'da', n: talent.level }, { cls: 'dt o', n: Math.max(0, talent.maxLevel - talent.level) }]} label={t('WOF.Sheet.aria.rating', { label: talent.name, value: talent.level, max: talent.maxLevel })} />
                </div>
                <p>{talent.text}</p>
                <div class="for">
                  <span>{talent.forLine}</span>
                  {#if talent.hasLimit}
                    <label class="check"><input type="checkbox" checked={talent.used} disabled={ro} onchange={(e) => setItem(actor, talent.id, { 'system.used': e.currentTarget.checked })} />{t('WOF.Item.Talent.FIELDS.used.label')}</label>
                  {/if}
                </div>
              </div>
            {:else}
              <p class="dropzone">{t('WOF.Squad.dropTalent')}</p>
            {/if}
          </div>

          <div class="block">
            <Sec n="3" title={t('WOF.Squad.mind')} />
            <dl class="facts">
              <dt>{t('WOF.Derived.resolve')}</dt>
              <dd><b class="num">{d.resolve}</b> <span class="note">{t('WOF.Sheet.resolve.short', { base: Math.ceil((s.attributes.instinct + s.attributes.empathy) / 2), scars: s.scars.length, grief: Math.min(s.grief, 3) })}</span></dd>
              <dt>{t('WOF.Actor.Base.FIELDS.scars.label')}</dt>
              <dd>{view.scars.length ? view.scars.map((x) => x.name).join(', ') : t('WOF.Sheet.none')}</dd>
              <dt>{t('WOF.Actor.Base.FIELDS.grief.label')}</dt>
              <dd>
                <span class="grief sm" role="group" aria-label={t('WOF.Actor.Base.FIELDS.grief.label')}>
                  {#each Array.from({ length: CONFIG.WOF.maxGrief }) as _, i (i)}
                    <button type="button" class:on={i < s.grief} disabled={ro} aria-pressed={i < s.grief} aria-label={t('WOF.Sheet.wounds.griefN', { n: i + 1 })} onclick={() => setField(actor, 'system.grief', s.grief === i + 1 ? i : i + 1)}></button>
                  {/each}
                </span>
              </dd>
              <dt>{t('WOF.Actor.Base.FIELDS.lasting_stress_responses.label')}</dt>
              <dd>{view.responses.length ? view.responses.map((x) => x.name).join(', ') : t('WOF.Sheet.none')}</dd>
            </dl>
          </div>
        </div>

        <div class="block" bind:this={injEl}>
          <Sec n="4" title={t('WOF.Sheet.wounds.injuries')} hint={t('WOF.Sheet.wounds.injuriesHint', { held: view.injuries.length, untreated: view.injuries.filter((w) => !w.treated).length })} />
          {#each view.injuries as w (w.id)}
            <div class="slipline" class:treated={w.treated} data-item-id={w.id} use:dragItem={{ item: actor.items.get(w.id) }} use:contextMenu={itemMenu(w.id)}>
              <img src={w.img} alt="" />
              <span class="sl-main">
                <button type="button" class="link" onclick={() => openItem(actor, w.id)}>{w.name}</button>
                <span class="lbl">{[w.side ? t(`WOF.Side.${w.side}`) : '', w.locationLabel, t(`WOF.InjuryType.${w.type}`)].filter(Boolean).join(', ')}</span>
              </span>
              <button type="button" class="mini" class:red={!w.treated} disabled={ro} onclick={() => toggleTreated(w.id, w.treated)}>{t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.treat')}</button>
            </div>
          {:else}
            <p class="empty">{t('WOF.Sheet.wounds.noInjuries')}</p>
          {/each}
          <p class="dropzone">{t('WOF.Sheet.drop.injuries')}</p>
        </div>

        <div class="block notes">
          <Sec n="5" title={t('WOF.Actor.Base.FIELDS.notes.label')} />
          {#key s.notes}
            <div use:proseMirror={{ name: 'system.notes', value: s.notes, enriched: view.notesHTML, editable: view.editable, documentUUID: view.uuid, height: 140, onsave: (html) => setField(actor, 'system.notes', html) }}></div>
          {/key}
        </div>
      </section>
    {/if}
  </div>

  <footer class="foot"><span class="lbl">{t('WOF.Squad.footLeft')}</span><span class="lbl">{t('WOF.Sheet.foot.right')}</span></footer>
</div>
