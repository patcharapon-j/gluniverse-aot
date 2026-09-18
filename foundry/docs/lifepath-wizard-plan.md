# Milestone 3: the Lifepath wizard, plan

A step-by-step wizard on an empty Soldier that follows `data/character/lifepath.yaml` exactly (ADR-0025): the player rolls wherever the rules roll (every roll posted to chat through the system's `WofRoll`, so Dice So Nice shows it) and chooses wherever the rules give a choice. Progress is saved on the actor and can be resumed; there is no GM approval step. Drag and drop from the compendia keeps working beside it.

Scope: all three procedures of `lifepath.yaml` (`procedures`): the Lifepath, and the Template Build and the Free Build when the campaign allows them (`campaign_choice`, a GM world setting). "Build by rolling" is the Lifepath; "build by choosing" is a built procedure.

## 1. Where things live

| Piece | File |
| --- | --- |
| Tables the wizard reads, baked into `CONFIG.WOF.lifepath` at build time, with the website's player wording | `tools/config-data.ts` (`lifepathConfig`), schemas in `tools/data/schemas.ts` |
| Step text, extracted from the website's "Making Your Soldier" page (`site/src/content/rules/making-your-soldier.mdx`) | `tools/data/lifepath-wording.ts` |
| Pure rules: table lookups, the attribute cap and overflow, Talent caps and fallbacks, performance and Exam pools, Merit and Class Rank, swap, floor, Top 10, built shapes and Talent limits, Standard Issue, the replay that validates a state, the commit payload | `src/rules/lifepath.ts` (unit tested, no Foundry globals) |
| Wizard state type, its empty shape, and the edit operations (set a choice, record a roll, go back) | `src/rules/lifepath-state.ts` |
| Foundry side: open and resume, rolls and their chat cards, commit, the GM's Campaign Year query | `src/lifepath/wizard.ts`, `src/lifepath/rolls.ts`, `src/lifepath/commit.ts` |
| The window: a `DocumentSheetV2` on the actor (so an actor update re-renders it) whose content is one Svelte tree, mounted with the existing shell (`SvelteSheetMixin`) | `src/lifepath/wizard-app.ts`, `src/lifepath/components/*.svelte`, `static/styles/lifepath.css` |
| The chat card | `src/dice/card.ts` (`LifepathCard`, kind `lifepath`) |
| Strings | `static/lang/en.json` (`WOF.Lifepath.*`) |

## 2. Settings

- **Procedures allowed** (`campaignChoice`, world, GM only, set in the preferences menu): one of the four `campaign_choice.options`; default "lifepath only". It never changes once a soldier has used it (the menu warns; the rules make it a session-zero choice).
- **Campaign Year** (`campaignYear`, world, stored when first recorded). If the world has none, the wizard's first step asks for it (845 to 850, the range read from the campaign-year step text) and records it for the world: directly for a GM, through a GM query (`wings-of-freedom.campaign`, which only sets an unset year to a valid value) for a player. With no GM connected the year stays on this soldier's state, and the next wizard opened while a GM is connected records it.
- **Exam vote**: per soldier, on the first step, as the table voted. It is a shared choice of the players creating soldiers together; the wizard records what the table decided and does not try to count votes across clients.
- **Exam board** (`examBoard`, world, three D66 results, 0 where a Stage is unrolled). Every Cadet takes the same Trial under the same condition, so the first Cadet to roll a Stage records it for the world, through the same GM query as the Campaign Year. A GM can set or clear it.

## 3. Steps in rules order

### Lifepath (`steps`)

| # | Step (`id`) | Inputs | Table read | Staged result | Depends on |
| --- | --- | --- | --- | --- | --- |
| 0 | Campaign (`campaign-year`) | Procedure (choice among allowed); Campaign Year (choice, 845 to 850, fixed if the world has one); Exam vote (choice) | `lifepath.yaml` campaign_choice; `graduation-exam.yaml` use | `procedure`, `campaign.year`, `campaign.exam` | world settings |
| 1 | Origin (`origin`) | Roll D66 (rolled again, each roll posted, while the row's `campaign_year_min` is above the Campaign Year); choose one of 2 Talents; choose one of 2 Havens; choose whether to record the Canon Tie | `origins.yaml` | attributes all 2, then +1 to each of the row's two (no overflow can arise: 3 at most); Talent level 1; Haven; Canon Tie | Campaign Year |
| 2 | Why You Enlisted (`why-you-enlisted`) | Roll D66; choose a Drive (the rolled row's by default, any row allowed); overflow target if the point would pass 5 (cannot happen here, handled anyway) | `enlistment.yaml` | +1 to the rolled row's attribute (never the chosen Drive's row); Drive | attributes after step 1 |
| 3 to 5 | Training Year 1, 2, 3 (`training-year-n`) | Roll D66 for the event; choose a Talent (one of the event's three, or any Talent on that year's curriculum, which `talent_cap` keeps open beside them); overflow target if the point would pass 5; performance attribute if the two are equal; roll the performance roll (attribute dice only, no Push) | `training-years.yaml` | +1 attribute (or overflow), +1 Talent level, `merit_change`, performance Merit | attributes and Talent levels after the previous step; Year 3's performance roll is skipped when the Exam was voted |
| 5b | Graduation Exam (inside Year 3, `graduation-exam.yaml`) | Alone or with other Cadets (choice); per Stage: roll the board (D66, the tens die naming the Stage's Trial and the units die its condition, recorded for the world so every Cadet takes the same one); roll a D6 for the order (not alone); the entry where the Trial gives a choice; the dice Talent (the best held one naming the entry; conditional dice Talents never apply, see rules question 8); Hunter's Eye's attribute on a Read; Help received (not alone, one Bonus Die); Stress gained Covering others before the Cadet's own roll in the squad field exercise; roll; Push where the Stage or its condition allows one (Covered or not, a second Push with Sure Hands on Treat Injury) | `graduation-exam.yaml` | Trial Merit, minus 1 per Trial whose roll caused a Stress Response; Exam Stress, which carries from one Trial to the next and returns to 0 at the end | attributes and Talents after Year 3's event |
| 6 | Graduation (`graduation`) | Choose a Specialty; if several other attributes share the highest rating, choose the one to swap; if the floor applies, choose the attributes to lower; choose the Specialty Talent (list only, cap 2 and the Talent's max level) | `class-rank.yaml`, `specialties.yaml`, `attributes.yaml` creation.graduation | Class Rank from the Merit total; swap, floor, Top 10 (+1 key, up to 6, "Declined the Military Police"); +1 Talent level | Merit total, attributes and Talents after Year 3 |
| 7 | Finish (`finish`) | Decline any spare canister, Blade Set, or the Specialty item; name the soldier | `standard-issue.yaml` (Funding 3 until the Funding rules), `attributes.yaml` derived_values | Health, Resolve, Stress 0, minimum Stress 0, Rank Private, harm cleared, Standard Issue | Specialty, attributes |
| 8 | Join the Squad (`join-the-squad`) | Named comrade (only if the Drive needs one; any other soldier or Squadmate in the world; may be left for the table) | `enlistment.yaml` drive_rules.named_comrade; `squadmates.yaml` starting_squad (shown as a note) | `drive_named_comrade` | Drive; runs after the commit |

### Template Build and Free Build (`built_steps`)

| # | Step | Inputs | Staged result |
| --- | --- | --- | --- |
| 0 | Campaign | Procedure, Campaign Year (no Exam: a built soldier takes none) | as above |
| 1 | Specialty | Choose one of nine | Specialty |
| 2 | Attributes | Template: none (the Specialty template's ratings, `squadmates.yaml`). Free: choose a shape, place its six ratings with a 4 on the key attribute | attributes (18 points, 2 to 4, key exactly 4, at most two 4s) |
| 3 | Origin | Choose a row the Campaign Year allows; one of 2 Havens; Canon Tie or not; one of 2 Talents | Origin, Haven, Canon Tie, Talent level 1; no attribute point |
| 4 | Drive | Choose any row's Drive | Drive; no attribute point |
| 5 | Training Years | Optionally name one event of each year | story lines written to the notes; nothing else |
| 6 | Talents | One Talent on the Specialty's list, then three levels in any Talents, one at a time | Talent levels within `built_steps.talent_levels`: none above 2, at most one at 2, rule Talents at most their max level; a held Talent rises by 1 |
| 7 | Merit | none (shown) | Merit none, Class Rank none, not Top 10 |
| 8, 9 | Finish, Join the Squad | as the Lifepath | as the Lifepath |

## 4. Staging and Back

**Decision: stage everything in a state flag and commit once, at Finish.** The state lives in `flags.wings-of-freedom.lifepath` on the actor: the procedure, each step's rolls (faces and the row they read) and each choice, and the current step. It holds inputs only, never derived values. A pure `replay(state, tables)` runs the steps in order from the inputs and returns everything derived (attributes and Talent levels after each step, Merit, Class Rank, the options each choice offers, which choices are missing or no longer valid, and each step's status). The wizard shows replay's result; the actor's own fields and Items are untouched until Finish, when one `actor.update` and one `createEmbeddedDocuments` write the finished soldier and the state is marked finished.

Why this and not a commit per step:
- **Back cannot corrupt the actor.** A per-step commit would need every step to undo exactly what it wrote (Items created, levels raised, points moved by overflow) before a changed choice is replayed; a missed inverse leaves a wrong soldier. With staging, going Back only edits inputs, and replay recomputes from scratch.
- **Resume is exact.** The flag is the whole truth; closing the window, reloading, or another user opening the actor shows the same step.
- **Drag and drop keeps its meaning.** The sheet stays an ordinary Soldier until Finish; a player who drops an Origin mid-way sees it on the sheet, and Finish replaces the Origin, Specialty, and Talents it records (the confirm dialog lists what it will replace) and gives Standard Issue through the rules' receiving steps, which already account for gear the soldier holds.
- The cost is that the sheet does not show the soldier growing; the wizard's own file summary does, beside every step.

The flag keeps one fixed shape (every key always present, lists replaced whole), so an ordinary `setFlag` merge can never leave a stale key behind.

**Back and redo rules.** Rolls are never re-rolled: a D66 row and a performance roll are results the rules forbid trying again (Chapter 1, no retry), and every one is already in chat. Going Back to a step shows its rolls fixed and its choices editable, with one lock:

- A choice is **locked** once a roll whose pool read it has been made (a GM override turns every lock off): every choice that moved an attribute or a Talent level before a performance roll or an Exam roll is locked by that roll (the pool used it). D66 rolls read nothing, so they lock nothing. The Campaign Year is locked by the Origin roll (the row condition read it); the procedure by the first roll; the Exam vote by Year 3's performance roll or the first Trial roll.
- An **unlocked** choice can change. Replay then re-checks every later choice against the new totals: a later Talent choice that can no longer gain a level, or an overflow target that is no longer valid, is cleared, and the wizard moves to the first step that needs input again. Later rolls stay.
- Graduation, Finish, and every built step read no dice, so they stay editable until the commit.
- After the commit the wizard is closed for good for players. A GM has a control bar above every step (`components/GmBar.svelte`), which the rules give them no part in (ADR-0024) and which exists so a table can correct a misclick: a lock override that lets any earlier choice change however late, jumping to any step, clearing a step and everything after it, re-opening a filed soldier, restarting the file, writing a D66 or a number of successes by hand, and setting or clearing the campaign's Exam board. Every one of them is refused for a player in `wizard.ts`, whatever the sheet shows. The header's "Reset the Lifepath" control, which clears the state without touching the sheet, stays.

## 5. Rolls and chat

Each roll goes through `WofRoll` and posts a `lifepath` card (message flags, drawn by the existing chat hook):
- **D66**: `1d6[tens] + 1d6[units]`, read tens then units; the card shows both dice and the row read ("Rolled again: the Campaign Year is before 848" when a row's condition fails).
- **Performance roll**: `Ndb` (attribute dice, bone base dice); the card shows the dice, the successes, and the Merit.
- **Exam board**: `1d6 + 1d6` read as a D66, one card per Stage naming its Trial and the condition it is run under.
- **Exam order**: `1d6`, one card.
- **Exam Trial**: `Ndb + 1dg + Nds`; the card shows the kinds apart, the successes against the Trial's threshold, the Merit, a Stress Response line when a Stress Die shows 1 (it costs 1 Merit here and blocks a Push). A Push re-rolls the non-6 base and Stress Dice plus a new Stress Die unless Covered, updates the same card, and is shown by Dice So Nice.

The card is informational: its ops list is empty, so it has no Undo. The wizard records the faces in the state from the evaluated roll before the message is created, so a failed chat post never loses a result.

## 6. Commit (Finish)

`finalSoldier(state)` returns the payload; `commit.ts` writes it:
- `system`: attributes, haven, canon_tie, drive (the Drive's name), drive_named_comrade '', drive_used_this_session false, merit (the total, may be negative; null for a built soldier), class_rank (null for built), declined_military_police, rank private, health_lost 0, down false, stress 0, grief 0, scars [], every other harm field at its default, gas_rating full, spare_canisters (full, less declines), notes (a built soldier's story events appended).
- Items from the compendia (deterministic pack ids baked into the config), with `_stats.compendiumSource`: the Origin, the Specialty, each Talent at its level, and the Standard Issue gear (ODM Gear at the Funding row's rating, Blade Sets rated 1 with one in the handles, the horse, the Specialty item), after the receiving steps run against any gear already held.
- `name`, and the Specialty portrait (the existing `createItem` hook does it).
- The state is marked finished in the same update.

## 7. The window

The Personnel File look (ADR-0027): paper in the leather binder, the numbered file tabs as a vertical step rail on the left with a stamp on each finished step, § section rules, the website's step text, the roll area with the dice as the card's die icons, table rows as paper slips with pick cards, the running file summary (attribute pips coloured by attribute, Talent level dots, Merit, Drive, Class Rank) on the right, and Back and Confirm at the foot. Motion from the shared tokens through `fx.ts`: a stamp thud on confirm, the rolled row sliding in, pips popping when a point lands; Reduced keeps the colour and opacity; Off shows the end states. Text never below 10px; every string in `lang/en.json`; rules text is the website's (the build extracts it and runs the text guard over it).

It opens from a banner on an empty Soldier sheet ("This file is empty": Open the Lifepath) and from the same banner while unfinished ("Resume the Lifepath, step n"). An empty Soldier: no Origin, Specialty, or Talent Items and no finished Lifepath state.

## 8. Tests

- `test/lifepath-rules.test.ts`: D66 lookup for every row of each table; Origin condition and re-roll; overflow; Talent caps and the all-capped fallback; the Specialty and general lists at Graduation; performance attribute and Merit bands; Class Rank bands (0 or less to 10 or more); swap (with a tie), floor (all 3s), Top 10 cap at 6; Exam Stage pools, the conditions table, Stress Response cost, Push; built shapes and placement checks, template ratings, built Talent limits; Standard Issue by Funding and Specialty with declines and held gear; derived values; the Mira and Tomas examples from the website end to end.
- `test/lifepath-state.test.ts`: replay statuses; locks; Back edits clearing only invalid later choices; the fixed state shape.
- `test/lifepath-e2e.test.ts`: a full Lifepath built by rolling (seeded dice, every step through the state operations, Exam on and off) and a Free Build and a Template Build built by choosing, each ending in the commit payload checked against the rules (18 or 19 points, 5 Talent levels, Health and Resolve, gear).
- Config and wording: the lifepath config passes the text guard; the step text extraction finds every section it needs.

Browser check (isolated server, port 30055): as a player, one soldier by rolling (with the Exam) and one by choosing; close and resume mid-way; Back across steps; the finished sheets checked against the rules; a screenshot of every step.

## 9. Rules questions

Raised by this plan and logged in `docs/rules-questions.md` (entries 7 to 10): a Drive that needs a named comrade when the Squad has no other soldier at join-the-squad; conditional dice Talents in the Exam; the first Blade Set received when a soldier declines some; the named story events of a built soldier have no sheet field.
