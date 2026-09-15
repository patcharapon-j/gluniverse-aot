# Owner feedback round 1: gear list size and expansion beyond canon

Research and opinion only. Nothing in the rules, data, ADRs, or packet was changed. Written 2026-09-15 against the Phase 1 files as `docs/rules/PROGRESS.md` records them (all six chapters Done, simulator Done, packet published).

Owner notes covered here, verbatim:

1. "what about gear list should there be more stuff in it, coriolis the great dark have many equipments."
2. "in terms of equipment and talent we can expand it beyond base material of attack on titan. the original show only have few equipment and titan type. but since we are desiggning a TRPG we can expand on it for variety to better suit TRPG game system."

Talents are another researcher's file. This file covers equipment, Titan types, and one overall stance on expanding beyond canon.

Page numbers below are the printed book pages. In the PDFs under `docs/reference/`, both books sit 4 pages later than the printed number.

---

## 0. What exists today, counted

### Wings of Freedom gear (Chapter 4, `data/gear/`)

| Category | Count | Source |
|---|---|---|
| Gear items (things that can supply Gear Dice or count as items) | 6: ODM Gear, gas canister, Blade Set, horse, medical kit, tool kit | `data/gear/items.yaml` |
| Weapons | 1 (the Blade Set). Block and Fight are reserved Catalog entries with no rule | `items.yaml`, `data/character/action-catalog.yaml` (`block`, `fight`, `reserved: true`) |
| ODM variants | 1 issued rig, rated 1 to 3 by Funding. The Graduation Exam's training rig (no canister) is the only variant | `standard-issue.yaml` `by_funding`; `odm-gear.yaml` |
| Blade Set kinds | 1, always rated 1 on issue. Ratings 2 and 3 exist only as figures held for the unwritten Requisition rules (OQ-63) | `blade-sets.yaml`, Chapter 4 section 4.4 design note |
| Horses | 1 kind, rated 1 to 3 by Funding | `horses.yaml`, `standard-issue.yaml` |
| Kits | 2, one per Specialty (Medic, Engineer). Seven of nine Specialties receive nothing | `standard-issue.yaml` `by_specialty` |
| Squad Supply kinds | 3: rations (no Phase 1 use), flares (Break Attention decoy only), medical supplies (2 care-window uses). Ammo was removed (OQ-67) | `squad-supply.yaml` |
| Other objects | Explicitly none. "Any other object, such as a rope, is not a gear item" | `items.yaml` `other_objects`; Chapter 4 section 4.1 |
| Talents that name a gear item | about 13 of 40 (Gearwright, Horsemanship, Blade Discipline, Light Trigger, Well-Kept Rig, Make Do, Quick Refit, Loose the Horse, Sure Seat, Rescue Ride, Strong Back, Pry Loose, Sure Hands) | `data/character/talents.yaml` |
| Rule volume | 10 YAML files, 1,246 lines; Chapter 4 is 711 lines; the packet's gear section is 6,236 of 38,878 words (16%) | `wc`, packet |

So the list is 6 items, but the rules around those 6 are the second largest chapter in the game. What is thin is the catalogue, not the gear system.

### Wings of Freedom Titans (Chapter 6, `data/titans/`)

4 Titans: standard Small, Medium, Large, and the Sprinting Abnormal (Medium). One Abnormal Attention Ladder. The setup table meets the Abnormal 1 Titan Engagement in 12 (`engagement-setup.yaml` `medium_abnormal`, OQ-104). The packet's Titan material is 6,206 words, about the same size as gear.

### Coriolis: The Great Dark, chapter 6 "Equipment & Vehicles" (p. 89 to 115)

Counting rows in the tables, not counting services:

| Table | Rows | Page |
|---|---|---|
| Ranged weapons (7 pistols, 7 rifles, 2 carbines, 4 heavy, 2 other) | 22 | p. 100 |
| Grenades | 4 | p. 101 |
| Close combat weapons (5 blade, 4 axe, 4 blunt, 5 improvised, 3 other, 2 shields) | 23 | p. 101 to 102 |
| Armor, exos and delving suits | 12 | p. 102 to 103 |
| Weapon and armor accessories | 4 | p. 103 |
| General equipment and clothing | 17 | p. 104 |
| Delving and climbing | 6 | p. 104 |
| Camp, supply and navigation | 14 | p. 105 |
| Tools and kits | 10 | p. 105 |
| Digging and explosives | 9 | p. 106 |
| Light, scanning and scouting | 10 | p. 106 |
| Communication and computers | 9 | p. 107 |
| Medicine, decontamination and drugs | 17 | p. 108 |
| Books and pamphlets | 9 | p. 109 |
| Heirloom weapons and armor | 11 | p. 115 |
| Services and food (not carried) | 20 | p. 107 to 108 |
| Ground vehicles: 3 rovers, 27 upgrades, 9 rover weapons; 4 kites with 4 upgrade types | 47 | p. 110 to 114 |

