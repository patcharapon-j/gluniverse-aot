/**
 * The shared shell of every system sheet (ADR-0027, core-plan 2b and 2c): an ApplicationV2 document
 * sheet whose content is one Svelte 5 tree. _replaceHTML mounts it once and afterwards only swaps the
 * view it reads; _onClose unmounts it. Subclasses give the root component and build the view.
 */
import { mount, unmount, type Component } from 'svelte';
import { SheetState } from './sheet-state.svelte.ts';

export function SvelteSheetMixin(Base: any) {
  class SvelteSheet extends Base {
    #component: Record<string, any> | null = null;
    #state: SheetState<unknown> | null = null;
    /** The tab outlives a re-mount while the sheet object lives. */
    #tab: string | null = null;

    /** The Svelte root; it receives { sheetState, sheet }. */
    get svelteRoot(): Component<any> {
      throw new Error(`${this.constructor.name} has no Svelte root`);
    }

    /** The tab a newly opened sheet shows. */
    get initialTab(): string {
      return '';
    }

    /** The plain view the Svelte tree renders, rebuilt on every render. */
    async buildView(_options: any): Promise<unknown> {
      throw new Error(`${this.constructor.name} builds no view`);
    }

    /** The mounted component's state, for tests in the browser console. */
    get svelteState() {
      return this.#state;
    }

    get title() {
      return this.document.name;
    }

    async _prepareContext(options: any) {
      const context = await super._prepareContext(options);
      context.view = await this.buildView(options);
      return context;
    }

    async _renderHTML(context: any) {
      return context.view;
    }

    _replaceHTML(view: unknown, content: HTMLElement) {
      if (this.#component && this.#state) {
        this.#state.view = view;
        return;
      }
      content.classList.add('wof-content');
      this.#state = new SheetState(view, this.#tab ?? this.initialTab);
      this.#component = mount(this.svelteRoot, { target: content, props: { sheetState: this.#state, sheet: this } });
    }

    _onClose(options: any) {
      super._onClose(options);
      if (this.#state) this.#tab = this.#state.tab;
      if (this.#component) unmount(this.#component);
      this.#component = null;
      this.#state = null;
    }

    /**
     * Foundry disables every form control of a sheet the user cannot edit. The Svelte tree sets each
     * control's disabled state itself (tabs and view toggles stay usable for an Observer), so only
     * the secret blocks and the portrait keep Foundry's handling.
     */
    _toggleDisabled(disabled: boolean) {
      this.element?.querySelectorAll('secret-block').forEach((b: any) => (b.revealable = !disabled));
      this.element?.querySelectorAll('img[data-edit]').forEach((img: Element) => img.classList.toggle('disabled', disabled));
    }

    /** Re-runs _prepareContext so sheet-only state (such as Bonus Dice) shows without a document update. */
    refreshView() {
      return this.render();
    }
  }
  return SvelteSheet;
}

/** Enriched HTML for a notes or description field, with secrets shown only to owners. */
export function enrich(doc: any, html: string): Promise<string> {
  const TextEditor = foundry.applications.ux.TextEditor.implementation;
  return TextEditor.enrichHTML(html ?? '', { relativeTo: doc, secrets: doc.isOwner, rollData: {} });
}

/** Keeps a class name stable under minification: Foundry stores a sheet id as scope + class name. */
export function named<T extends object>(cls: T, name: string): T {
  Object.defineProperty(cls, 'name', { value: name });
  return cls;
}
