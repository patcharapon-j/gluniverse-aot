# Chapters 1 to 3 decisions conformance review, round 2

Reviewed `docs/rules/01-core-rules.md`, `docs/rules/02-character-creation.md`, `docs/rules/03-harm-and-mind.md`, every YAML file in `data/core/`, `data/character/`, `data/harm/`, and `data/mind/`, `CONTEXT.md`, every ADR, `docs/rules/OPEN-QUESTIONS.md`, `docs/rules/DECISIONS-2026-09-14.md`, and both round-1 conformance reviews. I did not read the parallel round-2 review.

All 58 open questions are marked Decided. No `PROVISIONAL:` or `provisional:` choice remains in the three chapters or their YAML. All 27 YAML files parse. D66 coverage, Critical Injury ranges and links, Merit bands, Catalog references, Talent references, effect references, and Squadmate Health and Resolve derivations pass.

## Verdict

No Critical or Major finding remains. The three round-1 Major findings are resolved. Health boxes now agree across the glossary, ADR-0005, the three chapters, the harm YAML, healing and treatment, the sheet derivation, and Squadmate creation and promotion.

Three Minor gaps remain. One is a newly exposed legal Health 6 build that the Health-box reporting and Chapter 4 constraint omit. Two are unresolved round-1 wording mismatches around horse wear and Sure Seat.

The Health-box simulation ran 300,000 Python trials per Health in temporary directories outside the repository, reading the real Critical Injury YAML through a read-only conversion. It reproduced the chapter's Health 2 to 5 figures: mean injuries before Down or instant death were 1.893, 2.652, 3.255, and 3.699. For the omitted Health 6 build, the mean was 3.995; Down occurred by the third injury in 39.64% of trials, by the fourth in 55.54%, by the fifth in 69.99%, and by the sixth in 99.65%. Instant death ended 0.35% first. Nothing here makes an ADR-0014 target unreachable.

## Round-1 Critical and Major findings

`01-03-decisions-conformance-review-1-codex.md` reported no Critical or Major finding, so it has none to classify. `01-03-decisions-conformance-review-1.md` reported no Critical and three Majors:

| Earlier review | Finding | Status | Evidence |
|---|---|---|---|
| `01-03-decisions-conformance-review-1.md`, finding 1 | Round refresh erased an action spent in advance | Resolved | Chapter 1 sections 1.8 and 1.9 now preserve an action-only advance spend. Chapter 3 section 3.9, `effect-types.yaml`, and `bonus-dice-sources.yaml` use the same state. |
| `01-03-decisions-conformance-review-1.md`, finding 2 | Exam Cover contradicted Chapter 1 qualification | Resolved | Chapter 2 section 2.4 and `graduation-exam.yaml` make every other Exam Cadet qualify to Help, fix actual Help to the cycle, and use the rolled state to forbid Cover after a Cadet rolls. |
| `01-03-decisions-conformance-review-1.md`, finding 3 | ADR-0014 left the reference Rookie's Health undefined | Resolved | OQ-58 fixes Strength, Agility, Health, and Resolve for all three reference builds in ADR-0014. Chapters 2 and 3 and `squadmates.yaml` identify the Slayer as the Health 4 reference Rookie and require the Health 3 report. |

## Findings

### 1. Minor. Chapter 2 permits Health 6, but the Health-box calibration stops at 5

**Location:** Chapter 2, Character Creation, sections 2.2 and 2.3.4, especially the attribute swap, overflow, Top 10 bonus, and OQ-19 design note; Chapter 3, Harm and Mind, section 3.2, *Injuries before Down* and *Reference builds*; `docs/rules/DECISIONS-2026-09-14.md`, owner Health-box rules 13 and the Chapter 4 constraints.

**Problem:** The text and YAML put no cap on Health itself. A legal Lifepath can leave two attributes at 5, let a Strength or Agility Specialty swap one into its key attribute, and then raise that key attribute to 6 for Top 10. Strength 6 plus Agility 5 gives Health 6. The decisions instead tell Chapter 4 to size damage against current Health 1 to 5, and Chapter 3 reports Health 2 through 5 as though that were the full range.

