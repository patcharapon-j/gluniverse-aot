# Chapter 4: Gear

This chapter covers what a soldier takes into the field and what using it costs: gear items and their Gear Dice, ODM Gear and gas, Blade Sets, horses, falls, carrying and passing items, Field Repair, Standard Issue, and Squad Supply.

It builds on Chapter 1 (dice pools, Gear Dice, wear on a Push, the two-die Gas Roll and its third die after a Pushed ODM Gear roll, turns and actions), Chapter 2 (the Action Catalog and its gear rule, Talents, Squadmates), and Chapter 3 (damage, Down, care windows, Treat Injury). The rows it adds to their files, and the few rules and pointers it changes there, are listed in section 4.13.

Later chapters own these rules, and this chapter only refers to them:

- **Chapter 5, Titan Engagement:** Positions and Position steps, which Position changes need an ODM move, and what a move on foot or mounted can do (section 5.2); where soldiers and horses are when a Titan Engagement begins (sections 5.1 and 5.2); Attention (section 5.6) and Reactions against Titans (section 5.5); the Grab (section 5.9); Break Attention and its decoys (section 5.6); which Position a fall leaves a soldier at (section 5.2); and the order of the round's end steps (section 5.3). Chapter 4 also relies on Chapter 5 for:
  - a move that changes no Position, such as landing, or mounting a horse at the soldier's own Position (section 5.2);
  - any rule that lifts the working ODM Gear requirement on strikes, such as one for a Titan grounded by a Broken leg (section 4.2; section 5.7);
  - what a soldier who is Jammed, or has run dry, can do at each Position beyond this chapter's limits (section 5.2);
  - whether any rule moves a horse, or a dead soldier's left items, from the Position where they lie (sections 4.5 and 4.11; section 5.2);
  - whether soldiers who have left a Titan Engagement count as holding the same Position for Field Repair, passing, and taking an item, as Chapter 3 lets them for Treat Injury and Rally (section 5.11);
  - how a soldier's Positions relative to two Focus Titans relate, and what a horse's or a dead soldier's recorded Position becomes when the Focus Titan it names dies (sections 4.5 and 4.11; section 5.2);
  - the simulator case in OQ-60 (gas per round of fighting) and the binding Jam test in OQ-72 (the reference Rookie, with Agility 3, ODM Gear 2, no dodge Talent, and Stress 1 when the fight begins, holding Attention, including cards from a second Titan; section 4.9; section 5.13).
- **Chapter 6, Standard Titans:** each Titan's behaviors (`data/titans/`). No entry there affects a horse (section 6.1).

Chapter 7 gives the Expedition rules (rations, Legs, when a day passes, and when Standard Issue is issued), Downtime and its Maintain Gear action, Requisition and Scarcity, and Skirmishes. Some rules this chapter needs are not yet written: the Funding rules, the Chase rules, Operation Frames, and Shifters. This chapter mentions them only where it has to.

**Tables.** Every table and procedure in this chapter is a YAML file. Those files are the only source of truth (ADR-0012). The fall band and fall damage tables, Standard Issue by Funding and by Specialty, and the Squad Supply stock by Funding are rendered from them by `tools/render/render.py` where each procedure uses them, between `BEGIN RENDERED` and `END RENDERED` markers that name each block's source file; nothing between the markers is written by hand, and `render.py check` fails if a rendered block and its YAML differ. The files are:

- `data/gear/items.yaml`: the gear items, their ratings, wear, what happens at 0, when each counts as not had, what restores it, and how many items it counts as.
- `data/gear/odm-gear.yaml`: ODM moves, ODM use, the strikes that need working ODM Gear, airborne, the Gas Rating, the Gas Roll, changing a canister, running dry, and the Jam.
- `data/gear/blade-sets.yaml`: the handles, ruin, and the swap.
- `data/gear/horses.yaml`: a soldier's horse, where it is, mounted and dismounted, its Gear Dice, and lame.
- `data/gear/falls.yaml`: what makes a soldier fall, the height band, the fall procedure, and the fall damage table.
- `data/gear/carrying.yaml`: items, the carrying limit, Overloaded, shedding load, carrying a comrade, passing and taking an item, and the gear of a soldier who leaves play.
- `data/gear/field-repair.yaml`: the Field Repair procedure.
- `data/gear/standard-issue.yaml`: Standard Issue by Funding and by Specialty, when it is received, and how.
- `data/gear/squad-supply.yaml`: the kinds of Squad Supply, the stock by Funding, and every Phase 1 use.
- `data/gear/sheet-fields.yaml`: what the gear field holds, the one-line Squad sheet row, and the Squad sheet's Squad Supply counts.
- The Catalog rows this chapter owns are in `data/character/action-catalog.yaml`, and the `medical-supplies` source is in `data/core/bonus-dice-sources.yaml` (section 4.13).

Where the ADRs left a question open, the rule below cites its entry in `docs/rules/OPEN-QUESTIONS.md` as (OQ-nn). Every entry this chapter cites was decided on 2026-09-14 (`docs/rules/DECISIONS-2026-09-14.md`): OQ-01 to OQ-58 in the first decisions and their conformance follow-up, this chapter's own entries under *Batch 2*, OQ-59 to OQ-69, OQ-72, and OQ-73, and OQ-93 and OQ-94 under *Batch 3*. Decision batch 2b revised two of them and ADR-0014's reference builds: horses are rated like ODM Gear at every Funding, a full issue also replaces worn ODM Gear and worn horses, and the reference builds carry no Talent dice on the dodge, Fly, Break Attention, Ride, or Read. Decision batch 3 revised OQ-59 again, so the interim issue also replaces a worn horse (OQ-93), and closed ADR-0014's Talent sentence: no roll a target measures carries Talent dice except the Nape strike, the Body Part strike, Break Free, and Treat Injury (OQ-94). The text states the decided rule. Decision batch 9 (items 9-2, 9-5, 9-11, and 9-16, 2026-09-16) made the GM's rulings part of the rules (ADR-0024): a fall, a lost item, or a unit named as a called roll's stakes, found supplies, objects under Circumstances, and Circumstances on Field Repair and none on the Gas Roll or the fall roll. Design notes give the reasons and the simulation figures.

**Rulings.** The GM rules on gear and supply only before the dice are rolled, and only in these ways. A called roll's stakes may name a fall, low or high as the GM names, or low if none (section 4.6; 9-30), one carried item lost, or 1 unit of one kind of Squad Supply spent (section 4.10; decision batch 9, 9-5). A successful called search of a place may find Squad Supply, at most 1 unit per success of one kind the place could hold, and a place yields Squad Supply to one called search only (section 4.10; 9-5 and 9-29). An object that is not a gear item may count toward the Circumstances the GM names for a roll (section 4.1; 9-16), and the GM names the Circumstances of a Field Repair roll as of any attribute roll (section 4.8; 9-2). The GM may add a charter-compliant item to the Requisition list (Chapter 7, section 7.3; 9-16). No ruling gives a gear item: one comes only by Standard Issue, a Requisition, or a rule that moves an item between soldiers, and a called roll's success never names one (Chapter 1, section 1.1, item 2; 9-31). The GM applies the rest as written: wear, which only a Pushed Gear Die showing 1 causes; Gear Dice, which only a rated gear item gives; what an object counts as for carrying; the Gas Roll; the fall procedure, its bands in a Titan Engagement, and its tables; Standard Issue, what it holds and when it is received; and every other spend and restock of Squad Supply. Every other rule the GM applies as written is on the list in Chapter 1, section 1.1, item 6.

---

## 4.1 Gear items and Gear Dice

`data/gear/items.yaml` lists every gear item: ODM Gear, gas canisters, Blade Sets, horses, medical kits, tool kits, flintlock pistols, muskets, and prosthetic arms and legs. No other object is a gear item. Any other object a player describes, such as a rope, adds no Gear Dice and counts as no item. It has a mechanical effect only where a rule names it: a thrown cloak, for example, is one of the decoys ADR-0010 gives Break Attention, and Chapter 5 resolves it (section 5.6, `data/engagement/attention.yaml`, `break_attention`, `decoys`; `other_objects`). Chapter 1's Circumstances cover every other use: an object used well on a roll may count toward the step the GM names (section 1.4a), so a rope and a grapnel might make a climb Easy. On a called roll made with an attribute alone, a gear item that helps counts the same way and gives no Gear Dice (Chapter 2, section 2.9; decision batch 9, 9-24). It never gives Gear Dice, which come only from a rated item that a Push can wear (ADR-0004; decision batch 9, 9-16).

### Ratings

- Every item except a gas canister and a prosthetic is **rated**. A rated item has a **rating** from 1 to 3, set when the soldier receives it, and a **current rating** from 0 up to that rating (`rating_rules`).
- The item's Gear Dice are its current rating (Chapter 1, section 1.3, step 6). A roll takes Gear Dice from at most one item, chosen before the roll if more than one qualifies (ADR-0006).
- The rating never changes. Only the current rating goes down or up.
- An item's row lists the Action Catalog entries it can supply Gear Dice to (`gear_dice_for`). The Catalog's own `gear` field decides which items a roll can use; the two lists agree.

### Wear

- When a Pushed roll is final, each Gear Die showing 1 wears the item that supplied it by 1 point (Chapter 1, section 1.5; OQ-01). A roll that was not Pushed never wears anything. No ruling wears an item: a called roll's stakes may lose a carried item, never a point of wear (decision batch 9, 9-5).
- A rule Talent that ignores wear, such as Well-Kept Rig, Blade Discipline, or Sure Seat, removes points before they apply.
- Each point left lowers the current rating by 1, never below 0. The one exception is a Blade Set, which is ruined by any wear instead (section 4.4).

### At 0, and counting as not had

An item whose current rating is 0 is in its **at-zero state**: ODM Gear is Jammed, a horse is lame, a medical kit is spent, and a tool kit or a firearm is worn out. At 0 an item adds no Gear Dice and counts as not had for every Action Catalog entry (Chapter 2, section 2.8, *Entries that need gear*).

Chapter 2's gear rule also lets a Chapter 4 rule name other states that count as not had. They are the `counts_as_not_had` rows:

- ODM Gear whose soldier has Gas Rating 0 (section 4.3). This never applies to the Graduation Exam's training ODM Gear, which has no canister.
- A Blade Set that is not in the soldier's handles (section 4.4).
- A horse, for the dodge and Ride, while the soldier is not mounted on it; for Break Attention, while the soldier is neither mounted on it nor at the Position it holds, compared relative to the Focus Titan recorded with the horse's Position (section 4.5).
- A flintlock pistol or musket that is empty (*Firearms*, below).

### Restoring

A current rating rises only through a rule in the item's `restored_by` list, and never above the rating. Those rules are Field Repair (section 4.8), restocking a medical kit (section 4.10), Standard Issue replacing an item (section 4.9: a full issue replaces Jammed or worn ODM Gear and a lame or worn horse; the interim issue replaces a lame or worn horse, replaces Jammed or worn ODM Gear only if it is rated below the Funding row, and never replaces a kit at 0; a soldier may decline the exchange of a Jammed, lame, or worn item), and the Maintain Gear Downtime Action (Chapter 7, section 7.2). Standard Issue never restores a firearm; Field Repair and Maintain Gear do (decision batch 8, 8-12).

> **Design note (OQ-01):** Gear Dice are never re-rolled, so a Pushed roll wears an item once for each of its Gear Dice that showed 1 on the first roll. In a simulation at Stress 1 (50,000 runs per case, one roll a round with Agility 3, Pushing whenever allowed), a Pushed roll wore an item by 0.17 points on average at rating 1, 0.23 at rating 2, and 0.28 at rating 3. A higher rating wears a little faster per Push but has more to lose: rating 1 Jams after about six Pushes, and rating 3 lasts about twice as many rounds (section 4.9).

### Firearms

The flintlock pistol and the musket are the gear items for Shoot, the Skirmish entry Chapter 7 adds (section 7.4; decision batch 7, 7-17; OQ-143). They are the only new gear ADR-0016 admits before the first playtest.

