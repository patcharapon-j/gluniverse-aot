/**
 * Dice So Nice presets for the four die kinds (ADR-0026; foundry/design/asset-inventory.md, the
 * locked Dice So Nice table). Dice So Nice is optional: nothing here runs without it.
 *
 * Each kind is its own d6 preset whose type is "d" + its DiceTerm denomination, naming its own
 * colorset. The label ink is baked into each kind's label images, so every colorset keeps
 * `labelComposite: 'source-over'`; `foreground` only colours a text fallback. Registering a preset
 * for a type Dice So Nice first added automatically (from CONFIG.Dice.terms) replaces that stand-in
 * in its standard set too, so the kinds keep their faces whichever dice set a player picks.
 */
import { SYSTEM_ID } from '../config.ts';
import { FLAG } from './card.ts';
import { dsnHookAnimates, SHOWN_ROLLS_FLAG } from './dsn-rules.ts';
import { KIND_PRESETS, presetFaces, TEXTURES } from './kinds.ts';

export { KIND_PRESETS, presetFaces, TEXTURES, type KindPreset } from './kinds.ts';

export function registerDiceSoNice(): void {
  // Dice So Nice animates the rolls a chat message gains; a card's added dice were shown already.
  Hooks.on('diceSoNiceMessageProcessed', (id: string, interception: { willTrigger3DRoll: boolean }) => {
    const message = game.messages.get(id);
    if (!message?.getFlag(SYSTEM_ID, FLAG)) return;
    const shown = Number(message.getFlag(SYSTEM_ID, SHOWN_ROLLS_FLAG) ?? 0);
    if (!dsnHookAnimates(message.rolls, shown)) interception.willTrigger3DRoll = false;
  });
  Hooks.once('diceSoNiceReady', async (dice3d: any) => {
    const t = (k: string) => game.i18n.localize(k);
    dice3d.addSystem({ id: SYSTEM_ID, name: t('WOF.SystemTitle'), group: t('WOF.SystemTitle') }, 'preferred');
    await Promise.all(
      Object.entries(TEXTURES).map(([id, tex]) => dice3d.addTexture(id, { name: t(tex.name), composite: 'multiply', source: tex.source, bump: tex.bump })),
    );
    for (const p of KIND_PRESETS) {
      await dice3d.addColorset(
        {
          ...p.colorset,
          description: t(`WOF.Dice.colorset.${p.type}`),
          category: t('WOF.SystemTitle'),
          outline: 'none',
          edge: p.colorset.background,
          labelComposite: 'source-over',
          // Kind colorsets belong to their dice; they are not offered as a player's global theme.
          visibility: 'hidden',
        },
        'default',
      );
      dice3d.addDicePreset({ type: p.type, ...presetFaces(p), colorset: p.colorset.name, system: SYSTEM_ID }, 'd6');
    }
    await dice3d.preloadPresets?.(SYSTEM_ID);
  });
}
