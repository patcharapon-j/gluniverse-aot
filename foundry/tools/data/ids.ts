import { createHash } from 'node:crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** A deterministic 16-character Foundry document id, so a rebuild updates entries in place. */
export function docId(...parts: string[]): string {
  const bytes = createHash('sha256').update(parts.join('|')).digest();
  let out = '';
  for (let i = 0; i < 16; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}