- **Received** only through Requisition, and empty (Chapter 7, section 7.3). Standard Issue never gives a firearm (ADR-0016, items 3 and 8).
- **Rated** like any rated item: its Gear Dice on a Shoot roll are its current rating, a Pushed Gear Die showing 1 wears it, and at 0 it is worn out and cannot be fired until Field Repair or Maintain Gear restores it (decision batch 8, 8-12).
- **Loaded or empty.** The sheet records which (section 4.12). Only Reload loads a firearm, and it spends 1 shot of Squad Supply (section 4.10). Outside a Skirmish and a Titan Engagement it may be loaded at any time for that shot alone, and it stays loaded until it is fired (decision batch 8, 8-12). Making a Shoot roll with a firearm empties it. An empty firearm counts as not had, so Shoot cannot be taken with it.
- **Restored** by Field Repair and by the Maintain Gear Downtime Action (Chapter 7, section 7.2).
- **Items.** A flintlock pistol counts as 1 item and a musket as 2 (section 4.7). Either can be passed, taken, and shared out like any other item that counts.
- **No use in a Titan Engagement.** Shoot is never taken there, and a firearm supplies Gear Dice to no roll made there.
- Its damage, its Injury Type, and which Foes it can be fired at are Skirmish rules (Chapter 7, section 7.4), and so is the move a musket's Reload also spends there.

### Prosthetics

A prosthetic arm or a prosthetic leg (`prosthetic-arm`, `prosthetic-leg`; decision batch 8, 8-10; OQ-147) is workshop work of the era: a hook or an iron hand on a socket, or a peg or a jointed wooden leg, fitted to one side a soldier has lost.

- **Received** only through Requisition, at Limited Scarcity, one per Requisition, or in Phase 2 through a Discovery (Chapter 7, section 7.3). Standard Issue never gives one or takes one away (ADR-0016). It is a kept item.
- **Not rated.** It gives no Gear Dice, never wears, adds no die to any roll, and is never a weapon.
- **Items.** It counts as no item, and it is never passed or taken (section 4.7).
- **Fitted** during a Downtime, once the loss at that side has healed. What it does to the lost-limb grades is Chapter 3's rule (section 3.2, *Lost limbs*).
- **Death.** A fitted prosthetic leaves play with its soldier (section 4.11).

### Kept items

An item received by Requisition is a **kept item** (`kept_item`; Chapter 7, section 7.3; decision batch 7, 7-16; OQ-142). The sheet records which of a soldier's items are kept (section 4.12).

- Standard Issue never takes a kept item away unless the soldier hands it in. At a step that would replace a kept item or make it leave play (section 4.9), the soldier may hand it in and take the issue in its place; by default the kept item stays as it is, as if the soldier had declined that exchange (decision batch 8, 8-12).
- A kept item stays kept when it is passed, taken, or shared out. In every other way it is an item of its kind: it counts as items, wears, and is restored as its row states, and a Blade Set rated above 1 is still ruined by any wear (section 4.4).

## 4.2 ODM Gear

ODM Gear is the item in `odm-gear` rows of `data/gear/items.yaml` and `data/gear/odm-gear.yaml`.

### What it rates

ODM Gear supplies Gear Dice to four entries: the dodge, Break Attention, Fly, and Leap Clear (`rolls_it_rates`; decision batch 8, 8-9). A Nape strike, a Body Part strike, and Break Free take their Gear Dice from the Blade Set in the handles, never from ODM Gear.

### Strikes need working ODM Gear

In a Titan Engagement, a Nape strike, and a Body Part strike made from On Body or Blind Spot, need the striker's ODM Gear to count as had: not Jammed, and with a Gas Rating above 0 (`strikes`). A soldier who is Jammed or has run dry cannot make them. The strike still takes its Gear Dice from the Blade Set, and it is not ODM use, so it makes no Gas Roll. Only a Chapter 5 rule that names this requirement can lift it, such as the one for a Titan grounded by a Broken leg (section 5.7, `data/engagement/titan-harm.yaml`, `grounded`). The requirement stands in the `nape-strike` and `body-part-strike` rows of the Action Catalog. It does not apply outside a Titan Engagement, so the Graduation Exam's strikes never test it, and a later rule that calls for a strike outside one, such as a Chase rule, applies it only by naming it.

> **Design note (OQ-60):** Without this requirement, a soldier who ran dry or Jammed at Blind Spot kept that Position and could strike every round with no gas and no working harness. Making strikes ODM use instead is recorded as the lever if gas turns out not to track rounds of fighting, which Chapter 5's simulator case measures (section 5.13).

### ODM moves

- An **ODM move** is a move a soldier makes on their own ODM Gear, and every ODM move is a **Flight**: it is rolled for `fly`, its step happens whatever the roll gives, each success is 1 Momentum, and no successes sets the loudest flag (`odm_moves`; Chapter 5, section 5.2). Chapter 5 states which Position changes need an ODM move at each Anchor Rating, which can be made on foot or mounted, and what Momentum buys.
- An ODM move needs ODM Gear that counts as had, so a soldier who is Jammed or has run dry cannot make one.
- A mounted soldier's ODM move dismounts them before its change of Position (section 4.5).
- While Overloaded, an ODM move also spends the soldier's action, and cannot be made once that action is spent (section 4.7).
- A soldier carried by a comrade makes no ODM move.

### Using ODM Gear

A soldier **uses ODM Gear** in a round if, during that round, they do any of these (`odm_use`):

- make an ODM move;
- make a roll whose gear item is their ODM Gear, such as a dodge made with it;
- take an act that a Chapter 5 rule names as ODM use (section 5.2, `data/engagement/positions.yaml`, `moves`, `odm_use_named_by_this_chapter`).

A Flight is ODM use twice over, an ODM move and a roll whose gear item is the soldier's ODM Gear, and a soldier who used ODM Gear still makes one Gas Roll for the round however many times they used it.

Holding a Position without moving is not ODM use, even while airborne. Neither is a mounted charge (section 4.5, Chapter 5, section 5.2), nor a roll made with a Blade Set, a horse, or a kit, including every Nape strike, nor being carried.

Outside a Titan Engagement there are no rounds. ODM use there makes a Gas Roll only when the rule that calls for it says so, as the Chase rules may. Travel on horseback never spends gas (ADR-0009), and the Graduation Exam makes no Gas Rolls (Chapter 2).

### Airborne

A soldier is **airborne** while they are in the air on their own ODM Gear. The sheet records it as true or false (`airborne`).

- **Becoming airborne:** the soldier makes an ODM move, or a rule calls for a Fly roll with their own ODM Gear and states that the roll makes them airborne. Making the roll does not by itself: the calling rule states whether a success, a failure, or both do. A mounted soldier who becomes airborne is dismounted first, with no fall (section 4.5).
- **No longer airborne:** the soldier makes a move that is not an ODM move; falls (section 4.6); becomes Grabbed; or the Titan Engagement ends, when every airborne soldier lands with no fall. Outside a Titan Engagement, a soldier made airborne by a rule lands when that rule's procedure ends, unless the rule names another point.
- **Never airborne:** a soldier carried by a comrade, whatever the carrier does; a Grabbed soldier, whatever the Titan does; and a mounted soldier.
- A soldier who runs out of gas while airborne stays airborne (section 4.3).

Freedom's trigger, "When I am airborne on ODM Gear through my own ODM use", is met while the soldier is airborne under this definition, in or outside a Titan Engagement (Chapter 2, section 2.5; OQ-23).

### Jam

ODM Gear whose current rating reaches 0 **Jams** (`jam`):

1. It counts as not had for every Action Catalog entry and adds no Gear Dice.
2. The soldier cannot make an ODM move while it is Jammed, so they make no Gas Roll for any later round. The Gas Roll for the round in which it Jammed is still made.
3. The Gas Rating does not change.
4. The soldier cannot make a Nape strike, or a Body Part strike from On Body or Blind Spot.
5. If the soldier is airborne, they fall once the roll that Jammed it is finished (section 4.6). At the Urban Anchor Rating a soldier who holds Blind Spot is anchored to a roof and is not airborne, so a Jam does not drop them (Chapter 5, section 5.2; decision batch 10, OQ-182).

A Jam ends when the current rating rises above 0, through Field Repair (section 4.8) or Standard Issue replacing the Jammed ODM Gear (section 4.9; the interim issue does so only for ODM Gear rated below the Funding row, and a soldier may decline the exchange).

> **Design note (OQ-61):** Airborne is a state that only the listed events set and clear, not something read from a Position, and Chapter 5 supplies the moves that clear it (section 5.2). A Fly roll makes a soldier airborne only when its calling rule says so. Section 4.5's mounted state follows the same pattern.

## 4.3 Gas

### Gas Rating and canisters

- A soldier's **Gas Rating** is the gas left in the canister fitted to their ODM Gear, from 0 to a full canister's Gas Rating (`gas`, `full_gas_rating`). A soldier with no fitted canister has Gas Rating 0.
- A soldier can also carry **spare canisters**. Each spare records its own Gas Rating, and one received from Standard Issue is full.
- A canister whose Gas Rating is 0 is discarded when it is taken off ODM Gear, so a carried spare always has gas.

### The Gas Roll

The Gas Roll is the fixed roll `gas-roll` (Chapter 2). Follow `gas_roll`:

1. **Who.** Every soldier, player character or Squadmate, who used ODM Gear during the round (section 4.2).
2. **When.** At the end of the round, once for each such soldier however many times they used ODM Gear. Chapter 5 places this step among the round's end steps (section 5.3, `data/engagement/round.yaml`, `end_steps`). If the Titan Engagement ends partway through a round, that round's Gas Rolls are made at once, before the steps of Chapter 3, section 3.16.
3. **Dice.** Two dice. Three dice if any Pushed roll the soldier made that round had their ODM Gear as its gear item (Chapter 1, section 1.5; OQ-12), however many such rolls there were. A Pushed dodge made with the horse does not by itself make it three (ADR-0019). Light Trigger can make a three-die Gas Roll two dice.
4. **Read.** Count the dice showing 1. The dice are not added, and a 6 does nothing.
5. **Effect.** Lower the Gas Rating by 1 for each 1, to a minimum of 0.

**A clean line.** A soldier who spends 1 Momentum on a clean line makes no Gas Roll for that round (Chapter 5, section 5.2; `gas_roll`, `momentum`).

The extra gas a Push costs is the third die of that round's one Gas Roll, never a second roll. A Gas Roll is not an attribute roll: it has no attribute, Talent dice, Bonus Dice, Gear Dice, or Stress Dice, it takes no Circumstances (Chapter 1, section 1.4a; decision batch 9, 9-2), it cannot be Pushed, Helped, or Covered, and it never causes a Stress Response (Chapter 1, section 1.3). A Squadmate never Pushes, so its Gas Roll is always two dice.

**A Gas Roll a Fear Roll result calls for.** A Chapter 3 Fear Roll row can call for a Gas Roll at once (`data/harm/effect-types.yaml`, `gas-roll`; decision batch 7, 7-8). It is two dice on the canister fitted to the soldier's ODM Gear, read and applied as above, and nothing happens if no canister is fitted or its Gas Rating is 0. It is not the round's Gas Roll and is not ODM use, so the soldier still makes the round's own Gas Roll if they used ODM Gear, with the dice that roll would have.

**A canister about to move.** No canister moves before the gas it owes is rolled. Follow `canister_removed` in order (OQ-60):

