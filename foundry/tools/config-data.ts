/**
 * The system configuration baked into the bundle at build time (virtual:wof-config): the Action
 * Catalog (ADR-0025: system config, not items) and the rule constants the client reads. Everything
 * comes from the validated tables, so the client never parses YAML.
 */
import type { Tables } from './data/load.ts';
import type { FoundryWording } from './data/foundry-wording.ts';
import type { SiteWording } from './data/site-wording.ts';
import { checkPlayerText, hyphenatedIds } from './data/wording.ts';
import { CARRIED_COMRADE_ITEMS, CARRYING_LIMIT_BONUS, MAX_GRIEF_COUNTED } from '../src/rules/derived.ts';
import { entryNeeds, ROLL_TALENTS } from '../src/rules/roll.ts';
import type { LpTables, Procedure } from '../src/rules/lifepath.ts';
import { docId } from './data/ids.ts';
import { wordingTexts } from './data/lifepath-wording.ts';

export function gearSubtype(itemId: string): 'odm' | 'blade-set' | 'firearm' | 'horse' | 'kit' | 'prosthetic' | null {
  switch (itemId) {
    case 'odm-gear':
      return 'odm';
    case 'blade-set':
      return 'blade-set';
    case 'flintlock-pistol':
    case 'musket':
      return 'firearm';
    case 'horse':
      return 'horse';
    case 'medical-kit':
    case 'tool-kit':
      return 'kit';
    case 'prosthetic-arm':
    case 'prosthetic-leg':
      return 'prosthetic';
    case 'gas-canister':
      return null; // recorded on the actor as gas_rating and spare_canisters
    default:
      throw new Error(`data/gear/items.yaml: the item "${itemId}" has no gear subtype. Add it to foundry/tools/config-data.ts.`);
  }
}

function checkConstants(t: Tables): void {
  const comrade = t.carrying.items_counted.find((row) => row.what.startsWith('a comrade the soldier carries'));
  if (!comrade) throw new Error('data/gear/carrying.yaml: items_counted has no row for a carried comrade.');
  if (comrade.items !== CARRIED_COMRADE_ITEMS) {
    throw new Error(`data/gear/carrying.yaml: a carried comrade counts as ${comrade.items} items, the code says ${CARRIED_COMRADE_ITEMS}. Update src/rules/derived.ts.`);
  }
  // The formula literals in the schemas pin these; restate them so a code edit cannot drift alone.
  if (CARRYING_LIMIT_BONUS !== 4) throw new Error('src/rules/derived.ts: the carrying limit is strength + 4 (data/gear/carrying.yaml).');
  if (MAX_GRIEF_COUNTED !== 3) throw new Error('src/rules/derived.ts: at most 3 points of Grief count (data/character/attributes.yaml).');
  for (const item of t.gearItems.items) gearSubtype(item.id);
  // Wear (src/rules/roll.ts, wearOutcome): a Blade Set is ruined by any point; every other rated item loses 1 per point.
  for (const item of t.gearItems.items) {
    if (!item.rated) continue;
    const ruins = item.id === 'blade-set';
    const ok = ruins ? /ruins/.test(item.wear ?? '') : /lowers the current rating by 1/.test(item.wear ?? '');
    if (!ok) throw new Error(`data/gear/items.yaml: the wear of "${item.id}" changed ("${item.wear}"). Update src/rules/roll.ts (wearOutcome).`);
  }
  // Rule Talents the roll code applies by id (src/rules/roll.ts, ROLL_TALENTS).
  for (const [id, names] of Object.entries(ROLL_TALENTS)) {
    const row = t.talents.talents.find((x) => x.id === id);
    if (!row || row.type !== 'rule' || names.some((n) => !row.names.includes(n))) {
      throw new Error(`data/character/talents.yaml: the Talent "${id}" no longer names ${names.join(', ')}. Update src/rules/roll.ts (ROLL_TALENTS) and the roll code.`);
    }
  }
  if (t.odmGear.gas_roll.dice.standard > t.odmGear.gas_roll.dice.maximum) throw new Error('data/gear/odm-gear.yaml: the standard Gas Roll exceeds the maximum.');
}

export interface MindEffect {
  type: string;
  dice?: number;
  entries?: string[];
  amount?: number;
  /** When a penalty applies only in a narrower case than every roll of its entries. */
  appliesTo?: string;
  text?: string;
}

