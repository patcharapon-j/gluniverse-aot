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
  // The strip's track wraps at eight boxes a row (sheet.css, --track-cols) and tallies the rest.
  const STRIP_BOXES = 24;
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

{#snippet can(x: number, y: number, level: number, scale: number, dim: boolean)}
  <g transform="translate({x} {y}) scale({scale})" opacity={dim ? 0.92 : 1}>
    <ellipse cx="17" cy="84" rx="19" ry="4" fill="#241f1b" opacity=".2" />
    <rect x="12" y="0" width="10" height="9" rx="1.5" fill="url(#gas-brass)" stroke="#6e5325" stroke-width=".8" />
    {#if !dim}<rect x="6" y="-4" width="22" height="5" rx="2.5" fill="url(#gas-brass)" stroke="#6e5325" stroke-width=".8" />{/if}
    <rect x="1" y="8" width="32" height="74" rx="9" fill={gasState.dull && !dim ? 'url(#gas-dull)' : 'url(#gas-steel)'} stroke="#2a2e32" stroke-width="1.2" />
    <rect x="1" y="14" width="32" height="4" fill="#8a6a2f" opacity=".85" />
    <rect x="1" y="71" width="32" height="4" fill="#8a6a2f" opacity=".85" />
    {#each Array.from({ length: gasState.full }) as _, i (i)}
      {@const h = Math.max(4, 48 / gasState.full - 3)}
      <rect x="4" y={67 - (i + 1) * (48 / gasState.full)} width="26" height={h} rx="1" fill={i < level ? '#9a2626' : '#3c4147'} stroke={i < level ? '#5f1717' : '#2a2e32'} stroke-width=".6" />
      {#if i < level}<rect x="6" y={68.5 - (i + 1) * (48 / gasState.full)} width="7" height={Math.max(1.5, h - 3)} fill="#d67b6b" opacity=".45" />{/if}
    {/each}
    <rect x="4" y="10" width="6" height="70" rx="3" fill="#fff" opacity=".28" />
  </g>
{/snippet}

{#snippet bladePair(x: number, y: number, len: number, opacity: number)}
  <g transform="translate({x} {y})" {opacity}>
    <path d="M0 0h{len}l7 2.6-7 2.6H0z" fill="url(#blade-steel)" stroke="#5d646b" stroke-width=".7" />
    <path d="M0 1.1h{len - 2}" stroke="#fff" stroke-width=".9" opacity=".55" />
  </g>
{/snippet}

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

  <!-- Gas: the fitted canister and the spares (three.js widget, or the drawn still) -->
  <div class="vit gasv" bind:this={gasEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('gear-gas-canister')} alt="" />{t('WOF.Sheet.gas.title')}</span>
      <span class="note" class:red={s.gas_rating <= 0 || d.jammed}>
        {#if !odm}{t('WOF.Sheet.gas.noOdm')}{:else if d.jammed}{t('WOF.Derived.jammed')}{:else if s.gas_rating <= 0}{t('WOF.Sheet.gas.dry')}{:else}{t('WOF.Sheet.gas.odm', { current: odm.current, rating: odm.rating })}{/if}
      </span>
    </div>
    <div class="w3 gas rig" class:dry={s.gas_rating <= 0 || d.jammed}>
      {#if !compact}<Widget3d kind="gas" values={gasState}>
        {#snippet still()}
          <svg viewBox="0 0 150 108" width="150" height="108">
            <defs>
              <linearGradient id="gas-steel" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#9aa2a9" /><stop offset=".35" stop-color="#e4e9ed" /><stop offset=".7" stop-color="#b9c1c8" /><stop offset="1" stop-color="#848c93" />
              </linearGradient>
              <linearGradient id="gas-dull" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#6c7178" /><stop offset=".4" stop-color="#9aa0a6" /><stop offset="1" stop-color="#5d626a" />
              </linearGradient>
              <linearGradient id="gas-brass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#e2c078" /><stop offset="1" stop-color="#8a6a2f" />
              </linearGradient>
            </defs>
            {#if gasState.spares.length}<rect x="74" y="86" width="72" height="7" rx="1.5" fill="#4a5056" stroke="#2a2e32" stroke-width=".8" />{/if}
            {@render can(8, 12, gasState.level, 1.08, false)}
            {#each gasState.spares.slice(0, 3) as g, i (i)}{@render can(76 + i * 24, 44, g, 0.52, true)}{/each}
          </svg>
        {/snippet}
      </Widget3d>{/if}
      <div class="wtxt gauge">
        <span class="val">{s.gas_rating}<small>/{view.fullGas}</small></span>
        <span class="bar" role="img" aria-label={t('WOF.Sheet.gas.level', { current: s.gas_rating, full: view.fullGas })}>
          {#each Array.from({ length: view.fullGas }) as _, i (i)}<i class:on={i < s.gas_rating}></i>{/each}
        </span>
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
    <div class="w3 blades rig" class:dry={!inHandles}>
      {#if !compact}<Widget3d kind="blades" values={bladeState}>
        {#snippet still()}
          <svg viewBox="0 0 178 108" width="178" height="108">
            <defs>
              <linearGradient id="blade-steel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#f2f5f7" /><stop offset=".5" stop-color="#cdd4d9" /><stop offset="1" stop-color="#969ea5" />
              </linearGradient>
              <linearGradient id="blade-iron" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#8d959c" /><stop offset="1" stop-color="#5b6268" />
              </linearGradient>
            </defs>
            <!-- the scabbard box on the hip, strapped shut, with the spare sets stacked in it -->
            <rect x="8" y="54" width="54" height="40" rx="3" fill="url(#blade-iron)" stroke="#2a2d31" stroke-width="1.2" />
            <rect x="16" y="50" width="7" height="48" rx="1.5" fill="#4a3120" />
            <rect x="46" y="50" width="7" height="48" rx="1.5" fill="#4a3120" />
            <rect x="8" y="50" width="54" height="6" rx="2" fill="#2a2d31" />
            {#each Array.from({ length: Math.min(4, bladeState.carried) }) as _, i (i)}
              {@render bladePair(62, 88 - i * 9, 46, 1)}
            {/each}
            <!-- the handles, and the set locked into them -->
            <rect x="10" y="16" width="44" height="13" rx="3" fill="#2a2d31" />
            <rect x="24" y="27" width="9" height="15" rx="2.5" fill="#2a2d31" />
            <rect x="52" y="12" width="12" height="21" rx="2" fill="url(#blade-iron)" stroke="#2a2d31" stroke-width="1" />
            {#if bladeState.inHandles}
              {@render bladePair(64, 15, 98, 1)}
              {@render bladePair(64, 24, 98, 1)}
            {:else}
              {@render bladePair(64, 15, 12, 0.55)}
              {@render bladePair(64, 24, 12, 0.55)}
            {/if}
          </svg>
        {/snippet}
      </Widget3d>{/if}
      <div class="wtxt gauge">
        <span class="val"><span class:red-text={!inHandles}>{inHandles ? 1 : 0}</span><small> + {carried.length}</small></span>
        <span class="rack" role="img" aria-label={t('WOF.Sheet.blades.rack', { handles: inHandles ? 1 : 0, carried: carried.length })}>
          <i class="set handles" class:on={!!inHandles}></i>
          {#each Array.from({ length: Math.max(carried.length, 1) }) as _, i (i)}<i class="set" class:on={i < carried.length}></i>{/each}
        </span>
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