1. A soldier who has used ODM Gear this round, and has not yet made that round's Gas Roll, makes it before their fitted canister can be passed or taken (section 4.7). The passer makes it when they declare that they mean to pass the canister, and a Down soldier makes it when a taker declares that they mean to take it. It has the dice their rolls so far this round give. It is that soldier's Gas Roll for the round, and none is made for them at the round's end, whatever canister they fit later in it.
2. If that roll leaves the canister at Gas Rating 0, the canister is discarded: the soldier has no canister fitted, nothing moves, and the pass or take is not made and spends nothing, so the passer or taker may still take an action that turn. If gas remains, the canister moves with its Gas Rating, and the pass or take spends what it spends.
3. A soldier who dies after using ODM Gear this round, and has not yet made that round's Gas Roll, makes it at once, before their fitted canister becomes a left item (section 4.11). A canister that roll leaves at Gas Rating 0 is discarded and is never a left item.

### Changing a canister

Change Canister is the unrolled Catalog entry `change-canister` (`change_canister`):

- **Requirement:** the soldier carries a spare canister.
- **Spends:** in a Titan Engagement, the soldier's action (Quick Refit lets them spend the move instead); outside one, nothing.
- **Effect:** the soldier fits one of their spares, and its Gas Rating becomes theirs. The canister taken off becomes a spare with its Gas Rating if that is above 0, and is discarded if it is 0.
- A soldier can change a canister while airborne. It is not rolled, so it is never Helped or Covered.

### Running dry

A soldier whose Gas Rating is 0 has **run dry** (`running_dry`):

- Their ODM Gear counts as not had for every Action Catalog entry and adds no Gear Dice.
- They cannot make an ODM move, and so make no Gas Roll for a later round, until their Gas Rating is above 0.
- They cannot make a Nape strike, or a Body Part strike from On Body or Blind Spot (section 4.2).
- **Running dry does not make them fall.** An airborne soldier who runs dry stays airborne at their Position until they stop being airborne (section 4.2). Chapter 5 states which moves other than ODM moves each Position allows (section 5.2, `data/engagement/positions.yaml`, `moves`, `letting_go`).
- It ends when the Gas Rating rises above 0: by Change Canister, by Standard Issue, or by receiving or taking a canister and then changing to it (section 4.7).
- The Graduation Exam's training ODM Gear has no canister, and running dry never applies to it.

> **Design note (OQ-60):** What counts as ODM use, the end-of-round timing of the Gas Roll, the Gas Rolls of a round cut short by the end of a Titan Engagement, running dry without a fall, the strikes that need working ODM Gear in a Titan Engagement, and a part-used canister kept as a spare are this chapter's rules; ADR-0014 fixes the target and the glossary the dice. Rolling before a canister moves makes the act's own requirement, gas above 0, true or false at the moment the act is taken, so no refund or cancellation rule is needed. Rolling after the act was declared left a canister at 0 in dispute whenever the roll showed a 1, which happens 30.6% of the time on two dice and 42.1% on three. The roll stands because the round's flying spent the gas, not the handover, and a giver's canister still reaches the receiver with what it holds after the giver's own round.

> **Design note (ADR-0014 gas target):** A full canister holds Gas Rating 3. The target is about 9 rounds of ODM use, and about 6 when Pushing every round, and ADR-0014 reports medians. "Lasts" counts the Gas Rolls up to and including the one that empties the canister. These odds are exact, from a Markov chain over Gas Rating, re-run in both Chapter 4 fix rounds and after decision batch 2 with the same results:
>
> | Full Gas Rating | Case | Mean rounds | Median | 10th to 90th percentile | Empty by round 4 | Empty by round 6 |
> |---|---|---|---|---|---|---|
> | 3 | No Push (two dice) | 9.25 | 8 | 4 to 16 | 13.5% | 32.3% |
> | 3 | Pushing every round (three dice) | 6.33 | 6 | 3 to 11 | 32.3% | 59.7% |
> | 3 | Pushing every round, Light Trigger once | 6.67 | 6 | 3 to 11 | 27.3% | 55.6% |
> | 2 | No Push / Pushing every round | 6.25 / 4.33 | 5 / 4 | | | |
> | 4 | No Push / Pushing every round | 12.25 / 8.33 | 11 / 8 | | | |
>
> Gas Rating 3 gives medians of 8 rounds with no Push and 6 Pushing every round, the closest whole-number medians to about 9 and about 6. With no Push the canister has emptied by round 8 51.3% of the time and lasts 9 or more rounds 48.7% of the time; its mean is 9.25. Rating 2 gives medians of 5 and 4, short of both halves, and rating 4 gives 11 and 8, over both. In a simulation of 200,000 canisters per case, the reference Rookie, who makes one ODM Gear roll each round with Agility 3, ODM Gear 2 (OQ-72), no dodge Talent (decision batch 2b), and Stress 1 and Pushes only when short, gets a median of 7 rounds (mean 8.24, 10th to 90th percentile 4 to 14) when the roll needs 1 success, Pushing on 27% of rounds, and a median of 7 (mean 7.23, 3 to 12) when it needs 2, Pushing on 60%. At ODM Gear 1 the same soldier gets a median of 7 (mean 8.06, 4 to 14), Pushing on 32%, and a median of 6 (mean 7.10, 3 to 12), Pushing on 66%. Fewer Pushes at ODM Gear 2 only make gas last longer, so the medians above still meet ADR-0014's gas target. As the decisions require, the Pushes that raise the Gas Roll are dodges, Fly, and Break Attention, never strikes, because a strike's gear item is a Blade Set. The spread is wide: about 1 canister in 7 empties by round 4 even without a Push, which is why Standard Issue carries a spare from Funding 2 upward (section 4.9). A strike spends no gas, so a soldier who holds Blind Spot and strikes can go several rounds without a Gas Roll; OQ-60 records gas per round of fighting as a Chapter 5 simulator case.

> **Design note (OQ-182):** Flight pulls on the gas target in both directions at once. Every ODM move is now a roll whose gear item is the soldier's ODM Gear, so a soldier who moves on the wires Pushes more often than the reference Rookie's one ODM Gear roll a round modelled, and Momentum makes soldiers fly more; a point spent on a clean line takes a round's Gas Roll away outright. The full canister's Gas Rating 3, the Gas Roll's two dice and three, and the issue of a spare from Funding 2 upward are ADR-0014 starting values, and the table above was measured before Flight: it stands as the record of the rules it measured and is stale until the rerun (Chapter 5, section 5.13).

## 4.4 Blade Sets

A **Blade Set** is one pair of ODM blades, and the only unit in which they are carried, counted, passed, and lost. `data/gear/blade-sets.yaml` holds the rule.

### The handles

- A soldier's handles hold **at most one Blade Set**, the set in use (`handles`).
- Only the Blade Set in the handles supplies Gear Dice, or counts as had, for the Nape strike, Body Part strike, Break Free, and the reserved Block and Fight. Every other carried Blade Set counts as not had for those entries until it is swapped in. So a soldier with empty handles cannot make a Nape strike until they swap (Chapter 2, `gear_requirement`).
- When a Titan Engagement begins, a soldier whose handles are empty fits a carried Blade Set into them, if they have one.
- The set in the handles counts as no item. Every other Blade Set counts as 1 item (section 4.7).

### Ruin

When a Pushed roll whose gear item is the Blade Set in the handles is final, and at least 1 point of wear is left after any rule that ignores wear (such as Blade Discipline), that Blade Set is **ruined** (`wear`). It is discarded at once, and the handles are empty. A Blade Set's current rating never falls; ruin takes the place of wear. A Blade Set is otherwise lost only when it is dropped, passed, or named by a rule.

**A Blade Set a Fear Roll result drops.** A Chapter 3 Fear Roll row can drop the Blade Set in the soldier's handles (`data/harm/effect-types.yaml`, `drop-blade-set`; decision batch 7, 7-8). The handles are empty, and the set lies at the soldier's Position. No one takes it during the Titan Engagement, and when the Titan Engagement ends it is shared out with the left items (section 4.11; decision batch 8, 8-13). The soldier refits from a carried Blade Set with the swap below, which they can make during a turn spent in advance.

### The swap

- **Effect:** if the handles are empty, fit one carried Blade Set into them (`swap`).
- **In a Titan Engagement:** once during each of the soldier's own turns, at any point in that turn, spending the soldier's **move** (decision batch 10, OQ-185). A move can change no Position (Chapter 5, section 5.2), so a soldier who refits stays where they are and still has their action; what a ruined Blade Set costs them is that turn's Flight, and with it the Momentum the Flight would have given. A turn spent in advance still happens (Chapter 1, section 1.9), so the soldier can swap during it, spending that turn's move.
- **Outside a Titan Engagement:** at any time, as often as the soldier likes, spending nothing.
- A Down soldier cannot swap. A Squadmate swaps exactly as a player character does.

> **Design note (OQ-63):** The handles, ruin after any remaining point of wear, a swap only into empty handles, and filling the handles when a Titan Engagement begins are this chapter's reading of "a Pushed blade die 1 ruins the set; the swap is free once per turn". OQ-72 changes only ODM Gear: every issued Blade Set stays rated 1, and a Squadmate never ruins one.

> **Design note:** A Blade Set rated 1 is ruined on 1 Pushed roll in 6 when the soldier Pushes whenever allowed. A soldier who Pushes only when short loses it more often per Push, about 1 in 5, because a Gear Die showing 6 often makes the Push unneeded. Because any wear ruins a set, a higher rating makes a set more fragile per strike, not less. A simulation of 200,000 strikes per case, Pushing only when short, gives:
>
> | Build | Strike needs | Pushed | Ruined per strike | Strikes per Blade Set |
> |---|---|---|---|---|
> | Rookie: Strength 4, Talent 1, Blade Set 1, Stress 1 | 1 | 22.4% | 4.5% | about 22 |
> | Rookie | 2 | 54.7% | 10.1% | about 10 |
> | Rookie | 3 | 74.9% | 13.0% | about 8 |
> | Veteran: Strength 5, Talent 2, Blade Set 2, Stress 2 | 4 | 62.2% | 19.4% | about 5 |
> | Levi-grade: Strength 6, Talent 3, Blade Set 3, Stress 2 | 4 | 54.9% | 24.0% | about 4 |
>
> OQ-63 records the rating 2 and 3 figures for Requisition, which grants those sets by Scarcity with no price (Chapter 7, section 7.3).

> **Design note (OQ-185):** Blades could not run out, because the replacement was free: a soldier could ruin a set on a Push and refit it in the same turn at no cost, and raising the ruin rate could never fix that. Spending the move costs exactly the right thing, and it touches no die and no tuned number. A move can change no Position, so a soldier at Blind Spot who wrecks their steel still cuts that turn; what they give up is their Flight, and under Chapter 5's rules losing a Flight means losing Momentum and losing ground. The over-committed Push that wrecks the blades now costs the next move. It does not close ADR-0010's route to the Nape either, since a Nape strike needs a Blade Set in the handles and a soldier can still refit with their move and cut with their action on the same turn. No tuned value moves with it, but the table above was measured before it and before Flight, so those figures are stale until the rerun (Chapter 5, section 5.13).

## 4.5 Horses

`data/gear/horses.yaml` holds the rule.

### A soldier's horse

- A soldier's horse is the one their sheet records, from Standard Issue. **A soldier can mount only their own horse** (`own_horse`).
- In a Titan Engagement a horse holds a Position. While its soldier is mounted, it holds the soldier's Position and changes Position with them. After the soldier dismounts, it stays at the Position where they dismounted until they mount it again, and the sheet records that Position together with the Focus Titan it is held relative to (section 4.12). Chapter 5 states where each horse is when a Titan Engagement begins, whether a horse changes Position by any other rule, whether a Titan's behavior can target one, how a soldier's Positions relative to two Focus Titans relate, and what a recorded Position becomes when its Focus Titan dies (section 5.2, `data/engagement/positions.yaml`, `placement`, `horses`, `two_focus_titans`; `horse_position`). A horse whose riderless-horse decoy succeeds leaves the Titan Engagement: it holds no Position and cannot be mounted or give Gear Dice until the Titan Engagement ends (section 5.6).
- **When a Titan Engagement ends,** no horse holds a Position any longer. Each living soldier's horse is still their own, lame or not, and a horse that left as a decoy is its soldier's own again. A soldier who was mounted stays mounted, and one who was not stays dismounted (`titan_engagement_ends`).
- Outside a Titan Engagement no horse holds a Position.

