<script lang="ts">
  import { untrack, tick } from 'svelte';
  import { motionMode } from '../../settings.svelte.ts';
  import { t } from '../context.ts';
  let { kind, level = 0, full = 3, spares = [], fitted = false, carried = 0, disabled = false, unavailable = false, swapEvent = { id: 0, index: -1, oldLevel: 0 }, onfit = (_: number) => {} }: {
    kind: 'gas' | 'blades'; level?: number; full?: number; spares?: number[]; fitted?: boolean;
    carried?: number; disabled?: boolean; unavailable?: boolean; onfit?: (index: number) => void | Promise<void>; swapEvent?: { id: number; index: number; oldLevel: number };
  } = $props();
  const uid = $props.id();
  type Snapshot = { level: number; spares: number[]; fitted: boolean; carried: number };
  let previous: Snapshot | undefined;
  let serial = 0;
  let seenSwap = 0;
  let rig: HTMLDivElement | undefined = $state();
  async function chooseTank(index: number) {
    await onfit(index);
    await tick();
    const next = rig?.querySelectorAll<HTMLButtonElement>(".tank-cap");
    if (next?.length) next[Math.min(index, next.length - 1)].focus({ preventScroll: true });
    else rig?.focus({ preventScroll: true });
  }
  let change = $state({ id: 0, type: '', oldLevel: 0, slot: -1 });
  const mode = $derived(motionMode());
  let previousMode: string | undefined;
  $effect(() => {
    const nextMode = mode;
    untrack(() => {
      if (previousMode !== undefined && previousMode !== nextMode) change = { id: ++serial, type: '', oldLevel: 0, slot: -1 };
      previousMode = nextMode;
    });
  });
  $effect(() => {
    const next = { level, spares: [...spares], fitted, carried };
    const request = swapEvent;
    untrack(() => {
      if (previous) {
        const swapped = JSON.stringify(previous.spares) !== JSON.stringify(next.spares) && previous.spares.includes(next.level);
        const type = kind === 'gas'
          ? swapped ? 'tank-swap' : next.level < previous.level ? 'gas-spend' : next.level !== previous.level ? 'gas-fill' : ''
          : previous.fitted && !next.fitted ? 'blade-break' : !previous.fitted && next.fitted ? 'blade-fit' : '';
        if (request.id !== seenSwap) {
          change = { id: ++serial, type: 'tank-swap', oldLevel: request.oldLevel, slot: request.index };
          seenSwap = request.id;
        } else if (type) change = { id: ++serial, type, oldLevel: previous.level, slot: previous.spares.indexOf(next.level) };
      }
      if (!previous) seenSwap = request.id;
      previous = next;
    });
  });
</script>

