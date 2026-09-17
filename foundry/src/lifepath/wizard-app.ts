/**
 * The Lifepath wizard window (foundry/docs/lifepath-wizard-plan.md, section 7): a document sheet on the
 * soldier, so every update of the actor (its state flag included) re-renders it, whose content is one
 * Svelte tree mounted by the shared sheet shell. It is opened by code, never registered as a sheet.
 */
import { commitPlan, REPLACED_TYPES, type HeldItem } from './commit-plan.ts';
import type { IssuePlan, LpTables, Procedure } from '../rules/lifepath.ts';
import { replay, type LifepathState, type Replay } from '../rules/lifepath-state.ts';
import { named, SvelteSheetMixin } from '../sheets/svelte-sheet.ts';
import { allowedProcedures, recordCampaignYear, worldYear } from './campaign.ts';
import WizardRoot from './components/LifepathWizard.svelte';
import { lifepathActions, lpTables, readState, type LifepathActions } from './wizard.ts';

export interface WizardView {
  actor: { id: string; uuid: string; name: string; img: string };
  editable: boolean;
  isGM: boolean;
  state: LifepathState;
  r: Replay;
  tables: LpTables;
  page: { sections: Record<string, any[]>; boxes: Record<string, any[]>; flows: Record<string, any[]> };
  allowed: Procedure[];
  worldYear: number | null;
  issue: IssuePlan | null;
  replaced: string[];
  comrades: { id: string; name: string }[];
  act: LifepathActions;
}

export function buildWizardView(actor: any, editable: boolean, act: LifepathActions): WizardView {
  const tables = lpTables();
  const state = readState(actor);
  const allowed = allowedProcedures();
  const year = worldYear();
  const r = replay(state, tables, { allowed, worldYear: year });
  const held: HeldItem[] = [...actor.items].map((i: any) => ({
    id: i.id,
    type: i.type,
    gear: i.type === 'gear' ? { id: i.id, itemId: i.system.item_id, rating: i.system.rating, current: i.system.current, inHandles: !!i.system.in_handles, kept: !!i.system.kept } : undefined,
  }));
  const plan = r.final && !state.finished ? commitPlan(r.final, r.state, tables, held, [...actor.system.spare_canisters], '') : null;
  const replaced = plan ? [...actor.items].filter((i: any) => REPLACED_TYPES.includes(i.type) || plan.issue.remove.includes(i.id)).map((i: any) => i.name as string) : [];
  const comrades = [...(game.actors ?? [])]
    .filter((a: any) => (a.type === 'soldier' || a.type === 'squadmate') && a.id !== actor.id)
    .map((a: any) => ({ id: a.id as string, name: a.name as string }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    actor: { id: actor.id, uuid: actor.uuid, name: actor.name, img: actor.img },
    editable,
    isGM: !!game.user.isGM,
    state: r.state,
    r,
    tables,
    page: CONFIG.WOF.lifepathPage,
    allowed,
    worldYear: year,
    issue: plan?.issue ?? null,
    replaced,
    comrades,
    act,
  };
}

let WizardClass: any = null;

export function defineWizard() {
  const Base = SvelteSheetMixin(foundry.applications.api.DocumentSheetV2);

  class LifepathWizard extends Base {
    static DEFAULT_OPTIONS = {
      tag: 'div',
      classes: ['wof', 'wof-app', 'wof-lifepath'],
      position: { width: 1000, height: 800 },
      window: { resizable: true, icon: 'fa-solid fa-stamp' },
      sheetConfig: false,
      ownershipConfig: false,
      canImport: false,
      actions: { resetLifepath: LifepathWizard.#onReset },
    };

    /** The GM may clear a soldier's Lifepath state; the soldier's sheet is left as it is. */
    static async #onReset(this: LifepathWizard) {
      const ok = await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize('WOF.Lifepath.reset.title') },
        classes: ['wof-pick'],
        content: `<p class="hint">${foundry.utils.escapeHTML(game.i18n.localize('WOF.Lifepath.reset.hint'))}</p>`,
      });
      if (ok) await this.act.reset();
    }

    _getHeaderControls() {
      const controls = super._getHeaderControls();
      if (game.user.isGM) controls.push({ icon: 'fa-solid fa-eraser', label: 'WOF.Lifepath.reset.title', action: 'resetLifepath' });
      return controls;
    }

    #act: LifepathActions | null = null;

    get act(): LifepathActions {
      this.#act ??= lifepathActions(this.document);
      return this.#act;
    }

    get title() {
      return game.i18n.format('WOF.Lifepath.window', { name: this.document.name });
    }

    get svelteRoot() {
      return WizardRoot;
    }

    async buildView() {
      return buildWizardView(this.document, this.isEditable, this.act);
    }

    _onFirstRender(context: any, options: any) {
      super._onFirstRender?.(context, options);
      // A Campaign Year recorded while no GM was connected is recorded for the world now.
      const state = readState(this.document);
      if (worldYear() === null && state.year !== null && state.confirmed.includes('campaign')) recordCampaignYear(state.year);
    }
  }

  WizardClass = named(LifepathWizard, 'LifepathWizard');
  return WizardClass;
}

/** Opens (or brings forward) the wizard for a soldier the user owns. */
export function openLifepath(actor: any): any {
  if (!actor || actor.type !== 'soldier') return null;
  if (!actor.isOwner) {
    ui.notifications.warn(game.i18n.localize('WOF.Lifepath.notOwner'));
    return null;
  }
  const Cls = WizardClass ?? defineWizard();
  const id = `LifepathWizard-${actor.uuid.replaceAll('.', '-')}`;
  const open = foundry.applications.instances.get(id);
  if (open) {
    open.render({ force: true });
    open.bringToFront?.();
    return open;
  }
  const app = new Cls({ document: actor });
  app.render({ force: true });
  return app;
}

