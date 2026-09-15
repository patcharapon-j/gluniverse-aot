/**
 * Content loaders over the shared tables in ../data (ADR-0012, ADR-0020).
 * The site never copies a table: these read the YAML at build time and turn it
 * into player-facing entries. Field names and ids stay in here; pages only see
 * names, numbers, and sentences written for players.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';
import { parse } from 'yaml';

type Raw = Record<string, unknown>;

interface Named {
  slug: string;
  name: string;
  order: number;
}

function repoRoot(ctx: LoaderContext): URL {
  return new URL('../', ctx.config.root);
}

async function readYaml<T>(root: URL, path: string): Promise<T> {
  return parse(await readFile(new URL(path, root), 'utf8')) as T;
}

const titleCase = (id: string) =>
  id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Reloads a collection when any of its source tables changes during `astro dev`. */
function watchSources(ctx: LoaderContext, root: URL, paths: string[], reload: () => Promise<void>) {
  if (!ctx.watcher) return;
  const files = paths.map((p) => fileURLToPath(new URL(p, root)));
  ctx.watcher.add(files);
  ctx.watcher.on('change', async (changed) => {
    if (!files.includes(changed)) return;
    ctx.logger.info(`Shared table changed, reloading: ${changed}`);
    await reload();
  });
}

// ---------------------------------------------------------------- Talents

interface RawTalent {
  id: string;
  name: string;
  description: string;
  type: 'dice' | 'rule';
  max_level: number;
  names: string[];
  condition?: Record<string, string>;
  limit?: string;
  specialties?: string[];
}
interface RawAction {
  id: string;
  name: string;
  attribute?: string | null;
}

const LIMITS: Record<string, string | null> = {
  none: null,
  once_per_titan_engagement: 'Once per Titan Engagement',
  once_per_leg: 'Once per Leg',
  once_per_night_camp: 'Once per Night Camp',
  once_per_skirmish: 'Once per Skirmish',
  once_per_downtime: 'Once per Downtime',
};

const orList = new Intl.ListFormat('en', { type: 'disjunction' });
const andList = new Intl.ListFormat('en', { type: 'conjunction' });

function diceEffect(maxLevel: number, actions: { name: string; condition: string | null }[]): string {
  const conditions = actions.map((a) => a.condition);
  const shared = conditions.every((c) => c === conditions[0]);
  const target = shared
    ? `${orList.format(actions.map((a) => a.name))} rolls${conditions[0] ? ` ${conditions[0]}` : ''}`
    : orList.format(actions.map((a) => `${a.name} rolls${a.condition ? ` ${a.condition}` : ''}`));
  return maxLevel > 1 ? `Add 1 base die per level to your ${target}.` : `Add 1 base die to your ${target}.`;
}

export function talentsLoader(): Loader {
  const sources = {
    talents: 'data/character/talents.yaml',
    actions: 'data/character/action-catalog.yaml',
    specialties: 'data/character/specialties.yaml',
    attributes: 'data/character/attributes.yaml',
  };
  return {
    name: 'wof-talents',
    load: async (ctx) => {
      const root = repoRoot(ctx);
      const sync = async () => {
        const [talentsDoc, actionsDoc, specialtiesDoc, attributesDoc] = await Promise.all([
          readYaml<{ talents: RawTalent[] }>(root, sources.talents),
          readYaml<{ entries: RawAction[] }>(root, sources.actions),
          readYaml<{ specialties: { id: string; name: string; talents: string[] }[]; general: { name: string; talents: string[] } }>(root, sources.specialties),
          readYaml<{ attributes: { id: string; name: string }[] }>(root, sources.attributes),
        ]);

        const actions = new Map(actionsDoc.entries.map((a) => [a.id, a]));
        const attributes = new Map<string, Named>(attributesDoc.attributes.map((a, i) => [a.id, { slug: a.id, name: a.name, order: i }]));
        const specialties = new Map<string, Named>(specialtiesDoc.specialties.map((s, i) => [s.id, { slug: s.id, name: s.name, order: i }]));
        const general: Named = { slug: 'general', name: specialtiesDoc.general.name, order: specialties.size };

        ctx.store.clear();
        for (const [index, t] of talentsDoc.talents.entries()) {
          const named = t.names.map((id) => {
            const action = actions.get(id);
            if (!action) throw new Error(`Talent "${t.name}" names an action the Action Catalog does not list.`);
            return { action, condition: t.condition?.[id] ?? null };
          });
          const talentSpecialties = (t.specialties ?? []).map((id) => {
            const s = specialties.get(id);
            if (!s) throw new Error(`Talent "${t.name}" lists a Specialty that does not exist.`);
            return s;
          });
          const attrs = [...new Set(named.map((n) => n.action.attribute).filter((a): a is string => !!a && attributes.has(a)))]
            .map((a) => attributes.get(a)!)
            .sort((a, b) => a.order - b.order);
          const actionList = named.map((n) => ({ name: n.action.name, condition: n.condition }));
          const limit = t.limit ? LIMITS[t.limit] : null;
          if (limit === undefined) throw new Error(`Talent "${t.name}" has a limit with no player wording.`);

          const data = {
            name: t.name,
            description: t.description,
            kind: t.type,
            maxLevel: t.max_level,
            specialties: talentSpecialties.length ? talentSpecialties : [general],
            specialtyLabel: `${andList.format((talentSpecialties.length ? talentSpecialties : [general]).map((s) => s.name))} Talent`,
            actions: actionList,
            attributes: attrs,
            effect: t.type === 'dice' ? diceEffect(t.max_level, actionList) : null,
            limit,
            order: index,
          };
          const id = slugify(t.name);
          const parsed = await ctx.parseData({ id, data });
          ctx.store.set({ id, data: parsed, digest: ctx.generateDigest(parsed) });
        }
        ctx.logger.info(`Loaded ${talentsDoc.talents.length} Talents from the shared tables.`);
      };
      await sync();
      watchSources(ctx, root, Object.values(sources), sync);
    },
  };
}

