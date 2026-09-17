/**
 * The four die kinds' looks (ADR-0026; foundry/design/asset-inventory.md, the locked Dice So Nice
 * table): body colour, material, texture, and the face art. Dice So Nice (src/dice/dsn.ts) and the
 * chat card's die icons (src/dice/card.ts) both draw from it. Pure: no Foundry globals.
 */
import { ASSETS } from '../art.ts';
import type { DieKind } from '../rules/roll.ts';

const DICE = `${ASSETS}/dice`;
export const BLANK = { label: `${DICE}/blank-label.webp`, bump: `${DICE}/blank-bump.png` };

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

export const KIND_OF_TYPE: Record<DieKind, KindPreset['type']> = { base: 'db', gear: 'dg', stress: 'ds', titan: 'dt' };

/** A kind's preset. */
export const kindPreset = (kind: DieKind): KindPreset => KIND_PRESETS.find((p) => p.type === KIND_OF_TYPE[kind])!;

/** The label art a kind's face carries, as Dice So Nice draws it; null for a blank face. */
export function faceLabel(kind: DieKind, face: number): string | null {
  return kindPreset(kind).faces[face]?.label ?? null;
}
