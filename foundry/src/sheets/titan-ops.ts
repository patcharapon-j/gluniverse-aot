/**
 * The changes the Titan sheet makes to its actor, each one document update built from the pure rules
 * in src/rules/titan.ts. Milestone 4's tracker drives the same fields; these are the GM's hand controls.
 */
import { SYSTEM_ID } from '../config.ts';
import {
  blankEntry,
  cycleState,
  fillRegeneration,
  isGrounded,
  nextBehaviorFor,
  strikeSuccesses,
  withoutEntry,
  withProgress,
  type BehaviorRow,
  type BodyPart,
  type RegenerationResult,
} from '../rules/titan.ts';

const parts = (actor: any): BodyPart[] => foundry.utils.deepClone(actor.system.toObject().body_parts);

/** The Openings list resized to n: hand-added Openings have no creator; removals take the newest first. */
export function openingsTo(actor: any, n: number): { 'system.openings': number; 'system.openings_by': string[] } {
  const by = [...(actor.system.toObject().openings_by ?? [])] as string[];
  while (by.length < actor.system.openings) by.push('');
  const count = Math.max(0, n);
  while (by.length < count) by.push('');
  return { 'system.openings': count, 'system.openings_by': by.slice(0, count) };
}

/** A living Titan that stops being grounded clears its heave count (titan-harm.yaml, grounded, ends). */
function standingPatch(before: BodyPart[], after: BodyPart[]): Record<string, unknown> {
  return isGrounded(before) && !isGrounded(after) ? { 'system.heave_count': 0 } : {};
}

export function cyclePart(actor: any, index: number) {
  const list = parts(actor);
  const before = foundry.utils.deepClone(list);
  list[index] = cycleState(list[index]);
  return actor.update({ 'system.body_parts': list, ...standingPatch(before, list) });
}

/** Clicking a count pip sets the count; reaching Toughness moves the part one state toward Broken. */
export function setPartProgress(actor: any, index: number, count: number) {
  const list = parts(actor);
  const part = list[index];
  if (count >= part.toughness) list[index] = strikeSuccesses({ ...part, progress: part.toughness - 1 }, 1).part;
  else list[index] = withProgress(part, count);
  return actor.update({ 'system.body_parts': list });
}

/** One Body Part strike success (body_part_strikes, resolving); past Broken it becomes an Opening. */
export function strikePart(actor: any, index: number) {
  const list = parts(actor);
  const { part, openings } = strikeSuccesses(list[index], 1);
  list[index] = part;
  return actor.update({ 'system.body_parts': list, ...openingsTo(actor, actor.system.openings + openings) });
}

export async function fillRegen(actor: any): Promise<RegenerationResult | null> {
  const s = actor.system;
  const list = parts(actor);
  const next = fillRegeneration(s.regeneration, s.regeneration_clock, list, s.openings);
  await actor.update({
    'system.regeneration': next.filled,
    'system.body_parts': next.parts,
    ...openingsTo(actor, next.openings),
    ...(next.result?.stands ? { 'system.heave_count': 0 } : {}),
  });
  return next.result;
}

export function stepBackRegen(actor: any) {
  return actor.update({ 'system.regeneration': Math.max(0, actor.system.regeneration - 1) });
}

export function setOpenings(actor: any, n: number) {
  return actor.update(openingsTo(actor, n));
}

/**
 * Rolls the hidden Next Behavior (behavior-procedure.yaml, next_behavior.roll). The D6 is rolled
 * with Foundry's dice and never posted, so only the sheet's owner sees the result.
 */
export async function rollNextBehavior(actor: any): Promise<{ d6: number; entry: string }> {
  const roll = await new foundry.dice.Roll('1d6').evaluate({ allowInteractive: false });
  const s = actor.system;
  const entry = nextBehaviorFor(s.behavior_table.entries, s.body_parts, s.previous_behavior, roll.total);
  await actor.update({ 'system.next_behavior.entry': entry, 'system.next_behavior.revealed': false });
  return { d6: roll.total, entry };
}

export function setField(actor: any, path: string, value: unknown) {
  return actor.update({ [path]: value });
}

// ---------------------------------------------------------------- the Behavior Table

const entriesOf = (actor: any): BehaviorRow[] => foundry.utils.deepClone(actor.system.toObject().behavior_table.entries);

const write = (actor: any, entries: BehaviorRow[], rest: Record<string, unknown> = {}) =>
  actor.update({ 'system.behavior_table.entries': entries, ...rest });

/** A new entry at the end of the table, taking the first D6 result nothing else has claimed. */
export function addBehaviorEntry(actor: any) {
  const entries = entriesOf(actor);
  entries.push(blankEntry(entries, game.i18n.localize('WOF.TitanSheet.entry.newName')));
  return write(actor, entries);
}

/** One entry's fields as the sheet's form left them. */
export function setBehaviorEntry(actor: any, index: number, patch: Partial<BehaviorRow>) {
  const entries = entriesOf(actor);
  if (!entries[index]) return null;
  entries[index] = { ...entries[index], ...patch };
  return write(actor, entries);
}

/** Drops an entry, and lets go of it wherever the Titan still points at it. */
export function removeBehaviorEntry(actor: any, index: number) {
  const entries = entriesOf(actor);
  const gone = entries[index];
  if (!gone) return null;
  const s = actor.system;
  return write(actor, withoutEntry(entries, gone.id), {
    ...(s.next_behavior.entry === gone.id ? { 'system.next_behavior': { entry: '', revealed: false } } : {}),
    ...(s.previous_behavior === gone.id ? { 'system.previous_behavior': '' } : {}),
  });
}

/**
 * Takes the whole Behavior Table of one of the system's Titans, so a Titan written by hand starts
 * from a table that works. The Next and previous behaviors are cleared: they named the old table.
 */
export async function copyBehaviorTable(actor: any, titanId: string): Promise<boolean> {
  const packId = (CONFIG.WOF.packIds as Record<string, Record<string, string>>).titans?.[titanId];
  const pack = game.packs.get(`${SYSTEM_ID}.titans`);
  const source: any = packId && pack ? await pack.getDocument(packId) : null;
  if (!source) {
    ui.notifications.warn(game.i18n.localize('WOF.TitanSheet.entry.copyMissing'));
    return false;
  }
  await write(actor, foundry.utils.deepClone(source.system.toObject().behavior_table.entries), {
    'system.next_behavior': { entry: '', revealed: false },
    'system.previous_behavior': '',
  });
  return true;
}
