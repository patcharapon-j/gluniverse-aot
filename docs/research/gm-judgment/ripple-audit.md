# GM judgment: ripple audit

Research only, 2026-09-16. No rule, YAML, ADR, glossary, simulator, site, or packet file was changed. This maps what the owner's new direction (GM judgment is valid; "we can trust the GM") touches across Wings of Freedom, and recommends where to open it, where to open it with a default, and where to keep it closed.

Sources read: `CONTEXT.md`; every ADR in `docs/adr/`; `docs/rules/01` to `07`; the YAML under `data/` (every `gm:` and `gm_choices:` field, the `rolled` markers, Bonus Dice sources, roll exceptions); targeted greps of `OPEN-QUESTIONS.md` and `DECISIONS-2026-09-14.md`; `tools/sim/` (README, policy header, cases, report coverage); `site/src/lib/dice-rules.ts`, `shared-data.ts`, and the site content; the playtest packet and `HANDOFF.md`; Alien RPG Evolved Edition and Coriolis: The Great Dark core rules (text extracted with `pdftotext`; page numbers below are printed page numbers, which run 4 behind the PDF page index in both books).

---

## 1. Summary

**Top ripple effects**

1. **Chapter 1 section 1.1 is replaced, and the gap closes.** Free-form acts (sneak past a guard, persuade a villager, search a ruin, climb a wall) get a called roll instead of "no mechanical effect" (`02-character-creation.md:611`). This is the single biggest gain and it costs no tuned number, because none of those acts is measured.
2. **ADR-0003 has to be superseded, not patched.** Its founding sentence (`0003:3`, "GM discretion may appear as flavor but never as the rule itself") is the thing being reversed. Most of its thirteen drafting items survive as limits inside the Titan Engagement; items 1, 8 (for Foes), 9, 10, and 12 change.
3. **The "No rulings" paragraphs in five chapters narrow** (`02:611`, `03:37`, `04:37`, `05:65`, `06:34`, `07:35`) and about fifteen `gm: never` / `gm_choices: none` fields in YAML must say which ruling, if any, they now allow.
4. **People become GM-run; Titans stay table-run.** The foe rule becomes a default the GM may override with a stated reason (ADR-0018 amended). Behavior Tables, the Attention Ladder, and Titan Dice stay closed. That split keeps the design's best idea (a Titan is a readable disaster, ADR-0001) and puts judgment where it reads as intelligence.
5. **Social and field Talents gain a lot of value.** Silver Tongue, Judge of Character, Keen Eyes, Fieldcraft, Book Learning, Long Haul, Quiet Step, and Underground Instincts currently add dice only inside Chapter 7 procedures; every called roll on their entries now reads them.
6. **The simulator stays valid if the Titan Engagement's measured rolls stay closed.** ADR-0014's targets become "the rules as written, with no rulings" and every figure keeps its meaning. Rulings outside the Titan Engagement were never measured (Expeditions, Downtime, social play), so nothing is lost there.
7. **The packet must change before the first playtest** (`wings-of-freedom-playtest-packet.html:187-195` prints "The dice are final" with an extra "Rules decide" bullet), or the playtest tests the old stance.

**Keep closed** (with reasons in section 3): the Push procedure; Bonus Dice, Help, and penalties on rolls inside a Titan Engagement; fixed rolls (Fear, Stress Response, Gas, Death, performance) and Leap Clear; the Critical Injury, Stress Response, Scar, and Grief tables; Stress relief; gear wear and Standard Issue; the Funding gate and the ledger; Behavior Tables, Attention, Attack Dice, Titan Dice, the Reaction; the Nape-only kill, Openings sizes, steam, the falling Titan, corpse heat, the Grab countdown, the retreat clock; standard Titan numbers and Read-gated hidden values; the Leg roll, hazard rolls, the Straggler's random victim, the Night table; Squadmate direction by players; "results stand" for every roll.

---

## 2. How the two reference games frame GM authority

Paraphrased, with page cites.

**Alien RPG Evolved Edition**

- *When to roll* (p. 42): the rules or the adventure normally say when to roll and what skill, but the GM may always call for a roll when the situation warrants one. The book advises against rolling too often and reserves rolls for tense moments where something real is at stake.
- *NPC rolls* (p. 42; *Playing NPCs*, p. 157): the GM rolls only for NPC actions that directly affect a PC, and otherwise simply decides what happens. NPCs never Push.
- *Modifiers* (p. 43): the rules or the GM may add or remove base dice. A pool never drops below one base die, and modifiers never touch stress dice.
- *Help* (p. 43): up to three helpers, +1 die each, but only if they are in a position to support the action concretely; the GM has final say. In combat helping costs the helper's action.
- *Switching attributes* and *extra successes* (p. 43): the GM or adventure has final say on which attribute a skill uses in an odd case and on what extra successes buy.
- *Failure* (p. 43): the GM has final say on the consequences of failure, and failure should never stop the story outright; there must be a way forward at some cost.
- *Passive rolls and opposed rolls* (p. 44): a roll the character is unaware of cannot be Pushed and triggers no stress response, and the GM may make some in secret. Opposed rolls are used sparingly, when the rules, the adventure, or the GM calls for them.
- *Game principles* (p. 152): limit resources, increase the pressure, bring horrible death. The GM is a pressure engine, not a neutral referee.

**Coriolis: The Great Dark**

- *When to roll* (p. 47): the adventure or location text normally says when to roll and what attribute, the GM may always call for a roll, and rolls are saved for dramatic moments with real stakes.
- *NPC rolls; no pushing passive rolls* (p. 48): the GM rolls only when an NPC action directly affects an Explorer; only active actions can be Pushed.
- *Difficulty* (p. 49): normally the GM does not assess difficulty, since dice come out only in challenging situations. When outside factors help or hinder, the GM adds or removes base dice on a seven-step ladder from Effortless (+3) to Insane (-3). Never below one base die; gear dice are never modified.
- *Help* (p. 49): declared before rolling, must make sense in the story (helper present and able), GM has final say.
- *Retry example* (p. 66): a failed stabilize cannot be retried by the same person unless they get better medical gear. A retry is gated by a changed situation.
- *GM advice* (p. 250 to 251): rules serve the story; make calls in the moment and stick by them; use tables to inspire rather than dictate; set the stakes before the roll so players choose with open eyes; fail forward, where failure complicates rather than halts. It also permits the GM to adjust or ignore a roll's result when the narrative calls for it.

