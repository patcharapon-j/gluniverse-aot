# Claims: Skirmishes (`site/src/content/rules/skirmishes.mdx`)

Every rule the page states, with the source it came from. `07` is `docs/rules/07-playtest-rules.md`;
`sk` is `data/skirmish/skirmish.yaml`; `ee` is `data/harm/engagement-end.yaml`. Where the two
disagree the page follows the table, and the disagreement is logged in `rewrite-issues.md`.

Tables on the page are rendered, never retyped: `skirmish-ambush`, `skirmish-actions`,
`skirmish-weapons`, `parley-asks`, and `skirmish-rolls` are built in `site/src/lib/skirmish-tables.ts`
from `sk`, with the player wording keyed by each row's id. A row with no wording fails the build.

## Section 1, Starting a Skirmish

1. A Skirmish is soldiers against people; no Titan takes part and Titan Engagements are unchanged. People are blocked, are talked down, and deal damage, never a Critical Injury directly. 07 466; sk 16-18.
2. A rule that names a Skirmish starts one (the Night table's prowlers row, a Mission Brief), and so does scene framing that sets the Squad against people. A Waypoint scene or a failed called roll's stakes may begin one by the fiction. 07 470; sk 22-25.
3. The start names one Foe kind and may name how many, which side has the Ambush, that it is night, and which soldiers take part. One Foe group per Skirmish. The number is the start's, or else the kind's group size. A Skirmish begun at a Night Camp is at night. 07 471; sk 26-31.
4. Who takes part: the soldiers the start names, otherwise every living soldier in the Squad on the same Expedition, or every living soldier in the Squad with no Expedition under way. 07 472; sk 32-34.
5. Setting out, in order: the Foe group set out numbered 1 upward, each at full Health, with its weapons and its firearms loaded; every soldier Apart from every Foe unless the start says otherwise; the Ambush settled; round 1 begins. Rendered as Fig. 1 from sk 35-45. 07 473-477.

## Section 2, Engaged and Apart

6. Engaged is within arm's reach of a Foe, Apart is not, and each is held separately for each Foe. 07 482; sk 49-52.
7. A Skirmish has no Position, no Anchor Rating, no ODM move, no Fly roll a rule calls for, and no airborne soldier. The one Fly roll is a called roll the GM names for Fly, and it makes no one airborne. 07 482; sk 53-56.
8. A move closes in with one named Foe, breaks away from every Foe you are Engaged with, or changes nothing. It may include one mount or one dismount. 07 483; sk 57-61.
9. The move of a Held soldier, of a soldier holding a Foe, and of a Down soldier changes nothing. A Foe changes its own range only on its own turn. 07 484-485; sk 62-64.

## Section 3, The Ambush

10. A start may give the Ambush to the Foes. 07 492; sk 71.
11. Otherwise, before round 1, the GM rules whether the Squad can approach unseen. If it cannot, no side has the Ambush. If it can, one soldier taking part who is not Down, chosen by the players, rolls Sneak with the Circumstances the GM names, needing the group's Watch. No Help, no Cover, Push allowed, never tried again. Success gives the Squad the Ambush, failure gives it to nobody. 07 493; sk 72-81, 460-469.
12. A soldier or a Foe has not yet acted until its first card of the Skirmish has come up. 07 494; sk 82.
13. Round 1 runs every card of the Ambush side before every card of the other, order kept within a side; a soldier's Fight or Shoot against a Foe that has not yet acted gains 2 Bonus Dice and a Foe with the Ambush rolls 2 more Attack Dice against a soldier who has not yet acted; an attack by the Ambush side on a target that has not yet acted cannot be answered, so every success counts. Rendered as the `skirmish-ambush` table from sk 83-95. 07 495-497.

## Section 4, Rounds and Turns

14. Cards are dealt each round: one to each soldier taking part, living or Down, and one to the Foe group while any of its Foes is in the Skirmish. Lowest first. No Wings and no swap step. 07 503; sk 100-104.
15. A soldier's card is one turn of one move and one action, in either order. A Squadmate takes its turn on its own card and never Pushes or Covers. 07 504; sk 105-107, 445-447.
16. The Foe group's card: each Foe still in the Skirmish takes one turn, in number order, and never attacks a Down soldier. 07 504, 645; sk 108.
17. End of the round: every Foe of a group that broke leaves, then the ending is checked. 07 506; sk 109-111.
18. A Skirmish turn counts for every rule that counts turns: a turn time limit, a turn spent in advance, and a Drive's turn triggers. 07 507; sk 112-114. Rendered as Fig. 2 with the same five statements guarded against sk `rounds`.

## Section 5, What You Can Do

19. The allowed entries, and only these: Fight, Shoot, Break Free, Reload, Release, Persuade as a Parley, Size Up, Help, Treat Injury, Rally, Lift Comrade, Pass Item, Take Item, Change Canister, Swap Blade Set, Shed Load, Mount or Dismount. No entry used only in a Titan Engagement can be taken. Rendered as the `skirmish-actions` table from sk 117-120. 07 511-520.
20. Fight is Strength against a Foe you are Engaged with, with the Blade Set for Gear Dice or bare-handed or with an object that is not a gear item for none. Declared as a Grapple it takes no Gear Dice. 07 513.
21. Shoot is Agility with a loaded firearm, which gives its Gear Dice, against a Foe the weapon can target; a musket is never fired at an Engaged Foe; the firearm is empty after the roll; a Pushed Gear Die showing 1 wears it. A flare may be Shot at a person for 1 flare of Squad Supply, no Shot, and no Gear Dice. 07 514; sk 268-277.
22. Reload loads one empty firearm and spends 1 Shot of Squad Supply and the action, plus the move for a musket. 07 515; sk 127-129.
23. Break Free while Held needs 2 successes. 07 516; sk 500-508.
24. Treat Injury and Rally are used as in a Titan Engagement with no Position requirement; the patient or the Rallied comrade is any other soldier taking part, or the soldier themselves where Chapter 3 allows; a failure can be tried again on a later turn. 07 518; sk 121-126.
25. Release ends a hold with no roll and spends nothing. Swap Blade Set, Shed Load, and Mount or Dismount work as the gear rules give them. 07 520.
26. Help in a Skirmish: up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart. 07 526.
27. An improvised act: an act that is not an entry taken as written, even when what it would change matches an entry. Before the pool is built the GM names its model entry, one entry of kind action this chapter allows, never Block, Dodge, or an option. The act spends the action, is rolled as the model entry is, takes Circumstances, carries the model entry's restrictions (a Foe's Guard still rolls), and produces only that entry's effect at its size. 07 522; sk 130-143.
28. An object that is not a gear item, thrown at a Foe Engaged or Apart, is a Shoot at 1 damage and Crush with no Gear Dice. 07 522; sk 138-140, 233-245.
29. A called roll here is for an act no allowed entry of kind action could model that changes nothing the Skirmish tracks: no Foe's Health, Guard, Grit, Parley value, Attack Dice, or Watch, no Engaged or Apart, no card. It spends the action on the soldier's turn, never stands in for a Reaction, takes Skirmish Help, stakes a low or high fall and never an extreme one, touches only the situation outside what the Skirmish tracks for a time or position cost, never gives an effect an entry has, and can be tried again on a later turn. 07 524; sk 144-154.
30. Fly on a called roll: the ODM Gear's Gear Dice, a Pushed Gear Die showing 1 wears the gear, no airborne, no Gas Roll, no one dropped on a Jam, no Engaged or Apart. Jammed ODM Gear cannot be named for Fly, and the GM names Agility alone. 07 524; sk 151-154.

