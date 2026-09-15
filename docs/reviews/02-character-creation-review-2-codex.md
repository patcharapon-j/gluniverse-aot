# Chapter 2, Character Creation: review round 2

Reviewed `docs/rules/02-character-creation.md`, every YAML file in `data/character/`, the Chapter 2 additions and reference edits in `data/core/`, OQ-19 to OQ-35, `CONTEXT.md`, every ADR, Chapter 1, and both round-one Chapter 2 reviews. I did not read the parallel round-two review.

I ran three Python simulations from `/private/tmp`, outside the repository. Two built 500,000 and 1,000,000 Cadets from the current Lifepath tables. The third ran 1,000,000 representative squad-field-exercise rolls. A Ruby integrity pass checked the YAML because Python's environment had no YAML module.

## Verdict

Round one fixed most of the chapter. No Critical finding remains. The new swap preserves the attribute total, the Enlistment point is rolled, Relentless no longer moves a solo strike, the Exam no longer calls an unwritten harm table, Squadmates pay field resources, and promotion preserves current state.

Four Major problems remain. The Graduation swap does not make the quoted attribute distribution independent of Specialty strategy. Two `own_state` Drives can still trigger without the soldier acting. OQ-27 still contradicts ADR-0003's attribute-alone branch, although OQ-35 logs the conflict. Finally, the Exam's roll order lets a Cadet who has already rolled absorb later Covering Stress just before the reset.

## Round-one Critical and Major verification

### Codex round 1

| Round-one finding | Status | Verification |
|---|---|---|
| 1. Relentless breaks both solo Nape targets | Resolved | Relentless now adds 1 Opening after a failed Nape strike. It neither changes that strike nor grants a second Push. The prepared-Squad effect still needs Chapter 5 and 6 simulation, as OQ-28 records. |
| 2. Choosing Enlistment changes the attribute distribution | Resolved | The attribute point always comes from the rolled row. The player may choose only the Drive. |
| 3. Merit YAML has no result above 3 successes | Resolved | `successes_min: 3` and `successes_max: null` cover every higher result. |
| 4. Permission-changing Talents trigger too late | Resolved | OQ-34 and `trigger_timing.declare` apply those Talents before requirements, targets, pools, and costs are checked. All affected Talent triggers use the declaration form. |
| 5. Exam cleanup can erase lasting harm | Resolved | Exam Stress Responses now cost Merit and never call Chapter 3. The Stress row only returns Stress to 0. |
| 6. OQ-27 omits the general attribute-alone fallback | Partly | `rule-named-value` now reaches the attribute alone for a value authored by another rule. An unlisted consequential action still gets no roll or effect, contrary to ADR-0003 item 9. See finding 3. |
| 7. Squadmates ignore gas, blades, and carrying | Resolved | Squadmates now receive and track Standard Issue, Gas Rating, Blade Sets, items, gear wear, and Overloaded as player characters do. Their attributes total 18. |
| 8. Promotion heals and resupplies | Resolved | Promotion preserves Health lost and current gear and recalculates nothing. Its four added Talent levels come from rolled Lifepath sources. |

### Opus round 1

| Round-one finding | Status | Verification |
|---|---|---|
| 1. Squadmate Specialties grant exclusive actions | Resolved | A Squadmate can take every action a player character can, use its options, and use section 2.9. |
| 2. Drives trigger on world states rather than acts | Partly | Every trigger now begins "When I", and the comrade, Titan Body Part, Stress, Grief, and injury states are gone. Attention and On Body can still be imposed without an act by the soldier. See finding 2. |
| 3. The key-attribute floor rewards the lowest Specialty | Resolved | The swap and paid floor preserve the 18-point total. A new distribution problem remains, but the two-point exploit is gone. See finding 1. |
| 4. Choosing Enlistment moves the distribution | Resolved | The Enlistment attribute is rolled independently of the chosen Drive. |
| 5. Squadmates and promotion out-build new soldiers | Resolved | Templates total 18, and promotion draws exactly four further Talent levels from the Origin and Training Year tables. |
| 6. Exam Pushes are free and Chapter 3 results undefined | Partly | A Stress Response has a closed Merit cost and no Chapter 3 result. The new Covering and roll-order combination can still transfer Stress to a Cadet for whom it has no remaining cost. See finding 4. |
| 7. Direct Catalog use has no missing-gear rule | Resolved | `gear_requirement` now applies to every direct, indirect, player-character, and Squadmate use. |
| 8. Relentless breaks Nape calibration | Resolved | The second Push is gone. The replacement affects only the following striker through an Opening. |
| 9. Lifepath forces dormant Talent levels | Resolved | Every Origin, event, and Specialty list offers at least one Talent that names a non-dormant, non-reserved entry. The integrity pass confirmed all 48 rows and nine lists. |
| 10. Named-comrade lifecycle has holes | Resolved | Promotion no longer ends the relationship, and every Drive recorded after formation names a living comrade immediately. |

