/**
 * Grabbed, Engaged, and a soldier's Held follow the running engagement (tracker-plan section 5.7):
 * worked out from the Combat on every change and drawn on the tokens.
 */
import { setEngagementStatuses } from '../documents/actor.ts';
import { currentEngagement } from './combat.ts';

let cache = new Map<string, string[]>();

function compute(): Map<string, string[]> {
  const out = new Map<string, string[]>();
  const combat = currentEngagement();
  if (!combat) return out;
  const add = (id: string, status: string) => {
    const list = out.get(id) ?? [];
    if (!list.includes(status)) list.push(status);
    out.set(id, list);
  };
  const sys = combat.system;
  for (const t of sys.titans ?? []) if (t.status === 'focus' && t.grab?.soldier) add(t.grab.soldier, 'grabbed');
  if (sys.mode === 'skirmish') {
    for (const e of sys.skirmish.engaged ?? []) add(e.soldier, 'engaged');
    for (const h of sys.skirmish.holds ?? []) add(h.soldier, 'held');
  }
  return out;
}

/** Recomputes the statuses and redraws the actors whose set changed. */
export function refreshStatuses(): void {
  const before = cache;
  cache = compute();
  const ids = new Set([...before.keys(), ...cache.keys()]);
  for (const id of ids) {
    if ((before.get(id) ?? []).join() === (cache.get(id) ?? []).join()) continue;
    const actor = game.actors?.get(id);
    if (!actor) continue;
    actor.prepareData();
    for (const token of actor.getActiveTokens?.() ?? []) token.renderFlags?.set({ redrawEffects: true });
    Hooks.callAll('wof.statusesChanged', actor);
  }
}

export function registerStatuses(): void {
  setEngagementStatuses((id) => cache.get(id) ?? []);
}
