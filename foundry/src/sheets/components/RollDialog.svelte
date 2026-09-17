<script lang="ts">
  /**
   * The roll dialog: attribute and Talent filled in, Bonus Dice, one gear item from those the entry
   * allows, Circumstances, and on a called roll the GM's Stakes (core-plan 2d). The pool preview
   * follows every choice, as the sheet's quick rolls do.
   */
  import type { RollChoice, RollDialogView } from '../../dice/roll-dialog.ts';
  import { buildRollPool } from '../../rules/roll.ts';
  import { napeBonus } from '../../rules/engagement/strikes.ts';
  import { t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import PoolDots from './PoolDots.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<RollDialogView>; sheet: any } = $props();
  // svelte-ignore state_referenced_locally
  const v = sheetState.view;

  const initial = buildRollPool(v.inputs, null);
  /** What the entry does, as the website words it (CONFIG.WOF, built from the site's Actions). */
  const rule = (CONFIG.WOF.actionCatalogById[v.inputs.entry.id]?.text ?? null) as { does: string[]; requires: string[] } | null;
  let attribute = $state(v.inputs.attribute ?? (v.inputs.entry.attribute as RollChoice['attribute']));
  let talent = $state(initial.talent?.id ?? 'none');
  let gear = $state(initial.gear?.id ?? 'none');
  let bonus = $state(Math.min(v.bonus, v.bonusCap));
  let circumstance = $state(v.circumstance);
  let stakesId = $state(v.stakes?.id ?? 'it-does-not-happen');
  let stakesText = $state('');
  let useStakes = $state(!!v.stakes);
  let needs = $state<number | null>(v.needs);
  let met = $state<string[]>([]);
  let passive = $state(false);
  let injury = $state(v.injuries[0]?.id ?? '');

  // The running engagement: what the roll is made against (tracker-plan section 5.1).
  const eg = v.engagement;
  let targetId = $state(eg?.options[0]?.id ?? '');
  const target = $derived(eg?.options.find((o) => o.id === targetId) ?? null);
  let partId = $state(eg?.options[0]?.parts.find((p) => !p.block)?.id ?? '');
  let decoyId = $state(eg?.options[0]?.decoys.find((d) => !d.block)?.id ?? '');
  let spend = $state(0);
  let grapple = $state(false);
  const decoy = $derived(target?.decoys.find((d) => d.id === decoyId) ?? null);
  const targetBonus = $derived.by(() => {
    if (!target) return 0;
    if (eg?.entry === 'nape-strike') {
      const b = napeBonus(Math.min(spend, target.openings), target.grounded, CONFIG.WOF.engagement.bonus, bonus, v.bonusCap);
      return b.openings + b.grounded;
    }
    return grapple ? 0 : target.bonus;
  });
  const targetNeeds = $derived(eg?.entry === 'break-attention' ? (decoy?.needs ?? null) : (target?.needs ?? null));
  $effect(() => {
    if (eg && targetNeeds !== null && !v.lockStakes) needs = targetNeeds;
  });
  const targetBlock = $derived(!eg ? null : !target ? t('WOF.Tracker.block.noTarget') : eg.entry === 'body-part-strike' && !target.parts.find((p) => p.id === partId && !p.block) ? t('WOF.Tracker.block.pickPart') : eg.entry === 'break-attention' && (!decoy || decoy.block) ? t('WOF.Tracker.block.pickDecoy') : target.block);

  const step = $derived(v.circumstances.find((c) => c.id === circumstance) ?? null);
  const injuryPenalty = $derived(v.injuries.find((i) => i.id === injury)?.penalty ?? 0);
  const pool = $derived(
    buildRollPool(
      {
        ...v.inputs,
        attribute,
        talentChoice: talent,
        gearChoice: gear,
        bonus: Math.min(v.bonusCap, bonus + targetBonus),
        conditionsMet: met,
        penalties: [
          ...v.inputs.penalties,
          ...(injuryPenalty ? [{ source: t('WOF.Roll.injury'), dice: injuryPenalty, entries: 'all' as const }] : []),
          ...(target?.penalty ? [{ source: t('WOF.Tracker.liftedPenalty'), dice: target.penalty, entries: 'all' as const }] : []),
        ],
      },
      v.showCircumstances ? step : null,
    ),
  );
  const plusCapped = $derived(step?.kind === 'bonus' ? Math.max(0, Math.min(step.dice, v.bonusCap - bonus)) : 0);

  function toggleMet(source: string, on: boolean) {
    met = on ? [...met, source] : met.filter((m) => m !== source);
  }

  function roll(e: Event) {
    e.preventDefault();
    const stakes = v.showStakes && useStakes ? { id: stakesId, text: [t(`WOF.Roll.stakeMenu.${stakesId}`), stakesText.trim()].filter(Boolean).join(': ') } : v.stakes;
    sheet.submit({
      attribute,
      talent,
      gear,
      bonus,
      circumstance,
      stakes: v.lockStakes ? v.stakes : stakes,
      needs,
      conditionsMet: met,
      passive,
      injury: injury || null,
      target:
        eg && target
          ? {
              combat: eg.combat,
              ...(eg.kind === 'titan' ? { titan: target.id } : { foe: target.id }),
              ...(eg.entry === 'body-part-strike' ? { part: partId } : {}),
              ...(eg.entry === 'break-attention' ? { decoy: decoyId } : {}),
              ...(eg.entry === 'nape-strike' ? { openings: Math.min(spend, target.openings) } : {}),
              ...(eg.grapple && grapple ? { grapple: true } : {}),
              ...(target.forSoldier ? { forSoldier: target.forSoldier } : {}),
            }
          : null,
      targetBonus,
      targetPenalty: target?.penalty ?? 0,
    } satisfies RollChoice);
  }
</script>

<form class="wof-sheet roll-dialog" onsubmit={roll}>
  <header class="rd-h">
    <img class="rd-ic" src={v.icon} alt="" />
    <div>
      <strong>{v.entryName}</strong>
      <span class="lbl">{v.actorName}</span>
    </div>
    <span class="cnt"><b>{pool.total}</b><small>{t('WOF.Sheet.rolls.dice')}</small></span>
  </header>

  {#if rule?.does.length}
    <details class="rd-rule">
      <summary>{t('WOF.Roll.dialog.rule')}</summary>
      {#each rule.does as line, i (i)}<p>{line}</p>{/each}
      {#if rule.requires.length}<ul>{#each rule.requires as line, i (i)}<li>{line}</li>{/each}</ul>{/if}
    </details>
  {/if}

  <div class="rd-pool"><PoolDots {pool} size="big" /></div>

  <div class="rd-grid">
    {#if eg}
      <label class="lbl" for="{sheet.id}-against">{t('WOF.Tracker.roll.against')}</label>
      <select id="{sheet.id}-against" bind:value={targetId}>
        {#each eg.options as o (o.id)}<option value={o.id} disabled={!!o.block}>{o.name}{o.block ? ` (${o.block})` : ''}</option>{/each}
      </select>
      {#if eg.entry === 'body-part-strike' && target}
        <label class="lbl" for="{sheet.id}-part">{t('WOF.Tracker.roll.part')}</label>
        <select id="{sheet.id}-part" bind:value={partId}>
          {#each target.parts as p (p.id)}<option value={p.id} disabled={!!p.block}>{p.name}{p.block ? ` (${p.block})` : ''}</option>{/each}
        </select>
      {/if}
      {#if eg.entry === 'break-attention' && target}
        <label class="lbl" for="{sheet.id}-decoy">{t('WOF.Tracker.roll.decoy')}</label>
        <select id="{sheet.id}-decoy" bind:value={decoyId}>
          {#each target.decoys as d (d.id)}<option value={d.id} disabled={!!d.block}>{d.name}{d.block ? ` (${d.block})` : ` · ${t('WOF.Tracker.roll.needsN', { n: d.needs })}`}</option>{/each}
        </select>
      {/if}
      {#if eg.entry === 'nape-strike' && target}
        <span class="lbl">{t('WOF.Tracker.roll.openings')}</span>
        <span class="pick" role="group" aria-label={t('WOF.Tracker.roll.openings')}>
          {#each Array.from({ length: target.openings }) as _, i (i)}
            <button type="button" aria-pressed={i < spend} aria-label={t('WOF.Tracker.roll.spendN', { n: i + 1 })} onclick={() => (spend = spend === i + 1 ? i : i + 1)}><i class="op{i < spend ? '' : ' o'}"></i></button>
          {:else}<small class="note">{t('WOF.Tracker.roll.noOpenings')}</small>{/each}
          {#if target.grounded}<small class="note">{t('WOF.Tracker.roll.grounded', { n: CONFIG.WOF.engagement.bonus.grounded })}</small>{/if}
        </span>
      {/if}
      {#if eg.grapple}
        <span class="lbl">{t('WOF.Tracker.roll.grapple')}</span>
        <label class="choice"><input type="checkbox" bind:checked={grapple} /><span>{t('WOF.Tracker.roll.grappleHint')}</span></label>
      {/if}
      {#if targetBonus}<span class="lbl"></span><small class="note">{t('WOF.Tracker.roll.targetBonus', { n: targetBonus })}</small>{/if}
    {/if}
    {#if v.attributes.length > 1}
      <label class="lbl" for="{sheet.id}-attr">{t('WOF.Roll.dialog.attribute')}</label>
      <select id="{sheet.id}-attr" bind:value={attribute}>
        {#each v.attributes as a (a.id)}<option value={a.id}>{a.label} {v.inputs.attributes[a.id]}</option>{/each}
      </select>
    {:else}
      <span class="lbl">{t('WOF.Roll.dialog.attribute')}</span>
      <span class="val s-{attribute}">{v.attributes[0]?.label} {pool.attribute?.dice ?? 0}</span>
    {/if}

    {#if v.talents.length}
      <span class="lbl">{t('WOF.Roll.dialog.talent')}</span>
      <div class="choices" role="radiogroup" aria-label={t('WOF.Roll.dialog.talent')}>
        {#each v.talents as tal (tal.id)}
          <label class="choice"><input type="radio" name="talent" value={tal.id} bind:group={talent} /><span>{tal.name} +{tal.dice}{#if tal.condition}<em> {t('WOF.Roll.dialog.if', { condition: tal.condition })}</em>{/if}</span></label>
        {/each}
        <label class="choice"><input type="radio" name="talent" value="none" bind:group={talent} /><span>{t('WOF.Sheet.none')}</span></label>
      </div>
    {/if}

    {#if v.gearAllowed}
      <span class="lbl">{t('WOF.Roll.dialog.gear')}</span>
      {#if v.gear.length}
        <div class="choices" role="radiogroup" aria-label={t('WOF.Roll.dialog.gear')}>
          {#each v.gear as g (g.id)}
            <label class="choice"><input type="radio" name="gear" value={g.id} bind:group={gear} /><span>{g.name} <i class="gd">{g.dice}</i></span></label>
          {/each}
          <label class="choice"><input type="radio" name="gear" value="none" bind:group={gear} /><span>{t('WOF.Roll.dialog.noGear')}</span></label>
        </div>
      {:else}
        <span class="val warn">{pool.attributeAlone ? t('WOF.Sheet.roll.attributeAlone') : t('WOF.Sheet.roll.noGearDice')}</span>
      {/if}
    {/if}

    {#if v.injuries.length}
      <label class="lbl" for="{sheet.id}-inj">{t('WOF.Roll.injury')}</label>
      <select id="{sheet.id}-inj" bind:value={injury}>
        {#each v.injuries as i (i.id)}<option value={i.id}>{i.name}{i.penalty ? ` (−${i.penalty})` : ''}</option>{/each}
      </select>
    {/if}

    {#if v.showBonus}
      <span class="lbl">{t('WOF.Roll.dialog.bonus')}</span>
      <span class="pick" role="group" aria-label={t('WOF.Roll.dialog.bonus')}>
        {#each Array.from({ length: v.bonusCap }) as _, i (i)}
          <button type="button" aria-pressed={i < bonus} aria-label={t('WOF.Sheet.rolls.bonusN', { n: i + 1 })} onclick={() => (bonus = bonus === i + 1 ? i : i + 1)}>
            <i class="db{i < bonus ? '' : ' o'}"></i>
          </button>
        {/each}
        <small class="note">{t('WOF.Roll.dialog.bonusHint')}</small>
      </span>
    {/if}

    {#if v.showCircumstances}
      <span class="lbl">{t('WOF.Roll.circumstances')}</span>
      <div>
        <span class="seg ladder" role="radiogroup" aria-label={t('WOF.Roll.circumstances')}>
          {#each v.circumstances as c (c.id)}
            <button type="button" role="radio" aria-checked={circumstance === c.id} class:on={circumstance === c.id} class={c.kind} disabled={v.lockCircumstances && circumstance !== c.id} onclick={() => (circumstance = c.id)} data-tooltip={c.dice ? `${c.dice > 0 ? '+' : ''}${c.dice}` : ''}>{c.name}</button>
          {/each}
        </span>
        {#if step?.kind === 'bonus' && plusCapped < step.dice}<p class="note warn">{t('WOF.Roll.dialog.capped', { n: plusCapped })}</p>{/if}
      </div>
    {/if}

    {#each v.conditionals as c (c.source)}
      <span class="lbl">{c.source}</span>
      <label class="choice"><input type="checkbox" checked={met.includes(c.source)} onchange={(e) => toggleMet(c.source, e.currentTarget.checked)} /><span>−{c.dice}: {c.condition}</span></label>
    {/each}

    {#if v.showStakes}
      <span class="lbl">{t('WOF.Roll.stakes')}</span>
      {#if v.lockStakes}
        <span class="val">{v.stakes?.text}</span>
      {:else}
        <div class="stakes-pick">
          <label class="choice"><input type="checkbox" bind:checked={useStakes} onchange={() => { if (useStakes && needs === null) needs = CONFIG.WOF.calledRoll.needs; }} /><span>{t('WOF.Roll.dialog.calledRoll')}</span></label>
          {#if useStakes}
            <select bind:value={stakesId} aria-label={t('WOF.Roll.stakes')}>
              {#each v.stakesMenu as m (m.id)}<option value={m.id}>{m.label}</option>{/each}
            </select>
            <input type="text" bind:value={stakesText} placeholder={t('WOF.Roll.dialog.stakesDetail')} aria-label={t('WOF.Roll.dialog.stakesDetail')} />
          {/if}
        </div>
      {/if}
    {/if}

    <label class="lbl" for="{sheet.id}-needs">{t('WOF.Roll.needs')}</label>
    <input id="{sheet.id}-needs" class="needs" type="number" min="1" max="12" placeholder="—" value={needs ?? ''} disabled={v.lockStakes} onchange={(e) => (needs = e.currentTarget.value ? Math.max(1, Number(e.currentTarget.value)) : null)} />

    {#if v.passiveOption}
      <span class="lbl">{t('WOF.Roll.passive')}</span>
      <label class="choice"><input type="checkbox" bind:checked={passive} /><span>{t('WOF.Roll.dialog.passiveHint')}</span></label>
    {/if}
  </div>

  {#each v.notes as n, i (i)}<p class="note">{n}</p>{/each}
  {#if pool.blocked}<p class="note warn">{t('WOF.Roll.dialog.blocked')}</p>{/if}
  {#if targetBlock}<p class="note warn">{targetBlock}</p>{/if}

  <footer class="rd-f">
    <span class="note">{pool.penalties.map((p) => `${p.source} −${p.dice}`).join(' · ')}</span>
    <button class="mini red" type="submit" disabled={!!pool.blocked || !!targetBlock}><img src="systems/wings-of-freedom/assets/icons/roll-push.webp" alt="" />{t('WOF.Roll.dialog.roll')}</button>
  </footer>
</form>
