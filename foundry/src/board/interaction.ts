/**
 * Drag and drop on the board (zone-combat-design.md 7.6; 16-34, Interaction). Pure: hit-testing the
 * scene, matching a drop to the moves the rules layer offers (`moveOptionsFor`), the labels the
 * lit destinations carry, and Direct Control's placements. The board never decides a legal move:
 * outside Direct Control a destination lights only when an offered ZoneMoveOption ends there.
 */
import type { ZoneMoveOption } from '../rules/engagement/positions.ts';
import { inHex, inRect } from './layout.ts';
import type { Scene } from './scene.ts';
import type { BoardSoldier, Placement, Pt, ZoneId } from './types.ts';

export type { ZoneMoveOption };

export type DropTarget =
  | { kind: 'zone'; zone: ZoneId }
  | { kind: 'body'; label: string; zone: ZoneId }
  | { kind: 'rear'; label: string; zone: ZoneId }
  | { kind: 'off' };

export const targetKey = (t: DropTarget): string => (t.kind === 'zone' ? `zone:${t.zone}` : t.kind === 'off' ? 'off' : `${t.kind}:${t.label}`);

/** What lies under a board point: a Titan's rear marker, then its body, then a zone; outside every zone is off field. */
export function hitTarget(scene: Scene, p: Pt): DropTarget {
  // The front-most Titan first (drawn last, lowest on screen).
  const titans = [...scene.titans].sort((a, b) => b.foot.y - a.foot.y);
  for (const t of titans) if (inRect(p, t.rearHit)) return { kind: 'rear', label: t.label, zone: t.zone };
  for (const t of titans) if (inRect(p, t.hit)) return { kind: 'body', label: t.label, zone: t.zone };
  const tile = scene.tiles.find((z) => inHex(p, z.centre));
  return tile ? { kind: 'zone', zone: tile.n } : { kind: 'off' };
}

/** The soldier figure under a board point, front-most first, or null. */
export function hitSoldier(scene: Scene, p: Pt): string | null {
  const list = [...scene.soldiers].sort((a, b) => b.foot.y - a.foot.y);
  return list.find((s) => inRect(p, s.hit))?.id ?? null;
}

/** The Titan figure under a board point (its body, not the rear marker), or null. */
export function hitTitan(scene: Scene, p: Pt): string | null {
  const list = [...scene.titans].sort((a, b) => b.foot.y - a.foot.y);
  return list.find((t) => inRect(p, t.hit))?.key ?? null;
}

const FREE = new Set(['ground', 'anchored']);

/** Does an offered move end on this target? */
export function endsOn(o: ZoneMoveOption, t: DropTarget): boolean {
  const to = o.to;
  switch (t.kind) {
    case 'off':
      return o.leaves || to.zone === null;
    case 'zone':
      return !o.leaves && to.zone === t.zone && FREE.has(to.attachment.kind);
    case 'body':
      return !o.leaves && to.zone === t.zone && (to.attachment.kind === 'on-body' || to.attachment.kind === 'grabbed') && to.attachment.body === t.label;
    case 'rear':
      return !o.leaves && to.zone === t.zone && to.attachment.kind === 'blind-spot' && to.attachment.body === t.label;
  }
}

export const optionsOn = (options: readonly ZoneMoveOption[], t: DropTarget) => options.filter((o) => endsOn(o, t));

/** Cheapest first: no roll before a roll, then fewer Momentum, then fewer steps. */
export function rankOptions(options: readonly ZoneMoveOption[]): ZoneMoveOption[] {
  return [...options].sort((a, b) => Number(a.fly) - Number(b.fly) || a.momentum - b.momentum || a.steps.length - b.steps.length);
}

export interface Lit {
  key: string;
  target: DropTarget;
  /** The Momentum the cheapest way there costs (its Carries), or 0. */
  momentum: number;
  /** The cheapest way there is a Flight, so it will be rolled. */
  fly: boolean;
  /** Some way there crosses a Focus Titan's zone (the crossing flag, which Quiet may avoid). */
  crosses: boolean;
  /** How many offered moves end here. */
  ways: number;
}

