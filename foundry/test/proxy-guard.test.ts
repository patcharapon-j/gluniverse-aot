import { beforeEach, describe, expect, it } from 'vitest';
import type { ActionCard, AttackCard, CallCard, Card } from '../src/dice/card.ts';
import { checkCardRewrite, checkCreateItem, checkDeleteItem, checkOpUpdate, recordRun, type GuardWorld, type Ledger, type OpContext } from '../src/dice/proxy-guard.ts';
import type { DeleteOp, NumOp, Op, SetOp } from '../src/rules/roll.ts';

// Alice owns soldier A (the roller), Bob owns soldier B (a comrade); the GM owns the Titan T.
const A = 'Actor.A';
const B = 'Actor.B';
const S = 'Actor.S'; // a Squadmate Bob owns
const T = 'Actor.T';
const C = 'Actor.C'; // Carol's soldier

const clone = <X>(x: X): X => structuredClone(x);

function action(extra: Partial<ActionCard> = {}): ActionCard {
  return {
    v: 1,
    kind: 'action',
    actor: A,
    actorName: 'Alice Soldier',
    img: '',
    time: '12:00',
    ops: [],
    entry: 'nape-strike',
    name: 'Nape Strike',
    attribute: 'strength',
    called: false,
    stakes: null,
    circumstances: null,
    needs: null,
    passive: false,
    pool: { attribute: { id: 'strength', dice: 3 }, talent: null, bonus: 0, removed: { bonus: 0, talent: 0, attribute: 0 }, base: 3, gear: null, stress: 1, why: '' },
    dice: { base: [6, 2, 3], gear: [], stress: [4] },
    fresh: -1,
    pushes: 0,
    maxPushes: 1,
    pushAllowed: true,
    coverAllowed: true,
    responses: true,
    cover: null,
    response: null,
    attack: null,
    injury: null,
    call: null,
    ...extra,
  };
}

const stressOp = (actor: string, from: number, to: number, state: Op['state'] = 'done'): NumOp => ({
  t: 'num', cat: 'stress', actor, item: null, path: 'system.stress', from, to, min: 0, max: null, label: 'Stress', state,
});
const coverOp = (from: number, state: Op['state'] = 'done') => stressOp(B, from, from + 1, state);
const bladeData = { _id: 'blade1', name: 'Blade Set', type: 'gear', system: { item_id: 'blade-set', current: 0 } };
const ruinOp = (state: Op['state'] = 'done'): DeleteOp => ({ t: 'delete', cat: 'wear', actor: A, item: 'blade1', data: bladeData, label: 'ruined', state });
const usedOp: SetOp = { t: 'set', cat: 'stress', actor: A, item: 'talent1', path: 'system.used', from: false, to: true, label: 'used', state: 'done' };

const attack: AttackCard = {
  v: 1, kind: 'attack', actor: T, actorName: 'Titan', img: '', time: '12:00', ops: [], entry: 'grab', name: 'Grab', tier: 'strike',
  faces: [5, 6, 2], severity: 2, effects: [], critical: false, targets: [{ actor: A, name: 'Alice Soldier' }], reactions: [],
};
const call: CallCard = {
  v: 1, kind: 'call', actor: A, actorName: 'Alice Soldier', img: '', time: '12:00', ops: [], entry: 'climb', attribute: 'agility', label: 'Climb',
  circumstances: { id: 'standard', name: 'Standard' }, stakes: { id: 'stress', text: 'Stress' }, needs: 1, rolled: null,
};

interface Msg {
  author: string;
  card: Card;
}

let messages: Record<string, Msg>;
let stress: Record<string, number>;
let covering: Record<string, string[]>;
let items: Record<string, Record<string, { type: string }>>;
let ledger: Ledger;

const OWNERS: Record<string, string[]> = { [A]: ['alice'], [B]: ['bob'], [S]: ['bob'], [T]: [], [C]: ['carol'] };
const ACTORS: Record<string, { type: string; name: string }> = {
  [A]: { type: 'soldier', name: 'Alice Soldier' },
  [B]: { type: 'soldier', name: 'Bob Soldier' },
  [S]: { type: 'squadmate', name: 'Bob Squadmate' },
  [T]: { type: 'titan', name: 'Titan' },
  [C]: { type: 'soldier', name: 'Carol Soldier' },
};

