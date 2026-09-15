# Alien RPG Evolved Edition: Mechanical Extraction

Source: `docs/reference/Alien_RPG_Evolved_Edition_Fria_Ligan_Alien_RPG_Evolved_Edition_Core.pdf` (324 pp).
Page citations use the **printed page number** (p.N). PDF page = printed + 4 (e.g. p.70 = PDF 74).
Tables are summarized by structure plus representative entries, not reproduced in full.
Method: full text extraction (`pdftotext`), with key tables (Panic, Mental Trauma, Xeno stat blocks) checked against page images.

---

## 0. Edition changes the book itself mentions

- p.10 sidebar "An Evolved Edition": the changes from first edition are described as "gradual", and all previous expansions remain compatible. Conversion rules are on p.308.
- p.308 "Upgrades" appendix. What it explicitly says changed:
  - **Body armor rules "modified significantly"**, so all first-edition body armor levels (Xenomorph natural armor included) must be converted. The conversion table maps FE 0–2 → 0, 3–5 → 1, 6–8 → 2, 9–11 → 3, 12–14 → 4, 15+ → 5. *(I assigned this table to body armor based on the page layout plus a sanity check: FE M3 armor 6 → EE 2, which matches the EE M3 stat. Treat the assignment as inferred.)*
  - **Vehicle armor recalibrated**: FE 1–4 → 1, 5 → 2, 6 → 3, 7 → 4, 8 → 5, then +1 per step.
  - **Spaceship armor recalibrated**: FE 1–4 → 0, 5–8 → 1, 9–12 → 2.
  - **Ammo capacity is a new weapon stat** that "did not exist in the first edition". Defaults: Revolver 1, Pistol 2, Rifle 3, Heavy Weapon 4, Vehicle Weapon 5.
  - **A small number of talents replaced.**
  - **Xenomorph stats**: use chapter 10 stats where they exist, since "there may be minor differences".
- **Not stated in this book, from general knowledge of the 2019 edition (verify before relying on it):** in the 1st edition, any 1 on a stress die triggered a panic roll directly, panic was D6 + stress with no Resolve, and Health equalled Strength. The EE adds a separate **Stress Response** table for stress-die 1s, a **Resolve** score subtracted from both stress and panic rolls, event-based panic triggers, Health = (STR+AGI)/2, and supply-rated ammo.

---

## 1. Core dice

### Dice (p.20, p.42)
- Two kinds of D6: **base dice** (black) and **stress dice** (yellow). Both show the success symbol on the 6. Stress dice also show a facehugger symbol on the 1.
- D3 = D6/2 rounded up. D66 = tens die plus ones die (11–66).

### Pool construction (p.42–43)
- **Base dice = attribute + skill level**, then modified for difficulty, gear, and help.
- **Stress dice = current stress level**, added to the same roll.
- **No skill**: roll attribute plus gear modifiers (plus stress dice).
- **Switching attributes** (p.43): the GM or rules may pair a skill with a different attribute (e.g. STR + MANIPULATION to threaten).
- **Success**: at least one 6 on any die, base or stress. Stress dice showing 6 count as successes, so stress is double-edged: more dice, more risk (p.72 "you can use it to your advantage").
- **Stress die 1** → a **Stress Response** is triggered (see §3).

### Extra successes (p.43)
- More successes mean a better result. In combat, +1 damage per extra success. Otherwise, examples: show off, do it quickly, do it quietly, unexpected additional effect. The GM or adventure decides.
- **Failure** (p.43) "should never stop the story". There must be a way forward at the cost of time, risk, or money.

### Modifiers (p.43)
- Expressed as +N/−N dice, applied to base dice only. **You can never go below 1 base die. Modifiers never affect stress dice.**
- Gear can modify a roll or may simply be required to attempt it.

### Helping (p.43)
- Up to **3** other PCs/NPCs, **+1 die each**, only if they can concretely support the action. **In combat, helping uses your full action.**
- NPC groups act via the help rule (p.157).

### Opposed rolls (p.44)
- Both sides roll. You need **more successes than the opponent** to win. The target of an opposed roll can also push.
- **PvP**: the active PC decides on pushing first, then the passive PC.
- **Open rolls** (no clear active party): a tie means no winner. Break it randomly if necessary.
- Combat defense (defend/dodge) works as opposed cancellation: each defender success removes one attacker success (p.62, p.65).

### Passive rolls (p.44)
- Rolls for things the PC isn't aware of (typically OBSERVATION in stealth). **Cannot be pushed and do not trigger stress responses**, but still include stress dice. The GM may roll them secretly.

### NPCs & dice (p.42, p.157)
- NPCs use skills like PCs but **never push and have no stress level**. The GM only rolls for NPC actions that directly affect a PC.

### Story points (cinematic only) (p.44, p.158)
- Spend 1 to **automatically set one base die to a success**, before or after pushing. **Max 3.** Earned 1 per act by advancing your hidden agenda "despite personal risk or significant sacrifice". One point can carry over to the next cinematic adventure.

### Supply rolls (consumables) (p.28–29)
- Supply ratings exist for **Air, Ammo, Power**. A supply roll uses **stress dice equal to the rating (max 6)**, and each 1 rolled reduces the rating by 1.
- Air: after every stretch and after strenuous activity. Ammo: after firing. Power: after each use.
- NPCs don't roll. Their rating just drops by 1 each time.
- Average rolls to deplete: rating 6 → 15 rolls, 5 → 14, 4 → 13, 3 → 11, 2 → 9, 1 → 6 (depletion is deliberately faster at high ratings).
- **Time as a consumable / countdowns** (p.28, p.55): the timer is set in minutes. After each combat round, make a supply roll; each 1 removes a minute.

### Encumbrance (p.27–28)
- Carry STR × 2 regular items. Heavy items count as 2+, light ½ or ¼, tiny 0. Over-encumbered up to STR × 4: +1 stress each time you move in a stretch of stealth or a round of combat.

---

## 2. Pushing (p.43–44)

- **Trigger**: a failed roll, or a success where you want more successes.
- **Cost**: **stress level +1 immediately**, which also adds one stress die to the pool. Then **re-roll every die not showing a success** (base and stress). Successes carry over.
- **Cannot push if any stress die showed a 1 on the initial roll.**
- **Once only**, unless a talent allows it: *True Grit* (STR), *Nimble* (AGI), *Inquisitive* (WIS) each allow pushing twice with +1 stress per push. *Reckless* (Pilot) lets you take +1 stress before the roll (extra die), then push normally.
- A 1 on a stress die in the re-roll **does** trigger a stress response (see the Hayes example, p.64).
- **Cannot push**: passive rolls, death rolls, Resilient rolls, mental trauma Empathy rolls, career application rolls (life path).
- **Androids and NPCs cannot push** (p.25, p.42). Xenomorphs never push (p.208).
- Stress responses modify pushing: *Jumpy* (push = +2 stress), *Deflated* (can't push). Mental traumas modify it too: *Apathetic* (can't push), *Obsessive* (must push every roll).
- Full auto: pushing an attack roll ends the burst (p.67).
- Space repairs: pushing a repair shift means no stress relief before the next shift (p.147).

