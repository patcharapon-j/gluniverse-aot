/**
 * The website's player wording (ADR-0020), read straight from the site's own loaders and table
 * modules so the system and the website never word a rule two ways. The site modules import the
 * tables with Vite's `?raw`, so they run through Vite's module runner here; `yaml` resolves from this
 * package because the site's own dependencies may not be installed.
 *
 * Every string the site returns has already passed the site's text guard. Nothing here rewords
 * anything: pack-docs.ts and config-data.ts pick the site's sentence where one exists and fall back
 * to the data text, through the same guard, where it does not.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runnerImport, type InlineConfig } from 'vite';
import { FOUNDRY_ROOT, REPO_ROOT } from './load.ts';
import { loadLifepathWording, type LifepathWording } from './lifepath-wording.ts';

const SITE = resolve(REPO_ROOT, 'site');

/** The site files this module reads, repo-relative, for watch lists and the audit. */
export const SITE_SOURCES = [
  'site/src/lib/shared-data.ts',
  'site/src/lib/harm-tables.ts',
  'site/src/lib/gear-tables.ts',
  'site/src/lib/gm-foe-tables.ts',
  'site/src/lib/lifepath-tables.ts',
  'site/src/lib/character-tables.ts',
  'site/src/lib/glossary.ts',
  'site/src/lib/player-text.ts',
  'site/src/content/compendium/talent-text.yaml',
  'site/src/content/compendium/action-text.yaml',
  'site/src/content/compendium/gear-text.yaml',
  'site/src/content/rules/making-your-soldier.mdx',
] as const;

type Cell = string | { options: string[] } | { lines: string[] } | { text: string; note: string };
interface CoreTable {
  caption: string;
  note?: string;
  columns: string[];
  groups: { heading?: string; rows: { cells: Cell[] }[] }[];
}

export interface SiteTalent {
  name: string;
  description: string;
  kind: 'dice' | 'rule';
  maxLevel: number;
  actions: { slug: string; name: string; condition: string | null }[];
  effect: string;
  trigger: string | null;
  limit: string | null;
}
export interface SiteAction {
  name: string;
  kind: { slug: string; name: string };
  rollLabel: string;
  calledRoll: boolean;
  gear: string;
  requires: string[];
  needs: string | null;
  does: string[];
  help: string | null;
  notInUse: boolean;
}
export interface SiteSpecialty {
  name: string;
  summary: string;
  issue: string | null;
}
export interface SiteTitanBehavior {
  roll: string;
  name: string;
  tier: { slug: string; name: string };
  attackDice: number | null;
  effect: string;
  text: string;
}
export interface SiteTitan {
  name: string;
  sizeClass: { slug: string; name: string; height: string };
  abnormal: boolean;
  tempo: number;
  napeDepth: number | null;
  regeneration: number | null;
  bodyParts: { name: string; toughness: number | null }[];
  tiers: { slug: string; name: string; dice: number[] }[];
  behaviors: SiteTitanBehavior[];
  fallback: SiteTitanBehavior | null;
  hidden: ('toughness' | 'napeDepth' | 'regeneration' | 'attentionLadder')[];
}
export interface SiteOrigin {
  id: string;
  roll: string;
  name: string;
  description: string;
  havens: string[];
  canonTie: { character: string; link: string } | null;
  campaignYearMin: number | null;
}
export interface SiteGear {
  id: string;
  name: string;
  rating: string;
  carriedAs: string;
  what: string;
  gearDice: string;
  notHad: string[];
  atZero: string;
  wear: string;
  restore: string[];
  carried: string;
  extra: string[];
}
export interface SiteInjuryRow {
  /** One "Crush: name" line per Injury Type. */
  names: string[];
  down: string;
  lethal: string;
  deathRollPenalty: string;
  whileHeld: string;
  healing: string;
  permanent: string;
  repeat: string;
}
export interface SiteRider {
  type: string;
  rows: string;
  text: string;
}
export interface SiteMindRow {
  roll: string;
  name: string;
  text: string;
  /** Stress Responses: Instant or Lasting. */
  duration: string | null;
  effects: string;
  /** Fear Rolls: what the row forbids. */
  forbids: string | null;
}
export interface SiteScar {
  slug: string;
  name: string;
  roll: string;
  trigger: string;
  effect: string;
  squadmateReason: string | null;
}
export interface SiteFoe {
  id: string;
  name: string;
  who: string;
  stats: { label: string; value: string; note: string }[];
  group: string;
  weapons: { name: string; line: string; note?: string }[];
  running: string;
}
export interface SiteGlossaryEntry {
  term: string;
  definition: string;
  aliases: string[];
}

