/**
 * The GM's dialog for a Focus Titan's card (ADR-0019, deferred roll): the behavior the card would
 * resolve, whom it is against, and the Attack Dice, every one of them open to the GM's override
 * before any die is thrown. An ApplicationV2 window in the sheet's look, whose content is one Svelte
 * tree (svelte-sheet.ts), like the soldiers' roll dialog. Resolves with the GM's choices, or null.
 */
import TitanRollRoot from '../sheets/components/TitanRollDialog.svelte';
import { named, SvelteSheetMixin } from '../sheets/svelte-sheet.ts';

export interface TitanEntryOption {
  id: string;
  name: string;
  tier: string;
  tierLabel: string;
  attackDice: number | null;
  /** The Titan still has the Body Parts the entry needs. */
  canHappen: boolean;
  /** The entry the Next Behavior rolled, before the choose step or an override. */
  rolled: boolean;
  /** The entry the choose step settled on. */
  chosen: boolean;
  positions: string;
  targets: string;
  effects: string[];
  text: string;
  /** Who the entry's own targets rule picks, by actor id. */
  suggested: string[];
}

export interface TitanRollView {
  title: string;
  titanName: string;
  img: string;
  label: string;
  /** The Attention holder and the rung that gave it, for the header line. */
  attention: string;
  entries: TitanEntryOption[];
  entry: string;
  candidates: { id: string; name: string; position: string; dodge: number | null; suggested: boolean }[];
  targets: string[];
  dice: number;
  diceCap: number;
  /** Faces that count as successes on a Titan Die, for the dialog's line. */
  successFaces: number[];
  showDice: boolean;
}

export interface TitanRollChoice {
  entry: string;
  targets: string[];
  dice: number;
  /** Throw the dice with Dice So Nice; off by default, so a Titan's turn never rains dice. */
  show: boolean;
}

let DialogClass: any = null;

function define() {
  const Base: any = SvelteSheetMixin(foundry.applications.api.ApplicationV2);
  class TitanRollDialog extends Base {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-roll-dialog', 'wof-titan-dialog'],
      position: { width: 460, height: 'auto' },
      window: { resizable: false, minimizable: false },
    };

    view: TitanRollView;
    #resolve: ((c: TitanRollChoice | null) => void) | null = null;

    constructor(view: TitanRollView, resolve: (c: TitanRollChoice | null) => void) {
      super({ window: { title: view.title } });
      this.view = view;
      this.#resolve = resolve;
    }

    get title() {
      return this.view.title;
    }

    get svelteRoot() {
      return TitanRollRoot;
    }

    async buildView() {
      return this.view;
    }

    /** Called by the Svelte tree. */
    submit(choice: TitanRollChoice) {
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
  return named(TitanRollDialog, 'WofTitanRollDialog');
}

export function askTitanRoll(view: TitanRollView): Promise<TitanRollChoice | null> {
  DialogClass ??= define();
  return new Promise((resolve) => {
    new DialogClass(view, resolve).render({ force: true });
  });
}
