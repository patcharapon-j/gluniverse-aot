# Review fix plan: feedback round 1

Written 2026-09-15 from the two final reviews of the round 1 change:

- `docs/reviews/feedback-round-1-final-review-1.md` (Opus: 0 Critical, 9 Major, 54 Minor);
- `docs/reviews/feedback-round-1-final-review-1-astra.md` (Astra: 1 Critical, 12 Major, 10 Minor);
- the known issues both reviews dispositioned, from `DECIDER-QUEUE.md`.

Every finding below was checked against the sources before it was placed. Where the triage read something a reviewer could not, the row says so. The simulator source was read only to decide section 5, and no simulator was run.

Ids: Opus findings are M1 to M7, KM1, KM2, and n1 to n24. Logged items are K1 to K40, S1 to S4, and queue item 27. Astra findings are F01 to F23.

## Counts

| | Critical | Major | Minor | Total |
|---|---|---|---|---|
| Merged findings | 1 | 19 | 40 | 60 |
| Of these, need a decision | 1 | 5 | 2 | 8 findings, 8 decisions |
| Dismissed | | | | 15 |
| Disputed and escalated | | | | 0 |

---

## 1. Merged findings

Severity is the higher of the two reviews' ratings where both report a finding. "Decision Dn" in the fix column sends the finding to section 2.

### Critical

| Id | Severity | Sources | Files and locations | Fix |
|---|---|---|---|---|
| R01 | Critical (Astra only). Triage: real but rare. It needs a Squad that lives through a fight with every soldier Down, such as a lost Skirmish or a kill whose steam or fall Downs the last soldier standing. The Leg and camp procedures then cannot go on without a ruling (ADR-0003). | F01 | `data/expedition/legs.yaml` `expedition.down_soldiers` (46 to 49), `rolls.leg-roll.who` and `notes` (219 to 232), `rolls.camp-roll.who` (234 to 237); `data/harm/treat-injury.yaml` `care_windows.who_rolls` (no Down soldier rolls); Chapter 7 lines 97, 152, 207; packet Expedition and Night Camp procedures | Decision D1. |

### Major

