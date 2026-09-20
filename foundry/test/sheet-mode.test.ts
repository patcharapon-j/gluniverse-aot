import { describe, expect, it } from 'vitest';
import { BUILD_ITEM_TYPES, chooseMode, isBlankFile, isMode } from '../src/sheets/mode.ts';
import { uploadName } from '../src/sheets/portrait.ts';

const file = (...types: string[]) => ({ items: types.map((type) => ({ type })) });

describe('Edit mode and Play mode (sheets/mode.ts)', () => {
  it('opens a blank file in Edit and a written one in Play', () => {
    expect(chooseMode(undefined, true)).toBe('edit');
    expect(chooseMode(undefined, false)).toBe('play');
    expect(chooseMode(null, false)).toBe('play');
  });

  it('keeps whatever the viewer last chose, whether or not the file is written', () => {
    expect(chooseMode('play', true)).toBe('play');
    expect(chooseMode('edit', false)).toBe('edit');
    // Anything that is not one of the two modes is no choice at all.
    expect(chooseMode('locked', false)).toBe('play');
    expect(isMode('edit')).toBe(true);
    expect(isMode('EDIT')).toBe(false);
  });

  it('calls a file blank until it carries an Origin, a Specialty or a Talent', () => {
    expect(isBlankFile(file())).toBe(true);
    expect(isBlankFile(file('gear', 'critical-injury'))).toBe(true);
    expect(isBlankFile(undefined)).toBe(true);
    for (const type of BUILD_ITEM_TYPES) expect(isBlankFile(file('gear', type)), type).toBe(false);
  });
});

describe('uploaded character images (sheets/portrait.ts)', () => {
  it('names an upload after the character and the moment, keeping the file type', () => {
    expect(uploadName('Mikasa Ackerman', 'photo.PNG', 1700)).toBe('mikasa-ackerman-1700.png');
    expect(uploadName('Erwin', 'a.b.webp', 1)).toBe('erwin-1.webp');
  });

  it('falls back to a plain name for an unnamed actor or an extensionless file', () => {
    expect(uploadName('', 'blob', 9)).toBe('portrait-9.png');
    expect(uploadName('???', 'x.jpg', 9)).toBe('portrait-9.jpg');
  });

  it('keeps a long name short enough to live in a folder', () => {
    const stem = uploadName('a'.repeat(80), 'x.webp', 5);
    expect(stem).toBe(`${'a'.repeat(40)}-5.webp`);
  });
});
