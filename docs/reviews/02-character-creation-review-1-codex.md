# Chapter 2, Character Creation: review round 1

Reviewed: `docs/rules/02-character-creation.md`, every file in `data/character/`, the Chapter 2 additions to `data/core/dice-pool.yaml` and `data/core/stress-changes.yaml`, OQ-19 to OQ-32, `CONTEXT.md`, every ADR, Chapter 1, and the prior Chapter 1 review trail. I did not read the parallel Chapter 2 review. Odds below come from Python simulations run outside the repository: 1,000,000 Cadets for Lifepath distributions, 2,000,000 Nape strikes per Depth 4 cell, and 1,000,000 gas canisters.

## Verdict

The Lifepath is complete enough to create a soldier, and its D66 tables, IDs, five Talent levels, formulas, and worked example agree across prose and YAML. It is not ready to confirm. `Relentless` breaks ADR-0014's calibrated solo strike targets, the performance table has an unrepresented result, several rule Talents are inert under their own trigger order, and promotion and Squadmate abstraction erase costs that the game treats as central.

## Findings

### 1. Critical. Relentless makes ADR-0014's two solo Nape targets mutually unreachable at an integer Nape Depth

**Location:** `data/character/talents.yaml`, `relentless`, lines 160 to 172; section 2.7, PROVISIONAL OQ-28, line 276.

**Problem:** Chapter 1's final calibration found that Nape Depth 4 gives a Rookie about 12% and a Levi-grade soldier about 47% with one Push. `Relentless` adds a second Push with no per-Engagement limit. Under the current procedure, a Rookie with Strength 4, Clean Cut 1, Blade Set 1, and Stress 1 reaches Depth 4 on 27.90% of strikes; a Levi-grade build reaches it on 63.93%. Raising Depth to 5 produces 11.75% and 46.46%. No integer Depth meets both "no more than 10%" for the Rookie and "about 50%" for Levi-grade while the Talent is available to those reference builds. OQ-28 itself required this check, but the untested Talent was still drafted.

**Scenario:** A Rookie Slayer takes Relentless from "The wooden nape" and Clean Cut 1 at Graduation. After Break Attention, the character has more than twice the intended solo kill chance at Depth 4. The same Titan cannot also be tuned for a Levi-grade Slayer without missing one of ADR-0014's targets.

**Fix options:**

1. Replace the second Push with a narrower benefit that does not add another full reroll, such as one extra base die after a failed strike.
2. Restrict the second Push to Body Part strikes, where Chapter 6 can tune Toughness around it without moving the solo Nape target.
3. Define reference-build Talent loadouts in ADR-0014, then retune Nape Depth and every strike Talent together. Do not confirm OQ-28 until one integer Depth passes both targets.

### 2. Major. Choosing Why You Enlisted invalidates OQ-19's attribute distribution and contradicts its claim that players place no points

**Location:** section 2.2, PROVISIONAL OQ-19, line 73; section 2.3.2, line 111; `data/character/enlistment.yaml`, line 9; OQ-23.

**Problem:** OQ-19's quoted 64% at key attribute 4, 34% at 5, and 2% at 6 assumes a random enlistment row. OQ-23 lets the player choose that row, which also chooses its attribute point. In my simulation, random enlistment produced 63.42%, 34.32%, and 2.26%. Merely choosing an enlistment attribute that matches one of the Origin's two raised attributes changed the distribution to 46.83%, 49.59%, and 3.58%. The share at 5 or 6 rises from 36.58% to 53.17%, far beyond OQ-23's own "few points" retest threshold. OQ-19 also says players place no Lifepath points except overflow, which is false under OQ-23.

**Scenario:** A Wall Rose Farm Cadet chooses either Protect the People or A Promise instead of rolling. That point concentrates Strength or Perception before three Training Years, making a rating of 5 much more common than the Rookie calibration assumes.

**Fix options:**

1. Make Why You Enlisted rolled only, while allowing the player to choose or rewrite the Drive without gaining a chosen attribute.
2. Let the player choose the row, but remove its attribute point and put that point in a table-driven step.
3. Keep the choice and rewrite OQ-19 and ADR-0014's creation reference after simulating explicit player strategies, not random rows.

### 3. Major. The YAML Merit table has no machine-readable result for four or more successes