| Id | Severity | Sources | Files and locations | Fix |
|---|---|---|---|---|
| R02 | Major. Astra marked queue item 27 "resolved by 8-34"; that covers the ruling only. The triage confirmed the edit was never applied. | M1, queue 27 | `data/engagement/engagement-flow.yaml` `ending.tests.no-soldier-standing.past_the_stay_limit` (74 to 80) and `always_ends` (100 to 101), both still `PROVISIONAL (OQ-165)`; Chapter 5 lines 881, 889; packet 2993, 4023; `tools/sim/report.py` unmeasured list ("PROVISIONAL, OQ-165") | Apply 8-34 as its chapter impact states: name the lost-limb grade that forbids every move, check at the start of the first round past the stay limit before its wings step, and keep the lift open. Replace every marker with a citation of 8-34 and drop the packet's Playtest rule tag on that sentence. |
| R03 | Major (Opus only) | M2 | `data/engagement/background-titans.yaml` `retreat.effects.moves`, stay limit (110 to 117); `engagement-flow.yaml` `run_on` (60 to 66) and `always_ends` (85 to 101); Chapter 5 lines 848, 855; packet 2968, 2989, 4010 to 4014 | Decision D2. |
| R04 | Major (both) | KM2, F08, K31 | `background-titans.yaml` 118 to 119 ("the living Focus Titan with the earliest label" for a Down comrade); Chapter 5 line 846. Packet 2967 already reads correctly. | Compare a Down comrade as any other comparison (`positions.yaml` `comparison.otherwise`: the earliest-labelled living Focus Titan, else the corpse of the Focus Titan that died last; 8-20). |
| R05 | Major (both) | KM1, F02, K21 | `legs.yaml` `night_camp.steps` (191 to 208) and `leg_steps.titan-engagement` (152 to 159); `data/expedition/hazards.yaml` row `abnormal-at-night` (226 to 233); Chapter 7 lines 147, 213 to 214; packet 3797 and the Night Camp procedure | Decision D3. |
| R06 | Major (Opus only) | M3 | `data/campaign/downtime.yaml` `squad_actions.recruit` (115 to 120); `data/character/squadmates.yaml` `starting_squad` (105 to 118); Chapter 7 lines 255, 313; packet 916, 920, 3272, 3747 | Decision D4. |
| R07 | Major (Opus only) | M4 | `data/character/talents.yaml` `talent_rules.limit_terms` (43 to 60); `legs.yaml` `drives_and_talents` (54 to 58); `data/skirmish/skirmish.yaml` `drives_and_talents.once_per_titan_engagement`; Chapter 7 line 100; packet 3078, 3569 | Decision D5. |
| R08 | Major. Opus rated it; Astra did not rate it, because its report access was limited. The triage checked: none of the eight ids appears in `docs/reviews/simulator-report.md` or `tools/sim/`. Report section 7.1 shows four rule Talents firing 0.00. | M5, K7, K8 | `talents.yaml` Hard to Kill (302), Relentless (370), Light Trigger (458), Wide Awareness (600), Unshaken Command (663), Shoulder the Load (693), Sure Hands (754), Iron Nerve (1007); Tourniquet, Got Your Back, Formation Drill, Gallows Humour (report 7.1); Chapter 2 lines 509, 511; packet Talent rows 833 to 898 | List all twelve as unmeasured in Chapter 2's notes and tag each "Playtest rule" in the packet. This is ADR-0016 guardrail 4's second branch. No new sensitivity rows. |
| R09 | Major (Opus only) | M6 | Packet 911 to 935 (the "Fewer is allowed" paragraph); 7-11 (DECISIONS line 2292); source text in Chapter 2 lines 710, 713 | Say fights run "about three times as deadly" for player characters (no figures). Add 7-11's purpose paragraph: faster kills, Grab rescues, decoys and screens, the replacement pipeline, and named comrades, and that Wings are the easiest way to run Squadmates. |
| R10 | Major (Opus only) | M7 | `CONTEXT.md` Grit (537 to 538); packet glossary 4384. The rule is in `skirmish.yaml` `rolls.parley.needs` (448) and `parley-outside-a-skirmish.needs` (457). | Grit: "...before the group breaks and leaves, and the base of the successes a Parley needs." Mirror it in the packet. |
| R11 | Major (Astra only) | F03 | `data/harm/death-rolls.yaml`: `time_limits.turn.outside_titan_engagement` (26 to 28), `engagement.outside_titan_engagement` (41 to 43), `outside_titan_engagement_restart` (56 to 58), `outcomes.holds-on` (84 to 86); Chapter 3 line 378; packet 1445 | Scope the clauses to harm and Death Rolls outside both a Titan Engagement and a Skirmish. Keep the conversion to `day` for Death Rolls made at either fight's end steps. |
| R12 | Major (Astra only) | F04 | `data/harm/treat-injury.yaml` `care_windows.held.outside-harm.when` (137 to 143); Chapter 3 lines 447 to 450; packet 1487 to 1490 | "Once for each event outside a Titan Engagement and a Skirmish..." Harm in a Skirmish is treated by actions and at `skirmish-end`. |
| R13 | Major (Astra only) | F05 | `data/harm/health.yaml` `harm_kinds.damage.procedure` (43 to 45); `data/engagement/titan-harm.yaml` `steam.table`, whose rows 1 to 3 give damage 0 (208 to 216). `data/gear/falls.yaml` line 96 has a zero exit; steam has none. Chapter 3 section 3.1; packet 1248 to 1252, 2768 to 2775 | Add a first procedure step: damage of 0 inflicts no harm. It then covers steam, falls, and a Heave. The fall's own line stays, as a pointer. |
| R14 | Major (Astra only). The triage confirmed the example: A's Nothing Left raises B's total from 7 to 8. | F06 | `data/mind/fear-rolls.yaml` `limits.timing` (78 to 82); `data/harm/effect-types.yaml` `stress-gain-nearby` (160 to 174); Chapter 3 section 3.12; packet 1677, 1695 | Decision D6. |
| R15 | Major (Astra only) | F07 | `data/engagement/positions.yaml` `two_focus_titans.a_focus_titan_dies` (69 to 78) and `recorded_label` (79 to 81); Chapter 5 lines 248 to 251, which already say "and no soldier is Pinned" but still rewrite records to a living Titan; `engagement-flow.yaml` `then` (131 to 136) | Replace "If no Focus Titan is left, the Titan Engagement ends" with the ending tests (`engagement-flow.yaml` `ending`). When no Focus Titan is alive, a record naming the dead Titan names its corpse, with On Body and Blind Spot read as In Reach (`corpse.positions`). A record made during the run-on names the corpse of the Focus Titan that died last (8-20). Mirror both in section 5.2. |
| R16 | Major. Astra rated F09 Major, Opus rated K20 Minor. | F09, K20 | `downtime.yaml` `infirmary.each_day.steps`, fourth step (60); Chapter 7 line 288. Packet 3252 is right. | Copy `data/harm/healing.yaml` `each_day` step 4: an untreated Critical Injury whose rider sets `heals_untreated: false` does not drop. Add that a lethal one cannot heal (`healing_time.lethal_injuries`). |
| R17 | Major. Astra rated F10 Major, Opus rated K13 Minor. | F10, K13 | `data/gear/items.yaml`: `odm-gear.gear_dice_for` (60), `horse.gear_dice_for` (107), `horse.counts_as_not_had` (111 to 113); Chapter 4 lines 110, 295 to 296. Packet 1891, 1899, 2054 are right. | Add `leap-clear` to both lists and to the horse's mounted test ("For dodge, ride, and leap-clear"). Update Chapter 4's summaries. The lost-arm limits stand. |
| R18 | Major. Astra rated F11 Major, Opus rated K1 Minor. | F11, K1 | Chapter 2 line 563 (Skirmish entries, Shoot: "Without one it cannot be taken") | "with a loaded flintlock pistol or musket, or with a flare fired at a person (Chapter 7, section 7.4)". |
| R19 | Major. Astra rated F12 Major, Opus rated K3 Minor. | F12, K3 | Chapter 7 line 502; packet 3437 and quick reference 3714 | "with a Blade Set if the soldier has one; otherwise with no Gear Dice". |
| R20 | Major. Astra rated F13 Major, Opus rated K16 Minor. | F13, K16 | Chapter 3 line 136 (section 3.2, step 6: "each field the rider sets replaces") | Copy `data/harm/critical-injuries.yaml` `gaining` (92 to 96): a `time_limit` replaces the row's, `healing_days_multiplier` multiplies, `heals_untreated: false` stops healing while untreated, and `treat_injury` applies to every Treat Injury roll on it. |

### Minor

