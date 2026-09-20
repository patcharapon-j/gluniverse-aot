<script lang="ts">
  /**
   * The HUD strip (the locked Ops Ledger): round and step pips with the step's action, the card chips in
   * order, the Titan chips with their cards and Attention, the retreat clock, Board and Fold; folded, a
   * thin bar. Spent chips fold to numbered tabs when the row is too wide, then the row scrolls.
   */
  import { tick as settle } from 'svelte';
  import { fx } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { act, pickCard, setDirect, tracker } from '../state.svelte.ts';
  import { swapReason, type Chip } from '../view.ts';
  import Clock from './Clock.svelte';

  const t = (k: string, d?: Record<string, unknown>) => (d ? game.i18n.format(`WOF.Tracker.${k}`, d) : game.i18n.localize(`WOF.Tracker.${k}`));
  const v = $derived(tracker.view);
  const isGM = !!game.user.isGM;
  let row: HTMLElement | undefined = $state();
  let root: HTMLElement | undefined = $state();
  let lastNow = '';
  let lastCount = 0;

  const picking = $derived(v?.step === 'swap');
  const own = (id: string) => !!game.actors.get(id)?.isOwner;
  const rowBlock = (id: string) => v?.rows.find((r) => r.id === id)?.swapBlock ?? null;

  function chipClass(c: Chip): string {
    const out = ['chip'];
    if (c.kind === 'wing') out.push('wing');
    if (c.done) out.push('done');
    if (c.now) out.push('now');
    if (c.dead) out.push('dead');
    if (picking && c.kind === 'soldier') out.push(tracker.picks.includes(c.id) ? 'picked' : rowBlock(c.id) ? 'nopick' : 'pick');
    return out.join(' ');
  }

  function onChip(c: Chip) {
    if (picking && c.kind === 'soldier') return void pickCard(c.id, swapReason, own);
    if (c.kind === 'titan') return void act('pan', { token: c.id });
    return void act('pan', { actor: c.id });
  }

  function chipLabel(c: Chip): string {
    const base = c.kind === 'wing' ? t('chip.wing', { name: c.name, of: v?.rows.find((r) => r.id === c.of)?.name ?? '' }) : t('chip.card', { name: c.name, card: c.card ?? '–' });
    return c.now ? `${base}, ${t('chip.actingNow')}` : base;
  }

  /** Dense rows: spent chips fold to tabs, then the row scrolls with the acting chip in view. */
  function fit() {
    if (!row) return;
    row.classList.remove('dense', 'scrolls');
    if (row.scrollWidth <= row.clientWidth + 1) return;
    row.classList.add('dense');
    if (row.scrollWidth > row.clientWidth + 1) row.classList.add('scrolls');
    const now = row.querySelector<HTMLElement>('.now, .picked');
    if (now) row.scrollLeft = Math.max(0, Math.min(now.offsetLeft + now.offsetWidth - row.clientWidth + 24, now.offsetLeft - 8));
  }

  $effect(() => {
    void tracker.tick;
    void tracker.folded;
    void settle().then(() => {
      fit();
      const nowKey = v?.chips.find((c) => c.now)?.key ?? '';
      const count = v?.chips.filter((c) => c.card !== null).length ?? 0;
      if (count && !lastCount && root) fx(root.querySelectorAll('.chip, .tcard'), { opacity: [0, 1], translateY: [-10, 0], duration: MOTION.base, delay: (_: unknown, i: number) => i * MOTION.stagger });
      if (nowKey && nowKey !== lastNow && root) fx(root.querySelector('.h-cards .now'), { translateY: [-14, -6], duration: MOTION.weighty, ease: MOTION.settle });
      lastNow = nowKey;
      lastCount = count;
    });
  });
</script>

