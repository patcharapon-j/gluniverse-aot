# Dice simulator: review round 2

Reviewed:

- Everything in `tools/sim/` (`README.md` first), `tools/sim/results/results.json`, and `docs/reviews/simulator-report.md`.
- The round 1 reviews: `docs/reviews/simulator-review-1.md` and `docs/reviews/simulator-review-1-codex.md`.

Checked against:

- `CONTEXT.md` and ADR-0014 as amended through decision batch 4b.
- Chapters 1 to 6 where the code reads them: Chapter 1's pool rules, Chapter 2's `attribute_alone`, and Chapter 3's sections 3.4, 3.5, and 3.16 (Death Rolls, Treat Injury, aftermath rolls, and the end of a Titan Engagement).
- `docs/rules/DECISIONS-2026-09-14.md` batch 4b, and `docs/rules/OPEN-QUESTIONS.md` (OQ-50, OQ-78, OQ-114 to OQ-118).
- The YAML the new code reads: `engagement-end.yaml`, `treat-injury.yaml`, `death-rolls.yaml`, `stress-changes.yaml`, `dice-pool.yaml`, `action-catalog.yaml`, `squadmates.yaml`, `grief.yaml`, `standard-issue.yaml`, `engagement-flow.yaml`, `engagement-setup.yaml`, `anchor-ratings.yaml`, `read.yaml`, `round.yaml`, `grab.yaml`, `talents.yaml`, and both `tuning.yaml` files.
- The committed probe `tools/probes/chapter-05/fight.py`, for its horizon.

I did not read `simulator-review-2-codex.md`. Every run was made in a copy of the repository in the session scratchpad. Nothing in the repository was written except this file. The appendix lists the scripts.

Severity follows the brief:
- **Critical:** a divergence from the rules as written that changes a target's or bar's result; a target or bar reported Met that is not; a testable target left untested and unlogged; a report claim that is false; or a report number that does not reproduce.
- **Major:** hard-coded values duplicating YAML; insufficient trials for the quoted precision; an unmeasured required case neither logged nor reported beside its target; or a significant fidelity simplification that does not change a result.
- **Minor:** clarity, documentation, and small gaps.

## Verdict

**1 Critical, 3 Major, 8 Minor.**

This round fixes most of what round 1 found:
- **Reproduction.** The full run reproduces every committed figure exactly.
- **New measurements.** The move-up shares are computed. The end-of-engagement steps run in the order Chapter 3 gives. The ADR-0014 reports sit beside their targets. Read, Wings, swaps, Pry Loose, eye strikes, and the full-fight Jam test are modelled.
- **Honest gaps.** The Summary calls coverage partial, and its counts (16, 7, 2, 1 of 26) match section 12. Every gap it names is logged as OQ-115 to OQ-118.
- **Targets.** No target, band, or bar result changes under the rules as the code reads them.

The one Critical is a false statement about the reading every death figure depends on:
- **What the report says.** Section 14 says a soldier still Down or Grabbed at the 12-round horizon is left behind and counted as a death.
- **What the code does.** It runs aftermath rolls and end Death Rolls for those soldiers, beside a Titan that still stands. No rule ends a Titan Engagement there.
- **Under the stated reading, the Medium deaths band fails:** at least 0.101 against at most 0.05.
- **Under the code's reading, the horizon supplies the helpers ceiling's margin.** On the committed bar fights the ceiling holds by −4.2 standard errors as the code reads the horizon. With no end steps at the horizon it holds only within sampling, at +1.7. The aftermath rolls, which the drafter's note credits with the hold, are not what decides it: with every aftermath roll removed the row still holds (−3.4).

## Checks that passed

- **Reproduction.** I reran `uv run --with pyyaml python tools/sim/run.py` in the scratch copy: 832 cases, 49,916,000 trials, 868 s on 14 processes (shared with my probes).
  - All 832 cases are identical to the committed `results.json` in configuration, trials, seed, and every summary field. So are `pooled` (empty), the 6 re-checks and their probe re-run, the move-up `shares`, and the `route` search.
  - The second-seed pass again selects no bar row.
  - The rendered report differs only in run time, snapshot time, the hashes of `report.py` and `PROGRESS.md`, and the order of four rows in section 8 (see finding 10).
