# Dice simulator: review round 3

Reviewed:

- Everything in `tools/sim/` (`README.md` first), `tools/sim/results/results.json`, and `docs/reviews/simulator-report.md` (rendered 2026-09-15T02:31:21Z).
- The round 2 reviews: `docs/reviews/simulator-review-2.md` and `docs/reviews/simulator-review-2-codex.md`.

Checked against:

- `CONTEXT.md`, ADR-0014 as amended through batch 5c, and ADR-0010's batch 5 and 5b paragraphs.
- `docs/rules/DECISIONS-2026-09-14.md` batch 5 (5-1 to 5-19).
- `docs/rules/OPEN-QUESTIONS.md`: OQ-115 to OQ-132, re-read at the end of this review.
- Chapters 3 to 6 where the code reads them: the retreat, the ending, the Grab, the end steps, and the interim day.
- The YAML the batch 5 code reads: `background-titans.yaml`, `engagement-flow.yaml`, `engagement-setup.yaml`, `round.yaml`, `positions.yaml`, `grab.yaml`, `engagement-end.yaml`, `healing.yaml`, `grief.yaml`, and both `tuning.yaml` files (`targets`, `tolerance`, `simulator_cases`).

I did not read `simulator-review-3-codex.md`. Every run was made in a copy of the repository in the session scratchpad, and nothing in the repository was written except this file. The appendix lists the scripts.

**Method: a targeted rerun, not the full run.** I started the full run, but the machine was shared (load average 49 on 14 cores) and it had reached 2,000 of 13,888 chunks after 444 s, so I stopped it. Instead, under the brief's fallback:
- **Committed seeds.** I re-ran every target case, the Medium and Large reference rows, both bar orders of the Medium and Large reference and helpers twins, and a sample of ten other cases, on their committed seeds and chunks.
- **Fresh seeds.** I ran the same targets, bands, and a bar row on new seeds at up to ten times the committed counts.

Severity follows the brief:
- **Critical:** a divergence from the rules as written that changes a target's or bar's result; a target or bar reported Met that is not; a testable target left untested and unlogged; a Missed item not logged; a report claim that is false; or a report number that does not reproduce.
- **Major:** hard-coded values duplicating YAML; insufficient trials for the quoted precision; an unmeasured required case neither logged nor reported beside its target; or a significant fidelity simplification that does not change a result.
- **Minor:** clarity, documentation, and small gaps.

## Verdict

**0 Critical, 1 Major, 6 Minor.**

Every round 2 Critical and Major is resolved:
- **The horizon is gone.** Batch 5's retreat clock is in every full fight, the ending matches `engagement-flow.yaml`, and no fight reaches the safety cap.
- **Targets 3 and 4 carry verdicts** on 5-11's tolerances.
- **The setup mix** prints Chapter 6's reading beside the committed figures.
- **Gas Rolls** are made when a fight ends partway through a round.
- **Duplicated values.** Chapter 5's value rows and the Jam test's dimensions are parsed from YAML.

The numbers hold:
- **Reproduction.** Every figure I re-ran on committed seeds is identical.
- **Fresh seeds.** Every target, band, and bar figure agrees within sampling.
- **Verdicts.** Every ADR-0014 target is Met on its batch 5 tolerance. The Medium deaths band is Missed on the reading 5-19 decided, and it is logged as OQ-132.

The one Major is that the committed report no longer matches the register or the ADR, and the way to regenerate it is broken in two places:
- **Stale text.** The report still says the Medium miss has no Open Question and that OQ-128 lists the wrong gaps.
- **Hand-written maps.** `report.py` keeps both statements in maps that a re-render repeats.
- **Refused re-render.** `--report` now refuses to render, because the rules hash has changed.
- **Crash on the next run.** The wording 5-19 orders into `data/titans/tuning.yaml` makes the next full run raise after its whole case pass.

## Checks that passed

### Reproduction on committed seeds

