# Feedback round 1: final review, Astra

**Open findings: 1 Critical, 12 Major, 10 Minor. Total: 23.**

Independent review, 2026-09-15. Scope: Chapters 1–7, their data, the updated packet, owner answers, decision batches 7 and 8 including their later amendments, ADRs, and glossary. The owner's task-specific severity guide governs this review. Findings count distinct fixes, not every repeated occurrence. The queue dispositions below do not add findings to these counts.

The packet is broadly complete: it includes all three creation methods, the 83 Talents, Expedition and camp procedures, Downtime, Requisition and prosthetics, all four Titans, Skirmishes, and the four-PC/no-Squadmate configuration. It needs the rules fixes below before a group can reliably play from it alone.

## Findings by file

### `data/expedition/legs.yaml`

**F01 · Critical · No continuation when every survivor is Down.** Locations: lines 47–48, 192–210, 219–238; Chapter 7 lines 97, 152–157 and 210; packet sections `playtest-expedition` and the Night Camp procedure. The Leg and camp rolls require a soldier who is not Down. Only a Hard Ride specifies what happens when no soldier can roll. A Skirmish expressly ends with every soldier Down or dead and leaves the survivors alive (`data/skirmish/skirmish.yaml`, `ending`). The Expedition has neither an all-Down ending nor a fallback for its mandatory Steady Leg and camp rolls.

For example, four PCs survive a night Skirmish Down from untreated injuries. With nobody able to treat them, the passing day need not end Down. The following Steady Leg cannot choose a Lead, and another camp cannot choose its roller. The rule that the Squad always reaches the next Waypoint cannot be executed without inventing a ruling. **Fix:** make an unavailable Leg or camp roll fail automatically, with an explicit travel provision for the all-Down Squad; or define a closed Expedition defeat/evacuation procedure that resolves before either roll. Apply the answer to the packet.

**F02 · Major · A retreat from a Night Camp has no route consequence.** Locations: lines 155–160 versus 201–210; Chapter 7 lines 147 and 213–214; packet Night Camp procedure. The Leg procedure rewinds to the Waypoint that Leg started from and orders another Leg roll. The Night table can start an Abnormal engagement, but its procedure gives no corresponding retreat step. ADR-0009's general fall-back rule does not determine whether this night retreat consumes a Leg, repeats the camp, changes the next day's starting Waypoint, or waits until morning, when Legs can be ridden.

A Squad retreats from the Abnormal at its second night's camp. Following the camp list simply passes the day and continues forward; borrowing the Leg rule makes it ride at night. **Fix:** state the destination and when the repeated Leg is ridden, and whether the current camp's day-passing step still resolves. Give the same answer in Chapter 7 and the packet.

### `data/harm/death-rolls.yaml`

**F03 · Major · Skirmish injuries use the outside-fight timer exception.** Locations: lines 26–28, 41–43, 56–58 and 84–86; Chapter 3 line 378; packet line 1445. The main Turn limit includes Skirmishes, but the outside-Titan-Engagement clauses still include an ongoing Skirmish. In particular, any surviving Turn or Engagement Death Roll outside a Titan Engagement becomes Day, whatever the outcome row says.

A soldier gains a lethal Cut during a Skirmish and scores exactly one success on the first Turn Death Roll. The outcome says the Turn limit remains; the exception says it becomes Day. This removes subsequent bleeding rolls during the fight and defeats the new Cut timing. **Fix:** restrict both the immediate outside-harm expiry and the restart exception to outside *both* fight types, retaining the explicit end-of-fight conversion. Synchronize the chapter and packet.

### `data/harm/treat-injury.yaml`

**F04 · Major · A damaging Skirmish event opens a free care window mid-fight.** Locations: lines 137–149; Chapter 3 lines 447–450; packet lines 1487–1490. The outside-harm window excludes Titan Engagements but not Skirmishes. A Skirmish attack that makes a soldier Down therefore satisfies it, alongside the separate action-based treatment and end-of-Skirmish window.

