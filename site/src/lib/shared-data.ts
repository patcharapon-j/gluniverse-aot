/**
 * Content loaders over the shared tables in ../data (ADR-0012, ADR-0020).
 * The site never copies a table: these read the YAML at build time and turn it
 * into player-facing entries. Field names and ids stay in here; pages only see
 * names, numbers, and sentences written for players.
 *
 * Where a table's own text points at files, sections, or ids, the player wording
 * lives in src/content/compendium/, keyed by the row's id. A row with no wording,
 * or wording that still carries a reference, fails the build (lib/player-text).
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';
import { parse } from 'yaml';
import { checkPlayerText, hyphenatedIds } from './player-text';

type Raw = Record<string, unknown>;

interface Named {
  slug: string;
  name: string;
  order: number;
}

function repoRoot(ctx: LoaderContext): URL {
  return new URL('../', ctx.config.root);
}

async function readYaml<T>(file: URL): Promise<T> {
  return parse(await readFile(file, 'utf8')) as T;
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

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Reloads a collection when any of its source files changes during `astro dev`. */
function watchSources(ctx: LoaderContext, sources: URL[], reload: () => Promise<void>) {
  if (!ctx.watcher) return;
  const files = sources.map((u) => fileURLToPath(u));
  ctx.watcher.add(files);
  ctx.watcher.on('change', async (changed) => {
    if (!files.includes(changed)) return;
    ctx.logger.info(`Source changed, reloading: ${changed}`);
    await reload();
  });
}

const orList = new Intl.ListFormat('en', { type: 'disjunction' });

// ---------------------------------------------------------------- Character tables

const CHARACTER = {
  talents: 'data/character/talents.yaml',
  actions: 'data/character/action-catalog.yaml',
  specialties: 'data/character/specialties.yaml',
  attributes: 'data/character/attributes.yaml',
  standardIssue: 'data/gear/standard-issue.yaml',
};

/** Player wording for table rows whose own text points at files, sections, or ids. */
const WORDING = {
  talents: 'src/content/compendium/talent-text.yaml',
  actions: 'src/content/compendium/action-text.yaml',
};

interface RawTalent {
  id: string;
  name: string;
  description: string;
  type: 'dice' | 'rule';
  max_level: number;
  names: string[];
  condition?: Record<string, string>;
  trigger?: string;
  effect?: string;
  limit?: string;
  specialties?: string[];
}
interface RawAction {
  id: string;
  name: string;
  kind: string;
  rolled: string;
  attribute?: string | null;
  gear?: string[];
  requires_gear?: boolean;
  without_gear?: string;
  dormant?: boolean;
  reserved?: boolean;
}
interface RawSpecialty {
  id: string;
  name: string;
  key_attribute: string;
  summary: string;
  talents: string[];
}
interface TalentWording {
  trigger?: string;
  effect?: string;
  condition?: Record<string, string>;
}
interface ActionWording {
  requires?: string[];
  needs?: string;
  does?: string[];
  help?: string;
  gear_note?: string;
  pages?: string[];
}

interface CharacterTables {
  talents: RawTalent[];
  actions: RawAction[];
  actionById: Map<string, RawAction>;
  attributes: Map<string, Named>;
  specialties: RawSpecialty[];
  general: { name: string; summary: string; talents: string[] };
  issueRows: { specialty: string; item: string; rating: number }[];
  talentWording: Record<string, TalentWording>;
  actionWording: Record<string, ActionWording>;
  ids: Set<string>;
}

function characterSources(ctx: LoaderContext): URL[] {
  const root = repoRoot(ctx);
  return [...Object.values(CHARACTER).map((p) => new URL(p, root)), ...Object.values(WORDING).map((p) => new URL(p, ctx.config.root))];
}

