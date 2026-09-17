import { describe, expect, it } from 'vitest';
import { chooseEntry, drawAttentionBlock, enteringAttention, entryTargets, evaluateLadder, type LadderInput } from '../src/rules/engagement/attention.ts';
import { dealBlock, dealCards, skirmishHolders, swapBlock, swapCards, tieCard, titanHolders, turnOrder, type SwapInput } from '../src/rules/engagement/cards.ts';
import { breakFreeNeeds, countTurn, grabLands, holdingArm, holdingArmReach, release } from '../src/rules/engagement/grab.ts';
import { checkTrackerRequest, coreOf, fallBackBlock, type TrackerWorld } from '../src/rules/engagement/guard.ts';
import { gainInjury } from '../src/rules/engagement/injury.ts';
import {
  comparisonLabel,
  corpsePosition,
  entering,
  leaveBlock,
  letGoBlock,
  moveOptions,
  nearEachOther,
  nextLabel,
  returnBlock,
  stepRows,
  stepsApart,
  type MoveContext,
  withPosition,
} from '../src/rules/engagement/positions.ts';
import {
  autoChecks,
  checksOf,
  endComplete,
  gasRollsDue,
  nextCheck,
  noteWingEvent,
  planBackground,
  planRegeneration,
  planRetreat,
  revertValue,
  roundBlock,
  roundNext,
  stayLimitLeft,
  TRACKER_CATEGORIES,
  undoOrder,
  wingBlock,
  wingsEditable,
  type EndEntry,
  type RoundCore,
  type TrackerCategory,
} from '../src/rules/engagement/round.ts';
import { attackDamage, cancelAllowed, foeAttackDice, foeTurn, groupBroken, harmFoe, netSuccesses, parleyNeeds, reactionsAgainst, rollFightWeapon, skirmishEnding, type FoeState } from '../src/rules/engagement/skirmish.ts';
import {
  bodyPartStrikeBlock,
  bodyPartStrikeResult,
  breakAttentionBlock,
  breakAttentionNeeds,
  breakAttentionResult,
  breakFreeBlock,
  napeBonus,
  napeStrikeBlock,
  napeStrikeResult,
  spendableOpenings,
  spendOpenings,
  type PartContext,
} from '../src/rules/engagement/strikes.ts';
import { planTitanDeath, type DeathCard } from '../src/rules/engagement/titan-death.ts';
import { emptyFlags, type AnchorRating, type Position, type Snapshot, type SoldierState, type TitanRow } from '../src/rules/engagement/types.ts';
import type { BodyPart } from '../src/rules/titan.ts';
import { engagementConfig } from '../tools/config-data.ts';
import { loadTables } from '../tools/data/load.ts';

const tables = loadTables();
const E = engagementConfig(tables);
const rating = (id: string) => E.ratings.find((r) => r.id === id)! as AnchorRating;
const wooded = rating('wooded');
const medium = tables.titans.find((t) => t.id === 'standard-medium')!;
const sprinter = tables.titans.find((t) => t.id === 'sprinting-abnormal')!;
const ladder = (id: string) => (id === 'standard' ? tables.attention.ladders[0].rungs : tables.titanIndex.ladders.find((l) => l.id === id)!.rungs);

/** A seeded generator, so a failing deal can be replayed. */
function seeded(seed: number) {
  let x = seed >>> 0;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 2 ** 32;
  };
}

function soldier(id: string, extra: Partial<SoldierState> = {}): SoldierState {
  return { id, name: id, pc: true, alive: true, down: false, left: false, carriedBy: null, carrying: null, pinned: null, mounted: false, airborne: false, odmHad: true, positions: { A: 'distant' }, momentum: 0, untreated: 0, ...extra };
}

function titan(label: string, extra: Partial<TitanRow> = {}): TitanRow {
  return { key: `t${label}`, label, status: 'focus', tempo: 1, ladder: [...ladder('standard')], holder: '', grab: null, decoy: null, decoysInRow: 0, flags: emptyFlags(), grounded: false, entered: 1, ...extra };
}

const partsOf = (states: Partial<Record<string, BodyPart['state']>> = {}): BodyPart[] => medium.body_parts.map((b) => ({ ...b, state: states[b.id] ?? 'intact', progress: 0 }));

// ------------------------------------------------------------------ cards

describe('the deal (round.yaml, deal)', () => {
  const pcs = [soldier('p1'), soldier('p2'), soldier('p3', { down: true }), soldier('p4', { left: true })];
  const mates = [soldier('m1', { pc: false }), soldier('m2', { pc: false })];
  const dead = soldier('p5', { alive: false });
  const titans = [titan('A'), titan('B', { tempo: sprinter.tempo }), titan('C', { status: 'corpse' })];

  it('deals every living player character and un-Winged Squadmate, Tempo cards per living Focus Titan', () => {
    const holders = titanHolders([...pcs, ...mates, dead], titans, { m1: 'p1' });
    expect(holders.map((h) => `${h.id}:${h.count}`)).toEqual(['p1:1', 'p2:1', 'p3:1', 'p4:1', 'm2:1', 'tA:1', 'tB:2']);
  });

  it('deals a Wing Squadmate its own card when its player character is dead', () => {
    const holders = titanHolders([soldier('p1', { alive: false }), soldier('m1', { pc: false })], [], { m1: 'p1' });
    expect(holders.map((h) => h.id)).toEqual(['m1']);
  });

  it('never ties: unique cards from 1 to 20 over many shuffles, each Titan listed lowest first', () => {
    const holders = titanHolders([...pcs, ...mates], titans, {});
    for (let seed = 1; seed <= 300; seed++) {
      const dealt = dealCards(holders, seeded(seed));
      const all = Object.values(dealt).flat();
      expect(new Set(all).size).toBe(all.length);
      expect(all.every((c) => Number.isInteger(c) && c >= 1 && c <= E.cards)).toBe(true);
      expect(dealt.tB).toEqual([...dealt.tB].sort((a, b) => a - b));
      expect(dealt.tB).toHaveLength(2);
    }
  });

  it('refuses more than twenty cards (rules question 11)', () => {
    const many = Array.from({ length: 19 }, (_, i) => soldier(`s${i}`));
    const holders = titanHolders(many, [titan('A', { tempo: 2 })], {});
    expect(dealBlock(holders)).toBe('too-many:21');
    expect(() => dealCards(holders, seeded(1))).toThrow();
  });

  it('deals a Skirmish one card per living soldier, Down included, and one to the Foe group while a Foe is in', () => {
    expect(skirmishHolders([soldier('a'), soldier('b', { down: true }), soldier('c', { alive: false })], 2).map((h) => h.id)).toEqual(['a', 'b', 'foes']);
    expect(skirmishHolders([soldier('a')], 0).map((h) => h.id)).toEqual(['a']);
  });
});

describe('turn order (round.yaml, play)', () => {
  it('comes up lowest first, a Wing right after its player character, Titan cards interleaved', () => {
    const order = turnOrder({ soldiers: { petra: 4, jonas: 14, rhea: null, oskar: 17 }, titans: { A: [9], B: [2, 13] }, wings: { rhea: 'petra' } });
    expect(order.map((s) => `${s.kind}:${s.id}:${s.card}`)).toEqual(['titan:B:2', 'soldier:petra:4', 'wing:rhea:null', 'titan:A:9', 'titan:B:13', 'soldier:jonas:14', 'soldier:oskar:17']);
  });

  it('keeps the Wing after its player character when their card was swapped', () => {
    const cards = swapCards({ petra: 14, jonas: 4, rhea: null }, 'petra', 'jonas');
    const order = turnOrder({ soldiers: cards, titans: {}, wings: { rhea: 'petra' } });
    expect(cards).toMatchObject({ petra: 4, jonas: 14 });
    expect(order.map((s) => s.id)).toEqual(['petra', 'rhea', 'jonas']);
  });

  it('puts the side with the Ambush first in a Skirmish, each side keeping its order', () => {
    const order = turnOrder({ soldiers: { a: 3, b: 8 }, titans: {}, wings: {}, foeGroup: { id: 'foes', card: 5 }, ambush: 'foes' });
    expect(order.map((s) => s.id)).toEqual(['foes', 'a', 'b']);
    const squad = turnOrder({ soldiers: { a: 9, b: 8 }, titans: {}, wings: {}, foeGroup: { id: 'foes', card: 1 }, ambush: 'squad' });
    expect(squad.map((s) => s.id)).toEqual(['b', 'a', 'foes']);
  });

  it('counts a Wing Squadmate as its player character’s card, after them, for a tie', () => {
    expect(tieCard('rhea', { petra: 4, rhea: null }, { rhea: 'petra' })).toBe(4.5);
    expect(tieCard('tomas', { tomas: 6 }, {})).toBe(6);
    expect(tieCard('x', {}, {})).toBeNull();
  });
});

