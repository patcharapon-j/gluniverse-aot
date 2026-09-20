/**
 * Derived values of a soldier (player character or Squadmate), as pure functions.
 * No Foundry globals here, so every rule is unit tested in node.
 *
 * Sources: data/character/attributes.yaml (derived_values), data/harm/sheet-fields.yaml (derived,
 * invariants), data/harm/health.yaml, data/gear/sheet-fields.yaml (derived), data/gear/carrying.yaml.
 * The build checks each formula string against the one implemented here.
 */

export type AttributeId = 'strength' | 'agility' | 'wits' | 'perception' | 'instinct' | 'empathy';
export type Attributes = Record<AttributeId, number>;

/** How many points of Grief count against Resolve (attributes.yaml: "at most 3 points count"). */
export const MAX_GRIEF_COUNTED = 3;

/**
 * Health: 2 + (strength + agility) / 2, rounded up (round 3, decision 1; ADR-0005 amended). Health
 * runs 4 to 8. An untreated Critical Injury still crosses off one box; no damage value changes.
 */
export const HEALTH_BASE = 2;
export function health(a: Pick<Attributes, 'strength' | 'agility'>): number {
  return HEALTH_BASE + Math.ceil((a.strength + a.agility) / 2);
}

/** The lowest Resolve the system shows and rolls with (owner decision; docs/rules-questions.md). */
export const RESOLVE_FLOOR = 0;

/**
 * Resolve: (instinct + empathy) / 2 rounded up, plus 1 per Scar, minus 1 per point of Grief (at
 * most 3 count), never below 0. The rules set no floor (data/mind/grief.yaml, resolve_floor); the
 * owner clamps it at 0 until the rules session confirms (foundry/docs/rules-questions.md).
 */
export function resolve(a: Pick<Attributes, 'instinct' | 'empathy'>, scars: number, grief: number): number {
  return Math.max(RESOLVE_FLOOR, resolveUnclamped(a, scars, grief));
}

/** The formula's own value, which can be negative. Shown beside a clamped Resolve. */
export function resolveUnclamped(a: Pick<Attributes, 'instinct' | 'empathy'>, scars: number, grief: number): number {
  return Math.ceil((a.instinct + a.empathy) / 2) + scars - Math.min(Math.max(grief, 0), MAX_GRIEF_COUNTED);
}

/** Minimum Stress: the number of Scars. */
export function minimumStress(scars: number): number {
  return scars;
}

/** Boxes crossed off: min(untreated Critical Injuries, Health). */
export function boxesCrossedOff(untreated: number, healthRating: number): number {
  return Math.min(Math.max(untreated, 0), healthRating);
}

/** Current Health: max(0, Health - boxes crossed off - Health lost). */
export function currentHealth(healthRating: number, untreated: number, healthLost: number): number {
  return Math.max(0, healthRating - boxesCrossedOff(untreated, healthRating) - Math.max(healthLost, 0));
}

/**
 * The largest Health lost the invariant allows: health_lost <= health - min(untreated, health).
 * Damage never marks more boxes than are left clean.
 */
export function maxHealthLost(healthRating: number, untreated: number): number {
  return healthRating - boxesCrossedOff(untreated, healthRating);
}

export type HealthBox = 'crossed' | 'damaged' | 'clean';

/**
 * The Health row as the paper sheet draws it: an X per untreated Critical Injury (up to Health),
 * then a slash per point of Health lost, then clean boxes.
 */
export function healthBoxes(healthRating: number, untreated: number, healthLost: number): HealthBox[] {
  const crossed = boxesCrossedOff(untreated, healthRating);
  const damaged = Math.min(Math.max(healthLost, 0), healthRating - crossed);
  return Array.from({ length: healthRating }, (_, i) => (i < crossed ? 'crossed' : i < crossed + damaged ? 'damaged' : 'clean'));
}

export interface HeldInjury {
  treated: boolean;
  /** The row's `down` field: false, or until_treated. */
  down: false | 'until_treated';
}

/**
 * Whether the soldier is Down by rule (data/harm/down.yaml, conditions): current Health 0, or an
 * untreated Critical Injury whose row has down until_treated. The stored `down` field must match.
 */
export function downByRule(current: number, injuries: HeldInjury[]): boolean {
  return current === 0 || injuries.some((i) => !i.treated && i.down === 'until_treated');
}

