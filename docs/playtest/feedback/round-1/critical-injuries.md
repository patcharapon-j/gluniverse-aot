# Critical Injuries: body-part wounds and damage types

Research and opinion only. No rule was changed. Written 2026-09-15 against the Phase 1 rules as committed (Chapter 3 Done, simulator Done, playtest packet published).

Owner note (verbatim): "critical injuries are very important part of this espesiall the injuires spcific to body part (head, torso, left/right arm, left/right legs) also Critical injuries currently seem to only be physical I want it to have unique feel as well as supporting damage typ,e (piercing, bludgening, slashing) as well as "burn" damage (from titan steam, titan corpse) etc"

Sources read: `CONTEXT.md`; `docs/rules/03-harm-and-mind.md`; `data/harm/*.yaml`; `data/engagement/titan-harm.yaml`, `grab.yaml`, `titan-format.yaml`; `data/gear/falls.yaml`; `data/titans/*.yaml`; Chapter 6; ADR-0003, 0005, 0012, 0014, 0015; OQ-41, OQ-42, OQ-132; DECISIONS OQ-41 and OQ-42; `docs/reviews/03-harm-and-mind-review-1.md` and `-1-codex.md`; `docs/reviews/simulator-report.md`; `tools/sim/dice.py` (`gain_ci`) and `rules.py`; Alien RPG Evolved pp. 68 to 71 (PDF 72 to 75); Coriolis: The Great Dark pp. 65 to 67 (PDF 69 to 71); Titan World 3e, sections *Injuries*, *The Four Types of Injuries*, *Explosives*, *Titan Bodies*.

## Why now

### The current system, exactly

- **Trigger.** Every Titan attack (a harming Behavior Table entry that lands because the dodge missed its Severity) is a Critical Injury, never damage (ADR-0005, ADR-0015). Damage (falls only, in Phase 1) marks Health boxes and gives a Critical Injury only when it brings current Health to 0 or is taken at 0. The Grab's crush is a torso Critical Injury that cannot be lethal.
- **Location.** D6 on one table: 1 to 2 arm, 3 to 4 leg, 5 torso, 6 head. Four Injury Locations, no side of the body tracked (OQ-41). Chapter 6 fixes the location on most entries: every Bite is torso or leg, Clutch at the Legs, Crush, and Trample are leg, Swat and Headlong Lunge are rolled.
- **Dice and entries.** 2D6 on that location's table, plus 2 for every Critical Injury held at that location (treated or not) and every healed one there with permanent effects. Four tables: arm 7 rows, leg 7, torso 9, head 9, so 32 rows in total. Each row carries eight fields: `down`, `lethal`, `time_limit` (turn, engagement, day), `death_roll_penalty`, `effects` (dice penalties on named Action Catalog entries, or a Stress gain), `healing_days`, `permanent_effects`, `repeat_row`. Every table has a `non_lethal_cap` row.
- **Severity and death.** The bell curve does the work. A first roll at a location is lethal 16.7% at arm, leg, and head and 8.3% at torso, 15.3% weighted across the location die; it puts the soldier Down 10.6% of the time. Instant death sits at 15+ on torso and head, reachable only with worsening. Lethal rows cause Death Rolls (Strength, no Push, no Stress Dice) when the limit runs out; `turn` limits become `engagement` at the fight's end, and one aftermath Treat Injury roll per patient precedes the end Death Rolls (OQ-54, OQ-57).
- **Damage type.** There is none. No field, no term, no rule reads the cause of a Critical Injury. A Swat, a Bite, a fall at 0 Health, and the Grab's crush all roll the same tables. The row names carry mixed flavour anyway: Gashed Forearm, Torn Artery, Opened Artery, Split Scalp, and Torn Open are cuts; Fractured, Crushed Ribs, Caved-In Chest, and Shattered Knee are crush results. A Swat can therefore produce a Gashed Forearm.
- **Non-physical.** The tables carry two Stress gains (Winded, Dazed) and nothing else of the mind. The mind lives in Part Two of Chapter 3: Stress Responses (D6 + Stress minus Resolve), Fear Rolls (closed trigger list, ADR-0003 item 1), and Scars (D66, lasting named trauma). A stabilized lethal Critical Injury already gives a Scar (`data/mind/scars.yaml`, line 18).

