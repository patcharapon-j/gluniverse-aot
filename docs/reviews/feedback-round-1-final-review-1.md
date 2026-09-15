# Playtest packet feedback round 1: final review 1 (wof-reviewer, Opus)

Date: 2026-09-15. Task: `docs/playtest/process/feedback-round-1-final-review-task-1.md`. Scope: Chapters 1 to 7 and their YAML, `CONTEXT.md`, ADR-0001, 0003, 0005, 0014 to 0019, decision batches 7 and 8 (7-1 to 7-18, 8-1 to 8-34), OQ-135 to OQ-165, the owner's decisions, and the playtest packet. The simulator report was read only for the verdict sentences. `tools/sim/run.py` was not run. The parallel Astra review was not read.

Severity follows the task file's guide. Throwaway dice scripts ran in the session scratchpad; their figures are quoted where odds matter.

## Counts

| | Critical | Major | Minor |
|---|---|---|---|
| New findings | 0 | 7 | 24 |
| Logged items confirmed (section *Known issues*) | 0 | 2 | 30 |
| **Total** | **0** | **9** | **54** |

Logged items dismissed, or confirmed as readings with no finding: 13 (listed under *Known issues*).

The packet's mechanical checks (banned words, em dashes, links, dice tables, print breaks, phone width, quick reference fit) were run by script. Headless Chrome timed out on the loaded machine, so the quick reference's page fit and the phone-width result are estimates from the CSS, not measured renders.

---

## Findings by file

Files are ordered by their most severe finding, and findings within a file most severe first. A finding that spans files sits under the file that is the source of truth for its fix.

### 1. `data/engagement/engagement-flow.yaml` and `background-titans.yaml`, with Chapter 5 sections 5.10 and 5.11 and the packet: how a Titan Engagement ends

#### M1. Major: decision 8-34 is not applied; the provisional OQ-165 reading still stands in YAML, chapter, and packet

- **Location:** `data/engagement/engagement-flow.yaml` lines 74 to 80 (`ending.tests.no-soldier-standing.past_the_stay_limit`) and line 101 (`always_ends`); `docs/rules/05-titan-engagement.md` line 881 (5.11, *No soldier standing*) and line 889 (*A Titan Engagement always ends*); packet lines 2993 and 4023.
- **Problem:** OQ-165 is marked Decided (8-34), and 8-34's chapter impact asks for three changes. First, the test names the grade: a soldier whom a lost-limb grade forbids every kind of move, today only both-legs. Second, it is checked as the first round past the stay limit begins, before its wings step. Third, the lift stays open: a comrade at their Position may still carry them out. None of the three is applied. All three sources still carry the provisional wording "can make no move of any kind", and the YAML and chapter still print `PROVISIONAL (OQ-165)`. 8-34 rejected that wording by name, because it also catches a soldier who lost one turn's move to a Reaction, a result, or a spent action under the one-leg grade. Without the timing, `checked` ("as soon as the event that makes a test true") has no event to fire on, since the start of a round is not an event.
- **Scenario:** Round 20 of a run-on retreat, and the stay limit closed in round 19. Private Tomas has lost one leg and spent this round's action on a Heave, so under the one-leg grade his on-foot move cannot be made. By the printed wording he "can make no move of any kind" this turn, so he is not standing. The last comrade has walked out and no soldier stands, so the fight ends and the limb-pinned Kurt dies under the body. By 8-34 Tomas stands, walks out next round, and Kurt's own Heave that round might free him. A second case: Anna, both legs lost, sits beside a limb-pinned comrade. One GM checks the test when the round begins and ends the fight. Another plays out Anna's turn, and her Heave reaches the Heave rating. One comrade lives and the other dies, on the same rules.
- **Fix options:**
  1. Apply 8-34 as written. Reword `past_the_stay_limit` and the chapter bullet to name the lost-limb grade that forbids every move (`lost_limb_riders`, `moves`), add the check "as the first round past the limit begins, before its wings step", and add that a comrade at their Position may still Lift Comrade them out. Replace both `PROVISIONAL (OQ-165)` markers with citations of 8-34.
  2. In the packet, reword lines 2993 and 4023 the same way and drop the Playtest rule tag, which marked the provisional reading.

#### M2. Major: a living Focus Titan that entered during the run-on switches the stay limit off, so `always_ends` fails in a common setup

- **Location:** `data/engagement/background-titans.yaml` lines 110 to 117 (the stay limit, "while no Focus Titan is alive"); `engagement-flow.yaml` lines 60 to 66 (`run_on`, "a Background Titan may enter") and 85 to 101 (`always_ends`); Chapter 5 line 848 and the design note at line 855 ("A living Titan is its own clock"); packet lines 2968, 2989, 4010 to 4014.
- **Problem:** 8-32 limits the stays only while no Focus Titan is alive. Its premise is that a living Titan is its own clock: its cards land, and its Grab counts down. That premise fails for a Background Titan that enters as a Focus Titan during the run-on, which `run_on` allows.
  - The entering Titan places every soldier at Distant. A retreat makes no Nape strike, so it can never die.
  - On the standard tables only a terrorize entry and Thrash reach Distant. On the Medium table these are Fixed Grin (Stress 1 and a telegraph) and Thrash. Thrash's knock loose affects only an airborne soldier or one On Body or at Blind Spot.
  - So soldiers who stay beside a comrade Pinned under the corpse, at In Reach relative to the corpse, take no harm that can end the fight.
  - Option 4 accepts Treat Injury as the staying action, and treating the corpse-heat Burns keeps the Pinned soldier from going Down. A limb pin has no instant-death row, and every lethal Burn row has a `day` limit.
  - During the retreat no clock fills and no one returns. No test ever becomes true while the players choose to stay and treat.
  - Two treaters with medical kits outpace one heat Critical Injury a turn: Wits 2 plus a kit rated 1 at Stress 1 succeeds about 52% of the time without a Push.

  An ending stays reachable by choice, but the guarantee that `always_ends` states, and that the simulator relies on, does not hold. The same Titan also moves every "anything else" comparison onto itself (`positions.yaml` `comparison.otherwise`). Soldiers Distant from it then count as sharing the Pinned soldier's Position for Treat Injury, wherever they stand relative to the corpse.