async function loadCharacterTables(ctx: LoaderContext): Promise<CharacterTables> {
  const root = repoRoot(ctx);
  const [talentsDoc, actionsDoc, specialtiesDoc, attributesDoc, issueDoc, talentText, actionText] = await Promise.all([
    readYaml<{ talents: RawTalent[] }>(new URL(CHARACTER.talents, root)),
    readYaml<{ entries: RawAction[] }>(new URL(CHARACTER.actions, root)),
    readYaml<{ specialties: RawSpecialty[]; general: { name: string; summary: string; talents: string[] } }>(new URL(CHARACTER.specialties, root)),
    readYaml<{ attributes: { id: string; name: string }[] }>(new URL(CHARACTER.attributes, root)),
    readYaml<{ by_specialty: { rows: { specialty: string; item: string; rating: number }[] } }>(new URL(CHARACTER.standardIssue, root)),
    readYaml<{ talents: Record<string, TalentWording> }>(new URL(WORDING.talents, ctx.config.root)),
    readYaml<{ actions: Record<string, ActionWording> }>(new URL(WORDING.actions, ctx.config.root)),
  ]);

  const talentIds = new Set(talentsDoc.talents.map((t) => t.id));
  for (const id of Object.keys(talentText.talents ?? {})) {
    if (!talentIds.has(id)) throw new Error(`${WORDING.talents} has wording for "${id}", which is not a Talent. Remove it.`);
  }
  const actionIds = new Set(actionsDoc.entries.map((a) => a.id));
  for (const id of Object.keys(actionText.actions ?? {})) {
    if (!actionIds.has(id)) throw new Error(`${WORDING.actions} has wording for "${id}", which is not an Action Catalog entry. Remove it.`);
  }

  return {
    talents: talentsDoc.talents,
    actions: actionsDoc.entries,
    actionById: new Map(actionsDoc.entries.map((a) => [a.id, a])),
    attributes: new Map(attributesDoc.attributes.map((a, i) => [a.id, { slug: a.id, name: a.name, order: i }])),
    specialties: specialtiesDoc.specialties,
    general: specialtiesDoc.general,
    issueRows: issueDoc.by_specialty.rows,
    talentWording: talentText.talents ?? {},
    actionWording: actionText.actions ?? {},
    ids: hyphenatedIds([...talentsDoc.talents, ...actionsDoc.entries]),
  };
}

/** A Talent's condition for one named entry, in player wording. */
function talentCondition(tables: CharacterTables, t: RawTalent, entryId: string): string | null {
  const text = tables.talentWording[t.id]?.condition?.[entryId] ?? t.condition?.[entryId] ?? null;
  if (text === null) return null;
  return checkPlayerText(`The condition of the Talent "${t.name}"`, text, tables.ids, `Write player wording under "${t.id}" (condition) in ${WORDING.talents}.`);
}

// ---------------------------------------------------------------- Talents

const LIMITS: Record<string, string | null> = {
  none: null,
  once_per_titan_engagement: 'Once per Titan Engagement',
  once_per_leg: 'Once per Leg',
  once_per_night_camp: 'Once per Night Camp',
  once_per_skirmish: 'Once per Skirmish',
  once_per_downtime: 'Once per Downtime',
};

function diceEffect(maxLevel: number, actions: { name: string; condition: string | null }[]): string {
  const conditions = actions.map((a) => a.condition);
  const shared = conditions.every((c) => c === conditions[0]);
  const target = shared
    ? `${orList.format(actions.map((a) => a.name))} rolls${conditions[0] ? ` ${conditions[0]}` : ''}`
    : orList.format(actions.map((a) => `${a.name} rolls${a.condition ? ` ${a.condition}` : ''}`));
  return maxLevel > 1 ? `Add 1 base die per level to your ${target}.` : `Add 1 base die to your ${target}.`;
}

export function talentsLoader(): Loader {
  return {
    name: 'wof-talents',
    load: async (ctx) => {
      const sync = async () => {
        const tables = await loadCharacterTables(ctx);
        const specialties = new Map<string, Named>(tables.specialties.map((s, i) => [s.id, { slug: s.id, name: s.name, order: i }]));
        const general: Named = { slug: 'general', name: tables.general.name, order: specialties.size };

        ctx.store.clear();
        for (const [index, t] of tables.talents.entries()) {
          const wording = tables.talentWording[t.id];
          const fix = `Write player wording under "${t.id}" in ${WORDING.talents}.`;
          for (const key of Object.keys(wording?.condition ?? {})) {
            if (!t.names.includes(key)) throw new Error(`${WORDING.talents} gives "${t.name}" a condition for an entry it does not name.`);
          }

          const named = t.names.map((id) => {
            const action = tables.actionById.get(id);
            if (!action) throw new Error(`Talent "${t.name}" names an action the Action Catalog does not list.`);
            return { slug: id, name: action.name, attribute: action.attribute ?? null, condition: talentCondition(tables, t, id) };
          });
          const talentSpecialties = (t.specialties ?? []).map((id) => {
            const s = specialties.get(id);
            if (!s) throw new Error(`Talent "${t.name}" lists a Specialty that does not exist.`);
            return s;
          });
          const attrs = [...new Set(named.map((n) => n.attribute).filter((a): a is string => !!a && tables.attributes.has(a)))]
            .map((a) => tables.attributes.get(a)!)
            .sort((a, b) => a.order - b.order);

          let trigger: string | null = null;
          let effect: string;
          if (t.type === 'rule') {
            if (!wording?.trigger || !wording?.effect) throw new Error(`The Rule Talent "${t.name}" has no player wording. ${fix}`);
            trigger = checkPlayerText(`The trigger of "${t.name}"`, wording.trigger, tables.ids, fix);
            effect = checkPlayerText(`The effect of "${t.name}"`, wording.effect, tables.ids, fix);
          } else {
            if (wording?.trigger || wording?.effect) throw new Error(`"${t.name}" is a Dice Talent: its wording in ${WORDING.talents} holds only conditions.`);
            effect = diceEffect(t.max_level, named);
          }
          const limit = LIMITS[t.limit ?? 'none'];
          if (limit === undefined) throw new Error(`Talent "${t.name}" has a limit with no player wording.`);

          const data = {
            name: t.name,
            description: checkPlayerText(`The description of "${t.name}"`, t.description, tables.ids, fix),
            kind: t.type,
            maxLevel: t.max_level,
            specialties: talentSpecialties.length ? talentSpecialties : [general],
            actions: named.map(({ slug, name, condition }) => ({ slug, name, condition })),
            attributes: attrs,
            effect,
            trigger,
            limit,
            order: index,
          };
          const parsed = await ctx.parseData({ id: t.id, data });
          ctx.store.set({ id: t.id, data: parsed, digest: ctx.generateDigest(parsed) });
        }
        ctx.logger.info(`Loaded ${tables.talents.length} Talents from the shared tables.`);
      };
      await sync();
      watchSources(ctx, characterSources(ctx), sync);
    },
  };
}

