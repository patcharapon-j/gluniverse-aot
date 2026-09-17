<script lang="ts">
  import { tick } from 'svelte';
  import { fx, jolt, pulse } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { setGore, viewer } from '../../settings.svelte.ts';
  import type { GoreLevel } from '../../motion/tokens.ts';
  import { contextMenu, dragItem, tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { addListEntry, clickHealthBox, clickStressBox, deleteItem, openItem, removeListEntry, setField, setItem, setListEntry } from '../soldier-ops.ts';
  import { icon, type InjuryView, type SoldierView } from '../soldier-view.ts';
  import Figure from './Figure.svelte';
  import Sec from './Sec.svelte';
  import Stepper from './Stepper.svelte';

  let { view }: { view: SoldierView } = $props();
  const { actor } = sheetContext();
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

  let listEl: HTMLElement | undefined = $state();
  let figEl: HTMLElement | undefined = $state();
  let newScar = $state('');
  let newResponse = $state('');
  let newRally = $state('');

  const untreated = $derived(view.injuries.filter((w) => !w.treated).length);
  const stressCells = $derived(Math.max(10, d.stress_effective + 1));
  const heldScarRows = $derived(new Set(s.scars.map((x: { row: string }) => x.row)));
  const heldResponseRows = $derived(new Set(s.lasting_stress_responses.map((x: { row: string }) => x.row)));
  const base = $derived(Math.ceil((s.attributes.instinct + s.attributes.empathy) / 2));

  async function afterUpdate(p: unknown, fn: () => void) {
    await p;
    await tick();
    fn();
  }

  function focusInjury(id: string) {
    const card = listEl?.querySelector<HTMLElement>(`[data-item-id="${id}"]`);
    card?.scrollIntoView({ block: 'nearest', behavior: viewer.motion === 'full' && !viewer.reducedByOS ? 'smooth' : 'auto' });
    jolt(card, MOTION.colors.notice);
  }

  function toggleTreated(w: InjuryView) {
    afterUpdate(setItem(actor, w.id, { 'system.treated': !w.treated }), () => {
      const card = listEl?.querySelector(`[data-item-id="${w.id}"]`);
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
      const el = listEl?.closest('.wof-sheet')?.querySelector('.vitals .vit:nth-child(3)');
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

  <div bind:this={listEl}>
    <div class="block">
      <Sec n="1" title={t('WOF.Derived.health')} hint={t('WOF.Sheet.wounds.healthHint')} />
      <div class="vrow">
        <div class="boxes" role="group" aria-label={t('WOF.Sheet.health.boxes')}>
          {#each d.health_boxes as b, i (i)}
            <button
              type="button"
              class="hbox {b === 'clean' ? 'held' : b}"
              disabled={ro || b === 'crossed'}
              aria-label={t(`WOF.Sheet.health.box.${b}`, { n: i + 1 })}
              use:tooltip={b === 'crossed' ? t('WOF.Sheet.health.crossedTip') : null}
              onclick={() => clickHealthBox(actor, i)}
            ></button>
          {/each}
        </div>
        <span class="formula">{@html t('WOF.Sheet.wounds.healthFormula', { str: s.attributes.strength, agi: s.attributes.agility, health: d.health })}</span>
      </div>
      <div class="grid-form" style="margin-top:8px">
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.health_lost.label')}</span>
        <span class="vrow">
          <Stepper value={s.health_lost} max={d.health - d.boxes_crossed_off} label={t('WOF.Actor.Base.FIELDS.health_lost.label')} disabled={ro} onset={(n) => setField(actor, 'system.health_lost', n)} />
          <span class="note">{t('WOF.Sheet.wounds.current', { current: d.current_health, health: d.health, crossed: d.boxes_crossed_off })}</span>
        </span>
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.down.label')}</span>
        <label class="check">
          <input type="checkbox" checked={s.down} disabled={ro} onchange={(e) => setField(actor, 'system.down', e.currentTarget.checked)} />
          {t(d.down_by_rule ? 'WOF.Sheet.down.byRuleYes' : 'WOF.Sheet.down.byRuleNo')}
        </label>
      </div>
      {#if s.down !== d.down_by_rule}
        <div class="warnline">
          <span>{t(d.down_by_rule ? 'WOF.Sheet.down.ruleSaysDown' : 'WOF.Sheet.down.ruleSaysUp')}</span>
          <button type="button" class="mini" disabled={ro} onclick={() => setField(actor, 'system.down', d.down_by_rule)}>{t('WOF.Sheet.down.match')}</button>
        </div>
      {/if}
    </div>

    <div class="block">
      <Sec n="2" title={t('WOF.Sheet.wounds.injuries')} hint={t('WOF.Sheet.wounds.injuriesHint', { held: view.injuries.length, untreated })} />
      {#each view.injuries as w (w.id)}
        <article class="injury" class:treated={w.treated} data-item-id={w.id} use:dragItem={{ item: actor.items.get(w.id) }} use:contextMenu={injuryMenu(w)}>
          <span class="pin" class:treated={w.treated}>{w.n}</span>
          <img src={w.img} alt="" />
          <div>
            <span class="lbl">{[w.side ? t(`WOF.Side.${w.side}`) : '', w.locationLabel, t(`WOF.InjuryType.${w.type}`), t('WOF.Sheet.injury.roll', { range: w.range })].filter(Boolean).join(', ')}</span>
            <h4><button type="button" class="link" onclick={() => openItem(actor, w.id)}>{w.name}</button></h4>
            <div class="fx">
              {#each w.effects as line, i (i)}<span>{line}</span>{/each}
              {#each w.permanent as line, i (i)}<span class="red-text">{t('WOF.Sheet.injury.permanent')}: {line}</span>{/each}
              {#if w.lethal}<span class="red-text">{t('WOF.Sheet.injury.lethal', { limit: w.timeLimit ? t(`WOF.TimeLimit.${w.timeLimit}`) : '—' })}</span>{/if}
              {#if w.down && !w.treated}<span class="red-text">{t('WOF.Card.Injury.down')}</span>{/if}
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
            <div class="foot2">
              <span class="days" role="group" aria-label={t('WOF.Sheet.injury.days', { left: w.healingLeft })}>
                {#each Array.from({ length: w.healingTotal }) as _, i (i)}
                  {@const done = i < w.healingTotal - w.healingLeft}
                  <button type="button" class="day" class:done disabled={ro} aria-label={t(done ? 'WOF.Sheet.injury.dayDone' : 'WOF.Sheet.injury.day', { n: i + 1 })} onclick={() => setDays(w, i)}>{i + 1}</button>
                {/each}
              </span>
              <button type="button" class="mini" class:red={!w.treated} disabled={ro} onclick={() => toggleTreated(w)}>{t(w.treated ? 'WOF.Sheet.injury.untreat' : 'WOF.Sheet.injury.treat')}</button>
            </div>
            {#if !w.treated}<p class="note red">{t('WOF.Sheet.injury.holdsBox')}</p>{/if}
          </div>
          <span class="stamp st" class:ok={w.treated}>{t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.bleeding')}</span>
        </article>
      {:else}
        <p class="empty">{t('WOF.Sheet.wounds.noInjuries')}</p>
      {/each}
      <p class="dropzone">{t('WOF.Sheet.drop.injuries')}</p>
    </div>
  </div>

  <div>
    <div class="block">
      <Sec n="3" title={t('WOF.Derived.stress')} hint={t('WOF.Sheet.wounds.stressHint')} />
      <div class="track" role="group" aria-label={t('WOF.Sheet.stress.boxes')}>
        {#each Array.from({ length: stressCells }) as _, i (i)}
          <button
            type="button"
            class="sbox"
            class:on={i < d.stress_effective}
            class:min={i < d.minimum_stress}
            disabled={ro}
            aria-label={t('WOF.Sheet.stress.box', { n: i + 1 })}
            aria-pressed={i < d.stress_effective}
            onclick={() => clickStressBox(actor, i)}
          ></button>
        {/each}
      </div>
      <p class="note" style="margin-top:4px">{t('WOF.Sheet.wounds.stressNote', { min: d.minimum_stress, scars: s.scars.length })}</p>
    </div>

    <div class="block">
      <Sec n="4" title={t('WOF.Derived.resolve')} />
      <div class="formula">{@html t('WOF.Sheet.wounds.resolveFormula', { ins: s.attributes.instinct, emp: s.attributes.empathy, base, scars: s.scars.length, grief: Math.min(s.grief, 3), resolve: d.resolve })}</div>
      {#if d.resolve_unclamped < 0}<p class="note">{t('WOF.Sheet.resolve.floorTip', { n: d.resolve_unclamped })}</p>{/if}
    </div>

    <div class="block">
      <Sec n="5" title={t('WOF.Sheet.wounds.scarsGrief')} hint={t('WOF.Sheet.wounds.scarsHint', { n: s.scars.length, max: W.maxScars })} />
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
      <div class="vrow" style="margin-top:12px">
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
      <Sec n="6" title={t('WOF.Actor.Base.FIELDS.lasting_stress_responses.label')} />
      {#each view.responses as r (r.index)}
        <div class="resp">
          <img src={icon('roll-stress')} alt="" />
          <div>
            <strong>{r.name}</strong>
            <p>{r.text}</p>
            {#each r.effects as line, i (i)}<p>{line}</p>{/each}
            <div class="opts">
              <select value={r.ends} aria-label={t('WOF.Actor.Base.FIELDS.lasting_stress_responses.element.ends.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'lasting_stress_responses', r.index, { ends: e.currentTarget.value })}>
                {#each ENDS as en (en)}<option value={en}>{t(`WOF.Sheet.ends.${en}`)}</option>{/each}
              </select>
              {#if r.ends === 'rule'}
                <input type="text" value={r.endsNote} placeholder={t('WOF.Actor.Base.FIELDS.lasting_stress_responses.element.ends_note.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'lasting_stress_responses', r.index, { ends_note: e.currentTarget.value })} />
              {/if}
            </div>
          </div>
          <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} use:tooltip={t('WOF.Sheet.wounds.clearResponse')} onclick={() => removeListEntry(actor, 'lasting_stress_responses', r.index)}>✕</button>
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
</div>

<div class="block" style="margin-top:16px">
  <Sec n="7" title={t('WOF.Sheet.wounds.field')} hint={t('WOF.Sheet.wounds.fieldHint')} />
  <div class="two even">
    <div>
      <div class="grid-form">
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.next_roll_penalty.label')}</span>
        <span class="vrow"><Stepper value={s.next_roll_penalty} label={t('WOF.Actor.Base.FIELDS.next_roll_penalty.label')} disabled={ro} onset={(n) => setField(actor, 'system.next_roll_penalty', n)} /><span class="note">{t('WOF.Actor.Base.FIELDS.next_roll_penalty.hint')}</span></span>
      </div>
      <p class="lbl" style="margin:12px 0 4px">{t('WOF.Actor.Base.FIELDS.pending_fear_results.label')}</p>
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

      <p class="lbl" style="margin:12px 0 4px">{t('WOF.Actor.Base.FIELDS.healed_permanent_injuries.label')}</p>
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
    </div>

    <div>
      <p class="lbl" style="margin:0 0 4px">{t('WOF.Actor.Base.FIELDS.pinned.label')}</p>
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

      <p class="lbl" style="margin:12px 0 4px">{t('WOF.Actor.Base.FIELDS.rallied_outside_titan_engagement_by.label')}</p>
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

      <div class="flags" style="margin-top:12px">
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
