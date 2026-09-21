/**
 * Reads the running engagement into the plain shapes the rules take (src/rules/engagement/types.ts):
 * the Combat's system data, its card combatants, the soldiers' actors, and the Titans' token actors.
 */
import { configureFrenzy } from '../rules/engagement/cards.ts';
import { configureSpends } from '../rules/engagement/momentum.ts';
import { configureRatings } from '../rules/engagement/positions.ts';
import { reconcilePin } from '../rules/engagement/field.ts';
import type { AnchorRating, Snapshot, SoldierState, TitanRow } from '../rules/engagement/types.ts';
import { configureZones, derivePositions, setMissingReporter, withDust, type Attachment, type AttachmentKind, type FieldState, type ZoneEffectId, type ZoneId } from '../rules/engagement/zones.ts';
import type { BodyPart } from '../rules/titan.ts';

export const E = () => CONFIG.WOF.engagement as import('../../tools/config-data.ts').EngagementConfig;

let configured = false;
const reported = new Set<string>();
/**
 * A lookup that missed (review m3): said once in the console and, for the GM, as a warning, so a bad
 * row never turns silently into a Titan that never strides or a wreck that does nothing.
 */
export function warnMissing(what: string): void {
  if (reported.has(what)) return;
  reported.add(what);
  console.warn(`wings-of-freedom | the engagement tracker found no ${what}`);
  if ((globalThis as any).game?.user?.isGM) (globalThis as any).ui?.notifications?.warn(game.i18n.format('WOF.Tracker.missing', { what }));
}

/** A Titan row's zone, reported when it is missing. */
export function rowZone(row: { zone?: number | null; label?: string }): number {
  if (typeof row?.zone === 'number' && row.zone > 0) return row.zone;
  warnMissing(`zone for Titan ${row?.label ?? '?'}`);
  return 0;
}
/** The zone rules and the rating rows the pure rules read, from CONFIG.WOF.engagement (once). */
export function ensureRules(): void {
  if (configured || !(globalThis as any).CONFIG?.WOF?.engagement) return;
  configureZones(E().zones);
  setMissingReporter(warnMissing);
  configureRatings(E().ratings as AnchorRating[]);
  configureFrenzy(E().frenzy);
  configureSpends(E().momentum.spends);
  configured = true;
}

// ---------------------------------------------------------------- where each soldier is (decision batch 16)

/** One soldier's record on the engagement (combat.system.placements). */
export interface PlacementRow {
  soldier: string;
  zone: ZoneId | null;
  kind: AttachmentKind;
  body: string;
  horseZone: ZoneId | null;
  since: number;
}

export const placementRows = (combat: any): PlacementRow[] => ((combat?.system?.toObject?.() ?? combat?.system)?.placements ?? []) as PlacementRow[];

export const attachmentOf = (row: Pick<PlacementRow, 'kind' | 'body'> | undefined): Attachment => ({ kind: row?.kind ?? 'ground', body: row?.body || null });

/** The field as the engagement holds it, with each zone's effects read (steam over a corpse, dust below the start rating). */
export function fieldOf(combat: any, corpseZones: readonly ZoneId[] = []): FieldState | null {
  const sys = combat?.system?.toObject?.() ?? combat?.system;
  const f = sys?.field;
  if (!f || !Array.isArray(f.zones) || !f.zones.length) return null;
  return {
    size: f.size,
    rating: f.rating,
    centre: f.centre,
    squadStart: f.squadStart,
    zones: (f.zones as any[]).map((z) => {
      const zone = { n: z.n, q: z.q, r: z.r, rating: z.rating, start: z.start, graceUsed: !!z.graceUsed, effects: [...(z.effects ?? [])] as ZoneEffectId[] };
      let effects = withDust(zone);
      if (corpseZones.includes(z.n) && !effects.includes('steam')) effects = [...effects, 'steam'];
      return { ...zone, effects };
    }),
  };
}

/** A Titan's board figure: the Abnormal's own id, else its Size Class (art.ts, boardTitan). */
export function titanIdOf(actor: any): string | null {
  const source: string = actor?._stats?.compendiumSource ?? actor?.flags?.core?.sourceId ?? '';
  const ids = (CONFIG.WOF?.packIds?.titans ?? {}) as Record<string, string>;
  const docId = source.split('.').pop() ?? '';
  return Object.entries(ids).find(([, v]) => v === docId)?.[0] ?? null;
}

/** A Titan's Stride as its stat block gives it: the actor's own value, else its id's, else its Size Class's (size-classes.yaml, stride). */
export function strideOfActor(actor: any): number {
  const own = actor?.system?.stride;
  if (typeof own === 'number') return own;
  const cfg = E().stride;
  const id = titanIdOf(actor);
  if (id && cfg.byTitan[id] !== undefined) return cfg.byTitan[id];
  const bySize = cfg.bySize[actor?.system?.size_class ?? ''];
  if (bySize !== undefined) return bySize;
  warnMissing(`Stride for ${actor?.name ?? 'a Titan'} (Size Class "${actor?.system?.size_class ?? ''}")`);
  return 0;
}