When the first trooper's pistol Downs a PC, the whole participating Squad can enter a care window before the remaining troopers act, using window treatment and medical supplies instead of spending Skirmish actions. The text also sends new lethal limits to Death Rolls after that window. **Fix:** exclude harm during either fight from this window; keep Skirmish treatment on actions and its dedicated end window. This is separate from F03: repairing timer conversion alone leaves the free treatment window open.

### `data/harm/health.yaml`

**F05 · Major · Zero Steam damage has no explicit no-harm exit at zero Health.** Locations: lines 43–45; `data/engagement/titan-harm.yaml` lines 208–218; packet lines 1248–1252 and 2768–2775. Damage taken when current Health is already zero gives a Critical Injury without testing that the amount is positive. Steam tells the soldier to take its table's damage, including zero. Unlike the fall procedure, it does not say that its zero row does no harm.

A Down soldier at zero Health is freed from a dying Titan's hand and must take Steam before the fall. A Steam roll of 1–3 reaches the generic zero-Health rule and can give a Burn Critical Injury despite dealing zero damage. **Fix:** put a positive-damage test at the start of the common damage procedure, or explicitly give Steam the fall procedure's zero-result exit. The latter already appears in the packet's fall procedure at line 2092.

The disputed branch is not negligible: a Python simulation of 1,000,000 D6 rolls, seed 20260915, produced **50.0128%** zero Steam results; the exact probability is **50%**. This measures the frequency of reaching the ambiguous branch, not a claimed intended injury rate.

### `data/mind/fear-rolls.yaml`

**F06 · Major · Simultaneous Fear results need a snapshot before contagion applies.** Locations: lines 78–82; `data/harm/effect-types.yaml` lines 160–176; packet lines 1677 and 1695. The procedure says resolution order changes no result, but Nothing Left immediately gives nearby comrades Stress. Nothing freezes each witness's Stress and Resolve before resolving the event's results. Gaining Scars and effects that read another soldier's Resolve provide further reasons to distinguish calculation from application.

Two witnesses share a Position and have no applicable Drive or Talent. A has Stress 6/Resolve 3; B has Stress 5/Resolve 3. A rolls 6 and B rolls 5. Resolving A first gives B another Stress before B calculates, changing B from Run for the Wall (7) to Kill It (8). Calculating B first does not. **Fix:** snapshot the inputs and calculate every witness's result first, then resolve Drive choices and apply effects; explicitly prevent this event's effects changing another result already calculated. Alternatively prescribe an order and withdraw the order-independence statement, with a decision on the changed behavior.

A Python simulation of 1,000,000 independent pairs, seed 20260915, found that B's result changed with this ordering in **16.6654%** of pairs. The exact rate for these starting values is **1/6**, because A reaches Nothing Left only on 6 and B cannot reach it before A's contagion. The calculation isolates contagion before any other Scar effects.

### `data/engagement/positions.yaml`

**F07 · Major · The old death cleanup still ends the fight and loses records during a run-on.** Locations: lines 69–80 (`two_focus_titans.a_focus_titan_dies` and `recorded_label`); Chapter 5 lines 245–250. The old block says the Titan Engagement ends when no Focus Titan remains, and rewrites every recorded horse/left-item Position to the earliest living Focus Titan. The new corpse block and `engagement-flow.yaml` instead preserve a run-on while someone is Pinned. When the final Titan dies, the old rewrite has no living label to use.

A soldier lies Pinned under the last Titan while a rescuer's dismounted horse and a dead comrade's medical kit have records naming it. Following the old block ends the fight before the rescue; following the new ending still leaves those records without a defined rewrite target. **Fix:** replace the obsolete block with the corpse transition and the current ending tests, and define horse/left-item records when no living Focus Titan remains, including records created during the run-on. Do not leave two competing death procedures.

### `data/engagement/background-titans.yaml`

