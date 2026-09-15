# Wings of Freedom, Chapters 1 to 6: final full review, round 2 (Fable)

**Scope.** The Phase 1 rulebook after decision batch 5: `docs/rules/01-core-rules.md` to `06-standard-titans.md`, every YAML file under `data/`, `CONTEXT.md`, ADR-0001 to ADR-0015, `docs/rules/DECISIONS-2026-09-14.md` (Batch 5, 5-1 to 5-14), OQ-112 to OQ-128, both round 1 reviews, the renderer checks, and `tools/probes/batch-5/`. The simulator report in `docs/reviews/simulator-report.md` is still the pre-batch-5 run (rules hash `cf5de67236fa50b4`, "no kill within 12 rounds"); the batch 5 rerun was in progress during this review and was not read. Odds quoted below come from `tools/probes/batch-5/retreat_b5_bar.out` and from my own simulation in the scratchpad (`fable_r2_nape.py`).

**Checks run.** `uv run --with pyyaml python tools/render/render.py check`: every rendered block matches the YAML (32 blocks in 4 chapters). `tools/probes/chapter-06/render.py check`: passes. Both round 1 YAML truncation findings are closed by the renderer's `expect_keys` check.

## Verdict

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| 1 Core Rules | 0 | 0 | 0 |
| 2 Character Creation | 0 | 0 | 1 |
| 3 Harm and Mind | 0 | 1 | 1 |
| 4 Gear | 0 | 0 | 1 |
| 5 Titan Engagement | 1 | 0 | 1 |
| 6 Standard Titans | 0 | 0 | 0 |
| **Total** | **1** | **1** | **4** |

Every round 1 Critical and Major is Resolved or logged (section 6). The one Critical below is a leftover of Astra's round 1 C2: batch 5 closed the last cut at Wooded, Sparse, and Open, but the forced move's "shortest chain toward Distant" still runs through Blind Spot on two of the six Anchor Ratings. The Major is a gap the new interim day opened. Nothing else found rises above wording. The rulebook is ready for a first playtest once the Critical is fixed; the Major can be fixed in one sentence at the same time.

## Findings, most severe first

### Critical 1. Under a retreat, the forced move can end at Blind Spot at Giant Forest and Urban, so the last cut ADR-0010 says the retreat closes is still open on two Anchor Ratings

**Location.** Chapter 5, section 5.10 *The retreat*, forced move option 1 ("A step along a shortest chain of steps toward Distant"); `data/engagement/background-titans.yaml`, `retreat.effects.moves`, option 1 ("one step along a shortest chain of steps their move can make from their Position to distant"); `data/engagement/anchor-ratings.yaml`, `giant-forest` and `urban` step rows; ADR-0010, the batch 5 paragraph; Chapter 5 section 5.6 design note on the Feint and the OQ-87 design note in 5.10.

**Problem.** ADR-0010 (batch 5) states: "a soldier at Blind Spot when the retreat starts steps to In Reach before acting, and no card order gives a last cut." Section 5.10's design note repeats it: "no option lets them stay". Both are true at Open, Sparse, and Wooded, where the only shortest chain from On Body or Blind Spot to Distant passes through In Reach. They are false at Giant Forest and Urban. Both ratings have a Distant to Blind Spot step, so from On Body there are two shortest chains of two steps each: On Body, In Reach, Distant and On Body, Blind Spot, Distant. Option 1 lets the soldier pick either, so a soldier at On Body when the retreat starts may make their forced move to Blind Spot and then take their unrestricted action there (`retreat.effects.actions`: "Actions are not limited by the retreat"). A Nape strike at Blind Spot is legal if the soldier does not hold the Titan's Attention, which is exactly the decoy state the ADR describes. The Feint row in `attention.yaml` ("every move in it is forced toward Distant") and the OQ-87 note rest on a property the step rows do not give. The interim setup table deals Urban on a 5 and Giant Forest on a 6, so one Titan Engagement in three is on a rating where the retreat does not close the cut. A second, narrower path exists through option 3: a step that lowers the steps to a Down comrade may end at Blind Spot when a Down comrade lies there (a soldier on foot beside a grounded Titan who goes Down without a fall), and the same unrestricted action follows.