- **Rules snapshot.** Every file under `docs/rules/`, `docs/adr/`, and `data/` hashes as `results.json` records, except `PROGRESS.md`, which the staleness test leaves out. No file was added. The rules hash `cf5de67236fa50b4` and the engine hash `c792aa9960946ca7` repeat on the rerun.
- **Targets.** Each target carries its number and result:

  | Target | Figure | Result |
  | --- | --- | --- |
  | 1 | Median kill round 3 on the standard Medium Titan; 41.9% ± 0.5 killed by round 2 | Met |
  | 2 | 13.0% ± 0.1, band 8% to 14% | Met |
  | 3 | 47.2% ± 0.2 | Reported |
  | 4 | 69.9% ± 0.2 alone; 33.2% ± 0.2 at Stress 2, Grief 0; worst cell 45.0%, every cell under 50% | Worst cell Met, the rest Reported |
  | 5 | Gas medians 8 and 6 (means 9.24 and 6.34) | Met |
  | 6 | Expedition | Deferred |

  The Chapter 6 bands and the Sprinting Abnormal's bar hold as printed. Finding 3 covers the targets marked Reported.
- **The aftermath order is Chapter 3's.** `engine.Fight.end_engagement` runs `engagement-end.yaml`'s steps in order, and raises if the list changes:
  1. Turns.
  2. End-of-Engagement Stress relief, stacked on the Nape kill's (`stress-changes.yaml`, `stacks_with`).
  3. Lasting Stress Responses end.
  4. Turn limits become engagement limits.
  5. Aftermath rolls.
  6. Death Rolls.
  7. The care window, then Grief, then retirement.

  The aftermath roll follows `treat-injury.yaml`, `aftermath_rolls`:
  - **Patients and treaters.** Each patient gets at most one roll, and each soldier makes at most one. The treater is alive, not Down, and within one Position step when the fight ends; the patient may self-treat with the 2-dice penalty, and a Down patient cannot.
  - **The roll.** No Help, no Cover, and a Push for a player character only. Stress Dice apply after the relief.
  - **Dice.** Wits alone with no Talent dice when the treater has no medical kit. That is correct: Chapter 2 section 2.9 defines `attribute_alone` as "no Talent dice and no Gear Dice", and Standard Issue gives a kit only to the Medic.
  - **Squadmates.** They may treat, since `squadmates.yaml`, `action_list` gives them every Catalog entry.
- **The Death Roll.** Strength, no Stress Dice, Gear Dice, Help, or Push. The first failure kills. A limit the soldier survives becomes `day`.
- **The ceiling does not hinge on the aftermath.** With every aftermath roll removed (40,000 fights a row, my seeds), the helpers row gives 0.0440 ± 0.0011 against the Large twin's 0.0503 ± 0.0015 (z −3.4). With the rolls as written, the same seeds give 0.0296 against 0.0343 (−3.0).
- **Fidelity of the rules added this round.**
  - **Call It** (`read.yaml`): the reader gains nothing, a target that already dodged this round gains nothing, it holds once per Next Behavior, and a decoy's card spends it.
  - **Wings** (`round.yaml`): a Squadmate on a Wing acts right after its player character, even after a death that round. Wings change only after a death, a Down, or a Grab, and an orphaned Squadmate is reassigned.
  - **Swaps.** Only between card holders, neither Down nor Grabbed, and within one step.
  - **The interim issue** (`standard-issue.yaml`, `interim_issue`): Jammed or worn ODM Gear at the row's rating is kept, and a lame or worn horse is replaced.
- **Round 1 fixes confirmed.**
  - The gas cases read `R.gas_dice`.
  - The bar's median limits raise if their wording changes.
  - The fresh-cut Stress columns, Grab cells, Jam columns, and Jam rounds come from the tuning files.
  - The "about" tolerances were removed from code.
  - The median boundary is flagged with its deciding share.
  - Re-checks run inside `run.py` and their explanations are generated.
  - `--report` refuses a stale snapshot.
- **Seeds.** Chunk seeds are `S * 1000 + i`, and the auxiliary stream is seeded from a string, which Python hashes deterministically. `all_cases` rejects a repeated seed.

## Findings

