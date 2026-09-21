/**
 * Moves over the field (data/engagement/positions.yaml, moves; data/engagement/zones.yaml, moves and
 * flight; data/engagement/anchor-ratings.yaml, ratings and grounded_titan; decision batch 16, 16-12 to
 * 16-15 and 16-26). Pure and unit tested. A move names where it ends, a zone (or off field) and an
 * attachment, and is made of zone steps and attachment steps; Positions are derived (zones.ts).
 */
import { derivePositions, isEdge, isFree, neighbours, zoneOf, zoneRules, carryCostInto, crossedZones, momentumCapAt, type Attachment, type FieldState, type Placement, type ZoneId } from './zones.ts';
import type { AnchorRating, Position, Snapshot, SoldierState, StepRow, TitanRow } from './types.ts';

export type MoveKind = 'onFoot' | 'mounted' | 'odm';

const CLOSE: readonly Position[] = ['on-body', 'blind-spot'];
const NEAR_GROUND: readonly Position[] = ['in-reach', 'on-body', 'blind-spot'];

export const isClose = (p: Position | undefined) => !!p && CLOSE.includes(p);

/** A body a soldier can hold a Position relative to: a living Focus Titan or a corpse. */
const isBody = (t: TitanRow) => t.status === 'focus' || t.status === 'corpse';
/** A corpse counts as a grounded Titan for attachment steps (positions.yaml, corpse). */
const groundedBody = (t: TitanRow) => t.grounded || t.status === 'corpse';

/**
 * The step rows in force relative to one body: the rating's rows, plus the grounded permissions
 * (anchor-ratings.yaml, grounded_titan): every row among in-reach, on-body, and blind-spot can also be
 * made on foot and none mounted, and at an Open zone a grounded body adds on-body to blind-spot on foot
 * or by ODM. A corpse always counts as grounded.
 */
export function stepRows(rating: AnchorRating, grounded: boolean): StepRow[] {
  const rows = rating.steps.map((r) => ({ ...r }));
  if (!grounded) return rows;
  for (const r of rows) {
    if (NEAR_GROUND.includes(r.a) && NEAR_GROUND.includes(r.b)) {
      r.onFoot = true;
      r.mounted = false;
    }
  }
  if (rating.id === zoneRules().groundedExtraRating && !rows.some((r) => pairIs(r, 'on-body', 'blind-spot'))) {
    rows.push({ a: 'on-body', b: 'blind-spot', onFoot: true, mounted: false, odm: true });
  }
  return rows;
}

const pairIs = (r: StepRow, x: Position, y: Position) => (r.a === x && r.b === y) || (r.a === y && r.b === x);

/** The step row joining two Positions, or null. */
export function stepBetween(rows: readonly StepRow[], from: Position, to: Position): StepRow | null {
  return rows.find((r) => pairIs(r, from, to)) ?? null;
}

/** Whether a row can be made by a kind of move (step_fields). */
const allows = (row: StepRow | null, kind: MoveKind) => !!row && (kind === 'onFoot' ? row.onFoot : kind === 'mounted' ? row.mounted : row.odm);

/** The rating's distant to in-reach row, which a zone step into a zone of that rating reads (moves, entered_zone_reads). */
const entryRow = (rating: AnchorRating | null) => (rating ? stepBetween(rating.steps, 'distant', 'in-reach') : null);

// ---------------------------------------------------------------- the move options (16-12, 16-13)