**F08 · Major · Retreat rescue comparisons still require a living Titan for a Down comrade.** Location: lines 118–121. Options 3 and 4 compare a Down comrade's Position relative to the earliest *living* Focus Titan. This is undefined during the corpse run-on, which is precisely where the stay limit allows rescue attempts. The general comparison rule in `positions.yaml` supplies the last-dead corpse, but this specific rule still names a different, nonexistent reference.

During the first allowed retreat round after the last Titan dies, a PC wants to approach a Down, unpinned comrade while another soldier remains Pinned. The rescue option cannot measure the distance it requires. **Fix:** use the common Position comparison rule for a Down comrade, preserving the holding-Titan and pinning-body rules for Grabbed and Pinned comrades.

### `data/campaign/downtime.yaml`

**F09 · Major · The infirmary heals an untreated Pierce.** Location: line 60; Chapter 7 line 288. The seven-day procedure reduces every held injury's remaining healing time and heals it at zero. `data/harm/healing.yaml` lines 46–52 and the Pierce rider instead stop that countdown while an applicable Pierce remains untreated. The packet correctly retains this exception at line 3252.

A soldier's lodged-ball injury survives the initial infirmary care window untreated. Applying this file takes seven days off it, while applying the harm data takes none. **Fix:** make infirmary healing call the common healing procedure, including the untreated-Pierce restriction and the prohibition on healing an injury that remains lethal. Copy that qualification into Chapter 7.

### `data/gear/items.yaml`

**F10 · Major · Leap Clear is absent from both gear eligibility lists.** Locations: lines 60 and 107–115; Chapter 4 lines 110 and 295–296. The ODM Gear and horse `gear_dice_for` lists omit Leap Clear, and the horse's mounted-only test does not name it. The Action Catalog and falling-Titan rules allow this gear; the packet correctly includes it at lines 1891, 1899 and 2054.

A player constructing a Leap Clear pool from the gear reference loses dice that the action grants, or treats a nearby dismounted horse as eligible because the new entry is absent from the exclusion list. **Fix:** add Leap Clear to both item lists and the horse's mounted requirement, and update Chapter 4's summaries. Keep the lost-arm restrictions in force.

### `data/character/attributes.yaml`

**F17 · Minor · Attribute indexes omit the new actions.** Locations: lines 15–26. `used_by` claims to list the Catalog entries naming each attribute, but Strength omits Heave and Agility omits Leap Clear and Shoot. A player checking which rolls an attribute supports receives an incomplete list. **Fix:** add those three IDs and regenerate any derived index. The Catalog's actual attribute assignments are correct.

### `data/gear/blade-sets.yaml`

**F18 · Minor · Blade tracking summary still describes only a boolean and a count.** Locations: lines 11–15; compare `data/gear/sheet-fields.yaml`, Blade Set fields, and packet line 2400. The sheet correctly records each set's rating, but the unit summary describes only whether the handles are filled and how many spares exist. This is incomplete, rather than an instruction explicitly forbidding the correct fields.

A soldier carries an issued rating-1 set and a Requisitioned rating-2 set. A count alone cannot identify the pool after a swap or pass. **Fix:** say that the handles and each carried set retain their rating, as the sheet already does.

### `docs/rules/02-character-creation.md`

**F11 · Major · Shoot's prose forbids the firearm-free flare attack.** Location: line 563. The chapter says Shoot cannot be taken without a loaded pistol or musket. The Catalog and Chapter 7 permit a fired flare without a firearm. A soldier with Squad flares and no firearm is wrongly refused their Burn attack by the character chapter. **Fix:** name both legal sources, with the firearm and flare requirements stated separately. The packet's main Shoot procedure already supports the flare.

**F19 · Minor · Remove the remaining “not written” and superseded implementation statements.** Exact occurrences:

- Chapter 2 lines 11, 129, 511, 651 and 675: Chapter 7 systems described as unwritten, Haven's recovery still future, Heave absent from the Catalog/Talents despite Grip Breaker, and Squadmate Downtime still undecided.
- `data/character/squadmates.yaml` line 67: the same unwritten Downtime row.
- `data/harm/health.yaml` lines 152–155 and Chapter 1 line 155: the now-written Expedition day and camp Stress rules described as future work.
- Chapter 4 lines 295 and 495: Ride dormant until Chases and Maintain Gear unwritten.
- `data/engagement/positions.yaml` line 91: no Phase 1 rule changes starting Positions, despite Straggler and Overrun.
- Packet line 2054: “No playtest rule calls for a Ride roll,” despite Hard Ride.

A player choosing Horsemanship is told its Ride use has no playtest application, and a reader following the Squadmate table is sent to rules said not to exist. The operative rules elsewhere are present. **Fix:** replace these sentences with current pointers; retain genuinely deferred XP, Train, and Chase statements. This is one coordinated stale-reference sweep, not a separate finding per sentence.

**F20 · Minor · “Groups of entries” is incomplete.** Location: lines 571–582. The summary omits Heave, Leap Clear, Release, Block, Downtime Action and Squad Action even though the full Catalog contains them. A reader scanning this navigation list misses the new rescue and campaign options. **Fix:** include all live entries in the appropriate groups, or clearly label this as selected examples rather than a catalog grouping.

### `docs/rules/03-harm-and-mind.md`

**F13 · Major · The rider procedure describes every field as replacement.** Location: line 136; compare `data/harm/critical-injuries.yaml` lines 90–97 and 136–145. Only some rider operations replace a row value. Others multiply healing time, suspend healing while untreated, or add treatment requirements and penalties. The chapter's instruction does not express those operations.

A GM processes a Burn row with a seven-day healing time by the numbered procedure: replacing fields does not tell them to make it fourteen days or how the kit restriction combines with the original treatment rule. **Fix:** state the operation of each rider, or direct this step to the complete rider procedure instead of saying every field replaces its counterpart. Preserve the existing order: side/worsening, row selection and cap, then the applicable riders.

**F14 · Minor · The standalone aftermath procedure still assumes a Titan Engagement.** Locations: lines 466–473. The introduction and Position-based treater test do not include Skirmishes, although line 444 and Chapter 7's ending do. A reader arriving directly at this section for a Skirmish patient has to reconstruct the replacement rule from elsewhere. **Fix:** add the Skirmish scope and its all-participants-count-as-the-patient's-Position substitution here. No new care window or extra roll is needed.

### `docs/rules/05-titan-engagement.md`

**F15 · Minor · The card checklist omits three explicit data steps.** Locations: lines 433–449; compare `data/engagement/behavior-procedure.yaml` lines 58–75 and its announce step. The chapter omits the dead-Titan early exit, does not explicitly end a Call It when a decoy consumes the Next Behavior, and omits the behavior's tier from the announcement. Other rules remove dead cards and tie a Call It to its specific Next Behavior, so these are checklist omissions rather than a newly demonstrated endless fight.

A GM using only this checklist replaces a Called Next Behavior under a decoy without being reminded to clear its Call It record. **Fix:** include the dead check, clear the Call explicitly in the decoy step, and announce name, tier and targets as the data instructs.

**F16 · Minor · Knock loose omits the mounted-target exception.** Location: line 401; compare `data/engagement/titan-format.yaml` lines 151–157. The chapter leaves out “A mounted target is not affected.” Normal reachable mounted Positions often make this redundant, but the effect summary should carry the same closed eligibility test as its source. When the GM checks knock loose against a mounted target, the explicit exemption is absent from the chapter's checklist. **Fix:** copy that exemption into the summary.

### `docs/rules/07-playtest-rules.md`

**F12 · Major · Block's main procedure makes the Blade Set look mandatory.** Location: line 502; packet lines 3437 and 3714; compare the Catalog and packet line 1059. The main Skirmish procedure says “with a Blade Set,” while the Catalog explicitly says “if you have one.” Unlike the dice reference, the main rule omits the unarmed case.

