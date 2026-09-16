# Milestone 2 (Core): plan

The Foundry VTT v14 system `wings-of-freedom` (ADR-0025), built from the shared tables in `data/` (ADR-0012), with the Personnel File look (ADR-0027, `foundry/design/preview-v2-1-personnel-file.html`, `foundry/design/preview-spec-v2.md`) and roll consequences that apply themselves with Undo (ADR-0026). Milestone 2 ends with a Soldier who can be built by drag and drop, rolled for, pushed, hurt, and undone, and with Titan, Squadmate, and Foe sheets a GM can run by hand. The Lifepath wizard is milestone 3, the Engagement tracker milestone 4.

Every step ends with `pnpm build`, `pnpm test`, and a browser check in real Foundry 14.365 (section 6). Nothing is committed by an agent; the owner commits.

## 1. Steps

| Step | Delivers | Done when |
| --- | --- | --- |
| **2a** Scaffold, models, packs | Package, Vite library build, `system.json`, `lang/en.json`, TypeDataModels for every Actor and Item type, `CONFIG.WOF` (Action Catalog and rule constants from `data/` at build time), derived data with unit tests, the data loader with schemas, LevelDB packs, self-hosted fonts, dev symlink | Build and tests pass; the system shows on the setup screen with no package warnings; a `wof-dev` world opens with no console errors and every pack lists its entries |
| **2b** Soldier sheet | Svelte 5 sheet mounted inside an `ActorSheetV2` subclass (its `_renderHTML`/`_replaceHTML` mount Svelte once and pass the document as reactive props; `_onClose` unmounts), with small action wrappers for Foundry drag and drop, context menus, and tooltips; header, vitals rail (portrait, Health boxes, Stress track with minimum, Resolve, Down, ODM, Gas, Blade gauges as static icons until 2e), tabs Soldier, Kit, Wounds & Mind, Record; drag and drop of Talents, Specialty, Origin, Gear, Critical Injuries; shared motion-token file driving anime.js; code-drawn silhouette showing Critical Injuries by location and side | Every recorded field in section 3 can be read and edited on the sheet; closing the sheet unmounts Svelte and leaves no listeners (checked with a heap snapshot count) |
| **2c** Other sheets | Titan sheet (GM): stat block, Body Part figure with Intact, Wounded, Broken states and Toughness progress, segmented Regeneration clock, Openings, Heave, Attention holder, sealed Next Behavior, Behavior Table; compact Squadmate and Foe sheets; one item sheet per Item type (Talent, Specialty, Origin, Gear with subtype panels, Critical Injury with type picker) | Each pack entry opens in its sheet with no console errors; Body Part and clock clicks persist |
| **2d** Rolls | Roll dialog opened from an Action Catalog entry (attribute and Talent filled in; Bonus Dice capped at 4, Circumstances ladder from `data/core/circumstances.yaml`, one Gear item, Stakes on a called roll); four DiceTerm denominations (`db`, `dg`, `ds`, `dt`); chat card with one-line header and the die kinds apart; Push (re-rolls non-6 base and Stress Dice, +1 Stress, blocked with the reason when a Stress Die shows 1) and Cover; Stress Response rolled on a Stress 1; auto-apply of Stress gain, gear wear on a pushed 1, Gas Rating loss, each recorded on the card with Undo for the owner and the GM; GM world settings to switch auto-apply off per category; Titan attack card (Titan Dice on 5 and 6, never pushed) | Rules-math tests for pool building, Push eligibility, wear, and Net Successes pass; a pushed Dodge in Foundry updates the same card and Undo restores every changed value |
| **2e** Dice and widgets | Dice So Nice presets and colorsets for the four die kinds from `foundry/art-src` outputs (asset-inventory table); the one shared three.js renderer for the gas canister and blade set widgets, rendering on value change plus a short settle; client settings Motion (Full, Reduced, Off; Off shows static icons, `prefers-reduced-motion` maps to Reduced) and Gore (Low, Standard, Graphic) | With Dice So Nice on, each kind rolls in its colorset; with it off, the card still reads; opening and closing five sheets leaves one WebGL context |
| **2f** Compendium wording | Descriptions rebuilt from the site's player wording (`site/src/content/compendium/*.yaml`) and ports of the site's in-code wording (Critical Injury effects from `site/src/lib/harm-tables.ts`, Foe notes from `site/src/lib/gm-foe-tables.ts`, Titan behavior effects from `site/src/lib/shared-data.ts`); the site's text guard (`player-text.ts` patterns) applied to every pack string; icons from `site/src/assets/icons` and the generated Foundry art | No pack string fails the guard; every entry has an icon |
| **2g** Review | One Opus review against the ADR-0025 checklist (rules fidelity against `data/`, v14 API correctness, WebGL budget, no leaks on close, reduced-motion path), about 300 words, blocking and major findings only; fixes | Review findings closed |