About 175 carried item rows across 15 tables, plus vehicles. Every row carries the same five columns (p. 95): Bonus (Gear Dice, +1 to +4), Weight (rows on the sheet: tiny 0, light half, regular 1, heavy 2), Tech (Ordinary, Guild with a Guild letter, or Heirloom, plus an asterisk for restricted), and Cost in rukh. Weapons add damage, crit threshold, range band, and a feature keyword (p. 95, p. 100). Suits add armor rating, Blight protection, and extras slots (p. 98 to 99). Consumables are not items: air, food, water, ammunition, and power are all one abstract pool of supply points, 4 points per item row, spent by a consumption table during delves (p. 93 to 94; p. 214 per the research extraction). Heirlooms carry a D6 quirk table (p. 115).

How much is mechanics: in the general equipment table 14 of 17 rows have a Bonus; tools 10 of 10; camp and navigation 10 of 14; light and scouting 5 of 10 (the rest have fixed effects such as "lights one zone"); communication 3 of 9; medicine 4 of 17 with a Bonus and the rest a fixed effect (auto-heal 1, +2 to resist poison). Flavor-only rows exist (pipe, makeup gives +1, deck of cards heals 1 Hope) but are a handful. Nearly every row is a number. The catalogue exists because Coriolis is a shopping game: Explorers buy with rukh, are issued a small standard kit and D6 supply by the Guild (p. 25 to 26), and the GM is told that attrition on supply and gear is the game's pressure tool (p. 250).

### Alien RPG Evolved, chapter 5 "Gear & Tech" (p. 80 to 105)

| Group | Entries | Page |
|---|---|---|
| Handguns | 6 | p. 82 to 83 |
| Rifles | 6 | p. 84 to 85 |
| Other weapons (shotgun, incinerator, harpoon gun, plasma rifle, RPG, sentry gun, grenade launcher, 2 grenades, seismic charge, knife, fire axe, stun baton, cutting torch) | 14 | p. 86 to 89 |
| Suits and armor (M3, riot vest, EVA survival suit, APEsuit, 2 pressure suits, power loader) | 7 | p. 90 to 91 |
| Computers and data storage | 8 | p. 92 |
| Diagnostics and display | 13 | p. 93 to 94 |
| Vision devices | 8 | p. 96 |
| Tools and medical | 10 | p. 97 |
| Pharmaceuticals | 3 | p. 98 |
| Food and drink | 8 | p. 99 |
| Vehicles | 6 | p. 100 to 105 |

About 90 entries. Every weapon lists Modifier (skill dice), Damage, Range, Ammo supply rating, Power, Weight, Cost, and Special (p. 82). Every gear entry lists Weight, Cost, and one Effect line, almost always "+1 or +2 to SKILL" or an enabling effect ("detects motion in stealth mode"). Consumables are supply ratings for air, ammo, and power, rolled with stress dice, each 1 lowering the rating (p. 28 to 29). Every weapon comes with two reloads (p. 27). Carry limit is Strength x 2 items (p. 27 to 28). Again: nearly every row is a number, and the flavor lives in the paragraph beside it.

### The parent games' monsters, for the Titan half

Coriolis: The Great Dark has about a dozen creatures in chapter 13 (p. 221 to 241), each with Ferocity, Health, Armor, a D6 behavior table, and a D6 signature attack table with a "never the same attack twice in a row, add 1" rule (p. 222 to 223). Alien Evolved has the Xenomorph life stages and other creatures with D6 signature attack tables of escalating lethality (p. 208 onward). Wings of Freedom's Behavior Table is that shape with more structure (tiers, Position requirements, Body Parts used, fallback). Both parents ship 8 to 15 monsters; WoF ships 4. That gap is larger than the gear gap in play terms, because every Titan Engagement reads a Titan and most sessions never read a shopping list.

---

## 1. Owner note 1: "should there be more stuff in the gear list"

### Why now

Traced reasons, in order of weight:

1. **Phase 1 scope was written that way.** `docs/rules/PROGRESS.md` gives Chapter 4's scope as "ODM Gear, gas, Blade Sets, horses, carrying, Standard Issue". That is the whole Titan-fight kit and nothing else. Chapter 4's introduction lists what it deliberately left unwritten: "the Funding rules, Requisition and Scarcity, the Maintain Gear Downtime Action, the Expedition rules ..., the Chase rules, Operation Frames, and Shifters". Requisition is the only acquisition path the glossary names (CONTEXT.md: Requisition, Scarcity), so with it unwritten there is no way to get an item beyond Standard Issue, and a longer list would be dead data.

2. **ADR-0003 and ADR-0012 forbid inert rows.** The decisive precedent is OQ-67 (decision batch 2): ammo was dropped from Squad Supply because "a kind no Phase 1 rule reads or changes is Phase 2 content on a live sheet", as the Codex reviews said twice, even though the owner's own brief named ammo. The same test applied to any item with no rule reading it. Item rows that give no Gear Dice and change no tracked value have, under ADR-0003 item 9, "no mechanical effect", so they were not written.

3. **Closure was chosen to remove rulings.** `items.yaml` `other_objects` and Chapter 4 section 4.1 say only the six items are gear and any other object "counts as no item". This came from the "No rulings" stance (section 4.0: the GM never decides "what an object counts as") and from Chapter 4 review round 1 (Codex finding 1, Opus Minor list), where a cloak was both a decoy and "no mechanical effect" at once. The fix was to close the list and route the cloak through Chapter 5's decoy table.

