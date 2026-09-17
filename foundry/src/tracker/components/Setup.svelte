<script lang="ts">
  /**
   * Starting a Titan Engagement or a Skirmish (engagement-flow.yaml, starting; engagement-setup.yaml;
   * skirmish.yaml, starting): the GM names or rolls what the starting rule leaves open.
   */
  import type { SetupView } from '../setup.ts';

  let { sheetState, sheet }: { sheetState: { view: SetupView }; sheet: any } = $props();
  // svelte-ignore state_referenced_locally
  const v = sheetState.view;
  const t = (k: string, d?: Record<string, unknown>) => (d ? game.i18n.format(`WOF.Tracker.${k}`, d) : game.i18n.localize(`WOF.Tracker.${k}`));
  const E = CONFIG.WOF.engagement;

  let anchor = $state(v.anchor);
  let focus = $state(v.titans[0]?.id ?? '');
  let soldiers = $state<string[]>(v.soldiers.map((s) => s.id));
  let tactics = $state<string[]>([]);
  let background = $state<{ name: string; titan: string; length: number }[]>([]);
  let foes = $state<string[]>(v.foes.map((f) => f.id));
  let night = $state(false);
  let ambush = $state<'none' | 'squad' | 'foes'>('none');
  let groupName = $state(v.foes[0]?.name ?? '');
  let rolled = $state<string[]>([]);

  const d6 = () => Math.floor(Math.random() * 6) + 1;
  function rollAnchor() {
    const n = d6();
    anchor = E.setup.anchor.find((r: any) => r.results.includes(n))?.id ?? anchor;
    rolled = [...rolled, t('setup.rolledAnchor', { n, name: E.ratings.find((r: any) => r.id === anchor)?.name })];
  }
  function rollBackground() {
    const n = d6();
    const clocks = E.setup.background.find((r: any) => r.results.includes(n))?.clocks ?? [];
    background = clocks.map((length: number) => {
      const s = d6();
      const size = E.setup.size.find((r: any) => r.results.includes(s))?.id ?? 'medium';
      const titan = E.setup.standard[size];
      return { name: E.titans.find((x: any) => x.id === titan)?.name ?? titan, titan, length };
    });
    rolled = [...rolled, t('setup.rolledBackground', { n, count: clocks.length })];
  }
  const toggle = (list: string[], id: string, on: boolean) => (on ? [...new Set([...list, id])] : list.filter((x) => x !== id));

  function start(e: Event) {
    e.preventDefault();
    sheet.submit({
      mode: v.mode,
      anchor,
      focus: v.mode === 'titan' ? focus : null,
      background: v.mode === 'titan' ? background.map((b) => ({ ...b, actor: '' })) : [],
      soldiers,
      tactics,
      skirmish: v.mode === 'skirmish' ? { foes, night, ambush, name: groupName, kind: v.foes.find((f) => foes.includes(f.id))?.kind ?? '' } : undefined,
    });
  }
</script>

<form class="wof-sheet wof-setup" onsubmit={start}>
  <header class="rd-h"><div><strong>{v.mode === 'titan' ? t('setup.titleTitan') : t('setup.titleSkirmish')}</strong><span class="lbl">{v.scene}</span></div></header>
  <div class="rd-grid">
    {#if v.mode === 'titan'}
      <label class="lbl" for="{sheet.id}-anchor">{t('line.anchor')}</label>
      <span class="row2"><select id="{sheet.id}-anchor" bind:value={anchor}>{#each E.ratings as r (r.id)}<option value={r.id}>{r.name}</option>{/each}</select><button type="button" class="mini" onclick={rollAnchor}>{t('setup.roll')}</button></span>
      <label class="lbl" for="{sheet.id}-focus">{t('setup.focus')}</label>
      {#if v.titans.length}
        <select id="{sheet.id}-focus" bind:value={focus}>{#each v.titans as ti (ti.id)}<option value={ti.id}>{ti.name}</option>{/each}</select>
      {:else}<span class="val warn">{t('setup.noTitans')}</span>{/if}
      <span class="lbl">{t('setup.background')}</span>
      <div class="bglist">
        {#each background as b, i (i)}
          <span class="row2">
            <select bind:value={b.titan} aria-label={t('setup.statBlock')} onchange={() => (b.name = E.titans.find((x: any) => x.id === b.titan)?.name ?? b.name)}>{#each E.titans as x (x.id)}<option value={x.id}>{x.name}</option>{/each}</select>
            <select bind:value={b.length} aria-label={t('setup.clock')}>{#each E.setup.clockLengths as n (n)}<option value={n}>{t('setup.segments', { n })}</option>{/each}</select>
            <button type="button" class="mini" aria-label={t('setup.remove')} onclick={() => (background = background.filter((_, k) => k !== i))}>✕</button>
          </span>
        {/each}
        <span class="row2">
          <button type="button" class="mini" disabled={background.length >= 2} onclick={() => (background = [...background, { name: E.titans[0].name, titan: E.titans[0].id, length: 6 }])}>{t('setup.addBackground')}</button>
          <button type="button" class="mini" onclick={rollBackground}>{t('setup.rollBackground')}</button>
        </span>
        <small class="note">{t('setup.retreat', { n: E.setup.retreatClock })}</small>
      </div>
      <span class="lbl">{t('line.tactics')}</span>
      <div class="choices">
        {#each E.tactics as x (x.id)}<label class="choice"><input type="checkbox" checked={tactics.includes(x.id)} disabled={!tactics.includes(x.id) && tactics.length >= 2} onchange={(e) => (tactics = toggle(tactics, x.id, e.currentTarget.checked))} /><span>{x.name}</span></label>{/each}
      </div>
    {:else}
      <span class="lbl">{t('line.foes')}</span>
      <div class="choices">
        {#each v.foes as f (f.id)}<label class="choice"><input type="checkbox" checked={foes.includes(f.id)} onchange={(e) => (foes = toggle(foes, f.id, e.currentTarget.checked))} /><span>{f.name}</span></label>{:else}<span class="val warn">{t('setup.noFoes')}</span>{/each}
      </div>
      <label class="lbl" for="{sheet.id}-group">{t('setup.groupName')}</label>
      <input id="{sheet.id}-group" type="text" bind:value={groupName} />
      <span class="lbl">{t('setup.night')}</span>
      <label class="choice"><input type="checkbox" bind:checked={night} /><span>{t('setup.nightHint')}</span></label>
      <label class="lbl" for="{sheet.id}-ambush">{t('line.ambush')}</label>
      <select id="{sheet.id}-ambush" bind:value={ambush}>{#each ['none', 'squad', 'foes'] as a (a)}<option value={a}>{t(`sk.ambush.${a}`)}</option>{/each}</select>
    {/if}
    <span class="lbl">{t('setup.soldiers')}</span>
    <div class="choices">
      {#each v.soldiers as s (s.id)}<label class="choice"><input type="checkbox" checked={soldiers.includes(s.id)} onchange={(e) => (soldiers = toggle(soldiers, s.id, e.currentTarget.checked))} /><span>{s.name}</span></label>{:else}<span class="val warn">{t('setup.noSoldiers')}</span>{/each}
    </div>
  </div>
  {#each rolled as r, i (i)}<p class="note">{r}</p>{/each}
  <footer class="rd-f">
    <span class="note">{v.mode === 'titan' ? t('setup.footTitan') : t('setup.footSkirmish')}</span>
    <button class="mini red" type="submit" disabled={!soldiers.length || (v.mode === 'titan' ? !focus : !foes.length)}>{t('setup.start')}</button>
  </footer>
</form>