**What WoF should take, and what it should not.** Take: the GM may call for a roll; roll sparingly; stakes stated before rolling; GM rules on Help presence; GM dice modifiers with the one-base-die floor and no change to stress or gear dice (both books agree, and WoF's penalty step at `01-core-rules.md:57` already has exactly that shape); fail forward; retries gated on a changed situation; NPCs run by the GM. Do not take: Coriolis's permission to adjust or ignore a rolled result (p. 250). WoF's Titan dread and its players' trust rest on rolls made in the open that stand (ADR-0019:5, ADR-0003 item 8), and both parents still run their signature monsters from tables (`docs/research/research-prior-art.md:136`; ADR-0001:14).

---

## 3. Element by element

Each element answers: **Now** (what forbids or replaces judgment), **Opens** (new GM powers), **Recommend**, **Change and risk**.

### E1. Core dice procedure and when to roll

- **Now.** `01-core-rules.md:27` "Roll only when a rule says so", `:28` results stand, `:29` "No dice by judgment", `:30` retries set by the calling rule. `action-catalog.yaml` gives every entry a `rolled` value of `when_taken`, `when_a_rule_calls`, or `never`, and no value lets the GM call one. Packet `:187-195`.
- **Opens.** The GM calls for a roll when an act's outcome is uncertain and failure would cost something; says "it happens" when there is no risk; says "it cannot be done" before anyone rolls; names the roll (attribute and nearest Catalog entry), the successes it needs, and the stakes.
- **Recommend: open with guidance.** The pool build in section 1.3 stays exactly as written; the GM's ruling fills only step 1, *Name the roll*, for acts no rule covers. Express difficulty first through **needs** (1 as the default, 2 for hard, 3 for the extraordinary), because WoF already speaks difficulty as needs: Nape Depth, Watch, Scarcity 1/2/3 (`07-playtest-rules.md:349-360`), Parley asks. Dice modifiers are the secondary tool (E4). Keep the parents' "roll sparingly" advice (Alien p. 42, Coriolis p. 47).
- **Change and risk.** Rewrite section 1.1 (all four items; candidate text in section 5). No YAML shape change is needed for the pool. Add a glossary term for the called roll and for stakes (section 7). Risk: roll proliferation slows play and grinds Stress; the stakes-first rule and "no roll without risk" are the brake.

### E2. Actions outside the Catalog (the free-form gap)

- **Now.** `01-core-rules.md:51` and `02-character-creation.md:595-611`: an uncatalogued act changes only a tracked value, and "an action that changes no tracked value has no mechanical effect"; `:611` "No rulings. The GM does not decide whether an action is possible, which entry it uses, or what it changes." `action-catalog.yaml:928` `uncatalogued_actions`. ADR-0003 item 9 (`0003:17`) and item 12 (`0003:20`). OQ-35 (`OPEN-QUESTIONS.md:644-660`) rejected "a general obstacle entry with a player-chosen attribute" because it "brings back the judgment ADR-0003 forbids"; the bracing-beam example still gets no roll.
- **Opens.** The GM rules whether an act is possible, names the entry or attribute, sets needs and stakes, and describes what success and failure do, including outcomes no tracked value lists (the guard does not notice; the villager talks; the wall is climbed).
- **Recommend: open fully outside a Titan Engagement; open with guardrails inside one (E17).** Keep the tracked-values list as an index (Talents, the Foundry system, and the Catalog still use it), no longer as a gate. This is close to ADR-0003's original item 9, "use the closest catalog action, or the attribute alone" (`0003:25`), with the GM choosing "closest".
- **Change and risk.** Rewrite section 2.9 and `uncatalogued_actions` step 5 ("no match" becomes a called roll); keep the steps as the default order. ADR-0003 items 9 and 12. `CONTEXT.md:108-110` (Action Catalog is "the complete list of named actions a soldier can take"). The prayer example in section 2.9 stays inert, because Stress relief stays closed (E11). Risk: players argue for the entry whose Talent they hold; the GM names the entry before the pool is built, and that ruling stands.

### E3. Push

- **Now.** ADR-0004; `01-core-rules.md:75-98`. A roll cannot be Pushed if a rule, a roll exception, or a `forbids` row says so (`:79-85`, `:234`).
- **Opens.** A GM could forbid a Push on a called roll "because the moment has passed", or force one.
- **Recommend: keep closed.** Every called attribute roll can be Pushed and Covered like any other. The Push is the player's one lever (ADR-0019:17). The only new exception is the passive secret roll if the owner adopts E23, which neither parent lets a player Push (Alien p. 44; Coriolis p. 48).
- **Change and risk.** None, or one `roll_exceptions` row in `data/core/dice-pool.yaml:128` for a passive roll. Low risk.

### E4. Bonus Dice, the cap, Help, Covering, Gear Dice, penalties

- **Now.** `01-core-rules.md:184` "Listed sources only"; `bonus-dice-sources.yaml:1-4` ("nothing outside this list adds Bonus Dice"), `:9` `cap_per_roll: 4`; `:57` "Every penalty comes from a named rule (OQ-07)"; `:59` Gear Dice only from an item the entry allows; `:220` outside a Titan Engagement Help exists only where the calling rule allows it, and a silent rule means no Help and no Cover. ADR-0006:3 (cap 4 so "the push decision still matters").
- **Opens.** Circumstance dice for fictional advantage; a penalty for bad ground, darkness, haste; the GM rules which comrades can Help a called roll and what Help costs; the GM rules whether an improvised object helps.
- **Recommend: open with guidance outside a Titan Engagement; keep closed inside one.**
  - A new Bonus Dice source, **Circumstance**: +1 or +2, counting toward the cap of 4, declared by the GM with the stakes before the roll.
  - A Circumstance penalty of 1 or 2 base dice through the existing penalty step: after the cap, never below 1 base die, never Gear or Stress Dice (matches Alien p. 43 and Coriolis p. 49 exactly).
  - Help on a called roll: up to 3 comrades present and able, as the GM rules (Alien p. 43; Coriolis p. 49); it spends nothing unless the GM names a cost, and a comrade who could Help can Cover.
  - An improvised object gives Circumstance dice, never Gear Dice, so Gear Dice stay tied to rated items and to wear (ADR-0004).
  - Inside a Titan Engagement no Circumstance dice: the Nape strike, dodge, Fly, Break Attention, Break Free, and Treat Injury are measured with exactly the listed sources (ADR-0014:11-13).
- **Change and risk.** Section 1.7 item 1, section 1.3 step 5, section 1.8 *Outside a Titan Engagement*; a `circumstance` row in `bonus-dice-sources.yaml` with a `not_in: titan-engagement` limit; `CONTEXT.md:167-173` (Help, Bonus Dice). Risk: Help plus Circumstance reaches the cap on every called roll and failure stops meaning anything; cap Circumstance at 2 and tell the GM it reflects the situation, not the eloquence of the description.

### E5. Retries

- **Now.** `01-core-rules.md:30`. Chapter 7's "never tried again" on the Leg roll (`07:158`), hazard roll (`:165`), Straggler Endure (`:202`), camp roll (`:212`), Size Up on the quartermaster (`:386`), Sneak for the Ambush (`:466`), Size Up in a Skirmish (`:620`); Treat Injury outside a fight retries only in a later care window (`03-harm-and-mind.md:443-464`).
- **Opens.** The GM allows another attempt when the situation has changed, and names what the retry costs (time, Stress, a worse hazard, a witness).
- **Recommend: open with a default for called rolls; keep closed where a procedure says never.** Default: no retry unless something changes (a new approach, a better tool, a different soldier, or time spent at a cost the GM names), the Coriolis p. 66 pattern. Each soldier tries a given obstacle once per changed situation. The procedure bans stay, because they are pacing and economy brakes (ADR-0009's one roll per Leg; one Requisition per Downtime).
- **Change and risk.** Section 1.1 item 4; GM's Guide. Risk: a Squad of four chains attempts; each failure still pays its stakes, which is what makes the chain costly.

### E6. Catalog entries marked `rolled: when_a_rule_calls`

- **Now.** Fifteen entries in `action-catalog.yaml`: `fly` (:640), `leap-clear` (:654), `ride` (:673), `death-roll` (:695), `fear-roll` (:709), `stress-response-roll` (:719), `gas-roll` (:729), `spot` (:742), `size-up` (:760), `survive` (:781), `persuade` (:800), `endure` (:825), `sneak` (:843), `recall` (:860), `performance-roll` (:918). Their calling rules and Help rows are rendered at `02-character-creation.md:1018-1034`; most exist only for Chapter 7 procedures.
- **Opens.** The field and social entries become the everyday called rolls: Spot to search a ruin, Sneak past a guard, Persuade a villager, Size Up a stranger, Recall a regulation, Survive to find water, Endure a cold night on watch, Ride to catch a runaway horse, Fly to reach a rooftop.
- **Recommend: split.**
  - **Open with guidance:** `spot`, `sneak`, `persuade`, `size-up`, `recall`, `survive`, `endure` anywhere outside a Titan Engagement; `ride` and `fly` outside a Titan Engagement (a Chase is unwritten).
  - **Keep closed:** `fear-roll`, `stress-response-roll`, `gas-roll`, `death-roll`, `performance-roll` (fixed rolls whose tables are tuned or measured), `leap-clear` (the falling Titan's measured test, `titan-harm.yaml:408`), and `fly` inside a Titan Engagement (its needs come from the Anchor Rating rows, `05-titan-engagement.md:166-215`).
- **Change and risk.** A new `rolled` value such as `when_a_rule_or_the_gm_calls` on the nine open entries, and each open row's `help_outside_titan_engagement` gains "or as the GM rules for a called roll". Re-render 2A.3 and 2A.4. The Foundry system reads the same enum (ADR-0012). Risk: the value is read by any tool that switches on `rolled`; the site's `shared-data.ts` loads the Catalog (`:95`), so check the Action card renderer before adding an enum value.

### E7. Character creation and Drives

- **Now.** The Lifepath is a rolled procedure; the Template Build and Free Build are "Allowed when the GM allows it" (`CONTEXT.md:82-88`), already a GM permission. The performance roll excludes Talent, Bonus, Gear, and Stress Dice and cannot be Pushed (`dice-pool.yaml:138-146`). Drives are "When I ..." triggers checked "without a judgment call" (`02-character-creation.md:438`, OQ-23); turn triggers work outside a Titan Engagement only where a rule extends them (OQ-36).
- **Opens.** The GM adjudicates "is the Drive met", allows a Lifepath reroll, or grants a Canon Tie.
- **Recommend: keep creation closed; open Drives narrowly.** Creation happens before play and is the player's; Class Rank has a mechanical edge (Top 10), so fiat there reads as favouritism. One narrow opening: a called roll outside a Titan Engagement counts as the soldier's own act for a Drive's act test, so a GM-called Fear Roll (E11) can be shrugged off by a soldier acting on their Drive.
- **Change and risk.** `enlistment.yaml` `drive_rules` turn tests and section 2.5, one sentence. Low risk.

### E8. Talents

- **Now.** ADR-0006:3: "Because deciding which Talent applies could become GM judgment, every Talent names the actions it applies to." `02-character-creation.md:484-490`: a Talent that does not name the entry adds no dice "however close the action seems". Conditions tie some dice Talents to procedure moments: Route Finder "on the Leg roll, as Lead" (`talents.yaml:180-183`), Stand Down "in a Skirmish" (`:208-209`), Menace "on a Parley made as a threat" (`:326-327`), Know the Stores "on a Requisition roll for ..." (`:264`), Camp Surgeon (`:235`), Wagon Master (`:253`). ADR-0016 guardrails 1 and 4 (`0016:24`, `:27`).
- **Opens.** The GM's choice of entry for a called roll decides which Talents apply; the GM could also let a Talent apply to a neighbouring roll.
- **Recommend: keep the naming rule closed; widen two conditions.**
  - The naming rule is what makes Talents legible, checkable, and computable in Foundry. The GM's one ruling is the entry; everything downstream follows.
  - Unconditional dice Talents on the open entries now apply to every called roll: Keen Eyes (spot, `:139`), Fieldcraft (survive, `:146`), Judge of Character (size-up, `:171`), Silver Tongue (persuade, `:199`), Book Learning (recall, `:225`), Long Haul (endure, `:294`), Quiet Step (sneak, `:336`), Underground Instincts (sneak and size-up, `:364`), High Vantage (spot and sneak with working ODM Gear, `:120-123`). This is a real buff to the Tactician, Leader, and Hunter lists outside the fight, which is desirable.
  - Widen Menace to "a roll made as a threat" and Stand Down to "against a person", so intimidation and talking down work in social scenes, not only in a Skirmish. Leave Route Finder, Know the Stores, Camp Surgeon, and Wagon Master as procedure Talents.
  - Rule Talents are unaffected: every trigger is still a written event.
  - ADR-0011's first-level gate ("used that action successfully without it during the session") becomes reachable outside a fight, which helps the XP rules when written.
- **Change and risk.** `talents.yaml` two conditions; re-render 2A.1; ADR-0006 reason sentence amended. No simulator row: none of these names a measured roll (ADR-0016:34). Risk: social Talents outrank Titan Talents in the future XP economy; price them when the XP rules are written.

### E9. Squadmates

- **Now.** `02-character-creation.md:705-710` (players direct; roll-off on disagreement); `:710` and `squadmates.yaml:103` "the GM never directs a Squadmate". The playtest configuration runs none (`CONTEXT.md:64-66`).
- **Opens.** The GM runs Squadmates as NPCs with their own will.
- **Recommend: keep closed.** Squadmates are the Squad's, and the reference Squad of 4 PCs plus 2 Squadmates is measured under player policies (ADR-0014:11). The GM may voice a Squadmate's personality; it does what the players direct.
- **Change and risk.** None; one clarifying sentence in the GM's Guide.

### E10. Harm, Critical Injuries, Down, Death Rolls, healing

- **Now.** `03-harm-and-mind.md:37` "No rulings. The GM never decides whether harm happens, its kind, its amount, its Injury Location, a row, or how long an effect lasts." `health.yaml:27` (a closed list of harm kinds); `critical-injuries.yaml:34`, `:117` (`gm_choices: none`); ADR-0005; ADR-0017:5 (the 2D6 bell curve that lethality rests on). Falls outside a Titan Engagement already take the band "the rule that makes the soldier fall names", low by default (`04-gear.md:313-335`).
- **Opens.** The GM names harm as the stakes of a called roll: a fall from the wall, a cut on broken glass, a beating in an alley; lets a medic treat in a quiet scene; picks a Critical Injury for drama.
- **Recommend: open a consequence menu outside a Titan Engagement; keep the tables closed.**
  - A ruling may name a **fall** (Chapter 4's procedure, with the GM naming the band) or **damage of 1 to 3** of a named Injury Type (4 only for a gunshot-level danger, matching the musket, ADR-0018:14). Damage reaches the Critical Injury tables only at 0 Health, as all human harm does.
  - A ruling never inflicts a Critical Injury directly, never picks a location, row, or time limit, and never touches a Death Roll or healing time. ADR-0005 and ADR-0017's curve stay intact.
  - Care windows stay the healing economy; no ruling opens an extra one.
- **Change and risk.** Section 3.1 *The kinds of harm* adds "damage or a fall a ruling names as a called roll's stakes"; `health.yaml` gains that source; `03:37` narrows. Risk: unmeasured harm adds deaths the playtest cannot separate from rules deaths; cap it by the menu, require it to be stated before the roll, and log it (section 6).

### E11. Stress, Stress Responses, Fear Rolls, Scars, Grief

- **Now.** `01-core-rules.md:155` "Stress changes only through a trigger in that file. The GM never raises or lowers Stress without one"; `stress-changes.yaml:3-5`. `:178` a Fear Roll comes only from the closed list; `03-harm-and-mind.md:647-666`; ADR-0003 item 1 (`0003:9`), reaffirmed "stays closed" in batch 7 (`0003:35`); `fear-rolls.yaml:117`. Scars from a closed list (`03:748-760`); Grief closed (`03` section 3.14).
- **Opens.** +1 Stress as the cost of a failed called roll; a Fear Roll for an unlisted horror (Alien lists a truly horrifying event as a GM panic trigger, `research-alien-evolved.md:131`); Stress relief for a good scene.
- **Recommend: split.**
  - **Stress gain: open with a limit.** A ruling may name +1 Stress as a called roll's stakes, one per failed roll, through a new `ruling` row in `stress-changes.yaml`.
  - **Stress loss: keep closed.** Fight-start Stress, Camp Relief, and Downtime relief are the measured and designed release valves; free relief flattens the veteran spiral ADR-0008 describes.
  - **Fear Rolls: keep closed inside a Titan Engagement; open outside one with a limit.** Inside, the Grab cells and the deaths bands read Fear results (`03` design note 8-40; ADR-0014:7). Outside, the GM may call one Fear Roll per scene for an event at least as horrifying as a listed trigger (a devoured village, a comrade's remains), as a `gm-horror` trigger row with `can_arise_outside_titan_engagement: true`.
  - **Stress Response, Scar, and Grief tables: keep closed.**
- **Change and risk.** `stress-changes.yaml` row; `fear-rolls.yaml` trigger row; section 3.12; ADR-0003 item 1 reworded in its successor; `CONTEXT.md:191-193` (Fear Roll). Risk: Fear rows at high totals give Scars, and five Scars retire a soldier, so GM horror is a Scar faucet; the once-per-scene limit and the Drive shrug-off (E7) are the brake.

### E12. Gear, wear, falls, Standard Issue, Squad Supply

- **Now.** `04-gear.md:37` "No rulings" (wear, falls, what an object counts as, Standard Issue, Squad Supply); `standard-issue.yaml:145`; `squad-supply.yaml:45` and `04:609` "The GM never spends, adds, or removes units"; `falls.yaml:104`. ADR-0004 (wear only from a Pushed Gear Die 1). ADR-0016 items 3 and 8 (`0016:9`, `:14`).
- **Opens.** Supplies found on a search; a Blade Set or flare lost as a failed roll's cost; an improvised object's value; a fall's band.
- **Recommend: keep wear and Standard Issue closed; open Squad Supply and losses with limits.**
  - Wear stays the Push's price (ADR-0004). A ruling may instead stake a unit of Squad Supply or a carried item.
  - Standard Issue stays the reference kit (ADR-0014:11).
  - A successful called search may add at most 1 unit per success of one kind the place plausibly holds. Scarcity is the design (Alien p. 152, "limit resources"; Coriolis p. 250 on attrition).
  - Improvised objects give Circumstance dice (E4), not Gear Dice.
- **Change and risk.** `04:37` rewritten; `squad-supply.yaml` `added_by` gains `ruling` with its limit; section 4.10. Risk: supply inflation erodes the Expedition's ration pressure; the per-success cap and the GM's Guide warning hold it.

### E13. Requisition and Scarcity

- **Now.** `07-playtest-rules.md:35` ("whether Command grants a Requisition"); `:349-381` the gate, needs, and roll; `:383-390` the ledger; the list at `:398-422`; ADR-0016 items 3 and 8.
- **Opens.** Scarcity for an off-list item; Circumstance for leverage (a favour owed, a Commendation, a captured specimen); Command's reasons.
- **Recommend: open with guidance; keep the brakes closed.** The GM may place a charter-compliant item on the list at a Scarcity (ADR-0016's era rules still govern) and may apply Circumstance for leverage. Keep the Funding gate, the ledger, one Requisition per Downtime, and Command's answer standing after the roll: they are the only brake on gear climbing past the reference builds (`07` design note after the list).
- **Change and risk.** Section 7.3 and `requisition.yaml` list preface. Risk: a GM-placed item that rates a measured roll (ODM Gear, Blade Sets, horses) moves Titan figures; charter item 7 (`0016:13`) should require such an item to be at least Limited and marked unmeasured.

### E14. Titan Engagement: starting and framing

- **Now.** `05-titan-engagement.md:78` "When the table starts a Titan Engagement is scene framing, not a rule"; the setup table fills whatever the starting rule leaves (`engagement-setup.yaml:11-16`); `06-standard-titans.md:34` "The GM never picks which Titan appears"; everyone starts Distant (`05:91-99`, OQ-75 "leaves nothing to judge").
- **Opens.** The GM frames a Titan Engagement as a Mission Brief would: which Titan, the Anchor Rating, Background Titans, starting Positions for an ambush.
- **Recommend: open with guidance.** The GM may name what a Mission Brief could name; the setup table is the default when the GM names nothing. Keep closed: the retreat clock at 8 (the length that leaves the fewest dead, ADR-0014:41), and no starting Position closer than In Reach. Warn that the setup mix is what Chapter 6's deaths bands read, so a table that frames Large Titans with Background Titans every time plays above the tuned lethality.
- **Change and risk.** Section 5.1, `06:34`, `engagement-setup.yaml` `used_when` adds "or the GM names". Risk: lethality drift by framing; unmeasured by design, logged in play.

### E15. Titan Engagement: Behavior Tables, target selection, Attack Dice, the Reaction

- **Now.** ADR-0001:3 (a natural disaster that acts from a table), ADR-0010:3-5 (teamwork from public Attention), ADR-0019:3-5 (Attack Dice rolled in the open, "so the GM chooses nothing"), ADR-0003 item 8 (`0003:16`). `05:65-73` (no rulings on Attention, behavior, target, moves, regeneration, ending); `behavior-procedure.yaml:92`, `:122`; `attention.yaml:214`; `titan-format.yaml:64`; `01-core-rules.md:257-278`.
- **Opens.** The GM picks the behavior or the target for drama, adjusts Attack Dice, or lets a bold act pull Attention off the ladder.
- **Recommend: keep closed.** Four reasons, any one sufficient. (1) Dread: a Titan that the GM steers is a combatant, which ADR-0001 rejected; the horror of canon Titans is that they are mindless. (2) Teamwork: Break Attention, Draw Attention, decoys, and Hook and Cut are plans the players make against a public, predictable ladder; a GM pick turns planning into guessing. (3) Tuning: every ADR-0014 target and Chapter 6 band lives here. (4) Trust: open Titan Dice that stand are the rule players will test hardest at the table. The GM narrates; the table decides.
- **Change and risk.** No rule change; the new section 1.1 lists this under "where the GM does not rule". Risk of keeping it closed: an improvised stimulus (a burning wagon) has no rung; E17 handles it through an existing entry's effect.

### E16. Titan Engagement: the Nape, Openings, steam, the falling Titan, corpses, Pinned, the Grab, the retreat, the end

- **Now.** ADR-0007 (Nape-only kill); ADR-0016 item 4 (`0016:10`); `titan-harm.yaml:408` `gm_choices: none`; `engagement-flow.yaml:160` and `05:893` "The GM never ends a Titan Engagement"; `squad-tactics.yaml:30`; the Grab countdown (ADR-0019:5; ADR-0014:7).
- **Opens.** A kill by other means, a softened steam burn, a narrative escape from a Grab, an early end.
- **Recommend: keep closed.** The Nape-only kill is canon and charter; the Grab countdown is the tuned rescue window (six cells); steam and corpse heat are deliberately data-shaped with no Reaction (ADR-0017:18). The GM narrates aftermath.
- **Change and risk.** None.

### E17. Improvised acts inside a Titan Engagement

- **Now.** `01-core-rules.md:229` (an action is Help or one Catalog entry); section 2.9 routes everything else to "no effect" unless a tracked value matches; ADR-0010:5 (soft levers, no flat penalty for acting alone).
- **Opens.** Collapse a chimney on a Titan's leg; cut a wagon loose as a decoy; swing a lantern; kick a comrade clear of a closing hand.
- **Recommend: open with guardrails.** A called act in a Titan Engagement spends the soldier's action, uses the pool of the nearest entry whose effect it imitates, and may produce only that entry's effect at that entry's size: a decoy under Break Attention's needs; the loudest flag under Draw Attention's rules (never from Distant); successes toward a Body Part's Toughness as a Body Part strike; at most the Openings that entry could create; a comrade's Position step; an item passed. It never kills, never changes Nape Depth or Attack Dice, never cancels a card, takes no Circumstance dice, and carries its model entry's restrictions (the Attention holder still cannot strike the Nape). This matches charter item 4's list of what new things may do (`0016:10`). It opens creativity while reusing effect sizes the simulator already measured.
- **Change and risk.** `01:229` "or a called act"; section 2.9's Titan Engagement clause; `uncatalogued_actions` gains an `in_titan_engagement` rule; the tracked-values list becomes the in-fight effect menu. Risk: reskinning (a "falling beam" that is really a free Nape cut); the model-entry rule closes it.

### E18. Standard Titan stat blocks, Abnormals, hidden values

- **Now.** `06-standard-titans.md:34`, `:40-48` (which Titan appears), `:60-62` (Abnormal values hidden until Read); ADR-0016 items 5, 6, 7, 9; the Abnormal bar (section 6.6).
- **Opens.** A "big one" with more Toughness; a table-made Abnormal; revealing hidden values for drama.
- **Recommend: keep standard numbers closed; open table-made Abnormals with a label; keep Read-gating closed.** A GM may build an Abnormal in the Chapter 5 format with the closed effect list and ladder tests (charter item 6), played as unmeasured. Hidden values are revealed by Read only, because Read is a player lever with a Tactician list built around it.
- **Change and risk.** A GM note in section 6.5; ADR-0016 item 7 notes that a table's own Titan is unmeasured. Risk: overtuned homebrew; the label is the mitigation.

### E19. Expeditions: Legs, Formation Posts, hazards, Night Camp

- **Now.** ADR-0009:3; `07-playtest-rules.md:35` (no rulings on route, hazard, hazard victim); route set once by the Brief (`:45-60`); Leg roll (`:152-161`); hazard table (`:163-194`); Straggler's random victim "because the owner asked that the players not pick whom the Titan takes" (`:196-206` and design note); Night Camp (`:208-234`); `hazards.yaml:21`; ADR-0010:7 (Posts assigned by Command).
- **Opens.** The GM as Command authors the route and Posts; frames scenes at Waypoints (search the abandoned town, find survivors); adds authored hazards; chooses the Straggler.
- **Recommend: open with guidance; keep the ride's engine closed.** Waypoint scenes between Legs run on called rolls; the GM authors the Mission Brief. Keep closed: the Leg roll, the hazard and night rolls with their modifiers, "always advance", rations, and the Straggler's random victim (a GM pick is worse for trust than a player pick). A rolled hazard row stands; the GM describes it and never softens or swaps it. Authored dangers belong to Waypoint scenes, not in place of the roll (Coriolis's "tables inspire" advice, p. 250, is rejected for rolled rows for the same trust reason as E15).
- **Change and risk.** Section 7.1 gains *Waypoint scenes*; `legs.yaml` day steps note the optional scene; `07:35` narrows; ADR-0009 amended (the guarantee unchanged). Risk: longer Expeditions with unmeasured harm; Expedition figures were never measured (`07` design note before section 7.2; `tools/sim/report.py:118-121`), so log them.

### E20. Downtime

- **Now.** `07-playtest-rules.md:262-338`: a closed menu (Recover, Visit Haven, Requisition, Maintain Gear), the fixed infirmary, one Squad Action; Train, Investigate, and Contribute to Research wait for Phase 2 (`CONTEXT.md:571-573`).
- **Opens.** Scenes inside the Walls: investigating a noble, meeting the Underground, chasing a rumour, visiting a family.
- **Recommend: open with guidance.** One new Downtime Action (working name *Pursue a Lead*) that spends the soldier's action on a called-roll scene, with outcomes from a short menu: an Intel Question answered truthfully (`CONTEXT.md:600-601`), a named contact, or Circumstance on the Squad's next Requisition. Keep the infirmary, the relief amounts, and one action per soldier closed. It doubles as a playtest stand-in for Investigate.
- **Change and risk.** `downtime.yaml` row, section 7.2 table, a tracked value in the Catalog, `CONTEXT.md` Downtime Action. Risk: scope creep before the playtest; it can wait for Phase 2 if the batch must stay minimal (question 14).

### E21. Skirmishes, Foes, Grit, the Ambush

- **Now.** `07-playtest-rules.md:35`, `:567` "Every Foe acts by this rule and no other. The GM chooses nothing"; the foe rule (`:565-590`); Grit (`:592-597`); ADR-0018:3 ("the GM chooses no target and no retreat") and `:9` (GM-chosen targets and morale rejected under ADR-0003 item 8); ADR-0003 batch 7 (`0003:35`). OQ-155 (d) flagged "if the Squad approaches unseen" as a judgment (`OPEN-QUESTIONS.md:3329`). The Skirmish probe is reported, not tuned (`tools/sim/cases.py:291-316`).
- **Opens.** People act like people: go for the medic, flee, take a hostage, call for help, surrender when the officer falls; the GM improvises Foe kinds; the GM rules whether the Squad can approach unseen.
- **Recommend: open with a default.**
  - The foe rule is the default and the probe's baseline. The GM may direct a Foe's target or action when the fiction gives that Foe a reason, and says the reason aloud.
  - Keep closed: Foe Attack Dice and Guard rolled in the open from the Foe row and never adjusted; damage and Net Successes; the kill-or-out-cold rule by Injury Type (ADR-0018:16); a Foe never attacks a Down soldier (decision 8-30), which prevents the one ruling that would feel like an execution.
  - Grit is the latest a group breaks: the GM may break or surrender a group sooner, never later.
  - A table-made Foe kind uses the Foe row fields, with Attack Dice and Guard no higher than the Military Police trooper's 7 and 4 unless marked unmeasured.
  - The GM rules whether a Sneak for the Ambush is possible.
  - Reason: Skirmish lethality is not an ADR-0014 target (`07` design note before section 7.5), and both parents run NPCs by GM ruling (Alien p. 157; Coriolis p. 48).
- **Change and risk.** Section 7.4 foe-rule preface and `foes.yaml` `foe_rule` preface; ADR-0018 amended; ADR-0003 item 8's Foe clause removed; `CONTEXT.md:525-527` (Foe "run from the foe list by a closed targeting rule"). Risk: trust ("the GM focused me"); stating the reason aloud and the Down-soldier ban carry it.

### E22. Parley, Size Up, and social play generally

- **Now.** Parley is once per soldier per Skirmish with needs from Grit (`07:599-615`); outside a Skirmish only before a Foe group from the list, once per soldier with that group (`:616`); Size Up exists only on the quartermaster (`:386`) and on a Foe group (`:618-620`). No rule covers any other NPC. Faction Standing, when written, is "added to the dice for dealings with that Faction" (`CONTEXT.md:44-46`), which is already a dice modifier.
- **Opens.** Every conversation with any NPC can be a called Persuade (or Strength for a threat, as Parley does), Size Up, or Recall; the GM sets needs by the size of the ask; the GM decides what a refusal costs.
- **Recommend: open fully with guidance.**
  - Needs by the ask: 1 for a reasonable ask, 2 for a costly one, 3 for one against the person's interest (the Parley asks already scale this way).
  - Failure moves things on: a refusal, a price, suspicion, a report to the Military Police (Coriolis p. 251).
  - A retry needs a changed situation (E5).
  - Size Up on a person gets a truthful answer, like an Intel Question.
  - No social roll ever decides what a player character feels or does.
  - The in-Skirmish Parley keeps its Grit structure; "Parley outside a Skirmish" becomes one case of a called social roll.
- **Change and risk.** `07:616` rewritten; `persuade` and `size-up` rows (E6); GM's Guide social section; `CONTEXT.md:557-559` (Parley). Risk: Empathy soldiers carry scenes; that is what Silver Tongue and Judge of Character are for, and a Push still costs Stress.

### E23. GM-only hidden values and secret rolls

- **Now.** The tracker is public except an unrevealed Next Behavior and an Abnormal's hidden values (`05-titan-engagement.md:314-316`; `round.yaml:125-166`); the Next Behavior is rolled out of sight once (`05` design note OQ-80, "the hidden die is rolled once and never again"); ADR-0023:11 (the GM's Guide redacts hidden values).
- **Opens.** Secrets the GM authors (an NPC's real motive); secret passive rolls (Alien p. 44); a quietly changed Next Behavior.
- **Recommend: keep Titan secrets closed; open authored secrets; open secret rolls narrowly.**
  - A hidden Next Behavior is never changed after it is rolled.
  - Authored NPC truths are the GM's by nature.
  - A secret roll is allowed only for passive detection outside a Titan Engagement (a Spot or Size Up against something the soldier does not know is there). It cannot be Pushed, and its Stress Dice count successes but cause no Stress Response, as in Alien p. 44.
  - Every other roll is made in the open.
- **Change and risk.** A `passive-roll` row in `dice-pool.yaml` `roll_exceptions`; section 1.5's cannot-Push list; GM's Guide. Risk: secret rolls erode the open-dice trust; keep them rare and name them in section 1.1.

### E24. The simulator and ADR-0014 targets

- **Now.** The engine reads `data/` at start and "never chooses; it calls these functions" (`tools/sim/policy.py:1-7`; `tools/sim/README.md:3-7`). ADR-0014:3-13 names the targets and the baseline policy; `data/titans/tuning.yaml:34-42` the baseline.
- **Recommend: keep every measured roll closed**, so every target keeps its meaning. Full analysis in section 6.

### E25. The website and the data-sharing ADRs

- **Now.** ADR-0020:3 (one data source; the site's prose is a separate product rewrite with a "needs resync" warning); ADR-0020:5 and ADR-0023:11 (a GM's Guide with hidden values). The site's rules content is mostly stubs: `rules-of-play.mdx` is 77 lines covering the Push only, and the other rules and GM pages are 10 to 12 lines of front matter (`site/src/content/gm/running-titans.mdx:1-12`). No site page yet prints "The dice are final". `dice-rules.ts:57-80` rolls any pool from 0 to 12 base dice with no Bonus Dice cap or penalty logic, and `shared-data.ts:95` loads the Action Catalog for Compendium cards.
- **Opens.** A GM's Guide page on making rulings; "The GM calls for rolls" in Learn to Play.
- **Recommend: open.** No website ADR changes. Write the site's core-rules prose after the decision, which avoids rework. The dice tray needs no code for Circumstance dice (a pool is a pool); an optional Circumstance stepper on `TryRollButton` is a nicety.
- **Change and risk.** A new `site/src/content/gm/` page; resync of `rules-of-play.mdx` (its `sources` pin `01-core-rules.md`, so the build flags it by design); check the Action card renderer if `rolled` gains a value (E6). ADR-0021 and ADR-0022 are unaffected. Low risk.

### E26. The playtest packet

- **Now.** `docs/playtest/wings-of-freedom-playtest-packet.html:187-195` "The dice are final", including a "Rules decide" bullet at `:193` that the chapter does not have; "GM never" at `:290`, `:979`, `:1216`, `:1315`, `:1579`, `:2307`; actions outside the Catalog at `:1138`. Artifact Version 2 is published and the next step is the owner's review, then the first playtest (`HANDOFF.md:3`). A rule change goes through a decider batch first, then chapter prose and YAML together (`HANDOFF.md:24`), then a republish to the same URL (`:27`).
- **Recommend: change it in the same batch, before the first playtest.** A playtest run under "no rulings" would test the stance the owner has just reversed. Keeping the Titan Engagement closed means the packet's Titan, Grab, and tuning pages stand unchanged.
- **Change and risk.** Rewrite `core-dice` and `actions-outside`; narrow the harm, gear, Expedition, and Skirmish "never" lines; add a GM section on rulings; republish Version 3. Risk: the owner's review cycle restarts, which is acceptable because the change is concentrated in a few sections.

---

## 4. What stays true

1. **Results stand.** Once dice are rolled, no one overrides, re-rolls, or ignores a die or a table result, and the stakes named before the roll do not change. WoF keeps this against Coriolis p. 250. The GM's judgment acts before the roll (whether to roll, what it needs, what it risks), never after.
2. **Titan Dice and table rolls are made in the open and never adjusted** (ADR-0019:5; ADR-0003 item 8). The same holds for Foe Attack Dice and Guard, hazard rolls, the Night table, and the setup table.
3. **The GM never fudges a hidden roll.** The Next Behavior is rolled once, out of sight, and stands until it resolves or is Read.
4. **A Titan is a disaster, not a combatant.** Behavior Tables, the Attention Ladder, Attack Dice, the effect list, the Nape-only kill, the Grab countdown, steam, the falling Titan, and the retreat clock run as written.
5. **The Push is the player's lever.** The GM never forbids or forces a Push; only written rules do (a Scar's "you must Push", `scars.yaml:117-119`; a roll exception).
6. **Dice modifiers keep the parents' floor.** Circumstance dice count toward the cap of 4; a Circumstance penalty comes after the cap, never takes base dice below 1, and never touches Gear or Stress Dice.
7. **Talents name Catalog entries.** The GM names the entry; the Talent follows.
8. **Stress relief, the Critical Injury tables, Death Rolls, healing, Scars, and Grief stay rules-only.** Rulings may cost a soldier; only rules may heal one.
9. **Players direct Squadmates.**
10. **Procedures stay data.** Every written procedure is still a table, track, counter, or trigger in YAML for the Foundry system (ADR-0012). A ruling is a prompt at the table, not a missing rule.

---

## 5. Principles to write: candidate replacement for Chapter 1 section 1.1

Modelled on Alien p. 42 to 43 and Coriolis p. 47 to 49 and 250 to 251, in WoF's register. A draft for the decider, not a decision.

> ## 1.1 Rolling dice and the GM's rulings
>
> 1. **Roll when it matters.** A soldier rolls when a rule or a table result calls for a roll, and when they attempt something no rule covers whose outcome is in doubt and whose failure would cost something. If failure would change nothing, or the soldier has the time, the tools, and the training to do it without pressure, it happens without a roll. If it cannot be done, the GM says so before anyone rolls.
> 2. **Name the roll and the stakes first.** For a roll no rule calls, the GM names the Catalog entry closest to the act (so its attribute, its gear items, and any Talent that names it apply), or an attribute alone if no entry fits; the successes it needs (1 as a rule, 2 when it is hard, 3 when it is extraordinary); and what failure costs. The player may change their approach before the dice are rolled. Then the pool is built as section 1.3 gives.
> 3. **Circumstances.** Outside a Titan Engagement, the GM may rule that the situation helps or hinders the attempt: up to 2 Bonus Dice, which count toward the cap of 4, or a penalty of up to 2 base dice, applied after the cap, which never takes a pool below 1 base die and never removes Gear or Stress Dice. Comrades who are present and able may Help, as the GM rules.
> 4. **Results stand.** Once the dice are rolled, the GM never overrides, re-rolls, or ignores a die or a table result, and never changes the stakes. A roll changes only through a Push or a rule that names the change. Titan Dice, Foe dice, and table rolls are made in the open.
> 5. **Failure costs what was staked.** A failed roll does what its rule states, or, for a called roll, what the GM named: the soldier does not get what they wanted, or gets it at the named cost. A cost comes from the GM's Guide list: Stress, a fall, damage, a lost item or unit of Squad Supply, lost time, or a worse situation. Failure should move the story on, not stop it.
> 6. **Trying again.** In a Titan Engagement or a Skirmish, a soldier can attempt an action again on a later turn. Outside one, a rule that says a roll is never tried again is final. Otherwise a soldier tries again only when something has changed: a new approach, a better tool, another soldier, or time spent at a cost the GM names.
> 7. **Where the GM does not rule.** A Titan's cards, its Attention, its Attack Dice, the Reaction, what kills a Titan, the Grab, the Critical Injury, Stress Response, Fear Roll, Scar, and Death Roll tables, Stress relief, and gear wear follow their rules, and in a Titan Engagement every Bonus Die and penalty comes from a rule. The GM never directs a Squadmate.

A companion GM's Guide section should carry: roll sparingly; say the stakes aloud; give consequences that change the situation; people act with reasons, Titans without; and log every ruling that harms a soldier during the playtest.

---

## 6. Simulator and ADR-0014

**What the simulator is.** One engine that reads `data/` at start, applies the rules as data, and delegates every choice to published policies (`tools/sim/policy.py:1-7`; 19 `POLICY CHOICE` markers there). It models the Titan Engagement of Chapters 1 to 6 and a Skirmish probe. No case runs an Expedition (`tools/sim/report.py:118-121`), and the Expedition targets wait for rules that "exist" (`data/engagement/tuning.yaml:1074`).

**What it can still validly measure.** The rules-as-written baseline with no rulings, which is the right definition of every target:

- every ADR-0014 target (`0014:3-9`): the prepared-Squad kill in about 3 rounds, the lone Rookie's 8% to 14% fresh cut, the Levi-grade cut near 50%, the Grab cells, the gas medians;
- Chapter 6's bands and the Abnormal's bar, including the Medium deaths limit of 0.08 through the end of the Titan Engagement (`0014:49`);
- the Jam test, Talent sensitivity rows, and the Skirmish probe as the foe-rule baseline (reported, not tuned);
- improvised acts in a Titan Engagement under E17's guardrails, since each reuses a measured entry's effect at its measured size (a decoy is a Break Attention row; a flag is a Draw Attention row).

**What it cannot measure.** Called rolls and their consequences; Circumstance dice; GM-framed starts that depart from the setup mix; GM-directed Foes; GM-called Fear Rolls; Waypoint and Downtime scenes; table-made Titans and Foes. None of these is modellable as a policy without inventing the GM, and none should be tuned.

**What ADR-0014 needs.** One amendment: targets describe the rules as written with no rulings, and no ruling may touch a roll a target, band, or bar reads (the Titan Engagement's rolls, E4, E15 to E17). Play outside those rolls is unmeasured, as Expeditions already are.

**Two follow-ups.**

1. If the owner wants Circumstance dice inside a Titan Engagement (question 2), measure before allowing: sensitivity rows for +1 and -1 base die on the dodge, the Nape strike, and the Body Part strike, beside the lone-cut band, the Grab cells, and the Medium deaths band. No figure is predicted here. Adopting E17 as written needs no rerun.
2. Target B (OQ-140, `0014:45`) retunes the Titans after the playtest from observed deaths. The playtest log must tag each death, Critical Injury, and Scar caused by a ruling, so the retune separates GM variance from the rules.

---

## 7. ADR plan

- **ADR-0001** (Titans act from Behavior Tables): no change; its successor text in ADR-0024 names the Titan's card as outside every ruling.
- **ADR-0002** (Shifters not playable): no change.
- **ADR-0003** (rules expressible as data): **superseded** by a new ADR-0024, "The GM rules where the rules are silent; procedures stay data", restating the surviving items (2, 4, 5, 6, 7 in a Titan Engagement, 8 for Titans and tables, 11, 13) and rewriting 1 (Fear closed inside a Titan Engagement), 9 (called rolls), 10 (tables as defaults), 12 (tracked values as an index), as ADR-0019 superseded ADR-0015.
- **ADR-0004** (Push costs Stress and gear): no change; called rolls Push like any attribute roll.
- **ADR-0005** (Titan attacks bypass Health): amend: a ruling's harm is damage or a fall, never a direct Critical Injury.
- **ADR-0006** (attributes and Talents): amend the reason sentence; Talents still name entries, the GM names the entry for a called roll, and Circumstance dice count toward the cap of 4.
- **ADR-0007** (Titans have no Health): no change.
- **ADR-0008** (Scars raise minimum Stress): no change; Stress relief stays rules-only.
- **ADR-0009** (Legs always advance): amend: Waypoint scenes between Legs; the guarantee and the hazard roll unchanged.
- **ADR-0010** (teamwork from Attention): no change; note that no ruling picks Attention.
- **ADR-0011** (growth through Talents): no change.
- **ADR-0012** (tables as YAML): amend: YAML holds the rules and default tables, rulings need no row, and every `gm:` or `gm_choices:` field names the ruling it allows or reads `none`.
- **ADR-0013** (Shifters use Intent Tables): revisit when Shifters are drafted; its reason ("the GM never has to pick a Shifter's target by judgment") no longer binds, though a Shifter's fight is Titan-measured content.
- **ADR-0014** (tuned by simulation): amend: targets read the rules with no rulings, no ruling touches a measured roll, and the playtest logs ruling-caused harm for target B.
- **ADR-0015**: already superseded; no change.
- **ADR-0016** (content beyond canon): amend items 6 and 7: the charter gates published data; a table's own Titans, Foes, and items are played as unmeasured and marked so.
- **ADR-0017** (sided locations and Injury Types): no change; a ruling's damage names its type.
- **ADR-0018** (humans roll): amend: the foe rule is the default, the GM may direct a Foe with a stated reason, Grit is the latest a group breaks, and the rejected option "GM-chosen targets and morale" is reversed.
- **ADR-0019** (Titan attacks rolled, Reaction cancels): no change; restated as a limit in ADR-0024.
- **ADR-0020 to ADR-0023** (website): no change; site content resyncs and the GM's Guide gains a rulings page.

**`CONTEXT.md` edits** (for the decider): new terms for the called roll, stakes, and Circumstance (check each against existing Avoid lists: Bonus Dice avoids "advantage, modifier", Severity avoids "difficulty"); revise Action Catalog (`:108-110`), Help (`:167-169`), Bonus Dice (`:171-173`), Fear Roll (`:191-193`), Foe (`:525-527`), Parley (`:557-559`), and Downtime Action (`:571-573`) if E20 is adopted.

**YAML fields that change wording** (each `gm:` or `gm_choices:` line): `squad-supply.yaml:45`, `health.yaml:27`, `hazards.yaml:21`, `falls.yaml:104`, and the Foe rule preface change; `squadmates.yaml:103`, `squad-tactics.yaml:30`, `engagement-flow.yaml:160`, `standard-issue.yaml:145`, `behavior-procedure.yaml:92` and `:122`, `attention.yaml:214`, `anchor-ratings.yaml:117`, `critical-injuries.yaml:34` and `:117`, `titan-harm.yaml:408`, `titan-format.yaml:64`, `fear-rolls.yaml:117` stay closed and need only a pointer to ADR-0024.

---

## 8. Open questions for the owner

Each with a recommended answer.

1. **Where do rulings stop?** Recommend: rulings apply everywhere except the rolls and procedures of a Titan Engagement listed in section 1.1 item 7; inside a Titan Engagement the GM only frames the start (E14) and rules called acts under E17's guardrails.
2. **May the GM add or remove dice on written rolls, and inside a Titan Engagement?** Recommend: Circumstance of up to +2 or -2 on any roll outside a Titan Engagement, none inside one (measured rolls). Revisit after sensitivity rows if the table wants terrain to bite in a fight.
3. **Difficulty through needs or through dice?** Recommend: needs first (1, 2, 3, as WoF already expresses difficulty), Circumstance dice second.
4. **Do results still stand, or may the GM adjust a result for the story as Coriolis allows?** Recommend: results stand. Judgment acts before the roll.
5. **Default for retries?** Recommend: no retry unless something changes; written "never tried again" bans stay.
6. **What may a failed called roll cost?** Recommend: a closed menu stated before the roll: +1 Stress, a fall with a GM-named band, 1 to 3 typed damage (4 for gunshot-level danger), a lost item or Squad Supply unit, lost time or a worse situation, or a Skirmish or Titan Engagement that begins. Never a direct Critical Injury.
7. **Fear Rolls beyond the closed list?** Recommend: closed inside a Titan Engagement; outside one, one GM-called Fear Roll per scene for a horror at least as severe as a listed trigger.
8. **May a ruling lower Stress or Grief?** Recommend: no. Relief stays in the written triggers.
9. **Foes: GM-run or foe rule?** Recommend: the foe rule by default, the GM may direct a Foe with a reason stated aloud, Grit is the latest break, Foe dice stay open, and a Foe never attacks a Down soldier.
10. **Improvised acts in a Titan Engagement?** Recommend: allowed, spending the action, imitating one existing entry's effect at its size, never a kill.
11. **Secret rolls?** Recommend: passive detection only, outside a Titan Engagement, no Push and no Stress Response.
12. **Widen Menace and Stand Down?** Recommend: yes, to "a roll made as a threat" and "against a person".
13. **Supersede or amend ADR-0003?** Recommend: supersede with ADR-0024, keeping the surviving drafting items as its limits.
14. **Timing and scope before the first playtest?** Recommend: one decision batch before the playtest covering section 1.1, section 2.9, the consequence menu, Circumstance outside a Titan Engagement, the Foe default, and the GM's Guide rulings section, with no Titan Engagement changes so no simulator rerun is needed; republish the packet as Version 3. Defer the Downtime *Pursue a Lead* action (E20) and table-made Abnormal guidance (E18) to Phase 2 unless the owner wants them in the first playtest.