## Section 6, Attacks and Reactions

31. The attacker rolls: a soldier's Fight or Shoot with a full pool, Pushable before any cancelling roll; a Foe's Attack Dice as base dice succeeding on 6, never Pushed, with nothing else. The successes are the Severity, announced. 07 533; sk 159-167.
32. The cancelling roll: a soldier's Reaction, or the Foe's Guard, rolled in the open as base dice, never Pushed, spending nothing, against every attack on it. 07 534; sk 163-166.
33. Each success of the cancelling roll cancels one of the attack's. The attack lands on 1 or more Net Successes and does nothing on 0. Against a target who makes no cancelling roll every success is net. 07 535; sk 168-171. Rendered as Fig. 3, with the 1 and the per-success 1 read from sk.
34. Block is Strength with a Blade Set if the soldier has one and otherwise no Gear Dice, and answers a Fight attack only. Dodge is Agility with ODM Gear, or the horse while mounted, and answers a Fight attack or a shot. 07 540; sk 173-176.
35. A Reaction spends a turn. At most one Reaction against each Foe per round; its successes cancel against the attack answered and, separately, against each later attack that Foe makes that round, never used up. 07 541; sk 177-180.
36. The reacting side Pushes last, after the Foe's roll is known. 07 542; sk 494.
37. A Reaction takes the Circumstances step in force when the Foe group's card came up, and no step is named or changed for it after. 07 543; sk 496-498.
38. A Held soldier cannot Dodge; no Reaction answers an attack the Ambush leaves unanswered; a state or result that forbids Reactions forbids them here. 07 544; sk 182-185.

