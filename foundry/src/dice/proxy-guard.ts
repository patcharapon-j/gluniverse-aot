/**
 * The GM side of the card proxy (src/dice/proxy.ts), kept free of Foundry globals so it can be
 * tested: what a player may ask the GM to change for them.
 *
 * - A card rewrite may differ from the stored card only in its Cover, its Reactions, a call card's
 *   answer, and the state of its ops. Each of those is checked against the world.
 * - An actor or item change must be an op the card records (or the Cover cost of the Push being
 *   made), on the card's roller or on a comrade who agreed to Cover that roll, on a path a card op
 *   can touch, with the value the op gives. Ownership and any other field are never changed.
 * - An item is created or deleted only as a recorded op says: same actor, id and item type.
 * - A Push on a card the user did not post is asked for by the roller's owner and made by the GM
 *   itself: the GM rolls the card's non-6 base and Stress dice and derives every change from the
 *   stored card, so only whether the Push may be made is checked here.
 */
import { listValue, numValue, pushBlock, type Op } from '../rules/roll.ts';
import { successesOf, type Card } from './card.ts';

/** What the guard needs to know about the world, as the GM's client sees it. */
export interface GuardWorld {
  /** The asking user's id. */
  userId: string;
  /** Does the asking user own the document at this uuid? */
  owns(uuid: string): boolean;
  actor(uuid: string): { type: string; name: string } | null;
  message(id: string): { author: string | null; card: Card | undefined } | null;
  /** The stored value at a path on an actor, or on one of its items. */
  value(actor: string, item: string | null, path: string): unknown;
  item(actor: string, item: string): { type: string } | null;
  /** The message ids a soldier's owner agreed to Cover (the soldier's own flag). */
  covering(actor: string): string[];
}

/** Which way each Cover cost was last moved, so a replayed request is refused (GM memory only). */
export type Ledger = Map<string, 1 | -1>;

export interface OpContext {
  message: string;
  op: Op;
  dir: 1 | -1;
}

/** The paths a card op writes (src/dice/apply.ts `ops` callers), by op kind and target. */
const PATHS = {
  num: { actor: ['system.stress', 'system.gas_rating', 'system.next_roll_penalty'], item: ['system.current'] },
  set: { actor: ['system.drive_used_this_session', 'flags.wings-of-freedom.pushedOdm'], item: ['system.used'] },
  add: { actor: ['system.lasting_stress_responses', 'system.pending_fear_results'], item: [] as string[] },
} as const;

/** Item types a card may delete and create again (a ruined gear item). */
const ITEM_TYPES = ['gear'];

const SOLDIERS = ['soldier', 'squadmate'];

/** JSON with sorted keys, so two equal values compare equal whatever their key order. */
export function stable(x: unknown): string {
  return JSON.stringify(x, (_k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v));
}

const same = (a: unknown, b: unknown) => stable(a) === stable(b);

const withoutState = (op: Op) => {
  const { state: _state, ...rest } = op;
  return rest;
};

/** The ledger key of an op: everything but its state. */
const opKey = (message: string, op: Op) => `${message}:${stable(withoutState(op))}`;

// ---------------------------------------------------------------- card rewrites

/** Why a player may not write `next` over the stored card, or null when they may. */
export function checkCardRewrite(w: GuardWorld, messageId: string, stored: Card | undefined, next: Card): string | null {
  if (!stored) return 'the message has no card';
  if (!next || typeof next !== 'object' || next.kind !== stored.kind) return 'the card kind changed';

  // Everything but the fields a player may change must stay as it is.
  const strip = (c: Card) => {
    const x: Record<string, unknown> = { ...c, ops: (c.ops ?? []).map(withoutState) };
    if (c.kind === 'action') delete x.cover;
    if (c.kind === 'attack' || c.kind === 'foe-attack') delete x.reactions;
    if (c.kind === 'call') delete x.rolled;
    return x;
  };
  if (!Array.isArray(next.ops) || !same(strip(stored), strip(next))) return 'the card changed beyond Cover, Reactions and op state';

  if (next.ops.some((o, i) => o.state !== stored.ops[i].state)) {
    if (!w.owns(stored.actor)) return 'only the roller’s owner changes op state';
    if (next.ops.some((o) => !['done', 'undone', 'pending'].includes(o.state))) return 'unknown op state';
  }

  if (stored.kind === 'action' && next.kind === 'action' && !same(stored.cover, next.cover)) {
    const why = checkCover(w, messageId, stored, next.cover);
    if (why) return why;
  }
  if ((stored.kind === 'attack' || stored.kind === 'foe-attack') && next.kind === stored.kind && !same(stored.reactions, (next as typeof stored).reactions)) {
    const why = checkReactions(w, messageId, stored.reactions, (next as typeof stored).reactions);
    if (why) return why;
  }
  if (stored.kind === 'call' && next.kind === 'call' && stored.rolled !== next.rolled) {
    const why = checkAnswer(w, messageId, stored, next.rolled);
    if (why) return why;
  }
  return null;
}

