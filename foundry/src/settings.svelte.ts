/**
 * Client settings each viewer controls (ADR-0027, core-plan 2e): Motion and Gore. The values
 * live in a Svelte state object so open sheets follow a change without re-rendering.
 */
import { SYSTEM_ID } from './config.ts';
import type { GoreLevel, MotionMode } from './motion/tokens.ts';

export const viewer = $state({ motion: 'full' as MotionMode, gore: 'standard' as GoreLevel, reducedByOS: false });

/** The motion mode in force: the setting, with the OS reduced-motion preference capping Full at Reduced. */
export function motionMode(): MotionMode {
  if (viewer.motion === 'full' && viewer.reducedByOS) return 'reduced';
  return viewer.motion;
}

export function registerSettings(): void {
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
