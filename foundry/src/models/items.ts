/**
 * Item TypeDataModels: talent, specialty, origin, gear, critical-injury (ADR-0025). Row fields
 * keep their data/ names; play state sits beside them (core-plan section 3.5).
 */
import config from '../wof-config.ts';
import { fieldKit, INJURY_LOCATIONS, INJURY_TYPES, SIDES, TIME_LIMITS } from './fields.ts';

export const GEAR_SUBTYPES = ['odm', 'blade-set', 'firearm', 'horse', 'kit', 'prosthetic'] as const;
const TALENT_LIMITS = ['none', 'once_per_titan_engagement', 'once_per_leg', 'once_per_night_camp', 'once_per_skirmish', 'once_per_downtime'];

export function defineItemModels() {
  const k = fieldKit();
  const { f } = k;
  const TypeDataModel = foundry.abstract.TypeDataModel;
  const attributeIds = config.attributes.map((a) => a.id);

  class TalentModel extends TypeDataModel {
    static LOCALIZATION_PREFIXES = ['WOF.Item.Talent'];
    static defineSchema() {
      return {
        talent_id: k.str(),
        description: k.html(),
        type: k.choice(['dice', 'rule'], 'dice'),
        max_level: k.int(1, { min: 1, max: 3 }),
        names: k.strings(),
        condition: new f.TypedObjectField(new f.StringField({ required: true, blank: false })),
        trigger: k.str(),
        effect: k.str(),
        limit: k.choice(TALENT_LIMITS, 'none'),
        specialties: k.strings(),
        // State: the held level (data/character/talents.yaml, talent_rules.levels) and the
        // once-per use recorded beside the Talent (data/character/lifepath.yaml, record_on_sheet).
        level: k.int(1, { min: 0, max: 3 }),
        used: k.bool(),
      };
    }
    /** The level that counts: never above the Talent's max_level. */
    get effective_level() {
      return Math.min((this as any).level, (this as any).max_level);
    }
  }

  class SpecialtyModel extends TypeDataModel {
    static LOCALIZATION_PREFIXES = ['WOF.Item.Specialty'];
    static defineSchema() {
      return {
        specialty_id: k.str(),
        key_attribute: k.choice(attributeIds, 'strength'),
        summary: k.html(),
        talents: k.strings(),
        squadmate_template: k.str(),
      };
    }
  }

  class OriginModel extends TypeDataModel {
    static LOCALIZATION_PREFIXES = ['WOF.Item.Origin'];
    static defineSchema() {
      return {
        origin_id: k.str(),
        results: new f.ArrayField(k.int(11, { min: 11, max: 66 })),
        description: k.html(),
        attributes: new f.ArrayField(k.choice(attributeIds, 'strength')),
        talent_choice: k.strings(),
        haven_choice: k.strings(),
        canon_tie: new f.SchemaField({ character: k.str(), link: k.str() }),
        condition: new f.SchemaField({ campaign_year_min: k.nullableInt() }),
      };
    }
  }

  const gearIds = config.gearItems.map((g) => g.id);

  class GearModel extends TypeDataModel {
    static LOCALIZATION_PREFIXES = ['WOF.Item.Gear'];
    static defineSchema() {
      return {
        item_id: k.choice(gearIds, 'blade-set'),
        subtype: k.choice(GEAR_SUBTYPES, 'blade-set'),
        rated: k.bool(true),
        gear_dice_for: k.strings(),
        items_counted: k.nonNeg(),
        passable: k.bool(true),
        description: k.html(),
        // State (data/gear/sheet-fields.yaml)
        rating: k.int(1, { min: 0, max: 3 }),
        current: k.int(1, { min: 0, max: 3 }),
        kept: k.bool(),
        in_handles: k.bool(),
        loaded: k.bool(),
        mounted: k.bool(),
        position: new f.SchemaField({ position: k.choice(['distant', 'in-reach', 'on-body', 'blind-spot'], null), titan: k.str(), left: k.bool() }),
        side: k.choice(SIDES, null),
      };
    }
    /** Gear Dice: the current rating, never above the rating (data/gear/items.yaml, rating_rules). */
    get gear_dice() {
      return (this as any).rated ? Math.min((this as any).current, (this as any).rating) : 0;
    }
  }

  const rowEffect = () => new f.ObjectField({ required: true });

  class CriticalInjuryModel extends TypeDataModel {
    static LOCALIZATION_PREFIXES = ['WOF.Item.CriticalInjury'];
    static defineSchema() {
      return {
        row: k.str(),
        location: k.choice(INJURY_LOCATIONS, 'torso'),
        row_data: new f.SchemaField({
          names: new f.SchemaField(Object.fromEntries(INJURY_TYPES.map((t) => [t, k.str()]))),
          results: new f.SchemaField({ min: k.nullableInt(), max: k.nullableInt() }),
          down: new f.StringField({ required: true, blank: true, initial: '', choices: ['', 'until_treated'] }),
          lethal: k.bool(),
          time_limit: k.choice(TIME_LIMITS, null),
          death_roll_penalty: k.nonNeg(),
          instant_death: k.bool(),
          effects: new f.ArrayField(rowEffect()),
          permanent_effects: new f.ArrayField(rowEffect()),
          healing_days: k.nonNeg(),
          repeat_row: k.str(),
        }),
        type_riders: new f.ArrayField(
          new f.SchemaField({ injury_type: k.choice(INJURY_TYPES, 'crush'), rider: new f.ObjectField({ required: true }) }),
        ),
        description: k.html(),
        // Held state (data/harm/sheet-fields.yaml, critical_injuries.each_records)
        side: k.choice(SIDES, null),
        injury_type: k.choice(INJURY_TYPES, 'crush'),
        treated: k.bool(),
        time_limit: k.choice(TIME_LIMITS, null),
        healing_days_left: k.nonNeg(),
        halved: k.bool(),
      };
    }
    /** The name the Critical Injury shows: its row's name for its own Injury Type. */
    get shown_name() {
      return (this as any).row_data.names[(this as any).injury_type] ?? '';
    }
  }

  return {
    talent: TalentModel,
    specialty: SpecialtyModel,
    origin: OriginModel,
    gear: GearModel,
    'critical-injury': CriticalInjuryModel,
  };
}
