<script lang="ts">
  /**
   * The Blade Sets instrument on the band (sheet-overhaul plan, 5.2; the preview's "1 Instrument"):
   * the ODM trigger handle with its segmented blade, in two pieces so a ruined one can snap, and a
   * leather scabbard of the stored sets. The drawing is not clickable; the scabbard fits a set.
   */
  import { tick, untrack } from 'svelte';
  import { clickMarks, settled, slideHome, snap, thud } from '../../motion/fx.ts';
  import { motionMode } from '../../settings.svelte.ts';
  import { tooltip } from '../actions.ts';
  import { t } from '../context.ts';
  import { bladeChange, type BladeChange, type BladeSnapshot } from '../instrument.ts';

  let {
    inHand = null,
    stored = 0,
    disabled = false,
    onswap = () => {},
  }: {
    /** The Gear Dice of the Blade Set in the handles, or null when they are empty. */
    inHand?: number | null;
    stored?: number;
    disabled?: boolean;
    onswap?: () => unknown;
  } = $props();

  const uid = $props.id();
  const ref = (name: string) => `url(#${uid}-${name})`;
  const BR = ref('brass');
  const BRL = '#5e4520';
  const BLADE = ['#8e989e', '#f7fafa', '#b3bcc1', '#7d878d', '#dfe5e7'];
  const BLADE_AT = [0, 0.18, 0.5, 0.78, 1];
  /** The blade's two pieces: the base stays in the handle, the tip snaps off a ruined set. */
  const PIECES = [
    { cls: 'bs', d: 'M29.6 12.2H83L87 17.6H29.6Z', xs: [40, 51, 62, 73], edge: 'M30 16.8H86.2' },
    { cls: 'pt', d: 'M83 12.2H111.5L118.5 17.6H87Z', xs: [94, 105], edge: 'M86.6 16.8H117.4' },
  ];
  const scores = (xs: number[], dx = 0) => xs.map((x) => `M${x + dx} 12.2L${x + dx + 4} 17.6`).join('');

  const mode = $derived(motionMode());
  const has = $derived(inHand !== null);
  const canSwap = $derived(stored > 0 && !has);
  /** Up to three blade edges stand out of the scabbard, each a little taller than the last. */
  const edges = $derived(
    Array.from({ length: Math.min(Math.max(0, stored), 3) }, (_, i) => {
      const x = +(6.2 + i * 4.2).toFixed(2);
      const lift = i * 0.8;
      const y = (n: number) => +(n - lift).toFixed(2);
      return { body: `M${x} 13V${y(4.4)}L${+(x + 3).toFixed(2)} ${y(2.4)}V13Z`, score: `M${x} ${y(8.4)}L${+(x + 3).toFixed(2)} ${y(7)}` };
    }),
  );
  const bladeTip = $derived(
    inHand === null
      ? t('WOF.Sheet.blades.emptyTip')
      : inHand === 1
        ? t('WOF.Sheet.blades.inHandTipOne')
        : t('WOF.Sheet.blades.inHandTip', { dice: inHand }),
  );
  const storedLabel = $derived(t('WOF.Sheet.blades.storedCount', { n: stored }));
  const scabTip = $derived(
    !canSwap ? storedLabel : stored === 1 ? t('WOF.Sheet.blades.storedTipOne') : t('WOF.Sheet.blades.storedTip', { n: stored }),
  );

  let root: HTMLElement | undefined = $state();
  let clk: SVGPathElement | undefined = $state();
  /** Parts that come and go with the data are looked up when they are needed, not bound. */
  const part = <T extends Element>(selector: string) => root?.querySelector<T>(selector) ?? null;

  /** The ruined blade, drawn from the last snapshot while it snaps; keyed to the change. */
  let ghost: { id: number } | null = $state(null);
  let previous: BladeSnapshot | undefined;
  let serial = 0;

  $effect(() => {
    const next: BladeSnapshot = { inHand, stored, mode };
    untrack(() => {
      const prev = previous;
      previous = next;
      if (prev && prev.mode !== next.mode) {
        serial++;
        ghost = null;
        return;
      }
      const kind = bladeChange(prev, next);
      if (kind) play(kind);
    });
  });
  $effect(() => () => {
    serial++;
  });

  async function play(kind: BladeChange) {
    const id = ++serial;
    if (mode === 'off') {
      ghost = null;
      return;
    }
    if (kind === 'fit') {
      ghost = null;
      await tick();
      if (id !== serial) return;
      await settled([slideHome(part('.bl-inst > .blad'), { dx: 26, overshoot: 1, fromOpacity: 0, duration: 260 }), clickMarks(clk)], 260);
      return;
    }
    // Ruin: hold the Empty stamp back until the ghost has snapped, then stamp it.
    const full = mode === 'full';
    const stamp = part<HTMLElement>('.blade-stamp');
    if (full && stamp) stamp.style.opacity = '0';
    ghost = { id };
    try {
      await tick();
      const g = part('.bl-inst > .ghost');
      if (id !== serial || !g) return;
      await settled(snap({ ghost: g, tip: g.querySelector('.pt'), base: g.querySelector('.bs'), spark: g.querySelector('.spk') }), 260);
      if (id !== serial) return;
      ghost = null;
      if (full && stamp?.isConnected) await settled([thud(stamp)], 220);
    } finally {
      stamp?.style.removeProperty('opacity');
      if (ghost?.id === id) ghost = null;
    }
  }

  function swap() {
    if (disabled || !canSwap) return;
    onswap();
  }
