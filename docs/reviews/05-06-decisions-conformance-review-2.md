# Chapters 5 and 6: decisions conformance review, round 2

Reviewed:

- `docs/rules/05-titan-engagement.md` and `docs/rules/06-standard-titans.md`.
- The YAML in `data/engagement/` and `data/titans/`.
- Chapter 4 section 4.12 and `data/gear/sheet-fields.yaml` (`squad_sheet_row`).
- The Attention rows of `data/character/action-catalog.yaml` (`draw-attention`, `break-attention`, `attention-shift`, `draw-attention-set`).
- The probes in `tools/probes/chapter-05/`, `chapter-06/`, and `batch-4/`. Older batch probes were read as historical snapshots only.
- Every run used a copy of the repository in the session scratchpad, so nothing in the repository was written.

Checked against:

- `docs/rules/DECISIONS-2026-09-14.md`: *Batch 4* (4-1 to 4-13) and its chapter impacts, and the `Revised by batch 4:` lines on OQ-81's batch 3 entry and on 3e-6, over batches 3 to 3e.
- ADR-0003, ADR-0010, and ADR-0014: their batch 4 `## Amended` paragraphs, with ADR-0001 to ADR-0015 behind them.
- `CONTEXT.md`: Attention, Attention Ladder, Draw Attention, Break Attention, Nape Depth, Regeneration, and Abnormal.
- `docs/rules/OPEN-QUESTIONS.md`: OQ-81, OQ-102, OQ-103, OQ-111, and the register preamble.
- The previous round: `05-06-decisions-conformance-review-1.md` and `-review-1-codex.md`.

Not read, as the brief directs: `05-06-decisions-conformance-review-2-codex.md`.

Severity:

- **Critical:** contradicts an ADR or the glossary without being logged as an open question, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**One Critical, one Major, four Minors.**

**The previous round's Critical and Major are resolved.**

- **Critical 1, the Squad sheet's quarry.**
  - The last tie-break is now `none` in `attention.yaml`, section 5.1 step 5, section 5.6 step 6, ADR-0003, ADR-0010, Chapter 6's GM bullets, and `index.yaml` `reads_as`.
  - Both fight probes set no holder in that branch.
  - No list order decides who holds Attention at any moment walked (*Check 1*).
  - On fresh seeds the Abnormal's bar holds in the cutters-first order, the strikers-first order, and a random order per fight. The ceiling gaps run from −2.20 to +1.39 standard errors, and in 27 further row runs the largest is +1.98 (*Check 2*).
- **Major 2, the parked quarry.**
  - `current-holder` is met only away from Distant.
  - A silent rider parked at Distant is now a wasted soldier. The Abnormal deals 1.37 Critical Injuries and 0.176 deaths to that Squad, against the standard Medium Titan's 0.96 and 0.081 (60,000 fights).

**The same shape reopens through the Abnormal's top rung (finding 1).**

- **The rung.** `loudest-or-brightest` sits above `hooked-into-its-body`, and Draw Attention is an unrolled action with no Position requirement.
- **The stance.** A rider who stays at Distant and takes Draw Attention every turn becomes a lightning rod the Abnormal's table barely touches.
- **The cost of the stance.** The Squad gives up a cutter and still does better on every measure than the baseline.
- **What it breaks.** Comrades who fall short at the Nape keep striking, because the loud flag outranks their hooked flag. That contradicts the sentence batch 4 wrote into ADR-0010: "a Nape striker who falls short still draws the Titan's next behavior on every ladder".
- **The smallest fix.** Swap the Abnormal's top two rungs. It holds every ceiling row on fresh seeds, and the loud rider stops paying.

**A pre-existing balance problem surfaced in the stance check (finding 2).** Four strikers and no cutters beat the baseline Squad on every table, and on Chapter 5's reference Titan:
- 10 to 22 more points killed by round 3;
- 22% to 44% fewer Critical Injuries;
- 48% to 77% fewer deaths.

Cutting legs, which the chapters, Hamstring Line, and canon all teach, is a trap under the rules as written.

**Batch 4's impacts are otherwise applied completely.**

- **Figures.** Every figure the drafter reports reproduces on the committed commands.
- **Checks.** Every table passes `titans.py`, `render.py check` finds every rendered block matching, and the horse selftest passes.
- **Text.** The Attention texts agree except where findings 1, 3, and 6 say.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 2, Character Creation (Catalog Attention rows) | 0 | 0 | 0 |
| Chapter 4, Gear (section 4.12, `sheet-fields.yaml`) | 0 | 0 | 0 |
| Chapter 5, Titan Engagement | 0 | 1 | 2 |
| Chapter 6, Standard Titans | 1 | 0 | 2 |
| **Total** | **1** | **1** | **4** |

A finding that also touches an ADR, the glossary, the decisions file, the register, or a probe is counted under the chapter it most affects, and its location names every file.

---

## Check 1: who holds Attention, at every moment walked

### The texts

| Text | Last tie-break | `current-holder` |
|---|---|---|
| ADR-0003, batch 4 paragraph | A tie the cards cannot break, at the start or at an end step, leaves Attention held by nothing until the Titan's next card | not stated |
| ADR-0010, batch 4 paragraph | The same; "a Squad of two or more starts every Titan Engagement with nothing holding the Titan's Attention" (Minor 6) | Not met by a holder at Distant, mounted or on foot |
| `CONTEXT.md` | Not stated, which is acceptable. The Attention entry reads "the one target ... at any moment" (Minor 6) | not stated |
| Catalog `break-attention`; `attention.yaml` Break Attention | "otherwise 2" in the catalog; "2 for anyone else, including while nothing holds its" Attention in `attention.yaml` | not stated |
| Chapter 5: section 5.1 step 5; section 5.6 steps 5 and 6 and *Abnormal ladders*; the OQ-81 note *Nothing holds*; `attention.yaml` (`changes.titan-becomes-focus`, `evaluation.card`, `evaluation.none`, `changes.holder-gone`) | Same wording, with `gm_choices: none` | Same wording |
| Chapter 6: introduction; section 6.5 GM bullets; design note *Why not at Distant*; section 6.6 *Support rows*; `index.yaml` `reads_as` | Same | Same |
| Chapter 4: section 4.12 and `squad_sheet_row` | One line per soldier; since batch 4 no rule reads the rows' order | — |
| `fight.py` and `fight6.py` `evaluate` | The last branch sets `t.holder = None` | `t.holder is s and s.pos != "distant"` |