| Id | Severity | Sources | Files and locations | Fix |
|---|---|---|---|---|
| R21 | Minor (Opus only) | n4 | `titan-harm.yaml` `falling_titan.pinned`, `freeing`, `corpse_heat` (328 to 345, 389 to 395) | Decision D7. |
| R22 | Minor (Opus only). The triage adds Chapter 4 line 580, which neither review listed. | n1 | Chapter 5 lines 63, 463; Chapter 6 line 31; Chapter 4 line 580 (the Jam test note) | Rewrite each in the past tense, citing the final rerun. No `PROVISIONAL` left in `docs/rules/0*.md` or `data/`. |
| R23 | Minor (Opus only) | n2 | Chapter 5 lines 975 ("round 3 (70.0%, 0.40...)"), 1009 (69.4%, 5.58, 0.20); Chapter 6 line 773 (69.2%, called a probe figure in `data/titans/tuning.yaml` 398) | Label each as the probes' figure, or replace it with the rerun's (line 1009: 70.3%, 5.63, 0.17). |
| R24 | Minor (Opus only) | n3 | `data/engagement/titan-format.yaml` `stat_block.fields` and `standard_titan` (13 to 35; no `heave`); Chapter 6 lines 52 to 58; `CONTEXT.md` Pinned (379) and Heave (383) | Add `heave` to the stat block fields and to what a standard Titan takes from its Size Class. Add "or an Abnormal's own" to both glossary entries. |
| R25 | Minor. Opus rated it; Astra judged the data correct but did not check the chapter sentence. | K26a | Chapter 6 lines 260, 302 ("Everything in it is revealed at the table only by a Read"); `data/titans/index.yaml` 39 to 40 | Name Heave among the public values and limit the sentence to the four hidden values. |
| R26 | Minor (both) | K24, F15 | Chapter 5 lines 432 to 449; `data/engagement/behavior-procedure.yaml` 58 to 75 | Add the dead-Titan step, end the Call It in the decoy step, and announce the name, tier, and targets. |
| R27 | Minor (both) | K25, F16 | Chapter 5 line 401; `titan-format.yaml` 156 | Add "A mounted target is not affected." |
| R28 | Minor. Opus rated it; Astra confirmed the reading but did not check the sentence. | K26c | Chapter 5 line 86 ("as none of the Phase 1 ladders' rungs does at the start") | Say a Straggler victim at In Reach holds Attention from setup (packet 3817 has it). |
| R29 | Minor (both) | K23, F19 (part) | `positions.yaml` `placement.default` (90 to 91: "no Phase 1 rule does") | Say the Straggler and Overrun hazard rows do (`data/expedition/hazards.yaml`). |
| R30 | Minor. Opus rated it; Astra dismissed it as a measurement setup. | K27 | `data/engagement/round.yaml` `round_time` (210 to 222; 4 player characters and 2 Squadmates) | After D4, add the playtest configuration's timed rounds beside the default, so the timed paper test can run in the first playtest. |
| R31 | Minor (Opus only) | n5 | Chapter 3 line 720 ("Five triggers") | "Six triggers". |
| R32 | Minor (both) | K17, F14 | Chapter 3 lines 466 to 473 (aftermath rolls) | "When a Titan Engagement or a Skirmish ends". Add the Skirmish reading: every soldier who took part counts as holding the patient's Position (`data/harm/engagement-end.yaml` 79). |
| R33 | Minor (both) | K18, K34, F19 (part) | `health.yaml` `restoring.day-passes.when` (152 to 155); Chapter 1 line 155 | Point to Chapter 7: the Night Camp's day and Downtime's seven days. |
| R34 | Minor (Opus only) | n16 | `talents.yaml` Quick Refit (833 to 842), Rescue Ride (899 to 908), Sure Hands (754 to 766), Stay With the Column (1062 to 1076) | Decision D8. |
| R35 | Minor (both) | n9 (Chapter 2 and Talent notes), K6, K11, K12, F19 (part) | Chapter 2 lines 11, 129, 439, 509 (Sure Seat), 511 (Heave; Saw It Coming's reason), 592, 609, 651, 675; `squadmates.yaml` 67; `talents.yaml` 887 (Sure Seat description) | Replace each with a current pointer. Chapter 7 is written; Grip Breaker names Heave; `downtime-action` lowers Stress; `position-change` also covers Engaged and Apart; Sure Seat applies on a Hard Ride. Keep the XP, Train, Rank, and Chase deferrals. |
| R36 | Minor (Astra only) | F19 (part) | Chapter 4 lines 295 ("Ride is dormant until the Chase rules"), 495 (Maintain Gear); packet 2054 ("No playtest rule calls for a Ride roll") | Ride is the Hard Ride's Leg roll (section 7.1); Maintain Gear is a Downtime Action (section 7.2). |
| R37 | Minor (both). Astra's F20 lists Block as missing, but line 578 already lists it. | K2, F20 | Chapter 2 lines 549 to 582 (attribute lists and *Groups of entries*) | Add Heave and Leap Clear, Release, Downtime Action, and Squad Action to their groups and attribute lists. |
| R38 | Minor (both) | K10, F17 | `data/character/attributes.yaml` `used_by` (20, 25) | Strength gains `heave`; Agility gains `leap-clear` and `shoot`. |
| R39 | Minor (both) | K14, F18 | `data/gear/blade-sets.yaml` `unit` (11 to 15) | Say the set in the handles and each carried set keep their ratings, as `sheet-fields.yaml` records. |
| R40 | Minor (Opus only) | n10 | `data/character/specialties.yaml` `choose` and `grants` (12 to 18); Chapter 2 lines 462 to 466; `CONTEXT.md` Specialty (97); packet glossary 4272 | "At Graduation, or at a build's Specialty step". The swap and floor apply at Graduation only. |
| R41 | Minor (Opus only) | n11 | `data/character/action-catalog.yaml`: `death-roll` (690 to 701) has no `needs`; `persuade` requirements (801 to 805); the `kind` comment | Add `needs: "1"`; add the Parley outside a Skirmish; state the spending default the packet already prints. |
| R42 | Minor (Opus only) | n13 | `squadmates.yaml` `fewer_allowed.rule` (110 to 114); Chapter 2 line 710 | Add "at session zero" (8-13; packet 914 has it). |
| R43 | Minor (Opus only) | n14 | DECISIONS line 2439 (8-3); `attributes.yaml` `reported_squad_health_2` (126 to 137: a Medic, 4 soldiers); Chapter 2 line 774 ("with two helper Squadmates") | Make Chapter 2 describe the row the engine runs. Check whether `tools/sim/cases.py` adds the helpers; change the YAML only if it does, so the reported row does not move. The 8-3 erratum line goes to the decider. |
| R44 | Minor (Opus only) | n15 | Chapter 2 lines 519 to 532 (*What an entry states*) | Add rows for `option_of`, `notes`, `decided`, `adrs`. |
| R45 | Minor (Opus only) | n17 | `talents.yaml` Formation Drill (614 to 625); packet 919 to 920 or the Tactician list | After D4, note "no effect in the first playtest" beside the playtest configuration. |
| R46 | Minor. Opus rated it; Astra dismissed the Lookout Tree part. | n18, K9 | `talents.yaml` 177 to 180, 226, 232, 557, 728, 934 ("lead", "night camp"); Lookout Tree (491 on) forest names; Chapter 2 lines 882 to 900 (Catalog ids in player text) | Capitalize Lead and Night Camp. Write the Waypoint kinds as `data/expedition/route.yaml` prints them. The renderer prints entry names, not ids (package E). |
| R47 | Minor (Opus only) | n19 | `talents.yaml` Headlock (975 to 988), Put In a Word (707) | Headlock: only the held Foe surrenders and is out of the Skirmish. Put In a Word names `help`, since it changes Help. |
| R48 | Minor (Opus only) | n6 (rules part) | `CONTEXT.md` Reaction (180, "enemy"), Pinned (379, "the Titan's limb"), and definitions that use their own Avoid words (Squad Tactic, Pace, Bonus Dice, Call It, Body Part State); Chapter 1 lines 239, 278; Chapter 3 line 306; Chapter 5 line 707; `positions.yaml` ("dead Titan"); `talents.yaml` Ground Work (87), Cavalry Cut (280), Blade Discipline (386), Shoulder Charge (998) | Use the glossary terms: "a Titan or a Foe", "Body Part", "Heave", "Pinned", "Corpse", "decoying", "Blade Sets", "Grabbed". |
| R49 | Minor (Opus only) | n7 | `CONTEXT.md` Severity (328 to 330); Chapter 1 line 260 gives a soldier's attack on a person a Severity | "The successes an attack roll scored: a Titan's, a Foe's, or a soldier's against a Foe." |
| R50 | Minor (both) | K28, K29, K33, F21 | `CONTEXT.md` Grabbed (304 to 305, "Held"), Camp Relief (511 to 512), Ambush (545 to 546); no **Guard** headword | Grabbed: "gripped in a Titan's hand". Camp Relief: add "and the camp did not meet hunger". Ambush: add the Foes' ambush (2 more Attack Dice) and no Guard, as section 7.4 states. Add **Guard**. |
| R51 | Minor (Opus only) | n24 | `CONTEXT.md` Standard Issue (444), Rally, Body Part, Call It; packet glossary 4358, 4294, 4315, 4348 | Correct `CONTEXT.md` first: a Medic's or Engineer's kit; Rally also clears a pending Fear result and works outside a fight; eyes, arms, and legs; Call It's exclusions. Then mirror to the packet. |
| R52 | Minor (both) | K22, F22 | Chapter 7 lines 88, 89, 97, 152, 208, 456, 480, 498, and like uses | Capitalize Lead, Depot, Night Camp, Ambush, Shot, and Net Successes in prose; keep machine ids lowercase. |
| R53 | Minor (Opus only) | n8 | `data/skirmish/foes.yaml` reported figures (74 to 91; only `squad-against-a-patrol` carries `final_rerun`); Chapter 7 line 663 | Add `final_rerun` to `bandit-night-ambush` and `rookie-against-a-trooper`, from the report's Skirmish rows. |
| R54 | Minor (both) | K38, F23 | `tools/render/render.py` placeholder cells (lines 330, 435, 502, 513, 516, 532 to 538, 547); rendered blocks in Chapter 2 (237), Chapter 3 (70), Chapter 5 (19) | Print "none", or "no" in a yes-or-no column, for an empty cell, then regenerate. Never hand-edit rendered cells. |
| R55 | Minor (Opus only) | n6 (packet part), n23 | Packet 361, 364, 373, 387 ("enemy"); 1202 ("a dead Titan's wrist"); 3649 ("a pinning limb"); "prosthetic" on 15 lines; "heave count" in lowercase on 15 lines; "next behavior" 2647, 2783, 4237; "bonus dice" 4348; 3678 ("frees a held soldier") | Use glossary terms and capitals; one form, "Heave count"; "frees a Grabbed soldier". |
| R56 | Minor (Opus only) | n12 | Packet 755 ("except Push and Cover") and 1026 | Use line 1026's list in both places and add "never Pushes". |
| R57 | Minor (Opus only; an estimate) | n20 | Packet print stylesheet (88 on; no `@page` rule); quick reference 3600 to 3735 | Add `@page { margin: 10mm }`, then verify as section 6 says. Trim the Expeditions and Skirmish boxes only if it still spills. |
| R58 | Minor (Opus only) | n21 | Packet line 44 (`.gm-band`, white on `--gm`); no `print-color-adjust` | In print: no background, `color: var(--gm)`, and a border. |
| R59 | Minor (Opus only) | n22 | Packet 1121, 958, 981, 3019, 3274, 4364, 4394, 3898 to 3900, 3920, 3923, 4002, 1582, 4322, 913, 4346, 3389, 3440, 3581 | Reword each in table voice ("check" for "evaluate the ladder"; "setup table"). Move the Held-soldier rules into one sentence tagged for later Foes. |
| R60 | Minor. Opus rated it; Astra dismissed it as coordination only. | K40 | `docs/rules/PROGRESS.md` (no WP-0, WP-C, WP-A, WP-D, WP-B rows) | Add or close those rows. Housekeeping only; outside the rules hash. |

### Dismissed

| Item | Reviews | Reason |
|---|---|---|
| K4, can a Squadmate Block | Opus: open Minor. Astra: dismissed. | `squadmates.yaml` `action_list.reactions: [dodge]` is a closed list, and "takes part like a player character" does not widen it. The rule is defined, and there are no Squadmates in the playtest. |
| K5, Fly has no `needs` | Both dismissed | The calling step gives the need. |
| K15, the horse left as a decoy | Both dismissed | `data/gear/horses.yaml` and `positions.yaml` `horses.left_as_decoy` carry it. |
| K19, both-arms strike penalty with a prosthetic | Both: reading confirmed | No defect. |
| K26b, Overrun's clocks each roll a Size Class | Both: reading confirmed | No defect. |
| K30, later-phase terms in the packet glossary | Both dismissed | Grouped and marked as later rules. |
| K32, 8 rounds against the clock's segments | Both dismissed | The limit is the clock's length; 8 is the interim value. |
| K35, `fight6.py` fixed need | Both dismissed | The known refactor, outside the rulebook. |
| K36, Heave rating missing from Chapter 6 | Both: fixed | Every stat block prints it. |
| K37, low Skirmish lethality | Both: superseded | 8-33 retuned the patrol. |
| K39, Talent names against Avoid lists | Opus: Wide Awareness Minor if read strictly. Astra: dismissed. | An Avoid word bars a substitute for a term. "Awareness" in a Talent name does not stand in for Watch. |
| S1 to S4, stale text for other packages | Both: fixed | No such wording remains. |

---

## 2. Needs a decision

These go to the decider as one batch. Each recommendation reads the retreat round, a grade, a pin, or a table, so none rests on GM choice (ADR-0003). Section 5 gives the simulator impact of each option.

### D1 (R01; decision batch 8, item 8-35): an Expedition with every living soldier Down

**Question.** A Steady Leg roll and the camp roll need "a soldier who is not Down". When every living soldier is Down, the Expedition cannot go on. Only the Hard Ride has a rule (8-27 (e)).

**Options.**
1. **The roll fails.** Extend 8-27 (e) to every Leg roll and to the camp roll: with no soldier who can make it, it fails. ADR-0009 still brings the Squad to the Waypoint, and `expedition.mounted` already puts Down soldiers in the wagon. A failed Leg spends 2 rations and adds 1 to the hazard. A failed camp gives no Camp Relief and adds 1 to the night hazard. The care window makes no rolls, `day` Death Rolls fall, and healing counts down.
2. **The Expedition is lost.** A Squad that starts a Leg or a camp with every living soldier Down dies there.
3. **The formation carries them home.** The Squad is taken to the gate, the Expedition ends, and Downtime begins.

**Recommended: option 1.** It is one clause with 8-27 (e)'s shape, and it keeps ADR-0009's guarantee. It is grim without a new death rule. A Squad that cannot stand pays double rations, faces worse hazards, and gets no Camp Relief. If a hazard row then starts a Titan Engagement, the existing tests end it at once with the Focus Titan alive, and `left_behind` kills everyone. Option 2 contradicts 8-21, 8-34, and the Skirmish's no-soldier-standing ending, which spare Down soldiers when nothing kills them. Option 3 invents a rescue ADR-0009 does not have, and makes losing a fight a free trip home.

### D2 (R03; decision batch 8, item 8-36): a Focus Titan that enters during the run-on

**Question.** 8-32 limits the stays beside a comrade only while no Focus Titan is alive. A Background Titan that enters during the run-on places everyone at Distant. It cannot die in a retreat, and its Distant entries only give Stress or knock loose. The triage checked this on all three standard tables: Small Lurch Closer, Medium Fixed Grin, Large Heavy Tread, and Thrash. Background Titans are always standard (`engagement-setup.yaml`). Soldiers can then stay and treat a limb-pinned comrade with no end.

**Options.**
1. **Limit per pin.** A stay (option 3 or 4) for a comrade Pinned under a corpse is limited in every retreat, counted as 8-32 counts it, whether or not a Focus Titan is alive. Stays for a Down or Grabbed comrade keep 8-32's reading.
2. **Limit per reach.** The limit binds while no living Focus Titan has a soldier at any Position other than Distant.
3. **Fewer staying actions.** Treat Injury no longer allows a stay beside a Pinned comrade; only Heave and the strike on the pinning Body Part do.

**Recommended: option 1**, applied in the same edit as R04. 8-32's reason was that a corpse is no clock. A Titan that never reaches the soldiers beside the corpse is no clock either, and the pin is what keeps the run-on open. The test reads the pin and the tracker's retreat round, so it adds no tracking. It moves no measured value: with one Focus Titan, a pin under a corpse exists only after that Titan dies, where option 1 equals today's limit, so the Medium band of 8-31 stands. Option 2 reads every soldier against every living Titan each round. Option 3 leaves 8-32's own loop open, since a strike whose successes are all cancelled still allows the stay. Grim enough: the Squad heaves as long as the retreat clock ran, then walks out under a new Titan's grin.

### D3 (R05; decision batch 8, item 8-37): a retreat from a Titan Engagement the Night table starts

**Options.**
1. **Stay.** The retreat ends the Titan Engagement, and the camp goes on at step 5 at the same Waypoint.
2. **Fall back overnight.** The Squad falls back to the Waypoint the day's last Leg started from. The camp goes on at step 5 there, with no new camp roll, ration, or night hazard. The next day's first Leg rides that Leg again, counted among that day's Legs (8-27 (b)).
3. **Fall back and camp again.** The Squad makes a new camp roll, spends a new ration, and rolls a new night hazard at the previous Waypoint.

**Recommended: option 2.** ADR-0009 says a Squad that retreats from a Titan Engagement falls back to the previous Waypoint, and its batch 7 amendment says the Leg is ridden again. Option 2 applies both without riding at night. The ground the day won is lost, and the rations are already spent. Option 1 breaks ADR-0009's fall-back. Option 3 charges one night twice and can chain night Titan Engagements with no Leg between them.

### D4 (R06; decision batch 8, item 8-38): Recruit under the playtest configuration

**Options.**
1. **A data row.** `squadmates.yaml` gains `playtest_configuration: {player_characters: 4, squadmates: 0}`, tagged Playtest rule. While it holds, Recruit brings no Squadmate and is not offered, so the Squad Action is Honoring the Fallen. Squadmates stay the default rule (7-11).
2. **A packet note.** The configuration note and the Squad Action table say Recruit is not taken in the first playtest.
3. **Leave Recruit live.** Only the first Expedition runs 4 player characters alone.

**Recommended: option 1.** Owner item 7 ("A now") is read by rules at the table: the Straggler victims, the timed rounds (R30), and Formation Drill (R45). Under ADR-0003 and ADR-0012 it belongs in data. Option 2 leaves the chapter and the YAML contradicting the packet, and the packet must not change a rule. Option 3 abandons the owner's configuration after the first Downtime. Promotion stays as 7-11 wrote it: a dead player character is replaced by a new character. During the playtest, no new faces fill the ranks.

### D5 (R07; decision batch 8, item 8-39): once-per limits inside a nested procedure

**Options.**
1. **Its own use.** A Titan Engagement or Skirmish that begins inside a Leg or a Night Camp is its own procedure, with its own use. A use in it does not spend the outer one, and the outer one does not spend it.
2. **One shared use.** A single use covers the Leg or Night Camp and everything nested inside it.

**Recommended: option 1.** The simulator measured every once-per-Titan-Engagement Talent with a fresh use in each fight (report section 7.1). Option 1 keeps the fight as measured (ADR-0014). Under option 2, a Talent spent on a Leg roll would be missing from the fight that follows, a case nothing measured. Counting per procedure is what `limit_terms` already says. The fight itself is unchanged, so the game is no less grim.

### D6 (R14; decision batch 8, item 8-40): the order of one event's Fear Rolls

**Options.**
1. **Snapshot.** For one event, find every rolling soldier's total from their Stress and Resolve as they stood when the event resolved. Then apply every result, Drive decisions first. No result of this event changes another soldier's total for it. "The order changes nothing" stays.
2. **A fixed order.** Resolve the rolls in the Squad sheet's numbered order, each result applying before the next roll. Withdraw "the order changes nothing".
3. **Contagion last.** Every effect applies at once, except `stress-gain-nearby`, which waits until every Fear Roll of the event has resolved, as Grief already does.

**Recommended: option 1.** It keeps the rule the YAML and packet already print ("everyone who rolls for one event can roll together"), so a Grab round stays quick. It reads values fixed at one moment. Option 2 adds a sheet order to every event with several witnesses. Option 3 leaves Scars, and Talents that read a comrade's Resolve (Unshaken Command), dependent on order. Contagion still lands, and it counts on the next event. The simulator currently applies contagion at once, in witness order, so option 1 needs a small engine change (section 5).

### D7 (R21; decision batch 8, item 8-41): a pinned limb lost to corpse heat

**Options.**
1. **Still pinned.** A soldier whose pinned arm or leg is lost at the 13-or-more row stays limb-pinned. The freeing list stays closed (8-9, 8-17).
2. **Freed by the loss.** Losing the pinned limb ends the pin, and the soldier holds In Reach relative to the corpse.
3. **Cap the heat.** Corpse heat's worsening stops at the pin's own Critical Injury row.

**Recommended: option 1**, and add "limbs lost to corpse heat" to the packet's feedback page beside pins and Burn Critical Injuries. It changes no decided list and no simulator counter, and it is the grim reading: the arm burns away and the body still holds the stump. The playtest count then tells the owner whether it is too harsh; option 3 would decide that in advance. Option 2 creates a freeing route the simulator cannot count (lost limbs are unmeasured, 8-13).

### D8 (R34; decision batch 8, item 8-42): Talents without guardrail 8's default limit

**Options.**
1. **The default on all four.** Quick Refit, Rescue Ride, and Sure Hands become once per Titan Engagement; Stay With the Column becomes once per Leg.
2. **No limit on all four**, each with a design note giving the exception and why.
3. **The default on the three that live inside one procedure.** Quick Refit and Rescue Ride once per Titan Engagement, and Stay With the Column once per Leg. Sure Hands keeps no limit, with a design note.

**Recommended: option 3.** Guardrail 8 is a default. The three change an action's cost or a roll count inside one procedure, so the default fits them. Sure Hands also reaches aftermath rolls and care windows. There, `once_per_titan_engagement` would forbid it outright, which is a bigger change than a limit, and its second Push already costs Stress Dice. None of the four is modelled in `tools/sim/`.

**Also for the decider, with no ruling (recorded as an erratum line under item 8-3):** R43's erratum line for 8-3 (the Health 2 Squad described as "a Tactician or Leader shape, key attribute Wits or Empathy").

---

## 3. Disputed

**None escalated to Fable.** No Critical or Major finding has evidence from one review that contradicts the other, and no Critical or Major finding fell apart when the triage checked its sources. The items closest to a dispute, and why each stays out:

| Finding | Apparent conflict | Triage check |
|---|---|---|
| R02 | Astra marked queue item 27 resolved by 8-34; Opus says 8-34 was never applied. | Astra's row covers the ruling only. `engagement-flow.yaml` lines 75 and 101, and Chapter 5 lines 881 and 889, still print `PROVISIONAL (OQ-165)`. |
| R08 | Opus rates it Major; Astra could not verify it. | No contradiction. Guardrail 4 reads "Every Talent", Chapter 2 line 509 already says the eight need a check, and neither the report nor the simulator source names them. |
| R03 | 8-32 assumes a living Titan is its own clock. | Every standard table's Distant entries give only Stress or knock loose, and Background Titans are always standard. The finding holds. Amending 8-32 is a decision (D2, 8-36), not a dispute. |
| R01 | Critical from one review only. | The gap is real and rare. Severity is not a dispute, so it stays Critical. |
| R37 | Astra lists Block as missing from *Groups of entries*. | Line 578 lists Block. Corrected in the row; Minor. |
| R16 to R20 | Major (Astra) against Minor (Opus). | Severity only. |

---

## 4. Fix packages

Five packages by file area, then the packet. Order:

1. **Decider batch (Fable):** D1 to D8 and R43's erratum. Runs in parallel with step 3.
2. **E, the renderer:** first and alone, because regenerating touches Chapters 2, 3, and 5. It should take minutes.
3. **A, B, C, D in parallel:** every non-decision fix.
4. **A, B, C, D second wave:** each applies its decision items once the batch lands. Where a decision shares a file with a mechanical fix, the mechanical fix goes first (R04 before D2).
5. **Simulator step:** section 5.
6. **P, the packet:** last.

Lock rule (HANDOFF): an empty `docs/rules/.lock-<file>` that the waiting agent loops on. Any package that runs `render.py write` also holds `docs/rules/.lock-render`. Checks in every package: `uv run --with pyyaml python tools/render/render.py check`, the HANDOFF YAML load command, a search that finds no U+2014 character in edited files, and no `PROVISIONAL` marker the package did not mean to leave.

A finding that spans packages is counted in each package it touches.

### E: renderer (2 findings)

- **Findings:** R54; R46's renderer part (Catalog ids printed as entry names in Chapter 2's player text).
- **Files:** `tools/render/render.py`; the regenerated blocks in Chapters 2, 3, and 5.
- **Shared files and locks:** runs before A to D, so none. Afterwards, `.lock-render` for any `write`.
- **Checks:** `render.py write`, then `render.py check`; `tools/probes/chapter-06/render.py check`; no U+2014 in any `docs/rules/0*.md`.