export interface ZoneMoveOption {
  to: Placement;
  kind: MoveKind;
  /** Every step in order, the last equal to `to`. */
  steps: Placement[];
  /** Carries on a Flight, 0 otherwise. */
  carries: number;
  /** Momentum the Carries cost. */
  momentum: number;
  /** Focus Titan labels the crossing flag would set (16-15). */
  crosses: string[];
  /** Focus Titan labels a mounted charge could flag (16-15). */
  charge: string[];
  /** The move is a Flight and will be rolled. */
  fly: boolean;
  /** The last step is off field (leaving, 16-26). */
  leaves: boolean;
  /** The soldier spends 1 Momentum on quiet with this move: no flag lands this turn (16-14, 16-15). */
  quiet?: boolean;
  /**
   * The rider's choice of one Titan in `charge` to flag (mounted_charge, "the rider's choice"). Absent,
   * the ride flags nothing: a charge is never forced (review M5).
   */
  chargeOn?: string;
  /** The move begins with a mount: the soldier is free and their horse is in their zone (horses.yaml, within_a_move; review M7). */
  mount?: boolean;
  /** The move begins with a dismount: the horse stays in the zone the move starts in (review M7). */
  dismount?: boolean;
  /** A ride that ends with a dismount in the zone it ends in; the horse stays there (within_a_move, after; review 2 n4). */
  dismountAfter?: boolean;
  /** A move on foot that ends with a mount on the horse in the zone it ends in (within_a_move, after; review 2 n4). */
  mountAfter?: boolean;
}

/** The one mount or dismount a move makes after its steps (horses.yaml, within_a_move). */
export type AfterSteps = Pick<ZoneMoveOption, 'mountAfter' | 'dismountAfter'>;

/**
 * The variant of a move that mounts or dismounts after its steps, or null when it cannot: a ride may
 * end with a dismount; a move on foot by a soldier who is not mounted, ending free in their horse's
 * zone, may end with a mount. One mount or dismount a move, so not after one before the steps.
 */
function afterSteps(s: SoldierState, o: ZoneMoveOption, want: AfterSteps): ZoneMoveOption | null {
  if (want.dismountAfter) return o.kind === 'mounted' && s.mounted && !o.mount && o.to.zone !== null ? { ...o, dismountAfter: true } : null;
  if (want.mountAfter) return o.kind === 'onFoot' && !s.mounted && !s.down && o.to.zone !== null && o.to.zone === s.horseZone && isFree(o.to.attachment) ? { ...o, mountAfter: true } : null;
  return o;
}

/**
 * The Focus Titans a move flags (16-15): every one standing in a zone a Flight crosses, and the one
 * the rider chose to charge, if it is among those the ride may charge. Quiet, spent this turn or with
 * the move, stops every flag the soldier would set.
 */
export function moveFlags(o: Pick<ZoneMoveOption, 'crosses' | 'charge' | 'chargeOn'>, quiet: boolean): string[] {
  if (quiet) return [];
  const charged = o.chargeOn && o.charge.includes(o.chargeOn) ? [o.chargeOn] : [];
  return [...new Set([...o.crosses, ...charged])].sort();
}

export interface MoveContext {
  field: FieldState;
  /** Every Focus Titan and corpse row. */
  titans: readonly TitanRow[];
  /** The Anchor Rating row of a rating id (its step rows). */
  rating: (id: string) => AnchorRating | null;
  grabbed: boolean;
  /**
   * The Momentum a Flight can spend on Carry. A Flight's successes give Momentum before its Carries
   * are paid (16-14), so the tracker offers up to the start zone's cap and the answered roll decides
   * how far the soldier can pay (flightPrefix).
   */
  momentum?: number;
  /** A retreat is under way: a soldier may leave from any edge zone (16-27). */
  retreat?: boolean;
}

const OFF: Placement = { zone: null, attachment: { kind: 'ground', body: null } };

const keyOf = (p: Placement) => `${p.zone ?? 'off'}|${isFree(p.attachment) ? 'free' : `${p.attachment.kind}:${p.attachment.body}`}`;

const bodiesIn = (ctx: MoveContext, zone: ZoneId) => ctx.titans.filter((t) => isBody(t) && t.zone === zone);
const standingIn = (ctx: MoveContext, zone: ZoneId) => ctx.titans.filter((t) => t.status === 'focus' && t.zone === zone);

