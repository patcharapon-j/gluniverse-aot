/**
 * Changes a player cannot make directly go through the active GM, with Foundry's User queries
 * (CONFIG.queries; core-plan 2d): recording a Cover or a Reaction on a card another user posted,
 * adding Stress to a comrade who Covers, and Undo by an owner on a card the GM posted. The GM's
 * client checks that the asking user owns an actor the card is about before it writes anything.
 */
import { SYSTEM_ID } from '../config.ts';
import { FLAG, type Card } from './card.ts';

const QUERY = `${SYSTEM_ID}.proxy`;

type Request =
  | { kind: 'update'; uuid: string; data: Record<string, unknown> }
  | { kind: 'create-item'; actor: string; data: Record<string, unknown> }
  | { kind: 'delete-item'; uuid: string };

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

/** The actor uuids a card concerns: the roller, the Covering comrade, a Titan attack's targets. */
function cardActors(card: Card | undefined): string[] {
  if (!card) return [];
  const out = [card.actor];
  if (card.kind === 'action' && card.cover) out.push(card.cover.actor);
  if (card.kind === 'attack') out.push(...card.targets.map((x) => x.actor));
  return out;
}

async function ownsAny(user: any, uuids: string[]): Promise<boolean> {
  for (const uuid of uuids) {
    const doc = await foundry.utils.fromUuid(uuid);
    if (doc?.testUserPermission?.(user, 'OWNER')) return true;
  }
  return false;
}

/** The GM side: may this user ask for this change? */
async function allowed(req: Request, user: any): Promise<boolean> {
  if (user.isGM) return true;
  if (req.kind === 'update') {
    const doc = await foundry.utils.fromUuid(req.uuid);
    if (!doc) return false;
    if (doc.documentName === 'ChatMessage') {
      // Only the card flags, by a user who owns an actor the card is about, or any soldier owner for a Reaction or Cover.
      const keys = Object.keys(foundry.utils.flattenObject(req.data));
      if (!keys.every((k) => k.startsWith(`flags.${SYSTEM_ID}.${FLAG}`) || k === 'content' || k.startsWith('rolls'))) return false;
      const card = doc.getFlag(SYSTEM_ID, FLAG) as Card | undefined;
      if (await ownsAny(user, cardActors(card))) return true;
      return (game.actors ?? []).some((a: any) => (a.type === 'soldier' || a.type === 'squadmate') && a.testUserPermission(user, 'OWNER'));
    }
    const actor = doc.documentName === 'Actor' ? doc : doc.parent;
    return !!actor && (actor.type === 'soldier' || actor.type === 'squadmate') && (await recentCardFor(user, actor.uuid));
  }
  const actorUuid = req.kind === 'create-item' ? req.actor : (await foundry.utils.fromUuid(req.uuid))?.parent?.uuid;
  return !!actorUuid && (await recentCardFor(user, actorUuid));
}

/** A user may change an actor they do not own only through a card that names it, posted or answered by them. */
async function recentCardFor(user: any, actorUuid: string): Promise<boolean> {
  const messages = [...(game.messages ?? [])].slice(-200);
  for (const m of messages) {
    const card = m.getFlag(SYSTEM_ID, FLAG) as Card | undefined;
    if (!card || !cardActors(card).includes(actorUuid)) continue;
    if (m.author?.id === user.id || (await ownsAny(user, cardActors(card)))) return true;
  }
  return false;
}

async function perform(req: Request): Promise<boolean> {
  switch (req.kind) {
    case 'update': {
      const doc = await foundry.utils.fromUuid(req.uuid);
      if (!doc) return false;
      await doc.update(req.data);
      return true;
    }
    case 'create-item': {
      const actor = await foundry.utils.fromUuid(req.actor);
      if (!actor) return false;
      await actor.createEmbeddedDocuments('Item', [req.data], { keepId: true });
      return true;
    }
    case 'delete-item': {
      const doc = await foundry.utils.fromUuid(req.uuid);
      if (!doc) return false;
      await doc.delete();
      return true;
    }
  }
}

export function registerProxy(): void {
  CONFIG.queries[QUERY] = async (req: Request, { user }: { user: any }) => {
    if (!game.user.isGM) throw new Error('only a GM performs Wings of Freedom card changes');
    if (!(await allowed(req, user))) throw new Error(`${user?.name} may not make this change`);
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

/** Updates a document directly when the user may, and through the GM otherwise. */
export async function updateDoc(doc: any, data: Record<string, unknown>): Promise<boolean> {
  if (doc.canUserModify(game.user, 'update')) {
    await doc.update(data);
    return true;
  }
  return viaGM({ kind: 'update', uuid: doc.uuid, data });
}

export async function createItemOn(actor: any, data: Record<string, unknown>): Promise<boolean> {
  if (actor.isOwner) {
    await actor.createEmbeddedDocuments('Item', [data], { keepId: true });
    return true;
  }
  return viaGM({ kind: 'create-item', actor: actor.uuid, data });
}

export async function deleteItemOf(item: any): Promise<boolean> {
  if (item.isOwner) {
    await item.delete();
    return true;
  }
  return viaGM({ kind: 'delete-item', uuid: item.uuid });
}
