# Wings of Freedom dice simulator: review round 2 (Codex)

## Verdict

**0 Critical, 2 Major, 2 Minor.**

Round 1's target-coverage overclaim has been corrected: the report now calls the simulator partial and accounts for all 26 `simulator_cases` items as 16 measured, 7 partly measured, 2 not measured, and 1 deferred. The unimplemented two-Focus-Titan, Background Titan, retreat, cadence, Veteran-Scar, and unavailable-Opus-model work is disclosed beside the relevant coverage entries and logged in OQ-115 through OQ-118. The exact `every_standard_table` checks, full-fight Jam rows for one Focus Titan, ADR-0014 beside-target reports, Chapter 6 additions, lone-route checks, aftermath treatment, runtime YAML values, and source snapshots resolve the other round 1 Critical and Major findings.

The committed target and bar numbers reproduce within sampling error. Two acceptance gaps remain. First, three qualitative ADR-0014 target components have no numeric tolerance and are labelled `Reported`, rather than the required `Met`, `Missed`, or `Logged`. Second, fights that end partway through a round omit that round's mandatory Gas Rolls. The latter makes the round-time and multi-fight resource results incomplete without disclosing or logging the gap.

## Scope and reruns

I reviewed `tools/sim/` after its README; Chapters 1 through 6 and their YAML; `CONTEXT.md`; all ADRs, including ADR-0014 and the reports and reference configurations it names; decisions through Batch 4b; OQ-115 through OQ-118 and the other Simulator target entries; both round 1 reviews; the two tuning specifications; the committed results; and `docs/reviews/simulator-report.md`. I did not read or edit the parallel `docs/reviews/simulator-review-2.md`.

The exact documented command could not acquire PyYAML because the sandbox denied the shared `uv` cache and network access. I copied the repository to `/private/tmp`, supplied the already installed cached PyYAML on `PYTHONPATH`, and ran the same `tools/sim/run.py`. The full run reached 1,000 of 13,312 chunks in 509 seconds, so I stopped it as too slow under the brief's fallback. A 1% all-case run then completed all 832 cases and 499,160 trials in 20 seconds on 14 processes. It produced the committed rules hash `cf5de67236fa50b4` and engine hash `c792aa9960946ca7`; every bar row held in both sheet orders under both death readings and in the Grab-alone variant. As expected at only 1%, three threshold results crossed through sampling noise, so I did not use them as findings.

I also ran fresh-seed, high-count target checks and a bar sample in temporary copies:

| Check | Committed report | Independent rerun |
| --- | ---: | ---: |
| Standard Medium, prepared Squad: median; killed by rounds 2 / 3 | 3; 41.9% / 61.7% | 3; 40.88% / 61.59% (20,000 fights) |
| Rookie fresh cut, Stress 1 | 13.0% | 13.27% +/- 0.11 (98,024 cuts) |
| Levi-grade fresh cut, Stress 2 | 47.2% | 47.56% +/- 0.16 (99,719 cuts) |
| Grab alone after failed dodge | 69.9% | 70.12% +/- 0.14 (100,000 trials) |
| Grab, one comrade, Stress 2 / Grief 0 | 33.2% | 33.64% +/- 0.15 (100,000 trials) |
| Standard / pushed Gas Roll | median 8 / 6; mean 9.24 / 6.34 | median 8 / 6; mean 9.259 / 6.330 (100,000 each) |
| Helpers bar, cutters first: Abnormal / Large deaths through end | 0.0303 / 0.0343 | 0.02845 +/- 0.00134 / 0.03185 +/- 0.00185 (20,000 each) |

The target medians and percentages, the six-cell Grab ceiling, and the sampled bar therefore agree with the committed report. The current aftermath order is faithful: each patient gets at most one player-chosen eligible treater, each treater rolls at most once, aftermath treatment precedes engagement-limit Death Rolls, and the care window follows them (`engine.py:1354-1414`, `policy.py:229-248`; Chapter 3 sections 3.5 and 3.16). This explains why the helpers ceiling now holds at 0.0303 against 0.0343 when deaths through the end are counted.

The three probe differences left unexplained in report section 11 are accurately labelled unexplained and do not determine a target, band, or bar. They remain methodological cautions, not additional findings.

