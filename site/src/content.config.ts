import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { actionsLoader, specialtiesLoader, talentsLoader, titansLoader } from './lib/shared-data';

/**
 * Rules and GM prose. Each page records the chapters and tables it was written
 * from, with the git blob sha of each at sync time (scripts/check-sync.mjs).
 */
const page = z.object({
  title: z.string(),
  summary: z.string(),
  section: z.enum(['guide', 'gm']),
  order: z.number().int(),
  tab: z.string(),
  earlyRules: z.boolean().default(false),
  sources: z
    .array(
      z.object({
        path: z.string(),
        sha: z.string().regex(/^[0-9a-f]{40}$/, 'sha must be a 40-character git blob sha'),
      }),
    )
    .min(1),
});

/**
 * A release of the manual, written for players: what changed, what it means at the table, and
 * why. One entry per release, newest first by `date`.
 */
const release = z.object({
  /** The release's name, as the page and the list show it. */
  title: z.string(),
  /** The day it was issued, as YYYY-MM-DD. The list and the tabs read it for order. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be written YYYY-MM-DD'),
  /** One sentence, for the list and the page's lede. */
  summary: z.string(),
  /** A short label for the tab strip, such as "Sept 2026". */
  tab: z.string(),
  sources: z
    .array(
      z.object({
        path: z.string(),
        sha: z.string().regex(/^[0-9a-f]{40}$/, 'sha must be a 40-character git blob sha'),
      }),
    )
    .min(1),
});

const rules = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/rules' }),
  schema: page,
});

const gm = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/gm' }),
  schema: page,
});

const updates = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/updates' }),
  schema: release,
});

const named = z.object({ slug: z.string(), name: z.string(), order: z.number() });
const link = z.object({ slug: z.string(), name: z.string() });
const conditioned = link.extend({ condition: z.string().nullable() });

const talents = defineCollection({
  loader: talentsLoader(),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    kind: z.enum(['dice', 'rule']),
    maxLevel: z.number().int().min(1),
    specialties: z.array(named).min(1),
    /** The Action Catalog entries the Talent names, each with its condition. */
    actions: z.array(conditioned).min(1),
    attributes: z.array(named),
    effect: z.string(),
    trigger: z.string().nullable(),
    limit: z.string().nullable(),
    order: z.number(),
  }),
});

const actions = defineCollection({
  loader: actionsLoader(),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    kind: named,
    attribute: named.nullable(),
    rollLabel: z.string(),
    /** True for the entries a called roll is made for: rolled when a rule or the GM calls for it. */
    calledRoll: z.boolean(),
    gear: z.string(),
    requires: z.array(z.string()),
    needs: z.string().nullable(),
    does: z.array(z.string()).min(1),
    help: z.string().nullable(),
    /** Player's Guide chapter slugs, optionally with an anchor ("rules-of-play#help"). */
    pages: z.array(z.string()).min(1),
    notInUse: z.boolean(),
    diceTalents: z.array(conditioned),
    ruleTalents: z.array(link),
  }),
});

const specialties = defineCollection({
  loader: specialtiesLoader(),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    general: z.boolean(),
    keyAttribute: named.nullable(),
    summary: z.string(),
    issue: z.string().nullable(),
    talents: z.array(link.extend({ kind: z.enum(['dice', 'rule']) })).min(1),
  }),
});

const behavior = z.object({
  roll: z.string(),
  name: z.string(),
  tier: z.object({ slug: z.string(), name: z.string() }),
  attackDice: z.number().nullable(),
  effect: z.string(),
  text: z.string(),
});

const titan = z.object({
  name: z.string(),
  order: z.number(),
  sizeClass: z.object({ slug: z.string(), name: z.string(), height: z.string() }),
  abnormal: z.boolean(),
  tempo: z.number(),
  napeDepth: z.number().nullable(),
  regeneration: z.number().nullable(),
  heave: z.number().nullable(),
  bodyParts: z.array(z.object({ name: z.string(), toughness: z.number().nullable() })),
  tiers: z.array(z.object({ slug: z.string(), name: z.string(), dice: z.array(z.number()) })),
  behaviors: z.array(behavior),
  fallback: behavior.nullable(),
  /** Values a Read reveals. The Compendium withholds them; the GM's Guide shows them redacted. */
  hidden: z.array(z.enum(['toughness', 'napeDepth', 'regeneration', 'attentionLadder'])),
  attentionLadder: z.string().nullable(),
});

/** Titans as a squad sees them: hidden values are never loaded. */
const titans = defineCollection({ loader: titansLoader('squad'), schema: titan });

/** The Commander's copy: every value, for the GM's Guide only. */
const titanDossiers = defineCollection({ loader: titansLoader('gm'), schema: titan });

export const collections = { rules, gm, updates, talents, actions, specialties, titans, titanDossiers };