function mindEffects(effects: readonly Record<string, unknown>[]): MindEffect[] {
  return effects.map((e) => ({
    type: String(e.type),
    ...(typeof e.dice === 'number' ? { dice: e.dice } : {}),
    ...(Array.isArray(e.entries) ? { entries: e.entries as string[] } : {}),
    ...(typeof e.amount === 'number' ? { amount: e.amount } : {}),
    ...(typeof e.applies_to === 'string' ? { appliesTo: e.applies_to } : {}),
    ...(typeof e.text === 'string' ? { text: e.text } : {}),
  }));
}

/** "4 or less", "10 to 11", "13 or more", "7": a 2D6 band as the website labels it. */
const rangeText = ({ min, max }: { min: number | null; max: number | null }) =>
  min === null ? `${max} or less` : max === null ? `${min} or more` : min === max ? String(min) : `${min} to ${max}`;

/** A website table cell that says "None" or "Nothing" is an empty list on a sheet. */
const lines = (text: string): string[] => (text === 'None' || text === 'Nothing' ? [] : [text]);

/** The status tooltips: the website glossary's definition, else the Foundry wording. */
export const STATUS_TERMS: Record<string, string> = {
  down: 'Down',
  grabbed: 'Grabbed',
  pinned: 'Pinned',
  held: 'Held',
  engaged: 'Engaged',
  airborne: 'Airborne',
  jammed: 'Jammed',
  overloaded: 'Overloaded',
  mounted: 'Mounted',
  'lame-horse': 'Lame',
  carried: 'Carried',
};

function statusText(site: SiteWording, fw: FoundryWording): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, term] of Object.entries(STATUS_TERMS)) {
    const k = term.toLowerCase();
    const g = site.glossary.find((e) => e.term.toLowerCase() === k || e.aliases.some((a) => a.toLowerCase() === k));
    if (!g) throw new Error(`The website glossary no longer defines "${term}". Word the "${id}" status in foundry/wording/statuses.yaml.`);
    out[id] = g.definition;
  }
  for (const [id, text] of Object.entries(fw.statuses)) {
    if (out[id]) throw new Error(`foundry/wording/statuses.yaml words "${id}", which the website glossary already defines. Remove it.`);
    out[id] = text;
  }
  return out;
}

/** Merit bands as the rules read them. */
const bands = (rows: { successes_min: number; successes_max: number | null; merit: number }[]) => rows.map((r) => ({ min: r.successes_min, max: r.successes_max, value: r.merit }));