### The moments, walked

Each case was driven through the committed `fight6.py` `evaluate` (`scen2.py`, appendix). It uses 4 player characters against the Sprinting Abnormal, with cards 14, 3, 9, and 17 on pc0 to pc3.

| Moment | Text that decides it | Single outcome | Probe |
|---|---|---|---|
| Fight start: every soldier at Distant, no cards dealt | `titan-becomes-focus`; `none` | Nothing holds Attention | None |
| The Titan's first card; no one has moved | nearest ties everyone; `card` | The lowest card (3) | pc1 |
| The first card; pc2 and pc3 have come In Reach | nearest narrows to them; `card` | Card 9 | pc2 |
| A tie at equal distance, with the holder in it | `holder` | The holder | pc3 |
| The same tie, with the holder gone | `card` | Card 9 | pc2 |
| An end step, a tie, no holder in it | `card` skipped; `none` | Nothing until the Titan's next card | None |
| A Background Titan entering at the background-clocks end step | `full_clock`: everyone at Distant relative to it; `none` | Nothing holds it until its first card next round | not modeled |
| A Background Titan entering mid-round after a flare | `card` by its words | The lowest card this round; the example in `card` reads otherwise (Minor 3) | not modeled |
| Holder mounted at Distant; one comrade In Reach, two at Blind Spot | `current-holder` not met; nearest | The comrade In Reach | pc1 |
| Holder mounted at Distant; everyone at Distant | nearest ties everyone; `holder` | The holder | pc0 |
| Holder at Blind Spot; a comrade In Reach | `current-holder` met | The holder (by design: `current-holder` is met at every Position but Distant) | pc0 |
| A soldier at Distant holding the loudest flag, and a striker who fell short | `loudest-or-brightest` is rung 1 | The loud soldier (finding 1) | `loud.py` |

**Every text gives one outcome, and no list order enters any of them.** The probe's `card.get(name, 99)` cannot leak the sheet's order either, since `run` deals every living soldier a distinct card.

### Stances against the Sprinting Abnormal

Each row is 60,000 fights. The Abnormal is under the rule as committed, with a mounted start and the `abnormal` Fear Roll. The same roles are run against the standard Medium Titan. Every Squad is 4 player characters.

| Stance, in sheet order | Abnormal: by round 3; Critical Injuries; deaths | Standard Medium Titan, same Squad | Better than the Abnormal baseline on every measure? |
|---|---|---|---|
| Baseline: cutter, cutter, striker, striker | 69.5%; 0.86; 0.078 | 61.8%; 0.70; 0.032 | — |
| A silent rider parked at Distant first | 59.6%; 1.37; 0.176 | 49.1%; 0.96; 0.081 | No (Major 2 is closed) |
| A rider who stays at Distant and takes Draw Attention every turn, first | 71.3%; 0.78; 0.052 (3.2% with no kill) | 49.2%; 0.92; 0.077 | **Yes** (finding 1) |
| The loud rider and 3 strikers | 83.9%; 0.65; 0.029 | 60.2%; 0.59; 0.027 | **Yes** |
| 3 strikers and 1 cutter | 83.8%; 0.71; 0.039 | 73.8%; 0.49; 0.017 | **Yes** |
| 4 strikers | 91.5%; 0.62; 0.018 | 78.0%; 0.43; 0.010 | **Yes, and on every table** (finding 2) |

Notes on the table:
- **The loud rider.** It draws 1.94 of the Abnormal's 5.46 resolved cards a fight. On 0.54 of them a comrade holding the hooked-by-strike flag stood passed over. Against the standard Medium Titan it draws 0.22 cards, because loudest is rung 4 there.
- **Mounted twins.** The Medium twins in the parked, loud, and striker rows started mounted, which moves no standard row beyond sampling (`verdicts.medium`).

## Check 2: the Abnormal's bar under the rule, re-simulated

### Fresh seeds, three orders

These runs use `quarry_b4.FightQ` with the rule, subclassed only for its order switch. It reproduces the committed `fight6.py` exactly: 24,000 helper fights on one seed give identical figures from both. Each row is 120,000 fights, and each twin is run in the same order.

The column "No kill in 12 rounds" gives the Abnormal and then the Large twin. The ceiling column gives the Abnormal's deaths, the Large twin's, and the standard-error gap. The last column is the Medium twin's deaths.

| Order | Row | Median (killed by round 2) | Critical Injuries: it; Medium twin (gap) | No kill in 12 rounds | Deaths against the Large twin | Medium twin deaths |
|---|---|---|---|---|---|---|
| Cutters first | Reference | 2 (50.2%) | 0.86; 0.70 (+33.8) | 7.8%; 13.2% | 0.0780; 0.1629 (−35.1) | 0.0327 |
| Cutters first | Helpers | 2 (58.7%) | 0.79; 0.64 (+37.4) | 4.1%; 9.5% | 0.0217; 0.0205 (**+1.39**) | |
| Cutters first | Screen | 2 | 0.52; 0.42 (+29.7) | 2.2%; 9.0% | 0.0097; 0.0099 (−0.40) | |
| Cutters first | Screen with the pair | 2 | 0.46; 0.39 (+23.3) | 1.5%; 6.8% | 0.0075; 0.0086 (−2.20) | |
| Strikers first | Reference | 2 (50.5%) | 0.85; 0.69 (+32.3) | 7.6%; 13.0% | 0.0765; 0.1640 (−36.2) | 0.0323 |
| Strikers first | Helpers | 2 | 0.79; 0.64 (+38.1) | 3.9%; 9.6% | 0.0205; 0.0209 (−0.46) | |
| Strikers first | Screen | 2 | 0.52; 0.42 (+28.1) | 2.2%; 9.0% | 0.0103; 0.0114 (−2.20) | |
| Strikers first | Screen with the pair | 2 | 0.46; 0.39 (+23.4) | 1.5%; 6.9% | 0.0079; 0.0084 (−1.18) | |
| Random per fight | Reference | 2 (50.6%) | 0.85; 0.70 (+32.5) | 7.5%; 13.0% | 0.0780; 0.1605 (−34.1) | 0.0330 |
| Random per fight | Helpers | 2 | 0.79; 0.64 (+38.2) | 4.1%; 9.3% | 0.0206; 0.0214 (−0.93) | |
| Random per fight | Screen | 2 | 0.52; 0.42 (+28.8) | 2.2%; 9.1% | 0.0100; 0.0099 (+0.20) | |
| Random per fight | Screen with the pair | 2 | 0.46; 0.38 (+25.4) | 1.5%; 7.1% | 0.0080; 0.0084 (−0.94) | |

