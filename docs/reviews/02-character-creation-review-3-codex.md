# Chapter 2, Character Creation: review round 3

Reviewed `docs/rules/02-character-creation.md`, every YAML file in `data/character/`, Chapter 1 and `data/core/`, `CONTEXT.md`, every ADR, OQ-19 to OQ-36, and both round-two Chapter 2 reviews. I did not read the parallel round-three review.

I parsed all 14 YAML files in scope and checked D66 coverage, cross-file ids, Specialty and Talent reverse lists, Squadmate attribute totals, and derived values. All checks passed. I ran the odds checks from `/private/tmp/wof-ch2-r3.u3DIqU`, outside the repository. The Graduation run built 500,000 Cadets. The Help tests rolled 1,000,000 squad-field-exercise pools per case.

## Verdict

No Critical finding remains. Three Major and two Minor findings are open.

The attribute, Drive-provenance, and Exam Covering fixes work. The Graduation Exam's old squad bonus is also gone, but its parity claim still assumes one helper per Cadet. The legal Help rule permits a materially stronger Top 10 strategy. OQ-35 remains explicitly unresolved. Promotion still has no procedure for several player characters dying or retiring at once.

## Round-two Critical and Major verification

Neither round-two review reported a Critical finding.

### Codex round 2

| Round-two finding | Status | Verification |
|---|---|---|
| 1. Graduation swap odds depended on Specialty strategy | Resolved | The swap now fires whenever another attribute is higher. In 500,000 Cadets, choosing the highest attribute, a random attribute, or an attribute rated 4 produced the same key-attribute distribution: 4 at 63.44%, 5 at 34.42%, and 6 at 2.14%. |
| 2. Two `own_state` Drives could trigger without an act | Resolved | Shield the Walls now names Draw Attention. Prove Them Wrong counts Blind Spot or On Body only when the soldier's own move put them there. A Grab and the Attention Ladder no longer satisfy either trigger. |
| 3. OQ-27 contradicts ADR-0003's attribute-alone fallback | Not resolved | OQ-35 now labels the conflict an Unresolved Major, but the rule and ADR still say different things. Finding 1. |
| 4. A Cadet who had rolled could absorb later Exam Covering Stress for free | Resolved | Only a Cadet who has not yet rolled in the squad field exercise can Cover. Their gained Stress therefore reaches their own pending roll. |

### Opus round 2

| Round-two finding | Status | Verification |
|---|---|---|
| 1. The Graduation Exam raised Top 10 odds under ordinary play and small groups | Partly | Removing the squad bonus closes the reported group-size exploit, and the revised Merit schedule is credible under the simulated one-helper allocation. Legal concentrated Help still moves a near-Top-10 Cadet's odds by 12.66 points. Finding 2. |
| 2. Drives and once-per-Titan-Engagement Talents had no path into other procedures | Resolved | OQ-36 records the current limit and gives each later procedure a closed hook to opt its turns and start-to-end interval into these rules. This is a forward reference, not drafted Chase or Expedition content. |

## Findings

### 1. Major. OQ-35 records but does not resolve the contradiction with ADR-0003

**Location:** section 2.9, lines 373 to 397; `data/character/action-catalog.yaml`, `uncatalogued_actions`; ADR-0003 item 9; OQ-35.

**Problem:** ADR-0003 says an action outside the Catalog uses the closest Catalog action or the attribute alone. Section 2.9 instead gives an action no roll and no effect when the player cannot name an existing tracked value. A `rule-named-value` covers only obstacles another rule anticipated. It does not implement the ADR's fallback for an unanticipated consequential action. Logging the conflict is honest, but provisional choice OQ-35(c) remains unsound while the ADR retains item 9.

**Scenario:** During an evacuation, a beam collapses across a doorway. A soldier braces it while civilians escape. No current tracked value represents the beam or the evacuation, so the action has no mechanical effect. The Strength-alone fallback promised by ADR-0003 never occurs.

**Fix options:**

1. Amend ADR-0003 item 9 to say that mechanical actions can change only values created by a rule, then keep OQ-27.
2. Add a general obstacle entry whose creating rule fixes its attribute, stakes, and tracked value before play.

### 2. Major. The Exam calibration omits targeted Help, which can materially raise Top 10 odds

