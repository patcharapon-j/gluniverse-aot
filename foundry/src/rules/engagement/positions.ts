/**
 * Positions and moves (data/engagement/positions.yaml, data/engagement/anchor-ratings.yaml). Pure and
 * unit tested. Positions are stored by the Titan's label, for a Focus Titan and for a corpse alike.
 */
import type { AnchorRating, Position, SoldierState, StepRow, TitanRow } from './types.ts';

export type MoveKind = 'onFoot' | 'mounted' | 'odm';

/** One way a step can be made. */
export interface StepWay {
  kind: MoveKind;
  fly: { needs: number; failure: Position } | null;
}

const CLOSE: readonly Position[] = ['on-body', 'blind-spot'];
const NEAR_GROUND: readonly Position[] = ['in-reach', 'on-body', 'blind-spot'];

export const isClose = (p: Position | undefined) => !!p && CLOSE.includes(p);

/**
 * The step rows in force relative to one body: the rating's rows, plus the grounded permissions
 * (anchor-ratings.yaml, grounded_titan): every row among in-reach, on-body, and blind-spot can also be
 * made on foot and none mounted, and at the Open rating a grounded body adds on-body to blind-spot on
 * foot or by ODM. A corpse always counts as grounded.
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
  if (rating.id === 'open' && !rows.some((r) => pairIs(r, 'on-body', 'blind-spot'))) {
    rows.push({ a: 'on-body', b: 'blind-spot', onFoot: true, mounted: false, odm: true, fly: null });
  }
  return rows;
}

const pairIs = (r: StepRow, x: Position, y: Position) => (r.a === x && r.b === y) || (r.a === y && r.b === x);

/** The step row joining two Positions, or null. */
export function stepBetween(rows: readonly StepRow[], from: Position, to: Position): StepRow | null {
  return rows.find((r) => pairIs(r, from, to)) ?? null;
}

/** The fewest step rows joining two Positions (0 for the same one, Infinity with no chain). */
export function stepsApart(rows: readonly StepRow[], from: Position, to: Position): number {
  if (from === to) return 0;
  const seen = new Set<Position>([from]);
  let frontier: Position[] = [from];
  for (let d = 1; frontier.length; d++) {
    const next: Position[] = [];
    for (const p of frontier) {
      for (const r of rows) {
        const other = r.a === p ? r.b : r.b === p ? r.a : null;
        if (!other || seen.has(other)) continue;
        if (other === to) return d;
        seen.add(other);
        next.push(other);
      }
    }
    frontier = next;
  }
  return Infinity;
}

/** The ways a single step can be made, from its row (step_fields). */
export function waysOf(row: StepRow): StepWay[] {
  const out: StepWay[] = [];
  if (row.onFoot) out.push({ kind: 'onFoot', fly: null });
  if (row.mounted) out.push({ kind: 'mounted', fly: null });
  if (row.odm) out.push({ kind: 'odm', fly: row.fly });
  return out;
}

export interface MoveContext {
  rating: AnchorRating;
  titan: TitanRow;
  grabbed: boolean;
  retreat: boolean;
  /** During a retreat, the Positions the forced move may reach relative to this body (retreat.ts, forcedTargets), or null. */
  forced?: readonly Position[] | null;
}

export interface MoveOption {
  to: Position;
  /** The ways the soldier's own move can reach it now (empty when it cannot). */
  ways: StepWay[];
  /** Why the soldier's own move cannot reach it (a key under WOF.Tracker.move), or null. */
  block: string | null;
}

/**
 * What the soldier's own move can do relative to one body (positions.yaml, moves): exactly one step
 * the Anchor Rating allows for the kind of move, or nothing. A Grabbed, Pinned, or carried soldier's
 * move changes nothing; a Down soldier can only step from in-reach to Distant on foot; a mounted
 * soldier makes mounted steps or an ODM move; an ODM move needs ODM Gear that counts as had.
 */
export function moveOptions(s: SoldierState, ctx: MoveContext): MoveOption[] {
  const from = s.positions[ctx.titan.label];
  const grounded = ctx.titan.grounded || ctx.titan.status === 'corpse';
  const rows = stepRows(ctx.rating, grounded);
  return (['distant', 'in-reach', 'on-body', 'blind-spot'] as Position[])
    .filter((p) => p !== from)
    .map((to) => {
      const block = ownMoveBlock(s, ctx, from);
      if (block) return { to, ways: [], block };
      if (from === undefined) return { to, ways: [], block: 'noPosition' };
      const row = stepBetween(rows, from, to);
      if (!row) return { to, ways: [], block: 'notOneStep' };
      if (ctx.forced && !ctx.forced.includes(to)) return { to, ways: [], block: 'forced' };
      let ways = waysOf(row);
      if (s.down) {
        ways = from === 'in-reach' && to === 'distant' ? ways.filter((w) => w.kind === 'onFoot') : [];
        if (!ways.length) return { to, ways, block: 'down' };
      }
      ways = ways.filter((w) => (s.mounted ? w.kind !== 'onFoot' : w.kind !== 'mounted'));
      if (!s.odmHad) ways = ways.filter((w) => w.kind !== 'odm');
      if (!ways.length) return { to, ways, block: s.mounted ? 'mounted' : row.odm && !s.odmHad ? 'noOdm' : 'kind' };
      return { to, ways, block: null };
    });
}

