/**
 * Reads and validates the shared tables in data/ and the site's player wording (ADR-0012,
 * ADR-0020, ADR-0025). Every file goes through its schema; any failure throws with the file and
 * the path of the bad value, so the build stops instead of shipping a stale or broken table.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import type { z } from 'zod';
import * as S from './schemas.ts';

export const FOUNDRY_ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const REPO_ROOT = resolve(FOUNDRY_ROOT, '..');

export class DataShapeError extends Error {
  constructor(file: string, issues: string[]) {
    super(`${file} does not match the shape the Foundry system reads:\n  ${issues.join('\n  ')}\nUpdate foundry/tools/data/schemas.ts and the code that reads it.`);
    this.name = 'DataShapeError';
  }
}

export type Reader = (repoPath: string) => string;
export const fileReader: Reader = (repoPath) => readFileSync(resolve(REPO_ROOT, repoPath), 'utf8');

function parseWith<T extends z.ZodType>(read: Reader, repoPath: string, schema: T): z.infer<T> {
  let raw: unknown;
  try {
    raw = parse(read(repoPath));
  } catch (err) {
    throw new DataShapeError(repoPath, [`cannot be read as YAML: ${(err as Error).message}`]);
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new DataShapeError(
      repoPath,
      result.error.issues.map((i) => `${i.path.length ? i.path.join('.') : '(root)'}: ${i.message}`),
    );
  }
  return result.data;
}

/** Every file the system reads, by key. */
export const FILES = {
  attributes: ['data/character/attributes.yaml', S.attributesFile],
  actionCatalog: ['data/character/action-catalog.yaml', S.actionCatalogFile],
  talents: ['data/character/talents.yaml', S.talentsFile],
  specialties: ['data/character/specialties.yaml', S.specialtiesFile],
  origins: ['data/character/origins.yaml', S.originsFile],
  squadmates: ['data/character/squadmates.yaml', S.squadmatesFile],
  lifepath: ['data/character/lifepath.yaml', S.lifepathFile],
  enlistment: ['data/character/enlistment.yaml', S.enlistmentFile],
  trainingYears: ['data/character/training-years.yaml', S.trainingYearsFile],
  classRank: ['data/character/class-rank.yaml', S.classRankFile],
  graduationExam: ['data/character/graduation-exam.yaml', S.graduationExamFile],
  harmSheetFields: ['data/harm/sheet-fields.yaml', S.harmSheetFieldsFile],
  gearSheetFields: ['data/gear/sheet-fields.yaml', S.gearSheetFieldsFile],
  gearItems: ['data/gear/items.yaml', S.gearItemsFile],
  carrying: ['data/gear/carrying.yaml', S.carryingFile],
  odmGear: ['data/gear/odm-gear.yaml', S.odmGearFile],
  standardIssue: ['data/gear/standard-issue.yaml', S.standardIssueFile],
  criticalInjuries: ['data/harm/critical-injuries.yaml', S.criticalInjuriesFile],
  down: ['data/harm/down.yaml', S.downFile],
  titanFormat: ['data/engagement/titan-format.yaml', S.titanFormatFile],
  sizeClasses: ['data/engagement/size-classes.yaml', S.sizeClassesFile],
  titanIndex: ['data/titans/index.yaml', S.titanIndexFile],
  foes: ['data/skirmish/foes.yaml', S.foesFile],
  attention: ['data/engagement/attention.yaml', S.attentionFile],
  titanHarm: ['data/engagement/titan-harm.yaml', S.titanHarmFile],
  skirmish: ['data/skirmish/skirmish.yaml', S.skirmishFile],
  dicePool: ['data/core/dice-pool.yaml', S.dicePoolFile],
  circumstances: ['data/core/circumstances.yaml', S.circumstancesFile],
  bonusDice: ['data/core/bonus-dice-sources.yaml', S.bonusDiceSourcesFile],
  scars: ['data/mind/scars.yaml', S.scarsFile],
  stressResponses: ['data/mind/stress-responses.yaml', S.stressResponsesFile],
  fearRolls: ['data/mind/fear-rolls.yaml', S.fearRollsFile],
  deathRolls: ['data/harm/death-rolls.yaml', S.deathRollsFile],
  talentWording: ['site/src/content/compendium/talent-text.yaml', S.talentWordingFile],
  gearWording: ['site/src/content/compendium/gear-text.yaml', S.gearWordingFile],
  actionWording: ['site/src/content/compendium/action-text.yaml', S.actionWordingFile],
  round: ['data/engagement/round.yaml', S.roundFile],
  positions: ['data/engagement/positions.yaml', S.positionsFile],
  anchorRatings: ['data/engagement/anchor-ratings.yaml', S.anchorRatingsFile],
  zones: ['data/engagement/zones.yaml', S.zonesFile],
  grab: ['data/engagement/grab.yaml', S.grabFile],
  backgroundTitans: ['data/engagement/background-titans.yaml', S.backgroundTitansFile],
  engagementSetup: ['data/engagement/engagement-setup.yaml', S.engagementSetupFile],
  squadTactics: ['data/engagement/squad-tactics.yaml', S.squadTacticsFile],
  falls: ['data/gear/falls.yaml', S.fallsFile],
  engagementEnd: ['data/harm/engagement-end.yaml', S.engagementEndFile],
  grief: ['data/mind/grief.yaml', S.griefFile],
  stressChanges: ['data/core/stress-changes.yaml', S.stressChangesFile],
} as const;