/** A Position standing for the attachment relative to its body (in-reach for free). */
const asPosition = (a: Attachment): Position => (a.kind === 'on-body' || a.kind === 'grabbed' ? 'on-body' : a.kind === 'blind-spot' ? 'blind-spot' : 'in-reach');

interface Step {
  to: Placement;
  cost: number;
}

/** Why a soldier may not step off field from this zone (leaving, 16-26), or null. */
function offBlock(ctx: MoveContext, zone: ZoneId): string | null {
  if (!isEdge(ctx.field, zone)) return 'notEdge';
  if (!ctx.retreat && bodiesIn(ctx, zone).length) return 'bodyInZone';
  return null;
}

/** The single steps one kind of move can make from a placement (moves, zone_step and attachment_step). */
function stepsFrom(p: Placement, kind: MoveKind, ctx: MoveContext): Step[] {
  if (p.zone === null) return [];
  const zone = p.zone;
  const out: Step[] = [];
  const freeAs: Attachment = { kind: kind === 'odm' ? 'anchored' : 'ground', body: null };
  if (isFree(p.attachment)) {
    for (const n of neighbours(ctx.field, zone)) {
      const z = zoneOf(ctx.field, n)!;
      if (kind !== 'odm' && !allows(entryRow(ctx.rating(z.rating)), kind)) continue;
      out.push({ to: { zone: n, attachment: freeAs }, cost: carryCostInto(ctx.field, n) });
    }
    if (!offBlock(ctx, zone)) out.push({ to: { ...OFF }, cost: carryCostInto(ctx.field, 'off') });
  }
  if (kind === 'mounted') return out;
  const rating = ctx.rating(zoneOf(ctx.field, zone)?.rating ?? '');
  if (!rating) return out;
  const here = asPosition(p.attachment);
  for (const b of bodiesIn(ctx, zone)) {
    if (!isFree(p.attachment) && p.attachment.body !== b.label) continue;
    const rows = stepRows(rating, groundedBody(b));
    const targets: [Position, Attachment][] = [
      ['in-reach', freeAs],
      ['on-body', { kind: 'on-body', body: b.label }],
      ['blind-spot', { kind: 'blind-spot', body: b.label }],
    ];
    for (const [pos, att] of targets) {
      if (pos === here) continue;
      if (!allows(stepBetween(rows, here, pos), kind)) continue;
      out.push({ to: { zone, attachment: att }, cost: carryCostInto(ctx.field, 'attach') });
    }
  }
  return out;
}

/** A Flight may not end free in a zone whose distant to in-reach row gives ODM no step (the Open row). */
function flightMayEnd(p: Placement, ctx: MoveContext): boolean {
  if (p.zone === null || !isFree(p.attachment)) return true;
  if (zoneRules().flight.endsFreeInOpen) return true;
  const z = zoneOf(ctx.field, p.zone);
  return allows(entryRow(ctx.rating(z?.rating ?? '')), 'odm');
}

function option(s: SoldierState, kind: MoveKind, steps: Placement[], costs: number[], ctx: MoveContext): ZoneMoveOption {
  const to = steps[steps.length - 1];
  const fly = kind === 'odm';
  const carries = fly ? Math.max(0, steps.length - 1) : 0;
  const momentum = fly ? costs.slice(1).reduce((a, b) => a + b, zoneRules().flight.firstStepCost) : 0;
  const crosses = fly && s.zone !== null ? [...new Set(crossedZones(s.zone, steps.map((x) => x.zone)).flatMap((z) => standingIn(ctx, z).map((t) => t.label)))].sort() : [];
  let charge: string[] = [];
  if (kind === 'mounted' && s.zone !== null) {
    const touched = new Set<ZoneId>();
    if (steps.some((x) => x.zone !== s.zone)) touched.add(s.zone);
    for (const x of steps) if (x.zone !== null && x.zone !== s.zone) touched.add(x.zone);
    charge = [...new Set([...touched].flatMap((z) => standingIn(ctx, z).map((t) => t.label)))].sort();
  }
  const out: ZoneMoveOption = { to, kind, steps, carries, momentum, crosses, charge, fly, leaves: to.zone === null };
  // A move includes one mount or one dismount, before its steps (horses.yaml, within_a_move; 16-12).
  if (kind === 'mounted' && !s.mounted) out.mount = true;
  if (kind === 'onFoot' && s.mounted) out.dismount = true;
  return out;
}

