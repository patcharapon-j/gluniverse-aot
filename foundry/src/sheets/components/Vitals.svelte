<script lang="ts">
  import { tick } from 'svelte';
  import { jolt, popIn, pulse, strike } from '../../motion/fx.ts';
  import { tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { clickHealthBox, clickStressBox, fitBladeSet, fitCanister, openItem, ruinBladeInHandles, setField, spendGas, stepStress } from '../soldier-ops.ts';
  import { icon, type SoldierView } from '../soldier-view.ts';
  import Dots from './Dots.svelte';
  import Widget3d from './Widget3d.svelte';

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
  const stressBoxes = $derived(Math.max(6, d.stress_effective + 1));
  const bestSpare = $derived(s.spare_canisters.length ? s.spare_canisters.indexOf(Math.max(...s.spare_canisters)) : -1);

  const gasState = $derived({ level: s.gas_rating, full: view.fullGas, spares: [...s.spare_canisters].sort((a, b) => b - a), dull: !odm || d.jammed });
  const bladeState = $derived({ inHandles: !!inHandles, carried: carried.length });

  /** A held Critical Injury as a chip: where it is, its type, and what it does while held. */
  const injuryTip = (w: SoldierView['injuries'][number]) =>
    [
      [w.side ? t(`WOF.Side.${w.side}`) : '', w.locationLabel, t(`WOF.InjuryType.${w.type}`)].filter(Boolean).join(' '),
      t(w.treated ? 'WOF.Sheet.injury.treated' : 'WOF.Sheet.injury.untreated'),
      ...w.effects,
    ].join('. ');
  const responseTip = (r: SoldierView['responses'][number]) => [r.text, ...r.effects, t(`WOF.Sheet.ends.${r.ends}`)].filter(Boolean).join(' ');

  const boxLabel = (b: string, i: number) => t(`WOF.Sheet.health.box.${b}`, { n: i + 1 });

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
      const boxes = [...(hpEl?.querySelectorAll('.hbox') ?? [])];
      const now = view.derived.current_health;
      if (now < before) {
        jolt(hpEl);
        strike(boxes.filter((b) => b.classList.contains('damaged')));
      } else if (now > before) {
        pulse(hpEl);
        popIn(boxes.filter((b) => b.classList.contains('held')));
      }
    });
  }

  function onStress(p: Promise<unknown> | null, up: boolean) {
    after(p, () => {
      if (up) jolt(stEl);
      else pulse(stEl);
    });
  }
</script>

