<script lang="ts">
  import { tick } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { jolt, pulse } from '../../motion/fx.ts';
  import { contextMenu, dragItem, tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { deleteItem, fitCanister, openItem, setField, setItem, setSpares } from '../soldier-ops.ts';
  import { icon, type GearView, type SoldierView } from '../soldier-view.ts';
  import Sec from './Sec.svelte';
  import { tracker } from '../../tracker/state.svelte.ts';
  import Stepper from './Stepper.svelte';

  let { view }: { view: SoldierView } = $props();
  const { actor } = sheetContext();
  const s = $derived(view.system);
  const d = $derived(view.derived);
  const ro = $derived(!view.editable);
  /** A piece of gear's Gear Dice rating is what it is, not how worn it is: an Edit-mode field. */
  const roStats = $derived(!view.statsEditable);
  const POSITIONS = ['distant', 'in-reach', 'on-body', 'blind-spot'];
  /** This soldier's row in the running Titan Engagement's ledger, if they take part in one. */
  const place = $derived(tracker.view?.mode === 'titan' ? (tracker.view.rows.find((r) => r.id === actor.id) ?? null) : null);

  let ledgerEl: HTMLElement | undefined = $state();
  /** Ledger rows whose extra fields (a dismounted horse's Position, a prosthetic's side) are open. */
  const openRows = new SvelteSet<string>();
  const toggleRow = (id: string) => (openRows.has(id) ? openRows.delete(id) : openRows.add(id));
  const hasSubrow = (g: GearView) => g.subtype === 'prosthetic' || (g.subtype === 'horse' && !g.mounted);

  async function setCurrent(g: GearView, n: number) {
    const next = g.current === n ? n - 1 : n;
    const v = Math.max(0, Math.min(g.rating, next));
    await setItem(actor, g.id, { 'system.current': v });
    await tick();
    const row = ledgerEl?.querySelector(`[data-item-id="${g.id}"]`);
    if (v < g.current) jolt(row);
    else pulse(row);
  }

  function setRating(g: GearView, n: number) {
    return setItem(actor, g.id, { 'system.rating': n, 'system.current': Math.min(g.current, n) });
  }

  const gearMenu = (g: GearView) => () => [
    { label: t('WOF.Sheet.menu.open'), icon: 'fa-solid fa-book-open', onClick: () => openItem(actor, g.id) },
    { label: t(g.kept ? 'WOF.Sheet.kit.unkeep' : 'WOF.Sheet.kit.keep'), icon: 'fa-solid fa-thumbtack', visible: view.editable, onClick: () => setItem(actor, g.id, { 'system.kept': !g.kept }) },
    { label: t('WOF.Sheet.menu.remove'), icon: 'fa-solid fa-trash', visible: view.editable, onClick: () => deleteItem(actor, g.id) },
  ];

  const handlesFull = $derived(view.gear.some((g) => g.subtype === 'blade-set' && g.inHandles));
  const loadCells = $derived(Math.max(d.carrying_limit, d.items_carried));

  function toggleMounted(g: GearView) {
    const next = !g.mounted;
    setItem(actor, g.id, { 'system.mounted': next, ...(next ? { 'system.position.position': null, 'system.position.titan': '', 'system.position.left': false } : {}) });
  }
  const toggleHandles = (g: GearView) => setItem(actor, g.id, { 'system.in_handles': !g.inHandles });
  const toggleLoaded = (g: GearView) => setItem(actor, g.id, { 'system.loaded': !g.loaded });

  const setGas = (n: number) => setField(actor, 'system.gas_rating', s.gas_rating === n ? n - 1 : n);
  // Momentum: held from 0 upward, capped in play by the Anchors left (data/gear/sheet-fields.yaml, momentum).
  const setMomentum = (n: number) => setField(actor, 'system.momentum', Math.max(0, n));
  const setSpare = (i: number, n: number) => {
    const list = [...s.spare_canisters];
    list[i] = Math.max(1, list[i] === n && n > 1 ? n - 1 : n);
    return setSpares(actor, list);
  };
  const leftItems = $derived((s.left_at.items as string[]).join(', '));
</script>

<div class="kit">
<div class="block" bind:this={ledgerEl}>
  <Sec n="1" title={t('WOF.Sheet.kit.issued')} hint={t('WOF.Sheet.kit.issuedHint')} />
  <table class="ledger">
    <thead>
      <tr>
        <th></th>
        <th>{t('WOF.Sheet.kit.article')}</th>
        <th>{t('WOF.Sheet.kit.status')}</th>
        <th style="text-align:right">{t('WOF.Sheet.kit.gearDice')}</th>
        <th style="text-align:center">{t('WOF.Sheet.kit.kept')}</th>
      </tr>
    </thead>
    <tbody>
      {#each view.gear as g (g.id)}
        <tr data-item-id={g.id} class:open={openRows.has(g.id)} use:dragItem={{ item: actor.items.get(g.id) }} use:contextMenu={gearMenu(g)}>
          <td class="ico"><img src={g.icon} alt="" /></td>
          <td class="art">
            {#if hasSubrow(g)}
              <button
                type="button"
                class="chev"
                aria-expanded={openRows.has(g.id)}
                aria-label={t(openRows.has(g.id) ? 'WOF.Sheet.kit.less' : 'WOF.Sheet.kit.more')}
                onclick={() => toggleRow(g.id)}
              ></button>
            {/if}
            <button type="button" class="name" onclick={() => openItem(actor, g.id)}>{g.name}</button>
          </td>
          <td class="st">
            {#if g.subtype === 'horse'}
              <button type="button" class="stamp" class:info={!g.status.bad} disabled={ro || s.airborne} onclick={() => toggleMounted(g)}>{g.status.label}</button>
            {:else if g.subtype === 'blade-set'}
              <button type="button" class="stamp" class:info={!g.status.bad} disabled={ro || (!g.inHandles && handlesFull)} onclick={() => toggleHandles(g)}>{g.status.label}</button>
            {:else if g.subtype === 'firearm'}
              <button type="button" class="stamp" class:info={!g.status.bad} disabled={ro} onclick={() => toggleLoaded(g)}>{g.status.label}</button>
            {:else}
              <span class="stamp fixed" class:info={!g.status.bad}>{g.status.label}</span>
            {/if}
          </td>
          <td class="q">
            {#if g.rated}
              <span class="dots" role="group" aria-label={t('WOF.Sheet.kit.diceOf', { name: g.name, current: g.current, rating: g.rating })}>
                <span class="grp">
                  {#each Array.from({ length: g.rating }) as _, i (i)}
                    <button type="button" class="pip" disabled={ro} aria-label={t('WOF.Sheet.aria.setTo', { label: g.name, value: i + 1 })} onclick={() => setCurrent(g, i + 1)}>
                      <i class="dg{i < g.current ? '' : ' o'}"></i>
                    </button>
                  {/each}
                </span>
              </span>
              {#if !roStats}<Stepper value={g.rating} min={1} max={3} label={t('WOF.Item.Gear.FIELDS.rating.label')} onset={(n) => setRating(g, n)} />{/if}
            {:else}<span class="note">{t('WOF.Sheet.kit.unrated')}</span>{/if}
          </td>
          <td class="kp">
            <button
              type="button"
              class="kept"
              aria-pressed={g.kept}
              aria-label={t(g.kept ? 'WOF.Sheet.kit.unkeep' : 'WOF.Sheet.kit.keep')}
              use:tooltip={t(g.kept ? 'WOF.Sheet.kit.unkeep' : 'WOF.Sheet.kit.keep')}
              disabled={ro}
              onclick={() => setItem(actor, g.id, { 'system.kept': !g.kept })}
            >
              <svg viewBox="0 0 12 18" aria-hidden="true"><path d="M3 15V4a2.5 2.5 0 0 1 5 0v10a3.5 3.5 0 0 1-7 0V6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg>
            </button>
            {#if view.statsEditable}
              <button type="button" class="mini icon rm" aria-label={t('WOF.Sheet.menu.remove')} use:tooltip={t('WOF.Sheet.menu.remove')} onclick={() => deleteItem(actor, g.id)}>✕</button>
            {/if}
          </td>
        </tr>
        {#if hasSubrow(g) && openRows.has(g.id)}
          <tr class="subrow">
            <td></td>
            <td colspan="4">
              <div class="subfields">
                {#if g.subtype === 'horse'}
                  <label class="lbl">
                    {t('WOF.Item.Gear.FIELDS.position.label')}
                    <select value={g.position.position ?? ''} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.position.position': e.currentTarget.value || null })}>
                      <option value="">—</option>
                      {#each POSITIONS as p (p)}<option value={p} title={t(`WOF.PositionTip.${p}`)}>{t(`WOF.Position.${p}`)}</option>{/each}
                    </select>
                  </label>
                  <label class="lbl">
                    {t('WOF.Item.Gear.FIELDS.position.titan.label')}
                    <input type="text" value={g.position.titan} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.position.titan': e.currentTarget.value })} />
                  </label>
                  <label class="check">
                    <input type="checkbox" checked={g.position.left} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.position.left': e.currentTarget.checked })} />
                    {t('WOF.Item.Gear.FIELDS.position.left.label')}
                  </label>
                {:else if g.subtype === 'prosthetic'}
                  <label class="lbl">
                    {t('WOF.Item.Gear.FIELDS.side.label')}
                    <select value={g.side ?? ''} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.side': e.currentTarget.value || null })}>
                      <option value="">—</option>
                      <option value="left">{t('WOF.Side.left')}</option>
                      <option value="right">{t('WOF.Side.right')}</option>
                    </select>
                  </label>
                {/if}
              </div>
            </td>
          </tr>
        {/if}
      {:else}
        <tr><td colspan="5" class="empty">{t('WOF.Sheet.kit.noGear')}</td></tr>
      {/each}
      <tr class="gasrow">
        <td class="ico"><img src={icon('gear-gas-canister')} alt="" /></td>
        <td class="art"><span class="name">{t('WOF.Sheet.gas.title')}</span><small class="sub">{t('WOF.Sheet.kit.gasHint', { full: view.fullGas })}</small></td>
        <td class="q" colspan="2">
          <span class="cans">
            <span class="canchip fit">
              <span class="lv" role="group" aria-label={t('WOF.Actor.Base.FIELDS.gas_rating.label')}>
                {#each Array.from({ length: view.fullGas }) as _, i (i)}
                  <button type="button" class:on={i < s.gas_rating} disabled={ro} aria-label={t('WOF.Sheet.aria.setTo', { label: t('WOF.Actor.Base.FIELDS.gas_rating.label'), value: i + 1 })} onclick={() => setGas(i + 1)}></button>
                {/each}
              </span>
              {t('WOF.Sheet.kit.fitted')} {s.gas_rating}/{view.fullGas}
            </span>
            {#each s.spare_canisters as gas, i (i)}
              <span class="canchip">
                <span class="lv" role="group" aria-label={t('WOF.Sheet.kit.spareN', { n: i + 1 })}>
                  {#each Array.from({ length: view.fullGas }) as _, j (j)}
                    <button type="button" class:on={j < gas} disabled={ro} aria-label={t('WOF.Sheet.aria.setTo', { label: t('WOF.Sheet.kit.spareN', { n: i + 1 }), value: j + 1 })} onclick={() => setSpare(i, j + 1)}></button>
                  {/each}
                </span>
                {t('WOF.Sheet.kit.spareN', { n: i + 1 })}
                <button type="button" class="mini" disabled={ro} use:tooltip={t('WOF.Sheet.gas.changeTip')} onclick={() => fitCanister(actor, i)}>{t('WOF.Sheet.kit.fit')}</button>
                <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} onclick={() => setSpares(actor, s.spare_canisters.filter((_: number, k: number) => k !== i))}>✕</button>
              </span>
            {:else}<span class="empty">{t('WOF.Sheet.gas.noSpare')}</span>{/each}
            <button type="button" class="mini" disabled={ro} onclick={() => setSpares(actor, [...s.spare_canisters, view.fullGas])}>{t('WOF.Sheet.kit.addSpare')}</button>
          </span>
        </td>
        <td class="kp"></td>
      </tr>
    </tbody>
  </table>
  <p class="dropzone">{t('WOF.Sheet.drop.gear')}</p>

  <div class="load">
    <span class="lbl">{t('WOF.Sheet.kit.load')}</span>
    <span class="bar" role="img" aria-label={t('WOF.Sheet.kit.loadAria', { items: d.items_carried, limit: d.carrying_limit })}>
      {#each Array.from({ length: loadCells }) as _, i (i)}<i class:on={i < d.items_carried} class:over={i < d.items_carried && i >= d.carrying_limit}></i>{/each}
    </span>
    <b>{d.items_carried}<small class="note"> / {d.carrying_limit}</small></b>
    <span class="note">{t('WOF.Sheet.kit.loadHint')}</span>
    {#if d.overloaded}<span class="tag warn">{t('WOF.Derived.overloaded')}</span>{/if}
  </div>

  <div class="grid-form" style="margin-top:8px">
    <span class="lbl">{t('WOF.Actor.Base.FIELDS.carrying.label')}</span>
    <select value={s.carrying} disabled={ro} onchange={(e) => setField(actor, 'system.carrying', e.currentTarget.value)}>
      <option value="">{t('WOF.Sheet.none')}</option>
      {#each view.comrades as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
    </select>
    <span class="lbl">{t('WOF.Actor.Base.FIELDS.carried_by.label')}</span>
    <select value={s.carried_by} disabled={ro} onchange={(e) => setField(actor, 'system.carried_by', e.currentTarget.value)}>
      <option value="">{t('WOF.Sheet.none')}</option>
      {#each view.comrades as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
    </select>
    <span class="lbl">{t('WOF.Actor.Base.FIELDS.dropped_blade_sets.label')}</span>
    <Stepper value={s.dropped_blade_sets} label={t('WOF.Actor.Base.FIELDS.dropped_blade_sets.label')} disabled={ro} onset={(n) => setField(actor, 'system.dropped_blade_sets', n)} />
    <span class="lbl">{t('WOF.Actor.Base.FIELDS.momentum.label')}</span>
    <span class="mrow">
      <button type="button" class="mini" disabled={ro || s.momentum <= 0} aria-label={t('WOF.Sheet.momentum.spend')} onclick={() => setMomentum(s.momentum - 1)}>−</button>
      <b>{s.momentum}</b>
      <button type="button" class="mini" disabled={ro} aria-label={t('WOF.Sheet.momentum.gain')} onclick={() => setMomentum(s.momentum + 1)}>+</button>
      <span class="note">{t('WOF.Sheet.momentum.hint')}</span>
    </span>
  </div>
</div>

<div class="two even">
  <div class="block">
    <Sec n="2" title={t('WOF.Sheet.kit.engagement')} hint={t('WOF.Sheet.kit.engagementHint')} />
    <div class="flags">
      <label class="check">
        <input type="checkbox" checked={s.airborne} disabled={ro || view.gear.some((g) => g.subtype === 'horse' && g.mounted)} onchange={(e) => setField(actor, 'system.airborne', e.currentTarget.checked)} />
        {t('WOF.Actor.Base.FIELDS.airborne.label')}
      </label>
      <label class="check">
        <input type="checkbox" checked={s.positions.left} disabled={ro} onchange={(e) => setField(actor, 'system.positions.left', e.currentTarget.checked)} />
        {t('WOF.Actor.Base.FIELDS.positions.left.label')}
      </label>
    </div>
    <!-- Zone and attachment are recorded on the running Titan Engagement, and the Positions are
         derived from them and never written (decision batch 16, 16-35). -->
    {#if place}
      <div class="grid-form" style="margin-top:8px">
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.zone.label')}</span><span>{place.zoneText}</span>
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.attachment.label')}</span><span>{place.attachText || '–'}</span>
        <span class="lbl">{t('WOF.Sheet.kit.positionsShown')}</span><span>{place.cells.filter((c) => c.position).map((c) => `${c.label} ${c.text}`).join(', ') || '–'}</span>
        {#if place.horseText}<span class="lbl">{t('WOF.Sheet.kit.horseZone')}</span><span>{place.horseText}</span>{/if}
      </div>
    {:else}<p class="empty">{t('WOF.Sheet.kit.noPositions')}</p>{/if}
  </div>

  <div class="block">
    <Sec n="3" title={t('WOF.Actor.Base.FIELDS.left_at.label')} hint={t('WOF.Sheet.kit.leftAtHint')} />
    <div class="field">
      <span class="lbl">{t('WOF.Actor.Base.FIELDS.left_at.zone.label')}</span>
      <input type="number" min="1" value={s.left_at.zone ?? ''} disabled={ro} onchange={(e) => setField(actor, 'system.left_at.zone', e.currentTarget.value === '' ? null : Number(e.currentTarget.value))} />
    </div>
    <div class="field">
      <span class="lbl">{t('WOF.Actor.Base.FIELDS.left_at.items.label')}</span>
      <input
        type="text"
        value={leftItems}
        placeholder={t('WOF.Sheet.kit.commaList')}
        disabled={ro}
        onchange={(e) => setField(actor, 'system.left_at.items', e.currentTarget.value.split(',').map((x) => x.trim()).filter(Boolean))}
      />
    </div>
  </div>
</div>
</div>
