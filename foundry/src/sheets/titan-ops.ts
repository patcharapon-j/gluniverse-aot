/**
 * The changes the Titan sheet makes to its actor, each one document update built from the pure rules
 * in src/rules/titan.ts. Milestone 4's tracker drives the same fields; these are the GM's hand controls.
 */
import { cycleState, fillRegeneration, isGrounded, nextBehaviorFor, strikeSuccesses, withProgress, type BodyPart, type RegenerationResult } from '../rules/titan.ts';

const parts = (actor: any): BodyPart[] => foundry.utils.deepClone(actor.system.toObject().body_parts);

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
  return actor.update({ 'system.body_parts': list, 'system.openings': actor.system.openings + openings });
}

export async function fillRegen(actor: any): Promise<RegenerationResult | null> {
  const s = actor.system;
  const list = parts(actor);
  const next = fillRegeneration(s.regeneration, s.regeneration_clock, list, s.openings);
  await actor.update({
    'system.regeneration': next.filled,
    'system.body_parts': next.parts,
    'system.openings': next.openings,
    ...(next.result?.stands ? { 'system.heave_count': 0 } : {}),
  });
  return next.result;
}

export function stepBackRegen(actor: any) {
  return actor.update({ 'system.regeneration': Math.max(0, actor.system.regeneration - 1) });
}

export function setOpenings(actor: any, n: number) {
  return actor.update({ 'system.openings': Math.max(0, n) });
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
