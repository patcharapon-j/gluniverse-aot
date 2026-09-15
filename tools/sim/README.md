# Wings of Freedom Phase 1 simulator

One engine for the ADR-0014 targets and the `simulator_cases` of `data/engagement/tuning.yaml` and
`data/titans/tuning.yaml` that the Phase 1 rules (Chapters 1 to 6) can test. It reads every table and rule value
from `data/` YAML when it starts, so a YAML fix flows through on the next run with no code change. It writes
`docs/reviews/simulator-report.md`. The report's section 12 states which `simulator_cases` items are measured,
partly measured, or not measured; the simulator does not model every rule.

## Run

From the repository root, one command runs everything and regenerates the report:

```
uv run --with pyyaml python tools/sim/run.py
```

In order, it:

1. runs every case in `cases.py`, at full trial counts, on every CPU;
2. re-runs, on a second seed, each Abnormal bar row past a limit under either death reading, with its twins
   (decision batch 4b, 4b-4);
3. re-runs every case with a figure beyond 3 standard errors from its committed probe figure, on new seeds at 5
   times its trials, and re-runs each flagged Chapter 6 full-fight row on the committed probe
   (`tools/probes/chapter-06/fight6.py`, imported with bytecode writing off, so nothing is written under
   `tools/probes`);
4. computes the move-up shares and the lone legal-route search, which are exact enumerations;
5. writes `tools/sim/results/results.json` with a rules snapshot, and renders the report.

Options:

- `--scale 0.05` runs 5% of every case's trials into `results/results-scale.json` and `results/report-scale.md`,
  and leaves `results.json` and the report alone. Use it as a smoke test.
- `--report` re-renders the report from `results/results.json` alone. It refuses, and lists the files, if any
  file of the rules snapshot differs from the one the results record.
- `--report --stale-ok` renders anyway and lists those files at the top of the report. Every figure is still the
  run's; the text and verdicts are the current files'. When the engine differs from the run's, the report also
  prints `report.ENGINE_CHANGES_SINCE_RUN`, the engine changes its figures do not include yet. Empty that list after
  the next full run.

## The rules snapshot

`results.json` records the SHA-256 of every file under `docs/rules/`, `docs/adr/`, and `data/`, and of the
simulator's own source, with combined hashes, the file list, and the UTC time the run started. The report prints
them. The staleness test for `--report` leaves out `docs/rules/OPEN-QUESTIONS.md` and `docs/rules/PROGRESS.md`
(no case reads them) and `report.py` and this README, which only render. The snapshots are taken when the run
starts and when it ends, so an edit made and undone while it ran does not show in them: run from a tree nobody is
editing. Because `report.py` also holds the
coverage map, the target statuses, and the explanations, the report prints the hash of the `report.py` that
rendered it, and the engine hash at rendering, beside the run's snapshot (`run.render_snapshot`). The report
checks that every Open Question it cites has a heading in `OPEN-QUESTIONS.md`. There is no git history to name a
commit, so the hashes identify the rules the figures come from.

## Decision batch 5

- **The retreat clock ends every Titan Engagement** (5-10, OQ-126). Every full fight runs under
  `background-titans.yaml`'s retreat clock (`rules.R.retreat_clock`, 8 segments, 1 a round at the background-clocks
  end step, never during a retreat). When it fills, the fight becomes a retreat: `policy.retreat_turn` makes each
  standing soldier's forced move before the action, and `engine.Fight.order_check` raises when a policy acts first,
  with two exceptions (5-1, 5-13). An action taken first for a Down or Grabbed comrade at the soldier's Position must
  be one of the actions option 4 names, and `move_check` and `stay` make the stay with that comrade the only move
  after it. A lift must be followed by the move that carries the comrade out. No Nape strike is made in a retreat,
  on a turn or through Hook and Cut (5-15). A soldier who has left still takes turns and makes Gas Rolls, and is no
  candidate, target, helper, or witness. It takes no action, a POLICY CHOICE: no row measures Treat Injury by
  soldiers who have left (OQ-132, option (b)). A Titan Engagement ends by a kill, or
  when no standing soldier holds a Position, and every soldier still holding one then dies, left behind.
  `engine.SAFETY_CAP` (60 rounds) is a model check that `stats["cap"]` counts; none should reach it. A case's
  `retreat_clock` may be `None` (the Grab cells), and `max_rounds` is a measurement cap with no end steps (the
  full-fight Jam test).
