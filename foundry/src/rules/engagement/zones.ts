/**
 * The field, its zones, and the attachments a soldier holds in them (data/engagement/zones.yaml;
 * data/engagement/anchor-ratings.yaml, ratings; ADR-0029; decision batch 16, 16-2 to 16-33). Pure and
 * unit tested. Positions are never recorded: every rule reads them derived from a soldier's zone and
 * attachment and each body's zone (derivePositions).
 *
 * The shapes and names here are the contract of docs/playtest/feedback/round-3/IMPLEMENTATION-PLAN-E.md,
 * section 5.3, which the engagement board (src/board/) reads. The rules values come from the data
 * through configureZones (tools/config-data.ts, engagementConfig, zones); ZONE_DEFAULTS holds the same
 * values so the functions work before the config is read, and a test keeps the two equal.
 */
import type { Position, SoldierState, TitanRow } from './types.ts';

export type ZoneId = number;
export type FieldSize = 'skirmish' | 'standard' | 'set-piece';
export type AttachmentKind = 'ground' | 'anchored' | 'on-body' | 'blind-spot' | 'grabbed' | 'pinned';
/** body: a TitanRow label (a Focus Titan or a corpse), or null for an attachment that names none. */
export interface Attachment {
  kind: AttachmentKind;
  body: string | null;
}
export type ZoneEffectId = 'steam' | 'dust' | 'fire';
export interface ZoneCell {
  n: ZoneId;
  q: number;
  r: number;
}
export interface ZoneState extends ZoneCell {
  rating: string;
  /** The rating the zone had when the field was generated (16-4); the board draws its tile from it. */
  start: string;
  /** The Sparse grace is spent in this zone (16-5, 16-20). */
  graceUsed: boolean;
  effects: ZoneEffectId[];
}
export interface FieldState {
  size: FieldSize;
  /** The field rating (16-6). */
  rating: string;
  centre: ZoneId;
  squadStart: ZoneId;
  zones: ZoneState[];
}
/** zone null: off field. */
export interface Placement {
  zone: ZoneId | null;
  attachment: Attachment;
}

export const FIELD_SIZES: readonly FieldSize[] = ['skirmish', 'standard', 'set-piece'];
export const ATTACHMENT_KINDS: readonly AttachmentKind[] = ['ground', 'anchored', 'on-body', 'blind-spot', 'grabbed', 'pinned'];
export const ZONE_EFFECTS: readonly ZoneEffectId[] = ['steam', 'dust', 'fire'];

// ---------------------------------------------------------------- the rules the data gives

export interface ZoneRating {
  id: string;
  anchors: number;
  carryCost: number;
  sparser: string;
  denser: string;
}

export interface ZoneLayout {
  centre: ZoneId;
  squadStart: ZoneId;
  zones: ZoneCell[];
}

export interface ZoneRules {
  offsets: [number, number][];
  layouts: Record<FieldSize, ZoneLayout>;
  defaultSize: FieldSize;
  ratings: ZoneRating[];
  flight: { firstStepCost: number; offField: number; attachStep: number; carryLimit: number; endsFreeInOpen: boolean };
  mounted: { zoneSteps: number; stopsAtTitan: boolean };
  /** engagement-setup.yaml, zone_terrain (OQ-202). */
  terrain: { results: number[]; rating: 'sparser' | 'field' | 'denser' }[];
}

const cells = (rows: [number, number][]): ZoneCell[] => rows.map(([q, r], i) => ({ n: i + 1, q, r }));