/** Every destination the offered moves light, with its cheapest cost (16-34: Carry cost and "Fly"). */
export function litTargets(scene: Scene, options: readonly ZoneMoveOption[]): Lit[] {
  const targets: DropTarget[] = [
    ...scene.tiles.map((z): DropTarget => ({ kind: 'zone', zone: z.n })),
    ...scene.titans.filter((t) => !t.corpse).flatMap((t): DropTarget[] => [
      { kind: 'body', label: t.label, zone: t.zone },
      { kind: 'rear', label: t.label, zone: t.zone },
    ]),
    { kind: 'off' },
  ];
  const out: Lit[] = [];
  for (const target of targets) {
    const here = rankOptions(optionsOn(options, target));
    if (!here.length) continue;
    out.push({ key: targetKey(target), target, momentum: here[0].momentum, fly: here[0].fly, crosses: here.some((o) => o.crosses.length > 0), ways: here.length });
  }
  return out;
}

/** Every target, for Direct Control (ADR-0028): every zone and attachment lights and nothing is checked. */
export function directTargets(scene: Scene): Lit[] {
  const targets: DropTarget[] = [
    ...scene.tiles.map((z): DropTarget => ({ kind: 'zone', zone: z.n })),
    ...scene.titans.flatMap((t): DropTarget[] => [
      { kind: 'body', label: t.label, zone: t.zone },
      { kind: 'rear', label: t.label, zone: t.zone },
    ]),
    { kind: 'off' },
  ];
  return targets.map((target) => ({ key: targetKey(target), target, momentum: 0, fly: false, crosses: false, ways: 1 }));
}

/**
 * Direct Control's placement for a drop: a zone keeps a free soldier's own free attachment (an
 * airborne or anchored soldier stays anchored) and sets the ground otherwise; a body is On Body, its
 * rear marker the Blind Spot, and off field leaves the zone empty.
 */
export function directPlacement(t: DropTarget, s: Pick<BoardSoldier, 'attachment' | 'airborne'>): Placement {
  switch (t.kind) {
    case 'off':
      return { zone: null, attachment: { kind: 'ground', body: null } };
    case 'zone': {
      const kind = s.attachment.kind === 'anchored' || s.airborne ? 'anchored' : 'ground';
      return { zone: t.zone, attachment: { kind, body: null } };
    }
    case 'body':
      return { zone: t.zone, attachment: { kind: 'on-body', body: t.label } };
    case 'rear':
      return { zone: t.zone, attachment: { kind: 'blind-spot', body: t.label } };
  }
}

/**
 * Quiet (anchor-ratings.yaml, momentum, spends, quiet; 16-14, 16-15): 1 Momentum that stops every flag
 * the soldier would set this turn, the crossing flag included. The board offers it on a move that would
 * set a flag, when Quiet is not already spent this turn and the soldier can pay. `block` is the rules
 * layer's own answer (momentum.ts, spendBlock). A Flight pays Quiet from what the soldier holds after
 * the roll, so an empty purse does not rule it out; a move on foot or mounted pays it now.
 */
export function quietOffered(o: Pick<ZoneMoveOption, 'crosses' | 'charge' | 'fly'>, block: string | null, spent: boolean): boolean {
  if (spent || (!o.crosses.length && !o.charge.length)) return false;
  return o.fly ? block === null || block === 'noMomentum' : block === null;
}

/** Quiet on its own, from the selected soldier's control: offered while unspent and payable now. */
export const quietNow = (block: string | null, spent: boolean): boolean => !spent && block === null;

/**
 * Dragging a soldier off the body they hold to their own zone is letting go (7.6), which the board
 * warns is a fall before it commits. Only when no offered move ends there instead.
 */
export function isLetGo(t: DropTarget, s: Pick<BoardSoldier, 'zone' | 'attachment'>, options: readonly ZoneMoveOption[]): boolean {
  const held = s.attachment.kind === 'on-body' || s.attachment.kind === 'blind-spot';
  return held && t.kind === 'zone' && t.zone === s.zone && optionsOn(options, t).length === 0;
}
