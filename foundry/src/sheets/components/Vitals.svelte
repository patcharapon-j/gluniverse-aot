<script lang="ts">
  import { tick } from 'svelte';
  import { jolt, popIn, pulse, strike } from '../../motion/fx.ts';
  import { tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { clickHealthBox, clickStressBox, fitBladeSet, fitCanister, ruinBladeInHandles, setField, spendGas, stepStress } from '../soldier-ops.ts';
  import { icon, type SoldierView } from '../soldier-view.ts';
  import Dots from './Dots.svelte';

  let { view }: { view: SoldierView } = $props();
  const { actor } = sheetContext();
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
  </div>

  <!-- Resolve -->
  <div class="vit" bind:this={rsEl}>
    <div class="vhead"><span class="lbl">{t('WOF.Derived.resolve')}</span></div>
    <div class="vrow"><span class="big" class:red={d.resolve <= 0}>{d.resolve}</span></div>
    <span class="note" use:tooltip={d.resolve_unclamped < 0 ? t('WOF.Sheet.resolve.floorTip', { n: d.resolve_unclamped }) : null}>
      {t('WOF.Sheet.resolve.short', { base: Math.ceil((s.attributes.instinct + s.attributes.empathy) / 2), scars: s.scars.length, grief: Math.min(s.grief, 3) })}
    </span>
  </div>

  <!-- Gas: the three.js canister widget mounts in the .still slot in step 2e -->
  <div class="vit gasv" bind:this={gasEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('gear-gas-canister')} alt="" />{t('WOF.Sheet.gas.title')}</span>
      <span class="note" class:red={s.gas_rating <= 0 || d.jammed}>
        {#if !odm}{t('WOF.Sheet.gas.noOdm')}{:else if d.jammed}{t('WOF.Derived.jammed')}{:else if s.gas_rating <= 0}{t('WOF.Sheet.gas.dry')}{:else}{t('WOF.Sheet.gas.odm', { current: odm.current, rating: odm.rating })}{/if}
      </span>
    </div>
    <div class="w3 gas">
      <div class="still" data-widget="gas" data-slot="2e" aria-hidden="true"><img src={icon('gear-gas-canister')} alt="" /></div>
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

  <!-- Blade Sets: the three.js blade widget mounts in the .still slot in step 2e -->
  <div class="vit bladev" bind:this={bladeEl}>
    <div class="vhead">
      <span class="lbl"><img class="ic s16" src={icon('gear-blades')} alt="" />{t('WOF.Sheet.blades.title')}</span>
      {#if discipline}<span class="note">{discipline.used ? t('WOF.Sheet.blades.disciplineUsed') : t('WOF.Sheet.blades.disciplineReady')}</span>{/if}
    </div>
    <div class="w3 blades">
      <div class="still" data-widget="blades" data-slot="2e" aria-hidden="true"><img src={icon('gear-blades')} alt="" /></div>
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
