# Chapter 6, Standard Titans: review round 2

Reviewed:

- `docs/rules/06-standard-titans.md`.
- Every file in `data/titans/`: `roster.yaml`, the four Titans, `tuning.yaml`, and the generated `probe-figures.yaml` (through the rendered tables, which `render.py check` confirms match).
- The probes in `tools/probes/chapter-06/` (`titans.py`, `fight6.py`, `lone6.py`, `jam6.py`, `run6.py`, `cases6.json`), and the Chapter 5 probe code they import (`fight.py`, `lone.py`, `simple.py`, `core.py`).
- OQ-100 to OQ-108 in `docs/rules/OPEN-QUESTIONS.md`.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended through decision batch 3b.
- Chapters 1 to 5 and their data, with Chapter 5 sections 5.4 to 5.13 and `data/engagement/` read in full.
- `docs/rules/DECISIONS-2026-09-14.md`: batch 3 (OQ-78 to OQ-99), batch 3b (3b-1 to 3b-8), and *Constraints on the undrafted Phase 1 chapters*.
- Round 1: `06-standard-titans-review-1.md` and `-review-1-codex.md`.

I did not read the parallel Codex round 2 review or the Chapters 1 to 5 conformance round 2 files.

The odds come from Python scripts in the session scratchpad, not committed; the appendix describes them. Every fight figure runs the drafter's `fight6.py` unchanged, or subclasses it only to count cards, with fresh seeds. Variants use `fight6.py`'s own `entry_over`, `rungs`, and `titan` options.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**0 Critical, 3 Major, 7 Minor.**

Round 1's findings are resolved, apart from two Minor residuals. The three standard Titans are ready:
- Every ADR-0014 target is met, and every figure reproduces on fresh seeds.
- Batch 3b's lone rows, screen rows, and Squad Tactic rows are in place for every table.
- No table is unwinnable or trivial.

The Sprinting Abnormal is where the work still is, in three places:
- **It still runs when grounded (finding 1).** Its three leg entries each need one unbroken leg, so a Titan that a Broken leg has dropped to the ground still runs past, tramples, and lunges.
- **Its ladder does the opposite of its canon reason (finding 2).** It is justified as ignoring the soldiers close to it, but its `nearest` rung goes for exactly those soldiers. What the ladder really ignores is the Nape striker. That makes it the easiest Medium-class kill in the chapter.
- **Its ceiling is read differently from its floor (finding 3).** The drafter's conflict 2 is real, not sampling noise. At 120,000 fights the Abnormal's supported-Squad deaths sit 4 to 7 standard errors above the Large Titan's.

## Checks that passed

- **Tooling.** `titans.py` reports 0 problems for all four Titans, and `render.py check` reports every rendered block matching its YAML.
- **Stat blocks.**
  - Each standard Titan's Tempo, Nape Depth, Regeneration clock, Toughness by kind, and Severity by tier match `size-classes.yaml`.
  - Each has the five standard Body Parts in order and the standard ladder.
  - The Abnormal's values sit inside the batch 3 bounds, and its ladder's rungs come from the closed `tests` list and end with `nearest`.
- **Behavior Tables.**
  - Every table covers results 1 to 6 with the tier pairs, one Thrash, and one telegraph.
  - Every fallback names another entry or Thrash.
  - Every control and Thrash Critical Injury has `cannot_be_lethal: true`.
  - Each standard table has one Grab result and one lethal result.
  - A holder at In Reach meets 5, 5, 4, and 5 results in six.
  - No effect touches a horse, and no entry names death.
- **Move-up shares.**
  - The highest kill share in any previous-behavior and Broken-part state is 0.50 on every table.
  - The fewest legal non-Thrash entries are 3, 2, 3, and 1.
  - The Abnormal's single-entry state (after Veer, both arms and both legs Broken) still resolves every result.
- **Harm (Chapter 3, ADR-0005, ADR-0015).**
  - Every harming effect is a Critical Injury as a Titan attack.
  - The Grab's harm is the torso crush, which cannot be lethal.
  - The Closing Hand Scar reads the grab effect (`scars.yaml`), and `health.yaml` points to `data/titans/`.
- **The batch 3 constraints on Chapter 6.** Every item is honoured:
  - format and values;
  - table shape and the Grab mark;
  - at most one Grab and one lethal result;
  - the In Reach share;
  - no horse effect;
  - the per-table targets at the reference start;
  - the Jam test per table;
  - move-up shares by previous behavior and by Broken parts;
  - Abnormals reported and not tuned;
  - public and hidden values;
  - no Small or Medium entry above its class's kill Severity.