### Why it is this way

1. **Location without side: deliberate but shallow.** OQ-41 considered exactly the owner's six-part body as option (c) and rejected it for two reasons: the glossary listed four locations, and six locations "halve how often worsening applies". DECISIONS OQ-41 records "Why: unchanged" and no ADR change. Codex review 1 (finding 3) and Opus review 1 (finding 15) then found that untracked sides let the same arm be lost twice; the fix (OQ-42 option j, `repeat_row`, healed permanent rows keep counting) papered over the missing side rather than adding it. Codex's fix 1 in that review, "track destroyed anatomy by side", was recorded as option (k) and not taken because "(k) needs sides".
2. **Body-part identity was the point of ADR-0005.** ADR-0005 rejected "Alien's Health pool with a generic critical injury table" because it "loses the body-part identity the injuries need", and rejected Titan World's per-location wound states as "too much bookkeeping per hit". The four tables are the compromise. So the owner's instinct is the design's own founding reason; the current shape is the first pass at it, not a rejection of it.
3. **Damage type was never in scope.** No OQ, review, or decision mentions damage type, blunt, slashing, piercing, or burn. The words "steam", "corpse", "evaporate", "blast", "gunfire", and "friendly fire" appear in no rule or YAML file. Phase 1's only harm sources are Titan attacks and falls, so there was no second cause to distinguish, and Chapter 3 took the Alien and Coriolis shape (one cause-blind table per something) as its base. This is thin first-pass scope, plainly.
4. **The rows are simulator inputs.** OQ-42's decision made the 32 rows "the starting values for the ADR-0014 simulator" and named the first lever if deaths ran low (arm and leg 11 and 12 to `turn` limits). The simulator loads the tables from YAML (`tools/sim/rules.py` lines 222 to 248) and `gain_ci` in `dice.py` reproduces the whole procedure: location die, worsening, repeat rows, caps, instant death, Health boxes. Deaths through the end of the Titan Engagement include the end Death Rolls on these rows. So the rows feed every deaths figure, and OQ-132 (the Medium deaths band Missed at 0.0573 against 0.05) sits on them.
5. **No mind entries on the physical tables: deliberate.** Chapter 3 split body and mind on purpose, with a closed Fear Roll trigger list (ADR-0003 item 1) and Scars as the "unique feel" track for trauma. Alien's crit table mixes them (#11 Focused relieves all stress, #43 Traumatized rolls mental trauma); WoF chose not to.

## Opinion

**Agree, with changes.** The body-part half of the note is the design's own promise (ADR-0005), and the current four-location table without sides underdelivers it. The damage-type half is right about the feel and wrong about the shape: four full tables per type would multiply authoring and table time for a dimension that Phase 1 barely uses. The right move is sides now, one Injury Type dimension expressed as names plus a few riders, and Burn as a hazard first, with the tuned rows left where the simulator put them.

### "Only physical" has two readings, and both need an answer

- **Reading 1: no variety by cause.** True, and it shows: a Swat that gashes a forearm reads wrong at the table, and a Bite that "Fractures" a leg loses the most iconic AoT wound, the limb bitten off. This is the reading I would act on.
- **Reading 2: no non-physical Critical Injuries.** Also true of the tables, but false of the chapter. WoF already has three mind tracks (Stress Responses, Fear Rolls, Scars) and a bridge (surviving a lethal Critical Injury gives a Scar). Adding mind rows to the physical tables would double-count with Fear Rolls and break the closed trigger list. I would not do it. If the owner wants a wound to touch the mind more, the cheap lever is one Stress gain on every lethal row and a Fear Roll trigger "you see your own limb come off", not new table rows. This is an owner question below.

### What the parent games do (concrete numbers)

