# Chapter 2, Character Creation: review round 1

Reviewed: `docs/rules/02-character-creation.md`; every file in `data/character/`; the Chapter 2 rows in `data/core/dice-pool.yaml` and `data/core/stress-changes.yaml`; OQ-19 to OQ-32 in `docs/rules/OPEN-QUESTIONS.md`. Checked against `CONTEXT.md`, ADR-0001 to ADR-0015, Chapter 1 (`docs/rules/01-core-rules.md`, OQ-01 to OQ-18), the three Chapter 1 reviews, and the final design review brief and reviews.

Odds below come from Python simulations in the scratchpad (not committed). Lifepath and dice runs use 200k trials; the Graduation Exam uses 50k Squads of four Cadets. The appendix describes the models. A YAML integrity script found all five D66 tables complete (36 results each, no overlaps). Every Talent, entry, tracked value, template, and OQ id resolves, and all nine Squadmate templates' Health and Resolve match the formulas. The Mira example matches the YAML at every step.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

The chapter is complete and closed. Nothing is left unfinished despite the cut-off, no reference dangles, and no rule rests on GM discretion. The Action Catalog, the uncatalogued-action steps, and the Squadmate directing rule all hold up.

Two findings contradict the glossary without being logged:

- The Squadmate action list gives four Catalog entries to one template each, which is exactly the "exclusive permission" a Specialty may never grant.
- Five of the twelve Drives trigger on world states rather than on the soldier acting on the Drive, and four break ADR-0003 item 3's "When I ..." form.

The largest Major is in attribute creation. The Graduation floor makes picking the Specialty whose key attribute is *lowest* the best move: +2 attribute points for 92% of soldiers. Choosing the Why You Enlisted row moves the key attribute distribution by 17 points, which fails OQ-23's own adoption test. Together these undo the distribution OQ-19 reports.

Squadmates out-build new player characters, and promotion out-builds the Lifepath. The Graduation Exam makes Pushing free, and 99% of Exams hit a Chapter 3 Stress Response in a setting with no turns or Positions. Relentless moves both solo ADR-0014 Nape strike targets by 15 to 17 points.

## Findings

### 1. Critical. The Squadmate action list gives Read, Rally, Treat Injury, and Field Repair to one template each, which is exclusive permission by Specialty

**Location:**

- `squadmates.yaml`: `action_list` ("It cannot take any other entry as an action, including through the procedure for actions outside the Catalog") and `templates[].specialty_action`.
- Section 2.10, *Actions*, and section 2.6, "What it never grants is permission. Every soldier can attempt every Action Catalog entry".
- Glossary **Specialty** ("never exclusive permission to attempt anything").
- ADR-0006 ("anyone can attempt any job in the chaos of a Titan Engagement"), and ADR-0010's rejected option of roles.
- OQ-29.

**Problem:** Squadmates are soldiers with a Specialty. Their base list is `help`, `nape-strike`, `body-part-strike`, `break-attention`, `draw-attention`, and `break-free`, plus exactly one `specialty_action`.

- Only a Tactician Squadmate can Read, only a Leader can Rally, only a Medic can Treat Injury, and only an Engineer can Field Repair.
- No Squadmate can take `lift-comrade`.
- The same sentence closes the section 2.9 route that would give an untrained soldier the attribute alone.

So the Specialty decides what a Squadmate may attempt. That is what the glossary, ADR-0006, and the chapter's own section 2.6 forbid. OQ-29 records "the rules applicability list as a whole" as provisional but never notes the contradiction.

The data shows the list was not meant this way. `stat_block.gear_dice` gives every Squadmate a medical kit and a tool kit at Gear Dice 1, and seven of the nine templates can never use either. The glossary's Rally is "an Empathy action", and eight of nine Squadmates cannot take it.

**Scenario:** Round 3, Wooded.

1. Private Brandt is Down at In Reach with a lethal torso Critical Injury and a short time limit.
2. Kessler, a Slayer Squadmate on her Wing, is at the same Position with an unspent action and a medical kit at Gear Dice 1.
3. The only Medic is a player character at Blind Spot, out of reach.
4. Brandt's player tries to direct Kessler to bind the wound or drag her out, and the action list refuses both. So does section 2.9.
5. Kessler strikes a Body Part while Brandt makes her Death Roll.

A player character Slayer standing in Kessler's place could Treat Injury at Wits plus Gear Dice, or Lift Comrade.

**Fix options:**
1. Give every template one list: the base six plus `read`, `rally`, `treat-injury`, `field-repair`, and `lift-comrade`, and delete `specialty_action`. The template Talent already carries the specialization, so a Medic Squadmate still treats with 1 more die than a Slayer.
2. Keep the short list for actions a Squadmate takes with its Talent, and let any Squadmate take the four specialty entries and `lift-comrade` at the attribute alone.
3. If role-locked Squadmates are intended, log it in OQ-29 as a departure. Amend the glossary Specialty entry to apply to player characters, and add a note to ADR-0006, before keeping the list.

### 2. Critical. Five Drives trigger on a state of the world rather than on acting on the Drive, and four break ADR-0003 item 3's "When I ..." form

**Location:**

- `enlistment.yaml` rows `stay-beside-them` ("When my named comrade holds ..."), `pay-it-forward` ("When a comrade who holds my Position ... is Grabbed or Down"), `knowledge` ("When a Focus Titan in my Titan Engagement has a Broken Body Part"), `nothing-left` ("When my Stress is 3 or more"), `the-promise` ("When I have at least 1 Grief"), and `full-belly` ("When I have a Critical Injury that has not healed").
- Section 2.5 ("Every Drive is written as a trigger beginning 'When I ...'").
- Glossary **Drive** ("while acting on it").
- ADR-0003 item 3, and OQ-23.

**Problem:** The glossary lets a Drive shrug off a Fear Roll result "while acting on it". Six of twelve Drives are met by doing something (strike, Read, Help or Cover, hold Blind Spot or On Body, hold Attention, be airborne). The rest are met by a condition the soldier did nothing to create:

- **Knowledge:** a comrade broke a Body Part.
- **Nothing Left:** Stress reached 3.
- **The Promise:** someone died.
- **Full Belly:** the soldier was hurt.
- **Pay It Forward:** met by the very event the glossary gives as the typical Fear Roll trigger, "a Titan seizing a comrade", whenever the victim is within a step.
- **Stay Beside Them:** met by where the comrade is, not by what the soldier does.

Four Drives also do not begin "When I ...": Stay Beside Them, Pay It Forward, Knowledge, and Nothing Left. Section 2.5 says every Drive does.

OQ-23 says the three tests make "while acting on it" checkable. It does not record that the `state` test drops the acting, so this is an unlogged departure. The tests also spread the payoff very unevenly:

- Pay It Forward is met on nearly every Grab near the soldier.
- The Promise cannot trigger until the first death, and stays met until Downtime clears Grief.
- Full Belly's trigger has nothing to do with its enlistment reason ("three meals a day and a bed").

**Scenario:** A Titan Grabs Wendt, and the Fear Roll trigger fires for witnesses.

- Private Hale (Nothing Left, Stress 3) has sat at Distant on horseback for two rounds and done nothing. He shrugs off the result.
- Private Voss (Duty) spent her action Helping the Nape strike that set the Titan off. She is also shrugging it off, having paid for it.
- Private Roe (Pay It Forward) shrugs it off automatically, because Wendt is On Body and Roe is at Blind Spot one step away.

Only Voss acted on anything.

**Fix options:**
1. Rewrite the state Drives as acts that fit their reasons:
   - Knowledge: "When I made a Read or a Body Part strike on my most recent turn".
   - Nothing Left: "When I Pushed a roll since the start of my most recent turn".
   - The Promise: "When I Helped or Covered a comrade since the start of my most recent turn".
   - Pay It Forward: "When I took Break Free on a comrade's behalf, a Body Part strike on the hand that holds them, or Lift Comrade on my most recent turn".
   - Full Belly: "When I hold my Position while a Titan has my Attention and I am injured".

   Reword all four remaining triggers to "When I ...".
2. If state triggers are wanted, amend the glossary Drive entry to "while its trigger is met" and ADR-0003 item 3's example form, then log the change and the payoff spread in OQ-23.
3. Keep `state` only for states about the soldier's own position or target (Blind Spot, On Body, holding Attention, airborne), and drop the Grief, Stress, injury, and Titan-state triggers.

### 3. Major. The Graduation key attribute floor makes the Specialty whose key attribute is lowest the best choice

**Location:** Section 2.2, *How the Lifepath sets attribute ratings*, step 4; section 2.3.4 steps 2 and 3; `attributes.yaml` `creation.graduation.key_attribute_floor`; OQ-19 ("choosing the Specialty afterwards makes those rolled strengths matter").

**Problem:** The floor raises the key attribute to 4 if it is lower, and the Specialty is chosen after every point has landed. The six attributes total 18 before Graduation, and the lowest is 2 for almost every Cadet.

A player who picks the Specialty whose key attribute is their lowest gains 2 free points and keeps their rolled 5 in another attribute. That high non-key attribute still rolls at full rating (ADR-0006), because a Specialty never grants permission. The cost is only the Specialty's one Talent level, which comes from a different list, and the 2.2% chance of a 6.