/** The tables the Lifepath wizard reads (src/rules/lifepath.ts), with the website's wording. */
export function lifepathTables(t: Tables, site: SiteWording): LpTables {
  const range = /from (\d{3}) to (\d{3})/.exec(t.lifepath.steps[0].does)!;
  const siteYears = byId(site.years, 'Training Year');
  const issueRow = t.standardIssue.by_funding.find((r) => r.funding === t.standardIssue.funding.until_funding_rules);
  if (!issueRow) throw new Error('data/gear/standard-issue.yaml has no row for the Funding in force.');
  const examDice = new Map(t.graduationExam.conditions.exam_issue.map((i) => [i.item, i.gear_dice]));
  const entryAttr = (id: string) => {
    const e = t.actionCatalog.entries.find((x) => x.id === id);
    if (!e || !e.attribute || e.attribute === 'from_performance_attributes') throw new Error(`The Exam entry "${id}" has no attribute.`);
    return e.attribute;
  };
  const trials = t.graduationExam.order.map((id) => {
    const tr = t.graduationExam.trials.find((x) => x.id === id);
    if (!tr) throw new Error(`data/character/graduation-exam.yaml orders the missing Trial "${id}".`);
    const choices = (tr.entry ? [{ entry: tr.entry, gear_item: tr.gear_item ?? null }] : (tr.entry_choice ?? [])).map((c) => ({ entry: c.entry, gear: c.gear_item, dice: c.gear_item ? (examDice.get(c.gear_item) ?? 0) : 0 }));
    const merit = bands(tr.merit);
    const paying = merit.filter((b) => b.value > 0).map((b) => b.min ?? 0);
    return { id: tr.id, name: tr.name, description: tr.description, choices, needs: tr.needs ?? Math.min(...paying), push: tr.push, help: tr.help !== 'none', merit };
  });
  const entryAttributes = Object.fromEntries(trials.flatMap((x) => x.choices.map((c) => [c.entry, entryAttr(c.entry)])));
  const templates = new Map(t.squadmates.templates.map((m) => [m.id, m.attributes]));
  const choiceProcedures = (option: string): Procedure[] => ['lifepath', ...(option.includes('template-build') ? ['template-build' as const] : []), ...(option.includes('free-build') ? ['free-build' as const] : [])];
  const built = t.attributes.creation.built;
  return {
    campaignYears: { min: Number(range[1]), max: Number(range[2]) },
    campaignChoices: t.lifepath.campaign_choice.options.map((o) => ({ id: o, procedures: choiceProcedures(o) })),
    origins: t.origins.rows.map((o) => {
      const w = site.origins[o.id];
      if (!w) throw new Error(`The website has no Origin "${o.id}".`);
      return {
        id: o.id,
        results: o.results,
        name: o.name,
        description: w.description,
        attributes: o.attributes,
        talents: o.talent_choice,
        havens: w.havens,
        canonTie: w.canonTie,
        yearMin: o.condition?.campaign_year_min ?? null,
        condition: site.originConditions[o.id] ?? null,
      };
    }),
    enlistment: t.enlistment.rows.map((r) => {
      const w = site.enlistment[r.id];
      if (!w) throw new Error(`The website has no Why You Enlisted row "${r.id}".`);
      return { id: r.id, results: r.results, reason: w.reason, attribute: r.attribute, drive: { id: r.drive.id, name: r.drive.name, trigger: w.trigger, namedComrade: r.drive.needs_named_comrade } };
    }),
    years: t.trainingYears.years.map((y) => {
      const w = siteYears(y.id);
      if (w.events.length !== y.events.length) throw new Error(`The website words a different set of ${y.id} events.`);
      return {
        id: y.id,
        title: w.title,
        subtitle: w.subtitle,
        performance: y.performance_attributes,
        curriculum: y.curriculum,
        events: y.events.map((e, i) => ({ results: e.results, name: w.events[i].name, description: w.events[i].description, attribute: e.attribute, talents: e.talent_choice, merit: e.merit_change })),
      };
    }),
    performanceMerit: bands(t.trainingYears.performance_roll.merit_from_successes),
    classRank: t.classRank.rows.map((r) => ({ min: r.merit_min, max: r.merit_max, rank: r.class_rank, top10: r.top_10 })),
    exam: { trials, responseCost: 1 },
    talents: t.talents.talents.map((x) => ({ id: x.id, name: x.name, type: x.type, maxLevel: x.max_level ?? 1, names: x.names, conditional: Object.keys(x.condition ?? {}), specialties: x.specialties })),
    specialties: t.specialties.specialties.map((sp) => {
      const tmpl = templates.get(sp.squadmate_template);
      if (!tmpl) throw new Error(`The Specialty "${sp.id}" has no Squadmate template.`);
      return { id: sp.id, name: sp.name, key: sp.key_attribute, talents: sp.talents, summary: site.specialties[sp.id]?.summary ?? sp.summary, template: { ...tmpl } };
    }),
    general: t.specialties.general.talents,
    dormant: t.actionCatalog.entries.filter((e) => e.dormant || e.reserved).map((e) => e.id),
    entryAttributes,
    rules: {
      start: t.attributes.creation.starting_rating,
      cap: t.attributes.creation.cap_before_graduation,
      keyMin: t.attributes.creation.graduation.key_attribute_minimum,
      keyMax: t.attributes.scale.max_key_attribute,
      top10Bonus: t.attributes.creation.graduation.top_10_key_attribute_bonus,
      talentCap: t.trainingYears.talent_cap.max_level_at_creation,
      built: {
        total: built.total_points,
        min: built.min,
        max: built.max,
        key: built.key_attribute,
        maxAt4: built.max_attributes_at_4,
        shapes: built.free_build.shapes.map((x) => ({ id: x.id, ratings: x.ratings })),
        talentMax: t.lifepath.built_steps.talent_levels.max_level,
        maxAtTwo: t.lifepath.built_steps.talent_levels.max_talents_at_level_2,
        anyLevels: t.lifepath.built_steps.talent_levels.sources[2].levels,
      },
    },
    issue: {
      funding: issueRow.funding,
      odm: issueRow.odm_gear_rating,
      spares: issueRow.spare_canisters,
      blades: issueRow.blade_sets,
      horse: issueRow.horse_rating,
      bladeRating: t.standardIssue.every_row.blade_set_rating,
      fullGas: t.odmGear.gas.full_gas_rating,
      bySpecialty: t.standardIssue.by_specialty.rows.map((r) => ({ specialty: r.specialty, item: r.item, rating: r.rating })),
    },
  };
}

