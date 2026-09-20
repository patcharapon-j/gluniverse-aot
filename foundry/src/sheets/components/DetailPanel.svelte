<script lang="ts">
  /**
   * One open hover card (detail.ts): the full text of a Talent or an action, placed beside the row
   * it belongs to. The card takes the pointer, so it can be read and its references followed; a
   * reference raises the next card one layer deeper.
   */
  import { detailHover } from '../actions.ts';
  import { t } from '../context.ts';
  import { placeCard } from '../detail.ts';
  import type { HoverCards, HoverLayer } from '../hover.svelte.ts';

  let { layer, hover }: { layer: HoverLayer; hover: HoverCards } = $props();

  let el: HTMLElement | undefined = $state();
  const card = $derived(layer.card);

  // Placed once it holds its text, so the box measured is the box placed.
  $effect(() => {
    const node = el;
    const anchor = layer.anchor;
    if (!node || !card) return;
    node.style.left = '0px';
    node.style.top = '0px';
    const box = node.getBoundingClientRect();
    const p = placeCard(anchor, { width: box.width, height: box.height }, { width: window.innerWidth, height: window.innerHeight });
    node.style.left = `${Math.round(p.left)}px`;
    node.style.top = `${Math.round(p.top)}px`;
    node.dataset.side = p.side;
  });
</script>

<div
  class="dt-card"
  bind:this={el}
  id="{hover.uid}-{layer.depth}"
  data-kind={card.kind}
  data-depth={layer.depth}
  class:blocked={!!card.blocked}
  role="note"
  onpointerenter={() => hover.enter(layer.depth)}
  onpointerleave={() => hover.leave(layer.depth)}
  onpointerdown={() => hover.hide()}
>
  <div class="dt-h">
    <img class="dt-ic" src={card.icon} alt="" />
    <span class="dt-nm">
      <span class="dt-kicker">{card.kicker}</span>
      <strong>{card.title}</strong>
    </span>
    {#if card.stamp}<span class="dt-stamp">{card.stamp}</span>{/if}
  </div>
  {#if card.blocked}<p class="dt-blocked">{card.blocked}</p>{/if}
  {#each card.lead as line, i (i)}<p class="dt-lead">{line}</p>{/each}
  {#each card.sections as s (s.label)}
    <div class="dt-sec">
      <span class="dt-lbl">{s.label}</span>
      <div class="dt-lines">{#each s.lines as line, i (i)}<span>{line}</span>{/each}</div>
    </div>
  {/each}
  {#if card.refs.length}
    <div class="dt-sec">
      <span class="dt-lbl">{card.refsLabel}</span>
      <div class="dt-refs">
        {#each card.refs as r (r.id)}
          <button type="button" class="dt-ref" class:plain={!r.card} use:detailHover={{ hover, depth: layer.depth + 1, card: () => r.card }}>
            <img src={r.icon} alt="" />
            <span>{r.name}{#if r.note}<em>{r.note}</em>{/if}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
  {#if card.foot && !card.blocked}<p class="dt-foot">{card.foot}</p>{/if}
  {#if card.refs.some((r) => r.card)}<p class="dt-hint">{t('WOF.Sheet.detail.refHint')}</p>{/if}
</div>