describe('swaps (round.yaml, swapping)', () => {
  const base = (a: Partial<SoldierState>, b: Partial<SoldierState>, extra: Partial<SwapInput> = {}): SwapInput => {
    const sa = soldier('a', a);
    const sb = soldier('b', b);
    return {
      step: 'swap',
      a: sa,
      b: sb,
      cards: { a: 3, b: 12 },
      swapped: [],
      wings: {},
      grabbed: () => false,
      near: (x, y) => nearEachOther(x, y, 'A', wooded, [titan('A')]),
      ...extra,
    };
  };

  it('allows the same Position, one step apart, and two departed soldiers', () => {
    expect(swapBlock(base({}, {}))).toBeNull();
    expect(swapBlock(base({ positions: { A: 'in-reach' } }, { positions: { A: 'blind-spot' } }))).toBeNull();
    expect(swapBlock(base({ left: true, positions: {} }, { left: true, positions: {} }))).toBeNull();
  });

  it('refuses outside the swap step, Down, Grabbed, a second swap, a Wing, a card-less soldier, and distance', () => {
    expect(swapBlock(base({}, {}, { step: 'play' }))?.key).toBe('notStep');
    expect(swapBlock(base({ down: true }, {}))?.key).toBe('down');
    expect(swapBlock(base({}, {}, { grabbed: (id) => id === 'b' }))).toEqual({ key: 'grabbed', who: 'b' });
    expect(swapBlock(base({}, {}, { swapped: ['a'] }))?.key).toBe('already');
    expect(swapBlock(base({}, {}, { cards: { a: 3, b: null }, wings: { b: 'x' } }))?.key).toBe('wing');
    expect(swapBlock(base({}, {}, { cards: { a: 3 } }))?.key).toBe('noCard');
    expect(swapBlock(base({ positions: { A: 'distant' } }, { positions: { A: 'on-body' } }))?.key).toBe('far');
    expect(swapBlock(base({ left: true, positions: {} }, {}))?.key).toBe('oneLeft');
    expect(swapBlock(base({ alive: false }, {}))?.key).toBe('dead');
  });

  it('measures distance under the Anchor Rating: Open has no blind-spot step', () => {
    const open = rating('open');
    const x = soldier('a', { positions: { A: 'in-reach' } });
    const y = soldier('b', { positions: { A: 'blind-spot' } });
    expect(nearEachOther(x, y, 'A', open, [titan('A')])).toBe(false);
    expect(nearEachOther(x, y, 'A', wooded, [titan('A')])).toBe(true);
  });
});

// ------------------------------------------------------------------ positions

describe('Positions and moves (positions.yaml, anchor-ratings.yaml)', () => {
  const ctx = (t: TitanRow = titan('A'), r: AnchorRating = wooded, momentum = 0): MoveContext => ({ rating: r, titan: t, grabbed: false, retreat: false, momentum });
  const opts = (s: SoldierState, c = ctx()) => Object.fromEntries(moveOptions(s, c).map((o) => [o.to, o]));

  it('makes one step the rating allows, by the kinds its row names', () => {
    const o = opts(soldier('a'));
    expect(o['in-reach'].ways.map((w) => w.kind)).toEqual(['onFoot', 'odm']);
    expect(o['on-body'].block).toBe('notOneStep');
    const near = opts(soldier('a', { positions: { A: 'in-reach' } }));
    expect(near['blind-spot'].ways.map((w) => w.kind)).toEqual(['odm']);
  });

  it('has no Fly-roll step left: Urban no longer joins Distant to Blind Spot, and Carry crosses it (anchor-ratings.yaml, history)', () => {
    const urban = rating('urban');
    expect(urban.steps.some((r) => r.a === 'distant' && r.b === 'blind-spot')).toBe(false);
    expect(rating('sparse').steps.some((r) => (r.a === 'in-reach' && r.b === 'blind-spot') || (r.a === 'blind-spot' && r.b === 'in-reach'))).toBe(false);
    expect(rating('giant-forest').steps.some((r) => r.a === 'distant' && r.b === 'blind-spot')).toBe(false);
    const o = opts(soldier('a'), ctx(titan('A'), urban));
    expect(o['blind-spot'].block).toBe('notOneStep');
    const carried = opts(soldier('a', { momentum: 1 }), ctx(titan('A'), urban, 1));
    expect(carried['blind-spot'].ways).toEqual([{ kind: 'odm', steps: 2, carry: 1, charge: false }]);
    expect(o['in-reach'].ways.map((w) => w.kind)).toEqual(['onFoot', 'odm']);
  });

  it('keeps a mounted soldier to mounted steps and ODM moves, and needs ODM Gear for ODM moves', () => {
    const mounted = opts(soldier('a', { mounted: true }), ctx(titan('A'), rating('urban')));
    expect(mounted['in-reach'].ways.map((w) => w.kind)).toEqual(['odm']);
    const dry = opts(soldier('a', { odmHad: false, positions: { A: 'in-reach' } }));
    expect(dry['on-body'].block).toBe('noOdm');
    expect(dry.distant.ways.map((w) => w.kind)).toEqual(['onFoot']);
  });

  it('lets a grounded Titan be climbed on foot, and adds the Open rating’s blind-spot step; a corpse is always grounded', () => {
    const up = opts(soldier('a', { odmHad: false, positions: { A: 'in-reach' } }), ctx(titan('A', { grounded: true })));
    expect(up['on-body'].ways.map((w) => w.kind)).toEqual(['onFoot']);
    const geared = opts(soldier('a', { positions: { A: 'in-reach' } }), ctx(titan('A', { grounded: true })));
    expect(geared['on-body'].ways.map((w) => w.kind)).toEqual(['onFoot', 'odm']);
    const open = stepRows(rating('open'), true);
    expect(stepsApart(open, 'on-body', 'blind-spot')).toBe(1);
    expect(stepsApart(stepRows(rating('open'), false), 'on-body', 'blind-spot')).toBe(Infinity);
    const corpse = opts(soldier('a', { odmHad: false, positions: { A: 'in-reach' } }), ctx(titan('A', { status: 'corpse' })));
    expect(corpse['on-body'].block).toBeNull();
  });

  it('lets a Down soldier step only from in-reach to Distant on foot; a Grabbed, Pinned, or carried soldier changes nothing', () => {
    const down = opts(soldier('a', { down: true, positions: { A: 'in-reach' } }));
    expect(down.distant.ways.map((w) => w.kind)).toEqual(['onFoot']);
    expect(down['on-body'].block).toBe('down');
    expect(opts(soldier('a'), { ...ctx(), grabbed: true })['in-reach'].block).toBe('grabbed');
    expect(opts(soldier('a', { pinned: { body: 'A', bodyPin: false } }))['in-reach'].block).toBe('pinned');
    expect(opts(soldier('a', { carriedBy: 'b' }))['in-reach'].block).toBe('carried');
    expect(opts(soldier('a', { left: true }))['in-reach'].block).toBe('left');
  });

  it('applies the close rule: on-body or blind-spot toward one Focus Titan turns the other’s into in-reach', () => {
    expect(withPosition({ A: 'on-body', B: 'distant' }, 'B', 'blind-spot', ['A', 'B'])).toEqual({ A: 'in-reach', B: 'blind-spot' });
    expect(withPosition({ A: 'distant', B: 'on-body' }, 'A', 'in-reach', ['A', 'B'])).toEqual({ A: 'in-reach', B: 'on-body' });
    // A corpse's Position is never read by the close rule.
    expect(withPosition({ A: 'on-body', B: 'distant' }, 'B', 'on-body', ['B'])).toEqual({ A: 'on-body', B: 'on-body' });
  });

  it('places everyone who holds a Position at Distant toward a Titan that enters, and reads on-body as in-reach toward a corpse', () => {
    expect(entering(soldier('a', { positions: { A: 'on-body' } }), 'B', true)).toEqual({ A: 'on-body', B: 'distant' });
    expect(entering(soldier('a', { left: true, positions: {} }), 'B', false)).toEqual({});
    expect([corpsePosition('on-body'), corpsePosition('blind-spot'), corpsePosition('distant'), corpsePosition(undefined)]).toEqual(['in-reach', 'in-reach', 'distant', undefined]);
  });

  it('compares against the earliest living Focus Titan, else the last corpse', () => {
    expect(comparisonLabel([titan('B'), titan('A')])).toBe('A');
    expect(comparisonLabel([titan('A', { status: 'corpse' }), titan('B')])).toBe('B');
    expect(comparisonLabel([titan('A', { status: 'corpse' }), titan('B', { status: 'corpse' })])).toBe('B');
    expect(comparisonLabel([])).toBeNull();
  });

  it('leaves only from Distant toward every body, and returns never during a retreat', () => {
    const ts = [titan('A'), titan('B', { status: 'corpse' })];
    expect(leaveBlock(soldier('a', { positions: { A: 'distant', B: 'distant' } }), ts, false)).toBeNull();
    expect(leaveBlock(soldier('a', { positions: { A: 'distant', B: 'in-reach' } }), ts, false)).toBe('notDistant');
    expect(leaveBlock(soldier('a', { down: true }), ts, false)).toBe('down');
    expect(returnBlock(soldier('a', { left: true }), true)).toBe('retreat');
    expect(returnBlock(soldier('a', { left: true }), false)).toBeNull();
    expect(letGoBlock(soldier('a', { positions: { A: 'on-body' } }), 'A', false)).toBeNull();
    expect(letGoBlock(soldier('a', { positions: { A: 'in-reach' } }), 'A', false)).toBe('notClose');
    expect(nextLabel(['A', 'B'])).toBe('C');
  });
});

