# Claims: Running Expeditions, and Foes and Skirmishes (GM's Guide)

Every rule these two pages state, with the source it came from. `C7` = `docs/rules/07-playtest-rules.md`.
Tables are rendered, not retyped: `site/src/lib/gm-expedition-tables.ts` and `site/src/lib/gm-foe-tables.ts`
build them from the data files, with the GM's wording keyed by each row's id, and a row with no wording
fails the build.

## Running Expeditions (`site/src/content/gm/running-expeditions.mdx`)

### Writing the Brief

1. The GM writes the Mission Brief as Command before the Expedition begins; the route is set once and nothing changes it afterwards. C7 47, 54; `route.yaml` 14-17.
2. The route names the Waypoints in order with kind and Depot mark, the last a gate; each Leg's Distance Band and Formation Post; the Hard Ride days counted from the first; and the Abnormal the Abnormal rows name when it is not the Sprinting Abnormal. C7 49-52; `route.yaml` 18-30.
3. Bounds: 4 to 6 Legs; first and last Near, second and second-to-last Near or Far, every Leg between Near, Far, or Deep; at most one Depot, never the gate; Posts and Hard Ride days Command's, a Hard Ride at most once a day as the day's third Leg; a route outside them is written inside them or rolled. C7 54; `route.yaml` 32-44.
4. The route sets each Leg's Distance Band, Post, and Pace, which the hazard roll reads as written, and no ruling changes them once the Expedition begins. C7 54; `route.yaml` 38-42.
5. Waypoint kinds table, each with the Anchor Rating it sets and its interim D6; the gate sets none and rolls it on the setup table. C7 77-88; `route.yaml` 55-67. Rendered by `waypointKinds()`.
6. A Depot keeps its kind; arriving gives every soldier a full Standard Issue and restocks Squad Supply. C7 90; `route.yaml` 68-71.
7. The gate ends the Expedition at the end of that Leg, with no further Leg and no Night Camp, and Downtime begins. C7 91; `legs.yaml` 24-26.
8. The interim route: D3+3 Legs (D3 read off a D6); Bands by place (first and last Near, second and second-to-last Far, the rest Deep); D6 Waypoint kinds for all but the gate and no Depot; D6 Formation Post per Leg; the Pace rolled during the ride. C7 58-64; `route.yaml` 74-91. Rendered by `interimRouteSteps()` and `formationPostRoll()`.
9. A Hard Ride on the interim route comes up on a 5 or 6. C7 63, 113; `route.yaml` 101. The page reads the numbers from `hard_ride_on`.

### Running the day

10. A day holds two Legs and a Night Camp; Legs are never ridden at night; after each Leg the GM may frame a Waypoint scene. C7 110-113; `legs.yaml` 77-90.
11. A Hard Ride is a third Leg, only after the day's second, only when a Leg is left and Command orders one (a Brief day, or a 5 or 6 on the interim route). A day's first or second Leg is never one. C7 113, 122; `legs.yaml` 131-137.
12. Every Leg ridden counts toward the day's Legs, including one ridden again after a retreat. C7 116; `legs.yaml` 85-89.
13. The Lead and the Helpers are the players' choice; the Leg roll is never tried again. C7 170-174; `legs.yaml` 299-311.
14. Arrival: the Squad always reaches the Waypoint. A success spends 1 ration and takes 1 off the hazard per success beyond the first; a failure spends 2 and adds 1; a Hard Ride doubles the rations. C7 148; `legs.yaml` 218-226.
15. With no soldier who can make the roll (every living soldier Down, or nobody mounted on their own horse on a Hard Ride) the Leg roll fails, with no Help and no Push; the Squad still reaches the Waypoint, the Down ride in the wagon, nothing else changes, and a row that names the Lead does nothing. C7 99, 175; `legs.yaml` 47-62.
16. A fight a row begins takes its Anchor Rating from the kind of the Waypoint the Leg leads to, plus whatever the row names, with the setup table filling the rest; every living soldier on the Expedition takes part, mounted or not as they rode. C7 151; `legs.yaml` 204-212.
17. A retreat from that fight falls back to the Waypoint the Leg started from and rides the Leg again from step 1, with a new Leg roll and a new hazard. C7 151; `legs.yaml` 209-212.
18. Circumstances reach the Leg roll, the camp roll, the Straggler's Endure roll, and every called roll in a Waypoint scene; the hazard and night hazard rolls take none. C7 272, 276; `hazards.yaml` 14-18, 262.
19. A roll a row's own text calls for takes the step in force when the hazard was rolled, Standard unless a step was named before then for a lasting condition of the Leg; none is named after, and none for the danger the row describes. C7 273, 276; `hazards.yaml` 271-274.
20. A fight a row begins takes its Circumstances as any fight does, including a step named for a condition that begins during it. C7 276.
21. Stakes belong to called rolls, which live in Waypoint scenes; the Leg roll, the camp roll, and the hazard rows carry their own costs. C7 35, 160; `legs.yaml` 97-100.

