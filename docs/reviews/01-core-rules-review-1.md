# Chapter 1, Core Rules: review round 1

Reviewed: `docs/rules/01-core-rules.md`, `data/core/dice-pool.yaml`, `data/core/bonus-dice-sources.yaml`, `data/core/stress-changes.yaml`, OQ-01 to OQ-10 in `docs/rules/OPEN-QUESTIONS.md`, against `CONTEXT.md`, ADR-0001 to ADR-0015, and the parent-game extractions in `docs/research/`. Odds quoted below come from a 200k-trial Python simulation (model described in the appendix). Severity follows the round's guide: Critical contradicts an ADR or the glossary, rests on GM discretion, or breaks play or an ADR-0014 target; Major is an undefined edge case or ordering problem likely in normal play, or a significant odds or fidelity problem; Minor is wording or a small gap.

## Verdict

The chapter is close. The pool build, the Push procedure, the one-Response-per-roll rule, the Bonus Dice cap, and the Stress triggers are all data-shaped, ordered, and faithful to ADR-0004 and ADR-0008, and the worked example is correct step for step. Three things must change before Chapter 5 is drafted on top of it: the provisional Reaction eligibility rule (OQ-09) reintroduces the turn starvation ADR-0015 was written to remove and makes most Titan behaviors land with no roll; the provisional Push re-roll set (OQ-01) re-rolls dice that ADR-0004 and the glossary say are not re-rolled, and raises gear wear by two thirds; and Help, Covering, and field Stress relief outside a Titan Engagement rest on an undefined "same scene" and "took part" test. Of the ten provisional decisions, OQ-02, OQ-04, OQ-05, OQ-06, OQ-07, OQ-08, and OQ-10 are sound and consistent with the ADRs; OQ-01, OQ-03, and OQ-09 are not, and are findings 1 to 4 below.

## Findings

### 1. Critical. OQ-09 makes a soldier who has moved or acted defenseless against every Titan card that round

**Location:** section 1.9, *Reactions*, PROVISIONAL (OQ-09); OPEN-QUESTIONS OQ-09.

**Problem:** "A soldier can make a Reaction only if they have spent neither their move nor their action this round." Under ADR-0015 a behavior "lands unless dodged", so a soldier with no Reaction available takes the behavior with no roll at all. In a Titan Engagement nearly every soldier moves or acts on their card, and card order is random, so whether the Attention holder can dodge depends on the draw, not on anything they did. Simulated over a uniform card draw, at least one Titan card resolves after a given player character's card 50% of the time at Tempo 1, 67% at Tempo 2, and 75% at Tempo 3. ADR-0010 makes this worse by design: "a striker who falls short draws the Titan's turn", so the soldier most often targeted is exactly the one who has just spent their action. ADR-0015 was amended because "one Reaction per card starved the soldier holding Attention of turns"; this rule starves them the other way round, of Reactions, and the chapter acknowledges the risk without resolving it. It also undercuts ADR-0014's Grab target (1 in 3 with comrades close): a Grab that lands with no roll two rounds in three is not a tunable number. The rule is also stricter than either parent, where an out-of-turn defense costs the action you would have taken, not the right to defend at all.

**Scenario:** Tempo 2 Medium Titan, Wooded terrain. Private Brandt's card is 3. She moves to Blind Spot and makes a Nape strike, falls short, and by ADR-0010 now holds Attention. The Titan's cards are 5 and 8. Card 5 resolves a Grab against her. She has spent both her move and her action, so no Reaction: the Grab lands, torso Critical Injury, Grabbed. Card 8 resolves a second behavior against her, also with no roll. Nothing she or her comrades could have done this round changes that outcome except not striking. A Rookie who had held her turn would have dodged Severity 2 about 57% of the time (pushing when short).

**Fix options:**
1. Adopt OQ-09 option (b): a Reaction is always allowed. It spends this round's turn if unspent; otherwise it spends the soldier's next turn (they start next round with no move and no action). Amend the glossary entry for Reaction to say "spends the soldier's turn, this round's if unspent, otherwise the next".
2. A Reaction spends only the action, never the move. A soldier who has already spent their action may still React by spending next round's action. Keeps movement free, which is the canon feel of ODM fighting.
3. Keep (a) but add a Hold rule in Chapter 1: on their card a soldier may hold their whole turn; if no Titan card targets them by the end of the round they take the held turn last. This makes the choice deliberate rather than card-luck, at the cost of a queue.

