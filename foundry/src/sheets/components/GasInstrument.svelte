<script lang="ts">
  /**
   * The Gas instrument on the band (sheet-overhaul plan, 5.2; the preview's "1 Instrument"): the
   * fitted canister side on, with its gauge window and pressure dial, and the spares upright on a
   * leather strap. The canister is a pointer shortcut for Spend 1; each spare fits on click.
   */
  import { tick, untrack } from 'svelte';
  import { clickMarks, drain, puff, rackIn, settled, slideHome, swing } from '../../motion/fx.ts';
  import { motionMode } from '../../settings.svelte.ts';
  import { tooltip } from '../actions.ts';
  import { t } from '../context.ts';
  import {
    DIAL,
    GAS_STAMP_KEY,
    RACK_ROOM,
    dialFace,
    gasChange,
    gaugeBands,
    needleAngle,
    spareBands,
    sparesShown,
    type Band,
    type GasChange,
    type GasSnapshot,
    type GasStamp,
  } from '../instrument.ts';

  let {
    level = 0,
    full = 3,
    spares = [],
    stamp = null,
    disabled = false,
    swapEvent = { id: 0, index: -1, oldLevel: 0 },
    onspend = () => {},
    onfit = (_: number) => {},
    onmore,
  }: {
    level?: number;
    full?: number;
    spares?: readonly number[];
    stamp?: GasStamp | null;
    disabled?: boolean;
    /** Bumped by the band after this viewer's own Change or spare fit (see Vitals, swapTank). */
    swapEvent?: { id: number; index: number; oldLevel: number };
    onspend?: () => unknown;
    onfit?: (index: number) => unknown;
    /** Opens the Kit page, where the spares past the rack's room are listed. */
    onmore?: () => void;
  } = $props();

  const uid = $props.id();
  const ref = (name: string) => `url(#${uid}-${name})`;
  const BR = ref('brass');
  const BRL = '#5e4520';
  const INK = '#241f1b';
  const { cx, cy } = DIAL;
  const face = dialFace(cx, cy);
  const STEEL = ['#586066', '#b9c1c6', '#f1f4f5', '#9aa3a9', '#555d63', '#6d767c', '#2c3135'];
  const STEEL_AT = [0, 0.16, 0.3, 0.48, 0.78, 0.92, 1];

  const mode = $derived(motionMode());
  const bands = $derived(gaugeBands(level, full));
  const angle = $derived(needleAngle(level, full));
  const wide = $derived(sparesShown(spares, RACK_ROOM.wide));
  const narrow = $derived(sparesShown(spares, RACK_ROOM.narrow));
  const levelLabel = $derived(t('WOF.Sheet.gas.level', { current: level, full }));
  const stampText = $derived(stamp ? t(GAS_STAMP_KEY[stamp]) : '');
  const canTip = $derived(level > 0 ? t('WOF.Sheet.gas.spendTip', { current: level, full }) : t('WOF.Sheet.gas.dryTip'));

  let root: HTMLElement | undefined = $state();
  let canArt: SVGSVGElement | undefined = $state();
  let gauge: SVGGElement | undefined = $state();
  let needle: SVGGElement | undefined = $state();
  let hiss: SVGGElement | undefined = $state();
  let clk: SVGPathElement | undefined = $state();

  /** The bands a spend emptied, drawn over the new state while they drain; keyed to the change. */
  let ghost: { id: number; bands: Band[] } | null = $state(null);

  let previous: GasSnapshot | undefined;
  let seenSwap: number | undefined;
  let serial = 0;
  let lastSwapAt = -Infinity;
  let pending: number | undefined;
  /** A swap request within this long of a swap read from the data is the same swap. */
  const SWAP_WINDOW = 800;
  /** How long a request waits for its update before it plays on the data as it stands. */
  const SWAP_WAIT = 400;

  $effect(() => {
    const next: GasSnapshot = { level, spares: [...spares], mode };
    const request = swapEvent;
    untrack(() => {
      const prev = previous;
      previous = next;
      let requested = false;
      if (seenSwap === undefined) seenSwap = request.id;
      else if (request.id !== seenSwap) {
        seenSwap = request.id;
        requested = performance.now() - lastSwapAt > SWAP_WINDOW;
      }
      if (prev && prev.mode !== next.mode) return reset();
      const byData = gasChange(prev, next);
      if (byData || pending !== undefined) {
        const kind = pending !== undefined ? 'swap' : byData;
        window.clearTimeout(pending);
        pending = undefined;
        if (kind && prev) play(kind, prev.level, next.level);
      } else if (requested) {
        // Fitting a spare at the level already fitted changes nothing the data can show.
        const oldLevel = request.oldLevel;
        pending = window.setTimeout(() => {
          pending = undefined;
          play('swap', oldLevel, level);
        }, SWAP_WAIT);
      }
    });
  });
  $effect(() => () => reset());

  function reset() {
    serial++;
    ghost = null;
    window.clearTimeout(pending);
    pending = undefined;
  }

  async function play(kind: GasChange, from: number, to: number) {
    const id = ++serial;
    if (kind === 'swap') lastSwapAt = performance.now();
    if (mode === 'off') {
      ghost = null;
      return;
    }
    ghost = kind === 'spend' && mode === 'full' ? { id, bands: gaugeBands(from, full).filter((b, i) => b.on && i >= to) } : null;
    await tick();
    if (id !== serial || !root) return;
    const a0 = needleAngle(from, full);
    const a1 = needleAngle(to, full);
    const anims = [swing(needle, a0, a1)];
    if (kind === 'spend') {
      anims.push(drain([...root.querySelectorAll('.drain')], gauge), puff(hiss));
    } else if (kind === 'swap') {
      anims.push(slideHome(canArt), clickMarks(clk));
      // The old canister, if it held gas, went back to the end of the rack.
      if (from > 0) anims.push(rackIn(root.querySelector(`.gsp[data-index="${spares.length - 1}"]`)));
    }
    await settled(anims, 300);
    if (id !== serial) return;
    ghost = null;
    if (needle) needle.style.transform = `rotate(${needleAngle(level, full)}deg)`;
  }

  function spend() {
    if (disabled || level <= 0) return;
    onspend();
  }

  async function chooseTank(index: number) {
    if (disabled) return;
    await onfit(index);
    await tick();
    const next = root?.querySelectorAll<HTMLButtonElement>('.gsp');
    if (next?.length) next[Math.min(index, next.length - 1)].focus({ preventScroll: true });
    else root?.focus({ preventScroll: true });
  }
