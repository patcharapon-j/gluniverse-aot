# Chapters 5 and 6: decisions conformance review, round 3

Reviewed:

- `docs/rules/05-titan-engagement.md` and `docs/rules/06-standard-titans.md`.
- The YAML in `data/engagement/` and `data/titans/`.
- Chapter 4 section 4.12, and the Attention rows of `data/character/action-catalog.yaml` (`draw-attention`, `break-attention`, `attention-shift`, `draw-attention-set`), with `data/character/squadmates.yaml` (`action_list`, `directing`).
- The probes in `tools/probes/chapter-05/`, `chapter-06/`, `batch-4/`, and `batch-4b/`. Older batch probes were read as historical snapshots only. `tools/sim/` was not reviewed.
- Every run used a copy of `data/`, `tools/`, and the two chapters in the session scratchpad, so nothing in the repository was written.

Checked against:

- `docs/rules/DECISIONS-2026-09-14.md`, *Batch 4b* (4b-1 to 4b-7) and its `Revised by batch 4b:` lines on 4-3 and 4-4, over batches 3 to 4.
- ADR-0003, ADR-0010, and ADR-0014 with their batch 4 and 4b `## Amended` paragraphs, and ADR-0001 to ADR-0015 behind them.
- `CONTEXT.md`: Attention, Attention Ladder, Draw Attention, Break Attention, and Abnormal.
- The decider's staging file for the register (`batch-4b-staging.md`), for OQ-102, OQ-103, and OQ-112. Per the brief, those register edits are not counted as chapter findings.
- The previous round: `05-06-decisions-conformance-review-2.md` and `-review-2-codex.md`.

Not read, as the brief directs: `05-06-decisions-conformance-review-3-codex.md`.

Severity:

- **Critical:** contradicts an ADR or the glossary without being logged as an open question, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**No Critical, one Major, five Minors.**

**The previous round's Critical is resolved, and its Major is logged.**

- **ADR-0010's promise holds on every ladder.** Every ladder now begins with hooked-into-its-body. The promise is that a Nape striker who falls short draws the Titan's next behavior.
  - **The walk.** It holds through the committed `evaluate` with a loud comrade at Distant, a loud comrade On Body, a decoy hold's last card, the first card after a Grab release, and fight start (*Check 1*).
  - **The counter.** Across 29 simulated rows, no card resolved on a holder without the hooked-by-strike flag while a hooked striker stood. That covers every stance and bar row, the fix options, and the screens, on 0.43 to 1.87 cards a fight resolved while such a flag stood.
- **A player character who rides at Distant and shouts stops paying.** At 120,000 fights on fresh seeds, that Squad gives 65.1% and 65.0% killed by round 3, 0.904 and 0.908 Critical Injuries, and 0.0786 and 0.0803 deaths. The baseline gives 69.4% and 69.3%, 0.851 and 0.852, and 0.0772 and 0.0789.
- **Four strikers is logged.** It is reported beside the target in both chapters, ADR-0014 reads the target under the baseline Squad, and OQ-112 is staged.

**The Abnormal's bar holds in both Squad sheet orders under the rules as written.** Fresh seeds at 120,000 fights a row were used. The closest ceiling gaps are helpers at +0.35 and −1.16 standard errors, and the screen with the pair at −1.65 and −0.24. No row needed a second seed. That includes the loud-rider and four-striker rows (*Check 2*).

**The Distant-noise stance survives in the form batch 4b did not measure (finding 1).** It no longer needs a player character; it needs two Squadmates.
- **The stance.** The reference Squad's two Squadmates stay mounted at Distant and take Draw Attention every turn. The players direct them, and it costs no soldier.
- **The Abnormal.** It then deals 0.53 Critical Injuries a fight. The standard Medium Titan deals 0.69 to the same Squad, so the Abnormal fails its own not-trivial floor by 42.5 and 43.2 standard errors. It also deals fewer deaths than the standard Medium Titan to that Squad (8.1 and 8.9 standard errors).
- **Against the helpers row.** The stance beats the Abnormal's helpers row on every measure but pace.
- **The standard Titans.** They are untouched, because loudest is their fourth rung.

**Batch 4b's impacts are otherwise applied completely.**
- **Checks.** `run6.py check` finds no problem on any table or ladder, including the new first-rung check. `render.py check` finds every rendered block matching the YAML.
- **Figures.** Every figure the drafter reports reproduces.
- **Text.** The Attention texts agree across the ADRs, the glossary, the Catalog, and both chapters, except where Minors 5 and 6 say.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 2, Character Creation (Catalog Attention rows, Squadmate actions) | 0 | 0 | 0 |
| Chapter 4, Gear (section 4.12) | 0 | 0 | 0 |
| Chapter 5, Titan Engagement | 0 | 0 | 2 |
| Chapter 6, Standard Titans | 0 | 1 | 3 |
| **Total** | **0** | **1** | **5** |

A finding that also touches an ADR, the glossary, the decisions file, or a probe is counted under the chapter it most affects, and its location names every file.

---

## Check 1: ADR-0010's promise, stances, and who holds Attention

### The moments, walked

Each case sets Positions, flags, holders, and cards on the committed `fight6.Fight6` and calls its `evaluate` (`scen3.py`, appendix). It uses 4 player characters with cards pc0 14, pc1 3, pc2 9, and pc3 17. Both ladders give the same outcome at every moment unless the row says otherwise.