### 2. Critical. OQ-01 re-rolls Gear Dice showing 2 to 5, which ADR-0004 and the glossary do not re-roll

**Location:** section 1.5, *The Push procedure* step 4, PROVISIONAL (OQ-01); `data/core/dice-pool.yaml` `die_types.gear.push_re_rolls_faces`; OPEN-QUESTIONS OQ-01.

**Problem:** ADR-0004 step 2 re-rolls "base and Stress Dice that did not show a 6", and the glossary's Push entry is "Re-rolling base and Stress Dice that did not show a 6". Neither lists Gear Dice. The chapter re-rolls Gear Dice showing 2 to 5. OQ-01's argument that "stay locked" is only meaningful if the other Gear Dice move is not decisive: under the ADR's literal text a locked 1 is a die that stays in the pool showing 1 and counts as wear, which is exactly what ADR-0004 step 3 says. The choice is defensible (it is the Coriolis model the ADR cites) but it is not what the ADR and glossary say, and it changes a number ADR-0014 tunes. Per Pushed roll, with 2 Gear Dice: probability of any wear 47.7% and mean wear 0.55 under OQ-01(a), against 30.4% and 0.33 under the literal ADR. With 3 Gear Dice: 62.4% and 0.84 against 42.2% and 0.50. That is two thirds more ODM wear per Push, so Jams arrive that much sooner, before Chapter 4 has set any rating.

**Scenario:** Standard Issue ODM Gear at Gear Dice 2. A Rookie Pushes one ODM roll per round. Under OQ-01(a) the gear takes a point of wear on about half of those rounds and Jams after roughly four Pushes; under the literal ADR, after roughly six. Chapter 4 will tune Gear Dice ratings against whichever is true, and the glossary currently says the other one.

**Fix options:**
1. Keep OQ-01(a) and amend ADR-0004 step 2 and the glossary Push entry to "re-roll base, Stress, and Gear Dice that did not show a 6, except Gear Dice showing 1, which stay locked". Record the wear odds above in the ADR so Chapter 4 tunes against them.
2. Adopt OQ-01(b): Gear Dice are never re-rolled; only 1s from the first roll wear gear, and only if the roll is Pushed. Matches the ADR and glossary as written and keeps the "locked" wording meaningful (the die stays showing 1 and counts).
3. Either way, keep "Bonus Dice are base dice"; that half of OQ-01 is sound and both parents agree.

### 3. Critical. Help, Covering, and field Stress relief outside a Titan Engagement rest on "same scene" and "took part", which nothing defines

**Location:** section 1.5 *Covering* ("taking part in the same scene"); section 1.8 *Outside a Titan Engagement* ("taking part in the same scene"); section 1.6 ("every player character who took part"); `bonus-dice-sources.yaml` `help.condition`; `stress-changes.yaml` `engagement-ends.who` and `nape-kill.who`.

**Problem:** "Scene" is not a glossary term (Titan Engagement is defined as "a scene", but scene itself is not), and "taking part" has no test. Who is in the scene, and who took part, is decided by the table, which is the rule resting on GM discretion that ADR-0003 forbids. ADR-0003 item 7 was added precisely because Alien's "concretely support" test for Help was a judgment call; Coriolis's Help rule is "present and capable (GM call)". The chapter meets item 7 inside a Titan Engagement with the Position rule, then falls back to the parent games' judgment test outside it. The relief triggers have the same hole: a player character who sat Distant on a horse the whole fight, or who arrived on the last card, either lost 1 Stress or did not, and the YAML cannot say which. A Foundry implementation has nothing to evaluate.

**Scenario:** The Squad is back at a Waypoint camp. Two soldiers are with the horses thirty metres from the fire; one at the fire makes a Wits roll to plan the next Leg and wants Help from both. Are they "taking part in the same scene"? One GM says yes, the next says no. Later a Titan Engagement ends while one soldier was On Body and another was still riding in from Distant, having done nothing but arrive. Does the rider lose 1 Stress? The YAML row says "took part" and no one can answer from the rules.