**Location:** `data/character/training-years.yaml`, `performance_roll.merit_from_successes`, lines 32 to 40; section 2.3.3, lines 133 to 138.

**Problem:** The prose says three or more successes grant 3 Merit. The YAML row says only `successes: 3`; "3 or more" exists in a comment, which a renderer or Foundry importer cannot read. A five-die performance roll gets four or five successes about 0.33% of the time. The source of truth then has no row for a legal result, contrary to ADR-0012.

**Scenario:** A Cadet rolls five dice in Year 2 and gets four 6s. The Markdown grants 3 Merit. A literal data consumer finds no `successes: 4` row and cannot determine Class Rank.

**Fix options:**

1. Use `successes_min: 3` and `successes_max: null`, matching the Graduation Exam tables.
2. Add explicit rows for 3, 4, 5, and 6 successes, all worth 3 Merit.

### 4. Major. Five rule Talents trigger only after the permission, target, or cost they are meant to change has already been decided

**Location:** `data/character/talents.yaml`: `wide-awareness`, lines 232 to 243; `carrying-voice`, lines 258 to 267; `shoulder-the-load`, lines 269 to 280; `quick-refit`, lines 321 to 330; `rescue-ride`, lines 358 to 367; section 2.7, lines 263 to 269.

**Problem:** A rule Talent applies when its trigger occurs. These five use triggers such as "You Help", "You Cover", or "You take" an action, then retroactively extend eligibility or replace its cost. Under the closed Chapter 1 rules, a soldier two Position steps away cannot Help or Cover, so Wide Awareness and Shoulder the Load never trigger. Likewise, the system must decide whether Rally or Lift Comrade has a legal target and whether Change Canister spends an action before the character can take it. The data has no timing phase that applies permission-changing Talents first.

**Scenario:** Brandt is two Position steps from Wendt and has Wide Awareness. Chapter 1 says she does not qualify to Help. Since she never Helps, the Talent's "You Help" trigger never occurs, so its exception cannot make her eligible.

**Fix options:**

1. Add a pre-declaration timing phase for rule Talents, before legality, target, cost, and pool construction are checked.
2. Rewrite these triggers as proposed uses, such as "When you declare Help for a roller up to two Position steps away."
3. Store permission and cost changes as structured entry overrides rather than event triggers.

### 5. Major. The Graduation Exam reset can erase lasting harm and writes Chapter 3 effects into the Chapter 1 Stress table

**Location:** section 2.4, line 188; `data/character/graduation-exam.yaml`, lines 46 to 50; `data/core/stress-changes.yaml`, `graduation-exam-ends`, lines 82 to 88; OQ-22.

**Problem:** Returning Stress to minimum is a valid later-chapter row under Chapter 1's extension rule. The added `also` clause is not a Stress change. It ends "every Stress Response and other Chapter 3 result gained during the Exam," which includes, on its face, Down, a Scar, Grief, or a Critical Injury with a healing time. That contradicts the glossary's definition of a Critical Injury as lasting and pre-decides Chapter 3 before its tables exist. OQ-22's own balance claim is also weak: its quoted 0.20 Merit versus 0.50 for an attribute-3 Cadet with no Talent is a 60% reduction, not a close replacement.

**Scenario:** A Pushed dummy-course roll produces a Chapter 3 result that inflicts a Critical Injury. At Exam end, the broad cleanup clause says the injury ends even though its table gives a healing time.

**Fix options:**

1. Keep only the Stress reduction now. Let Chapter 3 name which temporary results end after a scene.
2. Replace "other Chapter 3 result" with a closed list of specific temporary states after Chapter 3 exists. Never include Scars, Grief, or Critical Injuries.
3. Delay the optional Exam until Chapter 3 is drafted, then simulate full Cadets and Top 10 frequency rather than three isolated pool examples.

### 6. Major. OQ-27 does not implement the ADR's attribute-alone fallback and makes ordinary consequential actions impossible

**Location:** section 2.9, lines 325 to 347; `data/character/action-catalog.yaml`, `uncatalogued_actions`, lines 463 to 498; ADR-0003 item 9.

**Problem:** ADR-0003 says an action outside the Catalog uses the closest Catalog action or the attribute alone. OQ-27 instead asks the player to name one of 20 tracked values. If none matches, the action has no mechanical effect. Its attribute-alone route exists only after selecting an entry that requires missing gear, or when another rule already calls for an attribute. It never handles a novel consequential action with no close entry. The procedure also does not test "closest" at all. This is closed, but it closes off common play rather than resolving it.