4. **The gear-dice architecture makes every item expensive.** ADR-0006 and Chapter 1 step 6: one item per roll, and an item rates only the Action Catalog entries its `gear_dice_for` row names. Every new item therefore needs an entry to rate. The Catalog today has 7 dormant entries for later rules (spot, size-up, survive, persuade, endure, sneak, recall) and 2 reserved (block, fight). Those are the slots future gear will fill, and none is live in Phase 1.

5. **The Titan-fight items are tuned, which is why there are exactly these.** ODM Gear rating 2 at Funding 3 was set by OQ-72 against the Jam test (rating 1 Jammed in about a third of hard fights); the full canister at Gas Rating 3 was set by the ADR-0014 gas target (medians 8 and 6, exact); the Blade Set rated 1 by OQ-63 (any wear ruins it, so higher ratings are more fragile); horses were put on the ODM ladder by batch 2b so a mounted dodge has the same pool. These are the only items the simulator reads. Nothing here forbids more items; it means a Titan-fight item is a tuning change, and an expedition item is not.

6. **Canon fidelity was a supporting reason, not the deciding one.** Design notes cite canon for the shape of what exists (Trost's gas crisis for running dry, Armin's canister for passing, survivors salvaging from the fallen for Take Item, "no canon picture supports" a harness that fails in a third of fights). No ADR, decision, or OQ says the list must stay at the show's kit. The only canon lock in the ADRs is on Shifters (ADR-0002, ADR-0013).

Plain verdict: this is first-pass Phase 1 scope, deliberately closed for ADR-0003 hygiene, waiting on Requisition and Expedition rules that do not exist yet. It was not a fidelity ruling.

### Opinion

Agree, with changes. The owner is right that the catalogue is thin by the standards of both parent games, and right that a TRPG wants choices at supply time. Three qualifications.

