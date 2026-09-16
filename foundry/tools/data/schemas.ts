/**
 * Schemas for every file in data/ the system reads (ADR-0012, ADR-0025).
 *
 * Rows the system turns into documents are strict: a field that is added, renamed, or retyped
 * fails the build, so a rules change cannot slip past the Foundry system unread. Documents are
 * loose at the top level (they carry drafting metadata the system never reads), but every key the
 * system does read is listed. Formula strings the code implements are literals: changing the rule
 * in the YAML fails the build until the code follows.
 */
import { z } from 'zod';

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a kebab-case id');
const text = z.string().min(1);
const meta = {
  decided: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  adrs: z.array(z.string()).optional(),
};

export const ATTRIBUTE_IDS = ['strength', 'agility', 'wits', 'perception', 'instinct', 'empathy'] as const;
export const attributeId = z.enum(ATTRIBUTE_IDS);
export const INJURY_TYPES = ['crush', 'bite', 'burn', 'cut', 'pierce'] as const;
export const injuryType = z.enum(INJURY_TYPES);

// ---------------------------------------------------------------- character/attributes.yaml

export const attributesFile = z.looseObject({
  id: z.literal('attributes'),
  scale: z.looseObject({
    min: z.literal(2),
    max: z.literal(5),
    max_key_attribute: z.literal(6),
  }),
  attributes: z
    .array(
      z.strictObject({
        id: attributeId,
        name: text,
        summary: text,
        used_by: z.array(id),
        key_attribute_of: z.array(id),
      }),
    )
    .length(6),
  derived_values: z.tuple([
    z.looseObject({ id: z.literal('health'), formula: z.literal('(strength + agility) / 2'), rounding: z.literal('up') }),
    z.looseObject({
      id: z.literal('resolve'),
      formula: z.literal('(instinct + empathy) / 2, plus 1 per Scar, minus 1 per point of Grief (at most 3 points count)'),
      rounding: z.string().startsWith('up'),
    }),
    z.looseObject({ id: z.literal('minimum-stress'), formula: z.literal('number of Scars') }),
    z.looseObject({ id: z.literal('stress'), at_creation: z.literal(0) }),
    z.looseObject({ id: z.literal('carrying-limit'), formula: z.literal('strength + 4') }),
  ]),
});

// ---------------------------------------------------------------- character/action-catalog.yaml

export const ACTION_KINDS = ['action', 'reaction', 'roll', 'option', 'fixed-roll'] as const;
export const ROLLED = ['when_taken', 'when_a_rule_calls', 'when_called', 'never'] as const;
export const CONTEXTS = ['titan-engagement', 'any', 'lifepath'] as const;

export const actionEntry = z.strictObject({
  id,
  name: text,
  kind: z.enum(ACTION_KINDS),
  rolled: z.enum(ROLLED),
  attribute: z.union([attributeId, z.literal('from_performance_attributes'), z.null()]),
  gear: z.array(id).optional(),
  requires_gear: z.boolean().optional(),
  without_gear: z.enum(['not_possible', 'attribute_alone']).optional(),
  context: z.enum(CONTEXTS),
  requirements: text,
  needs: z.union([text, z.number().int()]).optional(),
  changes: z.array(id),
  help_outside_titan_engagement: text.optional(),
  notes: text.optional(),
  option_of: text.optional(),   // an entry id or a prose description of the procedure
  ...meta,
});

export const actionCatalogFile = z.looseObject({
  id: z.literal('action-catalog'),
  tracked_values: z.array(z.looseObject({ id, name: text })),
  entries: z.array(actionEntry).min(1),
});

// ---------------------------------------------------------------- character/talents.yaml

export const TALENT_LIMITS = [
  'none',
  'once_per_titan_engagement',
  'once_per_leg',
  'once_per_night_camp',
  'once_per_skirmish',
  'once_per_downtime',
] as const;

