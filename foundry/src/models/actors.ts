/**
 * Actor TypeDataModels: soldier, squadmate, titan, foe (ADR-0025). Field names follow
 * data/character/lifepath.yaml (record_on_sheet), data/character/squadmates.yaml (stat_block),
 * data/harm/sheet-fields.yaml, data/gear/sheet-fields.yaml, data/engagement/titan-format.yaml,
 * and data/skirmish/foes.yaml (core-plan section 3).
 */
import config from '../wof-config.ts';
import { deriveSoldier, foeCurrentHealth, type Attributes, type CarriedGear, type SoldierDerived } from '../rules/derived.ts';
import { PART_KINDS, PART_STATES, TITAN_TARGETS, TITAN_TIERS } from '../rules/titan.ts';
import { fieldKit, POSITIONS, RANKS } from './fields.ts';

/** The embedded Items a soldier's derived values read. */
function soldierInputs(system: any, actor: any, strongBack: boolean) {
  const items = [...(actor?.items ?? [])];
  const gear = items.filter((i: any) => i.type === 'gear');
  const carriedGear: CarriedGear[] = gear.map((i: any) => ({
    itemsCounted: i.system.items_counted,
    inHandles: i.system.subtype === 'blade-set' && i.system.in_handles,
  }));
  const odm = gear.find((i: any) => i.system.subtype === 'odm');
  const horse = gear.find((i: any) => i.system.subtype === 'horse');
  const injuries = items
    .filter((i: any) => i.type === 'critical-injury')
    .map((i: any) => ({ treated: i.system.treated, down: i.system.row_data.down || false }));
  let comrade = null;
  if (system.carrying) {
    const other = game?.actors?.get(system.carrying);
    // Only one level deep: a carried soldier carries no one (data/gear/carrying.yaml, one_each).
    if (other?.system?.derived) comrade = { itemsCarried: other.system.derived.items_carried };
  }
  return {
    attributes: system.attributes as Attributes,
    scars: system.scars.length,
    grief: system.grief,
    stress: system.stress,
    healthLost: system.health_lost,
    injuries,
    spareCanisters: system.spare_canisters.length,
    gear: carriedGear,
    odm: odm ? { current: odm.system.current } : null,
    horse: horse ? { current: horse.system.current } : null,
    comrade,
    strongBack,
  };
}

/** Views of the embedded Items under the sheet-field names that point at them. */
function gearViews(actor: any) {
  const gear = [...(actor?.items ?? [])].filter((i: any) => i.type === 'gear');
  const of = (subtype: string) => gear.filter((i: any) => i.system.subtype === subtype);
  const blades = of('blade-set');
  const inHandles = blades.find((i: any) => i.system.in_handles);
  return {
    odm_gear: of('odm')[0] ?? null,
    horse: of('horse')[0] ?? null,
    blade_set_in_handles: inHandles ? inHandles.system.rating : null,
    blade_sets_carried: blades.filter((i: any) => !i.system.in_handles).map((i: any) => i.system.rating),
    medical_kits: of('kit').filter((i: any) => i.system.item_id === 'medical-kit'),
    tool_kits: of('kit').filter((i: any) => i.system.item_id === 'tool-kit'),
    firearms: of('firearm'),
    prosthetics: of('prosthetic'),
    kept_items: gear.filter((i: any) => i.system.kept),
  };
}