- **Batch 3b (3b-1, 3b-2, 3b-8) on Chapter 6.**
  - The lone-fight rows at each Titan's Tempo and Nape Depth, on the waiting and the hurried lines.
  - The helper, screen, Hook and Cut with Hamstring Line, and screen-with-pair rows for every table.
  - Every Squad Tactic alone and in pairs for the standard Medium Titan.
  - *How the fights compare* reads each support row against the Medium Titan's row of the same support.
  - `fight6.py` inherits the hold of Tempo cards and the decoys-in-a-row reset through `fight.py`'s `titan_card`.
- **Probes model the rules as written.** Spot-checked against the rules they model:
  - the start-of-fight Fear Roll, after the first ladder evaluation, with spent turns landing on round 1 (`engagement-flow.yaml`, `starting`);
  - a Grabbed rider running Chapter 5's countdown;
  - a mounted soldier who goes Down, or whose horse goes lame, falling from the horse (`horses.yaml`, `forced_dismount`);
  - the Grab cells tested against each Titan's own Grab Severity (`simple.grab_trial`, `dodge_severity`);
  - `lone.py` reading each Titan's entries, Tempo, Nape Depth, and the abnormal Fear Roll.
- **OQ-105's applied items.** Spot-checked, and each is in place:
  - `titan-format.yaml` (`entry_fields.text`, `attention_ladder`);
  - `attention.yaml`, `read.yaml`, `behavior-procedure.yaml` (`move_up_shares`);
  - `engagement-setup.yaml` (`medium_abnormal`), `background-titans.yaml`;
  - `scars.yaml`, `health.yaml` (lines 66 and 88);
  - Chapter 5's `tuning.yaml` (`simulator_cases`);
  - the Chapter 1, 3, 4, and 5 prose pointers.
- **The example.** The arithmetic checks:
  - Oskar keeps the tie.
  - Renate takes Attention on the second rung.
  - Her Closing Hand penalty gives 2 base, 2 Gear, and 1 Stress Die.
  - Her Push reaches 3 successes against Severity 3.
- **Phase 2 and GM discretion.** Shifters, Mission Briefs, and Research Points appear only as forward references. The GM never picks a Titan, entry, target, or fallback.
- **The setup mix arithmetic.**
  - Without the Abnormal roll: 1/3 × 0.81 + 1/2 × 0.69 + 1/6 × 1.38 = 0.845 Critical Injuries, and 0.0555 deaths.
  - With it: 0.8775 and 0.0577.

**Figures that reproduce.** Mine are on fresh seeds; the second column is the chapter's.

| Figure | Mine | Chapter |
|---|---|---|
| Medium reference: median round, by round 3, no kill in 12, Critical Injuries, deaths, Grabs (12,000 fights) | 3, 62.2%, 5.0%, 0.69, 0.034, 0.205 | 3, 62.8%, 4.8%, 0.69, 0.033, 0.201 |
| Small reference (12,000) | 2, 80.0%, 1.6%, 0.85, 0.039 | 2, 81.2%, 1.3%, 0.81, 0.036 |
| Large reference (12,000) | 3, 61.4%, 13.2%, 1.37, 0.150 | 3, 62.4%, 13.0%, 1.38, 0.162 |
| Abnormal reference (12,000) | 2, 82.6%, 1.4%, 1.08, 0.058 | 2, 82.5%, 1.5%, 1.08, 0.059 |
| Medium template Squad (12,000) | 4, 48.9%, 9.7%, 0.87, 0.061 | 4, 48.6%, 10.0%, 0.88, 0.056 |
| Large template Squad (120,000) | 4, 48.9%, 20.0%, 1.73, 0.269 | 4, 49.1%, 20.4%, 1.74, 0.268 |
| Abnormal template Squad (120,000) | 4, 46.5%, 14.8%, 2.04, 0.231 | 4, 46.5%, 15.0%, 2.05, 0.237 |
| Screen beside the holder: Medium; Small (by round 3, Critical Injuries, deaths) | 66.8%, 0.44, 0.006; 87.7%, 0.52, 0.003 | 67.5%, 0.44, 0.007; 87.7%, 0.52, 0.003 |
| Abnormal with the standard ladder | 70.2%, 1.40, 0.157 | 70.7%, 1.38, 0.156 |
| Lone fresh cut: Rookie Nape Depth 4 at Stress 1 and 0; Levi-grade at Stress 2; Rookie at Nape Depth 3, Stress 1 (200,000) | 13.0%, 10.0%, 47.4%, 33.2% | 13.3%, 10.1%, 47.2%, 33.1% |
| Grab, Medium: alone after a failed dodge; one comrade at S2 G0; one comrade at S3 G1 (60,000) | 69.5%, 33.4%, 45.2% | 69.4%, 33.3%, 44.4% |
| Grab: Small one comrade at S2 G0; Large alone | 33.8%, 69.6% | 33.9%, 69.7% |
| Lone fight, waiting line (100,000): Medium, Large, Small, Abnormal | 75.8%, 74.9%, 72.1%, 51.7% | 75.9%, 75.1%, 72.4%, 51.9% |
| Lone fight, hurried line: Small, Abnormal; one-card hold: Small, Abnormal | 67.6%, 56.1%; 44.6%, 28.2% | 67.4%, 56.3%; 44.3%, 28.0% |

