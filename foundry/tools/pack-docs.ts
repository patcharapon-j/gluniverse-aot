/**
 * Turns the validated tables into compendium documents (ADR-0025). Pure: no file writes, so the
 * pack build is unit tested. Descriptions come from the site's player wording where it exists and
 * from data text that is already written for players otherwise (ADR-0020); every string shown
 * passes the site's text guard. Milestone 2f refines the wording (core-plan section 1).
 */
import type { Tables } from './data/load.ts';
import { docId } from './data/ids.ts';
import { checkPlayerText, escapeHtml, format, hyphenatedIds } from './data/wording.ts';
import { gearSubtype } from './config-data.ts';
import { prototypeTokenDefaults, type ActorType } from '../src/token-defaults.ts';
import { foePlate, gearIcon, iconPath, specialtyPortrait, titanPlate, titanTokenIcon } from '../src/art.ts';

export const SYSTEM_ID = 'wings-of-freedom';
export const CORE_VERSION = '14.365';

export type Lang = { WOF: Record<string, any>; TYPES: Record<string, any> };
export type PackName = 'talents' | 'specialties' | 'origins' | 'gear' | 'critical-injuries' | 'titans' | 'squadmates' | 'foes';
export const PACKS: { name: PackName; type: 'Item' | 'Actor' }[] = [
  { name: 'talents', type: 'Item' },
  { name: 'specialties', type: 'Item' },
  { name: 'origins', type: 'Item' },
  { name: 'gear', type: 'Item' },
  { name: 'critical-injuries', type: 'Item' },
  { name: 'titans', type: 'Actor' },
  { name: 'squadmates', type: 'Actor' },
  { name: 'foes', type: 'Actor' },
];

// Pack images (ADR-0027; src/art.ts). Talents take the dice or rule stamp, Origins the Corps emblem
// (2f may give them their own), Critical Injury rows the injury stamp.
const ICON = {
  talent: (type: string) => iconPath(type === 'dice' ? 'talent-dice' : 'talent-rule'),
  specialty: (id: string) => iconPath(`specialty-${id}`),
  origin: iconPath('brand-emblem'),
  injury: iconPath('harm-critical-injury'),
};

type Doc = Record<string, any>;

function stats(systemVersion: string) {
  return {
    coreVersion: CORE_VERSION,
    systemId: SYSTEM_ID,
    systemVersion,
    createdTime: null,
    modifiedTime: null,
    lastModifiedBy: null,
    compendiumSource: null,
    duplicateSource: null,
    exportSource: null,
  };
}

const orList = new Intl.ListFormat('en', { type: 'disjunction' });
const andList = new Intl.ListFormat('en', { type: 'conjunction' });
const p = (s: string) => `<p>${escapeHtml(s)}</p>`;
const dl = (rows: [string, string][]) =>
  rows.length ? `<dl>${rows.map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl>` : '';