- **Scenario:** An interim setup rolls Background Titans on 5, one clock of 4. The Squad kills Medium Titan A in round 3. Its body falls, and Kurt is limb-pinned by the left arm, with both of A's arms already Broken, so only Heave frees him. At the end of round 4 Titan B enters. The retreat clock fills at round 8. Dieter and Hanne stay beside Kurt every turn by option 4, treating his Burns rather than Heaving, because each Heave costs the heaver 1 Burn damage. B plays Fixed Grin and Thrash at Distant. Nothing ends the Titan Engagement.
- **Fix options:**
  1. Bind the stay limit per comrade: a stay for a comrade Pinned under a corpse is limited in every retreat, whether or not a Focus Titan is alive. This is the narrowest change, and it matches 8-32's reason that a corpse is no clock.
  2. Or bind the limit while no living Focus Titan has a soldier at a Position other than Distant relative to it.
  3. Or remove Treat Injury from option 4's staying actions for a Pinned comrade, so every stay beside a pin makes the heave count or a Body Part count rise, and those counts never fall under a corpse.

#### KM2. Major (logged, confirmed): retreat options 3 and 4 compare a Down comrade relative to "the living Focus Titan with the earliest label", which does not exist in a run-on retreat

- **Location:** `background-titans.yaml` lines 118 and 119; Chapter 5 line 846 ("to the earliest-labelled living Focus Titan for a Down one"); the packet (line 2967) uses "as any other comparison", which is 8-20's corpse reading. The packet has changed a rule that the YAML still states.
- **Problem:** 8-20 moved every comparison made with no Focus Titan alive onto the corpse of the Titan that died last, but this file still names only the living Titan. The run-on retreat is exactly where Down comrades lie beside a corpse, and it is where the stay limit's first rounds run.
- **Scenario:** A run-on retreat after A's death. Hanne is Down at In Reach relative to A's corpse, and Dieter is at Distant. Dieter wants option 3 toward Hanne. The YAML gives him no reference to count steps from, so the GM has to invent one.
- **Fix options:**
  1. Apply 8-20 to lines 118 and 119: relative to the living Focus Titan with the earliest label, or, when none is alive, relative to the corpse of the Focus Titan that died last. Mirror it in Chapter 5 line 846.

#### Minor, this group

- **n4. Minor: corpse heat takes a pinned limb within about three turns, and the rules never say whether a limb that burns away still pins.**
  - **Location:** `data/engagement/titan-harm.yaml` lines 328 to 345 (`corpse_heat`) and 389 to 395 (`freeing`).
  - **Problem:** Each heat Critical Injury lands at the pinned limb with worsening, starting from the pin's own Crush Critical Injury. A script shows the limb lost at the 13-or-more row by the soldier's second heat turn 33.6% of the time, by the third 72.3%, and by the fourth 95.4%. A body pin reaches the torso's instant-death row by the third heat 34.2% of the time, and by the fourth 72.5%. A lone limb-pinned Rookie under a Medium corpse frees themself before going Down 23.0% of the time. Losing a limb is graded (owner item 4), and lost limbs are unmeasured (8-13), so a common pin now ends in a lost limb nobody measured. The freeing list is closed, so a soldier whose pinned arm is Arm Burned Away stays Pinned by that arm.
  - **Scenario:** Kurt is limb-pinned by his left arm under a corpse. On his third turn heat rolls 2D6+6, and 9 or more gives Arm Burned Away. The table asks whether he is still pinned by an arm he no longer has.
  - **Fix options:** (1) state in `pinned` that a limb pin whose limb is lost at the 13-or-more row stays a limb pin, or ends and frees the soldier; (2) add "limbs lost to corpse heat" to the packet's feedback page beside pins and Burn Critical Injuries; (3) if the owner finds this too harsh, stop corpse heat's worsening at the pin's own Critical Injury.

---

### 2. `data/campaign/downtime.yaml`, `data/character/squadmates.yaml`, and the packet: the playtest configuration

#### M3. Major: the Recruit Squad Action undoes the playtest configuration of 4 PCs and no Squadmates

- **Location:** `data/campaign/downtime.yaml` lines 115 to 120 (`recruit`); Chapter 7 line 313; packet lines 916, 920, 3272, and 3747 (the configuration note; the packet format check found the same contradiction); nothing in `squadmates.yaml` or Chapter 2 records the configuration.
- **Problem:**
  - Owner decision item 7 ("A now") runs the first playtest with 4 PCs and no Squadmates. The packet states that twice.
  - A playtest group does reach Downtime: the task requires a group to run Downtime and Requisition, and Requisition starts at the first Downtime.
  - At that Downtime, Recruit "New Squadmates join until the Squad Pool holds 6 minus the number of player characters", which is 2. Nothing says Recruit is unavailable during the playtest.
  - Chapter 7's design note (line 255) and the hazard tuning assume every Straggler is a PC.
  - The configuration lives only in a packet note and a Chapter 7 design note, with no YAML row a rule reads.
- **Scenario:** After the first Expedition, the players take Recruit, the default Squad Action for a Squad with no Grief. The second Expedition rides with two Squadmates. Straggler rolls of 1 to 4 now take a Squadmate, and every fight runs six soldiers, so the playtest no longer measures the configuration the owner chose.
- **Fix options:**
  1. Add a playtest configuration row (for example `squadmates.yaml` `playtest_configuration: {player_characters: 4, squadmates: 0}`) and have `recruit` read it: Recruit brings no Squadmate while the configuration is 0, so the Squad takes Honoring the Fallen.
  2. Or state in the packet's configuration note and the Squad Action table that Recruit is not taken during the first playtest.

---

### 3. `data/character/talents.yaml` and Chapter 2 sections 2.6, 2.7, 2A.1, 2A.2 (the 83 Talents)

The list passes its structural checks. It has 83 Talents: 33 dice and 50 rule. The nine lists of 8 and a general list of 12 meet 7-2's shape. All 112 `names` references exist in the Action Catalog, no Talent names Leap Clear, and Grip Breaker matches 8-26. No Talent text touches Attack Dice, Severity, or Net Successes.

#### M4. Major: once-per limits are undefined when a Titan Engagement or a Skirmish starts inside a Leg or a Night Camp