This is an unlogged contradiction between the chapter and an ADR, which the brief ranks Critical. Its play impact is a single extra strike chance per soldier at On Body, not an unresolvable situation, so a decider who reads the ADR's sentence as a description of Wooded rather than a promise for every rating may downgrade it; the fix is one line either way.

**Scenario.** Giant Forest, Medium Titan, round 8. Mila is at On Body, Jonas's flare holds the Titan's Attention with one card of the hold left. The retreat clock fills at the end of the round. Round 9, Mila's card comes before the Titan's. Her forced move must be one step along a shortest chain to Distant; she names On Body, Blind Spot, Distant and flies to Blind Spot. Her action is not limited, she does not hold Attention, and her ODM Gear works, so she makes a Nape strike: Strength 4 + Clean Cut 1 + Blade Set 1 + 1 Stress Die, Push allowed, needing 4. In my simulation that cut kills 12.3% of the time with no Openings, 25.3% with two, and 39.6% with four (Small Titan: 32.8%, 49.5%, 63.0%). The table then asks whether this is the "last cut" the rule says cannot happen, and the text gives two answers: option 1 as written allows it; the ADR and both design notes say it cannot happen.

**Fix options.**
1. In `retreat.effects.moves` option 1 and section 5.10, add: "A forced move never ends at Blind Spot; where more than one shortest chain exists, take one that does not pass through Blind Spot." Then amend ADR-0010's sentence to "steps toward In Reach or Distant" and leave Giant Forest's Distant to Blind Spot step for the approach only. Cheapest, and keeps the ADR's promise on every rating.
2. Keep the move rule and add to `retreat.effects.actions`: "No Nape strike is made during a retreat." Simpler to remember, but it also removes the cut a soldier could make after option 3 or 4 beside a Grabbed comrade, so check Hook and Cut and Clear the Hand against it.
3. Log it as an open question and amend ADR-0010 to say the retreat closes the cut at Open, Sparse, and Wooded only. Least work, but it leaves a rating-dependent exploit the simulator does not model (the model runs at Wooded), so the retreat rows in `tuning.yaml` would no longer describe Giant Forest fights.

### Major 1. The interim day has no care-window scope and no Field Repair rule, so every session start needs a reading

**Location.** Chapter 3, section 3.5 *Care windows* ("Each time a day passes ... Its scope is every soldier in the Squad on the Expedition during which the day passes. For a day that passes in Downtime it is every soldier in the Squad"); `data/harm/treat-injury.yaml`, `care_windows`, `day`, `scope`; Chapter 3, section 3.6 and `data/harm/healing.yaml`, `day_passes.interim` ("each_day runs as written"); Chapter 4, section 4.8 and `data/gear/field-repair.yaml`, `outside_titan_engagement.when` ("Only in a care window held when a Titan Engagement ends, or when a day passes during an Expedition ... Never in a care window held when a day passes in Downtime").

**Problem.** Batch 5 (5-2, OQ-120) makes one day pass at the start of each session and says `each_day` runs as written. Its first step holds the `day` care window, whose scope is defined only for a day on an Expedition and a day in Downtime. The interim day is neither: no Expedition rules exist and the interim day is not called Downtime. So the window has no scope, and scope restricts patients, rollers, helpers, and Coverers. Field Repair's outside-fight rule has the same two branches and no third, so whether a worn or Jammed harness can be repaired on the interim day is undefined. The obvious reading (every soldier in the Squad; Field Repair as on an Expedition day, since the interim day stands in for the night camps of ADR-0009) is not written, and ADR-0003 requires it to be. This arises at every session start, so it is Major rather than Minor.

**Scenario.** Session 2 opens. Oskar holds a treated arm injury with 9 healing days left, Ilse holds an untreated non-lethal leg injury, and Hale's ODM Gear is at 1/2 after Push wear (kept by the interim issue, which replaces only ODM Gear rated below the Funding row). The GM opens the interim day's care window and asks who is in its scope. Section 3.5 gives an Expedition answer and a Downtime answer; the Squad is on neither. Hale then asks to Field Repair the harness before the interim issue; section 4.8 allows it "when a day passes during an Expedition" and forbids it "when a day passes in Downtime", and says nothing about this day. The table picks one reading for both; the rules should have.

