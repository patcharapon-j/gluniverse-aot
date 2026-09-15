# Dice simulator: review round 1

Reviewed:

- Everything in `tools/sim/`: `README.md`, `rules.py`, `dice.py`, `engine.py`, `policy.py`, `families.py`, `cases.py`, `barcheck.py`, `run.py`, `recheck.py`, `report.py`, and `results/results.json` and `results/recheck.json`.
- The report `docs/reviews/simulator-report.md`.

Checked against:

- `CONTEXT.md`, ADR-0014 as rewritten, and the ADRs it amends.
- Chapter 5 in full, and Chapter 6 section 6.6 in full. Chapters 1 to 4 through the YAML the code reads: `dice-pool.yaml`, `stress-responses.yaml`, `fear-rolls.yaml`, `critical-injuries.yaml`, `health.yaml`, `death-rolls.yaml`, `engagement-end.yaml`, `treat-injury.yaml`, `effect-types.yaml`, `odm-gear.yaml`, `falls.yaml`, `horses.yaml`, `blade-sets.yaml`, `field-repair.yaml`, `standard-issue.yaml`, `squad-supply.yaml`, and `squadmates.yaml`.
- Every file in `data/titans/` and the engagement YAML (`attention.yaml`, `grab.yaml`, `behavior-procedure.yaml`, `titan-format.yaml`, `titan-harm.yaml`, `squad-tactics.yaml`, `positions.yaml`, `anchor-ratings.yaml`, `size-classes.yaml`, `bonus-dice-sources.yaml`, `tuning.yaml`).
- `docs/rules/DECISIONS-2026-09-14.md` through batch 4b.
- `data/titans/probe-figures.yaml`.
- `docs/rules/OPEN-QUESTIONS.md` (type Simulator target).

I did not read `simulator-review-1-codex.md` or the `05-06-decisions-conformance-review-3*` files.

Every rerun was made in a copy of `tools/sim` in the session scratchpad, reading the repository's `data/` through a symlink. Nothing in the repository was written except this file. The appendix lists the scripts.

Severity follows the brief:
- **Critical:** a divergence from the rules as written that changes a target's result, a target reported Met that is not, a testable target left untested, or a report number that does not reproduce.
- **Major:** hard-coded values duplicating YAML, insufficient trials for the quoted precision, an untested Chapter 6 case the chapters quote, or a significant fidelity simplification that does not change a target.
- **Minor:** clarity, documentation, small gaps.

## Verdict

**1 Critical, 6 Major, 6 Minor.**

The simulator is a careful, reproducible piece of work:
- Every committed figure I reran reproduces exactly, at the committed seeds, and the rules code I read against the YAML is faithful.
- The five testable ADR-0014 targets are met, and three of them match my own independent dice code.
- The Expedition target is marked Deferred.
- Batch 4b's ladders run throughout.

What keeps it from being the Phase 1 simulator ADR-0014 describes is coverage, not correctness:
- **Critical.** The report says every per-table band is met, but three of the four `every_standard_table` targets (the kill share, the Grab and lethal counts, and the In Reach count) are never computed (finding 1).
- **The Abnormal's ceiling.** The ceiling and the Medium deaths band are read on deaths during the fight only. The engagement-end aftermath rolls and Death Rolls the rules require are left out. Counting the Death Rolls without the aftermath rolls, the helpers row fails the ceiling by 4.1 and 4.8 standard errors. My estimate of the aftermath roll puts the full-rules figure near 1 standard error, so the verdict probably stands, but it is not measured (finding 2).
- **Missing cases and reports.** Much of `simulator_cases`, which `data/engagement/tuning.yaml` calls "the simulator's specification", is not modelled, and several ADR-0014 reports are absent (findings 3 to 5).
- **The lone route.** The on-foot Feint is barely exercised, and the promise that a decoy is usable whenever a strike is legal is checked by a tautological counter (finding 6).

## Checks that passed