function checkCover(w: GuardWorld, messageId: string, stored: Extract<Card, { kind: 'action' }>, cover: unknown): string | null {
  if (!stored.coverAllowed || !stored.pushAllowed || stored.pushes >= stored.maxPushes) return 'this roll cannot be Covered now';
  if (cover === null) {
    // Withdrawing a Cover: the covering soldier's owner.
    return stored.cover && w.owns(stored.cover.actor) ? null : 'only the covering soldier’s owner withdraws Cover';
  }
  if (stored.cover) return 'the roll is already Covered';
  const c = cover as { actor?: unknown; name?: unknown };
  if (!c || typeof c.actor !== 'string' || Object.keys(c).some((k) => k !== 'actor' && k !== 'name')) return 'malformed Cover';
  const actor = w.actor(c.actor);
  // A Squadmate never Covers (data/character/squadmates.yaml).
  if (!actor || actor.type !== 'soldier') return 'Cover comes from a soldier';
  if (c.actor === stored.actor) return 'a soldier does not Cover their own roll';
  if (!w.owns(c.actor)) return 'Cover comes from the user’s own soldier';
  if (c.name !== actor.name) return 'the Cover name does not match the soldier';
  if (!w.covering(c.actor).includes(messageId)) return 'the soldier has not agreed to Cover this roll';
  return null;
}

type Reaction = Extract<Card, { kind: 'attack' }>['reactions'][number];

function checkReactions(w: GuardWorld, attackId: string, before: Reaction[], after: unknown): string | null {
  if (!Array.isArray(after)) return 'malformed Reactions';
  const known = new Set(before.map((r) => stable(r)));
  const kept = new Set(after.map((r) => (r as Reaction)?.message));
  // A reaction is only ever replaced (after a Push), never dropped.
  if (before.some((r) => !kept.has(r.message))) return 'a Reaction was removed';
  if (after.length !== kept.size) return 'two Reactions for one roll';
  for (const r of after as Reaction[]) {
    if (known.has(stable(r))) continue;
    if (!r || Object.keys(r).sort().join() !== 'actor,message,name,successes') return 'malformed Reaction';
    const dodge = w.message(r.message);
    const card = dodge?.card;
    if (!dodge || card?.kind !== 'action' || card.attack?.message !== attackId) return 'the Reaction is not a dodge of this attack';
    if (dodge.author !== w.userId && !w.owns(card.actor)) return 'the Reaction belongs to another user';
    if (r.actor !== card.actor || r.name !== card.actorName || r.successes !== successesOf(card)) return 'the Reaction does not match its dodge';
  }
  return null;
}

function checkAnswer(w: GuardWorld, callId: string, stored: Extract<Card, { kind: 'call' }>, rolled: unknown): string | null {
  if (stored.rolled !== null || typeof rolled !== 'string') return 'the call is already answered';
  const answer = w.message(rolled);
  const card = answer?.card;
  if (!answer || card?.kind !== 'action' || card.call !== callId || card.actor !== stored.actor) return 'the answer is not a roll for this call';
  if (answer.author !== w.userId || !w.owns(stored.actor)) return 'the answer belongs to another user';
  return null;
}

// ---------------------------------------------------------------- Push requests

/**
 * Why the user may not have the GM Push this card, or null. The card must be an action roll on a
 * soldier the user owns, still Pushable by its record, and a Cover on it must still be agreed. The
 * GM's Push checks the roller's Down itself.
 */
export function checkPushRequest(w: GuardWorld, messageId: string): string | null {
  const card = w.message(messageId)?.card;
  if (!card) return 'the card is gone';
  if (card.kind !== 'action') return 'only an action roll is Pushed';
  if (!w.owns(card.actor)) return 'only the roller’s owner Pushes';
  if (w.actor(card.actor)?.type !== 'soldier') return 'only a soldier Pushes';
  const block = pushBlock({ dice: card.dice, pushes: card.pushes, maxPushes: card.maxPushes, pushAllowed: card.pushAllowed, down: false });
  if (block) return `the roll cannot be Pushed (${block})`;
  if (card.cover && !w.covering(card.cover.actor).includes(messageId)) return 'the soldier has not agreed to Cover this roll';
  return null;
}

// ---------------------------------------------------------------- actor and item changes

/** Finds the op a request names on the card, or accepts the Cover cost of the Push being made. */
function findOp(card: Card, op: Op): { recorded: boolean } | null {
  if (card.ops.some((o) => same(withoutState(o), withoutState(op)))) return { recorded: true };
  if (card.kind === 'action' && card.cover && isCoverCost(op, card.cover.actor) && card.pushAllowed && card.pushes < card.maxPushes) return { recorded: false };
  return null;
}