**Fix options:**
1. Add a glossary entry for **Scene** with a closed presence test, and use it: a soldier is in a scene if they are at the same Waypoint, location, or Titan Engagement as the roller and are not Down. Field relief goes to "every player character who made an attribute roll, was the target of a Titan card, or held a Position in that Titan Engagement".
2. Narrow the rules instead: OQ-08 option (e), no Help or Covering outside a Titan Engagement, and relief to every player character who held a Position in the Engagement. Simplest, but removes Help from Plan Rolls, Requisition, and Legs, which the settled design expects to use it.
3. Make presence a declared state: at the start of any scene the GM lists who is present, and the list is the test. This is still a GM call but a bounded, visible one; weaker than option 1 under ADR-0003.

### 4. Major. OQ-03 puts Stress Dice on the Death Roll, so fear keeps a dying soldier alive and a Stress Response fires while Down

**Location:** section 1.3, step 7, PROVISIONAL (OQ-03), "including rolls that cannot be Pushed, such as a Death Roll"; section 1.6 *Stress Responses and Fear Rolls*; `dice-pool.yaml` `components.stress.per_roll`.

**Problem:** A Death Roll is a Strength roll that cannot be Pushed (glossary). With Stress Dice included, a soldier at Strength 3 survives a lethal time limit 42% of the time at Stress 0, 66% at Stress 3, and 81% at Stress 6. Trauma becomes the best life insurance in the game, and a two-Scar veteran is always better at not dying than a fresh Rookie for reasons that have nothing to do with the wound. Separately, section 1.6 says a Stress Response is "triggered only by a Stress Die showing 1 on an attribute roll", and the Death Roll is one, so a Down soldier at Stress 3 suffers a Stress Response on 42% of Death Rolls (66% at Stress 6), and Chapter 3 will have to say what "Freeze" or "Flee" means for a soldier who can only crawl. Both parents exclude this: Alien's death roll "uses no stress dice" and its broken characters "gain no stress and never make panic rolls". OQ-03 already anticipates the exemption ("Chapter 3 can exempt the Death Roll by name"), but the exemption belongs in this chapter, because this chapter is the one that names the Death Roll as an example of a roll that does include them.

**Scenario:** Private Wendt, Strength 3, Stress 5 after a bad fight, takes a lethal torso injury with a one-round limit. His Death Roll is 8 dice: 77% to live. Private Brandt, Strength 4, Stress 0, takes the same injury: 5 dice, 52% to live. Wendt also has a 60% chance of a Stress Response on his Death Roll, which Chapter 3 must resolve on a man who is Down.

**Fix options:**
1. Exempt the Death Roll in section 1.3 and in `dice-pool.yaml`: "A Death Roll has no Stress Dice and cannot be Helped." Keep OQ-03(a) for every other attribute roll.
2. Add a general clause: a soldier who is Down rolls no Stress Dice and suffers no Stress Response until they are no longer Down (the Alien model). Covers Death Rolls and any roll Chapter 3 lets a Down soldier make.
3. Keep Stress Dice on Death Rolls but make them count only as successes, never as a Stress Response trigger. Weakest option: the survival skew in the numbers above remains.

### 5. Major. Talents name Action Catalog actions, but a Reaction is not an action, so no Talent can add dice to a dodge

**Location:** section 1.3, step 3; section 1.9 ("An action is either one entry from the Action Catalog or Help"; "A Reaction is a dodge or block ... outside the soldier's own turn"); the worked example ("no Talent of hers names the dodge").

**Problem:** Step 3 adds dice from "one Talent that names this action", and ADR-0006 says every Talent "names the actions it applies to from the Action Catalog". Section 1.9 defines an action as a Catalog entry or Help, and defines a Reaction as something else. Read together, no Talent can ever add dice to a Reaction or a Death Roll, because they are not actions. The example implies the opposite ("no Talent of hers names the dodge" only matters if one could). Both parents have dodge Talents (Coriolis *Evasive*, Alien *Nimble*), a Flier Specialty without one is hard to imagine, and the difference is up to 3 dice on the roll that decides every Critical Injury, which ADR-0014's Grab and lethality targets will be tuned against.

**Scenario:** Chapter 2 writes a Flier Talent "Evasive: +1 die per level on dodges". A player asks whether it applies to their Reaction. By section 1.3 it cannot, because "dodge" is not an Action Catalog entry; by the example it should. Whichever the table picks, the other table picks differently.

