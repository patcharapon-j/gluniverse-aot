# Chapter 2, Character Creation: review round 2

Reviewed:

- `docs/rules/02-character-creation.md` and every file in `data/character/`.
- The Chapter 2 edits to `data/core/dice-pool.yaml`, `data/core/stress-changes.yaml`, and `data/core/bonus-dice-sources.yaml`.
- OQ-19 to OQ-35 in `docs/rules/OPEN-QUESTIONS.md`.

Checked against:

- `CONTEXT.md`, ADR-0001 to ADR-0015, and Chapter 1 (`docs/rules/01-core-rules.md`, OQ-01 to OQ-18).
- Both round 1 reviews (`02-character-creation-review-1.md` and `02-character-creation-review-1-codex.md`).
- The final design review brief and both final design reviews.

I did not read the parallel round 2 Codex review.

Odds come from Python simulations in the scratchpad, which are not committed. The YAML was converted to JSON with Ruby's standard library and read directly:

- Lifepath runs use 200k Cadets.
- Exam runs use 20k Squads of four, 30k pairs, and 60k single Cadets.
- Nape strike runs use 400k strikes.

The appendix gives the models. An integrity script found:

- All five D66 tables are complete.
- Every Talent, entry, act, tracked value, template, and OQ id resolves.
- Every dice Talent names only `action`, `reaction`, or `roll` entries.
- The Specialty and Talent lists agree in both directions.
- Every attribute's `used_by` list matches the Catalog.
- All nine Squadmate templates total 18 points with key attribute 4, and their Health and Resolve match OQ-24.
- The Mira example still matches the YAML at every step.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

The fix round worked. Every Critical from both round 1 reviews is resolved, and so is every Major except two:

- **Opus 6 (the Graduation Exam), partly resolved.** Chapter 3 results are gone from the Exam, but its parity still depends on how players Push.
- **Codex 6 (actions outside the Catalog), partly resolved.** It is logged as the ADR question OQ-35, which is the right place for it.

No rule rests on GM discretion, no ADR or glossary contradiction is left unlogged, and no ADR-0014 target is made unreachable. On this review, Chapter 2 has no open Critical.

Two Majors remain:

1. **The Graduation Exam still pays more when played well.** OQ-22's "best policy found" is not the best. Pushing on the squad field exercise whenever a roll falls short makes the Exam pay more Merit than the roll it replaces. Top 10 graduates rise from 6.2% to 8.6% in a Squad of four, and to 12.6% for a Cadet who takes the Exam alone.
2. **Drives only work inside a Titan Engagement.** Eleven of the twelve Drives, and every "once per Titan Engagement" Talent, can never apply anywhere else. Fear Rolls, Gas Rolls, and wear will also happen in Chases, Legs, and Operation Frames, and neither OQ-23 nor OQ-28 records the limit.

Eight Minors follow. The most useful ones:

- The gear rule tests whether a soldier has an item, not whether it still works.
- Two own-state Drives can be met without acting.
- OQ-33's "no soldier is forced into a dormant level" is false for 2.8% of soldiers.

## Round 1 verification

### Opus review 1

| # | Finding | Status | Evidence |
|---|---------|--------|----------|
| 1 | Critical. Squadmate action list is exclusive permission by Specialty | **Resolved** | `action_list.entries` is every entry a player character can take as an action, plus options. `specialty_action` is gone. OQ-29 (m). |
| 2 | Critical. Drives trigger on world states; four break "When I ..." | **Resolved** | All 12 triggers begin "When I". Grief, Stress, injury, comrade-state, and Body Part triggers are gone. OQ-23 (i). New scope problems are findings 2 and 4. |
| 3 | Major. Graduation floor rewards the lowest-key Specialty | **Resolved** | Swap, then floor. The total is always 18 before the Top 10 bonus: 93.8% at 18 and 6.2% at 19. |
| 4 | Major. Choosing the enlistment row moves key attribute 5 or 6 by 17 points | **Resolved** | The attribute comes from the rolled row, and the Drive can come from any row (`enlistment.yaml` `use`). |
| 5 | Major. Squadmates out-build player characters; promotion's Talent source undefined | **Resolved** | Templates total 18 with a non-key mean of 2.8. Promotion takes rolled Origin and event Talents. A small collision gap is in finding 9. |
| 6 | Major. The Exam makes Pushing free; Chapter 3 results with no meaning | **Partly** | Stress Responses now cost 1 Merit and the `also` clause is gone. Parity still rests on a Push policy OQ-22 does not state, and its best policy is not the best (finding 1). |
| 7 | Major. `without_gear` applied only to uncatalogued actions | **Resolved** | `gear_requirement` is a top-level rule for every use of an entry. Make Do names it. A possession gap is in finding 3. |
| 8 | Major. Relentless moves both solo Nape targets | **Resolved** | OQ-28 (k): an extra Opening, with no change to the striker's roll. A smaller follow-up effect is in finding 5. |
| 9 | Major. Lifepath hands out Talents no Phase 1 rule uses | **Resolved** | Soldiers with at least one unusable level fell from 57% to 2.8%. OQ-33's claim of none is corrected in finding 6. |
| 10 | Major. Named comrade lifecycle holes | **Resolved** | A Drive now dies only when its comrade leaves the Squad, and promotion does not count as leaving. A Drive recorded later names its comrade then. |