`repro.py` and `repro_sample.py` split each case into 16 chunks exactly as `run.run_cases` does, and compare every summary field with `results.json`.

- **Identical in every field (21 cases):**
  - `ch6` Medium and Large reference starts;
  - `solo/nd4/rookie/stress1` and `solo/nd4/levi_grade/stress2`;
  - the Grab alone and all six Grab cells;
  - both gas cases;
  - in both sheet orders, the bar's Medium and Large reference rows and the Sprinting Abnormal and Large helpers rows.
- **The sample of ten other families:**
  - identical in every field: `ch5/reference`, `ch5/large`, `lone/standard-medium/waiting`, `lone/route/open grounded`, one probe Jam cell, one full-fight Jam row, the Rookie dodge at Severity 3, one setup row on Open, and the Treat Injury sensitivity row;
  - the sequence row: identical except two of 128 per-fight means in the sequence row, which differ by at most 1.1e-16 (float summation order: `run_cases` merges chunks in completion order).
- **Seeds and trials.** Seeds are deterministic and independent of the CPU count. No second-seed run was due: no judged figure lay within 2 standard errors past an edge.

### Fresh seeds against the committed figures

`fresh.py` runs each case in 28 chunks on `random.Random((S + 7,777,000) × 100 + i)`, clear of every committed chunk seed.

| Figure | Committed (trials) | Fresh seeds (trials) | z | Tolerance | Result |
| --- | --- | --- | --- | --- | --- |
| Target 1, median kill round, standard Medium Titan | 3; 41.4% by round 2, 62.0% by round 3 (12,000) | 3; 41.2%, 61.6% (119,980) | by round 3: −0.9 | exactly 3 | Met |
| Target 2, the Rookie's fresh cut | 13.02% ± 0.11 | 13.14% ± 0.08 (195,985 cuts) | +0.9 | 8% to 14% | Met |
| Target 3, the Levi-grade soldier's fresh cut | 47.22% ± 0.16 | 47.40% ± 0.11 (199,457 cuts) | +0.9 | 45% to 55% | Met |
| Target 4, a Grab alone | 69.95% ± 0.16 | 69.76% ± 0.15 (99,988) | −0.9 | 61.7% to 71.7% | Met |
| Target 4, Stress 2, Grief 0 | 33.20% | 33.38% ± 0.20 (56,000) | +0.6 | 28.3% to 38.3% | Met |
| Target 4, worst cell (Stress 3, Grief 1) | 45.01% | 45.63% ± 0.21 (56,000) | +1.9 | under 50% | Met |
| Target 5, gas medians (means) | 8 (9.24) and 6 (6.34) | 8 (9.26) and 6 (6.34) (199,976 each) |  | exactly 8 and 6 | Met |
| Medium deaths, reference start, **through the end** | 0.0573 ± 0.0030 (12,000) | 0.0546 ± 0.0009 (119,980), 5.2 SE past | −0.8 | at most 0.05 | Missed, logged (OQ-132) |
| The same, during the fight | 0.0500 ± 0.0029 | 0.0486 ± 0.0009, 1.6 SE inside | −0.5 | not judged (5-19) | reported |
| Medium deaths, bar's run cutters first, through the end / during | 0.0546 / 0.0485 (120,000) | 0.0553 (5.9 SE past) / 0.0494 (119,980) | +0.6 / +0.7 | at most 0.05 | Missed, logged / reported |
| Medium deaths, bar's run strikers first, through the end / during | 0.0552 / 0.0493 | 0.0549 (5.5 SE past) / 0.0488 | −0.2 / −0.5 | at most 0.05 | Missed, logged / reported |
| Large no kill, reference start | 14.57% ± 0.32 (12,000) | 14.25% ± 0.14 (59,976) | −0.9 | at most 15% | Met |
| Bar helpers ceiling, cutters first, through the end | 0.0420 vs Large twin 0.0585, −12.7 SE | 0.0444 vs 0.0569, −6.9 SE (59,976 each) | Abnormal +1.8, twin −0.9 | at most the twin | holds |
| The same, during the fight | 0.0334 vs 0.0481, −12.1 SE | 0.0352 vs 0.0471, −7.0 SE |  | at most the twin | holds |

