<script lang="ts">
  /** Dice as glyphs, grouped by kind: what you see is what you roll. */
  let { groups, size = '', label = '' }: { groups: { cls: string; n: number }[]; size?: '' | 'sm' | 'big'; label?: string } = $props();
  const shown = $derived(groups.filter((g) => g.n > 0));
</script>

<span class="dots {size}" role={label ? 'img' : undefined} aria-label={label || undefined}>
  {#each shown as g, gi (gi)}
    <span class="grp">
      {#each Array.from({ length: g.n }) as _, i (i)}<i class={g.cls}></i>{/each}
    </span>
  {/each}
</span>
