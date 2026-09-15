# Coriolis: The Great Dark (Free League, 2025) - Mechanical Extraction

Source: `docs/reference/Coriolis_FL_The_Great_Dark_Core_Rules_OEF,_2025_FLFCOR006_2asdasd.pdf` (316 PDF pages).

**Page convention:** all citations are the **printed book page** (p. N). PDF page = printed page + 4 (e.g. p. 207 "Delve Basics" = PDF 211).

Scope: rules only. Setting, fiction and adventure prose skipped except where the adventure (The Black Ziggurat, ch. 15) or solo appendix demonstrates a mechanic.

## Chapter map (rules-relevant)

| Ch | Title | Pages | Rules content |
|---|---|---|---|
| 1 | Introduction | 5-17 | Dice types, cards/tokens, game summary, crew roles overview |
| 2 | Your Explorer | 19-46 | Chargen, crew creation, Bird, vehicles, XP/CP, 8 professions |
| 3 | Core Mechanics | 47-55 | Dice, pushing, gear, help, difficulty, opposed rolls, talents, crew maneuvers |
| 4 | Combat & Hazards | 57-79 | Initiative, actions, zones, close/ranged, social, damage, Hope/despair, Heart/Blight, environmental dangers, vehicle combat, chases |
| 5 | The Bird & Its Powers | 81-87 | Garuda companion rules |
| 6 | Equipment & Vehicles | 89-115 | Encumbrance, supply, weapons, delving suits, gear tables, rovers, kites, heirlooms |
| 8 | Guilds & Factions | 131-147 | Faction standing (p. 132-133), Explorers Guild pay (p. 145-146) |
| 11 | Space Travel & Expeditions | 189-205 | Greatships, Slipstream voyages, shuttles, land exploration/trekking |
| 12 | Delving into the Abyss | 207-219 | Delve procedure, crew roles, supply, camps |
| 13 | Creatures & Adversaries | 221-241 | Creature combat rules, 14 creatures, phenomena, adversary table |
| 14 | Running the Game | 243-265 | GM principles, adventure anatomy, NPCs, delve generator, artifacts |
| 15 | The Black Ziggurat | 267-281 | Intro adventure (unique hazard table, environmental escalation lever) |
| App. | The Outcast Explorer | 285-302 | Solo rules (location checks, scan bonus pools, divination, discovery tables) |

---

## 1. Core dice (p. 47-49, p. 8)

### Dice pool construction
- Describe intent, then roll **base dice = attribute score + level of ONE applicable talent** (p. 47). There are **no skills**. Talents (levels 1-3) are the only trained-ability layer, and add base dice.
- **Gear dice** (black) = gear bonus of **one** item (p. 48 "You can only use one piece of equipment for a single roll"). Items without a listed bonus are merely enabling.
- Custom dice (p. 8): base dice (tan/golden) and gear dice (black). Both show a success symbol on 6. Base dice show a "Hope loss" symbol on 1, gear dice a "gear damage" symbol on 1. Any d6 in two colours works.

### Success and extra successes
- **Success = at least one 6** (p. 47). More than one 6 = exceptional outcome.
- In attacks, **each 6 beyond the first adds +1 damage** (p. 61-62). Many effects scale per extra 6 (Bird powers, first aid heals = number of 6s, delve progress = markers per 6, chase range shift per net 6).
- Success-chance table (p. 48): 1 die 17% (29% pushed), 2 = 31/50, 3 = 42/64, 4 = 52/74, 5 = 60/81, 6 = 67/87, 7 = 72/90, 8 = 77/93, 9 = 81/95, 10 = 84/96.

### Modifiers / difficulty (p. 49)
- GM rarely sets difficulty. When used, it **adds/removes base dice only**, never gear dice. Minimum 1 base die.
- Effortless +3, Routine +2, Easy +1, Normal 0, Demanding -1, Hard -2, Insane -3.
- Conditions give -2 dice on one attribute (p. 67). Situational modifiers are expressed as +/-N dice throughout.

### Gear bonus (p. 48, p. 95)
- One item per roll. Gear bonus reduced by 1 for every 1 rolled on gear dice when pushing; at 0 the item is **broken** (p. 48).
- **Repair** (p. 48-49): one shift + LOGIC roll (+talent). Success restores full bonus. Failure permanently fixes the bonus at its current (reduced) level; if it was 0, destroyed beyond repair.
- Vehicle **Maneuverability** is a gear bonus and degrades the same way; at 0 the vehicle is wrecked (p. 74-75).

### Help (p. 49)
- Declared before rolling; helper must be present and capable (GM call).
- **+1 base die per helper, max 3 helpers (+3)**. In combat, helping costs the helper's action. NPCs help each other likewise.
- Distinct from "giving Hope" (see pushing).

### Opposed rolls (p. 49)
- Roll more 6s than the opponent to succeed. Both may push: **active party decides first**, then passive.
- **Open opposed rolls** (no clear active side): tie = no winner, or random tiebreak if that makes no sense.
- Block/dodge convert attacks into opposed rolls where each defender 6 cancels one attacker 6 (p. 61, 63).

### Time units (p. 49)
| Unit | Duration | Used for |
|---|---|---|
| Round | ~10 s | one combat action |
| Stretch | 15 min | search a location, move one zone/marker in a delve |
| Shift | 6 h | overland travel, repairs, recovery of Health/Hope/Heart |

### NPC dice (p. 48, p. 255)
- NPCs use attributes/talents like PCs. GM only rolls when an NPC action directly affects a PC. NPCs **cannot push or use Hope unless important** (nemeses). GM does not track NPC gear/resources.

### Divergences from classic YZE
| Topic | Great Dark | Classic YZE (Alien / Forbidden Lands / MYZ) |
|---|---|---|
| Pool | Attribute + one talent level + one gear item | Attribute + skill (+ gear); talents are separate perks |
| Skills | None; talents are narrow +1..+3 dice bonuses (p. 50) | 12-16 skills |
| Push cost | 1s on base dice = lose Hope (a separate mental track) | FBL/MYZ: 1s damage attributes; Alien: stress dice & panic |
| Push reward | None (no Willpower/Mutation/Darkness points) | FBL Willpower, MYZ Mutation Points |
| GM currency | **None.** Coriolis: The Third Horizon's Darkness Points/prayer economy is gone (no occurrence in book) | Third Horizon had Darkness Points |
| Difficulty | Only modifies base dice; gear never modified | Similar (Alien modifies whole pool) |
| Help | +1 per helper, max 3 | Same as FBL/MYZ |
| Damage tracks | Three: Health / Hope / Heart (Blight) | One HP track + stress (Alien) or attribute damage (FBL/MYZ) |
| Initiative | Cards 1-10, redrawn every round by default (p. 57-58) | Cards drawn once per combat |
| Monsters | Ferocity = number of initiative cards; roll fixed pool | Alien: speed = multiple initiative; similar |

---

## 2. Pushing and the Hope economy (p. 48, p. 68-69)

### Push procedure (p. 48)
- Re-roll every die not showing a 6 (success) or a 1 (on base or gear dice).
- Usually after failing, but may push after success to gain more 6s (more damage).
- **Only once**, unless a talent grants a second push: *Renowned* (EMPATHY rolls), *Reckless* (AGILITY), *Smart* (LOGIC) (p. 50, 53).
- Consequences counted **after** the push, on **all** dice (including dice not rerolled):
  - each **1 on base dice = lose 1 Hope**
  - each **1 on gear dice = gear bonus -1**; 0 = broken
- **No pushing passive rolls**: armor rolls, Blight protection rolls, horror exposure effects during delves (p. 48). Only active actions.
- Mental trauma *Apathetic*: cannot push at all (p. 69).
- Bird command rolls: Energy spent adds base dice, so pushing risks Hope **and** a Losing Control table (p. 83-84, see §8).

### Giving Hope (p. 48)
- When an Explorer is about to push, another Explorer can volunteer to **take all the Hope loss instead**, at **+1 extra Hope** (so minimum 1 even if no 1s). Not an action in combat; requires ability to communicate.

