/**
 * Rolls made against a Focus Titan: what each needs and what its successes do
 * (data/engagement/titan-harm.yaml: body_part_strikes, grounded, nape_strikes, openings;
 * data/engagement/attention.yaml: break_attention; data/core/bonus-dice-sources.yaml). Pure and unit
 * tested. Every block is a key under WOF.Tracker.block.
 */
import { strikeSuccesses, type BodyPart } from '../titan.ts';
import { holdingArmReach, strikeToughness } from './grab.ts';
import type { GrabState, Position, SoldierState, TitanRow } from './types.ts';

const CLOSE: readonly Position[] = ['on-body', 'blind-spot'];
const GROUNDED_REACH: readonly Position[] = ['in-reach', 'on-body', 'blind-spot'];

export interface StrikeContext {
  soldier: SoldierState;
  titan: TitanRow;
  /** The soldier is Grabbed (by any Titan). */
  grabbed: boolean;
  retreat: boolean;
}

function common(x: StrikeContext): string | null {
  if (x.titan.status !== 'focus') return 'corpse';
  if (!x.soldier.alive) return 'dead';
  if (x.soldier.left || x.soldier.positions[x.titan.label] === undefined) return 'noPosition';
  if (x.grabbed) return 'grabbed';
  return null;
}

/** nape_strikes.requirements. */
export function napeStrikeBlock(x: StrikeContext): string | null {
  const c = common(x);
  if (c) return c;
  if (x.retreat) return 'retreat';
  if (x.soldier.positions[x.titan.label] !== 'blind-spot') return 'notBlindSpot';
  if (x.titan.holder === x.soldier.id) return 'holder';
  if (!x.titan.grounded && !x.soldier.odmHad) return 'noOdm';
  return null;
}

/** Openings a soldier may spend: every Opening they did not create (openings, own_openings). */
export const spendableOpenings = (openingsBy: readonly string[], soldier: string) => openingsBy.filter((o) => o !== soldier).length;

/** The Openings left after a soldier spends `n` of those they may spend. */
export function spendOpenings(openingsBy: readonly string[], soldier: string, n: number): string[] {
  const out = [...openingsBy];
  let left = n;
  for (let i = 0; i < out.length && left > 0; ) {
    if (out[i] !== soldier) {
      out.splice(i, 1);
      left--;
    } else i++;
  }
  return out;
}

/** The Bonus Dice a Nape strike takes from the Titan, within the cap (bonus-dice-sources.yaml). */
export function napeBonus(spent: number, grounded: boolean, dice: { opening: number; grounded: number }, other: number, cap: number): { openings: number; grounded: number } {
  const g = grounded ? Math.min(dice.grounded, Math.max(0, cap - other)) : 0;
  const room = Math.max(0, cap - other - g);
  return { openings: Math.min(spent * dice.opening, room), grounded: g };
}

export interface NapeResult {
  kill: boolean;
  /** Openings created by the striker. */
  openings: number;
  /** The striker holds the hooked-by-strike flag whatever the result. */
  hooked: true;
}

/** nape_strikes: kill at the Nape Depth; otherwise one Opening a success, and Relentless adds one on at least 1 success. */
export function napeStrikeResult(successes: number, napeDepth: number, relentless: boolean): NapeResult {
  if (successes >= napeDepth) return { kill: true, openings: 0, hooked: true };
  return { kill: false, openings: successes + (relentless && successes >= 1 ? 1 : 0), hooked: true };
}

export interface PartContext extends StrikeContext {
  parts: readonly BodyPart[];
  partId: string;
  /** body_part_kinds[].strike_from by kind. */
  strikeFrom: Record<string, readonly string[]>;
  grab: GrabState | null;
  holdingReach: { before: readonly string[]; after: readonly string[] };
  clearTheHand: boolean;
}

/** body_part_strikes.requirements. */
export function bodyPartStrikeBlock(x: PartContext): string | null {
  const c = common(x);
  if (c) return c;
  const part = x.parts.find((p) => p.id === x.partId);
  if (!part) return 'noPart';
  if (part.state === 'broken') return 'broken';
  const p = x.soldier.positions[x.titan.label];
  const holding = !!x.grab && x.grab.arm === part.id;
  const reach = holding ? holdingArmReach(x.grab!, x.holdingReach, x.clearTheHand) : x.titan.grounded ? [...GROUNDED_REACH] : [...(x.strikeFrom[part.kind] ?? [])];
  if (!reach.includes(p)) return 'reach';
  const odmLifted = x.titan.grounded || (holding && x.clearTheHand);
  if (CLOSE.includes(p) && !odmLifted && !x.soldier.odmHad) return 'noOdm';
  return null;
}