- **Location:** `talents.yaml` lines 44 to 57 (`limit_terms`: once per Leg runs "from its Leg roll to the end of its hazard"; once per Night Camp "from its camp roll until its day has passed"); `data/expedition/legs.yaml` lines 54 to 58; Chapter 7 line 100; `data/skirmish/skirmish.yaml` lines 386 to 388; packet lines 3078 and 3569.
- **Problem:** A once-per-Titan-Engagement Talent is also usable once per Leg and once per Night Camp. A Leg's hazard rows start Titan Engagements, and the Night table's Prowlers row starts a Skirmish, so these procedures nest. No rule says whether the nested procedure has its own use or spends the outer one.
- **Scenario:** A Hard Ride Leg. The Lead Pushes Ride and uses Sure Seat to ignore the horse's wear. The hazard rolls 7, Titan on the formation. In round 1 she Pushes a mounted dodge and wants Sure Seat again. One reading says the Leg's use is spent; the other says the Titan Engagement is a new procedure.
- **Fix options:**
  1. Add one sentence to `limit_terms`: a Titan Engagement or Skirmish that begins inside a Leg or Night Camp is its own procedure with its own use.
  2. Or: a use inside the nested procedure also spends the outer one.

#### M5. Major (widens logged item): eight older Talents on measured or fixed rolls carry no Playtest rule tag, and nothing in scope shows their sensitivity rows (ADR-0016 guardrail 4)

- **Location:** `talents.yaml` rows Hard to Kill (301), Relentless (369), Light Trigger (457), Wide Awareness (599), Unshaken Command (662), Shoulder the Load (692), Sure Hands (753), and Iron Nerve (1006); packet rows 833, 847, 853, 865, 870, 872, 877, and 898; Chapter 2 line 509 still says these "need a simulator check".
- **Problem:** Guardrail 4 applies to the whole 83-Talent list (task check 3). Every Talent that touches a measured roll or a fixed roll (Death Roll, Stress Response roll, Fear Roll, Gas Roll) needs a sensitivity row before it ships, or it is listed as unmeasured and tagged as a playtest rule.
  - Hard to Kill adds dice to the Death Roll, Iron Nerve changes the Stress Response roll, and Unshaken Command changes the Fear Roll. Relentless and Sure Hands change measured strike and treatment rolls.
  - None is tagged in the packet.
  - The logged item only asks to re-check the existing tags against the final report. It does not cover Talents with neither a row nor a tag.
- **Scenario:** A playtester's Veteran with Hard to Kill 2 survives three Death Rolls in one Expedition. The feedback page cannot tell the owner whether that odds shift was measured, because the packet presents the Talent as settled.
- **Fix options:**
  1. List the eight as unmeasured and tag them "Playtest rule" in the packet.
  2. Or add their sensitivity rows in the final rerun and cite them in Chapter 2 line 509.

#### Minor, this group

- **n16. Minor: the default once-per limit of guardrail 8 is missing on four Talents that change a cost or a roll count, with no stated exception.** Location: `talents.yaml` Quick Refit (832 to 842) and Rescue Ride (898 to 908), which turn an action into a move with limit none; Sure Hands (753 to 766) and Stay With the Column (1061 to 1076), which give a second Push with limit none. Nothing Wasted (1095 to 1108) makes a similar change and is limited. Scenario: a Medic Pushes every aftermath and care-window roll twice all session. Fix: (1) give the four the once-per-Titan-Engagement default (or its Chapter 7 equivalent); (2) or add a design note stating the exception and why.
- **n17. Minor: Formation Drill cannot trigger in the first playtest.** Location: `talents.yaml` line 619 (its trigger needs "the Squadmate on your Wing"); packet lines 919 and 920 (no Squadmates). Scenario: a Tactician takes it at creation and it never fires. Fix: (1) note it under the playtest configuration, or at the Tactician list, as "no effect in the playtest".
- **n18. Minor: capitalization of glossary terms in Talent text, and raw ids in Chapter 2.** Location: `talents.yaml` lines 177 to 180, 226, 232, 557, 728, and 934 write "lead" and "night camp", but `CONTEXT.md` has **Lead** and **Night Camp**. The packet capitalizes them, so its quote of Route Finder's condition and Camp Surgeon's description differ from the YAML. Chapter 2 lines 882 to 900 print Catalog ids in player text ("You declare rally.", "Your roll for treat-injury"). This joins the logged Lookout Tree item. Fix: (1) capitalize in YAML; (2) have the renderer print entry names, not ids.
- **n19. Minor: two Talent readings are loose.** Location: Headlock (`talents.yaml` line 983) says a Held Foe "surrenders, as a Parley's surrender ask gives", but that ask is a group effect that ends the Skirmish (`skirmish.yaml` line 334). Put In a Word changes Help but names `[persuade, recall]`, while Wide Awareness and Formation Drill name `help`. Scenario: a Brawler's Headlock makes one Bandit of three surrender, and the table disagrees about whether the Skirmish ends. Fix: (1) state that only the Held Foe is out of the Skirmish; (2) name `help` where the Talent changes Help.
- **n9 (part). Minor: stale Talent notes.** Location: `talents.yaml` line 887, where Sure Seat's description says "is Pushed in a Titan Engagement" but `legs.yaml` line 57 names Sure Seat on a Hard Ride. Chapter 2 line 509 says Sure Seat never applies outside a Titan Engagement "until the Chase or Expedition rules state", which Chapter 7 now does. Chapter 2 line 511 gives the wrong reason Saw It Coming is unmeasured, though its tag is right. Fix: (1) update the description and both notes.

---

### 4. The packet (`docs/playtest/wings-of-freedom-playtest-packet.html`), with the glossary entries it copies from `CONTEXT.md`: rule content, format, and language

Rule fidelity of the packet was walked for the Titan card, Critical Injuries and riders, a Titan's death with Steam, the fall, Pinned, Heave and the Corpse, the run-on and retreat, the Fear and Stress Response tables, Expeditions, Downtime, Requisition, and Skirmishes. Apart from the findings here and in groups 1 and 2, the packet follows the YAML. It also already carries several fixes the chapters lack: the Pierce healing exception in Downtime (line 3252), the Straggler victim's Attention at setup (3817), knock loose sparing a mounted target (3868), and 8-20's corpse comparison (2967).

#### M6. Major: the packet leaves out what decision 7-11 says the packet states about Squadmates

- **Location:** packet lines 911 to 935; `docs/rules/DECISIONS-2026-09-14.md` line 2292 (7-11); Chapter 2 lines 710 and 713 carry both texts.
- **Problem:** 7-11 requires two things in the packet. The first is one sentence on the two costs of fewer Squadmates: fights run about three times deadlier for player characters, and a dead player character has no one to promote. The second is one paragraph on what Squadmates are for (faster kills, Grab rescues, decoys and screens, the replacement pipeline, named comrades) and that the easiest way to run them is on Wings. The packet says only that "fights are far deadlier" and has no purpose paragraph.
- **Scenario:** After the playtest, a group reads the packet to choose its Squad size, drops the Squadmates, and learns only in play that they have tripled their deaths and lost promotion.
- **Fix options:**
  1. Add the cost sentence without simulation figures ("about three times as deadly for player characters, and a dead player character has no Squadmate to promote") and the purpose paragraph from Chapter 2 line 713.

