# Chapter 5: Titan Engagement

This chapter covers the Titan Engagement:
- how one starts;
- the field of zones it is fought over, attachments, Positions, and moves;
- the round and its initiative cards;
- how a Titan strides and acts from its Behavior Table;
- Attention;
- how soldiers harm and kill Titans;
- Read and Call It;
- the Grab;
- Background Titans, the retreat clock, and the retreat;
- how a soldier leaves and how a Titan Engagement ends;
- Squad Tactics.

It builds on:
- **Chapter 1:** dice pools, Help, Covering, Bonus Dice, turns, actions, and Reactions.
- **Chapter 2:** the Action Catalog, Talents, Squadmates, and Wings.
- **Chapter 3:** Critical Injuries, Down, Fear Rolls, Grief, and the steps that follow the end of a Titan Engagement.
- **Chapter 4:** ODM Gear, gas, airborne, horses, falls, and carrying.

The rows and pointers this chapter needs in Chapters 1 to 4 are applied in those chapters' own files, as OQ-90 lists (section 5.14).

Later rules this chapter only refers to:

- **Chapter 6, Standard Titans,** which applies this chapter's rules to the playable Titans:
  - each Titan's stat block and Behavior Table, in the format of section 5.4 (`data/titans/`, sections 6.2 to 6.5);
  - every harming entry's Injury Location, listed in its effects (section 6.1);
  - the Sprinting Abnormal and its own Attention Ladder (`data/titans/index.yaml`, `ladders`; section 6.5).
- **Chapter 7, Playtest rules:** the Leg Hazard and Night table rows that begin Titan Engagements and name their starting Positions, Focus Titan, and Background Titans, and the Waypoint kinds that name their field rating (section 7.1).
- **Not yet written:**
  - Mission Briefs, which may name a Titan Engagement's setup;
  - Chases;
  - Operation Frames;
  - Shifters;
  - the Squad Points and Rank rules, which may let a Squad hold more Squad Tactics;
  - Research Points earned from Reads.

**Tables.** Every table, procedure, and data format in this chapter is a YAML file in `data/engagement/`. Those files are the only source of truth (ADR-0012). The interim setup table and the three fields (section 5.1), the attachments, the derivation of Positions, the steps, anchors, Carry costs, and Terrain Traits of every Anchor Rating, and the zone effects (section 5.2), and the Stride table (section 5.4) are rendered from them by `tools/render/render.py`, between `BEGIN RENDERED` and `END RENDERED` markers that name each block's source file; nothing between the markers is written by hand, and `render.py check` fails if a rendered block and its YAML differ. Chapter 6 renders the Titans' stat blocks and Behavior Tables.

| File | What it holds |
|---|---|
| `zones.yaml` | The three fields and their numbering, attachments, the derivation of Positions, moves over zones, the Flight's Carry costs and limit, the Stride's route, placement, the entry zone, and zone effects (ADR-0029) |
| `positions.yaml` | The Positions and how they are derived, what changes one, moves, the Flight, what a Stride carries, where a fall lands, two Focus Titans, horses and left items, a corpse, and leaving |
| `anchor-ratings.yaml` | Each zone's Anchor Rating: its steps and which kinds of move make them, its anchors, its Carry cost, how it is wrecked, Momentum, and the mounted charge |
| `round.yaml` | Initiative cards, Wings, the swap step, the order of play, the end steps, and the GM's tracker |
| `size-classes.yaml` | Tempo, Nape Depth, Regeneration clock, Toughness, Attack Dice, the Heave rating, and the Stride by Size Class |
| `titan-format.yaml` | The stat block, the Behavior Table, entry fields, tier rules, Titan Dice, and the closed list of effect types |
| `behavior-procedure.yaml` | Rolling the Next Behavior and resolving a Titan's card, its Stride included |
| `attention.yaml` | The Attention Ladder, its tests and flags, Draw Attention, Break Attention and its decoys, and the Abnormal ladder format |
| `titan-harm.yaml` | Body Parts, Toughness, Broken, a grounded Titan, Nape strikes, Openings, Regeneration, a Titan's death, steam, and the falling Titan with Pinned, corpse heat, Heave, and cutting free |
| `read.yaml` | Read, its facts, and Call It |
| `grab.yaml` | The Grabbed state, the Grab, its countdown, the ways out, and release |
| `engagement-flow.yaml` | Starting a Titan Engagement, witnesses, and ending one |
| `background-titans.yaml` | Background Titan clocks, entry, and the retreat |
| `engagement-setup.yaml` | The interim setup table: the field, its ratings, and the Titans |
| `squad-tactics.yaml` | Squad Tactics |
| `tuning.yaml` | The ADR-0014 figures, the reference Titan the simulations used, and which values are simulator starting values |

Where the ADRs left a question open, the rule below cites its entry in `docs/rules/OPEN-QUESTIONS.md` as (OQ-nn). Every entry this chapter cites is decided in `docs/rules/DECISIONS-2026-09-14.md`: this chapter's own entries, OQ-74 to OQ-90 and OQ-95 to OQ-98, under *Batch 3* (2026-09-14), with OQ-50, OQ-79, OQ-81, OQ-89, and OQ-97 as revised under *Batch 3b*, OQ-81 again under *Batch 3c*, OQ-111 under *Batch 3d* (2026-09-15), OQ-81 and OQ-111 as revised under *Batch 3e* (2026-09-15), which gave every Attention flag one lifetime and settled the nearest rung, and OQ-81 again with OQ-104 and OQ-107 under *Batch 4*, which left a tie no card can break held by nothing, narrowed the current-holder test to a holder not at Distant, and decided the setup table's Abnormal roll and a card's later effects on a target who has died. *Batch 4b* (2026-09-15) made hooked into its body the first rung of every Attention Ladder, said that a Titan entering mid-round after a flare is evaluated with that round's cards, and read the prepared-Squad target under its baseline policy, with the four-striker Squad reported beside it and logged as an open question (OQ-112). *Batch 5* (2026-09-15) put the retreat's forced move before the action (OQ-119), gave every Titan Engagement a retreat clock that ends a fight nobody ends (OQ-126), kept the Positions held when the last Focus Titan died for the end steps (OQ-122), read each fall relative to one Focus Titan (OQ-123), put a Grab's hold before its crush (OQ-124), required a Position other than Distant for Draw Attention (OQ-113), and set how closely each tuning target must be met (OQ-127). *Batch 5b* (2026-09-15) decided that a lift comes before the retreat's forced move (OQ-119), that no Nape strike is made during a retreat (OQ-129), that a soldier left behind has their left items leave play, and that the setup table's Size Class roll is made for each Background Titan as the YAML gives it (OQ-131). *Batch 8* (2026-09-15) had every harming or terrorizing entry roll Attack Dice as Titan Dice in the open, with the dodge cancelling their successes and a roll of 0 whiffing against everyone (OQ-145), and added steam, the falling Titan, Pinned, Heave, and the corpse (8-7, 8-9, 8-17, 8-18; OQ-138, OQ-146, OQ-151). The text states the decided rule, and the design notes give the reasons and the figures. The chapter meets the Chapter 5 constraints in `docs/rules/DECISIONS-2026-09-14.md` as follows:
- **Grabbed state:** its row forbids Help, Covering, and Reactions.
- **Grab steps and escapes:** the lift and devour are procedure steps. Reach and strike penalties are stated in data.
- **Definitions it owes Chapter 3:** witnesses, the ending, leaving, and a Down soldier's move are defined.
- **Tuning tests:** Attack Dice are keyed to the fixed needs that were tuned against the Rookie dodge, 3 dice per point (decision batch 8, 8-1), and the Jam test and the six Grab cells are shown in section 5.13. The probe figures there were measured with those fixed needs; the confirming run of the round 3 retune re-measured every verdict under Attack Dice, and every ADR-0014 target and every Chapter 6 band was Met, with one limit of the Sprinting Abnormal's bar Missed and logged as OQ-199 (section 5.13; Chapter 6, section 6.6; decision batch 8, 8-14 and 8-31; the round 3 retune, R6 and R7; OQ-145). Every ADR-0014 target is met as amended in decision batches 3, 3b, 3c, 3e, and 5 (OQ-79, OQ-81, OQ-95, OQ-98, OQ-127), each under its baseline policy and read with batch 5's tolerances; ADR-0014, as amended in decision batch 4b, reads the prepared-Squad target under the baseline Squad, with the four-striker row reported beside it (section 5.13; OQ-112).

**Rulings.** In a Titan Engagement the GM rules on three things, each before the dice are rolled:
- **Circumstances on the soldiers' rolls.** Standard is the core assumption. Each zone's Anchor Rating, zones and attachments, Positions, Openings, a grounded Titan, Call It, the Attention restriction, and every penalty a soldier carries already price the fight. The GM names another step (Chapter 1, section 1.4a) only for something no rule prices: rain on the rooftops, smoke over a burning district, full dark, ice, a gale. These are examples, not a list. A step named for a condition applies to every soldier's roll that the condition touches while it lasts, the dodge and the Nape strike included, and the GM says so once ("the rain makes every roll with ODM Gear Hard until it stops", which is every roll whose Gear Dice come from ODM Gear) rather than judging each roll again; when a further condition touches a roll under that step, the GM names one step for that roll weighing both, and steps never add (decision batch 9, 9-4 and 9-26; `data/core/circumstances.yaml`, `in_titan_engagement`). A dodge takes the step in force when the Titan's card comes up, and none is named or changed for it after (decision batch 9, 9-25).
- **Framing.** Which Titan appears, the field's size, the field rating and any zone's rating, and the Background Titans with their clocks, as a Mission Brief could name them, before the Titan Engagement starts (section 5.1; decision batch 9, 9-15; decision batch 16, 16-33).
- **Improvised acts.** The model entry of an act no entry covers, or, when no entry of kind action could model it and it would change nothing the fight tracks, a called roll that spends the action (section 5.4; Chapter 1, section 1.1; decision batch 9, 9-8 and 9-36).

The GM applies everything else in this chapter as written and rules on none of it:
- a Titan's Attack Dice and its Titan Dice roll, which take no Circumstances;
- the Next Behavior once rolled, which entry a Behavior Table resolves, and against whom;
- the Attention Ladder, and who holds Attention;
- the Reaction procedure, the whiff, the Critical Injury's rider, and the Grab and its countdown;
- whether a move is allowed, what a Flight's Carries cost, and where a soldier lands;
- the Stride: whether a Titan strides, how far, and by which route, ties included;
- where the Titan and the Squad start, and the entry zone of a Titan that enters;
- which zone a wreck or a falling Titan takes a rating step off;
- Nape Depth, Toughness, Regeneration, the Heave rating, and the Openings an entry creates;
- steam, the falling Titan, and corpse heat;
- when a Background Titan enters, the retreat clock's length, and when a Titan Engagement ends;
- a Squad Tactic's condition;
- a setup row once rolled;
- the Critical Injury, Stress Response, Fear Roll, Scar, Grief, and Death Roll tables.

A condition that would slow or blind a Titan reaches the table only through the soldiers' dice: a Titan mired to the knee makes the dodge against it Easy, named when it is mired and before its card comes up, or, in rain already named Hard, one step the GM names weighing both; it keeps its Attack Dice (decision batch 9, 9-26). The GM rolls each Next Behavior out of sight and keeps the tracker, and never re-rolls or changes a roll, a row, or a result once the dice are rolled (ADR-0024, limits 8, 14, and 16). What the GM applies as written outside this chapter is the list in Chapter 1, section 1.1, item 6.

---

## 5.1 Starting a Titan Engagement

**Sessions.** On an Expedition, Titan Engagements begin from the hazard rows of Chapter 7 (section 7.1). While no Expedition and no Downtime is under way, a session is a chain of Titan Engagements, each followed by its care window, and it opens with the interim day (Chapter 3, section 3.6) and then the interim issue (Chapter 4, section 4.9). When the table starts a Titan Engagement is scene framing, not a rule; how it starts, runs, and ends is (decision batch 5, OQ-120).

`engagement-flow.yaml` (`starting`) lists the steps in order:

1. The rule that begins the Titan Engagement names its field (its size, its field rating, and any zone's rating), one Focus Titan, any Background Titans with their clock lengths, and the length of its retreat clock. The GM's framing may name what that rule leaves unnamed, except the retreat clock's length (*Framing*, below). Anything neither names comes from `engagement-setup.yaml`. The retreat clock starts empty (section 5.10).
2. The field is generated: its size, its field rating, and each zone's rating, which is also that zone's start rating (*The field*, below). Every soldier's Momentum is 0 (section 5.2).
3. The Focus Titan is labelled A.
4. Its Body Parts start Intact, it has no Openings, its Regeneration clock is empty, and its hidden Next Behavior is rolled.
5. Focus Titan A stands in the centre zone, and the soldiers and horses are placed in the Squad's start zone, or as the starting rule names (`positions.yaml`, `placement`).
6. The Titan evaluates its Attention Ladder, with no cards dealt. If a rung picks out one soldier, that soldier holds its Attention from setup: the Straggler's victim, placed in the centre zone while every other soldier is in the start zone, is picked out this way (Chapter 7, section 7.1). Otherwise nothing holds it, and its first card turns it; when every soldier starts in the same zone, as in the start zone by default, a Squad of two or more starts that way (section 5.6; decision batch 4b, 4b-6).
7. Soldiers make the Fear Rolls for a first Titan Engagement and for an Abnormal (Chapter 3, section 3.12).
8. The Squad's Squad Tactics become unused.
9. Round 1 begins.

### The field

A Titan Engagement is fought over a small **field** of hexagonal **zones** (`zones.yaml`; ADR-0029; decision batch 16, 16-2). A zone is about a Titan's reach across. Each zone has a number, its own **Anchor Rating**, whatever stands in it, and its effects. The numbers run column by column from the left and top to bottom within a column, so one number names one zone on the Foundry board, on the GM's tracker, and on the printed field.

- **Three sizes.** The **Standard field** of 13 zones is the default. The **Skirmish field** of 7 zones and the **Set piece** of 19 are used when the starting rule or the GM's framing names them.
- **Adjacent** zones share an edge. The distance between two zones is the fewest zone steps from one to the other, and a zone's **ring** is its distance from the centre zone.
- **Edge zones** have fewer than six neighbours on the field: every zone but the centre on the Skirmish and Standard fields, and the twelve zones of ring 2 on the Set piece. **Off field** is everywhere beyond them; a soldier who steps off field has left the Titan Engagement (section 5.11).
- **A zone holds anything.** Any number of soldiers, horses, Focus Titans, and corpses share a zone, and nothing in a zone blocks a move, a Flight, or a Stride. Two Focus Titans may stand in one zone, and each derives its own Positions (`occupancy`).
- **Height is not modelled.** A zone has no height of its own. A fall's height comes from the attachment, from a Giant Forest zone, and from a Large Titan, as Chapter 4 reads it (`elevation`; decision batch 16, 16-31).

The field exists only in a Titan Engagement. A Skirmish keeps Engaged and Apart, and a Chase will keep its own bands.

<!-- BEGIN RENDERED: zone-fields from data/engagement/zones.yaml -->
`[n]` is the centre zone, where Focus Titan A starts; `(n)` is the Squad's start zone. Two zones that touch are adjacent.

**Skirmish field**, 7 zones. Centre 4, the Squad's start zone 5. Edge zones: 1–3, 5–7.

```
         3
   1           6
       [ 4]
   2           7
       ( 5)
```

**Standard field**, 13 zones. The default. Centre 7, the Squad's start zone 8. Edge zones: 1–6, 8–13.

```
   1           6          11
         4           9
   2         [ 7]         12
         5          10
   3         ( 8)         13
```

**Set piece**, 19 zones. Centre 10, the Squad's start zone 11. Edge zones: 1–4, 7–8, 12–13, 16–19.

```
               8
         4          13
   1           9          17
         5          14
   2         [10]         18
         6          15
   3         (11)         19
         7          16
              12
```
<!-- END RENDERED: zone-fields -->

> **Design note (ADR-0029; decision batch 16, 16-2):** Before zones a soldier had no location, only a relation to each Titan: two Titans meant two facts about where one soldier stood, "Distant" was the same place everywhere, and terrain between two soldiers could not exist. The field gives everyone one place. Positions are kept and derived from it (section 5.2), so every Behavior Table requirement and every rung of the Attention Ladder still reads exactly as written. The 13-zone layout is the only 13-zone field symmetric about both axes around one centre, and the fixed numbering is what lets the Stride's tie-break, the entry zone, and the retreat be read off a printed sheet in a second.

### Who takes part, and where they start

- **Who takes part.** The soldiers the starting rule names. If it names none, every living soldier of the Squad on the Expedition, or every living soldier of the Squad when no Expedition is under way.
- **Where they start.** Focus Titan A stands in the centre zone. Every soldier who takes part is in the Squad's start zone, the zone directly below the centre, with attachment Ground (`positions.yaml`, `placement`; decision batch 16, 16-7).
  - Mounted soldiers stay mounted and dismounted soldiers stay dismounted, and no one is airborne.
  - A dismounted soldier's horse is in the start zone.
  - A starting rule that names a starting Position for a named soldier places them by it: **In Reach** is the Focus Titan's zone with attachment Ground, and **Distant** is the Squad's start zone. So Chapter 7's Straggler row puts its victim in the centre zone and everyone else in the start zone, and Overrun puts the whole Squad in the centre zone (section 7.1).
- **Drives.** A starting zone is placed by a rule, not by the soldier's own move, so it never meets a Drive's Position trigger until the soldier's own move changes it (OQ-23).

> **Design note (OQ-75; decision batch 16, 16-7):** Everyone starts one zone out. A Titan Engagement opens when Titans are sighted, not when they are already in reach, and one zone away keeps the two moves to the Nape that Distant always meant. The start zone is an edge zone on every field, so a soldier who starts there can leave with one move, as a soldier at Distant could. A Titan with a Stride of 2 closes on its first card, so round 1 is not what it was before zones; the rerun reads round 1 on its own (section 5.13).

### Framing

The GM frames a Titan Engagement as Command would, and as a Mission Brief could. Before any setup roll is made, the GM may name any of these that the starting rule leaves unnamed (decision batch 9, 9-15; decision batch 16, 16-33):
- **the Focus Titan:** any Titan in Chapter 6, standard or Abnormal;
- **the field size:** the Skirmish field, the Standard field, or the Set piece;
- **the field rating,** and **the rating of any zone,** which brings that zone's anchors, Carry cost, and Terrain Trait with it (section 5.2);
- **the Background Titans:** none, one, or two, which Titans they are, and each one's clock of 4, 6, or 8 segments, the counts and lengths the setup table uses (decision batch 9, 9-34).

A starting rule may name a whole field in one line, such as `field: {size: standard, rating: wooded, zones: {3: open, 12: urban}}`; every zone it does not name is generated (`zones.yaml`, `named_field_format`).

What the GM names is never rolled, so no `medium_abnormal` roll is made for a Focus Titan the GM names, and no terrain roll is made for a zone the GM rates. The setup table fills whatever the starting rule and the GM leave unnamed, and it is the whole setup when the GM names nothing. A value a starting rule names, such as a hazard row's, stands, and the GM never swaps it. These stay closed (ADR-0024, limit 8):
- the Focus Titan starts in the centre zone and the Squad in the start zone, unless the starting rule names other starting Positions (above);
- the GM never names a soldier's zone or attachment, a Titan's zone, a Stride's length or route, a tie, an entry zone, a Carry cost, or which zone a wreck takes;
- the retreat clock is 8 segments unless a rule names its length;
- a setup row, once rolled, stands;
- the Fear Rolls of the start, for a first Titan Engagement and for an Abnormal, are made as the list gives them.

> **Design note (decision batch 9, 9-15; OQ-167):** Choosing the Titan and the ground is Command's authority, and a Mission Brief was always going to carry it; the playtest rules lacked only a place to put it. The warning is about lethality. The setup table's mix is what Chapter 6's bands and section 5.13's rows were measured against, so a table that frames Large Titans with Background Titans every time plays above the tuned lethality. The playtest logs every framed start that departs from the setup table, and the retune reads those fights apart from the rest (OQ-167). Rating a zone is the same authority at a finer grain: a Mission Brief that says "the ruined chapel on the ridge" names one zone Urban.

### The interim setup table

Until Mission Briefs and Expeditions name a Titan Engagement's setup, `engagement-setup.yaml` fills whatever the starting rule and the GM's framing leave unnamed:
1. **Field size.** The Standard field. Nothing is rolled.
2. **Field rating.** Roll D6 for the field rating, the Anchor Rating the field is generated from. A Waypoint's kind names it on an Expedition (Chapter 7, section 7.1).
3. **Zone terrain.** The centre zone and the Squad's start zone take the field rating. Every other zone, in number order, rolls D6 on the zone terrain table: 1, one rating sparser than the field rating; 2 to 5, the field rating; 6, one rating denser. Each zone's start rating is the rating it takes here.
4. **Focus Titan.** Roll D6 for its Size Class. The Focus Titan is the standard Titan of that Size Class (`data/titans/index.yaml`, `standard_titans`; Chapter 6). On Medium, roll D6 on `medium_abnormal`: on a 6 the Focus Titan is the Sprinting Abnormal instead (Chapter 6, section 6.5).
5. **Background Titans.** Roll D6 for Background Titans and their clock lengths. Then, for each Background Titan the row gives, in the order it lists the clocks, roll D6 on the Size Class table below. Each Background Titan is the standard Titan of the Size Class it rolls (Chapter 6), and the `medium_abnormal` roll is never made for one (`steps`, `background-titans`; decision batch 5, OQ-131).
6. **Retreat clock.** Give it the length the table names for every Titan Engagement it sets up (below). Nothing is rolled for it.

A value the starting rule or the GM's framing names is never rolled.

<!-- BEGIN RENDERED: interim-setup from data/engagement/engagement-setup.yaml -->
**Field rating (D6)**

| D6 | Field rating |
|---|---|
| 1 | Open |
| 2 | Sparse |
| 3–4 | Wooded |
| 5 | Urban |
| 6 | Giant Forest |

**Zone terrain (D6), for every zone but the centre and the Squad's start zone, in number order**

| D6 | The zone's rating |
|---|---|
| 1 | one rating sparser than the field rating |
| 2–5 | the field rating |
| 6 | one rating denser than the field rating |

**Sparser and denser, by rating**

| Rating | One sparser | One denser |
|---|---|---|
| Open | Open | Sparse |
| Sparse | Open | Wooded |
| Wooded | Sparse | Giant Forest |
| Urban | Wooded | Urban |
| Giant Forest | Wooded | Giant Forest |

**Size Class (D6), for the Focus Titan and for each Background Titan**

| D6 | Size Class | Standard Titan |
|---|---|---|
| 1–2 | Small (3 to 5 m) | Standard Small Titan |
| 3–5 | Medium (6 to 10 m) | Standard Medium Titan |
| 6 | Large (11 to 15 m) | Standard Large Titan |

**On Medium: `medium_abnormal` (D6)**

| D6 | Focus Titan |
|---|---|
| 1–5 | Standard Medium Titan |
| 6 | Sprinting Abnormal |

**Background Titans (D6)**

| D6 | Background Titans | Clock lengths, in order |
|---|---|---|
| 1–2 | none | none |
| 3–4 | 1 | 6 |
| 5 | 1 | 4 |
| 6 | 2 | 4, 8 |

**Retreat clock:** 8 segments, for every Titan Engagement this table sets up (no roll).
<!-- END RENDERED: interim-setup -->

The Abnormal roll on a Medium result makes the Sprinting Abnormal the Focus Titan of 1 Titan Engagement in 12 that the table sets up (decision batch 4, OQ-104).

> **Design note (OQ-87):** The setup table is a stopgap, like Chapter 4's interim issue, and the default: it sets up whatever no starting rule and no framing names, and every figure in section 5.13 was measured with it (ADR-0024, limit 10; decision batch 9, 9-15). Its Background clock lengths are simulator starting values, measured against a retreat rate per Titan Engagement, and they are the second fallback if rounds against two Focus Titans run long (section 5.3). The retreat clock's length is fixed rather than rolled, so every Titan Engagement the table sets up becomes a retreat by the same round if nothing has ended it first (section 5.10; decision batch 5, OQ-126).

> **Design note (decision batch 16, 16-6; OQ-202):** A field of one rating everywhere has no route to choose, and choosing a route is the point of having a field. The terrain roll gives about a third of the Standard field's eleven rolled zones another rating, and it keeps the Titan's zone and the Squad's zone at the field rating, so the first approach is made on the ground ADR-0014 tuned. The mix was chosen to close a gap in the design and then measured by the zone retune: a sparser or wider mix and a uniform field each move the deaths figures by at most 0.003, so the mix stands (OQ-202; Z4).

---

## 5.2 Zones, attachments, Positions, and moves

### Attachments

A soldier on the field is in exactly one zone and holds exactly one **attachment**, which says where they are within it (`zones.yaml`, `attachments`; decision batch 16, 16-8). Four attachments name one **body**, a Focus Titan or a corpse, which must be in the soldier's zone. Ground and Anchored name none, and a soldier who holds one of them is **free**: only a free soldier can make a zone step.

<!-- BEGIN RENDERED: attachments from data/engagement/zones.yaml -->
| Attachment | Names a body | Free | Position relative to that body | Where the soldier is |
|---|---|---|---|---|
| Ground | no | yes | names none: In Reach of every body in the zone | On the ground in their zone, on foot or mounted. |
| Anchored | no | yes | names none: In Reach of every body in the zone | On their lines in the terrain of their zone. Only a Flight that ends free gives it. |
| On Body | yes | no | On Body | Hooked into a body in their zone or standing on it, anywhere but the Nape. |
| Blind Spot | yes | no | Blind Spot | Anchored to terrain in the zone of the Focus Titan or corpse it names, out of its sight with its Nape in reach, and not on it. It has no facing. |
| Grabbed | yes | no | On Body | Held by the Focus Titan it names. |
| Pinned | yes | no | In Reach | Pinned under the body it names. |
<!-- END RENDERED: attachments -->

- **Airborne and mounted are not attachments.** They are the states Chapter 4 defines, and they sit beside the attachment: an airborne soldier at Blind Spot is still at Blind Spot, and a mounted soldier is on the Ground. A carried soldier's zone and attachment are their carrier's.
- **The detach rule.** When an attachment to a body ends by a rule that is not a fall or a move, the soldier's attachment becomes Anchored if they are airborne and Ground if not, in the same zone, and nothing else about them changes (`detach_rule`). A Stride that leaves a soldier at Blind Spot, a Titan's death, and Fall Back all use it.

### Positions

A soldier on the field holds a **Position** relative to every Focus Titan and every corpse: Distant, In Reach, On Body, or Blind Spot (`positions.yaml`, `positions`). A Position is never written down. It is **derived** from the soldier's zone and attachment at the moment a rule reads it, by the first row of this table that applies (`positions.yaml`, `derivation`; decision batch 16, 16-9):

<!-- BEGIN RENDERED: position-derivation from data/engagement/zones.yaml -->
| Order | For one soldier and one body, if the soldier's | Position |
|---|---|---|
| 1 | attachment on-body or grabbed names the body | On Body |
| 2 | attachment blind-spot names the body | Blind Spot |
| 3 | attachment pinned names the body | In Reach |
| 4 | in the body's zone | In Reach |
| 5 | in another zone | Distant |

The first row that applies gives the Position. A soldier off field, or dead, holds no Position.
<!-- END RENDERED: position-derivation -->

A soldier "holds a Position in the Titan Engagement" while they are on the field. That is the test Chapters 1 and 3 use for being in a Titan Engagement. A soldier who has left, or is dead, holds none.

- **Distant** is another zone than the Titan's, out of its reach. A Behavior Table entry may still name Distant in its Position requirement, as a running Abnormal's does, and it then resolves at a holder in any other zone (Chapter 6; decision batch 5, OQ-125; decision batch 16, 16-18).
- **In Reach** is the Titan's own zone: on the ground or on anchors beside it, or Pinned under it.
- **On Body** is hooked into the Titan's body or standing on it, anywhere but the Nape, or held in its hand. It is literally on the thing.
- **Blind Spot** is out of the Titan's sight with its Nape within reach, **anchored to terrain in the Titan's zone and not on it**. The soldier is anchored to a tree or a roof, hanging from it on their lines or standing on it, and not touching the Titan: it is a place in the world, not a place on the monster. Whether they are airborne follows the move that brought them there, as anywhere: an ODM move leaves them airborne, so a Jam drops them (Chapter 4, section 4.3) and a falling Titan's body misses them (section 5.7); only the Urban Terrain Trait says the roof holds them. It is the only Position a Nape strike can be made from (ADR-0010).

That last clause is worth reading twice, because everything about the Blind Spot follows from it. Steam at a Regeneration fill burns the soldiers On Body and not those at Blind Spot, because Blind Spot is not on it (section 5.7). The Urban Terrain Trait says a Blind Spot soldier is anchored to a roof and is not airborne, because there they are standing on one; in every other zone they hang from their anchor and stay airborne. Whether a Blind Spot exists at all, while the Titan stands, is the answer of the ground in the Titan's zone and not the Titan's: in an Open zone there is nothing to anchor to and there is no Blind Spot (*The three Position maps*, below; decision batch 13, 13-6). A Blind Spot also stays behind when the Titan strides away, because the tree does not walk with it (*The Stride*, section 5.5).

**Blind Spot has no facing.** A Titan on the field faces no direction that any rule reads. Blind Spot is available in a zone whose rating has a step reaching it, or where the body is grounded, and any number of soldiers may hold it. "Behind the Titan" is its fiction; the Foundry board draws a rear marker on the side away from the Titan's Attention holder, and that is display only (`positions.yaml`, `positions`, `blind-spot`, `no_facing`; decision batch 16, 16-10).

**Two soldiers.** Where a rule asks whether two soldiers hold the same Position, it reads whether they are **in the same zone**. Where it counts Position steps between two soldiers, it counts zones: **one step is the same zone or an adjacent zone**, and two steps is within two zones (`zones.yaml`, `between_soldiers`; decision batch 16, 16-11). So:
- **Help, Covering, Rally,** the Stress change on a comrade within one step, a Fear Roll's witnesses within one step, and the Talents that widen a reach by a step read the same zone or an adjacent one (Chapter 1, sections 1.5 and 1.8; Chapter 3);
- **Treat Injury, Lift Comrade, Pass Item, Take Item, Field Repair on a comrade's item,** Pry Loose, aftermath rolls, and a retreat's stay read the same zone.

No roll against a Titan names a Titan to compare relative to, and the old comparison lookup is retired. Soldiers who have left follow section 5.11.

**What changes a Position.** A Position is derived, so it changes exactly when a soldier's zone or attachment changes, or when a body's zone does. The list of rules that do that is closed (`positions.yaml`, `changes_to_position`; decision batch 13, 13-5; decision batch 16, 16-32), and it is headed by the principle that carries the most weight at the table:

> **An action never changes a Position.** Only the soldier's own move changes their zone or attachment, plus the rules listed here.

| What | Effect |
|---|---|
| The soldier's own move | Its zone steps and attachment steps, a mount or a dismount, or leaving. An ODM move is a Flight |
| Letting go | Instead of a move: a fall, landing Ground in the same zone |
| Any fall | The soldier stays in their zone and lands Ground, so they hold In Reach relative to a body there |
| A Fear Roll's forced move | One step at the start of the soldier's next turn (Chapter 3, section 3.9) |
| A Grab landing | Attachment Grabbed naming the holding Titan, so On Body relative to it; the soldier moves with it (section 5.9) |
| Being freed from a Grab | Ground in the holding Titan's zone, with a fall first if they had been lifted (section 5.9) |
| A Behavior Table knock loose | The target falls (section 5.4) |
| A Focus Titan's Stride | The Titan's zone changes; soldiers On Body or Grabbed go with it, soldiers at its Blind Spot stay and detach (section 5.5) |
| A zone becoming Open under a standing Focus Titan | Blind Spot relative to it becomes On Body, and every Anchored soldier in the zone lands Ground; not a fall (*Wrecking*, below) |
| A Titan becoming a Focus Titan | It stands in its entry zone, and every Position relative to it is derived (section 5.10) |
| A Focus Titan dying | Its body is a corpse in its zone; every attachment naming it but Pinned detaches (*A corpse*, below) |
| A Titan's body coming down, by its death or by a living Titan becoming grounded | Every soldier On Body or at Blind Spot relative to it who is not airborne lands Ground in its zone, whether they Leap Clear or are Pinned; an airborne soldier swings clear and keeps their attachment (section 5.7) |
| The Fall Back Squad Tactic | At the wings step, a soldier at On Body or Blind Spot may take the detach rule's attachment instead, by their own player's choice; not a fall (section 5.12) |
| A grounded Titan standing up | In an Open zone only, a soldier at Blind Spot relative to it then holds On Body; not a fall (*A grounded Titan*, below) |
| Being carried | The carried soldier's zone and attachment are the carrier's (Chapter 4, section 4.7) |
| Starting placement, leaving, returning, a retreat's compelled moves | As each rule states (*sections 5.1, 5.10, and 5.11*) |

**Not on the list**, and this is the half nobody can see: the Nape strike, the Body Part strike, Break Attention, Draw Attention, Read, Heave, Treat Injury, Rally, and every other Action Catalog entry that is an **action**. None of them moves anyone, whatever it rolls. Three Catalog entries are not actions and are on the list above rather than here: Fly, which is the soldier's own move; Leap Clear, which is the Falling Titan's roll; and Mount or Dismount, which rides along with a move. Attention is not a Position either: a Titan turning its Attention onto a soldier, by the ladder, by a retarget (section 5.6), by a decoy, or by a flag, moves nobody, and neither does Frenzy; only the Stride that follows it moves the Titan. A wreck changes no Position except when it makes the Titan's zone Open. The GM never places a soldier and never names a step, a zone, or an attachment (ADR-0024, limit 8).

### Anchor Ratings, steps, and anchors

Every zone carries one **Anchor Rating**: Open, Sparse, Wooded, Urban, or Giant Forest (`anchor-ratings.yaml`; decision batch 16, 16-4). Its **rating** can fall during the fight, and its **start rating** is the one it was generated with. `anchor-ratings.yaml` gives each rating its **steps**, each a pair of Positions and the kinds of move that can make it:
- **On foot:** not an ODM move, and not mounted.
- **Mounted.**
- **ODM:** a move on the soldier's own ODM Gear (Chapter 4).

The Distant to In Reach row of a rating is read for a **zone step into** a zone of that rating: on foot and mounted say whether that kind of move may enter it, and ODM says whether a Flight may end free in it. Every other row is an **attachment step inside** a zone of that rating, with In Reach read as free (*Moves*, below).

Each rating also gives its zone its **anchors**, which cap the Momentum of every soldier in it, a **Carry cost** a Flight pays to enter it, and one **Terrain Trait**, in the second table below.

<!-- BEGIN RENDERED: position-steps from data/engagement/anchor-ratings.yaml -->
| Zone's rating | Step (either way) | Read as | On foot | Mounted | ODM |
|---|---|---|---|---|---|
| Open | Distant to In Reach | zone step into it | yes | yes | no |
| Open | In Reach to On Body | attachment step in it | no | no | yes |
| Sparse | Distant to In Reach | zone step into it | yes | yes | yes |
| Sparse | In Reach to On Body | attachment step in it | no | no | yes |
| Sparse | On Body to Blind Spot | attachment step in it | no | no | yes |
| Wooded | Distant to In Reach | zone step into it | yes | yes | yes |
| Wooded | In Reach to On Body | attachment step in it | no | no | yes |
| Wooded | On Body to Blind Spot | attachment step in it | no | no | yes |
| Wooded | In Reach to Blind Spot | attachment step in it | no | no | yes |
| Urban | Distant to In Reach | zone step into it | yes | no | yes |
| Urban | In Reach to On Body | attachment step in it | no | no | yes |
| Urban | On Body to Blind Spot | attachment step in it | no | no | yes |
| Urban | In Reach to Blind Spot | attachment step in it | no | no | yes |
| Giant Forest | Distant to In Reach | zone step into it | yes | yes | yes |
| Giant Forest | In Reach to On Body | attachment step in it | no | no | yes |
| Giant Forest | On Body to Blind Spot | attachment step in it | no | no | yes |
| Giant Forest | In Reach to Blind Spot | attachment step in it | no | no | yes |

**Anchors, Carry cost, and Terrain Traits, by zone**

| Zone's rating | Anchors (Momentum cap) | Carry cost to enter | Terrain Trait |
|---|---|---|---|
| Open | 0 | 2 | A mounted soldier's Break Attention gains 1 Bonus Die when the soldier is in an Open zone. The plain is the horse's. |
| Sparse | 1 | 1 | The first wreck a zone takes while its rating is Sparse does nothing, once per zone. One good tree survives. |
| Wooded | 2 | 0 | none |
| Urban | 3 | 0 | A soldier who holds blind-spot relative to a Focus Titan in an Urban zone is anchored to a roof and is not airborne, so a Jam does not drop them. |
| Giant Forest | 3 | 0 | Every fall that is not from a horse, in a Giant Forest zone, is raised one band. The Corps fights best here, and a Flight pays nothing to enter it. |
<!-- END RENDERED: position-steps -->

> **Design note (OQ-74, as revised by OQ-182 and decision batch 16):** The step rows are:
> - **Every rating:** Distant to In Reach, and In Reach to On Body.
> - **Every rating but Open:** On Body to Blind Spot.
> - **Wooded, Urban, and Giant Forest:** In Reach to Blind Spot as well.
> - **Sparse:** nothing joins In Reach and Blind Spot, so a soldier reaches the Nape by way of On Body.
> - **Open:** a Flight cannot end free in it, and nothing reaches Blind Spot while the Titan stands, because there is nothing to anchor to but the Titan.
>
> A mounted move makes only zone steps, and never into an Urban zone. The rows are unchanged by zones: what used to be the whole battlefield's steps is now each zone's, so a fight over mixed ground has a Blind Spot in one zone and none in the next. Three rows were withdrawn in decision batch 10, the two that called for a Fly roll of their own and Giant Forest's Distant to Blind Spot, so no zone reaches the Nape from another zone in one step (`anchor-ratings.yaml`, `history`). The prepared-Squad figures in section 5.13 were measured on the Wooded rows, which the interim setup table deals as the field rating 2 times in 6.

### The three Position maps

The step rows make one of three shapes inside a zone, and which shape a zone has is its rating's answer, not the Titan's. The maps are held in `anchor-ratings.yaml` (`position_maps`), read off the same step rows the table above renders; they add no step and change no row. In each, Distant is any other zone.

<!-- BEGIN RENDERED: position-maps from data/engagement/anchor-ratings.yaml -->
**Open** (anchors 0). There is nothing to anchor to but the Titan, so there is no Blind Spot at all while the Titan stands, and no Nape strike can be made against a standing Titan on a plain.

```
Distant --- In Reach --- On Body
```

**Sparse** (anchors 1). One good tree. Nothing joins In Reach and Blind Spot, so the Nape is reached by way of the body.

```
Distant --- In Reach --- On Body --- Blind Spot
```

**Wooded, Urban, and Giant Forest** (anchors 2 to 3). From In Reach a soldier may go onto the body or straight to the Blind Spot, and may move between those two. This is why the Corps fights in forests and towns.

```
                      /--- On Body ----\
Distant --- In Reach -                 |
                      \--- Blind Spot -/
```
<!-- END RENDERED: position-maps -->

So "can a soldier go from In Reach to Blind Spot without going On Body first?" is answered **yes** in a Wooded, Urban, or Giant Forest zone, **no** in a Sparse zone, and **there is no Blind Spot** in an Open zone. Terrain decides whether the Squad can get behind the thing, which is why the Corps fights in forests, and on a mixed field it decides where along the way.

**A grounded Titan changes every map** (`grounded_titan`). Every step joining two of In Reach, On Body, and Blind Spot relative to it can then also be made on foot, and none of them mounted, so the shape holds and the ways of making it widen. In an Open zone a grounded Titan also gains an On Body to Blind Spot step, so the Open map becomes the Sparse chain and a Nape strike becomes possible on a plain at last. When the Titan has no Broken leg those permissions end, and a soldier who holds Blind Spot relative to it in an Open zone then holds On Body instead. A corpse counts as a grounded Titan for as long as it lies on the field, and for it they never end (*A corpse*, below).

### Moves

A **move** names where it ends: a zone, or off field, and an attachment (`positions.yaml`, `moves`; `zones.yaml`, `moves`; decision batch 16, 16-12). It is made of steps:
- **A zone step** goes from free in a zone to free in an adjacent zone, or off field from an edge zone, which is leaving (section 5.11).
- **An attachment step** stays in one zone and follows that zone's step rows among In Reach, On Body, and Blind Spot, with In Reach read as free and each attachment naming one body in that zone. A grounded Titan's and a corpse's permissions apply. There is no step from one body's attachment straight to another's: a soldier On Body of one Titan who wants the Blind Spot of a second in the same zone detaches first.

Which kind of move can make a zone step reads **the zone it enters**: on foot, always; mounted, into any zone but an Urban one, and off field; ODM, always, but a Flight never ends free in an Open zone (*Flight*, below).

<!-- BEGIN RENDERED: carry-costs from data/engagement/zones.yaml -->
| A Flight's step | Momentum it costs |
|---|---|
| The first step, of any kind | 0 |
| A zone step into an Open zone | 2 |
| A zone step into a Sparse zone | 1 |
| A zone step into a Wooded zone | 0 |
| A zone step into an Urban zone | 0 |
| A zone step into a Giant Forest zone | 0 |
| A step off field, from an edge zone | 1 |
| An attachment step | 1 |

**Carry limit:** at most 2 Carries on one Flight (OQ-200, decided by the zone retune, Z4). A Flight never ends free in an Open zone, and one that ends free ends Anchored.

**Mounted pace:** up to 2 zone steps and 0 attachment steps (OQ-200, decided by the zone retune, Z4). **On foot:** 1 step.
<!-- END RENDERED: carry-costs -->

- **On foot:** one step, a zone step or an attachment step.
- **Mounted:** up to two zone steps and no attachment step. The move ends on entering a zone that holds a standing Focus Titan, unless that zone is Open, where the rider may ride on through. A move can include one mount or one dismount, before or after its steps (Chapter 4, section 4.5). The mounted pace of two was measured by the zone retune and stands (OQ-200; Z4).
- **ODM:** a Flight (*Flight*, below). A mounted soldier's ODM move dismounts them first.
- **A move may change nothing,** as when a soldier stays where they are or only mounts. Moves change the tracked value `position-change`.

`positions.yaml` (`moves`) sets what particular soldiers' moves can do:

- **A Down soldier** can make one on-foot zone step, only out of a zone that holds a body into an adjacent zone that holds none, never off field, and not while Grabbed, carried, or Pinned. This settles the question Chapter 3 left to this chapter.
- **A Grabbed or carried soldier's** move changes nothing.
- **A Pinned soldier's** move changes nothing, and no rule moves them while they are Pinned, a Stride included (section 5.7; `pinned_soldier`; decision batch 8, 8-9).
- **Letting go.** A soldier at On Body or Blind Spot, not Grabbed or carried, may use their move to let go. They fall from that height (Chapter 4, `rule-named`) and land Ground in the same zone. It is how a soldier with a Jammed or empty harness gets off a Titan.
- **ODM use.** This chapter names no act as ODM use beyond Chapter 4's list. A Flight is ODM use twice over, an ODM move and a roll whose gear item is the soldier's ODM Gear, and it still makes one Gas Roll for the round (Chapter 4, section 4.3). A mounted charge is not ODM use.
- **Swapping a Blade Set** spends the move in a Titan Engagement (Chapter 4, section 4.4). A move can change nothing, so a soldier who refits stays where they are and keeps their action; what they give up is that turn's Flight.
- **A forced step.** A Chapter 3 Fear Roll result can move a soldier one step at the start of their next turn, toward Distant or toward the nearest comrade (`positions.yaml`, `moves`, `forced_step`; `data/harm/effect-types.yaml`, `forced-move`; decision batch 7, 7-8; decision batch 16, 16-28). A step toward Distant is one step by the retreat's first option (section 5.10); a step toward the nearest comrade lowers the number of zones between them. PROVISIONAL: a soldier who is already free in a zone that holds no body makes no step toward Distant (OQ-203). The step is a result, not the soldier's move: it spends nothing, it happens even on a turn spent in advance (decision batch 8, 8-13), and no step is made for a soldier who is Down, Grabbed, Pinned, or carried, or who has no such step to make. It never makes a soldier leave or let go. It is a step of the kind the soldier's move makes, on foot, mounted, or ODM, and it is **never a Flight**, because a Flight is the soldier's own ODM move: it is not rolled, pays no Carry, gives no Momentum, and sets no flag, whichever kind of step it is. An ODM forced step is still ODM use, so it makes that round's Gas Roll, and the soldier is airborne after it as after any ODM move (Chapter 4, sections 4.2 and 4.3; decision batch 10, 10-5, OQ-186).

> **Design note (decision batch 16, 16-12):** Reading the entered zone for a zone step is the design's "the rating of the zones involved" made exact, and it keeps every in-zone rule the ratings already made. The mounted pace is what lets a horse outpace a Titan on foot; without it a rider on Wooded ground covers one zone to a Medium Titan's two. The Down soldier's crawl keeps its old meaning: out of reach, and no further.

### Flight

**Every ODM move is a Flight** (`positions.yaml`, `moves`, `flight`; decision batch 16, 16-13). The soldier makes a roll for `fly` with their own ODM Gear as its gear item, and the roll decides what the Flight was worth, never whether it happened:

- **The first step happens whatever the roll gives,** and it costs nothing. It may be a zone step or an attachment step. A Flight needs nothing, so it never leaves a soldier short of the step an ODM move has always made.
- **Each further step is a Carry,** paid in Momentum: a zone step costs the Carry cost of the zone it enters (Open 2, Sparse 1, Wooded, Urban, and Giant Forest 0), a step off field costs 1, and an attachment step costs 1. A Flight makes **at most 2 Carries**. The limit was measured by the zone retune and stands (OQ-200; Z4).
- **A Flight never ends free in an Open zone.** In an Open zone its last step must be an attachment step onto a body there, or the Flight must go on out of it. A Flight that ends free ends **Anchored**.
- **Each success gives the soldier 1 Momentum,** up to the anchors of the zone the Flight starts in. Carry is spent from it during the move, and at the end of the move any Momentum above the anchors of the zone it ends in is lost.
- **Crossing a Titan's zone is seen.** A Flight crosses a zone when it enters that zone and leaves it again in the same move; the zone it starts in and the zone it ends in are never crossed. The soldier sets the loudest flag on every Focus Titan standing in a zone the Flight crosses, **whatever the roll gave**, unless they spend Momentum on Quiet (section 5.6). A corpse takes no flag.
- **On no successes the soldier comes in loud:** they set the loudest flag on every Focus Titan in the zone the Flight ends in, or, when there is none, on the Focus Titan nearest that zone, a tie going to the earliest label (section 5.6). Momentum spent on Quiet stops it.
- **The soldier is airborne** after a Flight, as after any ODM move (Chapter 4, section 4.2).
- **It is a soldier's roll like any other:** it takes Circumstances and Stress Dice and the Talents that name Fly, and it can be Helped, Pushed, and Covered as Chapter 1 states. A Pushed Flight wears the ODM Gear as any Pushed roll with that gear item does, and makes that round's Gas Roll three dice.
- **Gas.** A Flight is ODM use twice over, an ODM move and a roll whose gear item is the ODM Gear, and a soldier who used ODM Gear makes one Gas Roll for the round however many times they used it (Chapter 4, section 4.3).

A soldier whose ODM Gear counts as not had makes no ODM move at all, and so no Flight. Letting go is not an ODM move, so it is never rolled.

> **Design note (decision batch 16, 16-13):** The Carry costs are the terrain made into a price: nothing to hook on the plain, one good tree in Sparse ground, and a forest or a town where the wires carry you. The limit closes the gap those costs leave open, since a Flight through Wooded zones would otherwise cross the field for nothing; two Carries is the most a Flight could make on the tuned Wooded ground before zones, so the reference Flight keeps its reach. The Open ending is the old Open row, which gave ODM no Distant to In Reach step: there is nothing to hook, so the arc must land on something. The crossing flag is how a Titan sees a soldier fly past its face, and Quiet already bought silence for the whole turn, so leaving it in costs nothing new.

### Momentum

**Momentum** is a whole number each soldier holds, from 0 to their cap. It is public, and the sheet records it (`anchor-ratings.yaml`, `momentum`; Chapter 4, section 4.12).

- **Cap:** the anchors of the zone the soldier is in. When a soldier's zone changes, or its rating falls, a soldier whose Momentum is above the new cap loses the excess at once.
- **Gained:** 1 for each success on a Flight, up to the anchors of the zone the Flight starts in.
- **Lost:** all of it, at the Momentum end step of any round in which the soldier made no ODM move (section 5.3). A soldier who has left the Titan Engagement, who is Down, Grabbed, carried, or Pinned, or who dies, holds none.
- **Spent** at any point in the soldier's own turn, any amount at once, by the soldier's own choice. Carry is spent as part of the move it extends, and every other spend is declared before the roll it names.

What Momentum buys:

- **Carry:** one more step on a Flight, at that step's Carry cost (*Flight*, above).
- **Bite,** 1 point: 1 Bonus Die on a strike or a Break Attention the soldier takes this turn against a Focus Titan in the zone the Flight ended in.
- **Brace,** 1 point: 1 Bonus Die on the soldier's next dodge this round.
- **Quiet,** 1 point: the soldier sets no flag this turn, the loudest flag of a Flight with no successes and the crossing flag included. A flag already standing is not cleared.
- **Clean line,** 1 point: the soldier makes no Gas Roll for this round (Chapter 4, section 4.3).

Bite and Brace are Bonus Dice, so they are declared with every other source and fall under the cap of 4 (Chapter 1, section 1.7). The GM never grants, spends, or removes Momentum.

### Wrecking

A zone's rating falls; it never rises during the Titan Engagement (`anchor-ratings.yaml`, `anchors`; decision batch 16, 16-20). Every zone's rating is public and is on the GM's tracker (section 5.3).

- **A `wreck` effect** takes one rating step off the **Titan's own zone**: its rating becomes its rating's sparser one, Urban and Giant Forest to Wooded, Wooded to Sparse, Sparse to Open (section 5.4). Like a telegraph it applies whether the behavior landed or whiffed, because it is the Titan going through the place rather than an attack on a person.
- **A Focus Titan's falling body** takes one rating step off the zone it lands in, which is its own (section 5.7).
- **A Sparse zone's** first wreck while it is Sparse does nothing, once per zone. **An Open zone** takes no further step.
- **Striding wrecks nothing.**
- **A zone that becomes Open under a standing Focus Titan:** every soldier who holds Blind Spot relative to that Titan holds On Body instead, a change made by this rule and not a fall, and every soldier Anchored in that zone lands Ground and stops being airborne, with no fall (`anchor-ratings.yaml`, `zone_becomes_open`; decision batch 16, 16-21).

**The route to the Nape.** A wreck can close the Nape in one zone. ADR-0010's legal route still holds over the field: a standing Titan follows its Attention holder into other zones (section 5.5), and a grounded Titan opens its Nape in every zone (*A grounded Titan*, below). A field whose every zone is Open is the Open rating as it has always been, where only a grounded Titan's Nape can be reached. Flights are still rolled and still make their first step in a zone with no anchors.

The GM never wrecks, restores, or chooses a zone's rating during play. Only a `wreck` effect and a falling Titan change it.

### Terrain Traits

Each Anchor Rating carries one **Terrain Trait**, printed in the table above (`ratings`, `terrain_trait`), and each reads the one zone it concerns (decision batch 16, 16-5). Wooded has none, because it is the tuned default ground. The other four:

- **Open:** a mounted soldier's Break Attention gains 1 Bonus Die when the soldier is in an Open zone. The plain is the horse's.
- **Sparse:** the first wreck a zone takes while it is Sparse does nothing, once per zone. One good tree survives.
- **Urban:** a soldier who holds Blind Spot relative to a Focus Titan in an Urban zone is anchored to a roof and is not airborne, so a Jam does not drop them (Chapter 4, section 4.2).
- **Giant Forest:** every fall that is not from a horse, in a Giant Forest zone, is raised one band (Chapter 4, section 4.6). The old trait that made a Flight's first Carry free is withdrawn, because the Carry cost of 0 into the zone contains it.

### The mounted charge

A mounted move that **enters or leaves a zone holding a Focus Titan** may also set the loudest flag on one such Titan, the rider's choice, once per move (`mounted_charge`; decision batch 16, 16-15). Apart from the charge, the only moves that set a flag are a Flight that crosses a Titan's zone and a Flight that scores no successes (*Flight*, above). The rider must not be Grabbed or carried. It spends nothing beyond the move, it is never rolled, and it is not ODM use, so it costs no gas. The mounted pace contains the old Open double step: a rider may ride through an Open zone that holds a Titan and out again in one move.

### Zone effects

A zone can hold **effects**, from a closed list (`zones.yaml`, `effects`; decision batch 16, 16-30). None of them harms in this version.

<!-- BEGIN RENDERED: zone-effects from data/engagement/zones.yaml -->
| Effect | Where it is | Harm |
|---|---|---|
| Steam | In a corpse's zone for as long as it lies there, and in a living Titan's zone for the step that resolves a steam trigger. | none |
| Dust | In a zone whose rating is below its start rating, and in a falling Titan's zone for the step of its fall. | none |
| Fire | reserved: no rule places it | none |
<!-- END RENDERED: zone-effects -->

A soldier whose move enters or crosses a zone holding an effect whose harm is not none takes that harm once for each such effect in that move. The steam table still burns soldiers by attachment, On Body at a Regeneration fill and On Body and Blind Spot at a kill, and corpse heat still burns the Pinned; neither reads the zone (section 5.7). Decoys and flares are not zone effects and have no zone. PROVISIONAL: no effect harms, and fire is reserved with no rule that places it (OQ-201).

> **Design note (OQ-182):** One roll, one currency, a battlefield that shrinks where the Titan walks. Flying used to be a fact: a soldier crossed a step and nothing was ever at stake in the crossing. A Flight makes every ODM move a moment and leaves the first step alone, so movement is never slower or less reliable than it was; what the dice decide is what the flight was worth, and whether the soldier arrived badly. About a third of a Rookie's Flights score nothing, and coming in loud is the right consequence in this game, because the Titan looks at you and it costs no new machinery. Momentum pays for flying again: it is lost at the end of any round in which the soldier made no ODM move, which inverts the baseline, where a striker reaches Blind Spot on round 2 and then stands still for the rest of the fight. Under zones the cap is the ground under the soldier, so an Open zone costs something to stand in and a wrecked zone costs its occupants at once; the Titan goes through the treeline and the ceiling drops for everyone standing there. The anchors, the Carry costs and limit, what a point of Momentum buys, the Terrain Traits, and a Flight's own odds are all ADR-0014 starting values (section 5.13). Bite is the first thing to cut if `prepared_squad_kill` moves, because Bonus Dice on strikes shorten the fight.

> **Design note (OQ-186):** The two changes of Position that are not an ordinary move part ways here, and the line between them is choice. A retreat narrows what a soldier may choose their move for; it does not take the move away, so an ODM move under a retreat is the soldier's own flying and is a Flight like any other, and a soldier fleeing a Titan can still buy a Carry or a Brace with what the flight was worth. A forced step is a result: it spends nothing, it happens on a turn already spent, and it never meets a Drive's own-move trigger, so it is not the soldier's move at all. Momentum is the reward for choosing to fly, and a soldier flung back by fear has chosen nothing, so a forced step gives none and sets no flag whichever kind of step it is. It is still ODM use when it goes by wire, because the gas is spent whoever decided to spend it, and the soldier hangs in the air at the end of it as after any ODM move.

> **Design note (OQ-183; decision batch 16, 16-15):** The charge gives a rider something to do at a Titan besides arrive. It writes the flag Draw Attention writes, so it needs no new machinery and reaches the ladder by the route the ladder already reads, and it is not ODM use, so a mounted approach still spends no gas (ADR-0009). Under zones it names the zone the rider rides into or out of, since a move no longer names a Titan. It is an ADR-0014 starting value, and the rerun measures it with the rest.

### A grounded Titan

While a Focus Titan has a Broken leg it is **grounded** (section 5.7). Its Stride is 0 (section 5.5). Every step joining In Reach, On Body, and Blind Spot relative to it can then be made on foot (`anchor-ratings.yaml`, `grounded_titan`), and none of them mounted. No new steps appear, except in an Open zone: a grounded Titan there gains an On Body to Blind Spot step, on foot or by ODM, because its Nape now lies within reach of the ground. When it stands again in an Open zone, a soldier who holds Blind Spot relative to it holds On Body instead, by that rule and with no fall. In an Open zone that window is short: each time the Regeneration clock fills, the most damaged Body Part moves one state toward Intact (section 5.7), so a Medium Titan whose only Broken part is a leg stands again within 3 rounds of the break. A soldier on foot can also Feint against a grounded Titan (section 5.6).

### Where a fall lands

Every fall in a Titan Engagement reads one **reference body**: the body the soldier's attachment named when they fell (On Body, Blind Spot, or Grabbed); otherwise the Focus Titan whose card, Grab, or effect caused the fall; otherwise the Focus Titan nearest the soldier's zone, a tie going to the earliest label (Chapter 4, section 4.6; decision batch 5, OQ-123; decision batch 16, 16-22). The band reads the soldier's Position relative to it, and the Large Size Class raise reads its class; a Giant Forest raise reads the zone the soldier falls in. A soldier who falls **stays in the zone they are in**, which for an attached soldier is the body's zone, and lands **Ground**, so they then hold In Reach relative to that body (`falls_land`). A fall is never the soldier's own move.

> **Design note (OQ-76):** A Down soldier may crawl out of reach, and falls land In Reach. The crawl gives a Down soldier's move one use without letting them leave the scene. Landing In Reach matches Chapter 4's height bands, which already treat On Body and Blind Spot as high; under zones it is simply landing in the zone you were in.

### Two Focus Titans

A second Focus Titan arrives from outside the fight at its entry zone, an edge zone no soldier stands in, so every soldier holds Distant relative to it (`two_focus_titans`, `entering`; section 5.10). After that:

- **One place, two Positions.** A soldier's one zone and one attachment give their Position relative to each Focus Titan. An attachment names one body at most, so no soldier is ever hooked into two Titans at once; the close rule that used to enforce this is retired (decision batch 16, 16-9).
- **A Grabbed soldier** holds On Body relative to the Titan holding them, and a Position derived from their zone relative to any other.
- **Each strides on its own** cards, toward its own Attention holder (section 5.5).
- **When a Focus Titan dies,** its body becomes a corpse in its zone (*A corpse*, below). The Titan Engagement then ends only by the ending tests of section 5.11, so the rounds run on while a soldier lies Pinned. When it ends, its end steps read the Positions derived from each soldier's zone and attachment at that moment, relative to each living Focus Titan and each corpse, such as who can make an aftermath roll (Chapter 3, section 3.5), and the field is cleared after the last end step (decision batch 5, OQ-122; decision batch 16, 16-24).

### A corpse

A dead Focus Titan's body stays on the field as a **Corpse** for the rest of the Titan Engagement (`positions.yaml`, `corpse`; decision batch 8, 8-9; OQ-146; decision batch 16, 16-24):
- **Where it lies.** In the zone its Titan died in. It never moves and never strides. It carries the steam effect.
- **Its Positions.** At the death, every attachment naming the Titan but Pinned ends, after its steam and fall steps, and the detach rule applies. Every Position relative to the corpse is then derived: In Reach in its zone, Distant elsewhere.
- **Steps.** It counts as a grounded Titan for attachment steps (`anchor-ratings.yaml`, `grounded_titan`, `corpse`), so the steps joining In Reach, On Body, and Blind Spot can be made on foot, and its permissions never end.
- **Its Positions are Positions.** A Position relative to a corpse is a Position in the Titan Engagement, and counts for every rule that reads one: the ending tests, witnesses, the care window's scope, Stress relief, Grief, Heave, corpse heat, the retreat's forced moves, and returning. A corpse's zone counts as a Focus Titan's zone for leaving and for the retreat (section 5.11; section 5.10). While a Focus Titan is alive this changes nothing it did not already change (decision batch 8, 8-20; OQ-156).
- **What a corpse does not do.** It holds no Attention, plays no cards, has no clock, takes no flag, and no Attention Ladder reads a Position relative to it. Heave and the strike on a pinning Body Part are the only acts made against it.

### Horses and left items

- **Horses.** A horse is in a zone (Chapter 4, section 4.5; decision batch 16, 16-25). While its soldier is mounted it is in their zone and moves with them; after a dismount it stays in that zone until mounted again. A mount needs the horse in the soldier's zone and the soldier free. Horse Whistle places the soldier's own horse in their zone before a move that mounts it (decision batch 7, 7-2). A Stride never moves a horse. A horse sent as a riderless-horse decoy that succeeds leaves the Titan Engagement instead, and is in no zone until it ends (section 5.6).
- **Attention and behaviors.** The Attention Ladder never chooses a horse, and no effect type in `titan-format.yaml` affects one. An entry can affect a horse only after such an effect type is added, and none in `data/titans/` does (Chapter 6, section 6.1).
- **Left items.** A dead soldier's left items lie in the zone they died in, recorded by zone number, and no rule moves them. Take Item needs that zone (Chapter 4, section 4.7).

> **Design note (decision batch 16, 16-24 and 16-25):** Zones already record where everyone and everything is, so the old recorded Positions, which named a Titan and were rewritten when it died, are gone. A horse left in a zone stays in that zone, and a corpse is an object in its zone that the Positions are derived from like any other body.

---

## 5.3 The round

`round.yaml` holds the round.

### Initiative cards and Tempo

A round uses twenty cards numbered 1 to 20; on paper, a D20 with repeats re-rolled serves. At the deal step, every living soldier gets one card, except a Squadmate on a Wing, and each living Focus Titan gets cards equal to its **Tempo**. A soldier who is Down, Grabbed, carried, or has left is still dealt a card, because their turns still happen. Cards are dealt face up, and no two share a number.

### Wings

At the first wings step of a Titan Engagement, the players assign each living Squadmate to one living player character's **Wing**, or to none, and the Wings stand (`wings`). At a later wings step they may change Wings only if, since the previous wings step, a soldier died, left, became Down, or became Grabbed, or a Focus Titan entered or died. A Squadmate whose player character died or left is assigned again at the next wings step, whatever else happened. A Wing holds at most one Squadmate. Disagreements are settled by Chapter 2's roll for Squadmates off a Wing.
- **On a Wing,** a Squadmate is dealt no card. It takes its turn right after its player character's turn, even when that turn was spent in advance.
- **On no Wing,** it is dealt its own card.

A Wing sets only when the Squadmate acts. It adds no dice and has no Position requirement.

### Swapping cards

At the swap step, before the first card comes up, two soldiers may exchange cards (`swapping`) if all of these hold:
- Each holds a card, and neither is Down or Grabbed.
- They are in the same zone or adjacent zones, or both have left.
- Each takes part in at most one swap this round.

A Titan's card is never swapped. A Squadmate on a Wing moves with its player character's card. Swapping is not an action. It changes the tracked value `initiative-swap`, from the option `swap-initiative-card` (OQ-90).

### Order of play

Cards come up lowest first:
- **On a soldier's card,** that soldier takes their turn of one move and one action (Chapter 1, section 1.9), then the Squadmate on their Wing takes its turn. The soldier takes the move and the action in either order, except under a retreat, where the forced move comes first (section 5.10), and never splits the move around the action (`turn_order`; decision batch 5, OQ-119).
- **On a Focus Titan's card,** the card resolves (section 5.5).

A Reaction against a Titan spends the soldier's own earliest wholly unspent turn, exactly as Chapter 1 states. That is how a soldier holding Attention runs short of turns, and why comrades Help and swap with them.

### End steps

In order (`end_steps`):
1. **Gas Rolls** for everyone who used ODM Gear this round, rolled together. If the Titan Engagement ends mid-round, these Gas Rolls are made at once, before Chapter 3's end steps (Chapter 4, `gas_roll`, `when`).
2. **Regeneration:** each living Focus Titan's clock fills 1 segment.
3. **Frenzy:** at the end of every third round (the third, the sixth, the ninth, and so on), each living Focus Titan's Frenzy rises by 1, never above 3 (section 5.4); at the end of any other round this step does nothing. It raises only a Titan that is a Focus Titan when the step runs: one that entered mid-round on a flare rises here with the rest, and one that enters at step 4 enters at 0 and stays there through its first full round. Frenzy rises during a retreat as well, as Regeneration does. It never falls, and a corpse has none. This step raises the counter and never touches a Next Behavior already rolled (section 5.5).
4. **Background Titan clocks** fill 1 segment each, and full clocks resolve. Then the **retreat clock** fills 1 segment, and if it is full the Titan Engagement becomes a retreat (section 5.10). During a retreat no Background clock fills and the retreat clock does not fill; step 2's Regeneration clocks still fill (decision batch 6, OQ-134).
5. **Momentum:** every soldier who made no ODM move this round loses all of theirs (section 5.2). A soldier who flew keeps what they hold, to the cap the anchors of their zone give.
6. **Round ends:** unspent moves and actions are lost.

> **Design note (OQ-77):** A turn's move and action come in either order, so a soldier can fly in and strike or strike and fly clear; an unsplit move keeps every Position check at one moment. A retreat is the exception: its forced move comes first (section 5.10). The retreat's closed cut does not rest on that order but on its own rule, since no Nape strike is made in a retreat (ADR-0010, as amended in decision batches 5 and 5b). The one-step limit on swaps makes swapping a teamwork lever tied to Position, like Help (ADR-0010). Wings stand between losses: assigning them every round is a deliberation the table pays each round for a choice that rarely changes, and the losses that made a new assignment worth having are exactly the moments the rule keeps (OQ-97). Gas Rolls come first, as Chapter 4 expects. Regeneration and Frenzy come before Background clocks, so a Titan that enters at the end of a round starts its first full round clean on both counts: its clock is empty and its Frenzy is 0, one round behind the Titan already in the fight (decision batch 13, 13-10, as read after round 3 review 1, C2). A Titan a flare brought in mid-round is a Focus Titan when both steps run, so it fills, and rises with the others at the end of a third round (the third, the sixth, the ninth, and so on). The retreat clock fills last, so a Background Titan whose clock fills at the same end step enters before the retreat begins. Momentum is lost after the clocks and before the round ends, so a soldier who flew this round carries what their Flights gave them into the next round, and a soldier who stood still carries nothing (section 5.2).

### What the GM tracks

The GM keeps one tracker row per Focus Titan and per Background Titan, plus one Titan Engagement line (`gm_tracker`, with example rows). Everything on the tracker is public except an unrevealed Next Behavior and the values an Abnormal keeps hidden until a Read (section 5.8).

- **Engagement line:** the field size and field rating; the **field readout**, each zone's rating by number, marked where it is below its start rating, which gives the Momentum cap of every soldier in that zone (section 5.2); the round number, the retreat clock's filled segments out of its length (such as `Retreat 2/8`), whether it is a retreat and the round it began, which counts the retreat's first rounds for the stay limit (section 5.10; decision batch 8, 8-32 and 8-36), the Squad Tactics and which are used, whose cloaks are thrown, and the round in which no soldier was left standing while the ending waits (section 5.11).
- **Focus Titan row:**
  - its label, stat block, and cards this round;
  - its zone, and its Stride (0 while grounded; section 5.5);
  - the Attention holder, the decoy holding it and the cards its hold has left, or nothing;
  - the Next Behavior (face down), the previous behavior, and any Call It on the Next Behavior;
  - each Body Part's state and count;
  - Openings and their creators, and the Regeneration clock (only its filled segments for an Abnormal whose clock length no Read has revealed);
  - decoys in a row, the number of decoys that have held its Attention since the last of its cards that resolved a behavior (section 5.6);
  - any Grabbed soldier, with countdown turns and lifted;
  - the flags standing on soldiers, which clear only as section 5.6 states;
  - its **Frenzy**, from 0 to 3, raised at the Frenzy end step of every third round (the third, the sixth, the ninth, and so on) and added to every behavior roll it makes from then on (section 5.4);
  - its heave count and each soldier its body pins, by limb with the pinning Body Part, or by the body (section 5.7).
- **Corpse row:** a dead Focus Titan's row stays for its corpse, with its zone, each Body Part's state and count, its heave count, and each soldier it pins (`corpse_row`).
- **Background Titan row:** its Size Class and its clock.

The GM updates the tracker after the deal, after each Titan card (its zone after the Stride, and the Attention a retarget moved at the Choose step), after each strike or Break Attention, after each counted turn of a Grabbed soldier (the countdown and lifted), after each fall of a Titan's body and each Heave (pins and the heave count), and at the end steps (`per_round_order`). Players track everything else on their own sheets: their zone and attachment, Momentum, mounted, airborne, turns spent in advance, Stress, harm, and gear.

Two aids keep a round moving (`titan_card_checklist`, `rolled_together`):
- **On a Titan's card,** the GM reads its tracker row in the order of the card procedure. Every soldier who takes part, player character or Squadmate, has a Squad sheet row whose zone and attachment columns say where they are, such as `Z7 | S A` for zone 7 at Focus Titan A's Blind Spot (`data/gear/sheet-fields.yaml`, `squad_sheet_row`). Those columns are the one record of where everyone is: each Position the ladder reads is derived from them at that moment, and the character sheet's `zone` and `attachment` fields mirror them. The Foundry ledger's left page is the same readout, with each soldier's derived Positions shown read-only beside them (decision batch 16, 16-35).
- **Rolls that do not depend on each other** are rolled together: the end-step Gas Rolls, and the Fear Rolls every witness makes for one event.

### Round time

`round.yaml` (`round_time`) states how long a round may take, the test that measures it, and what changes if the test fails:
- **The band.** A typical round, one Focus Titan with 4 player characters and 2 Squadmates, all fully tracked, takes 12 to 20 minutes. A round with a Grab may run to the band's top plus its witnesses' Fear Rolls, rolled together. A round against two Focus Titans takes at most 30 minutes. Both are design targets until the test measures them.
- **The timed paper test** is the first Phase 1 playtest item: one round with 4 player characters and 2 Squadmates against one Medium Titan, one round with a Grab, and one round against two Focus Titans, played by players new to the rules, reporting median and upper-quartile times. It passes if the one-Titan median is at most 20 minutes and the two-Titan median at most 30.
- **Under the playtest configuration** of 4 player characters and no Squadmates (Chapter 2, section 2.10; `timed_paper_test`, `playtest_configuration`; decision batch 8, 8-38), the test's three rounds are played with 4 player characters and no Squadmates. They report the same times, pass on the same limits, and take the same fallbacks. The band's rounds with 2 Squadmates stay design targets until a test played with Squadmates measures them.
- **Fallbacks, in order.** If the one-Titan median misses, Wings are fixed for the whole Titan Engagement and the swap step is removed, which amends ADR-0010's list of soft levers. If the two-Titan median still misses, every Background clock on the interim setup table lengthens by 2, so that two-Titan rounds are rarer in Phase 1 play; the retreat, the retreat clock, and the two-Focus-Titan limit do not change.

> **Design note (OQ-97):** A round of six soldiers against one Titan asks for many small updates, and the rules trim them without cutting a rule the ADRs rest on: Wings stand between losses, Positions have one record, the Titan-card checklist follows the procedure's order, and independent rolls are rolled together. Review round 3 estimated a typical round at 12 to 17 minutes, a Grab round at 16 to 22, and a round against two Focus Titans at 22 to 30, which the second card, ladder, and tracker row make hard to shorten. A bound of 30 for that round is honest, and the setup table's clock lengths decide how often it comes up. Naming the pass criteria and the fallbacks now lets the test decide without another decision. Collapsing Body Part states and counts, or making gas one Squad check, is rejected, because each would change ADR-0007 or Chapter 4's gas rule.

---

## 5.4 Titans

### Size Classes

`size-classes.yaml` gives each Size Class its Tempo, Nape Depth, Regeneration clock length, Toughness by Body Part kind, and Attack Dice by tier, 3 dice for each point of the fixed need the tier had before decision batch 8, so the pools follow those values and a Large Titan's control tier rolls the Medium Titan's kill pool (8-1). Thrash takes the control pool. Its **Heave rating** is the heave count that lifts its body off the soldiers it pins, and an Abnormal lists its own (section 5.7; decision batch 8, 8-9). Its **Stride** is the number of zones it moves toward its Attention holder on each of its cards that resolves a behavior (section 5.5; decision batch 16, 16-16):

<!-- BEGIN RENDERED: stride from data/engagement/size-classes.yaml -->
| Titan | Stride (zones) |
|---|---|
| Small | 1 |
| Medium | 2 |
| Large | 2 |
| Sprinting Abnormal (an Abnormal lists its own) | 3 |

A grounded Titan's Stride is 0. Ties between two zones go to the lower-numbered.
<!-- END RENDERED: stride -->
 An arm that holds a Grabbed soldier has Toughness 1 while it holds them, whatever its Size Class (ADR-0019). Every number in that file is a starting value for the ADR-0014 simulator. Section 5.13 gives the figures that set them.

> **Design note (OQ-78):** Small, Medium, and Large differ as follows:
> - **Small** acts twice a round but lightly.
> - **Medium** acts once, with the Attack Dice keyed to the fixed needs the Rookie dodge was tuned against.
> - **Large** acts once but hits harder, regenerates more slowly, has tougher arms, and raises the fall band. Its Nape Depth is Medium's, 4: at 5, the median kill slips to round 4 and a fifth of fights end with no kill (section 5.13).
>
> Medium at Tempo 2 deals two and a half times the Critical Injuries per fight and four times the deaths (section 5.13).

### Stat blocks

A Titan's stat block (`titan-format.yaml`, `stat_block`) lists:
- its Size Class, whether it is an Abnormal, and its Tempo, Nape Depth, Regeneration clock, Heave rating, and Stride;
- its Body Parts in order;
- its Attention Ladder and its Behavior Table.

A **standard Titan** takes every number from its Size Class row. Its Body Parts are exactly eyes, left arm, right arm, left leg, and right leg, in that order, and it uses the standard Attention Ladder. Only an **Abnormal** lists different values, and it lists all of them.

### Behavior Tables

A **Behavior Table** is rolled on D6 plus the Titan's **Frenzy** (`behavior_table`):
- Its results **escalate:** 1 and 2 give terrorize entries, 3 and 4 control entries, and 5 and 6 kill entries. An entry may cover several results, but all within one tier's pair.
- A total **above the table's highest result reads as that highest result**, which is 6, since every result from 1 to 6 belongs to one entry. A Titan at Frenzy 3 rolling a 5 reads 6.
- Every table also has one **Thrash** entry, which is never rolled. It is what the Titan does when nothing else can happen, and since decision batch 13 it is reached only when no soldier in the Titan Engagement meets the rolled entry's Position requirement (section 5.5).

**Frenzy** (`frenzy`; decision batch 13, 13-10). Each Focus Titan holds a whole number from 0 to 3. It starts at 0 when the Titan becomes a Focus Titan, rises by 1 at the Frenzy end step of every third round, the third, the sixth, the ninth, and so on (section 5.3), and never falls. It is public, and it sits on the Titan's tracker row. It does one thing: it is added to the behavior roll. It adds no dice, changes no Attack Dice, no need, and no effect, and it moves no soldier. Because every table is ordered terrorize to kill by result, adding Frenzy walks a Titan up its own table as the fight drags: it postures for four rounds and is trying to kill from round 5. A Squad that kills in the three rounds the design targets, or in four, never sees it, and a Squad that grinds meets Frenzy 2 on the round the retreat clock fills, and Frenzy 3 only in a long retreat. The rate was every round when the rule was first written; the round 3 retune halved it, because at every round the Squad fighting exactly as intended paid it too (R1), and the zone retune slowed it to every third round, because zones and wrecks raised the standard Medium Titan's deaths past its band and Frenzy was the behavior lever that brought them back (Z2). The GM never raises, lowers, or spends it (ADR-0024, limit 8).

Every entry lists the fields ADR-0024, limit 11, requires, plus what the procedure needs (`entry_fields`):
- **Results and tier.**
- **Targets:**
  - *holder:* only the soldier holding Attention;
  - *holder-and-position:* the holder and everyone else **in the holder's zone** at their Position who is not Grabbed (decision batch 16, 16-18).
- **Position requirement:** the holder's Position that the entry needs, checked after the card's Stride.
- **Body Parts used:** the kinds it needs unbroken.
- **Attack Dice:** how many Titan Dice the entry rolls. An entry whose only effect is telegraph rolls none.
- **Effects,** in order.
- **Fallback:** the entry that happens instead when the holder's Position does not fit.

`tier_rules` limits what each tier can do:
- **Terrorize** inflicts only Stress, and can telegraph.
- **Control** adds falls and Critical Injuries that cannot be lethal.
- **Kill** adds lethal Critical Injuries and the Grab.
- **Thrash** works at any Position, uses no Body Parts, and inflicts nothing lethal.

Every tier can also wreck, taking one rating step off the Titan's zone, and the heavy entries of each table carry it (section 5.2). No entry names death; only the Grab's devour step does (Chapter 3).

**Titan Dice** (`titan_dice`) are the dice an entry's Attack Dice are rolled with. Each die that shows 5 or 6 is a success. The GM rolls them in the open when a card resolves the entry, and they never Push and never take Bonus Dice, Help, Gear Dice, Stress Dice, or Circumstances (ADR-0024, limits 8 and 16). Use a colour no soldier's pool uses. The roll's successes are the card's Severity, and every target of the card cancels against the same roll (section 5.5; ADR-0019).

**Effect types** are a closed list (`effect_types`):
- **stress:** the target gains that much Stress, once, whatever the Net Successes.
- **critical-injury:** a Titan attack at the listed Injury Location, of the listed Injury Type, lethal or not as listed. A Bite entry's type is Bite, and every other entry's is Crush (decision batch 7, 7-5). Its roll adds 1 for each Net Success beyond the first (Chapter 3, section 3.2; decision batch 8, 8-2).
- **knock-loose:** an airborne target, or one at On Body or Blind Spot, falls, in the zone they are in, which for an airborne holder in another zone is their own. A mounted target is not affected. The fall is the same whatever the Net Successes.
- **grab:** the Grab procedure (section 5.9), the same whatever the Net Successes.
- **wreck:** the Titan's zone takes one rating step toward Open (section 5.2, *Wrecking*). Like a telegraph it applies whether the behavior landed or whiffed, and whatever the Net Successes, because it is the Titan going through the place and not an attack on a person. It affects no soldier and no horse, and changes a Position only when the zone becomes Open under the standing Titan.
- **telegraph:** the next Next Behavior is revealed to every soldier. It applies whether the behavior lands or whiffs, because what the Titan will do next shows either way.

**Reach is the Titan's own zone** (`entry_fields`, `position_requirement`; decision batch 16, 16-18). In Reach, On Body, and Blind Spot exist only in the zone a Titan stands in, whatever its Size Class: a Titan threatens no adjacent zone. An entry whose Position requirement lists Distant still resolves at a holder in any other zone, as its text has always described the Titan closing, and a holder-and-position entry strikes only the soldiers in the holder's zone, so Run Past against a holder three zones off does not strike every soldier on the field.

> **Design note (decision batch 16, 16-18):** Reach into adjacent zones by Size Class was the obvious alternative, and it turns the ground around a Large Titan into a harm zone that no Behavior Table entry deals (ADR-0005, ADR-0019). The Stride does the work instead: a Titan that wants a soldier walks to them, on its card, and then the table's own requirement decides what it can do there. It stays held for a later version (decision batch 16, 16-38).

`tuning.yaml` (`simulation_reference_titan`) is a complete example of the format. It is the Titan the simulations fought, not a playable Titan. The playable Titans are in `data/titans/` (Chapter 6).

### Improvised acts

A soldier may attempt an act against a Titan that no entry covers. Before the pool is built, the GM names the **model entry**: the one existing entry whose effect the act imitates. That ruling stands (decision batch 9, 9-8; Chapter 2, section 2.9; `data/character/action-catalog.yaml`, `uncatalogued_actions`, `in_a_fight`). In a fight Chapter 2's steps are not used: an act the soldier describes that is not an entry taken as written is an improvised act, even when a tracked value it would change matches an entry. The model entry is an entry of kind action that the soldier could take in a Titan Engagement, never the dodge, a roll such as Leap Clear, or an option such as Call It (decision batch 9, 9-27). Whether the act can be done at all is ruled first (Chapter 1, section 1.1, item 1). The act:
- spends the soldier's action;
- is made with the model entry's attribute, gear items, Talents, and needs, and takes Circumstances as any soldier's roll does; an act modelled on an unrolled entry is not rolled;
- meets the model entry's requirements and restrictions, such as its Position, the rule that the Attention holder cannot strike the Nape, and a Feint's Position rule;
- on a success produces only the model entry's effect, at that entry's size.

For example:
- **A wagon cut loose** to roll across the Titan's path is a Break Attention decoy: Break Attention's needs, its hold of one round of the Titan's cards, and its Openings.
- **A lantern swung** in the Titan's face is Draw Attention: unrolled, never from Distant, and it sets the loudest flag.
- **A chimney dropped** on a leg is a Body Part strike on that leg: its successes count toward the leg's Toughness, and it needs the Position a leg is struck from.
- **A dive behind a chimney stack** is a move if it changes the soldier's zone or attachment, and otherwise changes nothing and needs no roll. It is never modelled on the dodge and makes no later dodge easier: zones and attachments already price where a soldier stands.

An improvised act never kills a Titan, never changes Nape Depth, Toughness, Attack Dice, or a card, never cancels or delays a card, never creates more Openings than its model entry could, and never gives an effect no entry has (ADR-0024, limit 9). Only a Nape strike taken as its entry is written kills a Titan; an act modelled on the Nape strike never does. Such an act is resolved as a Nape strike that falls short, whatever its successes: each success creates 1 Opening, created by that soldier, Relentless adds 1 more where its trigger is met (at least 1 success), as a strike that falls short does, and the act sets the hooked-by-strike flag as any Nape strike does, whatever its result (section 5.6). Successes that reach the Titan's Nape Depth create their Openings and nothing else, and the act lowers no Nape Depth (decision batch 9, 9-39). The tracked values of section 5.14 are the menu of effects it can copy.

**A called roll in a Titan Engagement.** An act no entry of kind action could model, that would change nothing the fight tracks (no tracked value of section 5.14, no zone, attachment, or Position, no zone's rating, Attention, Opening, card, or clock), such as hauling a granary's doors shut so the Titan cannot follow the civilians through, is a called roll (Chapter 1, section 1.1). It spends the soldier's action and is made on the soldier's turn; a soldier facing a card dodges, and no called roll stands in for a Reaction (section 5.5; decision batch 9, 9-25 and 9-45). Its Circumstances are Standard unless the GM has named a step for something no rule prices. Help on it is Help as this chapter gives it: a comrade with an unspent action at the same Position or one step away, spending that action. A fall it stakes is low or high as the GM names, never extreme, and the Height steps of Chapter 4 do not raise it, and it lands as section 5.2 gives (`positions.yaml`, `falls_land`): a soldier who falls from On Body or Blind Spot holds In Reach once the fall is resolved, a change of Position the fall rule makes, not the ruling (decision batch 9, 9-44); a time or position cost changes only the situation outside what the fight tracks; and success gives the act, information, or an object that is not a gear item, never a Position, found Squad Supply, or an effect an entry has. It is tried again on a later turn, spending that turn's action (decision batch 9, 9-36 and 9-44).

> **Design note (decision batch 9, 9-8):** Copying an existing effect at its measured size opens the fight to invention without moving a figure: a wagon decoy is a Break Attention row, and a lantern is a Draw Attention row. Naming the model entry before the roll closes the reskin, such as a falling beam that is really a free Nape cut, and only a Nape strike kills (ADR-0007).

---

## 5.5 The Next Behavior and a Titan's card

`behavior-procedure.yaml` holds both procedures.

### Rolling the Next Behavior

A Focus Titan always has a hidden **Next Behavior**. The GM rolls it out of sight and records it face down. It is rolled at these moments (`next_behavior`):
- when the Titan becomes a Focus Titan;
- after each of its cards that resolved a behavior;
- after a card that came up while a decoy held its Attention.

A card that resolves nothing because the Titan holds a Grabbed soldier, or because no one holds its Attention, keeps the Next Behavior.

To roll it:
1. Roll D6 and add the Titan's **Frenzy** as it stands now (section 5.4). A total above 6 reads as 6. Find the entry whose results include the total.
2. The entry cannot be rolled if it is the Titan's previous behavior (no back-to-back repeats) or needs Body Parts the Titan no longer has unbroken.
3. If it cannot, take the entry holding the next higher result and test again. At Frenzy 0, after 6 comes 1. At Frenzy 1 or more the roll never wraps: from 6 it turns back down, to the next result below the total, and so on to 1.
4. If no entry passes, the Next Behavior is Thrash.

**When Frenzy counts.** The Next Behavior is rolled in advance of the card that resolves it, so the roll takes the Titan's Frenzy **at the moment of the roll**, and nothing re-reads it afterwards (`next_behavior`, `frenzy_when`; decision batch 13, 13-11). Three things follow, and every step of this chapter reads them the same way. A Titan that has just become a Focus Titan is at Frenzy 0, so its first Next Behavior is a plain D6. A Next Behavior rolled during one round and resolved in the next was rolled at the earlier round's Frenzy, so the escalation reaches the table one card late. And the roll stands as it fell: the Frenzy end step raises the counter and never touches a Next Behavior already rolled (ADR-0024, limit 14).

Rolling never checks Positions, because Attention is decided only when a card comes up. An entry that cannot be rolled passes its results to the entry above it, so shares shift while a previous behavior or a Broken part blocks an entry: with both arms Broken, Bite takes Grab's result (`move_up_shares`). A frenzied Titan's roll turns back down from 6 instead of wrapping to 1, so Frenzy never sends a Titan to the bottom of its table.

### Resolving a card

When a Focus Titan's card comes up (`resolving_a_card`):

1. **Dead.** If the Titan has died, its card does nothing.
2. **Holding.** If it holds a living Grabbed soldier, the card resolves nothing, the ladder is not evaluated, the Next Behavior is kept, and the flags stay.
3. **Decoy.** If a decoy holds its Attention:
   - the card resolves nothing, and the hold has one card fewer left;
   - the Next Behavior counts as spent: it becomes the previous behavior, any Call It on it ends, and a new one is rolled;
   - if that was the hold's last card, the hold ends and the ladder is evaluated;
   - otherwise the decoy keeps Attention and the ladder is not evaluated;
   - either way the flags stay, and decoys in a row does not change.
4. **Attention.** Otherwise the Titan evaluates its Attention Ladder (section 5.6). If no one holds its Attention, the card resolves nothing and the flags stay.
5. **Stride.** If the holder is in another zone, the Titan strides toward them (*The Stride*, below). A grounded Titan's Stride is 0.
6. **Choose.** Take the Next Behavior's entry, against the Positions as the Stride left them:
   - If the Titan lacks the Body Parts it uses, the behavior is Thrash.
   - If the holder does not meet its Position requirement, the Titan **retargets**: evaluate the Attention Ladder again over only those candidates who do meet it (section 5.6). The soldier that evaluation returns holds the Titan's Attention from that moment, and the entry resolves against them, its targets read from the new holder.
   - Only if **no** candidate meets the Position requirement does the entry become its fallback.
   - Test the fallback the same way. If it is Thrash, repeats the previous behavior, or needs Body Parts the Titan lacks, the behavior is Thrash. Otherwise, if the holder does not meet the fallback's own Position requirement, the Titan retargets over the candidates who do, by the same evaluation.
   - Only when nobody meets the fallback either is the behavior Thrash.
7. **Roll and announce.** Announce the behavior's name, tier, and targets to every soldier, then roll its Attack Dice as Titan Dice in the open and announce the successes: the card's Severity, the same for every target. The roll takes no Circumstances, and the GM never re-rolls or adjusts it (ADR-0024, limit 8; ADR-0019).
8. **Reactions.** On 0 successes the card whiffs against every target, and no one dodges. Otherwise each target dodges, or cancels with an earlier dodge against this Titan, by Chapter 1's *Attack and Reaction* (below). The card lands on a target on 1 or more Net Successes and whiffs on 0.
9. **Effects.** For each target it lands on, apply the effects in order, targets in card order. Only a Critical Injury reads the Net Successes. A telegraph applies whether the card landed or whiffed, and so does a wreck, which is the one effect that lands on nobody: it takes one rating step off the Titan's zone once, however many targets the card had (section 5.2). A target who dies receives none of the card's later effects; every other target still does (decision batch 4, OQ-107).
10. **Next.** A card that whiffed has still resolved a behavior. The behavior becomes the previous behavior, the Titan's decoys in a row returns to 0, every flag for this Titan clears, and the new Next Behavior is rolled. If the behavior had a telegraph effect, the new Next Behavior is revealed.

### The Stride

A Focus Titan **strides** (`behavior-procedure.yaml`, `resolving_a_card`, `stride`; `zones.yaml`, `stride`; ADR-0029; decision batch 16, 16-16 to 16-19). On each of its cards that reaches the Stride step, if the soldier who holds its Attention is in another zone, the Titan moves toward that soldier's zone one zone at a time, up to its **Stride** (section 5.4), and stops as soon as it enters that zone.

- **The route.** Each zone it enters is an adjacent zone one closer to the holder's zone. When two are, it enters the **lower-numbered**. It never goes off field. Nothing in a zone blocks it.
- **Whom it strides toward.** Only the soldier who holds its Attention at this step, after this card's Attention step. A soldier who has left holds no Attention, so a Titan never strides toward a soldier off field. An airborne holder is in their zone like anyone; airborne is a state, not a place. A carried holder is in their carrier's zone. A soldier Grabbed by another Focus Titan is never a candidate.
- **When it does not stride.** A card that stops earlier does not stride: the Titan is dead, holds a Grabbed soldier, is held by a decoy, or has nothing holding its Attention. A grounded Titan's Stride is 0, and a corpse never strides.
- **What it is not.** The Stride is not a roll, an entry, or an action. It harms nobody, sets no flag, clears no flag, wrecks nothing, and is no Fear Roll trigger. The GM chooses nothing in it: its destination is the holder the ladder already chose, and its route is the rule above (ADR-0024, limit 8).
- **What it carries.** Every soldier whose attachment is On Body or Grabbed naming it moves with it, zone by zone, with any comrade they carry. A soldier at its Blind Spot is anchored to the terrain: they stay in the zone it leaves, the detach rule applies (section 5.2), and they now hold Distant relative to it. A Pinned soldier stays Pinned where they lie. Horses, left items, other soldiers, and corpses never move with a Titan (`positions.yaml`, `stride_moves`).
- **What it changes.** A soldier in a zone the Titan enters now holds In Reach relative to it; one in a zone it leaves now holds Distant. The Choose step then checks the entry's Position requirement exactly as it always has, retargeting included, against the Positions the Stride left.

**Example.** On the Standard field (section 5.1) a Medium Titan, Stride 2, stands in zone 7, and its holder is in zone 2. Zones 4 and 5 are both one closer to 2, so it enters 4, the lower, then 2, and stops there: two zones. The Sprinting Abnormal, Stride 3, in zone 8 with its holder in zone 11 enters 7 (7 and 10 are both one closer; 7 is lower), then 9, then 11.

> **Design note (ADR-0029; decision batch 16, 16-16 and 16-19):** Under relative Positions a Titan was the origin of every soldier's Position and could not move; on a shared field a Titan that never moves makes a soldier two zones away provably safe and turns every entry whose requirement includes Distant into nonsense. The Stride needs no new choice from anybody, because the Attention Ladder already names where the Titan wants to go, so ADR-0018 (Titans do not roll), ADR-0001 (the Stride is a step of the card, not a turn), and ADR-0024, limit 8 (the GM picks no zone or route) all stand. What it carries splits the two ways of being close on risk, legibly: a soldier On Body rides the Titan to wherever it goes, and a soldier at Blind Spot, anchored to a tree, is left behind with their Nape strike undone. The Stride values are the simulator's starting values, and the Stride is the first lever the retune reads (section 5.13).

### Dodging a Titan

Chapter 1, section 1.9 governs the dodge (*Attack and Reaction*), and nothing here changes it:
- **The roll:** Agility with ODM Gear, or the horse while mounted, made after the Titan's roll is announced, so the soldier knows the Severity before choosing to dodge or to Push. Each success cancels one of the card's successes. Horsemanship adds its dice to a dodge made with the horse (Chapter 2; decision batch 5, OQ-121).
- **A whiff:** a card whose roll scores 0 successes whiffs against everyone, and no dodge is made against it, so the soldier keeps their Reaction for a later card.
- **One per Titan:** one dodge against each Titan per round, rolled against the first of its cards the soldier answers. Its successes cancel against every later card from that Titan this round, each separately.
- **The turn it spends:** the soldier's earliest wholly unspent turn. A dodge against a Grab, or one whose successes cancelled against a Grab's card, can have that turn given back when the Grab lands (section 5.9).
- **Forbidden:** a Down soldier cannot dodge, and neither can a soldier holding a state or result that forbids Reactions, such as Grabbed or the Scream Fear Roll row. They cancel nothing, so the card lands on them on 1 or more successes and whiffs on 0.
- **Call It:** a Called behavior adds its Bonus Dice to a dodge against it (section 5.8).
- **Circumstances:** the dodge takes Circumstances as any soldier's roll does, at the step in force when the Titan's card comes up, Standard unless the GM named a step before then for something no rule prices, and no step is named or changed for the dodge once the card has come up (Chapter 1, section 1.4a, items 1 and 9; the Rulings paragraph above). The Titan's roll takes none. A condition that hampers the Titan reaches the card only through the dodge: a Titan mired to the knee makes the dodge against it Easy, named when it is mired and before its card comes up, or, in rain already named Hard, one step the GM names weighing both; it loses no Attack Dice (decision batch 9, 9-4 and 9-26).

> **Design note (OQ-80, as amended by decision batch 13, 13-9 and 13-10):** Illegal results move up the table instead of being re-rolled, so the hidden die is rolled once and never again. The wrap from 6 to 1 stands at Frenzy 0, where it costs one face and every table in Chapter 6 was built on it. At Frenzy 1 or more the roll turns back down from 6 instead, because Frenzy piles up to four faces onto result 6 and a wrap would land every one of them on the table's weakest entry: a Medium at Frenzy 3 that had just Grabbed, or that had both arms Broken, would have grinned 4 faces in 6 (round 3 review 1, C3). Positions change between the roll and the card, so they are checked only at the card. What used to happen there was that the entry fell to its fallback, which is Thrash in every table but two, so a Titan whose Attention sat on a soldier at Distant or Blind Spot flailed for the whole fight and never Bit or Grabbed: the better the Squad played, the more inert the monster became. The two real fallbacks, the Large's Crush and the Sprinting Abnormal's Pitch Headlong, were no better off, because the fallback was tested against the same holder the rolled entry had just failed against; they are retargeted in their turn now, so the field means something again. It now turns on someone it can reach instead, by the ladder it already has, and the fallback waits for the case where nobody qualifies. Frenzy is the other half of the same fix: lethality comes back through what the monster does rather than through its dice. A holding Titan does nothing else because ADR-0019's countdown is all the danger it poses for those turns. Terrorize, control, and kill by result keep lethal harm to a third of rolls, which the kill and Jam figures measured.

> **Design note (decision batch 8, 8-1 and 8-2; OQ-145):** The table picks the behavior and the entry rolls its pool, the shape of the parent games' creature attacks (ADR-0001, as amended). Titan Dice succeed on 5 or 6 so that pools stay small: 9 of them have the mean of 18 dice that succeed only on 6, with a narrower spread. Each pool is 3 dice per point of the fixed need it replaced, keyed to those values rather than to tiers, because tier-keyed pools halved the Large Titan's deaths. The research measured this shape at today's Health reproducing the Medium band (0.050 deaths during the fight and 0.058 through the end), the first-Titan-Engagement row (0.082), the setup mix (0.076), and every Grab cell within sampling, with the Large Titan at 0.156 against 0.185 (`docs/playtest/feedback/round-1/opposed-rolls.md`, round 3). A whiff against a soldier who cannot react changed nothing measurable, and a rider on the Grab's crush pushed the lone Grab out of its band, so the Grab takes none. Titans never Push, so letting the soldier decide after the roll costs nothing and shows a whiff at once. The confirming run of the round 3 retune re-measured every target under this shape, and every ADR-0014 target and every Chapter 6 band was Met, with one limit of the Sprinting Abnormal's bar Missed and logged as OQ-199 (8-14, 8-31; the round 3 retune, R6 and R7; section 5.13).

---

## 5.6 Attention

`attention.yaml` holds everything in this section.

### Who holds Attention, and when it changes

A Focus Titan's **Attention** is held by one soldier, a decoy, or nothing, and who holds it is public. The soldier holding it cannot make a Nape strike against that Titan (ADR-0010).

Attention changes only at these moments (`changes`):
- when the Titan becomes a Focus Titan;
- when one of its cards comes up, except a card that leaves a decoy's hold with cards left or that comes up while it holds a Grabbed soldier;
- when a Break Attention places a decoy;
- when its Grab lands;
- when the holder dies, leaves, is freed, is Grabbed by another Focus Titan, or stops holding a Position relative to it, after which nothing holds Attention until the next evaluation (decision batch 4, 4-13);
- when a card's Choose step **retargets** the behavior because the holder does not meet its Position requirement (*Retargeting*, below; section 5.5).

Between those moments the holder does not change, whatever soldiers do.

### The Attention Ladder

**Candidates** are the living soldiers holding a Position relative to the Titan. Never a candidate:
- a soldier who has left;
- a soldier held by another Titan;
- a horse.

The **standard ladder's** rungs are, highest first (`ladders`, `tests`):
1. **Hooked into its body:** at On Body, or holding the hooked-by-strike flag.
2. **Nearest person in reach:** at In Reach.
3. **Just hurt it:** holding the just-hurt flag.
4. **Loudest or brightest:** holding the loudest flag.
5. **Nearest:** at the closest Position any candidate holds, in the order On Body, In Reach, Blind Spot, Distant. It counts no zones: every candidate in another zone holds Distant alike, and a tie among them goes on to the holder and card steps (decision batch 16, 16-17).

To evaluate the ladder (`evaluation`):
1. Find the highest rung any candidate meets. The candidates who meet it are tied. When that rung is nearest, only the candidates at the closest Position are tied.
2. **The loudest match.** Add to the tied set every candidate who holds the loudest flag, unless the highest rung met is hooked into its body, in which case add none (`flags`, `loudest`, `matches`; decision batch 10, OQ-184). This is the only step that adds a candidate, and it adds them whatever Position they hold, so a soldier who came in loud from Distant is in the set. The lower rungs then narrow as they always do, and the loudest or brightest rung keeps them.
3. If the highest rung met is hooked into its body and anyone tied there holds the hooked-by-strike flag, only they stay tied. A Nape striker who falls short draws the Titan's Attention before a soldier who is only On Body; whether they take its behavior depends on whether the rolled entry reaches Blind Spot (*Retargeting*, below).
4. Narrow the tied soldiers by each lower rung in turn. At the nearest rung, keep the tied soldiers at the closest Position any of them holds.
5. If still tied, the current holder keeps Attention. Since nearest has already narrowed the tie, this happens only between soldiers at the same distance (decision batch 3e, 3e-6).
6. Otherwise the lowest card this round takes it, a Wing Squadmate counting just after its player character. This step is skipped when no cards have been dealt this round, and at an end step, as when a Background Titan enters at the background-clocks end step, because the cards of a round that is ending choose nothing. A Titan that enters mid-round, when a flare fills its clock, is evaluated with that round's cards (section 5.10; decision batch 4b, 4b-3).
7. Otherwise nothing holds its Attention until its next card, which evaluates the ladder again with that round's cards. Only the start of a Titan Engagement, an end step, and a tie among Wing Squadmates of one player character (none in Phase 1, since a Wing holds one Squadmate) reach this step, because during a round every player character's card is distinct and a Wing Squadmate comes right after its player character's. The order of the Squad sheet chooses nothing (ADR-0024 and ADR-0010, as amended in decision batch 4; OQ-81, as revised in decision batch 4; decision batch 4b, 4b-3).

**Flags** are public. Each lasts until the end of the Titan's next card that resolves a behavior, and clears at that card's Next step (`flag_duration`; section 5.5; ADR-0024, limit 2, and ADR-0010, as amended in decision batch 3e). A card that resolves nothing leaves every flag standing: each card of a decoy's hold, the last one included, which evaluates the ladder with the flags; a card that comes up while the Titan holds a Grabbed soldier; and a card with no one holding its Attention (OQ-81 and OQ-111, as revised in decision batch 3e). So a flag is always read by the card that acts. The flags are:
- **hooked-by-strike:** set by any Nape strike against the Titan, whatever its result (ADR-0010);
- **just-hurt:** set by a Body Part strike with at least 1 success;
- **loudest:** set by Draw Attention, or by a Fear Roll result's loudest flag (Chapter 3, section 3.9), neither from Distant; by a Flight with no successes, on every Focus Titan in the zone it ends in, or the one nearest that zone when there is none; by a Flight, whatever it rolled, on every Focus Titan standing in a zone it crosses; and by a mounted charge, on one Titan in a zone the rider enters or leaves (section 5.2; decision batch 16, 16-15). A corpse takes no flag. Momentum spent on Quiet stops every flag the soldier would set that turn, the crossing flag included. While a soldier holds this flag they also count, for this Titan's ladder, as meeting every rung any other candidate meets except hooked into its body (*The loudest match*, step 2 of the evaluation above).

**Down and carried soldiers** are candidates but meet only the rows marked `down_can_meet`, which on the standard ladder is only nearest, met by their Position like anyone else's. On the standard ladder, a Titan turns to a Down soldier only when no one is closer, hooked in, hurting it, or louder (decision batch 3e, 3e-6; decision batch 4, 4-13). An Abnormal ladder that names current-holder also keeps a Down holder who is not at Distant (*Abnormal ladders*, below). This settles the question Chapter 3 left to this chapter.

### Retargeting

When a card's Choose step finds that the Attention holder does not meet the rolled entry's Position requirement, the Titan does not flail: it **evaluates the Attention Ladder again over only those of its candidates who do meet that requirement** (`evaluation`, `retargeting`; decision batch 13, 13-9). The thing it wanted is out of reach, so it takes what it can catch.

- **The candidates narrow, nothing else does.** The candidate rules are unchanged: a soldier who has left, a soldier held by another Focus Titan, and a horse are still never candidates, and a Down or carried soldier still meets only the rows marked `down_can_meet`.
- **The ladder is the same ladder.** The same rungs in the same order, the same loudest match, the same struck-first rule, the same tie-breaks. No new rule of selection is added, so the choice stays deterministic and the GM picks nothing (ADR-0024, limit 8; ADR-0010). The step that keeps the current holder in a tie cannot fire here, because a holder who fails the Position requirement is never in the narrowed set.
- **Attention moves with it.** The soldier the evaluation returns holds the Titan's Attention from that moment, for every rule that reads it, and the entry's targets are read from them.
- **Nobody moves.** Retargeting changes Attention and nothing else; it is not a change of Position (section 5.2). The flags for this Titan stand until the card's Next step, as they do through any evaluation.
- **The fallback is retargeted too.** When nobody meets the rolled entry, the Titan takes the entry's fallback and tests that the same way, retargeting over the candidates who meet the fallback's own Position requirement. Only when nobody meets that either is the behavior Thrash. A fallback tested against the holder the rolled entry already failed against would be the same inertness this rule exists to remove.
- **When nobody qualifies at all,** Thrash is what is left, as it always was.
- **A Down comrade is a candidate.** Down soldiers meet the nearest rung like anyone else, so a narrowed set can hold nothing but Down soldiers, and the Titan will turn a kill-tier entry onto one of them. A Down soldier makes no Reaction, so every success of that card is net. Before this rule the Titan would have Thrashed instead. Keeping a Down comrade off the floor is now worth a turn.

### Draw Attention

**Draw Attention** is an unrolled action against one Focus Titan, for a soldier who holds a Position other than Distant relative to it, which means being in its zone, and is not Grabbed (decision batch 5, OQ-113; decision batch 16, 16-15). It spends the soldier's action, and Shout Them Off lets them spend their move instead (Chapter 2), as Quick Refit does for Change Canister (Chapter 4, section 4.3). It sets the loudest flag, which lasts until the end of that Titan's next card that resolves a behavior, like every flag (ADR-0024, limit 2, as amended in decision batch 3e).

While the soldier holds that flag they also count, for that Titan's ladder, as meeting every rung any other candidate meets except hooked into its body (`flags`, `loudest`, `matches`; decision batch 10, OQ-184). So the shout takes the Titan off any comrade who is not hooked into its body or On Body, which is the room ADR-0010 leaves. It moves Attention only when the Titan next evaluates its ladder, and a card that resolves nothing, the last card of a decoy's hold included, leaves the flag standing.

A Chapter 3 Fear Roll row can set the same flag with no action: the soldier holds the loudest flag for the event's Titan, if it is a Focus Titan in their zone (decision batch 16, 16-28; `attention.yaml`, `flags`, `loudest`; `data/harm/effect-types.yaml`, `draw-attention`; decision batch 7, 7-8). It lasts and is read exactly as Draw Attention's flag is.

> **Design note (OQ-113):** A shout from beyond a Titan's reach is not what turns it, and a flare from there is Break Attention, which stays. Requiring a closer Position changes one action's requirement rather than the loudest test on every ladder, and needs no bar reading for a soldier who makes noise out of reach. Chapter 6, section 6.6 reports cutters who take Draw Attention against the Sprinting Abnormal under it.

> **Design note (OQ-184):** Draw Attention set a flag on the fourth rung, under hooked into its body, nearest person in reach, and just hurt it, so the shout almost never moved a Titan: the comrade about to be mauled was usually the one meeting a higher rung, and the action that exists to pull a Titan off a comrade did nothing for the comrade who needed it. Matching every rung but the first fixes that without touching the ladder, the rungs, or any Abnormal's own ladder, because the ladder is still read as written and only the tied set changes. The first rung stays closed: a shout cannot turn a Titan off a blade at its Nape or a soldier On Body, which is exactly what ADR-0010 protects, and it can match anything below that. Because a Flight with no successes writes the same flag from any Position (section 5.2), the two are measured together, and the figures they move are ADR-0014 starting values the confirming run of the round 3 retune re-read (section 5.13).

### Break Attention and decoys

**Break Attention** is a Perception roll with Gear Dice from ODM Gear or the horse, or none for a Feint made on foot (`break_attention`):
- **Who can take it:** a soldier who holds a Position relative to the Titan, is not Grabbed, and names a decoy whose requirement they meet, while no decoy already holds that Titan's Attention.
- **Successes needed** (`needs`, `needs_rule`):
  - 1 for the soldier holding the Titan's Attention;
  - 2 for anyone else, including while nothing holds its Attention;
  - 2 for anyone against a Titan holding a Grabbed soldier;
  - **1 more for a Feint;**
  - **plus 1 for each of the Titan's decoys in a row:** each decoy that has held its Attention since the last of its cards that resolved a behavior, whoever placed it. The Titan's tracker row counts them. The count is 0 when the Titan becomes a Focus Titan, rises by 1 whenever a decoy takes its Attention, and returns to 0 when one of its cards resolves a behavior. A card that resolves nothing, under a decoy's hold, while the Titan holds a Grabbed soldier, or while no one holds its Attention, leaves the count as it is.

On a success:
- The decoy holds Attention for as many of the Titan's next cards as its Tempo, one round of its cards however the deal falls, and the Titan's decoys in a row rises by 1. Each of those cards resolves nothing and spends the Next Behavior. Only the last of them ends the hold and evaluates the ladder. None of them clears the flags, which stand until the Titan's next card that resolves a behavior (section 5.5). No decoy can be laid over one that holds.
- Each success beyond the whole need creates 1 Opening, created by the roller.
- A soldier the Titan holds is freed.

The decoys:
- **Flare:**
  - *Needs:* a flare in Squad Supply, and the Titan's eyes not Broken.
  - *Spends:* the flare when declared.
  - *Also:* fills 1 segment of every Background Titan's clock once the Break Attention, and any Hook and Cut it allows, is resolved, whether it succeeded or not. A flare seen across the field brings Titans with it.
- **Riderless horse:**
  - *Needs:* the soldier's own horse, not lame, with the soldier mounted on it or the horse in the soldier's zone (Chapter 4). It works even against Broken eyes.
  - *On success:* the soldier is dismounted with no fall, and the horse bolts. It leaves the Titan Engagement until it ends: it is in no zone, cannot be mounted or sent again, and gives no Gear Dice.
- **Thrown cloak:**
  - *Needs:* the soldier at On Body or Blind Spot, and the Titan's eyes not Broken.
  - *Spends:* the cloak, which is gone for the rest of the Titan Engagement.
- **Feint:** the soldier's own pass across the Titan's face.
  - *Needs:* the soldier at In Reach or On Body, and one of these: working ODM Gear (Chapter 4: not Jammed, with a Gas Rating above 0); mounted on their own horse that is not lame; or, on foot, a grounded Titan (section 5.7). It works even against Broken eyes.
  - *Gear:* the roll's Gear Dice come from that ODM Gear or that horse, and a roll with ODM Gear is ODM use (Chapter 4). On foot against a grounded Titan the roll has no gear item: Perception alone, with no Gas Roll and no wear. When more than one way qualifies, the soldier names one before rolling.
  - *Spends:* nothing, when declared or on a success, so a Feint can be named any number of times in a Titan Engagement.
  - *Successes needed:* 1 more than the need above.

### Abnormal ladders

An Abnormal's stat block may name its own ladder (`abnormal_ladder_format`). Its rungs are chosen from the closed `tests` list, highest first, and always begin with hooked into its body and end with nearest, as the standard ladder does. So on every ladder a Nape striker who falls short draws the Titan's next behavior, and no rung, noise included, turns a Titan off a blade at its Nape or a soldier On Body (ADR-0010, as amended in decision batch 4b; decision batch 4b, 4b-1). It is evaluated the same way, and Grabs and decoys override it the same way. The `tests` list holds six tests the standard ladder does not use, as the closed set an Abnormal's ladder chooses from (OQ-81). One of them, **current-holder** (the soldier who holds the Titan's Attention and a Position other than Distant), is for Abnormal ladders only: a Titan that keeps the soldier it last turned on names it above nearest, and a holder at Distant, mounted or on foot, does not meet it (decision batch 3e, 3e-6; decision batch 4, 4-3). The Sprinting Abnormal's ladder is in `data/titans/index.yaml` (`ladders`; Chapter 6, section 6.5). A later chapter that needs a new test adds it to `tests`.

> **Design note (OQ-81):**
> - **Ties:** keeping the holder stops Attention flickering between soldiers at the same distance. It does not keep a holder who is farther away than another candidate: the nearest rung narrows first, so the Titan turns to whoever is closest, and a Down soldier is reached only when no one stands closer (decision batch 3e, 3e-6); an Abnormal ladder naming current-holder keeps a Down holder who is not at Distant. On the standard ladder the difference is small: nearest is the highest rung met only about 1.2 times a fight, and the earlier reading kept a holder farther off than the closest candidate 0.002 times a fight or less; the rule never does (`tuning.yaml`, `prepared_squad_kill`, `nearest_rung`). A Titan meant to fixate on the one it chose names current-holder instead.
> - **Nothing holds:** a tie that the rungs, the holder, and the cards leave standing leaves Attention held by nothing until the Titan's next card. During a round the card step breaks every tie, so only the start of a Titan Engagement, when every soldier is at Distant and no cards are dealt, and an end step reach it (a tie between two Wing Squadmates of one player character would too, but a Wing holds one), and removing the old last step takes no choice from anyone. A Titan that enters mid-round, when a flare fills its clock, is evaluated with that round's cards like any other evaluation in a round (decision batch 4b, 4b-3). That step gave Attention to the soldier listed first on the Squad sheet, an order no rule sets. A standard Titan turned at its first card anyway, but the Sprinting Abnormal's current-holder rung kept that soldier for the fight, so whoever wrote the sheet chose its quarry: listing the strikers first instead of the cutters broke its bar's ceiling by 9 to 16 standard errors. Leaving the tie to the Titan's first card is what already happens when a holder dies, needs no new procedure, and moves no standard Titan's row beyond sampling (ADR-0024 and ADR-0010, as amended in decision batch 4; Chapter 6, section 6.6).
> - **Down soldiers:** a Titan that turns to one only when no one else fits lets comrades shield them by standing closer, without making a lone Down soldier safe; an Abnormal ladder naming current-holder keeps a Down holder who is not at Distant.
> - **Rescue:** a harder Break Attention that frees a Grabbed soldier is the escape "by breaking Attention" the design brief names.
> - **Decoys:** each has its own price. A flare costs supply and draws Titans, a horse is lost for the rest of the fight, a cloak works once, and a Feint is made at In Reach or On Body, within the Titan's hands, and costs gas or horse wear, or on foot its Gear Dice. A decoy cannot be laid over one that already holds.
> - **The hold:** ADR-0010, as amended in decision batch 3b, shifts Attention onto a decoy "for the Titan's next cards, as many as its Tempo". A hold of one card was half a round against a Tempo 2 Titan, and its first card of the next round usually spent the decoy before the soldier could cut: a lone Rookie reached a usable strike before the retreat in 40.5% of lone fights against it, and with the hold at one round of cards in 69.4% (Tempo 1: 69.9%). A decoy now costs a Titan the same share of its cards whatever its Tempo.
> - **Only the holder needs 1:** Break Attention is the Attention holder's own escape (ADR-0010). The review round 2 rule also let a comrade at the holder's Position need 1, and a Squadmate simply rode or flew there first: two Squadmates screening beside the holder left the Titan resolving 0.50 cards a round and dealing 0.33 Critical Injuries per fight, against 0.84 and 0.66 with helper Squadmates. Hook and Cut keeps its natural use, the holder breaking Attention for a comrade at Blind Spot.
> - **Decoys in a row:** a Titan fooled again before one of its cards has resolved a behavior comes back fixated; once one has, it can be fooled again. Batch 3's count never reset, and with a lone Rookie's few decoys (one horse, two flares, one cloak) it could leave a soldier holding Attention with no legal Break Attention and so no route to the Nape, which ADR-0010 does not allow. Counting only decoys in a row still stops a screen: two Squadmates screening beside the holder leave the Titan resolving 0.64 cards a round and dealing 0.42 Critical Injuries per fight (batch 3's rule 0.67 and 0.47; the holder-only rule with no escalation 0.61 and 0.41), and kill no faster than two helpers (66.8% by round 3 against 68.3%, both rows of the same run of `cases1.json`). A screen is a trade, not a dominant play (section 5.13).
> - **The Feint** keeps Break Attention available in every state in which a Nape strike is legal, outside a retreat (ADR-0010, as amended in decision batches 3c and 3e). A retreat closes the lone cut by design: no Nape strike is made in one (section 5.10; decision batch 5, OQ-119 and OQ-129). Its three ways follow the Nape strike's gear need: working ODM Gear, a sound horse, or on foot against a grounded Titan, where the Nape strike needs no working ODM Gear either (section 5.7). A Jam delays a Feint rather than ending it: Field Repair (Chapter 4, section 4.8) clears the Jam in the fight, and an empty canister is changed for a spare. The on-foot way closes the one gap batch 3b left, a dry soldier with no spare beside a grounded Titan at Open, who could walk to the Nape and cut it but had no decoy to name. The Feint is priced by exposure rather than by a spent item, and on foot by its missing Gear Dice as well: needing 2, the Rookie's Feint succeeds 49.6% of the time with ODM Gear or a horse and 37.7% on foot (`break_attention_on_foot`). It needs 1 more, so a Squadmate, who never Pushes and needs 3 when it does not hold Attention, rarely lands one (0.03 per fight in the screen, and 0.001 on foot against a grounded Titan). The reset keeps a holder who feints every round from blanking every card: the second Feint in a row needs 3.
> - **The lone soldier:** 69.9% of lone Rookies reach a usable strike before the retreat clock fills under the rule, against 64.6% under batch 3's rule, where 24.5% ran out of decoys first. The Feint raises a lone fight's Critical Injuries from 0.09 to 0.16 and its deaths from 1.7% to 2.7%, because it is made within reach and a soldier who can still Feint fights on (section 5.13).
> - **Flags last until the Titan acts:** ADR-0010's struck-first rule means the Titan's turn, not a moment of Attention on a card that does nothing. A hold's last card evaluates the ladder but resolves nothing, so under the earlier rule, where a flag cleared at the card that evaluated the ladder, a striker who fell short took Attention for that one card, lost the flag, and was almost never the target of a behavior. Under one lifetime for every flag, the Titan's next resolved behavior after a hold that ended on a flagged striker lands on that striker 98.9% to 99.8% of the time (measured before decision batch 13's retargeting, which turns that behavior onto a comrade when it cannot reach Blind Spot; the rerun re-reads it), against 0.0% to 0.5% under the earlier rule; the rest die, go Down, or are Grabbed first. Such holds come 0.15 times a fight with Hook and Cut and Hamstring Line, 0.26 to 0.29 with the screen beside the holder, and 0.10 in the Small Titan's screen, measured to the 12-round horizon before decision batch 5 (`decoys`, `flags_under_a_hold`; ADR-0024, limit 2, and ADR-0010, as amended in decision batch 3e). The striker who takes Attention on the hold's last card cannot cut again until the Titan has acted, which is ADR-0010's restriction doing its work. A separate rule for a card that comes up while the Titan holds a Grabbed soldier buys nothing: such a card finds a flag standing 0.03 times a fight, and the rows with and without it differ within sampling, so the one rule stands and a Titan cut while it holds a soldier turns on the one hooked in its Nape.
> - **Rejected:** barring any decoy on a Titan whose last card a decoy spent restores fewer of a screened Titan's cards than escalation does (0.56 against 0.60 a round, each added to the review round 2 rule). For the lone soldier it trades strikes for harm (64.3% reach a strike before the retreat, with 3.86 Titan cards, 0.18 Critical Injuries, and 3.1% devoured per lone fight), and under decoys in a row with the Feint it is moot. Turning a decoyed card into Thrash would knock a lone striker off the Titan before their cut, and a limit per round does nothing against a Tempo 1 Titan.

---

## 5.7 Harming Titans

`titan-harm.yaml` holds everything in this section. Titans have no Health (ADR-0007).

### Body Parts, Toughness, and states

Each Body Part kind lists the Positions it is struck from (`body_part_kinds`):
- **Eyes:** On Body or Blind Spot.
- **Arms and legs:** In Reach or On Body.

A Body Part strike is Strength with Gear Dice from a Blade Set (`body_part_strikes`). It needs:
- the Position its kind names;
- the Body Part not already Broken;
- the striker not Grabbed;
- working ODM Gear if made from On Body or Blind Spot (Chapter 4), unless the Titan is grounded.

Take its successes one at a time:
- Each adds 1 to the Body Part's **count**.
- When the count reaches the Body Part's **Toughness**, the part moves one **Body Part State** toward Broken (Intact, Wounded, Broken) and the count returns to 0.
- Once it is Broken, each remaining success creates 1 Opening, created by the striker.

A strike with at least 1 success sets the just-hurt flag. Body Part States and counts are public, and so is a standard Titan's Toughness; a Read reveals an Abnormal's, which its public counts and state changes also show over time.

### What Broken does

- **Any kind:** an entry cannot happen while the Titan lacks enough unbroken Body Parts of each kind it uses.
- **Broken eyes:** flares and thrown cloaks no longer work as decoys against the Titan.
- **A Broken arm:** frees the soldier it holds.
- **A Broken leg:** **grounds** the Titan (`grounded`):
  - Nape strikes against it gain 2 Bonus Dice (the `grounded-titan` source).
  - Nape strikes and Body Part strikes against it need no working ODM Gear. This is the rule Chapter 4's strikes row waits for.
  - Every Body Part can be struck from In Reach, On Body, or Blind Spot, except an arm holding a Grabbed soldier, whose reach section 5.9 sets.
  - Its attachment steps can be made on foot.
  - Its Stride is 0 (section 5.5).
  - A Feint against it can be made on foot, with no gear item (section 5.6).

The Titan is grounded until no leg is Broken. When it becomes grounded, its body comes down on the soldiers in its path, and when it stands again, every soldier it pins is freed and its heave count returns to 0 (*The falling Titan*, below; decision batch 8, 8-22).

### Nape strikes

A **Nape strike** is Strength with Gear Dice from a Blade Set (`nape_strikes`). It needs:
- Blind Spot relative to the Titan;
- not holding its Attention and not Grabbed;
- working ODM Gear, unless the Titan is grounded;
- no retreat under way (section 5.10; decision batch 5, OQ-129).

Its Bonus Dice come from Openings, the grounded Titan, and Help, within the cap of 4. Every Nape strike, whatever its result, sets the hooked-by-strike flag, so a striker who falls short draws the Titan's Attention, whatever cards come between, on every ladder, since every ladder's first rung is hooked into its body (section 5.6; decision batch 3e; decision batch 4b, 4b-1). They take its next behavior when that behavior can reach Blind Spot. When it cannot, the Titan retargets to a comrade it can reach and its Attention goes with it (*Retargeting*, section 5.6; decision batch 13, 13-9), so the price of a failed strike falls on whoever is within its hands' reach.

**Making the strike counts as hooking into the Titan for the Attention Ladder only** (decision batch 13, 13-7). The striker's Position does not change: they are still at Blind Spot, anchored to their tree or their roof, and not on the Titan (section 5.2). And because the entry needs a soldier who does **not** hold the struck Titan's Attention, a striker who draws that Attention onto themselves is standing in exactly the right place and cannot strike again until the Attention moves. That is not a fault in the rule; it is the engine of the game. Getting it off them takes a comrade's Draw Attention, a Break Attention with a decoy, or the Titan retargeting to someone it can reach.

- **Reaching the Nape Depth** kills the Titan.
- **Falling short** turns each success into 1 Opening, created by the striker. Relentless adds 1 more.

A strike's successes never add to a later Nape strike except as Openings (ADR-0007).

### Openings

An **Opening** is a public token on one Titan that records who created it (`openings`). Openings come from:
- successes beyond Breaking a Body Part;
- extra Break Attention successes;
- each success of a short Nape strike, and Relentless;
- any rule that names one.

A soldier making a Nape strike spends Openings as Bonus Dice, 1 die each. Regeneration and the Titan's death erase them.

> **Design note (OQ-83):** A soldier can never spend an Opening they created. It waits on the Titan for a comrade, even if its creator dies or leaves. This answers OQ-28's Relentless case:
> - **Relentless:** it makes a short cut feed the next soldier, not the same one.
> - **Lone strikers:** a lone striker's Break Attention successes help only the comrade who follows. With them spendable, the lone Rookie would reach 15.9% at Stress 1, at the top of the 8% to 16% band that the round 3 retune widened (R4), and a lone soldier's short cut would feed their own next cut, which ADR-0007 rejected when it stopped Nape cuts adding up; the reason the successes are not spendable is that rule and not the band (section 5.13).
>
> The glossary's Opening entry says the same: any comrade of the soldier who created an Opening can spend it, and its creator never can. `data/core/bonus-dice-sources.yaml`'s `opening` row carries the condition (OQ-90).

### Regeneration

Each Focus Titan's **Regeneration** clock has as many segments as its Size Class gives. It fills 1 segment at the end of each round (`regeneration`), retreat or not: a retreat stops only the Background clocks and the retreat clock (section 5.10; decision batch 6, OQ-134). When it is full:
1. Every Opening on the Titan is erased.
2. Every Body Part's count returns to 0.
3. The most damaged Body Part moves one state toward Intact: Broken before Wounded, then the one listed first in the stat block.
4. If a Body Part moved, every soldier who holds On Body relative to the Titan is scalded (*Steam*, below). If it was the Titan's last Broken leg, the Titan stands, frees every soldier it pins, and its heave count returns to 0.
5. The clock empties.

> **Design note (OQ-82):**
> - **Strike Positions:** eyes need a soldier on or above the Titan; arms and ankles are within reach from the ground.
> - **Clearing counts** makes each Regeneration a real deadline for a Squad's setup. At a clock of 2 instead of 3, the Medium kill by round 3 falls from 62% to 58%.
> - **Returning one part per clock** is what the glossary's Regeneration entry says.

### A Titan's death

Only a Nape strike that reaches the Nape Depth kills a Titan in Phase 1 (`titan_death`). In order:
1. Every soldier holding a Position gets the Nape-kill Stress relief.
2. A soldier the Titan holds is freed. For steps 3 and 4 they hold On Body relative to the dying body and are not airborne, a fall the release makes them take is resolved first, and they then land Ground in its zone (decision batch 8, 8-18; decision batch 16, 16-23).
3. **Steam:** every soldier at On Body or Blind Spot relative to it is scalded (*Steam*, below).
4. **The fall:** the body comes down (*The falling Titan*, below), unless the Titan was already grounded. Then it falls no second time: the soldiers it pins stay Pinned, now under its corpse, and corpse heat begins.
5. The Titan's Openings, Next Behavior, clock, flags, and remaining cards are removed.
6. Every attachment naming it but Pinned ends, and the detach rule applies (section 5.2).
7. The body stays on the field as a corpse, in the zone the Titan died in, and every Position relative to it is derived (section 5.2, *A corpse*).
8. If no Focus Titan is alive and no soldier is Pinned, the Titan Engagement ends, and its end steps read the Positions derived at that moment (section 5.11; decision batch 5, OQ-122; decision batch 16, 16-24).

### Steam

**Steam** is the scalding vapour of a Titan's body (`steam`; decision batch 8, 8-7; OQ-138). It is damage of Injury Type Burn (Chapter 3, section 3.1), so it reaches the Critical Injury tables only at 0 current Health. It rolls no Attack Dice, and no Reaction answers it.
- **At a kill:** every soldier who holds On Body or Blind Spot relative to the dying Titan, including one its death freed from its hand.
- **At a Regeneration fill** that moves a Body Part toward Intact: every soldier who holds On Body relative to the Titan. A fill that moves nothing releases nothing.
- Each such soldier rolls D6 once on the steam table (`steam`, `table`) and takes the damage its row gives. A Critical Injury the damage inflicts at 0 current Health has a rolled Injury Location. A soldier at In Reach or Distant takes nothing.

### The falling Titan

A Focus Titan's body comes down on the soldiers under it when it dies and when it becomes grounded (`falling_titan`; decision batch 8, 8-9, 8-17, 8-18; OQ-146, OQ-151). It is Titan harm that no Behavior Table entry deals: it rolls no Attack Dice, and no Reaction answers it.
- **The wreck:** the body takes one rating step off the zone it lands in, which is its own, resolved with the fall and before the Leap Clear rolls (section 5.2, *Wrecking*). It happens whether or not anyone is in the path; a Sparse zone's first wreck does nothing, and an Open zone takes no further step.
- **The path:** every soldier who holds On Body or Blind Spot relative to the Titan. An airborne soldier swings clear with no roll and keeps their attachment. In Reach and Distant are outside the path. So is a soldier Grabbed in another Titan's hand, and one Grabbed in this Titan's hand at its grounding, who stays Grabbed. A soldier its death freed from its hand is in the path, at On Body.
- **Leap Clear:** each soldier in the path who is not airborne, Down, or carried rolls `leap-clear`: Agility, with Gear Dice from ODM Gear or from the horse while mounted, needing 1 success. It is not an action and not a Reaction, so it spends no turn. Comrades in the same zone or an adjacent zone may Help, each spending their action, and it can be Pushed (Chapter 1, sections 1.5 and 1.8). A success clears the soldier, who lands Ground in the Titan's zone and holds In Reach relative to it. A failure pins them.
- **Down or carried:** a Down soldier in the path is pinned with no roll. A carried soldier follows their carrier: if the carrier clears, both land Ground in the Titan's zone; if the carrier is Pinned, carrying ends and both are Pinned, each with their own Critical Injury and pinning Body Part.

### Pinned

A **Pinned** soldier is held under a Titan's body (`pinned`):
1. **The pin.** They gain a Crush Critical Injury at a rolled Injury Location, which cannot be lethal and takes no net success rider. An arm or leg result is a **limb pin** of that limb; a torso or head result is a **body pin**.
2. **The pinning Body Part** (`pinning_body_part`). A limb pin names the Titan's Body Part of the same kind and side as the result: a left arm result is pinned by its left arm, a right leg result by its right leg. If that part is Broken, the other of its kind pins instead. If both are Broken, no part pins, and only Heave or the Titan standing frees the soldier. A body pin names no part. The soldier's Position at the fall plays no part.
3. **The state.** Their attachment is Pinned naming the pinning body, in its zone, so they hold In Reach relative to it, and they are not airborne. They cannot move or be moved, a Stride does not take them, and Lift Comrade never takes them (Chapter 4, section 4.7). Their state names Chapter 1's hook: a limb pin forbids Covering and Reactions, and a body pin forbids Help, Covering, and Reactions. A limb-pinned soldier keeps their action for the entries below and nothing else. A body-pinned soldier has no action and is not standing (section 5.11). A Titan's card lands on a Pinned soldier as on any soldier who cannot make a Reaction, a Grab on them lands only its crush (section 5.9), and a pending forced strike waits (Chapter 3, section 3.9).

<!-- BEGIN RENDERED: pinned-entries from data/harm/effect-types.yaml -->
| Pin | May take | Cannot take |
|---|---|---|
| Limb pin | Heave, Body Part strike (only against the Body Part that pins the soldier), Read, Call It, Rally, Draw Attention, Help, Swap Initiative Card | Nape strike, Break Attention, Break Free, Squad Tactic, Lift Comrade, Change Canister, Pass Item, Take Item, Mount or Dismount, Swap Blade Set, Shed Load, Restock Medical Kit, Fight, Shoot, Reload, Release, Treat Injury, Field Repair, Fly, Ride, Downtime Action, Squad Action |
| Body pin | Swap Initiative Card | Heave, Body Part strike, Read, Call It, Rally, Draw Attention, Nape strike, Break Attention, Break Free, Squad Tactic, Lift Comrade, Change Canister, Pass Item, Take Item, Mount or Dismount, Swap Blade Set, Shed Load, Restock Medical Kit, Fight, Shoot, Reload, Release, Treat Injury, Field Repair, Fly, Ride, Downtime Action, Squad Action |
<!-- END RENDERED: pinned-entries -->

**Corpse heat** (`corpse_heat`; decision batch 8, 8-7). A soldier Pinned under a corpse gains a Burn Critical Injury at the start of each of their turns, beginning with the first turn that begins after the fall, at the pinned limb and its side, or at the torso for a body pin. It can be lethal and takes worsening. Every turn counts, as for a `turn` time limit (Chapter 3, section 3.4). Under a living grounded Titan there is no heat; if that Titan dies, heat begins at the start of the soldier's first turn that begins after its death. A limb-pinned soldier whose pinned arm or leg is lost, as corpse heat's worsening can do at the 13-or-more row, stays limb-pinned: the pin keeps its pinning Body Part, Heave and cutting that part still free them, and the lost-limb grade applies at once (`lost_limb`; decision batch 8, 8-41).

### Heave and cutting free

A Pinned soldier is freed, landing Ground in the body's zone and so holding In Reach relative to it, in these ways and no others (`freeing`):
- **Heave** (`heave`; the Catalog entry `heave`). An action: Strength with no Gear Dice, from In Reach or On Body relative to a body that pins someone, by a soldier who is not Down, Grabbed, carried, or body-pinned. A limb-pinned soldier may Heave the body that pins them. Comrades at the same Position may Help. Each success adds 1 to the body's **heave count**, which is public and is cleared only when a living Titan stands. When it reaches the body's Heave rating (section 5.4), every soldier the body pins is freed. A Heave against a corpse costs the heaver 1 Burn damage after the roll, whatever its result; a Critical Injury it inflicts at 0 current Health lands at an arm, its side rolled. A Heave with 0 successes frees no one (decision batch 8, 8-22; OQ-158).
- **Cutting free** (`cut_free`). A Body Part strike against the pinning Body Part, from In Reach or On Body relative to the body, needing no working ODM Gear, since the body is grounded or a corpse. The limb-pinned soldier may strike it themselves. Its successes count toward that part's Toughness as any strike's do, and when it becomes Broken, every soldier it pins is freed. On a living Titan the strike sets the just-hurt flag, extra successes create Openings, and a Broken part does what its kind does. A corpse's Body Parts keep their states and counts and never regenerate, and a strike on a corpse sets no flag and creates no Opening. A body pin is never cut free.
- **The Titan stands.** A living Titan that stops being grounded frees every soldier it pins.

The end of a Titan Engagement frees no one (section 5.11).

> **Design note (decision batch 8, 8-7, 8-9, 8-17, 8-18; OQ-138, OQ-146, OQ-151):** The owner's model is Titan World's rule for Titan bodies: a roll to get clear, a soldier Pinned by a limb or by the whole body, a burn each time the Pinned soldier acts, and rescuers who Heave together. Each part keeps this game's shapes. Leap Clear is a roll a rule calls for, not a Reaction, so it spends no turn and a Down soldier is not asked to dodge. The pin is a capped Crush Critical Injury, so the danger is the heat and the other Titans, and steam is damage, so a kill does not add a Critical Injury to the Critical Injuries band. A Heave counts toward a rating as a strike counts toward Toughness, and cutting free is the Body Part strike as it stands, on the part the Injury Location roll already named. The path is On Body and Blind Spot because a soldier at In Reach stands beside the legs and steps aside, and because the baseline's cutters at In Reach are on foot; on the baseline the rule reaches the Jammed striker who cut a grounded Titan's Nape on foot, the soldier freed from a dying Titan's hand, and whoever climbed On Body. A Pinned soldier is never lifted, since a lift with no roll would leave Heave and cutting free no work. Pins per fight, Burn Critical Injuries per pin, corpse-heat deaths, and the fights that ran on are reported by the full rerun (8-14).

---

## 5.8 Read and Call It

`read.yaml` holds both.

### Read

A **Read** is an Instinct action against one Focus Titan, with no gear (`read`):
- **Who can take it:** a soldier who holds a Position relative to that Titan and is not Grabbed.
- **Successes needed:** 1.
- **Bonus:** a soldier reading from Distant gains 2 Bonus Dice (Chapter 1's `read-from-distant` source).

For each success, the reader's player picks one fact from the closed `facts` list that the Titan's kind allows, and the GM reveals it to every soldier:
- **Any Focus Titan:** the Next Behavior, in full with its Attack Dice, until a card resolves it or a decoy's card spends it. Its Severity comes only when the card that resolves it rolls.
- **An Abnormal only:** one named Body Part's Toughness, the Nape Depth, the Regeneration clock's length, or the Attention Ladder.

A standard Titan's numbers come from its Size Class row and the standard ladder, so they are public, and its Next Behavior is the one thing a Read can learn. Everything else needs no Read either (`public_without_a_read`): each Titan's Size Class and whether it is an Abnormal, Body Part States and counts, filled clock segments, Openings, the Attention holder and flags, the previous behavior, Background clocks, and the state of a Grab.

### Call It

**Call It** is an option of a Read that revealed the Next Behavior (`call_it`):
- **Successes:** it takes 2 of that Read's successes, the one that revealed the Next Behavior included. Sharp Call lowers this to 1.
- **Effect:** each target other than the reader who makes a dodge against the card that resolves the Called behavior gains 2 Bonus Dice on it (Chapter 1's `call-it` source), even when the behavior resolves as its fallback or as Thrash, and even when a retarget moves its targets. The Call It is on the entry, not on the soldier it lands on.
- **The reader:** gains nothing from their own Call It. It helps comrades only.
- **No bonus:** a target comparing an earlier dodge gains nothing.
- **Limit:** a Next Behavior can be Called once.
- **End:** the Call ends when that card is done, when a decoy's card spends the behavior, or when the Titan dies.

> **Design note (OQ-84):** The final design review's brief gave Read 2 dice from Distant, and Call It 2 dice for 2 successes. This chapter keeps both and closes the fact list. Only what the table cannot already see is a fact, so no success is spent on a public number, and against a standard Titan a Read is worth its Next Behavior and Call It. Call It helps comrades only, as teamwork (ADR-0010). Both dice sources are rows of Chapter 1's list (OQ-90). Neither was simulated: Read's needs, Call It's successes, and both dice rows are simulator starting values, and a Tactician Reading from Distant every round and Calling It is a simulator case reported against the Jam test and the PC Critical Injury target.

---

## 5.9 The Grab

`grab.yaml` holds the Grab. Chapter 3 gives its harm, and ADR-0019 its countdown.

### Grabbed

A **Grabbed** soldier is held in the hand of the Focus Titan whose Grab landed on them (`grabbed_state`).

- **What the state forbids:** its row forbids Help, Covering, and Reactions (Chapter 1's hook, OQ-18). A Grabbed soldier can still Push.
- **Position:** their attachment is Grabbed naming the holding Titan, so they hold On Body relative to it, and they move with it when it strides (section 5.5). That is a change of Position made by a rule, never by their own move, so a Drive does not count it.
- **Chapter 4 effects:** they stop being airborne, are dismounted with no fall, and stop carrying anyone. A carried soldier who is Grabbed stops being carried.
- **Move and action:** their move changes nothing, and the only action they can take is Break Free.
- **Attention:** they hold the holding Titan's Attention, and no other Titan can choose them.
- **Down:** they stay Grabbed if they become Down.

### When a Grab lands

When a behavior with a `grab` effect lands, on 1 or more Net Successes (`grab_lands`), these steps follow. None of them reads the Net Successes: the Grab takes no rider (`rider`; decision batch 8, 8-2).

1. **Hold.** The target is Grabbed by the first unbroken arm in the stat block. While it holds them, that arm's Toughness is 1 and its count is 0; its state does not change. Being Grabbed ends airborne, dismounts a mounted target with no fall, and ends being carried with no fall; a comrade the target carried is set down, and falls if the target was airborne (Chapter 4).
2. **Crush.** The target, already in the Titan's hand, gains a torso Critical Injury of Injury Type Crush that cannot be lethal (`crush_harm`; ADR-0019; decision batch 7, 7-5). It crosses off a Health box like any other, so a victim whose last box it crosses off is Down in the Titan's hand and does not fall (decision batch 5, OQ-124).
3. **Attention.** The Grabbed soldier holds the Titan's Attention.
4. **Witnesses.** Every witness makes the `comrade-grabbed` Fear Roll.

**A Pinned target.** A Grab cannot take hold of a Pinned soldier. When a grab effect lands on one, from the Titan whose body pins them or any other, only the crush lands, as the Grab's Titan attack with no rider: no hold, no Attention, no Fear Rolls, and no countdown, and the soldier stays Pinned (`pinned_target`; decision batch 8, 8-18).

### The countdown

The countdown counts the Grabbed soldier's own turns that come up after the Grab lands, including a turn spent in advance and a turn taken while Down (`countdown`). The action of the first counted turn is spent by the Grab, whether or not a dodge or anything else already spent it. If the soldier's dodge against the Grab's card, or an earlier dodge whose successes cancelled against that card, spent a later turn, because the first counted turn was already partly spent in advance, that later turn is unspent again as the Grab lands, and the first counted turn counts as spent instead (`failed_dodge`). So a soldier who dodges the Grab loses no more than one who does not, and a failed dodge never costs the second counted turn:
- **At the end of the first,** if they are still Grabbed, they are **lifted**. Lifting harms nothing, but from then on Break Free is harder and fewer soldiers can reach the hand.
- **At the end of the second,** if they are still Grabbed, the Titan **devours** them. They die, and every witness makes the `comrade-dies` Fear Roll.

Neither step is a Behavior Table entry or a Titan attack. Neither rolls Attack Dice, each happens whenever its turn ends with the soldier still Grabbed, and no Reaction answers either (ADR-0019).

While the Titan holds a living soldier, each of its cards resolves nothing and its Next Behavior waits (`while_holding`). If the Grabbed soldier dies by any rule, a Death Roll included, the Grab ends at once: the arm returns to normal, the body does not fall, and the Titan's next card evaluates its ladder and can act again (`grabbed_soldier_dies`).

### Getting free

`escapes` lists every way out, each with its reach and penalties stated in data:

| Way out | Who | Needs | Before the lift | After the lift |
|---|---|---|---|---|
| Break Free | The Grabbed soldier, not Down | 2 successes | No penalty | 2-die penalty |
| Pry Loose | A comrade with the Talent, at On Body | 2 successes | No penalty | 2-die penalty |
| Strike the holding arm | Anyone not Grabbed | 2 successes in total while the arm is Intact, 1 while Wounded | From In Reach, On Body, or Blind Spot, no penalty | From On Body or Blind Spot only, no penalty |
| Break Attention | Anyone who can take it | 2 successes, 1 more for a Feint, plus 1 per decoy in a row on the Titan | Frees the soldier | Frees the soldier |
| Kill the Titan | A Nape strike | Nape Depth | Frees the soldier | Frees the soldier |

Break Free is Strength with Gear Dice from a Blade Set, and Help applies as Chapter 1 states. Strikes from On Body or Blind Spot need working ODM Gear unless the Titan is grounded. The reach in the table holds whether or not the Titan is grounded; grounding never widens it. Only the Clear the Hand Squad Tactic widens the reach after the lift, and it removes the ODM Gear need from every strike on the arm (section 5.12).

Once the soldier is freed (`release`):
- **Before the lift,** they land Ground in the holding Titan's zone, with no fall, and hold In Reach.
- **After the lift,** they fall from On Body's height and land Ground in that zone, In Reach.
- **Either way,** the arm's Toughness returns to normal with a count of 0, and the Titan's Attention is held by nothing until its next card, unless a decoy freed them.

> **Design note (OQ-85):** The rescue structure is:
> - **Before the lift:** one strike per comrade in reach, with no strike penalty.
> - **After the lift:** the reach narrows, so a comrade must spend a move to get to the hand, and the victim's own Break Free takes a 2-die penalty.
> - **The victim's first action:** the Grab spends it, dodge or no dodge, so declining to dodge a revealed Grab gains nothing. Alone, a victim whose dodge failed dies 69.9% of the time, and one who did not dodge 73.1%. If the victim's first counted turn was already spent in advance, a failed dodge gives back the later turn it spent, so it never costs a second Break Free: alone, 70.1% against 73.0%. The same refund covers a dodge whose successes cancelled against the Grab's card, so on a Tempo 2 Titan a failed dodge against the first card never leaves the Grab both counted turns spent (OQ-99).
>
> ADR-0014, as amended in decision batch 3 (OQ-95), defines "comrades close" as one comrade in reach with the reference build and starting state, the arrangement OQ-50's six cells test: all six pass, with the Stress 2, no-Grief cell at 33.4%. With more comrades close, or in the full Squad fight, a Grab kills far less often, and that share is reported beside the target, not tuned. Figures are in section 5.13.

### Witnesses

For `comrade-grabbed` and `comrade-dies`, a **witness** is every soldier who, when the event has been fully resolved, is alive and holds a Position in the Titan Engagement, other than the victim (`engagement-flow.yaml`, `witnesses`). A soldier who has left is not a witness. A Down witness makes no Fear Roll (Chapter 3). One event gives each soldier at most one Fear Roll.

> **Design note (OQ-86):** A Titan eating a soldier is seen across the field, so every soldier still in the fight witnesses it. Limiting witnesses to nearby soldiers would let spacing avoid Fear, and the OQ-50 cells assume every rescuer rolls.

---

## 5.10 Background Titans and the retreat

`background-titans.yaml` holds this section.

### Clocks

A **Background Titan** is a closing clock. Its Size Class (named by the rule that begins the Titan Engagement, or rolled at step 3 of the interim setup table, section 5.1), stat block, and clock are public, except the values of an Abnormal's stat block that `read.yaml` (`facts`) keeps hidden, and no soldier holds a Position relative to it. Its clock fills:
- 1 segment at the end of each round;
- 1 segment for each flare spent on Break Attention, once that Break Attention and any Hook and Cut it allows are resolved (`ticks`).

### The retreat clock

Every Titan Engagement also carries a **retreat clock** (`retreat_clock`). The rule that begins the Titan Engagement names its length, or the interim setup table gives it (section 5.1). It starts empty, and the tracker's Engagement line shows its filled segments (section 5.3). It fills 1 segment at the background-clocks end step of each round, after every Background Titan's clock has filled and every full clock has resolved (`ticks`, `retreat-clock`). A flare never fills it. When it is full, the Titan Engagement becomes a retreat (below).

> **Design note (OQ-126):** Before the retreat clock, no rule ended a Titan Engagement in which the Squad neither killed the Titan nor lost every soldier, and a Background clock reached the retreat only when it filled with two Focus Titans alive. The clock ends every such fight through the retreat's own rules, and it is the canon of 845 to 850: Titans gather on a fight that lasts, and soldiers who linger are lost. The interim setup gives it 8 segments. A full canister lasts a median of 8 rounds of ODM use, so the retreat begins as the gas runs low; every interim Background clock has filled by then, so a Background Titan enters before the retreat or with it; and 8 left the fewest dead of the lengths measured, because a later retreat gives the Titan more rounds to put soldiers Down before the Squad must carry them out. A flare fills the Background clocks, which already carry its cost, and not this one. Section 5.13 gives the figures.

### Entering

When a clock is full and fewer than two Focus Titans are alive, the Background Titan becomes a **Focus Titan** (`full_clock`):
- It takes the next unused label and starts clean.
- It enters at the **entry zone**: the edge zone that holds no soldier and is farthest from the nearest soldier on the field, a tie going to the lowest-numbered; if every edge zone holds a soldier, the edge zone holding the fewest, then the lowest-numbered (`zones.yaml`, `entry_zone`; decision batch 16, 16-29). A Background Titan has no zone until then.
- Every soldier's Position relative to it is derived, so every soldier in another zone holds Distant, and it evaluates its Attention. At the background-clocks end step no cards choose, so a tie the rungs leave standing leaves its Attention held by nothing until its first card. When a flare fills its clock mid-round, that round's cards break the tie (section 5.6, evaluation steps 5 and 6; decision batch 4b, 4b-3).
- Soldiers make the `second-focus-titan` Fear Roll if it is the second Focus Titan, or the `abnormal` one if it is an Abnormal.
- It is dealt cards from the next round, and it strides from its first card. Two Focus Titans stride independently.

### The retreat

At most two Focus Titans are ever in play. The Titan Engagement becomes a **retreat** (`retreat`) when a Background Titan's clock fills while two Focus Titans are alive, and that Titan does not enter, or when the retreat clock is full:

- No Background Titan's clock fills again, the retreat clock does not fill, and no Titan enters. Each Focus Titan's Regeneration clock still fills (decision batch 6, OQ-134).
- **Moves are forced.** Every soldier who holds a Position and is not Down, Grabbed, or carried must use each move on one of the options below, their choice. A retreat narrows the soldier's own move and does not replace it, so an ODM move made under a retreat is a Flight like any other: it is rolled, each success is 1 Momentum, and no successes sets the loudest flag (section 5.2; decision batch 10, 10-5, OQ-186). A Fear Roll result's forced step is not the soldier's move and is never a Flight (section 5.2). The options are:
  1. **Out.** One step their move can make, the first of these that applies: from On Body or Blind Spot, an attachment step to free, or letting go if they cannot make one; from free in a zone holding a body, a zone step into an adjacent zone one ring further out, or, from an edge zone, option 2; from free in a zone holding no body, a zone step one ring further out. Among the zones a step may enter, those holding no body come first, then the farthest from the nearest living Focus Titan, or from the nearest corpse when none is alive; a tie left over is the soldier's choice.
  2. **Leave,** from an edge zone, free, whatever body stands in that zone.
  3. **Toward a fallen comrade:** a step that lowers the number of zones between them and a Down, Grabbed, or Pinned comrade who is not carried.
  4. **Stay:** a move that changes nothing, if they are already in such a comrade's zone and have already taken, earlier this turn, an action for that comrade: Treat Injury, or, for a Grabbed comrade, Pry Loose, a strike on the holding arm, or Break Attention against the holding Titan; or, for a Pinned comrade, Heave against the pinning body or a strike on the pinning Body Part (decision batch 8, 8-21). Lift Comrade is not on this list: a soldier who lifts a comrade carries them, and heads out by option 1 or 2.
- For 3 and 4, a Grabbed comrade is in the holding Titan's zone and a Pinned one in the pinning body's zone, and the number of zones between two soldiers is the distance between their zones (`background-titans.yaml`, `retreat`, `moves`; decision batch 16, 16-27).
- A soldier who can do none of these may let go, or change nothing.
- **The stay limit.** Options 3 and 4 for a comrade the limit covers are open only on the retreat's first rounds, as many as its retreat clock has segments, counted from the round after the one in which the retreat began, which the Engagement line records (section 5.3). The limit covers:
  - a comrade Pinned under a corpse, in every retreat, whether or not a Focus Titan is alive, so a Titan that enters during the run-on does not lift it (decision batch 8, 8-36);
  - every comrade, Pinned, Down, or Grabbed, while no Focus Titan is alive (decision batch 8, 8-32; OQ-163).

  From the next round on, no soldier steps toward or stays with a comrade the limit covers: each such move is option 1 or 2, or, for a soldier who can make neither, letting go or changing nothing. While a Focus Titan is alive, a Down or Grabbed comrade, or one Pinned under a living Titan, has no such limit. Since no Nape strike is made in a retreat, the limit on every comrade binds only a retreat that began after the last Focus Titan died, while a soldier lay Pinned. From the first round past the limit, in every retreat, a soldier whom a lost-limb grade forbids every move is not standing (section 5.11; decision batch 8, 8-34 and 8-36).
- **Order.** On each turn the forced moves bind, the move comes before the action (`order`; decision batch 5, OQ-119), with two exceptions:
  - a stay-with-a-comrade move (option 4) comes after the action taken for that comrade;
  - a move on a turn whose action is Lift Comrade comes after the lift, so a soldier in a Down comrade's zone can lift them and carry them out by option 1 or 2 in the same turn (decision batch 5, 5-13).
- **No return.** A soldier who has left cannot come back.
- **Actions are not limited** by the retreat, only ordered after the forced move, so soldiers still carry comrades out, with one exception: **no Nape strike is made during a retreat**, neither on a soldier's own turn nor through Hook and Cut (`actions`; decision batch 5, 5-15, OQ-129). Body Part strikes, Break Attention, Pry Loose, Treat Injury, and Lift Comrade are all still taken.

**Why a retreat always ends** (`retreat`, `termination`; decision batch 16, 16-27). A soldier bound by the retreat who takes option 1 or 2 on each of their moves leaves within five of them: at most two to become free, at most two to reach an edge zone, and one off field. A Stride never lengthens this, because it frees a soldier at Blind Spot and changes no soldier's ring; a Grab stops the soldier's moves as it always has, and its release leaves them free. The stay limit bounds options 3 and 4 as it always has.

> **Design note (decision batch 16, 16-27):** With a Titan that follows, the old retreat would not end: a soldier on foot stepping out of a Medium Titan's zone is caught again by its next card, every time. Letting the step off field be taken from any edge zone during a retreat, whatever stands there, is what makes it end, and "one ring further out" is the design's "one zone directly away" made countable on a printed sheet.

> **Design note (OQ-87):** A retreat keeps the Titan Engagement running until everyone is out or the Titans are dead. Ending it at once would skip the escape that makes it dangerous. The forced moves still let a soldier go back for a Down, Grabbed, or Pinned comrade, so a retreat never makes a Squad abandon one while a Focus Titan lives, except beside a comrade under a corpse, where the Squad stays as long as the retreat clock ran, then walks out, and a comrade still Pinned dies under the body (decision batch 8, 8-21, 8-32, and 8-36). A living Titan is its own clock for the soldiers it can reach, since its cards land and a grounded Titan that stands frees the Pinned. Beside a corpse nothing else is: a Titan that enters during the run-on finds every soldier at Distant, where a standard Titan's entries give only Stress or knock a soldier loose, corpse heat kills only by the day, and a comrade whose every success is cancelled could stay beside a limb-pinned soldier on every turn, so without the limit the Titan Engagement would never end. Staying beside such a comrade needs a rescue action first, so a Down comrade no one lifts cannot hold a Squad in the fight. Flares that fill clocks make the flare decoy trade one Titan's Attention for more Titans; the clock fills after the Break Attention is resolved, so a Titan that enters never interrupts it. A retreat closes the lone cut by design, and no Nape strike is made in a retreat, since a cut would keep a lone soldier fighting a Titan the clocks say to leave (ADR-0010, as amended in decision batches 3e, 5, and 5b). The ban is on the strike, not the move: a step out from On Body may be an attachment step to Blind Spot's anchors on the way to free, a step toward a Down comrade may end at a Blind Spot, and a Hook and Cut can come before the striker's own card, so the move-first order alone left three ways to a last cut (decision batch 5, 5-15). Option 4's action comes first because staying is legal only after it. The lift comes first too (decision batch 5, 5-13): the reason for the order already has a soldier who carries a comrade out lift before the move, and without it a soldier at Distant beside a Down comrade at Distant could only leave, and the comrade would be left to the Titans.

---

## 5.11 Leaving and ending a Titan Engagement

### Leaving

**Leaving** is a zone step **off field from an edge zone** (`positions.yaml`, `leaving`; decision batch 16, 16-26). A soldier may make it when they are free, not Down, Grabbed, Pinned, or carried, and the edge zone they step from holds no Focus Titan and no corpse; during a retreat that last condition does not apply (section 5.10).
- It may be a move on foot, or the last step of a mounted move or of a Flight, where it costs 1 Carry. PROVISIONAL: a Flight whose only step is the step off field pays nothing, because a Flight's first step is free whatever kind it is (OQ-204).
- A comrade they carry leaves with them, and so does their horse if they ride it. A dismounted horse stays in its zone.
- **Returning.** A later move can bring them back, but not during a retreat. It enters an edge zone of their choosing that holds no Focus Titan and no corpse, with attachment Ground, mounted or not as they left; if every edge zone holds one, any edge zone.

A soldier who has left:
- **Turns:** still takes turns, which count for every rule that counts turns (Chapter 3).
- **Move:** their move can only return.
- **Action:** any Catalog entry that needs no Position relative to a Titan.
- **Positions:** all soldiers who have left count as holding the same Position, in one place, for every rule that compares two soldiers, including Field Repair, Pass Item, Take Item, and Lift Comrade. None of them is ever in the same zone as, or one step from, a soldier still on the field.
- **Titans:** no Titan targets them, no ladder chooses them, and no Titan strides toward them.
- **Gas:** their ODM use still makes a Gas Roll.

> **Design note (OQ-76; decision batch 16, 16-26):** Chapter 3 already treats soldiers who left as one Position for Treat Injury and Rally. Extending that to Chapter 4's acts keeps one rule. Returning lets a soldier carry a comrade clear and come back for the next. The no-Titan condition on the edge zone keeps the old rule that only a soldier Distant from every body leaves; allowing the step at the end of a longer move is what gives a rider and a flier the escape a soldier on foot does not have.

### Ending

A Titan Engagement has two ending tests (`engagement-flow.yaml`, `ending`), checked once the event that made one true has been fully resolved:
- **No Focus Titan is alive, and no soldier is Pinned.** It ends at once. Background Titans that have not entered never do. While a soldier lies Pinned under a corpse after the last Focus Titan died, the rounds go on: the Background clocks and the retreat clock fill, a Background Titan may enter, and this test ends the Titan Engagement when the last Pinned soldier is freed or dies (`run_on`; decision batch 8, 8-9; OQ-146), unless no soldier standing ends it first, as the retreat's stay limit brings about (section 5.10; decision batch 8, 8-32).
- **No soldier standing:** no soldier who holds a Position is alive and not Down. This includes every soldier having left. A body-pinned soldier is not standing; a limb-pinned soldier who is not Down is, and a soldier at In Reach relative to a corpse holds a Position (decision batch 8, 8-20). In a retreat, from the first round past the stay limit (section 5.10), a soldier whom a lost-limb grade forbids every kind of move, and who is not Down, Pinned, or carried, is not standing either (`past_the_stay_limit`). Today that is the both-legs grade (Chapter 3, section 3.2). The test reads the grade, not the turn, so a soldier who loses one turn's move to a Reaction or a result still stands. It is checked as that round begins, before its wings step, and after every event from then on. The soldier keeps their Position, their turns, and every action their Position allows, and a comrade who shares their Position may still lift them, at their consent, and carry them out (Chapter 4, section 4.7): the limit closes options 3 and 4, not the lift. If the Titan Engagement then ends with no Focus Titan alive, they live and go through the end steps; if a Focus Titan is alive, they die left to the Titans with every soldier still holding a Position (below). A soldier who has lost both legs and is Pinned counts as Pinned (decision batch 8, 8-34 and 8-36; OQ-165).

When no soldier is standing, a **returner** decides how soon it ends. A returner is a soldier who has left, is alive, and is neither Down nor carried, while no retreat is under way.
- If no soldier holds a Position at all, or no returner exists, it ends at once.
- Otherwise the tracker records the round and play goes on. It ends at the round-ends step of the next round if still no soldier is standing, or at once if the last returner is gone. If a soldier stands again first, as when a returner comes back, the record is erased.

If it ends by the second test while a Titan lives, every soldier still holding a Position, each one Down or, past the stay limit, unable to move (above), **dies**, left to the Titans. These deaths have no witnesses and cause no Fear Roll, but they count for Grief. Their left items are not shared out: they leave play with the field (Chapter 4, section 4.11; decision batch 5, OQ-131). The end frees no Pinned soldier: whether or not a Titan lives, every soldier still Pinned when it ends by the second test dies, left under the body, the same death counted for Grief (decision batch 8, 8-21; OQ-157). With no Focus Titan alive, the others go through the end steps as after any kill. Then Chapter 3's end steps run, reading the Positions soldiers held when it ended and each soldier's last Position relative to a Focus Titan that died (section 5.2), and after the last of them Chapter 4 clears every Position record, with which the Titan Engagement's Anchors and every soldier's Momentum are cleared (section 5.2; decision batch 5, OQ-122). The GM never ends a Titan Engagement: only these tests do (ADR-0024; the list in Chapter 1, section 1.1, item 6).

**A Titan Engagement always ends** (`always_ends`): by a kill, by no soldier standing, or by the retreat its retreat clock forces. The retreat's forced moves take every standing soldier out, no one returns during it, and once no standing soldier holds a Position the ending tests end it at once (decision batch 5, OQ-126). After the retreat's first rounds, the stay limit closes the moves toward and beside a comrade Pinned under a corpse in every retreat, and beside every comrade while no Focus Titan is alive (section 5.10), so every standing soldier walks out from beside the corpse, even under a Titan that entered during the run-on. A limb-pinned soldier left alone is still standing, and the rounds go on for them. Corpse heat crosses off one of their Health boxes at the start of each of their turns, and they cannot treat themselves, so they go Down unless they free themselves first, which, with no Focus Titan alive, ends the Titan Engagement by the first test. Once no one stands, the second test ends it, and every soldier still Pinned dies under the body (decision batch 8, 8-21, 8-32, and 8-36; OQ-163). A soldier whom a lost-limb grade forbids every move does not keep it running past the stay limit, whether or not a Focus Titan is alive, since a Titan whose entries never reach them is no clock (decision batch 8, 8-34 and 8-36; OQ-165; above). The Squad may still leave earlier by choice.

> **Design note (OQ-88):** Down comrades left in the fight die, which makes carrying them out (Chapter 4) the way to save them. Letting them survive would let a Squad abandon them at no price. Running Titan cards against Down soldiers with no one left to act would be rounds with no choices. A comrade who has left gets one more round to come back for them, so the test never kills soldiers someone could still reach.

---

## 5.12 Squad Tactics

`squad-tactics.yaml` holds the rules and the list.

A **Squad Tactic** belongs to the Squad. Each one the Squad holds can be used once per Titan Engagement, when its condition is met. Using it is an option, not an action, and it changes `squad-tactic-use` through the `squad-tactic` option. Each tactic names who declares it and when (`declared_by`, `when`), and a use is spent once declared. When several players may declare the same use at once and disagree, the usual roll-off decides (`several_declarers`), and a Squadmate's part follows Chapter 2's directing rules.

A Squad holds two tactics, chosen by the players before its first Titan Engagement. Disagreements go to the usual roll-off. A later rule may add more.

| Tactic | Condition | Declared by, and when | Effect |
|---|---|---|---|
| Hook and Cut | A Break Attention against a Titan has just succeeded, a comrade at Blind Spot with an unspent action can make a Nape strike, and no retreat is under way (section 5.10) | That comrade's player, once every success step of the Break Attention is resolved, a freed soldier's release included, and before any other rule acts | That comrade strikes the Nape at once, and may spend the Break Attention's Openings |
| Hamstring Line | A leg strike is Helped by at least one comrade | The striker's player, after Help and before the roll | If the strike has at least 1 success, it gains 1 more |
| Clear the Hand | A soldier has been Grabbed and lifted, and a comrade declares a strike on the holding arm that only this tactic allows | That comrade's player, as the strike is declared | Until that Grab ends, every strike on the holding arm can also be made from In Reach, and none needs working ODM Gear |
| Fall Back | The wings step begins, with a soldier at On Body or Blind Spot who is not Down, Grabbed, or carried | Any such soldier's player, before Wings are assigned or kept | Each such soldier not Down, Grabbed, or carried may detach instead, Anchored if airborne and Ground if not, in the same zone, and so hold In Reach, with no fall; each player chooses for their own soldier |

> **Design note (OQ-89):** Each tactic rewards a different kind of coordination:
> - a decoy and a cut;
> - Helped leg strikes;
> - a rescue;
> - a pull-back.
>
> Holding two makes the choice matter, and naming a declarer and a moment for each leaves no use to argue over. In the full-fight model with 4 player characters, every tactic, alone or paired, keeps the median kill in round 3 (section 5.13). Hook and Cut's Break Attention follows section 5.6: it needs 1 only when the Attention holder makes it, 1 more for a Feint, and 1 more for each decoy the Titan has fallen for since one of its cards last resolved a behavior. The six Grab cells with each tactic held, and tactic policies beyond the probe's, are simulator cases.

---

## 5.13 Tuning (ADR-0014)

> **Stale until the zone rerun (decision batch 16, 16-38).** Every figure, verdict, target reading, band, and bar limit printed in this section was measured before zones and the Stride, and **every one of them is stale** until batch E's rerun measures the rules as they now stand. They stay printed as the record of the rules they measured. The rerun reports every Critical Injury and deaths band with zones and the Stride; rounds to the first Nape strike and to the kill; the share of a Titan's cards that resolve Thrash and that retarget; the share of cards whose Stride brought the holder into reach; round 1 on its own; Help on a Nape strike from an adjacent zone; Momentum gained and spent per fight and the share of Flights that Carry; wrecked zones per fight and fights in which the Titan's zone lost its Blind Spot; retreats and their length; and each value OQ-200 and OQ-202 hold. The levers, in order, are the Stride, then the Carry limit and the mounted pace, then the terrain mix; Attack Dice, Nape Depth, and Tempo stay in reserve. ADR-0014 and the tuning files change only by the retune's own decisions after the report.

Every value in `size-classes.yaml` is a starting value for the ADR-0014 simulator in `tools/sim/`, whose report is `docs/reviews/simulator-report.md`. So are:
- the Grab needs, penalties, and reach in `grab.yaml`;
- Break Attention's needs;
- Read's needs, Call It's successes, and their Bonus Dice rows in Chapter 1;
- the anchors each Anchor Rating gives, its Carry cost, the Carry limit and the mounted pace (measured and kept by the zone retune, Z4; OQ-200), what a point of Momentum buys, and the Terrain Traits (section 5.2);
- each Size Class's Stride and the Sprinting Abnormal's (section 5.4; measured and kept by the zone retune, Z1: at every reference start a Stride is taken over one zone, so values above 0 read the same);
- the terrain mix of the interim setup table (section 5.1; measured and kept by the zone retune, Z4; OQ-202);
- the Background clock lengths.

The probe figures in this section's tables were measured with each entry's fixed need of dodge successes, before Attack Dice replaced it at 3 dice per point (decision batch 8, 8-1), and stand as that record. Every verdict in this section reads the confirming run of the round 3 retune (`docs/reviews/simulator-report.md`; `docs/reviews/round-3-retune-decisions.md`, R6), in which every ADR-0014 target and every per-table band is Met, at each reference start and on the bar's runs of it, and no fight reached the safety cap (sections 1, 3, and 6.12).

Every figure, target, band, and bar limit in this section is measured at Standard Circumstances with no rulings: no framing beyond the setup table and no improvised acts. A table's rulings change what happens on a given night, not what these figures mean, and the playtest logs every non-Standard step named in a Titan Engagement, the roll it was named on, and every framed start (ADR-0014, as amended in decision batch 9, 9-17; OQ-167).

**Measured together on the confirming run, before zones.** Flight, Momentum, Anchors and the `wreck` effect, the loudest flag's match on the ladder, the mounted charge, the blade swap that spends the move, and the Flight a retreat's own move still is (decision batch 10, OQ-182 to OQ-186), decision batch 11's Gear Die re-roll on the Push with its wear cap and its issued ODM Gear rating (OQ-187), and decision batch 13's Health, retargeting, and Frenzy (OQ-190, OQ-192, OQ-193) were all measured on one run, the confirming run of the round 3 retune (`docs/reviews/round-3-retune-decisions.md`, R6; the report it rendered is dated 2026-09-20). Every figure, target, band, and bar limit printed in this section is that run's, as `docs/reviews/simulator-report.md` renders it. The probe figures in the tables below were measured before those rules and stand as the record of the rules they measured.

`tuning.yaml` (`starting_values`) lists them. The simulator re-measures each with the full rules. When it changes one, the YAML file changes and this chapter follows. The numbers below come from the files at the time of writing; if the files change, the files govern.

**Probes.** The figures below come from the probe scripts in `tools/probes/chapter-05/`, which stood in for the simulator before it was built. The current measurement is the simulator's report, `docs/reviews/simulator-report.md`. `tuning.yaml` (`probes`) says what each script models, states every model and policy in full, and gives the exact command behind each table (`commands`), so any figure can be run again. The scripts need Python with PyYAML.

> **Design note (OQ-98):** ADR-0014, as amended in decision batch 3, measures each target under the baseline policy `tuning.yaml` states for it: the reference Squad's roles, striking and dodging choices, and rescues, with no Read, Call It, Wings, initiative swaps, Squad Tactics, or Background Titans unless the target names them. Sensitivity rows are reported beside each target and not tuned: every Squad Tactic alone and in pairs (`squad_tactics`), decoy screens (`decoys`), and helper Squadmates; a Tactician Reading and Calling It, and Pry Loose, are simulator cases. Every value is a starting value until the Phase 1 simulator, which models every rule and every reference-build action under published policies, re-measures it (`simulator_cases`).

**Builds.** The builds are ADR-0014's reference builds, recorded field by field in `tuning.yaml` (`builds`):
- **Rookie:** Strength 4, Agility 3, Wits 2, 3 elsewhere, Health 6, ODM Gear and horse 2, other items 1, Talent 1, and Stress 1 when a fight begins.
- **Veteran:** Strength 5, Agility 3, Health 6, Resolve 5 from two Scars, every item 2, Talent 2, and Stress 2.
- **Levi-grade:** Strength 6, Agility 4, 4 elsewhere, Health 7, every item 3, Talent 3, and Stress 2.

Talent dice apply to the Nape strike, Body Part strike, Break Free, and Treat Injury, never to the dodge, Fly, Break Attention, Ride, or Read. Every model Pushes when short, adds Stress on each Push, and applies Stress Responses and Push wear.

### A prepared Squad kills a Medium Titan in about 3 rounds

> **Design note:** Four Rookie player characters at Stress 1 fight the reference Titan in Wooded terrain (`prepared_squad_kill`):
> - two cutters strike the more damaged leg from In Reach, Helped by up to two comrades with an action to spare;
> - two strikers make Nape strikes from Blind Spot, either *eager* (whenever they can) or *waiting* (until others' Openings and the grounded Titan give 2 Bonus Dice, or round 3);
> - soldiers dodge every harming behavior, or only Grab and Bite;
> - on a Grab, everyone but a ready striker goes for the hand.
>
> The model includes the standard ladder, Regeneration, Openings with creators, grounding, turn debt, Jams, falls, gas, Critical Injuries crossing Health boxes, Death Rolls, witnesses' Fear Rolls, Break Attention's needs with decoys in a row, the Feint, a decoy's hold, flags that last until the Titan's next card that resolves a behavior, the nearest rung met at the closest Position, and a tie no card can break leaving Attention held by nothing (section 5.6), and the Grab as section 5.9 states. Its screen feints only with working ODM Gear; the on-foot Feint is a sensitivity row (below). It has no Read, Wings, swaps, or Background Titans; Squad Tactics and the other Grab escapes appear only in the rows that name them. Every fight runs under a retreat clock of 8 segments (section 5.10). A fight the Squad has not won by then becomes a retreat: standing soldiers go for a Grabbed comrade, lift and carry out every Down comrade they can reach, and otherwise head out, and a soldier left holding a Position dies. The model takes no Treat Injury, Nape strike, or Squad Tactic during a retreat, so its deaths are an upper reading (`prepared_squad_kill`, `model`, `retreat`). No fight reached the model's safety cap of 60 rounds.
>
> | Case | Median kill round | By round 3 | By round 4 | No kill | Critical Injuries per fight | Deaths per fight during the fight |
> |---|---|---|---|---|---|---|
> | Medium, eager, dodge when harmed (the reference) | 3 | 62.0% | 72.9% | 8.3% | 0.72 | 0.049 |
> | Medium, strikers wait | 3 | 61.2% | 72.0% | 7.9% | 0.75 | 0.046 |
> | Medium, dodge only Grab and Bite | 3 | 65.4% | 76.4% | 8.7% | 0.91 | 0.065 |
> | Medium, from Stress 0 | 3 | 59.0% | 70.8% | 7.5% | 0.73 | 0.038 |
> | Medium, 4 player characters and 2 helper Squadmates | 3 | 68.3% | 78.8% | 5.4% | 0.66 | 0.014 |
> | Medium, template Squad (reported, not tuned) | 4 | 48.8% | 59.6% | 14.9% | 0.88 | 0.096 |
> | Medium, 4 eager strikers and no cutters (reported, not tuned; OQ-112) | 3 | 78.8% | 88.8% | 1.6% | 0.44 | 0.015 |
> | Small, Tempo 2 | 2 | 80.8% | 90.7% | 2.2% | 0.85 | 0.056 |
> | Large, Tempo 1 | 3 | 61.0% | 73.0% | 14.3% | 1.32 | 0.212 |
>
> **The deaths column.** The deaths in this table are deaths during the fight, because `fight.py` runs no end steps (`prepared_squad_kill`, `deaths_per_fight_reading`). A band or bar limit that names deaths per fight reads deaths through the end of the Titan Engagement: the fight's own deaths and those of its end steps (decision batch 5, 5-19). Read that way, Chapter 6's Medium band (at most 0.15 deaths per fight at the standard Medium Titan's reference start, re-set by the round 3 retune to what retargeting and Frenzy measure) is Met: the confirming run gives 0.1284 deaths through the end (standard error 0.0050) and 0.1220 during the fight at that start, and 0.1376 and 0.1363 through the end (standard error 0.0016; 0.1301 and 0.1290 during the fight) in the two Squad sheet orders (`docs/reviews/simulator-report.md`, section 3). The band read at most 0.05, then at most 0.06 (decision batch 7, 7-13); decision batch 8, 8-31, re-set it to 0.08 and decides OQ-132 anew, with no value or rule changed for it; the round 3 retune (R2) re-set it to 0.15, because retargeting and Frenzy, the rules the owner chose, measure there at Frenzy's halved rate (Chapter 6, section 6.6).
>
> The target is met on the confirming run: the median kill round is 3 under every Medium policy at the reference start (72.3% by round 3 for the reference, 68.2% with strikers waiting, 72.8% dodging only Grab and Bite, 70.4% from Stress 0; `docs/reviews/simulator-report.md`, section 10), and on the standard Medium Titan 45.2% are killed by round 2 and 71.8% by round 3, with 45.5% and 72.3% on this chapter's reference Titan (section 1). A median target is read exactly (ADR-0014, as amended in decision batch 5). The target is read under the baseline policy, two cutters and two strikers (ADR-0014, as amended in decision batch 4b). After decision batch 5 every row of `cases1.json`, `cases2.json`, and `cases3.json` was re-run on the same seeds under the retreat clock, and the rows here are that run; the rows measured before it, to a 12-round horizon that counted a fight still going at round 12 as no kill, are withdrawn (`prepared_squad_kill`, `rerun`). The kill rounds moved within sampling (the reference: 62.0% by round 3 against 62.8%), and the harm rose by the retreat's deaths (0.049 deaths per fight against 0.029). In the reference row 8.3% of fights end in a retreat, which carries out 0.07 Down comrades per fight and leaves 0.020 soldiers to the Titans; in the Large row 13.5% do, carrying out 0.16 and leaving 0.150. The confirming run gives 4.1% and 4.8%, carrying out 0.017 and 0.018 Down comrades per fight and leaving 0.026 and 0.046, with no fight at the safety cap over any of its full-fight runs (`docs/reviews/simulator-report.md`, section 6.12).
> - **Four strikers (decision batch 4b, 4b-2).** Four eager strikers and no cutters kill sooner and take less harm than the baseline Squad: on the confirming run 79.4% by round 3 (median round 3, on the boundary), 0.55 Critical Injuries, and 0.058 deaths per fight during the fight (0.066 through the end), against the reference's 72.3%, 0.81, and 0.103 (0.115 through the end), with 4.19 Nape strikes and 0.26 Body Part strikes a fight against 3.01 and 4.53 (`docs/reviews/simulator-report.md`, sections 6.8 and 10). The probes gave 78.8%, 0.44, and 0.015 in the row above (`cases2.json`, 12,000 fights, median round 3), and, to the 12-round horizon before decision batch 5, 78.4%, 0.43, and 0.008 with a median kill in round 2 at 60,000 fights, against the baseline's 61.9%, 0.71, and 0.030 in the same run (`tools/probes/batch-4b/strikers_b4b.out`), so its median sits on the boundary of rounds 2 and 3. They make 4.2 Nape strikes a fight against the baseline's 3.0, and 0.3 Body Part strikes against 4.5: a striker who falls short holds Attention at Blind Spot, where the Titan's rolled entry more often reaches nobody and the card comes out as Thrash's knock-loose, 26.9% of its cards against the baseline's 15.8% (section 6.15), while cutters stand In Reach, where the Grab and the Bite apply. Chapter 6, section 6.6 reports the same row on every table. The row is reported beside the target and not tuned. That cutting legs is the worse policy is an open question (OQ-112), left to a decision that can redraw the Behavior Tables: of the two levers batch 4b measured to that horizon, turning the Titan on a Blind Spot holder doubles the baseline's harm (1.14 Critical Injuries and 0.061 deaths) and leaves four strikers ahead, and grounded-titan Bonus Dice of 3 leave the gap standing (the baseline 65.8%, 0.66, 0.025; four strikers 78.6%, 0.42, 0.008).
> - **Medium pools:** on the confirming run, Attack Dice of 3, 6, 6 give 0.59 Critical Injuries per fight, and 6, 9, 9 give 0.92, with the kill round unchanged at 3 (the probes, at fixed needs of 1, 2, 2 and 2, 3, 3: 0.51 and 0.87). The chosen 3, 6, 9 (0.81) sits between them (`docs/reviews/simulator-report.md`, section 10).
> - **Rejected Medium values:** on the confirming run, Regeneration 2 gives 65.0% by round 3 against the reference's 72.3%; Nape Depth 3 a median of round 2; Nape Depth 5 a median of round 4, with 20.0% of fights ending with no kill; Tempo 2 deals 2.04 Critical Injuries and 0.427 deaths per fight during the fight, against 0.81 and 0.103 (the probes: 57.1%, 2.12, and 0.41).
> - **Large:** no Chapter 5 target measures it, and Nape Depth is the only value that moved its kill. On the confirming run, at Nape Depth 5, the value before review round 2, the median kill comes in round 4, 21.0% of fights end with no kill, and a fight deals 2.11 Critical Injuries and 0.557 deaths during the fight. At 4, 4.9% end with no kill, and a fight deals about a third more Critical Injuries than Medium and about half again its deaths (1.08 and 0.167 against 0.81 and 0.103). The probes gave 39.3%, 2.18, and 0.47 at 5, and 14.3%, 1.32, and 0.212 at 4.
> - **Helper Squadmates:** two of them move the median kill to round 2. On the confirming run it is round 2 in the helpers row, with 77.1% by round 3, and in the Squad Tactic run with the escapes, with 77.1%; holding Hook and Cut and Hamstring Line it stays round 2 (80.2%).
> - **Decoys** (OQ-81; `decoys`, `titan_cards_resolved_per_round`): on the confirming run, two Squadmates screening beside the Attention holder under the rule deal 0.57 Critical Injuries per fight and kill 74.9% by round 3 (median round 2, on the boundary), against the helpers' 0.71 and 77.1% at a median of round 2, so the screen is still a trade and no faster than helpers (`docs/reviews/simulator-report.md`, section 10). The probes' figures follow, under each entry's fixed need: with 4 player characters and 2 helper Squadmates, the Titan resolves 0.84 cards a round and deals 0.66 Critical Injuries per fight. Two Squadmates who ride or fly to the Attention holder's Position, send their horses, and throw their cloaks leave it 0.50 cards and 0.33 under the review round 2 rule. Under the rule, where they then Feint as well, the same screen leaves 0.64 cards and 0.42, with 0.13 Grabs, 0.79 decoy cards, and 0.55 Squadmate Feints rolled and 0.03 landed per fight, and a median kill in round 3 (66.8% by round 3, no faster than helpers). Batch 3's rule gives 0.67 and 0.47; decoys in a row without the Feint 0.64 and 0.44; the holder-only rule with no escalation 0.61 and 0.41; and, each added to the review round 2 rule, batch 3's escalation 0.60 and 0.41 and the rejected decoy cap 0.56 and 0.36. Squadmates who stay at Distant to send their horses, then fly in to throw their cloaks, leave 0.65 cards and 0.44 under the rule; when every Break Attention needs 1, they leave 0.41 and 0.22. Letting the screen also Feint on foot against a grounded Titan changed nothing measured, in decision batch 3c's runs to the 12-round horizon: 0.001 on-foot Feints per fight, 0.63 cards a round, and 0.42 Critical Injuries, and against the Large Titan 0.003, 0.65, and 0.88 (`decoys`, `on_foot_feint`). Flags that last until the Titan's next card that resolves a behavior move no row here beyond sampling: in the screen beside the holder a hold ends with Attention on a flagged striker 0.26 times a fight, and the Titan's next behavior then lands on that striker 99.8% of the time, with 66.6% killed by round 3 and 0.43 Critical Injuries against 67.2% and 0.46 before batch 3e (`decoys`, `flags_under_a_hold`, to the same horizon). The screen rows for the Small Titan, whose two cards a round a decoy's hold covers, and for every other Chapter 6 table are in Chapter 6, section 6.6, under the flag rule.
> - **Squad Tactics:** with 4 player characters and the Grab escapes in the policy, every tactic alone and every pair keeps the median kill in round 3 on the confirming run, with 71.5% (Fall Back) to 74.2% (Hook and Cut with Hamstring Line) killed by round 3 and 0.74 to 0.83 Critical Injuries per fight; holding Hook and Cut and Hamstring Line, 2 helper Squadmates give a median kill in round 2 (80.2%, 0.65), and 2 Squadmates screening beside the holder round 2 as well (77.6%, 0.53) (`docs/reviews/simulator-report.md`, section 10). The probes gave 61.5% (Fall Back) to 65.8% and 0.62 to 0.71. Hook and Cut is used in about 1 fight in 3 and Hamstring Line in nearly every fight; Clear the Hand and Fall Back rarely meet their conditions. In the probes, holding Hook and Cut and Hamstring Line, 2 helper Squadmates gave a median kill in round 2 (71.9% by round 3, 0.58 Critical Injuries per fight), tipping the helpers' boundary, and 2 Squadmates screening beside the holder round 3 (70.0%, 0.40, 0.59 Titan cards a round). The Grab escapes moved no figure beyond sampling, because a rescuer who can reach the hand strikes it (`squad_tactics`; OQ-89, OQ-98).

> **Design note (OQ-78):** The Size Class values in `size-classes.yaml` are chosen as above. The first draft's figures came from an uncommitted model started at Stress 0 that a reviewer could not reproduce; these are re-run at Stress 1 with the model committed. Eyes and arm Toughness were not measured; the simulator must measure them for every class, and Large against the PC Critical Injury and PC death targets. Large's Nape Depth moved from 5 to 4 after review round 2, because at 5 more than a third of Large fights never reached a kill.

### A lone soldier after Break Attention

> **Design note:** A lone soldier takes Break Attention, then at once strikes the Nape of a Medium Titan, spending no Openings they created (`solo_nape`). This fresh cut, made directly after Break Attention at the build's fight-start Stress with no other Titan card against the soldier, is where ADR-0014's band is read. Bold marks each build's Stress when a fight begins.
>
> | Build | From Stress 0 | From Stress 1 | From Stress 2 | From Stress 3 |
> |---|---|---|---|---|
> | Rookie, Nape Depth 4 | 10.0% | **13.1%** | 15.9% | 17.4% |
> | Veteran, Nape Depth 4 | 27.4% | 29.7% | **32.3%** | 33.9% |
> | Levi-grade, Nape Depth 4 | 46.1% | 47.3% | **47.4%** | 46.3% |
> | Rookie, Nape Depth 5 | 2.3% | **3.6%** | 5.2% | 6.5% |
> | Levi-grade, Nape Depth 5 | 24.6% | 26.9% | **28.6%** | 28.7% |
>
> On the confirming run, the Rookie's fresh cut at Stress 1 succeeds 15.0% of the time (standard error 0.1), inside ADR-0014's band of 8% to 16% (re-read by the round 3 retune, R4, because decision batch 11's Push re-rolls the blade's Gear Dice; 12.9% without that rule), and the Levi-grade soldier's 52.0% at Stress 2 (standard error 0.2) is inside "about 50%", which reads 45% to 55% (ADR-0014, as amended in decision batch 5; `docs/reviews/simulator-report.md`, sections 1 and 10). The probes gave 13.1% and 47.4%. Nape Depth 5 would bring the Rookie to 4.2% but drop the Levi-grade soldier to 33.4% and the prepared-Squad kill to a median of round 4.
>
> **The lone fight** (`lone_fight`) plays the line out: one Rookie, mounted at Distant, against the reference Titan's table in Wooded terrain until its retreat clock of 8 segments fills, after which the forced move comes before any action and no cut follows, with a Rookie's decoys (the horse, two flares, and the Feint), dodges, Stress, wear, Jams, gas with one spare canister, Field Repair, and the Grab. A dry soldier changes canisters, and a Jammed one repairs the harness, as their action. The soldier waits for a round in which the Titan's card has already come, moves to In Reach and takes Break Attention, and on their next turn, if the decoy still holds, flies to Blind Spot and cuts. The Rookie's Break Attention succeeds on 82.6% of attempts needing 1, 49.6% needing 2, and 20.6% needing 3.
>
> | Break Attention rule | Usable strike before the retreat | Round of the strike, median (mean) | Titan cards against the soldier before it | Critical Injuries per lone fight | Devoured | No decoy usable first | Cut succeeds | Lone fights that kill |
> |---|---|---|---|---|---|---|---|---|
> | The rule: decoys in a row, the Feint | 69.9% | 3 (3.84) | 2.46 | 0.16 | 2.7% | 0.0% | 14.1% | 9.8% |
> | The rule, with batch 3b's route check (no spare canister counted, no Field Repair) | 69.5% | 3 (3.83) | 2.45 | 0.14 | 2.4% | 5.2% | 14.2% | 9.8% |
> | Decoys in a row, no Feint | 66.9% | 3 (3.70) | 2.39 | 0.09 | 1.7% | 21.6% | 14.4% | 9.7% |
> | No escalation, no Feint (before batch 3) | 76.1% | 3 (3.73) | 2.26 | 0.06 | 1.1% | 15.5% | 14.1% | 10.7% |
> | Batch 3's rule: decoys never reset, no Feint | 64.6% | 3 (3.62) | 2.33 | 0.09 | 1.7% | 24.5% | 14.4% | 9.3% |
> | The rejected decoy cap, no escalation, no Feint | 64.3% | 4 (4.01) | 2.72 | 0.18 | 3.1% | 5.5% | 14.2% | 9.1% |
>
> "No decoy usable first" counts lone fights that end with no horse or flare left, no sound horse under the soldier, and a harness that is dry with no spare, or Jammed with neither gas nor a spare to change to. Against a standing Titan no Nape strike is legal in that state either.
>
> - **Where to break Attention:** a success is usable only if the soldier reaches Blind Spot on their next turn while the decoy still holds. So a lone soldier takes Break Attention after the Titan's card has come that round, and from In Reach, or from Blind Spot with a flare or the cloak. From Distant a strike can follow only at the Urban and Giant Forest ratings (section 5.2).
> - **The band's measurement point:** the fresh cut above is the band (15.0% on the confirming run). The in-fight cut comes after the Roars a waiting soldier takes, and on the confirming run succeeds 15.8% of the time at a mean Stress of 2.49 (the probes: 14.1% at 2.66, and 12.2% from fight-start Stress 0). It is reported beside the band and not tuned (`docs/reviews/simulator-report.md`, section 2.2).
> - **The route:** in the lone fight (Wooded), no decoy is usable before the soldier changes a canister or repairs the harness in no lone fight, the state in which no Nape strike is legal either; 24.8% are still waiting when the retreat begins, and with a retreat clock of 12 that share falls to 15.1% and 76.7% reach a strike. A Jam is repaired in the fight by Field Repair (Chapter 4, section 4.8), and an empty canister is changed for a spare. At Open a grounded Titan's Nape lies two steps from In Reach, so a Feint from On Body precedes the cut, on foot or with the repaired harness, inside the Regeneration clock's window (section 5.2). Batch 3b's route check, which counted a dry soldier holding a spare and a Jam that Field Repair clears as closed routes, gives 5.2%. The card-order model that takes Break Attention on every turn, whether or not the Titan's card is still to come, is kept as the upper bound on decoys wasted (`card_order_wait`).
> - **Tempo 2:** with a decoy holding both of the Titan's cards, a lone Rookie against the reference table at Tempo 2 reaches a usable strike before the retreat in 72.9% of lone fights on the confirming run, most often in round 4, but after 5.49 Titan cards, with 0.21 Critical Injuries (`docs/reviews/simulator-report.md`, section 10, *Lone fight on the reference table*). The probes gave 69.4%, 5.58 cards, 0.20 Critical Injuries, and 3.3% devoured. In the probes, breaking Attention after the Titan's first card of a round struck sooner (66.0%, median round 3) and paid for it (9.5% devoured, 12.4% Down). These rows are measured on the reference table; Chapter 6, section 6.6 gives each of its Titans' lone fights, and a table whose entries reach Distant gives fewer strikes.
>
> Hook and Cut (section 5.12) removes the wait when a comrade makes the Break Attention.

> **Design note (OQ-79):** ADR-0014, as amended in decision batches 3 and 3b, reads: a lone, average soldier who has used Break Attention succeeds on about 10% of Nape strikes against a Medium Titan, between 8% and 16% on a cut made directly after Break Attention from the Rookie's fight-start Stress of 1, with the cut a lone soldier makes after the cards they took while waiting reported beside it and not tuned; a Levi-grade soldier pushing hard succeeds about 50% of the time. Medium Nape Depth stays 4. The Rookie's fight-start Stress of 1 was set after the bound was written, and Stress Dice add successes, so a bound written for a Stress 0 soldier (10.0%) reads about three points higher at Stress 1. Every lever that met the old bound broke another target or was a flat penalty for acting alone, which ADR-0010 rules out: Nape Depth 5 (above); a 1-die penalty on the lone cut (8.1% for the Rookie, 41.9% for the Levi-grade soldier); a 2-die penalty (4.3% and 35.6%); or no Push (2.1% and 19.6%). Reading the Rookie at Stress 0 stays withdrawn. Pinning the band to the fresh cut keeps the target as it was measured, since the Roars a waiting soldier takes lift the in-fight cut by about a point. The simulator re-measures both: a fresh-cut value outside the band is a miss, and the in-fight cut is a report. The band is exact, "about 50%" reads 45% to 55%, and a figure past an edge by at most 2 standard errors is judged on a pooled second seed (ADR-0014, as amended in decision batch 5; OQ-127).

### A Grab kills about 1 in 3 with comrades close, and 2 in 3 alone

> **Design note:** The victim is the reference Rookie with Grip Breaker 1 at Stress 1 (`grab`). The model uses:
> - the real torso rows with the non-lethal cap;
> - the Grab spending the action of the victim's first counted turn;
> - a failed dodge that spent a later turn getting that turn back;
> - Break Free needing 2, with a 2-die penalty once lifted;
> - rescuers with Hamstringer 1 who need a move to reach the hand after the lift;
> - witnesses' Fear Rolls with every row of the re-cut table.
>
> In the probes, alone, a victim whose dodge failed dies 69.9% of the time, and one who did not dodge 73.1%. A victim who always dodges a Grab dies 55.5% of the time per Grab card, so dodging is the better play. Template victims alone die 69.5% (Brawler) to 76.3% (Flier and Hunter); on the confirming run, 67.3% (Brawler) to 74.2% (Hunter) (`docs/reviews/simulator-report.md`, section 2.3). A victim whose turn this round was already spent in advance dies 70.1% after a failed dodge and 73.0% without one; before the failed dodge's turn was given back, that victim died every time after a failed dodge (`turn_debt`).
>
> Cells are witness Stress 1, 2, and 3, each with 0 and then 1 Grief:
>
> | Comrades close | S1 G0 | S2 G0 | S3 G0 | S1 G1 | S2 G1 | S3 G1 |
> |---|---|---|---|---|---|---|
> | One (the reference) | 28.7% | 33.4% | 39.1% | 34.1% | 39.7% | 45.1% |
> | Two | 13.1% | 17.3% | 23.5% | 17.8% | 24.1% | 30.3% |
> | Three | 6.4% | 9.9% | 15.6% | 10.2% | 15.6% | 21.9% |
> | One template comrade, no strike Talent | 32.0% | 36.3% | 42.0% | 37.4% | 42.6% | 46.9% |
>
> The table's cells are the probes', under each entry's fixed need and the old Fear table. On the confirming run, with witnesses' Fear Rolls on every row of the re-cut table, the six cells with one comrade run 26.9% to 46.4%, all below 50%, a limit read exactly, and Stress 2 with no Grief is 32.0%, inside "near 1 in 3", which reads 28.3% to 38.3%, so the OQ-50 test passes. Alone, the 67.5% after a failed dodge (70.0% with no dodge) is inside "about 2 in 3", which reads 61.7% to 71.7% (ADR-0014, as amended in decision batch 5; OQ-127; `docs/reviews/simulator-report.md`, section 10). ADR-0014's Target 4, read on the standard Medium Titan, gives 67.7%, 31.8%, and a worst cell of 46.0%, each Met (section 1).
> - **Earlier injuries:** a victim already carrying untreated leg injuries died every time alone at Health 2 or 3, where the crush put them Down, and about 70% of the time at Health 4 to 6; with one comrade, 48% and 33 to 34% (`health_reports`). Those rows were measured before decision batch 13 (13-1; OQ-190) raised Health by 2, so no soldier can now reach the Health 2 and 3 rows, and the confirming run measures Health 4 to 8 instead: with earlier injuries a victim alone dies 67.4% to 67.8% of the time and one with a comrade close 31.8% to 32.1%, flat across the five values, because at Health 4 the victim still starts with a box left and the crush no longer begins them Down (`docs/reviews/simulator-report.md`, section 2.3).
> - **The full fight:** on the confirming run, four Rookie player characters see 0.287 Grabs per fight and 18.8% of them devour, about 1 Grab in 5; with two helper Squadmates, 7.9%, about 1 in 13 (`docs/reviews/simulator-report.md`, section 2.3). The probes gave 0.22 Grabs and 0.025 devours per fight, about 1 in 9; with two helper Squadmates, about 1 in 28, and about 1 in 38 when they also hold Hook and Cut and Hamstring Line with the escapes (to the 12-round horizon before decision batch 5: 1 in 11, 1 in 50, and 1 in 75).

> **Design note (OQ-95):** ADR-0014, as amended in decision batch 3, reads: a Grab kills about 1 time in 3 with comrades close, about 2 in 3 when alone. Comrades close means one comrade in reach with the reference build and starting state (a Rookie with Talent 1 on the Body Part strike at In Reach), over the six cells of witness Stress 1, 2, and 3 with Grief 0 and 1: every cell under 50%, and the Stress 2, Grief 0 cell near 1 in 3. The share of Grabs the reference Squad's victims die from, with every written rescue in play, is reported beside it and not tuned: on the confirming run, 18.8% of Grabs devour with 4 player characters, 7.9% with 2 helper Squadmates, and 30.5% for the template Squad (`docs/reviews/simulator-report.md`, section 2.3; the probes gave 11.3%, 3.6%, and 18.8%). No floor is set on that share. It depends on how many soldiers are in reach, which the Squad's play decides, and every lever that lifts it toward 1 in 3 lifts a one-comrade cell past 50% or contradicts ADR-0019.

### The Jam test

> **Design note:** The Attention holder is the reference Rookie with Agility 3, ODM Gear 2 (the issue before decision batch 11 raised it to 3, and the wear rule these figures assume is the one that batch replaced), no dodge Talent, and Stress 1 at the start. They dodge each Titan once a round for three rounds, with Stress Responses, Push wear, and turn debt (`jam_test`). Every support pattern is tried: Help of 0 to 3 dice on every dodge, and Covering on every Push or on none. Behaviors come from the reference table by the Behavior Table procedure. The worst pattern Jams in these shares of fights:
>
> | Size Class | One Titan | Two Titans |
> |---|---|---|
> | Small | 8.5% | 22.3% |
> | Medium | 9.1% | 24.5% |
> | Large | 12.4% | 32.7% |
>
> The worst pattern is always Covering with no Help, because a Covered soldier keeps their Stress low and Pushes again. The table's cells are the probes', under each entry's fixed need and at ODM Gear 2 under the wear rule decision batch 11 replaced. The confirming run reads the test at the Rookie's issued ODM Gear 3 and at batch 11's cap of 1 point of wear a Pushed roll, so a Jam now takes three points of wear inside the three rounds where it took two, and every cell is far under a third, so the binding test (OQ-72) passes: the worst cells are 1.6% against one Small Titan and 17.2% against two, 1.6% and 17.6% for Medium, and 3.0% and 26.4% for Large (`docs/reviews/simulator-report.md`, section 10). If every card were a kill behavior, which no Behavior Table deals, two Medium Titans would reach 25.5% and two Large Titans 31.6% on the confirming run (the probes: 34.6% and 35.4%). Inside the full fight the Jam has gone: over the first three rounds of every reference start, 0.0% of fights Jam any soldier's ODM Gear on a dodge, and 0.0% from any roll at all, a figure reported and not judged, since a fight in which Attention moves is not the one holder the test measures (section 4.3).

> **Design note (OQ-96):** The Jam test is accepted on the worst legal support pattern against behaviors a Behavior Table can deal, with every card at the kill pool reported as an upper bound. A coin flip of support has no basis, and every card at the kill pool is a Titan no Behavior Table deals. The probes' worst cell passed by 0.6 points and the confirming run's (26.4%) passes by 6.9, and any change to Attack Dice, a Tempo, the wear rule, or the issued ODM Gear rating re-runs the test before it is accepted, and Chapter 6 re-runs it for each of its tables (section 6.6). Under Attack Dice the holder dodges only a card whose roll scores 1 or more successes, and the confirming run read the test that way (decision batch 8, 8-14; OQ-145).

### Gas

This chapter adds no kind of ODM use Chapter 4 did not count and changes no gas rule, so Chapter 4's gas figures stand: a full canister lasts a median of 8 rounds with no Push and 6 Pushing every round. ADR-0014, as amended in decision batch 3b, states the target with both figures: about 9 rounds (median 8, mean 9.25), and about 6 when pushing every round (median 6, mean 6.33). A median target is read exactly (ADR-0014, as amended in decision batch 5), so both are met; the re-run after decision batch 5 gives the same, and the confirming run gives medians 8 and 6 (means 9.24 and 6.34), Met (`tuning.yaml`, `gas`; `docs/reviews/simulator-report.md`, section 1).

---

## 5.14 Who uses these rules

- **Player characters** use every rule in this chapter.
- **Squadmates** use every rule too, as Chapter 2 allows (`rules_applicability`). A Squadmate:
  - never Pushes or Covers;
  - takes Read, Break Attention, strikes, and Break Free like a player character;
  - witnesses and makes Fear Rolls;
  - can be named by a Squad Tactic's condition.
- **Titans** act only from their Behavior Tables, Attention Ladders, and the procedures in this chapter (ADR-0001). They never build dice pools.
- **The GM** rolls each hidden Next Behavior, keeps the tracker, and reveals facts, and rules only on what the preface's Rulings paragraph names: Circumstances on the soldiers' rolls, framing, and the model entry of an improvised act.

### Acts in this chapter

ADR-0024, limit 12, keeps the tracked values as an index of what soldiers change by acting, and every rule that creates a clock, counter, or obstacle adds its value with the entries that change it. The acts this chapter lets a soldier choose are:

| Act | Entry | Tracked value |
|---|---|---|
| Nape strike | `nape-strike` | `titan-kill`, `openings-create` |
| Body Part strike, including on a holding arm or a pinning Body Part | `body-part-strike` | `toughness-add`, `body-part-worsen`, `openings-create`, `grabbed-end`, `pinned` |
| Heave | `heave` (new, decision batch 8, 8-9) | `heave-count` (new), `pinned` (new) |
| Break Attention, with any decoy including a Feint | `break-attention` | `attention-shift` (which also raises decoys in a row), `openings-create`, `grabbed-end` |
| Draw Attention | `draw-attention` | `draw-attention-set` |
| Read | `read` | `titan-facts-reveal` |
| Call It | `call-it` | `reaction-dice-add` |
| Break Free, and Pry Loose on a comrade's behalf | `break-free` | `grabbed-end` |
| Dodge | `dodge` | `behavior-avoid` |
| Swap initiative cards | `swap-initiative-card` (new, OQ-90) | `initiative-swap` (new) |
| Use a Squad Tactic | `squad-tactic` (new, OQ-90) | `squad-tactic-use` (new) |
| Moves, letting go, leaving, and returning; a Flight, which every ODM move is | none for the move itself; a Flight's roll is the entry `fly` | `position-change`, and `momentum-gain` on a Flight |
| An improvised act (section 5.4; decision batch 9, 9-8) | its model entry | its model entry's |

These are rules or procedure steps, not acts, so they need no tracked value of their own:
- rolling the Next Behavior;
- a Titan's card;
- Regeneration;
- steam, the falling Titan with its Leap Clear roll (the Catalog roll `leap-clear`, which changes `pinned`), and corpse heat;
- the Grab countdown;
- Background clocks;
- witnesses' Fear Rolls;
- the retreat clock and the retreat's forced moves;
- a zone's rating wrecked one step by a Titan's card or by its falling body, which changes `anchor-wreck` (section 5.2);
- the end of a Titan Engagement.

### Rows and changes in earlier chapters

The rows and pointers this chapter needs in Chapters 1 to 4 are applied in those chapters' own files:
- **Chapter 1 Bonus Dice rows:** Read from Distant, Call It, the Opening condition, and, for OQ-182, Momentum spent on Bite or Brace and the Open rating's Terrain Trait.
- **Catalog rows:** the two new options and tracked values, and requirement pointers to this chapter's files.
- **The Grabbed carrying row:** carrying ends with no fall when the carried comrade is Grabbed.
- **Horses:** a successful riderless-horse decoy leaves the Titan Engagement, and the sheet records the horse as left.
- **Sheet:** every soldier in a Titan Engagement has a Squad sheet row, whose zone and attachment columns record where they are, and the character sheet's `zone` and `attachment` fields mirror them (decision batch 16, 16-35); the sheet also records the soldier's Momentum (Chapter 4, `data/gear/sheet-fields.yaml`).
- **Chapter 4 rules this chapter now leans on:** every ODM move is a Flight, a clean line removes a round's Gas Roll, a Jam does not drop a soldier at Blind Spot in an Urban zone, and Swap Blade Set spends the move in a Titan Engagement (sections 4.2, 4.3, and 4.4).
- **Catalog needs:** the `break-attention` entry states Break Attention's needs, with the Feint and the decoys in a row, and points to its `needs_rule`.
- **Pointers:** every Chapter 1 to 4 sentence that said Chapter 5 would state a rule now points to the file that does, including Chapter 1's turn order (`round.yaml`, `turn_order`) and the turn a dodge the Grab's card answered or compared gives back (`grab.yaml`, `countdown`, `failed_dodge`).

> **Design note (OQ-90):** OQ-90 records each change. Its last three items are closed as well: the glossary's Opening entry; Relentless and Sharp Call in `data/character/talents.yaml`, which point to `titan-harm.yaml` and `read.yaml`; and the header of `data/gear/sheet-fields.yaml`.

---

## Example: a Nape kill on a grounded Titan

*The numbers in this example are for illustration only. The Titan is the reference Titan the simulations used, not a Chapter 6 Titan. The rows follow the YAML files at the time of writing; if the files change, the files govern.*

The Squad fights Focus Titan A, a Medium Titan, on a Standard field whose field rating is Wooded. The example joins in round 3.

**The field.**
- **The engagement line** reads `Standard, Wooded | Zones 1W 2W 3S 4W 5W 6G 7W 8W 9W 10W 11O 12W 13W | Round 3 | Retreat 2/8 | Retreat began: - | Tactics: Hook and Cut, Fall Back | Cloaks: - | No one standing since: -`. Nothing has wrecked zone 7, so every soldier in it has a Momentum cap of 2.
- **The tracker row** reads `A Medium | zone 7, Stride 0 | cards 9 | Att: Jonas | Next: [hidden] | Prev: Roar | Eyes I0 LA I0 RA I0 LL B0 RL W1 | Op 1 (Jonas) | Regen 2/3 | Decoys 0 | Grab: - | Flags: - | Frenzy 0`. Two rounds have ended and its Frenzy is still 0, since it first rises at the end of the third round, so every behavior roll it makes this round is a plain D6.
- **The left leg is Broken,** so the Titan is grounded and its Stride is 0. Jonas created its one Opening with a success beyond Breaking the leg last round.
- **Everyone is in zone 7.** **Private Mila Brandt** is at A's Blind Spot (`Z7 | S A`), airborne, with Strength 4, Clean Cut 1, Blade Set 1, Agility 3, ODM Gear 3, and Stress 1.
- **Private Jonas Keller** is on the Ground (`Z7 | G`), so In Reach, and holds Attention, with Strength 3, Blade Set 1, and Stress 2.
- **Ilse,** a Squadmate on Jonas's Wing, is on the Ground in zone 7, In Reach.

**The deal.** Mila draws 6, the Titan draws 9, and Jonas draws 11. No one swaps.

**Card 6: Mila.** She keeps her Position and takes a Nape strike, which she can make because Jonas holds the Titan's Attention. She holds no Momentum: she made no ODM move in round 2, so she lost it at that round's Momentum step.
- **Bonus Dice.** She declares 3: Jonas's Opening (she did not create it) and 2 for the grounded Titan.
- **Pool.** Strength 4, Clean Cut 1, and 3 Bonus Dice make 8 base dice, plus 1 Gear Die and 1 Stress Die.
- **First roll.** The base dice show 6, 6, 3, 2, 5, 1, 4, and 2, the Gear Die shows 3, and the Stress Die 4. That is 2 successes against Nape Depth 4.
- **The Push.** No Stress Die shows 1, so she Pushes and her Stress rises to 2. The six base dice not showing 6 show 6, 2, 3, 5, 4, and 1, her Gear Die showing 3 rolls again and shows 2, and her two Stress Dice show 3 and 2. That makes 3 successes, still short.
- **Result.** Her 3 successes become 3 Openings created by Mila, and Jonas's Opening is spent. The strike sets her hooked-by-strike flag. The Gear Die did not show 1, so nothing wears.

**Card 9: Focus Titan A.**
- **Attention.** No Grab holds it and no decoy holds its Attention, so it evaluates the ladder. Its holder will be in its own zone and its Stride is 0 anyway, so it does not stride. Mila holds the hooked-by-strike flag, the top rung; Jonas at In Reach meets only the second. Mila takes Attention. The flags stay until this card's Next step.
- **The behavior.** The Next Behavior is revealed as Shake Off, a control entry needing On Body or Blind Spot. Mila is at Blind Spot, so it reaches her and no retarget is made: 6 Attack Dice, knock-loose.
- **Had it been Swat,** which needs In Reach or On Body, Mila would not have met it and the Titan would have retargeted rather than flailed. Jonas and Ilse both hold In Reach and both meet it, the ladder ties them at nearest person in reach, and Jonas's card comes before Ilse's, which follows his. Jonas would have taken the Titan's Attention and the Swat would have landed on him, leaving Mila her Openings and a clean board.
- **The roll.** The GM rolls six Titan Dice in the open: 6, 2, 5, 3, 1, and 4. That is 2 successes, so the Shake Off's Severity is 2.
- **Mila's dodge.** Her turn this round is spent, so the dodge spends her round 4 turn. Agility 3, ODM Gear 3, and Stress 2 make 8 dice. The base dice show 6, 3, and 1, the Gear Dice 6, 4, and 2, and the Stress Dice 5 and 2. Her two successes cancel the Shake Off's two, leaving no Net Successes, so it whiffs against her and she does not fall.
- **Next.** Shake Off becomes the previous behavior, Mila's flag clears, and the GM rolls the new Next Behavior out of sight, D6 plus the Frenzy of 0 that stands at this moment; the rise at this round's end would not touch it.

**Card 11: Jonas.** Jonas no longer holds Attention.
- **His move** is an ODM move in zone 7 from the Ground to A's Blind Spot, an attachment step Wooded allows, and every ODM move is a Flight. As its first step it costs nothing. He rolls for Fly: Agility 3, ODM Gear 3, and Stress 2 make 3 base dice, 3 Gear Dice, and 2 Stress Dice. The base dice show 6, 4, and 2, the Gear Dice 3, 5, and 2, and the Stress Dice 4 and 2. The step happens whatever the roll gives, and the one success gives him 1 Momentum, under the cap of 2.
- **Bonus Dice.** He declares 4, the cap: 2 of Mila's Openings and 2 for the grounded Titan. His Momentum would buy a Bite, but the cap is full, so he keeps it.
- **Pool.** Strength 3 and 4 Bonus Dice make 7 base dice, plus 1 Gear Die and 2 Stress Dice.
- **The roll.** The base dice show 6, 6, 6, 2, 4, 1, and 5, the Gear Die 6, and the Stress Dice 3 and 2. That is 4 successes: the Nape Depth.

**The kill.** Focus Titan A dies:
- Mila, Jonas, and Ilse each take the Nape-kill Stress relief.
- The last Opening, the hidden Next Behavior, and the clock are removed.
- Every attachment naming A ends: Mila and Jonas, both airborne, are Anchored in zone 7, and the corpse lies there.
- No Focus Titan is alive, so the Titan Engagement ends, and Ilse's turn after Jonas never comes.
- Mila's dodge and Jonas's Flight used ODM Gear this round, so both make their Gas Rolls at once, before Chapter 3's end steps (section 5.3). Jonas's Flight was ODM use twice over and still makes him one Gas Roll.

Chapter 3's end steps begin. The first cancels Mila's round 4 turn, which her dodge spent in advance, so she owes nothing.
