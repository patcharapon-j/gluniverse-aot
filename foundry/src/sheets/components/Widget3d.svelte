<script lang="ts" generics="K extends 'gas' | 'blades'">
  /**
   * One vitals widget (core-plan 2e): the shared three.js renderer paints into this canvas when the
   * values change; Motion Off or a client without WebGL shows the static drawing instead.
   */
  import { onDestroy } from 'svelte';
  import type { Snippet } from 'svelte';
  import { mountWidget, WIDGET_SIZE, type BladeState, type GasState, type WidgetHandle } from '../../motion/widgets.ts';
  import { viewer } from '../../settings.svelte.ts';

  type State = K extends 'gas' ? GasState : BladeState;
  let { kind, values, still }: { kind: K; values: State; still: Snippet } = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let failed = $state(false);
  let handle: WidgetHandle<K> | null = null;
  const off = $derived(viewer.motion === 'off' || failed);
  const size = $derived(WIDGET_SIZE[kind]);

  function release() {
    handle?.destroy();
    handle = null;
  }

  // Mount while the canvas exists and motion is on; release when motion is switched off.
  $effect(() => {
    if (off || !canvas) {
      release();
      return;
    }
    if (!handle) {
      handle = mountWidget(kind, canvas, $state.snapshot(values) as never, () => (failed = true));
      if (!handle) failed = true;
    }
  });

  // Each change of the values repaints (and animates) once.
  $effect(() => {
    const next = $state.snapshot(values) as never;
    handle?.update(next);
  });

  onDestroy(release);
</script>

{#if off}
  <div class="still" data-widget={kind} aria-hidden="true" style:width="{size.w}px" style:height="{size.h}px">{@render still()}</div>
{:else}
  <canvas bind:this={canvas} class="w3d" data-widget={kind} aria-hidden="true" style:width="{size.w}px" style:height="{size.h}px"></canvas>
{/if}
