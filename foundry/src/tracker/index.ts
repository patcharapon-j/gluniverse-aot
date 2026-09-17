/**
 * Milestone 4, the Titan Engagement tracker (foundry/docs/tracker-plan.md): documents, automation,
 * proxy requests, derived statuses, token badges, the HUD strip, and the board.
 */
import { setEngagementContext } from '../dice/engagement-context.ts';
import { refreshBadges, registerBadges } from './badges.ts';
import { retitleBoard } from './board.ts';
import { defineCombatDocuments, defineCombatModels, setCombatHandlers } from './combat.ts';
import { cardEnd, cardStart, nextCard, nextRoundHandler, roundAction } from './engine.ts';
import { mountHud } from './hud.ts';
import { registerNotes } from './notes.ts';
import { registerRequests } from './requests.ts';
import { registerResults, registerResultView } from './results.ts';
import { rollContext } from './roll-context.ts';
import { onRefresh, refreshTracker } from './state.svelte.ts';
import { registerStatuses } from './statuses.ts';

/** The tracker's calls for macros and tests (game.wof.tracker). */
export async function trackerApi() {
  const [engine, state, board, setup, results] = await Promise.all([import('./engine.ts'), import('./state.svelte.ts'), import('./board.ts'), import('./setup.ts'), import('./results.ts')]);
  return { start: engine.startEngagement, act: state.act, openBoard: board.openBoard, openSetup: setup.openSetup, foeAct: results.foeAct, view: () => state.tracker.view, engine };
}

export function registerTracker(): void {
  const models = defineCombatModels();
  Object.assign(CONFIG.Combat.dataModels, models.combat);
  Object.assign(CONFIG.Combatant.dataModels, models.combatant);
  const { WofCombat, WofCombatant } = defineCombatDocuments();
  CONFIG.Combat.documentClass = WofCombat;
  CONFIG.Combatant.documentClass = WofCombatant;
  setCombatHandlers({
    cardStart,
    cardEnd,
    nextTurn: nextCard,
    nextRound: nextRoundHandler,
    deal: (combat) => roundAction(combat, 'deal'),
    changed: () => refreshTracker(),
  });
  setEngagementContext(rollContext);
  registerRequests();
  registerNotes();
  registerResults();
  registerResultView();
  registerStatuses();
  registerBadges();
  onRefresh(() => {
    refreshBadges();
    retitleBoard();
  });
  const refresh = () => refreshTracker();
  for (const hook of ['updateActor', 'createItem', 'updateItem', 'deleteItem', 'createToken', 'updateToken', 'deleteToken', 'createActiveEffect', 'deleteActiveEffect', 'canvasReady', 'deleteCombat', 'createCombat', 'updateSetting']) Hooks.on(hook, refresh);
  Hooks.once('ready', async () => {
    game.wof.tracker = await trackerApi();
    mountHud();
    refreshTracker();
  });
}