---

## 3. Stress, Stress Responses & Panic

### Resolve (p.26)
- **Resolve = (Wits + Empathy)/2, rounded up.** *Seen It All* talent gives +1, up to three times. Used to resist stress responses and panic.

### Gaining stress (p.72)
- Pushing a roll.
- You or a nearby PC suffering certain stress/panic responses.
- A nearby NPC panicking (GM).
- 2nd or 3rd full-auto burst.
- Becoming fatigued.
- Being attacked by your own crew.
- A nearby person revealed as an android.
- Any unnerving encounter (GM/adventure).
- Also via talents and gear: Company Resources, Personal Safety, Pull Rank, Reckless, Analysis (failure), Xenomorphology (failure), Neversleep pills. Also vacuum (+1/round), zero-G failed move, over-encumbrance, and xeno attacks such as Hypnotizing Gaze.

### Stress Response (on any stress die 1 in a skill roll) (p.44)
Roll **D6 + stress level − Resolve**:

| Result | Response |
|---|---|
| ≤0 | Keeping Cool: no effect |
| 1 | Jumpy: pushing gives +2 stress instead of +1 |
| 2 | Tunnel Vision: Wits-based rolls −2 dice |
| 3 | Aggravated: Empathy-based rolls −2 dice |
| 4 | Shakes: Agility-based rolls −2 dice |
| 5 | Frantic: Strength-based rolls −2 dice |
| 6 | Deflated: cannot push (removes and ignores Jumpy) |
| 7+ | Mess Up: action fails regardless of successes, +1 stress |

- Responses 1–6 are **enduring conditions**. Getting one you already have gives +1 stress instead.
- They are removed by relieving stress: one response removed per stress level reduced.
- Weapons with the *Unreliable* feature jam on a Mess Up (p.82).

### Panic roll triggers (p.72)
- Witnessing another PC become broken.
- Seeing a horrifying Xenomorph for the first time.
- A terrifying Xenomorph coming within **Adjacent** range, even if seen before.
- Witnessing another PC suffer certain panic responses.
- A truly horrifying event (GM).
- Many creature signature attacks force an "immediate panic roll".
- **While broken, you gain no stress and never make panic rolls** (p.68).

### Panic roll (p.72–73)
Roll **D6 + stress level − Resolve**:

| Result | Response (summary) |
|---|---|
| ≤0 | Keeping Cool |
| 1 | Spooked: +1 stress |
| 2 | Noisy: nearby enemies alerted |
| 3 | Twitchy: immediate supply roll (air/ammo/power, GM picks) |
| 4 | Lose Item: drop weapon/important item (quick action to pick up in combat) |
| 5 | Paranoid: cannot give or receive help until panic ends |
| 6 | Hesitant: automatically gets initiative card #10 until panic stops |
| 7 | Freeze: lose next turn and interrupts |
| 8 | Seek Cover: interrupt, dive to full cover (if cluttered), −1 stress, lose next turn. In an open zone → Scream |
| 9 | Scream: lose next turn, −1 stress, **every friendly PC in the zone makes a panic roll** |
| 10 | Flee: interrupt move to an adjacent zone, −1 stress, friendly PCs in the starting zone +1 stress. Must keep fleeing to a safe place. If you can't move → Catatonic |
| 11 | Frenzy: attack the nearest person/creature, friend or foe, until someone is broken. Friendly PCs in the zone make panic rolls |
| 12+ | Catatonic: collapse, can't move until panic stops |

- **Stacking**: if already panicking and forced to roll again, suffer both responses if they can combine, otherwise the higher. Rolling the same response again → use the next higher one.
- **Stopping panic** (non-immediate effects persist until one of these): another character in speaking range (comms count) makes a **COMMAND roll** (full action in combat), you are broken, or **one stretch passes**.
- Panic can *reduce* stress (Seek Cover, Scream, Flee each −1).
- Talent interaction: *Overkill* (Colonial Marine) lets you ignore a 9+ panic result and instead attack every turn with no cover, dodge, or defend. All other PCs in the zone roll panic.

### Relieving stress (p.73)
- **Per stretch (5–10 min) resting in a safe area: stress −1, and remove one stress response per level reduced.** No skill rolls while resting, and an interruption voids that stretch.
- *Banter* (Marine): −2 per stretch for you and everyone at Short range. *Counselor* (general): MANIPULATION roll, each success = one extra step for another PC.
- **Naproleve** (p.98): reduces stress to **zero**. Extra doses in the same shift give −1 die to all rolls.
- Critical injury #11 *Focused*: relieve all stress.
- GM guidance (p.155): deliberately give calm periods, then strike again.