### Mounted and dismounted

A soldier is **mounted** while riding their own horse. The sheet records it as true or false. A mounted soldier is never airborne (`mounted`).

- **Mount,** with no roll (`mount.requirements`):
  - **In a Titan Engagement,** as part of a move. The soldier's own horse holds the Position the soldier holds when they mount, both compared relative to the Focus Titan recorded with the horse's Position; the horse is not lame; and the soldier is not airborne, Down, Grabbed, or carried.
    - **Outside a Titan Engagement,** the soldier has their own horse and it is not lame, and the soldier is not airborne, Down, or carried.
  - **Both arms lost.** A soldier who has lost both arms mounts and dismounts only with a comrade's help (Chapter 3, section 3.2, *Lost limbs*; decision batch 8, 8-25).
- **Dismount,** with no roll. In a Titan Engagement it is part of a move, and the horse stays at the Position the soldier holds when they dismount.
- **Within a move.** A move can include one mount or one dismount, made at the Position the soldier holds before or after the move's change of Position. A mounted soldier's ODM move dismounts before its change of Position. Chapter 5 states which Position changes a mounted soldier can make (section 5.2, `data/engagement/anchor-ratings.yaml`).
- **Becoming airborne from the saddle.** A mounted soldier whom a rule makes airborne, by an ODM move or a Fly roll whose calling rule says so, is dismounted first, with no fall. In a Titan Engagement the horse stays at the soldier's Position (`becoming_airborne`).
- **Forced dismount** (`forced_dismount`):
  - The horse becomes lame while the soldier is mounted: they are dismounted and fall from a horse (section 4.6). The horse stays at the Position.
  - The soldier becomes Down while mounted: they are dismounted and fall from a horse. The horse stays at the Position.
  - The soldier becomes Grabbed while mounted: they are dismounted, with no fall, and the horse stays at the Position.
- **Outside a Titan Engagement** there are no moves. A soldier mounts or dismounts when the rule for the procedure under way says so, as the Expedition and Chase rules will. If that rule says nothing, a soldier may mount or dismount at any time, subject to the requirements outside a Titan Engagement above.

Mounting and dismounting are the option `mount-or-dismount`, which changes the tracked value `mount-change` (section 4.13; OQ-35).

### What a horse rates

- A horse supplies Gear Dice to the **dodge**, to **Ride**, and to **Leap Clear** only while the soldier is mounted on it (ADR-0019; OQ-25; decision batch 8, 8-9). Horsemanship adds its dice to that dodge (Chapter 2; decision batch 5, OQ-121). Ride is the Leg roll on a Hard Ride (Chapter 7, section 7.1), and the Chase rules, not yet written, may also call for it.
- It supplies Gear Dice to **Break Attention** while the soldier is mounted on it, or while it holds the Position the soldier holds, both compared relative to the Focus Titan recorded with the horse's Position. Chapter 5 states what Break Attention does with the horse (section 5.6, `data/engagement/attention.yaml`, `break_attention`, `decoys`, `riderless-horse`).
- Otherwise the horse counts as not had for that entry (`gear_dice`).
- A mounted soldier's dodge or Break Attention may take its Gear Dice from ODM Gear instead, one item per roll. That roll is ODM use (section 4.2) and does not make the soldier airborne.
- A Pushed roll made with the horse wears the horse, not ODM Gear, and does not by itself make the Gas Roll three dice (Chapter 1, section 1.5; OQ-12). Sure Seat can ignore 1 point of that wear.

> **Design note (OQ-25; decision batch 2b):** Standard Issue rates a horse as it rates ODM Gear at every Funding (section 4.9), so a mounted soldier's dodge has the same pool with either item, and the choice is a choice of cost: horse wear, and a fall from a horse when it goes lame, against a Gas Roll and a Jam. A rating 2 horse goes lame as often as rating 2 ODM Gear Jams (section 4.9). A mounted soldier is never airborne, so a Jam from the saddle drops no one.

### Lame

A horse whose current rating is 0 is **lame** (`lame`). It cannot be mounted, adds no Gear Dice, and counts as not had for every entry. A soldier mounted on it is dismounted and falls from a horse. Standard Issue exchanges a lame horse unless the soldier declines the exchange (section 4.9). The interim issue replaces a worn or lame horse (section 4.9), and so does a full issue before an Expedition or at a depot; the Maintain Gear Downtime Action ends lameness too (Chapter 7, section 7.2). No other rule restores a horse. On an Expedition, every soldier who is not Down and whose horse is not lame is mounted on each Leg and dismounted at each Night Camp (Chapter 7, section 7.1).

> **Design note (OQ-61):** Mounting only one's own horse, a dismounted horse holding and recording its Position in a Titan Engagement and holding none outside one, the mount requirements outside a Titan Engagement, the Break Attention clause, dismounting when made airborne, and the forced dismounts are this chapter's rules, made before Chapter 5 defines moves. Positions are relative to a Focus Titan, and a Background Titan can enter as a second one, so a bare Position on the sheet could be read two ways. Naming the Titan is one more mark on the Squad sheet row, such as `@In Reach A`, and keeps the mount, take, and horse Break Attention tests closed.

## 4.6 Falls

A fall inflicts **damage**, the Chapter 3 kind of harm (`harm_kind` in `data/gear/falls.yaml`). A fall is never a Titan attack. This section answers what Chapter 3 left to this chapter: what happens to a soldier who becomes Down while airborne or mounted.

### When a soldier falls

A soldier falls only when a row of `triggers` happens:

- **Jam while airborne:** their ODM Gear Jams, once the roll that Jammed it is finished.
- **Down while airborne:** they become Down, once the harm that made them Down, including any Critical Injury it gives, has been resolved.
- **Down while mounted:** a fall from a horse, once that harm has been resolved.
- **Lame while mounted:** their horse becomes lame, a fall from a horse, once the roll that wore it is finished.
- **Carried:** the comrade carrying them falls for any reason, including a fall for becoming Down while airborne or mounted, becomes Grabbed while airborne, or dies while airborne or mounted. They fall from the carrier's band, at the same moment.
- **Named by a rule or a ruling:** another rule, such as a Chapter 5 rule (section 5.2) or the Chase rules, names a fall and its band, or low if it names none; or a called roll's stakes name a fall and the soldier fails the roll, low or high as the GM names from the fall's height, never extreme, in a Titan Engagement as well as outside one, and the Height steps never raise it (*Height*, step 1), or low if the GM names none (Chapter 1, section 1.1; decision batch 9, 9-5, 9-30, and 9-38). In a Titan Engagement it lands as any fall does (*After the fall*; decision batch 9, 9-44). The GM names that band with the stakes, before the dice are rolled. The GM states the soldier's current Health with those stakes (Chapter 1, section 1.1, item 2; decision batch 9, 9-35).

A Grab's hold ends the airborne and mounted states before its crush, so a soldier the crush makes Down meets neither Down trigger (Chapter 5, section 5.9; decision batch 5, OQ-124). Running dry, landing through a move, and being set down are never falls. **A fall never causes another fall** for the same soldier (`never_a_second_fall`).

### Height

Find the fall's band (`height`):

1. **A band already named.** A fall a ruling names takes the band the GM named with the stakes, low or high and never extreme, or low if the GM named none, in a Titan Engagement as well as outside one. A fall another rule names takes the band that rule names. No later step changes a band this step gives. A rule that makes a soldier fall and names no band, such as a knock loose (Chapter 5, section 5.4), letting go (section 5.2), or a release from a lift (section 5.9), takes the band the steps below give (decision batch 9, 9-38).
2. In a Titan Engagement, find the **fall's reference Titan**: the Focus Titan relative to which the soldier held the closest Position when they fell, in the order On Body, Blind Spot, In Reach, Distant. On a tie it is the Titan whose card, Grab, or effect caused the fall, and otherwise the living Focus Titan with the earliest label. The later steps, and where the fall lands, use that Titan (decision batch 5, OQ-123).
3. A fall from a horse is **low**, and no later step changes it.
4. Otherwise, use the Position the soldier held relative to the fall's reference Titan when they fell. Distant or In Reach is **low**. On Body or Blind Spot is **high**.
5. For a fall that is not from a horse, raise the band one step, to at most **extreme**, if the Titan Engagement's Anchor Rating is Giant Forest, or if the fall's reference Titan is of the Large Size Class. Both together still raise it one step.

Outside a Titan Engagement there is no reference Titan and no Position to read, so a fall takes the band step 1 gives, and is low if neither a rule nor the GM names one.

### The fall

Follow `procedure`:

1. Find the band.
2. The soldier is no longer airborne, mounted, or carried. If they carry a comrade, carrying ends, and that comrade falls at the same moment from the same band.
3. Roll D6 and add the band's value from the band table below. Find the row of the fall damage table below. Every total has a row.
4. If the row's damage is 0, the fall does no harm.
5. Otherwise the soldier takes that damage, following Chapter 3's damage procedure (section 3.1). A Critical Injury it gives has a rolled Injury Location and Injury Type Crush, as every fall's does (`injury_type`; decision batch 7, 7-5).

Because step 2 comes before the damage, a soldier whom the fall's own damage makes Down is no longer airborne or mounted, so the Down triggers above do not start a second fall. The fall's D6 is a table roll, not an attribute roll, so it takes no Circumstances (`damage_table`; decision batch 9, 9-2).

<!-- BEGIN RENDERED: fall-bands from data/gear/falls.yaml -->
| Band | Adds to the D6 |
|---|---|
| Low | +0 |
| High | +2 |
| Extreme | +4 |
<!-- END RENDERED: fall-bands -->

<!-- BEGIN RENDERED: fall-damage from data/gear/falls.yaml -->
| D6 + the band's value | Landing | Damage |
|---|---|---|
| 2 or less | No harm | 0 |
| 3–4 | Jarred | 1 |
| 5–6 | Hard landing | 2 |
| 7–8 | Heavy landing | 3 |
| 9 or more | Shattering landing | 4 |
<!-- END RENDERED: fall-damage -->

**After the fall.** Chapter 5 states which Position a fall from each Position leaves the soldier at, relative to the fall's reference Titan (section 5.2, `data/engagement/positions.yaml`, `falls_land`). A fall changes no gear rating, Gas Rating, or item. It is not a behavior, so no Reaction answers it, and it is not a Fear Roll trigger.

> **Design note (OQ-62):** The trigger list, the three bands and how Position, Anchor Rating, and Size Class set them, the procedure's order, and the damage table are this chapter's; no ADR sets falls. Health 6 is a legal build and stays one: capping Health at 5 would add a rule for 0.8% of Lifepaths, and the damage table already covers current Health 1 to 6.

> **Design note (Health boxes):** Falls are sized against current Health (Chapter 3, section 3.1), which runs from 1 to 6 for a soldier who is not yet Down, since Health itself runs from 2 to 6. A low fall does 1 damage on average (0 to 2), a high fall 2 (1 to 3), and an extreme fall 3 (2 to 4). Exact odds that the fall's damage alone brings the soldier to 0 and puts them Down:
>
> | Current Health | Low | High | Extreme |
> |---|---|---|---|
> | 1 | 66.7% | 100% | 100% |
> | 2 | 33.3% | 66.7% | 100% |
> | 3 | 0% | 33.3% | 66.7% |
> | 4 | 0% | 0% | 33.3% |
> | 5 or 6 | 0% | 0% | 0% |
>
> So, from full Health, a fall Downs a Health 2 soldier often, a Health 3 or 4 soldier only from high or extreme, and a Health 5 or 6 soldier never. Damage that reaches 0 also gives an immediate Critical Injury, which at a rolled Injury Location with none held is lethal or instant death 15.3% of the time (Chapter 3, section 3.2). A soldier who falls when already at 0 current Health, for example Down from crossed-off boxes while airborne, gains a Critical Injury whenever the fall does any damage: 2 times in 3 from low, always from high or extreme. That is lethal or instant death about 10.2% and 15.3% of the time on a first Critical Injury at that Injury Location. The Down-while-airborne fall is the simulator case recorded in OQ-62.