/** The values of zones.yaml, anchor-ratings.yaml, and engagement-setup.yaml as decision batch 16 set them. */
export const ZONE_DEFAULTS: ZoneRules = {
  offsets: [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ],
  layouts: {
    skirmish: { centre: 4, squadStart: 5, zones: cells([[-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0]]) },
    standard: {
      centre: 7,
      squadStart: 8,
      zones: cells([[-2, 0], [-2, 1], [-2, 2], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [2, -2], [2, -1], [2, 0]]),
    },
    'set-piece': {
      centre: 10,
      squadStart: 11,
      zones: cells([
        [-2, 0], [-2, 1], [-2, 2],
        [-1, -1], [-1, 0], [-1, 1], [-1, 2],
        [0, -2], [0, -1], [0, 0], [0, 1], [0, 2],
        [1, -2], [1, -1], [1, 0], [1, 1],
        [2, -2], [2, -1], [2, 0],
      ]),
    },
  },
  defaultSize: 'standard',
  ratings: [
    { id: 'open', anchors: 0, carryCost: 2, sparser: 'open', denser: 'sparse' },
    { id: 'sparse', anchors: 1, carryCost: 1, sparser: 'open', denser: 'wooded' },
    { id: 'wooded', anchors: 2, carryCost: 0, sparser: 'sparse', denser: 'giant-forest' },
    { id: 'urban', anchors: 3, carryCost: 0, sparser: 'wooded', denser: 'urban' },
    { id: 'giant-forest', anchors: 3, carryCost: 0, sparser: 'wooded', denser: 'giant-forest' },
  ],
  flight: { firstStepCost: 0, offField: 1, attachStep: 1, carryLimit: 2, endsFreeInOpen: false },
  mounted: { zoneSteps: 2, stopsAtTitan: true },
  terrain: [
    { results: [1], rating: 'sparser' },
    { results: [2, 3, 4, 5], rating: 'field' },
    { results: [6], rating: 'denser' },
  ],
};

let rules: ZoneRules = ZONE_DEFAULTS;

/** Reads the data's values (tools/config-data.ts, engagementConfig, zones). */
export function configureZones(next: ZoneRules): void {
  rules = next;
}

export const zoneRules = (): ZoneRules => rules;

export const ratingRule = (id: string): ZoneRating => rules.ratings.find((r) => r.id === id) ?? { id, anchors: 0, carryCost: 0, sparser: id, denser: id };

// ---------------------------------------------------------------- the field's shape (16-2)

export function layoutOf(size: FieldSize): { centre: ZoneId; squadStart: ZoneId; zones: ZoneCell[] } {
  const l = rules.layouts[size] ?? rules.layouts[rules.defaultSize];
  return { centre: l.centre, squadStart: l.squadStart, zones: l.zones.map((c) => ({ ...c })) };
}

export const zoneOf = (field: FieldState, n: ZoneId): ZoneState | undefined => field.zones.find((z) => z.n === n);

const hexDistance = (a: ZoneCell, b: ZoneCell) => {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
};

/** Zones between two zones: (|dq| + |dr| + |dq + dr|) / 2. Infinity when either is not on the field. */
export function zoneDistance(field: FieldState, a: ZoneId, b: ZoneId): number {
  const za = zoneOf(field, a);
  const zb = zoneOf(field, b);
  return za && zb ? hexDistance(za, zb) : Infinity;
}

/** The zones adjacent to a zone that are on the field, ascending. */
export function neighbours(field: FieldState, n: ZoneId): ZoneId[] {
  const z = zoneOf(field, n);
  if (!z) return [];
  const out: ZoneId[] = [];
  for (const [dq, dr] of rules.offsets) {
    const m = field.zones.find((c) => c.q === z.q + dq && c.r === z.r + dr);
    if (m) out.push(m.n);
  }
  return out.sort((a, b) => a - b);
}

/** An edge zone has fewer than six neighbours on the field (edge_zone). */
export const isEdge = (field: FieldState, n: ZoneId): boolean => !!zoneOf(field, n) && neighbours(field, n).length < rules.offsets.length;

/** A zone's ring: its distance from the centre zone. */
export const ringOf = (field: FieldState, n: ZoneId): number => zoneDistance(field, field.centre, n);

// ---------------------------------------------------------------- attachments and the derivation (16-8, 16-9)

