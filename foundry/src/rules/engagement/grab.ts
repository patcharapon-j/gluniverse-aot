/**
 * The Grab (data/engagement/grab.yaml): the hold, the countdown in the Grabbed soldier's own turns,
 * and release. Pure and unit tested.
 */
import type { BodyPart } from '../titan.ts';
import { withPosition } from './positions.ts';
import type { GrabState, Position, SoldierState, TitanRow } from './types.ts';

/** The holding arm: the first arm in the stat block that is not Broken (grab_lands, hold). */
export function holdingArm(parts: readonly BodyPart[]): BodyPart | null {
  return parts.find((p) => p.kind === 'arm' && p.state !== 'broken') ?? null;
}

export interface GrabLanding {
  /** Only the crush lands (a Pinned target, pinned_target), or the whole Grab. */
  crushOnly: boolean;
  grab: GrabState | null;
  /** The target's Positions after the hold (on-body, with the close rule). */
  positions: Record<string, Position>;
  /** The holding arm with its count lost (its Toughness is grip Toughness while it holds). */
  parts: BodyPart[];
  /** Chapter 4 effects of the hold on the target. */
  clearAirborne: boolean;
  dismount: boolean;
  stopCarrying: string | null;
  stopBeingCarried: string | null;
}

/**
 * A Grab lands (grab_lands): the target becomes Grabbed, holds on-body relative to the holding Titan
 * (close rule), stops being airborne, carried, or carrying, is dismounted, and holds the Titan's
 * Attention. The holding arm's count is lost. A Pinned target takes only the crush. Null when the
 * Titan has no arm to hold with (a Broken arm cannot Grab).
 */
export function grabLands(target: SoldierState, titan: TitanRow, parts: readonly BodyPart[], focus: readonly string[]): GrabLanding | null {
  if (target.pinned) {
    return { crushOnly: true, grab: null, positions: { ...target.positions }, parts: [...parts], clearAirborne: false, dismount: false, stopCarrying: null, stopBeingCarried: null };
  }
  const arm = holdingArm(parts);
  if (!arm) return null;
  return {
    crushOnly: false,
    grab: { soldier: target.id, counted: 0, lifted: false, arm: arm.id },
    positions: withPosition(target.positions, titan.label, 'on-body', focus),
    parts: parts.map((p) => (p.id === arm.id ? { ...p, progress: 0 } : { ...p })),
    clearAirborne: target.airborne,
    dismount: target.mounted,
    stopCarrying: target.carrying,
    stopBeingCarried: target.carriedBy,
  };
}

export type CountEvent = 'lifted' | 'devoured' | null;

/**
 * One counted turn ends (countdown): at the end of the first, a soldier still Grabbed is lifted; at
 * the end of the second, devoured.
 */
export function countTurn(grab: GrabState): { grab: GrabState | null; event: CountEvent } {
  const counted = grab.counted + 1;
  if (counted === 1) return { grab: { ...grab, counted, lifted: true }, event: 'lifted' };
  return { grab: null, event: 'devoured' };
}

export interface Release {
  /** The freed soldier's Position relative to the holding Titan, or undefined when it is dead. */
  position: Position | undefined;
  /** A lifted soldier falls (release, lifted). */
  falls: boolean;
}

/** Being freed (release): in-reach relative to a living holder, a fall if lifted. */
export function release(grab: GrabState, titanAlive: boolean): Release {
  return { position: titanAlive ? 'in-reach' : undefined, falls: grab.lifted };
}

/** The Toughness a Body Part strike reads: grip Toughness for the holding arm. */
export function strikeToughness(part: BodyPart, grab: GrabState | null, gripToughness: number): number {
  return grab && grab.arm === part.id ? gripToughness : part.toughness;
}

/** The Positions a strike against the holding arm may be made from (escapes, strike-the-holding-arm). */
export function holdingArmReach(grab: GrabState, reach: { before: readonly string[]; after: readonly string[] }, clearTheHand: boolean): string[] {
  const list = grab.lifted ? [...reach.after] : [...reach.before];
  if (clearTheHand && !list.includes('in-reach')) list.push('in-reach');
  return list;
}

/** Break Free's need and its penalty dice (escapes, break-free). */
export function breakFreeNeeds(grab: GrabState, rule: { needs: number; liftedPenalty: number }): { needs: number; penalty: number } {
  return { needs: rule.needs, penalty: grab.lifted ? rule.liftedPenalty : 0 };
}
