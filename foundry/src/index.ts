/**
 * Wings of Freedom, Foundry VTT v14 system entry point (ADR-0025).
 * 2a: data models, derived data, system config, fonts. 2b: the Soldier sheet, Motion and Gore.
 * 2c: the Titan, Squadmate, and Foe sheets, the item slips, and prototype Token defaults.
 * 2d: the four die kinds, the roll dialog, roll cards with Push, Cover, auto-apply, and Undo.
 * 2e: Dice So Nice presets, the preferences menu, token status effects bound to the model, and
 * default art.
 * 3: the Lifepath wizard.
 * 4: the Titan Engagement tracker (HUD strip, board, token badges, round-end automation).
 * Batch E: the engagement board over the canvas area while a Titan Engagement has a field (16-34).
 * The dice-pool bar above the chat input.
 */
import { buildSystemConfig, SYSTEM_ID } from './config.ts';
import { registerChatBar } from './chat-bar/index.ts';
import { callRoll } from './dice/call.ts';
import { pushRunner } from './dice/card-actions.ts';
import { registerChat } from './dice/chat.ts';
import { registerProxy } from './dice/proxy.ts';
import { rollTitanAttack } from './dice/reactions.ts';
import { rollAction } from './dice/roll-action.ts';
import { rollFear, rollGas, rollStressResponse } from './dice/tables.ts';
import { registerDiceSoNice } from './dice/dsn.ts';
import { defineDice } from './dice/terms.ts';
import { defineActorDocument, defineTokenHUD, registerStatusEffects } from './documents/actor.ts';
import { registerFonts } from './fonts.ts';
import { defineActorModels } from './models/actors.ts';
import { defineItemModels } from './models/items.ts';
import { loadSettings, registerSettings } from './settings.svelte.ts';
import { registerPortraits, registerSheets, registerTokenDefaults } from './sheets/register.ts';
import { defineWizard, openLifepath } from './lifepath/wizard-app.ts';
import { registerTracker } from './tracker/index.ts';
import { registerBoard } from './board/app.ts';

Hooks.once('init', () => {
  CONFIG.WOF = buildSystemConfig();
  CONFIG.Actor.documentClass = defineActorDocument();
  CONFIG.Token.hudClass = defineTokenHUD();
  registerStatusEffects();

  Object.assign(CONFIG.Actor.dataModels, defineActorModels());
  Object.assign(CONFIG.Item.dataModels, defineItemModels());

  CONFIG.Actor.trackableAttributes = {
    soldier: { bar: ['health_bar'], value: ['stress', 'health_lost', 'gas_rating'] },
    squadmate: { bar: ['health_bar'], value: ['stress', 'health_lost', 'gas_rating'] },
    titan: { bar: [], value: ['regeneration', 'openings', 'heave_count'] },
    foe: { bar: ['health_bar'], value: ['health_lost'] },
  };

  defineDice();
  registerDiceSoNice();
  registerProxy(pushRunner);
  registerChat();
  registerChatBar();
  registerFonts();
  registerSettings();
  registerSheets();
  registerTokenDefaults();
  registerPortraits();
  defineWizard();
  registerTracker();
  registerBoard();
  game.wof = { rollAction, callRoll, rollTitanAttack, rollFear, rollGas, rollStressResponse, openLifepath };
  console.log(`${SYSTEM_ID} | initialised: ${CONFIG.WOF.actionCatalog.length} Action Catalog entries`);
});

Hooks.once('setup', () => loadSettings());