### The Leg Hazard table

22. Roll D6 and add every line; it is a table roll (no pool, no Push, no Help, never tried again). C7 181; `hazards.yaml` 14-18, 254-262.
23. The modifiers: Distance Band (Near +0, Far +1, Deep +2), +1 per Night Camp already made, the Formation Post's amount, the Pace (Steady +0, Hard Ride +1), +1 for a failed Leg roll, -1 per success beyond the first, -2 for the Signal Relay's flare. C7 183-193; `hazards.yaml` 60-66 with `legs.yaml` 124-183, 218-226. Rendered by `legHazardModifiers()`, which reads each Post's and each Pace's own amount.
24. The ten rows and their totals, 1 or less through 10 or more, each with what it does. C7 195-210; `hazards.yaml` 68-147. Rendered by `legHazards()`; the numbers in each sentence (wear, units, Stress, flare and ration spends, starting Positions, Background clocks) are read off the row's own effects.
25. Both tables are rolled in the open, described as they come up, and never softened or swapped; the GM chooses nothing on either, and a row's choice is the players'. C7 35, 164; `hazards.yaml` 20-25.
26. A danger the GM authors belongs in a Waypoint scene, never in place of a hazard roll. C7 164; `hazards.yaml` 23-25.
27. The Straggler: kind rolled on D6 (1 to 4 a Squadmate, 5 or 6 a player character); only living soldiers who are not Down count; with none of that kind use the other; with neither the row reads as a plain Titan attack on the formation. C7 216; `hazards.yaml` 152-165. Rendered by `stragglerVictim()`.
28. The soldier is numbered 1 upward in Squad sheet order and rolled for on D6, rolling again above the count. C7 217; `hazards.yaml` 164-165.
29. The Endure roll needs 1 success, cannot be Helped or Covered, can be Pushed, and is never tried again. C7 218; `hazards.yaml` 263-274.
30. On a failure: a Bite Critical Injury at a rolled Injury Location, which can be lethal, with no Attack Dice, no Reaction, and no Net Success rider; it counts as gained as the row's fight begins, so no separate care window is held and its limit runs as one gained in that fight. C7 219; `hazards.yaml` 166-179. The Injury Type and whether it can be lethal are read from the table by `stragglerInjury()`.
31. Then the fight, victim In Reach and every other soldier at Distant. C7 220; `hazards.yaml` 131.
32. Hunger: short of the spend counts as none; the Squad spends everything it holds and every soldier gains 1 Stress with no roll; a camp that meets hunger gives no Camp Relief. C7 256; `legs.yaml` 234-241.

### Waypoint scenes