function ownMoveBlock(s: SoldierState, ctx: MoveContext, from: Position | undefined): string | null {
  if (!s.alive) return 'dead';
  if (s.left) return 'left';
  if (ctx.grabbed) return 'grabbed';
  if (s.pinned) return 'pinned';
  if (s.carriedBy) return 'carried';
  if (from === undefined) return 'noPosition';
  return null;
}

/**
 * The close rule (two_focus_titans, close_rule): when a soldier's Position relative to one Focus
 * Titan becomes on-body or blind-spot, every other Focus Titan they hold on-body or blind-spot
 * against becomes in-reach. Corpses are not read.
 */
export function withPosition(positions: Record<string, Position>, label: string, to: Position, focusLabels: readonly string[]): Record<string, Position> {
  const out = { ...positions, [label]: to };
  if (isClose(to) && focusLabels.includes(label)) {
    for (const other of focusLabels) if (other !== label && isClose(out[other])) out[other] = 'in-reach';
  }
  return out;
}

/** Labels of the living Focus Titans, earliest first. */
export const focusLabels = (titans: readonly TitanRow[]) => titans.filter((t) => t.status === 'focus').map((t) => t.label).sort();

/**
 * The body two soldiers' Positions are compared relative to when no Titan is named
 * (comparison, otherwise): the living Focus Titan with the earliest label, else the corpse of the
 * Focus Titan that died last (the last corpse in tracker order).
 */
export function comparisonLabel(titans: readonly TitanRow[]): string | null {
  const focus = focusLabels(titans);
  if (focus.length) return focus[0];
  const corpses = titans.filter((t) => t.status === 'corpse');
  return corpses.length ? corpses[corpses.length - 1].label : null;
}

/**
 * Same Position or one step apart relative to a body (Chapter 1's test): both hold a Position
 * relative to it and the Anchor Rating joins them in at most one row. Two departed soldiers count
 * as the same Position; a departed soldier is never near one who holds a Position.
 */
export function nearEachOther(a: SoldierState, b: SoldierState, label: string | null, rating: AnchorRating, titans: readonly TitanRow[]): boolean {
  if (a.left || b.left) return a.left && b.left;
  if (!label) return false;
  const pa = a.positions[label];
  const pb = b.positions[label];
  if (!pa || !pb) return false;
  const t = titans.find((x) => x.label === label);
  const rows = stepRows(rating, !!t && (t.grounded || t.status === 'corpse'));
  return stepsApart(rows, pa, pb) <= 1;
}

/** A Titan becomes a Focus Titan: everyone who holds a Position holds Distant relative to it (two_focus_titans, entering). */
export function entering(s: SoldierState, label: string, holdsAPosition: boolean): Record<string, Position> {
  if (!s.alive || s.left || !holdsAPosition) return { ...s.positions };
  return { ...s.positions, [label]: 'distant' };
}

/**
 * A Focus Titan dies (two_focus_titans, a_focus_titan_dies; corpse): the Position each soldier held
 * becomes their Position relative to its corpse, on-body and blind-spot reading in-reach.
 */
export function corpsePosition(p: Position | undefined): Position | undefined {
  if (p === undefined) return undefined;
  return isClose(p) ? 'in-reach' : p;
}

/** A soldier "holds a Position" while they hold one relative to at least one Focus Titan or corpse. */
export const holdsAPosition = (s: SoldierState, titans: readonly TitanRow[]) => !s.left && s.alive && titans.some((t) => s.positions[t.label] !== undefined);

/** Why a soldier may not leave (positions.yaml, leaving), or null. */
export function leaveBlock(s: SoldierState, titans: readonly TitanRow[], grabbed: boolean): string | null {
  if (!s.alive) return 'dead';
  if (s.left) return 'left';
  if (s.down) return 'down';
  if (grabbed) return 'grabbed';
  if (s.carriedBy) return 'carried';
  if (s.pinned) return 'pinned';
  if (titans.some((t) => s.positions[t.label] !== undefined && s.positions[t.label] !== 'distant')) return 'notDistant';
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

/** A returning soldier holds Distant relative to every Focus Titan and every corpse. */
export function returning(titans: readonly TitanRow[]): Record<string, Position> {
  return Object.fromEntries(titans.map((t) => [t.label, 'distant' as Position]));
}

/** Letting go (moves, letting_go): a soldier on-body or blind-spot, not Grabbed or carried, falls and holds in-reach. */
export function letGoBlock(s: SoldierState, label: string, grabbed: boolean): string | null {
  if (!s.alive) return 'dead';
  if (grabbed) return 'grabbed';
  if (s.carriedBy) return 'carried';
  if (s.pinned) return 'pinned';
  if (!isClose(s.positions[label])) return 'notClose';
  return null;
}

/** The next unused label: A, B, C, ... (background-titans.yaml, full_clock). */
export function nextLabel(used: readonly string[]): string {
  for (let i = 0; i < 26; i++) {
    const l = String.fromCharCode(65 + i);
    if (!used.includes(l)) return l;
  }
  return `T${used.length + 1}`;
}