/** The 1 Stress a Covering comrade takes for a Push (data/core/stress-changes.yaml, push and cover). */
function isCoverCost(op: Op, coverer: string): boolean {
  return op.t === 'num' && op.cat === 'stress' && op.actor === coverer && op.item === null && op.path === 'system.stress' && op.to - op.from === 1 && !op.outcome && !op.response;
}

/** Common checks for any op a player asks the GM to run: returns the reason to refuse, or null. */
function checkOpContext(w: GuardWorld, ledger: Ledger, ctx: OpContext | undefined): string | null {
  if (!ctx || typeof ctx.message !== 'string' || !ctx.op || (ctx.dir !== 1 && ctx.dir !== -1)) return 'the change names no card op';
  const message = w.message(ctx.message);
  const card = message?.card;
  if (!card) return 'the card is gone';
  if (!w.owns(card.actor)) return 'only the roller’s owner applies a card’s changes';
  const found = findOp(card, ctx.op);
  if (!found) return 'the op is not on the card';
  if (!found.recorded && ctx.dir !== 1) return 'an unrecorded op is only applied';

  const op = ctx.op;
  if (op.actor === card.actor) return null;
  // Any other actor: only the Cover cost, on a comrade who agreed to Cover this roll, once each way.
  if (card.kind !== 'action' || !isCoverCost(op, op.actor)) return 'the op changes an actor the card is not about';
  const key = opKey(ctx.message, op);
  const last = ledger.get(key);
  if (last === ctx.dir) return 'the change was already made';
  if (!(ctx.dir === -1 && last === 1) && !w.covering(op.actor).includes(ctx.message)) return 'the soldier has not agreed to Cover this roll';
  return null;
}

/** Records a Cover cost the GM has run, so the same request cannot be replayed. */
export function recordRun(ledger: Ledger, card: Card | undefined, ctx: OpContext): void {
  if (card && ctx.op.actor !== card.actor) ledger.set(opKey(ctx.message, ctx.op), ctx.dir);
}

/** An update of an actor (item null) or one of its items. */
export function checkOpUpdate(w: GuardWorld, ledger: Ledger, ctx: OpContext | undefined, target: { actor: string; actorType: string; item: string | null }, data: Record<string, unknown>): string | null {
  const why = checkOpContext(w, ledger, ctx);
  if (why) return why;
  const op = ctx!.op;
  if (op.t === 'delete') return 'a delete op is not an update';
  if (!SOLDIERS.includes(target.actorType)) return 'only soldiers and Squadmates are changed by a card';
  if (target.actor !== op.actor || target.item !== (op.t === 'add' ? null : op.item)) return 'the change targets another document';
  const paths = PATHS[op.t][target.item === null ? 'actor' : 'item'] as readonly string[];
  if (!paths.includes(op.path)) return `a card never writes ${op.path}`;
  const keys = Object.keys(data);
  if (keys.length !== 1 || keys[0] !== op.path) return 'the change writes more than the op’s path';

  const value = data[op.path];
  const current = w.value(op.actor, target.item, op.path);
  switch (op.t) {
    case 'num': {
      const expected = numValue(op, Number(current ?? 0), ctx!.dir);
      return value === expected ? null : 'the value is not the op’s';
    }
    case 'set':
      return same(value, ctx!.dir === 1 ? op.to : op.from) ? null : 'the value is not the op’s';
    case 'add': {
      const list = Array.isArray(current) ? current : [];
      return same(value, listValue(op, list, ctx!.dir)) ? null : 'the value is not the op’s';
    }
  }
}

/** Creating an item again: the Undo of a recorded delete op. */
export function checkCreateItem(w: GuardWorld, ledger: Ledger, ctx: OpContext | undefined, actor: string, data: Record<string, unknown>): string | null {
  const why = checkOpContext(w, ledger, ctx);
  if (why) return why;
  const op = ctx!.op;
  if (op.t !== 'delete' || ctx!.dir !== -1) return 'only a delete op’s Undo creates an item';
  if (actor !== op.actor) return 'the item goes on another actor';
  if (!ITEM_TYPES.includes(String(op.data?.type)) || data?.type !== op.data.type) return 'a card never creates this item type';
  if (data._id !== op.item || !same(data, op.data)) return 'the item is not the one the card removed';
  if (w.item(actor, op.item)) return 'the item already exists';
  return null;
}

/** Deleting an item: a recorded delete op (a ruined gear item). */
export function checkDeleteItem(w: GuardWorld, ledger: Ledger, ctx: OpContext | undefined, target: { actor: string; item: string; type: string }): string | null {
  const why = checkOpContext(w, ledger, ctx);
  if (why) return why;
  const op = ctx!.op;
  if (op.t !== 'delete' || ctx!.dir !== 1) return 'only a delete op removes an item';
  if (target.actor !== op.actor || target.item !== op.item) return 'the item is not the one the card names';
  if (!ITEM_TYPES.includes(target.type) || target.type !== op.data?.type) return 'a card never deletes this item type';
  return null;
}
