<script lang="ts">
  import { tick } from 'svelte';
  import { jolt, pulse } from '../../motion/fx.ts';
  import { contextMenu, dragItem, tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { addListEntry, deleteItem, fitCanister, openItem, removeListEntry, setField, setItem, setListEntry, setSpares } from '../soldier-ops.ts';
  import { type GearView, type SoldierView } from '../soldier-view.ts';
  import Sec from './Sec.svelte';
  import Stepper from './Stepper.svelte';

  let { view }: { view: SoldierView } = $props();
  const { actor } = sheetContext();
  const s = $derived(view.system);
  const d = $derived(view.derived);
  const ro = $derived(!view.editable);
  const POSITIONS = ['distant', 'in-reach', 'on-body', 'blind-spot'];

  let ledgerEl: HTMLElement | undefined = $state();

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

<div class="block" bind:this={ledgerEl}>
  <Sec n="1" title={t('WOF.Sheet.kit.issued')} hint={t('WOF.Sheet.kit.issuedHint')} />
  <table class="ledger">
    <thead>
      <tr><th></th><th>{t('WOF.Sheet.kit.status')}</th><th>{t('WOF.Sheet.kit.article')}</th><th style="text-align:right">{t('WOF.Sheet.kit.gearDice')}</th><th></th></tr>
    </thead>
    <tbody>
      {#each view.gear as g (g.id)}
        <tr data-item-id={g.id} use:dragItem={{ item: actor.items.get(g.id) }} use:contextMenu={gearMenu(g)}>
          <td class="ico"><img src={g.icon} alt="" /></td>
          <td><span class="stamp" class:bad={g.status.bad}>{g.status.label}</span></td>
          <td class="name">
            <button type="button" onclick={() => openItem(actor, g.id)}>{g.name}</button>
            {#if g.kept}<span class="tag info">{t('WOF.Item.Gear.FIELDS.kept.label')}</span>{/if}
            <div class="opts">
              {#if g.subtype === 'blade-set'}
                <label class="check">
                  <input type="checkbox" checked={g.inHandles} disabled={ro || (!g.inHandles && handlesFull)} onchange={(e) => setItem(actor, g.id, { 'system.in_handles': e.currentTarget.checked })} />
                  {t('WOF.Item.Gear.FIELDS.in_handles.label')}
                </label>
              {:else if g.subtype === 'firearm'}
                <label class="check">
                  <input type="checkbox" checked={g.loaded} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.loaded': e.currentTarget.checked })} />
                  {t('WOF.Item.Gear.FIELDS.loaded.label')}
                </label>
              {:else if g.subtype === 'horse'}
                <label class="check">
                  <input type="checkbox" checked={g.mounted} disabled={ro || s.airborne} onchange={(e) => setItem(actor, g.id, { 'system.mounted': e.currentTarget.checked, ...(e.currentTarget.checked ? { 'system.position.position': null, 'system.position.titan': '', 'system.position.left': false } : {}) })} />
                  {t('WOF.Item.Gear.FIELDS.mounted.label')}
                </label>
                {#if !g.mounted}
                  <label class="lbl">{t('WOF.Item.Gear.FIELDS.position.label')}
                    <select value={g.position.position ?? ''} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.position.position': e.currentTarget.value || null })}>
                      <option value="">—</option>
                      {#each POSITIONS as p (p)}<option value={p}>{t(`WOF.Position.${p}`)}</option>{/each}
                    </select>
                  </label>
                  <label class="lbl">{t('WOF.Item.Gear.FIELDS.position.titan.label')}
                    <input type="text" value={g.position.titan} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.position.titan': e.currentTarget.value })} />
                  </label>
                  <label class="check">
                    <input type="checkbox" checked={g.position.left} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.position.left': e.currentTarget.checked })} />
                    {t('WOF.Item.Gear.FIELDS.position.left.label')}
                  </label>
                {/if}
              {:else if g.subtype === 'prosthetic'}
                <label class="lbl">{t('WOF.Item.Gear.FIELDS.side.label')}
                  <select value={g.side ?? ''} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.side': e.currentTarget.value || null })}>
                    <option value="">—</option>
                    <option value="left">{t('WOF.Side.left')}</option>
                    <option value="right">{t('WOF.Side.right')}</option>
                  </select>
                </label>
              {/if}
              <label class="check">
                <input type="checkbox" checked={g.kept} disabled={ro} onchange={(e) => setItem(actor, g.id, { 'system.kept': e.currentTarget.checked })} />
                {t('WOF.Item.Gear.FIELDS.kept.label')}
              </label>
            </div>
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
              <div class="opts" style="justify-content:flex-end">
                <span class="lbl">{t('WOF.Item.Gear.FIELDS.rating.label')}</span>
                <Stepper value={g.rating} min={1} max={3} label={t('WOF.Item.Gear.FIELDS.rating.label')} disabled={ro} onset={(n) => setRating(g, n)} />
              </div>
            {:else}<span class="note">{t('WOF.Sheet.kit.unrated')}</span>{/if}
          </td>
          <td class="q">
            <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} use:tooltip={t('WOF.Sheet.menu.remove')} onclick={() => deleteItem(actor, g.id)}>✕</button>
          </td>
        </tr>
      {:else}
        <tr><td colspan="5" class="empty">{t('WOF.Sheet.kit.noGear')}</td></tr>
      {/each}
    </tbody>
  </table>
  <p class="dropzone">{t('WOF.Sheet.drop.gear')}</p>
</div>

<div class="two even">
  <div>
    <div class="block">
      <Sec n="2" title={t('WOF.Sheet.gas.title')} hint={t('WOF.Sheet.kit.gasHint', { full: view.fullGas })} />
      <div class="grid-form">
        <span class="lbl">{t('WOF.Sheet.kit.fitted')}</span>
        <span class="canister">
          <span class="gas" role="group" aria-label={t('WOF.Actor.Base.FIELDS.gas_rating.label')}>
            {#each Array.from({ length: view.fullGas }) as _, i (i)}
              <button type="button" class="gasbar" class:on={i < s.gas_rating} disabled={ro} aria-label={t('WOF.Sheet.aria.setTo', { label: t('WOF.Actor.Base.FIELDS.gas_rating.label'), value: i + 1 })} onclick={() => setGas(i + 1)}></button>
            {/each}
          </span>
          <b>{s.gas_rating}/{view.fullGas}</b>
        </span>
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.spare_canisters.label')}</span>
        <span class="canisters">
          {#each s.spare_canisters as gas, i (i)}
            <span class="canister">
              <span class="gas" role="group" aria-label={t('WOF.Sheet.kit.spareN', { n: i + 1 })}>
                {#each Array.from({ length: view.fullGas }) as _, j (j)}
                  <button type="button" class="gasbar" class:on={j < gas} disabled={ro} aria-label={t('WOF.Sheet.aria.setTo', { label: t('WOF.Sheet.kit.spareN', { n: i + 1 }), value: j + 1 })} onclick={() => setSpare(i, j + 1)}></button>
                {/each}
              </span>
              <button type="button" class="mini" disabled={ro} use:tooltip={t('WOF.Sheet.gas.changeTip')} onclick={() => fitCanister(actor, i)}>{t('WOF.Sheet.kit.fit')}</button>
              <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} onclick={() => setSpares(actor, s.spare_canisters.filter((_: number, k: number) => k !== i))}>✕</button>
            </span>
          {:else}<span class="empty">{t('WOF.Sheet.gas.noSpare')}</span>{/each}
          <button type="button" class="mini" disabled={ro} onclick={() => setSpares(actor, [...s.spare_canisters, view.fullGas])}>{t('WOF.Sheet.kit.addSpare')}</button>
        </span>
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.momentum.label')}</span>
        <span class="canister">
          <button type="button" class="mini" disabled={ro || s.momentum <= 0} aria-label={t('WOF.Sheet.momentum.spend')} onclick={() => setMomentum(s.momentum - 1)}>−</button>
          <b>{s.momentum}</b>
          <button type="button" class="mini" disabled={ro} aria-label={t('WOF.Sheet.momentum.gain')} onclick={() => setMomentum(s.momentum + 1)}>+</button>
          <span class="empty">{t('WOF.Sheet.momentum.hint')}</span>
        </span>
      </div>
    </div>

    <div class="block">
      <Sec n="3" title={t('WOF.Sheet.kit.load')} hint={t('WOF.Sheet.kit.loadHint')} />
      <div class="loadmeter">
        <span class="bar" role="img" aria-label={t('WOF.Sheet.kit.loadAria', { items: d.items_carried, limit: d.carrying_limit })}>
          {#each Array.from({ length: loadCells }) as _, i (i)}<i class:on={i < d.items_carried} class:over={i < d.items_carried && i >= d.carrying_limit}></i>{/each}
        </span>
        <b>{d.items_carried}/{d.carrying_limit}</b>
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
      </div>
    </div>
  </div>

  <div>
    <div class="block">
      <Sec n="4" title={t('WOF.Sheet.kit.engagement')} hint={t('WOF.Sheet.kit.engagementHint')} />
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
      <div class="rowlist" style="margin-top:8px">
        {#each s.positions.entries as p, i (i)}
          <div class="row">
            <input type="text" style="width:48px" value={p.titan} placeholder="A" aria-label={t('WOF.Actor.Base.FIELDS.positions.entries.element.titan.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'positions.entries', i, { titan: e.currentTarget.value })} />
            <select value={p.position} aria-label={t('WOF.Actor.Base.FIELDS.positions.entries.element.position.label')} disabled={ro} onchange={(e) => setListEntry(actor, 'positions.entries', i, { position: e.currentTarget.value })}>
              {#each POSITIONS as pos (pos)}<option value={pos}>{t(`WOF.Position.${pos}`)}</option>{/each}
            </select>
            <button type="button" class="mini icon" disabled={ro} aria-label={t('WOF.Sheet.menu.remove')} onclick={() => removeListEntry(actor, 'positions.entries', i)}>✕</button>
          </div>
        {:else}<p class="empty">{t('WOF.Sheet.kit.noPositions')}</p>{/each}
        <span><button type="button" class="mini" disabled={ro} onclick={() => addListEntry(actor, 'positions.entries', { titan: String.fromCharCode(65 + s.positions.entries.length), position: 'distant' })}>{t('WOF.Sheet.kit.addPosition')}</button></span>
      </div>
    </div>

    <div class="block">
      <Sec n="5" title={t('WOF.Actor.Base.FIELDS.left_at.label')} hint={t('WOF.Sheet.kit.leftAtHint')} />
      <div class="grid-form">
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.left_at.position.label')}</span>
        <select value={s.left_at.position ?? ''} disabled={ro} onchange={(e) => setField(actor, 'system.left_at.position', e.currentTarget.value || null)}>
          <option value="">—</option>
          {#each POSITIONS as pos (pos)}<option value={pos}>{t(`WOF.Position.${pos}`)}</option>{/each}
        </select>
        <span class="lbl">{t('WOF.Actor.Base.FIELDS.left_at.titan.label')}</span>
        <input type="text" value={s.left_at.titan} disabled={ro} onchange={(e) => setField(actor, 'system.left_at.titan', e.currentTarget.value)} />
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