- **Reproduction.** Every committed figure I reran reproduced exactly:
  - All 606 cases, at the committed seeds, identical in every summary field: `ch5`, `ch6`, `solo`, `grab`, `lone`, and `gas` (186 cases, 191 s on 14 processes), then `bar`, `grab_alone`, and `jam` (420 cases, 265 s).
  - The 4b-4 second-seed selection picked the same four rows as the committed run, and all four pooled figures match `results.json` (`pooled`).
  - `recheck.py` rerun gives a `recheck.json` identical to the committed one.
  - `families.route_check()` gives the committed `route` block (0 gaps; 112, 88, 112, and 112 reachable states).
- **Batch 4b's ladder throughout.**
  - The rerun reads the ladders from the current YAML, where every ladder starts with `hooked-into-its-body`, and every case's `cfg` matches the committed `cfg`.
  - Identical results at identical seeds mean the committed run used these ladders in every case.
  - `results.json` was written at 04:38 after a 656 s run, so the run began about 04:27, after the last YAML edit (04:23).
  - The pre-4b rows (the loud rider under the old ladder, the earlier ladder) carry their rungs explicitly in `cfg`.
- **Independent odds.** A separate script written from the YAML, importing nothing from `tools/sim`, gives:
  - the Rookie's fresh cut at Nape Depth 4: 13.12% ± 0.05 from Stress 1 and 10.00% ± 0.05 from Stress 0, against the simulator's 13.02% ± 0.11 and 9.87% ± 0.10;
  - the Levi-grade soldier: 47.32% ± 0.08, against 47.22% ± 0.16;
  - gas, computed exactly: median 8, mean 9.250 on two dice, and median 6, mean 6.333 on three, against the simulator's medians 8 and 6 and means 9.24 and 6.34.
- **Target coverage.**
  - Targets 1 to 5 each carry a number, a tolerance, and a result, and Target 6 (Expedition) is marked Deferred.
  - Target 1 reads 4 player characters, as the target's "Squad of 4" and the tuning row define it. With ADR-0014's default Squad (2 helper Squadmates added) the median is still round 3: by round 2, 48.85% ± 0.14 and 49.01% ± 0.14 at 120,000 fights, at least 7 standard errors from flipping.
- **Rules fidelity.** Checked line by line against the YAML: dice pool assembly, the Bonus cap and penalty floor, Push and locked 6s, the Stress Die 1 rule (no Push, one Stress Response), Hair Trigger, lasting-row stepping, Gear wear on Pushed rolls, blade ruin, Gas Rolls, Jams, Field Repair (Wits alone, no Talent), falls, Health and Down, Critical Injury rows and limits, Death Rolls, start Fear Rolls, Attention Ladder evaluation (struck-first narrowing, holder keep, card tie-break, "none" at the start), flag lifetime, Break Attention's needs (holder 1, else 2, Grab 2, +1 Feint, +1 per decoy in a row), a hold of Tempo cards, decoy legality by Position, the Grab countdown and failed-dodge refund, and Regeneration. I found no divergence in any of them.
- **Squadmates.** Helper Squadmates are the Rookie reference build at Stress 1, as ADR-0014's "all Rookies" Squad requires, and never Push or Cover, as `squadmates.yaml` (lines 51 to 55, 82) requires.
- **Veteran chapter bug.** The simulator clamps Stress to the build's minimum. Its Veteran cells from Stress 0, 1, and 2 read 32.0%, 32.0%, and 32.2%, one start within sampling, which confirms the chapter bug the report logs.
- **Open Questions.** No ADR-0014 target is missed, so none needs a Simulator target entry. The failing Grab-alone variant is a rejected alternative, not a target.

## Findings

### 1. Critical: three of the four `every_standard_table` targets are never tested, and the report says every band is met

**Location:** `docs/reviews/simulator-report.md`, Summary ("every per-table band met") and section 2; `data/titans/tuning.yaml` lines 203 to 210 (`targets`, `every_standard_table`); `data/engagement/tuning.yaml` `simulator_cases` ("Each Behavior Table's kill share by previous behavior and by Broken parts"); `tools/sim/` (no code computes them).

**Problem:** `every_standard_table` is one of the `targets` blocks, and it has four entries:
1. The Jam test's worst cell stays under a third.
2. No kill share by previous behavior exceeds one half at any state, where "any state" is every previous behavior with every count of Broken eyes, arms, and legs.
3. At most one result gives a Grab effect, and at most one a Critical Injury that can be lethal.
4. A holder at In Reach meets the Position requirement of at least four results in six.

