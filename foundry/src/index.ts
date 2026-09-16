/**
 * Wings of Freedom, Foundry VTT v14 system entry point (ADR-0025).
 * 2a: data models, derived data, system config, fonts. 2b: the Soldier sheet, Motion and Gore.
 * 2c: the Titan, Squadmate, and Foe sheets, the item slips, and prototype Token defaults.
 */
import { buildSystemConfig, SYSTEM_ID } from './config.ts';
import { rollAction } from './dice/roll-action.ts';
import { registerFonts } from './fonts.ts';
import { defineActorModels } from './models/actors.ts';
import { defineItemModels } from './models/items.ts';
import { loadSettings, registerSettings } from './settings.svelte.ts';
import { registerSheets, registerTokenDefaults } from './sheets/register.ts';

Hooks.once('init', () => {
  CONFIG.WOF = buildSystemConfig();

  Object.assign(CONFIG.Actor.dataModels, defineActorModels());
  Object.assign(CONFIG.Item.dataModels, defineItemModels());

  CONFIG.Actor.trackableAttributes = {
    soldier: { bar: ['health_bar'], value: ['stress', 'health_lost', 'gas_rating'] },
    squadmate: { bar: ['health_bar'], value: ['stress', 'health_lost', 'gas_rating'] },
    titan: { bar: [], value: ['regeneration', 'openings', 'heave_count'] },
    foe: { bar: ['health_bar'], value: ['health_lost'] },
  };

  registerFonts();
  registerSettings();
  registerSheets();
  registerTokenDefaults();
  game.wof = { rollAction };
  console.log(`${SYSTEM_ID} | initialised: ${CONFIG.WOF.actionCatalog.length} Action Catalog entries`);
});

Hooks.once('setup', () => loadSettings());