const ul = (items: string[]) => (items.length ? `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : '');
const h = (s: string) => `<h3>${escapeHtml(s)}</h3>`;

export interface BuildOptions {
  systemVersion: string;
}

export function buildPackDocs(t: Tables, lang: Lang, opts: BuildOptions): Record<PackName, Doc[]> {
  const L = lang.WOF;
  const ids = hyphenatedIds([...t.talents.talents, ...t.actionCatalog.entries]);
  const say = (where: string, text: string, fix: string) => checkPlayerText(where, text, ids, fix);
  const actionName = new Map(t.actionCatalog.entries.map((e) => [e.id, e.name]));
  const talentById = new Map(t.talents.talents.map((x) => [x.id, x]));
  const specialtyById = new Map(t.specialties.specialties.map((s) => [s.id, s]));
  const attrName = (a: string) => L.Attribute[a] as string;

  const item = (pack: PackName, key: string, name: string, type: string, img: string, system: Doc, sort: number): Doc => {
    const _id = docId(pack, key);
    return {
      _id,
      _key: `!items!${_id}`,
      name,
      type,
      img,
      system,
      effects: [],
      folder: null,
      sort,
      ownership: { default: 0 },
      flags: { [SYSTEM_ID]: { sourceId: key } },
      _stats: stats(opts.systemVersion),
    };
  };
  const embed = (actorId: string, doc: Doc, key: string): Doc => {
    const _id = docId('embedded', actorId, key);
    return { ...doc, _id, _key: `!actors.items!${actorId}.${_id}`, folder: undefined };
  };
  const actor = (pack: PackName, key: string, name: string, type: ActorType, img: string, system: Doc, sort: number, items: (id: string) => Doc[] = () => []): Doc => {
    const _id = docId(pack, key);
    return {
      _id,
      _key: `!actors!${_id}`,
      name,
      type,
      img,
      system,
      items: items(_id).map((d) => {
        const { folder: _f, ...rest } = d;
        return rest;
      }),
      effects: [],
      folder: null,
      sort,
      ownership: { default: 0 },
      flags: { [SYSTEM_ID]: { sourceId: key } },
      prototypeToken: { name, ...prototypeTokenDefaults(type, { sizeClass: system.size_class }), texture: { src: type === 'titan' ? titanTokenIcon(system.size_class, system.abnormal) : img } },
      _stats: stats(opts.systemVersion),
    };
  };

  // ------------------------------------------------------------ Talents
  const talentWording = t.talentWording.talents;
  const talentDoc = (x: (typeof t.talents.talents)[number], level: number, sort: number) => {
    const fix = `Write player wording under "${x.id}" in site/src/content/compendium/talent-text.yaml.`;
    const conditions = Object.fromEntries(
      x.names.flatMap((n) => {
        const text = talentWording[x.id]?.condition?.[n] ?? x.condition?.[n];
        return text ? [[n, say(`The condition of "${x.name}" for ${n}`, text, fix)]] : [];
      }),
    );
    const named = x.names.map((n) => ({ name: actionName.get(n)!, condition: (conditions[n] as string | undefined) ?? null }));
    let body = p(say(`The description of "${x.name}"`, x.description, fix));
    let trigger = '';
    let effect = '';
    if (x.type === 'dice') {
      const shared = named.every((n) => n.condition === named[0].condition);
      const target = shared
        ? format(named[0].condition ? L.Card.Talent.rollsWhen : L.Card.Talent.rolls, { entries: orList.format(named.map((n) => n.name)), condition: named[0].condition ?? '' })
        : orList.format(named.map((n) => format(n.condition ? L.Card.Talent.rollsWhen : L.Card.Talent.rolls, { entries: n.name, condition: n.condition ?? '' })));
      effect = format(x.max_level > 1 ? L.Card.Talent.levelPerDie : L.Card.Talent.oneDie, { target });
      body += p(effect);
    } else {
      trigger = say(`The trigger of "${x.name}"`, talentWording[x.id]!.trigger!, fix);
      effect = say(`The effect of "${x.name}"`, talentWording[x.id]!.effect!, fix);
      body += dl([
        [L.Card.Talent.trigger, trigger],
        [L.Card.Talent.effect, effect],
      ]);
    }
    const limit = x.limit ?? 'none';
    const specialties = x.specialties.length ? x.specialties.map((s) => specialtyById.get(s)!.name) : [L.Card.Talent.general];
    body += dl([
      ...(limit !== 'none' ? ([[L.Card.Talent.limit, L.TalentLimit[limit]]] as [string, string][]) : []),
      [L.Card.Talent.entries, andList.format(named.map((n) => n.name))],
      [L.Card.Talent.specialties, andList.format(specialties)],
    ]);
    return item('talents', x.id, x.name, 'talent', ICON.talent(x.type), {
      talent_id: x.id,
      description: body,
      type: x.type,
      max_level: x.max_level,
      names: x.names,
      condition: conditions,
      trigger,
      effect,
      limit,
      specialties: x.specialties,
      level,
      used: false,
    }, sort);
  };
  const talents = t.talents.talents.map((x, i) => talentDoc(x, 1, i * 100));

  // ------------------------------------------------------------ Specialties
  const issueRow = (specialty: string) => t.standardIssue.by_specialty.rows.find((r) => r.specialty === specialty);
  const gearName = new Map(t.gearItems.items.map((g) => [g.id, g.name]));
  const specialtyDoc = (s: (typeof t.specialties.specialties)[number], sort: number) => {
    const fix = 'Fix the Specialty row in data/character/specialties.yaml.';
    const issue = issueRow(s.id);
    const body =
      p(say(`The summary of "${s.name}"`, s.summary, fix)) +
      dl([
        [L.Card.Specialty.key, attrName(s.key_attribute)],
        [L.Card.Specialty.talents, andList.format(s.talents.map((x) => talentById.get(x)!.name))],
      ]) +
      (issue ? p(format(L.Card.Specialty.issue, { item: gearName.get(issue.item)!.toLowerCase(), rating: issue.rating })) : '');
    return item('specialties', s.id, s.name, 'specialty', ICON.specialty(s.id), {
      specialty_id: s.id,
      key_attribute: s.key_attribute,
      summary: body,
      talents: s.talents,
      squadmate_template: s.squadmate_template,
    }, sort);
  };
  const specialties = t.specialties.specialties.map((s, i) => specialtyDoc(s, i * 100));

  // ------------------------------------------------------------ Origins
  const origins = t.origins.rows.map((o, i) => {
    const fix = 'Fix the Origin row in data/character/origins.yaml.';
    const rows: [string, string][] = [
      [L.Card.Origin.roll, o.results.join(', ')],
      [L.Card.Origin.attributes, andList.format(o.attributes.map(attrName))],
      [L.Card.Origin.talents, orList.format(o.talent_choice.map((x) => talentById.get(x)!.name))],
      [L.Card.Origin.havens, orList.format(o.haven_choice.map((x) => say(`A Haven of "${o.name}"`, x, fix)))],
    ];
    if (o.canon_tie) rows.push([L.Card.Origin.canonTie, `${o.canon_tie.character}: ${say(`The Canon Tie of "${o.name}"`, o.canon_tie.link, fix)}`]);
    const body =
      p(say(`The description of "${o.name}"`, o.description, fix)) +
      dl(rows) +
      (o.condition ? p(format(L.Card.Origin.condition, { year: o.condition.campaign_year_min })) : '');
    return item('origins', o.id, o.name, 'origin', ICON.origin, {
      origin_id: o.id,
      results: o.results,
      description: body,
      attributes: o.attributes,
      talent_choice: o.talent_choice,
      haven_choice: o.haven_choice,
      canon_tie: o.canon_tie ?? { character: '', link: '' },
      condition: { campaign_year_min: o.condition?.campaign_year_min ?? null },
    }, i * 100);
  });

  // ------------------------------------------------------------ Gear
  const gearWording = t.gearWording.items;
  const gearDoc = (g: (typeof t.gearItems.items)[number], sort: number, state: Partial<Doc> = {}) => {
    const subtype = gearSubtype(g.id)!;
    const w = gearWording[g.id];
    if (!w) throw new Error(`site/src/content/compendium/gear-text.yaml: the gear item "${g.id}" has no player wording.`);
    const fix = `Write player wording under "${g.id}" in site/src/content/compendium/gear-text.yaml.`;
    const s = (label: string, text: string) => say(`The ${label} of "${g.name}"`, text, fix);
    const dice = (g.gear_dice_for ?? []).map((e) => actionName.get(e)!);
    const body =
      p(s('description', w.what)) +
      dl([
        ...(dice.length ? ([[L.Card.Gear.gearDice, andList.format(dice)]] as [string, string][]) : []),
        [L.Card.Gear.atZero, s('state at 0', w.at_zero)],
        [L.Card.Gear.wear, s('wear', w.wear)],
        [L.Card.Gear.carried, s('carrying note', w.carried)],
      ]) +
      (w.not_had.length ? h(L.Card.Gear.notHad) + ul(w.not_had.map((x) => s('not-had note', x))) : '') +
      (w.restore.length ? h(L.Card.Gear.restore) + ul(w.restore.map((x) => s('restore note', x))) : '') +
      ((w.extra ?? []).length ? h(L.Card.Gear.notes) + ul((w.extra ?? []).map((x) => s('note', x))) : '');
    return item('gear', g.id, g.name, 'gear', gearIcon(g.id), {
      item_id: g.id,
      subtype,
      rated: g.rated,
      gear_dice_for: g.gear_dice_for ?? [],
      items_counted: g.items_counted,
      passable: g.passable,
      description: body,
      rating: g.rated ? 1 : 0,
      current: g.rated ? 1 : 0,
      kept: false,
      in_handles: false,
      loaded: false,
      mounted: false,
      position: { position: null, titan: '', left: false },
      side: null,
      ...state,
    }, sort);
  };
  const gearRows = t.gearItems.items.filter((g) => gearSubtype(g.id) !== null);
  const gear = gearRows.map((g, i) => gearDoc(g, i * 100));

  // ------------------------------------------------------------ Critical Injuries
  const injuries: Doc[] = [];
  let sort = 0;
  for (const [location, table] of Object.entries(t.criticalInjuries.tables)) {
    for (const row of table.rows) {
      const where = `the Critical Injury row "${row.id}"`;
      const fix = 'Fix the row in data/harm/critical-injuries.yaml.';
      const names = row.names;
      const effectText = (e: { type: string; dice?: number; entries?: string[]; amount?: number }) =>
        e.type === 'penalty'
          ? format(L.Card.Injury.penalty, { dice: e.dice!, entries: andList.format(e.entries!.map((x) => actionName.get(x) ?? x)) })
          : format(L.Card.Injury.stressGain, { amount: e.amount! });
      const riders = Object.entries(table.type_riders).flatMap(([type, list]) =>
        (list ?? [])
          .filter((r) => r.all_rows || r.rows?.includes(row.id) || (r.lethal_rows && 'lethal' in row && row.lethal))
          .map((rider) => ({ injury_type: type, rider })),
      );
      let body = h(L.Card.Injury.names) + dl(Object.entries(names).map(([type, n]) => [L.InjuryType[type], say(where, n, fix)]));
      let system: Doc;
      if ('instant_death' in row) {
        body += p(L.Card.Injury.instantDeath);
        system = {
          row_data: { names, results: row.results, down: '', lethal: true, time_limit: null, death_roll_penalty: 0, instant_death: true, effects: [], permanent_effects: [], healing_days: 0, repeat_row: '' },
          time_limit: null,
          healing_days_left: 0,
        };
      } else {
        const facts: string[] = [];
        if (row.down === 'until_treated') facts.push(L.Card.Injury.down);
        if (row.lethal && row.time_limit) facts.push(format(L.Card.Injury.lethal, { limit: L.TimeLimit[row.time_limit] }));
        facts.push(format(L.Card.Injury.healing, { days: row.healing_days }));
        body += ul(facts);
        if (row.effects.length) body += h(L.Card.Injury.effects) + ul(row.effects.map(effectText));
        if (row.permanent_effects?.length) body += h(L.Card.Injury.permanent) + ul(row.permanent_effects.map(effectText));
        system = {
          row_data: {
            names,
            results: row.results,
            down: row.down || '',
            lethal: row.lethal,
            time_limit: row.time_limit,
            death_roll_penalty: row.death_roll_penalty,
            instant_death: false,
            effects: row.effects,
            permanent_effects: row.permanent_effects ?? [],
            healing_days: row.healing_days,
            repeat_row: row.repeat_row ?? '',
          },
          time_limit: row.time_limit,
          healing_days_left: row.healing_days,
        };
      }
      const { min, max } = row.results;
      const range =
        min === null ? format(L.Card.Injury.rangeUpTo, { max: max! }) : max === null ? format(L.Card.Injury.rangeFrom, { min }) : min === max ? String(min) : format(L.Card.Injury.range, { min, max });
      injuries.push(
        item('critical-injuries', row.id, format(L.Card.Injury.entryName, { location: L.InjuryLocation[location], range, name: names.crush }), 'critical-injury', ICON.injury, {
          row: row.id,
          location,
          ...system,
          type_riders: riders,
          description: body,
          side: null,
          injury_type: 'crush',
          treated: false,
          halved: false,
        }, sort),
      );
      sort += 100;
    }
  }

  // ------------------------------------------------------------ Titans
  // The website's colour plate for each playable Titan (site/src/assets/plates, downscaled).
  const hiddenForAbnormal = { toughness: false, nape_depth: false, regeneration_clock: false, attention_ladder: false };
  const titans = t.titans.map((x, i) =>
    actor('titans', x.id, x.name, 'titan', titanPlate(x.id, x.size_class), {
      size_class: x.size_class,
      abnormal: x.abnormal,
      tempo: x.tempo,
      nape_depth: x.nape_depth,
      regeneration_clock: x.regeneration_clock,
      heave: x.heave,
      body_parts: x.body_parts.map((b) => ({ ...b, state: 'intact', progress: 0 })),
      attention_ladder: x.attention_ladder,
      behavior_table: {
        entries: x.behavior_table.entries.map((e) => ({
          ...e,
          attack_dice: e.attack_dice ?? null,
          text: say(`The text of "${x.name}: ${e.name}"`, e.text, `Fix the entry in data/titans/${x.id}.yaml.`),
        })),
      },
      regeneration: 0,
      openings: 0,
      heave_count: 0,
      next_behavior: { entry: '', revealed: false },
      previous_behavior: '',
      attention_holder: '',
      focus_titan_label: '',
      hidden_until_read: hiddenForAbnormal,
      corpse: false,
      notes: '',
    }, i * 100),
  );

  // ------------------------------------------------------------ Squadmates (with their template Talent, Specialty, and Standard Issue)
  const issue = t.standardIssue.by_funding.find((r) => r.funding === t.standardIssue.funding.until_funding_rules)!;
  const gearRow = (id: string) => t.gearItems.items.find((g) => g.id === id)!;
  const fullGas = t.odmGear.gas.full_gas_rating;
  const squadmates = t.squadmates.templates.map((m, i) => {
    const specialty = specialtyById.get(m.specialty)!;
    const talent = talentById.get(m.talent.id)!;
    const bladeRating = t.standardIssue.every_row.blade_set_rating;
    const kit = issueRow(m.specialty);
    return actor('squadmates', m.id, specialty.name, 'squadmate', specialtyPortrait(m.specialty)!, {
      attributes: m.attributes,
      health_lost: 0,
      down: false,
      stress: 0,
      grief: 0,
      scars: [],
      gas_rating: fullGas,
      spare_canisters: Array.from({ length: issue.spare_canisters }, () => fullGas),
      template: m.id,
      wing: '',
      notes: '',
    }, i * 100, (actorId) => [
      embed(actorId, talentDoc(talent, m.talent.level, 0), `talent:${talent.id}`),
      embed(actorId, specialtyDoc(specialty, 100), `specialty:${specialty.id}`),
      embed(actorId, gearDoc(gearRow('odm-gear'), 200, { rating: issue.odm_gear_rating, current: issue.odm_gear_rating }), 'odm'),
      ...Array.from({ length: issue.blade_sets }, (_, n) =>
        embed(actorId, gearDoc(gearRow('blade-set'), 300 + n, { rating: bladeRating, current: bladeRating, in_handles: n === 0 }), `blade-set:${n}`),
      ),
      embed(actorId, gearDoc(gearRow('horse'), 400, { rating: issue.horse_rating, current: issue.horse_rating }), 'horse'),
      ...(kit ? [embed(actorId, gearDoc(gearRow(kit.item), 500, { rating: kit.rating, current: kit.rating }), `kit:${kit.item}`)] : []),
    ]);
  });

  // ------------------------------------------------------------ Foes
  const foes = t.foes.foes.map((x, i) => {
    const fix = 'Fix the Foe row in data/skirmish/foes.yaml.';
    const weapon = typeof x.fight_weapon === 'string' ? { fixed: x.fight_weapon, roll: '', rows: [], at_night: { replaces: '', with: '' } } : { fixed: '', roll: x.fight_weapon.roll, rows: x.fight_weapon.rows, at_night: x.fight_weapon.at_night ?? { replaces: '', with: '' } };
    return actor('foes', x.id, x.name, 'foe', foePlate(x.id), {
      kind: x.id,
      who: say(`The description of "${x.name}"`, x.who, fix),
      attack_dice: x.attack_dice,
      guard_dice: x.guard_dice,
      health: x.health,
      grit: x.grit,
      parley: x.parley,
      watch: x.watch,
      group_size: x.group_size.fixed,
      fight_weapon: weapon,
      shoot_weapon: x.shoot_weapon ?? '',
      health_lost: 0,
      held: false,
      out: false,
      weapon: weapon.fixed,
      firearm_loaded: true,
      notes: '',
    }, i * 100);
  });

  return { talents, specialties, origins, gear, 'critical-injuries': injuries, titans, squadmates, foes };
}
