/**
 * Symlinks dist/ into the local Foundry data folder as systems/wings-of-freedom (ADR-0025).
 * Touches nothing else in that folder. Set FOUNDRY_DATA to use another data path.
 */
import { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { FOUNDRY_ROOT } from './data/load.ts';

const dataDir = process.env.FOUNDRY_DATA ?? join(homedir(), 'Foundry User Data', 'Data');
const systems = join(dataDir, 'systems');
const target = join(FOUNDRY_ROOT, 'dist');
const link = join(systems, 'wings-of-freedom');

if (!existsSync(systems)) throw new Error(`No Foundry systems folder at ${systems}. Set FOUNDRY_DATA.`);
mkdirSync(target, { recursive: true });

let stat;
try {
  stat = lstatSync(link);
} catch {
  stat = null;
}
if (stat?.isSymbolicLink()) {
  const current = readlinkSync(link);
  if (current === target) {
    console.log(`Already linked: ${link} -> ${target}`);
    process.exit(0);
  }
  throw new Error(`${link} already links to ${current}. Remove it by hand if it should point here.`);
}
if (stat) throw new Error(`${link} exists and is not a symlink. Move it aside by hand; this tool never deletes it.`);
symlinkSync(target, link, 'dir');
console.log(`Linked ${link} -> ${target}`);