| Measure (200k Cadets) | Highest key (OQ-19's assumption) | Lowest key |
|---|---|---|
| Total attribute points | 18 for 92% | 20 for 92% |
| Non-key mean | 2.74 | 3.20 |
| Any non-key attribute at 5 | 1% | 32% |
| Health 4 or more | 33% | 62% |
| Agility 2, when Agility is not key | 40% | 16% |
| Key attribute 6 | 2.2% | 0% |

So OQ-19's quoted distribution describes a strategy no informed player uses. The typical new soldier totals more than the ADR-0014 Rookie template (19).

**Scenario:** Mira from the chapter's example reaches Graduation with Strength 5 and Instinct 2.

- **Slayer:** Strength stays 5, total 18.
- **Tactician:** Instinct rises to 4, total 20.

As a Tactician her Nape strike still rolls Strength 5 plus Clean Cut 1, one die fewer than the Slayer's 7. She Reads at 4 instead of 2, and her Resolve goes from 3 to 4. Every player at the table who reads the rule makes the same choice.

**Fix options:**
1. Replace the floor with a swap. If the key attribute is below 4, swap its rating with the soldier's highest attribute. The total stays 18, and any Specialty is still viable.
2. Keep the floor but pay for it: lower the highest non-key attribute by the points added, to a minimum of 2.
3. Require the Specialty's key attribute to be among the soldier's two highest, and drop the floor.

### 4. Major. Letting the player choose the Why You Enlisted row moves the key attribute distribution by 17 points, failing OQ-23's own test

**Location:** Section 2.3.2 step 1; `enlistment.yaml` `may_choose_instead_of_rolling: true`; OQ-23 (g), which says to "adopt (h) if it moves the share at 5 or 6 by more than a few points"; OQ-19.

**Problem:** A player who chooses the row whose attribute matches one of their Origin's two attributes concentrates a point before any Training Year.

| Key attribute | Row rolled | Row chosen to match the Origin |
|---|---|---|
| 4 | 63.5% | 46.9% |
| 5 | 34.3% | 49.5% |
| 6 | 2.2% | 3.6% |

The share at 5 or 6 rises from 36.5% to 53.1%. By OQ-23's own test, option (h), rolled only, should already be the rule. Under the chosen row, ADR-0014's all-Rookie default describes fewer than half of new soldiers. The chapter's quoted OQ-19 numbers describe a procedure the chapter does not require.

**Scenario:** A player rolls Wall Rose Farm (Strength and Perception) and intends to play a Slayer. They choose Vengeance or Shield the Walls for the Strength point, not for the Drive. Two of four players do this, and the Squad's key attributes come out one point higher than the simulator's reference build.

**Fix options:**
1. Adopt OQ-23 (h): the row is rolled.
2. Split the row: the player may choose the Drive, but the attribute point comes from a separate D66 roll on the same table.
3. Keep the choice, and re-run and re-quote OQ-19 with the chosen row, then decide whether ADR-0014's reference Rookie still matches creation.

### 5. Major. Squadmates out-build new player characters, and promotion out-builds the Lifepath with an undefined Talent source

**Location:**

- `squadmates.yaml` `templates` ("Key attribute 4, every other attribute 3") and `promotion.steps` ("Gain Talent levels until the soldier has 5 Talent levels in total").
- Section 2.10, *The stat block* and *Promotion*.
- OQ-19 simulator note, OQ-29, OQ-31.

**Problem:** Squadmates are sturdier than the player characters they serve with.

- **Attributes:** a template totals 19 with every non-key attribute at 3. 92% of player characters total 18, with non-key attributes averaging 2.74.
- **Agility:** when Agility is not the key attribute, it is 2 for 40% of player characters and 3 for every Squadmate that is not a Flier or Rider.
- **Health:** player characters have 2 or 3 in 67% of cases. Squadmates have 3 or 4.
- **Resolve:** player characters have 2 in 7% of cases. Squadmates have 3 or 4.

The dodge is the roll ADR-0015 makes decide every Titan hit. With Gear Dice 1 and Stress 1, Pushing when short, it succeeds:

| Agility | Severity 1 | Severity 2 | Severity 3 |
|---|---|---|---|
| 2 (40% of non-Agility player characters) | 72% | 33% | 9% |
| 3 (every non-Agility Squadmate) | 79% | 44% | 16% |

Squadmates also never Push. With no Push and no Cover, a Squadmate's Stress stays near its minimum, so its Fear Rolls are also better than a player character's.

Promotion then keeps the 19 points and adds 4 Talent levels. The steps name no source for them. Read literally, the player picks any Talents, each up to level 2, with none of the Lifepath's rolled limits. A Lifepath soldier carries 0.69 levels on average that no Phase 1 rule can use (finding 9).

Three results follow:

- The fable final review's "red-shirt economy" question is answered backwards: the NPCs are the durable ones.
- A player whose character dies gets a better soldier than a new player creating one.
- The "no Squadmate available" fallback (a full Lifepath) is strictly worse than promotion.

**Scenario:** Brandt dies in round 4. Her player promotes Kessler, a Rider template: Agility 4, every other attribute 3, Horsemanship 1. The player adds Slip Away 2, Clean Cut 1, and Iron Nerve, all chosen, all useful in a Titan Engagement. The two surviving player characters rolled Agility 2 and each carries Silver Tongue or Keen Eyes from the Lifepath.

**Fix options:**
1. Re-spread the templates to match the Lifepath: key 4, one secondary 3, the rest 2 (total 16). Promotion then rolls the Origin's two attribute points and the Why You Enlisted point as a new Cadet does, so a promoted soldier also totals 18 or 19.
2. Give promotion a rolled source for its Talent levels: one D66 event roll on each Training Year's table for the Talent choice only (no attribute or Merit), or levels only from the Specialty's list. State the source in `promotion.steps`.
3. Keep the templates, but log in OQ-29 that Squadmates are deliberately sturdier than new player characters, and give the promotion step the same 18-point total by lowering one non-key attribute to 2.

### 6. Major. In the Graduation Exam a Push costs nothing, so its Merit parity depends on an unstated Push policy, and Chapter 3 results arise in 99% of Exams with no meaning there

**Location:**

- Section 2.4, *How the Exam is played* ("Full pools", "Stress").
- `graduation-exam.yaml` `conditions.stress`, `conditions.requirements_ignored`.
- `stress-changes.yaml` row `graduation-exam-ends` (`also`).
- OQ-22.

**Problem:** Every Cadet's Stress returns to minimum when the Exam ends, and every Stress Response and Chapter 3 result gained during it ends. A Push therefore costs nothing that outlasts the Exam, and each Push adds a Stress Die to every later Trial. The best policy is to Push every roll that is not already at the top Merit tier. OQ-22's parity figures state no Push policy, and the result swings on it:

| Push policy (50k Squads of four) | Exam Merit | Year 3 roll it replaces | Top 10 with Exam | Top 10 without | Cadets with a Stress Response | Exams with any |
|---|---|---|---|---|---|---|
| Push whenever below 3 on Trials 1 and 2 | 0.70 | 0.58 | 9.3% | 6.4% | 72% | 99.4% |
| Push only at 0 on Trials 1 and 2 | 0.46 | 0.58 | 7.0% | 6.5% | 44% | 90.0% |

Under the best policy the Exam raises Top 10 graduates by about 45% relative, and so raises the rate of key attribute 6.

Almost every Exam produces a Stress Response resolved "on the Chapter 3 table". That table will name turns, actions, Positions, Titans, items, Health, or Critical Injuries, and the Exam has none of the first four. Only Catalog requirements are waived, not table results, so the Exam gives no reading for "lose your next turn" or "drop your weapon". Two more problems follow:

- **Ordering bug with Scars.** If a Chapter 3 result can give a Scar, the row returns Stress to the minimum including that Scar (1), then ends the Scar. Nothing lowers Stress to the new minimum of 0, so the graduate starts play at Stress 1 with no Scar.
- **Chapter 1 file scope.** The `also` clause makes a Chapter 1 Stress file end results that are not Stress, pre-deciding Chapter 3 (see *Chapter 1 YAML edits* below).

**Scenario:** Cadet Aldous has Agility 2 and rolls 1 success on the ODM balance test. A Push can only raise his Merit, and any Stress it adds is extra dice for the dummy course, so he Pushes. The new Stress Die shows 1, and the Chapter 3 result is "Freeze: lose your next turn". The table cannot tell whether that costs him the dummy course, nothing, or his Help on Trial 3.

**Fix options:**
1. Give the Exam its own closed Stress Response rule in `graduation-exam.yaml`: each Stress Response costs 1 Merit on that Trial, and nothing else happens. Delete the `also` clause from `stress-changes.yaml`, and make the row set Stress to 0.
2. Make Trial rolls unpushable, as the performance roll is. Re-simulate parity with the Push removed and state the policy in OQ-22.
3. Keep Pushes but make them cost: Stress gained in the Exam carries into play (OQ-22 option e), so the choice is real.

### 7. Major. `without_gear` is stated only inside the uncatalogued-action procedure, so a Catalog action taken without its gear item has no rule

**Location:** Section 2.9 step 4; `action-catalog.yaml` `uncatalogued_actions.steps[without-gear]`; entries `nape-strike` and `body-part-strike` (`not_possible`), `treat-injury` and `field-repair` (`attribute_alone`); `talents.yaml` `make-do` (trigger "... so the roll uses the attribute alone (section 2.9)"); section 2.8 field table ("what happens without one (section 2.9)").

**Problem:** Section 2.9 applies `without_gear` only to "the picked entry" of an action outside the Catalog. No sentence applies it when a soldier takes the entry directly. Read as written:

- A soldier with no Blade Set who declares a Nape strike falls under Chapter 1, section 1.3, step 6 ("If the entry allows no gear item, the roll has no Gear Dice"). They strike at Strength plus Clean Cut. The same soldier describing "I stab the nape with a broken blade" goes through section 2.9 and cannot strike at all.
- A soldier with no medical kit who declares Treat Injury adds Field Medicine dice. The chapter's own torn-cloak example rolls Wits alone.
- Make Do's trigger names section 2.9, so it does nothing on a direct Field Repair.

Losing Blade Sets and kits is ordinary play once Chapter 4 counts them. The outcome depends on whether the player names the entry or describes it, and the YAML gives Foundry no rule for the direct case.

**Scenario:** Private Wendt's last Blade Set breaks in round 2. In round 3 he is at Blind Spot, not holding Attention, and his player says "Nape strike". One table follows section 1.3 and rolls 6 dice. The next follows the `requires_gear` comment ("cannot be attempted in the normal way") and forbids it. Both can cite the text.

**Fix options:**
1. Move the `without_gear` rule into section 2.8 as a rule for every entry, whether taken directly or reached through section 2.9, and add it to the `action-catalog.yaml` header as a rule rather than a field comment. Section 2.9 step 4 then refers to it, and Make Do's trigger drops "(section 2.9)".
2. Add one sentence to Chapter 1's step 6 through a new `dice-pool.yaml` note: an entry with `requires_gear: true` and no gear item follows its `without_gear` value.

### 8. Major. Relentless moves both solo Nape strike targets in ADR-0014 by 15 to 17 points, and no single Nape Depth fits soldiers with and without it

**Location:** `talents.yaml` `relentless` (limit `none`); section 2.7 PROVISIONAL (OQ-28); ADR-0014 targets 2 and 3; OQ-02. `sure-hands`, `pry-loose`, `hard-to-kill`, and `unshaken-command` are not on OQ-28's simulator list.

**Problem:** OQ-28 logs Relentless for a simulator check. The size of the effect is worth stating now, because it decides whether Relentless can exist in its current form. Nape strike, Stress 1, Push when short (a second Push with Relentless):

| Build | Depth 4, one Push | Depth 4, Relentless | Depth 5, one Push | Depth 5, Relentless |
|---|---|---|---|---|
| Rookie (4, 1, 1) | 12% | 28% | 3% | 12% |
| Created Slayer (Str 5, Clean Cut 2, Blade 1) | 25% | 45% | not run | not run |
| Levi-grade (6, 3, 3) | 47% | 64% | 26% | 46% |

At Depth 4 the reference builds meet ADR-0014 (Levi about 50%, a lone average soldier about 10%). Relentless holders exceed both. At Depth 5 Relentless holders meet both, and everyone without it misses: Levi-grade at 26%. Relentless has no limit, costs no more than a normal Push, and comes from the Year 2 event "The wooden nape" (1 in 12) or the Slayer list.

Several other rule Talents move ADR-0014 targets and are not on the list:

- **Pry Loose** and Break Free on a comrade's behalf: the Grab target.
- **Hard to Kill** and **Sure Hands:** the player character death target.
- **Unshaken Command:** Fear Roll outcomes.

Pry Loose also meets Chapter 1's unresolved OQ-18: a Grabbed soldier one step away can Help the prying roll.

**Scenario:** A Slayer with Relentless reaches Blind Spot alone after a comrade's Break Attention. She rolls 8 dice, Pushes, and Pushes again: 45% at Depth 4, where ADR-0014 wants an average soldier near 10%. Chapter 6 raises Medium Nape Depth to 5 to compensate, and the Squad's Levi-grade veteran without Relentless drops to 26%.

**Fix options:**
1. Limit Relentless to once per Titan Engagement, and re-simulate the two solo targets with it.
2. Make the second Push cost more: 2 Stress, and it cannot be Covered.
3. Replace it with a rule that works through the teamwork levers. For example: "When your Nape strike falls short, it creates 1 extra Opening." Add Pry Loose, Hard to Kill, Sure Hands, and Unshaken Command to OQ-28's simulator cases either way.

### 9. Major. The Lifepath hands out Talents that no Phase 1 rule can use

**Location:**

- `action-catalog.yaml` entries `spot`, `size-up`, `survive`, `persuade`, `endure`, `sneak`, and `recall` ("No Phase 1 rule calls for these"), and the reserved `fight` and `block`.
- `talents.yaml` `keen-eyes`, `fieldcraft`, `judge-of-character`, `book-learning`, `hand-to-hand`, `silver-tongue`, `quiet-step`, `long-haul`.
- `origins.yaml`, `training-years.yaml`, `specialties.yaml`. Section 2.8, *Groups of entries*.

**Problem:** 8 of the 20 dice Talents name only entries that no Phase 1 rule calls for or that are reserved. Hand-to-Hand names only reserved entries, unused through Chapter 6. These rolls have `changes: []`, so section 2.9 cannot reach them either. In Phase 1 they are dead levels. The Lifepath forces them:

- 5 of 12 Origins offer only dead Talents: Wall Maria Refugee, Trost Merchant, Hunting Village, Underground City, Interior Merchant.
- 5 of the 6 Year 1 curriculum Talents are dead.
- Year 1 "Found in the storehouse" and "Three days alone", and Year 3 "Lost at night", offer only dead Talents.
- The Hunter, Tactician, and Medic lists include dead Talents.

Even when the player always takes a usable Talent where one is offered, 57% of new soldiers start with at least one of their five levels unusable. 11% start with two or more (mean 0.69). The chapter's own Mira has two, Keen Eyes and Silver Tongue.

The brief's scope asks for Phase 2 content to be forward-referenced, not drafted. These seven entries fix the attribute of rolls that Expedition, Downtime, and Chase rules have not designed, and the Lifepath spends creation budget on them.

**Scenario:** Two players create soldiers. One rolls Garrison Family, "A fight in the barracks", "Workshop duty", and "The falling Cadet": Gearwright 2, Grip Breaker, Wirework, and a Specialty level, all usable. The other rolls Interior Merchant, "Found in the storehouse", "Paired with the best", and "Lost at night": Book Learning, Quiet Step, Hamstringer, Fieldcraft, and a Specialty level, three of them dead. Both "have 5 Talent levels".

**Fix options:**
1. Until the Phase 2 rules exist, give every Origin and event at least one Talent that names a Phase 1 entry, replacing the dead option or adding a third.
2. Extend OQ-20's fallback: a level that would go to a Talent whose entries no current rule calls for may instead go to any Phase 1 Talent on that year's curriculum or the Specialty's list. When the Phase 2 rules land, the tables revert.
3. Reserve the seven roll entries and their Talents (as `fight` and `block` already are) and remove them from the Phase 1 Lifepath tables.

### 10. Major. The named comrade lifecycle has holes: promotion "leaves the Squad Pool", and replacement Drives never get a comrade

**Location:** Section 2.5, *Named comrades and replacing a Drive*; section 2.3.5 step 7; `enlistment.yaml` `drive_rules.named_comrade` and `replacement`; `squadmates.yaml` `promotion.steps` (the Why You Enlisted step); glossary **Squad Pool** ("The Squadmates currently serving in the Squad").

**Problem:**

- **Promotion kills the Drive.** A Drive dies when its comrade "dies, retires, or leaves the Squad Pool". A promoted Squadmate is "no longer a Squadmate" and so leaves the Squad Pool, though they are still in the Squad. Stay Beside Them dies the moment its comrade is promoted, and promotion happens after every player character death.
- **No naming time.** Section 2.3.5 names comrades only once, when the Squad forms. A replacement Drive picked "at the start of the next session" and a promoted Squadmate's Drive both happen after that. If either is Stay Beside Them, no rule says when or whether the comrade is named, so it can never trigger.
- **No test for dead comrades.** Nothing says a player cannot name a comrade who is dead.

**Scenario:** Ilse's Drive is Stay Beside Them, naming the Squadmate Kessler. Brandt dies and her player promotes Kessler. Ilse's Drive is now permanently dead, though Kessler rides beside her. Next session Ilse picks Stay Beside Them again to name Kessler again, and no step lets her name anyone.

**Fix options:**
1. Replace "leaves the Squad Pool" with "leaves the Squad", and state that promotion does not leave the Squad.
2. Add to `drive_rules.named_comrade`: a Drive that needs a named comrade and is recorded after the Squad has formed names one immediately, choosing a living player character or Squadmate.
3. Add the same step to `promotion.steps`.

### 11. Minor. Strength is a performance attribute in two years, so the only route to an attribute of 6 favors Slayers and Brawlers about sevenfold over Fliers and Riders

**Location:** `training-years.yaml` `performance_attributes` (year 1 Strength and Instinct; year 2 Agility and Strength; year 3 Wits and Empathy); the Exam's dummy course (Strength); OQ-21 (f).

**Problem:**

- **Top 10 by highest attribute:** a Cadet whose highest attribute is Strength reaches Top 10 10.7% of the time. Agility 3.9%, Wits 5.8%, Perception 5.9%, Instinct 5.5%, Empathy 6.2%.
- **Key attribute 6 by Specialty:** 5.1% for a Slayer or Brawler, against 0.7% for a Flier and 0.8% for a Rider.

Year 2 pairs Agility with Strength, so an Agility Cadet rarely rolls Agility there, and Perception is never a performance attribute.

**Fix options:**
1. Pair each attribute exactly once: year 1 Strength and Instinct, year 2 Agility and Perception, year 3 Wits and Empathy.
2. Keep the pairs and log the skew in OQ-21 as a canon choice (the Training Corps rewarded ODM and physical scores).

### 12. Minor. Graduation Exam procedure gaps

**Location:** `graduation-exam.yaml` `requirements_ignored`, `trials[squad-field-exercise].help`, `trials[].needs`; section 2.4 *Using the Exam*; section 2.3 and `starting_squad.creation`.

**Problems:**

- **Waived requirements.** `requirements_ignored` covers a Titan, a Position, a Grabbed soldier, or a patient. `field-repair` will need a worn item and `rally` a comrade with a Stress Response (Chapters 3 and 4), and neither is listed.
- **Trial 3 order.** It does not say in what order Cadets roll or when Help is declared. Since each Cadet Helps once, waiting to see a roll matters.
- **Cover after Helping.** "A Cadet who could Help a roll can Cover its Push" leaves open whether a Cadet who already Helped someone else can Cover. The one-Help limit says no; Covering "spends nothing" suggests yes.
- **Unused `needs`.** `needs: 1` on Trials 1 and 2 is never used, since Merit is set by the success tiers.
- **Stray word.** "Helping spends nothing else" has no referent for "else".
- **Group decisions.** "The players decide" whether to run the Exam, the campaign start year, and starting Squadmate templates, with no rule when players disagree. The Squadmate D6 roll-off exists and could be reused.

**Fix options:**
1. Add "a worn or Jammed item, or a comrade with a Stress Response" to `requirements_ignored`.
2. State that Cadets roll Trial 3 in the order the players choose, and that each Help and Cover is declared before that Cadet's roll. Say whether a Cadet who Helped another can Cover.
3. Add one line to section 2.3: any choice this chapter gives "the players" is settled by the Squadmate D6 roll-off when they disagree. Drop `needs` from Trials 1 and 2.

### 13. Minor. Chapter 1 YAML edits: none changes a Chapter 1 rule, but three texts no longer agree

**Location:** `dice-pool.yaml` `roll_exceptions` row `performance-roll`, `components[attribute].dice`, `components[gear].dice`; `stress-changes.yaml` rows `graduation-exam-ends`, `named-gain`, `named-reduction`; `bonus-dice-sources.yaml` `help.applies_to`; Chapter 1 section 1.3 ("It also lists the Death Roll's exceptions"); Chapter 2 introduction ("following their 'a later chapter adds a row' pattern").

**Problems:**

- **Exceptions list.** The `performance-roll` row is consistent with OQ-03 ("Another roll leaves out Stress Dice only if its own rule names it"), and Chapter 2 names it. But Chapter 1 section 1.3 still says the file lists "the Death Roll's exceptions".
- **No "adds a row" pattern for dice-pool.yaml.** Chapter 1 states that pattern for `stress-changes.yaml` and `bonus-dice-sources.yaml` only (sections 1.6 and 1.7), not for `dice-pool.yaml`. Chapter 1 review 3 finding 6 asked for exactly that sentence.
- **Help row.** `help.applies_to` still reads "any attribute roll except a Death Roll". It is consistent through `condition_outside_titan_engagement`, but a tool reading `applies_to` alone allows Help on the performance roll.
- **Gear Dice text.** The gear component's `dice` text says Gear Dice come from "the gear item the Chapter 2 procedure names when the roll uses the attribute alone". Chapter 2's `attribute_alone` gives no Gear Dice. Its rolls called by attribute take a gear item from the calling rule, not from the Chapter 2 procedure.
- **Dangling reference.** `named-gain` and `named-reduction` list `02-character-creation`, but no Chapter 2 Talent or table names a Stress change.
- The `graduation-exam-ends` `also` clause is covered by finding 6.

**Fix options:**
1. Add to the `dice-pool.yaml` header: "A later chapter that creates a roll with exceptions adds a row here." Change Chapter 1 section 1.3 to "the rolls with exceptions, such as the Death Roll".
2. Change `help.applies_to` to "any attribute roll except those listed with help under `roll_exceptions` in `dice-pool.yaml`". Change the gear `dice` text to "or the gear item the calling rule names when a rule calls for the attribute alone". Drop `02-character-creation` from the two named rows until a Chapter 2 row names a Stress change.

### 14. Minor. Squadmate data gaps and Phase 2 pre-decisions

**Location:** `squadmates.yaml` `stat_block.gear_dice.note`, `rules_applicability` (XP, Downtime Actions), `wing`; OQ-29 ("Downtime Actions are left to the Downtime rules"); section 2.10.

**Problems:**

- **Gear that never changes.** "A Squadmate's gear items always have these ratings" forbids any future Chapter 3 to 6 result that damages gear by some route other than Push wear, such as a Titan behavior that crushes ODM Gear.
- **Phase 2 decided early.** `rules_applicability` sets XP and Downtime Actions to `applies: false`, while OQ-29 says Downtime Actions are left to the Downtime rules. That decides Phase 2 content in data while the OQ defers it.
- **Call It.** Nothing says whether a Tactician Squadmate can Call It after its Read.
- **Squadmate Reactions.** Nothing says what happens when a Squadmate's own Reaction spends its turn in advance. Presumably Chapter 1's OQ-09 applies, but `wing.turn_spent_in_advance` covers only the player character's turn.
- **No names.** No name table exists for "named" NPCs.

**Fix options:**
1. Reword the gear note to "have these ratings unless a rule names a change to them", and set XP and Downtime Actions to `applies: set by the Phase 2 rules`.
2. Add to `action_list`: options of a listed entry (Call It) are allowed. Add to `wing`: a Squadmate's own Reaction spends its Wing turn under Chapter 1, OQ-09.

### 15. Minor. Canon fidelity details

**Location:** `origins.yaml` `shiganshina` (Haven "A parent who reached the safety of Wall Rose", `condition: null`); `training-years.yaml` year 3 "An afternoon on the Wall"; the Canon Tie spread.

**Problems:**

- **Shiganshina.** With a campaign start year of 845, the Cadet trained from 842 to 845, while Shiganshina still stood. The Haven only makes sense after the fall.
- **"An afternoon on the Wall".** It puts a Titan below the Wall during cannon drill. Before 845 no Titans stood at Wall Rose, and at Wall Maria's outer districts Titans were rare, so the event suits only 846 onward.
- **Canon Ties.** Only 3 of 12 Origins have one, and none links to a Survey Corps figure (Hange, Mike, Levi, Erwin), though a Close Canon Proximity campaign centers on them. A Squad of four has no Canon Tie at all about 32% of the time (0.75^4).

**Fix options:**
1. Give the Shiganshina row a second Haven set, or a condition that swaps its Havens by start year. Give the Wall event `campaign_start_year_min: 846`, or reword it to watch from Wall Maria's gate.
2. Add Canon Ties to more Origin rows, or add a D6 Canon Tie table rolled when a row has none.

### 16. Minor. Data shape and wording

- **3 or more.** `training-years.yaml` `merit_from_successes` gives "3 or more" only in a comment (`successes: 3  # 3 or more`). A Foundry import reads exactly 3 and has no row for 4 or 5 successes. Use `successes_min`/`successes_max` as `graduation-exam.yaml` does.
- **Attribute field.** `action-catalog.yaml` `performance-roll.attribute` is prose, where every other entry holds an attribute id. Use `attribute: from_performance_attributes` and point to the Training Year field.
- **Grief cap.** `attributes.yaml` `resolve.formula` omits the glossary's cap ("up to 3 points"). The chapter says Chapter 3 caps it, but the glossary already settles it.
- **Five, not four.** Section 2.7 PROVISIONAL (OQ-28) says "Four need a simulator check" and names five Talents.
- **Group headings.** Section 2.8's "Titan Engagement actions" group includes `lift-comrade` and `change-canister`, whose `context` is `any`.
- **Terms and descriptions.** "Campaign start year" is a new term with no glossary entry. "Airborne" (the Freedom Drive) is undefined until Chapter 4. The Talent rows have no player-facing description, so a player choosing between Keen Eyes and Horsemanship sees only an entry id.
- **Class Rank ties.** Two classmates with Merit 6 both record Class Rank 10.
- **Character sheet.** `lifepath.yaml` `record_on_sheet` has no field for "Drive used this session".

## Chapter 1 YAML edits

| File and row | Consistent with Chapter 1 prose | Changes a Chapter 1 rule |
|---|---|---|
| `dice-pool.yaml` `roll_exceptions.performance-roll` | Yes, under OQ-03 "its own rule names it". Section 1.3's "the Death Roll's exceptions" is stale (finding 13). | No |
| `dice-pool.yaml` attribute and gear `dice` texts | Attribute yes. Gear names the wrong source of a gear item (finding 13). | No |
| `stress-changes.yaml` `graduation-exam-ends` | The Stress reset follows section 1.6's "a later chapter adds a row" pattern. | The `also` clause adds a non-Stress effect to a file section 1.6 defines as Stress triggers, and pre-decides Chapter 3 (finding 6). |
| `stress-changes.yaml` `named-gain`, `named-reduction` | Yes | No; `02-character-creation` dangles (finding 13). |

## Judgment on the provisional decisions

- **OQ-19 (d):** the numbers reproduce (key 4 / 5 / 6 at 63.5 / 34.3 / 2.2%, non-key mean 2.74, 91.8% at 18 points). The decision is unsound as drafted because two permitted choices undo it: the lowest-key floor (finding 3) and the chosen enlistment row (finding 4). Fixed placement plus a swap-based floor would keep its intent.
- **OQ-20 (a) and (d):** sound. The both-capped fallback never fired in 800k simulated Cadets, because no Origin, Year 1, and Year 2 path can cap both Talents of a later event. Keep it as a guard and say so. The 5-level budget is fine. Finding 9 is a table problem, not a budget one.
- **OQ-21:** sound for (a), (d), and (i). Top 10 is 6.5% and Merit 5 or more is 15.4%; at least one Top 10 in four is 1 - 0.935^4 = 24%. (f) is sound but skewed by finding 11.
- **OQ-22:** unsound as simulated, because parity depends on an unstated Push policy that the rules make free (finding 6). Option (a) for Merit is right. (d) needs its own closed Stress Response rule.
- **OQ-23:** (a) and (c) are sound and well built; the `since_most_recent_turn_start` test handles out-of-turn Help cleanly. (g) fails its own test (finding 4). (e) has gaps (finding 10). The `state` test drops the glossary's acting (finding 2).
- **OQ-24 (a):** sound. It matches Alien and keeps Health below every reference build's reach of "big".
- **OQ-25:** sound and consistent with ADR-0015 (dodge on Agility with ODM Gear) and ADR-0010 (Nape strike requirement). Strength strikes are the debatable fidelity call, since canon's best cutters rely on spin rather than mass. The logged reason (Agility would otherwise own every Titan Engagement roll) is a good one.
- **OQ-26 (a):** sound. The `option` and `fixed-roll` kinds give rule Talents one id space without letting dice Talents reach non-attribute rolls.
- **OQ-27 (a):** sound in shape, with a scope bug (finding 7). OQ-27 should also say plainly that it narrows ADR-0003 item 9's "or the attribute alone" to two cases, missing gear and rolls called by attribute. An uncatalogued action with no qualifying entry gets no roll rather than the attribute alone. That is defensible (a Nape strike needs blades), but it is a reading of the ADR, not the ADR's text, and belongs in the OQ's Why.
- **OQ-28:**
  - (a), (c), and (e) are sound.
  - Relentless should not stay unlimited (finding 8).
  - Saddle Dodge lets a Talent change a pool that ADR-0015 fixes. ADR-0006 lets rule Talents bend rules, but an ADR-fixed pool is an ADR decision, so the exception needs one line in ADR-0015's amendment log, not only an OQ note.
- **OQ-29:**
  - (a) is sound in shape, but the attribute spread is too high (finding 5) and the action list is a Critical (finding 1).
  - (d), no Covering, is sound and removes OQ-06's sponge from NPCs.
  - (f) and (h) are sound.
- **OQ-30 (a), (d), (g):** sound. The D6 roll-off is a clean ADR-0003 answer, and "the Squadmate still acts after a turn spent in advance" is right under ADR-0015.
- **OQ-31:** (a), (d), and (i) are sound. (f) has an undefined Talent source and out-builds the Lifepath (finding 5).
- **OQ-32 (a), (d):** sound. The start year needs a glossary entry and should gate the Shiganshina Havens (finding 15).

## Scope check: Phase 2 content

No XP spending, Downtime procedure, Rank, Requisition, Expedition, Operation Frame, or Shifter rule is drafted. Class Rank, the 7-soldier Squad, Havens, and Talent purchase are forward references. The mid-campaign join ("at the start of the next session") is a labelled stopgap. Two items go further than a forward reference:

- The seven "rolls later rules call for" fix attributes for undesigned Phase 2 rolls and are handed out at creation (finding 9).
- `rules_applicability` sets Squadmate XP and Downtime Actions to false (finding 14).

## Glossary and term use

No `_Avoid_` term appears in the chapter or the eleven YAML files:

- "Anchor" appears only for ODM anchors, its reserved sense.
- "Class" appears only in Class Rank and a Training Corps class, not for Specialty.
- "Level" appears only for Talent levels.
- "Job" appears in one Specialty summary and OQ-25, and is not an avoided term.

Two definitional conflicts are findings 1 (Specialty) and 2 (Drive). Two further glossary entries now read differently from the chapter, and the chapter logs both:

- **Training Year:** "each with ... a performance roll", not true for Year 3 with the Exam (OQ-22).
- **Graduation Exam:** "decides each Cadet's Class Rank", where it contributes Merit (OQ-22).

## ADR-0003 checklist

- **Item 2:** Draw Attention's flag is recorded on its entry.
- **Item 3:** broken for four Drives and weakened for five (finding 2).
- **Item 7:** Help keeps its Position requirement under Wide Awareness, and the Exam states its Help rule.
- **Item 8:** kept by "No rulings" (section 2.9), "the GM plays no part in the Lifepath", and "the GM never directs a Squadmate".
- **Item 9:** met, with the OQ-27 note above.

No rule in the chapter rests on GM discretion.

## Fidelity and engine fit

The Lifepath reads as the 104th's world: bread lines, the dummy course, the dismissal list, the decoy drill. The Military Police offer always declined is the right call for a Survey Corps game.

Rolled attributes with no point buy are less Year Zero Engine than Traveller. They work only if the Specialty choice cannot game them (findings 3 and 4). Alien and Coriolis both use a small point budget, so a swap-based floor would put this back near its parents.

The Talent design is good Coriolis:

- Narrow dice Talents.
- Single-level rule Talents.
- One dice Talent per roll.

Squadmates as templates with no Push are right for table load. Their durability relative to player characters and their role locks are the two things that break the canon picture of redshirts who still do everything.

## Keep

- The Action Catalog's `kind`, `rolled`, `requires_gear`, `without_gear`, and `changes` fields: one id space for Talents, pools, and uncatalogued actions, ready for Foundry.
- The uncatalogued-action steps: closed, player-driven, and the torn-cloak and shout examples teach them well.
- Drive trigger tests `most_recent_turn` and `since_most_recent_turn_start`: checkable from game state, and they reach out-of-turn Help and Cover.
- The Squadmate directing rule: the Wing's player decides, otherwise a D6 roll-off, and never the GM.
- The Mira example, which is correct against the data at every step.

## Appendix: simulation model

Scripts in the scratchpad (`integrity.py`, `life.py`, `exam.py`, `odds.py`, `depth.py`), not committed.

**Lifepath (200k Cadets per policy):**

- Rows are rolled uniformly from the YAML, and the campaign start year is 850 unless stated.
- Overflow goes to the highest other attribute below 5.
- Talent picks prefer a Talent that names a Phase 1 entry.
- The Specialty is chosen by policy (highest or lowest key attribute), then the floor and the Top 10 bonus are applied.

**Exam (50k Squads of four):**

- Cadets are built from the Origin, Why You Enlisted, and three Training Year events.
- Trials 1 and 2 use Agility plus Wirework, and Strength plus Clean Cut, each with Gear Dice 1.
- Trial 3 uses the Cadet's largest eligible pool, plus one Help die each.
- There is no Covering, and Stress Responses have no effect because Chapter 3 is unwritten. Figures involving Stress Responses are frequencies only.

**Dice:**

- A Push re-rolls base and Stress Dice not showing 6 and adds a Stress Die. Gear Dice are never re-rolled.
- A Push is forbidden once any Stress Die shows 1.
- "Push when short" Pushes only while below the successes needed.

This model reads about 4 points lower than Chapter 1 review 3's dodge figure at Severity 3, so compare numbers within this review.

| Quantity | Value |
|---|---|
| Key attribute 4 / 5 / 6: highest-key policy, row rolled | 63.5 / 34.3 / 2.2% |
| Key attribute 4 / 5 / 6: row chosen to match the Origin | 46.9 / 49.5 / 3.6% |
| Key attribute 4 / 5 / 6: lowest-key policy | 93.6 / 6.4 / 0% |
| Total attribute points: highest key vs lowest key | 18 for 91.8% vs 20 for 91.9% |
| Non-key mean: highest vs lowest | 2.74 vs 3.20 |
| Any non-key attribute at 5: highest vs lowest | 1.2% vs 32.4% |
| Health 2 / 3 / 4 / 5 (highest key) | 6.6 / 60.7 / 31.5 / 1.2% |
| Resolve 2 / 3 / 4 / 5 (highest key) | 6.6 / 61.1 / 31.5 / 0.8% |
| Agility when not key: 2 / 3 / 4 (highest key) | 39.5 / 49.7 / 10.6% |
| Top 10 (Merit 6+); Merit 5+ | 6.5%; 15.4% |
| P(Top 10), highest attribute Str / Agi / Wits / Per / Ins / Emp | 10.7 / 3.9 / 5.8 / 5.9 / 5.5 / 6.2% |
| P(key 6), Slayer / Brawler / Flier / Rider | 5.1 / 5.1 / 0.7 / 0.8% |
| Dead Talent levels 0 / 1 / 2 / 3; mean | 42.7 / 46.1 / 10.6 / 0.6%; 0.69 |
| Both-capped fallback fired | 0 times in 800k Cadets |
| Exam Merit vs Year 3 roll: aggressive / cautious Push | 0.70 vs 0.58 / 0.46 vs 0.58 |
| Top 10 with vs without Exam: aggressive / cautious Push | 9.3 vs 6.4% / 7.0 vs 6.5% |
| Exams with at least one Stress Response: aggressive / cautious | 99.4% / 90.0% |
| Dodge, Talent 0, Gear 1, Stress 1, Severity 1 / 2 / 3: Agility 2 | 71.7 / 32.9 / 8.8% |
| Same dodge: Agility 3 | 79.2 / 43.9 / 16.0% |
| Same dodge: Agility 4 | 84.3 / 53.7 / 24.4% |
| Nape strike, Stress 1, Depth 4, one Push vs Relentless: Rookie | 12.4 vs 27.9% |
| Same: created Slayer (5, 2, 1) | 25.2 vs 44.8% |
| Same: Levi-grade | 47.3 vs 64.0% |
| Depth 5, one Push vs Relentless: Rookie / Levi-grade | 3.2 vs 11.7% / 26.4 vs 46.3% |
| Depth 6, one Push vs Relentless: Rookie / Levi-grade | 0.5 vs 3.5% / 12.1 vs 29.3% |