The simulator tests only the first. Nothing in `tools/sim` enumerates the Next Behavior move-ups: `grep` finds no share computation beyond `devour_share` and `thrash_share`. Nothing counts Grab or lethal entries, and nothing counts In Reach results. The three untested entries are exact enumerations and cheap to test, and Chapter 6 line 335 says the simulator "re-measures all of them". The move-up shares Chapter 6 prints come only from the probe `titans.py`. The report's Summary nevertheless says "every per-table band met".

**Play scenario:** OQ-112 is open "to a decision that can redraw the Behavior Tables" (Chapter 6 line 886). Suppose the decider moves Bite so that, after Shake Off with one arm Broken, two results in three move up to a kill entry. The drafter reruns `run.py`, and the report again says every per-table band is met. A table then plays a Medium Titan that devours twice as often after Shake Off, and no measurement flagged it.

**Fix options:**
1. Add a `shares` family that drives the engine's own Next Behavior roll (`Titan.roll_nb` with its move-up and fallback) over every previous behavior and every count of Broken eyes, arms, and legs. Report the highest kill share and where it occurs, the fewest legal entries, the Grab and lethal counts, and the In Reach count, each against its limit in section 2.
2. At minimum, change the Summary to name the one entry tested, and mark the other three "tested by `titans.py`, not by the simulator".

### 2. Major: the Abnormal's ceiling and the Medium deaths band leave out the engagement-end steps; with the Death Rolls counted the helpers row fails

**Location:** `tools/sim/engine.py` `finish` (lines 921 to 941: end Death Rolls rolled with "no aftermath Treat Injury roll"); `tools/sim/barcheck.py` `check` (the ceiling reads `deaths`); `tools/sim/families.py` line 89 (`deaths_all`); report section 9, lines 540 and 542; `data/harm/engagement-end.yaml` (aftermath-rolls step, then death-rolls step); `data/harm/treat-injury.yaml` (`aftermath_rolls`); `data/harm/death-rolls.yaml` (`engagement`: "Only a treatment during the Titan Engagement or the patient's one aftermath roll, if it succeeds ... prevents it").

**Problem:** The rules as written end a Titan Engagement in two steps:
- **Aftermath rolls.** Each patient with an untreated lethal engagement Critical Injury gets one Treat Injury roll from a treater within one Position step, and a success stabilizes the injury.
- **Death Rolls.** Every lethal engagement Critical Injury left runs out and causes a Death Roll.

The simulator rolls the Death Rolls with no aftermath rolls, and counts them in `deaths_all`. It also models no Treat Injury during the fight. The Chapter 6 deaths band and the Abnormal's ceiling are then read on `deaths`, which leaves both steps out. So the committed "holds" is measured on a definition narrower than the rules. The report says so, but it never prints `deaths_all`. The step matters exactly where the bar has no margin:

| Row (120,000 fights) | Order | Deaths during the fight: Abnormal; Large twin; z | With end Death Rolls, no aftermath roll: Abnormal; Large twin; z |
|---|---|---|---|
| 4 PCs and 2 helper Squadmates | cutters first | 0.0207; 0.0207; -0.0 holds | 0.0380; 0.0340; +4.1 past |
| 4 PCs and 2 helper Squadmates | strikers first | 0.0204; 0.0201; +0.3 within | 0.0380; 0.0334; +4.8 past |
| 2 Squadmates screening beside the holder | cutters first | 0.0097; 0.0100; -0.7 holds | 0.0210; 0.0197; +1.9 within |
| screen with Hook and Cut and Hamstring Line | cutters first | 0.0080; 0.0085; -1.3 holds | 0.0177; 0.0168; +1.5 within |
| Grab-alone variant, helpers | strikers first | 0.0218; 0.0201; +2.0 past | 0.0457; 0.0334; +12.4 past |

On the other rows the margin is wide either way, and the standard Medium Titan's reference row keeps its band: 0.045 ± 0.0008 with end Death Rolls, 6 standard errors under 0.05.