## 4.7 Carrying

`data/gear/carrying.yaml` holds the rule.

### Items and the carrying limit

- A soldier can carry **Strength + 4 items** before they are Overloaded (`limit`; Chapter 2, section 2.2). Attributes never rise, so the limit never changes.
- `items_counted` is the closed list of what counts. In brief: worn ODM Gear with its fitted canister, handles, and scabbards counts as none, and so does the Blade Set in the handles. Each spare canister, each other Blade Set, each medical kit, each tool kit, and each flintlock pistol count as 1, and each musket counts as 2. A carried comrade counts as 5 plus every item that comrade carries; Strong Back removes the 5, not the comrade's items. A horse, a prosthetic, and Squad Supply count as none. Nothing else counts.

### Overloaded

A soldier is **Overloaded** while they carry more items than their limit (`overloaded`):

- Every ODM move they make also spends their action (Chapter 1, section 1.9).
- If their action this round is already spent, they cannot make an ODM move.
- Nothing else changes: no roll, Gas Roll, Reaction, or move that is not an ODM move.
- Outside a Titan Engagement, being Overloaded has no effect unless the rule for the procedure under way says so.

**A soldier who has lost one leg** makes every move on foot spend their action as well, and cannot make one if their action this round is already spent, as an Overloaded soldier's ODM moves do, with the same exception outside a Titan Engagement (Chapter 3, section 3.2, *Lost limbs*; decision batch 7, 7-6).

### Shedding load

A soldier can shed load with the option `shed-load` (`shedding`):

- **Drop** any carried item that counts as 1 or more items, other than a carried comrade. A dropped item leaves play.
- **Set down** a comrade they carry. The comrade stops being carried and holds the soldier's Position.
- A carried soldier who is not Down can **stop being carried**, and holds the carrier's Position.

In a Titan Engagement, a soldier sheds load at any point during their own turn, as often as they like, spending neither the move nor the action. A carrier who is airborne cannot set a comrade down, and a carried soldier cannot leave a carrier who is airborne. Outside a Titan Engagement, a soldier sheds load at any time. A Down soldier cannot shed load.

### Lifting and carrying a comrade

Lift Comrade is the unrolled Catalog entry `lift-comrade`, whose requirements are `lifting_a_comrade`:

- **In a Titan Engagement:** a comrade holds the soldier's Position who is Down, or who is not Down, consents, and whom the both-legs grade forbids to move (Chapter 3, section 3.2, *Lost limbs*; decision batch 8, 8-11), and the comrade is not Grabbed, Pinned, or already carried. A Pinned soldier is never lifted (Chapter 5, section 5.7; decision batch 8, 8-18). The soldier is not Down, carries no other comrade, and is not carried. It spends the soldier's action, or, with Rescue Ride while mounted, happens as part of their move.
- **Outside a Titan Engagement:** the comrade is Down, or is not Down, consents, and meets the both-legs grade; is not Grabbed and not already carried; and takes part in the same procedure as the soldier. That means the soldiers the procedure's rule names, or, if it names none, every soldier in the Squad on the same Expedition, or every soldier in the Squad when none is under way. The soldier is not Down, carries no other comrade, and is not carried. It spends nothing.
- **Effect:** the soldier carries the comrade. A carried comrade is no longer airborne.

**While a comrade is carried** (`carrying_a_comrade`):

- The comrade holds the carrier's Position, and changes Position whenever the carrier's move does.
- The comrade is never airborne on their own ODM Gear. Being carried is not ODM use.
- The comrade's turns still happen, but their move changes nothing while they are carried. A carried comrade who is not Down keeps their action for entries that need no move (decision batch 8, 8-11).
- The comrade counts for the carrier as 5 items plus every item the comrade carries. Those items stay the comrade's: they also count against the comrade's own limit. Only the comrade can drop or pass them, and while the comrade is Down another soldier, the carrier included, can take one (*Taking an item*).
- A soldier carries at most one comrade, and a carried soldier carries no one.
- Carrying goes on after a Titan Engagement ends.

**Carrying ends** when:

- the carrier sets the comrade down, or the carried soldier stops being carried (*Shedding load*);
- the carrier becomes Down while neither airborne nor mounted: the comrade is set down at the carrier's Position;
- the carrier becomes Down while airborne or mounted: carrying goes on until step 2 of the carrier's own fall, where it ends and the comrade falls with them from the same band (section 4.6);
- the carrier becomes Grabbed: the comrade is set down at the carrier's Position, and falls if the carrier was airborne;
- the carrier falls for any other reason: the comrade falls with them;
- the carrier dies: the comrade is set down at the Position the carrier held, and falls if the carrier was airborne or mounted;
- the carrier retires: the comrade stops being carried, with no fall;
- the carried comrade becomes Grabbed: carrying ends with no fall (Chapter 5, section 5.9);
- the carrier becomes Pinned: carrying ends, and the comrade is Pinned too, with their own Crush Critical Injury at their own rolled Injury Location and their own pinning Body Part (Chapter 5, section 5.7; decision batch 8, 8-18);
- the carried comrade dies.

Outside a Titan Engagement no soldier holds a Position, so a comrade set down there, or no longer carried, holds none.

> **Design note (decision batch 8, 8-11 and 8-18; OQ-137, OQ-146):** A soldier who has lost both legs cannot move but is not Down, and Lift Comrade is the rule that already carries a comrade who cannot move. A Pinned soldier is not lifted: Lift Comrade has no roll, so it would free them for one action with no Heave count, and every rule of the falling Titan assumes the body comes off first.

### Passing an item

Passing an item is the unrolled action `pass-item`, which changes the tracked value `item-give` (OQ-35; section 4.13). Follow `passing_items`:

- **In a Titan Engagement:** the passer is not Down, and the receiver is a living comrade who holds the passer's Position. The receiver may be Down or Grabbed. Two soldiers who have both left the Titan Engagement count as holding the same Position (section 5.11). It spends the passer's action.
- **Outside a Titan Engagement:** the passer is not Down, and the receiver is a living comrade who takes part in the same procedure, as for Lift Comrade. It spends nothing.
- **What can be passed:** a spare canister; the passer's fitted canister, if it has gas after any Gas Roll the pass makes (section 4.3), which leaves the passer at Gas Rating 0 with no canister fitted and reaches the receiver as a spare with its Gas Rating; a Blade Set not in the handles; a medical kit; a tool kit; or a flintlock pistol or musket, loaded or empty. A kit or a firearm keeps its rating and current rating.
- **What cannot:** ODM Gear, the Blade Set in the handles, a horse, a carried comrade (set them down, then a comrade lifts them), and Squad Supply.
- **Effect:** one item moves from the passer to the receiver and counts against the receiver's limit from then on. If the receiver is carried, it also counts for their carrier.
- It is not rolled, so it is never Helped or Covered. No rule lets a soldier pass an item to a comrade at another Position.
- A passer who has used ODM Gear this round, and has not yet made that round's Gas Roll, makes it when they declare that they mean to pass their fitted canister, before it moves. If that roll empties the canister, it is discarded, nothing is passed, and the pass spends nothing, so the passer may still take an action that turn (section 4.3).

### Taking an item

Taking an item is the unrolled action `take-item`, which changes the tracked value `item-take` (section 4.13). Follow `taking_items`:

- **From a Down comrade** who is not Grabbed: the taker takes one item that comrade could pass if they were not Down.
- **From a dead comrade's left items,** in a Titan Engagement only, where they lie (section 4.11): the taker takes one of them.
- **In a Titan Engagement:** the taker is not Down, and the Down comrade holds the taker's Position, or the left items lie at it relative to the Focus Titan recorded with them (section 4.11). Two soldiers who have both left the Titan Engagement count as holding the same Position (section 5.11). It spends the taker's action.
- **Outside a Titan Engagement:** the taker is not Down, and the Down comrade takes part in the same procedure, as for Lift Comrade. It spends nothing. Left items are never taken outside a Titan Engagement; they are shared out. When the players disagree about who takes an item from a Down comrade, or in what order, they use Chapter 2's roll-off (`group_choices`). The Down comrade's player has no veto, since a Down soldier takes no action and the take is the taker's act.
- **Effect:** one item moves to the taker and counts against the taker's limit from then on. A fitted canister taken from a Down comrade leaves them at Gas Rating 0 with no canister fitted and reaches the taker as a spare with its Gas Rating. If the Down comrade has used ODM Gear this round and has not yet made that round's Gas Roll, they make it when the taker declares that they mean to take the fitted canister, before it moves. If that roll empties it, the canister is discarded, nothing is taken, and the take spends nothing (section 4.3).
- It is not rolled, so it is never Helped or Covered. No rule lets a soldier take an item at another Position.

> **Design note (OQ-64):** The item counts, a carried comrade counting as 5 plus their items, Strong Back removing only the 5, dropped items leaving play, the extra Lift Comrade requirements, and when carrying ends are this chapter's rules. Strong Back's effect in `data/character/talents.yaml` was changed to match.

> **Design note (OQ-65):** The list of what can be passed, including the fitted canister, the outside-Engagement requirement, having no thrown pass, and taking an item from a Down comrade with `take-item` are this chapter's rules, within what OQ-35 decided. Takes outside a Titan Engagement use the same roll-off as Field Repair order and the share-out.

> **Design note:** Standard Issue at Funding 3 is 3 items: a spare canister and two Blade Sets outside the handles. It is 4 items with a Medic's or Engineer's kit. So a carrier and a comrade who both hold it make at least 3 + 5 + 3 = 11 items, more than any limit (at most 10). Without Strong Back, such a carrier is Overloaded. Dropping all their own items clears it only for a carrier of Strength 4 or more whose comrade holds no kit (5 + 3 = 8); any other carrier must also take items from the comrade and drop them, spending an action for each item taken. With Strong Back the load is 6 to 8: it fits every carrier of Strength 4 or more, a Strength 3 carrier unless both soldiers hold a kit, and a Strength 2 carrier unless either does. Counting the comrade's items also means an item passed to a Down comrade weighs on whoever carries them, so no comrade serves as a container. At every Funding, Standard Issue without a Specialty kit fits the limit of a Strength 2 soldier, and a soldier can decline any spare they would be Overloaded by (section 4.9).

## 4.8 Field Repair

Field Repair is the Wits action `field-repair` (Chapter 2). It uses a tool kit for Gear Dice, and without one it rolls Wits alone, unless Make Do applies. `data/gear/field-repair.yaml` gives the procedure.

### The roll

- **Target:** the soldier names one item before rolling: ODM Gear, a tool kit, or a flintlock pistol or musket (`target`; decision batch 8, 8-12). A Blade Set, a horse, or a medical kit cannot be repaired. The tool kit that supplies the roll's Gear Dice cannot be the item it repairs. A tool kit at current rating 0 supplies no Gear Dice, so it can be repaired with another tool kit or with Wits alone (`kit_at_zero`).
- **Needs:** 1 success.
- **Circumstances:** as any attribute roll (`circumstances`; Chapter 1, section 1.4a; decision batch 9, 9-2). A repair made in the dark or in a downpour might be Hard, and it is Standard if the GM names no step. No step changes the 1 success it needs. In a Titan Engagement, Standard is the default, and the GM names another step only for something no rule already prices (Chapter 5).
- **On a success:** the item's current rating rises by 1 for each success, to at most its rating. ODM Gear raised above 0 is no longer Jammed.
- **On a failure:** nothing happens.

### In a Titan Engagement

- The item is the soldier's own, or belongs to a comrade who holds the soldier's Position. Two soldiers who have both left the Titan Engagement count as holding the same Position (section 5.11).
- It spends the soldier's action. It can be Helped, Pushed, and Covered as Chapter 1 states.
- A failed roll can be tried again on a later turn.