export function defineActorModels() {
  const k = fieldKit();
  const { f } = k;
  const TypeDataModel = foundry.abstract.TypeDataModel;

  /** Shared by the soldier and the Squadmate: attributes, harm and mind, gear state, derived values. */
  class SoldierBase extends TypeDataModel {
    declare derived: SoldierDerived;
    declare gear: ReturnType<typeof gearViews>;
    /** The token bar: current Health of Health (display only; the sheet edits Health lost). */
    declare health_bar: { value: number; max: number };

    static defineSchema() {
      return {
        attributes: k.attributes(2),
        ...k.harmAndMind(),
        ...k.gearState(config.gas.full),
        notes: k.html(),
      };
    }

    prepareDerivedData() {
      const actor = this.parent;
      const strongBack = [...(actor?.items ?? [])].some((i: any) => i.type === 'talent' && i.system.talent_id === 'strong-back' && i.system.level > 0);
      this.gear = gearViews(actor);
      this.derived = deriveSoldier(soldierInputs(this, actor, strongBack));
      this.health_bar = { value: this.derived.current_health, max: this.derived.health };
    }

    /** Health, Resolve, and minimum Stress under the record_on_sheet names. */
    get health() {
      return this.derived?.health;
    }
    get resolve() {
      return this.derived?.resolve;
    }
    get minimum_stress() {
      return this.derived?.minimum_stress;
    }
    get specialty() {
      return [...(this.parent?.items ?? [])].find((i: any) => i.type === 'specialty') ?? null;
    }
    get critical_injuries() {
      return [...(this.parent?.items ?? [])].filter((i: any) => i.type === 'critical-injury');
    }
  }

  class SoldierModel extends SoldierBase {
    static LOCALIZATION_PREFIXES = ['WOF.Actor.Base', 'WOF.Actor.Soldier'];

    static defineSchema() {
      return {
        ...super.defineSchema(),
        haven: k.str(),
        canon_tie: k.str(),
        drive: k.str(),
        drive_named_comrade: k.str(),
        drive_used_this_session: k.bool(),
        // A Merit total can be 0 or less (data/character/class-rank.yaml, merit_min null).
        merit: k.nullableInt(),
        class_rank: k.nullableInt({ min: 1 }),
        declined_military_police: k.bool(),
        rank: k.choice(RANKS, 'private'),
        xp: k.nonNeg(),
      };
    }

    get origin() {
      return [...(this.parent?.items ?? [])].find((i: any) => i.type === 'origin') ?? null;
    }
    get talents() {
      return [...(this.parent?.items ?? [])].filter((i: any) => i.type === 'talent');
    }
  }

  class SquadmateModel extends SoldierBase {
    static LOCALIZATION_PREFIXES = ['WOF.Actor.Base', 'WOF.Actor.Squadmate'];

    static defineSchema() {
      return {
        ...super.defineSchema(),
        template: k.str(),
        wing: k.str(), // the id of the player character whose Wing it is on, or empty
      };
    }

    /** The one template Talent (data/character/squadmates.yaml, stat_block.talent). */
    get talent() {
      return [...(this.parent?.items ?? [])].find((i: any) => i.type === 'talent') ?? null;
    }
  }

  const effectField = () => new f.ObjectField({ required: true });

  class TitanModel extends TypeDataModel {
    static LOCALIZATION_PREFIXES = ['WOF.Actor.Titan'];
    declare grounded: boolean;
    declare broken_parts: string[];

    static defineSchema() {
      return {
        size_class: k.choice(['small', 'medium', 'large'], 'medium'),
        abnormal: k.bool(),
        tempo: k.int(1, { min: 1 }),
        nape_depth: k.int(4, { min: 1 }),
        regeneration_clock: k.int(3, { min: 1 }),
        heave: k.int(3, { min: 1 }),
        body_parts: new f.ArrayField(
          new f.SchemaField({
            id: k.str(),
            kind: k.choice(PART_KINDS, 'arm'),
            toughness: k.int(2, { min: 1 }),
            state: k.choice(PART_STATES, 'intact'),
            progress: k.nonNeg(),
          }),
        ),
        attention_ladder: k.str('standard'),
        behavior_table: new f.SchemaField({
          entries: new f.ArrayField(
            new f.SchemaField({
              id: k.str(),
              name: k.str(),
              results: new f.ArrayField(k.int(1, { min: 1, max: 6 })),
              tier: k.choice(TITAN_TIERS, 'terrorize'),
              targets: k.choice(TITAN_TARGETS, 'holder'),
              position_requirement: new f.ArrayField(k.choice(POSITIONS, 'distant')),
              body_parts_used: new f.ArrayField(k.choice(PART_KINDS, 'arm')),
              attack_dice: k.nullableInt({ min: 0 }),
              effects: new f.ArrayField(effectField()),
              fallback: k.str('thrash'),
              text: k.str(),
            }),
          ),
        }),
        // Play state (milestone 4 drives it; milestone 2 edits it by hand)
        regeneration: k.nonNeg(),
        openings: k.nonNeg(),
        // Who created each Opening (a soldier's actor id; '' for one added by hand): titan-harm.yaml, openings
        openings_by: new f.ArrayField(new f.StringField({ required: true, blank: true })),
        // The public heave count of the body (titan-harm.yaml, falling_titan, heave, count)
        heave_count: k.nonNeg(),
        next_behavior: new f.SchemaField({ entry: k.str(), revealed: k.bool() }),
        // behavior-procedure.yaml, next_behavior.previous_behavior: the next roll skips it
        previous_behavior: k.str(),
        // Frenzy: 0 while a Focus Titan enters, 1 more at each round end to the cap of 3
        // (rules/engagement/cards.ts, FRENZY_CAP), added to the behavior roll. Unbounded in the
        // field so a GM may set any value (ADR-0028); the rules do the capping.
        frenzy: k.nonNeg(),
        attention_holder: k.str(),
        focus_titan_label: k.str(),
        hidden_until_read: new f.SchemaField({
          toughness: k.bool(),
          nape_depth: k.bool(),
          regeneration_clock: k.bool(),
          attention_ladder: k.bool(),
        }),
        corpse: k.bool(),
        notes: k.html(),
      };
    }

    prepareDerivedData() {
      const parts = (this as any).body_parts as { id: string; kind: string; state: string }[];
      this.broken_parts = parts.filter((p) => p.state === 'broken').map((p) => p.id);
      // A Broken leg grounds a Titan (data/engagement/titan-harm.yaml, grounded).
      this.grounded = parts.some((p) => p.kind === 'leg' && p.state === 'broken');
    }
  }

  const weaponRow = () => new f.SchemaField({ results: new f.ArrayField(k.int(1, { min: 1, max: 6 })), weapon: k.str() });

  class FoeModel extends TypeDataModel {
    static LOCALIZATION_PREFIXES = ['WOF.Actor.Foe'];
    declare current_health: number;
    declare health_bar: { value: number; max: number };

    static defineSchema() {
      return {
        kind: k.str(),
        who: k.str(),
        attack_dice: k.int(4, { min: 1 }),
        guard_dice: k.nonNeg(3),
        health: k.int(3, { min: 1 }),
        grit: k.int(1, { min: 1 }),
        parley: k.int(1, { min: 1 }),
        watch: k.int(1, { min: 1 }),
        group_size: k.int(1, { min: 1 }),
        fight_weapon: new f.SchemaField({
          fixed: k.str(),
          roll: k.str(),
          rows: new f.ArrayField(weaponRow()),
          at_night: new f.SchemaField({ replaces: k.str(), with: k.str() }),
        }),
        shoot_weapon: k.str(),
        // Play state
        health_lost: k.nonNeg(),
        held: k.bool(),
        out: k.bool(),
        weapon: k.str(),
        firearm_loaded: k.bool(true),
        notes: k.html(),
      };
    }

    prepareDerivedData() {
      this.current_health = foeCurrentHealth((this as any).health, (this as any).health_lost);
      this.health_bar = { value: this.current_health, max: (this as any).health };
    }
  }

  return { soldier: SoldierModel, squadmate: SquadmateModel, titan: TitanModel, foe: FoeModel };
}
