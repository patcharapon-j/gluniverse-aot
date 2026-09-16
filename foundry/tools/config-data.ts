/**
 * The system configuration baked into the bundle at build time (virtual:wof-config): the Action
 * Catalog (ADR-0025: system config, not items) and the rule constants the client reads. Everything
 * comes from the validated tables, so the client never parses YAML.
 */
import type { Tables } from './data/load.ts';
import { CARRIED_COMRADE_ITEMS, CARRYING_LIMIT_BONUS, MAX_GRIEF_COUNTED } from '../src/rules/derived.ts';

export function gearSubtype(itemId: string): 'odm' | 'blade-set' | 'firearm' | 'horse' | 'kit' | 'prosthetic' | null {
  switch (itemId) {
    case 'odm-gear':
      return 'odm';
    case 'blade-set':
      return 'blade-set';
    case 'flintlock-pistol':
    case 'musket':
      return 'firearm';
    case 'horse':
      return 'horse';
    case 'medical-kit':
    case 'tool-kit':
      return 'kit';
    case 'prosthetic-arm':
    case 'prosthetic-leg':
      return 'prosthetic';
    case 'gas-canister':
      return null; // recorded on the actor as gas_rating and spare_canisters
    default:
      throw new Error(`data/gear/items.yaml: the item "${itemId}" has no gear subtype. Add it to foundry/tools/config-data.ts.`);
  }
}

function checkConstants(t: Tables): void {
  const comrade = t.carrying.items_counted.find((row) => row.what.startsWith('a comrade the soldier carries'));
  if (!comrade) throw new Error('data/gear/carrying.yaml: items_counted has no row for a carried comrade.');
  if (comrade.items !== CARRIED_COMRADE_ITEMS) {
    throw new Error(`data/gear/carrying.yaml: a carried comrade counts as ${comrade.items} items, the code says ${CARRIED_COMRADE_ITEMS}. Update src/rules/derived.ts.`);
  }
  // The formula literals in the schemas pin these; restate them so a code edit cannot drift alone.
  if (CARRYING_LIMIT_BONUS !== 4) throw new Error('src/rules/derived.ts: the carrying limit is strength + 4 (data/gear/carrying.yaml).');
  if (MAX_GRIEF_COUNTED !== 3) throw new Error('src/rules/derived.ts: at most 3 points of Grief count (data/character/attributes.yaml).');
  for (const item of t.gearItems.items) gearSubtype(item.id);
}

export interface MindEffect {
  type: string;
  dice?: number;
  entries?: string[];
  amount?: number;
  /** When a penalty applies only in a narrower case than every roll of its entries. */
  appliesTo?: string;
  text?: string;
}

function mindEffects(effects: readonly Record<string, unknown>[]): MindEffect[] {
  return effects.map((e) => ({
    type: String(e.type),
    ...(typeof e.dice === 'number' ? { dice: e.dice } : {}),
    ...(Array.isArray(e.entries) ? { entries: e.entries as string[] } : {}),
    ...(typeof e.amount === 'number' ? { amount: e.amount } : {}),
    ...(typeof e.applies_to === 'string' ? { appliesTo: e.applies_to } : {}),
    ...(typeof e.text === 'string' ? { text: e.text } : {}),
  }));
}

export function buildConfig(t: Tables) {
  checkConstants(t);
  const funding = t.standardIssue.funding.until_funding_rules;
  return {
    attributes: t.attributes.attributes.map((a) => ({ id: a.id, name: a.name, summary: a.summary })),
    attributeScale: { min: t.attributes.scale.min, max: t.attributes.scale.max, maxKey: t.attributes.scale.max_key_attribute },
    actionCatalog: t.actionCatalog.entries.map((e) => ({
      id: e.id,
      name: e.name,
      kind: e.kind,
      rolled: e.rolled,
      attribute: e.attribute,
      gear: e.gear ?? [],
      requiresGear: e.requires_gear ?? false,
      withoutGear: e.without_gear ?? null,
      context: e.context,
      needs: e.needs ?? null,
      optionOf: e.option_of && /^[a-z-]+$/.test(e.option_of) ? e.option_of : null,
      changes: e.changes,
      talents: t.talents.talents.filter((x) => x.names.includes(e.id)).map((x) => x.id),
    })),
    trackedValues: t.actionCatalog.tracked_values.map((v) => ({ id: v.id, name: v.name })),
    specialties: t.specialties.specialties.map((s) => ({ id: s.id, name: s.name, keyAttribute: s.key_attribute })),
    gearItems: t.gearItems.items.map((i) => ({
      id: i.id,
      name: i.name,
      subtype: gearSubtype(i.id),
      rated: i.rated,
      gearDiceFor: i.gear_dice_for ?? [],
      itemsCounted: i.items_counted,
      passable: i.passable,
      atZero: i.at_zero?.state ?? null,
    })),
    gas: {
      full: t.odmGear.gas.full_gas_rating,
      rollDice: t.odmGear.gas_roll.dice.standard,
      rollDicePushed: t.odmGear.gas_roll.dice.after_pushed_odm_roll,
      rollDiceMax: t.odmGear.gas_roll.dice.maximum,
      rollDiceSquadmate: t.odmGear.gas_roll.dice.squadmate,
    },
    standardIssue: { funding, row: t.standardIssue.by_funding.find((r) => r.funding === funding) ?? null },
    dieTypes: t.dicePool.die_types.map((d) => ({ id: d.id, name: d.name, successFaces: d.success_faces, pushReRolls: d.push_re_rolls_faces })),
    penaltyFloor: Number((t.dicePool.components.find((c) => c.id === 'penalty') as { min_base_dice_after?: unknown } | undefined)?.min_base_dice_after ?? 1),
    rollExceptions: t.dicePool.roll_exceptions.map((r) => ({ roll: r.roll, entries: r.entries ?? [r.roll], excluded: r.components_excluded, pushAllowed: r.push_allowed })),
    titanDice: { successFaces: [...t.titanFormat.titan_dice.success_faces] },
    circumstances: t.circumstances.steps,
    bonusDiceCap: t.bonusDice.cap_per_roll,
    injuryTypes: t.criticalInjuries.types.map((x) => ({ id: x.id, name: x.name })),
    injuryLocations: Object.keys(t.criticalInjuries.tables),
    sidedLocations: [...t.criticalInjuries.sides.sided_locations],
    sizeClasses: t.sizeClasses.classes.map((c) => ({
      id: c.id,
      name: c.name,
      height: c.height,
      tempo: c.tempo,
      napeDepth: c.nape_depth,
      regenerationClock: c.regeneration_clock,
      toughness: c.toughness,
      attackDice: c.attack_dice,
      heave: c.heave,
    })),
    gripToughness: t.sizeClasses.grip_toughness,
    scars: t.scars.table.rows.map((r) => ({ id: r.id, name: r.name, results: r.results, trigger: r.trigger, effects: mindEffects(r.effects) })),
    maxScars: t.scars.gaining.maximum,
    stressResponses: t.stressResponses.table.rows.map((r) => ({
      id: r.id,
      name: r.name,
      lasting: r.duration === 'lasting',
      text: r.text,
      effects: mindEffects(r.effects),
    })),
    maxGrief: MAX_GRIEF_COUNTED,
    attentionLadders: [{ id: 'standard', name: null as string | null }, ...t.titanIndex.ladders.map((l) => ({ id: l.id, name: l.name }))],
  };
}

export type WofConfig = ReturnType<typeof buildConfig>;