function figureOf(actor: any): string {
  const id = titanIdOf(actor);
  if (actor?.system?.abnormal && id) return id;
  return actor?.system?.size_class ?? 'medium';
}

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

/**
 * One soldier as the rules read them. `place` is their record on a Titan Engagement; without one they
 * are off field. Positions are filled by snapshot(), derived from the zones (derivePositions).
 */
export function soldierState(actor: any, place?: PlacementRow | null, titanMode = false): SoldierState {
  const s = actor.system;
  const src = s.toObject ? s.toObject() : s;
  const items = [...(actor.items ?? [])];
  const odm = items.find((i: any) => i.type === 'gear' && i.system.subtype === 'odm');
  const zone = place ? place.zone : null;
  const pinned = src.pinned?.active ? { body: src.pinned.body, bodyPin: src.pinned.limb === 'body' } : null;
  return {
    id: actor.id,
    name: actor.name,
    pc: actor.type === 'soldier',
    alive: !isDead(actor),
    down: !!(src.down || s.derived?.down_by_rule),
    // In a Titan Engagement a soldier off field has left it (zones.yaml, off_field).
    left: titanMode ? zone === null : !!src.positions?.left,
    carriedBy: src.carried_by || null,
    carrying: src.carrying || null,
    pinned,
    mounted: items.some((i: any) => i.type === 'gear' && i.system.subtype === 'horse' && i.system.mounted),
    airborne: !!src.airborne,
    odmHad: !!odm && odm.system.current > 0 && src.gas_rating > 0,
    zone,
    // A Pin cleared on the sheet frees the placement too (16-23; field.ts, reconcilePin).
    attachment: reconcilePin(attachmentOf(place ?? undefined), pinned),
    horseZone: place?.horseZone ?? null,
    positions: {},
    momentum: src.momentum ?? 0,
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
    // Frenzy rises 1 at the end of every third round and feeds the behavior roll
    // (data/engagement/round.yaml, end_steps, frenzy; titan-format.yaml).
    frenzy: row.frenzy ?? 0,
    zone: sys ? rowZone(row) : (row.zone ?? 0),
    stride: strideOfActor(actor),
    figure: figureOf(actor),
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

/**
 * The soldiers on the engagement with their placements: a carried soldier's zone and attachment are
 * their carrier's (16-8), and every Position is derived from the zones (16-9).
 */
export function soldiersOf(combat: any, titans: readonly TitanRow[]): SoldierState[] {
  const titanMode = combat.system.mode === 'titan';
  const rows = placementRows(combat);
  const list = soldierActors(combat).map((a) => soldierState(a, rows.find((r) => r.soldier === a.id) ?? null, titanMode));
  const byId = new Map(list.map((s) => [s.id, s]));
  const bodies = titans.filter((t) => t.status === 'focus' || t.status === 'corpse');
  return list.map((s) => {
    const carrier = s.carriedBy ? byId.get(s.carriedBy) : undefined;
    const placed = carrier && titanMode ? { ...s, zone: carrier.zone, attachment: { ...carrier.attachment }, left: carrier.left } : s;
    return { ...placed, positions: titanMode ? derivePositions(placed, bodies) : {} };
  });
}

export function snapshot(combat: any): Snapshot {
  ensureRules();
  const sys = combat.system;
  const { cards, titanCards } = cardsOf(combat);
  const used = [...sys.tactics.used];
  const titans = (sys.titans as any[]).map((r) => titanRow(combat, r));
  const field = sys.mode === 'titan' ? fieldOf(combat, titans.filter((t) => t.status === 'corpse').map((t) => t.zone)) : null;
  return {
    combat: combat.id,
    mode: sys.mode,
    step: sys.step,
    round: combat.round,
    anchor: ratingOf(field?.rating ?? sys.anchor),
    field,
    leftItems: soldierActors(combat)
      .map((a) => ({ soldier: a.id as string, zone: a.system.left_at?.zone ?? null, items: [...(a.system.left_at?.items ?? [])] as string[] }))
      .filter((x) => x.zone !== null && x.items.length) as Snapshot['leftItems'],
    arrivals: Object.fromEntries(placementRows(combat).filter((r) => r.kind === 'on-body' || r.kind === 'blind-spot' || r.kind === 'grabbed').map((r) => [r.soldier, r.since ?? 0])),
    odmUsed: [...(sys.odmUsed ?? [])],
    movesSpent: [...(sys.movesSpent ?? [])],
    soldiers: soldiersOf(combat, titans),
    titans,
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

/** A soldier's state read with their placement on this engagement, Positions derived. */
export function soldierIn(combat: any, id: string): SoldierState | null {
  return snapshot(combat).soldiers.find((s) => s.id === id) ?? null;
}