| Moment | Rule that decides it | Sprinting Abnormal | Standard Medium Titan |
|---|---|---|---|
| Fight start: all at Distant, no cards | `none` (4b-6: no Phase 1 rung picks out one soldier) | Nothing holds | Nothing holds |
| First card, no one has moved | nearest ties everyone; `card` | pc1 (card 3) | pc1 |
| Entry at the background-clocks end step | `card` skipped; `none` | Nothing holds | Nothing holds |
| Entry mid-round after a flare | `card` (4b-3) | The lowest card, as in the first-card row | Same |
| pc2 fell short; pc0 loud at Distant; pc1 holds Attention In Reach | hooked rung first; struck-first | pc2 | pc2 |
| pc2 fell short; pc0 loud and On Body | struck-first narrows On Body out | pc2 | pc2 |
| A decoy hold's last card; pc2 struck during the hold; pc0 loud | the hold's last card evaluates; flags stand | pc2 | pc2 |
| First card after a Grab release; pc2 cut during the Grab; pc0 loud | holder-gone, then the card evaluates | pc2 | pc2 |
| pc2 (card 9) and pc3 (card 17) both fell short; no holder | the lower rungs tie; `card` | pc2 only (Minor 5) | pc2 only |
| The same; pc3 already held Attention | `holder` | pc3 | pc3 |
| Holder pc0 at Distant; pc1 In Reach | current-holder is not met at Distant | pc1 | pc1 (on the In Reach rung) |
| Two loud Squadmates at Distant (cards 5 and 2); cutters In Reach; pc0 holds; no one hooked | Abnormal: loudest is rung 2. Standard: In Reach is rung 2 | sm1 (finding 1) | pc0 |

**Every moment gives one outcome, and no player choice, GM choice, or list order enters any of them.** Draw Attention decides who holds Attention only through its flag, which is a public fact the ladder reads.

### The promise, counted in play

`stance_r3.py` subclasses batch 4b's `loud_b4b.FightL` only in `choose`. It counts:
- the cards resolved while a living candidate who is neither Down nor Grabbed holds the hooked-by-strike flag;
- among those, the cards resolved on a holder without that flag.

| Rows | Cards a fight with a hooked candidate | Of those, on a holder without the flag |
|---|---|---|
| 19 stance rows (60,000 fights a row) | 0.525 to 1.738 | 0.0 in every row |
| 12 bar rows (120,000 fights a row), both orders | 0.541 to 1.371 | 0.0 in every row |
| 6 screen and helper rows; 4 and 5 fix-option rows; the same-roles Medium twin | 0.432 to 1.874 | 0.0 in every row printed in full. The loud-Squadmate rows show 0.0 cards on the rider over a hooked comrade |

### Stances, under the rules as written

60,000 fights a row on fresh seeds. The Sprinting Abnormal uses its swapped ladder and a mounted start with the `abnormal` Fear Roll. "Loud" means the soldier stays mounted at Distant and takes Draw Attention with every action. Squadmates take their own cards, because the probe models no Wings.

| Table | Squad | By round 3 | No kill in 12 rounds | Critical Injuries | Deaths | Grabs |
|---|---|---|---|---|---|---|
| Sprinting Abnormal | baseline | 69.6% | 7.53% | 0.849 | 0.0790 | 0.322 |
| Sprinting Abnormal | loud player character, cutter, 2 strikers | 64.9% | 7.36% | 0.905 | 0.0794 | 0.252 |
| Sprinting Abnormal | baseline and 2 helper Squadmates | 77.0% | 4.11% | 0.787 | 0.0201 | 0.294 |
| Sprinting Abnormal | **baseline and 2 loud Squadmates** | **76.5%** | **1.66%** | **0.534** | **0.0193** | **0.152** |
| Standard Medium Titan | baseline and 2 loud Squadmates | 61.7% | 4.90% | 0.694 | 0.0246 | 0.211 |
| Standard Large Titan | baseline and 2 loud Squadmates | 61.1% | 13.10% | 1.422 | 0.0572 | 0.301 |
| Sprinting Abnormal | 4 strikers | 91.4% | 0.37% | 0.620 | 0.0171 | 0.178 |
| Sprinting Abnormal | loud player character and 3 strikers | 81.1% | 2.39% | 0.690 | 0.0365 | 0.166 |
| Sprinting Abnormal | 4 strikers and 2 helpers | 95.3% | 0.04% | 0.663 | 0.0037 | 0.201 |
| Sprinting Abnormal | 4 strikers and 2 loud Squadmates | 93.6% | 0.13% | 0.495 | 0.0060 | 0.105 |
| Standard Medium Titan | 4 strikers | 78.3% | 0.65% | 0.427 | 0.0104 | 0.146 |
| Standard Medium Titan | loud player character and 3 strikers | 60.7% | 5.29% | 0.590 | 0.0278 | 0.170 |
| Standard Medium Titan | 4 strikers and 2 helpers | 85.7% | 0.15% | 0.444 | 0.0034 | 0.160 |
| Standard Medium Titan | 4 strikers and 2 loud Squadmates | 79.3% | 0.60% | 0.420 | 0.0068 | 0.142 |
| Standard Large Titan | 4 strikers and 2 helpers | 86.3% | 0.76% | 0.708 | 0.0055 | 0.179 |
| Standard Large Titan | 4 strikers and 2 loud Squadmates | 78.7% | 2.11% | 0.775 | 0.0091 | 0.170 |
| Standard Small Titan | 4 strikers and 2 helpers | 95.2% | 0.03% | 0.686 | 0.0033 | 0.231 |
| Standard Small Titan | 4 strikers and 2 loud Squadmates | 90.4% | 0.36% | 0.643 | 0.0118 | 0.204 |

