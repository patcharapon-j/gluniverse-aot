/**
 * Client settings each viewer controls (ADR-0027, core-plan 2e): Motion and Gore. The values
 * live in a Svelte state object so open sheets follow a change without re-rendering.
 */
import { SYSTEM_ID } from './config.ts';
import type { GoreLevel, MotionMode } from './motion/tokens.ts';
import { APPLY_CATEGORIES, type ApplyCategory } from './rules/roll.ts';
import { registerSettingsMenu } from './settings-menu.ts';

export const viewer = $state({ motion: 'full' as MotionMode, gore: 'standard' as GoreLevel, reducedByOS: false });

/** The motion mode in force: the setting, with the OS reduced-motion preference capping Full at Reduced. */
export function motionMode(): MotionMode {
  if (viewer.motion === 'full' && viewer.reducedByOS) return 'reduced';
  return viewer.motion;
}

/**
 * World settings, GM only: auto-apply per category (ADR-0026). A category switched off still lists
 * its changes on the card, with an Apply button. They are set in the preferences menu
 * (settings-menu.ts), not listed one by one in Configure Settings.
 */
export function registerWorldSettings(): void {
  for (const cat of APPLY_CATEGORIES) {
    game.settings.register(SYSTEM_ID, `autoApply.${cat}`, {
      name: `WOF.Settings.autoApply.${cat}.name`,
      hint: `WOF.Settings.autoApply.${cat}.hint`,
      scope: 'world',
      config: false,
      restricted: true,
      type: Boolean,
      default: true,
    });
  }
}

/** Which auto-apply categories are on, read when a card records its changes. */
export function autoApply(): Record<ApplyCategory, boolean> {
  return Object.fromEntries(APPLY_CATEGORIES.map((c) => [c, game.settings.get(SYSTEM_ID, `autoApply.${c}`) !== false])) as Record<ApplyCategory, boolean>;
}

export function registerSettings(): void {
  registerWorldSettings();
  registerSettingsMenu();
  game.settings.register(SYSTEM_ID, 'motion', {
    name: 'WOF.Settings.motion.name',
    hint: 'WOF.Settings.motion.hint',
    scope: 'client',
    config: true,
    type: String,
    choices: { full: 'WOF.Settings.motion.full', reduced: 'WOF.Settings.motion.reduced', off: 'WOF.Settings.motion.off' },
    default: 'full',
    onChange: (v: MotionMode) => (viewer.motion = v),
  });
  game.settings.register(SYSTEM_ID, 'gore', {
    name: 'WOF.Settings.gore.name',
    hint: 'WOF.Settings.gore.hint',
    scope: 'client',
    config: true,
    type: String,
    choices: { low: 'WOF.Settings.gore.low', standard: 'WOF.Settings.gore.standard', graphic: 'WOF.Settings.gore.graphic' },
    default: 'standard',
    onChange: (v: GoreLevel) => (viewer.gore = v),
  });
}

/** Reads the stored values once settings are ready, and follows the OS reduced-motion preference. */
export function loadSettings(): void {
  viewer.motion = game.settings.get(SYSTEM_ID, 'motion') as MotionMode;
  viewer.gore = game.settings.get(SYSTEM_ID, 'gore') as GoreLevel;
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  viewer.reducedByOS = query.matches;
  query.addEventListener('change', (e) => (viewer.reducedByOS = e.matches));
}

export function setGore(level: GoreLevel): Promise<unknown> {
  return game.settings.set(SYSTEM_ID, 'gore', level);
}
