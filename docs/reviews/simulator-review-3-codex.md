# Wings of Freedom dice simulator: review round 3 (Codex)

## Verdict

**0 Critical, 2 Major, 2 Minor.**

All round 2 Critical and Major findings are resolved in the engine and target judge. The retreat clock now gives every full fight a rules-defined ending, terminal partial rounds make their Gas Rolls, all ADR-0014 targets have decided tolerances and verdicts, the Chapter 6 setup mix separates its two readings, and case values are read or checked from YAML at run time.

The reported target numbers reproduce. The remaining serious problems are bookkeeping around the new 5-19 decision and a required `simulator_cases` row that remains partly unmeasured without a Simulator target entry. Two smaller methodology gaps affect exclusive boundaries and concurrent-edit disclosure.

## Scope and method

I read `tools/sim/README.md` first, then reviewed every file under `tools/sim/`, the generated results and report, Chapters 1 to 6 and their YAML, `CONTEXT.md`, all ADRs, the ADR-0014 reference builds and named reports, decision batches through 5-19, the Simulator target entries in `OPEN-QUESTIONS.md`, and both round 2 simulator reviews. I did not read or edit `docs/reviews/simulator-review-3.md`.

I copied the repository to `/private/tmp/wof-sim-review3.HW4QqN/repo`. The documented command, `uv run --with pyyaml python tools/sim/run.py`, could not use the sandboxed shared uv cache and could not reach PyPI. I then ran the same `tools/sim/run.py` entry point with the machine's cached PyYAML on `PYTHONPATH`. The full run completed 868 cases, 51,788,000 trials, and six re-check runs in 1,044 seconds on 14 processes.

The copied snapshot was taken at 09:32:53, before 5-19 landed at 09:34:01. It reproduced rules hash `120901a9ff77bbfc` and engine hash `f2dce7ca58ea2113`. The current rules hash is `95af348d5795ee7f`, while the engine hash is unchanged. Thus 5-19 changes the reading, logging, and prose, not any simulated draw. Apart from four sequence means differing by about 1e-16 from floating-point summation, the rerun reproduced the committed result data and every displayed figure.

The run snapshot contains the batch 5b versions of `background-titans.yaml`, the interim-day files, and the carrying rule. Code tracing confirms the model applies Lift Comrade before the forced retreat move, forbids every Nape strike during a retreat, gives the whole Squad the interim care window and Field Repair, does not redistribute a left-behind soldier's items, keeps Ride dormant while applying Horsemanship only to mounted horse dodges, reads ending Positions, parses the fall-reference order, and applies a Grab's hold before its crush. The first-Titan-Engagement sensitivity row is reported and is not bound by the Medium deaths band.

## Target and bar verification

| Requirement | Independent full rerun | Verdict |
| --- | ---: | --- |
| Medium kill median | round 3; 62.0% killed by round 3 | Met |
| Rookie fresh Nape cut at fight-start Stress 1 | 13.0% +/- 0.1; tolerance 8% to 14% | Met |
| Levi-grade fresh cut, pushing | 47.2% +/- 0.2; tolerance 45% to 55% | Met |
| Grab alone after failed dodge | 70.0% +/- 0.2; tolerance 61.7% to 71.7% | Met |
| Grab with one comrade, Stress 2, Grief 0 | 33.2% +/- 0.2; tolerance 28.3% to 38.3% | Met |
| All six comrade cells | worst 45.0%; each must be under 50% | Met |
| Standard and pushed gas medians | exactly 8 and 6 | Met |
| Large no kill | 14.6% +/- 0.3; at most 15% | Met |
| Sprinting Abnormal bar | every row holds every limit in both sheet orders | Met |
| Medium deaths, reference start | 0.0573 +/- 0.0030 through the end; 0.0500 during the fight | Missed, OQ-132 |
| Medium deaths, bar twins | 0.0546 and 0.0552 +/- 0.0009 through the end; 0.0485 and 0.0493 during the fight | Missed, OQ-132 |
| Expedition target | no Phase 1 Expedition rules | Deferred |

