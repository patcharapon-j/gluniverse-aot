<script lang="ts">
  /**
   * The Dossier's slim header (sheet-overhaul plan, 3.1), shared by the Soldier and the Squadmate:
   * the small clipped plate; the kicker line with the file serial, the mode switch and the Token
   * door at its right end; the name with the status tags on its right (Standing or Down and
   * Airborne toggle their fields); one meta line.
   *
   * With no snippets it is the Soldier's header: the serial reads the file number and the meta line
   * is read-only (Specialty and Origin open on click, Rank and Class Rank as text; Haven and Canon
   * Tie live on the Record form). The Squadmate passes its own `serial` and `meta`.
   */
  import type { Snippet } from 'svelte';
  import { thud } from '../../motion/fx.ts';
  import { contextMenu, dragItem, tooltip } from '../actions.ts';
  import { sheetContext, t } from '../context.ts';
  import { soldierTags, type HeaderTag } from '../header-tags.ts';
  import { deleteItem, openItem, setField } from '../soldier-ops.ts';
  import { icon, type SoldierView } from '../soldier-view.ts';
  import ModeSwitch from './ModeSwitch.svelte';
  import Plate from './Plate.svelte';
  import TokenButton from './TokenButton.svelte';

  let {
    view,
    kicker = t('WOF.Sheet.header.kicker'),
    nameLabel = t('WOF.Sheet.header.name'),
    nameDisabled,
    tags,
    serial,
    meta,
  }: {
    view: SoldierView;
    kicker?: string;
    nameLabel?: string;
    /** Defaults to the Edit-mode lock (`statsEditable`). */
    nameDisabled?: boolean;
    /** Defaults to the Soldier's tags (header-tags.ts). */
    tags?: HeaderTag[];
    serial?: Snippet;
    meta?: Snippet;
  } = $props();
  const { actor } = sheetContext();
  const s = $derived(view.system);
  const shown = $derived(tags ?? soldierTags(view));
  const lockName = $derived(nameDisabled ?? !view.statsEditable);

  const fileNo = $derived(`${t('WOF.Sheet.header.file')} ${view.id.slice(0, 3).toUpperCase()}-${view.id.slice(3, 5).toUpperCase()}`);
  const ordinal = (n: number | null | undefined) => (n === null || n === undefined ? '' : t('WOF.Sheet.ordinal', { n }));

  let row: HTMLElement | undefined = $state();

  const itemMenu = (id: string | undefined) => () =>
    id
      ? [
          { label: t('WOF.Sheet.menu.open'), icon: 'fa-solid fa-book-open', onClick: () => openItem(actor, id) },
          { label: t('WOF.Sheet.menu.remove'), icon: 'fa-solid fa-trash', visible: view.statsEditable, onClick: () => deleteItem(actor, id) },
        ]
      : [];

  /** Down and Airborne: the same fields as the band's Down stamp and the Kit tab's Airborne box. */
  async function toggle(tag: HeaderTag) {
    if (tag.disabled || !tag.toggle) return;
    await setField(actor, tag.toggle === 'down' ? 'system.down' : 'system.airborne', !tag.pressed);
    thud(row?.querySelector(`[data-toggle="${tag.toggle}"]`));
  }
</script>

<header class="hdr">
  <Plate {actor} size="slim" src={view.img} alt={t('WOF.Sheet.header.portrait', { name: view.name })} editable={view.editable} />

  <div class="ident">
    <div class="kicker">
      <img class="ic s16" src={view.specialty?.icon ?? icon('brand-emblem')} alt="" />
      <span class="kt">{kicker}</span>
      {#if serial}{@render serial()}{:else}<span class="serial">{fileNo}</span>{/if}
      <span class="hdr-acts">
        <ModeSwitch mode={view.mode} editable={view.editable} />
        <TokenButton {actor} editable={view.editable} />
      </span>
    </div>
    <div class="nrow" bind:this={row}>
      <input
        class="name"
        type="text"
        value={view.name}
        aria-label={nameLabel}
        disabled={lockName}
        onchange={(e) => actor.update({ name: e.currentTarget.value.trim() || view.name })}
      />
      <div class="tags">
        {#each shown as tag, i (tag.toggle ?? i)}
          {#if tag.toggle}
            <button
              type="button"
              class="tag {tag.cls}"
              data-toggle={tag.toggle}
              aria-pressed={tag.pressed}
              disabled={tag.disabled}
              use:tooltip={tag.tip}
              onclick={() => toggle(tag)}
            >{#if tag.img}<img src={tag.img} alt="" />{/if}{tag.text}</button>
          {:else}
            <span class="tag {tag.cls}" use:tooltip={tag.tip}>{#if tag.img}<img src={tag.img} alt="" />{/if}{tag.text}</span>
          {/if}
        {/each}
      </div>
    </div>
    <div class="meta">
      {#if meta}
        {@render meta()}
      {:else}
        <span use:contextMenu={itemMenu(view.specialty?.id)} use:dragItem={view.specialty ? { item: actor.items.get(view.specialty.id) } : null}>
          {t('TYPES.Item.specialty')}
          {#if view.specialty}
            <button type="button" class="link" onclick={() => openItem(actor, view.specialty!.id)}>{view.specialty.name}</button>
          {:else}<b class="blank" use:tooltip={t('WOF.Sheet.drop.hint')}>{t('WOF.Sheet.none')}</b>{/if}
        </span>
        <span use:contextMenu={itemMenu(view.origin?.id)} use:dragItem={view.origin ? { item: actor.items.get(view.origin.id) } : null}>
          {t('TYPES.Item.origin')}
          {#if view.origin}
            <button type="button" class="link" onclick={() => openItem(actor, view.origin!.id)}>{view.origin.name}</button>
          {:else}<b class="blank" use:tooltip={t('WOF.Sheet.drop.hint')}>{t('WOF.Sheet.none')}</b>{/if}
        </span>
        <span>{t('WOF.Actor.Soldier.FIELDS.rank.label')} <b>{t(`WOF.Rank.${s.rank}`)}</b></span>
        {#if s.class_rank}<span>{t('WOF.Actor.Soldier.FIELDS.class_rank.label')} <b>{ordinal(s.class_rank)}</b></span>{/if}
      {/if}
    </div>
  </div>
</header>
