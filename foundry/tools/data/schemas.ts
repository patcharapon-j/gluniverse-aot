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
  // How the Lifepath and the builds set ratings (src/rules/lifepath.ts implements each literal).
  creation: z.looseObject({
    starting_rating: z.literal(2),
    lifepath_points: z.tuple([
      z.looseObject({ source: z.literal('origin'), points: z.literal(2) }),
      z.looseObject({ source: z.literal('why-you-enlisted'), points: z.literal(1) }),
      z.looseObject({ source: z.literal('training-year-event'), points: z.literal(3) }),
    ]),
    cap_before_graduation: z.literal(5),
    overflow: z.string().regex(/above 5 is added instead to another attribute\s+rated below 5, chosen by the player/),
    graduation: z.looseObject({
      key_attribute_minimum: z.literal(4),
      key_attribute_swap: z.string().regex(/swap the key\s+attribute's rating with the highest rating among the other five/),
      key_attribute_floor: z.string().regex(/raise it to 4[\s\S]*lowers by 1 another attribute rated 3 or more/),
      total_unchanged: z.literal(true),
      top_10_key_attribute_bonus: z.literal(1),
      order: z.tuple([z.literal('key_attribute_swap'), z.literal('key_attribute_floor'), z.literal('top_10_key_attribute_bonus')]),
    }),
    free_points: z.literal(0),
    built: z.looseObject({
      total_points: z.literal(18),
      min: z.literal(2),
      max: z.literal(4),
      key_attribute: z.literal(4),
      max_attributes_at_4: z.literal(2),
      free_build: z.looseObject({
        shapes: z.array(z.strictObject({ id, ratings: z.array(z.number().int().min(2).max(4)).length(6) })).min(1),
      }),
    }),
  }),
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
  // No entry carries these today (Chapter 7 calls for every entry); the Lifepath's Talent fallback reads them.
  dormant: z.boolean().optional(),
  reserved: z.boolean().optional(),
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

// ---------------------------------------------------------------- character/enlistment.yaml

export const enlistmentRow = z.strictObject({
  id,
  results: z.array(z.number().int().min(11).max(66)).min(1),
  reason: text,
  attribute: attributeId,
  drive: z.strictObject({
    id,
    name: text,
    trigger: text,
    test: z.enum(['own_state', 'most_recent_turn', 'since_most_recent_turn_start']),
    acts: z.array(id).optional(),
    target: z.enum(['any', 'named_comrade', 'grabbed_or_down_comrade']),
    notes: text.optional(),
    needs_named_comrade: z.boolean(),
  }),
});

export const enlistmentFile = z.looseObject({
  id: z.literal('why-you-enlisted'),
  roll: z.literal('D66'),
  use: z.looseObject({ drive: z.string().regex(/or instead the Drive of any other row/) }),
  rows: z.array(enlistmentRow).min(1),
});

// ---------------------------------------------------------------- character/training-years.yaml

export const trainingEvent = z.strictObject({
  results: z.array(z.number().int().min(11).max(66)).min(1),
  name: text,
  description: text,
  attribute: attributeId,
  talent_choice: z.array(id).length(2),
  merit_change: z.number().int(),
});

const meritBand = z.strictObject({ successes_min: z.number().int().min(0), successes_max: z.number().int().nullable(), merit: z.number().int() });

export const trainingYearsFile = z.looseObject({
  id: z.literal('training-years'),
  event_roll: z.literal('D66'),
  talent_cap: z.looseObject({ max_level_at_creation: z.literal(2), if_both_capped: text, if_only_dormant_can_gain: text }),
  performance_roll: z.looseObject({
    attribute: z.string().startsWith('the higher of'),
    push_allowed: z.literal(false),
    help_allowed: z.literal(false),
    merit_from_successes: z.array(meritBand).min(1),
    replaced_by_graduation_exam: z.literal('year-3'),
  }),
  years: z
    .array(
      z.strictObject({
        id: z.enum(['year-1', 'year-2', 'year-3']),
        name: text,
        performance_attributes: z.array(attributeId).length(2),
        curriculum: z.array(id).min(1),
        events: z.array(trainingEvent).min(1),
      }),
    )
    .length(3),
});

// ---------------------------------------------------------------- character/class-rank.yaml

export const classRankFile = z.looseObject({
  id: z.literal('class-rank'),
  rows: z.array(z.strictObject({ merit_min: z.number().int().nullable(), merit_max: z.number().int().nullable(), class_rank: z.number().int().min(1), top_10: z.boolean() })).min(1),
  top_10: z.looseObject({ key_attribute_bonus: z.literal(1) }),
});

// ---------------------------------------------------------------- character/graduation-exam.yaml

const examTrial = z.strictObject({
  id,
  name: text,
  description: text,
  entry: id.optional(),
  gear_item: text.optional(),
  entry_choice: z.array(z.strictObject({ entry: id, gear_item: text.nullable() })).optional(),
  needs: z.number().int().min(1).optional(),
  push: z.boolean(),
  help: text,
  cover: text.optional(),
  rolled_state: z.looseObject({ id, forbids: z.array(id) }).optional(),
  merit: z.array(meritBand).min(1),
  squad_bonus: z.literal('none').optional(),
});

export const graduationExamFile = z.looseObject({
  id: z.literal('graduation-exam'),
  use: z.looseObject({ replaces: z.string().startsWith('the year-3 performance roll') }),
  conditions: z.looseObject({
    circumstances: z.literal('never'),
    exam_issue: z.array(z.strictObject({ item: text, counts_as: id, gear_dice: z.number().int().min(1) })).min(1),
    stress: z.string().regex(/starts the Exam at Stress 0/),
    stress_responses: z.string().regex(/costs the Cadet 1 Merit/),
  }),
  order: z.array(id).length(3),
  trials: z.array(examTrial).length(3),
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

const LIFEPATH_STEPS = ['campaign-year', 'origin', 'why-you-enlisted', 'training-year-1', 'training-year-2', 'training-year-3', 'graduation', 'finish', 'join-the-squad'] as const;
const BUILT_STEPS = ['campaign-year', 'specialty', 'attributes', 'origin', 'drive', 'training-years', 'talents', 'no-merit', 'finish', 'join-the-squad'] as const;
export const CAMPAIGN_CHOICES = ['lifepath only', 'lifepath and template-build', 'lifepath and free-build', 'lifepath, template-build, and free-build'] as const;

export const lifepathFile = z.looseObject({
  id: z.literal('lifepath'),
  procedures: z.tuple([
    z.looseObject({ id: z.literal('lifepath'), allowed: z.literal('always') }),
    z.looseObject({ id: z.literal('template-build'), allowed: z.literal('when campaign_choice allows it') }),
    z.looseObject({ id: z.literal('free-build'), allowed: z.literal('when campaign_choice allows it') }),
  ]),
  campaign_choice: z.looseObject({ options: z.tuple(CAMPAIGN_CHOICES.map((c) => z.literal(c)) as unknown as [z.ZodLiteral<string>]) }),
  talent_levels_at_creation: z.strictObject({
    total: z.literal(5),
    sources: z.tuple([
      z.strictObject({ source: z.literal('origin'), levels: z.literal(1) }),
      z.strictObject({ source: z.literal('training-year-event'), levels: z.literal(3) }),
      z.strictObject({ source: z.literal('specialty'), levels: z.literal(1) }),
    ]),
  }),
  // The step order the wizard follows, and the Campaign Year range the first step states.
  steps: z
    .array(z.looseObject({ id: z.enum(LIFEPATH_STEPS), order: z.number().int(), does: text }))
    .refine((rows) => rows.map((r) => r.id).join() === LIFEPATH_STEPS.join(), 'the Lifepath steps changed; update src/rules/lifepath.ts and the wizard')
    .refine((rows) => /from (\d{3}) to (\d{3})/.test(rows[0].does), 'the campaign-year step no longer states the Campaign Year range'),
  built_steps: z.looseObject({
    applies_to: z.tuple([z.literal('template-build'), z.literal('free-build')]),
    talent_levels: z.looseObject({
      total: z.literal(5),
      sources: z.tuple([
        z.strictObject({ source: z.literal('origin'), levels: z.literal(1) }),
        z.strictObject({ source: z.literal('specialty'), levels: z.literal(1) }),
        z.strictObject({ source: z.literal('any-talent'), levels: z.literal(3) }),
      ]),
      max_level: z.literal(2),
      max_talents_at_level_2: z.literal(1),
    }),
    steps: z
      .array(z.looseObject({ id: z.enum(BUILT_STEPS), order: z.number().int() }))
      .refine((rows) => rows.map((r) => r.id).join() === BUILT_STEPS.join(), 'the built steps changed; update src/rules/lifepath.ts and the wizard'),
  }),
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

const openRange = z.strictObject({ min: z.number().int().nullable(), max: z.number().int().nullable() });

export const criticalInjuriesFile = z.looseObject({
  id: z.literal('critical-injuries'),
  // The gaining roll (src/rules/engagement/injury.ts) follows these steps in this order.
  gaining: z.looseObject({
    steps: z
      .array(z.looseObject({ id, text }))
      .refine((x) => x.map((s) => s.id).join() === 'injury-location,roll,net-success-rider,repeat-permanent,cannot-be-lethal,type-rider,record,down-check', 'the gaining steps changed; update src/rules/engagement/injury.ts'),
    net_success_rider: z.looseObject({ add_per_net_success_beyond_first: z.number().int() }),
  }),
  worsening: z.looseObject({ per_held_injury: z.number().int() }),
  injury_location_table: z.looseObject({
    rows: z.array(z.strictObject({ results: openRange, injury_location: z.enum(['arm', 'leg', 'torso', 'head']), side: z.enum(['left', 'right']).nullable() })).min(1),
  }),
  types: z.array(z.looseObject({ id: injuryType, name: text })).length(5),
  sides: z.looseObject({ sided_locations: z.tuple([z.literal('arm'), z.literal('leg')]), values: z.tuple([z.literal('left'), z.literal('right')]) }),
  tables: z.strictObject({ arm: injuryTable, leg: injuryTable, torso: injuryTable, head: injuryTable }),
});

export const downFile = z.looseObject({
  id: z.literal('down'),
  conditions: z.tuple([z.looseObject({ id: z.literal('zero-health') }), z.looseObject({ id: z.literal('down-row') })]),
  // Chapter 1, section 1.9 hook; the roll code blocks exactly these (src/dice/requirements.ts).
  forbids: z.array(z.enum(['push', 'help', 'cover', 'reaction'])),
});

// ---------------------------------------------------------------- harm/death-rolls.yaml

const successRange = z.strictObject({ min: z.number().int().nullable(), max: z.number().int().nullable() });

export const deathRollsFile = z.looseObject({
  id: z.literal('death-rolls'),
  death_roll: z.looseObject({ entry: z.literal('death-roll'), attribute: attributeId, needs: z.number().int().min(1) }),
  outcomes: z
    .array(z.looseObject({ id: z.enum(['dies', 'holds-on', 'fights-back']), successes: successRange, result: text }))
    .length(3),
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
  // src/rules/engagement/skirmish.ts (foeTurn) follows these steps in this order.
  foe_rule: z.looseObject({
    steps: z
      .array(z.looseObject({ id, test: text, does: text }))
      .refine((x) => x.map((s) => s.id).join() === 'held,engaged,loaded,empty,close-in,none', 'the foe rule changed; update src/rules/engagement/skirmish.ts'),
  }),
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
      circumstances: z.string().optional(),
      secret: z.boolean().optional(),
      cover_allowed: z.boolean().optional(),
      help_allowed: z.boolean().optional(),
      stress_response: z.literal('none').optional(),
    }),
  ),
  called_roll: z.looseObject({
    needs: z.number().int().min(1),
    push_allowed: z.literal(true),
    cover_allowed: z.literal(true),
    failure_menu: z.array(z.looseObject({ id, cost: text })).min(1),
  }),
});

export const circumstancesFile = z.looseObject({
  id: z.literal('circumstances'),
  default: z.literal('standard'),
  steps: z
    .array(z.strictObject({ id, name: text, dice: z.number().int(), kind: z.enum(['bonus', 'none', 'penalty']) }))
    .length(7),
});

const bonusSource = z.looseObject({ id, dice_per_unit: z.union([z.number().int().min(1), z.record(z.string(), z.unknown())]), max_units: z.number().int().nullable() });

export const bonusDiceSourcesFile = z.looseObject({
  id: z.literal('bonus-dice-sources'),
  cap_per_roll: z.number().int().min(1),
  die_type: z.literal('base'),
  sources: z.array(bonusSource).refine((x) => ['opening', 'grounded-titan', 'ambush'].every((k) => x.some((s) => s.id === k)), 'the tracker reads the opening, grounded-titan, and ambush sources'),
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

// ---------------------------------------------------------------- mind/fear-rolls.yaml

/** The Fear Roll effect types the roll card applies or prints; a new type fails the build. */
export const FEAR_EFFECT_TYPES = [
  'stress-gain',
  'next-roll-penalty',
  'spend-next-action',
  'gas-roll',
  'spend-next-turn',
  'no-reactions',
  'draw-attention',
  'forced-move',
  'gain-scar',
  'forced-action',
  'drop-blade-set',
  'stress-gain-nearby',
] as const;

export const fearRollsFile = z.looseObject({
  id: z.literal('fear-rolls'),
  triggers: z.array(z.looseObject({ id, event: text })).min(1),
  roll: z.looseObject({ entry: z.literal('fear-roll'), total: z.literal('D6 + Stress - Resolve') }),
  table: z.looseObject({
    roll: z.literal('D6 + Stress - Resolve'),
    rows: z
      .array(
        z.strictObject({
          id,
          name: text,
          results: successRange,
          text,
          effects: z.array(
            z.strictObject({
              type: z.enum(FEAR_EFFECT_TYPES),
              amount: z.number().int().optional(),
              dice: z.number().int().optional(),
              turns: z.number().int().optional(),
              toward: id.optional(),
            }),
          ),
          forbids: z.array(z.enum(['push', 'help', 'cover', 'reaction'])).optional(),
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

export const ATTENTION_TESTS = ['hooked-into-its-body', 'nearest-person-in-reach', 'just-hurt-it', 'loudest-or-brightest', 'nearest', 'current-holder', 'mounted', 'airborne', 'carrying-a-comrade', 'most-harmed', 'down'] as const;

export const attentionFile = z.looseObject({
  id: z.literal('attention'),
  // src/rules/engagement/attention.ts implements each test by id.
  tests: z
    .array(z.looseObject({ id, meaning: text, down_can_meet: z.boolean() }))
    .min(1)
    .refine((x) => x.map((t) => t.id).join() === ATTENTION_TESTS.join(), 'the Attention tests changed; update src/rules/engagement/attention.ts'),
  ladders: z.array(z.looseObject({ id: z.literal('standard'), name: text, rungs: z.array(id).min(1) })).length(1),
  flags: z.array(z.looseObject({ id: z.enum(['hooked-by-strike', 'just-hurt', 'loudest']) })).length(3),
  evaluation: z.looseObject({
    steps: z.array(z.looseObject({ id })).refine((x) => x.map((s) => s.id).join() === 'top,struck-first,narrow,holder,card,none', 'the ladder evaluation changed; update src/rules/engagement/attention.ts'),
  }),
  break_attention: z.looseObject({
    needs: z.strictObject({ holder: z.number().int(), anyone_else: z.number().int(), titan_holds_a_grabbed_soldier: z.number().int(), feint_extra: z.number().int(), per_decoy_in_a_row: z.number().int() }),
    decoys: z.array(z.looseObject({ id: z.enum(['flare', 'riderless-horse', 'thrown-cloak', 'feint']), name: text })).length(4),
  }),
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
  // The tracker rolls steam at a death and at a Regeneration fill (src/rules/engagement/harm-rolls.ts).
  steam: z.looseObject({
    injury_type: injuryType,
    injury_location: z.literal('rolled'),
    triggers: z.tuple([z.looseObject({ id: z.literal('kill') }), z.looseObject({ id: z.literal('regeneration-fill') })]),
    table: z.looseObject({ roll: z.literal('D6'), rows: z.array(z.strictObject({ results: openRange, damage: z.number().int().min(0) })).min(1) }),
  }),
});

// ---------------------------------------------------------------- gear/falls.yaml
// The tracker rolls a fall's damage (src/rules/engagement/harm-rolls.ts, fallBand and fallDamage).

export const fallsFile = z.looseObject({
  id: z.literal('falls'),
  injury_type: injuryType,
  height: z.looseObject({
    steps: z.array(text).length(5).refine((s) => /On Body or Blind Spot is high/.test(s[3]) && /Giant Forest/.test(s[4]) && /Large Size Class/.test(s[4]), 'the fall height steps changed; update src/rules/engagement/harm-rolls.ts (fallBand)'),
    bands: z.tuple([z.strictObject({ id: z.literal('low'), adds: z.number().int() }), z.strictObject({ id: z.literal('high'), adds: z.number().int() }), z.strictObject({ id: z.literal('extreme'), adds: z.number().int() })]),
  }),
  damage_table: z.looseObject({ rows: z.array(z.strictObject({ id, results: openRange, damage: z.number().int().min(0) })).min(1) }),
});

// ---------------------------------------------------------------- harm/engagement-end.yaml
// The tracker runs these steps in this order (src/rules/engagement/closing.ts); a changed list fails the build.

export const ENGAGEMENT_END_STEPS = ['turns', 'stress-relief', 'lasting-stress-responses', 'turn-limits', 'aftermath-rolls', 'death-rolls', 'care-window', 'grief', 'retirement-and-promotion'] as const;

export const engagementEndFile = z.looseObject({
  id: z.literal('engagement-end'),
  steps: z
    .array(z.looseObject({ id, text }))
    .refine((rows) => rows.map((r) => r.id).join() === ENGAGEMENT_END_STEPS.join(), 'the engagement-end steps changed; update src/rules/engagement/closing.ts'),
});

// ---------------------------------------------------------------- mind/grief.yaml

export const griefFile = z.looseObject({
  id: z.literal('grief'),
  gaining: z.looseObject({
    amount: z.tuple([
      z.looseObject({ grief: z.literal(1), limit: text.refine((x) => /one Titan Engagement give each soldier 1 Grief in total/.test(x), 'the Grief limit changed; update src/rules/engagement/closing.ts') }),
      z.looseObject({ grief: z.literal(1), who: text.refine((x) => /Drive named/.test(x), 'the Drive Grief changed') }),
      z.looseObject({ grief: z.literal(1), who: text.refine((x) => /Numb Scar/.test(x), 'the Numb Grief changed') }),
    ]),
  }),
  maximum: z.number().int().min(1),
});

// ---------------------------------------------------------------- core/stress-changes.yaml (the two end reliefs)

export const stressChangesFile = z.looseObject({
  id: z.literal('stress-changes'),
  reductions: z.array(z.looseObject({ id, amount: z.union([z.number().int(), text]) })),
});

// ---------------------------------------------------------------- skirmish/skirmish.yaml (weapons)

export const skirmishFile = z.looseObject({
  id: z.literal('skirmish'),
  // The tracker applies these in code (src/rules/engagement/skirmish.ts); a change fails the build.
  engaged_and_apart: z.looseObject({ states: z.tuple([z.looseObject({ id: z.literal('engaged') }), z.looseObject({ id: z.literal('apart') })]) }),
  rounds: z.looseObject({ cards: text.refine((x) => /no Wings and no swap step/.test(x), 'the Skirmish deal changed; update src/rules/engagement/skirmish.ts') }),
  attack: z.looseObject({ lands_on_net_successes: z.literal(1) }),
  reactions: z.looseObject({ entries: z.array(z.strictObject({ entry: z.enum(['block', 'dodge']), against: z.array(z.enum(['fight', 'shoot'])) })) }),
  damage: z.looseObject({
    amount: z.looseObject({ per_net_success_beyond_the_first: z.number().int() }),
    on_a_foe: z.looseObject({ killed_by: z.array(injuryType), out_cold_by: z.array(injuryType) }),
  }),
  ambush: z.looseObject({ effects: z.array(z.looseObject({ id: z.enum(['order', 'dice', 'no-cancelling-roll']) })).length(3) }),
  grit: z.looseObject({ failed_threat: text }),
  parley: z.looseObject({ asks: z.array(z.strictObject({ id, name: text, needs_add: z.number().int(), effect: text })) }),
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

// ---------------------------------------------------------------- the Engagement tracker (milestone 4)
// Each value the tracker applies in code is pinned here, so a rules change fails the build instead of drifting.

const position = z.enum(POSITIONS);

export const roundFile = z.looseObject({
  id: z.literal('round'),
  initiative_cards: z.looseObject({ set: text.refine((x) => /Twenty cards numbered 1 to 20/.test(x), 'the card set changed; update src/rules/engagement/cards.ts') }),
  round_steps: z.array(z.looseObject({ id, text })).refine((x) => x.map((s) => s.id).join() === 'wings,deal,swap,play,end', 'the round steps changed; update src/rules/engagement/round.ts'),
  end_steps: z.array(z.looseObject({ id, text })).refine((x) => x.map((s) => s.id).join() === 'gas-rolls,regeneration,background-clocks,round-ends', 'the end steps changed; update src/rules/engagement/round.ts'),
  wings: z.looseObject({ when: text, assign: text.refine((x) => /at most one Squadmate/.test(x), 'a Wing holds a different number of Squadmates') }),
  swapping: z.looseObject({ who: text, limit: text.refine((x) => /at most one swap each round/.test(x), 'the swap limit changed'), titans: text }),
});

export const positionsFile = z.looseObject({
  id: z.literal('positions'),
  positions: z.array(z.looseObject({ id: position, name: text })).length(4),
  two_focus_titans: z.looseObject({ close_rule: text, entering: text }),
  corpse: z.looseObject({ positions: text.refine((x) => /on-body and blind-spot read in-reach/.test(x), 'the corpse Positions changed') }),
});

const stepRow = z.strictObject({
  between: z.tuple([position, position]),
  on_foot: z.boolean(),
  mounted: z.boolean(),
  odm: z.boolean(),
  fly_roll: z.strictObject({ needs: z.number().int().min(1), failure_ends_at: position }).optional(),
});

export const anchorRatingsFile = z.looseObject({
  id: z.literal('anchor-ratings'),
  positions: z.tuple([z.literal('distant'), z.literal('in-reach'), z.literal('on-body'), z.literal('blind-spot')]),
  ratings: z.array(z.strictObject({ id, name: text, meaning: text, steps: z.array(stepRow).min(1) })).min(1),
  grounded_titan: z.looseObject({
    on_foot_steps: text.refine((x) => /in-reach, on-body, and blind-spot can also be made on foot/.test(x), 'the grounded steps changed; update src/rules/engagement/positions.ts'),
    open_rating: text.refine((x) => /between on-body and blind-spot/.test(x), 'the Open rating grounded step changed'),
    corpse: text,
  }),
});

export const grabFile = z.looseObject({
  id: z.literal('grab'),
  grabbed_state: z.looseObject({ forbids: z.array(z.enum(['help', 'cover', 'reaction'])) }),
  grab_lands: z.looseObject({
    lands_on: z.literal(1),
    steps: z.array(z.looseObject({ id })).refine((x) => x.map((s) => s.id).join() === 'failed-dodge,hold,crush,attention,witnesses', 'the Grab steps changed; update src/rules/engagement/grab.ts'),
    grip_toughness: z.number().int().min(1),
    crush_harm: z.strictObject({ harm_kind: z.literal('critical-injury'), injury_location: z.enum(['torso']), injury_type: injuryType, cannot_be_lethal: z.boolean() }),
  }),
  countdown: z.looseObject({ steps: z.array(z.looseObject({ id })).refine((x) => x.map((s) => s.id).join() === 'lift,devour', 'the Grab countdown changed; update src/rules/engagement/grab.ts') }),
  escapes: z.array(
    z.looseObject({
      id: z.enum(['break-free', 'pry-loose', 'strike-the-holding-arm', 'break-attention', 'titan-dies']),
      needs: z.number().int().optional(),
      lifted_penalty: z.number().int().optional(),
      reach_before_lift: z.array(position).optional(),
      reach_after_lift: z.array(position).optional(),
    }),
  ),
});

export const backgroundTitansFile = z.looseObject({
  id: z.literal('background-titans'),
  focus_titan_limit: z.number().int().min(1),
  ticks: z.looseObject({ rows: z.array(z.looseObject({ id: z.enum(['end-of-round', 'flare', 'retreat-clock']) })).length(3) }),
  // The tracker forces these moves (src/rules/engagement/retreat.ts); a changed list fails the build.
  retreat: z.looseObject({
    effects: z.array(z.looseObject({ id, text })).refine((rows) => {
      const moves = rows.find((r) => r.id === 'moves')?.text ?? '';
      return ['1. Toward distant', '2. Leave', '3. Toward a fallen comrade', '4. Stay with a fallen comrade', 'The stay limit'].every((x) => moves.includes(x));
    }, 'the retreat moves changed; update src/rules/engagement/retreat.ts'),
  }),
});

const d6Row = <T extends z.ZodRawShape>(shape: T) => z.strictObject({ results: z.array(z.number().int().min(1).max(6)).min(1), ...shape });

export const engagementSetupFile = z.looseObject({
  id: z.literal('engagement-setup'),
  anchor_rating: z.looseObject({ rows: z.array(d6Row({ anchor_rating: id })) }),
  size_class: z.looseObject({ rows: z.array(d6Row({ size_class: z.enum(['small', 'medium', 'large']) })) }),
  medium_abnormal: z.looseObject({ rows: z.array(d6Row({ titan: id })) }),
  background_titans: z.looseObject({ rows: z.array(d6Row({ clocks: z.array(z.number().int().min(1)) })) }),
  retreat_clock: z.number().int().min(1),
  gm_choices: text.refine((x) => /a clock of 4, 6, or 8 segments/.test(x), 'the Background clock lengths the GM may name changed'),
});

export const squadTacticsFile = z.looseObject({
  id: z.literal('squad-tactics'),
  tactics: z.array(z.looseObject({ id: z.enum(['hook-and-cut', 'hamstring-line', 'clear-the-hand', 'fall-back']), name: text })).min(1),
});