Full deaths therefore lie between the "holds" and the "past" columns. By my estimate, a Rookie's aftermath roll (Wits 2, Talent 1, a medical kit rated 1, Stress Dice, one Push, no Help) succeeds 79% to 84%. If every patient got one, the helpers row would sit near 1 standard error (0.0242 against 0.0234 with the cutters first). A patient whose nearest standing comrade is two Positions away gets none, though, so the true z is somewhere between about 1 and 4.8. The verdict probably stands, but it is not measured, and in-fight Treat Injury would lower both columns.

**Play scenario:** A Squad with two helper Squadmates kills the Sprinting Abnormal in round 4. The cutter it Grabbed is Down at In Reach with a lethal Critical Injury. The helper Squadmates are mounted at Distant, and the strikers are On Body. At the aftermath-rolls step the players look for a treater one step from In Reach, and whether there is one decides whether the cutter makes a Death Roll. The bar that accepted this Titan never asked that question.

**Fix options:**
1. Model the aftermath rolls as `treat-injury.yaml` states them: one per patient and one per treater, a treater within one Position step, the self penalty, no Help or Cover, and a Push. Model in-fight Treat Injury under a published policy too. Then read the ceiling and the deaths band on full deaths.
2. If the decider means the ceiling to be deaths during the fight, say so in `data/titans/tuning.yaml` (`abnormals`, `ceiling`; `bands`, `deaths_per_fight`), and print full deaths beside it in the bar table.
3. Either way, print `deaths_all` and `lethal_at_end` in sections 2 to 5 so the reader sees the size of the step.

### 3. Major: the reports ADR-0014 names beside its targets are absent

**Location:** ADR-0014 lines 7 and 11; `data/engagement/tuning.yaml` `simulator_cases` ("The reports ADR-0014 names, namely the Health 3 Squad, the Health 2, 5, and 6 builds, the template Squad, and the Flier template's dodge"; "comrades close ... with the reference Squad's Grab death share reported"; the four-striker Squad "reported beside every target"); `tools/sim/cases.py` `_grab` (reference builds only); report section 1.

**Problem:** ADR-0014 says "Beside every target, the simulator reports, without tuning" a list of rows. The simulator runs the template Squad only for the kill, and the four-striker row only beside the kill. What is missing:
- **Health 3 Squad and Health 2, 5, and 6 builds.** No case sets the Squad's Health to 3, runs these builds, or Grabs a victim who already carries untreated Critical Injuries.
- **Template Squad on the Grab.** Nothing runs the lone Grab or the OQ-50 rescue cells with template builds; `_grab` uses the reference Rookie only.
- **The Flier's dodge.** There is no Flier dodge case.
- **The Grab death share.** The reference Squad's Grab death share is computed (`devour_share`: 8.6% on the standard Medium Titan, 16.9% on the Sprinting Abnormal) but section 1 never prints it beside Target 4, as the target's own sentence requires.

**Play scenario:** Chapter 3 quotes a Health 2 build. A player makes that build a Medic, and in her second Titan Engagement she is Grabbed while carrying an untreated Critical Injury from the first. ADR-0014 promises the table a reported figure for exactly that Grab. The simulator report, which is where that figure should be, has none.

**Fix options:**
1. Add the Grab cells with the victim at Health 3, and at Health 2, 5, and 6 with one and two untreated Critical Injuries. Add the lone Grab and six rescue cells with template victims and comrades, and a Flier dodge table at Severity 1 to 4.
2. Print the Grab death share for every table beside Target 4, and the four-striker row beside each target it applies to, or state which targets it cannot apply to.

### 4. Major: much of the simulator's specification in `data/engagement/tuning.yaml` is not modelled

**Location:** `data/engagement/tuning.yaml` `simulator_cases` (lines 993 to 1013: "This list is the simulator's specification"); report section 9, line 542 ("Not modelled, as in the probes"); report header ("Rules: Chapters 1 to 6"); ADR-0014 line 13 ("the Phase 1 simulator, which models every rule and every reference-build action under published policies").

