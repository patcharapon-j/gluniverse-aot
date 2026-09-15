# Chapters 1 to 4 decisions conformance review, round 1

Reviewed Chapters 1 to 4, all 37 YAML files in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, and `data/gear/`, `CONTEXT.md`, every ADR, decision batch 2 through OQ-73, and the four previous reviews named in the brief. I ignored OQ-74 and above. The parallel review file was not read.

All 37 YAML files parse. Static checks found 37 unique Action Catalog entries, 40 Talents whose named entries exist, 6 gear items whose Catalog mappings agree, valid tracked-value references, and no missing referenced YAML path. No `PROVISIONAL` or `provisional` wording remains in the reviewed chapters or data.

## Verdict

No Critical or Major finding remains. One Minor remains in Chapter 4 data. OQ-73 ordered the malformed Gas Roll sentence from review round 3 to be rewritten, but the malformed words survived the edit. The operative gas timing is still recoverable from the surrounding sentences and the matching prose, so this is a data wording defect rather than a broken procedure.

The amended ADRs, glossary, chapter prose, and YAML otherwise agree. OQ-59 to OQ-69, OQ-70, OQ-71, OQ-72, and the other seven parts of OQ-73 have their stated chapter impacts. The Standard Issue ladder is `1, 1, 2, 2, 2, 3`; the reference Rookie has the Slayer template's attributes but roll-specific Talent 1; Health 6 is reported; ammo is absent as live Phase 1 state; handed-over and left canisters resolve gas before moving; recorded Positions name their Focus Titan; and the death share-out has two ordered steps.

## Finding

### 1. Minor. Chapter 4's Gas Roll YAML still contains the wording OQ-73 ordered removed

**Location:** Chapter 4, Gear data, `data/gear/odm-gear.yaml`, `gas_roll.canister_removed`, lines 102 to 105. Decision OQ-73 item 6 identifies this exact sentence as one of its required wording fixes.

**Problem:** The row reads, "Its dice are the ones dice (below) gives for the rolls the soldier has made so far this round." The repeated word makes the authoritative YAML sentence ungrammatical. The Chapter 4 prose correctly says that the early Gas Roll uses the dice produced by the soldier's rolls so far, but ADR-0012 makes the YAML the source of truth. An importer-facing rule should not require prose to repair its grammar.

**Scenario:** A Foundry implementer reads only `gas_roll.canister_removed` to implement a canister pass. They cannot tell whether "ones dice" is a field name, a quantity, or a copying error, and must consult the Markdown despite the YAML source-of-truth rule.

**Fix options:**

1. Use the wording already specified by review round 3: "Its dice are the dice that `dice` below gives for the rolls the soldier has made so far this round."
2. Shorten it to: "Use the dice under `gas_roll.dice`, based on the soldier's rolls so far this round."

## Decision conformance by chapter

| Chapter | Batch 2 impacts | Result |
|---|---|---|
| Chapter 1, Core Rules | OQ-71 act wording, advance-spend cleanup, and provenance tags | Applied |
| Chapter 2, Character Creation | OQ-70 reference Rookie and template report; OQ-71 Veteran, Health report, and Sure Seat wording | Applied |
| Chapter 3, Harm and Mind | OQ-70 reference builds; OQ-71 Health 6, tracked acts, Death Roll classification, and provenance tags | Applied |
| Chapter 4, Gear | OQ-59 to OQ-69, OQ-72, and OQ-73 | Applied except finding 1 |

## Previous Major and batched Minor findings

Duplicate findings from the two reviewers are combined here. Only finding 1 above remains open.

