<script lang="ts">
  /** The website's step text: numbered steps, bullets, and paragraphs, with its bold kept. */
  import { rich } from './helpers.ts';

  type Block = { kind: 'ol' | 'ul' | 'p'; items: { text: string; sub: string[] }[]; start?: number };
  let { blocks = [], compact = false, start = 1 }: { blocks?: Block[]; compact?: boolean; start?: number } = $props();
</script>

<div class="wt" class:compact>
  {#each blocks as b, bi (bi)}
    {#if b.kind === 'p'}
      <p>{@html rich(b.items[0].text)}</p>
    {:else if b.kind === 'ol'}
      <ol start={b.start ?? start}>
        {#each b.items as item, ii (ii)}
          <li>
            {@html rich(item.text)}
            {#if item.sub.length}<ul>{#each item.sub as s, si (si)}<li>{@html rich(s)}</li>{/each}</ul>{/if}
          </li>
        {/each}
      </ol>
    {:else}
      <ul>
        {#each b.items as item, ii (ii)}
          <li>
            {@html rich(item.text)}
            {#if item.sub.length}<ul>{#each item.sub as s, si (si)}<li>{@html rich(s)}</li>{/each}</ul>{/if}
          </li>
        {/each}
      </ul>
    {/if}
  {/each}
</div>