## Findings

### 1. Major. The Graduation swap does not make the key-attribute odds independent of Specialty choice

**Location:** section 2.2, lines 65 to 76; `data/character/attributes.yaml`, `creation.graduation`; OQ-19.

**Problem:** The swap happens only when the chosen key attribute is below 4. A player who chooses an attribute currently rated 2 or 3 swaps the soldier's highest rating into it. A player who chooses an attribute already rated 4 keeps that 4 even when another attribute is 5. Both choices preserve 18 points, but they produce different specialist and generalist profiles.

The 500,000-Cadet Python run used the current D66 rows, current performance pairs, and random legal overflow placement. Choosing a highest or lowest pre-Graduation attribute as key produced key ratings 4 / 5 / 6 at **63.46 / 34.39 / 2.15%**. Choosing an attribute rated 4 whenever one existed produced **77.71 / 21.18 / 1.11%**. The share at 5 or 6 changes from 36.54% to 22.29%, a **14.25-point swing**. OQ-19's statement that the figures hold whichever Specialty the player chooses is false.

**Scenario:** A Cadet has Strength 5, Perception 4, and Instinct 2. Slayer keeps Strength 5. Tactician swaps the 5 into Instinct. Hunter keeps Perception 4 and leaves Strength 5 as a full-strength non-key attribute. Since every soldier rolls a full attribute without the matching Specialty, Hunter is a materially different generalist choice that OQ-19's model omits.

**Fix options:**

1. Always swap the key attribute with the highest other attribute when it is not already tied for highest.
2. Keep the rule, but simulate declared player strategies and rewrite OQ-19 and ADR-0014's creation comparison around the resulting specialist and generalist profiles.

### 2. Major. `own_state` still lets two Drives fire when the soldier did nothing to create the state

**Location:** section 2.5, lines 218 to 252; `data/character/enlistment.yaml`, `drive_rules.trigger_tests.own_state`, `prove-them-wrong`, and `shield-the-walls`; OQ-23.

**Problem:** OQ-23 says an `own_state` represents where the soldier put themselves. The rules do not require that provenance. A Focus Titan can put Attention on the nearest soldier through its Attention Ladder. A Titan can also put a soldier On Body by Grabbing them. In both cases the state test passes even if the soldier has taken no relevant move or action. This retains the round-one conflict with the glossary's "while acting on it", although the narrower provisional choice in OQ-23 logs it and keeps it below Critical.

**Scenario:** Hale stands In Reach and takes no action related to Shield the Walls. Another soldier moves away. The Titan's next card selects Hale as the nearest person, so Hale holds Attention. A Fear Roll result is about to apply, and Shield the Walls now cancels it even though the Titan, not Hale, created the trigger.

**Fix options:**

1. Require `own_state` to record that the soldier entered or created the state through their own move, action, or Reaction since their most recent turn began.
2. Rewrite Shield the Walls around Draw Attention and Prove Them Wrong around a move into Blind Spot or On Body.
3. Amend the glossary to say a Drive works while its trigger is met, and accept that some Drives reward exposure rather than action.

### 3. Major. OQ-27 still contradicts ADR-0003's fallback for ordinary uncatalogued actions

