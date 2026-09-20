/**
 * Items taken from the system's own compendia by their fixed ids (tools/data/ids.ts): the Lifepath
 * writes a finished soldier with them, and a Squadmate sheet builds a template with them.
 */
import { SYSTEM_ID } from './config.ts';

export type PackName = 'talents' | 'specialties' | 'origins' | 'gear' | 'criticalInjuries';

/** The compendium a pack's ids live in; most are named for the pack itself. */
const COLLECTION: Record<PackName, string> = {
  talents: 'talents',
  specialties: 'specialties',
  origins: 'origins',
  gear: 'gear',
  criticalInjuries: 'critical-injuries',
};

/** The document data for one pack row, ready to create on an actor, or null if the pack has none. */
export async function packItemData(pack: PackName, key: string): Promise<Record<string, any> | null> {
  const ids = CONFIG.WOF.packIds as Record<PackName, Record<string, string>>;
  const id = ids[pack]?.[key];
  const collection = game.packs.get(`${SYSTEM_ID}.${COLLECTION[pack]}`);
  const doc = id && collection ? await collection.getDocument(id) : null;
  if (!doc) return null;
  const data = doc.toObject();
  delete data._id;
  data._stats = { compendiumSource: doc.uuid };
  return data;
}
