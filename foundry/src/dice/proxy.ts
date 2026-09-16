/**
 * Changes a player cannot make directly go through the active GM, with Foundry's User queries
 * (CONFIG.queries; core-plan 2d): recording a Cover, a Reaction or a call's answer on a card another
 * user posted, the state of a card's ops after an Undo on a card the GM posted, and the Stress a
 * comrade takes for Covering. The GM's client checks each request against the card
 * (src/dice/proxy-guard.ts) before it writes anything.
 */
import { SYSTEM_ID } from '../config.ts';
import { FLAG, plainSummary, type Card } from './card.ts';
import { checkCardRewrite, checkCreateItem, checkDeleteItem, checkOpUpdate, recordRun, type GuardWorld, type Ledger, type OpContext } from './proxy-guard.ts';

const QUERY = `${SYSTEM_ID}.proxy`;

/** The flag on a soldier listing the rolls its owner agreed to Cover. */
export const COVERING_FLAG = 'covering';
const COVERING_KEEP = 20;

type Request =
  | { kind: 'card'; message: string; card: Card }
  | { kind: 'update'; uuid: string; data: Record<string, unknown>; ctx: OpContext }
  | { kind: 'create-item'; actor: string; data: Record<string, unknown>; ctx: OpContext }
  | { kind: 'delete-item'; uuid: string; ctx: OpContext };

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

const summary = (card: Card) => `<p class="wof-summary">${foundry.utils.escapeHTML(plainSummary(card))}</p>`;

/** The GM's memory of Cover costs it has moved, so a request cannot be replayed. */
const ledger: Ledger = new Map();

function worldFor(user: any): GuardWorld {
  const doc = (uuid: string) => (typeof uuid === 'string' ? foundry.utils.fromUuidSync(uuid, { strict: false }) : null);
  return {
    userId: user.id,
    owns: (uuid) => !!doc(uuid)?.testUserPermission?.(user, 'OWNER'),
    actor: (uuid) => {
      const a = doc(uuid);
      return a?.documentName === 'Actor' ? { type: a.type, name: a.name } : null;
    },
    message: (id) => {
      const m = game.messages.get(id);
      return m ? { author: m.author?.id ?? null, card: m.getFlag(SYSTEM_ID, FLAG) as Card | undefined } : null;
    },
    value: (actor, item, path) => {
      const a = doc(actor);
      const target = item ? a?.items?.get(item) : a;
      return target ? foundry.utils.getProperty(target._source, path) : undefined;
    },
    item: (actor, item) => {
      const i = doc(actor)?.items?.get(item);
      return i ? { type: i.type } : null;
    },
    covering: (actor) => {
      const list = doc(actor)?.getFlag?.(SYSTEM_ID, COVERING_FLAG);
      return Array.isArray(list) ? list.map(String) : [];
    },
  };
}

/** The GM side: why this user may not ask for this change, or null. */
async function refusal(req: Request, user: any): Promise<string | null> {
  const w = worldFor(user);
  switch (req?.kind) {
    case 'card': {
      const message = game.messages.get(req.message);
      if (!message) return 'the message is gone';
      return checkCardRewrite(w, req.message, message.getFlag(SYSTEM_ID, FLAG), req.card);
    }
    case 'update': {
      const doc = await foundry.utils.fromUuid(req.uuid);
      if (!doc || (doc.documentName !== 'Actor' && doc.documentName !== 'Item')) return 'only actors and their items are changed';
      const actor = doc.documentName === 'Actor' ? doc : doc.parent;
      if (actor?.documentName !== 'Actor') return 'the item is not on an actor';
      return checkOpUpdate(w, ledger, req.ctx, { actor: actor.uuid, actorType: actor.type, item: doc.documentName === 'Item' ? doc.id : null }, req.data ?? {});
    }
    case 'create-item':
      return checkCreateItem(w, ledger, req.ctx, req.actor, req.data ?? {});
    case 'delete-item': {
      const doc = await foundry.utils.fromUuid(req.uuid);
      if (doc?.documentName !== 'Item' || doc.parent?.documentName !== 'Actor') return 'the item is gone';
      return checkDeleteItem(w, ledger, req.ctx, { actor: doc.parent.uuid, item: doc.id, type: doc.type });
    }
    default:
      return 'unknown request';
  }
}