#### M7. Major: the Grit glossary entry gives the wrong Parley need

- **Location:** packet line 4384 (glossary, Grit); its source `CONTEXT.md` lines 537 and 538; the rule is Chapter 7 section 7.4 (*Parley*), `data/skirmish/skirmish.yaml` `parley.needs` and `parley.outside_a_skirmish.needs`, and packet lines 3524, 3582, and 3583.
- **Problem:** The glossary says Grit is "the successes a Parley needs". The rule differs in both places a Parley is made:
  - In a Skirmish, a Parley needs the group's Grit plus 1, minus 1 for each of its Foes out of the Skirmish, never below 1, plus the ask's number.
  - Outside a Skirmish, it needs the group's Grit plus the ask's number.

  The glossary number matches neither for any ask, whenever no Foe is out yet. It is the definition a player looks up first, and since 8-33 raised the Military Police trooper's Grit to 4 the gap is felt at once.
- **Scenario:** A Skirmish against a Military Police patrol (Grit 4), with no trooper down. A player checks the glossary, reads that Parley needs 4, and asks "Stand down" with two Helpers. The GM reads the Parley rule, which needs 5. One side has misread the rule, and the result depends on which page was open.
- **Fix options:**
  1. Reword `CONTEXT.md` Grit to "How many of a Foe group's members must be out of the Skirmish before the group breaks and leaves, and the base of the successes a Parley needs", then mirror it in the packet glossary.
  2. Or give the whole need in the glossary: "Grit plus 1, less 1 per Foe out, plus the ask, in a Skirmish; Grit plus the ask outside one".

#### Minor, this group

