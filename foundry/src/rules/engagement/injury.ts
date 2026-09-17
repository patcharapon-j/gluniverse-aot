/**
 * Gaining a Critical Injury (data/harm/critical-injuries.yaml: gaining, worsening, sides,
 * injury_location_table, tables), for the harm a Titan attack or a Skirmish lands. The Injury Type's
 * riders and the record are applied by the caller from the row's compendium entry
 * (src/rules/harm.ts, gainedInjuryState). Pure and unit tested.
 */

export type Location = 'arm' | 'leg' | 'torso' | 'head';
export type Side = 'left' | 'right';

export interface InjuryRow {
  id: string;
  min: number | null;
  max: number | null;
  instant: boolean;
  lethal: boolean;
  permanent: boolean;
  repeat: string | null;
}

export interface InjuryTables {
  locations: { min: number | null; max: number | null; location: Location; side: Side | null }[];
  worsening: number;
  rider: number;
  tables: Record<string, { cap: string; rows: InjuryRow[] }>;
}

export interface HeldInjury {
  row: string;
  location: string;
  side: Side | null;
}

export interface GainInput {
  location: Location | 'rolled';
  cannotBeLethal: boolean;
  /** Net Successes of the landed Behavior Table entry, or 0 when the rider does not apply. */
  net: number;
  held: readonly HeldInjury[];
  /** Healed Critical Injuries whose row has permanent effects. */
  healedPermanent: readonly { row: string; side: Side | null }[];
}

export interface GainRolls {
  /** D6 for the Injury Location table, or for the side of a named arm or leg. */
  location: number;
  /** The 2D6. */
  dice: [number, number];
}

export interface Gained {
  location: Location;
  side: Side | null;
  total: number;
  row: string;
  instant: boolean;
  lethal: boolean;
}

const inRange = (r: { min: number | null; max: number | null }, n: number) => (r.min === null || n >= r.min) && (r.max === null || n <= r.max);

/** The table a row id belongs to. */
export function rowLocation(tables: InjuryTables, rowId: string): Location | null {
  for (const [loc, t] of Object.entries(tables.tables)) if (t.rows.some((r) => r.id === rowId)) return loc as Location;
  return null;
}

export function gainInjury(tables: InjuryTables, x: GainInput, rolls: GainRolls): Gained {
  let location: Location;
  let side: Side | null;
  if (x.location === 'rolled') {
    const row = tables.locations.find((r) => inRange(r, rolls.location)) ?? tables.locations[tables.locations.length - 1];
    location = row.location;
    side = row.side;
  } else {
    location = x.location;
    side = location === 'arm' || location === 'leg' ? (rolls.location % 2 === 1 ? 'left' : 'right') : null;
  }
  const table = tables.tables[location];
  const sameSpot = (loc: string | null, s: Side | null) => loc === location && (side === null || s === side);
  const worse = x.held.filter((h) => sameSpot(h.location, h.side)).length + x.healedPermanent.filter((h) => sameSpot(rowLocation(tables, h.row), h.side)).length;
  let total = rolls.dice[0] + rolls.dice[1] + worse * tables.worsening;
  if (x.net > 1) total += (x.net - 1) * tables.rider;
  let row = table.rows.find((r) => inRange(r, total)) ?? table.rows[table.rows.length - 1];
  if (row.permanent && row.repeat) {
    const gained = [...x.held.filter((h) => h.location === location), ...x.healedPermanent].some((h) => h.row === row.id && (side === null || h.side === side));
    if (gained) row = table.rows.find((r) => r.id === row.repeat) ?? row;
  }
  if (x.cannotBeLethal && (row.lethal || row.instant)) row = table.rows.find((r) => r.id === table.cap) ?? row;
  return { location, side, total, row: row.id, instant: row.instant, lethal: row.lethal };
}
