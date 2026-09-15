# Chapter 3, Harm and Mind: review round 2

Reviewed `docs/rules/03-harm-and-mind.md`, every YAML file in `data/harm/` and `data/mind/`, OQ-39 to OQ-56, both round-1 Chapter 3 reviews, `CONTEXT.md`, every ADR, Chapters 1 and 2, and their data files. I did not read the parallel round-2 review.

All 27 YAML files across `data/core/`, `data/character/`, `data/harm/`, and `data/mind/` parsed. I checked table coverage, non-lethal caps, effect ids, Action Catalog references, prose against YAML, dependency rules, and the Grab target. Probability work ran in `/private/tmp/wof-ch3-r2.uWFYVe`, outside the repository. The Grab simulation used 300,000 trials per cell.

## Verdict

No Critical finding remains. Three Major and four Minor findings are open.

The drafter resolved every Critical or Major finding from round 1. The new rules are substantially better, especially the end-of-fight Death Roll order and the permanent-injury state. Three other problems remain. Simultaneous promotion still has no terminating procedure, the Down YAML can restore a turn that Chapter 1 already spent, and Survivor's Guilt has no order against the Fear Roll caused by the same death.

## Round-1 Critical and Major verification

Neither round-1 review had a Critical finding.

### Codex round 1

1. **Resolved. Fifth Scar during the end care window.** Retirement now waits for the last end step, and the day and outside-harm procedures also have explicit completion points. See section 3.13, `scars.yaml` `retirement`, OQ-51, and OQ-54.
2. **Resolved. Careful Nursing on self-treatment.** Section 3.5, section 3.6, `treat-injury.yaml`, and `healing.yaml` now require a comrade, matching the closed Chapter 2 Talent.
3. **Resolved. Healed amputations reset worsening.** A healed permanent row keeps counting, each permanent row can occur once, and `repeat_row` supplies a legal replacement. Permanent effects now start when gained.

### Opus round 1

1. **Resolved. Titan attack versus devour.** OQ-39 now makes lift and devour Grab procedure steps rather than Behavior Table entries. Devour has no Severity or Reaction and names death.
2. **Resolved. Lost limb and eye rows had no effect while held.** Permanent effects now apply at once. The treated bleeding rows also retain explicit penalties while held.
3. **Resolved. The care window erased `engagement` lethality.** End-of-fight Death Rolls now precede the care window. Section 3.2 reports effective untreated lethality rather than treating the raw lethal-row rate as a death rate.
4. **Resolved. Grab levers and Fear action loss were misstated.** Section 3.7 now gives the measured size of each Chapter 3 lever, and OQ-50 reports action-or-turn loss as well as whole-turn loss.
5. **Resolved. A soldier who left a Titan Engagement had no clock or treatment rule.** OQ-56 keeps their turns running, lets two departed soldiers treat or Rally each other, and includes them in the common end procedure.
6. **Resolved. No Reactions inherited turn debt.** The ban now counts the first turn that begins after the result, independent of which turn the result spends, and ends with the Titan Engagement.
7. **Resolved. Squad-wide Grief saturated Resolve.** OQ-52 limits fight Grief to participants and normally to 1 per Titan Engagement, and gives the future Downtime rules a relief target of at least 2. The actual relief remains a proper forward reference rather than drafted Phase 2 content.

## Findings

### 1. Major. Step 8 still cannot finish two contested promotions

**Location:** section 3.4, line 241; section 3.16, lines 557 to 559; Chapter 2, section 2.10 and `data/character/squadmates.yaml`, `promotion`; OQ-38, lines 584 to 597.

**Problem:** Chapter 3 now batches every death and Retirement at step 8, but OQ-38 remains an Unresolved Major. Chapter 2 resolves the first contest for one Squadmate and says nothing about the losing player. Chapter 3 cites that incomplete procedure without closing it. The batch therefore reaches a state with no next step, contrary to ADR-0003's ban on filling rules gaps by judgment.

