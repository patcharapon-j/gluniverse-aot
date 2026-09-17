/** Registers every system sheet as the default for its document types (core-plan 2b, 2c). */
import { isReplaceableImg, specialtyPortrait } from '../art.ts';
import { SYSTEM_ID } from '../config.ts';
import { prototypeTokenDefaults, type ActorType } from '../token-defaults.ts';
import { defineFoeSheet, defineItemSheet, defineTitanSheet } from './other-sheets.ts';
import { defineSoldierSheet, defineSquadmateSheet } from './soldier-sheet.ts';

export function registerSheets() {
  const Actors = foundry.documents.collections.Actors;
  const Items = foundry.documents.collections.Items;
  const actorSheets: [any, ActorType, string][] = [
    [defineSoldierSheet(), 'soldier', 'WOF.Sheet.label.soldier'],
    [defineSquadmateSheet(), 'squadmate', 'WOF.Sheet.label.squadmate'],
    [defineTitanSheet(), 'titan', 'WOF.Sheet.label.titan'],
    [defineFoeSheet(), 'foe', 'WOF.Sheet.label.foe'],
  ];
  for (const [cls, type, label] of actorSheets) Actors.registerSheet(SYSTEM_ID, cls, { types: [type], makeDefault: true, label, themes: null });
  Items.registerSheet(SYSTEM_ID, defineItemSheet(), {
    types: ['talent', 'specialty', 'origin', 'gear', 'critical-injury'],
    makeDefault: true,
    label: 'WOF.Sheet.label.item',
    themes: null,
  });
}

/**
 * A new Actor takes its type's prototype Token defaults under whatever its data already sets, so a
 * compendium import keeps the pack's own token.
 */
export function registerTokenDefaults() {
  Hooks.on('preCreateActor', (actor: any, data: any) => {
    if (data.prototypeToken?.bar1 !== undefined) return;
    const defaults = prototypeTokenDefaults(actor.type as ActorType, { sizeClass: actor.system?.size_class });
    const merged = foundry.utils.mergeObject(defaults, foundry.utils.expandObject(data.prototypeToken ?? {}), { inplace: false });
    const update: Record<string, unknown> = { prototypeToken: merged };
    // A new standard Titan takes its Size Class row (data/engagement/titan-format.yaml, standard_titan).
    if (actor.type === 'titan' && !data.system?.body_parts?.length) {
      const row = (CONFIG.WOF.sizeClasses as any[]).find((c) => c.id === actor.system.size_class);
      if (row) {
        const parts = ['eyes', 'left-arm', 'right-arm', 'left-leg', 'right-leg'].map((id) => {
          const kind = id === 'eyes' ? 'eyes' : id.split('-')[1];
          return { id, kind, toughness: row.toughness[kind], state: 'intact', progress: 0 };
        });
        Object.assign(update, {
          'system.tempo': row.tempo,
          'system.nape_depth': row.napeDepth,
          'system.regeneration_clock': row.regenerationClock,
          'system.heave': row.heave,
          'system.body_parts': parts,
        });
      }
    }
    actor.updateSource(update);
  });
}

/**
 * A Soldier or Squadmate that still wears a placeholder (Foundry's, or another Specialty's
 * portrait) takes the portrait of the Specialty it is given, on its sheet plate and its token.
 */
export function registerPortraits() {
  Hooks.on('createItem', (item: any, _options: any, userId: string) => {
    const actor = item.parent;
    if (userId !== game.user.id || item.type !== 'specialty' || !actor || !['soldier', 'squadmate'].includes(actor.type)) return;
    const img = specialtyPortrait(item.system.specialty_id);
    if (!img || img === actor.img || !isReplaceableImg(actor.img)) return;
    const update: Record<string, unknown> = { img };
    if (isReplaceableImg(actor.prototypeToken?.texture?.src)) update['prototypeToken.texture.src'] = img;
    actor.update(update);
  });
}
