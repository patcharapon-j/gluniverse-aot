# Chapter 7: Playtest rules: Expeditions, Downtime, Requisition, and Skirmishes

This chapter holds the smallest rules that let a Squad ride out beyond the Walls and come back, spend its days inside the Walls, ask Command for gear, and fight people:

- Expeditions, the day, the Leg, the hazard tables, and the Night Camp (section 7.1);
- Downtime, the infirmary, Downtime Actions, and the Squad Action (section 7.2);
- Requisition and the playtest Requisition list (section 7.3);
- Skirmishes, Foes, and the foe rule (section 7.4).

Every rule in this chapter is a playtest rule. Phase 2 replaces the chapter, keeping the healing count, which counts days.

It builds on:
- **Chapter 1:** dice pools, Pushing, Covering, Help outside a Titan Engagement, turns, and the procedure in section 1.9 by which an attack is rolled and a Reaction cancels it.
- **Chapter 2:** the Action Catalog, Talents, Squadmates, promotion, and the roll-off for shared choices.
- **Chapter 3:** damage, Critical Injuries and their Injury Type riders, Death Rolls, care windows, a day passing, Fear Rolls, Grief, Retirement, and the steps that follow the end of a Titan Engagement.
- **Chapter 4:** gear items and firearms, horses, falls, Field Repair, Standard Issue, and Squad Supply.
- **Chapter 5:** starting a Titan Engagement, the setup table, initiative cards, and the retreat.

The rows and pointers this chapter needs in Chapters 1 to 5 are applied in those chapters' own files (section 7.5).

**Tables.** Every table and procedure in this chapter is a YAML file. Those files are the only source of truth (ADR-0012). The route tables, the Formation Posts and Pace, both hazard tables, the Downtime and Squad Actions, Scarcity and the Funding gate, the Requisition list, the weapons, the Foes, the foe rule, the Parley asks, and the list of every roll in each section are rendered from them by `tools/render/render.py`, between `BEGIN RENDERED` and `END RENDERED` markers that name each block's source file; nothing between the markers is written by hand, and `render.py check` fails if a rendered block and its YAML differ. The files are:

| File | What it holds |
|---|---|
| `data/expedition/legs.yaml` | When an Expedition begins and ends, the day, Pace, Formation Posts, the Leg, the Leg roll, rations and hunger, and the Night Camp |
| `data/expedition/hazards.yaml` | The Leg Hazard table and what adds to its roll, the Straggler, the Night table, and the effect types their rows use |
| `data/expedition/route.yaml` | The Mission Brief's route, Distance Bands, Waypoint kinds, the Depot and the gate, and the interim route |
| `data/campaign/downtime.yaml` | When Downtime runs, the infirmary, Downtime Actions, the Squadmate relief, and Squad Actions |
| `data/campaign/requisition.yaml` | When Requisition is made, Scarcity, the Funding gate, the roll, the ledger, a grant, and the playtest Requisition list |
| `data/skirmish/skirmish.yaml` | Starting a Skirmish, Engaged and Apart, the Ambush, rounds, actions, attacks, Reactions, damage, weapons, the Grapple and Held, Grit, Parley, Size Up, and ending |
| `data/skirmish/foes.yaml` | The Foes, their firearms, Guard, and the foe rule |

Where the ADRs left a question open, the rule below cites its entry in `docs/rules/OPEN-QUESTIONS.md` as (OQ-nn). This chapter's rules were decided in `docs/rules/DECISIONS-2026-09-14.md`: Expeditions and Downtime under *Batch 7*, 7-14 and 7-15 (OQ-141), Requisition under 7-16 (OQ-142), Skirmishes under 7-17 (OQ-143), and the chapter's shape under 7-18; and, under *Batch 8*, the Skirmish's cancelling rolls and the musket at 4 (8-4, OQ-145), the firebrand and the fired flare (8-7), the prosthetic row (8-10, OQ-147), the Catalog and Skirmish readings (8-12, OQ-148), and the Cut and Pierce riders a Skirmish reaches (8-15, OQ-150). The readings those decisions left open were settled under *Batch 8*, 8-27 to 8-30 (OQ-152 to OQ-155), and each is cited where it applies. Under *Batch 9*, the GM's rulings in this chapter were decided: Foes directed with a reason (9-7), the Parley value (9-14, OQ-172), the Mission Brief and Waypoint scenes (9-15), and the Requisition list and leverage (9-16). Design notes give the reasons.

**Rulings.** The GM rules before the dice, never after them (Chapter 1, section 1.1). In this chapter the GM rules on: the route, its Waypoints, its Formation Posts, and its Hard Ride days, writing the Mission Brief as Command within the bounds *The route* gives, so that the route sets each Leg's Distance Band, Formation Post, and Pace, which the hazard roll then reads as written and no ruling changes once the Expedition begins, and the Waypoint scenes between Legs (decision batch 9, 9-15 and 9-37); the Circumstances of a soldier's roll (Chapter 1, section 1.4a), leverage on a Requisition roll among them, and a row added to the Requisition list (9-16); a Foe's target or action when the fiction gives that Foe a reason said aloud, a Foe group breaking or surrendering sooner than its Grit, and whether the Squad can approach unseen for the Ambush (9-7); the model entry of an improvised act in a Skirmish (9-8), and a called roll in a Skirmish for an act no such entry could model that changes nothing the Skirmish tracks (9-36). The GM applies as written: the hazard and night hazard rolls, their rows, and their modifiers' amounts, rolled in the open, described as they come up, and never softened or swapped; the Straggler's random victim; the Leg roll and the camp roll, whose Circumstances are the only part a ruling names; whether Command grants a Requisition, which the roll decides, with the Funding gate, the ledger, and one Requisition per Downtime; a Foe's Attack Dice and Guard, rolled in the open and never adjusted; damage; the ban on a Foe attacking a Down soldier; and the tests that end a Skirmish. The rest the GM applies as written is the list in Chapter 1, section 1.1, item 6.

---

## 7.1 Expeditions

**Playtest rule.**

An **Expedition** is a Survey Corps operation beyond the Walls, ridden as a chain of **Legs** between **Waypoints**. The Squad always reaches the next Waypoint: a failed Leg roll costs more rations and makes the Leg's hazard worse, but never stops the ride.

### The route

Before an Expedition begins, its route is set once, and nothing changes it afterwards. It is the route of the Mission Brief, which the GM writes as Command (decision batch 9, 9-15), and which names:

- the Waypoints in order, each with its kind and whether it is a Depot, the last being a gate of the Walls;
- for the Leg that leads to each Waypoint, its Distance Band (Near, Far, or Deep) and its Formation Post;
- the days, counted from the Expedition's first, on which Command orders a Hard Ride;
- the Abnormal the hazard tables' Abnormal rows name, when it is not the Sprinting Abnormal.

**Bounds.** A Brief's route has 4 to 6 Legs, the interim route's count. No Leg is deeper than the interim route gives its place: the first and last Legs are Near, the second and second-to-last are Near or Far, and every Leg between them is Near, Far, or Deep. At most one Waypoint is a Depot, and the gate never is. Formation Posts and Hard Ride days are Command's to name, a Hard Ride at most once a day as the day's third Leg (*The day*). The route sets each Leg's Distance Band, Formation Post, and Pace, which the hazard roll reads as written; once the Expedition begins, no ruling changes them. A route outside these bounds is not a Brief's route in the first playtest: the GM writes within them or rolls the interim route below. The playtest log records every route a Brief set, with its Legs, each Leg's Distance Band and Post, the Hard Ride days, and its Depots, and marks an interim route as rolled, so that the retune reads authored Expeditions apart from rolled ones (decision batch 9, 9-37; OQ-167).

When the Squad rides with no Brief, or with a Brief that names no route, roll the **interim route**:

<!-- BEGIN RENDERED: interim-route from data/expedition/route.yaml -->
1. Roll D3+3 for the number of Legs, and so of Waypoints (a D3 is a D6 read 1 or 2 as 1, 3 or 4 as 2, and 5 or 6 as 3).
2. Distance Bands by the Leg's place on the route: the first and last Legs are Near, the second and second-to-last are Far, and every Leg between them is Deep.
3. Roll D6 on the Waypoint kinds table for each Waypoint but the last, which is the gate. No Waypoint is a depot.
4. Roll D6 on the Formation Post table below for each Leg.
5. Not rolled now. After each day's second Leg, if a Leg is left, roll D6: on 5 or 6, Command orders a Hard Ride.

**Formation Post (D6)**

| D6 | Formation Post |
|---|---|
| 1 | Vanguard |
| 2 | Flank Scout |
| 3 | Signal Relay |
| 4 | Center |
| 5 | Supply Wagon |
| 6 | Rear Guard |
<!-- END RENDERED: interim-route -->

A Waypoint's kind sets the Anchor Rating of a Titan Engagement on the Leg that leads to it. The gate sets none, so a Titan Engagement on the Leg to the gate rolls its Anchor Rating on the setup table (Chapter 5, section 5.1).

<!-- BEGIN RENDERED: waypoint-kinds from data/expedition/route.yaml -->
| Waypoint kind | Anchor Rating | Interim route (D6) |
|---|---|---|
| Open plain | Open | 1 |
| Hedgerows | Sparse | 2 |
| Forest | Wooded | 3–4 |
| Abandoned town | Urban | 5 |
| Giant forest | Giant Forest | 6 |
| Gate of the Walls | none; roll it on the setup table | never rolled; always the route's last Waypoint |
<!-- END RENDERED: waypoint-kinds -->

- A **Depot** is a Waypoint the Brief marks as one. It keeps its kind. When the Squad arrives there, every soldier receives a full Standard Issue together, and Squad Supply is restocked (Chapter 4, sections 4.9 and 4.10).
- Reaching the **gate**, the route's last Waypoint, ends the Expedition at the end of that Leg, with no further Leg and no Night Camp. Downtime begins (section 7.2).

### Before and during an Expedition

- **Before it begins,** every soldier in the Squad receives a full Standard Issue together, and Squad Supply is restocked, rations included.
- **The interim day and the interim issue** never happen while an Expedition is under way. The Night Camp's day, the issue before the Expedition, and a Depot's issue take their place (Chapter 3, section 3.6; Chapter 4, section 4.9).
- **Gas and gear.** No Gas Roll is made on a Leg or at a Night Camp; gas is spent only in a Titan Engagement. Canisters, Blade Sets, and Squad Supply come back only through a full Standard Issue, so what a Titan Engagement uses up stays used up until the next Depot or the next Expedition, except the Squad Supply a successful called search finds, as Chapter 4 caps it (section 4.10).
- **Horses.** On a Leg, every soldier who is not Down and whose own horse is not lame is mounted. At a Night Camp every soldier is dismounted. A Down soldier, and a soldier whose horse is lame, rides in the wagon or across a comrade's saddle and is not mounted.
- **Down soldiers** cannot be the Lead, Help a Leg roll or the camp roll, or make the camp roll. When no soldier can make a Leg roll or the camp roll, as when every living soldier is Down, that roll fails, with no Help and no Push. The Squad still reaches the Waypoint, the Down ride in the wagon, and nothing else in the Leg or the Night Camp changes. A hazard row that names the Lead does nothing when there is no Lead.
- **Who takes part.** Every living soldier in the Squad. A new character who joins the Squad during an Expedition joins at the next Waypoint (Chapter 2, section 2.10).
- **Promotion and Retirement** that fall due on a Leg or at a Night Camp happen when that Leg or Night Camp ends, after any Titan Engagement, Skirmish, care window, or day passing inside it has ended.
- **Talents and Drives.** A Leg and a Night Camp each have a start and an end. A Talent limited to once per Titan Engagement can also be used once per Leg and once per Night Camp where its trigger can occur, such as Sure Seat on a Hard Ride. A Titan Engagement or a Skirmish that begins inside a Leg or a Night Camp is its own procedure with its own use: a use in the fight does not spend the Leg's or the Night Camp's, and a use in the Leg or the Night Camp does not spend the fight's (Chapter 2, the Talent limits). A Drive's turn tests count no Leg roll and no camp roll.