What the table shows:
- **A loud player character** buys nothing on any table. Next to four strikers, a loud rider in place of a striker is worse (81.1% against 91.4% on the Abnormal).
- **A silent parked rider** stays a wasted soldier (committed: 0.177 deaths against the standard Medium Titan's 0.082). No one in that row holds the loudest flag, so 4b-1 cannot move it.
- **Two loud Squadmates** are wasted on every standard table, where they draw 0.11 (Medium) to 0.17 (Large) cards a fight. Against the Sprinting Abnormal they draw 1.83 of its cards a fight and screen the cutters (finding 1).
- **Four strikers** remain the strongest stance on every table (OQ-112, logged). Loud Squadmates beside them trade Critical Injuries for deaths against helpers and dominate nothing.

---

## Check 2: the Abnormal's bar under the rules as written, re-simulated

### Fresh seeds, both orders

`stance_r3.py bar` runs the committed `fight6.py` through batch 4b's `loud_b4b.FightL`, at 120,000 fights a row from seed 93001. Each twin is run in the same order.
- **The loud-rider row** is read against the reference twins, as `abnormals.rule` gives it no twin of its own. Minor 3 covers the other reading.
- **The four-striker row** is read against the standard four-striker rows.
- **Gaps** are in standard errors of the difference, and a positive gap is on the failing side.

| Order | Row | Median | Critical Injuries: it; Medium twin (gap) | No kill in 12 rounds: it; Large twin (gap) | Deaths: it; Large twin (gap) |
|---|---|---|---|---|---|
| Cutters first | Reference | 2 | 0.851; 0.701 (−31.3) | 7.56%; 13.04% (−44.5) | 0.0772; 0.1631 (−35.5). Medium reference 0.0331 |
| Cutters first | Helpers | 2 | 0.796; 0.638 (−38.9) | 4.10%; 9.38% (−52.0) | 0.0207; 0.0204 (**+0.35**) |
| Cutters first | Screen | 2 | 0.521; 0.424 (−28.9) | 2.30%; 8.90% (−71.3) | 0.0102; 0.0107 (−1.00) |
| Cutters first | Screen with the pair | 2 | 0.453; 0.387 (−21.5) | 1.46%; 6.89% (−67.1) | 0.0077; 0.0084 (−1.65) |
| Cutters first | Loud rider | 3 | 0.904; 0.701 (−40.5) | 7.30%; 13.04% (−46.8) | 0.0786; 0.1631 (−37.0) |
| Cutters first | Four strikers | 2 | 0.623; 0.426 (−61.1) | 0.35%; 2.44% (−43.4) | 0.0181; 0.0839 (−38.5) |
| Strikers first | Reference | 2 | 0.852; 0.706 (−30.5) | 7.57%; 13.05% (−44.5) | 0.0789; 0.1627 (−34.7). Medium reference 0.0344 |
| Strikers first | Helpers | 2 | 0.791; 0.641 (−36.9) | 4.06%; 9.37% (−52.3) | 0.0198; 0.0208 (−1.16) |
| Strikers first | Screen | 2 | 0.516; 0.420 (−29.3) | 2.18%; 8.98% (−73.1) | 0.0101; 0.0105 (−0.80) |
| Strikers first | Screen with the pair | 2 | 0.456; 0.385 (−23.2) | 1.50%; 7.05% (−67.8) | 0.0080; 0.0081 (−0.24) |
| Strikers first | Loud rider | 3 | 0.908; 0.706 (−40.2) | 7.37%; 13.05% (−46.3) | 0.0803; 0.1627 (−35.4) |
| Strikers first | Four strikers | 2 | gap −60.7 | gap −43.9 | 0.0182; 0.0846 (−38.9) |

**Every part holds in every row and both orders.** The orders differ by sampling alone.
- **No re-run needed.** No row passes 2 standard errors on its first seed, so the second-seed reading (4b-4) is never needed.
- **The helpers ceiling.** It stays at its twin's rate (+0.35 and −1.16), as the chapter now says.
- **The reference median.** It sits at 50.2% killed by round 2 in both orders, so round 2. Chapter 6 reports this boundary.

### The row the bar does not run: two loud Squadmates

`loudsm_r3.py` runs the reference Squad plus 2 loud Squadmates, with every twin mounted and at 120,000 fights a row from seed 95001.

| Order | It: by round 3; no kill; Critical Injuries; deaths; Grabs | Medium twin (same Squad) | Large twin (same Squad) | Its helpers row | Bar reading |
|---|---|---|---|---|---|
| Cutters first | 76.5%; 1.74%; 0.534; 0.0195; 0.152 | 61.8%; 5.03%; 0.694; 0.0252 | 61.6%; 12.97%; 1.404; 0.0564 | 76.9%; 4.07%; 0.789; 0.0215 | **Not trivial fails by +42.5.** Deaths are below the Medium twin by 8.1 |
| Strikers first | 76.6%; 1.72%; 0.533; 0.0191; 0.149 | 61.8%; 5.03%; 0.695; 0.0254 | 61.4%; 13.14%; 1.417; 0.0582 | 76.9%; 4.04%; 0.793; 0.0206 | **Not trivial fails by +43.2.** Deaths are below the Medium twin by 8.9 |

`abnormals.rule` gives a row with a rider Squadmate no twin of its own. Read that way, the row falls against the Medium reference row's 0.70, and it fails the floor all the same.

---

## Check 3: batch 4b applied, and one Attention text

| Item | Where checked | Status |
|---|---|---|
| 4b-1 | `attention.yaml` `abnormal_ladder_format` (`rungs`, `rules`); section 5.6 *Abnormal ladders*; section 5.7 *Nape strikes*; `index.yaml` `rungs` and `reads_as`; section 6.5 rendered ladder, GM bullets, and design note; ADR-0010; `titans.py` first-rung check (passes on both ladders); `cases6.json` loud-rider rows; section 6.6 Draw Attention and loud-rider rows | Applied. `index.yaml`'s `ladders` header comment lags (Minor 4) |
| 4b-2 | ADR-0014; section 5.13 row and bullet; `data/engagement/tuning.yaml` `squads.four_strikers` and `simulator_cases`; section 6.6 *Four strikers and no cutters*; `data/titans/tuning.yaml` `verdicts.four_strikers` and `simulator_cases`; `cases2.json`, `cases6.json` | Applied. OQ-112 is staged and not counted. The reference Titan's median lag is Minor 4 |
| 4b-3 | `attention.yaml` `changes.titan-becomes-focus`, `evaluation.card`, `evaluation.none`; section 5.6 steps 5 and 6 and the OQ-81 note; `background-titans.yaml` `ticks.flare` and `full_clock`; section 5.10 *Entering*; section 6.5 *Only then whoever is nearest*; `reads_as` | Applied |
| 4b-4 | ADR-0014; `abnormals.sampling`; `run6.py` `second_seeds`; section 6.6 bar note; `verdicts.sprinting_abnormal` | Applied |
| 4b-5 | Register | Staged; not counted |
| 4b-6 | ADR-0010; section 5.1 step 5; section 6.6 *Support rows*; `CONTEXT.md` Attention | Applied. The glossary sentence's omission is Minor 6 |
| 4b-7 | The 4-4 `Revised by batch 4b:` line; `sprinting-abnormal.yaml` header (Trample at the control Severity); section 6.5 does not repeat the old sentence | Applied. OQ-103's Decision line is staged |

### One Attention text

| Rule | ADR-0003 | ADR-0010 | `CONTEXT.md` | Catalog | Chapter 5 | Chapter 6 |
|---|---|---|---|---|---|---|
| Every ladder begins with hooked-into-its-body | not stated (not its subject) | 4b paragraph | not stated (acceptable) | not stated | `abnormal_ladder_format.rules`; 5.6; 5.7 | 6.5; `reads_as` |
| Flags last until the end of the next card that resolves a behavior | item 2 | 3e paragraph | Attention Ladder; Draw Attention | `draw-attention` notes | `flag_duration`; 5.6 | 6.6 *Support rows* |
| Tie: holder, then lowest card, skipped at the start and at an end step, used mid-round after a flare; else nothing | batch 4 paragraph (start or end step) | batch 4 and 4b paragraphs | Attention (Minor 6) | not stated | `evaluation`; 5.6 steps 4 to 6 | 6.5 bullet; `reads_as` |
| Start: nothing holds unless a rung picks out one soldier | not stated | 4b paragraph | Attention | not stated | `titan-becomes-focus`; 5.1 step 5 | 6.6 *Support rows* |
| current-holder not met at Distant | not stated | batch 4 paragraph | not stated | not stated | `tests`; 5.6 | 6.5 rendered ladder and bullets |

**Stale wording.**
- **No noise above the hooked rung.** No text puts loudest above hooked-into-its-body, outside two labelled places: history sentences ("until decision batch 4b") and the two report rows named "under its ladder before decision batch 4b".
- **No `PROVISIONAL` tags.** `grep` finds none in either chapter or in the YAML.
- **No _Avoid_ terms.** A scan of both chapters, `attention.yaml`, `index.yaml`, `sprinting-abnormal.yaml`, and `data/titans/tuning.yaml` against every glossary _Avoid_ entry finds no misused term. The only hits are the defined terms themselves, such as Focus Titan, Background Titan, and Body Part.

---

## Check 4: tables, pointers, and fidelity

- **Tables.**
  - `run6.py check` gives "problems: []" for all four tables and both ladders, with the highest kill share 0.5 in any state. The horse selftest passes.
  - Every table covers results 1 to 6 once, escalates by tier, has one telegraph entry (Lurch Closer, Fixed Grin, Loom, Veer), and bars back-to-back repeats.
  - Broken parts always leave a legal entry. The Sprinting Abnormal's worst state (both arms and a leg Broken) leaves Veer and Pitch Headlong at a kill share of 0.00, and Thrash always resolves.
  - `render.py check` gives "every rendered block matches the YAML".
- **Pointers.** `reads_as`, the section 6.5 bullets, `abnormal_ladder_format`, section 5.6, and ADR-0010 cite each other correctly. Chapter 6's `simulator_cases` names "a soldier who takes Draw Attention from Distant every turn", singular (finding 1).
- **Fidelity, 845 to 850.** A runner that turns on a blade at its Nape before noise reads as canon's Abnormal and as the standard Titan's first turn. The one fidelity cost found is finding 1: two riders on the flank steer it off every cutter for the whole fight. Section 6.5's design note describes a runner that ignores the outer riders.

## Check 5: figures, re-simulated

| Figure | Committed command, this run | Independent or fresh | Chapter text | Verdict |
|---|---|---|---|---|
| Gas, two dice / three dice | `run_simple.py gas 200000`: 8 / 6 | Exact chain: median 8, mean 9.2502 / median 6, mean 6.3335 | 8 (9.25) / 6 (6.33) | Met |
| Medium kill, baseline Squad | | Standard Medium Titan, 60,000 fights (seed 98001): median 3, 61.6%, 0.70, 0.035. Bar Medium twins at 120,000: median 3, 61.6% and 61.7% | 3; 61.4%; 0.70; 0.034 | Met |
| Lone Rookie fresh cut, Nape Depth 4, Stress 1 (Stress 0) | 13.1% (10.0%) Chapter 5; 13.3% (10.1%) Medium, 13.2% (10.0%) Large | | 13.1%; 13.3% | Inside 8% to 14% |
| Levi-grade, Stress 2 | 47.4% Chapter 5; 47.2% Medium, 47.4% Large | | 47.4%; 47.2% | About 50% |
| Grab alone, failed dodge | 69.9% Chapter 5; Medium 69.4%, Small 70.4%, Large 69.7%, Abnormal 70.1% | | same | About 2 in 3 |
| Grab, one comrade, Stress 2 Grief 0 | 33.4% (cells 28.7% to 45.1%); Medium 33.3%, Small 33.9%, Large 33.5%, Abnormal 33.7% | | same | Near 1 in 3; every cell under 50% |
| Lone usable strike, waiting line | `lone.py`: 77.0% (Tempo 2 reference 77.4%); `run6.py lone`: Medium 77.0%, Large 76.1%, Small 72.5%, Abnormal 52.2% (hurried 57.4%, one-card hold 28.4%) | | same | Reproduces |
| Loud-rider row (drafter: 65.6%, 0.081) | | 60,000: 64.9%, 7.36%, 0.905, 0.0794. 120,000: 65.1% and 65.0%, 0.0786 and 0.0803 | 65.6%; 7.4%; 0.91; 0.081 | Reproduces |
| Four strikers on the Abnormal (Chapter 6: 91.4%, 0.61, 0.016) | | 60,000: 91.4%, 0.620, 0.0171. 120,000: 91.3%, 0.623, 0.0181 | same | Reproduces |
| Draw Attention row (Chapter 6: 69.1%, 5.8%, 1.06, 0.087) | | 60,000: 69.0%, 5.25%, 1.035, 0.0888 | same | Reproduces |

**Screen rows, fresh seeds.** 24,000 fights a row from seed 98101; the Abnormal's are the bar rows above.

| Titan | 2 helpers: by round 3, Critical Injuries, cards resolved per round | Screen beside the holder | Screen against helpers | Chapter 6 |
|---|---|---|---|---|
| Small | 86.1%, 0.79, 1.486 | 86.7%, 0.51, 1.093 | cards −26%, Critical Injuries −36% | −26%, −34% |
| Medium | 68.5%, 0.64, 0.835 | 66.9%, 0.42, 0.628 | −25%, −35% | −25%, −33% |
| Large | 68.3%, 1.26, 0.855 | 66.8%, 0.89, 0.646 | −24%, −30% | −23%, −24% |

- **Cards.** The rendered "23% to 26%" holds.
- **Critical Injuries.** "24% to 34%" reads one to two points tight on the Small and Medium Titans, as it did in round 2. The committed rows govern and the figure is a report, so this is no finding.

---

## Findings

### 1. Major. Chapter 6: two Squadmates who shout from Distant make the Sprinting Abnormal softer than the standard Medium Titan, failing its not-trivial floor by 42 standard errors

**Location:**

- **Chapter 6:**
  - section 6.5: the rendered ladder (rung 2 `loudest-or-brightest` above `current-holder`); the GM bullets *Then noise* ("outranks everyone below, wherever they are") and *Riders*; the design note *Why a blade at its Nape comes before noise*;
  - section 6.6: the *Riders* bullet ("they neither draw it nor screen it"), the *Draw Attention* and *A loud rider* bullets, and the bar, which has no loud-Squadmate row;
  - `data/titans/tuning.yaml`: `abnormals.rule` ("a rider Squadmate ... has no twin of its own"), and `simulator_cases` ("A soldier who takes Draw Attention from Distant every turn");
  - `data/titans/index.yaml` `reads_as` ("A rider who stays at Distant draws it as the nearest, or by taking Draw Attention while no blade is at its Nape and no one is On Body").
- **Chapter 5:** `data/engagement/attention.yaml` `draw_attention` (unrolled; no Position requirement); section 5.6 *Draw Attention*.
- **Chapter 2:** `data/character/squadmates.yaml` `action_list` (every Catalog action a player character can take) and `directing` (the players direct a Squadmate).
- **Decisions:** 4b-1, *The stance closes*. It measured a player character who replaces a cutter, and that rider beside 2 helpers, but no Squadmate who shouts.

**Problem:**

1. **What 4b-1 closed, and what it left.**
   - **Closed.** A striker who falls short is never passed over (0.0 cards in every row).
   - **Left.** While no one is hooked into the Abnormal, the loudest flag outranks its quarry and the nearest soldier, from any Position.
   - **What reaches a mounted soldier at Distant.**
     - Run Past and Veer deal Stress at Severity 1.
     - Trample deals a leg Critical Injury that cannot be lethal, at Severity 2, dodged with the horse.
     - Every other entry falls back to a Thrash whose knock-loose does nothing to a soldier who is neither airborne nor On Body nor at Blind Spot.
   - **The cost of shouting.** Draw Attention is unrolled, so the shouting itself risks nothing.
2. **Why the Squadmate form is the one that matters.**
   - **The player-character form costs a cutter**, and batch 4b measured it losing.
   - **The Squadmate form costs no soldier.** ADR-0014's reference Squad is 4 player characters plus 2 Squadmates. A Squadmate may take any Catalog action, and the players direct it.
   - **So it adds to the full Squad for free.** Two Squadmates who stay in the saddle at Distant and shout on every turn draw 1.83 of the Abnormal's cards a fight, away from the cutters at In Reach.
3. **Measured** (*Check 2*, 120,000 fights a row, both orders).
   - **Against the standard Medium Titan, same Squad.** The Abnormal deals fewer Critical Injuries (0.534 and 0.533 against 0.694 and 0.695). It also deals fewer deaths (0.0195 and 0.0191 against 0.0252 and 0.0254, 8.1 and 8.9 standard errors), and it dies sooner (76.5% against 61.8% by round 3).
   - **Against its own helpers row.** Every measure but pace is better for the Squad:
     - Critical Injuries 0.53 against 0.79;
     - Grabs 0.15 against 0.29;
     - no kill 1.7% against 4.1%;
     - deaths 0.0195 against 0.0215 (2.8 standard errors) and 0.0191 against 0.0206 (2.1).
     - Pace is 76.5% against 76.9% by round 3.
   - **The bar.** "In every row, Critical Injuries per fight are at least those of the standard Medium Titan's twin" fails by 42.5 and 43.2 standard errors, and against the Medium reference row's 0.70 it fails as well.
4. **Only the Abnormal.** On the standard tables loudest is the fourth rung, below In Reach. The same Squadmates draw 0.11 to 0.17 cards a fight there and do worse than helpers.
5. **What the chapter says instead.** Section 6.6's *Riders* bullet says mounted Squadmates at Distant "neither draw it nor screen it". Section 6.5 says a rider draws it "by taking Draw Attention while no one is hooked into it", but nowhere says what that does to the fight. The design note's runner "pays no heed to the soldiers in its reach"; with two riders shouting on the flank it pays heed to nothing else.
6. **Why Major and not Critical.**
   - **No rule breaks.** ADR-0010's promise holds, every state resolves, and no ruling is needed.
   - **No target moves.** An Abnormal is held against a reported bar, not an ADR-0014 target.
   - **But it is significant.** It is a balance and fidelity problem in an obvious legal play, and it is the part of Codex round 2's Major 1 ("a remote noise source can steer it continuously") that 4b-1 did not measure.

**Scenario:** the interim setup table gives the Sprinting Abnormal. The Squad is four player characters (Ilse and Kurt cut legs, Mila and Jonas strike) and the Squadmates Hanne and Otto, on no Wing.

1. **The order.** The players direct Hanne and Otto to stay mounted at Distant and take Draw Attention every turn.
2. **Round 1.** Hanne (card 2) shouts before the Titan's card 8. On card 8 no one is hooked, and Hanne holds the loudest flag. Otto shouts on card 11 and Kurt reaches In Reach on card 14, both after the card.
3. **The card.** The Next Behavior is Grab. Hanne is at Distant, so it falls back to Thrash, and its knock-loose does nothing to a rider in the saddle.
4. **Round 2.** Ilse and Kurt cut the legs from In Reach with no card on them. Mila falls short at the Nape and draws the next card at Blind Spot, as ADR-0010 promises.
5. **The rest of the fight.** Every card not on a hooked striker goes to a shouting Squadmate. The Squad takes 0.53 Critical Injuries a fight. The standard Medium Titan, fought by the same six the same way, would deal 0.69.

**Fix options:**

1. **Loudest met only away from Distant** (Codex round 2's test, now compatible with 4b-1's first rung).
   - **Measured** (`fixloud_r3.py`, 60,000 fights, patched on every ladder):
     - the loud-Squadmate row gives 70.1%, 7.6% with no kill, 0.86 Critical Injuries, and 0.065 deaths, the silent-rider row's 0.85 and 0.064;
     - the loud cutter row does not move (69.1%, 1.03, 0.088);
     - the standard Medium Titan's loud-Squadmate row does not move (0.70, 0.025).
   - **Cost.** The bar's loud player-character row becomes a wasted soldier, like the parked rider: 59.2%, 16.4% with no kill, 1.38, and 0.180. That is past the Large reference's 13.1% and 0.163, so the bar must read it as it reads the parked rider (against the standard Medium Titan with the same Squad) or drop it.
2. **Draw Attention needs a Position other than Distant** (`attention.yaml` `draw_attention` and the Catalog row).
   - **Effect.** The loudest flag is the same as under option 1, with no change to the closed `tests` list.
   - **What goes.** The loud-rider rows stop being a legal policy and leave the bar.
   - **The standard ladders.** Nearly nothing moves there: loud Squadmates draw 0.11 cards a fight on the Medium Titan.
3. **Keep the rules and bind the row.**
   - **Report.** Add the loud-Squadmate row to the bar in both orders and to `simulator_cases`.
   - **Log.** Record its failure in OQ-103 as an accepted cost.
   - **Rewrite.** Section 6.6's "holds every part of its bar in every row" and the *Riders* bullet.
   - **Measured and not recommended:** moving current-holder above loudest (`fixorder_r3.py`).
     - **What it fixes.** It lifts the loud-Squadmate row to 0.75 Critical Injuries and 0.053 deaths.
     - **What it breaks.** It fails the winnable limit in the loud-rider row (15.0% with no kill) and in the loud cutter row (13.9%, 1.40, 0.134) against the Large reference's 13.1%.

### 2. Minor. Chapter 6: the loud rider is said to do "worse than the baseline on every measure", but it leaves fewer fights with no kill and deals the same deaths

**Location:** section 6.5, the design note *Why a blade at its Nape comes before noise* ("the Squad does worse than the baseline on every measure, 65.6%, 7.4%, 0.91, and 0.081", against the reference's 69.1%, 7.6%, 0.86, 0.079); decisions 4b-1, *The stance closes* ("does worse than the baseline on every measure").

**Problem:**
- **No kill.** 7.4% against 7.6% is better for the Squad. At 120,000 fights on fresh seeds it is 7.30% and 7.37% against 7.56% and 7.57%, about 2.4 standard errors better.
- **Deaths.** They are equal within sampling: 0.0786 against 0.0772 and 0.0803 against 0.0789, +0.8 standard errors each.
- **What does hold.** The stance loses on pace and on Critical Injuries, and section 6.6's "buys nothing" is accurate. "Every measure" is not.

**Scenario:** a decider reading OQ-112 looks for any Distant stance that improves a measure, reads "worse on every measure", and skips the no-kill column.

**Fix options:**

1. Read "slower and costlier in Critical Injuries (65.6% by round 3, 0.91), with the same deaths and no more fights with no kill within sampling".

### 3. Minor. Chapter 6: the bar's twin rules give the loud-rider row two twins, and under one of them its not-trivial floor has no margin

**Location:**
- **`data/titans/tuning.yaml` `abnormals.rule`**, which has two sentences. One: "A row that adds Draw Attention, a rider Squadmate, a loud rider, or another ladder has no twin of its own". The other: "A row that names the player characters' roles, such as four strikers and no cutters, is read against the standard Titans' rows with the same roles".
- **Chapter 6:** section 6.5's bar note ("rows with the same support, or their reference rows"); section 6.6's bar note *Not trivial* ("by 17 standard errors or more"); `verdicts.sprinting_abnormal` ("0.91 and 0.90 Critical Injuries against 0.70").
- **Probes:** `run6.py` `no_twin`, which gives the loudrider role precedence in code only; `cases6.json`, which holds a standard Medium row with exactly those roles.

**Problem:**
- **The overlap.** The loud-rider row names its roles, `[loudrider, cutter, striker, striker]`, and a standard Medium row with those roles exists, so both sentences apply.
- **Under the roles sentence** (`mdloud_r3.py`, 120,000 fights, both orders), the twin deals 0.914 Critical Injuries, a median kill in round 4, and 0.075 and 0.077 deaths.
  - The Abnormal's 0.904 and 0.908 then sit below it by 1.87 and 1.15 standard errors. That is inside the tolerance but at its edge, one seed from a second-seed re-run.
  - The pre-4b loud-rider row (0.77 and 0.79) fails outright.
- **Under the no-twin sentence**, the same row clears the Medium reference by about 40 standard errors.
- **Where the choice lives.** The file states both readings, and only the probe's code chooses between them.

**Scenario:** the Phase 1 simulator author ports the bar from `tuning.yaml`, not from `run6.py`. They read the roles sentence and set the loud-rider row against the standard Medium loud-rider row. On one seed the floor prints +2.1, the row goes to a second seed, and the chapter's "17 standard errors or more" no longer describes it.

**Fix options:**

1. **State the precedence:** "A row that adds Draw Attention, a rider Squadmate, a loud rider, or another ladder has no twin of its own, even when it names the player characters' roles."
2. **Or read such rows against the same-roles rows**, and say in section 6.6 that the loud rider's floor sits at its twin's rate.

### 4. Minor. Chapter 6: two report lags, the reference Titan's four-striker median and the `ladders` header comment

**Location:**
- **Section 6.6** *Four strikers and no cutters*: the rendered row "Chapter 5's reference Medium Titan | 4 strikers, no cutters | 2 | 78.9%", and the note *Medians on the boundary*, which names only the standard Medium and Large Titans. Against it, Chapter 5 section 5.13 gives the same Squad against the same Titan median round 3 and 78.6% (`cases2.json`).
- **`data/titans/index.yaml`**, the comment above `ladders`: "rungs from its closed tests list, highest first, ending with nearest".

**Problem:**
- **The median.** The two chapters print opposite medians for one row. Chapter 5 explains its own boundary (78.4% and round 2 at 60,000 fights), but Chapter 6's boundary note does not cover this row.
- **The comment.** It still states the ladder format before 4b-1. The rule it describes now begins with hooked-into-its-body (`abnormal_ladder_format.rules`, `titans.py`).

**Scenario:** a reader checks the four-striker row across the two chapters and finds round 3 in one and round 2 in the other, with no sentence in Chapter 6 saying why.

**Fix options:**

1. Add "Chapter 5's reference Titan is round 2 here and round 3 in section 5.13's 12,000-fight row" to *Medians on the boundary*.
2. The comment reads "rungs from its closed tests list, highest first, beginning with hooked-into-its-body and ending with nearest".

### 5. Minor. Chapter 5: "a Nape striker who falls short draws the Titan's next behavior" is written for every striker, but the procedure gives it to one of several

**Location:**
- **ADR-0010**, the batch 4b paragraph ("a Nape striker who falls short draws the Titan's next behavior on every ladder").
- **Chapter 5:** `attention.yaml` `abnormal_ladder_format.rules` and `evaluation.struck-first` ("so a striker who falls short draws the Titan's next behavior"); section 5.6 *Abnormal ladders*; section 5.7 *Nape strikes*.
- **Chapter 6:** section 6.5's first GM bullet; `index.yaml` `reads_as`.

**Problem:**
- **The procedure.** `struck-first` keeps every soldier with the hooked-by-strike flag. The lower rungs, the holder, and then the lowest card pick one of them.
- **The walk.** pc2 (card 9) and pc3 (card 17) both fall short, and pc2 holds Attention. If pc3 already held it, pc3 keeps it.
- **The other striker** does not hold Attention, so they may strike again before the Titan acts.
- **Why it matters.** The four-striker stance runs on this: one striker holds Attention at Blind Spot while the others cut (OQ-112).
- **Why Minor.** The procedure is unambiguous and the tracker shows the holder. But the sentence a player reads promises the draw to each striker.

**Scenario:**
1. **Round 2.** Mila (card 9) and Jonas (card 17) both fall short, leaving five Openings.
2. **The Titan's card.** Mila holds Attention.
3. **Round 3, Jonas's turn** (card 2), before the Titan's card. His player reads section 5.7, believes Jonas drew the Titan, and holds back.
4. **The tracker** shows Mila. Jonas could have struck with her Openings.

**Fix options:**

1. **Name the case:** "draws the Titan's next behavior. When several strikers fell short, one of them does, as the ladder's lower rungs, the holder, and the lowest card pick" (ADR-0010, `attention.yaml`, sections 5.6 and 5.7).

### 6. Minor. Chapter 5: the glossary's "nothing holds it when no rung, its holder, or the cards pick one out" leaves out the moments nothing holds though a rung would pick one out

**Location:** `CONTEXT.md` Attention (4b-6). Against it:
- `attention.yaml` `changes.holder-gone`: when the holder dies, leaves, is freed, is Grabbed by another Focus Titan, or holds no Position, "held by nothing until its next evaluation";
- `grab.yaml` `release`: "held by nothing until its next card, unless a decoy freed them";
- section 5.6's change list and section 5.9's release.

**Problem:**
- **The glossary names one route to "nothing"**, an evaluation that cannot pick a soldier.
- **The rules name two more** with no evaluation at all: a holder who is gone, and a Grab's release. In both, a rung (a hooked striker, a soldier On Body) would pick someone out at once, but nothing holds until the Titan's next card.
- **Who that frees.** The difference decides who may strike the Nape in between.

**Scenario:**
1. **Round 2.** Kurt holds Attention at In Reach. Mila falls short at the Nape on card 14, after the Titan's card 3.
2. **Round 3.** Kurt's card is 1, and he dies to a Death Roll on that turn.
3. **Mila's card 4.** Read by the glossary, the hooked rung picks her out, so she holds Attention and cannot strike. Read by `holder-gone`, nothing holds, so she strikes again with Jonas's Openings before the Titan's card 11.

**Fix options:**

1. **Extend the sentence:** "nothing holds it when no rung, its holder, or the cards pick one out, as at the start of a Titan Engagement, and from when its holder is gone or freed until its next card".

---

## Previous-round findings: status

### `05-06-decisions-conformance-review-2.md` (Opus)

| Finding | Status | Evidence |
|---|---|---|
| Critical 1: the Abnormal's loudest rung outranked hooked-by-strike; a rider shouting from Distant neutralised it | **Resolved** | The first rung is hooked-into-its-body in `abnormal_ladder_format`, sections 5.6 and 5.7, `index.yaml`, ADR-0010, and `titans.py`. The walk gives the striker in every case. No card falls on a holder without the flag while a hooked striker stands, in any simulated row. The loud player character at 120,000 fights: 65.1% and 65.0% by round 3, 0.904 and 0.908, 0.0786 and 0.0803 deaths, against the baseline's 69.4%, 0.85, 0.077 to 0.079. The Squadmate form of the Distant-noise stance is new finding 1 |
| Major 2: four strikers beat the baseline on every table | **Logged** | ADR-0014's batch 4b paragraph; the rows in section 5.13 and section 6.6 *Four strikers and no cutters*; both `simulator_cases`; OQ-112 staged. The fresh four-striker bar rows hold in both orders (*Check 2*) |
| Minor 3: a flare entry mid-round | **Resolved** | `evaluation.card` and `none`, section 5.6 steps 5 and 6, `background-titans.yaml`, section 5.10, section 6.5, `reads_as` |
| Minor 4: the helpers ceiling had no margin; single-seed tolerance | **Resolved** | `abnormals.sampling`, `run6.py` `second_seeds`, the section 6.6 bar note, ADR-0014. Fresh helpers gaps +0.35 and −1.16 |
| Minor 5: the register's OQ-102 and OQ-103 bodies | **Logged** | `batch-4b-staging.md` sections 1 and 2; not counted, per the brief |
| Minor 6: "nothing holds at the start" universal; glossary had no "nothing" | **Resolved** | ADR-0010, section 5.1 step 5, section 6.6 *Support rows*, `CONTEXT.md` Attention. What the glossary sentence still omits is new Minor 6 |

### `05-06-decisions-conformance-review-2-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Major 1: a Distant rider dominates the Sprinting Abnormal with Draw Attention | **Partly resolved; still open in the Squadmate form** | A player character who gives up a cutter to shout now loses (*Check 1*, *Check 2*). Two Squadmates who shout cost no soldier, beat the helpers row, and fail the not-trivial floor by 42.5 and 43.2 standard errors (finding 1). Codex's warning that revising rider prose alone would leave the strategy standing applies to this form |
| Minor 1: "every harmful entry" overstated the Severity reduction | **Resolved** | 4-4's `Revised by batch 4b:` line and the `sprinting-abnormal.yaml` header (Trample at the control Severity). OQ-103's Decision line is staged |

---

## Appendix: models

Every script ran in the session scratchpad against a copy of `data/`, `tools/`, and the two chapters, with bytecode writing off. Each imports the committed probes unchanged unless it says otherwise.

- **Committed commands.**
  - `chapter-05`: `run_simple.py gas 200000`, `solo 100000`, and `grab 40000`; `lone.py 100000`.
  - `chapter-06`: `run6.py check` (with the selftest), `render.py check`, and `run6.py solo 100000`, `grab 40000`, and `lone 100000`.
- **`gaschain.py`.** The exact chain for a Gas Rating 3 canister on two or three d6 a round, each 1 lowering the rating, to 400 rounds in exact fractions. It imports nothing.
- **`scen3.py`.** Sets Positions, flags, holders, and cards on `fight6.Fight6` and calls the committed `evaluate` for each moment in *Check 1*, on both ladders.
- **`stance_r3.py`.**
  - **The class.** `FightR` subclasses `batch-4b/loud_b4b.FightL` only in `choose`, to count cards with a hooked candidate and cards on a holder without the flag. It uses the swapped ladder.
  - **The loud role.** The `loudrider` role (a Squadmate or a player character) stays mounted at Distant, takes Draw Attention with every action, dodges with the horse, and never rescues. The model has no Wings, so Squadmates hold their own cards.
  - **Modes.** `stance`: 19 rows at 60,000 fights, seeds 91001 onward. `bar`: six rows and their twins in both orders at 120,000, seeds 93001 onward.
- **`loudsm_r3.py`.** Two loud Squadmates beside the baseline, with the Abnormal, Medium, and Large twins (mounted) and the Abnormal's helpers row, in both orders at 120,000 fights, seeds 95001 onward.
- **`fixloud_r3.py`.** Patches `TEST_FN["loudest-or-brightest"]` in every worker to need a Position other than Distant. Four rows at 60,000 fights, seeds 97001 onward.
- **`fixorder_r3.py`.** The Abnormal's rungs `[hooked-into-its-body, current-holder, loudest-or-brightest, nearest]`. Five rows at 60,000 fights, seeds 99001 onward.
- **`screens_r3.py`.** Helpers and the beside-the-holder screen on the Small, Medium, and Large Titans at 24,000 fights (seeds 98101 onward), and the Medium baseline at 60,000 (seed 98001).
- **`mdloud_r3.py`.** The standard Medium Titan with the loud-rider Squad's roles, mounted, in both orders at 120,000 fights, seeds 99501 and 99502.