- **Alien RPG Evolved** (p. 70, PDF 74): one D66 table, 36 rows, columns D66, Injury, Lethal, Time Limit, Effect, Healing Time. Trigger: reaching 0 Health (broken), and every further damage instance while broken. No location roll and no damage type; location lives in the row names (ankle, eyes, ear, toes, fingers, teeth, thigh, shoulder, nose, ribs, eye, throat, arm, leg, foot, face, lung, gut, skull, spine, jugular). Severity rises with the roll: 11 to 13 trivial (one relieves all stress), 14 to 43 non-lethal impairments, 44 to 52 lethal with a Shift limit, 53 to 56 lethal with a Stretch limit (arterial bleeds, severed arm and leg), 61 to 63 lethal with a Round limit and Stamina penalties of 1 to 3, 64 to 66 instant death. So 15 of 36 results are lethal (41.7%) and 3 of 36 kill outright (8.3%) on a first roll. Death roll: Stamina, no push, no stress dice; three successes on your own ends the rolls; a failed first aid worsens the limit one step (p. 71). The Evolved change from first edition is not the table shape but the Health formula (half of Strength plus Agility, the formula WoF copied) and the Stress Response layer; the crit table is the same D66 shape. Fire is a hazard, not a crit variant: intensity dice, 1 damage per success (extraction line 342).
- **Coriolis: The Great Dark** (pp. 66 to 67, PDF 70 to 71): one D66 table compressed to 21 rows over ranges. Trigger is different: a single damage instance at or above the weapon's crit threshold, whether or not you are broken, plus any damage while broken. 11 to 26 are one-shift conditions (each a minus 2 on one attribute), 31 to 52 are D6 or 2D6-day injuries ("Arm cannot be used", "Movement becomes an action"), 53 to 64 lethal (die after one shift unless stabilized; severed arm and leg are permanent), 65 and 66 instant death. 10 of 36 results lethal (27.8%), 2 of 36 instant (5.6%). No location, no damage type. Fire again has "no crit table" (p. 72, extraction line 222). Creatures get their own D6 crit table (Frenzy, Retreat, Stunned, Flee, Killed).
- **Titan World 3e** (*Injuries*, *The Four Types of Injuries*): six parts (head, chest, two arms, two legs), three categories (Minor, Major, Crippling), four types (Cut, Blunt, Piercing, Burn). It has no table at all: each type is a paragraph of rules, and the category is "at the GM's discretion for the most part". Each type earns its keep with one signature behaviour: Cut bleeds Consciousness and severs when Crippling; Blunt breaks bones and shatters or paralyses when Crippling; Piercing bleeds like a cut and its Minor wounds debuff like Major ones; Burn stacks (three Minor become a Major), forces a Body roll against bleeding, and a Crippling Burn to chest or head is "a slow and certain death". Location gates the stat penalty (arm: Technique, leg: Agility, head: Mind, chest: Body). *Titan Bodies* is the source of the owner's corpse heat: pinned under a dead Titan you take a Major burn on a 6 or lower each time a player acts, and rescuers lifting it take Minor burns on both arms. *Explosives* gives Major burns on every limb when fully caught. This is the feel the owner loved and the bookkeeping ADR-0005 refused.
- **Other Year Zero games, from memory, not in `docs/reference/`** (verify before citing in a rule): Forbidden Lands uses one D66 crit table per damage type (Blunt, Slash, Stab, plus Horror, Cold, and Disease), 36 rows each, with no location roll. Twilight 2000 4e uses a D6 hit location and one crit table per location (head, arms, torso, legs). So both of the owner's axes have a YZE precedent, and no YZE game does both at once. Doing both at once is the authoring problem this file sizes.

### Do the four types fit AoT?

Map every harm source WoF has or will have:

| Source | Phase | Natural type | Note |
|---|---|---|---|
| Titan Bite | 1 (every table) | Bite: sever plus crush | The signature AoT wound. Pierce does not describe it; a Titan's mouth takes the limb. |
| Grab crush | 1 | Crush | Already torso, cannot be lethal (ADR-0015). |
| Swat, Clutch at the Legs, Crush, Trample, Headlong Lunge | 1 | Crush | Every control entry and Thrash is Crush. |
| Falls (Jam, Down while airborne or mounted, knock-loose) | 1 | Crush | Damage kind; crits only at 0 Health. |
| Stomp, pinned under a falling or dead Titan | none yet | Crush, then Burn if the corpse is dead | Titan World's pinning rule; WoF has no pinning rule. |
| Titan steam at a Nape cut, corpse evaporation | none yet | Burn | Owner asks for these. |
| Fire (stables, town) | none yet (a Lifepath event only) | Burn | |
| Blade friendly fire, own blade on a bad swap | none yet | Cut | Blade Sets ruin gear, never a soldier (`blade-sets.yaml`). |
| Gunfire, cannon grapeshot | Phase 2 (human conflict) | Pierce | The Military Police, the Interior. |
| Thunder Spears, gas canister blast | canon 850, edge of the campaign | Blast: Burn plus Crush | |
| Horse fall, kick | 1 (fall from a horse) | Crush | |