### Outside a Titan Engagement

- Field Repair is rolled **only in a care window held when a Titan Engagement ends, when a day passes during an Expedition, or on the interim day** (Chapter 3, sections 3.5 and 3.6), within that window's scope. The interim day stands in for ADR-0009's Night Camps, so its window allows Field Repair as an Expedition day's does (decision batch 5, OQ-130). It is never rolled in a care window held when a day passes in Downtime, in a care window held after harm outside a Titan Engagement, or at any other time. Restoring gear in Downtime belongs to the Maintain Gear Downtime Action (Chapter 7, section 7.2).
- The item belongs to any soldier in the window's scope.
- Each living soldier in the scope who is not Down may make **one Field Repair roll** in each such window. It is separate from their Treat Injury roll and does not use it up.
- A living soldier in the scope who is not Down, and is not rolling, may Help if they have not yet made or Helped a Field Repair roll in that window. Help is declared before the roll and spends that soldier's Field Repair roll for the window. At most 3 soldiers Help one roll.
- Any soldier who qualifies to Help can Cover the roll's Push, even one who has already rolled or Helped. Covering spends nothing.
- The players choose the order, using Chapter 2's roll-off if they disagree. Squadmates take part like player characters.
- A failed roll can be tried again only in a later such window.

Gearwright adds dice, and Make Do keeps them without a tool kit.

> **Design note (OQ-66):** The items Field Repair can target, repairing a worn-out tool kit, 1 current rating per success, and its care-window limit outside a Titan Engagement are this chapter's rules. The limit keeps gear restoration inside those windows and the Maintain Gear Downtime Action; it does not exist to carry a Jam between sessions, and seldom does. With one roll per soldier, a Jam is still there after the end-of-fight care window 0.1% of the time with six soldiers not Down, 2.1% with four, and 11.3% with three (Chapter 4 review round 3's model: Wits 3, no tool kit). Those figures are OQ-66's simulator case, reported beside the PC death target. The cost of a Jam is the fall and the rounds lost in the fight.

## 4.9 Standard Issue

Standard Issue is the gear every soldier receives when they join the Squad and whenever a rule issues it, scaled by Funding. `data/gear/standard-issue.yaml` holds the tables, rendered under *What it holds* below, and the procedure.

### Funding

The Survey Corps' Funding, from 1 to 6, picks the row of `by_funding`. The Funding rules are not yet written. **Until they are, Funding is 3** (`funding`).

### When it is received

- A new player character at the finish step of the Lifepath (Chapter 2, section 2.3.5).
- A starting Squadmate, and any new character who joins the Squad later.
- Every soldier in the Squad together, as a full issue, before each Expedition and on arriving at a depot Waypoint (Chapter 7, section 7.1).
- **While no Expedition and no Downtime is under way, every soldier in the Squad receives the interim issue together at the start of each session, after the interim day** and its care window, including that window's Field Repair rolls (Chapter 3, section 3.6; section 4.8; decision batch 5, OQ-120 and OQ-130). If a session begins partway through a procedure, such as a Titan Engagement or a care window, they receive it once that procedure has ended: after its last step, and so after sharing out a dead soldier's gear, Retirement, and promotion. While an Expedition or a Downtime is under way it never happens: the issue before each Expedition and a depot's issue take its place (`interim_issue`; Chapter 7, sections 7.1 and 7.2).
- Promotion gives no Standard Issue: a promoted Squadmate keeps its gear. From then on it receives every issue the Squad receives, including an interim issue that waits until after its promotion (`not_received`).

Every issue except the interim issue is a **full issue**, which follows the receiving steps below as written. The interim issue follows them with two differences (`interim_issue`): it replaces ODM Gear only if the soldier has none or its rating is below the row's, so Jammed or worn ODM Gear rated at least the row's is kept as it is; and it gives a Specialty item only to a soldier who holds none of that kind, so a kit at 0 is kept. Its horse step is the full issue's: it replaces a horse the soldier lacks, a lame or worn horse, and one rated below the row, and the soldier may decline the exchange (OQ-93).

> **Design note (OQ-59, OQ-93; decision batches 2b and 3):** The interim issue brings back what a fight uses up in Phase 1 play, which has no Expedition rules to issue gear: canisters, Blade Sets, a lame or worn horse, and Squad Supply. It leaves a Jam to Field Repair and a spent kit to restocking or Field Repair. For ODM Gear and kits it stays narrower than a full issue, so that wear carries between sessions only on items a Phase 1 rule other than Standard Issue can restore: ODM Gear and tool kits through Field Repair, and medical kits through restocking. No Phase 1 rule restores a horse, so the interim issue replaces a worn one (OQ-93). Otherwise a horse worn once would dodge a kill entry 16.0% of the time instead of 20.7% (measured with the fixed need of 3 that the kill pool of 9 replaced) for the rest of Phase 1 play, and go lame within three rounds 31.5% of the time instead of 10.6%, while a lame horse came back new. A Jam is nearly always repaired in the care window of its own fight (section 4.8), so what carries from one session to the next is a Jam that window could not repair, a spent kit, and the wear on ODM Gear rated at or above the Funding row.

### What it holds

- **By Funding** (`by_funding`): ODM Gear and its rating, a full fitted canister, a number of spare canisters, a number of Blade Sets (counting the one in the handles, each rated 1), and a horse and its rating.
- **By Specialty** (`by_specialty`): a Medic receives a medical kit, and an Engineer a tool kit, each rated 1. No other Specialty receives an item. A Squadmate uses its template's Specialty.

<!-- BEGIN RENDERED: standard-issue from data/gear/standard-issue.yaml -->
**By Funding**

| Funding | ODM Gear rating | Fitted canister | Spare canisters | Blade Sets, counting the one in the handles | Blade Set rating | Horse rating |
|---|---|---|---|---|---|---|
| 1 | 1 | one, full | 0 | 2 | 1 | 1 |
| 2 | 1 | one, full | 1 | 2 | 1 | 1 |
| 3 (used until the Funding rules are written) | 2 | one, full | 1 | 3 | 1 | 2 |
| 4 | 2 | one, full | 1 | 4 | 1 | 2 |
| 5 | 2 | one, full | 2 | 4 | 1 | 2 |
| 6 | 3 | one, full | 2 | 5 | 1 | 3 |

**By Specialty**

| Specialty | Item | Rating |
|---|---|---|
| Medic | Medical kit | 1 |
| Engineer | Tool kit | 1 |

No other Specialty receives an item. A Squadmate uses its template's Specialty.
<!-- END RENDERED: standard-issue -->

### Receiving it

Follow `receiving.steps` in order:

1. **ODM Gear.** A soldier with none, or whose ODM Gear is Jammed, worn (its current rating is below its rating), or rated below the row, receives ODM Gear at the row's rating with a full current rating; the one it replaces leaves play. Any other ODM Gear is kept as it is.
2. **Canisters.** Every canister the soldier has is refilled to full, a full one is fitted if none is, and full spares are added up to the row's number. None is taken away.
3. **Blade Sets.** Blade Sets are added up to the row's number, counting the one in the handles, and one is fitted if the handles are empty. None is taken away.
4. **Horse.** A soldier with no horse, or whose horse is lame, worn (its current rating is below its rating), or rated below the row, receives one at the row's rating with a full current rating. The one it replaces leaves play, and a soldier mounted on it is mounted on the new horse. Any other horse is kept as it is.
5. **Specialty item.** A soldier whose Specialty has a row, and who holds no item of that kind at a current rating above 0, receives one. When they do, every item of that kind they hold at 0 leaves play.
6. **Declining.** The soldier may decline any spare canister, Blade Set, or Specialty item they would receive. In any issue, a soldier may also decline the exchange of Jammed or worn ODM Gear at step 1, or of a lame or worn horse at step 4, and keeps that item as it is, worn or at current rating 0, until a rule restores it (section 4.1). Each choice is made at the step that would give the item.

Standard Issue never restores the current rating of an item a soldier keeps. Field Repair, restocking a medical kit, and the Maintain Gear Downtime Action (Chapter 7, section 7.2) do that. At a step that would replace a kept item, the soldier may hand it in and take the issue in its place; keeping it is the default (`kept_item_exchange`; decision batch 8, 8-12). When every soldier in the Squad receives Standard Issue together, Squad Supply is restocked too (section 4.10).

> **Design note (OQ-59):** Every quantity and rating in both tables, Funding 3 until the Funding rules exist, the horse and the Specialty kits as part of Standard Issue, and the receiving steps are this chapter's rules, with the ODM Gear ratings OQ-72 sets and the horse ratings decision batch 2b sets. Declining an exchange keeps a harness or horse rated above the row, earned at higher Funding or through Requisition, out of the bin when a poorer issue arrives, without granting a rating the Funding row does not pay for. A full issue replaces worn ODM Gear and worn horses as well as Jammed and lame ones (decision batch 2b): at rating 2, 1 of 2 is the common state after a fight, and one Field Repair success turns 0 of 2 into 1 of 2, so an issue that replaced only a Jammed harness would reward leaving a Jam unrepaired before an Expedition. The Maintain Gear Downtime Action keeps its role for items rated above the row that a soldier declines to exchange. The glossary's Standard Issue entry names joining the Squad, any rule that issues it, the horse, and a Specialty's kit.

> **Design note (ADR-0014 reference builds; OQ-01, OQ-72, decision batch 2b):** The Funding 3 row issues ODM Gear and horses at rating 2, and Blade Sets at rating 1. That is ADR-0014's Rookie: ODM Gear and horse rated 2, every other item rated 1, and Talent dice on no roll a target measures except the Nape strike, the Body Part strike, Break Free, and Treat Injury, so none on the dodge, Fly, Break Attention, Ride, or Read (OQ-94). The Veteran's Blade Set and kit ratings of 2, and the Levi-grade soldier's ratings of 3, come from higher Funding or from Requisition (Chapter 7, section 7.3). The Veteran's ODM Gear and horse ratings equal the Rookie's. Pushing wears rating 1 gear on 1 Pushed roll in 6, so it is the rating that Jams fastest. In a simulation at a fixed Stress 1 (50,000 runs per case), a soldier making one ODM Gear roll every round with Agility 3 and no dodge Talent had these results:
>
> | ODM Gear rating | Pushes | Median rounds to a Jam | Jammed within 5 rounds | Jammed no later than a full canister empties |
> |---|---|---|---|---|
> | 1 | whenever allowed (83% of rolls) | 5 | 52.7% | 59.6% |
> | 1 | only when short of 2 successes (66%) | 6 | 46.9% | 55.9% |
> | 2 | whenever allowed | 9 | 28.0% | 38.1% |
> | 2 | only when short | 10 | 21.8% | 33.6% |
> | 3 | whenever allowed | 11 | 15.4% | 26.2% |
> | 3 | only when short | 14 | 10.3% | 21.3% |
>
> A fixed Stress overstates Pushing, since each uncovered Push raises Stress and more Stress Dice bring more 1s that forbid the next Push. With Stress starting at 1 and rising by 1 on each Push, Pushing only when short of a fixed need (200,000 runs per case, re-run after decision batch 2, Stress Responses not applied; these are samples, so the rating 2, need 3 row reads 10.5% where the exact figure is 10.6%), the soldier who holds a Titan's Attention and dodges every round, which is the worst case, had these results. These runs predate Attack Dice: each card needed a fixed number of dodge successes, which decision batch 8 replaced with 3 Attack Dice per point, given in brackets (8-1). The final full rerun re-read the Jam test with the holder dodging rolled Attack Dice, with every card at the kill pool as the upper bound (8-14; OQ-145). Every table reading stayed under a third, the worst at 27.7% against two standard Large Titans, and the kill-pool upper bound reached 32.9% in the same cell (`docs/reviews/simulator-report.md`, section 4.2).
>
> | ODM Gear rating | Fixed need (Attack Dice now) | Jammed within 3 rounds | Jammed within 5 rounds | Jammed no later than a full canister empties |
> |---|---|---|---|---|
> | 1 | 2 (6) | 27.9% | 38.2% | 45.2% |
> | 1 | 3 (9) | 31.7% | 42.8% | 49.2% |
> | 1 | 4 (12) | 32.3% | 44.1% | 50.3% |
> | 2 | 2 (6) | 8.3% | 14.9% | 21.8% |
> | 2 | 3 (9) | 10.5% | 18.9% | 25.8% |
> | 2 | 4 (12) | 11.2% | 20.0% | 27.2% |
>
> ADR-0014's prepared Squad kills in about 3 rounds, so at rating 1 the Attention holder Jams in just under a third of such fights, and at rating 2, the Funding 3 issue, in about a tenth. Every Jam while airborne at On Body or Blind Spot is a high fall. A soldier who rolls with ODM Gear only when a rule calls for Fly Jams far less often. A horse uses the same pool shape, so the same figures apply to mounted dodges. A Funding 3 horse is rated 2, so a mounted dodge made with it follows the rating 2 rows: it goes lame within three rounds 10.6% of the time at the kill pool's fixed need of 3 against one Titan and 22.6% against two (below), and lame still costs a fall from a horse. Well-Kept Rig and Sure Seat each ignore 1 point of wear once per Titan Engagement. A Squadmate never Pushes, so only player characters Jam from wear.
>
> One dodge covers one Titan's cards (ADR-0019), so a soldier whom two Titans' cards reach makes two dodges a round. In the same model with two dodges a round and gas ignored (200,000 runs per case, re-run after decision batch 2), rating 1 Jams within 3 rounds 41.8% of the time at a fixed need of 2 and 46.8% at 3, and rating 2 Jams 17.9% and 22.6% of the time.