A soldier ruins their last Blade Set and wants to Block a sabre with Strength and their applicable Talent. The Catalog permits it; the procedure readers use to resolve the attack appears to require gear they no longer have. **Fix:** say “with a Blade Set if you have one; otherwise no Gear Dice” in the chapter, packet procedure, and quick reference.

**F22 · Minor · Chapter 7 does not consistently use the glossary's capitalization.** Examples: lines 5 and 49 (`night camp`, `depot`), 152 (`lead`), 458–463 (`ambush`), 509 (`net success`), and 403 (`shot`). These denote the defined Night Camp, Depot, Lead, Ambush, Net Successes and Shot, not ordinary descriptive uses. A reader comparing the chapter, glossary and packet sees inconsistent names for the same tracked concepts. **Fix:** capitalize the defined terms in prose and rendered display text; retain lowercase machine IDs.

### `CONTEXT.md`

**F21 · Minor · Three glossary definitions and one missing entry lag behind the rules.** Locations: Grabbed at lines 304–305; Camp Relief at lines 511–512; Ambush at lines 545–546; the Skirmish glossary has no Guard entry. Grabbed should explicitly identify a Titan's hand, to distinguish Held. Camp Relief omits the no-hunger condition. Ambush describes attacks on a Foe and Reaction denial, which does not cover the Foes' ambush or the Squad bypassing Guard.

A reader looking up why a hungry camp gave no relief, or whether an ambushed Foe rolls Guard, gets an incomplete answer. **Fix:** bring these definitions into line with their closed rules and add Guard. The packet's glossary can keep later-phase terms that its current rules reference; that is not itself a scope violation.

### Rendered chapter tables

**F23 · Minor · Em dashes remain in the chapters.** Exact examples: Chapter 2 lines 170, 177 and 674–675; Chapter 3 lines 192–197; Chapter 5 lines 141 and 184–188. Further occurrences remain in the rendered reference tables. The packet has none, but the task explicitly applies the ban to chapter tables as well. A player printing a chapter still receives the prohibited placeholder typography. **Fix:** change the renderer's absent-value display to “none,” “not applicable,” or an en dash as appropriate, then regenerate the affected blocks. Do not hand-edit generated cells.

## Disposition of the known queue

“Confirmed” below refers to the current files, not to the age or status of the queue note. A dismissed or resolved item contributes zero to the counts. Related occurrences share the finding indicated.