**Scenario:** Mina and Oskar both die in one Titan Engagement. Two Squadmates survive. Both players choose Mila. Mina wins the D6 roll. No rule says whether Oskar chooses again, receives the other Squadmate, or takes the new-character branch. Step 8 cannot finish.

**Fix options:**

1. Adopt OQ-38 option (c) in Chapter 2 and its YAML: each losing player chooses again from untaken Squadmates, repeating contests until every player has a replacement or uses the no-Squadmate branch.
2. If Chapter 2 must remain frozen, put that complete repeat procedure in Chapter 3's step 8 and log the temporary dependency override.

### 2. Major. Ending Down restores a future turn that Chapter 1 may already have spent

**Location:** `data/harm/down.yaml`, lines 62 to 71; section 3.3, lines 179 to 188; Chapter 1, section 1.9, lines 247 to 261.

**Problem:** The YAML says, without a condition, that after Down ends, "the soldier's next turn has its move and action as normal." Chapter 1 says a Reaction can already have spent that next turn in advance. Treating Down does not cancel spent turns; only the end of the Titan Engagement does. Because Chapter 3 declares YAML the source of truth, the two Done rules give different turn states.

**Scenario:** Oskar moves, then dodges later in the round. Since part of this round's turn was spent, the dodge spends his next turn. The attack still lands and puts him Down. Mila treats the Down row before the round ends. `down.yaml` restores Oskar's next move and action, while Chapter 1 says that turn remains spent.

**Fix options:**

1. Change `after_ending` to say that ending Down restores nothing already spent; any current or future turn keeps its recorded state.
2. Delete the first sentence from `after_ending` and retain only the rule for a turn already under way.

### 3. Major. Survivor's Guilt has no order against the Fear Roll caused by the same death

**Location:** section 3.4, line 244; section 3.12, lines 431 and 442 to 446; `data/mind/fear-rolls.yaml`, `limits.timing` and `roll.total`; `data/mind/scars.yaml`, lines 66 to 71.

**Problem:** A comrade's death triggers both Survivor's Guilt, which adds 1 Stress, and a `comrade-dies` Fear Roll, whose total uses current Stress. No rule says which trigger resolves first. This is not cosmetic. At Stress 3 and Resolve 3, the Fear Roll costs an action or turn on 66.7% of results if rolled first, or 83.3% if Survivor's Guilt raises Stress first. The chance of gaining another Scar changes from 0% to 16.7%.

**Scenario:** Mila has Survivor's Guilt, Stress 3, and Resolve 3 when Oskar is devoured. Her Fear die is 6. If she rolls before the Scar trigger, the total is 6, Unguarded. If she gains Stress first, the total is 7, Breaking Point, which also gives a Scar.

**Fix options:**

1. Put `applies_before: the comrade-dies Fear Roll` or `applies_after` on Survivor's Guilt, then state the same order in the chapter.
2. Add a universal order for effects and Fear Rolls triggered by one event, and use it for every Scar row added later.

### 4. Minor. Promotion can erase Chapter 3 state from a promoted Squadmate

**Location:** section 3.17, lines 583 to 593; `data/harm/sheet-fields.yaml`, lines 12 to 55; Chapter 2, section 2.10, lines 467 to 478; `data/character/squadmates.yaml`, `promotion.steps`; OQ-55.

**Problem:** OQ-55 acknowledges that Chapter 2's fixed promotion list omits the Chapter 3 extension fields. Those fields include healed permanent injuries, lasting Stress Responses, pending penalties, and pending Retirement. Promotion says to keep Critical Injuries, but a healed Lost Arm is no longer held as one and lives only in `healed_permanent_injuries`. A literal conversion can erase its permanent penalty.

**Scenario:** A Squadmate lost an arm, healed, and is later promoted after a player character dies. The promotion list keeps held Critical Injuries but does not keep `healed_permanent_injuries`. The new player character regains full use of the missing arm.

**Fix options:**

1. Change the promotion step to keep every recorded field, including every extension supplied by later chapters.
2. Add all fields from `sheet-fields.yaml` to the promotion conversion and the Squadmate stat block when Chapter 2 is next opened. Until then, state the inheritance in OQ-55 as a binding rule rather than a future suggestion.