> **Design note (OQ-72; decision batch 2b):** Standard Issue rates ODM Gear 1 at Funding 1 and 2, 2 at Funding 3, 4, and 5, and 3 at Funding 6, and ADR-0014's Rookie has ODM Gear 2 (ADR-0014). Before Chapter 5 adds anything, rating 1 fails the Jam test against two Titans, Jamming in about 47% of three-round fights at the kill pool's fixed need of 3, and sits just under it against one, at about 32%; every airborne Jam is a high fall, and every Jam comes from a player character's own wear. Rating 2 gives about 11% and 23%, under the threshold with room for the Stress Responses the full model adds. Funding 5 takes rating 2 with Funding 3 and 4 so that the ratings never fall as Funding rises, and Funding 6 takes rating 3 so that it still stands above the reference. The price is the reference dodge: a Rookie with Agility 3, no dodge Talent, and Stress 1, Pushing when short, meets a fixed need of 3 20.7% of the time at ODM Gear 2 against 16.0% at ODM Gear 1, and a need of 2 49.7% against 44.0%. Chapters 5 and 6 tune Attack Dice against a Rookie dodging with Agility 3, ODM Gear 2, no dodge Talent, and Stress 1 (a mounted Rookie's horse is rated 2 and dodges the same), and the gas target does not move (section 4.3). The Jam test binds Chapter 5 (section 5.13): at the Attack Dice and Tempo Chapter 5 sets, the reference Rookie (Agility 3, ODM Gear 2, no dodge Talent, Stress 1 when the fight begins) who holds Attention and dodges for three rounds, receiving cards from every Titan Chapter 5 lets act on them in a round, Pushing when short with Stress rising, with Stress Responses, Help, Covering, and turn debt applied, must Jam in no more than a third of those fights. Chapter 5 accepts it on the worst legal support pattern against behaviors a Behavior Table deals: the worst cell is 32.7%, two Large Titans with Covering and no Help, and every card at the kill pool, reported as an upper bound, reaches 35.4% (section 5.13; OQ-96). Well-Kept Rig, Light Trigger, and the Blade Set ratings are unchanged. Decision batch 2b rates horses on the same ladder as ODM Gear, 1, 1, 2, 2, 2, 3, so the Rookie's horse is rated 2 (section 4.5).

## 4.10 Squad Supply

Squad Supply is the shared pool the Squad draws on in the field. `data/gear/squad-supply.yaml` holds it.

### Kinds and units

- The Squad as a whole holds Squad Supply. No soldier carries it, and it counts as no item (`held_by`).
- It has four kinds, each a whole number of units that never drops below 0 (`kinds`, `units`):
  - **Rations:** a Leg spends rations by its Leg roll and its Pace, a Night Camp spends 1, and a hazard row may spend or lose rations (Chapter 7, section 7.1). With none left, the Leg or the camp still happens, at the cost Chapter 7 gives.
  - **Flares:** a rule that names a flare spends 1. Chapter 5 states which decoys for Break Attention use one (section 5.6, `data/engagement/attention.yaml`, `decoys`), and Chapter 7 adds the Signal Relay's flare, a hazard row's flare (section 7.1), and a flare fired at a person in a Skirmish, a Shoot roll with no Gear Dice that deals Burn damage (section 7.4; decision batch 8, 8-7).
  - **Medical supplies:** the uses below.
  - **Shot:** Reload spends 1 unit to load one flintlock pistol or musket (section 4.1; Chapter 7, section 7.4). No other rule spends shot, though a failed called roll's stakes may name 1 unit of it (below).
- A use needs a unit of its kind, and cannot be made with none left, except where Chapter 7 says what a Leg or a Night Camp with no rations costs. A unit is spent only by a rule that names its kind, or by a failed called roll whose stakes named 1 unit of one kind (Chapter 1, section 1.1, item 2). A unit is added only by a restock (*Stock*, below), a Requisition (Chapter 7, section 7.3), or a successful called search, a Spot or a Survive, of a place the GM names with the stakes, on which the GM may add at most 1 unit per success of one kind of Squad Supply that place could plausibly hold. A place yields Squad Supply to one called search only: once a called search of it is rolled, whatever its result, no later roll finds Squad Supply there, and the other soldiers present search it by Helping that roll (`spending`; decision batch 9, 9-5 and 9-29). A place is one building, wagon, cache, or the like the Squad can search in one go, named by the GM with the stakes. A Waypoint scene yields Squad Supply to at most two called searches, whatever the number of places the GM names in it; no later search in that scene finds Squad Supply, whatever its result (`spending`; decision batch 9, 9-41). No called search is made in a Titan Engagement or a Skirmish; a place at hand is searched once the fight has ended, under these caps (`spending`; decision batch 9, 9-45). The GM spends, adds, or removes units in no other way.
- The Squad sheet records each kind's units (section 4.12).

### Stock

`stock` sets how many units the Squad holds, by Funding, as the table below gives:

- When the Squad forms (Chapter 2, section 2.3.5), each kind is set to its Funding row.
- Whenever every soldier in the Squad receives Standard Issue together, including the interim issue at the start of each session (section 4.9), each kind below its row rises to it. None is lowered, so units a Requisition added above the stock stay.

<!-- BEGIN RENDERED: squad-supply from data/gear/squad-supply.yaml -->
| Funding | Rations | Flares | Medical supplies | Shot |
|---|---|---|---|---|
| 1 | 6 | 1 | 1 | 0 |
| 2 | 7 | 2 | 1 | 0 |
| 3 (used until the Funding rules are written) | 8 | 2 | 2 | 6 |
| 4 | 9 | 3 | 2 | 6 |
| 5 | 10 | 3 | 3 | 8 |
| 6 | 12 | 4 | 3 | 10 |
<!-- END RENDERED: squad-supply -->

### Medical supplies

Follow `medical_uses`:

- **On a care-window roll** (`care-bonus`): when a soldier declares a Treat Injury roll in a care window (Chapter 3, section 3.5), before rolling, they may spend 1 medical unit for **1 Bonus Die** on that roll, at most 1 unit per roll. It is never used in a Titan Engagement or on an aftermath roll. The Bonus Dice source is `medical-supplies` in `data/core/bonus-dice-sources.yaml`.
- **Restocking a medical kit** (`restock-kit`): at any point in a care window, including before its first roll and between rolls, any living soldier in its scope who is not Down may spend 1 medical unit to raise the current rating of one medical kit held by a soldier in the scope to its rating. Each kit can be restocked once per window. It is not a roll and spends no soldier's roll in the window.

> **Design note (OQ-67):** The Phase 1 kinds, the stock by Funding, both medical uses, and restocking at any point in a window are this chapter's rules. Shot stayed out of Phase 1 because no rule read or changed it, so it would have been later content on a live sheet; it joined as one row when the Skirmish rules added the firearms that spend it. Both medical uses are outside Titan Engagements and aftermath rolls, so Chapter 3's in-fight and aftermath treatment figures (OQ-57) do not move.

> **Design note (decision batch 7, 7-14, 7-17; OQ-141, OQ-143):** Rations gain the stock by Funding that the Expedition rules set, and shot the stock the Skirmish rules set. No target of ADR-0014 reads rations or shot, so neither needs a simulator run (ADR-0016, item 7). Rations are a column of the stock table beside the other kinds (decision batch 8, 8-12).

> **Design note (decision batch 9, 9-5 and 9-16):** Scarcity is what keeps rations biting on an Expedition and gear from climbing past the reference builds, so a ruling may spend a unit as a failure's cost or find one on a good search, never more than 1 unit a success, and from one search a place (9-29). Wear stays the Push's price (ADR-0004), and an object outside the item list tilts a roll through Circumstances rather than Gear Dice, so no ruling makes a new gear item, and Standard Issue stays the reference kit ADR-0014 measures.

## 4.11 When a soldier dies or retires

Chapter 3 leaves the gear of a dead soldier to this chapter. Follow `leaving_play` in `data/gear/carrying.yaml`:

- **Death.** The dead soldier's ODM Gear, horse, and every prosthetic fitted to them leave play. Every other item they had is left for the Squad: spare canisters, the fitted canister as a spare if it has gas, every Blade Set including the one in the handles, every kit, and every firearm. A soldier who dies after using ODM Gear this round, and has not yet made that round's Gas Roll, first makes it, before their fitted canister becomes a left item; a canister that roll empties is discarded and is never a left item (section 4.3).
- **Where left items lie.** If the soldier dies in a Titan Engagement while holding a Position and not Grabbed, their left items lie at that Position until the Titan Engagement ends, and their sheet records the Position, with the Focus Titan it is held relative to, and which items are still there (`where_left`). Chapter 5 states whether any rule moves them, and what the recorded Position becomes when its Focus Titan dies (section 5.2, `data/engagement/positions.yaml`, `left_items`, `two_focus_titans`). Otherwise they lie at no Position.
- **Taking a left item.** Before the procedure in which the death happened ends, a left item can be taken only with Take Item, by a soldier at the Position where it lies, relative to the Focus Titan recorded with it (section 4.7).
- **Sharing out.** When that procedure ends, at the moment promotion is timed (Chapter 2, section 2.10) and before any promotion, share out the left items in two steps (`shared_out`):
  1. The players give each left item not yet taken to a living soldier who took part in the procedure. For a Titan Engagement, a soldier who took part is one who held a Position at any point during it. The players choose together, using Chapter 2's roll-off if they disagree.
  2. Every left item the players did not give to a soldier leaves play.
- **Left behind.** The left items of a soldier who dies left behind when a Titan Engagement ends (Chapter 5, section 5.11; `engagement-flow.yaml`, `left_behind`) are not shared out: they leave play with the field, and step 1 never gives them. An item that soldier passed to a comrade before the ending is the comrade's and is unchanged (`shared_out`, `left_behind`; decision batch 5, OQ-131).
- **Retirement.** A retiring soldier's gear leaves play with them.
- A soldier who dies or retires while carried stops being carried, and a carrier who dies or retires sets their comrade down (section 4.7). A promoted Squadmate keeps its own gear.

Squad Supply belongs to the Squad, so no death or Retirement takes any of it away.

