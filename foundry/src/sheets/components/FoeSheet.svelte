<script lang="ts">
  /** The compact Foe sheet (core-plan 2c): one card per Foe kind row of data/skirmish/foes.yaml, with its play state. */
  import { tick } from 'svelte';
  import { jolt, pulse } from '../../motion/fx.ts';
  import { MOTION } from '../../motion/tokens.ts';
  import { healthLostAfterClick } from '../../rules/harm.ts';
  import { motionMode } from '../../settings.svelte.ts';
  import { proseMirror } from '../actions.ts';
  import { setSheetContext, t } from '../context.ts';
  import type { FoeView } from '../foe-view.ts';
  import type { SheetState } from '../sheet-state.svelte.ts';
  import { icon } from '../soldier-view.ts';
  import Dots from './Dots.svelte';
  import Plate from './Plate.svelte';
  import Sec from './Sec.svelte';
  import Stepper from './Stepper.svelte';

  let { sheetState, sheet }: { sheetState: SheetState<FoeView>; sheet: any } = $props();
  // svelte-ignore state_referenced_locally
  setSheetContext({ sheet, actor: sheet.document, state: sheetState, uid: `wof-${sheet.id}` });
  // svelte-ignore state_referenced_locally
  const actor = sheet.document;

  const view = $derived(sheetState.view);
  const s = $derived(view.system);
  const ro = $derived(!view.editable);
  let hpEl: HTMLElement | undefined = $state();
  let weaponEl: HTMLElement | undefined = $state();
  let weaponNote = $state('');

  const set = (path: string, value: unknown) => actor.update({ [path]: value });

  async function onBox(i: number) {
    const before = view.currentHealth;
    const next = healthLostAfterClick(i, s.health, 0, s.health_lost);
    if (next === s.health_lost) return;
    await set('system.health_lost', next);
    await tick();
    if (view.currentHealth < before) jolt(hpEl);
    else pulse(hpEl);
  }

  async function rollWeapon() {
    const roll = await new foundry.dice.Roll('1d6').evaluate({ allowInteractive: false });
    const row = view.weaponRows.find((r) => r.results.split(', ').map(Number).includes(roll.total));
    if (!row) return;
    await set('system.weapon', row.weapon.id);
    weaponNote = t('WOF.FoeSheet.rolledWeapon', { d6: roll.total, name: row.weapon.name });
    await tick();
    pulse(weaponEl, MOTION.colors.notice);
  }

  const tags = $derived.by(() => {
    const out: { cls: string; text: string }[] = [];
    out.push(s.out ? { cls: 'grave', text: t('WOF.Actor.Foe.FIELDS.out.label') } : view.currentHealth <= 0 ? { cls: 'grave', text: t('WOF.FoeSheet.atZero') } : { cls: 'ok', text: t('WOF.FoeSheet.inFight') });
    if (s.held) out.push({ cls: 'warn', text: t('WOF.Actor.Foe.FIELDS.held.label') });
    if (view.shoot) out.push(s.firearm_loaded ? { cls: 'info', text: t('WOF.Sheet.status.loaded') } : { cls: 'warn', text: t('WOF.Sheet.status.empty') });
    return out;
  });

  const stats = $derived([
    { key: 'attack_dice', value: s.attack_dice, dots: 'da', note: t('WOF.FoeSheet.attackNote') },
    { key: 'guard_dice', value: s.guard_dice, dots: 'da', note: t('WOF.FoeSheet.guardNote') },
    { key: 'grit', value: s.grit, dots: '', note: t('WOF.FoeSheet.gritNote') },
    { key: 'watch', value: s.watch, dots: '', note: t('WOF.FoeSheet.watchNote') },
    { key: 'parley', value: s.parley, dots: '', note: t('WOF.FoeSheet.parleyNote') },
  ]);
</script>

