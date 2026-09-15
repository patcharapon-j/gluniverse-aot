# Minimal playable rules: Expeditions, Requisition, and human-versus-human combat

Proposal only. Written 2026-09-15 for the owner's decision in `OWNER-DECISIONS.md` (open item: "Talents that read rules not yet written: owner chose minimal rules to work with"). Nothing in `docs/rules`, `docs/adr`, `data/`, `CONTEXT.md`, the packet, or `tools/` was changed. The rules below are drafted so that a Fable decider can turn them into a decision batch and wof-drafter can write them as a short "Playtest rules" chapter plus YAML, in that order, before the first playtest.

Sources read: `OWNER-DECISIONS.md` and the five round-1 research files; `CONTEXT.md`; ADR-0001 to ADR-0015; Chapters 1 to 4 and the Chapter 5 sections on starting a Titan Engagement; `data/character/action-catalog.yaml` and `talents.yaml`; `data/core/*.yaml`; `data/gear/items.yaml`, `standard-issue.yaml`, `squad-supply.yaml`, `carrying.yaml`, `horses.yaml`, `falls.yaml`, `sheet-fields.yaml`; `data/harm/health.yaml`, `critical-injuries.yaml`, `death-rolls.yaml`, `treat-injury.yaml`, `healing.yaml`; `data/mind/fear-rolls.yaml`, `grief.yaml`; `data/engagement/engagement-setup.yaml`, `positions.yaml`, `engagement-flow.yaml`; `docs/rules/PROGRESS.md`; the grep of `DECISIONS-2026-09-14.md` and `OPEN-QUESTIONS.md` recorded in section 0; the two source books at the printed pages cited in section 0.3 (in the PDFs both books sit 4 pages later than the printed number).

Design stance: every rule below is a table, a track, a counter, or a closed trigger (ADR-0003); every roll outside a Titan Engagement states its Help requirement and whether it can be retried (Chapter 1, sections 1.1 and 1.8, OQ-08); every new value soldiers change by acting names the Catalog entry or attribute that changes it (ADR-0003 item 12); no rule touches Chapter 5 or 6. Each subsystem is written to be the smallest thing that gives every Talent naming a dormant or reserved entry something real to do, and to be a floor that Phase 2 can build on without contradiction.

---

## 0. What exists, what was promised, and what the parents do

### 0.1 The dormant and reserved entries, and the Talents that name them

From `data/character/action-catalog.yaml` and `talents.yaml`:

| Entry | Kind | Attribute today | Status | Talents that name it | This proposal calls it from |
|---|---|---|---|---|---|
| `spot` | roll | Perception | dormant | Keen Eyes (Hunter) | Leg roll at Vanguard, Signal Relay, Rear Guard; night watch |
| `survive` | roll | Instinct | dormant | Fieldcraft (Hunter) | Leg roll at Flank Scout and Supply Wagon; the camp roll |
| `endure` | roll | Strength | dormant | Long Haul (general) | Leg roll at Center; the hunger check; Straggler row |
| `ride` | roll | Agility, horse | dormant (Chase rules, OQ-121) | Horsemanship (Rider), Sure Seat (rule) | Leg roll on a Hard Ride |
| `size-up` | roll | Instinct | dormant | Judge of Character (Tactician) | Size Up in a Skirmish and before a Requisition |
| `persuade` | roll | Empathy | dormant | Silver Tongue (general) | Requisition; Parley in and out of a Skirmish |
| `recall` | roll | Wits | dormant | Book Learning (Medic) | Requisition (the regulations route) |
| `sneak` | roll | Agility | dormant | Quiet Step (general) | The ambush roll before a Skirmish |
| `fight` | action | Strength, Blade Set | reserved | Hand-to-Hand (general) | The Skirmish attack at Engaged range; Grapple |
| `block` | reaction | Strength, Blade Set | reserved | Hand-to-Hand, Blade Discipline (rule) | The Reaction against a Fight attack |

Nine Talents therefore do nothing in the Phase 1 packet: eight dice Talents (Keen Eyes, Fieldcraft, Judge of Character, Book Learning, Hand-to-Hand, Silver Tongue, Quiet Step, Long Haul) and half of Horsemanship (its Ride half; its mounted-dodge half is live). Blade Discipline names `block` among live entries, so it is live already. No other Talent names a dormant or reserved entry. The later rule that calls a dormant entry "may change its attribute" (Catalog comment); this proposal keeps every attribute as the Catalog has it, and adds one new entry, `shoot` (section 3), because no reserved entry covers a firearm at a distance.

### 0.2 What the decisions and open questions already fix

Grep of `DECISIONS-2026-09-14.md` and `OPEN-QUESTIONS.md` for Expedition, Leg, Requisition, Funding, Scarcity, Block, Fight, human, Military Police:

- **Expeditions and Legs.** ADR-0009 (Legs always reach the next Waypoint; failure doubles Squad Supply and worsens the hazard; the hazard grows with distance and +1 per night camp; failed Legs cost no gas; a retreat falls back to the previous Waypoint; Legs are never ridden at night; night camps use calmer results except against Abnormals). ADR-0010 (the whole Squad rides at one Formation Post, changed only at a Waypoint). ADR-0014 target 6 (an Expedition of 4 to 6 Legs costs about 1 Squadmate and about 1 PC Critical Injury; a PC dies every 3 to 4 missions; batch 5 reads the rate as 0.25 to 0.33 PC deaths a mission on the mean). Batch 3 amendment: "every Expedition roll carries no Talent dice in a target's baseline", so Talents on Leg rolls are sensitivity rows, not tuning. OQ-53: healing counts days, a day passes at each night camp; "the Expedition and Downtime rules must confirm when a day passes and how many days a Downtime spans". OQ-120 and OQ-130: the interim day and interim issue stand in for night camps and the pre-Expedition issue "until the Expedition and Downtime rules are written" and are replaced by them. OQ-116: the fight cadence is "an Expedition matter"; the sequence rows are re-run under the cadence the Expedition rules set. OQ-44: outside-harm care windows have a scope of "every soldier in the Squad on the same Expedition"; the day window's scope is every soldier on that Expedition. OQ-67: rations are stocked at 0 "until the Expedition rules set a stock" and are spent on Legs and camps; ammo returns "as a kind with its stock and uses" when weapon rules arrive. OQ-36 (d): a rule that gives soldiers turns outside a Titan Engagement may say the Drive turn tests count them, and a procedure with a start and an end may say "once per Titan Engagement" applies to it. Chapter 1, section 1.6 and Chapter 3, section 3.15: "the Expedition rules will add the Waypoint camp relief as a new row" of `stress-changes.yaml`. Fear Rolls: `comrade-grabbed` and `comrade-dies` can arise outside a Titan Engagement "only if the rule that creates the situation states who rolls". Positions: a starting rule "may name other starting Positions for named soldiers; no Phase 1 rule does" (`positions.yaml`, `placement`). Chapter 5, section 5.1: the interim setup table is used when the starting rule names no Anchor Rating, Focus Titan, Background Titans, or retreat clock; "the Expedition rules and Mission Briefs" are named as the rules that will. Falls: "the Chase rules (not yet written)" may name a fall; the band defaults to low outside a Titan Engagement. Horses: "the Expedition and Chase rules" may say when a soldier mounts; the Expedition rules "may" restore a horse.
- **Requisition, Funding, Scarcity.** Glossary: Requisition is "requesting gear beyond Standard Issue from command during Downtime, rolled against the item's Scarcity"; Scarcity is Standard, Limited, or Rare; Funding 1 to 6 "sets what Requisitions and resupply can deliver". Chapter 4, section 4.9: "Funding is 3 until the Funding rules are written"; the Veteran's rating 2 Blade Set and kits and the Levi-grade ratings "come from higher Funding or from Requisition, which is not yet written". OQ-59: the decline step exists so that "a rating 2 harness or horse a soldier earned at higher Funding or through Requisition" survives a poorer issue. OQ-63: Blade Set ratings 2 and 3 "stay recorded for the Requisition rules", and any wear still ruins a set, so a higher rating is more fragile per strike. `sheet-fields.yaml`: "the Requisition rules, which will issue higher-rated sets, add each set's rating" to `blade_sets_carried`. Owner decision 6: Funding and Scarcity with no prices; invented items only through Requisition or Discovery; later inventions as Canon Clock Discoveries; nothing new in gear before the playtest; the charter as an ADR.
- **Human conflict.** `fight` and `block` are reserved "for enemies that later rules add"; `block.help_outside_titan_engagement` is "set by the rules that add an enemy that can be blocked" and `fight`'s by "the rules that add human enemies". Chapter 1, section 1.1 item 5: "No opposed rolls. No rule in Chapters 1 to 6 sets one pool against another. If the Chase rules need an opposed roll, they will add the procedure." OQ-21 (i): the Military Police offer at Graduation is always declined. Critical-injuries research: Cut and Pierce are Injury Types with no source until human combat exists. Gear research item 15: anti-personnel ODM "needs the reserved Block and Fight entries and human-scale combat"; question 5 asks whether human-versus-human combat is in scope. Nothing else is decided about humans: no stat line, no range structure, no morale, no firearms.

### 0.3 The parents, as starting points

