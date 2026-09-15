# Rulebook progress

Phase 1 only. Each chapter goes draft, review, fix, re-review, with at most 3 review rounds. A chapter is Done when its latest review has zero Critical findings and every unresolved Major finding and PROVISIONAL decision is logged in `docs/rules/OPEN-QUESTIONS.md`.

Status values: Not started, Drafting, Drafted, In review, Fixing, Awaiting decision, Applying decisions, Conformance review, Done.

Reviewers: Chapter 1 was reviewed by wof-reviewer on Fable. From Chapter 2 on, every round has two independent reviews: wof-reviewer on Opus (`<slug>-review-<n>.md`) and Codex CLI on gpt-5.6-sol (`<slug>-review-<n>-codex.md`). Counts are shown as Opus + Codex. A chapter needs zero Critical in both latest reviews. The orchestrator may escalate a narrow item (a disputed Critical or Major, a multi-rule odds claim, a subtle cross-chapter interaction, or a finding that would force an ADR change) to a Fable 5.1 reviewer, written to `<slug>-review-<n>-fable.md`; its Critical and Major findings count toward the chapter.

Process changes (2026-09-14, during Chapter 3 round 3): fixes driven by a later chapter's review may change earlier chapters, including Done ones. Open questions get a decider who may amend ADRs. The decider is a Fable 5.1 subagent: it made the first pass (OQ-01 to OQ-57, recorded in `docs/rules/DECISIONS-2026-09-14.md`) and applies the ADR, glossary, and OPEN-QUESTIONS edits. A brief switch to Codex CLI gpt-6-astra was stopped before it edited anything except an appended section of the decisions file, which Fable reviews. wof-drafter applies decisions to the chapters. After each chapter closes, Fable decides that chapter's open questions (batch 2: OQ-59 to OQ-73, after Chapter 4; batch 2b: OQ-91 and OQ-92, conformance leftovers; batch 3: OQ-74 to OQ-90 and OQ-93 to OQ-99, after Chapter 5; batch 3b: the Chapters 1 to 5 conformance round 1 dispute over OQ-81 Break Attention, revising OQ-50, OQ-79, OQ-81, OQ-89 and OQ-97 and amending ADR-0010 and ADR-0014; batch 3c: the conformance round 2 findings on held-card flags and the grounded-Titan Feint, amending ADR-0003, ADR-0010 and ADR-0014; batch 3d: OQ-111; batch 3e: the conformance round 3 and Chapter 6 round 3 Criticals on flag lifetime and the nearest rung. Chapter 6 used its 3 review rounds; its round 3 Critical was a Chapter 5 procedure question, so it is closed by batch 3e and verified by a combined conformance review of Chapters 5 and 6 (slug `05-06-decisions-conformance`); batch 4: Chapter 6 OQ-100 to OQ-110 plus that review's Abnormal tie-break and parking findings, amending ADR-0003, ADR-0010 and ADR-0014; batch 4b: that review's round 2 loud-rider Critical (every ladder now starts with hooked-into-its-body) and the four-strikers Major, logged as OQ-112; batch 5: the owner's final full review (Fable and Codex gpt-6-astra) and the simulator round 2 rules questions, deciding OQ-113 and OQ-119 to OQ-127 and amending ADR-0010 and ADR-0014; batch 5 items 5-13 to 5-18 (batch 5b): the full review round 2 findings, deciding OQ-129 to OQ-131; item 5-19: the Medium deaths band reading, logged as OQ-132; batch 6, item 6-1: the playtest packet round 3 source note, deciding OQ-134 that a retreat stops only the Background and retreat clocks while Regeneration still fills), the drafter applies them, and a conformance review of all drafted chapters runs in parallel with the next chapter's draft (which may not edit earlier chapters while that review runs).

| # | Chapter | Chapter file | Status | Review round | Open Critical | Open Major | Latest review |
|---|---------|--------------|--------|--------------|---------------|------------|---------------|
| 1 | Core Rules | `docs/rules/01-core-rules.md` | Applying decisions (batch 8; WP-R Attack Dice applied; final full rerun done and its verdicts written (WP-S2); feedback round 1 final review fix package A applied: R33 Chapter 7 Stress pointer, R48 "a Titan or a Foe" for "enemy") | 3 + conformance 4 + 01-05 conformance 3 | 0 + 0 | 0 + 0 | `docs/reviews/01-05-decisions-conformance-review-3.md`, `-review-3-codex.md` |
| 2 | Character Creation | `docs/rules/02-character-creation.md` | Applying decisions (batch 8; WP-R Attack Dice and WP-C2 Leap Clear, Heave, Grip Breaker applied; final full rerun done and its verdicts written (WP-S2); final review 1 done; package C applied: R08, R18, R35, R37, R38, R40 to R44, R46 to R48, and decisions 8-38 (playtest configuration, R06, R45), 8-39 (nested once-per uses, R07), 8-42 (Talent limits, R34)) | 3 + conformance 4 + 01-05 conformance 3 | 0 + 0 | 0 + 0 | `docs/reviews/01-05-decisions-conformance-review-3.md`, `-review-3-codex.md` |
| 3 | Harm and Mind | `docs/rules/03-harm-and-mind.md` | Applying decisions (batch 8; WP-R Attack Dice and WP-C2 Burn, Cut, and Pierce riders, Pinned, lost-limb stacking, prosthetics applied, OQ-156 to OQ-161 decided by 8-20 to 8-25; final full rerun done and its verdicts written (WP-S2); feedback round 1 final review fix package A applied: R11, R12, R13, R20, R31, R32, R33, R48, and R14 by 8-40, the one-snapshot Fear Roll order; simulator in-memory check for 8-40 pending) | 3 + conformance 4 + 01-05 conformance 3 | 0 + 0 | 0 + 0 | `docs/reviews/01-05-decisions-conformance-review-3.md`, `-review-3-codex.md` |
| 4 | Gear | `docs/rules/04-gear.md` | Applying decisions (batch 8; WP-R Attack Dice and WP-C2 prosthetic items, lifting, firearm Field Repair applied; final full rerun done and its verdicts written (WP-S2); final review 1 done; package C applied: R17 (Leap Clear Gear Dice), R22 (Jam note past tense), R36 (Ride, Maintain Gear)) | 3 + conformance 2 + 01-05 conformance 3 | 0 + 0 | 0 + 0 | `docs/reviews/01-05-decisions-conformance-review-3.md`, `-review-3-codex.md` |
| 5 | Titan Engagement | `docs/rules/05-titan-engagement.md` | Applying decisions (batch 8; WP-R Attack Dice and WP-C2 steam, the falling Titan, Pinned, Heave, the corpse applied; WP-T applied: the Medium band at 0.08 in 5.13 (8-31) and the retreat's stay limit in 5.3, 5.10, 5.11 (8-32); final full rerun done and its verdicts written (WP-S2); feedback round 1 final review fixed, package B: R02 (8-34 applied, OQ-165 decided), R04, R15, R22, R23, R24, R26, R27, R28, R29, R30 (8-38), R48, and decision items 8-36 (R03, the stay limit per pin under a corpse) and 8-41 (R21, a pinned limb lost stays pinned); no PROVISIONAL left; awaiting the simulator step's snapshot notes and the packet) | 3 + 01-05 conformance 3 + 05-06 conformance 3 | 0 + 0 | 0 + 0 | `docs/reviews/05-06-decisions-conformance-review-3.md`, `-review-3-codex.md` |
| 6 | Standard Titans | `docs/rules/06-standard-titans.md` | Applying decisions (batch 8; WP-R Attack Dice applied; WP-T applied: the Medium band at 0.08 in 6.6 (8-31) and the Heave rating in every stat block (8-9); final full rerun done and its verdicts written (WP-S2); feedback round 1 final review fixed, package B: R22, R23, R24 (`heave` in the stat block format and in each standard Titan's file), R25; no PROVISIONAL left; awaiting the simulator step's snapshot notes and the packet) | 3 + 05-06 conformance 3 | 0 + 0 | 0 + 0 (round 3 Major logged as OQ-113, since decided by 5-8; Minors in OQ-114) | `docs/reviews/05-06-decisions-conformance-review-3.md`, `-review-3-codex.md` |
| 7 | Playtest Rules | `docs/rules/07-playtest-rules.md` | Applying decisions (WP-F, decision batches 7 and 8; OQ-152 to OQ-155 decided by 8-27 to 8-30; WP-T applied: the Military Police trooper at Attack Dice 7, Grit 4, a patrol of 4, and the Skirmish probe's reported figures (8-33); final full rerun done and its Skirmish figures written (WP-S2); feedback round 1 final review fixed (package D: R16, R19, R52, R53; R01, R05, R06, R07 by 8-35, 8-37, 8-38, 8-39)) | 1 (final review) | 0 + 0 | 0 + 0 | `docs/reviews/feedback-round-1-final-review-1.md`, `-astra.md` |

## Chapter scope

1. Core Rules: dice pool, Push, Stress, Help, Bonus Dice.
2. Character Creation: Lifepath, Specialties, Talents, Action Catalog, Squadmates.
3. Harm and Mind: Health, Critical Injuries, Down, Death Rolls, Stress Responses, Fear Rolls, Scars, Grief.
4. Gear: ODM Gear, gas, Blade Sets, horses, carrying, Standard Issue.
5. Titan Engagement: Positions, Attention, Behavior Tables, Grab, Regeneration, Openings, Read, Background Titans, Wings.
6. Standard Titans: Small, Medium, Large Behavior Tables and one Abnormal.
7. Playtest Rules (the playtest minimum; Phase 2 replaces it): Expeditions, the Leg and Night hazard tables, Downtime, Requisition and the playtest Requisition list, Skirmishes and Foes.

## Simulator (ADR-0014)

| Item | Status | Review round | Open Critical | Open Major | Report |
|------|--------|--------------|---------------|------------|--------|
| Dice simulator in `tools/` | Done (final full rerun under Attack Dice, 2026-09-15: every target, band, and bar limit Met, the Medium deaths band 0.0754 at the reference start and 0.0687 and 0.0693 on the bar's runs against at most 0.08 (8-31), 0 fights at the safety cap, the Skirmish probe inside its three reported ranges (8-33); verdicts written into both `tuning.yaml` files and Chapters 5, 6, and 7 (WP-S2 verdict pass); unmeasured cases OQ-115 to OQ-118, OQ-133) | 3 | 0 + 0 | 1 + 2 (fixed) | `docs/reviews/simulator-report.md`, reviews `docs/reviews/simulator-review-3.md`, `-review-3-codex.md` |

## Playtest packet

Added by the owner on 2026-09-15: after the chapters, the simulator, and the final full review are done, wof-drafter builds a single HTML playtest packet with every Phase 1 rule in a concise, readable form, written like a real TRPG playtest packet with minimal styling, in language suited to a published TRPG product (table language, consistent capitalised game terms, no design-document or data-model wording). It is one file for players and GM, with GM-only material (Titan stat blocks and Behavior Tables, hidden values, the procedures only the GM runs) at the back. One wof-reviewer pass checks it against the chapters for contradictions and omissions, and checks that its language reads like a TRPG product. The owner reviews it and gives feedback before the first playtest. It is also published as a private Claude Artifact (owner request, 2026-09-15), so the file follows the Artifact format (no html, head, or body tags; light and dark theme tokens).

| Item | Status | Review round | Open Critical | Open Major | File |
|------|--------|--------------|---------------|------------|------|
| Playtest packet (HTML) | Republished for the owner (Artifact Version 2, 2026-09-15): owner feedback round 1 applied, final review (Opus + Codex gpt-6-astra) fixed, real print and 400px checks passed | 3 | 0 + 1 (fixed) + 0 | 1 + 2 (fixed) + 0 | `docs/playtest/wings-of-freedom-playtest-packet.html`, reviews `docs/reviews/playtest-packet-review-3.md`, `-review-3-codex.md`, `-review-3-fable.md`; Artifact https://claude.ai/artifact/WoUmYA8rYpDnoB9skQdsEq |

## Feedback round 1 packages

Owner feedback round 1 (2026-09-15): the work packages of `docs/playtest/feedback/round-1/IMPLEMENTATION-PLAN.md`, then the fix packages of `docs/playtest/feedback/round-1/REVIEW-FIX-PLAN.md`.

| Package | Status | Scope |
|---------|--------|-------|
| WP-0 | Done | Batch 7's Action Catalog changes (7-14, 7-16, 7-17), the two firearm items, the shot kind, and rations' stock. |
| WP-A | Done | The Template Build and the Free Build beside the Lifepath, and Squadmates (7-1, 7-11). |
| WP-B | Done | The full Talent list (7-2, 7-3), with batch 8's limits on Leap Clear and Attack Dice. |
| WP-C | Done | Critical Injuries step 1 (7-4 to 7-6): sides, the odd-even rule, the Bite rider, and lost-limb riders. |
| WP-C2 | Done | Burn, steam, the falling Titan, Pinned, Heave, the corpse, and prosthetics (8-7 to 8-11, 8-15). |
| WP-D | Done | The Fear table re-cut and the Stress Response names (7-8, 7-9), with 8-13's confirmations. |
| WP-F | Done | Chapter 7: Expeditions, Downtime, Requisition, Skirmishes, and Foes (7-14 to 7-18, under batch 8). |
| WP-R | Done | Titan attack resolution (8-1, 8-2, 8-4 to 8-6): Attack Dice, Titan Dice, cancellation, and net successes. |
| WP-T | Done | Post-rerun tuning (8-31 to 8-33): the Medium band at 0.08, the retreat's stay limit, and the Military Police trooper. |
| WP-S1 | Done | Simulator engine changes: sides, the Fear effect types, the Free Build Squad row, the attack engine, and Burn hazards. |
| WP-S2 | Done | The full simulator rerun under Attack Dice, with its verdicts written into both `tuning.yaml` files and Chapters 5 to 7. |
| WP-P | Done | The packet updated for every round 1 change. |
| Fix package A | Done | Harm and mind, Chapters 1 and 3: R11 to R13, R20, R31 to R33, R48; R14 by 8-40. |
| Fix package B | Done | Titan Engagement, Chapters 5 and 6: R02, R04, R15, R22 to R29, R48; R03, R21, R30 by 8-36, 8-41, 8-38. |
| Fix package C | Done | Character, gear, and glossary, Chapters 2 and 4 and `CONTEXT.md`: 22 findings; R06, R07, R34, R45 by 8-38, 8-39, 8-42. |
| Fix package D | Done | Chapter 7: R16, R19, R52, R53; R01, R05, R06, R07 by 8-35 and 8-37 to 8-39. |
| Fix package E | Done | The renderer: "none" for empty cells and entry names for Catalog ids (R54, R46). |
| Fix package P | Done | The packet: 18 findings and 8 decision items, and this table (R60). |
| Final review | Done | Two reviews, Opus (`docs/reviews/feedback-round-1-final-review-1.md`: 0 Critical, 9 Major, 54 Minor) and Codex gpt-6-astra (`docs/reviews/feedback-round-1-final-review-1-astra.md`: 1 Critical, 12 Major, 10 Minor), triaged in `docs/playtest/feedback/round-1/REVIEW-FIX-PLAN.md`; all fixes applied. |

## Deferred until after the first playtest

Added by the owner on 2026-09-15, during playtest packet feedback round 1 (`docs/playtest/feedback/round-1/OWNER-DECISIONS.md`). None of these ships in the first playtest, and none may be dropped. Each is picked up once the playtest's results are in.

| Item | Why it waits | Tracked in |
|------|--------------|------------|
| Capstone Talents (level 3) | Fresh Rookies cannot reach level 3, so capstones would be untested text. Design them once the playtest shows what veterans need. | OQ-144; decision batch 7, 7-2 |
| Titan retune: the default Squad (4 PCs plus 2 Squadmates) loses a PC about every 8 typical rolled fights | The first playtest runs 4 PCs with no Squadmates on today's tuning. Dice counts alone cannot reach the target, so other levers are needed. Batch 8 (8-1, 8-14) made Attack Dice the rolled lever and confirmed from the research that no pool reaches this target by dice; steam, corpse heat, and the falling Titan now add deaths outside the attack roll, which the playtest's per-Expedition tally counts first. | OQ-140; decision batch 7, 7-12; decision batch 8, 8-14; `docs/playtest/feedback/round-1/opposed-rolls.md` |

## Final full review

Added by the owner on 2026-09-15: after the chapters and the simulator are done and before the playtest packet is written, one more full review of all six chapters runs in parallel on Fable 5.1 (wof-reviewer, `docs/reviews/01-06-full-review-1-fable.md`) and Codex CLI gpt-6-astra (`docs/reviews/01-06-full-review-1-astra.md`). Findings are resolved (the Fable decider for decisions, wof-drafter for fixes) before the packet is built.

| Item | Status | Review round | Open Critical | Open Major | Latest review |
|------|--------|--------------|---------------|------------|---------------|
| Full review, Chapters 1 to 6 | Done (round 3 Major fixed: retreat actions row) | 3 | 0 + 0 (Fable + Astra) | 0 + 0 | `docs/reviews/01-06-full-review-3-fable.md`, `docs/reviews/01-06-full-review-3-astra.md` (rounds 1 and 2: `-review-1-*.md`, `-review-2-*.md`) |
