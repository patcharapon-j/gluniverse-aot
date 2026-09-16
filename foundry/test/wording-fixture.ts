/** The tables, the website's wording, and the Foundry wording, loaded once for the tests. */
import { buildConfig } from '../tools/config-data.ts';
import { loadFoundryWording } from '../tools/data/foundry-wording.ts';
import { loadTables } from '../tools/data/load.ts';
import { loadSiteWording } from '../tools/data/site-wording.ts';

export const tables = loadTables();
export const site = await loadSiteWording();
export const foundryWording = loadFoundryWording();
export const buildTestConfig = (t = tables) => buildConfig(t, site, foundryWording);