function byId<T extends { id: string }>(rows: T[], what: string) {
  return (id: string): T => {
    const row = rows.find((r) => r.id === id);
    if (!row) throw new Error(`The website has no ${what} "${id}".`);
    return row;
  };
}

/** The compendium document ids the wizard takes Items from (tools/pack-docs.ts uses the same keys). */
export function packIds(t: Tables) {
  const ids = <T extends { id: string }>(pack: string, rows: T[]) => Object.fromEntries(rows.map((r) => [r.id, docId(pack, r.id)]));
  return {
    talents: ids('talents', t.talents.talents),
    specialties: ids('specialties', t.specialties.specialties),
    origins: ids('origins', t.origins.rows),
    gear: ids('gear', t.gearItems.items.filter((g) => gearSubtype(g.id) !== null)),
  };
}

export function buildConfig(t: Tables, site: SiteWording, fw: FoundryWording) {
  checkConstants(t);
  const funding = t.standardIssue.funding.until_funding_rules;
  const byOrder = <T>(rows: T[], wording: unknown[], what: string): T[] => {
    if (rows.length !== wording.length) throw new Error(`The website words a different set of ${what} rows.`);
    return rows;
  };
  const responses = byOrder(t.stressResponses.table.rows, site.stressResponses, 'Stress Response');
  const fears = byOrder(t.fearRolls.table.rows, site.fearRows, 'Fear Roll');
  const triggers = byOrder(t.fearRolls.triggers, site.fearTriggers, 'Fear Roll trigger');
  const outcomes = byOrder(t.deathRolls.outcomes, site.deathOutcomes, 'Death Roll outcome');
  const scarText = (id: string) => {
    const w = site.scars[id];
    if (!w) throw new Error(`The website has no Scar "${id}".`);
    return w;
  };
  const actionText = (id: string) => {
    const w = site.actions[id];
    if (!w) throw new Error(`The website has no Action "${id}".`);
    return { does: w.does, requires: w.requires, needs: w.needs, help: w.help, gear: w.gear, rollLabel: w.rollLabel };
  };
  const injuryRows: Record<string, { location: string; range: string; name: string; whileHeld: string[]; permanent: string[]; hasPermanent: boolean; riders: string[] }> = {};
  for (const [location, table] of Object.entries(t.criticalInjuries.tables)) {
    const rows = byOrder(table.rows, site.injuries[location] ?? [], `${location} Critical Injury`);
    const riderList = Object.entries(table.type_riders).flatMap(([type, list]) => (list ?? []).map((rider) => ({ type, rider })));
    const siteRiders = byOrder(riderList, site.riders[location] ?? [], `${location} type rider`);
    rows.forEach((row, n) => {
      const w = site.injuries[location][n];
      const permanent = 'permanent_effects' in row ? (row.permanent_effects ?? []) : [];
      injuryRows[row.id] = {
        location,
        range: rangeText(row.results),
        name: row.names.crush,
        whileHeld: 'instant_death' in row ? [] : lines(w.whileHeld),
        permanent: 'instant_death' in row ? [] : lines(w.permanent),
        hasPermanent: permanent.length > 0,
        riders: siteRiders.flatMap((r, k) =>
          r.rider.all_rows || r.rider.rows?.includes(row.id) || (r.rider.lethal_rows && 'lethal' in row && row.lethal) ? [`${site.riders[location][k].type}: ${site.riders[location][k].text}`] : [],
        ),
      };
    });
  }
  return {
    attributes: t.attributes.attributes.map((a) => ({ id: a.id, name: a.name, summary: a.summary })),
    attributeScale: { min: t.attributes.scale.min, max: t.attributes.scale.max, maxKey: t.attributes.scale.max_key_attribute },
    actionCatalog: t.actionCatalog.entries.map((e) => ({
      id: e.id,
      name: e.name,
      kind: e.kind,
      rolled: e.rolled,
      attribute: e.attribute,
      gear: e.gear ?? [],
      requiresGear: e.requires_gear ?? false,
      withoutGear: e.without_gear ?? null,
      context: e.context,
      needs: e.needs ?? null,
      needsCount: entryNeeds(e.needs ?? null),
      optionOf: e.option_of && /^[a-z-]+$/.test(e.option_of) ? e.option_of : null,
      changes: e.changes,
      talents: t.talents.talents.filter((x) => x.names.includes(e.id)).map((x) => x.id),
      text: actionText(e.id),
    })),
    trackedValues: t.actionCatalog.tracked_values.map((v) => ({ id: v.id, name: v.name })),
    specialties: t.specialties.specialties.map((s) => ({ id: s.id, name: s.name, keyAttribute: s.key_attribute })),
    gearItems: t.gearItems.items.map((i) => ({
      id: i.id,
      name: i.name,
      subtype: gearSubtype(i.id),
      rated: i.rated,
      gearDiceFor: i.gear_dice_for ?? [],
      itemsCounted: i.items_counted,
      passable: i.passable,
      atZero: i.at_zero?.state ?? null,
    })),
    gas: {
      full: t.odmGear.gas.full_gas_rating,
      rollDice: t.odmGear.gas_roll.dice.standard,
      rollDicePushed: t.odmGear.gas_roll.dice.after_pushed_odm_roll,
      rollDiceMax: t.odmGear.gas_roll.dice.maximum,
      rollDiceSquadmate: t.odmGear.gas_roll.dice.squadmate,
    },
    standardIssue: { funding, row: t.standardIssue.by_funding.find((r) => r.funding === funding) ?? null },
    dieTypes: t.dicePool.die_types.map((d) => ({ id: d.id, name: d.name, successFaces: d.success_faces, pushReRolls: d.push_re_rolls_faces })),
    penaltyFloor: Number((t.dicePool.components.find((c) => c.id === 'penalty') as { min_base_dice_after?: unknown } | undefined)?.min_base_dice_after ?? 1),
    rollExceptions: t.dicePool.roll_exceptions.map((r) => ({
      roll: r.roll,
      entries: r.entries ?? [r.roll],
      excluded: r.components_excluded,
      pushAllowed: r.push_allowed,
      coverAllowed: r.cover_allowed ?? r.push_allowed,
      circumstances: r.circumstances !== 'never',
      secret: r.secret ?? false,
      stressResponse: r.stress_response !== 'none',
    })),
    calledRoll: { needs: t.dicePool.called_roll.needs, failureMenu: t.dicePool.called_roll.failure_menu.map((f) => ({ id: f.id, cost: f.cost })) },
    downForbids: [...t.down.forbids],
    fearTriggers: triggers.map((x, i) => ({ id: x.id, name: site.fearTriggers[i].name, event: site.fearTriggers[i].event })),
    fearRows: fears.map((r, i) => ({
      id: r.id,
      name: r.name,
      min: r.results.min,
      max: r.results.max,
      text: site.fearRows[i].text,
      effects: r.effects,
      forbids: r.forbids ?? [],
      effectText: lines(site.fearRows[i].effects),
      forbidsText: lines(site.fearRows[i].forbids ?? 'Nothing'),
    })),
    deathRoll: {
      attribute: t.deathRolls.death_roll.attribute,
      needs: t.deathRolls.death_roll.needs,
      outcomes: outcomes.map((o, i) => ({ id: o.id, min: o.successes.min, max: o.successes.max, text: site.deathOutcomes[i].text })),
    },
    titanDice: { successFaces: [...t.titanFormat.titan_dice.success_faces] },
    circumstances: t.circumstances.steps,
    bonusDiceCap: t.bonusDice.cap_per_roll,
    injuryTypes: t.criticalInjuries.types.map((x) => ({ id: x.id, name: x.name, note: site.injuryTypes[x.id]?.note ?? '' })),
    injuryRows,
    injuryLocations: Object.keys(t.criticalInjuries.tables),
    sidedLocations: [...t.criticalInjuries.sides.sided_locations],
    sizeClasses: t.sizeClasses.classes.map((c) => ({
      id: c.id,
      name: c.name,
      height: c.height,
      tempo: c.tempo,
      napeDepth: c.nape_depth,
      regenerationClock: c.regeneration_clock,
      toughness: c.toughness,
      attackDice: c.attack_dice,
      heave: c.heave,
    })),
    gripToughness: t.sizeClasses.grip_toughness,
    scars: t.scars.table.rows.map((r) => ({ id: r.id, name: r.name, results: r.results, trigger: scarText(r.id).trigger, effectText: [scarText(r.id).effect], effects: mindEffects(r.effects) })),
    maxScars: t.scars.gaining.maximum,
    stressResponses: responses.map((r, i) => ({
      id: r.id,
      name: r.name,
      lasting: r.duration === 'lasting',
      min: r.results.min,
      max: r.results.max,
      text: site.stressResponses[i].text,
      effects: mindEffects(r.effects),
      effectText: lines(site.stressResponses[i].effects),
    })),
    maxGrief: MAX_GRIEF_COUNTED,
    attentionLadders: [
      { id: 'standard', name: null as string | null, rungs: [...t.attention.ladders[0].rungs] },
      ...t.titanIndex.ladders.map((l) => ({ id: l.id, name: l.name as string | null, rungs: [...l.rungs] })),
    ],
    attentionTests: t.attention.tests.map((x) => x.id),
    bodyPartKinds: t.titanHarm.body_part_kinds.map((k) => ({ id: k.id, strikeFrom: [...k.strike_from] })),
    weapons: t.skirmish.weapons.rows.map((w) => ({ id: w.id, name: w.name, usedWith: w.used_with, injuryType: w.injury_type, damage: w.damage, target: w.target })),
    talentNames: Object.fromEntries(t.talents.talents.map((x) => [x.id, x.name])),
    statusText: statusText(site, fw),
    lifepath: lifepathTables(t, site),
    lifepathPage: { sections: site.lifepathPage.sections, boxes: site.lifepathPage.boxes, flows: site.lifepathPage.flows },
    packIds: packIds(t),
  };
}