**Fix options:**
1. State in section 1.3 that, for the purpose of naming Talents, Reactions (dodge, block) and the Death Roll are listed in the Action Catalog as "rolls that are not actions", and a Talent may name them. Chapter 2 then lists them.
2. State the opposite explicitly: no Talent adds dice to a Reaction or a Death Roll; Talents that bend a rule may still trigger on them. Then fix the example.
3. Make "dodge" a Catalog action that is taken as a Reaction, and let 1.9 say a Reaction is "the dodge or block action taken outside the soldier's turn".

### 6. Major. One dodge covers every card, but Severity is per behavior, so successes against later cards are undefined

**Location:** section 1.9, *Against a Titan*; section 1.4, item 2.

**Problem:** A Reaction "needs successes equal to the behavior's Severity" and "one dodge covers every card that Titan plays that round". Behaviors on one table have different Severities, and the dodge is rolled when the first card resolves against the soldier, before the second card's behavior is known. The chapter does not say whether the same success count is compared against each later card's Severity, whether the first result (dodged or not) simply applies to all later cards, or what a failed dodge does to later cards. Chapter 5 will give details, but the sentence in this chapter already forecloses some answers and a GM reading this chapter alone cannot run the second card.

**Scenario:** Tempo 2. Card 1 resolves a Severity 1 sweep against Brandt; she dodges with 1 success and her turn is spent. Card 2 resolves a Severity 3 Grab against her. Does her 1-success dodge cover it (she dodged "every card"), does it fail against Severity 3 (she needed 3), or does the Grab land with no roll because her turn is spent? Three tables, three answers, and the answer is the Grab lethality number.

**Fix options:**
1. Compare the one Reaction's success count against each card's Severity as it resolves: it covers every card whose Severity it meets. State it here and let Chapter 5 inherit it.
2. The first Reaction's outcome applies to every later card from that Titan this round, dodged or not. Simplest at the table, harshest and kindest by turns.
3. Move the sentence: have section 1.9 say only that a Reaction is one roll per Titan per round and that Chapter 5 says which cards it covers.

### 7. Major. "Attribute alone" for an uncatalogued action contradicts the rule that every attribute roll has Stress Dice, and the choice of attribute has no procedure yet

**Location:** section 1.3, step 1 ("uses the closest catalog action or rolls the attribute alone (ADR-0003, item 9), following the procedure in Chapter 2").

**Problem:** "Rolls the attribute alone" reads as a pool with nothing but attribute dice, which contradicts step 7's "Stress Dice are part of every attribute roll" and leaves Gear Dice and Bonus Dice unstated. Which attribute is rolled, and who decides "closest", is deferred to a Chapter 2 procedure. Uncatalogued actions come up in every session, so until Chapter 2 exists this chapter cannot resolve the most common kind of improvised roll, and after it exists the two chapters will disagree on what "alone" means unless this one is fixed.

**Scenario:** A soldier tries to calm a panicking horse in camp. No Catalog entry fits. The player asks what to roll: Instinct or Empathy, with or without Stress Dice, with or without the horse's Gear Dice. The chapter says "the attribute alone" and "see Chapter 2".

**Fix options:**
1. Reword: "rolls the attribute that Chapter 2's procedure names, with no Talent dice; Bonus Dice, Gear Dice, and Stress Dice apply as normal." Keeps ADR-0003 item 9's meaning (no Talent) without breaking step 7.
2. Put the procedure here, since it is about building a pool: the player names the attribute from the closed list of six by the attribute's glossary definition; if two fit, the lower rating is used. Chapter 2 then only supplies the Catalog.
3. Drop "attribute alone" from this chapter and state only "uses the closest catalog action (Chapter 2 gives the procedure)".

### 8. Major. The YAML decides that Squadmates never Help, Cover, or lose Stress in the field, while the prose defers that to Chapter 2

**Location:** section 1.8 ("Chapter 2 says whether Squadmates can Help"); section 1.10; `bonus-dice-sources.yaml` `help.condition` ("The helper is a player character"); `stress-changes.yaml` `engagement-ends.who` and `nape-kill.who` ("every player character").

