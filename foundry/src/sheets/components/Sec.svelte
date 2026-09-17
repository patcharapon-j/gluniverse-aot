<script lang="ts">
  import type { Snippet } from 'svelte';
  /** The section rule: §n Title ──── hint [actions]. */
  let { n, title, hint = '', actions }: { n: string | number; title: string; hint?: string; actions?: Snippet } = $props();
</script>

<h3 class="sec"><span class="n">§{n}</span>{title}{#if hint}<span class="hint">{hint}</span>{/if}{#if actions}<span class="sec-act">{@render actions()}</span>{/if}</h3>