export const talentRow = z
  .strictObject({
    id,
    name: text,
    description: text,
    type: z.enum(['dice', 'rule']),
    max_level: z.number().int().min(1).max(3),
    names: z.array(id).min(1),
    specialties: z.array(id),
    condition: z.record(id, text).optional(),
    trigger: text.optional(),
    effect: text.optional(),
    limit: z.enum(TALENT_LIMITS).optional(),
    ...meta,
  })
  .superRefine((t, ctx) => {
    if (t.type === 'rule' && (!t.trigger || !t.effect)) ctx.addIssue({ code: 'custom', message: `rule Talent "${t.id}" needs a trigger and an effect` });
    if (t.type === 'dice' && (t.trigger || t.effect)) ctx.addIssue({ code: 'custom', message: `dice Talent "${t.id}" has a trigger or an effect` });
    for (const key of Object.keys(t.condition ?? {})) {
      if (!t.names.includes(key)) ctx.addIssue({ code: 'custom', message: `Talent "${t.id}" has a condition for "${key}", which it does not name` });
    }
  });

export const talentsFile = z.looseObject({
  id: z.literal('talents'),
  talent_rules: z.looseObject({
    levels: z.looseObject({ min: z.literal(0), max: z.literal(3), max_at_creation: z.literal(2) }),
  }),
  talents: z.array(talentRow).min(1),
});

// ---------------------------------------------------------------- character/specialties.yaml

export const specialtyRow = z.strictObject({
  id,
  name: text,
  key_attribute: attributeId,
  summary: text,
  talents: z.array(id).length(8),
  squadmate_template: id,
});

export const specialtiesFile = z.looseObject({
  id: z.literal('specialties'),
  specialties: z.array(specialtyRow).length(9),
  general: z.strictObject({ id: z.literal('general'), name: text, summary: text, talents: z.array(id) }),
});

// ---------------------------------------------------------------- character/origins.yaml

export const originRow = z.strictObject({
  id,
  results: z.array(z.number().int().min(11).max(66)).min(1),
  name: text,
  description: text,
  attributes: z.array(attributeId).length(2),
  talent_choice: z.array(id).length(2),
  haven_choice: z.array(text).length(2),
  canon_tie: z.strictObject({ character: text, link: text }).nullable(),
  condition: z.strictObject({ campaign_year_min: z.number().int() }).nullable(),
});

export const originsFile = z.looseObject({
  id: z.literal('origins'),
  roll: z.literal('D66'),
  rows: z.array(originRow).min(1),
});

// ---------------------------------------------------------------- character/squadmates.yaml

export const squadmateTemplate = z.strictObject({
  id,
  specialty: id,
  attributes: z.strictObject(Object.fromEntries(ATTRIBUTE_IDS.map((a) => [a, z.number().int().min(2).max(4)])) as Record<(typeof ATTRIBUTE_IDS)[number], z.ZodNumber>),
  talent: z.strictObject({ id, level: z.literal(1) }),
  health: z.number().int(),
  resolve: z.number().int(),
});

export const squadmatesFile = z.looseObject({
  id: z.literal('squadmates'),
  stat_block: z.looseObject({
    fields: z.array(z.union([z.string(), z.strictObject({ include: z.literal('data/harm/sheet-fields.yaml') })])),
    not_recorded: z.array(z.string()),
  }),
  templates: z.array(squadmateTemplate).length(9),
});

// ---------------------------------------------------------------- character/lifepath.yaml (record_on_sheet)

export const RECORD_ON_SHEET = [
  'name',
  'origin',
  'haven',
  'canon_tie',
  'drive',
  'drive_named_comrade',
  'drive_used_this_session',
  'attributes',
  'specialty',
  'talents',
  'merit',
  'class_rank',
  'declined_military_police',
  'rank',
  'health',
  'health_lost',
  'down',
  'resolve',
  'stress',
  'minimum_stress',
  'scars',
  'grief',
  'critical_injuries',
  'gear',
] as const;

