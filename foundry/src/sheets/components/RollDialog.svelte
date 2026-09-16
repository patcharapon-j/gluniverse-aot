<script lang="ts">
  /**
   * The roll dialog: attribute and Talent filled in, Bonus Dice, one gear item from those the entry
   * allows, Circumstances, and on a called roll the GM's Stakes (core-plan 2d). The pool preview
   * follows every choice, as the sheet's quick rolls do.
   */
  import type { RollChoice, RollDialogView } from '../../dice/roll-dialog.ts';
  import { buildRollPool } from '../../rules/roll.ts';
  import { t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import PoolDots from './PoolDots.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<RollDialogView>; sheet: any } = $props();
  // svelte-ignore state_referenced_locally
  const v = sheetState.view;

  const initial = buildRollPool(v.inputs, null);
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

  const step = $derived(v.circumstances.find((c) => c.id === circumstance) ?? null);
  const injuryPenalty = $derived(v.injuries.find((i) => i.id === injury)?.penalty ?? 0);
  const pool = $derived(
    buildRollPool(
      {
        ...v.inputs,
        attribute,
        talentChoice: talent,
        gearChoice: gear,
        bonus,
        conditionsMet: met,
        penalties: injuryPenalty ? [...v.inputs.penalties, { source: t('WOF.Roll.injury'), dice: injuryPenalty, entries: 'all' }] : v.inputs.penalties,
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

  <div class="rd-pool"><PoolDots {pool} size="big" /></div>

  <div class="rd-grid">
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

  <footer class="rd-f">
    <span class="note">{pool.penalties.map((p) => `${p.source} −${p.dice}`).join(' · ')}</span>
    <button class="mini red" type="submit" disabled={!!pool.blocked}><img src="systems/wings-of-freedom/assets/icons/roll-push.webp" alt="" />{t('WOF.Roll.dialog.roll')}</button>
  </footer>
</form>
