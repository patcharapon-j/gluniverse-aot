/**
 * CONFIG.WOF: the Action Catalog and rule constants, baked in from data/ at build time
 * (virtual:wof-config; ADR-0025). Labels are i18n keys; names that data/ gives as proper names
 * (Action Catalog entries, Specialties, gear items) keep them.
 */
import data from './wof-config.ts';

export const SYSTEM_ID = 'wings-of-freedom';

export function buildSystemConfig() {
  return Object.freeze({
    ...data,
    actionCatalogById: Object.fromEntries(data.actionCatalog.map((e) => [e.id, e])),
    labels: {
      attributes: Object.fromEntries(data.attributes.map((a) => [a.id, `WOF.Attribute.${a.id}`])),
      injuryTypes: Object.fromEntries(data.injuryTypes.map((t) => [t.id, `WOF.InjuryType.${t.id}`])),
      injuryLocations: Object.fromEntries(data.injuryLocations.map((l) => [l, `WOF.InjuryLocation.${l}`])),
      sizeClasses: Object.fromEntries(data.sizeClasses.map((c) => [c.id, `WOF.SizeClass.${c.id}`])),
      ranks: { private: 'WOF.Rank.private', 'squad-leader': 'WOF.Rank.squad-leader', 'section-commander': 'WOF.Rank.section-commander' },
      positions: {
        distant: 'WOF.Position.distant',
        'in-reach': 'WOF.Position.in-reach',
        'on-body': 'WOF.Position.on-body',
        'blind-spot': 'WOF.Position.blind-spot',
      },
      gearSubtypes: {
        odm: 'WOF.GearSubtype.odm',
        'blade-set': 'WOF.GearSubtype.blade-set',
        firearm: 'WOF.GearSubtype.firearm',
        horse: 'WOF.GearSubtype.horse',
        kit: 'WOF.GearSubtype.kit',
        prosthetic: 'WOF.GearSubtype.prosthetic',
      },
      bodyPartStates: { intact: 'WOF.BodyPartState.intact', wounded: 'WOF.BodyPartState.wounded', broken: 'WOF.BodyPartState.broken' },
    },
  });
}

export type SystemConfig = ReturnType<typeof buildSystemConfig>;