### 5. Minor. Outside-harm care can come from soldiers who are not present

**Location:** section 3.5, lines 275 to 286; `data/harm/treat-injury.yaml`, `care_windows.held.outside-harm` and `care_windows.held.day`; OQ-44.

**Problem:** The revised scope is explicit but too broad. An immediate outside-harm window and a day window include every soldier in the Squad, with no presence test. Unlike the Downtime clause, the outside-harm clause gives later rules no authority to narrow it. A soldier elsewhere can therefore treat, Help, or Cover a roll remotely.

**Scenario:** Oskar falls and gains a lethal Critical Injury during a Chase after being separated from the medic. The immediate window includes that medic merely because both belong to the Squad. The medic can stabilize Oskar before his Death Roll without reaching him.

**Fix options:**

1. Require the rule that causes an outside-harm or day window to name its participants, as outside-Engagement Fear triggers already do.
2. Make the scope every living soldier physically present under the calling procedure, and require each later procedure to define that closed set.

### 6. Minor. Pay It Forward still cannot answer the first Grab Fear Roll

**Location:** section 3.12, lines 430 and 442; `data/mind/fear-rolls.yaml`, `comrade-grabbed` and `limits.timing`; `data/character/enlistment.yaml`, `pay-it-forward`; OQ-49, lines 914 to 915.

**Problem:** The Fear Roll happens as soon as the Grab resolves, but Pay It Forward requires an act on a comrade who was already Grabbed or Down since the witness's most recent turn began. The Drive written around rescue cannot shrug off the fear that begins that rescue. OQ-49 records the mismatch but does not repair it.

**Scenario:** Mila sees Oskar grabbed. She has not yet been able to act on him as a Grabbed comrade, so Pay It Forward fails its trigger. Her Fear Roll spends the action she would have used to rescue him.

**Fix options:**

1. Change the Drive trigger to include declaring the next act to free, treat, or lift the newly Grabbed comrade.
2. Keep the current timing and rewrite the Drive so its text does not promise the first rescue moment.

### 7. Minor. "Worse result" still means only a better average roll

**Location:** glossary `Critical Injury` in `CONTEXT.md`; section 3.2, lines 102 to 109; `data/harm/critical-injuries.yaml`, `worsening.meaning`; OQ-42.

**Problem:** The glossary says a second injury to one Injury Location "lands on a worse result." OQ-42 now explicitly defines that as rolling with +2, without comparing rows. A second result can therefore be lighter than the first. The procedure is playable and the departure is logged, so this is not Critical, but the glossary still promises a guarantee the rule does not make.

**Scenario:** Oskar holds Torn Artery in his arm. His next arm roll is 2, plus 2 for worsening, and lands on Wrenched Shoulder. The later injury is much lighter despite the glossary's wording.

**Fix options:**

1. Amend the glossary to say that later injuries are rolled with worsening rather than guaranteed to land on a worse row.
2. Keep the glossary and floor the new row at one row worse than the worst injury that counts there.

## Grab target and probability checks

The exact first-injury enumeration is 33 lethal cases in 216, or **15.278%**, and 23 Down cases in 216, or **10.648%**. These support the chapter's 15.3% and 10.6% figures. The current crushing torso distribution also remains 16.7% with no Break Free penalty, 41.7% with a 1-die penalty, 25.0% with a 2-dice penalty, and 16.7% Down.

The Python model applied the crushing row, Pushing, Stress Responses, Break Free penalties, Down, witness Fear action loss, and two victim turns before devour. It used the round-1 Rookie assumptions: Strength 4, Talent 1, one Gear Die, Stress 2, Resolve 3, and Break Free at 3 successes.

- Alone, one usable Break Free turn: **76.706%** death.
- Alone, two usable Break Free turns: **60.342%** death.
- One rescuer with one Toughness-1 hand strike after the lift, after the witness Fear Roll, while the victim keeps both Break Free turns: **33.854%** death.
- Two rescuers with five accumulated successes needed: **17.787%** death.