| Queue item | Disposition |
|---|---|
| Chapter 2 Shoot requires a firearm | Confirmed, Major F11. |
| Chapter 2 entry groups omit six additions | Confirmed, Minor F20. |
| Chapter 7 Block requires a Blade Set | Confirmed as misleading procedure wording, Major F12; the packet repeats it too. |
| Can Squadmates Block? | Dismissed as an unresolved-rule finding. Their explicit only-Reaction-is-Dodge restriction still governs; “like PCs” does not repeal it. |
| Fly's needs is “as the step gives” | Dismissed. Fly is called by a specified procedure, including the Exam or a Position step; it is not a freely declared action needing one universal target number. |
| Chapter 2 says no Talent names Heave | Confirmed, Minor F19. Grip Breaker names it. |
| Four measured Talents did not fire | Not confirmed as a rules defect. A dormant sensitivity test is a measurement-coverage question, not proof that the Talent's rule is invalid. See the scope limit below. No severity/count assigned without the permitted evidence. |
| Packet Talent tags versus the final report | Not independently verified: the task permits report use only for the four verdict locations. No unsupported tag-change finding counted. |
| Lookout Tree's forest/giant forest names | Dismissed. It reads Waypoint kinds, not Anchor Rating names. Lowercase terrain language does not change that trigger to an Anchor Rating test. |
| Attribute `used_by` omissions | Confirmed, Minor F17. |
| Squadmate Downtime unwritten | Confirmed, Minor F19. |
| Haven's Downtime use unwritten | Confirmed, Minor F19. |
| ODM Gear and horse omit Leap Clear | Confirmed, Major F10. |
| Blade Set count versus per-set ratings | Confirmed as an incomplete summary, Minor F18. The actual sheet already records ratings. |
| Horse's left-as-decoy state exists only on the sheet | Dismissed. `positions.yaml`, `horses.left_as_decoy`, and the riderless-horse decoy define it. |
| Type riders “replace” fields | Confirmed, Major F13. |
| Aftermath section only names Titan Engagement | Confirmed, Minor F14; the Skirmish substitution exists elsewhere. |
| Health day-restoring row unwritten | Confirmed, Minor F19. |
| Both-arms strike penalty after prosthetics | Confirmed reading, no defect. Permanent penalties stack per lost side; a prosthetic lowers the grade, not those penalties. The unmodified both-arms grade forbids the strike entirely. |
| Infirmary omits untreated Pierce | Confirmed, Major F09. |
| Night-table engagement retreat | Confirmed, Major F02. |
| Chapter 7 capitalization | Confirmed, Minor F22. |
| No Phase 1 starting-Position exceptions | Confirmed stale claim, Minor F19. |
| Chapter 5 announce/dead/Call It omissions | Confirmed, Minor F15, rather than three separately counted findings. |
| Chapter 5 mounted knock-loose exception | Confirmed omission, Minor F16. |
| Abnormal Heave rating public | Confirmed reading, no defect. Heave is not among the four hidden Read facts. |
| Overrun clocks each roll a Size Class | Confirmed reading, no defect. Each created Background clock receives its own Size Class under setup. |
| Straggler victim starts with Attention | Confirmed reading, no defect. The victim alone at In Reach wins that ladder rung against the others at Distant. |
| Timed rounds use four PCs plus two Squadmates | Dismissed as a playtest-configuration mismatch. That is a measurement setup; the packet expressly says four PCs and no Squadmates. |
| Ambush definition and missing Guard | Confirmed, Minor F21. The operative bonus source correctly requires the Squad to have the Ambush. |
| Grabbed versus Held terminology | Confirmed clarification, Minor F21. |
| Later-phase glossary entries in the packet | Dismissed. Referenced terms can be defined without granting their deferred mechanics. |
| Retreat compares to a living Titan after all die | Confirmed, Major F08. |
| Eight rounds versus the retreat clock's length | Dismissed. Eight is the existing clock's segment count; the rescue stay is counted in rounds from the round after retreat begins. It is not an immediate end on the eighth round, and the walk out remains part of the rule. |
| Camp Relief lacks the hunger condition in CONTEXT | Confirmed, Minor F21. |
| Chapter 1 future Expedition Stress row | Confirmed, Minor F19. |
| Old fixed-need `fight6.py` and figure re-commit | Excluded as the known refactor named in the task; no new finding. |
| Chapter 6 lacks Heave ratings | Resolved. Stat blocks now show Small 2, Medium 3, Large 4, and Sprinting Abnormal 3. |
| Skirmish lethality versus “guns as lethal as Titans” | Dismissed against current intent. The owner's later answer and 8-33/OQ-164 set lower reported ranges and the trooper's 7 Attack Dice, Grit 4 and patrol of 4. Those values agree across data and packet. This is not a fresh audit of the Skirmish report. |
| Em dashes in rendered cells | Confirmed, Minor F23. |
| Hard to Kill, Wide Awareness, Pry Loose | Dismissed. “Kill” is forbidden as a substitute for Extraction, “awareness” as a substitute for Watch; these names do neither. The Heave glossary explicitly reserves “pry” for Pry Loose. |
| PROGRESS package rows | Dismissed as the originally reported missing-package-update defect. Current chapter rows describe the applied packages and pending final review. Remaining historical/provisional wording in this coordination record is not a missing player rule. |
| Chapter 2's example calls two Talents dormant | Resolved; current text says Chapter 7 calls the formerly dormant entries. |
| Chapter 4 intro calls Expeditions/Requisition/human combat unwritten | Resolved in the intro; the separate Ride/Maintain Gear leftovers are F19. |
| Chapter 1 item 5 and Severity used as a pool | Resolved in the live attack procedure. Historical decisions and expressly historical measurements are not current pool names. |
| Lost-legs “keep the 2-die penalty” | Resolved. The current grade states that the per-side penalties stack to four. |
| OQ-165 / queue item 27 still provisional | Resolved by 8-34: the grade-based exception is checked from the first round past the stay limit, excludes a merely spent move, and preserves the soldier's survival. Not counted again. |

