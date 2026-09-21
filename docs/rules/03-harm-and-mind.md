# Chapter 3: Harm and Mind

This chapter covers what happens to a soldier's body and nerve. The body half covers Health, Critical Injuries, Down, lethal Critical Injuries and Death Rolls, Treat Injury, and healing time. The mind half covers Resolve, Stress Responses, Rally, Fear Rolls, Scars, Retirement, and Grief.

It builds on Chapter 1 (dice pools, Pushing, Stress, Help, turns and Reactions) and Chapter 2 (Health and Resolve formulas, Drives, Talents, the Action Catalog, and Squadmates). It changes no rule in either chapter. Later chapters own these rules, and this chapter only refers to them:

- **Chapter 4, Gear:** falls and any other damage from gear, gear damage of every kind, the medical kit and medical Squad Supply, what happens to a soldier who becomes Down while airborne or mounted, and carrying a Down comrade.
- **Chapter 5, Titan Engagement:** the Grab procedure, including its lift and devour steps (section 5.9); Titan attack targeting, including whether the Attention Ladder can choose a Down soldier (sections 5.5 and 5.6); who witnesses a Fear Roll trigger (section 5.9); when a Titan Engagement ends and how a soldier leaves one while it goes on (section 5.11); and which Position changes a Down soldier's move can make (section 5.2).
- **Chapter 6, Standard Titans:** each Behavior Table entry's Injury Location, Injury Type, and whether it can be lethal, and which behaviors have a grab effect (`data/titans/`; section 6.1).

Chapter 7, the playtest rules, gives when a day passes on an Expedition and in Downtime, the Camp Relief, Downtime's Stress and Grief relief and its infirmary, and a Skirmish's turns, Fear Rolls, and end steps. This chapter points to it where those meet its rules.

Some rules this chapter needs are not yet written:

- **Instructors and contacts:** the rules that give a retired soldier an effect as an instructor or contact.

This chapter mentions them only where it has to.

**Tables.** Every table and procedure in this chapter is a YAML file. Those files are the only source of truth (ADR-0012). The result tables (the Injury Types, the Injury Location roll, the four Injury Location tables, the lost-limb grades, and the Stress Response, Fear Roll, and Scar tables) are rendered from them by `tools/render/render.py` where each procedure uses them, between `BEGIN RENDERED` and `END RENDERED` markers that name each block's source file; nothing between the markers is written by hand, and `render.py check` fails if a rendered block and its YAML differ. The files are:

- `data/harm/health.yaml`: Health, the kinds of harm, Titan attacks, and getting Health back.
- `data/harm/critical-injuries.yaml`: the Injury Types, gaining a Critical Injury, the sided Injury Location roll, the four Injury Location tables with their type riders, and the lost-limb grades.
- `data/harm/down.yaml`: becoming Down, what a Down soldier can and cannot do, and ending Down.
- `data/harm/death-rolls.yaml`: time limits, the Death Roll and its outcomes, and dying.
- `data/harm/treat-injury.yaml`: the Treat Injury procedure, care windows, and aftermath rolls.
- `data/harm/healing.yaml`: healing time and what happens when a day passes.
- `data/harm/effect-types.yaml`: the effect types every table row in this chapter uses.
- `data/harm/engagement-end.yaml`: what this chapter resolves when a Titan Engagement ends, in order, and how its rules treat a soldier who left before the end.
- `data/harm/sheet-fields.yaml`: what this chapter adds to the character sheet and Squadmate stat block.
- `data/mind/stress-responses.yaml`: the Stress Response table, lasting results, and Rally.
- `data/mind/fear-rolls.yaml`: the closed list of Fear Roll triggers, the event's Titan, the placement rules, and the Fear Roll table.
- `data/mind/scars.yaml`: gaining Scars, the Scar table, and Retirement.
- `data/mind/grief.yaml`: gaining Grief, its limit, and its effect.

This chapter adds no rows to Chapter 1's or Chapter 2's files. Stress gained or lost from its tables uses Chapter 1's named-gain and named-reduction rows in `data/core/stress-changes.yaml`. Its penalties use Chapter 1's penalty step (section 1.3, step 5).

**Rulings.** The GM rules on harm and mind only before the dice are rolled, in three places. A called roll's stakes may name harm to the soldier who fails it: damage of 1 to 3 of the Injury Type of its source, or a fall (section 3.1, *Harm a ruling names*; decision batch 9, 9-5). A Treat Injury roll takes the Circumstances the GM names, as any attribute roll does (section 3.5; 9-2). Outside a Titan Engagement, the GM may call a Fear Roll through the `gm-horror` trigger (section 3.12; 9-6). The GM applies the rest as written: the parameters of every kind of harm another rule names, the Injury Location roll, the row a total finds and its type rider, every table in this chapter, Down, the Death Roll and its time limits, Treat Injury's uses and care windows, healing time, and Stress relief. No ruling inflicts a Critical Injury or death directly, or picks an Injury Location, a row, or a time limit. Every other rule the GM applies as written is on the list in Chapter 1, section 1.1, item 6.

Where the ADRs left a question open, the rule below cites its entry in `docs/rules/OPEN-QUESTIONS.md` as (OQ-nn). Every entry this chapter cites was decided on 2026-09-14 (`docs/rules/DECISIONS-2026-09-14.md`), including the owner's decision that Health is a row of boxes (ADR-0005, as amended), and the text states the decided rule. OQ-58 was decided the same day, under *Conformance follow-up* in that file, and OQ-70 and OQ-71 under *Batch 2*. Decision batch 7 (items 7-4 to 7-7, 2026-09-15) decided OQ-137: sides on the Injury Location, Injury Types, the Bite rider, the lost-limb grades, and medical Retirement (ADR-0017). Items 7-8 and 7-9 decided OQ-139: the Fear Roll table re-cut on Attack on Titan rows that hold the old profile, and fiction-first names for the Stress Responses. Decision batch 8 (items 8-7 to 8-11 and 8-15 to 8-25) decided OQ-138, OQ-146, OQ-147, OQ-150, OQ-151, and OQ-156 to OQ-161: Burn's sources and rider, the falling Titan and Pinned, prosthetics, lost-limb stacking, the Cut and Pierce riders, and the readings their drafting raised. Decision batch 9 (items 9-2, 9-5, 9-6, and 9-11, 2026-09-16) made the GM's rulings part of the rules (ADR-0024): harm named as a called roll's stakes, Circumstances on Treat Injury and none on the Death Roll, and the `gm-horror` Fear Roll trigger. Design notes give the reasons.

---

# Part One: Body

## 3.1 Health and harm

### Health

- A soldier's Health is the formula in `data/character/attributes.yaml` (`derived_values`): 2 plus half of Strength plus Agility, rounded up, where the rounding applies to the halved attributes and the 2 is added after. A built soldier has 4 to 6 and a rolled one 4 to 8; the Rookie and the Veteran have 6 and the Levi-grade soldier 7 (section 2.2). Attributes never rise (ADR-0011), so Health never changes.
- **The row of boxes.** The sheet keeps Health as a row of that many boxes (`health` in `data/harm/health.yaml`). Each box is clean, marked by damage, or crossed off by a Critical Injury.
- **Crossed-off boxes.** Each untreated Critical Injury the soldier holds crosses off one box, whatever inflicted it. The boxes crossed off are the smaller of the untreated Critical Injuries held and Health. So a soldier can hold more untreated Critical Injuries than they have Health: the extra ones cross off nothing, and treating one of them gives back no box until fewer untreated Critical Injuries remain than the soldier has Health.
- **Health lost.** The sheet records **Health lost** to damage. It is never more than Health minus the boxes crossed off.
- **Current Health** is Health minus the boxes crossed off minus Health lost, and it never goes below 0.
- Health measures how much punishment a soldier can take before they can no longer act. It stays a small, countable number on purpose, because Titan attacks bypass it (ADR-0005): they cross off boxes through Critical Injuries and never add to Health lost. Decision batch 13 (13-1; OQ-190) added 2 to it after the first session found soldiers too fragile, so every build now takes two more Titan attacks before it goes Down, and nothing else about harm changed: an untreated Critical Injury still crosses off exactly one box, and every damage value is what it was.

### The kinds of harm

`harm_kinds` in `data/harm/health.yaml` lists every kind of harm a rule can inflict. A rule that harms a soldier names one kind and its parameters:

- **Damage** adds an amount to Health lost, marking that many boxes. It is named by rules for harm that is not a Titan attack: a fall (Chapter 4), steam at a Titan's death or Regeneration fill, a Heave against a corpse (Chapter 5, section 5.7), a Foe's weapon (Chapter 7), and a ruling, as a called roll's stakes (*Harm a ruling names*, below). The rule also names its Injury Type (section 3.2), which a Critical Injury the damage inflicts records.
- **Critical Injury** gives the soldier a Critical Injury at an Injury Location, with the Injury Type its rule names (section 3.2). While untreated it crosses off one Health box. It never adds to Health lost.
- **Death** kills the soldier (section 3.4). It is named by rules such as the Grab's devour step (Chapter 5, section 5.9), and never by a Behavior Table entry.

### Harm a ruling names

When the GM calls a roll (Chapter 1, section 1.1), the stakes named before the dice may say that failure harms the soldier who rolled. They may name one of two harms, and no other (`harm_kinds`, `damage`, `by_ruling`; decision batch 9, 9-5; ADR-0005, as amended):

- **Damage of 1 to 3,** of the Injury Type of its source: Crush for a blow or a hard knock, Cut for an edge, Pierce for a point, and Burn for fire. It follows *Losing Health* below, so it reaches a Critical Injury only at 0 current Health, as all harm that is not a Titan attack does, and that Critical Injury's Injury Location is rolled.
- **A fall,** by Chapter 4's procedure, low or high as the GM names for its height, never extreme, or low if the GM names none (Chapter 4, section 4.6; decision batch 9, 9-30).

The harm is named with the stakes and does not change once the dice are rolled. The GM states the soldier's current Health with it, so the table knows before the dice whether a failure can put the soldier Down with a Critical Injury (decision batch 9, 9-35). It is never 4 damage or more: 4 is a musket's damage, and a musket is rolled (Chapter 7, section 7.4). No ruling inflicts a Critical Injury, death, a Death Roll, a Scar, or Grief directly, names an Injury Location, a row, or a time limit, or opens or closes a care window. Harm a ruling causes outside a Titan Engagement and a Skirmish holds a care window only as any other event's harm does (section 3.5).

> **Design note (decision batch 9, 9-5; OQ-167):** Rulings may cost a soldier, and only rules heal one, so the closed tables, Down, the Death Roll, and healing time stay as written, and the bell curve ADR-0017 rests on is untouched. Damage stops at 3 because a ruling that takes a Rookie to 0 in one stroke and rolls a Critical Injury would do the musket's work without its roll. The playtest tags every harm a ruling caused, so the retune reads rules deaths and ruling deaths apart.

### Losing Health

Follow the damage `procedure`:

1. If the amount is 0, the damage inflicts no harm, whatever the soldier's current Health: Health lost does not change, and no Critical Injury is gained. Steam's 0 row (Chapter 5, section 5.7) and a fall's 0 row (Chapter 4, section 4.6) end here.
2. If current Health is above 0, add the amount to Health lost, up to Health minus the boxes crossed off.
3. If that brings current Health to 0, the soldier becomes Down (section 3.3) and gains one Critical Injury of the damage's Injury Type at once. Then check Down again.
4. If current Health was already 0, Health lost does not change, and the soldier gains one Critical Injury of the damage's Injury Type at once.

The Critical Injury's Injury Location is rolled, unless the damage's rule names one. Its Injury Type is the damage's: every rule that deals damage names one, and a fall is Crush (Chapter 4, section 4.6).

**A Critical Injury with no clean box.** A new untreated Critical Injury crosses off a clean box if one is left. If none is, it crosses off a box marked by damage instead, and Health lost falls by 1. If every box is already crossed off, it crosses off none. This keeps Health lost from ever exceeding Health minus the boxes crossed off.

**A Critical Injury that crosses off the last box** makes the soldier Down (section 3.3) and inflicts no further Critical Injury. Only damage that brings current Health to 0, or damage taken at 0, inflicts one.

Harm comes in three kinds: damage, Critical Injury, and death. Damage at 0 current Health gives another Critical Injury instead of more Health lost. A Titan attack is the harm a Behavior Table entry inflicts when a Titan's card resolves it, and it is always a Critical Injury. The Grab's lift and devour are steps of the Grab procedure, not Titan attacks (OQ-39).

### Titan attacks bypass Health

ADR-0005 has Titan attacks skip Health and inflict Critical Injuries directly (`titan_attacks`):

- **A Titan attack is the harm a Behavior Table entry inflicts on a soldier when a Titan's card resolves that behavior against them.** Every such harm is a Titan attack. It is always a Critical Injury and never damage, whatever the soldier's Health. No Behavior Table entry names death. A Titan attack is only the harm the entry itself names. Harm that another rule causes as a result, such as a fall when a soldier becomes Down while airborne (Chapter 4), is the kind that other rule names.
- Each Behavior Table entry that harms lists, in its effects, its Injury Location (fixed or rolled), its Injury Type, and whether its Critical Injury cannot be lethal (`data/titans/`; Chapter 6, section 6.1). A Titan's Bite is Bite, and every other Titan attack is Crush (`titan_attacks`, `injury_type`; decision batch 7, 7-5).
- A Titan attack is rolled: its entry's Attack Dice are rolled as Titan Dice, and the attack lands on a target on 1 or more Net Successes after that target's Reaction cancels (ADR-0019; Chapter 1, section 1.9, *Attack and Reaction*; Chapter 5, section 5.5). A roll of 0 successes whiffs against every target. A soldier who cannot make a Reaction, such as a Down soldier, cancels nothing, so the attack lands on them on 1 or more successes.
- **The Grab's crushing Critical Injury** is a torso Critical Injury of Injury Type Crush that cannot be lethal (ADR-0019). Section 3.7 explains how this chapter supports ADR-0014's Grab target.
- **The Grab countdown is not a Titan attack** (`grab_countdown`). ADR-0019 lifts a Grabbed soldier after their next turn and devours them after the turn after that. Both steps belong to the Grab procedure (Chapter 5, section 5.9) and are never Behavior Table entries. They roll no Attack Dice, and no Reaction answers them, because a Reaction answers a card that resolves a behavior (Chapter 1, section 1.9). The devour names death as its harm. Chapter 5 states what the lift does (section 5.9, `data/engagement/grab.yaml`, `countdown`).
- **Titan harm outside the Behavior Tables** (decision batch 8, 8-7 and 8-9; ADR-0005 and ADR-0019, as amended). Three harms a Titan's body deals are not Titan attacks: they roll no Attack Dice, no Reaction answers them, and they take no net success rider. **Steam**, at a Titan's death and at a Regeneration fill that restores a Body Part, is damage of Injury Type Burn, so it reaches the tables only at 0 current Health, and a steam roll that gives 0 damage inflicts no harm at all (*Losing Health*, step 1). **The falling Titan** gives a soldier in its path who fails to Leap Clear a Crush Critical Injury that cannot be lethal, and Pins them. **Corpse heat** gives a soldier Pinned under a corpse a Burn Critical Injury at the start of each of their turns, and 1 Burn damage to each soldier who Heaves the corpse (Chapter 5, section 5.7; `data/engagement/titan-harm.yaml`, `steam`, `falling_titan`).

A soldier with no Health lost can be Down, or dying, from Titan attacks alone: each Critical Injury crosses off a box, and a row can say Down or be lethal. A soldier at 0 current Health takes a Titan attack exactly as any other soldier does.

### Getting Health back

Health comes back only through the `restoring` rows:

- **Revive:** a successful Treat Injury on a Down soldier at 0 current Health whose Health lost is above 0 restores 1 Health lost per success, erasing that many damage marks (section 3.5).
- **A day passes,** including the interim day at the start of each session: every living soldier gets back all Health lost to damage (section 3.6). Crossed-off boxes stay crossed off.
- **Treating or healing a Critical Injury** gives back the box it crossed off, unless the soldier still holds at least as many untreated Critical Injuries as Health (*Crossed-off boxes*, above; sections 3.2, 3.5, and 3.6).