### A: harm and mind (8 findings, then D6)

- **Findings:** R11, R12, R13, R20, R31, R32, R33; R48's Chapter 1 and 3 parts. After the batch: R14 (D6, 8-40).
- **Files:** `data/harm/death-rolls.yaml`, `treat-injury.yaml`, `health.yaml`; after D6, `data/mind/fear-rolls.yaml` and `data/harm/effect-types.yaml`; `docs/rules/01-core-rules.md`, `03-harm-and-mind.md`.
- **Shared files and locks:** `.lock-render` when writing the Chapter 3 blocks. D6's engine change belongs to the simulator step, not to A.
- **Checks:** render check and YAML load. Every "outside a Titan Engagement" clause in `death-rolls.yaml` and `treat-injury.yaml` names the Skirmish where it should. The steam table and the fall both reach the zero-damage step. After D6, `limits.timing` and `stress-gain-nearby` state one order.

### B: Titan Engagement (12 findings, then D2, D7, R30)

- **Findings:** R02, R04, R15, R23, R25, R26, R27, R28, R29; R22's Chapter 5 and 6 parts; R24's `titan-format.yaml` and Chapter 6 parts; R48's Chapter 5 and `positions.yaml` parts. After the batch: R03 (D2, 8-36), R21 (D7, 8-41), R30 (after D4).
- **Files:** `data/engagement/engagement-flow.yaml`, `background-titans.yaml`, `positions.yaml`, `titan-format.yaml`, `round.yaml`; `titan-harm.yaml` if D7's wording needs it; `docs/rules/05-titan-engagement.md`, `06-standard-titans.md`; `tools/sim/report.py` (R02's one citation).
- **Shared files and locks:** `tools/sim/report.py` with the simulator step, which also edits its snapshot notes. `.lock-render` for the Chapter 5 blocks.
- **Checks:** render check and YAML load; `tools/probes/chapter-06/render.py check`; `run6.py check`, since the stat block fields gain `heave`. `always_ends` cites 8-32 and 8-34 and no OQ-165 marker. With C done, `grep -rn PROVISIONAL docs/rules/0*.md data/` finds nothing.