</script>

{#snippet blade()}
  {#each PIECES as p (p.cls)}
    <g class={p.cls}>
      <path d={p.d} fill={ref('blade')} stroke="#3a4046" stroke-width=".45" />
      <path d={scores(p.xs)} stroke="#59636a" stroke-width=".5" />
      <path d={scores(p.xs, 0.7)} stroke="#fff" stroke-opacity=".55" stroke-width=".35" />
      <path d={p.edge} stroke="#f4f8f8" stroke-opacity=".85" stroke-width=".6" />
    </g>
  {/each}
{/snippet}

<div class="wof-inst blade-inst" class:disabled data-motion={mode} bind:this={root}>
  <svg class="inst-defs" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="{uid}-brass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f3d99a" /><stop offset=".28" stop-color="#d8b166" /><stop offset=".62" stop-color="#a47c3a" /><stop offset="1" stop-color="#5e4520" />
      </linearGradient>
      <linearGradient id="{uid}-iron" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5b6268" /><stop offset=".35" stop-color="#3a3f44" /><stop offset="1" stop-color="#15181a" />
      </linearGradient>
      <linearGradient id="{uid}-blade" x1="0" y1="0" x2="0" y2="1">
        {#each BLADE as c, i}<stop offset={BLADE_AT[i]} stop-color={c} />{/each}
      </linearGradient>
      <linearGradient id="{uid}-blade-h" x1="0" y1="0" x2="1" y2="0">
        {#each BLADE as c, i}<stop offset={BLADE_AT[i]} stop-color={c} />{/each}
      </linearGradient>
      <linearGradient id="{uid}-sheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0" /><stop offset=".5" stop-color="#fff" stop-opacity=".9" /><stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="{uid}-leather" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6a4630" /><stop offset=".5" stop-color="#4a3020" /><stop offset="1" stop-color="#26170c" />
      </linearGradient>
      <clipPath id="{uid}-blade-clip"><path d="M29.6 12.2H111.5L118.5 17.6H29.6Z" /></clipPath>
    </defs>
  </svg>

  <span class="bl-wrap" class:empty={!has} role="img" aria-label={t(has ? 'WOF.Sheet.blades.hand' : 'WOF.Sheet.blades.handEmpty')} use:tooltip={bladeTip}>
    <svg class="obj bl-inst" viewBox="0 0 120 30" aria-hidden="true" focusable="false">
      <!-- The trigger handle: leather grip, brass trigger, iron body. -->
      <path d="M8 26.8L11.2 17H16.8L14.6 27.6a1.6 1.6 0 0 1-1.6 1.2H9.4a1.4 1.4 0 0 1-1.4-2z" fill={ref('leather')} stroke="#1e120a" stroke-width=".6" />
      <path d="M10.4 19.8l5.6.9M9.7 22.2l5.6.9M9 24.6l5.6.9" stroke="#e6c48a" stroke-opacity=".4" stroke-width=".5" />
      <path d="M17 17.4c3.8.6 5.2 2.6 4.6 5.2c-.5 2.2-3 3-6.2 2.8" fill="none" stroke="#2a2e31" stroke-width="1" />
      <path d="M18.2 17.4c.8 1.8.5 3.6-1 4.8" fill="none" stroke="#b9924a" stroke-width="1.3" stroke-linecap="round" />
      <path d="M3.5 10H24l3.5 1.6v6L24 18.8H3.5a2.2 2.2 0 0 1-2.2-2.2v-4.4A2.2 2.2 0 0 1 3.5 10z" fill={ref('iron')} stroke="#111416" stroke-width=".6" />
      <path d="M4 11.2H23.6" stroke="#fff" stroke-opacity=".3" stroke-width=".7" stroke-linecap="round" />
      <rect x="7" y="7.6" width="13" height="2.6" rx="1.3" fill={BR} stroke={BRL} stroke-width=".4" />
      <circle cx="8.6" cy="8.9" r=".75" fill={BRL} />
      <circle cx="5.2" cy="14.4" r="1.1" fill={BR} stroke={BRL} stroke-width=".3" />
      <rect x="25.6" y="11" width="4" height="7.8" rx="1" fill={BR} stroke={BRL} stroke-width=".4" />
      <rect x="29.2" y="12.6" width="2" height="4.4" fill="#0c0e10" />
      {#if has}
        <g class="blad">
          {@render blade()}
          <g clip-path={ref('blade-clip')}>
            <g class="sheen"><rect x="-6" y="4" width="9" height="22" fill={ref('sheen')} transform="skewX(-22)" /></g>
          </g>
        </g>
      {:else}
        <path d="M29.6 12.2H111.5L118.5 17.6H29.6Z" fill="none" stroke="#665b4f" stroke-width=".6" stroke-dasharray="2 1.6" />
      {/if}
      {#if ghost}
        <g class="ghost">
          <g class="blad">{@render blade()}</g>
          <g class="spk">
            <path d="M85 15l-3-3M85 15l3.2-2.6M85 15l2.6 3M85 15l-2.8 2.8M85 15v-4" stroke="#ffe39a" stroke-width=".7" stroke-linecap="round" />
            <circle cx="85" cy="15" r="1.3" fill="#fff8dc" />
          </g>
        </g>
      {/if}
      <path class="clk" d="M26.4 8.6l-.8-2.1M28.4 8.2l.4-2.2M30.6 9.2l1.5-1.4" bind:this={clk} />
    </svg>
    {#if !has}<span class="ins-stamp blade-stamp" aria-hidden="true">{t('WOF.Sheet.blades.handEmpty')}</span>{/if}
  </span>

  <button
    type="button"
    class="scab"
    class:none={stored <= 0}
    {disabled}
    aria-disabled={canSwap ? undefined : 'true'}
    aria-label={storedLabel}
    use:tooltip={scabTip}
    onclick={swap}
  >
    <svg viewBox="0 0 24 30" aria-hidden="true" focusable="false">
      {#each edges as e, i (i)}
        <path d={e.body} fill={ref('blade-h')} stroke="#3a4046" stroke-width=".4" />
        <path d={e.score} stroke="#59636a" stroke-width=".4" />
      {/each}
      <rect x="2" y="8" width="20" height="21" rx="2.4" fill={ref('leather')} stroke="#1e120a" stroke-width=".6" />
      <rect x="3.7" y="10.8" width="16.6" height="16.5" rx="1.4" fill="none" stroke="#e6c48a" stroke-opacity=".55" stroke-width=".45" stroke-dasharray="1.2 .9" />
      <rect x="1.4" y="7" width="21.2" height="3.4" rx="1" fill={BR} stroke={BRL} stroke-width=".4" />
      <rect x="7.5" y="14.4" width="9" height="8.6" rx="1.2" fill={BR} stroke={BRL} stroke-width=".4" />
      <circle cx="4.8" cy="26.4" r=".9" fill={BR} /><circle cx="19.2" cy="26.4" r=".9" fill={BR} />
    </svg>
    <span class="scab-n" aria-hidden="true">{stored}</span>
  </button>
</div>