The quoted precision is supported by the trial counts: 12,000 fights for ordinary full-fight rows, 120,000 for each bar row, 100,000 fresh-cut trials, 40,000 to 80,000 Grab trials per cell or variant, and 200,000 trials for each gas median. Seeds are deterministic by case and chunk. The independent full rerun produced the same displayed values.

## Findings

### 1. Major: decision 5-19 is logged, but the tuning verdict and generated report still state the pre-decision status

**Location:** `data/titans/tuning.yaml:195,318-331`; `tools/sim/report.py:42-65`; `docs/reviews/simulator-report.md:14-22,217-219,1076-1078,1322-1326`; `docs/rules/OPEN-QUESTIONS.md:2853-2870,2910-2924`.

**Problem:** Decision 5-19 and amended ADR-0014 say the Medium deaths band reads deaths through the end of the Titan Engagement, is Missed, and is logged as OQ-132. The report gets the reading and numerical Missed verdict right, but prints all three missed Medium rows as having no Open Question because `MISSED_OQ` is empty. It also says its single unexplained probe gap differs from OQ-128, although 5-19 revised OQ-128 to that single Flier gap. Meanwhile `data/titans/tuning.yaml` still calls the Medium bands Met using the superseded during-the-fight figures and does not name the through-end reading. OQ-132's `Current handling` therefore claims updates that do not exist.

This leaves three mutually inconsistent authorities beside one target: ADR-0014 and OQ-132 say Missed and logged, the generated report says Missed and unlogged, and the tuning verdict says Met. It also means the committed report's rules snapshot predates 5-19 and the current source refuses an ordinary `--report` rerender as stale.

**Concrete play scenario:** A decider follows the tuning file, sees `Met` at 0.046 and pooled 0.0494, and closes the simulator review without considering the retreat deaths. Another reader follows the report and opens a duplicate question because it says no question exists. Both actions contradict 5-19.

**Fix options:**

1. Add the Medium death result prefix to `MISSED_OQ` as OQ-132, reduce `PROBE_GAPS_LOGGED` to the Flier row, update the tuning target text and verdict to the through-end reading and Missed result, then run the documented command from the current snapshot.
2. If the report must remain tied to the pre-5-19 run, render with the stale state disclosed and make every affected status explicitly say that 5-19 supersedes it. The next full run should replace that artifact.

### 2. Major: the required eyes and arm-Toughness case is partly unmeasured and has no Simulator target entry

**Location:** `data/engagement/tuning.yaml:1030`; `tools/sim/report.py:480-484`; `docs/reviews/simulator-report.md:1100`; OQ-78.

**Problem:** The specification requires eyes and arm Toughness for every Size Class. The report now honestly marks the row Partly measured, resolving round 2's status overclaim, but it also states that eye strikes on the Chapter 5 Small and Large reference Titans and every arm-Toughness change are not measured. Its Open Question cell is blank. OQ-78 is a decided rules entry that created the simulator case, not a current Simulator target entry recording the missing measurements.

The brief requires every target-bearing `simulator_cases` row to be tested or logged. This row also carries Large against the PC Critical Injury and death targets. Those mission-level targets are properly Deferred with Expedition, but the Size Class sensitivity work is neither run nor logged.

**Concrete play scenario:** A later balance pass raises the Large Titan's arm Toughness or changes an eye-strike policy. A reader finds the required case and a Partly measured label, but no tracked decision says whether the omitted sensitivity must run before that change can be accepted.

**Fix options:**

1. Add the missing Small and Large eye-strike rows and arm-Toughness sensitivity rows, and report them beside the applicable targets.
2. Add a Simulator target Open Question naming the exact unmeasured rows and link it from the coverage map until they are run.

### 3. Minor: equality at an exclusive upper bound is classified as inside

**Location:** `tools/sim/targets.py:95-124`.

**Problem:** `inside()` correctly rejects equality for `under 50%` and `under a third`. `past_se()` then computes a zero gap at that same boundary, and `first_verdict()` converts `p == 0` back to `inside`. A scratch check gives `inside=False`, `past_se=0.0` for both 50.0 under 50% and 33.333333333333336 under a third. Current results, 45.0% and at most 24.4%, are unaffected.