/** Prefer the cheaper, quieter, shorter way to one destination (the soldier's own best route). */
const better = (a: ZoneMoveOption, b: ZoneMoveOption) =>
  a.momentum !== b.momentum ? a.momentum < b.momentum : a.crosses.length !== b.crosses.length ? a.crosses.length < b.crosses.length : a.steps.length < b.steps.length;

/** Why the soldier's own move can do nothing now (a key under WOF.Tracker.move), or null. */
export function moveBlock(s: SoldierState, grabbed: boolean): string | null {
  if (!s.alive) return 'dead';
  if (s.left || s.zone === null) return 'left';
  if (grabbed) return 'grabbed';
  if (s.pinned || s.attachment.kind === 'pinned') return 'pinned';
  if (s.carriedBy) return 'carried';
  return null;
}

/**
 * Every place the soldier's own move can end (moves): on foot one step; mounted up to the mounted
 * pace in zone steps, stopping on entering a standing Focus Titan's zone unless it is Open; by ODM a
 * Flight whose first step is free and each further step a Carry, at most the Carry limit, never ending
 * free in an Open zone. A Down soldier makes one on-foot zone step out of a zone holding a body into
 * one holding none. One option per destination and kind.
 */
export function moveOptions(s: SoldierState, ctx: MoveContext): ZoneMoveOption[] {
  if (moveBlock(s, ctx.grabbed) || s.zone === null) return [];
  const start: Placement = { zone: s.zone, attachment: s.attachment };
  const out = new Map<string, ZoneMoveOption>();
  const put = (o: ZoneMoveOption) => {
    const k = `${o.kind}|${o.mountAfter ? 'm' : ''}${o.dismountAfter ? 'd' : ''}|${keyOf(o.to)}`;
    const had = out.get(k);
    if (!had || better(o, had)) out.set(k, o);
  };
  if (s.down) {
    if (bodiesIn(ctx, s.zone).length && isFree(s.attachment)) {
      for (const st of stepsFrom(start, 'onFoot', ctx)) {
        if (st.to.zone === null || bodiesIn(ctx, st.to.zone).length) continue;
        put(option(s, 'onFoot', [st.to], [0], ctx));
      }
    }
    return [...out.values()];
  }
  // On foot, a mounted soldier dismounting first (the horse stays in this zone).
  for (const st of stepsFrom(start, 'onFoot', ctx)) put(option(s, 'onFoot', [st.to], [0], ctx));
  // Mounted, or mounting first on a horse in this zone while free (horses.yaml, within_a_move).
  const canRide = isFree(s.attachment) && (s.mounted || (s.horseZone !== null && s.horseZone === s.zone));
  if (canRide) {
    const r = zoneRules().mounted;
    const walk = (at: Placement, path: Placement[]) => {
      if (path.length >= r.zoneSteps || at.zone === null) return;
      for (const st of stepsFrom(at, 'mounted', ctx)) {
        const next = [...path, st.to];
        put(option(s, 'mounted', next, next.map(() => 0), ctx));
        const z = st.to.zone;
        const stops = z !== null && r.stopsAtTitan && standingIn(ctx, z).length > 0 && zoneOf(ctx.field, z)?.rating !== zoneRules().openRating;
        if (!stops) walk(st.to, next);
      }
    };
    walk(start, []);
  }
  if (s.odmHad) {
    const limit = zoneRules().flight.carryLimit;
    const budget = ctx.momentum ?? s.momentum;
    const walk = (at: Placement, path: Placement[], costs: number[], spent: number) => {
      if (path.length >= 1 + limit || at.zone === null) return;
      for (const st of stepsFrom(at, 'odm', ctx)) {
        const cost = path.length === 0 ? zoneRules().flight.firstStepCost : st.cost;
        if (spent + cost > budget) continue;
        const next = [...path, st.to];
        const nextCosts = [...costs, cost];
        if (flightMayEnd(st.to, ctx) && keyOf(st.to) !== keyOf(start)) put(option(s, 'odm', next, nextCosts, ctx));
        walk(st.to, next, nextCosts, spent + cost);
      }
    };
    walk(start, [], [], 0);
  }
  // The one mount or dismount may come after the steps instead (horses.yaml, within_a_move; review 2 n4).
  for (const o of [...out.values()]) {
    for (const want of [{ dismountAfter: true }, { mountAfter: true }]) {
      const v = afterSteps(s, o, want);
      if (v && v !== o) put(v);
    }
  }
  return [...out.values()].sort((a, b) => a.kind.localeCompare(b.kind) || (a.to.zone ?? 99) - (b.to.zone ?? 99) || keyOf(a.to).localeCompare(keyOf(b.to)));
}

