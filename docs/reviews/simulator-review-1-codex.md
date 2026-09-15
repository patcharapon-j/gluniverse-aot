# Simulator review 1: Codex

## Scope and rerun

I reviewed `tools/sim/`, the report, Chapters 1 to 6, the applicable decisions through Batch 4b, ADR-0014, the YAML under `data/`, and the committed probe figures. I did not read either prohibited parallel review.

I ran the simulator from a temporary copy of the repository. The sandbox could not access the shared `uv` cache or the network, so I supplied a temporary `yaml.safe_load` adapter backed by Ruby's YAML parser. It changed no simulator code or data. A 1% all-case run completed 610 cases and 393,360 trials. Independent current-rule reruns used 30,000 fights for each selected full-fight row and 100,000 trials for each target cell:

| Check | Committed report | Independent rerun |
|---|---:|---:|
| Chapter 5 reference Medium, killed by round 3 | 61.8% | 61.63% |
| Standard Medium, killed by round 3 | 61.0% | 61.67% |
| Rookie fresh cut, Stress 1 | 13.0% | 13.18% |
| Levi-grade fresh cut, Stress 2 | 47.2% | 47.50% |
| Grab alone after failed dodge | 69.9% | 69.66% |
| Grab with one Stress 2, Grief 0 comrade | 33.2% | 33.73% |
| Gas, standard / pushed median | 8 / 6 | 8 / 6 |

The current Sprinting Abnormal reference row gave 68.91% killed by round 3, and the current loud-rider row gave 65.01%. Both agree with the committed Batch 4b results within sampling error and preserve the expected ordering. I found no evidence that the committed headline figures mix the pre-4b and post-4b ladders.

## Findings

### 1. Critical: the simulator omits required Phase 1 cases, yet reports complete target coverage

**Location:** `data/engagement/tuning.yaml:992-1012`; `tools/sim/engine.py:5-25`; `tools/sim/policy.py:1-42`; `docs/reviews/simulator-report.md:6-18, 533-544`

**Problem:** `simulator_cases` is explicitly the simulator specification, but the report admits that the engine does not model Read and Call It, Wings, initiative swaps, Pry Loose, Background Titans and retreat, two Focus Titans in a fight, Treat Injury, full Scar effects, eyes strikes, carrying, or remounting. It also omits the required health 2, 3, 5, and 6 reports, the Flier dodge, Squad Tactics over the six Grab cells, treatment and interim-issue sequences, round-time counters, and kill shares by previous behavior and Broken parts. The report nevertheless says that all Phase 1 rules, policies, and testable ADR-0014 targets were covered. This directly contradicts ADR-0014's required beside-target reports and the decided simulator specification. Disclosure in section 9 does not make the summary true, and no Simulator target entry logs the gap.

**Concrete play scenario:** A Tactician Reads from Distant and Calls the standard Medium Titan's next card. Two comrades gain 2 Bonus Dice on their dodge, changing both wear and Critical Injury rates. A flare used for Break Attention can also fill a Background Titan clock, introduce a second Focus Titan, force new Fear Rolls, and start a retreat. None of those paths can occur in this engine, so the claimed PC-harm, Jam, support, and retreat evidence does not exist. A Grab on a Health 2 victim with an earlier untreated injury is another required report; the committed data expects 100% death alone, but the report contains no such case.

**Fix options:**

1. Implement every case in `simulator_cases` through the shared engine, rerun, and keep the complete-coverage claim only if every required row is present.
2. Until then, label the simulator partial, list each unmeasured required row beside the affected target, and keep acceptance provisional. This does not satisfy final Phase 1 acceptance, but it makes the report honest.

### 2. Major: reported deaths omit the rules' aftermath sequence

**Location:** `tools/sim/engine.py:922-940`; `tools/sim/families.py:80-110`; `tools/sim/report.py:143-180, 260-277, 689-691`; Chapter 3 section 3.16

**Problem:** Chapter 3 gives each eligible patient an aftermath Treat Injury roll before engagement-limit Death Rolls. The engine skips the treatment, rolls an untreated upper bound into `end_deaths`, then the report excludes `end_deaths` and labels only in-fight deaths as "deaths per fight." That number is neither the rules result nor the engine's own no-treatment result. It is then used for the standard-Titan death bands and every Sprinting Abnormal death comparison.

**Concrete play scenario:** In my 30,000-fight current-rule reruns, the Chapter 5 reference Medium produced 0.0305 reported in-fight deaths but 0.0501 deaths with the engine's untreated end rolls. The standard Medium produced 0.0323 versus 0.0427. A legal aftermath treater moves the true value between those readings according to their Wits, Talent, and kit. Near the Abnormal's helper and screen ceilings, row-dependent treatment can also change which side of a twin comparison the result falls on.