### Hope as a track (p. 21, p. 68-69)
- Max Hope = LOGIC + EMPATHY (+1/level of *Hopeful* talent).
- **Despair** reduces Hope. Sources: pushed rolls, horrifying creatures, GM-designated stressful situations, delve hazards, supply incidents / out of supply, trauma effects, sleep deprivation (1 Hope per shift after a day awake).
- **Resisting external despair** (p. 68): GM sets potential despair; Explorer rolls EMPATHY (not an action); each 6 cancels 1. Can push, but 1s on the push add more despair. Official adventures specify stressful situations and amounts (e.g. seeing a corpse = 2 despair, Black Ziggurat p. 270).
- **Fight, Flight, or Freeze** (p. 68): in combat, if you take >=1 despair from an external source (after EMPATHY), on your next turn you must either run at full speed away, attack the source in close combat, or lose your next turn.
- **Broken by despair** (Hope 0): one move per round, no actions; immediately roll D66 **Mental Trauma** table. Further despair has no effect.
- **Recovery**:
  - A Friendly Voice: another character's EMPATHY action; recover Hope = number of 6s, no longer broken (only works on broken).
  - Drugs (grule, smelling spice; side effects).
  - On your own: 1 Hope after one shift.
  - Resting (not broken): **D6 Hope per shift** (Health and Heart only 1/shift).
  - Keepsake: once per session, recover 1 Hope via a short scene (p. 22).
  - Consumables and services (p. 107-108): grass wine / kohol / makh / tabak heal 1 Hope unless broken (extra doses give conditions); poetry recital D6 Hope; alley theatre +1; deck of cards +1 per rest shift; short story collection +1 (p. 109).
  - Crew maneuver *Rally*: all Explorers within Medium range restore 1 Hope (even if broken) or clear a condition (p. 55).
  - Bird power *Soul Delve* (Specter): regain all Hope, even if broken (p. 87).
  - Shuttle/rover upgrades *Shrine* or *Entertainment Module*: +1 Hope per rest shift (p. 202-203, 112).
- **Healing trauma** (p. 68): EMPATHY roll each week (condition-only traumas heal in a shift).

### Mental Trauma table (D66, p. 69) - structure
11-26 conditions (Dazed/Shaken/Disheartened) or new quirk; 31-46 ongoing penalties (Worrisome: minor concerns cause 1 despair; Nightmares: INSIGHT per sleep shift or sleep doesn't count; Addict; Apathetic: can't push); 51-56 phobias / claustrophobia / hallucinations (recurring 1 despair); 61-64 roleplay derangements (mythomania, paranoia, delusion, amnesia); 65 Catatonic; 66 **Heart attack: die of fright**. The book recommends a table discussion and allows ignoring mental trauma entirely (p. 69).

