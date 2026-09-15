# Chapter 4, Gear: review round 1

Reviewed `docs/rules/04-gear.md`, every YAML file in `data/gear/`, Chapters 1 to 3 and their data, `CONTEXT.md`, every ADR, `DECISIONS-2026-09-14.md`, and OQ-59 to OQ-69. I did not read the parallel Chapter 4 review.

I parsed all 38 YAML files across the five scoped data directories and checked Chapter 4's item-to-Catalog links, provisional rows, table coverage, prose against data, and earlier-chapter changes. I ran independent probability checks from `/private/tmp/wof-ch4-r1.LOwh9p`, outside the repository, with 1,000,000 trials per case.

## Verdict

Two Critical and two Major findings remain open. No Minor finding remains.

The gas mechanic itself meets ADR-0014, but the chapter's dependency summary still calls it a three-die roll. The other direct ADR conflict is easy to miss: Chapter 4 says a cloak can have no mechanical effect, while ADR-0010 expressly makes a thrown cloak a Break Attention decoy. OQ-64 also creates a practical carrying-limit exploit, and the Field Repair prose disagrees with its source data about repairing a worn-out tool kit.

## Findings

### 1. Critical. The closed item rule forbids ADR-0010's thrown-cloak decoy

**Location:** section 4.1, line 36; `data/gear/items.yaml`, `rating_rules.other_objects`, lines 33 to 35; ADR-0010, paragraph 2; `CONTEXT.md`, Break Attention.

**Problem:** Chapter 4 says an unlisted object such as a cloak "has no mechanical effect." ADR-0010 and the glossary both name a thrown cloak as a decoy for Break Attention, which shifts a Focus Titan's Attention for its next card. This is an unlogged contradiction with an ADR. The Action Catalog cannot resolve it either: Break Attention is a listed action changing `attention-shift`, so Chapter 4's blanket denial and the later action both apply to the same cloak.

**Scenario:** A soldier at Blind Spot uses Break Attention by throwing their cloak. Chapter 5 follows ADR-0010 and shifts Attention to the decoy. Chapter 4 says the cloak has no mechanical effect, so the same declared action both works and does nothing.

**Fix options:**

1. Say that an unlisted object is not a gear item, adds no Gear Dice, and counts as no carried item, but can still be part of an effect that another rule expressly names. Keep the cloak as the example.
2. Remove the blanket "no mechanical effect" rule and limit this row to Gear Dice and carrying.

### 2. Critical. The opening dependency summary restores the rejected three-die baseline Gas Roll

**Location:** section 4 introduction, line 5; section 4.3, lines 127 to 137; ADR-0014, amended gas target; Chapter 1, section 1.5, lines 107 to 109.

**Problem:** The chapter says it builds on Chapter 1's "three-die Gas Roll." The settled rule is a two-die Gas Roll, raised to three only in a round with a Pushed roll whose gear item was ODM Gear. That distinction is the ADR-0014 amendment. Reading the introduction as the baseline makes the no-Push case use the pushed depletion rate and loses the target of about nine rounds.

**Scenario:** A player uses the dependency summary while setting up a round-end reminder and records three Gas Dice. Their soldier never Pushes, but a Gas Rating 3 canister lasts about 6.33 rounds instead of about 9.25.

**Fix options:**

1. Replace "the three-die Gas Roll" with "the two-die Gas Roll and its third die after a Pushed ODM Gear roll."
2. Replace it with the neutral "Gas Rolls" and leave the complete rule to section 4.3.

### 3. Major. A carried comrade can become an unlimited supply container

**Location:** section 4.7, lines 293 to 303, 323 to 329, and 340 to 349; `data/gear/carrying.yaml`, `items_counted`, `carrying_a_comrade.items`, and `passing_items`; OQ-64 and OQ-65.

**Problem:** A carried comrade always counts as 5 items, while everything they hold stays against their own limit. Overloaded changes only the carrier's ODM moves, and a carried soldier makes no ODM move. Passing explicitly permits a Down receiver. The Squad can therefore put any number of spare canisters, Blade Sets, and kits on a Down soldier, then carry that soldier for a flat load of 5. This bypasses the Strength + 4 carrying limit and the OQ-64 reason for making a rescue burdensome.

**Scenario:** A Strength 4 soldier carries three Standard Issue items and lifts a Down comrade, reaching 8 items against a limit of 8. Outside a Titan Engagement, the Squad freely passes ten spare canisters to the Down comrade. The carrier remains at 8 and flies without the Overloaded cost, moving thirteen counted items in total.

**Fix options:**

1. Add the carried comrade's counted items to the carrier's load while they are carried.
2. Make a carried comrade count as 5 plus their counted items, while Strong Back removes only the base 5.
3. Forbid a carried or Down soldier from receiving items, and require excess carried items to be shed before Lift Comrade resolves.

### 4. Major. The Field Repair prose and source data disagree on whether a worn-out tool kit repairs itself

**Location:** section 4.8, line 363; `data/gear/field-repair.yaml`, `target.cannot_repair`, lines 17 to 25; `data/gear/items.yaml`, tool kit `at_zero` and `restored_by`, lines 122 to 137; OQ-66.