### C: character, gear, and glossary (22 findings, then D4, D5, D8, R45)

- **Findings:** R08 (Chapter 2 notes), R10 (`CONTEXT.md`), R17, R18, R35, R37, R38, R39, R40, R41, R42, R43 (Chapter 2 and YAML), R44, R47, R49, R50, R51 (`CONTEXT.md`); R22's Chapter 4 part; R24's `CONTEXT.md` part; R36's Chapter 4 part; R46's YAML part; R48's `CONTEXT.md` and `talents.yaml` parts. After the batch: R06 (D4, 8-38, `squadmates.yaml` and section 2.10), R07 (D5, 8-39, `limit_terms`), R34 (D8, 8-42), R45 (after D4).
- **Files:** `data/character/talents.yaml`, `attributes.yaml`, `specialties.yaml`, `squadmates.yaml`, `action-catalog.yaml`; `data/gear/items.yaml`, `blade-sets.yaml`; `docs/rules/02-character-creation.md`, `04-gear.md`; `CONTEXT.md`.
- **Shared files and locks:** `talents.yaml` and `squadmates.yaml` in the second wave: D's `legs.yaml`, `skirmish.yaml`, and Chapter 7 cite `limit_terms` and the configuration row, so C writes first and D cites the landed wording. `.lock-render` for the Chapter 2 blocks. DECISIONS is the decider's file.
- **Checks:** render check and YAML load. A Talent count: 83 Talents, 33 dice and 50 rule; nine lists of 8 plus a general list of 12; every `names` id in the Catalog; no dice Talent names `leap-clear`. `grep -rn "not yet written" docs/rules/0*.md data/` leaves only the XP, Train, Rank, and Chase deferrals. Edited `CONTEXT.md` definitions use none of their own Avoid words.