33. Framed after a Leg ends at a Waypoint that is not the gate, before the next Leg or the Night Camp. C7 158; `legs.yaml` 93-96.
34. It runs on called rolls with Circumstances and stakes named before the dice; a successful called search adds Squad Supply only as Gear & ODM caps it, and a scene yields Squad Supply to at most two searches. C7 160; `legs.yaml` 97-100.
35. A Skirmish or a Titan Engagement may begin in it by the fiction. C7 161; `legs.yaml` 101-103.
36. Harm a stake inflicts opens the care window held after harm outside a fight, with every soldier on the Expedition in its scope. C7 162; `legs.yaml` 116-119.
37. It rides no Leg: no Leg roll or camp roll, neither table, no ration unless a stake names one, and never in place of a hazard roll. C7 164; `legs.yaml` 120-122.
38. A retreat from a fight begun in a scene: the scene ends, the Squad falls back to the Waypoint that Leg started from and rides it again from step 1, with a new Leg roll and hazard, and the arrival happens again with a Depot's issue. C7 163; `legs.yaml` 105-110.
39. The Leg ridden again takes the day's next slot: second at Steady after the first, third only on an ordered Hard Ride and then as a Hard Ride. With no slot left, the camp is made at the Waypoint that Leg started from, which is then the camp's Waypoint, and the next day's first Leg rides that Leg again at Steady. C7 163; `legs.yaml` 111-115.

### The Night Camp

40. The five steps: camp roll, 1 ration, Camp Relief, night hazard, a day passes. C7 226-233; `legs.yaml` 257-274.
41. The camp roll: one soldier who is not Down, chosen by the players, Survive for 1 success, up to 3 comrades who are not Down Helping and spending nothing, Pushed and Covered, never tried again; with nobody who can make it, it fails with no Help and no Push. C7 228; `legs.yaml` 315-328.
42. Camp Relief is 1 Stress off every soldier on the Expedition when the camp roll succeeded and the camp did not meet hunger. C7 230; `legs.yaml` 262-265.
43. A day passes: a care window with every soldier on the Expedition in its scope with Field Repair rolled in it, the Death Rolls of day limits, the Health lost to damage back, and a day of healing. C7 233; `legs.yaml` 271-274.
44. The Night table: D6 plus the Distance Band of the day's last Leg plus 1 for a failed camp roll, and nothing else; six rows from 3 or less to 8 or more. C7 231, 235-246; `hazards.yaml` 184-250. Rendered by `nightHazards()`.
45. The camp stands at the Waypoint the Squad is at: the one the day's last Leg reached, or, after a Waypoint-scene retreat that left no slot, the one that Leg started from. A fight the Night table begins takes that Waypoint kind's Anchor Rating; a camp at the gate the Expedition left rolls it on the setup table and the Expedition goes on; the Distance Band added is still the day's last ridden Leg's. C7 231; `legs.yaml` 246-256.
46. A retreat at night falls back overnight to the Waypoint the day's last Leg started from; the camp goes on there at its last step with no new camp roll, ration, or night hazard; it still counts as a Night Camp made; falling back rides no Leg; the next day's first Leg rides that Leg again from step 1 with a new Leg roll and hazard and counts toward that day's Legs. C7 232; `legs.yaml` 276-290.
47. A fight the Night table begins that ends any other way leaves the camp where it was; a camp already at the fallback Waypoint breaks off where it is, with the same going on, the night counted once, and a queued Leg ridden as the next day's first at Steady. C7 232; `legs.yaml` 284-290.
48. Titans do not walk at night; only an Abnormal does. C7 231; `hazards.yaml` 182-183.
49. Worked example, the night at Far: camp roll failed after a Push and a Cover, 1 ration spent of 4, no Camp Relief, D6 5 plus Far 1 plus the failed roll 1 is 7, Prowlers, and at Far that is three Bandits with the Ambush and firebrands. C7 776-781. The Skirmish half of the example is on the Foes page.

## Foes and Skirmishes (`site/src/content/gm/foes-and-skirmishes.mdx`)

### Before the first card

