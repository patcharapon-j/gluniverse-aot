# GM judgment: review 1 (wof-reviewer, Opus)

Date: 2026-09-16. Task: `docs/research/gm-judgment/review-task-round-1.md`. Scope: Chapters 1 to 7 and their YAML, `CONTEXT.md`, ADR-0024 and the batch 9 amendments to ADR-0005, 0006, 0009, 0010, 0012, 0013, 0014, 0016, and 0018, decision batch 9 (9-1 to 9-24 and the erratum under 9-14), OQ-167 to OQ-176, `OWNER-DECISIONS.md`, and `IMPLEMENTATION-PLAN.md`. The packet, `site/`, and the parallel Codex review were not read. `tools/sim/run.py` was not run.

Severity follows the task file's guide. Throwaway dice scripts ran in the session scratchpad; their figures are quoted where odds matter (200,000 to 300,000 trials each, Push taken when short and no Stress Die shows 1).

## Counts

| Critical | Major | Minor |
|---|---|---|
| 1 | 8 | 12 |

## Checks run, and what passed

- `tools/render/render.py check`: every rendered block matches the YAML (54 blocks in 5 chapters). The YAML load passes. `tools/probes/chapter-06/render.py check` and `run6.py check` pass.
- Simulator phrase guards: `tools.sim.rules.Rules()` loads every file and every `guard()` passes against the batch 9 wording. No case was run.
- Greps: no "ADR-0003" in Chapters 1 to 7, `data/`, `CONTEXT.md`, `tools/render/render.py`, or `tools/sim/`; no `PROVISIONAL`; no em dash; "No rulings" only in Chapter 5 line 981, as the measurement sentence "with no rulings", which is correct; "difficulty" only in the three `_Avoid_` lines of `CONTEXT.md` (181, 307, 350).
- Every `gm:`, `gm_choices:`, and `gm_rulings:` field in `data/` names the ruling it allows or reads none with an ADR-0024 citation (critical-injuries 118 and 622, titan-harm 148, 218, 408, behavior-procedure 122, attention 214, anchor-ratings 119, engagement-setup 74, engagement-flow 163, squad-tactics 30, squadmates 103, standard-issue 145, falls 112, squad-supply 49, skirmish 432, foes 123, action-catalog 1076, hazards `choices` 20).
- Every roll on `circumstances.yaml` `never` carries its marker: `dice-pool.yaml` death-roll and performance-roll rows, `graduation-exam.yaml:28`, `death-rolls.yaml:76`, `titan-format.yaml:64`, `foes.yaml:156`.
- The Rulings paragraphs (Chapter 2 line 634, Chapter 3 line 37, Chapter 4 line 37, Chapter 5 lines 65 to 83, Chapter 6 line 34, Chapter 7 line 35) follow the 9-11 shape: what the GM rules, what stands, and the pointer to Chapter 1 section 1.1 item 6.
- The Parley reads the `parley` value (Bandit 1, sentry 1, trooper 2), Stand down's `needs_add` is 0 as the 9-14 erratum reads, and 9-22's rise is in place, so the trooper's Stand down needs 3 in a Skirmish and 2 outside one. Nape Depth, Toughness, Watch, Scarcity plus the ledger, and Break Free's 2 are unchanged by Circumstances.
- The Playtest rule tag sits on the foe rule (Chapter 7 line 596), Waypoint scenes (line 154), and the Requisition list's added rows (line 421). The Chapter 5 section 5.13 sentence (line 981), 9-23's retreat bullet, 9-24's sentences, Menace's and Stand Down's conditions, the nine `when_called` rows, and Talent guardrail 10 (Chapter 2 line 491) are applied as batch 9 gives them.

## Three pool walks (task check 2)

