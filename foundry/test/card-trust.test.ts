import { describe, expect, it } from 'vitest';
import type { ActionCard, AttackCard, FoeAttackCard } from '../src/dice/card.ts';
import { cardRefusal, ownRewriteRefusal, resultDigest, resultTrust, strikeRefusal, type CardTrustWorld, type StrikeFacts } from '../src/rules/engagement/card-trust.ts';
import { emptyFlags, type Snapshot, type SoldierState, type TitanRow } from '../src/rules/engagement/types.ts';

// Alice owns soldier A; the GM is user gm; Bob owns nothing here.
const A = 'Actor.A';
const world: CardTrustWorld = {
  isGM: (id) => id === 'gm',
  owns: (id, uuid) => id === 'gm' || (id === 'alice' && uuid === A),
};

function nape(extra: Partial<ActionCard> = {}): ActionCard {
  return {
    v: 1, kind: 'action', actor: A, actorName: 'Alice Soldier', img: '', time: '12:00', ops: [],
    entry: 'nape-strike', name: 'Nape Strike', attribute: 'strength', called: false, stakes: null, circumstances: null, needs: null, passive: false,
    pool: { attribute: { id: 'strength', dice: 3 }, talent: null, bonus: 0, removed: { bonus: 0, talent: 0, attribute: 0 }, base: 3, gear: null, stress: 1, why: '' },
    dice: { base: [6, 2, 3], gear: [], stress: [4] },
    fresh: -1, pushes: 0, maxPushes: 1, pushAllowed: true, coverAllowed: true, responses: true,
    cover: null, response: null, attack: null, injury: null, call: null,
    target: { combat: 'C', titan: 'tA', openings: 0 },
    ...extra,
  };
}

const attack: AttackCard = {
  v: 1, kind: 'attack', actor: 'Actor.T', actorName: 'Titan', img: '', time: '12:00', ops: [], entry: 'grab', name: 'Grab', tier: 'strike',
  faces: [6, 6, 6], severity: 3, effects: [], critical: false, targets: [{ actor: 'Actor.B', name: 'Bob Soldier' }], reactions: [],
  titan: { combat: 'C', key: 'tA', label: 'A' },
};

const foeAttack: FoeAttackCard = {
  v: 1, kind: 'foe-attack', actor: 'Actor.F', actorName: 'Bandit', img: '', time: '12:00', ops: [], combat: 'C', foe: 'f1', weapon: 'Knife', usedWith: 'fight',
  faces: [6, 6], severity: 2, target: { actor: 'Actor.B', name: 'Bob Soldier' }, cancel: false, reactions: [],
};

function soldier(id: string, extra: Partial<SoldierState> = {}): SoldierState {
  return { id, name: id, pc: true, alive: true, down: false, left: false, carriedBy: null, carrying: null, pinned: null, mounted: false, airborne: false, odmHad: true, positions: { A: 'in-reach' }, momentum: 0, untreated: 0, ...extra };
}

function titan(extra: Partial<TitanRow> = {}): TitanRow {
  return { key: 'tA', label: 'A', status: 'focus', tempo: 1, frenzy: 0, ladder: [], holder: '', grab: null, decoy: null, decoysInRow: 0, flags: emptyFlags(), grounded: false, entered: 1, ...extra };
}

function snap(soldiers: SoldierState[], titans: TitanRow[] = [titan()]): Snapshot {
  return {
    combat: 'C', mode: 'titan', step: 'play', round: 1, anchor: null, soldiers, titans, wings: {}, cards: {}, titanCards: {}, swapped: [], proposal: null,
    retreat: false, wingsSet: true, wingsOpen: false, reassign: [], tactics: { held: [], used: [] }, cloaks: [],
      anchors: 2, wrecks: 0, odmUsed: [], movesSpent: [],
  };
}

const facts: StrikeFacts = {
  parts: [], strikeFrom: {}, holdingReach: { before: [], after: [] }, clearTheHand: false, openingsBy: [], decoys: ['flare', 'riderless-horse', 'thrown-cloak', 'feint'], horseReady: false, pryLoose: false,
};