Findings:

- **Bludgeoning should be called Crush.** Nothing in AoT bludgeons; Titans crush, pin, swat, and trample. Crush also names what the Grab already does. It is the type of every Phase 1 source but the Bite.
- **Bite deserves its own type, or the axis is pointless in Phase 1.** With only Crush and Pierce available, every Titan-fight Critical Injury would be Crush, and the whole apparatus would change nothing until Phase 2 brings rifles. A Bite type (teeth: severing at the top rows, crush below) is the one place the owner's "unique feel" lands inside the fights the game is about.
- **Cut and Pierce are Phase 2 types.** They have no source in Phase 1. Author them as stubs now so the sheet and Foundry field exist, and give them rows when human conflict is drafted. Slashing is the right word for blades; Piercing for shot and arrow. Titan World merged Piercing with Ballistic for the same reason.
- **Burn is real and wanted, but it needs a source rule before it needs a table.** Steam and corpse heat are hazards Chapter 5 must create (see Impact). Burn's mechanical identity is slow lethality (infection, so `day` limits), long healing, pain (Stress), a medical kit requirement, and disfigurement (a Scar), not fast death.
- **Blast is a delivery, not a type.** A blast rolls two Critical Injuries, one Burn and one Crush, at two rolled locations. Adding a fifth table for it buys nothing.

So the AoT set is Crush, Bite, Burn, Cut, Pierce, with Cut and Pierce dormant in Phase 1. That is five names but, for Phase 1 authoring, two live tables' worth of variation (Crush and Bite) and one hazard (Burn).

### Left and right limbs

Canon supports maimed soldiers staying in the story (Erwin without his right arm still commands the charge; Levi fights on after leg and later face injuries), and the rules support it better than the owner may think:

- Lost Arm's permanent effect is a 2-die penalty on Nape strike, Body Part strike, Break Free, Treat Injury, and Field Repair. Penalties never take base dice below 1 (effect-types, `penalty`). A Strength 4 Rookie strikes at 2 base dice plus Gear Dice: playable, weak, alive. A Leader or Tactician loses nothing that matters: Read, Break Attention, Rally, Ride, Fly, and the dodge carry no arm penalty. That is Erwin.
- **The gap is Fly and the dodge.** Nothing in `odm-gear.yaml` ties ODM use to hands; "both hands on the triggers" is canon, not a rule. A one-armed soldier flies and dodges at full dice today. Sides make this fixable: a Lost Arm could forbid Fly and every strike (the handles need two hands) while leaving Ride, Read, Rally, and Break Attention on horseback intact. That is exactly the Erwin outcome: commander on a horse, never in the air again. Whether a second lost arm or a lost leg should end ODM play is an owner call.
- Lost Leg's 2-die penalty on Fly, Ride, and dodge already makes a soldier Titan food (a Severity 3 dodge at Agility 3 minus 2 is 1 base die plus 2 Gear Dice). There is no medical Retirement: Retirement comes only at five Scars (`scars.yaml`). A maimed soldier who cannot fly has no rule that turns them into the instructor or contact the Retirement rule promises. Owner question.
- Two blades are carried, one per hand, but the Blade Set is one item and Gear Dice come from "the Blade Set in the handles", so a lost hand needs no blade rule beyond forbidding strikes.
- **What sides cost in odds.** The location die already splits 1 to 2 arm and 3 to 4 leg, so 1 left arm, 2 right arm, 3 left leg, 4 right leg, 5 torso, 6 head keeps every location weight exactly. Only worsening moves: a second limb hit lands on the same side half as often, so the escalation OQ-42 priced (arm lethal 16.7% with none held, 41.7% with one) fires half as often on limbs. That lowers deaths slightly, which is the direction OQ-132 needs.

### Structures, costed

