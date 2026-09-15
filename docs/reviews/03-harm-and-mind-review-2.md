# Chapter 3, Harm and Mind: review round 2

Reviewed:

- `docs/rules/03-harm-and-mind.md`.
- Every file in `data/harm/` and `data/mind/`.
- OQ-39 to OQ-56 in `docs/rules/OPEN-QUESTIONS.md`, and the Chapter 3 notes under OQ-38.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015.
- Chapter 1 (`docs/rules/01-core-rules.md`, `data/core/`, OQ-01 to OQ-18).
- Chapter 2 (`docs/rules/02-character-creation.md`, `data/character/`, OQ-19 to OQ-38).
- Both round 1 reviews: `03-harm-and-mind-review-1.md` and `03-harm-and-mind-review-1-codex.md`.

I did not read the parallel round 2 Codex review.

Odds come from Python scripts in the scratchpad, which are not committed. The YAML was converted to JSON with Ruby's standard library and read unmodified:

- Critical Injury and Death Roll odds are exact, enumerated from the rows.
- Treat Injury odds use 200k rolls per case.
- The Grab model uses 60k trials per cell.

The appendix gives the models.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

The round 1 fixes landed cleanly. Of the ten round 1 Majors, nine are resolved and one is partly resolved. No fix broke a table, a reference, or a figure. Every figure the chapter quotes reproduces exactly.

**No Critical findings.**

- No rule rests on GM discretion.
- No ADR or glossary departure is left unlogged.
- No `_Avoid_` term appears.
- No Phase 2 procedure is drafted.
- Nothing in Chapter 3 changes a Chapter 1 or Chapter 2 rule. Careful Nursing now matches the closed Talent.

**The Grab target is still reachable**, but only in a narrow regime (finding 2).

**Three Majors are open.** Two of them were introduced or exposed by the fixes:

1. **End-of-fight Death Rolls reward stalling the end of the fight.** Death Rolls before the care window mean the Squad should delay a Nape kill or a retreat until the dying are treated. One round of delay cuts an untreated `engagement` death from 57.9% to 6.9%.
2. **Section 3.7 measures the Grab levers in the wrong regime.** Its lever sizes come from hand thresholds that ADR-0015's Toughness 1 rules out. In the regime that can reach about 1 in 3, witness Fear Rolls add about 26 points, not 1 to 5. The comrades-close rate then swings 16 points with Squad Stress.
3. **Down that ends before the soldier's turn has two readings.** The prose and `down.yaml` disagree on whether that turn keeps its action.

Five Minors follow.

## Round 1 Majors: status

| Round 1 finding | Status | Evidence |
|---|---|---|
| Opus 1: devour against "every Titan behavior harm is a Critical Injury" | Resolved | `titan_attacks.definition` now covers only the harm a Behavior Table entry inflicts when a card resolves it. `grab_countdown` makes the lift and devour Grab procedure steps with no Severity and no Reaction, and the devour names death. OQ-39 is revised. The remaining indirect-harm gap is finding 4. |
| Opus 2: Lost Arm, Lost Leg, and Lost Eye had no effect while held | Resolved | `row_fields.permanent_effects` and the `record` step apply them from the moment the row is gained. Internal Bleeding, Torn Open, and Bleeding Inside the Skull now carry penalties. |
| Opus 3: care windows made `engagement` limits nearly harmless | Resolved, with a new problem | Fix 1 was adopted: `engagement-end.yaml` puts the Death Rolls before the care window. Untreated `engagement` rows kill a Strength 3 soldier on 8.5% of first Critical Injuries at a rolled Injury Location, and a Strength 4 soldier on 7.1%; both reproduce exactly. The fix creates finding 1. |
| Opus 4: section 3.7 overstated Chapter 3's Grab levers | Partly resolved | "The main lever" is gone, and OQ-50 now reports action loss (2/6, 3/6, and 4/6 at Resolve 3; verified). The measured sizes come from hand thresholds ADR-0015 rules out. Finding 2. |
| Opus 5: a soldier who leaves a Titan Engagement had no rule | Resolved | OQ-56 and `soldiers_who_left` cover turns, the same-Position rule for Treat Injury and Rally, and the end steps. The Help and Cover gap is finding 7. |
| Opus 6: the Reaction ban's length depended on turn debt | Resolved | `no-reactions` now runs to the end of the first turn that begins after the result (the second for Shattered), whichever turn is spent. Step 1 ends every ban. |
| Opus 7: Squad-wide Grief saturated | Resolved within Chapter 3 | Fixes 1 and 2 were adopted. Fix 3's relief target and simulator case are recorded in OQ-52. Saturation across several Expeditions still rests on the unwritten Downtime rules, as OQ-52 logs. The uncapped Grief outside a Titan Engagement is finding 6. |
| Codex 1: a fifth Scar in the end care window retired the soldier mid-procedure | Resolved | `retirement.timing` and `during_the_steps` hold Retirement to the last step, and `sheet-fields.yaml` has `retiring`. The remaining "at once" branch is part of finding 5. |
| Codex 2: Careful Nursing widened to self-treatment | Resolved | Section 3.6, `healing.yaml`, and `treat-injury.yaml` all require a comrade's Critical Injury, as the Talent says. |
| Codex 3: healed amputations reset worsening | Resolved | `worsening.counts` includes healed rows with permanent effects, and each such row has a `repeat_row`. All three repeat rows exist and have no permanent effects of their own. |