So on either death reading the Medium verdict is decided by the bands, not by the seed:
- **Through the end,** every run is more than 5 standard errors past the band.
- **During the fight,** every run is inside it.

The Medium reference start's no-kill figure (7.44% on 12,000 fights) is 2.5 standard errors below the fresh figure of 8.06%. That is a sampling draw, not a model difference: the bar's two runs of the same start give 8.16% and 8.06%. No band reads Medium no-kill. Finding 2 covers what it means for judging.

### Snapshot, renderer, and report provenance

- **The rules snapshot postdates batch 5b.** It was taken at 02:22:02Z.
  - Its `DECISIONS-2026-09-14.md` hash, `b2a0dd6f6773`, is the file that holds 5-13 to 5-18 and not 5-19.
  - `background-titans.yaml` was last written at 02:15:30Z, before the snapshot. Its hash `3094f779697c` is the same at the start, after the run, and now.
  - So the retreat actions row changed before the run, not during it, contrary to the drafter's note. The header is right to list only `PROGRESS.md` and `report.py` as changed during the run.
- **The renderer is identified.** Section 13 prints `report.py` `040a54e20642` at rendering, which is the current file, beside the run's `3c3d310b29f4`. The engine hash at rendering is the run's.
- **Files changed since the run.**
  - `docs/adr/0014-numbers-tuned-to-design-targets.md`, `docs/rules/DECISIONS-2026-09-14.md`, and `docs/rules/OPEN-QUESTIONS.md` changed at 02:34:01Z (batch 5c).
  - `PROGRESS.md` changed again after rendering; it is outside the rules hash.
  - Finding 1 covers the consequence.

### Fidelity to batch 5 and 5b where they touch a measured case

- **5-10, the retreat clock:**
  - **When it fills.** `engine.Fight.end_steps` makes the Gas Rolls, fills Regeneration, then fills the clock (`rnd >= R.retreat_clock`, 8 from `engagement-setup.yaml`). It never fills during a retreat. That is `round.yaml`'s order.
  - **Wording checks.** `rules.py` raises if the `ticks`, `stopped`, `starts`, `order`, `actions`, `always_ends`, or `left_behind` wording changes.
  - **The ending.** A fight ends by a kill or when no standing soldier holds a Position (soldiers who have left are not standing). Every soldier still present then dies unwitnessed (`Fight.finish`), as `left_behind` and `no-returner` state.
  - **The safety cap.** No fight in any of the 268 full-fight runs reached it.
- **5-1 and 5-13, the retreat's order:**
  - `policy.retreat_turn` moves first. Its exceptions are the action for a Grabbed or Down comrade followed by the stay, and a lift followed by the move out.
  - `Help` and dodge Help skip a bound soldier who has not moved.
  - Finding 3 covers what the engine's guard does not check.
- **5-15, no Nape strike in a retreat.** `can_nape` is false during a retreat, `nape_strike` raises, and `policy.after_decoy` takes no Hook and Cut then. No striker or rescue turn runs in a retreat.
- **5-2 and 5-16, the interim day.** `Fight.day_passes` runs:
  1. the care window over the whole Squad, with Field Repair;
  2. day-limit Death Rolls;
  3. Health restored;
  4. healing time.

  `sequence_job` then promotes, adds the new characters, and makes the interim issue. Grief from a day's deaths follows `grief.yaml` (1 in total) and is capped.
- **5-4, last Positions.** Positions are kept at the kill, and the aftermath and care-window tests read them. `Fight.apart` applies `soldiers_who_left.same_position`.
- **5-6, the hold before the crush.** `grab_lands` makes the target Grabbed before the crush, so a target the crush makes Down does not fall.
- **The rest of batch 5:**
  - **5-8.** Draw Attention is barred from Distant (`R.draw_barred_positions`, from `attention.yaml`).
  - **5-12.** Pry Loose reads its own row.
  - **5-14.** The first-Titan-Engagement row is reported, not judged.
  - **5-18.** No step shares out items.