Current cost for scale: 4 tables, 32 rows, 8 fields each. Table time mid-fight: D6 location, 2D6, find one of four tables, find the row: about 20 seconds with the packet open.

| Structure | Authoring | Lookup | Verdict |
|---|---|---|---|
| **(a) Location roll, then one table per type with location-tagged entries** | If entries are location-specific it is really 4 types x 6 locations x about 7 rows = about 170 rows. If entries are location-blank ("Fractured [limb]") it is 4 x about 9 = 36 rows of templated text that reads flat for torso and head. | Two rolls, pick 1 of 4 tables, then filter by location within it: slower than today, and the reader scans rows that do not apply. | Worst of both. Reject. |
| **(b) D66 per type, tens die = location** | 4 types x 36 = 144 entries (6 locations x 6 severities each). Every entry is one cell, so authoring is regular, and sides come free (six tens faces). | One roll of two dice, one table, direct lookup: the fastest at the table. | Elegant, but it throws away the 2D6 bell curve the whole lethality tuning rests on (instant death "unreachable on a first roll", OQ-42 option h), makes worsening a die bump on a flat distribution, and forces 144 tuned entries before Phase 1 ships. The 6-severity ladder per location is also coarser than today's 7 to 9 rows. Keep as the Phase 2 shape if the owner wants the full Forbidden Lands feel. |
| **(c) One location table, type modifies the entry** | 4 tables (arm and leg rows shared by side) x 32 rows, each row gaining one name per type, plus one short rider block per type. About 32 effect blocks and 128 names. | Today's lookup plus one column read: about 25 seconds. | The only structure that keeps the tuned rows, ADR-0012's single source, and the simulator's loader nearly intact. Recommended. |
| **(d) Full per-type-per-location tables** | 4 types x 4 location tables x about 8 rows = 128 tuned rows, 16 tables in the packet. Within genre norms (Forbidden Lands players cope with 6 x 36) but every row is a simulator input. | Pick 1 of 16 tables: about 35 seconds. | Right only if Cut and Pierce get real sources; L effort. Phase 2 candidate. |

### Where the simulator sits

Crits feed death rates directly: `gain_ci` rolls the location and the row, applies caps and repeat rows, sets `instant_death`, and the end steps roll Death Rolls on every untreated lethal row. So:

- **Renaming rows per type: no rerun.** The loader reads ids and fields, not names.
- **Adding sides with per-side worsening: rerun needed.** `gain_ci` counts held injuries by `loc`; a side field changes the count. Deaths fall slightly. The Medium band is already Missed high (0.0573 against 0.05, OQ-132), so this moves toward Met, not away. About 9 minutes per run (HANDOFF).
- **Type riders that touch `lethal`, `time_limit`, `death_roll_penalty`, or `down`: rerun needed**, and only Bite and Crush riders can move a Titan-fight figure. If the Bite type keeps today's torso and leg rows as its rows (they were tuned as bites), the rerun is a check, not a retune. Riders on Cut, Pierce, and Burn touch no measured row until their sources exist.
- **Any new Burn hazard on a Nape kill would blow the Critical Injuries band** (Medium 0.5 to 0.9 a fight, now 0.68; a killer is always at Blind Spot, so a crit per kill adds about 0.85). Steam must be damage (Chapter 4 style, D6 table like falls), which reaches a Critical Injury only at 0 Health, or a Gas or Stress cost. Burn Critical Injuries should come from being pinned under a corpse and from fire, not from every kill.

## Impact and options

### What each option touches

