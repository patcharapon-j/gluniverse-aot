/**
 * The compact roll dialog (core-plan 2d): an ApplicationV2 window in the sheet's look, whose content
 * is one Svelte tree (the sheets' shell, svelte-sheet.ts). `RollDialog.ask` resolves with the
 * roller's choices, or null when the window is closed.
 */
import RollDialogRoot from '../sheets/components/RollDialog.svelte';
import { named, SvelteSheetMixin } from '../sheets/svelte-sheet.ts';
import type { AttributeId } from '../rules/derived.ts';
import type { PoolInputs } from '../rules/pool.ts';
import type { Circumstance } from '../rules/roll.ts';

export interface RollDialogView {
  title: string;
  actorName: string;
  img: string;
  entryName: string;
  icon: string;
  inputs: PoolInputs;
  attributes: { id: AttributeId; label: string }[];
  talents: { id: string; name: string; dice: number; condition: string | null }[];
  gear: { id: string; name: string; dice: number }[];
  gearAllowed: boolean;
  conditionals: { source: string; dice: number; condition: string }[];
  showBonus: boolean;
  bonus: number;
  bonusCap: number;
  showCircumstances: boolean;
  circumstances: Circumstance[];
  circumstance: string;
  lockCircumstances: boolean;
  showStakes: boolean;
  stakesMenu: { id: string; label: string }[];
  stakes: { id: string; text: string } | null;
  lockStakes: boolean;
  needs: number | null;
  passiveOption: boolean;
  injuries: { id: string; name: string; penalty: number }[];
  notes: string[];
}

export interface RollChoice {
  attribute: AttributeId;
  talent: string;
  gear: string;
  bonus: number;
  circumstance: string;
  stakes: { id: string; text: string } | null;
  needs: number | null;
  conditionsMet: string[];
  passive: boolean;
  injury: string | null;
}

let DialogClass: any = null;

function define() {
  const Base: any = SvelteSheetMixin(foundry.applications.api.ApplicationV2);
  class RollDialog extends Base {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-roll-dialog'],
      position: { width: 420, height: 'auto' },
      window: { resizable: false, minimizable: false },
    };

    view: RollDialogView;
    #resolve: ((c: RollChoice | null) => void) | null = null;

    constructor(view: RollDialogView, resolve: (c: RollChoice | null) => void) {
      super({ window: { title: view.title } });
      this.view = view;
      this.#resolve = resolve;
    }

    get title() {
      return this.view.title;
    }

    get svelteRoot() {
      return RollDialogRoot;
    }

    async buildView() {
      return this.view;
    }

    /** Called by the Svelte tree. */
    submit(choice: RollChoice) {
      const r = this.#resolve;
      this.#resolve = null;
      r?.(choice);
      return this.close();
    }

    _onClose(options: any) {
      super._onClose(options);
      const r = this.#resolve;
      this.#resolve = null;
      r?.(null);
    }
  }
  return named(RollDialog, 'WofRollDialog');
}

export function askRoll(view: RollDialogView): Promise<RollChoice | null> {
  DialogClass ??= define();
  return new Promise((resolve) => {
    new DialogClass(view, resolve).render({ force: true });
  });
}