Round 1 Minors:

- **Resolved:** Opus 8, 9, 10, 11, 12, 13, and 15, and Codex 4 and 5.
- **Logged:** Opus 14, as OQ-49's Drive note.

## Checks that passed

- **Every table is complete and rollable** (integrity script):
  - The Injury Location table covers every D6 total from -3 to 12 exactly once.
  - All four Critical Injury tables cover every total from -5 to 60 exactly once.
  - The Stress Response and Fear Roll tables cover -30 to 40.
  - Death Roll outcomes cover 0 to 30 successes.
  - The Scar table covers all 36 D66 results, with no extra values.
  - Every `non_lethal_cap` row exists and is neither lethal nor instant death.
- **Every row is well formed.** Every lethal row has a time limit and every non-lethal row has none. Every row except instant death and Steady or Steeled has an effect.
- **Every reference resolves:**
  - Every effect type.
  - All 31 Catalog entries named by a penalty.
  - Every Talent the chapter names.
  - Every OQ id cited in the chapter and its YAML, including OQ-56.
- **Every quoted figure reproduces exactly:**
  - First Critical Injury at a rolled Injury Location: lethal 15.3% and Down 10.6%. Of the 15.3 points, 14.4 have an `engagement` limit and 0.9 a `turn` limit.
  - Torso lethal 8.3%, 27.8%, and 50.0% with 0, 1, and 2 held, plus 8.3% instant death with two.
  - Head: Down 41.7% with none held; lethal 63.9% and instant death 8.3% with two.
  - The crushing Critical Injury: Down 16.7%, 41.7%, and 72.2%, against 11.1%, 30.6%, and 47.2% for an ordinary torso Critical Injury. Its Break Free penalty spread is 16.7 / 41.7 / 25.0 / 16.7%.
  - Death Roll: live 42.1%, 51.8%, and 59.8%; slow 7.4%, 13.2%, and 19.6%; 26.3% with 6 dice.
  - The three-turn figures (42.1% after one turn, 15.1% after three), and OQ-43 (g)'s corrected 2.9%.
  - OQ-47's Stress Response claims and OQ-50's action-loss and turn-loss figures.
  - OQ-52's lowest Resolve of -1.
- **Grab alone figures reproduce in my model:**
  - A lone Rookie with Break Free at 3 successes dies 60.6% of the time, and 34.4% at 2.
  - With 1 or 2 torso Critical Injuries already held, a lone Rookie dies 74.3% and 88.3% of the time.
- **No glossary `_Avoid_` term** appears in the chapter or its YAML.
- **Phase 2 content is only forward-referenced:** Expeditions, Downtime, Havens, Chases, and instructors and contacts.
- **Chapters 1 and 2.** This workspace has no `.git`, so edits cannot be diffed. A content check found no Chapter 3 row added to `data/core/` or `data/character/`, and no Chapter 3 rule that changes a Chapter 1 or Chapter 2 rule. The OQ-38 note correctly defers the promotion order to Chapter 2's next revision.
- **The worked example.** The rows match the YAML, and the turn spending now matches OQ-09. Finding 8 covers one clarity gap.

