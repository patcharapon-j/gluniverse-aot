/**
 * The Soldier sheet (ADR-0027, core-plan 2b) and the compact Squadmate sheet (2c): ActorSheetV2
 * shells around one Svelte tree each (svelte-sheet.ts). Drops, the portrait picker, and window
 * controls stay Foundry's; both sheets share the drop rules below.
 */
import SoldierSheetRoot from './components/SoldierSheet.svelte';
import SquadmateSheetRoot from './components/SquadmateSheet.svelte';
import { enrich, named, SvelteSheetMixin } from './svelte-sheet.ts';
import { buildSoldierView } from './soldier-view.ts';
import { chooseInjury, injuryData } from './soldier-ops.ts';
import { BUILD_ITEM_TYPES } from './mode.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

/**
 * Drop rules for a soldier or a Squadmate: Origin and Specialty replace; a held Talent levels up (a
 * Squadmate's one template Talent is replaced instead: data/character/squadmates.yaml); a Critical
 * Injury row asks for its type and side; one ODM Gear and one horse; a Blade Set fills empty handles.
 *
 * An Origin, a Specialty and a Talent are the character's own build, so they are taken in Edit mode
 * only; gear and wounds arrive in play and are taken in either mode.
 */
async function dropOnSoldier(sheet: any, item: any, squadmate: boolean) {
  const actor = sheet.document;
  if (!actor.isOwner || !sheet.isEditable) return null;
  if (sheet.sheetMode === 'play' && (BUILD_ITEM_TYPES as readonly string[]).includes(item.type)) {
    ui.notifications.warn(t('WOF.Sheet.mode.dropLocked', { type: t(`TYPES.Item.${item.type}`) }));
    return null;
  }
  const Item = foundry.documents.Item.implementation;
  const data = item.toObject();
  delete data._id;
  data.flags ??= {};
  if (item.inCompendium) {
    data._stats ??= {};
    data._stats.compendiumSource = item.uuid;
  }
  const replace = async (type: string) => {
    const old = actor.items.filter((i: any) => i.type === type).map((i: any) => i.id);
    if (old.length) await actor.deleteEmbeddedDocuments('Item', old);
    const created = await Item.create(data, { parent: actor });
    ui.notifications.info(t('WOF.Sheet.drop.set', { name: item.name, what: t(`TYPES.Item.${type}`) }));
    return created;
  };

  switch (item.type) {
    case 'origin':
      if (squadmate) break; // data/character/squadmates.yaml, not_recorded
      return replace('origin');
    case 'specialty':
      return replace('specialty');
    case 'talent': {
      data.system.used = false;
      if (squadmate) {
        data.system.level = 1;
        return replace('talent');
      }
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
  }
  ui.notifications.warn(t('WOF.Sheet.drop.notHere', { type: t(`TYPES.Item.${item.type}`), sheet: t(`TYPES.Actor.${actor.type}`) }));
  return null;
}

export function defineSoldierSheet() {
  const Base = SvelteSheetMixin(foundry.applications.sheets.ActorSheetV2);

  class SoldierSheet extends Base {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-soldier-sheet'],
      position: { width: 860, height: 760 },
      window: { resizable: true },
      form: { submitOnChange: false, closeOnSubmit: false },
    };

    get svelteRoot() {
      return SoldierSheetRoot;
    }

    get initialTab() {
      return 'soldier';
    }

    get modeAware() {
      return true;
    }

    async buildView() {
      const actor = this.document;
      const notesHTML = await enrich(actor, actor.system.notes);
      return buildSoldierView(actor, { editable: this.isEditable, notesHTML, bonus: this.svelteState?.bonus ?? 0, mode: this.sheetMode });
    }

    async _onDropItem(event: DragEvent, item: any) {
      if (item.parent?.uuid === this.document.uuid) return super._onDropItem(event, item);
      return dropOnSoldier(this, item, false);
    }
  }

  return named(SoldierSheet, 'SoldierSheet');
}

export function defineSquadmateSheet() {
  const Base = SvelteSheetMixin(foundry.applications.sheets.ActorSheetV2);

  class SquadmateSheet extends Base {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-compact', 'wof-squadmate-sheet'],
      position: { width: 600, height: 720 },
      window: { resizable: true },
      form: { submitOnChange: false, closeOnSubmit: false },
    };

    get svelteRoot() {
      return SquadmateSheetRoot;
    }

    get initialTab() {
      return 'stat';
    }

    get modeAware() {
      return true;
    }

    async buildView() {
      const actor = this.document;
      const notesHTML = await enrich(actor, actor.system.notes);
      return buildSoldierView(actor, { editable: this.isEditable, notesHTML, bonus: 0, mode: this.sheetMode });
    }

    async _onDropItem(event: DragEvent, item: any) {
      if (item.parent?.uuid === this.document.uuid) return super._onDropItem(event, item);
      return dropOnSoldier(this, item, true);
    }
  }

  return named(SquadmateSheet, 'SquadmateSheet');
}