- **n6 (packet part). Minor: Avoid-list words in packet rules text.** Location: "enemy" (Foe's Avoid list) in the Reaction rules at lines 361, 364, 373, and 387; "a pinning limb" at line 3649, where the Titan's part is a Body Part and "limb" is on Body Part's Avoid list; "a dead Titan's wrist" at line 1202 ("dead Titan" is on Corpse's Avoid list). Scenario: a player reads "one Reaction per enemy per round" and asks whether a Foe group counts as one enemy. Fix: (1) "each Titan or Foe", "the pinning Body Part", "a Corpse's wrist".
- **n12. Minor: two different lists of what a Squadmate cannot attempt.** Location: line 755 says "every entry except Push and Cover", but Push is not an entry; line 1026 says "except Cover and the Downtime Action". Fix: (1) use line 1026's list in both places and add "never Pushes".
- **n20. Minor (estimate): the quick reference fits one page only narrowly.** Location: packet lines 3601 to 3735 and the print stylesheet. A CSS estimate puts it at about 94% of a Letter page and 89% of an A4 page at 0.4 inch margins. A browser's default margins, or the Georgia fallback when Google Fonts do not load, push it to a second page; this could not be measured, because headless Chrome timed out. Scenario: a GM prints the packet on A4 at default margins and finds the Fear Roll table on a second page. Fix: (1) set `@page { margin: 10mm }` in the print stylesheet; (2) or trim the Expeditions and Skirmish boxes; then (3) verify with a real print preview on Letter and A4.
- **n21. Minor: the "For the GM" band prints white on white.** Location: packet line 44 (`.gm-band`, white text on the `--gm` background) and line 3739; there is no `print-color-adjust` rule, and browsers drop backgrounds when printing. Scenario: in a printed packet the page that opens the GM part has no visible heading, so players do not see where their part ends. Fix: (1) in print, give `.gm-band` no background, `color: var(--gm)`, and a border.
- **n22. Minor: design-document, roadmap, and programmer voice.** Location:
  - line 1121: the "Dormant and reserved entries" paragraph, a data-model note;
  - line 958 ("set by the XP rules, which this packet does not include") and line 981 ("nothing is recalculated");
  - roadmap wording at lines 3019 ("A later phase replaces them"), 3274, 4364, and 4394;
  - programmer phrasing: "evaluate the ladder" at lines 3898 to 3900, 3920, 3923, and 4002, where the player section says "check" (line 2644); "legally" at lines 1582 and 4322; "Starting Squadmates = 6 minus" at line 913;
  - line 4346 says "interim setup", where everywhere else it is the "setup table";
  - the Held-soldier rules at lines 3389, 3440, and 3581 are printed as live rules, though no playtest Foe Grapples (line 3473).

  Fix: (1) reword each in the brief's table voice; (2) move the Held-soldier rules into one sentence tagged for later Foes.
- **n23. Minor: lowercase game terms, and one wrong state name.** Location:
  - "prosthetic" or "prosthetics" on 15 lines (1385, 1402, 1406 to 1409, 1412, 1413, 1869, 2362, 2375, 3237, 3332, 3350, 4483), where `CONTEXT.md` has **Prosthetic**;
  - "heave count" in lowercase on 15 lines, against "Heave count" on 7 (157, 1049, 1178, 1202, 4342, 4605, 4609);
  - "next behavior" at lines 2647, 2783, and 4237, and "bonus dice" at line 4348;
  - the quick reference at line 3678 says Break Attention "frees a held soldier", where the state is Grabbed and Held is reserved for people.

  Fix: (1) capitalize as `CONTEXT.md` does and pick one form of the heave count; (2) "frees a Grabbed soldier".
- **n24. Minor: glossary entries drift from the rules.** Location (packet glossary, mirroring `CONTEXT.md` where the entry exists):
  - Standard Issue (line 4358; `CONTEXT.md` line 444) lists "a Specialty's kit", though only a Medic and an Engineer receive one (line 2271);
  - Rally (line 4294) omits clearing a pending Fear result and Rally outside a Titan Engagement;
  - Body Part (line 4315) gives "an ankle" as an example, though standard Titans' parts are eyes, arms, and legs (line 2579);
  - Call It (line 4348) omits the exclusions at line 2897.

  Fix: (1) correct the `CONTEXT.md` entries first, then mirror them in the packet.

---

### 5. `data/expedition/hazards.yaml` and `legs.yaml`, with Chapter 7

#### KM1. Major (logged, confirmed): a retreat from a Titan Engagement that the Night table starts is undefined

- **Location:** `legs.yaml` lines 157 and 158 and Chapter 7 line 147 define the retreat only for a Leg's Titan Engagement; Chapter 7 line 213 (night camp step 4) and `hazards.yaml` Night table row "Abnormal at night"; packet line 3797 ("A retreat on a Leg").
- **Problem:** The night row starts a Titan Engagement against the Sprinting Abnormal, and an eight-segment retreat clock makes a retreat likely in any long fight. No rule says what the retreat does to the night camp: stay at the Waypoint and go on to step 5, fall back a Waypoint, or re-roll the night hazard.
  - The Night table's 8-or-more row is reachable in normal play. At Deep with a failed camp roll it comes up on a D6 of 5 or 6, 1 time in 3. At Far with a failed camp roll, or at Deep with a successful one, it needs a 6, 1 time in 6.
- **Scenario:** A night at Deep with a failed camp roll. The D6 shows 5, for a total of 8: Abnormal at night. The Squad cannot kill it, and the retreat clock fills at round 8, so everyone walks out. The GM must now decide whether a day passes at this Waypoint and whether the next day rides on or rides the last Leg again. ADR-0003 forbids that choice.
- **Fix options:**
  1. A retreat from a night Titan Engagement ends it, and the night camp goes on at step 5 at the same Waypoint.
  2. Or the Squad falls back to the previous Waypoint as on a Leg, and the next day's first Leg rides the day's last Leg again.

#### Minor, this group

- **n8. Minor: Chapter 7's design note quotes two final-rerun Skirmish figures that `foes.yaml` does not carry.** Location: Chapter 7 line 663 gives "0.016 deaths in the ambush, and a 57.5% win for the lone Rookie"; `data/skirmish/foes.yaml` lines 70 to 91 record a `final_rerun` only for the patrol row. Where a chapter and its YAML differ, the chapter is wrong, and here the YAML is incomplete. Fix: (1) add `final_rerun` to the ambush and lone-Rookie rows.

---

### 6. Chapter 5 and Chapter 6 text, `titan-format.yaml`, `size-classes.yaml`

- **n1. Minor: stale PROVISIONAL sentences after the final rerun.** Location: Chapter 5 line 63 ("PROVISIONAL: the verdicts below were measured with those fixed needs, and the full simulator rerun re-measures each"); the Chapter 5 design note at line 463 ("PROVISIONAL: the full simulator rerun re-measures every target"); Chapter 6 line 31. Chapter 5 line 929 and Chapter 6 line 349 already say every verdict reads the final rerun and is Met. Fix: (1) rewrite the three in the past tense, citing the final rerun.
- **n2. Minor: probe figures presented as rerun figures.** Location: Chapter 5 line 975 gives the screen's rerun figures (round 2 on the boundary, 70.8%, 0.43) and then "round 3 (70.0%, 0.40, ...)" for the same row, which are probe figures. Line 1009's "69.4% ... after 5.58 Titan cards, with 0.20 Critical Injuries" are probe figures, and the rerun reads 70.3%, 5.63, and 0.17. Chapter 6 line 773's "(69.2%)" is unlabelled, though `data/titans/tuning.yaml` line 398 calls it a probe figure. Fix: (1) label each as the probes' figure, or replace it with the rerun's.
- **n3. Minor: the Heave rating's definition is incomplete outside `size-classes.yaml` and `titan-harm.yaml`.** Location: `CONTEXT.md` lines 379 and 383 tie the Heave rating to "the Size Class's Heave rating" and leave out an Abnormal's own; `titan-format.yaml` lines 13 to 35 (`stat_block.fields`, `standard_titan`) have no `heave` field, though `sprinting-abnormal.yaml` carries `heave: 3` and every stat block prints it; Chapter 6's "Reading a stat block" list at lines 52 to 58 skips it. Fix: (1) add "or an Abnormal's own" to both glossary entries; (2) add `heave` to the stat block fields and to the values a standard Titan takes from its Size Class.

---

### 7. Chapter 3 and `data/harm/`, `data/mind/`

- **n5. Minor: Chapter 3's design note still counts five Fear Roll triggers.** Location: `docs/rules/03-harm-and-mind.md` line 720 ("Five triggers"); the closed list now has six (`first-human-kill`, 7-17). Fix: (1) "Six triggers".

(Logged Chapter 3 items are in *Known issues*.)

---

### 8. Chapter 2 and `data/character/` (creation, Squadmates, Action Catalog)

Creation walks cleanly. The Lifepath's five D66 tables cover 11 to 66. The Template Build and the Free Build match 7-1 and 8-3. A script confirms what each array allows: 4, 3, 3, 3, 3, 2 gives Health 3 to 4 and Resolve 3 to 4; 4, 4, 3, 3, 2, 2 gives Health 2 to 4 and Resolve 2 to 4; the templates give 3 to 4 of each. The session-zero build-method choice is a fixed menu the players and GM settle once, not open discretion. The Catalog's 46 entries match across YAML, Appendix 2A.3, and the packet.

- **n9 (part). Minor: stale Chapter 2 pointers and notes.** Location:
  - line 11 lists Downtime, Requisition, Funding, and Expeditions as not yet written, which goes beyond the logged 2.3.1 item;
  - line 439 says 11 of 12 Drives can be met only in a Titan Engagement, but Chapter 7 counts Skirmish turns for Drive turn tests;
  - line 592 says a move is "resolved by Chapter 5", but `position-change` also covers Engaged and Apart (Chapter 7);
  - line 609's example says no entry lowers the soldier's own Stress, but `downtime-action` changes `stress-lower`.

  Fix: (1) update each; the packet (lines 1140 and 1203) already reads correctly.
- **n10. Minor: Specialty text assumes every soldier graduates.** Location: `data/character/specialties.yaml` lines 12 to 18 and Chapter 2 lines 462 to 466 ("At Graduation the player chooses"); `CONTEXT.md` line 97 ("gained through the Lifepath"), which the packet glossary repeats at line 4272. A Template or Free Build soldier picks a Specialty at a build step and gets no swap or floor. The packet (lines 752 and 753) handles both. Fix: (1) add "or at a build's Specialty step" to all three.
- **n11. Minor: Catalog gaps.** Location: `action-catalog.yaml` lines 690 to 701 (`death-roll` has no `needs`; Appendix 2A.4 prints a dash) and lines 801 to 805 (Persuade's requirements name only a Parley in a Skirmish, while its Help field and the packet, line 1103, cover a Parley outside one). No entry has a `spends` field, and the packet adds a spending default the YAML does not state. Fix: (1) add `needs` to `death-roll`; (2) add the outside-Skirmish Parley; (3) state the spending default in the `kind` comment.
- **n13. Minor: "at session zero" for fewer Squadmates is only in the packet.** Location: `squadmates.yaml` lines 110 to 114 and Chapter 2 line 710; 8-13 (DECISIONS line 2532) and packet line 914 give the timing. Fix: (1) add "at session zero" to `fewer_allowed.rule` and section 2.10.
- **n14. Minor: 8-3's reported Health 2 Squad does not match its YAML.** Location: DECISIONS line 2439 describes "a Tactician or Leader shape, key attribute Wits or Empathy", which contradicts itself, since a Tactician's key attribute is Instinct; `attributes.yaml` lines 126 to 137 use a Medic (Wits) and list only 4 soldiers, while Chapter 2 line 774 quotes the row "with two helper Squadmates". Fix: (1) record an erratum in 8-3; (2) add the helpers to `reported_squad_health_2`.
- **n15. Minor: Chapter 2's "What an entry states" table is missing fields.** Location: lines 519 to 532 have no rows for `option_of`, `notes`, `decided`, and `adrs`, which the YAML uses. Fix: (1) add the rows.

---

### 9. `CONTEXT.md`

- **n6 (rules part). Minor: Avoid-list words in rules text.**
  - "enemy" (Foe's Avoid list) in `CONTEXT.md` line 180 (Reaction) and Chapter 1 lines 239 and 278.
  - "the Titan's limb" (Body Part's Avoid list) in the Pinned entry, line 379.
  - "a Heave is a lift" (Heave's Avoid list reserves "lift") in Chapter 3 line 306.
  - "trapped" (Pinned's Avoid list) in the Chapter 5 design note, line 707.
  - "dead Titan" in `positions.yaml`.
  - In Talent descriptions: "limbs" (Ground Work `talents.yaml` line 87, Cavalry Cut 280), "baiting" (Feint's Avoid list, Cavalry Cut), "blades" (Blade Set's Avoid list, Blade Discipline 386), and "The Titan that held them" (Held is reserved for people, Shoulder Charge 998).

  Fix: (1) replace each with the glossary term: "a Titan or a Foe", "Body Part", "Heave", "Pinned", "Corpse", "decoying", "Blade Sets", "Grabbed".
  - `CONTEXT.md` also uses its own Avoid words inside definitions, and the packet glossary copies them: Squad Tactic "A team move" (packet line 4262), Pace "The speed" (4369), Bonus Dice "situational advantages" (4293), Call It "to warn" (4348), and Body Part State "disables" (4316). "Limb" for a Titan's part recurs across the packet, from the Pinned entry. Fix: (2) reword those definitions in `CONTEXT.md` first, then re-copy them to the packet.
- **n7. Minor: the Severity entry is narrower than the rule.** Location: `CONTEXT.md` lines 328 to 330 limit Severity to "a Titan's or a Foe's attack roll", but Chapter 1 section 1.9 step 1 and Chapter 7 section 7.4 give a soldier's Fight or Shoot roll against a Foe a Severity too, which Guard cancels. Fix: (1) "The successes an attack roll scored, a Titan's, a Foe's, or a soldier's against a Foe".

---

## Known issues: confirmed or dismissed

From `docs/playtest/feedback/round-1/DECIDER-QUEUE.md`, *For the final review* and *Stale text for other packages*, plus queue item 27.

| # | Logged item | Verdict | Severity | Evidence and fix |
|---|---|---|---|---|
| 27 | OQ-165 settled by 8-34 | Settled but not applied | Major | See M1. |
| K1 | 2.8 says Shoot cannot be taken without a firearm | Confirmed | Minor | Chapter 2 line 563; the Catalog allows a fired flare. Fix: "with a loaded firearm, or a flare fired at a person". |
| K2 | 2.8 *Groups of entries* omits new entries | Confirmed, narrowed | Minor | Block is listed (line 578). The attribute lists at lines 549 to 565 omit Heave, Leap Clear, and Release. |
| K3 | 7.4 Block "with a Blade Set" | Confirmed, and the packet repeats it | Minor | Chapter 7 line 502; packet lines 363 and 3437; `action-catalog.yaml` `block` has `requires_gear: false`. Scenario: after Nothing Left drops her set, a soldier is told she cannot Block. Fix: "with a Blade Set if the soldier has one". |
| K4 | Can a Squadmate Block? | Confirmed open | Minor | `squadmates.yaml` line 77 lists only the dodge; Chapter 7 line 643 says Squadmates take part like PCs. No playtest impact with no Squadmates. Fix: add Block to the Squadmate Reactions. |
| K5 | Fly has no needs value | Dismissed | none | The step row gives the need; intended. |
| K6 | 2.7 note says no Talent names Heave | Confirmed | Minor | Chapter 2 line 511. Fix: Grip Breaker names Heave (8-26). |
| K7 | Four measured Talents never fired in their rows | Confirmed as logged | Minor | Not re-measured here (report out of scope). Formation Drill cannot fire in the playtest anyway (n17). |
| K8 | Packet Talent tags from the WP-S2 report | Confirmed and widened | Major | See M5. |
| K9 | Lookout Tree lowercase "a forest or a giant forest" | Confirmed | Minor | The hooks are the Waypoint kinds "Forest" and "Giant forest", not Anchor Ratings. Fix: name the Waypoint kinds as the route table prints them. |
| K10 | `attributes.yaml` `used_by` omits Heave, Leap Clear, Shoot | Confirmed | Minor | The packet (lines 455 and 456) already lists them. |
| K11 | `squadmates.yaml` Downtime row "not yet written" | Confirmed | Minor | Line 67 (and Chapter 2 line 675). |
| K12 | 2.3.1 calls Downtime "not yet written" | Confirmed, widened | Minor | Chapter 2 line 129; see also line 11 (n9). |
| K13 | 4.2, 4.5, `items.yaml` omit Leap Clear from what ODM Gear and the horse rate | Confirmed | Minor | No "Leap Clear" in `04-gear.md`, `items.yaml`, `horses.yaml`, or `odm-gear.yaml`. |
| K14 | `blade-sets.yaml` records no rating per set | Confirmed | Minor | `blade-sets.yaml` line 17 holds one set and a count; `sheet-fields.yaml` lines 22 to 28 record a rating per set. Requisition grants rated sets, so the source file cannot hold them. |
| K15 | Horse left as a decoy exists only in `sheet-fields.yaml` | Dismissed | none | `horses.yaml` lines 27 to 35 and `positions.yaml` `horses.left_as_decoy` carry it. |
| K16 | 3.2 step 6 says a rider "replaces" fields | Confirmed | Minor | Chapter 3 line 136; the YAML multiplies healing days, stops healing, and adds a treatment requirement. Fix: copy `gaining.type-rider`'s wording. |
| K17 | 3.5 aftermath rolls only at a Titan Engagement's end | Confirmed | Minor | Line 466; the 3.16 Skirmish paragraph covers it. Fix: "or a Skirmish". |
| K18 | `health.yaml` "not yet written" | Confirmed | Minor | Line 153. |
| K19 | The both-arms 4-die strike penalty with a prosthetic | Reading confirmed | none | `lost_limb_riders.prosthetics.never_removes` and `stacking`; packet line 1385 states it. |
| K20 | `downtime.yaml` and 7.2 omit the untreated Pierce | Confirmed | Minor | `downtime.yaml` lines 54 to 60; Chapter 7 line 288. The packet (line 3252) is right. |
| K21 | Retreat from a Night-table Titan Engagement | Confirmed | Major | See KM1. |
| K22 | Chapter 7 lowercase Lead, Depot, Night Camp, Ambush, Shot, Net Successes | Confirmed | Minor | E.g. Chapter 7 lines 88 and 89 ("depot", "night camp"), 97 ("the lead"), 208, 456 ("The ambush"), 480 ("no shot"), 498 ("net successes"). |
| K23 | `positions.yaml` "no Phase 1 rule does" | Confirmed | Minor | Line 91; the Straggler and Overrun rows do. |
| K24 | 5.5 announce, dead-Titan step, decoy step and Call It | Confirmed | Minor | Chapter 5 lines 432 to 446; `behavior-procedure.yaml` lines 58 and 67 to 70. |
| K25 | 5.4 omits "a mounted target is not affected" | Confirmed | Minor | Chapter 5 line 401; `titan-format.yaml` line 156; the packet (line 3868) has it. |
| K26a | Reading: the Abnormal's Heave rating is public | Confirmed | Minor | `titans/index.yaml` lines 39 and 40 keep four values hidden, Heave not among them. Chapter 6 lines 256 to 302 say every value in the GM stat block "is revealed at the table only by a Read". The packet (lines 4176 and 4212) is right. Fix: add Heave to the public list at line 260 and reword line 302. |
| K26b | Reading: Overrun's clocks each roll a Size Class | Confirmed | none | `engagement-setup.yaml` step 3; packet line 3806. |
| K26c | Reading: a Straggler victim at In Reach holds Attention from setup | Confirmed | Minor | Chapter 5 line 86 still says "as none of the Phase 1 ladders' rungs does at the start". The packet (line 3817) is right. |
| K27 | `round.yaml` timed rounds assume 2 Squadmates | Confirmed | Minor | The packet (lines 4047 and 4048) adds a note, but the pass criteria still assume 6 soldiers. |
| K28 | `CONTEXT.md` Ambush looser than 7.4; no Guard entry | Confirmed | Minor | Line 545 omits the Foe's 2 extra Attack Dice and "no Guard". No **Guard** headword exists. |
| K29 | `CONTEXT.md` Grabbed "Held in a Titan's hand" | Confirmed | Minor | Line 305 uses Held, reserved for people. |
| K30 | Later-Phase glossary terms in the packet | Dismissed | none | The packet groups them under "Terms for later rules" (line 4400), marked as later rules. |
| K31 | Retreat options 3 and 4 and the Down comrade | Confirmed | Major | See KM2. |
| K32 | 8-32's "8 rounds" and the retreat clock's segments | Dismissed | none | The limit is the clock's length; 8 is the interim setup's value. |
| K33 | `CONTEXT.md` Camp Relief omits "not hungry" | Confirmed | Minor | Line 512. |
| K34 | 1.6 says the Expedition rules "will" add a Stress row | Confirmed | Minor | Chapter 1 line 155. |
| K35 | `fight6.py` models the old fixed need | Dismissed | none | Outside the rulebook's scope; the file now reads `attack_dice`. |
| K36 | No Chapter 6 stat block prints a Heave rating | Dismissed (fixed) | none | All four stat blocks and all five packet blocks print it. |
| K37 | Skirmish lethality low in the pre-run probe | Dismissed | none | Superseded by 8-33; the final rerun is reported inside its range. |
| K38 | Em dashes in rendered cells | Confirmed | Minor | The packet has 0 and chapter prose has 0. Rendered chapter blocks have 326: Chapter 2 has 237 on 148 lines (e.g. 170, 177, 656 to 675, 919 to 1068), Chapter 3 has 70 on 34 lines (e.g. 192 to 249, 696 to 701), and Chapter 5 has 19 (e.g. 141, 184 to 203). They are empty-cell placeholders, and the packet a table uses is clean, so this is Minor. Fix: have `tools/render/render.py` print "none" or "no" for an empty cell, then re-render. |
| K39 | Talent names Hard to Kill, Wide Awareness, Pry Loose | Hard to Kill and Pry Loose dismissed; Wide Awareness confirmed | Minor | "kill" is on Extraction's Avoid list, which is about Shifters, and "pry" is reserved for Pry Loose itself. "awareness" is on Watch's Avoid list, a surface clash. Fix: rename Wide Awareness only if the owner reads Avoid lists strictly. |
| K40 | `PROGRESS.md` rows for WP-0, WP-C, WP-A, WP-D, WP-B | Confirmed | Minor | No such rows; the packet and simulator rows are current. |
| S1 | Chapter 2 example calls two Talents dormant | Dismissed (fixed) | none | No such wording remains. |
| S2 | Chapter 4 intro lists Expeditions etc. as unwritten | Dismissed (fixed) | none | Chapter 4 line 19 points to Chapter 7. |
| S3 | Chapter 1 1.1 item 5 and Severity as a pool | Dismissed (fixed) | none | Section 1.1 has four items; no pool is called Severity (see *Checks*). |
| S4 | 3.2 lost limbs "keep the 2-die penalty" | Dismissed (fixed) | none | Not found in Chapter 3 or `critical-injuries.yaml`. |

---

## Checks that passed

- **The Titan card, end to end.** Attack Dice rolled as Titan Dice on 5 or 6, in the open. Every target cancels against one roll, and the card lands on 1 or more Net Successes. A 0 whiffs against everyone, including a soldier who cannot react. The Critical Injury rider adds 1 per Net Success beyond the first, after worsening and before the non-lethal cap. The Grab lands on net 1 with no rider. One Reaction per Titan per round cancels against each later card. All of this agrees across Chapter 1 section 1.9, Chapter 5 section 5.5, `behavior-procedure.yaml`, `grab.yaml`, `critical-injuries.yaml` `gaining`, ADR-0019, `CONTEXT.md`, and the packet (lines 368 to 395 and 3614 to 3621).
- **Critical Injuries.** Sides use the odd-even rule. Every row carries five names. The Bite rider covers arm and leg 12 and 13-plus. The Burn rider covers every row and all lethal rows. The Cut rider lists 7 rows and the Pierce rider 21, as WP-C2's check requires. The rendered tables and the packet tables agree cell for cell on the rows sampled, and every table is open-ended.
- **A Titan's death.** Relief, freed, Steam, the fall, removals, Positions, the Corpse, and the ending come in the same order in `titan-harm.yaml`, Chapter 5 section 5.7, and packet lines 2749 to 2757 and 3976 to 3986.
  - Steam's D6 table is complete, and the kill and the fill name their Positions.
  - The Leap Clear path, airborne, Down, and carried cases agree across all sources. A Rookie with Agility 3, ODM Gear 2, and Stress 1 who Pushes when short fails 17.4% of the time; with both legs lost, 31.8%.
  - The pinning Body Part map covers both kinds, both sides, and the Broken fallbacks.
  - Heave ratings are 2, 3, and 4, the count is cleared only at a stand, and the corpse heat and Heave damage are data-shaped.
- **Every Burn source is data-shaped with no GM choice.** Steam (`steam.table`), corpse heat (`corpse_heat.heat_harm`), the Heave's damage, the firebrand and the fired flare (`skirmish.yaml` `weapons`), and the falling Titan's Crush (`pin_harm`).
- **The re-cut Fear table and the Stress Responses** agree across YAML, Chapter 3, the packet, and the quick reference. Fear totals run from 0-or-less to 9-or-more, and Stress Response totals from 0-or-less to 8-or-more. `placement` holds on every row.
- **Skirmishes.** Cancellation, damage plus 1 per Net Success beyond the first, Guard as a never-Pushed cancelling roll, the ambush's +2 Bonus Dice, +2 Attack Dice, and no cancelling roll, and the musket at 4 all agree. The Military Police trooper at Attack Dice 7, Grit 4, and a patrol of 4 matches in `foes.yaml`, Chapter 7, and packet line 3482. Burn, Cut, and Pierce kill a Foe, and Crush puts one out cold (8-30).
- **Expeditions, Downtime, Requisition.**
  - The Leg Hazard table is open-ended at 1-or-less and 10-or-more. The Night table covers 3-or-less to 8-or-more, and every modifier stays inside that range.
  - The Straggler's victim roll never lets a choice in, the day order matches 8-27, and the after-actions order matches 8-28.
  - The Requisition list has 15 rows, with the prosthetic at Limited. The Funding gate and the Ledger match.
- **No pool is called Severity** in `docs/rules/0*.md`, `data/`, `CONTEXT.md`, or the packet. Every occurrence means the number a roll scored, and no `severity:` key is left.
- **Every harming or terrorizing Titan entry lists Attack Dice.** All 28 entries across the four tables do, the pools follow `size-classes.yaml` by tier with Thrash at the control pool, and the Sprinting Abnormal's own values (3 and 6) sit inside its stat block range of 3 to 12. Every Chapter 6 stat block shows its Heave rating.
- **Verdict sentences.** `data/titans/tuning.yaml`, `data/engagement/tuning.yaml`, Chapter 5 section 5.13, and Chapter 6 section 6.6 match the simulator report's Met verdicts and figures, except the probe-figure labels in n2. Every 0.05 and 0.06 limit is marked as history, and "Hesitate included" is gone.
- **ADR-0003.** No new rule in rounds 7 and 8 rests on GM discretion. Each new tracked value has its entry: `pinned`, `heave-count`, `held-end` (with `release`), `stress-lower`, `grief-lower`, and `squad-recruit`.
- **Packet mechanics.**
  - Banned words appear 0 times; the only "ADR" matches are inside "adrenaline".
  - All 350 in-page links resolve to 102 distinct targets, with no duplicate ids.
  - All 38 dice tables are complete, with no gaps or overlaps.
  - Every one of the 116 tables sits in a scroll wrapper, and the phone-width CSS estimate shows no overflow at 400px.
  - Print breaks come before the GM band, each Titan, the quick reference, the glossary, and the feedback page.
  - Severity appears 24 times, always as the rolled number.
  - The playtest configuration is stated at lines 920 and 3747.
- **Owner decisions.** Option C, Health unchanged with Free Build Health 2, musket 4, and Burn in the first playtest, as are steam, the falling Titan's path, the run-on, and the flare as a Burn weapon. Prosthetics are as written, Cut and Pierce carry riders, the Medium band is at 0.08, and the Skirmish retune holds. All are implemented as decided.

---

## Prioritised fix list

1. Apply 8-34 in `engagement-flow.yaml`, Chapter 5 section 5.11, and the packet; remove the OQ-165 markers (M1).
2. Close the run-on loop when a Background Titan has entered: bind the stay limit for a comrade Pinned under a corpse in every retreat (M2), and in the same edit apply 8-20 to the Down-comrade comparison in `background-titans.yaml` and Chapter 5 section 5.10 (KM2).
3. Define a retreat from a Night-table Titan Engagement (KM1).
4. Settle the playtest configuration in data and switch off Recruit for the first playtest (M3).
5. Define once-per limits for a Titan Engagement or Skirmish nested in a Leg or Night Camp (M4).
6. Tag, or measure, the eight older Talents on measured and fixed rolls (M5), and re-check the other tags as logged (K7, K8).
7. Add 7-11's Squadmate cost sentence and purpose paragraph to the packet (M6).
8. Decide whether a limb lost to corpse heat still pins, and add limb losses to the feedback page (n4).
9. Correct the Grit entry in `CONTEXT.md` and the packet glossary (M7).
10. Give the print stylesheet a page margin and a band that prints, then check the quick reference in a real print preview on Letter and A4 (n20, n21).
11. Sweep the Minors in one pass: stale PROVISIONAL and probe labels (n1, n2), the Heave rating field and glossary (n3, K26a), Avoid-list words (n6, K29), Chapter 2 and Chapter 7 stale pointers (n9, K1, K11, K12, K22, K34), the logged Chapter 3 items (K16, K17, K20), the renderer's em dash placeholders (K38), and the packet's voice, capitalization, and glossary drift (n22 to n24).
