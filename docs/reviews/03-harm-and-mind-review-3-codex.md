# Chapter 3, Harm and Mind: review round 3

Reviewed `docs/rules/03-harm-and-mind.md`, all YAML in `data/harm/` and `data/mind/`, OQ-39 to OQ-57, both round-2 reviews, `CONTEXT.md`, every ADR, Chapters 1 and 2, and their data. I did not read the parallel round-3 review.

All 27 YAML files across `data/core/`, `data/character/`, `data/harm/`, and `data/mind/` parse. I checked table coverage, caps, effect ids, Action Catalog references, prose against YAML, dependency rules, and the Grab target. Probability work ran in `/private/tmp/wof-ch3-r3.uGPMaF`, outside the repository, with 800,000 trials per reported cell.

## Verdict

No Critical finding remains. Three Major and two Minor findings are open.

The mechanical repairs from round 2 mostly landed cleanly. Down timing is now closed. Survivor's Guilt has an explicit order. The Grab discussion now uses a Toughness-1 hand and gives Chapter 5 the right warning about rescue actions, Stress, and Grief. The aftermath roll removes the old 38 to 51 point incentive to delay a kill, though Chapter 5 still needs the recorded full-fight simulator case.

The chapter is not final while OQ-38 remains open. Its end procedure can still reach a contested promotion with no next step. Two further gaps appeared in the full pass: a care window limits who may roll but not whom they may treat, and an outside-Engagement death does not order Grief against its Fear Roll.

## Round-2 Critical and Major verification

Neither round-2 review had a Critical finding.

### Codex round 2

1. **Not resolved. Several promotions at once.** Section 3.16 moved the batch from step 8 to step 9 but still sends it to Chapter 2's incomplete procedure. OQ-38 remains `Unresolved Major`. Finding 1.
2. **Resolved. Ending Down restored a spent future turn.** Section 3.3 and `down.yaml` now preserve every turn or action already spent, while allowing an unplayed turn to remain available if Down ends before it begins.
3. **Resolved. Survivor's Guilt had no order against the same death's Fear Roll.** Section 3.13 and `scars.yaml` now put the Stress after that Fear Roll, or at the death if no roll is made.

### Opus round 2

1. **Resolved. End-of-fight Death Rolls rewarded stalling.** OQ-57 adds one aftermath roll per nearby soldier before those Death Rolls. My simulation, using a Strength 3 patient and one Push on treatment, leaves a residual choice rather than a dominant answer. With an untrained Wits 2 treater, killing now produced 23.221% patient death and delaying one round before the aftermath produced 7.872%, a 15.349-point gain. With a Rookie Medic, the figures were 6.491% and 0.772%, a 5.719-point gain. The extra round now buys a second attempt but also another round of Titan cards. Chapter 5 can evaluate that trade in OQ-57's full-fight simulator; Chapter 3 no longer guarantees that delay is best.
2. **Resolved. Grab lever sizes came from the wrong hand regime.** Section 3.7 now uses the legal hand thresholds of 1 or 2 successes and states that Chapter 5 must leave about one rescue action per comrade. An independent approximation gave 33.270% death with two rescuers, one action each, H = 2, and witness Fear Rolls, against 7.103% without Fear Rolls. The lone two-turn case was 59.404%. Both ADR-0014 targets remain reachable once Chapter 5 adds lift, reach, and devour.
3. **Resolved. Down before an unplayed turn had two readings.** Section 3.3 and `down.yaml` now say that becoming Down takes nothing from a turn that has not begun. If Down ends first, that turn retains whatever move and action were not already spent.

## Findings

### 1. Major. Step 9 still cannot finish contested promotions, and its batch timing conflicts with the closed Chapter 2 rule

**Location:** section 3.4, line 249; section 3.16, lines 580 to 585; Chapter 2, section 2.10, lines 469 to 479; `data/character/squadmates.yaml`, `promotion`; OQ-38.

**Problem:** Chapter 3 batches every death and Retirement at step 9, but Chapter 2 resolves only the winner when several players choose one Squadmate. It never tells a losing player to choose again or take the no-Squadmate branch. The procedure still has no next step.

The batch also changes a closed timing rule. Chapter 3 declares its end steps outside the Titan Engagement and delays every promotion to step 9. Chapter 2 says a death outside a Titan Engagement causes promotion immediately. A player character who fails the step-6 Death Roll therefore has two incompatible promotion times. OQ-38 and OQ-54 log the conflict, so it is not a hidden Critical contradiction, but a logged gap does not make the procedure executable.