{#snippet tank(value: number, ghost = false)}
  <svg viewBox="0 0 280 86" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="{uid}-tank-{ghost}" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#242b29"/><stop offset=".14" stop-color="#747b72"/><stop offset=".3" stop-color="#bac0b0"/>
        <stop offset=".42" stop-color="#7f897b"/><stop offset=".76" stop-color="#4d574c"/><stop offset="1" stop-color="#222c27"/>
      </linearGradient>
    </defs>
    <path d="M237 43h17q10 0 10 12v12h-20" stroke="#171e1a" stroke-width="7"/>
    <path d="M237 41h17q10 0 10 12v12" stroke="#646c59" stroke-width="2"/>
    <path d="M29 18h178q24 0 32 14v20q-8 15-32 15H29q-15-2-15-24t15-25Z" fill="url(#{uid}-tank-{ghost})" stroke="#18231d" stroke-width="1.5"/>
    <path d="M29 22h172M26 25h61M31 62h158" stroke="#c8c9b2" stroke-width=".8" opacity=".55"/>
    <ellipse cx="27" cy="43" rx="9" ry="23" fill="#485449" stroke="#929b83"/>
    <ellipse cx="27" cy="43" rx="5" ry="17" stroke="#29392b"/>
    <path d="M48 17h12v51H48Zm142 0h12v51h-12Z" fill="#303a2e" stroke="#90977b"/>
    <path d="M51 20v43m142-43v43" stroke="#76836b"/>
    {#each [54, 196] as x}<path d="M{x - 6} 35h12v15h-12Z" fill="#535c45" stroke="#1d2d21"/><circle cx={x} cy="39" r="1.7" fill="#c1bc98"/><path d="M{x - 2} 46h4" stroke="#202b1e"/>{/each}
    <path d="M237 34h12v19h-12Z" fill="#757660" stroke="#303a2c"/>
    <path d="M241 34v19m4-19v19" stroke="#353e2d"/>
    <path d="M245 29v-7m-7 0h15" stroke="#96947b" stroke-width="3"/>
    <!-- The only gas readout lives inside the vessel's protected inspection window. -->
    <rect x="74" y="31" width="98" height="26" rx="2" fill="#18251e" stroke="#b0af8d" stroke-width="1.2"/>
    {#each Array.from({ length: Math.max(1, full) }) as _, i}
      <rect x={79 + i * 64 / Math.max(1, full)} y="36" width={Math.max(1, 64 / Math.max(1, full) - 3)} height="16" fill={i < value ? '#b7bea1' : '#344737'} />
    {/each}
    <text x="156" y="48" text-anchor="middle" fill="#eee5c6" font-family="monospace" font-size="12">{value}</text>
    <path d="m91 24 8 1m31 37 11-1m70-5 8-2m-148 6 9-1m102-33 5-1" stroke="#bec0a6" stroke-width=".8" opacity=".5"/>
    <path d="M68 70h112" stroke="#0c1710" stroke-width="2" opacity=".35"/>
  </svg>
{/snippet}

{#snippet edge()}
  <path d="M79 27H252l18 10-18 12H79Z" fill="url(#{uid}-blade)" stroke="#3d4840"/>
  <path d="M84 46h168l14-9" stroke="#ecebd5" stroke-width="1.4"/>
  {#each [103, 127, 151, 175, 199, 223, 247] as x}<path d="m{x} 28-8 20" stroke="#4e5a4e" stroke-width=".9"/>{/each}
  <path d="M88 30h155" stroke="#bdc4b5" stroke-width=".7"/>
{/snippet}

{#key change.id}
<div bind:this={rig} tabindex="-1" class="odm-rig {kind} {change.type}" data-motion={mode} class:unavailable>
  <span class="rig-rivet top-left"></span><span class="rig-rivet top-right"></span>
  {#if kind === 'gas'}
    <div class="fitted-vessel" role="img" aria-label={t('WOF.Sheet.gas.level', { current: level, full })}>
      <div class="vessel-current">{@render tank(level)}</div>
      {#if change.type === 'tank-swap'}<div class="vessel-out rig-ghost">{@render tank(change.oldLevel, true)}</div>{/if}
      {#if change.type === 'gas-spend'}<svg class="gas-vent rig-ghost" viewBox="0 0 280 86" aria-hidden="true"><path d="m252 20 4-11m2 14 10-9m-17 3-3-10" stroke="#d2d4ba" stroke-width="2" fill="none"/></svg>{/if}
    </div>
    <div class="rig-caption"><span>{t('WOF.Sheet.gas.spareTanks')}</span><span>{spares.length}</span></div>
    <div class="tank-bay">
      {#each Array.from({ length: Math.max(3, spares.length) }) as _, i}
        <div class="tank-socket" class:returned={change.type === 'tank-swap' && change.oldLevel > 0 && i === spares.length - 1}>
          {#if change.type === 'tank-swap' && change.slot === i}<span class="cap-lift rig-ghost" aria-hidden="true">{level}</span>{/if}
          {#if i < spares.length}
            <button type="button" class="tank-cap" disabled={disabled} onclick={() => chooseTank(i)} aria-label={t('WOF.Sheet.gas.fitThis', { n: i + 1, current: spares[i], full })} title={t('WOF.Sheet.gas.fitThis', { n: i + 1, current: spares[i], full })}>
              <svg viewBox="0 0 60 60" fill="none" aria-hidden="true">
                <circle cx="30" cy="30" r="24" fill="#66715e" stroke="#171f18" stroke-width="3"/>
                <circle cx="30" cy="30" r="20" fill="#29372b" stroke="#99a080"/>
                {#each Array.from({ length: Math.max(1, full) }) as _, j}
                  <circle cx="30" cy="30" r="16" pathLength="100" stroke={j < spares[i] ? '#c3c9a5' : '#45573e'} stroke-width="4" stroke-dasharray="{Math.max(1, 100 / Math.max(1, full) - 4)} 100" transform="rotate({-90 + j * 360 / Math.max(1, full)} 30 30)"/>
                {/each}
                <path d="M19 25h22v11H19Z" fill="#5b6250" stroke="#a5a487"/>
                <text x="30" y="34" text-anchor="middle" font-family="monospace" font-size="11" fill="#f4ead0">{spares[i]}</text>
                <path d="M28 8h4m-4 44h4" stroke="#c0baa0"/>
              </svg>
            </button>
          {:else}<span class="empty-socket" aria-hidden="true"></span>{/if}
        </div>
      {/each}
    </div>
    {#if !spares.length}<span class="rig-empty-note">{t('WOF.Sheet.gas.noSpare')}</span>{/if}
  {:else}
    <div class="blade-assembly" role="img" aria-label={t(fitted ? 'WOF.Sheet.blades.hand' : 'WOF.Sheet.blades.handEmpty')}>
      <svg viewBox="0 0 280 80" fill="none" aria-hidden="true">
        <defs><linearGradient id="{uid}-blade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#565e57"/><stop offset=".28" stop-color="#a8b0a2"/><stop offset=".65" stop-color="#899485"/><stop offset=".8" stop-color="#d2d6c1"/><stop offset="1" stop-color="#737e6e"/></linearGradient></defs>
        {#if fitted}<g class="live-blade">{@render edge()}</g>{/if}
        {#if change.type === 'blade-break'}
          <defs><clipPath id="{uid}-break-a"><path d="M79 20h64l-12 14 8 4-12 18H79Z"/></clipPath><clipPath id="{uid}-break-b"><path d="M143 20h140v36H127l12-18-8-4Z"/></clipPath></defs>
          <g class="broken-blade fragment-a rig-ghost"><g clip-path="url(#{uid}-break-a)">{@render edge()}</g></g>
          <g class="broken-blade fragment-b rig-ghost"><g clip-path="url(#{uid}-break-b)">{@render edge()}</g></g>
        {/if}
        <path d="M74 28h12v19H74Z" fill="#414d40" stroke="#151e17"/><path d="M80 31h6v12h-6" stroke="#8b947f"/>
        <!-- Trigger grip remains bolted in place after the blade is lost. -->
        <path d="M17 27h58v20H59l-9 22H24l7-23H17Z" fill="#69715f" stroke="#1b251c" stroke-width="1.5"/>
        <path d="M20 29h52v6H20Z" fill="#939a83"/><path d="M29 49h24l-7 17H25Z" fill="#383a2e" stroke="#a09673"/>
        <path d="m31 52 17 0m-19 5h17m-19 5h17" stroke="#797357" stroke-width="2"/>
        <path d="M58 46h13l-8 19H51" stroke="#a5aa90" stroke-width="3"/><path d="m61 48-4 9" stroke="#222e20" stroke-width="2"/>
        <path d="M18 36H9v17l10 6" stroke="#303c2a" stroke-width="3"/>
        <circle cx="24" cy="40" r="3" fill="#c2b995" stroke="#303929"/><path d="m22 40 4 0" stroke="#414833"/>
        <path d="M67 26v-5h11v6" fill="#444e3b" stroke="#9da187"/>
      </svg>
    </div>
    <div class="rig-caption"><span>{t('WOF.Sheet.blades.stored')}</span><span>{carried}</span></div>
    <div class="blade-magazine" role="img" aria-label={`${t('WOF.Sheet.blades.stored')}: ${carried}`}>
      <svg viewBox="0 0 280 66" fill="none" aria-hidden="true">
        <path d="M17 14 30 6h185l-11 9v42H17Z" fill="#58614d" stroke="#172219"/>
        <path d="M17 14h187v43H17Z" fill="#3a4734" stroke="#899178"/>
        <path d="m204 15 11-9v40l-11 11Z" fill="#263524" stroke="#707a5d"/>
        {#each [0, 1, 2] as slot}
          <path d="M26 {23 + slot * 11}h174" stroke="#152617" stroke-width="5"/>
          <path d="M28 {20 + slot * 11}h169" stroke="#727d60" stroke-width="1"/>
          {#if slot < carried}<path d="M30 {21 + slot * 11}h211l12 3-12 3H30Z" fill="url(#{uid}-blade)" stroke="#8b947b" stroke-width=".7"/>{/if}
        {/each}
        <path d="M51 12h10v46H51Zm121 0h10v46h-10Z" fill="#303727" stroke="#919175"/>
        {#each [56, 177] as x}<circle cx={x} cy="18" r="2" fill="#bbb18b"/><circle cx={x} cy="52" r="2" fill="#bbb18b"/>{/each}
        <path d="M23 58h169" stroke="#162616" stroke-width="3"/>
      </svg>
      {#if change.type === 'blade-fit'}<svg class="magazine-transfer rig-ghost" viewBox="0 0 280 80" fill="none" aria-hidden="true">{@render edge()}</svg>{/if}
    </div>
  {/if}
  <span class="rig-rivet bottom-left"></span><span class="rig-rivet bottom-right"></span>
</div>
{/key}