### 1. Critical: section 14 misstates how a fight that reaches the horizon ends, and the reading it states would fail the Medium deaths band

**Location:**
- `docs/reviews/simulator-report.md` section 14, *Reference choices and policies*, second bullet: "A fight ends at the horizon of 12 rounds, and a soldier still Down or Grabbed then is left behind and counted as a death."
- `tools/sim/engine.py` `Fight.finish` (lines 1334 to 1349). Its comment points to "report section 12", which says nothing on this.
- `data/engagement/engagement-flow.yaml` `left_behind`, which applies only "when the Titan Engagement ends by no-soldier-standing".
- The bar verdict in section 5.1 and the Medium band in section 3.

**Problem:** The code does not do what section 14 says:
- **The code's reading.** `finish` kills the living only when no soldier stands. A fight that reaches round 12 with the Titan alive and someone standing goes to `end_engagement`: its Down and Grabbed soldiers get aftermath rolls and end Death Rolls beside a Titan that still stands. No rule ends a Titan Engagement at round 12, so the reading is a model choice, and no Open Question logs it.
- **The probe did not use the stated reading either.** `fight.py` kills only when no one stands, so the committed comparisons are consistent with the code.

The two readings give different verdicts:

| Figure (my seeds unless named) | The code's reading | Section 14's reading | The end steps skipped at the horizon |
| --- | --- | --- | --- |
| Standard Medium Titan, reference start, deaths per fight (30,000 fights; 4.6% of fights reach the horizon, with 0.069 soldiers Down or Grabbed there) | 0.039 ± 0.002 (the report: 0.037, band at most 0.05, Met) | at least 0.101 ± 0.003: Missed | not run |
| Abnormal helpers ceiling, cutters first, on the committed 120,000 bar fights | 0.0303 vs 0.0343, −4.2 | 0.0998 vs 0.2494, −55.7 | 0.0274 ± 0.0005 vs 0.0260 ± 0.0007, **+1.7, within sampling** |
| The same, strikers first | 0.0306 vs 0.0344, −4.0 | 0.0992 vs 0.2496, −55.8 | 0.0274 vs 0.0260, +1.6, within sampling |

Why the horizon carries the ceiling's margin:
- **Where the Large twin's lethal injuries are.** Of its 0.058 untreated lethal injuries alive at the end, 0.032 belong to soldiers Down at the horizon (40,000 fights). The Abnormal row has 0.012 of 0.048 there.
- **What that does to the margin.** The end steps at the horizon give the twin most of its extra end deaths, and those make the −4.2.
- **Robustness.** No reading I tested fails the row, and removing the aftermath rolls does not fail it either (−3.4). But the "holds by 4 standard errors" in section 5.1 is a product of an unlogged horizon reading, and section 14 describes a different one.

**Play scenario:**
1. A decider reads section 14 and takes the Medium band's 0.037 as counting every soldier the Titan still holds or has put Down at round 12.
2. On that reading they judge the band safe with room to spare. They accept a Severity rise that adds 0.01 deaths per fight.
3. Under the reading they believe they are applying, the band was already at 0.10.
4. Separately, a later Behavior Table change moves the Large twin's horizon fights from 9% to 6%. The helpers ceiling loses most of its margin, though nothing about the Abnormal changed, and the report gives no way to see why.

**Fix options:**
1. Correct section 14 and the `finish` comment to the code's reading. Mark it PROVISIONAL, and log a Simulator target entry for how a fight that reaches the model's horizon ends.
2. Print the Medium deaths band and every bar ceiling row under the three horizon readings above. Judge the verdict on the reading the decider picks, and flag any row whose status changes between readings (today, the helpers row moves from −4.2 to +1.7).
3. Take the horizon out of the death readings: play each fight to a kill or no soldier standing, under a far safety cap. Keep "no kill within 12 rounds" as a count on the same fights.

### 2. Major: the setup mix is re-read with Anchor Ratings, nearly doubling Chapter 6's figures, with no committed figure beside it

**Location:**
- `docs/reviews/simulator-report.md` section 6.9, and section 12, `data/titans/tuning.yaml` item 4.
- `tools/sim/report.py` lines 1121 to 1160.
- `docs/rules/06-standard-titans.md` section 6.6, *The Abnormal roll in the setup table* (lines 770 to 781).
- `data/titans/tuning.yaml` `targets.abnormals.report` and `verdicts.setup_mix`.

