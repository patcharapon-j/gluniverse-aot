/**
 * Shared field builders for the system's TypeDataModels. Field names follow data/ exactly
 * (core-plan section 3). Built lazily from `foundry.data.fields`, which exists once Foundry loads.
 */
import type { AttributeId } from '../rules/derived.ts';

export const ATTRIBUTE_IDS: AttributeId[] = ['strength', 'agility', 'wits', 'perception', 'instinct', 'empathy'];
export const INJURY_TYPES = ['crush', 'bite', 'burn', 'cut', 'pierce'] as const;
export const INJURY_LOCATIONS = ['arm', 'leg', 'torso', 'head'] as const;
export const SIDES = ['left', 'right'] as const;
export const POSITIONS = ['distant', 'in-reach', 'on-body', 'blind-spot'] as const;
export const TIME_LIMITS = ['turn', 'engagement', 'day'] as const;
export const RANKS = ['private', 'squad-leader', 'section-commander'] as const;
export const STRESS_RESPONSE_ENDS = ['titan-engagement-end', 'day', 'rule'] as const;
export const FEAR_EFFECTS = ['forced-move', 'forced-action'] as const;

/** Builds the field helpers. Call inside a hook, never at module load. */
export function fieldKit() {
  const f = foundry.data.fields;

  const int = (initial: number, opts: Record<string, unknown> = {}) =>
    new f.NumberField({ required: true, nullable: false, integer: true, initial, ...opts });
  const nonNeg = (initial = 0, opts: Record<string, unknown> = {}) => int(initial, { min: 0, ...opts });
  const bool = (initial = false) => new f.BooleanField({ required: true, initial });
  const str = (initial = '', opts: Record<string, unknown> = {}) => new f.StringField({ required: true, blank: true, initial, ...opts });
  const choice = (choices: readonly string[], initial: string | null, opts: Record<string, unknown> = {}) =>
    new f.StringField({ required: true, blank: false, nullable: initial === null, initial, choices: [...choices], ...opts });
  const nullableInt = (opts: Record<string, unknown> = {}) => new f.NumberField({ required: true, nullable: true, integer: true, initial: null, ...opts });
  const strings = () => new f.ArrayField(new f.StringField({ required: true, blank: false }));
  const html = () => new f.HTMLField({ required: true, blank: true, initial: '' });

  /** The six attributes, 2 to 6 (data/character/attributes.yaml, scale). */
  const attributes = (initial = 2) =>
    new f.SchemaField(Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, int(initial, { min: 1, max: 6 })])));

  /**
   * Every field data/harm/sheet-fields.yaml adds beyond record_on_sheet, plus the harm and mind
   * fields record_on_sheet and the Squadmate stat block both list. critical_injuries and
   * prosthetics are embedded Items, so they have no field here.
   */
  const harmAndMind = () => ({
    health_lost: nonNeg(),
    down: bool(),
    stress: nonNeg(),
    grief: nonNeg(0, { max: 3 }),
    scars: new f.ArrayField(new f.SchemaField({ row: str() })),
    healed_permanent_injuries: new f.ArrayField(
      new f.SchemaField({ row: str(), side: choice(SIDES, null) }),
    ),
    lasting_stress_responses: new f.ArrayField(
      new f.SchemaField({ row: str(), ends: choice(STRESS_RESPONSE_ENDS, 'day'), ends_note: str() }),
    ),
    rallied_outside_titan_engagement_by: strings(),
    next_roll_penalty: nonNeg(),
    pending_fear_results: new f.ArrayField(
      new f.SchemaField({ effect: choice(FEAR_EFFECTS, 'forced-move'), toward: str(), titan: str() }),
    ),
    dropped_blade_sets: nonNeg(),
    pinned: new f.SchemaField({
      active: bool(),
      body: str(), // the Focus Titan label of the pinning body
      corpse: bool(),
      limb: choice(['arm', 'leg', 'body'], null),
      side: choice(SIDES, null),
      by_part: str(),
    }),
    faced_a_titan: bool(),
    killed_a_person: bool(),
    stabilized_injuries_scarred: strings(),
    retiring: bool(),
  });

  /** The gear fields data/gear/sheet-fields.yaml records on the actor rather than on an Item. */
  const gearState = (fullGasRating: number) => ({
    gas_rating: nonNeg(0, { max: fullGasRating }),
    spare_canisters: new f.ArrayField(int(1, { min: 1, max: fullGasRating })),
    left_at: new f.SchemaField({ position: choice(POSITIONS, null), titan: str(), items: strings() }),
    positions: new f.SchemaField({
      left: bool(),
      entries: new f.ArrayField(new f.SchemaField({ titan: str(), position: choice(POSITIONS, 'distant') })),
    }),
    airborne: bool(),
    carrying: str(),
    carried_by: str(),
  });

  return { f, int, nonNeg, bool, str, choice, nullableInt, strings, html, attributes, harmAndMind, gearState };
}

export type FieldKit = ReturnType<typeof fieldKit>;
