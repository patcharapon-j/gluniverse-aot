# Chapter 2: Character Creation

This chapter covers how a player creates a soldier of the Survey Corps: the Lifepath from Origin to Graduation and the two built procedures beside it, the Template Build and the Free Build; attributes and the values derived from them; Drives, Specialties, and Talents. It also sets out the Action Catalog that Talents name, and the Squadmates who ride with the player characters.

It builds on Chapter 1. Every roll here follows the dice pool, Push, Stress, and Help rules from that chapter, except where a roll's own procedure lists an exception. Later chapters own these rules, and this chapter only refers to them:

- **Chapter 3, Harm and Mind:** Health, Critical Injuries, Down, Death Rolls, Stress Responses, Fear Rolls, Scars, Grief, and Retirement.
- **Chapter 4, Gear:** ODM Gear, Gas Rolls, Blade Sets, horses, carrying and Overloaded, and Standard Issue.
- **Chapter 5, Titan Engagement:** Positions and Position steps (section 5.2), Attention (section 5.6), Openings (section 5.7), Read and Call It (section 5.8), the Grab (section 5.9), and Wings in a Titan Engagement (section 5.3).
- **Chapter 7, Playtest Rules:** Expeditions, Legs, and Night Camps (section 7.1), Downtime (section 7.2), Requisition (section 7.3), and Skirmishes (section 7.4).

Some content is not yet written: XP and how Talents are bought after creation, the Train Downtime Action, Rank and Commendations, the Funding rules, Faction Standing, Chases, the Canon Clock, and Operation Frames. This chapter mentions them only where creation has to.

**Tables.** Every table in this chapter is a YAML file in `data/character/`. Those files are the only source of truth (ADR-0012). The chapter's tables are rendered from them by `tools/render/render.py`, between `BEGIN RENDERED` and `END RENDERED` markers that name each block's source file; nothing between the markers is written by hand, and `render.py check` fails if a rendered block and its YAML differ. Each table appears where its procedure uses it, except the Talents and the Action Catalog, which are in Appendix 2A at the end of the chapter. The files are:

- `data/character/lifepath.yaml`: the three creation procedures and the campaign choice that allows them, the order of each procedure's steps, how shared choices are settled, and what goes on the character sheet.
- `data/character/attributes.yaml`: the six attributes, the creation limits of the Lifepath and of the built procedures, and derived values.
- `data/character/origins.yaml`: the Origin table (D66).
- `data/character/enlistment.yaml`: the Why You Enlisted table (D66) with its Drives, and the rules every Drive follows.
- `data/character/training-years.yaml`: the three Training Year event tables (D66), curriculum lists, and the performance roll.
- `data/character/class-rank.yaml`: Merit to Class Rank, what a Top 10 Class Rank does, and what a built or promoted soldier records instead.
- `data/character/graduation-exam.yaml`: the optional Graduation Exam, its three Stages, the six Trials each Stage can run, and the conditions they are run under.
- `data/character/specialties.yaml`: the nine Specialties.
- `data/character/talents.yaml`: the Phase 1 Talent list.
- `data/character/action-catalog.yaml`: the Action Catalog, the gear rule, its tracked values, and the procedure for actions outside it.
- `data/character/squadmates.yaml`: Squadmate stat blocks, rules, actions, Wings, the starting Squad, and promotion.

This chapter also adds two rows to Chapter 1's files:

- `data/core/dice-pool.yaml`, under `roll_exceptions`: the performance roll. Chapter 1 lets a roll leave out Stress Dice when its own rule names it and it has a row there (OQ-03).
- `data/core/stress-changes.yaml`, under `reductions`: the end of the Graduation Exam, following section 1.6's "a later chapter adds a row" pattern.

It changes no Chapter 1 rule. A few reference texts in those files now point to this chapter's data.

Where the ADRs left a question open, the rule below cites its entry in `docs/rules/OPEN-QUESTIONS.md` as (OQ-nn). Every entry this chapter cites was decided on 2026-09-14 (`docs/rules/DECISIONS-2026-09-14.md`), except the entries of decision batch 7 (OQ-135 and later), decided on 2026-09-15 under *Batch 7* in the same file, and the text states the decided rule. OQ-58 was decided the same day, under *Conformance follow-up* in that file, and OQ-70 and OQ-71 under *Batch 2*. Design notes give the reasons.

---

## 2.1 What a soldier is made of

Every player character is a graduate of the Training Corps who has joined the Survey Corps. A player creates one by one of three procedures: the Lifepath (section 2.3), which is always allowed, or the Template Build or the Free Build (section 2.11), when the campaign allows them (`procedures` and `campaign_choice` in `data/character/lifepath.yaml`). `record_on_sheet` in the same file lists everything the character sheet holds. In brief:

- **Attributes:** Strength, Agility, Wits, Perception, Instinct, and Empathy (section 2.2).
- **Derived values:** Health, kept as a row of boxes, Resolve, Stress, and minimum Stress (section 2.2).
- **Origin and Haven:** where the soldier grew up, and what they have to return to (section 2.3.1).
- **Drive:** what keeps them fighting, written as a trigger, and whether it has been used this session (sections 2.3.2 and 2.5).
- **Merit and Class Rank:** how they performed in the Training Corps (sections 2.3.3 and 2.3.4), or none for a soldier made with the Template Build or the Free Build and for a promoted Squadmate (`record_on_sheet_built`; sections 2.10 and 2.11).
- **Specialty:** their trained specialization (section 2.6).
- **Talents:** narrow trained abilities, each naming the Action Catalog entries it applies to (sections 2.7 and 2.8). A once-per-Titan-Engagement Talent's use is recorded on the sheet beside that Talent.
- **Canon Tie:** an optional personal link to one canon character (section 2.3.1).
- **Rank:** every new soldier is a Private. The Rank rules are not yet written.
- **Harm:** Health lost to damage, whether the soldier is Down, Scars, Grief, and Critical Injuries. A new soldier has none of them. Chapter 3 adds further harm and mind fields in `data/harm/sheet-fields.yaml`, which `record_on_sheet` names as its last row (OQ-55).
- **Gear:** Standard Issue (Chapter 4).

Talents are the only trained abilities a soldier has. A roll is an attribute plus at most one Talent that names the roll's Action Catalog entry, plus Bonus Dice, Gear Dice, and Stress Dice (Chapter 1, section 1.3; ADR-0006).

## 2.2 Attributes and derived values

### The six attributes

The table below lists the six attributes, a summary of what each covers, and the Action Catalog entries that name each one. The summary is for players. Which attribute a roll uses is set only by its Action Catalog entry (section 2.8).

<!-- BEGIN RENDERED: attributes from data/character/attributes.yaml -->
| Attribute | Covers | Action Catalog entries that name it | Key attribute of |
|---|---|---|---|
| Strength | Force, cutting power, and physical endurance. | Nape strike, Body Part strike, Break Free, Heave, Block, Fight, Endure, Death Roll | Slayer, Brawler |
| Agility | Quickness, balance, and control on ODM Gear or in the saddle. | Dodge, Fly, Leap Clear, Ride, Sneak, Shoot | Flier, Rider |
| Wits | Planning, mechanics, and medicine. | Treat Injury, Field Repair, Recall | Medic, Engineer |
| Perception | Noticing, aiming, and placing a decoy where a Titan will look. | Break Attention, Spot | Hunter |
| Instinct | Gut calls, survival, reading people, and Reading Titans. | Read, Size Up, Survive | Tactician |
| Empathy | Steadying comrades and moving people to act. | Rally, Persuade | Leader |
<!-- END RENDERED: attributes -->

- Attributes are rated **2 to 5**. The key attribute of the soldier's Specialty is the only one that can be rated **6** (ADR-0006).
- **Attributes never rise after creation**, whichever procedure made the soldier (ADR-0011). A soldier grows through Talents and Scars instead.

### How the Lifepath sets attribute ratings

1. Every attribute starts at **2**.
2. The Lifepath adds **6 points**, each to a named attribute: 2 from the Origin, 1 from Why You Enlisted, and 1 from each Training Year's event. Every one of these points comes from a rolled row.
3. **Before Graduation, no attribute can go above 5.** A point that would raise an attribute above 5 goes instead to another attribute rated below 5, chosen by the player.
4. **At Graduation**, after choosing a Specialty, in this order (`creation.graduation`):
   1. **Swap.** If any other attribute is rated higher than the key attribute, swap the key attribute's rating with the highest rating among the other five. If several share that rating, the player picks one. The key attribute now holds the soldier's highest rating.
   2. **Floor.** If the key attribute is still below 4, raise it to 4. For each point added, the player lowers by 1 another attribute rated 3 or more. This happens only when every attribute is 3.
   3. **Top 10.** If the soldier's Class Rank is Top 10, the key attribute gains **1**, to a maximum of 6.
5. There are no free points. The swap and the floor never change the total, so every new soldier has 18 attribute points, or 19 with a Top 10 Class Rank.

> **Design note (OQ-19):** A new soldier's attributes come from 6 rolled Lifepath points on a base of 2, a Graduation swap and floor that give the key attribute the soldier's highest rating and at least 4 without adding points, and +1 to the key attribute for a Top 10 Class Rank. In simulation the key attribute ends at 4 about 64% of the time, at 5 about 34%, and at 6 about 2%, only through a Top 10 Class Rank. Because the swap always moves the highest rating into the key attribute, these figures hold whichever Specialty the player chooses, and no player strategy changes them. The other five attributes average about 2.7. This follows ADR-0014, as amended, whose default Squad is all Rookies (key attribute 4, other attributes 3 with one at 2), with the reference Rookie having the Slayer template's attributes (Strength 4, Agility 3, Wits 2, and 3 elsewhere) and Talent 1 in the Talent that names the Nape strike, the Body Part strike, Break Free, or Treat Injury (OQ-58, OQ-70; decision batch 2b), and the Veteran at Strength 5, Agility 3, Wits 2, and 3 elsewhere, 19 points (OQ-71). No other roll a target measures carries Talent dice, including the dodge, Fly, Break Attention, Ride, and Read (OQ-94). It leaves 5 and 6 reachable, as ADR-0006 and ADR-0011 require. Health and Resolve come from the final ratings, after the swap. The swap costs some Hunters, Medics, and Engineers Health and Resolve: about 11% of them have Health 2, and a Health 2 soldier is Down by their second untreated Critical Injury (Chapter 3). That cost is accepted. Beside the reference builds, the simulator reports every target that depends on Health for the reference Squad with each soldier's Health set to 3 and nothing else changed, and reports the Health 2, 5, and 6 builds Chapter 3 quotes (OQ-58, OQ-71). It reports the Talent-dependent targets for a Squad built literally from the Squadmate templates as well (OQ-70). The Template Build and the Free Build stay inside this envelope: 18 points, the key attribute at 4, and no 5 or 6 (section 2.11, OQ-135).

### How a built soldier's attribute ratings are set

A soldier made with the Template Build or the Free Build (section 2.11) uses none of the steps above: no rolled points, no swap, no floor, and no Top 10 bonus. Its ratings follow `creation.built` in `data/character/attributes.yaml`:

- Every built soldier has **18 points**, with every attribute rated **2 to 4**, the key attribute at exactly **4**, and **at most two attributes at 4**.
- **Template Build:** record the chosen Specialty's template ratings from section 2.10, unchanged (`template_build`). Only the ratings are taken, not the template's Talent.
- **Free Build:** those limits allow exactly two shapes, 4, 3, 3, 3, 3, 2 and 4, 4, 3, 3, 2, 2 (`free_build.shapes`). Choose one and place its six ratings on the six attributes, one each, in any order that puts a 4 on the key attribute.

### Derived values

`data/character/attributes.yaml` (`derived_values`) gives each formula and its rounding:

- **Health** is half of Strength plus Agility, kept as a row of that many boxes (Chapter 3). Chapter 3 says what Health does: each untreated Critical Injury crosses off one box, up to Health; damage marks the boxes left; at 0 the soldier is Down. ADR-0005 has Titan attacks bypass it.
- **Resolve** is half of Instinct plus Empathy, plus 1 per Scar, minus 1 per point of Grief, counting at most 3 points of Grief. At creation the soldier has no Scars and no Grief. Chapter 3 says what Resolve does.
- **Stress** starts at 0, which is the minimum Stress of a soldier with no Scars (Chapter 1, section 1.6).
- **Carrying limit:** Strength + 4 items before the soldier is Overloaded (Chapter 4).

Health and Resolve both round the halved attributes up, and both are computed from the final attributes, after the Graduation swap and floor, or from the ratings a built soldier records (OQ-24).

## 2.3 The Lifepath

The Lifepath takes a Cadet from their Origin through three Training Years to Graduation. Players create their characters together, step by step, because the optional Graduation Exam (section 2.4) and the starting Squad (section 2.10) involve every character at once. `data/character/lifepath.yaml` (`steps`) gives the order and exactly what each step records.

**Beside the Lifepath.** The Lifepath is always allowed. At session zero, before the campaign's first soldier is created, the GM records once whether the campaign also allows the Template Build, the Free Build, or both (`campaign_choice`). The choice never changes, and it covers every soldier created in the campaign, including a new character for a player whose soldier dies or retires. Each player picks any allowed procedure for their own soldier, so one table can mix rolled and built soldiers. Section 2.11 gives the two built procedures; a built soldier joins the Squad at the same moment as everyone else (section 2.3.5).

**The GM plays no part in the Lifepath beyond reading tables with the players.** Every result comes from a roll, a table row, or a choice the table gives the player.

**Shared choices.** Some choices belong to the players together: whether to run the Graduation Exam, the Campaign Year, how many starting Squadmates to take when fewer than the rule gives are proposed (section 2.10), and the templates of starting Squadmates. When players disagree, each proposed choice is rolled for once, with a D6 rolled by one player who proposed it. The highest roll decides, and choices tied for highest roll again (`group_choices`). The order of Cadets in a Trial is rolled, not chosen (section 2.4).

### Before the Lifepath: the Campaign Year and the Exam vote

1. **Campaign Year.** If the campaign has not yet recorded one, the players record the Campaign Year, from 845 to 850: the year the campaign begins. It changes only when a rule names a change. No Phase 1 rule does; the Canon Clock rules, not yet written, will advance it. Every Origin condition is tested against the current Campaign Year, so a character created or promoted later uses the year the campaign has reached (OQ-32).
2. **Exam vote.** The players decide whether to run the Graduation Exam (section 2.4). A replacement character created later decides before rolling their own Lifepath, and takes the Exam alone (OQ-22).

### 2.3.1 Origin

1. Set every attribute to 2.
2. Roll D66 on the Origin table below. If the row has a condition that the current Campaign Year does not meet, roll again.
3. Add 1 to each of the row's two attributes.
4. Take level 1 in one of the row's **four** Talents.
5. Record one of the row's **three** Havens. A Haven is what the soldier has to return to. The Visit Haven Downtime Action uses it to lower the soldier's Stress and Grief (Chapter 7, section 7.2).
6. If the row has a Canon Tie, the player may record it.

A Canon Tie is optional and has no mechanical effect in the Phase 1 rules. A soldier can have at most one, and the only way to gain one is from an Origin row. The Canon Clock rules, not yet written, may give Canon Ties effects, and will decide what happens to a tie whose canon character is dead or absent when the campaign starts (OQ-32).

<!-- BEGIN RENDERED: origins from data/character/origins.yaml -->
**Origin (D66)**

| D66 | Origin | +1 to each | Talent level 1 in one of | Haven, one of | Canon Tie (optional) | Keep the row only with | Description |
|---|---|---|---|---|---|---|---|
| 11–13 | Shiganshina District | Agility, Instinct | Quiet Step or Slip Away or Wirework or Light Sleeper | A younger sibling you promised to look after<br>A childhood friend now serving in the Garrison<br>The street you grew up on, and the neighbours still living down it | Hannes: The Garrison soldier at the district gate who knew every child on your street. | no condition | A childhood in the walled district on Wall Maria's southern face, watching Survey Corps columns ride out through the outer gate. |
| 14–16 | Wall Maria Refugee | Strength, Instinct | Hard to Kill or Fieldcraft or Will to Live or Strong Back | A younger sibling still living in the camps<br>The farm family who took you in<br>The other children off the boats, scattered now across Wall Rose | Armin Arlert: Another refugee child from Shiganshina who stood in the same bread line. | Campaign Year 848 or later | Fled north by boat when Wall Maria fell in 845, then grew up hungry in the refugee camps of Wall Rose. |
| 21–23 | Trost Merchant Family | Wits, Empathy | Silver Tongue or Steady Voice or Book Learning or Judge of Character | The family shop<br>A sweetheart who works the market square<br>The old shopkeeper two streets over who taught you the trade | none | no condition | Raised at a shop counter in Trost District, the southern gate town of Wall Rose. |
| 24–26 | Wall Rose Farm | Strength, Perception | Strong Back or Horsemanship or Long Haul or Keen Eyes | The family farm<br>A grandparent too old to work the fields<br>The village the farm sells to, and its harvest fair | none | no condition | Hauled grain, mended fences, and drove the cart to market on farmland inside Wall Rose. |
| 31–33 | Forest Hunting Village | Perception, Instinct | Keen Eyes or Lure or Fieldcraft or Quiet Step | A parent who still hunts the old forest<br>The village elder who taught you to track<br>The dog you raised from a pup, still waiting at the village | Sasha Braus: A hunter's daughter from a mountain village much like yours, met at a market fair. | no condition | Learned to track game and move quietly through the trees in a mountain village that lived by the bow. |
| 34–36 | Garrison Family | Strength, Wits | Gearwright or Make Do or Know the Stores or Iron Nerve | A parent who still serves on the Wall<br>The barracks family that raised you<br>The gun crew who let you climb the Wall as a child | none | no condition | The child of a Garrison soldier, raised in barracks housing among the Wall's lifts and cannon. |
| 41–43 | Underground City | Agility, Instinct | Quiet Step or Grip Breaker or Underground Instincts or Hand-to-Hand | Friends still living below<br>The one adult who got you out<br>The tavern keeper below who feeds anyone who asks | none | no condition | Born in the lightless streets beneath Mitras, where a soldier's pay and a bunk were the only way to reach the surface for good. |
| 44–46 | Interior Merchant House | Wits, Empathy | Book Learning or Titan Reader or Silver Tongue or Put In a Word | A sibling who writes to you every month<br>The family townhouse, if they will still open the door<br>The tutor who taught you your letters and never took the family side | none | no condition | Raised among ledgers and guild dinners in a rich merchant family inside Wall Sina, who never forgave you for enlisting. |
| 51–53 | Minor Noble House | Empathy, Agility | Horsemanship or Judge of Character or Sure Seat or Silver Tongue | An old family servant who raised you<br>A cousin who still speaks to you<br>The horse you were given as a child, still in the family stable | none | no condition | A younger child of a lesser noble family, taught riding and manners and then left free to throw your life away. |
| 54–56 | Church Orphanage | Empathy, Strength | Steady Voice or Iron Nerve or Careful Nursing or Shoulder the Load | The orphanage and the children still in it<br>The priest who raised you<br>The chapel itself, and the one hour a week it is quiet | none | no condition | Raised by the Church of the Walls after losing your parents, the eldest of a crowded dormitory of children. |
| 61–63 | Doctor's Household | Wits, Perception | Field Medicine or Careful Nursing or Book Learning or Sure Hands | Your parent's clinic<br>A patient who owes you their life<br>The town the clinic serves, which still knows your name | none | no condition | Grew up fetching bandages and holding patients still for a town doctor. |
| 64–66 | Horse Ranch | Agility, Perception | Horsemanship or Loose the Horse or Sure Seat or Keen Eyes | The ranch and its horses<br>A sibling who still trains the young horses<br>The stable hand who taught you to ride before you could walk | none | no condition | Raised on a ranch on the plains of Wall Rose that breeds horses for the military. |
<!-- END RENDERED: origins -->

### 2.3.2 Why You Enlisted

1. Roll D66 on the Why You Enlisted table below.
2. Add 1 to the rolled row's attribute.
3. Record the rolled row's Drive, or instead the Drive of any other row. Choosing another row's Drive never changes which attribute gained the point (`use`). Section 2.5 explains how Drives work.

A Drive whose row says it needs a named comrade names its comrade when the Squad forms (section 2.3.5).

<!-- BEGIN RENDERED: why-you-enlisted from data/character/enlistment.yaml -->
**Why You Enlisted (D66)**

| D66 | Why you enlisted | +1 | Drive | Trigger | Test | Acts | Target | Needs a named comrade |
|---|---|---|---|---|---|---|---|---|
| 11–13 | A Titan killed someone you loved, and you watched it happen. | Strength | Vengeance | When I made a Nape strike or a Body Part strike on my most recent turn. | `most_recent_turn` | Nape strike, Body Part strike | `any` | no |
| 14–16 | You want to see what lies beyond the Walls, and to learn what Titans are. | Perception | Beyond the Walls | When I made a Read on my most recent turn. | `most_recent_turn` | Read | `any` | no |
| 21–23 | Someone you could not let go alone was enlisting, so you enlisted too. | Empathy | Stay Beside Them | When I Helped my named comrade's roll, Covered their Push, or took Lift Comrade on them since the start of my most recent turn. | `since_most_recent_turn_start` | Help, Cover, Lift Comrade | `named_comrade` | yes |
| 24–26 | A soldier once gave their life to save yours, and you mean to repay it. | Agility | Pay It Forward | When I Helped, Covered, treated, lifted, or struck to free a comrade who was Grabbed or Down, since the start of my most recent turn. | `since_most_recent_turn_start` | Help, Cover, Treat Injury, Lift Comrade, Break Free, Body Part strike | `grabbed_or_down_comrade` | no |
| 31–33 | Nobody believed you would survive the Training Corps, let alone a Titan. | Agility | Prove Them Wrong | When I hold Blind Spot or On Body, having moved there myself. | `own_state` | none | `any` | no |
| 34–36 | Your family has always served, and you were raised to put the soldier beside you first. | Empathy | Duty | When I Helped a roll or Covered a Push since the start of my most recent turn. | `since_most_recent_turn_start` | Help, Cover | `any` | no |
| 41–43 | You want to stand between the Titans and the people living inside the Walls. | Strength | Shield the Walls | When I took Draw Attention on my most recent turn. | `most_recent_turn` | Draw Attention | `any` | no |
| 44–46 | The Training Corps meant three meals a day and a bed, and you mean to live to enjoy them. | Instinct | Full Belly | When I dodged since the start of my most recent turn. | `since_most_recent_turn_start` | Dodge | `any` | no |
| 51–53 | Humanity will lose until someone learns how Titans can be beaten. | Wits | Knowledge | When I made a Read or a Body Part strike on my most recent turn. | `most_recent_turn` | Read, Body Part strike | `any` | no |
| 54–56 | Everything you had is already gone. | Instinct | Nothing Left | When I Pushed a roll since the start of my most recent turn. | `since_most_recent_turn_start` | Push | `any` | no |
| 61–63 | You made a promise to someone who did not live to see you keep it. | Perception | The Promise | When I took Break Attention on my most recent turn. | `most_recent_turn` | Break Attention | `any` | no |
| 64–66 | Living inside the Walls felt like living in a cage. | Wits | Freedom | When I am airborne on ODM Gear through my own ODM use. Chapter 4 defines when a soldier is airborne. | `own_state` | none | `any` | no |
<!-- END RENDERED: why-you-enlisted -->