// ------------------------------------------------------------------ Attention

describe('Attention (attention.yaml, evaluation)', () => {
  const input = (t: TitanRow, soldiers: SoldierState[], cards: Record<string, number | null> = {}, useCards = true, wings: Record<string, string> = {}): LadderInput => ({
    titan: t,
    soldiers,
    grabbedBy: () => null,
    downCanMeet: E.downCanMeet,
    cardOf: (id) => tieCard(id, cards, wings),
    useCards,
  });

  it('holds nothing at the start: everyone at Distant, no cards', () => {
    const r = evaluateLadder(input(titan('A'), [soldier('a'), soldier('b')], {}, false));
    expect(r).toMatchObject({ holder: null, rung: 'nearest', by: 'tie' });
  });

  it('takes the highest rung met and narrows by the lower rungs', () => {
    const t = titan('A', { flags: { hooked: [], hurt: ['c'], loud: [] } });
    const r = evaluateLadder(input(t, [soldier('a', { positions: { A: 'in-reach' } }), soldier('b', { positions: { A: 'in-reach' } }), soldier('c', { positions: { A: 'in-reach' } })]));
    expect(r).toMatchObject({ holder: 'c', rung: 'nearest-person-in-reach', by: 'one' });
  });

  it('puts a Nape striker who fell short before a soldier On Body (struck-first)', () => {
    const t = titan('A', { flags: { hooked: ['s'], hurt: [], loud: [] } });
    const r = evaluateLadder(input(t, [soldier('o', { positions: { A: 'on-body' } }), soldier('s', { positions: { A: 'blind-spot' } })]));
    expect(r.holder).toBe('s');
  });

  it('lets a Down soldier meet only nearest', () => {
    const t = titan('A');
    const r = evaluateLadder(input(t, [soldier('d', { down: true, positions: { A: 'on-body' } }), soldier('x', { positions: { A: 'distant' } })]));
    expect(r).toMatchObject({ holder: 'd', rung: 'nearest' });
  });

  it('works out an entering Titan’s Attention at once, with cards only mid-round (background-titans.yaml, full_clock)', () => {
    const field = (extra: Partial<Snapshot>): Snapshot => ({
      combat: 'C', mode: 'titan', step: 'play', round: 2, anchor: wooded, titans: [titan('A')], wings: {}, cards: { a: 3, b: 9, c: 1 }, titanCards: {}, swapped: [], proposal: null,
      retreat: false, wingsSet: true, wingsOpen: false, reassign: [], tactics: { held: [], used: [] }, cloaks: [],
      anchors: 2, wrecks: 0, odmUsed: [], movesSpent: [],
      soldiers: [soldier('a', { positions: { A: 'blind-spot' } }), soldier('b', { positions: { A: 'in-reach' } }), soldier('c', { left: true, positions: {} })],
      ...extra,
    });
    const entering = titan('B');
    // Everyone holding a Position is Distant from it: a tie that this round's cards break mid-round.
    expect(enteringAttention(field({}), entering, E.downCanMeet)).toMatchObject({ holder: 'a', rung: 'nearest', by: 'card' });
    // At the background-clocks end step no card chooses.
    expect(enteringAttention(field({ step: 'end' }), entering, E.downCanMeet).holder).toBeNull();
    // A soldier Grabbed by the other Titan is no candidate; the one left holds it.
    const grabbed = field({ step: 'end', titans: [titan('A', { grab: { soldier: 'a', counted: 0, lifted: false, arm: 'left-arm' } })] });
    expect(enteringAttention(grabbed, entering, E.downCanMeet)).toMatchObject({ holder: 'b', by: 'one' });
  });

  it('keeps the holder in a tie, then takes the lowest card with a Wing after its player character', () => {
    const both = [soldier('a', { positions: { A: 'in-reach' } }), soldier('b', { positions: { A: 'in-reach' } })];
    expect(evaluateLadder(input(titan('A', { holder: 'b' }), both, { a: 3, b: 9 })).holder).toBe('b');
    expect(evaluateLadder(input(titan('A'), both, { a: 3, b: 9 })).holder).toBe('a');
    const wing = [soldier('p', { positions: { A: 'in-reach' } }), soldier('w', { pc: false, positions: { A: 'in-reach' } }), soldier('q', { positions: { A: 'in-reach' } })];
    expect(evaluateLadder(input(titan('A'), wing, { p: 12, w: null, q: 13 }, true, { w: 'p' })).holder).toBe('p');
    expect(evaluateLadder(input(titan('A'), wing.slice(1), { p: 12, w: null, q: 13 }, true, { w: 'p' })).holder).toBe('w');
    expect(evaluateLadder(input(titan('A'), both, { a: 3, b: 9 }, false)).holder).toBeNull();
  });

  it('leaves out departed soldiers and soldiers held by another Titan', () => {
    const t = titan('A');
    const inp = input(t, [soldier('g', { positions: { A: 'on-body' } }), soldier('l', { left: true, positions: {} }), soldier('x', { positions: { A: 'distant' } })]);
    inp.grabbedBy = (id) => (id === 'g' ? 'B' : null);
    expect(evaluateLadder(inp).holder).toBe('x');
    expect(evaluateLadder({ ...inp, soldiers: [soldier('l', { left: true, positions: {} })] })).toMatchObject({ holder: null, by: 'none' });
  });

  it('reads the Sprinting Abnormal’s ladder: loudest before its quarry, the quarry kept off Distant', () => {
    const t = titan('B', { ladder: [...ladder('sprinting-abnormal')], holder: 'q', flags: { hooked: [], hurt: [], loud: ['l'] } });
    const q = soldier('q', { positions: { B: 'in-reach' } });
    const l = soldier('l', { positions: { B: 'distant' } });
    expect(evaluateLadder(input(t, [q, l])).holder).toBe('l');
    const t2 = { ...t, flags: emptyFlags() };
    expect(evaluateLadder(input(t2, [q, soldier('n', { positions: { B: 'in-reach' } })])).holder).toBe('q');
    const far = { ...q, positions: { B: 'distant' as Position } };
    expect(evaluateLadder(input(t2, [far, soldier('n', { positions: { B: 'in-reach' } })])).holder).toBe('n');
  });

  it('chooses the entry: Body Parts, the holder’s Position, the fallback, Thrash', () => {
    const entries = sprinter.behavior_table.entries;
    const parts = sprinter.body_parts.map((b) => ({ ...b, state: 'intact' as const, progress: 0 }));
    expect(chooseEntry(entries, 'headlong-lunge', '', parts, 'in-reach').id).toBe('headlong-lunge');
    expect(chooseEntry(entries, 'headlong-lunge', '', parts, 'blind-spot').id).toBe('pitch-headlong');
    expect(chooseEntry(entries, 'headlong-lunge', 'pitch-headlong', parts, 'blind-spot').id).toBe('thrash');
    const lame = parts.map((p) => (p.id === 'left-leg' ? { ...p, state: 'broken' as const } : p));
    expect(chooseEntry(entries, 'run-past', '', lame, 'distant').id).toBe('thrash');
    expect(chooseEntry(entries, 'grab', '', parts, 'distant').id).toBe('thrash');
    expect(chooseEntry(medium.behavior_table.entries, 'nope', '', partsOf(), 'distant').tier).toBe('thrash');
  });

  it('targets the holder, or everyone at the holder’s Position who is not Grabbed', () => {
    const t = titan('A');
    const s = [soldier('h', { positions: { A: 'in-reach' } }), soldier('x', { positions: { A: 'in-reach' } }), soldier('g', { positions: { A: 'in-reach' } }), soldier('y', { positions: { A: 'distant' } })];
    expect(entryTargets({ targets: 'holder-and-position' }, 'h', t, s, (id) => id === 'g')).toEqual(['h', 'x']);
    expect(entryTargets({ targets: 'holder' }, 'h', t, s, () => false)).toEqual(['h']);
  });

  it('refuses Draw Attention from Distant or while Grabbed', () => {
    expect(drawAttentionBlock(soldier('a'), titan('A'), false)).toBe('distant');
    expect(drawAttentionBlock(soldier('a', { positions: { A: 'in-reach' } }), titan('A'), true)).toBe('grabbed');
    expect(drawAttentionBlock(soldier('a', { positions: { A: 'in-reach' } }), titan('A'), false)).toBeNull();
  });
});