### Codex review 1

| # | Finding | Status | Evidence |
|---|---------|--------|----------|
| 1 | Critical. Relentless makes the solo Nape targets mutually unreachable | **Resolved** | OQ-28 (k). A first strike is unchanged: Rookie 12.5%, Levi-grade 47.3% at Depth 4. |
| 2 | Major. Choosing the enlistment row invalidates OQ-19 | **Resolved** | As Opus 4. OQ-19's figures reproduce under the current rule: key attribute 4 / 5 / 6 at 63.6 / 34.3 / 2.2%. |
| 3 | Major. Merit table unreadable at 4 or more successes | **Resolved** | `merit_from_successes` uses `successes_min` and `successes_max`. |
| 4 | Major. Permission-changing rule Talents trigger too late | **Resolved** | Eleven Talents use "You declare" triggers, and `trigger_timing` spends nothing on a use that fails. OQ-34. |
| 5 | Major. Exam reset erases lasting harm | **Resolved** | No Chapter 3 result arises during the Exam. The Stress row is Stress-only. |
| 6 | Major. OQ-27 omits the attribute-alone branch | **Partly (logged)** | A `rule-named-value` route was added, and the rest is ADR question OQ-35. See the OQ-35 judgment. |
| 7 | Major. Squadmates bypass gas, blades, and carrying | **Resolved** | OQ-29 (g): full gear tracking and a two-die Gas Roll. |
| 8 | Major. Promotion heals and creates gear | **Resolved** | Health lost, Down state, and gear are kept, and nothing is recalculated. |

Round 1 Minors are mostly fixed:

- **Still open:** the missing Talent descriptions (Opus 16) and Chapter 1 section 1.3's stale "the Death Roll's exceptions" (Opus 13). Both are in finding 10.
- **Partly addressed:** the Merit skew (Opus 11), in finding 7.

## Findings

### 1. Major. The Graduation Exam pays more than the roll it replaces under simple play, and much more for small groups; OQ-22's parity figures rest on a policy that is not the best

**Location:**

- Section 2.4, *How the Exam is played* and *The three Trials*, and the PROVISIONAL (OQ-22) block.
- `graduation-exam.yaml`: `conditions.stress_responses`, `conditions.merit`, `trials[squad-field-exercise]` (`needs: 2`, `merit`, `squad_bonus`), and `use.applies_to` ("every Cadet being created at the same time").
- OQ-22, *Why*, the simulated bullets.

**Problem:** Two things decide whether a Push pays:

- **Squad field exercise.** A Push when a roll falls short of 2 successes risks 1 Merit only if a Stress Die shows 1, which is about 1 in 6 for a Cadet at Stress 0. It re-rolls four to six dice for the one success that pays 1 Merit and helps earn the squad bonus.
- **Trials 1 and 2.** A Push at exactly 2 successes re-rolls a few dice for the third success that pays 1 Merit. A Cadet with Agility 3, Wirework 1, and Gear Dice 1 who rolls two 6s re-rolls 3 dice: 42% to gain the Merit, 17% to lose one.

OQ-22 simulated three policies:

- "Never Push" reproduces here: 0.33 Merit, Top 10 4.3%.
- "Push whenever below 3" reproduces closely: 0.15 Merit and 6.7% here, against OQ-22's 0.19 and 6.8%.
- "Push only after 0 successes" was reported as the best found. It is dominated by the policy above.

Four Cadets, one helper each on the squad field exercise, gear wear tracked between Trials:

| Push policy | Exam Merit | Year 3 roll it replaces | Top 10 with Exam | Top 10 without | Cadets with a Stress Response |
|---|---|---|---|---|---|
| Never | 0.33 | 0.58 | 4.3% | 6.2% | 0% |
| Squad field exercise when short; Trials 1 and 2 never | 0.72 | 0.58 | 7.8% | 6.2% | 12% |
| Squad field exercise when short; Trials 1 and 2 at exactly 2 successes | 0.73 | 0.58 | 8.6% | 6.2% | 21% |
| As row 2, with a Cadet who has already rolled Covering | 0.74 | 0.58 | 7.7% | 6.3% | 3% |
| Whenever short on every Trial | 0.49 | 0.58 | 7.9% | 6.3% | 46% |

The squad bonus needs every Cadet's roll to succeed, so the Exam's value depends on how many Cadets take it. Same policy as row 3:

| Cadets taking the Exam | Exam Merit | Top 10 with Exam | Top 10 without |
|---|---|---|---|
| 1 | 0.99 | 12.6% | 6.5% |
| 2 | 0.97 | 11.5% | 6.4% |
| 4 | 0.73 | 8.6% | 6.2% |
| 6 (Covered Pushes where possible) | 0.64 | 7.0% | 6.3% |

Three consequences follow:

- **The quoted Why is wrong under the obvious policy.** OQ-22 says the Exam "pays less Merit on average than the roll it replaces" and keeps Top 10 "close" (6.8% against 6.1%). Under the policy above it pays about 25% more Merit and raises Top 10 by 39% relative in a Squad of four.
- **Top 10 is the only route to an attribute of 6** (OQ-19, OQ-21), so the share of new soldiers with a 6 rises roughly in step.
- **A replacement character can take the Exam alone.** `use.applies_to` lets a character created mid-campaign after a death run it solo, for about twice the Top 10 chance of every original player character.