### D: Chapter 7 (4 findings, then D1, D3, D4, D5)

- **Findings:** R16, R19, R52, R53. After the batch: R01 (D1, 8-35), R05 (D3, 8-37), R06 (D4, 8-38, `downtime.yaml` and Chapter 7), R07 (D5, 8-39, `legs.yaml`, `skirmish.yaml`, and Chapter 7).
- **Files:** `data/expedition/legs.yaml`; `hazards.yaml` if D3 needs row text; `data/campaign/downtime.yaml`; `data/skirmish/skirmish.yaml`, `foes.yaml`; `docs/rules/07-playtest-rules.md`.
- **Shared files and locks:** none with A or B. With C, only the second-wave wording noted there.
- **Checks:** render check and YAML load. The Leg Hazard and Night tables stay open-ended. Both rolls in `legs.yaml` still give who, entry, needs, help, push, and retry. A hand review of lowercase lead, depot, night camp, ambush, shot, and net successes in Chapter 7 prose. `foes.yaml` changes only its reported-figure records.

### P: the packet (18 findings, then 8 decision items)

- **Findings:** R02, R08 (tags), R09, R10, R11, R12, R13, R19, R36 (line 2054), R40, R50, R51, R55, R56, R57, R58, R59, R60. After the batch: R01, R03, R05, R06, R07, R14, R21 (the feedback page line), R45. Also re-copy every `CONTEXT.md` entry that C changed (R24, R48, R49) into the glossary.
- **Files:** `docs/playtest/wings-of-freedom-playtest-packet.html`; `docs/rules/PROGRESS.md` (R60).
- **Shared files and locks:** none. It starts only after A to E, the batch's second wave, and the simulator step.
- **Checks:** HANDOFF's packet checks (every in-page link resolves, no em dashes, banned words 0 times, every d6 table complete); where a chapter and the YAML differ, the packet follows the YAML; the print checks in section 6. Then read the existing Artifact and republish with its `url`.

