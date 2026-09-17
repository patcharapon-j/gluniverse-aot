/**
 * The system's Actor document (core-plan 2e): token status effects that follow the actor's data.
 * Bound statuses (src/rules/statuses.ts) are added to `actor.statuses` after data preparation and
 * drawn on the token as unsaved effects, so the token, the Token HUD, and the sheet never disagree;
 * the HUD toggles a bound field instead of creating an Active Effect.
 */
import { defaultArtwork, iconPath, STATUSES } from '../art.ts';
import { SYSTEM_ID } from '../config.ts';
import { boundStatuses, statusBinding } from '../rules/statuses.ts';

const STATUS_PREFIX = 'WOF.Status';

/** The statuses the running engagement gives an actor (set by src/tracker/statuses.ts). */
let engagementStatuses: (actorId: string) => string[] = () => [];
export const setEngagementStatuses = (fn: (actorId: string) => string[]) => (engagementStatuses = fn);
/** Unsaved effects shown for bound statuses, per actor. */
const SHOWN = new WeakMap<object, Map<string, any>>();

/** CONFIG.statusEffects: the thirteen system statuses, plus core's Dead for the combat tracker. */
export function registerStatusEffects(): void {
  const dead = CONFIG.statusEffects.find?.((s: any) => s.id === 'dead');
  CONFIG.statusEffects.length = 0;
  // The rule a status stands for, as the website glossary (or foundry/wording) words it.
  const text = CONFIG.WOF.statusText as Record<string, string>;
  STATUSES.forEach((s, order) =>
    CONFIG.statusEffects.push({ id: s.id, name: `${STATUS_PREFIX}.${s.id}`, description: text[s.id] ?? '', img: iconPath(s.icon), order, hud: { actorTypes: s.types } }),
  );
  if (dead) CONFIG.statusEffects.push({ ...dead, order: STATUSES.length });
}

export function defineActorDocument() {
  const Base = foundry.documents.Actor;

  class WofActor extends Base {
    /**
     * The bound statuses from the last data preparation. Declared, not initialised: Foundry prepares
     * data inside the constructor, before class fields would be set.
     */
    declare boundStatuses: string[];

    /** Specialty portraits, Foe plates, and Titan plates as the default art of a new actor. */
    static getDefaultArtwork(data: any) {
      return defaultArtwork(data ?? {}) ?? super.getDefaultArtwork(data);
    }

    prepareData() {
      super.prepareData();
      const sys: any = this.system ?? {};
      this.boundStatuses = boundStatuses(this.type, sys, this.items ?? [], this.id ? engagementStatuses(this.id) : []);
      for (const id of this.boundStatuses) this.statuses.add(id);
    }

    /** One unsaved effect per bound status, reused between draws. */
    #boundEffect(id: string): any {
      let cache = SHOWN.get(this);
      if (!cache) SHOWN.set(this, (cache = new Map()));
      let effect = cache.get(id);
      if (!effect) {
        const status = CONFIG.statusEffects[id];
        if (!status) return null;
        const ActiveEffect = foundry.utils.getDocumentClass?.('ActiveEffect') ?? CONFIG.ActiveEffect.documentClass;
        effect = new ActiveEffect(
          { name: game.i18n.localize(status.name), description: status.description ?? '', img: status.img, statuses: [id], showIcon: CONST.ACTIVE_EFFECT_SHOW_ICON.ALWAYS, flags: { [SYSTEM_ID]: { bound: true } } },
          { parent: this },
        );
        cache.set(id, effect);
      }
      return effect;
    }

    /** Stored effects, then the bound statuses the stored ones do not already show. */
    get appliedEffects() {
      const effects = super.appliedEffects as any[];
      const shown = new Set(effects.flatMap((e) => [...(e.statuses ?? [])]));
      for (const id of this.boundStatuses ?? []) {
        if (shown.has(id)) continue;
        const e = this.#boundEffect(id);
        if (e) effects.push(e);
      }
      return effects;
    }

    async toggleStatusEffect(statusId: string, options: { active?: boolean; overlay?: boolean } = {}) {
      const bind = statusBinding(this.type, statusId);
      if (bind.kind === 'manual') return super.toggleStatusEffect(statusId, options);
      const isOn = (this.boundStatuses ?? []).includes(statusId);
      const want = options.active ?? !isOn;
      if (want === isOn) return undefined;
      if (bind.kind === 'derived' || bind.kind === 'engagement') {
        const key = bind.kind === 'derived' ? 'WOF.Status.followsSheet' : 'WOF.Status.followsTracker';
        ui.notifications.info(game.i18n.format(key, { status: game.i18n.localize(`${STATUS_PREFIX}.${statusId}`) }));
        return undefined;
      }
      await this.update({ [bind.path]: want });
      return want;
    }
  }
  Object.defineProperty(WofActor, 'name', { value: 'WofActor' });
  return WofActor;
}

/** The Token HUD lights bound statuses, which have no stored effect for core to find. */
export function defineTokenHUD() {
  const Base = foundry.applications.hud.TokenHUD;
  class WofTokenHUD extends Base {
    _getStatusEffectChoices() {
      const choices = super._getStatusEffectChoices();
      const bound: string[] = this.actor?.boundStatuses ?? [];
      for (const id of bound) {
        const c = choices[id];
        if (!c) continue;
        c.isActive = true;
        c.cssClass = ['active', c.isOverlay ? 'overlay' : null].filter(Boolean).join(' ');
      }
      const text = CONFIG.WOF.statusText as Record<string, string>;
      for (const c of Object.values(choices) as any[]) {
        const kind = this.actor ? statusBinding(this.actor.type, c.id).kind : 'manual';
        const rule = text[c.id];
        if (rule) c.title = `${c.title}: ${rule}`;
        if (kind === 'derived') c.title = `${c.title} (${game.i18n.localize('WOF.Status.derivedHint')})`;
        if (kind === 'engagement') c.title = `${c.title} (${game.i18n.localize('WOF.Status.trackerHint')})`;
      }
      return choices;
    }
  }
  Object.defineProperty(WofTokenHUD, 'name', { value: 'WofTokenHUD' });
  return WofTokenHUD;
}