## Findings

### 1. Major. End-of-fight Death Rolls before care make stalling the end of a Titan Engagement the best play

**Location:**

- Section 3.4 (`engagement`: "Only treatment during the fight prevents that Death Roll").
- Section 3.16, steps 4 to 6.
- `death-rolls.yaml` (`time_limits`, `engagement`); `engagement-end.yaml` (`death-rolls`, `care-window`).
- OQ-54 (b), "The cost of (b)"; OQ-42's simulator case.
- ADR-0014: "a prepared Squad of 4 kills a standard Medium Titan in about 3 rounds".

**Problem:** The end of a Titan Engagement is a clock the players control:

- A Nape kill ends the fight. Chapter 1 also lets a retreat end it.
- Under (b), that moment fires every `engagement` Death Roll with no chance to treat first.
- While the fight goes on, a comrade can treat on their turn.

One round of delay changes the odds a lot. Take an untreated `engagement` row with no penalty, at Strength 3:

| Who treats during one extra round | Treat Injury succeeds (one Push) | Death at the end of the fight |
|---|---|---|
| Nobody | none | 57.9% |
| An untrained comrade (Wits 2, no kit, Stress 1) | 66.2% | 19.6% |
| The soldier alone (Wits 3, kit 1, Stress 1, 2-die self penalty) | 61.7% | 22.2% |
| A Rookie Medic (Wits 4, Field Medicine 1, kit 1, Stress 1) | 88.1% | 6.9% |

Delaying the kill by one round is worth 38 to 51 points of a comrade's life. A Titan card or two is the only price. So a Squad with a bleeding comrade should:

- hold a ready Nape strike, and make a Body Part strike or Read instead;
- or stay in reach one more round rather than retreat.

That runs against canon's instinct to kill fast. It also slows every fight that ADR-0014's kill-in-3-rounds target measures.

The stalling also hands back most of round 1 finding 3. When players stall for one attempt, `engagement` rows kill about 1.0% of first Critical Injuries with a Rookie Medic, and 2.8% with an untrained comrade. OQ-42 offers 8.5% as the untreated dial. At "about 1 PC Critical Injury" per Expedition, the rows give 0.01 to 0.03 PC deaths, against a target of 0.25 to 0.33.

OQ-54 records only the other cost of (b): a soldier hurt by the last card before a kill cannot be treated.

A smaller version of the same incentive applies to `turn` rows. Take a soldier with Internal Bleeding at Strength 3, whose Death Roll uses 2 dice:

- If the kill comes after their turn ends, they roll twice: once at the end of that turn and once at step 5. They live 9.4% of the time.
- If the kill comes before their turn, they roll once, at step 5. They live 30.6% of the time.

**Scenario:**

1. Round 3: a swat gives Private Hale an Opened Artery (`engagement`, not Down).
2. Kaya holds Blind Spot with three Openings and a likely kill.
3. Mila is one Position step from Hale.
4. The table reasons: if Kaya cuts now, Hale rolls 3 dice at step 5 and dies 58% of the time. If Kaya waits a round, Mila moves to Hale and treats, and Hale's risk falls to 7%.
5. Kaya makes a Body Part strike instead. The Titan plays two more cards.
6. Every fight with an `engagement` wound goes the same way.

**Fix options:**

1. **Give `engagement` a clock of its own.** It runs out at the end of the soldier's third turn after it was gained, counted as for `turn`, or when the Titan Engagement ends, whichever comes first. Stalling then buys only the turns that remain. A soldier who survives that roll continues as `day`.
2. **Add an aftermath roll before step 5.** Each soldier who ends the Titan Engagement at a patient's Position, or who left with that patient under OQ-56, may make one Treat Injury roll on that patient, with no Help. Ending the fight then costs no more than one round of treatment. This also removes the "hurt by the last card" cost that OQ-54 records.
3. **Keep (b) and log the incentive in OQ-54.** Add a simulator case: how often a Squad with a dying comrade delays a kill or a retreat, and the effect on ADR-0014's kill-in-3-rounds and PC death targets.

### 2. Major. Section 3.7 quotes Grab lever sizes from a regime ADR-0015 rules out. Where 1 in 3 is reachable, witness Fear Rolls are the main lever and swing with Squad Stress and Grief