**Fix options.**
1. In `treat-injury.yaml` `care_windows.day.scope` and section 3.5, add: "For the interim day (Chapter 3, section 3.6), every soldier in the Squad." In `field-repair.yaml` `outside_titan_engagement.when` and section 4.8, add "or on the interim day" to the allowed list, with the reason that the interim day stands in for ADR-0009's night camps and the interim issue does not restore kept gear.
2. Same scope sentence, but forbid Field Repair on the interim day and say so, leaving worn kept gear to the engagement-end windows and the Maintain Gear Downtime Action. Simpler, but a Jammed harness rated at the Funding row then survives into the next fight unless the soldier declines nothing and the interim issue happens to replace it, which it does not.

### Minor 1. Chapter 5 and its YAML still carry the PROVISIONAL marker that decision 5-13 removed

**Location.** Chapter 5, section 5.10, *Order* bullet ("PROVISIONAL: a move on a turn whose action is Lift Comrade comes after the lift"); `data/engagement/background-titans.yaml`, `retreat.effects.order` comment ("The lift exception is PROVISIONAL"); `data/engagement/tuning.yaml`, `prepared_squad_kill.model.retreat`; ADR-0010, batch 5 paragraph ("The move-first order has a second exception (5-13)").

**Problem.** Decision 5-13 was added during this review and its chapter impact says the marker goes and the text cites 5-13. ADR-0010 already reads as decided, so until the apply lands the chapter, the YAML, and the ADR disagree on whether the rule is provisional. Logged and decided; listed so the apply is not missed.

**Fix.** Apply 5-13's chapter impact: drop the marker in all three places and cite "decision batch 5, 5-13".

### Minor 2. The Chapter 3 worked example still heals at "the next night camp"

**Location.** Chapter 3, section 3.17 (the Oskar example), "Later" bullet: "At the next night camp there is a care window before his next Death Roll."

**Problem.** Section 3.6 now says a day passes at each night camp or, until the Expedition rules exist, at the start of each session. A reader who follows the example to the end of the session is told to wait for a night camp that no Phase 1 rule reaches.

**Fix.** "When the next day passes (at a night camp once the Expedition rules exist, and until then at the start of the next session, section 3.6) there is a care window before his next Death Roll."

### Minor 3. The items of a soldier left behind are shared out to the survivors who fled

**Location.** Chapter 4, section 4.11 and `data/gear/carrying.yaml`, `leaving_play.death.shared_out` ("The players give each left item not yet taken to a living soldier who took part in that procedure"); Chapter 5, section 5.11 and `data/engagement/engagement-flow.yaml`, `left_behind`.

**Problem.** A soldier left holding a Position when the retreat's ending test fires dies at that ending. Their left items lie at their Position until the Titan Engagement ends, and are then shared out to any survivor who held a Position at any point in the fight, including soldiers who fled the field three rounds earlier and never came back. Mechanically harmless (a few Blade Sets and canisters), but it contradicts the fiction of a field abandoned to the Titans, and it makes leaving a comrade behind marginally profitable.

**Fix options.**
1. In `shared_out`, add: "Left items of a soldier who dies as left behind (`engagement-flow.yaml`, `left_behind`) leave play." 
2. Restrict the sharing to survivors who held a Position at the moment the Titan Engagement ended.

### Minor 4. Section 2.8's "Dormant rolls" list names seven entries where section 2.3.3 counts eight

**Location.** Chapter 2, section 2.3.3 ("Eight roll entries exist only for rules not yet written and are marked dormant"); section 2.8, *Dormant rolls* (`spot`, `size-up`, `survive`, `persuade`, `endure`, `sneak`, `recall`) and *Harm, gear, and mind* (which lists `ride` as live alongside `fly`).

**Problem.** Ride became dormant in batch 5 (5-3) and is listed under the live rolls with a dormant note elsewhere in the chapter, so the two lists no longer add up for a reader who counts. Consistent in substance, not in presentation.

**Fix.** Add `ride` to the *Dormant rolls* list with "(decision batch 5, OQ-121)" and drop it from the live list, or change "Eight" to "Seven, and Ride".

