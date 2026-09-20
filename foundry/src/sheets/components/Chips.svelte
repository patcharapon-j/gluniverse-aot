<script lang="ts">
  /** A list of named ids as removable chips, with a picker to add one. */
  import { detailHover } from '../actions.ts';
  import { hoverCards, t } from '../context.ts';
  import type { DetailCard } from '../detail.ts';

  let {
    items,
    options,
    label,
    disabled = false,
    onchange,
    card,
  }: {
    items: { id: string; name: string }[];
    options: { id: string; name: string }[];
    label: string;
    disabled?: boolean;
    onchange: (ids: string[]) => void;
    /** The hover card of what a chip names, where it has one (detail.ts). */
    card?: (id: string) => DetailCard | null;
  } = $props();

  const hover = hoverCards();

  let pick = $state('');
  const held = $derived(new Set(items.map((i) => i.id)));
  const ids = $derived(items.map((i) => i.id));
</script>

<span class="chips" role="group" aria-label={label}>
  {#each items as c (c.id)}
    <span class="chip" class:named={!!card} use:detailHover={{ hover, card: () => card?.(c.id) ?? null }}>
      {c.name}
      {#if !disabled}<button type="button" aria-label={t('WOF.ItemSheet.removeNamed', { name: c.name })} onclick={() => onchange(ids.filter((x) => x !== c.id))}>✕</button>{/if}
    </span>
  {:else}
    <span class="empty">{t('WOF.Sheet.none')}</span>
  {/each}
  {#if !disabled}
    <span class="adder">
      <select bind:value={pick} aria-label={t('WOF.ItemSheet.addTo', { label })}>
        <option value="">{t('WOF.ItemSheet.addTo', { label })}</option>
        {#each options.filter((o) => !held.has(o.id)) as o (o.id)}<option value={o.id}>{o.name}</option>{/each}
      </select>
      <button type="button" class="mini" disabled={!pick} onclick={() => { onchange([...ids, pick]); pick = ''; }}>{t('WOF.Sheet.add')}</button>
    </span>
  {/if}
</span>
