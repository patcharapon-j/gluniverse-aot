# Chapters 5 and 6 decision conformance review, round 3 (Codex)

Date: 2026-09-15

Scope: Chapters 5 and 6 after decision batch 4b, their YAML in `data/engagement/` and `data/titans/`, the current Chapter 5, Chapter 6, batch 4, and batch 4b probes, Chapter 2's Attention Catalog rows, Chapter 4 section 4.12, `CONTEXT.md`, every ADR, and the two round-2 reviews. Older batch probes were read as historical snapshots. `tools/sim/` and the parallel round-3 review were not read.

## Verdict

Decision batch 4b closes the round-2 Critical. Every live ladder begins with `hooked-into-its-body`, so a Nape striker who falls short wins over a loud comrade and draws the Titan's next behavior after a decoy hold or Grab ends. Fight start, Distant riders, parking, and screening all have rule-set outcomes. No player choice, GM choice, or Squad-sheet order selects Attention.

The four-striker policy still beats the baseline Squad on every table. Batch 4b handles it as ordered: ADR-0014 reads the kill target under the baseline Squad, Chapters 5 and 6 report the row, and the decision record logs the unresolved Major as OQ-112. It is not counted again here.

One Minor remains. A Chapter 6 note points to the wrong section for the standard Medium loud-rider row.

| Chapter | Critical | Major | Minor |
|---|---:|---:|---:|
| Chapter 5 | 0 | 0 | 0 |
| Chapter 6 | 0 | 0 | 1 |
| **Total** | **0** | **0** | **1** |

## Finding

### Minor 1: Chapter 6 points the loud-rider comparison at the Behavior Table instead of its tuning row

**Location:** `docs/rules/06-standard-titans.md:687`, section 6.6, *The Sprinting Abnormal*, the final sentence of the loud-rider bullet.

**Problem:** The note gives the standard Medium Titan loud-rider figures, then cites "section 6.3's table." Section 6.3 contains the standard Medium stat block and Behavior Table. The cited simulation row is in section 6.6, *A prepared Squad kills the standard Medium Titan in about 3 rounds*, at `docs/rules/06-standard-titans.md:540`.

**Play scenario:** A reviewer checks why a Distant loud rider is not a dominant stance against the standard Medium Titan. The pointer sends them to a Behavior Table with none of the quoted 49.1%, 0.90 Critical Injury, or 0.078 death figures, so they cannot audit the comparison from the cited location.

**Fix options:**

1. Change the pointer to "section 6.6's standard Medium fight table."
2. Point directly to the rendered row by its label, "a loud rider who stays mounted at Distant..." in section 6.6.

## Attention conformance

The operative Attention rule agrees across ADR-0003 item 2, ADR-0010 as amended through batch 4b, `CONTEXT.md`, Chapter 2's `draw-attention` and `break-attention` rows, Chapter 5 section 5.6, Chapter 6 sections 6.5 and 6.6, `data/engagement/attention.yaml`, and `data/titans/index.yaml`:

- every ladder begins with `hooked-into-its-body` and ends with `nearest`;
- a Nape strike sets `hooked-by-strike`, whatever its result;
- hooked-by-strike wins over a soldier who is only On Body;
- every flag lasts until the end of the Titan's next card that resolves a behavior;
- a card made inert by a decoy, a Grab, or no holder leaves flags standing;
- ties narrow by lower rungs, then current holder, then the lowest initiative card;
- if no card can decide, nothing holds Attention until the next card;
- `current-holder` is false at Distant;
- the Squad sheet records Positions but its row order chooses nothing.

I exercised the live evaluator in a temporary copy for both the standard Medium Titan and the Sprinting Abnormal. Each walk produced one target:

| Walk | Rules result |
|---|---|
| Fallen-short striker at Blind Spot, loud comrade at Distant | The striker. `hooked-into-its-body` is first on both ladders; the Abnormal's noise rung is second. |
| Fallen-short striker while a decoy holds | Every card of the hold is inert and preserves the flag. The hold's last card evaluates the ladder and gives the striker Attention. The Titan's next acting card resolves against that striker. |
| Fallen-short striker while the Titan holds a Grabbed soldier | Holding cards are inert and preserve the flag. After an ordinary release, the next card evaluates and selects the striker. If Break Attention made the release, the decoy first holds for the Titan's Tempo cards, then its last card selects the striker. |
| Fight start, two or more soldiers at Distant, no flags or cards | Nothing holds Attention because no Phase 1 rung singles out one soldier. The first Titan card uses that round's cards. The rule remains conditional for a later ladder whose rung can single out a soldier at the start. |
| Prior Abnormal holder parks at Distant; a comrade is In Reach | The parked holder fails `current-holder`; `nearest` selects the comrade. |
| Loud rider at Distant; no one hooked | The rider can take Attention through the Abnormal's second rung. This is legal and costs their action. |
| Loud rider at Distant; a comrade has just struck the Nape | The hooked striker takes Attention. The loud rider cannot lift the Nape restriction. |

The evaluator returned the hooked striker in the loud-comrade, last-decoy-card, and post-Grab-release cases on both ladders. It returned `None` at fight start on both. No result consulted list order or a choice.

## Abnormal bar, rerun under batch 4b

I copied the current probes and rule data to `/tmp/wof-review3.ahtFdk` and ran `loud_b4b.py bar 120000`. This uses fresh fixed seeds from the batch 4b probe, the swapped ladder, both Squad orders, and the same-order standard Medium and Large twins. Positive standard-error gaps would be on the failing side; every reported gap was zero or negative.

| Row | Order | Abnormal median | Abnormal CI; Medium twin | Abnormal deaths; Large twin | No kill; Large twin | Ceiling gap |
|---|---|---:|---:|---:|---:|---:|
| Reference | cutters first | 2 | 0.847; 0.697 | 0.0769; 0.1609 | 7.56%; 13.12% | -34.7 SE |
| Reference | strikers first | 2 | 0.854; 0.698 | 0.0757; 0.1658 | 7.58%; 13.28% | -37.3 SE |
| Helpers | cutters first | 2 | 0.793; 0.639 | 0.0206; 0.0207 | 4.12%; 9.40% | -0.1 SE |
| Helpers | strikers first | 2 | 0.790; 0.643 | 0.0194; 0.0215 | 4.04%; 9.39% | -2.4 SE |
| Screen | cutters first | 2 | 0.520; 0.428 | 0.0101; 0.0108 | 2.18%; 8.84% | -1.4 SE |
| Screen | strikers first | 2 | 0.520; 0.427 | 0.0096; 0.0101 | 2.21%; 8.99% | -1.0 SE |
| Screen plus pair | cutters first | 2 | 0.458; 0.386 | 0.0078; 0.0088 | 1.50%; 7.02% | -2.4 SE |
| Screen plus pair | strikers first | 2 | 0.454; 0.386 | 0.0080; 0.0092 | 1.50%; 6.99% | -2.4 SE |

The no-margin helpers row holds in both orders on this run, so batch 4b's second-seed rule was not invoked. The reference row is also above the standard Medium death floor by more than 30 standard errors in both orders. The order changes only sampling noise.

### Loud rider and four strikers

The fresh 60,000-fight loud-rider run under the corrected ladder gave median round 3, 65.1% killed by round 3, 7.38% with no kill, 0.904 Critical Injuries, and 0.0799 deaths. It drew 1.67 Abnormal cards per fight, but **0.00** while a comrade's hooked flag stood. The baseline on its paired seed gave median round 2, 69.5%, 7.58%, 0.855, and 0.0774. The Distant loud rider is slower and slightly costlier, not a neutralizing stance. The previous noise-first ladder gave 71.1%, 0.776 Critical Injuries, 0.0520 deaths, and 0.55 cards over a hooked comrade, which confirms that 4b-1 closed the prior failure.

