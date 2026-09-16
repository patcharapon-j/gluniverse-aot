# Difficulty mechanics: successes needed or dice removed

Research for the owner's change that makes GM judgment valid (today forbidden by Chapter 1, section 1.1, item 3, "No dice by judgment", and by ADR-0003). The GM will set how hard a task is. This file compares two ways to express that, (A) a required number of successes and (B) dice added to or removed from the pool with any six a success, plus hybrids, and ends with a proposal.

Research only. Nothing in the rules, YAML, ADRs, CONTEXT.md, simulator, site, or packet is changed by this file.

Method: every percentage below is exact (rational arithmetic over the binomial distribution, computed by a script kept in the session scratchpad), not simulated or estimated. The WoF Push model follows Chapter 1, section 1.5 exactly: a Push is allowed only if no Stress Die shows 1; it adds 1 Stress Die unless Covered; it re-rolls base dice and Stress Dice not showing 6; Gear Dice never re-roll. Stress Response *effects* (Flinch and Seized Up lose 1 success, Everything Slips zeroes the roll; `data/mind/stress-responses.yaml`) are not applied to the success figures; the chance that a Stress Die shows 1 is reported beside them instead. Two checks against the rulebook: the 3-die Death Roll's 42.1% and its 7.4% for 2 or more successes match Chapter 3, section 3.4's design note, and the Rookie's Pushed Feint at needs 2 comes out at 49.8% against Chapter 5's simulated 49.6% (which includes Stress Response effects).

Reference page numbers are the printed page numbers (PDF page minus 4 in both books).

---

## 1. What WoF does today

### 1.1 The pool and the levers (Chapter 1; ADR-0004, ADR-0006, ADR-0019)

- Pool: attribute (2 to 5, key attribute up to 6) + one dice Talent (0 to 3, no more than 2 at creation) + Bonus Dice (at most 4 from all sources) + Gear Dice (one item, 1 to 3) + Stress Dice (current Stress). Every 6 succeeds on every kind of die. Titan Dice are outside any pool and succeed on 5 or 6.
- Penalties are already B-shaped: a named rule removes base dice, after the Bonus Dice cap, never below 1 base die, never touching Gear or Stress Dice (section 1.3, step 5; `data/core/dice-pool.yaml`, `penalty`). Sources today: Stress Response rows (1-die penalties on named entries), Fear Roll next-roll penalties, Critical Injury rows (1 to 2 dice, a lost arm up to 4), Break Free once lifted (2 dice).
- Circumstantial bonuses are already B-shaped: Openings (+1 each), a grounded Titan (+2), Reading from Distant (+2), Call It (+2), the Ambush (+2), medical supplies (+1), Help (+1 per helper, up to 3). All share the cap of 4 (`data/core/bonus-dice-sources.yaml`).
- Needs: a roll needs 1 success unless its rule names a number (section 1.4). Successes beyond the need do only what the roll's rule lists, and a success that counts toward the need cannot also pay for an extra effect.

### 1.2 Typical pools

Attributes after the Lifepath: key attribute 4 about 64% of the time, 5 about 34%, 6 about 2%; the other five average about 2.7 (Chapter 2, section 2.2, OQ-19). Built soldiers: 4, 3, 3, 3, 3, 2 or 4, 4, 3, 3, 2, 2. Gear: ODM Gear 2 at Funding 3 to 5 (3 at Funding 6), horse 1 to 3, Blade Set, kits, and firearms 1 to 3 (`data/gear/standard-issue.yaml`, `data/gear/items.yaml`). The reference Rookie dodges with Agility 3 + ODM Gear 2 + Stress 1 = 6 dice, and strikes with Strength 4 + Talent 1 + Blade Set 1 + Stress 1 = 7 dice. A soldier off their best attribute with no gear and low Stress rolls 2 to 4 dice. With a dice Talent, Help, and gear, a soldier on their key attribute reaches 9 to 12.

So the working range is **pools of 2 to 12, mostly 4 to 8**. That is exactly where A and B diverge most.

### 1.3 Every existing need and every use of extra successes