// ------------------------------------------------------------------ the Grab

describe('the Grab (grab.yaml)', () => {
  it('holds with the first arm that is not Broken, clears its count, and places the target On Body with the close rule', () => {
    const parts = partsOf({ 'left-arm': 'broken' }).map((p) => (p.id === 'right-arm' ? { ...p, progress: 1 } : p));
    const t = soldier('o', { positions: { A: 'blind-spot', B: 'in-reach' }, airborne: true, mounted: true, carrying: 'x' });
    const land = grabLands(t, titan('B'), parts, ['A', 'B'])!;
    expect(holdingArm(parts)?.id).toBe('right-arm');
    expect(land.grab).toEqual({ soldier: 'o', counted: 0, lifted: false, arm: 'right-arm' });
    expect(land.positions).toEqual({ A: 'in-reach', B: 'on-body' });
    expect(land.parts.find((p) => p.id === 'right-arm')!.progress).toBe(0);
    expect(land).toMatchObject({ clearAirborne: true, dismount: true, stopCarrying: 'x', crushOnly: false });
  });

  it('lands only the crush on a Pinned target, and nothing without an arm', () => {
    expect(grabLands(soldier('p', { pinned: { body: 'A', bodyPin: false } }), titan('A'), partsOf(), ['A'])!.crushOnly).toBe(true);
    expect(grabLands(soldier('p'), titan('A'), partsOf({ 'left-arm': 'broken', 'right-arm': 'broken' }), ['A'])).toBeNull();
  });

  it('lifts after the first counted turn and devours after the second', () => {
    const g = { soldier: 'o', counted: 0, lifted: false, arm: 'left-arm' };
    const first = countTurn(g);
    expect(first).toEqual({ grab: { ...g, counted: 1, lifted: true }, event: 'lifted' });
    expect(countTurn(first.grab!)).toEqual({ grab: null, event: 'devoured' });
  });

  it('frees to in-reach, with a fall once lifted, and no Position when the Titan is dead', () => {
    const g = { soldier: 'o', counted: 1, lifted: true, arm: 'left-arm' };
    expect(release(g, true)).toEqual({ position: 'in-reach', falls: true });
    expect(release({ ...g, lifted: false }, false)).toEqual({ position: undefined, falls: false });
    expect(breakFreeNeeds(g, E.breakFree)).toEqual({ needs: 2, penalty: 2 });
    expect(breakFreeNeeds({ ...g, lifted: false }, E.breakFree)).toEqual({ needs: 2, penalty: 0 });
    expect(holdingArmReach(g, E.holdingArmReach, false)).toEqual(['on-body', 'blind-spot']);
    expect(holdingArmReach(g, E.holdingArmReach, true)).toEqual(['on-body', 'blind-spot', 'in-reach']);
    expect(breakFreeBlock(soldier('o'), g)).toBeNull();
    expect(breakFreeBlock(soldier('x'), g)).toBe('notGrabbed');
  });
});

// ------------------------------------------------------------------ strikes

