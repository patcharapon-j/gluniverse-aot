/**
 * Player changes to the running engagement go to the active GM (tracker-plan section 4), through the
 * existing guarded proxy query as the `tracker` extension. The GM's client checks each request
 * (src/rules/engagement/guard.ts) and works every value out itself.
 */
import { extViaGM, registerProxyExtension } from '../dice/proxy.ts';
import { checkTrackerRequest, type TrackerRequest } from '../rules/engagement/guard.ts';
import { isGM, performRequest } from './engine.ts';
import { snapshot } from './snapshot.ts';

type Request = TrackerRequest | { act: 'end-turn'; combat: string };

function refusal(req: Request, user: any): string | null {
  const combat = game.combats.get(req?.combat);
  if (!combat) return 'no such engagement';
  if (req.act === 'end-turn') {
    if (combat.system.step !== 'play') return 'no card is in play';
    return combat.combatant?.testUserPermission?.(user, 'OWNER') ? null : 'only the acting soldier’s owner ends the turn';
  }
  return checkTrackerRequest(
    {
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
    },
    req,
  );
}

export function registerRequests(): void {
  registerProxyExtension('tracker', {
    refusal: (data, user) => refusal(data as Request, user),
    perform: async (data, user) => performRequest(game.combats.get((data as Request).combat), data, user),
  });
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