> **Decided (decision batch 8, 8-27):** who is mounted on a Leg and at a Night Camp, and that a soldier whose horse is lame rides in the wagon (OQ-152, item e).

> **Decided (decision batch 8, 8-39):** a Titan Engagement or a Skirmish nested in a Leg or a Night Camp keeps its own once-per uses, so the fight plays as the simulator measured it.

### The day

A day holds two Legs and a Night Camp. Legs are never ridden at night.

1. Ride the day's first Leg, then its second. After each, the GM may frame a Waypoint scene (*Waypoint scenes*).
2. If a Leg is left on the route after the second, and Command orders a **Hard Ride**, ride that Leg as the day's third. Command orders one on a day the Brief lists; on the interim route, roll D6 after the day's second Leg, and a 5 or 6 orders one. A day's first or second Leg is never a Hard Ride. After a Hard Ride, the GM may frame a Waypoint scene.
3. Make the Night Camp.

Every Leg ridden counts toward the day's Legs, including a Leg ridden again after a retreat, whether the retreat came on a Leg, in a Waypoint scene, or at a Night Camp. A Leg ridden again as the next day's first after a retreat in a Waypoint scene counts toward that day's Legs.

<!-- BEGIN RENDERED: pace from data/expedition/legs.yaml -->
| Pace | When | Leg roll | Rations | Adds to the hazard roll |
|---|---|---|---|---|
| Steady | Every Leg that is not a Hard Ride. | the Formation Post's entry | as the Leg roll gives | +0 |
| Hard Ride | A third Leg squeezed in before dark, after the day's second Leg, when a Leg is left on the route and Command orders it: on a day the Mission Brief lists, or, on the interim route, when the D6 rolled after the day's second Leg shows 5 or 6. A day's first or second Leg is never a Hard Ride. | Ride | 2 times what the Leg roll gives | +1 |
<!-- END RENDERED: pace -->

> **Decided (decision batch 8, 8-27):** a Hard Ride is ordered by the day, never on a day's first or second Leg, and a Leg ridden again counts toward the day (OQ-152, items a and b).

### Formation Posts

The whole Squad rides at the **Formation Post** the route gives each Leg, so the Post changes only at a Waypoint. The Post names the entry the Leg roll uses on a Steady Leg and what it adds to the hazard roll.

<!-- BEGIN RENDERED: formation-posts from data/expedition/legs.yaml -->
| Formation Post | Leg roll on a Steady Leg | Adds to the hazard roll | Special | The post |
|---|---|---|---|---|
| Vanguard | Spot | +1 | none | The first to see, and the first seen. |
| Flank Scout | Survive | +1 | none | Reading the land at the formation's edge. |
| Signal Relay | Spot | +0 | Once per Leg, before the hazard roll, the Squad may spend 1 flare of Squad Supply to lower that Leg's hazard total by 2. | Watching the sky for flares. |
| Center | Endure | -1 | none | The long hours in the saddle. |
| Supply Wagon | Survive | +0 | The Leg Hazard table's Dropped supplies row loses 2 units in place of 1. | Keeping the wagons whole. |
| Rear Guard | Spot | +0 | none | The last to leave. |
<!-- END RENDERED: formation-posts -->

### Riding a Leg

For each Leg, in order:

1. **Take your post.** The Squad rides at the Formation Post the route gives this Leg.
2. **The Leg roll** (below).
3. **Arrive.** The Squad reaches the Leg's Waypoint. On a success, spend 1 ration, and the hazard roll gets −1 for each success beyond the first. On a failure, spend 2 rations, and the hazard roll gets +1. A Hard Ride doubles the rations. A Squad that holds fewer rations than it must spend meets hunger (*Rations and hunger*).
4. **The hazard.** At the Signal Relay Post the Squad may first spend its flare. Roll the hazard and resolve its row (*The Leg Hazard table*).
5. **Harm.** Harm a row inflicts outside a Titan Engagement opens the care window Chapter 3 holds after harm outside a Titan Engagement, with every soldier on the Expedition in its scope (Chapter 3, section 3.5).
6. **A Titan Engagement** a row begins takes its Anchor Rating from the kind of the Waypoint this Leg leads to, and whatever else the row names; the setup table gives everything the row leaves unnamed (Chapter 5, section 5.1). Every living soldier on the Expedition takes part, mounted or not as they rode. If it became a retreat before it ended (Chapter 5, section 5.10), the Squad falls back to the Waypoint this Leg started from and rides this Leg again from step 1, with a new Leg roll and a new hazard. A retreat from a Titan Engagement the Night table begins falls back overnight instead (*The Night Camp*, step 4).
7. **The Waypoint.** The Leg ends. At a Depot, every soldier receives a full Standard Issue together. At the gate, the Expedition ends.

### Waypoint scenes

**Playtest rule.**

After a Leg ends at a Waypoint that is not the gate, and before the next Leg or the Night Camp, the GM may frame a **Waypoint scene** there: searching an abandoned town, finding survivors, crossing a flooded ford.

- **It runs on called rolls,** each with its Circumstances and its stakes named before the dice (Chapter 1, section 1.1). A successful called search adds Squad Supply only as Chapter 4 allows (section 4.10). A Waypoint scene yields Squad Supply to at most two called searches (Chapter 4, section 4.10; decision batch 9, 9-41).
- **A Skirmish or a Titan Engagement** may begin in it by the fiction, as scene framing starts one (section 7.4; Chapter 5, section 5.1).
- **Harm** a called roll's stakes inflict opens the care window Chapter 3 holds after harm outside a Titan Engagement, with every soldier on the Expedition in its scope (Chapter 3, section 3.5).
- **A retreat.** If a Titan Engagement begun in a Waypoint scene becomes a retreat before it ends (Chapter 5, section 5.10), the scene ends and the Squad falls back as from one a hazard row of the Leg that reached this Waypoint began: to the Waypoint that Leg started from, riding that Leg again from step 1 with a new Leg roll and a new hazard (*Riding a Leg*, step 6). Step 7 applies again when the Squad reaches this Waypoint, a Depot's Standard Issue included (decision batch 9, 9-23). The Leg ridden again takes the day's next Leg slot (*The day*): after the day's first Leg it is the second, at Steady; after the second it is the third only if Command orders a Hard Ride that day, and it is then a Hard Ride. If no slot remains, the Squad falls back to the Waypoint that Leg started from and makes the Night Camp there, which is then the camp's Waypoint for the night hazard and for a Titan Engagement it begins (*The Night Camp*, step 4; decision batch 9, 9-40), and the next day's first Leg rides that Leg again at Steady (decision batch 9, 9-33).
- **What it never does.** A Waypoint scene rides no Leg. It makes no Leg roll or camp roll, reads no Leg Hazard or Night table, spends no ration unless a called roll's stakes name one, and never stands in place of a hazard roll. A danger the GM authors belongs in a Waypoint scene; a rolled hazard row is described as it came up, never softened or swapped.

> **Decided (decision batch 9, 9-15; OQ-141):** the GM as Command writes the Mission Brief and may frame a Waypoint scene between Legs, while the Leg roll, the hazard and Night tables, their rolls, and their modifiers' amounts, which the route, the night camps made, the Leg roll, and the flare decide, rations, and the Straggler's random victim stay as written, and a Brief's route keeps within the bounds *The route* gives (ADR-0009, as amended; decision batch 9, 9-37).

### The Leg roll

- **Who rolls.** The **Lead**: one soldier on the Expedition who is not Down, chosen by the players, using Chapter 2's roll-off if they disagree. On a Hard Ride the Lead must be mounted on their own horse.
- **Entry.** The Post's entry on a Steady Leg: Spot, Survive, or Endure. On a Hard Ride, Ride, with the horse's Gear Dice, so a Pushed Ride wears the horse.
- **Needs** 1 success.
- **Help.** Up to 3 comrades on the Expedition who are not Down. Help spends nothing, and each soldier Helps at most once per Leg.
- **Push and Cover** as Chapter 1 gives. **It is never tried again**; a Leg ridden again after a retreat makes a new Leg roll.
- **With no soldier who can make the roll,** on a Steady Leg or a Hard Ride, the Leg roll fails, with no Help and no Push. That happens when every living soldier is Down, or, on a Hard Ride, when no soldier who is not Down is mounted on their own horse.

> **Decided (decision batch 8, 8-27 and 8-35):** a Leg roll with no soldier who can make it counts as a failed roll, first on a Hard Ride (OQ-152, item e) and now on every Leg; the camp roll does the same (8-35; ADR-0009, as amended).

### The Leg Hazard table

Roll **D6** and add every line below. The hazard roll is a table roll: no pool, no Push, no Help, and never tried again. A row that lets the players choose is a shared choice, settled by Chapter 2's roll-off when they disagree.

<!-- BEGIN RENDERED: leg-hazard-modifiers from data/expedition/hazards.yaml -->
| The hazard roll adds | Amount |
|---|---|
| The Leg's Distance Band | Near +0, Far +1, Deep +2 |
| Each night camp already made on this Expedition | +1 |
| The Formation Post | as the Formation Posts table gives |
| The Pace | Steady +0, Hard Ride +1 |
| The Leg roll failed | +1 |
| The Leg roll succeeded | -1 for each success beyond the first |
| The Squad spent the Signal Relay's flare | -2 |
<!-- END RENDERED: leg-hazard-modifiers -->

<!-- BEGIN RENDERED: leg-hazards from data/expedition/hazards.yaml -->
**Leg Hazard table (D6, plus every line above)**

| Total | Hazard | What happens |
|---|---|---|
| 1 or less | Quiet ride | Nothing happens. |
| 2 | Broken ground | The Lead's horse takes 1 point of wear. If there is no Lead, or the Lead is not mounted, nothing happens. |
| 3 | Dropped supplies | Squad Supply loses 1 unit of one kind that holds a unit, chosen by the players; at the Supply Wagon Post it loses 2 units of that kind, or all it holds if fewer. If no kind holds a unit, nothing happens. |
| 4 | Long hours | Every soldier on the Expedition gains 1 Stress. |
| 5 | Thrown | One mounted soldier, chosen by the players, falls from a horse (Chapter 4, section 4.6). If no soldier is mounted, nothing happens. |
| 6 | Titans far off | The players choose: the Squad spends 1 flare and 1 ration and rides around them, or a Titan Engagement begins with every soldier at Distant. If Squad Supply holds no flare or no ration, the Titan Engagement begins. |
| 7 | Titan on the formation | A Titan Engagement begins with every soldier at Distant. |
| 8 | Straggler | Roll the Straggler's victim. The victim makes an Endure roll; on a failure they gain a Bite Critical Injury at a rolled Injury Location, which can be lethal. Then a Titan Engagement begins with the victim at In Reach and every other soldier at Distant. |
| 9 | Abnormal | A Titan Engagement begins with every soldier at Distant, against the Sprinting Abnormal, or the Abnormal the Mission Brief names. |
| 10 or more | Overrun | A Titan Engagement begins with every soldier at In Reach and two Background Titans, on clocks of 4 and 8. |
<!-- END RENDERED: leg-hazards -->

### The Straggler

The Straggler row picks its victim at random, and the pick is a roll, not a choice:

1. **Kind.** Roll D6: on 1 to 4 the victim is a Squadmate, on 5 or 6 a player character. Only living soldiers on the Expedition who are not Down count. If none of that kind counts, use the other kind; if neither has one, resolve the row as Titan on the formation instead.
2. **Soldier.** Number the soldiers of that kind who count 1 upward, in Squad sheet order, and roll D6, rolling again any result above the count. Every one of them is equally likely, and the sheet's order chooses nothing.
3. **Endure.** The victim makes an Endure roll. It needs 1 success, cannot be Helped or Covered, can be Pushed, and is never tried again.
4. **On a failure,** the victim gains a Bite Critical Injury at a rolled Injury Location, which can be lethal. It is a Titan's harm but not a Behavior Table card: it rolls no Attack Dice, no Reaction answers it, and the Critical Injury roll adds nothing for Net Successes. It counts as gained as the row's Titan Engagement begins, so no separate care window is held for it and its time limit runs as one gained in that Titan Engagement.
5. **Then** the Titan Engagement begins, with the victim at In Reach and every other soldier at Distant.

> **Decided (decision batch 8, 8-27):** the victim is drawn from soldiers who are not Down, the row falls back to Titan on the formation when no one counts, and the Critical Injury counts as gained as the Titan Engagement begins (OQ-152, item d).

### The Night Camp

After the day's Legs, in order:

1. **The camp roll.** One soldier on the Expedition who is not Down, chosen by the players, rolls Survive. It needs 1 success. Up to 3 comrades on the Expedition who are not Down may Help, spending nothing. It can be Pushed and Covered, and is never tried again. If no soldier can make it, as when every living soldier is Down, it fails, with no Help and no Push.
2. **Rations.** Spend 1 ration. A Squad that holds none meets hunger.
3. **Camp Relief.** If the camp roll succeeded and the camp did not meet hunger, every soldier on the Expedition loses 1 Stress.
4. **The night hazard.** Roll D6, add the Distance Band of the day's last Leg as the Leg Hazard table does, and add +1 if the camp roll failed. Nothing else adds to it. Read the Night table below. A Titan Engagement it begins takes its Anchor Rating from the kind of the Waypoint the camp is made at: the Waypoint the day's last Leg reached, or, after a Waypoint-scene retreat that left no Leg slot, the Waypoint that Leg started from (*Waypoint scenes*; decision batch 9, 9-40). The Distance Band added above is still the day's last ridden Leg's, whatever the retreat. A camp at the gate the Expedition left, after a retreat on the day's first Leg that left no slot, rolls that Anchor Rating on the setup table, as a gate gives none (*The route*), and the Expedition goes on (decision batch 9, 9-45). Titans do not walk at night; only an Abnormal does.
   - **A retreat at night.** If that Titan Engagement becomes a retreat before it ends (Chapter 5, section 5.10), the Squad falls back overnight to the Waypoint the day's last Leg started from, and the Night Camp goes on there at step 5, with no new camp roll, ration, or night hazard. It still counts as a Night Camp made on this Expedition. Falling back is not riding a Leg: it makes no Leg roll, spends nothing, and reads no Leg hazard. The next day's first Leg rides that Leg again, from step 1, with a new Leg roll and a new hazard, and counts toward that day's Legs. A Titan Engagement the Night table begins that ends any other way leaves the camp where it was. If the camp is already at the Waypoint the day's last Leg started from, the Squad falls back no further: it breaks off where it is, the camp goes on at step 5 with no new camp roll, ration, or night hazard, the night counts as the one Night Camp already counted, and the Leg queued for the morning is ridden as that day's first, at Steady, unchanged (decision batch 9, 9-40).
5. **A day passes** (Chapter 3, section 3.6): a care window with every soldier on the Expedition in its scope, in which Field Repair is rolled; the Death Rolls of `day` limits; Health lost to damage comes back; a day of healing.