export interface SiteWording {
  talents: Record<string, SiteTalent>;
  actions: Record<string, SiteAction>;
  specialties: Record<string, SiteSpecialty>;
  /** Squad view, in data/titans/index.yaml order. */
  titans: SiteTitan[];
  origins: Record<string, SiteOrigin>;
  /** "Keep only in Campaign Year {year} or later." from the Origin table. */
  originConditions: Record<string, string>;
  gear: Record<string, SiteGear>;
  /** By Injury Location, in table row order. */
  injuries: Record<string, SiteInjuryRow[]>;
  /** By Injury Location, in the order the table's type riders are listed. */
  riders: Record<string, SiteRider[]>;
  injuryTypes: Record<string, { name: string; note: string }>;
  stressResponses: SiteMindRow[];
  fearRows: SiteMindRow[];
  fearTriggers: { name: string; event: string; who: string }[];
  scars: Record<string, SiteScar>;
  deathOutcomes: { successes: string; text: string }[];
  foes: Record<string, SiteFoe>;
  /** What changes for a Squadmate: each rule that does not apply or carries a note. */
  squadmateRules: { rule: string; applies: string; note: string | null }[];
  glossary: SiteGlossaryEntry[];
  /** Why You Enlisted rows by id: the reason and the Drive's trigger as the website words them. */
  enlistment: Record<string, { reason: string; trigger: string }>;
  /** Training Years in order: the title, the subtitle, and each event's name and description. */
  years: { id: string; title: string; subtitle: string; events: { name: string; description: string }[] }[];
  /** The Lifepath step text from Making Your Soldier. */
  lifepathPage: LifepathWording;
}

const cellText = (c: Cell): string => {
  if (typeof c === 'string') return c;
  if ('lines' in c) return c.lines.join(' ');
  if ('options' in c) return c.options.join(' or ');
  return c.note ? `${c.text}. ${c.note}` : c.text;
};

function runnerConfig(): InlineConfig {
  return {
    configFile: false,
    root: SITE,
    logLevel: 'error',
    // The site's tsconfig extends Astro's, which is not installed here; the modules need none.
    oxc: { tsconfig: false } as InlineConfig['oxc'],
    resolve: { alias: { yaml: resolve(FOUNDRY_ROOT, 'node_modules/yaml/browser/index.js') } },
  };
}

async function importSite<T>(file: string): Promise<T> {
  const { module } = await runnerImport<T>(resolve(REPO_ROOT, file), runnerConfig());
  return module;
}

/** Runs an Astro content loader outside Astro and returns its entries by id, in load order. */
async function runLoader<T>(loader: { load: (ctx: any) => Promise<void> }): Promise<Map<string, T>> {
  const store = new Map<string, T>();
  const ctx = {
    config: { root: pathToFileURL(`${SITE}/`) },
    store: {
      clear: () => store.clear(),
      set: (e: { id: string; data: T }) => store.set(e.id, e.data),
    },
    parseData: async ({ data }: { data: T }) => data,
    generateDigest: () => '',
    logger: { info() {}, warn() {} },
    watcher: undefined,
  };
  await loader.load(ctx);
  return store;
}

let cached: Promise<SiteWording> | null = null;

/** Loads the website's wording, once per process unless `fresh` (watch mode) asks again. */
export function loadSiteWording(opts: { fresh?: boolean } = {}): Promise<SiteWording> {
  if (opts.fresh || !cached) cached = readSiteWording();
  return cached;
}