// ---------------------------------------------------------------- Actions

/** When an entry is rolled. `when_called` marks the entries a called roll is made for. */
const ROLLED = new Set(['when_taken', 'when_a_rule_calls', 'when_called', 'never']);

const KINDS: Record<string, Named & { verb: string }> = {
  action: { slug: 'action', name: 'Action', order: 0, verb: 'taken' },
  reaction: { slug: 'reaction', name: 'Reaction', order: 1, verb: 'made' },
  roll: { slug: 'roll', name: 'Roll', order: 2, verb: 'made' },
  option: { slug: 'option', name: 'Option', order: 3, verb: 'used' },
  'fixed-roll': { slug: 'fixed-roll', name: 'Fixed roll', order: 4, verb: 'made' },
};

const GEAR: Record<string, string> = {
  'blade-set': 'a Blade Set',
  'odm-gear': 'ODM Gear',
  horse: 'a horse',
  'medical-kit': 'a medical kit',
  'tool-kit': 'a tool kit',
  'flintlock-pistol': 'a flintlock pistol',
  musket: 'a musket',
};

/** Attribute values that are not one attribute. */
const ATTRIBUTE_RULES: Record<string, string> = {
  from_performance_attributes: "The Training Year's higher performance attribute",
};

export function actionsLoader(): Loader {
  return {
    name: 'wof-actions',
    load: async (ctx) => {
      const sync = async () => {
        const tables = await loadCharacterTables(ctx);

        ctx.store.clear();
        for (const [index, a] of tables.actions.entries()) {
          const fix = `Write player wording under "${a.id}" in ${WORDING.actions}.`;
          const w = tables.actionWording[a.id];
          if (!w?.does?.length || !w.pages?.length) throw new Error(`The Action "${a.name}" has no player wording. ${fix}`);
          const text = (label: string, s: string) => checkPlayerText(`The ${label} of the Action "${a.name}"`, s, tables.ids, fix);

          const kind = KINDS[a.kind];
          if (!kind) throw new Error(`The Action "${a.name}" has a kind with no player wording.`);
          if (!ROLLED.has(a.rolled)) throw new Error(`The Action "${a.name}" says when it is rolled in a way with no player wording.`);

          let attribute: Named | null = null;
          let rollLabel: string;
          if (a.kind === 'fixed-roll') rollLabel = 'No attribute';
          else if (a.rolled === 'never') rollLabel = 'Not rolled';
          else if (a.attribute && tables.attributes.has(a.attribute)) {
            attribute = tables.attributes.get(a.attribute)!;
            rollLabel = attribute.name;
          } else {
            const rule = ATTRIBUTE_RULES[a.attribute ?? ''];
            if (!rule) throw new Error(`The Action "${a.name}" has an attribute with no player wording.`);
            rollLabel = rule;
          }

          const gearNames = (a.gear ?? []).map((id) => {
            const name = GEAR[id];
            if (!name) throw new Error(`The Action "${a.name}" names gear with no player wording.`);
            return name;
          });
          let gear = 'None';
          if (gearNames.length) {
            const list = capitalise(orList.format(gearNames));
            if (a.requires_gear && a.without_gear === 'not_possible') gear = `${list}. Without one, it cannot be ${kind.verb}.`;
            else if (a.requires_gear && a.without_gear === 'attribute_alone') gear = `${list}. Without one, roll ${attribute?.name ?? 'the attribute'} alone, with no Talent dice and no Gear Dice.`;
            else if (a.requires_gear) throw new Error(`No player wording for what "${a.name}" does without its gear.`);
            else gear = `${list}, if you have one.`;
            if (w.gear_note) gear = `${gear} ${text('gear note', w.gear_note)}`;
          }

          const namers = tables.talents.filter((t) => t.names.includes(a.id)).sort((x, y) => x.name.localeCompare(y.name, 'en'));
          const data = {
            name: a.name,
            order: index,
            kind: { slug: kind.slug, name: kind.name, order: kind.order },
            attribute,
            rollLabel,
            calledRoll: a.rolled === 'when_called',
            gear,
            requires: (w.requires ?? []).map((r) => text('requirements', r)),
            needs: w.needs ? text('needs', w.needs) : null,
            does: w.does.map((d) => text('effect', d)),
            help: w.help ? text('Help rule', w.help) : null,
            pages: w.pages,
            notInUse: Boolean(a.dormant || a.reserved),
            diceTalents: namers.filter((t) => t.type === 'dice').map((t) => ({ slug: t.id, name: t.name, condition: talentCondition(tables, t, a.id) })),
            ruleTalents: namers.filter((t) => t.type === 'rule').map((t) => ({ slug: t.id, name: t.name })),
          };
          const parsed = await ctx.parseData({ id: a.id, data });
          ctx.store.set({ id: a.id, data: parsed, digest: ctx.generateDigest(parsed) });
        }
        ctx.logger.info(`Loaded ${tables.actions.length} Action Catalog entries from the shared tables.`);
      };
      await sync();
      watchSources(ctx, characterSources(ctx), sync);
    },
  };
}

