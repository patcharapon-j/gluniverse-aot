<script lang="ts">
  /**
   * Wounds & Mind, the Refined Dossier (sheet-overhaul plan, 3.1 and 6): three columns on the
   * paper. The figure (with the Gore switch) stands alone; Critical Injuries and Stress Responses
   * share the middle stack; Scars and Grief, the readout (what the band's Health, Resolve and
   * Stress are built from) and the field record share the last. The band already shows Health and
   * Stress, so this tab carries no tracks of its own.
   *
   * A band chip (Vitals.svelte) sets `SheetState.spotlight` and switches here; the effect below
   * finds that card, scrolls to it, jolts it amber, then clears the spotlight so a second visit
   * animates again.
   */
  import { tick } from 'svelte';
  import { fx, jolt, pulse } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { setGore, viewer } from '../../settings.svelte.ts';
  import type { GoreLevel } from '../../motion/tokens.ts';
  import { contextMenu, dragItem, tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { addListEntry, deleteItem, openItem, removeListEntry, setField, setItem, setListEntry } from '../soldier-ops.ts';
  import { icon, type InjuryView, type SoldierView } from '../soldier-view.ts';
  import Figure from './Figure.svelte';
  import Sec from './Sec.svelte';
  import Stepper from './Stepper.svelte';

  let { view }: { view: SoldierView } = $props();
  const { actor, state: ss } = sheetContext();
  const s = $derived(view.system);
  const d = $derived(view.derived);
  const ro = $derived(!view.editable);
  const W = CONFIG.WOF;
  const TYPES: string[] = W.injuryTypes.map((x: { id: string }) => x.id);
  const GORE: GoreLevel[] = ['low', 'standard', 'graphic'];
  const ENDS = ['titan-engagement-end', 'day', 'rule'];
  const FEAR = ['forced-move', 'forced-action'];
  const scarRows = W.scars as { id: string; name: string }[];
  /** The rows whose harm is permanent, labelled as the injury pack names them. */
  const permanentRows = Object.entries(W.injuryRows as Record<string, { location: string; range: string; name: string; hasPermanent: boolean }>)
    .filter(([, r]) => r.hasPermanent)
    .map(([id, r]) => ({ id, label: t('WOF.Card.Injury.entryName', { location: t(`WOF.InjuryLocation.${r.location}`), range: r.range, name: r.name }) }));
  const lastingRows = (W.stressResponses as { id: string; name: string; lasting: boolean }[]).filter((r) => r.lasting);

  /** Wraps Critical Injuries and Stress Responses (the middle stack), so a spotlight query and a
   * figure pin's `focusInjury` both find their card the same way. */
  let stackEl: HTMLElement | undefined = $state();
  let figEl: HTMLElement | undefined = $state();
  let newScar = $state('');
  let newResponse = $state('');
  let newRally = $state('');

  const untreated = $derived(view.injuries.filter((w) => !w.treated).length);
  const heldScarRows = $derived(new Set(s.scars.map((x: { row: string }) => x.row)));
  const heldResponseRows = $derived(new Set(s.lasting_stress_responses.map((x: { row: string }) => x.row)));
  const base = $derived(Math.ceil((s.attributes.instinct + s.attributes.empathy) / 2));

  async function afterUpdate(p: unknown, fn: () => void) {
    await p;
    await tick();
    fn();
  }

  /** Scrolls a card into view and gives it the amber "you're wanted here" jolt. */
  function highlightCard(selector: string): Element | null | undefined {
    const card = stackEl?.querySelector<HTMLElement>(selector);
    card?.scrollIntoView({ block: 'nearest', behavior: viewer.motion === 'full' && !viewer.reducedByOS ? 'smooth' : 'auto' });
    jolt(card, MOTION.colors.notice);
    return card;
  }

  /** A figure pin was clicked: find its Critical Injury card. */
  function focusInjury(id: string) {
    highlightCard(`.inj[data-item-id="${id}"]`);
  }

  /** A band chip named a card before switching here (SheetState.spot); light it, then clear the
   * spotlight so clicking the same chip again re-triggers the arrival. */
  $effect(() => {
    const spot = ss.spotlight;
    if (!spot) return;
    const selector = spot.kind === 'injury' ? `.inj[data-item-id="${spot.id}"]` : `.resp[data-item-id="${spot.id}"]`;
    tick().then(() => {
      highlightCard(selector);
      ss.spotlight = null;
    });
  });

  function toggleTreated(w: InjuryView) {
    afterUpdate(setItem(actor, w.id, { 'system.treated': !w.treated }), () => {
      const card = stackEl?.querySelector(`.inj[data-item-id="${w.id}"]`);
      if (w.treated) jolt(card);
      else pulse(card, MOTION.colors.ok);
      fx(figEl?.querySelectorAll('.wound') ?? null, { scale: [1.25, 1], opacity: [0, 1], duration: MOTION.weighty, ease: MOTION.settle });
    });
  }

  function setDays(w: InjuryView, dayIndex: number) {
    const done = w.healingTotal - w.healingLeft;
    const nextDone = dayIndex < done ? dayIndex : dayIndex + 1;
    return setItem(actor, w.id, { 'system.healing_days_left': Math.max(0, w.healingTotal - nextDone) });
  }

  async function changeGore(g: GoreLevel) {
    await setGore(g);
    await tick();
    pulse(figEl);
  }

  function setGrief(n: number) {
    const before = d.resolve;
    afterUpdate(setField(actor, 'system.grief', s.grief === n ? n - 1 : n), () => {
      const el = stackEl?.closest('.wof-sheet')?.querySelector('.band .cell.res');
      if (view.derived.resolve < before) jolt(el);
      else pulse(el);
    });
  }

  const injuryMenu = (w: InjuryView) => () => [
    { label: t('WOF.Sheet.menu.open'), icon: 'fa-solid fa-book-open', onClick: () => openItem(actor, w.id) },
    { label: t(w.treated ? 'WOF.Sheet.injury.untreat' : 'WOF.Sheet.injury.treat'), icon: 'fa-solid fa-kit-medical', visible: view.editable, onClick: () => toggleTreated(w) },
    { label: t('WOF.Sheet.menu.remove'), icon: 'fa-solid fa-trash', visible: view.editable, onClick: () => deleteItem(actor, w.id) },
  ];

  const rallied = $derived((s.rallied_outside_titan_engagement_by as string[]).map((id) => ({ id, name: view.comrades.find((c) => c.id === id)?.name ?? id })));
  const scarred = $derived(new Set(s.stabilized_injuries_scarred as string[]));
  const toggleScarred = (id: string, on: boolean) =>
    setField(actor, 'system.stabilized_injuries_scarred', on ? [...scarred, id] : [...scarred].filter((x) => x !== id));
</script>

<div class="wm">
  <figure class="figbox" bind:this={figEl}>
    <Figure injuries={view.injuries} healed={s.healed_permanent_injuries} dead={view.dead} down={s.down} onpin={focusInjury} />
    <div class="gore">
      <span class="lbl" use:tooltip={t('WOF.Settings.gore.hint')}>{t('WOF.Settings.gore.short')}</span>
      <span class="seg" role="group" aria-label={t('WOF.Settings.gore.name')}>
        {#each GORE as g (g)}
          <button type="button" aria-pressed={viewer.gore === g} onclick={() => changeGore(g)}>{t(`WOF.Settings.gore.${g}`)}</button>
        {/each}
      </span>
    </div>
    <figcaption><span>{t('WOF.Sheet.figure.caption')}</span><span>{t('WOF.Sheet.figure.sides')}</span></figcaption>
  </figure>

  <div class="stack" bind:this={stackEl}>
    <div class="block">
      <Sec n="1" title={t('WOF.Sheet.wounds.injuries')} hint={t('WOF.Sheet.wounds.injuriesHint', { held: view.injuries.length, untreated })} />
      {#each view.injuries as w (w.id)}
        <article class="inj" class:untreated={!w.treated} data-item-id={w.id} use:dragItem={{ item: actor.items.get(w.id) }} use:contextMenu={injuryMenu(w)}>
          <div class="inj-h">
            <img src={w.img} alt="" />
            <h4>
              <button type="button" class="link" onclick={() => openItem(actor, w.id)}>{w.name}</button>
              <small>{[w.side ? t(`WOF.Side.${w.side}`) : '', w.locationLabel, t(`WOF.InjuryType.${w.type}`), t('WOF.Sheet.injury.roll', { range: w.range })].filter(Boolean).join(' · ')}</small>
            </h4>
            <button type="button" class="stamp st" class:ok={w.treated} disabled={ro} use:tooltip={t(w.treated ? 'WOF.Sheet.injury.untreat' : 'WOF.Sheet.injury.treat')} onclick={() => toggleTreated(w)}>
              {t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.bleeding')}
            </button>
          </div>
          <div class="fx">
            {#each w.effects as line, i (i)}<span>{line}</span>{/each}
            {#each w.permanent as line, i (i)}<span class="red-text">{t('WOF.Sheet.injury.permanent')}: {line}</span>{/each}
            {#if w.lethal}<span class="red-text">{t('WOF.Sheet.injury.lethal', { limit: w.timeLimit ? t(`WOF.TimeLimit.${w.timeLimit}`) : '—' })}</span>{/if}
            {#if w.down && !w.treated}<span class="red-text">{t('WOF.Card.Injury.down')}</span>{/if}
            {#if !w.treated}<span class="red-text">{t('WOF.Sheet.injury.holdsBox')}</span>{/if}
          </div>
          <div class="opts">
            <select value={w.type} aria-label={t('WOF.Item.CriticalInjury.FIELDS.injury_type.label')} disabled={ro} onchange={(e) => setItem(actor, w.id, { 'system.injury_type': e.currentTarget.value })}>
              {#each TYPES as ty (ty)}<option value={ty}>{t(`WOF.InjuryType.${ty}`)}</option>{/each}
            </select>
            {#if w.sided}
              <select value={w.side ?? 'left'} aria-label={t('WOF.Item.CriticalInjury.FIELDS.side.label')} disabled={ro} onchange={(e) => setItem(actor, w.id, { 'system.side': e.currentTarget.value })}>
                <option value="left">{t('WOF.Side.left')}</option>
                <option value="right">{t('WOF.Side.right')}</option>
              </select>
            {/if}
            <select value={w.timeLimit ?? ''} aria-label={t('WOF.Item.CriticalInjury.FIELDS.time_limit.label')} disabled={ro} onchange={(e) => setItem(actor, w.id, { 'system.time_limit': e.currentTarget.value || null })}>
              <option value="">{t('WOF.Sheet.injury.noLimit')}</option>
              {#each ['turn', 'engagement', 'day'] as tl (tl)}<option value={tl}>{t(`WOF.TimeLimit.${tl}`)}</option>{/each}
            </select>
            <label class="check">
              <input type="checkbox" checked={w.halved} disabled={ro} onchange={(e) => setItem(actor, w.id, { 'system.halved': e.currentTarget.checked })} />
              {t('WOF.Item.CriticalInjury.FIELDS.halved.label')}
            </label>
            <label class="check">
              <input type="checkbox" checked={scarred.has(w.id)} disabled={ro} onchange={(e) => toggleScarred(w.id, e.currentTarget.checked)} />
              {t('WOF.Sheet.injury.scarred')}
            </label>
          </div>
          <div class="foot">
            <span class="lbl">{t('WOF.Sheet.injury.days', { left: w.healingLeft })}</span>
            <span class="days" role="group" aria-label={t('WOF.Sheet.injury.days', { left: w.healingLeft })}>
              {#each Array.from({ length: w.healingTotal }) as _, i (i)}
                {@const done = i < w.healingTotal - w.healingLeft}
                <button type="button" class="day" class:done disabled={ro} aria-label={t(done ? 'WOF.Sheet.injury.dayDone' : 'WOF.Sheet.injury.day', { n: i + 1 })} onclick={() => setDays(w, i)}>{i + 1}</button>
              {/each}
            </span>
          </div>
        </article>
      {:else}
        <p class="empty">{t('WOF.Sheet.wounds.noInjuries')}</p>
      {/each}
      <p class="dropzone">{t('WOF.Sheet.drop.injuries')}</p>
    </div>

    <div class="block">
      <Sec n="2" title={t('WOF.Actor.Base.FIELDS.lasting_stress_responses.label')} hint={t('WOF.Sheet.stress.lasting')} />
      {#each view.responses as r (r.index)}
        <div class="inj resp" data-item-id={r.index}>
          <div class="inj-h">
            <img src={icon('roll-stress')} alt="" />
            <h4>{r.name}</h4>
          </div>
          <p class="txt">{r.text}</p>
          {#if r.effects.length}<div class="fx">{#each r.effects as line, i (i)}<span>{line}</span>{/each}</div>{/if}
          <div class="opts">
            <select value={r.ends} aria-label={t('WOF.Actor.Base.FIELDS.lasting_stress_responses.element.ends.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'lasting_stress_responses', r.index, { ends: e.currentTarget.value })}>
              {#each ENDS as en (en)}<option value={en}>{t(`WOF.Sheet.ends.${en}`)}</option>{/each}
            </select>
            {#if r.ends === 'rule'}
              <input type="text" value={r.endsNote} placeholder={t('WOF.Actor.Base.FIELDS.lasting_stress_responses.element.ends_note.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'lasting_stress_responses', r.index, { ends_note: e.currentTarget.value })} />
            {/if}
          </div>
          <div class="foot">
            <span class="note">{t(`WOF.Sheet.ends.${r.ends}`)}</span>
            <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} use:tooltip={t('WOF.Sheet.wounds.clearResponse')} onclick={() => removeListEntry(actor, 'lasting_stress_responses', r.index)}>✕</button>
          </div>
        </div>
      {:else}
        <p class="empty">{t('WOF.Sheet.wounds.noResponses')}</p>
      {/each}
      {#if view.editable}
        <div class="adder">
          <select bind:value={newResponse} aria-label={t('WOF.Sheet.wounds.addResponse')}>
            <option value="">{t('WOF.Sheet.wounds.addResponse')}</option>
            {#each lastingRows.filter((r) => !heldResponseRows.has(r.id)) as r (r.id)}<option value={r.id}>{r.name}</option>{/each}
          </select>
          <button type="button" class="mini" disabled={!newResponse} onclick={() => { addListEntry(actor, 'lasting_stress_responses', { row: newResponse, ends: 'titan-engagement-end', ends_note: '' }); newResponse = ''; }}>{t('WOF.Sheet.add')}</button>
        </div>
      {/if}
    </div>
  </div>

  <div class="stack">
    <div class="block">
      <Sec n="3" title={t('WOF.Sheet.wounds.scarsGrief')} hint={t('WOF.Sheet.wounds.scarsHint', { n: s.scars.length, max: W.maxScars })} />
      {#each view.scars as sc (sc.index)}
        <div class="scar">
          <img src={icon('harm-scar')} alt="" />
          <div>
            <strong>{sc.name}</strong>
            <p>{sc.text}</p>
            {#each sc.effects as line, i (i)}<p class="red-text">{line}</p>{/each}
          </div>
          <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} onclick={() => removeListEntry(actor, 'scars', sc.index)}>✕</button>
        </div>
      {:else}
        <p class="empty">{t('WOF.Sheet.wounds.noScars')}</p>
      {/each}
      {#if view.editable && s.scars.length < W.maxScars}
        <div class="adder">
          <select bind:value={newScar} aria-label={t('WOF.Sheet.wounds.addScar')}>
            <option value="">{t('WOF.Sheet.wounds.addScar')}</option>
            {#each scarRows.filter((r) => !heldScarRows.has(r.id)) as r (r.id)}<option value={r.id}>{r.name}</option>{/each}
          </select>
          <button type="button" class="mini" disabled={!newScar} onclick={() => { addListEntry(actor, 'scars', { row: newScar }); newScar = ''; }}>{t('WOF.Sheet.add')}</button>
        </div>
      {/if}
      <div class="vrow griefline">
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.grief.label')}</span>
        <div class="grief" role="group" aria-label={t('WOF.Actor.Base.FIELDS.grief.label')}>
          {#each Array.from({ length: W.maxGrief }) as _, i (i)}
            <button type="button" class:on={i < s.grief} disabled={ro} aria-label={t('WOF.Sheet.wounds.griefN', { n: i + 1 })} aria-pressed={i < s.grief} onclick={() => setGrief(i + 1)}></button>
          {/each}
        </div>
        <span class="note">{t('WOF.Sheet.wounds.griefNote', { n: s.grief, max: W.maxGrief })}</span>
      </div>
    </div>

    <div class="block">
      <Sec n="4" title={t('WOF.Sheet.wounds.readout')} hint={t('WOF.Sheet.wounds.readoutHint')} />
      <dl class="readout">
        <dt>{t('WOF.Derived.health')}</dt>
        <dd>
          {@html t('WOF.Sheet.wounds.healthFormula', { str: s.attributes.strength, agi: s.attributes.agility, health: d.health })}
          <span class="note">{t('WOF.Sheet.wounds.current', { current: d.current_health, health: d.health, crossed: d.boxes_crossed_off })}</span>
          {#if s.down !== d.down_by_rule}
            <span class="red-text">
              {t(d.down_by_rule ? 'WOF.Sheet.down.ruleSaysDown' : 'WOF.Sheet.down.ruleSaysUp')}
              <button type="button" class="mini" disabled={ro} onclick={() => setField(actor, 'system.down', d.down_by_rule)}>{t('WOF.Sheet.down.match')}</button>
            </span>
          {/if}
        </dd>
        <dt>{t('WOF.Derived.resolve')}</dt>
        <dd>
          {@html t('WOF.Sheet.wounds.resolveFormula', { ins: s.attributes.instinct, emp: s.attributes.empathy, base, scars: s.scars.length, grief: Math.min(s.grief, 3), resolve: d.resolve })}
          {#if d.resolve_unclamped < 0}<span class="red-text">{t('WOF.Sheet.resolve.floorTip', { n: d.resolve_unclamped })}</span>{/if}
        </dd>
        <dt>{t('WOF.Derived.stress')}</dt>
        <dd>{t('WOF.Sheet.wounds.stressNote', { min: d.minimum_stress, scars: s.scars.length })}</dd>
      </dl>
    </div>

    <div class="block">
      <Sec n="5" title={t('WOF.Sheet.wounds.field')} hint={t('WOF.Sheet.wounds.fieldHint')} />
      <div class="record">
        <div class="grid-form">
          <span class="lbl">{t('WOF.Actor.Base.FIELDS.next_roll_penalty.label')}</span>
          <span class="vrow"><Stepper value={s.next_roll_penalty} label={t('WOF.Actor.Base.FIELDS.next_roll_penalty.label')} disabled={ro} onset={(n) => setField(actor, 'system.next_roll_penalty', n)} /><span class="note">{t('WOF.Actor.Base.FIELDS.next_roll_penalty.hint')}</span></span>
        </div>

        <p class="lbl">{t('WOF.Actor.Base.FIELDS.pending_fear_results.label')}</p>
        <div class="rowlist">
          {#each s.pending_fear_results as f, i (i)}
            <div class="row">
              <select value={f.effect} aria-label={t('WOF.Actor.Base.FIELDS.pending_fear_results.element.effect.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'pending_fear_results', i, { effect: e.currentTarget.value })}>
                {#each FEAR as fe (fe)}<option value={fe}>{t(`WOF.Sheet.fear.${fe}`)}</option>{/each}
              </select>
              <input type="text" value={f.toward} placeholder={t('WOF.Actor.Base.FIELDS.pending_fear_results.element.toward.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'pending_fear_results', i, { toward: e.currentTarget.value })} />
              <input type="text" style="width:48px" value={f.titan} placeholder="A" aria-label={t('WOF.Actor.Base.FIELDS.pending_fear_results.element.titan.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'pending_fear_results', i, { titan: e.currentTarget.value })} />
              <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} onclick={() => removeListEntry(actor, 'pending_fear_results', i)}>✕</button>
            </div>
          {:else}<p class="empty">{t('WOF.Sheet.wounds.noFear')}</p>{/each}
          <span><button type="button" class="mini" disabled={ro} onclick={() => addListEntry(actor, 'pending_fear_results', { effect: 'forced-move', toward: '', titan: '' })}>{t('WOF.Sheet.add')}</button></span>
        </div>

        <p class="lbl">{t('WOF.Actor.Base.FIELDS.healed_permanent_injuries.label')}</p>
        <div class="rowlist">
          {#each s.healed_permanent_injuries as h, i (i)}
            <div class="row">
              <select value={h.row} aria-label={t('WOF.Actor.Base.FIELDS.healed_permanent_injuries.element.row.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'healed_permanent_injuries', i, { row: e.currentTarget.value })}>
                <option value="">{t('WOF.Sheet.wounds.pickRow')}</option>
                {#each permanentRows as r (r.id)}<option value={r.id}>{r.label}</option>{/each}
                {#if h.row && !permanentRows.some((r) => r.id === h.row)}<option value={h.row}>{t('WOF.Sheet.wounds.otherRow')}</option>{/if}
              </select>
              <select value={h.side ?? ''} aria-label={t('WOF.Actor.Base.FIELDS.healed_permanent_injuries.element.side.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'healed_permanent_injuries', i, { side: e.currentTarget.value || null })}>
                <option value="">—</option>
                <option value="left">{t('WOF.Side.left')}</option>
                <option value="right">{t('WOF.Side.right')}</option>
              </select>
              <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} onclick={() => removeListEntry(actor, 'healed_permanent_injuries', i)}>✕</button>
            </div>
          {:else}<p class="empty">{t('WOF.Sheet.none')}</p>{/each}
          <span><button type="button" class="mini" disabled={ro} onclick={() => addListEntry(actor, 'healed_permanent_injuries', { row: '', side: null })}>{t('WOF.Sheet.add')}</button></span>
        </div>

        <p class="lbl">{t('WOF.Actor.Base.FIELDS.pinned.label')}</p>
        <div class="grid-form">
          <span class="lbl">{t('WOF.Actor.Base.FIELDS.pinned.active.label')}</span>
          <input type="checkbox" checked={s.pinned.active} disabled={ro} onchange={(e) => setField(actor, 'system.pinned.active', e.currentTarget.checked)} />
          {#if s.pinned.active}
            <span class="lbl">{t('WOF.Actor.Base.FIELDS.pinned.body.label')}</span>
            <input type="text" value={s.pinned.body} disabled={ro} onchange={(e) => setField(actor, 'system.pinned.body', e.currentTarget.value)} />
            <span class="lbl">{t('WOF.Actor.Base.FIELDS.pinned.corpse.label')}</span>
            <input type="checkbox" checked={s.pinned.corpse} disabled={ro} onchange={(e) => setField(actor, 'system.pinned.corpse', e.currentTarget.checked)} />
            <span class="lbl">{t('WOF.Actor.Base.FIELDS.pinned.limb.label')}</span>
            <select value={s.pinned.limb ?? ''} disabled={ro} onchange={(e) => setField(actor, 'system.pinned.limb', e.currentTarget.value || null)}>
              <option value="">—</option>
              <option value="arm">{t('WOF.InjuryLocation.arm')}</option>
              <option value="leg">{t('WOF.InjuryLocation.leg')}</option>
              <option value="body">{t('WOF.Sheet.wounds.body')}</option>
            </select>
            <span class="lbl">{t('WOF.Actor.Base.FIELDS.pinned.side.label')}</span>
            <select value={s.pinned.side ?? ''} disabled={ro} onchange={(e) => setField(actor, 'system.pinned.side', e.currentTarget.value || null)}>
              <option value="">—</option>
              <option value="left">{t('WOF.Side.left')}</option>
              <option value="right">{t('WOF.Side.right')}</option>
            </select>
            <span class="lbl">{t('WOF.Actor.Base.FIELDS.pinned.by_part.label')}</span>
            <input type="text" value={s.pinned.by_part} disabled={ro} onchange={(e) => setField(actor, 'system.pinned.by_part', e.currentTarget.value)} />
          {/if}
        </div>

        <p class="lbl">{t('WOF.Actor.Base.FIELDS.rallied_outside_titan_engagement_by.label')}</p>
        <div class="rowlist">
          {#each rallied as r, i (i)}
            <div class="row"><span>{r.name}</span><button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} onclick={() => removeListEntry(actor, 'rallied_outside_titan_engagement_by', i)}>✕</button></div>
          {:else}<p class="empty">{t('WOF.Sheet.none')}</p>{/each}
          {#if view.editable}
            <div class="adder">
              <select bind:value={newRally} aria-label={t('WOF.Sheet.wounds.addRally')}>
                <option value="">{t('WOF.Sheet.wounds.addRally')}</option>
                {#each view.comrades.filter((c) => !s.rallied_outside_titan_engagement_by.includes(c.id)) as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
              </select>
              <button type="button" class="mini" disabled={!newRally} onclick={() => { addListEntry(actor, 'rallied_outside_titan_engagement_by', newRally); newRally = ''; }}>{t('WOF.Sheet.add')}</button>
            </div>
          {/if}
        </div>

        <div class="flags">
          {#each ['faced_a_titan', 'killed_a_person', 'retiring'] as flag (flag)}
            <label class="check">
              <input type="checkbox" checked={s[flag]} disabled={ro} onchange={(e) => setField(actor, `system.${flag}`, e.currentTarget.checked)} />
              {t(`WOF.Actor.Base.FIELDS.${flag}.label`)}
            </label>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