export const lifepathFile = z.looseObject({
  id: z.literal('lifepath'),
  record_on_sheet: z.tuple([
    ...RECORD_ON_SHEET.map((f) => z.literal(f)),
    z.strictObject({ include: z.literal('data/harm/sheet-fields.yaml') }),
  ] as unknown as [z.ZodLiteral<string>, ...z.ZodTypeAny[]]),
  record_on_sheet_built: z.strictObject({ merit: z.literal('none'), class_rank: z.literal('none'), declined_military_police: z.literal(false) }),
});

// ---------------------------------------------------------------- harm/sheet-fields.yaml

export const HARM_FIELDS = [
  'critical_injuries',
  'healed_permanent_injuries',
  'lasting_stress_responses',
  'rallied_outside_titan_engagement_by',
  'next_roll_penalty',
  'pending_fear_results',
  'dropped_blade_sets',
  'pinned',
  'prosthetics',
  'faced_a_titan',
  'killed_a_person',
  'scars',
  'stabilized_injuries_scarred',
  'retiring',
] as const;

export const CRITICAL_INJURY_RECORDS = ['row', 'side', 'injury_type', 'treated', 'time_limit', 'healing_days_left', 'halved'] as const;

export const harmSheetFieldsFile = z.looseObject({
  id: z.literal('sheet-fields'),
  derived: z.tuple([
    z.looseObject({
      id: z.literal('current_health'),
      boxes_crossed_off: z.literal('min(untreated_critical_injuries, health)'),
      formula: z.literal('max(0, health - min(untreated_critical_injuries, health) - health_lost)'),
    }),
  ]),
  fields: z
    .array(z.looseObject({ id: z.enum(HARM_FIELDS), each_records: z.array(z.string()).optional() }))
    .refine((f) => f.map((x) => x.id).join() === HARM_FIELDS.join(), 'the harm sheet fields changed: update the models'),
});

// ---------------------------------------------------------------- gear/sheet-fields.yaml

export const GEAR_FIELDS = [
  'odm_gear',
  'gas_rating',
  'spare_canisters',
  'blade_set_in_handles',
  'blade_sets_carried',
  'horse',
  'medical_kits',
  'tool_kits',
  'firearms',
  'kept_items',
  'left_at',
  'positions',
  'airborne',
  'focus_titan_label',
  'carrying',
  'carried_by',
] as const;

export const gearSheetFieldsFile = z.looseObject({
  id: z.literal('gear-sheet-fields'),
  fields: z
    .array(z.looseObject({ id: z.enum(GEAR_FIELDS) }))
    .refine((f) => f.map((x) => x.id).join() === GEAR_FIELDS.join(), 'the gear sheet fields changed: update the models'),
  derived: z.tuple([
    z.looseObject({ id: z.literal('items_carried') }),
    z.looseObject({ id: z.literal('carrying_limit'), formula: z.literal('strength + 4') }),
    z.looseObject({ id: z.literal('overloaded'), formula: z.literal('items_carried > carrying_limit') }),
    z.looseObject({ id: z.literal('jammed'), formula: z.literal('odm_gear.current == 0') }),
    z.looseObject({ id: z.literal('lame'), formula: z.literal('horse.current == 0') }),
  ]),
});

// ---------------------------------------------------------------- gear/items.yaml, carrying.yaml, odm-gear.yaml

export const GEAR_ITEM_IDS = [
  'odm-gear',
  'gas-canister',
  'blade-set',
  'horse',
  'medical-kit',
  'tool-kit',
  'flintlock-pistol',
  'musket',
  'prosthetic-arm',
  'prosthetic-leg',
] as const;

export const gearItemRow = z.strictObject({
  id: z.enum(GEAR_ITEM_IDS),
  name: text,
  rated: z.boolean(),
  gear_dice_for: z.array(id).optional(),
  wear: text.optional(),
  at_zero: z.strictObject({ state: z.string(), effect: text }).optional(),
  counts_as_not_had: z.array(text).optional(),
  restored_by: z.array(text).optional(),
  items_counted: z.number().int().min(0),
  items_note: text.optional(),
  passable: z.boolean(),
  holds: text.optional(),
  fitted: text.optional(),
  received: text.optional(),
  loaded: text.optional(),
  titan_engagement: text.optional(),
  never: text.optional(),
});