// ---------------------------------------------------------------- Titans

interface RawEffect {
  type: string;
  amount?: number;
  injury_location?: string;
  injury_type?: string;
  cannot_be_lethal?: boolean;
}
interface RawBehavior {
  name: string;
  results: number[];
  tier: string;
  targets: string;
  attack_dice?: number | null;
  effects: RawEffect[];
  text: string;
}
interface RawTitan {
  name: string;
  size_class: string;
  abnormal: boolean;
  tempo: number;
  nape_depth: number;
  regeneration_clock: number;
  heave?: number;
  body_parts: { id: string; toughness: number }[];
  attention_ladder: string;
  behavior_table: { entries: RawBehavior[] };
}

const INJURY_KIND: Record<string, string> = { crush: 'crushing', bite: 'biting', cut: 'cutting', burn: 'burning', pierce: 'piercing' };
const INJURY_WHERE: Record<string, string> = { rolled: '', torso: ' to the torso', leg: ' to a leg', arm: ' to an arm', head: ' to the head' };
const TARGETS: Record<string, string | null> = {
  holder: null,
  'holder-and-position': 'It lands on every soldier at that Position.',
};

function effectText(entry: RawBehavior): string {
  const sentences = entry.effects.map((e) => {
    switch (e.type) {
      case 'stress':
        return `${e.amount ?? 1} Stress.`;
      case 'telegraph':
        return 'It reveals its next move.';
      case 'knock-loose':
        return 'Knocks the soldier loose.';
      case 'grab':
        return 'Seizes the soldier.';
      case 'critical-injury': {
        const kind = INJURY_KIND[e.injury_type ?? ''];
        const where = INJURY_WHERE[e.injury_location ?? ''];
        if (kind === undefined || where === undefined) throw new Error(`No player wording for a Critical Injury on "${entry.name}".`);
        return `A ${kind} Critical Injury${where} that ${e.cannot_be_lethal ? 'cannot' : 'can'} kill.`;
      }
      default:
        throw new Error(`No player wording for a Titan behavior effect on "${entry.name}".`);
    }
  });
  const target = TARGETS[entry.targets];
  if (target === undefined) throw new Error(`No player wording for the targets of "${entry.name}".`);
  if (target) sentences.push(target);
  return sentences.join(' ');
}

const rollLabel = (results: number[]) => (results.length === 1 ? String(results[0]) : `${Math.min(...results)} to ${Math.max(...results)}`);

/** Which stat block values a Read reveals for an Abnormal, from the Read facts. */
const FACT_FIELDS: Record<string, 'toughness' | 'napeDepth' | 'regeneration' | 'attentionLadder'> = {
  'body-part': 'toughness',
  'nape-depth': 'napeDepth',
  'regeneration-clock': 'regeneration',
  'attention-ladder': 'attentionLadder',
};