### Mental Trauma (p.74)
- If you rolled **9+ on a panic roll** during the session → after the session make an **Empathy attribute-only roll** (no push). Failure → D66 on the Mental Trauma table.
- Representative entries: 11–13 Confused (−1 Wits rolls). 14–16 Apathetic (can't push). 24–26 Obsessive (must push everything). 31–32 Overwhelmed (Resolve −2). 45–46 Phobic (contact = panic roll). 55–56 Flashbacks (+1 extra stress whenever you gain stress). 61–62 Panic Attacks (any panic result 1+ triggers a post-session trauma roll). 63 Violent (panic 8+ → Frenzy; the book's text cites "#14", which is a misprint for #11). 66 Personality Split.
- **Healed only during shore leave** in campaign play (Recover activity: Empathy roll, success removes one trauma, p.257).

### Space combat stress/panic variant (p.144)
- Stress rises only from pushing, stress effects, and **your ship suffering minor component damage**. No stress relief during an engagement.
- Panic triggers: major component damage or ship disabled, or another PC Bailing Out.
- **Space Panic table**: ≤0 Keeping Cool, 1–6 Spooked (+1 stress), 7–8 Freeze, 9–11 Bail Out (run for the EEV; all other PCs aboard roll panic), 12+ Catatonic. Effects last until the end of the engagement.

### Solo mode variant (p.298–300)
- Same stress table. Modified panic triggers. Solo Panic table swaps 5 → *Indecisive* (check danger timers) and removes the "other PCs roll panic" riders.
- Stopping panic solo: Empathy roll, +2 base dice and +1 stress die if a survivor timer is active.

---

## 4. Characters

### Creation steps (p.24)
1. Career
2. Attributes
3. Skills
4. Career talent
5. Name
6. Appearance
7. Personal agenda
8. Buddy & rival
9. Gear + signature item
10. Cash

Cinematic play uses pregenerated PCs. The life path method is an alternative (p.282).

### Attributes (p.25)
- **Strength, Agility, Wits, Empathy**, scale 1–5.
- **14 points**, each attribute 2–4, except the career **key attribute** which can be 5.
- Random option: roll 4D6, re-roll 1s and 6s, assign.
- **Androids**: +3 to two attributes after the 14 points (max 8 key / 7 other). Can't push. No stress or stress level. Never panic. Immune to fatigue, vacuum, cold, and disease. Critical System Damage table instead of crits. Repaired by a shift + COMTECH instead of healing. A secret android can fake stress and panic rolls.

### Derived stats
- **Health = (STR + AGI)/2, rounded up** (p.26, p.67). *Hardened* gives +1, up to three times.
- **Resolve = (WIS + EMP)/2, rounded up** (p.26).

### Skills (p.26, p.42, p.46–47)
- 12 skills, levels 0–5. **10 points at creation**. Career skills start at up to 3, others up to 1.
- STR: Heavy Machinery, Stamina, Close Combat
- AGI: Mobility, Piloting, Ranged Combat
- WIS: Comtech, Observation, Survival
- EMP: Command, Manipulation, Medical Aid
- **Manipulation negotiating position** (p.47): +1 die each for more people on your side, request costs them nothing, opponent damaged, well presented, prior help. −1 die each for them having more people, a valuable or dangerous request, nothing for them to gain, a language barrier, or radio/shouting. "Not mind control."

### Careers (p.31–39)
Each career gives a key attribute, three key skills, a cash roll, a D3 talent list, D6 names, D6 appearance picks (choose two), a D3 personal agenda, D6 gear (choose or roll two), and a D3 signature item.

| Career | Key Attr | Key Skills | Talents |
|---|---|---|---|
| Colonial Marine | STR | Close Combat, Stamina, Ranged Combat | Banter, Overkill, Precise Shooter |
| Colonial Marshal | WIS | Observation, Ranged Combat, Command | Authority, Investigator, Subdue |
| Company Agent | WIS | Comtech, Observation, Manipulation | Company Resources, Cunning, Personal Safety |
| Kid | AGI | Mobility, Survival, Observation | Hard to Catch, Lucky, Nimble |
| Medic | EMP | Mobility, Observation, Medical Aid | Field Medic, Nurse, Surgeon |
| Officer | EMP | Ranged Combat, Command, Manipulation | Field Commander, Frontline Leader, Pull Rank |
| Pilot | AGI | Piloting, Ranged Combat, Comtech | Full Throttle, Like the Back of Your Hand, Reckless |
| Roughneck | STR | Heavy Machinery, Stamina, Close Combat | Resilient, Steady Hands, True Grit |
| Scientist | WIS | Observation, Survival, Comtech | Analysis, Inquisitive, Xenomorphology |

**Book inconsistency**: in the talent chapter (p.50), the Kid talents are listed under "Roughneck" and the Roughneck talents under "Kid". The career pages (p.34, p.38) are the authoritative assignment and match the table above.

### Talents (p.48–51)
- **Binary** (you have it or you don't). **Career talents** are restricted to their career. **General talents** are open to anyone. Start with 1 career talent.
- Representative mechanical patterns:
  - **+2 dice to a narrow use**: Field Medic, Investigator, Hard to Catch, Surgeon, Haymaker (sacrifice quick action), Weapon Specialist, Gunner, Menacing.
  - **Push twice**: True Grit, Nimble, Inquisitive.
  - **Pay stress for an effect**: Company Resources (produce an item), Personal Safety (redirect an attack), Pull Rank, Reckless, Quick Shot.
  - **Action economy changes**: Field Commander (orders as quick action), Martial Arts (unarmed quick attack at −2), Rapid Fire (pistol quick action at −2), Bodyguard (quick action to take a hit).
  - **Initiative**: Combat Veteran (keep last round's card), Fast Reflexes (draw 2, keep 1).
  - **Supply**: Precise Shooter / Calm Breather / Tech Savvy (roll 2 fewer supply dice).
  - **Survival**: Resilient (roll STR attribute, each success negates 1 damage), Lucky (re-roll death/crit roll), Survivor (+2 death rolls), Last One Standing (self-rally with STAMINA), Second Wind (+2 for others rallying you).
  - **Stat bumps**: Hardened (+1 Health ×3), Seen It All (+1 Resolve ×3).
  - **Stealth**: Stealthy (others −2 OBSERVATION; groups only benefit if everyone has it).
  - **Info-gathering**: Analysis (each success = one question to the GM; success −1 stress to nearby PCs, failure +1), Xenomorphology (learn a weakness; failure +1 stress).
  - **Ship roles**: Sensor Operator, Spaceship Commander, Spaceship Mechanic, Navigator, EVA Specialist, Zero-G Training.

### Personal agenda, buddy, rival (p.27)
- **Cinematic**: the GM hands out a **new hidden agenda per act** (three acts). Acting on it → **1 story point** at the end of the act.
- **Campaign**: pick or write an agenda. At session end, concrete action on it "despite risk or cost" → **bonus XP**.
- **Buddy & rival**: one each among the other PCs. Chosen in campaign play, assigned in cinematic. Can be changed after any session (p.30). They feed the XP questions.
- **PvP** (p.27, p.158): in cinematic play the GM "calls PvP". The conflict plays out, then a surviving traitor PC becomes an **NPC** and the player takes a new PC if available. Recommended only in Act III. In campaign play it's resolved socially with no rules.

### Gear & signature item (p.27–28)
- Campaign: career gear pick of two plus cash. Every weapon comes with 2 full reloads.
- **Signature item**: a tiny sentimental item with no practical use (e.g. dog tags, a photo). Purely characterization.

### Life path alternative (p.282–288)
- Steps: human/android (2D6 11–12 = android) → Origin (2D6 supernation, 3 random general skill points) → Early Life (D66 ×3, +2 attributes, +2 skills) → Life Event (+2 attributes, +2 random skills) → +2 attributes of choice → **apply to a career** (skill roll, no push. Fail = rejected unless you "pull a fast one" and owe a favor. 2+ successes = Favor) → **1–3 career terms** (each: posting D6, performance roll: fail = Disaster, 2+ = Favor; random career talent, gear, paycheck. Each extra term costs −1 attribute) → **Psych evaluation** 2D6 with accumulated modifiers → final touches.
- Humans start at 2 in each attribute, cap 5, skills cap 5. Can produce unbalanced PCs.

---

## 5. Health, damage, critical injuries, death, conditions

### Armor (p.67)
- Armor level is **subtracted from damage**. Only one suit can be worn.
- **Armor piercing**: armor counts 1 lower (min 0).
- **Weak spot**: −2 dice to the attack, armor −1 more on a hit (stacks with AP).
- Example suits (p.90): M3 Personnel Armor 2. Kevlar Riot Vest 1. IRC Mk.35 Pressure Suit 1 (air 4, −2 MOBILITY). Eco All-World Survival Suit 2 (air 6). W-Y APEsuit 1 (armor 3 vs acid, blocks facehugs, SURVIVAL +2). P-5000 Power Loader 1 (+3 HEAVY MACHINERY/CLOSE COMBAT, base damage 3).

### Barriers (p.68)
- Furniture 1, inner bulkhead 2, outer bulkhead 3, armored bulkhead 4+. A typical door: armor 2, 10 damage to break.
- **Breach limit (barriers and vehicles only)**: if armor level > weapon base damage (after modifiers), it cannot be breached no matter how many successes.
- **Collateral damage**: a missed shot that could breach a critical barrier → GM rolls a stress die. A 1 means it's breached.

### Weapon damage scale (p.82–)
- Unarmed base damage 1. Most pistols damage 2, ammo 2.
- M41A Pulse Rifle: +2, damage 2, range S/L, ammo 3, armor piercing, full auto, grenade launcher.
- M240 Incinerator: +1, damage 2 (fire), range S/S, ammo 2. Targets it hurts burn at intensity 9.
- Explosive weapons have an **E** tag. Stun weapons use the stun rules.

### Health & broken (p.67–69)
- At **0 Health you are broken**: immediately roll a critical injury. While broken you can take **one move action per round**, no other actions, gain no stress, and make no panic rolls. Health can't go below 0, but **further damage = another critical injury**.
- **Getting up**:
  - **First Aid**: an Adjacent character makes a MEDICAL AID roll (full action, gear bonuses). Success un-breaks you and restores **1 Health per success**; it also stabilizes lethal crits.
  - **Rally**: anyone in the same zone makes a COMMAND roll (**quick action**). Success un-breaks you with 1 Health per success; no effect on crits.
  - **On your own**: after 1 stretch you get up with 1 Health.
- **Recovery**: 1 Health per stretch resting in a safe area (even with crits), unless fatigued. First aid and rally only restore Health while broken.
- NPCs can be broken the same way. Minor NPCs may just die (p.69).
- **Instant death**: crits 64–66, some signature attacks, or **damage from a single instance ≥ 2× max Health** (p.71).

### Critical Injuries table (p.70)
- **Roll D66 on reaching 0 Health.** Re-roll duplicates of #14 and above.
- **Columns**: D66 | Injury | Lethal (Yes/No) | Time Limit (– / Shift / Stretch / Round) | Effect | Healing Time (days: –, Shift, D6 … 4D6).
- **Structure by band** (severity rises with the roll):
  - 11–13 trivial (Focused: relieve all stress. Winded: none. Intense Pain: +1 stress).
  - 14–43 non-lethal impairments: movement becomes a full action, or −1 to −3 dice on specific skills. Some require surgery. Healing ranges from a shift to 3D6 days. #43 Traumatized → roll Mental Trauma.
  - 44–52 **lethal, time limit Shift**: Punctured Lung, Bleeding Gut (1 damage per MOBILITY/CLOSE COMBAT roll), Infected Wound, Cracked Skull, Cracked Spine (paralyzed, 4D6).
  - 53–56 **lethal, time limit Stretch**: arterial bleeding (arm/leg), Severed Arm or Leg (surgery + prosthesis, 4D6).
  - 61–63 **lethal, time limit Round**, with STAMINA penalties on death rolls: Ruptured Jugular (−1), Internal Bleeding (−2), Massive Hemorrhage (−3, surgery).
  - 64–66 **instant death**: Disemboweled, Crushed Head, Impaled Heart.
- **Death roll** (p.68, p.71): after each time limit passes (if the limit is Round, every turn right after you act), roll STAMINA. It's not an action, can't be pushed, and uses no stress dice. Failure = death. **Three successes on your own = survive.**
- **First aid on a lethal crit**: full action MEDICAL AID. Success = stabilized. **Failure = the time limit worsens one step** (Shift → Stretch → Round → dead). Self-aid is possible at −2 if not broken.
- **Surgery**: 1 shift + MEDICAL AID roll before healing starts. **Healing**: the effect lasts through the healing time. Crits heal simultaneously. The *Nurse* talent doubles days. You can be at full Health while still suffering crit effects.

### Stun damage (p.71)
- No Health loss. STAMINA roll at −damage; failure = no actions until next turn. Re-roll each turn until you succeed. Pushable. Armor applies.

### Android Critical System Damage (p.78)
- D6: Ruptured Fluid Pump (lose turn), Destroyed Leg Servos, Destroyed Arm Servos, Head Dislocation (quick actions become full), Severe Chassis Breach (immobile), System Shutdown.
- Keeps operating until #6. Duplicates shift up one step.

### Conditions & hazards (p.75–77)

**Fatigue** (the umbrella condition for lack of air, water, food, or sleep, and for extreme cold/heat):
- Make SURVIVAL rolls at an interval. First failure → **fatigued**.
- While fatigued: no Health recovery. Keep rolling at the same interval; each failure is 1 damage + 1 stress.
- Broken by fatigue → no crit, but death rolls at that interval. First aid doesn't help; only removing the cause does.
- Intervals:
  - **Suffocation / underwater**: every round.
  - **Hunger & thirst**: after 24 h without food and water, once per shift.
  - **Sleep deprivation**: after 24 h awake, once per shift. Broken → pass out for a shift, no death rolls.
  - **Heat & cold**: GM-set interval (day, shift, stretch, or round).
  - **Hypersleep**: automatically fatigued until one shift awake plus a meal (or Hydr8tion).
- No separate "starving/dehydrated/exhausted/freezing" conditions. All of these route through fatigue.

**Vacuum**: +1 stress per round. SURVIVAL roll before acting, with a cumulative −1 per round. Failure → 0 Health and death rolls every round until you escape. Donning a suit fast is a full action + MOBILITY.

**Explosive decompression**: air vents at 1 stretch per zone. SURVIVAL roll to act each turn. Deliberately shooting the hull: +2 dice.

**Falling**: damage = meters ÷ 2 (round down). A controlled jump uses MOBILITY, each success −1 damage. Armor doesn't help.

**Zero-G**: −2 dice to CLOSE COMBAT, HEAVY MACHINERY, MOBILITY, RANGED COMBAT. Every move needs a MOBILITY roll; failure = spin in place and +1 stress.

**Explosions**:
- Explosive weapon hit → everyone in the zone takes the same damage (each can dodge). A miss hurts no one.
- Secondary targets in partial cover count as full cover. Firing into an enclosed zone: +2 dice.
- **Placed explosives**: roll dice equal to Blast Power, base damage = Blast Power ÷ 3 (3 → 1, 6 → 2, 9 → 3, 12 → 4). Everyone in the zone takes it; cover gives full barrier armor.

**Fire**:
- Intensity 6–9. Entering or starting a round in a burning zone → roll intensity in base dice; each success = 1 damage (armor applies).
- Damaged → you catch fire and roll each round until a roll deals no damage. A MOBILITY full action puts you out.
- Broken by fire → death roll each round.
- Spread each round: D6 1–2 goes out, 3–4 continues, 5–6 spreads to an adjacent zone.

**Disease**: passive STAMINA roll minus virulence. Usually causes fatigue-style repeated STAMINA rolls per shift. MEDICAL AID can roll instead.

**Radiation**: gain rads (weak = 1/shift, strong = 1/stretch, extreme = 1/round). Each new rad → roll dice equal to total rads, each success = 1 damage. Broken → death rolls. Heal 1 rad per shift after leaving.

---

## 6. Combat structure

### Time & space (p.54–55)
- **Round** 5–10 s (combat). **Stretch** 5–10 min (stealth, rest). **Shift** 5–10 h (repairs, travel, healing).
- **Zones**: a room, corridor, or patch of ground, up to about 25 m. Each is **Cluttered** (can hide or take cover) or **Open** (can't).
- Borders are open or blocked (door/hatch). Everyone in a zone has line of sight except hidden characters or those in full cover. In crawlspaces, other bodies block line of sight.
- **Range bands**:
  - **Adjacent**: in your face.
  - **Short**: same zone.
  - **Medium**: adjacent zone.
  - **Long**: up to 4 zones.
  - **Extreme**: farther.

### Stealth mode (p.55–58)
- Played in **stretches**. PCs move **one zone per stretch** (scan, get a superficial description). Searching a zone may take several stretches or a shift.
- **The GM moves NPCs secretly on a hidden map after the PCs move.** Human NPCs move 1 zone. **Xenomorphs move 1 zone per point of Speed.** Enemies are Active (stalking) or Passive (stationary until alerted).
- **Detection**: on line of sight, a **passive open opposed OBSERVATION roll** (no push, no stress response; groups use their best roll).
  - Winner chooses one: **reveal themselves, ambush, hide in the zone (free), or back out** (immediate, free).
  - **Tie** → draw initiative.
- **Keeping guard**: stationary a whole stretch → +2 OBSERVATION.
- **Hiding**: cluttered zone only, takes one stretch. Enemies entering don't roll opposed; they must **actively search** for a stretch with OBSERVATION (each success reveals one hidden thing).
- A hidden character who acts (moves out, interacts, ambushes) → opposed OBSERVATION against every enemy in line of sight.
- **Darkness**: −2 OBSERVATION for humans and androids. Xenos unaffected. A flashlight removes the penalty.
- **Crawlspaces**: enter at access points. Open zones (no hiding or cover), and you can't pass others.
  - Sealing an access point: cutting torch + HEAVY MACHINERY (full action, 1 attempt per stretch). **Xenos can't break a seal**, but acid burns through a crawlspace floor in one stretch.
- **Motion tracker**: once per stretch after a power supply roll. Detects all NPCs within 4 zones (M314) **that moved last stretch**. A ping isn't a sighting.
- **Social mode**: talking or resting pauses stealth mode. The GM estimates the stretches elapsed and moves NPCs accordingly.
- **Simplified stealth**: skip the hidden map, and NPCs and pings appear when the GM chooses.

### Initiative (p.59)
- **10 cards numbered 1–10**. Each PC draws **every round**; the GM draws for NPCs (optionally one card per NPC group). Lowest acts first.
- Optional: draw only in round 1.
- **Xenomorphs draw one card per point of Speed** (multiple turns per round).
- **Surprise**: the attacker gets card #1 in round 1; multiple attackers get the lowest cards.
- **Ambush** (attack on an unaware target): lowest cards, **+2 dice to the initial attack(s)**, and the target **can't defend or dodge**. A xeno ambush gives only its first turn card #1.
- **Holding off**: on your turn, swap cards with anyone later in the order. They can't refuse and act immediately. "On your turn" effects (death rolls) move with the card. Spent interrupt actions stay spent. When swapping with a multi-card xeno, you choose which later card to take.

### Action economy (p.60–61)
Per round: **1 full action + 1 quick action, or 2 quick actions** (two quick actions forfeits the full). Actions reset each round and can't be banked.
- **Full actions** (examples): close combat attack, ranged attack, jump/climb (MOBILITY), take full cover, interact with a terminal (COMTECH), use machinery, first aid, clear a jam, persuade, **give orders** (COMMAND), drive (Piloting). Full actions happen on your turn only.
- **Quick actions**: move to an adjacent zone, move between Short and Adjacent within a zone, move to a door and peek, lock a door, take partial cover, **defend** (interrupt), **aim**, **dodge** (interrupt), reload, pick up an item, **rally** a broken character.
- A quick action can be saved for an interrupt later in the round.
- **Giving orders**: COMMAND roll, each success = +1 die to one roll by the ordered character later **this round**, only for carrying out that order.
- **Movement**: doors pass free. Locked doors: close combat with +2 vs armor 2 / 10 HP, or COMTECH (full). **Blocking** (a 2 m cylinder) forces a Pass special attack. Dragging someone: STAMINA roll.
- **Leaving combat**: break line of sight; opponents roll OBSERVATION (no action). If they fail → back to stealth mode.

### Close combat (p.62–64)
- CLOSE COMBAT at **Adjacent**, full action. A hit = weapon base damage + 1 per extra success.
- **Defend**: quick-action interrupt declared before the attacker rolls. Opposed CLOSE COMBAT, each defender success cancels one attacker success. Requires an unspent quick action.
- **Special attacks** (declared before rolling, no weapon bonus, can be defended, no damage):
  - **Disarm**
  - **Pass** a blocker
  - **Shove** to Short range (through doors)
  - **Grapple**: the victim can only try to break free (full action, opposed CLOSE COMBAT; xenos use MOBILITY). The grappler can only make undefendable unarmed grapple attacks.
- **Restrained or unaware** targets: +2 dice, and they can't defend.
- **Firearms in melee**: use CLOSE COMBAT, with the minimum-range penalty.

### Ranged combat (p.64–67)
- RANGED COMBAT, full action, needs line of sight. A hit = base damage + 1 per extra success, **or spend one extra success to skip the ammo supply roll** (not allowed for single-shot weapons).
- **Modifiers**: careful aim +2 (quick action, Short+, immediately before the shot), below minimum range −2 per band (not vs unaware or restrained targets), target in partial cover −2, full cover −3 (and the shot must penetrate the barrier), weak spot −2, large target +2, small target −2.
- **Dodge**: quick-action interrupt, MOBILITY, opposed cancellation. Only if you're aware of the attacker. Not possible from full cover.
- **Cover**: only in cluttered zones or by a door.
  - Partial = quick action, −2 to hit you, you can still dodge.
  - Full = full action, breaks line of sight, −3 plus barrier armor, no dodging.
  - Cover applies before body armor. Direction is abstracted.
- **Friendly fire**: a miss against a target Adjacent to someone else → roll 2 base dice against them (1 success = base damage, 2 = +1).
- **Ammo**: a supply roll after each attack. Reload is a quick action; reloads are tracked.
- **Full auto**: after a hit **without pushing**, you may roll another attack (same or new target), up to **3 rolls per action**. It ends on a miss or push. **Each roll after the first = +1 stress.** An ammo roll after every attack roll; no ammo conservation. Aim applies to the first roll only. *Machinegunner* removes the stress.

---

## 7. Creature rules

### Xenomorph combat rules (p.208–209)
- **No attributes.** Skills only (typically Mobility, Observation), **rolling dice equal to the skill level**, which can far exceed human ranges. **Never push.**
- **Speed**: turns per round = Speed, with one initiative card each. **Each turn = one signature attack OR move** (no full/quick split).
- **Signature attacks**: **roll D6 on the creature's table.** Re-roll if it's the same attack twice in a row. The GM may override the roll for narrative. Default range Adjacent.
- **Attack dice are fixed per table entry** (e.g. "ten base dice, base damage 2, armor piercing"), not derived from skills.
- **Movement**: every signature attack includes a free Short → Adjacent move. Alternatively, **move 2 zones** (or 1 zone + Short → Adjacent) instead of attacking.
- **Never dodge or defend.** Their signature attacks **can be defended** against unless stated otherwise.
- **Grappled xenos** spend every turn breaking free (MOBILITY vs CLOSE COMBAT).
- **Armor**: a natural armor level, often lower vs fire (e.g. "2 (1 vs fire)"). The Charger has directional armor.
- **Stun**: immune unless stated; otherwise resist with MOBILITY.
- **At 0 Health, not "broken"**. Roll **D6 on the Broken Xenomorph table** (Facehuggers/Chestbursters are simply destroyed):
  1. Rise Again: fakes death, regains 1 Health next turn.
  2. Wounded: Speed −1, +1 Health, D6 1–3 each turn → tries to leave combat.
  3. Desperate Escape: +1 Health, immediately moves 2 zones out of turn order.
  4. Last Breath: one final signature attack next turn, then dies (dies instantly if hit again).
  5–6. Torn Apart: dead.
- **"Aliens mode"** (optional): at 0 Health a xeno simply dies, for mass-bug-hunt play.
- **Recovery**: **one stretch immobile → all lost Health recovered.**
- **Stealth**: moves Speed zones per stretch. Unaffected by darkness.

### XX121 special abilities (p.210)
- **Acid Splash** (any non-fire damage):
  - Roll base dice = **Acid Splash rating + damage taken** (capped at max Health) against **every Adjacent target and the floor**. Base damage 1.
  - Armor reduces the damage, but **each point of acid damage permanently lowers the armor level by 1**.
  - Any damage dealt (even if absorbed) → re-roll at the start of each round with **half the dice (round up)** until no damage.
  - It can burn through floors or decks.
- **Immune to cold and vacuum**, doesn't need to breathe. **Radiation counts two levels lower.** Unaffected by darkness.

### Representative stat blocks (Speed / Health / Mobility / Observation / Armor / Acid Splash)
- Ovomorph 0/2/–/–/0/4. Queen's Egg 0/3/–/–/1 (0 vs fire)/5 (p.212). Opens when a potential host is within Short: stress die each round, a 1 = Facehugger. At Adjacent: MOBILITY roll or it's disturbed.
- Facehugger 2/2/8/7/1 (0 vs fire)/4. Royal Facehugger 2/3/8/8/2 (1)/5 (p.212). **Swarm Speed** by count: 1–2 → 2, 3–5 → 3, 6–10 → 4, 11–20 → 5, 21+ → 6. Each still dies individually.
- Chestburster 2/2/8/4/0/4. Queenburster 2/3/8/8/1 (0)/5 (p.216). Birth forces panic in witnesses.
- **Drone 2/7/8/8/2 (1 vs fire)/8**. Scout 2/5/10/10/2 (1)/8. Stalker 2/9/9/6/2/8 (p.217). Drone *Silent Assassin*: −2 to spot it. Stalker *Feral Hunger*: a damaging attack triggers a free 8-dice follow-up.
- **Soldier 2/8/8/8/2 (1)/10**. Worker 1/4/4/4/1 (0)/6. Sentry 2/8/12/10/2 (1)/10 (p.219).
- **Praetorian 2/12/5/8/3 (1)/10**. **Charger/Crusher 1/20/4/5/5 front (3 vs fire), 3 other (1 vs fire)/10**. **Queen 2/18/6 (0 when attached to egg sac)/12/4 (2)/10** (p.220).
- Neomorphs (p.224): Bloodburster 3/2/9/5/0. Neophyte 3/4/10/6/1 (0). Adult 2/6/9/8/1 (0). **No acid.** *Sprint* (+1 zone when moving). Adults die naturally within about 4 shifts.
- Other species (p.227–231):
  - **Harvester**: Speed 1, Health 15, Mob 4, Armor **5 (2 on underbelly)**. Six-meter burrower. Juveniles 1/4/8/1 detach to defend. *Hidden Behemoth* surprise attack from under the ground.
  - Lion Worm 2/8/Mob 10/Obs 8/1.
  - Tanakan Scorpionid: land 1/5/6/6/1 (0 vs firearms), water 3/5/10/10.
  - **The Swarm**: Speed = zones covered, Health = 5 × zones, **cannot be killed, only driven off** (Health 0 = leaves). Impervious except to fire, explosions, electricity.

### Signature attack tables: structure (D6, escalating lethality)
The typical shape across every creature table:
- **Low results = terror, not damage**: e.g. Hypnotizing Gaze (+1 stress + panic), Playing With Its Prey (knockdown, drop item, panic), Skittering Menace, Call For Reinforcements, Sonar Sweep, Intimidating Display (retreat).
- **Middle = control and positioning**: Deadly Grab (8 dice, drag the victim to an adjacent zone), Ready To Kill (10 dice, grapple, next turn auto-Headbite, all friendlies panic), Capture For The Hive (paralysis venom), Tail Grapple (D6 sub-table), Pinned Down, Frenzy (zone-wide knockdown, 1 damage, panic, dodgeable), Stampede (zone-wide 8 dice).
- **High = killing blows**: Tail Spike (10–12 dice, damage 2, AP). **Headbite** (9–11 dice, damage 2, AP, **any damage to a human = instant death**). Beastly Bite (any damage = automatically broken). Final Embrace (8 dice, ignores armor, facehugged). Pulverize (Harvester, any damage = death). Death Roll (Lion Worm constriction loop).
- **Chaining / telegraphing**: many results set up the next attack against the same target with +1/+2 on the D6, or force a specific next attack (Face Grapple → Final Embrace, Ready To Kill → Headbite). This is visible to players as a countdown they can respond to.
- **Escape results**: Chestburster/Bloodburster 1–3 Escape (flee into ducts, stealth resumes). Lion Worm retreat. Scorpionid Retreat.
- **Area effects**: Frenzy, Stampede, Sonar Pulse (STAMINA or lose turn), Acrid Pheromones.
- **Summons**: Call For Reinforcements / Call The Guard (D3 Sentries or Soldiers arrive next round).
- **Charge** (Charger/Queen/Harvester): base damage 4/2/3, AP, can be dodged but **not defended**, continues into the next zone.
- **Swarm table** self-heals (Consume +2 Health), self-escalates (Pheromones +1 to the next roll), degrades armor (Desperate Hunger: damage subtracts from armor level), and focus-fires with a repeat-until-it-fails loop (Stripped To The Bone).

---

## 8. GM-facing structures

### Game modes (p.18, p.157–159)
- **Cinematic play**: a single-session, three-act "film".
  - Pregenerated PCs with **secret per-act agendas** and story points. Most PCs are expected to die. PvP is likely.
  - **Adventure structure** (p.157): What's the Story Mother (read-aloud) → The Situation (GM truth) → Characters (PCs with agendas per act, NPCs) → Locations (map-based) → **Acts & Events**: Act I Setup, Act II Tilt (stakes rise, secrets revealed), Act III Showdown. Each act has a pool of mostly **optional, standalone events** (some mandatory, some targeted at individual PCs) → Epilogue (a surviving PC's sign-off message).
  - Agenda handling (p.158): agendas for Acts I–II are written to avoid obvious PvP. Avoid secret notes. Call PvP preferably in Act III. Open agendas are an option.
- **Campaign play**: multi-session sandbox.
  - Session zero questions. Campaign focus/theme (D6 table: Killing Greed, Corporate Intrigue, Tidings of War, New Opportunities, Secret Research, Echoes from the Past). Goals & rewards. Home base (Novgorod Station). A starting ship.
  - **Xenomorphs saved for special occasions**; use human and critter enemies otherwise.
- **Campaign frames** (p.234–235): Space Truckers (cargo runs, $400–960/week), Colonial Marines (military missions, orders from HQ, "keep the squad small", PCs as squad leaders), Frontier Colonists (expeditions). Employees vs freelancers. A ship is recommended.
- **Job generators** (p.244–251): D66 Employer/Sponsor, Bonus Reward, Goods/Mission, Destination, Complication, plus a D66 **Plot Twist** (p.252). Advice: always keep 2–3 jobs generated.
- **Encounter tables** (p.252–256): star system encounters with a 2D6 ship reaction, surface encounters (3D6 uninhabited vs colonized world), colony location encounters (D66 per area type).
- **Star system and world generators** (p.236–243).
- **Shore leave** (p.257): per week each PC picks **Heal / Recover (Empathy roll, remove one mental trauma) / Pursue Agenda (+1 XP) / Socialize (D66 events)**. Pay living expenses.
- **NPC quick stats** (p.258): about 30 archetypes with attribute arrays. NPCs typically have 14 attribute points, skill 2 = competent, 3–5 = expert, usually no talents. Each needs Name / Appearance / Trait / Goal.

### GM principles & horror pacing (p.152–155)
- **8 principles**: Use the Films, **Limit Resources**, **Stay In The Shadows**, **Increase The Pressure**, **Let Them Breathe**, **Fuel Their Agendas**, **Bring Horrible Death**, Reveal The Universe.
- **Three themes**: Space Horror, Sci-Fi Action, Sense of Wonder (each with sub-themes).
- **Stress as the GM's main horror tool**: most stress is self-inflicted by PC choices (pushing), so the GM "just needs to introduce a terror".
- Horror tools: Fear of the Unknown, Loss of Control, Horrible Choices.
- **Three stages of fear**: Dread (seeds, use often) → Terror (imminent, most effective) → Horror (the reveal, when mechanics take over; use rarely and late).
- Splitting the team: cut back and forth.

### GM resource economy
- **The core rules have no GM currency or point pool.** Pressure comes from:
  1. PC stress/panic (player-driven)
  2. Supply ratings (air/ammo/power dice)
  3. Countdown timers as supply rolls
  4. The hidden map and xeno Speed
  5. Signature attack tables
  6. Hidden agendas and PvP
- **Agenda "cards" are handouts**, not a card economy. Physical card decks (initiative, stress and panic response cards) are Starter Set accessories.
- **Solo "Last Survivor" rules (p.291–307)** contain the book's only clock/timer economy:
  - **Danger Timer**: the event proximity steps Remote (6 stress dice) → Distant 5 → Approaching 4 → Soon 3 → Looming 2 → Imminent 1 → Now. Each check rolls that many stress dice; each 1 advances one step. Fewer dice as it nears means it "slows down"; checks happen as time passes. Modifiers: prolonged scenes or creeping +1 die, speedy actions or rushing −1. Triggering one raises the **Danger Level**.
  - **Survivor Timer**: an NPC group's status Unified 6 → Strained 5 → Diminished 4 → Overwhelmed 3 → Desperate 2 → Last Stand 1. Checks roll the status in stress dice plus +2/+3 base dice for expertise. **Each success = success, or 2 damage to enemies. Each 1 = status down a step.**
  - Plus an Objective Timer (progress track), an Encounter Timer, and the MAAM oracle.

---

## 9. Vehicles, ship combat, team roles

### Ground/air vehicles (p.78–79, p.100)
- **Attributes**: Maneuverability (PILOTING modifier), Speed (zones per drive action), Hull (damage before wrecked), Armor. Listings also give passengers and weapons.
- Entering/mounting and starting are quick actions. **Driving is a quick action** (move up to Speed zones); you can drive twice per round.
- **Ramming** = a close combat attack using PILOTING + Maneuverability, base damage = Hull/2 (round up). Vehicle vs vehicle: both take base damage, extra successes only hurt the target.
- **Breach limit** applies (armor > base damage = no damage).
- **Wrecked** at damage ≥ Hull: occupants take 3 damage, minus MOBILITY successes.
- **Component damage** when a single hit ≥ half Hull: D6 Driver Hit / Passenger Hit / Severe Spin (PILOTING or wrecked) / Weapon Disabled / Engine Disabled / Fuel Explosion (intensity 9 fire, destroyed).
- **Exposed passengers** can be targeted separately (partial cover, no vehicle armor).
- **Aerial**: track altitude in zones. Movement splits between vertical and horizontal. A crash deals altitude × 2 damage, minus MOBILITY successes.
- Repairs: HEAVY MACHINERY per shift, each success = 1 Hull.
- Example: NR-9 ATV, Hull 2, Armor 1 (riders exposed), Maneuverability +2, Speed 2.
- Vehicle weapons are fired by crew. The *Gunner* talent gives +2.

### Spaceship combat: the crew-role system (p.140–149)
- **Scale**: stretches, not rounds. **One action per crew member per stretch, tied to their crew position.** No full/quick split.
- **Positions**:
  - **Executive Officer** (COMMAND: initiative, orders)
  - **Navigation Officer** (PILOTING + Thrusters)
  - **Science Officer** (COMTECH: sensors)
  - **Engineers** (HEAVY MACHINERY/COMTECH: repairs)
  - **Gunners** (RANGED COMBAT)
  - One each of XO/Nav/Science, multiple engineers and gunners. Small crews double up. The ship AI can fill any position. PCs can switch positions between stretches.
- **Range track**: a 1-dimensional segment track (−4…+4). Contact (same segment: ram/board), Short (adjacent), Medium (2), Long (≤4), Extreme (≤8, the sensor limit). The engagement ends beyond 8.
- **Approach velocity**: segments moved per stretch, typically 2 to start.
- **Transponders on** → auto-targetable. **Running silent** → needs a Target Lock. **Running dark**: power down sensors (Signature −1) and/or engines (−2); the enemy needs a passive COMTECH roll vs Signature to detect you.
- **Initiative**: one open opposed COMMAND roll by the XOs in the first stretch only. The winner picks act-first or act-last in every phase for the whole fight.
- **Phases per stretch** (all ships act per phase in initiative order):
  1. **Command**: XO rolls COMMAND, each success = +1 die to one crew action this stretch.
  2. **Sensor**: Target Lock (COMTECH modified by the target's Signature, −2 malfunctioning sensors, etc.; lasts the stretch), **Evade** (interrupt: turns enemy locks into opposed rolls), power sensors up/down.
  3. **Movement**: Accelerate or Decelerate (each success ±1 velocity), Ram (Contact: both take Hull/2 base damage), Dock (Contact, equal velocity, docking module). Then all ships move by velocity.
  4. **Attack**: **only one weapon fired per ship per stretch**. Fire (locked target in range, RANGED COMBAT + weapon modifier) or **Launch Countermeasures** (interrupt: enemy attacks become opposed).
  5. **Engineering**: one engineer action per ship (others can help). Emergency Repairs (temporary for a shift, no parts, restores 1 Hull or fixes a component), power engine up/down, Open Airlock (after docking → boarding, regular combat), **Reactor Overload** (self-destruct at the end of next stretch; can be stopped with another roll).
- **Interrupt actions** cost that crew member's own action in the phase.
- **Ship damage**:
  - Armor subtracts. **Disabled** at damage ≥ Hull (systems fail, explosive decompression, repairable).
  - **Per single attack**: ≥1 but < half Hull → **Minor Component Damage (D66)**. ≥ half Hull → **Major Component Damage (2D6)**. **≥ full Hull in one hit → ship destroyed, all dead.**
  - Minor table examples: Air Scrubbers Offline, Armament Malfunction, Compartmental Decompression, Crew Injury (6 dice attack), Sensor Malfunction, Thruster Damage (−2 Thrusters), Coffee Maker Malfunction. Each lists its repair skill.
  - Major table: 2 A.I. Offline … 7 Engine Failure, 8 Critical Crew Injury (random crew broken), 9 Bridge Exposed, 10 Reactor Breach, 11 Chain Reaction (roll twice), 12 Reactor Detonation. Each lists repair rolls such as "2 × HEAVY MACHINERY + COMTECH".
  - Particle beams: countermeasures don't work, −1 damage per range band beyond Contact, component damage only.
- **Repairs**: one roll per shift, one roller (others help). Each HEAVY MACHINERY roll needs a mechanical spare part, each COMTECH roll an electronic one (consumed on success). Scavenging parts from wrecks is possible. EVA is needed for external repairs.
- Worked example of two stretches: p.148–149.

---

## 10. Advancement

### XP (campaign) (p.30)
- Awarded at session end: **1 XP per "yes"**, max 1 per question, consensus or GM decides.
  1. Participated.
  2. Risked or sacrificed something for your personal agenda.
  3. Risked your life for your buddy.
  4. Challenged or stood up to your rival.
  5. **Made a panic roll.**
  6. Overcame a dangerous event (violent or not).
  7. Made a significant discovery or revelation.
  8. Performed an extraordinary action.
  9. Earned money.
- The campaign agenda bonus XP (p.27) and the Pursue Agenda shore leave activity (+1 XP) are additional.
- **Spend only between sessions.**
  - **Skill +1 level costs new level × 5 XP**, one step at a time.
  - **New skill at level 1 costs 5 XP** and requires either succeeding with it unskilled this session or a shift of instruction from someone with level ≥1.
  - **New talent costs 5 XP** (career or general).
- Buddy and rival can change after any session.

### Story points (cinematic) (p.44, p.158)
- See §1. Max 3, +1 per act for following your agenda, one carries to the next adventure.

### Solo
- Solo XP rewards on p.291 (not extracted in detail).