<!-- BEGIN RENDERED: night-hazards from data/expedition/hazards.yaml -->
**Night table (D6, plus the Distance Band of the day's last Leg, plus 1 if the camp roll failed)**

| Total | Night | What happens |
|---|---|---|
| 3 or less | Quiet night | Nothing happens. |
| 4 | Restless | Every soldier on the Expedition gains 1 Stress. |
| 5 | Spoiled | Squad Supply loses 2 rations, or all it holds if fewer. |
| 6 | Spooked horses | One horse on the Expedition that is not lame, chosen by the players, goes lame. If none, nothing happens. |
| 7 | Prowlers | At Near or Far, a Skirmish begins against three Bandits who have the Ambush and carry firebrands in place of clubs. At Deep, resolve Restless instead. |
| 8 or more | Abnormal at night | A Titan Engagement begins against the Sprinting Abnormal, or the Abnormal the Mission Brief names, with every soldier dismounted at Distant. If it becomes a retreat before it ends, the Squad falls back overnight, as the Night Camp's night hazard step gives. |
<!-- END RENDERED: night-hazards -->

> **Decided (decision batch 8, 8-27):** the Night table reads the Distance Band of the day's last Leg, and its Titan Engagement the kind of the Waypoint that Leg reached (OQ-152, item f).

> **Decided (decision batch 8, 8-37):** a retreat from a Titan Engagement the Night table begins falls back overnight to the Waypoint the day's last Leg started from, the camp goes on there, and that Leg is ridden again as the next day's first (ADR-0009, as amended).

### Rations and hunger

Squad Supply holds rations by Funding, as Chapter 4's stock table gives (section 4.10). A Leg spends them by its Leg roll and its Pace, a Night Camp spends 1, and two hazard rows spend or lose them.

**Hunger.** When a Leg or a Night Camp must spend rations and Squad Supply holds fewer than it must spend, the Squad spends every ration it holds, and every soldier on the Expedition gains 1 Stress, with no roll. A Night Camp that meets hunger gives no Camp Relief.

> **Decided (decision batch 8, 8-27):** holding fewer rations than a spend counts as holding none (OQ-152, item c).

### Every roll on an Expedition

<!-- BEGIN RENDERED: rolls expedition from data/expedition/legs.yaml -->
| Roll | Who rolls | Entry | Needs | Help | Push | Tried again | Notes |
|---|---|---|---|---|---|---|---|
| Leg roll | The Lead: one soldier on the Expedition who is not Down, chosen by the players, using Chapter 2's roll-off if they disagree. On a Hard Ride the Lead must be mounted on their own horse. | the Formation Post's entry on a Steady Leg; Ride on a Hard Ride, with the horse's Gear Dice | 1 | Up to 3 comrades on the Expedition who are not Down. Help spends nothing, and each soldier Helps at most once per Leg. | Allowed, and a comrade who qualifies to Help may Cover it (Chapter 1, section 1.5). | Never. A Leg ridden again after a retreat makes a new Leg roll. | With no soldier who can make the roll, on a Steady Leg or a Hard Ride, the Leg roll fails. |
| Camp roll | One soldier on the Expedition who is not Down, chosen by the players, using the roll-off if they disagree. | Survive | 1 | Up to 3 comrades on the Expedition who are not Down. Help spends nothing. | Allowed, and a comrade who qualifies to Help may Cover it (Chapter 1, section 1.5). | Never. | With no soldier who can make the roll, the camp roll fails. |
<!-- END RENDERED: rolls expedition -->

<!-- BEGIN RENDERED: rolls hazards from data/expedition/hazards.yaml -->
| Roll | Who rolls | Entry | Needs | Help | Push | Tried again | Notes |
|---|---|---|---|---|---|---|---|
| Hazard roll and night hazard roll | Rolled in the open for the Squad; no soldier rolls it. | none (a table roll, D6 plus what its table adds) | none; read the row for the total | Never. | Never. | Never. | Takes no Circumstances. The GM describes the row that comes up and never softens or swaps it. |
| The Straggler's Endure roll | The Straggler's victim. | Endure | 1 | Never. | Allowed, and Covering is not, since no one qualifies to Help (Chapter 1, section 1.5). | Never. | Takes the Circumstances in force when the hazard roll was made, Standard unless the GM named a step before then for a lasting condition of the Leg that touches it; no step is named or changed for it after, and none for the row's own danger (decision batch 9, 9-34). |
<!-- END RENDERED: rolls hazards -->

**Circumstances** as Chapter 1 gives (section 1.4a) apply to the Leg roll, the camp roll, the Straggler's Endure roll, and every called roll in a Waypoint scene. The Straggler's Endure roll, and any other roll a row's own text calls for, takes the step in force when the hazard is rolled, Standard unless the GM named one before then for a lasting condition of the Leg; none is named for it after, and none for the danger the row describes (decision batch 9, 9-34). A Titan Engagement or a Skirmish a row begins takes its Circumstances as any fight does (Chapter 5, section 5.5; section 7.4), including a step the GM names for a condition that begins during it (decision batch 9, 9-26 and 9-41). The hazard and night hazard rolls are table rolls and take none. Every need in these tables is unchanged.

> **Design note (decision batch 7, 7-14; OQ-141):** The Expedition is ADR-0009 made playable: the Squad always reaches the next Waypoint, a failed Leg roll doubles the rations and worsens the hazard by 1, the hazard grows with distance and with each Night Camp, a retreat falls back to the previous Waypoint, one at night falls back overnight and rides the Leg again the next morning so that no Leg is ridden in the dark (ADR-0009, as amended in decision batch 8; 8-37), and the night has its own calmer table whose only Titan is an Abnormal. The whole Squad rides at one Formation Post that changes only at a Waypoint (ADR-0010). Ride is the Hard Ride's entry because it is the one roll outside a Titan Engagement that a horse's Gear Dice supply, which Horsemanship and Sure Seat need. Hunger is a flat Stress gain rather than a roll for every soldier, because it is rare and six pools for one row would slow the table. A Squad whose every living soldier is Down still rides on in the wagons: every roll that needs a standing soldier fails, which costs rations, worsens the hazards, and gives no Camp Relief, and no new death rule is needed (ADR-0009, as amended in decision batch 8; 8-35). Distance Bands by the Leg's place on the interim route give every route the same shape, climbing to Deep and back. The Straggler's victim is random because the owner asked that the players not pick whom the Titan takes, and the numbered die keeps the Squad sheet's order from choosing (decision batch 4). The tables ship as written: the first playtest runs four player characters with no Squadmates, recorded as the playtest configuration (Chapter 2, section 2.10; decision batch 8, 8-38), so every Straggler is a player character, and the tables are tuned on the playtest's count of Titan Engagements, Critical Injuries, and deaths per Expedition. No Expedition figure is measured before the playtest (ADR-0014, as amended in decision batch 7). A Brief's route keeps within the interim route's envelope, 4 to 6 Legs, no Leg deeper than the interim route gives its place, and at most one Depot, so that no authored Expedition plays above the distribution these tables ship for, and the playtest log tags every authored route (decision batch 9, 9-37).

## 7.2 Downtime

**Playtest rule.**

**Downtime** is the time the Squad spends inside the Walls between Expeditions.

### When it runs

- It **begins** when the Squad reaches the gate that ends an Expedition, and **runs until** the next Expedition begins.
- It spans **seven days**, which pass at the infirmary (below). Nothing else in Downtime takes days.
- While it runs, the interim day and the interim issue never happen. Its seven days and the next Expedition's issue take their place.
- Every soldier in the Squad takes part. Stress never falls below a soldier's minimum, and Grief never below 0.

> **Decided (decision batch 8, 8-28):** Downtime runs until the next Expedition begins, with its seven days passing at the infirmary (OQ-153, item a).

### The steps

1. **The infirmary** (below).
2. **Downtime Actions.** Each player character takes one Downtime Action, in the order the players choose, using Chapter 2's roll-off if they disagree. Each Squadmate takes the Squadmate relief instead.
3. **The Squad Action.** The Squad takes one, chosen by the players, using the roll-off if they disagree. While the playtest configuration holds (Chapter 2, section 2.10), Recruit is not offered and brings no Squadmate, so the Squad Action is Honoring the Fallen.
4. **After the actions,** in order: items and supplies Command granted by Requisition arrive (section 7.3); prosthetics are fitted (Chapter 3, section 3.2); medical Retirement is offered again (Chapter 3, section 3.13); then every Retirement and promotion that has fallen due resolves (Chapter 2, section 2.10).

> **Decided (decision batch 8, 8-28):** the after-actions order, with granted items arriving before prosthetics are fitted, so a limb that heals during the seven days can take a Requisitioned prosthetic the same Downtime (OQ-153, item c).

> **Decided (decision batch 8, 8-38):** while the playtest configuration holds, Recruit is not offered and brings no Squadmate; Squadmates stay the default rule.

### The infirmary

1. **One care window,** with every soldier in the Squad in its scope (Chapter 3, section 3.5). Field Repair is not rolled in it; in Downtime, Maintain Gear restores gear.
2. **Seven days,** each resolved in this order:
   1. Every lethal Critical Injury with a `day` limit gets one **infirmary roll**: 4 base dice, needing 1 success, with no Push, no Help, no Stress Dice, and no Talent, Gear, or Bonus Dice. A success stabilizes it, as a successful treatment does, without treating it.
   2. Every lethal Critical Injury that still has a `day` limit causes a Death Roll.
   3. Every living soldier gets back all Health lost to damage.
   4. Every held Critical Injury's remaining healing time drops by 1 day, and one that reaches 0 heals. An untreated Critical Injury whose Injury Type rider stops it healing while untreated, as a Pierce from the 7 row up does, keeps its remaining time, and a lethal Critical Injury cannot heal while it is still lethal (Chapter 3, section 3.6).

The seven days hold no care window of their own. A death on an infirmary day causes no Fear Roll. Its Grief is the Grief of a day passing, and promotion is timed as for a day passing (Chapter 3, section 3.14; Chapter 2, section 2.10).

> **Decided (decision batch 8, 8-28):** the infirmary's first care window is Downtime's only one (OQ-153, item b).

### Downtime Actions and the Squad Action

<!-- BEGIN RENDERED: downtime-actions from data/campaign/downtime.yaml -->
**Downtime Actions** (each player character takes one per Downtime)

| Downtime Action | Effect |
|---|---|
| Recover | The soldier loses 2 Stress. |
| Visit Haven | The soldier goes home to their Haven and loses 2 Stress and 2 Grief. |
| Requisition | The soldier makes one Requisition, or Helps a comrade's Requisition roll with it (section 7.3). |
| Maintain Gear | Every rated item the soldier holds returns to its rating: ODM Gear is no longer Jammed, a lame horse is no longer lame, and a worn kit or firearm is whole again. A ruined Blade Set stays ruined. |

**Squadmates** take no Downtime Action. Each Squadmate loses 2 Stress and 1 Grief.

**Squad Actions** (the Squad takes one per Downtime)

| Squad Action | Effect |
|---|---|
| Honoring the Fallen | Every soldier in the Squad loses 1 Grief. |
| Recruit | Not offered while the playtest configuration holds, and it brings no Squadmate then (Chapter 2, section 2.10). Otherwise, new Squadmates join until the Squad Pool holds 6 minus the number of player characters. The players choose each one's template and name it, and it joins as a starting Squadmate does, with Standard Issue (Chapter 2, section 2.10). |
<!-- END RENDERED: downtime-actions -->

A Downtime Action is the Catalog option Downtime Action, taken once per player character per Downtime, and the Squad Action is the option Squad Action, taken once per Downtime by the Squad; their rows are the tables above. The Squadmate relief and the infirmary roll are results of the procedure, not acts.

Train, Investigate, Contribute to Research, lobbying for Funding, HQ Upgrades, XP, Commendations, and Faction Standing wait for Phase 2.

### Every roll in Downtime

<!-- BEGIN RENDERED: rolls downtime from data/campaign/downtime.yaml -->
| Roll | Who rolls | Entry | Needs | Help | Push | Tried again | Notes |
|---|---|---|---|---|---|---|---|
| Infirmary roll | Rolled for the patient; no soldier rolls it, and a Down patient gets it too. | none (4 base dice, not an attribute roll; no Talent, Gear, Stress, or Bonus Dice) | 1 | Never. | Never. | Once per Critical Injury per infirmary day; it is called again on each later day while that Critical Injury is still lethal. | none |
<!-- END RENDERED: rolls downtime -->

The infirmary roll is not an attribute roll and takes no Circumstances (Chapter 1, section 1.4a).

The Requisition roll and Size Up on the quartermaster are in section 7.3.

> **Design note (decision batch 7, 7-15; OQ-141, OQ-52):** Seven fixed days are the owner's choice for the playtest. The infirmary roll gives a `day`-limit Critical Injury inside the Walls a rule where none existed, so a soldier who comes home dying is not left to seven Death Rolls with no care. Visit Haven lowers Grief by 2, which meets OQ-52's requirement that the Downtime rules can remove at least 2 Grief a Downtime from a soldier who uses that relief; Honoring the Fallen adds 1 for everyone. Downtime Actions and the Squad Action are Catalog options whose rows live in the Downtime tables, as Break Attention's decoys live beside that entry, so each is an act with its tracked values (decision batch 8, 8-28; OQ-153, item d; ADR-0024, limit 12).

## 7.3 Requisition

**Playtest rule.**

**Requisition** is how a soldier gets gear beyond Standard Issue. There are no prices: Funding decides what Command will consider, and the item's Scarcity and the soldier's roll decide whether they get it.

### When

Requisition is a Downtime Action. Each player character may make one Requisition per Downtime. It is never made before a campaign's first Expedition, and never outside Downtime.

### Scarcity and the Funding gate

Every row of the list has a Scarcity. Funding sets which Scarcity Command will consider, and the Scarcity sets the successes the roll needs before the ledger. Funding is 3 until the Funding rules are written (Chapter 4, section 4.9).

<!-- BEGIN RENDERED: requisition-gate from data/campaign/requisition.yaml -->
**Scarcity**

| Scarcity | Successes needed, plus the ledger |
|---|---|
| Standard | 1 |
| Limited | 2 |
| Rare | 3 |

**The Funding gate**

| Funding | Scarcity Command will consider |
|---|---|
| 1–2 | Standard |
| 3–4 | Standard, Limited |
| 5–6 | Standard, Limited, Rare |
<!-- END RENDERED: requisition-gate -->

A row locked behind a Discovery cannot be named until the Squad holds that Discovery. No playtest row is locked.

### The roll

1. **Name one row** the Funding gate allows, with any choice the row asks for, and the soldier the item is for.
2. **Roll Persuade or Recall,** chosen before rolling: talking the quartermaster round, or citing the regulation and the officer who signed it.
   - **Needs:** the row's Scarcity, plus the ledger.
   - **Help:** up to 3 comrades in the Squad who are not Down. A player character Helps by taking Requisition as their Downtime Action and spending it on the Help. A Squadmate Helps at most once per Downtime and spends nothing.
   - **Circumstances** as Chapter 1 gives (section 1.4a). The GM may name them for leverage the soldier brings, such as a favour owed, a Commendation, or a captured specimen. Scarcity and the ledger are needs and never change.
   - **Push and Cover** as Chapter 1 gives. Stress gained here rides out on the next Expedition.
   - **Never tried again this Downtime:** it was the soldier's one Requisition.
3. **On a success,** Command grants the row, and the ledger rises by 1. **On a failure,** Command says no, and nothing else happens. Successes beyond the needs do nothing.

### The ledger and Size Up

- **The ledger** is Command's patience within one Downtime. It starts at 0 and counts the Requisitions Command has granted the Squad this Downtime.
- **Size Up on the quartermaster.** Once per Downtime, before any Requisition roll, one soldier in the Squad who is not Down, a Squadmate included, chosen by the players, may roll Size Up. It needs 1 success, cannot be Helped or Covered, can be Pushed, and is never tried again. It is not a Downtime Action. On a success, the ledger counts 1 lower for the whole Squad for the rest of this Downtime, never below 0.

> **Decided (decision batch 8, 8-29):** the ledger never falls below 0, and any soldier who is not Down may make the Size Up roll without spending a Downtime Action (OQ-154, item a).

### What a grant gives

- **Items** belong to the soldier the Requisition named and are **kept items** (Chapter 4, section 4.1). A kept item counts as items, can be passed, taken, and shared out like any item of its kind, and Standard Issue never takes it away unless the soldier hands it in at an exchange (Chapter 4, section 4.9). A Blade Set rated above 1 is still ruined by any wear. ODM Gear or a horse replaces the soldier's own, which leaves play.
- **Squad Supply** units are added above the stock. They are not kept items.
- A grant arrives at the after-actions step of this Downtime, before prosthetics are fitted and before the next Standard Issue.

> **Decided (decision batch 8, 8-29):** when a grant arrives (OQ-154, item b).

### The playtest Requisition list

Every row is canon gear that Chapters 3 and 4 already define, at a rating or in a number Standard Issue does not give, or one of the two firearms the Skirmish rules need, or a prosthetic.

**Playtest rule.** The GM may add a row to this list for their table: an item that meets the charter (ADR-0016), at a Scarcity the era rules allow. An added item that rates a measured roll (ODM Gear, a Blade Set, a horse, or a firearm) is at least Limited, and every added row is marked unmeasured. An added row changes nothing else: the Funding gate, the ledger, one Requisition per Downtime, and Command's answer once the roll is made stand.

<!-- BEGIN RENDERED: requisition-list from data/campaign/requisition.yaml -->
| Item | Scarcity | Notes |
|---|---|---|
| Spare gas canister, full | Standard | One more than the Funding row gives. |
| Blade Set, rating 1 | Standard | One more than the Funding row gives. |
| Medical kit, rating 1 | Standard | Standard Issue gives one only to a Medic. |
| Tool kit, rating 1 | Standard | Standard Issue gives one only to an Engineer. |
| 2 flares, 2 rations, or 1 unit of medical supplies | Standard | The soldier names which when naming the row. Added to Squad Supply above its stock. |
| 6 units of shot | Standard | Added to Squad Supply above its stock. |
| Blade Set, rating 2 | Limited | Any wear still ruins it. |
| Medical kit, rating 2 | Limited | none |
| Tool kit, rating 2 | Limited | none |
| Flintlock pistol, rating 1 | Limited | Arrives empty (Chapter 4, section 4.1). |
| Musket, rating 1 | Limited | Arrives empty, and counts as 2 items (Chapter 4, section 4.1). |
| Prosthetic arm or prosthetic leg | Limited | One per Requisition, of the kind of a side the named soldier has lost and has no prosthetic fitted to, and only once that side's loss has healed. A player character may name a Squadmate as its soldier. It is fitted at a Downtime (Chapter 3, section 3.2, Lost limbs). |
| ODM Gear, rating 3 | Rare | Replaces the soldier's ODM Gear, which leaves play. |
| Horse, rating 3 | Rare | Replaces the soldier's horse, which leaves play. |
| Blade Set, rating 3 | Rare | Any wear still ruins it. |
<!-- END RENDERED: requisition-list -->

> **Decided (decision batch 8, 8-29):** the prosthetic row's canon label (OQ-154, item c).

> **Decided (decision batch 9, 9-16):** the GM may add a charter-compliant row, at least Limited for an item that rates a measured roll and marked unmeasured, and may name Circumstances for leverage; the Funding gate, the ledger, and one Requisition per Downtime stand (ADR-0016, as amended).

### Every roll of a Requisition

<!-- BEGIN RENDERED: rolls requisition from data/campaign/requisition.yaml -->
| Roll | Who rolls | Entry | Needs | Help | Push | Tried again | Notes |
|---|---|---|---|---|---|---|---|
| Requisition roll | The player character taking the Requisition Downtime Action. | Persuade (Empathy) or Recall (Wits), chosen before rolling | the named row's Scarcity needs, plus the ledger | Up to 3 comrades in the Squad who are not Down. A player character Helps by taking Requisition as their Downtime Action and spending it on the Help. A Squadmate Helps at most once per Downtime and spends nothing. | Allowed, and a comrade who qualifies to Help may Cover it (Chapter 1, section 1.5). Stress gained rides out on the next Expedition. | Never this Downtime; it was the soldier's one Requisition. | The GM may name the Circumstances for leverage, such as a favour owed, a Commendation, or a captured specimen (Chapter 1, section 1.4a). Scarcity and the ledger are needs and never change. |
| Size Up on the quartermaster | One soldier in the Squad who is not Down, a Squadmate included, chosen by the players, using the roll-off if they disagree. It is not a Downtime Action. | Size Up | 1 | Never. | Allowed (Chapter 1, section 1.5); no one can Cover it, since no one qualifies to Help. | Never; one Size Up per Downtime. | none |
<!-- END RENDERED: rolls requisition -->

**Circumstances** as Chapter 1 gives (section 1.4a) apply to both rolls. Scarcity and the ledger are needs and unchanged.

> **Design note (decision batch 7, 7-16; decision batch 8, 8-10; OQ-142, OQ-147):** Funding and Scarcity with no price list is ADR-0016's item 8. Requisition starts at the first Downtime, so the first playtest runs on the reference kit. Two entries for one roll is deliberate: Silver Tongue and Book Learning both have a home, and no Specialty owns Requisition. The Funding gate and the ledger are the brake, not the attribute: at Funding 3, four player characters can each ask for a Limited item, and the fourth grant of a Downtime needs 2 more successes than the first. A soldier who Requisitions ODM Gear 3 or a Blade Set rated 2 plays above ADR-0014's reference Rookie, as the Veteran build already assumes, and those ratings' Jam, gas, and Blade Set figures are on record (Chapter 4, section 4.9; OQ-63). The prosthetic is fitted at a Downtime after the loss has healed, and a player character may Requisition one for a Squadmate, since any player directs a Squadmate.

## 7.4 Skirmishes

**Playtest rule.**

A **Skirmish** is a scene in which soldiers fight people: Military Police, bandits, a Garrison picket. People roll their attacks, can be blocked, can be talked down, and hurt a soldier with damage, never with a Critical Injury directly. No Titan takes part, and Titan Engagements are unchanged.

### Starting a Skirmish

- **What starts one.** A rule that names a Skirmish, such as the Night table's Prowlers row or a Mission Brief, or the table's scene framing setting the Squad against people, as scene framing starts a Titan Engagement (Chapter 5, section 5.1). A Waypoint scene, or the stakes of a failed called roll, may begin one by the fiction (section 7.1; Chapter 1, section 1.1).
- **What the start names.** One Foe kind from the Foe table, and, if it says so, how many Foes, which side has the Ambush, that it is night, and which soldiers take part. One Foe group takes part in a playtest Skirmish. Its number is the start's, or else the kind's group size. A Skirmish that begins at a Night Camp is at night.
- **Who takes part.** The soldiers the start names; if it names none, every living soldier in the Squad on the same Expedition, or every living soldier in the Squad when no Expedition is under way.
- **Setting out.**
  1. The Foe group: its Foes labelled 1 upward, each at full Health, with its weapons, and its firearms loaded.
  2. Every soldier taking part is Apart from every Foe, unless the start says otherwise.
  3. Settle the Ambush (below).
  4. Round 1 begins.

> **Decided (decision batch 8, 8-30):** a group's number when the start names none, one Foe group per Skirmish, and loaded firearms at the start (OQ-155, items a and b).

### Engaged and Apart

- Each soldier is **Engaged** with a Foe, within arm's reach of it, or **Apart** from it, separately for each Foe. Engaged and Apart are not Positions: a Skirmish has no Positions, no Anchor Rating, no ODM move, no Fly roll a rule calls for, and no airborne soldier. The one Fly roll in a Skirmish is a called roll the GM names for Fly (*A called roll*, below), and it makes no soldier airborne (decision batch 9, 9-43).
- **A move** in a Skirmish does one of these: the soldier **closes in** and becomes Engaged with one Foe they name; **breaks away** and becomes Apart from every Foe they are Engaged with; or stays as they are. A move may also include one mount or one dismount (Chapter 4, section 4.5).
- The move of a Held soldier, of a soldier who holds a Foe, and of a Down soldier changes nothing.
- A Foe becomes Engaged or Apart only through the foe rule.

> **Decided (decision batch 8, 8-30):** a Down soldier's move changes nothing in a Skirmish (OQ-155, item c).

### The Ambush

- **From the start.** A start may give the Ambush to the Foes, as the Prowlers row does.
- **Trying for it.** Before round 1 of a Skirmish whose start does not give the Foes the Ambush, the GM rules whether the Squad can approach unseen at all. If it cannot, no side has the Ambush. If it can, one soldier taking part who is not Down, chosen by the players, rolls **Sneak**, with the Circumstances the GM names. It needs the Foe group's **Watch**, cannot be Helped or Covered, can be Pushed, and is never tried again. On a success the Squad has the Ambush; on a failure no side has it.
- **What it does.** A soldier or a Foe has not yet acted until its first card of the Skirmish has come up.
  - In round 1, every card of the side with the Ambush comes up before every card of the other side. Cards within a side keep their order.
  - A soldier's Fight or Shoot roll against a Foe that has not yet acted gains 2 Bonus Dice. A Foe with the Ambush rolls 2 more Attack Dice against a soldier who has not yet acted.
  - An attack by the side with the Ambush on a target that has not yet acted cannot be answered: the soldier makes no Reaction and the Foe rolls no Guard, so every success of the attack counts.

> **Decided (decision batch 8, 8-30):** the Squad may try for the Ambush in any Skirmish whose start does not give it to the Foes, and a Foe with the Ambush rolls 2 more Attack Dice (OQ-155, items d and i).

### Rounds and turns

- **Cards.** At the start of each round, deal initiative cards as in a Titan Engagement (Chapter 5, section 5.3): one to each soldier taking part, living, Down or not, and one to the Foe group while any of its Foes is in the Skirmish. Cards come up lowest first. There are no Wings and no swap step.
- **A soldier's card.** The soldier takes one turn of one move and one action, in either order (Chapter 1, section 1.9). A Squadmate takes its turn on its own card and never Pushes or Covers.
- **The Foe group's card.** Each Foe still in the Skirmish takes one turn, in label order, by the foe rule.
- **End of the round.** Every Foe of a group that broke leaves. Then check the ending.
- **Turns count.** A soldier's turn in a Skirmish counts for every rule that counts turns: a `turn` time limit (Chapter 3, section 3.4), spending a turn (Chapter 1, section 1.9), and a Drive's turn tests.

### What a soldier can do

A soldier's action in a Skirmish is one of these:

- **Fight** (Strength) against a Foe they are Engaged with, with the Blade Set in their handles for Gear Dice, or bare-handed or with an object that is not a gear item, which gives none. A Fight declared as a **Grapple** takes no Gear Dice (*The Grapple, Held, and Release*).
- **Shoot** (Agility) with a loaded firearm, which gives its Gear Dice, against a Foe the weapon can target; a musket is never fired at a Foe the soldier is Engaged with. The firearm is empty after the roll. A Pushed Gear Die showing 1 wears it (Chapter 4, section 4.1). A soldier may also Shoot a flare at a person, spending 1 flare of Squad Supply and no Shot, with no Gear Dice.
- **Reload** one empty firearm, spending 1 Shot of Squad Supply and the action, and, for a musket, the move as well.
- **Break Free** while Held, needing 2 successes.
- **Parley** or **Size Up** (below).
- **Help**, **Treat Injury**, **Rally**, **Lift Comrade**, **Pass Item**, **Take Item**, and **Change Canister**. Treat Injury and Rally are used as in a Titan Engagement (Chapter 3, sections 3.5 and 3.11) with no Position requirement: the patient or the Rallied comrade is any other soldier taking part, or the soldier themselves where Chapter 3 allows it, and a failed use can be tried again on a later turn.

**Release** ends a hold the soldier has on a Foe, with no roll, spending nothing. **Swap Blade Set**, **Shed Load**, and **Mount or Dismount** are used as Chapter 4 gives them. No entry that is used only in a Titan Engagement can be taken.

**An improvised act.** A soldier may attempt an act no entry covers. Before the pool is built, the GM names as its model entry one entry of kind action this section allows, never Block, Dodge, or an option such as Reload or Release, and that ruling stands. An act the soldier describes that is not an entry taken as written is an improvised act, even when a tracked value it would change matches an entry (decision batch 9, 9-27). The act spends the action, is rolled as the model entry is, takes Circumstances as any roll, carries the model entry's restrictions (a Foe's Guard still rolls against it), and produces only the model entry's effect at its size (Chapter 2, section 2.9). An object that is not a gear item, thrown at a Foe Engaged or Apart, is a Shoot at that object's damage of 1 and Crush, with no Gear Dice (*Weapons*).

