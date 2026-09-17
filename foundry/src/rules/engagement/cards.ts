/**
 * Initiative cards (data/engagement/round.yaml: initiative_cards, round_steps deal and play,
 * swapping, wings; data/skirmish/skirmish.yaml: rounds, ambush). Pure and unit tested.
 */
import type { Slot, SoldierState, TitanRow } from './types.ts';

/** A holder and how many cards it is dealt. */
export interface Holder {
  id: string;
  kind: 'soldier' | 'titan' | 'foe-group';
  count: number;
}

export type Rng = () => number;

/**
 * Who is dealt cards this round (round_steps, deal): each living player character, each living
 * Squadmate not on a Wing, and Tempo cards to each living Focus Titan. Down, Grabbed, carried, and
 * departed soldiers are still dealt; the dead and corpses are not.
 */
export function titanHolders(soldiers: readonly SoldierState[], titans: readonly TitanRow[], wings: Record<string, string>): Holder[] {
  const out: Holder[] = [];
  for (const s of soldiers) {
    if (!s.alive) continue;
    if (!s.pc && wings[s.id] && soldiers.some((p) => p.id === wings[s.id] && p.alive)) continue;
    out.push({ id: s.id, kind: 'soldier', count: 1 });
  }
  for (const t of titans) if (t.status === 'focus') out.push({ id: t.key, kind: 'titan', count: Math.max(1, t.tempo) });
  return out;
}

/**
 * A Skirmish deal (skirmish.yaml, rounds): one card to each living soldier taking part, Down or
 * not, Squadmates on their own cards (no Wings), and one to the Foe group while any Foe is in.
 */
export function skirmishHolders(soldiers: readonly SoldierState[], foesIn: number, groupId = 'foes'): Holder[] {
  const out: Holder[] = soldiers.filter((s) => s.alive).map((s) => ({ id: s.id, kind: 'soldier' as const, count: 1 }));
  if (foesIn > 0) out.push({ id: groupId, kind: 'foe-group', count: 1 });
  return out;
}

/** Why these holders cannot be dealt from the set, or null. */
export function dealBlock(holders: readonly Holder[], set = 20): string | null {
  const need = holders.reduce((n, h) => n + h.count, 0);
  if (need > set) return `too-many:${need}`;
  if (need === 0) return 'nobody';
  return null;
}

/**
 * Shuffles the cards 1 to `set` and deals each holder its count, face up: no two cards share a
 * number (initiative_cards, never_tied). A holder's cards are listed lowest first.
 */
export function dealCards(holders: readonly Holder[], rng: Rng, set = 20): Record<string, number[]> {
  const block = dealBlock(holders, set);
  if (block) throw new Error(`cannot deal: ${block}`);
  const deck = Array.from({ length: set }, (_, i) => i + 1);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const out: Record<string, number[]> = {};
  let k = 0;
  for (const h of holders) {
    out[h.id] = deck.slice(k, k + h.count).sort((a, b) => a - b);
    k += h.count;
  }
  return out;
}

export interface OrderInput {
  /** Each soldier's card (null when dealt none). */
  soldiers: Record<string, number | null>;
  /** Each Focus Titan's cards. */
  titans: Record<string, number[]>;
  /** Squadmate id to player character id. */
  wings: Record<string, string>;
  foeGroup?: { id: string; card: number | null } | null;
  /** Skirmish round 1: the side whose cards all come up first. */
  ambush?: 'squad' | 'foes' | null;
}

/**
 * The order cards come up (round_steps, play): ascending, a Wing Squadmate right after its player
 * character's card wherever that card went. With the Ambush in a Skirmish's first round, the side
 * that has it goes first, each side keeping its order (skirmish.yaml, ambush, order).
 */
export function turnOrder(input: OrderInput): Slot[] {
  const slots: Slot[] = [];
  for (const [id, card] of Object.entries(input.soldiers)) if (card !== null && card !== undefined) slots.push({ kind: 'soldier', id, card });
  for (const [id, cards] of Object.entries(input.titans)) cards.forEach((card, index) => slots.push({ kind: 'titan', id, card, index }));
  if (input.foeGroup && input.foeGroup.card !== null) slots.push({ kind: 'foe-group', id: input.foeGroup.id, card: input.foeGroup.card });
  const side = (s: Slot) => (s.kind === 'foe-group' ? 'foes' : s.kind === 'titan' ? 'titan' : 'squad');
  slots.sort((a, b) => {
    if (input.ambush) {
      const fa = side(a) === input.ambush ? 0 : 1;
      const fb = side(b) === input.ambush ? 0 : 1;
      if (fa !== fb) return fa - fb;
    }
    return a.card! - b.card!;
  });
  const out: Slot[] = [];
  for (const s of slots) {
    out.push(s);
    if (s.kind !== 'soldier') continue;
    for (const [mate, pc] of Object.entries(input.wings)) {
      if (pc === s.id && (input.soldiers[mate] === null || input.soldiers[mate] === undefined)) out.push({ kind: 'wing', id: mate, card: null, of: s.id });
    }
  }
  return out;
}

/**
 * The card a soldier counts with for the Attention tie-break (attention.yaml, evaluation, card): a
 * Wing Squadmate counts as its player character's card and comes after them.
 */
export function tieCard(id: string, soldiers: Record<string, number | null>, wings: Record<string, string>): number | null {
  const own = soldiers[id];
  if (own !== null && own !== undefined) return own;
  const pc = wings[id];
  const theirs = pc ? soldiers[pc] : null;
  return theirs === null || theirs === undefined ? null : theirs + 0.5;
}

export interface SwapInput {
  step: string;
  a: SoldierState;
  b: SoldierState;
  cards: Record<string, number | null>;
  /** Soldiers who took part in a swap this round. */
  swapped: readonly string[];
  wings: Record<string, string>;
  grabbed: (id: string) => boolean;
  /** Same Position or one step apart, compared as positions.yaml (comparison) states. */
  near: (a: SoldierState, b: SoldierState) => boolean;
}

/**
 * Why two soldiers may not swap cards (round.yaml, swapping), or null. Reasons are keys the views
 * translate (`WOF.Tracker.swap.<key>`), with the soldier's name.
 */
export function swapBlock(x: SwapInput): { key: string; who?: string } | null {
  if (x.step !== 'swap') return { key: 'notStep' };
  if (x.a.id === x.b.id) return { key: 'same' };
  for (const s of [x.a, x.b]) {
    if (!s.alive) return { key: 'dead', who: s.name };
    const card = x.cards[s.id];
    if (card === null || card === undefined) return { key: x.wings[s.id] ? 'wing' : 'noCard', who: s.name };
    if (s.down) return { key: 'down', who: s.name };
    if (x.grabbed(s.id)) return { key: 'grabbed', who: s.name };
    if (x.swapped.includes(s.id)) return { key: 'already', who: s.name };
  }
  if (x.a.left && x.b.left) return null;
  if (x.a.left !== x.b.left) return { key: 'oneLeft' };
  if (!x.near(x.a, x.b)) return { key: 'far' };
  return null;
}

/** The two cards exchanged. */
export function swapCards(cards: Record<string, number | null>, a: string, b: string): Record<string, number | null> {
  return { ...cards, [a]: cards[b], [b]: cards[a] };
}
