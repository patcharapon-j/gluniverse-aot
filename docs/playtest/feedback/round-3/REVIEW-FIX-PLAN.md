# Round 3 rule change: review 1 fix plan

Review: `docs/reviews/round-3-rule-change-review-1.md` (wof-reviewer on Opus, 2026-09-21).
**6 Critical, 6 Major, 7 Minor.** Task file: `docs/playtest/process/round-3-rule-review-task.md`.

The review was run against decision batch 13 as it stood at `de46ab3`. Nothing in
`OWNER-DECISIONS.md` was reopened; every finding is a decision applied wrongly, incompletely, or
inconsistently, or a mechanical consequence nobody wrote down.

## How the findings were split

Five findings are genuine design calls rather than mechanical fixes and went to a Fable decider,
whose record is `docs/reviews/round-3-review-decisions.md`: **C2, C3, C4, C6, M4**. The other
fourteen were applied directly.

## Package 1: applied directly (commit `3099964`)

| # | Finding | Option taken | Files |
|---|---|---|---|
| C1 | The glossary still gave the old Health formula | 1, with 2's reasoning folded in: the formula is stated **and** points at the data | `CONTEXT.md` |
| C5 | A retarget's `loudest-matches` step re-admitted a soldier who fails the Position requirement | 1: the narrowed set bounds every step, `loudest-matches` included | `data/engagement/attention.yaml` |
| M1 | The fallback entry was never retargeted, so 13-9's inertness survived in two tables | 1: the fallback is tested the same way and retargets in its turn | `data/engagement/behavior-procedure.yaml`, `data/engagement/titan-format.yaml`, Chapter 5, `tools/sim/engine.py` |
| M2 | The closed Position list had no row for a *living* Titan going down | 1: a fifteenth row, `titan-body-comes-down`, covering both the death and the grounding trigger | `data/engagement/positions.yaml`, Chapter 5 |
| M3 | "No Action Catalog entry changes a Position" was false | 1: narrowed to entries of kind `action`, with `fly`, `leap-clear` and `mount-or-dismount` named | `data/engagement/positions.yaml`, Chapter 5 |
| M5 | Frenzy was on no closed list of what the GM applies as written | 3: Chapter 1 item 6 **and** the Circumstances `never` list, which also gained a retarget | `docs/rules/01-core-rules.md`, `data/core/circumstances.yaml` |
| M6 | The simulator's Grab model and `health_reports` still specified the old Health values | 1 and 2 together: the Grab victim reads `builds`, `rookie` rather than a literal, and the rows move to Health 4 to 8 with the pre-batch-13 figures kept under `history` | `data/engagement/tuning.yaml` |
| m1 | A retarget can turn a kill-tier entry onto a Down soldier | Named in the retune brief as a case to measure, and stated in Chapter 5's *Retargeting* | `data/engagement/tuning.yaml`, Chapter 5 |
| m2 | The branch map's "(joined)" read as a fourth Position | The join is drawn as a wire, never a labelled node, and the maps are now **rendered** rather than hand-drawn (see below) | `tools/render/render.py`, `data/engagement/anchor-ratings.yaml`, Chapter 5 |
| m3 | `call_it` named the fallback and Thrash but not a retarget | Appended, with the point that the Called behavior is the entry and not the soldier | `data/engagement/read.yaml` |
| m4 | Chapter 5's close-rule row dropped a qualifier the YAML has | Restored, and the "changes nothing relative to a Titan they were Distant or In Reach of" half stated | Chapter 5 |
| m5 | A retarget could in principle return nobody | Added to `retargeting`, `none`: a narrowed evaluation that reaches its own `none` step falls back | `data/engagement/attention.yaml` |
| m6 | A `tuning.yaml` label still read the old template Health | The Health dropped from the label, since the case is about the missing Talent | `data/engagement/tuning.yaml` |
| m7 | The glossary's Attention entries did not mention the second reading of the Ladder | Both: a clause on **Attention Ladder** and a new **Retarget** entry | `CONTEXT.md` |

## Package 2: the five design calls

See `docs/reviews/round-3-review-decisions.md`. Applied in a later commit on this branch.

## Carried alongside

- **A renderer for the Position maps** (handoff section 3.3). `tools/render/render.py` gained
  `b_position_maps`, which derives every node and every line from the Anchor Ratings' own step rows,
  checks `reaches_blind_spot` and the shape against them, and refuses a map drawn for two grounds
  whose step rows differ. The authored `diagram` and `diagram_lines` keys are gone from
  `data/engagement/anchor-ratings.yaml`, so the diagram has one source. Chapter 5 now carries a
  `position-maps` rendered block: 59 blocks render, all matching.
- **The Foundry wording resync.** `foundry/wording/titans.yaml` recorded the new sha of
  `site/src/components/TitanSpecimen.astro`; the ported sentences themselves were unchanged.
- **Print verification of the packet** (handoff section 3.5). Done in a browser against the packet's
  own print stylesheet at A4 less its 10mm margins: no table, figure, `pre` or scroll wrapper
  overflows the 190mm content width; all three Position-map figures fit one page (48.0, 42.7 and
  72.4mm against 277mm) and carry `break-inside: avoid`; the Health row is eight 8mm boxes on one
  line, 133mm inside a 136.6mm cell. `break-before: page` resolves for `.chapter` (15), `#quickref`,
  `.titan` (4), `#glossary` and `#feedback`; `.gm-band:not(:first-child)` matches nothing and is
  inert, but the GM section starts a page as a `.chapter` regardless.