**Problem:** The report lists these gaps honestly, but it treats them as a carry-over from the probes. The specification is what the simulator must do. Items with no case:
- **Read and Call It.** No case, although the specification wants them "reported against the Jam test and the PC Critical Injury target".
- **Wings and swaps.** Neither Wings under the standing cadence nor initiative swaps is modelled.
- **Pry Loose.** Pry Loose is not modelled (Break Attention rescues are).
- **Background Titans.** Neither Background Titans nor the retreat is modelled.
- **Between fights.** There is no treatment in the care windows between fights and no interim issue.
- **Eyes and arms.** No case strikes eyes or measures arm Toughness for any Size Class, and there is no Medium Tempo 2 alternative row.
- **Jam test.** The Jam test is not run inside the full-fight model. `jam_job` is the probe's abstraction, which takes the worst legal support pattern regardless of whether helpers are Down or out of Position.
- **Round-time counters.** Only cards resolved per round are reported; there are no tracker writes, ladder evaluations, pools, or Gas Rolls per round.
- **Other items.** The kill-share tables (finding 1) and the gap to the Opus review 1 model are also absent.

**Play scenario:** A Tactician Reads the Titan from Distant every round and Calls It, which is one of the most common things a support player does. OQ-84 asked whether that makes the holder's Jams worse and Critical Injuries fewer, and the specification sends the question to this simulator. After the run, the table still has no figure.

**Fix options:**
1. Implement the items in the order the open questions need them: the Jam test in the full fight with Read and Call It (OQ-84, OQ-96), then treatment (finding 2), then Pry Loose and Help on Break Free (OQ-85), then Background Titans (OQ-87).
2. For each item deferred to a later round, log it in `OPEN-QUESTIONS.md` or the progress file with its reason, and change the report header from "Chapters 1 to 6" to name what is modelled.

### 5. Major: Chapter 6's simulator cases are partly unrun, including the setup mix Chapter 6 quotes

**Location:** `data/titans/tuning.yaml` `simulator_cases` (lines 277 to 305); `docs/rules/06-standard-titans.md` section 6.6, *The Abnormal roll in the setup table* (lines 770 to 781) and line 335; `tools/sim/cases.py` (Chapter 6 tactic rows only on the standard Medium Titan).

**Problem:**
- **Tactics on every table.** "Each Chapter 6 table with every Squad Tactic alone and in pairs": results carry 10 tactic rows for the standard Medium Titan only, and none for the Small, Large, or Abnormal tables.
- **Broken eyes.** "Broken eyes in the full fight, with a policy that strikes eyes": no case.
- **The Abnormal at the setup rate.** "The Sprinting Abnormal against the PC Critical Injury and PC death targets at the setup table's rate, with Draw Attention and a Read revealing its ladder": no case.
- **The setup mix.** The setup-mix table Chapter 6 prints (0.85 and 0.053 Critical Injuries and deaths per Titan Engagement without the Abnormal roll, 0.86 and 0.057 with it) is not re-measured, though the simulator already has every reference row it weights.
- **The loud rider.** "A soldier who takes Draw Attention from Distant every turn against the Sprinting Abnormal, with and without a comrade at its Nape": only the "with" row exists.

The Jam pairings (a standard Titan with the Abnormal, and two of different classes) are run.

**Play scenario:** A GM sets up an Engagement on the interim setup table and rolls `medium_abnormal`. Chapter 6 tells them what that choice costs per Titan Engagement (0.004 deaths), and says the simulator re-measures it. That figure still comes only from the probe.

**Fix options:**
1. Weight the committed reference rows by `engagement-setup.yaml`'s odds, as the probe did, and print the setup mix, with full deaths per finding 2. This needs no new fights.
2. Add the tactic rows for the Small, Large, and Abnormal tables, an eye-strike policy row for every table whose entries use eyes, and the loud rider with no comrade at its Nape.

### 6. Major: the lone route's on-foot Feint is barely exercised, its gap counter cannot fire, and on Open the policy strands the soldier On Body

**Location:** `tools/sim/policy.py` `feint_usable` (lines 373 to 385), `lone_choice` (388 to 395), `end_of_round` (177 to 183), `lone_stage` (402 to 410), and `lone_turn`'s On Body branch (about 466 to 471); `tools/sim/cases.py` `_lone` (lines 148 to 162); report Summary ("0.0% of the grounded-start lone fights end with no decoy usable while the Titan is grounded") and section 6.