**Location:** section 2.4, lines 212 to 217; `data/character/graduation-exam.yaml`, `trials.squad-field-exercise.help`; OQ-22, especially its simulation model and simulator case.

**Problem:** OQ-22 gives every Cadet one helper when two or more Cadets take the Exam. The rule permits up to three helpers on one roll, and each Cadet's Merit before the final Trial is already known. Players can put three Help dice on a Cadet at Merit 5 while assigning none to Cadets who cannot reach Top 10. The stated parity therefore does not test the obvious rank-maximizing policy.

In 1,000,000 Python trials, a representative Merit-5 Cadet rolled 5 base dice before Help, 1 Gear Die, Stress 0, and Pushed when short of the required 2 successes. One helper gave a 63.35% chance to succeed without a Stress Response and reach Top 10. Three helpers raised it to 76.01%, a 12.66-point increase. In a four-Cadet case where only that Cadet can reach Top 10, this raises the per-Cadet Top 10 share by 3.16 points with no lost Top 10 chance elsewhere. That is well outside OQ-22's quoted 0.2-point envelope.

**Scenario:** Before the squad field exercise, Mina has Merit 5. Her three comrades have Merit 2 or less. All three Help Mina. She gets three Bonus Dice, while their own success cannot make any of them Top 10. The Exam becomes a way to funnel Class Rank into one chosen character.

**Fix options:**

1. Limit the squad field exercise to one helper per Cadet, matching the calibration.
2. Re-simulate targeted Help at each group size and Merit state, then retune the Trial until the Top 10 rate stays within the intended envelope.
3. Keep concentrated Help and state plainly that the Exam lets the Squad improve one chosen Cadet's Class Rank.

### 3. Major. Promotion does not resolve several replacement triggers at once

**Location:** section 2.10, lines 465 to 479; `data/character/squadmates.yaml`, `promotion`.

**Problem:** The procedure handles several players wanting the same Squadmate, but it never orders several simultaneous deaths or retirements and does not say what losing players do after the contested roll. The state changes after every winner: the promoted soldier leaves the Squad Pool, so later players have a different eligible list. In this game's expected casualty rate, resolving more than one replacement after a Titan Engagement is a normal edge, not a remote one.

**Scenario:** Two player characters die in the same Titan Engagement. Two Squadmates survive, and both players choose Kessler. One wins the D6 roll. The rules do not say whether the loser now takes the other Squadmate, chooses again, or follows the no-Squadmate Lifepath branch. Different orders can also decide which player gets the only suitable replacement.

**Fix options:**

1. Roll once to order affected players, then let each choose from the remaining Squad Pool; use the Lifepath branch when none remain.
2. Have affected players submit ranked choices, resolve each contested Squadmate, and repeat with losing players until everyone has a replacement route.

### 4. Minor. The Squadmate data omits a `health_lost` field that the prose and promotion require

**Location:** `data/character/squadmates.yaml`, `stat_block.fields`, lines 13 to 27; section 2.10, lines 405 to 409 and 472.

**Problem:** The prose says a Squadmate records Health and Health lost, and promotion preserves both. The source-of-truth field list contains `health` with a comment to record Health lost, but no `health_lost` field. A sheet or importer driven by the ids has nowhere to store it.

**Scenario:** A Squadmate loses 2 Health, survives, and is promoted. An importer built from `stat_block.fields` has only maximum Health, so the promoted character is either healed or needs a manual field invented outside the data.

**Fix options:**

1. Add `health_lost` to `stat_block.fields`, matching `lifepath.yaml`.

### 5. Minor. Chapter 1 still says its exception data lists only the Death Roll

**Location:** `docs/rules/01-core-rules.md`, line 67; `data/core/dice-pool.yaml`, `roll_exceptions`.

**Problem:** The file now lists the Death Roll and the performance roll. Chapter 1's source-of-truth summary still says it lists "the Death Roll's exceptions." This is stale dependency text, not a Chapter 2 rule change.

**Scenario:** A reader auditing Chapter 1 sees the performance-roll row as an undocumented exception rather than an intended extension point.

**Fix options:**

1. Change the sentence to say the file lists rolls with exceptions, including the Death Roll.

## Judgment on OQ-19 to OQ-36