describe('rolls against a Titan (titan-harm.yaml, attention.yaml)', () => {
  const at = (p: Position, extra: Partial<SoldierState> = {}) => soldier('s', { positions: { A: p }, ...extra });

  it('needs Blind Spot, no Attention, no Grab, no retreat, and working ODM Gear unless grounded for a Nape strike', () => {
    const t = titan('A');
    expect(napeStrikeBlock({ soldier: at('blind-spot'), titan: t, grabbed: false, retreat: false })).toBeNull();
    expect(napeStrikeBlock({ soldier: at('on-body'), titan: t, grabbed: false, retreat: false })).toBe('notBlindSpot');
    expect(napeStrikeBlock({ soldier: at('blind-spot'), titan: { ...t, holder: 's' }, grabbed: false, retreat: false })).toBe('holder');
    expect(napeStrikeBlock({ soldier: at('blind-spot'), titan: t, grabbed: true, retreat: false })).toBe('grabbed');
    expect(napeStrikeBlock({ soldier: at('blind-spot'), titan: t, grabbed: false, retreat: true })).toBe('retreat');
    expect(napeStrikeBlock({ soldier: at('blind-spot', { odmHad: false }), titan: t, grabbed: false, retreat: false })).toBe('noOdm');
    expect(napeStrikeBlock({ soldier: at('blind-spot', { odmHad: false }), titan: { ...t, grounded: true }, grabbed: false, retreat: false })).toBeNull();
    expect(napeStrikeBlock({ soldier: at('blind-spot'), titan: { ...t, status: 'corpse' }, grabbed: false, retreat: false })).toBe('corpse');
  });

  it('kills at the Nape Depth, or leaves an Opening a success (Relentless one more), and never spends the striker’s own', () => {
    expect(napeStrikeResult(4, 4, false)).toEqual({ kill: true, openings: 0, hooked: true });
    expect(napeStrikeResult(2, 4, true)).toEqual({ kill: false, openings: 3, hooked: true });
    expect(napeStrikeResult(0, 4, true).openings).toBe(0);
    expect(spendableOpenings(['s', 'x', 'y'], 's')).toBe(2);
    expect(spendOpenings(['s', 'x', 's', 'y'], 's', 1)).toEqual(['s', 's', 'y']);
    expect(napeBonus(3, true, E.bonus, 1, 4)).toEqual({ openings: 1, grounded: 2 });
    expect(napeBonus(2, false, E.bonus, 0, 4)).toEqual({ openings: 2, grounded: 0 });
  });

  it('checks a Body Part strike’s reach, the holding arm’s, and the ODM need', () => {
    const strikeFrom = Object.fromEntries(E.ratings.length ? tables.titanHarm.body_part_kinds.map((k) => [k.id, k.strike_from]) : []);
    const ctx = (p: Position, partId: string, extra: Partial<PartContext> = {}): PartContext => ({ soldier: at(p), titan: titan('A'), grabbed: false, retreat: false, parts: partsOf(), partId, strikeFrom, grab: null, holdingReach: E.holdingArmReach, clearTheHand: false, ...extra });
    expect(bodyPartStrikeBlock(ctx('in-reach', 'left-leg'))).toBeNull();
    expect(bodyPartStrikeBlock(ctx('in-reach', 'eyes'))).toBe('reach');
    expect(bodyPartStrikeBlock(ctx('in-reach', 'eyes', { titan: titan('A', { grounded: true }) }))).toBeNull();
    expect(bodyPartStrikeBlock(ctx('on-body', 'eyes', { soldier: at('on-body', { odmHad: false }) }))).toBe('noOdm');
    expect(bodyPartStrikeBlock(ctx('in-reach', 'left-leg', { parts: partsOf({ 'left-leg': 'broken' }) }))).toBe('broken');
    const lifted = { soldier: 'g', counted: 1, lifted: true, arm: 'left-arm' };
    expect(bodyPartStrikeBlock(ctx('in-reach', 'left-arm', { grab: lifted }))).toBe('reach');
    expect(bodyPartStrikeBlock(ctx('in-reach', 'left-arm', { grab: lifted, clearTheHand: true, soldier: at('in-reach', { odmHad: false }) }))).toBeNull();
    expect(bodyPartStrikeBlock(ctx('in-reach', 'left-arm', { grabbed: true }))).toBe('grabbed');
  });

  it('counts successes on the holding arm at grip Toughness and frees the soldier when it breaks', () => {
    const grab = { soldier: 'g', counted: 0, lifted: false, arm: 'left-arm' };
    const r = bodyPartStrikeResult(partsOf(), 'left-arm', 3, grab, E.gripToughness);
    expect(r).toMatchObject({ openings: 1, hurt: true, broke: true, freed: true, grounds: false });
    expect(r.parts.find((p) => p.id === 'left-arm')).toMatchObject({ state: 'broken', toughness: 2 });
    const leg = bodyPartStrikeResult(partsOf({ 'left-leg': 'wounded' }), 'left-leg', 2, null, E.gripToughness);
    expect(leg).toMatchObject({ broke: true, grounds: true, openings: 0 });
    expect(bodyPartStrikeResult(partsOf(), 'eyes', 0, null, 1)).toMatchObject({ hurt: false, broke: false });
  });

  it('works out Break Attention’s need and its decoys', () => {
    const n = E.breakAttention.needs;
    expect(breakAttentionNeeds(titan('A', { holder: 's' }), 's', 'flare', n)).toBe(1);
    expect(breakAttentionNeeds(titan('A', { holder: 'x', decoysInRow: 1 }), 's', 'feint', n)).toBe(4);
    expect(breakAttentionNeeds(titan('A', { holder: 's', grab: { soldier: 'g', counted: 0, lifted: false, arm: 'left-arm' } }), 's', 'flare', n)).toBe(2);
    expect(breakAttentionResult(4, 2, titan('B', { tempo: 2 }))).toEqual({ success: true, openings: 2, hold: 2, freed: false });
    expect(breakAttentionResult(1, 2, titan('A')).success).toBe(false);
    const d = (decoy: 'flare' | 'thrown-cloak' | 'feint' | 'riderless-horse', p: Position, extra: object = {}) =>
      breakAttentionBlock({ soldier: at(p), titan: titan('A'), grabbed: false, retreat: false, decoy, eyesBroken: false, cloakThrown: false, horseReady: false, ...extra });
    expect(d('flare', 'distant')).toBeNull();
    expect(d('flare', 'distant', { eyesBroken: true })).toBe('eyesBroken');
    expect(d('thrown-cloak', 'in-reach')).toBe('notClose');
    expect(d('thrown-cloak', 'on-body', { cloakThrown: true })).toBe('cloakThrown');
    expect(d('feint', 'distant')).toBe('feintReach');
    expect(d('feint', 'in-reach', { soldier: at('in-reach', { odmHad: false }) })).toBe('feintWay');
    expect(d('riderless-horse', 'distant')).toBe('noHorse');
    expect(d('flare', 'distant', { titan: titan('A', { decoy: { name: 'flare', left: 1 } }) })).toBe('decoyHolds');
  });
});

// ------------------------------------------------------------------ the round