**Every part holds in every row and every order.** The orders differ by sampling alone.

**Three more replicates** (27 row runs: helpers, screen, and the screen with the pair, in all three orders) give:

| Row | Gaps, lowest to highest | Pooled over the nine runs |
|---|---|---|
| Helpers | −1.86 to **+1.98** | 0.02064 against 0.02081 (−0.6) |
| Screen | −2.0 to +0.8 | 0.01019 against 0.01050 (−1.9) |
| Screen with the pair | −3.6 to +0.7 | 0.00797 against 0.00852 (−3.8) |

- **No run passes 2 standard errors.**
- **The helpers ceiling has no margin.** Over all twelve fresh helper runs it is 0.0207 against 0.0208, 0.5 standard errors apart. Its true rate is the Large twin's (Minor 4).

### The drafter's four questions, judged

1. **"Grab alone" failing by +2.2 and +2.8 is a real miss, not sampling, and it is not a row of the decided Abnormal.**
   - **What it is.** `abnormal_b4.py`'s `grab_only` pins Headlong Lunge at Severity 3. So it measures the lever 4-4 rejected, not the stat block in `sprinting-abnormal.yaml`.
   - **Pooled.** Seven helper runs (`quarry_b4_grab2_bar.out`'s two, `abnormal_b4.out`'s two, and three fresh ones at +0.23, +1.16, and +0.93) give 0.0217 deaths against the Large twins' 0.0206. That is +3.5 standard errors pooled, about 5% above.
   - **The screen.** Seven runs give 0.0108 against 0.0103 (+2.6), with a fresh +2.59 in the strikers-first order.
   - **Covered?** OQ-103's own 2-standard-error tolerance rejects it, and 4-4 and section 6.6 record the rejection, so the text covers it. Section 6.6 and 4-4 describe it as "at its twin's rate", when it sits above (Minor 4).
   - **Smallest fix.** No rule change; the wording in Minor 4.
2. **The reference median of round 3 at 12,000 fights against round 2 in the bar rows is the boundary, read at two sample sizes.**
   - **The boundary.** Fresh 120,000-fight runs give 50.2%, 50.5%, and 50.6% killed by round 2, and 60,000 fights give 50.2%. The median is round 2 by under a point.
   - **The bar.** The not-trivial limit (round 2 or later) and the winnable limit (round 4 or sooner) hold either way.
   - **The text.** The section 6.6 design note and `verdicts.sprinting_abnormal` both state the boundary. No finding.
3. **Without `current-holder` the Abnormal fails the ceiling by more than 2.4 on fresh seeds, so the rung still carries the bar.**
   - **Fresh runs.** Five of nine runs pass 2 standard errors: the strikers-first screen +3.20 and pair +3.77, the random screen +2.80 and pair +2.12, and the cutters-first pair +2.12.
   - **Pooled with `abnormal_b4.out`.** The five runs per row give helpers 0.0211 against 0.0201 (+2.7), the screen 0.0111 against 0.0101 (+4.5), and the screen with the pair 0.0091 against 0.0080 (+5.5).
   - **The text.** Section 6.6's "fails the ceiling narrowly" is fair for the committed seeds. No finding.
4. **The standard ladder no longer being deadlier than the Abnormal's own leaves no reasoning stale in the chapter.**
   - **The rejection.** OQ-102 rejects option (c) on fidelity ("keeps the standard Titan's turn on reach and pain, which canon's runner does not show"), not on deaths.
   - **Section 6.6.** Its note was rewritten, with 0.065 deaths against its own ladder's 0.079.
   - **What lags.** The register's (c) figures (Minor 5).

## Check 3: batch 4 applied