**Problem:** The YAML is the source of truth (ADR-0012) and it hard-codes "player character" in three rows. The prose says Chapter 2 will decide. That is a prose-to-data inconsistency in this chapter, and it pre-decides a Chapter 2 question in the wrong direction: the settled design has Squadmates make Fear Rolls, which needs Stress, and a Squadmate with Stress that only ever rises (Fear results, named gains) and never falls in the field is a spiral with no relief. It also excludes the Alien model the design cites, where NPC groups act through the Help rule.

**Scenario:** A Squadmate on Brandt's Wing gains 2 Stress from a Fear Roll when Wendt is Grabbed. The Titan is killed and the Engagement ends. Every player character loses 2 Stress; the Squadmate loses nothing, because the YAML says so, and Chapter 2 cannot change the row without contradicting this chapter's file.

**Fix options:**
1. Change the three rows to "the roller's comrades (player characters, and Squadmates as Chapter 2 allows)" and "every soldier who took part", and mark them `provisional` pending Chapter 2.
2. Decide it here: Squadmates can Help and lose field Stress like player characters, but never Push and never Cover (they have no Push to trade). Record it in OPEN-QUESTIONS if the ADRs do not settle it.
3. Keep the rows PC-only and make the prose match ("Squadmates never Help, Cover, or lose Stress through these triggers"), then let Chapter 2 add Squadmate-specific rows.

### 9. Minor. Call It has no dice value, so the Bonus Dice table has an unusable row

**Location:** `bonus-dice-sources.yaml` `call-it.dice_per_unit: null`; section 1.7 ("For each source, the file gives the dice it adds").

**Problem:** The chapter promises the file states each source's dice; the Call It row says `null`, "set in Chapter 5". The glossary entry for Call It says "bonus dice" without a number and the settled design brief used +2. A row with no value is a table that cannot be applied.

**Fix options:**
1. Put `dice_per_unit: 2` with `provisional: [OQ-11]` and let Chapter 5 tune it.
2. Remove the row until Chapter 5 adds it, and drop "the file gives the dice it adds" to "the file gives, for each source it has tuned, ...".

### 10. Minor. A Pushed dodge is not a "Pushed ODM action", so by this chapter's own terms it does not trigger the three-die Gas Roll

**Location:** section 1.5 ("A Pushed ODM action makes that round's Gas Roll three dice"); section 1.9 (an action is a Catalog entry or Help; a Reaction is not an action; the dodge "uses ODM Gear for its Gear Dice").

**Problem:** The glossary Gas Roll entry says "three after a Pushed ODM action". This chapter defines "action" so that a Reaction is not one, then makes the dodge an ODM roll. Read literally, Pushing a dodge burns no extra gas, though the fiction is a soldier venting gas to get clear. ADR-0014's gas target ("about 6 rounds when pushing every round") assumes Pushes on ODM use cost gas.

**Fix options:**
1. Reword here and in the glossary: "a Pushed roll that used ODM Gear for its Gear Dice makes that round's Gas Roll three dice".
2. Leave the wording and have Chapter 4 define "ODM action" to include Reactions; note the dependency in this chapter.

### 11. Minor. Covering has no per-round limit and no surcharge, so one soldier can absorb the whole Squad's Push Stress until a Fear Roll finds them

**Location:** section 1.5, *Covering*, PROVISIONAL (OQ-06); OPEN-QUESTIONS OQ-06 ("no limit per round").

**Problem:** OQ-06 is sound in its mechanics (see the judgments below), but with no limit a soldier who rarely rolls, for example one who Helps every round from one Position step away, can Cover every Push in the Squad. Their Stress only bites when they make an attribute roll or a Fear Roll, and the Fear Roll is D6 + Stress - Resolve. Whether that is a self-correcting trade or a free lunch depends on Chapter 3's Fear trigger frequency, which the simulator should check. The codex review raised the same concern.

**Fix options:**
1. Leave the rule, and add "Covering: sponge soldier" as a named simulator case under ADR-0014 with a stated acceptable outcome.
2. Limit Covering to once per soldier per round.
3. Coriolis surcharge: the Covering soldier gains 2 Stress. OQ-06 rejected this on glossary grounds; it would need a glossary edit.

### 12. Minor. Small YAML-to-ADR and YAML-to-prose mismatches

**Location:** `dice-pool.yaml`.