### 2.3.3 Training Years

Each of the three Training Years is resolved the same way, using its own event table in *The Training Year tables* below.

1. **Event.** Roll D66 on the year's `events`.
   - Add 1 to the event's attribute.
   - Gain 1 level in one of the event's **three** Talents, **or** in any Talent on that Training Year's `curriculum` list of ten.
   - Add the event's `merit_change` to the Cadet's Merit. It can be negative.
2. **Performance roll.** The Cadet makes the year's performance roll and adds the Merit it earns (see below).

**Talent levels during the Lifepath.** No Talent can be above level 2 at creation (ADR-0006), and a rule Talent cannot go above its `max_level` in `data/character/talents.yaml`, usually 1.

**Choosing a Talent.** The event's own three Talents are what its fiction trained; the year's `curriculum` list is open beside them whether or not the event's three can gain a level (`talent_cap.curriculum_always_open`). Every Training Year therefore offers at least **twelve** Talents to choose between, so two Cadets who roll the same event need not leave it with the same Talent. The Origin's four and Graduation's twenty or twenty-one (section 2.3.4) do the same work at the other two steps.

Every Origin row and every event offers at least one Talent that names an entry a current rule uses. A Talent that names only dormant entries (section 2.8) does nothing until later rules call for them. A player may still take it.

One fallback remains, for a Cadet whose whole year is capped (`talent_cap` in `data/character/training-years.yaml`; OQ-20): if no Talent on either list can gain a level, because each is at level 2 or at its `max_level`, the Cadet takes 1 level in any Talent that can gain one.

A new player character gains exactly 5 Talent levels: 1 from the Origin, 3 from the Training Year events, and 1 from the Specialty (`talent_levels_at_creation` in `data/character/lifepath.yaml`). Widening the lists changes which Talents a soldier can end with, never how many.

No Action Catalog entry is dormant or reserved now: the eight rolls that once waited for rules not yet written, and Fight and Block, are called by Chapter 7's playtest rules (decision batch 7, 7-14, 7-16, 7-17). No Origin or event choice offers only Talents that name dormant or reserved entries, and because the curriculum is always open no Cadet is ever forced to take a level in such a Talent (OQ-33). The fallback stays for entries later rules add.

### The Training Year tables

<!-- BEGIN RENDERED: training-years from data/character/training-years.yaml -->
| Training Year | Performance attributes | Curriculum |
|---|---|---|
| First Year, Conditioning and Discipline | Strength and Instinct | Iron Nerve, Long Haul, Strong Back, Hard to Kill, Grip Breaker, Quiet Step, Hand-to-Hand, Will to Live, Steady Heart, Shoulder Charge |
| Second Year, ODM Gear and the Blade Set | Agility and Perception | Clean Cut, Hamstringer, Slip Away, Wirework, Gearwright, Lure, Blade Discipline, Well-Kept Rig, Light Trigger, High Vantage |
| Third Year, Field Exercises | Wits and Empathy | Titan Reader, Field Medicine, Steady Voice, Keen Eyes, Horsemanship, Judge of Character, Fieldcraft, Route Finder, Carrying Voice, Wide Awareness |

A Talent marked dormant or reserved names only dormant or reserved Action Catalog entries (section 2.8).
<!-- END RENDERED: training-years -->

<!-- BEGIN RENDERED: training-year-events year-1 from data/character/training-years.yaml -->
**First Year, Conditioning and Discipline: events (D66)**

| D66 | Event | +1 | Talent level in one of | Merit | Description |
|---|---|---|---|---|---|
| 11–13 | The first inspection | Instinct | Iron Nerve or Long Haul or Steady Heart | +1 | An instructor screamed a finger's width from your face on the first morning, and you did not flinch. |
| 14–16 | Found in the storehouse | Agility | Quiet Step or Slip Away or Underground Instincts | -1 | You were found stealing bread from the storehouse and ran laps until you collapsed. |
| 21–23 | Upside down in the harness | Agility | Wirework or Slip Away or Mid-Air Catch | 0 | You hung upside down in the balance harness on the first day and practiced every night until you could hold it. |
| 24–26 | The storm march | Strength | Strong Back or Long Haul or Shoulder the Load | +1 | On a mountain march in a storm you carried a Cadet who collapsed the last five kilometers. |
| 31–33 | Top of the written test | Wits | Book Learning or Titan Reader or Know the Stores | +1 | You placed first in the class on the written tactics test. |
| 34–36 | A winter in the infirmary | Wits | Field Medicine or Hard to Kill or Careful Nursing | -1 | A fall from the obstacle course fractured your wrist, and you spent the winter helping the infirmary staff. |
| 41–43 | A fight in the barracks | Strength | Hand-to-Hand or Grip Breaker or Menace | 0 | A barracks argument turned into a fight, and you finished it. |
| 44–46 | Fire in the stables | Perception | Keen Eyes or Horsemanship or Light Sleeper | +1 | On night watch you smelled smoke from the stables before anyone else and raised the alarm. |
| 51–53 | A homesick bunkmate | Empathy | Steady Voice or Judge of Character or Campfire Talk | 0 | You talked a homesick Cadet out of deserting on their first winter night. |
| 54–56 | Stable duty | Perception | Horsemanship or Fieldcraft or Horse Whistle | 0 | You were assigned to the stables for a month and learned every horse by name. |
| 61–63 | Three days alone | Instinct | Fieldcraft or Iron Nerve or Forager | +1 | The survival exercise left you alone in the woods for three days, and you came back first. |
| 64–66 | The dismissal list | Empathy | Silver Tongue or Iron Nerve or Put In a Word | -1 | Your name went on the dismissal list, and you argued your way off it. |
<!-- END RENDERED: training-year-events year-1 -->

<!-- BEGIN RENDERED: training-year-events year-2 from data/character/training-years.yaml -->
**Second Year, ODM Gear and the Blade Set: events (D66)**

| D66 | Event | +1 | Talent level in one of | Merit | Description |
|---|---|---|---|---|---|
| 11–13 | The wooden nape | Strength | Clean Cut or Relentless or Ready Blade | +2 | On your first run of the Titan dummy course you cut the wooden nape clean through. |
| 14–16 | A snapped wire | Instinct | Slip Away or Hard to Kill or Mid-Air Catch | -1 | An anchor wire snapped mid-swing and dropped you through the branches, and you walked away from it. |
| 21–23 | Workshop duty | Wits | Gearwright or Well-Kept Rig or Spare Parts | 0 | You took apart a Cadet's jammed ODM Gear and rebuilt it before the morning drill. |
| 24–26 | The gas race | Agility | Wirework or Light Trigger or Quick Refit | 0 | You raced another Cadet through the training forest and emptied your canister doing it. |
| 31–33 | Paired with the best | Perception | Hamstringer or Wirework or High Vantage | +1 | You were paired with the best in the class on ODM Gear and learned by watching every swing. |
| 34–36 | Three Blade Sets in a week | Wits | Blade Discipline or Gearwright or Make Do | -1 | You ruined three Blade Sets in one week, and the instructors had you sharpen for the whole class. |
| 41–43 | From saddle to trees | Agility | Horsemanship or Sure Seat or Hard Rider | +1 | You mastered firing your anchors from horseback and swinging straight into the trees. |
| 44–46 | The decoy drill | Perception | Lure or Loose the Horse or Flare Discipline | +1 | In the decoy drill you pulled the instructors' mock Titan crew off your squad with a flare. |
| 51–53 | Thrown in the yard | Strength | Hand-to-Hand or Grip Breaker or Headlock | +1 | In hand-to-hand training you threw a Cadet twice your size. |
| 54–56 | Frozen on the high wires | Empathy | Iron Nerve or Steady Voice or Gallows Humour | -1 | You froze on the high wires, and an instructor had to talk you down one anchor at a time. |
| 61–63 | The repair drill | Instinct | Gearwright or Quick Refit or Know the Stores | 0 | In the timed repair drill you found a fault in your gear by feel, with your eyes shut. |
| 64–66 | Coaching the course | Empathy | Hamstringer or Carrying Voice or Formation Drill | +1 | You coached a struggling squad through the dummy course until every one of them passed. |
<!-- END RENDERED: training-year-events year-2 -->

<!-- BEGIN RENDERED: training-year-events year-3 from data/character/training-years.yaml -->
**Third Year, Field Exercises: events (D66)**

| D66 | Event | +1 | Talent level in one of | Merit | Description |
|---|---|---|---|---|---|
| 11–13 | The signal relay | Perception | Keen Eyes or Horsemanship or Flare Discipline | +1 | On a mock formation ride you relayed every signal flare without a single mistake. |
| 14–16 | Taking command | Empathy | Carrying Voice or Unshaken Command or Sharp Call | +2 | When your exercise squad leader was ruled dead, you took command and brought the squad home. |
| 21–23 | The mock casualty | Wits | Field Medicine or Sure Hands or Triage | +1 | You kept a mock casualty alive through a timed treatment drill in the rain. |
| 24–26 | The adopted plan | Wits | Titan Reader or Sharp Call or Route Finder | +1 | The instructors adopted your route plan for the whole class's field exercise. |
| 31–33 | Lost at night | Instinct | Fieldcraft or Wide Awareness or Route Finder | 0 | Your squad got lost on the night exercise, and you found the way back by the stars. |
| 34–36 | Arguing with an instructor | Empathy | Wide Awareness or Silver Tongue or Stand Down | -1 | You told an instructor his exercise plan would get everyone killed. You were right, and you were punished for it. |
| 41–43 | The notebook | Perception | Titan Reader or Book Learning or Saw It Coming | 0 | You filled a notebook with sketches from the Titan lectures, noting how each kind moved. |
| 44–46 | An afternoon on the Wall | Instinct | Titan Reader or Hunter's Eye or Judge of Character | 0 | On cannon drill atop an outer district's wall you watched a Titan wander the plain beyond it for an entire afternoon. |
| 51–53 | The falling Cadet | Agility | Wirework or Shoulder the Load or Mid-Air Catch | 0 | A Cadet's anchor tore loose in the forest exercise, and you reached them before they hit the ground. |
| 54–56 | The forced march | Strength | Strong Back or Long Haul or Stay With the Column | +1 | You carried half your squad's gear on the final forced march. |
| 61–63 | The rescue drill | Strength | Pry Loose or Grip Breaker or Not Like This | +1 | In the rescue drill you pried a dummy loose from a mock Titan's grip before the whistle. |
| 64–66 | The runaway wagon | Agility | Rescue Ride or Horsemanship or Hard Rider | -1 | You left formation to ride down a runaway supply wagon and were disciplined for it. |
<!-- END RENDERED: training-year-events year-3 -->

### The performance roll

The performance roll is an attribute roll made for the Action Catalog entry `performance-roll`.

- **Attribute:** the higher of the year's two `performance_attributes`. If they are equal, the player picks. Each of the six attributes is a performance attribute in exactly one Training Year.
- **Pool:** attribute dice only, with no Talent dice, Bonus Dice, Gear Dice, or Stress Dice. It cannot be Pushed or Helped. These exceptions are the `performance-roll` row under `roll_exceptions` in `data/core/dice-pool.yaml`.
- **Merit:** find the row of the table below that includes the roll's successes. It gives 0, 1, 2, or 3 Merit, and 3 for three or more successes.
- **No retry.** Each Training Year has exactly one performance roll. It can never be tried again (Chapter 1, section 1.1, item 4).

<!-- BEGIN RENDERED: performance-merit from data/character/training-years.yaml -->
| Performance roll successes | Merit |
|---|---|
| 0 | 0 |
| 1 | 1 |
| 2 | 2 |
| 3 or more | 3 |
<!-- END RENDERED: performance-merit -->

If the players voted to run the Graduation Exam, it replaces the third year's performance roll. The third year's event still happens (section 2.4).

> **Design note (OQ-21):** Performance rolls use the attribute alone and cannot be Pushed, so a Cadet's Merit reflects their attributes and their events rather than their Stress. The Cadet has no Stress to roll during the Lifepath anyway.

### 2.3.4 Graduation

Resolve Graduation in this order (`graduation` step in `data/character/lifepath.yaml`):

1. **Class Rank.** Add up the Merit from all three Training Years. Find the row of the Class Rank table below that includes the total, and record its Class Rank. Several graduates can share a Class Rank.
2. **Specialty.** The player chooses one of the nine Specialties (section 2.6). It is not rolled and has no requirement.
3. **Swap and floor.** Apply the swap and then the floor to the Specialty's key attribute (section 2.2).
4. **Top 10.** If the Class Rank row says Top 10:
   - The graduate is offered a place in the Military Police and declines it. Record "Declined the Military Police".
   - The key attribute gains 1, to a maximum of 6.
5. **Specialty Talent.** Gain 1 level in one Talent on the Specialty's list **or on the general list** (section 2.6), to a maximum of level 2. That is 20 Talents to choose between, or 21 for a Leader.

<!-- BEGIN RENDERED: class-rank from data/character/class-rank.yaml -->
| Merit total | Class Rank | Top 10 |
|---|---|---|
| 0 or less | 180 | no |
| 1 | 150 | no |
| 2 | 120 | no |
| 3 | 90 | no |
| 4 | 55 | no |
| 5 | 25 | no |
| 6 | 10 | yes |
| 7 | 7 | yes |
| 8 | 4 | yes |
| 9 | 2 | yes |
| 10 or more | 1 | yes |
<!-- END RENDERED: class-rank -->

> **Design note (OQ-21):** A Top 10 Class Rank needs a Merit total of 6 or more. In simulation that is about 6% of Cadets, and about 15% reach 5 or more. The events' `merit_change` values favour Strength and Perception events over Agility ones; that decides which Cadets reach the Top 10, not what any Specialty can hold, and it is accepted as written. The Military Police offer is always declined because the game is about the Survey Corps. The +1 to the key attribute gives the offer a mechanical reason to matter, and it is the only way to reach an attribute of 6. Class Rank has no other effect in the Phase 1 rules. The Rank and Commendations rules, not yet written, may use it.

### 2.3.5 Finishing the soldier and joining the Squad

A soldier made with the Template Build or the Free Build finishes with these same steps, after recording Merit none and Class Rank none (section 2.11; `built_and_promoted` in `data/character/class-rank.yaml`).

1. **Derived values.** Record Health as a row of that many boxes, Resolve, Stress 0, and minimum Stress 0 (section 2.2).
2. **Rank.** Record Private.
3. **Harm.** Record Health lost 0, not Down, no Scars, Grief 0, and no Critical Injuries.
4. **Gear.** The soldier receives Standard Issue as Chapter 4 states.
5. **Name** the soldier.

Once every player character is finished:

6. **Starting Squadmates.** Create them as section 2.10 states.
7. **Named comrade.** Each player whose Drive needs a named comrade names one now: a living player character or Squadmate in the Squad, other than their own soldier.

---

## 2.4 The Graduation Exam (optional)

The Graduation Exam is the optional played prologue of three **Stages** whose Merit replaces the third Training Year's performance roll, and so helps decide each Cadet's Class Rank. It belongs in character creation because the glossary lists it with the Lifepath terms and it feeds Class Rank, which Graduation sets. `data/character/graduation-exam.yaml` holds the whole procedure.

Each Stage runs one **Trial**, drawn from that Stage's list of six, under one of six **conditions**. Both are rolled, not chosen: one **D66** per Stage, the tens die naming the Trial and the units die the condition. Thirty-six ways to sit each Stage, so no two classes graduate the same way.

### Using the Exam

- **The vote.** The players decide whether to run the Exam before the Lifepath begins (section 2.3, *Before the Lifepath*). If they run it, every Cadet being created at the same time takes it. A replacement character created later decides before rolling their own Lifepath, and takes the Exam alone (`use`).
- **When.** The Exam happens after every Cadet has applied their Year 3 event, and before Graduation.
- It **replaces the Year 3 performance roll.** The Merit from its three Trials is added to the Cadet's Merit total instead. The Year 3 event still happens.
- **Built soldiers take no Exam.** A soldier made with the Template Build or the Free Build takes no Trial and earns no Exam Merit, whatever the vote (`built_steps` in `data/character/lifepath.yaml`). Only Cadets rolling the Lifepath take the Exam, so only they count in each Trial's roll order and in the squad field exercise's Help.

### The board

Before the Exam's first Trial, one player rolls **D66 for each Stage**, in the Stage order below (`board`). The tens die names which of that Stage's six Trials the class runs; the units die names the condition it is run under. The result is the same for every Cadet taking the Exam, including a replacement character taking it alone, and it is rolled rather than chosen, exactly as the order within a Trial is: `group_choices` does not apply to it.

### How the Exam is played

- **It is not a Titan Engagement.** It has no rounds, turns, Positions, Attention, or Titans. `requirements_ignored` lists the entry requirements that do not apply, such as those needing a Titan, a Position, a patient, a comrade with a Stress Response, or a worn item.
- **Exam issue.** Each Cadet uses training ODM Gear, a training Blade Set, a training medical kit, a training tool kit, a training horse, and a training musket, each with a Gear Dice rating of 1. A Trial gives Gear Dice only from the item its entry lists; a Trial that lists none gives no Gear Dice. There are no Gas Rolls and no Blade Set counting. Wear during the Exam applies during the Exam and has no effect after it.
- **Pools.** Every Trial roll uses the full Chapter 1 pool: attribute, one dice Talent that names the entry, Bonus Dice from the squad field exercise's Help and from the Trial's condition, Gear Dice from the listed exam issue item, and Stress Dice. Rule Talents that name the entry apply. A roll can be Pushed only where its Stage allows it or its condition adds a Push; otherwise the Trial forbids a Push by its own rule (Chapter 1, section 1.5). No Trial roll takes Circumstances (Chapter 1, section 1.4a): the Exam is creation, before play (`conditions.circumstances`).
- **Stress.** Every Cadet starts at Stress 0. Stress gained in one Trial stays for the later Trials and adds Stress Dice to their rolls. When the Exam ends, every Cadet's Stress returns to 0. This is the `graduation-exam-ends` row in `data/core/stress-changes.yaml`.
- **Stress Responses.** A Stress Response during the Exam still happens, and the roll cannot be Pushed after it. The Exam names its resolution, as Chapter 1 allows (section 1.5, *Finishing a roll*, step 2): it is not resolved on the Chapter 3 table, and instead costs the Cadet 1 Merit on the Trial whose roll caused it. Nothing else happens, and no Chapter 3 result arises during the Exam (`stress_responses`).
- **Order.** Every Cadet completes a Stage's Trial before the next Stage begins. Before each Trial, every Cadet taking the Exam rolls a D6, and they roll that Trial in descending order of result. Cadets tied for the same result roll again among themselves. The players do not choose the order (`roll_order_within_a_trial`).

<!-- BEGIN RENDERED: graduation-exam-issue from data/character/graduation-exam.yaml -->
| Exam issue | Counts as | Gear Dice |
|---|---|---|
| training ODM Gear | odm-gear | 1 |
| training Blade Set | blade-set | 1 |
| training medical kit | medical-kit | 1 |
| training tool kit | tool-kit | 1 |
| a training horse | horse | 1 |
| a training musket | musket | 1 |
<!-- END RENDERED: graduation-exam-issue -->

### The three Stages

<!-- BEGIN RENDERED: graduation-exam-stages from data/character/graduation-exam.yaml -->
| Order | Stage | Successes needed | Can be Pushed | Help | Merit |
|---|---|---|---|---|---|
| 1 | The individual assessment | 2 | no | none | 0–1 successes: 0 Merit; 2 or more successes: 1 Merit |
| 2 | The Titan test | 2 | no | none | 0–1 successes: 0 Merit; 2 or more successes: 1 Merit |
| 3 | The squad field exercise | 3 | yes | fixed by the Trial's roll order (see below) | 0–2 successes: 0 Merit; 3 or more successes: 1 Merit |
<!-- END RENDERED: graduation-exam-stages -->

1. **The individual assessment:** a solo test of what the Training Corps expects of every Cadet. It pays 1 Merit at 2 or more successes and 0 otherwise. It cannot be Helped or Covered, and it cannot be Pushed unless its condition allows one.
2. **The Titan test:** a solo test of what the Cadet does when the shape in front of them is a Titan. Same threshold, same limits.
3. **The squad field exercise:** the Cadets taking the Exam work one day-long exercise as a squad. Each picks one entry from the Trial's list and needs **3** successes for 1 Merit. It can be Pushed.
   - **Help is fixed.** Every Cadet taking the Exam, other than the roller, qualifies to Help each roll in this Stage (Chapter 1, section 1.8), but only one of them Helps it: the Cadet who rolls next in this Trial's order Helps the current roller, and the first roller Helps the last. Each Cadet Helps exactly one roll, declared before that roll, and that one Help is all it spends. A Cadet taking the Exam alone has no Help.
   - **Covering.** Every Cadet who qualifies to Help a roll can Cover its Push (Chapter 1, section 1.5), whether or not they Helped it, unless they hold the rolled state: a Cadet who has made their own roll in this Trial holds a state that forbids Covering for the rest of the Trial (`forbids: [cover]`), using Chapter 1's shared hook (section 1.9). So only a Cadet who has not yet made their own roll can Cover. Covering spends nothing.
   - Each Cadet's Merit comes only from their own roll. There is no bonus for the whole group succeeding.

### Each Stage's six Trials

