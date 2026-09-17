/**
 * The retreat's forced moves (data/engagement/background-titans.yaml, retreat, moves): toward distant
 * relative to the right body, leaving (positions.ts, leaveBlock), toward a fallen comrade, or staying
 * with one, with the stay limit. Pure and unit tested; moveOptions refuses any other step.
 */
import { comparisonLabel, stepRows, stepsApart, waysOf, type MoveKind } from './positions.ts';
import type { RetreatClock } from './round.ts';
import type { AnchorRating, Position, SoldierState, TitanRow } from './types.ts';

const POSITIONS: readonly Position[] = ['distant', 'in-reach', 'on-body', 'blind-spot'];

export interface RetreatWorld {
  soldiers: readonly SoldierState[];
  titans: readonly TitanRow[];
  rating: AnchorRating;
  /** The label of the Focus Titan that holds a soldier Grabbed, or null. */
  grabbedBy: (id: string) => string | null;
  clock: RetreatClock;
  round: number;
}

/** The moves bind a soldier who holds a Position and is not Down, Grabbed, or carried. */
export function retreatBinds(s: SoldierState, w: RetreatWorld): boolean {
  if (!w.clock.active || !s.alive || s.left || s.down || s.carriedBy || w.grabbedBy(s.id)) return false;
  return w.titans.some((t) => s.positions[t.label] !== undefined);
}

/** Option 1's body: the Focus Titan with the earliest label not held at distant, else such a corpse. */
export function retreatBody(s: SoldierState, titans: readonly TitanRow[]): string | null {
  const notDistant = (t: TitanRow) => s.positions[t.label] !== undefined && s.positions[t.label] !== 'distant';
  const byLabel = [...titans].sort((a, b) => a.label.localeCompare(b.label));
  return byLabel.find((t) => t.status === 'focus' && notDistant(t))?.label ?? byLabel.find((t) => t.status === 'corpse' && notDistant(t))?.label ?? null;
}

/** Options 3 and 4 for this comrade are open (the stay limit). */
export function stayOpen(c: SoldierState, w: RetreatWorld): boolean {
  const anyFocus = w.titans.some((t) => t.status === 'focus');
  const underCorpse = !!c.pinned && w.titans.find((t) => t.label === c.pinned!.body)?.status === 'corpse';
  if (anyFocus && !underCorpse) return true;
  return w.round <= w.clock.began + w.clock.length;
}

/** The body a fallen comrade's Position is compared relative to (moves, for 3 and 4). */
function comradeBody(c: SoldierState, w: RetreatWorld): string | null {
  return w.grabbedBy(c.id) ?? c.pinned?.body ?? comparisonLabel(w.titans);
}

const fallen = (c: SoldierState, w: RetreatWorld) => c.alive && !c.left && !c.carriedBy && (c.down || !!c.pinned || !!w.grabbedBy(c.id));

/**
 * The Positions relative to one body the soldier's forced move may reach (one step each), or null
 * when the moves do not bind them. An empty list means only letting go or changing nothing.
 */
export function forcedTargets(s: SoldierState, label: string, w: RetreatWorld, kinds: readonly MoveKind[]): Position[] | null {
  if (!retreatBinds(s, w)) return null;
  const from = s.positions[label];
  if (from === undefined) return [];
  const t = w.titans.find((x) => x.label === label);
  const rows = stepRows(w.rating, !!t && (t.grounded || t.status === 'corpse'));
  const usable = rows.filter((r) => waysOf(r).some((way) => kinds.includes(way.kind)));
  const oneStep = (p: Position) => usable.some((r) => (r.a === from && r.b === p) || (r.b === from && r.a === p));
  const out = new Set<Position>();
  // 1. Toward distant, relative to the body the rule names.
  if (retreatBody(s, w.titans) === label) {
    const d = stepsApart(usable, from, 'distant');
    for (const p of POSITIONS) if (p !== from && oneStep(p) && stepsApart(usable, p, 'distant') === d - 1) out.add(p);
  }
  // 3. Toward a fallen comrade whose Position is compared relative to this body.
  for (const c of w.soldiers) {
    if (c.id === s.id || !fallen(c, w) || comradeBody(c, w) !== label || !stayOpen(c, w)) continue;
    const at = c.positions[label];
    if (at === undefined) continue;
    const d = stepsApart(rows, from, at);
    for (const p of POSITIONS) if (p !== from && oneStep(p) && stepsApart(rows, p, at) < d) out.add(p);
  }
  return POSITIONS.filter((p) => out.has(p));
}

/** The kinds of move a soldier can make now: on foot or mounted, and ODM Gear while it counts as had. */
export function moveKinds(s: SoldierState): MoveKind[] {
  const out: MoveKind[] = [s.mounted ? 'mounted' : 'onFoot'];
  if (s.odmHad) out.push('odm');
  return out;
}