Treat Injury restores Health lost only to a Down soldier at 0 current Health, and all Health lost to damage comes back each time a day passes. Nothing else restores Health lost in the field (OQ-40).

## 3.2 Critical Injuries

A Critical Injury is a lasting injury tied to an Injury Location and an Injury Type (ADR-0017). Each row says whether it puts the soldier Down, whether it is lethal and how fast, its effects, and its healing time.

### Injury Types

Every rule that inflicts a Critical Injury names its **Injury Type**, and every rule that deals damage names the type a Critical Injury the damage inflicts records (`types`, `type_rules`). The GM never picks a type: damage a ruling names takes the type of its source (section 3.1, *Harm a ruling names*).

<!-- BEGIN RENDERED: injury-types from data/harm/critical-injuries.yaml -->
| Injury Type | Named by |
|---|---|
| Crush | Every Titan behavior that is not a Bite, the Grab's crush (data/engagement/grab.yaml), every fall (data/gear/falls.yaml), the falling Titan's pin (data/engagement/titan-harm.yaml, falling_titan), and a club or a fist (Chapter 7). |
| Bite | A Titan's Bite (data/titans/), and the Straggler's Critical Injury (Chapter 7). |
| Burn | Steam at a kill and at a Regeneration fill (data/engagement/titan-harm.yaml, steam), Corpse Heat on a Pinned soldier and on a soldier who Heaves a corpse (data/engagement/titan-harm.yaml, falling_titan, corpse_heat), a Bandit's firebrand (Chapter 7), and a flare fired at a person (Chapter 7). |
| Cut | A Blade Set, a sabre, or a knife (Chapter 7). |
| Pierce | A shot (Chapter 7). |
<!-- END RENDERED: injury-types -->

- **What a type does.** It picks which of the row's names the Critical Injury shows, and applies the rider its table carries for that type, if there is one (*Reading a row*). Every other field of the row is the same for every type.
- **Blast** is a delivery, not a type. A rule that names a blast inflicts two Critical Injuries, one Burn and one Crush, each at its own rolled Injury Location. No rule yet names a blast.
- **No harm to the mind** is on these tables. The Stress gains on the torso and head tables' lowest rows stay, and no lethal row gains Stress. Lasting harm to the mind comes from Part Two: Stress Responses, Fear Rolls, Scars, and Grief.

> **Design note (decision batch 7, 7-5; decision batch 8, 8-7, 8-8, and 8-15; OQ-137, OQ-138, OQ-150):** One table per Injury Location, with a name per type and a short rider block, keeps every tuned row the simulator measured and a single source for each (ADR-0012). Full tables per type would have needed well over a hundred new tuned rows before the first playtest. Bite is its own type because it is the wound Titans deal: a Bite's arm and leg 12 and 13 or more rows have a `turn` limit, because teeth take the limb and it bleeds fast. Burn ships with its sources, steam and corpse heat from Titans (Chapter 5, section 5.7) and a firebrand and a fired flare in a Skirmish (Chapter 7), and its rider makes a burn slow and hard to treat rather than fast: healing doubles, lethal rows kill by the day, and treatment needs a kit or supplies. Steam is damage so that a kill does not add a Critical Injury to the Critical Injuries band. Cut and Pierce come from a Foe's blade and shot (Chapter 7): a Cut's lethal rows bleed on a `turn` limit, and a Pierce from the 7 row up lodges, so it is harder to treat and does not heal until treated. Neither has a Titan source, so no Titan figure moves. The term is Injury Type because damage already names the harm that marks Health boxes.

### Gaining a Critical Injury

Follow `gaining` in `data/harm/critical-injuries.yaml`:

1. **Injury Location.** Use the Injury Location the harm's rule names. A rule that names arm or leg names no side, so roll D6 for it: odd is left and even is right (`sides`, `side_roll`). Otherwise roll D6 on the Injury Location table below, which gives the side of an arm or a leg.
2. **Roll.** Roll 2D6 and add **2 for each Critical Injury at that Injury Location and side that counts toward worsening** (`worsening`). Every Critical Injury the soldier holds there counts, treated or not. So does every healed one there whose row has permanent effects. A Critical Injury at the other arm or the other leg never counts; the torso and head have no side. Both arms use the arm table, and both legs the leg table. Find the row of that Injury Location's table whose `results` include the total. The bonus makes a worse row more likely, not certain: the row comes from the new total alone and is never compared with an earlier Critical Injury's row.
3. **Net success rider.** If the Critical Injury is a Titan attack's and the attack landed with more than 1 Net Success, add 1 to the total for each Net Success beyond the first, and find the row for the new total (`net_success_rider`). Against a soldier who made no Reaction, or could not make one, every success of the Titan's roll is net. No other harm takes the rider: not the Grab's crush, a fall, damage, or a Stress gain (decision batch 8, 8-2; OQ-145).
4. **Gained before.** If that row has permanent effects and the soldier has gained it before at the same side, whether it is still held or has healed, use the row its `repeat_row` names instead. A soldier loses each arm and each leg at most once, and an eye at most once.
5. **Cannot be lethal.** If the harm's rule says the Critical Injury cannot be lethal, and the row now found is lethal or instant death, use the table's `non_lethal_cap` row instead.
6. **Type rider.** If the table has a rider for the Critical Injury's Injury Type that picks the row now found (by its listed rows, all rows, or lethal rows), apply each field the rider sets, for this Critical Injury only: a `time_limit` replaces the row's, a `healing_days_multiplier` multiplies the row's healing days, `heals_untreated: false` keeps it from healing while untreated (section 3.6), and its `treat_injury` requirement or penalty applies to every Treat Injury roll on it (section 3.5) (`type_riders`; decision batch 8, 8-8 and 8-15).
7. **Record** the Critical Injury as untreated, with its side, its Injury Type, its time limit, and its healing time. It crosses off one Health box (section 3.1). Apply its effects and permanent effects, and any lost-limb grade it now gives (*Lost limbs*, below). A Stress gain on the row is gained once, now. If the row is instant death, the soldier dies instead.
8. **Check Down** (section 3.3). If the Critical Injury crossed off the last box, the soldier is Down, and no further Critical Injury follows.

Every table has an open-ended first row and last row, so every total has a row, however many Critical Injuries count toward worsening and however many Net Successes add to the roll.

The rider is where a lucky Titan roll shows. A Bite whose Titan Dice score 5 successes against a dodge of 1 success lands with 4 Net Successes and adds 3 to its 2D6, on top of any worsening, so even a soldier's first Critical Injury at that location can reach the lethal and instant-death rows. A control entry's Critical Injury still cannot be lethal: step 5 caps the row whatever the total.

The Injury Location roll weights arm and leg twice as heavily as torso and head, and splits each limb evenly between left and right. Sides are tracked: an arm or leg Critical Injury is held at its side, and worsening counts only that side (decision batch 7, 7-4; OQ-137, which revises OQ-41).

<!-- BEGIN RENDERED: injury-location from data/harm/critical-injuries.yaml -->
| D6 | Injury Location |
|---|---|
| 1 or less | left arm |
| 2 | right arm |
| 3 | left leg |
| 4 | right leg |
| 5 | torso |
| 6 or more | head |

**Side, when a rule names arm or leg without one (D6):** odd, left; even, right.
<!-- END RENDERED: injury-location -->

### Reading a row

| Field | Meaning |
|---|---|
| `results` | The 2D6 totals the row covers, after worsening. |
| `names` | One name per Injury Type. A Critical Injury shows its own type's name; the row id, not a name, identifies the row. |
| `down` | `false`, or `until_treated`: the soldier is Down while this Critical Injury is untreated. |
| `lethal`, `time_limit` | Whether it can kill, and how fast (`turn`, `engagement`, or `day`; section 3.4). |
| `death_roll_penalty` | Base dice removed from each Death Roll made for this Critical Injury. |
| `instant_death` | The soldier dies at once. |
| `effects` | Effects from `data/harm/effect-types.yaml` that apply while the Critical Injury is held and end when it heals. |
| `healing_days` | Days until it heals (section 3.6). |
| `permanent_effects` | Effects that apply from the moment the Critical Injury is gained and stay after it heals, for as long as the soldier lives. |
| `repeat_row` | On a row with permanent effects: the row used instead if the soldier has gained this row before at the same side. |

**Type riders.** Below each table, its type riders name the rows a type changes and what each rider does (`type_riders`). One line per type:

- **Bite** (arm and leg tables): the 12 and 13 or more rows have a `turn` limit (decision batch 7, 7-5).
- **Burn** (every table): healing days doubled, and Treat Injury only with a medical kit or medical supplies (section 3.5); every lethal row has a `day` limit (decision batch 8, 8-8).
- **Cut** (every table): every lethal row with an `engagement` limit has a `turn` limit, so the Death Roll comes at the end of each of the soldier's turns until it is treated (decision batch 8, 8-15).
- **Pierce** (every table): every row from 7 up that is not instant death takes a 1-die penalty on Treat Injury (section 3.5) and does not heal while untreated (section 3.6) (decision batch 8, 8-15).

Each table runs from light injuries at low totals to lethal and fatal ones at high totals. Instant death appears only at totals that 2D6 alone cannot reach, so a soldier's first Critical Injury at that Injury Location kills them outright only when the net success rider lifts the total (decision batch 8, 8-2).

### The four Injury Location tables

The arm table serves both arms, and the leg table both legs. Each row's second cell gives its name for every Injury Type.

<!-- BEGIN RENDERED: critical-injuries arm from data/harm/critical-injuries.yaml -->
**Arm** (2D6 + 2 for each Critical Injury at that arm, on the same side, that counts toward worsening; a Critical Injury that cannot be lethal uses the 8–9 row in place of a lethal or instant-death row)

| 2D6 total | Critical Injury, by Injury Type | Down | Lethal | Death Roll penalty | Effects while held | Healing days | Permanent effects | If gained before at that side, use |
|---|---|---|---|---|---|---|---|---|
| 4 or less | Crush: Wrenched Shoulder<br>Bite: Teeth-Raked Shoulder<br>Burn: Scalded Shoulder<br>Cut: Nicked Shoulder<br>Pierce: Grazed Shoulder | no | no | 0 | 1-die penalty on Break Free | 2 | none | none |
| 5–6 | Crush: Battered Forearm<br>Bite: Tooth-Torn Forearm<br>Burn: Blistered Forearm<br>Cut: Gashed Forearm<br>Pierce: Clipped Forearm | no | no | 0 | 1-die penalty on Nape strike, Body Part strike | 4 | none | none |
| 7 | Crush: Dislocated Elbow<br>Bite: Elbow Wrenched in the Jaws<br>Burn: Seared Elbow<br>Cut: Tendon Nicked at the Elbow<br>Pierce: Ball Lodged in the Elbow | no | no | 0 | 1-die penalty on Nape strike, Body Part strike, Break Free, Treat Injury, Field Repair | 7 | none | none |
| 8–9 | Crush: Fractured Arm<br>Bite: Bone Cracked in the Jaws<br>Burn: Arm Burned Raw<br>Cut: Forearm Split Open<br>Pierce: Arm Shot Through | no | no | 0 | 2-die penalty on Nape strike, Body Part strike, Break Free | 21 | none | none |
| 10–11 | Crush: Pulped Forearm<br>Bite: Artery Torn by Teeth<br>Burn: Charred Arm<br>Cut: Artery Cut in the Arm<br>Pierce: Artery Shot in the Arm | no | yes, `engagement` limit | 0 | 1-die penalty on Nape strike, Body Part strike | 10 | none | none |
| 12 | Crush: Mangled Arm<br>Bite: Arm Half Bitten Through<br>Burn: Arm Burned to the Muscle<br>Cut: Arm Hacked to the Bone<br>Pierce: Elbow Shattered by Shot | until treated | yes, `engagement` limit | 1 | 2-die penalty on Nape strike, Body Part strike, Break Free | 28 | none | none |
| 13 or more | Crush: Lost Arm<br>Bite: Bitten Off at the Shoulder<br>Burn: Arm Burned Away<br>Cut: Arm Severed<br>Pierce: Arm Shot to Ruin | until treated | yes, `turn` limit | 1 | none | 28 | 2-die penalty on Nape strike, Body Part strike, Break Free, Treat Injury, Field Repair, Heave | the 12 row |

**Type riders.** Bite: the 12 row and the 13 or more row have a `turn` limit. Burn: every row has healing days doubled and Treat Injury only with a medical kit or medical supplies; every lethal row has a `day` limit. Cut: the 10–11 row and the 12 row have a `turn` limit. Pierce: the 7 row, the 8–9 row, the 10–11 row, the 12 row, and the 13 or more row have no healing while untreated and a 1-die penalty on Treat Injury.
<!-- END RENDERED: critical-injuries arm -->

<!-- BEGIN RENDERED: critical-injuries leg from data/harm/critical-injuries.yaml -->
**Leg** (2D6 + 2 for each Critical Injury at that leg, on the same side, that counts toward worsening; a Critical Injury that cannot be lethal uses the 8–9 row in place of a lethal or instant-death row)

| 2D6 total | Critical Injury, by Injury Type | Down | Lethal | Death Roll penalty | Effects while held | Healing days | Permanent effects | If gained before at that side, use |
|---|---|---|---|---|---|---|---|---|
| 4 or less | Crush: Twisted Ankle<br>Bite: Ankle Caught in the Teeth<br>Burn: Scalded Foot<br>Cut: Cut Heel<br>Pierce: Grazed Calf | no | no | 0 | 1-die penalty on Fly | 2 | none | none |
| 5–6 | Crush: Bruised Thigh<br>Bite: Tooth-Torn Thigh<br>Burn: Blistered Thigh<br>Cut: Gashed Thigh<br>Pierce: Clipped Thigh | no | no | 0 | 1-die penalty on Dodge | 4 | none | none |
| 7 | Crush: Wrenched Knee<br>Bite: Knee Wrenched in the Jaws<br>Burn: Seared Knee<br>Cut: Hamstring Nicked<br>Pierce: Shot Through the Calf | no | no | 0 | 1-die penalty on Fly, Ride, Dodge | 7 | none | none |
| 8–9 | Crush: Fractured Leg<br>Bite: Shin Cracked in the Jaws<br>Burn: Leg Burned Raw<br>Cut: Calf Split Open<br>Pierce: Thigh Shot Through | no | no | 0 | 2-die penalty on Fly, Ride, Dodge | 21 | none | none |
| 10–11 | Crush: Pulped Thigh<br>Bite: Thigh Artery Torn by Teeth<br>Burn: Charred Leg<br>Cut: Opened Artery<br>Pierce: Artery Shot in the Thigh | no | yes, `engagement` limit | 0 | 1-die penalty on Dodge | 10 | none | none |
| 12 | Crush: Shattered Knee<br>Bite: Leg Half Bitten Through<br>Burn: Leg Burned to the Muscle<br>Cut: Leg Hacked to the Bone<br>Pierce: Knee Shattered by Shot | until treated | yes, `engagement` limit | 1 | 2-die penalty on Fly, Ride, Dodge | 28 | none | none |
| 13 or more | Crush: Lost Leg<br>Bite: Bitten Off at the Thigh<br>Burn: Leg Burned Away<br>Cut: Leg Severed<br>Pierce: Leg Shot to Ruin | until treated | yes, `turn` limit | 1 | none | 28 | 2-die penalty on Fly, Ride, Dodge, Leap Clear | the 12 row |

**Type riders.** Bite: the 12 row and the 13 or more row have a `turn` limit. Burn: every row has healing days doubled and Treat Injury only with a medical kit or medical supplies; every lethal row has a `day` limit. Cut: the 10–11 row and the 12 row have a `turn` limit. Pierce: the 7 row, the 8–9 row, the 10–11 row, the 12 row, and the 13 or more row have no healing while untreated and a 1-die penalty on Treat Injury.
<!-- END RENDERED: critical-injuries leg -->