| Previous finding | Status |
|---|---|
| Chapter 4 review 3: rating 1 ODM Gear fails the two-Titan Jam threshold, Major in both reviews | Resolved by OQ-72. Funding 3 to 5 now issues rating 2, ADR-0014 uses ODM Gear 2 for the Rookie, and Chapter 5 carries the binding full-model test. |
| Chapter 4 review 3: an immediate Gas Roll can empty a handed-over canister, Minor and Major | Resolved by OQ-60. At 0 the canister is discarded, the pass or take is not made, and nothing is spent. Death uses the same pre-transfer roll. |
| Chapter 4 review 3: Field Repair rationale overstated Jam persistence, Minor | Resolved by OQ-66 and OQ-59. The prose and YAML now state what can actually carry between sessions and quote the window odds. |
| Chapter 4 review 3: full issue can downgrade a Jammed or lame higher-rated item, Minor | Resolved by OQ-59. The soldier may decline that exchange. |
| Chapter 4 review 3: disputed Take Item order outside an Engagement, Minor | Resolved by OQ-65. It uses the Lifepath roll-off. |
| Chapter 4 review 3: recorded horse and left-item Positions omit their Focus Titan, Minor | Resolved by OQ-61. Prose, `horses.yaml`, `carrying.yaml`, and `sheet-fields.yaml` record and compare the Titan. |
| Chapter 4 review 3: wording and figure slips, batched Minor | Still open only for the malformed `canister_removed` sentence in finding 1. The restoring clause, Rookie gas figures, and forced-dismount rows are resolved. |
| Chapter 4 Codex review 3: ammo remains live Phase 2 data, Minor | Resolved by OQ-67. Ammo is absent from Phase 1 kinds, stock, sheet fields, and the example. |
| Chapter 4 Codex review 3: death share-out can discard an assigned item, Minor | Resolved by OQ-68. Assignment and disposal are separate ordered steps. |
| Chapters 1 to 3 review 2: reference Rookie is incorrectly identical to the Slayer template, Major | Resolved by OQ-70. Only the attributes match; Talent 1 follows the measured roll. The literal template report is separate. |
| Chapters 1 to 3 review 2: Health 3 report changes Strength as well, Minor | Resolved by OQ-71. It overrides Health alone and names the Health-dependent targets. |
| Chapters 1 to 3 review 2: Veteran has an illegal 20 attribute points, Minor | Resolved by OQ-71. Wits is 2, for 19 points. |
| Chapters 1 to 3 review 2: Sure Seat and ADR-0015 retain stale horse-wear wording, Minor in both reviews | Resolved by OQ-71. The Talent names dodge, Ride, and Break Attention in an Engagement; ADR-0015 limits wear to Gear Dice showing 1. |
| Chapters 1 to 3 review 2: Chapter 1 misstates acts and advance spending, Minor | Resolved by OQ-71. Moves are excluded from the Catalog requirement, and both turns and actions spent in advance end with the Engagement. |
| Chapters 1 to 3 review 2: YAML `decided:` tags lag OQ-17, OQ-18, and OQ-52, Minor | Resolved by OQ-71 in all named rows. |
| Chapters 1 to 3 review 2: Chapter 3 omits tracked values and glossary Down says `0 Health`, Minor | Resolved by OQ-71. Section 3.17 names the values and classifies the Death Roll; the glossary says `0 current Health`. |
| Chapters 1 to 3 Codex review 2: legal Health 6 omitted from calibration, Minor | Resolved by OQ-71. Chapter 3 and the Chapter 4 damage constraint include Health 6. |

## ADR-0014 gas check

I ran a seeded Python simulation in `/private/tmp/wof-conformance-r1.VhddWk`, outside the repository, with 1,000,000 full Gas Rating 3 canisters per case. Two dice produced mean 9.2470 rounds, median 8, 10th to 90th percentile 4 to 16, 13.4765% empty by round 4, and 32.2556% by round 6. Three dice produced mean 6.3325, median 6, 10th to 90th percentile 3 to 11, 32.2175% empty by round 4, and 59.7321% by round 6. These reproduce Chapter 4 and ADR-0014. The gas target remains reachable.

## Findings by chapter

- Chapter 1, Core Rules: 0 Critical, 0 Major, 0 Minor.
- Chapter 2, Character Creation: 0 Critical, 0 Major, 0 Minor.
- Chapter 3, Harm and Mind: 0 Critical, 0 Major, 0 Minor.
- Chapter 4, Gear: 0 Critical, 0 Major, 1 Minor.

## Counts

- Critical: 0
- Major: 0
- Minor: 1