**Problem:** The two sources read the setup mix differently:
- **Chapter 6.** It defines the mix as "Each Focus Titan's reference row, weighted by the interim setup table's odds, with and without the Abnormal roll". The reference start is in Wooded terrain. It prints 0.85 Critical Injuries and 0.053 deaths per Titan Engagement, and 0.86 and 0.057 with the Abnormal roll. It concludes that the roll "adds 0.01 Critical Injuries and 0.004 deaths".
- **The report.** Section 6.9 also weights every Anchor Rating. It prints 1.101 and 1.115 Critical Injuries, 0.085 and 0.091 deaths during the fight, and 0.099 and 0.105 through the end. It gives no committed figure, no z, and no statement that the reading changed.
- **The two readings agree once aligned.** On Chapter 6's reading, the simulator's own reference rows (Small 0.840 and 0.042; Medium 0.693 and 0.030; Large 1.411 and 0.156; Abnormal 0.845 and 0.072) give:
  - without the roll: 0.86 Critical Injuries and 0.055 deaths during the fight (0.065 through the end);
  - with it: 0.87 and 0.059 (0.068);
  - so the roll adds 0.003 to 0.004 deaths.

  Every difference from the chapter is the Anchor Rating weighting. Most of it is Open, whose rows (Small 2.31 and 0.251, Medium 1.58 and 0.110, Large 3.09 and 0.436) follow the POLICY CHOICE that strikers cut as cutters while no step reaches Blind Spot. Section 6.9 notes that policy but not its weight in the mix.

**Play scenario:** A decider working on OQ-104 or the Expedition PC death target reads section 6.9. The setup table appears to deal 0.105 deaths per Titan Engagement, twice what Chapter 6 tells the GM. They either doubt the chapter or retune the Abnormal roll. The simulator actually agrees with the chapter to within 0.002 on the chapter's reading. What they are seeing is a different quantity, driven by a striker policy on Open.

**Fix options:**
1. Print Chapter 6's reading (reference rows, size and Abnormal odds) beside the committed 0.85, 0.053, 0.86, and 0.057, with z. Keep the Anchor-weighted figures as a second, labelled reading.
2. Break the Anchor-weighted mix out by rating, and say that Open's share rests on the striker policy.
3. Log which reading `targets.abnormals.report` means, since an Expedition's setup will name its own terrain.

### 3. Major: Targets 3 and 4 carry no verdict and no Open Question, while the tuning files call them met

**Location:**
- `docs/reviews/simulator-report.md` Summary, and section 1, Targets 3 and 4 (the "alone" and "one comrade, Stress 2, Grief 0" rows); `tools/sim/report.py` lines 586 to 591.
- `data/engagement/tuning.yaml` `solo_nape` verdict ("the Levi-grade soldier's 47.4% meets about 50%") and `grab.verdict` ("69.9% of the time, about 2 in 3").
- `docs/rules/OPEN-QUESTIONS.md`, where OQ-50 gives a reading for "about 1 in 3" (every cell under 50%) and nothing for "about 50%" or "about 2 in 3".

**Problem:** Round 1's Minor 8 asked that no tolerance be invented in code. The fix prints the ADR's words with "Reported". That removes the invented band but leaves three ADR-0014 target figures with no verdict:
- the Levi-grade soldier's 47.2% against "about 50%";
- the Grab alone at 69.9% against "about 2 in 3";
- the Stress 2, Grief 0 cell at 33.2% against "near 1 in 3".

The simulator's specification reads "The targets as amended, namely ... the Levi-grade soldier's about 50%". Yet the report neither judges these figures nor logs a Simulator target entry saying no tolerance exists. Meanwhile the tuning files' verdicts say they are met. A target part can therefore neither pass nor fail, and nothing in the register says so.

**Play scenario:** OQ-112's lever "a standing Nape that resists more than a grounded one" is measured, and the Levi-grade cut falls to 41%. The report still says "Reported". `tuning.yaml` still says the Levi-grade figure meets "about 50%". No entry tells the decider whether 41% is a miss, and the lever is accepted with its cost unjudged.

