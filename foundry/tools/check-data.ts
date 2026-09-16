/** Validates every data file the system reads, and nothing else. */
import { loadTables } from './data/load.ts';

const t = loadTables();
console.log(
  `data/ is in the shape the system reads: ${t.talents.talents.length} Talents, ${t.actionCatalog.entries.length} Catalog entries, ` +
    `${t.specialties.specialties.length} Specialties, ${t.origins.rows.length} Origins, ${t.gearItems.items.length} gear items, ` +
    `${Object.values(t.criticalInjuries.tables).reduce((n, x) => n + x.rows.length, 0)} Critical Injury rows, ${t.titans.length} Titans, ` +
    `${t.squadmates.templates.length} Squadmate templates, ${t.foes.foes.length} Foes.`,
);