export const gearItemsFile = z.looseObject({
  id: z.literal('gear-items'),
  items: z
    .array(gearItemRow)
    .refine((rows) => rows.map((r) => r.id).join() === GEAR_ITEM_IDS.join(), 'the gear item list changed: update GEAR_ITEM_IDS and the gear model'),
});

export const carryingFile = z.looseObject({
  id: z.literal('carrying'),
  limit: z.looseObject({ formula: z.literal('strength + 4') }),
  items_counted: z.array(z.looseObject({ what: text, items: z.number().int().min(0) })),
});

export const odmGearFile = z.looseObject({
  id: z.literal('odm-gear'),
  gas: z.looseObject({ full_gas_rating: z.number().int().min(1) }),
  gas_roll: z.looseObject({
    dice: z.looseObject({ standard: z.number().int(), after_pushed_odm_roll: z.number().int(), maximum: z.number().int(), squadmate: z.number().int() }),
  }),
});

export const standardIssueFile = z.looseObject({
  id: z.literal('standard-issue'),
  funding: z.looseObject({ until_funding_rules: z.number().int().min(1).max(6) }),
  by_funding: z.array(
    z.looseObject({
      funding: z.number().int(),
      odm_gear_rating: z.number().int(),
      spare_canisters: z.number().int(),
      blade_sets: z.number().int(),
      horse_rating: z.number().int(),
    }),
  ),
  every_row: z.looseObject({ blade_set_rating: z.number().int().min(1).max(3) }),
  by_specialty: z.looseObject({
    rows: z.array(z.strictObject({ specialty: id, item: z.enum(['medical-kit', 'tool-kit']), rating: z.number().int().min(1).max(3) })),
  }),
});

// ---------------------------------------------------------------- harm/critical-injuries.yaml

const effect = z.looseObject({ type: id });
const penaltyEffect = z.strictObject({ type: z.literal('penalty'), dice: z.number().int(), entries: z.array(id) });
const stressGainEffect = z.strictObject({ type: z.literal('stress-gain'), amount: z.number().int() });
const injuryEffect = z.union([penaltyEffect, stressGainEffect]);

export const criticalInjuryRow = z.union([
  z.strictObject({
    id,
    names: z.strictObject(Object.fromEntries(INJURY_TYPES.map((t) => [t, text])) as Record<(typeof INJURY_TYPES)[number], z.ZodString>),
    results: z.strictObject({ min: z.number().int().nullable(), max: z.number().int().nullable() }),
    instant_death: z.literal(true),
  }),
  z.strictObject({
    id,
    names: z.strictObject(Object.fromEntries(INJURY_TYPES.map((t) => [t, text])) as Record<(typeof INJURY_TYPES)[number], z.ZodString>),
    results: z.strictObject({ min: z.number().int().nullable(), max: z.number().int().nullable() }),
    down: z.union([z.literal(false), z.literal('until_treated')]),
    lethal: z.boolean(),
    time_limit: z.enum(['turn', 'engagement', 'day']).nullable(),
    death_roll_penalty: z.number().int().min(0),
    effects: z.array(injuryEffect),
    healing_days: z.number().int().min(0),
    permanent_effects: z.array(injuryEffect).optional(),
    repeat_row: id.optional(),
  }),
]);

const typeRider = z.strictObject({
  rows: z.array(id).optional(),
  all_rows: z.literal(true).optional(),
  lethal_rows: z.literal(true).optional(),
  sets: z
    .strictObject({
      time_limit: z.enum(['turn', 'engagement', 'day']).optional(),
      healing_days_multiplier: z.number().optional(),
      heals_untreated: z.boolean().optional(),
    })
    .optional(),
  treat_injury: z.union([z.literal('requires_kit_or_supplies'), z.strictObject({ penalty: z.number().int() })]).optional(),
});

export const INJURY_LOCATIONS = ['arm', 'leg', 'torso', 'head'] as const;