**Location:** section 2.9, lines 365 to 389; `data/character/action-catalog.yaml`, `uncatalogued_actions`; ADR-0003 item 9; OQ-27 and OQ-35.

**Problem:** ADR-0003 requires an action outside the Catalog to use the closest Catalog action or the attribute alone. The current procedure gives no roll and no effect when the player's intended change is not already a tracked value. `rule-named-value` helps only after another authored rule has anticipated the obstacle and named an attribute. It does not supply the ADR's fallback for an uncatalogued action. OQ-35 accurately logs the contradiction, so this is not Critical, but provisional choice (c) is not sound while the ADR remains unchanged.

**Scenario:** A beam collapses during an evacuation. A soldier braces it so civilians can escape. No current tracked value names the beam or civilians. The action must have no mechanical effect, even though Strength alone is the exact fallback ADR-0003 promises.

**Fix options:**

1. Adopt OQ-35(a) and amend ADR-0003 to limit mechanical actions to values an authored rule creates.
2. Add a general obstacle entry whose creating scene rule fixes the attribute, stakes, and tracked value before play.

### 4. Major. Exam roll order lets a Cadet dump Covering Stress after their final roll

**Location:** section 2.4, lines 192 to 212; `data/character/graduation-exam.yaml`, `roll_order_within_a_trial` and the squad field exercise's `cover`; OQ-22 and OQ-30.

**Problem:** Cadets roll sequentially in a player-chosen order. Any other Cadet may Cover, with no per-Cadet limit. After the first Cadet rolls in the squad field exercise, that Cadet can Cover every later Push. The gained Stress has no mechanical consequence because the Cadet has no roll left and the Exam resets all Stress immediately afterwards. A later Cadet can Cover the first roll, so only that one later Cadet ever has to carry Covering Stress into a roll.

In 1,000,000 Python trials of a representative field-exercise pool at Stress 0, six base dice plus one Gear Die, a Push after any result below the required 2 successes produced **68.59% success, 11.18% Stress Responses, and 0.574 mean Merit** when uncovered. A covered Push produced **64.15% success, 0% Stress Responses, and 0.641 mean Merit**. A Cadet who already rolled can grant that better Merit expectation to every later Cadet at no remaining cost to themselves.

**Scenario:** Aldous rolls first. Bertholdt Covers Aldous if needed and takes 1 Stress. Aldous then Covers the Pushes of Bertholdt, Carla, and Dieter. Aldous can finish at Stress 3, but he makes no more rolls and the reset erases it. Three Push costs have been parked on a finished character.

**Fix options:**

1. Only a Cadet who has not yet rolled in that Trial may Cover.
2. Give each Cadet one Cover for the entire Trial and resolve all gained Stress before any Cadet rolls, using a declared order.
3. Make Covering in the Exam cost the Covering Cadet 1 Merit if they have already made their roll in that Trial.

### 5. Minor. Chapter 1 still describes `dice-pool.yaml` as listing only the Death Roll's exceptions

**Location:** `docs/rules/01-core-rules.md`, line 67; Chapter 2, lines 27 to 32; `data/core/dice-pool.yaml`, `roll_exceptions`.

**Problem:** The file now has Death Roll and performance-roll rows. Chapter 2 correctly explains the extension, but Chapter 1 still tells the reader that the file lists "the Death Roll's exceptions".

**Scenario:** A reader audits the source-of-truth statement in Chapter 1 and reasonably treats the performance row as an undocumented addition rather than the second member of an extensible list.

**Fix options:**

1. Change the sentence to "It also lists rolls with exceptions, such as the Death Roll."

### 6. Minor. OQ-28 says eight Talents need simulation and then names nine

**Location:** section 2.7, line 303.

**Problem:** The list names Relentless, Light Trigger, Saddle Dodge, Wide Awareness, Shoulder the Load, Sure Hands, Hard to Kill, Pry Loose, and Unshaken Command. That is nine. OQ-28 separates Saddle Dodge into its own note, which appears to be the source of the count mismatch.

**Scenario:** A later simulation checklist copies the stated count and closes after eight cases, leaving one Talent untested.