<!-- BEGIN RENDERED: critical-injuries torso from data/harm/critical-injuries.yaml -->
**Torso** (2D6 + 2 for each torso Critical Injury that counts toward worsening; a Critical Injury that cannot be lethal uses the 10 row in place of a lethal or instant-death row)

| 2D6 total | Critical Injury, by Injury Type | Down | Lethal | Death Roll penalty | Effects while held | Healing days | Permanent effects | If gained before at that side, use |
|---|---|---|---|---|---|---|---|---|
| 4 or less | Crush: Winded<br>Bite: Teeth Scrape the Ribs<br>Burn: Scalded Chest<br>Cut: Shallow Cut Across the Ribs<br>Pierce: Grazed Side | no | no | 0 | gain 1 Stress | 1 | none | none |
| 5–6 | Crush: Cracked Ribs<br>Bite: Ribs Cracked in the Jaws<br>Burn: Blistered Back<br>Cut: Slashed Side<br>Pierce: Shot Glances off the Ribs | no | no | 0 | 1-die penalty on Nape strike, Body Part strike, Break Free | 7 | none | none |
| 7 | Crush: Deep Bruising<br>Bite: Squeezed Between the Teeth<br>Burn: Burned Belly<br>Cut: Cut Across the Belly<br>Pierce: Shot in the Flank | no | no | 0 | 1-die penalty on Fly, Dodge, Break Free | 5 | none | none |
| 8–9 | Crush: Crushed Ribs<br>Bite: Ribs Staved In by Teeth<br>Burn: Chest Burned Raw<br>Cut: Chest Laid Open to the Ribs<br>Pierce: Rib Shattered by Shot | no | no | 0 | 2-die penalty on Nape strike, Body Part strike, Break Free | 14 | none | none |
| 10 | Crush: Caved-In Chest<br>Bite: Chest Clamped in the Teeth<br>Burn: Burns Across the Chest<br>Cut: Deep Cut Under the Collarbone<br>Pierce: Shot Beneath the Collarbone | until treated | no | 0 | 1-die penalty on Fly, Dodge, Break Free | 21 | none | none |
| 11 | Crush: Punctured Lung<br>Bite: Teeth in the Lung<br>Burn: Scorched Lungs<br>Cut: Stabbed Lung<br>Pierce: Shot Through the Lung | no | yes, `engagement` limit | 0 | 1-die penalty on Fly, Dodge | 14 | none | none |
| 12 | Crush: Internal Bleeding<br>Bite: Belly Torn by Teeth<br>Burn: Burned Through the Belly<br>Cut: Gut Wound<br>Pierce: Shot in the Gut | until treated | yes, `turn` limit | 1 | 1-die penalty on Fly, Dodge, Break Free | 21 | none | none |
| 13–14 | Crush: Ribcage Burst<br>Bite: Torn Open by Teeth<br>Burn: Chest Burned Open<br>Cut: Opened from Hip to Ribs<br>Pierce: Chest Shot Through | until treated | yes, `turn` limit | 2 | 2-die penalty on Fly, Dodge, Break Free | 28 | none | none |
| 15 or more | Crush: Crushed<br>Bite: Bitten in Half<br>Burn: Burned Alive<br>Cut: Cut Down<br>Pierce: Shot Through the Heart | not applicable | instant death | not applicable | not applicable | not applicable | not applicable | not applicable |

**Type riders.** Burn: every row has healing days doubled and Treat Injury only with a medical kit or medical supplies; every lethal row has a `day` limit. Cut: the 11 row has a `turn` limit. Pierce: the 7 row, the 8–9 row, the 10 row, the 11 row, the 12 row, and the 13–14 row have no healing while untreated and a 1-die penalty on Treat Injury.
<!-- END RENDERED: critical-injuries torso -->

<!-- BEGIN RENDERED: critical-injuries head from data/harm/critical-injuries.yaml -->
**Head** (2D6 + 2 for each head Critical Injury that counts toward worsening; a Critical Injury that cannot be lethal uses the 8–9 row in place of a lethal or instant-death row)

| 2D6 total | Critical Injury, by Injury Type | Down | Lethal | Death Roll penalty | Effects while held | Healing days | Permanent effects | If gained before at that side, use |
|---|---|---|---|---|---|---|---|---|
| 4 or less | Crush: Dazed<br>Bite: Teeth Graze the Scalp<br>Burn: Scalded Face<br>Cut: Cut Brow<br>Pierce: Grazed Temple | no | no | 0 | gain 1 Stress; 1-die penalty on Read | 1 | none | none |
| 5–6 | Crush: Ringing Blow<br>Bite: Scalp Torn by Teeth<br>Burn: Blistered Scalp<br>Cut: Split Scalp<br>Pierce: Shot Along the Skull | no | no | 0 | 1-die penalty on Read, Break Attention | 3 | none | none |
| 7 | Crush: Concussion<br>Bite: Head Shaken in the Jaws<br>Burn: Burned Face<br>Cut: Cut Across the Forehead<br>Pierce: Ball Glances off the Skull | no | no | 0 | 1-die penalty on Read, Break Attention, Treat Injury, Field Repair, Fly | 7 | none | none |
| 8–9 | Crush: Head Blow<br>Bite: Skull Squeezed in the Teeth<br>Burn: Face Burned Raw<br>Cut: Scalp Laid Open<br>Pierce: Stunned by a Ball to the Head | until treated | no | 0 | 1-die penalty on Read, Break Attention | 5 | none | none |
| 10–11 | Crush: Fractured Skull<br>Bite: Skull Cracked by Teeth<br>Burn: Skull Burned to the Bone<br>Cut: Skull Split by a Blade<br>Pierce: Ball in the Skull | until treated | yes, `engagement` limit | 0 | 1-die penalty on Read, Break Attention, Fly | 21 | none | none |
| 12 | Crush: Bleeding Inside the Skull<br>Bite: Jaws Close on the Head<br>Burn: Burned Through the Temple<br>Cut: Neck Slashed<br>Pierce: Shot in the Neck | until treated | yes, `turn` limit | 1 | 1-die penalty on Read, Break Attention, Fly | 28 | none | none |
| 13–14 | Crush: Lost Eye<br>Bite: Face Torn Away at the Eye<br>Burn: Eye Burned Out<br>Cut: Eye Cut Out<br>Pierce: Eye Shot Out | until treated | yes, `engagement` limit | 0 | none | 28 | 1-die penalty on Read, Break Attention, Nape strike | the 10–11 row |
| 15 or more | Crush: Crushed Skull<br>Bite: Head Bitten Off<br>Burn: Face Burned Away<br>Cut: Head Split Open<br>Pierce: Shot Through the Head | not applicable | instant death | not applicable | not applicable | not applicable | not applicable | not applicable |

**Type riders.** Burn: every row has healing days doubled and Treat Injury only with a medical kit or medical supplies; every lethal row has a `day` limit. Cut: the 10–11 row and the 13–14 row have a `turn` limit. Pierce: the 7 row, the 8–9 row, the 10–11 row, the 12 row, and the 13–14 row have no healing while untreated and a 1-die penalty on Treat Injury.
<!-- END RENDERED: critical-injuries head -->

### Holding and treating

- A soldier **holds** a Critical Injury from when it is gained until it heals. Held Critical Injuries count toward worsening, treated or not. A healed Critical Injury whose row has permanent effects keeps counting (section 3.6).
- **Sides** (`held_injuries`, `sides`). A Critical Injury at an arm or a leg is held at its side, and one at the torso or head has no side. A row with permanent effects at an arm or a leg is gained at most once per side; the head's is gained at most once. Losing a limb is graded (*Lost limbs*, below).
- A Critical Injury becomes **treated** when a Treat Injury roll succeeds on it (section 3.5). Treating it never removes its effects or permanent effects, and a treated Critical Injury keeps its healing time and still counts toward worsening. Treating does three things: it stabilizes a lethal Critical Injury, it ends a `down: until_treated` row's hold on the soldier, and it gives back the Health box the Critical Injury crossed off, unless the soldier still holds at least as many untreated Critical Injuries as Health (section 3.1).
- **Effects stack.** Penalties from several Critical Injuries, and from lasting Stress Responses and Scars, add up. As with every penalty, they never take a pool below 1 base die and never remove Gear Dice or Stress Dice (Chapter 1, section 1.3, step 5).
- No Critical Injury damages or removes gear. Chapter 4 owns gear damage.

> **Design note (OQ-42):** The table shape is made of these parts:
>
> - 2D6 plus 2 per Critical Injury counting toward worsening at the same Injury Location.
> - The rows and their effects, and a non-lethal cap row on every table.
> - Instant death only at totals a first Critical Injury cannot reach.
> - Permanent effects on the worst arm, leg, and head rows. They apply from the moment the row is gained, and each of those rows can be gained once per side at an arm or a leg, and once at the head.
>
> The rows are the starting values for the ADR-0014 simulator. From the current rows, a soldier's first Critical Injury at a rolled Injury Location is lethal 15.3% of the time and puts them Down 10.6% of the time, whatever its Injury Type: sides keep every location's weight, and the Bite rider changes only a time limit. A torso Critical Injury is lethal 8.3% of the time with none held there, 27.8% with one, and 50.0% with two; with two it is also instant death 8.3% of the time. A head Critical Injury puts the soldier Down 41.7% of the time with none held there; with two held it is lethal 63.9% and instant death 8.3% of the time. The torso and head have no side, so those figures are unchanged by decision batch 7.
>
> **Worsening at a limb reads per side** (decision batch 7, 7-4). An arm Critical Injury is lethal 16.7% of the time with none held at that arm, and 41.7% with one held at that same arm; one held at the other arm does not count. The leg reads the same way. Every worsening figure below that involves an arm or a leg counts only Critical Injuries at the same side.
>
> **Injuries before Down.** With untreated Titan-attack Critical Injuries at rolled Injury Locations, worsening counted per side, and a death counted as Down, the first puts a soldier Down 10.6% of the time whatever their Health, through Down rows. After that, Health decides. Health now runs 4 to 8 (section 2.2), so the rows that matter are these. A Health 4 soldier, the lowest a soldier can have, is Down by the third 35.3% of the time and by the fourth always (mean 3.31). A Health 5 soldier is Down by the third 35.3% of the time and by the fourth 48.0% (mean 3.83). A Health 6 soldier, which is the Rookie, the Veteran, and every Free Build with a 4 on Strength and Agility, is Down by the third 35.3% of the time, by the fourth 48.0%, by the fifth 59.9%, and by the sixth always (mean 4.24; OQ-71). These are exact figures at those three Health values and are unchanged by decision batch 13, which moved which builds reach them and not the arithmetic. The Health 7 and Health 8 rows, which only the Lifepath reaches, are measured in the rerun that batch 13 schedules; the Health 2 and Health 3 rows this note carried before (means 1.89 and 2.67) describe Health values no soldier can now have. Before sides the 35.3%, 48.0%, and 59.9% figures read 39.6%, 55.5%, and 70.0%, with means of 2.65, 3.25, 3.70, and 3.99: a later limb injury now lands on the side already hurt, and worsens, half as often.
>
> **Reference builds (OQ-58, OQ-70, OQ-71).** ADR-0014, as amended, names each reference build's attributes, and so its Health. Strength is the key attribute of all three, because the solo Nape-strike and Grab targets are Strength rolls. The Rookie has the Slayer Squadmate template's attributes, Strength 4, Agility 3, Wits 2, and 3 elsewhere, with Health 6 and Resolve 3. It has Talent 1 in the Talent that names the Nape strike, the Body Part strike, Break Free, or Treat Injury (decision batch 2b), and the Veteran's Talent 2 and the Levi-grade soldier's Talent 3 apply to the same rolls. No other roll a target measures carries Talent dice, including the dodge, Fly, Break Attention, Ride, and Read, so the Death Roll and Rally carry none in a target's baseline, and Hard to Kill stays a simulator check (OQ-94). It is not the Slayer template itself, whose one Talent names only the Nape strike. It is the victim in the lone Grab model of Chapter 5 (section 5.13, `data/engagement/tuning.yaml`, `grab`), whose figures section 3.7 quotes. The Veteran is Strength 5, Agility 3, Wits 2, and 3 elsewhere (19 points, a Top 10 Rookie with two Scars), with Health 6 and Resolve 5 from its two Scars. The Levi-grade soldier is Strength 6, Agility 4, and 4 elsewhere, with Health 7 and Resolve 4, deliberately above any buildable total. The targets are measured on these builds.
>
> The targets that depend on Health are the Expedition PC Critical Injury and PC death targets and a Grab on a victim already carrying untreated Critical Injuries. Each is also reported, not tuned, for the reference Squad with each soldier's Health set to 5, one below the Rookie's, and nothing else changed, so the report isolates Health, and this chapter's Health 4, 7, and 8 figures are reported beside them (ADR-0014, as amended in decision batch 13, 13-2). The Talent-dependent targets (the lone Grab, the rescue cells in section 3.7, and the prepared-Squad kill) are also reported, not tuned, for a Squad built literally from the Squadmate templates; with the Slayer template's Talents the lone Grab kills about 69% of the time. The dodge is also reported, not tuned, for the Flier template alone (Agility 4, Slip Away 1, ODM Gear 2, Stress 1, Pushing when short): it met a fixed need of 3 dodge successes 38.0% of the time and a need of 2 66.6% (decision batch 2b), measured before Attack Dice replaced those needs (decision batch 8, 8-1), and the rerun reports it again under Attack Dice. A Squad drawn from the nine templates in equal shares now sits between Health 5 and Health 6 (five templates at 5 and four at 6), and its mean of untreated Critical Injuries before Down is measured in the rerun; at the Health 3 and 4 the templates carried before, it was 2.95 per side (2.92 before sides). Every figure in this chapter that depends on Health names the Health it assumes.
>
> **Lethal is not the same as fatal.** Of the 15.3 points of lethal first results, 14.4 have an `engagement` limit for a Crush Critical Injury, so whether they kill depends on treatment during the fight and at its end (section 3.16); under their riders a Cut's lethal rows read `turn` and a Burn's `day`, and neither type comes from a Titan attack. A Bite's arm and leg 12 rows have a `turn` limit, which would leave 12.5 of those points at a rolled Injury Location; no Chapter 6 Bite rolls its location. Across first Crush Critical Injuries at a rolled Injury Location, as every rolled Titan attack in Chapter 6 is, `engagement` rows kill a Strength 3 soldier at the end of the fight about 8.5% of the time with no treatment, 3.4% with one aftermath roll by a Wits 2 treater without a medical kit, and 0.9% with one by a Rookie Medic. With no treatment a Strength 4 soldier dies on 7.1%. If the "PC dies every 3 to 4 missions" target comes out low, the first lever is moving the 11 and 12 results at arm and leg from `engagement` to `turn` limits.

### Lost limbs

Losing an arm or a leg is graded (`lost_limb_riders`). A side is lost when the soldier gains the 13 or more row of the arm or leg table there. It stays lost after that Critical Injury heals, and a later roll of that row at the same side uses its repeat row, so the same limb is never lost twice. A grade applies from the moment the soldier meets it, for as long as they live, on top of the row's own permanent effects, which still add up with every other penalty. A soldier who loses the second arm moves from the one-arm grade to the both-arms grade, and the same holds for legs. The rows' own penalties stack per side: two lost legs dodge, Fly, and Ride at a 4-die penalty, and two lost arms strike at 4 (`held_injuries`, `stacking`; decision batch 8, 8-11).