<div class="wof-sheet compact foe-sheet" data-motion={motionMode()}>
  <header class="hdr">
    <Plate {actor} src={view.img} alt={t('WOF.Sheet.header.portrait', { name: view.name })} caption={t('WOF.Sheet.header.plate')} editable={view.editable} />
    <div class="ident">
      <div class="kicker"><img class="ic s16" src={icon('harm-fear')} alt="" />{t('WOF.FoeSheet.kicker')}<span class="serial">{t('WOF.Card.Foe.group', { n: s.group_size })}</span></div>
      <input class="name" type="text" value={view.name} aria-label={t('WOF.FoeSheet.name')} disabled={ro} onchange={(e) => actor.update({ name: e.currentTarget.value.trim() || view.name })} />
      {#if !view.limited}
        <p class="who">{s.who}</p>
        <div class="tags">{#each tags as tag, i (i)}<span class="tag {tag.cls}">{tag.text}</span>{/each}</div>
      {/if}
    </div>
  </header>

  {#if view.limited}
    <div class="body"><p class="empty">{t('WOF.TitanSheet.limited')}</p></div>
  {:else}
    <div class="body">
      <div class="block">
        <Sec n="1" title={t('WOF.FoeSheet.statBlock')} hint={t('WOF.FoeSheet.statHint')} />
        <div class="fstats">
          {#each stats as st (st.key)}
            <div class="tstat">
              <span class="lbl">{t(`WOF.Actor.Foe.FIELDS.${st.key}.label`)}</span>
              <span class="big">{st.value}</span>
              {#if st.dots}<Dots size="sm" groups={[{ cls: st.dots, n: st.value }]} />{/if}
              <span class="note">{st.note}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="two even">
        <div class="block" bind:this={hpEl}>
          <Sec n="2" title={t('WOF.Actor.Foe.FIELDS.health.label')} hint={t('WOF.FoeSheet.healthHint')} />
          <div class="vrow">
            <span class="big" class:red={view.currentHealth <= 1}>{view.currentHealth}<small>/{s.health}</small></span>
            <div class="boxes" role="group" aria-label={t('WOF.Sheet.health.boxes')}>
              {#each Array.from({ length: s.health }) as _, i (i)}
                {@const damaged = i < s.health_lost}
                <button type="button" class="hbox {damaged ? 'damaged' : 'held'}" disabled={ro} aria-label={t(damaged ? 'WOF.Sheet.health.box.damaged' : 'WOF.Sheet.health.box.clean', { n: i + 1 })} onclick={() => onBox(i)}></button>
              {/each}
            </div>
          </div>
          <div class="flags" style="margin-top:8px">
            <label class="check"><input type="checkbox" checked={s.out} disabled={ro} onchange={(e) => set('system.out', e.currentTarget.checked)} />{t('WOF.Actor.Foe.FIELDS.out.label')}</label>
            <label class="check"><input type="checkbox" checked={s.held} disabled={ro} onchange={(e) => set('system.held', e.currentTarget.checked)} />{t('WOF.Actor.Foe.FIELDS.held.label')}</label>
          </div>
          {#if view.currentHealth <= 0}<p class="note red">{t('WOF.FoeSheet.zeroNote')}</p>{/if}
          <div class="grid-form" style="margin-top:8px">
            <span class="lbl">{t('WOF.Actor.Foe.FIELDS.group_size.label')}</span>
            <Stepper value={s.group_size} min={1} label={t('WOF.Actor.Foe.FIELDS.group_size.label')} disabled={ro} onset={(n) => set('system.group_size', n)} />
          </div>
        </div>

        <div class="block" bind:this={weaponEl}>
          <Sec n="3" title={t('WOF.FoeSheet.weapons')} />
          <div class="weapon">
            <img src={view.icons.fight} alt="" />
            <div>
              <span class="lbl">{t('WOF.Card.Foe.fight')}</span>
              {#if view.fixedWeapon}
                <strong>{view.fixedWeapon.name}</strong><span class="note">{view.fixedWeapon.line}</span>
              {:else}
                <table class="wrows">
                  <tbody>
                    {#each view.weaponRows as r (r.results)}
                      <tr class:on={r.weapon.id === s.weapon}><td class="d">{r.results}</td><td><strong>{r.weapon.name}</strong> <span class="note">{r.weapon.line}</span></td></tr>
                    {/each}
                  </tbody>
                </table>
                {#if view.rollNote}<p class="note">{view.rollNote}</p>{/if}
                {#if view.atNight}<p class="note">{t('WOF.FoeSheet.atNight', { replaces: view.atNight.replaces.name, with: view.atNight.with.name })}</p>{/if}
                <div class="opts">
                  <label class="lbl">{t('WOF.Actor.Foe.FIELDS.weapon.label')}
                    <select value={s.weapon} disabled={ro} onchange={(e) => set('system.weapon', e.currentTarget.value)}>
                      <option value="">—</option>
                      {#each view.weaponChoices as w (w.id)}<option value={w.id}>{w.name}</option>{/each}
                    </select>
                  </label>
                  {#if !ro}<button type="button" class="mini" onclick={rollWeapon}>{t('WOF.FoeSheet.rollWeapon')}</button>{/if}
                </div>
                {#if weaponNote}<p class="note">{weaponNote}</p>{/if}
              {/if}
            </div>
          </div>
          <div class="weapon">
            <img src={view.icons.shoot} alt="" />
            <div>
              <span class="lbl">{t('WOF.Card.Foe.shoot')}</span>
              {#if view.shoot}
                <strong>{view.shoot.name}</strong><span class="note">{view.shoot.line}</span>
                <div class="opts">
                  <button type="button" class="stamp {s.firearm_loaded ? 'ok' : ''}" disabled={ro} aria-pressed={s.firearm_loaded} onclick={() => set('system.firearm_loaded', !s.firearm_loaded)}>{t(s.firearm_loaded ? 'WOF.Sheet.status.loaded' : 'WOF.Sheet.status.empty')}</button>
                  <span class="note">{t('WOF.FoeSheet.reloadNote')}</span>
                </div>
              {:else}
                <strong>{t('WOF.Card.Foe.none')}</strong>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <div class="block notes">
        <Sec n="4" title={t('WOF.Actor.Foe.FIELDS.notes.label')} />
        {#key s.notes}
          <div use:proseMirror={{ name: 'system.notes', value: s.notes, enriched: view.notesHTML, editable: view.editable, documentUUID: view.uuid, height: 120, onsave: (html) => set('system.notes', html) }}></div>
        {/key}
      </div>
    </div>
  {/if}
  <footer class="foot"><span class="lbl">{t('WOF.FoeSheet.footLeft')}</span><span class="lbl">{t('WOF.FoeSheet.footRight')}</span></footer>
</div>