**Location:**

- Section 3.7, *What these parts can and cannot do*: "Witness Fear Rolls add about 1 to 5 points", "deaths stay under 18% even when freeing the soldier takes 5 successes on the hand", and "The Down row raises a lone Rookie's chance of dying by about 19 points".
- OQ-42, *Review round 1 Grab models*; OQ-50's simulator case.
- ADR-0015 (hand Toughness 1), ADR-0007 (Intact, Wounded, Broken), ADR-0014 (Grab target).

**Problem:**

- **The hand threshold.** Under ADR-0007, a Toughness 1 hand is Wounded at 1 accumulated success and Broken at 2. Unless Chapter 5 adds a new freeing threshold, the successes that free a Grabbed soldier (H) are 1 or 2. Round 1's sizes came from H = 3 to 5, with every comrade getting two rescue actions.
- **That regime cannot reach the target.** With H = 1 or 2 and two rescue actions each, the model gives:

  | Rescuers (two rescue actions each) | H = 1 | H = 2 |
  |---|---|---|
  | 2 comrades | 0.3% | 2.7% |
  | 1 comrade | 4.5% | 20.2% |

  With two comrades close, 1 in 3 is out of reach. Chapter 5 must cut rescue opportunities, for example by letting the lift take the hand out of reach, so each comrade gets about one rescue action.
- **In the one-action regime, Chapter 3's Fear Rolls dominate.** With two comrades, one rescue action each, Break Free at 3 successes, and witnesses at Resolve 3 and Stress 2:
  - H = 2: 33.5% with Fear Rolls, 7.3% without, so Fear Rolls add about 26 points.
  - H = 1: 19.8% with Fear Rolls, 0.9% without.
- **The rate then depends on Squad Stress and Grief**, which Chapter 5 cannot set. Two comrades, one action each, H = 2:

  | Witness | Stress 1 | Stress 2 | Stress 3 |
  |---|---|---|---|
  | Resolve 3 | 26.0% | 33.5% | 42.1% |
  | Resolve 2 (one Grief) | 34.7% | 42.5% | 51.8% |

  At H = 1 the rows are 10.5 / 19.8 / 32.4% and 19.6 / 31.4 / 45.2%. At Stress 3 with one Grief, the comrades-close case (45% to 52%) is closing on the alone case (60.6%).
- **The Down row's size depends on the replacement row.** Replacing its Down results with Crushed Ribs (2 dice off Break Free) instead of a non-Down shift gives 53.9% against 60.6%. That is about 7 points, not 19.

The target stays reachable, so this is not Critical. But section 3.7 is Chapter 5's brief, and it points at sizes that are wrong by a factor of five.

**Scenario:**

1. A Chapter 5 drafter trusts section 3.7. They set the lift to take the hand out of reach and H = 2.
2. Expecting under 10% plus "1 to 5 points" of Fear, they also let only On Body soldiers strike the hand.
3. In play, two Rookies close at Stress 2 already lose the victim 33.5% of the time before that restriction.
4. After a bad Expedition the Squad sits at Stress 3 with a point of Grief each. Every Grab kills about half the time with comrades close, near the alone rate.

**Fix options:**

1. **Rewrite section 3.7 for H = 1 to 2** with one or two rescue actions:
   - Give the Fear Roll effect and its Stress and Grief sensitivity.
   - Delete the "5 successes on the hand" sentence.
   - State the Down row's size as a range that depends on the replacement assumption.
2. **Extend OQ-50's simulator case:** the comrades-close Grab rate at witness Stress 1 to 3 and Grief 0 to 1. Record a tolerance band for "about 1 in 3" that Chapter 5 must hold across it.
3. **If the swing is unwanted, make fewer rows cost the rescue action.** For example, Hesitate gives a 1-die next-roll penalty instead of spending the action. At Resolve 3 and Stress 2, a witness would then lose the rescue 2 times in 6 instead of 3. Re-run the model.

### 3. Major. Down that ends before the soldier's turn in the same round has two readings

**Location:**