---

## 5. Simulator impact

The evidence comes from reading `tools/sim/`. No run was made.

| Finding | What the fix touches in the simulator | Why |
|---|---|---|
| R14 (D6, 8-40) | **Option 1:** Titan targets and bands, through Fear Rolls with two or more rolling soldiers: the Medium deaths band (0.0754 against 0.08), the first-Titan-Engagement row, the Abnormal's bar, and the Critical Injuries bands. **Not the Grab cells:** each has one comrade witness or none. **Option 2 in the engine's order:** nothing. | `engine.py` `fear()` (lines 767 to 771) adds contagion at once, before the next witness rolls. A snapshot can only lower later witnesses' totals, so deaths can only fall or hold. |
| R03 (D2, 8-36) | Options 1 and 2: nothing. Option 3: the reported run-on counters. | The simulator has one Focus Titan and no Background Titans (report: "Not measured: Background Titans"). |
| R21 (D7, 8-41) | Option 1: nothing. Options 2 and 3: the reported pin counters (pins, Burn Critical Injuries per pin, the freed split, corpse-heat deaths); option 3 also the Critical Injuries bands. | The engine models no lost limbs and keeps a pinned soldier pinned. |
| R43 | Nothing if text only. The reported Health 2 row, if the YAML's Squad changes. | `rules.py` 855 reads `reported_squad_health_2`. |
| R53 | Nothing measured, but `foes.yaml` is read by the Skirmish probe. | A snapshot note only. |
| R11 | Nothing: the Skirmish probe is unchanged. | `engine.death_rolls` keeps a `turn` limit on 1 success and never converts it to `day` during a fight. |
| R12 | Nothing. | `families.skirmish_trial` holds no care window during the fight. |
| R13 | Nothing. | `dice.take_damage` returns no harm for damage of 0 or less. |
| R17 | Nothing. | `engine.py` 975 sets Leap Clear's Gear Dice from the mount and ODM state, not from `items.yaml`. |
| R02 | Nothing. | The engine models no lost limbs, and `report.py` is a render file. |
| R07 (D5, 8-39), R34 (D8, 8-42) | Nothing. | There are no Legs or camps in the simulator, and none of the four Talents is in `tools/sim/`. |
| R01, R05 (D1, 8-35; D3, 8-37), R06 (D4, 8-38) | Nothing. | No Expedition or Downtime case. |
| All others: R04, R08, R09, R10, R15, R16, R18, R19, R20, R22 to R33, R35 to R42, R44 to R52, R54 to R60 | Nothing. | Text, glossary, the renderer, packet, or data the engine does not read in a measured path. |

