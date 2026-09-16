/**
 * Runs a card's recorded changes against the documents, forward or back (ADR-0026). Each change is
 * an Op (src/rules/roll.ts); numbers move by their delta, so Undo leaves later changes in place.
 */
import { autoApply } from '../settings.svelte.ts';
import { initialState, listValue, nextStates, numValue, type ApplyCategory, type Op } from '../rules/roll.ts';
import { createItemOn, deleteItemOf, updateDoc } from './proxy.ts';

const get = (doc: any, path: string) => foundry.utils.getProperty(doc._source ?? doc, path);

/**
 * Applies (dir 1) or undoes (dir -1) one op. Returns false when the target is gone or the change was
 * refused. `message` is the card's message id, which the GM checks a proxied change against.
 */
export async function runOp(op: Op, dir: 1 | -1, message?: string): Promise<boolean> {
  const actor = await foundry.utils.fromUuid(op.actor);
  if (!actor) return false;
  const ctx = message ? { message, op, dir } : undefined;
  switch (op.t) {
    case 'num': {
      const doc = op.item ? actor.items.get(op.item) : actor;
      if (!doc) return false;
      const current = Number(get(doc, op.path) ?? 0);
      return updateDoc(doc, { [op.path]: numValue(op, current, dir) }, ctx);
    }
    case 'set': {
      const doc = op.item ? actor.items.get(op.item) : actor;
      if (!doc) return false;
      return updateDoc(doc, { [op.path]: dir === 1 ? op.to : op.from }, ctx);
    }
    case 'add': {
      const list = (get(actor, op.path) ?? []) as unknown[];
      return updateDoc(actor, { [op.path]: listValue(op, list, dir) }, ctx);
    }
    case 'delete': {
      if (dir === 1) {
        const item = actor.items.get(op.item);
        return item ? deleteItemOf(item, ctx) : true;
      }
      if (actor.items.get(op.item)) return true;
      return createItemOn(actor, op.data, ctx);
    }
  }
}

/** Gives new ops their first state from the GM's auto-apply settings and applies the ones that are on. */
export async function applyNew(ops: Op[], message?: string): Promise<Op[]> {
  const enabled = autoApply();
  const out: Op[] = [];
  for (const op of ops) {
    const state = initialState(op.cat, enabled);
    if (state === 'done' && !(await runOp(op, 1, message))) {
      out.push({ ...op, state: 'pending' });
      continue;
    }
    out.push({ ...op, state });
  }
  return out;
}

/** Undo, Redo, or Apply on a card: returns the ops with their new states. */
export async function cardAction(ops: Op[], action: 'undo' | 'redo' | 'apply', message?: string): Promise<Op[]> {
  const next = ops.map((o) => ({ ...o }));
  for (const { index, dir } of nextStates(ops, action)) {
    if (await runOp(next[index], dir, message)) next[index].state = dir === 1 ? 'done' : 'undone';
  }
  return next;
}

/** Reverts the ops a Push or a second D6 replaces and drops them from the card. */
export async function dropOps(ops: Op[], which: (op: Op) => boolean, message?: string): Promise<Op[]> {
  for (const op of [...ops].reverse()) {
    if (which(op) && op.state === 'done') await runOp(op, -1, message);
  }
  return ops.filter((o) => !which(o));
}

/** Shorthand builders for the ops a card records. */
export const ops = {
  stress(actor: any, amount: number, label: string, extra: Partial<Op> = {}): Op {
    const d = actor.system.derived;
    const from = d.stress_effective;
    return { t: 'num', cat: 'stress', actor: actor.uuid, item: null, path: 'system.stress', from, to: from + amount, min: d.minimum_stress, max: null, label, state: 'pending', ...extra } as Op;
  },
  num(cat: ApplyCategory, actor: any, item: any | null, path: string, from: number, to: number, label: string, min = 0, max: number | null = null): Op {
    return { t: 'num', cat, actor: actor.uuid, item: item?.id ?? null, path, from, to, min, max, label, state: 'pending' };
  },
  set(cat: ApplyCategory, actor: any, item: any | null, path: string, from: unknown, to: unknown, label: string): Op {
    return { t: 'set', cat, actor: actor.uuid, item: item?.id ?? null, path, from, to, label, state: 'pending' };
  },
  add(cat: ApplyCategory, actor: any, path: string, value: Record<string, unknown>, label: string): Op {
    return { t: 'add', cat, actor: actor.uuid, path, value, label, state: 'pending' };
  },
  remove(cat: ApplyCategory, actor: any, item: any, label: string): Op {
    return { t: 'delete', cat, actor: actor.uuid, item: item.id, data: item.toObject(), label, state: 'pending' };
  },
};