First, the comparison with Coriolis is not like for like. Coriolis is a buying game: personal money, a Guild that issues D6 supply and a small kit, and 175 rows so that a crew's rukh means something. WoF's soldiers are issued their kit by a military whose Funding (1 to 6) is a campaign track, and the glossary's acquisition verb is Requisition, rolled against Scarcity. A price list in coin would fight that. The WoF analogue of Coriolis's catalogue is not "more rows on the character sheet" but "more rows on the Requisition table", where Funding and Scarcity gate them. Alien Evolved is the closer parent: about 90 entries, issued by career with two reloads, consumables as supply ratings. WoF already has the supply-rating part (Gas Rolls are Alien's supply rolls with a fixed two dice).

Second, most of what more gear would add is outside the Titan Engagement. Inside a fight the gear economy is the point: gas, blades, harness wear, one horse, one kit. Adding Titan-fight items dilutes the resource pressure the simulator was built to hold (section 4.3 gas medians, the Jam test, blade ruin per strike). Outside a fight there is nothing to spend gear on yet, because the Expedition, Chase, and Downtime rules are Phase 2. So the honest answer to "should there be more stuff" is "yes, when the rules that use stuff exist".

Third, more items cost table time in a specific place: the Squad sheet row (section 4.12) is one fixed-column line per soldier so that six soldiers stay quick to update each round, and the carrying limit (Strength + 4) is sized so that Standard Issue is 3 to 4 items and a carried comrade is 5. A dozen utility items per soldier would either sit outside that row (fine, a free-text kit list) or turn every rescue into an Overloaded calculation.

What more gear adds at the table in WoF, split:

- **Expedition and utility gear (no simulator impact):** choices at the Requisition step ("we take the medical wagon or the spare canister cart, Funding pays for one"), problem-solving on Legs (spyglass for the Signal Relay post, rope on a Wooded Waypoint, a lantern at a night camp), and Specialty identity for the seven Specialties that receive no kit today. This is where Coriolis's list earns its keep, and it is where WoF is emptiest. High value, low risk, but it needs the Expedition rules first.
- **Titan-fight gear (simulator impact):** a second canister size, a better Blade Set, a smoke round, a sound grenade that permits Draw Attention from Distant. Each one moves a tuned figure (gas medians, blade ruin, the Attention Ladder rows, OQ-113's ban on shouting from Distant). Low count, high care. This is where "more stuff" would bloat the sheet and unbalance the fight unless each item is measured.
- **Squad equipment (Operation Frames):** wagons, cannons, capture harpoons. These are not items on a soldier; they are scene assets. They belong to Formation Posts (CONTEXT.md: Supply Wagon is already a post) and to the Wall Defense and Capture Operation Frames, which are Phase 2.

### Impact and options

Touched by any expansion: Chapter 4 sections 4.1, 4.7, 4.9, 4.12; `items.yaml`, `carrying.yaml` (`items_counted` is a closed list), `standard-issue.yaml` (`by_specialty`), `sheet-fields.yaml`; the Action Catalog (new `gear` lists on existing entries, or new entries); CONTEXT.md (Requisition and Scarcity are defined but have no rule; a "Field Kit" or "Squad Equipment" term may be needed); the packet's gear section and the character sheet's gear field. No ADR needs amending for an expedition kit: ADR-0004 and ADR-0006 already describe how an item works. A Titan-fight item touches ADR-0014's targets and needs a simulator rerun (about 9 minutes, `tools/sim/run.py`, but with review rounds behind it). Foundry (ADR-0003, ADR-0012): `items.yaml` is the item compendium, so rows are cheap; an item that bends a rule (allows an action, changes a Position step) needs code.

Risks: dead data on a live sheet (the OQ-67 failure mode); dilution of the gas and blade pressure; Overloaded arithmetic creeping into every rescue; a catalogue that reads like a sci-fi shop, not a barracks.

Options:

- **(A) Nothing before the first playtest; a Phase 2 "Requisition and Kit" chapter.** Write Requisition and Scarcity, then three small tables: Field Kit (8 to 12 expedition items, each naming the dormant entry it rates), Squad Equipment (wagons, cannon, capture gear, attached to Formation Posts and Operation Frames), and Consumables (new Squad Supply kinds and uses). Effort M for the chapter with the usual three review rounds; no simulator rerun unless a row rates a Titan-fight entry. Recommended.
- **(B) A small playtest annex now: 5 or 6 expedition items with no Titan-fight effect.** Cheap (S), but with no Expedition rules they are inert, which is exactly what OQ-67 removed. They would test nothing in the playtest. Not recommended, except as a one-line packet question ("what did you wish you had brought?").
- **(C) A Coriolis-scale catalogue with coin prices, before the playtest.** Effort L, conflicts with Funding and Requisition as the glossary defines them, and every Titan-fight row would need measuring. Rejected.

### Recommendation

Option A. Keep the closed list, grow it in Phase 2 behind Requisition, and keep the Titan-fight kit exactly as tuned for the first playtest. Add one question to the playtest debrief asking players what they reached for and did not have; that is the cheapest possible data on what the list is missing. Before the first playtest: nothing else. Phase 2: the Requisition and Kit chapter, drafted after the Expedition rules so that every row has a rule that reads it.

---

## 2. Owner note 2: expand equipment and Titan types beyond the show

### Why now

There is no ADR, decision, or OQ that says content must stay within canon. What exists is narrower:

- **Era lock, by glossary.** CONTEXT.md sets the game "on Paradis during the walls era (845 to 850)"; Campaign Year runs 845 to 850 (OQ-32) and the Canon Clock advances it. Canon Proximity (Close or Distant) sets how near the Squad is to the canon cast. These fix the period and the technology level, not the item list.
- **Shifter lock, by ADR.** ADR-0002 (Shifters are GM-controlled, a playable module "may come later") and ADR-0013 (Intent Tables, Hardening, Extraction, the Colossal as a scene-wide disaster). CONTEXT.md reserves Hardening for Shifters. This is the one place canon is a hard rule, and it is about who can be a Titan, not how many Titan kinds exist.
- **Titan variety was designed to grow.** `titan-format.yaml` `abnormal_titan` lets an Abnormal list every value in full within bounds (Tempo 1 to 2, Nape Depth 3 to 4, Regeneration 2 to 4, Toughness 1 to 3, Severity 1 to 4; OQ-106). `index.yaml` has an `abnormals` list and a `ladders` list. `attention.yaml` `tests` holds 11 ladder tests, and 5 of them (mounted, airborne, carrying-a-comrade, most-harmed, down) are used by no ladder in the game. Those were put there for Abnormals not yet written. The simulator (`tools/sim/rules.py` `_titans`) loads every id in `standard_titans` and `abnormals` from `index.yaml`, so a new Titan file is picked up by the next run with no code change.
- **Canon was used as a design source, not a fence.** The Sprinting Abnormal's design note cites manga chapter 22 for its ladder; batch 4's decision on OQ-102 rewrote the ladder twice for balance and kept only the canon feel. Chapter 6's OQ-101 note says the tables "follow what Titans do in 845 to 850" and then explains that several entries use no Body Part purely to pass the kill-share limit. Fidelity was already yielding to the system where they conflicted.
- **Why only one Abnormal:** Chapter 6's scope line in PROGRESS.md is "Small, Medium, Large Behavior Tables and one Abnormal", and that one Abnormal used all three review rounds (a Critical on the ladder in round 3, batch 3e, batch 4, batch 4b). Scope, and the cost of the first one, not a fidelity choice.

Plain verdict: the four-Titan roster and the six-item kit are Phase 1 minimums. The design already anticipates more Titans (open lists, unused tests, an Abnormal bar instead of a target) and says nothing against invented gear. The only canon locks are the era and the Shifters.

### Opinion

Agree, and more strongly for Titans than for gear.

The show's kit is small because a story needs few props; a game needs decisions. Both parent games ship 8 to 15 monsters each with its own D6 table, and WoF's Behavior Table format is richer than either, with Position requirements, Body Parts used, fallbacks, and a ladder. Four Titans means the third session already knows every card. Abnormals are also where AoT's own fiction invites invention: the show says Abnormals "break the pattern" and shows a runner, a jumper, a crawler, a Titan that ignores the nearest soldier, a Titan inactive at night. The format can express most of those without a new rule, and each one creates a new tactical problem for the same Squad. Expansion here is high value and, thanks to the data format and the bar, has a known verification cost (section 5 below).

For gear, expansion beyond canon is fine but the show is less of a limit than the system is. Paradis in 845 to 850 has black powder, steam, iron, cannon, signal flares, wagons, and one great invention (ODM Gear). An invented item has to be something a Trost workshop could make and a Survey Corps quartermaster would issue. That is a narrow but real design space, and section 4 lists what fits.

Two boundaries I would hold even when inventing:

- **Titans die only at the Nape (ADR-0007), and Titans have no Health.** No cannon, spear, or trap kills a Titan. New gear can Break a Body Part, create an Opening, move Attention, or spend a Titan's card. This is the line that keeps the game about ODM soldiers.
- **Canon-dated inventions are Canon Clock content.** Thunder Spears (year 850, Return to Shiganshina) and anti-personnel ODM (year 850, the Uprising, Interior Police) are inside the Campaign Year range but are events on the Canon Clock. CONTEXT.md already has the tool: a Discovery "stays locked until the Canon Clock reaches" it. They should be Discoveries with Divergence Hooks, never Standard Issue.

### Impact and options

Titans: each new Titan is a YAML file, a row in `index.yaml`, a Chapter 6 section with a GM subsection (OQ-108), a packet entry, and a way to enter play. Today only a Medium Focus Titan rolls for an Abnormal (`engagement-setup.yaml` `medium_abnormal`); a Small or Large Abnormal needs a new roll row there, and OQ-104's rate (1 in 12) would be re-read. A Titan that needs a new effect type (the closed list is stress, critical-injury, knock-loose, grab, telegraph) or a new ladder test needs a Chapter 5 decision, an engine change in `tools/sim/engine.py`, and possibly an ADR-0010 amendment; that is the L case. A Titan built from the existing lists is S to M. The Abnormal bar (`data/titans/tuning.yaml` `targets.abnormals`) already defines pass and fail: floor at the standard Medium, winnable limit and ceiling at the standard Large, read row against row in both Squad sheet orders at 120,000 fights. No ADR needs amending to add a Titan within the format.

Gear: as in section 1. One addition: a Discovery-gated item needs the Titan Research rules (Research Points, Discoveries, Canon Clock), which are Phase 2.

A charter is worth recording as a short ADR (an "ADR-0016, content beyond canon follows the charter") so that later drafters and the Foundry port have one place to read the boundaries. That is S.

Options:

- **(A) Adopt the charter now, expand in Phase 2, Titans first.** One or two Abnormals per Phase 2 batch, each through the Chapter 6 pipeline; gear behind Requisition. Recommended.
- **(B) One new Abnormal before the first playtest** to exercise the authoring pipeline while the reviewers are warm. Tempting, but the first playtest should measure the tuned core, the Abnormal rate is 1 in 12 so it would rarely appear, and Chapter 6's one Abnormal cost three review rounds and four decision batches. Not before the playtest.
- **(C) No charter, expand ad hoc.** Cheapest today, and the way the item list gets a sci-fi flavor and the Titan roster gets a Shifter in disguise (the Sprinting Abnormal's first draft did exactly that and was cut for it, Chapter 6 section 6.5 design note). Rejected.

### Recommendation

Option A. Say yes to the owner's direction, write it down as a charter (section 3), and schedule it: Titans in the first Phase 2 batch, because the format and the simulator are ready for them; gear when Requisition and the Expedition rules exist. Nothing before the first playtest except the charter decision itself and the debrief question.

---

## 3. A canon expansion charter (proposal)

Guardrails so that additions feel like Attack on Titan and stay inside the system. Proposed as an ADR after the owner answers the questions at the end.

1. **Era and technology.** Paradis, 845 to 850. Black powder, steam, iron and steel, horses and wagons, signal flares, cannon, ODM Gear. No internal combustion, no radio, no Marleyan technology, nothing from after the Campaign Year range. A Garrison, Military Police, or Survey Corps workshop must plausibly be able to make it.
2. **Dated inventions are Canon Clock content.** Thunder Spears, anti-personnel ODM, the special target restraining weapon, and any other canon invention with a date are Discoveries gated by the Canon Clock or bought with Research Points, with a Divergence Hook. Never Standard Issue. A Distant campaign may reach them; a Close campaign reaches them when canon does.
3. **Titans die only at the Nape.** ADR-0007 stands for every item and every Titan. New gear may Break Body Parts, create Openings, change Attention, or spend a Titan's card. Cannon wound; blades kill.
4. **Shifters stay Shifters.** Hardening, intelligence, and targeting riders from the air are Shifter traits (ADR-0002, ADR-0013, CONTEXT.md). An Abnormal may be strange; it may not be smart. The Sprinting Abnormal's rewrite is the precedent.
5. **Every row has a rule that reads it.** ADR-0003 items 9 and 12 and ADR-0012: an item names the Catalog entry it rates or the tracked value it changes; a Titan entry uses the closed effect list and the closed ladder tests, or a Chapter 5 decision adds to those lists first. No flavor-only rows on a live sheet.
6. **Titan-fight content is measured before it ships.** Any item or Titan that a target or bar reads (gas, ODM rating, Blade Sets, decoys, Draw Attention, Read dice, Anchor Ratings, Toughness, Severity, Tempo) runs the simulator and is judged on ADR-0014's readings. Expedition and Downtime content needs no rerun.
7. **Access is Funding and Scarcity, not coin.** Standard Issue by Funding, Requisition against Scarcity (Standard, Limited, Rare). No price list. Branch variants (Garrison, Military Police) are the same items with a different rating or one named quirk, not new mechanics.
8. **Small tables, reviewed like chapters.** Each new category is 5 to 8 rows, and each new Titan is one section, through the same draft, review, fix cycle. Growth by batches, not by a catalogue.
9. **Glossary language.** New names follow CONTEXT.md and its Avoid lists (ODM Gear, never 3DMG; Survey Corps, never Scouts).

---

## 4. Gear ideas (about 15), with a canon label and where each lands

Labels: **canon** (in the manga or anime in the era), **canon-adjacent** (implied by the setting or seen in a form the era allows), **invented**. Lane: **fight** (a Titan Engagement rule, simulator reads it), **expedition** (Legs, Waypoints, camps, Formation Posts), **operation** (Operation Frames), **downtime**.

| # | Item | Label | Lane | What it would do, and the cost |
|---|---|---|---|---|
| 1 | Signal flares by colour (red Titan sighted, black Abnormal, green course change, yellow retreat, purple emergency) | canon | expedition | A Squad Supply use for the Signal Relay post: a flare is a Leg action that changes Command's response. Flares already exist as a kind. S, no rerun. |
| 2 | Smoke round | canon-adjacent | fight | A new Break Attention decoy that also blocks a Titan's sight of Distant for its next card. Touches the decoy rows and the Attention Ladder. M, rerun. |
| 3 | Sound grenade | canon | fight | Lets one soldier take Draw Attention from Distant once, spending 1 unit. OQ-113 banned that from Distant for balance, so this is a measured exception with a price. M, rerun against the Abnormal's bar. |
| 4 | Blade bandolier | canon-adjacent | fight (sheet only) | Two extra Blade Sets count as no item. Eases the Overloaded arithmetic for Slayers. S, no rerun (carrying only). |
| 5 | Large canister, Gas Rating 4, counts as 2 items | invented | fight | Chapter 4's own table gives medians 11 and 8 rounds at rating 4; the target is exact at 8 and 6, so this is a Requisition item, never issue. S to draft, but a deliberate departure from the gas target, so it needs a decision. |
| 6 | Supply wagon and canister cart | canon | expedition, operation | The Supply Wagon Formation Post exists in CONTEXT.md. A wagon carries Squad Supply and spare canisters, moves at Pace, and is what a failed Leg costs. Chapter 6's "no entry affects a horse" needs a wagon analogue before a Titan can reach one. M, no fight rerun. |
| 7 | Field medicine: splints, tourniquets, laudanum, a stretcher | canon-adjacent | expedition, fight (carrying) | Medical kit ratings 2 and 3 via Requisition; a stretcher lets two carriers count a comrade as 3 items each. Touches OQ-57's care-window figures if it adds dice. S to M. |
| 8 | Wall cannon and fixed artillery | canon | operation | A Wall Defense Operation Frame special action: a Body Part strike at Distant with Severity set by the Frame, never a kill. Not an item on a soldier. L inside a Titan Engagement, M as a Frame action. |
| 9 | Horse-drawn field cannon | canon | operation | As 8, mobile, tied to a Formation Post. Phase 2. |
| 10 | Special target restraining weapon (barrel-launched harpoons and wire) | canon (year 850) | operation, Discovery | The Capture Operation Frame's centerpiece: a use pins an arm or leg (moves it to Broken for one Regeneration clock). Canon Clock gated. M. |
| 11 | Anchor spikes | invented | fight | A carried set that gives one ODM Position step in Open terrain, once per fight. Touches `anchor-ratings.yaml` and every Open row. M, rerun. |
| 12 | Rations, water, horse feed | canon | expedition | Rations already exist with no Phase 1 use; feed makes a lame horse recover over days. S when the Expedition rules exist. |
| 13 | Survey Corps cloak as a counted item | canon | fight (small) | Today the thrown cloak is a free decoy. Making it an item that is gone once thrown gives the OQ-81 escalation a physical limit. S, rerun of the decoy rows. |
| 14 | Lantern and torch | canon | expedition | Night rules (Titans inactive without sun) are Phase 2; a lantern is the item those rules read. S. |
| 15 | Anti-personnel ODM | canon (year 850, Uprising) | Discovery, human conflict | Needs the reserved Block and Fight entries and human-scale combat, which Phase 1 does not have. L, and only if the owner wants human-versus-human play. |
| 16 | Thunder Spears | canon (year 850) | fight, Discovery | One use: a Body Part strike that Breaks the part outright, or a Nape strike with Bonus Dice against a hardened Nape (Shifters). Canon Clock gated; the first item that would let a Rookie Break a Large arm (Toughness 3) in one act, so it must be measured. M to L. |
| 17 | Spyglass | canon | expedition, fight (Read) | Gear Dice on Read from Distant, or on the dormant Spot entry. Read is tuned (needs 1 with 2 dice), so the fight use is a rerun; the Spot use is free. S. |
| 18 | Military Police and Garrison rigs | invented | downtime | The same ODM Gear at a different rating or with one quirk (a parade rig rated 3 that wears on any 1, Coriolis-style; a Garrison rig with a larger canister and one fewer Blade Set slot). Flavor for Origins and Requisition, no new mechanic. S. |
| 19 | Capture nets and bait | canon | operation | Hange's captures. Capture Operation Frame content. M. |

Of these, only 2, 3, 5, 11, 13, 16, and 17's Read use touch the simulator. Everything else is expedition, operation, or downtime content that can be written without re-measuring the fight.

---

## 5. Titan types

### How a new Titan is authored

A Titan is one YAML file in `data/titans/` in the format of `data/engagement/titan-format.yaml`:

- **Stat block:** `id`, `name`, `size_class`, `abnormal`, `tempo`, `nape_depth`, `regeneration_clock`, `body_parts` (five parts in order, each with `kind` eyes, arm, or leg and `toughness`; the order breaks Regeneration ties and picks the grabbing arm), `attention_ladder` (standard, or a ladder id from `index.yaml`). A standard Titan takes every number from its Size Class row; an Abnormal lists every value inside the bounds (Tempo 1 to 2, Nape Depth 3 to 4, Regeneration 2 to 4, Toughness 1 to 3, Severity 1 to 4).
- **Behavior Table:** six results in tiers (1 and 2 terrorize, 3 and 4 control, 5 and 6 kill) plus one Thrash that is never rolled. Each entry lists `results`, `tier`, `targets` (holder, or holder-and-position), `position_requirement`, `body_parts_used` (a leg entry lists both legs, OQ-109), `severity`, `effects` from the closed list (stress, critical-injury with location and lethality, knock-loose, grab, telegraph), `fallback`, and `text`. Tier rules: control Critical Injuries cannot be lethal; a grab entry targets the holder, uses an arm, and has no other harm.
- **Ladder (Abnormal only):** a row in `index.yaml` `ladders` from the closed `tests` list in `attention.yaml`, first rung always hooked-into-its-body, last always nearest.
- **Entry into play:** a row in `index.yaml` `abnormals` (`enters_play`, `fear_roll`, `hidden_until_read`) and, for a Medium, a result on `medium_abnormal`; a Small or Large Abnormal needs a new roll row in `engagement-setup.yaml`.
- **Chapter and packet:** a Chapter 6 section rendered by `tools/probes/chapter-06/render.py`, with the hidden values in a GM subsection (OQ-108), and a packet entry.

### What the simulator needs, and the verification cost

`tools/sim/rules.py` reads every Titan id from `index.yaml`, so no engine change for a Titan built from the existing effect and test lists. Verification is the Chapter 6 pipeline (`data/titans/tuning.yaml` `probes`, `commands`):

1. `run6.py check`: format, tier rules, the text check (a line may not name a part its row does not use), the both-legs rule, and the move-up shares for every previous behavior and every Broken state. A table fails if any state's kill share passes one half.
2. `run6.py fight 12000` (reference start plus helper, screen, tactic, four-striker rows), `jam 60000`, `solo 100000`, `grab 40000`, `lone 100000`, and for an Abnormal `bar 120000` in both Squad sheet orders, with a second seed for any row within 2 standard errors of a limit. The bar reads: not trivial (median kill round 2 or later, at least the Medium's Critical Injuries, more deaths than the Medium at the reference start), winnable (median kill by round 4, no kill at most the Large's), ceiling (deaths at most the Large's).
3. `render.py collect` and `write`, then the full simulator (`tools/sim/run.py`, about 9 minutes) so `docs/reviews/simulator-report.md` carries it.
4. Review rounds as for any chapter content (Opus plus Codex, at most 3).

Cost per Titan:

- **S, table-only variant:** existing effects, standard ladder or a ladder from existing tests, Medium size. Authoring 2 to 4 hours, compute under an hour, one or two review rounds. The Sprinting Abnormal would be S today; it was not S the first time because the ladder rules were still moving under it.
- **M, format-stretching variant:** a Small or Large Abnormal (new setup row and a re-read of OQ-104's rate), or a Titan that changes arm or eye Toughness (unmeasured today, OQ-133, so the first such Titan also measures that), or one that uses a test no ladder uses yet (mounted, airborne, carrying-a-comrade, most-harmed, down are all unexercised and may need an engine check).
- **L, rule-adding variant:** a new effect type (throw, swallow, target a horse, area harm at Distant) or a new ladder test (a "where the most soldiers are" rung, which OQ-102 wanted and could not have). Chapter 5 decision, `titan-format.yaml` or `attention.yaml` change, engine change, possibly ADR-0010, full rerun, and every existing table re-checked.

### Eight non-canon Titan variants that fit the model

Each creates a tactical problem the current four do not. Labels as in section 4.

1. **The Crawler** (Small, Tempo 2). Canon-adjacent: crawling Titans appear in the era. Every entry uses an arm and no legs, so cutting legs does nothing and cutting arms grounds nothing; it is already low, so its Blind Spot is reachable on foot in any Anchor Rating (a Chapter 5 row to add: treat it as grounded from the start). Kill entries at In Reach only. Problem: the leg-cutting plan is useless; the Squad must strike arms or go straight for the Nape from the ground, where a knock-loose fall is low. Cost S to M (the grounded-from-the-start row is a Chapter 5 decision).
2. **The Sleeper** (Large, Tempo 1, Regeneration 2). Canon-adjacent: Titans slow without sun. Ladder: hooked-into-its-body, just-hurt-it, nearest. Results 1 to 4 are all stress-only telegraphs while nothing has hurt it; results 5 and 6 are a Bite and a Grab. Its Regeneration is fast. Problem: it is nearly harmless until struck, then a Large Titan with a short clock; the Squad's choice is to strike clean first or to cut and race the clock. Cost S.
3. **The Clutcher** (Medium, Tempo 1). Invented. Grab at 5 and at 6 (two Grab results, which the standard-table constraint forbids and the Abnormal bar merely measures), Severity 2 for both, Nape Depth 4. Problem: rescue becomes the fight; Pry Loose, Break Free, and the Closing Hand Scar carry the session, and the 1-in-3 Grab target is tested from the other side. Cost S, but the bar's deaths ceiling will bind, so expect one tuning pass.
4. **The Roller** (Medium, Tempo 1). Invented. Shake Off at 3 and 4 with targets holder-and-position from On Body or Blind Spot, and a Thrash that also targets holder-and-position. Problem: stacking strikers at Blind Spot is punished, which is the exact policy OQ-112 found dominant on every table. A Titan, rather than a rule change, as the answer to four strikers. Cost S, and it doubles as an OQ-112 probe.
5. **The Leaper** (Small, Tempo 2, Nape Depth 3). Canon-adjacent: jumping Titans appear. Kill entries need both legs and reach Distant with a leg Critical Injury, as Trample already does; one Broken leg ends the leaping. Problem: Distant is not safe, so mounted soldiers must keep moving and the cutters' job matters again; on the Small table it is the first Titan where riders are prey. Cost S.
6. **The Thick-hided** (Large, Tempo 1). Invented (Titan World's "hardened skin" variant, renamed because Hardening is a Shifter term in CONTEXT.md). Toughness 3 on every part, Nape Depth 4, Regeneration 4. Problem: cutting is nearly hopeless (a Rookie cutter needs 3 successes per state), so Openings from short Nape strikes and Break Attention are the only setup; a strikers-only fight by design. Cost M (arm and eye Toughness 3 are unmeasured, OQ-133).
7. **The Blind Hunter** (Medium, Tempo 1). Invented. Eyes Toughness 1 and a ladder of hooked-into-its-body, loudest-or-brightest, nearest; Fixed Grin removed, every entry uses no eyes. Read reveals that it hunts by sound. Problem: the flare decoy is dead on it (`attention.yaml` already bars flares against Broken eyes; this Titan starts as if blind), Draw Attention is dangerous, and the riderless horse and Feint become the only decoys. Cost S.
8. **The Quick Healer** (Medium, Tempo 1, Regeneration 2). Canon-adjacent (Titan World's "fast regeneration"). Standard Medium table otherwise. Problem: every two rounds the most damaged part recovers a state and every Opening is erased, so the cutters' work is undone unless the strike lands the round after the cut; a tempo puzzle rather than a damage race. Cost S.

Two more that are L and should wait: a Thrower (a new effect that moves a soldier to Distant with a fall) and a Herd-runner with the "where the most soldiers are" rung OQ-102 could not have. Both need Chapter 5 decisions first.

Suggested first batch: the Roller (it answers OQ-112 at the table) and the Leaper or the Sleeper (a Small and a Large Abnormal, which also forces the setup table to grow past Medium-only Abnormals).

---

## Questions for the owner

Decisions only the owner can make. The recommendation above assumes the first answer to each.

1. **Era lock.** Confirm that all Phase 2 content stays inside Paradis, 845 to 850, at Paradis technology (no Marleyan or post-timeskip gear even as an optional module)? Or should the charter leave a door for a later "Marley" module?
2. **Dated inventions.** Are Thunder Spears, anti-personnel ODM, and the restraining harpoons gated as Canon Clock Discoveries (available in a Distant campaign only when research or the clock reaches them), or should any of them be available from the start?
3. **Invented items and Standard Issue.** May an invented item ever be Standard Issue, or only Requisition and Discovery content? The recommendation is Requisition and Discovery only.
4. **The Nape line.** Confirm that no gear may kill a Titan except a Nape strike (ADR-0007), so cannon and spears wound, Break, or expose, and never kill?
5. **Human conflict.** Is human-versus-human combat (Block and Fight, the Military Police, the Uprising) in scope for Phase 2? Anti-personnel ODM and several Military Police items depend on it.
6. **Order of work.** Titans first in Phase 2 (recommended: the format and the simulator are ready), or gear first?
7. **Before the playtest.** Confirm nothing is added before the first playtest except the charter decision and one debrief question? Or does the owner want one new Abnormal in the packet regardless?
8. **OQ-112 through a Titan.** Is the owner content to answer the four-strikers finding with a Titan that punishes stacking (the Roller) and leave the rules as they stand, or does the owner want a rule change?
9. **Prices.** Confirm no coin prices: access is Funding and Scarcity only?
10. **Charter as an ADR.** Should the charter be recorded as ADR-0016 once the answers above are in?