/** Free: ground or anchored, the attachments from which a zone step is made. */
export const isFree = (a: Attachment): boolean => a.kind === 'ground' || a.kind === 'anchored';

export const GROUND: Attachment = { kind: 'ground', body: null };
export const ANCHORED: Attachment = { kind: 'anchored', body: null };

/** The detach rule (16-8): anchored if airborne, ground if not. */
export const detached = (airborne: boolean): Attachment => (airborne ? { ...ANCHORED } : { ...GROUND });

type Placed = Pick<SoldierState, 'zone' | 'attachment' | 'alive' | 'left'>;

/**
 * A soldier's Position relative to one body (derivation, order): on-body if their attachment is
 * on-body or grabbed naming it; blind-spot if blind-spot naming it; in-reach if pinned naming it or in
 * its zone; distant in another zone. None off field or dead.
 */
export function derivePosition(s: Placed, body: Pick<TitanRow, 'label' | 'zone'>): Position | undefined {
  if (!s.alive || s.left || s.zone === null || s.zone === undefined) return undefined;
  const a = s.attachment;
  if (a.body === body.label) {
    if (a.kind === 'on-body' || a.kind === 'grabbed') return 'on-body';
    if (a.kind === 'blind-spot') return 'blind-spot';
    if (a.kind === 'pinned') return 'in-reach';
  }
  return s.zone === body.zone ? 'in-reach' : 'distant';
}

/** Every Position a soldier holds, by body label (every Focus Titan and corpse in the list). */
export function derivePositions(s: Placed, bodies: readonly TitanRow[]): Record<string, Position> {
  const out: Record<string, Position> = {};
  for (const b of bodies) {
    const p = derivePosition(s, b);
    if (p !== undefined) out[b.label] = p;
  }
  return out;
}

/** between_soldiers: two soldiers hold the same Position when they are in the same zone. */
export const sameZone = (a: Pick<SoldierState, 'zone' | 'left'>, b: Pick<SoldierState, 'zone' | 'left'>): boolean =>
  a.left || b.left ? a.left && b.left : a.zone !== null && a.zone === b.zone;

/** between_soldiers: within n Position steps reads within n zones (one step: the same or an adjacent zone). */
export function withinZones(field: FieldState | null, a: Pick<SoldierState, 'zone' | 'left'>, b: Pick<SoldierState, 'zone' | 'left'>, n = 1): boolean {
  if (a.left || b.left) return a.left && b.left;
  if (a.zone === null || b.zone === null || !field) return false;
  return zoneDistance(field, a.zone, b.zone) <= n;
}

// ---------------------------------------------------------------- Momentum, Carry, and crossing (16-13, 16-14, 16-15)

/** A soldier's Momentum cap is the anchors of the zone they are in (anchor-ratings.yaml, momentum, cap). */
export function momentumCapAt(field: FieldState, n: ZoneId): number {
  const z = zoneOf(field, n);
  return z ? Math.max(0, ratingRule(z.rating).anchors) : 0;
}

/** The Carry cost of one step of a Flight past its first: into a zone, off field, or an attachment step. */
export function carryCostInto(field: FieldState, to: ZoneId | 'off' | 'attach'): number {
  if (to === 'off') return rules.flight.offField;
  if (to === 'attach') return rules.flight.attachStep;
  const z = zoneOf(field, to);
  return z ? ratingRule(z.rating).carryCost : 0;
}

/**
 * The zones a move crosses (crossing_flag): each zone it enters and leaves again, never the zone it
 * starts in or the zone it ends in. `entered` is the zone after each step (an attachment step repeats
 * its zone; null is off field). Ascending.
 */
export function crossedZones(start: ZoneId, entered: readonly (ZoneId | null)[]): ZoneId[] {
  if (!entered.length) return [];
  const end = entered[entered.length - 1];
  const out = new Set<ZoneId>();
  for (const z of entered.slice(0, -1)) if (z !== null && z !== start && z !== end) out.add(z);
  return [...out].sort((a, b) => a - b);
}