## Section 7, Damage

39. A landed attack deals its weapon's damage plus 1 for each Net Success beyond the first, with the weapon's Injury Type. A Grapple deals none. 07 548; sk 189-205.
40. On a soldier: damage as Chapter 3 gives it, at a rolled Injury Location, marking Health lost; at 0 current Health the soldier is Down and gains a Critical Injury of the weapon's Injury Type with its name and rider. A person never inflicts a Critical Injury directly. 07 549; sk 194-198.
41. A lethal Cut bleeds: its Death Roll comes at the end of each of the soldier's turns until treated. A Pierce from the 7 row up holds the ball: Treat Injury takes a 1-die penalty and it does not heal until treated. 07 550.
42. On a Foe: damage lowers Health, never below 0; no Critical Injuries, no Stress, no Down state. At 0 Health it is out of the Skirmish, dead from Cut, Pierce, or Burn and out cold from Crush, and it takes no further part and is never a target again. 07 551; sk 199-204. The Injury Type lists on the page are read from sk, not typed.

## Section 8, Weapons

43. The nine weapon rows, each with its attack, damage, Injury Type, target, gear item for Gear Dice, what it spends, who carries it, and its note. Rendered as the `skirmish-weapons` table from sk 210-317. 07 557-569.
44. A soldier's own weapons are a Blade Set, bare hands, a firearm, and a flare; a sabre, knife, club, or firebrand in a soldier's hands is an object that is not a gear item. Firearms have no use in a Titan Engagement. 07 571.

## Section 9, The Grapple

45. A Grapple is a Fight roll against a Foe you are Engaged with, declared before rolling, with no Gear Dice. Talents that name Fight apply. If it lands the Foe is Held and it deals no damage. 07 575; sk 320-325.
46. A Held Foe cannot move, attacks only its holder bare-handed, and still rolls Guard. 07 576; sk 327.
47. The holder cannot move, Shoot, or Reload, and takes no action but a bare-handed Fight against the Held Foe or Help. Release is available at any point of their turn and spends nothing. 07 577; sk 328-330, 339-342.
48. A hold ends when the holder takes Release, becomes Down, or dies, or when the Foe is out of the Skirmish. A Foe never Breaks Free and never releases. 07 578; sk 332-334.
49. A soldier Held by a person cannot move or Dodge, attacks only the holder bare-handed, and ends the hold with Break Free. No Foe in play Grapples, so no rule yet makes a soldier Held. 07 579; sk 335-338. Rendered as Fig. 4 from `grappleStates()`.

## Section 10, Parley and Size Up

50. Parley is on the soldier's action, at most once per Skirmish for each soldier, as Persuade on Empathy or, as a threat, on Strength in its place, still Persuade, so a Talent that names Persuade adds its dice. 07 644-645; sk 364-367.
51. It needs the group's Parley value plus 1, minus 1 for each of its Foes out of the Skirmish, never below 1, plus the ask's number. 07 646; sk 368-371.
52. Help from up to 3 comrades taking part who are not Down, each spending their action; Push and Cover allowed. 07 647; sk 515-516.
53. Success: the group yields, does what the ask says, and the Skirmish ends. Failure: nothing, except that a failed threat raises the group's Grit by 1 and its Parley value by 1 for the rest of the Skirmish. 07 648; sk 377-378, 358-361.
54. The four asks and what each adds and gives. Rendered as the `parley-asks` table from sk 372-376. 07 651-656.
55. Parley with no Skirmish under way: one per soldier with that group, needing the Parley value plus the ask's number, no Help, no Cover, Push allowed, never tried again by that soldier with that group. Talking with anyone who is not a Foe group is a called roll. 07 659; sk 380-388.
56. Size Up is on the soldier's action, once per Foe group per Skirmish for the whole Squad, on Instinct, needing 1 success, no Help, no Cover, Push allowed, never tried again. 07 663; sk 391-393.
57. On a success the GM states the group's Grit, how many more Foes must be out before it breaks, and what each Foe will do on the group's next card, or, for a Foe the GM already means to direct, what it will do and why. 07 663; sk 394-398.
58. Each Foe does what was stated unless something after the Size Up changes it, and the GM never directs a Foe on that card for a reason held back at the Size Up. 07 663; sk 399-405.

## Section 11, Ending a Skirmish

