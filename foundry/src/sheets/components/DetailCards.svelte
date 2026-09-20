<script lang="ts">
  /**
   * The hover cards of one window (hover.svelte.ts), held at the end of the document: a sheet's own
   * edges, its scrolling panels and its container query would all clip a card drawn inside it.
   * The host carries the system's tokens, so a card away from the paper still looks like the paper.
   */
  import { motionMode } from '../../settings.svelte.ts';
  import type { HoverCards } from '../hover.svelte.ts';
  import DetailPanel from './DetailPanel.svelte';

  let { hover }: { hover: HoverCards } = $props();

  let el: HTMLElement | undefined = $state();

  $effect(() => {
    const node = el;
    if (!node) return;
    document.body.append(node);
    return () => node.remove();
  });

  // A card is placed where its row was: anything that moves the row closes it.
  $effect(() => {
    const close = () => hover.hide();
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      hover.hide();
    };
  });
</script>

<div class="wof-app wof-cards" bind:this={el} data-motion={motionMode()}>
  {#each hover.layers as layer (layer.depth)}
    <DetailPanel {layer} {hover} />
  {/each}
</div>