## The ADR-0014 targets and how the Titans compare

Every target the stat blocks control is met on the standard Medium Titan:
- **Squad of 4:** median kill round 3, 62.2% to 62.8% by round 3.
- **Lone Rookie, fresh cut at Stress 1:** 13.0% to 13.3%, inside 8% to 14%.
- **Levi-grade:** 47.2% to 47.4%, about 50%.
- **Grab:** 69.4% to 69.5% alone. With one comrade in reach, 33.3% to 33.4% at Stress 2 and no Grief, and every cell under 50% (the highest, S3 G1, 44.4% to 45.2%).

**Lone usable strike per Tempo** (waiting line, within 12 rounds):
- **Tempo 1:** Medium 75.8%, Large 74.9%.
- **Tempo 2, Small:** 72.1%, after 6.29 Titan cards, with 5.9% devoured.
- **Tempo 2, Abnormal:** 51.7%, with 20.3% Down and 1.52 Critical Injuries per lone fight.
- **Batch 3b's hold:** it makes the line Tempo-neutral on every table whose entries do not reach Distant. See *The drafter's two conflicts* for the Abnormal.

**Screen rows per table** (two Squadmates beside the holder, against two helpers):
- Cards a round fall by a fifth to a quarter, and Critical Injuries by 28% to 33%, on every table.
- The kill is no faster than with helpers: Medium 67.5% against 68.5% by round 3, Small 87.7% against 86.5%, Large 67.3% against 69.0%, Abnormal 87.2% against 87.4%.
- The Large Titan's screen costs 0.009 deaths per fight at 120,000 fights, against 0.020 with helpers, so Heavy Tread does not make it a trap.