describe('the round (round.yaml, round_steps and end_steps)', () => {
  const core = (extra: Partial<RoundCore> = {}): RoundCore => ({ mode: 'titan', step: 'wings', round: 1, wingsSet: false, wingsOpen: false, reassign: [], endLog: [], ...extra });

  it('steps wings, deal, swap, play, end, then the next round’s wings', () => {
    let c = core();
    for (const a of ['keep-wings', 'deal', 'begin-play', 'finish-play'] as const) c = roundNext(c, a);
    expect(c.step).toBe('end');
    expect(c.endLog.map((e) => e.check)).toEqual(['gas-rolls', 'regeneration', 'background-clocks', 'retreat-clock', 'momentum', 'round-ends']);
    expect(roundBlock(c, 'next-round')).toBe('endOpen');
    c = { ...c, endLog: c.endLog.map((e) => ({ ...e, state: 'done' })) };
    expect(endComplete(c)).toBe(true);
    c = roundNext(c, 'next-round');
    expect(c).toMatchObject({ step: 'wings', round: 2, endLog: [] });
  });

  it('refuses steps out of order', () => {
    expect(roundBlock(core(), 'deal')).toBe('wrongStep');
    expect(roundBlock(core({ step: 'deal' }), 'begin-play')).toBe('wrongStep');
    expect(() => roundNext(core(), 'finish-play')).toThrow();
  });

  it('keeps Wings only once every Squadmate of a dead or departed player character is assigned again', () => {
    expect(roundBlock(core({ reassign: ['m'] }), 'keep-wings')).toBe('reassign');
    expect(roundBlock(core(), 'keep-wings')).toBeNull();
    // Assigning the Squadmate takes it off the list (a player character's death puts it on).
    const died = noteWingEvent(core(), { kind: 'death', soldier: 'p' }, { m: 'p' });
    expect(roundBlock(died, 'keep-wings')).toBe('reassign');
    expect(roundBlock({ ...died, reassign: [] }, 'keep-wings')).toBeNull();
  });

  it('runs a Skirmish as deal, play, end with its two checks and no Wings or swap', () => {
    let c = core({ mode: 'skirmish', step: 'deal' });
    expect(roundBlock(c, 'keep-wings')).toBe('skirmish');
    expect(roundBlock(c, 'begin-play')).toBe('skirmish');
    c = roundNext(c, 'deal');
    expect(c.step).toBe('play');
    c = roundNext(c, 'finish-play');
    expect(c.endLog.map((e) => e.check)).toEqual(checksOf('skirmish'));
    c = roundNext({ ...c, endLog: c.endLog.map((e) => ({ ...e, state: 'skipped' })) }, 'next-round');
    expect(c).toMatchObject({ step: 'deal', round: 2 });
  });

  it('opens Wings at the first wings step and after an event only, and reassigns a dead player character’s Squadmate', () => {
    expect(wingsEditable(core())).toBe(true);
    const set = roundNext(core(), 'keep-wings');
    const later = { ...set, step: 'wings' as const };
    expect(wingsEditable(later)).toBe(false);
    const opened = noteWingEvent(later, { kind: 'down', soldier: 'p' }, {});
    expect(wingsEditable(opened)).toBe(true);
    const died = noteWingEvent(later, { kind: 'death', soldier: 'p' }, { m: 'p' });
    expect(died.reassign).toEqual(['m']);
    expect(noteWingEvent(core({ mode: 'skirmish' }), { kind: 'titan' }, {}).wingsOpen).toBe(false);
    const mate = { id: 'm', alive: true, pc: false };
    const pc = { id: 'p', alive: true, left: false, pc: true };
    expect(wingBlock({ core: core(), mate, pc, wings: {} })).toBeNull();
    expect(wingBlock({ core: core(), mate, pc, wings: { other: 'p' } })).toBe('full');
    expect(wingBlock({ core: core(), mate, pc: { ...pc, alive: false }, wings: {} })).toBe('pcGone');
    expect(wingBlock({ core: later, mate, pc, wings: {} })).toBe('closed');
    expect(wingBlock({ core: { ...later, reassign: ['m'] }, mate, pc: null, wings: {} })).toBeNull();
    expect(wingBlock({ core: core(), mate: { ...mate, pc: true }, pc, wings: {} })).toBe('notSquadmate');
  });

  it('lists the Gas Rolls due: the living soldiers who used ODM Gear, once each', () => {
    expect(gasRollsDue(['a', 'b', 'a', 'd'], (id) => id !== 'd')).toEqual(['a', 'b']);
  });

  it('fills Regeneration and applies a full clock', () => {
    const plan = planRegeneration([
      { key: 'A', filled: 1, clock: 3, parts: partsOf({ 'left-leg': 'broken' }), openingsBy: ['x'] },
      { key: 'B', filled: 2, clock: 3, parts: partsOf({ 'left-leg': 'broken', eyes: 'wounded' }), openingsBy: ['x', 'y'] },
    ]);
    expect(plan[0]).toMatchObject({ filled: 2, result: null, openingsBy: ['x'] });
    expect(plan[1]).toMatchObject({ filled: 0, openingsBy: [] });
    expect(plan[1].result).toMatchObject({ healed: { id: 'left-leg', from: 'broken', to: 'wounded' }, stands: true, steam: true, erased: 2 });
  });

  it('fills Background clocks, lets a full one enter below the limit, and makes a retreat at the limit', () => {
    const clocks = [
      { name: 'Small', length: 4, filled: 3, entered: 0 },
      { name: 'Large', length: 8, filled: 7, entered: 0 },
    ];
    const one = planBackground(clocks, 1, E.focusLimit, false, 3);
    expect(one).toMatchObject({ enter: [0], retreat: true });
    expect(one.clocks.map((c) => c.filled)).toEqual([4, 8]);
    expect(planBackground(clocks, 0, E.focusLimit, false, 3)).toMatchObject({ enter: [0, 1], retreat: false });
    expect(planBackground(clocks, 1, E.focusLimit, true, 3)).toMatchObject({ enter: [], retreat: false, clocks });
    const flare = planBackground([{ name: 'S', length: 6, filled: 1, entered: 0 }], 2, 2, false, 2);
    expect(flare.clocks[0].filled).toBe(2);
  });

  it('fills the retreat clock until a retreat, then stops; counts the stay limit', () => {
    expect(planRetreat({ length: 8, filled: 1, active: false, began: 0 }, 2)).toEqual({ length: 8, filled: 2, active: false, began: 0 });
    expect(planRetreat({ length: 8, filled: 7, active: false, began: 0 }, 6)).toEqual({ length: 8, filled: 8, active: true, began: 6 });
    const active = { length: 8, filled: 3, active: true, began: 4 };
    expect(planRetreat(active, 5)).toEqual(active);
    expect(stayLimitLeft(active, 5)).toBe(8);
    expect(stayLimitLeft(active, 9)).toBe(4);
    expect(stayLimitLeft({ ...active, active: false }, 9)).toBeNull();
  });

  it('runs the switched-on checks in order and stops at a switched-off one', () => {
    const log: EndEntry[] = checksOf('titan').map((check) => ({ check, state: 'waiting', ops: [], lines: [] }));
    const on = Object.fromEntries(TRACKER_CATEGORIES.map((c) => [c, true])) as Record<TrackerCategory, boolean>;
    expect(autoChecks(log, on)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(autoChecks(log, { ...on, regeneration: false })).toEqual([0]);
    const partly = log.map((e, i) => (i < 2 ? { ...e, state: 'done' as const } : e));
    expect(nextCheck(partly)).toBe(2);
    expect(autoChecks(partly, { ...on, clocks: false })).toEqual([]);
    const undone = log.map((e, i) => ({ ...e, state: i === 0 ? ('done' as const) : i === 1 ? ('undone' as const) : ('waiting' as const) }));
    expect(autoChecks(undone, on)).toEqual([]);
  });

  it('undoes a check with every later check first, in reverse, and keeps later changes', () => {
    const log: EndEntry[] = checksOf('titan').map((check, i) => ({ check, state: i < 4 ? 'done' : 'waiting', ops: [], lines: [] }));
    expect(undoOrder(log, 1)).toEqual([3, 2, 1]);
    const op = { t: 'set' as const, uuid: 'x', path: 'system.regeneration', from: 1, to: 2 };
    expect(revertValue(op, 2)).toEqual({ value: 1 });
    // A number changed after the step is kept, not moved back by the op's delta (milestone 4 review, M6).
    expect(revertValue(op, 3)).toBeUndefined();
    expect(revertValue(op, 0)).toBeUndefined();
    const list = { t: 'set' as const, uuid: 'x', path: 'system.openings_by', from: ['a'], to: [] };
    expect(revertValue(list, [])).toEqual({ value: ['a'] });
    expect(revertValue(list, ['b'])).toBeUndefined();
    expect(revertValue({ t: 'set', uuid: 'x', path: 'p', from: { a: 1, b: 2 }, to: { b: 3, a: 1 } }, { a: 1, b: 3 })).toEqual({ value: { a: 1, b: 2 } });
  });
});

// ------------------------------------------------------------------ Skirmish

describe('a Skirmish (skirmish.yaml, foes.yaml)', () => {
  const foe = (extra: Partial<FoeState> = {}): FoeState => ({ id: 'f1', label: 1, health: 4, lost: 0, out: false, heldBy: null, fightWeapon: 'sabre', shootWeapon: 'flintlock-pistol', loaded: true, ...extra });
  const squad = [soldier('a'), soldier('b'), soldier('d', { down: true })];
  const cards: Record<string, number> = { a: 9, b: 4, d: 1 };
  const turn = (f: FoeState, engaged: string[] = [], last: string | null = null, broken = false) => foeTurn({ foe: f, soldiers: squad, engaged: (id) => engaged.includes(id), lastAttacker: last, cardOf: (id) => cards[id] ?? null, broken });

  it('takes the first foe-rule step the Foe meets, never a Down soldier', () => {
    expect(turn(foe({ heldBy: 'a' }))).toMatchObject({ step: 'held', target: 'a', weapon: 'bare-hands' });
    expect(turn(foe(), ['a', 'b'])).toMatchObject({ step: 'engaged', target: 'b', weapon: 'sabre' });
    expect(turn(foe(), ['a', 'b'], 'a')).toMatchObject({ step: 'engaged', target: 'a' });
    expect(turn(foe(), [], 'a')).toMatchObject({ step: 'loaded', target: 'a', weapon: 'flintlock-pistol' });
    expect(turn(foe(), [])).toMatchObject({ step: 'loaded', target: 'b' });
    expect(turn(foe({ loaded: false }))).toMatchObject({ step: 'empty', target: null });
    expect(turn(foe({ shootWeapon: null }))).toMatchObject({ step: 'close-in', target: 'b', closes: true });
    expect(turn(foe({ shootWeapon: null }), ['d'])).toMatchObject({ step: 'close-in', target: 'b' });
    expect(turn(foe({ out: true }))).toMatchObject({ step: 'out' });
    expect(turn(foe(), [], null, true)).toMatchObject({ step: 'out' });
    expect(foeTurn({ foe: foe({ shootWeapon: null }), soldiers: [soldier('d', { down: true })], engaged: () => false, lastAttacker: null, cardOf: () => 1, broken: false }).step).toBe('none');
  });

  it('rolls the Ambush dice, forbids the cancelling roll against the Ambush, and deals damage by Net Successes', () => {
    expect(foeAttackDice(7, true, false, E.bonus.ambush)).toBe(9);
    expect(foeAttackDice(7, true, true, E.bonus.ambush)).toBe(7);
    expect(cancelAllowed(true, false)).toBe(false);
    expect(cancelAllowed(false, false)).toBe(true);
    expect(reactionsAgainst('shoot', E.skirmish.reactions)).toEqual(['dodge']);
    expect(reactionsAgainst('fight', E.skirmish.reactions)).toEqual(['block', 'dodge']);
    expect(netSuccesses(3, 1)).toBe(2);
    expect(attackDamage(2, 0, E.skirmish.perNetBeyond)).toBe(0);
    expect(attackDamage(2, 1, E.skirmish.perNetBeyond)).toBe(2);
    expect(attackDamage(4, 3, E.skirmish.perNetBeyond)).toBe(6);
  });

  it('puts a Foe out at 0 Health, killed by cut, pierce, or burn and out cold by crush; breaks the group at its Grit', () => {
    expect(harmFoe({ health: 4, lost: 1 }, 5, 'cut', E.skirmish.killedBy)).toEqual({ lost: 4, out: true, killed: true });
    expect(harmFoe({ health: 4, lost: 0 }, 4, 'crush', E.skirmish.killedBy)).toEqual({ lost: 4, out: true, killed: false });
    expect(harmFoe({ health: 4, lost: 0 }, 2, 'pierce', E.skirmish.killedBy)).toEqual({ lost: 2, out: false, killed: false });
    expect(groupBroken([{ out: true }, { out: false }], 1)).toBe(true);
    expect(groupBroken([{ out: true }, { out: false }], 2)).toBe(false);
    expect(parleyNeeds(2, 1, 0)).toBe(2);
    expect(parleyNeeds(1, 3, 1)).toBe(2);
    expect(rollFightWeapon([{ results: [1, 2, 3], weapon: 'club' }, { results: [4, 5, 6], weapon: 'knife' }], 2, { replaces: 'club', with: 'firebrand' }, true)).toBe('firebrand');
    expect(rollFightWeapon([{ results: [1, 2, 3], weapon: 'club' }, { results: [4, 5, 6], weapon: 'knife' }], 5, { replaces: 'club', with: 'firebrand' }, true)).toBe('knife');
  });

  it('checks the ending tests', () => {
    const foes = [foe({ out: true }), foe({ id: 'f2', out: false })];
    expect(skirmishEnding(foes, squad, () => false, () => false)).toMatchObject({ foesGone: false, noSoldierStanding: false, squadMayLeave: false });
    expect(skirmishEnding([foe({ out: true })], [soldier('a', { down: true })], () => false, () => false)).toMatchObject({ foesGone: true, noSoldierStanding: true });
    expect(skirmishEnding(foes, [soldier('a'), soldier('d', { down: true, carriedBy: 'a' })], () => false, () => false).squadMayLeave).toBe(true);
    expect(skirmishEnding(foes, [soldier('a')], (id) => id === 'a', () => false).squadMayLeave).toBe(false);
  });
});

// ------------------------------------------------------------------ Critical Injury gaining

describe('gaining a Critical Injury (critical-injuries.yaml, gaining)', () => {
  const T = E.injury as never as Parameters<typeof gainInjury>[0];
  const none = { held: [], healedPermanent: [] };

  it('rolls the Injury Location and side, or the side of a named limb', () => {
    expect(gainInjury(T, { location: 'rolled', cannotBeLethal: false, net: 0, ...none }, { location: 2, dice: [1, 1] })).toMatchObject({ location: 'arm', side: 'right' });
    expect(gainInjury(T, { location: 'rolled', cannotBeLethal: false, net: 0, ...none }, { location: 6, dice: [1, 1] })).toMatchObject({ location: 'head', side: null });
    expect(gainInjury(T, { location: 'leg', cannotBeLethal: false, net: 0, ...none }, { location: 3, dice: [1, 1] })).toMatchObject({ location: 'leg', side: 'left' });
    expect(gainInjury(T, { location: 'torso', cannotBeLethal: false, net: 0, ...none }, { location: 4, dice: [1, 1] }).side).toBeNull();
  });

  it('adds worsening for injuries at the same location and side only, and the Net Success rider', () => {
    const held = [
      { row: 'x', location: 'arm', side: 'left' as const },
      { row: 'y', location: 'arm', side: 'right' as const },
    ];
    const r = gainInjury(T, { location: 'arm', cannotBeLethal: false, net: 3, held, healedPermanent: [] }, { location: 1, dice: [2, 3] });
    expect(r.total).toBe(5 + E.injury.worsening + 2 * E.injury.rider);
  });

  it('caps a cannot-be-lethal injury at the table’s non-lethal row', () => {
    const torso = E.injury.tables.torso;
    const r = gainInjury(T, { location: 'torso', cannotBeLethal: true, net: 0, ...none }, { location: 1, dice: [6, 6] });
    const worst = torso.rows[torso.rows.length - 1];
    expect(worst.lethal || worst.instant).toBe(true);
    expect(r.row).toBe(torso.cap);
    const lethal = gainInjury(T, { location: 'torso', cannotBeLethal: false, net: 5, ...none }, { location: 1, dice: [6, 6] });
    expect(lethal.row).toBe(worst.id);
  });

  it('uses the repeat row for a permanent row already gained at that side', () => {
    const arm = E.injury.tables.arm;
    const perm = arm.rows.find((r) => r.permanent && r.repeat)!;
    const dice = (perm.min ?? 2) as number;
    const roll = { location: 1, dice: [Math.min(6, dice - 1), dice - Math.min(6, dice - 1)] as [number, number] };
    const first = gainInjury(T, { location: 'arm', cannotBeLethal: false, net: 0, held: [], healedPermanent: [] }, roll);
    expect(first.row).toBe(perm.id);
    const again = gainInjury(T, { location: 'arm', cannotBeLethal: false, net: 0, held: [], healedPermanent: [{ row: perm.id, side: 'left' }] }, { ...roll, dice: [roll.dice[0], roll.dice[1] - E.injury.worsening > 0 ? roll.dice[1] - E.injury.worsening : roll.dice[1]] });
    expect([perm.repeat, perm.id]).toContain(again.row);
    const otherSide = gainInjury(T, { location: 'arm', cannotBeLethal: false, net: 0, held: [], healedPermanent: [{ row: perm.id, side: 'right' }] }, roll);
    expect(otherSide.row).toBe(perm.id);
  });
});

// ------------------------------------------------------------------ the request guard

describe('tracker requests (the GM proxy guard)', () => {
  const snap = (extra: Partial<Snapshot> = {}): Snapshot => ({
    combat: 'C',
    mode: 'titan',
    step: 'swap',
    round: 2,
    anchor: wooded,
    soldiers: [soldier('a', { positions: { A: 'in-reach' } }), soldier('b', { positions: { A: 'on-body' } }), soldier('c', { positions: { A: 'distant' } }), soldier('m', { pc: false, positions: { A: 'in-reach' } })],
    titans: [titan('A')],
    wings: {},
    cards: { a: 3, b: 7, c: 11, m: 15 },
    titanCards: { tA: [9] },
    swapped: [],
    proposal: null,
    retreat: false,
    wingsSet: true,
    wingsOpen: false,
    reassign: [],
    tactics: { held: ['fall-back'], used: [] },
    cloaks: [],
    anchors: 2,
    wrecks: 0,
    odmUsed: [],
    movesSpent: [],
    ...extra,
  });
  const world = (s: Snapshot, mine: string[]): TrackerWorld => ({ userId: 'u', owns: (id) => mine.includes(id), snapshot: (id) => (id === s.combat ? s : null) });

  it('lets a player propose a legal swap for their own soldier only', () => {
    expect(checkTrackerRequest(world(snap(), ['a']), { act: 'swap-propose', combat: 'C', a: 'a', b: 'b' })).toBeNull();
    expect(checkTrackerRequest(world(snap(), ['b']), { act: 'swap-propose', combat: 'C', a: 'a', b: 'b' })).toMatch(/own soldier/);
    expect(checkTrackerRequest(world(snap(), ['b']), { act: 'swap-propose', combat: 'C', a: 'b', b: 'c' })).toMatch(/far/);
    expect(checkTrackerRequest(world(snap({ step: 'play' }), ['a']), { act: 'swap-propose', combat: 'C', a: 'a', b: 'b' })).toMatch(/notStep/);
    expect(checkTrackerRequest(world(snap(), ['a']), { act: 'swap-propose', combat: 'X', a: 'a', b: 'b' })).toMatch(/no such/);
    expect(checkTrackerRequest(world(snap(), ['a']), { act: 'swap-propose', combat: 'C', a: 'a', b: 'z' })).toMatch(/taking part/);
  });

  it('lets only the other soldier’s owner accept, and either owner cancel', () => {
    const s = snap({ proposal: { a: 'a', b: 'b', by: 'u1' } });
    expect(checkTrackerRequest(world(s, ['b']), { act: 'swap-accept', combat: 'C' })).toBeNull();
    expect(checkTrackerRequest(world(s, ['a']), { act: 'swap-accept', combat: 'C' })).toMatch(/other soldier/);
    expect(checkTrackerRequest(world(s, ['a']), { act: 'swap-cancel', combat: 'C' })).toBeNull();
    expect(checkTrackerRequest(world(s, ['c']), { act: 'swap-cancel', combat: 'C' })).toMatch(/neither/);
    expect(checkTrackerRequest(world(snap(), ['b']), { act: 'swap-accept', combat: 'C' })).toMatch(/no swap/);
    expect(checkTrackerRequest(world({ ...s, swapped: ['b'] }, ['b']), { act: 'swap-accept', combat: 'C' })).toMatch(/already/);
  });

  it('lets a player report their own soldier’s departure, so Wings open again', () => {
    const gone = snap({ step: 'play', soldiers: [soldier('a', { left: true, positions: {} }), soldier('b', { positions: { A: 'on-body' } })] });
    expect(checkTrackerRequest(world(gone, ['a']), { act: 'left', combat: 'C', soldier: 'a' })).toBeNull();
    expect(checkTrackerRequest(world(gone, ['b']), { act: 'left', combat: 'C', soldier: 'a' })).toMatch(/owner/);
    expect(checkTrackerRequest(world(gone, ['b']), { act: 'left', combat: 'C', soldier: 'b' })).toMatch(/not left/);
    expect(checkTrackerRequest(world(gone, ['a']), { act: 'left', combat: 'C', soldier: 'z' })).toMatch(/taking part/);
    expect(checkTrackerRequest(world({ ...gone, mode: 'skirmish' }, ['a']), { act: 'left', combat: 'C', soldier: 'a' })).toMatch(/Titan Engagement/);
    // What the GM records: the Wing of the departed player character opens for reassignment.
    const core = noteWingEvent(coreOf(gone), { kind: 'left', soldier: 'a' }, { m: 'a' });
    expect(core).toMatchObject({ wingsOpen: true, reassign: ['m'] });
  });

  it('checks Wings, ODM use, Draw Attention, and Fall Back', () => {
    const wings = snap({ step: 'wings', wingsSet: false });
    expect(checkTrackerRequest(world(wings, ['a']), { act: 'wing', combat: 'C', mate: 'm', pc: 'a' })).toBeNull();
    expect(checkTrackerRequest(world(wings, ['c']), { act: 'wing', combat: 'C', mate: 'm', pc: 'a' })).toMatch(/owns neither/);
    expect(checkTrackerRequest(world(snap({ step: 'wings' }), ['a']), { act: 'wing', combat: 'C', mate: 'm', pc: 'a' })).toMatch(/closed/);
    expect(checkTrackerRequest(world(snap({ step: 'play' }), ['a']), { act: 'odm', combat: 'C', soldier: 'a' })).toBeNull();
    expect(checkTrackerRequest(world(snap(), ['a']), { act: 'odm', combat: 'C', soldier: 'a' })).toMatch(/during play/);
    expect(checkTrackerRequest(world(snap({ step: 'play' }), ['b']), { act: 'odm', combat: 'C', soldier: 'a' })).toMatch(/owner/);
    expect(checkTrackerRequest(world(snap({ step: 'play' }), ['a']), { act: 'loud', combat: 'C', soldier: 'a', titan: 'tA' })).toBeNull();
    expect(checkTrackerRequest(world(snap({ step: 'play' }), ['c']), { act: 'loud', combat: 'C', soldier: 'c', titan: 'tA' })).toMatch(/distant/);
    const fb = snap({ step: 'wings' });
    expect(checkTrackerRequest(world(fb, ['b']), { act: 'fall-back', combat: 'C', soldier: 'b', titan: 'tA' })).toBeNull();
    expect(checkTrackerRequest(world(fb, ['a']), { act: 'fall-back', combat: 'C', soldier: 'a', titan: 'tA' })).toMatch(/notClose/);
    expect(fallBackBlock({ ...fb, tactics: { held: ['fall-back'], used: ['fall-back'] } }, 'b', 'tA')).toBe('used');
    expect(fallBackBlock({ ...fb, tactics: { held: ['fall-back'], used: ['fall-back', 'fall-back@2'] } }, 'b', 'tA')).toBeNull();
    expect(checkTrackerRequest(world(snap(), ['a']), { act: 'nope' } as never)).toMatch(/malformed|unknown/);
  });

  it('checks a Skirmish close-in or break-away', () => {
    const sk = { ...snap({ mode: 'skirmish', step: 'play' }), titans: [] };
    const w = (mine: string[], holding: string[] = []): TrackerWorld => ({ ...world(sk, mine), skirmish: () => ({ foes: ['f1'], holding }) });
    expect(checkTrackerRequest(w(['a']), { act: 'engage', combat: 'C', soldier: 'a', foe: 'f1' })).toBeNull();
    expect(checkTrackerRequest(w(['a']), { act: 'engage', combat: 'C', soldier: 'a', foe: 'f9' })).toMatch(/not in the Skirmish/);
    expect(checkTrackerRequest(w(['b']), { act: 'engage', combat: 'C', soldier: 'a', foe: 'f1' })).toMatch(/owner/);
    expect(checkTrackerRequest(w(['a'], ['a']), { act: 'engage', combat: 'C', soldier: 'a', foe: 'f1' })).toMatch(/Held/);
    expect(checkTrackerRequest({ ...w(['a']), snapshot: () => ({ ...sk, soldiers: [soldier('a', { down: true })] }) }, { act: 'engage', combat: 'C', soldier: 'a', foe: 'f1' })).toMatch(/Down/);
    expect(checkTrackerRequest(world(snap({ step: 'play' }), ['a']), { act: 'engage', combat: 'C', soldier: 'a', foe: 'f1' })).toMatch(/Skirmish/);
  });
});

// ------------------------------------------------------------------ a Titan's death

describe('a Focus Titan dies (titan-harm.yaml, titan_death)', () => {
  const grab = { soldier: 'g', counted: 1, lifted: true, arm: 'left-arm' };
  const soldiers = [
    soldier('a', { positions: { A: 'blind-spot', B: 'distant' } }),
    soldier('b', { positions: { A: 'on-body', B: 'in-reach' } }),
    soldier('c', { positions: { A: 'distant', B: 'distant' } }),
    soldier('g', { positions: { A: 'on-body', B: 'distant' } }),
    soldier('x', { positions: { B: 'distant' } }),
  ];
  const titans = [titan('A', { grab }), titan('B')];
  // Turn order this round: tA's card 2, a, tB, tA's card 9 (current: a), tA's card 14.
  const cards: DeathCard[] = [
    { id: 'A1', titan: 'tA', order: 0 },
    { id: 'B1', titan: 'tB', order: 2 },
    { id: 'A2', titan: 'tA', order: 3 },
    { id: 'A3', titan: 'tA', order: 4 },
    { id: 'A4', titan: 'tA', order: null },
  ];
  const plan = planTitanDeath({ soldiers, titans, key: 'tA', cards, turn: 1, grounded: false })!;

  it('removes only its cards after the current one, so the turn does not move', () => {
    expect(plan.clearCards).toEqual(['A2', 'A3']);
    expect(planTitanDeath({ soldiers, titans, key: 'tA', cards, turn: 3, grounded: false })!.clearCards).toEqual(['A3']);
    expect(planTitanDeath({ soldiers, titans, key: 'tA', cards, turn: null, grounded: false })!.clearCards).toEqual(['A1', 'A2', 'A3']);
  });

  it('turns each Position into a Position relative to the corpse', () => {
    expect(plan.positions.a).toEqual({ A: 'in-reach', B: 'distant' });
    expect(plan.positions.b).toEqual({ A: 'in-reach', B: 'in-reach' });
    expect(plan.positions.c).toEqual({ A: 'distant', B: 'distant' });
    expect(plan.positions.x).toEqual({ B: 'distant' });
  });

  it('frees the Grabbed soldier into the steam and the fall', () => {
    expect(plan.freed).toBe('g');
    expect(plan.positions.g).toEqual({ A: 'in-reach', B: 'distant' });
    expect(plan.steam).toEqual(['a', 'b', 'g']);
    expect(plan.fall).toEqual(['a', 'b', 'g']);
    expect(planTitanDeath({ soldiers, titans, key: 'tA', cards, turn: 1, grounded: true })!.fall).toEqual([]);
    expect(plan.relief).toEqual(['a', 'b', 'c', 'g', 'x']);
  });

  it('does nothing for a corpse or an unknown Titan', () => {
    expect(planTitanDeath({ soldiers, titans: [titan('A', { status: 'corpse' })], key: 'tA', cards, turn: 1, grounded: false })).toBeNull();
    expect(planTitanDeath({ soldiers, titans, key: 'tZ', cards, turn: 1, grounded: false })).toBeNull();
  });
});