- Section 3.3, *What a Down soldier cannot do* ("A soldier who becomes Down loses any action they still hold this round") and *Ending Down* ("A turn already under way when Down ends keeps no action until that turn is over").
- `down.yaml`: `becoming_down_mid_round` and `ending.after_ending` ("The soldier's next turn has its move and action as normal").
- Chapter 1, section 1.9 (OQ-09: a Reaction spends the earliest turn "whose move and action are both unspent").

**Problem:** A soldier can become Down from a Titan card before their turn this round comes up. The two closed rules then conflict:

- `becoming_down_mid_round` takes "any action they still hold this round", including the action of the turn not yet taken.
- If a comrade treats them before that turn, `after_ending` says "the soldier's next turn has its move and action as normal". This round's turn is that next turn.

ADR-0003 item 8 leaves the table no way to pick. The same gap decides what a later Reaction does. If the lost action makes this round's turn no longer "both unspent", a dodge later this round spends next round's turn instead.

The worked example avoids the case, because Oskar's dodge had already spent his turn. The case is common. A head Critical Injury puts the soldier Down 41.7% of the time, and a comrade ahead of them in the round can treat them first.

**Scenario:**

1. Round 2: before Kaya's turn, a card lands a Head Blow on her (she chose not to dodge), and she is Down.
2. Mila, next in order at the same Position, treats her. Down ends.
3. Kaya's turn comes up in Blind Spot with two Openings on the Titan.
4. Her player reads *Ending Down* and makes a Nape strike. The GM reads "loses any action they still hold this round" and allows only her move.
5. A card later that round targets Kaya. Whether her dodge spends this round's turn or next round's depends on which reading won.

**Fix options:**

1. **Keep the unplayed turn.** "A soldier who becomes Down loses the action of any turn of theirs this round that has begun or ended. A turn that has not yet come up keeps its action if Down has ended by then." That makes a same-round treatment worth an action.
2. **Take this round's action either way.** "Becoming Down spends the action of this round's turn, whether or not it has come up." Change `after_ending` to "the soldier's turn in the next round". State that a turn whose action was taken this way is no longer both unspent for a Reaction.
3. Under either option, add a sentence to OQ-45 and a bullet to the example.

### 4. Minor. Harm from a Titan behavior that reaches the soldier through another rule has no closed kind

**Location:** Section 3.1 ("Every such harm is a Titan attack. It is always a Critical Injury and never damage"); `health.yaml` (`titan_attacks.definition`, `harm_kinds[damage].named_by`); section 3.3's forward reference ("a soldier who becomes Down while airborne", Chapter 4); OQ-39.

**Problem:** "The harm a Behavior Table entry inflicts" does not say whether it covers harm that follows from the entry through another rule. Examples:

- A Down soldier falling from their anchor.
- ODM Gear worn to a Jam that "drops an airborne soldier" (glossary).

Chapter 4 names falls as damage. Section 3.1 says any harm from a Behavior Table entry is a Critical Injury and never damage. OQ-39 rejected (b) to avoid judging "is it an attack", but the chain case brings the judgment back.

**Scenario:** A swat lands a Head Blow on an airborne soldier, who is Down. Chapter 4 drops them. One reading applies Chapter 4's fall damage. The other says the fall is harm the swat inflicted, so it must be another Critical Injury.

**Fix options:**

1. In `titan_attacks.definition`, add: "the harm named on the entry itself. Harm that another rule causes as a result, such as a fall or a Jam, is the kind that rule names." Record it in OQ-39.
2. Make Chapter 4's fall rule state that a fall caused by a Titan attack deals damage, and cross-reference it here.

### 5. Minor. Chapter 3 interrupts procedures outside a Titan Engagement that it cannot see

**Location:**

- Section 3.5, *Care windows* (the outside-harm window: "At once ... Its scope is every soldier in the Squad").
- Section 3.13, *Retirement* ("Any other fifth Scar retires the soldier at once"; "after that window and the Death Roll that follows it").
- `treat-injury.yaml` (`care_windows.held[outside-harm]`, `retry`); `scars.yaml` (`retirement.timing`).
- OQ-44 (j) and (k); OQ-51 (i).
- Chapter 2 `promotion.timing` ("otherwise immediately").

**Problem:** Several rules act "at once" outside a Titan Engagement:

- **Mid-Chase windows with no Position requirement.** The outside-harm window opens at once, in the middle of whatever procedure caused the harm. A Chase is the obvious case. Every soldier in the Squad gets a roll, with no Position requirement.
- **Fresh windows reopen failed rolls.** Each new harm opens a fresh window, and "a failed roll can be tried again only in a later care window". A second rider's fall therefore lets everyone retry the first patient.
- **OQ-44's reasoning does not match its scope.** It rejects (k) because it "lets a soldier at headquarters treat someone on an Expedition". The outside-harm and day windows still use exactly that scope.
- **One window or two is unstated** when one event harms two soldiers.
- **A missing Death Roll in the Retirement timing.** "After that window and the Death Roll that follows it" has no Death Roll when the window was opened by Down alone.
- **Chase Scars still retire mid-procedure.** A fifth Scar from a Chase Fear Roll falls under "any other fifth Scar ... at once", despite "Retirement never interrupts a procedure".
- **Promotion does not wait.** Under Chapter 2, a player character who dies at step 2 of a day passing is promoted immediately, while one who retires that night waits.

**Scenario:** In a Chase, a Squadmate is crushed Down at Grabbing Distance.

1. A window opens. A rider already at Escaped treats them with no Position requirement, and fails.
2. Next Chase round, another rider falls and a second window opens.
3. The first treater retries the Squadmate.
4. The Chase procedure has been paused twice.

**Fix options:**

1. **Default the outside-harm window to the end of the calling procedure.** Its scope is the soldiers that procedure names. A procedure that states nothing (such as a Leg hazard) holds the window at once, with every soldier on the Expedition.
2. **Limit windows per event and retries per patient.** One window per event, however many soldiers it harms. A soldier who has rolled on a patient in a care window cannot roll on that patient again until a day passes.
3. **Close the Retirement timing.** Change the last branch to "retires when the procedure in which it was gained ends", and "the Death Roll that follows it, if any". Note the promotion-timing difference in OQ-38 for Chapter 2's next revision.

### 6. Minor. Grief from deaths outside a Titan Engagement is uncapped, so when a comrade dies changes the whole Squad's Resolve

**Location:** Section 3.14 (*How much*); `grief.yaml` (`amount[0].limit`: "A death outside a Titan Engagement gives 1 Grief for that death"); OQ-52 (l).

**Problem:** The deaths of one Titan Engagement give each soldier at most 1 Grief. Deaths outside one give 1 each, with no cap. Two comrades carried out alive who fail `day` Death Rolls at the same night camp give every survivor 2 Grief. The same two failing their step 5 Death Rolls give 1. OQ-52's reason for (l) was stopping one bad event from taking two or three points of Resolve at once, and that applies equally to one bad night.

**Scenario:** Two Squadmates survive the end of a fight with `day` limits, and both fail at the night camp. Every soldier loses 2 Resolve before the next day's Leg. Had they died an hour earlier at step 5, each would have lost 1.

**Fix options:**

1. Cap Grief at 1 per soldier per procedure outside a Titan Engagement: one day passing, one outside-harm window, or one Chase.
2. Cap it at 1 per soldier per day, plus the named-comrade and Numb additions.

### 7. Minor. Soldiers who left can treat and Rally each other, but not Help or Cover those rolls

**Location:** Section 3.16, *Soldiers who left before the end*; `engagement-end.yaml` (`soldiers_who_left.same_position`); section 3.5, *In a Titan Engagement* ("It can be Helped ... Pushed, and Covered"); Chapter 1, sections 1.5 and 1.8; OQ-56.

**Problem:** The same-Position rule for leavers covers only Treat Injury and Rally. Help and Covering in a Titan Engagement need the same Position or one step (Chapter 1), and a leaver holds none. Section 3.5 says Treat Injury "can be Helped ... and Covered", so it is unclear whether that holds between leavers.

**Scenario:** Mila and Ines carry Oskar out while the fight goes on. Mila treats him and Ines declares Help. One reading allows it, because Treat Injury between leavers counts as the same Position. The other forbids it, because Help's own requirement is not covered.

**Fix options:**

1. Extend `same_position` to Help and Covering on a Treat Injury or Rally roll made between soldiers who have left.
2. State that such rolls cannot be Helped or Covered, and add it to OQ-56.

### 8. Minor. The worked example's care-window roll uses stats it never gives Oskar