**Problem:** The prose says "a tool kit cannot repair itself." The YAML forbids only the tool kit supplying the roll's Gear Dice from being the target. A worn-out kit counts as not had, supplies no Gear Dice, and is expressly restored by Field Repair with no other kit, so the YAML permits its owner to repair it with Wits alone. This split occurs in a normal failure state and changes whether an Engineer can recover their only kit.

**Scenario:** An Engineer's only tool kit reaches current rating 0. At the next eligible care window, the chapter forbids targeting it because it would repair itself. The source-of-truth YAML permits the roll because the spent kit supplies no Gear Dice.

**Fix options:**

1. Change the prose to say that the tool kit supplying Gear Dice cannot also be the target. State that a kit at 0 may be repaired with Wits alone.
2. If self-repair is meant to be impossible, change `field-repair.yaml` and remove Field Repair without another kit from the item's `restored_by` list.

## ADR-0014 gas check

The implemented Gas Rating 3 rule meets both halves of the target. My independent run produced a mean of **9.2488 rounds**, median **8**, with the standard two dice. The 10th to 90th percentile was **4 to 16**, with **13.5145%** empty by round 4 and **32.2286%** by round 6. With three dice every round, representing a Pushed ODM Gear roll every round, the mean was **6.3328**, median **6**, and the 10th to 90th percentile was **3 to 11**; **32.2448%** emptied by round 4 and **59.7599%** by round 6. These reproduce the chapter's quoted values.

I also reproduced the Blade Set check for OQ-63. At Strength 4, Talent 1, Blade Set 1, and Stress 1, Pushing only when short, a set was ruined on **4.436%**, **10.067%**, and **12.978%** of strikes needing 1, 2, and 3 successes. That is one set per **22.54**, **9.93**, and **7.71** strikes.

## Judgment on OQ-59 to OQ-69

| OQ | Judgment | Reason |
|---|---|---|
| OQ-59 | Sound, with its Chapter 5 test still open | Funding 3 preserves the Rookie's Gear Dice 1, every Funding row fits a Strength 2 soldier before a Specialty kit, worn items are not silently restored, and the glossary change is necessary. Chapter 5 still has to measure Jams per Engagement before this becomes final. |
| OQ-60 | Sound | The end-of-round timing is the only listed option that knows whether the third die applies. The two-die and three-die depletion figures meet ADR-0014, and part-used canisters make the decided gas handoff possible. Finding 2 is an introductory contradiction, not a defect in this procedure. |
| OQ-61 | Sound | Airborne and mounted have closed state transitions, horse wear follows ADR-0015, and the one-horse ownership rule keeps state on one sheet. Chapter 5's placement and move rules remain legitimate forward references. |
| OQ-62 | Sound as a starting table | Every possible total has one row, falls inflict damage rather than Titan-attack harm, and the quoted Down odds follow Health boxes. Its mission lethality test remains open until Expeditions and Chapter 5 provide fall frequency. |
| OQ-63 | Sound | The handles make the once-per-turn swap meaningful, Blade Discipline resolves before ruin, and the independent strike simulation matches the stated figures. |
| OQ-64 | Unsound in part | The closed item list and Overloaded timing work, but keeping a passenger's load wholly separate lets the passenger bypass the carrying system. Finding 3. |
| OQ-65 | Sound alone, unsafe with OQ-64 | Same-Position passing and the fitted-canister handoff are explicit. Passing to a Down receiver exposes OQ-64's unlimited-container exploit. Finding 3. |
| OQ-66 | Unsound in part | The care-window limit and per-success restoration preserve attrition, but prose and data give opposite answers for the common worn-out-kit case. Finding 4. |
| OQ-67 | Sound, pending mission calibration | The four pools are separate, every Phase 1 spend is named, and medical supplies use a proper Bonus Dice row. The PC-death target still needs the Expedition simulation recorded in the OQ. |
| OQ-68 | Sound | The timing matches promotion, and the closed list preserves spare gas, Blade Sets, and kits without creating a mid-procedure looting action. |
| OQ-69 | Sound | Moving the rows into their owning files follows ADR-0012 and completes the Action Catalog. All ten listed earlier-chapter edits are necessary and consistent with the Done chapters. Findings 1 and 2 require Chapter 4 edits, not additions to OQ-69. |

## Data, dependencies, scope, and terminology

All scoped YAML parses. The fall table covers every possible D6 total after each band modifier. Every Chapter 4 gear item names existing Catalog entries, and the provisional Catalog and Bonus Dice rows have unique ids. The Standard Issue counts, sheet fields, Talent hooks, Health/Down timing, care-window scopes, and promotion timing agree with the settled earlier chapters except where the findings say otherwise.

Chapter 4 honours the decisions file's explicit constraints: it supplies the required passing and mounting rows, defines mounted and airborne, assigns horse wear to Pushed horse rolls, tunes wear at Stress 1, bases gas on Pushed ODM Gear rolls rather than strikes, sizes falls against current Health, provides the one-line Squadmate gear row, and gives medical supplies a Bonus Dice source.

No Requisition, Funding procedure, Maintain Gear Downtime Action, Expedition, Chase, Operation Frame, or Shifter procedure is drafted here. Their mentions are forward references. Chapters 5 and 6 still own placement, Position changes, falls' resulting Positions, horse targeting, Break Attention effects, and the round-end sequence; none of those references makes Chapter 4 unusable. I found no glossary `_Avoid_` term in the scoped prose or gear data.