**Problem:** Three separate flaws:
- **The on-foot Feint is barely used.** `lone_choice` spends the horse, then flares, then the Feint, and every route row starts with the Funding 3 Squad's 2 flares. The committed rows count on-foot Feints per lone fight of 0.00 (Open, grounded; Open, grounded, Jammed, dry) and 0.02 (Wooded, grounded, Jammed, dry). With the same rows at no flares (20,000 lone fights each, my seeds) they rise to 0.10 and 0.47. A soldier with working ODM Gear never Feints on foot at all: 0.00 even with no flares and no horse, because the Feint is then made with the gear. So the way ADR-0010's route promise relies on against a grounded Titan is hardly exercised in play. The structural `route_check` covers it only as legality.
- **The gap counter cannot fire.** `end_of_round` sets `gap_while_grounded` only when `any_decoy_left` is false. For a soldier on foot beside a grounded Titan, `feint_usable` returns True unconditionally, so the check can never register a gap there. The `lone_end("no_decoy_usable")` endings inside `lone_turn` never set the counter. I instrumented every `lone_end` in all 11 route rows and variants: none ended with no decoy usable while the Titan was grounded and the soldier up, so the Summary's claim is true, but the committed counter cannot show it.
- **The soldier is stranded On Body on Open.** When a grounded Titan stands on Open ground, `lone_stage` returns None, and `lone_turn`'s On Body branch then does nothing, with no pull-back to Distant. In 5,000 lone fights of "open grounded", 35.4% end with the soldier On Body a standing Titan with working ODM Gear: 19.4% dead, 16.0% Down. That is most of the row's published 36.6% Down (Wooded gives 4.5%). Flares first also costs the Jammed, dry soldier on Open: 31.7% end Down with flares, against 7.2% with none.

**Play scenario:** A lone Rookie on open farmland has Broken a Medium Titan's leg. Her ODM Gear is Jammed and dry, her horse is gone, and both flares are spent. Chapter 6 tells her the Feint on foot is still usable whenever a Nape strike is legal. The simulator's rows almost never reached her position, and its counter could not have reported a gap if one existed. In a second fight on the same ground, the leg regenerates while she stands On Body. A player would drop off and back away to Distant, but the simulated soldier stays until she is knocked Down, and section 6 publishes that as what Open ground costs.

**Fix options:**
1. Add route rows at no flares and no horse, with Jammed or dry gear, so that the on-foot Feint is the only decoy, and report on-foot Feints for each.
2. Replace `gap_while_grounded` with a check at every lone turn and every `lone_end`: a Nape strike legal (or reachable by one step) with no decoy legal from any Position the soldier can reach. Count it wherever it occurs.
3. Give `lone_turn` a pull-back from On Body and In Reach when `lone_stage` is None, as the waiting line already does at In Reach, and rerun the Open rows.

### 7. Major: gas dice and the bar's median limits duplicate YAML values in code

**Location:** `tools/sim/cases.py` line 234 (`for d in (2, 3)`); `tools/sim/barcheck.py` lines 20 to 23 (`else 2`, `else 4`).

**Problem:** Two places copy YAML values into code:
- **Gas dice.** The gas family rolls two and three dice because the code says so. `odm-gear.yaml` (`gas_roll`: `standard: 2`, `after_pushed_odm_roll: 3`) is already loaded as `R.gas_dice`.
- **Median limits.** `barcheck.py` reads the bar's median limits from `tuning.yaml` prose by regex. If the sentence is reworded, it silently falls back to 2 and 4, the values the YAML holds today. Today both regexes match, as I confirmed, so no figure is affected.

**Play scenario:** A decision makes a Pushed ODM roll's Gas Roll four dice. The YAML is edited, the simulator is rerun, and the gas table still rolls 2 and 3 dice and reports medians 8 and 6 "Met".

**Fix options:**
1. Build the gas cases from `R.gas_dice["standard"]` and `R.gas_dice["after_pushed_odm_roll"]`.
2. Raise an error when either `barcheck.py` regex fails, instead of falling back. Better, give `abnormals` structured `median_kill_round: {min: 2, max: 4}` fields.