<div class="wof-hud" class:collapsed={tracker.folded} class:direct={isGM && tracker.direct} bind:this={root}>
  {#if !v}
    {#if isGM}
      <div class="hud-in idle">
        <div class="thinbar">
          <strong>{t('title')}</strong>
          <span>{t('idle')}</span>
          <span class="sep"></span>
          <button type="button" class="mini red" onclick={() => act('setup', { mode: 'titan' })}>{t('act.newTitan')}</button>
          <button type="button" class="mini" onclick={() => act('setup', { mode: 'skirmish' })}>{t('act.newSkirmish')}</button>
        </div>
      </div>
    {/if}
  {:else if tracker.folded}
    <div class="hud-in">
      <div class="thinbar">
        <strong>{t('roundShort', { n: v.round })}</strong>
        <span class="steps">{#each v.steps as s (s.id)}<i class={s.state} title={s.label}>{s.short}</i>{/each}</span>
        <span class="now">{v.now}</span>
        <span>{v.next}</span>
        <span class="sep"></span>
        {#if v.mode === 'titan'}
          <Clock segments={v.retreat.length} filled={v.retreat.filled} label={t('retreat')} />
          <span>{v.retreat.active ? t('retreatCalled') : t('retreatN', { n: v.retreat.filled, of: v.retreat.length })}</span>
          {#if v.mode === 'titan'}<span title={v.anchors.trait}>{v.anchors.text}</span>{/if}
        {:else}<span>{t('skirmish')}</span>{/if}
        <button type="button" class="mini" onclick={() => act('unfold')}>{t('act.unfold')}</button>
        <button type="button" class="mini" aria-label={t('act.boardLabel')} onclick={() => act('board')}>{t('act.board')}</button>
      </div>
    </div>
  {:else}
    <div class="hud-in">
      <div class="h-round">
        <strong>{t('roundLong', { n: v.round })}</strong>
        <span class="steps">{#each v.steps as s (s.id)}<i class={s.state} title={s.state === 'off' ? t('stepOff', { step: s.label }) : s.label}>{s.short}</i>{/each}</span>
        {#if v.primary}
          <button type="button" class="mini red" onclick={() => act(v.primary!.action)}>{v.primary.label}</button>
        {:else}
          <span class="hint" title={v.hint}>{v.hint}</span>
        {/if}
        <!-- The anchor rating belongs to the engagement, not to a soldier, so it is read here and
             not on every token; the Momentum pip track on the tokens carries its cap (batch D). -->
        {#if v.mode === 'titan'}
          <span class="anchorplate" title="{v.anchors.text}{v.anchors.trait ? `. ${v.anchors.trait}` : ''}">
            <b>{v.anchor}</b><span>{t('line.anchors')} {v.anchors.left}<small>&thinsp;{t('of')}&thinsp;</small>{v.anchors.full}</span>
          </span>
        {/if}
        {#if isGM}
          <!-- ADR-0028: automation assists the GM and never blocks them. -->
          <button type="button" class="directbtn" class:on={tracker.direct} aria-pressed={tracker.direct} title={t('direct.hint')} onclick={() => setDirect(!tracker.direct)}>{t('direct.toggle')}</button>
        {/if}
      </div>
      <div class="h-cards" role="group" aria-label={t('cardOrder')} bind:this={row}>
        {#each v.chips as c, i (c.key)}
          {#if c.kind === 'wing' && i > 0}<span class="link" aria-hidden="true"></span>{/if}
          {#if c.kind === 'titan' || c.kind === 'foe-group'}
            <button type="button" class="tcard" class:done={c.done} class:now={c.now} class:dead={c.dead} title={c.kind === 'titan' ? t('chip.titanCard', { label: c.name, card: c.card }) : t('chip.foeCard', { card: c.card })} onclick={() => onChip(c)}>
              <b class={c.label}>{c.kind === 'titan' ? c.short : 'F'}</b><span>{c.card}</span>
            </button>
          {:else}
            <button type="button" class={chipClass(c)} aria-label={chipLabel(c)} aria-pressed={picking && c.kind === 'soldier' ? tracker.picks.includes(c.id) : undefined} title={picking ? (rowBlock(c.id) ?? chipLabel(c)) : chipLabel(c)} onclick={() => onChip(c)}>
              <img class="pt" src={c.img} alt="" />
              <span class="cn">{c.kind === 'wing' ? 'W' : (c.card ?? '–')}</span>
              {#if c.was !== null}<s title={t('chip.was', { n: c.was })}>{c.was}</s>{/if}
              <span class="nm">{c.short}</span>
              <span class="row">
                {#each c.letters as l, k (k)}<span class="pl {l.cls}" title={l.title}>{l.letter}</span>{/each}
                {#each c.statuses as st, k (k)}<img class="ic" src={st.icon} alt={st.title} title={st.title} />{/each}
              </span>
            </button>
          {/if}
        {/each}
      </div>
      <div class="h-titans">
        {#if v.mode === 'titan'}
          {#each v.titans as ti (ti.key)}
            <button type="button" class="tchip {ti.colour}" class:corpse={ti.corpse} title="{ti.name}, {t('tempo', { n: ti.tempo })}" onclick={() => act('pan', { token: ti.key })}>
              <img src={ti.img} alt="" />
              <strong>{ti.label} {ti.name}</strong>
              <span class="tc">
                {#if ti.corpse}<i>{t('corpse')}</i>{/if}
                {#each ti.cards as cd, k (k)}<i class:done={cd.done} class:now={cd.now}>{cd.n}</i>{/each}
              </span>
              <span class="att">{ti.corpse ? '' : ti.att}</span>
              <!-- Frenzy: a rising track everyone can read, because it is the clock that says finish the fight. -->
              {#if !ti.corpse}
                <span class="frz" title={ti.frenzyTitle} aria-label={ti.frenzyTitle}>
                  <b>{t('frenzy')}</b>
                  {#each Array.from({ length: ti.frenzyCap }) as _, k (k)}<i class:on={k < ti.frenzy}></i>{/each}
                </span>
              {/if}
            </button>
          {/each}
        {:else}
          <button type="button" class="tchip foe" title={v.foeName}>
            <img src={v.foes[0]?.img ?? ''} alt="" />
            <strong>{v.foeName}</strong>
            <span class="tc">{#each v.chips.filter((c) => c.kind === 'foe-group') as c (c.key)}<i class:now={c.now} class:done={c.done}>{c.card}</i>{/each}</span>
            <span class="att">{v.grit}</span>
          </button>
        {/if}
      </div>
      <div class="h-end">
        {#if v.mode === 'titan'}
          <div class="h-ret" class:retreat={v.retreat.active} title={t('retreatTitle', { n: v.retreat.filled, of: v.retreat.length })}>
            <Clock segments={v.retreat.length} filled={v.retreat.filled} label={t('retreat')} />
            <span>{t('retreat')}</span>
            {#if v.retreat.active}<span>{t('called')}</span>{:else}<b>{v.retreat.filled}<small>&thinsp;{t('of')}&thinsp;</small>{v.retreat.length}</b>{/if}
          </div>
        {:else}
          <div class="h-ret" title={t('noRetreat')}><span>{t('retreat')}</span><span>{t('none')}</span></div>
        {/if}
        <div class="col">
          <button type="button" class="mini" aria-label={t('act.boardLabel')} title={t('act.boardLabel')} onclick={() => act('board')}>{t('act.board')}</button>
          <button type="button" class="ghost" aria-label={t('act.foldLabel')} onclick={() => act('fold')}>{t('act.fold')}</button>
        </div>
      </div>
    </div>
    {#if tracker.cue || v.proposal || v.cue}
      <div class="cue" class:warn={tracker.cue?.warn ?? v.cue?.warn}>
        {#if v.proposal}
          <span>{v.proposal.text}</span>
          {#if v.proposal.canAccept}<button type="button" class="mini" onclick={() => act('swap-accept')}>{t('act.accept')}</button>{/if}
          {#if v.proposal.canCancel}<button type="button" class="mini" onclick={() => act('swap-cancel')}>{t('act.decline')}</button>{/if}
        {:else if tracker.cue}
          {tracker.cue.text}
        {:else if v.cue}
          {v.cue.text}
        {/if}
      </div>
    {/if}
  {/if}
</div>