1. **A Rookie with Easy and Help at the cap.** A called Survive: Instinct 3, Fieldcraft 1, Stress 1. Easy (+1) and three helpers (+3) make 4 Bonus Dice, the cap, so the pool is 8 base dice and 1 Stress Die: 93.6% Pushed, against 81.1% alone. Routine with the same three helpers offers 5 and is capped to the same pool, and the step spends nothing. This conforms to 9-2 item 2. Neither 1.7 nor the `circumstances` row says whether a roller may take part of a multi-die source (2 of Routine's dice), but the capped pool is the same either way, as it already was for Call It.
2. **A veteran at Desperate with Gear Dice.** A called Fly outside a Titan Engagement: Agility 3, ODM Gear rating 3, Stress 2. Desperate takes the base dice from 3 to the floor of 1; the 3 Gear Dice and 2 Stress Dice stay. The roll succeeds 77.6% of the time against 86.7% at Standard, and wear reaches 10.6% of rolls against 7.3%. Harsh builds the same pool, because the floor stops both. This conforms to 9-2 item 3.
3. **A dodge in rain inside a Titan Engagement.** A Rookie (Agility 3, ODM Gear 2, Stress 1) under rain named Hard rolls 2 base dice, 2 Gear Dice, and 1 Stress Die. The Titan's roll takes no step (Chapter 5 line 491; `titan-format.yaml:64`). Against 6 Attack Dice the card lands 55.1% of the time (48.0% at Standard); against 9, 75.2% (69.1%). The pool conforms. When the step is named is Critical C1, and how it meets a second condition is Major M6.

---

## Findings by file

Files are ordered by their most severe finding. A finding that spans files sits under the file that is the source of truth for its fix.

### 1. Chapter 1 sections 1.3 and 1.4a, with Chapter 5 section 5.5 and Chapter 7 section 7.4: when a Reaction's Circumstances are named

#### C1. Critical: the GM can name a dodge's or a Block's Circumstances after the attack has been rolled and its Severity announced

- **Location:** `docs/rules/01-core-rules.md` line 68 (1.3 step 1: "At this step, before any Bonus Dice are declared, the GM names the roll's Circumstances"), line 87 (1.4a item 1), line 94 (item 8); `05-titan-engagement.md` line 499 (the dodge is "made after the Titan's roll is announced"), line 505 (*Circumstances*: "Standard unless the GM has named a step"; a mired Titan makes the dodge Easy), lines 66 and 83; `07-playtest-rules.md` line 696 (Block or Dodge, "after the Foe's roll is known"); `data/core/circumstances.yaml` lines 139 to 146.
- **Problem:** Every timing rule for Circumstances counts from the pool being built, and a Reaction's pool is built only after the attack roll is final (1.9, *Attack and Reaction*, step 2). No sentence requires a Reaction's step to be in force before the attacking card or Foe rolls. The GM can therefore see a Titan's successes and then name the dodge's step, and that choice decides whether the card lands. The Titan's dice are not re-rolled, but the ruling acts after them on the roll that settles their effect. ADR-0024 draws exactly this line ("the GM rules before the dice, never after them"; limit 8, a Titan's Attack Dice are never adjusted), and the owner rejected Coriolis's adjusting a result after the roll. Chapter 5's "has named" and its lasting-condition sentence imply standing conditions without forbidding a fresh step at the dodge, and the mired-Titan example invites one named at that moment.
- **Scenario:** Round 3 in Trost, with rain named Hard for ODM rolls since round 1. A Medium Titan's kill entry rolls 9 Attack Dice against Private Brandt and scores 5 successes. The GM, unwilling to lose her, says its foot has sunk into a cellar and names the dodge Easy. By simulation her dodge lets 9 Attack Dice land 75.2% of the time at Hard, 69.1% at Standard, and 63.2% at Easy. A GM who names the step knowing the Severity is choosing the outcome of that card, and the next GM names Hard on a card that scored 1.
- **Fix options:**
  1. Add item 9 to 1.4a and a `reactions` key to `circumstances.yaml`: a Reaction takes the step in force when the attacking card is turned up, or when the Foe's attack is declared, and no step is named, raised, or lowered for a Reaction once the attack roll is made. Point Chapter 5 section 5.5 and Chapter 7's Block or Dodge row to it.
  2. In a Titan Engagement and a Skirmish, allow only lasting conditions, named at the start of a round or as the condition begins (the Rulings paragraph's "says so once"), and reword the mired-Titan example so that the step is named when the Titan is mired, before its card.
  3. Add the sentence of option 1 to ADR-0024 limit 16 as well, so the line is in the record every drafter reads first.

### 2. `data/gear/squad-supply.yaml`, with Chapter 4 section 4.10 and Chapter 7 section 7.1: found supplies

#### M1. Major: the found-supplies cap limits one roll, and every soldier may search, so a Waypoint scene can refill the Squad Supply

- **Location:** `data/gear/squad-supply.yaml` lines 43 to 48 (`spending`); `04-gear.md` line 37 (Rulings) and line 610; `01-core-rules.md` line 45 (item 4: "Each soldier gets one attempt at a given obstacle per changed situation"); `07-playtest-rules.md` lines 110, 111, and 158; `data/expedition/legs.yaml` lines 96 to 99.
- **Problem:** "At most 1 unit per success" caps a single roll. Item 4 lets each soldier make their own attempt at the same obstacle, and nothing limits how many searches a place holds, how many units "the place could plausibly hold", or how many Waypoint scenes a day holds (one after each Leg). 9-5 capped finds "so that scarcity ... survives a good search roll"; the per-roll cap does not do that.
- **Scenario:** An abandoned town Waypoint. Four soldiers each roll Survive for food (Instinct 3, Fieldcraft 1, Stress 1, Pushing when short): 6.2 units on average by simulation, against a Funding 3 stock of 8 rations. A second Waypoint scene after the next Leg does it again, so rations, which the Leg roll and Pace are meant to drain (ADR-0009), stop mattering. One search with three helpers gives 2.4 units.
- **Fix options:**
  1. Cap by place: one successful search of a place adds units, at most 1 per success, and a place searched once yields nothing more; the other soldiers Help.
  2. Cap by scene: a Waypoint scene adds at most 2 units in total, whatever the rolls.
  3. Pay only the need: a successful search adds 1 unit of one kind, and a further search of that place needs a changed situation and a named cost.

### 3. Chapter 1 sections 1.1 and 1.8, with `data/core/dice-pool.yaml`, `stress-changes.yaml`, and Chapter 3 section 3.1: costs that fall on no failed roll

#### M2. Major: a cost for Help and a retry's cost of time are named "from the menu", but the menu's Stress, damage, and fall routes fire only on the roller's failed roll

- **Location:** `01-core-rules.md` line 275 (1.8: "Help spends nothing unless the GM names a cost from the menu") and line 45 (item 4: "time spent at a cost the GM names from the menu"); `data/core/dice-pool.yaml` lines 153 to 156 (`help`) and 197 to 203 (`retries`); `bonus-dice-sources.yaml` `spends_outside_titan_engagement`; the nine `when_called` rows (`02-character-creation.md` lines 1042 to 1055); `stress-changes.yaml` lines 48 to 57 (`ruling`: "fails a called roll whose stakes ... were Stress"); `health.yaml` lines 55 to 58 (`by_ruling.when`: "A called roll fails"); `03-harm-and-mind.md` line 66 ("harms the soldier who rolled"); `falls.yaml` lines 35 to 43 (`rule-named`); `01-core-rules.md` line 206 ("a ruling changes Stress only as the stakes of a called roll").
- **Problem:** Two costs sit outside a roll's stakes: what Help spends, and what time spent before a retry costs. The text does not say when either falls (when declared, when the dice are rolled, or only on a failure), whom it hits (the helper), or whether it counts against "one cost per failed roll". The Stress, damage, and fall rows accept only the roller's failed called roll, and 1.6 says Stress changes only through a row. A helper's Stress, a helper's damage, and a retry's Stress therefore have no trigger at all.
- **Scenario:** Outside a Skirmish, Brandt braces a door against a mob, and the GM rules that Wendt can Help "at 1 Stress: you are shoving into the crush". Brandt succeeds. Does Wendt gain 1 Stress? By 1.8 yes, and by `stress-changes.yaml` no. Later Brandt retries a lock with "an hour spent, and 1 Stress" as the retry's cost, then fails with stakes of 2 Crush damage. That is two costs for one failure, one of which no row can apply.
- **Fix options:**
  1. Limit Help's cost and a retry's cost to time or position, which needs no row, and say that it falls when named, before the dice.
  2. Keep the menu for both and add the routes: a `ruling-help` Stress gain (the helper, when named, on declaring Help) and a `ruling-retry` gain; widen `by_ruling.when` and `rule-named` to "a cost the GM named for Help or a retry"; and state that such a cost is not the roll's stakes and does not count against one cost per failed roll.
  3. Drop the Help cost ("Help on a called roll spends nothing") and keep option 1 for the retry.

### 4. Chapter 4 section 4.6 and `data/gear/falls.yaml`: a fall a ruling names

#### M3. Major: a ruling may name the extreme band, which deals 4 damage one time in three, past the ceiling of 3 on harm a ruling names

- **Location:** `04-gear.md` lines 322 and 335; `data/gear/falls.yaml` lines 35 to 43 (`rule-named.height`: "the band the GM names from the fall's height"), lines 65 to 67 (`outside_titan_engagement`), and `damage_table`; `01-core-rules.md` lines 38 and 39; `03-harm-and-mind.md` line 71 ("never 4 damage or more: 4 is a musket's damage"); ADR-0024 limit 17.
- **Problem:** Outside a Titan Engagement nothing limits the band a ruling names. The extreme band adds 4, so its D6 deals 2, 2, 3, 3, 4, or 4 (the shattering-landing row); high tops out at 3. 9-5 and Chapter 3 keep harm a ruling names under 4 because 4 is the musket's job, which is rolled, and a named extreme fall reaches 4 without that roll.
- **Scenario:** A called Fly between two bell towers at night, Harsh, staked as "you fall from the tower: extreme". On a failure, one time in three it deals 4 Crush damage, which takes a fresh Health 4 Rookie to 0, Down, with an immediate Crush Critical Injury.
- **Fix options:**
  1. A fall a ruling names is low or high, never extreme (`rule-named.height`, Chapter 4 line 322, the Chapter 1 menu).
  2. Cap the damage of a fall a ruling names at 3: the shattering row reads as heavy-landing for it.
  3. If towers and the Wall are meant to be deadlier, record a decision that the menu's fall is exempt from the ceiling, and correct Chapter 3's "never 4 damage or more".

### 5. Chapter 3 section 3.1, with ADR-0005 as amended: damage a ruling names at low Health

#### M4. Major: 1 to 3 damage on a wounded soldier inflicts a Critical Injury on the failed roll itself, which reads as the "direct Critical Injury" the owner excluded

- **Location:** `03-harm-and-mind.md` lines 64 to 73 (*Harm a ruling names*) and line 81 (damage that brings Health to 0 "gains one Critical Injury ... at once"); `01-core-rules.md` lines 39 and 43; ADR-0005's batch 9 paragraph; `OWNER-DECISIONS.md` answer 5; 9-5 *Why*.
- **Problem:** 9-5 reads "never a direct Critical Injury" as "only through Health". For a soldier at 3 current Health or less, which describes most soldiers after one fall or Skirmish, the menu's damage is a Critical Injury roll on the failed roll, and a lethal row starts a Death Roll's time limit. 9-5's own reason for the ceiling ("a ruling that puts a Health 4 Rookie at 0 and rolls a Critical Injury is the musket's job") describes exactly this outcome one box lower. OQ-167 logs lethality drift in a Titan Engagement, not harm a ruling names outside one, so the gap is not logged.
- **Scenario:** A Night Camp after a Bandit ambush, with Brandt at 2 current Health. The GM calls an Endure to carry a wounded civilian across a ford, staking 2 Crush damage from the rocks. She fails: 0 Health, Down, and a Crush Critical Injury rolled now. One failed called roll has done what only rolled attacks did before.
- **Fix options:**
  1. Damage a ruling names never takes current Health below 1: it marks boxes down to 1 and stops (`by_ruling`, Chapter 3 section 3.1).
  2. Damage a ruling names that brings Health to 0 makes the soldier Down with no immediate Critical Injury (an ADR-0005 amendment).
  3. Keep the rule, put it to the owner as an open question with this scenario, and have the GM state the soldier's current Health with the stakes, so the table sees the risk before the dice.

### 6. Chapter 1 section 1.9, Chapter 2 section 2.9, Chapter 5 section 5.4, and `action-catalog.yaml` `in_a_fight`: the model entry

#### M5. Major: nothing limits which kind of entry can be a model entry, so a Reaction, a fixed roll, or a roll no action takes can be imitated on a soldier's action

- **Location:** `01-core-rules.md` line 287; `02-character-creation.md` lines 621 to 628; `05-titan-engagement.md` lines 436 to 447; `data/character/action-catalog.yaml` lines 1047 to 1068 (`in_a_fight`); `07-playtest-rules.md` line 520, the only place that says "one entry this section allows".
- **Problem:** "The one existing entry whose effect the act imitates" admits every kind: `dodge` and `block`, which are Reactions that spend a whole turn and follow an attack roll; `leap-clear`; `death-roll`; the fixed rolls; `downtime-action`. Chapter 1 also says the act "is rolled with the model entry's attribute" without Chapters 2 and 5's "an act modelled on an unrolled entry is not rolled". "I take cover" is among the commonest improvised acts at any table.
- **Scenario:** Before a Titan's card, Private Wendt dives behind a chimney stack, and the GM names `dodge` as the model. On his action, not a turn, he rolls a dodge before any Attack Dice. Nothing says whether its successes cancel this round's cards as a Reaction's do, or whether it spends his one Reaction against that Titan. Either answer beats the real dodge, which costs a whole turn and is rolled knowing the Severity.
- **Fix options:**
  1. A model entry is an entry of kind `action` that the soldier could take in that fight (Titan Engagement or Skirmish), never a Reaction, a `roll`, a `fixed-roll`, or an option used outside a fight. State it once in `in_a_fight` and point Chapters 1, 5, and 7 to it.
  2. Add an example: taking cover is a move, or Circumstances on a later dodge named before the card (C1), never an improvised act modelled on the dodge.
  3. Copy "an act modelled on an unrolled entry is not rolled" into Chapter 1 section 1.9.

### 7. Chapter 5 preface and `circumstances.yaml` `in_titan_engagement`: a lasting step against one step per roll

#### M6. Major: the lasting-condition rule and the one-step rule give no answer when a second condition meets a roll already under a lasting step

- **Location:** `05-titan-engagement.md` line 66 ("applies to every soldier's roll that the condition touches while it lasts ... rather than judging each roll again"), lines 83 and 505 (a mired Titan makes the dodge Easy); `data/core/circumstances.yaml` lines 139 to 146 (`lasting_condition`, `titan_conditions`); `01-core-rules.md` line 87 (1.4a item 1: "The GM weighs everything about the moment and names one step").
- **Problem:** With rain named Hard for every ODM roll, the example makes a mired Titan's dodge Easy. Item 1 says one step weighs everything, and Chapter 5 says a lasting step applies without judging each roll again. The steps might add (Standard, which is two steps on one roll), the GM might weigh both again (which Chapter 5 says not to do), or the later condition might replace the lasting one. "Every ODM roll" is undefined too: a mounted dodge, a Nape strike (Blade Set Gear Dice, with ODM Gear counted as had), a Read.
- **Scenario:** Rain named Hard; the Titan steps into a flooded cellar and is mired; Brandt dodges with ODM Gear. Standard (the net), Easy (the latest), or Hard (the lasting step) give land rates of 69.1%, 63.2%, and 75.2% against 9 Attack Dice.
- **Fix options:**
  1. Each roll still has one step: when a new condition touches a roll under a lasting step, the GM names one step for that roll weighing both, before the card (C1), and the lasting step applies again afterwards.
  2. Or conditions each count as a step and add, capped at +3 and -3; this changes 9-2 item 1 and needs a decision.
  3. Replace "every ODM roll" with "every roll whose Gear Dice come from ODM Gear", or name the rolls the example covers.

### 8. Chapter 1 section 1.1 item 2, Chapter 2 section 2.9, and `dice-pool.yaml` `called_roll`: what success gives

#### M7. Major: "what success gives" has no limit in chapter text; the only rule closing found gear is a YAML `gm:` field

- **Location:** `01-core-rules.md` line 32; `02-character-creation.md` line 617; `data/core/dice-pool.yaml` line 148; `data/gear/standard-issue.yaml` lines 145 to 148 (`gm`: "an item off the list comes only by Requisition"); `04-gear.md` line 37 (Rulings) and line 642 (the design note's "no ruling makes a new gear item"); ADR-0024 limits 5, 6, and 10.
- **Problem:** The menu closes what failure costs, and nothing closes what success gives. Chapter 4's Rulings paragraph never says a gear item comes only by Standard Issue, Requisition, or taking a dead comrade's items; that sentence lives in a `gm:` field and a design note. Nothing in Chapter 1 or 2 stops a stake from naming a horse, a musket, a rated tool kit, Stress relief, a Commendation, or a Research Point as success, and the last two come from tables under limits 5 and 6. Riderless horses and gear taken from the dead are among the likeliest Waypoint scene rewards in the 845 to 850 setting.
- **Scenario:** A Waypoint scene at a wrecked supply wagon of a broken Long-Range formation. The GM names success on a called Spot as "a working ODM Gear set, rating 3". A reader of Chapters 1, 2, 4, and 7 finds nothing against it, and 9-16's Scarcity and Limited floor are bypassed.
- **Fix options:**
  1. Add a closed line to 1.1 item 2 and `called_roll`: success gives the act itself, information, a position, or found Squad Supply as Chapter 4 caps it; never a gear item, Stress relief, healing, a Commendation, a Research Point, or a Faction Standing change, each of which comes only from its rule or table.
  2. Move the `standard-issue.yaml` sentence into Chapter 4 section 4.1's Rulings paragraph and name the three routes for a gear item.
  3. If found gear is wanted, give it a Requisition-style row with a Scarcity and the unmeasured mark.

### 9. `CONTEXT.md`, with Chapter 1 section 1.1 item 5 and `dice-pool.yaml`: the passive roll

#### M8. Major: the glossary calls a passive roll a called roll; Chapter 1 and the YAML keep them apart, leaving stakes on a passive roll undefined

- **Location:** `CONTEXT.md` line 176 ("A passive roll is a called Spot or Size Up the GM makes out of sight"); `01-core-rules.md` line 46 (item 5, where a soldier who looks "rolls Spot in the open as a called roll", as distinct from the passive roll); `data/core/dice-pool.yaml` lines 204 and 205 (`called_roll.secret`: "Never. The passive roll ... is the only roll made out of sight") and lines 241 to 262 (`passive-roll`, with both `bonus_sources_excluded: all` and `bonus_sources_allowed: [circumstances]`); `stress-changes.yaml` lines 48 to 57.
- **Problem:** If a passive roll is a called roll, the GM names stakes for it, a failure can cost from the menu, and the `ruling` Stress row fires on a soldier who does not know a roll was made, against 9-10's reason for removing the Push and the Stress Response. If it is not, the glossary contradicts the chapter and `called_roll.secret`. The row's two fields also read differently in any tool that checks only one of them.
- **Scenario:** The GM makes a passive Spot for Wendt against a tripwire in a ruined granary. Is a stake such as "you trip it: a low fall" named? If he fails, does he fall, and could the GM have staked 1 Stress?
- **Fix options:**
  1. Glossary and item 5: a passive roll is not a called roll and has no stakes; failing it means only that the soldier does not notice. Add `stakes: none` to the row.
  2. Replace `bonus_sources_excluded: all` with the list of sources a roller declares, or add a comment that `bonus_sources_allowed` overrides it.

---

## Minor findings

### `docs/rules/01-core-rules.md`

- **m1. Minor: item 6 lists the Leg roll as ruled on in no way, without the Circumstances exception.** *Location:* line 47, against line 91 (1.4a item 5), `circumstances.yaml` line 67 (`applies_to` names the Leg roll and camp roll), and Chapter 7 lines 35 and 274. *Problem:* Chapter 7 carves the exception ("whose Circumstances are the only part a ruling names"), and Chapter 1's list does not. *Scenario:* a GM reading only Chapter 1 refuses a player who says a storm should make the Leg's Survive Hard. *Fix:* read "the Leg roll and the camp roll, whose Circumstances aside"; or close item 6 with "Circumstances still reach every attribute roll on this list that section 1.4a does not exclude".
- **m2. Minor: "the GM rolls out of sight only a passive roll" is false of the Next Behavior.** *Location:* line 46; ADR-0024 limit 14 (line 25: "Secret rolls exist only for passive noticing outside a fight"); `dice-pool.yaml` line 204; against Chapter 1 line 44 and Chapter 5 line 83. *Scenario:* a player cites limit 14 to ask that the Next Behavior be rolled in the open. *Fix:* "the only soldier's roll made out of sight", or name the Next Behavior as the other hidden roll in all three places.
- **m3. Minor: section 1.4a prints no ladder table.** *Location:* lines 83 to 96. The plan (WP-G0) asked for the ladder rendered from `circumstances.yaml`, and the render check reports no Chapter 1 block; the chapter gives only "as many dice as it stands steps away from Standard". *Scenario:* a GM at the table counts steps to find that Harsh is 2 dice. *Fix:* render `steps` between BEGIN and END RENDERED markers (step, effect on the pool).
- **m4. Minor: "a tool that is not a gear item" omits 9-24's gear item.** *Location:* line 72; `dice-pool.yaml` lines 96 to 106 (the `gear` component, citing 9-16 only); against 9-24, Chapter 2 line 632, and Chapter 4 line 43, which say a gear item or other object that helps counts toward the step, gives no Gear Dice, and cannot be worn. *Scenario:* a soldier with a rated tool kit reads Chapter 1 and expects its Gear Dice on an attribute-alone called roll. *Fix:* "a gear item or other object that helps counts toward its Circumstances and gives no Gear Dice (decision batch 9, 9-24)" in both places.
- **m5. Minor: no default for an act the whole Squad attempts.** *Location:* lines 28 to 45. Nothing says whether climbing the Wall's stair or fording a river is one called roll with Help or one roll per soldier, and one cost per failed roll multiplies by the Squad's size. OQ-168 counts rolls, and no rule states a default. *Fix:* in item 1, "an act the Squad makes together is one called roll by the soldier the players choose, with Help", or state the reverse.

### `CONTEXT.md`

- **m6. Minor: Titan Dice omit Circumstances.** *Location:* line 310 ("takes no Bonus Dice, Help, Gear Dice, or Stress Dice"), against Chapter 1 line 348 and Chapter 5 line 423. *Fix:* add "or Circumstances".
- **m7. Minor: "Hard" names a step, a Pace, and two Talents.** *Location:* `circumstances.yaml` steps; Chapter 7 lines 111 and 120 (Hard Ride, whose Leg roll is Ride); Chapter 2 lines 887 and 938 (Hard to Kill, Hard Rider). *Scenario:* "Ride on a Hard Ride at Hard, and Hard Rider applies" is a real sentence at the table. *Fix:* a glossary usage line that "Hard" alone is always the step and "Hard Ride" is the Pace; or rename the Pace.

### `docs/rules/07-playtest-rules.md`

- **m8. Minor: the Straggler's Endure takes Circumstances, while a rolled hazard row is "never softened".** *Location:* line 274 against lines 35 and 162 and 9-15. A Rookie's Pushed Endure (Strength 4, Stress 1) succeeds 81.1% of the time at Standard and above 90% at Effortless, so a step on the victim's roll softens the row's lethal Bite Critical Injury by ruling. *Fix:* hazard-row rolls are Standard by default, with another step only for something the row does not already price, as in a Titan Engagement; or put the Straggler's Endure on `never` with its marker.
- **m9. Minor: a directed Foe cannot run or raise an alarm on its own.** *Location:* lines 598 to 600; `foes.yaml` `gm_rulings.directed_by_ruling.limits`. A directed turn is Fight, Shoot, reload, close in and Fight, or nothing, so 9-7's "the last bandit runs" works only as the whole group breaking sooner. *Scenario:* two Garrison sentries; one is Engaged, and the other has every reason to run for the bell. *Fix:* add "becomes Apart and leaves the Skirmish, counting as out for Grit" as a turn a directed Foe may take with a reason said aloud; or say that a lone Foe runs only as the group breaking sooner.
- **m10. Minor: the Parley design note's figures come from different builds.** *Location:* line 710. By simulation (Pushed), 3 base dice and 2 Stress Dice give 17.1% at need 3 and 39.8% with three helpers, matching "about 20%" and "near 40%", but 3.7% at need 5 with two helpers, not "about 2%"; 5 base dice give 22.2%, 51.1%, and 4.8%. *Fix:* name the build once for all three figures, or restate the need-5 figure as "under 5%".

### `docs/rules/03-harm-and-mind.md`

- **m11. Minor: `gm-horror` can follow a failed called roll in the same breath.** *Location:* lines 683 to 688; Chapter 1 line 43 (a stake is never a Fear Roll). *Scenario:* the braced beam falls on the civilians behind Brandt, as staked, and the GM calls a Fear Roll for it, which is a Fear Roll staked in all but name. *Fix:* add to `gm-horror` "never for an event the stakes of a called roll named or caused"; or accept it and say so in the advice.

### `docs/rules/05-titan-engagement.md`

- **m12. Minor: framing has no bounds on Background Titans.** *Location:* lines 114 to 120; `engagement-setup.yaml` lines 74 to 79. The setup rows use at most two clocks, of 4, 6, or 8 (lines 67 to 70), and framing names "how many" and "their clock lengths" with no limit, so a clock of 0 or five Background Titans is undefined or unmeasured past the design note's warning. *Fix:* framed clocks take a length the setup table uses (4, 6, or 8) and number at most two unless a Mission Brief row names more; or define when a clock of 0 fills.

---

## Prioritised fix list

1. **C1:** pin a Reaction's step before the attack roll (1.4a, `circumstances.yaml`, Chapter 5 section 5.5, Chapter 7's Block or Dodge row, ADR-0024 limit 16).
2. **M5 and M6:** limit model entries to actions the soldier could take in that fight, and settle a lasting step against a new condition on one roll (one step per roll, named before the card).
3. **M3 and M4:** bring harm a ruling names under its stated ceiling: no extreme band, and no immediate Critical Injury from ruling damage, or an owner question for M4.
4. **M1 and M7:** cap found supplies per place or scene, and close what success gives, moving the gear-item sentence into Chapter 4.
5. **M2:** give Help's cost and a retry's cost a route, or limit both to time or position.
6. **M8:** make the passive roll not a called roll, with no stakes, in the glossary, Chapter 1, and the row.
7. **Minors:** m1, m2, m4, and m6 are one-line wording fixes; m3 is a render; m5 and m7 to m12 are readings a decider can settle in one pass.

Routing: M4 touches the owner's answer 5 and M6 option 2 changes 9-2, so both go to a decider; the rest are drafting fixes within batch 9.
