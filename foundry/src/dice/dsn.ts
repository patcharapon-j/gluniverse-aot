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
import { ASSETS } from '../art.ts';
import { SYSTEM_ID } from '../config.ts';

const DICE = `${ASSETS}/dice`;
const BLANK = { label: `${DICE}/blank-label.webp`, bump: `${DICE}/blank-bump.png` };

type Face = { label: string; bump: string };

export interface KindPreset {
  type: 'db' | 'dg' | 'ds' | 'dt';
  colorset: {
    name: string;
    background: string;
    foreground: string;
    material: string;
    texture: string;
  };
  /** Faces 1 to 6; unmarked faces are blank (an empty label and a flat bump). */
  faces: Record<number, Face>;
}

const emblem = (kind: string): Face => ({ label: `${DICE}/${kind}-6-label.webp`, bump: `${DICE}/emblem-bump.png` });
const fang: Face = { label: `${DICE}/dt-fang-label.webp`, bump: `${DICE}/dt-fang-bump.png` };

/** The locked table: body colour, DSN material, texture, and which faces carry a mark. */
export const KIND_PRESETS: KindPreset[] = [
  {
    type: 'db',
    colorset: { name: 'wof-bone', background: '#EDE6D2', foreground: '#29241D', material: 'plastic', texture: 'wof-bone' },
    faces: { 6: emblem('db') },
  },
  {
    type: 'dg',
    colorset: { name: 'wof-gunmetal', background: '#56605F', foreground: '#E6C57C', material: 'metal', texture: 'none' },
    faces: { 1: { label: `${DICE}/dg-1-label.webp`, bump: `${DICE}/dg-1-bump.png` }, 6: emblem('dg') },
  },
  {
    type: 'ds',
    colorset: { name: 'wof-wax', background: '#8B2A21', foreground: '#F1E4C8', material: 'pristine', texture: 'none' },
    faces: { 1: { label: `${DICE}/ds-1-label.webp`, bump: `${DICE}/ds-1-bump.png` }, 6: emblem('ds') },
  },
  {
    type: 'dt',
    colorset: { name: 'wof-flesh', background: '#D9B7A0', foreground: '#3A0F0C', material: 'pristine', texture: 'wof-flesh' },
    faces: { 5: fang, 6: fang },
  },
];

export const TEXTURES: Record<string, { name: string; source: string; bump: string }> = {
  'wof-bone': { name: 'WOF.Dice.texture.bone', source: `${DICE}/bone-texture.webp`, bump: `${DICE}/bone-bump.png` },
  'wof-flesh': { name: 'WOF.Dice.texture.flesh', source: `${DICE}/flesh-texture.webp`, bump: `${DICE}/flesh-bump.png` },
};

/** The six labels and six bump maps of a kind, in face order. */
export function presetFaces(p: KindPreset): { labels: string[]; bumpMaps: string[] } {
  const faces = [1, 2, 3, 4, 5, 6].map((n) => p.faces[n] ?? BLANK);
  return { labels: faces.map((f) => f.label), bumpMaps: faces.map((f) => f.bump) };
}

export function registerDiceSoNice(): void {
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