// ---------------------------------------------------------------- a promoted Titan's entry zone (16-29)

/**
 * entry_zone: the edge zone that holds no soldier, farthest from the nearest soldier, then the
 * lowest-numbered; if every edge zone holds one, the edge zone holding the fewest, then the lowest.
 */
export function entryZone(field: FieldState, soldierZones: readonly ZoneId[]): ZoneId {
  const edges = field.zones.map((z) => z.n).filter((n) => isEdge(field, n)).sort((a, b) => a - b);
  const count = (n: ZoneId) => soldierZones.filter((z) => z === n).length;
  const empty = edges.filter((n) => count(n) === 0);
  if (empty.length) {
    const nearest = (n: ZoneId) => (soldierZones.length ? Math.min(...soldierZones.map((z) => zoneDistance(field, n, z))) : Infinity);
    let best = empty[0];
    for (const n of empty) if (nearest(n) > nearest(best)) best = n;
    return best;
  }
  let best = edges[0];
  for (const n of edges) if (count(n) < count(best)) best = n;
  return best ?? field.centre;
}

// ---------------------------------------------------------------- wrecking (16-20, 16-5)

/**
 * A wreck on one zone: its rating takes one step toward Open (its rating's sparser). The first wreck a
 * zone takes while it is Sparse does nothing, once per zone; an Open zone takes no further step.
 */
export function wreckZone(field: FieldState, n: ZoneId): { field: FieldState; from: string; to: string; graced: boolean } {
  const z = zoneOf(field, n);
  if (!z) return { field, from: '', to: '', graced: false };
  const from = z.rating;
  let next: ZoneState;
  let graced = false;
  if (from === 'sparse' && !z.graceUsed) {
    graced = true;
    next = { ...z, graceUsed: true };
  } else {
    next = { ...z, rating: ratingRule(from).sparser };
  }
  next = { ...next, effects: withDust(next) };
  return { field: { ...field, zones: field.zones.map((x) => (x.n === n ? next : x)) }, from, to: next.rating, graced };
}

/** A zone whose rating is below its start rating carries dust (effects, dust). */
export function withDust(z: ZoneState): ZoneEffectId[] {
  const below = ratingRule(z.rating).anchors < ratingRule(z.start).anchors;
  const rest = z.effects.filter((e) => e !== 'dust');
  return below ? [...rest, 'dust'] : rest;
}

/** A zone's rating set by the GM's Direct Control (ADR-0028): its start rating is kept. */
export function setRating(field: FieldState, n: ZoneId, rating: string): FieldState {
  return { ...field, zones: field.zones.map((z) => (z.n === n ? { ...z, rating, effects: withDust({ ...z, rating }) } : z)) };
}

// ---------------------------------------------------------------- field generation (16-6)

/**
 * engagement-setup.yaml, steps: the layout of the size, then the terrain mix. The centre zone and the
 * Squad's start zone take the field rating; every other zone, in number order, rolls D6 on
 * zone_terrain. A zone the starting rule or the GM's framing names takes that rating and rolls nothing.
 */
export function generateField(size: FieldSize, rating: string, named: Readonly<Record<number, string>>, d6: () => number): FieldState {
  const l = layoutOf(size);
  const rr = ratingRule(rating);
  const zones: ZoneState[] = l.zones.map((c) => {
    let r: string;
    if (named[c.n]) r = named[c.n];
    else if (c.n === l.centre || c.n === l.squadStart) r = rating;
    else {
      const roll = d6();
      const row = rules.terrain.find((x) => x.results.includes(roll))?.rating ?? 'field';
      r = row === 'sparser' ? rr.sparser : row === 'denser' ? rr.denser : rating;
    }
    return { ...c, rating: r, start: r, graceUsed: false, effects: [] };
  });
  return { size, rating, centre: l.centre, squadStart: l.squadStart, zones };
}
