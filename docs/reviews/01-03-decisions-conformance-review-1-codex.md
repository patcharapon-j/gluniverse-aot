# Chapters 1 to 3 decisions conformance review, round 1

Reviewed `docs/rules/01-core-rules.md`, `docs/rules/02-character-creation.md`, `docs/rules/03-harm-and-mind.md`, every YAML file in `data/core/`, `data/character/`, `data/harm/`, and `data/mind/`, `CONTEXT.md`, every ADR, `docs/rules/OPEN-QUESTIONS.md`, `docs/rules/DECISIONS-2026-09-14.md`, and the five named round-3 reviews. I did not read the parallel `01-03-decisions-conformance-review-1.md`.

All 57 open questions are marked Decided. No `PROVISIONAL:` or Unresolved block remains in the three chapters or their YAML. All 27 YAML files parse. Catalog, Talent, Critical Injury cap, range, and D66 coverage checks passed.

## Verdict

No Critical or Major finding remains. The decisions and four ADR amendments agree with the glossary, the three chapters, and the YAML. The Health-box rule reaches every required location, including Squadmate fields and promotion state. Two Minor drafting gaps remain.

The Health-box check ran 300,000 Python trials per Health value in `/private/tmp/wof-conformance-codex.29FevJ`. A first Critical Injury put the soldier Down 10.65% to 10.71% of the time. Mean injuries before Down were 1.893 at Health 2, 2.652 at Health 3, 3.255 at Health 4, and 3.699 at Health 5. At Health 4, cumulative Down was 39.62% by the third injury and 100% by the fourth. At Health 5 it was 39.66% by the third and 55.63% by the fourth. These reproduce the decision record and leave the ADR-0014 Grab targets reachable.

## Findings

### 1. Minor. Chapter 3's treatment sentences omit the over-cap exception and can appear to restore a box that current Health does not regain

**Location:** Chapter 3, Harm and Mind, sections 3.1, 3.2, 3.3, 3.5, and 3.6, especially lines 98, 140, 191, 268, 313, and 346; `data/harm/health.yaml`, `restoring.treated-or-healed`.

**Problem:** Section 3.1 and the YAML correctly define boxes crossed off as `min(untreated Critical Injuries, Health)`. They say treatment gives no box back while the soldier still has at least Health untreated injuries. The later treatment, aftermath, Down-ending, and healing sentences instead say that the named injury gives back "its box" without repeating that exception. That assigns a box to an injury even when extra injuries cross off none, and gives a reader two apparent answers about whether current Health rises.

**Scenario:** A Health 2 soldier holds three untreated Critical Injuries and is Down. A successful Treat Injury leaves two untreated injuries. The formula and source-of-truth row leave both boxes crossed off and current Health at 0. The section 3.5 sentence can be read to give back the treated injury's box and raise current Health to 1.

**Fix options:**

1. In each shorthand sentence, say that treatment or healing recalculates boxes crossed off, and current Health rises only when fewer than Health untreated injuries remain.
2. Add the exception once to section 3.5's Treat use and have the other passages point there.

### 2. Minor. Chapter 2 never initializes a new Squadmate's Health lost or Down field

**Location:** Chapter 2, Character Creation, section 2.10, *The stat block* and *The starting Squad*, lines 408 to 423 and 456 to 460; `data/character/squadmates.yaml`, `starting_squad.creation`, lines 98 to 105.

**Problem:** The revised stat block records `health_lost` and `down`, but the starting-Squad procedure initializes neither. The YAML initializes Stress, Scars, Grief, and Critical Injuries only. New player characters explicitly start at Health lost 0 and not Down. The equivalent Squadmate values are left implicit, which is a small data gap in the Health-box application.

**Scenario:** A sheet importer creates a starting Squadmate from its template. It has maximum Health and no Critical Injuries, but `health_lost` and `down` are null. The current-Health formula cannot produce a value without inventing a default outside the source data.

**Fix options:**

1. Add `health_lost: 0` and `down: false` to `starting_squad.creation`, and state the same defaults in *The starting Squad*.
2. Add a `starting_values` map to `stat_block` and make both starting and later-created Squadmates use it.

## Findings by chapter