<!-- BEGIN RENDERED: graduation-exam-trials from data/character/graduation-exam.yaml -->
**The individual assessment: its Trials (the tens die)**

| D6 | Trial | Action Catalog entry | Gear item | Description |
|---|---|---|---|---|
| 1 | The ODM balance test | Fly | training ODM Gear | Hanging from wires in a harness, the Cadet must hold steady and upright while instructors watch. |
| 2 | The forced march | Endure | none | A day on the mountain road under full pack, graded on arriving with the column and with your kit on your back. |
| 3 | The night watch | Spot | none | Midnight to dawn on the district wall, graded on what you can report when the sun comes up. |
| 4 | The written examination | Recall | none | Three hours in the hall on tactics, Titan anatomy, and the regulations, with no notes allowed. |
| 5 | The survival week | Survive | none | Seven days in the woods with a knife and a blanket, graded on the state you walk back in. |
| 6 | The board interview | Persuade | none | Three instructors behind a table who want to hear why the Corps should keep you. |

**The Titan test: its Trials (the tens die)**

| D6 | Trial | Action Catalog entry | Gear item | Description |
|---|---|---|---|---|
| 1 | The Titan dummy course | Nape strike | training Blade Set | A timed run through the training forest, cutting the napes of wooden Titans on hidden rails. |
| 2 | The marksman's butts | Shoot | a training musket | Powder, ball, and a painted nape at eighty paces, with the whole class counting your misses. |
| 3 | The grab drill | Break Free | training Blade Set | An instructor's wooden fist closes around you, and you have until the count of five to be out of it. |
| 4 | The decoy run | Break Attention | training ODM Gear | A flare, a pole-mounted mask on a cart, and a class watching to see whose eye you can pull. |
| 5 | The silhouette drill | Read | none | Boards raised on the range at dusk, to be named by class, height, and gait before they drop again. |
| 6 | The casualty drill | Treat Injury | training medical kit | A Cadet playing a soldier cut out of a Titan's hand, bleeding paint, with the clock running. |

**The squad field exercise: its Trials (the tens die)**

| D6 | Trial | Action Catalog entry | Gear item | Description |
|---|---|---|---|---|
| 1 | The squad field exercise | Read (no gear); Break Attention (training ODM Gear); Body Part strike (training Blade Set); Treat Injury (training medical kit); Field Repair (training tool kit); Rally (no gear) | listed with each roll | The set piece, with instructors in Titan harness working a wooded valley and a squad ordered to cross it. |
| 2 | The forest crossing | Fly (training ODM Gear); Sneak (no gear); Spot (no gear); Read (no gear); Rally (no gear); Field Repair (training tool kit) | listed with each roll | Cross the training forest in formation without one instructor's whistle finding you. |
| 3 | The night withdrawal | Treat Injury (training medical kit); Heave (no gear); Survive (no gear); Rally (no gear); Ride (a training horse); Spot (no gear) | listed with each roll | Bring a squad of painted casualties back to the beacon line before the graders call dawn. |
| 4 | The relief of the gate | Nape strike (training Blade Set); Break Attention (training ODM Gear); Fight (training Blade Set); Endure (no gear); Rally (no gear); Treat Injury (training medical kit) | listed with each roll | Hold the mock gate against instructors in Titan harness until the relief column rides in. |
| 5 | The supply run | Ride (a training horse); Field Repair (training tool kit); Heave (no gear); Persuade (no gear); Spot (no gear); Rally (no gear) | listed with each roll | Take the wagons the length of the course and bring them back with the load still on them. |
| 6 | The ruined exercise | Rally (no gear); Persuade (no gear); Field Repair (training tool kit); Treat Injury (training medical kit); Read (no gear); Survive (no gear) | listed with each roll | The graders break the exercise on purpose, with jammed gear, contradicting orders, and a squad leader ruled dead in the first hour. |
<!-- END RENDERED: graduation-exam-trials -->

### The conditions

A condition applies to **every Cadet's roll in that Stage's Trial**, and to that Stage only. A condition that changes the successes the Trial needs changes every bound of its Merit rows by the same amount, so "1 fewer success" also pays 1 success earlier. A condition with nothing to change in a Trial, such as taking the Gear Dice from a Trial that issues no gear, simply does nothing there (`conditions_table.applies_to`).

<!-- BEGIN RENDERED: graduation-exam-conditions from data/character/graduation-exam.yaml -->
**Exam conditions (the units die)**

| D6 | Condition | What changes | Description |
|---|---|---|---|
| 1 | Driving rain | The Trial needs 1 more success, and pays its Merit 1 success later. | Sheeting rain, a churned yard, and instructors who will not call it off. |
| 2 | Worn training gear | The exam issue gives no Gear Dice. | The class before you handed back everything it had, and nothing has been serviced since. |
| 3 | A fair run | Nothing changes. | Clear weather, working gear, and an instructor who grades what they see. |
| 4 | An instructor walks it with you | Every roll in the Trial takes 1 Bonus Die. | An instructor stays at your shoulder the whole way, calling the next move a breath before you need it. |
| 5 | Run it twice, best score | Every roll in the Trial takes 1 Bonus Die. The Trial can be Pushed 1 more time than its Stage allows. | The graders have time for two passes, and a word of correction between them. |
| 6 | A short course | The Trial needs 1 fewer success, and pays its Merit 1 success earlier. | Half the class is down with fever, so the graders cut the course to what the hall can run. |
<!-- END RENDERED: graduation-exam-conditions -->

> **Design note (OQ-22, OQ-37):** The Exam's shape is unchanged: three Trials, each paying at most 1 Merit, with the first two solo and the third the squad exercise. What the Stages add is variety. Each Stage draws its Trial from six, and its condition from six, so the class does not take the same three tests every campaign, and the Trials across a Stage's six deliberately roll different attributes, so which Cadets shine is a property of the class and the year rather than of the procedure. Both are rolled, so no Exam choice is made with Merit known, which was OQ-37 (e)'s reason for moving the vote before the Lifepath. Trials 1 and 2 keep the single graded entry the Training Corps' own rankings imply, and only the squad field exercise lets the Cadet pick their part; letting the first two Stages be picked as well would let every Cadet roll their best attribute three times, which measured about a point of extra Top 10 share on its own.
>
> Parity is measured by `tools/probes/lifepath-exam/exam.py`, which reads the tables, rolls whole Lifepaths from them, and then runs the Year 3 performance roll, the old three-Trial Exam, and this one against the same Cadets. Under that model the Year 3 roll pays a mean of about 0.584 Merit; the expanded Exam pays 0.484 to 0.527 for 1 to 6 Cadets, a delta of -0.06 to -0.10, and moves the Top 10 share by -0.21 to +0.12 points. Both targets hold. The three fixed Trials it replaces paid 0.354 to 0.401 under the same model, a delta of -0.18 to -0.23, and cost 0.9 to 1.2 points of Top 10 share, so the expanded Exam is much the closer of the two to the roll it replaces. That model rolls Lifepaths, where the earlier payout model behind OQ-22's 0.583 and 0.612 used reference pools; the two are not the same measurement, and the figures above are the ones this schedule was tuned against. The conditions table carries the tuning: its six rows are worth about +0.19 Merit across a whole Exam, which is what brings a Stage schedule of 2, 2, and 3 successes back to the roll it replaces. Each row was measured on its own, and the table balances a heavy bane (driving rain, worth about -0.45 Merit over an Exam) against a heavy boon (a short course, about +1.13) with two small boons, one small bane, and one row that changes nothing between them.
>
> **Simulator target:** mean Exam Merit within 0.1 of the Year 3 performance roll it replaces, and the Top 10 share with the Exam within 0.3 points of the share without it, for 1 to 6 Cadets, under the aimed policy of Chapter 2 review 3, with every Cadet who has not yet rolled able to Cover. If the target fails, tune first the conditions table, then the successes the squad field exercise needs, then the threshold of the first two Stages (2, then 3).

---

## 2.5 Drives

A Drive is what keeps a soldier fighting. It lets them shrug off one Fear Roll result per session while its trigger is met by their own act, a Position they moved into, or their own ODM flight. Every Drive is written as a trigger beginning "When I ..." (ADR-0024, limit 3). Each Drive is a row of the Why You Enlisted table (section 2.3.2), and the rules they share are in `data/character/enlistment.yaml` (`drive_rules`).

### Using a Drive

1. A Fear Roll result (Chapter 3) is about to take effect on the soldier.
2. The player checks whether the soldier's Drive trigger is met, using the trigger's `test` and `target` (see below).
3. If it is met and the Drive has not been used this session, the player may **shrug off** the result: it does not take effect. Chapter 3 states what counts as a Fear Roll's result.
4. A Drive can shrug off one Fear Roll result per session. Record on the sheet when it has been used.

### Trigger tests

Every trigger is met by something the soldier did, or by where the soldier has put themselves. Each Drive's `test` says how to check it:

- **`own_state`:** the trigger names Positions the soldier holds, or the soldier's own flight on ODM Gear, such as "When I am airborne on ODM Gear through my own ODM use". It is met if that state is true when the result is about to take effect.
  - A Position counts only if the soldier's own move put them in it: their most recent change of Position was a move they made. A Position the soldier was placed at when the Titan Engagement began, or by any rule other than their own move, does not count until their own move changes it. A Grab counts as a change of Position made by another rule, even when the soldier's Position stays On Body (Chapter 5, section 5.9, `data/engagement/grab.yaml`, `grabbed_state`).
  - Flight counts only through the soldier's own ODM use. A soldier carried by a comrade is not airborne on their own ODM Gear. Chapter 4 defines airborne.
  - The test never names a Focus Titan's Attention, a comrade's state, a Titan's Body Parts, or the soldier's Stress, Grief, or injuries.
- **`most_recent_turn`:** the trigger names acts. It is met if the soldier took one of them on their most recent turn in the current Titan Engagement, whether that turn came earlier this round or in an earlier round.
- **`since_most_recent_turn_start`:** the trigger names acts. It is met if the soldier took or used one of them at any time from the start of their most recent turn in the current Titan Engagement until now, on that turn or outside it. This reaches Help, Cover, a dodge, and a Push made on a comrade's turn.

The two turn tests are never met before the soldier's first turn in a Titan Engagement. Outside a Titan Engagement they are never met, unless a rule that gives soldiers turns there states that these tests count those turns (`outside_titan_engagement`). Chapter 7 states it for a Skirmish's turns and counts no Leg roll or camp roll as a turn (sections 7.1 and 7.4); the Chase rules, not yet written, may state it too. A Position exists only in a Titan Engagement, so an `own_state` Position trigger is met only there. An `own_state` flight trigger can be met anywhere.

**Acts** are Action Catalog entries, plus `push`, which means Pushing a roll (Chapter 1, section 1.5). A called roll counts as the soldier's own act of the entry the GM named for it, and an improvised act in a fight as the soldier's own act of its model entry (section 2.9; ADR-0024, limit 3). A called roll made with an attribute alone names no entry, so it is no act. The turn tests keep their timing, so a called roll meets one only where they count turns: in a Titan Engagement, or in a Skirmish (Chapter 7, section 7.4).

**Targets.** A Drive's `target` says whom an act must be used on:

- **`any`:** the act counts whoever it was used on.
- **`named_comrade`:** only an act used on the soldier's named comrade counts: Help to their roll, Cover of their Push, or an entry taken on them.
- **`grabbed_or_down_comrade`:** an act counts only if it was used on a comrade who was Grabbed or Down when the act was used, or who is Grabbed or Down when the Fear Roll result is about to take effect. The act must already have been used; an intention to act later never counts. `drive_rules.targets` lists which uses qualify, including a Body Part strike against the hand that holds a Grabbed comrade.

### Named comrades and replacing a Drive

- A named comrade is a living player character or Squadmate in the Squad, other than the soldier.
- A Drive recorded when the Squad forms names its comrade then (section 2.3.5). A Drive recorded later names its comrade when it is recorded: a replacement Drive, a promoted Squadmate's Drive, or a new character's Drive.
- If no other living soldier is in the Squad when a Drive that needs a named comrade would be recorded, the player records instead the Drive of a row whose Drive does not need one.
- If a Drive's named comrade dies, retires, or leaves the Squad, the Drive can never trigger again. **Promotion does not make a soldier leave the Squad**, so a Squadmate who is promoted stays the named comrade.
- At the start of the next session after a Drive can no longer trigger, the player picks a new Drive from any row of the Why You Enlisted table. No attribute point is gained (ADR-0011).

> **Design note (OQ-23):** The timing (checked when the result is about to take effect), the three trigger tests with their acts and targets, the rule that a Position counts only if the soldier moved into it, the per-session count, the named-comrade and replacement rules, and a rolled attribute point with a Drive the player may take from any row make "while acting on it" a test the table can check without a judgment call. Pay It Forward also counts a comrade who is Grabbed or Down when the result is about to take effect, so a soldier who has already been looking after a comrade can shrug off the Fear Roll that begins that comrade's rescue.

> **Design note (OQ-36):** Position triggers need a Titan Engagement. Turn triggers work outside one only when a rule that gives soldiers turns there extends them, as Chapter 7 does for a Skirmish (section 7.4). Freedom's own-flight trigger can be met anywhere. So Prove Them Wrong can be met only in a Titan Engagement, the ten Drives with turn triggers only in a Titan Engagement or a Skirmish where their acts can be taken, and Freedom anywhere.

---

## 2.6 Specialties

A Specialty is a soldier's trained specialization. The table below gives each of the nine Specialties its key attribute, a summary, and a list of eight Talents. Its last row is the general list: twelve Talents on no Specialty's list.

<!-- BEGIN RENDERED: specialties from data/character/specialties.yaml -->
| Specialty | Key attribute | Summary | Talent list |
|---|---|---|---|
| Slayer | Strength | Trained to finish the job. Slayers make the Nape strike, cut the Body Parts that set it up, and know how to stop a person without killing them. | Clean Cut, Hamstringer, Ground Work, Relentless, Blade Discipline, Flat of the Blade, Ready Blade, Wrist Cut |
| Flier | Agility | The best on the wires. Fliers reach the hard Positions, dodge what others cannot, catch a falling comrade, and make a canister last. | Slip Away, Wirework, High Vantage, Light Trigger, Well-Kept Rig, Mid-Air Catch, Lookout Tree, Close Pass |
| Hunter | Perception | Patient and sharp-eyed. Hunters turn a Titan's head with a decoy, spot danger first, and keep a Night Camp fed. | Lure, Keen Eyes, Fieldcraft, Musket Drill, Hunter's Eye, Flare Discipline, Forager, Saw It Coming |
| Tactician | Instinct | Reads the Titan, the field, and the people in it. Tacticians learn a Titan's Next Behavior, put the Squad where it can help, and choose the line of the ride. | Titan Reader, Judge of Character, Route Finder, Sharp Call, Wide Awareness, Formation Drill, Change the Order, Break Their Nerve |
| Leader | Empathy | The voice that keeps soldiers in the fight. Leaders Rally, steady nerves, take on others' Stress, and talk armed people down. | Steady Voice, Silver Tongue, Stand Down, Unshaken Command, Shout Them Off, Carrying Voice, Shoulder the Load, Put In a Word, Campfire Talk |
| Medic | Wits | Keeps the injured alive long enough to get them home, and knows where the infirmary keeps its spare kits. | Field Medicine, Book Learning, Camp Surgeon, Careful Nursing, Sure Hands, Triage, Friends in the Infirmary, Tourniquet |
| Engineer | Wits | Keeps ODM Gear flying, the supply wagon rolling, and the firearms firing. | Gearwright, Wagon Master, Know the Stores, Make Do, Quick Refit, Well-Kept Rig, Spare Parts, Gunsmith |
| Rider | Agility | At home in the saddle. Riders use the horse as a decoy, a shield, and a way to carry the fallen out, and keep the column moving on a Hard Ride. | Horsemanship, Cavalry Cut, Long Haul, Loose the Horse, Sure Seat, Rescue Ride, Horse Whistle, Hard Rider |
| Brawler | Strength | Hard to hold and hard to kill. Brawlers tear free of a Titan's grip, drag comrades out with them, and win a brawl with people. | Grip Breaker, Hard to Kill, Hand-to-Hand, Menace, Pry Loose, Strong Back, Headlock, Shoulder Charge |
| General | none | Temperament and survival. Talents on no Specialty's list, open to any soldier. | Quiet Step, Will to Live, Every Last One, Underground Instincts, Iron Nerve, Steady Heart, Got Your Back, Gallows Humour, Stay With the Column, Light Sleeper, Nothing Wasted, Not Like This |
<!-- END RENDERED: specialties -->

- **Choosing.** The player chooses a Specialty at Graduation (section 2.3.4), or at a build's Specialty step (section 2.11). It is not rolled, has no requirement, and never changes.
- **What it grants:**
  - The key attribute. It is the only attribute that can be rated 6.
  - At Graduation only, the swap and floor, which give the key attribute the soldier's highest rating, and at least 4, without adding points (section 2.2). A built soldier takes neither.
  - At Graduation, or at a build's Talents step, 1 level in one Talent on the Specialty's list or on the general list, to a maximum of level 2.
- **What it never grants is permission.** Every soldier, player character or Squadmate, can attempt every Action Catalog entry, and any soldier can hold any Talent, including one on another Specialty's list (ADR-0006). A soldier without the right Talent still rolls their full attribute. The Squadmate rules still apply whatever the Specialty: a Squadmate never Pushes or Covers, and its only Reaction is the dodge (section 2.10).
- **The Talent list** limits only the Talent level gained at Graduation or at a build's Talents step. The XP rules, not yet written, state whether it matters when a soldier buys Talents later.
- **Each list holds eight Talents:** at least three dice Talents, one of them with a condition, at least three rule Talents, and at least two that name a Leg, Night Camp, Requisition, or Skirmish roll or trigger (Chapter 7). A Talent may sit on two lists, and at most four do; Well-Kept Rig is on the Flier's and the Engineer's (`rules.list_size`).
- **The general list** holds twelve Talents about temperament and survival, at most four of them dice Talents. They sit on no Specialty's list, so any soldier may hold them, and the one level a Specialty grants may go into one of them (`rules.general_list`; decision batch 12, 12-1).

A Specialty grants nothing beyond the key attribute, the swap and floor, and one Talent level. Separately, through Standard Issue (Chapter 4), a Medic also receives a medical kit and an Engineer a tool kit (`by_specialty` in `data/gear/standard-issue.yaml`; OQ-28, OQ-59).

## 2.7 Talents