**Scenario:** During a Titan Engagement, a soldier braces a collapsing beam so civilians can escape. The action changes no listed value. Strength, Endure, and Help are all plausible, but OQ-27 requires no roll and gives the action no effect.

**Fix options:**

1. Add structured purpose tags to Catalog entries and a deterministic match order, with a final attribute-alone fallback.
2. Add a general `overcome-obstacle` entry for environmental actions, with explicit tracked clocks and attribute selection rules.
3. Narrow ADR-0003 to the current tracked-value design and state that Operation Frames must add every consequential scene value and matching action before play.

### 7. Major. Squadmates bypass the field's two central equipment constraints and become stronger generalists than most new player characters

**Location:** section 2.10, lines 355 to 379; `data/character/squadmates.yaml`, lines 27 to 37 and 40 to 61; OQ-29.

**Problem:** A Squadmate has every non-key attribute at 3, for 19 points, while simulated player characters have 18 points in 92% of cases and non-key attributes average about 2.7. More importantly, Squadmates make no Gas Rolls, count no Blade Sets, carry no items, and are never Overloaded. Since any player directs them, optimal play assigns repeated ODM movement, decoy work, Help, and low-risk Body Part strikes to soldiers with inexhaustible gas and blades. This removes the attrition and carrying pressure for one third of ADR-0014's default six-soldier Squad.

**Scenario:** Four player characters conserve gas while both Squadmates move on ODM Gear every round, Help from the needed Positions, and strike Body Parts with Blade Sets that cannot run out. Only the player characters pay for identical field activity.

**Fix options:**

1. Give each Squadmate one simplified gas and blade depletion track per Titan Engagement.
2. Charge Squadmate gas, blades, and carried gear to shared Squad resources through closed triggers.
3. Keep abstract gear, but restrict no-cost Squadmate actions and movement so they cannot replace the resource-bearing player characters.

### 8. Major. Promotion can heal a Squadmate and create fresh field gear because current resource state is not preserved

**Location:** section 2.10, lines 412 to 426; `data/character/squadmates.yaml`, `promotion.steps`, lines 114 to 122; OQ-31.

**Problem:** The conversion keeps Stress and harm except Health, then says to "recalculate Health." A wounded Squadmate therefore appears to return to full Health when promoted. It also changes from recording no Gas Rating, Blade Sets, or carried items to recording player-character gear, but gives no starting values or rule for inheriting depleted field state. Promotion normally happens at the end of a Titan Engagement, often mid-Expedition, so this can create a full canister and Blade Sets without resupply.

**Scenario:** A Squadmate at Health 1 with abstract gear survives the Engagement in which a player character dies. Promotion recalculates Health to 4 and materializes player-character equipment. The newly promoted character is healthier and better supplied because someone died.

**Fix options:**

1. Record maximum and current Health separately, and preserve current damage through conversion.
2. Define exact conversion values for gas, blades, and carried items based on the Squadmate's last scene and current Squad Supply.
3. Delay mechanical conversion until a resupply point; the player can direct the chosen Squadmate under its old block until then.

### 9. Minor. Chapter 2 drafts two Phase 2 Squadmate and Rank rules instead of forwarding them

**Location:** section 2.10, lines 371 to 372 and 406 to 410; `data/character/squadmates.yaml`, lines 60 to 61 and 91 to 98.

**Problem:** "Squadmates gain no XP and take no Downtime Actions" is a Downtime and advancement rule, not a character-creation dependency. Raising the Squad target from six to seven when a player becomes Squad Leader is a mechanical Rank benefit. Both constrain Phase 2 chapters before those procedures exist.

**Scenario:** The Downtime chapter later needs an injured Squadmate to use Recover, or the Rank chapter gives Squad Leader a different benefit. Chapter 2 has already forbidden the first and reserved the second.

**Fix options:**

1. Replace both with explicit forward questions owned by the Phase 2 chapters.
2. Keep only Phase 1 facts: starting Squad size six, all new player characters Private, and no current rule grants Squadmates XP or Downtime Actions.

### 10. Minor. The chapter opening says every roll uses Push, Stress, and Help, but the performance roll uses none of them

**Location:** section 2 introduction, line 5; section 2.3.3, lines 131 to 138; `data/core/dice-pool.yaml`, lines 131 to 139.

