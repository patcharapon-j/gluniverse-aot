# Chapters 5 and 6 decisions conformance review, round 1 (Codex)

## Verdict

The two previous Criticals and the previous Major are resolved. The rulebook now gives one flag lifetime, one standard `nearest` procedure, and an explicit `current-holder` rung for the Sprinting Abnormal. The current rules, YAML, rendered figures, and current probes conform to decision batch 3e.

Two Minor findings remain. Both are historical-probe reproducibility faults in batch 3b, not defects in the playable rules or current figures.

| Chapter | Critical | Major | Minor |
|---|---:|---:|---:|
| Chapter 5 | 0 | 0 | 1 |
| Chapter 6 | 0 | 0 | 1 |
| **Total** | **0** | **0** | **2** |

## Priority verification

ADR-0003 item 2, ADR-0010, `CONTEXT.md`, Chapter 2's `draw-attention` Catalog row, Chapter 5, Chapter 6, `attention.yaml`, and `behavior-procedure.yaml` now state the same rule: every loudest, just-hurt, or hooked-by-strike flag lasts until the end of the Titan's next card that resolves a behavior. A decoy hold, a Grab-holding card, or a card with no holder resolves nothing and leaves every flag standing. The acting card reads the flags, resolves its behavior, then clears them at its Next step.

The same sources also give one `nearest` procedure. When `nearest` is the first rung met, only candidates at the closest Position meet it. Later rungs narrow that set when they can. A remaining tie goes to the current holder, then the lowest card, then the Squad sheet. `current-holder` is a separate closed test for Abnormal ladders.

### The three disputed scenarios

| Scenario | Single target given by every governing text |
|---|---|
| A Titan Grabs Armin. While it holds him, Jean strikes an arm, then Mila makes a short Nape strike. Holding cards resolve nothing, so Jean's just-hurt flag and Mila's hooked-by-strike flag both stand. On the first acting card after Armin is released, hooked-by-strike is the highest met rung and outranks just-hurt. | **Mila** |
| A Tempo 2 Titan is held by a decoy. Mila makes a short Nape strike before the hold ends. The remaining held card resolves nothing and cannot consume her flag. The next card that acts reads hooked-by-strike. | **Mila** |
| The Sprinting Abnormal has no loudest soldier and nobody On Body or hooked, while Bram is its living current holder at Distant and Jean is closer. Its explicit `current-holder` rung is met before `nearest`. | **Bram**. If there is no living current holder, the closest-position candidates meet `nearest`, followed by the normal tie steps. |

The first two walks also match the probes. In 12,000-fight rows, the next resolving behavior after a held short strike targeted the striker in 98.9% to 99.8% of eligible cases; the remainder had died, gone Down, or become Grabbed first. A holding Grab card encountered standing flags about 0.03 times per fight and left them standing.

## Sprinting Abnormal

Chapter 6 section 6.5, its GM text, `data/titans/index.yaml` `reads_as`, OQ-102, OQ-103, `sprinting-abnormal.yaml`, and every current Abnormal figure run the same Titan. Its ladder is `loudest-or-brightest`, `hooked-into-its-body`, `current-holder`, `nearest`. It keeps the soldier it last turned on until noise, a Nape strike or On Body hook, loss of that holder, or a new engagement state changes the result.

This is consistent with the recorded 845 to 850 fidelity target: the ordinary runner from manga chapter 22 and anime episode 17 ignores outer riders and nearby leg cutters while pursuing its chosen way into the formation. It does not borrow the Female Titan's rider-hunting, snatching, or interception behavior. The fixation is an explicit rule, not hidden procedure behavior.

The 120,000-fight bar holds row against row. Each cell is `median kill round / no kill within 12 rounds / Critical Injuries / deaths`.

| Row | Abnormal | Medium twin | Large twin |
|---|---|---|---|
| Reference | 2 / 5.07% / 0.8181 / 0.0722 | 3 / 4.95% / 0.6910 / 0.0334 | 3 / 13.03% / 1.4037 / 0.1635 |
| Two helpers | 2 / 2.75% / 0.7066 / 0.0198 | 3 / 2.91% / 0.6365 / 0.0086 | 3 / 9.29% / 1.2504 / 0.0196 |
| Template Squad | 3 / 17.32% / 1.3254 / 0.2110 | 4 / 9.86% / 0.8829 / 0.0605 | 4 / 19.96% / 1.7745 / 0.2777 |
| Screen | 2 / 1.46% / 0.5113 / 0.0098 | 3 / 3.07% / 0.4236 / 0.0054 | 3 / 8.96% / 0.9066 / 0.0106 |
| Screen and tactic pair | 2 / 0.97% / 0.4434 / 0.0083 | 3 / 2.50% / 0.3844 / 0.0047 | 3 / 7.08% / 0.7886 / 0.0092 |