const injuryTable = z.strictObject({
  injury_location: z.enum(INJURY_LOCATIONS),
  non_lethal_cap: id,
  type_riders: z.partialRecord(injuryType, z.array(typeRider)),
  rows: z.array(criticalInjuryRow).min(1),
});

export const criticalInjuriesFile = z.looseObject({
  id: z.literal('critical-injuries'),
  types: z.array(z.looseObject({ id: injuryType, name: text })).length(5),
  sides: z.looseObject({ sided_locations: z.tuple([z.literal('arm'), z.literal('leg')]), values: z.tuple([z.literal('left'), z.literal('right')]) }),
  tables: z.strictObject({ arm: injuryTable, leg: injuryTable, torso: injuryTable, head: injuryTable }),
});

export const downFile = z.looseObject({
  id: z.literal('down'),
  conditions: z.tuple([z.looseObject({ id: z.literal('zero-health') }), z.looseObject({ id: z.literal('down-row') })]),
});

// ---------------------------------------------------------------- titans

export const TITAN_TIERS = ['terrorize', 'control', 'kill', 'thrash'] as const;
export const POSITIONS = ['distant', 'in-reach', 'on-body', 'blind-spot'] as const;
export const BODY_PART_KINDS = ['eyes', 'arm', 'leg'] as const;

const titanEffect = z.union([
  z.strictObject({ type: z.literal('stress'), amount: z.number().int().min(1) }),
  z.strictObject({ type: z.literal('telegraph') }),
  z.strictObject({ type: z.literal('knock-loose') }),
  z.strictObject({ type: z.literal('grab') }),
  z.strictObject({
    type: z.literal('critical-injury'),
    injury_location: z.enum([...INJURY_LOCATIONS, 'rolled']),
    injury_type: injuryType,
    cannot_be_lethal: z.boolean(),
  }),
]);

export const behaviorEntry = z.strictObject({
  id,
  name: text,
  results: z.array(z.number().int().min(1).max(6)),
  tier: z.enum(TITAN_TIERS),
  targets: z.enum(['holder', 'holder-and-position']),
  position_requirement: z.array(z.enum(POSITIONS)).min(1),
  body_parts_used: z.array(z.enum(BODY_PART_KINDS)),
  attack_dice: z.union([z.literal(3), z.literal(6), z.literal(9), z.literal(12)]).nullable().optional(),
  effects: z.array(titanEffect),
  fallback: z.union([id, z.literal('none')]),
  text,
});

export const titanFile = z
  .looseObject({
    id,
    name: text,
    size_class: z.enum(['small', 'medium', 'large']),
    abnormal: z.boolean(),
    tempo: z.number().int().min(1),
    nape_depth: z.number().int().min(1),
    regeneration_clock: z.number().int().min(1),
    heave: z.number().int().min(1),
    body_parts: z.array(z.strictObject({ id, kind: z.enum(BODY_PART_KINDS), toughness: z.number().int().min(1) })).min(1),
    attention_ladder: id,
    behavior_table: z.strictObject({ roll: z.literal('D6'), entries: z.array(behaviorEntry).min(2) }),
  })
  .superRefine((t, ctx) => {
    const ids = new Set(t.behavior_table.entries.map((e) => e.id));
    const covered = t.behavior_table.entries.flatMap((e) => e.results).sort();
    if (covered.join() !== '1,2,3,4,5,6') ctx.addIssue({ code: 'custom', message: `${t.id}: results 1 to 6 must each belong to one entry` });
    const thrash = t.behavior_table.entries.filter((e) => e.tier === 'thrash');
    if (thrash.length !== 1 || thrash[0].results.length) ctx.addIssue({ code: 'custom', message: `${t.id}: exactly one unrolled Thrash entry` });
    for (const e of t.behavior_table.entries) {
      if (e.fallback !== 'none' && !ids.has(e.fallback)) ctx.addIssue({ code: 'custom', message: `${t.id}: "${e.id}" falls back to a missing entry` });
    }
  });

