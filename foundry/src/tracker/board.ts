/**
 * The Engagement board window (the locked Ops Ledger's two-page spread, 1000 by 700). One Svelte
 * tree reads the shared tracker state; the window has no document of its own.
 */
import { mount, unmount } from 'svelte';
import BoardRoot from './components/Board.svelte';
import { tracker } from './state.svelte.ts';

let Cls: any = null;

function define() {
  const { ApplicationV2 } = foundry.applications.api;
  class EngagementBoard extends ApplicationV2 {
    static DEFAULT_OPTIONS = {
      id: 'wof-engagement-board',
      classes: ['wof', 'wof-app', 'wof-board-app'],
      position: { width: 1000, height: 700 },
      window: { resizable: true, icon: 'fa-solid fa-book-open', title: 'WOF.Tracker.board.title' },
    };
    #app: Record<string, any> | null = null;

    get title() {
      return tracker.view?.title ?? game.i18n.localize('WOF.Tracker.board.title');
    }

    async _renderHTML() {
      return null;
    }

    _replaceHTML(_result: unknown, content: HTMLElement) {
      if (this.#app) return;
      content.classList.add('wof-content');
      this.#app = mount(BoardRoot, { target: content, props: {} });
    }

    _onClose(options: any) {
      super._onClose(options);
      if (this.#app) unmount(this.#app);
      this.#app = null;
    }
  }
  Object.defineProperty(EngagementBoard, 'name', { value: 'WofEngagementBoard' });
  return EngagementBoard;
}

export function openBoard(): any {
  Cls ??= define();
  const open = foundry.applications.instances.get('wof-engagement-board');
  if (open) {
    open.bringToFront?.();
    return open;
  }
  const app = new Cls();
  app.render({ force: true });
  return app;
}

/** Keeps an open board's window title in step with the round. */
export function retitleBoard(): void {
  const open = foundry.applications.instances.get('wof-engagement-board');
  if (open?.window?.title) open.window.title.textContent = open.title;
}