- **5-19, the deaths reading.** Bands and the bar are judged on `deaths_all` (`targets.BAND_FIELDS`, `barcheck.READINGS`), the reading 5-19 decided.
- **Codex round 2 Major 1.** `_play_round` makes the round's Gas Rolls before `finish` when a rule ends the fight mid-round. `kill` makes a dying soldier's Gas Roll.

### Coverage and logging

- **Section 12's counts are right:** 14 measured, 10 partly measured, 1 not measured, and 1 deferred, of 26 items.
- **Every partly or not measured item names its Open Question**, except item 10 (finding 5).
- **The one Missed result is logged.** Re-read at the end of this review, OQ-132 is open with the figures and four levers, 5-19 decides the reading, and ADR-0014's batch 5c paragraph records the miss.
- **Target 6 (Expedition)** is Deferred.

## Findings

### 1. Major: the committed report contradicts the register and ADR it cites, and neither a re-render nor the next run can fix it as the code stands

**Location:**
- `docs/reviews/simulator-report.md`:
  - the Summary ("Missed results: 3 (... no Open Question ...)");
  - section 3 (three rows "Missed (no Open Question logged)");
  - section 11 ("The gaps not explained differ from those OQ-128 lists; that entry needs the rows above");
  - section 16's closing line.
- `tools/sim/report.py` line 51 (`MISSED_OQ = {}`) and lines 59 to 64 (`PROBE_GAPS_LOGGED`, still three gaps).
- `docs/rules/OPEN-QUESTIONS.md`:
  - OQ-132, *Current handling*: "the tuning files name the reading and the miss beside the band, and the report renders it Missed (OQ-132)";
  - OQ-128, its *Revised by batch 5 (5-19)* line.
- `docs/rules/DECISIONS-2026-09-14.md` 5-19, *Chapter impact*.
- `data/titans/tuning.yaml` line 195.
- `tools/sim/rules.py` `tolerance_of` (lines 85 to 105).
- `tools/sim/targets.py` `specs` (lines 81 to 86), first called from `run.second_seed_cases` after every case has run.
- `tools/sim/run.py` `stale_files`.

**Problem:** Three minutes after the report was rendered, batch 5c recorded the miss:
- **The register.** 5-19 decides the reading, OQ-132 logs the Medium miss, and OQ-128 is revised to the Flier dodge alone.
- **The report.** It still says the miss has no Open Question and that OQ-128 lists the wrong gaps.
- **OQ-132.** It says the report "renders it Missed (OQ-132)", which it does not.

Three things stop the report from catching up:
1. **Re-rendering repeats the stale text.** Both statements come from hand-written maps in `report.py`: `MISSED_OQ` is empty, and `PROBE_GAPS_LOGGED` lists the Small helpers row and the bar twin that OQ-128 no longer lists.
2. **`run.py --report` refuses.** `docs/adr/0014-...` and `DECISIONS-2026-09-14.md` are in the rules hash and changed after the run. Only `--stale-ok` renders, under a stale banner.
3. **The next full run raises after its case pass.**
   - **The trigger.** 5-19's chapter impact rewrites `targets.medium.at_the_reference_start.deaths_per_fight` to "at most 0.05, deaths through the end of the Titan Engagement; deaths during the fight reported beside it".
   - **The failure.** `tolerance_of` matches with `re.fullmatch`. On that exact string it raises `cannot read a tolerance` (tested in the scratch copy).
   - **When.** `targets.specs` first calls it inside `second_seed_cases`, so the run stops only after all 868 cases (about 512 s unloaded) have run.

**Why Major and not Critical:**
- **What is sound.** Every figure reproduces, the miss is decided and logged, and the stale sentences were true when rendered.
- **What is not.** Until this is fixed, the one document a decider on OQ-132 reads says that no entry exists. OQ-132's own *Current handling* also describes a report that does not exist yet.