export const titanIndexFile = z.looseObject({
  id: z.literal('chapter-6-titans'),
  standard_titans: z.strictObject({ small: id, medium: id, large: id }),
  abnormals: z.array(z.looseObject({ id, size_class: z.enum(['small', 'medium', 'large']) })),
  ladders: z.array(z.looseObject({ id, name: text, rungs: z.array(id) })),
});

export const sizeClassesFile = z.looseObject({
  id: z.literal('size-classes'),
  classes: z.array(
    z.looseObject({
      id: z.enum(['small', 'medium', 'large']),
      name: text,
      height: text,
      tempo: z.number().int(),
      nape_depth: z.number().int(),
      regeneration_clock: z.number().int(),
      toughness: z.strictObject({ eyes: z.number().int(), arm: z.number().int(), leg: z.number().int() }),
      attack_dice: z.strictObject({ terrorize: z.number().int(), control: z.number().int(), kill: z.number().int() }),
      raises_fall_band: z.boolean(),
      heave: z.number().int(),
    }),
  ),
  grip_toughness: z.number().int(),
});

export const titanFormatFile = z.looseObject({
  id: z.literal('titan-format'),
  titan_dice: z.looseObject({ success_faces: z.tuple([z.literal(5), z.literal(6)]) }),
  effect_types: z.array(z.looseObject({ id })).refine((e) => e.map((x) => x.id).join() === 'stress,critical-injury,knock-loose,grab,telegraph', 'the Titan effect types changed'),
});

// ---------------------------------------------------------------- skirmish/foes.yaml

export const foeRow = z.strictObject({
  id,
  name: text,
  who: text,
  attack_dice: z.number().int().min(1),
  guard_dice: z.number().int().min(0),
  health: z.number().int().min(1),
  grit: z.number().int().min(1),
  parley: z.number().int().min(1),
  watch: z.number().int().min(1),
  group_size: z.strictObject({ fixed: z.number().int().min(1) }),
  fight_weapon: z.union([
    id,
    z.strictObject({
      roll: text,
      rows: z.array(z.strictObject({ results: z.array(z.number().int().min(1).max(6)), weapon: id })),
      at_night: z.strictObject({ replaces: id, with: id }).optional(),
    }),
  ]),
  shoot_weapon: id.nullable(),
});

export const foesFile = z.looseObject({
  id: z.literal('foes'),
  foes: z.array(foeRow).min(1),
});

// ---------------------------------------------------------------- core

export const dicePoolFile = z.looseObject({
  id: z.literal('dice-pool'),
  die_types: z.array(
    z.looseObject({
      id: z.enum(['base', 'gear', 'stress']),
      name: text,
      success_faces: z.array(z.number().int()),
      push_re_rolls_faces: z.array(z.number().int()),
      push_keeps_faces: z.array(z.number().int()),
    }),
  ),
  components: z.array(z.looseObject({ id: z.enum(['attribute', 'talent', 'bonus', 'penalty', 'gear', 'stress']) })),
  roll_exceptions: z.array(
    z.looseObject({
      roll: id,
      entries: z.array(id).optional(),
      components_excluded: z.array(z.enum(['attribute', 'talent', 'bonus', 'gear', 'stress'])),
      push_allowed: z.boolean(),
    }),
  ),
});

export const circumstancesFile = z.looseObject({
  id: z.literal('circumstances'),
  default: z.literal('standard'),
  steps: z
    .array(z.strictObject({ id, name: text, dice: z.number().int(), kind: z.enum(['bonus', 'none', 'penalty']) }))
    .length(7),
});

export const bonusDiceSourcesFile = z.looseObject({
  id: z.literal('bonus-dice-sources'),
  cap_per_roll: z.number().int().min(1),
  die_type: z.literal('base'),
});

// ---------------------------------------------------------------- mind/scars.yaml, mind/stress-responses.yaml

