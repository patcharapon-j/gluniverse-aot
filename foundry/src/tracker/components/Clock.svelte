<script lang="ts">
  /** A segmented clock (the Ops Ledger's Regeneration, Background, and retreat clocks); display only. */
  let { segments, filled, tone = 'red', unknown = false, label = '' }: { segments: number; filled: number; tone?: string; unknown?: boolean; label?: string } = $props();

  const C = 36;
  const R = 30;
  const r = 9;
  const GAP = 8;
  const pt = (a: number, rad: number) => {
    const th = (a * Math.PI) / 180;
    return [+(C + rad * Math.cos(th)).toFixed(2), +(C + rad * Math.sin(th)).toFixed(2)];
  };
  const n = $derived(Math.max(1, segments));
  const segs = $derived(
    Array.from({ length: n }, (_, i) => {
      const a0 = -90 + (i * 360) / n + GAP / 2;
      const a1 = -90 + ((i + 1) * 360) / n - GAP / 2;
      const lg = a1 - a0 > 180 ? 1 : 0;
      const [x0, y0] = pt(a0, r);
      const [x1, y1] = pt(a0, R);
      const [x2, y2] = pt(a1, R);
      const [x3, y3] = pt(a1, r);
      const at = -90 + (i * 360) / n;
      const [tx1, ty1] = pt(at, R + 1);
      const [tx2, ty2] = pt(at, R + 5);
      return { d: `M${x0} ${y0}L${x1} ${y1}A${R} ${R} 0 ${lg} 1 ${x2} ${y2}L${x3} ${y3}A${r} ${r} 0 ${lg} 0 ${x0} ${y0}Z`, tick: [tx1, ty1, tx2, ty2] };
    }),
  );
</script>

<span class="tclock {tone}" role="img" aria-label={label}>
  <svg viewBox="0 0 72 72" aria-hidden="true">
    <circle class="rim" cx="36" cy="36" r="35" />
    {#if unknown}
      <circle class="rim2 unk" cx="36" cy="36" r="31" />
      <text class="unkn" x="36" y="43">{filled}</text>
    {:else}
      <circle class="rim2" cx="36" cy="36" r="32.5" />
      {#each segs as s, i (i)}
        <path class="cs" class:on={i < filled} d={s.d} />
        <line class="tick" x1={s.tick[0]} y1={s.tick[1]} x2={s.tick[2]} y2={s.tick[3]} />
      {/each}
      <g class="hand" style="transform:rotate({(filled * 360) / n}deg)"><path d="M36 38V12" /></g>
      <circle class="hub" cx="36" cy="36" r="4" />
    {/if}
  </svg>
</span>
