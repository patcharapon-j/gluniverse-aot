<script lang="ts">
  import { tick } from 'svelte';
  import { jolt, pulse } from '../../motion/fx.ts';
  import { tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { clickHealthBox, clickStressBox, fitBladeSet, fitCanister, openItem, ruinBladeInHandles, setField, spendGas, stepStress } from '../soldier-ops.ts';
  import { icon, type SoldierView } from '../soldier-view.ts';
  import Dots from './Dots.svelte';
  import HealthTrack from './HealthTrack.svelte';
  import StressTrack from './StressTrack.svelte';

  let { view, compact = false }: { view: SoldierView; compact?: boolean } = $props();
  const { actor, state: ss } = sheetContext();
  const s = $derived(view.system);
  const d = $derived(view.derived);
  const ro = $derived(!view.editable);

  let hpEl: HTMLElement | undefined = $state();
  let stEl: HTMLElement | undefined = $state();
  let rsEl: HTMLElement | undefined = $state();
  let gasEl: HTMLElement | undefined = $state();
  let bladeEl: HTMLElement | undefined = $state();

  const odm = $derived(view.gear.find((g) => g.subtype === 'odm') ?? null);
  const blades = $derived(view.gear.filter((g) => g.subtype === 'blade-set'));
  const inHandles = $derived(blades.find((g) => g.inHandles) ?? null);
  const carried = $derived(blades.filter((g) => !g.inHandles));
  const discipline = $derived(view.talents.find((x) => x.talentId === 'blade-discipline') ?? null);
  // The strip's track wraps at eight boxes a row (sheet.css, --track-cols) and tallies the rest.
  const STRIP_BOXES = 24;
  const stressBoxes = $derived(Math.max(6, d.stress_effective + 1));
  const bestSpare = $derived(s.spare_canisters.length ? s.spare_canisters.indexOf(Math.max(...s.spare_canisters)) : -1);

  const dry = $derived(s.gas_rating <= 0 || d.jammed || !odm);

  /** A held Critical Injury as a chip: where it is, its type, and what it does while held. */
  const injuryTip = (w: SoldierView['injuries'][number]) =>
    [
      [w.side ? t(`WOF.Side.${w.side}`) : '', w.locationLabel, t(`WOF.InjuryType.${w.type}`)].filter(Boolean).join(' '),
      t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.untreated'),
      ...w.effects,
    ].join('. ');
  const responseTip = (r: SoldierView['responses'][number]) => [r.text, ...r.effects, t(`WOF.Sheet.ends.${r.ends}`)].filter(Boolean).join(' ');

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
</script>

<div class="vitals">
  <!-- Health -->
  <div class="vit" bind:this={hpEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('harm-health')} alt="" />{t('WOF.Derived.health')}</span>
      <span class="down">
        <button
          type="button"
          class="stamp {s.down ? '' : 'no'}"
          disabled={ro}
          aria-pressed={s.down}
          use:tooltip={s.down !== d.down_by_rule ? t(d.down_by_rule ? 'WOF.Sheet.down.ruleSaysDown' : 'WOF.Sheet.down.ruleSaysUp') : t('WOF.Sheet.down.toggle')}
          onclick={() => after(setField(actor, 'system.down', !s.down), () => (s.down ? jolt(hpEl) : pulse(hpEl)))}
        >{s.down ? t('WOF.Actor.Base.FIELDS.down.label') : t('WOF.Sheet.state.standing')}{s.down !== d.down_by_rule ? ' ?' : ''}</button>
      </span>
    </div>
    <div class="vrow"><span class="big" class:red={d.current_health <= 1}>{d.current_health}<small>/{d.health}</small></span></div>
    <HealthTrack cells={view.health} disabled={ro} onbox={onHealth} />
    {#if view.injuries.length}
      <ul class="vchips" aria-label={t('WOF.Sheet.health.injuries')}>
        {#each view.injuries as w (w.id)}
          <li>
            <button type="button" class="vchip" class:treated={w.treated} use:tooltip={injuryTip(w)} onclick={() => openItem(actor, w.id)}>
              <img src={w.img} alt="" />{w.name}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <!-- Stress -->
  <div class="vit" bind:this={stEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('die-stress')} alt="" />{t('WOF.Derived.stress')}</span>
      <span class="note red">{t('WOF.Sheet.stress.min', { n: d.minimum_stress })}</span>
    </div>
    <div class="vrow">
      <span class="big red">{d.stress_effective}</span>
      <span class="stepper">
        <button type="button" disabled={ro || d.stress_effective <= d.minimum_stress} aria-label={t('WOF.Sheet.stress.lower')} onclick={() => onStress(stepStress(actor, -1), false)}>−</button>
        <button type="button" disabled={ro} aria-label={t('WOF.Sheet.stress.raise')} onclick={() => onStress(stepStress(actor, 1), true)}>+</button>
      </span>
    </div>
    <StressTrack count={stressBoxes} max={STRIP_BOXES} value={d.stress_effective} minimum={d.minimum_stress} disabled={ro} onbox={(i) => onStress(clickStressBox(actor, i), i >= d.stress_effective)} />
    {#if view.responses.length}
      <ul class="vchips" aria-label={t('WOF.Sheet.stress.responses')}>
        {#each view.responses as r (r.index)}
          <li>
            {#if compact}
              <span class="vchip mind" use:tooltip={responseTip(r)}>
                <i class="fa-solid fa-head-side-virus" aria-hidden="true"></i>{r.name}<small>{t('WOF.Sheet.stress.lasting')}</small>
              </span>
            {:else}
              <button type="button" class="vchip mind" use:tooltip={responseTip(r)} onclick={() => (ss.tab = 'wounds')}>
                <i class="fa-solid fa-head-side-virus" aria-hidden="true"></i>{r.name}<small>{t('WOF.Sheet.stress.lasting')}</small>
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <!-- Resolve -->
  <div class="vit" bind:this={rsEl}>
    <div class="vhead"><span class="lbl">{t('WOF.Derived.resolve')}</span></div>
    <div class="vrow"><span class="big" class:red={d.resolve <= 0}>{d.resolve}</span></div>
    <span class="note" use:tooltip={d.resolve_unclamped < 0 ? t('WOF.Sheet.resolve.floorTip', { n: d.resolve_unclamped }) : null}>
      {t('WOF.Sheet.resolve.short', { base: Math.ceil((s.attributes.instinct + s.attributes.empathy) / 2), scars: s.scars.length, grief: Math.min(s.grief, 3) })}
    </span>
  </div>

  <!-- Gas: the fitted canister's gauge, then the spares as tanks a click fits. -->
  <div class="vit gasv" bind:this={gasEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('gear-gas-canister')} alt="" />{t('WOF.Sheet.gas.title')}</span>
      <span class="note" class:red={s.gas_rating <= 0 || d.jammed}>
        {#if !odm}{t('WOF.Sheet.gas.noOdm')}{:else if d.jammed}{t('WOF.Derived.jammed')}{:else if s.gas_rating <= 0}{t('WOF.Sheet.gas.dry')}{:else}{t('WOF.Sheet.gas.odm', { current: odm.current, rating: odm.rating })}{/if}
      </span>
    </div>
    <div class="vrow">
      <span class="big" class:red={s.gas_rating <= 0}>{s.gas_rating}<small>/{view.fullGas}</small></span>
      <span class="canister fitted" class:dry role="img" aria-label={t('WOF.Sheet.gas.level', { current: s.gas_rating, full: view.fullGas })}>
        {#each Array.from({ length: view.fullGas }) as _, i (i)}<i class="gasbar" class:on={i < s.gas_rating}></i>{/each}
      </span>
      {#if odm}<Dots size="sm" groups={[{ cls: 'dg', n: odm.current }, { cls: 'dg o', n: odm.rating - odm.current }]} label={t('WOF.Sheet.gas.odmDice', { current: odm.current, rating: odm.rating })} />{/if}
    </div>
    <div class="tanks">
      {#if s.spare_canisters.length}<span class="lbl">{t('WOF.Sheet.gas.spareTanks')}</span>{/if}
      {#each s.spare_canisters as g, i (i)}
        <button
          type="button"
          class="canister"
          disabled={ro}
          aria-label={t('WOF.Sheet.gas.fitThis', { n: i + 1, current: g, full: view.fullGas })}
          use:tooltip={t('WOF.Sheet.gas.changeTip')}
          onclick={() => after(fitCanister(actor, i), () => pulse(gasEl))}
        >
          {#each Array.from({ length: view.fullGas }) as _, j (j)}<i class="gasbar" class:on={j < g}></i>{/each}
        </button>
      {:else}<span class="note">{t('WOF.Sheet.gas.noSpare')}</span>{/each}
    </div>
    <div class="acts">
      <button type="button" class="mini" disabled={ro || s.gas_rating <= 0} onclick={() => after(spendGas(actor), () => jolt(gasEl))}>{t('WOF.Sheet.gas.spend')}</button>
      <button
        type="button"
        class="mini"
        disabled={ro || bestSpare < 0}
        use:tooltip={t('WOF.Sheet.gas.changeTip')}
        onclick={() => after(fitCanister(actor, bestSpare), () => pulse(gasEl))}
      >{t('WOF.Sheet.gas.change')}</button>
    </div>
  </div>

  <!-- Blade Sets: the set in the handles, and the sets still in the box. -->
  <div class="vit bladev" bind:this={bladeEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('gear-blades')} alt="" />{t('WOF.Sheet.blades.title')}</span>
      {#if discipline}<span class="note">{discipline.used ? t('WOF.Sheet.blades.disciplineUsed') : t('WOF.Sheet.blades.disciplineReady')}</span>{/if}
    </div>
    <div class="slots">
      <span class="slot" class:on={!!inHandles} class:bad={!inHandles}>
        <i class="blade" aria-hidden="true"></i>
        <span class="note">{t('WOF.Sheet.blades.hand')}</span>
        {#if inHandles}
          <Dots size="sm" groups={[{ cls: 'dg', n: inHandles.rating }]} label={t('WOF.Sheet.blades.handDice', { current: inHandles.rating })} />
        {:else}<b>{t('WOF.Sheet.blades.handEmpty')}</b>{/if}
      </span>
      <span class="slot">
        <i class="box" aria-hidden="true"></i>
        <span class="note">{t('WOF.Sheet.blades.stored')}</span>
        <b>{carried.length}</b>
      </span>
    </div>
    <div class="acts">
      <button type="button" class="mini" disabled={ro || !inHandles} use:tooltip={t('WOF.Sheet.blades.ruinTip')} onclick={() => after(ruinBladeInHandles(actor), () => jolt(bladeEl))}>{t('WOF.Sheet.blades.ruin')}</button>
      <button type="button" class="mini" disabled={ro || !!inHandles || !carried.length} onclick={() => after(fitBladeSet(actor), () => pulse(bladeEl))}>{t('WOF.Sheet.blades.swap')}</button>
    </div>
  </div>
</div>