/** A Scar or Stress Response effect as the sheet reads it: penalties name entries, the rest is shown by type. */
const mindEffect = z.union([
  penaltyEffect.extend({ applies_to: text.optional() }),
  z.looseObject({ type: z.enum(['stress-gain', 'fear-roll-total', 'other', 'push-stress', 'lose-successes', 'spend-next-turn', 'zero-successes']) }),
]);

export const scarsFile = z.looseObject({
  id: z.literal('scars'),
  gaining: z.looseObject({ maximum: z.number().int().min(1) }),
  table: z.looseObject({
    roll: z.literal('D66'),
    rows: z
      .array(
        z.strictObject({
          id,
          name: text,
          results: z.array(z.number().int().min(11).max(66)).min(1),
          trigger: text,
          effects: z.array(mindEffect),
          squadmate_rerolls: z.boolean().optional(),
        }),
      )
      .min(1),
  }),
});

export const stressResponsesFile = z.looseObject({
  id: z.literal('stress-responses'),
  table: z.looseObject({
    roll: z.literal('D6 + Stress - Resolve'),
    rows: z
      .array(
        z.strictObject({
          id,
          name: text,
          results: z.strictObject({ min: z.number().int().nullable(), max: z.number().int().nullable() }),
          duration: z.enum(['instant', 'lasting']),
          text,
          effects: z.array(mindEffect),
        }),
      )
      .min(1),
  }),
});

// ---------------------------------------------------------------- site player wording

export const talentWordingFile = z.looseObject({
  talents: z.record(
    id,
    z.strictObject({ trigger: text.optional(), effect: text.optional(), condition: z.record(id, text).optional() }),
  ),
});

export const gearWordingFile = z.looseObject({
  items: z.record(
    id,
    z.strictObject({
      what: text,
      not_had: z.array(text),
      at_zero: text,
      wear: text,
      restore: z.array(text),
      carried: text,
      extra: z.array(text).optional(),
    }),
  ),
});

export const actionWordingFile = z.looseObject({
  actions: z.record(
    id,
    z.strictObject({
      requires: z.array(text).optional(),
      needs: text.optional(),
      does: z.array(text),
      help: text.optional(),
      gear_note: text.optional(),
      pages: z.array(z.string()),
    }),
  ),
});

export { effect };

// ---------------------------------------------------------------- engagement/attention.yaml

export const attentionFile = z.looseObject({
  id: z.literal('attention'),
  tests: z.array(z.looseObject({ id, meaning: text, down_can_meet: z.boolean() })).min(1),
  ladders: z.array(z.looseObject({ id: z.literal('standard'), name: text, rungs: z.array(id).min(1) })).length(1),
});

// ---------------------------------------------------------------- engagement/titan-harm.yaml
// The sheet applies these steps in code (src/rules/titan.ts); a changed list fails the build.

export const titanHarmFile = z.looseObject({
  id: z.literal('titan-harm'),
  body_part_kinds: z.array(z.looseObject({ id: z.enum(['eyes', 'arm', 'leg']), strike_from: z.array(id), when_broken: text })).length(3),
  states: z.looseObject({ order: z.tuple([z.literal('intact'), z.literal('wounded'), z.literal('broken')]) }),
  regeneration: z.looseObject({
    when_full: z
      .array(text)
      .length(5)
      .refine(
        (s) => /Erase every Opening/.test(s[0]) && /count to 0/.test(s[1]) && /most damaged Body Part/.test(s[2]) && /steam table/.test(s[3]) && /Empty the clock/.test(s[4]),
        'the Regeneration steps changed; update src/rules/titan.ts (regenerate)',
      ),
  }),
});

// ---------------------------------------------------------------- skirmish/skirmish.yaml (weapons)

export const skirmishFile = z.looseObject({
  id: z.literal('skirmish'),
  weapons: z.looseObject({
    rows: z.array(
      z.looseObject({
        id,
        name: text,
        used_with: z.enum(['fight', 'shoot']),
        injury_type: injuryType,
        damage: z.number().int().min(0),
        target: z.enum(['engaged', 'apart', 'either']),
      }),
    ),
  }),
});
