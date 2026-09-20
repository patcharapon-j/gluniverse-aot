/**
 * Player changes to the running engagement go to the active GM (tracker-plan section 4), through the
 * existing guarded proxy query as the `tracker` extension. The GM's client checks each request
 * (src/rules/engagement/guard.ts) and works every value out itself. The prompt cards the tracker
 * posts are answered through the same proxy as the `prompt` extension (src/dice/prompt.ts).
 */
import { extViaGM, registerProxyExtension } from '../dice/proxy.ts';
import { registerPrompts } from '../dice/prompt.ts';
import { checkTrackerPermission, checkTrackerRequest, type TrackerRequest, type TrackerWorld } from '../rules/engagement/guard.ts';
import { isGM, performRequest, registerEnginePrompts } from './engine.ts';
import { registerHarmPrompts } from './harm.ts';
import { registerResultPrompts } from './results.ts';
import { snapshot } from './snapshot.ts';

/** A request, with the GM's Direct Control flag (ADR-0028) it may carry. */
export type Request = ((TrackerRequest | { act: 'end-turn'; combat: string }) & { force?: boolean }) & { act: string; combat: string };

/**
 * Why this user may not ask for this change, or null. Kept pure so the force path can be tested.
 *
 * ADR-0028: automation assists the GM and never blocks them. When the asker is a GM and the request
 * carries `force`, only the who-is-asking checks apply (`checkTrackerPermission`) and the
 * do-the-rules-allow-it checks are skipped. A player's request never carries it: force from anyone
 * but a GM is refused outright rather than quietly ignored.
 */
export function trackerRefusal(w: TrackerWorld, req: Request, askerIsGM: boolean): string | null {
  if (!req?.force) return checkTrackerRequest(w, req as TrackerRequest);
  if (!askerIsGM) return 'only the GM steps over the rules';
  return checkTrackerPermission(w, req as TrackerRequest);
}

function worldFor(user: any): TrackerWorld {
  return {
    userId: user.id,
    owns: (id) => !!game.actors.get(id)?.testUserPermission(user, 'OWNER'),
    snapshot: (id) => {
      const c = game.combats.get(id);
      return c?.type === 'engagement' ? snapshot(c) : null;
    },
    skirmish: (id) => {
      const c = game.combats.get(id);
      if (c?.type !== 'engagement') return null;
      const sk = c.system.skirmish;
      const foes = (sk.foes as string[]).filter((f) => !sk.left.includes(f) && !c.scene?.tokens.get(f)?.actor?.system.out);
      return { foes, holding: (sk.holds as any[]).map((h) => h.soldier) };
    },
  };
}

function refusal(req: Request, user: any): string | null {
  const combat = game.combats.get(req?.combat);
  if (!combat) return 'no such engagement';
  if (req.act === 'end-turn') {
    if (combat.system.step !== 'play') return 'no card is in play';
    return combat.combatant?.testUserPermission?.(user, 'OWNER') ? null : 'only the acting soldier’s owner ends the turn';
  }
  return trackerRefusal(worldFor(user), req, !!user?.isGM);
}

export function registerRequests(): void {
  registerProxyExtension('tracker', {
    refusal: (data, user) => refusal(data as Request, user),
    perform: async (data, user) => performRequest(game.combats.get((data as Request).combat), data, user),
  });
  // The prompt card's own extension, and the tracker's resolvers for each kind of prompt.
  registerPrompts();
  registerHarmPrompts();
  registerResultPrompts();
  registerEnginePrompts();
}

/** Asks for a change: the GM makes it at once, a player asks the GM. */
export async function ask(req: Request): Promise<boolean> {
  if (isGM()) {
    const combat = game.combats.get(req.combat);
    return combat ? performRequest(combat, req, game.user) : false;
  }
  const why = refusal(req, game.user);
  if (why) {
    ui.notifications.warn(why);
    return false;
  }
  return extViaGM('tracker', req);
}