**Play scenario:**
1. The drafter applies 5-19's chapter impact to both tuning files. The OQ-132 decider then asks for the simulator case that entry names, the Medium row under option (b).
2. The drafter adds the policy and runs the one command. It runs for eight minutes, then stops in `tolerance_of`.
3. To get something to the decider, the drafter re-renders the old results with `--stale-ok`.
4. The decider opens a report whose Summary says "no Open Question" beside the band they were asked to decide, and whose section 11 says OQ-128 "needs the rows above". The decider cannot tell whether OQ-132 was ever seen by the simulator.

**Fix options:**
1. **Map the register in `report.py`.** Map the three Medium deaths rows to OQ-132 and set `PROBE_GAPS_LOGGED` to the Flier dodge alone. Better, read both from `OPEN-QUESTIONS.md` (for example, from each Simulator target entry's *Simulator case* line), so the register drives the report and a stale map raises.
2. **Keep the band machine-readable.** Either have `tolerance_of` read the band before the first comma, or put the reading in its own key (`deaths_reading: through the end`). Have `targets.py` check that the reading matches `deaths_all`. Build `targets.specs` once at import, so a wording change stops the run before the case pass.
3. **Rerun after the edits land.** Once 5-19's YAML and chapter edits land, run the one command so the snapshot records batch 5c. Do not use `--stale-ok`.

### 2. Minor: three judging readings in `targets.py` can decide a future verdict and are not logged

**Location:**
- `tools/sim/targets.py`: the module docstring (lines 8 to 12), `specs` (lines 75 to 86), and `judge`.
- `docs/reviews/simulator-report.md` section 14, the bullets *The pooled judgement* and *Every run of a reference start is judged*.
- Decision 5-11 ("judged on the figure pooled over both, as the Abnormal's bar is (4b-4)").

**Problem:** Section 14 labels these readings PROVISIONAL, but no Open Question carries them:
1. **The pooled figure.** A pooled second-seed figure is Met only strictly inside the band. 5-11 says it is judged "as the Abnormal's bar is", and the bar keeps a margin of 2 standard errors on the pooled figure. Either reading fits the words.
2. **Every run judged on its own.** Each run of a reference start is judged separately: Chapter 6's 12,000-fight row and the bar's two 120,000-fight rows. A band is met only if all three are. The 12,000-fight row has 3.2 times the standard error of the others, so it decides most edge cases. This run shows the effect on the Medium no-kill figure: the 12,000-fight row reads 7.44%, against 8.16% and 8.06% on the bar's runs and 8.06% on fresh seeds.
3. **The Large no-kill band.** The 12,000-fight row is 1.3 standard errors inside its edge (14.57% ± 0.32), while the bar's two runs are 5.6 to 5.8 inside. At the pooled 14.42%, a fresh 12,000-fight row lands above 15% about 4% of the time. That row then goes to a second seed, and on reading 1 it can be Missed on a pooled 15.1%, while 240,000 fights of the same start say 14.4%.

No verdict changes today: no second seed was due.

**Play scenario:** A later Behavior Table edit leaves the standard Large Titan unchanged. Its 12,000-fight row draws 15.2%, and the second seed pools to 15.05%. The report prints "Missed" for the Large band, and a decision retunes the Large Titan, which the 240,000 bar fights show was never past.

**Fix options:**
1. Log a Simulator target entry that asks which margin a pooled figure keeps, and whether runs of one start are judged separately or pooled.
2. Judge each band on the figure pooled over every run of its reference start, since the sheet order chooses nothing (batch 4, 4-4), and print the runs beside it.

### 3. Minor: the retreat's order guard is looser than section 14 and the README say, and soldiers who have left take no action

**Location:**
- `tools/sim/engine.py`:
  - `order_check` (lines 321 to 325);
  - `stay` (lines 363 to 368);
  - the `stay_for` arguments in `treat` (line 624), `pry_loose` (line 1102), `body_strike` (line 1139), and `break_attention` (line 1269);
  - `soldier_turn` (lines 1319 to 1323).
- `docs/reviews/simulator-report.md` section 14, the retreat bullet ("the engine raises when a policy acts first, except ..."); `tools/sim/README.md`, *Decision batch 5*.
- `data/engagement/positions.yaml`, `leaving`, `after_leaving` (`action`, `same_position`).

**Problem:**
1. **The guard does not check the move that follows.** An action for a fallen comrade at the soldier's Position passes `order_check` through `stay_for`. Nothing then checks that the next move is option 4's stay.
   - A policy could treat a Down comrade and then step toward Distant, which is action before the forced move. The engine would not raise.
   - `stay` checks only that some action was spent, not that it was one of `R.retreat_stay_actions` taken for that comrade.
   - Today's policy always stays after those actions, so no figure is affected.
2. **Soldiers who have left take no action.** `after_leaving.action` allows any Catalog entry that needs no Position relative to a Titan. `same_position` names Treat Injury between soldiers who have both left.
   - The engine takes no action for a soldier who has left: "no action a policy takes is modelled", in a code comment only.
   - The baseline takes no Treat Injury during the fight, so the reference rows follow their policy. But the treat rows also omit a carried-out comrade treated by the soldier who carried them.
   - Section 14 does not say this.

**Play scenario:** OQ-132's option (b) asks for Treat Injury during the retreat. A policy author extends `retreat_turn` to treat a Down comrade and then carry on out. The engine accepts it, although the treat must be followed by the stay. The row then reports a rescue the order rule forbids, as evidence for closing the Medium band.

**Fix options:**
1. Record the comrade an action was taken for (`s.acted_for`). Make every retreat move other than `stay`, or the move after a lift, raise when the action came first. Make `stay` require `acted_for is c` and an action in `R.retreat_stay_actions`.
2. State in section 14 and the README that soldiers who have left take no action (a POLICY CHOICE), and name the rescue that leaves out.

### 4. Minor: OQ-132's option (b) names a step that cannot prevent end Death Rolls; OQ-115 and OQ-116 lag the code

**Location:**
- `docs/rules/OPEN-QUESTIONS.md`:
  - OQ-132, option (b) and *Simulator case*;
  - OQ-115, title and *Question*;
  - OQ-116, *Provisional choice*.
- `data/harm/engagement-end.yaml`, `steps` (`aftermath-rolls`, `death-rolls`, `care-window`).
- `docs/reviews/simulator-report.md` sections 6.11 and 14 (*Not modelled*).

**Problem:**
- **OQ-132 (b)** proposes "the care window's treatment of the injuries that become end Death Rolls", and says the reference Squad does not use it.
  - The care window comes after the Death Rolls in `engagement-end.yaml`, and the simulator runs it after every fight.
  - The step that treats before an end Death Roll is the aftermath roll, which the simulator also runs.
  - The rescue the rules give that no row uses is Treat Injury by soldiers who have left (finding 3).
- **OQ-115** is still titled and worded as if the retreat and leaving were not modelled; both are now in every full fight. The report cites OQ-115 for "leaving and returning outside a retreat", which the entry does not name.
- **OQ-116** does not list the reading section 6.11 adds: a new character for a player whose character the interim day killed joins at that session's start.

**Play scenario:** The decider on OQ-132 orders option (b)'s case as written. The drafter finds the care window already in every row, adds nothing, and reports that (b) has no effect. The one policy lever the rules give (treatment by soldiers who have left, and Treat Injury on a Down comrade before the lift) is never measured, and the band is re-set under (a) by default.

**Fix options:**
1. **OQ-132 (b).** Name the aftermath roll and Treat Injury by soldiers who have left, and drop the care window.
2. **OQ-115.** Re-title it to two Focus Titans, Background Titans, and leaving and returning outside a retreat, and move the retreat to its batch 5 line.
3. **OQ-116.** Add the interim day's new-character reading.

### 5. Minor: `simulator_cases` item 10's unmeasured parts carry no Open Question

**Location:** `docs/reviews/simulator-report.md` section 12, `data/engagement/tuning.yaml` item 10 ("Partly measured", Open Question column empty); `tools/sim/report.py` `COVERAGE`.

**Problem:** Item 10 asks for "eyes and arm Toughness for every Size Class":
- **What is not measured.** Section 12 names the gaps correctly: eye strikes on Chapter 5's reference Titan at the Small and Large Size Classes, and any change to arm Toughness.
- **What is missing.** No entry logs them. Every other partly or not measured row names one.

**Play scenario:** A decider weighing Large arm Toughness 4 against the Large no-kill band's 14.6% searches the register for a measurement or a pending one. They find nothing, and assume none is due.

**Fix options:**
1. Add item 10's gaps to a Simulator target entry and cite it in the row.
2. Or add an eye-strike row at each Size Class and an arm Toughness ±1 row per class.

### 6. Minor: the setup mix's Chapter 6 reading sits beyond 3 standard errors with no explanation

**Location:** `docs/reviews/simulator-report.md` section 6.9 (deaths during the fight 0.074, committed 0.065, z +3.0; 0.078 against 0.070, z +3.1) and section 11 (the comparison count and re-checks, which leave the mix out).

**Problem:** The mix is a weighted sum of the reference rows, so the gap has a source the report can name:
- **The source.** The standard Small Titan's reference row is +3.4 from its committed figure (0.058 against 0.042). Its re-check on 60,000 fights gives 0.049.
- **The effect.** On the re-check, the mix without the Abnormal roll reads about 0.071 against 0.065, about +2 standard errors.
- **The omission.** Section 11 counts 999 comparisons and re-checks those past 3. The mix's two figures are past 3 and appear in neither the count, the re-checks, nor OQ-128.

**Play scenario:** A decider on OQ-104 reads section 6.9's +3.1 and concludes that the simulator and Chapter 6 disagree on what the setup table costs. The difference is one Small row's first draw.

**Fix options:**
1. Include derived figures in the comparison, and generate their explanation from the re-checked rows.
2. Print the mix computed from re-checked rows beside it.

### 7. Minor: small values still written in both YAML and code

**Location:**
- `tools/sim/engine.py` line 94, `SAFETY_CAP = 60` (`data/engagement/tuning.yaml`, `probes.files`, "a safety cap of 60", and `model.retreat`, "a safety cap of 60 rounds").
- `tools/sim/cases.py` `grab_alone_over`: `grab["severity"] + 1`, against `data/titans/tuning.yaml`'s verdict text "Headlong Lunge at Severity 3".
- `tools/sim/policy.py` `build_squad` and `tools/sim/families.py` `sequence_job`: the baseline roles `["cutter", "cutter", "striker", "striker"]` and the template roles, against `prepared_squad_kill.model.squad` ("two cutters and two strikers"; "the Slayer and Flier templates as strikers and the Brawler and Hunter as cutters").
- `tools/sim/cases.py` `_lone`: the lines `["waiting", "hurried", "one_card_hold"]`.

**Problem:** None of these changes a figure today, and round 2's named duplications are all fixed. But these values are written in both places. A change in the YAML would not reach the run, and nothing would raise.

**Play scenario:** A decision on OQ-112 changes the baseline Squad to three strikers and one cutter in `model.squad`. `build_squad` still deals two and two, and every target row is re-measured under the old Squad.

**Fix options:**
1. Parse the roles, the template assignment, and the Grab-alone variant's step from their YAML text with patterns that raise, as `_ch5` does.
2. Read the safety cap from `model.retreat`.

## Round 2 findings

| Finding | Status |
| --- | --- |
| Opus 1 (Critical): the horizon misstated, no rule ending a long fight | Resolved. Decided in 5-10: the retreat clock is in every full fight, `finish` ends by a kill or no standing soldier with left-behind deaths, and no fight reaches `SAFETY_CAP`. Section 14 states that reading exactly |
| Opus 2 (Major): setup mix re-read with Anchor Ratings | Resolved. Section 6.9 prints Chapter 6's reading with committed figures and z, the Anchor reading labelled, and Open's share. Its z of +3.0 and +3.1 is finding 6 |
| Opus 3 (Major): Targets 3 and 4 with no verdict | Resolved. 5-11's tolerances are read from both tuning files and cross-checked; Met, confirmed on fresh seeds |
| Opus 4 (Major): case values duplicated in `cases.py` and `rules.py` | Resolved for every value named: the Chapter 5 Severity and rejected-alternative rows are parsed from their case text, and the Jam test's counts, mixed pairs, and limit are parsed. Residual values: finding 7 |
| Opus 5 (Minor): the Open lone policy | Resolved. No Break Attention with no route; the pull-back holds while a decoy holds; dead On Body 13.6% |
| Opus 6 (Minor): the full-fight Jam test judged Met | Resolved: Reported |
| Opus 7 (Minor): eyes and arm Toughness row said Measured | Resolved (Partly measured, gaps named). Not logged: finding 5 |
| Opus 8 (Minor): three unexplained probe gaps | Logged (OQ-128, revised by 5-19 to the Flier dodge). The report's map is stale: finding 1 |
| Opus 9 (Minor): Pry Loose read Break Free's row | Resolved (`R.pry_loose_needs`, `R.pry_loose_lifted_penalty`) |
| Opus 10 (Minor): renderer not identified | Resolved (section 13's rendering table) |
| Opus 11 (Minor): sequence readings not in OQ-116 | Resolved in part. One new reading is missing: finding 4 |
| Opus 12 (Minor): section 14 policy text and pointers | Resolved. The aftermath and Wings bullets match `policy.py`, and the `finish` docstring no longer points at section 12 |
| Codex 1 (Major): no Gas Rolls at a mid-round end | Resolved. `_play_round` makes them before `finish`, and `kill` makes a dying soldier's |
| Codex 2 (Major): targets with no tolerance | Resolved (5-11) |
| Codex 3 (Minor): Grief stored above the maximum | Resolved. `end_engagement` and `day_passes` cap at `R.grief_max` |
| Codex 4 (Minor): the renderer's judgments not identified | Resolved (render snapshot) |

## Appendix: reviewer scripts (session scratchpad, not committed)

- **Full run.** `run.py` in a copy of the repository taken at 02:33Z (rules hash as in `results.json`). Stopped at 2,000 of 13,888 chunks after 444 s, because the machine was shared.
- **`repro.py`.** Re-runs 21 cases (the targets, the Medium and Large reference rows, and four bar rows in each order) on their committed seeds and 16-chunk split through `run.run_cases`. It compares every summary field with `results.json`: all identical (63 s).
- **`repro_sample.py` and `seqcheck.py`.** Ten further cases across the Chapter 5, lone, probe Jam, full-fight Jam, dodge, setup, sensitivity, and sequence families: identical except two of 128 per-fight means in the sequence row, which differ by at most 1.1e-16 (float summation order: `run_cases` merges chunks in completion order).
- **`fresh.py`.** The targets, the Medium and Large bands in both death readings, both bar orders of the Medium reference, and the helpers ceiling row pair. It uses 28 chunks a case on seeds above 7,777,000, at 56,000 to 200,000 trials.
- **Tolerance test.** `rules.tolerance_of` on "at most 0.05" returns an upper edge of 0.05. On 5-19's wording, "at most 0.05, deaths through the end of the Titan Engagement; deaths during the fight reported beside it", it raises `ValueError`.
- **Snapshot check.** Current SHA-256 of every file under `docs/rules/`, `docs/adr/`, `data/`, and `tools/sim/`, against `results.json`'s `snapshot` and `snapshot_after_run`, with file modification times.