## Findings

### 1. Major: a fight ending partway through a round skips the mandatory final Gas Rolls

**Location:** `tools/sim/engine.py:1289-1305,1334-1349`; `docs/rules/04-gear.md:141-149`; `data/engagement/round.yaml:54-60`; `docs/reviews/simulator-report.md:606-624`.

**Problem:** `_play_round` returns immediately when the Titan dies or no soldier is standing. `end_steps`, the only code that makes Gas Rolls, is therefore not called. `finish` goes directly to the Chapter 3 engagement-end sequence and contains no replacement Gas Roll. Chapter 4 and `round.yaml` explicitly require every soldier who used ODM Gear in that partial round to roll at once before the Chapter 3 steps.

This does not change the isolated gas-canister medians, but it undercounts the Gas Rolls in section 6.10 and carries excess gas into the provisional four-fight sequences in section 6.11. The report describes the round-time counters and sequences as measured without identifying this omission, and no Simulator target entry logs it.

I instrumented a scratch copy without changing its random draws. Across 20,000 standard-Medium reference fights, the engine recorded 2.0216 Gas Rolls per fight and omitted another 0.38035 required at terminal partial rounds: 15.84% of all rolls that should have occurred. That is large enough to change multi-fight canister depletion and any later action forced by an empty canister.

**Concrete play scenario:** A cutter and striker both use ODM Gear, then the striker kills the Titan before the round's last card. Both must immediately make their Gas Rolls. The simulator instead starts aftermath with both canisters unchanged, so the same soldiers can enter the next simulated fight with gas they should have spent.

**Fix options:**

1. Split Gas Rolls from the other round-end steps and call that procedure before every rule-driven mid-round exit, before `end_engagement`.
2. Track whether the current round's Gas Rolls have run, and have `finish` run them once for a rule-driven termination but not for measurement-only `self.stop` cases. Add a regression case for a mid-round Nape kill and a no-standing termination.
3. Until fixed, mark the affected `round_time` and sequence cases partly measured beside their results and add a Simulator target entry.

### 2. Major: three ADR-0014 target components have neither a numeric tolerance nor an accepted status

**Location:** `docs/reviews/simulator-report.md:20,25-37`; `tools/sim/report.py:1-8,1495-1499`; `docs/adr/0014-numbers-tuned-to-design-targets.md:6-7`; `docs/rules/OPEN-QUESTIONS.md` (OQ-115 through OQ-118).

**Problem:** The report gives 47.2% for Levi-grade, 69.9% for a Grab alone, and 33.2% for the Stress 2 / Grief 0 comrade cell. It deliberately supplies no tolerance and labels each `Reported`. The Summary nevertheless says there are zero missed results. The review brief requires every ADR-0014 target component to have a number, a tolerance, and a status of `Met`, `Missed`, or `Logged`.

Removing round 1's invented +/-5-point tolerances was correct, but it leaves these target clauses unevaluable. OQ-115 through OQ-118 log unrelated coverage and policy gaps; none logs the missing acceptance tolerances. The exact six-cell under-50% Grab constraint is properly `Met` and is not part of this finding.

**Concrete play scenario:** A rules change moves Levi-grade success to 41% or lone-Grab death to 75%. The current renderer would still say `Reported` and `Missed results: 0`; there is no decided boundary that tells the reviewer whether either target was accepted or missed.

**Fix options:**

1. Decide numeric tolerances in the applicable tuning YAML, cite the decision, and render each value `Met` or `Missed` against it.
2. If the tolerances remain undecided, label each component `Logged`, add a Simulator target entry for deciding them, and make the Summary distinguish unassessed targets from zero misses.

### 3. Minor: engagement-end Grief can be stored above the rules' maximum

**Location:** `tools/sim/engine.py:1421-1427`; `tools/sim/dice.py:73-76`; `docs/rules/03-harm-and-mind.md:561-578`.

**Problem:** `end_engagement` adds base and Numb Grief without capping the stored value at `R.grief_max`. `Soldier.resolve` applies `min` later, so present Resolve odds are protected, but the state itself violates the rule that Grief gained beyond 3 is lost. This can occur in the multi-fight sequence and would contaminate any later result or report that reads Grief directly.