| OQ | Judgment | Reason |
|---|---|---|
| OQ-19 | Sound | The always-swap rule preserves 18 points and removes strategy-dependent key-attribute odds. The 500,000-Cadet run reproduced 63.44 / 34.42 / 2.14% at ratings 4 / 5 / 6 under all three Specialty strategies. |
| OQ-20 | Sound | Both capped and only-dormant fallbacks are closed and keep all five creation levels reachable. |
| OQ-21 | Sound with recorded skew | The run reproduced 6.24% Top 10 overall. By pre-Graduation highest attribute it was Strength 9.50%, Agility 3.67%, Wits 5.67%, Perception 7.31%, Instinct 5.11%, and Empathy 6.15%. The skew is real but logged and cannot be chosen after the rolls. |
| OQ-22 | Unsound in part | Removing the squad bonus and restricting Covering fix both round-two failures. Targeted Help invalidates the broad parity claim. Finding 2. |
| OQ-23 | Sound | Every trigger now records an act or self-created Position state, and named-comrade creation and replacement are closed. |
| OQ-24 | Sound | The formulas, order, and rounding are complete and fit the low-Health design. |
| OQ-25 | Sound for Chapter 2 | The current pools give each Specialty a job without exclusive permission. Later chapters still own requirements and effects. |
| OQ-26 | Sound | `option` and `fixed-roll` keep every Talent reference in one id space without adding Talent dice to non-attribute rolls. |
| OQ-27 | Unsound until OQ-35 is settled | The procedure is closed, but its no-value branch does not match ADR-0003 item 9. Finding 1. |
| OQ-28 | Sound with pending simulation | Relentless no longer changes a first Nape strike or creates an Opening from zero successes. The listed Chapter 5 and 6 tests remain genuine acceptance gates. |
| OQ-29 | Sound in mechanics, incomplete in data | Full permissions and full gear costs fit the ADRs. The missing `health_lost` field is finding 4. |
| OQ-30 | Sound | One D6 per proposed shared choice closes the old vote-weight ambiguity without giving the GM control. |
| OQ-31 | Unsound in part | A single promotion preserves state and reaches five Talent levels. Several simultaneous replacement triggers have no order. Finding 3. |
| OQ-32 | Sound | The year gate prevents impossible refugee histories without drafting the Canon Clock. |
| OQ-33 | Sound | Dormant entries remain forward references, and the new fallback prevents a forced dormant level. |
| OQ-34 | Sound | Declaration timing precedes every check a permission-changing Talent can alter. |
| OQ-35 | Unsound and unresolved | Its current choice narrows ADR-0003 without amending it. Finding 1. |
| OQ-36 | Sound | It records the current limit and gives later procedures an explicit, data-shaped extension hook without drafting those procedures here. |

## Chapter 1 dependency check

Chapter 2 does not change a settled Chapter 1 rule. The performance-roll exception uses OQ-03's existing exception hook. The Exam Stress reduction uses section 1.6's later-row hook and changes only Stress. The new restriction on Exam Covering adds a condition to one calling rule; it does not widen Chapter 1 eligibility. Counting worn-out required gear as not had is a Chapter 2 Catalog consequence layered on Chapter 1's current Gear Dice rating, not a change to the Push or wear procedure. Chapter 1's one stale summary sentence is finding 5.

## Data, scope, and terminology checks

All five D66 tables cover 11 to 66 exactly once. Every Talent, Catalog entry, tracked value, Specialty link, template link, and Drive act resolves. All nine Squadmate templates total 18 points, and their Health and Resolve values match their attributes. Every Talent now has a player-facing description. The chapter and YAML agree on the revised swap, Exam, Drives, gear test, promotion Talent gain, and roll-off.

No XP purchase, Downtime, Rank, Requisition, Expedition, Chase, Canon Clock, Operation Frame, Shifter, or Titan Engagement procedure is drafted here. The dormant rolls, Wings, Standard Issue, joining mid-campaign, and OQ-36 hooks are forward references. None makes character creation unusable. I found no game-term use of a glossary `_Avoid_` term.

Relentless's extra Opening, Saddle Dodge's horse pool, and the present Drive scene limit differ from the shortest glossary or ADR wording, but OQ-28 and OQ-36 log each choice and its later acceptance test. They are sound provisional exceptions, not open findings in this round.