**Option 1: Names and sides only (S).**
- Sides on the location die (1 left arm, 2 right arm, 3 left leg, 4 right leg, 5 torso, 6 head), worsening per side, and each row given one name per type with no rider. Every harming effect in Chapter 6 gains `injury_type: crush` or `bite`; the Grab's crush and falls are `crush`.
- Touches: `critical-injuries.yaml` (location table, `held_injuries.sides`, `worsening`, row `names`), `health.yaml` (harm parameters), `sheet-fields.yaml` (side and type per entry), `titan-format.yaml` (effect field), all five `data/titans/*.yaml`, `grab.yaml`, `falls.yaml`; Chapter 3 sections 3.1, 3.2, 3.7 figures, 3.17, the example; Chapter 4 (falls); Chapter 5 (Grab); Chapter 6 (every harming row's effect text); `CONTEXT.md` (Injury Location lists six; new term); `tools/render/render.py` (two renderers), `tools/probes/chapter-06/render.py` (effect column), `tools/sim/dice.py` (`gain_ci` side count); packet sections Critical Injuries, sheet, GM Titan tables; simulator rerun.
- ADRs: ADR-0005 amended (locations now sided; rows carry Injury Type names), ADR-0015 amended (the crush is Crush), ADR-0003 item 11 amended (harming effects list Injury Type). A new ADR-0016 "Critical Injuries carry a sided Injury Location and an Injury Type" is cleaner than three amendments.
- Risk: low. The owner gets the six-part body and cause-flavoured names; the mechanics do not yet differ by type, which may feel hollow.

**Option 2: Sides, type names, type riders, Burn hazards (M). Recommended.**
- Everything in Option 1, plus a `type_riders` block per type (see Sample entries) and two Chapter 5 hazards with data-shaped triggers: **Steam** (damage at the Nape kill step for soldiers On Body or at Blind Spot, a D6 table like falls, so Burn Critical Injuries arrive only through 0 Health) and **Pinned** (a grounded Titan's fall or a Titan's death lands on soldiers at a named Position: a Crush Critical Injury, and each round under a dead Titan a Burn Critical Injury at a fixed limb, with Lift Comrade or a Body Part strike as the escapes). Chapter 4 gets a Fire hazard stub for towns and stables, Burn typed.
- Also fixes the Lost Arm gap: a rider on `arm-lost-arm` forbidding Fly and strikes (both hands), leaving mounted actions intact.
- Additional touches: `titan-harm.yaml` (`titan_death` steps), `positions.yaml` (where a corpse lands), `carrying.yaml` (lifting a Titan off a comrade is a new tracked value and Catalog use, ADR-0003 item 12), Fear Rolls unchanged (closed list), `scars.yaml` (a Burn's Scar), `tuning.yaml` (steam beside the Critical Injuries band as a report). Simulator: steam damage and pinning are new cases; the Critical Injuries band must be re-measured with steam on.
- ADRs: as Option 1, plus ADR-0014 amended (the Health-dependent targets are re-measured with sides and steam; the Critical Injuries band gains a "with steam" row).
- Risk: medium. Steam sized wrong makes every kill cost a box and turns the prepared-Squad kill into a war of attrition; size it as a Stress or Gas cost first and damage second. Pinning adds a procedure to a chapter that has just closed three review rounds.

**Option 3: Full per-type tables, D66 with the tens die as location (L).**
- Structure (b): five tables (Crush, Bite, Burn, Cut, Pierce) x 36 entries, sides free. Replaces the 2D6 bell curve and the worsening rule with a die bump on the ones die.
- Touches everything in Option 2 plus: the whole of section 3.2 and OQ-42's figures are withdrawn and re-derived; `gain_ci` is rewritten; every ADR-0014 Health-dependent target and the Grab's Down and Break Free spreads (section 3.7, `tuning.yaml` `grab`) are retuned; the packet's Critical Injuries section becomes five pages.
- Risk: high before the first playtest. It is the right end state only if the owner wants Forbidden Lands' feel more than the tuned lethality curve.

### Cross-cutting impact

- **CONTEXT terms.** "Injury Location" changes to list six. A new term is needed and must not be "Damage Type": "damage" is already the harm kind that marks boxes (`harm_kinds`), so "damage type" would read as a kind of that. Propose **Injury Type** (Crush, Bite, Burn, Cut, Pierce), parallel to Injury Location, with _Avoid_: damage type, wound type. "Blast" is a delivery, defined where Thunder Spears appear.
- **Character sheet.** Each Critical Injury entry gains `side` (or the location id carries it: `left-arm`) and `injury_type`. On paper: "Right arm, Bite, Bitten Off, untreated, turn, 28 days". The `healed_permanent_injuries` list becomes sided, which is what stops the same arm being lost twice without `repeat_row` gymnastics. `repeat_row` can then be retired for limbs and kept for eyes.
- **Table time.** Option 1 and 2 add one column read. Option 3 removes a roll and a table pick but adds a five-table booklet.
- **Foundry (ADR-0003, ADR-0012).** Options 1 and 2 are a field on the effect (`injury_type`), a field on the entry (`side`), a name map on the row, and a rider list read at apply time: a translation, not a redesign. Option 3 is a new table shape and a new worsening rule, so the importer changes. In every option the per-type name lives on the same row object, so the chat card can print "Crush: Fractured Arm" from one lookup.
- **Playtest packet.** The Critical Injuries section (`#harm-crit`), the sheet list, the quick reference, and every GM Behavior Table effect cell.
- **Reviews.** A rule change of this size is a new decision batch, a Chapter 3 conformance round, and a Chapter 5 and 6 conformance round if hazards are added (HANDOFF triage step 2).

## Recommendation

Take **Option 2**, in two steps so the first playtest is not held hostage by hazard design:

1. **Before the playtest (S, this batch):** sides on the location die; `injury_type` on every harming effect (Crush or Bite in Phase 1, Crush on falls and the Grab); one name per type on every row; the Bite rider (top rows sever); the Lost Arm rider (no Fly, no strikes); CONTEXT term Injury Type; ADR-0016; simulator rerun as a check. Cut, Pierce, and Burn get names on the rows and no source, marked "Playtest rule" in the packet.
2. **After the first playtest (M, its own batch):** Steam as damage at the Nape kill step, Pinned under a corpse as the Burn source, Fire in Chapter 4, and the Burn riders. Measure steam against the Critical Injuries band before committing a value.

Decline: mind rows on the physical tables (Reading 2), a Blast type, and Option 3 before Phase 2.

Why this and not the full tables: the tuned rows are the only thing in Chapter 3 the simulator has verified and the owner has not yet played. Names and riders give the "unique feel" at the table on day one; the mechanics the riders change are the ones the fiction demands (a Bite takes the limb, a Burn festers, a Cut bleeds out fast) and no others, so the death curve stays where ADR-0014 put it.

## Sample entries

Recommended YAML shape: the row keeps its tuned fields and gains `names` keyed by Injury Type; a `type_riders` block per table lists the few rows or fields a type changes. Rendered, the packet prints one row with the type names in one cell.

```yaml
injury_location_table:
  roll: D6
  rows:
    - {results: {min: null, max: 1}, injury_location: arm, side: left}
    - {results: {min: 2, max: 2}, injury_location: arm, side: right}
    - {results: {min: 3, max: 3}, injury_location: leg, side: left}
    - {results: {min: 4, max: 4}, injury_location: leg, side: right}
    - {results: {min: 5, max: 5}, injury_location: torso}
    - {results: {min: 6, max: null}, injury_location: head}
# worsening counts Critical Injuries at the same Injury Location and side
```

**Sample 1: arm, 8 to 9 (today's Fractured Arm), one row, five names, shared effects.**

```yaml
- id: arm-08
  names: {crush: Fractured Arm, bite: Arm Chewed to the Bone, cut: Forearm Laid Open, pierce: Shot Through the Arm, burn: Arm Scalded Raw}
  results: {min: 8, max: 9}
  down: false
  lethal: false
  death_roll_penalty: 0
  effects:
    - {type: penalty, dice: 2, entries: [nape-strike, body-part-strike, break-free]}
  healing_days: 21
```

Rendered: `| 8 to 9 | Crush: Fractured Arm. Bite: Arm Chewed to the Bone. Cut: Forearm Laid Open. Pierce: Shot Through the Arm. Burn: Arm Scalded Raw | no | no | 0 | 2-die penalty on Nape strike, Body Part strike, Break Free | 21 |`

**Sample 2: leg, 13 or more (today's Lost Leg), the Bite rider at work.**

```yaml
- id: leg-13
  names: {crush: Leg Shattered Past Saving, bite: Bitten Off at the Thigh, cut: Leg Severed, pierce: Femoral Artery Torn, burn: Leg Charred Through}
  results: {min: 13, max: null}
  down: until_treated
  lethal: true
  time_limit: turn
  death_roll_penalty: 1
  healing_days: 28
  permanent_effects:
    - {type: penalty, dice: 2, entries: [fly, ride, dodge]}
  once_per_side: true      # replaces repeat_row for limbs: this side is gone; a later roll here uses leg-12
```

**Sample 3: type riders, one block per table (arm shown).** These are the only places a type changes a field.

```yaml
type_riders:
  bite:
    - {rows: [arm-12, arm-13], sets: {time_limit: turn}}                  # teeth tear; a Bite's lethal rows bleed fast
  cut:
    - {rows: [arm-10, arm-11, arm-12], sets: {time_limit: turn}}          # bleeding out
    - {all_rows: true, treat_injury: no_kit_penalty_waived}               # a tourniquet is a sleeve and a stick
  pierce:
    - {rows: [arm-10, arm-11, arm-12, arm-13], sets: {death_roll_penalty_add: 1}}
  burn:
    - {all_rows: true, sets: {healing_days_multiplier: 2, stress_gain_add: 1}}
    - {lethal_rows: true, sets: {time_limit: day}}                        # infection, not haemorrhage
    - {all_rows: true, treat_injury: requires_medical_kit}
    - {rows: [arm-13], gives_scar: true}
  crush: []                                                               # the tuned rows are Crush rows
lost_limb_riders:
  arm-13:
    forbids_entries: [fly, nape-strike, body-part-strike]                 # the handles need both hands
    keeps: [ride, read, break-attention, rally, treat-injury]             # Erwin on a horse
```

**Sample 4: head, 13 to 14 (today's Lost Eye), where Burn earns its keep.**

Rendered: `| 13 to 14 | Crush: Eye Socket Crushed. Bite: Face Torn Open. Cut: Eye Cut Out. Pierce: Eye Shot Out. Burn: Eye Scalded Blind | until treated | yes, engagement (Burn: day) | 0 | none | 28 (Burn: 56) | 1-die penalty on Read, Break Attention, Nape strike; Burn also gives a Scar |`

**Sample hazard (for the second step), data-shaped, no GM choice:**

```yaml
steam:
  when: titan_death step, after the nape-kill Stress relief
  who: every soldier On Body or at Blind Spot relative to the dying Titan
  harm: damage, roll D6 on steam_table (0, 0, 0, 1, 1, 2 by face), injury_type burn, injury_location head
  reaction: none            # not a behavior; no dodge
  fear: none                # the Fear Roll list is closed
```

## Questions for the owner

1. **Which reading of "only physical" did you mean?** No variety by cause (the tables read the same for a Swat and a Bite), or no mind consequences on the body tables (Alien's Traumatized row)? The recommendation acts on the first and leaves the mind to Stress Responses, Fear Rolls, and Scars. If you want the second, the cheap lever is one Stress gain on every lethal row, not new rows.
2. **Is Bite its own Injury Type?** Without it, every Phase 1 Titan-fight Critical Injury is Crush and the type axis changes nothing until rifles arrive in Phase 2. With it, the top Bite rows sever limbs and bleed on a `turn` limit, which raises deaths a little inside the fights the simulator measures.
3. **Crush, or bludgeoning?** The recommendation renames the type to Crush because Titans crush, pin, and trample. Say if the D&D word matters to you.
4. **How much should a lost arm or leg end?** Today a one-armed soldier flies and dodges at full dice. The recommendation forbids Fly and strikes on a lost arm and leaves horseback command intact (Erwin). Should a lost leg forbid Fly too, and should a soldier who can no longer fly get a medical Retirement route (instructor or contact) rather than waiting for five Scars?
5. **Steam at every kill, or only when pinned?** A Burn Critical Injury on every Nape kill breaks the Critical Injuries band. Steam as damage (a box or two, Burn Critical Injury only at 0 Health) keeps the tuned odds; corpse heat while pinned is where Burn Critical Injuries would come from. Confirm that split, or say you want every kill to scald.
6. **Full per-type tables now, or names and riders now and full tables in Phase 2?** Option 3 is the Forbidden Lands feel at the cost of the tuned 2D6 curve and about 180 tuned entries before the first playtest.
7. **Glossary term.** "Injury Type" is proposed because "damage" already names the harm kind that marks boxes. Object now if you want "Damage Type" regardless.
8. **Sim rerun timing.** Sides and the Bite rider both move death figures a little in opposite directions; the rerun is 9 minutes. Do you want it before the first playtest, or is the playtest allowed to run on unmeasured rows with a "Playtest rule" tag?
