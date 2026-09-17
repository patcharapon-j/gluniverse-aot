<script lang="ts">
  import type { PoolPreview } from '../../rules/pool.ts';
  import { t } from '../context.ts';
  import Dots from './Dots.svelte';

  let { pool, size = 'sm' }: { pool: PoolPreview; size?: '' | 'sm' | 'big' } = $props();
  const cut = $derived(pool.removed.bonus + pool.removed.talent + pool.removed.attribute);
  const groups = $derived([
    { cls: 'da', n: (pool.attribute?.dice ?? 0) - pool.removed.attribute },
    { cls: 'dt', n: (pool.talent?.dice ?? 0) - pool.removed.talent },
    { cls: 'db', n: pool.bonus - pool.removed.bonus },
    { cls: 'dx', n: cut },
    { cls: 'dg', n: pool.gear?.dice ?? 0 },
    { cls: 'ds', n: pool.stress },
  ]);
</script>

<Dots {groups} {size} label={t('WOF.Sheet.aria.pool', { base: pool.base, gear: pool.gear?.dice ?? 0, stress: pool.stress })} />