/**
 * One route checked step by step, as the soldier (or the board) chose it: the option it makes, or null
 * when a step is not one the kind of move can make, a Flight goes past its Carry limit or its budget,
 * a Flight ends free in an Open zone, or a mounted move rides on past a standing Titan. The engine
 * checks every requested move this way, so any legal route is accepted, not only the one moveOptions
 * prefers.
 */
export function routeOption(s: SoldierState, ctx: MoveContext, kind: MoveKind, steps: readonly Placement[], after: AfterSteps = {}): ZoneMoveOption | null {
  const base = routeBase(s, ctx, kind, steps);
  return base ? afterSteps(s, base, after) : null;
}

function routeBase(s: SoldierState, ctx: MoveContext, kind: MoveKind, steps: readonly Placement[]): ZoneMoveOption | null {
  if (moveBlock(s, ctx.grabbed) || s.zone === null || !steps.length) return null;
  const opts = moveOptions(s, ctx).filter((o) => o.kind === kind && !o.mountAfter && !o.dismountAfter);
  if (!opts.length) return null;
  if (s.down || kind === 'onFoot') return steps.length === 1 ? (opts.find((o) => keyOf(o.to) === keyOf(steps[0])) ?? null) : null;
  let at: Placement = { zone: s.zone, attachment: s.attachment };
  const costs: number[] = [];
  const r = zoneRules();
  for (let i = 0; i < steps.length; i++) {
    const want = steps[i];
    const st = stepsFrom(at, kind, ctx).find((x) => keyOf(x.to) === keyOf(want));
    if (!st) return null;
    if (kind === 'mounted') {
      const z = at.zone;
      const stopped = i > 0 && z !== null && r.mounted.stopsAtTitan && standingIn(ctx, z).length > 0 && zoneOf(ctx.field, z)?.rating !== r.openRating;
      if (stopped || i >= r.mounted.zoneSteps) return null;
    }
    costs.push(i === 0 ? r.flight.firstStepCost : st.cost);
    at = st.to;
  }
  if (kind === 'odm') {
    if (steps.length > 1 + r.flight.carryLimit) return null;
    if (costs.reduce((a, b) => a + b, 0) > (ctx.momentum ?? s.momentum)) return null;
    if (!flightMayEnd(at, ctx)) return null;
  }
  return option(s, kind, steps.map((p) => ({ zone: p.zone, attachment: { ...p.attachment } })), costs, ctx);
}