## Round 1 scenarios walked under the batch 5 text

Each scenario below is the one its round 1 finding gave, followed by the single outcome the rules now give.

- **Fable Major 1 (no day passes).** Session 1: Ilse takes 2 damage from a fall, Oskar's arm injury is treated with 10 healing days. Now: at the start of session 2 one day passes (`healing.yaml`, `day_passes.interim`): a care window (see Major 1 for its scope), day Death Rolls (none due), Ilse gets both damage marks back, Oskar's healing time falls to 9, Stress and Grief do not change. Then the interim issue. The GM invents nothing. Resolved (5-2).
- **Fable Major 2 (Ride never called).** A player takes Horsemanship 1 from Minor Noble House. Now: Horsemanship adds its dice to a mounted dodge with the horse as the gear item (`horses.yaml`, `gear_dice.dodge`; `talents.yaml`), and Ride is openly dormant. The Talent does something in every fight the soldier rides into. Resolved (5-3).
- **Astra C2 (act before move under a retreat).** Wooded, two Focus Titans, a soldier at Blind Spot of A with their decoy holding A, a Background clock fills. Now: on their next turn the forced move comes first (`round.yaml`, `turn_order`; `retreat.effects.order`); at Wooded the only shortest chain is Blind Spot, In Reach, Distant, so they step to In Reach and no Nape strike is legal. Resolved at Wooded, Sparse, and Open. At Giant Forest and Urban the same soldier at On Body still reaches Blind Spot by option 1: Critical 1 above.
- **Astra M1 (kill removes Positions for aftermath).** A Down soldier with an `engagement` injury shares In Reach with a Medic; another soldier kills the only Titan. Now: the death steps end Positions, and the engagement-end steps read the Positions held when the last Focus Titan died (`engagement-end.yaml`, `positions_read`; section 3.5 aftermath rolls). The Medic's aftermath roll is legal. Resolved (5-4).
- **Astra M2 (fall with two Positions).** Airborne On Body of Large A, In Reach of Medium B, a Pushed dodge against B Jams the harness. Now: the reference Titan is the one at whose Position the soldier is closest, On Body of A (`falls.yaml`, `height`; `positions.yaml`, `falls_land.reference_titan`): an extreme fall, landing In Reach of A, Positions relative to B unchanged. One reading. Resolved (5-5).
- **Astra M3 (crush before Grabbed).** A Health 4 soldier airborne On Body when a Grab lands, torso roll 10. Now: hold first (Grabbed, not airborne, no fall), then the crush, then attention, then witnesses (`grab.yaml`, `grab_lands`). The nonlethal Down result puts them Down in the hand with no fall. Resolved (5-6).
- **Astra M4 (Horsemanship dead).** As Fable Major 2. Resolved (5-3).
- **Astra C1 (tables not rendered).** Every essential table in Chapters 2 to 5 is rendered from its YAML and `render.py check` passes on 32 blocks; Chapter 6's four Titans are rendered by the chapter-06 probe renderer and its check passes. Resolved (ADR-0012).
- **Fable Minor 1 to 3, Astra m1 and m2.** "Not yet built" is gone from 5.13; "intent" no longer appears in the Feint note; Distant in 5.2 now reads as the Position Run Past and Trample can reach; the Small Titan note reads Toughness 1 correctly; the unquoted-comma keys are quoted and the renderer's `expect_keys` fails on a split. All Resolved.

## Completeness for a first playtest