### 8. Minor: the "about" targets' tolerances are invented in `report.py`

**Location:** `tools/sim/report.py` lines 22 to 26 (`READINGS`); report section 1, Targets 3 and 4.

**Problem:** "About 50%" is read as 45% to 55%, "about 2 in 3" as 61.7% to 71.7%, and "about 1 in 3" on the Stress 2, Grief 0 cell as 28.3% to 38.3%. ADR-0014 and both `tuning.yaml` files give none of these bands. They are sensible readings, but they sit in code as though they were rules, and a result reads "Met" against a number no decision set.

**Play scenario:** A later Grab change moves the lone Grab to 72%. The report says "Missed" against a 71.7% limit no one decided, and a decider may spend a batch on a false alarm.

**Fix options:**
1. Move the readings into `data/engagement/tuning.yaml` under the target they read, citing the decision that accepts them.
2. Or print the figure beside the ADR's words, with no Met or Missed, for the "about" targets that have no band.

### 9. Minor: the Small reference row's explanation omits a 2.6 standard-error gap and blames only the probe's draw

**Location:** `tools/sim/report.py` `EXPLAIN` (the `ch6/standard-small` entry); report section 7 and the Re-checks table.

**Problem:** The note says that on new seeds the simulator and probe are "within 1 standard error of each other", and that "the committed 0.806 and 0.032 come from a low 12,000-fight draw". The committed simulator row is also a high draw, and one re-check figure disagrees:
- **The simulator's own draw.** Against its own 60,000-fight recheck, the committed simulator row sits at 0.864 Critical Injuries against 0.839 (+2.5) and 0.0487 deaths against 0.0415 (+2.8).
- **Killed by round 3.** On the new seeds the simulator's 80.7% sits 2.6 standard errors below the probe's 81.3%, and the note leaves that out.

The note's numbers are also hand-written, so a rerun cannot update them.

**Play scenario:** A reader checking why the Small Titan's committed deaths moved from 0.032 to 0.049 is told the probe was low. They are not told that the simulator's own row is 2.8 standard errors high, or that the simulator kills a little slower on fresh seeds.

**Fix options:**
1. Generate the note from `recheck.json`, printing all three figures with their z.
2. Quote the simulator's committed-versus-recheck gap beside the probe's.

### 10. Minor: medians on the round boundary are compared without the share that decides them

**Location:** report sections 4 and 5 (median columns, for example "3 (2)" for the standard Medium Titan's four strikers and "2 (3)" for the standard Large Titan's).

**Problem:** A median is printed exactly, with no share killed by the round before it and no standard error. The four-striker rows sit on the boundary:
- **Standard Medium Titan.** The bar's 120,000-fight twins give 49.88% ± 0.14 and 49.75% ± 0.14 by round 2, 0.9 and 1.8 standard errors from flipping.
- **Standard Large Titan.** The simulator's 12,000-fight row gives median 2 against the committed 3.

The report flags neither. Chapter 6 discusses these boundaries, but the report, which is its source, does not.

**Play scenario:** A decider reading OQ-112 compares medians across the report and Chapter 6 and sees round 2 in one place and round 3 in the other for the same Squad, with nothing saying both are the same figure within sampling.

**Fix options:**
1. Print the share killed by the round before the median, with its standard error, beside every median.
2. Flag any median whose deciding share is within 2 standard errors of 50%.

### 11. Minor: "one documented command" is three, and a stale recheck file is read silently

**Location:** `tools/sim/README.md`; report header ("re-run `uv run --with pyyaml python tools/sim/run.py`"); `tools/sim/report.py` line 584 (reads `results/recheck.json` if present); `tools/sim/recheck.py` lines 32 to 39 (hard-coded labels, trials, and seeds).

**Problem:** Regenerating the report as committed takes three steps: `run.py`, then `recheck.py`, then `run.py 1 report`. Otherwise the Re-checks section and the `EXPLAIN` notes come from whatever `recheck.json` is on disk. After a rules change, `report.py` renders the old re-checks beside new figures without warning. `recheck.py`'s labels are written in, so a renamed case drops out silently.

