/**
 * The Soldier sheet (ADR-0027, core-plan 2b): an ActorSheetV2 whose content is one Svelte 5 tree.
 * _replaceHTML mounts it once and afterwards only swaps the view it reads; _onClose unmounts it.
 * Drops, the portrait picker, and window controls stay Foundry's.
 */
import { mount, unmount } from 'svelte';
import { SYSTEM_ID } from '../config.ts';
import SoldierSheetRoot from './components/SoldierSheet.svelte';
import { SheetState } from './sheet-state.svelte.ts';
import { buildSoldierView, type SoldierView } from './soldier-view.ts';
import { chooseInjury, injuryData } from './soldier-ops.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

export function defineSoldierSheet() {
  const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;

  class SoldierSheet extends ActorSheetV2 {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-soldier-sheet'],
      position: { width: 860, height: 760 },
      window: { resizable: true },
      form: { submitOnChange: false, closeOnSubmit: false },
    };

    #component: Record<string, any> | null = null;
    #state: SheetState<SoldierView> | null = null;
    /** The tab and the next roll's Bonus Dice outlive a re-mount while the sheet object lives. */
    #tab = 'soldier';

    get title() {
      return this.document.name;
    }

    /** The mounted component's state, for tests in the browser console. */
    get svelteState() {
      return this.#state;
    }

    async _prepareContext(options: any) {
      const context = await super._prepareContext(options);
      const actor = this.document;
      const TextEditor = foundry.applications.ux.TextEditor.implementation;
      const notesHTML = await TextEditor.enrichHTML(actor.system.notes ?? '', { relativeTo: actor, secrets: actor.isOwner, rollData: {} });
      context.view = buildSoldierView(actor, { editable: this.isEditable, notesHTML, bonus: this.#state?.bonus ?? 0 });
      return context;
    }

    async _renderHTML(context: any) {
      return context.view as SoldierView;
    }

    _replaceHTML(view: SoldierView, content: HTMLElement) {
      if (this.#component && this.#state) {
        this.#state.view = view;
        return;
      }
      content.classList.add('wof-content');
      this.#state = new SheetState(view, this.#tab);
      this.#component = mount(SoldierSheetRoot, { target: content, props: { sheetState: this.#state, sheet: this } });
    }

    _onClose(options: any) {
      super._onClose(options);
      if (this.#state) this.#tab = this.#state.tab;
      if (this.#component) unmount(this.#component);
      this.#component = null;
      this.#state = null;
    }

    /** Re-runs _prepareContext so a Bonus Dice change shows in every pool without a document update. */
    refreshView() {
      return this.render();
    }

    async _onDropItem(event: DragEvent, item: any) {
      const actor = this.document;
      if (!actor.isOwner || !this.isEditable) return null;
      if (item.parent?.uuid === actor.uuid) return super._onDropItem(event, item);
      const Item = foundry.documents.Item.implementation;
      const data = item.toObject();
      delete data._id;
      data.flags ??= {};
      if (item.inCompendium) {
        data._stats ??= {};
        data._stats.compendiumSource = item.uuid;
      }

      switch (item.type) {
        case 'origin':
        case 'specialty': {
          const old = actor.items.filter((i: any) => i.type === item.type).map((i: any) => i.id);
          if (old.length) await actor.deleteEmbeddedDocuments('Item', old);
          const created = await Item.create(data, { parent: actor });
          ui.notifications.info(t('WOF.Sheet.drop.set', { name: item.name, what: t(`TYPES.Item.${item.type}`) }));
          return created;
        }
        case 'talent': {
          const held = actor.items.find((i: any) => i.type === 'talent' && i.system.talent_id === item.system.talent_id);
          if (held) {
            if (held.system.level >= held.system.max_level) {
              ui.notifications.warn(t('WOF.Sheet.drop.talentMax', { name: held.name }));
              return null;
            }
            await held.update({ 'system.level': held.system.level + 1 });
            ui.notifications.info(t('WOF.Sheet.drop.talentUp', { name: held.name, level: held.system.level }));
            return held;
          }
          data.system.level = 1;
          data.system.used = false;
          return Item.create(data, { parent: actor });
        }
        case 'critical-injury': {
          const choice = await chooseInjury(item);
          if (!choice) return null;
          return Item.create({ ...injuryData(item, choice), _stats: data._stats }, { parent: actor });
        }
        case 'gear': {
          const sub = item.system.subtype;
          if ((sub === 'odm' || sub === 'horse') && actor.items.some((i: any) => i.type === 'gear' && i.system.subtype === sub)) {
            ui.notifications.warn(t('WOF.Sheet.drop.onlyOne', { name: item.name }));
            return null;
          }
          if (sub === 'blade-set') {
            const handlesFull = actor.items.some((i: any) => i.type === 'gear' && i.system.subtype === 'blade-set' && i.system.in_handles);
            data.system.in_handles = !handlesFull;
          }
          return Item.create(data, { parent: actor });
        }
        default:
          ui.notifications.warn(t('WOF.Sheet.drop.notHere', { type: t(`TYPES.Item.${item.type}`) }));
          return null;
      }
    }
  }

  // The sheet id Foundry stores is scope + class name; keep it stable under minification.
  Object.defineProperty(SoldierSheet, 'name', { value: 'SoldierSheet' });
  return SoldierSheet;
}

export function registerSheets() {
  const SoldierSheet = defineSoldierSheet();
  foundry.documents.collections.Actors.registerSheet(SYSTEM_ID, SoldierSheet, {
    types: ['soldier'],
    makeDefault: true,
    label: 'WOF.Sheet.label.soldier',
    themes: null,
  });
}