I also ran the four-striker probe at 120,000 fights per row. The Chapter 5 reference Titan gave 78.4% killed by round 3, 0.42 Critical Injuries, and 0.008 deaths, against the baseline's 61.9%, 0.71, and 0.030. The standard Medium row gave median round 3 at this sample, 78.2% by round 3, 0.424 Critical Injuries, and 0.0097 deaths. The Sprinting Abnormal gave median round 2, 91.4%, 0.620, and 0.0193; it still clears the Medium twin's Critical Injury floor of 0.424 and the Large twin's death ceiling of 0.0860. These results reproduce the logged OQ-112 problem and the drafter's reported median boundary.

## Batch 4b conformance

| Decision | Result | Evidence |
|---|---|---|
| 4b-1, first rung and Abnormal swap | Applied | Chapter 5 section 5.6 and `attention.yaml` make the first rung structural. Chapter 6 and `index.yaml` use `[hooked-into-its-body, loudest-or-brightest, current-holder, nearest]`. `titans.py` checks both live ladders. |
| 4b-2, four strikers | Applied and Logged | ADR-0014 fixes the baseline policy and calls the stance an unresolved Major. Chapters 5 and 6, both tuning files, and both current case lists report the row. OQ-112 is allowed to remain a register edit for the decider. |
| 4b-3, flare entry | Applied | Chapter 5 section 5.6, `attention.yaml`, `background-titans.yaml`, and Chapter 6 say a flare-summoned Titan uses that round's cards. End-step entry skips them. |
| 4b-4, pooled second seed | Applied | ADR-0014, Chapter 6's bar note, `data/titans/tuning.yaml`, and `run6.py` all rerun a first-seed miss and judge the pooled pair. The helpers ceiling and rejected Grab-only variant are described correctly. |
| 4b-5, register history | Logged | The decision stages OQ-102 and OQ-103 history markers for the decider. Per the brief, their register bodies are not an open chapter finding. |
| 4b-6, conditional start | Applied | ADR-0010, `CONTEXT.md`, Chapter 5, Chapter 6, and `attention.yaml` name a soldier, decoy, or nothing and condition the empty start on no rung selecting one soldier. |
| 4b-7, Severity sentence | Applied | The decision record and Chapter 6 distinguish the two Severity 2 kill entries, Severity 1 Pitch Headlong, and Severity 2 Trample. The rendered table and `sprinting-abnormal.yaml` agree. |

No decided scoped entry retains a `PROVISIONAL` tag. Historical noise-first rows are labelled as pre-batch-4b comparisons rather than live rules.

## Requested odds and support checks

All fresh simulations ran from the temporary copy outside the repository. The figures reproduce the stated targets within their sample precision:

| Check | Fresh result | Conformance |
|---|---:|---|
| Gas, two dice per round | median **8** | Meets ADR-0014 |
| Gas, three dice per round | median **6** | Meets ADR-0014 |
| Standard Medium, baseline Squad | median kill round **3**, 61.4% by round 3 | Meets ADR-0014 |
| Fresh Rookie cut, Nape Depth 4, Stress 1 | **13.1%** | Inside 8% to 14% |
| Levi-grade pushed cut, Nape Depth 4, Stress 2 | **47.4%** | About 50% |
| Grab alone after failed dodge | **69.9%** | About 2 in 3 |
| Grab with one comrade, Stress 2, Grief 0 | **33.4%** | About 1 in 3 |
| Lone usable strike, standard Medium | **77.1%** | Reproduces 77.0% |
| Lone usable strike, standard Large | **76.2%** | Reproduces 76.1% |
| Lone usable strike, standard Small | **72.4%** | Reproduces 72.5% |
| Lone usable strike, Sprinting Abnormal | **51.9%** | Reproduces 52.2% as a table-effect report |

Fresh 12,000-fight screen rows also show a trade rather than neutralization:

| Titan | Screen by round 3 | Screen CI | Cards resolved/round | Screen plus pair by round 3 | Screen plus pair CI | Cards resolved/round |
|---|---:|---:|---:|---:|---:|---:|
| Standard Small | 87.0% | 0.516 | 1.100 | 88.7% | 0.475 | 1.045 |
| Standard Medium | 67.6% | 0.420 | 0.630 | 69.8% | 0.388 | 0.586 |
| Standard Large | 65.8% | 0.941 | 0.654 | 70.8% | 0.764 | 0.605 |
| Sprinting Abnormal | 77.5% | 0.533 | 1.210 | 81.1% | 0.457 | 1.150 |

Every Titan still resolves cards and inflicts harm. Heavy Tread leaves the Large screen at 0.0123 deaths per fight. The Abnormal screen remains above its Medium twin's Critical Injury floor and below its Large twin's death ceiling.

## Tables, YAML, and fidelity

- All 24 review YAML files parsed: the 22 files in `data/engagement/` and `data/titans/`, plus Chapter 2's Action Catalog and Chapter 4's sheet fields.
- `render.py check` reports every Chapter 6 rendered block identical to YAML.
- `run6.py check` and the horse-state self-test pass. Every d6 result appears exactly once, each tier owns results 1 and 2, 3 and 4, or 5 and 6 as required, each table has one Thrash and at least one Telegraph, and both ladders satisfy the first-rung and last-rung format.
- The no-repeat and move-up procedure leaves at least 3 Small, 2 Medium, 3 Large, and 1 Sprinting Abnormal non-Thrash entries in the worst Broken-part state. Each table's maximum reachable kill share is 0.50. Broken leg entries require both legs, so one Broken leg removes them without leaving an illegal resolution.
- The standard Titans each have one Grab result and one potentially lethal result. The Sprinting Abnormal's Grab and Headlong Lunge are Severity 2 in prose and YAML. Pitch Headlong is Severity 1 and Trample is Severity 2.
- All 46 scoped `data/*.yaml` path references resolve to files.
- The Sprinting Abnormal remains the 845 to 850 runner the decision selected: Tempo 2, leg-dependent running entries, persistence on a nearby quarry, and no Female Titan or Shifter targeting abilities. Batch 4b improves fidelity by making a blade at its Nape turn it before distant noise. OQ-112 correctly records the remaining fidelity cost that optimal Squads do not cut its legs.

## Previous-round findings

### `05-06-decisions-conformance-review-2.md`

| Finding | Status | Evidence |
|---|---|---|
| Critical 1, loudest outranked hooked-by-strike and let a Distant rider lift the Nape restriction | **Resolved** | Hooked is structurally first on every ladder. The fresh loud-rider run recorded 0.00 cards over a hooked comrade. |
| Major 2, four strikers beat the baseline on every table | **Logged** | ADR-0014 and both chapters report it as unresolved OQ-112 under the baseline-policy reading. The 120,000-fight rerun reproduces it. |
| Minor 3, flare-summoned entry had two Attention readings | **Resolved** | A mid-round entry uses that round's cards; an end-step entry does not. |
| Minor 4, the bar's no-margin row and rejected Grab-only reading were misstated | **Resolved** | The second-seed pooled rule, helpers boundary, and Grab-only pooled failure agree in ADR-0014, Chapter 6, YAML, and the probe. |
| Minor 5, OQ-102 and OQ-103 bodies lack history markers | **Logged** | Batch 4b assigns this register-only edit to the decider. The brief excludes it from open chapter findings. |
| Minor 6, the empty fight start was universal and Attention omitted decoys and nothing | **Resolved** | The start is conditional in ADR-0010 and both chapters; the glossary names a soldier, decoy, or nothing. |

### `05-06-decisions-conformance-review-2-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Major 1, the same Distant loud-rider domination | **Resolved** | The rung swap makes the loud-rider Squad slower and slightly costlier than baseline, with no card taken over a hooked striker. |
| Minor 1, the Severity summary overstated every harmful entry's reduction | **Resolved** | Batch 4b's revised sentence distinguishes both kill entries, Pitch Headlong, and Trample exactly. |

## Final counts

Critical: **0**  
Major: **0**  
Minor: **1**
