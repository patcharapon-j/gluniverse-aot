/**
 * A Skirmish's own rules (data/skirmish/skirmish.yaml; data/skirmish/foes.yaml): the foe rule, the
 * attack and its cancelling roll, damage, Grit, Parley, and the ending. Pure and unit tested.
 */
import type { SoldierState } from './types.ts';

export interface FoeState {
  /** The Foe's token id. */
  id: string;
  /** Its label, 1 upward. */
  label: number;
  health: number;
  lost: number;
  out: boolean;
  /** Held by a soldier (the soldier's id), or null. */
  heldBy: string | null;
  fightWeapon: string;
  shootWeapon: string | null;
  loaded: boolean;
}

export interface FoeTurnInput {
  foe: FoeState;
  soldiers: readonly SoldierState[];
  /** Is this soldier Engaged with this Foe? */
  engaged: (soldier: string) => boolean;
  /** The candidate who most recently made a Fight or Shoot roll against this Foe (rules question 13). */
  lastAttacker: string | null;
  cardOf: (soldier: string) => number | null;
  broken: boolean;
}

export type FoeStep = 'held' | 'engaged' | 'loaded' | 'empty' | 'close-in' | 'none' | 'out';

export interface FoeTurn {
  step: FoeStep;
  target: string | null;
  weapon: string | null;
  /** The Foe becomes Engaged with the target first (close-in). */
  closes: boolean;
}

/** foe_rule.candidates: every soldier taking part who is alive and not Down. */
export const foeCandidates = (soldiers: readonly SoldierState[]) => soldiers.filter((s) => s.alive && !s.down && !s.left);

function lowest(ids: readonly string[], cardOf: (id: string) => number | null): string | null {
  const withCard = ids.map((id) => ({ id, card: cardOf(id) ?? Infinity })).sort((a, b) => a.card - b.card);
  return withCard[0]?.id ?? null;
}

/** foe_rule.steps, first match. */
export function foeTurn(x: FoeTurnInput): FoeTurn {
  const none = (step: FoeStep): FoeTurn => ({ step, target: null, weapon: null, closes: false });
  if (x.foe.out || x.broken) return none('out');
  const cands = foeCandidates(x.soldiers).map((s) => s.id);
  const last = x.lastAttacker && cands.includes(x.lastAttacker) ? x.lastAttacker : null;
  if (x.foe.heldBy) return { step: 'held', target: x.foe.heldBy, weapon: 'bare-hands', closes: false };
  const engaged = cands.filter((id) => x.engaged(id));
  if (engaged.length) {
    const target = last && engaged.includes(last) ? last : lowest(engaged, x.cardOf);
    return { step: 'engaged', target, weapon: x.foe.fightWeapon, closes: false };
  }
  if (x.foe.shootWeapon && x.foe.loaded && cands.length) {
    return { step: 'loaded', target: last ?? lowest(cands, x.cardOf), weapon: x.foe.shootWeapon, closes: false };
  }
  if (x.foe.shootWeapon && !x.foe.loaded) return { step: 'empty', target: null, weapon: x.foe.shootWeapon, closes: false };
  if (cands.length) return { step: 'close-in', target: lowest(cands, x.cardOf), weapon: x.foe.fightWeapon, closes: true };
  return none('none');
}

/** The Attack Dice a Foe rolls: its own, plus the ambush dice against a soldier who has not acted (ambush, dice). */
export function foeAttackDice(attackDice: number, foesHaveAmbush: boolean, targetActed: boolean, ambushDice: number): number {
  return attackDice + (foesHaveAmbush && !targetActed ? ambushDice : 0);
}

/** Whether a cancelling roll may answer (ambush, no-cancelling-roll): not against the side with the Ambush on a target that has not acted. */
export const cancelAllowed = (attackerHasAmbush: boolean, targetActed: boolean) => !(attackerHasAmbush && !targetActed);

/** Which Reactions answer a Foe's attack made with this kind of weapon (reactions.entries). */
export function reactionsAgainst(usedWith: 'fight' | 'shoot', entries: readonly { entry: string; against: readonly string[] }[]): string[] {
  return entries.filter((e) => e.against.includes(usedWith)).map((e) => e.entry);
}

/** damage.amount: the weapon's damage, plus 1 for each Net Success beyond the first; nothing on 0 Net Successes. */
export function attackDamage(weaponDamage: number, net: number, perNetBeyond: number): number {
  if (net < 1) return 0;
  return weaponDamage + (net - 1) * perNetBeyond;
}

export const netSuccesses = (attack: number, cancel: number) => Math.max(0, attack - cancel);

export interface FoeHarm {
  lost: number;
  out: boolean;
  /** How it went out: killed (cut, pierce, burn) or out cold (crush). */
  killed: boolean;
}

/** damage.on_a_foe: Health never below 0; at 0 the Foe is out, killed or out cold by the Injury Type. */
export function harmFoe(foe: Pick<FoeState, 'health' | 'lost'>, damage: number, injuryType: string, killedBy: readonly string[]): FoeHarm {
  const lost = Math.min(foe.health, foe.lost + Math.max(0, damage));
  const out = lost >= foe.health;
  return { lost, out, killed: out && killedBy.includes(injuryType) };
}

/** grit.breaks_when: the Foes out of the Skirmish reach the group's Grit (raised by failed threats). */
export const groupBroken = (foes: readonly Pick<FoeState, 'out'>[], grit: number) => foes.filter((f) => f.out).length >= grit;

/** parley.needs: Parley value + 1, minus 1 per Foe out, never below 1, plus the ask's number. */
export function parleyNeeds(parley: number, outCount: number, askAdd: number): number {
  return Math.max(1, parley + 1 - outCount) + askAdd;
}

export interface SkirmishEnding {
  foesGone: boolean;
  noSoldierStanding: boolean;
  /** The players may declare that the Squad leaves (at the end of a round). */
  squadMayLeave: boolean;
}

/** ending.tests. */
export function skirmishEnding(foes: readonly FoeState[], soldiers: readonly SoldierState[], engagedAny: (id: string) => boolean, holdsOrHeld: (id: string) => boolean): SkirmishEnding {
  const part = soldiers.filter((s) => s.alive || s.down);
  const standing = soldiers.filter((s) => s.alive && !s.down);
  return {
    foesGone: foes.every((f) => f.out),
    noSoldierStanding: standing.length === 0,
    squadMayLeave: standing.every((s) => !engagedAny(s.id) && !holdsOrHeld(s.id)) && part.filter((s) => s.down && s.alive).every((s) => !!s.carriedBy),
  };
}

/** The Bandit's Fight weapon, rolled on a D6 as the Skirmish begins, with the night swap. */
export function rollFightWeapon(rows: readonly { results: number[]; weapon: string }[], d6: number, night: { replaces: string; with: string } | null, isNight: boolean): string {
  const w = rows.find((r) => r.results.includes(d6))?.weapon ?? rows[0]?.weapon ?? 'bare-hands';
  return isNight && night && w === night.replaces ? night.with : w;
}
