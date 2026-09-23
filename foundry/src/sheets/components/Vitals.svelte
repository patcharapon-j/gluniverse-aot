<script lang="ts">
  /**
   * The Dossier's vitals band (sheet-overhaul plan, 3.1 and 6): five cells, Health (the Down stamp,
   * the boxes, the injury chips), Stress (boxes, stepper, the Scar minimum, the response chips), the
   * Resolve seal (a click shows how Resolve is built), Gas and Blade Sets (the Instrument drawings,
   * section 5). A chip takes the viewer to Wounds & Mind and highlights its card.
   *
   * `compact` is the Squadmate's: its response chips are plain chips, not links. Under a paper of
   * about 640px the band lays out in two rows (dossier.css).
   */
  import { tick, untrack } from 'svelte';
  import { jolt, pulse, thud } from '../../motion/fx.ts';
  import { contextMenu, tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { bladeState, gasStamp } from '../instrument.ts';
  import { clickHealthBox, clickStressBox, fitBladeSet, fitCanister, openItem, ruinBladeInHandles, setField, spendGas, stepStress } from '../soldier-ops.ts';
  import { icon, type SoldierView } from '../soldier-view.ts';
  import BladeInstrument from './BladeInstrument.svelte';
  import Dots from './Dots.svelte';
  import GasInstrument from './GasInstrument.svelte';
  import HealthTrack from './HealthTrack.svelte';
  import StressTrack from './StressTrack.svelte';

  let { view, compact = false }: { view: SoldierView; compact?: boolean } = $props();
  const { actor, state: ss, uid } = sheetContext();
  const s = $derived(view.system);
  const d = $derived(view.derived);
  const ro = $derived(!view.editable);

  let hpEl: HTMLElement | undefined = $state();
  let stEl: HTMLElement | undefined = $state();
  let downEl: HTMLElement | undefined = $state();
  let sealWrap: HTMLElement | undefined = $state();

  const odm = $derived(view.gear.find((g) => g.subtype === 'odm') ?? null);
  const blades = $derived(bladeState(view.gear));
  const discipline = $derived(view.talents.find((x) => x.talentId === 'blade-discipline') ?? null);
  const stamp = $derived(gasStamp({ hasOdm: !!odm, jammed: !!d.jammed, level: s.gas_rating }));
  /** The band draws ten Stress boxes at most and tallies the rest. */
  const BAND_BOXES = 10;
  const stressBoxes = $derived(Math.max(6, d.stress_effective + 1));
  const bestSpare = $derived(s.spare_canisters.length ? s.spare_canisters.indexOf(Math.max(...s.spare_canisters)) : -1);
  const downOff = $derived(s.down !== d.down_by_rule);

  // ── Gas and blades: one busy lock over every equipment button ──────────
  let equipmentBusy = $state(false);
  let gasSwap = $state({ id: 0, index: -1, oldLevel: 0 });
  async function equipmentAction(action: () => Promise<unknown> | null | undefined) {
    if (equipmentBusy || ro) return;
    equipmentBusy = true;
    try {
      await action();
    } finally {
      equipmentBusy = false;
    }
  }
  async function swapTank(index: number) {
    const oldLevel = s.gas_rating;
    await equipmentAction(async () => {
      const result = await fitCanister(actor, index);
      if (result) gasSwap = { id: gasSwap.id + 1, index, oldLevel };
    });
  }

  // ── Resolve: the seal and its formula ───────────────────────────────
  const resolveBase = $derived(Math.ceil((s.attributes.instinct + s.attributes.empathy) / 2));
  const resolveShort = $derived(t('WOF.Sheet.resolve.short', { base: resolveBase, scars: s.scars.length, grief: Math.min(s.grief, 3) }));
  const resolveFloor = $derived(d.resolve_unclamped < 0 ? t('WOF.Sheet.resolve.floorTip', { n: d.resolve_unclamped }) : '');
  const resolveTip = $derived([resolveShort, resolveFloor].filter(Boolean).join('. '));
  let sealOpen = $state(false);
  $effect(() => {
    if (!sealOpen) return;
    const doc = sealWrap?.ownerDocument ?? document;
    const away = (e: PointerEvent) => {
      if (!sealWrap?.contains(e.target as Node)) sealOpen = false;
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      sealOpen = false;
      sealWrap?.querySelector<HTMLElement>('.seal')?.focus();
    };
    doc.addEventListener('pointerdown', away, true);
    doc.addEventListener('keydown', key, true);
    return () => {
      doc.removeEventListener('pointerdown', away, true);
      doc.removeEventListener('keydown', key, true);
    };
  });

  // ── Chips ───────────────────────────────────────────────────────────
  /** A held Critical Injury as a chip: where it is, its type, and what it does while held. */
  const injuryTip = (w: SoldierView['injuries'][number]) =>
    [
      [w.side ? t(`WOF.Side.${w.side}`) : '', w.locationLabel, t(`WOF.InjuryType.${w.type}`)].filter(Boolean).join(' '),
      t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.untreated'),
      ...w.effects,
    ].join('. ');
  const responseTip = (r: SoldierView['responses'][number]) => [r.text, ...r.effects, t(`WOF.Sheet.ends.${r.ends}`)].filter(Boolean).join(' ');
  const openMenu = (id: string) => () => [{ label: t('WOF.Sheet.menu.open'), icon: 'fa-solid fa-book-open', onClick: () => openItem(actor, id) }];

  // ── Motion ──────────────────────────────────────────────────────────
  /** Animate after the document update has re-rendered. */
  async function after(p: Promise<unknown> | null | undefined, fn: () => void) {
    if (!p) return;
    await p;
    await tick();
    fn();
  }

  function onHealth(i: number) {
    const before = d.current_health;
    after(clickHealthBox(actor, i), () => {
      const now = view.derived.current_health;
      if (now < before) jolt(hpEl);
      else if (now > before) pulse(hpEl);
    });
  }

  function onStress(p: Promise<unknown> | null, up: boolean) {
    after(p, () => {
      if (up) jolt(stEl);
      else pulse(stEl);
    });
  }

  // The Down stamp lands whenever the field changes, from the stamp, the header tag or anyone else.
  let lastDown: boolean | null = null;
  $effect(() => {
    const now = !!s.down;
    untrack(() => {
      const before = lastDown;
      lastDown = now;
      if (before === null || before === now) return;
      tick().then(() => {
        thud(downEl, -4);
        if (now) jolt(hpEl);
        else pulse(hpEl);
      });
    });
  });
</script>

<section class="band" class:compact aria-label={t('WOF.Sheet.band.label')}>
  <!-- Health -->
  <div class="cell hp" bind:this={hpEl}>
    <div class="ch">
      <span class="lbl"><img src={icon('harm-health')} alt="" />{t('WOF.Derived.health')}</span>
      <button
        type="button"
        class="stamp downst"
        class:green={!s.down}
        bind:this={downEl}
        disabled={ro}
        aria-pressed={!!s.down}
        use:tooltip={downOff ? t(d.down_by_rule ? 'WOF.Sheet.down.ruleSaysDown' : 'WOF.Sheet.down.ruleSaysUp') : t('WOF.Sheet.down.toggle')}
        onclick={() => setField(actor, 'system.down', !s.down)}
      >{s.down ? t('WOF.Actor.Base.FIELDS.down.label') : t('WOF.Sheet.state.standing')}{downOff ? ' ?' : ''}</button>
    </div>
    <div class="cr">
      <span class="num" class:red={d.current_health <= 1}>{d.current_health}<small>/{d.health}</small></span>
      <HealthTrack cells={view.health} size="band" disabled={ro} onbox={onHealth} />
    </div>
    <ul class="chips" aria-label={t('WOF.Sheet.health.injuries')}>
      {#each view.injuries as w (w.id)}
        <li>
          <button
            type="button"
            class="chip"
            class:treated={w.treated}
            class:untreated={!w.treated}
            use:tooltip={injuryTip(w)}
            use:contextMenu={openMenu(w.id)}
            onclick={() => ss.spot('injury', w.id)}
          ><img src={w.img} alt="" /><span>{w.name}</span></button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Stress -->
  <div class="cell st" bind:this={stEl}>
    <div class="ch">
      <span class="lbl"><img src={icon('die-stress')} alt="" />{t('WOF.Derived.stress')}</span>
      <span class="chr">
        <span class="note red">{t('WOF.Sheet.stress.min', { n: d.minimum_stress })}</span>
        <span class="stepper">
          <button type="button" disabled={ro || d.stress_effective <= d.minimum_stress} aria-label={t('WOF.Sheet.stress.lower')} onclick={() => onStress(stepStress(actor, -1), false)}>−</button>
          <button type="button" disabled={ro} aria-label={t('WOF.Sheet.stress.raise')} onclick={() => onStress(stepStress(actor, 1), true)}>+</button>
        </span>
      </span>
    </div>
    <div class="cr">
      <span class="num red">{d.stress_effective}</span>
      <StressTrack
        count={stressBoxes}
        max={BAND_BOXES}
        size="band"
        value={d.stress_effective}
        minimum={d.minimum_stress}
        disabled={ro}
        onbox={(i) => onStress(clickStressBox(actor, i), i >= d.stress_effective)}
      />
    </div>
    <ul class="chips" aria-label={t('WOF.Sheet.stress.responses')}>
      {#each view.responses as r (r.index)}
        <li>
          {#if compact}
            <span class="chip resp" use:tooltip={responseTip(r)}><img src={icon('roll-stress')} alt="" /><span>{r.name}</span></span>
          {:else}
            <button type="button" class="chip resp" use:tooltip={responseTip(r)} onclick={() => ss.spot('response', String(r.index))}>
              <img src={icon('roll-stress')} alt="" /><span>{r.name}</span>
            </button>
          {/if}
        </li>
      {:else}
        <li><span class="chip none"><span>{t('WOF.Sheet.stress.noResponse')}</span></span></li>
      {/each}
    </ul>
  </div>

  <!-- Resolve: the wax seal -->
  <div class="cell res" bind:this={sealWrap}>
    <button
      type="button"
      class="seal"
      class:red={d.resolve <= 0}
      aria-expanded={sealOpen}
      aria-controls="{uid}-resolve"
      aria-label={t('WOF.Sheet.resolve.show', { n: d.resolve })}
      use:tooltip={resolveTip}
      onclick={() => (sealOpen = !sealOpen)}
    ><img src={icon('seal-wax')} alt="" /><b>{d.resolve}</b></button>
    <span class="lbl">{t('WOF.Derived.resolve')}</span>
    <div class="pop-f" id="{uid}-resolve" role="note" hidden={!sealOpen}>
      <b>{t('WOF.Sheet.resolve.title', { n: d.resolve })}</b>
      <span>{t('WOF.Sheet.resolve.built')}</span>
      <span>{resolveShort} = <b>{d.resolve}</b></span>
      {#if resolveFloor}<span class="red">{resolveFloor}</span>{/if}
    </div>
  </div>

  <!-- Gas: the fitted canister and the spare rack -->
  <div class="cell gear gas">
    <div class="ch">
      <span class="lbl">
        <img src={icon('gear-gas-canister')} alt="" />{t('WOF.Sheet.gas.title')}
        <b class="gnum" class:dry={s.gas_rating <= 0} use:tooltip={t('WOF.Sheet.gas.level', { current: s.gas_rating, full: view.fullGas })}>{s.gas_rating}<small>/{view.fullGas}</small></b>
      </span>
      {#if odm}<Dots size="sm" groups={[{ cls: 'dg', n: odm.current }, { cls: 'dg o', n: odm.rating - odm.current }]} label={t('WOF.Sheet.gas.odmDice', { current: odm.current, rating: odm.rating })} />{/if}
    </div>
    <div class="cr">
      <GasInstrument
        level={s.gas_rating}
        full={view.fullGas}
        spares={s.spare_canisters}
        {stamp}
        disabled={ro || equipmentBusy}
        swapEvent={gasSwap}
        onspend={() => equipmentAction(() => spendGas(actor))}
        onfit={swapTank}
        onmore={() => (ss.tab = 'kit')}
      />
    </div>
    <div class="acts">
      <button type="button" class="mini" disabled={ro || equipmentBusy || s.gas_rating <= 0} onclick={() => equipmentAction(() => spendGas(actor))}>{t('WOF.Sheet.gas.spend')}</button>
      <button type="button" class="mini" disabled={ro || equipmentBusy || bestSpare < 0} use:tooltip={t('WOF.Sheet.gas.changeTip')} onclick={() => swapTank(bestSpare)}>{t('WOF.Sheet.gas.change')}</button>
    </div>
  </div>

  <!-- Blade Sets: the set in the handles and the scabbard -->
  <div class="cell gear grow blades">
    <div class="ch">
      <span class="lbl"><img src={icon('gear-blades')} alt="" />{t('WOF.Sheet.blades.title')}</span>
      {#if blades.inHand !== null}
        <Dots size="sm" groups={[{ cls: 'dg', n: blades.inHand }]} label={t('WOF.Sheet.blades.handDice', { current: blades.inHand })} />
      {:else}
        <b class="note red">{t('WOF.Sheet.blades.handEmpty')}</b>
      {/if}
    </div>
    <div class="cr">
      <BladeInstrument inHand={blades.inHand} stored={blades.stored} disabled={ro || equipmentBusy} onswap={() => equipmentAction(() => fitBladeSet(actor))} />
    </div>
    <div class="acts">
      <button type="button" class="mini red" disabled={ro || equipmentBusy || blades.inHand === null} use:tooltip={t('WOF.Sheet.blades.ruinTip')} onclick={() => equipmentAction(() => ruinBladeInHandles(actor))}>{t('WOF.Sheet.blades.ruin')}</button>
      <button type="button" class="mini" disabled={ro || equipmentBusy || blades.inHand !== null || !blades.stored} onclick={() => equipmentAction(() => fitBladeSet(actor))}>{t('WOF.Sheet.blades.swap')}</button>
      {#if discipline}<span class="note disc">{discipline.used ? t('WOF.Sheet.blades.disciplineUsed') : t('WOF.Sheet.blades.disciplineReady')}</span>{/if}
    </div>
  </div>
</section>