type Files = typeof FILES;
export type Tables = { [K in keyof Files]: z.infer<Files[K][1]> } & {
  titans: z.infer<typeof S.titanFile>[];
};

function fail(file: string, message: string): never {
  throw new DataShapeError(file, [message]);
}

/** Checks the references between tables that no single schema can see. */
function crossCheck(t: Tables): void {
  const actions = new Set(t.actionCatalog.entries.map((e) => e.id));
  const talents = new Set(t.talents.talents.map((x) => x.id));
  const specialties = new Set(t.specialties.specialties.map((x) => x.id));
  const templates = new Set(t.squadmates.templates.map((x) => x.id));
  const gear = new Set(t.gearItems.items.map((x) => x.id));

  const unique = (file: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const i of ids) {
      if (seen.has(i)) fail(file, `the id "${i}" appears twice`);
      seen.add(i);
    }
  };
  unique(FILES.talents[0], t.talents.talents.map((x) => x.id));
  unique(FILES.actionCatalog[0], t.actionCatalog.entries.map((e) => e.id));

  for (const e of t.actionCatalog.entries) {
    for (const g of e.gear ?? []) if (!gear.has(g as never)) fail(FILES.actionCatalog[0], `"${e.id}" names gear "${g}", which data/gear/items.yaml does not list`);
    if (e.option_of && /^[a-z-]+$/.test(e.option_of) && !actions.has(e.option_of)) fail(FILES.actionCatalog[0], `"${e.id}" is an option of a missing entry`);
  }
  for (const x of t.talents.talents) {
    for (const n of x.names) if (!actions.has(n)) fail(FILES.talents[0], `"${x.id}" names "${n}", which is not an Action Catalog entry`);
    for (const s of x.specialties) if (!specialties.has(s)) fail(FILES.talents[0], `"${x.id}" lists the missing Specialty "${s}"`);
  }
  for (const s of t.specialties.specialties) {
    for (const x of s.talents) if (!talents.has(x)) fail(FILES.specialties[0], `"${s.id}" lists the missing Talent "${x}"`);
    if (!templates.has(s.squadmate_template)) fail(FILES.specialties[0], `"${s.id}" names a missing Squadmate template`);
  }
  for (const x of t.specialties.general.talents) if (!talents.has(x)) fail(FILES.specialties[0], `the general list names the missing Talent "${x}"`);
  for (const o of t.origins.rows) {
    for (const x of o.talent_choice) if (!talents.has(x)) fail(FILES.origins[0], `"${o.id}" offers the missing Talent "${x}"`);
    if (new Set(o.talent_choice).size !== o.talent_choice.length) fail(FILES.origins[0], `"${o.id}" offers the same Talent twice`);
    if (new Set(o.haven_choice).size !== o.haven_choice.length) fail(FILES.origins[0], `"${o.id}" offers the same Haven twice`);
  }
  for (const y of t.trainingYears.years) {
    for (const x of y.curriculum) if (!talents.has(x)) fail(FILES.trainingYears[0], `${y.id} lists the missing curriculum Talent "${x}"`);
    if (new Set(y.curriculum).size !== y.curriculum.length) fail(FILES.trainingYears[0], `${y.id} lists the same curriculum Talent twice`);
    for (const e of y.events) {
      for (const x of e.talent_choice) if (!talents.has(x)) fail(FILES.trainingYears[0], `the event "${e.name}" offers the missing Talent "${x}"`);
      if (new Set(e.talent_choice).size !== e.talent_choice.length) fail(FILES.trainingYears[0], `the event "${e.name}" offers the same Talent twice`);
    }
  }
  for (const r of t.enlistment.rows) for (const a of r.drive.acts ?? []) if (a !== 'push' && !actions.has(a)) fail(FILES.enlistment[0], `the Drive "${r.drive.id}" names the act "${a}", which is not an Action Catalog entry`);
  {
    const exam = new Set(t.graduationExam.conditions.exam_issue.map((i) => i.item));
    const stages = new Set(t.graduationExam.stages.map((st) => st.id));
    for (const id of t.graduationExam.order) if (!stages.has(id)) fail(FILES.graduationExam[0], `order names the missing Stage "${id}"`);
    for (const id of stages) if (!t.graduationExam.order.includes(id)) fail(FILES.graduationExam[0], `the Stage "${id}" is not in order`);
    const seenTrial = new Set<string>();
    for (const st of t.graduationExam.stages) {
      const results = st.trials.map((tr) => tr.result).sort((a, b) => a - b);
      if (results.join() !== '1,2,3,4,5,6') fail(FILES.graduationExam[0], `the Stage "${st.id}" does not cover every D6 result once`);
      for (const tr of st.trials) {
        if (seenTrial.has(tr.id)) fail(FILES.graduationExam[0], `two Trials share the id "${tr.id}"`);
        seenTrial.add(tr.id);
        const choices = tr.entry ? [{ entry: tr.entry, gear_item: tr.gear_item ?? null }] : (tr.entry_choice ?? []);
        if (!choices.length) fail(FILES.graduationExam[0], `the Trial "${tr.id}" has neither an entry nor entry choices`);
        if (tr.entry && tr.entry_choice) fail(FILES.graduationExam[0], `the Trial "${tr.id}" has both an entry and entry choices`);
        for (const c of choices) {
          if (!actions.has(c.entry)) fail(FILES.graduationExam[0], `the Trial "${tr.id}" names the missing entry "${c.entry}"`);
          if (c.gear_item && !exam.has(c.gear_item)) fail(FILES.graduationExam[0], `the Trial "${tr.id}" names "${c.gear_item}", which is not exam issue`);
        }
      }
    }
    const conds = t.graduationExam.conditions_table.rows.map((r) => r.result).sort((a, b) => a - b);
    if (conds.join() !== '1,2,3,4,5,6') fail(FILES.graduationExam[0], 'the conditions table does not cover every D6 result once');
    const items = new Set(t.gearItems.items.map((i) => i.id));
    for (const i of t.graduationExam.conditions.exam_issue) {
      if (!items.has(i.counts_as as never)) fail(FILES.graduationExam[0], `the exam issue "${i.item}" counts as "${i.counts_as}", which data/gear/items.yaml does not list`);
    }
  }
  for (const [file, table] of [[FILES.origins[0], t.origins.rows], [FILES.enlistment[0], t.enlistment.rows], ...t.trainingYears.years.map((y) => [FILES.trainingYears[0], y.events] as const)] as const) {
    const seen = new Set<number>();
    for (const row of table as readonly { results: number[] }[]) for (const n of row.results) {
      if (seen.has(n)) fail(file, `the D66 result ${n} is on two rows`);
      seen.add(n);
    }
    for (const tens of [1, 2, 3, 4, 5, 6]) for (const units of [1, 2, 3, 4, 5, 6]) if (!seen.has(tens * 10 + units)) fail(file, `no row covers the D66 result ${tens * 10 + units}`);
  }
  for (const m of t.squadmates.templates) {
    if (!specialties.has(m.specialty)) fail(FILES.squadmates[0], `template "${m.id}" has a missing Specialty`);
    if (!talents.has(m.talent.id)) fail(FILES.squadmates[0], `template "${m.id}" has the missing Talent "${m.talent.id}"`);
  }
  for (const id of Object.keys(t.talentWording.talents)) if (!talents.has(id)) fail(FILES.talentWording[0], `has wording for "${id}", which is not a Talent`);
  for (const id of Object.keys(t.gearWording.items)) if (!gear.has(id as never)) fail(FILES.gearWording[0], `has wording for "${id}", which is not a gear item`);
  for (const x of t.talents.talents) {
    if (x.type === 'rule' && !(t.talentWording.talents[x.id]?.trigger && t.talentWording.talents[x.id]?.effect)) {
      fail(FILES.talentWording[0], `the Rule Talent "${x.id}" has no player wording`);
    }
  }
  for (const [file, rows] of [[FILES.scars[0], t.scars.table.rows], [FILES.stressResponses[0], t.stressResponses.table.rows]] as const) {
    for (const row of rows) {
      for (const e of row.effects) {
        if (e.type !== 'penalty') continue;
        for (const n of (e as { entries: string[] }).entries) if (!actions.has(n)) fail(file, `"${row.id}" names "${n}", which is not an Action Catalog entry`);
      }
    }
  }
  const ladders = new Set(['standard', ...t.titanIndex.ladders.map((l) => l.id)]);
  const tests = new Set(t.attention.tests.map((x) => x.id));
  for (const l of [...t.attention.ladders, ...t.titanIndex.ladders]) {
    for (const r of l.rungs) if (!tests.has(r)) fail(FILES.titanIndex[0], `the ladder "${l.id}" uses the missing test "${r}"`);
  }
  const weapons = new Set(t.skirmish.weapons.rows.map((w) => w.id));
  for (const f of t.foes.foes) {
    const fw = typeof f.fight_weapon === 'string' ? [f.fight_weapon] : [...f.fight_weapon.rows.map((r) => r.weapon), ...(f.fight_weapon.at_night ? [f.fight_weapon.at_night.with] : [])];
    for (const w of [...fw, ...(f.shoot_weapon ? [f.shoot_weapon] : [])]) if (!weapons.has(w)) fail(FILES.foes[0], `"${f.id}" names the missing weapon "${w}"`);
  }
  const ratings = new Set(t.anchorRatings.ratings.map((r) => r.id));
  for (const r of t.engagementSetup.anchor_rating.rows) if (!ratings.has(r.anchor_rating)) fail(FILES.engagementSetup[0], `names the missing Anchor Rating "${r.anchor_rating}"`);
  for (const r of t.anchorRatings.ratings) {
    for (const k of ['sparser', 'denser'] as const) if (!ratings.has(r[k])) fail(FILES.anchorRatings[0], `"${r.id}" names the missing ${k} rating "${r[k]}"`);
  }
  // The field layouts (decision batch 16, 16-2): each zone once, the centre and the start zone on it.
  for (const size of t.zones.fields.sizes) {
    const seen = new Set(size.zones.map((c) => `${c.q},${c.r}`));
    if (seen.size !== size.zones.length) fail(FILES.zones[0], `the ${size.id} field places two zones on one hex`);
    for (const n of [size.centre, size.squad_start]) if (!size.zones.some((c) => c.n === n)) fail(FILES.zones[0], `the ${size.id} field names the missing zone ${n}`);
  }
  const titanIds = new Set(t.titans.map((x) => x.id));
  for (const r of t.engagementSetup.medium_abnormal.rows) if (!titanIds.has(r.titan)) fail(FILES.engagementSetup[0], `names the missing Titan "${r.titan}"`);
  if (t.grab.grab_lands.grip_toughness !== t.sizeClasses.grip_toughness) fail(FILES.grab[0], 'its grip Toughness differs from data/engagement/size-classes.yaml');
  for (const titan of t.titans) {
    if (!ladders.has(titan.attention_ladder)) fail(`data/titans/${titan.id}.yaml`, `names the missing Attention Ladder "${titan.attention_ladder}"`);
    if (!titan.abnormal) {
      const size = t.sizeClasses.classes.find((c) => c.id === titan.size_class)!;
      for (const key of ['tempo', 'nape_depth', 'regeneration_clock', 'heave', 'stride'] as const) {
        if (titan[key] !== size[key]) fail(`data/titans/${titan.id}.yaml`, `${key} differs from its Size Class row`);
      }
    }
  }
}

/** Loads every table. Pass a reader to test against altered file contents. */
export function loadTables(read: Reader = fileReader): Tables {
  const out = {} as Record<string, unknown>;
  for (const [key, [path, schema]] of Object.entries(FILES)) out[key] = parseWith(read, path, schema as z.ZodType);
  const index = out.titanIndex as z.infer<typeof S.titanIndexFile>;
  const titanIds = [...Object.values(index.standard_titans), ...index.abnormals.map((a) => a.id)];
  out.titans = titanIds.map((id) => {
    const titan = parseWith(read, `data/titans/${id}.yaml`, S.titanFile);
    if (titan.id !== id) fail(`data/titans/${id}.yaml`, `its id is "${titan.id}"`);
    return titan;
  });
  const tables = out as Tables;
  crossCheck(tables);
  return tables;
}