**Concrete play scenario:** A Numb survivor gains 3 Grief after two comrades die, then survives a later fight in which another comrade dies. The rules leave them at 3; the simulator stores 5.

**Fix options:** Cap the assignment after all deaths from the engagement are accumulated, and add a sequence regression covering Numb and multiple deaths.

### 4. Minor: `--report` permits a changed judgment renderer to reuse an old renderer snapshot

**Location:** `tools/sim/run.py:67-99`; `tools/sim/README.md`, *The rules snapshot*; `tools/sim/report.py:1-12`.

**Problem:** The snapshot records `report.py`, but the staleness test explicitly excludes it and `README.md`, while `engine_hash` excludes both. That is reasonable for prose-only rendering, but `report.py` also owns the hand-written coverage map, target statuses, missed-result aggregation, Open Question mapping, and divergence classification. A change to those judgments can be applied by `--report` to old results without refusal, while section 13 continues to show the old recorded `report.py` hash.

**Concrete play scenario:** A renderer edit changes a `simulator_cases` row from Partly measured to Measured or alters a tolerance comparison. `run.py --report` accepts the old results and emits the new verdict, but the artifact's recorded renderer hash describes the earlier code.

**Fix options:** Include `report.py` in the enforced report-provenance hash, or record the current renderer hash separately whenever rendering and print both the results snapshot and renderer snapshot.

## Round 1 finding status

Only findings still open in this round are counted in the verdict above.

| Previous finding | Status | Round 2 disposition |
| --- | --- | --- |
| Opus C1: `every_standard_table` targets untested | Resolved | Exact enumeration now checks shares, effect counts, and Position counts, and the report names the Jam models separately. |
| Opus M2: deaths omit aftermath | Resolved | The full Chapter 3 order is implemented; targets and bars use deaths through the end. |
| Opus M3: ADR-0014 beside-target reports absent | Resolved | Health, template, Flier, reference-Squad Grab, and four-striker reports are present. |
| Opus M4: much of `simulator_cases` unmodelled | Logged | Implemented cases are measured; remaining scope is disclosed and logged in OQ-115 through OQ-118. |
| Opus M5: Chapter 6 cases partly unrun | Logged | The added Chapter 6 rows run; the remaining two-Focus and Background-Titan scope is OQ-115. |
| Opus M6: lone route and dead gap counter | Resolved | No-flare/no-horse cases, a live legality search, and pull-back behavior cover the route. |
| Opus M7: gas dice and bar limits duplicated | Resolved | Gas cases and bar limits read runtime YAML; prose mismatch fails loudly. |
| Opus m8: invented `about` tolerances | Resolved | The invented bands were removed; the resulting acceptance gap is current finding 2. |
| Opus m9: hand-written probe-gap explanation | Resolved | Rechecks and explanations are generated; three unresolved comparisons are honestly identified. |
| Opus m10: boundary medians lack deciding shares | Resolved | The report prints before/at shares, standard errors, and boundary flags. |
| Opus m11: multiple commands and stale recheck | Resolved | One run selects and performs rechecks; snapshots guard rerendering, subject to current minor finding 4. |
| Opus m12: conditional fresh-cut trials undisclosed | Resolved | Reached-cut numerator and denominator are reported. |
| Opus m13: rule called a simplification | Resolved | The report distinguishes rules from provisional policy. |
| Codex C1: omitted Phase 1 cases but claimed complete coverage | Logged | The Summary is explicitly partial with exact counts and OQ-115 through OQ-118. |
| Codex M2: deaths omit aftermath | Resolved | Same disposition as Opus M2. |
| Codex M3: Jam target is only a shortcut | Logged | A one-Focus full-fight Jam family now complements the probe abstraction; two Focus Titans remain OQ-115. |
| Codex M4: Python duplicates case and limit values | Resolved | Structured runtime YAML supplies the case dimensions and limits; parsers have no numeric fallback. |
| Codex M5: results omit rules snapshot | Resolved | Results record per-file hashes plus combined rules and engine hashes, and the report prints them. |

## Counts

- Critical: 0
- Major: 2
- Minor: 2
