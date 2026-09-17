/**
 * Reads the running engagement into the plain shapes the rules take (src/rules/engagement/types.ts):
 * the Combat's system data, its card combatants, the soldiers' actors, and the Titans' token actors.
 */
import { forcedTargets, moveKinds } from '../rules/engagement/retreat.ts';
import type { AnchorRating, Position, Snapshot, SoldierState, TitanRow } from '../rules/engagement/types.ts';
import type { BodyPart } from '../rules/titan.ts';

export const E = () => CONFIG.WOF.engagement as import('../../tools/config-data.ts').EngagementConfig;

export function ratingOf(id: string): AnchorRating | null {
  return (E().ratings.find((r) => r.id === id) as AnchorRating | undefined) ?? null;
}

export const isDead = (actor: any) => !!actor?.statuses?.has?.('dead');

/** The Titan token's document for a tracker row. */
export function titanToken(combat: any, key: string): any | null {
  return combat?.scene?.tokens?.get(key) ?? game.scenes?.viewed?.tokens?.get(key) ?? null;
}

export const titanActor = (combat: any, key: string): any | null => titanToken(combat, key)?.actor ?? null;

export function ladderRungs(ladderId: string): string[] {
  const ladders = CONFIG.WOF.attentionLadders as { id: string; rungs: string[] }[];
  return [...(ladders.find((l) => l.id === ladderId)?.rungs ?? ladders[0].rungs)];
}

export function soldierState(actor: any): SoldierState {
  const s = actor.system;
  const src = s.toObject ? s.toObject() : s;
  const items = [...(actor.items ?? [])];
  const odm = items.find((i: any) => i.type === 'gear' && i.system.subtype === 'odm');
  const positions: Record<string, Position> = {};
  if (!src.positions.left) for (const e of src.positions.entries as { titan: string; position: Position }[]) if (e.titan) positions[e.titan] = e.position;
  return {
    id: actor.id,
    name: actor.name,
    pc: actor.type === 'soldier',
    alive: !isDead(actor),
    down: !!(src.down || s.derived?.down_by_rule),
    left: !!src.positions.left,
    carriedBy: src.carried_by || null,
    carrying: src.carrying || null,
    pinned: src.pinned?.active ? { body: src.pinned.body, bodyPin: src.pinned.limb === 'body' } : null,
    mounted: items.some((i: any) => i.type === 'gear' && i.system.subtype === 'horse' && i.system.mounted),
    airborne: !!src.airborne,
    odmHad: !!odm && odm.system.current > 0 && src.gas_rating > 0,
    positions,
    untreated: items.filter((i: any) => i.type === 'critical-injury' && !i.system.treated).length,
  };
}

export function titanRow(combat: any, row: any): TitanRow {
  const actor = titanActor(combat, row.key);
  const sys = actor?.system;
  return {
    key: row.key,
    label: row.label,
    status: row.status,
    tempo: sys?.tempo ?? 1,
    ladder: ladderRungs(sys?.attention_ladder ?? 'standard'),
    holder: sys?.attention_holder ?? '',
    grab: row.grab ? { ...row.grab } : null,
    decoy: row.decoy ? { ...row.decoy } : null,
    decoysInRow: row.decoysInRow ?? 0,
    flags: { hooked: [...row.flags.hooked], hurt: [...row.flags.hurt], loud: [...row.flags.loud] },
    grounded: !!sys?.grounded,
    entered: row.entered,
  };
}

export const partsOf = (actor: any): BodyPart[] => (actor?.system?.toObject?.().body_parts ?? []) as BodyPart[];

export function soldierActors(combat: any): any[] {
  return (combat.system.soldiers as string[]).map((id) => game.actors.get(id)).filter(Boolean);
}

export function cardsOf(combat: any): { cards: Record<string, number | null>; titanCards: Record<string, number[]> } {
  const cards: Record<string, number | null> = {};
  const titanCards: Record<string, number[]> = {};
  for (const c of combat.combatants) {
    const kind = c.system?.kind;
    const card = Number.isFinite(c.initiative) ? (c.initiative as number) : null;
    if (kind === 'soldier') cards[c.actorId] = card;
    else if (kind === 'wing') cards[c.actorId] ??= null;
    else if (kind === 'titan' && card !== null) (titanCards[c.system.titan] ??= []).push(card);
  }
  for (const k of Object.keys(titanCards)) titanCards[k].sort((a, b) => a - b);
  return { cards, titanCards };
}

export const wingsOf = (combat: any): Record<string, string> => Object.fromEntries((combat.system.wings ?? []).map((w: any) => [w.mate, w.pc]));

export function snapshot(combat: any): Snapshot {
  const sys = combat.system;
  const { cards, titanCards } = cardsOf(combat);
  const used = [...sys.tactics.used];
  return {
    combat: combat.id,
    mode: sys.mode,
    step: sys.step,
    round: combat.round,
    anchor: ratingOf(sys.anchor),
    soldiers: soldierActors(combat).map(soldierState),
    titans: (sys.titans as any[]).map((r) => titanRow(combat, r)),
    wings: wingsOf(combat),
    cards,
    titanCards,
    swapped: (sys.swaps as any[]).flatMap((s) => [s.a, s.b]),
    proposal: sys.proposal ? { ...sys.proposal } : null,
    retreat: !!sys.retreat.active,
    wingsSet: sys.wingsSet,
    wingsOpen: sys.wingsOpen,
    reassign: [...sys.reassign],
    tactics: { held: [...sys.tactics.held], used },
    cloaks: [...sys.cloaks],
  };
}

/** Which Focus Titan holds a soldier Grabbed (its label), or null. */
export function grabbedBy(snap: Snapshot, id: string): string | null {
  return snap.titans.find((t) => t.status === 'focus' && t.grab?.soldier === id)?.label ?? null;
}

/** During a retreat, where a soldier's forced move may go relative to one body (retreat.ts), or null. */
export function forcedFor(combat: any, snap: Snapshot, s: SoldierState, label: string): Position[] | null {
  if (!snap.retreat || !snap.anchor) return null;
  const clock = combat.system.retreat;
  return forcedTargets(s, label, { soldiers: snap.soldiers, titans: snap.titans, rating: snap.anchor, grabbedBy: (id) => grabbedBy(snap, id), clock: { length: clock.length, filled: clock.filled, active: clock.active, began: clock.began }, round: combat.round }, moveKinds(s));
}
