/**
 * The tracker's live view for the HUD strip and the board (Svelte state), and the one place their
 * buttons act through. Rebuilt, debounced, on every change of the engagement, its actors, or the scene.
 */
import { SYSTEM_ID } from '../config.ts';
import { nextCheck, type EndEntry } from '../rules/engagement/round.ts';
import { currentEngagement } from './combat.ts';
import { applyCheck, endEngagement, endLock, isGM, leave, movePosition, nextCard, returnTo, roundAction, runEnd, skipCheck, swap, undoCheck } from './engine.ts';
import { ask } from './requests.ts';
import { foeAct } from './results.ts';
import { refreshStatuses } from './statuses.ts';
import { buildView, type TrackerView } from './view.ts';

export const tracker = $state({
  view: null as TrackerView | null,
  folded: false,
  /** Soldiers picked for a swap in this client. */
  picks: [] as string[],
  cue: null as { warn: boolean; text: string } | null,
  /** Bumped on every rebuild, so animations can follow changes. */
  tick: 0,
});

let timer: number | undefined;
const listeners = new Set<() => void>();
export const onRefresh = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// The round-end actions hide while a step is under way.
endLock.onChange(() => refreshTracker());

export function refreshTracker(): void {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    try {
      tracker.view = buildView();
    } catch (err) {
      console.error('wings-of-freedom | the tracker view failed', err);
      tracker.view = null;
    }
    if (tracker.view?.step !== 'swap') tracker.picks = [];
    tracker.tick++;
    refreshStatuses();
    for (const fn of listeners) fn();
  }, 40);
}

export function setFolded(folded: boolean): void {
  tracker.folded = folded;
  void game.settings.set(SYSTEM_ID, 'hudFolded', folded);
}

const combatNow = () => currentEngagement();

/** Picks a soldier's card for a swap (GM: makes the swap; a player: proposes it). */
export async function pickCard(id: string, reason: (a: string, b: string) => string | null, own: (id: string) => boolean): Promise<void> {
  const picks = tracker.picks;
  if (picks.includes(id)) {
    tracker.picks = picks.filter((x) => x !== id);
    tracker.cue = null;
    return;
  }
  if (!picks.length && !isGM() && !own(id)) {
    tracker.cue = { warn: true, text: game.i18n.localize('WOF.Tracker.cue.pickOwnFirst') };
    return;
  }
  if (!picks.length) {
    tracker.picks = [id];
    tracker.cue = { warn: false, text: game.i18n.localize('WOF.Tracker.cue.pickSecond') };
    return;
  }
  const [a] = picks;
  const why = reason(a, id);
  tracker.picks = [];
  if (why) {
    tracker.cue = { warn: true, text: why };
    return;
  }
  const combat = combatNow();
  if (!combat) return;
  tracker.cue = null;
  if (isGM()) await swap(combat, a, id);
  else await ask({ act: 'swap-propose', combat: combat.id, a, b: id });
}

export async function act(action: string, data: Record<string, any> = {}): Promise<void> {
  const combat = combatNow();
  try {
    switch (action) {
      case 'setup': {
        const { openSetup } = await import('./setup.ts');
        return void openSetup(data.mode ?? 'titan');
      }
      case 'board': {
        const { openBoard } = await import('./board.ts');
        return void openBoard();
      }
      case 'fold':
        return setFolded(true);
      case 'unfold':
        return setFolded(false);
    }
    if (!combat) return;
    const log = () => combat.system.toObject().endLog as EndEntry[];
    switch (action) {
      case 'keep-wings':
      case 'deal':
      case 'begin-play':
      case 'next-round':
        return await roundAction(combat, action);
      case 'next-card':
        return void (await nextCard(combat));
      case 'apply-check':
        await applyCheck(combat, nextCheck(log()));
        return await runEnd(combat);
      case 'check-apply':
        await applyCheck(combat, data.index);
        return await runEnd(combat);
      case 'check-skip':
        return await skipCheck(combat, data.index);
      case 'check-undo':
        return await undoCheck(combat, data.index);
      case 'swap-accept':
      case 'swap-cancel':
        return void (await ask({ act: action, combat: combat.id }));
      case 'wing':
        return void (await ask({ act: 'wing', combat: combat.id, mate: data.mate, pc: data.pc || null }));
      case 'loud':
        return void (await ask({ act: 'loud', combat: combat.id, soldier: data.soldier, titan: data.key }));
      case 'fall-back':
        return void (await ask({ act: 'fall-back', combat: combat.id, soldier: data.soldier, titan: data.key }));
      case 'engage':
        return void (await ask({ act: 'engage', combat: combat.id, soldier: data.soldier, foe: data.foe }));
      case 'move':
        return void (await movePosition(combat, { actor: game.actors.get(data.soldier), key: data.key, to: data.to, way: data.way }));
      case 'leave':
        return void (await leave(combat, game.actors.get(data.soldier)));
      case 'return':
        return void (await returnTo(combat, game.actors.get(data.soldier)));
      case 'foe-act':
        return await foeAct(combat, data.foe);
      case 'foe-health': {
        const tok = combat.scene?.tokens.get(data.foe);
        if (tok?.actor && isGM()) await tok.actor.update({ 'system.health_lost': data.lost, 'system.out': data.lost >= tok.actor.system.health });
        return;
      }
      // The GM's override of a Titan's Next Behavior (the table's call beats the D6).
      case 'set-next': {
        const actor = combat.scene?.tokens.get(data.key)?.actor;
        if (!isGM() || !actor) return;
        await actor.update({ 'system.next_behavior.entry': data.entry ?? '', 'system.next_behavior.revealed': false });
        return;
      }
      case 'peek': {
        const actor = combat.scene?.tokens.get(data.key)?.actor;
        const entry = (actor?.system.toObject().behavior_table.entries as any[])?.find((e) => e.id === actor.system.next_behavior.entry);
        if (isGM() && entry) ui.notifications.info(game.i18n.format('WOF.Tracker.peek', { name: entry.name }));
        return;
      }
      case 'pan': {
        const token = data.token ? combat.scene?.tokens.get(data.token) : combat.scene?.tokens.find((t: any) => t.actorId === data.actor);
        if (token?.object && (globalThis as any).canvas?.ready) (globalThis as any).canvas.animatePan({ x: token.object.center.x, y: token.object.center.y, duration: 250 });
        return;
      }
      case 'sheet':
        return void game.actors.get(data.actor)?.sheet?.render(true);
      case 'end':
      case 'close':
        return await endEngagement(combat);
    }
  } catch (err) {
    console.error(`wings-of-freedom | tracker action ${action} failed`, err);
    ui.notifications.error(game.i18n.localize('WOF.Tracker.failed'));
  }
}