This does not break the current Health procedure, which works at any positive rating. It leaves the upper legal build out of the fall-damage constraint and the report beside ADR-0014's death targets. An exhaustive row check found that 2,048 of 248,832 equally likely Lifepath row combinations, 0.8230%, have a player-choice route to Health 6 before the separate Top 10 requirement.

**Scenario:** A Cadet rolls Underground City, Saved by a Soldier, Upside Down in the Harness, The Repair Drill, and The Runaway Wagon. The last Agility point overflows to Instinct, leaving Agility 5 and Instinct 5. The player chooses Slayer, swaps Strength 2 with Instinct 5, and earns Top 10. Strength becomes 6 while Agility stays 5, so Health is 6. Chapter 4's recorded 1 to 5 damage range has no case for this soldier.

**Fix options:**

1. Keep Health 6 legal. Add it to Chapter 3's Health report and change the Chapter 4 constraint to current Health 1 to 6.
2. Cap Health at 5 in the formula, glossary, Chapter 2, Chapter 3, and `attributes.yaml`.
3. If Health 6 should be impossible, constrain overflow or the tied swap explicitly, then verify that the constraint does not reintroduce player-dependent key-attribute odds.

### 2. Minor. Chapter 1's corrected horse-wear rule is still broader in ADR-0015

**Location:** Chapter 1, Core Rules, section 1.5, *Pushing and gas*; `docs/adr/0015-titan-attacks-land-unless-dodged.md`, amendment; `docs/rules/DECISIONS-2026-09-14.md`, OQ-12 and OQ-25.

**Problem:** Chapter 1 correctly says a mounted Pushed dodge wears the horse only for Gear Dice showing 1 when the roll is final. ADR-0015 and the two decision entries still say the Pushed dodge "wears the horse", without the Gear Die condition. Read as a procedure, that charges wear on every Push. Read as shorthand for ADR-0004, it agrees with Chapter 1. The design record should not leave both readings.

**Scenario:** A mounted soldier Pushes a dodge and the horse's Gear Die shows 4. Chapter 1 applies no wear. A later Chapter 4 drafter follows ADR-0015 literally and removes one point from the horse on every mounted Pushed dodge.

**Fix options:**

1. Amend ADR-0015 to say that final Gear Dice showing 1 wear the horse, not ODM Gear, and that the dodge does not by itself raise the Gas Roll.
2. Add an explicit pointer in ADR-0015 to ADR-0004's normal Gear Die wear procedure.

### 3. Minor. Sure Seat advertises an outside-Engagement use that its limit forbids

**Location:** Chapter 2, Character Creation, sections 2.7 and 2.7's OQ-28 design note; `data/character/talents.yaml`, `sure-seat`; `docs/rules/DECISIONS-2026-09-14.md`, OQ-28 and OQ-36.

**Problem:** Sure Seat's player description says it protects the horse when "a dodge or a hard ride is Pushed". Its `once_per_titan_engagement` limit means it never works on a Hard Ride unless the later Expedition rules explicitly extend that limit. OQ-36 states that rule, and the Chapter 2 design note now calls out the contradiction instead of removing it. The description is still what players see.

**Scenario:** A Rider takes Sure Seat for an Expedition's Hard Ride. The player tries to ignore horse wear, but the Talent's limit forbids the use because no Titan Engagement is under way and the still-undrafted Expedition procedure has not extended it.

**Fix options:**

1. Change the description to name a Pushed dodge, Ride, or Break Attention made with the horse in a Titan Engagement.
2. Keep the description and require the Expedition and Chase procedures to extend Sure Seat, recording that exception now in OQ-28 and the Chapter 4 to 6 constraints.

## Findings by chapter

- **Chapter 1, Core Rules:** one horse-wear wording mismatch with ADR-0015, finding 2.
- **Chapter 2, Character Creation:** one omitted Health 6 calibration case and one misleading Sure Seat description, findings 1 and 3.
- **Chapter 3, Harm and Mind:** the Health 6 omission in finding 1. No independent Chapter 3 finding remains.

## Counts

- Critical: 0
- Major: 0
- Minor: 3