**Recommendation: (b), targeted in-memory checks plus snapshot notes.**

- **No full rerun.** No mechanical fix changes a value the engine reads on a measured path, so a 2-hour run would reproduce the committed figures within sampling.
- **If D6 takes option 1:** after the engine change, run in memory, on the committed seeds and case sizes, against the committed figures:
  - the Medium reference start (deaths through the end and during the fight, and Critical Injuries);
  - the first-Titan-Engagement row;
  - the Abnormal's bar in both orders.
- **If D2 or D7 takes a non-recommended option:** add the run-on or pin counter rows it names.
- **Snapshot notes.** The snapshot hashes every file under `docs/rules`, `docs/adr`, and `data`, so every fixed file needs a `report.SNAPSHOT_CHANGE_NOTES` entry. It should say "text only; no value the engine reads", or give the in-memory check's figures. With those, `run.py --report` renders without `--stale-ok`. An engine change for D6 is also named in the report's engine changes, with its figures.
- **Fall back to (a)** if a checked row moves beyond sampling or the Medium band reads past 0.08.
- **Plan change.** The owner accepted (b). `IMPLEMENTATION-PLAN.md` step 8 is amended (decision batch 8, 8-40).

---

## 6. Print checks before republishing

The quick reference's page fit and the phone-width result are estimates from the CSS, because headless Chrome timed out. A real print preview must verify the following. Use Chrome and one other engine, Letter and A4 portrait, background graphics both off (the default) and on. Test with Google Fonts loaded and with them blocked, since "Arial Narrow" is missing on many systems and Georgia is wider than Source Serif 4.

1. **The quick reference fits one page.** `#quickref` (packet 3600 to 3735) sits on exactly one page, at the browser's default margins and at the `@page` margin R57 adds. The Fear Roll and Stress Response tables in `.qr-tables` stay on that page, the three-column `.qr-grid` is not clipped, and no table row splits.
2. **The GM band is visible.** After R58, `.gm-band` prints as visible text with backgrounds off, so the players' part clearly ends there.
3. **Page breaks fall where the brief says.** Breaks come before each `.chapter`, `#quickref`, `.gm-band`, `.titan`, `#glossary`, and `#feedback`, after `#needs`, and between sheets. No blank page appears where two break-before rules meet, such as a GM band at the top of a section or a Titan first in the GM part.
4. **Wide tables fit.** Print sets `.table-wrap{overflow:visible}`. The Critical Injury tables with their name columns, the Behavior Tables with Attack Dice, the Talent reference, and the Requisition list must not clip at the right edge of A4.
5. **No near-empty pages.** `break-inside: avoid` on boxes, examples, stat blocks, and rows does not leave a near-empty page before a long stat block.
6. **Dark mode prints light.** Printing from dark mode gives the light print palette, because the print block overrides `:root[data-theme="dark"]`.
7. **Sheets print cleanly.** Each sheet prints on its own page, with rows tall enough to write in.

Phone width, checked in the published Artifact (its wrapper adds a reset) at 375 and 400 px, in light and dark:

1. **No sideways page scroll.** Every table scrolls inside its wrapper, including the widest: Critical Injuries, Behavior Tables, the Talent reference, and the Fear table with its text column.
2. **Stat blocks stack.** Stat blocks drop to one column below 480 px.
3. **The quick reference stacks on screen.** Its three columns are print-only; its tables stay readable.
4. **Long text wraps.** Long glossary headwords and the GM band wrap cleanly.
5. **Links land on their targets.** In-page links land on the heading they point to.