The solo target of about two in three lies between legal one-turn and two-turn cases. The comrades-close target is reachable with ADR-0015's Toughness-1 hand if Chapter 5's lift and reach rules leave one effective rescue action. With two unrestricted rescuers it remains too safe, exactly as section 3.7 now warns. Chapter 3 has not made either ADR-0014 target unreachable. Chapter 5 still has to calibrate the missing procedure with the final simulator.

## Provisional decisions OQ-39 to OQ-56

| OQ | Judgment | Reason |
|---|---|---|
| OQ-39 | Sound | The Grab countdown exception is data-shaped, satisfies ADR-0005 and ADR-0015, and closes the devour route. |
| OQ-40 | Sound | Revive and daily recovery give Health a closed field cycle without letting routine treatment refill it during a fight. |
| OQ-41 | Sound with a fidelity cost | No-side tracking is fast and rollable. It also means a soldier can lose only one arm, one leg, and one eye; that is an explicit abstraction rather than an undefined rule. |
| OQ-42 | Partly sound | The tables, caps, permanent state, repeat rows, and odds work. Its definition of "worse result" still disagrees with the glossary's ordinary reading. Finding 7. |
| OQ-43 | Sound | All limits have start, expiry, conversion, and outside-Engagement rules. The stated Death Roll odds reproduce. |
| OQ-44 | Partly sound | The roll procedure and end-window order are closed. Outside-harm and day scopes still allow absent soldiers to provide care. Finding 5. |
| OQ-45 | Partly sound | The Down state itself is sound, but its YAML can restore a spent future turn. Finding 2. |
| OQ-46 | Sound | Turn spending follows Chapter 1 while the Reaction ban uses its own equal turn clock. |
| OQ-47 | Sound | Every total and repeated lasting row terminates, and each duration has an end. |
| OQ-48 | Sound | Rally has a closed target, range, success effect, retry rule, and outside-Engagement limit. |
| OQ-49 | Sound table, weak Drive fit | The trigger list and event limits are closed. Pay It Forward still misses the first Grab it describes. Finding 6. |
| OQ-50 | Sound | Every result maps to tracked effects, a Drive cancels the whole row, and the action and turn figures are correct. |
| OQ-51 | Partly sound | Scar gain and Retirement now terminate. Survivor's Guilt needs an order against the death's Fear Roll. Finding 3. |
| OQ-52 | Sound with a forward dependency | The participant test and per-fight cap control spikes. Downtime must meet the recorded relief target before campaign attrition can be accepted. |
| OQ-53 | Sound | Days match ADR-0009, and later procedures own only when those days occur. |
| OQ-54 | Sound | The order is complete and makes in-fight treatment matter. Its untreated lethality is stated accurately. |
| OQ-55 | Partly sound | The extension fields are adequate in Chapter 3, but Chapter 2's promotion procedure does not preserve all of them. Finding 4. |
| OQ-56 | Sound | The retreat case now has turns, support, and one end procedure. Chapter 5 can narrow reach when it defines leaving and movement. |

OQ-38 remains unsound and is finding 1. Its status as a logged Unresolved Major prevents a hidden ADR contradiction, but it does not make the end procedure usable.

## Data, dependencies, scope, and terminology

The Injury Location D6 covers every face once. Each Critical Injury table has continuous open-ended coverage, and every non-lethal cap names an existing non-lethal, non-instant row. Death Roll outcomes cover every nonnegative success count. Stress Response and Fear Roll tables cover every possible total. The Scar D66 table covers all 36 legal results once. Every effect id and Action Catalog reference resolves.

Prose and YAML agree except for finding 2. Chapter 3 contradicts no ADR and uses no glossary `_Avoid_` term. Findings 1, 2, and 4 are the remaining contacts with closed Chapter 1 or Chapter 2 rules.

No Phase 2 procedure is drafted. Expedition days, Downtime duration and relief, instructors, contacts, gear consequences, Titan targeting, witnesses, movement, Grab lift and devour, and Behavior Table Injury Locations remain forward references. None of those references makes Chapter 3 unusable beyond the findings above.