**Fix options:**
1. Log a Simulator target entry asking for tolerances on "about 50%", "about 2 in 3", and "near 1 in 3". Show it in the Result column as "Logged (OQ-n)".
2. Have the decision pass add structured tolerances to `data/engagement/tuning.yaml` beside each target, and judge the figures on them.
3. Until then, print the tuning file's own verdict words beside each figure and cite where they are written.

### 4. Major: case values still duplicate YAML in `cases.py` and `rules.py`

**Location:**
- `tools/sim/cases.py` `_ch5` (lines 58 to 75): `sev122`, `sev233`, `regen2`, `regen4`, `nd3`, `nd5`, `tempo2`, `small_tempo1`, `large_nd5`.
- `_jam` (line 385, `for nt in (1, 2)`; lines 392 to 395, the three mixed pairs).
- `tools/sim/rules.py` line 579 (`jam_limit_value = 1 / 3`).
- `data/engagement/tuning.yaml` `prepared_squad_kill.medium_severity` and `alternatives_rejected`, whose values exist only in the `case` labels.
- Codex round 1, Major 4.

**Problem:** Round 1 fixed the gas dice and the bar medians, but several case values are still written twice:
- **Chapter 5 rows.** The rejected-alternative and Severity rows are compared with committed rows by label ("Medium, Nape Depth 5", "Severity 1, 2, 2"). The values they run are restated in Python dictionaries.
- **The Jam test.** The Titan counts per cell are written in code, though they come from the target text "for one and for two Titans". So are the mixed pairs, though they come from "Two Focus Titans of different Size Classes ... and a standard Titan with the Abnormal".
- **The Jam limit.** The pattern reads "a third" and then hard-codes 1/3.

When the YAML and the code disagree, the run either compares a row run at the old value against a relabelled committed row, or loses the comparison.

**Play scenario:** A decision re-measures the Medium Severity row as "Severity 2, 3, 4" and edits the `case` label. `_ch5` still runs Severity 2, 3, 3, and the report prints that row as the re-measured one. Or the Jam target adds three Titans: the probes' Jam model still runs one and two, and section 4.2 still reads Met.

**Fix options:**
1. Give `medium_severity` and `alternatives_rejected` structured fields (for example `titan: {nape_depth: 5}` or `severity: {terrorize: 2, control: 3, kill: 3}`), and build the Chapter 5 cases from them.
2. Read the Titan counts and pairs from structured fields in `data/titans/tuning.yaml`, or parse them from the target and case text with a pattern that raises. Parse the limit as a number, not a word.

### 5. Minor: on Open the lone soldier still Breaks Attention with no route to Blind Spot, and dies On Body beside a standing Titan

**Location:**
- `tools/sim/policy.py` `lone_turn` (lines 704 to 737). At Distant and In Reach it Breaks Attention whenever `stage != OB`, including `stage is None`. The On Body pull-back needs `not decoy` and an unspent move.
- `docs/reviews/simulator-report.md` section 8, the "open grounded" rows (usable strike 5.1%, Down 27.9%, horizon 48.0%).
- Round 1 Opus finding 6, third bullet.

**Problem:** Round 1's first two bullets are fixed: the no-flare, no-horse rows exist, and the gap check now runs the legality search at every turn and ending. The third is only partly fixed. On "open grounded" (20,000 lone fights, my seeds):
- **Decoys wasted.** The soldier makes 1.65 Break Attention rolls a fight, and gets 1.02 successful decoys, while no step reaches Blind Spot.
- **Pull-back.** Of 0.63 turns a fight begun On Body with no step to Blind Spot, the pull-back moves on 0.33. The rest are blocked by a move already spent on a dodge, a decoy holding (0.06), or no working ODM Gear (0.035).
- **Deaths On Body.** 23.4% of lone fights end with the soldier dead On Body beside a standing Titan with working ODM Gear. A Down lone soldier is left behind. Round 1 found 35.4%.

The `lone_turn` docstring says such a soldier "climbs back to In Reach rather than wait there". That happens on about half of those turns.

**Play scenario:** A reader takes section 8's Open row, 5.1% usable strikes and nearly half the soldiers Down or dead, as what Open ground costs a lone soldier. Much of it is a policy that spends flares and Feints with no route to the Nape, and stays On Body while a decoy holds.

