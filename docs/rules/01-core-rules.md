# Chapter 1: Core Rules

This chapter explains how every roll in Wings of Freedom works: when to roll and what stands, building a dice pool, Circumstances, counting successes, Pushing, Stress, Bonus Dice, and Help. It also covers turns, actions, and Reactions, but only as far as the dice need them.

Later chapters build on these rules:

- **Chapter 2, Character Creation:** attributes, Specialties, Talents, the Action Catalog, and which of these rules apply to Squadmates.
- **Chapter 3, Harm and Mind:** the Stress Response and Fear Roll tables, Resolve, Scars, Grief, Down, and Death Rolls.
- **Chapter 4, Gear:** Gear Dice ratings and wear, ODM Gear, Gas Rolls, Blade Sets, and horses.
- **Chapter 5, Titan Engagement:** rounds and initiative (section 5.3), Positions (section 5.2), Attention (section 5.6), Reactions against Titans (section 5.5), Openings (section 5.7), Read, and Call It (section 5.8).
- **Chapter 6, Standard Titans:** each Titan's stat block, Behavior Table, and Attack Dice (`data/titans/`, sections 6.2 to 6.5).

Chapter 7 gives the playtest rules for Expeditions, Downtime, Requisition, and Skirmishes; Chases are covered by rules not yet written. This chapter mentions them only where it has to.

**Tables.** This chapter's tables are YAML files in `data/core/`. Those files are the only source of truth (ADR-0012). The chapter explains how to use each one but does not copy its rows:

- `data/core/dice-pool.yaml`: what each die does, what goes into a pool, the called roll and the menu of what its failure can cost, and the rolls that leave components out, the passive roll among them.
- `data/core/circumstances.yaml`: the Circumstances ladder, the rolls it reaches, the rolls it never touches, and its default in a Titan Engagement.
- `data/core/stress-changes.yaml`: every trigger that raises or lowers Stress.
- `data/core/bonus-dice-sources.yaml`: every source of Bonus Dice, plus the cap.

Where the ADRs left a question open, the rule below cites its entry in `docs/rules/OPEN-QUESTIONS.md` as (OQ-nn). Most entries this chapter cites were decided on 2026-09-14 (`docs/rules/DECISIONS-2026-09-14.md`). The GM's rulings come from decision batch 9 (2026-09-16) and ADR-0024. OQ-167 and OQ-168 stay open for the first playtest to measure, and OQ-173 is decided by 9-21. In every case the text states the rule in force.

---

## 1.1 When to roll, and what stands

