/**
 * Turns the validated tables into compendium documents (ADR-0025). Pure: no file writes, so the
 * pack build is unit tested. Every sentence a pack shows comes from the website's player wording
 * where the site words it (tools/data/site-wording.ts), from data text the site itself shows as
 * written otherwise, and from foundry/wording/*.yaml for the few sentences neither words
 * (ADR-0020; core-plan 2f). `sweepPackText` runs the website's text guard over every shown string.
 */
import type { Tables } from './data/load.ts';
import type { FoundryWording } from './data/foundry-wording.ts';
import type { SiteTitan, SiteTitanBehavior, SiteWording } from './data/site-wording.ts';
import { docId } from './data/ids.ts';
import { checkPlayerText, escapeHtml, format, hyphenatedIds, visibleText } from './data/wording.ts';
import { gearSubtype } from './config-data.ts';
import { prototypeTokenDefaults, type ActorType } from '../src/token-defaults.ts';
import { actionIcon, foePlate, gearIcon, iconPath, originIcon, specialtyPortrait, titanPlate, titanTokenIcon } from '../src/art.ts';

export const SYSTEM_ID = 'wings-of-freedom';
export const CORE_VERSION = '14.365';

export type Lang = { WOF: Record<string, any>; TYPES: Record<string, any> };
export type PackName = 'talents' | 'specialties' | 'origins' | 'gear' | 'critical-injuries' | 'titans' | 'squadmates' | 'foes' | 'titan-field-notes';
export const PACKS: { name: PackName; type: 'Item' | 'Actor' | 'JournalEntry' }[] = [
  { name: 'talents', type: 'Item' },
  { name: 'specialties', type: 'Item' },
  { name: 'origins', type: 'Item' },
  { name: 'gear', type: 'Item' },
  { name: 'critical-injuries', type: 'Item' },
  { name: 'titans', type: 'Actor' },
  { name: 'squadmates', type: 'Actor' },
  { name: 'foes', type: 'Actor' },
  { name: 'titan-field-notes', type: 'JournalEntry' },
];

