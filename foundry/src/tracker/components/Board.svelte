<script lang="ts">
  /**
   * The Engagement ledger (the locked Ops Ledger): a two-page ledger spread. Left: the engagement line,
   * the step bar, the field readout (each zone's rating and who stands in it), and each soldier's zone,
   * attachment, and derived Positions, read only (decision batch 16, 16-35; moves are made on the
   * engagement board, src/board/), or, in a Skirmish, Engaged or Apart by Foe. Right: a block per Focus Titan and corpse, then the Background and retreat clocks (or the
   * Foe group). Footer: the round-end checklist with its stamps, Undo, and Apply.
   */
  import { tick as settle } from 'svelte';
  import { fx, pulse } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { act, pickCard, setDirect, tracker } from '../state.svelte.ts';
  import { swapReason, type Cell, type SoldierRow } from '../view.ts';
  import Clock from './Clock.svelte';

  const t = (k: string, d?: Record<string, unknown>) => (d ? game.i18n.format(`WOF.Tracker.${k}`, d) : game.i18n.localize(`WOF.Tracker.${k}`));
  const v = $derived(tracker.view);
  const isGM = !!game.user.isGM;
  const own = (id: string) => !!game.actors.get(id)?.isOwner;
  let menu: { row: SoldierRow; cell: Cell; x: number; y: number } | null = $state(null);
  let host: HTMLElement | undefined = $state();
  let lastStamped = -1;

  function openMenu(e: MouseEvent, row: SoldierRow, cell: Cell) {
    if (!row.owner && !isGM) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const h = host!.getBoundingClientRect();
    menu = { row, cell, x: Math.min(r.left - h.left, h.width - 220), y: r.bottom - h.top + 2 };
    void settle().then(() => {
      const el = host?.querySelector<HTMLElement>('.pop');
      fx(el, { opacity: [0, 1], translateY: [-4, 0], duration: MOTION.quick });
      el?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    });
  }

  /** Direct Control is the GM's own client stepping over the rules checks (ADR-0028). */
  const direct = $derived(isGM && tracker.direct);

  function letGo() {
    if (!menu) return;
    const { row, cell } = menu;
    menu = null;
    void act('let-go', { soldier: row.id }).then(() => {
      pulse(host?.querySelector(`[data-cell="${row.id}-${cell.key}"]`), MOTION.colors.notice);
    });
  }

  /** Direct Control's placement (ADR-0028): a zone (or off field) and an attachment, naming the open cell's body where it names one. */
  function place(zone: string, kind: string) {
    if (!menu) return;
    const body = ['on-body', 'blind-spot', 'grabbed', 'pinned'].includes(kind) ? menu.cell.label : null;
    set('place', { to: { zone: zone === 'off' ? null : Number(zone), attachment: { kind, body } } });
  }
  const zoneNumbers = $derived((v?.field?.zones ?? []).map((z) => z.n));

  /** One direct setter, run and the menu left open so the GM can set several things at once. */
  function set(op: string, data: Record<string, unknown> = {}) {
    if (!menu) return;
    const { row, cell } = menu;
    void act('direct', { op, soldier: row.id, key: cell.key, ...data }).then(() => {
      pulse(host?.querySelector(`[data-cell="${row.id}-${cell.key}"]`), MOTION.colors.notice);
    });
  }

  /** The Titan the open cell names, for the Openings setter and the Frenzy readout. */
  const menuTitan = $derived(menu ? (v?.titans.find((x) => x.key === menu!.cell.key) ?? null) : null);

  function menuKey(e: KeyboardEvent) {
    const items = [...(host?.querySelectorAll<HTMLButtonElement>('.pop button:not(:disabled)') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Escape') menu = null;
  }

  $effect(() => {
    void tracker.tick;
    void settle().then(() => {
      const stamped = v?.checks.filter((c) => c.state === 'done').length ?? 0;
      if (stamped > lastStamped && lastStamped >= 0 && host) {
        const el = host.querySelectorAll('.ck.done .dst');
        const last = el[el.length - 1];
        fx(last, { scale: [2.2, 1], rotate: [-30, -8], opacity: [0, 1], duration: MOTION.base, ease: 'outQuad' });
      }
      lastStamped = stamped;
      fx(host?.querySelector('.tb.now'), { scale: [1.02, 1], duration: MOTION.weighty, ease: MOTION.settle });
    });
  });

  const pips = (n: number, max: number) => Array.from({ length: Math.max(max, n) }, (_, i) => i < n);
</script>

<svelte:window onclick={(e) => { if (menu && !(e.target as HTMLElement).closest('.pop, .pc')) menu = null; }} />

<div class="wof-board" class:direct bind:this={host}>
  {#if v || isGM}
  <div class="tabs" role="tablist" aria-label={t('board.kind')}>
    <button role="tab" type="button" aria-selected={v?.mode !== 'skirmish'} disabled={!!v && v.mode !== 'titan'} onclick={() => !v && act('setup', { mode: 'titan' })}><span class="n">A</span><span>{t('board.tabTitan')}</span></button>
    <button role="tab" type="button" aria-selected={v?.mode === 'skirmish'} disabled={!!v && v.mode !== 'skirmish'} onclick={() => !v && act('setup', { mode: 'skirmish' })}><span class="n">B</span><span>{t('skirmish')}</span></button>
  </div>
  {/if}
  {#if !v}
    {#if isGM}
    <div class="spread empty">
      <div class="page left paper"><div class="body"><p class="note">{t('idle')}</p>
        <p><button type="button" class="mini red" onclick={() => act('setup', { mode: 'titan' })}>{t('act.newTitan')}</button> <button type="button" class="mini" onclick={() => act('setup', { mode: 'skirmish' })}>{t('act.newSkirmish')}</button></p>
      </div></div>
    </div>
    {/if}
  {:else}
    <div class="spread" role="tabpanel">
      <div class="paper page left"><div class="body">
        <header class="ph">
          <div><span class="kick">{v.mode === 'titan' ? t('board.leftKick') : t('board.leftKickSk')}</span><h2>{v.mode === 'titan' ? t('board.positions') : t('board.range')}</h2></div>
          <span class="folio">{v.mode === 'titan' ? t('board.folio', { anchor: v.anchor }) : t('board.folioSk')}</span>
        </header>
        <div class="eline">
          {#if v.mode === 'titan'}
            <span>{t('line.fieldRating')} <b>{v.anchor}</b></span>
            <span>{t('line.field')} <b>{v.field?.sizeText ?? '–'}</b></span>
            <span>{t('line.round')} <b>{v.round}</b></span>
            <span>{t('line.step')} <b>{v.steps.find((s) => s.id === v.step)?.label}</b></span>
            <span>{t('retreat')} <b>{v.retreat.text}</b></span>
            <span>{t('line.tactics')} <b>{v.tactics}</b></span>
            <span>{t('line.cloaks')} <b>{v.cloaks}</b></span>
          {:else}
            <span>{t('line.foes')} <b>{v.foeName}</b></span>
            <span>{t('line.round')} <b>{v.round}</b></span>
            <span>{t('line.step')} <b>{v.steps.find((s) => s.id === v.step)?.label}</b></span>
            <span>{t('line.ambush')} <b>{v.ambush}</b></span>
          {/if}
        </div>
        <div class="bsteps">
          {#each v.steps as s (s.id)}<span class="st {s.state}">{s.label}</span>{/each}
          <span class="sp"></span>
          {#if isGM}
            <!-- ADR-0028: automation assists the GM and never blocks them. The board is drawn
                 visibly differently while this is on, so a player-facing table does not drift into
                 it by habit. -->
            <button type="button" class="directbtn" class:on={tracker.direct} aria-pressed={tracker.direct} title={t('direct.hint')} onclick={() => setDirect(!tracker.direct)}>{t('direct.toggle')}</button>
          {/if}
          {#if v.canEnd}<button type="button" class="mini" onclick={() => act('end')}>{t('act.end')}</button>{/if}
          {#if v.primary}<button type="button" class="mini red" onclick={() => act(v.primary!.action)}>{v.primary.label}</button>{/if}
        </div>
        {#if direct}<p class="directbar">{t('direct.banner')}</p>{/if}
        {#if v.ending.met}<p class="lognote red">{v.ending.text}</p>{/if}

        {#if v.mode === 'titan' && v.field}
          <h3 class="sec"><span class="n">§0</span>{t('board.field')}<span class="hint">{t('board.fieldHint')}</span></h3>
          <div class="zonelist">
            {#each v.field.zones as z (z.n)}
              <span class="zn" class:occupied={z.titans.length || z.soldiers.length} title={z.trait}>
                <b>{z.n}</b> {z.name}{#if z.startName}<small> ({t('board.wasRating', { name: z.startName })})</small>{/if}
                {#if z.titans.length}<em>{z.titans.join(', ')}</em>{/if}
                {#if z.soldiers.length}<small>{z.soldiers.join(', ')}</small>{/if}
              </span>
            {/each}
          </div>
        {/if}
        <h3 class="sec"><span class="n">§1</span>{v.mode === 'titan' ? t('board.matrix') : t('board.engaged')}<span class="hint">{v.mode === 'titan' ? t('board.matrixHint') : t('board.engagedHint')}</span></h3>
        <div class="mxwrap">
          <table class="mx">
            <colgroup><col style="width:44px" /><col />{#if v.mode === 'titan'}<col style="width:96px" />{#each v.titans as _ti (_ti.key)}<col style="width:84px" />{/each}{:else}{#each v.foes as _f (_f.id)}<col style="width:62px" />{/each}{/if}{#if v.mode === 'titan'}<col style="width:40px" />{/if}<col style="width:54px" /></colgroup>
            <thead>
              <tr>
                <th>{t('board.card')}</th><th>{t('board.soldier')}</th>
                {#if v.mode === 'titan'}
                  <th>{t('board.zone')}</th>
                  {#each v.titans as ti (ti.key)}<th class="t{ti.colour}" title={ti.name}>{ti.label} {ti.corpse ? t('corpse') : ti.name} · {t('zone.n', { n: ti.zone })}</th>{/each}
                  <th>{t('board.gas')}</th>
                  <th>{t('board.momentum')}</th>
                {:else}
                  {#each v.foes as f (f.id)}<th class="tF" title={f.name}>{t('board.foeN', { n: f.label })}</th>{/each}
                {/if}
                <th>{t('board.stress')}</th>
              </tr>
            </thead>
            <tbody>
              {#each v.rows as r (r.id)}
                <tr class:now={r.now} class:downrow={r.down} class:deadrow={r.dead}>
                  <td>
                    {#if r.wing}
                      <span class="cardno w" title={t('board.onWing', { name: r.wing })}>{t('board.wing')}</span>
                    {:else if v.step === 'swap' && r.card !== null}
                      <button type="button" class="cardno" class:pick={!r.swapBlock} class:picked={tracker.picks.includes(r.id)} aria-pressed={tracker.picks.includes(r.id)} title={r.swapBlock ?? t('board.pickSwap', { name: r.name, card: r.card })} onclick={() => pickCard(r.id, swapReason, own)}>{r.card}</button>
                    {:else}
                      <span class="cardno">{r.card ?? '–'}</span>
                    {/if}
                    {#if r.was !== null}<span class="was">{t('board.was', { n: r.was })}</span>{/if}
                  </td>
                  <td class="who">
                    <div class="who-in">
                      <img class="pt" src={r.img} alt="" />
                      <div>
                        <strong>{r.name}</strong>
                        {#if r.stamp}<span class="stamp">{r.stamp}</span>{:else}<span>{r.sub}</span>{/if}
                        {#if r.owner && v.mode === 'titan'}
                          <span class="rowacts">
                            {#if !r.leave}<button type="button" class="link-btn" onclick={() => act('leave', { soldier: r.id })}>{t('act.leave')}</button>{/if}
                            {#if !r.returnBack}{#each r.returnZones as n (n)}<button type="button" class="link-btn" onclick={() => act('return', { soldier: r.id, zone: n })}>{t('act.returnTo', { n })}</button>{/each}{/if}
                          </span>
                        {/if}
                      </div>
                    </div>
                  </td>
                  {#if v.mode === 'titan'}
                    <td class="zonecell">
                      <b>{r.zoneText}</b>
                      {#if r.attachText}<small>{r.attachText}</small>{/if}
                      <small>{#if r.airborne}{t('board.airborneShort')}{/if}{#if r.mounted} {t('board.mountedShort')}{/if}{#if r.horseText} {r.horseText}{/if}</small>
                    </td>
                    {#each r.cells as c (c.key)}
                      <td>
                        <button type="button" class="pc {c.colour}" class:close={c.close} class:grab={c.grab} class:none={!c.position} data-cell="{r.id}-{c.key}" disabled={c.grab && !isGM} aria-haspopup="menu" title={c.grab ? t('board.grabbedCell', { label: c.label }) : c.position ? t(`posTip.${c.position}`) : ''} aria-label="{r.name}, {c.label}: {c.text}" onclick={(e) => openMenu(e, r, c)}>
                          {#if c.icon}<img src={c.icon} alt="" />{/if}<span>{c.text}{#if c.grab}<br />{t('grabbed')}{/if}</span>{#if c.hooked}<i class="hk" title={t('flag.hookedTip')} aria-label={t('flag.hookedTip')}>⌇</i>{/if}
                        </button>
                      </td>
                    {/each}
                    <td><span class="pips gas" title={t('board.gasTitle', { n: r.gas, of: r.gasMax })}>{#each pips(r.gas, r.gasMax) as on, k (k)}<i class:on></i>{/each}</span>{#if r.odm}<small class="odm" title={t('board.odmUsed')}>{t('board.odmShort')}</small>{/if}</td>
                    <td>
                      <span class="pips mo" title={t('momentum', { n: r.momentum, cap: r.momentumCap })} aria-label={t('momentum', { n: r.momentum, cap: r.momentumCap })}>{#each pips(r.momentum, r.momentumCap) as on, k (k)}<i class:on class:over={k >= r.momentumCap}></i>{/each}</span>
                      <b class="mov">{r.momentum}<small> {t('of')} {r.momentumCap}</small></b>
                    </td>
                  {:else}
                    {#each v.foes as f (f.id)}
                      {@const e = r.engaged.includes(f.id)}
                      <td><button type="button" class="pc {e ? 'eng' : 'apt'}" disabled={f.out || (!r.owner && !isGM)} aria-pressed={e} aria-label="{r.name}, {f.name}: {e ? t('engaged') : t('apart')}" onclick={() => act('engage', { soldier: r.id, foe: f.id })}>{#if e}<img src="systems/wings-of-freedom/assets/icons/status-engaged.webp" alt="" />{t('engaged')}{:else}{t('apart')}{/if}</button></td>
                    {/each}
                  {/if}
                  <td><span class="pips st" title={t('board.stressTitle', { n: r.stress })}>{#each pips(r.stress, 4) as on, k (k)}<i class:on></i>{/each}</span></td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        {#if v.mode === 'titan'}
          <div class="key">
            <span><span class="pl A">I</span><span class="pl B">O</span> {t('board.key')}</span>
            <span><span class="pl A d">D</span> {t('board.keyHollow')}</span>
          </div>
          {#if v.wingOptions.length}
            <h3 class="sec"><span class="n">§2</span>{t('board.wings')}<span class="hint">{v.wingsEditable ? t('board.wingsOpen') : t('board.wingsClosed')}</span></h3>
            <div class="wings">
              {#each v.wingOptions as w (w.mate)}
                <label class="wingrow"><span>{w.mateName}</span>
                  <select value={w.pc} disabled={!w.canEdit} onchange={(e) => act('wing', { mate: w.mate, pc: e.currentTarget.value })}>
                    <option value="">{t('board.noWing')}</option>
                    {#each w.choices as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
                  </select>
                </label>
              {/each}
            </div>
          {/if}
          {#each v.fallBack as fb (fb.soldier + fb.key)}<button type="button" class="mini" onclick={() => act('fall-back', { soldier: fb.soldier, key: fb.key })}>{fb.text}</button>{/each}
          {#each v.swaps as s, i (i)}<p class="lognote">{t('board.swapMade', { line: s })}</p>{/each}
          <p class="lognote red">{t('board.closeRule')}{#if v.odm} {t('board.odmList', { list: v.odm })}{/if}</p>
        {:else}
          <p class="lognote">{t('board.skirmishNote')}</p>
        {/if}
      </div></div>
      <div class="spine" aria-hidden="true"></div>
      <div class="paper page right"><div class="body">
        {#if v.mode === 'titan'}
          <header class="ph">
            <div><span class="kick">{t('board.rightKick')}</span><h2>{t('board.titans')}</h2></div>
            <span class="folio">{t('board.titanFolio', { n: v.titans.filter((x) => !x.corpse).length, bg: v.background.filter((b) => !b.entered).length })}</span>
          </header>
          {#each v.titans as ti (ti.key)}
            <div class="tb {ti.colour}" class:now={ti.now} class:corpse={ti.corpse}>
              <div class="tb-h">
                <img src={ti.img} alt="" />
                <div><h3><span class="lt">{ti.label}</span>{ti.name}</h3><span class="sub">{ti.kind}, {t('tempo', { n: ti.tempo })}{ti.corpse ? `, ${t('corpse')}` : ''}</span></div>
                <span class="tcards" title={t('board.cardsRound')}>{#each ti.cards as cd, k (k)}<span class="cardno" class:done={cd.done} class:now={cd.now}>{cd.n}</span>{/each}</span>
              </div>
              {#if ti.corpse}
                <div class="tgrid corpse-grid">
                  <div class="cell"><span class="lbl">{t('board.parts')}</span><div class="parts">{#each ti.parts as p (p.id)}<span class="bp s{p.state}" title={p.title}><img src={p.icon} alt="" /><b>{p.short}</b><b>{p.letter}{p.count}</b></span>{/each}</div></div>
                  <div class="cell"><span class="lbl">{t('board.heave')}</span><strong>{ti.heave}</strong></div>
                </div>
              {:else}
                <div class="tgrid">
                  <div class="cell att">
                    <span class="lbl">{t('board.attention')}</span>
                    <strong class:none={ti.holderNone}>{ti.holder}</strong>
                    <div class="rungs">{#each ti.rungs as rg (rg.id)}<i class:met={rg.met}>{rg.label}</i>{/each}</div>
                    {#if ti.hint}<span class="note">{ti.hint}</span>{/if}
                  </div>
                  <div class="cell">
                    <span class="lbl">{t('board.next')}</span>
                    <div class="seal">
                      <button type="button" class="wax" class:open={ti.next.revealed} disabled={!ti.canPeek} title={ti.canPeek ? t('board.peek') : t('board.sealed')} onclick={() => act('peek', { key: ti.key })}><img src="systems/wings-of-freedom/assets/icons/seal-wax.webp" alt={t('board.sealed')} /></button>
                      <span><b>{ti.next.revealed ? ti.next.name : t('board.sealed')}</b><br />{t('board.prev', { name: ti.prev })}{#if ti.grab}<br />{t('board.kept')}{/if}</span>
                    </div>
                    {#if ti.entries.length}
                      <select class="setnext" aria-label={t('board.setNext')} title={t('board.setNextHint')} value={ti.next.entryId} onchange={(e) => act('set-next', { key: ti.key, entry: e.currentTarget.value })}>
                        <option value="">{t('none')}</option>
                        {#each ti.entries as e (e.id)}<option value={e.id}>{e.name}{e.canHappen ? '' : ' ·'}</option>{/each}
                      </select>
                    {/if}
                  </div>
                  <div class="cell">
                    <span class="lbl">{t('board.parts')}</span>
                    <div class="parts">{#each ti.parts as p (p.id)}<span class="bp s{p.state}" title={p.title}><img src={p.icon} alt="" /><b>{p.short}</b><b>{p.letter}{p.count}</b></span>{/each}</div>
                  </div>
                  <div class="cell">
                    <span class="lbl">{t('board.openings')}</span>
                    <div class="ops">{#each ti.openings as o, k (k)}<span class="token" title={t('board.openingBy', { name: o.name })}>{o.initial}</span>{:else}<span class="note">{t('none')}</span>{/each}</div>
                    {#if ti.openingsBy}<span class="note">{t('board.openingsBy', { list: ti.openingsBy })}</span>{/if}
                    {#if ti.flags}<span class="note">{ti.flags}</span>{/if}
                  </div>
                  <div class="cell">
                    <!-- Frenzy rises 1 a round to its cap and is added to the behavior roll: the
                         longer the fight runs, the worse the Titan gets (round 3, decision 12). -->
                    <span class="lbl">{t('frenzy')}</span>
                    <span class="frz" title={ti.frenzyTitle} aria-label={ti.frenzyTitle}>
                      {#each Array.from({ length: ti.frenzyCap }) as _, k (k)}<i class:on={k < ti.frenzy}></i>{/each}
                      <b>+{ti.frenzy}</b>
                    </span>
                    <span class="note">{t('frenzyNote')}</span>
                  </div>
                  <div class="cell">
                    <span class="lbl">{t('board.regen')}</span>
                    <div class="clk"><Clock segments={ti.regen.length} filled={ti.regen.filled} tone={ti.colour === 'B' ? 'blue' : 'red'} unknown={ti.regen.hidden} label={t('board.regen')} /><span class="v">{ti.regen.filled}<small>{ti.regen.hidden ? '' : ` ${t('of')} ${ti.regen.length}`}</small></span></div>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
          <div class="clocks">
            {#each v.background as b, i (i)}
              <div class="clockbox">
                <Clock segments={b.length} filled={b.filled} tone="brass" label={b.name} />
                <div><strong>{b.name} <span class="v">{b.filled}<small> {t('of')} {b.length}</small></span></strong><span class="note">{b.entered ? t('board.bgEntered') : t('board.bgNote')}</span></div>
              </div>
            {/each}
            <div class="clockbox" class:retreat={v.retreat.active}>
              <Clock segments={v.retreat.length} filled={v.retreat.filled} label={t('retreat')} />
              <div><strong>{t('board.retreatClock')} <span class="v">{v.retreat.filled}<small> {t('of')} {v.retreat.length}</small></span></strong>{#if v.retreat.active}<span class="stamp">{t('retreat')}</span><span class="note">{v.retreat.text}</span>{:else}<span class="note">{t('board.retreatNote')}</span>{/if}</div>
            </div>
          </div>
        {:else}
          <header class="ph">
            <div><span class="kick">{t('board.rightKickSk')}</span><h2>{t('board.foes')}</h2></div>
            <span class="folio">{t('board.foeFolio')}</span>
          </header>
          <h3 class="sec"><span class="n">§2</span>{t('board.foeGroup')}<span class="hint">{t('board.foeHint')}</span></h3>
          <div class="tb F" class:now={v.chips.some((c) => c.kind === 'foe-group' && c.now)}>
            <div class="tb-h">
              <img src={v.foes[0]?.img ?? ''} alt="" />
              <div><h3>{v.foeName}</h3><span class="sub">{v.foeDice}</span></div>
              <span class="tcards">{#each v.chips.filter((c) => c.kind === 'foe-group') as c (c.key)}<span class="cardno" class:now={c.now} class:done={c.done}>{c.card}</span>{/each}</span>
            </div>
            <p class="note">{v.grit}</p>
            <div class="foes">
              {#each v.foes as f (f.id)}
                <div class="foe" class:out={f.out}>
                  <span class="token">{f.label}</span>
                  <div>
                    <span>{f.name}{f.out ? `, ${t('out')}` : ''}{f.held ? `, ${t('held')}` : ''} · {f.weapon}</span>
                    <div class="hb" role="group" aria-label={t('board.foeHealth', { name: f.name })}>
                      {#each Array.from({ length: f.health }) as _, j (j)}<button type="button" class:on={j < f.health - f.lost} disabled={!isGM} aria-label={t('board.healthN', { n: j + 1 })} onclick={() => act('foe-health', { foe: f.id, lost: f.health - (j + 1 === f.health - f.lost ? j : j + 1) })}></button>{/each}
                    </div>
                    {#if !f.out}<span class="note">{f.pick}</span>{/if}
                  </div>
                  {#if f.canAct}<button type="button" class="mini red" onclick={() => act('foe-act', { foe: f.id })}>{t('act.foeAct')}</button>{/if}
                </div>
              {/each}
            </div>
          </div>
          <h3 class="sec" style="margin-top:12px"><span class="n">§3</span>{t('board.clocks')}</h3>
          <p class="lognote">{t('board.noClocks')}</p>
        {/if}
      </div></div>
      <div class="checks" class:closing={v.closing}>
        <div class="ttl"><span class="lbl">{v.closing ? t('board.engagementEnd') : t('board.roundEnd')}</span><strong>{t('board.checklist')}</strong><span class="note">{v.step === 'end' || v.closing ? (v.allStamped ? t('board.allStamped') : t('board.inOrder')) : t('board.afterLast')}</span></div>
        {#each v.checks as ck (ck.index)}
          <div class="ck" class:done={ck.state === 'done' || ck.state === 'skipped'} class:next={ck.next} class:waiting={ck.waiting}>
            <span class="box">{ck.state === 'done' ? '✓' : ck.state === 'skipped' ? '–' : ck.waiting ? '…' : ck.index + 1}</span>
            <strong>{ck.label}</strong>
            <span class="det" title={ck.lines.join(' ') || ck.detail}>{ck.lines.length ? ck.lines.join(' ') : ck.detail}</span>
            <!-- A step out to a player's client is waiting, not stalled and not done (batch C). -->
            {#if ck.waiting}<em class="wait">{t('check.waitingOn')}</em>{/if}
            {#if ck.canRun}
              <span class="ckacts">
                {#if ck.off}<em class="note">{t('board.notApplied')}</em>{/if}
                <button type="button" class="mini red" title={ck.manual ? t('board.manual') : ''} onclick={() => act('check-apply', { index: ck.index })}>{ck.manual ? t('act.stamp') : t('act.apply')}</button>
                <button type="button" class="mini" onclick={() => act('check-skip', { index: ck.index })}>{t('act.skip')}</button>
              </span>
            {/if}
            {#if ck.canUndo}<span class="ckacts"><button type="button" class="undo" onclick={() => act('check-undo', { index: ck.index })}>{t('act.undo')}</button></span>{/if}
            <span class="stamp dst">{ck.state === 'skipped' ? t('board.skipped') : t('board.done')}</span>
          </div>
        {/each}
        <div class="go">{#if v.allStamped && isGM}{#if v.closing}<button type="button" class="mini red" onclick={() => act('close')}>{t('act.close')}</button>{:else}<button type="button" class="mini red" onclick={() => act('next-round')}>{t('act.nextRound', { n: v.round + 1 })}</button>{/if}{/if}</div>
      </div>
    </div>
  {/if}

  {#if menu}
    <div class="pop" class:direct role="menu" tabindex="-1" style="left:{menu.x}px;top:{menu.y}px" onkeydown={menuKey}>
      <div class="pk">{t('board.menuTitle', { name: menu.row.name, label: menu.cell.label })}</div>
      {#if !menu.cell.corpse}
        {#if !menu.cell.letGo}<button type="button" role="menuitem" onclick={letGo}>{t('move.letGo')}</button>{/if}
        {#if !menu.cell.loud && v?.step === 'play'}<button type="button" role="menuitem" onclick={() => { const m = menu!; menu = null; void act('loud', { soldier: m.row.id, key: m.cell.key }); }}>{t('act.drawAttention')}</button>{/if}
      {/if}

      <p class="note">{t('board.movesOnBoard')}</p>

      {#if direct}
        <!-- The second section: the direct setters the rules do not otherwise expose. Visually
             distinct and below the legal options (ADR-0028). -->
        <div class="pdirect">
          <span class="pmh">{t('direct.section')}</span>
          <div class="drow">
            <button type="button" role="menuitemcheckbox" aria-checked={menu.cell.grab} onclick={() => set('grabbed', { on: !menu!.cell.grab })}>{t('direct.grabbed')}<small>{menu.cell.grab ? t('direct.on') : t('direct.off')}</small></button>
            <button type="button" role="menuitemcheckbox" aria-checked={menu.cell.attention} onclick={() => set('attention', { on: !menu!.cell.attention })}>{t('direct.attention')}<small>{menu.cell.attention ? t('direct.on') : t('direct.off')}</small></button>
            <button type="button" role="menuitemcheckbox" aria-checked={menu.cell.flagLoud} onclick={() => set('loud', { on: !menu!.cell.flagLoud })}>{t('direct.loud')}<small>{menu.cell.flagLoud ? t('direct.on') : t('direct.off')}</small></button>
            <button type="button" role="menuitemcheckbox" aria-checked={menu.row.pinned} onclick={() => set('pinned', { on: !menu!.row.pinned, label: menu!.cell.label })}>{t('direct.pinned')}<small>{menu.row.pinned ? t('direct.on') : t('direct.off')}</small></button>
            <button type="button" role="menuitemcheckbox" aria-checked={menu.row.airborne} onclick={() => set('airborne', { on: !menu!.row.airborne })}>{t('direct.airborne')}<small>{menu.row.airborne ? t('direct.on') : t('direct.off')}</small></button>
            <button type="button" role="menuitemcheckbox" aria-checked={menu.row.spent} onclick={() => set('spent', { on: !menu!.row.spent })}>{t('direct.spent')}<small>{menu.row.spent ? t('direct.on') : t('direct.off')}</small></button>
            <button type="button" role="menuitemcheckbox" aria-checked={!menu.row.left} onclick={() => set('in-out', { in: menu!.row.left })}>{t('direct.inOut')}<small>{menu.row.left ? t('direct.out') : t('direct.in')}</small></button>
          </div>
          <div class="drow steps">
            <span class="dlbl">{t('direct.momentum')}</span>
            <button type="button" role="menuitem" aria-label={t('direct.less')} onclick={() => set('momentum', { value: Math.max(0, menu!.row.momentum - 1) })}>−</button>
            <b>{menu.row.momentum}</b>
            <button type="button" role="menuitem" aria-label={t('direct.more')} onclick={() => set('momentum', { value: menu!.row.momentum + 1 })}>+</button>
            <span class="dlbl">{t('direct.openings')}</span>
            <button type="button" role="menuitem" aria-label={t('direct.less')} disabled={!(menuTitan?.openings.length ?? 0)} onclick={() => set('opening', { on: false })}>−</button>
            <b>{menuTitan?.openings.length ?? 0}</b>
            <button type="button" role="menuitem" aria-label={t('direct.more')} onclick={() => set('opening', { on: true })}>+</button>
          </div>
          <label class="drow">
            <span class="dlbl">{t('direct.place')}</span>
            <select value={menu.row.zone === null ? 'off' : String(menu.row.zone)} onchange={(e) => place(e.currentTarget.value, menu!.row.attachKind)} aria-label={t('board.zone')}>
              {#each zoneNumbers as n (n)}<option value={String(n)}>{t('zone.n', { n })}</option>{/each}
              <option value="off">{t('zone.off')}</option>
            </select>
            <select value={menu.row.attachKind} onchange={(e) => place(menu!.row.zone === null ? 'off' : String(menu!.row.zone), e.currentTarget.value)} aria-label={t('direct.attachment')}>
              {#each ['ground', 'anchored', 'on-body', 'blind-spot', 'grabbed', 'pinned'] as k (k)}<option value={k}>{t(`attach.${k}`)}</option>{/each}
            </select>
          </label>
          {#if menu.row.zone !== null}
            <label class="drow">
              <span class="dlbl">{t('direct.zoneRating', { n: menu.row.zone })}</span>
              <select value={v?.field?.zones.find((z) => z.n === menu!.row.zone)?.rating ?? ''} onchange={(e) => set('zone-rating', { zone: menu!.row.zone, rating: e.currentTarget.value })}>
                {#each v?.ratings ?? [] as r (r.id)}<option value={r.id}>{r.name} ({r.anchors})</option>{/each}
              </select>
            </label>
          {/if}
          {#if menuTitan}
            <label class="drow">
              <span class="dlbl">{t('direct.titanZone', { label: menuTitan.label })}</span>
              <select value={String(menuTitan.zone)} onchange={(e) => set('place-titan', { zone: Number(e.currentTarget.value) })}>
                {#each zoneNumbers as n (n)}<option value={String(n)}>{t('zone.n', { n })}</option>{/each}
              </select>
            </label>
          {/if}
          <label class="drow">
            <span class="dlbl">{t('direct.horse')}</span>
            <select value="" onchange={(e) => set('place-horse', { zone: e.currentTarget.value === 'off' ? null : Number(e.currentTarget.value) })}>
              <option value="" disabled>{menu.row.horseText || t('none')}</option>
              {#each zoneNumbers as n (n)}<option value={String(n)}>{t('zone.n', { n })}</option>{/each}
              <option value="off">{t('zone.off')}</option>
            </select>
          </label>
          <em class="note">{t('direct.logged')}</em>
        </div>
      {/if}
    </div>
  {/if}
</div>