/** The world a snapshot gives moveOptions: the field, the bodies, the rating rows, and the Flight's budget. */
export function moveContext(snap: Snapshot, s: SoldierState, ratings: readonly AnchorRating[]): MoveContext | null {
  if (!snap.field) return null;
  const grabbed = snap.titans.some((t) => t.status === 'focus' && t.grab?.soldier === s.id);
  const cap = s.zone !== null ? momentumCapAt(snap.field, s.zone) : 0;
  return {
    field: snap.field,
    titans: snap.titans,
    rating: (id) => ratings.find((r) => r.id === id) ?? null,
    grabbed,
    momentum: Math.max(s.momentum, cap),
    retreat: snap.retreat,
  };
}

let ratingTable: readonly AnchorRating[] = [];
/** The Anchor Rating rows moveOptionsFor reads (the tracker sets them from CONFIG.WOF.engagement.ratings). */
export const configureRatings = (rows: readonly AnchorRating[]) => (ratingTable = rows);
export const ratingRows = () => ratingTable;

/** The moves one soldier's own move can make now, read from a snapshot (the board's lit destinations). */
export function moveOptionsFor(snap: Snapshot, soldierId: string): ZoneMoveOption[] {
  const s = snap.soldiers.find((x) => x.id === soldierId);
  // A soldier whose move is spent this turn has none to make (review M6): the board lights nothing.
  if (!s || snap.mode !== 'titan' || snap.movesSpent.includes(soldierId)) return [];
  const ctx = moveContext(snap, s, ratingTable);
  return ctx ? moveOptions(s, ctx) : [];
}

/**
 * How far an answered Flight goes (16-14): the longest run of its steps, from the first, whose Carries
 * the Momentum after the roll pays and whose last step is a legal end. 0 steps when none is.
 */
export function flightPrefix(o: ZoneMoveOption, field: FieldState, momentum: number, mayEnd: (p: Placement) => boolean): { steps: Placement[]; momentum: number } {
  let best = { steps: [] as Placement[], momentum: 0 };
  let spent = 0;
  for (let i = 0; i < o.steps.length; i++) {
    const p = o.steps[i];
    const cost = i === 0 ? zoneRules().flight.firstStepCost : p.zone === null ? carryCostInto(field, 'off') : o.steps[i - 1].zone === p.zone ? carryCostInto(field, 'attach') : carryCostInto(field, p.zone);
    spent += cost;
    if (spent > momentum) break;
    if (mayEnd(p)) best = { steps: o.steps.slice(0, i + 1), momentum: spent };
  }
  return best;
}

/** Whether a Flight may end at a placement on this field (flight, ends_free_in_open). */
export function flightEnds(p: Placement, field: FieldState, rating: (id: string) => AnchorRating | null): boolean {
  return flightMayEnd(p, { field, titans: [], rating, grabbed: false });
}

// ---------------------------------------------------------------- holding, leaving, returning, letting go

/** Labels of the living Focus Titans, earliest first. */
export const focusLabels = (titans: readonly TitanRow[]) => titans.filter((t) => t.status === 'focus').map((t) => t.label).sort();

/** A soldier holds a Position while they are on the field (positions.yaml, holding_a_position). */
export const holdsAPosition = (s: SoldierState, titans: readonly TitanRow[]) => !s.left && s.alive && s.zone !== null && titans.some((t) => isBody(t));

/**
 * Why a soldier may not leave now (leaving, 16-26), or null: free, not Down, Grabbed, Pinned, or
 * carried, in an edge zone holding no Focus Titan and no corpse (any edge zone during a retreat).
 */
export function leaveBlock(s: SoldierState, field: FieldState | null, titans: readonly TitanRow[], grabbed: boolean, retreat = false): string | null {
  if (!s.alive) return 'dead';
  if (s.left) return 'left';
  if (s.down) return 'down';
  if (grabbed) return 'grabbed';
  if (s.carriedBy) return 'carried';
  if (s.pinned) return 'pinned';
  if (!field || s.zone === null) return 'left';
  if (!isFree(s.attachment)) return 'notFree';
  if (!isEdge(field, s.zone)) return 'notEdge';
  if (!retreat && titans.some((t) => isBody(t) && t.zone === s.zone)) return 'bodyInZone';
  return null;
}

