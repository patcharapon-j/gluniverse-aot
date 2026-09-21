/**
 * The retreat's forced moves over the field (data/engagement/background-titans.yaml, retreat, moves;
 * decision batch 16, 16-27): out, one ring further from the bodies; leave from any edge zone; toward a
 * fallen comrade; or stay with one, with the stay limit. Pure and unit tested. A soldier bound by it who
 * takes option 1 or 2 on each move leaves within five moves (termination).
 */
import { moveContext, moveOptions, ratingRows, type MoveKind, type ZoneMoveOption } from './positions.ts';
import type { RetreatClock } from './round.ts';
import type { AnchorRating, Snapshot, SoldierState, TitanRow } from './types.ts';
import { isEdge, isFree, ringOf, zoneDistance, type FieldState, type ZoneId } from './zones.ts';

export interface RetreatWorld {
  soldiers: readonly SoldierState[];
  titans: readonly TitanRow[];
  /** The label of the Focus Titan that holds a soldier Grabbed, or null. */
  grabbedBy: (id: string) => string | null;
  clock: RetreatClock;
  round: number;
}

/** The moves bind a soldier on the field who is not Down, Grabbed, or carried. */
export function retreatBinds(s: SoldierState, w: Pick<RetreatWorld, 'clock' | 'grabbedBy'>): boolean {
  if (!w.clock.active || !s.alive || s.left || s.down || s.carriedBy || w.grabbedBy(s.id)) return false;
  return s.zone !== null;
}

/** Options 3 and 4 for this comrade are open (the stay limit). */
export function stayOpen(c: SoldierState, w: Pick<RetreatWorld, 'titans' | 'clock' | 'round'>): boolean {
  const anyFocus = w.titans.some((t) => t.status === 'focus');
  const underCorpse = !!c.pinned && w.titans.find((t) => t.label === c.pinned!.body)?.status === 'corpse';
  if (anyFocus && !underCorpse) return true;
  return w.round <= w.clock.began + w.clock.length;
}

const fallen = (c: SoldierState, w: Pick<RetreatWorld, 'grabbedBy'>) => c.alive && !c.left && !c.carriedBy && c.zone !== null && (c.down || !!c.pinned || !!w.grabbedBy(c.id));

const bodyZones = (titans: readonly TitanRow[]) => titans.filter((t) => t.status === 'focus' || t.status === 'corpse').map((t) => t.zone);

/** Option 1's ranking of the zones a step may enter: no body first, then farthest from the nearest living Focus Titan (else corpse). */
function outRank(field: FieldState, titans: readonly TitanRow[], zone: ZoneId): [number, number] {
  const living = titans.filter((t) => t.status === 'focus').map((t) => t.zone);
  const from = living.length ? living : titans.filter((t) => t.status === 'corpse').map((t) => t.zone);
  const holds = bodyZones(titans).includes(zone) ? 1 : 0;
  const far = from.length ? Math.min(...from.map((z) => zoneDistance(field, zone, z))) : 0;
  return [holds, -far];
}

/**
 * The moves the retreat allows this soldier now (options 1 to 3), from the moves their own move can
 * make. Empty when the retreat does not bind them (retreatBinds says which), and for a bound soldier
 * it leaves only letting go (option 1 from a body with no attachment step to free) or staying
 * (option 4).
 */
export function retreatOptions(s: SoldierState, snap: Snapshot, ratings: readonly AnchorRating[] = ratingRows(), grabbedBy?: (id: string) => string | null, clock?: RetreatClock): ZoneMoveOption[] {
  const field = snap.field;
  const held = grabbedBy ?? ((id: string) => snap.titans.find((t) => t.status === 'focus' && t.grab?.soldier === id)?.label ?? null);
  const c = clock ?? { length: 0, filled: 0, active: snap.retreat, began: 0 };
  if (!field || !retreatBinds(s, { clock: c, grabbedBy: held }) || s.zone === null) return [];
  const ctx = moveContext(snap, s, ratings);
  if (!ctx) return [];
  const one = moveOptions(s, { ...ctx, retreat: true }).filter((o) => o.steps.length === 1);
  const out = new Map<string, ZoneMoveOption>();
  const add = (o: ZoneMoveOption) => out.set(`${o.kind}|${o.to.zone}|${o.to.attachment.kind}|${o.to.attachment.body}`, o);
  const here = s.zone;
  // 1. Out.
  if (!isFree(s.attachment)) {
    for (const o of one) if (o.to.zone === here && isFree(o.to.attachment)) add(o);
  } else {
    const outward = one.filter((o) => o.to.zone !== null && o.to.zone !== here && ringOf(field, o.to.zone) > ringOf(field, here));
    if (outward.length) {
      const rank = (o: ZoneMoveOption) => outRank(field, snap.titans, o.to.zone!);
      const best = outward.map(rank).reduce((a, b) => (b[0] < a[0] || (b[0] === a[0] && b[1] < a[1]) ? b : a));
      for (const o of outward) if (rank(o)[0] === best[0] && rank(o)[1] === best[1]) add(o);
    }
    // 2. Leave, from an edge zone, whatever body stands in it.
    if (isEdge(field, here)) for (const o of one) if (o.leaves) add(o);
  }
  // 3. Toward a fallen comrade: a zone step that lowers the zones between them.
  const w = { titans: snap.titans, clock: c, round: snap.round };
  for (const f of snap.soldiers) {
    if (f.id === s.id || !fallen(f, { grabbedBy: held }) || !stayOpen(f, w)) continue;
    const d = zoneDistance(field, here, f.zone!);
    for (const o of one) if (o.to.zone !== null && zoneDistance(field, o.to.zone, f.zone!) < d) add(o);
  }
  return [...out.values()];
}

/** The kinds of move a soldier can make now: on foot or mounted, and ODM Gear while it counts as had. */
export function moveKinds(s: SoldierState): MoveKind[] {
  const out: MoveKind[] = [s.mounted ? 'mounted' : 'onFoot'];
  if (s.odmHad) out.push('odm');
  return out;
}