async function perform(req: Request): Promise<boolean> {
  switch (req.kind) {
    case 'card': {
      const message = game.messages.get(req.message);
      if (!message) return false;
      // The summary is written from the card here, never taken from the request.
      await message.update({ [`flags.${SYSTEM_ID}.${FLAG}`]: req.card, content: summary(req.card) });
      return true;
    }
    case 'update': {
      const doc = await foundry.utils.fromUuid(req.uuid);
      const op = req.ctx.op;
      if (!doc || op.t === 'delete') return false;
      // Only the op's one path is written; the guard checked its value.
      await doc.update({ [op.path]: req.data[op.path] });
      break;
    }
    case 'create-item': {
      const actor = await foundry.utils.fromUuid(req.actor);
      if (!actor) return false;
      await actor.createEmbeddedDocuments('Item', [req.data], { keepId: true });
      break;
    }
    case 'delete-item': {
      const doc = await foundry.utils.fromUuid(req.uuid);
      if (!doc) return false;
      await doc.delete();
      break;
    }
  }
  recordRun(ledger, game.messages.get(req.ctx.message)?.getFlag(SYSTEM_ID, FLAG), req.ctx);
  return true;
}

export function registerProxy(): void {
  CONFIG.queries[QUERY] = async (req: Request, { user }: { user: any }) => {
    if (!game.user.isGM) throw new Error('only a GM performs Wings of Freedom card changes');
    if (!user?.isGM) {
      let why: string | null;
      try {
        why = await refusal(req, user);
      } catch (err) {
        why = `malformed request (${(err as Error)?.message})`;
      }
      if (why) {
        console.warn(`wings-of-freedom | refused a change asked by ${user?.name}: ${why}`, req);
        throw new Error(`${user?.name} may not make this change: ${why}`);
      }
    }
    return perform(req);
  };
}

async function viaGM(req: Request): Promise<boolean> {
  const gm = game.users.activeGM;
  if (!gm) {
    ui.notifications.warn(t('WOF.Roll.noGM'));
    return false;
  }
  try {
    return (await gm.query(QUERY, req, { timeout: 10_000 })) === true;
  } catch (err) {
    console.error('wings-of-freedom | the GM could not make the change', err);
    ui.notifications.error(t('WOF.Roll.gmFailed'));
    return false;
  }
}

/** Writes a card back to its message: directly when the user may, and through the GM otherwise (no new dice then). */
export async function writeCard(message: any, card: Card, rolls?: string[]): Promise<boolean> {
  if (message.canUserModify(game.user, 'update')) {
    const data: Record<string, unknown> = { [`flags.${SYSTEM_ID}.${FLAG}`]: card, content: summary(card) };
    if (rolls) data.rolls = rolls;
    await message.update(data);
    return true;
  }
  if (rolls && rolls.length !== message.rolls.length) {
    console.error('wings-of-freedom | only the card’s author adds dice to it');
    ui.notifications.error(t('WOF.Roll.gmFailed'));
    return false;
  }
  return viaGM({ kind: 'card', message: message.id, card });
}

/** Records on the user's own soldier that its owner agrees to Cover this roll, or withdraws. */
export async function setCovering(actor: any, messageId: string, on: boolean): Promise<void> {
  const list = ((actor.getFlag(SYSTEM_ID, COVERING_FLAG) as string[] | undefined) ?? []).filter((id) => id !== messageId);
  if (on) list.push(messageId);
  await actor.setFlag(SYSTEM_ID, COVERING_FLAG, list.slice(-COVERING_KEEP));
}

/** Runs one card op's update directly when the user may, and through the GM otherwise. */
export async function updateDoc(doc: any, data: Record<string, unknown>, ctx?: OpContext): Promise<boolean> {
  if (doc.canUserModify(game.user, 'update')) {
    await doc.update(data);
    return true;
  }
  if (!ctx) return false;
  return viaGM({ kind: 'update', uuid: doc.uuid, data, ctx });
}

export async function createItemOn(actor: any, data: Record<string, unknown>, ctx?: OpContext): Promise<boolean> {
  if (actor.isOwner) {
    await actor.createEmbeddedDocuments('Item', [data], { keepId: true });
    return true;
  }
  if (!ctx) return false;
  return viaGM({ kind: 'create-item', actor: actor.uuid, data, ctx });
}

export async function deleteItemOf(item: any, ctx?: OpContext): Promise<boolean> {
  if (item.isOwner) {
    await item.delete();
    return true;
  }
  if (!ctx) return false;
  return viaGM({ kind: 'delete-item', uuid: item.uuid, ctx });
}