**Scenario:** Mina dies during the fight. Oskar fails a Death Roll at step 6. At step 9 both players choose Mila, the only suitable surviving Squadmate. Mina wins the D6. No rule tells Oskar what to do next. Before that, Chapter 2 told Oskar to promote immediately at step 6 while Chapter 3 told him to wait.

**Fix options:**

1. Reopen Chapter 2 and adopt OQ-38 option (c) for every promotion batch. Losing players choose again from untaken Squadmates until each has a replacement or uses the no-Squadmate branch. Define deaths in Chapter 3's end steps as part of that end's batch.
2. If Chapter 2 cannot change, put the complete retry procedure and a specific timing override in Chapter 3, then record that Chapter 3 supersedes Chapter 2 for its end steps. This leaves the same problem for simultaneous deaths outside this procedure.

### 2. Major. A care window restricts rollers to its scope but lets them treat any living Squad member

**Location:** section 3.5, lines 270 to 295; `data/harm/treat-injury.yaml`, `patients`, `care_windows.held`, and `care_windows.who_rolls`; OQ-44.

**Problem:** Each care window defines its scope, and only a soldier in that scope may roll. Neither prose nor YAML requires the patient to be in the scope. The general patient rule is any living soldier in the Squad. The outside-harm window narrows eligible injuries, but the engagement-end and day windows do not. A present roller can therefore treat or revive an absent patient, undoing the round-2 attempt to prevent remote care.

This is not a Position question. Care windows intentionally have no Position requirement. It is a missing participant test.

**Scenario:** Mila returns from a Titan Engagement while Hale remained at headquarters with an untreated Critical Injury. Mila is in the engagement-end window's scope and Hale is a living Squadmate. The current `who_rolls` and `patients` rules let Mila treat Hale during that window. The same rule lets a medic on one Expedition treat a patient on another when a day passes.

**Fix options:**

1. Require every care-window patient to be in that window's scope. Keep the outside-harm restriction to injuries and Down states caused by that event.
2. Give each window a separate `patients` field. For all current windows, make it the living soldiers in scope, with the existing event-harm restriction on `outside-harm`.

### 3. Major. An outside-Engagement death does not order Grief against the Fear Roll it causes

**Location:** section 3.12, lines 458 to 465; section 3.14, lines 537 to 547; `data/mind/fear-rolls.yaml`, `limits.timing` and `roll.resolve_used`; `data/mind/grief.yaml`, `gaining.timing`; OQ-52.

**Problem:** Outside a Titan Engagement, a later rule can name witnesses for `comrade-dies`. The Fear Roll happens as soon as the death is fully resolved. The same death gives Grief "at once", lowering Resolve by 1. Nothing states which happens first. OQ-52's reasoning says a death should not worsen the Fear Roll it causes, and round 2 added that order for Survivor's Guilt, but the actual Grief rule does not encode it outside a fight.

At Stress 2 and Resolve 3, rolling before Grief costs an action or turn on 3 of 6 results, 50.0%. Applying Grief first lowers Resolve to 2 and raises that to 4 of 6, 66.7%. It also introduces a 1-in-6 chance of losing the whole turn.

**Scenario:** During a Chase, Oskar dies and the Chase rule names Mila as a witness. Mila has Stress 2 and Resolve 3. On a D6 result of 3, she gets Rattled if the Fear Roll precedes Grief, but Hesitates and loses her rescue action if Grief applies first.

**Fix options:**

1. State universally that Grief from a death applies after every Fear Roll caused by that death. Put the same `applies_after` order in `grief.yaml`.
2. Require every outside-Engagement rule that creates a death witness to resolve the Fear Rolls before applying Grief. This spreads one Chapter 3 rule across later procedures and is easier to miss.

### 4. Minor. Pay It Forward still cannot shrug off the first Grab Fear Roll

**Location:** section 3.12, lines 453 to 465; `data/mind/fear-rolls.yaml`, `comrade-grabbed`; `data/character/enlistment.yaml`, `pay-it-forward`; OQ-49.

**Problem:** The Fear Roll follows the resolved Grab immediately. Pay It Forward requires an act on a comrade who was already Grabbed or Down since the start of the witness's most recent turn. No such act can precede the first Fear Roll caused by that Grab. The mismatch is logged but remains a poor fit between the Drive's promise and the rescue moment.

**Scenario:** Mila sees Oskar become Grabbed. Her Drive is Pay It Forward, but she has not yet acted on him while he was Grabbed. Hesitate spends the action she intended to use to free him, and the Drive cannot answer it.