**Fix options:**
1. Do not Break Attention while `lone_stage` is None. Wait at Distant, or cut the grounding leg.
2. Allow the pull-back while a decoy holds, and report where the soldier stood when the fight ended.

### 6. Minor: the full-fight Jam test is judged Met against a limit set for a different quantity

**Location:** `docs/reviews/simulator-report.md` section 4.3 and Summary ("in the full fight (one Focus Titan) under a third on every standard table"); `tools/sim/cases.py` `_jam_fight`; `families.summarize_fight` (`jam_dodge_fight`).

**Problem:** The two quantities differ:
- **The limit.** A third was set for one holder dodging every round for three rounds on the worst legal support pattern (OQ-72, OQ-96).
- **What section 4.3 counts.** The share of fights, stopped after 3 rounds under the baseline policy, in which any soldier's dodge Jams. That comes to 1.5% to 2.8% against 8% to 33% in the probes' model.

The report calls it an upper bound on the holder's Jam, which is true. But a figure an order of magnitude below the limit, under a policy in which Attention moves, cannot come near a third, so "Met" adds no assurance.

**Play scenario:** A Severity rise pushes the probes' two-Large-Titans cell from 32.5% to 40%. Section 4.2 reads Missed, and section 4.3 still reads Met on every table. The Summary lists both, and a reader counts the full-fight model as the binding one.

**Fix options:**
1. Print section 4.3 as Reported.
2. Or measure the soldier who holds Attention at the first card for the fight's three rounds, under the worst support pattern the full fight allows.

### 7. Minor: the coverage row for eyes and arm Toughness says Measured

**Location:**
- `docs/reviews/simulator-report.md` section 12, `data/engagement/tuning.yaml` item 10; `tools/sim/report.py` `COVERAGE`.
- `docs/rules/OPEN-QUESTIONS.md` OQ-78, whose Decision reads "eyes and arm Toughness for every class ... are simulator cases".

**Problem:** Coverage is narrower than the row says:
- **Eyes.** Struck only on the standard Medium Titan, the only table whose entries use them. No case strikes eyes on Chapter 5's reference Titan at the Small or Large Size Class.
- **Arm Toughness.** Never varied from the starting values.

The row explains what it covers, but OQ-78's case reads "for every class", so the status should be Partly measured, and the Summary's 16 measured is then 15.

**Play scenario:** A decider looking for evidence to raise Large arm Toughness to 4 finds item 10 "Measured" and looks no further. No row measures a change in arm Toughness.

**Fix options:**
1. Mark the row Partly measured and name what is not measured.
2. Add an eye-strike row on each Size Class reference row, and an arm Toughness ±1 row for each class.

### 8. Minor: three unexplained probe gaps are not logged

**Location:** `docs/reviews/simulator-report.md` section 11 and Summary ("3 are not explained").

**Problem:** Three gaps have no explanation and no Open Question:

| Row | Simulator (committed) | Re-check | Probe on new seeds |
| --- | --- | --- | --- |
| Standard Small Titan's helpers row, deaths during the fight | 0.009 (0.004) | 0.006, +2.3 | 0.007 |
| Bar's Medium twin for the screen with Hook and Cut and Hamstring Line, Critical Injuries | 0.391 (0.383) | 0.390 at 600,000 fights, +3.6 | none: the bar family has no probe re-run |
| The Flier's dodge at Severity 3 | 37.7 (38.0) | 37.8 at 1,000,000 trials, −4.5 | none; the committed figure has no trial count |

No verdict moves: the Abnormal's Critical Injuries floor against that twin holds by 21 standard errors. But a persistent 2% gap in Critical Injuries on a twin row points to a model difference the report does not name.

**Play scenario:** A later bar row lands within 2 standard errors of that twin's Critical Injuries floor. The reader cannot tell whether the simulator or the probe gives the right twin.

**Fix options:**
1. Re-run the bar twin on the probe, as for the Chapter 6 full-fight rows.
2. Name the model difference (for example, Break Attention naming its decoy) or log the gaps as a Simulator target entry.

### 9. Minor: Pry Loose reads Break Free's needs and penalty, not its own row