<!-- BEGIN RENDERED: lost-limbs from data/harm/critical-injuries.yaml -->
| Grade | Penalties it adds | Cannot take | Moves | Keeps |
|---|---|---|---|---|
| One arm lost: the arm table's 13 or more row, gained at one side | 1-die penalty on Fly, Fight, Block | nothing | unchanged | Everything else: Ride, the dodge, Read, Rally, Break Attention, Draw Attention, Help, and command from the saddle. |
| Both arms lost: the arm table's 13 or more row, gained at both sides | no Gear Dice from ODM Gear on Dodge, Leap Clear | Nape strike, Body Part strike, Break Free, Fly, Field Repair, Treat Injury, Lift Comrade, Heave, Pass Item, Take Item, Swap Blade Set, Change Canister, Restock Medical Kit, Fight, Block, Shoot, Reload, the Feint decoy, the Flare decoy, the Thrown cloak decoy | ODM moves cannot be made; Mount or Dismount only with a comrade's help | Shed Load; Mount or Dismount with a comrade's help, and Ride while mounted; the dodge and Leap Clear, with the horse's Gear Dice while mounted; the riderless-horse decoy; Read; Call It; Rally; Draw Attention; Help; Cover; and Swap Initiative Card. |
| One leg lost: the leg table's 13 or more row, gained at one side | none | nothing | moves on foot also spend the action | Everything else, flight included. |
| Both legs lost: the leg table's 13 or more row, gained at both sides | none | Fly, Ride, Lift Comrade | moves on foot cannot be made; mounted moves cannot be made; ODM moves cannot be made | The dodge and Leap Clear, with the rows' penalties, which stack; Heave; a strike at a Titan at In Reach; Read; Rally; Break Attention; Draw Attention; Treat Injury; Field Repair; and being carried by Lift Comrade, at their consent (data/gear/carrying.yaml, lifting_a_comrade). They travel across a comrade's saddle or in the wagon. |

**Prosthetics (Prosthetic arm and Prosthetic leg).** A prosthetic of a kind is fitted to one side the soldier has lost at that kind's 13 or more row, at most one per side, during a Downtime once the Critical Injury that lost that side has healed (data/harm/healing.yaml; Chapter 7, section 7.2). Fitting needs no roll and spends nothing. It stays fitted for as long as the soldier lives, and the sheet records it (data/harm/sheet-fields.yaml, prosthetics). A grade's sides_lost is compared with the soldier's sides lost at its row less the prosthetics of that kind fitted. So one lost arm with a prosthetic meets no arm grade, and both arms lost with one prosthetic meet the one-arm grade. Two prosthetics of a kind never lower the grade past the one-limb grade: a soldier who has lost both sides of a kind and has two prosthetics of that kind fitted meets that kind's one-limb grade. The 13 or more row's own permanent_effects stay at every side lost, prosthetic or not, and stack (held_injuries, stacking). A prosthetic gives no dice to any roll, is never a weapon, and cannot be obtained before the loss at that side has healed (Chapter 7, section 7.3).
<!-- END RENDERED: lost-limbs -->

- **Cannot take:** the soldier cannot take, make, or use the entry, and nothing that needs its roll can be done, such as a Position change that needs a Fly roll (`forbids-entries` in `data/harm/effect-types.yaml`). A named decoy cannot be named for Break Attention.
- **Moves that also spend the action** do so as an Overloaded soldier's ODM moves do (Chapter 4, section 4.7): the move cannot be made if the action is already spent. Outside a Titan Engagement this has no effect unless the rule for the procedure under way says so.
- **Moves that cannot be made:** the soldier holds the Position they are placed at.
- **No Gear Dice from an item:** the entry is still rolled, with Gear Dice from any other item it allows. A soldier with both arms lost takes the horse's Gear Dice on the dodge while mounted, and none from ODM Gear, because the grade forbids ODM use (decision batch 8, 8-11). Leap Clear takes none from ODM Gear either, and Heave is forbidden, since a Heave raises a Titan's body with the hands (decision batch 8, 8-23; OQ-159). The lost-arm row's penalty list includes Heave and the lost-leg row's includes Leap Clear, so a soldier with both legs lost leaps clear at a 4-die penalty, as they dodge.
- **Mount or Dismount only with a comrade's help** (`mount_values`): in a Titan Engagement a comrade who holds the soldier's Position and is not Down spends their action to help; in a Skirmish a comrade taking part who is not Down spends their action; anywhere else a comrade in the Squad who is not Down, on the same Expedition or in the Squad when no Expedition is under way, helps, spending nothing. Without that help there is no mount or dismount (`mount_with_help`; decision batch 8, 8-11 and 8-25; OQ-161).
- **Carried:** a soldier the both-legs grade forbids to move may be lifted and carried by Lift Comrade, at their consent, and keeps their action for entries that need no move (Chapter 4, section 4.7; decision batch 8, 8-11). A Pinned soldier is never lifted (decision batch 8, 8-18).
- **Medical Retirement:** a soldier who has lost both arms or both legs may retire at the player's choice, and the choice is offered again at the end of every Downtime while the loss stands (section 3.13).

**Prosthetics** (`prosthetics`; decision batch 8, 8-10; OQ-147). A prosthetic arm or leg is a gear item (Chapter 4, section 4.1), obtained by Requisition at Limited Scarcity (Chapter 7, section 7.3), one per Requisition; a player character may obtain one for a Squadmate. It is fitted to one lost side during a Downtime, once the Critical Injury that lost that side has healed (28 days, or 56 for a Burn). The line under the table gives what a fitted one does.

> **Design note (decision batch 7, 7-6; OQ-137):** One limb lost makes a soldier's work harder, and both is severe. One arm keeps a commander in the saddle and out of the air by penalty, not by ban; both arms is the ban the ODM handles demand. One leg makes the ground slow without ending flight; both legs end movement, because ODM landings and running need legs, while the hands can still cut a Titan that comes to them. The list of entries both arms forbid is every Action Catalog entry whose requirements name ODM Gear, a Blade Set, a firearm, or handling an item or a comrade. No measured build loses a limb, and no row's Down or lethal field changed, so no figure moves. Decision batch 8 (8-10, 8-11): the rows' penalties stack as every penalty does; the both-arms list forbids the thrown cloak and keeps a helped mount, the riderless horse, and a shrug of the straps, because hands are what the grade removes; and a prosthetic lowers the grade one step, because 845 to 850 has hooks and peg legs and nothing that works an ODM trigger, so two stop at the one-limb grade and none removes a row's own penalty. A Heave raises a Titan's body with the hands, so both arms forbid it and a lost arm penalizes it, and Leap Clear is the fall's dodge, so a lost leg penalizes it as it does the dodge (8-23). Lost limbs and prosthetics are unmeasured (8-13).

## 3.3 Down

A Down soldier can do little more than crawl. `data/harm/down.yaml` holds the whole rule.

### Becoming Down

A soldier is Down while at least one of these `conditions` is true:

1. **0 current Health.** Their current Health is 0 (section 3.1), whether from damage, from untreated Critical Injuries crossing off every box, or both. Damage that brings current Health to 0 gives one Critical Injury (section 3.1). A Critical Injury that crosses off the last box gives none, and this condition never gives a further one.
2. **A Down row.** They hold an untreated Critical Injury whose row says `down: until_treated`.

Check these whenever Health lost changes, a Critical Injury is gained or heals, or a Critical Injury becomes treated.

### What a Down soldier can do

- **Turns still happen.** Each turn has its move and no action. A Down soldier's turn still counts as a turn for every rule that counts turns, such as a `turn` time limit or a Grab (Chapter 5, section 5.9).
- **Moving.** A Down soldier's move can make only the change Chapter 5 allows (section 5.2, `data/engagement/positions.yaml`, `moves`, `down_soldier`).
- **Death Rolls.** A Down soldier makes Death Rolls (section 3.4).
- **Being helped.** A Down soldier can be the patient of Treat Injury, the target of Rally, and lifted with Lift Comrade (Chapters 4 and 5).
- Stress, lasting Stress Responses, Grief, Scars, and a Grabbed state all stay as they are. A Down soldier can still gain Stress, Critical Injuries, Scars, and Grief from any rule that names them.

### What a Down soldier cannot do

- **Take any action.** That includes Help (Chapter 1, section 1.8) and every Action Catalog entry whose kind is `action`. See *Down and this round's turns* for the action of a turn that has already begun.
- **Push, Help, Cover, or make a Reaction.** Down's own row names all four (`forbids: [push, help, cover, reaction]` in `data/harm/down.yaml`), which is Chapter 1's shared hook for a state that forbids them (section 1.9). Chapter 1's core requirements also exclude a Down helper and a Down Coverer (sections 1.5 and 1.8). A behavior a Down soldier cannot react to lands (ADR-0019).
- **Make any attribute roll except a Death Roll.** So a Down soldier never Pushes, never rolls Stress Dice, and never suffers a Stress Response while Down. Their Death Rolls cannot be Helped or Covered in any case, so whether a Down roller can be Helped never arises.
- **Make a Fear Roll** (section 3.12).

A Grabbed soldier who becomes Down stays Grabbed and cannot take Break Free, because it is an action. A comrade can still free them, for example with a Body Part strike on the hand or with Pry Loose (Chapter 5, section 5.9, `data/engagement/grab.yaml`, `escapes`).

### Ending Down

Down ends at once when current Health is above 0 and the soldier holds no untreated Critical Injury whose row says `down: until_treated` (`ending`). Only these can bring that about:

- **Treating or healing a Critical Injury** gives back its box if the soldier then holds fewer untreated Critical Injuries than Health (sections 3.1, 3.5, and 3.6), and ends a `down: until_treated` row's hold if it is that row.
- **A revive** erases damage marks (section 3.5).
- **A day passing** erases all damage marks (section 3.6).

Nothing else ends Down.

### Down and this round's turns

Becoming Down or ending Down never spends or restores a turn by itself (`becoming_down_mid_round`, `after_ending`):

- **Becoming Down after this round's turn has begun or ended:** the soldier loses any action of that turn they still hold, even if Down ends before the round does. That action counts as spent for every rule that asks, such as which turn a Reaction spends (Chapter 1, section 1.9).
- **Becoming Down before this round's turn comes up:** nothing is taken from that turn. If Down has ended by the time it comes up, it has its move and action.
- **A turn that begins while the soldier is Down** has its move, and its action counts as spent for every rule that asks, such as whether the soldier can Help or which turn a Reaction spends. The action stays spent if Down ends during or after that turn. A turn that has not yet begun keeps its action.
- **Ending Down restores nothing already spent.** A turn or action that a Reaction or a result has spent stays spent, and a future turn already spent in full stays wholly spent (section 3.9).

> **Design note (OQ-45):** Down has exactly two conditions under Health boxes (ADR-0005, as amended): 0 current Health and a Down row. A soldier's frame therefore decides how many untreated Critical Injuries they carry before they drop. A Down soldier's turn has only a move, which Chapter 5 must allow before it changes anything (section 5.2). Becoming Down takes the unused action of a turn already begun or ended this round, but not of a turn still to come, and ending Down restores nothing already spent. A Down soldier cannot Push, Help, Cover, make a Reaction, or make a Fear Roll, and makes no attribute roll but the Death Roll, so Down never needs a rule that removes Stress Dice from a roll.

## 3.4 Lethal Critical Injuries and Death Rolls

`data/harm/death-rolls.yaml` holds the time limits, the Death Roll, its outcomes, and what dying does.

### Time limits

A lethal Critical Injury has one of three time limits, listed fastest first. "Slows one step" moves it to the next:

- **`turn`:** runs out at the end of each of the soldier's turns in a Titan Engagement or a Skirmish (Chapter 7, section 7.4; decision batch 8, 8-15). The first one is the soldier's first turn that begins after the Critical Injury was gained. These turns all count:
  - turns spent in advance;
  - turns spent by a result;
  - a Down soldier's turns;
  - the turns of a soldier who has left the Titan Engagement while it goes on (section 3.16).

  When the Titan Engagement or the Skirmish ends, a `turn` limit becomes `engagement` (section 3.16).
- **`engagement`:** runs out once, when the Titan Engagement or the Skirmish in which it was gained ends, after that end's aftermath rolls and before its care window (section 3.16). Only treatment during the fight or a successful aftermath roll prevents that Death Roll.
- **`day`:** runs out each time a day passes, after that day's care window, or, on a day in Downtime, after that day's infirmary roll (section 3.6; Chapter 7, section 7.2).
- Past `day` is **stabilized**: the Critical Injury is no longer lethal and never causes a Death Roll again.

**Outside a Titan Engagement and a Skirmish,** there are no turns. A Critical Injury gained there with a `turn` or `engagement` limit runs out once, right after the care window held for that harm (section 3.5). After a Death Roll made outside both a Titan Engagement and a Skirmish, including those made at the end steps of either (section 3.16), a `turn` or `engagement` limit that the soldier survived becomes `day`. A Death Roll made during a Skirmish, at the end of a soldier's turn, follows its outcome below, as one made during a Titan Engagement does.

### The Death Roll

A Death Roll is made each time a lethal Critical Injury's time limit runs out. It is an attribute roll for the Catalog entry `death-roll`:

- **Pool:** Strength, plus the dice of one Talent that names `death-roll` (such as Hard to Kill), minus the Critical Injury's `death_roll_penalty`.
- **Left out:** no Stress Dice, no Help, no Push, and no Circumstances (`roll_exceptions` in `data/core/dice-pool.yaml`; Chapter 1, OQ-03 and section 1.4a; decision batch 9, 9-2). The entry allows no gear, and no Bonus Dice source applies to it.
- **Needs:** 1 success.
- **One roll per Critical Injury.** If several lethal Critical Injuries run out at the same moment, the soldier's player chooses the order. The first failed roll kills the soldier, and no more are made.
- A Death Roll is not an action and spends nothing.

### Outcomes

Find the row of `outcomes` for the roll's successes:

- **0 successes:** the soldier dies.
- **1 success:** the soldier lives, and the time limit runs out again as it states. Outside both a Titan Engagement and a Skirmish, a surviving `turn` or `engagement` limit becomes `day` instead (*Time limits*).
- **2 or more successes:** the soldier lives, and the time limit slows one step. A `day` limit that slows is stabilized.

### Dying

A soldier dies from a failed Death Roll, an `instant_death` row, or any rule that names death, such as the Grab's devour step (Chapter 5, section 5.9). A dead soldier leaves play and holds no Position.

- A dead player character is replaced by promotion or a new character when the procedure in which the death happened ends (Chapter 2, section 2.10). Several promotions due together use Chapter 2's contest (OQ-31, OQ-38).
- A dead Squadmate leaves the Squad Pool.
- Every Drive that named the dead soldier can never trigger again (Chapter 2, section 2.5).
- The death is the `comrade-dies` Fear Roll trigger (section 3.12) and gives Grief (section 3.14).
- Chapter 4 states what happens to the dead soldier's gear (`leaving_play` in `data/gear/carrying.yaml`).

> **Design note (OQ-43):** "Two or more successes slows the limit" gives a soldier with no medic a way to live, and gives Hard to Kill a use beyond staying alive one more turn. A Death Roll with no penalty succeeds 42.1% of the time with 3 dice, 51.8% with 4, and 59.8% with 5. It slows the limit 7.4%, 13.2%, and 19.6% of the time. A soldier with Strength 4 and a `turn` Critical Injury with a Death Roll penalty of 1, whom nobody treats, is alive after their first turn 42.1% of the time and after their third 15.1%.

## 3.5 Treat Injury

Treat Injury is the Wits action `treat-injury` (Chapter 2). It uses a medical kit for Gear Dice, and without one it rolls Wits alone (`gear_requirement`). `data/harm/treat-injury.yaml` gives the procedure.

### Uses

The treater declares one use and one patient before rolling. It needs 1 success.

- **Revive:** the patient is Down at 0 current Health, and their Health lost is above 0. On a success, restore 1 Health lost per success, up to the patient's Health lost, erasing that many damage marks. Crossed-off boxes do not come back. If a `down: until_treated` row still holds the patient, Down goes on, and the roll still counts as that treater's roll.
- **Treat:** the patient holds an untreated Critical Injury, and the treater names one. On a success, it becomes treated and gives back the Health box it crossed off, unless the patient still holds at least as many untreated Critical Injuries as Health (section 3.1). A lethal Critical Injury is also stabilized: it is no longer lethal and has no time limit.

Treat and revive are separate uses, and the players choose which one a roll makes. When damage brought a soldier to 0 and the Critical Injury it gave crossed off a box marked by damage (section 3.1), one success on a revive raises current Health to 1 and ends Down, unless a Down row holds them.

On a failure nothing happens.