2a lands first because every later step reads its models and packs. 2b and 2c can overlap once 2a is in. 2d needs 2b's sheet to open the dialog from. 2e and 2f are independent of each other.

## 2. File layout

```
foundry/
  package.json           pnpm; Vite 8, TypeScript 6, Svelte 5, three 0.186, animejs 4.5 (pinned)
  tsconfig.json
  vite.config.ts         library build of src/index.ts to dist/wings-of-freedom.mjs; publicDir static/;
                         virtual module "virtual:wof-config" built from data/ at build time; vitest config
  static/                copied as-is into dist/
    system.json
    lang/en.json         every string
    styles/fonts.css     @font-face, self-hosted
    assets/fonts/        Playfair Display, Special Elite, Noto Serif (woff2 + OFL.txt)
    assets/icons/        (2f) stamp icons, reused site icons
    templates/           (2b) Handlebars shells, if a part needs one
  src/
    index.ts             init hook: CONFIG, data models, fonts, settings, sheets
    config.ts            CONFIG.WOF from the virtual module
    wof-config.ts        the virtual module, typed by tools/config-data.ts
    fonts.ts             CONFIG.fontDefinitions entries (latin faces), canvas font
    foundry.d.ts         thin ambient types for the v14 globals the system touches
    rules/               pure rules math, no Foundry globals (unit tested)
      derived.ts         Health, Resolve, minimum Stress, Health boxes, current Health, carrying, Overloaded
      pool.ts, roll.ts   (2b, 2d) pool building, Push, successes, tables, wear, gas, attack results, ops
    models/
      fields.ts          shared field builders (attributes, harm and mind fields, gear state)
      actors.ts          soldier, squadmate (shared base), titan, foe
      items.ts           talent, specialty, origin, gear, critical-injury
    documents/           (2b) WofActor, WofItem, WofChatMessage
    sheets/              (2b, 2c) ApplicationV2 shells and Svelte components
    dice/                (2d) terms.ts (DiceTerms, WofRoll), actor-pool.ts, roll-action.ts, roll-dialog.ts,
                         card.ts (card state and HTML), chat.ts (render hook), card-actions.ts (Push, Cover,
                         Undo), tables.ts (Fear, Stress Response, Gas), reactions.ts (Titan attacks), call.ts,
                         apply.ts (ops), proxy.ts (GM queries), post.ts
    motion/              (2b) motion tokens, anime.js wrappers; (2e) three.js widget renderer
    settings.ts          (2d, 2e) world and client settings
  tools/
    data/schemas.ts      zod schema per data file the system reads
    data/load.ts         reads and validates data/, returns typed tables
    data/wording.ts      the site text guard, HTML escaping, placeholder formatting
    data/ids.ts          deterministic 16-character document ids
    foundryvtt-cli.d.ts  types for compilePack
    config-data.ts       builds the CONFIG.WOF payload (used by the Vite plugin)
    pack-docs.ts         builds pack documents (pure; unit tested)
    build-packs.ts       writes JSON sources to build/packs-src/ and compiles LevelDB to dist/packs/
    check-data.ts        validation only, for CI and quick checks
    link.ts              symlinks dist/ into the local Foundry data folder
  test/                  vitest: rules math, schemas against the live data, pack build
  docs/core-plan.md      this file
  dist/                  build output (git-ignored), symlinked into Foundry
  build/                 intermediate pack sources (git-ignored)
```

`foundry/design/` and `foundry/art-src/` stay design inputs; the build never reads them.

## 3. Data models

System data uses the exact field names of `data/character/lifepath.yaml` (`record_on_sheet`), `data/character/squadmates.yaml` (`stat_block`), `data/harm/sheet-fields.yaml`, and `data/gear/sheet-fields.yaml`, so a field on a sheet can be traced to its rule by name. Lists that hold documents with their own rules text (Talents, Critical Injuries, gear) are embedded Items; the field of the same name is then the embedded collection, noted "Item" below.

### 3.1 Actor `soldier`