A new group can make soldiers (Chapter 2's Lifepath, Graduation Exam, and Squadmate templates are complete and rendered), receive Standard Issue at Funding 3, set up a Titan Engagement from the interim setup table (Anchor Rating, Focus Titan, Background Titans, retreat clock 8), run it under Chapter 5 against each of Chapter 6's four Titans, end it by kill, by no soldier standing, or by the retreat clock, run the nine engagement-end steps, and open the next session with the interim day and interim issue. I walked a Small, a Medium, a Large, and a Sprinting Abnormal fight through setup, three rounds, a Grab, a retreat, the ending tests, and the end steps without needing a rule the book does not give, except the two findings above (the retreat step at Giant Forest and Urban, and the interim day's scope). Still missing, all logged and acceptable for a first playtest: XP and Talent advancement, Rank, Funding above the fixed row, Expedition and Downtime procedures, Chase rules (Ride), Squad Points, and the Canon Clock. A session is "a chain of Titan Engagements, each followed by its care window" (section 5.1), which is enough to run.

## ADR-0014 targets and balance under batch 5 tolerances

- Every target has a reading (5-11, OQ-127) and the committed batch 5 probe meets each: prepared-Squad kill median 3 (61.7% by round 3), Medium deaths 0.0499 and 0.0482 against at most 0.05 (edge, recorded, pooled by the second-seed rule at 0.0494), Large no kill 14.39% and 14.6% against at most 15%, Levi-grade cut 47.2%, lone Grab 69.9%, gas medians 8 and 6. The Abnormal bar holds every row with wide margins (`retreat_b5_bar.out`).
- The first-Titan-Engagement row at 0.063 deaths is now decided as a sensitivity row (5-14); not re-reported.
- The Medium deaths edge is judged, not hidden, and any miss is to be decided on a lever. I have no better number: my scratchpad simulation covers only the lone cut (12.3% fresh for the Rookie at Stress 1 against Nape Depth 4, beside the drafter's 13.3%, whose model counts the Push's Stress Die slightly differently; both sit inside the 8% to 14% band).
- Dominant strategy: four eager strikers and no cutters still beat the baseline on every table (78.4% by round 3 and 0.0155 deaths against 61.7% and 0.0499 on the Medium; 0.52% no kill against 8.52% on the Abnormal). Logged as OQ-112 and reported, not tuned; nothing new. Critical 1 adds a rating-dependent lever the model does not see: at Giant Forest and Urban a striker at On Body gets one more cut when the clock fills, which raises the kill share and the striker's exposure on those two ratings only.
- No Titan is trivial or unwinnable: the template Squad's worst row is the Large at 21.9% no kill and 0.29 deaths, which is the intended hard fight, and support rows bring it to 8.3% and 0.024.
- The simulator report on disk is stale (pre-batch-5 horizon and "Not judged" rows for targets 3 and 4). It should be regenerated before the playtest so the chapters' figures and the report agree; OQ-128 already logs the unexplained gaps between the report and the committed probes.

## Fidelity, 845 to 850

No Phase 2 or Shifter leak found. The retreat clock reads as the Survey Corps' own doctrine of not lingering, gas as the hard limit it is in canon, and the Sprinting Abnormal as the runner that ignores the nearest soldier. Minor 3 is the one fiction seam: the Corps does not go back for the blades of a soldier it left behind. Draw Attention barred from Distant (5-8) matches the series: shouting from beyond a Titan's reach does nothing, a flare does.

## Round 1 findings: status

| Finding | Status |
|---|---|
| Fable Major 1: no rule makes a day pass | Resolved (5-2, OQ-120); interim day's scope gap is Major 1 above |
| Fable Major 2: Ride never called | Resolved (5-3, OQ-121) |
| Fable Minor 1: 5.13 "not yet built" | Resolved |
| Fable Minor 2: "intent" Shifter term | Resolved |
| Fable Minor 3: Distant vs Run Past and Trample | Resolved |
| Astra C1: tables not rendered | Resolved (renderer, ADR-0012; checks pass) |
| Astra C2: act-before-move last cut | Resolved at Open, Sparse, Wooded (5-1); Still open at Giant Forest and Urban (Critical 1) |
| Astra M1: kill removes Positions for aftermath | Resolved (5-4, OQ-122) |
| Astra M2: fall reference Titan | Resolved (5-5, OQ-123) |
| Astra M3: crush before Grabbed | Resolved (5-6, OQ-124) |
| Astra M4: Horsemanship no live caller | Resolved (5-3, OQ-121) |
| Astra m1: Small Titan note | Resolved |
| Astra m2: unquoted YAML commas | Resolved (`expect_keys`) |
| Drafter's PROVISIONAL lift exception | Logged and decided (5-13); apply pending (Minor 1) |
| OQ-112 four strikers | Logged, open, unchanged |
| OQ-128 report vs probe gaps | Logged, open; report still stale |