The closest ceiling comparison is helpers: 0.0198 +/- 0.0005 deaths against the Large Titan's 0.0196 +/- 0.0006, 0.3 standard errors apart. Removing `current-holder` fails the supported ceilings by 12.7, 10.4, and 8.0 standard errors. The Abnormal Thrash share is 38.2%, within the current tables' observed 30.2% to 41.6% range.

## Mechanical and data conformance

- All 23 scoped YAML files parse with duplicate-key rejection. All 331 explicit scoped data-file pointers in Chapters 1 to 6, `CONTEXT.md`, and the scoped YAML resolve.
- No live Chapter 5, Chapter 6, YAML, or current probe pointer names `roster.yaml`. OQ-110 deliberately retains the former name only while stating its historical question; its applied choice and all pointers below it use `data/titans/index.yaml`.
- Every Titan covers each d6 result exactly once, has one resultless Thrash, follows its tier's effects and Severity rules, has a Telegraph, and caps every state's kill share at one half.
- The move-up procedure skips the previous behavior and illegal entries. Every previous-behavior and Broken-part state leaves at least one legal non-Thrash entry: Small 3 minimum, Medium 2, Large 3, Sprinting Abnormal 1. Thrash remains the defined final fallback.
- Broken-part requirements and flavor text agree. All four leg-driven entries require both legs, so one Broken leg disables running and treading. Position lint, Grab shape, injury lethality, and Body Part use pass for all four tables.
- Every `PROVISIONAL:` rule in Chapters 5 and 6 cites an OQ whose status remains Open. No decided entry carries a stale chapter-level tag.
- `titans.py` reports zero problems for all four Titans, and `render.py check` reports every generated block identical to the checked-in chapter and figure blocks. `fight6.py selftest` passes.

## Re-simulation

All odds were re-run with Python from `/tmp/wof-review-K56ED3/repo`, outside the repository. The committed seeds produced:

| Check | Result |
|---|---|
| Gas canister, ordinary / conservation | Median **8 / 6 rounds** |
| Prepared Squad against standard Medium | Median kill **round 3**; 62.8% by round 3; 0.6829 Critical Injuries; 0.0311 deaths |
| Fresh lone Rookie Nape cut, standard Medium, fight-start Stress 1 | **13.3%**, inside the 8% to 14% target |
| Levi-grade cut, standard Medium, Stress 2 | **47.2%**, about half |
| Grab, lone / one comrade close | **69.4% / 33.3%** fatal |

Lone usable-strike shares within 12 rounds were Small **72.5%**, Medium **77.0%**, Large **76.1%**, and Sprinting Abnormal **52.0%**. The first three preserve the intended route; the Abnormal is the declared table-effect report, not a closed route.

Screen rows below are `by round 3 / Critical Injuries / cards resolved per round`.

| Titan | Screen | Screen and tactic pair |
|---|---|---|
| Small | 86.9% / 0.5177 / 1.113 | 88.1% / 0.5057 / 1.076 |
| Medium | 66.1% / 0.4296 / 0.634 | 69.6% / 0.3796 / 0.587 |
| Large | 66.8% / 0.9074 / 0.651 | 69.2% / 0.7916 / 0.607 |
| Sprinting Abnormal | 81.0% / 0.5146 / 1.181 | 83.0% / 0.4395 / 1.136 |

Nine pinned-output commands reproduce exactly, including both batch 3e priority probes and both modes of `onfoot_b3c.py`. The two exceptions are the findings below.

## Previous-round finding status