**Location:** *Example: a bad round*, the care window bullet.

**Problem:** "Wits 2 and Hale's Bonus Die make 3 base dice ... His medical kit adds 1 Gear Die". The example gives Oskar's Strength, Agility, Instinct, and Empathy, but never his Wits. The only medical kit named earlier is Mila's. A reader could take "Wits 2" and the kit as Mila's.

**Fix options:**

1. Add Oskar's Wits 2 and his medical kit to the opening line.
2. Write "Oskar's Wits 2" and "Oskar's own medical kit" in the bullet.

## Provisional decisions OQ-39 to OQ-56

| OQ | Judgement |
|---|---|
| OQ-38 note | Accurate. It correctly records that Chapter 3 batches promotions at step 8 and carries option (c) forward. |
| OQ-39 | Sound after the revision. It gives the devour one closed reading. The chain-harm gap is finding 4. |
| OQ-40 | Sound. |
| OQ-41 | Sound. The consequence of untracked sides is now closed by `repeat_row`. |
| OQ-42 | Sound. The rows, cap, worsening with healed permanent rows, and permanent effects from gain are closed and rollable, and every figure reproduces. The Grab model summary is in the wrong regime (finding 2). |
| OQ-43 | Sound. Every figure reproduces. |
| OQ-44 | Sound procedure. The window scope reasoning contradicts itself for the outside-harm and day windows (finding 5). |
| OQ-45 | Sound. The mid-round ending conflict is finding 3. |
| OQ-46 | Sound. (e) fixes round 1's ban length with no new unit. |
| OQ-47 | Sound. |
| OQ-48 | Sound. |
| OQ-49 | Sound. `faced_a_titan` is closed, and the Drive note is logged. |
| OQ-50 | Rows sound, and the action-loss figures are correct. Their effect on the Grab target is about five times larger than section 3.7 says, and depends on Squad Stress and Grief (finding 2). |
| OQ-51 | Sound. The remaining "at once" branch is finding 5. |
| OQ-52 | Sound improvement. The cap does not cover deaths outside a Titan Engagement (finding 6). |
| OQ-53 | Sound. |
| OQ-54 | (b) fixes round 1's harmlessness, but makes stalling the end of a fight the best play (finding 1). (c) and (g) are sound. |
| OQ-55 | Sound. |
| OQ-56 | Sound choice. It keeps one clock per Titan Engagement. The Help and Cover gap is finding 7. |

## Appendix: models

**Exact enumerations** read the rows from the YAML:

- Critical Injury odds enumerate 2D6 with worsening, the cap, and the D6 Injury Location weights.
- Death Roll odds are binomial on 6s. The `turn` model rolls at the end of each turn, and a slow to `engagement` ends the rolls for the fight.

**Treat Injury** (200k rolls per case):

- One roll with one Push when there is no success and no Stress Die shows 1.
- Pools follow Chapter 1, with penalties applied to base dice and a minimum of 1.
- Death at the end of the fight is (1 - treatment) × 57.9%, for Strength 3 with no penalty.

**Grab model** (60k trials per cell). Chapter 3 parts exact:

- The torso roll uses the cap, Down, the Break Free penalties, and Winded's Stress.
- Rolls follow Chapter 1: one Push when short, unless a Stress Die shows 1. The Stress Response is resolved on the table at Resolve 3, including lost successes, the roll failing, a spent turn, lasting penalties, and "next row down".
- Each witness makes a Fear Roll before rescuing. Hesitate or Falter costs 1 action, Frozen, Unguarded, or Breaking Point costs 1 turn, and Shattered costs 2 turns. Stress gains and Rattled's next-roll penalty apply to the witness's strike.

**Grab model, Chapter 5 assumptions:**

- The victim is a Rookie: Strength 4, Grip Breaker 1, Blade Set 1, Stress 2, Resolve 3. They take two turns, and Break Free needs N = 3 in one roll.
- A comrade's rescue is a Body Part strike on the hand: Strength 4, Talent 1, Blade Set 1, Stress 2, Push when it has no success. Successes accumulate toward H.
- Comrades act before the victim each round. "Two actions" means the hand stays in reach through both victim turns. "One action" means only before the lift.
- The "never Down" variant replaces a Down cap result with Crushed Ribs.
