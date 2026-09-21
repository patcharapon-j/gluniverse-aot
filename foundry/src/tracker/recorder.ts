/**
 * Records the document changes a tracker step makes, so each can be undone (ADR-0026). Values are
 * written in one update per document; Undo writes back the value before only while the document
 * still holds the value the step wrote (src/rules/engagement/round.ts, revertValue).
 */
import { SYSTEM_ID } from '../config.ts';
import { FLAG, type Card } from '../dice/card.ts';
import { cardAction } from '../dice/apply.ts';
import { promptOpsOf } from '../dice/prompt.ts';
import { revertValue, type TrackerOp } from '../rules/engagement/round.ts';

const src = (doc: any, path: string) => foundry.utils.deepClone(foundry.utils.getProperty(doc._source ?? doc, path));

export class Recorder {
  ops: TrackerOp[] = [];
  lines: string[] = [];
  #patches = new Map<any, Record<string, unknown>>();

  /** The value a path will hold once this recorder commits. */
  get(doc: any, path: string): any {
    const p = this.#patches.get(doc);
    return p && path in p ? foundry.utils.deepClone(p[path]) : src(doc, path);
  }

  set(doc: any, path: string, value: unknown): void {
    if (!doc) return;
    const before = this.get(doc, path);
    if (JSON.stringify(before) === JSON.stringify(value)) return;
    let patch = this.#patches.get(doc);
    if (!patch) this.#patches.set(doc, (patch = {}));
    patch[path] = foundry.utils.deepClone(value);
    const existing = this.ops.find((o) => o.t === 'set' && o.uuid === doc.uuid && o.path === path) as Extract<TrackerOp, { t: 'set' }> | undefined;
    if (existing) existing.to = foundry.utils.deepClone(value);
    else this.ops.push({ t: 'set', uuid: doc.uuid, path, from: src(doc, path), to: foundry.utils.deepClone(value) });
  }

  /**
   * Writes a value in the same update as the recorded changes but records no op, so Undo never writes
   * it back: the board's event (combat.system.boardEvent), whose seq only rises.
   */
  setUnrecorded(doc: any, path: string, value: unknown): void {
    if (!doc) return;
    let patch = this.#patches.get(doc);
    if (!patch) this.#patches.set(doc, (patch = {}));
    patch[path] = foundry.utils.deepClone(value);
  }

  line(text: string): void {
    this.lines.push(text);
  }

  async commit(): Promise<void> {
    const patches = [...this.#patches];
    this.#patches.clear();
    for (const [doc, patch] of patches) await doc.update(patch);
  }

  /** Creates embedded documents now (after committing pending changes) and records them. */
  async create(parent: any, collection: string, data: Record<string, unknown>[], options: Record<string, unknown> = {}): Promise<any[]> {
    await this.commit();
    const docs = await parent.createEmbeddedDocuments(collection, data, options);
    for (const d of docs) this.ops.push({ t: 'create', uuid: d.uuid, parent: parent.uuid, collection, data: d.toObject() });
    return docs;
  }

  message(id: string): void {
    this.ops.push({ t: 'message', id });
  }
}

/** Undoes ops in reverse order; returns the paths that were kept because they changed since. */
export async function revertOps(ops: readonly TrackerOp[]): Promise<string[]> {
  const kept: string[] = [];
  const patches = new Map<string, Record<string, unknown>>();
  const flush = async () => {
    for (const [uuid, patch] of patches) {
      const doc = await foundry.utils.fromUuid(uuid);
      if (doc) await doc.update(patch);
    }
    patches.clear();
  };
  for (const op of [...ops].reverse()) {
    if (op.t === 'set') {
      const doc = await foundry.utils.fromUuid(op.uuid);
      if (!doc) continue;
      const pending = patches.get(op.uuid);
      const current = pending && op.path in pending ? pending[op.path] : src(doc, op.path);
      const back = revertValue(op, current);
      if (!back) {
        kept.push(`${doc.name ?? op.uuid}: ${op.path}`);
        continue;
      }
      patches.set(op.uuid, { ...(pending ?? {}), [op.path]: back.value });
    } else if (op.t === 'create') {
      await flush();
      const doc = await foundry.utils.fromUuid(op.uuid);
      if (doc) await doc.delete();
    } else {
      await flush();
      const message = game.messages.get(op.id);
      const card = message?.getFlag(SYSTEM_ID, FLAG) as Card | undefined;
      if (card?.ops?.some((o) => o.state === 'done')) await cardAction(card.ops, 'undo', message.id);
      // A prompt card carries the ops of every answer it has had (src/dice/prompt.ts): the step
      // that posted it takes those back first, so a half-answered prompt undoes cleanly.
      kept.push(...(await revertOps(promptOpsOf(message))));
      if (message) await message.delete();
    }
  }
  await flush();
  return kept;
}

/** Applies ops again (Redo): set ops write their value, created documents are created again. */
export async function replayOps(ops: readonly TrackerOp[]): Promise<void> {
  for (const op of ops) {
    if (op.t === 'set') {
      const doc = await foundry.utils.fromUuid(op.uuid);
      if (doc) await doc.update({ [op.path]: op.to });
    } else if (op.t === 'create') {
      const parent = await foundry.utils.fromUuid(op.parent);
      if (parent && !(await foundry.utils.fromUuid(op.uuid))) await parent.createEmbeddedDocuments(op.collection, [op.data], { keepId: true });
    }
  }
}