- `components.gear.min: 0` where ADR-0006 says Gear Dice run 1 to 3. The chapter handles a rating of 0 ("an item with no rating adds no dice", a Jammed item), so the fix is a note in the row: `min: 1 (0 when worn to 0, which adds nothing)`.
- `die_types.stress.push_re_rolls_faces: [1, 2, 3, 4, 5]` lists face 1, but a Stress Die showing 1 can never be re-rolled, because any Stress 1 forbids the Push. A Foundry importer would re-roll it. Use `[2, 3, 4, 5]` and keep the comment.
- Every `dice:` field is a prose string ("the rating of the attribute the roll's rule names"). ADR-0012 wants the same file to drive Foundry; a structured form (`source: attribute`, `source: talent_level`) next to the prose would make that a translation instead of a parse.

### 13. Minor. Wording and small gaps in the Push and Stress sections

- Section 1.5, *When a soldier cannot Push*, lists "The roll has already been Pushed" as absolute, two lines above the PROVISIONAL that says Talents allow more. Reword the bullet: "The roll has already been Pushed as many times as the soldier is allowed (once, unless a Talent says otherwise)."
- Section 1.1, item 4: if the rule that called for a roll is silent on retries, nothing says the default. State it: "If the rule is silent, the roll cannot be retried until the situation changes in a way a rule names."
- Section 1.6: a Nape kill that also ends the Titan Engagement is two triggers. Say so: "A kill that ends the Engagement counts both triggers, for 2 Stress."
- Section 1.8 and `bonus-dice-sources.yaml`: Help applies to "any attribute roll", which includes a Death Roll. Say whether a comrade can Help a Death Roll (finding 4, option 1 settles it).
- Section 1.3: the pool formula is closed ("attribute + one Talent + Bonus Dice + Gear Dice + Stress Dice") and section 1.7 says only listed sources add Bonus Dice, but the glossary already has Faction Standing "added to the dice for dealings with that Faction", and the settled design gives Requisition Rank dice and Funding dice. Add one sentence: campaign modifiers of that kind enter the pool as Bonus Dice sources (under the cap) or as named penalties, and their chapters add the rows.
- The chapter has no opposed-roll procedure (who Pushes first, ties). The settled design uses opposed rolls for Chases. Either state "Phase 1 has no opposed rolls" or give the two-line YZE procedure (active side decides on its Push first, then the passive side; more successes wins; ties go to the passive side). Section 1.10's "Titans never build dice pools" should then say how a Chase's Titan pursuit dice fit, or Chase should be moved out of Phase 1 explicitly.

## Judgment on the provisional decisions

- **OQ-01 (Push re-roll set):** the Bonus-Dice-are-base-dice half is sound. The Gear-Dice-2-to-5 half contradicts ADR-0004 and the glossary as written and moves a tuned number. Finding 2.
- **OQ-02 (one Push, Talent exceptions):** sound. Matches both parents and ADR-0006's rule-bending Talents. The wording in the cannot-Push list needs the small fix in finding 13.
- **OQ-03 (Stress Dice on every attribute roll):** sound as a default, wrong for the Death Roll, which this chapter names. Finding 4.
- **OQ-04 (no maximum Stress):** sound on the evidence. Stress is self-limiting because Stress-Die 1s block Pushes: simulated over a three-Engagement Expedition with one roll per round and no table-added Stress, a Rookie who Pushes every roll ends at median Stress 2 (90th percentile 4, worst seen 6), and a two-Scar Veteran who Pushes every roll ends at median 3 (90th percentile 4, worst 8). The Stress Response chance per roll runs 17% at Stress 1, 42% at 3, 60% at 5, 77% at 8. Chapter 3's table and its named Stress gains are the only thing that could push totals past that, and the simulator should re-run this once they exist. No finding.
- **OQ-05 (finishing order):** sound. Response before effect lets Chapter 3 results change the action; wear last makes a Jam a consequence, not a retroactive failure. The example follows it correctly. No finding.
- **OQ-06 (Covering):** sound. No new Stress Die for a Covered Push is the right reading of "Stress Dice equal to current Stress", and it makes Covering a real trade. The unlimited-per-round part is finding 11, Minor.
- **OQ-07 (penalties):** sound. Base dice only, floor of 1, after the cap, matches both parents and protects ADR-0008's Stress-equals-dice logic. No finding.
- **OQ-08 (Help timing and Help outside Engagements):** the timing half (a) is sound and needed for ADR-0015's rescue window. The outside-Engagements half (d) is the right shape but rests on "same scene". Finding 3. Note the interaction with OQ-09: a soldier who Helps a comrade's dodge has spent their action and, under the current OQ-09, cannot dodge the same Titan's next card. Finding 1's options 1 and 2 both soften that.
- **OQ-09 (Reaction eligibility):** not sound. Finding 1.
- **OQ-10 (whole Squad loses Stress on a Nape kill):** sound and consistent with ADR-0010. No finding.