function world(userId: string): GuardWorld {
  return {
    userId,
    owns: (uuid) => OWNERS[uuid]?.includes(userId) ?? false,
    actor: (uuid) => ACTORS[uuid] ?? null,
    message: (id) => (messages[id] ? { author: messages[id].author, card: messages[id].card } : null),
    value: (actor, item, path) => (item === null && path === 'system.stress' ? stress[actor] : undefined),
    item: (actor, item) => items[actor]?.[item] ?? null,
    covering: (actor) => covering[actor] ?? [],
  };
}

const alice = () => world('alice');
const bob = () => world('bob');

/** A card rewrite as the proxy would get it: the stored card with `change` applied. */
function rewrite(user: GuardWorld, id: string, change: (c: any) => void): string | null {
  const next = clone(messages[id].card);
  change(next);
  return checkCardRewrite(user, id, messages[id].card, next);
}

const update = (user: GuardWorld, ctx: OpContext | undefined, target: { actor: string; item?: string | null }, data: Record<string, unknown>) =>
  checkOpUpdate(user, ledger, ctx, { actor: target.actor, actorType: ACTORS[target.actor].type, item: target.item ?? null }, data);

beforeEach(() => {
  messages = {
    // Alice rolled her own soldier.
    roll: { author: 'alice', card: action() },
    // The GM rolled Alice's soldier; Bob Covered and the Push applied his Stress.
    gmRoll: { author: 'gm', card: action({ cover: { actor: B, name: 'Bob Soldier' }, pushes: 1, ops: [stressOp(A, 1, 2), coverOp(3), ruinOp(), usedOp] }) },
    attack: { author: 'gm', card: clone(attack) },
    call: { author: 'gm', card: clone(call) },
    dodge: { author: 'alice', card: action({ entry: 'dodge', name: 'Dodge', dice: { base: [6, 6, 1], gear: [], stress: [3] }, attack: { message: 'attack', name: 'Grab', severity: 2 } }) },
    answer: { author: 'alice', card: action({ entry: 'climb', call: 'call' }) },
  };
  stress = { [A]: 2, [B]: 4 };
  covering = { [B]: ['gmRoll'] };
  items = { [A]: { talent1: { type: 'talent' } }, [T]: { part1: { type: 'critical-injury' } } };
  ledger = new Map();
});