**Location:** `tools/sim/engine.py` `pry_loose` (lines 960 to 963: `R.break_free_needs`, `R.break_free_lifted_penalty`); `tools/sim/rules.py` (reads only `escapes` `break-free`); `data/engagement/grab.yaml` `escapes`, `pry-loose` (`needs: 2`, `lifted_penalty: 2`).

**Problem:** The Pry Loose escape has its own `needs` and `lifted_penalty`, and the engine uses Break Free's instead. The values are equal today, so no figure is wrong, but a change to the Pry Loose row would not flow through.

**Play scenario:** A decision sets Pry Loose's needs to 3, because a comrade prying from outside the grip should need more than the victim. The simulator's Pry Loose rows in sections 6.3 and 7 still roll against 2.

**Fix options:**
1. Read `pry-loose`'s `needs` and `lifted_penalty` in `rules.py` and use them in `pry_loose`.

### 10. Minor: the committed report was rendered by a `report.py` that section 13 does not identify

**Location:** `tools/sim/results/results.json` (`snapshot_changed_during_run: ["tools/sim/report.py"]`); the header of `docs/reviews/simulator-report.md` ("Files changed during the run" leaves out render files); section 13 (lists `report.py` as `515eb3a120c2`, the hash when the run started).

**Problem:** `report.py` changed during the run and again after it:
- **The hashes.** The committed report was rendered by `--report` from a `report.py` hashing `08a921e63c86`. Section 13 prints no hash for the renderer that wrote it.
- **A visible trace.** Rendered from the sorted JSON, section 8's route rows come out in a different order than a fresh run renders them.

Figures are unaffected, since the engine hash matches, but the report cannot say which renderer wrote its text, verdicts, and explanations.

**Play scenario:** A reader checks a generated explanation in section 11 against the renderer named in section 13. That `report.py` is not the one that wrote it.

**Fix options:**
1. Hash the render files when rendering, and print those hashes beside the run's snapshot.
2. List render files that changed during the run in the header.

### 11. Minor: the sequence family's readings are not in OQ-116

**Location:** `tools/sim/families.py` `sequence_job`; `docs/reviews/simulator-report.md` section 6.11; OQ-116 *Provisional choice*; `data/character/squadmates.yaml` `promotion`; `data/harm/engagement-end.yaml` `retirement-and-promotion`.

**Problem:** OQ-116 logs the cadence: 2 sessions of 2 Titan Engagements, no day passing, and the kit row. The sequence also rests on two readings no rule gives and the entry does not name:
- A soldier Down at a fight's start sits it out.
- A dead or retiring player character is replaced by a new reference Rookie, and a dead Squadmate by a new Rookie Squadmate. The end step instead promotes through the contest in `squadmates.yaml`.

**Play scenario:** A decider settles OQ-116's cadence and reads fight 4's 0.164 deaths as the cadence's cost. Part of it is the sit-out and replacement readings, which the decision never saw.

**Fix options:**
1. Add both readings to OQ-116's provisional choice.
2. Or model promotion from the Squad Pool as `retirement-and-promotion` states.

### 12. Minor: section 14's policy descriptions and two pointers are inaccurate

**Location:** `docs/reviews/simulator-report.md` section 14, *Reference choices and policies*, last bullet; `tools/sim/engine.py` `Fight.finish` comment; `docs/rules/OPEN-QUESTIONS.md` OQ-114, item 7.

**Problem:**
- **The aftermath treater.** "The aftermath treater is the nearest able soldier", but `policy.aftermath_treaters` picks the largest pool within one step, Down patients first.
- **Wings.** "Wings go to the player character with the fewest Squadmates", but `policy.assign_wings` gives each Squadmate the first living player character, those not Down or Grabbed first, in sheet order.
- **Stale pointers.** The `finish` comment points to report section 12 for the horizon reading. OQ-114 item 7 cites the report's section 10 for the Veteran bug, which is now section 15.

**Play scenario:** A reader who wants the aftermath figures under a "nearest treater" policy finds section 14 saying they already are.

**Fix options:**
1. Generate the policy bullets from `policy.py`'s docstring, or correct them.
2. Fix the two pointers.

## Round 1 findings