{#snippet can(x: number, level: number, scale: number, dim: boolean)}
  <g transform="translate({x} {4 + 48 * (1 - scale)}) scale({scale})" opacity={dim ? 0.8 : 1}>
    <rect x="0" y="6" width="22" height="44" rx="6" fill={gasState.dull && !dim ? '#8a9096' : '#c3c9ce'} stroke="#2a2e32" />
    <rect x="7" y="0" width="8" height="7" fill="#b9924a" stroke="#6e5325" />
    {#each Array.from({ length: gasState.full }) as _, i (i)}
      <rect x="2" y={42 - i * (36 / gasState.full)} width="18" height={Math.max(3, 36 / gasState.full - 4)} fill={i < level ? '#8e2323' : '#4a4f55'} />
    {/each}
  </g>
{/snippet}

<div class="vitals">
  <!-- Health -->
  <div class="vit" bind:this={hpEl}>
    <div class="vhead">
      <span class="lbl"><i class="vic fa-solid fa-heart-pulse" aria-hidden="true"></i>{t('WOF.Derived.health')}</span>
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
    <div class="boxes" role="group" aria-label={t('WOF.Sheet.health.boxes')}>
      {#each d.health_boxes as b, i (i)}
        <button
          type="button"
          class="hbox {b === 'clean' ? 'held' : b}"
          disabled={ro || b === 'crossed'}
          aria-label={boxLabel(b, i)}
          use:tooltip={b === 'crossed' ? t('WOF.Sheet.health.crossedTip') : null}
          onclick={() => onHealth(i)}
        ></button>
      {/each}
    </div>
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
      <span class="lbl"><i class="vic stress fa-solid fa-brain" aria-hidden="true"></i>{t('WOF.Derived.stress')}</span>
      <span class="note red">{t('WOF.Sheet.stress.min', { n: d.minimum_stress })}</span>
    </div>
    <div class="vrow">
      <span class="big red">{d.stress_effective}</span>
      <span class="stepper">
        <button type="button" disabled={ro || d.stress_effective <= d.minimum_stress} aria-label={t('WOF.Sheet.stress.lower')} onclick={() => onStress(stepStress(actor, -1), false)}>−</button>
        <button type="button" disabled={ro} aria-label={t('WOF.Sheet.stress.raise')} onclick={() => onStress(stepStress(actor, 1), true)}>+</button>
      </span>
    </div>
    <div class="boxes" role="group" aria-label={t('WOF.Sheet.stress.boxes')}>
      {#each Array.from({ length: stressBoxes }) as _, i (i)}
        <button
          type="button"
          class="sbox"
          class:on={i < d.stress_effective}
          class:min={i < d.minimum_stress}
          disabled={ro}
          aria-label={t('WOF.Sheet.stress.box', { n: i + 1 })}
          aria-pressed={i < d.stress_effective}
          onclick={() => onStress(clickStressBox(actor, i), i >= d.stress_effective)}
        ></button>
      {/each}
    </div>
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

  <!-- Gas: the fitted canister and the spares (three.js widget, or the drawn still) -->
  <div class="vit gasv" bind:this={gasEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('gear-gas-canister')} alt="" />{t('WOF.Sheet.gas.title')}</span>
      <span class="note" class:red={s.gas_rating <= 0 || d.jammed}>
        {#if !odm}{t('WOF.Sheet.gas.noOdm')}{:else if d.jammed}{t('WOF.Derived.jammed')}{:else if s.gas_rating <= 0}{t('WOF.Sheet.gas.dry')}{:else}{t('WOF.Sheet.gas.odm', { current: odm.current, rating: odm.rating })}{/if}
      </span>
    </div>
    <div class="w3 gas">
      {#if !compact}<Widget3d kind="gas" values={gasState}>
        {#snippet still()}
          <svg viewBox="0 0 96 56" width="96" height="56">
            {@render can(10, gasState.level, 1, false)}
            {#each gasState.spares.slice(0, 3) as g, i (i)}{@render can(50 + i * 15, g, 0.62, true)}{/each}
          </svg>
        {/snippet}
      </Widget3d>{/if}
      <div class="wtxt">
        <span class="val">{s.gas_rating}<small>/{view.fullGas}</small></span>
        <span class="note">{s.spare_canisters.length ? t('WOF.Sheet.gas.spares', { list: s.spare_canisters.join(', ') }) : t('WOF.Sheet.gas.noSpare')}</span>
        {#if odm}<Dots size="sm" groups={[{ cls: 'dg', n: odm.current }, { cls: 'dg o', n: odm.rating - odm.current }]} label={t('WOF.Sheet.gas.odmDice', { current: odm.current, rating: odm.rating })} />{/if}
      </div>
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

  <!-- Blade Sets: the set in the handles and the carried sets (three.js widget, or the drawn still) -->
  <div class="vit bladev" bind:this={bladeEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('gear-blades')} alt="" />{t('WOF.Sheet.blades.title')}</span>
      {#if discipline}<span class="note">{discipline.used ? t('WOF.Sheet.blades.disciplineUsed') : t('WOF.Sheet.blades.disciplineReady')}</span>{/if}
    </div>
    <div class="w3 blades">
      {#if !compact}<Widget3d kind="blades" values={bladeState}>
        {#snippet still()}
          <svg viewBox="0 0 120 56" width="120" height="56">
            <rect x="4" y="30" width="36" height="20" fill="#7c848b" stroke="#2a2d31" />
            {#each Array.from({ length: Math.min(4, bladeState.carried) }) as _, i (i)}<path d="M40 {47 - i * 5}h40l6 2h-46z" fill="#c9cfd4" stroke="#5d646b" stroke-width=".8" />{/each}
            <rect x="4" y="8" width="30" height="12" fill="#2a2d31" />
            <rect x="10" y="18" width="6" height="8" fill="#2a2d31" />
            {#if bladeState.inHandles}
              <path d="M34 9h66l8 3h-74z" fill="#dfe4e8" stroke="#5d646b" stroke-width=".8" />
              <path d="M34 15h66l8 3h-74z" fill="#dfe4e8" stroke="#5d646b" stroke-width=".8" />
            {/if}
          </svg>
        {/snippet}
      </Widget3d>{/if}
      <div class="wtxt">
        <span class="val"><span class:red-text={!inHandles}>{inHandles ? 1 : 0}</span><small> + {carried.length}</small></span>
        <span class="note">
          {#if inHandles}{t('WOF.Sheet.blades.inHandles')} <Dots size="sm" groups={[{ cls: 'dg', n: inHandles.rating }]} />{:else}{t('WOF.Sheet.blades.empty')}{/if}
        </span>
      </div>
    </div>
    <div class="acts">
      <button type="button" class="mini" disabled={ro || !inHandles} use:tooltip={t('WOF.Sheet.blades.ruinTip')} onclick={() => after(ruinBladeInHandles(actor), () => jolt(bladeEl))}>{t('WOF.Sheet.blades.ruin')}</button>
      <button type="button" class="mini" disabled={ro || !!inHandles || !carried.length} onclick={() => after(fitBladeSet(actor), () => pulse(bladeEl))}>{t('WOF.Sheet.blades.swap')}</button>
    </div>
  </div>
</div>