**Circumstances.** Treat Injury takes the Circumstances the GM names, as any attribute roll does (`circumstances` in `data/harm/treat-injury.yaml`; Chapter 1, section 1.4a; decision batch 9, 9-2). Field surgery in driving rain or by a guttering lantern might be Hard; if the GM names no step, it is Standard. A minus step adds up with the self-treatment penalty and a Pierce's penalty, and no step changes the 1 success the roll needs. In a Titan Engagement, Standard is the default, and the GM names another step only for something no rule already prices (Chapter 5).

**Type riders on treatment** (`type_riders` in `data/harm/treat-injury.yaml`; decision batch 8, 8-8 and 8-15):

- **A Burn** is treated only by a treater who has a medical kit that counts as had, or who spends 1 medical unit on the roll. Without either the roll is not made: Wits alone is not allowed. The only medical unit spent on a roll is the care-bonus use in a care window, which also gives its Bonus Die, so in a Titan Engagement or a Skirmish only a kit that counts as had meets the requirement, and in a care window a kit or that spend. The aftermath roll never reaches a Burn, since every lethal Burn row has a `day` limit (decision batch 8, 8-24; OQ-160).
- **A Pierce** from the 7 row up takes a 1-die penalty on every treat use on it, in a fight, as an aftermath roll, and in a care window, added to the self-treatment penalty when the patient treats themselves.

### Patients

- Any other living soldier, player character or Squadmate.
- **Self:** a soldier may use treat on their own Critical Injury, with a penalty of 2 base dice. A soldier can never revive themselves, because a Down soldier takes no action and makes no roll but the Death Roll.
- **In a care window,** the patient must also be a living soldier in that window's scope (see *Care windows*).

### In a Titan Engagement

- Treat Injury is an action. The patient must be in the treater's zone (Chapter 5, section 5.2; `data/engagement/zones.yaml`, `between_soldiers`). Two soldiers who have both left the Titan Engagement while it goes on count as holding the same Position, including for Help and Covering on the roll (section 3.16).
- It can be Helped (Chapter 1, section 1.8), Pushed, and Covered (section 1.5). Sure Hands allows a second Push.
- A failed use can be tried again on a later turn.

### Care windows

Outside a Titan Engagement, Treat Injury is rolled only in a **care window** (`care_windows`), as an **aftermath roll** when a Titan Engagement or a Skirmish ends (see *Aftermath rolls*), or as an action in a Skirmish, used as in a Titan Engagement with no Position requirement (`in_skirmish`; Chapter 7, section 7.4). Each window has a **scope**, the soldiers who take part in it. A care window is held:

- **When a Titan Engagement ends,** after its Death Rolls (section 3.16). Its scope is every soldier in the Squad who held a Position at any point during that Titan Engagement.
- **After an event outside both a Titan Engagement and a Skirmish that makes a soldier Down or gives a soldier a lethal Critical Injury** with a `turn` or `engagement` limit.
  - Harm during a Titan Engagement or a Skirmish never holds this window. Harm in a Skirmish is treated by the Treat Injury action, by aftermath rolls, and in the window held when the Skirmish ends.
  - One window is held per event, however many soldiers it harms. It is held as soon as the event has been resolved, unless the rule that caused the harm names a later point in its own procedure. The Death Rolls for those Critical Injuries follow the window.
  - Its scope is the soldiers that rule names as taking part, such as a Chase's riders. If it names none, the scope is every soldier in the Squad on the same Expedition as a harmed soldier, or every soldier in the Squad when no Expedition is under way.
  - A roll in this window may only treat a Critical Injury that the event gave, or revive a soldier that the event made Down.
- **Each time a day passes,** before `day` limits run out (section 3.6). On an Expedition a day passes at each night camp, and the window's scope is every soldier on that Expedition (Chapter 7, section 7.1). No window is held on a day that passes in Downtime. For the interim day (section 3.6) it is every soldier in the Squad (decision batch 5, OQ-130).
- **When a Skirmish ends,** after its Death Rolls (section 3.16; Chapter 7, section 7.4). Its scope is every soldier who took part.
- **Once in each Downtime,** at the infirmary, before its seven days pass (Chapter 7, section 7.2). Its scope is every soldier in the Squad.

In a care window:

- A care-window patient must be a living soldier in that window's scope. Its scope restricts patients as well as rollers, helpers, and Coverers.
- Every living soldier in the scope who is not Down may make one Treat Injury roll, for any legal use and patient within this window's scope. There is no Position requirement.
- A living soldier in the scope who is not Down, and is not the soldier rolling, qualifies to Help a roll. They may Help only if they have not yet made or Helped a roll in the window. Help is declared before the roll and spends that soldier's roll for the window. At most 3 soldiers Help one roll.
- Any soldier who qualifies to Help a roll can Cover its Push, even one who has already made or Helped a roll in the window. Covering spends nothing (Chapter 1, OQ-06).
- The players choose the order of rolls, using Chapter 2's roll-off if they disagree. Squadmates take part, directed as Chapter 2 states.
- A failed roll can be tried again only in a later care window.

### Aftermath rolls

When a Titan Engagement or a Skirmish ends, each dying soldier gets one chance at treatment before the end-of-fight Death Rolls (`aftermath_rolls`; section 3.16, step 5):

- **Patient:** a living soldier with an untreated lethal Critical Injury that has an `engagement` limit, including a `turn` limit that has just become one. The patient may be Down.
- **One roll per patient.** Each patient gets at most one aftermath roll. The players choose its treater: a living soldier who is not Down and who, when the Titan Engagement ended, was in the patient's zone, or the patient, if not Down, treating themselves with the self-treatment penalty (Chapter 5, section 5.2; decision batch 5, OQ-122; decision batch 16, 16-11). Two soldiers who had both left count as holding the same Position (section 3.16). A Skirmish has no Positions, so when a Skirmish ends every soldier who took part counts as holding the patient's Position (`in_a_skirmish`; `procedures`, `skirmish` in `data/harm/engagement-end.yaml`).
- **One roll per treater.** Each soldier makes at most one aftermath roll.
- **The roll** uses treat on one untreated lethal `engagement` Critical Injury of the patient's, chosen by the players. On a success, that Critical Injury becomes treated and stabilized and gives back its Health box as treat does (*Uses*), which can end the patient's Down before the Death Rolls (section 3.3).
- **A failure uses up the patient's attempt.** No other treater, and no other Critical Injury of the same patient, can reopen it before the Death Rolls.
- No one can Help or Cover an aftermath roll. It can be Pushed, and Sure Hands allows a second Push. It is not a care window, so it does not use up the treater's roll in the care window that follows.
- The players choose the order of rolls, using Chapter 2's roll-off if they disagree.

> **Design note (OQ-57):** One aftermath roll per patient keeps an immediate chance to save a comrade without serial free attempts from everyone nearby. With only one roll per treater, three untrained soldiers within one step left an untreated `engagement` row fatal just 3.8% of the time, which would make treatment during the fight nearly worthless. A Squad can still gain by delaying the end of a fight, at the price of further Titan cards. A treatment probe (aftermath roll at Stress 0, one Push on 0 successes, a Strength 3 patient, no Help, Cover, Sure Hands, or further Titan cards) gives the patient's chance of dying if the fight ends now, against one more in-fight roll at Stress 1 followed by the aftermath roll:
>
> - Wits 2 treater, no medical kit: 23.2% against 7.8%.
> - Wits 2 treater, kit rated 1: 19.4% against 5.5%.
> - Rookie Medic (Wits 4, Field Medicine 1, kit rated 1): 6.4% against 0.8%.
> - Wits 2 treater two steps away, no kit: 57.9% with no eligible aftermath treater, against 23.2% when one move brings the treater within one step.
>
> The delay figures multiply independent treatment estimates and leave out the harm of the extra Titan cards.

### Talents and supplies

- **Field Medicine** adds dice, and **Sure Hands** allows a second Push.
- **Careful Nursing** halves the healing time of a comrade's Critical Injury that the soldier treats (section 3.6).
- Chapter 4 sets the medical kit, the medical Squad Supply uses (a Bonus Die on a care-window roll, which is the `medical-supplies` row of `data/core/bonus-dice-sources.yaml`, and restocking a kit), and Field Repair rolls in the care windows held when a Titan Engagement ends, when a day passes during an Expedition, or on the interim day (`data/gear/squad-supply.yaml`, `data/gear/field-repair.yaml`).

> **Design note (OQ-44):** The procedure has two uses with 1 success each, no effect on a failure, self-treatment at a 2-dice penalty, and the same Position in a Titan Engagement. Each care window has a stated scope that limits patients as well as rollers, helpers, and Coverers, so no one treats a soldier who is not taking part. A window allows one roll or one Help per soldier, there is one window per event outside both a Titan Engagement and a Skirmish, and a soldier who has already rolled or Helped can still Cover.

## 3.6 Healing time

`data/harm/healing.yaml` measures healing time in **days**.

- **When a day passes.** During an Expedition, a day passes at each night camp (ADR-0009; Chapter 7, section 7.1), and its care window has every soldier on the Expedition in its scope, with Field Repair. In Downtime, seven days pass at the infirmary, each with an infirmary roll before its Death Rolls and no care window of its own (Chapter 7, section 7.2). While no Expedition and no Downtime is under way, one day also passes at the start of each session, before the interim issue (Chapter 4, section 4.9), or, if a session begins partway through a procedure, once that procedure has ended. Stress and Grief do not change on that day (`day_passes`, `interim`; decision batch 5, OQ-120). That day's care window has every soldier in the Squad in its scope, and Field Repair is rolled in it as on an Expedition day (section 3.5; Chapter 4, section 4.8; decision batch 5, OQ-130). No day passes inside a Titan Engagement.
- **Each time a day passes,** in this order (`each_day`):
  1. Hold a care window.
  2. Every lethal Critical Injury with a `day` limit causes a Death Roll.
  3. Every living soldier gets back all Health lost to damage, erasing every damage mark. Crossed-off boxes stay crossed off.
  4. Every held Critical Injury's remaining healing time drops by 1 day. One that reaches 0 heals. An untreated Pierce from the 7 row up does not drop (below).
- **Lethal Critical Injuries** cannot heal while still lethal. Their healing time stops at 1 day until they are stabilized.
- **An untreated Pierce** from the 7 row up keeps its healing time while untreated: it heals only after a Treat Injury roll has succeeded on it, and until then it keeps its effects and its crossed-off Health box. A lethal one that Death Rolls stabilize is still untreated, so it still does not heal (`not_while_untreated`; decision batch 8, 8-15). A Burn's healing days are doubled by its rider (section 3.2).
- **When it heals.** A Critical Injury that heals stops being held. Its effects end, and if it was untreated it gives back its Health box, unless the soldier still holds at least as many untreated Critical Injuries as Health (section 3.1). It leaves the sheet's Critical Injuries (section 3.17). If its row has permanent effects, they stay, and it keeps counting toward worsening at its Injury Location. Any other healed Critical Injury stops counting toward worsening.
- **Careful Nursing.** When a Treat Injury roll by a soldier with Careful Nursing succeeds on a comrade's Critical Injury, its remaining healing time is halved, rounding up, once per Critical Injury. The Talent never applies to the soldier's own Critical Injury.

Healing time counts days: a day passes at each night camp, on each of Downtime's seven days, and, while no Expedition and no Downtime is under way, at the start of each session (decision batch 7, 7-14, 7-15). A lethal Critical Injury cannot heal before it is stabilized (OQ-53).

## 3.7 The Grab and ADR-0014

ADR-0014 wants a Grab to kill about 1 time in 3 with comrades close, and about 2 times in 3 when the soldier is alone. Chapter 5 gives the Grab procedure (section 5.9) and tunes it (section 5.13). This chapter gives Chapter 5 these parts:

- **The crushing Critical Injury never kills.** It is a torso Critical Injury of Injury Type Crush that cannot be lethal (ADR-0019), so it never adds a Death Roll or instant death. The torso has no side and the torso table carries no type rider, so decision batch 7 changes none of the figures in this section (7-4, 7-5). What kills a Grabbed soldier is the devour step of Chapter 5's Grab procedure (section 3.1; Chapter 5, section 5.9).
- **It can put the soldier Down.** The torso table's non-lethal cap row is a `down: until_treated` row. A Down soldier cannot take Break Free, so only a comrade can free them. From the current rows, the crushing Critical Injury's row puts the soldier Down 16.7% of the time with no torso Critical Injury held, 41.7% with one, and 72.2% with two. The cap row takes the place of every lethal and instant-death row, so this is more often than an ordinary torso Critical Injury puts a soldier Down (11.1%, 30.6%, and 47.2%). The crushing Critical Injury also crosses off a Health box like any other (section 3.1), so a victim whose last box it crosses off is Down in the Titan's hand whatever the row.
- **It can make Break Free harder.** With no torso Critical Injury held, the crushing Critical Injury leaves Break Free with no penalty 16.7% of the time, gives a 1-die penalty 41.7% of the time, and a 2-die penalty 25.0%. The remaining 16.7% is the Down row.
- **Down soldiers cannot dodge.** A soldier crushed Down by an earlier Grab, or Down for any other reason, cancels nothing: the next Titan attack lands on them on 1 or more successes of its roll.
- **How the Grab landed does not matter.** A Grab lands on 1 or more Net Successes and takes no rider, so its crush is the same torso Crush Critical Injury whatever the Titan rolled (decision batch 8, 8-2). The research measured every cell below within sampling under Attack Dice, and the full rerun re-measures them (8-14; OQ-145).
- **Comrades pay a mind price.** Witnesses make the `comrade-grabbed` Fear Roll (section 3.12). At Resolve 3, a witness loses their next action or their whole turn 2 times in 6 at Stress 1, 3 times in 6 at Stress 2, and 4 times in 6 at Stress 3. Losing the action is enough to lose a rescue. Chapter 5 decides who witnesses (section 5.9, `data/engagement/engagement-flow.yaml`, `witnesses`).

**How the target is measured.** ADR-0014, as amended in decision batch 3 (OQ-95), defines both halves of the target. Chapter 5 measures them with these parts and its own Grab procedure and rescue structure (section 5.9), where Break Free needs 2 successes, with a 2-die penalty once the soldier is lifted. Chapter 5's section 5.13 and `data/engagement/tuning.yaml` (`grab`) are the only source of the Grab figures. The models this chapter recorded before Chapter 5 was drafted, with Break Free at 3 successes and two candidate rescue structures, are withdrawn.

- **Alone.** A Rookie victim with no untreated Critical Injury whose dodge failed dies 69.9% of the time, and one who did not dodge 73.1%: about 2 in 3.
- **Comrades close.** This means one comrade in reach with the reference build and starting state: a Rookie with Talent 1 on the Body Part strike, at In Reach. It is met when all six cells of OQ-50's acceptance test, witness Stress 1, 2, and 3 with Grief 0 and 1, are under 50% and the witness Stress 2, Grief 0 cell is near 1 in 3. Chapter 5's cells are 28.7%, 33.4%, and 39.1% at witness Stress 1, 2, and 3 with no Grief, and 34.1%, 39.7%, and 45.1% with 1 Grief.
- **Reported beside the target, not tuned.** A victim already carrying untreated Critical Injuries (`grab`, `health_reports`), and the share of Grabs that the reference Squad's victims die from in a full fight, with every written rescue in play (section 5.13).

---

# Part Two: Mind

## 3.8 Resolve

- A soldier's Resolve is the formula in `data/character/attributes.yaml`: half of Instinct plus Empathy, rounded up, plus 1 per Scar, minus 1 per point of Grief (Grief is at most 3; section 3.14).
- **Resolve counts against Stress Response and Fear Roll totals**: each of those rolls is D6 plus Stress minus Resolve.
- Resolve has no floor. With enough Grief it can fall to 0 or below, which raises both totals (OQ-52).
- **Iron Nerve** counts the soldier's Resolve as 1 higher on their own Stress Response roll.
- **Unshaken Command** can let a nearby comrade's Fear Roll use the Talent holder's Resolve instead, if it is higher. Its trigger and limit are in `data/character/talents.yaml`.

## 3.9 Effects that change rolls, turns, and Reactions

Every row in this chapter names its effects by type from `data/harm/effect-types.yaml`, so every effect has exactly one reading. In brief:

- **Dice penalties** remove base dice from rolls for named Action Catalog entries, or from the soldier's next attribute roll other than a Death Roll. They follow Chapter 1's penalty step.
- **Stress gains** use Chapter 1's named-gain row and happen once each time the row takes effect. On a Critical Injury that is when it is recorded; holding it gains nothing more.
- **Extra Stress on a Push** adds Stress each time the soldier Pushes, whether or not the Push is Covered, and adds no Stress Die.
- **Losing successes** and **the roll fails** change the success count of the roll that caused the result, at step 2 of *Finishing a roll* (Chapter 1, section 1.5). The changed count is the roll's count for every later use, including a dodge's comparison with later behaviors.
- **Next turn spent** spends the soldier's earliest turn, starting with the current round's, whose move and action are both unspent. This is exactly how a Reaction spends a turn (Chapter 1, section 1.9). The spent turn still happens and counts as a turn, but begins its round with its move and action already spent.
- **Next action spent** spends the action of the soldier's earliest turn, starting with the current round's, whose action is unspent. That turn keeps its move. An action spent in a later round begins that round already spent (Chapter 1, section 1.9), so the soldier cannot Help that round or make a Reaction with that turn.
- **No Reactions** forbids the soldier's Reactions from when the result takes effect until the end of the first of their turns that begins after that. For a row that spends two turns, it lasts until the end of the second such turn. Which turn the row spends does not change how long the ban lasts, and the ban ends when the Titan Engagement ends. Each row that carries it also names `forbids: [reaction]`, Chapter 1's shared hook (section 1.9); the hook reads this ban and adds no second timer. A Titan's card against the soldier lands on 1 or more Titan successes, and a card that scores 0 whiffs and spares them (ADR-0019; decision batch 8, 8-1).
- **The six Fear Roll effects** (decision batch 7, 7-8) act on the event's Titan, which section 3.12 defines:
  - **The loudest flag** gives the soldier the loudest flag for the event's Titan, the flag Draw Attention sets (Chapter 5, section 5.6), if it is a Focus Titan in the soldier's zone. It lasts like every flag.
  - **Stress to comrades nearby** gives Stress to every comrade in the soldier's zone or an adjacent zone. It is Stress, not a roll, and causes no Fear Roll. It applies only after every Fear Roll of the same event has found its row, so it never changes a comrade's total for that event; it counts from their next roll on (section 3.12, *Limits*; decision batch 8, 8-40).
  - **A forced step** moves the soldier one step at the start of their next turn, even a turn spent in advance: toward Distant by the retreat's first option, out of a Titan's reach (Chapter 5, section 5.10), or toward the nearest comrade, lowering the number of zones between them. PROVISIONAL: a soldier already free in a zone that holds no body makes no step toward Distant (OQ-203). It is a result, not the soldier's move, so it spends nothing. No step is made for a soldier who is Down, Grabbed, Pinned, or carried, or who has no such step to make, and it never makes them leave or let go.
  - **A forced strike** makes the soldier's next action a Nape strike or a Body Part strike against the event's Titan, Pushed if it falls short and the soldier may Push it. Until they make it, they take no other action but Swap Blade Set, and cannot Help or Cover, through `forbids: [help, cover]`. It waits while they are Grabbed, Down, or Pinned; a limb-pinned soldier's strike on the Body Part that pins them, when the event's Titan's body pins them, is the forced strike. A strike they cannot legally make does not end it: it ends only when they strike, when Rally clears it, when that Titan dies, or when the Titan Engagement ends (decision batch 8, 8-16).
  - **Blade Set dropped** empties the soldier's handles. The set lies at their Position, no one takes it during the Titan Engagement, and it is shared out with the left items when the Titan Engagement ends (Chapter 4, section 4.11). The swap refits from a carried set (Chapter 4, section 4.4).
  - **A Gas Roll at once** is a two-die Gas Roll on the fitted canister, if its Gas Rating is above 0 (Chapter 4, section 4.3). It is not the round's Gas Roll and is not ODM use.
- **Gain a Scar** and **Fear Roll total raised** point to section 3.13 and section 3.12.
- **Stated effect** is used only by Scars, for an effect written out in closed words on the row.
- **Pinned** (decision batch 8, 8-9; Chapter 5, section 5.7) is a state, not a table row, and reads these effects. Its rows name Chapter 1's hook: `forbids: [cover, reaction]` for a limb pin and `forbids: [help, cover, reaction]` for a body pin. A limb-pinned soldier keeps their action for the entries its closed list allows, and cannot take any other entry, read as the lost-limb grades' Cannot take (section 3.2; `pinned` in `data/harm/effect-types.yaml`, rendered in Chapter 5, section 5.7). A body-pinned soldier has no action. A Titan's card lands on a Pinned soldier as on one who cannot make a Reaction.

Outside a Titan Engagement there are no turns or Reactions, so the turn, action, and Reaction effects do nothing there unless the rule that called for the roll states what they do. Of the six Fear Roll effects, the loudest flag and the forced step do nothing there, Stress to comrades nearby and the forced strike apply only in a Skirmish, and a dropped Blade Set and a Gas Roll apply anywhere.

**What no row does.** No table row in this chapter damages or wears gear; the two Fear Roll effects that touch gear use Chapter 4's rules for a Blade Set and a Gas Roll. Only the Fear Roll row with a forced strike forbids a soldier to Help or to Cover; any other row may, by naming it in a `forbids` field (Chapter 1, section 1.9; OQ-18), and the Down state names both (section 3.3). No row causes a Fear Roll, or any roll by a comrade.

> **Design note (OQ-46):** A result that spends a turn or an action uses Chapter 1's turn-spending rule, so Chapters 1 and 3 spend turns the same way. A turn a result spends begins its round with its move and action spent, exactly like a turn a Reaction spends, so the soldier cannot Help that round (OQ-17). A ban on Reactions lasts until the end of the soldier's next turn to begin, so a soldier already in turn debt is not left unable to dodge for longer than one who is not.

> **Design note (decision batch 7, 7-8; decision batch 8, 8-13; OQ-139):** The six Fear Roll effects reuse rules the game already has: Draw Attention's flag and its batch 5 Distant rule, the retreat's forced step, the swap and left items of Chapter 4, and its Gas Roll. Each names its Titan, item, and step, so nothing is left to the GM, and each row makes at most one write to the GM's tracker or the positions column. Fear spreads as Stress, not as rolls, so a Grab round costs one sheet mark per nearby comrade and no second round of Fear Rolls (OQ-50, as revised; OQ-97). A forced step is a result and not the soldier's move, so it happens on a turn spent in advance. A forced strike is a Fear result, not a penalty for acting alone (ADR-0010, as amended in decision batch 7).

## 3.10 Stress Responses

`data/mind/stress-responses.yaml` holds the Stress Response table, rendered under *The roll* below, and its rules.

### When a Stress Response happens

A Stress Response happens only when a Stress Die shows 1 on an attribute roll, or after a Push of it. A roll never causes more than one (Chapter 1, section 1.5; ADR-0004). It is resolved at step 2 of *Finishing a roll*, after successes are counted and before the roll's effect.

A roll whose own rule names another resolution for its Stress Response, such as a Graduation Exam Trial (Chapter 2, section 2.4), still has the Stress Response and still cannot be Pushed after it, but does not use this table (Chapter 1, section 1.5, OQ-05).

### The roll

- Roll **D6 + Stress − Resolve** and find the row whose `results` include the total. It is the fixed roll `stress-response-roll`: no pool, no Push, no Help, no Stress Dice.
- Use the soldier's Stress after any Push of the roll, and their current Resolve.
- The table's first row covers every total of 0 or less, and its last row every total from its minimum up.
- Each row's name and *What happens* line are fiction. Only its Duration and Effects are rules (decision batch 7, 7-9).

<!-- BEGIN RENDERED: stress-responses from data/mind/stress-responses.yaml -->
| D6 + Stress − Resolve | Stress Response | What happens | Duration | Effects |
|---|---|---|---|---|
| 0 or less | Deep Breath | You breathe out through your teeth, and the moment passes. | instant | none |
| 1 | Scattered Thoughts | Every plan you start falls apart before you finish thinking it. | lasting | 1-die penalty on Read, Treat Injury, Field Repair |
| 2 | Tunnel Vision | The edges of the world go grey. You see the danger in front of you and nothing beside it. | lasting | 1-die penalty on Break Attention, Rally |
| 3 | Blade Chatter | Your hands will not stop shaking, and the grip you drilled for three years is gone. | lasting | 1-die penalty on Nape strike, Body Part strike, Break Free |
| 4 | Leaden Legs | Your body answers a heartbeat late, as if your legs belong to someone else. | lasting | 1-die penalty on Fly, Ride, Dodge |
| 5 | Wound Tight | Everything in you is pulled taut. Each time you reach for more, something tears a little. | lasting | 1 extra Stress on every Push |
| 6 | Flinch | Something moves at the edge of your sight, and your whole body jerks away from it. | instant | lose 1 success |
| 7 | Seized Up | Every muscle locks at once. For a long moment you can only watch. | instant | lose 1 success; next turn spent |
| 8 or more | Everything Slips | Your grip, your footing, and your nerve all give way in the same instant. | instant | the roll fails; gain 1 Stress |
<!-- END RENDERED: stress-responses -->

### Instant and lasting results

Every row is **instant** or **lasting** (`result_rules`):

- An **instant** result applies once, to the roll that caused it. The table's instant rows can take successes from the roll, make it fail, spend the soldier's next turn, or add Stress.
- A **lasting** result is held by the soldier. Its effects apply from the next roll on and never change the roll that caused it. Each lasting row either puts a 1-die penalty on the Action Catalog entries it names or adds Stress to every Push. A soldier can hold several different lasting results.
- **Already held.** If the row found is a lasting row the soldier already holds, use the next row down the table instead. Repeat while that row is also one the soldier holds.

### When lasting results end

A lasting Stress Response ends when:

- Rally clears it (section 3.11);
- the Titan Engagement in which it was gained ends (section 3.16); or
- outside a Titan Engagement, the rule that called for the roll says it ends. If that rule says nothing, it ends when a day passes.

A result gained at the steps after a Titan Engagement ends, such as on a care-window roll, was gained outside it. The sheet records which ending applies. A Down soldier keeps the lasting results they hold.

> **Design note (OQ-47):** The rows are the starting values for the ADR-0014 simulator. A Stress trajectory model with these rows shows no Stress spiral for a Rookie who Pushes every short roll. The table keeps its lasting penalties to 1 die each, because six attributes share the rows instead of Alien's four. At Resolve 3, a Stress Response at Stress 1 is a lasting penalty or nothing. At Stress 3 it takes a success 1 time in 6, and at Stress 5 it takes a success or worse half the time.

> **Design note (decision batch 7, 7-9; OQ-47, as revised; OQ-139):** Every row has a fiction-first name and a line of what happens, and keeps its total, duration, and effects, so no measured figure moves. The table gains no gear or scene row, because it resolves in the middle of every attribute roll, including a dodge against a Titan's card, where a long result would stall the card. Its row ids are unchanged, since the sheet records a lasting row by id.

## 3.11 Rally

Rally is the Empathy action `rally` (Chapter 2). `rally` in `data/mind/stress-responses.yaml` gives the procedure.

- **Target:** a comrade, player character or Squadmate, who holds at least one lasting Stress Response or pending Fear result, a forced step or forced strike not yet made (section 3.12). A soldier can never Rally themselves. The target may be Down.
- **Needs:** 1 success. **Each success clears one** of the target's lasting Stress Responses or pending Fear results, chosen by the Rallying soldier's player.
- On a failure nothing happens.
- **Rally never lowers Stress.**
- **In a Titan Engagement:**
  - It is an action.
  - The target must be in the Rallying soldier's zone or an adjacent zone, and Carrying Voice adds one more zone. Two soldiers who have both left the Titan Engagement while it goes on count as holding the same Position, including for Help and Covering on the roll (section 3.16).
  - It can be Helped as Chapter 1 states, and a failed Rally can be tried again on a later turn.
- **Outside a Titan Engagement:**
  - Any soldier who is not Down may Rally a comrade, with no Help and no Covering.
  - A soldier can Rally a given comrade once, and again only after that comrade gains another lasting Stress Response or pending Fear result. The sheet records who has Rallied the comrade.
- Steady Voice adds dice.

> **Design note (OQ-48):** Rally uses Help's Position test, clears one lasting result per success, and outside a Titan Engagement can be used on a comrade once per lasting result gained, so no judgment decides who can reach whom or how often. Decision batch 7 (7-8) lets it also clear a forced step or forced strike still pending, so a comrade can talk a soldier down before they run or charge.

## 3.12 Fear Rolls

`data/mind/fear-rolls.yaml` holds the triggers and the table, which is rendered under *Results* below.

### Triggers

A Fear Roll is made only when an event on the closed list of `triggers` happens (`triggers_closed`; ADR-0024, limit 1). The dice never cause one (ADR-0004), and no ruling calls one except through the `gm-horror` row below. A later chapter that creates a new trigger adds a row to the file. The Phase 1 triggers are:

- **`first-titan-engagement`:** the soldier's first Titan Engagement. The sheet's `faced_a_titan` is set when the soldier first holds a Position in one, even if they make no Fear Roll, for example because they are Down.
- **`abnormal`:** an Abnormal is a Focus Titan when a Titan Engagement starts, or becomes one during it.
- **`second-focus-titan`:** a Background Titan enters as a second Focus Titan.
- **`comrade-grabbed`:** a comrade becomes Grabbed.
- **`comrade-dies`:** a comrade dies.
- **`first-human-kill`:** the soldier kills a person for the first time, in a Skirmish (Chapter 7, section 7.4). The sheet records that they have killed a person, and the trigger never applies to them again (decision batch 7, 7-17).
- **`gm-horror`:** outside a Titan Engagement, an event the GM judges at least as horrifying as a listed trigger, such as a village found devoured, a comrade's body found days after, or a Titan seen from the Wall tearing through a breach (decision batch 9, 9-6).

Each row states who rolls:

- `first-titan-engagement`: only that soldier, when they first hold a Position in a Titan Engagement.
- `abnormal` and `second-focus-titan`: every soldier who holds a Position in that Titan Engagement.
- `comrade-grabbed`: every witness, as Chapter 5 defines a witness in a Titan Engagement (section 5.9, `data/engagement/engagement-flow.yaml`, `witnesses`), never the Grabbed soldier.
- `comrade-dies`: every witness, as Chapter 5 defines one. A witness who is Grabbed still rolls. In a Skirmish, every other soldier taking part who is alive rolls (Chapter 7, section 7.4).
- `first-human-kill`: only that soldier, when the kill resolves.
- `gm-horror`: the witnesses the GM names, each a soldier who witnesses the event.

Each row also marks whether its event can arise outside a Titan Engagement (`can_arise_outside_titan_engagement`), such as a comrade Grabbed in a Chase. Outside a Titan Engagement, such an event causes Fear Rolls only if the rule that creates the situation states who rolls; for `gm-horror`, the GM names them.

**The GM's trigger** (`gm-horror`; decision batch 9, 9-6). It is the one row the GM reads, and the GM calls it rarely:

- **Weight.** The event is at least as horrifying as a listed trigger. An event a listed trigger covers, such as a comrade's death, uses that trigger's row and never `gm-horror` as well. It is never called for an outcome a called roll's stakes named, since a stake is never a Fear Roll (Chapter 1, section 1.1, item 2); a listed trigger that outcome later meets still applies (decision batch 9, 9-34).
- **Never inside a Titan Engagement.** There the listed triggers alone govern, and no ruling calls a Fear Roll.
- **The roll is every Fear Roll's.** The table, *Limits* (one Fear Roll per soldier per event, none for a Down soldier, one snapshot), and the Drive shrug-off apply as to any trigger.
- **Advice, not a rule:** at most one `gm-horror` roll in a scene, and none for a horror the soldiers have already rolled for that day (OQ-169).

### Limits

