/**
 * Wings of Freedom, Foundry VTT v14 system entry point (ADR-0025).
 * Milestone 2a: data models, derived data, system config, fonts. Sheets arrive in 2b and 2c.
 */
import { buildSystemConfig, SYSTEM_ID } from './config.ts';
import { registerFonts } from './fonts.ts';
import { defineActorModels } from './models/actors.ts';
import { defineItemModels } from './models/items.ts';

Hooks.once('init', () => {
  CONFIG.WOF = buildSystemConfig();

  Object.assign(CONFIG.Actor.dataModels, defineActorModels());
  Object.assign(CONFIG.Item.dataModels, defineItemModels());

  CONFIG.Actor.trackableAttributes = {
    soldier: { bar: [], value: ['stress', 'health_lost', 'gas_rating'] },
    squadmate: { bar: [], value: ['stress', 'health_lost', 'gas_rating'] },
    titan: { bar: [], value: ['regeneration', 'openings'] },
    foe: { bar: [], value: ['health_lost'] },
  };

  registerFonts();
  console.log(`${SYSTEM_ID} | initialised: ${CONFIG.WOF.actionCatalog.length} Action Catalog entries`);
});