| Field | Type | Source |
| --- | --- | --- |
| name | document name | record_on_sheet |
| origin | Item `origin` (one) | record_on_sheet; `data/character/origins.yaml` |
| haven | string | record_on_sheet (one of the Origin row's `haven_choice`) |
| canon_tie | string, optional | record_on_sheet |
| drive | string | record_on_sheet; `data/character/enlistment.yaml` |
| drive_named_comrade | string | record_on_sheet |
| drive_used_this_session | boolean | record_on_sheet |
| attributes.{strength, agility, wits, perception, instinct, empathy} | integer 2 to 6 | record_on_sheet; `data/character/attributes.yaml` (scale) |
| specialty | Item `specialty` (one) | record_on_sheet; `data/character/specialties.yaml` |
| talents | Items `talent` with `level` and `used` | record_on_sheet ("each once-per-Titan-Engagement use is recorded beside its Talent") |
| merit | integer or null | record_on_sheet; null for a built or promoted soldier (record_on_sheet_built) |
| class_rank | integer or null | record_on_sheet; `data/character/class-rank.yaml` |
| declined_military_police | boolean | record_on_sheet |
| rank | `private`, `squad-leader`, `section-commander` | record_on_sheet; CONTEXT Rank |
| xp | integer | CONTEXT XP (Record tab) |
| health | derived | record_on_sheet (the rating); formula in attributes.yaml |
| health_lost | integer 0+ | record_on_sheet |
| down | boolean | record_on_sheet; invariant in harm sheet-fields |
| resolve | derived | record_on_sheet; formula in attributes.yaml |
| stress | integer 0+ | record_on_sheet |
| minimum_stress | derived | record_on_sheet; attributes.yaml (number of Scars) |
| scars | array of `{row}` | harm sheet-fields; `data/mind/scars.yaml` |
| grief | integer 0 to 3 | record_on_sheet; `data/mind/grief.yaml` |
| critical_injuries | Items `critical-injury` | harm sheet-fields (`row, side, injury_type, treated, time_limit, healing_days_left, halved`) |
| healed_permanent_injuries | array of `{row, side}` | harm sheet-fields |
| lasting_stress_responses | array of `{row, ends}` | harm sheet-fields |
| rallied_outside_titan_engagement_by | array of actor ids | harm sheet-fields |
| next_roll_penalty | integer 0+ | harm sheet-fields |
| pending_fear_results | array of `{effect, toward, titan}` | harm sheet-fields |
| dropped_blade_sets | integer 0+ | harm sheet-fields |
| pinned | `{active, body, corpse, limb, side, by_part}` | harm sheet-fields |
| prosthetics | Items `gear` (subtype prosthetic) with `side` | harm sheet-fields; gear items.yaml |
| faced_a_titan, killed_a_person, retiring | boolean | harm sheet-fields |
| stabilized_injuries_scarred | array of Critical Injury item ids | harm sheet-fields |
| gear | Items `gear` | record_on_sheet ("Chapter 4"); gear sheet-fields below |
| odm_gear | Item `gear` subtype odm (`rating`, `current`) | gear sheet-fields |
| gas_rating | integer 0 to full Gas Rating | gear sheet-fields; `odm-gear.yaml` gas.full_gas_rating |
| spare_canisters | array of integers 1+ | gear sheet-fields (a canister is not an Item: it has no rating) |
| blade_set_in_handles, blade_sets_carried | derived from Items `gear` subtype blade-set with `in_handles` | gear sheet-fields |
| horse | Item `gear` subtype horse (`rating, current, mounted, position`) | gear sheet-fields |
| medical_kits, tool_kits | Items `gear` subtype kit (`kind`, `rating`, `current`) | gear sheet-fields |
| firearms | Items `gear` subtype firearm (`kind, rating, current, loaded`) | gear sheet-fields |
| kept_items | `kept` on each gear Item | gear sheet-fields |
| left_at | `{position, titan, items}` | gear sheet-fields |
| positions | array of `{titan, position}`, or `left` | gear sheet-fields |
| airborne | boolean | gear sheet-fields |
| carrying, carried_by | actor id or empty | gear sheet-fields |
| notes | HTML (`htmlFields`) | sheet Record tab |

### 3.2 Actor `squadmate`

`data/character/squadmates.yaml` stat_block: name, specialty (Item), attributes, talent (one Item `talent` at level 1), health (derived), health_lost, resolve (derived), stress, minimum_stress (derived), scars, grief, critical_injuries (Items), down, gear (as the Soldier), `wing` (actor id or empty), and every field of `data/harm/sheet-fields.yaml`. It records none of `not_recorded` (origin, haven, drive, canon_tie, merit, class_rank, xp). Plus `template` (the template id) and `notes`.

### 3.3 Actor `titan`

`data/engagement/titan-format.yaml` stat_block, stored as written: size_class, abnormal, tempo, nape_depth, regeneration_clock, heave, body_parts (`id, kind, toughness` plus play state `state` intact, wounded, or broken, and `progress` toward the next state), attention_ladder, behavior_table.entries (`id, name, results, tier, targets, position_requirement, body_parts_used, attack_dice, effects, fallback, text`). Play state for milestone 2 (the tracker in milestone 4 drives it): `regeneration` (filled segments), `openings`, `heave_count`, `next_behavior` (`entry`, `revealed`), `previous_behavior`, `attention_holder`, `focus_titan_label`, `hidden_until_read` (facts revealed, per `data/engagement/read.yaml`), `corpse`, `notes`. Derived: `grounded` (a leg Broken), `broken_parts`.

### 3.4 Actor `foe`

`data/skirmish/foes.yaml` row: kind (row id), who, attack_dice, guard_dice, health, grit, parley, watch, group_size, fight_weapon (`fixed`, or `rows` with `results` and `weapon`, and `at_night`), shoot_weapon. Play state: health_lost, held, out (dead or out cold), weapon (the Fight weapon rolled at the start), firearm_loaded (starts loaded), notes. Derived: current health.

### 3.5 Items

| Type | Fields |
| --- | --- |
| `talent` | talent_id, description (HTML), type (`dice`, `rule`), max_level, names, condition (entry id to text), trigger, effect, limit, specialties; state `level`, `used` |
| `specialty` | specialty_id, key_attribute, summary, talents, squadmate_template |
| `origin` | origin_id, results, description, attributes, talent_choice, haven_choice, canon_tie, condition |
| `gear` | item_id (`data/gear/items.yaml` id), subtype (`odm`, `blade-set`, `firearm`, `horse`, `kit`, `prosthetic`), rated, gear_dice_for, items_counted, passable, description (HTML); state rating, current, kept, in_handles (blade-set), loaded (firearm), mounted and position (horse), side (prosthetic) |
| `critical-injury` | row, location, row_data (`names, results, down, lethal, time_limit, death_roll_penalty, instant_death, effects, permanent_effects, healing_days, repeat_row`), type_riders (the table's riders); held state `side, injury_type, treated, time_limit, healing_days_left, halved` (harm sheet-fields). The shown name follows `injury_type` |

`htmlFields`: every `description` and `notes` field, declared per type in `system.json`.

## 4. Derived values

All in `src/rules/derived.ts` as pure functions, called from `prepareDerivedData`.

| Value | Rule | Source |
| --- | --- | --- |
| health | ceil((strength + agility) / 2) | attributes.yaml derived_values.health |
| resolve | max(0, ceil((instinct + empathy) / 2) + Scars - min(Grief, 3)) (owner: never below 0; docs/rules-questions.md 1) | derived_values.resolve |
| minimum_stress | number of Scars | derived_values.minimum-stress |
| boxes_crossed_off | min(untreated Critical Injuries, health) | harm sheet-fields derived.current_health |
| current_health | max(0, health - boxes_crossed_off - health_lost) | same |
| health_boxes | per box: crossed (X), damaged (slash), or clean, crossed first | same, `paper` |
| down_by_rule | current_health is 0, or an untreated Critical Injury's row has down until_treated | harm sheet-fields invariants.down (the stored `down` is checked against it) |
| carrying_limit | strength + 4 | carrying.yaml limit.formula |
| items_carried | spare canisters x1, gear Items by items_counted (blade set in handles 0), plus a carried comrade's 5 (0 with Strong Back) and that comrade's own items_carried | carrying.yaml items_counted; gear sheet-fields derived |
| overloaded | items_carried > carrying_limit | gear sheet-fields derived |
| jammed | odm current is 0 | gear sheet-fields derived |
| lame | horse current is 0 | gear sheet-fields derived |
| blade_set_in_handles, blade_sets_carried | ratings from blade-set Items | gear sheet-fields |

The build checks each formula string in the YAML against the one the code implements (a zod literal), so a rules change to a formula fails the build instead of drifting.

## 5. Build pipeline

1. `tools/data/load.ts` reads each file the system uses and parses it with its zod schema. Row objects are strict: a new, renamed, or retyped field fails the build with the file and path. Cross-references are checked (Talent names are Catalog entries, Specialty talents exist, Origin talent choices exist, squadmate template Talents exist, every Titan entry's fallback is in its table).
2. `vite build` compiles `src/` and resolves `virtual:wof-config` through `tools/config-data.ts`, so the Action Catalog and the rule constants are baked into the bundle, not fetched at run time. `static/` is copied to `dist/`.
3. `tools/build-packs.ts` turns the tables into documents (`tools/pack-docs.ts`), writes them to `build/packs-src/<pack>/`, and compiles each to `dist/packs/<pack>` with `compilePack` from `@foundryvtt/foundryvtt-cli`. Ids are deterministic (a hash of pack and row id), so a rebuild updates entries in place.
4. Packs: `talents`, `specialties`, `origins`, `gear`, `critical-injuries` (Item); `titans`, `squadmates`, `foes` (Actor). Squadmates embed their template Talent.
5. Descriptions: the site's player-wording files where they exist (`talent-text.yaml` for Rule Talents; `gear-text.yaml` for gear), the site's dice-Talent sentence for Dice Talents, otherwise the data text that is already player wording (Talent and Origin descriptions, Specialty summaries, Titan entry text, Foe `who`). 2f finishes the job.
6. `pnpm link` symlinks `dist/` to `~/Foundry User Data/Data/systems/wings-of-freedom`. Foundry must be restarted, or the world relaunched, to reread `system.json` and packs. Packs are locked by a running world: build packs with the world closed.

## 6. Tests

- **Node (vitest):** rules math (`test/derived.test.ts`, checked against the squadmate templates' precalculated Health and Resolve and the preview's sample soldier); every schema against the live `data/` (`test/data.test.ts`), plus mutation tests that a changed shape fails; pack documents (`test/packs.test.ts`: counts per pack match the tables, ids unique and 16 characters, every document's `system` has only model fields, embedded keys correct); from 2d, dice math (pool build, Bonus Dice cap, Circumstances penalty floor, Push eligibility, wear, Net Successes) and apply and undo as pure state transitions.
- **Browser check at the end of each step:** headless Chrome on its own profile and debug port 9455 against `http://localhost:30000`. When that server has a world running, the check runs against an isolated server started from the same 14.365 install on another port, with its own data path under the agent's scratchpad (the system symlinked in, the license copied in for the run and deleted after), so the owner's server and worlds are never touched. 2a: the setup screen lists the system with no warnings; a world named `wof-dev` (the only world an agent may create) launches with no console errors; `game.packs` holds the eight packs with the expected counts; `new Actor.implementation({type:"soldier"})` derives Health and Resolve. Later steps add screenshots of each sheet and card, the motion-off path, and a WebGL context count.

## 7. Types

The v14 client is typed with a thin `src/foundry.d.ts` (globals as loosely typed namespaces) rather than the `fvtt-types` beta, which tracks a pre-release build and is heavy to compile. Signatures are checked against the installed 14.365 source under `/Applications/Foundry Virtual Tabletop.app/Contents/Resources/app/client`.

## 8. Open questions

1. **Resolve floor.** Decided by the owner (2b): the system clamps Resolve at 0 (`resolve` in `src/rules/derived.ts`; `resolve_unclamped` keeps the formula's value for the sheet). The rules set no floor, so the question is logged in `docs/rules-questions.md` for the rules session.
2. **Gas canister.** Decided (2b): the fitted canister and the spares stay actor fields (`gas_rating`, `spare_canisters`), per `data/gear/sheet-fields.yaml`; the gear pack has no canister entry.
3. **Critical Injury pack.** Decided (2b, provisional, owner may change): one entry per table row (31); the Injury Type and, at an arm or leg, the side are chosen in a dialog when the row is dropped on a soldier, and the type riders (time limit, healing multiplier) are applied then.
4. **Squadmate pack.** The nine templates are shipped as ready Squadmate actors with their Talent. The playtest configuration seats no Squadmates; the pack stays for later campaigns.
5. **Gear dice for kits and firearms in packs.** Pack gear entries carry rating 1 and current 1; Standard Issue's ratings by Funding are applied by the wizard (milestone 3), not the pack.
6. **Titan hidden values.** Decided by the owner (2c): hidden Titan values are hidden at sheet level only. A player's client may hold the full actor data; there is no GM-only socket store.
7. **Titan tokens.** Decided by the owner (2c): Titan tokens have no bar and take their size from the Size Class.
8. **Roll cards live in message flags.** Decided (2d): each card is `flags.wings-of-freedom.card` on a plain ChatMessage (no ChatMessage subtype), redrawn from the flags by `renderChatMessageHTML` for each viewer; the message content keeps a one-line text summary for exports. A Push updates the same message and appends only the re-rolled dice to its rolls.
9. **GM proxy.** Decided (2d): changes a user cannot make (a Cover or a Reaction written on another user's card, Stress to a Covering comrade the pusher does not own, Undo by an actor's owner on a GM-posted card) go to the active GM through Foundry's User queries (`CONFIG.queries["wings-of-freedom.proxy"]`), not a system socket. The GM's client accepts card flag, content, and rolls changes from a user who owns an actor on the card (or any soldier, for Cover and Dodge), and actor or item changes only for an actor a recent card names.
10. **Undo moves by delta.** Decided (2d): a number a card changed (Stress, Gas Rating, a gear item's current rating, a next-roll penalty) is undone by subtracting the card's change from the value now, clamped, so a later card's change survives; a Stress value stored below minimum Stress counts as the minimum. A category the GM switched off lists its changes as "Not applied" with an Apply button.

## 9. Status

**2d done (2026-09-16).** Four DiceTerm classes in `src/dice/terms.ts` (`db` base, `dg` Gear, `ds` Stress, `dt` Titan: d6s whose total is their successes, 6, or 5 and 6 for Titan Dice; the ids are the Dice So Nice preset types) and a `WofRoll` that rolls a pool by kind. Pure roll math in `src/rules/roll.ts` (Circumstances on the pool, Push re-roll and block order, Wound Tight's Push Stress, Stress Response and Fear rows with already-held lasting rows skipped, wear and ruin with the wear-ignoring Talents, Gas Roll dice with Light Trigger, Death Roll outcomes, ADR-0019 net successes and rider, the applied-change ops with Undo, Redo, and Apply); `src/rules/pool.ts` takes the dialog's attribute, Talent, gear, and met-condition choices. `rollAction(actor, entryId)` (`src/dice/roll-action.ts`) checks what the soldier can roll (`src/dice/actor-pool.ts`: Down allows only the Death Roll and the Gas Roll; a Nape strike needs ODM Gear that is not Jammed or dry unless a Titan on the scene is grounded; the reason shows on the disabled quick-roll row), opens the compact roll dialog (`RollDialog.svelte` in the sheet shell: attribute with Hunter's Eye and Loose the Horse, one dice Talent including conditional ones, one gear item the entry allows, Bonus Dice, the Circumstances ladder, conditional Scar penalties, the Death Roll's injury, needs, and for the GM the called-roll stakes and the passive Spot or Size Up), rolls, rolls a Stress Response on a Stress Die 1 (Iron Nerve), clears a used next-roll penalty, and posts the card. Fear, Stress Response, and Gas Rolls are table cards (`src/dice/tables.ts`: Steady Heart, the Drive shrug-off, a Gas Roll button on Clenched Trigger; Light Trigger and the round's Pushed ODM mark). The GM's called roll (`src/dice/call.ts`, "Call a roll" on the Soldier sheet) posts a call card the player answers with the entry, Circumstances, and stakes fixed; a failed roll staked on Stress costs 1 Stress once, re-worked after a Push. Cards (`src/dice/card.ts`, `chat.ts`, `static/styles/chat.css`) follow the locked design: one-line header with the pool glyphs, dice as inline SVG icons by kind with successes ringed, a Stress 1 cracked, a pushed Gear 1 locked, the Push's new Stress Die marked; the big count against the needs; Stakes and Circumstances only when set; the Stress Response line; "Applied" with Undo or Redo and "Not applied" with Apply; small Push and Cover with the block reason. Push (`card-actions.ts`) re-rolls only the non-6 base and Stress Dice as a new roll shown with Dice So Nice when present, adds the Stress Die unless Covered, applies wear once (Blade Discipline, Well-Kept Rig, Sure Seat, Gunsmith; a Blade Set is ruined and deleted, Undo restores it with its id), and updates the same message; Sure Hands and Stay with the Column allow a second Push; a Squadmate never Pushes or Covers. Titan attack cards (`reactions.ts`, "Roll attack" on the Behavior Table and the Next Behavior rail) roll the entry's Attack Dice at the GM's targets; Dodge rolls the target's dodge against the Severity, and every dodge (and its Push) writes its successes on the attack card, which shows lands or misses per target and the Critical Injury rider. World settings switch auto-apply off per category (Stress, gear wear, Stress Responses, Gas Rating, Fear results and penalties). `pnpm test`: 89 tests (22 new in `test/roll-rules.test.ts`). Browser check on the isolated 14.365 server (port 30055) with a GM and a player in separate browser contexts: the player rolled and Pushed a Nape strike (Blade Discipline used), Undo and Redo, a Dodge with a Stress Die 1 (Push blocked with the reason, Scattered Thoughts held); the GM rolled a called Fly at Hard staked on Stress, the player Covered it with another soldier through the GM proxy, the GM's Push put the Stress on the Covering soldier and removed the stakes' Stress on success; a Titan attack at a targeted soldier, the player's Dodge and Push recorded on the attack card (lands, then misses); every auto-apply category switched off (Push Stress, ODM wear, the Gas mark, a lasting response, Gas loss, Cold Sweat) and applied by hand; a Fear Roll shrugged off by the Drive; the GM's call answered by the player; a Death Roll; the GM's Push on the player's soldier undone by the player; a passive Spot hidden from the player; a Jammed Nape strike row disabled; no console errors. Screenshots in the agent's scratchpad (`d2/`). Deferred: Dice So Nice presets (2e); Squadmate quick rolls on its compact sheet (`game.wof.rollAction` works for Squadmates); Help as a named source (Bonus Dice cover it); requirements the tracker will know (Positions, Attention, Grabbed, lost-limb forbidden entries, one Reaction per Titan per round); outcomes that need a target (Nape strike Openings and Relentless, Body Part strike Toughness, Wrist Cut, Shoulder Charge, Unshaken Command); a landed attack's effects (Critical Injury, Grab, knock loose) and Foe attack and Guard cards (milestone 4); Gallows Humour's second D6 is built but was not exercised in the browser.

**2c done (2026-09-16).** Every sheet now shares one shell, `src/sheets/svelte-sheet.ts` (`SvelteSheetMixin`: mount once, swap the view, unmount on close; it also stops Foundry disabling every control of a read-only sheet, so an Observer can still switch tabs), and `sheets/register.ts` registers them. **Titan** (`TitanSheet.svelte`, `titan-view.ts`, `titan-ops.ts`, rules in `src/rules/titan.ts`): plate, stat block, the inked Titan (`titanFigure` in `figure.ts`, ported from the preview) with Eyes, Arms, Legs intact, wounded (cut, steam), or broken (arm hangs, leg severed, eyes out) under the Gore setting; clicking the figure or a part card cycles the state and resets its count; count pips and "+1 success" apply `body_part_strikes` (Toughness, then Openings once Broken); Openings as brass tokens; the round segmented Regeneration clock fills by click and applies the five `when_full` steps (Openings erased, counts cleared, most damaged part healed with list-order ties, steam note, a healed Broken leg stands the Titan and clears the heave count); Heave rating with the heave count; Attention Ladder (standard or the Abnormal's) with the holder; sealed Next Behavior with GM peek, hidden roll (`nextBehaviorFor`: move-up past the previous behavior and Broken-part entries, else Thrash; nothing posted), reveal to players, next and previous pickers; Behavior Table tab (GM only) with tier, Titan Dice, effects, and entries its Broken parts rule out; Record tab with corpse, an Abnormal's "revealed by a Read" flags, and notes. An Observer's view is built without hidden values: no Behavior Table, no unrevealed Next Behavior, and an Abnormal's Toughness, Nape Depth, clock length, and ladder only once revealed; below Observer the record is sealed. **Squadmate** (`SquadmateSheet.svelte`): compact header with Specialty and Wing, the Soldier vitals strip in a compact layout, attributes as pips, the one template Talent (a dropped Talent replaces it, an Origin is refused), Resolve, Scars, Grief, Critical Injuries with treat toggles, notes; the Soldier's Wounds & Mind and Kit tabs are reused. **Foe** (`FoeSheet.svelte`): Attack Dice, Guard, Grit, Watch, Parley, Health boxes, out and Held, group size, Fight weapon (fixed, or the D6 rows with a roll and the night swap), Shoot weapon with loaded state, notes; weapon names and damage from `data/skirmish/skirmish.yaml`. **Item slips** (`ItemSheet.svelte`, `item-view.ts`): Talent, Specialty, Origin, Gear (item picker takes the row's fixed fields; rating, current with the row's at-zero state; blade-set, firearm, horse, kit, prosthetic panels), Critical Injury (type picker that re-applies the type riders and renames a held injury; side, time limit, treated, halved, healing days; row facts and riders); every description in Foundry's editor. **Tokens** (`src/token-defaults.ts`, used by the packs and a `preCreateActor` hook): soldiers and Squadmates linked, friendly, Health bar (`system.health_bar`, display only); Foes unlinked, hostile, Health bar for the GM; Titans unlinked, hostile, no bar, 2 to 4 squares by Size Class; a new Titan takes its Size Class row. Titans in the pack use the site's plates (`static/assets/plates`); new icons: body-eyes, body-nape, tier-*, titan-*, die-titan-attack, gear-flares. New data read: `attention.yaml` (tests, standard ladder), `titan-harm.yaml` (Body Part kinds, states, the `when_full` steps checked by the schema), `skirmish.yaml` (weapons); model fields added: Titan `heave_count`, `previous_behavior`. `pnpm test`: 67 tests (13 new for the Titan rules). Browser check on the isolated 14.365 server (port 30055): the four Titans, the slayer Squadmate, and two Foes imported and every control exercised as GM; a player user saw only public values (Observer), a sealed record (Limited), and no editable control; every item slip opened; reduced motion and Motion Off paths; five open and close cycles of six sheets left nothing mounted and a stable DOM node count; no console errors. Deferred: the Behavior Table entries have no editor (a new Titan starts with an empty table); Openings are a count without their creators (milestone 4); Titan Attention flags are not tracked; hidden values stay in the actor data an Observer's client receives, so the sheet hides them but a player with console access could read them.

**2b done (2026-09-16).** `src/sheets/soldier-sheet.ts` registers `SoldierSheet` (an `ActorSheetV2`, class name pinned so the stored sheet id survives minification). `_replaceHTML` mounts `components/SoldierSheet.svelte` once with a `SheetState` (`view` as `$state.raw`, the tab, the next roll's Bonus Dice); later renders only swap `view`, which `soldier-view.ts` rebuilds from the actor in `_prepareContext`; `_onClose` unmounts. Svelte actions in `sheets/actions.ts` wrap Foundry drag data (`dragItem`), `ContextMenu` (`contextMenu`), and `game.tooltip` (`tooltip`); drops go through `_onDropItem` (Origin and Specialty replace, a held Talent levels up, a Critical Injury row opens the type and side dialog, one ODM Gear and one horse, a Blade Set fills empty handles). Header, vitals strip (Health boxes, Stress boxes with minimum, Resolve, Down, Gas and Blade Sets with static icons in marked `data-widget` slots for 2e), and the four tabs edit every recorded field of section 3.1; Talent level dots, attribute pips (key attribute to 6), Gear Dice boxes and ratings, canisters, Positions, Scars, Grief, lasting Stress Responses, pending Fear results, pinned, notes (Foundry's `prose-mirror`). Quick rolls list every rolled Action Catalog entry with its preview pool as dots (`src/rules/pool.ts`: best had gear item, one dice Talent, penalties off Bonus then Talent then attribute with a floor of 1, conditional Talents and Scar penalties listed apart, roll exceptions from `data/core/dice-pool.yaml`) and call the stub `rollAction(actor, entryId)` in `src/dice/roll-action.ts` for 2d. Wounds & Mind draws the inked silhouette (`sheets/figure.ts`, ported from the preview) with injuries by location and side, dressed when treated, and the per-user Gore client setting (Low, Standard, Graphic). Motion: `src/motion/tokens.ts` and `fx.ts` (anime.js v4), gated by the Motion client setting (Full, Reduced, Off) and `prefers-reduced-motion`; the Motion setting shows in Configure Settings, its fuller UI is 2e. `data/mind/scars.yaml` and `stress-responses.yaml` are now read (schemas, cross-checks, `CONFIG.WOF.scars`, `stressResponses`); icons are downscaled 128 px webp in `static/assets/icons` (site icons plus the approved style-lock v2 action and status icons); strings in `lang/en.json`; styles in `static/styles/sheet.css` with the 10 px floor. `pnpm test`: 51 tests. Browser check on the isolated 14.365 server (port 30055): a Soldier built by dropping pack entries, every tab and control exercised with no console errors, six open and close cycles leave no mounted sheet, no growth in live `SheetState` objects after GC, and a stable DOM node count.

**2a done (2026-09-16).** `pnpm build` validates `data/` (25 files and the four Titans), bundles `dist/wings-of-freedom.mjs`, and compiles eight LevelDB packs (83 Talents, 9 Specialties, 12 Origins, 9 gear items, 31 Critical Injury rows, 4 Titans, 9 Squadmates with Talent, Specialty, and Funding 3 Standard Issue, 3 Foes). `pnpm test`: 37 tests (rules math, live data, nine shape-change failures, pack documents). `pnpm typecheck` clean. `dist/` is symlinked into `~/Foundry User Data/Data/systems/wings-of-freedom`. Browser check on an isolated 14.365 server: the setup screen lists the system as verified with no package warnings; `wof-dev` launches with no console errors; every pack document is valid; derived Health, Resolve, current Health, and carrying match the unit tests; the three fonts load and appear in the editor font list. The server logs "Failed to parse URL from undefined" on its update check because `system.json` has no `manifest` yet; it goes away with release zips.