**Fix options:**

1. When Chapter 2 next opens, let declaring the next act to free, treat, or lift the newly Grabbed comrade meet the Drive for that Fear Roll.
2. Rewrite the Drive so it promises steadiness only after the soldier has already begun a rescue.

### 5. Minor. The glossary still promises that worsening cannot produce a lighter injury

**Location:** `CONTEXT.md`, `Critical Injury`; section 3.2, lines 116 to 128; `data/harm/critical-injuries.yaml`, `worsening.meaning`; OQ-42.

**Problem:** The glossary says a second injury at the same Injury Location "lands on a worse result". The rule adds +2 but explicitly does not compare the new row with the old one. A later injury can be lighter. OQ-42 logs the intended abstraction, so this is not Critical, but the glossary still states a guarantee the rules reject.

**Scenario:** Oskar holds Torn Artery in his arm. His next arm roll is 2, plus 2 for worsening, and produces Wrenched Shoulder. The second injury is lighter despite the glossary.

**Fix options:**

1. Change the glossary to say that a later injury to the same location is rolled with a worsening bonus.
2. Floor the new row above the worst injury that counts there, then retune every affected probability.

## Provisional decisions OQ-39 to OQ-57

| OQ | Judgment | Reason |
|---|---|---|
| OQ-39 | Sound | The direct-harm boundary now closes chain cases, and lift and devour remain Grab procedure steps. |
| OQ-40 | Sound | Revive and daily recovery give Health a complete field cycle without routine mid-fight healing. |
| OQ-41 | Sound | The D6 table is complete; no-side tracking is an explicit abstraction. |
| OQ-42 | Partly sound | The rows, cap, permanent state, and figures work. The glossary mismatch remains finding 5. |
| OQ-43 | Sound | Every limit has a start, expiry, and next state. The quoted Death Roll figures reproduce. |
| OQ-44 | Not sound | The scope constrains rollers and helpers but not patients. Finding 2. |
| OQ-45 | Sound | The round-2 turn conflicts are closed in prose and YAML. |
| OQ-46 | Sound | Turn spending follows Chapter 1, while the Reaction ban has its own fixed clock. |
| OQ-47 | Sound | Every total and repeated lasting row terminates, and every lasting result has an end. |
| OQ-48 | Sound | Rally has a closed target, range, success effect, and retry rule. |
| OQ-49 | Partly sound | The trigger list is closed, but Pay It Forward still misses the first Grab. Finding 4. |
| OQ-50 | Sound pending Chapter 5 tuning | The rows are rollable and the Grab sensitivity is now stated accurately. |
| OQ-51 | Sound | Scar gain, Survivor's Guilt, and Retirement timing terminate. |
| OQ-52 | Partly sound | Caps control Grief spikes, but an outside death has no order against its Fear Roll. Finding 3. |
| OQ-53 | Sound | Days match ADR-0009 and lethal injuries cannot heal before stabilization. |
| OQ-54 | Sound within Chapter 3 | The nine steps are ordered. Their promotion call still reaches OQ-38. Finding 1. |
| OQ-55 | Sound | Chapter 3 records its extension fields and promotion preserves them under Chapter 2's "everything" rule. |
| OQ-56 | Sound | Leavers keep turns and one end procedure; Help and Covering now have the same-Position bridge. |
| OQ-57 | Sound as an interim choice | It removes the guaranteed stalling answer. Chapter 5 must run the recorded full-fight test. |

OQ-38 remains unsound and is finding 1.

## Data, dependencies, scope, and terminology

The Injury Location D6 covers every face. Every Critical Injury table has continuous open-ended coverage. Each non-lethal cap names an existing non-lethal, non-instant row. Death Roll outcomes cover every nonnegative success count. Stress Response and Fear Roll tables cover every possible total. The Scar D66 table covers all 36 legal results once. All 67 effect references and all named Action Catalog entries resolve.

Prose and YAML agree apart from the gaps in findings 2 and 3. No glossary `_Avoid_` term appears. No Phase 2 procedure is drafted. The chapter contradicts no ADR. Its only unresolved changes or contacts with the closed dependency chapters are the promotion procedure in finding 1 and the logged Drive mismatch in finding 4.

Chapter 3 does not make ADR-0014's Grab target unreachable. The result remains sensitive enough that Chapter 5 must treat the lift, reach, number of rescue actions, and hand release threshold as one tuned procedure rather than independent choices.