59. Grit is the number of a group's Foes that must be out before it breaks, at the latest. The GM may break it, or have it surrender, sooner, with a reason said aloud, never later. 07 634-635; sk 345-352. The per-kind numbers stay in the GM's Guide.
60. On breaking: every Foe still in the Skirmish that is not Held becomes Apart from every soldier and takes no further turn, and each leaves at the end of the round; a Held Foe stays Held and leaves at the end of the round its hold ends. A group that surrenders yields as the Surrender ask gives, and the Skirmish ends. 07 634-635; sk 353-357.
61. The three ending tests: every Foe out, left, or yielded; the Squad leaves at the end of a round when everyone not Down is Apart, not Held, holding no Foe, and every Down soldier taking part is carried; or nobody is standing, in which case the Foe group leaves and takes nothing. Rendered from sk 410-423. 07 669-671.
62. When it ends, the nine end steps of any fight are resolved, outside the Skirmish, with the Skirmish in the Titan Engagement's place. Everyone who took part counts as everyone who held a Position: the 1 Stress relief, the patient's Position at the aftermath rolls and in the care window, Grief, and the share of left items and dropped Blade Sets. Turn limits become engagement limits, lasting Stress Responses gained here end, and Retirement and promotion come last. A Skirmish has no Nape kill. 07 673-683; sk 424-426; ee 69-82.

## Section 12, Fear, Drives, and Talents

63. A comrade dying: every other soldier taking part who is alive makes the Fear Roll, and a Down soldier makes none. 07 689; sk 430.
64. A first human kill: you kill a person when damage you deal brings a Foe to 0 Health with Cut, Pierce, or Burn, a flare included. A soldier who has never killed a person before makes the Fear Roll when the kill resolves, the sheet records it, and a Drive may shrug it off. 07 690; sk 431-434.
65. Nobody is Grabbed in a Skirmish, so that trigger never comes up. sk 435.
66. The GM may call for a Fear Roll in a Skirmish: rarely, for an event at least as horrifying as a listed trigger, for the witnesses the GM names, and never for an outcome a called roll's stakes named. 07 691.
67. A Drive's turn triggers count Skirmish turns; a Drive's Position triggers need a Titan Engagement and are never met here. 07 692; sk 437.
68. A Talent limited to once per Titan Engagement can also be used once per Skirmish, and a Skirmish begun inside a Leg or a Night Camp has its own use, neither spending the other. A Talent whose effect reads a Position does nothing here unless its row says what it does, as Carrying Voice's does. 07 693; sk 438-444.
69. Hand-to-Hand adds its dice to Fight, with a Blade Set, bare-handed, or as a Grapple, and to Block. Blade Discipline also names Fight. Pry Loose frees only a Grabbed comrade, never a Held one. 07 693; `data/character/talents.yaml` 312-319.
70. Squadmates take part like player characters, on their own cards, directed as the Squadmate rules state, and never Push or Cover. 07 694; sk 445-447.

## The reference table

71. Every roll in a Skirmish, with who rolls it, its entry, what it needs, Help, Push, being tried again, and its note. Rendered as the `skirmish-rolls` table from sk 458-578; the page's `retry` wording is checked against each row's own value, so a row that changes from "never" to a retry, or the reverse, fails the build. 07 698-715.
72. Circumstances reach every soldier's roll and none of a Foe's, and they change dice, never what a roll needs: Watch, the Parley value, Break Free's 2, and the Net Successes an attack needs never move. 07 717.

## Left to the GM's Guide

Foe stat blocks (Attack Dice, Guard dice, Health, Grit, Parley value, Watch, group size, weapons),
the closed rule every Foe acts by and the GM's direction of one, and the per-kind Grit numbers:
07 583-641, `data/skirmish/foes.yaml`. The page names Grit, Guard, Watch, and the Parley value as
things a player meets in play, and prints none of their values.

## Compendium pages written with this chapter

- `/compendium/squad-tactics/`: the four tactics as cards, from `data/engagement/squad-tactics.yaml`
  through `squadTacticEntries()`, with the existing tactic icons, plus the `squad-tactics` table.
  How many a Squad holds is read from the table's own rule text. Rules source: `docs/rules/05-titan-engagement.md` 5.12.
- `/compendium/scars/`: the twelve Scars as cards, from `data/mind/scars.yaml` through
  `scarEntries()`, with each row's D66 band, trigger, effect, and whether a Squadmate rolls again,
  plus the `scars` table. The maximum of five and the D66 are read from the table.
  Rules source: `docs/rules/03-harm-and-mind.md` 3.13.