/** Carrying limit: strength + 4. */
export const CARRYING_LIMIT_BONUS = 4;
export function carryingLimit(strength: number): number {
  return strength + CARRYING_LIMIT_BONUS;
}

export interface CarriedGear {
  /** items_counted from data/gear/items.yaml. */
  itemsCounted: number;
  /** A Blade Set in the handles counts as no item (data/gear/carrying.yaml). */
  inHandles?: boolean;
}

/** What a carried comrade adds: 5, or 0 with Strong Back, plus every item that comrade carries. */
export const CARRIED_COMRADE_ITEMS = 5;

export interface CarriedComrade {
  itemsCarried: number;
}

/**
 * Items carried (data/gear/sheet-fields.yaml derived.items_carried; data/gear/carrying.yaml
 * items_counted): each spare canister 1, each gear item by its items_counted (the Blade Set in the
 * handles 0), and a carried comrade's 5 (0 with Strong Back) plus the items that comrade carries.
 */
export function itemsCarried(opts: {
  spareCanisters: number;
  gear: CarriedGear[];
  comrade?: CarriedComrade | null;
  strongBack?: boolean;
}): number {
  const gear = opts.gear.reduce((n, g) => n + (g.inHandles ? 0 : g.itemsCounted), 0);
  const comrade = opts.comrade ? (opts.strongBack ? 0 : CARRIED_COMRADE_ITEMS) + opts.comrade.itemsCarried : 0;
  return opts.spareCanisters + gear + comrade;
}

/** Overloaded: items carried > carrying limit. */
export function overloaded(items: number, limit: number): boolean {
  return items > limit;
}

/** Jammed: ODM Gear current rating 0. A soldier with no ODM Gear is not Jammed; they have none. */
export function jammed(odm: { current: number } | null | undefined): boolean {
  return !!odm && odm.current === 0;
}

/** Lame: horse current rating 0. */
export function lame(horse: { current: number } | null | undefined): boolean {
  return !!horse && horse.current === 0;
}

/** The effective Stress shown and rolled: never below minimum Stress. */
export function effectiveStress(stress: number, minimum: number): number {
  return Math.max(stress, minimum);
}

export interface SoldierInputs {
  attributes: Attributes;
  scars: number;
  grief: number;
  stress: number;
  healthLost: number;
  injuries: HeldInjury[];
  spareCanisters: number;
  gear: CarriedGear[];
  odm?: { current: number } | null;
  horse?: { current: number } | null;
  comrade?: CarriedComrade | null;
  strongBack?: boolean;
}

export interface SoldierDerived {
  health: number;
  resolve: number;
  /** The Resolve formula before the 0 floor; below 0 only when Grief outweighs the rest. */
  resolve_unclamped: number;
  minimum_stress: number;
  stress_effective: number;
  untreated_critical_injuries: number;
  boxes_crossed_off: number;
  current_health: number;
  health_boxes: HealthBox[];
  down_by_rule: boolean;
  carrying_limit: number;
  items_carried: number;
  overloaded: boolean;
  jammed: boolean;
  lame: boolean;
}

/** Every derived value at once, as prepareDerivedData stores them. */
export function deriveSoldier(i: SoldierInputs): SoldierDerived {
  const h = health(i.attributes);
  const untreated = i.injuries.filter((x) => !x.treated).length;
  const current = currentHealth(h, untreated, i.healthLost);
  const min = minimumStress(i.scars);
  const limit = carryingLimit(i.attributes.strength);
  const items = itemsCarried(i);
  return {
    health: h,
    resolve: resolve(i.attributes, i.scars, i.grief),
    resolve_unclamped: resolveUnclamped(i.attributes, i.scars, i.grief),
    minimum_stress: min,
    stress_effective: effectiveStress(i.stress, min),
    untreated_critical_injuries: untreated,
    boxes_crossed_off: boxesCrossedOff(untreated, h),
    current_health: current,
    health_boxes: healthBoxes(h, untreated, i.healthLost),
    down_by_rule: downByRule(current, i.injuries),
    carrying_limit: limit,
    items_carried: items,
    overloaded: overloaded(items, limit),
    jammed: jammed(i.odm),
    lame: lame(i.horse),
  };
}

/** A Foe's current Health: its row's Health minus damage taken, never below 0. */
export function foeCurrentHealth(rating: number, lost: number): number {
  return Math.max(0, rating - Math.max(lost, 0));
}