describe('the cards the GM acts on (milestone 4 review, B1)', () => {
  it('ignores a forged player card for a soldier the author does not own', () => {
    expect(cardRefusal(world, 'bob', nape())).toMatch(/does not own/);
    expect(cardRefusal(world, 'alice', nape())).toBeNull();
    expect(cardRefusal(world, 'gm', nape())).toBeNull();
  });

  it('ignores a forged Nape strike from a Position other than Blind Spot', () => {
    const forged = nape({ dice: { base: [6, 6, 6], gear: [], stress: [6] } });
    expect(cardRefusal(world, 'alice', forged)).toBeNull();
    expect(strikeRefusal(snap([soldier('A')]), 'A', forged.entry, forged.target!, facts)).toBe('notBlindSpot');
    // The legitimate Nape strike, from Blind Spot, still applies.
    expect(strikeRefusal(snap([soldier('A', { positions: { A: 'blind-spot' } })]), 'A', forged.entry, forged.target!, facts)).toBeNull();
  });

  it('checks the other strike requirements again', () => {
    const s = snap([soldier('A', { positions: { A: 'blind-spot' } })]);
    expect(strikeRefusal(s, 'A', 'nape-strike', { combat: 'C', titan: 'tA', openings: 2 }, facts)).toBe('openings');
    expect(strikeRefusal(s, 'A', 'nape-strike', { combat: 'C', titan: 'tA', openings: 1 }, { ...facts, openingsBy: ['B'] })).toBeNull();
    expect(strikeRefusal(snap([soldier('A', { positions: { A: 'blind-spot' } })], [titan({ status: 'corpse' })]), 'A', 'nape-strike', { combat: 'C', titan: 'tA' }, facts)).toBe('corpse');
    expect(strikeRefusal(s, 'A', 'nape-strike', { combat: 'C', titan: 'tX' }, facts)).toBe('noTitan');
    expect(strikeRefusal(s, 'A', 'body-part-strike', { combat: 'C', titan: 'tA', part: 'nope' }, facts)).toBe('noPart');
    expect(strikeRefusal(s, 'A', 'break-attention', { combat: 'C', titan: 'tA', decoy: 'flare' }, facts)).toBeNull();
    expect(strikeRefusal(s, 'A', 'break-attention', { combat: 'C', titan: 'tA', decoy: 'dragon' }, facts)).toBe('pickDecoy');
    expect(strikeRefusal(snap([soldier('A')], [titan({ decoy: { name: 'Flare', left: 1 } })]), 'A', 'break-attention', { combat: 'C', titan: 'tA', decoy: 'flare' }, facts)).toBe('decoyHolds');
    // Break Free: only the Grabbed soldier, or Pry Loose from On Body.
    const grab = { soldier: 'B', counted: 0, lifted: false, arm: 'left-arm' };
    const held = snap([soldier('A', { positions: { A: 'on-body' } }), soldier('B')], [titan({ grab })]);
    expect(strikeRefusal(held, 'A', 'break-free', { combat: 'C', titan: 'tA' }, facts)).toBe('notGrabbed');
    expect(strikeRefusal(held, 'B', 'break-free', { combat: 'C', titan: 'tA' }, facts)).toBeNull();
    expect(strikeRefusal(held, 'A', 'break-free', { combat: 'C', titan: 'tA', forSoldier: 'B' }, facts)).toBe('notGrabbed');
    expect(strikeRefusal(held, 'A', 'break-free', { combat: 'C', titan: 'tA', forSoldier: 'B' }, { ...facts, pryLoose: true })).toBeNull();
  });

  it('ignores a forged Titan or Foe attack card, and applies the GM’s', () => {
    expect(cardRefusal(world, 'alice', attack)).toMatch(/GM/);
    expect(cardRefusal(world, 'alice', foeAttack)).toMatch(/GM/);
    expect(cardRefusal(world, 'gm', attack)).toBeNull();
    expect(cardRefusal(world, 'gm', foeAttack)).toBeNull();
    // The GM adds a Reaction for a player through the proxy: still the GM's card.
    const reacted = { ...attack, reactions: [{ actor: 'Actor.B', name: 'Bob Soldier', successes: 1, message: 'd1' }] };
    expect(cardRefusal(world, 'gm', reacted, { userId: 'gm', previous: attack })).toBeNull();
  });

  it('ignores a player editing their card to change its result', () => {
    const rolled = nape({ target: { combat: 'C', titan: 'tA' } });
    const moreSixes = { ...rolled, dice: { base: [6, 6, 6], gear: [], stress: [4] } };
    expect(cardRefusal(world, 'alice', moreSixes, { userId: 'alice', previous: rolled })).toMatch(/without a Push/);
    const otherTitan = { ...rolled, target: { combat: 'C', titan: 'tB' } };
    expect(cardRefusal(world, 'alice', otherTitan, { userId: 'alice', previous: rolled })).toMatch(/beyond a Push/);
    const lostSix = { ...rolled, pushes: 1, fresh: 1, dice: { base: [5, 6, 6], gear: [], stress: [6, 6] } };
    expect(cardRefusal(world, 'alice', lostSix, { userId: 'alice', previous: rolled })).toMatch(/keeps every 6/);
    const twice = { ...rolled, pushes: 2, dice: { base: [6, 6, 6], gear: [], stress: [6, 6] } };
    expect(cardRefusal(world, 'alice', twice, { userId: 'alice', previous: rolled })).toMatch(/adds one/);
    expect(cardRefusal(world, 'alice', { ...rolled, pushes: 0 }, { userId: 'alice', previous: undefined })).toMatch(/no earlier copy/);
    // Only a GM changes an attack card.
    expect(cardRefusal(world, 'gm', { ...attack, severity: 9 }, { userId: 'alice', previous: attack })).toMatch(/only a GM/);
  });

  it('still applies a real Push, a Cover, and op state changes', () => {
    const rolled = nape({ ops: [{ t: 'num', cat: 'stress', actor: A, item: null, path: 'system.stress', from: 0, to: 1, min: 0, max: null, label: 'Stress', state: 'done' }] });
    const pushed: ActionCard = { ...rolled, pushes: 1, fresh: 1, dice: { base: [6, 6, 1], gear: [], stress: [2, 5] }, pool: { ...rolled.pool, stress: 2 }, ops: [] };
    expect(cardRefusal(world, 'alice', pushed, { userId: 'alice', previous: rolled })).toBeNull();
    const covered = { ...rolled, cover: { actor: 'Actor.B', name: 'Bob Soldier' } };
    expect(ownRewriteRefusal(rolled, covered)).toBeNull();
    expect(ownRewriteRefusal(covered, { ...covered, pushes: 1, dice: { base: [6, 4, 4], gear: [], stress: [3] } })).toBeNull();
    expect(ownRewriteRefusal(covered, { ...covered, pushes: 1, dice: { base: [6, 4, 4], gear: [], stress: [3, 3] } })).toMatch(/dice count/);
    expect(ownRewriteRefusal(rolled, { ...rolled, ops: [{ ...rolled.ops[0], state: 'undone' }] })).toBeNull();
    // A roll that cannot be Pushed is not Pushed by an edit.
    const stuck = nape({ pushAllowed: false });
    expect(ownRewriteRefusal(stuck, { ...stuck, pushes: 1, fresh: 1, dice: { base: [6, 6, 6], gear: [], stress: [6, 6] } })).toMatch(/could not be Pushed/);
  });

  it('trusts only the result the GM recorded', () => {
    const result = { state: 'done', ops: [{ t: 'set', uuid: 'Actor.T', path: 'system.corpse', from: false, to: true }], lines: ['kill'], sig: '3:0', kind: 'strike' };
    const digest = resultDigest(result);
    expect(resultTrust(result, digest)).toBe('trusted');
    expect(resultTrust(structuredClone(result), digest)).toBe('trusted');
    expect(resultTrust(undefined, undefined)).toBe('none');
    // A player rewrites the ops Undo would write back, or adds a result the GM never wrote.
    const forged = { ...result, ops: [{ t: 'set', uuid: 'Actor.B', path: 'system.stress', from: 9, to: 0 }] };
    expect(resultTrust(forged, digest)).toBe('tampered');
    expect(resultTrust({ ...result, state: 'undone' }, digest)).toBe('tampered');
    expect(resultTrust(result, undefined)).toBe('tampered');
    expect(resultTrust(undefined, digest)).toBe('tampered');
  });
});
