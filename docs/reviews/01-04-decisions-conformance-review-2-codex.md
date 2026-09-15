# Chapters 1 to 4 decisions conformance review, round 2

Reviewed Chapters 1 to 4, all 37 YAML files in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, and `data/gear/`, `CONTEXT.md`, every ADR, decision batch 2 and batch 2b, and both round 1 conformance reviews named in the brief. I checked OQ-91 and OQ-92 only in `OPEN-QUESTIONS.md`. I did not read Chapter 5, `data/engagement/`, OQ-74 to OQ-90, or the parallel review file.

All 37 YAML files parse. Static checks found 37 unique Action Catalog entries, 26 tracked values, 40 Talents whose named entries exist, 6 gear items with bidirectional Catalog mappings, no missing referenced YAML path, valid Squadmate Health and Resolve calculations, and complete D66 and result-range tables. No `PROVISIONAL` wording remains in the reviewed chapters or data.

## Verdict

No Critical or Major finding remains. Batch 2b resolves both previous Majors and its two ruled Minors. The reference builds now carry no Talent dice on dodge, Fly, Break Attention, Ride, or Read. Standard Issue rates ODM Gear and horses `1, 1, 2, 2, 2, 3`, and a full issue replaces worn ODM Gear and horses unless the soldier declines. ADR-0014's body, Chapters 2 to 4, and the relevant YAML agree.

One Minor records finding remains in Chapter 4. The current chapter has the correct reference-Rookie gas median, but OQ-73 still orders the pre-OQ-72 value. The progress table also still displays the two round 1 Majors while this round is in progress. Neither changes play.

## Previous findings

| Previous finding | Status | Verification |
|---|---|---|
| Codex Minor 1, malformed `canister_removed` wording | Resolved | `data/gear/odm-gear.yaml` now points directly to `gas_roll.dice` and reads grammatically. |
| Opus Major 1, two Talent baselines for the reference dodge | Resolved | Batch 2b, ADR-0014, Chapters 2 to 4, `squadmates.yaml`, and the later-chapter constraints all name the no-Talent baseline. |
| Opus Major 2, horse dodge dominated by ODM Gear | Resolved | Horse ratings now match ODM Gear at every Funding in prose and `standard-issue.yaml`; the examples use rating 2 horses. |
| Opus Minor 3, horse Break Attention compared a bare Position | Resolved | Chapter 4, `items.yaml`, and `horses.yaml` compare both Positions relative to the Focus Titan recorded with the horse. |
| Opus Minor 4, early Gas Roll edges and possible duplicate death roll | Resolved | Chapter 1 adds the already-made exception. Chapter 4 prose and YAML test whether the round's Gas Roll has already been made before handover or death. |
| Opus Minor 5, full issue rewarded leaving a Jam unrepaired | Resolved | Full issue replaces worn items as well as Jammed or lame ones. The interim issue stays narrow. |
| Opus Minor 6, stale ADR-0014 body and Veteran parity wording | Resolved | ADR-0014 states all three builds in its body. Chapter 4 names the Veteran's ODM Gear and horse parity with the Rookie. |
| Opus Minor 7, Chapter 2 provenance and broad Talent wording | Resolved | `sure-seat.decided` includes OQ-71. Chapter 2 and `squadmates.yaml` use the narrowed four-roll Talent wording. |
| Opus Minor 8, wording, figures, and bookkeeping | Partly resolved | The malformed sentence, pass wording, Jam premise, rating 3 figures, chapter introduction, and decision-file bookkeeping are fixed. Finding 1 covers the remaining gas figure and progress-row records. |

## Finding

### 1. Minor. Chapter 4's coordination records retain a stale gas figure and previous-Major count

**Location:** Chapter 4, Gear. `docs/rules/DECISIONS-2026-09-14.md`, OQ-73 item 6, line 914; `docs/rules/04-gear.md`, section 4.3, line 191; `docs/rules/PROGRESS.md`, Chapter 4 row, line 16.

**Problem:** OQ-73 says the reference Rookie with a roll needing 2 successes gets a median of 6 rounds and a 10th to 90th percentile of 3 to 12. OQ-72 then raised the reference Rookie's ODM Gear from rating 1 to rating 2. Chapter 4 correctly reports the remeasured rating 2 result as median 7, mean 7.23, and 3 to 12, but OQ-73 has no revision line. The progress row also still reports the two round 1 Majors as open even though batch 2b decided them and the current files apply both fixes.

**Scenario:** A maintainer checks conformance against OQ-73 and changes Chapter 4's correct median back to 6. Another maintainer reads the progress row and reopens OQ-91 and OQ-92 even though both are marked Decided and their fixes are present.

**Fix options:**

1. Add an OQ-73 revision line stating that OQ-72 changes the reference-Rookie, 2-success median from 6 to 7, then update the Chapter 4 progress row after this conformance round closes.
2. Replace the OQ-73 figure in place with median 7 and record this round's final Major count in `PROGRESS.md`.

## Batch 2 and batch 2b conformance by chapter

| Chapter | Result |
|---|---|
| Chapter 1, Core Rules | Applied. The act and advance-spend wording, Gas Roll exception, and decision provenance agree with the decisions and YAML. |
| Chapter 2, Character Creation | Applied. The Rookie, Veteran, Health 3 report, Sure Seat, no-Talent baseline, and Squadmate provenance agree. |
| Chapter 3, Harm and Mind | Applied. The reference builds, Flier report, Health 2 to 6 figures, tracked acts, Death Roll classification, and Down glossary wording agree. |
| Chapter 4, Gear | Applied mechanically in prose and YAML. Finding 1 is limited to decision and progress records. |

## ADR-0014 gas check

I ran seeded Python simulations from `/private/tmp`, outside the repository. With 1,000,000 full Gas Rating 3 canisters per case, two dice produced mean 9.2446 rounds, median 8, 10th to 90th percentile 4 to 16, 13.4654% empty by round 4, and 32.2900% by round 6. Three dice produced mean 6.3304, median 6, 10th to 90th percentile 3 to 11, 32.3269% empty by round 4, and 59.7551% by round 6. ADR-0014's gas target remains reachable.

I also ran 200,000 reference-Rookie canisters with Agility 3, ODM Gear 2, no dodge Talent, Stress 1, and Push when short. A roll needing 1 success produced mean 8.2483, median 7, 10th to 90th percentile 4 to 14, with Pushes on 26.76% of rounds. A roll needing 2 produced mean 7.2461, median 7, 3 to 12, with Pushes on 60.27%. This confirms Chapter 4's value and the stale OQ-73 value in finding 1.

## Findings by chapter

- Chapter 1, Core Rules: 0 Critical, 0 Major, 0 Minor.
- Chapter 2, Character Creation: 0 Critical, 0 Major, 0 Minor.
- Chapter 3, Harm and Mind: 0 Critical, 0 Major, 0 Minor.
- Chapter 4, Gear: 0 Critical, 0 Major, 1 Minor.

## Counts

- Critical: 0
- Major: 0
- Minor: 1
