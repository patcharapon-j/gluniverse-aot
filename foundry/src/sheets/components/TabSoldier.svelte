<script lang="ts">
  import { fx } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { callRoll } from '../../dice/call.ts';
  import { rollAction } from '../../dice/roll-action.ts';
  import { contextMenu, dragItem, tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { deleteItem, openItem, setField, setItem } from '../soldier-ops.ts';
  import { groupRollsByAttribute, icon, type RollView, type SoldierView } from '../soldier-view.ts';
  import Dots from './Dots.svelte';
  import Pips from './Pips.svelte';
  import PoolDots from './PoolDots.svelte';
  import Sec from './Sec.svelte';

  let { view }: { view: SoldierView } = $props();
  const { actor, sheet, state: ss } = sheetContext();
  const s = $derived(view.system);
  const ro = $derived(!view.editable);
  /** The character's own build: locked in Play mode (mode.ts). */
  const roStats = $derived(!view.statsEditable);
  const scaleMin = CONFIG.WOF.attributeScale.min;

  const attributes = CONFIG.WOF.attributes as { id: string; name: string; summary: string }[];
  // The rolls are laid out attribute by attribute (§2), so a player looks under the attribute they mean.
  const groups = $derived(
    groupRollsByAttribute(view.rolls, attributes, {
      attribute: (id) => t(`WOF.Attribute.${id}`),
      fixed: t('WOF.Sheet.rolls.fixed'),
      other: t('WOF.Sheet.rolls.any'),
    }),
  );

  let rollsEl: HTMLElement | undefined = $state();

  async function setBonus(n: number) {
    ss.bonus = ss.bonus === n ? n - 1 : n;
    await sheet.render();
    fx(rollsEl?.querySelectorAll('.dots i.db') ?? null, { scale: [1.6, 1], duration: MOTION.base, ease: MOTION.settle });
  }

  async function roll(r: RollView, el: HTMLElement) {
    fx(el, { scale: [0.96, 1], duration: MOTION.base, ease: MOTION.settle });
    const message = await rollAction(actor, r.id, { bonus: ss.bonus });
    // Bonus Dice are declared for one roll (data/core/bonus-dice-sources.yaml, declare).
    if (message && ss.bonus) {
      ss.bonus = 0;
      sheet.render();
    }
  }

  /** An ad hoc roll on an attribute alone: its Base Dice, plus Stress Dice (rolls_called_by_attribute). */
  async function rollAttribute(id: string, el: HTMLElement) {
    fx(el.closest('.stat'), { scale: [0.97, 1], duration: MOTION.base, ease: MOTION.settle });
    const message = await rollAction(actor, '', { bonus: ss.bonus, attributeAlone: id as any });
    if (message && ss.bonus) {
      ss.bonus = 0;
      sheet.render();
    }
  }

  const talentMenu = (id: string, used: boolean, hasLimit: boolean) => () => [
    { label: t('WOF.Sheet.menu.open'), icon: 'fa-solid fa-book-open', onClick: () => openItem(actor, id) },
    { label: t(used ? 'WOF.Sheet.talent.markReady' : 'WOF.Sheet.talent.markUsed'), icon: 'fa-solid fa-check', visible: view.editable && hasLimit, onClick: () => setItem(actor, id, { 'system.used': !used }) },
    { label: t('WOF.Sheet.menu.remove'), icon: 'fa-solid fa-trash', visible: view.statsEditable, onClick: () => deleteItem(actor, id) },
  ];
</script>

<div class="two">
  <div>
    <div class="block">
      <Sec n="1" title={t('WOF.Sheet.soldier.attributes')} hint={t('WOF.Sheet.soldier.attributesHint')} />
      <div class="stats">
        {#each attributes as a (a.id)}
          {@const v = s.attributes[a.id]}
          {@const rollTip = t('WOF.Sheet.soldier.rollAttr', { attr: t(`WOF.Attribute.${a.id}`), dice: v })}
          <div class="stat s-{a.id}">
            <button type="button" class="attr-roll ic-btn" aria-label={t('WOF.Sheet.soldier.rollAttrLabel', { attr: t(`WOF.Attribute.${a.id}`) })} use:tooltip={rollTip} onclick={(e) => rollAttribute(a.id, e.currentTarget)}>
              <img class="ic" src={icon(`attr-${a.id}`)} alt="" />
              <i class="fa-solid fa-dice-d6 hint" aria-hidden="true"></i>
            </button>
            <div>
              <span class="nm"><button type="button" class="attr-roll nm-btn" tabindex="-1" aria-hidden="true" use:tooltip={rollTip} onclick={(e) => rollAttribute(a.id, e.currentTarget)}>{t(`WOF.Attribute.${a.id}`)}</button>{#if view.keyAttribute === a.id}<span class="stamp key" use:tooltip={t('WOF.Sheet.soldier.keyTip', { max: view.attributeMax[a.id] })}>{t('WOF.Sheet.soldier.key')}</span>{/if}</span>
              <Pips
                value={v}
                max={view.attributeMax[a.id]}
                min={scaleMin}
                disabled={roStats}
                label={t(`WOF.Attribute.${a.id}`)}
                onset={(n) => setField(actor, `system.attributes.${a.id}`, n)}
              />
              <span class="what">{a.summary}</span>
            </div>
            <span class="big" aria-hidden="true">{v}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="block" bind:this={rollsEl}>
      <Sec n="2" title={t('WOF.Sheet.soldier.rolls')} hint={t('WOF.Sheet.soldier.rollsHint')}>
        {#snippet actions()}
          {#if view.isGM}
            <button class="mini" type="button" use:tooltip={t('WOF.Roll.call.tip')} onclick={() => callRoll(actor)}>{t('WOF.Roll.call.button')}</button>
          {/if}
        {/snippet}
      </Sec>
      <div class="bonusbar">
        <span class="lbl">{t('WOF.Sheet.rolls.bonus')}</span>
        <span class="pick" role="group" aria-label={t('WOF.Sheet.rolls.bonus')}>
          {#each Array.from({ length: view.bonusCap }) as _, i (i)}
            <button type="button" aria-pressed={i < ss.bonus} aria-label={t('WOF.Sheet.rolls.bonusN', { n: i + 1 })} onclick={() => setBonus(i + 1)}>
              <i class="db{i < ss.bonus ? '' : ' o'}"></i>
            </button>
          {/each}
        </span>
        <span class="note">{t('WOF.Sheet.rolls.bonusHint', { cap: view.bonusCap })}</span>
      </div>
      {#each groups as g (g.id)}
        {#if g.rolls.length}
          <div class="rollgroup {g.attribute ? `s-${g.attribute}` : 'fixedgroup'}">
            <span class="grouphead">
              {#if g.attribute}<img class="ic s16" src={icon(`attr-${g.attribute}`)} alt="" />{/if}
              <span class="lbl">{g.label}</span>
              {#if g.attribute}<span class="gdice">{s.attributes[g.attribute]}<small>{t('WOF.Sheet.rolls.dice')}</small></span>{/if}
            </span>
            <div class="rolls">
              {#each g.rolls as r (r.id)}
                <button
                  type="button"
                  class="roll {r.attribute ? `s-${r.attribute}` : ''}"
                  disabled={!!r.blockedReason}
                  use:tooltip={[
                    r.summary,
                    r.pool.conditionalPenalties.length || r.pool.conditionalTalents.length
                      ? [...r.pool.conditionalTalents.map((c) => `${c.name} +${c.dice}: ${c.condition}`), ...r.pool.conditionalPenalties.map((c) => `${c.source} −${c.dice}: ${c.condition}`)].join('; ')
                      : r.summary ? '' : r.why,
                  ].filter(Boolean).join(' ')}
                  onclick={(e) => roll(r, e.currentTarget)}
                >
                  <span class="tile"><img src={r.icon} alt="" /></span>
                  <span class="rn">
                    <strong>{r.name}{#if r.context === 'titan-engagement'}<span class="ctx" use:tooltip={t('WOF.Sheet.rolls.titanEngagement')}>{t('WOF.Sheet.rolls.titanShort')}</span>{/if}</strong>
                    {#if r.fixed}<Dots size="sm" groups={[{ cls: 'da', n: r.fixedDice }]} />{:else if !r.blockedReason}<PoolDots pool={r.pool} />{/if}
                    <span class:warn={!!r.blockedReason}>{r.why}</span>
                  </span>
                  <span class="cnt">{r.fixed ? r.fixedDice : r.pool.total}<small>{r.fixed ? t('WOF.Sheet.rolls.d6') : t('WOF.Sheet.rolls.dice')}</small></span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
      <p class="note legend">
        <span><Dots size="sm" groups={[{ cls: 'da', n: 1 }]} />{t('WOF.Sheet.legend.attribute')}</span>
        <span><Dots size="sm" groups={[{ cls: 'dt', n: 1 }]} />{t('WOF.Sheet.legend.talent')}</span>
        <span><Dots size="sm" groups={[{ cls: 'db', n: 1 }]} />{t('WOF.Sheet.legend.bonus')}</span>
        <span><Dots size="sm" groups={[{ cls: 'dx', n: 1 }]} />{t('WOF.Sheet.legend.penalty')}</span>
        <span><Dots size="sm" groups={[{ cls: 'dg', n: 1 }]} />{t('WOF.Sheet.legend.gear')}</span>
        <span><Dots size="sm" groups={[{ cls: 'ds', n: 1 }]} />{t('WOF.Sheet.legend.stress')}</span>
      </p>
    </div>
  </div>

  <aside>
    <div class="box">
      <Sec n="3" title={t('WOF.Sheet.soldier.talents')} />
      {#each view.talents as tal (tal.id)}
        <div class="tal" data-item-id={tal.id} use:dragItem={{ item: actor.items.get(tal.id) }} use:contextMenu={talentMenu(tal.id, tal.used, tal.hasLimit)}>
          <div class="tal-h">
            <img class="ic" src={icon(tal.type === 'dice' ? 'talent-dice' : 'talent-rule')} alt="" />
            <strong><button type="button" class="link" onclick={() => openItem(actor, tal.id)}>{tal.name}</button></strong>
            <Pips
              value={tal.level}
              max={tal.maxLevel}
              min={1}
              cls={tal.type === 'dice' ? 'dt' : 'da'}
              disabled={roStats || tal.maxLevel <= 1}
              label={tal.name}
              onset={(n) => setItem(actor, tal.id, { 'system.level': n })}
            />
            <span class="kind" class:dice={tal.type === 'dice'}>{t(tal.type === 'dice' ? 'WOF.Sheet.talent.dice' : 'WOF.Sheet.talent.rule')}</span>
          </div>
          <p>{tal.text}</p>
          <div class="for">
            <span>{tal.forLine}</span>
            {#if tal.hasLimit}
              <label class="check" use:tooltip={t('WOF.Item.Talent.FIELDS.used.hint')}>
                <input type="checkbox" checked={tal.used} disabled={ro} onchange={(e) => setItem(actor, tal.id, { 'system.used': e.currentTarget.checked })} />
                {t('WOF.Item.Talent.FIELDS.used.label')}
              </label>
            {/if}
          </div>
        </div>
      {:else}
        <p class="empty">{t('WOF.Sheet.soldier.noTalents')}</p>
      {/each}
      {#if view.statsEditable}<p class="dropzone">{t('WOF.Sheet.drop.talents')}</p>{/if}
    </div>

    <div class="box">
      <Sec n="4" title={t('WOF.Sheet.soldier.enlistment')} />
      <dl class="facts">
        <dt>{t('WOF.Actor.Soldier.FIELDS.drive.label')}</dt>
        <dd class="drive"><input type="text" value={s.drive} disabled={roStats} onchange={(e) => setField(actor, 'system.drive', e.currentTarget.value)} /></dd>
        <dt>{t('WOF.Actor.Soldier.FIELDS.drive_named_comrade.label')}</dt>
        <dd><input type="text" value={s.drive_named_comrade} disabled={roStats} onchange={(e) => setField(actor, 'system.drive_named_comrade', e.currentTarget.value)} /></dd>
        <dt>{t('WOF.Sheet.soldier.driveUsed')}</dt>
        <dd>
          <input
            type="checkbox"
            checked={s.drive_used_this_session}
            disabled={ro}
            aria-label={t('WOF.Actor.Soldier.FIELDS.drive_used_this_session.label')}
            onchange={(e) => setField(actor, 'system.drive_used_this_session', e.currentTarget.checked)}
          />
        </dd>
        <dt>{t('WOF.Sheet.soldier.key')}</dt>
        <dd>{view.keyAttribute ? t('WOF.Sheet.soldier.keyLine', { attr: t(`WOF.Attribute.${view.keyAttribute}`), max: view.attributeMax[view.keyAttribute] }) : t('WOF.Sheet.none')}</dd>
        <dt>{t('TYPES.Item.specialty')}</dt>
        <dd>
          {#if view.specialty}
            <span class="itemline" use:dragItem={{ item: actor.items.get(view.specialty.id) }}>
              <img src={view.specialty.icon} alt="" />
              <button type="button" class="link" onclick={() => openItem(actor, view.specialty!.id)}>{view.specialty.name}</button>
            </span>
          {:else}<span class="empty">{t('WOF.Sheet.drop.specialty')}</span>{/if}
        </dd>
        <dt>{t('TYPES.Item.origin')}</dt>
        <dd>
          {#if view.origin}
            <span class="itemline" use:dragItem={{ item: actor.items.get(view.origin.id) }}>
              <button type="button" class="link" onclick={() => openItem(actor, view.origin!.id)}>{view.origin.name}</button>
            </span>
          {:else}<span class="empty">{t('WOF.Sheet.drop.origin')}</span>{/if}
        </dd>
      </dl>
    </div>
  </aside>
</div>
