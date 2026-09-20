<script lang="ts">
  /**
   * The running strip that marks a sheet open for amendment: one along the top edge, one along the
   * bottom, the same line of text repeated and scrolling. Two identical runs make the loop seamless
   * (the track slides exactly one run's width, then snaps back); the strip holds still under
   * Reduced and Off motion, where the sheet's data-motion turns the animation off.
   */
  let { edge = 'top', text, label, runs = 6 }: { edge?: 'top' | 'bottom'; text: string; label: string; runs?: number } = $props();

  const words = $derived(Array.from({ length: runs }, () => text));
</script>

<div class="editbar" data-edge={edge} role="note" aria-label={label}>
  <span class="sr">{label}</span>
  <div class="ebtrack" aria-hidden="true">
    <div class="ebrun">{#each words as w, i (i)}<span>{w}</span>{/each}</div>
    <div class="ebrun">{#each words as w, i (i)}<span>{w}</span>{/each}</div>
  </div>
</div>