| Roll | Needs | Source | What successes beyond the need do |
|---|---|---|---|
| Nape strike | the Titan's Nape Depth (Small 3, Medium 4, Large 4, Sprinting Abnormal 3), in one roll | `action-catalog.yaml` `nape-strike`; `data/titans/*.yaml` | nothing (Relentless: a strike short with at least 1 success gives 1 Opening) |
| Body Part strike | 1; successes add up toward the part's Toughness (1 to 3) | `titan-harm.yaml` | each success counts toward Toughness (Wrist Cut adds 1 against an arm holding a comrade) |
| Break Attention | 1 for the Attention holder, 2 for anyone else, 2 against a Titan holding a Grabbed soldier; +1 for a Feint; +1 per decoy in a row | `attention.yaml` `needs_rule` | each success beyond the whole need creates 1 Opening |
| Read | 1 | `read.yaml` | each success picks one fact, or pays toward Call It |
| Call It | 2 of the Read's successes (Sharp Call: 1) | `read.yaml` `call_it` | none |
| Heave | 1 | `titan-harm.yaml` `falling_titan` | each success adds 1 to the heave count toward the Heave rating |
| Fly for a Position step | 1 (Sparse In Reach to Blind Spot; Urban Distant to Blind Spot) | Chapter 5, section 5.2 | none |
| Leap Clear | 1 | `titan-harm.yaml` | none |
| Break Free, Pry Loose | 2, with a 2-die penalty once lifted; 2 while Held in a Skirmish | `grab.yaml` `escapes`; Chapter 7, section 7.4 | none |
| Dodge, Block | none of its own; each success cancels one attack success | Chapter 1, section 1.9 | every success cancels; one dodge cancels against every card of that Titan this round |
| Titan attack (Titan Dice, 5 or 6) | lands on 1 or more Net Successes | ADR-0019 | +1 to the Critical Injury roll per Net Success beyond the first (not on a Grab, knock loose, or Stress gain) |
| Fight, Shoot | 1 Net Success after the Foe's Guard | `skirmish.yaml` | +1 damage per Net Success beyond the first |
| Foe attack | lands on 1 or more Net Successes | `skirmish.yaml` | +1 damage per Net Success beyond the first |
| Treat Injury | 1 | `treat-injury.yaml` | Revive restores 1 Health lost per success; Triage triggers at 2 or more |
| Rally | 1 | `stress-responses.yaml` `rally` | clears one lasting Stress Response or pending Fear result per success |
| Field Repair | 1 | `field-repair.yaml` | none |
| Death Roll | 1 | `death-rolls.yaml` | 2 or more successes slows the time limit |
| Leg roll, camp roll, Straggler's Endure | 1 | `legs.yaml`, `hazards.yaml` | none |
| Size Up (Skirmish, quartermaster) | 1 | `skirmish.yaml`, `requisition.yaml` | none |
| Sneak for the Ambush | the Foe group's Watch (Bandit 1, Trooper 2, Sentry 2) | `skirmish.yaml` | none |
| Parley in a Skirmish | Grit + 1, -1 per Foe out, never below 1, + the ask (Surrender +1) | `skirmish.yaml` `parley` | none |
| Parley outside a Skirmish | Grit + the ask | `skirmish.yaml` | none |
| Requisition | Scarcity (Standard 1, Limited 2, Rare 3) + the ledger | `requisition.yaml` | "Successes beyond the needs do nothing" |
| Graduation Exam | Trials 1 and 2 pay Merit at 2; Trial 3 at 3 | `graduation-exam.yaml` | Merit tier |
| Infirmary roll | 1 on 4 base dice (not an attribute roll) | `downtime.yaml` | none |

Two readings of this table matter for the decision:

1. **Most closed needs above 1 are quantities in the fiction**: Nape Depth, Toughness, Grit, Watch, Scarcity, the ledger, the Titan's own successes. A few are circumstance written as a need: Break Attention's "anyone else 2" and the Feint's +1, Break Free's 2, the Exam thresholds. All of them were tuned by the simulator or by the Exam parity model.
2. **Extra successes are spent in eight places** (Openings, facts, Call It, Toughness, heave count, Revive Health, Rally clears, damage and Critical Injury riders, the Death Roll's slowing). Any model that raises the need consumes exactly these.

### 1.4 Talents that the choice touches (`data/character/talents.yaml`)

- **33 dice Talents**, each adding its level (up to 3) to the entries it names, most with a condition. Under B they cancel difficulty one for one and stay useful at every difficulty. Under A they never cancel a step.
- **Rule Talents that change a need**: Close Pass (a Feint adds nothing to the need), Sharp Call (Call It needs one fewer), Friends in the Infirmary (a medical Requisition needs one fewer, minimum 1), Break Their Nerve (acts after a Size Up and states that a Parley's need does not change). These are worth far more under A, where one need is worth 2.6 to 6.7 dice (section 2.3).
- **Rule Talents that add or read successes**: Wrist Cut (+1 success), Relentless (a short Nape strike still gives an Opening), Triage (reads 2 or more successes).
- **Rule Talents that add a Push**: Sure Hands (Treat Injury) and Stay With the Column (the Straggler's Endure). A second Push is worth much more when the need is 2 or 3.
- Guardrail already recorded: no Talent adds dice to Leap Clear, and none changes Attack Dice, a Titan's roll, or the net success rider (decision batch 8).

---

## 2. Exact odds

### 2.1 P(at least N sixes), no Push

| Pool | Needs 1 | Needs 2 | Needs 3 | Mean sixes |
|---|---|---|---|---|
| 1 | 16.7 | 0.0 | 0.0 | 0.17 |
| 2 | 30.6 | 2.8 | 0.0 | 0.33 |
| 3 | 42.1 | 7.4 | 0.5 | 0.50 |
| 4 | 51.8 | 13.2 | 1.6 | 0.67 |
| 5 | 59.8 | 19.6 | 3.5 | 0.83 |
| 6 | 66.5 | 26.3 | 6.2 | 1.00 |
| 7 | 72.1 | 33.0 | 9.6 | 1.17 |
| 8 | 76.7 | 39.5 | 13.5 | 1.33 |
| 9 | 80.6 | 45.7 | 17.8 | 1.50 |
| 10 | 83.8 | 51.5 | 22.5 | 1.67 |
| 11 | 86.5 | 56.9 | 27.3 | 1.83 |
| 12 | 88.8 | 61.9 | 32.3 | 2.00 |

The average roll in WoF's working range produces fewer than 1.5 sixes. Needs 2 asks for more than the average pool of 9 or fewer dice produces.

### 2.2 P(at least 1 six) after a dice modifier, no Push

The floor is 1 die, as in Chapter 1 today, Alien, and Coriolis. Cells marked * sit on the floor; with no floor they would be 0.

| Pool | -3 | -2 | -1 | 0 | +1 | +2 | +3 |
|---|---|---|---|---|---|---|---|
| 1 | 16.7* | 16.7* | 16.7* | 16.7 | 30.6 | 42.1 | 51.8 |
| 2 | 16.7* | 16.7* | 16.7 | 30.6 | 42.1 | 51.8 | 59.8 |
| 3 | 16.7* | 16.7 | 30.6 | 42.1 | 51.8 | 59.8 | 66.5 |
| 4 | 16.7 | 30.6 | 42.1 | 51.8 | 59.8 | 66.5 | 72.1 |
| 5 | 30.6 | 42.1 | 51.8 | 59.8 | 66.5 | 72.1 | 76.7 |
| 6 | 42.1 | 51.8 | 59.8 | 66.5 | 72.1 | 76.7 | 80.6 |
| 7 | 51.8 | 59.8 | 66.5 | 72.1 | 76.7 | 80.6 | 83.8 |
| 8 | 59.8 | 66.5 | 72.1 | 76.7 | 80.6 | 83.8 | 86.5 |
| 9 | 66.5 | 72.1 | 76.7 | 80.6 | 83.8 | 86.5 | 88.8 |
| 10 | 72.1 | 76.7 | 80.6 | 83.8 | 86.5 | 88.8 | 90.7 |
| 11 | 76.7 | 80.6 | 83.8 | 86.5 | 88.8 | 90.7 | 92.2 |
| 12 | 80.6 | 83.8 | 86.5 | 88.8 | 90.7 | 92.2 | 93.5 |

A useful property for calibration: above the floor, **each die removed multiplies the chance of failing by 6/5, whatever the pool**. "Hard" means "20% more likely to fail than Standard" at any pool, and "Formidable" 44% more likely.

### 2.3 Where A and B meet, and where they do not

A need of 2 at pool *n* has the same odds as a needs-1 roll with *k* dice removed, where k = 1 + log(( n + 5 ) / 6) / log(6/5):

| Pool | Needs 2 | Dice modifier with the same odds | Needs 3 | Nearest whole modifier |
|---|---|---|---|---|
| 3 | 7.4 | -2.6 (below the floor) | 0.5 | beyond the floor |
| 4 | 13.2 | -3.2 | 1.6 | beyond the floor |
| 5 | 19.6 | -3.8 | 3.5 | beyond the floor |
| 6 | 26.3 | -4.3 | 6.2 | beyond the floor |
| 8 | 39.5 | -5.2 | 13.5 | -7 (16.7) |
| 10 | 51.5 | -6.0 | 22.5 | -9 (16.7) |
| 12 | 61.9 | -6.7 | 32.3 | -10 (30.6) |

- **There is no pool in WoF's range where "needs 2" equals -1 or -2 dice.** The two curves cross only at a pool of about 2.2 dice. At every real pool, needs 2 is harsher than -2 dice, and the gap widens as the pool grows: needs 2 costs about 3 dice at pool 4 and about 7 at pool 12.
- **The size of an A step depends on the pool; the size of a B step does not** (in the failure-ratio sense above). A GM who says "needs 2" is setting a different difficulty for every soldier at the table without knowing it.
- **With the floor, B can never go below 16.7% unPushed (1 die); A reaches 0.** Needs 2 with 1 die is impossible; needs 3 with 2 dice is impossible.
- **A and B coincide only in the trivial case**: needs 1 with no modifier. They also coincide in *mechanism* for the Reaction: a Titan's successes are a need the dodge must match, which is A driven by a rolled quantity, and a dice penalty on the dodge is B. Both already exist side by side.

### 2.4 The marginal value of one more die (percentage points, no Push)

| Pool | Needs 1 | Needs 2 | Needs 3 |
|---|---|---|---|
| 1 to 2 | +13.9 | +2.8 | +0.0 |
| 2 to 3 | +11.6 | +4.6 | +0.5 |
| 3 to 4 | +9.6 | +5.8 | +1.2 |
| 4 to 5 | +8.0 | +6.4 | +1.9 |
| 5 to 6 | +6.7 | +6.7 | +2.7 |
| 6 to 7 | +5.6 | +6.7 | +3.3 |
| 7 to 8 | +4.7 | +6.5 | +3.9 |
| 8 to 9 | +3.9 | +6.2 | +4.3 |
| 10 to 11 | +2.7 | +5.4 | +4.8 |

A die (a Help, a Talent level, a Gear Die) is worth *more* points at needs 2 than at needs 1 once the pool passes 5, but it buys those points from a far lower base, never cancels the need, and at small pools under A it is worth almost nothing. "A dilutes dice" is true for small pools and false in raw points for large pools; what A always removes is the one-for-one legibility of "Hard, so I bring a helper".

### 2.5 WoF pools with one Push when short

Push only when short of the need, uncovered. "Success" is before Stress Response effects. "Stress Die 1" is the chance a Stress Die shows 1 on the first roll or after the Push, which is a Stress Response. "Extra" is the mean successes beyond the need, given success.

| Build (base, gear, stress) | Difficulty | No Push | With Push | Pushes | Stress Die 1 | Extra |
|---|---|---|---|---|---|---|
| Rookie dodge (3, 2, 1) | needs 1, Standard | 66.5 | 82.5 | 26.8 | 24.9 | 0.48 |
| | needs 1, -1 die | 59.8 | 76.5 | 32.2 | 26.5 | 0.37 |
| | needs 1, -2 dice | 51.8 | 68.0 | 38.6 | 28.5 | 0.26 |
| | needs 1, -3 dice (floor) | 51.8 | 68.0 | 38.6 | 28.5 | 0.26 |
| | needs 2 | 26.3 | 49.8 | 60.3 | 34.2 | 0.28 |
| | needs 3 | 6.2 | 20.7 | 77.7 | 38.5 | 0.19 |
| | needs 1, +1 die | 72.1 | 86.9 | 22.3 | 23.5 | 0.60 |
| Rookie strike (5, 1, 1) | needs 1, Standard | 72.1 | 88.2 | 22.3 | 23.5 | 0.62 |
| | needs 1, -1 die | 66.5 | 84.3 | 26.8 | 24.9 | 0.50 |
| | needs 1, -2 dice | 59.8 | 79.0 | 32.2 | 26.5 | 0.39 |
| | needs 1, -3 dice | 51.8 | 71.7 | 38.6 | 28.5 | 0.29 |
| | needs 2 | 33.0 | 62.2 | 54.7 | 32.6 | 0.41 |
| | needs 3 | 9.6 | 32.9 | 74.8 | 37.8 | 0.31 |
| Off attribute 3, no gear (3, 0, 1) | needs 1, Standard | 51.8 | 74.9 | 38.6 | 28.5 | 0.32 |
| | needs 1, -1 die | 42.1 | 66.1 | 46.3 | 30.8 | 0.22 |
| | needs 1, -2 dice (floor) | 30.6 | 54.0 | 55.6 | 33.6 | 0.13 |
| | needs 2 | 13.2 | 37.7 | 71.4 | 37.1 | 0.21 |
| | needs 3 | 1.6 | 11.7 | 81.8 | 39.5 | 0.14 |
| Off attribute 2, Stress 0 (2, 0, 0) | needs 1, Standard | 30.6 | 59.8 | 69.4 | 11.6 | 0.14 |
| | needs 1, -1 die (floor) | 16.7 | 42.1 | 83.3 | 13.9 | 0.05 |
| | needs 2 | 2.8 | 16.4 | 97.2 | 16.2 | 0.07 |
| | needs 3 | 0.0 | 1.6 | 100.0 | 16.7 | 0.00 |
| Key 4 + Talent 2, gear 2, Stress 2 (6, 2, 2) | needs 1, Standard | 83.8 | 92.2 | 10.3 | 34.9 | 0.98 |
| | needs 1, -2 dice | 76.7 | 87.5 | 14.9 | 36.8 | 0.72 |
| | needs 1, -3 dice | 72.1 | 84.0 | 17.9 | 38.1 | 0.60 |
| | needs 2 | 51.5 | 73.1 | 32.0 | 43.5 | 0.64 |
| | needs 3 | 22.5 | 48.3 | 52.5 | 51.0 | 0.49 |
| Key 4 + Talent 1 + 3 Help, gear 2, Stress 1 (8, 2, 1) | needs 1, Standard | 86.5 | 95.6 | 10.8 | 20.0 | 1.11 |
| | needs 1, -3 dice | 76.7 | 90.2 | 18.6 | 22.4 | 0.72 |
| | needs 2 | 56.9 | 82.2 | 35.0 | 27.0 | 0.74 |
| | needs 3 | 27.3 | 60.4 | 59.8 | 33.8 | 0.57 |

Readings:

- **The Push partly flattens A.** For the Rookie dodge, needs 2 is 26.3% unPushed and 49.8% Pushed, but it makes the soldier Push 60% of the time against 27% at Standard, and raises the Stress Response chance from 25% to 34%. Formidable (-2 dice) costs 14.5 points of success, 12 points of Push rate, and 3.6 points of Stress Response chance. **A as the GM's everyday tool would roughly double the Push rate and so the Stress economy that ADR-0004 and the gas target (Chapter 4, section 4.3, Pushes on 27% of rounds at needs 1 and 60% at needs 2) are tuned on.**
- **The floor saturates B at small pools.** At a 3-base-die pool, -2 and -3 are the same roll. The ladder loses resolution exactly where soldiers are weakest, which is the kind thing to lose.
- **Extra successes survive B far better.** At the (8, 2, 1) build, -3 dice still leaves 0.72 extra successes for Openings, facts, or damage. Needs 3 at the same build succeeds only 60% of the time and leaves 0.57.

### 2.6 WoF's existing closed needs, one Push when short

| Roll | Pool (base, gear, stress) | Needs | No Push | With Push | Pushes | Stress Die 1 |
|---|---|---|---|---|---|---|
| Requisition, Standard (Empathy 3, 1 Help, Stress 1) | 4, 0, 1 | 1 | 59.8 | 81.2 | 32.2 | 26.5 |
| Requisition, Limited | 4, 0, 1 | 2 | 19.6 | 48.3 | 65.9 | 35.7 |
| Requisition, Rare, or Limited with ledger 1 | 4, 0, 1 | 3 | 3.5 | 19.5 | 80.1 | 39.1 |
| Parley vs Bandits, Grit 1 + 1 (Empathy 3, 2 Help, Stress 1) | 5, 0, 1 | 2 | 26.3 | 57.4 | 60.3 | 34.2 |
| Parley vs Military Police Troopers, Grit 4 + 1 | 5, 0, 1 | 5 | 0.1 | 2.0 | 83.3 | 39.8 |
| Sneak vs Watch 1 (Agility 3, Stress 1) | 3, 0, 1 | 1 | 51.8 | 74.9 | 38.6 | 28.5 |
| Sneak vs Watch 2 | 3, 0, 1 | 2 | 13.2 | 37.7 | 71.4 | 37.1 |
| Break Free (Strength 4 + Grip Breaker 1, Blade Set 1, Stress 1) | 5, 1, 1 | 2 | 33.0 | 62.2 | 54.7 | 32.6 |
| Break Free once lifted (2-die penalty) | 3, 1, 1 | 2 | 19.6 | 43.9 | 65.9 | 35.7 |
| Nape strike vs Depth 4 (Strength 4 + Clean Cut 1, Blade Set 1, Stress 1) | 5, 1, 1 | 4 | 1.8 | 12.5 | 81.7 | 39.5 |
| Nape strike vs Depth 4, 2 Openings | 7, 1, 1 | 4 | 4.8 | 25.4 | 79.0 | 38.8 |
| Nape strike vs Depth 4, grounded + 2 Openings (cap 4) | 9, 1, 1 | 4 | 9.6 | 39.5 | 74.9 | 37.8 |

These are working as designed where the need is a quantity the Squad must build toward (the Nape strike is a teamwork roll by ADR-0010). Two findings for the owner, outside the scope of this decision:

- **Parley against Military Police Troopers is effectively closed**: 2.0% with a Push and two helpers. If that is the intent (the MPs do not back down), it should be said; if not, it is the A cliff at work.
- **Sneak at Watch 2 is 37.7% Pushed** for an Agility 3 soldier who cannot be Helped. The need of 2 costs about as much as 4 dice would.

### 2.7 Zero-pool readings

A 3-die Hard penalty on a base of 2, no gear, Stress 1, one Push when short:

| Reading | -1 | -2 | -3 |
|---|---|---|---|
| Floor at 1 base die (Chapter 1 today, Alien, Coriolis) | 54.0 | 54.0 | 54.0 |
| Floor at 1, and each die the penalty cannot remove adds 1 to the need | 54.0 | 14.5 | 1.4 |
| No floor: base dice can reach 0, Gear and Stress Dice still roll | 54.0 | 37.0 | 37.0 |

The overflow reading turns B back into A at exactly the soldiers least able to bear it. The no-floor reading makes Stress Dice the only hope, so a calm soldier (Stress 0) with no gear cannot roll at all, and a frightened one can. That is on theme but it rewards Stress in the one case a soldier did nothing to earn it.

---

## 3. The reference games

### 3.1 Alien RPG Evolved Edition (core)

- **Pool and success** (p.42): attribute + skill in base dice, "modified for difficulty, gear, and help" in the flowchart, plus Stress Dice; one six succeeds.
- **Modifiers** (p.43): the rules or the GM add or remove base dice, written +1 die, -2 dice, and so on. **You never go below one base die. Modifiers never touch Stress Dice.** There is no general difficulty ladder and no stated maximum modifier.
- **Extra successes** (p.43): more sixes give a better result; the GM or adventure decides the effect (faster, quieter, showing off, an extra effect). In the example on the same page, a Pushed repair's extra six turns up a clue.
- **Where the numbers live** (situational lists, all in dice):
  - Manipulation's negotiating position (p.47): +1 die for each of five factors in your favor, -1 die for each of five against.
  - Ranged attack modifiers table (p.65): careful aim +2; below minimum range -2 per band; target in partial cover -2; full cover -3; aiming for a weak spot -2; large target +2; small target -2. The largest single modifier in the core is -3.
  - Cover (p.66) applies the same -2 and -3.
  - Stress Responses (p.44) give -2 dice to all rolls on one attribute.
  - Disease virulence (p.76) is a negative modifier to the Stamina roll: difficulty as dice for a quantity in the fiction.
- **Combat** (p.62, p.64 to 66): a hit deals base damage plus 1 per six beyond the first. Defend and dodge turn the attack into an opposed roll in which each defender six removes one attacker six. Extra sixes may instead conserve ammo (p.67).
- **Opposed rolls** (p.44): you need more sixes than the opponent; either side may Push, the active side first. An open roll's tie has no winner. The example rolls a mainframe's skill of 7 as the opposing pool: a quantity in the fiction becomes dice, not a target number.
- **More than one success required**: nowhere in the core as a flat target. Every "needs more" case is an opposed roll.

### 3.2 Coriolis: The Great Dark (core)

- **Success** (p.47): at least one six; more than one six means you perform exceptionally well.
- **Difficulty** (p.49): normally the GM does not judge difficulty, because you only roll in challenging situations. When outside factors help or hinder, the GM adds or removes base dice. **You never go below one base die. Gear Dice are never modified by difficulty.** A seven-step table: Effortless +3, Routine +2, Easy +1, Normal 0, Demanding -1, Hard -2, Insane -3. That table is the largest stated modifier range.
- **Success chances** (p.48): the book prints the odds for 1 to 10 dice, with and without a Push, so players can judge a modifier's cost.
- **Help** (p.49): +1 base die each, at most 3; costs the helper's action in combat.
- **Opposed rolls** (p.49): more sixes than the opponent; both may Push, active party first; open ties have no winner or break randomly.
- **Combat** (p.61 to 64): +1 damage per extra six on a hit; blocking and dodging remove one attacker six per six rolled; a close-combat sneak attack gets +3 base dice and approaching gives -2; prone -2 in close combat and +2 against a prone target; aimed fire +2; small or prone target -2, large +2; range below minimum -2 per band.
- **Talents** (p.50): +1 to +3 base dice by level, the same scale as the difficulty table.
- **Armor** (p.65): roll Gear Dice equal to the armor rating; each six removes one damage; not Pushable.
- **Poison and disease** (p.74): an opposed Strength roll against the toxicity or virulence rating. This is the Coriolis version of "a quantity in the fiction": the quantity is rolled as a pool, not used as a need.
- **More than one success required**: nowhere as a flat need. As in Alien, more is always "beat the other side's sixes".

### 3.3 Other Year Zero Engine titles (from general knowledge, unverified, check before citing)

- **Mutant: Year Zero and Forbidden Lands**: modifiers apply to skill dice; if a negative modifier takes skill below zero, you roll that many negative dice, and each six on them cancels a success. Difficulty stays in dice but can reach below zero.
- **Tales from the Loop and Things from the Flood**: most Trouble needs one success, but the GM may set especially hard Trouble at two or three successes; extra successes buy bonus effects. This is the one YZE family that uses A, in a game with no Push-for-Stress economy and no combat math on extra successes.
- **Vaesen**: GM modifiers from about +3 to -3 dice, with Alien's shape.
- **Blade Runner and Twilight 2000 (4th edition)**: step dice (D6 to D12). Difficulty shifts a die one size or grants advantage or disadvantage; no success targets.

Net: the Free League line consistently expresses difficulty as dice, floors the pool at one die (Alien, Coriolis) or lets it go negative (Mutant, Forbidden Lands), and saves "more successes" for opposed rolls, where the other side's dice set it. The only A family is the lightest one.

---

## 4. Feel at the table

**Tactility.** Under B the GM's judgment is physical: "Hard, take a die back". The player watches the pool shrink, and then every six on the table still means something. Under A the pool is untouched and a number hangs over it; the cruel moment is the roll that shows a six and still fails. The owner has already said that seeing the dice makes the danger tactile (`docs/playtest/feedback/round-1/opposed-rolls.md`, owner positions) and that luck spikes are wanted (`OWNER-DECISIONS.md`, Titan attack resolution). B keeps "one six saves you" at every difficulty, because the floor always leaves one base die. A erases luck at small pools: needs 2 with 2 dice is 2.8%, and needs 3 with 3 dice is 0.5%.

**Lucky rolls.** With B, a Desperate roll on a Rookie's worst attribute is still about 1 in 6 before a Push and about 2 in 5 after one. With A, a hard task for the same soldier is decided before the dice leave the hand.

**Speed.** B adds one subtraction when the pool is built, then the familiar "any six?". A adds nothing to building and a comparison at the end. Both are fast. WoF already asks for comparisons on its closed needs, so neither is new work. B has one cost: the penalty must come off base dice only, so the table must keep die colors apart, which Chapter 1, section 1.2 already requires.

**Calibration by judgment.** A GM needs a rule of thumb that means the same thing for every soldier. Under B it exists: each step makes failure 20% more likely, and each step is cancelled by exactly one Help, Opening, or Talent level. Under A the step's size depends on the pool, so "needs 2" is roughly -3 dice for the Medic and -6 for the Slayer with a Talent and helpers. A GM judging by feel will be consistently too harsh on weak pools and too soft on strong ones.

**What players can do about it.**

| Lever | Under B | Under A |
|---|---|---|
| Help | cancels one step per helper, at a visible price (the helper's action) | adds points, never cancels a step |
| A dice Talent | cancels steps one for one; the sheet answers the GM | adds points; the need stands |
| Gear | Gear Dice are never removed, so good kit is armor against difficulty | adds points |
| Push | lifts about 15 to 25 points at a modest rise in Stress Response chance | lifts more points but is needed far more often, driving Stress |
| Bonus Dice cap of 4 | penalties come after the cap, so difficulty never shrinks what teamwork can add | unchanged |
| Rule Talents that lower a need | unchanged (they act on quantities) | become the strongest Talents in the list |

---

## 5. Systemic interactions

1. **Zero and negative pools.** Chapter 1's floor (1 base die, penalties never remove Gear or Stress Dice) already matches Alien and Coriolis. Keep it. Overflow into needs (section 2.7) and negative dice (Mutant) both add a rule to protect the weakest rolls from luck, which is the opposite of what the owner wants.
2. **The Bonus Dice cap.** Today's order (cap first, then penalties) means a penalty reduces the pool, not the cap. A soldier rolling Hard with three helpers still adds 3 Bonus Dice and then loses 1. Keep that order. A positive step (Easy) should be a Bonus Dice source under the cap, so the GM's generosity cannot stack past teamwork's ceiling (ADR-0006).
3. **Push economy and the Stress spiral.** Section 2.5: A roughly doubles the Push rate of a Rookie dodge (27% to 60%) and adds 9 points of Stress Response chance. B's hardest step adds 12 points of Push rate and 3.6 of Stress Response chance. Everything tuned on the Push rate (gas medians, Jam and wear, Stress carried between Engagements) is far less disturbed by B.
4. **Talents and gear that add dice.** Section 2.4 and the table in section 4: B keeps them valuable everywhere and legible as "cancels a step". A leaves them valuable in raw points at large pools but makes them unable to answer the GM.
5. **Extra successes.** Eight rules spend them (section 1.3). A consumes them before those rules see them, which silently weakens Break Attention's Openings, the Read's facts, Revive, Rally, and the damage and Critical Injury riders. B leaves the success count honest.
6. **Existing closed needs.** Keep them. They are quantities (Nape Depth, Toughness, Grit, Watch, Scarcity, the ledger) or tuned numbers the simulator measured. Converting them to dice is impossible at small pools anyway: the Rookie's Break Attention at needs 2 (49.8% Pushed) cannot be reproduced by any dice penalty, because the floor stops B at 68.0%. A difficulty step layered on a closed need should change dice, never the need, so Nape Depth 4 at Hard is "4 successes from one fewer die", which the Squad answers with Openings.
7. **Titan attacks and the Reaction (ADR-0019).** The hybrid keeps one language across human tasks and Titan attacks. **A quantity in the world sets how many successes you need** (the Titan's successes, Nape Depth, Grit). **Circumstances set how many dice you roll** (Call It +2, a grounded Titan +2, an injury's penalty, the GM's difficulty). Titan Dice and a Foe's dice take no difficulty: they are rolled in the open and never adjusted (ADR-0003, item 8; ADR-0019), so the monster's roll stays honest and the GM's judgment only ever touches the soldier's pool.
8. **Opposed and group rolls.** WoF has no opposed roll outside Attack and Reaction. Difficulty applies to the soldier's side only: the attacker's pool in a Fight or Shoot (darkness, range), the Reaction's pool against a Foe (footing, smoke). Group rolls (the Leg roll, the camp roll, Requisition) are one roller with Help, so one step applies to that roller's pool and each helper cancels a step.
9. **Help.** Unchanged. Under B it becomes the natural answer to difficulty, which serves ADR-0010's teamwork aim.
10. **The simulator's measured targets.** Every ADR-0014 figure assumes no GM step. If the GM may set difficulty inside a Titan Engagement, the targets hold only at Standard, and a GM who calls every rooftop fight Hard moves them. That needs either a scope rule or a sensitivity row (section 7).

---

## 6. Options

| Option | How it works | For | Against |
|---|---|---|---|
| **1. Pure B** (Alien, Coriolis) | GM adds or removes base dice on a ladder; every existing need above 1 is converted to dice | one language; luck always possible; Talents cancel steps | cannot reproduce tuned needs at small pools (floor); throws away quantities the fiction owns (Nape Depth, Grit, Scarcity); re-tunes the whole Titan fight |
| **2. Pure A** | GM sets needs 1, 2, or 3; existing needs stay | no pool arithmetic; one number to announce | step size depends on the pool; erases luck at small pools; eats extra successes; doubles Push rate; dice Talents stop answering the GM; no Free League precedent outside the lightest line |
| **3. Hybrid (recommended)** | B for how hard the circumstances are; A only where the fiction has a quantity (Nape Depth, Toughness, Grit, Watch, Scarcity, the ledger, a Titan's or Foe's successes) | matches what WoF already is (penalties and Bonus Dice are dice; needs are quantities); no tuned number changes; one sentence of language covers Titans and people; keeps luck and extra successes | two concepts to teach (needs and difficulty), though both already exist |
| **4. Hybrid with overflow** | as 3, but a penalty that would take base dice below 1 adds 1 to the need per die it cannot remove | the ladder keeps resolution at small pools | turns into A exactly on the weakest rolls (1.4% at -3 in section 2.7) |
| **5. Negative dice** (Mutant, Forbidden Lands; unverified) | penalties past zero become dice whose sixes cancel successes | keeps a tactile roll at any difficulty | a fourth die color beside base, Gear, and Stress; harsher than the floor; interacts awkwardly with cancellation in the Reaction |
| **6. Ladder width** | Coriolis's seven steps (+3 to -3) against a short ladder (+1 to -3) | seven steps are familiar | +2 and +3 compete with Openings, Call It, and Help, which are WoF's teamwork levers (ADR-0010), and a task that easy should not be rolled at all |
| **7. Effect tiers from extra successes** (Tales from the Loop style) | the roll needs 1; the GM names what a second success adds | gives the GM a "quality" knob without raising the need | WoF's extra successes are already spoken for in eight rules; best kept for rolls with no listed use, and optional |

---

## 7. Recommendation

**Option 3, the hybrid, with a short ladder of Easy +1 to Desperate -3, Easy counting as a Bonus Die under the cap, penalties after the cap, and the existing floor of 1 base die.** The GM never changes a need. Titan Dice and a Foe's dice never take difficulty.

Why: it is what WoF's dice already are. Every circumstantial number in Chapters 1 to 7 is dice, every need above 1 is a quantity or a tuned value, and the GM's new judgment slots in as one more named penalty or Bonus Dice source. It keeps the owner's two stated loves (visible dice and luck spikes), leaves every simulator figure valid at Standard, keeps extra successes flowing to the eight rules that spend them, and gives the GM a step whose size means the same thing for every soldier.

Open decisions for the owner:

1. **Scope in a Titan Engagement.** Recommended: allowed, but Standard by default, because the Anchor Rating, Positions, Openings, a grounded Titan, and Call It already price the fight; the GM sets another step only for something no rule names (smoke, rain-slick roofs, full dark). The alternative is no difficulty inside a Titan Engagement at all, which protects ADR-0014 completely.
2. **The dodge against a Titan.** A Hard dodge raises lethality directly. Recommended: allowed under the same default, with a simulator sensitivity row (the reference Squad with every dodge at Hard) reported beside the targets and not tuned.
3. **Whether Easy exists.** Recommended: yes, one step only, as a Bonus Die.
4. **Parley against Military Police** (section 2.6), unrelated to this choice but exposed by it.

### 7.1 Draft rules text (proposal, not adopted)

> **PROPOSAL, draft quality. Not part of the rules until a decision adopts it.**
>
> ## Difficulty
>
> Most rolls in this book already know how hard they are. A Titan's Nape Depth, a Body Part's Toughness, a Foe group's Grit or Watch, the Scarcity of what you ask the quartermaster for: each is a number in the world, and it sets how many successes your roll needs. When nothing in the rules prices the moment, the GM does, by setting the roll's **difficulty**.
>
> 1. **When.** Before you declare Bonus Dice, the GM names the roll's difficulty out loud. If the GM says nothing, the roll is Standard.
> 2. **The ladder.**
>
>    | Difficulty | What it does to your pool |
>    |---|---|
>    | Easy | +1 Bonus Die |
>    | Standard | nothing |
>    | Hard | a 1-die penalty |
>    | Formidable | a 2-die penalty |
>    | Desperate | a 3-die penalty |
>
> 3. **One step for the whole situation.** The GM weighs everything about the moment and names one step. Rain, dark, and a snapped strap are one judgment, not three.
> 4. **Easy is a Bonus Die.** It counts toward the cap of 4 like Help or an Opening.
> 5. **Hard and worse are penalties.** They follow the penalty rule in section 1.3: they come after the Bonus Dice cap, remove only base dice, add up with any other penalty you carry, and never take your base dice below 1. Gear Dice and Stress Dice are never removed. However hard the task, you always roll at least one base die, so a six can always save you.
> 6. **Difficulty never changes what a roll needs.** A roll needs 1 success unless its rule names a number, and the GM never raises or lowers that number. A Nape strike against Depth 4 at Hard still needs 4 successes; you just roll one fewer die to find them.
> 7. **Too easy or impossible.** If a task would be easier than Easy, don't roll: it happens. If the GM judges it cannot be done at all, don't roll: it doesn't. Anything possible is at worst Desperate.
> 8. **What difficulty never touches.** A Titan's Attack Dice and a Foe's dice, which are rolled in the open and never adjusted. The Death Roll. Any roll that is not an attribute roll, such as a Gas Roll, the infirmary roll, or a table roll. The Graduation Exam's Trials.
> 9. **In a Titan Engagement,** the Anchor Rating, your Position, Openings, a grounded Titan, and Call It already say how hard the fight is. The GM leaves rolls at Standard unless something no rule names is in play: smoke over a burning district, rain on the rooftops, a fight in full dark.
>
> *Example.* Private Brandt tries to talk a Garrison sergeant into opening a supply shed in the middle of the night. No rule sets a need, so the roll needs 1. The GM calls it Hard: the sergeant is half asleep and under orders. Brandt has Empathy 3 and Stress 1, so she would roll 3 base dice and 1 Stress Die. Private Wendt Helps, adding a Bonus Die, and the penalty takes one away again. She rolls 3 base dice and her Stress Die, and needs one six.

Proposed glossary entries for CONTEXT.md (proposal):

- **Difficulty**: the one step the GM names for a roll, Easy to Desperate, which adds a Bonus Die or sets a dice penalty and never changes what the roll needs. _Avoid_: target number, DC, modifier.
- **Needs**: how many successes a roll must reach, 1 unless its rule names a quantity. _Avoid_: difficulty, threshold.

---

## 8. Impact if the recommendation is adopted

**ADRs**

- **ADR-0003**: its opening ("GM discretion may appear as flavor but never as the rule itself") and item 8 need an amendment: the GM now sets difficulty on a closed ladder, while table rolls, Titan Dice, and Behavior Table choices stay beyond the GM's reach. A new ADR ("The GM sets difficulty in dice, never in needs") should record the choice and its rejected options (pure A, overflow, negative dice, the seven-step ladder).
- **ADR-0006**: no change to the cap; note that Easy is a source under it.
- **ADR-0014**: targets are read at Standard; add sensitivity rows for Hard in a Titan Engagement, reported and not tuned.
- **ADR-0016**: add a Talent guardrail for any future Talent that ignores or lowers a difficulty step, since it is worth 20% of failure per step.
- **ADR-0018, ADR-0019**: no change beyond a sentence confirming Attack Dice and Guard dice take no difficulty.

**Chapters**

- **Chapter 1**: section 1.1, item 3 rewritten (the GM may set difficulty, only by the ladder); section 1.3, step 4 (Easy as a Bonus Dice source) and step 5 (difficulty as a named penalty); section 1.4 unchanged apart from a pointer that difficulty never changes the need; section 1.7 lists Easy; a new section for Difficulty; section 1.10 confirms Titan Dice take none.
- **Chapter 2**: section 2.9 (actions outside the Catalog and rolls called by attribute) names difficulty; section 2.4 excludes the Exam Trials; the Talent design notes gain the guardrail.
- **Chapter 3**: the Death Roll's exclusion; Treat Injury and Rally may take difficulty (field surgery in the rain).
- **Chapter 4**: Field Repair may take difficulty; the Gas Roll does not (not an attribute roll).
- **Chapter 5**: line 72's "never re-rolls or changes a roll" stays for Titans; add the Standard default and its exceptions; the Fly step needs and Break Attention's needs stay.
- **Chapter 6**: the opening "No rulings" paragraph stays for Titan choice; add one sentence separating difficulty from rulings.
- **Chapter 7**: the "Every roll" tables for Expeditions, Downtime, Requisition, and Skirmishes either gain a Difficulty column or rely on the core rule; note that Scarcity, Grit, and Watch are needs and unaffected; decide the Military Police Parley cliff separately.

**YAML**

- `data/core/bonus-dice-sources.yaml`: new `difficulty-easy` row (1 die, any attribute roll except the exclusions, spends nothing).
- `data/core/dice-pool.yaml`: the `penalty` component names difficulty as a source; `roll_exceptions` rows for the Death Roll and the performance roll gain a `difficulty_allowed: false` field; the Exam's Trials and the Titan and Foe dice are excluded in their own files.
- New `data/core/difficulty.yaml` holding the ladder, the one-step rule, the exclusions, and the Titan Engagement default, so the rule stays data (ADR-0003, ADR-0012).
- `data/character/graduation-exam.yaml`, `data/harm/death-rolls.yaml`, `data/skirmish/foes.yaml`, `data/engagement/titan-format.yaml`: exclusion notes.

**Talents**

- No dice Talent changes. No rule Talent changes under the hybrid: Close Pass, Sharp Call, Friends in the Infirmary, and Break Their Nerve act on needs, which difficulty never touches. Their value is unchanged.

**Simulator** (`tools/sim/`)

- No engine change is required: `dice.roll()` already takes `bonus` (capped with `R.bonus_cap`) and `extra_pen` (applied after the cap and floored by `R.min_base_dice`), so Easy is `bonus=1` and Hard to Desperate is `extra_pen=1..3`. `rules.py` would read the new YAML for its guards.
- Every committed figure stays valid, since the default is Standard. Add sensitivity cases: the reference Squad with every soldier roll at Hard, and with every dodge at Hard, reported beside the ADR-0014 targets.

**CONTEXT.md**: add Difficulty and Needs; the Bonus Dice entry's "_Avoid_: modifier" can stay, since difficulty is its own term.

**Site** (ADR-0020): `site/src/lib/dice-rules.ts` (the dice roller; it lets base dice reach 0, so it would need the floor and a difficulty selector), `site/src/lib/core-tables.ts` and `site/src/lib/glossary.ts` (render the new YAML and glossary rows).

**Playtest packet**: `docs/playtest/wings-of-freedom-playtest-packet.html` carries the "No dice by judgment" text once; it needs the Difficulty section and republishing.

**Open Questions**: a new entry for scope in a Titan Engagement and for the dodge against a Titan (section 7, decisions 1 and 2).
