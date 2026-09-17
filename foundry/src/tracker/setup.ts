/**
 * The setup window (tracker-plan section 3, setup): a small ApplicationV2 in the sheets' look whose
 * content is one Svelte tree; Start creates the engagement.
 */
import { named, SvelteSheetMixin } from '../sheets/svelte-sheet.ts';
import SetupRoot from './components/Setup.svelte';
import { startEngagement, type SetupChoice } from './engine.ts';

export interface SetupView {
  mode: 'titan' | 'skirmish';
  scene: string;
  anchor: string;
  titans: { id: string; name: string }[];
  soldiers: { id: string; name: string }[];
  foes: { id: string; name: string; kind: string }[];
}

let Cls: any = null;

function define() {
  const Base: any = SvelteSheetMixin(foundry.applications.api.ApplicationV2);
  class EngagementSetup extends Base {
    static DEFAULT_OPTIONS = {
      classes: ['wof', 'wof-app', 'wof-roll-dialog', 'wof-setup-app'],
      position: { width: 460, height: 'auto' },
      window: { resizable: false, icon: 'fa-solid fa-flag' },
    };
    view: SetupView;
    constructor(view: SetupView) {
      super({ window: { title: game.i18n.localize(view.mode === 'titan' ? 'WOF.Tracker.setup.titleTitan' : 'WOF.Tracker.setup.titleSkirmish') } });
      this.view = view;
    }
    get title() {
      return game.i18n.localize(this.view.mode === 'titan' ? 'WOF.Tracker.setup.titleTitan' : 'WOF.Tracker.setup.titleSkirmish');
    }
    get svelteRoot() {
      return SetupRoot;
    }
    async buildView() {
      return this.view;
    }
    async submit(choice: SetupChoice) {
      await this.close();
      await startEngagement(choice);
    }
  }
  return named(EngagementSetup, 'WofEngagementSetup');
}

export function openSetup(mode: 'titan' | 'skirmish'): void {
  if (!game.user.isGM) return;
  const scene = game.scenes.viewed;
  if (!scene) {
    ui.notifications.warn(game.i18n.localize('WOF.Tracker.setup.noScene'));
    return;
  }
  const tokens = [...scene.tokens].filter((t: any) => t.actor);
  const seen = new Set<string>();
  const soldiers = tokens
    .filter((t: any) => (t.actor.type === 'soldier' || t.actor.type === 'squadmate') && t.actorLink && !seen.has(t.actorId) && seen.add(t.actorId))
    .map((t: any) => ({ id: t.actorId as string, name: t.actor.name as string }));
  const view: SetupView = {
    mode,
    scene: scene.name,
    anchor: 'wooded',
    titans: tokens.filter((t: any) => t.actor.type === 'titan' && !t.actor.system.corpse).map((t: any) => ({ id: t.id, name: t.name })),
    soldiers,
    foes: tokens.filter((t: any) => t.actor.type === 'foe').map((t: any) => ({ id: t.id, name: t.name, kind: t.actor.system.kind })),
  };
  Cls ??= define();
  new Cls(view).render({ force: true });
}