/** Why a departed soldier may not return (leaving, returning), or null. */
export function returnBlock(s: SoldierState, retreat: boolean): string | null {
  if (!s.left) return 'notLeft';
  if (!s.alive) return 'dead';
  if (s.down) return 'down';
  if (s.carriedBy) return 'carried';
  if (retreat) return 'retreat';
  return null;
}

/**
 * The edge zones a returner may enter (returning): those holding no Focus Titan and no corpse; if every
 * edge zone holds one, any edge zone. Ascending.
 */
export function returnZones(field: FieldState, titans: readonly TitanRow[]): ZoneId[] {
  const edges = field.zones.map((z) => z.n).filter((n) => isEdge(field, n));
  const clear = edges.filter((n) => !titans.some((t) => isBody(t) && t.zone === n));
  return (clear.length ? clear : edges).sort((a, b) => a - b);
}

/** Letting go (moves, letting_go): from on-body or blind-spot, not Grabbed, Pinned, or carried; a fall, landing free in the zone. */
export function letGoBlock(s: SoldierState, grabbed: boolean): string | null {
  if (!s.alive) return 'dead';
  if (grabbed || s.attachment.kind === 'grabbed') return 'grabbed';
  if (s.carriedBy) return 'carried';
  if (s.pinned || s.attachment.kind === 'pinned') return 'pinned';
  if (s.attachment.kind !== 'on-body' && s.attachment.kind !== 'blind-spot') return 'notClose';
  return null;
}

/** Positions derived for a soldier at a placement (for a note or a preview). */
export const positionsAt = (s: SoldierState, p: Placement, titans: readonly TitanRow[]) => derivePositions({ ...s, zone: p.zone, attachment: p.attachment, left: p.zone === null }, titans.filter(isBody));

/** The next unused label: A, B, C, ... (background-titans.yaml, full_clock). */
export function nextLabel(used: readonly string[]): string {
  for (let i = 0; i < 26; i++) {
    const l = String.fromCharCode(65 + i);
    if (!used.includes(l)) return l;
  }
  return `T${used.length + 1}`;
}

// ---------------------------------------------------------------- Swap Blade Set (decision batch 10, OQ-185)

export interface SwapContext {
  /** The soldier is in a Titan Engagement, where the swap spends the move. */
  inEngagement: boolean;
  /** A Blade Set is already in the handles. */
  handlesFull: boolean;
  /** The soldier carries a Blade Set to fit. */
  carries: boolean;
  /** The soldier's move this round is already spent. */
  moveSpent: boolean;
  /** The soldier is Grabbed. */
  grabbed: boolean;
}

/**
 * What Swap Blade Set spends (data/gear/blade-sets.yaml, swap): in a Titan Engagement the soldier's
 * move and never the action, so what a ruined Blade Set costs is that turn's Flight. Outside one it
 * spends nothing and can be done as often as the soldier likes.
 */
export const swapSpends = (inEngagement: boolean): 'move' | 'nothing' => (inEngagement ? 'move' : 'nothing');

/** Why the soldier may not swap Blade Sets now (a key under WOF.Tracker.swapBlades), or null. */
export function swapBladeSetBlock(s: SoldierState, x: SwapContext): string | null {
  if (!s.alive) return 'dead';
  if (s.down) return 'down';
  if (x.handlesFull) return 'handlesFull';
  if (!x.carries) return 'noBlades';
  if (x.inEngagement && x.grabbed) return 'grabbed';
  if (x.inEngagement && x.moveSpent) return 'moveSpent';
  return null;
}