| Previous review and finding | Status |
|---|---|
| `01-05-decisions-conformance-review-3.md` Critical 1, Grab exception recorded for only one flag | **Resolved.** One lifetime covers all three flags in every governing source. |
| Same review, Major 2, inert hold card consumes struck-first | **Resolved.** Only a card that resolves a behavior clears flags. |
| Same review, Minor 3, legal-route promise includes retreat | **Resolved.** The promise is scoped outside a retreat. |
| Same review, Minor 4, Feint YAML omits on-foot and mounted distinction | **Resolved.** The requirement says not mounted and grounded. |
| Same review, Minor 5, ADR-0003 checklist is stale | **Resolved.** Item 2 carries batch 3e's lifetime. |
| Same review, Minor 6, Chapter 2 Catalog omits the exception | **Resolved.** The Catalog carries the unified lifetime, with no exception. |
| Same review, Minor 7, stale summaries, pointers, and 76.9% figure | **Resolved.** Current records use batch 3e and 77.0%. |
| `01-05-decisions-conformance-review-3-codex.md` Minor, pre-batch-3d flag summaries | **Resolved.** All summaries use the unified lifetime. |
| `06-standard-titans-review-3.md` Critical 1, Abnormal procedure fixates while prose says nearest | **Resolved.** `current-holder` now names the fixation everywhere and the bar was rerun. |
| Same review, Minor 2, Thrash modal at 30% to 42% | **Resolved.** The chapter reports the measured 30.2% to 41.6% range and its tradeoff. |
| Same review, Minor 3, shallow Abnormal Nape teaches the wrong fidelity lesson | **Resolved.** The GM note scopes Nape Depth 3 to this speed-driven Titan and records the cost. |
| Same review, Minor 4, stale flag rule and pre-round-2 comparison | **Resolved.** Section 6.6 gives batch 3e's rule and current rows. |
| Same review, Minor 5, four prose and figure slips | **Resolved.** Tactic range, horse Push, Broken-parts state, and Bite fallback all match their rows. |
| `06-standard-titans-review-3-codex.md` Minor 1, `roster.yaml` uses an Avoid term | **Resolved.** Renamed to `data/titans/index.yaml`; live pointers resolve. |

## Findings

### 1. Minor. Chapter 5: the pinned batch 3b screen probe does not reproduce its committed output

**Location:** `tools/probes/batch-3b/screen_b3b.py`, lines 4 to 18; `tools/probes/batch-3b/screen_b3b.out`.

**Problem:** The script says its model is unchanged and its switches pin the run to batch 3, but it imports the live `tools/probes/chapter-05/fight.py`. Running the default 12,000 fights does not reproduce any of the ten committed rows. For example, the screen with reset escalation and Feint changes from 67.9% to 66.7% killed by round 3, and the tactic-pair row changes from 71.3% to 70.0%.

**Table scenario:** A reviewer reruns the advertised pinned command to verify the historical screen tradeoff. The command exits normally but produces a different report, so the `.out` file cannot establish which implementation generated the recorded decision evidence.

**Fix options:**

1. Snapshot the batch 3b base model beside the script and import that snapshot.
2. Parameterize the live model so every later behavior that affects this probe is pinned, then regenerate and verify the historical output.
3. If exact reproduction is no longer intended, remove the pinning claim, rename the `.out` file as a historical snapshot, and document the current rerun separately.

### 2. Minor. Chapter 6: the pinned batch 3b cross-table screen probe does not reproduce its committed output

**Location:** `tools/probes/batch-3b/screen6_b3b.py`, lines 6 to 20; `tools/probes/batch-3b/screen6_b3b.out`.

**Problem:** This script likewise claims an unchanged, pinned model but imports live `chapter-06/fight6.py`, which in turn reads the current Titan YAML. Running the default 6,000 fights changes all 28 rows. The Sprinting Abnormal reference row moves from 72.1% to 75.4% killed by round 3 and from 1.98 to 0.8055 Critical Injuries, showing that this is not rounding noise.

**Table scenario:** A reviewer reruns the batch 3b addendum to verify the decision-era comparison among all four tables. The Abnormal now uses its later table, ladder, start, and harm implementation, so the result cannot reproduce the evidence in `screen6_b3b.out` despite the script's claim.

**Fix options:**

1. Snapshot the batch 3b Chapter 6 model and Titan data beside the probe.
2. Add a complete batch 3b compatibility mode that pins code, table data, ladder, start, and harm semantics, then verify the output byte for byte.
3. If the file is only archival evidence, stop presenting it as executable reproduction and label the live rerun as a separate current-model sensitivity report.