**Play scenario:** After the next Behavior Table change, the drafter runs the one command the report header names. The new report's section 7 still explains the Small Titan's gap with the old seeds' figures, which no longer match the row above them.

**Fix options:**
1. Have `run.py` run the re-checks it needs (the rows past 3 standard errors) as part of the run.
2. Or stamp `recheck.json` with the rules state and run time, and refuse to render a stale one.

### 12. Minor: the fresh-cut trial counts are conditional, and section 8 does not say so

**Location:** `tools/sim/families.py` `solo_job` (lines 205 to 227); README trials table; report section 8.

**Problem:** A trial whose three Break Attention attempts fail, or whose gear stops working, is skipped and not counted. The Rookie's Stress 0 cell reports 97,140 cuts of 100,000 trials. That is the right measurement point (a cut directly after Break Attention), and my independent script does the same. But the README and section 8 say 100,000 trials, and nowhere is the share that never reached a cut printed.

**Play scenario:** A reader computing the standard error from "100,000 trials" gets it slightly wrong. More usefully, they cannot see that about 3% of Rookies at Stress 0 never get a fresh cut at all.

**Fix options:**
1. Report cuts and the share of trials that reached a cut beside each solo cell.
2. Say in section 8 that solo trials count cuts.

### 13. Minor: section 9 lists a rule as a simplification

**Location:** report section 9, line 542 ("Squadmates are Rookie builds that never Push or Cover").

**Problem:** The sentence mixes two different things:
- **A rule.** A Squadmate never Pushing or Covering is the rule (`squadmates.yaml` lines 51 to 55 and 82), not a simplification.
- **A reference choice.** Helper Squadmates being the Rookie reference build at fight-start Stress 1 is a choice. `squadmates.yaml` builds a Squadmate from a template at Stress 0, and the simulator follows ADR-0014's "all Rookies" Squad instead.

Listing both as simplifications makes a reader think the helper rows understate Squadmates.

**Play scenario:** A reader weighing the helpers row, which sits at 0.0 and 0.3 standard errors on the Abnormal's ceiling, reads "never Push or Cover" as a modelling gap and discounts the verdict, when it is the rule.

**Fix options:**
1. Move "never Push or Cover" out of the simplifications, citing `squadmates.yaml`.
2. State that helper Squadmates use the ADR-0014 Rookie build at Stress 1 rather than a template at Stress 0, and why.

## Appendix: reviewer scripts (session scratchpad, not committed)

- **`repro.py`:** reruns every case whose key matches a pattern, at its committed seed, through `run.run_cases`, and compares `cfg` and every summary field with `results.json`. It covered `ch5`, `ch6`, `solo`, `grab`, `lone`, and `gas`: 186 cases, 0 differ.
- **`repro2.py`:** reruns `bar`, `grab_alone`, and `jam`, then selects the second seed with `run.second_seed_cases` and pools with `families.merge`, as `run.py` does. Result: 420 cases, 0 differ; the same four second-seed rows; all four pooled figures match.
- **`recheck.py` and the route check:** `recheck.py` rerun unchanged in the scratch copy gives an identical `recheck.json`. `families.route_check()` gives the committed `route`.
- **`indep.py`:** an independent dice core written from `dice-pool.yaml` and `stress-responses.yaml`, sharing no code with `tools/sim`. It runs the fresh lone cut (400,000 trials per cell) and computes the gas medians and means exactly, with fractions.
- **Ceiling with end Death Rolls:** `barcheck.check` rerun on every bar and Grab-alone row with `deaths` replaced by `deaths_all` and `deaths_se` by `deaths_all_se`, pairing twins exactly as `run.py` does.
- **Aftermath roll estimate:** 200,000 trials per Stress level of Wits 2 plus Talent 1 base dice, a medical kit Gear Die, Stress Dice, and one Push, needing 1. It gives 79.1%, 80.7%, 82.3%, and 84.1% at Stress 1 to 4.
- **`lonegap.py`:** wraps `policy.lone_end` to record every no-decoy ending with the Titan's state and the soldier's Position, and reruns the 5 route rows, 4 of them at no flares, and 2 at no flares and no horse with working gear (20,000 lone fights each). A separate loop of 5,000 "open grounded" lone fights records where the soldier ends Down or dead.