- **One Fear Roll per soldier per event,** even if the event matches several triggers.
- **A Down soldier makes no Fear Roll.**
- A death during the steps after a Titan Engagement ends (section 3.16) causes no Fear Roll.
- Fear Rolls are made as soon as the event has been fully resolved. Grief from a death applies only after every Fear Roll that death causes has resolved, including each Drive decision (section 3.14).
- **One snapshot per event** (`limits`, `timing`; decision batch 8, 8-40). Everyone who rolls for one event rolls together. Each rolling soldier's total uses their Stress, Resolve, and Scars as they stood when the event was resolved, and Unshaken Command reads the comrade's Resolve at that same moment. In order:
  1. Find every rolling soldier's row.
  2. Each soldier's player makes their Drive decision.
  3. Every result that was not shrugged off applies.

  No result of the event, such as Stress to comrades nearby, a Scar, or a spent action, changes another soldier's total for that event; it counts from the next roll on. So the order of the rolls changes no result.

> **Design note (decision batch 8, 8-40):** Without a snapshot, one witness's Nothing Left could add Stress to a second witness before that witness found their row, and the order the rolls were read in would decide the second result. Reading every total at one moment keeps the rule that everyone who rolls for one event rolls together, so a Grab round stays quick and no sheet order is needed. Fear still spreads: the Stress lands, and it counts on the next event. A snapshot can only lower a later witness's total, never raise it, so the Fear Rolls with two or more rolling soldiers can only lose deaths or hold, and the rows that read them are re-checked. The six Grab cells are untouched, since each has one comrade witness or none.

### The roll

- Roll **D6 + Stress − Resolve** and find the row. It is the fixed roll `fear-roll`: no pool, no Push, no Help, no Stress Dice, and no Stress Response.
- Unshaken Command can let the roll use a nearby comrade's higher Resolve, under the Talent's trigger and limit (section 3.8). Two Scars raise the total for certain triggers (section 3.13).
- A Squadmate makes Fear Rolls like a player character.

### Results

Every row is instant, and the rows escalate. What each total costs is fixed by `placement` (decision batch 7, 7-8):

- A total of 0 or less costs nothing.
- Totals 1 and 2 add Stress, a penalty on the next roll, or a Gas Roll, and never cost the action or the turn.
- Totals 3 and 4 spend the soldier's next action.
- Totals 5 and 6 spend the soldier's next turn.
- Totals of 7 or more spend the next turn and give a Scar, and totals of 8 or more spend the next two turns.
- From 6 up, the rows also forbid Reactions until the end of the soldier's next turn to begin, or until the end of the second turn spent on a row that spends two. A Titan's card against the soldier then lands on 1 or more Titan successes, and a card that scores 0 whiffs and spares them (ADR-0019; decision batch 8, 8-1).
- A forced strike appears only on a row of 7 or more, a dropped Blade Set only on a row that spends the action or the turn, and Stress to comrades nearby only on the top row. No row causes another Fear Roll or helps.

Each row's name and *What happens* line are fiction. Only its Effects and Forbids are rules.

<!-- BEGIN RENDERED: fear-rolls from data/mind/fear-rolls.yaml -->
| D6 + Stress − Resolve | Result | What happens | Effects | Forbids |
|---|---|---|---|---|
| 0 or less | Steeled | You breathe out slowly. Your hands stay where they belong. | none | none |
| 1 | Heart in Your Throat | Your pulse drowns out the wind. You swallow, and it will not go down. | gain 1 Stress | none |
| 2 | Cold Sweat | Sweat runs into your eyes, and everything in your hands turns slick. | gain 1 Stress; 1-die penalty on the next roll | none |
| 3 | Clenched Trigger | Your hand clamps down, and gas roars out of your gear for nothing. It takes a moment to make your fingers let go. | next action spent; a Gas Roll at once | none |
| 4 | Retching | The smell reaches you before the sight does, blood and steam and worse. You double over and heave. | next action spent; gain 1 Stress | none |
| 5 | Someone Is Shouting Your Name | Someone is shouting your name from very far away. Your body does not answer. | next turn spent | none |
| 6 | Scream | The scream is out of you before you know it is yours. Somewhere above you, a huge head turns. | next turn spent; no Reactions; the loudest flag on the event's Titan, never from Distant | Reactions |
| 7 | Run for the Wall | Every part of you turns toward home and goes. Behind you, someone is still fighting. | next turn spent; no Reactions; 1 step toward Distant at the start of the next turn; gain a Scar | Reactions |
| 8 | Kill It | The world goes quiet and red. When it comes back, you are already going for it. | next 2 turns spent; no Reactions; next action a strike on the event's Titan, Pushed if short; gain a Scar | Reactions, Help, Covering |
| 9 or more | Nothing Left | You open your hands and let the blades fall. Everyone near you sees it in your face. | next 2 turns spent; no Reactions; drop the Blade Set in the handles; comrades within 1 Position step gain 1 Stress; gain a Scar | Reactions |
<!-- END RENDERED: fear-rolls -->

**The event's Titan.** An effect that acts on a Titan acts on the event's Titan (`event_titan`), which each trigger names:

- `abnormal`: the Abnormal.
- `second-focus-titan`: the Titan that entered.
- `comrade-grabbed`: the Focus Titan that holds the comrade.
- `comrade-dies`: the Focus Titan whose card or Grab killed the comrade.
- `first-titan-engagement`, and a death no Focus Titan's card or Grab caused, such as a Death Roll: the nearest Focus Titan. That is the living one the rolling soldier holds the closest Position to, in the order On Body, Blind Spot, In Reach, Distant, and on a tie the one with the earliest label.
- `gm-horror`: none, or the nearest Titan in sight if the GM names one. The event is outside a Titan Engagement, so each effect does what section 3.9 gives for outside one.

If the event's Titan has died when the result applies, the nearest Focus Titan takes its place. If none is alive, those effects do nothing.

**What counts as the result.** A Fear Roll's result is every effect of its row: any Stress gain, to the soldier or to comrades nearby, spent action or turn, ban on Reactions, flag, forced step, forced strike, dropped Blade Set, Gas Roll, and Scar. When a soldier's Drive shrugs off the result (Chapter 2, section 2.5), none of those effects happen, including the Stress to comrades. The Fear Roll still counts as made.

> **Design note (OQ-49):** Six listed triggers, one Fear Roll per soldier per event, no Fear Roll for a Down soldier, and Fear Rolls outside a Titan Engagement only where the creating rule names who rolls keep the list closed (ADR-0024, limit 1). A soldier's first Titan Engagement sets `faced_a_titan` whether or not they roll. Chapter 5 defines who witnesses a comrade being Grabbed or dying (section 5.9).

> **Design note (decision batch 9, 9-6; OQ-169):** The owner let the GM call a Fear Roll for a horror the list does not name and left how often to the GM, so the once-per-scene limit is advice. What stays closed is the trigger's weight, the listed triggers alone in every Titan Engagement, where the Grab cells and the deaths bands read Fear results, and the Drive shrug-off, so no measured Fear figure moves and the table is unchanged. Rows of 7 or more give Scars, and five Scars retire a soldier, so the playtest counts every `gm-horror` roll and the Scars it gave.

**Acceptance test (OQ-50, OQ-95).** ADR-0014, as amended, reads "comrades close" as one comrade in reach with the reference build and starting state. Its "a Grab kills about 1 time in 3 with comrades close" counts as met only if the Grab and rescue rules pass all six cells of this band, with Rookie witnesses at Resolve 3 before Grief:

- Witness Stress 1, 2, and 3, each with 0 Grief and with 1 Grief, make six cells.
- At witness Stress 2 with 0 Grief, the comrades-close death rate is near 1 in 3.
- In every one of the six cells, the comrades-close death rate is below 50%.

The table's action-lost, turn-lost, and Scar profile at every total (`placement`) stays as written while Chapter 5 is tuned against this test. Decision batch 7 re-cut the rows under that profile, so the rerun reads the six cells as a check, and a cell that misses goes to the decider, not to the rows (7-8). The cells are unchanged in kind under Attack Dice, since they depend on the crush and the rescue, not on how the Grab landed (decision batch 8, 8-1; OQ-139, as revised). Chapter 5 gives the measured cells (section 5.13, `data/engagement/tuning.yaml`, `grab`), and section 3.7 quotes them.

> **Design note (OQ-50):** A Drive shrugs off every effect of the row. At Resolve 3, a Fear Roll costs a witness their next action or their whole turn 2 times in 6 at Stress 1, 3 in 6 at Stress 2, and 4 in 6 at Stress 3. It costs the whole turn 1 time in 6 at Stress 2 and 1 in 3 at Stress 3. It gives a Scar only on a total of 7 or more, which needs Stress above Resolve. The re-cut of decision batch 7 holds these odds exactly.

> **Design note (decision batch 7, 7-8; OQ-139):** The rows are Attack on Titan beats with mechanical teeth: gas wasted in a clenched burst, retching at the carnage, a scream that turns the Titan's head, a flight toward the Wall, a blind charge, and blades let fall in despair. The placement rules hold the old profile, so the texture moves no measured figure by construction. A Rookie witness at Stress 1 to 3 and Resolve 3 reaches at most 6, and at most 7 with 1 Grief, so the forced strike sits at 8, where no witness in the six cells can reach it and a charge cannot change the rescue they measure. The forced step sits at 7, which only the Stress 3 witness with 1 Grief reaches, 1 time in 6, on a row that already spends their turn. The dropped Blade Set sits on the top row: the swap costs no action while a carried set is left, so the loss is the set, not the rescue. Stress to comrades nearby is rare there, and no row causes another roll, so OQ-97's round-time band holds. Batch 3's rule that kept every row by name while Chapter 5 was tuned now binds the profile, not the names.

## 3.13 Scars

`data/mind/scars.yaml` holds how Scars are gained, the Scar table, which is rendered under *What a Scar does* below, and Retirement.

### Gaining a Scar

A soldier gains a Scar only from a trigger on the closed list in `gaining`:

- **A Fear Roll row with a Scar** takes effect. A result that a Drive shrugs off gives no Scar.
- **A lethal Critical Injury is stabilized** while the soldier is alive, by a Treat Injury success or by a Death Roll that slows a `day` limit. Each Critical Injury gives this Scar at most once.

Then, in order:

1. **Roll D66** on the Scar table. If the soldier already holds that Scar, roll again. A Squadmate also rolls again on a row marked `squadmate_rerolls`, whose trigger is a Push or a Cover.
2. **Record** the Scar. No rule removes a Scar.
3. **Minimum Stress rises by 1.** If the soldier's Stress is below the new minimum, it rises to it at once (Chapter 1, section 1.6).
4. **Resolve rises by 1** (ADR-0008).
5. **Five Scars:** the soldier must retire (see *Retirement*).

A soldier never holds more than five Scars. A Scar gained at five does nothing.

### What a Scar does

Every Scar raises minimum Stress and Resolve by 1 (ADR-0008, as amended). So a veteran always rolls Stress Dice and resists Stress Responses and Fear Rolls better. Each Scar row also names a trigger and an effect: a named trauma that bites in one kind of moment. Examples are a penalty on one kind of roll, extra Stress when a comrade dies or when the soldier Covers, a higher Fear Roll total for one trigger, or having to Push a failed strike.

<!-- BEGIN RENDERED: scars from data/mind/scars.yaml -->
| D66 | Scar | Trigger | Effect | A Squadmate rolls again |
|---|---|---|---|---|
| 11–13 | The Closing Hand | You make a dodge against a behavior whose Behavior Table entry has a grab effect, which Chapter 6 marks in each table's Grab column (data/titans/index.yaml, grab_mark). | 1-die penalty on Dodge (that dodge only) | no |
| 14–16 | Survivor's Guilt | A comrade in the Squad dies. | gain 1 Stress, after the soldier's comrade-dies Fear Roll for that death, if they make one (data/mind/fear-rolls.yaml); otherwise it applies when the death happens | no |
| 21–23 | Unsteady Hands | You roll for treat-injury or field-repair. | 1-die penalty on Treat Injury, Field Repair | no |
| 24–26 | Cannot Look Away | You make a Fear Roll for the comrade-grabbed trigger. | Fear Roll total +1 | no |
| 31–33 | Numb | A comrade in the Squad dies. | You make no Fear Roll for that death, and you gain 1 more Grief from it (data/mind/grief.yaml). | no |
| 34–36 | Reckless Blade | Your roll for nape-strike or body-part-strike falls short of what it needs, and you are allowed to Push it. | You must Push that roll. | yes |
| 41–43 | Nerves on Edge | For the first time in a Titan Engagement, a Titan's card resolves a behavior against you. | gain 1 Stress | no |
| 44–46 | Fear of Falling | You roll for fly. | 1-die penalty on Fly | no |
| 51–53 | Blood on the Blade | Your Nape strike kills a Titan. | gain 1 Stress, after the Nape kill Stress relief (data/core/stress-changes.yaml) | no |
| 54–56 | Carrying Their Weight | You Cover a comrade's Push. | gain 1 Stress (in addition to the Covering Stress) | yes |
| 61–63 | Second-Guessing | You roll for read or break-attention. | 1-die penalty on Read, Break Attention | no |
| 64–66 | Old Nightmare | You make a Fear Roll for the abnormal or second-focus-titan trigger. | Fear Roll total +1 | no |
<!-- END RENDERED: scars -->

When one death triggers both Survivor's Guilt and the soldier's `comrade-dies` Fear Roll, the Scar's Stress comes after that Fear Roll, so it never raises the roll's total. A soldier who makes no Fear Roll for the death gains the Stress when the death happens.

> **Design note (OQ-51):** The rule has two Scar triggers, a D66 Scar table of twelve rows, Survivor's Guilt after a death's Fear Roll, Squadmate re-rolls, and the Retirement timing below, which promotion shares (Chapter 2, section 2.10). Scars come from Stress well above a soldier's minimum, and from surviving lethal Critical Injuries. A Scar raises minimum Stress and Resolve together, so it does not by itself change a soldier's Fear Roll or Stress Response odds at minimum Stress.

### Retirement

A soldier with five Scars must retire, and a soldier who has lost both arms or both legs may retire (`retirement`, `trigger`):

- **Medical Retirement.** A soldier who has lost both arms or both legs (section 3.2, *Lost limbs*) may retire at the player's choice, whatever prosthetics are fitted, since the loss stands. The choice is offered when the procedure in which the soldier met that trigger ends, or at once if no procedure is under way, and again at the end of every Downtime while the loss stands (Chapter 7, section 7.2). Declining is not final. A Squadmate may take it, chosen by the players as one table, with Chapter 2's roll-off if they disagree. If the player chooses it, the sheet marks the soldier retiring, and Retirement happens at the moment the timing below gives a fifth Scar gained then, with the same effect. A Prosthetic is the alternative (section 3.2).
- **When:** Retirement never interrupts a procedure.
  - A fifth Scar gained during a Titan Engagement, or at any of the steps after it ends (section 3.16), retires the soldier at the last of those steps.
  - One gained while a day passes retires the soldier after that day's last step (section 3.6).
  - One gained in a care window held for harm outside a Titan Engagement retires the soldier after that window and the Death Rolls that follow it, if any.
  - Any other fifth Scar, such as one from a Fear Roll that a Chase causes, retires the soldier when the procedure in which it was gained ends, as that procedure's rule states. If no procedure is under way, it retires the soldier at once.

  Until then the soldier follows every rule as normal.
- The soldier leaves play and becomes an NPC instructor or Squad contact. The rules that give instructors and contacts an effect are not yet written.
- A retiring player character is replaced by promotion or a new character (Chapter 2, section 2.10). A retiring Squadmate leaves the Squad Pool.
- Every Drive that named the retiring soldier can never trigger again.
- Retirement gives no Grief and is not a Fear Roll trigger.

> **Design note (decision batch 7, 7-6; decision batch 8, 8-10 and 8-11; OQ-137, OQ-147):** Without medical Retirement, a soldier who can no longer fly or walk waits for a fifth Scar before any rule turns them into the instructor or contact Retirement promises. The owner confirmed it, and batch 8 opened it to Squadmates and offers it again at each Downtime, so a soldier may try a prosthetic first and retire later.

## 3.14 Grief

`data/mind/grief.yaml` holds the rule.