**A called roll.** An act no entry of kind action this section allows could model, that would change nothing the Skirmish tracks (no Foe's Health, Guard, Grit, Parley value, Attack Dice, or Watch, no Engaged or Apart, no card), is a called roll (Chapter 1, section 1.1). It spends the action, on the soldier's turn, and never stands in for a Reaction (*Reactions against a Foe*; decision batch 9, 9-45); Help on it is Help in a Skirmish (below); a fall it stakes is low or high, never extreme; a time or position cost changes only the situation outside what the Skirmish tracks; and success never gives an effect an entry has. It is tried again on a later turn (decision batch 9, 9-36). The GM may name Fly for it, as for any called roll outside a Titan Engagement (Chapter 2, section 2.9): the roll takes the ODM Gear's Gear Dice (decision batch 9, 9-24), as a Dodge made with ODM Gear does here, and a Pushed Gear Die showing 1 wears the gear; it makes no soldier airborne, makes no Gas Roll, and ODM Gear that Jams on it drops no one (Chapter 4, section 4.2); and it gives no Engaged or Apart, which only a move changes. A soldier whose ODM Gear is Jammed cannot be named for Fly; the GM names Agility alone (decision batch 9, 9-43).

Help on a roll in a Skirmish comes from up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart.

> **Decided (decision batch 8, 8-30):** Treat Injury and Rally as actions in a Skirmish (OQ-155, item h).

### Attacks

Every attack in a Skirmish follows the procedure in section 1.9 of Chapter 1, by which the attack is rolled and a cancelling roll answers it. This section adds only what is the Skirmish's:

1. **The attacker rolls.** A soldier rolls Fight or Shoot with a full pool and may Push before any cancelling roll is made. A Foe rolls its **Attack Dice** as base dice, succeeding on 6, never Pushed, with no other dice. The attack's successes are its Severity, announced.
2. **The target's cancelling roll.** A soldier may make a **Reaction** (below). A Foe rolls its **Guard**: its Guard dice, rolled in the open as base dice, never Pushed, spending nothing, against every attack on it.
3. **Cancel.** Each success of the cancelling roll cancels one success of the attack. The attack **lands on 1 or more Net Successes** and does nothing on 0. Against a target who makes no cancelling roll, every success of the attack is net.

### Reactions against a Foe

- **Block** (Strength, with a Blade Set if the soldier has one; otherwise with no Gear Dice) answers a Fight attack. **Dodge** (Agility, with ODM Gear, or with the horse while mounted) answers a Fight attack or a shot.
- A Reaction spends a turn as Chapter 1 gives. A soldier makes **at most one Reaction against each Foe per round.** Its successes cancel against the attack it answered and, separately, against each later attack that Foe makes on the soldier that round, and are never used up. A Block cancels only Fight attacks.
- The reacting side Pushes last, after the Foe's roll is known.
- A Reaction takes the Circumstances step in force when the Foe group's card comes up, and no step is named or changed for it after (Chapter 1, section 1.4a, item 9; decision batch 9, 9-25).
- A Held soldier cannot Dodge. No Reaction answers an attack the Ambush leaves unanswered, and a state or result that forbids Reactions forbids them here too.

### Damage

- **An attack that lands** deals its weapon's damage, **plus 1 for each Net Success beyond the first**, with the weapon's Injury Type. A Grapple deals none.
- **On a soldier,** it is damage as Chapter 3 gives it, at a rolled Injury Location: it marks Health lost, and at 0 current Health the soldier is Down and gains a Critical Injury of the weapon's Injury Type, which takes its name and any rider from Chapter 3's tables (section 3.2). A person never inflicts a Critical Injury directly.
- **Cut and Pierce,** which reach a soldier from a Foe's weapon in a Skirmish or as damage a called roll's stakes named (Chapter 3, section 3.1), carry riders that Chapter 3 states once (section 3.2): a lethal Cut bleeds, so its Death Roll comes at the end of each of the soldier's turns until it is treated, and a Pierce from the 7 row up holds the ball, so Treat Injury on it takes a 1-die penalty and it does not heal until it is treated.
- **On a Foe,** damage lowers its Health, never below 0. A Foe has no Critical Injuries, no Stress, and no Down state. At 0 Health it is **out of the Skirmish**: dead if the damage was Cut, Pierce, or Burn, and out cold if it was Crush. A Foe out of the Skirmish takes no further part and is never a target again in it.

> **Decided (decision batch 8, 8-30):** Burn damage at 0 Health kills a Foe, as Cut and Pierce do; only Crush puts a Foe out cold (OQ-155, item e; ADR-0018, as amended).

### Weapons

<!-- BEGIN RENDERED: skirmish-weapons from data/skirmish/skirmish.yaml -->
| Weapon | Attack | Injury Type | Damage | Target | Gear Dice from | Spends | Used by | Notes |
|---|---|---|---|---|---|---|---|---|
| Blade Set | Fight | Cut | 2 | Engaged only | Blade Set | nothing | soldiers | The Blade Set in the handles gives the Gear Dice. A Pushed roll whose Gear Die shows 1 ruins it (Chapter 4, section 4.4). |
| Bare hands, or an object that is not a gear item | Fight | Crush | 1 | Engaged only | none | nothing | soldiers and Foes | A Grapple is made with it and deals no damage. Bare hands never kill a Foe. Thrown at a Foe Engaged or Apart, such an object is an improvised act with Shoot as its model entry, at this damage and Injury Type, with no Gear Dice (Chapter 2, section 2.9). |
| Flintlock pistol | Shoot | Pierce | 2 | Engaged or Apart | Flintlock pistol | its load; the firearm is empty after the roll | soldiers and Foes | A soldier's firearm gives its Gear Dice, and a Pushed 1 wears it (Chapter 4, section 4.1). |
| Musket | Shoot | Pierce | 4 | Apart only | Musket | its load; the firearm is empty after the roll | soldiers and Foes | Reload also spends the move. A ball deals 4 at 1 Net Success, 5 at 2, and 6 at 3 (damage, amount, per_net_success_beyond_the_first), so it Downs a Health 6 Rookie at 3 Net Successes, with a Pierce Critical Injury. A well-aimed shot still drops a soldier; a graze no longer does (decision batch 13, 13-8; OQ-194). |
| Flare, fired at a person | Shoot | Burn | 1 | Engaged or Apart | none | 1 flare of Squad Supply; no Shot and no firearm | soldiers | A flare is a signal first. Firing one at a person is a Shoot roll with no Gear Dice. Fire kills a Foe it brings to 0 Health. |
| Sabre | Fight | Cut | 2 | Engaged only | none | nothing | Foes | none |
| Knife | Fight | Cut | 1 | Engaged only | none | nothing | Foes | none |
| Club | Fight | Crush | 1 | Engaged only | none | nothing | Foes | none |
| Firebrand | Fight | Burn | 1 | Engaged only | none | nothing | Foes | A Bandit at night carries it in place of a club. Fire kills; against a soldier it is Burn damage. |
<!-- END RENDERED: skirmish-weapons -->

A soldier's own weapons are a Blade Set, bare hands, a firearm, and a flare; a sabre, a knife, a club, or a firebrand in a soldier's hands is an object that is not a gear item. Firearms have no use in a Titan Engagement.

### The Grapple, Held, and Release

- **A Grapple** is a Fight roll against a Foe the soldier is Engaged with, declared as a Grapple before rolling, with no Gear Dice. Talents that name Fight apply. If it lands, the Foe is **Held** by the soldier, and it deals no damage.
- **A Held Foe** cannot move and attacks only its holder, bare-handed. It still rolls Guard.
- **The holder** cannot move, Shoot, or Reload, and takes no action but a bare-handed Fight against the Held Foe or Help. At any point of their turn they may take **Release**, which spends nothing and ends the hold.
- **A hold ends** when the holder takes Release, becomes Down, or dies, or when the Foe is out of the Skirmish. A Foe never Breaks Free and never releases.
- **A soldier Held by a person** cannot move or Dodge, attacks only the holder, bare-handed, and ends the hold with Break Free. No Foe Grapples in the playtest, so no playtest rule makes a soldier Held; these rules stay written for later Foes.

> **Decided (decision batch 8, 8-30):** a hold ends when the holder becomes Down (OQ-155, item g).

### Foes

Every Foe of a kind shares its row. Attack Dice and Guard are base dice, succeeding on 6, and take no Circumstances. The Parley value is the base a Parley against the group needs (*Parley*). The group size is used when the start names no number.

<!-- BEGIN RENDERED: foes from data/skirmish/foes.yaml -->
| Foe | Attack Dice | Guard | Fight with | Shoot with | Health | Grit | Parley | Watch | Group |
|---|---|---|---|---|---|---|---|---|---|
| Bandit | 4 | 3 | 1–3: Club; 4–6: Knife (D6 for each Bandit as the Skirmish begins); at night, a firebrand in place of a club | none | 3 | 1 | 1 | 1 | 3 |
| Military Police trooper | 7 | 4 | Sabre | Flintlock pistol | 4 | 4 | 2 | 2 | 4 |
| Garrison sentry | 4 | 3 | Bare hands, or an object that is not a gear item | Musket | 4 | 1 | 1 | 2 | 2 |
<!-- END RENDERED: foes -->

> **Decided (decision batch 8, 8-30 and 8-33):** a Bandit's weapon roll, the Garrison sentry fighting bare-handed when Engaged, and the Military Police trooper's group size (OQ-155, items a and b). Decision batch 8, 8-33, replaced the trooper's D3+1 roll with a fixed patrol of 4 and set its Attack Dice at 7 and its Grit at 4 (OQ-164).

> **Decided (decision batch 9, 9-14; OQ-172):** each Foe kind's Parley value sets what a Parley needs in place of its Grit: 1 for a Bandit and a Garrison sentry, as their Grit was, and 2 for a Military Police trooper, whose Grit of 4 stays for breaking.

> **Decided (decision batch 9, 9-7, item 5, and 9-41, item 7):** the three Foe kinds above are the playtest's whole list. A Foe kind a table makes waits for Phase 2, so the GM adds none for the first playtest (`foes.yaml`, `gm_rulings`, `table_made`).

### The foe rule

**Playtest rule.** The foe rule is the default: every Foe acts by it unless the GM directs one.

- **Directing a Foe.** On a Foe's turn, when the fiction gives that Foe a reason, the GM may direct its target or its action in place of the rule's pick, and says the reason aloud before the Foe acts: the sergeant goes for the medic who shot his man. A reason the table cannot hear is not a reason.
- **What a directed Foe still does.** It takes only a turn the steps below can give (it Fights, Shoots, reloads, closes in and Fights, or does nothing), with its kind's weapons, and never attacks a Down soldier. A Held Foe still acts only as step 1 gives. It never leaves the Skirmish alone: a Foe leaves only at 0 Health or when its group breaks or surrenders, so a GM who wants a Foe to run breaks its group sooner, with a reason said aloud (decision batch 9, 9-34).
- **What stays as written.** A Foe's Attack Dice and Guard, rolled in the open from its row and never adjusted; damage and Net Successes; whether a Foe at 0 Health is dead or out cold; and that a Foe never Pushes, Helps, or Covers (ADR-0024, limit 8).

<!-- BEGIN RENDERED: foe-rule from data/skirmish/foes.yaml -->
On the Foe group's card, each Foe still in the Skirmish that has not broken takes one turn, in label order. Take the first step whose test the Foe meets.

- **Candidates:** Every soldier taking part who is alive and not Down.
- **Last attacker:** Of the candidates, the one who most recently made a Fight or Shoot roll against this Foe, landed or not.
- **Lowest card:** Of the candidates a step names, the one whose initiative card this round is lowest.

1. **The Foe is Held.** It Fights its holder, bare-handed.
2. **The Foe is Engaged with a candidate.** It Fights with its Fight weapon: its last attacker, if they are Engaged with it; otherwise the Engaged candidate with the lowest card.
3. **The Foe has a loaded firearm and at least one candidate.** It Shoots with its Shoot weapon at its last attacker, if any; otherwise at the candidate with the lowest card.
4. **The Foe has an empty firearm.** It reloads.
5. **The Foe has at least one candidate.** It becomes Engaged with the candidate with the lowest card and Fights them with its Fight weapon.
6. **None of the above.** Nothing.

A Foe never takes any of these: Push, Help, Cover, Grapple, Break Free, Release, Parley, Size Up, a Reaction. A Foe has no Stress, makes no Fear Roll, and has no Stress Response.

**Guard.** A Foe's Guard is its cancelling roll. When a soldier's Fight or Shoot roll against the Foe is final, the GM rolls the Foe's Guard dice in the open as base dice. Each success cancels one of the attack's successes, and the attack lands on 1 or more net successes. Guard is rolled against every attack on the Foe, however many come in a round. A Held Foe still rolls it. None of these apply to it: Push, Help, Bonus Dice, Stress Dice, Gear Dice. It spends nothing.

**Firearms.** A Foe's firearm is loaded when the Skirmish begins. A Foe's firearm is empty after it Shoots. A Foe's Reload spends its turn and no shot; a Foe never runs out.
<!-- END RENDERED: foe-rule -->

> **Decided (decision batch 8, 8-30):** a Foe never attacks a Down soldier (OQ-155, item c).

### Grit and breaking

- **Breaking.** When the number of the group's Foes out of the Skirmish reaches its **Grit**, the group breaks, at the latest. At once, every Foe of it still in the Skirmish that is not Held becomes Apart from every soldier and takes no further turn, and each leaves at the end of the round. A Held Foe stays Held and leaves at the end of the round its hold ends.
- **Sooner.** The GM may break the group sooner, or have it surrender, with a reason said aloud as it happens (the officer falls; the sergeant sees the flare), never later. A group broken sooner breaks as above. A group that surrenders yields as the Surrender ask gives, and the Skirmish ends.
- A failed Parley made as a threat raises the group's Grit by 1 and its Parley value by 1 for the rest of the Skirmish, so a failed threat hardens later Parleys (decision batch 9, 9-22).

> **Decided (decision batch 8, 8-30):** a Held Foe of a group that breaks (OQ-155, item g).

> **Decided (decision batch 9, 9-7):** Grit is the latest point at which a group breaks; the GM may break it, or have it surrender, sooner, with a reason said aloud (ADR-0018, as amended).

### Parley

- **When.** On a soldier's action; each soldier Parleys at most once per Skirmish.
- **The roll.** Persuade (Empathy), or, as a threat, Strength in place of Empathy, still for Persuade, so a Talent that names Persuade adds its dice.
- **Needs.** The group's **Parley value** (the Foes table) plus 1, minus 1 for each of its Foes out of the Skirmish, never below 1; then add the ask's number below.
- **Help** from up to 3 comrades taking part who are not Down, each spending their action. It can be Pushed and Covered.
- **On a success,** the group yields: it does what the ask says, and the Skirmish ends. **On a failure,** nothing happens, except that a failed threat raises the group's Grit, and its Parley value, by 1 each (*Grit and breaking*).

<!-- BEGIN RENDERED: parley-asks from data/skirmish/skirmish.yaml -->
| Ask | Adds to the needs | On a success |
|---|---|---|
| Stand down | +0 | The group leaves. |
| Let us pass | +0 | The group lets the Squad go its way. |
| Answer | +0 | The group answers one question truthfully, from what its Foes know. |
| Surrender | +1 | The group lays down its arms and gives itself up to the Squad. |
<!-- END RENDERED: parley-asks -->

**Outside a Skirmish.** When a Mission Brief or scene framing sets the Squad before a Foe group from the list with no Skirmish under way, each soldier may make one Parley with that group. It needs the group's Parley value plus the ask's number, cannot be Helped or Covered, can be Pushed, and is never tried again by that soldier with that group. On a success the group does what the ask says; on a failure nothing happens. Talking with anyone who is not a Foe group from the list is a called roll (Chapter 1, section 1.1).

### Size Up

On a soldier's action, once per Foe group per Skirmish for the whole Squad, a soldier may roll **Size Up** (Instinct). It needs 1 success, cannot be Helped or Covered, can be Pushed, and is never tried again. On a success, the GM states the group's Grit, how many more of its Foes must be out before it breaks, and what each of its Foes will do on the group's next card under the foe rule as things stand. For a Foe the GM already means to direct, the GM states instead what it will do and the reason. Each Foe does what the GM stated on its turn on that card, unless something happens after the Size Up that changes it: for a Foe stated under the foe rule, a change in what the rule tests, after which the rule picks again, or a new reason the fiction gives it, said aloud; for a Foe stated as directed, a new reason, said aloud, or an action it can no longer take, after which the foe rule picks unless the GM directs it again with a reason said aloud. The GM never directs a Foe on that card for a reason held back at the Size Up (decision batch 9, 9-22).

### Ending a Skirmish

A Skirmish ends when one of these is true:

- Every Foe of the group is out of the Skirmish, has left, or has yielded.
- **The Squad leaves.** At the end of a round, if every soldier taking part who is not Down is Apart from every Foe, is not Held, and holds no Foe, and every Down soldier taking part is carried by a comrade, the players may declare that the Squad leaves.
- **No soldier is standing.** Every soldier taking part is Down or dead. The Foe group leaves and takes nothing.

When it ends, resolve the steps Chapter 3 resolves when a Titan Engagement ends (section 3.16), with "Skirmish" in place of "Titan Engagement", outside the Skirmish:

1. Turns spent in advance, and pending results, are cancelled, and every ban on Reactions ends.
2. Every soldier who took part loses 1 Stress.
3. Every lasting Stress Response gained during the Skirmish ends.
4. Every `turn` limit becomes `engagement`.
5. Aftermath rolls, with every soldier who took part counting as holding the patient's Position.
6. The Death Rolls of `engagement` limits.
7. A care window, with every soldier who took part in its scope.
8. Grief for the deaths during the Skirmish, for every soldier who took part.
9. Retirement, then promotion. Left items and dropped Blade Sets are shared out among the soldiers who took part (Chapter 4, section 4.11).

> **Decided (decision batch 8, 8-30):** when the Squad may leave, and what happens when no soldier is standing (OQ-155, item f).

### Fear Rolls, Drives, Talents, and Squadmates

- **A comrade dies:** every other soldier taking part who is alive makes the Fear Roll; a Down soldier makes none.
- **A first kill:** a soldier kills a person when damage they deal brings a Foe to 0 Health with Cut, Pierce, or Burn, a flare included. A soldier who has never killed a person before makes the Fear Roll for a first human kill when the kill resolves, and the sheet records it (Chapter 3, section 3.12). A Drive may shrug it off.
- **The GM's trigger.** A Skirmish is outside a Titan Engagement, so the GM may call `gm-horror` in one: rarely, for an event at least as horrifying as a listed trigger, for the witnesses the GM names (Chapter 3, section 3.12; decision batch 9, 9-6). It is never called for an outcome a called roll's stakes named (decision batch 9, 9-34).
- **Drives.** A Drive's turn tests count Skirmish turns. A Drive's Position triggers need a Titan Engagement and are never met in a Skirmish.
- **Talents.** A Skirmish has a start and an end: a Talent limited to once per Titan Engagement can also be used once per Skirmish. A Skirmish that begins inside a Leg or a Night Camp has its own use, and neither use spends the other (decision batch 8, 8-39). A Talent whose effect reads a Position does nothing in a Skirmish unless its row says what it does there, as Carrying Voice's does. Hand-to-Hand adds its dice to Fight, with a Blade Set, bare-handed, or as a Grapple, and to Block. Blade Discipline also names Fight. Pry Loose frees only a Grabbed comrade, never a Held one.
- **Squadmates** take part like player characters, on their own cards, directed as Chapter 2 states.

### Every roll in a Skirmish

<!-- BEGIN RENDERED: rolls skirmish from data/skirmish/skirmish.yaml -->
| Roll | Who rolls | Entry | Needs | Help | Push | Tried again | Notes |
|---|---|---|---|---|---|---|---|
| Sneak for the Ambush | One soldier taking part who is not Down, chosen by the players, using Chapter 2's roll-off if they disagree. | Sneak | the Foe group's Watch | Never. | Allowed (Chapter 1, section 1.5); no one can Cover it, since no one qualifies to Help. | Never. | Made only if the GM rules that the Squad can approach unseen; if not, no side has the Ambush. |
| Fight, or a Grapple | A soldier on their action, against a Foe they are Engaged with. | Fight | 1 Net Success after the Foe's Guard | Up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart. | Allowed, before the Foe's Guard is rolled; a comrade who qualifies to Help may Cover it. | On a later turn. | none |
| Shoot | A soldier on their action, with a loaded firearm or a flare, against a Foe the weapon's target allows. | Shoot | 1 Net Success after the Foe's Guard | Up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart. | Allowed, before the Foe's Guard is rolled; a comrade who qualifies to Help may Cover it. | On a later turn, once the firearm is loaded again or with another flare. | none |
| Block or Dodge against a Foe | The soldier a Foe's attack targets. | Block (against a Fight attack only) or Dodge | none of its own; each success cancels one success of the attack | Up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart. | Allowed, after the Foe's roll is known; the reacting side Pushes last. A comrade who qualifies to Help may Cover it. | Never against the same Foe that round; its successes stand against that Foe's later attacks that round. | Takes the Circumstances step in force when the Foe group's card came up; no step is named or changed for it after (Chapter 1, section 1.4a, item 9; decision batch 9, 9-25). |
| Break Free while Held | A soldier Held by a person, on their action. | Break Free | 2 | Up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart. | Allowed; a comrade who qualifies to Help may Cover it. | On a later turn. | none |
| Parley | A soldier on their action. | Persuade (Empathy, or Strength as a threat) | the group's Parley value plus 1, minus 1 for each of its Foes out of the Skirmish, never below 1, plus the ask's number | Up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart. | Allowed; a comrade who qualifies to Help may Cover it. | Never by the same soldier in this Skirmish; each soldier Parleys at most once per Skirmish. | A failed threat raises the group's Grit and Parley value by 1 each for the rest of this Skirmish. |
| Parley outside a Skirmish | A soldier before a Foe group with no Skirmish under way. | Persuade (Empathy, or Strength as a threat) | the group's Parley value, plus the ask's number | Never. | Allowed; no one can Cover it, since no one qualifies to Help. | Never by the same soldier with that group. | none |
| Size Up a Foe group | A soldier on their action. | Size Up | 1 | Never. | Allowed; no one can Cover it, since no one qualifies to Help. | Never; once per Foe group per Skirmish, for the whole Squad. | none |
| A called roll in a Skirmish | A soldier on their action, for an act no entry of kind action this list allows could model and that changes nothing the Skirmish tracks (actions, called_roll). | the entry marked when_called that the GM names, or the attribute alone | 1 | Up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart. | Allowed; a comrade who qualifies to Help may Cover it. | On a later turn, spending that turn's action. | Its stakes are read as data/core/dice-pool.yaml (called_roll, in_a_fight) reads them in a fight; a fall it stakes is low or high (decision batch 9, 9-36). |
| Treat Injury or Rally in a Skirmish | A soldier on their action. | Treat Injury or Rally | as Chapter 3 gives | Up to 3 comrades taking part who are not Down, each spending their action, whether Engaged or Apart. | Allowed; a comrade who qualifies to Help may Cover it. Sure Hands allows a second Push on Treat Injury. | On a later turn. | none |
| A Foe's attack | A Foe, on its group's card, by the foe rule, or as the GM directs it with a reason said aloud. | none (the Foe's Attack Dice) | 1 Net Success after the target's Reaction, if any | Never. | Never. | Never. | Rolled in the open and never adjusted; it takes no Circumstances. |
| A Foe's Guard | The Foe a soldier's Fight or Shoot roll targets. | none (the Foe's Guard dice) | none of its own; each success cancels one success of the attack | Never. | Never. | Never. | Rolled in the open and never adjusted; it takes no Circumstances. |
<!-- END RENDERED: rolls skirmish -->

**Circumstances** as Chapter 1 gives (section 1.4a) apply to every soldier's roll in this table; a Foe's Attack Dice and Guard take none. Watch, the Parley value, Break Free's 2, and the Net Successes an attack needs are needs and unchanged.

> **Design note (decision batch 7, 7-17; decision batch 8, 8-4, 8-7, 8-12, 8-33; OQ-143, OQ-145, OQ-164):** A Skirmish shares the Titan's attack shape (ADR-0019): the attacker's successes are the attack's Severity, each success of the cancelling roll cancels one, and the attack lands on 1 or more Net Successes. People differ from Titans in three ways, and this section adds only those: a person can be blocked, a Foe cancels a soldier's attack with Guard, a roll that never Pushes and spends nothing, and a person's harm is damage that grows by 1 for each Net Success beyond the first, so a partial Reaction cuts it (ADR-0018, as amended). A Health pool in front of the Critical Injury tables is what lets a Skirmish end in flight or surrender instead of a grave, and Grit is the one number that decides the latest a group gives up. The musket's damage of 4 is the owner's answer to how lethal a gun should be, and the Coriolis-style rider carries it: a ball deals 4 at 1 Net Success, 5 at 2, and 6 at 3, so it Downs a Health 6 Rookie at 3 Net Successes, with a Pierce Critical Injury. A well-aimed shot drops a soldier and a graze no longer does, which is where decision batch 13 (13-8; OQ-194) leaves it after Health rose by 2; whether a firearm still frightens anyone is read from the rerun. Bare hands never kill, so killing a person is a choice made with a blade or a gun. The foe rule is a closed list of tests on public facts and the default every Foe follows (ADR-0024, limit 8): it is legible, and a Squad can steer a Foe onto whoever last struck it, which is acceptable for the playtest. A Grapple deals no damage and a Foe never lets go, and Release, a soldier's letting go, has its own entry (ADR-0024, limit 12). The firebrand and the fired flare give Burn a Skirmish source without a new gear item: a flare is Squad Supply, and a firebrand is a Foe's weapon. A Skirmish probe reports one Rookie against one Military Police trooper, the reference Squad against four troopers, and the reference Squad against three Bandits with the Ambush and firebrands, each beside one of three reported figures in `foes.yaml` (`reported_figures`): a patrol kills 0.02 to 0.04 soldiers a Skirmish and the Squad wins at least 90%, the Bandits' night Ambush kills 0.01 to 0.03, and a lone Rookie beats a lone trooper 50% to 70% of the time. They are reported, not tuned, and are not ADR-0014 targets. The final full simulator rerun reports each inside its range: 0.020 deaths with a 97.5% win against the patrol, 0.016 deaths in the Ambush, and a 57.5% win for the lone Rookie (`docs/reviews/simulator-report.md`, section 6.14). The trooper's Attack Dice of 7, Grit of 4, and patrol of 4 come from a sweep against those figures, the fewest Foe fields that reach them: a patrol under orders fights to the last and is hard to talk down, a squad fight stays a notch below a Titan fight, and a Survey Corps soldier still beats one trooper more often than not (decision batch 8, 8-33). The Skirmish probe makes no Fear Roll the GM called, so the reported figures above describe a Skirmish with none (decision batch 9, 9-41).

> **Design note (decision batch 9, 9-7, 9-14, 9-16; OQ-172):** People act with reasons and Titans without. The foe rule stays the default and the Skirmish probe's baseline, so the reported figures above describe Foes run by it, and the playtest log records every directed Foe. The reason said aloud and the ban on attacking a Down soldier carry the table's trust: a soldier who asks why the sergeant went for them has an answer the whole table heard, and the one direction that would read as an execution cannot be given. Grit as the latest break keeps a patrol that fights to the last while letting a leaderless group run. The Parley value parts how hard a group is to talk down from how many of it must fall. For a soldier with Empathy 3 and Stress 1 who Pushes when short, Stand down in a Skirmish at the trooper's Grit of 4 needed 5 successes, 2% with two helpers, a side effect of 8-33 rather than a decision; at a Parley value of 2 it needs 3: about 12% alone, 28% with two helpers, and 37% with three. The probe never Parleys, so no reported figure moves. An added Requisition row stays behind the Funding gate and the ledger, which are the only brake on gear climbing past the reference builds (ADR-0018 and ADR-0016, each as amended).

## 7.5 Who uses these rules

- **Player characters** use every rule in this chapter.
- **Squadmates** ride on Expeditions, take part in Skirmishes, and gain the infirmary's care and the Squadmate relief like player characters, as Chapter 2 allows. While the playtest configuration holds, the Squad has none, and every rule that reads a Squadmate finds none (Chapter 2, section 2.10). A Squadmate takes no Downtime Action, never Pushes or Covers, and may Help a Requisition roll once per Downtime. A player character may Requisition a prosthetic for one.
- **Foes** act by the foe rule unless the GM directs one with a reason said aloud, roll Attack Dice and Guard as base dice, and never Push, Help, Cover, or gain Stress.
- **Titans** appear through the hazard rows that begin a Titan Engagement, through a Titan Engagement a Waypoint scene begins by the fiction, and through the Straggler's Critical Injury, which rolls no Attack Dice.
- **The GM** rolls the hazard tables, the Foes' Attack Dice, and Guard in the open, answers a Parley's question and a Size Up truthfully, and rules only where this chapter's *Rulings* paragraph says.

### Acts in this chapter

ADR-0024, limit 12, keeps the tracked values as an index of what soldiers change by acting, no longer a gate: an act that matches no value is ruled on (Chapter 2, section 2.9). The acts this chapter lets a soldier choose are:

| Act | Entry | Tracked value |
|---|---|---|
| The Leg roll | `spot`, `survive`, `endure`, or `ride` | `leg-outcome` |
| The camp roll | `survive` | `camp-outcome` |
| The Straggler's Endure roll | `endure` | `hazard-outcome` |
| A Requisition roll | `persuade` or `recall` | `requisition-grant` |
| Size Up on the quartermaster | `size-up` | `ledger-lower` |
| Sneak for the Ambush | `sneak` | `ambush-set` |
| Fight, including a Grapple | `fight` | `foe-harm`, `held-set` |
| Shoot, including a fired flare | `shoot` | `foe-harm` |
| Reload | `reload` | `firearm-load` |
| Release | `release` (new, decision batch 8, 8-12) | `held-end` |
| Break Free while Held | `break-free` | `held-end` |
| Block or Dodge against a Foe | `block`, `dodge` | `behavior-avoid` |
| Parley | `persuade` | `foe-yield` |
| Size Up a Foe group | `size-up` | `foe-intent-reveal` |
| A move in a Skirmish | none: a move | `position-change`, which also names Engaged and Apart |
| A Downtime Action | `downtime-action` (new, decision batch 8, 8-28) | `stress-lower`, `grief-lower`, `gear-restore`, `gas-restore`, `requisition-grant` |
| The Squad Action | `squad-action` (new, decision batch 8, 8-28) | `grief-lower`, `squad-recruit` |
| A called roll in a Waypoint scene | the entry marked `when_called` that the GM names, or the attribute alone | the value the act changes, or none, as the GM rules (Chapter 1, section 1.1) |
| An improvised act in a Skirmish | the model entry the GM names | the model entry's |
| A called roll in a Skirmish | the entry marked `when_called` that the GM names, or the attribute alone | none: nothing the Skirmish tracks (Chapter 1, section 1.1; decision batch 9, 9-36) |

These are procedure steps, table rolls, or menu choices of a procedure, not Catalog acts: the hazard and night hazard rolls, the route rolls, the Straggler's victim rolls, the infirmary roll, hunger, the Camp Relief, the Squadmate relief, a grant, a Foe's turn, attack, and Guard, whether by the foe rule or directed, breaking, and the end of a Skirmish.

### Rows and changes in earlier chapters

- **`data/character/action-catalog.yaml`:** `shoot` uses the firearm's Gear Dice outside a Titan Engagement and can fire a flare; `reload` loads a firearm outside a Skirmish and a Titan Engagement for 1 Shot; the new options `release`, `downtime-action`, and `squad-action`, with the tracked values `stress-lower`, `grief-lower`, and `squad-recruit`; `fight`, `shoot`, and `block` read the cancelling roll; `held-end`, `position-change`, and `stress-response-clear` name what they now cover.
- **`data/character/talents.yaml`:** the Skirmish readings of Hand-to-Hand, Blade Discipline, Carrying Voice, and Pry Loose.
- **`data/core/stress-changes.yaml`:** the `camp-relief` and `skirmish-ends` reductions and the Downtime amounts. **`data/mind/fear-rolls.yaml`:** the `first-human-kill` trigger and who rolls for `comrade-dies` in a Skirmish. **`data/mind/grief.yaml`:** Grief lost in Downtime.
- **`data/harm/healing.yaml`, `treat-injury.yaml`, `death-rolls.yaml`, `engagement-end.yaml`:** the Night Camp's day, the Downtime days, the infirmary roll, a Skirmish's turns and end steps, and the care windows each one holds.
- **`data/gear/standard-issue.yaml`, `items.yaml`, `horses.yaml`, `squad-supply.yaml`:** the issues before an Expedition and at a Depot, the kept item handed in at an exchange, Maintain Gear, firearms' wear, mounting on a Leg, the flare fired at a person, and rations as a column of the stock table.
- **`data/engagement/engagement-setup.yaml`:** a hazard row names what the setup table otherwise rolls.
- **Chapters 1, 3, 4, and 5:** pointer sentences in sections 1.9, 3.4, 3.5, 3.6, 3.12, 3.15, 3.16, 4.1, 4.5, 4.9, 4.10, and 5.1.

> **Design note (decision batch 7, 7-18):** One chapter holds the three subsystems because they share the Catalog changes, the Downtime that Requisition lives in, and the Prowlers row that joins the night to the Skirmish; three chapters would triple the pointer sentences.

---

## Example: a night at Far

*The numbers in this example are for illustration only. The rows follow the data files at the time of writing; if the files change, the files govern.*

The Squad has ridden its second Leg of the second day, to a forest Waypoint at Far. Four player characters are on the Expedition, and Squad Supply holds 4 rations.

- **The camp roll.** The players choose Private Oskar Wendt, who rolls Survive: Instinct 3 and Stress 2, with Private Mila Brandt Helping, spending nothing. No die shows a 6. Oskar Pushes, Mila Covers, and the Push shows no 6 either. The camp roll fails.
- **Rations.** The Squad spends 1 ration and holds 3. The camp does not meet hunger, but the failed camp roll gives no Camp Relief.
- **The night hazard.** The D6 shows 5. Far adds 1 and the failed camp roll adds 1, for 7: Prowlers. At Far, a Skirmish begins against three Bandits who have the Ambush and carry firebrands in place of clubs.
- **Setting out.** Each Bandit rolls for its weapon: Bandits 1 and 2 roll 2 and 3, so they carry firebrands, and Bandit 3 rolls 5 and carries a knife. Every soldier is Apart from every Bandit. The Foes have the Ambush, so the Squad does not roll Sneak.
- **Round 1.** The Bandits' card comes up first, since they have the Ambush. The lowest card among the soldiers is Mila's.
  - Bandit 1 has no candidate Engaged with it and no firearm, so it closes in on Mila and Fights her with its firebrand. It rolls 4 Attack Dice and 2 more for the Ambush, since Mila has not yet acted: two 6s. The Ambush leaves the attack unanswered, so Mila makes no Reaction, and both successes are net. The firebrand deals 1, plus 1 for the second Net Success: 2 Burn damage. Mila's Health of 4 falls to 2 current Health.
  - Bandits 2 and 3 do the same against Mila, whose card is still the lowest. Bandit 2's six dice show one 6: 1 Burn damage, and Mila is at 1. Bandit 3's six dice show no 6, and its knife does nothing.
- **Oskar's card.** Oskar closes in on Bandit 1 and Fights it with the Blade Set in his handles: Strength 4, Hand-to-Hand 1, Gear Dice 1, and Stress 3. Bandit 1 has acted, so he gains no Bonus Dice from the Ambush. He rolls three 6s. Bandit 1 rolls its Guard of 3 dice: one 6, which cancels one success. Two Net Successes land: the Blade Set deals 2, plus 1, for 3 Cut damage. Bandit 1's Health of 3 falls to 0, and it is dead.
  - Oskar has never killed a person, so he makes the Fear Roll for a first human kill once the kill resolves.
  - One Bandit is out of the Skirmish, which reaches the Bandits' Grit of 1. The group breaks: Bandits 2 and 3 become Apart from every soldier at once, take no further turn, and leave at the end of the round.
- **The end.** No Foe is left, so the Skirmish ends. Chapter 3's end steps run with "Skirmish" in their place. Every soldier who took part loses 1 Stress. Mila holds no Critical Injury, so there is no aftermath roll or Death Roll. The care window holds nothing to treat. Bandit 1's firebrand is not a gear item, so nothing is shared out.
- **The day passes.** After the Night table's row is resolved, a day passes. Its care window has every soldier on the Expedition in its scope. Then Mila gets back the 3 Health she lost to damage.