</script>

<div class="wof-inst gas-inst" class:disabled class:no-odm={stamp === 'noOdm'} data-motion={mode} tabindex="-1" bind:this={root}>
  <svg class="inst-defs" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="{uid}-steel" x1="0" y1="0" x2="0" y2="1">
        {#each STEEL as c, i}<stop offset={STEEL_AT[i]} stop-color={c} />{/each}
      </linearGradient>
      <linearGradient id="{uid}-steel-h" x1="0" y1="0" x2="1" y2="0">
        {#each STEEL as c, i}<stop offset={STEEL_AT[i]} stop-color={c} />{/each}
      </linearGradient>
      <linearGradient id="{uid}-brass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f3d99a" /><stop offset=".28" stop-color="#d8b166" /><stop offset=".62" stop-color="#a47c3a" /><stop offset="1" stop-color="#5e4520" />
      </linearGradient>
      <linearGradient id="{uid}-iron" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5b6268" /><stop offset=".35" stop-color="#3a3f44" /><stop offset="1" stop-color="#15181a" />
      </linearGradient>
      <linearGradient id="{uid}-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0f11" /><stop offset="1" stop-color="#1f282c" /></linearGradient>
      <linearGradient id="{uid}-gas" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" /><stop offset=".45" stop-color="#d6ecec" /><stop offset="1" stop-color="#94babd" />
      </linearGradient>
      <linearGradient id="{uid}-gas-h" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#94babd" /><stop offset=".45" stop-color="#f4fbfb" /><stop offset="1" stop-color="#94babd" />
      </linearGradient>
      <linearGradient id="{uid}-sheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0" /><stop offset=".5" stop-color="#fff" stop-opacity=".9" /><stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <radialGradient id="{uid}-dial" cx=".42" cy=".38" r=".75"><stop offset="0" stop-color="#fdf9ef" /><stop offset="1" stop-color="#d9cba9" /></radialGradient>
      <filter id="{uid}-glow" x="-30%" y="-60%" width="160%" height="220%">
        <feGaussianBlur stdDeviation=".7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="{uid}-puff" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation=".7" /></filter>
      <clipPath id="{uid}-can"><rect x="10" y="9" width="78" height="19" rx="6" /></clipPath>
    </defs>
  </svg>

  <span class="can-wrap">
    <button
      type="button"
      class="can-btn"
      tabindex="-1"
      {disabled}
      aria-disabled={level <= 0 ? 'true' : undefined}
      aria-label={[levelLabel, stampText].filter(Boolean).join('. ')}
      use:tooltip={canTip}
      onclick={spend}
    >
      <svg class="obj can-i" viewBox="0 0 100 30" aria-hidden="true" focusable="false" bind:this={canArt}>
        <rect x=".6" y="15.4" width="6" height="6.2" rx="1" fill={BR} stroke={BRL} stroke-width=".4" />
        <path d="M2.2 15.8v5.4M3.6 15.8v5.4M5 15.8v5.4" stroke={BRL} stroke-opacity=".7" stroke-width=".4" />
        <rect x="10" y="9" width="78" height="19" rx="6" fill={ref('steel')} stroke="#1f2225" stroke-width=".6" />
        <path d="M66.5 9.3v18.4" stroke="#1f2225" stroke-opacity=".35" stroke-width=".5" />
        <path d="M67.1 9.3v18.4" stroke="#fff" stroke-opacity=".25" stroke-width=".5" />
        <rect x="5" y="10" width="7.5" height="17" rx="1.6" fill={BR} stroke={BRL} stroke-width=".5" />
        <path d="M7.4 10.4v16.2M9.8 10.4v16.2" stroke={BRL} stroke-opacity=".45" stroke-width=".45" />
        <rect x="84" y="10" width="9.5" height="17" rx="4" fill={BR} stroke={BRL} stroke-width=".5" />
        <path d="M86.6 10.4v16.2" stroke={BRL} stroke-opacity=".45" stroke-width=".45" />
        <rect x="92.6" y="15" width="3" height="7" rx="1" fill={ref('iron')} stroke="#111" stroke-width=".4" />
        <g class="gauge" bind:this={gauge}>
          <rect x="16" y="13.5" width="45" height="10" rx="2" fill={BR} stroke={BRL} stroke-width=".5" />
          <rect x="17.3" y="14.8" width="42.4" height="7.4" rx="1" fill={ref('glass')} />
          {#each bands as b, i (i)}
            {#if b.on}
              <rect x={b.x} y={b.y} width={b.width} height={b.height} rx=".8" fill={ref('gas')} filter={ref('glow')} />
            {:else}
              <rect x={b.x} y={b.y} width={b.width} height={b.height} rx=".8" fill="#1b2226" />
            {/if}
          {/each}
          {#if ghost}
            {#each ghost.bands as b, i (i)}
              <rect class="drain" x={b.x} y={b.y} width={b.width} height={b.height} rx=".8" fill={ref('gas')} filter={ref('glow')} />
            {/each}
          {/if}
          <rect x="17.8" y="15.2" width="41.4" height="1.4" rx=".7" fill="#fff" opacity=".3" />
        </g>
        <g clip-path={ref('can')}>
          <g class="sheen"><rect x="-6" y="6" width="10" height="26" fill={ref('sheen')} opacity=".7" transform="skewX(-18)" /></g>
        </g>
        <!-- The pressure dial: the red arc marks the empty end; the needle reads the level. -->
        <g>
          <rect x={cx - 1.6} y={cy + 6} width="3.2" height="3.4" fill={BR} stroke={BRL} stroke-width=".4" />
          <circle {cx} {cy} r="8" fill={BR} stroke={BRL} stroke-width=".5" />
          <circle {cx} {cy} r="6.5" fill={ref('dial')} stroke="#3a2c16" stroke-width=".4" />
          <path d={face.arc} fill="none" stroke="#8e2323" stroke-width="1.2" />
          <path d={face.major} stroke={INK} stroke-width=".6" />
          <path d={face.minor} stroke={INK} stroke-width=".35" />
          <g class="needle" style:transform="rotate({angle}deg)" style:transform-origin="{cx}px {cy}px" bind:this={needle}>
            <path d="M{cx - 0.6} {cy + 1.4}L{cx} {cy - 5.7}L{cx + 0.6} {cy + 1.4}Z" fill="#8e2323" />
          </g>
          <circle {cx} {cy} r="1.1" fill={ref('iron')} />
          <path d="M{cx - 4.7} {cy - 2.3}A5.3 5.3 0 0 1 {cx + 1.6} {cy - 5.2}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width=".7" stroke-linecap="round" />
        </g>
        <path class="clk" d="M4.4 8.4l-1.2-2M7.6 7.8V5.6M10.8 8.4l1.2-2" bind:this={clk} />
        <g class="hiss" filter={ref('puff')} bind:this={hiss}>
          <circle cx="-1" cy="18.4" r="2.2" /><circle cx="-4" cy="16.8" r="2.8" /><circle cx="-3.4" cy="20.6" r="1.8" />
        </g>
      </svg>
    </button>
    {#if stamp}<span class="ins-stamp gas-stamp" aria-hidden="true">{stampText}</span>{/if}
  </span>

  <span class="spares" class:rack={spares.length > 0}>
    {#each wide.shown as s (s.index)}
      {@const tip = t('WOF.Sheet.gas.fitThis', { n: s.index + 1, current: s.level, full })}
      <button type="button" class="gsp" class:beyond-narrow={s.index >= RACK_ROOM.narrow} data-index={s.index} {disabled} aria-label={tip} use:tooltip={tip} onclick={() => chooseTank(s.index)}>
        <svg viewBox="0 0 11 28" aria-hidden="true" focusable="false">
          <rect x="4" y=".4" width="3" height="2.4" rx=".5" fill={BR} stroke={BRL} stroke-width=".4" />
          <rect x="1" y="2.4" width="9" height="3.6" rx="1.2" fill={BR} stroke={BRL} stroke-width=".4" />
          <rect x="1.6" y="5.4" width="7.8" height="19.4" rx="2.4" fill={ref('steel-h')} stroke="#1f2225" stroke-width=".5" />
          <rect x="3.6" y="7.6" width="3.8" height="15" rx="1" fill="#141a1d" />
          {#each spareBands(s.level, full) as b, i (i)}
            {#if b.on}
              <rect x={b.x} y={b.y} width={b.width} height={b.height} rx=".4" fill={ref('gas-h')} filter={ref('glow')} />
            {:else}
              <rect x={b.x} y={b.y} width={b.width} height={b.height} rx=".4" fill="#1b2226" />
            {/if}
          {/each}
          <rect x="1.3" y="23.6" width="8.4" height="3.6" rx="1.2" fill={BR} stroke={BRL} stroke-width=".4" />
        </svg>
      </button>
    {/each}
    {#each [{ cls: 'wide', n: wide.more }, { cls: 'narrow', n: narrow.more }] as more (more.cls)}
      {#if more.n > 0}
        {@const tip = t('WOF.Sheet.gas.more', { n: more.n })}
        {#if onmore}
          <button type="button" class="more {more.cls}" aria-label={tip} use:tooltip={tip} onclick={() => onmore?.()}>{t('WOF.Sheet.gas.moreCount', { n: more.n })}</button>
        {:else}
          <span class="more {more.cls}" use:tooltip={tip}>{t('WOF.Sheet.gas.moreCount', { n: more.n })}</span>
        {/if}
      {/if}
    {/each}
    {#if !spares.length}<span class="note">{t('WOF.Sheet.gas.noSpare')}</span>{/if}
  </span>
</div>