**Fix options:**

1. Model the published aftermath policy, report total deaths after treatment and Death Rolls, and use that number for every death target and bar comparison.
2. If multiple treatment policies are intended, report each one. Keep in-fight deaths as a diagnostic column, not the target value.

### 3. Major: the Jam target is still a probe-style shortcut, not the specified full-fight case

**Location:** `data/engagement/tuning.yaml:1006`; `tools/sim/families.py:288-324`; `tools/sim/cases.py:203-229`; `docs/reviews/simulator-report.md:13, 47-78`

**Problem:** The specification requires the Jam test inside the full-fight model, with cards, Positions, and actions deciding Help and Covering. `jam_job` instead constructs bare `Titan` objects, fixes the soldier at one Position, grants the configured Help on every dodge, Covers every Push by a Boolean, and loops for three rounds without any helper soldiers, initiative, movement, action spending, harm, Fear Rolls, or turn debt. The report calls its worst cells Chapter 6 bands met. This reproduces the earlier probe's abstraction rather than checking the rule interaction the simulator was commissioned to settle.

**Concrete play scenario:** A helper who spent their action cutting a leg cannot Help the holder's later dodge, and a helper whose card has not yet come up may still Help under Chapter 1 if the policy chooses it. The shortcut grants the same Help regardless. In a two-Titan fight, Positions are relative to each Focus Titan and one Reaction is made per Titan; the shortcut has no such state. Its Jam percentage cannot validate the full-fight support pattern.

**Fix options:**

1. Run the Jam cells through `Fight` with actual helpers, two Focus Titans, initiative, Positions, and published action policies.
2. Keep this family only as a closed-form upper-bound check and remove it from the full-engine acceptance verdict.

### 4. Major: case and limit values duplicate YAML in Python

**Location:** `tools/sim/cases.py:171-186, 203-234`; `tools/sim/families.py:300-336`; `tools/sim/barcheck.py:18-23`; `tools/sim/report.py:22-25`; `docs/reviews/simulator-report.md:6, 536`

**Problem:** The simulator says every table and value comes from YAML, but Python restates the fresh-cut Stress columns, the six Grab cells, three Jam rounds, Help columns, one- and two-Titan groups, gas dice counts, and qualitative-target tolerances. `barcheck.py` even falls back to hard-coded median limits if its YAML prose regex stops matching. These are values already present in `data/engagement/tuning.yaml`, `data/gear/odm-gear.yaml`, and `data/titans/tuning.yaml`. A YAML change can therefore leave the run green against stale Python cases, which is exactly the duplication ADR-0012 is meant to prevent.

**Concrete play scenario:** If `gas_roll.dice.standard` changes from 2, `cases.py` still runs `gas/2_dice` and the report still looks up that key. If the Abnormal median wording changes so the regex no longer matches, `barcheck.py` silently restores 2 and 4 instead of stopping. Neither change flows through as the README promises.

**Fix options:**

1. Give the YAML structured case definitions and numeric limits, then generate all dimensions and report keys from them.
2. Where prose must be parsed, fail loudly on mismatch. Never supply a numeric fallback.

### 5. Major: results do not identify the rules snapshot that generated them

**Location:** `tools/sim/run.py:97-131`; `tools/sim/report.py:188-208`; `tools/sim/results/results.json`; `tools/sim/README.md` Run section

**Problem:** `results.json` records cases, seeds, counts, CPU count, and runtime, but no hashes or captured versions of the YAML and simulator source. Report generation loads the current YAML afresh and unconditionally prints that the results model decisions through Batch 4b. The documented `run.py 1 report` command can therefore render old results under a new rules claim without any warning. Fixed RNG seeds reproduce a result only after the missing source snapshot is known.

**Concrete play scenario:** If `data/titans/index.yaml` changes the Sprinting Abnormal ladder after a full run, `run.py 1 report` reads the new ladder and prose while retaining the old fight summaries. The output then claims a post-change bar from pre-change trials. The current reduced rerun suggests that did not happen here, but the artifact itself cannot prove it.

**Fix options:**

1. Store a manifest of SHA-256 hashes for every loaded YAML and simulator file in `results.json`; refuse to render when the current files differ.
2. Embed the exact normalized rule inputs used by the workers and render only from that snapshot.

## Counts

- Critical: 1
- Major: 4
- Minor: 0