**Coriolis: The Great Dark, journeys.** Trekking (p. 204 to 205): explorers trek two shifts a day; one roll per shift by the leader (Logic on foot, Agility in a rover) with one gear item; two or more sixes add distance; failure rolls a D66 mishap table whose rows are supply loss, damaged gear, a fall, being lost, a storm, and one lethal sinkhole; supply costs 2 per shift plus 1 per explorer over five; camp needs a Logic roll or nobody sleeps. The delve procedure (p. 211 to 214) is the ancestor of ADR-0009: one Agility roll by the Delver, each six advances one marker at 1 supply; a failed roll still advances one marker at 2 supply and adds +1 to the hazard roll; a hazard always follows unless a key location is reached ("no such thing as an eventless delve"); the hazard is D6 for the affected role plus D6 modified by distance to the exit (+0 to +3) and +1 for a failed roll, read on a 6-column by 9-row table whose low rows cost supply and conditions and whose high rows deal attacks and falls. Supply (p. 214 to 216) is one abstract pool consumed per stretch, with incident rolls at 3 or fewer and an out-of-supply table (damage, despair, Blight). Camps (p. 217) rest at 1 supply per shift. What this proposal keeps: one roll per Leg by one lead, hazard always follows, failure worsens the hazard and doubles the cost, a distance modifier, supply as a counter. What it drops: per-role hazard columns (ADR-0010 puts the whole Squad at one Formation Post), Blight, the 54-cell hazard grid (one 10-row table with a Post modifier instead), and hexes.

**Alien RPG Evolved, humans fighting.** Close combat (p. 62 to 64): a full action at Adjacent; a hit does the weapon's base damage plus 1 per extra success; the target may Defend as a quick-action interrupt, an opposed roll in which each defender success cancels one attacker success; special attacks (disarm, pass, shove, grapple) do no damage; a grappled target can only try to break free with an opposed roll; restrained or unaware targets cannot defend and give +2 dice; firearms in melee use Close Combat at a penalty. Ranged (p. 64 to 67): line of sight, base damage plus extras, aim +2, cover, dodge as an interrupt, an ammo supply roll. Manipulation (p. 47): an opposed Empathy roll with a "negotiating position" list of +1 and -1 dice, "not mind control". Initiative (p. 59): one card per PC per round, lowest first, ambush gives the lowest cards and no defense. Coriolis close combat (p. 61 to 63) is the same shape with Block (Strength, consumes your turn) and sneak attacks that cannot be blocked or dodged (+3), and its social conflict (p. 65) is Empathy with stakes stated first. What this proposal keeps: attack then Reaction, damage plus extras, grapple as a special, ambush denies the Reaction, a persuasion roll with a fixed needs. What it changes: no opposed roll (Chapter 1 forbids it); the Reaction needs successes equal to the attack's successes, the ADR-0015 shape; humans deal damage, never Critical Injuries directly (ADR-0005 stays Titan-only); NPC targeting and morale are closed rules, not GM calls.

---

## 1. Expeditions

### 1.1 Packet-ready prose

> **Playtest rule.** These Expedition rules are the smallest set that lets a Squad ride out and come back. Phase 2 expands them. While an Expedition is under way, the interim day and the interim issue do not happen; the night camp and the pre-Expedition issue take their place.

**An Expedition** is a Survey Corps operation beyond the Walls, ridden as a chain of **Legs** between **Waypoints**. Command sets the route in the **Mission Brief**: the Waypoints in order (the last is a gate of the Walls), each Waypoint's kind, each Leg's **Distance Band** (Near, Far, or Deep) and **Pace** (Steady or Hard Ride), and the Squad's **Formation Post** for each Leg. When the Brief names none of these, the GM rolls the Interim Route table before the Expedition begins and never changes it afterwards.

**Before you ride.** Every soldier receives a full Standard Issue, and Squad Supply is restocked, rations included. Command's Funding decides both.

**A day** holds two Legs and a night camp. A Hard Ride is a third Leg squeezed in before dark.

**Riding a Leg.** For each Leg, in order:

1. **Take your post.** The Squad rides at the Formation Post the Brief gives this Leg. It changes only at a Waypoint.
2. **The Leg roll.** The players choose one soldier as **lead** (the roll-off if they disagree; a Down soldier cannot lead). The lead rolls the entry the Post names: Spot at Vanguard, Signal Relay, and Rear Guard; Survive at Flank Scout and Supply Wagon; Endure at Center. On a Hard Ride the lead rolls Ride instead, with their horse's Gear Dice, whatever the Post. Up to three comrades on the Expedition who are not Down may Help; Help spends nothing here, but each soldier Helps at most once per Leg. The roll can be Pushed and Covered. It needs 1 success and is never retried.
3. **Arrive.** The Squad always reaches the next Waypoint. On a success, spend 1 ration (2 on a Hard Ride), and each success beyond the first lowers this Leg's hazard roll by 1. On a failure, spend 2 rations (4 on a Hard Ride), and this Leg's hazard roll gains +1.
4. **The hazard.** Roll D6 and add the Distance Band (Near 0, Far +1, Deep +2), +1 for every night camp so far this Expedition, the Post's hazard modifier (Vanguard and Flank Scout +1, Center -1, others 0), +1 on a Hard Ride, and the Leg roll's adjustments from step 3. Read the Leg Hazard table. A hazard's roll names its own entry, who rolls, and whether it can be Helped; a row that names none allows no Help and no retry.
5. **A Titan Engagement** that a hazard begins uses the Waypoint kind's Anchor Rating for the terrain, the row's starting Positions, and the interim setup table for whatever the row leaves unnamed. Every living soldier on the Expedition takes part. If the Squad retreats, it falls back to the previous Waypoint, and this Leg is ridden again with a new Leg roll and a new hazard.
6. **Harm outside a Titan Engagement** opens the usual care window, with every soldier on the Expedition in scope. A soldier who dies on a Leg is replaced by promotion when the Leg ends.

**Formation Posts.** Vanguard (Spot, +1): the first to see and the first seen. Flank Scout (Survive, +1): reading the land at the formation's edge. Signal Relay (Spot, 0): watching for flares; once per Leg the Squad may spend 1 flare before the hazard roll to lower it by 2. Center (Endure, -1): the long hours in the saddle. Supply Wagon (Survive, 0): a supply loss row costs double. Rear Guard (Spot, 0): the last to leave.

**Waypoint kinds** set the terrain of the Leg that leads to them: open plain (Open), hedgerows (Sparse), forest (Wooded), abandoned town (Urban), giant forest (Giant Forest). A Waypoint the Brief marks as a **depot** gives a full Standard Issue on arrival. The gate ends the Expedition.

**The night camp.** After the day's Legs:

1. **The camp roll.** One soldier (the players' choice) rolls Survive; up to three comrades not Down may Help, spending nothing; it can be Pushed and Covered; it needs 1 and is never retried. On a success, every soldier on the Expedition loses 1 Stress: the camp relief. On a failure, no one does, and the night hazard roll gains +1.
2. **Rations.** Spend 1. If the Squad has no rations for a Leg or a camp, every soldier makes an Endure roll (no Help, no retry): on a failure they gain 1 Stress, and a camp without rations gives no camp relief.
3. **The night hazard.** Roll D6, add the Distance Band and +1 if the camp roll failed, and read the Night table. Titans do not walk at night; only an Abnormal does.
4. **The day passes.** Hold the day's care window (every soldier on the Expedition in scope; Field Repair is allowed), make the Death Rolls of day-limit injuries, get back Health lost to damage, and count a day of healing.

**Gas, blades, and the wagon.** No Gas Roll is made on a Leg or at a camp; gas is spent only in a Titan Engagement. Canisters, Blade Sets, flares, and medical supplies come back only at a depot Waypoint or at the gate, so what a fight uses up stays used up until then. A Down soldier rides in the wagon or across a comrade's saddle; on a Leg this changes nothing except that they cannot lead, Help, or make the camp roll.

**Leg Hazard table** (D6 plus modifiers):

| Total | Hazard | What happens |
|---|---|---|
| 1 or less | Quiet ride | Nothing. |
| 2 | Broken ground | The lead's horse takes 1 point of wear. |
| 3 | Dropped supplies | Lose 1 unit of one kind of Squad Supply, the players' choice (double at Supply Wagon). |
| 4 | Long hours | Every soldier gains 1 Stress. |
| 5 | Thrown | One soldier, the players' choice, falls from a horse. |
| 6 | Titans far off | The Squad chooses: spend 1 flare and 1 ration to ride around them, or a Titan Engagement begins with everyone Distant. |
| 7 | Titan on the formation | A Titan Engagement begins with everyone Distant. |
| 8 | Straggler | Roll D6: on 1 to 4 a living Squadmate, on 5 to 6 a player character; the players choose which soldier of that kind (the roll-off if they disagree). That soldier makes an Endure roll (no Help, no retry). On a failure they suffer a Critical Injury at a rolled Injury Location that can be lethal. Then a Titan Engagement begins with that soldier at In Reach and everyone else Distant. |
| 9 | Abnormal | As 7, but the Focus Titan is the Sprinting Abnormal, or the Abnormal the Brief names. |
| 10 or more | Overrun | A Titan Engagement begins with everyone at In Reach and Background Titan clocks of 4 and 8. |

**Night table** (D6 plus modifiers):

| Total | Night | What happens |
|---|---|---|
| 3 or less | Quiet night | Nothing. |
| 4 | Restless | Every soldier gains 1 Stress. |
| 5 | Spoiled | Lose 2 rations. |
| 6 | Spooked horses | One horse, the players' choice, goes lame. |
| 7 | Prowlers | At Near or Far: a Skirmish with three Bandits who have the ambush. At Deep: as Restless. |
| 8 or more | Abnormal at night | A Titan Engagement with the Sprinting Abnormal (or the Brief's Abnormal), everyone dismounted at Distant. |

**Interim Route table** (when the Brief names nothing): Legs D3+3. Distance Bands by position on the route: the first and last Leg Near, the second and second-to-last Far, any Leg between them Deep. Each Waypoint's kind: D6, 1 open plain, 2 hedgerows, 3 to 4 forest, 5 abandoned town, 6 giant forest; the last Waypoint is the gate. Each Leg's Post: D6, 1 Vanguard, 2 Flank Scout, 3 Signal Relay, 4 Center, 5 Supply Wagon, 6 Rear Guard. Pace: after each day's second Leg, D6; on 5 to 6 Command orders a Hard Ride as a third Leg that day. No depot.

**Rations.** Stock by Funding: 6, 7, 8, 9, 10, 12 for Funding 1 to 6.

**Downtime (playtest minimum).** When the Squad rides through the gate, Downtime begins and lasts seven days:

1. **The infirmary.** Hold one care window with every soldier in the Squad in scope. Then, for each day of the seven, every day-limit lethal injury still untreated gets one infirmary roll before its Death Roll: four base dice, needing 1, no Push, no Help, no Stress Dice; a success stabilizes it. Health lost comes back, and seven days of healing pass.
2. **Downtime Actions.** Each player character takes one: **Recover** (lose 2 Stress), **Visit Haven** (lose 2 Stress and 2 Grief), **Requisition** (section 2), or **Maintain Gear** (every item of yours returns to its rating; a lame horse recovers). Squadmates take none; each loses 2 Stress and 1 Grief.
3. **The Squad Action.** One for the whole Squad: **Honoring the Fallen** (every soldier loses 1 Grief) or **Recruit** (new Squadmates from the templates join until the Squad has 6 minus the player characters). Train, Investigate, Contribute to Research, and the other Squad Actions wait for Phase 2, as do XP, Commendations, Faction Standing, and HQ Upgrades.

**Drives and once-per-Engagement Talents.** A Leg, a night camp, and a Skirmish are each a procedure with a start and an end: a Talent limited to once per Titan Engagement can also be used once per Leg or per night camp where its trigger can occur (Sure Seat on a Hard Ride). Drive turn tests do not count Leg or camp rolls; they count Skirmish turns (section 3).

### 1.2 YAML shapes (sketches, not files)

New folder `data/expedition/`. Every table above is one block.

```yaml
# data/expedition/legs.yaml
id: legs
chapter: 07-expeditions-playtest
adrs: [ADR-0003, ADR-0009, ADR-0010, ADR-0014]
status: playtest
day: {legs: 2, hard_ride_is_third_leg: true, then: night-camp}
before_expedition: {standard_issue: full, squad_supply: restock}   # replaces interim_issue while under way
interim_replaced: [data/harm/healing.yaml day_passes.interim, data/gear/standard-issue.yaml interim_issue]
leg_roll:
  who: lead   # players choose; roll-off (data/character/lifepath.yaml, group_choices); not Down
  entry_by_pace: {steady: the post's entry, hard-ride: ride}
  needs: 1
  help: {who: soldiers on the Expedition, not Down, other than the lead; max: 3; spends: nothing; limit: once per Leg per helper}
  push_and_cover: as Chapter 1
  retry: never
  changes: [leg-outcome]          # new tracked value (ADR-0003 item 12)
  outcomes:
    success: {rations: {steady: 1, hard-ride: 2}, hazard_modifier: -1 per success beyond the first}
    failure: {rations: {steady: 2, hard-ride: 4}, hazard_modifier: +1}
formation_posts:
  - {id: vanguard, entry: spot, hazard_modifier: +1}
  - {id: flank-scout, entry: survive, hazard_modifier: +1}
  - {id: signal-relay, entry: spot, hazard_modifier: 0, special: {spend: 1 flare, when: before the hazard roll, effect: hazard_modifier -2, limit: once per Leg}}
  - {id: center, entry: endure, hazard_modifier: -1}
  - {id: supply-wagon, entry: survive, hazard_modifier: 0, special: supply loss rows cost double}
  - {id: rear-guard, entry: spot, hazard_modifier: 0}
pace:
  - {id: steady, counts_as: one of the day's two Legs}
  - {id: hard-ride, counts_as: a third Leg of the day, hazard_modifier: +1, leg_entry: ride}
distance_bands: [{id: near, hazard_modifier: 0}, {id: far, hazard_modifier: 1}, {id: deep, hazard_modifier: 2}]
nights_outside: {hazard_modifier_per_night: 1}
retreat: {falls_back_to: previous Waypoint, leg: ridden again with a new Leg roll and hazard}
down_soldiers: {ride: in the wagon or across a comrade's saddle, cannot: [lead, help, camp-roll]}
gas: {gas_rolls_on_legs: none}   # ADR-0009 as amended
```

```yaml
# data/expedition/hazards.yaml
leg_hazards:
  roll: D6 + modifiers
  modifiers: [distance_band, nights_outside, formation_post, pace, leg_roll_outcome, signal_relay_flare]
  rows:
    - {results: {min: null, max: 1}, id: quiet-ride, effects: []}
    - {results: {min: 2, max: 2}, id: broken-ground, effects: [{type: gear-wear, item: horse, whose: lead, points: 1}]}
    - {results: {min: 3, max: 3}, id: dropped-supplies, effects: [{type: squad-supply-loss, units: 1, kind: players-choose, supply_wagon_double: true}]}
    - {results: {min: 4, max: 4}, id: long-hours, effects: [{type: stress-gain, amount: 1, who: every soldier}]}   # stress-changes.yaml named-gain
    - {results: {min: 5, max: 5}, id: thrown, effects: [{type: fall, who: players-choose, band: from-a-horse}]}   # falls.yaml rule-named
    - {results: {min: 6, max: 6}, id: titans-far-off, choice: [{spend: {flares: 1, rations: 1}}, {titan_engagement: {placement: all-distant}}]}
    - {results: {min: 7, max: 7}, id: titan-on-the-formation, titan_engagement: {placement: all-distant}}
    - {results: {min: 8, max: 8}, id: straggler,
       victim: {roll: D6, rows: [{results: [1,2,3,4], kind: squadmate}, {results: [5,6], kind: player-character}], choose: players, fallback: player-character if no Squadmate lives},
       roll: {entry: endure, help: none, retry: never, on_failure: {type: critical-injury, injury_location: rolled, cannot_be_lethal: false, injury_type: bite}},
       titan_engagement: {placement: {victim: in-reach, others: distant}}}
    - {results: {min: 9, max: 9}, id: abnormal, titan_engagement: {focus_titan: sprinting-abnormal-or-brief, placement: all-distant}}
    - {results: {min: 10, max: null}, id: overrun, titan_engagement: {placement: all-in-reach, background_titans: [4, 8]}}
  titan_engagement_defaults: {anchor_rating: from waypoint kind, everything_else: data/engagement/engagement-setup.yaml, who_takes_part: every living soldier on the Expedition}
night:
  camp_roll: {entry: survive, who: players-choose, needs: 1, help: {max: 3, spends: nothing}, retry: never, success: {stress_reduction: 1, who: every soldier}, failure: {night_hazard_modifier: +1}, changes: [camp-outcome]}
  rations: 1
  hunger: {when: no rations for a Leg or a camp, roll: {entry: endure, each_soldier: true, help: none, retry: never}, failure: {stress-gain: 1}, no_camp_relief: true}
  roll: D6 + distance_band + camp_failure
  rows:
    - {results: {min: null, max: 3}, id: quiet-night}
    - {results: {min: 4, max: 4}, id: restless, effects: [{type: stress-gain, amount: 1, who: every soldier}]}
    - {results: {min: 5, max: 5}, id: spoiled, effects: [{type: squad-supply-loss, kind: rations, units: 2}]}
    - {results: {min: 6, max: 6}, id: spooked-horses, effects: [{type: gear-at-zero, item: horse, whose: players-choose}]}
    - {results: {min: 7, max: 7}, id: prowlers, at: {near-or-far: {skirmish: {foes: [{kind: bandit, count: 3}], foes_ambush: true}}, deep: as-restless}}
    - {results: {min: 8, max: null}, id: abnormal-at-night, titan_engagement: {focus_titan: sprinting-abnormal-or-brief, placement: all-distant, mounted: none}}
  then: data/harm/healing.yaml each_day   # care window (scope: the Expedition), day Death Rolls, Health back, healing
```

```yaml
# data/expedition/route.yaml  (Mission Brief fields, and the interim route roll)
mission_brief_fields: [waypoints (ordered; kind; depot true/false; last is gate), legs (distance_band, pace, formation_post, abnormal_override)]
waypoint_kinds:
  - {id: open-plain, anchor_rating: open, interim_roll: [1]}
  - {id: hedgerows, anchor_rating: sparse, interim_roll: [2]}
  - {id: forest, anchor_rating: wooded, interim_roll: [3, 4]}
  - {id: abandoned-town, anchor_rating: urban, interim_roll: [5]}
  - {id: giant-forest, anchor_rating: giant-forest, interim_roll: [6]}
  - {id: gate, anchor_rating: null, ends_expedition: true}
  - {id: depot, on_arrival: full standard issue and squad supply restock}
interim_route:
  legs: D3+3
  distance_bands_by_position: {first_and_last: near, second_and_second_last: far, between: deep}
  formation_post: {roll: D6, rows: [vanguard, flank-scout, signal-relay, center, supply-wagon, rear-guard]}
  pace: {after_second_leg_of_day: {roll: D6, hard_ride_on: [5, 6]}}
  depot: none
```

```yaml
# additions elsewhere
# data/gear/squad-supply.yaml  stock.rations: [6, 7, 8, 9, 10, 12]; kinds.rations.phase_1_use replaced by the Leg and camp spends above
# data/core/stress-changes.yaml  reductions: {id: camp-relief, trigger: the camp roll succeeds, who: every soldier on the Expedition, amount: 1}
#                                gains: long-hours, restless, hunger use named-gain
# data/character/action-catalog.yaml  spot/survive/endure/ride: dormant false, changes: [leg-outcome, camp-outcome, hazard-outcome]; tracked_values adds leg-outcome, camp-outcome, hazard-outcome
# data/campaign/downtime.yaml  length_days: 7; infirmary_roll: {dice: 4, needs: 1, per_patient_per_day: 1, push: false, help: false, stress_dice: false}
#                              actions: [recover {stress: -2}, visit-haven {stress: -2, grief: -2}, requisition, maintain-gear]; squadmates: {stress: -2, grief: -1}
#                              squad_actions: [honoring-the-fallen {grief: -1 each}, recruit {to: 6 minus player characters}]
```

### 1.3 Talent hooks

Rolls a Talent may name or condition on: `spot` (Leg roll at Vanguard, Signal Relay, Rear Guard), `survive` (Leg roll at Flank Scout and Supply Wagon; the camp roll), `endure` (Leg roll at Center; the hunger check; the Straggler row), `ride` (the Hard Ride Leg roll, with the horse's Gear Dice, so a Pushed Ride wears the horse), `treat-injury` and `field-repair` in the day and outside-harm windows (already live), `death-roll` on day limits.

Triggers a rule Talent may name: "You declare the Leg roll as lead"; "You Help a Leg roll"; "A Leg roll fails"; "You declare the camp roll"; "The camp roll fails"; "A hazard row names you"; "You are chosen at the Straggler row"; "Command orders a Hard Ride"; "The Squad arrives at a Waypoint"; "A Titan Engagement begins from a hazard row"; "The Squad has no rations"; "A night camp begins at Deep".

Resources and counters: rations (units), flares (the Signal Relay spend), the hazard roll total (a Talent may lower it by 1 once per Leg, the same lever as an extra success), nights outside (a Talent could ignore one night's +1), the Distance Band, the Formation Post held, Pace, healing days at a camp (a Talent could add a day of healing to one comrade at a camp), the camp relief (a Talent could extend it to Grief, or make a failed camp roll still give it to the roller), the seven Downtime days and the Downtime Actions (a Talent could give a second Recover use, or let Maintain Gear cover a comrade's item).

States: lead, Down on a Leg (carried in the wagon), ambushed at a night camp, the Straggler's In Reach start, "everyone at In Reach" (Overrun), retreated to the previous Waypoint.

Limits a Talent may use: once per Leg, once per night camp, once per Expedition, once per Downtime.

### 1.4 Deliberately left for Phase 2

Chases (Ride's second home, Chase Bands, gas in a Chase); Operation Frames and their special actions; Mission Brief complications, Commendation triggers, and Faction Standing tables (ADR-0003 items 5 and 10); Plan Rolls, Intel Questions, and Preparation Points; Titan Research and Discoveries; Squad Points, XP, Train, Investigate, Contribute to Research, Lobby, HQ Upgrades; Rank and Squad size changes; night rules for standard Titans (only the Abnormal walks at night here); weather; a depot on the interim route; individual Formation Posts (ADR-0010 rejects them); a hazard column per Post (one modifier instead); a Waypoint exploration procedure; the Downtime rule for a soldier who is Down or lethally injured inside the Walls beyond the infirmary roll; Squadmate Downtime Actions.

### 1.5 ADRs, CONTEXT terms, targets, and simulator cases touched

- **ADR-0009:** implemented, no amendment. "Arrives faster" for a Hard Ride is defined as a third Leg before dark; "worsens the hazard" is +1 on the hazard roll; "+1 per night camp" is the nights-outside modifier; the retreat and night rules are as the ADR states. One reading to record in an amendment paragraph: "night camps use calmer results except against Abnormals" is read as a separate Night table whose only Titan is an Abnormal.
- **ADR-0010:** the Formation Post is whole-Squad and changes only at a Waypoint. No amendment.
- **ADR-0014:** target 6 is unchanged in wording. The rules below give it a mechanism (section 1.6) but no measurement. New sensitivity rows to record beside it, not tuned: Talent dice on Leg rolls (the batch 3 exclusion), the In Reach starts (Straggler, Overrun), the night Abnormal, and the fight cadence of about two to three Titan Engagements per 4 to 6 Legs with a night camp between days. OQ-116's provisional cadence is replaced by this one for the sequence rows when the simulator next runs; no rerun before the playtest.
- **ADR-0003:** new rows in the closed lists (Stress changes, Bonus Dice unchanged, Fear Roll triggers unchanged: the Titan Engagement a hazard begins makes its own Fear Rolls) and new tracked values (`leg-outcome`, `camp-outcome`, `hazard-outcome`). Drafting requirement 12 is met by naming the entry on every row.
- **ADR-0005 and ADR-0015:** the Straggler row inflicts a Critical Injury from a Titan outside a Titan Engagement with no Reaction. That is a Titan attack landing undodged, consistent with ADR-0015, but it is the first Titan harm not dealt by a Behavior Table entry; ADR-0005's definition of a Titan attack ("the harm a Behavior Table entry inflicts") would need one sentence: "or a hazard row that names a Titan's Critical Injury". Alternatively the decider may make the Straggler's harm a fall from a horse (damage) plus the In Reach start, and touch no ADR. This proposal prefers the Critical Injury, because a Bite from the saddle is the canon image and gives the critical-injuries proposal's Bite type a second source.
- **CONTEXT.md:** Expedition, Leg, Pace, Distance Band, Waypoint, Formation Post, Squad Supply, Downtime, Downtime Action, Squad Action, Mission Brief, Standard Issue all keep their entries and gain a rule. New terms: **Lead** (the soldier who makes a Leg or camp roll), **Night Camp** (the stop after a day's Legs, at which a day passes), **Camp Relief** (the Stress loss a successful camp roll gives), **Depot** (a Waypoint kind). The Downtime and Downtime Action entries need "(playtest minimum: seven days; Recover, Visit Haven, Requisition, Maintain Gear)" until Phase 2.
- **Chapters:** a new short chapter (07, Playtest rules) rather than edits to 1 to 6, with pointer sentences in Chapter 3 (3.5, 3.6: the interim day is replaced while an Expedition runs), Chapter 4 (4.9, 4.10: the interim issue likewise; rations stock), and Chapter 5 (5.1: a hazard row is a rule that begins a Titan Engagement and may name Positions).
- **Simulator:** no target moves. OQ-115 and OQ-116 gain a candidate cadence; OQ-67's day-limit case gains the infirmary roll.

### 1.6 How ADR-0014's Expedition target is meant to be reached

The target is about 1 Squadmate and about 1 PC Critical Injury per 4 to 6 Legs, and a PC death every 3 to 4 missions (0.25 to 0.33 a mission). The simulator does not run Legs, so this is arithmetic on the committed fight figures, an estimate and not a measurement.

- **Fights per Expedition.** On the interim route, a 5-Leg Expedition has Bands Near, Far, Deep, Far, Near and night counts 0, 0, 1, 1, 2. At Center on every Leg with a successful Leg roll and no extra successes, the hazard totals are D6-1, D6+1, D6+2, D6+1, D6+2 (with a Hard Ride or a failed roll adding 1 each). Titan rows begin at 6, so the chance of a Titan row per Leg is about 1 in 6, 1 in 3, 1 in 2, 1 in 3, 1 in 2: about **1.8 Titan rows per Expedition**, of which the "far off" ones can be bought off with a flare and a ration. At Vanguard or after failures it is nearer 2.5. So the Squad fights about **two Titan Engagements per Expedition**, usually one with a night camp between and one without, and roughly one Expedition in four meets an Abnormal, an Overrun, or a Straggler.
- **What two fights cost.** With 4 Rookies and 2 helper Squadmates, a standard Medium fight costs 0.63 Critical Injuries and 0.022 deaths (0.018 on PCs). Two fights with untreated injuries carried over, one In Reach start in four Expeditions, one night Skirmish in ten, and the Straggler's Critical Injury give roughly **1.3 to 1.6 Critical Injuries** (the PC share about 1.1 to 1.4) and **0.06 to 0.10 PC deaths per Expedition**. The Critical Injury half of the target is met; the death half is at about a third of the target, and Squadmate deaths sit well below "about 1", because in the measured policies Squadmates take 0.003 to 0.004 deaths a fight.
- **Where the rest is meant to come from, and the dials.** (1) The Straggler row is the only rule that puts Squadmates in a Titan's hand ahead of player characters; at 2 in 3 of its victims it is the Squadmate grinder, but it fires about once in 12 Legs. Moving it to total 7 and the plain Titan to 6 doubles its rate. (2) The In Reach starts (Straggler, Overrun) are the deadliest thing in this proposal and are unmeasured; the reference start is Distant. (3) The fight cadence with no interim issue between days (spent canisters, ruined Blade Sets, used flares) is the compounding the lethality research measured at 0.16 PC deaths per three fights with Squadmates. (4) Human combat adds deaths the fight figures do not count. (5) The owner's pending lethality target (OWNER-DECISIONS item 7 follow-up) may move the fights themselves. Recommendation: ship the table as written, count fights, Critical Injuries, and deaths per Expedition on the playtest debrief sheet, and tune the Titan rows' thresholds and the Straggler rate on that count before the simulator learns Legs.

### 1.7 Risks

- **Table time.** A 5-Leg Expedition adds five Leg rolls, five hazard reads, two camp rolls, two night reads, two day care windows, and the Downtime: about 30 to 45 minutes on top of the fights. The packet should print the two hazard tables on one page.
- **Unmeasured lethality.** The In Reach starts and the night Abnormal are outside every measured row. A first playtest could meet an Overrun on Leg 3 and lose half the Squad; that is within the AoT register but it is not tuned.
- **Squadmate feeding.** "The players choose which Squadmate" at the Straggler row will read as sacrificing the weakest; a random pick among living Squadmates (D6 over the Squad Pool, re-rolling empties) is the alternative and is closed as well.
- **Flare double duty.** Flares are both the Signal Relay lever and the fight decoy, and Funding 3 stocks two. That is a real trade and also a way to arrive at a fight with none.
- **The Endure hunger check** rolls six pools for one row. It is rare (only at 0 rations) and can be dropped to "every soldier gains 1 Stress" if it drags.
- **Downtime as seven fixed days** is a stopgap that Phase 2's Downtime (with Havens, Commendations, and Squad Points) must replace without changing the healing count; if Phase 2 wants variable Downtimes, the healing rows are unaffected because they count days.

---

## 2. Requisition

### 2.1 Packet-ready prose

> **Playtest rule.** Requisition is how a soldier gets gear beyond Standard Issue. There are no prices: what you can ask for depends on Funding, and whether you get it depends on the item's Scarcity and your roll.

**When.** Requisition is a Downtime Action. Each player character may take it once per Downtime. Before a campaign's first Expedition, each player character may also make one Requisition as if in Downtime.

**What you can ask for.** The Requisition list gives each item's Scarcity: Standard, Limited, or Rare. Funding sets which tiers Command will entertain: at Funding 1 or 2, Standard only; at 3 or 4, Standard and Limited; at 5 or 6, all three. A row marked as a Discovery stays locked until the Squad holds that Discovery; no row on the playtest list is locked.

**The roll.** Name one row. Then roll either **Persuade** (Empathy: talking the quartermaster round) or **Recall** (Wits: citing the regulation, the precedent, and the officer who signed it); the roller chooses which before rolling. It needs successes equal to the row's Scarcity (Standard 1, Limited 2, Rare 3), plus 1 for every Requisition Command has already granted the Squad this Downtime: the ledger. Up to three comrades may Help: a player character who Helps spends their own Requisition for this Downtime, and a Squadmate may Help once per Downtime. The roll can be Pushed (Stress in Downtime is real: it rides out with you) and Covered. A failed roll cannot be retried this Downtime.

**Sizing up the quartermaster.** Once per Downtime, before any Requisition roll, one soldier may roll **Size Up** (Instinct, no Help, no retry). On a success the ledger counts 1 lower for the whole Squad this Downtime.

**What you get.** The item arrives before the next Standard Issue and is yours: it counts as items do, it can be passed, taken, and shared out like any item of its kind, and Standard Issue never takes it away (decline the exchange to keep a rated item above the row). A Blade Set rated above 1 is still ruined by any wear. Extra successes do nothing.

**Failure** means Command said no. Nothing else happens.

**The playtest Requisition list.** Nothing here is new gear: every row is an item Chapters 3 and 4 already define, at a rating or in a number Standard Issue does not give, or the two firearms the Skirmish rules need.

| Item | Scarcity | Notes |
|---|---|---|
| Spare gas canister, full | Standard | One more than the Funding row |
| Blade Set rated 1 | Standard | One more than the Funding row |
| Medical kit rated 1 | Standard | For a soldier who is not a Medic |
| Tool kit rated 1 | Standard | For a soldier who is not an Engineer |
| 2 flares, 2 rations, or 1 medical supplies unit | Standard | Added to Squad Supply, above the stock |
| 6 units of shot | Standard | Added to Squad Supply (section 3) |
| Blade Set rated 2 | Limited | Any wear still ruins it |
| Medical kit rated 2 | Limited | |
| Tool kit rated 2 | Limited | |
| Flintlock pistol rated 1 | Limited | Section 3 |
| Musket rated 1 | Limited | Section 3 |
| ODM Gear rated 3 | Rare | Replaces your ODM Gear; keep it by declining later exchanges |
| Horse rated 3 | Rare | Replaces your horse |
| Blade Set rated 3 | Rare | Any wear still ruins it |

Rows that Phase 2 adds carry a canon label (canon, canon-adjacent, invented) and, where a Discovery gates them, its name and Canon Clock year (Thunder Spears and anti-personnel ODM, 850). They are absent from the playtest.

### 2.2 YAML shapes

```yaml
# data/campaign/requisition.yaml
id: requisition
chapter: 07-expeditions-playtest
adrs: [ADR-0003, ADR-0006, ADR-0014, the canon charter ADR]
status: playtest
when: {downtime_action: true, per_soldier_per_downtime: 1, before_first_expedition: 1}
scarcity: [{id: standard, needs: 1}, {id: limited, needs: 2}, {id: rare, needs: 3}]
funding_gate: {1: [standard], 2: [standard], 3: [standard, limited], 4: [standard, limited], 5: [standard, limited, rare], 6: [standard, limited, rare]}
roll:
  entries: [persuade, recall]          # roller chooses before rolling; both changes: [requisition-grant]
  needs: scarcity.needs + ledger
  help: {who: soldiers in the Squad, not Down; max: 3; player_character_spends: their own Requisition this Downtime; squadmate: once per Downtime, spends nothing}
  push_and_cover: as Chapter 1
  retry: never this Downtime
  on_success: grant (the row's item, received before the next Standard Issue; kept_item: true)
  on_failure: nothing
  extra_successes: nothing
ledger: {per_grant_this_downtime: +1, size_up: {entry: size-up, who: one soldier, once_per_downtime: true, help: none, retry: never, success: ledger -1}}
catalogue_row_fields: [id, item, rating_or_units, scarcity, canon_label, lane, locked_until_discovery, notes]
catalogue: [ ...the 14 rows above, canon_label canon for all, locked_until_discovery null... ]
phase_2_row_shape_example:
  - {id: thunder-spear, item: thunder-spear, scarcity: rare, canon_label: canon, lane: fight, locked_until_discovery: thunder-spears, canon_clock_year: 850, in_playtest: false}
# data/character/action-catalog.yaml: persuade, recall, size-up dormant false; changes add requisition-grant, ledger-lower
# data/gear/items.yaml: kept_item field on rated items (true when received by Requisition); flintlock-pistol, musket rows (section 3)
# data/gear/squad-supply.yaml: kinds add shot
```

### 2.3 Talent hooks

Rolls: `persuade` and `recall` (the Requisition roll), `size-up` (the ledger roll). Triggers: "You declare a Requisition roll"; "A Requisition roll fails"; "Command grants a Requisition"; "You Help a Requisition roll"; "The ledger rises". Resources and states: the ledger, the Scarcity tier, the Funding gate (a Talent could open the next tier for its holder once per campaign, which is the Coriolis Permit shape), the kept item, "before the first Expedition". Limits: once per Downtime, once per campaign.

### 2.4 Left for Phase 2

Funding as a moving track and the Lobby Squad Action; Faction Standing added to the roll; coin, wages, and personal purchases (rejected by the charter); Discoveries and Research Points; the Field Kit and Squad Equipment tables of the gear research (option A there); branch variants (Garrison, Military Police rigs); Requisition of Squadmate gear; a per-Expedition resupply Requisition; the debrief question "what did you reach for and not have".

### 2.5 ADRs, CONTEXT, targets, simulator

- **Canon charter ADR** (numbered by the decider): item 7 "access is Funding and Scarcity, not coin" is this rule. No other ADR needs amending.
- **ADR-0014:** no target moves, but the reference issue is Funding 3 Standard Issue. A soldier who Requisitions a rating 2 Blade Set or rating 3 ODM Gear before the first Expedition plays above the reference Rookie; the Veteran build already assumes exactly that ("from higher Funding or from Requisition"). Record as a sensitivity: the Jam and gas figures at ODM 3 exist (section 4.9's table), and the Blade Set rating 2 and 3 fragility figures are recorded under OQ-63. No rerun.
- **CONTEXT.md:** Requisition, Scarcity, Funding keep their entries. New: **Ledger** (Command's patience: +1 needs per Requisition granted this Downtime), **Kept item** (an item Standard Issue never takes away). Downtime Action's list gains the Requisition rule.
- **Chapters:** the Requisition rule in the playtest chapter; Chapter 4 section 4.9 gains a pointer at the decline step and 4.12 the Blade Set rating field `sheet-fields.yaml` already anticipates.

### 2.6 Risks

- **Creep off the tuned kit.** Four player characters at Funding 3 can each get one Limited item before the first Expedition (Blade Set 2, medical kit 2, tool kit 2, pistol), and the ledger makes the fourth need 5 successes. That is a bounded step above the reference, and it is what the owner asked Requisition to do. If the first playtest must stay on the reference kit, drop the "before the first Expedition" sentence (owner question 3).
- **Two entries for one roll.** Letting the roller choose Persuade or Recall means every soldier uses their better attribute; the ledger and the Funding gate are the brake, not the attribute. It is deliberate: both Talents get a home and no Specialty owns Requisition.
- **Firearms on the list** contradict owner decision 6 ("nothing new in gear before the playtest") unless the owner accepts the two firearms as the minimum the Skirmish rules need (owner question 4).

---

## 3. Human-versus-human combat: Skirmishes

### 3.1 Packet-ready prose

> **Playtest rule.** A Skirmish is a scene in which soldiers fight people: Military Police, bandits, a Garrison picket. Humans are not Titans. They roll dice, they can be blocked, they can be talked down, and they hurt you with damage, not with a Titan's Critical Injury. Everything about your own rolls is Chapter 1 as written. Titan Engagements are unchanged.

**Starting a Skirmish.** A rule (a hazard row, a Mission Brief) or the GM's scene framing starts it and names the foes from the foe list and their number. Every foe starts **Apart** from every soldier unless the starting rule says otherwise. If the Squad approaches unseen, one soldier rolls **Sneak** (Agility, no Help, no retry) before the first round, needing the foe group's Watch; on a success the Squad has the **ambush**: in round 1 every soldier's card comes before every foe's, and an attack on a foe that has not yet acted this Skirmish gains 2 Bonus Dice and cannot be answered by a Reaction. A starting rule may give the ambush to the foes instead; then the same applies against you.

**Range.** Each soldier is **Engaged** with a foe (within arm's reach) or **Apart** from it. A move closes in on one foe or breaks away from every foe you are Engaged with, or mounts or dismounts. You cannot break away while Held.

**Rounds.** Deal initiative cards as in a Titan Engagement: one per soldier, one per foe group. A turn is one move and one action. Wings do not exist here; a Squadmate acts on its own card and never Pushes.

**Your actions.** Fight, Shoot, Grapple, Break Free, Reload, Parley, Size Up, Help, and any Catalog entry that works outside a Titan Engagement (Treat Injury, Rally, Lift Comrade, Pass Item, Change Canister, and so on). Titan Engagement entries cannot be taken.

- **Fight** (Strength; Gear Dice from the Blade Set in your handles, or none bare-handed) against one foe you are Engaged with. Needs 1.
- **Shoot** (Agility; Gear Dice from a loaded firearm) against one foe you can see, Engaged or Apart; a musket cannot be fired at a foe you are Engaged with. Needs 1. The firearm is then empty.
- **Grapple:** a Fight attack with no Gear Dice. If it lands, the foe is **Held** by you: it cannot move or attack anyone but you, and its only attack is bare-handed. While you hold, you cannot move or take any action but a bare-handed Fight on the held foe or letting go (no roll). A foe can Grapple you the same way.
- **Break Free** (Strength; Gear Dice from a Blade Set) while Held. Needs 2. On a success you are no longer Held.
- **Reload** (no roll): spends your action and 1 unit of shot from Squad Supply; a musket also spends your move. The firearm is loaded.
- **Parley** and **Size Up:** below.

**How an attack lands.** The attacker rolls. A soldier rolls a full pool; a foe rolls its Attack dice as base dice and nothing else. If it has at least 1 success, it will land unless the target makes a **Reaction**: **Block** (Strength, Blade Set) against a Fight attack, or **Dodge** (Agility, ODM Gear, or the horse while mounted) against a Fight attack or a shot. A Reaction spends a turn as Chapter 1 says. It needs successes equal to the attack's successes; if it gets them, the attack does nothing. A foe's Reaction is its Guard dice, and a foe never Pushes. You can make one Reaction against each foe per round, and it covers everything that foe does to you that round. A Held soldier cannot Dodge. An ambushed target cannot React at all in round 1.

**Damage.** An attack that lands does its weapon's damage, plus 1 for each success beyond the first. On a soldier, that is damage as Chapter 3 gives it: mark Health lost; at 0 current Health you are Down and take a Critical Injury; damage at 0 is another. The weapon's **Injury Type** rides on it: a blade or sabre is Cut, a shot is Pierce, a club or a fist is Crush. On a foe, damage lowers its Health; at 0 it is out of the Skirmish: dead if the damage was Cut or Pierce, Down and out cold if it was Crush.

**Weapons.** Blade Set (Fight, Cut, damage 2; a Pushed roll whose Gear Die shows 1 ruins it as ever). Bare hands or any object that is not a gear item (Fight, Crush, damage 1). Flintlock pistol (Shoot, Pierce, damage 2, one shot, rated 1, counts as 1 item). Musket (Shoot, Pierce, damage 3, one shot, rated 1, Apart only, counts as 2 items). Firearms have no use in a Titan Engagement and give no Gear Dice there.

**Foes.** A foe group has one card and acts together on it. Each foe acts by this rule and no other: if Held, it Fights the holder bare-handed; else if it is Engaged with a soldier, it Fights the Engaged soldier who most recently attacked it, or, if none did, the Engaged soldier with the lowest card; else if it has a loaded firearm and a soldier it can see, it Shoots the soldier who most recently attacked it, or the soldier with the lowest card; else it moves to close in on the nearest soldier (the one with the lowest card among those Apart) and, if it can, Fights. A foe with an empty firearm reloads instead of moving on a turn in which no soldier is Engaged with it. Foes never Push, never Help, and have no Stress.

| Foe | Attack | Guard | Weapon | Health | Grit | Watch |
|---|---|---|---|---|---|---|
| Bandit (salvager, deserter) | 4 | 3 | Club (Crush 1) or knife (Cut 1) | 3 | 1 | 1 |
| Military Police trooper | 5 | 4 | Sabre (Cut 2) or flintlock pistol (Pierce 2) | 4 | 2 | 2 |
| Garrison sentry | 4 | 3 | Musket (Pierce 3) | 4 | 1 | 2 |

**Grit and breaking.** When the number of a group's foes that are out of the Skirmish reaches its Grit, the group **breaks**: every remaining foe moves Apart and leaves at the end of the round, and the Skirmish ends when no foe is left.

**Parley.** On your action, once per Skirmish, roll **Persuade** (Empathy; or Strength if you threaten). Name the ask: **stand down** (they leave), **let us pass**, **answer** (one question, answered truthfully), or **surrender** (they lay down arms and are yours; needs 1 more). It needs the group's Grit +1, minus 1 for each of its foes out of the Skirmish, never below 1. Comrades in the Skirmish who are not Down may Help by spending their action, up to three. It can be Pushed and Covered. On a success the group **yields** and the Skirmish ends. On a failed threat the group's Grit rises by 1 for this Skirmish. Outside a Skirmish, dealing with any person uses the same roll against that person's Grit, with the same asks.

**Size Up** (Instinct; no Help; once per foe group per Skirmish): on a success the GM states the group's Grit, how many more foes must fall before it breaks, and what each foe will do on its next card.

**Ending.** A Skirmish ends when every foe is out, gone, or yielded, or when every soldier is Apart from every foe and leaves. Then run the end of a Titan Engagement's steps with "Skirmish" in place of "Titan Engagement": cancel turns spent in advance, every soldier who took part loses 1 Stress, lasting Stress Responses gained during it end, turn limits become engagement limits, aftermath rolls (every soldier in the Skirmish counts as within one step of every other), the Death Rolls, the care window (scope: every soldier who took part), Grief, Retirement, promotion. A comrade who dies in a Skirmish causes the comrade-dies Fear Roll for every soldier in it who is not Down.

**Drives and Talents.** Drive turn tests count Skirmish turns; Position triggers still need a Titan Engagement. A Talent limited to once per Titan Engagement can also be used once per Skirmish.

### 3.2 YAML shapes

```yaml
# data/skirmish/skirmish.yaml
id: skirmish
chapter: 07-expeditions-playtest
adrs: [ADR-0003, ADR-0004, ADR-0005, ADR-0006, new ADR: humans roll and are blocked]
status: playtest
start: {named_by: [hazard row, mission brief, scene framing], foes: from foes.yaml, default_range: apart}
ambush:
  roll: {entry: sneak, who: one soldier, help: none, retry: never, needs: foe group watch}
  effect: {round_1_order: side first, bonus_dice_source: ambush (2, vs a foe that has not acted), target_reaction: none}
  changes: [ambush-set]
range: {states: [engaged, apart], move: [close-in, break-away, mount-or-dismount], held_cannot_move: true}
rounds: {initiative: data/engagement/round.yaml deal, one card per soldier and per foe group; wings: none; turn: move + action}
actions:
  fight: {entry: fight, attribute: strength, gear: [blade-set], needs: 1, range: engaged, changes: [foe-harm, held-set]}
  shoot: {entry: shoot (new), attribute: agility, gear: [flintlock-pistol, musket], requires_gear: true, without_gear: not_possible, needs: 1, range: {pistol: any, musket: apart}, after: firearm empty, changes: [foe-harm]}
  grapple: {option_of: fight, gear_dice: none, on_land: held, holder_limits: [no move, bare-handed fight on the held foe, let go], changes: [held-set]}
  break-free: {entry: break-free, needs: 2, while: held, changes: [held-end]}
  reload: {entry: reload (new option), roll: none, spends: {action: true, move: musket only, squad_supply: {shot: 1}}, changes: [firearm-load]}
reactions:
  block: {entry: block, attribute: strength, gear: [blade-set], against: [fight]}
  dodge: {entry: dodge, attribute: agility, gear: [odm-gear, horse while mounted], against: [fight, shoot]}
  needs: the attack's successes      # ADR-0015 shape; no opposed roll (Chapter 1, 1.1 item 5)
  per_round: one per foe, covers that foe's attacks that round
  held: {dodge: false}
  ambushed_round_1: none
damage:
  formula: weapon damage + 1 per success beyond the first
  on_soldier: data/harm/health.yaml harm_kinds.damage with injury_type   # new optional parameter
  on_foe: {health_down: true, at_zero: {cut_or_pierce: dead, crush: down-out-cold}}
weapons:
  - {id: blade-set, action: fight, injury_type: cut, damage: 2}
  - {id: bare-hands, action: fight, injury_type: crush, damage: 1, gear_dice: none}
  - {id: flintlock-pistol, action: shoot, injury_type: pierce, damage: 2, shots: 1, rated: true, rating_on_issue: 1, items_counted: 1, range: any, titan_engagement_use: none}
  - {id: musket, action: shoot, injury_type: pierce, damage: 3, shots: 1, rated: true, rating_on_issue: 1, items_counted: 2, range: apart, reload_spends_move: true, titan_engagement_use: none}
foe_rule:   # closed targeting; the GM chooses nothing
  order: [held -> fight holder bare-handed, engaged -> fight most-recent-attacker else lowest-card engaged, loaded-firearm -> shoot most-recent-attacker else lowest-card, else -> close in on lowest-card apart soldier then fight if able]
  reload: on a turn with no soldier engaged, if the firearm is empty
  never: [push, help, stress]
grit: {breaks_when: foes out >= grit, effect: remaining foes move apart and leave at end of round}
parley:
  roll: {entry: persuade, attribute: empathy, threaten_attribute: strength, once_per_soldier_per_skirmish: true}
  asks: [stand-down, let-pass, answer, surrender {needs_add: 1}]
  needs: max(1, grit + 1 - foes out)
  help: {who: soldiers in the Skirmish, not Down; spends: action; max: 3}
  push_and_cover: as Chapter 1
  failure: {threaten: grit +1 this Skirmish, else: nothing}
  outside_skirmish: {needs: the person's grit, same asks, help: none}
  changes: [foe-yield]
size_up: {entry: size-up, attribute: instinct, help: none, limit: once per foe group per Skirmish, reveals: [grit, foes to break, each foe's next action], changes: [foe-intent-reveal]}
end:
  when: [every foe out, gone, or yielded; every soldier apart and leaving]
  steps: data/harm/engagement-end.yaml with procedure = skirmish   # add skirmish-ends to stress-changes.yaml reductions (1)
  aftermath_positions: every soldier in the Skirmish within one step of every other
  fear_rolls: {comrade-dies: {who_rolls: every soldier in the Skirmish not Down}}
drives_and_talents: {drive_turn_tests_count_skirmish_turns: true, once_per_titan_engagement_applies_per_skirmish: true}
# data/skirmish/foes.yaml
row_fields: [id, name, attack_dice, guard_dice, weapons, health, grit, watch, groups_of]
rows:
  - {id: bandit, attack_dice: 4, guard_dice: 3, weapons: [club, knife], health: 3, grit: 1, watch: 1, groups_of: 3}
  - {id: military-police-trooper, attack_dice: 5, guard_dice: 4, weapons: [sabre, flintlock-pistol], health: 4, grit: 2, watch: 2, groups_of: [2, 4]}
  - {id: garrison-sentry, attack_dice: 4, guard_dice: 3, weapons: [musket], health: 4, grit: 1, watch: 2, groups_of: 2}
# data/character/action-catalog.yaml: fight and block reserved false; new entries shoot (action, agility, gear firearms) and reload (option); sneak, persuade, size-up dormant false; break-free requirements add "or Held in a Skirmish"; dodge context any (against a shot)
# data/core/bonus-dice-sources.yaml: ambush row (2 dice, attack on a foe that has not acted, condition: the Squad has the ambush)
# data/core/stress-changes.yaml: skirmish-ends (reduction 1, every soldier who took part)
# data/harm/health.yaml: harm_kinds.damage.parameters.injury_type (optional; recorded on the Critical Injury it inflicts)
# data/harm/sheet-fields.yaml: held (true/false), killed_a_person (if the owner takes the Fear Roll trigger)
# data/gear/squad-supply.yaml: shot kind, stock by Funding [0, 0, 6, 6, 8, 10]
```

### 3.3 Talent hooks

Rolls: `fight` (with a Blade Set, bare-handed, or as a Grapple), `block`, `dodge` against a shot, `shoot`, `break-free` while Held, `persuade` (Parley, and the threat variant on Strength), `size-up`, `sneak` (the ambush roll), `treat-injury` and `rally` in a Skirmish (already live). Triggers: "You declare Fight with a Blade Set / bare-handed / as a Grapple"; "Your Fight attack lands"; "A foe's attack lands on you"; "You declare Block"; "You Block a foe's attack"; "You declare Shoot"; "You Reload"; "You become Held"; "You Hold a foe"; "You declare Parley" or "a threat"; "A foe group breaks or yields"; "The Squad has the ambush"; "A foe you can see has not acted"; "A comrade in the Skirmish becomes Down"; "You kill a person" (and, if adopted, the first-human-kill Fear Roll); "A Skirmish begins" and "ends". Resources and states: Engaged and Apart, Held, loaded and empty firearms, shot units, Grit and "foes to break", the ambush, Watch, the Injury Type of a hit (a Talent could turn a Cut you deal into a Crush, taking prisoners), the attack's successes as the Reaction's needs (a Talent could lower it by 1 once per Skirmish), foes out of the Skirmish, the yield asks. Limits: once per Skirmish, once per foe group, once per round.

For the Talent list: Hand-to-Hand names `fight` and `block` and is live at once. Blade Discipline could add `fight` to its names. Grip Breaker's `break-free` is live against a Hold. Pry Loose's trigger names "a Grabbed comrade"; the decider may extend it to a Held comrade or leave it Titan-only. Horsemanship's mounted dodge is live against a shot. Slip Away is live against Fight and Shoot. Steady Voice, Field Medicine, Carrying Voice (its Position step reads as "any soldier in the Skirmish"), Wide Awareness and Shoulder the Load (no Positions in a Skirmish, so they change nothing) need one line each in the Talent list.

### 3.4 Left for Phase 2

Chases and mounted Skirmishes with Chase Bands; cover and aiming; armor; several foe groups with different cards; foes that Help or Push (named NPCs such as an Interior officer, run as a soldier); anti-personnel ODM and Titan-scale weapons; ODM moves in a Skirmish (a soldier can mount, but there are no Positions to fly between); prisoners, interrogation, and Faction consequences of a Military Police fight (Commendations, Faction Standing); foe Critical Injuries; friendly fire; the Uprising's Operation Frame; night and darkness; a foe morale table beyond Grit; Injury Type riders (the critical-injuries proposal's step 2); a foe's Fear of Titans in a mixed scene.

### 3.5 ADRs, CONTEXT, targets, simulator

- **New ADR (numbered by the decider): "Humans roll; Titans do not."** Human attacks are rolled and their Severity is their successes; humans can be blocked; human harm is damage typed by the weapon; foes act by a closed targeting rule and break by Grit. Considered and rejected: opposed cancellation (Coriolis, Alien), because Chapter 1 forbids opposed rolls and the needs-equals-successes shape reuses ADR-0015 and Chapter 1's Reaction rule unchanged; human Critical Injuries direct (ADR-0005 stays Titan-only, and a Health pool is what makes a human fight survivable); GM-chosen targets (ADR-0003 item 8).
- **ADR-0005 and ADR-0015:** untouched in text. Chapter 1, section 1.9's "Blocking is possible only against an enemy whose rules allow it" now has such an enemy; section 1.1 item 5 ("no opposed rolls") stands because none is added.
- **ADR-0003:** new tracked values (`foe-harm`, `held-set`, `held-end`, `firearm-load`, `foe-yield`, `foe-intent-reveal`, `ambush-set`), a new Bonus Dice row (`ambush`), a new Stress row (`skirmish-ends`), no new Fear Roll trigger unless the owner takes `first-human-kill`. The foe rule is a closed list, so ADR-0003 item 8 holds.
- **ADR-0006:** one new entry, `shoot` (Agility, firearms), and one new option, `reload`. Every other roll uses an existing entry. Dormant entries keep their attributes; Persuade's Strength variant is a Parley rule, the Hunter's Eye pattern.
- **ADR-0014:** no Titan target moves. Human deaths add to "a PC dies every 3 to 4 missions" and are unmeasured. Arithmetic for the record: a Rookie with Strength 4, Hand-to-Hand 1, Blade Set 1, Stress 1 (7 dice) lands a cut on a Military Police trooper about 1 time in 2 after its Guard; the trooper's sabre lands on that Rookie about 1 time in 4 per attack for damage 2 to 3, so two landed sabre hits or one musket ball and anything put a Health 4 Rookie Down with a Cut or Pierce Critical Injury, lethal about 1 time in 6 on a fresh location. A Skirmish against three troopers is therefore about as dangerous to one soldier as a Medium Titan fight is to the Squad, which suits the Uprising register; it is a starting value.
- **Critical-injuries proposal:** Cut and Pierce get their source; `injury_type` on damage is the field. If the owner takes that proposal's step 1 (names on rows), the Skirmish rules need nothing else; the riders are its step 2.
- **CONTEXT.md:** new terms **Skirmish** (avoid: combat, encounter, battle, fight scene), **Engaged** and **Apart** (avoid: range band, Position, Chase Band), **Held** (avoid: Grabbed, which is reserved for Titans), **Grit** (a foe group's morale; avoid: Resolve, morale), **Watch** (the needs of a Sneak roll against a group), **Ambush**, **Parley**, **Foe** (avoid: enemy, mob, monster), **Shot** (a Squad Supply kind), **Injury Type** (from the critical-injuries proposal). Reaction's entry loses "blocking is impossible" as an absolute ("against a Titan"). Help's entry: in a Skirmish, an unspent action and any range. The Military Police entry gains "and the commonest human foe".
- **Chapters:** the Skirmish rules in the playtest chapter; Chapter 1 section 1.9 and Chapter 3 section 3.16 gain a pointer; Chapter 4 gains the two firearm items and the shot kind (4.1, 4.10); Chapter 2 the two Catalog rows.
- **Simulator:** no case; a Skirmish probe (one Rookie against one trooper, a Squad against three) is cheap and worth a report row before Phase 2 tunes foes.

### 3.6 Risks

- **Undodgeable volleys.** A 3-success musket shot needs 3 on the Dodge, which a Rookie makes about 1 time in 5. That is the Titan Severity 3 feel applied to guns; it is deliberate, and it is the first place a Rookie can die to a single roll outside a Grab.
- **Grit ends fights early.** Bandits break after one falls; troopers after two. A Squad of six will rarely see a Military Police group to the last man. That is the intent (canon fights end in flight or surrender), but a table wanting a brawl may find it abrupt; raising Grit is a one-number dial.
- **The foe rule is legible and exploitable.** "Attacks whoever last attacked it" lets the Squad steer every foe onto its Brawler. Acceptable for a playtest; Phase 2 can add a second rung.
- **Cut kills, Crush does not.** Bare hands never kill a foe, which is thematically right and mechanically odd (a foe at 0 from fists is out cold). It keeps "you killed someone" a choice made by drawing a blade.
- **Ranges without Positions** will be read by some tables as Positions; the glossary Avoid lists must be firm.
- **Blade Sets ruined on people.** A Pushed Fight with a Gear Die 1 ruins a Blade Set exactly as a Nape strike does; a Squad that brawls with the Military Police before an Expedition rides out short of blades. That is a cost, not a bug, but the packet should say it.
- **Owner decision 6 conflict:** two firearms are new gear before the playtest (owner question 4).

---

## 4. Cross-cutting notes

- **Packet placement.** One new section, "Playtest rules: Expeditions, Requisition, Skirmishes", after Gear and before the GM section, about 4 to 5 packet pages in total (Expeditions 2, Requisition 1, Skirmishes 1.5), with the two hazard tables, the Requisition list, and the foe table as its only tables. Every paragraph carries the "Playtest rule" tag the packet already uses.
- **Order of adoption.** Requisition depends on nothing. Skirmishes depend on the two firearm items and the shot kind. Expeditions depend on Skirmishes only through the Prowlers row (replaceable by Restless if Skirmishes are declined) and on the critical-injuries proposal only through the Straggler's Bite label (replaceable by "rolled type"). Each subsystem can ship alone.
- **Catalog changes, in one list:** `spot`, `survive`, `endure`, `ride`, `size-up`, `persuade`, `recall`, `sneak` lose `dormant`; `fight` and `block` lose `reserved`; new `shoot` (action, Agility, firearms) and `reload` (option); new tracked values `leg-outcome`, `camp-outcome`, `hazard-outcome`, `requisition-grant`, `ledger-lower`, `foe-harm`, `held-set`, `held-end`, `firearm-load`, `foe-yield`, `foe-intent-reveal`, `ambush-set`; `help_outside_titan_engagement` filled in on every entry above.
- **Talent list drafting rule.** Every Talent that names a Leg, camp, Requisition, or Skirmish roll carries no dice in any ADR-0014 baseline (batch 3's exclusion) and needs no sensitivity row unless it also names a Titan Engagement roll.
- **Interim rows retired only while the new procedures run.** A table that plays fights with no Expedition keeps the interim day and issue; the simulator's sequence rows keep their cadence until OQ-116 is re-run.

---

## 5. Questions for the owner

Only the owner can choose these.

1. **Scope of human conflict.** Confirm that human-versus-human combat is in the game at all (gear research question 5), and that Military Police, bandits, and Garrison sentries are the right first foes for 845 to 850 with no Marley.
2. **Deadliness of guns.** A musket ball that puts a Rookie Down on one landed hit, and a shot whose dodge needs its successes, is the Uprising register. Is that the feel you want for human fights, or should human fights be less lethal than Titan fights?
3. **Requisition before the first Expedition.** Allow one Requisition per player character before the first ride, which puts some soldiers a step above the tuned Rookie kit, or hold the first playtest on the reference kit and let Requisition start at the first Downtime?
4. **Firearms as new gear.** Decision 6 says nothing new in gear before the playtest. The Skirmish rules need two firearms (pistol, musket) and a shot kind. Accept them as the human-conflict minimum, or ship Skirmishes with blades and fists only?
5. **Squadmates at the Straggler row.** Two in three Straggler victims are Squadmates, chosen by the players. Is that the grinder you want (it is the only rule that makes "about 1 Squadmate per Expedition" reachable), and should the pick be the players' or random?
6. **A Fear Roll for killing a person.** Add `first-human-kill` to the closed trigger list (the soldier who kills a person for the first time rolls; recorded like `faced_a_titan`)? Canon supports it; it is the one new trigger this proposal would add.
7. **Downtime length.** Seven fixed days between Expeditions as the playtest stopgap, or a rolled length?
8. **Lethality target link.** Section 1.6 estimates about 0.06 to 0.10 PC deaths per Expedition from these rules with the fights as they stand, against the 0.25 to 0.33 target. Should the hazard table ship hotter now (Titan rows from 5, Straggler at 7), or ship as written and tune on the playtest count together with item 7's pending fight-lethality decision?
9. **Bare hands never kill.** Keep the line that Crush damage puts a foe out cold and only Cut or Pierce kills?

## 6. Decisions for the Fable decider

A decider can settle these within the ADRs and the owner's answers.

1. ADR numbering: the canon charter, Injury Type, the Talent guardrails, and "Humans roll; Titans do not"; and whether ADR-0005 gains the Straggler sentence or the Straggler deals a fall instead.
2. Whether the Hard Ride Leg roll is `ride` (this proposal; hooks Horsemanship and Sure Seat) or `endure`.
3. The exact Formation Post entries and modifiers, and whether Signal Relay's flare spend is once per Leg or once per Expedition.
4. Rations stock by Funding, and whether the hunger check is an Endure roll per soldier or a flat Stress gain.
5. The Distance Band assignment on the interim route (by position, as here, or rolled per Leg).
6. Whether the Straggler pick is the players' choice or a random Squadmate, and the Straggler's Injury Type (Bite) if the critical-injuries proposal is adopted.
7. Whether a Skirmish's end gives the 1 Stress relief (a new `skirmish-ends` row) or no field relief.
8. Whether Pry Loose, Blade Discipline, Carrying Voice, Wide Awareness, and Shoulder the Load gain a Skirmish reading, and the wording of Hand-to-Hand's live entry.
9. The foe table's numbers (Attack, Guard, Health, Grit, Watch) and group sizes, and whether a Garrison sentry belongs on a playtest list.
10. The Requisition list's tiers, the ledger's size, and whether Size Up on the quartermaster stays.
11. Downtime's minimal action list and amounts (Recover 2 Stress; Visit Haven 2 Stress and 2 Grief; Honoring the Fallen 1 Grief; Squadmates 2 and 1), checked against OQ-52's "at least 2 Grief per Downtime for a soldier who uses the relief".
12. The infirmary roll (four dice, once per patient per day) for day-limit injuries inside the Walls.
13. Which CONTEXT.md entries change and the Avoid lists for Skirmish, Engaged, Apart, Held, Grit, Foe.
14. Packet placement and the pointer sentences in Chapters 1, 3, 4, and 5; whether the three subsystems form one playtest chapter (07) or three.
15. OQ entries: a new OQ for the Expedition cadence replacing OQ-116's readings 1 and 4 to 8; a note on OQ-120 and OQ-130 that the interim rows are replaced while an Expedition runs; a new OQ for the Skirmish probe.