async function readSiteWording(): Promise<SiteWording> {
  const [shared, harm, gearMod, foeMod, lifepath, character, glossaryMod] = await Promise.all([
    importSite<any>('site/src/lib/shared-data.ts'),
    importSite<any>('site/src/lib/harm-tables.ts'),
    importSite<any>('site/src/lib/gear-tables.ts'),
    importSite<any>('site/src/lib/gm-foe-tables.ts'),
    importSite<any>('site/src/lib/lifepath-tables.ts'),
    importSite<any>('site/src/lib/character-tables.ts'),
    importSite<any>('site/src/lib/glossary.ts'),
  ]);

  const [talents, actions, specialties, titans] = await Promise.all([
    runLoader<SiteTalent>(shared.talentsLoader()),
    runLoader<SiteAction>(shared.actionsLoader()),
    runLoader<SiteSpecialty>(shared.specialtiesLoader()),
    runLoader<SiteTitan>(shared.titansLoader('squad')),
  ]);

  const tables = harm.HARM_TABLES as Record<string, () => CoreTable>;
  const injuries: Record<string, SiteInjuryRow[]> = {};
  for (const location of ['arm', 'leg', 'torso', 'head']) {
    const table = tables[`injuries-${location}`]();
    injuries[location] = table.groups[0].rows.map(({ cells }) => ({
      names: (cells[1] as { lines: string[] }).lines,
      down: cellText(cells[2]),
      lethal: cellText(cells[3]),
      deathRollPenalty: cellText(cells[4]),
      whileHeld: cellText(cells[5]),
      healing: cellText(cells[6]),
      permanent: cellText(cells[7]),
      repeat: cellText(cells[8]),
    }));
  }
  const riderTable = tables['injury-riders']();
  const riders: Record<string, SiteRider[]> = {};
  const locations = Object.keys(injuries);
  riderTable.groups.forEach((g, i) => {
    riders[locations[i]] = g.rows.map(({ cells }) => ({ type: cellText(cells[0]), rows: cellText(cells[1]), text: cellText(cells[2]) }));
  });
  if (riderTable.groups.length !== locations.length) throw new Error('The website lists type riders for a different set of Injury Locations.');

  const mindRows = (table: CoreTable, fear: boolean): SiteMindRow[] =>
    table.groups[0].rows.map(({ cells }) => ({
      roll: cellText(cells[0]),
      name: cellText(cells[1]),
      text: cellText(cells[2]),
      duration: fear ? null : cellText(cells[3]),
      effects: cellText(cells[fear ? 3 : 4]),
      forbids: fear ? cellText(cells[4]) : null,
    }));

  const originTable = (character.originTable as () => CoreTable)();
  const originConditions: Record<string, string> = {};
  const lifepathSite = lifepath.lifepathTables() as {
    origins: SiteOrigin[];
    enlistment: { id: string; reason: string; drive: { trigger: string } }[];
    years: { id: string; title: string; subtitle: string; events: { name: string; description: string }[] }[];
  };
  const origins = lifepathSite.origins;
  originTable.groups[0].rows.forEach(({ cells }, i) => {
    const o = origins[i];
    const note = typeof cells[1] === 'object' && 'note' in cells[1] ? cells[1].note : '';
    const condition = note.slice(0, Math.max(0, note.length - o.description.length)).trim();
    if (condition) originConditions[o.id] = condition;
  });

  const squadmateRules = (character.squadmateRulesTable as () => CoreTable)().groups[0].rows.flatMap(({ cells }) => {
    const first = cells[0];
    const rule = typeof first === 'string' ? first : 'text' in first ? first.text : cellText(first);
    const note = typeof first === 'object' && 'note' in first ? first.note : null;
    const applies = cellText(cells[1]);
    return applies === 'Yes' && !note ? [] : [{ rule, applies, note }];
  });

  return {
    talents: Object.fromEntries(talents),
    actions: Object.fromEntries(actions),
    specialties: Object.fromEntries(specialties),
    titans: [...titans.values()],
    origins: Object.fromEntries(origins.map((o) => [o.id, o])),
    originConditions,
    gear: Object.fromEntries((gearMod.gearEntries() as SiteGear[]).map((g) => [g.id, g])),
    injuries,
    riders,
    injuryTypes: Object.fromEntries((harm.injuryTypes() as { id: string; name: string; note: string }[]).map((x) => [x.id, { name: x.name, note: x.note }])),
    stressResponses: mindRows(tables['stress-responses'](), false),
    fearRows: mindRows(tables['fear-rolls'](), true),
    fearTriggers: tables['fear-triggers']().groups[0].rows.map(({ cells }) => ({ name: cellText(cells[0]), event: cellText(cells[1]), who: cellText(cells[2]) })),
    scars: Object.fromEntries((harm.scarEntries() as SiteScar[]).map((s) => [s.slug, s])),
    deathOutcomes: tables['death-roll-outcomes']().groups[0].rows.map(({ cells }) => ({ successes: cellText(cells[0]), text: cellText(cells[1]) })),
    foes: Object.fromEntries((foeMod.foeRecords() as SiteFoe[]).map((f) => [f.id, f])),
    squadmateRules,
    glossary: glossaryMod.GLOSSARY as SiteGlossaryEntry[],
    enlistment: Object.fromEntries(lifepathSite.enlistment.map((r) => [r.id, { reason: r.reason, trigger: r.drive.trigger }])),
    years: lifepathSite.years.map((y) => ({ id: y.id, title: y.title, subtitle: y.subtitle, events: y.events.map((e) => ({ name: e.name, description: e.description })) })),
    lifepathPage: loadLifepathWording(),
  };
}

/** A file's git blob sha, as `git hash-object` gives it, without running git. */
export function blobSha(repoPath: string): string {
  const body = readFileSync(resolve(REPO_ROOT, repoPath));
  return createHash('sha1').update(`blob ${body.length}\0`).update(body).digest('hex');
}