| Finding | Status |
| --- | --- |
| Opus 1 (Critical): `every_standard_table` untested | Resolved: section 4.1 drives `Titan.roll_nb` and `Titan.choose` over 144 states a table; every state matches the committed shares |
| Opus 2 (Major): end steps missing from deaths | Resolved: every end step runs in order, and bands and bar read deaths through the end. The margin now rests on the horizon reading (finding 1), not on the aftermath |
| Opus 3 (Major): ADR-0014 reports absent | Resolved: Health 2, 3, 5, and 6 in the full fight and the Grab; template Squad on every table and template Grab cells; Flier dodge; Grab death share |
| Opus 4 (Major): specification unmodelled | Resolved for Read and Call It, Wings, swaps, Pry Loose, the full-fight Jam test, and round-time counters (one Titan), and kill shares. Logged: OQ-115, OQ-116, OQ-118 |
| Opus 5 (Major): Chapter 6 cases unrun | Resolved: tactics on every table, eyes, loud rider without a Nape comrade. Background Titans Logged (OQ-115). The setup mix is re-read (finding 2) |
| Opus 6 (Major): lone route | Resolved: the no-flare rows and a real gap check. Still open in part: the Open policy (finding 5) |
| Opus 7 (Major): gas dice and bar medians in code | Resolved. Other duplication Still open (finding 4) |
| Opus 8 (Minor): invented tolerances | Resolved in code; the missing verdict is finding 3 |
| Opus 9 (Minor): Small row explanation | Resolved: explanations are generated from re-checks |
| Opus 10 (Minor): median boundary | Resolved |
| Opus 11 (Minor): three commands, stale re-checks | Resolved |
| Opus 12 (Minor): conditional fresh-cut counts | Resolved |
| Opus 13 (Minor): rule listed as simplification | Resolved |
| Codex 1 (Critical): complete-coverage claim | Resolved: the Summary says partial with exact counts, logged OQ-115 to OQ-118; one row overstated (finding 7) |
| Codex 2 (Major): aftermath omitted | Resolved |
| Codex 3 (Major): Jam test a probe shortcut | Resolved for one Focus Titan; two Titans Logged (OQ-115); the verdict wording is finding 6 |
| Codex 4 (Major): values duplicated in Python | Still open in part (finding 4) |
| Codex 5 (Major): no rules snapshot | Resolved; the renderer's hash is finding 10 |

## Appendix: reviewer scripts (session scratchpad, not committed)

- **Full rerun:** `run.py` in a copy of the repository.
- **`compare.py`:** compares every case's configuration, trials, seed, and summary, plus `pooled`, `rechecks`, `shares`, and `route`, with the committed `results.json`. Result: 0 of 832 cases differ, and every block is identical.
- **`horizon.py` and `horizon2.py`:** subclass `Fight.finish` to count soldiers Down or Grabbed when a fight reaches the horizon with the Titan alive and someone standing.
  - Standard Medium reference start: 0.069 a fight. Deaths during the fight plus those soldiers: 0.101 ± 0.003 (30,000 fights).
  - Large helpers twin: 0.226 a fight (20,000 fights).
- **`horizonbar.py`:** replays the committed bar fights for the Abnormal helpers row and its Large twin, in both orders, on `run.py`'s exact chunks and seeds. It reads deaths three ways at the horizon. The code's reading reproduces the committed 0.0303, 0.0343, 0.0306, and 0.0344.
- **`lethalend.py`:** tallies untreated lethal injuries alive at the end by how the fight ended, the row's own limit, Down or not, and player character or Squadmate (40,000 fights a row).
- **`noaftermath.py`:** the helpers ceiling with `policy.aftermath_treaters` returning no treater, against the rules' aftermath, 40,000 fights a row.
- **`openlone.py` and `openlone2.py`:** wrap `Fight.break_attention` and `policy.lone_turn` on the Open lone rows to count Break Attention rolls with no step to Blind Spot, and pull-backs from On Body. They record the Titan's state and the soldier's gear when the lone fight ends with the soldier dead On Body (20,000 lone fights a row).
- **Setup mix on Chapter 6's reading:** the committed Wooded reference rows weighted by `engagement-setup.yaml`'s Size Class odds (1/3, 1/2, 1/6) and its Abnormal roll (1/6 of Medium), by hand from `results.json`.
