<script lang="ts">
  /**
   * The GM's Titan card dialog: pick the behavior the card resolves, whom it lands on, and how many
   * Titan Dice it throws, then roll. Everything the tracker worked out is filled in, and everything
   * can be changed: the table keeps the last word (ADR-0019).
   */
  import type { TitanRollChoice, TitanRollView } from '../../dice/titan-dialog.ts';
  import { t } from '../context.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import Dots from './Dots.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<TitanRollView>; sheet: any } = $props();
  // svelte-ignore state_referenced_locally
  const v = sheetState.view;

  let entryId = $state(v.entry);
  let targets = $state<string[]>([...v.targets]);
  let dice = $state(v.dice);
  let show = $state(v.showDice);
  /** A target list the GM has edited stays put when the behavior changes. */
  let touched = $state(false);

  const entry = $derived(v.entries.find((e) => e.id === entryId) ?? v.entries[0] ?? null);

  function pickEntry(id: string) {
    entryId = id;
    const e = v.entries.find((x) => x.id === id);
    if (!e) return;
    dice = e.attackDice ?? 0;
    if (!touched) targets = [...e.suggested];
  }

  function toggle(id: string) {
    touched = true;
    targets = targets.includes(id) ? targets.filter((x) => x !== id) : [...targets, id];
  }

  const successes = $derived(v.successFaces.join(' ' + t('WOF.Roll.behavior.and') + ' '));

  function roll(e: Event) {
    e.preventDefault();
    sheet.submit({ entry: entryId, targets: [...targets], dice: Math.max(0, dice), show } satisfies TitanRollChoice);
  }
</script>

<form class="wof-sheet roll-dialog titan-dialog" onsubmit={roll}>
  <header class="rd-h">
    <img class="rd-ic" src={v.img} alt="" />
    <div>
      <strong>{v.label} · {v.titanName}</strong>
      <span class="lbl">{v.attention}</span>
    </div>
    <span class="cnt"><b>{dice}</b><small>{t('WOF.Roll.die.titanDice')}</small></span>
  </header>

  <div class="rd-grid">
    <label class="lbl" for="{sheet.id}-entry">{t('WOF.Roll.behavior.entry')}</label>
    <select id="{sheet.id}-entry" value={entryId} onchange={(e) => pickEntry(e.currentTarget.value)}>
      {#each v.entries as e (e.id)}
        <option value={e.id}>
          {e.name} · {e.tierLabel}{e.attackDice ? ` · ${t('WOF.Card.Titan.attackDice', { dice: e.attackDice })}` : ''}{e.chosen ? ` · ${t('WOF.Roll.behavior.chosenShort')}` : e.rolled ? ` · ${t('WOF.Roll.behavior.rolledShort')}` : ''}{e.canHappen ? '' : ` · ${t('WOF.Roll.behavior.lacksParts')}`}
        </option>
      {/each}
    </select>

    {#if entry}
      <span class="lbl"></span>
      <div class="rd-entry">
        {#if entry.text}<p class="note fiction">{entry.text}</p>{/if}
        <p class="note">{t('WOF.Roll.behavior.against')} {entry.targets} · {entry.positions}</p>
        {#each entry.effects as fx, i (i)}<p class="note">{fx}</p>{/each}
        {#if !entry.canHappen}<p class="note warn">{t('WOF.Roll.behavior.lacksPartsNote')}</p>{/if}
      </div>
    {/if}

    <span class="lbl">{t('WOF.Roll.behavior.targets')}</span>
    <div class="choices" role="group" aria-label={t('WOF.Roll.behavior.targets')}>
      {#each v.candidates as c (c.id)}
        <label class="choice">
          <input type="checkbox" checked={targets.includes(c.id)} onchange={() => toggle(c.id)} />
          <span>
            {c.name}<em> {c.position}</em>
            {#if c.dodge !== null}<em class="dodged"> {t('WOF.Roll.behavior.dodged', { n: c.dodge })}</em>{/if}
          </span>
        </label>
      {:else}
        <span class="note warn">{t('WOF.Roll.behavior.noCandidates')}</span>
      {/each}
    </div>

    <label class="lbl" for="{sheet.id}-dice">{t('WOF.Roll.behavior.dice')}</label>
    <span class="dicerow">
      <span class="stepper">
        <button type="button" disabled={dice <= 0} aria-label={t('WOF.Roll.behavior.fewer')} onclick={() => (dice = Math.max(0, dice - 1))}>−</button>
        <button type="button" disabled={dice >= v.diceCap} aria-label={t('WOF.Roll.behavior.more')} onclick={() => (dice = Math.min(v.diceCap, dice + 1))}>+</button>
      </span>
      <input id="{sheet.id}-dice" type="number" min="0" max={v.diceCap} value={dice} onchange={(e) => (dice = Math.max(0, Math.min(v.diceCap, Number(e.currentTarget.value) || 0)))} />
      <Dots size="sm" groups={[{ cls: 'dtn', n: Math.min(dice, 20) }]} label={t('WOF.Card.Titan.attackDice', { dice })} />
      <small class="note">{t('WOF.Roll.behavior.successOn', { faces: successes })}</small>
    </span>

    <span class="lbl">{t('WOF.Roll.behavior.dsn')}</span>
    <label class="choice"><input type="checkbox" bind:checked={show} /><span>{t('WOF.Roll.behavior.dsnHint')}</span></label>
  </div>

  <footer class="rd-f">
    <span class="note">{dice ? t('WOF.Roll.behavior.willRoll', { n: dice, targets: targets.length }) : t('WOF.Roll.behavior.willNotRoll')}</span>
    <button class="mini red" type="submit"><img src="systems/wings-of-freedom/assets/icons/roll-push.webp" alt="" />{t(dice ? 'WOF.Roll.behavior.roll' : 'WOF.Roll.behavior.resolve')}</button>
  </footer>
</form>