**Concrete play scenario:** A future Grab run lands at exactly 50.0%. The rule says the cell misses because it must be under 50%, but the report marks it Met and does not run a second seed.

**Fix options:** Have `first_verdict()` test `inside()` directly before calculating distance, or make `past_se()` return a positive boundary sentinel for equality at an exclusive edge. Add tests for inclusive and exclusive equality on both bounds.

### 4. Minor: the snapshot report misses a known text edit made and restored during the run

**Location:** `tools/sim/run.py:46-50,62-96,262-299`; `docs/reviews/simulator-report.md:6`; `data/engagement/background-titans.yaml`.

**Problem:** The report lists endpoint hash differences and therefore omits the known retreat-actions text edit made during the run and restored before the ending snapshot. It says which files changed while the run was going, but its mechanism can only say which files differ between the two snapshots. Also, the modules that load YAML are imported before the starting snapshot, so the hash is not an atomic record of what every process loaded. The observed edit was text-only and the independent run confirms no displayed number moved, so this is not a result-fidelity finding.

**Concrete play scenario:** An editor changes and restores a parsed YAML value while worker processes start. The start and end hashes match, the report says no change, yet workers can have loaded different content.

**Fix options:**

1. Run from an immutable copied tree and record that tree's hash, as this review did.
2. Load and freeze all parsed rules after taking the snapshot, pass that frozen data to workers, and verify the snapshot again before workers start.
3. For this run, add a manual disclosure that `background-titans.yaml` changed transiently and that the edit was text-only.

## Round 2 finding status

Only findings still open in this round are counted above.

| Previous finding | Status | Round 3 disposition |
| --- | --- | --- |
| Opus Critical 1: the 12-round horizon had no rules ending | Resolved | The retreat clock ends long Engagements; the safety cap is only a checked assertion and no full fight reached it. |
| Opus Major 2: setup mix silently changed to Anchor-Rating weights | Resolved | Section 6.9 prints the Chapter 6 reference-start reading and the Anchor-weighted reading separately, with committed figures beside them. |
| Opus Major 3: Targets 3 and 4 lacked verdicts or an Open Question | Resolved | Batch 5 supplies five-point tolerances and the renderer judges every component. |
| Opus Major 4: case values duplicated YAML | Resolved | Structured fields or checked text parsers supply case dimensions, Jam counts, pairs, and limits without numeric fallbacks. |
| Opus Minor 5: lone policy used decoys with no route | Resolved | The live route search reports zero gaps and the policy does not take Break Attention without a legal route. |
| Opus Minor 6: full-fight Jam was judged against the wrong quantity | Resolved | The full-fight row is Reported; the probes' table reading alone is judged. |
| Opus Minor 7: eyes and arm coverage said Measured | Still open | The label is corrected to Partly measured, but the omitted required case has no Simulator target entry. See finding 2. |
| Opus Minor 8: three unexplained probe gaps were not logged | Logged | OQ-128 now retains only the Flier gap; the report mapping still needs the 5-19 synchronization in finding 1. |
| Opus Minor 9: Pry Loose used Break Free's row | Resolved | Pry Loose reads and checks its own need and lifted penalty. |
| Opus Minor 10: renderer provenance was not identified | Resolved | The report prints both the run's and rendering `report.py` hashes. |
| Opus Minor 11: sequence readings were absent from OQ-116 | Logged | OQ-116 and the report state the provisional cadence and sequence reading. |
| Opus Minor 12: policy descriptions and pointers were inaccurate | Resolved | The inspected policy descriptions now match the code and data. |
| Codex Major 1: terminal partial rounds skipped Gas Rolls | Resolved | `finish()` makes pending Gas Rolls before engagement-end steps. |
| Codex Major 2: three target components had no tolerance or accepted status | Resolved | Batch 5 defines the bands; all three are Met with their numbers. |
| Codex Minor 3: Grief could exceed its maximum | Resolved | Engagement-end Grief is capped at the YAML maximum. |
| Codex Minor 4: rerender provenance could reuse an old renderer snapshot | Resolved | The rendering hash and engine hash are printed beside the run snapshot. Finding 4 is the narrower concurrent-edit problem. |

## Counts

- Critical: 0
- Major: 2
- Minor: 2