| Item | Where checked | Status |
|---|---|---|
| 4-1, OQ-100 | Section 6.1 cites the decision; `index.yaml` `grab_mark.decided` | Applied |
| 4-2, OQ-101 | Sections 6.1 to 6.4 cite it; `verdicts`; Thrash shares in `abnormal_b4.out` (30.9%, 41.2%, 40.9%, 33.7%) | Applied |
| 4-3, OQ-102 | `evaluation.none`; `tests.current-holder`; section 5.1 step 5; section 5.6 step 6; the OQ-81 note *Nothing holds*; Chapter 6 GM bullets *Then the one it is already running down*, *Only then whoever is nearest*, *Riders*, and *Down soldiers*; *Why not at Distant*; `reads_as`; both probes; ADR-0003; ADR-0010 | Applied (see findings 1 and 6 on ADR-0010's other sentences) |
| 4-4, OQ-103 | `sprinting-abnormal.yaml` (`grab` and `headlong-lunge` at `severity: 2`, header comment); the rendered table; section 6.6 bar, *How the fights compare*, and Grab cells (28.7% to 45.2%, alone 70.1%); `tuning.yaml` `abnormals` and `verdicts`; ADR-0014 | Applied |
| 4-5, OQ-104 | Sections 5.1 and 6.1; `engagement-setup.yaml`; setup mix 0.85 and 0.053 against 0.86 and 0.057 | Applied |
| 4-7, OQ-106 | `CONTEXT.md` Nape Depth and Regeneration | Applied |
| 4-8, OQ-107 | Section 5.5 step 7 and `resolving_a_card.effects` | Applied |
| 4-9, OQ-108 | Section 6.5 GM section; `hidden_until_read` | Applied |
| 4-10, OQ-109 | `titan-format.yaml` comment; section 6.1 | Applied |
| 4-12 | `screen_b3b.py` and `screen6_b3b.py` docstrings | Applied |
| 4-13 | Section 5.6 *Down and carried soldiers* is scoped; the OQ-81 note; `nearest_rung` column renamed, "not counted" rows, note corrected; section 6.6 note; glossary "until the end of"; OQ-111 "(History: ...)" markers; OQ-81's revision lines in batch order; `holder-gone` and the GM bullet name a quarry Grabbed by another Focus Titan | Applied |

**Stale wording.**
- **Tags.** No `PROVISIONAL:` line survives in Chapters 5 or 6. The register's `**Type:** PROVISIONAL` field is its type legend for questions raised while drafting (line 7), not a stale tag.
- **"Squad sheet" in Chapter 6.** It survives only where it names the bar's two sheet orders (section 6.5's opening, the bar's order column and notes, *How the fights compare*) and in the history sentence of *Why not at Distant*.
- **"Squad sheet" in `data/engagement/tuning.yaml`.** It names the probe's `sheet` switch as the rule before batch 4.
- **No glossary _Avoid_ term** appears in Chapter 5, Chapter 6, `attention.yaml`, `index.yaml`, or `sprinting-abnormal.yaml`.
- **The register's OQ-102 and OQ-103 bodies** lag batch 4 (Minor 5).

## Check 4: tables, pointers, and fidelity

- **Tables.**
  - `run6.py check` gives 0 problems for every Titan, with the highest kill share 0.5 in any state.
  - The horse selftest passes, and `render.py check` finds every rendered block matching the YAML.
  - Batch 4 changed only two of the Abnormal's Severities, so round 1's table-shape checks stand, and `run6.py check` passes them again on every table.
- **Severity bounds.** Every Abnormal Severity is within 1 to 4, and the header comment names every value that differs from the medium row.
- **Pointers.** `reads_as`, the GM bullets, `holder-gone`, and `candidates.never` agree on a quarry Grabbed by another Focus Titan.
- **Fidelity, 845 to 850.**
  - Severity 2 for a snatch and a lunge made at full stride is a fair reading.
  - The Abnormal stays deadlier than the Medium Titan (0.077 deaths at the reference start against 0.033), and its reach at Distant is still its signature.
  - Dropping a quarry who rides clear matches riders leading Titans away from a formation.
  - The loud rung's reach (finding 1) and the trap of cutting legs (finding 2) are the two fidelity costs found.

## Check 5: figures, re-simulated

| Figure | Committed command, this run | Independent or fresh | Chapter text | Verdict |
|---|---|---|---|---|
| Gas, two dice / three dice | median 8 / 6 (`run_simple.py gas 200000`) | Exact chain: median 8, mean 9.2502 / median 6, mean 6.3335 | 8 (9.25) / 6 (6.33) | Met |
| Medium kill, Chapter 5 reference Titan | | 60,000 fights under the rule: median round 3, 61.7% by round 3, 0.72 Critical Injuries, 0.033 deaths | 3, 62.8%, 0.71, 0.03 (committed; batch 4 re-run 62.0%, 0.73) | Met |
| Medium kill, standard Medium Titan | | 120,000 fights: median 3, 61.6%, 0.70, 0.033 | 3, 61.4%, 0.70, 0.034 | Met |
| Lone Rookie fresh cut, Nape Depth 4, Stress 1 (Stress 0) | 13.1% (10.0%), Chapter 5; 13.3% (10.1%), Chapter 6 | | 13.1% and 13.3% | Inside 8% to 14% |
| Levi-grade, Stress 2 | 47.4% (Chapter 5); 47.2% (Chapter 6) | | 47.4% and 47.2% | About 50% |
| Grab alone, failed dodge | 69.9% (Chapter 5); Medium 69.4%, Small 70.4%, Large 69.7%, Abnormal 70.1% (Chapter 6) | | same | About 2 in 3 |
| Grab, one comrade, Stress 2 Grief 0 (all six cells) | 33.4% (28.7% to 45.1%), Chapter 5; Medium 33.3% (28.7% to 44.4%), Small 33.9% (29.0% to 45.3%), Large 33.5% (28.6% to 45.0%), Abnormal 33.7% (28.7% to 45.2%) | | same | Near 1 in 3; every cell under 50% |
| Lone usable strike, waiting line: Medium / Large / Small / Abnormal | 77.0% / 76.1% / 72.5% / 52.2% (Abnormal hurried 57.4%, one-card hold 28.4%) | | same | Reproduces |
| Lone fight, Tempo 2 on the reference table: waiting / hurried / one-card hold | 77.4% / 68.1% / 49.4% | | same | Reproduces |

**Screen rows, fresh seeds.** Small, Medium, and Large are 24,000 fights a row. The Abnormal's figures are the 120,000-fight cutters-first rows above, and its cards per round are the committed rows. Each cell gives killed by round 3, Critical Injuries per fight, and Titan cards resolved per round.

| Titan | 2 helpers | Screen beside the holder | Screen against helpers | Chapter 6 |
|---|---|---|---|---|
| Small | 86.3%, 0.80, 1.485 | 86.7%, 0.51, 1.094 | cards −26%, Critical Injuries −36% | −26%, −34% |
| Medium | 67.8%, 0.64, 0.837 | 66.8%, 0.41, 0.631 | −25%, −36% | −25%, −33% |
| Large | 68.6%, 1.24, 0.854 | 65.6%, 0.92, 0.651 | −24%, −26% | −23%, −24% |
| Sprinting Abnormal | 76.9%, 0.79, (1.584) | 78.0%, 0.52, (1.210) | —, −34% | −24%, −33% |

Each row is within sampling of the rendered support table, whose "23% to 26%" for cards holds, and whose "24% to 34%" for Critical Injuries reads two points tight on these seeds (Small and Medium −36%).

---

## Findings

### 1. Critical. Chapter 6: the Sprinting Abnormal's loudest rung breaks ADR-0010's batch 4 promise that a striker who falls short draws the next behavior on every ladder, and a rider shouting from Distant lifts the Nape restriction off the Squad

**Location:**

- **ADR-0010** `## Amended`, the batch 4 paragraph's last sentence: "The legal-route promise is unchanged: a Nape striker who falls short still draws the Titan's next behavior on every ladder."
- **Chapter 6:**
  - section 6.5, the rendered ladder (rung 1 `loudest-or-brightest` above rung 2 `hooked-into-its-body`);
  - the GM bullets *Noise turns it first* and *Then what digs into it* ("A striker who falls short draws its next behavior");
  - section 6.6, the OQ-103 note *Pitch Headlong at Severity 1* ("With its ladder, a Nape striker who falls short draws its next behavior");
  - section 6.6, the note on Draw Attention ("pulls the Titan off its quarry and off a striker who has just struck");
  - `data/titans/index.yaml` `ladders.reads_as` ("so a striker who falls short draws its next behavior as ADR-0010 has it");
  - `tools/probes/chapter-06/cases6.json`: its only Draw Attention row has cutters at In Reach, and no row has a soldier who takes it from Distant.
- **Chapter 5:**
  - section 5.7 *Nape strikes* ("so a striker who falls short draws the Titan's next behavior, whatever cards come between");
  - `data/engagement/attention.yaml` `draw_attention` (no Position requirement, no cost but the action).
- **Register:** OQ-102 *Draw Attention* ("the loudest flag outranks every rung", measured only with a loud cutter at In Reach).

**Problem:**

1. **What ADR-0010 promises.** A Nape striker who falls short draws the Titan's next behavior on every ladder. That is how ADR-0010's one hard restriction does its work: the striker then holds Attention and cannot cut again until the Titan has acted.
2. **What the Abnormal's ladder does.** Its highest rung is the loudest flag, so a soldier holding it outranks a soldier holding the hooked-by-strike flag. Draw Attention sets that flag with an unrolled action, from any Position, on every turn. So on this ladder, a striker who falls short draws nothing while a comrade is loud.
3. **What reaches a loud rider at Distant.** Decision batch 4 (4-3, *The parked quarry*) records that a quarry mounted at Distant draws only Run Past, Veer, Trample, and Thrash's knock-loose, "none of which harm a mounted soldier at Distant". `current-holder` does not matter here, because the loud rung is above it. Batch 4 closed the silent version of this stance, not the loud one.
4. **Measured** (`loud.py`; 60,000 fights a row; mounted start; the loud rider listed first; the rest play the baseline):

   | Row | By round 3 | No kill in 12 rounds | Critical Injuries per fight | Deaths per fight | Abnormal cards on the loud rider | Cards on the loud rider while a striker's hooked flag stood |
   |---|---|---|---|---|---|---|
   | Abnormal, loud rider, cutter, striker, striker | **71.3%** | **3.2%** | **0.78 ± 0.005** | **0.052 ± 0.001** | 1.94 of 5.46 | 0.54 |
   | Abnormal, the baseline (cutter, cutter, striker, striker) | 69.5% | 7.8% | 0.86 | 0.078 | — | — |
   | Standard Medium Titan, the same loud-rider Squad | 49.2% | 12.4% | 0.92 | 0.077 | 0.22 | 0.00 |
   | Abnormal, loud rider and 2 helpers | 80.8% | 0.7% | 0.74 | 0.013 | 1.44 | 0.40 |
   | Abnormal, 2 helpers, baseline (fresh bar row) | 76.9% | 4.1% | 0.79 | 0.021 | — | — |

   Giving up a cutter to shout from Distant makes the Abnormal fight better on every measure: 9% fewer Critical Injuries, a third fewer deaths, a faster kill, and half the no-kill fights. The same Squad against the standard Medium Titan is much worse off, because loudest is that ladder's fourth rung.
5. **What it is not.**
   - It is not a bar failure. A row that adds Draw Attention is read against its twins' reference rows, and 0.78 Critical Injuries clear the Medium Titan's 0.70.
   - It is not the best stance. Four strikers do better still (finding 2).
   - The Critical rests on the contradiction, and on what it does to ADR-0010's restriction in play.
6. **Why Critical.**
   - Batch 4 wrote "on every ladder" into ADR-0010 while this ladder stood, and no open question logs the exception.
   - The chapter's own Draw Attention note documents the case. Two more sentences (section 6.6 and `reads_as`) repeat the promise unscoped, and `reads_as` attributes it to ADR-0010.
   - In play the loud rung lifts ADR-0010's one hard restriction off every striker for as long as a rider keeps shouting. ADR-0010 considered and rejected that outcome ("the most capable soldier would bait, disable, and kill alone").

**Scenario:** the setup table gives the Sprinting Abnormal. The Squad has read its ladder in an earlier fight.

1. **The start.** Private Tomas Graf stays in the saddle at Distant and takes Draw Attention on each of his turns.
2. **Round 2.** Mila flies to Blind Spot and falls short at the Nape, and her hooked-by-strike flag is set.
3. **The Abnormal's next card.** Tomas holds the loudest flag, the top rung, so the card resolves against him. Pitch Headlong needs On Body or Blind Spot, and its Thrash fallback knocks loose a soldier who is mounted at Distant, which does nothing.
4. **Mila's next turn.** She does not hold Attention, so she strikes again with the Openings her first strike made.
5. **The rules table.** ADR-0010 says Mila drew that card. The ladder says Tomas did. The Abnormal is killed by round 3 in 71% of such fights, with a third fewer deaths than the Squad that fights it as the chapter models.

**Fix options:**

1. **Swap the top two rungs** (the smallest fix; closed tests list, no new test). The ladder becomes `[hooked-into-its-body, loudest-or-brightest, current-holder, nearest]`. Measured with `fixopts.py` against the fresh Large twins above:
   - **The loud rider stops paying.** It gives 64.8% by round 3, 7.5% with no kill, 0.91 Critical Injuries, and 0.081 deaths, with no card on the rider while a hooked flag stands.
   - **The reference start.** It gives 69.6%, 0.84, and 0.076 (60,000 fights).
   - **The ceiling holds.** At 120,000 fights: cutters first and strikers first, helpers 0.0212 and 0.0206 (+0.8 and −0.4), the screen 0.0096 and 0.0103 (−0.6 and −2.2), the screen with the pair 0.0084 and 0.0077 (−0.4 and −1.7).
   - **Canon.** It reads as canon's runner, which turns on a blade at its Nape before it turns toward noise.
   - **What changes.** Section 6.5's bullets, `reads_as`, the Draw Attention row and note, and every Abnormal figure re-run.
2. **Scope the promise and log the stance.**
   - ADR-0010's sentence reads "on every ladder on which no rung above hooked-into-its-body is met".
   - Section 6.5, section 6.6, `reads_as`, and section 5.7 say that noise outranks a fallen-short striker on the Sprinting Abnormal.
   - OQ-102 and OQ-103 record the loud-rider row as an accepted cost, and section 6.6 reports it.
   - This leaves the stance as a Major.
3. **A loud rung met only away from Distant.** This needs a new `tests` row and a decision.
   - **Measured, the rider is wasted:** 1.37 Critical Injuries and 0.174 deaths.
   - **The ceiling rows hold:** helpers +0.5 and −0.9; the screen 0.0 and −2.8; the screen with the pair −1.6 and −2.1.
   - **What it leaves.** A loud soldier at In Reach still outranks a fallen-short striker, so option 2's scoping is still needed.

### 2. Major. Chapter 5: four strikers and no cutters beat the baseline Squad on every table, so cutting legs is a trap

**Location:**

- **Chapter 5:**
  - section 5.13 *A prepared Squad kills a Medium Titan in about 3 rounds* (the baseline roles);
  - `data/engagement/tuning.yaml` `prepared_squad_kill` (policies and squads: no all-striker row) and `simulator_cases`;
  - section 5.7 (grounded dice) and section 5.12 (Squad Tactics, Hamstring Line).
- **Chapter 6:**
  - section 6.1, *Reading a Behavior Table* (Thrash's share, "most often a Nape striker who fell short at Blind Spot"), which 4-2 accepts as a report;
  - section 6.5 *Cut one leg*;
  - section 6.6, *A prepared Squad kills the standard Medium Titan in about 3 rounds*, *Support rows*, and *How the fights compare*.
- **ADR-0014:** the list of sensitivity rows beside each target.

**Problem:**

1. **Measured** (`extra2.py`; 60,000 fights a row; the committed rules; Chapter 5's reference Titan on `fight.py` and Chapter 6's tables on `fight6.py`; the Abnormal starts mounted):

   | Titan | Baseline: by round 3; no kill; Critical Injuries; deaths | 4 strikers (eager) | Change |
   |---|---|---|---|
   | Chapter 5 reference | 61.7%; 5.2%; 0.72; 0.033 | 78.5%; 0.6%; 0.43; 0.008 (median round 2) | +17 points; −40%; −76% |
   | Standard Small | 80.8%; 1.6%; 0.84; 0.043 | 90.4%; 0.4%; 0.65; 0.020 | +10; −22%; −53% |
   | Standard Medium | 61.8%; 5.0%; 0.70; 0.032 | 78.0%; 0.7%; 0.43; 0.010 | +16; −39%; −68% |
   | Standard Large | 61.4%; 13.2%; 1.41; 0.163 | 78.2%; 2.5%; 0.80; 0.085 | +17; −44%; −48% |
   | Sprinting Abnormal | 69.5%; 7.8%; 0.86; 0.078 | 91.5%; 0.4%; 0.62; 0.018 | +22; −28%; −77% |

   Three strikers and one cutter also beat the baseline on the Abnormal and the Medium Titan (*Check 1*).
2. **Why.** The strikers hold Attention in turn at Blind Spot. There most entries' Position requirements fail and fall back to Thrash's knock-loose, as section 6.1 records and 4-2 accepts. The cutters stand In Reach, where every Grab, Bite, Trample, and Lunge applies. Two more Nape attempts a round, and the Openings a short strike leaves, are worth more than the grounded dice the cutters buy.
3. **What it costs.**
   - Section 6.5 tells a Squad to cut one leg (*Cut one leg*), as canon's soldiers bring Titans down, and Hamstring Line and the grounded dice reward it. A table that tries both finds the leg cutters take the Grabs and kill no sooner.
   - ADR-0014's first target is met under a policy a Squad will learn to leave: under four strikers, Chapter 5's reference Titan dies by a median of round 2.
   - No row reports the stance, so a decider reading section 5.13 cannot see it.
4. **Why Major and not Critical.** The target is defined under the baseline policy (ADR-0014, as amended in batch 3), and no rule is broken or left to a ruling. It is a significant balance and fidelity problem, and batch 4 did not cause it.

**Scenario:** a Squad has fought two standard Medium Titans.

1. **The first fight.** Ilse and Kurt cut legs from In Reach and take both Grabs.
2. **The lesson.** For the third fight all four fly straight to Blind Spot. Whoever falls short holds Attention and eats a Thrash that knocks them loose, and the other three cut.
3. **The result.** The Titan dies in round 2 or 3, and the Squad takes 0.43 Critical Injuries a fight instead of 0.70. No one cuts a leg again.

**Fix options:**

1. **Report it first.** Add a 4-striker row beside the prepared-Squad target in section 5.13 and section 6.6, with the Squad Tactic and screen rows. Add it to `simulator_cases`. Decide whether the kill target is read under the baseline or under the best measured policy.
2. **Give the Nape striker's Position teeth on every table.** For example, make Thrash, or the control entry a fallback lands on, meet Blind Spot with a knock-loose from On Body's height. Or point a Blind Spot holder's fallback at an entry that can harm them. Each variant re-runs the kill-share constraint, the Jam test, the move-up shares, and the lone band, since 4-2 reads Thrash's share as a consequence of the fallback rule.
3. **Make the leg worth its price.** For example, raise the grounded dice, or let a standing Titan's Nape resist more than a grounded one's. Then re-run the lone band and the Levi-grade figure, since both read Nape Depth.

### 3. Minor. Chapter 5: the `card` step's example makes every Background Titan's entry an end-step evaluation, but a flare brings one in mid-round

**Location:**

- **Chapter 5:**
  - `data/engagement/attention.yaml` `evaluation.card` ("or if the evaluation is made at an end step, as when a Background Titan enters (data/engagement/background-titans.yaml, full_clock)"), and `evaluation.none` ("Only the start of a Titan Engagement and an end step reach this step");
  - section 5.6 evaluation steps 5 and 6;
  - `data/engagement/background-titans.yaml` `ticks.flare` ("A clock it fills resolves then (full_clock)");
  - section 5.10 *Clocks* and *Entering*.
- **Chapter 6:** section 6.5, GM bullet *Only then whoever is nearest*.

**Problem:**

- **When a flare brings a Titan in.** A flare spent on Break Attention fills every Background clock as soon as that Break Attention resolves, and a clock it fills resolves then. So a Background Titan can become a Focus Titan in the middle of a round, and its ladder is evaluated then.
- **Two readings.**
  - **By its words, the `card` step applies.** The evaluation is not made at an end step, and the round's cards are dealt, so the soldier with the lowest card holds the new Titan's Attention.
  - **Read as a rule, the example skips `card`.** "As when a Background Titan enters" reads as a rule for every entry, which reaches `none`, so nothing holds it.
- **What differs between them.** Until the new Titan's first card next round, one soldier needs 1 or 2 successes to take Break Attention against it, and who is barred from its Nape changes.

**Scenario:** round 3.

1. **The flare.** Jonas, on card 4, spends a flare on Break Attention against Titan A, and it fills the Large Background Titan's clock.
2. **The entry.** Titan B enters with every soldier at Distant relative to it. Ilse holds card 2.
3. **The two readings.** One GM reads `card` and records "Att: Ilse" on B's row. Another reads the example and records nothing.
4. **Ilse's next turn.** Before B's first card, she takes Break Attention against B with a flare, needing 1 on one table and 2 on the other.

**Fix options:**

1. **Name the moment.** `card` and step 5 read "at an end step, as when a Background Titan enters at the background-clocks end step. A Titan that enters mid-round, after a flare, is evaluated with that round's cards."
2. **Or send every entry to `none`.** Say a Titan that becomes a Focus Titan evaluates with no cards, whenever it enters. Then rewrite `none`'s "only the start and an end step" claim to include it.

### 4. Minor. Chapter 6: the bar notes read the rejected Grab-alone variant as "at its twin's rate" and do not say that the decided helpers ceiling has no margin

**Location:**

- **Chapter 6:** section 6.6, the OQ-103 design note (*Ceiling*, *The Grab alone at Severity 2*); `data/titans/tuning.yaml` `abnormals.sampling` and `verdicts.sprinting_abnormal`.
- **Decisions:** 4-4, *Why both kill entries* ("its true rate sits at the twin's and a fresh seed fails a row one time in five").
- **Register:** OQ-103 *Decision* ("the Grab alone at Severity 2 fails one seed in the pair row (+2.1)").

**Problem:**

1. **The Grab alone sits above its twin, not at it.**
   - **Helpers.** Pooled over seven runs it is 0.0217 deaths against 0.0206, +3.5 standard errors.
   - **The screen.** Pooled it is 0.0108 against 0.0103, +2.6.
   - **Consequence.** Rejecting it was right, but for a stronger reason than the notes give.
2. **The decided Abnormal's helpers row sits at its twin.**
   - **Pooled.** Twelve fresh runs give 0.0207 against 0.0208, and no run passes 2 standard errors (highest +1.98).
   - **Chance of a false failure.** If its true rate is its twin's, each order's run has a 2.3% chance of printing a helpers failure by sampling alone, so about one two-order `run6.py bar` run in 22 does.
   - **The margin in other rows.** The screen and the screen with the pair are below the twin (pooled −1.9 and −3.8).
3. **What the notes say.** They say the Abnormal "holds every part of its bar in every row". That is true, but the notes do not say that one row has no margin. A re-run of `run6.py bar` after any probe or table change can flip the verdict on the next seed.

**Scenario:** the Phase 1 simulator author ports `run6.py bar` and runs it once on new seeds. Helpers in the strikers-first order prints +2.1. Reading the bar's single-run tolerance, they mark the Sprinting Abnormal as failing and open a question to change its values, though nothing changed.

**Fix options:**

1. **State the reading.**
   - Section 6.6 and `verdicts`: "the helpers ceiling sits at the Large twin's rate (pooled over the committed and batch 4 runs), so a single run past 2 standard errors there is sampling".
   - 4-4's and section 6.6's "at its twin's rate" for the Grab alone reads "above its twin's rate (pooled +3.5 standard errors with helpers)".
2. **Or read the ceiling on pooled seeds.** Let `abnormals.sampling` read a row that passes 2 standard errors at 120,000 fights again on a second seed, and fail it only on the pooled figure.

### 5. Minor. Chapter 6: the register's OQ-102 and OQ-103 bodies still describe the Abnormal before batch 4, with no history marker

**Location:** `docs/rules/OPEN-QUESTIONS.md`.

- **OQ-102:**
  - *Canon for (b)*: "stays its quarry, wherever they stand, at Distant or Down";
  - *How often it runs its quarry down*: 1.45 times a fight, and 0.76 cards against a holder at Distant;
  - *Figures*: (b) 74.6% and 0.071 deaths; (c) 1.13 and 0.124;
  - *Riders* 75.3% and 0.057; *Riders after decision batch 3b* 1.181 cards a round against 1.547 with helpers; *Draw Attention* 75.7% and 0.088; *The lone fight* 52.0% and 20.8% Down.
- **OQ-103:**
  - option (a) "Severity 1, 2, and 3 by tier";
  - *Figures under (a)*: reference 74.6% and 0.071; the bar 0.0198 against 0.0196; the template Squad 51.1%;
  - *The setup mix* 0.84 and 0.054 against 0.85 and 0.057.

**Problem:**

- **Lag without markers.** Each *Decision* line states the batch 4 rule, but the bodies read as current. The chapter and `verdicts` now give different numbers, for example 69.1% and 0.079 at the reference start, 0.0207 against 0.0200 with helpers, and a setup mix of 0.85 and 0.053 against 0.86 and 0.057.
- **Precedent.** Batch 4 (4-13) gave OQ-111's lagging paragraphs "(History: ...)" markers for the same kind of lag, and these two entries did not get them.

**Scenario:** a Mission Brief author checks OQ-102's *Canon for (b)* to learn whether a rider can lead the Abnormal off. It reads that the quarry stays its quarry "at Distant", which batch 4 removed.

**Fix options:**

1. **Mark the history.** Add "(History: before decision batch 4; see the Decision line and Chapter 6, section 6.6)" after OQ-102's *Canon for (b)*, *How often*, *Figures*, *Riders*, *Draw Attention*, and *The lone fight*, and after OQ-103's option (a) Severities and *Figures under (a)*.

### 6. Minor. Chapter 5: "a Squad of two or more starts with nothing holding the Titan's Attention" is written as universal, and the glossary's Attention entry has no "nothing"

**Location:**

- **ADR-0010,** batch 4 paragraph: "so a Squad of two or more starts every Titan Engagement with nothing holding the Titan's Attention".
- **Chapter 5:** section 5.1 step 5 ("no rung picks out one of them"). Against these, `attention.yaml` `changes.titan-becomes-focus` says "unless one rung or the holder step picks out one soldier".
- **Chapter 6:** section 6.6 *Support rows* ("every fight of two or more soldiers starts with nothing holding it").
- **`CONTEXT.md` Attention:** "The one target a Focus Titan is fixed on at any moment".

**Problem:**

- **Only true of the Phase 1 ladders.** The universal sentences hold for the standard ladder and the Sprinting Abnormal's. The closed `tests` list also holds `mounted`, `most-harmed`, and `down`, which a later Abnormal ladder may name and which can pick out one soldier at Distant before any card is dealt. `attention.yaml` states the conditional correctly; the ADR and the two chapter sentences drop it.
- **The glossary.** Attention can be held by a decoy or by nothing, and since batch 4 nothing holds it at the start of nearly every Titan Engagement. The glossary still says one target at any moment.

**Scenario:** a later chapter adds an Abnormal whose ladder is `[most-harmed, nearest]`. Kurt starts a Titan Engagement carrying an untreated Critical Injury from an earlier Leg. Reading ADR-0010, the GM records nothing holding its Attention. The procedure gives Kurt, who then cannot strike its Nape in round 1.

**Fix options:**

1. **Copy `attention.yaml`'s condition.** ADR-0010, section 5.1 step 5, and section 6.6 read "unless a rung picks out one soldier, as none of the Phase 1 ladders' rungs does at the start".
2. **The glossary.** The Attention entry reads "The one soldier or decoy a Focus Titan is fixed on, or nothing ...".

---

## Previous-round findings: status

### `05-06-decisions-conformance-review-1.md` (Opus)

| Finding | Status | Evidence |
|---|---|---|
| Critical 1: the Abnormal's quarry was the first-listed soldier; the bar held only under the probe's order | **Resolved** | 4-3's `none` step in `attention.yaml`, section 5.6, ADR-0003, ADR-0010, Chapter 6, and both probes. *Check 1* gives one outcome at fight start, the first card, a tie, an end step, and a parked holder. On fresh seeds the bar holds in all three orders (ceiling −2.20 to +1.39; 27 more runs, highest +1.98). |
| Major 2: a quarry parked mounted at Distant | **Resolved** | `current-holder` needs a Position other than Distant. The silent parked rider gives 1.37 Critical Injuries and 0.176 deaths against the Medium Titan's 0.96 and 0.081. The loud version of the stance is new finding 1. |
| Minor 3: the Down-soldier promise unscoped | **Resolved** | Section 5.6 "On the standard ladder, ..."; the OQ-81 note *Ties* and *Down soldiers* |
| Minor 4: the `nearest_rung` counter | **Resolved** | Column renamed, `as_written` "not counted", note and section 6.6 corrected |
| Minor 5: glossary "until the end of" | **Resolved** | `CONTEXT.md` Attention Ladder |
| Minor 6: OQ-111 and OQ-81 lag | **Resolved** | OQ-111 "(History: revised by batch 3e ...)" on both paragraphs; OQ-81's Decision line lists 3b, 3c (the Feint), 3e (the flag), then batch 4. The same lag in OQ-102 and OQ-103: new Minor 5. |
| Minor 7: a quarry Grabbed by another Focus Titan | **Resolved** | `holder-gone`, section 5.6's change list, the GM bullet, and `reads_as` |

### `05-06-decisions-conformance-review-1-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Minor 1: `screen_b3b.py` claimed to reproduce its output | **Resolved** | The docstring calls `.out` a historical snapshot, names the live imports and `BASE_PIN`'s reach, and points to `tuning.yaml` `decoys` |
| Minor 2: `screen6_b3b.py` claimed the same | **Resolved** | Same, pointing to `data/titans/tuning.yaml` and the section 6.6 support rows |

---

## Appendix: models

Every script below ran in the session scratchpad against a copy of the repository, with bytecode writing off. None is committed, and each imports the committed probes unchanged unless it says otherwise.

- **Committed commands.** From the copy:
  - `chapter-05`: `run_simple.py gas 200000`, `solo 100000`, and `grab 40000`; `lone.py 100000`.
  - `chapter-06`: `run6.py check` (with the selftest), `render.py check`, and `run6.py solo 100000`, `grab 40000`, and `lone 100000`.
- **Exact gas chain.** A Gas Rating 3 canister on two or three d6 a round, each 1 lowering the rating, run to 200 rounds. It imports nothing.
- **`scen2.py`.** Sets Positions, holders, and cards on `fight6.Fight6` and calls the committed `evaluate`, printing the holder for each moment in *Check 1*. It also lists the soldiers `build_squad` creates.
- **`sims.py`.** Uses `batch-4/quarry_b4.FightQ` (the committed `fight6.py`, subclassed only for roles and the order switch) under the rule: `tie_break` "none", `quarry` "in_reach", and the YAML's Severities.
  - `validate`: identical to `fight6.run_many` on one seed.
  - `bar`: every tight row and the reference, Abnormal against both twins, in three orders, at 120,000 fights, seeds 71001 onward.
  - `rep`: three replicates of the three tight rows, seeds 75001 onward.
  - `grabonly`: Headlong Lunge pinned at Severity 3, seeds 72001 onward.
  - `nocur`: rungs `[loudest-or-brightest, hooked-into-its-body, nearest]`, seeds 73001 onward.
  - `stance`: four strikers, three strikers and a cutter, and the parked rider, at 60,000 fights, seeds 74001 onward.
- **`loud.py`, `loud3.py`.** Subclass `FightQ` only in `soldier_turn`, so that a `loudrider` stays mounted and takes Draw Attention with each action. They also subclass `choose`, to count cards against that rider and cards on which another soldier held the hooked-by-strike flag. 60,000 fights a row, seeds 81001 and 98001 onward.
- **`fixopts.py`.**
  - `reorder` sets the Abnormal's rungs to `[hooked-into-its-body, loudest-or-brightest, current-holder, nearest]`.
  - `loud_near` patches `TEST_FN["loudest-or-brightest"]` to need a Position other than Distant, applied in every worker.
  - Each runs the loud rider at 60,000 fights, the reference start at 60,000, and the three tight rows in two orders at 120,000.
- **`extra2.py`.**
  - The baseline, four eager strikers, and four waiting strikers on Chapter 5's reference Titan (`FightQ5`) and on every Chapter 6 table, at 60,000 fights.
  - The Small, Medium, and Large helper and screen rows at 24,000.