describe('GM proxy guard: abuses from the milestone 2 review (B1)', () => {
  it('refuses an ownership change after a self-Cover', () => {
    covering[B] = ['roll'];
    // Bob Covers Alice's roll with his own soldier: allowed.
    expect(rewrite(bob(), 'roll', (c) => (c.cover = { actor: B, name: 'Bob Soldier' }))).toBeNull();
    messages.roll.card = { ...messages.roll.card, cover: { actor: B, name: 'Bob Soldier' } } as ActionCard;
    // ...but that gives him nothing on Alice's soldier.
    expect(update(bob(), undefined, { actor: A }, { ownership: { bob: 3 } })).not.toBeNull();
    const forged: SetOp = { t: 'set', cat: 'stress', actor: A, item: null, path: 'ownership', from: {}, to: { bob: 3 }, label: '', state: 'pending' };
    expect(update(bob(), { message: 'roll', op: forged, dir: 1 }, { actor: A }, { ownership: { bob: 3 } })).not.toBeNull();
    // Nor with an op that is on the card, since he does not own the roller.
    messages.roll.card.ops = [stressOp(A, 2, 3, 'pending')];
    expect(update(bob(), { message: 'roll', op: messages.roll.card.ops[0], dir: 1 }, { actor: A }, { 'system.stress': 3 })).not.toBeNull();
  });

  it('refuses a Cover by a soldier the user does not own, by a Squadmate, or without the soldier’s agreement', () => {
    covering[A] = ['roll'];
    covering[S] = ['roll'];
    covering[C] = ['roll'];
    expect(rewrite(bob(), 'roll', (c) => (c.cover = { actor: C, name: 'Carol Soldier' }))).not.toBeNull();
    expect(rewrite(bob(), 'roll', (c) => (c.cover = { actor: A, name: 'Alice Soldier' }))).not.toBeNull();
    expect(rewrite(bob(), 'roll', (c) => (c.cover = { actor: S, name: 'Bob Squadmate' }))).not.toBeNull();
    expect(rewrite(bob(), 'roll', (c) => (c.cover = { actor: B, name: 'Bob Soldier' }))).not.toBeNull();
  });

  it('refuses arbitrary system.* writes, extra keys, and values the op does not give', () => {
    const ctx = { message: 'gmRoll', op: messages.gmRoll.card.ops[1], dir: -1 as const };
    expect(update(alice(), ctx, { actor: B }, { 'system.attributes.strength': 6 })).not.toBeNull();
    expect(update(alice(), ctx, { actor: B }, { 'system.stress': 3, 'system.down': true })).not.toBeNull();
    expect(update(alice(), ctx, { actor: B }, { 'system.stress': 0 })).not.toBeNull();
    // A forged op on a path no card writes, on the roller's own card.
    const forged: NumOp = { ...stressOp(A, 3, 6), path: 'system.attributes.strength' };
    messages.roll.card.ops = [forged];
    expect(update(alice(), { message: 'roll', op: forged, dir: 1 }, { actor: A }, { 'system.attributes.strength': 6 })).not.toBeNull();
  });

  it('refuses Stress on a comrade from an op the author forged on their own card', () => {
    // Alice writes a Cover and a 5-Stress op on her own message; Bob never agreed.
    messages.roll.card = action({ cover: { actor: B, name: 'Bob Soldier' }, ops: [stressOp(B, 4, 9, 'pending'), coverOp(4, 'pending')] });
    expect(update(alice(), { message: 'roll', op: stressOp(B, 4, 9, 'pending'), dir: 1 }, { actor: B }, { 'system.stress': 9 })).not.toBeNull();
    expect(update(alice(), { message: 'roll', op: coverOp(4, 'pending'), dir: 1 }, { actor: B }, { 'system.stress': 5 })).not.toBeNull();
  });

  it('refuses a replayed Cover cost', () => {
    const ctx = { message: 'gmRoll', op: messages.gmRoll.card.ops[1], dir: -1 as const };
    expect(update(alice(), ctx, { actor: B }, { 'system.stress': 3 })).toBeNull();
    recordRun(ledger, messages.gmRoll.card, ctx);
    stress[B] = 3;
    expect(update(alice(), ctx, { actor: B }, { 'system.stress': 2 })).not.toBeNull();
  });

  it('refuses Titan item create and delete from an attack card', () => {
    const titanOp: DeleteOp = { t: 'delete', cat: 'wear', actor: T, item: 'part1', data: { _id: 'part1', type: 'critical-injury' }, label: '', state: 'done' };
    // Not on the attack card.
    expect(checkDeleteItem(alice(), ledger, { message: 'attack', op: titanOp, dir: 1 }, { actor: T, item: 'part1', type: 'critical-injury' })).not.toBeNull();
    expect(checkCreateItem(alice(), ledger, { message: 'attack', op: { ...titanOp, item: 'x1', data: { _id: 'x1', type: 'critical-injury' } }, dir: -1 }, T, { _id: 'x1', type: 'critical-injury' })).not.toBeNull();
    // Recorded on the attack card by a forged rewrite: the rewrite itself is refused.
    expect(rewrite(alice(), 'attack', (c) => (c.ops = [titanOp]))).not.toBeNull();
    // Even if it were there, Alice does not own the Titan the card is about.
    messages.attack.card.ops = [titanOp];
    expect(checkDeleteItem(alice(), ledger, { message: 'attack', op: titanOp, dir: 1 }, { actor: T, item: 'part1', type: 'critical-injury' })).not.toBeNull();
    // And a recorded op on her own roll cannot reach the Titan or another item type.
    messages.roll.card.ops = [titanOp];
    expect(checkDeleteItem(alice(), ledger, { message: 'roll', op: titanOp, dir: 1 }, { actor: T, item: 'part1', type: 'critical-injury' })).not.toBeNull();
    const talentOp: DeleteOp = { ...ruinOp(), item: 'talent1', data: { _id: 'talent1', type: 'talent' } };
    messages.roll.card.ops = [talentOp];
    expect(checkDeleteItem(alice(), ledger, { message: 'roll', op: talentOp, dir: 1 }, { actor: A, item: 'talent1', type: 'talent' })).not.toBeNull();
  });

  it('refuses card rewrites beyond Cover, Reactions, a call’s answer and op state', () => {
    expect(rewrite(bob(), 'attack', (c) => c.targets.push({ actor: B, name: 'Bob Soldier' }))).not.toBeNull();
    expect(rewrite(bob(), 'roll', (c) => (c.dice.base = [6, 6, 6]))).not.toBeNull();
    expect(rewrite(alice(), 'gmRoll', (c) => c.ops.push(coverOp(4, 'pending')))).not.toBeNull();
    expect(rewrite(alice(), 'gmRoll', (c) => (c.ops[1].to = 9))).not.toBeNull();
    // Op state belongs to the roller's owner.
    expect(rewrite(bob(), 'gmRoll', (c) => (c.ops[0].state = 'undone'))).not.toBeNull();
    // A reaction that does not match its dodge, or someone else's.
    expect(rewrite(alice(), 'attack', (c) => c.reactions.push({ actor: A, name: 'Alice Soldier', successes: 0, message: 'dodge' }))).not.toBeNull();
    expect(rewrite(bob(), 'attack', (c) => c.reactions.push({ actor: A, name: 'Alice Soldier', successes: 2, message: 'dodge' }))).not.toBeNull();
    // A call answered by a roll that is not for it.
    expect(rewrite(alice(), 'call', (c) => (c.rolled = 'roll'))).not.toBeNull();
    expect(rewrite(alice(), 'roll', (c) => (c.kind = 'call'))).not.toBeNull();
  });
});

