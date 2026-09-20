<script lang="ts">
  /**
   * The Titan sheet (core-plan 2c; preview-v2-1-personnel-file.html, Titan window): the stat block,
   * the inked Body Part figure, the Regeneration clock, Openings, Attention, and the sealed Next
   * Behavior. The GM edits everything; an Observer sees only the public values the view carries.
   */
  import { tick } from 'svelte';
  import { stagger } from 'animejs/utils';
  import { rollTitanAttack } from '../../dice/reactions.ts';
  import { flash, fx, jolt, pulse, reveal } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { motionMode, viewer } from '../../settings.svelte.ts';
  import { proseMirror, tooltip } from '../actions.ts';
  import { setSheetContext, t } from '../context.ts';
  import { titanFigure, titanPartSpot } from '../figure.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import { icon } from '../soldier-view.ts';
  import { INJURY_LOCATIONS, INJURY_TYPES, POSITIONS } from '../../models/fields.ts';
  import { blankEffect, freeResults, partsUsedCounts, partsUsedList, PART_KINDS, readResults, TITAN_EFFECTS, TITAN_TARGETS, TITAN_TIERS, type BehaviorRow } from '../../rules/titan.ts';
  import {
    addBehaviorEntry,
    copyBehaviorTable,
    cyclePart,
    fillRegen,
    removeBehaviorEntry,
    rollNextBehavior,
    setBehaviorEntry,
    setField,
    setOpenings,
    setPartProgress,
    stepBackRegen,
    strikePart,
  } from '../titan-ops.ts';
  import type { EntryView, PartView, TitanView } from '../titan-view.ts';
  import Dots from './Dots.svelte';
  import Plate from './Plate.svelte';
  import RegenClock from './RegenClock.svelte';
  import Sec from './Sec.svelte';
  import Stepper from './Stepper.svelte';
  import Tabs from './Tabs.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<TitanView>; sheet: any } = $props();
  const isGM = !!game.user?.isGM;
  // svelte-ignore state_referenced_locally
  setSheetContext({ sheet, actor: sheet.document, state: sheetState, uid: `wof-${sheet.id}` });
  // svelte-ignore state_referenced_locally
  const actor = sheet.document;
  // svelte-ignore state_referenced_locally
  const uid = `wof-${sheet.id}`;

  const view = $derived(sheetState.view);
  const ro = $derived(!view.editable);
  const tabs = $derived([
    { id: 'engagement', label: 'WOF.TitanSheet.tab.engagement' },
    ...(view.full ? [{ id: 'behavior', label: 'WOF.TitanSheet.tab.behavior' }] : []),
    { id: 'record', label: 'WOF.TitanSheet.tab.record' },
  ]);
  const tab = $derived(tabs.some((x) => x.id === sheetState.tab) ? sheetState.tab : 'engagement');

  let body: HTMLElement | undefined = $state();
  let figEl: HTMLElement | undefined = $state();
  let partsEl: HTMLElement | undefined = $state();
  let tokensEl: HTMLElement | undefined = $state();
  let clockEl: HTMLElement | undefined = $state();
  let sealEl: HTMLElement | undefined = $state();
  let peek = $state(false);
  let regenNote = $state('');
  let rollNote = $state('');
  /** The id of the Behavior Table entry whose form is open, or none. */
  let editing = $state('');

  /** The system's own Titans, whose Behavior Table a Titan written by hand can start from. */
  const tableSources = CONFIG.WOF.titans as { id: string; name: string }[];
  const freeLine = $derived(freeResults(view.entries.map((e) => e.row)));
  // Every table needs the entry the Titan falls back on when nothing else can happen.
  const needsThrash = $derived(view.entries.length > 0 && !view.entries.some((e) => e.tier === 'thrash'));

  const setEntry = (index: number, patch: Partial<BehaviorRow>) => setBehaviorEntry(actor, index, patch);

  /** One effect of an entry, changed, added, or dropped in place. */
  function setEffects(index: number, effects: Record<string, unknown>[]) {
    return setEntry(index, { effects });
  }

  function togglePosition(index: number, row: BehaviorRow, position: string, on: boolean) {
    const kept = row.position_requirement.filter((p) => p !== position);
    // An entry with no Position left could never happen, so the last one stays.
    const next = on ? [...kept, position] : kept;
    return setEntry(index, { position_requirement: next.length ? POSITIONS.filter((p) => next.includes(p)) : row.position_requirement });
  }

  function setPartsUsed(index: number, row: BehaviorRow, kind: string, n: number) {
    const counts = partsUsedCounts(row.body_parts_used);
    counts[kind] = Math.max(0, Math.min(4, Math.round(n)));
    return setEntry(index, { body_parts_used: partsUsedList(counts) });
  }

  async function copyTable(select: HTMLSelectElement) {
    const id = select.value;
    select.value = '';
    if (!id) return;
    const held = view.entries.length;
    if (held && !(await foundry.applications.api.DialogV2.confirm({ window: { title: t('WOF.TitanSheet.entry.copy') }, content: `<p>${t('WOF.TitanSheet.entry.copyWarn', { n: held })}</p>` }))) return;
    if (await copyBehaviorTable(actor, id)) {
      await tick();
      reveal(body?.querySelector('.behave'));
    }
  }

  /** Removing an entry loses what the GM wrote, so it is asked for first. */
  async function dropEntry(index: number, name: string) {
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: t('WOF.TitanSheet.entry.remove') },
      content: `<p>${t('WOF.TitanSheet.entry.removeWarn', { name })}</p>`,
    });
    if (ok) await removeBehaviorEntry(actor, index);
  }

  async function addEntry() {
    await addBehaviorEntry(actor);
    await tick();
    const last = body?.querySelector<HTMLElement>('.behave li:last-child');
    reveal(last);
    last?.scrollIntoView({ block: 'nearest' });
  }

  const stateLabel = (s: string) => t(`WOF.BodyPartState.${s}`);
  const figure = $derived(
    titanFigure(
      view.parts.map((p) => ({ index: p.index, kind: p.kind, side: p.side, state: p.state })),
      `${uid}-tf`,
      t('WOF.TitanSheet.figureAria', { list: view.parts.map((p) => `${p.label} ${stateLabel(p.state)}`).join(', ') }),
      t('WOF.TitanSheet.nape'),
      { dead: !!view.corpse },
    ),
  );

  const tags = $derived.by(() => {
    const out: { cls: string; text: string }[] = [];
    if (view.corpse) out.push({ cls: 'grave', text: t('WOF.Actor.Titan.FIELDS.corpse.label') });
    else out.push(view.grounded ? { cls: 'grave', text: t('WOF.TitanSheet.grounded') } : { cls: 'ok', text: t('WOF.TitanSheet.standing') });
    if (view.abnormal) out.push({ cls: 'warn', text: t('WOF.Actor.Titan.FIELDS.abnormal.label') });
    out.push({ cls: 'info', text: t('WOF.TitanSheet.openingsTag', { n: view.openings }) });
    if (view.holder.value) out.push({ cls: 'info', text: t('WOF.TitanSheet.heldBy', { name: view.holder.name }) });
    return out;
  });

  async function select(id: string) {
    if (sheetState.tab === id) return;
    sheetState.tab = id;
    await tick();
    body?.scrollTo({ top: 0 });
    reveal(body?.firstElementChild);
  }

  function steamPuff(p: PartView, heavy: boolean) {
    if (motionMode() !== 'full' || viewer.gore === 'low') return;
    const g = figEl?.querySelector('.puffs');
    if (!g) return;
    const [x, y] = titanPartSpot(p);
    g.innerHTML = Array.from({ length: heavy ? 6 : 3 }, (_, i) => `<circle class="steam-bed puff" cx="${x + ((i % 3) - 1) * 6}" cy="${y - 4}" r="${heavy ? 5 : 3.5}"/>`).join('');
    const puffs = [...g.children];
    fx(puffs, { translateY: [0, -34], scale: [0.6, 2.2], opacity: [0.9, 0], duration: MOTION.weighty * 2, delay: stagger(60), ease: 'outQuad' })?.then(() => puffs.forEach((c) => c.remove()));
  }

  const rank = (s: string) => ['intact', 'wounded', 'broken'].indexOf(s);

  /** Animate a part after its update: worse jolts and steams, better settles. */
  async function afterPart(p: PartView, before: string, update: Promise<unknown>) {
    await update;
    await tick();
    const after = view.parts[p.index];
    const card = partsEl?.querySelector(`[data-p="${p.index}"]`);
    const region = figEl?.querySelector(`[data-part="${p.index}"]`);
    if (rank(after.state) > rank(before)) {
      jolt(card);
      fx(card?.querySelector('.state'), { scale: [1.8, 1], rotate: [-20, -3], opacity: [0, 1], duration: MOTION.base, ease: 'outQuad' });
      fx(region, { translateX: [0, -3, 3, 0], duration: MOTION.weighty, ease: MOTION.jolt });
      steamPuff(after, after.state === 'broken');
    } else if (rank(after.state) < rank(before)) pulse(card);
    else fx(card?.querySelector('.tough'), { scale: [1.15, 1], duration: MOTION.base, ease: MOTION.settle });
  }

  function cycle(p: PartView) {
    if (ro) return;
    regenNote = '';
    afterPart(p, p.state, cyclePart(actor, p.index));
  }

  function onFigureClick(e: MouseEvent) {
    const g = (e.target as Element).closest('[data-part]');
    if (!g) return;
    const p = view.parts[Number(g.getAttribute('data-part'))];
    if (p) cycle(p);
  }

  async function onStrike(p: PartView) {
    const before = view.openings;
    await afterPart(p, p.state, strikePart(actor, p.index));
    if (view.openings > before) fx(tokensEl?.lastElementChild, { scale: [0, 1], rotateY: [180, 0], duration: MOTION.weighty, ease: MOTION.settle });
  }

  async function onFill() {
    if (ro || view.regenClock === null) return;
    const from = (view.regeneration * 360) / view.regenClock;
    const openingEls = [...(tokensEl?.querySelectorAll('.token') ?? [])];
    const willFill = view.regeneration + 1 >= view.regenClock;
    if (willFill && openingEls.length) await fx(openingEls, { scale: [1, 0], opacity: [1, 0], duration: MOTION.weighty, delay: stagger(40) })?.then();
    const result = await fillRegen(actor);
    await tick();
    const hand = clockEl?.querySelector('.hand');
    const segs = [...(clockEl?.querySelectorAll('.seg') ?? [])];
    if (!result) {
      regenNote = '';
      fx(hand, { rotate: [from, (view.regeneration * 360) / view.regenClock], duration: MOTION.weighty, ease: MOTION.settle });
      fx(segs[view.regeneration - 1], { scale: [1.22, 1], opacity: [0.3, 1], duration: MOTION.weighty, ease: MOTION.settle });
      fx(clockEl?.querySelector('svg'), { rotate: [0, -6, 3, 0], duration: MOTION.base, ease: MOTION.jolt });
      return;
    }
    flash(clockEl, MOTION.colors.harm);
    const healed = result.healed ? view.parts.find((p) => p.id === result.healed!.id) : null;
    regenNote = t('WOF.TitanSheet.regen.done', {
      erased: result.erased,
      healed: healed ? t('WOF.TitanSheet.regen.healed', { part: healed.label, from: stateLabel(result.healed!.from), to: stateLabel(result.healed!.to) }) : t('WOF.TitanSheet.regen.noHeal'),
    });
    if (result.steam) regenNote += ` ${t('WOF.TitanSheet.regen.steam')}`;
    if (result.stands) regenNote += ` ${t('WOF.TitanSheet.regen.stands')}`;
    if (healed) steamPuff(healed, true);
    pulse(figEl);
    fx(segs, { opacity: [0, 1], duration: MOTION.base, delay: stagger(40) });
  }

  async function changeOpenings(n: number) {
    if (n < view.openings) {
      await fx(tokensEl?.lastElementChild, { scale: [1, 0], opacity: [1, 0], duration: MOTION.base })?.then();
      await setOpenings(actor, n);
      return;
    }
    await setOpenings(actor, n);
    await tick();
    fx(tokensEl?.lastElementChild, { scale: [0, 1], rotateY: [180, 0], duration: MOTION.weighty, ease: MOTION.settle });
  }

  async function togglePeek() {
    peek = !peek;
    await tick();
    if (peek) fx(sealEl?.querySelector('.reveal'), { opacity: [0, 1], translateY: [8, 0], duration: MOTION.weighty });
    else fx(sealEl?.querySelector('img'), { scale: [1.6, 1], opacity: [0, 1], duration: MOTION.weighty, ease: MOTION.settle });
  }

  async function onRoll() {
    const { d6, entry } = await rollNextBehavior(actor);
    const name = view.entries.find((e) => e.id === entry)?.name ?? entry;
    rollNote = t('WOF.TitanSheet.next.rolled', { d6, name });
    await tick();
    fx(sealEl, { rotate: [0, -3, 2, 0], duration: MOTION.base, ease: MOTION.jolt });
  }

  async function toggleRevealed() {
    await setField(actor, 'system.next_behavior.revealed', !view.next.revealed);
    await tick();
    pulse(sealEl, MOTION.colors.notice);
  }

  const open = $derived(view.next.entry && (view.next.revealed || peek));