Items 1–26 and the lettered round-3 readings are recorded as settled. The review did not reopen those owner/decider choices. F01 is the separate all-Down Expedition case, not a repeat of OQ-165's immobile soldier in a corpse retreat.

## Verification and limits

- All `data/` YAML parsed successfully. Both read-only render checks passed: the main chapter renderer and the Chapter 6 renderer. Passing these checks verifies generated blocks, not surrounding prose, as the findings illustrate.
- Talent inventory: **83 unique Talents, 33 dice and 50 rule**. Each Specialty has eight, at least three dice Talents, at least three rule Talents, and a conditional dice Talent. The general list has twelve. Every Talent's `names` ID exists in the Action Catalog. No dice Talent names Leap Clear. The review found no new high-confidence Talent rule violation beyond the incomplete measurement verification noted above.
- Walked the attack/Reaction, Critical Injury/rider, death/Steam/fall/pin/rescue/run-on, Fear/Stress, Skirmish, creation, Squadmate, Expedition, Downtime and Requisition procedures across their sources. Titan attack dice use 5 or 6, cancellation is per success, zero whiffs against anyone, the Critical Injury rider is net successes minus one, and Grab has no rider. Foe dice use sixes; the musket is damage 4 and the patrol is four troopers at Attack Dice 7/Grit 4.
- Packet static checks found **zero unresolved fragment links, zero duplicate IDs, zero banned words, and zero em dashes**. CSS percentages are not simulation percentages. Its intentional Artifact wrapper, Google Fonts, theme tokens and scrolling tables are not findings.
- Checked the packet's D6/D66 table ranges, the modified harm/Fear/hazard ranges, and each Titan's six rolled Behavior Table faces. No missing result was found; Thrash is the separate fallback, not an extra rolled face. The quick reference correctly rerolls only base and Stress Dice on a Push: this game's Gear Dice are never rerolled.
- Compared the report's target/band/bar verdicts with the two tuning files and Chapters 5 §5.13 and 6 §6.6. The current verdicts use the revised Medium death ceiling of 0.08 and agree on Met, including 0.0754 at the reference start and 0.0687/0.0693 in the two bar orders. This does not certify engine fidelity or override the report's coverage limits. No simulator run was started, and a stale notice was not treated as a finding.
- The two small dice experiments were run in `/private/tmp/wof-final-review-astra-0915/odds.py`, outside the repository. They do not run or import the project simulator.
- **Visual acceptance remains unverified.** Headless printing failed, browser automation could not load its policy, and native Chrome access was not approved. I therefore cannot certify that the quick reference fits one page on both Letter and A4 or that the rendered packet is readable at phone width. Static CSS inspection is not a substitute. No speculative pagination finding is included in the counts.
- The report restriction prevents independently confirming the queued Talent sensitivity results and final packet tags. Those remain explicit verification limits, rather than invented failures. The parallel review file was not read or edited.

## Prioritized fixes

1. Decide and implement the all-Down Expedition continuation (F01), then specify the Night Camp retreat consequence (F02).
2. Close the Skirmish treatment/timer integration gaps and preserve untreated Pierce in the infirmary (F03, F04, F09).
3. Make Fear calculation order independent and give zero Steam damage a defined no-harm result (F05, F06).
4. Replace obsolete corpse cleanup and retreat references; reconcile Leap Clear gear and the Shoot/Block/rider procedures (F07, F08, F10–F13).
5. Apply the small reference, glossary and renderer corrections together. Regenerate tables, repeat static packet checks, verify Talent measurement tags within an authorized report audit, and complete phone/Letter/A4 visual checks before publication.