- **Chapter 1, Core Rules:** no open findings. OQ-03, OQ-05, OQ-17, OQ-18, OQ-25, OQ-35, and their YAML impacts are applied.
- **Chapter 2, Character Creation:** one Health-box initialization gap, finding 2. The Exam, Campaign Year, Drive, mounted dodge, Sure Seat, tracked-value, sheet-field, and promotion decisions are otherwise applied in prose and YAML.
- **Chapter 3, Harm and Mind:** one treatment-wording gap, finding 1. Health boxes, Down, revive, healing, patient scope, aftermath limits, rescue structures, Grief order, and the engagement-end batch are otherwise applied in prose and YAML.

## Round-3 Major findings

| Earlier review | Major finding | Status this round | Evidence |
|---|---|---|---|
| `01-core-rules-review-3.md` | Help allowed a turn spent in advance to supply an action | **Resolved** | Section 1.8 and `bonus-dice-sources.yaml` require an unspent action and read the round-start spent state. |
| `01-core-rules-review-3.md` | Help and Cover lacked the state/result forbid hook | **Resolved** | Section 1.9 defines the shared hook; Help, Cover, Down, Exam, and Fear rows use it. |
| `02-character-creation-review-3.md` | Concentrated Exam Help broke parity | **Resolved** | Trial 3 uses fixed cycle Help, exactly one helper per Cadet, and forbids all other Help. The design note records the concentrated-Help result. |
| `02-character-creation-review-3.md` | Actions with no tracked value contradicted ADR-0003 | **Resolved** | ADR-0003 items 9 and 12 are amended, and sections 1.3 and 2.9 match the tracked-value procedure. |
| `02-character-creation-review-3-codex.md` | OQ-35 contradicted ADR-0003 | **Resolved** | Same amendment and chapter changes as above. |
| `02-character-creation-review-3-codex.md` | Exam calibration omitted targeted Help | **Resolved** | Same fixed cycle as above. |
| `02-character-creation-review-3-codex.md` | Several simultaneous promotions had no retry procedure | **Resolved** | Section 2.10 and `squadmates.yaml` make losers choose again from untaken Squadmates until each has one or uses the Lifepath branch. |
| `03-harm-and-mind-review-3.md` | Aftermath treatment stacked one roll per nearby soldier | **Resolved** | Section 3.5 and `treat-injury.yaml` cap aftermath treatment at one roll per patient and one per treater. |
| `03-harm-and-mind-review-3.md` | Section 3.7 required the rescue regime that failed OQ-50's six-cell band | **Resolved** | Section 3.7 permits both rescue structures and quotes all six cells for one example of each. |
| `03-harm-and-mind-review-3.md` | The end procedure could not finish contested promotions | **Resolved** | Chapter 2's contest now retries losing choices, and Chapter 3 sends the full batch to it at step 9. |
| `03-harm-and-mind-review-3-codex.md` | Contested promotions and their timing were incomplete | **Resolved** | Promotion waits for the enclosing procedure and resolves the full batch with retries. |
| `03-harm-and-mind-review-3-codex.md` | Care windows restricted rollers but not patients | **Resolved** | Section 3.5 and `treat-injury.yaml` require every patient to be alive and in the window's scope. |
| `03-harm-and-mind-review-3-codex.md` | Outside-Engagement Grief had no order against the death's Fear Rolls | **Resolved** | Section 3.14, `grief.yaml`, and `fear-rolls.yaml` apply Grief after every Fear Roll caused by that death. |

## Decision, ADR, and glossary conformance

- ADR-0003's amended tracked-value rule and forbid hook match Chapters 1 to 3 and their data.
- ADR-0005's Health boxes match the Health, Down, Critical Injury, Treat Injury, revive, healing, sheet, example, and Squadmate rules, apart from finding 1's shorthand.
- ADR-0014's amended reference attributes match the Squadmate templates and the revised dodge assumptions.
- ADR-0015's mounted dodge uses the horse for Gear Dice and wear and does not raise the Gas Roll.
- The glossary's amended Gear Dice, Stress Dice, Covering, Help, Reaction, Squadmate, Graduation Exam, Training Year, Drive, Health, Resolve, Opening, Critical Injury, Down, Grief, Grabbed, Gas Roll, and Campaign Year entries agree with the decisions and chapters.
- No decided choice remains as a contradictory `PROVISIONAL:` block. No decision contradicts an unamended ADR or another drafted chapter.

## Counts

- Critical: 0
- Major: 0
- Minor: 2