50. A Skirmish starts from a rule that names one (the Prowlers row, a Mission Brief), from the table's scene framing, or from the stakes of a failed called roll. C7 470; `skirmish.yaml` 21-25.
51. The start names one Foe kind and may name the number, which side has the Ambush, that it is night, and which soldiers take part; one Foe group per Skirmish; the number is the start's or the kind's group size; a Skirmish at a Night Camp is at night. C7 471; `skirmish.yaml` 26-31.
52. Who takes part: the soldiers the start names, else every living soldier in the Squad on the same Expedition, else every living soldier in the Squad. C7 472; `skirmish.yaml` 32-34.
53. Setting out: Foes labelled 1 upward at full Health with their weapons and loaded firearms; every soldier Apart unless the start says otherwise; settle the Ambush; round 1. C7 473-477; `skirmish.yaml` 35-46.
54. The GM rules whether the Squad can approach unseen at all. If it cannot, no side has the Ambush and no roll is made. C7 493; `foes.yaml` 145-147; `skirmish.yaml` 72-79.
55. Otherwise one soldier taking part who is not Down, chosen by the players, rolls Sneak, needing the group's Watch; no Help, no Cover, Push allowed, never tried again. On a success the Squad has it; on a failure no side has it. C7 493; `skirmish.yaml` 80-82 and its rolls list.
56. A start may give the Ambush to the Foes, as the Prowlers row does. C7 492; `skirmish.yaml` 71.
57. What the Ambush does: not yet acted until a first card has come up; the ambushing side's cards all come first in round 1, keeping their order within a side; 2 Bonus Dice for a soldier's Fight or Shoot against a Foe that has not acted, and 2 more Attack Dice for an ambushing Foe against a soldier who has not; an attack on a target that has not acted cannot be answered, so no Reaction and no Guard and every success is net. C7 494-497; `skirmish.yaml` 83-97; `foes.yaml` 119.

### The Foes

58. Three Foe kinds are the whole list, and the GM adds none. C7 599; `foes.yaml` 153-159.
59. Each kind's Attack Dice, Guard, Health, Grit, Parley value, Watch, group size, and weapons, all rendered from the table with the numbers under bars. C7 588-593; `foes.yaml` 29-75. Rendered by `foeRecords()` through `FoeDossier.astro`.
60. A Bandit rolls D6 for its weapon as the Skirmish begins (1 to 3 a club, 4 to 6 a knife) and carries a firebrand in place of a club at night. C7 590; `foes.yaml` 40-45.
61. Each weapon's Injury Type, damage, and target come from the weapons table: sabre Cut 2 Engaged, knife Cut 1 Engaged, club Crush 1 Engaged, firebrand Burn 1 Engaged, flintlock pistol Pierce 2 either, musket Pierce 4 Apart only, bare hands Crush 1 Engaged. C7 558-569; `skirmish.yaml` 210-318.
62. A Size Up buys the group's Grit and how many more must be out before it breaks, said aloud; everything else is learned by fighting, with Attack Dice and Guard rolled in the open. C7 663; `skirmish.yaml` 391-408.
63. A Foe's weapon damage grows by 1 for each Net Success beyond the first, and a musket ball at 1 Net Success deals 4, which brings a Health 4 Rookie to 0 with a Pierce Critical Injury. C7 548, 563.

### The foe rule

64. On the group's card each Foe still in the Skirmish that has not broken takes one turn in label order, and takes the first step whose test it meets. C7 610, 622; `foes.yaml` 167, 194.
65. Candidates are every soldier taking part who is alive and not Down; the last attacker is whoever most recently rolled Fight or Shoot against this Foe, landed or not; the lowest card is the lowest initiative card this round among the candidates a step names. C7 612-614; `foes.yaml` 169-172.
66. The six steps in order: Held Fights its holder bare-handed; Engaged Fights its last attacker if Engaged with it, else the Engaged candidate with the lowest card; a loaded firearm Shoots its last attacker, else the lowest card; an empty firearm reloads; otherwise it closes in on the lowest card and Fights; otherwise nothing. C7 616-621; `foes.yaml` 173-193. Rendered by `foeRuleSteps()`.
67. A Foe never takes Push, Help, Cover, Grapple, Break Free, Release, Parley, Size Up, or a Reaction, has no Stress, makes no Fear Roll, and has no Stress Response. C7 623; `foes.yaml` 195-196.
68. Guard: rolled in the open as base dice when a soldier's attack roll is final, each success cancelling one, landing on 1 or more Net Successes; rolled against every attack in a round; a Held Foe still rolls it; no Push, Help, Bonus Dice, Stress Dice, or Gear Dice, and it spends nothing. C7 625; `foes.yaml` 110-119.
69. Firearms: loaded at the start, empty after a Shoot, a Reload spends the turn and no shot, and a Foe never runs out. C7 627; `foes.yaml` 105-108.
70. A Foe at 0 Health is out of the Skirmish, dead from Cut, Pierce, or Burn and out cold from Crush, and is never a target again. C7 551.