</script>

{#snippet entryCard(e: EntryView)}
  <strong>{e.name}</strong>
  <p class="eline">{t('WOF.TitanSheet.entryLine', { results: e.resultLabel, tier: e.tierLabel, targets: e.targets })}</p>
  {#if e.attackDice}<Dots size="sm" groups={[{ cls: 'dtn', n: e.attackDice }]} label={t('WOF.Card.Titan.attackDice', { dice: e.attackDice })} />{/if}
  <p>{e.effects.join(' ')}</p>
{/snippet}

{#snippet sealed()}
  <div class="sealed" class:open bind:this={sealEl}>
    {#if open && view.next.entry}
      <div class="reveal">{@render entryCard(view.next.entry)}</div>
    {:else if !view.next.entryId && view.full}
      <p class="reveal-empty">{t('WOF.TitanSheet.next.none')}</p>
    {:else}
      <img src={icon('seal-wax')} alt={t('WOF.TitanSheet.next.seal')} />
    {/if}
  </div>
{/snippet}

<div class="wof-sheet titan-sheet" data-gore={viewer.gore} data-motion={motionMode()} style="--wof-loop: {MOTION.loop}ms">
  <i class="eyelet e1"></i><i class="eyelet e2"></i><i class="eyelet e3"></i>
  <header class="hdr">
    <Plate {actor} src={view.img} alt={t('WOF.TitanSheet.plateAlt', { name: view.name })} caption={t('WOF.TitanSheet.plate', { size: view.sizeClass.label.slice(0, 1) })} editable={view.editable} />
    <div class="ident">
      <div class="kicker">
        <img class="ic s16" src={view.kindIcon} alt="" />
        {t('WOF.TitanSheet.kicker')}
        <span class="serial">{view.focusLabel ? t('WOF.TitanSheet.focus', { label: view.focusLabel }) : ''}</span>
      </div>
      <input class="name" type="text" value={view.name} aria-label={t('WOF.TitanSheet.name')} disabled={ro} onchange={(e) => actor.update({ name: e.currentTarget.value.trim() || view.name })} />
      <div class="meta">
        <span>{t('WOF.Actor.Titan.FIELDS.size_class.label')} <b>{t('WOF.TitanSheet.sizeLine', { size: view.sizeClass.label, height: view.sizeClass.height })}</b></span>
        <span>{t('WOF.TitanSheet.kind')} <b>{t(view.abnormal ? 'WOF.TitanSheet.abnormal' : 'WOF.TitanSheet.standard')}</b></span>
        {#if !view.limited}
          <label>
            {t('WOF.Actor.Titan.FIELDS.focus_titan_label.label')}
            <input type="text" class="short" value={view.focusLabel} placeholder="A" disabled={ro} onchange={(e) => setField(actor, 'system.focus_titan_label', e.currentTarget.value.trim())} />
          </label>
        {/if}
      </div>
      {#if !view.limited}
        <div class="tags">{#each tags as tag, i (i)}<span class="tag {tag.cls}">{tag.text}</span>{/each}</div>
      {/if}
    </div>
    {#if !view.limited}
      <div class="nape">
        <span class="lbl"><img class="ic s16" src={icon('body-nape')} alt="" /> {t('WOF.Actor.Titan.FIELDS.nape_depth.label')}</span>
        {#if view.napeDepth !== null}
          <span class="big red">{view.napeDepth}</span>
          <Dots size="sm" groups={[{ cls: 'da', n: view.napeDepth }]} />
          <span class="note">{t('WOF.TitanSheet.napeNote')}</span>
        {:else}
          <span class="big red" use:tooltip={t('WOF.TitanSheet.hiddenTip')}>?</span>
          <span class="note">{t('WOF.TitanSheet.hidden')}</span>
        {/if}
      </div>
    {/if}
  </header>

  {#if view.limited}
    <div class="body"><p class="empty">{t('WOF.TitanSheet.limited')}</p></div>
  {:else}
    <Tabs tabs={tabs} {sheetState} {sheet} onselect={select} label={t('WOF.TitanSheet.tab.label')} />

    <div class="body" bind:this={body} id="{sheet.id}-panel" role="tabpanel" aria-labelledby="{sheet.id}-tab-{tab}">
      {#if tab === 'behavior' && view.full}
        <section class="panel">
          <Sec n="1" title={t('WOF.Actor.Titan.FIELDS.behavior_table.label')} hint={t('WOF.TitanSheet.behaviorHint')}>
            {#snippet actions()}
              {#if !ro}
                <select class="tcopy" aria-label={t('WOF.TitanSheet.entry.copyLabel')} onchange={(ev) => copyTable(ev.currentTarget)}>
                  <option value="">{t('WOF.TitanSheet.entry.copy')}</option>
                  {#each tableSources as x (x.id)}<option value={x.id}>{x.name}</option>{/each}
                </select>
                <button class="mini" type="button" use:tooltip={t('WOF.TitanSheet.entry.addTip')} onclick={addEntry}>{t('WOF.TitanSheet.entry.add')}</button>
              {/if}
            {/snippet}
          </Sec>
          {#if !view.entries.length}
            <p class="empty">{t(ro ? 'WOF.TitanSheet.entry.noneRead' : 'WOF.TitanSheet.entry.none')}</p>
          {:else if !ro && freeLine.length}
            <p class="note">{t('WOF.TitanSheet.entry.free', { list: freeLine.join(', ') })}</p>
          {/if}
          {#if needsThrash}<p class="note red">{t('WOF.TitanSheet.entry.noThrash')}</p>{/if}
          <ul class="behave">
            {#each view.entries as e, i (e.id)}
              <li class:next={e.id === view.next.entryId} class:prev={e.id === view.previous?.id} class:blocked={!e.canHappen} class:editing={editing === e.id}>
                <span class="d">{e.resultLabel}</span>
                <div>
                  <strong>{e.name}</strong>
                  {#if e.id === view.next.entryId}<span class="stamp info">{t('WOF.TitanSheet.next.short')}</span>{/if}
                  {#if e.id === view.previous?.id}<span class="stamp">{t('WOF.TitanSheet.previous.short')}</span>{/if}
                  {#if !e.canHappen}<span class="stamp">{t('WOF.TitanSheet.cannot')}</span>{/if}
                  <p>{e.text}</p>
                  <p class="eff">{e.effects.join(' ')}</p>
                  <dl class="erow">
                    <div><dt>{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.targets.label')}</dt><dd>{e.targets}</dd></div>
                    <div><dt>{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.position_requirement.label')}</dt><dd>{e.positions}</dd></div>
                    <div><dt>{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.body_parts_used.label')}</dt><dd>{e.bodyParts}</dd></div>
                    <div><dt>{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.fallback.label')}</dt><dd>{e.fallback}</dd></div>
                  </dl>
                  {#if !ro}
                    <div class="eacts">
                      <button type="button" class="mini" aria-expanded={editing === e.id} onclick={() => (editing = editing === e.id ? '' : e.id)}>
                        {t(editing === e.id ? 'WOF.TitanSheet.entry.close' : 'WOF.TitanSheet.entry.edit')}
                      </button>
                      <button type="button" class="mini" use:tooltip={t('WOF.TitanSheet.entry.removeTip')} onclick={() => dropEntry(i, e.name)}>{t('WOF.TitanSheet.entry.remove')}</button>
                    </div>
                  {/if}
                  {#if editing === e.id && !ro}
                    {@const row = e.row}
                    {@const used = partsUsedCounts(row.body_parts_used)}
                    <div class="eedit">
                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.name.label')}</span>
                      <input type="text" aria-label={t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.name.label')} value={row.name} onchange={(ev) => setEntry(i, { name: ev.currentTarget.value.trim() || row.name })} />

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.results.label')}</span>
                      <input type="text" class="short" aria-label={t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.results.label')} value={row.results.join(', ')} use:tooltip={t('WOF.TitanSheet.entry.resultsTip')} onchange={(ev) => setEntry(i, { results: readResults(ev.currentTarget.value) })} />

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.tier.label')}</span>
                      <select aria-label={t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.tier.label')} value={row.tier} onchange={(ev) => setEntry(i, { tier: ev.currentTarget.value })}>
                        {#each TITAN_TIERS as x (x)}<option value={x}>{t(`WOF.Tier.${x}`)}</option>{/each}
                      </select>

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.attack_dice.label')}</span>
                      <input
                        type="number"
                        class="short"
                        min="0"
                        aria-label={t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.attack_dice.label')}
                        value={row.attack_dice ?? ''}
                        use:tooltip={t('WOF.TitanSheet.entry.diceTip')}
                        onchange={(ev) => setEntry(i, { attack_dice: ev.currentTarget.value === '' ? null : Math.max(0, Math.round(Number(ev.currentTarget.value) || 0)) })}
                      />

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.targets.label')}</span>
                      <select aria-label={t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.targets.label')} value={row.targets} onchange={(ev) => setEntry(i, { targets: ev.currentTarget.value })}>
                        {#each TITAN_TARGETS as x (x)}<option value={x}>{t(`WOF.Targets.${x}`)}</option>{/each}
                      </select>

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.position_requirement.label')}</span>
                      <span class="epos">
                        {#each POSITIONS as pos (pos)}
                          <label class="check">
                            <input type="checkbox" checked={row.position_requirement.includes(pos)} onchange={(ev) => togglePosition(i, row, pos, ev.currentTarget.checked)} />
                            {t(`WOF.Position.${pos}`)}
                          </label>
                        {/each}
                      </span>

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.body_parts_used.label')}</span>
                      <span class="epos">
                        {#each PART_KINDS as kind (kind)}
                          <label class="check num">
                            {t(`WOF.BodyPartKind.${kind}`)}
                            <input type="number" min="0" max="4" value={used[kind]} onchange={(ev) => setPartsUsed(i, row, kind, Number(ev.currentTarget.value))} />
                          </label>
                        {/each}
                      </span>

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.fallback.label')}</span>
                      <select aria-label={t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.fallback.label')} value={row.fallback} use:tooltip={t('WOF.TitanSheet.entry.fallbackTip')} onchange={(ev) => setEntry(i, { fallback: ev.currentTarget.value })}>
                        <option value="none">{t('WOF.Sheet.none')}</option>
                        {#each view.entries.filter((x) => x.id !== e.id) as x (x.id)}<option value={x.id}>{x.name}</option>{/each}
                      </select>

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.effects.label')}</span>
                      <span class="efx">
                        {#each row.effects as effect, k (k)}
                          <span class="efx-chip">
                            <b>{t(`WOF.TitanSheet.effect.${effect.type}`)}</b>
                            {#if effect.type === 'stress'}
                              <input
                                type="number"
                                min="1"
                                value={Number(effect.amount ?? 1)}
                                aria-label={t('WOF.TitanSheet.effect.amount')}
                                onchange={(ev) => setEffects(i, row.effects.map((x, j) => (j === k ? { ...x, amount: Math.max(1, Math.round(Number(ev.currentTarget.value) || 1)) } : x)))}
                              />
                            {:else if effect.type === 'critical-injury'}
                              <select
                                value={String(effect.injury_type ?? 'crush')}
                                aria-label={t('WOF.Item.CriticalInjury.FIELDS.injury_type.label')}
                                onchange={(ev) => setEffects(i, row.effects.map((x, j) => (j === k ? { ...x, injury_type: ev.currentTarget.value } : x)))}
                              >
                                {#each INJURY_TYPES as x (x)}<option value={x}>{t(`WOF.InjuryType.${x}`)}</option>{/each}
                              </select>
                              <select
                                value={String(effect.injury_location ?? 'rolled')}
                                aria-label={t('WOF.TitanSheet.effect.where')}
                                onchange={(ev) => setEffects(i, row.effects.map((x, j) => (j === k ? { ...x, injury_location: ev.currentTarget.value } : x)))}
                              >
                                <option value="rolled">{t('WOF.TitanEffect.rolledLocation')}</option>
                                {#each INJURY_LOCATIONS as x (x)}<option value={x}>{t(`WOF.InjuryLocation.${x}`)}</option>{/each}
                              </select>
                              <label class="check">
                                <input
                                  type="checkbox"
                                  checked={!!effect.cannot_be_lethal}
                                  onchange={(ev) => setEffects(i, row.effects.map((x, j) => (j === k ? { ...x, cannot_be_lethal: ev.currentTarget.checked } : x)))}
                                />
                                {t('WOF.TitanSheet.effect.notLethal')}
                              </label>
                            {/if}
                            <button type="button" class="x" aria-label={t('WOF.TitanSheet.effect.drop')} onclick={() => setEffects(i, row.effects.filter((_, j) => j !== k))}>×</button>
                          </span>
                        {/each}
                        <select aria-label={t('WOF.TitanSheet.effect.add')} onchange={(ev) => { const type = ev.currentTarget.value; ev.currentTarget.value = ''; if (type) setEffects(i, [...row.effects, blankEffect(type)]); }}>
                          <option value="">{t('WOF.TitanSheet.effect.add')}</option>
                          {#each TITAN_EFFECTS as x (x)}<option value={x}>{t(`WOF.TitanSheet.effect.${x}`)}</option>{/each}
                        </select>
                      </span>

                      <span class="lbl">{t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.text.label')}</span>
                      <textarea rows="3" aria-label={t('WOF.Actor.Titan.FIELDS.behavior_table.entries.element.text.label')} value={row.text} onchange={(ev) => setEntry(i, { text: ev.currentTarget.value.trim() })}></textarea>
                    </div>
                  {/if}
                </div>
                <span class="tier {e.tier}">
                  {#if e.tierIcon}<img class="ic s16" src={e.tierIcon} alt="" />{/if}
                  {e.tierLabel}
                  {#if e.attackDice}<Dots size="sm" groups={[{ cls: 'dtn', n: e.attackDice }]} label={t('WOF.Card.Titan.attackDice', { dice: e.attackDice })} />{/if}
                  {#if e.attackDice && isGM}
                    <button class="mini" type="button" use:tooltip={t('WOF.Roll.attack.rollTip')} onclick={() => rollTitanAttack(actor, e.id)}><img src={icon('die-titan-attack')} alt="" />{t('WOF.Roll.attack.roll')}</button>
                  {/if}
                </span>
              </li>
            {/each}
          </ul>
          <p class="note legend"><span><Dots size="sm" groups={[{ cls: 'dtn', n: 1 }]} />{t('WOF.TitanSheet.legendTitanDie')}</span></p>
        </section>
      {:else if tab === 'record'}
        <section class="panel">
          <div class="two even">
            <div class="block">
              <Sec n="1" title={t('WOF.TitanSheet.record.status')} />
              <div class="grid-form">
                <span class="lbl">{t('WOF.Actor.Titan.FIELDS.corpse.label')}</span>
                <input type="checkbox" checked={view.corpse} disabled={ro} onchange={(e) => setField(actor, 'system.corpse', e.currentTarget.checked)} />
                <span class="lbl">{t('WOF.Actor.Titan.FIELDS.tempo.label')}</span><span>{view.tempo}</span>
                <span class="lbl">{t('WOF.Actor.Titan.FIELDS.heave.label')}</span><span>{view.heave}</span>
                <span class="lbl">{t('WOF.Actor.Titan.FIELDS.attention_ladder.label')}</span><span>{view.ladder?.name ?? t('WOF.TitanSheet.hidden')}</span>
              </div>
            </div>
            {#if view.abnormal}
              <div class="block">
                <Sec n="2" title={t('WOF.TitanSheet.record.read')} hint={t('WOF.TitanSheet.record.readHint')} />
                <div class="flags col">
                  {#each ['toughness', 'nape_depth', 'regeneration_clock', 'attention_ladder'] as f (f)}
                    <label class="check">
                      <input type="checkbox" checked={view.facts[f as keyof typeof view.facts]} disabled={ro} onchange={(e) => setField(actor, `system.hidden_until_read.${f}`, e.currentTarget.checked)} />
                      {t(`WOF.Actor.Titan.FIELDS.hidden_until_read.${f}.label`)}
                    </label>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
          <div class="block notes">
            <Sec n={view.abnormal ? 3 : 2} title={t('WOF.TitanSheet.record.sightings')} hint={t('WOF.TitanSheet.record.sightingsHint')} />
            {#key view.notesHTML}
              <div use:proseMirror={{ name: 'system.notes', value: actor.system.notes, enriched: view.notesHTML, editable: view.editable, documentUUID: view.uuid, onsave: (html) => setField(actor, 'system.notes', html) }}></div>
            {/key}
          </div>
        </section>
      {:else}
        <section class="panel">
          <div class="two titan-two">
            <div>
              <div class="block">
                <Sec n="1" title={t('WOF.TitanSheet.profile')} hint={t('WOF.TitanSheet.profileHint', { size: view.sizeClass.label })} />
                <div class="tstats">
                  <div class="tstat"><span class="lbl">{t('WOF.Actor.Titan.FIELDS.tempo.label')}</span><span class="big">{view.tempo}</span><span class="note">{t('WOF.TitanSheet.tempoNote')}</span></div>
                  <div class="tstat">
                    <span class="lbl">{t('WOF.Actor.Titan.FIELDS.heave.label')}</span>
                    <span class="big">{view.heaveCount}<small>/{view.heave}</small></span>
                    {#if ro}<span class="note">{t('WOF.TitanSheet.heaveNote')}</span>{:else}<Stepper value={view.heaveCount} max={view.heave} show={false} label={t('WOF.TitanSheet.heaveCount')} onset={(n) => setField(actor, 'system.heave_count', n)} />{/if}
                  </div>
                  <div class="tstat span2" bind:this={clockEl}>
                    <div class="regen">
                      {#if view.regenClock !== null}
                        <RegenClock segments={view.regenClock} filled={view.regeneration} disabled={ro} label={t('WOF.TitanSheet.regen.aria', { filled: view.regeneration, total: view.regenClock })} onfill={onFill} />
                      {:else}
                        <span class="rclock hiddenclock" role="img" aria-label={t('WOF.TitanSheet.regen.hiddenAria', { filled: view.regeneration })}>?</span>
                      {/if}
                      <div class="rtxt">
                        <span class="lbl">{t('WOF.Actor.Titan.FIELDS.regeneration_clock.label')}</span>
                        <span class="big">{view.regeneration}<small>/{view.regenClock ?? '?'}</small></span>
                        <span class="note">{regenNote || t(ro ? 'WOF.TitanSheet.regen.notePlayer' : 'WOF.TitanSheet.regen.note')}</span>
                        {#if !ro}<span><button class="mini" type="button" disabled={view.regeneration <= 0} onclick={() => { regenNote = ''; stepBackRegen(actor).then(() => pulse(clockEl)); }}>{t('WOF.TitanSheet.regen.back')}</button></span>{/if}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="block">
                <Sec n="2" title={t('WOF.Actor.Titan.FIELDS.body_parts.label')} hint={t(ro ? 'WOF.TitanSheet.partsHintPlayer' : 'WOF.TitanSheet.partsHint')} />
                <div class="tbody">
                  <figure class="figbox">
                    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
                    <div class="figwrap titanfig" class:ro bind:this={figEl} onclick={onFigureClick}>{@html figure}</div>
                    <figcaption><span>{t('WOF.TitanSheet.figCaption')}</span><span>{t('WOF.Sheet.figure.sides')}</span></figcaption>
                  </figure>
                  <div class="tparts" bind:this={partsEl}>
                    {#each view.parts as p (p.index)}
                      <div class="tpart" data-p={p.index} data-state={p.state}>
                        <button type="button" class="tp-main" disabled={ro} aria-label={t('WOF.TitanSheet.partAria', { part: p.label, state: stateLabel(p.state) })} onclick={() => cycle(p)}>
                          <img src={p.icon} alt="" />
                          <span>
                            <strong>{p.label}</strong>
                            <span class="eff">{p.state === 'broken' ? p.whenBroken : p.state === 'wounded' ? t('WOF.TitanSheet.woundedNote') : p.shownToughness !== null ? t('WOF.TitanSheet.toughNote', { n: p.shownToughness }) : t('WOF.TitanSheet.toughHidden')}</span>
                          </span>
                        </button>
                        <span class="tough">
                          <span class="state">{stateLabel(p.state)}</span>
                          {#if p.state !== 'broken'}
                            {#if p.shownToughness !== null}
                              <span class="dots sm" role="group" aria-label={t('WOF.TitanSheet.countAria', { part: p.label, count: p.progress, toughness: p.shownToughness })}>
                                <span class="grp">
                                  {#each Array.from({ length: p.shownToughness }) as _, i (i)}
                                    <button type="button" class="pip" disabled={ro} aria-label={t('WOF.TitanSheet.setCount', { part: p.label, n: i + 1 })} onclick={() => afterPart(p, p.state, setPartProgress(actor, p.index, p.progress === i + 1 ? i : i + 1))}><i class="da{i < p.progress ? '' : ' o'}"></i></button>
                                  {/each}
                                </span>
                              </span>
                            {:else}
                              <span class="note">{t('WOF.TitanSheet.countOnly', { n: p.progress })}</span>
                            {/if}
                          {/if}
                          {#if !ro}
                            <button type="button" class="mini tiny" use:tooltip={t(p.state === 'broken' ? 'WOF.TitanSheet.strikeBrokenTip' : 'WOF.TitanSheet.strikeTip')} onclick={() => onStrike(p)}>{t('WOF.TitanSheet.strike')}</button>
                          {/if}
                        </span>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>

              <div class="block">
                <Sec n="3" title={t('WOF.Actor.Titan.FIELDS.openings.label')} hint={t('WOF.TitanSheet.openingsHint')}>
                  {#snippet actions()}
                    {#if !ro}
                      <button class="mini" type="button" aria-label={t('WOF.TitanSheet.addOpening')} onclick={() => changeOpenings(view.openings + 1)}>+1</button>
                      <button class="mini" type="button" aria-label={t('WOF.TitanSheet.removeOpening')} disabled={view.openings <= 0} onclick={() => changeOpenings(view.openings - 1)}>−1</button>
                    {/if}
                  {/snippet}
                </Sec>
                <div class="tokens" bind:this={tokensEl} role="img" aria-label={t('WOF.TitanSheet.openingsTag', { n: view.openings })}>
                  {#each Array.from({ length: view.openings }) as _, i (i)}<span class="token">{i + 1}</span>{:else}<span class="empty">{t('WOF.TitanSheet.noOpenings')}</span>{/each}
                </div>
              </div>
            </div>

            <aside>
              <div class="rail">
                <Sec n="4" title={t('WOF.TitanSheet.attention')} />
                {#if view.ladder}
                  <ol class="ladder" aria-label={view.ladder.name}>
                    {#each view.ladder.rungs as r, i (r.id)}<li><b>{i + 1}</b><span>{r.label}</span></li>{/each}
                  </ol>
                  <p class="note rail-note">{view.ladder.name}</p>
                {:else}
                  <p class="note rail-note">{t('WOF.TitanSheet.ladderHidden')}</p>
                {/if}
                <div class="holder">
                  <div>
                    <span class="lbl">{t('WOF.Actor.Titan.FIELDS.attention_holder.label')}</span>
                    {#if ro}
                      <strong>{view.holder.name}</strong>
                    {:else}
                      <select value={view.holder.value} aria-label={t('WOF.Actor.Titan.FIELDS.attention_holder.label')} onchange={(e) => setField(actor, 'system.attention_holder', e.currentTarget.value)}>
                        <option value="">{t('WOF.TitanSheet.holder.nothing')}</option>
                        <option value="decoy">{t('WOF.TitanSheet.holder.decoy')}</option>
                        {#each view.candidates as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
                      </select>
                    {/if}
                  </div>
                </div>
              </div>

              <div class="rail">
                <Sec n="5" title={t('WOF.Actor.Titan.FIELDS.next_behavior.label')} />
                {@render sealed()}
                <p class="note rail-note">{view.next.revealed ? t('WOF.TitanSheet.next.revealedNote') : t('WOF.TitanSheet.next.sealedNote')}</p>
                {#if view.full}
                  {#if rollNote}<p class="note rail-note">{rollNote}</p>{/if}
                  <div class="rail-acts">
                    {#if isGM && view.next.entry?.attackDice}
                      <button class="mini red" type="button" use:tooltip={t('WOF.Roll.attack.rollTip')} onclick={() => rollTitanAttack(actor, view.next.entryId)}>{t('WOF.Roll.attack.roll')}</button>
                    {/if}
                    <button class="mini" type="button" disabled={!view.next.entryId} onclick={togglePeek}>{t(peek ? 'WOF.TitanSheet.next.reseal' : 'WOF.TitanSheet.next.peek')}</button>
                    {#if !ro}
                      <button class="mini" type="button" use:tooltip={t('WOF.TitanSheet.next.rollTip')} onclick={onRoll}>{t('WOF.TitanSheet.next.roll')}</button>
                      <button class="mini" class:on={view.next.revealed} type="button" aria-pressed={view.next.revealed} disabled={!view.next.entryId} onclick={toggleRevealed}>{t('WOF.TitanSheet.next.reveal')}</button>
                    {/if}
                  </div>
                  {#if !ro}
                    <label class="rail-field">
                      <span class="lbl">{t('WOF.TitanSheet.next.set')}</span>
                      <select value={view.next.entryId} onchange={(e) => setField(actor, 'system.next_behavior.entry', e.currentTarget.value)}>
                        <option value="">{t('WOF.Sheet.none')}</option>
                        {#each view.entries as e (e.id)}<option value={e.id}>{e.resultLabel}: {e.name}</option>{/each}
                      </select>
                    </label>
                    <label class="rail-field">
                      <span class="lbl">{t('WOF.TitanSheet.previous.label')}</span>
                      <select value={view.previous?.id ?? ''} onchange={(e) => setField(actor, 'system.previous_behavior', e.currentTarget.value)}>
                        <option value="">{t('WOF.Sheet.none')}</option>
                        {#each view.entries as e (e.id)}<option value={e.id}>{e.resultLabel}: {e.name}</option>{/each}
                      </select>
                    </label>
                  {/if}
                {:else if view.previous}
                  <p class="note rail-note">{t('WOF.TitanSheet.previous.line', { name: view.previous.name })}</p>
                {/if}
              </div>
            </aside>
          </div>
        </section>
      {/if}
    </div>
  {/if}

  <footer class="foot"><span class="lbl">{t('WOF.TitanSheet.footLeft')}</span><span class="lbl">{t('WOF.TitanSheet.footRight')}</span></footer>
</div>