/** The website's text guard over every sentence the config gives a sheet or a card; returns the count. */
export function sweepConfigText(config: WofConfig, t: Tables): number {
  const ids = hyphenatedIds([...t.talents.talents, ...t.actionCatalog.entries]);
  let n = 0;
  const check = (where: string, text: string | null | undefined) => {
    if (!text) return;
    checkPlayerText(where, text, ids, 'Word it for players at its source: the website, the data row, or foundry/wording.');
    n += 1;
  };
  for (const e of config.actionCatalog) {
    for (const x of [...e.text.does, ...e.text.requires, e.text.needs, e.text.help, e.text.gear]) check(`The Action "${e.name}"`, x);
  }
  for (const r of config.scars) [r.name, r.trigger, ...r.effectText].forEach((x) => check(`The Scar "${r.name}"`, x));
  for (const r of config.stressResponses) [r.name, r.text, ...r.effectText].forEach((x) => check(`The Stress Response "${r.name}"`, x));
  for (const r of config.fearRows) [r.name, r.text, ...r.effectText, ...r.forbidsText].forEach((x) => check(`The Fear Roll result "${r.name}"`, x));
  for (const r of config.fearTriggers) [r.name, r.event].forEach((x) => check('A Fear Roll trigger', x));
  for (const r of config.deathRoll.outcomes) check('A Death Roll outcome', r.text);
  for (const r of Object.values(config.injuryRows)) [r.name, ...r.whileHeld, ...r.permanent, ...r.riders].forEach((x) => check(`The ${r.location} Critical Injury ${r.range}`, x));
  for (const [id, x] of Object.entries(config.statusText)) check(`The status "${id}"`, x);
  const lp = config.lifepath;
  for (const o of lp.origins) [o.description, ...o.havens, o.canonTie?.link, o.condition].forEach((x) => check(`The Origin "${o.name}"`, x));
  for (const r of lp.enlistment) [r.reason, r.drive.trigger].forEach((x) => check(`The Drive "${r.drive.name}"`, x));
  for (const y of lp.years) [y.title, y.subtitle, ...y.events.flatMap((e) => [e.name, e.description])].forEach((x) => check(`The Training Year "${y.title}"`, x));
  for (const tr of lp.exam.trials) [tr.name, tr.description, ...tr.choices.map((c) => c.gear)].forEach((x) => check(`The Trial "${tr.name}"`, x));
  for (const sp of lp.specialties) check(`The Specialty "${sp.name}"`, sp.summary);
  for (const [where, x] of wordingTexts(config.lifepathPage)) check(where, x);
  return n;
}

export type WofConfig = ReturnType<typeof buildConfig>;