**Comparisons:**
- **Small:** the quickest standard kill (median round 2, about 80% by round 3). It still deals more than the Medium Titan (0.81 to 0.85 Critical Injuries), because it resolves 1.50 cards a round.
- **Large:** the hardest standard fight. 13% of fights have no kill in 12 rounds, with 1.37 to 1.38 Critical Injuries and 0.15 to 0.16 deaths. For the template Squad it is 20.0% with no kill and 0.269 deaths, which is not unwinnable.
- **Sprinting Abnormal:** the quickest Medium-class kill (82.6% by round 3, against the standard Medium Titan's 62.2%), yet it deals 1.08 Critical Injuries and 0.058 deaths. It is also the deadliest lone fight (finding 2).
- **Unwinnable:** no table. The worst row is the Large template Squad, at 20.0% with no kill in 12 rounds.
- **Trivial:** no table. Every support row deals at least the Critical Injuries of the Medium Titan's same-support row. The strongest support (screen with Hook and Cut and Hamstring Line) still costs the Small Titan's Squad 0.50 Critical Injuries a fight.

## Findings

### 1. Major: a grounded Sprinting Abnormal still runs past, tramples, and lunges, and a grounded Large Titan still treads

**Location:** `data/titans/sprinting-abnormal.yaml` (`run-past`, `trample`, `headlong-lunge`, `body_parts_used`); section 6.5, *What its table means at the table*, "Cut its legs"; `data/titans/standard-large.yaml` (`heavy-tread`); section 6.4 design note ("a grounded Titan with both legs cut no longer walks").

**Problem:** the Chapter 5 rule and the tables disagree about what a Broken leg does.
- **The rule.** A Broken leg grounds a Titan (Chapter 5, section 5.7). ADR-0007 pictures that as the leg dropping the Titan to the ground.
- **The entries.** Each of the Abnormal's three leg entries lists `leg` once, and `titan-format.yaml` reads that as needing one unbroken leg.
- **The result.** A Titan lying on the ground with one leg cut still:
  - "runs past on long, pounding legs without slowing";
  - "runs straight through the soldier";
  - "closes the last of the gap in one long stride".

The 6.5 bullet says it plainly: the runner stops only when both legs are Broken, while one Broken leg has already dropped it for the Nape strike. The text lint cannot catch this, because it checks the words against the kinds listed, not against the Titan's state.

This is normal play, not an edge case. The baseline cutters strike legs first. Counting the cards `fight6.py` resolves (12,000 fights):

| Case | Cards a fight | Cards while grounded | Leg entries while grounded | Of those, Trample or Headlong Lunge Critical Injuries |
|---|---|---|---|---|
| Abnormal, reference start | 4.26 | 1.28 | 0.48 | 0.32 |
| Abnormal, template Squad | 8.48 | 4.41 | 0.90 | 0.59 |
| Large, reference start (Heavy Tread, Stress only) | 3.68 | 2.61 | 0.10 | 0 |

So about three grounded Abnormal cards in eight are a sprint by a Titan that cannot stand. The 6.4 design note mixes up "grounded" (one Broken leg) with "both legs cut".

**Scenario:** a Squad meets the Abnormal on horseback.
1. In round 1 a cutter breaks its left leg. It is grounded, and the strikers gain 2 dice.
2. Its next card is Trample, against a rider still at Distant.
3. By the rows, a Titan lying in the grass runs the rider down and inflicts a leg Critical Injury.
4. By ADR-0007's picture and the 6.5 bullet ("a Broken leg drops it to the ground"), a table stops the runner at step 1.

**Fix options:**
1. **List `[leg, leg]` on Run Past, Trample, and Headlong Lunge.** The format already allows a kind listed twice.
   - `titans.py`'s enumeration keeps the highest kill share at 0.50, with the fewest legal entries 1. Doubling only Run Past and Trample fails at 0.67 (previous Pitch Headlong, one leg Broken), so all three must change.
   - Measured, reference start: 83.1% by round 3, 1.4% with no kill, 0.86 Critical Injuries, 0.049 deaths.
   - Template Squad: 47.2%, 14.6% with no kill, 1.59 Critical Injuries, 0.223 deaths.
   - Helpers (120,000 fights): 0.77 Critical Injuries, 0.021 deaths.
   - Every part of the Abnormal's floor still passes: 0.86 against 0.69, 0.049 against 0.033, 0.77 against 0.63.
   - Heavy Tread with `[leg, leg]` also keeps 0.50, and leaves the Large Titan unchanged within sampling (61.4%, 12.8% with no kill, 1.40 Critical Injuries, 0.163 deaths).
2. **Keep one leg, and rewrite the texts and the 6.5 bullets** for a grounded Titan that drags itself at a soldier. The figures stay the same, but the fiction is weaker.
3. **Chapter 5 decision:** a grounded Titan cannot meet an entry that lists `leg`. That is the same effect for every two-legged Titan, stated once in `behavior-procedure.yaml`. Every table then re-runs.

### 2. Major: the Sprinting Abnormal's ladder does the opposite of its canon reason, and makes it the easiest Medium-class kill

**Location:** `data/titans/roster.yaml` (`ladders`, `sprinting-abnormal`, `reads_as`); section 6.5 design notes (lines 277 and 314) and *What its ladder means at the table*; OQ-102 (*Canon for (a)*).

**Problem:** the reason and the mechanism point different ways.
- **The reason.** OQ-102 and section 6.5 justify `[loudest-or-brightest, nearest]` by canon. Abnormals "ignore the soldiers close to them, including those attacking them, and run for somewhere else".
- **The mechanism.** The `nearest` rung (`attention.yaml`) keeps On Body first, then In Reach, then Blind Spot, then Distant. So the ladder goes straight for the soldiers clinging to it and the cutters at its legs, the very soldiers it is said to ignore.
- **What it really ignores.** The only soldiers it passes over, compared with the standard ladder, are:
  - the Nape striker at Blind Spot, even one who has just struck (the ADR-0010 clause OQ-102 names);
  - the soldier who has just hurt it, when that soldier is not the closest.

  Its own 6.5 bullet, "Otherwise it runs at whoever is nearest", contradicts its design note.

The balance effect is large, and it points against fidelity:

| Sprinting Abnormal, reference start (12,000 fights) | Median | By round 3 | No kill in 12 | Critical Injuries | Deaths |
|---|---|---|---|---|---|
| Its ladder (a) | 2 | 82.6% | 1.4% | 1.08 | 0.058 |
| Standard ladder (c) | 2 | 70.2% | 5.2% | 1.40 | 0.157 |
| (b): loudest-or-brightest, hooked-into-its-body, nearest | 2 | 74.7% | 7.4% | 1.08 | 0.096 |
| (b) with finding 1's `[leg, leg]` | 2 | 75.6% | 6.2% | 0.88 | 0.089 |
| The standard Medium Titan, for comparison | 3 | 62.2% | 5.0% | 0.69 | 0.034 |

The one Abnormal a Phase 1 table meets, the Titan canon's Survey Corps feared for its unpredictability, is the Medium-class fight a Squad wins fastest. OQ-102 says (a) was chosen "for canon, not for its figures", but the canon reading does not hold.

Raising its Nape Depth to the Medium row's 4 is not the fix. At 60,000 fights it gives:
- **reference start:** median round 3, 62.5% by round 3, 1.71 Critical Injuries, 0.149 deaths;
- **template Squad:** median round 7, 36.9% with no kill, 0.418 deaths, failing both the winnable limit (20.4%) and the ceiling (0.268);
- **helpers:** 0.065 deaths.

Nape Depth 3 is load-bearing. The ladder is the lever.

**Scenario:** the setup table gives Medium, then a 6 on `medium_abnormal`.
1. Two cutters work its legs from In Reach.
2. Two strikers alternate cuts from Blind Spot, each short cut leaving Openings for the other.
3. On every card the Abnormal turns on a cutter at In Reach and never on the strikers.

That is a standard Titan that has learned to guard its cutters and forget its Nape, not the chapter-22 runner that ignored the riders chasing it.

**Fix options:**
1. **Take OQ-102 (b).** It restores ADR-0010's hook, so a short Nape strike draws the Titan, while noise still outranks everything. Measure its template Squad and support rows against the bar before accepting.
2. **Ask for a decision adding a runner's test to the closed `tests` list**, such as the Position holding the most soldiers, or the farthest soldier, so the ladder really runs past the nearest. Then measure.
3. **Keep (a), and rewrite OQ-102's canon reason, the 6.5 design notes, and `reads_as`** to say what it does: it goes for the nearest soldier and never turns on a Nape striker. State in 6.6 that this makes it the quickest Medium-class kill.

### 3. Major: the Abnormal's ceiling is read against the Large Titan's reference figure while its floor is read row against row, and the supported rows exceed the Large Titan's for real

**Location:** section 6.6, *The Sprinting Abnormal* design note (the *Ceiling* bullet and its `PROVISIONAL` line); `data/titans/tuning.yaml` (`targets`, `abnormals`, `rule`, `ceiling`; `verdicts`, `sprinting_abnormal`); OQ-103 (*Row against row*). This is the drafter's conflict 2.

**Problem:** the bar reads its three parts two ways.
- **The floor ("not trivial")** is read row against row, as 3b-8 directs.
- **The ceiling** stays the Large Titan's reference figure of 0.162 deaths in every non-template row.

The Large Titan's support rows deal 0.008 to 0.020 deaths, so for supported Squads that ceiling is between 8 and 20 times too loose to bind. 3b-8 says "the Abnormal's own bar ... is read row against row" with no carve-out. OQ-103 itself notes the bar was set in the same fix pass as the redesign, and the provisional reading is the one that makes the Abnormal pass.

The drafter treated the gap as one to two standard errors at 12,000 fights. At 120,000 fights it is not sampling:

| Support (4 Rookie player characters and) | Abnormal deaths per fight | Large deaths per fight | Gap |
|---|---|---|---|
| 2 helper Squadmates | 0.023 ± 0.0005 | 0.020 ± 0.0006 | about 4 standard errors |
| 2 Squadmates screening beside the holder | 0.012 ± 0.0003 | 0.009 ± 0.0004 | about 6 |
| The screen with Hook and Cut and Hamstring Line | 0.011 ± 0.0003 | 0.008 ± 0.0003 | about 7 |
| Template Squad (the ceiling as written) | 0.231 ± 0.002 | 0.269 ± 0.003 | passes clearly |

For every supported Squad, the Sprinting Abnormal kills 15% to 35% more soldiers than the fight the chapter calls "the hardest standard fight Phase 1 accepts".

**Scenario:** two helper Squadmates ride with the Squad on an Expedition Leg.
1. The setup table gives the Abnormal.
2. The GM's section says it is within the ceiling.
3. The figures say it is deadlier for this Squad than a Large Titan.

A Mission Brief author later choosing between them has no row telling them so.

**Fix options:**
1. **Read all three parts row against row, and bring the Abnormal under it.** Finding 1's `[leg, leg]` narrows the helpers row to 0.021 ± 0.0005 against 0.020 ± 0.0006, within sampling but not settled. The screen rows need a re-run.
2. **State a sampling tolerance in `tuning.yaml`**, such as within 2 standard errors at a named fight count, and apply it to the floor, the winnable limits, and the ceiling alike. Then run the Abnormal rows and their Large twins at 120,000 fights.
3. **Keep the reference-figure ceiling, but say in `tuning.yaml` (`abnormals`, `ceiling`) that it binds only the reference and template rows.** Record in 6.6 and OQ-103 that a supported Squad finds the Abnormal deadlier than the Large Titan, for the decider to accept or reject.

### 4. Minor: the Abnormal's hidden values are still printed in player-facing text

**Location:** section 6.5, the design note before the GM section ("Two cards a round (Tempo 2) and every Toughness the Medium row's"); section 6.6, *A lone soldier after Break Attention*: the `solo` table's Nape Depth cell for the Sprinting Abnormal, the `lone-fight` table's Nape Depth column, and the design note ("The Small Titan and the Sprinting Abnormal have Nape Depth 3", "Chapter 5's Tempo 2 row at Nape Depth 3").

**Problem:** OQ-108 (a) prints the Abnormal's Toughness, Nape Depth, clock length, and ladder only in a GM section. Section 6.6 marks its own Abnormal subsection as the GM's, but the lone-strike subsection above it, which players read, gives the Nape Depth three times, and 6.5's player-facing note gives every Toughness. This is round 1 Minor 16, narrowed but not closed.

**Scenario:** a Tactician spends a Read success on the Abnormal's Nape Depth, which a player already read in the lone-strike table.

**Fix options:**
1. Move the Abnormal's `solo` and `lone-fight` rows, and the two design-note sentences, into *The Sprinting Abnormal* GM subsection. Cut "every Toughness the Medium row's" from 6.5's player-facing note.
2. Or render "hidden (GM section)" in those cells, with a `render.py` switch that reads `roster.yaml` (`hidden_until_read`).

### 5. Minor: the drafter's conflict 1 is a table effect, but ADR-0010's amendment now reads as a promise for every Tempo 2 Titan

**Location:** section 6.6, the lone design note; `data/titans/tuning.yaml` (`verdicts`, `lone_strike`); OQ-102 (*The lone fight*); ADR-0010 and ADR-0014 `## Amended` (batch 3b).

**Problem:** the two ADRs' batch 3b amendments say that with a hold of Tempo cards "the lone line is the same at Tempo 1 and 2 (about three lone fights in four ...)". The Sprinting Abnormal gives 51.7% (100,000 lone fights). The chapter reports this honestly.

Isolating the cause shows the gap comes from the table, not from Tempo:

| Lone fight, waiting line, Sprinting Abnormal | Usable strike | Down | Critical Injuries per lone fight |
|---|---|---|---|
| As written | 51.7% | 20.3% | 1.52 |
| No start Fear Roll | 56.8% | 17.9% | 1.37 |
| Trample limited to In Reach | 67.5% | 6.7% | 0.38 |
| Run Past and Trample limited to In Reach | 75.1% | 5.4% | 0.29 |

So about two thirds of the gap is Trample reaching a soldier waiting at Distant, which has no safer place to wait. The rest is the `abnormal` Fear Roll and Run Past's Stress. With the Distant reach removed, the row matches batch 3b's 77.1%.

No ADR-0014 target measures the lone line, and the Abnormal is untuned. That makes this a record problem, not a miss: the ADR sentence was measured on the reference table.

**Scenario:** a GM reads ADR-0010's amendment, expects a lone survivor facing the Abnormal to reach the Nape three times in four, and finds one Down in five.

**Fix options:**
1. The decider adds "on the reference table" to the two batch 3b amendment sentences, and OQ-102 records 51.7% as the runner's known cost.
2. If the lone route should stay near three in four against every Phase 1 Titan, add a lone-fight line to the Abnormal's bar in `tuning.yaml` before OQ-102 and OQ-103 are decided.

### 6. Minor: "a Titan kills only through" still misses knock-loose falls

**Location:** section 6.1, *Reading a Behavior Table*, the paragraph after the rendered-row list.

**Problem:** the sentence names three routes: a lethal Critical Injury's Death Roll, an instant-death row, and the Grab's devour step. It misses a fourth that the tables can reach.
- A knock-loose fall deals damage.
- Damage that brings current Health to 0 inflicts an immediate Critical Injury at a rolled location (ADR-0005; `core.fall_damage` calls the unrestricted gaining procedure).
- That injury can be lethal or instant death.

Scrabble, Shake Off, Shrug Off, Pitch Headlong, and every Thrash can kill this way. The death is Chapter 4 damage, not a Titan attack, but the sentence says what a Titan kills through.

**Scenario:** a striker with 1 Health box left at Blind Spot fails to dodge Shake Off, falls, reaches 0 Health, and rolls Crushed Skull.

**Fix options:**
1. Add: "or a fall its knock-loose effect causes (Chapter 4)".

### 7. Minor: the roster says a Background Titan is always standard, which Chapter 5 does not

**Location:** `data/titans/roster.yaml` (`abnormals`, `enters_play`: "A Background Titan is always the standard Titan of its Size Class"); section 6.1, *Which Titan appears*, the Background Titans bullet.

**Problem:** the setup table only ever gives standard Background Titans, which is right. But `roster.yaml` states the rule without that scope. Chapter 5 section 5.10 and `background-titans.yaml` provide for an Abnormal Background Titan (its hidden values, and the `abnormal` Fear Roll when it enters), which a Mission Brief may name.

**Scenario:** a Mission Brief names the Sprinting Abnormal as a Background Titan. `roster.yaml` forbids what `background-titans.yaml` handles.

**Fix options:**
1. Scope both sentences to "a Background Titan the interim setup table gives".

### 8. Minor: two sentences still describe effects the rows do not have

**Location:** section 6.1 design note, *Control* ("it swats soldiers out of the air"); `standard-large.yaml` (`crush` text) against its effect.

**Problem:**
- **Swat.** It has no knock-loose, so a flyer who fails to dodge stays airborne with a Critical Injury. This is the residual of round 1 Minor 8.
- **Crush.** "Drops its whole weight onto the soldier" gives a leg Critical Injury that cannot be lethal, because control-tier harm must be. That is a hard picture to square with a 15 m Titan.

**Scenario:** a flyer fails a Swat, and the table, reading the design note, drops them.

**Fix options:**
1. "It swats at soldiers"; for Crush, "it slams down beside the soldier and pins their legs" (no Titan Body Part named, so the lint and the kill share are unchanged).

### 9. Minor: several lines contradict their row's Position requirement

**Location:** `standard-small.yaml` (`gape` text), `standard-medium.yaml` (`fixed-grin`), `standard-large.yaml` (`loom`), `sprinting-abnormal.yaml` (`veer`).

**Problem:** each of these entries works at any Position, but its line assumes one:
- **Gape** is "close enough to touch the soldier", even at Distant.
- **Fixed Grin, Loom, and Veer** turn the Titan's face to the soldier, even at Blind Spot, which the glossary defines as out of the Titan's sight.

The line decides nothing (6.1), but the chapter's stated purpose for the lines is that "the words never show a Titan doing something" its row forbids. The lint covers Body Parts, not Positions.

**Scenario:** a Medium Titan's Fixed Grin resolves against a holder at Blind Spot. The GM narrates a grin at a soldier the Titan cannot see.

**Fix options:**
1. Reword the four lines for any Position (for example, "it stops and grins at nothing, and its weight shifts toward the soldier").
2. Extend the `titans.py` lint to Position words ("touch", "face", "sight") for entries whose requirement includes Distant or Blind Spot.

### 10. Minor: `roster.yaml` uses a glossary _Avoid_ term

**Location:** `data/titans/roster.yaml` (file name), and every pointer to it in Chapters 5 and 6 and their data.

**Problem:** "roster" is on Squad Pool's _Avoid_ list. A file of Titans named `roster` invites the word back into use for the Squad.

**Scenario:** a Foundry importer author names the Squadmate compendium after the Titan file's pattern.

**Fix options:**
1. Rename it `titans.yaml` or `index.yaml` in the next pass that touches the pointers.
2. Or leave the file name, and add a `CONTEXT.md` note that file names are exempt.

## The drafter's two conflicts

1. **The Abnormal's lone usable strike (51.9%) against batch 3b's Tempo 2 hold (77.1%).** Judged sound to report, not a miss.
   - The gap is the Abnormal's table, not Tempo. Limiting Run Past and Trample to In Reach gives 75.1%, and Trample alone accounts for about 16 points.
   - No ADR-0014 target covers the lone line, and the Abnormal is untuned. The fault is the ADR sentence's unstated scope (finding 5).
2. **The Abnormal's supported death rows just above the Large Titan's.** Judged real, and the provisional reading unsound as written.
   - At 120,000 fights the gaps are about 4, 6, and 7 standard errors.
   - The ceiling needs the same reading as the floor, or an explicit statement that it binds only the reference and template rows (finding 3). Finding 1's fix narrows the helper gap to within sampling.

## Round 1 findings

**Opus round 1:**

| # | Severity | Finding | Status |
|---|---|---|---|
| 1 | Major | Abnormal figures omitted its Fear Roll and mounted start | Resolved: `fight6.py` models both, and the reference start uses them |
| 2 | Major | A Snatched rider's Grab countdown never ran | Resolved: a Grabbed rider runs Chapter 5's branch |
| 3 | Major | A lone soldier almost never got a usable strike at Tempo 2 | Resolved by 3b-8; Small 72.1% on fresh seeds |
| 4 | Major | Entries whose text used a Body Part listed none | Resolved: renamed, rewritten, and linted. Finding 1 is a different gap (grounded, not Broken) |
| 5 | Major | The Abnormal's bar had no ceiling | Resolved in form; its reading is finding 3 |
| 6 | Major | No Squad Tactic or decoy-screen rows | Resolved: support rows for every table, full tactic set on the Medium Titan |
| 7 | Minor | The ADR-0010 clause the ladder sets aside was unnamed | Resolved in OQ-102 |
| 8 | Minor | Prose promised effects the entries lacked | Still open: the 6.1 note's "swats soldiers out of the air" (finding 8) |
| 9 | Minor | Leap's later effects on a dead target were undefined | Resolved: Leap withdrawn, the rule logged as OQ-107 |
| 10 | Minor | "Kills only through" missed instant-death rows | Resolved; knock-loose falls are a new gap (finding 6) |
| 11 | Minor | OQ-100's fields restated `effects` | Resolved: option (b) |
| 12 | Minor | The Grab probe ignored each Titan's Grab Severity | Resolved: `dodge_severity` |
| 13 | Minor | The Abnormal's Jam test held a holder its ladder never picked | Resolved: the mounted reading |
| 14 | Minor | Under OQ-104 (a) no Phase 1 play met the Abnormal | Resolved: option (b) |
| 15 | Minor | OQ-105 missed four pointers | Resolved: items 11 to 16, spot-checked |
| 16 | Minor | Hidden values printed where players read | Still open: narrowed (finding 4) |
| 17 | Minor | No `PROVISIONAL:` line for the standard tables | Resolved: 6.1 cites OQ-101 |
| 18 | Minor | "limbs" and "speed" | Resolved; "roster" is finding 10 |

**Codex round 1:**

| # | Severity | Finding | Status |
|---|---|---|---|
| 1 | Major | The Abnormal borrowed the Female Titan's tactics | Resolved: redesigned as a Titan-only runner |
| 2 | Major | Broken parts did not disable behaviors their fiction used | Resolved for the named entries; finding 1 covers the grounded case |
| 3 | Major | The Abnormal was unreachable in Phase 1 | Resolved: the `medium_abnormal` roll |
| 4 | Major | The Abnormal's bar accepted trivial or unwinnable rows | Resolved: every row is bounded, and the template row passes at 120,000 fights; the ceiling's reading is finding 3 |
| 5 | Minor | A mounted soldier who went Down did not fall | Resolved: `fall_from_horse` |
| 6 | Minor | The Small Titan's head at a soldier's waist | Resolved: it crouches and ducks |

## Open questions OQ-100 to OQ-108

- **OQ-100 (b):** sound. The Grab column is rendered from the effect it marks, and the Closing Hand reads the same fact.
- **OQ-101 (a):** sound. The strict reading catches the Broken-part case the constraint exists for. Finding 1 adds that a doubled leg on Heavy Tread keeps 0.50.
- **OQ-102 (a):** unsound as reasoned (finding 2). The ADR-0010 note is right, and ADR-0010's standard-ladder paragraph does not bind an Abnormal ladder. (b) is the better provisional choice until a runner's test exists.
- **OQ-103 (a):** the values are sound, and Nape Depth 3 is load-bearing (Nape Depth 4 fails the template row: median round 7, 36.9% with no kill, 0.418 deaths). The ceiling's provisional reading is unsound (finding 3).
- **OQ-104 (b):** sound, and the setup mix checks.
- **OQ-105:** sound. Every applied item I checked is in place. Nothing in this review needs an earlier-chapter change except these:
  - finding 1's option 3, a Chapter 5 grounded rule;
  - finding 5, the scope of the batch 3b ADR sentences;
  - finding 7, which is a Chapter 6 scoping fix, not a Chapter 5 change.
- **OQ-106 (a):** sound, and needed: the glossary's "set by Size Class" contradicts the Abnormal's Nape Depth 3, and the contradiction is logged.
- **OQ-107 (a):** sound as a rule. No Chapter 6 entry reaches it, and `fight6.py` models it.
- **OQ-108 (a):** sound, but not yet fully applied (finding 4).

## Appendix: models

Every script lives in the session scratchpad, is not committed, and writes nothing in the project. Each imports the drafter's probes unchanged.

- **`r2_fights.py`:**
  - What it runs: `fight6.Fight6` subclassed only to count, in `choose`, the cards resolved while the Titan is grounded, and among them the entries that list `leg`.
  - Its outputs: `fight6.summarize`, plus standard errors of deaths and Critical Injuries per fight.
  - Cases: the reference, template, screen, and standard-ladder rows at 12,000 fights (seeds 9400 to 9409); the helper, screen, and screen-with-pair rows for the Abnormal and the Large Titan at 120,000 (seeds 9500 to 9505); both template rows at 120,000 (9600, 9601).
- **`r2_variants.py`:** `fight6.py`'s own `entry_over` and `rungs` options.
  - `[leg, leg]` on the Abnormal's three leg entries: reference start and template Squad at 12,000, helpers at 120,000.
  - `[leg, leg]` on the Large Titan's Heavy Tread.
  - The Abnormal ladder `[loudest-or-brightest, hooked-into-its-body, nearest]`, with and without the doubled legs.
- **`r2_nd4.py`:** the Abnormal at Nape Depth 4 through `fight6.py`'s `titan` option: reference start, template Squad, helpers, and the screen with the pair, 60,000 fights each.
- **`r2_lone.py`:**
  - `lone.run_many` on `lone6.lone_cfg` for every Titan and line at 100,000 trials.
  - Abnormal variants: Trample, or Run Past and Trample, limited to In Reach; no start Fear Roll.
  - The Small Titan with a start Fear Roll.
  - `lone6.solo_cell` at 200,000 trials, and `lone6.grab_cell` at 60,000.
  - `titans.share_report` on deep copies with doubled legs, for the kill-share checks.