**Problem:** The opening says every roll in the chapter uses the Push, Stress, and Help rules. The performance roll explicitly excludes Stress Dice and Help and forbids a Push. The later rule is clear, but the introduction gives the wrong first instruction.

**Scenario:** A player reads the chapter overview, rolls no successes in Year 1, and asks to Push before reaching the exception several pages later.

**Fix options:**

1. Say every roll follows Chapter 1 unless its procedure lists exceptions.

## Judgment on OQ-19 to OQ-32

| OQ | Judgment | Reason |
|---|---|---|
| OQ-19 | Unsound as combined with OQ-23 | The random-row distribution is reproduced, but player choice moves ratings at 5 or 6 by 16.59 percentage points. Finding 2. |
| OQ-20 | Sound | Five levels are always reachable. D66 Talent references and curricula resolve to existing Talent IDs, and the fallback cannot exhaust with only four pre-Graduation levels. |
| OQ-21 | Sound | Random-Lifepath simulation produced 6.41% Top 10 and 15.60% at Merit 5 or more, matching the stated figures. The YAML range table is complete. |
| OQ-22 | Unsound | The Exam's cleanup is unbounded, and the quoted low-build Merit comparison is not close. Finding 5. |
| OQ-23 | Unsound in part | The three closed Drive tests and replacement rule satisfy ADR-0003. Choosing the row silently chooses an attribute and invalidates OQ-19. Finding 2. |
| OQ-24 | Sound | Rounding up is explicit and matches the settled formulas. It keeps Health small under ADR-0005. The glossary needs the rounding clause if confirmed. |
| OQ-25 | Sound for this chapter | The assignments give every attribute a field use and keep one gear item per roll. Chapter 5 must still supply the deferred requirements and effects. |
| OQ-26 | Sound | The extra Catalog kinds keep rule Talents on one closed ID list without granting dice to fixed rolls or options. |
| OQ-27 | Unsound | It omits the ADR's general attribute-alone branch and makes untracked consequential actions inert. Finding 6. |
| OQ-28 | Unsound | Relentless breaks ADR-0014, and several permission-changing Talents have circular triggers. Findings 1 and 4. Light Trigger is modest: at Gas Rating 3 it changes all-pushed canister life from mean 6.33 to 6.67 rounds and leaves the median at 6. |
| OQ-29 | Unsound | The abstraction removes gas, blades, and carrying constraints from two of the default six soldiers. Finding 7. |
| OQ-30 | Sound | One Squadmate per Wing, player control, a closed disagreement roll, and acting after a spent turn agree with the glossary and Chapter 1. Chapter 5 properly owns assignment. |
| OQ-31 | Unsound | Conversion fails to preserve current Health and cannot translate abstract gear into current player-character resources. Finding 8. |
| OQ-32 | Sound | The year gate makes the refugee row rollable without contradicting 845 to 850, and a Phase 1 Canon Tie correctly has no effect. |

## Chapter 1 edit check

The `performance-roll` exception in `data/core/dice-pool.yaml` matches both chapters and does not change an existing Chapter 1 rule. The `graduation-exam-ends` Stress reduction follows Chapter 1's stated later-row extension and does not change the two field relief triggers. Its `also` clause does improperly claim ownership of every Chapter 3 result, as finding 5 explains. No other Chapter 1 rule change appears in these two additions.

## Table and reference check

All five D66 tables cover 11 to 66 exactly once. Every Talent, Specialty, Catalog entry, Squadmate template, and cross-file ID resolves. The Specialty and Talent reverse lists agree, all six attribute `used_by` lists agree with the Catalog, and every Squadmate's precalculated Health and Resolve matches OQ-24. The worked example matches the current rows and formulas. Apart from finding 3, I found no unrollable YAML range or dangling ID. No forbidden glossary synonym appears as a game term.

## Keep

- The nine Specialties grant focus without exclusive permissions, exactly as ADR-0006 requires.
- The Lifepath has a clean creation order, bounded rerolls, and a worked example that reproduces the data.
- Drives use closed, checkable state and action-entry tests instead of asking the GM whether a character acted on a motivation.
- OQ-26 gives rule Talents one ID space without pretending fixed rolls are attribute rolls.
- OQ-30 keeps Squadmates in player hands and resolves disagreement without GM judgment.