export interface PartResult {
  parts: BodyPart[];
  openings: number;
  /** The strike set the just-hurt flag (at least 1 success). */
  hurt: boolean;
  /** The part became Broken with this strike. */
  broke: boolean;
  /** A Broken holding arm frees the Grabbed soldier. */
  freed: boolean;
  /** A leg became Broken and the Titan was not grounded before. */
  grounds: boolean;
}

/** body_part_strikes.resolving, with the holding arm at grip Toughness. */
export function bodyPartStrikeResult(parts: readonly BodyPart[], partId: string, successes: number, grab: GrabState | null, gripToughness: number): PartResult {
  const index = parts.findIndex((p) => p.id === partId);
  if (index < 0) return { parts: [...parts], openings: 0, hurt: successes >= 1, broke: false, freed: false, grounds: false };
  const part = parts[index];
  const toughness = strikeToughness(part, grab, gripToughness);
  const struck = strikeSuccesses({ ...part, toughness }, successes);
  const next = parts.map((p, i) => (i === index ? { ...struck.part, toughness: part.toughness } : { ...p }));
  const broke = part.state !== 'broken' && struck.part.state === 'broken';
  const wasGrounded = parts.some((p) => p.kind === 'leg' && p.state === 'broken');
  return {
    parts: next,
    openings: struck.openings,
    hurt: successes >= 1,
    broke,
    freed: broke && !!grab && grab.arm === partId,
    grounds: broke && part.kind === 'leg' && !wasGrounded,
  };
}

export type DecoyId = 'flare' | 'riderless-horse' | 'thrown-cloak' | 'feint';

export interface DecoyContext extends StrikeContext {
  decoy: DecoyId;
  eyesBroken: boolean;
  cloakThrown: boolean;
  /** The soldier's own horse is not lame (and, unmounted, holds their Position; the table confirms that). */
  horseReady: boolean;
}

/** break_attention.requirements, with the named decoy's. */
export function breakAttentionBlock(x: DecoyContext): string | null {
  const c = common(x);
  if (c) return c;
  if (x.titan.decoy || x.titan.holder === 'decoy') return 'decoyHolds';
  const p = x.soldier.positions[x.titan.label];
  switch (x.decoy) {
    case 'flare':
      return x.eyesBroken ? 'eyesBroken' : null;
    case 'thrown-cloak':
      if (x.eyesBroken) return 'eyesBroken';
      if (x.cloakThrown) return 'cloakThrown';
      return CLOSE.includes(p) ? null : 'notClose';
    case 'riderless-horse':
      return x.horseReady ? null : 'noHorse';
    case 'feint': {
      if (p !== 'in-reach' && p !== 'on-body') return 'feintReach';
      const way = x.soldier.odmHad || (x.soldier.mounted && x.horseReady) || (!x.soldier.mounted && x.titan.grounded);
      return way ? null : 'feintWay';
    }
  }
}

export interface Needs {
  holder: number;
  anyone_else: number;
  titan_holds_a_grabbed_soldier: number;
  feint_extra: number;
  per_decoy_in_a_row: number;
}

/** break_attention.needs_rule. */
export function breakAttentionNeeds(titan: TitanRow, soldier: string, decoy: DecoyId, needs: Needs): number {
  const base = titan.grab ? needs.titan_holds_a_grabbed_soldier : titan.holder === soldier ? needs.holder : needs.anyone_else;
  return base + (decoy === 'feint' ? needs.feint_extra : 0) + titan.decoysInRow * needs.per_decoy_in_a_row;
}

export interface BreakResult {
  success: boolean;
  /** Openings created by the soldier (each success beyond the need). */
  openings: number;
  /** Cards the decoy's hold lasts: the Titan's Tempo. */
  hold: number;
  freed: boolean;
}

/** break_attention.on_success. */
export function breakAttentionResult(successes: number, need: number, titan: TitanRow): BreakResult {
  if (successes < need) return { success: false, openings: 0, hold: 0, freed: false };
  return { success: true, openings: successes - need, hold: Math.max(1, titan.tempo), freed: !!titan.grab };
}

/** The Grabbed soldier's Break Free: only when Grabbed and not Down. */
export function breakFreeBlock(soldier: SoldierState, grab: GrabState | null): string | null {
  if (!grab || grab.soldier !== soldier.id) return 'notGrabbed';
  if (soldier.down) return 'down';
  return null;
}