### Directing a Foe

71. On a Foe's turn, when the fiction gives it a reason, the GM may direct its target or its action in place of the rule's pick, saying the reason aloud before it acts; a reason the table cannot hear is not a reason. C7 605; `foes.yaml` 125-131.
72. A directed Foe takes only a turn the steps can give, with its kind's weapons, never attacks a Down soldier, a Held Foe still acts only as step 1 gives, and it never leaves alone: a GM who wants one to run breaks its group sooner. C7 606; `foes.yaml` 132-137.
73. What stands: Attack Dice and Guard rolled in the open and never adjusted, damage and Net Successes, whether a Foe at 0 Health is dead or out cold, and that a Foe never Pushes, Helps, or Covers. C7 607; `foes.yaml` 148-152.
74. After a successful Size Up the GM states Grit, how many more must fall, and what each Foe will do on the next card, or, for a Foe already meant to be directed, what it will do and why; each Foe does what was stated unless something after the Size Up changes it (a change in what the rule tests, a new reason said aloud, or an action a directed Foe can no longer take), and no reason is held back at the Size Up. C7 663; `skirmish.yaml` 396-406; `foes.yaml` 138-141.

### Grit and breaking

75. Grit is the latest a group breaks: when the number of its Foes out of the Skirmish reaches it. At once every Foe of it not Held becomes Apart and takes no further turn, each leaving at the end of the round; a Held Foe stays Held and leaves at the end of the round its hold ends. C7 634; `skirmish.yaml` 346-357.
76. The GM may break it sooner, or have it surrender, with a reason said aloud as it happens, never later; a surrendering group yields as the Surrender ask gives and the Skirmish ends. C7 635; `skirmish.yaml` 348-353; `foes.yaml` 142-144.
77. A failed Parley made as a threat raises the group's Grit by 1 and its Parley value by 1 for the rest of the Skirmish. C7 636; `skirmish.yaml` 358-362.

### Parley

78. A Parley needs the group's Parley value plus 1, minus 1 for each of its Foes out of the Skirmish, never below 1, plus the ask's number. C7 646; `skirmish.yaml` 370-372. The page's table gives each kind's need at full strength for an ask that adds nothing and for Surrender, worked from `parley` and the asks' own numbers by `parleyNeeds()`.
79. Surrender is the ask that adds 1; the others add nothing. C7 651-657; `skirmish.yaml` 373-378.
80. On a success the group yields, does what the ask says, and the Skirmish ends; the GM answers an Answer ask truthfully from what its Foes know. On a failure nothing happens but a threat's rise. C7 648, 655; `skirmish.yaml` 379-380.
81. With no Skirmish under way, each soldier may make one Parley with a group from the list: its Parley value plus the ask's number, no Help, no Cover, Push allowed, never tried again by that soldier with that group. Talking to anyone else is a called roll. C7 659; `skirmish.yaml` 382-389.

### Running the fight

82. Expectations in words, no figures: the Squad beats a Military Police patrol nearly every time and rarely loses a soldier; one Rookie against one trooper is a little better than even; a Bandit night Ambush costs blood and almost never a life. `foes.yaml` 80-103 (reported figures, stated as words only).
83. The three tests that end a Skirmish belong to the players' page, and the GM never ends one. C7 665-671; `skirmish.yaml` 410-428.
84. Worked example, the Bandits at Far: weapon rolls of 2, 3, and 5; the Foes' card first; Bandit 1 at step 5 closing on the lowest card and rolling 4 Attack Dice plus 2 for the Ambush, unanswered, for 1 plus 1 Burn; Bandit 2 for 1 more; Bandit 3 nothing; Oskar's Fight of Strength 4, Hand-to-Hand 1, Gear Dice 1, Stress 3 landing three 6s against a Guard of 3 that cancels one, for 2 plus 1 Cut and a dead Bandit; the Fear Roll for a first human kill; one out reaching a Grit of 1, the group breaking, and the Skirmish ending. C7 781-788.
