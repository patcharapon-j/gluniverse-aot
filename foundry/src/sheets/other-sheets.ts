/**
 * The Titan and Foe sheets and the item slips (core-plan 2c), each an ApplicationV2 document sheet
 * around one Svelte tree (svelte-sheet.ts).
 */
import FoeSheetRoot from './components/FoeSheet.svelte';
import ItemSheetRoot from './components/ItemSheet.svelte';
import TitanSheetRoot from './components/TitanSheet.svelte';
import { buildFoeView } from './foe-view.ts';
import { buildItemView } from './item-view.ts';
import { enrich, named, SvelteSheetMixin } from './svelte-sheet.ts';
import { buildTitanView } from './titan-view.ts';

const FORM = { submitOnChange: false, closeOnSubmit: false };

export function defineTitanSheet() {
  const Base = SvelteSheetMixin(foundry.applications.sheets.ActorSheetV2);
  class TitanSheet extends Base {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-titan-sheet'],
      position: { width: 860, height: 720 },
      window: { resizable: true },
      form: FORM,
    };
    get svelteRoot() {
      return TitanSheetRoot;
    }
    get initialTab() {
      return 'engagement';
    }
    async buildView() {
      const actor = this.document;
      // Notes are for the GM: an Observer gets them with secrets removed.
      const notesHTML = await enrich(actor, actor.system.notes);
      return buildTitanView(actor, { editable: this.isEditable, notesHTML });
    }
    /** A Titan holds no Items. */
    async _onDropItem() {
      return null;
    }
  }
  return named(TitanSheet, 'TitanSheet');
}

export function defineFoeSheet() {
  const Base = SvelteSheetMixin(foundry.applications.sheets.ActorSheetV2);
  class FoeSheet extends Base {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-compact', 'wof-foe-sheet'],
      position: { width: 580, height: 640 },
      window: { resizable: true },
      form: FORM,
    };
    get svelteRoot() {
      return FoeSheetRoot;
    }
    async buildView() {
      const actor = this.document;
      const notesHTML = await enrich(actor, actor.system.notes);
      return buildFoeView(actor, { editable: this.isEditable, notesHTML });
    }
    /** A Foe holds no Items: its weapons are rows of data/skirmish/skirmish.yaml. */
    async _onDropItem() {
      return null;
    }
  }
  return named(FoeSheet, 'FoeSheet');
}

export function defineItemSheet() {
  const Base = SvelteSheetMixin(foundry.applications.sheets.ItemSheetV2);
  class ItemSlip extends Base {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-compact', 'wof-item-sheet'],
      position: { width: 520, height: 600 },
      window: { resizable: true },
      form: FORM,
    };
    get svelteRoot() {
      return ItemSheetRoot;
    }
    async buildView() {
      const item = this.document;
      const field = item.type === 'specialty' ? 'summary' : 'description';
      const enriched = await enrich(item, item.system[field]);
      return buildItemView(item, { editable: this.isEditable, enriched });
    }
  }
  return named(ItemSlip, 'ItemSlip');
}