1. **Roll when it matters.** A soldier rolls when they take an action whose Action Catalog entry (Chapter 2) marks it as rolled, when a rule or a table result calls for a roll, or when the GM calls one. The GM calls a roll, a **called roll**, when a soldier attempts something no rule covers, its outcome is in doubt, and failure would cost something. If failure would change nothing, or the soldier has the time, the tools, and the training to do it unpressed, it happens without a roll. If it cannot be done, the GM says so before anyone rolls. The GM calls rolls sparingly: a roll is for a moment with something at stake. A called roll can be made anywhere, a Titan Engagement or a Skirmish included. In a fight the GM first asks whether the act is a Catalog entry taken as written or an improvised act with a model entry (section 1.9); it is a called roll only when no entry of kind action the soldier could take in that fight has an effect the act imitates and the act would change nothing the fight tracks (no tracked value, Position, Attention, Opening, card, clock, or Foe value). It then spends the soldier's action, and Help on it is the fight's Help (section 1.8; Chapter 7, section 7.4) (decision batch 9, 9-36). An act whose one outcome succeeds or fails for several soldiers at once is one called roll, made by one soldier the players choose (Chapter 2's roll-off if they disagree), with Help from the others (section 1.8); a stake of Stress, damage, or a fall falls on the soldier who rolled; a lost item is one of the roller's, a lost unit is the Squad's, and time or position falls on the situation; and an act each soldier makes for themselves is that soldier's own roll (decision batch 9, 9-34 and 9-41).
2. **Name the roll and the stakes first.** Before the pool is built for a called roll, the GM names:
   - **The roll:** the Catalog entry closest to the act, from the entries marked as rolled when called, or an attribute alone if none fits (section 1.3, step 1; Chapter 2, section 2.9).
   - **The Circumstances:** one step of the ladder (section 1.4a), or Standard if the GM names none.
   - **The stakes:** what failure costs, from the menu below, and, where it is not obvious, what success gives.

   The player may change their approach, or withdraw, before the dice are rolled. A roll a rule calls for takes only its Circumstances from this item: its entry, its needs, its Help, and what its failure does are its rule's.

   **The menu.** A failed called roll costs what was staked, and nothing else. Either it does not happen, which is the default and always available; or it happens at one cost; or it does not happen and the one cost falls anyway. One cost per failed roll, from this list:
   - **Stress:** the soldier gains 1 Stress (section 1.6).
   - **A fall:** by Chapter 4's procedure, low or high as the GM names from the height, or low if the GM names none; never extreme (decision batch 9, 9-30). In a fight it is a fall in full: it lands as Chapter 5 gives (section 5.2), and that change of Position is the fall rule's, not the ruling's (decision batch 9, 9-44).
   - **Damage:** 1 to 3, of a named Injury Type, such as Crush for a blow, Cut for an edge, Pierce for a point, or Burn for fire (Chapter 3). Never 4 or more.
   - **A lost item or unit:** one carried item lost, or 1 unit of one kind of Squad Supply spent (Chapter 4). Never wear, which is the price of a Push.
   - **Time or position:** a change in the situation, described, that the next roll must reckon with, such as the window closing, the patrol arriving, the door barred, or the Squad noticed. A Skirmish or a Titan Engagement can begin this way. In a fight, a change in the situation outside what the fight tracks, never a Position, a card, a turn, a move, an action beyond the one the act spent, Attention, an Opening, or a clock (decision batch 9, 9-36).

   When the stakes name damage or a fall, the GM states the soldier's current Health with them (decision batch 9, 9-35).

   A stake is never a Critical Injury dealt directly, an Injury Location, a row, or a time limit; a Death Roll, a Scar, or Grief; a Fear Roll; Stress relief, a Health box, healing time, or a care window opened or closed; or a Titan's roll, a Foe's roll, or a table result. A failure should move the story on, not halt it. **What success gives** is the act itself, information, a better position that the next roll reckons with, an object that is not a gear item, which counts only toward Circumstances (Chapter 4, section 4.1), or Squad Supply found as Chapter 4 caps it (section 4.10). In a fight, success never gives a Position, which only a move changes, nor anything else the fight tracks, nor found Squad Supply: a called search is made outside a fight, where section 4.10's caps count it (decision batch 9, 9-36 and 9-45). It never gives a gear item, Stress relief, a Health box or healing, a Commendation, a Research Point, or a Faction Standing change: each comes only from its own rule or table (decision batch 9, 9-31). `data/core/dice-pool.yaml` records the called roll and the menu under `called_roll`.
3. **Results stand.** Once the dice are rolled, the GM never overrides, re-rolls, or ignores a die or a table result, and never changes the roll's entry, its Circumstances, or its stakes. A roll changes only through a Push or through a rule that names the change. Titan Dice, a Foe's Attack Dice and Guard, the hazard and Night tables, the setup table, and every roll on a table are made in the open. The one hidden roll in a Titan Engagement, the Next Behavior, is rolled once and stands (Chapter 5).
4. **Trying again.** In a Titan Engagement or a Skirmish, a soldier can attempt an action again on a later turn, a called roll included, spending that turn's action and nothing else (decision batch 9, 9-36). Outside one, a rule that says a roll is never tried again is final. Otherwise a soldier tries the same thing again only when something has changed: a new approach, a better tool, another soldier, or time spent, at a cost of time or position the GM names before the new roll, which falls when the soldier tries again, whatever the result, and is not the new roll's stakes (decision batch 9, 9-28). Each soldier gets one attempt at a given obstacle per changed situation.
5. **Secret rolls.** The only soldier's roll the GM makes out of sight is a **passive roll**: a Spot or a Size Up the GM makes for a soldier against something the soldier does not know is there, outside a Titan Engagement and a Skirmish. The GM builds the soldier's pool as it stands (attribute, the Talent that names the entry, Gear Dice if the entry allows them, and Stress Dice), with the Circumstances the GM names to themselves. A plus step adds its dice as a Bonus Dice source, and no other Bonus Dice source applies (decision batch 9, 9-21). A passive roll cannot be Helped, Covered, or Pushed, and a Stress Die showing 1 on it does nothing, since the soldier does not know they rolled. The soldier learns the result only through what they notice. A passive roll is not a called roll: it has no stakes, and failing it means only that the soldier does not notice (decision batch 9, 9-32). Every other roll is made where the table can see it, and a soldier who says they are looking rolls Spot in the open as a called roll. The passive roll's row is under `roll_exceptions` in `data/core/dice-pool.yaml`.
6. **Where the GM does not rule.** The GM applies all of these as written and rules on none of them: the Push procedure, which no ruling forbids or forces (only a written rule or a roll exception does), Covering, and Help's effect and cap; the sources of Bonus Dice (Circumstances is the one source a ruling names), the cap of 4, the penalty rule, and what a roll needs (section 1.4); the fixed rolls and their tables, which are the Fear Roll, the Stress Response roll, the Gas Roll, the Death Roll, the performance roll, the fall roll, and the infirmary roll; the Critical Injury, Stress Response, Scar, and Grief tables, Down, Death Rolls, healing, and care windows; Stress relief, which comes only from a written trigger; gear wear, Standard Issue, the Funding gate, the Ledger, and one Requisition per Downtime; the Behavior Tables, the Attention Ladder, Attack Dice and Titan Dice, the Reaction procedure, the rule that only a Nape strike kills a Titan, the size of Openings, Steam, the Falling Titan, Corpse Heat, the Grab countdown, Regeneration, the retreat clock, and the end tests; the standard Titans' numbers and the Read-gating of hidden values; the Leg roll, except its Circumstances (section 1.4a), the hazard and Night tables, their rolls, and their modifiers, whose amounts are closed and which the route the Mission Brief sets, the night camps made, the Leg roll, and the flare decide (Chapter 7, section 7.1; decision batch 9, 9-37), "always advance", rations, and the Straggler's random victim; Squadmates, which the players direct, though the GM may voice one; and item 3, results stand, the Next Behavior included once it is rolled. Every chapter's Rulings paragraph points to this list.

The Push, Covering, and Help rules of sections 1.5 and 1.8 apply to a called roll as to any attribute roll: every called roll needs 1 success (section 1.4), can be Pushed and Covered, and can be Helped: outside a Titan Engagement and a Skirmish as the GM rules, and in a fight as the fight's Help rule gives (section 1.8; Chapter 7, section 7.4; decision batch 9, 9-36).

## 1.2 Dice

- Every die is a six-sided die. **D6** means roll one die. **xD6** means roll x dice and add them together. It is used only for table results and other rolls that add dice up, never for a dice pool, which counts sixes. **D66** means roll two dice, reading the first as tens and the second as ones, for a result from 11 to 66.
- A dice pool holds three kinds of die: **base dice**, **Gear Dice**, and **Stress Dice**. Use a different color for each kind so they stay distinguishable during a Push. Bonus Dice are base dice.
- **Every 6 is a success,** whatever kind of die shows it. Titan Dice, which a Titan's attack rolls, are not part of any pool and succeed on 5 or 6 (section 1.10).
- `data/core/dice-pool.yaml` lists, for each kind of die, which faces succeed, which faces a Push re-rolls and which it leaves in place, and what a 1 does.

## 1.3 Attribute rolls and the dice pool

A roll is an **attribute roll** if its rule names an attribute. Rolled actions, Reactions, Death Rolls (which name Strength), called rolls, and attribute rolls a rule calls for are all attribute rolls. Only attribute rolls use a dice pool, count successes, and can be Pushed.

Some rolls are not attribute rolls, such as a Gas Roll (Chapter 4) or a roll on a table. These roll exactly the dice their rule states. They add no pool components, take no Circumstances, and cannot be Pushed.

### Building the pool

A pool is made of **attribute + one Talent + Bonus Dice + Gear Dice + Stress Dice**, less any penalties. Build it in this order:

1. **Name the roll and its Circumstances.** Every attribute roll is made for one Action Catalog entry (Chapter 2), unless a rule, or the GM for a called roll, calls for an attribute directly (see below). The entry names the attribute and which gear items can supply Gear Dice. Most entries are actions. A few entries are rolls that are not actions, and the Catalog marks them that way. The Action Catalog has an entry for each Reaction (dodge and block) and for the Death Roll, each marked as not an action. They are never taken as actions (section 1.9), but a Talent can name them like any other entry (OQ-11). At this step, before any Bonus Dice are declared, the GM names the roll's Circumstances (section 1.4a), and for a called roll also its entry and its stakes (section 1.1, item 2).

   **Acts no rule covers.** ADR-0024, limit 9: an act no rule covers is a called roll. Before the pool is built, the GM names the Catalog entry closest to the act, from the entries marked as rolled when called, or the attribute alone, along with the Circumstances and the stakes (section 1.1, item 2). Outside a Titan Engagement and a Skirmish, Chapter 2 (section 2.9) keeps its steps for an act that changes a tracked value as the default order, and its list of tracked values as an index, not a gate: an act that matches no tracked value is ruled on, not left without effect (OQ-27, OQ-35). In a Titan Engagement or a Skirmish the steps are not used, and an act that is not an entry taken as written is an improvised act with one entry as its model (section 1.9), and a called roll only when no entry of kind action could model it and it would change nothing the fight tracks (section 1.1, item 1; decision batch 9, 9-36). When a Catalog entry is used, the roll is that entry for every purpose: its attribute, its gear items, and any Talent that names it.

   **Rolls called for by attribute.** A rule, or the GM for a called roll, may call for an attribute roll without naming a Catalog entry. That roll uses the attribute alone. "The attribute alone" means the roll gets no Talent dice (ADR-0006: an untrained soldier still rolls their full attribute). Every other step below still applies: Bonus Dice from any source whose row covers the roll, Gear Dice only from a gear item the calling rule names, and Stress Dice (Chapter 2, section 2.9). A called roll on an attribute alone names no gear item, so it has no Gear Dice; a gear item or other object that helps counts toward its Circumstances and gives no Gear Dice (Chapter 4, section 4.1; decision batch 9, 9-24).
2. **Attribute dice.** Add base dice equal to the attribute's rating.
3. **Talent dice.** Add base dice equal to the level of **one** Talent that names this roll's Catalog entry. A roll can use at most one Talent that adds dice. A Talent that doesn't name the entry can't add dice to the roll. When the Talent's row sets a condition for that entry, its dice join only a roll that meets the condition: Horsemanship adds its dice to a dodge only when the soldier is mounted and dodges with the horse's Gear Dice (Chapter 2, section 2.7). Talents that bend a rule instead of adding dice apply whenever their trigger happens. They stack with each other and with the dice-adding Talent.
4. **Bonus Dice.** Declare Bonus Dice sources (section 1.7) and add that many base dice, 4 at most. A plus step of Circumstances (Easy, Routine, or Effortless) is one of these sources (section 1.4a).
5. **Penalties.** A penalty removes the number of dice its rule states, such as a result on a Chapter 3 table, or the dice a minus step of Circumstances removes (Hard, Harsh, or Desperate; section 1.4a). Penalties remove only base dice, they apply after the Bonus Dice cap, and they add up. They can never take the base dice below 1, and they never remove Gear Dice or Stress Dice. Every penalty comes from a named rule or from the roll's Circumstances (OQ-07).

6. **Gear Dice.** Pick **one** gear item that the roll's Catalog entry allows. Add Gear Dice equal to that item's current Gear Dice rating. An item worn down to 0 adds no dice. If more than one item qualifies, the roller chooses one before rolling. If the entry allows no gear item, the roll has no Gear Dice.
7. **Stress Dice.** Add Stress Dice equal to the soldier's current Stress (section 1.6). Stress Dice are part of every attribute roll except the rolls with a Stress Dice exception. The Death Roll has no Stress Dice, so it never causes a Stress Response, and it cannot be Helped (section 1.8). Another roll leaves out Stress Dice only if its own rule names it and the roll has a row under `roll_exceptions` in `data/core/dice-pool.yaml`; a later chapter that creates such a roll adds the row (OQ-03). A roll's own procedure may also forbid Help or a Push without a row, as the Graduation Exam's Trials do (Chapter 2).

`data/core/dice-pool.yaml` gives each component's kind of die, how many dice it adds, its minimum and maximum, its per-roll limit, and the chapter that defines it in full. It also lists the rolls with exceptions, such as the Death Roll, the performance roll, and the passive roll.

## 1.4a Circumstances

Every attribute roll has **Circumstances**: the one step of a seven-step ladder that the GM names for the situation the roll is made in. If the GM names none, the roll is Standard. The steps, from the most favourable to the least, are Effortless, Routine, Easy, Standard, Hard, Harsh, and Desperate. Hard alone always names this step; the Pace is written in full as a Hard Ride (Chapter 7). Each step adds or removes as many dice as it stands steps away from Standard. `data/core/circumstances.yaml` holds the ladder (`steps`), the rolls it reaches, and the rolls it never touches.

<!-- BEGIN RENDERED: circumstances from data/core/circumstances.yaml -->
| Circumstances | Effect on the pool |
|---|---|
| Effortless | +3 Bonus Dice |
| Routine | +2 Bonus Dice |
| Easy | +1 Bonus Die |
| Standard | nothing |
| Hard | a 1-die penalty |
| Harsh | a 2-die penalty |
| Desperate | a 3-die penalty |
<!-- END RENDERED: circumstances -->

1. **One step per roll.** The GM weighs everything about the moment and names one step. Rain, dark, and a snapped strap are one judgment, not three. A step named for a lasting condition is the step of every roll that condition touches while it lasts (Chapter 5). When a further condition touches a roll already under a lasting step, the GM names one step for that roll, weighing both; steps never add, and the lasting step applies again to later rolls the further condition does not touch (decision batch 9, 9-26). The GM names it with the stakes, before Bonus Dice are declared (section 1.3, step 1), so the player can answer a hard step with Help.
2. **Plus steps are Bonus Dice.** Effortless, Routine, and Easy are one Bonus Dice source, `circumstances` (section 1.7), and count toward the cap of 4 with Help, Openings, and every other source (ADR-0006). The roller chooses under the cap as for any source, and a plus step the cap leaves out spends nothing.
3. **Minus steps are penalties.** Hard, Harsh, and Desperate go through section 1.3, step 5, as one more penalty: after the Bonus Dice cap, base dice only, adding up with any penalty the soldier carries from a Critical Injury, a Stress Response, or a Fear Roll result, never taking the base dice below 1, and never removing Gear Dice or Stress Dice. However hard the task, a soldier always rolls at least one base die, so a 6 can always save them.
4. **Pool order.** Section 1.3's order stands: name the roll (with its Circumstances and, for a called roll, its stakes), attribute, Talent, Bonus Dice (the plus step among them, capped at 4), penalties (the minus step among them, never below 1 base die), Gear Dice, Stress Dice.
5. **Which rolls.** Every attribute roll a soldier or a Squadmate makes takes Circumstances: a called roll, an action, a Reaction, and every roll a rule calls for. A roll made for a group takes one step, on its roller's pool. Circumstances never reach a roll that is not an attribute roll (a Gas Roll, the fall roll, the infirmary roll, or any roll on a table), the Death Roll, the performance roll, the Graduation Exam's Trials, Titan Dice, or a Foe's Attack Dice and Guard. `data/core/circumstances.yaml` lists them under `never`.
6. **Too easy, or impossible.** A task easier than Effortless is not rolled: it happens. A task the GM judges impossible is not rolled: it does not happen, and the GM says so before anyone rolls (section 1.1, item 1). Anything possible is at worst Desperate. Routine and Effortless mostly serve a soldier who carries penalties: an injured soldier doing something simple rolls at Routine and keeps their dice.
7. **Needs never change.** Circumstances change dice, never what a roll needs (section 1.4, item 2). A Nape strike against a Nape Depth of 4 at Hard still needs 4 successes, from one fewer die.
8. **Named first, applied at its step.** The step is a fact of the roll, like its entry. A Talent, a Push, or a Cover never changes it (ADR-0016, Talent guardrail 10), and nothing changes it once the dice are rolled (section 1.1, item 3).
9. **A Reaction's step is fixed before the attack.** A Reaction takes the step in force when the attacker's card comes up: a Titan's card (Chapter 5, section 5.5) or a Foe group's card (Chapter 7, section 7.4). Until that card ends, no step is named, raised, or lowered for a Reaction against it, and a condition that arises during the card applies from the next card. A dodge whose successes cancel against a later card that round keeps the step it was rolled at (decision batch 9, 9-25).

**In a Titan Engagement** the core assumption is Standard, because the Anchor Rating, Positions, Openings, a grounded Titan, Call It, the Attention restriction, and every penalty a soldier carries already price the fight, so the GM names another step only for something no rule prices, such as rain on the rooftops, smoke, full dark, or ice, and never for the Titan's dice, cards, Attention, or tables (Chapter 5; `data/core/circumstances.yaml`, `in_titan_engagement`; OQ-167).

### Example: a called roll at Hard

Private Mila Brandt wants into a locked supply shed at night, and a Garrison sergeant holds the key. No rule covers talking him into it, his answer is in doubt, and a refusal would cost the Squad, so the GM calls a roll. Before the pool is built, the GM names:

- **The roll:** Persuade, the entry closest to the act.
- **The Circumstances:** Hard. The sergeant is half asleep and under orders.
- **The stakes:** on a success, he opens the shed. On a failure, it stays shut and he sends a runner to the Squad's officer: time and position.

Mila has Empathy 3, no Talent that names Persuade, and Stress 1. Persuade allows no gear item. Private Oskar Wendt stands beside her and backs her up, so the GM rules him present and able, and he Helps, spending nothing.

- **Pool.** Attribute: 3. Bonus Dice: 1, from Oskar's Help. Penalty: 1, from Hard, after the cap. Base dice: 3 + 1 - 1 = 3. Stress Dice: 1. Oskar's Help has cancelled the step.
- **Roll.** The base dice show 5, 2, and 4, and the Stress Die shows 3. No success, and no Stress Die shows a 1, so Mila can Push.
- **Push.** Mila gains 1 Stress and adds a new Stress Die. She re-rolls her three base dice and her Stress Die and rolls the new one. The base dice come up 6, 1, and 3, and the Stress Dice 2 and 5. One success: the sergeant unlocks the shed.

Had the Push failed too, the stakes would have fallen as named, and nothing more: the shed stays shut and the runner goes. The GM could not raise what the roll needs, add a second cost, or change the step after the roll, and Mila could try again only once something had changed (section 1.1, item 4).

## 1.4 Counting successes

1. The roll is final once the soldier has stopped Pushing, or cannot Push. Count every die showing a 6. Each one is one success.
2. The roll succeeds if it has at least as many successes as it needs. A roll needs **1 success** unless its rule names another number, and every such number is a quantity in the fiction or a tuned value. For example, a Nape strike needs the Titan's Nape Depth (Chapter 5, section 5.7), and a Parley's needs start from the Foe group's Parley value (Chapter 7, section 7.4). A called roll always needs 1. The GM never raises or lowers what a roll needs, and Circumstances never change it (section 1.4a; ADR-0024, limit 15). A Reaction needs no number of its own: its successes cancel an attack's (section 1.9). A roll that fails does only what its rule states for a failure, or, for a called roll, what the GM staked (section 1.1, item 2). If that rule states nothing, the failed roll has no effect.
3. Successes beyond what the roll needs do only what that roll's rule lists. Some rules add successes up across several rolls instead, such as Toughness (Chapter 5, section 5.7).
4. **Each success is used once.** A success that counts toward what a roll needs cannot also pay for an extra effect. The one exception is a Reaction whose successes cancel against several attacks from the same Titan or Foe in the same round (section 1.9).

## 1.5 Pushing

A Push trades Stress, and sometimes wear on gear, for a second chance at successes. A soldier can Push after a failed roll or after a successful one.

### When a soldier cannot Push

A soldier cannot Push if any of these is true:

- Any Stress Die showed a 1 on the roll, or after an earlier Push of the same roll.
- The roll's rule forbids a Push, as with a Death Roll or the first two Trials of the Graduation Exam (Chapter 2).
- The roll is a passive roll, which the soldier does not know was made (section 1.1, item 5).
- The roll is not an attribute roll.
- The roll has already been Pushed as many times as the soldier is allowed: once, unless a Talent allows more.
- A state or result the soldier holds forbids it (section 1.9).

No ruling forbids or forces a Push (section 1.1, item 6). A roll can be Pushed once, unless a Talent allows more. Each extra Push follows the same procedure, and a Stress Die showing 1 after any Push rules out further Pushes (OQ-02).

### The Push procedure

This order comes from ADR-0004. Follow it exactly.

1. **Roll.** Roll the pool. If any Stress Die shows a 1, the soldier suffers one Stress Response and cannot Push. Go to *Finishing a roll*.
2. **Decide.** The soldier may Push. If they do, one eligible comrade may offer to Cover the Push before any die is re-rolled (see *Covering*).
3. **Gain Stress.** The soldier gains 1 Stress and adds 1 new Stress Die to the pool. If the Push is Covered, the Covering soldier gains the 1 Stress instead, and no new Stress Die is added.
4. **Re-roll.** Pick up and roll again every base die and every Stress Die that is not showing a 6, along with any new Stress Die, and every Gear Die showing 2, 3, 4, or 5. Dice showing 6 stay as they are. **A Gear Die showing 1 is locked:** it stays in the pool showing 1 and is never re-rolled. Bonus Dice are base dice, so they are re-rolled unless they show a 6 (OQ-01, OQ-187; decision batch 11).

5. **Check the Stress Dice.** If any Stress Die now shows a 1, the soldier suffers one Stress Response.

**One Stress Response per roll.** A roll never causes more than one Stress Response. That holds however many Stress Dice show 1, and however many Pushes a Talent allows.

### What 1s mean

- **Base die 1:** nothing. It is re-rolled on a Push like any base die that isn't showing a 6.
- **Gear Die 1:** if the roll was Pushed and any Gear Die shows a 1 when the roll is final, the gear item that supplied the dice takes **one point of wear**: one point per Pushed roll, whether one Gear Die shows a 1 or all three. A 1 can be there from the first roll, since a Gear Die showing 1 is locked, or from the re-roll of a Gear Die that showed 2 to 5. A roll that was not Pushed causes no wear, even when Gear Dice show 1. Chapter 4 explains what wear does to each item. For example, ODM Gear worn down to 0 Jams.
- **Stress Die 1:** a Stress Response, as set out in steps 1 and 5, except on a passive roll, where it does nothing (section 1.1, item 5).

### Pushing and gas

A Pushed roll whose gear item is ODM Gear makes that round's Gas Roll three dice instead of two (Chapter 4). The Gas Roll is three dice however many of that round's rolls were Pushed rolls with ODM Gear, unless that soldier's Gas Roll for the round has already been made (Chapter 4, section 4.3). That includes a Pushed dodge made with ODM Gear, even though a Reaction is not an action. A Pushed dodge made with the horse while mounted (section 1.9) is not such a roll: a 1 showing on its Gear Dice wears the horse, not ODM Gear, and it does not by itself make the Gas Roll three dice (OQ-12, OQ-25).

### Finishing a roll

When a roll is final, resolve it in this order (OQ-05):

1. Count successes (section 1.4).
2. If the roll caused a Stress Response, resolve it on the table in Chapter 3, using the soldier's Stress after any Push, unless the roll's own rule names another resolution, as the Graduation Exam does (Chapter 2). A roll whose rule names another resolution still has its Stress Response, and still cannot be Pushed after it; only how it is resolved changes. If the result changes the roll or the action, apply that change now. A changed success count is the roll's count for every later use of that roll, including a Reaction's cancelling against later attacks (section 1.9).
3. Apply the roll's effect, or, for a failed called roll, the cost that was staked (section 1.1, item 2).
4. If the roll was Pushed, apply gear wear from Gear Dice showing 1.

### Covering

Covering means taking on a comrade's Stress from their Push.

Covering works as follows (OQ-06):

- **Who can Cover:** a soldier who meets all of these:
  - They are a soldier other than the one Pushing, and they are not Down.
  - They are a player character, or a Squadmate whose Chapter 2 rules allow Covering. Chapter 2 gives no Squadmate Covering (OQ-13).
  - In a Titan Engagement, they are at the same Position as the Pushing soldier or one Position step away, the same requirement as Help.
  - Outside a Titan Engagement, they qualify to Help that roll: under the rule that called for it; in a Skirmish, under the Skirmish's Help rule (Chapter 7, section 7.4); or, on a called roll outside a Skirmish, as the GM rules (section 1.8; decision batch 9, 9-42). If a rule that called for a roll allows no Help, no one can Cover the roll.
  - No state or result the soldier holds forbids it (section 1.9).
- **When:** after the Push is declared and before any die is re-rolled. Only one soldier can Cover a given Push, and the Pushing soldier can refuse the offer. If more than one comrade offers, the Pushing soldier chooses one. A Push that would re-roll no die, because every base die and Stress Die already shows 6, cannot be Covered.
- **What it takes:** the Covering soldier gains 1 Stress. Covering is not an action and spends neither the move nor the action. Outside a Titan Engagement, Covering also spends nothing: it needs only the eligibility Help has on that roll, not what Help spends.
- **Effect:** the Pushing soldier gains no Stress and adds no new Stress Die. Nothing else about the Push changes. Their existing Stress Dice are still re-rolled, a Stress Die showing 1 still gives *them* a Stress Response, and their Gear Dice showing 1 still wear their gear.
- The Covering soldier makes no roll, so Covering never gives them a Stress Response.

## 1.6 Stress

### Stress and Stress Dice

Stress is a soldier's mounting fear and adrenaline. It is a number that starts at the soldier's minimum Stress. Attribute rolls get Stress Dice equal to current Stress, except rolls with a Stress Dice exception, such as the Death Roll (section 1.3). A Stress Die showing 6 is a success like any other die, and a Stress Die showing 1 sets off a Stress Response. So as Stress rises, a soldier grows both more capable and more likely to break.

Stress has no maximum (OQ-04).

Stress carries over between Titan Engagements, Expeditions, and sessions. It changes only through the triggers below.

### Minimum Stress

- A soldier's **minimum Stress** equals their number of Scars. With no Scars, it is 0 (ADR-0008).
- Stress never drops below the minimum. Any reduction stops there.
- If a soldier gains a Scar while their Stress is below the new minimum, their Stress rises to that minimum immediately.
- This means a soldier with Scars always rolls at least that many Stress Dice. Each Scar also raises Resolve by 1, and Resolve counts against Stress Response and Fear Roll results. A soldier with five Scars must retire (Chapter 3).

### Gaining and losing Stress

`data/core/stress-changes.yaml` lists every trigger that changes Stress. It holds the triggers this chapter defines and the kinds of rule elsewhere that can name a change, such as a table result or a Talent. Stress changes only through a trigger in that file. The GM never raises or lowers Stress without one: a ruling changes Stress only as the stakes of a called roll, through the `ruling` row. A later chapter that creates a new trigger adds a row to the file, as Chapter 7 does for the Camp Relief at a Night Camp, the end of a Skirmish, and Downtime (sections 7.1, 7.2, and 7.4).

This chapter defines these triggers:

- **Push:** the Pushing soldier gains Stress, unless the Push is Covered (section 1.5).
- **Covering:** the Covering soldier gains the Push's Stress instead (section 1.5).
- **Ruling:** a soldier who fails a called roll whose stakes were Stress gains 1 Stress, once for that roll however many times it was Pushed, and never on a success (section 1.1, item 2).
- **End of a Titan Engagement:** when a Titan Engagement ends, for any reason, every soldier who held a Position at any point during it loses Stress (ADR-0008). That includes a Titan Engagement that ends because the Squad retreats.
- **Nape kill:** when a Nape strike kills a Titan, every soldier who holds a Position in that Titan Engagement at that moment loses Stress (ADR-0008).
- **Both at once:** a Nape kill that also ends the Titan Engagement sets off both triggers, and each applies in full.

Holding a Position is the test for being in a Titan Engagement (Chapter 5, section 5.2, `data/engagement/positions.yaml`, `holding_a_position`; OQ-10):

- The end-of-Engagement relief goes to every soldier who held a Position at any point during that Titan Engagement, including a soldier who left before it ended. A Squad that retreats still gets it, however many rounds its soldiers took to leave.
- The Nape kill relief goes to every soldier who holds a Position at the moment of the kill, not only the soldier who made the strike. A soldier who has already left the Titan Engagement holds no Position and gets nothing from the kill.
- "Every soldier" in the two field relief triggers includes Squadmates, not only player characters (OQ-13).

Rally clears a comrade's Stress Response but does not lower their Stress (Chapters 2 and 3).

**In Downtime,** a soldier's Haven lets them lower Stress and Grief through Downtime Actions such as Visit Haven. Chapter 7 sets the amounts (section 7.2).

### Stress Responses and Fear Rolls

- A **Stress Response** is triggered only by a Stress Die showing 1, and a roll causes at most one. A roll with no Stress Dice, such as a Death Roll, never causes one, and neither does a passive roll, on which a Stress Die showing 1 does nothing (section 1.1, item 5). Chapter 3 holds the Stress Response table and explains how Resolve counts against the result.
- A **Fear Roll** is never triggered by the dice. It comes from a horrifying event on the closed list of triggers in Chapter 3. One row on that list is the GM's to read: outside a Titan Engagement, the GM may call a Fear Roll for an event at least as horrifying as a listed trigger. Inside a Titan Engagement only the listed triggers call one (ADR-0024, limit 1).

## 1.7 Bonus Dice

Bonus Dice are extra base dice from Help, Openings, a plus step of Circumstances, and the situations listed in `data/core/bonus-dice-sources.yaml`. For each source, the file gives the dice it adds, which rolls it applies to, its condition, what it spends, and the chapter that defines it in full.

1. **Listed sources only.** Only a source in that file adds Bonus Dice. A later chapter that creates a new source adds a row to the file. Call It, for example, has its row there, added for Chapter 5 (section 5.8). Circumstances is the one source a ruling names: the GM names the step, and the `circumstances` row gives its dice (section 1.4a).
2. **Declare before rolling.** Every source is declared before the dice are rolled. None can be added afterwards, not even before a Push.
3. **Cap.** A roll gets at most **4** Bonus Dice from all sources together (ADR-0006).
4. **Choosing under the cap.** If more Bonus Dice are available than the cap allows, the roller picks which sources to use. Unused sources are not spent: Openings stay on the Titan, a comrade whose Help is not used keeps their action, and a plus step of Circumstances spends nothing.
5. **Bonus Dice are base dice.** They succeed on a 6, a Push re-rolls them unless they show a 6, and a 1 on one does nothing (OQ-01).
6. **Penalties come after the cap** (section 1.3, step 5), a minus step of Circumstances among them.

## 1.8 Help

Help lets a comrade add 1 die to a soldier's roll. Up to 3 comrades can Help one roll. Throughout this chapter, a **comrade** is any other soldier in the Squad, player character or Squadmate.

### Requirements

A comrade can Help only if all of these are true:

- They are a soldier other than the one rolling, and they are not Down.
- They are a player character, or a Squadmate whose Chapter 2 action list includes Help (OQ-13).
- The roll's `roll_exceptions` row in `data/core/dice-pool.yaml`, if it has one, does not exclude Help, and the roll's own rule does not forbid Help (OQ-03). The Death Roll's and the passive roll's rows exclude it.
- They declare the Help before the roll.
- In a Titan Engagement:
  - They have an unspent action this round. A turn or an action spent in advance, by a Reaction or a result, begins its round with its action spent (section 1.9, OQ-17).
  - They are at the **same Position as the roller or one Position step away**. Chapter 5 defines Position steps for each Anchor Rating (section 5.2, `data/engagement/anchor-ratings.yaml`). This is the Position requirement ADR-0024 (limit 7) asks for.
- Outside a Titan Engagement, they meet the requirement stated by the rule that called for the roll; in a Skirmish, they are taking part and not Down, Engaged or Apart (Chapter 7, section 7.4); on a called roll outside a Titan Engagement and a Skirmish, the GM rules them present and able (see *Outside a Titan Engagement*). Help on a called roll in a fight is the fight's Help, as the **On a called roll** bullet below gives (decision batch 9, 9-36 and 9-42).
- No state or result the soldier holds forbids it (section 1.9).

### Effect

- Each helper adds 1 Bonus Die, and at most 3 comrades can Help one roll. Help dice count toward the 4-die Bonus Dice cap.
- The helper does not roll. They cannot Push the roll, gain no Stress from it, and suffer no Stress Response from it.

### What it spends

In a Titan Engagement, the helper spends their action. A soldier can Help outside their own turn, such as on a comrade's turn or during a comrade's Reaction, as long as their action is unspent this round. If their own turn comes later in the round, it has only its move (OQ-08).

### Outside a Titan Engagement

Outside a Titan Engagement there are no Positions and no rounds.

- **On a roll a rule calls for,** Help is allowed only where that rule allows it. That rule states who qualifies to Help and what Help spends. Every rule that calls for a roll outside a Titan Engagement, including an Action Catalog entry, a Chase, an Expedition rule, or a Downtime rule, states this for its roll. If a rule that calls for a roll says nothing about Help, the roll cannot be Helped or Covered.
- **On a called roll,** up to 3 comrades who are present and able to help concretely may Help, as the GM rules. Help spends nothing unless the GM names, before the dice are rolled, a cost of time or position for it (section 1.1, item 2). That cost falls when the comrade declares Help, whatever the roll's result; it is not the roll's stakes and does not count against the one cost of a failed roll (decision batch 9, 9-28). A comrade who could Help may Cover (section 1.5). In a Skirmish, Help on a called roll is the Skirmish's Help (Chapter 7, section 7.4): up to 3 comrades taking part who are not Down, each spending their action, and the GM names no cost for it. In a Titan Engagement, Help on a called roll is the Help of *Requirements* above, spending the helper's action, with no cost the GM names (decision batch 9, 9-36).

The limits under *Effect* still apply (OQ-08).

## 1.9 Turns, actions, and Reactions

A Titan Engagement runs in rounds. Chapter 5 sets the order of play within a round, including initiative cards, Tempo, and Wings (section 5.3).

### Turns and actions

- Each round, every player character takes one **turn**, made up of one **move** and one **action**. Chapter 5 states how a turn is ordered (section 5.3, `data/engagement/round.yaml`, `turn_order`) and what a move can do (section 5.2). As a baseline, a move changes the soldier's Position by one step. Being Overloaded makes every ODM move spend the soldier's action as well (Chapter 4).
- An **action** is Help (section 1.8), one Action Catalog entry (Chapter 2) other than the entries the Catalog marks as not an action, an improvised act (below), or a called roll for an act no entry of kind action could model that changes nothing the fight tracks (section 1.1, item 1; decision batch 9, 9-36).
- **Improvised acts.** In a Titan Engagement or a Skirmish, a soldier may attempt an act no entry covers. Before the pool is built, the GM names the one existing entry whose effect the act imitates, its *model entry*, and that ruling stands. An act the soldier describes that is not an entry taken as written is an improvised act, even when a tracked value it would change matches an entry. The model entry is an entry of kind action that the soldier could take in that fight, never a Reaction, a roll, a fixed roll, or an option (Chapter 2, section 2.9). The act spends the soldier's action and is rolled with the model entry's attribute, gear items, Talents, and needs, taking Circumstances as any roll does (section 1.4a); an act modelled on an entry that is not rolled is not rolled. On a success it produces only the model entry's effect, at that entry's size, and it carries the model entry's restrictions. It never kills a Titan, never changes Nape Depth, Toughness, Attack Dice, or a card, never cancels or delays a card, never creates more Openings than the model entry could, and never gives an effect no entry has (ADR-0024, limit 9). Only a Nape strike taken as its entry is written kills a Titan (decision batch 9, 9-27). An act no entry of kind action in that fight could model, that would change nothing the fight tracks, is a called roll instead: it spends the action and is made on the soldier's turn, never in place of a Reaction (section 1.4a, item 9; decision batch 9, 9-25 and 9-45), Help on it is the fight's, its fall is low or high, and its time or position cost and its success touch nothing the fight tracks (section 1.1; decision batch 9, 9-36). Chapter 2 (section 2.9), Chapter 5 (section 5.4), and Chapter 7 (section 7.4) give examples.
- A move and an action can each be spent once per round and cannot be saved for a later round. Both refresh at the start of each round, except a move or action already spent in advance, which begins its round spent (below).
- **Declining.** A soldier may decline to use their move, their action, or both when their turn comes up. A move or action left unspent after the soldier's turn stays available until the round ends, but only for Help (section 1.8) and Reactions (a Reaction needs both the move and the action). A move held alone can do nothing after the soldier's card has passed. Whatever is held is lost when the round ends (OQ-16).
- **Spending a turn.** Whenever a rule spends a turn of a soldier's, such as a Reaction or a Chapter 3 result, it spends the soldier's earliest turn, starting with this round's, whose move and action are both unspent. If this round's turn has any part spent, the rule spends the next such turn, skipping any turn whose move or action is already spent in advance (OQ-09, OQ-46).
- **Spent at the start of the round.** A turn spent in advance by a Reaction, or spent by a result (Chapter 3), begins its round with its move and action already spent. An action a result spends in advance without its move, such as Chapter 3's next action spent, begins its round with that action already spent, and the turn keeps its move. Every rule that asks whether a soldier's move or action is spent this round reads that state, not what the soldier did during the round. So a soldier whose turn was spent in advance cannot Help that round, cannot make a Reaction with that turn, and holds nothing to decline. A soldier whose action alone was spent in advance cannot Help that round or make a Reaction with that turn, and can hold only the move (OQ-17, OQ-46).
- **States and results that forbid.** A state or result can forbid a soldier to Push, Help, Cover, or make a Reaction. It does so only by naming which of those it forbids on its own row (`forbids` in its YAML). This is the only route for a state or result to forbid them; the core eligibility requirements, roll-specific bans, and Squadmate restrictions still apply (ADR-0024, limit 13; OQ-18). For example, Down forbids all four (Chapter 3), and Grabbed forbids Help, Covering, and Reactions (Chapter 5, section 5.9).
- These things are not actions: Reactions, Pushing, Covering, declaring Bonus Dice sources, and spending Openings on the roll they join.

### Reactions

- A **Reaction** is a dodge or block that a soldier makes when a Titan or a Foe acts against them, outside the soldier's own turn. Against a Titan, that moment is when one of its cards resolves a behavior against the soldier and its Attack Dice have been rolled (Chapter 5, section 5.5).
- A Reaction is an attribute roll with a full pool, rolled for its own Catalog entry (section 1.3). It can be Helped and Pushed like any other attribute roll.
- A Reaction **spends one whole turn** of the soldier's: both a move and an action.
- **When a Reaction can be made.** A soldier can make a Reaction, whether or not they have acted this round, if both of these are true (OQ-09):
  - They have not already made a Reaction against that Titan, or that Foe, this round (OQ-14).
  - No state or result the soldier holds forbids it (section 1.9).

  No Reaction is made against an attack that scored 0 successes, so the soldier keeps their Reaction for a later attack (*Attack and Reaction*, step 5).
- **Which turn it spends.** A Reaction spends the soldier's earliest turn, starting with this round's, whose move and action are both unspent (*Spending a turn*, above):
  - If neither the move nor the action of this round's turn has been spent, the Reaction spends this round's turn.
  - Otherwise, the Reaction spends the soldier's next turn in full, and whatever is left of this round's turn can still be used on the soldier's card, if it has not yet come.
  - If that next turn already has its move or action spent, the Reaction spends the turn after it, and so on.
  - When a Titan's Grab lands on a soldier, and the soldier's dodge against that card, or the earlier dodge whose successes cancelled against that card, spent a turn later than their first counted Grab turn, the Grab gives that later turn back (Chapter 5, section 5.9; `data/engagement/grab.yaml`, `countdown`, `failed_dodge`; OQ-85, OQ-99).
  - A turn spent in advance still happens when it comes up. It counts as one of the soldier's turns for any rule that counts turns, such as a Grab (Chapter 5, section 5.9), but it begins its round with no move and no action, so the soldier cannot Help or hold anything that round.
- **When the Titan Engagement ends.** Turns and actions spent in advance, by a Reaction or a result, exist only inside the Titan Engagement where they were spent (Chapter 3, section 3.16, step 1). When that Titan Engagement ends, every turn or action spent in advance that has not yet come up is cancelled. The soldier owes nothing, and starts their next Titan Engagement with every turn unspent (OQ-15, OQ-71).

### Attack and Reaction

Every attack a Reaction can answer, from a Titan or from a person, is resolved by this one procedure (decision batch 8, 8-5; ADR-0019; ADR-0018, as amended). Chapter 5 adds only what belongs to Titans (section 5.5), and Chapter 7 only what belongs to people (section 7.4).

1. **The attack roll.** The acting side rolls and finishes its roll first, including any Push its rules allow. A soldier attacking a person may Push; a Titan and a Foe never Push. The attack's successes are its **Severity**, announced to every target. From then on the attack roll never changes.
2. **The Reaction.** Each target decides whether to make a Reaction, knowing the Severity, and rolls it as an attribute roll for its own Catalog entry, with Help and Bonus Dice declared before the roll as usual, at the Circumstances fixed when the attacker's card came up (section 1.4a, item 9). The reacting side Pushes last: the Reaction changes only through its own Push and through step 2 of *Finishing a roll* (section 1.5). A target who has already made a Reaction against that Titan or Foe this round makes no new roll; that Reaction's successes cancel against this attack (below).
3. **Cancel.** Each success of the finished Reaction cancels one of the attack's successes.
4. **Land or whiff.** The attack's successes left over are its **Net Successes** against that target. On 1 or more the attack lands on that target, and its effect reads the Net Successes wherever its rule names them. On 0 it whiffs against that target and does nothing to them.
5. **No Reaction.** A target who makes no Reaction, or whom a state or result forbids one, cancels nothing, so every success of the attack is net against them. An attack that scored 0 successes whiffs against every target, including one who cannot make a Reaction, and no Reaction is made against it.

Every target of one attack cancels against the same attack roll with their own Reaction, so one attack can land on one target and whiff against another.

- **Against a Titan,** the only Reaction is a dodge, because Titans cannot be blocked. The dodge is an Agility roll that takes its Gear Dice from ODM Gear, or from the horse while the soldier is mounted, one item per roll (ADR-0019; Chapter 4 defines mounted). The Titan's attack roll is its entry's Attack Dice, rolled as Titan Dice (section 1.10; Chapter 5, section 5.5). One Reaction covers every card that Titan plays that round, as follows (OQ-14):
  - A soldier makes at most one Reaction against each Titan per round.
  - When a Titan's card resolves a behavior against the soldier and its roll scores at least 1 success, the soldier chooses whether to dodge. If they don't, every success is net against them, and they can still dodge a later card from that Titan this round.
  - Once rolled, the dodge's successes, counted after step 2 of *Finishing a roll* (section 1.5), cancel against the card it answered and, separately, against every later card that Titan resolves against the soldier that round. Each card lands or whiffs on its own Net Successes.
  - Cancelling against a later card does not use the dodge's successes up (section 1.4, item 4).
  - What a landed card does with its Net Successes belongs to Chapters 3 and 5: a Critical Injury adds 1 to its roll for each Net Success beyond the first, and a Grab, a knock loose, and a Stress gain take no rider (Chapter 3, section 3.2; Chapter 5, section 5.5).

  Chapter 5 gives the full procedure (section 5.5).

- **Against a person,** in a Skirmish, the Reaction is a dodge or a block, as the attack allows (Chapter 7, section 7.4). It cancels as *Attack and Reaction* states, one Reaction covers every attack that Foe makes against the soldier that round, cancelling against each separately, and a landed attack deals its weapon's damage plus 1 for each Net Success beyond the first (ADR-0018, as amended). Chapter 7 gives which attacks each Reaction answers, a Foe's Guard, and the ambush.

- Blocking is possible only against an attack whose rules allow it: a Foe's Fight attack in a Skirmish (Chapter 7, section 7.4). No Titan allows it.

## 1.10 Who uses these rules

- **Player characters** use every rule in this chapter.
- **Squadmates:** this chapter settles only these things about Squadmates:
  - A Squadmate is a comrade (section 1.8), so it can be Helped as a roller.
  - It can Help or Cover only as Chapter 2's rules allow.
  - It loses Stress through the two field relief triggers (OQ-13).
  - Its attribute rolls take Circumstances like any soldier's (section 1.4a).

  Chapter 2 says which other rules apply to them: a Squadmate rolls Stress Dice, can Help and be Helped, and never Pushes or Covers. Where a rule or row in this chapter names a Squadmate condition, Chapter 2's rules decide it.
- **Titans** never build dice pools. They act from Behavior Tables (ADR-0001). A Behavior Table entry that harms or terrorizes rolls its Attack Dice as **Titan Dice**: each die that shows 5 or 6 is a success, and Titan Dice never Push and never take Bonus Dice, Help, Gear Dice, Stress Dice, or Circumstances (section 1.4a). The roll is the attack roll of *Attack and Reaction* (section 1.9; Chapter 5, section 5.5; ADR-0019). The Chase rules, not yet written, will say how a Titan pursues.

**Acts in this chapter** (ADR-0024, limit 12). Each act this chapter lets a soldier choose has a tracked value, and a Catalog entry unless it is a move (OQ-71). The tracked values are an index of what soldiers change by acting, not a gate (Chapter 2, section 2.9). Both are in `data/character/action-catalog.yaml`: Help is `help`, which changes `roll-dice-add`; Covering is `cover`, which changes `stress-raise`; and the dodge is `dodge`, which changes `behavior-avoid`. A move changes `position-change` (Chapter 5, section 5.2). Pushing, declaring Bonus Dice sources, spending Openings on the roll they join, and declining a move or action are steps of a roll or a turn, not acts, so they need no tracked value of their own.

---

## Example: a Pushed Reaction with Help and Covering

*The numbers in this example are for illustration only. Real Attack Dice come from each Titan's Behavior Table in `data/titans/` (Chapter 6, sections 6.2 to 6.5).*

A Titan's first card this round resolves a sweeping behavior against Private Mila Brandt. For this example, the entry rolls 6 Attack Dice. The GM rolls them as Titan Dice in the open: 5, 2, 6, 1, 3, and 4. The 5 and the 6 are successes, so the attack's Severity is 2. Mila chooses to dodge. She hasn't spent her move or her action this round, so the Reaction spends this round's turn.

- **Pool.** Mila has Agility 4, and no Talent of hers names the dodge entry. She is not mounted, so her Gear Dice come from her ODM Gear. Private Oskar Wendt is at the same Position and has an unspent action this round, so he Helps. That gives 1 Bonus Die, and Oskar's own turn later this round will have only its move. Her ODM Gear has a Gear Dice rating of 2. Her Stress is 1.
  - Base dice: 4 + 1 = 5. Gear Dice: 2. Stress Dice: 1.
- **Roll.** Base dice show 6, 4, 3, 1, 2. Gear Dice show 1, 5. The Stress Die shows 3. That's one success, one short of cancelling the attack's two. No Stress Die shows a 1, so she can Push.
- **Push.** Mila Pushes, and Oskar offers to Cover. He gains 1 Stress. Mila gains none and adds no new Stress Die.
- **Re-roll.** Mila keeps her base 6. She re-rolls the other four base dice (4, 3, 1, 2), her Stress Die, and the Gear Die showing 5; the Gear Die showing 1 is locked and stays. The re-rolled base dice come up 6, 2, 5, 1, the Gear Die comes up 5 again, and the Stress Die comes up 1.
- **Check.** A Stress Die shows 1, so Mila suffers one Stress Response.
- **Finish.**
  1. She has two successes (two base 6s).
  2. The Stress Response is resolved on the Chapter 3 table at Mila's Stress of 1.
  3. Unless that result changes the Reaction, her two successes cancel the attack's two. It has no Net Successes, so it whiffs against her.
  4. Finally, a Gear Die shows a 1 and the roll was Pushed, so her ODM Gear takes one point of wear.
- **Pushing and gas.** The dodge was a Pushed roll using ODM Gear, so Mila's Gas Roll this round is three dice.
- **The Titan's second card.** Later this round, the same Titan resolves another behavior against Mila, and its Attack Dice score 1 success. She has already made her one Reaction against this Titan this round, so she makes no new roll: her dodge's two successes cancel that one, and it whiffs against her too. Had the roll scored 3 successes, 1 would have been net, and the behavior would have landed on her.
- **Oskar.** If a card targets Oskar after he has Helped, he can still dodge. His action is spent, so the Reaction spends his whole next turn. He keeps this round's move, which he can still use on his card if it has not yet come. His next turn begins its round with its move and action already spent, so next round he cannot Help anyone.