## Glossary and term use

No `_Avoid_` term appears in the chapter. "Level" is used only for Talent levels, which ADR-0006 also uses; "Anchor" appears only in "Anchor Rating". "Scene" is used six times and is not a glossary term (finding 3). "Round" is used only inside Titan Engagements, correctly.

## Fidelity and engine fit

Stress as adrenaline that both sharpens and breaks a soldier is the right AoT reading, and the field relief on a kill and at the end of an Engagement gives the "we survived" beat. Covering as a comrade steadying you is abstract but earns its place. The Position requirement on Help fits ODM squads fighting in reach of each other. Nothing in this chapter misrepresents the 845 to 850 setting.

On engine fit, the chapter is a clean Alien-plus-Coriolis hybrid: Alien's Stress Dice and Push ban, Coriolis's one-gear-item rule and gear wear, and a single Push with one Response per roll. The pool build is seven steps and three die colors, which is one step more than either parent; the penalty step and the Bonus Dice cap are what add it, and both are justified. The one place the hybrid departs from what makes YZE play well is finding 1, which is stricter than either parent's defense rule.

## Keep

- The Push procedure as written: five ordered steps, one Response per roll, Gear 1s locked, and a worked example that follows it exactly.
- "The dice are final" (section 1.1): four sentences that carry ADR-0003 items 8 and 9 into play.
- The Bonus Dice file with `spends`, `condition`, and `applies_to` per row, and the "unused sources are not spent" rule.
- Stress changes as a closed trigger file with `who` and `amount`, and "The GM never raises or lowers Stress without one".

## Appendix: simulation model

200,000 trials per cell unless stated (`scratchpad/ch1_odds.py`, not committed). Push follows the chapter: base and Stress Dice not showing 6 re-roll, Gear Dice showing 1 lock, Gear Dice 2 to 5 re-roll, one new Stress Die added, no Push if any Stress Die shows 1. "Literal ADR" wear counts only first-roll Gear 1s. Dodge odds Push only when short of the Severity. Card order draws 4 player-character cards plus Tempo Titan cards from 10 without replacement. The Expedition model is 3 Engagements of 4 rounds, one attribute roll per round on 5 base dice, -1 Stress at each Engagement's end and -1 for one kill per Engagement, no Chapter 3 Stress gains, 20,000 trials.

| Quantity | Value |
|---|---|
| Wear per Pushed roll, 2 Gear Dice, OQ-01(a) / literal ADR | P(any) 0.48 / 0.30; mean 0.55 / 0.33 |
| Wear per Pushed roll, 3 Gear Dice, OQ-01(a) / literal ADR | P(any) 0.62 / 0.42; mean 0.84 / 0.50 |
| Death Roll, Strength 3, P(survive) at Stress 0 / 3 / 6 | 0.42 / 0.66 / 0.81 |
| Death Roll, P(Stress Response) at Stress 3 / 6 | 0.42 / 0.66 |
| Dodge, Rookie (Agility 4, Gear 1, Stress 1), Severity 1 / 2 / 3 | 0.86 / 0.57 / 0.27 |
| Dodge, Veteran (5, 2, Stress 3), Severity 1 / 2 / 3 | 0.91 / 0.71 / 0.47 |
| Dodge, Levi-grade (6, 3, Stress 1), Severity 1 / 2 / 3 | 0.95 / 0.80 / 0.58 |
| P(a Titan card resolves after a given PC's card), Tempo 1 / 2 / 3 | 0.50 / 0.67 / 0.75 |
| Expedition end Stress, Rookie Pushing every roll: median / 90th / max | 2 / 4 / 6 |
| Expedition end Stress, 2-Scar Veteran Pushing every roll: median / 90th / max | 3 / 4 / 8 |
| P(Stress Response per roll) at Stress 1 / 3 / 5 / 8 | 0.17 / 0.42 / 0.60 / 0.77 |