> **Design note (OQ-68):** Which items leave play, where left items lie in a Titan Engagement, taking one there with Take Item, and sharing out the rest in two steps when the procedure ends are this chapter's rules. Survivors taking gas and Blade Sets from the fallen during a fight is the canon picture the rule keeps.

## 4.12 The gear sheet and the Squad sheet row

The character sheet (Chapter 2, `record_on_sheet`) and the Squadmate stat block (`stat_block.fields`) each have a `gear` field that points to this chapter. `data/gear/sheet-fields.yaml` lists what it holds:

- ODM Gear's rating and current rating, the Gas Rating, and the Gas Rating of each spare canister;
- the rating of the Blade Set in the handles, or that the handles are empty, and the rating of each other Blade Set the soldier carries, since Requisition can give a Blade Set rated 2 or 3 (decision batch 7, 7-16);
- the horse's rating and current rating, whether the soldier is mounted, and, in a Titan Engagement, the Position the horse holds while the soldier is dismounted, with the Focus Titan it is held relative to;
- the rating and current rating of each medical kit and each tool kit held;
- for each flintlock pistol or musket held, its rating, its current rating, and whether it is loaded (decision batch 7, 7-17);
- which of the soldier's items are kept items (section 4.1);
- whether the soldier is airborne, the comrade they carry, and the comrade carrying them;
- in a Titan Engagement, the soldier's own Position relative to each living Focus Titan, by its letter, or that they have left, mirroring the positions column of their Squad sheet row (`positions`, added for Chapter 5, section 5.3);
- in a Titan Engagement, the soldier's Momentum, from 0 to the Anchors left, which is 0 outside one and is cleared when a Titan Engagement ends (`momentum`, added for Chapter 5, section 5.2);
- after the soldier dies in a Titan Engagement, the Position where their left items lie, with its Focus Titan, and which are still there.

Items carried, the carrying limit, Overloaded, Jammed, and lame are derived from those fields, not stored. The file also lists the invariants: a soldier is never both airborne and mounted, a carried soldier is neither, the carrying and carried-by fields always name each other, a horse records no Position while its soldier is mounted or outside a Titan Engagement, and every recorded Position names its Focus Titan. The Titan Engagement's first Focus Titan is A, the next Titan to become a Focus Titan in it is B, and so on (`focus_titan_label`). Whether a soldier has swapped a Blade Set during their current turn belongs to the turn, not the sheet.

**The Squad sheet row.** `squad_sheet_row` gives one line per soldier, in a fixed column order, starting with the soldier's name and then their Positions by Focus Titan letter, with short marks for Jammed, a Blade Set rated above 1, mounted, lame, a dismounted horse's Position and Focus Titan, a loaded firearm, Overloaded, airborne, carrying, and where a dead soldier's left items lie. Firearms share the kits column, and kept items are not marked on the row. A Squadmate's line holds all of its gear, so six fully tracked soldiers stay quick to update each round (OQ-29). In a Titan Engagement every soldier who takes part, player character or Squadmate, has a row, and its positions column is the record the Attention Ladder is read from (Chapter 5, section 5.3; OQ-97). A player character's line may hold its gear as well, or a dash in each gear column its character sheet already holds. The positions column is always filled, on every row.

**Squad Supply.** `squad_sheet` gives the Squad sheet one line for the units of each kind of Squad Supply.

## 4.13 Who uses these rules

- **Player characters** use every rule in this chapter.
- **Squadmates** use every rule in this chapter too (Chapter 2, section 2.10, `rules_applicability`). A Squadmate never Pushes, so Push wear never lowers its ratings, its ODM Gear never Jams from wear, and its Gas Roll is always two dice. It swaps Blade Sets, carries, can be Overloaded, passes and takes items, and takes Field Repair like a player character.
- **Titans** have no gear.

### Acts in this chapter

ADR-0024, limit 12, keeps a tracked value and a Catalog entry for every act a chapter lets a soldier choose, as an index for Talents, the Foundry system, and the in-fight effect menu. The acts this chapter lets a soldier choose, all in `data/character/action-catalog.yaml`, are:

- Changing a canister: `change-canister`, which changes `gas-restore`.
- Repairing gear: `field-repair`, which changes `gear-restore`.
- Restocking a medical kit: `restock-medical-kit`, which changes `gear-restore`.
- Lifting a comrade: `lift-comrade`, which changes `comrade-carry`.
- Passing an item: `pass-item`, which changes `item-give`.
- Taking an item from a Down comrade or from a dead comrade's left items: `take-item`, which changes `item-take`.
- Mounting or dismounting: `mount-or-dismount`, which changes `mount-change`.
- Swapping a Blade Set: `swap-blade-set`, which changes `blade-set-swap`.
- Dropping an item, setting down a comrade, or leaving a carrier: `shed-load`, which changes `load-shed`.
- ODM moves, taking off, and landing are moves, which change `position-change` (Chapter 5, section 5.2).

The Gas Roll, a fall, spending medical supplies on a roll, receiving Standard Issue, and sharing out a dead soldier's gear are rolls, Bonus Dice declarations, or procedure steps that rules call for, not acts a soldier chooses, so they need no tracked value of their own.

### Rows and changes in earlier chapters

This chapter's rows live in the files that Chapters 1 and 2 own:

- **`data/character/action-catalog.yaml`:** the tracked values `item-give`, `item-take`, `mount-change`, `blade-set-swap`, and `load-shed`; the unrolled actions `pass-item` and `take-item`; and the options `mount-or-dismount`, `swap-blade-set`, `shed-load`, and `restock-medical-kit`. The existing rows `lift-comrade`, `change-canister`, `field-repair`, and `gas-roll` point to this chapter's files, and `nape-strike` and `body-part-strike` carry the working ODM Gear requirement in a Titan Engagement (section 4.2).
- **`data/core/bonus-dice-sources.yaml`:** the `medical-supplies` source.
- **`data/character/talents.yaml`:** Strong Back removes a carried comrade's own 5 items, not the items that comrade carries, and its description says so (section 4.7).
- **Chapter 2:** section 2.6 names the Specialty kits; section 2.8 lists the new entries and the strike requirement; section 2.9's design note lists the new tracked values and entries; section 2.10's design note says a Squadmate's gear never wears; `squadmates.yaml` points to the Squad sheet row.
- **Chapter 3:** sections 3.4 and 3.5, `death-rolls.yaml`, `down.yaml`, and `treat-injury.yaml` point to this chapter's files.

The new entries are options or unrolled actions, so Chapter 2's procedure for actions outside the Catalog matches them with no change to its steps.

> **Design note (OQ-69):** OQ-69 lists every row and text change above, and all are applied. Of the two glossary changes it named, the Standard Issue entry is amended (OQ-59), and the Squad Supply change was withdrawn because Phase 1 had no shot kind (OQ-67). Decision batch 7 added shot as a kind, and the glossary's Squad Supply entry names it (7-17).

---

## Example: a Jam at On Body

*The numbers in this example are for illustration only. Attack Dice come from each Titan's Behavior Table in `data/titans/` (Chapter 6), and Chapter 5 decides placement, moves, and where a fall lands (sections 5.1 and 5.2). The rows below follow the YAML files at the time of writing. If the files change, the files govern.*

The Squad is fighting a Medium Focus Titan, labeled A on the Squad sheet, at Anchor Rating Wooded, at Funding 3. The example joins the fight partway through and numbers its rounds from there. The Squad sheet reads `Supply | Rations 8 | Flares 2 | Medical 2 | Shot 6`.

- **Private Jonas Keller** has Strength 3 and Agility 3, so Health 3 and a carrying limit of 7. His Stress is 1. His ODM Gear is rated 2, but a Push earlier in the fight wore it to 1. He begins round 1 airborne at In Reach, and his horse holds Distant, where he dismounted earlier. His row is `Jonas | A In Reach | ODM 1/2 | Gas 3 +3 | Bl 1+2 | Hr 2/2 @Distant A | - | Load 3/7 | A`.
- **Ilse**, a Squadmate on the Medic template, has Strength 3, Wits 4, and Stress 0. She begins mounted at Distant. Her row is `Ilse (Medic) | A Distant | ODM 2/2 | Gas 3 +3 | Bl 1+2 | Hr 2/2 M | Med 1/1 | Load 4/7 | -`.

**Round 1.**

- On his turn, Jonas's move is an ODM move from In Reach to On Body. He takes no action.
- Ilse's move is an ODM move to In Reach, which dismounts her first. Her horse stays at Distant, and her row now shows `A In Reach`, `Hr 2/2 @Distant A`, and `A`.
- After Jonas's turn, a Titan card resolves a behavior against him, and its Attack Dice score 2 successes for this example. His move this round is spent, so the dodge spends his round 2 turn in full. He dodges with his ODM Gear, because he is not mounted: Agility 3, 1 Gear Die from his worn ODM Gear, and Stress 1. The base dice show 6, 2, and 4, the Gear Die shows 1, and the Stress Die shows 3. That is one success. No Stress Die shows 1, so he Pushes and his Stress rises to 2. The re-rolled base dice show 6 and 5, and the two Stress Dice show 3 and 2. His two successes cancel the card's two: it whiffs against him.
- The roll was Pushed and his Gear Die shows 1, so his ODM Gear takes 1 point of wear, falls to 0, and **Jams**. He is airborne, so he falls once the roll is finished.
- **The fall.** On Body is high, and neither Anchor Rating Wooded nor a Medium Titan raises it. First he is no longer airborne. Then the D6 shows 4, plus 2 makes 6: a hard landing, 2 damage. He has no boxes crossed off, so his current Health drops from 3 to 1, and he is not Down. Chapter 5 decides where he lands (section 5.2).
- **Gas Rolls.** Jonas used ODM Gear this round and made a Pushed roll with it, so his Gas Roll is three dice: 1, 1, and 5. His Gas Rating drops from 3 to 1. His ODM Gear Jammed this round, but the Gas Roll for that round is still made. Ilse made an ODM move without a Push, so she rolls two dice, 4 and 6, and keeps Gas Rating 3.

**Round 2.**

- Jonas's turn was spent in advance by his dodge. It still happens, but he has no move or action.
- Ilse's move is an ODM move to the Position Jonas fell to. As her action she takes Field Repair on his ODM Gear. She has no tool kit, so she rolls Wits 4 alone, with no Stress Dice at Stress 0. One die shows 6, so his ODM Gear rises to 1, his row shows `ODM 1/2`, and the Jam ends.
- **Gas Rolls.** Ilse used ODM Gear, so she rolls two dice, 3 and 5, and keeps Gas Rating 3. Jonas did not, so he makes no Gas Roll.

**Round 3.**

- Jonas, still at Gas Rating 1, takes Change Canister as his action. He fits his full spare, so his Gas Rating is 3, and the canister he took off becomes a spare with Gas Rating 1. He uses no ODM Gear this round, so he makes no Gas Roll.

**Round 4.**

- A Squadmate, Tomas, is Down at Jonas's Position. Tomas holds his own Standard Issue, 3 items. Jonas lifts him as his action. His load is his own 3 items, plus 5 for Tomas, plus Tomas's 3, so 11 against a limit of 7: he is **Overloaded**. His row now reads `Jonas | A In Reach | ODM 1/2 | Gas 3 +1 | Bl 1+2 | Hr 2/2 @Distant A | - | Load 11/7 O | Carrying Tomas`.
- Dropping all 3 of his own items would still leave him at 8 against 7. With Strong Back his load would be 3 + 3 = 6, and he would not be Overloaded.
- Next round, his ODM move will also spend his action, so he can take no other action. If his action has already been spent, he cannot make the ODM move at all.

**After the fight.** When the Titan Engagement ends, the horses no longer hold Positions, and Jonas and Ilse can each mount their own horse. In the care window, Ilse declares Treat Injury on Tomas and spends 1 of the Squad's 2 medical units for 1 Bonus Die, so the Squad sheet reads `Medical 1`. Jonas's ODM Gear is still below its rating, at 1 of 2, so he may spend his window's Field Repair roll on it; each success raises it by 1, to at most 2.