// Pack images (ADR-0027; src/art.ts).
const ICON = {
  talent: (type: string) => iconPath(type === 'dice' ? 'talent-dice' : 'talent-rule'),
  specialty: (id: string) => iconPath(`specialty-${id}`),
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
const esc = escapeHtml;

// ------------------------------------------------------------ the entry layout (static/styles/entry.css)
const ic = (src: string) => `<img class="wof-ic" src="${esc(src)}" alt="" width="20" height="20">`;
const p = (s: string, cls = '') => `<p${cls ? ` class="${cls}"` : ''}>${esc(s)}</p>`;
const h = (s: string) => `<h3>${esc(s)}</h3>`;
const ul = (items: string[], cls = '') => (items.length ? `<ul${cls ? ` class="${cls}"` : ''}>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '');
/** List items that are already HTML. */
const ulHtml = (items: string[], cls = '') => (items.length ? `<ul${cls ? ` class="${cls}"` : ''}>${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '');
/** Definition rows; values are HTML. */
const facts = (rows: [string, string][]) =>
  rows.length ? `<dl class="wof-facts">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>` : '';
const entry = (kind: string, body: string) => `<section class="wof-entry wof-entry-${kind}">${body}</section>`;

export interface BuildOptions {
  systemVersion: string;
}

export function buildPackDocs(t: Tables, lang: Lang, site: SiteWording, fw: FoundryWording, opts: BuildOptions): Record<PackName, Doc[]> {
  const L = lang.WOF;
  const E = L.Card.Entry;
  const ids = hyphenatedIds([...t.talents.talents, ...t.actionCatalog.entries]);
  const say = (where: string, text: string, fix: string) => checkPlayerText(where, text, ids, fix);
  const talentById = new Map(t.talents.talents.map((x) => [x.id, x]));
  const specialtyById = new Map(t.specialties.specialties.map((s) => [s.id, s]));
  const attrName = (a: string) => L.Attribute[a] as string;
  const attrChip = (a: string, prefix = '') => `<span class="wof-chip">${ic(iconPath(`attr-${a}`))}${esc(prefix + attrName(a))}</span>`;
  const talentChip = (id: string) => {
    const x = talentById.get(id)!;
    return `<span class="wof-chip">${ic(ICON.talent(x.type))}${esc(x.name)}</span>`;
  };
  /** The Actions a Talent or a gear item names: icon, name, what it rolls, and a condition. */
  const actionRows = (list: { id: string; condition?: string | null }[]) =>
    ulHtml(
      list.map(({ id, condition }) => {
        const a = site.actions[id];
        if (!a) throw new Error(`The website has no Action "${id}".`);
        return `${ic(actionIcon(id))}<b>${esc(a.name)}</b> <span class="wof-muted">${esc(a.rollLabel)}</span>${condition ? ` <span class="wof-cond">${esc(condition)}</span>` : ''}`;
      }),
      'wof-actions',
    );

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
  const talentDoc = (x: (typeof t.talents.talents)[number], level: number, sort: number) => {
    const fix = `Write player wording under "${x.id}" in site/src/content/compendium/talent-text.yaml.`;
    const w = site.talents[x.id];
    if (!w) throw new Error(`The website has no Talent "${x.id}". Fix data/character/talents.yaml or the website's loaders.`);
    // The website's condition for each named entry: its wording file, else the row's own text.
    const conditions = Object.fromEntries(
      w.actions.flatMap((a) => (a.condition ? [[a.slug, say(`The condition of "${x.name}" for ${a.name}`, a.condition, fix)]] : [])),
    ) as Record<string, string>;
    const trigger = w.trigger ?? '';
    const effect = w.effect;
    const limit = x.limit ?? 'none';
    const specialties = x.specialties.length ? x.specialties.map((s) => specialtyById.get(s)!.name) : [L.Card.Talent.general];
    const levels = x.type === 'dice' ? Array.from({ length: x.max_level }, (_, i) => format(i === 0 ? E.levelDie : E.levelDice, { n: i + 1 })) : [];
    const body = entry(
      'talent',
      p(w.description, 'wof-lede') +
        h(x.type === 'dice' ? E.diceTalent : E.ruleTalent) +
        (x.type === 'rule'
          ? facts([
              [L.Card.Talent.trigger, esc(trigger)],
              [L.Card.Talent.effect, esc(effect)],
            ])
          : p(effect)) +
        (levels.length > 1 ? h(E.levels) + ul(levels, 'wof-levels') : p(E.oneLevel, 'wof-muted')) +
        h(E.actions) +
        actionRows(x.names.map((n) => ({ id: n, condition: conditions[n] }))) +
        facts([
          ...(w.limit ? ([[L.Card.Talent.limit, esc(w.limit)]] as [string, string][]) : []),
          [L.Card.Talent.specialties, esc(andList.format(specialties))],
        ]),
    );
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
  const specialtyDoc = (s: (typeof t.specialties.specialties)[number], sort: number) => {
    const w = site.specialties[s.id];
    if (!w) throw new Error(`The website has no Specialty "${s.id}".`);
    const dice = s.talents.filter((x) => talentById.get(x)!.type === 'dice');
    const rules = s.talents.filter((x) => talentById.get(x)!.type === 'rule');
    const chips = (label: string, list: string[]) => (list.length ? `<p class="wof-sub">${esc(label)}</p><p class="wof-chips">${list.map(talentChip).join('')}</p>` : '');
    const body = entry(
      'specialty',
      p(w.summary, 'wof-lede') +
        facts([[L.Card.Specialty.key, attrChip(s.key_attribute)]]) +
        h(L.Card.Specialty.talents) +
        chips(E.diceTalents, dice) +
        chips(E.ruleTalents, rules) +
        (w.issue ? h(E.issue) + p(w.issue) : ''),
    );
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
    const w = site.origins[o.id];
    if (!w) throw new Error(`The website has no Origin "${o.id}".`);
    const condition = site.originConditions[o.id];
    const body = entry(
      'origin',
      `<p class="wof-roll"><span class="wof-d66">${esc(w.roll)}</span><span class="wof-muted">${esc(L.Card.Origin.roll)}</span>${condition ? `<span class="wof-cond">${esc(condition)}</span>` : ''}</p>` +
        `<blockquote class="wof-lede">${esc(w.description)}</blockquote>` +
        facts([
          [E.attributes, o.attributes.map((a) => attrChip(a, '+1 ')).join(' ')],
          [E.talentChoice, `<span class="wof-chips">${o.talent_choice.map(talentChip).join(`<span class="wof-or">${esc(E.or)}</span>`)}</span>`],
          [E.havenChoice, ulHtml(w.havens.map(esc))],
          ...(w.canonTie ? ([[E.canonTie, `<b>${esc(w.canonTie.character)}.</b> ${esc(w.canonTie.link)}`]] as [string, string][]) : []),
        ]),
    );
    return item('origins', o.id, o.name, 'origin', originIcon(o.id), {
      origin_id: o.id,
      results: o.results,
      description: body,
      attributes: o.attributes,
      talent_choice: o.talent_choice,
      haven_choice: w.havens,
      canon_tie: w.canonTie ?? { character: '', link: '' },
      condition: { campaign_year_min: o.condition?.campaign_year_min ?? null },
    }, i * 100);
  });

  // ------------------------------------------------------------ Gear
  const gearDoc = (g: (typeof t.gearItems.items)[number], sort: number, state: Partial<Doc> = {}) => {
    const subtype = gearSubtype(g.id)!;
    const w = site.gear[g.id];
    if (!w) throw new Error(`site/src/content/compendium/gear-text.yaml: the gear item "${g.id}" has no player wording.`);
    const dice = g.gear_dice_for ?? [];
    const body = entry(
      'gear',
      p(w.what, 'wof-lede') +
        facts([
          [E.rating, esc(w.rating)],
          [E.carriedAs, esc(w.carriedAs)],
          [L.Card.Gear.atZero, esc(w.atZero)],
          [L.Card.Gear.wear, esc(w.wear)],
          [L.Card.Gear.carried, esc(w.carried)],
        ]) +
        (dice.length ? h(L.Card.Gear.gearDice) + p(w.gearDice) + actionRows(dice.map((id) => ({ id }))) : '') +
        (w.notHad.length ? h(L.Card.Gear.notHad) + ul(w.notHad) : '') +
        (w.restore.length ? h(L.Card.Gear.restore) + ul(w.restore) : '') +
        (w.extra.length ? h(L.Card.Gear.notes) + ul(w.extra) : ''),
    );
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
  const typeIds = t.criticalInjuries.types.map((x) => x.id);
  for (const [location, table] of Object.entries(t.criticalInjuries.tables)) {
    const siteRows = site.injuries[location];
    if (!siteRows || siteRows.length !== table.rows.length) throw new Error(`The website words a different set of ${location} Critical Injury rows.`);
    // The website lists a table's riders in the order the table gives them.
    const siteRiders = site.riders[location] ?? [];
    const riderList = Object.entries(table.type_riders).flatMap(([type, list]) => (list ?? []).map((rider) => ({ injury_type: type, rider })));
    if (siteRiders.length !== riderList.length) throw new Error(`The website words a different set of ${location} type riders.`);
    table.rows.forEach((row, n) => {
      const w = siteRows[n];
      const names = row.names;
      const riders = riderList.filter(({ rider: r }) => r.all_rows || r.rows?.includes(row.id) || (r.lethal_rows && 'lethal' in row && row.lethal));
      const riderText = riderList.flatMap((r, k) => (riders.includes(r) ? [`${siteRiders[k].type}: ${siteRiders[k].text}`] : []));
      const { min, max } = row.results;
      const range =
        min === null ? format(L.Card.Injury.rangeUpTo, { max: max! }) : max === null ? format(L.Card.Injury.rangeFrom, { min }) : min === max ? String(min) : format(L.Card.Injury.range, { min, max });
      let body =
        `<p class="wof-roll"><span class="wof-d66">${esc(range)}</span><span class="wof-muted">${esc(format(E.injuryTable, { location: L.InjuryLocation[location] }))}</span></p>` +
        h(L.Card.Injury.names) +
        ulHtml(typeIds.map((type, k) => `${ic(iconPath(`injury-${type}`))}${esc(w.names[k])}`), 'wof-names');
      let system: Doc;
      if ('instant_death' in row) {
        body += p(L.Card.Injury.instantDeath, 'wof-grave');
        system = {
          row_data: { names, results: row.results, down: '', lethal: true, time_limit: null, death_roll_penalty: 0, instant_death: true, effects: [], permanent_effects: [], healing_days: 0, repeat_row: '' },
          time_limit: null,
          healing_days_left: 0,
        };
      } else {
        body += facts([
          [E.down, esc(w.down)],
          [E.lethal, esc(w.lethal)],
          [E.deathRollPenalty, esc(w.deathRollPenalty)],
          [E.whileHeld, esc(w.whileHeld)],
          [E.healing, esc(w.healing)],
          [E.permanent, esc(w.permanent)],
          [E.repeat, esc(w.repeat)],
        ]);
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
      if (riderText.length) body += h(E.riders) + ul(riderText);
      injuries.push(
        item('critical-injuries', row.id, format(L.Card.Injury.entryName, { location: L.InjuryLocation[location], range, name: names.crush }), 'critical-injury', ICON.injury, {
          row: row.id,
          location,
          ...system,
          type_riders: riders,
          description: entry('injury', body),
          side: null,
          injury_type: 'crush',
          treated: false,
          halved: false,
        }, sort),
      );
      sort += 100;
    });
  }

  // ------------------------------------------------------------ Titans (GM actors)
  if (site.titans.length !== t.titans.length) throw new Error('The website lists a different set of Titans.');
  const hiddenForAbnormal = { toughness: false, nape_depth: false, regeneration_clock: false, attention_ladder: false };
  const titans = t.titans.map((x, i) => {
    const w = site.titans[i];
    const shown = new Map([...w.behaviors, ...(w.fallback ? [w.fallback] : [])].map((b) => [b.name, b.text]));
    return actor('titans', x.id, x.name, 'titan', titanPlate(x.id, x.size_class), {
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
          text: shown.get(e.name) ?? say(`The text of "${x.name}: ${e.name}"`, e.text, `Fix the entry in data/titans/${x.id}.yaml.`),
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
    }, i * 100);
  });

  // ------------------------------------------------------------ Titan field notes (players: the squad's view only)
  const titanNotes = t.titans.map((x, i) => titanJournal(x.id, x.size_class, site.titans[i], L, fw, opts, i * 100));

  // ------------------------------------------------------------ Squadmates (with their template Talent, Specialty, and Standard Issue)
  const issueRow = (specialty: string) => t.standardIssue.by_specialty.rows.find((r) => r.specialty === specialty);
  const issue = t.standardIssue.by_funding.find((r) => r.funding === t.standardIssue.funding.until_funding_rules)!;
  const gearRow = (id: string) => t.gearItems.items.find((g) => g.id === id)!;
  const fullGas = t.odmGear.gas.full_gas_rating;
  const squadmateNotes = entry(
    'squadmate',
    h(E.squadmateRules) + ulHtml(site.squadmateRules.map((r) => `<b>${esc(r.rule)}:</b> ${esc(r.applies)}.${r.note ? ` ${esc(r.note)}` : ''}`)),
  );
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
      notes: squadmateNotes,
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

  // ------------------------------------------------------------ Foes (GM actors)
  const foes = t.foes.foes.map((x, i) => {
    const w = site.foes[x.id];
    if (!w) throw new Error(`The website's GM pages have no Foe "${x.id}".`);
    const weapon = typeof x.fight_weapon === 'string' ? { fixed: x.fight_weapon, roll: '', rows: [], at_night: { replaces: '', with: '' } } : { fixed: '', roll: x.fight_weapon.roll, rows: x.fight_weapon.rows, at_night: x.fight_weapon.at_night ?? { replaces: '', with: '' } };
    const notes = entry(
      'foe',
      p(w.running, 'wof-lede') +
        h(E.weapons) +
        ulHtml(w.weapons.map((wp) => `<b>${esc(wp.name)}</b> ${esc(wp.line)}${wp.note ? ` <span class="wof-muted">${esc(wp.note)}</span>` : ''}`)) +
        h(E.foeValues) +
        facts(w.stats.map((s) => [s.label, `<b>${esc(s.value)}</b> <span class="wof-muted">${esc(s.note)}</span>`])),
    );
    return actor('foes', x.id, x.name, 'foe', foePlate(x.id), {
      kind: x.id,
      who: w.who,
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
      notes,
    }, i * 100);
  });

  return { talents, specialties, origins, gear, 'critical-injuries': injuries, titans, squadmates, foes, 'titan-field-notes': titanNotes };
}

/** A Titan's specimen report as the Compendium shows it to the squad, with its plate. */
function titanJournal(id: string, sizeClass: string, w: SiteTitan, L: Record<string, any>, fw: FoundryWording, opts: BuildOptions, sort: number): Doc {
  const E = L.Card.Entry;
  const T = fw.titans;
  const _id = docId('titan-field-notes', id);
  const page = (key: string, doc: Doc): Doc => {
    const pid = docId('titan-field-notes', id, key);
    return { _id: pid, _key: `!journal.pages!${_id}.${pid}`, ownership: { default: -1 }, flags: {}, system: {}, _stats: stats(opts.systemVersion), ...doc };
  };
  const tierIcon = (slug: string) => (['terrorize', 'control', 'kill'].includes(slug) ? ic(iconPath(`tier-${slug}`)) : '');
  const partIcon = (name: string) => {
    const n = name.toLowerCase();
    const k = n.includes('eye') ? 'eyes' : n.includes('arm') ? 'arm' : n.includes('leg') ? 'leg' : n.includes('nape') ? 'nape' : null;
    return k ? ic(iconPath(`body-${k}`)) : '';
  };
  const fig = (label: string, value: number | null, note: string) =>
    `<div><dt>${esc(label)}</dt><dd class="wof-num">${value === null ? '?' : value}</dd><dd class="wof-muted">${esc(value === null ? T.unknown : note)}</dd></div>`;
  const known = w.bodyParts.every((b) => b.toughness !== null);
  const same = known && w.bodyParts.every((b) => b.toughness === w.bodyParts[0]?.toughness);
  const partsLabel = !known ? `${E.bodyParts} · ${T.toughnessByRead}` : same ? `${E.bodyParts} · ${format(E.toughnessEach, { n: w.bodyParts[0].toughness! })}` : E.bodyPartsToughness;
  const readList = andList.format(w.hidden.map((k) => T.readWords[k]));
  const size = format(E.specimen, { size: w.sizeClass.name, height: w.sizeClass.height });
  const row = (b: SiteTitanBehavior) =>
    `<tr><td class="wof-num">${esc(b.roll)}</td><th>${esc(b.name)}</th><td class="wof-nowrap">${tierIcon(b.tier.slug)}${esc(b.tier.name)}</td><td class="wof-num">${b.attackDice ?? esc(E.none)}</td><td>${esc(b.effect)} <i>${esc(b.text)}</i></td></tr>`;
  const html = entry(
    'titan',
    `<p class="wof-kicker">${ic(iconPath(w.abnormal ? 'titan-abnormal' : `titan-${w.sizeClass.slug}`))}${esc(size)}</p>` +
      `<p class="wof-plate"><img src="${esc(titanPlate(id, sizeClass))}" alt="${esc(w.name)}"></p>` +
      `<dl class="wof-figs">${fig(E.tempo, w.tempo, T.figures.tempo)}${fig(E.napeDepth, w.napeDepth, T.figures.napeDepth)}${fig(E.regeneration, w.regeneration, T.figures.regeneration)}</dl>` +
      (w.hidden.length ? p(format(T.readNote, { list: readList }), 'wof-note') : '') +
      h(partsLabel) +
      ulHtml(
        w.bodyParts.map((b) => `${partIcon(b.name)}${esc(b.name)}${!same && b.toughness !== null ? ` <span class="wof-muted">${esc(format(E.toughness, { n: b.toughness }))}</span>` : ''}`),
        'wof-inline',
      ) +
      h(E.attackDiceByTier) +
      ulHtml(w.tiers.map((tier) => `${tierIcon(tier.slug)}<b>${esc(tier.name)}</b> ${esc(orList.format(tier.dice.map(String)))}`), 'wof-inline') +
      h(E.behaviorTable) +
      p(E.behaviorRoll, 'wof-muted') +
      `<table class="wof-table"><thead><tr><th>${esc(E.d6)}</th><th>${esc(E.behavior)}</th><th>${esc(E.tier)}</th><th>${esc(E.attackDice)}</th><th>${esc(E.whatHappens)}</th></tr></thead><tbody>${w.behaviors.map(row).join('')}</tbody></table>` +
      (w.fallback
        ? `<p class="wof-note"><b>${esc(E.otherwise)}: ${esc(w.fallback.name)}.</b> ${esc(T.fallback)} ${esc(format(E.attackDiceN, { n: w.fallback.attackDice ?? 0 }))} ${esc(w.fallback.effect)} <i>${esc(w.fallback.text)}</i></p>`
        : ''),
  );
  return {
    _id,
    _key: `!journal!${_id}`,
    name: w.name,
    pages: [
      // The report leads, with the plate in it; the plate also has its own page, to show to players.
      page('report', { name: E.specimenReport, type: 'text', text: { content: html, format: 1 }, title: { show: false, level: 1 }, sort: 0, image: {}, video: {} }),
      page('plate', { name: E.plate, type: 'image', src: titanPlate(id, sizeClass), image: { caption: `${w.name}. ${size}` }, title: { show: false, level: 1 }, sort: 100, text: { format: 1 }, video: {} }),
    ],
    folder: null,
    categories: [],
    sort,
    ownership: { default: 0 },
    flags: { [SYSTEM_ID]: { sourceId: id } },
    _stats: stats(opts.systemVersion),
  };
}

/** A document's shown strings: its name, its rich text, and the plain text fields a sheet prints. */
export function shownStrings(doc: Doc, where: string): [string, string][] {
  const out: [string, string][] = [];
  const add = (label: string, v: unknown, html = false) => {
    if (typeof v === 'string' && v.trim()) out.push([`${where}, ${label}`, html ? visibleText(v) : v]);
  };
  add('name', doc.name);
  const s = doc.system ?? {};
  for (const k of ['description', 'summary', 'notes']) add(k, s[k], true);
  for (const k of ['who', 'trigger', 'effect']) add(k, s[k]);
  for (const [k, v] of Object.entries(s.condition ?? {})) add(`condition for ${k}`, v);
  for (const v of s.haven_choice ?? []) add('Haven', v);
  add('Canon Tie', s.canon_tie?.character);
  add('Canon Tie', s.canon_tie?.link);
  for (const e of s.behavior_table?.entries ?? []) {
    add('behavior name', e.name);
    add('behavior text', e.text);
  }
  for (const v of Object.values(s.row_data?.names ?? {})) add('injury name', v);
  for (const e of doc.items ?? []) out.push(...shownStrings(e, `${where} > "${e.name}"`));
  for (const pg of doc.pages ?? []) {
    add('page name', pg.name);
    add('page text', pg.text?.content, true);
    add('caption', pg.image?.caption);
  }
  return out;
}

/** Runs the website's text guard over every string the packs show; returns how many it checked. */
export function sweepPackText(docs: Record<string, Doc[]>, t: Tables): number {
  const ids = hyphenatedIds([...t.talents.talents, ...t.actionCatalog.entries]);
  let n = 0;
  for (const [pack, list] of Object.entries(docs)) {
    for (const d of list) {
      for (const [where, text] of shownStrings(d, `The ${pack} entry "${d.name}"`)) {
        checkPlayerText(where, text, ids, 'Word it for players at its source: the website, the data row, or foundry/wording.');
        n += 1;
      }
    }
  }
  return n;
}

/** Lang strings the guard would misread: a current/rating fraction reads as a file path. */
const LANG_EXEMPT = new Set(['WOF.Sheet.gas.odm']);

/** Runs the website's text guard over every string in lang/en.json; returns how many it checked. */
export function sweepLangText(lang: Lang): number {
  let n = 0;
  const walk = (node: unknown, key: string) => {
    if (typeof node === 'string') {
      if (LANG_EXEMPT.has(key)) return;
      checkPlayerText(`The lang string ${key}`, node.replace(/\{\w+\}/g, 'N'), new Set(), 'Reword it in static/lang/en.json.');
      n += 1;
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) walk(v, key ? `${key}.${k}` : k);
    }
  };
  walk(lang, '');
  return n;
}
