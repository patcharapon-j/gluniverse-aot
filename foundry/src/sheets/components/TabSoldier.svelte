<script lang="ts">
  /**
   * The Soldier tab of the Refined Dossier (sheet-overhaul plan, step 4): the quick-roll label line
   * (Bonus Dice, the Stress Dice every attribute roll adds, Call a roll), each attribute head with
   * its rolls filed under it in columns, the fixed rolls last; beside them the compact Talents, the
   * Drive, the Enlistment lines and the dice key.
   */
  import { fx } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { callRoll } from '../../dice/call.ts';
  import { rollAction } from '../../dice/roll-action.ts';
  import { contextMenu, detailHover, dragItem, tooltip } from '../actions.ts';
  import { hoverCards, sheetContext, t } from '../context.ts';
  import { deleteItem, openItem, setField, setItem } from '../soldier-ops.ts';
  import { groupRollsByAttribute, icon, type RollView, type SoldierView, type TalentView } from '../soldier-view.ts';
  import Dots from './Dots.svelte';
  import Pips from './Pips.svelte';
  import PoolDots from './PoolDots.svelte';

  let { view }: { view: SoldierView } = $props();
  const { actor, sheet, state: ss, uid } = sheetContext();
  const hover = hoverCards();
  const s = $derived(view.system);
  const d = $derived(view.derived);
  const ro = $derived(!view.editable);
  /** The character's own build: locked in Play mode (mode.ts). */
  const roStats = $derived(!view.statsEditable);
  const scaleMin = CONFIG.WOF.attributeScale.min;

  const attributes = CONFIG.WOF.attributes as { id: string; name: string; summary: string }[];
  // The rolls are filed attribute by attribute (§2), so a player looks under the attribute they mean.
  const groups = $derived(
    groupRollsByAttribute(view.rolls, attributes, {
      attribute: (id) => t(`WOF.Attribute.${id}`),
      fixed: t('WOF.Sheet.rolls.fixed'),
      other: t('WOF.Sheet.rolls.any'),
    }),
  );
  const summaryOf = (id: string) => attributes.find((a) => a.id === id)?.summary ?? '';

  let rollsEl: HTMLElement | undefined = $state();

  /** A press or a pop through fx(); the inline transform is cleared after, so the CSS hover states keep working. */
  function bump(targets: Element[], from: number) {
    const els = targets.filter((e): e is HTMLElement => e instanceof HTMLElement);
    fx(els, {
      scale: [from, 1],
      duration: MOTION.base,
      ease: MOTION.settle,
      onComplete: () => els.forEach((e) => e.style.removeProperty('transform')),
    });
  }

  async function setBonus(n: number, el: HTMLElement) {
    ss.bonus = ss.bonus === n ? n - 1 : n;
    await sheet.render();
    // A glyph keeps its own transform (the Bonus Die is a turned square), so its group pops instead.
    const grps = new Set([...(rollsEl?.querySelectorAll('.qrows .dots i.db') ?? [])].map((i) => i.parentElement!));
    bump([el, ...grps], 1.4);
  }

  /** Bonus Dice are declared for one roll (data/core/bonus-dice-sources.yaml, declare). */
  function spent(message: unknown) {
    if (message && ss.bonus) {
      ss.bonus = 0;
      sheet.render();
    }
  }

  async function roll(r: RollView, el: HTMLElement) {
    if (r.blockedReason) return;
    bump([el], 0.96);
    spent(await rollAction(actor, r.id, { bonus: ss.bonus }));
  }

  /** An ad hoc roll on an attribute alone: its Base Dice, plus Stress Dice (rolls_called_by_attribute). */
  async function rollAttribute(id: string, el: HTMLElement) {
    const head = el.closest('.ahead');
    if (head) bump([head], 0.97);
    spent(await rollAction(actor, '', { bonus: ss.bonus, attributeAlone: id as any }));
  }

  const talentMenu = (tal: TalentView) => () => [
    { label: t('WOF.Sheet.menu.open'), icon: 'fa-solid fa-book-open', onClick: () => openItem(actor, tal.id) },
    { label: t(tal.used ? 'WOF.Sheet.talent.markReady' : 'WOF.Sheet.talent.markUsed'), icon: 'fa-solid fa-check', visible: view.editable && tal.hasLimit, onClick: () => setItem(actor, tal.id, { 'system.used': !tal.used }) },
    { label: t('WOF.Sheet.menu.remove'), icon: 'fa-solid fa-trash', visible: view.statsEditable, onClick: () => deleteItem(actor, tal.id) },
  ];

  function toggleTalent(id: string) {
    if (ss.openTalents.has(id)) ss.openTalents.delete(id);
    else ss.openTalents.add(id);
  }

  const describedBy = (id: string) => (hover.layers[0]?.card.id === id ? `${hover.uid}-0` : undefined);
  const limitName = (tal: TalentView) => t(`WOF.TalentLimit.${tal.limit}`);