**Fix options:**

1. Change "Eight" to "Nine".
2. Keep "Eight" and move Saddle Dodge out of the sentence, matching OQ-28's structure.

## Judgment on OQ-19 to OQ-35

| OQ | Judgment | Reason |
|---|---|---|
| OQ-19 | Unsound in part | The total-preserving swap fixes the old exploit. Its claimed strategy-independent distribution does not hold. Finding 1. |
| OQ-20 | Sound | Five levels are reachable, the fallback is closed, and no current row forces a dormant choice. |
| OQ-21 | Sound | The current simulation produced 6.28% Top 10 and 15.45% at Merit 5 or more. The known Agility skew is logged. |
| OQ-22 | Unsound in part | The closed Exam Stress Response is good. Covering and chosen roll order create a new cost-transfer exploit, and the quoted "best policy" did not include Covering. Finding 4. |
| OQ-23 | Unsound in part | Act-based tests and named-comrade timing are fixed. `own_state` still has no test that the soldier created the state. Finding 2. |
| OQ-24 | Sound | The formulas are complete, rounded, and consistent with the low-Health design. |
| OQ-25 | Sound for Chapter 2 | The pools cover the current Titan Engagement jobs without assigning exclusive permissions. Later chapters still own requirements and effects. |
| OQ-26 | Sound | `option` and `fixed-roll` keep rule Talent references in the Catalog without adding Talent dice to non-attribute rolls. |
| OQ-27 | Unsound | The procedure is closed, but its no-value branch still does not implement ADR-0003 item 9. Finding 3. |
| OQ-28 | Sound with a pending test | Replacing Relentless's second Push with an extra Opening protects the two solo targets and fits ADR-0010. Its prepared-Squad effect cannot be tested until Chapters 5 and 6 define the encounter. |
| OQ-29 | Sound | Eighteen-point templates, universal action permission, full gear tracking, and no Covering solve the round-one failures. |
| OQ-30 | Unsound in the Exam | Wing direction is closed and sound. Applying free choice of order to sequential Exam rolls enables finding 4. |
| OQ-31 | Sound | Promotion preserves current state and uses the same rolled Talent sources as creation. |
| OQ-32 | Sound | The year gate makes every Origin roll canon-compatible, and Canon Tie effects remain properly deferred. |
| OQ-33 | Sound | Dormant entries are marked as changeable by their future owners, and every creation row offers a currently supported alternative. |
| OQ-34 | Sound | Declaration timing is explicit and consistently used by permission, target, attribute, gear, and cost changes. |
| OQ-35 | Unsound until the ADR changes | Choice (c) is coherent as a design policy but is not the policy ADR-0003 currently states. Finding 3. |

## Chapter 1 edit check

Chapter 2 changes no settled Chapter 1 rule. The performance-roll row uses OQ-03's existing exception hook. The Graduation Exam Stress reduction uses section 1.6's existing later-row hook and now changes only Stress. The attribute and gear component references, Help exclusions, and named Stress rows agree with Chapter 1. Chapter 1's summary sentence is stale, as finding 5 notes.

## Data, scope, and terminology checks

All five D66 tables cover 11 to 66 exactly once. Every Talent, Specialty, Catalog entry, Squadmate template, and cross-file ID resolves. Specialty reverse lists agree, template Health and Resolve values match their attributes, and every Origin, event, and Specialty list offers a non-dormant, non-reserved Talent. The worked Mira example matches the current rows and formulas.

No Chapter 2 rule assigns a player character a Phase 2 XP, Downtime, Rank, Requisition, Expedition, Chase, Canon Clock, or Operation Frame procedure. Dormant rolls explicitly leave their attributes open to their future rules. Squadmate XP and Downtime Actions, Wings, Standard Issue, and Rank-based Squad size are forward references rather than drafted procedures.

I found no `_Avoid_` glossary term used as a game term. The two remaining design-contract tensions are logged: the glossary issue with `own_state` under OQ-23 and the ADR issue with the no-effect fallback under OQ-35. The latter still needs an ADR decision rather than a wording defense.