### Full economy summary
- **Players gain** nothing mechanical from pushing. They *spend* Hope as a risk budget. Hope refills fast (D6 per rest shift) so it is a per-day resource, while Health/Heart refill slowly (1 per shift).
- **Players can transfer** risk (take another's push Hope loss at +1).
- **GM gains/spends:** no pool. The GM's leverage is **attrition** (explicit design goal, p. 250 "Attrition as a tool"): hazards, despair-inflicting creature attacks, supply drain, gear degradation from pushes, escalating hazard tables by depth/time, and weekly voyage hazards.
- Secondary push casualty: **gear** (gear bonus loss -> repair shifts, vehicle wrecking).

---

## 3. Character: attributes, talents, professions, creation (ch. 2-3)

### Attributes (p. 21)
Six, rated 2-6: STRENGTH, AGILITY, LOGIC, PERCEPTION, INSIGHT, EMPATHY.
- 24 points at creation; min 2, max 5, except profession **key attribute max 6** (p. 21).
- No rule found for raising attributes via XP.
- Derived: **Health = STR + AGL**, **Hope = LOG + EMP**, **Heart = INS + PER** (p. 21).
- **Carry limit = STR + 4** regular items (p. 22, 93). Heavy = 2 rows, light = 1/2, tiny = 0. 4 supply = 1 item. Worn armor/suits don't count. Over-encumbered up to 2x: movement consumes your action. Carrying a person = over-encumbered. Backpack +1, large backpack +2, *Pack Mule* +2/level.

### Talents (p. 50-53)
- Levels 0-3; most give **+1 base die per level** in a narrow situation. Some are single-level perks.
- Categories and representative entries:
  - **Social**: Actor, Agitator, Barter, Charmer, Cook, Interrogator, Mentalist, Musician, Thug (STR instead of EMP to threaten), Malicious [1] (1 despair per 6 when threatening), Renowned [1] (push EMP twice).
  - **Combat**: Blade Fighter, Bowman, Defender (block), Demolitions Expert, Evasive (dodge), Heavy Weapons, Pistoleer, Polearms, Pugilist, Sharpshooter; Bodyguard [1] (AGL roll to take a hit for someone at Short, not an action); Dirty Fighter [1]; Executioner [1] (roll extra crit die, choose); Fast Reflexes [1] (draw 2 initiative cards, pick).
  - **Vehicle & Exo**: Driver, Exo-Specialist, Greatship Pilot, Kite Operator, Shuttle Pilot.
  - **Knowledge**: Archaeology, Artifact Specialist, Astrometry, Botanist, Cartographer (treks), Cultural Savant, Data Djinn, Glyph Scholar, Historian, Investigator, Laboratorist, Librarian, **Quartermastery** (set up camp, recovery in camps), **Ruin Delver** (delving roll), **Teratology** (creatures).
  - **Insight**: Bird Handler; Intuition [1] (once/session vague GM guidance).
  - **Stealth & Mobility**: Acrobat, Assassin (sneak attack), Burglar, Disguise, Hunter, **Lookout** (spot threats), Sleight of Hand, Stealthy (not for ambushes), Streetwise, **Tracker**; Sixth Sense [1] (cannot be surprised; draw initiative normally in ambush); Zero-G Training [1].
  - **Equipment**: Electro-Specialist, Jury-Rig, Mechanic (also +dice in melee with tools), **Miner** (dig/secure tunnels), Scan Operator; Permit [1].
  - **Recovery**: Commander (help despair-broken), Field Surgeon (stabilize crits), Medic (help damage-broken), Stamina (first aid on self); Lone Wolf [1] (self-help when broken by despair, INSIGHT, no push); Nine Lives [1] (swap D66 digits on crit); Nurse [1] (patients heal 2/shift, up to LOGIC patients); Survivor [1] (STR roll when taking a lethal crit: stabilized after a shift).
  - **Resilience**: Blight Resistant (+1 max Heart/level), Endurance (vacuum/suffocation/cold), Force, Hardened (roll talent-level base dice after suit roll, each 6 ignores 1 Blight), Hopeful (+1 max Hope), Pack Mule, Reckless [1], Resilient (hunger/thirst/disease), Smart [1], Tough (+1 max Health).

### Creation steps (p. 19)
1. Origin (D66, 13 entries): talent level 1, associated faction (fixed or D6), contact (D6), starting capital (D6x100 / 3D6x100 / D6x1000 rukh) (p. 20, 22).
2. Profession (8): Artist (EMP), Enforcer (AGL), Esoteric (INS), Odd Jobber (EMP), Roughneck (STR), Scholar (LOG), Scoundrel (PER), Traveler (PER). Each lists key attribute, 4 key talents, 3 equipment packages (D6), 6 specialties (p. 30-45).
3. Specialty (D6): free talent level 1 (if same as origin talent, becomes level 2).
4. 24 attribute points.
5. Health/Hope/Heart.
6. **3 more talent levels** from profession key talents (max level 2 at start; GM may allow one anywhere).
7. Quirk (D66; roleplaying it earns XP).
8. Equipment package + **keepsake** (tiny item, 1 Hope/session).
9. Name/appearance.
10. Reason for becoming an Explorer (D66).
11. Assemble crew and name it.
12. Note crew maneuvers.
13. Guild equipment: backpack, fusillard pistol, light or standard delving suit, **D6 supply** each; crew items by role (Delver basic climbing kit; Burrower pickaxe & shovel; Scout deep scanner; Guard fusillard rifle; Archaeologist Book of Glyphs) (p. 25-26).
14. Bird type (D6: Ward 1-2 / Guide 3-4 / Specter 5-6) and powers; Garuda device assigned to handler (p. 26-28).
15. Shuttle (Grasshopper/Owl/Manta) and rover (Rhino/Crocodile/Sphinx); Guild-owned, replaced if destroyed (p. 28).

### Relationships
- **No PC-to-PC relationship mechanic** (unlike Alien buddy/rival or FBL relationships). Social ties are: origin **contact** + **associated faction** per Explorer, and crew-level **faction standing** (p. 132-133).

### Faction standing (p. 132-133)
- Crew has a standing with each major faction from **-3 Hostile** to **+3 Allied** (Antagonistic -2, Obstructive -1, Neutral 0, Collaborative +1, Supportive +2). The number is a **dice modifier to all rolls** interacting with that organization.
- Starts as the Explorers Guild's standing (inter-faction matrix p. 133), modified by members' affiliations.
- Changes by GM/adventure; more than +/-1 per session is rare.
- Individual leverage: an Explorer using their contact/affiliation can treat standing as one step higher for one interaction (one Explorer at a time).

---

## 4. Health, injury, death, healing, conditions, trauma (p. 65-74)

### Harm types
Damage -> Health; despair -> Hope; Blight -> Heart (p. 65).

### Armor and cover (p. 63, 65)
- Roll **gear dice = armor rating** (armor + cover added together); each 6 reduces damage by 1. Not an action, cannot be pushed.
- Cover ratings: shrubbery 2, furniture 3, door 4, inner bulkhead 5, outer bulkhead 6, armored bulkhead 7+. Must already be in cover before being shot; taking cover is part of a move.
- Delving suits (p. 98-99): Light (Bandak) armor 1 / Blight protection 3; Standard (Charrumak) armor 2 / BP 5, bulky; Heavy (Erafat) armor 4 / BP 7, bulky. All have comlink, filter pack, electric lantern, vacuum resistant. Bulky = -2 AGILITY.

### Broken by damage (p. 65-66)
- Health 0: collapse; one move per round, no full actions, can hold off.
- **Any further damage while broken = automatic critical injury.**
- Minor NPCs/creatures broken = dead/out (GM choice). Important NPCs use PC rules.
- Recovery: **First aid** (full action, LOGIC + medical gear): heal = number of 6s, no longer broken (broken victims only). **MediDose**: auto-heal 1 (basic) / 2 (advanced) if broken. **On your own**: 1 Health after a shift.
- Rest (not broken): 1 Health per shift. Health, Hope, Heart recover simultaneously.

### Critical injuries (p. 66-67)
- Trigger: a **single instance of damage after armor/cover >= weapon crit threshold**. Crit doesn't make you broken by itself.
- D66 table structure: 11-26 one-shift conditions (Winded/Exhausted, Stunned/Dazed, etc.); 31-52 D6 / 2D6-day injuries (concussion, severed ear, broken foot/hand/ribs/arm/leg, gouged eye; "movement becomes an action", "arm cannot be used"); 53-64 **lethal** (punctured lung, bleeding gut, burst intestines + virulence 6 disease, severed arm/leg permanent); **65 shattered head / 66 impaled heart = instant death**.
- **Dying** (lethal crit): die after one shift unless **stabilized** (one stretch, LOGIC + medical gear). Self-stabilize allowed if not broken. On failure the same person can't retry without better gear.
- Healing: listed time in days; associated conditions heal in a shift unless stated. No gear required, facilities/talents speed it.
- Talents: Nine Lives, Executioner, Survivor, Field Surgeon.
- Medical gear bonuses: MediKit basic +2, advanced +3; Med Lab +3; Trauma Lab +4/+5; decontamination kit +2 (Blight only); healing scarab artifact heals 2 Health + 2 Heart, can stabilize/instantly heal crits (p. 66, 108, 265).

### Stun damage (p. 66)
No Health loss/crit. STRENGTH roll (no action) at -damage; fail = no actions/reactions until next turn; then unmodified STR each turn until success. Pushable; armor applies.

### Conditions (p. 67)
Six conditions, each **-2 dice on one attribute**: Exhausted (STR), Dazed (AGL), Confused (LOG), Distracted (PER), Shaken (INS), Disheartened (EMP). Duplicate -> choose another; all six held -> take 2 damage instead. **Heal one per shift of rest** (Comfortable Bunks upgrade: one extra).

### Heart and Blight (p. 68-71)
- Max Heart = INS + PER (+ Blight Resistant).
- Suffering Blight: roll gear dice = suit **Blight protection**; each 6 cancels 1; not pushable. *Hardened* talent adds a second cancel roll.
- **Blight attacks** (creatures/phenomena): N base dice + base Blight, like an attack; suit BP acts as armor; cannot be blocked or dodged (p. 71).
- **Broken by Blight** (Heart 0): one move/round, no actions; roll D66 **Blight Manifestation**. Further Blight while broken converts to **damage**.
- Blight Manifestation table (p. 70) structure: 11-16 Shivers (Exhausted); single-entry mutations with game effects and healing times (Indigo eyes: see in dark but Distracted in bright light, permanent; Ashen skin: armor 1 but Disheartened; Nebulous breath: zone Shaken; Temporal dissonance: always initiative #10; Ornithophobia: can't command Bird; Glow: enemies +2 to spot you; Creeper: lose 2 Health + 2 Hope; Crystalline growths: 2 damage and suit -2 armor/BP; Bloom: permanent zone Shaken); **65 Wander the Pale Halls: permanently broken (coma)**; **66 Cease to Exist: nobody remembers you**.
- Recovery: **Decontamination** (action, LOGIC, heal = 6s, unbreaks; dose auto-heals 1); on your own 1 Heart after a shift **only in a Blight-free area or delve camp**; rest 1 Heart per shift.

### Other dangers (p. 71-74)
- **Fire**: intensity 6-9 typical; entering/starting round in zone -> roll intensity base dice, 1 damage per 6, armor applies. Catching fire repeats each round until a fire attack deals 0; AGILITY action to extinguish. **Fire crits**: no crit table; broken by fire -> STR each turn until stabilized (LOGIC action), fail = death.
- **Explosions**: hit = everyone in target zone takes same damage (each may dodge); miss = nothing. +2 dice into zones with only blocked borders. **Placed explosives**: blast power = base dice; everyone in zone takes base damage +1 per extra 6; Engaged +1; setting = LOGIC, second failure detonates.
- **Vacuum**: STR each turn with cumulative -1; fail -> Health 0 broken; second fail -> death. Explosive decompression vents one stretch per zone.
- **Falling**: damage = meters / 2; each point beyond the first 2 triggers a crit; controlled jump AGILITY 6s reduce.
- **Zero-G**: -2 STR/AGL, moves need AGILITY.
- **Radiation**: 1 damage per shift (weak) / stretch (strong) / round (extreme); broken -> STR per further point or die.
- **Drowning**: AGILITY per stretch afloat; underwater STR per round; 1 damage/round; broken -> die after a stretch.
- **Cold & heat**: STR at GM interval (shift or stretch); fail -> 1 damage + Confused, no recovery; broken + fail -> death.
- **Sleep deprivation**: 1 shift sleep per day; after a day, 1 Hope/shift + Confused, no Hope recovery.
- **Poison**: toxicity 3/6/9, opposed STR; lethal (1 damage/round then roll again or die), paralyzing, sleeping.
- **Disease**: virulence (typical 6); opposed STR daily; fail = 1 damage, no healing; broken -> die after a day without aid; caregiver may roll LOGIC instead.

---

## 5. Combat structure (p. 57-64, 74-79)

### Initiative (p. 57-58)
- Ten cards numbered 1-10; **each participant draws every round** (optional variant: only round 1). GM may draw one card per NPC group.
- **Creatures draw one card per point of Ferocity** (p. 57, 222).
- **Surprise**: if the opening attack is fully surprising, attacker **chooses** any card; everyone else draws.
- **Hold off**: on your turn, swap cards with someone acting later; they must act immediately. Vs multi-card creatures you pick which later card to take.
- Flip card after your turn; you cannot react afterwards.

### Action economy (p. 58-59)
- Each turn: **one move + one action**.
- **Free actions** (own turn only): draw/swap/stow weapon, change position, drop item, shout, **use a crew maneuver**.
- **Reactions** (block, dodge) are taken on an opponent's turn but **consume your turn**; impossible if you already acted.
- Action list: close combat (STR), shoot (AGL), throw (STR), reload, first aid (LOG), decontaminate (LOG), persuade (EMP), run, block (STR, reaction), dodge (AGL, reaction), grapple (STR), pick up, use equipment, aim, command Bird (INS).

### Zones, range, movement (p. 59-60)
- Zone = room/corridor/area, a few steps to ~25 m.
- Range: **Engaged** (adjacent), **Short** (same zone), **Medium** (adjacent zone), **Long** (up to 4 zones), **Extreme** (further).
- Zone features: **Cluttered** (AGILITY roll to enter), **Dimly lit** (-2 PER and ranged into/in; ranged cannot pass through), **Cramped** (crawl only, can't move/shoot past adjacent people).
- Borders open or blocked (walls block LOS unless at doorway). Doors take 5 damage.
- Move = to adjacent zone or Short<->Engaged. Run (action) = 2 moves. Crawl = action + move. Leap >= 3 m: AGILITY, -1 die per meter beyond 3.

### Surprise, sneak attack, ambush, darkness (p. 61)
- **Sneak attack**: opposed AGILITY vs target PERCEPTION (-2 to close to Engaged). Win -> choose initiative; close-combat sneak attack gets **+3 base dice** and cannot be blocked/dodged. Individual only.
- **Ambush**: like a sneak attack but group vs group; **one roll per side by highest-skilled member**; success -> all attackers choose their initiative card in round 1. *Stealthy* can't be used; *Sixth Sense* negates.
- **Darkness**: running needs AGILITY (fail = 1 damage); Engaged attacks -2; Short needs PERCEPTION first then -2; Medium+ impossible. Creatures see in the dark (p. 222).

### Close combat (p. 61-62)
- STRENGTH + weapon gear bonus; hit = base damage +1 per extra 6.
- **Block**: declared before attack roll; opposed STR with weapon gear; each defender 6 cancels an attacker 6; consumes turn; pushable.
- **Special attacks** (declare, no weapon gear, blockable): Disarm, Shove (to Short, e.g. through a hatch), Grapple (target can only try to break free, opposed STR action; grappler can only make undefendable grapple attacks).
- Prone attacker -2; attacks vs prone +2. Restrained/unaware target: no block, +3 dice.
- Firearms in melee: roll STR, usually -2 for minimum range.
- **Creature attacks can't be blocked unless specified (p. 61)** - but ch. 13 (p. 222) says Engaged creature signature attacks *can* be blocked and ranged ones dodged. Internal inconsistency.

### Ranged combat (p. 62-64)
- AGILITY + weapon gear; line of sight required.
- **Minimum range**: -2 dice per range band below minimum (not vs unaware/restrained). Never beyond max.
- Engaged vs defenseless/unaware: +2.
- **Target size**: prone/small -2, large creature/vehicle +2.
- **Aimed fire**: aim as action, +2 on next shot (lost if you do anything else or take damage).
- **Dodge**: reaction, opposed AGILITY, must be aware of attacker.
- **Full auto**: hit -> another attack (same/different target), up to 3; reload afterwards; aim bonus only first burst.
- **Friendly fire**: missing a target Engaged with an ally -> 2-die attack on the ally.
- **Ammunition = supply** (p. 64, 94): no bullet counting; reload after combat costs 1 supply per weapon fired; reloading mid-combat = full action + 1 supply. Weapon features: Low capacity (any 1 rolled empties the magazine), High capacity (D6 4+ no reload), Single shot, Powered (melee weapons spend 1 supply after combat), Long (+2 attacks/blocks in round 1), Flexible, Bulky, Grape, Explosive, Fire N, Stun (p. 95).
- Weapon stat line: Grip, Bonus, Damage, Crit threshold, Min/Max range, Weight, Tech, Cost (p. 64, 96-97). Examples: fusillard revolver +2/dmg 2/crit 4/Short-Medium... coiler rifle +2/3/4/Medium-Extreme; flamethrower +2/3/4/Short-Medium/Fire 6; heirloom Dura blade +4/3/4 Engaged powered (p. 115).

### Social conflict (p. 65)
- EMPATHY; opposed EMPATHY if actively resisted. State stakes first; requests must be reasonable. Interrogation vs EMP or STR.
- Negotiating position +1 die each: costs them nothing; they're harmed/despairing/Blighted; they're your captive; you helped them before; well-presented case. -1 die each: they risk/sacrifice; nothing to gain; you're their captive; communication trouble.
- No social conflict PC vs PC.

### Crew maneuvers in combat (p. 54-55, 58-59)
See §8. Free action, role-locked, one use per combat.

### Vehicle combat (p. 74-77)
- Vehicle attributes: **Maneuverability** (gear dice, degrades on push), **Speed** (zones per round), **Hull** (0 = wrecked), **Armor**, Passengers, Cargo, Slots, Upgrades. Rovers also have Blight Protection (p. 110-111).
- Ground/aerial (tracks altitude in zones; crash damage = altitude x 3) and space (abstract segments).
- Vehicle actions: start engine, speeding (extra move), fire mounted weapon, deploy countermeasures (LOGIC reaction, -2 to incoming), ramming (AGILITY + Maneuverability; damage = Hull/2 rounded up, crit = damage +2; rammer takes target Hull/2), stunt (AGILITY + Maneuverability; as reaction gives attacker -2), overload (LOGIC, +1 Speed or +1 die; fail = 1 vehicle damage), field repair, sensor sweep, docking.
- Passengers in vehicle = cover equal to vehicle armor. Close combat never crits vehicles.
- Critical Vehicle Damage D66 (p. 77): ricochet, skid (lose turn), cockpit shattered (-2), operator/passenger hit, drivetrain (-1 Maneuverability), severe spin (crash), fire (intensity 8), weapon disabled, massive crash (D6 to occupants), engine disabled, explosion (blast 9).
- Repairs: LOGIC per shift, each 6 restores 1 Hull or Maneuverability.

### Chases (p. 78-79)
- No zones: only range bands. GM sets starting range (max Long).
- Each round begins with an **open opposed AGILITY roll** (+talents, +Maneuverability; Speed ignored); prey pushes first.
- Winner shifts range **one band per 6 more** than loser. Beyond Extreme = chase over (escape). Engaged = pursuer can ram/board/attack. Past Engaged = pursuer may overtake and become prey.
- Then prey side acts, then pursuers; all non-chase actions at -2. Passengers fire at -2 (mounted weapons with gunners no penalty).
- Multi-participant: split into two sides, only the slowest on each side rolls; or individual relative tracking.

---

## 6. Expedition / exploration / journey rules

The game nests three travel scales: **Greatship voyage (weeks)** -> **landfall & trek (shifts, hexes)** -> **delve (stretches, markers)**. Each has its own roll, hazard table and resource drain.

### 6a. Greatship voyages through the Slipstream (p. 192-199)
- Greatship attributes: **Hull** (12-30) and **Speed** (flat-space AD/day / Slipstream leagues/week). Slipstream Cruiser Hull 10-15. Hull 0 = inoperable, drifts.
- **Crew Morale** (single rating): merchant 6, navy 8, exploration 10, pirate 4; +1 per captain's Greatship Pilot level; features add (comfortable cabins +1, shrine +1). **Morale 0 = mutiny.**
- Procedure (p. 196):
  1. Captain rolls INSIGHT (Greatship Pilot) to enter; failure = roll D6 on Entry/Exit column (still enters, at a cost).
  2. **After each week**, roll D6 on the Slipstream Hazards table, reading the column for **weeks traveled: 1-3, 4-6, 7-9, 10+**. Apply Hull/Morale effects.
  3. Exit: INSIGHT (Greatship Pilot) again; fail = Entry/Exit column.
- **Escalation**: later columns are harsher (e.g. result 3: brawl Morale -1 in weeks 1-3, food poisoning -2 in 7-9, rationing -2 in 10+; result 6: time slows -> nightmares -2 -> unnatural song -2 -> barnacle infestation Hull -D6 & Morale -2). Hull losses range -D3 to -D6; some entries order Explorers into STR rolls or Blight attacks (8 dice) (p. 198).
- Up to 3 Explorers can help captain's rolls via help rules; failures may affect standing with crew (p. 196).
- **Crew duties** (D6, p. 197): Ice Duty (scrub Blight off hull), Hull Guard, Repair Detail, Sensor Patrol, Guard Duty, Reactor Duty; roleplay hooks tied to hazards.
- **Morale recovery** (p. 199): shore leave D6/week; once-per-week festivities +1; unscheduled Slipstream exit to rest +1 (once per month).
- **Repairs**: en route 1 Hull/week; facility weekly repair 1 (small station) / 3 (waystation) / 6 (Ship City) / all.
- Returning home is normally skipped; used to distribute XP/CP.

### 6b. Shuttles (p. 200-203)
- Attributes: Maneuverability, Combat Speed, Hull, Armor, Travel Speed, Range (AD), Passengers, Cargo, Slots, Upgrades. Grasshopper +3/4/14/6 (+1 die repair rolls); Owl +2/3/16/7; Manta +4/4/12/5.
- Upgrades bought with **CP** (see §9): e.g. Galley I-III (1 supply/day per level), Garden Wall (1 supply/day), Shrine or Entertainment Module (+1 Hope per rest shift), Comfortable Bunks (+1 condition healed), Infirmary +2 / Med Lab +3, Reinforced Hull, Enhanced Avionics (+1 Maneuverability/level), Turret, Workshop +3.

### 6c. Landfall (p. 204)
1. Find landing sites from orbit: LOGIC + gear/talents; **number of 6s = max sites found**. Fail -> retry next shift or land blind (**-3 base dice**, land anywhere).
2. Touchdown (about a shift): AGILITY + Maneuverability. Fail -> critical vehicle damage; choose abort (retry next shift) or press on (second AGILITY; fail = crash).

### 6d. Trekking (p. 204-205)
- Hex map, **hex = 10 km**.
- Explorers trek **2 shifts per day**; a 3rd shift makes everyone **Exhausted**. Rest of day is camp/rest.
- Speed: **1 hex/shift on foot, 2 hexes/shift by rover** in normal terrain.
- **Each shift, one leader rolls**: LOGIC on foot (Cartographer, compass +1, cartographer's kit +2) or AGILITY + rover gear bonus (Driver).
  - **Two or more 6s: +1 hex** this shift.
  - **Failure: roll D66 Trekking Mishap.**
- **Difficult terrain**: -2 dice; rover reduced to 1 hex/shift. **Impassable** hexes block ground movement.
- **Supply**: **2 supply per shift trekking** for the crew; +1 per Explorer beyond five. Split groups each pay separately. **Camp: 1 supply per shift.**
- **Setting up camp** (on foot): LOGIC (Quartermastery), one stretch; tent +2 lets one Explorer roll for all; fail = nobody sleeps next shift. Rover crews need no roll. Skipping camp leads to sleep deprivation.
- **Trekking Mishaps (D66, p. 205)** structure: low visibility (half distance), blocking terrain (AGILITY to move; on foot each rolls and extra 6s may be given to others), damaged filters/suits (-1 armor & BP), lost (no progress), dropped supplies (-D6 supply), irritant (Distracted without filter), drivetrain damage / fall D6+3 m, storm (no progress; on foot cold rolls), lightning (9-die attack), landslide (2 damage reduced by AGILITY), savage creature (from ch. 13), sinkhole (rover stuck: STR + a shift; on foot PERCEPTION, three fails = swallowed forever).
- **Encounters & sights** (p. 204): categories Encounter, Phenomena, Weather, Obstacle, Sign, Discovery; "sights" are non-mechanical narrative color. Official adventures supply the tables.
- Planetside **phenomena** (p. 239-240) plug in here: Brittlestorm (cold STR every stretch for a shift, D3 gear damage on a 6), Grit Tornado (STR/AGL or no progress, lasts D3 shifts), Sinus Storm (9-die internal attack, armor useless, rover -D3 Hull), Toxic Fog (4-12 dice per shift).

### 6e. Delves (ch. 12, p. 207-219)

**Basics (p. 207-209)**
- Delve = hazardous descent (typically underground Builder ruin, but also any Blight-infested perilous crossing on foot: mountainside, tunnels, gorge).
- **Delve map**: 2D side view; GM has full map with key locations; Explorers get a partial **deep scan map**. Key locations have separate top-down maps.
- **Markers**: depth/distance units; each marker is a zone border. **Moving one marker = one stretch.** Delves are typically **15-30 markers** deep.
- **Blight level** per zone (1+), unknown until scanned. **Blight Cores**: one Blight attack per stretch inside. **Blight Oases**: Blight-free refuge, allow camps.
- **Delve Class** (Guild estimate): I (no/very low Blight, suit optional), II (low / minor obstacles), III (medium, hazardous), IV (high, fatalities common). Also sets Guild pay (§9).
- **Crew roles**, fixed before the delve: **Delver** (leads, makes delving rolls), **Scout** (scanners, lookout), **Burrower** (removes obstacles), **Guard** (threats), **Archaeologist** (optional; glyphs, finds). Four mandatory. Guild advises 4-5 members; fewer -> Explorers double up; <4 players -> add NPCs, Delver should be a PC. Changing roles mid-delve takes a stretch.
- Key attributes by role (p. 25): Delver AGL/INS, Burrower STR/LOG, Scout PER/LOG, Guard STR/PER, Archaeologist LOG/INS.

**Preparing (p. 209-210)**
- Choose gear and supply within carry limits. Supply is crew-shared but individually carried (4 supply = 1 item).
- **Deep scan**: Scout, LOGIC + deep scanner (+3), **one stretch (1 supply)**. Success = deep scan map (high Blight or geology may obscure parts). Fail -> may retry only after delving blind at least one marker.
- **Delving blind** (no scan): **-2 dice on all delving rolls and +1 supply per marker**.
- **Bird Blight Scan**: INSIGHT (Bird Handler), no Energy needed; Bird flies up to **four markers** ahead and returns after **a stretch (1 supply)**; Garuda device reads it; mark Blight levels, cores and oases. Fail -> another Explorer tries, or same one after moving a marker.
- Other scanners: environmental scanner (current zone Blight/toxins, LOGIC, a stretch), proximity sweeper (motion in current/adjacent zones, LOGIC, full action, 1 supply).
- Communications: comlink Long range (4 markers) underground; beyond needs com wires.

**The Delve Procedure (p. 211-214)**
1. **Delving roll**: Delver rolls **AGILITY** + Ruin Delver + one gear item (climbing kit +2/+3/+4, adhesive gloves +3, grappling gun +2, portable crane +3); blind -2.
   - **Each 6 = advance one marker**, each marker costs **1 stretch and 1 supply**.
   - **Failure**: still advance **1 marker, but it costs 2 supply**, and **+1 to the hazard roll**.
2. If movement reaches a **key location**, stop and explore it (**1 supply per stretch** there). Otherwise **a hazard occurs** ("There is no such thing as an eventless delve").
3. **Hazard**: GM rolls D6 for **affected role** (1 Delver, 2 Scout, 3 Burrower, 4 Guard, 5 Archaeologist [reroll if none], 6 All Explorers), then D6 + **modifier by distance to nearest known exit**: 1-5 +0, 6-10 +1, 11-15 +2, 16+ +3; +1 if delving roll failed. Exact repeat in same delve -> reroll.
   - Resolution: GM narrates, affected player(s) make the listed attribute roll; if all affected, each rolls; **extra 6s can be donated to Explorers who failed**.
4. **Suffer Blight**: highest Blight level among zones passed/entered (not the start zone). Each Explorer rolls suit Blight protection; each 6 reduces by 1; remaining levels = Heart loss.
5. Repeat.
- **Delve Hazards table (p. 212-213)**: 6 columns (roles) x rows 1 to 9+. Low rows: supply loss, minor damage, conditions, extra stretch. Middle rows: despair, lost items, broken weapon, cracked visor (-1 BP), impassable passage (turn back or breach charge), falls D6+4 m. High rows (7, 8, 9+): Blight 2, 5-6 dice attacks with conditions, D6 supply, separation from group + despair, falls 2D6 m, 6-die damage-2 attacks, Blight attacks, lose 3 supply. Hazards are narrative prompts; GM may pre-roll or choose; adventures supply themed tables.
- **Going back up** (p. 213): explored zones need no delving rolls (unless GM rules the situation changed), but still 1 stretch and supply per marker.
- **Splitting the crew**: two separate delves, each with roles, rolls and supply.
- **Worked example** (p. 219): scan (1 supply) -> Blight Scan (1 supply) -> AGL roll 1 six -> hazard Scout "strange static" -> push for 3 sixes costing 2 Hope -> 3 markers / 3 supply -> hazard -> Blight roll, Delver and Burrower lose 1 Heart.

**Supply (p. 214-216)**
- One abstraction for oxygen, water, food, energy/batteries, ammunition, light.
- Not tracked in Ship City/Greatships; tracked on expeditions, especially delves.
- **Consumption table**: delving/exploring 1 per stretch (whether moving or not); delving blind +1 per marker; strenuous activity (e.g. after combat) +1; each weapon reloaded +1; resting in delve camp 1 per **shift**; crew over 5: +1 per extra member per stretch (basic consumption only); hazards vary.
- **Supply incidents** (per Explorer): when an Explorer carries **3 or fewer**, each further loss triggers **D6 + remaining supply**: 7+ none; 6 Battery Warning (1 despair); 5 Power Conservation (Dazed); 4 Lights Out (Distracted); 3 Oxygen Warning (Confused); 2 Emergency Shutdown (Dazed + 1 despair).
- **Out of supply**: every time supply must be spent and none remains, roll D6 per Explorer: 1-3 one damage, 4-5 one despair, 6 one Blight; armor/BP don't help. **If broken by damage while out of supply, the Explorer dies the next time supply should be spent.**
- Marking: any Explorer removes marks (alternate), except role-targeted hazards. **Sharing** supply takes a stretch (1 supply) unless in camp.
- Guidance: 15-30 markers deep -> **30-60 supply round trip** if unhindered (p. 217). Supply runs and caches allowed.
- Supply producers: crank (STR, 1 supply/shift), field kitchen (EMP, 1/shift), galley/garden upgrades (per day) (p. 105, 112, 202-203). 1 supply costs 100 rukh, weight 1/4.

**Delve camps (p. 217)**
- Only in Blight-free areas (or cleared via Bird *Clear Blight* / decontamination). Setup: a stretch + LOGIC (1 supply); retry allowed.
- In camp: rest and recover at **1 supply per shift**; camp persists for return; Explorer on guard can't rest that shift. Heart recovery on your own requires Blight-free/camp.

### 6f. GM delve generator (p. 256-259)
14-step procedure:
1. Era (D66: Early / Middle / Late with ages).
2. Purpose by era (temple, guard, storage, industry, monument, tomb, machine, power, art, communication, knowledge, research, refuge).
3. Fate (tectonic/solar, natural disaster, overrun by Blight, abandoned, destroyed, sealed, forgotten, attacked, repurposed -> reroll second layer).
4. Type (structure, garden, shallows, combined, deep vault).
5. **Depth / entrances / key locations**: Shallow D6+8 markers, D3+1 entrances, D6 locations; Considerable D6+12 / D3+1 / 2D6+1; Deep/Tall 3D6+20 / D6+1 / 2D6+10; Abyssal 4D6+40 / D6+2 / 4D6+10.
6. Defining glyph & theme (10 glyphs with aspects).
7. Quirks (D66 atmosphere).
8. Key location shape & function.
9. **Discoveries** per location: Few (D6-3 shards, no artifacts) / Some (2D6-4, D3 lesser) / Plenty (3D6, D3 lesser + 1 major) / Hoard (5D6+20, D6 lesser + D3 major).
10. **Blight infestation**: Minor (levels 0-3, 1 core, 1 oasis) / Invasive (1-4, D3+1, 1) / Extensive (1-5, D6+2, 3) / Total (1-6, 3D6+4, 3).
11. Threats (Blight creature, construct, beast, echo, combination).
12. Hazards & events (hazard categories: terrain, obstacle, matter, senses, phenomena, weirdness).
13. Other parties (faction specialists, Black Toad harvesters, Guild explorers, miners, wreckers, cultists).
14. Map: key locations every **4-8 markers**, most reachable by >= 2 paths, no obvious endpoint, use Blight to create scan haze, include blocked/hidden paths.

### 6g. Solo (Outcast) delve procedure (p. 285-302) - abstracted, mapless
Useful as an alternative, more "clock-like" formalization:
- Tracked values: **Delve Class** (I-IV, fixed), **Depth Class** (I-IV; +1 per 5 markers), **Distance to Exit**, **Foray Distance** (markers since last key location; resets at a location), **Deep Scan Bonus** (pool), **Blight Scan Bonus** (pool, max 5).
- Deep scan: roll D6 per 6 rolled on the scanner roll, sum = Deep Scan Bonus. Spend 1 point for +1 die on a delving roll or a location check (max 3 per roll; only 1 on location check). Rescan (+2 per 6) only after 5 markers from last scan.
- Delving roll as normal; then **Location Check: 2D6 + Foray Distance** (+1D6 by spending deep scan bonus): **2-14 hazard; 15+ key location; 20+ and Depth Class >= Delve Class = endpoint**. (Accumulating foray distance guarantees eventual arrival: a built-in progress clock.)
- **Blight check**: pool of 2 + Delve Class + Depth Class base dice (reduce via Blight scan bonus, min 2); Blight exposure = number of 6s.
- **Camp check** once per shift: 2D6 + Delve Class + Depth Class; **13+ interruption** (no rest benefit; camp trouble table).
- **Escaping** (backtracking): take Blight = Delve Class + Depth Class.
- **Discovery value**: 2D6 + Delve Class + Depth Class -> 4-12 mundane / 13-15 notable / 16+ major (+D6 at endpoint); detail table (shards, glyphs, corpses, D3 / 2D6 / 3D6 supply caches, lost gear, alternate path +1 die, hidden antechamber, portal, artifacts).
- **Costly Outcome** table (D66): lose 1 supply, lose/break item, one of six conditions, lose D6 supply, 4-6 die attacks.
- Outcast buffs: 28 attribute points, +20 XP, bonus Bird power, 3 swappable maneuver slots (+slot for 5 CP), carry STR+6, 10 supply per item, act at -1 die when broken, self first aid / self friendly-voice / self decontamination, **draws two initiative cards**, all rolls normal difficulty, all NPCs minor.
- **Divination table** (D6; roll 2D6 keep high/low for likely/unlikely): Yes/No (strong no, no, yes, strong yes), Magnitude (low...very high), Reaction (hostile, cautious, friendly, helpful).
- Spark tables: Facet (function + focus), Character (bearing, trait, role), Delve (environment + feature), Camp Trouble.

---

## 7. Creatures, adversaries, phenomena (ch. 13, p. 221-241)

### Creature combat rules (p. 222-223)
- **Behavior pattern**: each creature has a D6 table for what it's doing when first encountered (e.g. 1-3 dormant, 4-5 prowling, 6 attacks). PC actions may shift it.
- **Containment Protocol**: players roll **LOGIC (Teratology/Botanist)** with a rarity modifier listed by the creature name, e.g. [+2], [+0], to identify it and recall the Guild's recommended handling (a sentence of advice like "Avoid if possible. Hide in cramped quarters... attack from a distance").
- **Ferocity**: number of initiative cards / turns per round. Each turn: **one signature attack (including a move from Short to Engaged)** or an **extended move** (two zones, or one zone + Short->Engaged). Creatures rarely hold off; PCs holding off may swap with any of the creature's later cards.
- **Sneak attacks** by creatures: take card #1 for first turn only; draw randomly for others.
- **Signature attacks**: D6 table per creature (GM rolls or chooses). Default Engaged range. **Fixed base-dice pool** (creatures never roll attributes for attacks), base damage and crit threshold like weapons. Engaged attacks blockable, ranged dodgeable; no special close-combat attacks (disarm/grapple/shove) against creatures. Despair or Blight attacks can't be blocked/dodged (EMPATHY resists despair; suits resist Blight). Some inflict conditions. **Never the same signature attack twice in a row**: add +1 to the D6 (6 becomes 1).
- Creatures **see in the dark**.
- Attributes: usually only **AGILITY and PERCEPTION** (for sneak attacks).
- **Size**: small -2 to be hit; large +2.
- **Armor**: natural, works as armor.
- **Health**: broken = dead/incapacitated.
- **Immune** to despair, Blight, social conflict.
- **Swarms**: one creature, **only damaged by fire, explosions, area weapons**.
- **Creature Critical Injuries** (D6): 1 Frenzy (bonus signature attack now), 2 Heightened Senses (card #1 next round), 3 Retreat (moves to zone with no Explorer), 4 Stunned (loses next turn), 5 Flee (runs; escapes if not followed), 6 **Killed**.
- **Scaling**: adjust Ferocity first, then Health/damage.

### Creature stat blocks (format: Ferocity / Health / Armor, AGL / PER, abilities, behavior D6, signature attacks D6)
| Creature (type) [rarity] | F | H | A | Notable mechanics |
|---|---|---|---|---|
| Blight Crawlers (Blight being) [+2] | 1 | 10 | 0 | **Swarm**; 2 despair to all at Short; encasing Blight attack repeating each round until STR break-free; 8-die crystal storm AoE; blinding crawl (lose turn); 12-die burrowing attack |
| Fallowbloom [+2] | 2 | 10 | 5 | Stationary lure: forced movement toward it (INSIGHT), Blight touch 11 dice, **Regenerative Siphon: heals Health equal to damage dealt** |
| Kwanë Bird [+0] | 1 | 8 | 0 | **Bird-killer** (first attack always targets the crew's Bird); Silent Flight (can ambush); despair shrieks at Medium |
| Snake Vine [+2] | 2 | 10 | 3 | Ensnare (lose turn), strangle, dissolving thorns repeating until STR break-free |
| Cinderfish (construct) [+2] | 3 | 7 | 2 | Technological Curiosity (targets most advanced gear); energy pulse degrades Guild/Heirloom gear bonuses; snatches items |
| **Gargantuan** (guardian construct) [+1] | 1 | **30** | 5 | **Huge: +2 dice to hit it**; club sweep all at Short (9 dice, dmg 2); crushing blow 10 dice dmg 3 + prone; kick target to adjacent zone; **throw one Explorer at another**; stomp + all at Short AGILITY or Dazed; **"Too Big for This Space": hits ceiling, all at Short 7 dice, zone becomes Cluttered**. Protocol: hide in cramped quarters it can't reach |
| Glyph Golem [+1] | 2 | 10 | 3 | Emerges from walls; Confusing/Paralyzing glyphs (lose turn) |
| Sentry Hound [+1] | 1 | 6 | 0 | Pack animal; lunge + follow-up unblockable attack; blinding spit |
| **Heaphog** (beast) [+2] | 1 | 18 | 5 | Stampeding livestock; savage roar (Dazed + despair); sideswipe/maul throws victim to adjacent zone; **Collateral Damage: zone becomes Cluttered**; trample then moves on |
| **Nekatra** [+2] | 2 | 11 | 1 | STR 6 AGL 6 PER 5; **Regenerative: heals 1 Health each turn; if broken or critically hit, STR roll to rise again with 3 Health**; Provoke (noise action forces Feral Hunger rampage, after which it loses a turn; EMPATHY (Teratology) can calm it into fleeing); throat lunge holds until opposed STR |
| Ship Mites [+2] | 2 | 10 | 0 | Swarm; **Mite Infestation: -1 Hull/day (Greatship) or -D3 (shuttle) while unchecked**; heat seekers; solvent erodes armor rating |
| Slipstream Nieba [+2] | 1 | 15 | 6 | Hull-clinging; **weakness: oxygen** (venting suit air = attack; airlock = automatic crit); drive malfunction (-1 Slipstream Speed); Contract & Expand (next attack +4 dice, heal 2); **Reform: regenerate 4 Health**; eats Guild/heirloom tech |
| Wraithlight (echo) [+0] | 1 | 5 | 2 | **Ethereal: only energy weapons or strong light** (lantern counts as weapon); Call for Company (another arrives next round); lures crew off the hull |
| Conduit Specter [+0] | 2 | 6 | 2 | Ethereal (half damage except energy/fire); **Distributed Intelligence: returns later unless the system is repaired**; Fade Away (reappears within a shift) |
| Haubrioc Bird [+0] | 2 | 8 | 2 | Ethereal (half damage); Shadow Attack teleports to Engaged from Long |
| Kasram Pod (Black Ziggurat boss, p. 281) | 2 (1 cold / 3 hot) | 12 | 4 | **Environment lever**: players changing ziggurat temperature alter its Ferocity and its minions' dice (+/-1) (p. 277); grapple-lock vines, toxicity-8 spore opposed roll, AoE root spikes, 2 despair tendrils, Blight grab |

### How big creatures work
There is no special "colossal" subsystem. Size is handled by: **Huge** ability (+2 to be hit), high Health (Gargantuan 30), zone-wide/AoE signature attacks, forced displacement (thrown into adjacent zones, prone), environmental damage (zone becomes Cluttered), and advice to exploit terrain (cramped zones it can't enter). Multiple actions per round come from Ferocity, not size.

### Phenomena (p. 238-240)
- "Non-living threats" with rarity modifier and habitat code **P** (planetside), **F** (flat space), **S** (Slipstream). Understood with a roll like creatures.
- Resolved **as an attack with N base dice** (+ base damage/crit or base Blight), or as a roll-or-lose-progress effect:
  - Blight Barnacles [+1, P/S]: passing through = Blight attack 10 dice, Blight 2.
  - Brittlestorm [+1, P]: cold STR every stretch for a shift or until leaving the hex; each stretch a base die, on 6 an item/rover loses D3 gear bonus.
  - Fire Meteoroids [+2, F/S]: 14-die attack; Greatship -D6 Hull + fire in a feature.
  - Gas Cloud [+2, F/S]: LOGIC or +D3 weeks travel; INSIGHT or ejected from Slipstream.
  - Gravity Crevasse [+0, F]: pilot AGILITY -2 or 6-die attack / -1 Hull.
  - Gravity Tide [+2, F/S]: 12-die attack; untethered crew dislodged; captain INSIGHT or forced out of Slipstream.
  - Grit Tornado [+2, P]: STR (foot) / AGL (rover) or no progress this shift; lasts D3 shifts.
  - Light Blaze [+1, F/S]: 8-die dmg 2; damages avionics; Distracted.
  - Sinus Storm [+0, P]: 9-die dmg 2, armor useless, rover -D3 Hull.
  - Time Field [+0, F]: PERCEPTION to notice or be trapped forever.
  - Toxic Fog [+2, P]: 4-12 dice per shift; filter blocks one attack.

### Adversaries (p. 241, 255)
- Table of ~20 archetypes with six attributes, Health (4-9), talents, equipment (e.g. City Dweller all 3s Health 6; Assassin Health 9 Assassin 1 Sharpshooter 2; Guild Militia Health 7). Default: 3 in every attribute. **No NPC attribute above 6.**
- NPC essentials: name, characteristics, drive.
- **NPC Reaction** D6: 1 hostile, 2-3 cautious, 4-5 friendly, 6 helpful (p. 255); faction standing informs reactions.
- **NPC Morale**: flee/surrender when leader lost, half force eliminated, or half Health lost; optional EMPATHY/LOGIC roll to stay.

---

## 8. Group / team mechanics

### Crew roles and crew maneuvers (p. 25, 54-55, 58-59, 208)
- Roles are **assigned per delve**, not permanent. Maneuvers **belong to the crew**, usable **only by the Explorer holding the associated role**, persist if individuals are replaced (lost only if everyone is replaced at once) (p. 29).
- Use: **free action**, not an action. Limit: "one maneuver, once, during the entire engagement" per Explorer (p. 54) vs "one use in each combat, per maneuver" (p. 59) - slight wording inconsistency.
- Starting maneuver per role: Delver **Rally**, Scout **Situational Awareness**, Burrower **Destabilize**, Guard **Flank**, Archaeologist **Analyze** (p. 25).
- Full list by role (p. 55):

| Delver | Scout | Burrower | Guard | Archaeologist |
|---|---|---|---|---|
| Command: ally within Medium takes an extra full action now | Bait & Switch: enemy within Short loses its turn this round | Demolition: zone within Medium becomes Cluttered (needs charge/grenade) | Concentrate Fire: all Explorers within Medium +2 dice on ranged attacks vs one enemy this round | Analyze: you or ally in zone +2 dice on one attack vs a specific enemy |
| Escape Route: you/ally gets free move to retreat from Engaged | Bird Call: Bird uses a power without an action | Destabilize: destroy wall/zone boundary within Medium, opening passage or making it impassable (needs charge) | Field Recovery: you/Engaged ally recovers 3 Health even if not broken (needs MediDose) | Feint: ally in zone gets a free dodge (reactive) |
| Rally: all within Medium restore 1 Hope (even if broken) or clear a condition | One Step Ahead: hold off and swap cards with an ally even if they've acted, giving them a second turn | Fearless: automatically avoid despair from a horrifying creature (reaction) | Flank: +3 dice to one attack | Find Weak Spot: target's armor 0 for one attack |
| Rope Master: grapple an Engaged enemy with ropes; break free AGILITY -2 | Situational Awareness: free dodge (reaction) | Smoke Screen: smoke blocks LOS in your/adjacent zone for 3 rounds (needs charge/smoke grenade) | Protect: redirect a close attack on an ally in zone to you | See Pattern: +2 dice on all rolls relating to a creature this round (reaction); recall Guild Recommended Procedure |

- New maneuvers cost **5 CP** and require a certified Guild instructor (Ship City/waystations or embedded instructor) (p. 29).

### Teamwork micro-rules
- Help: +1 die per helper, max 3 (p. 49).
- Taking a comrade's push Hope loss at +1 (p. 48).
- Delve hazards and trekking blocking-terrain: **extra 6s donated to comrades who failed** (p. 205, 211).
- Friendly Voice / First Aid / Decontamination are "someone else rolls for you" recoveries (p. 66, 68, 71).
- Delve roles guarantee each player a spotlight via role-targeted hazards (p. 256).
- Theme: "Teamwork" is one of five pillars; solo play is deliberately a special mode.

### Shared resources
- **Supply**: common pool, individually carried; shared by redistribution (a stretch) (p. 209, 216).
- **The Bird** (Garuda) (ch. 5, p. 81-87): crew-owned companion. No attributes; Health + Energy + powers. Types: Ward (H5/E2, Raptor's Call), Guide (H4/E3, Farsight), Specter (H3/E4, Enshroud).
  - Command = **full action, same zone**, INSIGHT (Bird Handler); **Energy spent = extra base dice** (so 1s on push cost Hope). Success triggers the power; failure = Bird refuses, **no Energy spent**. Designated companion (assigning takes a stretch) +1 die. Energy fully restored after a shift of complete rest.
  - **Losing Control** (pushed roll with any 1s): D6 + Energy spent: 1-2 mind link break (handler Shaken), 3-4 self-preservation (refuses commands for a stretch), 5-6 lightstorm (zone Distracted), 7 temporal drift, 8 energy drain (crew loses D6 supply), 9+ energy surge (8-die attack on the zone).
  - Bird damage: attacks vs it -2; broken = no powers until next shift; **crit = dies** (Phoenix Engine can revive within a shift).
  - Basic powers: Attack (dmg 3, crit 6, Long), Soak Blight (reaction vs a Blight surge), Defend (reaction block/dodge for an Explorer), Glow (light Medium range for a shift), Clear Blight (zone Blight-free for a shift, +1 shift per extra 6), Blight Scan (free).
  - Advanced: Fetch, Flicker Field (ranged immunity for a round), Farsight, Glyph Warden, Dimensional Flitting (portal to place visited in last day), Illusionary Veil, Enshroud (Blight immunity for a stretch), Phoenix Engine, Soul Delve (all Hope), Energy Bridge (5 m / 200 kg per 6), Raptor's Call (next Explorer attack this round is an automatic crit ignoring armor/cover), Delve Dream (move 3 zones before an event regardless of roll).
- **Garuda device**: crew item to read Blight scans (p. 28, 106).
- **Crew items** per role (p. 26).
- **Shuttle and rover**: Guild-owned "home" (replaced if destroyed), upgraded with CP (p. 28, 112-113, 202-203). Rover stats: Rhino +3 / Speed 2 / Hull 9 / Armor 6 / BP 4 / 7 slots; Crocodile +2/2/11/7/3; Sphinx (hover) +4/3/7/5/2. Upgrades include Hazard Protection (+1 BP), Small Galley (supply/day), Hydroponic Garden Cube, Med Station/Lab, Comfortable Bunk Beds, Entertainment Module, Airlock, Tow Line, Storm Bolts, Turbo Charger, weapons.
- **Kites** (remote drones): Maneuverability-like bonus, Hull, Armor, slots (p. 114).
- **Faction standing** is crew-level (p. 132).
- **CP** pool is crew-level (p. 29).
- GM advice: "Threaten their base" (shuttle is home; infestations, bureaucratic claims) and "Use the Bird" as an emotional NPC (p. 251).

### Base / home
No settlement-building subsystem. Home = Ship City (unlimited supply, services that heal Hope/Health, bath house +1 all tracks) and the crew's shuttle/rover as upgradable mobile base.

---

## 9. Advancement, XP, money, campaign meta

### XP (p. 28)
- After each session, debrief; 1 XP per "yes": participated; roleplayed quirk; explored unknown location; investigated a mystery; instigated/partook in intrigue; helped another Explorer; overcame a difficult challenge; interacted with affiliated faction via contact/background. GM has final say.
- Themes are tied to XP questions (p. 245).
- Spend between sessions: new talent 5 XP; raise talent to level N = 5 x N XP (10, 15). One level at a time. No attribute advancement found.

### Crew Points (CP) (p. 29)
- 1 CP per "yes": took on a challenge together; undertook a delve, trek or Greatship voyage; found a new Builder glyph or artifact; gave/got promised a favor from a faction; turned in an artifact to a faction; gained aid from the Bird in desperate circumstances.
- Spend: new crew maneuver 5 CP (instructor); Bird power 5 CP in type / 10 out of type (3/6 with a hired Bird teacher); Bird +1 max Health or Energy 5 CP; vehicle upgrades (1-10 CP, need workshop/shipyard).

### Solo XP/CP milestones (p. 297)
XP: overcame difficult challenge; tried something you're bad at; sacrificed/risked for quirk; achieved mission/personal goal; memory/flashback gave comfort. CP: fulfilled a faction promise; returned an artifact; major discovery; reached delve endpoint; Bird aid in desperation; aided another crew.

### Money (p. 145-146, 262)
- Explorers Guild pay: standing salary 1,000 rukh/month; per delve Class I 500 / II 1,000 / III 2,000 / IV 4,000; major artifact returned 2,500; lesser 1,000; **Bird discovered and returned 5,000**; expedition 100/week; hazard bonus 500. Paid individually on return.
- Artifacts must be turned over to the Guild (major = grounds for dismissal if kept; lesser often tolerated). **Shards** belong to Explorers, sell for 50-250 rukh; 4 shards = 1 encumbrance.
- Artifacts: understanding roll LOGIC (Artifact Specialist) or INSIGHT with modifier; failure triggers its oddity. Generator D66 x4 (description, form, power, oddity); major artifacts have power + oddity, lesser only oddity. Side effects suggested: consume supply/Hope, create Blight when damaged, long use time, cooldowns (p. 263-264).

### Campaign-level meta resources
- Faction standing (-3..+3), CP-funded crew assets (Bird, vehicles, maneuvers), money, artifacts, reputation (narrative only).
- No doom track, no campaign clock, no settlement stat.

---

## 10. Clocks, countdowns, threat/escalation mechanics

No generic "clock" or "threat track" subsystem. Escalation is built into procedures:

| Mechanic | Where | How it escalates |
|---|---|---|
| **Supply as timer** | p. 214-216 | 1 supply per stretch regardless of action; explicit "lifeline and also a timer". At <=3 per Explorer, supply incidents; at 0, damage/despair/Blight each spend; broken + out = death |
| **Delve hazard distance modifier** | p. 211 | Hazard roll +1/+2/+3 at 6-10/11-15/16+ markers from exit, +1 on failed delving roll; higher rows are deadlier |
| **Delve roll failure still advances** | p. 211 | Progress guaranteed, cost doubles (2 supply) and hazard worsens; no stalling |
| **Blight level by depth** | p. 208, 256-259 | Deeper zones typically higher Blight; cores deal Blight every stretch |
| **Slipstream weekly hazard columns** | p. 196-198 | Table column chosen by weeks traveled (1-3, 4-6, 7-9, 10+); later columns harsher; Morale 0 = mutiny; Hull 0 = dead ship |
| **Crew Morale** | p. 193, 199 | Single decaying rating with slow, limited recovery |
| **Trekking third shift** | p. 204 | Pushing pace = Exhausted; mishaps on failed legs |
| **Solo location check** | p. 294 | 2D6 + accumulated foray distance: guaranteed arrival; endpoint gated by depth class vs delve class |
| **Solo Blight check / camp check** | p. 295-296 | Dice pool / target grows with delve class + depth class |
| **Adventure escalation events** | p. 253 | Pre-written adventures use "escalation events" tied to factions/adversaries that intensify over the adventure (no generic rules given) |
| **Black Ziggurat unique hazards** | p. 271 | Hazard table keyed to distance-to-exit bands (1-5, 6-10, 11+): heat/haze -> Blight spores/bloom -> rot destroys 3 supply / grappling vines |
| **Environmental lever on boss** | p. 277, 281 | Changing ziggurat temperature sets Kasram Pod Ferocity 1/2/3 and minion dice +/-1 |
| **Creature Call for Company / Distributed Intelligence / Mite infestation** | p. 234-237 | Reinforcements next round; enemy returns unless system repaired; -Hull per day unchecked |
| **Disease / cold / radiation intervals** | p. 73-74 | Repeated rolls at fixed intervals until resolved |
| **Faction standing drift** | p. 133 | +/-1 per session typical |

GM philosophy (p. 250-251): attrition as a tool ("There should always be some resource running thin"), narrative over mechanics, fail forward, set stakes clearly, reward with artifacts/information, threaten the base.

---

## Rules inconsistencies noted
- Blocking creature attacks: p. 61 "cannot be blocked unless otherwise specified" vs p. 222 "Creature attacks at Engaged range can be blocked".
- Crew maneuver limit: p. 54 "each Explorer may only perform one maneuver, once, during the entire engagement" vs p. 59 "one use in each combat, per maneuver".
- Zero-G p. 72 mentions "+1 stress level", a leftover term with no stress system in this edition.
- Base dice colour given as golden (p. 47) and tan (p. 8).
- Delve hazard table row 5 Archaeologist "Suffer 1 Blight fand become Shaken" (typo).