// ---------------------------------------------------------------- Specialties

const ISSUE_ITEMS: Record<string, string> = {
  'medical-kit': 'medical kit',
  'tool-kit': 'tool kit',
};

export function specialtiesLoader(): Loader {
  return {
    name: 'wof-specialties',
    load: async (ctx) => {
      const sync = async () => {
        const tables = await loadCharacterTables(ctx);
        const talents = new Map(tables.talents.map((t) => [t.id, t]));
        const list = (owner: string, ids: string[]) =>
          ids.map((id) => {
            const t = talents.get(id);
            if (!t) throw new Error(`The ${owner} list names a Talent that does not exist.`);
            return { slug: t.id, name: t.name, kind: t.type };
          });
        const fix = 'Fix the Specialty row; the Specialties page shows it as written.';

        ctx.store.clear();
        for (const [order, s] of tables.specialties.entries()) {
          const key = tables.attributes.get(s.key_attribute);
          if (!key) throw new Error(`The Specialty "${s.name}" has a key attribute that does not exist.`);
          const issue = tables.issueRows.find((row) => row.specialty === s.id);
          let issueText: string | null = null;
          if (issue) {
            const item = ISSUE_ITEMS[issue.item];
            if (!item) throw new Error(`The Standard Issue item for "${s.name}" has no player wording.`);
            issueText = `Standard Issue also gives you a ${item} with a rating of ${issue.rating}.`;
          }
          const data = {
            name: s.name,
            order,
            general: false,
            keyAttribute: key,
            summary: checkPlayerText(`The summary of "${s.name}"`, s.summary, tables.ids, fix),
            issue: issueText,
            talents: list(s.name, s.talents),
          };
          const parsed = await ctx.parseData({ id: s.id, data });
          ctx.store.set({ id: s.id, data: parsed, digest: ctx.generateDigest(parsed) });
        }
        const g = tables.general;
        const data = {
          name: g.name,
          order: tables.specialties.length,
          general: true,
          keyAttribute: null,
          summary: checkPlayerText('The summary of the general list', g.summary, tables.ids, fix),
          issue: null,
          talents: list('general', g.talents),
        };
        const parsed = await ctx.parseData({ id: 'general', data });
        ctx.store.set({ id: 'general', data: parsed, digest: ctx.generateDigest(parsed) });
        ctx.logger.info(`Loaded ${tables.specialties.length} Specialties and the general list from the shared tables.`);
      };
      await sync();
      watchSources(ctx, characterSources(ctx), sync);
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
          readYaml<{ standard_titans: Record<string, string>; abnormals: { id: string }[]; ladders?: { id: string; name: string }[] }>(new URL(fixed[0], root)),
          readYaml<Raw>(new URL(fixed[1], root)),
          readYaml<{ facts: { id: string; for: string[] }[] }>(new URL(fixed[2], root)),
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
          const raw = await readYaml<RawTitan>(new URL(file, root));
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
      watchSources(ctx, [...fixed, ...titanFiles].map((p) => new URL(p, root)), sync);
    },
  };
}