</script>

<div class="sol">
  <div class="sol-main" bind:this={rollsEl}>
    <div class="rh">
      <span class="t">{t('WOF.Sheet.soldier.rolls')}</span>
      <span class="bonus" role="group" aria-label={t('WOF.Sheet.rolls.bonus')} use:tooltip={t('WOF.Sheet.rolls.bonusHint', { cap: view.bonusCap })}>
        <span class="lbl">{t('WOF.Sheet.rolls.bonusLabel')}</span>
        {#each Array.from({ length: view.bonusCap }) as _, i (i)}
          <button type="button" aria-pressed={i < ss.bonus} aria-label={t('WOF.Sheet.rolls.bonusN', { n: i + 1 })} onclick={(e) => setBonus(i + 1, e.currentTarget)}>
            <i class="db{i < ss.bonus ? '' : ' o'}"></i>
          </button>
        {/each}
        <span class="note">{t('WOF.Sheet.rolls.bonusNext', { cap: view.bonusCap })}</span>
      </span>
      <span class="sx note">
        {#if d.stress_effective > 0}
          <Dots size="sm" groups={[{ cls: 'ds', n: d.stress_effective }]} />{t('WOF.Sheet.rolls.stressAdds', { n: d.stress_effective })}
        {:else}
          {t('WOF.Sheet.rolls.noStress')}
        {/if}
      </span>
      {#if view.isGM}
        <button class="mini call" type="button" use:tooltip={t('WOF.Roll.call.tip')} onclick={() => callRoll(actor)}>{t('WOF.Roll.call.button')}</button>
      {/if}
    </div>

    <div class="groups">
      {#each groups as g (g.id)}
        <div class="agrp {g.attribute ? `s-${g.attribute}` : 'plain'}">
          {#if g.attribute}
            {@const a = g.attribute}
            {@const v = s.attributes[a]}
            {@const name = t(`WOF.Attribute.${a}`)}
            <div class="ahead" class:edit={!roStats}>
              <button
                type="button"
                class="ahead-b"
                aria-label={t('WOF.Sheet.soldier.rollAttrLabel', { attr: name })}
                use:tooltip={t('WOF.Sheet.soldier.headTip', { summary: summaryOf(a), attr: name, dice: v })}
                onclick={(e) => rollAttribute(a, e.currentTarget)}
              >
                <img src={icon(`attr-${a}`)} alt="" />
                <span class="nm"><span class="nmt">{name}</span>{#if view.keyAttribute === a}<span class="stamp key" use:tooltip={t('WOF.Sheet.soldier.keyTip', { max: view.attributeMax[a] })}>{t('WOF.Sheet.soldier.key')}</span>{/if}</span>
              </button>
              <span class="pipset">
                <Pips value={v} max={view.attributeMax[a]} min={scaleMin} disabled={roStats} label={name} onset={(n) => setField(actor, `system.attributes.${a}`, n)} />
              </span>
              <span class="v" aria-hidden="true">{v}</span>
            </div>
          {:else}
            <div class="ahead fixed">
              <img src={icon('die-base')} alt="" />
              <span class="nm"><span class="nmt">{g.label}</span></span>
            </div>
          {/if}
          <ul class="qrows">
            {#each g.rolls as r (r.id)}
              {@const blocked = !!r.blockedReason}
              <li>
                <button
                  type="button"
                  class="qroll"
                  class:blocked
                  aria-disabled={blocked ? 'true' : undefined}
                  aria-describedby={describedBy(r.id)}
                  use:detailHover={{ hover, card: () => r.detail }}
                  onclick={(e) => roll(r, e.currentTarget)}
                >
                  <img src={r.icon} alt="" />
                  <span class="rn">{r.name}{#if r.context === 'titan-engagement'}<span class="ctx" use:tooltip={t('WOF.Sheet.rolls.titanEngagement')}>{t('WOF.Sheet.rolls.titanShort')}</span>{/if}<span class="sr">. {r.why}</span></span>
                  {#if r.fixed}<Dots size="sm" groups={[{ cls: 'da', n: r.fixedDice }]} />{:else if !blocked}<PoolDots pool={r.pool} />{:else}<span></span>{/if}
                  {#if blocked}
                    <span class="tot none" aria-hidden="true"></span>
                  {:else if r.fixed}
                    <span class="tot">{r.fixedDice}<small>{t('WOF.Sheet.rolls.d6')}</small></span>
                  {:else}
                    <span class="tot">{r.pool.total}</span>
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>

  <aside class="sol-side">
    <div class="card">
      <h3 class="sec">{t('WOF.Sheet.soldier.talents')}{#if view.talents.length}<span class="hint">{t('WOF.Sheet.talent.count', { n: view.talents.length })}</span>{/if}</h3>
      {#if view.talents.length}
        <ul class="tals">
          {#each view.talents as tal (tal.id)}
            {@const open = ss.openTalents.has(tal.id)}
            {@const xid = `${uid}-tal-${tal.id}`}
            <li class="dtal" class:open data-item-id={tal.id}>
              <div class="dtal-h" use:dragItem={{ item: actor.items.get(tal.id) }} use:contextMenu={talentMenu(tal)} use:detailHover={{ hover, card: () => tal.detail }}>
                <button
                  type="button"
                  class="tal-b"
                  aria-expanded={open}
                  aria-controls={xid}
                  aria-describedby={describedBy(tal.id)}
                  aria-label={`${tal.name}. ${t(open ? 'WOF.Sheet.talent.collapse' : 'WOF.Sheet.talent.expand')}`}
                  onclick={() => toggleTalent(tal.id)}
                >
                  <img src={icon(tal.type === 'dice' ? 'talent-dice' : 'talent-rule')} alt="" />
                  <strong>{tal.name}</strong>
                </button>
                <span class="pipset" class:edit={!roStats && tal.maxLevel > 1}>
                  <Pips variant="square" value={tal.level} max={tal.maxLevel} min={1} disabled={roStats || tal.maxLevel <= 1} label={tal.name} onset={(n) => setItem(actor, tal.id, { 'system.level': n })} />
                </span>
                <span class="dkind {tal.type}">{t(tal.type === 'dice' ? 'WOF.Sheet.talent.dice' : 'WOF.Sheet.talent.rule')}</span>
                <span class="chev" aria-hidden="true"></span>
                {#if tal.hasLimit}
                  <button
                    type="button"
                    class="lim"
                    role="checkbox"
                    aria-checked={tal.used}
                    disabled={ro}
                    aria-label={t(tal.used ? 'WOF.Sheet.talent.usedAria' : 'WOF.Sheet.talent.readyAria', { name: tal.name })}
                    use:tooltip={t(tal.used ? 'WOF.Sheet.talent.usedTip' : 'WOF.Sheet.talent.readyTip', { limit: limitName(tal) })}
                    onclick={() => setItem(actor, tal.id, { 'system.used': !tal.used })}
                  ></button>
                {/if}
              </div>
              <div class="tal-x" id={xid} inert={!open}>
                <div>
                  {#if tal.text}<p>{tal.text}</p>{/if}
                  <div class="for">
                    <span>{tal.forLine}</span>
                    <button type="button" class="open" onclick={() => openItem(actor, tal.id)}>{t('WOF.Sheet.menu.open')}</button>
                  </div>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="empty">{t('WOF.Sheet.soldier.noTalents')}</p>
      {/if}
      {#if view.statsEditable}<p class="drophint">{t('WOF.Sheet.drop.talents')}</p>{/if}
    </div>

    <div class="card">
      <h3 class="sec">{t('WOF.Actor.Soldier.FIELDS.drive.label')}</h3>
      {#if roStats}
        <p class="drive" class:none={!s.drive}>{s.drive || t('WOF.Sheet.none')}</p>
      {:else}
        <input class="drive-in" type="text" value={s.drive} aria-label={t('WOF.Actor.Soldier.FIELDS.drive.label')} onchange={(e) => setField(actor, 'system.drive', e.currentTarget.value)} />
      {/if}
      <div class="dline">
        <span class="comrade">
          {t('WOF.Sheet.soldier.comrade')}
          {#if roStats}
            <b class:none={!s.drive_named_comrade}>{s.drive_named_comrade || t('WOF.Sheet.none')}</b>
          {:else}
            <input type="text" value={s.drive_named_comrade} aria-label={t('WOF.Actor.Soldier.FIELDS.drive_named_comrade.label')} onchange={(e) => setField(actor, 'system.drive_named_comrade', e.currentTarget.value)} />
          {/if}
        </span>
        <span class="chk">
          <button
            type="button"
            class="lim"
            role="checkbox"
            aria-checked={!!s.drive_used_this_session}
            disabled={ro}
            aria-label={t('WOF.Actor.Soldier.FIELDS.drive_used_this_session.label')}
            onclick={() => setField(actor, 'system.drive_used_this_session', !s.drive_used_this_session)}
          ></button>
          <span aria-hidden="true">{t('WOF.Sheet.soldier.used')}</span>
        </span>
      </div>
    </div>

    <div class="card">
      <h3 class="sec">{t('WOF.Sheet.soldier.enlistment')}</h3>
      <div class="dline">
        <span>{t('WOF.Sheet.soldier.key')}</span>
        {#if view.keyAttribute}
          <b use:tooltip={t('WOF.Sheet.soldier.keyTip', { max: view.attributeMax[view.keyAttribute] })}>{t('WOF.Sheet.soldier.keyLine', { attr: t(`WOF.Attribute.${view.keyAttribute}`), max: view.attributeMax[view.keyAttribute] })}</b>
        {:else}
          <b class="none">{t('WOF.Sheet.none')}</b>
        {/if}
      </div>
      <div class="dline">
        <span>{t('WOF.Sheet.soldier.load')}</span>
        <b class:over={d.overloaded} use:tooltip={t('WOF.Sheet.soldier.loadTip')}>{t('WOF.Sheet.soldier.loadLine', { items: d.items_carried, limit: d.carrying_limit })}</b>
      </div>
    </div>

    <div class="dlegend" role="group" aria-label={t('WOF.Sheet.legend.label')}>
      <span><Dots size="sm" groups={[{ cls: 'da', n: 1 }]} />{t('WOF.Sheet.legend.attribute')}</span>
      <span><Dots size="sm" groups={[{ cls: 'dt', n: 1 }]} />{t('WOF.Sheet.legend.talent')}</span>
      <span><Dots size="sm" groups={[{ cls: 'dg', n: 1 }]} />{t('WOF.Sheet.legend.gear')}</span>
      <span><Dots size="sm" groups={[{ cls: 'db', n: 1 }]} />{t('WOF.Sheet.legend.bonus')}</span>
      <span><Dots size="sm" groups={[{ cls: 'dx', n: 1 }]} />{t('WOF.Sheet.legend.penalty')}</span>
      <span><Dots size="sm" groups={[{ cls: 'ds', n: 1 }]} />{t('WOF.Sheet.legend.stress')}</span>
    </div>
  </aside>
</div>