A Talent is a narrow trained ability that adds dice or bends a rule, but only for the Action Catalog entries it names. The list has 83 Talents, 33 dice Talents and 50 rule Talents, in Appendix 2A: [2A.1 Dice Talents](#2a1-dice-talents) and [2A.2 Rule Talents](#2a2-rule-talents), grouped by Specialty list with the general list last. For each Talent it gives a `description` for players, its type, `max_level`, the entries it `names`, any `condition` on one of them, and its Specialty lists. A rule Talent also has a `trigger`, an `effect`, and a `limit`. The description only summarizes; the other fields are the rule.

### Levels

- Talents run from level 0 to level 3. No Talent can be above level 2 at creation.
- A rule Talent has a `max_level` of 1 unless its row says otherwise. Holding it at level 1 means having it.

### Dice Talents

- A dice Talent adds base dice equal to its level to a roll made for one of the entries it names (Chapter 1, section 1.3, step 3). If its row gives a `condition` for that entry, it adds them only to a roll that meets the condition: Horsemanship adds its dice to a dodge only when the dodge is made mounted, with the horse as its gear item (decision batch 5, OQ-121), and Ground Work adds its dice to a Nape strike or a Body Part strike only against a grounded Titan.
- A condition may name a moment of a Chapter 7 procedure, such as Route Finder's "on the Leg roll, as Lead". A roll made anywhere else never meets it.
- **A roll uses at most one dice Talent.** If more than one qualifies, the roller picks one.
- A dice Talent can name only entries whose `kind` is `action`, `reaction`, or `roll` (section 2.8). Only those are attribute rolls.
- A Talent that does not name the roll's entry adds no dice, however close the action seems. Section 2.9 decides which entry an unusual action is; for a called roll or an improvised act the GM names the entry, and the Talents that name it follow.
- No Talent changes, ignores, or lowers a Circumstances step (Chapter 1, section 1.4a). A Talent that helps against bad conditions adds dice (ADR-0016, Talent guardrail 10).

### Rule Talents

- A rule Talent applies its `effect` every time its `trigger` occurs, subject to its `limit`.
- **Declared triggers.** A trigger that begins "You declare" is met when the soldier declares that they take, make, or use the named entry, before its requirements, targets, pool, and cost are checked. The effect changes those checks for that use. If the use still does not qualify, it is not taken and nothing is spent. Every other trigger is met when the event it describes happens (`trigger_timing`).
- Rule Talents stack with each other and with the roll's dice Talent.
- **Once per Titan Engagement** means once between the start and end of each Titan Engagement, and never outside one, unless a later rule that creates another procedure with a start and an end, such as a Chase, states that this limit applies to it (`limit_terms`, OQ-36). Chapter 7 states it for a Leg, a Night Camp, and a Skirmish. A Titan Engagement or a Skirmish that begins inside a Leg or a Night Camp is its own procedure, with its own use: a use in it does not spend the use of the Leg or the Night Camp, and a use in the Leg or the Night Camp does not spend its use (decision batch 8, 8-39).
- **Once per Leg, once per Night Camp, once per Skirmish, and once per Downtime** limit a Talent whose trigger only that Chapter 7 procedure can meet: once during each Leg, Night Camp, Skirmish, or Downtime, and never outside one (`limit_terms`; ADR-0016, Talent guardrail 8).
- A rule Talent whose effect changes something the whole Squad shares, such as a Leg's hazard roll, a Night Camp's ration, or Camp Relief, says so in its effect and applies once for that use, however many soldiers hold it.
- A rule Talent changes only what its effect states. Unless its effect says so, it does not add Bonus Dice, change Stress, or make a roll that its trigger does not call for.
- Several rule Talents change a value that a later chapter sets, such as a Position requirement for Rally (Chapter 3) or what changing a canister spends (Chapter 4). They apply to whatever that chapter sets.

A rule Talent that changes who qualifies for an entry, its target, its attribute, its gear item, or its cost uses a "You declare" trigger, so it applies before those checks rather than after them (OQ-34).

### Gaining Talents

- **At creation:** 5 levels in total (section 2.3.3; section 2.11 for a built soldier). The Lifepath's Origin and Training Year rows offer only some Talents; a Talent no row offers is reached by a build or, after creation, by XP (decision batch 7, 7-2).
- **After creation:** through XP and the Train Downtime Action (ADR-0011). Those rules are not yet written.

> **Design note (OQ-28):** Rule Talents are single-level, and each rule Talent has a closed trigger. **Relentless** gives a Nape strike that falls short with at least 1 success 1 extra Opening instead of a second Push, so it feeds the next striker and leaves a soldier's first solo Nape strike at ADR-0014's targets. **Sure Seat** gives the Rider the relationship to the horse that Well-Kept Rig gives the Flier and Engineer to ODM Gear: it ignores 1 point of horse wear from a Pushed dodge, Ride, or Break Attention, once per Titan Engagement. Every mounted soldier's dodge can already use the horse (ADR-0019), so no Talent is needed to make it, and Horsemanship adds its dice to it (decision batch 5, OQ-121), and Sure Seat needs no simulator check. Its limit is once per Titan Engagement, and Chapter 7 extends that limit to a Leg, a Night Camp, and a Skirmish, so it also applies once on a Hard Ride (section 7.1; OQ-36). **Pry Loose** is measured over the six Grab cells (`docs/reviews/simulator-report.md`, section 6.3). Twelve Talents that touch a measured roll or a fixed roll have no sensitivity row that shows their effect, so each is listed here as unmeasured and is a playtest rule (ADR-0016, Talent guardrail 4). Eight are from the first list: **Relentless** (the prepared Squad target and a lone soldier's follow-up strike), **Light Trigger** (the gas target, which is why it is limited to once per Titan Engagement), **Wide Awareness** and **Shoulder the Load** (Help and Covering at two Position steps), **Sure Hands** and **Hard to Kill** (the player character death target), **Unshaken Command** (the Fear Roll), and **Iron Nerve** (the Stress Response roll). Four have rows that never fired in the final rerun (the report's section 7.1): **Tourniquet**, **Got Your Back**, **Formation Drill**, and **Gallows Humour**.

> **Design note (decision batch 7, 7-2 and 7-3; decision batch 8; ADR-0014 and ADR-0016; OQ-136, OQ-144):** The owner asked for a list rich enough that two soldiers of one Specialty play differently, and 7-2 sets its shape: nine lists of eight and a general list of twelve, 83 Talents in all, every one naming a live entry. Every live rolled entry already had a dice Talent, so a second unconditional dice Talent on the same entry would be the first one renamed (ADR-0016, Talent guardrail 6). The new dice Talents carry a condition instead, and most name two or more entries under one condition, so one Talent covers a situation a soldier builds around: **Ground Work** against a grounded Titan, **Cavalry Cut** from the saddle, **Route Finder** for whoever leads a Leg, **Stand Down** for talking a person down (in a Skirmish when the list was set, and on any called roll since decision batch 9, 9-13). The rule Talents lean on the teamwork levers of ADR-0010 (guardrail 7): Openings (**Shoulder Charge**), Help and Wings (**Formation Drill**), Covering (**Got Your Back**), initiative cards (**Change the Order**), decoys (**Close Pass**, **Flare Discipline**), Squad Tactics (**Ready Blade**; **Wrist Cut** gives the holding arm the extra success Hamstring Line gives a leg), and rescue (**Mid-Air Catch**, **Tourniquet**). Silver Tongue, Hand-to-Hand, and Long Haul move from the general list to the Leader's, Brawler's, and Rider's lists, where Chapter 7 gives their rolls a home, and the general list keeps temperament and survival. Every list names a Leg, Night Camp, Requisition, or Skirmish roll or trigger at least twice, so the playtest rules have Talents that read them; a Talent that names only those rolls carries no dice in any ADR-0014 baseline and needs no sensitivity row (ADR-0016). Batch 8 adds two limits, and the list keeps both: no Talent adds dice to Leap Clear, the one roll a soldier makes with no turn to spend, and no Talent changes Attack Dice, a Titan's roll, or the net-success rider, since the roll is the Titan's and the Reaction is where a Talent helps. No Talent names Leap Clear, and **Grip Breaker** names Heave (decision batch 8, 8-9 and 8-26). No Talent raises Health or Resolve; **Steady Heart** counts Resolve as higher for one roll, as Iron Nerve does (guardrail 3). Capstones wait for the XP rules and a measurement against the Levi-grade cut (OQ-144). Each new Talent that names a measured entry or a fixed roll is a sensitivity row beside ADR-0014's targets where the simulator can express it, and is otherwise listed as unmeasured and marked as a playtest rule (guardrail 4): **Ground Work** and **Every Last One** (the Nape strike and Body Part strike), **Wrist Cut**, **Not Like This**, and **Shoulder Charge** (the Grab), **Ready Blade** (Hook and Cut), **Close Pass** and **Flare Discipline** (decoys), **Cavalry Cut** (mounted strikes and decoys), **Mid-Air Catch** (falls), **Spare Parts** (the Jam test), **Tourniquet**, **Triage**, and **Will to Live** (deaths), **Formation Drill** and **Got Your Back** (Help and Covering), **Change the Order** (initiative), **Steady Heart** (the Fear Roll), and **Gallows Humour** (the Stress Response roll). The rows of Tourniquet, Got Your Back, Formation Drill, and Gallows Humour never fired, so those four are listed as unmeasured in the design note above. **Camp Surgeon** and **Wagon Master** name a measured entry only inside a Chapter 7 procedure, which no target reads. **Saw It Coming** acts only in a Titan Engagement that a row of the Leg Hazard table or the Night table begins, which no reference start is, so it is listed as unmeasured and is a playtest rule. **Horse Whistle** and **Nothing Wasted** name no measured roll.

## 2.8 The Action Catalog

The Action Catalog is the complete list of named actions and rolls a soldier can make, and the list Talents name. Its entries are in Appendix 2A: [2A.3 Action Catalog entries](#2a3-action-catalog-entries), [2A.4 What each entry requires and changes](#2a4-what-each-entry-requires-and-changes), and [2A.5 Tracked values](#2a5-tracked-values). Every attribute roll is made for one Catalog entry (Chapter 1, section 1.3, step 1).

### What an entry states

| Field | Meaning |
|---|---|
| `kind` | `action`: taken as a soldier's action in a Titan Engagement or a Skirmish (Chapter 7, section 7.4). `reaction`: made when a Titan or a Foe acts against the soldier, outside the soldier's own turn, spending a turn (Chapter 1, section 1.9). `roll`: an attribute roll made when a rule calls for it, or, for an entry marked `when_called`, when the GM calls one; not an action, spending no turn of its own. `option`: a use of another entry or rule, not an action and not a roll, spending nothing of its own unless its notes or its calling rule say so. `fixed-roll`: a roll that is not an attribute roll, which only rule Talents can name. |
| `rolled` | `when_taken`, `when_a_rule_calls`, `when_called`, or `never`. `when_called` marks the nine entries a called roll is made for: rolled when a rule calls for it, or when the GM calls a roll for an act the entry fits (section 2.9). |
| `attribute` | The attribute the roll uses. `from_performance_attributes` means the Training Year's performance attributes decide it. |
| `gear` | The gear items (Chapter 4) that can supply Gear Dice. The roller picks one if more than one qualifies. |
| `requires_gear`, `without_gear` | Whether the entry needs one of its gear items, and what happens without one (see *Entries that need gear*). |
| `context` | Where the entry is used: `titan-engagement`, `any`, or `lifepath`. |
| `requirements`, `needs` | What the soldier must meet, and how many successes the roll needs. Many of these point to the owning chapter. |
| `changes` | The tracked values the entry can change (section 2.9). |
| `help_outside_titan_engagement` | The Help requirement Chapter 1 asks every roll outside a Titan Engagement to state (section 1.8, OQ-08). A `when_called` entry's row also states Help on a called roll. |
| `rules` | The chapter that owns the entry's procedure and full effect. |
| `option_of` | For an option, the entry, turn, or procedure step it is a use of. |
| `notes` | Further rules for the entry, such as what it spends or when it rolls another attribute. |
| `decided`, `adrs` | The decisions and ADRs the entry follows. |
| `reserved` | The entry exists for Foes or Titans that later rules add, and no rule uses it yet. No entry is reserved now: Chapter 7 uses Fight and Block (decision batch 7, 7-17). |
| `dormant` | No current rule calls for the entry. The rule that later calls for it may change its attribute. No entry is dormant now (*Groups of entries*). |

### Entries that need gear

This rule (`gear_requirement`) applies every time an entry is taken, made, or called for: whether the player names the entry or reaches it through section 2.9, and whether the soldier is a player character or a Squadmate.

- If an entry has `requires_gear: true` and the soldier has none of its gear items, apply its `without_gear` value. An item worn down to 0 counts as not had (Chapter 1, section 1.3, step 6; for ODM Gear, a Jam), and so does an item in any other state a Chapter 4 rule names as counting as not had:
  - `attribute_alone`: roll the entry's attribute with no Talent dice and no Gear Dice. Everything else about the entry still applies. Only a rule Talent that names this case changes it (Make Do).
  - `not_possible`: the entry cannot be taken, made, or used.
- An entry with `requires_gear: false` and no gear item available is rolled without Gear Dice (Chapter 1, section 1.3, step 6).

For example, a soldier whose last Blade Set is gone cannot make a Nape strike, however the player describes it. A soldier with no medical kit who takes Treat Injury rolls Wits alone.

### How far this chapter defines an entry

Entries owned by later chapters are defined here only as far as a Talent needs to name them and a pool needs to be built: kind, attribute, gear, and what they can change. The owning chapter gives the procedure, the successes needed where the entry says "set by Chapter N", and the full effect. Where a Chapter 5 entry names a requirement that ADRs already settle, the entry states it: a Nape strike only from Blind Spot and never by the soldier holding Attention (ADR-0010), and a dodge whose successes cancel a Titan attack's (ADR-0019). Chapter 4 adds that, in a Titan Engagement, a Nape strike, and a Body Part strike made from On Body or Blind Spot, needs ODM Gear that counts as had (`strikes` in `data/gear/odm-gear.yaml`; OQ-60), unless the Titan is grounded (Chapter 5, `grounded` in `data/engagement/titan-harm.yaml`).

The attribute and gear assignments for Titan Engagement entries are (OQ-25):

- Nape strike and Body Part strike: Strength, with a Blade Set.
- Break Attention: Perception, with ODM Gear or a horse.
- Read: Instinct, with no gear.
- Break Free: Strength, with a Blade Set if the soldier has one. It is also taken while Held in a Skirmish (Chapter 7, section 7.4).
- Heave: Strength, with no gear, lifting a Titan's body off a Pinned comrade (Chapter 5, section 5.7; decision batch 8, 8-9).
- Draw Attention: not rolled.
- Fly (ODM Gear): an Agility roll a Chapter 4 or Chapter 5 rule calls for, not an action.
- Leap Clear (ODM Gear, or the horse while the soldier is mounted): an Agility roll the falling Titan calls for, not an action and not a Reaction, spending nothing (Chapter 5, section 5.7; decision batch 8, 8-9).
- Ride (horse): an Agility roll, not an action. Chapter 7 calls for it as the Leg roll on a Hard Ride (decision batch 7, 7-14); it was dormant before (decision batch 5, OQ-121).
- Dodge: Agility, with ODM Gear, or with the horse while the soldier is mounted (ADR-0019). When a dodge made with the horse is Pushed, its Gear Dice showing 1 wear the horse, not ODM Gear, and it does not by itself make the Gas Roll three dice. Chapter 4 defines mounted. In a Skirmish a dodge is also made against a Foe's Fight attack or shot, and its successes cancel the attack's (ADR-0018, as amended).

The Skirmish entries are (decision batch 7, 7-17; ADR-0018):

- Fight: Strength, with the Blade Set in the handles, or bare-handed with no Gear Dice. A Grapple is a Fight with no Gear Dice.
- Shoot: Agility, with a loaded flintlock pistol or musket (Chapter 4, section 4.1), or with a flare fired at a person, which spends 1 flare and takes no Gear Dice (Chapter 7, section 7.4). With neither it cannot be taken.
- Block: Strength, with a Blade Set if the soldier has one, against a Foe's Fight attack only. No Titan can be blocked (ADR-0019).
- Reload: an option, not rolled, that loads a firearm and spends 1 shot of Squad Supply.
- Release: an option, not rolled, that lets go of a Foe the soldier holds with a Grapple, spending neither the move nor the action (decision batch 8, 8-12).

The playtest rules call for the other formerly dormant rolls with their attributes unchanged: Spot, Survive, and Endure on Legs and at the Night Camp (7-14); Persuade, Recall, and Size Up for Requisition and in a Skirmish (7-16, 7-17); and Sneak for the ambush (7-17). Each entry's `help_outside_titan_engagement` states the Help its calling rules allow. These entries, with Ride and Fly, are also the entries a called roll is made for (`rolled: when_called`; section 2.9), and each one's Help row adds Help on a called roll: as the GM rules outside a Skirmish, and the Skirmish's Help in one (decision batch 9, 9-12 and 9-42).

The Catalog has entries that are not attribute rolls, so that rule Talents can name them: Help and Draw Attention (unrolled actions), Cover and Call It (options), and the Fear Roll, Stress Response roll, and Gas Roll (fixed rolls). This extends OQ-11, which added the dodge, block, and Death Roll entries (OQ-26).

### Groups of entries

- **Titan Engagement actions:** `nape-strike`, `body-part-strike`, `break-attention`, `draw-attention`, `read`, `break-free`, and `heave`. `call-it` is an option of `read`. `break-free` is also taken while Held in a Skirmish.
- **Actions used in and out of a Titan Engagement:** `lift-comrade`, `change-canister`, `pass-item`, and `take-item`, and also `treat-injury`, `rally`, and `field-repair`, listed below with harm, gear, and mind.
- **Options Chapter 4 adds:** `mount-or-dismount` (part of a move), `swap-blade-set` and `shed-load` (parts of a soldier's turn), and `restock-medical-kit` (part of a care window). Outside a Titan Engagement, where there are no moves or turns, each is used as its Chapter 4 row states.
- **Options Chapter 5 adds:** `swap-initiative-card` (part of a round's swap step; section 5.3, `data/engagement/round.yaml`, `swapping`) and `squad-tactic` (using a Squad Tactic the Squad holds; section 5.12, `data/engagement/squad-tactics.yaml`).
- **Core entries:** `help` (an action) and `cover` (an option), both defined in Chapter 1.
- **Reactions:** `dodge` and `block`. Against a Titan the only Reaction is the dodge (ADR-0019); in a Skirmish a soldier may dodge a Foe's Fight attack or shot, or block a Fight attack (ADR-0018).
- **Harm, gear, and mind:** `treat-injury`, `rally`, `field-repair`, `fly`, `leap-clear`, and `death-roll`. The fixed rolls are `fear-roll`, `stress-response-roll`, and `gas-roll`.
- **Skirmish actions and options** (Chapter 7, section 7.4): `fight` and `shoot` (actions), and `reload` and `release` (options).
- **Rolls the playtest rules call for** (Chapter 7): `spot`, `survive`, `endure`, and `ride` on Legs and at the Night Camp (section 7.1); `persuade`, `recall`, and `size-up` for Requisition (section 7.3) and in a Skirmish (section 7.4); and `sneak` for the ambush (section 7.4).
- **Entries for called rolls** (section 2.9): `spot`, `size-up`, `survive`, `persuade`, `endure`, `sneak`, `recall`, `ride`, and `fly`, marked `rolled: when_called`. In a Titan Engagement `fly` keeps the needs its Chapter 4 or Chapter 5 rule sets; outside one it needs 1. The other rolls a rule calls for, `leap-clear`, `death-roll`, `performance-roll`, and the three fixed rolls, keep `when_a_rule_calls`, and no called roll is made for them (decision batch 9, 9-12).
- **Downtime options** (Chapter 7, section 7.2): `downtime-action`, each player character's Downtime Action, and `squad-action`, the Squad's shared Squad Action.
- **Reserved and dormant entries:** none. Every entry that was reserved or dormant is called by Chapter 7, so no Talent names only entries no rule uses (decision batch 7, 7-2). The `reserved` and `dormant` fields stay for entries later rules add, and a later rule that calls for a dormant entry may change its attribute and states its Help requirement.
- **Lifepath:** `performance-roll` (section 2.3.3).

> **Design note (decision batch 7, 7-14, 7-16, 7-17; OQ-141, OQ-142, OQ-143):** The playtest rules make every dormant and reserved entry live, so every Talent has a roll to read. No attribute changes: Parley's threat rolls Strength for `persuade`, as Hunter's Eye rolls Perception for `read`, so a Talent that names the entry still applies. `shoot` is the one new rolled entry, because no reserved entry covered a firearm at a distance, and `reload` is an option because it has no roll. Each entry changes only the tracked values its calling rule reads: `leg-outcome`, `camp-outcome`, and `hazard-outcome` on Legs and at the Night Camp; `requisition-grant` and `ledger-lower` for Requisition; and `foe-harm`, `held-set`, `held-end`, `firearm-load`, `foe-yield`, `foe-intent-reveal`, and `ambush-set` in a Skirmish ([2A.5 Tracked values](#2a5-tracked-values)). In a Skirmish, Help spends the helper's action whether they are Engaged or Apart, and each rolled entry's `help_outside_titan_engagement` says so. A roll on a Leg, at a camp, for Requisition, or in a Skirmish carries no Talent dice in any ADR-0014 baseline (ADR-0016).

## 2.9 Actions outside the Catalog

A player may describe an action that has no Catalog entry. `uncatalogued_actions` in `data/character/action-catalog.yaml` gives the procedure (ADR-0024, limits 9 and 12). Its steps are the default order for an action meant to change a tracked value ([2A.5 Tracked values](#2a5-tracked-values)). The tracked values are an index of what soldiers change by acting, kept for Talents, the Foundry system, and the effects an improvised act in a fight can take; they are not a gate. An action the steps do not resolve is ruled on (*When the steps do not resolve an action*, below). Outside a Titan Engagement and a Skirmish, follow the steps in order; in a fight they are not used (*In a fight*, below):

1. **Name the change.** The player names the one tracked value the action is meant to change. The description of the action never limits which value the player names; the named value alone decides which entries can be used. If it is meant to change none of them, the GM rules on it (below). Stop.
2. **Moves.** If the value is changing Position, the action is a move, resolved by Chapter 5 (section 5.2), or, for Engaged and Apart in a Skirmish, by Chapter 7 (section 7.4). Stop.
3. **Match.** List every entry whose `changes` include that value. If the soldier meets the requirements of at least one of them, the player picks one. **The action is that entry for every purpose:** its kind, attribute, gear items, successes needed, effect, what it spends, and every Talent that names it.
4. **Gear.** Apply *Entries that need gear* (section 2.8) to the picked entry, as for any entry. An entry that is `not_possible` for the soldier cannot be used.
5. **No match.** If no listed entry can be used:
   - If the value is a `rule-named-value`, make the attribute roll that the value's creating rule names, using the attribute alone (see *Rolls called by attribute*).
   - Otherwise the steps cannot change that value, and the GM rules on the action (below).

### When the steps do not resolve an action

An action meant to change no tracked value, or one that step 5 leaves unresolved, is a ruling under Chapter 1, section 1.1 (`no_value_or_no_match`). The GM rules before anyone rolls, never after.

**Outside a fight.** Outside a Titan Engagement and a Skirmish, the GM says that the action happens with no roll, that it cannot be done, or that it is a **called roll**. For a called roll the GM names, before the pool is built:

- **the entry:** the Catalog entry closest to the action, from the nine marked `when_called` (Spot, Size Up, Survive, Persuade, Endure, Sneak, Recall, Ride, and Fly), or an attribute alone if none fits;
- **the Circumstances** (Chapter 1, section 1.4a), Standard if the GM names none;
- **the stakes:** what failure costs, from the menu in Chapter 1, section 1.1, item 2, and, where it is not obvious, what success gives, which is only what Chapter 1, section 1.1, item 2 lists and never a gear item (decision batch 9, 9-31).

A called roll needs 1 success. It is made for the named entry for every purpose that follows: the entry's attribute and gear items, the gear rule (section 2.8), and every Talent that names the entry (section 2.7). It can be Pushed and Covered, and Help on it is as the GM rules (Chapter 1, section 1.8). Once the dice are rolled, the entry, the Circumstances, and the stakes do not change, and the result stands. In a fight a called roll is made the same way, except that Help on it is the fight's Help (Chapter 1, section 1.8), for the acts *In a fight* below leaves to it (decision batch 9, 9-36 and 9-42).

**In a fight.** In a Titan Engagement or a Skirmish the steps are not used. A soldier's action is Help, a Catalog entry the soldier names and takes as it is written, or an **improvised act** (`in_a_fight`): an act the soldier describes that is not an entry taken as written, even when a tracked value it would change matches an entry. Whether a described act is an entry taken as written is part of the GM's ruling on its model entry (decision batch 9, 9-27). When no entry of kind `action` the soldier could take in that fight has an effect the act imitates, and the act would change nothing the fight tracks (no tracked value, Position, Engaged or Apart, Attention, Opening, card, clock, or Foe value), it is a **called roll**, made as *Outside a fight* gives: it spends the soldier's action, Help on it is the fight's Help, its stakes are read as Chapter 1, section 1.1, item 2 reads them in a fight, and it never gives an effect an entry has (decision batch 9, 9-36). If it would change nothing, it is described and needs no roll; if the GM judges that it cannot be done, the GM says so before anyone rolls (Chapter 1, section 1.1, item 1). When an entry of kind `action` the soldier could take in that fight can model it, before the pool is built, the GM names its **model entry**: the one existing entry whose effect the act imitates, with the tracked values as the menu of effects. That ruling stands. The model entry is an entry of kind `action` that the soldier could take in that fight: in a Titan Engagement, one whose context is a Titan Engagement or any; in a Skirmish, one Chapter 7 (section 7.4) allows. It is never a Reaction (the dodge or the Block), a roll, a fixed roll, or an option (such as Call It, Cover, or Reload). The improvised act:

- spends the soldier's action;
- is made as the model entry is made: rolled only if that entry is rolled, with its attribute, gear items, Talents, and needs, and with Circumstances as any roll;
- meets every requirement and restriction of the model entry: the soldier holding a Titan's Attention still cannot strike its Nape, a Feint keeps its Position rule, and a Foe's Guard still rolls;
- on a success, produces only the model entry's effect, at that entry's size.

It never kills a Titan, never changes Nape Depth, Toughness, Attack Dice, or a card, never cancels or delays a card, never creates more Openings than the model entry could, and never gives an effect that no entry has. Only a Nape strike taken as its entry is written kills a Titan; an act modelled on the Nape strike never does. Such an act is resolved as a Nape strike that falls short, whatever its successes: each success creates 1 Opening, the act sets the hooked-by-strike flag as any Nape strike does, and successes that reach the Nape Depth create their Openings and nothing else (Chapter 5, section 5.4; decision batch 9, 9-39 and 9-45). A supply wagon cut loose to roll past a Titan is Break Attention, with Break Attention's needs; a lantern swung from a rooftop is Draw Attention, never from Distant; a chimney dropped on a Titan's leg is a Body Part strike whose successes count toward that leg's Toughness; a rope thrown to a comrade is Help or Lift Comrade; and an object that is not a gear item, hurled at a person, is a Shoot at damage 1 and Crush, with no Gear Dice (Chapter 7, section 7.4). A dive behind a chimney stack is a move if it changes the soldier's Position, and otherwise changes nothing and needs no roll; it is never modelled on the dodge and gives no Circumstances to a later dodge.

**Rule-named values.** A later rule that creates a clock, counter, or obstacle soldiers can change by acting, such as an Operation Frame's clock or a hazard, either adds it to `tracked_values` with the entries that change it, or creates it as a `rule-named-value` and names the attribute roll that changes it. No Phase 1 rule creates one yet.

**Rolls called by attribute.** A rule that calls for an attribute roll without naming a Catalog entry calls for that attribute alone: no Talent dice, and Gear Dice only from a gear item that rule names. Every other step of Chapter 1, section 1.3, applies, and the rule states its Help requirement. A called roll made with an attribute alone is built the same way, with Help as the GM rules outside a fight and as the fight's Help in one (Chapter 1, section 1.8; decision batch 9, 9-42). A ruling is not a rule that names a gear item, so a called roll made with an attribute alone takes no Gear Dice: a gear item or other object that helps counts toward its Circumstances (Chapter 4, section 4.1) and, giving no Gear Dice, cannot be worn by a Push on it. A called roll the GM names for `fly` or `ride` takes that entry's Gear Dice (decision batch 9, 9-24).

**Rulings.** In this section the GM rules: whether an action the steps do not resolve happens, cannot be done, or is a called roll; a called roll's entry or attribute, its Circumstances, and its stakes; and, in a fight, whether a described act is an entry taken as written, an improvised act with its model entry, or a called roll (decision batch 9, 9-1, 9-8, 9-12, and 9-36). The GM applies as written: the steps, outside a fight, as the default order for an action meant to change a tracked value; the entry the player picks at step 3; the gear rule; the rule that a Talent adds dice only to a roll made for an entry it names; and every roll's needs, which no ruling raises or lowers. Everything else the GM applies as written is the list in Chapter 1, section 1.1, item 6.

For example:

- A soldier wants to bind a comrade's Critical Injury with a torn cloak. The value is "treat or stabilize a Critical Injury", the entry is `treat-injury`, and the soldier has no medical kit, so they roll Wits alone.
- In a Titan Engagement, a soldier wants to shout so a comrade can avoid a Titan's hand. No entry is a shout, so it is an improvised act, and the GM names its model entry before the pool is built. Call It, which adds dice to a comrade's dodge from a Read, is an option and never a model entry, so the GM names Help: the shout spends the soldier's action, needs Help's Position, is not rolled, and adds 1 die to the comrade's dodge (Chapter 1, section 1.8).
- A soldier wants to calm themselves with a prayer in the field. The only entry that lowers a soldier's own Stress is `downtime-action`, which is taken only during Downtime (Chapter 7, section 7.2), so step 5 finds no match. The GM rules that the prayer happens, with no roll and no mechanical effect: Stress relief comes only from a written trigger, and no ruling adds one (Chapter 1, section 1.1, item 6).
- During an evacuation, a soldier braces a collapsing beam so that the civilians behind them can get clear. No tracked value names holding up a beam, so the GM rules. The outcome is in doubt and failure would cost something, so the GM calls a roll. Endure is for hardship borne over hours, not a moment's lift, so the GM names Strength alone; names the Circumstances Hard, because the beam is already sagging; and names the stakes: if the roll fails, the beam comes down and the soldier takes 2 Crush damage. The roll needs 1 success. The soldier rolls Strength with a 1-die penalty and their Stress Dice, may Push, and a comrade beside the beam may Help as the GM rules (OQ-35).

> **Design note (OQ-27, OQ-35; decision batch 9, 9-8 and 9-12):** The procedure is ADR-0024, limits 9 and 12: matching by the tracked values, the player choosing between qualifying entries, the gear rule applied to every use of an entry, and the route to the attribute alone through rule-named values. Batch 9 keeps the steps as the default order and the list as an index, and replaces "no match means no effect" with a ruling: GM judgment is valid (ADR-0024), and an ordinary consequential act, such as bracing a collapsing beam, should get a roll. A called roll takes its entry from the nine `when_called` entries, so the dice Talents on them read every called roll; the fixed rolls, Leap Clear, the Death Roll, and the performance roll keep `when_a_rule_calls` because their tables are tuned or measured. An improvised act in a fight reuses one entry's effect at that entry's size, so every figure measured for the entry still describes it, and the model-entry rule closes reskinning, such as a falling beam that is really a free Nape cut. ADR-0024 limit 12 still requires every rule that creates a value soldiers change by acting to add it to the tracked values. Chapter 4 adds the tracked values `item-give`, `item-take`, `mount-change`, `blade-set-swap`, and `load-shed`, with the unrolled actions `pass-item` (giving a carried item to a comrade) and `take-item` (taking an item from a Down comrade, or from where a dead comrade's items lie) and the options `mount-or-dismount` (at the soldier's Position as part of a move, with no roll), `swap-blade-set`, `shed-load`, and `restock-medical-kit`. Chapter 5 adds the tracked values `initiative-swap` and `squad-tactic-use`, with the options `swap-initiative-card` (exchanging initiative cards with a comrade, section 5.3) and `squad-tactic` (using a Squad Tactic, section 5.12). Character creation itself has no act a soldier changes a tracked value with: the performance roll and the Graduation Exam's Trial rolls are rolls their own rules call for, made for Catalog entries and paying Merit by those rules, and every other Lifepath step is a table roll, a record, or a choice.

---

## 2.10 Squadmates

A Squadmate is a named NPC soldier who rides into the field with the player characters. Any player can direct a Squadmate, Titans can target it like anyone else, and it can be promoted to a player character. The Squadmates currently serving are the Squad Pool. `data/character/squadmates.yaml` holds everything in this section.

### The stat block

- A Squadmate is built from one of nine `templates`, one per Specialty. Its key attribute is 4, four other attributes are 3, and one is 2, for 18 points: the total of a new player character without a Top 10 Class Rank. It has one dice Talent at level 1. Its attributes follow ADR-0014's Rookie build, with Health 3 or 4 by template. The simulator's reference Rookie has the Slayer template's attributes (Strength 4, Agility 3, Wits 2, and 3 elsewhere; Health 4, Resolve 3), and Talent 1 in the Talent that names the Nape strike, the Body Part strike, Break Free, or Treat Injury. No other roll a target measures carries Talent dice, including the dodge, Fly, Break Attention, Ride, and Read. It is not the Slayer template itself, whose one Talent names only the Nape strike (ADR-0014 as amended; OQ-58, OQ-70; decision batch 2b; OQ-94). The reference Veteran is Strength 5, Agility 3, Wits 2, and 3 elsewhere (OQ-71). Targets that depend on Health are also reported for the reference Squad with each soldier's Health set to 3 and nothing else changed, and the Talent-dependent targets for a Squad built literally from these templates (Chapter 3, section 3.2) and for a Squad of four Free Build soldiers (section 2.11). The Template Build gives a player character the attributes of one of these templates (section 2.11).
- `stat_block.fields` lists what a Squadmate records: name, Specialty, attributes, Talent, Health (a row of boxes, 3 or 4 on the templates) and Health lost to damage, Resolve, Stress, minimum Stress, Scars, Grief, Critical Injuries, whether it is Down, its gear, its Wing, and the Chapter 3 fields in `data/harm/sheet-fields.yaml`. A Squadmate's boxes crossed off are the untreated entries in its Critical Injuries, as for a player character (Chapter 3).
- `stat_block.not_recorded` lists what it does not record: Origin, Haven, Drive, Canon Tie, Merit, Class Rank, and XP.
- **Gear.** A Squadmate receives Standard Issue and records its gear exactly as a player character does, including Gas Rating, spare canisters, Blade Sets, carried items, and Gear Dice ratings (Chapter 4). A rating changes only when a rule names a change. A Squadmate never Pushes, so Push wear never lowers its ratings.

<!-- BEGIN RENDERED: squadmate-templates from data/character/squadmates.yaml -->
| Template | Strength | Agility | Wits | Perception | Instinct | Empathy | Talent | Health | Resolve |
|---|---|---|---|---|---|---|---|---|---|
| Slayer | 4 | 3 | 2 | 3 | 3 | 3 | Clean Cut 1 | 4 | 3 |
| Flier | 3 | 4 | 2 | 3 | 3 | 3 | Slip Away 1 | 4 | 3 |
| Hunter | 3 | 3 | 3 | 4 | 3 | 2 | Lure 1 | 3 | 3 |
| Tactician | 3 | 2 | 3 | 3 | 4 | 3 | Titan Reader 1 | 3 | 4 |
| Leader | 3 | 2 | 3 | 3 | 3 | 4 | Steady Voice 1 | 3 | 4 |
| Medic | 3 | 2 | 4 | 3 | 3 | 3 | Field Medicine 1 | 3 | 3 |
| Engineer | 3 | 3 | 4 | 3 | 3 | 2 | Gearwright 1 | 3 | 3 |
| Rider | 3 | 4 | 2 | 3 | 3 | 3 | Horsemanship 1 | 4 | 3 |
| Brawler | 4 | 3 | 2 | 3 | 3 | 3 | Grip Breaker 1 | 4 | 3 |
<!-- END RENDERED: squadmate-templates -->

### Which rules apply

`rules_applicability`, rendered after this list, gives each rule and whether it applies to a Squadmate. This settles the questions Chapter 1 (section 1.10, OQ-13) left to this chapter:

- A Squadmate **rolls Stress Dice** and suffers Stress Responses.
- A Squadmate **never Pushes** and **never Covers**.
- A Squadmate **can Help**, because Help is on its action list, and can be Helped.
- It loses Stress through the two field relief triggers (Chapter 1, OQ-13).
- It makes Reactions and Fear Rolls, and suffers damage, Critical Injuries, Down, Death Rolls, Scars, Retirement, and Grief (Chapter 3).
- It makes **Gas Rolls**, always of two dice because it never Pushes, counts Blade Sets and carried items, and can be Overloaded (Chapter 4).
- It has no Drive.
- No current rule gives a Squadmate XP or Talent levels; the XP rules, not yet written, decide these. A Squadmate takes no Downtime Action: each Downtime it takes the Squadmate relief instead (Chapter 7, section 7.2).

<!-- BEGIN RENDERED: squadmate-rules from data/character/squadmates.yaml -->
| Rule | Applies to a Squadmate | Chapter | Note |
|---|---|---|---|
| attribute rolls and dice pools | yes | Chapter 1 | none |
| Stress Dice | yes | Chapter 1 | none |
| Stress Responses | yes | Chapter 3 | none |
| Push | no | none | A Squadmate never Pushes. |
| Help (as helper) | yes | none | Help is on the action list. |
| Help (as roller) | yes | none | none |
| Cover (as the Covering soldier) | no | none | none |
| Cover (as the Pushing soldier) | no | none | A Squadmate never Pushes, so there is no Push to Cover. |
| field Stress relief (end of Titan Engagement and Nape kill) | yes | Chapter 1 | none |
| Reactions | yes | Chapter 1 | none |
| Fear Rolls | yes | Chapter 3 | none |
| Health, Critical Injuries, Down, and Death Rolls | yes | Chapter 3 | none |
| Scars and Retirement | yes | Chapter 3 | none |
| Grief | yes | Chapter 3 | none |
| Drive | no | none | none |
| Gas Rolls | yes | Chapter 4 | Always two dice, because a Squadmate never Pushes. |
| Blade Sets, carried items, and Overloaded | yes | Chapter 4 | none |
| Talent dice and rule Talents | yes | none | Only the template Talent. |
| XP and gaining Talents | set by the XP rules (not yet written) | none | No current rule gives a Squadmate XP or Talent levels. |
| Downtime Actions | no | Chapter 7 | A Squadmate takes no Downtime Action. Each Downtime it takes the Squadmate relief instead (data/campaign/downtime.yaml, squadmates). |
<!-- END RENDERED: squadmate-rules -->

> **Design note (OQ-29, OQ-58, OQ-70):** The template build has the attributes of ADR-0014's Rookie, as amended, and the Slayer template's attributes are the reference Rookie's (OQ-58, OQ-70). The reference Rookie has Talent 1 in the Talent that names the Nape strike, the Body Part strike, Break Free, or Treat Injury (decision batch 2b), and no other roll a target measures carries Talent dice, including the dodge, Fly, Break Attention, Ride, and Read (OQ-94). So a Squad built from the templates is reported beside it for the Talent-dependent targets, and the Flier template's dodge is reported alone. A Squadmate never Covers, which answers the Covering sponge concern in OQ-06. Full gear tracking makes a Squadmate's ODM use spend gas as a player character's does. A Squadmate never Pushes, so its gear never wears, its ODM Gear never Jams from wear, and its Blade Sets are never ruined; Chapter 4 gives a one-line Squad sheet row for a Squadmate's gear so six fully tracked soldiers stay playable. A Squadmate can take every action a player character can.

### Actions

- A Squadmate can take **every Action Catalog entry a player character can take as an action**, including Help, and every option of those entries, such as Call It. It must meet each entry's requirements, as a player character must. Its Specialty never limits what it can attempt (section 2.6).
- It uses section 2.9 for actions outside the Catalog, exactly as a player character does.
- It can dodge, and it makes any roll a rule calls for, such as `fly`, `ride`, or `death-roll`.
- A Squadmate's own Reaction spends its own turn under Chapter 1, section 1.9 (OQ-09). On a Wing, that is the turn it takes right after its player character's turn.

### Wings (summary)

Chapter 5 gives the full procedure for Wings in a Titan Engagement (section 5.3). The `wing` block states the parts creation needs:

- During a Titan Engagement, a Squadmate can be attached to one player character's Wing.
- It acts **right after that player character's turn**, with one move and one action.
- If the player character's turn has no move and no action because a Reaction or a result spent it in advance (Chapter 1, section 1.9), the Squadmate still acts right after that turn.
- A Wing holds at most one Squadmate.
- Chapter 5 sets when Squadmates are assigned to Wings and what a Squadmate on no Wing does (section 5.3, `data/engagement/round.yaml`, `wings`).

**Directing a Squadmate:**

- Any player can propose what a Squadmate does.
- If players disagree about a Squadmate on a Wing, the player whose character's Wing it is decides.
- If players disagree about a Squadmate on no Wing, each proposed choice is rolled for once, with a D6 rolled by one player who proposed it. The highest roll decides, and choices tied for highest roll again.
- The GM never directs a Squadmate, though the GM may voice one.

> **Design note (OQ-30):** One Squadmate per Wing, a Squadmate acting after a turn spent in advance, the rules for directing Squadmates, and the D6 roll-off for every choice the players share keep the GM out of every Squadmate decision. Squadmates stay among the rules the GM applies as written (Chapter 1, section 1.1, item 6; decision batch 9, 9-11): the GM may give a Squadmate a voice, and the players direct what it does.

### The starting Squad

- The Squad aims for 6 soldiers. The Rank rules, not yet written, may change that number.
- **Starting Squadmates = 6 minus the number of player characters, minimum 0.** Four player characters start with two Squadmates, which matches ADR-0014's default Squad.
- **Fewer is allowed.** At session zero, the players may start with fewer Squadmates than that, down to none (decision batch 8, 8-13); when they disagree on how many, it is a shared choice (section 2.3). It costs two things: fights run about three times deadlier for player characters (four Rookie player characters alone against the same four with two Squadmates: 0.057 against 0.022 deaths a fight on the standard Medium Titan, and 0.187 against 0.058 on the standard Large Titan), and a player character who dies or retires while no living Squadmate is in the Squad Pool has no one to promote (`starting_squad.fewer_allowed`).
- **The playtest configuration.** The first playtest runs 4 player characters and no Squadmates, a playtest rule recorded as `playtest_configuration` (decision batch 8, 8-38). It holds for the whole first playtest campaign, from session zero on. While it holds:
  - the starting Squad is the 4 player characters alone;
  - the Recruit Squad Action brings no Squadmate and is not offered, so the Squad Action is Honoring the Fallen (Chapter 7, section 7.2);
  - no Squadmate serves, so no one is promoted, and a player character who dies or retires is replaced by a new character (*Promotion*, step 4);
  - a rule that reads a Squadmate finds none: every Straggler victim is a player character (Chapter 7, section 7.1), and Formation Drill has no effect.

  Squadmates stay the default rule, as the rest of this section states (decision batch 7, 7-11).
- The players choose a template for each starting Squadmate, name it, and give it Standard Issue. It starts with Health lost 0, not Down, Stress 0, and no Scars, Grief, or Critical Injuries.

**What Squadmates are for.** Two more soldiers mean two more turns a round and more Help on every strike, so Titans die sooner and the Squad faces fewer of their cards. Squadmates reach a Grabbed comrade in time to cut the holding hand or help them break free. They turn a Titan's head with a decoy, or screen the soldier who holds its Attention. When a player character dies or retires, one of them is promoted to take that player's seat. And they are comrades a Drive can name and a Squad can grieve. The easiest way to run them is on Wings (Chapter 5, section 5.3): a Squadmate on a Wing acts right after its player character, and that player has the last word on what it does.

### Promotion

`promotion` gives the procedure for replacing a player character who dies or retires:

1. **When:** when the procedure in which the death or Retirement happened ends, exactly as Retirement is timed (Chapter 3, section 3.13): the last end step of a Titan Engagement, the last step of a day passing, the end of an outside-harm care window and its Death Rolls, or the end of any other procedure as its rule states. Promotion happens at once only if no procedure is under way (`promotion.timing`, OQ-31).
2. **Who chooses** (`promotion.contested`, OQ-38):
   - First, every soldier due to retire at that moment retires, and a retiring Squadmate leaves the Squad Pool.
   - Every player whose character died or retired chooses a living Squadmate in the Squad Pool, all at the same time.
   - If two or more choose the same Squadmate, each of them rolls a D6. The highest takes it, and ties roll again.
   - Every player who loses chooses again from the living Squadmates no player has taken, repeating the roll for any Squadmate chosen by more than one of them, until every player has a Squadmate or none is left. A player with none left follows step 4.
   - Promotions fall due together whenever step 1 resolves them at the same moment.
3. **Conversion:** follow `promotion.steps`.
   - The soldier keeps everything it has, in its current state: attributes, Talent, Health and the Health it has lost to damage, Resolve, Stress, Scars, Grief, Critical Injuries, Down state, gear, and every field in `data/harm/sheet-fields.yaml`. Nothing is recalculated, and attributes never rise (ADR-0011).
   - Its template Talent counts as the Talent level a new soldier gains from the Specialty.
   - It rolls an Origin for a Haven and an optional Canon Tie, and gains 1 level in one of the row's four Talents, following the same caps. A Talent it already holds, such as its template Talent, rises by 1 level.
   - It rolls Why You Enlisted for a Drive, as a new soldier does, and names a comrade now if the Drive needs one.
   - It rolls once on each Training Year's events and gains 1 level in one of each event's three Talents, or in any Talent on that year's curriculum, following the same caps and fallback. This gives it 5 Talent levels in total, from the same sources as a new soldier.
   - It gains no attribute points and no Merit. It records Merit and Class Rank as none, and Rank as Private.
   - It follows every player character rule from then on, leaves any Wing, and is no longer a Squadmate. It stays in the Squad.
4. **No Squadmate available** (`promotion.no_squadmate`): the player creates a new character by any procedure the campaign allows (section 2.3, *Beside the Lifepath*); the Template Build, when the campaign allows it, is the quickest. The new character joins the Squad, with Standard Issue (Chapter 4), at whichever of these comes first:
   - the next Waypoint the Squad reaches, while an Expedition is under way;
   - the start of the next Titan Engagement, while no Expedition is under way;
   - the next Downtime.

> **Design note (OQ-31, OQ-38; decision batch 7, 7-11):** Promotion shares Retirement's timing, so a player character who dies partway through a procedure and one who retires at its end are replaced at the same moment, and no promotion interrupts a procedure. The contest changes nothing when no Squadmate is contested, and uses the roll-off every other shared choice uses. The conversion keeps the Squadmate's current state and takes its 4 new Talent levels from the Lifepath's rolled sources; it is also how a promoted Squadmate gains a Drive. A player with no Squadmate to promote gets a new soldier at the next point the Squad regroups, rather than at the next session: a Waypoint is where a formation gathers, and outside an Expedition the start of the next fight is the moment the interim rules already use to issue gear, so a table of four player characters without Squadmates never loses a player for the rest of a session. Starting with fewer Squadmates is allowed at the stated price, which is the best-measured figure in the project, because every reference start is four player characters alone.

---

## 2.11 Building a soldier without the Lifepath

A built soldier is the tuned Rookie every Titan number in this book was set against, with the player choosing what they carry; a rolled soldier is that same soldier on average, with a chance to come out ahead and a chance to come out behind.

Two procedures sit beside the Lifepath (section 2.3): the **Template Build** and the **Free Build**. A player may use one only when the campaign allows it (`campaign_choice` in `data/character/lifepath.yaml`; section 2.3, *Beside the Lifepath*). Beyond that campaign choice, the GM plays no part in a build. Both builds follow `built_steps` in the same file, and they differ only at step 3.

### The steps

1. **Campaign Year.** If the campaign has not yet recorded one, record it (section 2.3, *Before the Lifepath*). A built soldier takes no Graduation Exam, whatever the vote (section 2.4).
2. **Specialty.** Choose one of the nine Specialties (section 2.6). It is not rolled, has no requirement, and never changes.
3. **Attributes** (section 2.2, *How a built soldier's attribute ratings are set*):
   - **Template Build:** record the Specialty's template ratings (section 2.10).
   - **Free Build:** choose one of the two shapes and place it with a 4 on the key attribute.
4. **Origin.** Choose an Origin row whose condition the current Campaign Year meets (section 2.3.1). Record one of its three Havens and, if the row has one and the player wants it, its Canon Tie. Gain level 1 in one of its four Talents. The row's two attributes gain nothing.
5. **Drive.** Record the Drive of any Why You Enlisted row (section 2.3.2). No attribute gains a point.
6. **Training Years, for the story.** The player may name one event row of each Training Year. A named row gives no attribute point, Talent level, or Merit, and no performance roll is made.
7. **Talents.** Gain 1 level in one Talent on the Specialty's list or on the general list, then 3 levels in any Talents, within the limits below.
8. **Merit and Class Rank.** Record Merit none and Class Rank none (`built_and_promoted` in `data/character/class-rank.yaml`). The soldier is not Top 10: there is no Military Police offer and no key attribute bonus.
9. **Finish and join the Squad** as a Lifepath soldier does (section 2.3.5).

### Talent limits

`built_steps.talent_levels` gives them:

- 5 levels in total: 1 from the Origin row, 1 from the Specialty's list or the general list, and 3 from any Talents.
- No Talent above level 2, and **at most one Talent at level 2**.
- No rule Talent above its `max_level` (section 2.7).
- A level gained in a Talent the soldier already holds raises it by 1.

### What only the Lifepath reaches

A built soldier always has 18 attribute points, a key attribute of 4, and Health and Resolve of 2 to 4 each. A Free Build soldier who places both 2s on Strength and Agility has Health 2 and is **fragile**: two untreated Critical Injuries put them Down. A Squad of four such soldiers, all Free Build Medics, with two helper Squadmates (`reported_squad_health_2`) lost 0.076 soldiers per fight to the standard Medium Titan in the measurement behind this rule, against 0.018 at Health 4, and the rerun reports that row beside the targets without tuning it (decision batch 8, 8-3). Only the Lifepath can give a key attribute of 5 or 6, a Top 10 Class Rank, or a place in the Graduation Exam. A player who wants that chance rolls.

> **Design note (decision batch 7, 7-1; OQ-135):** The owner asked for a way to choose a soldier beside the rolled Lifepath. Choosing the best Lifepath rows puts a key attribute of 6 on 88.9% of soldiers, against 2.1% rolled, and a budget with a cap of 5 puts a 5 on every key attribute; either would move every dodge and solo figure ADR-0014 tunes against the Rookie's Agility 3 and Strength 4. A cap of 4 with at most two 4s is the freest budget that stays inside the Lifepath's envelope: the 4, 4, 3, 3, 2, 2 shape trades two 3s for a 4 and a 2, so it is a Rookie with a chosen strength and a chosen weakness, not a Veteran. One Talent at level 2 on the key roll is inside the envelope as well (a Clean Cut 2 Rookie's fresh cut succeeds 18.5% of the time, a rolled Strength 5 soldier's 18.8%); stacking several is what the one-level-2 limit forbids. The campaign choice is made once for the whole campaign, not per soldier, so that no ruling at the table hands one player the certainty and another the gamble (section 2.3, *Beside the Lifepath*). The Template Build Squad is the template Squad ADR-0014 already reports. A Squad of four Free Build soldiers (the 4, 4, 3, 3, 2, 2 shape with Strength and Agility at 4, and Talent 2 on the roll each soldier makes) is reported beside the Talent-dependent targets and not tuned (ADR-0014 as amended in batch 7; `creation.built.free_build.reported_squad` in `data/character/attributes.yaml`).

---

## Example: creating a soldier

*The rolls and row values below follow the YAML files at the time of writing. If the files change, the files govern.*

Mira's player rolls her Lifepath.

- **Before the Lifepath.** The players record Campaign Year 846 and vote not to run the Graduation Exam.
- **Start.** Every attribute is 2.
- **Origin.** The roll of 25 gives Wall Rose Farm. Strength and Perception go to 3. She takes level 1 in Horsemanship and records the family farm as her Haven.
- **Why You Enlisted.** The roll of 42 gives the row about protecting the people inside the Walls. Strength goes to 4. Her player keeps the rolled row's Drive, Shield the Walls: "When I took Draw Attention on my most recent turn."
- **First Year.**
  - The event roll of 44 gives Fire in the stables. Perception goes to 4, and her Merit is 1. Her player takes Keen Eyes 1, which adds its die to Spot, the Leg roll at the Vanguard, Signal Relay, and Rear Guard Formation Posts (Chapter 7). Horsemanship was the other choice.
  - The performance attributes are Strength (4) and Instinct (2), so she rolls 4 dice. One success adds 1 Merit, for 2.
- **Second Year.**
  - The event roll of 13 gives The wooden nape. Strength goes to 5, she takes Clean Cut 1, and Merit rises by 2, to 4.
  - The performance attributes are Agility (2) and Perception (4), so she rolls 4 dice. One success brings Merit to 5.
- **Third Year.** The players voted not to run the Graduation Exam, so Mira makes the Year 3 performance roll.
  - The event roll of 34 gives Arguing with an instructor. Empathy goes to 3, she takes Silver Tongue 1, which adds its die to Persuade for a Requisition or a Parley (Chapter 7), with Wide Awareness the other choice, and Merit drops to 4.
  - She rolls Empathy (3) rather than Wits (2). One success brings Merit to 5.
- **Graduation.**
  - A Merit total of 5 is Class Rank 25. That is not Top 10, so there is no Military Police offer and no key attribute bonus.
  - She chooses Slayer. Its key attribute is Strength, already 5, so there is no swap. Had she chosen Tactician, her Instinct (2) would have swapped with her Strength (5), leaving Instinct 5 and Strength 2. Had she chosen Hunter, her Perception (4) would have swapped with her Strength (5) in the same way.
  - Her Specialty Talent level goes into Clean Cut, raising it to 2.
- **Finish.**
  - Attributes: Strength 5, Agility 2, Wits 2, Perception 4, Instinct 2, Empathy 3, for 18 points.
  - Talents: Clean Cut 2, Horsemanship 1, Keen Eyes 1, Silver Tongue 1, which is 5 levels.
  - Health is (5 + 2) / 2 = 3.5, rounded up to 4: a row of 4 boxes. Resolve is (2 + 3) / 2 = 2.5, rounded up to 3. Stress is 0.
  - She is a Private.

Mira's Nape strike rolls 7 dice before Gear, Bonus, and Stress Dice. On ODM Gear her dodge's base dice are only Agility 2. Horsemanship adds its die only to a dodge made mounted with the horse as its gear item, which rolls Agility 2 and Horsemanship 1. She will want a comrade Helping, or a Read and Call It, when a Titan's hand comes for her.

---

## Appendix 2A: Talents and the Action Catalog

These reference tables are rendered from `data/character/talents.yaml`, `data/character/specialties.yaml`, and `data/character/action-catalog.yaml`. The Talent tables group the Talents by Specialty list, with the general list last. No entry or Talent is dormant or reserved now (section 2.8); a name marked dormant or reserved would be an entry no rule calls for, or a Talent that names only such entries.

### 2A.1 Dice Talents

<!-- BEGIN RENDERED: talents-dice from data/character/talents.yaml -->
| Talent | Names | Max level | Specialty lists | Description |
|---|---|---|---|---|
| Clean Cut | Nape strike | 3 | Slayer | Practice at the single deep cut through the Nape that kills. |
| Hamstringer | Body Part strike | 3 | Slayer | Practice at cutting ankles, arms, and eyes to bring a Titan down. |
| Ground Work | Nape strike (against a grounded Titan), Body Part strike (against a grounded Titan) | 3 | Slayer | Practice at finishing a Titan that is down on the ground, at its Nape or its Body Parts. |
| Slip Away | Dodge | 3 | Flier | A knack for twisting clear of a Titan's hands and teeth. |
| Wirework | Fly | 3 | Flier | Control on the wires when a hard swing or landing is called for. |
| High Vantage | Spot (while your ODM Gear is not Jammed and its Gas Rating is above 0), Sneak (while your ODM Gear is not Jammed and its Gas Rating is above 0) | 3 | Flier | Climbing high on the wires to watch the ground ahead or to come at people unseen. |
| Lure | Break Attention | 3 | Hunter | Placing a flare, a horse, or a cloak where a Titan will turn to look. |
| Keen Eyes | Spot | 3 | Hunter | Noticing movement, smoke, and danger at a distance. |
| Fieldcraft | Survive | 3 | Hunter | Living off the land and keeping a camp safe outside the Walls. |
| Musket Drill | Shoot (with a musket) | 3 | Hunter | Loading, bracing, and firing a musket with a hunter's patience. |
| Titan Reader | Read | 3 | Tactician | Watching a Titan closely enough to see what it will do next. |
| Judge of Character | Size Up | 3 | Tactician | Reading what a person wants and whether they are lying. |
| Route Finder | Spot (on the Leg roll, as Lead), Survive (on the Leg roll, as Lead), Endure (on the Leg roll, as Lead), Ride (on the Leg roll, as Lead) | 3 | Tactician | Choosing the line of a ride so the Squad arrives in good order, wherever it rides in the formation. |
| Steady Voice | Rally | 3 | Leader | Talking a comrade back to their senses in the middle of a Titan Engagement. |
| Silver Tongue | Persuade | 3 | Leader | Talking people into things. |
| Stand Down | Persuade (against a person), Size Up (against a person) | 3 | Leader | The voice of command that makes armed people think twice. |
| Field Medicine | Treat Injury | 3 | Medic | Binding injuries and keeping the injured alive in the field. |
| Book Learning | Recall | 3 | Medic | Remembering what the lectures, books, and reports said. |
| Camp Surgeon | Treat Injury (in the care window held when a day passes on an Expedition), Survive (on the camp roll at a Night Camp) | 3 | Medic | Keeping a Night Camp's injured clean, warm, and alive until morning. |
| Gearwright | Field Repair | 3 | Engineer | Repairing ODM Gear and other equipment with field tools. |
| Wagon Master | Survive (on the Leg roll at the Supply Wagon Formation Post), Field Repair (in the care window held when a day passes on an Expedition) | 3 | Engineer | Keeping the supply wagon rolling and every harness sound on the long road. |
| Know the Stores | Recall (on a Requisition roll for ODM Gear, a Blade Set, a tool kit, a flintlock pistol, or a musket) | 3 | Engineer | Knowing the regulation, the form, and the clerk for every piece of gear in the stores. |
| Horsemanship | Ride, Dodge (while mounted, with the horse as the dodge's gear item) | 3 | Rider | Riding hard and well, whatever the ground and whatever gives chase: it adds its dice to Ride and to the dodge a mounted soldier makes with the horse's Gear Dice. |
| Cavalry Cut | Body Part strike (while mounted), Break Attention (while mounted) | 3 | Rider | Cutting at a Titan's Body Parts, or decoying it, from the saddle at a gallop. |
| Long Haul | Endure | 3 | Rider | Keeping going through hunger, cold, and exhaustion. |
| Grip Breaker | Break Free, Heave | 3 | Brawler | Tearing free of a grip, even a Titan's, and heaving its body off a comrade. |
| Hard to Kill | Death Roll | 3 | Brawler | Holding on to life when an injury should be fatal. |
| Hand-to-Hand | Fight, Block | 3 | Brawler | Fighting and blocking people up close, with a Blade Set, bare-handed, or as a Grapple. |
| Menace | Persuade (on a roll made as a threat) | 3 | Brawler | Looking like you mean it when you order people to back away. |
| Quiet Step | Sneak | 3 | General | Moving without being seen or heard. |
| Will to Live | Death Roll (when a lethal Critical Injury's day limit runs out) | 3 | General | Refusing to die in a wagon bed or an infirmary cot. |
| Every Last One | Nape strike (after a comrade has died in this Titan Engagement), Body Part strike (after a comrade has died in this Titan Engagement) | 3 | General | The cold fury that steadies the hand after a comrade is killed. |
| Underground Instincts | Sneak (against a Foe group of Military Police troopers), Size Up (against a Foe group of Military Police troopers) | 3 | General | Years of staying one step ahead of the Military Police. |
<!-- END RENDERED: talents-dice -->

### 2A.2 Rule Talents

<!-- BEGIN RENDERED: talents-rule from data/character/talents.yaml -->
| Talent | Names | Trigger | Effect | Limit | Max level | Specialty lists | Description |
|---|---|---|---|---|---|---|---|
| Relentless | Nape strike | Your Nape strike falls short of the struck Titan's Nape Depth with at least 1 success. | The strike creates 1 more Opening than data/engagement/titan-harm.yaml (nape_strikes) gives it for its successes. It does not change the roll, its successes, or whether the Titan dies. | none | 1 | Slayer | A cut that falls short still leaves the Titan open for the next soldier. |
| Blade Discipline | Nape strike, Body Part strike, Break Free, Block, Fight | A Pushed roll made for a named entry, with a Blade Set as its gear item, is about to wear that Blade Set. | Ignore 1 point of that wear. | once per Titan Engagement | 1 | Slayer | Care that keeps Blade Sets sharp through a long fight. |
| Flat of the Blade | Fight | Your Fight made with a Blade Set lands on a Foe in a Skirmish. | You may make its damage Crush instead of Cut. A Foe it brings to 0 Health is out cold, as Crush damage leaves a Foe, and not dead (Chapter 7, section 7.4). | none | 1 | Slayer | Striking a person to stop them, not to kill them. |
| Ready Blade | Squad Tactic, Nape strike | You declare that Hook and Cut makes you its striking comrade, and your action this round is already spent. | Hook and Cut may still be used with you as that comrade. Its Nape strike spends the action of your next turn instead (data/harm/effect-types.yaml, spend-next-action). Every other condition of Hook and Cut still applies (data/engagement/squad-tactics.yaml, hook-and-cut). | once per Titan Engagement | 1 | Slayer | Always ready to take the cut a comrade's decoy opens. |
| Wrist Cut | Body Part strike | Your Body Part strike against an arm that holds a Grabbed comrade has at least 1 success. | The strike gains 1 success. | once per Titan Engagement | 1 | Slayer | A cut aimed at the wrist of the hand that holds a comrade. |
| Well-Kept Rig | Dodge, Fly, Break Attention | A Pushed roll made for a named entry, with your ODM Gear as its gear item, is about to wear your ODM Gear. | Ignore 1 point of that wear. | once per Titan Engagement | 1 | Flier, Engineer | Maintenance that keeps ODM Gear working when it is pushed hard. |
| Light Trigger | Gas Roll | Your Gas Roll this round would be three dice because you made a Pushed roll whose gear item was ODM Gear. | The Gas Roll is two dice instead. | once per Titan Engagement | 1 | Flier | A gentle hand on the gas trigger that makes a canister last. |
| Mid-Air Catch | Fly | In a Titan Engagement, a comrade falls while holding the Position you hold relative to the fall's reference Titan (data/gear/falls.yaml, height), and you are airborne, not carried, and carrying no comrade. | Before the fall's damage is rolled, you may make a roll for Fly with your own ODM Gear, needing 1. It spends nothing, can be Pushed, and cannot be Helped, and it is ODM use (data/gear/odm-gear.yaml, odm_use). On a success the fall's band is low, whatever the height steps give. A Jam on this roll makes you fall as any Jam does. | once per Titan Engagement | 1 | Flier | Swinging in on the wires to catch a falling comrade. |
| Lookout Tree | Spot, Survive, Endure, Ride | A Leg's Leg roll succeeds, the Waypoint the Leg leads to is of the Forest or Giant forest kind (Chapter 7, section 7.1), and you are not Down and your ODM Gear is not Jammed and has a Gas Rating above 0. | This Leg's hazard roll is 1 lower. It is lowered once, however many soldiers hold Lookout Tree. | once per Leg | 1 | Flier | Going up a tree to see what waits on the next stretch of the ride. |
| Close Pass | Break Attention | You declare a Break Attention that names a Feint. | The Feint adds nothing to what the roll needs (data/engagement/attention.yaml, break_attention, needs, feint_extra). Every other need still applies. | once per Titan Engagement | 1 | Flier | A pass across a Titan's face close enough that it has to look. |
| Hunter's Eye | Read | You declare a Read. | The roll may use Perception instead of Instinct. It is still made for Read, so a Talent that names Read still adds its dice. | none | 1 | Hunter | Reading a Titan by sight rather than by gut. |
| Flare Discipline | Break Attention | Your Break Attention that names a flare decoy succeeds. | The decoy holds the Titan's Attention for 1 more of its cards than its Tempo (data/engagement/attention.yaml, break_attention, on_success). | once per Titan Engagement | 1 | Hunter | A flare placed where it keeps burning in a Titan's eyes. |
| Forager | Survive | The camp roll at a Night Camp succeeds, and you made it or Helped it. | The Night Camp spends no ration, and a camp that finds Squad Supply with no rations counts as having its ration (Chapter 7, section 7.1). This applies once for the camp, however many soldiers hold Forager. | once per Night Camp | 1 | Hunter | Snares, roots, and clean water found before dark. |
| Saw It Coming | Read | A Titan Engagement begins from a row of the Leg Hazard table or the Night table (Chapter 7, section 7.1), and you take part in it and are not Down. | Before round 1, the first Focus Titan's Next Behavior is revealed to every soldier, as a Read's next-behavior fact reveals it (data/engagement/read.yaml, facts). No Call It can be made on it. It is revealed once, however many soldiers hold Saw It Coming. | once per Titan Engagement | 1 | Hunter | The first to see a Titan coming, and how it moves. |
| Sharp Call | Call It | You declare Call It. | Calling It needs one fewer success from your Read than data/engagement/read.yaml (call_it) states, to a minimum of 1. | none | 1 | Tactician | Calling It in time with less to go on. |
| Wide Awareness | Help | You declare Help for a roll in a Titan Engagement. | You may be up to two Position steps from the roller instead of one. Every other Help requirement in Chapter 1, section 1.8, still applies. | none | 1 | Tactician | Seeing where Help is needed across the field. |
| Formation Drill | Help | You declare that the Squadmate on your Wing Helps a roll of yours in a Titan Engagement. | The Squadmate may be up to two Position steps from you instead of one. Every other Help requirement in Chapter 1, section 1.8, still applies. | none | 1 | Tactician | Drilled with your Squadmate until each knows where the other will be. |
| Change the Order | Swap Initiative Card | The swap step of a round in a Titan Engagement begins, and you hold a card this round and are neither Down nor Grabbed. | You may name two comrades who each hold a card this round, are neither Down nor Grabbed, and both agree. They exchange cards whatever Positions they hold. It is the one swap each of them takes part in this round (data/engagement/round.yaml, swapping); you take no part in it. | none | 1 | Tactician | Putting the right soldier's turn first. |
| Break Their Nerve | Size Up | Your Size Up of a Foe group in a Skirmish succeeds. | For the rest of that Skirmish, the group's Grit counts as 1 lower when testing whether it breaks, to a minimum of 1 (Chapter 7, section 7.4). What a Parley against it needs does not change. | once per Skirmish | 1 | Tactician | Seeing who will run first, and making sure they do. |
| Unshaken Command | Fear Roll | In a Titan Engagement, a comrade who holds your Position or a Position one step from you makes a Fear Roll, and you are not Down. | That Fear Roll uses your Resolve in place of the comrade's, if yours is higher. | once per Titan Engagement | 1 | Leader | A calm presence that steadies nearby comrades against terror. |
| Shout Them Off | Draw Attention | You declare Draw Attention in a Titan Engagement. | You may spend your move on it instead of your action. | once per Titan Engagement | 1 | Leader | Pulling a Titan onto yourself with a bellow, without breaking stride. |
| Carrying Voice | Rally | You declare Rally. | You may target a comrade one Position step farther from you than Chapter 3 allows. In a Skirmish, which has no Positions, you may target any soldier taking part in it (Chapter 7, section 7.4). | none | 1 | Leader | A voice that reaches a comrade farther away. |
| Shoulder the Load | Cover | You declare that you Cover a comrade's Push in a Titan Engagement. | You may be up to two Position steps from the Pushing soldier instead of one. Every other Covering requirement in Chapter 1, section 1.5, still applies. | none | 1 | Leader | Taking on the Stress of comrades farther away. |
| Put In a Word | Help, Persuade, Recall | You declare that you Help a comrade's Requisition roll (Chapter 7, section 7.3). | If you are a player character, the Help does not spend your own Requisition this Downtime, and you may Help even if you have already made your own Requisition roll. Every other Help requirement of that roll still applies. | once per Downtime | 1 | Leader | Vouching for a comrade in front of the quartermaster. |
| Campfire Talk | Survive | The camp roll at a Night Camp succeeds, and you are not Down. | Camp Relief lowers the Stress of every soldier on the Expedition by 2 instead of 1, never below a soldier's minimum (a named reduction, data/core/stress-changes.yaml). This applies once for the camp, however many soldiers hold Campfire Talk. | once per Night Camp | 1 | Leader | Keeping the Squad talking by the fire until they can sleep. |
| Careful Nursing | Treat Injury | Your roll for Treat Injury succeeds on a comrade's Critical Injury. | That Critical Injury's healing time, as Chapter 3 gives it, is halved, rounding up. Each Critical Injury can be halved only once. | none | 1 | Medic | Aftercare that speeds healing. |
| Sure Hands | Treat Injury | You have Pushed a roll made for Treat Injury, and no Stress Die shows 1. | You may Push that roll a second time, following the Push procedure in Chapter 1 again. A roll never causes more than one Stress Response. | none | 1 | Medic | A second attempt at treatment under pressure. |
| Triage | Treat Injury | Your roll for Treat Injury in a care window succeeds with at least 2 successes on the treat use (data/harm/treat-injury.yaml, uses). | One more untreated Critical Injury of the same patient, one the same roll's treat use could have named, also becomes treated, as treat gives. It uses no soldier's roll in the window. | none | 1 | Medic | Treating the worst of a comrade's injuries in one pass. |
| Friends in the Infirmary | Persuade, Recall | You declare a Requisition roll for a medical kit or for medical supplies (Chapter 7, section 7.3). | The roll needs 1 fewer success than its Scarcity and the ledger give, to a minimum of 1. | once per Downtime | 1 | Medic | Knowing which orderly can find a spare kit or a crate of bandages. |
| Tourniquet | Treat Injury | In a Titan Engagement, your roll for Treat Injury on a comrade's lethal Critical Injury with a turn limit fails. | That Critical Injury's time limit slows one step, from turn to engagement (data/harm/death-rolls.yaml, time_limits). It stays untreated and keeps its Health box crossed off. | once per Titan Engagement | 1 | Medic | A strap pulled tight to keep a comrade alive until the fighting stops. |
| Make Do | Field Repair | You declare a roll for Field Repair, and gear_requirement in data/character/action-catalog.yaml applies the entry's without_gear value (attribute_alone) because you have no tool kit that counts as had. | The roll still adds dice from one Talent that names Field Repair. | none | 1 | Engineer | Improvising repairs without a proper tool kit. |
| Quick Refit | Change Canister | You declare Change Canister in a Titan Engagement. | If Chapter 4 makes changing a canister spend your action, you may spend your move on it instead. | once per Titan Engagement | 1 | Engineer | Swapping gas canisters with practiced speed. |
| Spare Parts | Field Repair | Your roll for Field Repair in a Titan Engagement succeeds. | The named item's current rating rises by 1 more, to at most its rating (data/gear/field-repair.yaml, on_success). | once per Titan Engagement | 1 | Engineer | A pocket of springs and spare hooks for a quick fix. |
| Gunsmith | Shoot | A Pushed roll for Shoot, with your firearm as its gear item, is about to wear that firearm. | Ignore 1 point of that wear. | once per Skirmish | 1 | Engineer | Care that keeps a flintlock firing. |
| Loose the Horse | Break Attention | You declare a roll for Break Attention with your horse as its gear item. | The roll may use Agility instead of Perception. | none | 1 | Rider | Sending a horse where a Titan will chase it. |
| Sure Seat | Dodge, Ride, Break Attention | A Pushed roll made for a named entry, with your horse as its gear item, is about to wear your horse. | Ignore 1 point of that wear. | once per Titan Engagement | 1 | Rider | A seat that keeps the horse sound when a dodge, Ride, or Break Attention made with the horse is Pushed. |
| Rescue Ride | Lift Comrade | You declare Lift Comrade while mounted. | You may take it as part of your move instead of as your action. | once per Titan Engagement | 1 | Rider | Scooping a fallen comrade onto the saddle at a gallop. |
| Horse Whistle | Mount or Dismount | You declare a move in a Titan Engagement that mounts your own horse, while you hold Distant or In Reach relative to the Focus Titan recorded with the horse's Position. | Before the move, your horse holds the Position you hold, if it is not lame and holds a Position, so the move can mount it (data/gear/horses.yaml, mounted, mount). Every other mount requirement still applies. | once per Titan Engagement | 1 | Rider | A horse trained to come at its rider's whistle. |
| Hard Rider | Ride | Your Ride roll as Lead on a Hard Ride succeeds (Chapter 7, section 7.1). | The Leg spends 1 ration fewer than a successful Hard Ride spends. | once per Leg | 1 | Rider | Getting a hard day's ride out of horse and rider on short rations. |
| Pry Loose | Break Free | You declare Break Free on behalf of a Grabbed comrade who holds your Position, and you are not Grabbed. | You may take Break Free as your action on that comrade's behalf, although you are not Grabbed. You roll your own pool for Break Free, including your dice Talent that names it. If the roll succeeds, the comrade is freed exactly as if they had succeeded on Break Free themselves. It never applies to a comrade Held by a Foe in a Skirmish (Chapter 7, section 7.4). | none | 1 | Brawler | Prying a comrade out of a Titan's grip. |
| Strong Back | Lift Comrade | You carry a comrade you lifted with Lift Comrade. | The comrade's own 5 items do not count toward the items you carry. The items that comrade carries still count (data/gear/carrying.yaml, items_counted). | none | 1 | Brawler | Carrying a comrade without their weight slowing you down. |
| Headlock | Fight | Your Grapple lands on a Foe in a Skirmish, and that Foe becomes Held by you. | While you hold that Foe, it counts as out of the Skirmish for its group's breaking test (Chapter 7, section 7.4). If the group breaks while you hold it, that Foe does not leave: it surrenders and is out of the Skirmish. Only that Foe surrenders; the group's other Foes break as its breaking test gives. | none | 1 | Brawler | Holding one of them down until the rest lose their nerve. |
| Shoulder Charge | Break Free | Your roll for Break Free in a Titan Engagement frees a Grabbed soldier. | The Titan that had them Grabbed gains 1 Opening, created by you (data/engagement/titan-harm.yaml, openings). | once per Titan Engagement | 1 | Brawler | Tearing out of a Titan's fingers hard enough to leave it open. |
| Iron Nerve | Stress Response roll | You roll for a Stress Response. | Your Resolve counts as 1 higher for that roll. | none | 1 | General | Keeping steady as Stress mounts. |
| Steady Heart | Fear Roll | You make a Fear Roll for the comrade-grabbed or comrade-dies trigger (data/mind/fear-rolls.yaml). | Your Resolve counts as 1 higher for that roll. | once per Titan Engagement | 1 | General | Keeping your feet when a comrade is taken. |
| Got Your Back | Cover | You declare that you Cover a comrade's Push in a Titan Engagement. | If you have Covered no other comrade's Push in this Titan Engagement, you may Cover it from any number of Position steps away. Every other Covering requirement in Chapter 1, section 1.5, still applies. | none | 1 | General | One comrade whose fear you always carry. |
| Gallows Humour | Stress Response roll | You roll for a Stress Response. | Once the total is known, you may roll the D6 a second time. Use the second total. | once per Titan Engagement | 1 | General | A bad joke at the worst moment that keeps you from coming apart. |
| Stay With the Column | Endure | You have Pushed the Endure roll a Straggler row calls for (Chapter 7, section 7.1), and no Stress Die shows 1. | You may Push that roll a second time, following the Push procedure in Chapter 1 again. A roll never causes more than one Stress Response. | once per Leg | 1 | General | Keeping up with the column when your body says stop. |
| Light Sleeper | Dodge, Block | A Skirmish begins at a Night Camp with its Foes holding the ambush (Chapter 7, sections 7.1 and 7.4), and you are not Down. | The ambush does not stop your Reactions: in round 1 you may make a Reaction against a Foe's attack as Chapter 1, section 1.9, allows. | once per Skirmish | 1 | General | Waking at the first footstep outside the camp. |
| Nothing Wasted | Take Item | You declare Take Item in a Titan Engagement for a dead comrade's left items (data/gear/carrying.yaml, taking_items). | The take spends your move instead of your action. | once per Titan Engagement | 1 | General | Taking gas and Blade Sets from the fallen without a moment's pause. |
| Not Like This | Break Free | You declare Break Free while you are Grabbed and have been lifted. | The roll takes no lifted penalty (data/engagement/grab.yaml, escapes, break-free, lifted_penalty). | once per Titan Engagement | 1 | General | Fighting hardest when a Titan's mouth is closest. |
<!-- END RENDERED: talents-rule -->

> **Design note (decision batch 8, 8-42; ADR-0016, Talent guardrail 8):** Once per Titan Engagement is the default limit for a Talent that changes a cost or a roll count. **Quick Refit** and **Rescue Ride** take it, since each turns an action into a move inside one Titan Engagement, and **Stay With the Column** takes once per Leg, since its second Push lives inside one Leg's Straggler roll. **Sure Hands** keeps no limit. It also reaches aftermath rolls and care windows, where once per Titan Engagement would forbid it outright, which is a bigger change than a limit, and its second Push already costs Stress Dice. None of the four is modelled in the simulator.

### 2A.3 Action Catalog entries

<!-- BEGIN RENDERED: action-catalog from data/character/action-catalog.yaml -->
| Entry | Id | Kind | Rolled | Attribute | Gear items | Needs its gear | Used | Status |
|---|---|---|---|---|---|---|---|---|
| Nape strike | `nape-strike` | action | when taken | Strength | Blade Set | yes; without it the entry cannot be used | in a Titan Engagement | none |
| Body Part strike | `body-part-strike` | action | when taken | Strength | Blade Set | yes; without it the entry cannot be used | in a Titan Engagement | none |
| Break Attention | `break-attention` | action | when taken | Perception | ODM Gear, Horse | no | in a Titan Engagement | none |
| Draw Attention | `draw-attention` | action | never | none | none | not applicable | in a Titan Engagement | none |
| Read | `read` | action | when taken | Instinct | none | not applicable | in a Titan Engagement | none |
| Call It | `call-it` | option | never | none | none | not applicable | in a Titan Engagement | none |
| Break Free | `break-free` | action | when taken | Strength | Blade Set | no | anywhere | none |
| Swap Initiative Card | `swap-initiative-card` | option | never | none | none | not applicable | in a Titan Engagement | none |
| Squad Tactic | `squad-tactic` | option | never | none | none | not applicable | in a Titan Engagement | none |
| Lift Comrade | `lift-comrade` | action | never | none | none | not applicable | anywhere | none |
| Heave | `heave` | action | when taken | Strength | none | not applicable | in a Titan Engagement | none |
| Change Canister | `change-canister` | action | never | none | none | not applicable | anywhere | none |
| Pass Item | `pass-item` | action | never | none | none | not applicable | anywhere | none |
| Take Item | `take-item` | action | never | none | none | not applicable | anywhere | none |
| Mount or Dismount | `mount-or-dismount` | option | never | none | none | not applicable | anywhere | none |
| Swap Blade Set | `swap-blade-set` | option | never | none | none | not applicable | anywhere | none |
| Shed Load | `shed-load` | option | never | none | none | not applicable | anywhere | none |
| Restock Medical Kit | `restock-medical-kit` | option | never | none | none | not applicable | anywhere | none |
| Help | `help` | action | never | none | none | not applicable | anywhere | none |
| Cover | `cover` | option | never | none | none | not applicable | anywhere | none |
| Dodge | `dodge` | Reaction | when taken | Agility | ODM Gear, Horse | no | anywhere | none |
| Block | `block` | Reaction | when taken | Strength | Blade Set | no | anywhere | none |
| Fight | `fight` | action | when taken | Strength | Blade Set | no | anywhere | none |
| Shoot | `shoot` | action | when taken | Agility | Flintlock pistol, Musket | no | anywhere | none |
| Reload | `reload` | option | never | none | none | not applicable | anywhere | none |
| Release | `release` | option | never | none | none | not applicable | anywhere | none |
| Treat Injury | `treat-injury` | action | when taken | Wits | Medical kit | yes; without it, attribute alone | anywhere | none |
| Rally | `rally` | action | when taken | Empathy | none | not applicable | anywhere | none |
| Field Repair | `field-repair` | action | when taken | Wits | Tool kit | yes; without it, attribute alone | anywhere | none |
| Fly | `fly` | roll | when a rule or the GM calls for it | Agility | ODM Gear | yes; without it the entry cannot be used | anywhere | none |
| Leap Clear | `leap-clear` | roll | when a rule calls for it | Agility | ODM Gear, Horse | no | in a Titan Engagement | none |
| Ride | `ride` | roll | when a rule or the GM calls for it | Agility | Horse | yes; without it the entry cannot be used | anywhere | none |
| Death Roll | `death-roll` | roll | when a rule calls for it | Strength | none | not applicable | anywhere | none |
| Fear Roll | `fear-roll` | fixed roll | when a rule calls for it | none | none | not applicable | anywhere | none |
| Stress Response roll | `stress-response-roll` | fixed roll | when a rule calls for it | none | none | not applicable | anywhere | none |
| Gas Roll | `gas-roll` | fixed roll | when a rule calls for it | none | none | not applicable | anywhere | none |
| Spot | `spot` | roll | when a rule or the GM calls for it | Perception | none | not applicable | anywhere | none |
| Size Up | `size-up` | roll | when a rule or the GM calls for it | Instinct | none | not applicable | anywhere | none |
| Survive | `survive` | roll | when a rule or the GM calls for it | Instinct | none | not applicable | anywhere | none |
| Persuade | `persuade` | roll | when a rule or the GM calls for it | Empathy | none | not applicable | anywhere | none |
| Endure | `endure` | roll | when a rule or the GM calls for it | Strength | none | not applicable | anywhere | none |
| Sneak | `sneak` | roll | when a rule or the GM calls for it | Agility | none | not applicable | anywhere | none |
| Recall | `recall` | roll | when a rule or the GM calls for it | Wits | none | not applicable | anywhere | none |
| Downtime Action | `downtime-action` | option | never | none | none | not applicable | anywhere | none |
| Squad Action | `squad-action` | option | never | none | none | not applicable | anywhere | none |
| Performance roll | `performance-roll` | roll | when a rule calls for it | the Training Year's performance attribute | none | not applicable | in the Lifepath | none |
<!-- END RENDERED: action-catalog -->

### 2A.4 What each entry requires and changes

<!-- BEGIN RENDERED: action-catalog-requirements from data/character/action-catalog.yaml -->
| Entry | Requirements | Needs | Changes | Help outside a Titan Engagement | Notes | Rules in |
|---|---|---|---|---|---|---|
| Nape strike | The soldier holds Blind Spot and does not hold the struck Titan's Attention (ADR-0010). The soldier is not Grabbed. In a Titan Engagement, the soldier's ODM Gear counts as had: not Jammed, and with a Gas Rating above 0 (data/gear/odm-gear.yaml, strikes), unless the Titan is grounded (data/engagement/titan-harm.yaml, grounded). No retreat is under way (data/engagement/background-titans.yaml, retreat, actions). Making the strike counts as hooking into the Titan. | the struck Titan's Nape Depth | kill a Titan, create Openings | not taken outside a Titan Engagement | none | Chapter 5, Chapter 4 |
| Body Part strike | The Position and state requirements in data/engagement/titan-harm.yaml (body_part_strikes) and data/engagement/grab.yaml (escapes). In a Titan Engagement, a strike made from On Body or Blind Spot also needs the soldier's ODM Gear to count as had (data/gear/odm-gear.yaml, strikes), unless the Titan is grounded. | 1; successes add up toward the Body Part's Toughness (data/engagement/titan-harm.yaml) | add successes toward a Body Part's Toughness, move a Body Part toward Broken, create Openings, free a Grabbed soldier, get out from under a falling Titan's body, or free a soldier it pins | not taken outside a Titan Engagement | Striking the hand that holds a Grabbed soldier is a Body Part strike (Chapter 5, ADR-0019). So is cutting the Body Part that pins a soldier, which frees them when it becomes Broken (data/engagement/titan-harm.yaml, falling_titan, cut_free; decision batch 8, 8-17). | Chapter 5, Chapter 4 |
| Break Attention | data/engagement/attention.yaml (break_attention) | 1 for the soldier holding the Titan's Attention, otherwise 2, and 2 against a Titan holding a Grabbed soldier; 1 more for a Feint; plus 1 for each decoy the Titan has fallen for since its last card that resolved a behavior; extra successes create Openings (data/engagement/attention.yaml, break_attention, needs_rule) | shift a Focus Titan's Attention onto a decoy and raise its decoys in a row, create Openings, free a Grabbed soldier | not taken outside a Titan Engagement | Against a Titan holding a Grabbed soldier, a success frees them (data/engagement/grab.yaml) | Chapter 5 |
| Draw Attention | data/engagement/attention.yaml (draw_attention) | none | become the loudest or brightest stimulus on the Attention Ladder | none | Not from Distant (decision batch 5, OQ-113). Sets the loudest flag, which lasts until the end of the Titan's next card that resolves a behavior; a card that resolves nothing, under a decoy's hold, while the Titan holds a Grabbed soldier, or with no one holding its Attention, leaves it standing (ADR-0024, limit 2, as first amended in decision batch 3e; data/engagement/attention.yaml, flag_duration). While a soldier holds the flag they match every ladder rung any other candidate meets except hooked into its body, so the shout takes the Titan off any comrade who is not hooked in or On Body (decision batch 10, OQ-184; data/engagement/attention.yaml, flags, loudest, matches). It spends the soldier's action; Shout Them Off lets the soldier spend their move instead (data/character/talents.yaml, shout-them-off). | Chapter 5 |
| Read | data/engagement/read.yaml (read) | 1; each success reveals one fact or pays toward Call It (data/engagement/read.yaml, facts, call_it) | learn a fact about a Titan such as its Next Behavior | not taken outside a Titan Engagement | none | Chapter 5 |
| Call It | Option of read. Spends successes from a Read (data/engagement/read.yaml, call_it) | none | add dice to a comrade's Reaction | none | none | Chapter 5 |
| Break Free | In a Titan Engagement, the soldier is Grabbed and not Down, or holds Pry Loose (data/engagement/grab.yaml, escapes). In a Skirmish, the soldier is Held and not Down (Chapter 7, section 7.4). It is taken nowhere else. | 2, with a 2-die penalty once lifted (data/engagement/grab.yaml, escapes); 2 while Held in a Skirmish (Chapter 7, section 7.4) | free a Grabbed soldier, end a hold: break free while Held, or let go of a Foe the soldier holds | In a Skirmish, up to three comrades taking part who are not Down may Help, each spending their action, whether Engaged or Apart (Chapter 7, section 7.4). Not taken outside a Titan Engagement or a Skirmish. | none | Chapter 5, Chapter 7 |
| Swap Initiative Card | Option of the swap step of a round in a Titan Engagement (data/engagement/round.yaml, round_steps, swap). data/engagement/round.yaml (swapping) | none | exchange initiative cards with a comrade | none | Not an action, and spends neither the move nor the action (data/engagement/round.yaml, swapping). | Chapter 5 |
| Squad Tactic | Option of a Squad Tactic the Squad holds (data/engagement/squad-tactics.yaml, rules, held). data/engagement/squad-tactics.yaml (rules, tactics) | none | use a Squad Tactic | none | none | Chapter 5 |
| Lift Comrade | data/gear/carrying.yaml (lifting_a_comrade), in and out of a Titan Engagement. In one, a comrade who is Down, or who is not Down, consents, and whom the both-legs grade forbids to move, holds the soldier's Position and is not Grabbed, Pinned, or already carried; and the soldier is not Down, carries no other comrade, and is not carried (decision batch 8, 8-11 and 8-18). | none | pick up and carry a Down comrade, or one the both-legs grade forbids to move | none | none | Chapter 4, Chapter 5 |
| Heave | data/engagement/titan-harm.yaml (falling_titan, heave): the soldier holds In Reach or On Body relative to a body that pins at least one soldier, and is not Down, Grabbed, carried, or body-pinned. A limb-pinned soldier may Heave the body that pins them. | 1; each success adds 1 to the body's heave count, and at its Heave rating every soldier the body pins is freed (data/engagement/titan-harm.yaml, falling_titan, heave) | add successes toward the Heave rating of a body that pins a soldier, get out from under a falling Titan's body, or free a soldier it pins | not taken outside a Titan Engagement | Against a corpse the heaver takes 1 Burn damage after the roll, whatever its result (data/engagement/titan-harm.yaml, falling_titan, corpse_heat). | Chapter 5 |
| Change Canister | The soldier carries a spare gas canister. data/gear/odm-gear.yaml (change_canister) states what changing it spends. | none | restore a Gas Rating | none | none | Chapter 4 |
| Pass Item | In a Titan Engagement, the passer is not Down, and the receiver is a living comrade who holds the passer's Position; the receiver may be Down or Grabbed. Outside a Titan Engagement, data/gear/carrying.yaml (passing_items) sets the requirement. | none | give a carried item to a comrade | none | data/gear/carrying.yaml (passing_items) lists which items can be passed and what passing spends. | Chapter 4 |
| Take Item | In a Titan Engagement, the taker is not Down, and either a Down comrade who is not Grabbed holds the taker's Position, or a dead comrade's left items lie at that Position, relative to the Focus Titan recorded with them (data/gear/carrying.yaml, leaving_play, death, where_left). Outside a Titan Engagement, data/gear/carrying.yaml (taking_items) sets the requirement. | none | take an item from a Down comrade or from where a dead comrade's items lie | none | data/gear/carrying.yaml (taking_items) lists which items can be taken and what taking spends. | Chapter 4 |
| Mount or Dismount | Option of a move in a Titan Engagement; outside one, the procedure under way, or no procedure when none is under way (data/gear/horses.yaml, mounted, outside_titan_engagement). data/gear/horses.yaml (mounted). | none | mount or dismount a horse | none | Part of a move in a Titan Engagement, never an action (OQ-35). | Chapter 4, Chapter 5 |
| Swap Blade Set | Option of the soldier's own turn in a Titan Engagement; outside one, no turn (data/gear/blade-sets.yaml, swap). data/gear/blade-sets.yaml (swap). | none | fit a carried Blade Set into empty handles | none | In a Titan Engagement it spends the soldier's move and never the action (decision batch 10, OQ-185; data/gear/blade-sets.yaml, swap). Outside one it spends nothing. | Chapter 4 |
| Shed Load | Option of the soldier's own turn in a Titan Engagement; outside one, no turn (data/gear/carrying.yaml, shedding). data/gear/carrying.yaml (shedding). | none | drop a carried item, set down a carried comrade, or stop being carried | none | Spends neither the move nor the action. | Chapter 4 |
| Restock Medical Kit | Option of a care window (data/harm/treat-injury.yaml, care_windows). data/gear/squad-supply.yaml (medical_uses, restock-kit). | none | restore a gear item's Gear Dice rating or end a Jam | none | Spends 1 medical unit of Squad Supply, and no roll. | Chapter 4, Chapter 3 |
| Help | Chapter 1, section 1.8. | none | add a die to a comrade's roll | none | Outside a Titan Engagement, Help is allowed only where the rule that calls for the roll allows it (OQ-08), and on a called roll outside a Skirmish as the GM rules, in a Skirmish as the Skirmish's Help (Chapter 1, section 1.8; Chapter 7, section 7.4; decision batch 9, 9-12 and 9-42). | Chapter 1 |
| Cover | Option of a comrade's Push. Chapter 1, section 1.5 (Covering). | none | raise a soldier's Stress | none | none | Chapter 1 |
| Dodge | Chapter 1, section 1.9. In a Titan Engagement, against a Titan's behavior. In a Skirmish, against a Foe's Fight attack or shot, and never while Held (Chapter 7, section 7.4). | none of its own: each success cancels one of the attack's successes, and the attack lands on 1 or more Net Successes (Chapter 1, section 1.9, Attack and Reaction). Against a Titan the attack is the behavior's Attack Dice roll (ADR-0019); in a Skirmish, a Foe's Fight attack or shot (ADR-0018, as amended) | avoid a behavior or attack aimed at oneself | In a Skirmish, up to three comrades taking part who are not Down may Help, each spending their action, whether Engaged or Apart (Chapter 7, section 7.4). Not made outside a Titan Engagement or a Skirmish. | none | Chapter 1, Chapter 5, Chapter 7 |
| Block | Only against an attacker whose rules allow blocking: in a Skirmish, a Foe's Fight attack (Chapter 7, section 7.4; ADR-0018). No Titan can be blocked (ADR-0019), so a Block is never made in a Titan Engagement. | none of its own: each success cancels one of the Fight attack's successes, and the attack lands on 1 or more Net Successes (Chapter 1, section 1.9, Attack and Reaction; ADR-0018, as amended) | avoid a behavior or attack aimed at oneself | In a Skirmish, up to three comrades taking part who are not Down may Help, each spending their action, whether Engaged or Apart (Chapter 7, section 7.4). Not made outside a Skirmish. | none | Chapter 1, Chapter 7 |
| Fight | In a Skirmish, against one Foe the soldier is Engaged with (Chapter 7, section 7.4). It uses the Blade Set in the handles, or is made bare-handed or with an object that is not a gear item, which supplies no Gear Dice. A Grapple is a Fight made with no Gear Dice. A Held soldier Fights only their holder, bare-handed, and so does a soldier who holds a Foe, against that Foe. Never taken against a Titan. | 1 Net Success after the Foe's Guard cancels (Chapter 1, section 1.9, Attack and Reaction; Chapter 7, section 7.4) | deal damage to a Foe, hold a Foe with a Grapple | In a Skirmish, up to three comrades taking part who are not Down may Help, each spending their action, whether Engaged or Apart (Chapter 7, section 7.4). Not taken outside a Skirmish. | A Fight that lands deals its weapon's damage, plus 1 for each Net Success beyond the first, with the weapon's Injury Type (data/skirmish/skirmish.yaml, weapons, damage). A Grapple that lands deals no damage and makes the Foe Held (decision batch 8, 8-12; Chapter 7, section 7.4). | Chapter 7 |
| Shoot | In a Skirmish, against one Foe, Engaged or Apart, with a loaded firearm the soldier holds, or with a flare fired at a person, which needs 1 flare in Squad Supply and no firearm (data/skirmish/skirmish.yaml, weapons, fired-flare); a musket is never fired at a Foe the soldier is Engaged with (Chapter 7, section 7.4). A Held soldier, and a soldier who holds a Foe, cannot Shoot. Firearms have no use in a Titan Engagement (data/gear/items.yaml), so Shoot is never taken there. | 1 Net Success after the Foe's Guard cancels (Chapter 1, section 1.9, Attack and Reaction; Chapter 7, section 7.4) | deal damage to a Foe | In a Skirmish, up to three comrades taking part who are not Down may Help, each spending their action, whether Engaged or Apart (Chapter 7, section 7.4). Not taken outside a Skirmish. | A firearm supplies its Gear Dice, a Pushed roll whose Gear Dice show any 1 wears it by 1 point, and at current rating 0 it cannot be fired until Field Repair or Maintain Gear restores it (decision batch 8, 8-12). The roll empties the firearm (data/gear/items.yaml, flintlock-pistol, loaded). A fired flare spends 1 flare and no shot, and takes no Gear Dice (decision batch 8, 8-7). | Chapter 7, Chapter 4 |
| Reload | Option of the soldier's turn in a Skirmish (Chapter 7, section 7.4); outside a Skirmish, no turn. The soldier has an empty flintlock pistol or musket, and Squad Supply holds at least 1 shot (data/gear/squad-supply.yaml). In a Skirmish, the limits on a soldier who holds a Foe apply (Chapter 7, section 7.4). | none | load an empty firearm | none | Loads one firearm and spends 1 shot. In a Skirmish it also spends the soldier's action, and, for a musket, their move. Outside a Skirmish and a Titan Engagement it spends nothing else, can be made at any time, and the firearm stays loaded until it is fired (decision batch 8, 8-12). It is never made in a Titan Engagement. | Chapter 7, Chapter 4 |
| Release | Option of the holder's turn in a Skirmish (Chapter 7, section 7.4). The soldier holds a Foe with a Grapple, in a Skirmish (Chapter 7, section 7.4). | none | end a hold: break free while Held, or let go of a Foe the soldier holds | none | Lets go of the held Foe, with no roll, spending neither the move nor the action. A Foe never releases (decision batch 8, 8-12). | Chapter 7 |
| Treat Injury | Set by Chapter 3, including which comrades can be treated from which Position. | set by Chapter 3 | restore Health, treat or stabilize a Critical Injury, end the Down state | In a Skirmish, up to three comrades taking part who are not Down may Help, each spending their action, whether Engaged or Apart (Chapter 7, section 7.4). Otherwise stated by the Chapter 3 procedure that calls for the roll. | none | Chapter 3 |
| Rally | Set by Chapter 3, including which comrades can be Rallied from which Position. | set by Chapter 3 | end a Stress Response, or a pending Fear Roll result (a forced step or a forced strike not yet made) | In a Skirmish, up to three comrades taking part who are not Down may Help, each spending their action, whether Engaged or Apart (Chapter 7, section 7.4). Otherwise stated by the Chapter 3 procedure that calls for the roll. | Rally clears a Stress Response but does not lower Stress. | Chapter 3 |
| Field Repair | data/gear/field-repair.yaml (target, in_titan_engagement, outside_titan_engagement). | 1 | restore a gear item's Gear Dice rating or end a Jam | data/gear/field-repair.yaml (outside_titan_engagement) | none | Chapter 4 |
| Fly | Made for every ODM move in a Titan Engagement, which is a Flight (data/engagement/positions.yaml, moves, flight): the move's step happens whatever the roll gives, each success is 1 Momentum, and no successes sets the loudest flag. Also called by another Chapter 4 or Chapter 5 rule, such as Mid-Air Catch. Also made as a called roll outside a Titan Engagement, a Skirmish included, when the GM calls one for an act this entry fits, such as reaching a rooftop (Chapter 1, section 1.1; Chapter 2, section 2.9). In a Skirmish it is the one Fly roll there is: it takes this entry's Gear Dice, makes no soldier airborne, since a ruling is not a rule that says so (data/gear/odm-gear.yaml, airborne), makes no Gas Roll, and gives no Engaged or Apart (data/skirmish/skirmish.yaml, actions, called_roll; decision batch 9, 9-43). | a Flight needs nothing: its step happens whatever the roll gives, and each success is 1 Momentum (decision batch 10, OQ-182). A roll another rule calls for needs what that rule states. Outside a Titan Engagement, 1 | gain Momentum | Stated by the rule that calls for the roll. On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | none | Chapter 4, Chapter 5 |
| Leap Clear | Called by the falling Titan for each soldier in its path who is not airborne, not Down, and not carried (data/engagement/titan-harm.yaml, falling_titan, leap_clear). Not an action and not a Reaction: it spends nothing. | 1; a success clears the soldier to In Reach, and a failure pins them (data/engagement/titan-harm.yaml, falling_titan) | get out from under a falling Titan's body, or free a soldier it pins | not made outside a Titan Engagement | none | Chapter 5 |
| Ride | Called by the Leg roll on a Hard Ride, whatever the Formation Post (Chapter 7, section 7.1). The horse counts as not had while the soldier is not mounted on it (data/gear/items.yaml). The Chase rules (not yet written) may also call for it. Also made as a called roll when the GM calls one for an act this entry fits (Chapter 1, section 1.1; Chapter 2, section 2.9). | 1 on a Leg roll (Chapter 7, section 7.1); 1 on a called roll | settle what a Leg costs in rations and how its hazard roll is adjusted | On a Leg roll, up to three comrades on the Expedition who are not Down may Help, spending nothing, each at most once per Leg (Chapter 7, section 7.1). A roll another rule calls for states its own. On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | none | Chapter 7 |
| Death Roll | Called by Chapter 3. Exceptions to the pool are in data/core/dice-pool.yaml. | 1 (Chapter 3, section 3.4) | none | never Helped (data/core/dice-pool.yaml) | none | Chapter 3 |
| Fear Roll | Called by the Fear Roll triggers in Chapter 3: a closed list with one row the GM reads, gm-horror, outside a Titan Engagement (ADR-0024, limit 1; decision batch 9, 9-6). | none | none | none | none | Chapter 3 |
| Stress Response roll | Called when a Stress Die shows 1 (Chapter 1, section 1.5). Chapter 3 holds the table. | none | none | none | none | Chapter 3 |
| Gas Roll | Called each round a soldier uses ODM Gear (data/gear/odm-gear.yaml, gas_roll). | none | none | none | none | Chapter 4 |
| Spot | Called by the Leg roll at the Vanguard, Signal Relay, and Rear Guard Formation Posts on a Steady Leg (Chapter 7, section 7.1). Also made as a called roll when the GM calls one for an act this entry fits (Chapter 1, section 1.1; Chapter 2, section 2.9). | 1 on a Leg roll (Chapter 7, section 7.1); 1 on a called roll | settle what a Leg costs in rations and how its hazard roll is adjusted | On a Leg roll, up to three comrades on the Expedition who are not Down may Help, spending nothing, each at most once per Leg (Chapter 7, section 7.1). A roll another rule calls for states its own. On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | A passive roll is a Spot or a Size Up the GM makes out of sight, for something the soldier does not know is there, outside a Titan Engagement and a Skirmish (Chapter 1, section 1.1, item 5). | Chapter 7 |
| Size Up | Called once per Downtime, before any Requisition roll, to lower the ledger (Chapter 7, section 7.3); and in a Skirmish, once per Foe group, to learn about that group (Chapter 7, section 7.4). Also made as a called roll when the GM calls one for an act this entry fits (Chapter 1, section 1.1; Chapter 2, section 2.9). | 1 (Chapter 7, sections 7.3 and 7.4); 1 on a called roll | lower the ledger for the Squad this Downtime, learn a Foe group's Grit, how many more of it must fall before it breaks, and what each of its Foes does on its next card | On Requisition and in a Skirmish, never Helped and never retried: neither rule allows Help on it (Chapter 7, sections 7.3 and 7.4). A roll another rule calls for states its own. On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | Judging a person's intent. Observing a Titan is Read, not Size Up. In a Skirmish it is made on the soldier's action (Chapter 7, section 7.4). A passive roll is a Spot or a Size Up the GM makes out of sight, for something the soldier does not know is there, outside a Titan Engagement and a Skirmish (Chapter 1, section 1.1, item 5). | Chapter 7 |
| Survive | Called by the Leg roll at the Flank Scout and Supply Wagon Formation Posts on a Steady Leg, and by the camp roll at a Night Camp (Chapter 7, section 7.1). Also made as a called roll when the GM calls one for an act this entry fits (Chapter 1, section 1.1; Chapter 2, section 2.9). | 1 (Chapter 7, section 7.1); 1 on a called roll | settle what a Leg costs in rations and how its hazard roll is adjusted, settle whether a Night Camp gives Camp Relief and how its night hazard roll is adjusted | On a Leg roll, up to three comrades on the Expedition who are not Down may Help, spending nothing, each at most once per Leg; on the camp roll, up to three comrades on the Expedition who are not Down may Help, spending nothing (Chapter 7, section 7.1). A roll another rule calls for states its own. On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | none | Chapter 7 |
| Persuade | Called by a Requisition roll, which the roller makes with Persuade or Recall, chosen before rolling (Chapter 7, section 7.3); by a Parley, once per Skirmish, on the soldier's action; and by a Parley outside a Skirmish, made before a Foe group with no Skirmish under way and never again by the same soldier with that group (Chapter 7, section 7.4). Also made as a called roll when the GM calls one for an act this entry fits (Chapter 1, section 1.1; Chapter 2, section 2.9). | set by Chapter 7 (sections 7.3 and 7.4); 1 on a called roll | have Command grant a Requisition, make a Foe group yield | On a Requisition roll, up to three comrades in the Squad who are not Down may Help; a player character who Helps spends their own Requisition this Downtime, and a Squadmate may Help once per Downtime (Chapter 7, section 7.3). On a Parley in a Skirmish, up to three comrades taking part who are not Down may Help, each spending their action, whether Engaged or Apart; a Parley outside a Skirmish is never Helped (Chapter 7, section 7.4). On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | A Parley made as a threat rolls Strength in place of Empathy. It is still made for persuade, so a Talent that names persuade still adds its dice (Chapter 7, section 7.4). A called Persuade the GM rules is a threat rolls Strength the same way (decision batch 9, 9-13). | Chapter 7 |
| Endure | Called by the Leg roll at the Center Formation Post on a Steady Leg, and by the Straggler row of the Leg Hazard table for its victim (Chapter 7, section 7.1). Also made as a called roll when the GM calls one for an act this entry fits (Chapter 1, section 1.1; Chapter 2, section 2.9). | 1 (Chapter 7, section 7.1); 1 on a called roll | settle what a Leg costs in rations and how its hazard roll is adjusted, escape the harm a hazard row names for the soldier who rolls against it | On a Leg roll, up to three comrades on the Expedition who are not Down may Help, spending nothing, each at most once per Leg; the Straggler row's roll is never Helped (Chapter 7, section 7.1). A roll another rule calls for states its own. On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | none | Chapter 7 |
| Sneak | Called before a Skirmish's first round when the Squad approaches a Foe group unseen: one soldier rolls it for the ambush (Chapter 7, section 7.4). Also made as a called roll when the GM calls one for an act this entry fits (Chapter 1, section 1.1; Chapter 2, section 2.9). | the Foe group's Watch (Chapter 7, section 7.4); 1 on a called roll | give the Squad the ambush against a Foe group | For the ambush, never Helped and never retried (Chapter 7, section 7.4). A roll another rule calls for states its own. On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | none | Chapter 7 |
| Recall | Called by a Requisition roll, which the roller makes with Persuade or Recall, chosen before rolling (Chapter 7, section 7.3). Also made as a called roll when the GM calls one for an act this entry fits (Chapter 1, section 1.1; Chapter 2, section 2.9). | set by Chapter 7 (section 7.3); 1 on a called roll | have Command grant a Requisition | On a Requisition roll, up to three comrades in the Squad who are not Down may Help; a player character who Helps spends their own Requisition this Downtime, and a Squadmate may Help once per Downtime (Chapter 7, section 7.3). A roll another rule calls for states its own. On a called roll outside a Skirmish, up to three comrades who are present and able to help concretely may Help, as the GM rules; in a Skirmish, Help on a called roll is the Skirmish's Help, each helper spending their action, at no cost the GM names (data/skirmish/skirmish.yaml, rolls, called-roll; decision batch 9, 9-36 and 9-42); Help spends nothing unless the GM names a cost of time or position for it, which falls when Help is declared (Chapter 1, section 1.8; decision batch 9, 9-28); a comrade who could Help may Cover (Chapter 1, section 1.8; decision batch 9, 9-12). | none | Chapter 7 |
| Downtime Action | Option of the downtime-actions step of Downtime (data/campaign/downtime.yaml, steps). A player character, once per Downtime (data/campaign/downtime.yaml, downtime_actions, who). The player names one row of downtime_actions: Recover, Visit Haven, Requisition, or Maintain Gear. | none | lower a soldier's Stress in Downtime, lower a soldier's Grief in Downtime, restore a gear item's Gear Dice rating or end a Jam, restore a Gas Rating, have Command grant a Requisition | none | The rows are kept in data/campaign/downtime.yaml, as Break Attention's decoys are kept in data/engagement/attention.yaml. Requisition spends the Downtime Action on a persuade or recall roll, or on Help to one. The Squadmate relief is a result of the procedure, not this option. | Chapter 7 |
| Squad Action | Option of the squad-action step of Downtime (data/campaign/downtime.yaml, steps). The Squad, once per Downtime (data/campaign/downtime.yaml, squad_actions, who). The players name one row of squad_actions: Honoring the Fallen or Recruit. | none | lower a soldier's Grief in Downtime, bring a new Squadmate into the Squad Pool | none | The rows are kept in data/campaign/downtime.yaml. | Chapter 7 |
| Performance roll | Called once per Training Year. Exceptions to the pool are in data/core/dice-pool.yaml. | none | none | never Helped | none | Chapter 2 |
<!-- END RENDERED: action-catalog-requirements -->

### 2A.5 Tracked values

<!-- BEGIN RENDERED: tracked-values from data/character/action-catalog.yaml -->
| Id | Tracked value | Entries that change it | Otherwise changed by | Rules in |
|---|---|---|---|---|
| `stress-raise` | raise a soldier's Stress | Cover | none | Chapter 1 |
| `stress-response-clear` | end a Stress Response, or a pending Fear Roll result (a forced step or a forced strike not yet made) | Rally | none | Chapter 3 |
| `health-restore` | restore Health | Treat Injury | none | Chapter 3 |
| `critical-injury-treat` | treat or stabilize a Critical Injury | Treat Injury | none | Chapter 3 |
| `down-end` | end the Down state | Treat Injury | none | Chapter 3 |
| `grabbed-end` | free a Grabbed soldier | Body Part strike, Break Attention, Break Free | none | Chapter 5 |
| `momentum-gain` | gain Momentum | Fly | none | Chapter 5 |
| `anchor-wreck` | destroy an Anchor | none | none | Chapter 5 |
| `gear-restore` | restore a gear item's Gear Dice rating or end a Jam | Restock Medical Kit, Field Repair, Downtime Action | none | Chapter 4 |
| `gas-restore` | restore a Gas Rating | Change Canister, Downtime Action | none | Chapter 4 |
| `comrade-carry` | pick up and carry a Down comrade, or one the both-legs grade forbids to move | Lift Comrade | none | Chapter 4, Chapter 5 |
| `item-give` | give a carried item to a comrade | Pass Item | none | Chapter 4 |
| `item-take` | take an item from a Down comrade or from where a dead comrade's items lie | Take Item | none | Chapter 4 |
| `mount-change` | mount or dismount a horse | Mount or Dismount | none | Chapter 4, Chapter 5 |
| `blade-set-swap` | fit a carried Blade Set into empty handles | Swap Blade Set | none | Chapter 4 |
| `load-shed` | drop a carried item, set down a carried comrade, or stop being carried | Shed Load | none | Chapter 4 |
| `attention-shift` | shift a Focus Titan's Attention onto a decoy and raise its decoys in a row | Break Attention | none | Chapter 5 |
| `draw-attention-set` | become the loudest or brightest stimulus on the Attention Ladder | Draw Attention | none | Chapter 5 |
| `toughness-add` | add successes toward a Body Part's Toughness | Body Part strike | none | Chapter 5 |
| `body-part-worsen` | move a Body Part toward Broken | Body Part strike | none | Chapter 5 |
| `openings-create` | create Openings | Nape strike, Body Part strike, Break Attention | none | Chapter 5 |
| `titan-kill` | kill a Titan | Nape strike | none | Chapter 5 |
| `titan-facts-reveal` | learn a fact about a Titan such as its Next Behavior | Read | none | Chapter 5 |
| `reaction-dice-add` | add dice to a comrade's Reaction | Call It | none | Chapter 5 |
| `initiative-swap` | exchange initiative cards with a comrade | Swap Initiative Card | none | Chapter 5 |
| `squad-tactic-use` | use a Squad Tactic | Squad Tactic | none | Chapter 5 |
| `roll-dice-add` | add a die to a comrade's roll | Help | none | Chapter 1 |
| `behavior-avoid` | avoid a behavior or attack aimed at oneself | Dodge, Block | none | Chapter 1, Chapter 5, Chapter 7 |
| `position-change` | change Position, or become Engaged with or Apart from a Foe in a Skirmish | none | a move, not a Catalog entry | Chapter 5, Chapter 7 |
| `pinned` | get out from under a falling Titan's body, or free a soldier it pins | Body Part strike, Heave, Leap Clear | none | Chapter 5 |
| `heave-count` | add successes toward the Heave rating of a body that pins a soldier | Heave | none | Chapter 5 |
| `leg-outcome` | settle what a Leg costs in rations and how its hazard roll is adjusted | Ride, Spot, Survive, Endure | none | Chapter 7 |
| `camp-outcome` | settle whether a Night Camp gives Camp Relief and how its night hazard roll is adjusted | Survive | none | Chapter 7 |
| `hazard-outcome` | escape the harm a hazard row names for the soldier who rolls against it | Endure | none | Chapter 7 |
| `requisition-grant` | have Command grant a Requisition | Persuade, Recall, Downtime Action | none | Chapter 7 |
| `ledger-lower` | lower the ledger for the Squad this Downtime | Size Up | none | Chapter 7 |
| `foe-harm` | deal damage to a Foe | Fight, Shoot | none | Chapter 7 |
| `held-set` | hold a Foe with a Grapple | Fight | none | Chapter 7 |
| `held-end` | end a hold: break free while Held, or let go of a Foe the soldier holds | Break Free, Release | none | Chapter 7 |
| `firearm-load` | load an empty firearm | Reload | none | Chapter 7, Chapter 4 |
| `foe-yield` | make a Foe group yield | Persuade | none | Chapter 7 |
| `foe-intent-reveal` | learn a Foe group's Grit, how many more of it must fall before it breaks, and what each of its Foes does on its next card | Size Up | none | Chapter 7 |
| `ambush-set` | give the Squad the ambush against a Foe group | Sneak | none | Chapter 7 |
| `stress-lower` | lower a soldier's Stress in Downtime | Downtime Action | none | Chapter 7 |
| `grief-lower` | lower a soldier's Grief in Downtime | Downtime Action, Squad Action | none | Chapter 7 |
| `squad-recruit` | bring a new Squadmate into the Squad Pool | Squad Action | none | Chapter 7 |
| `rule-named-value` | change a clock, counter, or obstacle that a rule creates and for which that rule names an attribute roll | none | the attribute roll its creating rule names, made with the attribute alone, when no Catalog entry changes it | the rule that creates the value |
<!-- END RENDERED: tracked-values -->