- **Tolerances** (5-11, OQ-127). `targets.py` lists every judged figure: each ADR-0014 target, each Chapter 6
  band at its table's reference start and on the bar's runs of that start in both sheet orders, and the Jam
  test's table reading. Each is Met or Missed on the tolerance the tuning files write; a figure past an edge by at
  most 2 standard errors is re-run on a second seed and judged on the pooled figure.
- **The interim day** (5-2 and 5-16, OQ-120). In a sequence, each session after the first starts with
  `engine.Fight.day_passes` (`healing.yaml`, `each_day`: the day care window over the whole Squad with Field
  Repair, day-limit Death Rolls, Health lost to damage restored, healing time), then promotion for the day's
  deaths, the new characters, and the interim issue.

## Files

| File | Holds |
| --- | --- |
| `rules.py` | Every value the engine reads, loaded from `data/` YAML into one `R` object. Text rules the YAML states only in prose are parsed with patterns that fail loudly if the wording changes; there are no fallback values. |
| `dice.py` | Soldiers, the reference builds and templates, attribute rolls with Push, Covering, Gear and Stress Dice, Stress Responses, Critical Injuries, Scars and their rows, fall damage, Fear Rolls, and Death Rolls. |
| `engine.py` | The rules: a Titan and its Behavior Table procedure, the round with the Wings step, the deal, and initiative swaps, the Attention Ladder, Read and Call It, Positions and steps, carrying, mounting, ODM wear, Jams and gas, horses, Break Attention and every decoy, the Grab with Help on Break Free and Pry Loose, strikes, Regeneration, Treat Injury and Field Repair, the start-of-fight Fear Rolls, every engagement-end step, and round-time counters. It never chooses; it calls `policy.py`. |
| `policy.py` | Every player and Squadmate choice, in one documented place. |
| `families.py` | The measurements: full fights, lone fights, the fresh lone cut, Grab cells, dodges, the probes' Jam test, gas, sequences of fights, the move-up shares, and the lone legal-route search. |
| `cases.py` | Every case with its configuration, trial count, and seed. |
| `barcheck.py` | The Sprinting Abnormal's bar limits and tolerance, under both death readings. |
| `targets.py` | Every judged target and band, its tolerance, and the second-seed rule. |
| `recheck.py` | The committed probe's entry points for re-checks. |
| `run.py` | The one command: runs, second seeds, re-checks, snapshot, results, report. |
| `report.py` | Renders the report. Every limit is read from ADR-0014 or the tuning files; every explanation of a gap is generated from re-check figures. |

## Seeds

A case with seed `S` runs chunk `i` of 16 on `random.Random(S * 1000 + i)`, whatever the CPU count, so a run
repeats its figures exactly. The end-of-engagement steps draw on a second stream seeded from the chunk seed, so
they leave the fight's own draws unchanged.

| Family | Seed base |
| --- | --- |
| Chapter 5 full fights | 10000 |
| Chapter 6 full fights | 20000 |
| Chapter 6 cases the probes left unrun, and full-fight reports | 21000 |
| Sensitivity rows for rules the simulator adds | 23000 |
| Abnormal bar, cutters first / strikers first | 30000 / 40000 |
| Grab-alone bar variant, cutters first / strikers first | 50000 / 55000 |
| Lone fights | 60000 |
| Fresh lone cut | 70000 |
| Grab cells and Grab reports | 80000 |
| The probes' Jam test | 90000 |
| The Jam test inside the full fight | 91000 |
| Dodges | 95000 |
| Sequences | 97000 |
| Gas | 99000 |

A bar row's second seed is `S + 100000`, a re-check's `S + 500000`, and a probe re-check's `S + 700000`.
Trial counts come from the tuning files (`R.fights_per_case`, `R.bar_fights`, `R.lone_trials`, and so on); the
dodges and sequences, for which no file states a count, use the constants at the top of `cases.py`.