- **Who gains it.**
  - A death during a Titan Engagement, including one at the steps after it ends (section 3.16), gives Grief to every other living soldier in the Squad who held a Position at any point during that Titan Engagement.
  - A death during a Skirmish, including one at its end steps, gives Grief to every other living soldier who took part in it (Chapter 7, section 7.4).
  - Any other death of a soldier in the Squad gives Grief to every other living soldier in the Squad.
- **How much.** The deaths of one Titan Engagement give each such soldier 1 Grief in total, however many comrades died. So do the deaths of one Skirmish, the deaths of one day passing, and the deaths from one event outside a Titan Engagement together with the Death Rolls that follow its care window. A later procedure, such as a Chase, may state that all deaths during it count as one event. Any other death gives 1 Grief. On top of that:
  - a soldier whose Drive named a dead soldier gains 1 more for that soldier;
  - a soldier with the Numb Scar gains 1 more for each death.

  These additions go only to a soldier who gains Grief from that death.
- **When** (`gaining.timing`, `gaining.applies_after`):
  - For a death during a Titan Engagement or at its end steps: at step 8 when the Titan Engagement ends (section 3.16). Grief does not change Resolve during the fight in which the comrade died.
  - For any other death: immediately after every Fear Roll that death causes has resolved, including each Drive decision and result; immediately if the death causes no Fear Roll.
  - Either way, a death's Grief never applies before that death's own Fear Rolls.
- **Limit.** A soldier holds at most **3** Grief. Grief gained beyond 3 is lost.
- **Effect.** Each point of Grief lowers Resolve by 1, with no floor. Grief has no other effect in the Phase 1 rules.
- **Losing Grief.** No field rule lowers Grief. In Downtime, Visit Haven lowers a soldier's Grief by 2, Honoring the Fallen every soldier's by 1, and the Squadmate relief each Squadmate's by 1 (Chapter 7, section 7.2).
- Retirement, promotion, and a Squadmate leaving the Squad Pool give no Grief. Squadmates gain Grief like player characters.

> **Design note (OQ-52):** Grief goes only to soldiers who held a Position in the Titan Engagement where the death happened. The deaths of one Titan Engagement, one day passing, or one event outside a Titan Engagement give at most 1 Grief, plus 1 for each dead comrade a Drive named. A soldier holds at most 3, and Resolve has no floor. A death's Grief waits for that death's Fear Rolls: applying it first would raise a Stress 2, Resolve 3 witness's chance of losing an action or turn from 50.0% to 66.7%, which is the outcome delaying Grief exists to prevent. The Downtime rules must be able to remove at least 2 Grief per Downtime from a soldier who uses that relief.

## 3.15 Stress in the field

Phase 1 changes Stress in the field only through these rows in `data/core/stress-changes.yaml`:

- **Gains:** a Push, Covering, any table result or Talent that names a gain, and 1 Stress for a failed called roll whose stakes named Stress (`ruling`; Chapter 1, section 1.6; decision batch 9, 9-5). In this chapter the rows that name a gain are some Critical Injury, Stress Response, Fear Roll, and Scar rows.
- **Losses:** the end of a Titan Engagement and a Nape kill, 1 each (ADR-0008; Chapter 1, section 1.6). Chapter 7 adds the Camp Relief at a night camp and the end of a Skirmish, 1 each, and Recover, Visit Haven, and the Squadmate relief in Downtime, 2 each (sections 7.1, 7.2, and 7.4).
- **Minimum:** Stress never drops below the soldier's number of Scars, and rises to a new minimum at once.

Rally clears a lasting Stress Response but never lowers Stress. Hunger on an Expedition is a gain a Chapter 7 rule names (`named-gain`; Chapter 7, section 7.1).

## 3.16 When a Titan Engagement ends

Chapter 5 states when a Titan Engagement ends (section 5.11, `data/engagement/engagement-flow.yaml`, `ending`). When it does, resolve the steps of `data/harm/engagement-end.yaml` in order:

1. Cancel turns spent in advance that have not come up (Chapter 1, OQ-15), along with turns and actions a result would have spent. Every ban on Reactions ends, and every pending Fear Roll result, a forced step or a forced strike not yet made, is cancelled (decision batch 7, 7-8).
2. Apply the end-of-Engagement Stress relief. A Nape kill that ended the Titan Engagement applied its own relief when the kill happened.
3. End every lasting Stress Response gained during the Titan Engagement.
4. Every `turn` time limit becomes `engagement`.
5. Aftermath rolls: each patient with an untreated lethal `engagement` Critical Injury gets at most one aftermath roll, from a treater the players choose, and each soldier makes at most one (section 3.5, *Aftermath rolls*). A success gives back the Critical Injury's Health box as treating does (section 3.5) and can end Down.
6. Every lethal Critical Injury that still has an `engagement` limit runs out and causes a Death Roll, before the care window. These Death Rolls are made outside the Titan Engagement, so a limit the soldier survives becomes `day` (section 3.4). A death at this step causes no Fear Roll.
7. Hold a care window (section 3.5). A lethal Critical Injury stabilized here or at step 5 gives its Scar as usual.
8. Every soldier gains the Grief for the deaths during the Titan Engagement, including deaths at step 6 (section 3.14).
9. Every soldier with five Scars retires, including one who gained the fifth Scar at an earlier step, and a retiring Squadmate leaves the Squad Pool. Left items, and every Blade Set a Fear Roll result dropped during the Titan Engagement, are shared out (Chapter 4, section 4.11; decision batch 8, 8-13). Then promotion replaces, as one batch, every player character who died or retired during the Titan Engagement or at any end step, including step 6, using Chapter 2's contest (section 2.10).

The steps are resolved outside the Titan Engagement. No soldier retires, and no promotion happens, before step 9.

**Momentum and Anchors.** No step above reads either. Every soldier's Momentum becomes 0 and the field, with every zone's rating, is cleared, after the last step above (`momentum_and_anchors`; Chapter 5, section 5.2). A Skirmish has neither.

**Pinned soldiers.** A Titan Engagement does not end by its no-Focus-Titan test while a soldier lies Pinned: the rounds go on until the last Pinned soldier is freed or dies (Chapter 5, section 5.11; decision batch 8, 8-9). Its end frees no one: only the no-soldier-standing test can end it while a soldier is Pinned, and then every Pinned soldier dies, left under the body, whether or not a Focus Titan is alive, as a soldier left to the Titans does, counted for Grief (decision batch 8, 8-21; OQ-157).

**A Skirmish** ends with the same steps, with "Skirmish" in place of "Titan Engagement" (`procedures`, `skirmish`; Chapter 7, section 7.4): the soldiers who took part stand in for those who held a Position, its Stress relief is the end of a Skirmish's 1, every soldier who took part counts as holding the patient's Position for aftermath rolls, and its care window's scope is every soldier who took part.

> **Design note (OQ-54):** The Death Rolls the end of the fight causes come after its aftermath rolls and before its care window, so only treatment during the fight or the patient's one aftermath roll prevents them. Section 3.5 gives the trade that remains when a Squad delays ending a fight (OQ-57). Grief comes after every death the fight caused, including those at its end. Every Retirement and promotion waits for the last step.

### Soldiers who left before the end

A living soldier who left the Titan Engagement while it went on holds no Position in it. Until it ends, they are still in it for every rule in this chapter (`soldiers_who_left`):

- They still take a turn each round, in the order Chapter 5 sets (section 5.3, `data/engagement/round.yaml`). Each of those turns counts for every rule that counts turns, so a `turn` limit keeps running out, and a result can spend the turn.
- For Treat Injury and Rally, for Help and Covering on those rolls, and for aftermath rolls, two soldiers who have both left count as holding the same Position. A soldier who has left never counts as holding the same Position as, or one step from, a soldier who still holds one.
- Every step above applies to them when the Titan Engagement ends.

Chapter 5 states how a soldier leaves a Titan Engagement and what their move and action can do after leaving (section 5.11, `data/engagement/positions.yaml`, `leaving`).

> **Design note (OQ-56):** A soldier who left a Titan Engagement that is still under way keeps taking turns in it, so one clock and one end procedure serve the whole fight. They can treat or Rally another soldier who has also left, and Help or Cover those rolls, and they go through its end steps with everyone else.

## 3.17 Who uses these rules

- **Player characters** use every rule in this chapter.
- **Squadmates** use every rule in this chapter as well (Chapter 2, section 2.10, `rules_applicability`), with three differences that follow from Chapter 2:
  - A Squadmate has no Drive, so it never shrugs off a Fear Roll result.
  - A Squadmate never Pushes, so extra Stress on a Push does nothing for it, and it does not Push a forced strike that falls short.
  - A Squadmate re-rolls a Scar whose trigger is a Push or a Cover.
- **Titans** never take harm from this chapter. They have no Health (ADR-0007), and Chapter 5 gives Body Part States and Regeneration (section 5.7).
- **The sheet.** `data/harm/sheet-fields.yaml` lists what this chapter adds to the character sheet and the Squadmate stat block:
  - how current Health is derived, with no field of its own: Health minus the smaller of Health and the untreated Critical Injuries held, minus Health lost, never below 0, where Health lost is never more than Health minus the boxes crossed off. Only Critical Injuries still held count: one that heals leaves the Critical Injuries list, and goes on the healed list below if its row has permanent effects. The recorded Down state must always match section 3.3's two conditions. On paper, the Health row takes a slash in a box for damage and an X for an untreated Critical Injury; treating erases an X, and a day passing or a revive erases slashes;
  - each Critical Injury's side, Injury Type, treated state, time limit, healing days left, and whether Careful Nursing has halved it, written as one line such as "Right arm, Bite: Bitten Off at the Shoulder, untreated, turn, 28 days";
  - healed Critical Injuries whose rows have permanent effects, each with its side;
  - the lasting Stress Responses held, and when each ends;
  - who has Rallied the soldier outside a Titan Engagement;
  - a pending next-roll penalty;
  - any pending Fear result, a forced step or a forced strike with its Titan, until it is made or ends;
  - how many Blade Sets a Fear Roll result has dropped during the current Titan Engagement, shared out when it ends;
  - whether the soldier has faced a Titan;
  - whether the soldier has killed a person, which the `first-human-kill` Fear Roll trigger reads (Chapter 7, section 7.4);
  - while Pinned, the body that pins them, a limb pin with its limb and side or a body pin, and the pinning Body Part or none (Chapter 5, section 5.7);
  - each prosthetic fitted, with its side (section 3.2);
  - which Critical Injuries have already given a Scar;
  - a pending Retirement, from a fifth Scar or the choice of medical Retirement.

  Promotion keeps every one of these fields in its current state, as it keeps everything else a Squadmate has (Chapter 2, section 2.10; `promotion` in the same file).

> **Design note (OQ-55):** This chapter lists its fields in its own file. Chapter 2's sheet list (`record_on_sheet`) and stat block (`stat_block.fields`) each end with a row that includes `data/harm/sheet-fields.yaml`, and promotion keeps every field in it. Health boxes add no stored field: boxes crossed off are the untreated entries in `critical_injuries`.

**Every act in this chapter has a tracked value and a Catalog entry** (ADR-0024, limit 12; OQ-71), both in `data/character/action-catalog.yaml`.

- Treating a Critical Injury, reviving a Down soldier, and ending Down are `treat-injury`, which changes `critical-injury-treat`, `health-restore`, and `down-end`.
- Clearing a Stress Response is `rally`, which changes `stress-response-clear`.
- Carrying a Down comrade is `lift-comrade`, which changes `comrade-carry`.

The Death Roll is a roll its rule calls for, not an act, so it needs no tracked value. It keeps its Catalog entry, `death-roll`, marked as not an action, so a Talent can name it. No act in this chapter needs the procedure for actions outside the Catalog.

---

## Example: a bad round

*The numbers in this example are for illustration only. Real Attack Dice and Titan attacks come from Chapters 5 and 6, and the rows below follow the YAML files at the time of writing. If the files change, the files govern.*

Private Oskar Wendt has Strength 3 and Agility 3, so Health 5: a row of 5 boxes. He has Instinct 3 and Empathy 3, so Resolve 3. He has Wits 2 and carries his own medical kit, rated 1. His Stress is 1.

- **A Titan attack.** Before Oskar's turn comes up, a Titan's card resolves an attack against him. Its Attack Dice score 2 successes. He dodges, which spends this round's turn, because none of it was spent yet, and scores 1 success, which cancels one: 1 Net Success remains, so the attack lands with no rider. The attack is a Crush Critical Injury, and its Injury Location is rolled: D6 shows 5, torso, which has no side. Had it shown 2, the injury would sit at his right arm, and only a later Critical Injury at that same right arm would add to its roll. He holds no torso Critical Injury, so there is no worsening. 2D6 shows 11: Punctured Lung, the row's Crush name. His sheet reads "Torso, Crush: Punctured Lung, untreated, engagement, 14 days". It is lethal with an `engagement` limit, it does not put him Down, and it gives 1 die less on `fly` and `dodge`. A Titan attack adds nothing to Health lost, but the untreated Punctured Lung crosses off one box: his current Health is 4.
- **A second attack.** A later card that round resolves an attack with a fixed head Injury Location. Its Attack Dice score 2 successes. Oskar has already made his one Reaction against this Titan this round, so his dodge's 1 success cancels one of them, and 1 Net Success remains: it lands, with no rider. 2D6 shows 8: Head Blow, `down: until_treated`. It crosses off a second box, leaving current Health 3, and its row puts Oskar Down. He cannot make Reactions and makes no Fear Rolls. Had Oskar's Health been 2, as it could be before decision batch 13 raised the formula, the Head Blow would have crossed off his last box, and he would be Down from that as well.
- **Treatment.** Private Mila Brandt holds Oskar's Position and has an unspent action. She declares Treat Injury with the treat use on the Head Blow. Wits 2, medical kit 1, and Stress 1 give 4 dice, and she rolls a 6. The Head Blow is treated, and its box comes back: current Health 4. Oskar's current Health is above 0 and no untreated Down row holds him, so Down ends. Ending Down restores nothing, so this round's turn, which his dodge spent, stays spent. Nothing has spent his turn next round, so it will begin with its move and action.
- **The end of the Titan Engagement.** A comrade's Nape strike kills the Titan and ends the Titan Engagement. Every soldier gets the Nape kill relief and the end-of-Engagement relief. Oskar's Stress and Mila's each drop to their minimum of 0.
- **The aftermath roll.** The Punctured Lung is untreated with an `engagement` limit, so Oskar gets one aftermath roll before its Death Roll. Mila still holds his Position, so the players choose her as the treater rather than Oskar himself. Wits 2 and her medical kit give 3 dice at Stress 0, with no 6, and she does not Push. That failure uses up Oskar's attempt: he cannot now roll on himself, and no one could Help or Cover the roll.
- **The Death Roll.** The Punctured Lung still has its `engagement` limit, which now runs out. Oskar rolls Strength 3 with no penalty and gets one 6: he lives. The roll was made outside a Titan Engagement, so the limit becomes `day`. Only a treatment during the fight or a successful aftermath roll could have spared him this roll. The Punctured Lung still crosses off one of his boxes.
- **The care window.** The aftermath roll used up no one's roll in the window, and Oskar, Mila, and Hale all held a Position in the fight, so all three are in its scope. Mila uses treat on the Punctured Lung and fails. Private Hale, who has no medical kit, rolls on it too: Wits 2 at Stress 0 gives 2 dice, with no 6. Hale's Help on Oskar's own roll would have added nothing, because the self-treatment penalty takes Wits 2 plus 1 Bonus Die down to the same 1 base die that Wits 2 alone reaches. Oskar then treats himself with 1 base die and his medical kit's Gear Die: no 6.
- **Later.** When the next day passes (at a night camp once the Expedition rules exist, and until then at the start of the next session, section 3.6) there is a care window before his next Death Roll. If a comrade stabilizes the Punctured Lung then, its box comes back, and Oskar also gains a Scar for surviving it. He rolls D66 on the Scar table, and his minimum Stress and Resolve each rise by 1. If nobody treats it, the day restores no box: a day passing gives back only Health lost to damage, and Oskar has none.