describe('GM proxy guard: the legitimate flows still pass', () => {
  it('Cover: a comrade Covers with their own soldier, and withdraws', () => {
    covering[B] = ['roll'];
    expect(rewrite(bob(), 'roll', (c) => (c.cover = { actor: B, name: 'Bob Soldier' }))).toBeNull();
    messages.roll.card = action({ cover: { actor: B, name: 'Bob Soldier' } });
    expect(rewrite(bob(), 'roll', (c) => (c.cover = null))).toBeNull();
  });

  it('Push: the roller’s owner gives the Covering comrade 1 Stress, once', () => {
    covering[B] = ['roll'];
    messages.roll.card = action({ cover: { actor: B, name: 'Bob Soldier' } });
    const ctx = { message: 'roll', op: coverOp(4, 'pending'), dir: 1 as const };
    expect(update(alice(), ctx, { actor: B }, { 'system.stress': 5 })).toBeNull();
    recordRun(ledger, messages.roll.card, ctx);
    expect(update(alice(), ctx, { actor: B }, { 'system.stress': 6 })).not.toBeNull();
  });

  it('Undo and Redo: op state on a GM-posted card, and the comrade’s Stress back and forth', () => {
    expect(rewrite(alice(), 'gmRoll', (c) => c.ops.forEach((o: Op) => (o.state = 'undone')))).toBeNull();
    const undo = { message: 'gmRoll', op: messages.gmRoll.card.ops[1], dir: -1 as const };
    expect(update(alice(), undo, { actor: B }, { 'system.stress': 3 })).toBeNull();
    recordRun(ledger, messages.gmRoll.card, undo);
    stress[B] = 3;
    const redo = { ...undo, dir: 1 as const };
    expect(update(alice(), redo, { actor: B }, { 'system.stress': 4 })).toBeNull();
    // Undo after the comrade withdrew still gives the Stress back.
    recordRun(ledger, messages.gmRoll.card, redo);
    covering[B] = [];
    stress[B] = 4;
    expect(update(alice(), undo, { actor: B }, { 'system.stress': 3 })).toBeNull();
  });

  it('Undo and Redo: a ruined gear item and a Talent use on the roller', () => {
    const ruin = messages.gmRoll.card.ops[2];
    expect(checkCreateItem(alice(), ledger, { message: 'gmRoll', op: ruin, dir: -1 }, A, clone(bladeData))).toBeNull();
    items[A].blade1 = { type: 'gear' };
    expect(checkDeleteItem(alice(), ledger, { message: 'gmRoll', op: ruin, dir: 1 }, { actor: A, item: 'blade1', type: 'gear' })).toBeNull();
    expect(update(alice(), { message: 'gmRoll', op: usedOp, dir: -1 }, { actor: A, item: 'talent1' }, { 'system.used': false })).toBeNull();
  });

  it('Dodge: the dodger records and rewrites their reaction on the attack card', () => {
    const reaction = { actor: A, name: 'Alice Soldier', successes: 2, message: 'dodge' };
    expect(rewrite(alice(), 'attack', (c) => c.reactions.push(reaction))).toBeNull();
    (messages.attack.card as AttackCard).reactions = [reaction];
    (messages.dodge.card as ActionCard).dice.base = [6, 6, 6];
    expect(rewrite(alice(), 'attack', (c) => (c.reactions = [{ ...reaction, successes: 3 }]))).toBeNull();
  });

  it('Called roll: the answer is recorded on the GM’s call card', () => {
    expect(rewrite(alice(), 'call', (c) => (c.rolled = 'answer'))).toBeNull();
  });
});
