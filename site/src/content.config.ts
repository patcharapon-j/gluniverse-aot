import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { talentsLoader, titansLoader } from './lib/shared-data';

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

const rules = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/rules' }),
  schema: page,
});

const gm = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/gm' }),
  schema: page,
});

const named = z.object({ slug: z.string(), name: z.string(), order: z.number() });

const talents = defineCollection({
  loader: talentsLoader(),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    kind: z.enum(['dice', 'rule']),
    maxLevel: z.number().int().min(1),
    specialties: z.array(named).min(1),
    specialtyLabel: z.string(),
    actions: z.array(z.object({ name: z.string(), condition: z.string().nullable() })).min(1),
    attributes: z.array(named),
    effect: z.string().nullable(),
    limit: z.string().nullable(),
    order: z.number(),
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

export const collections = { rules, gm, talents, titans, titanDossiers };
