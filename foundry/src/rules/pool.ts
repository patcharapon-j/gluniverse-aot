/**
 * The pool an Action Catalog entry would roll right now, as the sheet shows it before any roll
 * (data/core/dice-pool.yaml, components; data/character/action-catalog.yaml, gear_requirement).
 * Pure: no Foundry globals. Bonus Dice and Circumstances are named at roll time (step 2d), so the
 * preview takes a Bonus count but never a Circumstances step.
 */
import type { AttributeId, Attributes } from './derived.ts';

export type PoolComponent = 'attribute' | 'talent' | 'bonus' | 'gear' | 'stress';

export interface PoolEntry {
  id: string;
  attribute: string | null;
  gear: readonly string[];
  requiresGear: boolean;
  withoutGear: string | null;
}

export interface PoolTalent {
  id: string;
  name: string;
  type: 'dice' | 'rule';
  level: number;
  names: readonly string[];
  /** Entry id to condition text: the Talent adds dice to that entry only when the condition holds. */
  condition: Readonly<Record<string, string>>;
}

export interface PoolGear {
  itemId: string;
  name: string;
  /** The item's current Gear Dice: 0 when worn down, and 0 for a state that counts as not had. */
  dice: number;
}

export interface PoolPenalty {
  source: string;
  dice: number;
  entries: readonly string[] | 'all';
  /** Set when the penalty applies only in a narrower case (a Scar's trigger); the preview lists it but does not count it. */
  conditional?: string;
}

export interface PoolInputs {
  entry: PoolEntry;
  attributes: Attributes;
  talents: readonly PoolTalent[];
  gear: readonly PoolGear[];
  penalties: readonly PoolPenalty[];
  stress: number;
  bonus?: number;
  bonusCap?: number;
  /** data/core/dice-pool.yaml penalty.min_base_dice_after. */
  penaltyFloor?: number;
  /** Components this entry leaves out (data/core/dice-pool.yaml, roll_exceptions). */
  excluded?: readonly PoolComponent[];
}

export interface PoolPreview {
  /** Why the entry cannot be rolled, or null. */
  blocked: 'no-gear' | 'no-attribute' | null;
  /** The entry's gear requirement leaves only the attribute (no Talent dice, no Gear Dice). */
  attributeAlone: boolean;
  attribute: { id: AttributeId; dice: number } | null;
  talent: { id: string; name: string; dice: number } | null;
  /** Dice Talents that name the entry but only under a condition. */
  conditionalTalents: { id: string; name: string; dice: number; condition: string }[];
  bonus: number;
  /** Penalties counted, and the ones listed only (conditional). */
  penalties: { source: string; dice: number }[];
  conditionalPenalties: { source: string; dice: number; condition: string }[];
  /** Base dice each penalty die removed, taken from Bonus Dice first, then Talent dice, then the attribute. */
  removed: { bonus: number; talent: number; attribute: number };
  base: number;
  gear: { itemId: string; name: string; dice: number } | null;
  stress: number;
  total: number;
}

const ATTRIBUTES: readonly string[] = ['strength', 'agility', 'wits', 'perception', 'instinct', 'empathy'];

/** Builds the preview pool for one entry. */
export function previewPool(i: PoolInputs): PoolPreview {
  const excluded = new Set(i.excluded ?? []);
  const floor = i.penaltyFloor ?? 1;
  const empty: PoolPreview = {
    blocked: 'no-attribute',
    attributeAlone: false,
    attribute: null,
    talent: null,
    conditionalTalents: [],
    bonus: 0,
    penalties: [],
    conditionalPenalties: [],
    removed: { bonus: 0, talent: 0, attribute: 0 },
    base: 0,
    gear: null,
    stress: 0,
    total: 0,
  };
  const attrId = i.entry.attribute;
  if (!attrId || !ATTRIBUTES.includes(attrId)) return empty;

  // Gear: the best item the entry allows that is had (current rating above 0).
  const usable = i.gear.filter((g) => i.entry.gear.includes(g.itemId) && g.dice > 0).sort((a, b) => b.dice - a.dice);
  const hasGear = usable.length > 0;
  let attributeAlone = false;
  if (i.entry.requiresGear && !hasGear) {
    if (i.entry.withoutGear === 'not_possible') return { ...empty, blocked: 'no-gear' };
    attributeAlone = true;
  }

  const attribute = { id: attrId as AttributeId, dice: excluded.has('attribute') ? 0 : i.attributes[attrId as AttributeId] };

  // Talent: at most one dice Talent counts; the highest level whose condition does not apply.
  let talent: PoolPreview['talent'] = null;
  const conditionalTalents: PoolPreview['conditionalTalents'] = [];
  if (!attributeAlone && !excluded.has('talent')) {
    for (const t of i.talents) {
      if (t.type !== 'dice' || t.level <= 0 || !t.names.includes(i.entry.id)) continue;
      const condition = t.condition[i.entry.id];
      if (condition) conditionalTalents.push({ id: t.id, name: t.name, dice: t.level, condition });
      else if (!talent || t.level > talent.dice) talent = { id: t.id, name: t.name, dice: t.level };
    }
  }

  const bonus = excluded.has('bonus') ? 0 : Math.max(0, Math.min(i.bonus ?? 0, i.bonusCap ?? 4));

  const penalties: PoolPreview['penalties'] = [];
  const conditionalPenalties: PoolPreview['conditionalPenalties'] = [];
  for (const p of i.penalties) {
    if (p.dice <= 0) continue;
    if (p.entries !== 'all' && !p.entries.includes(i.entry.id)) continue;
    if (p.conditional) conditionalPenalties.push({ source: p.source, dice: p.dice, condition: p.conditional });
    else penalties.push({ source: p.source, dice: p.dice });
  }

  const talentDice = talent?.dice ?? 0;
  const raw = attribute.dice + talentDice + bonus;
  const wanted = penalties.reduce((n, p) => n + p.dice, 0);
  const base = Math.max(Math.min(floor, raw), raw - wanted);
  let cut = raw - base;
  const take = (n: number) => {
    const k = Math.min(n, cut);
    cut -= k;
    return k;
  };
  const removed = { bonus: take(bonus), talent: take(talentDice), attribute: 0 };
  removed.attribute = take(attribute.dice);

  const gear = !attributeAlone && hasGear && !excluded.has('gear') ? { itemId: usable[0].itemId, name: usable[0].name, dice: usable[0].dice } : null;
  const stress = excluded.has('stress') ? 0 : Math.max(0, i.stress);

  return {
    blocked: null,
    attributeAlone,
    attribute,
    talent,
    conditionalTalents,
    bonus,
    penalties,
    conditionalPenalties,
    removed,
    base,
    gear,
    stress,
    total: base + (gear?.dice ?? 0) + stress,
  };
}