**Scenario:** Two players start a campaign and run the Exam.

1. On the squad field exercise, each Cadet Pushes whenever their roll falls short.
2. Each has an 11.5% chance of Top 10, and the pair has a 22% chance that at least one is Top 10. Without the Exam, those are 6.4% and 12%.
3. Months later one soldier dies, and no Squadmate is left to promote. The player builds a new Cadet alone and runs a one-Cadet Exam, where a single success on the squad field exercise pays 2 Merit.

**Fix options:**

1. Re-simulate OQ-22 with "Push the squad field exercise when short, and Trials 1 and 2 at exactly 2 successes" as the reference policy, at 1, 2, 4, and 6 Cadets. Then re-tune the Merit values until Top 10 with the Exam stays within about 1 point of the rate without, at every group size. Two candidates:
   - Squad field exercise success pays 1 Merit and there is no squad bonus.
   - Total Exam Merit is capped at 3, the performance roll's maximum.
2. Give the squad bonus only when at least 3 Cadets take the Exam. A Cadet created alone uses the Year 3 performance roll. Re-quote OQ-22 either way.
3. Keep the values, but rewrite OQ-22's Why to say the Exam raises Top 10 for Cadets who Push on the squad field exercise, with the table above. Record in OQ-21 that the Top 10 rate the Rookie calibration uses assumes no Exam.

### 2. Major. Drives and "once per Titan Engagement" Talents do nothing outside a Titan Engagement, although Fear Rolls, Gas Rolls, and wear will happen there; the limit is not logged

**Location:**

- Section 2.5, *Trigger tests* ("The two turn tests are never met outside a Titan Engagement").
- `enlistment.yaml`: `drive_rules.trigger_tests`, and rows `prove-them-wrong`, `shield-the-walls`, and `freedom`.
- `talents.yaml`: `limit_terms.once_per_titan_engagement` ("Never usable outside a Titan Engagement"), and rows `light-trigger`, `well-kept-rig`, and `blade-discipline`.
- Section 2.7, *Rule Talents*.
- Glossary **Drive** and **Chase**, and ADR-0009 ("gas drains only in Titan Engagements and Chases").
- Chapter 1 OQ-10 ("Holding a Position is the test for being in a Titan Engagement"), OQ-23, and OQ-28.

**Problem:** Only one Drive can be met outside a Titan Engagement:

- **Nine Drives use a turn test,** and a turn test is never met outside a Titan Engagement.
- **Prove Them Wrong and Shield the Walls** name a Position and a Focus Titan's Attention. Both exist only inside a Titan Engagement (Chapter 1, OQ-10).
- **Freedom** ("airborne on ODM Gear") is the only exception.

So 11 of 12 Drives can shrug off only a Fear Roll that arises inside a Titan Engagement.

Nothing confines Fear Rolls there:

- The glossary's example trigger, "a Titan seizing a comrade", is exactly what a Chase at Grabbing Distance produces.
- The fable final review expects Fear sources in Operation Frames (an allied Shifter's clock) and in evacuation and "hopeless order" frames.
- Leg hazards are the other obvious source.

Chapter 3 owns the closed trigger list, but a Drive that stops working in the Squad's other main scene types is a decision about Drives, and it belongs in OQ-23. The glossary's Drive has no such limit, and OQ-23's glossary note does not add one.

The same limit hits three Talents that exist for gas and wear:

- Light Trigger, Well-Kept Rig, and Blade Discipline are "never usable outside a Titan Engagement".
- ADR-0009 drains gas in Chases, and a Chase will call for Pushed Fly or Ride rolls.
- A Flier's gas Talent therefore does nothing in the one other scene where gas is spent.
- OQ-28 justifies Light Trigger's limit only against the Titan Engagement gas target.

**Scenario:** On a Leg, an Abnormal runs down the Squad and a Chase begins.

1. At Grabbing Distance it seizes Private Wendt from his saddle.
2. Voss (Duty) Helped Wendt's Ride roll a moment earlier. Roe (Nothing Left) Pushed his own Ride roll. Hale (Freedom) fired his anchors into a tree line.
3. The Fear Roll results land. Only Hale shrugs his off. Voss and Roe acted on their Drives in the most canonical way possible, but a Chase is not a Titan Engagement.

**Fix options:**

1. Widen the turn tests to any rule that gives soldiers turns: "in the current Titan Engagement, Chase, or other scene whose rules give turns". Let later chapters add own-state states, such as holding Close in a Chase, through a row in `drive_rules`. Do the same for `once_per_titan_engagement`, as "once per Titan Engagement or Chase".
2. Keep the limit, and log it in OQ-23 and OQ-28 with the reason. Change OQ-23's glossary note to "while acting on it in a Titan Engagement". Require Chapter 3's Fear Roll trigger list to mark which triggers can arise outside one, so the simulator can measure the Drive payoff.
3. Give Drives an out-of-Engagement test, such as "When I took the Catalog entry my Drive names on my most recent roll in this scene", and record "scene" as a term the Chase and Expedition rules must define.

### 3. Minor. The gear rule tests whether a soldier has an item, not whether it still works

**Location:** `action-catalog.yaml` `gear_requirement.applies_when` ("the soldier has none of its gear items"); section 2.8, *Entries that need gear*; Chapter 1 section 1.3, step 6 ("An item worn down to 0 adds no dice"); glossary **Jam** ("stops working and drops an airborne soldier").

**Problem:** Wear will be common: under OQ-01, every Pushed roll whose Gear Dice show a 1 wears the item. `gear_requirement` asks only whether the soldier has an item, so a worn-out item still counts:

- **Blade Set worn to 0.** It still meets `nape-strike`'s `requires_gear`, so the soldier strikes at Strength plus Clean Cut.
- **Jammed ODM Gear.** It still meets `fly`'s `requires_gear`, though the glossary says a Jam stops the gear working.
- **Medical kit worn to 0.** Its holder keeps their Field Medicine dice. A Medic who lost the kit rolls Wits alone.

Chapter 4 owns what wear does, but the possession test that decides `not_possible` and `attribute_alone` is this chapter's.

**Scenario:** Private Brandt's ODM Gear Jams on a Pushed dodge in round 3. In round 4 a Chapter 5 Position change calls for `fly`. One table rules her rig is gone and the roll is `not_possible`. The other reads `applies_when` literally and lets her roll Agility plus Wirework with no Gear Dice. Both can cite the file.

**Fix options:**

1. Change `applies_when` to "the soldier has none of its gear items, or every one they have is worn to 0 or, under Chapter 4, does not work".
2. Keep possession as the test, and add a forward line that Chapter 4 states which worn or Jammed items count as not had for `gear_requirement`.

### 4. Minor. Two own-state Drives can be met without acting, which OQ-23's rationale says cannot happen

**Location:** `enlistment.yaml` `trigger_tests.own_state` and rows `shield-the-walls` ("When I hold a Focus Titan's Attention") and `prove-them-wrong` ("When I hold Blind Spot or On Body"); OQ-23, *Why* ("since the soldier's own moves and actions put them there"); glossary **Attention Ladder** ("nearest person in reach ... nearest"); OQ-18's reading that a Grabbed soldier is On Body.

**Problem:** OQ-23 treats own-state triggers as acting because the soldier chose to be there. Two cases break that:

- **Shield the Walls.** The Attention Ladder hands Attention to the nearest person when nothing ranks higher, so a soldier at Distant who has done nothing can hold it. The fable final review notes that Squadmates and bystanders soak "nearest" by default.
- **Prove Them Wrong.** If Chapter 5 keeps a Grabbed soldier On Body, as OQ-18 reads it, being seized meets the trigger.

These are the round 1 Critical's world-state triggers in a narrower form.

**Scenario:** A Titan's Ladder finds no hooked, reaching, or loud target, so its Attention goes to Private Hale at Distant, who spent his turn holding a flare. A Background Titan's clock fills and the Chapter 3 trigger for a second Titan fires. Hale's Shield the Walls shrugs off the result, though he never chose to draw the Titan.

**Fix options:**

1. Make own-state Drives require that the soldier set the state: "When I moved into Blind Spot or On Body since the start of my most recent turn", and "When I hold Attention I took with Draw Attention or a Nape strike".
2. Keep the states, exclude being Grabbed by name, and record in OQ-23 that the Ladder can meet Shield the Walls without an act.

### 5. Minor. Relentless still changes a lone soldier's follow-up Nape strike, and adds an Opening source the glossary does not list

**Location:** `talents.yaml` `relentless` ("The strike creates 1 more Opening than Chapter 5 gives it for its successes"); section 2.7 and OQ-28 ("never changes the striker's own roll, so neither solo Nape strike target moves"); glossary **Opening**; ADR-0014 targets 2 and 3.

**Problem:** Relentless does not change the strike it triggers on. It does change the next one, if the striker can spend the Openings their own failed strike left before Regeneration erases them. The glossary's "any ally" does not say whether that includes the striker.

Nape strike, Stress 1 (plus any Stress gained), Push when short, then a follow-up strike spending the first strike's Openings (cap 4):

| Build, Depth | First strike | Follow-up without Relentless | Follow-up with Relentless |
|---|---|---|---|
| Rookie (4, 1, 1), Depth 4 | 12.5% | 25.8% | 32.0% |
| Rookie, Depth 5 | 3.3% | 12.2% | 16.2% |
| Levi-grade (6, 3, 3), Depth 4 | 47.3% | 58.9% | 63.6% |

Two things follow:

- **The follow-up already exceeds the target.** Even without Relentless, a lone Rookie's follow-up is 26% against ADR-0014's "no more than 10% of Nape strikes". That is a Chapter 5 question about spending one's own Openings. Relentless adds about 6 points on top.
- **Relentless creates an Opening from nothing.** 14% of a Rookie's failed Depth 4 strikes have 0 successes, and Relentless still leaves an Opening. The glossary lists only successes as a source.

**Scenario:** A Slayer with Relentless, fighting alone, uses Break Attention, strikes, and falls short with 2 successes, leaving 3 Openings. Two turns later, after another Break Attention, her second strike rolls 3 extra dice where a comrade without Relentless would roll 2.

**Fix options:**

1. Add "a lone soldier's follow-up strike" to OQ-28's Relentless simulator case. Qualify OQ-28's claim to first strikes, and add a glossary note on the extra Opening source.
2. Limit the extra Opening to strikes with at least 1 success, so it amplifies a near miss rather than creating setup from nothing.
3. Ask Chapter 5 to decide, and record in OQ-28, whether a striker can spend Openings from their own strike.

### 6. Minor. OQ-33's claim that no soldier is forced into a dormant level is false for 2.8% of soldiers

**Location:** OQ-33, *Why* ("leaves no soldier forced into a dead level"); section 2.3.3, *Choosing a Talent*; `training-years.yaml` `talent_cap.if_both_capped`; events "The forced march" (Year 3), "The storm march", "The first inspection", "Three days alone", and "The dismissal list" (Year 1), "The signal relay" and "The notebook" (Year 3), and "Thrown in the yard" (Year 2).

**Problem:** Every row offers a usable Talent, but not always one that can still gain a level. A rule Talent is capped at `max_level` 1, and a dice Talent at 2 during creation. When the usable Talent on an event is already capped and its partner is dormant, the dormant one is the only legal pick. The curriculum fallback does not apply, because it waits until both Talents are capped.

With a player who always takes a usable Talent when one can gain a level, 2.82% of soldiers are forced into at least one dormant level:

| Event | Usable Talent already capped | Share of soldiers |
|---|---|---|
| Year 3 "The forced march" | Strong Back | 1.00% |
| Year 1 "The dismissal list" | Iron Nerve | 0.38% |
| Year 1 "The storm march" | Strong Back | 0.36% |
| Year 1 "The first inspection" | Iron Nerve | 0.34% |
| Year 1 "Three days alone" | Iron Nerve | 0.34% |
| Year 3 "The signal relay" | Horsemanship | 0.32% |

**Scenario:** A Wall Rose Farm Cadet takes Strong Back from the Origin. In Year 3 they roll "The forced march" ([strong-back, long-haul]) and must take Long Haul, which names only the dormant `endure`.

**Fix options:**

1. Extend `if_both_capped` to "if neither listed Talent can gain a level, or the only one that can names only dormant or reserved entries".
2. Replace Long Haul on "The forced march" and "The storm march", and the dormant partner of Iron Nerve on the three Year 1 events, with usable Talents.
3. Correct OQ-33 to "fewer than 3% of soldiers" and leave the tables as they are.

### 7. Minor. The Merit skew is misdiagnosed, and OQ-21's per-attribute figures do not reproduce

**Location:** OQ-21, *Why* (key attribute 6 figures by attribute) and *Known skew*; `training-years.yaml` `merit_change` on each event.

**Problem:** OQ-21 blames Agility events, whose `merit_change` totals -1. The larger driver is Strength. By attribute, event `merit_change` totals are Strength +6, Perception +4, Wits +1, Instinct +1, Empathy 0, and Agility -1.

With the key attribute set to the Cadet's highest rolled attribute:

- **Top 10 chance by highest attribute:** Strength 9.6%, Perception 7.3%, Empathy 6.0%, Wits 5.8%, Instinct 5.2%, Agility 3.7%.
- **Key attribute 6:** Strength 4.2%, Perception 2.8%, Empathy 1.9%, Wits 1.8%, Instinct 1.4%, Agility 0.8%.

OQ-21 quotes Strength 2.8% and Empathy 3.4%, which do not reproduce under this or any stated policy.

OQ-21 rejected raising two Agility events because that moved the Top 10 rate. A move that adds and removes the same amount keeps the rate. The swap softens the effect for players, since a Top 10 Cadet can move their best rating into any key attribute, but the table still favors Strength-heavy soldiers.

**Scenario:** Two Cadets roll mirrored Lifepaths, one through the Strength events and one through the Agility events. The Strength Cadet enters Graduation with 7 more event Merit before any performance roll.

**Fix options:**

1. Move `merit_change` between events so each attribute's total is close to +2 (the current total is +11). For example, "The forced march" +1 to 0 and "Upside down in the harness" 0 to +1. Re-quote OQ-21 with the policy stated.
2. Keep the values, and correct *Known skew* to name Strength's +6 as the driver, with the figures above.

### 8. Minor. The section 2.9 shout example reaches the wrong conclusion

**Location:** Section 2.9, second example ("The only entry that changes it is `call-it` ... the shout has no mechanical effect"); `action-catalog.yaml` `tracked_values` `reaction-dice-add` and `roll-dice-add`.

**Problem:** Step 1 lets the player name any tracked value. A dodge is an attribute roll, so a shout meant to help it can name `roll-dice-add`. That matches `help`, which a soldier at the same Position or one step away with an unspent action can use. The example teaches players that the shout is flavor, when the procedure makes it Help.

More generally, because the player names the value, the described action never limits which entry is reached. That is fine under ADR-0003, and the chapter should say it plainly.

**Scenario:** A new player reads the example and never shouts a warning. A player who read step 1 closely shouts and adds a die to the dodge.

**Fix options:**

1. Rewrite the example: naming "add dice to a comrade's Reaction" needs a Read (`call-it`), but naming "add a die to a comrade's roll" is Help, with Help's requirements and cost.
2. Add a sentence to step 1: the description is flavor, and the named value alone decides which entries can be used.

### 9. Minor. Promotion, named comrade, and roll-off gaps

**Location:** `squadmates.yaml` `promotion.steps` (the Origin step, "gain level 1 in one of its two Talents"); section 2.10, *Promotion*; `enlistment.yaml` `drive_rules.named_comrade`; `lifepath.yaml` `group_choices` and `squadmates.yaml` `wing.directing.disagreement_off_a_wing` ("Each player proposing a different choice rolls a D6").

**Problems:**

- **Origin Talent collision on promotion.** A new Cadet always meets the Origin Talent at level 0. A promoted Squadmate may already hold it at 1 from its template: Rider with Wall Rose Farm, Minor Noble House, or Horse Ranch; Leader with Trost Merchant Family or Church Orphanage; and others. "Gain level 1" can mean set to 1, which gains nothing and leaves the soldier at 4 levels, or add 1 level, reaching 2. The chapter promises 5 levels.
- **No living comrade.** A Drive that needs a named comrade and is recorded when no other soldier is alive in the Squad has no one to name and no fallback.
- **Roll-off wording.** When three players back choice A and one backs B, it is unclear whether all four roll or one die per choice. The odds for A move from 1 in 2 to about 4 in 5 (855 of 1,080 untied outcomes).

**Scenario:** Kessler, a Rider Squadmate with Horsemanship 1, is promoted and rolls Horse Ranch. Her player wants Horsemanship 2, and another player at the table reads "gain level 1" as no gain.

**Fix options:**

1. Change the Origin step in `promotion.steps` to "gain 1 level in one of its two Talents, following `talent_cap`", matching the event step.
2. Add to `named_comrade`: "If no other living soldier is in the Squad, the player picks a Drive that does not need a named comrade."
3. Change both roll-off texts to "Each proposed choice is rolled for once, by a player who proposed it".

### 10. Minor. Data and wording

- **OQ-19's "whichever Specialty" claim.** OQ-19 says its key attribute figures "hold for every choice". 16.3% of Cadets reach Graduation holding both a 5 and a 4. Picking the Specialty keyed to the 4 means no swap: key attribute 4 with a non-key 5. The total is unchanged, so this is not an exploit, but qualify the claim to "for the Specialty whose key attribute is the soldier's highest".
- **Character sheet fields.** `lifepath.yaml` `record_on_sheet` has `health` but no Health lost or Down state. The Squadmate stat block records both, and promotion keeps both.
- **Talent descriptions.** Talent rows still have no player-facing description (Opus review 1, Minor 16). At Graduation, a player choosing between Hunter's Eye and Fieldcraft sees only ids.
- **Stale Chapter 1 text.** Chapter 1 section 1.3 still says `dice-pool.yaml` lists "the Death Roll's exceptions". Chapter 1 is closed, so record the correction under OQ-03 or as a Chapter 1 erratum.
- **Mira's dodge.** "Her dodge rolls only Agility 2" omits Gear Dice and Stress Dice. Say "her dodge's base dice are only Agility 2".
- **Entry groups.** Section 2.8's *Groups of entries* lists only `lift-comrade` and `change-canister` as used in and out of a Titan Engagement. `treat-injury`, `rally`, and `field-repair` also have `context: any`.

**Scenario:** A Foundry importer builds the player character sheet from `record_on_sheet`. The first promoted Squadmate's Health lost and Down state have no field to land in.

**Fix options:**

1. Add `health_lost` and `down` to `record_on_sheet`, a `description` to every Talent row, and the qualifier to OQ-19.
2. Fix the Mira sentence and the group heading.

## Chapter 1 YAML edits

| File and row | Consistent with Chapter 1 prose | Changes a Chapter 1 rule |
|---|---|---|
| `dice-pool.yaml` `roll_exceptions` header ("a later chapter whose rule does so adds a row here") | Yes. It extends the existing "A roll not listed here uses every component and rule above" with the adding pattern Chapter 1 review 3 finding 6 asked for. | No |
| `dice-pool.yaml` `roll_exceptions.performance-roll` | Yes. Every exclusion has a Chapter 1 hook: no Talent names the entry, it has no gear items, Help outside a Titan Engagement needs the calling rule, a rule can forbid a Push, and OQ-03 covers Stress Dice. Section 1.3's "the Death Roll's exceptions" is stale (finding 10). | No |
| `dice-pool.yaml` `components[attribute]`, `[talent]`, `[gear]` texts | Yes. The gear text now names the calling rule's item and none for `attribute_alone`, matching section 1.3 step 1. | No |
| `stress-changes.yaml` `graduation-exam-ends` | Yes. It is Stress-only now, with no `also` clause, and follows section 1.6's pattern. "All of the Cadet's Stress" reaches 0 safely because no Scar arises in the Exam. | No |
| `stress-changes.yaml` `named-gain`, `named-reduction` | Yes. The dangling Chapter 2 reference is removed. | No |
| `bonus-dice-sources.yaml` `help.applies_to` | Yes in effect. It generalizes section 1.8's "not a Death Roll" to any roll whose `roll_exceptions` row excludes Help, with the same result for both current rows. It gives later chapters a data hook for roll-level Help bans that section 1.8's list does not mention (not OQ-18's state hook). | No change in effect. Note the generalization under OQ-03 or OQ-08 so section 1.8 and the YAML stay aligned. |

## Judgment on the provisional decisions

- **OQ-19 (e):** sound.
  - The figures reproduce: key attribute 4 / 5 / 6 at 63.6 / 34.3 / 2.2%, 18 points for 93.8%, non-key mean 2.74, Agility 2 when not key 39%, Health 2 / 3 / 4 / 5 at 6.6 / 61.1 / 31.2 / 1.0%.
  - No Specialty choice gains points. Qualify the "whichever Specialty" sentence (finding 10).
- **OQ-20 (a), (d):** sound. The fallback fired 0 times in 200k Cadets. Its trigger is too narrow to stop forced dormant levels (finding 6).
- **OQ-21:**
  - (a), (d), (f), (i), and (l) are sound. Top 10 is 6.24% and Merit 5 or more 15.5%, both reproduced.
  - The per-attribute figures and the diagnosis of the skew are not sound (finding 7).
  - The Top 10 rate the Rookie calibration uses holds only without the Exam (finding 1).
- **OQ-22:**
  - (g) is sound as a closed rule, and (a) and (d) are sound.
  - The quoted parity is unsound: the best policy was missed, and group size is not modeled (finding 1).
  - The simulator case should add group size and the reference Push policy, not only Covering.
- **OQ-23:**
  - (a), (j), and (l) are sound, and (i) is sound in structure.
  - The Titan Engagement-only scope (finding 2) and passive own-state triggers (finding 4) should be logged or fixed.
  - The payoff note is good; add Chases once they exist.
- **OQ-24 (a):** sound.
- **OQ-25:** sound. The Strength-strike fidelity note is logged.
- **OQ-26 (a):** sound.
- **OQ-27 (e):** sound. The gear rule now applies to every use of an entry. The possession test needs one clause (finding 3).
- **OQ-28:**
  - (a), (c), and (e) are sound. (k) is the right Relentless fix and holds for first strikes. Record the follow-up effect (finding 5).
  - The simulator case list now covers every Talent round 1 raised.
  - Saddle Dodge's ADR-0015 amendment note is correctly left to the design owner.
  - Record the Chase exclusion of the gas and wear Talents (finding 2).
- **OQ-29 (j), (d), (g), (h), (m):** sound. They remove both round 1 contradictions. The logged cost deserves one more line:
  - The design summary's "light stat blocks ... from a short list" is gone.
  - Each Squadmate now tracks Gas Rating, canisters, Blade Sets, items, Gear Dice ratings, Health lost, Stress, and injuries, and rolls a Gas Roll every ODM round. A single player character starts with five.
  - Record this against the fable review's 12 to 20 minute round estimate, and consider a one-line Squad sheet row format in Chapter 4.
- **OQ-30 (a), (d), (g):** sound. Clarify the roll-off wording (finding 9).
- **OQ-31 (a), (d), (i), (j):** sound. Keeping current state closes both round 1 exploits. One wording collision remains (finding 9).
- **OQ-32 (a), (d):** sound. The Shiganshina Havens and the Wall event now fit every start year.
- **OQ-33 (a):**
  - Sound in direction. Marking the seven entries dormant with changeable attributes is the right scope compromise.
  - The "no soldier forced" claim is wrong for 2.8% (finding 6).
- **OQ-34 (a):** sound. The trigger text is readable, it is closed, and "nothing is spent" settles a failed declaration without a ruling.
- **OQ-35 (c):** a sound provisional choice, and correctly typed as an ADR question.
  - A `rule-named-value` reaches "the attribute alone" whenever a later rule creates the obstacle, with no judgment.
  - Codex's beam example stays flavor until an Operation Frame or hazard creates the value, which is a deliberate and now written reading of ADR-0003 item 9.
  - Settle it before the Operation Frame rules, as logged.

## Scope check: Phase 2 content

No XP spending, Downtime procedure, Rank rule, Requisition, Expedition, Chase, Operation Frame, or Shifter rule is drafted. Round 1's two overreaches are fixed:

- **Squadmate XP and Downtime Actions** now read "set by the XP rules" and "set by the Downtime rules".
- **The 7-soldier Squad Leader target** is now "set by the Rank rules".

Two items remain labelled forward references:

- **The seven dormant roll entries** keep an attribute but state that later rules may change it.
- **The mid-campaign join** ("at the start of the next session") is a stopgap.

Finding 2 is the one place where this chapter's definitions quietly decide how Phase 2 scenes treat Drives and Talents.

## Glossary and term use

- **Avoided terms.** A search of the chapter and all eleven character YAML files for every `_Avoid_` term found none. "Anchor" appears only for ODM anchors, its reserved sense.
- **Terms with no entry.** "Campaign start year" still has no glossary entry (logged, OQ-32). "Airborne" in Freedom is left to Chapter 4.
- **Pending glossary notes**, correctly logged rather than applied: Drive (OQ-23), Resolve rounding (OQ-24), Graduation Exam and Training Year (OQ-22), and Help outside a Titan Engagement (OQ-08).
- **Two definitions now read narrower than the chapter:**
  - **Opening:** Relentless adds a source (finding 5).
  - **Drive:** no scene limit in the glossary against a Titan Engagement limit in the chapter (finding 2).

## ADR-0003 checklist

- **Item 3:** met. All 12 Drives are "When I ..." triggers with a closed test and target.
- **Item 7:** met. Wide Awareness and Shoulder the Load keep a stated Position requirement, and the Exam's squad field exercise states who can Help and what Help spends.
- **Item 8:** met. See "No rulings" (section 2.9), "The GM plays no part in the Lifepath", "The GM never directs a Squadmate", and the D6 roll-off for every shared choice.
- **Item 9:** met under OQ-27 (e), with the ADR question logged as OQ-35.

No rule in the chapter rests on GM discretion.

## Fidelity and engine fit

The rewritten Drives read well as the 104th:

- **Knowledge** is a Read or a cut on a limb.
- **The Promise** is being the decoy.
- **Full Belly** is the soldier who dodges to live.
- **Stay Beside Them** is Mikasa's Drive exactly.

Squadmates who can do every job, carry their own gas, and never Push fit canon's special operations squads better than the round 1 role-locked version.

Rolled attributes with a Graduation swap are further from Year Zero Engine point budgets than Alien or Coriolis. They are closed, though, and no longer gameable. The Exam's "Stress Response costs Merit" is a clean prologue rule, and it only needs its numbers re-tuned (finding 1).

## Keep

- The Graduation swap, then floor: a fixed total, any Specialty viable, and no free points.
- The rolled Why You Enlisted attribute point with a free choice of Drive.
- `gear_requirement` as one rule for every use of an entry, named directly by Make Do.
- "You declare" triggers with "nothing is spent" on a failed use (OQ-34).
- The Squadmate full action list, full gear, and promotion that keeps current state and takes its Talent levels from the same rolled sources as a new Cadet.
- The Exam's closed Stress Response rule, which keeps Chapter 3 out of the prologue.
- The Mira example, still correct at every step.

## Appendix: simulation model

Scripts are in the scratchpad (`common.py`, `integrity.py`, `life.py`, `forced.py`, `exam.py`, `exam_grid.py`, `relentless.py`) and are not committed. YAML was converted to JSON with Ruby and read unmodified.

**Lifepath (200k Cadets):**

- Start year 850, rows rolled uniformly.
- Overflow goes to the highest other attribute below 5.
- The Talent pick prefers one that names a used entry and can gain a level, then random.
- The key attribute is the highest rolled attribute (random on ties), then swap, floor, and Top 10 are applied as `creation.graduation` orders them.

**Graduation Exam:**

- Cadets are built by the Lifepath model, with Year 1 and Year 2 performance rolls.
- Trial 1 is Agility plus Wirework; Trial 2 is Strength plus Clean Cut. Both use exam issue Gear Dice 1.
- On the squad field exercise, each Cadet takes the entry with the largest pool. Help goes in a cycle, so every Cadet gets exactly one helper when two or more Cadets take the Exam.
- Cadets roll the squad field exercise strongest first.
- Push wear lowers exam issue ratings for later Trials, and Sure Hands gives a second Push on Treat Injury.
- A Stress Response costs 1 Merit on that Trial. Stress carries between Trials.
- A Cover charges 1 Stress to a Cadet who has already rolled the squad field exercise.
- Top 10 is Merit 6 or more, compared against the same Cadet's Year 3 performance roll.

**Dice:**

- A Push re-rolls base and Stress Dice not showing 6 and adds a Stress Die unless Covered. Gear Dice are never re-rolled.
- A Push is forbidden after any Stress Die shows 1.
- "When short" Pushes only while below the successes needed.

| Quantity | Value |
|---|---|
| Key attribute 4 / 5 / 6 | 63.6 / 34.3 / 2.2% |
| Total points 18 / 19 | 93.8 / 6.2% |
| Non-key mean; Agility 2 / 3 / 4 when not key | 2.735; 39.0 / 48.8 / 12.0% |
| Health 2 / 3 / 4 / 5; Resolve 2 / 3 / 4 / 5 | 6.6 / 61.1 / 31.2 / 1.0%; 6.6 / 61.0 / 31.4 / 0.9% |
| Top 10; Merit 5 or more | 6.24%; 15.5% |
| Top 10 by highest attribute (Str / Agi / Wits / Per / Ins / Emp) | 9.6 / 3.7 / 5.8 / 7.3 / 5.2 / 6.0% |
| Key 6 by key attribute (same order) | 4.2 / 0.8 / 1.8 / 2.8 / 1.4 / 1.9% |
| Event `merit_change` totals (same order) | +6 / -1 / +1 / +4 / +1 / 0 |
| Cadets holding a 5 and a 4 before Graduation | 16.3% |
| Soldiers forced into a dormant level; fallback fired | 2.82%; 0 |
| Exam, 4 Cadets, never Push: Merit; Top 10 with / without | 0.33; 4.3 / 6.2% |
| Exam, 4 Cadets, Push whenever short on every Trial | 0.15 (Trials 1 and 2 Pushed at 0 to 2); 6.7 / 6.3% |
| Exam, 4 Cadets, squad field exercise when short, Trials 1 and 2 at 2 | 0.73; 8.6 / 6.2% |
| Same policy, 1 / 2 Cadets | 0.99; 12.6 / 6.5% / 0.97; 11.5 / 6.4% |
| Exam, 6 Cadets, Covered Pushes where possible | 0.64; 7.0 / 6.3% |
| Nape strike Depth 4, first / follow-up without / with Relentless: Rookie | 12.5 / 25.8 / 32.0% |
| Same: Levi-grade | 47.3 / 58.9 / 63.6% |
| Nape strike Depth 5, same: Rookie / Levi-grade | 3.3 / 12.2 / 16.2% ; 26.7 / 42.7 / 46.4% |