export type TitanAudience = 'squad' | 'gm';

export function titansLoader(audience: TitanAudience): Loader {
  const fixed = ['data/titans/index.yaml', 'data/engagement/size-classes.yaml', 'data/engagement/read.yaml'];
  return {
    name: `wof-titans-${audience}`,
    load: async (ctx) => {
      const root = repoRoot(ctx);
      const titanFiles: string[] = [];
      const sync = async () => {
        const [index, sizes, read] = await Promise.all([
          readYaml<{ standard_titans: Record<string, string>; abnormals: { id: string }[]; ladders?: { id: string; name: string }[] }>(root, fixed[0]),
          readYaml<Raw>(root, fixed[1]),
          readYaml<{ facts: { id: string; for: string[] }[] }>(root, fixed[2]),
        ]);
        const sizeRows = Object.values(sizes).find(
          (v): v is { id: string; height: string }[] => Array.isArray(v) && v.some((row) => (row as Raw)?.id === 'medium' && 'height' in (row as Raw)),
        );
        if (!sizeRows) throw new Error('Size Class heights could not be found.');
        const hiddenForAbnormal = read.facts
          .filter((f) => f.for.includes('abnormal') && !f.for.includes('standard'))
          .map((f) => FACT_FIELDS[f.id])
          .filter((f): f is NonNullable<typeof f> => !!f);

        const ids = [...Object.values(index.standard_titans), ...index.abnormals.map((a) => a.id)];
        titanFiles.splice(0, titanFiles.length, ...ids.map((id) => `data/titans/${id}.yaml`));

        ctx.store.clear();
        for (const [order, file] of titanFiles.entries()) {
          const raw = await readYaml<RawTitan>(root, file);
          const size = sizeRows.find((row) => row.id === raw.size_class);
          if (!size) throw new Error(`"${raw.name}" has a Size Class with no height.`);
          const hidden = raw.abnormal ? hiddenForAbnormal : [];
          const withheld = (field: (typeof hidden)[number]) => audience === 'squad' && hidden.includes(field);

          const table = raw.behavior_table.entries;
          const rolled = table.filter((e) => e.results.length > 0).sort((a, b) => Math.min(...a.results) - Math.min(...b.results));
          const fallback = table.find((e) => e.results.length === 0) ?? null;
          const behavior = (e: RawBehavior) => ({
            roll: e.results.length ? rollLabel(e.results) : '',
            name: e.name,
            tier: { slug: e.tier, name: titleCase(e.tier) },
            attackDice: e.attack_dice ?? null,
            effect: effectText(e),
            text: e.text.trim(),
          });
          const tiers = ['terrorize', 'control', 'kill']
            .map((tier) => ({
              slug: tier,
              name: titleCase(tier),
              dice: [...new Set(rolled.filter((e) => e.tier === tier && e.attack_dice).map((e) => e.attack_dice as number))].sort((a, b) => a - b),
            }))
            .filter((t) => t.dice.length > 0);
          const ladder = index.ladders?.find((l) => l.id === raw.attention_ladder);

          const name = raw.name.replace(/^Standard\s+/, '');
          const data = {
            name,
            order,
            sizeClass: { slug: size.id, name: titleCase(size.id), height: size.height },
            abnormal: raw.abnormal,
            tempo: raw.tempo,
            napeDepth: withheld('napeDepth') ? null : raw.nape_depth,
            regeneration: withheld('regeneration') ? null : raw.regeneration_clock,
            heave: audience === 'gm' ? (raw.heave ?? null) : null,
            bodyParts: raw.body_parts.map((p) => ({ name: titleCase(p.id), toughness: withheld('toughness') ? null : p.toughness })),
            tiers,
            behaviors: rolled.map(behavior),
            fallback: fallback ? behavior(fallback) : null,
            hidden,
            attentionLadder: audience === 'gm' ? (ladder?.name ?? 'Standard Attention Ladder') : null,
          };
          const id = slugify(name);
          const parsed = await ctx.parseData({ id, data });
          ctx.store.set({ id, data: parsed, digest: ctx.generateDigest(parsed) });
        }
        ctx.logger.info(`Loaded ${titanFiles.length} Titans for the ${audience === 'gm' ? "GM's Guide" : 'Compendium'}.`);
      };
      await sync();
      watchSources(ctx, root, [...fixed, ...titanFiles], sync);
    },
  };
}
