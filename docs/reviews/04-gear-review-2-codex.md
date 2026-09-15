# Chapter 4, Gear: review round 2

Reviewed `docs/rules/04-gear.md`, every YAML file in `data/gear/`, the current Chapters 1 to 3 and the earlier-chapter rows changed by the fix pass, `CONTEXT.md`, every ADR, `DECISIONS-2026-09-14.md`, OQ-59 to OQ-69, and OQ-72. I did not read the parallel round-2 review.

All 38 YAML files under `data/` parse. I re-ran the gas model from `/private/tmp/wof-ch4-r2.rhVpC0`, outside the repository, with 1,000,000 trials per case.

## Verdict

No Critical finding remains. Four Major and two Minor findings remain open.

The gas rule meets ADR-0014. The round-1 mechanical defects were fixed, apart from the Jam-rate concern that now has a sound binding test in OQ-72. The new problems are in the resupply and ownership procedures: deferred Standard Issue has no order against the end procedure, higher Funding does not upgrade working issued gear, and the rules can create several kits while the sheet can record only one of each kind. OQ-68 also forbids the battlefield salvage that its own Attack on Titan rationale depends on.

## Round-1 Critical and Major verification

These status checks do not add to this round's finding counts.

### Codex round 1

1. **Critical 1, unlisted objects contradicted the thrown-cloak decoy: Resolved.** Section 4.1 and `items.yaml` now say an unlisted object can have an effect when another rule names it, and both cite Break Attention.
2. **Critical 2, the introduction called the baseline Gas Roll three dice: Resolved.** The introduction now says two dice, with a third only after a Pushed ODM Gear roll.
3. **Major 3, a carried comrade was an unlimited supply container: Resolved.** The passenger now adds 5 items plus every item they carry to the carrier's load. Strong Back removes only the 5.
4. **Major 4, Field Repair prose and YAML disagreed on a worn-out tool kit: Resolved.** Both now allow another kit or Wits alone, and forbid only the kit supplying Gear Dice from repairing itself.

### Opus round 1

1. **Major 1, a fall could trigger a second fall: Resolved.** The procedure clears airborne, mounted, carried, and carrying states before damage, and expressly forbids a second fall.
2. **Major 2, mounting outside a Titan Engagement was impossible and horse Position was unrecorded: Resolved.** Outside mounting has its own requirements, a dismounted horse's Position is recorded during a Titan Engagement, and horse Positions clear when it ends. Minor finding 6 below is a narrower Catalog and YAML mismatch introduced by the repair.
3. **Major 3, rating 1 ODM Gear Jams too often: Partly resolved.** The rising-Stress figures are now stated and OQ-72 makes the one-third rate a binding Chapter 5 acceptance test. Final calibration still depends on Chapter 5's Severity, Help, Covering, Stress Responses, and turn debt. That dependency is legitimate and the provisional test is sound, so I do not count it as a current finding.
4. **Major 4, Phase 1 had no repeat Standard Issue: Resolved.** OQ-59 adds interim issue at the start of each session. Finding 1 below concerns the new trigger's ordering, not the old absence of a trigger.
5. **Major 5, a Jammed or dry soldier could keep striking: Resolved.** Nape strikes and Body Part strikes from On Body or Blind Spot now need working ODM Gear with gas, in both prose and the Catalog.
6. **Major 6, Strong Back did nothing for its expected carrier: Resolved.** The revised passenger load makes a normally equipped rescue Overloaded without Strong Back and useful with it.

## Findings

### 1. Major. Deferred Standard Issue has no order against death, sharing, Retirement, and promotion

**Location:** `docs/rules/04-gear.md`, section 4.9, lines 424 to 430, and section 4.11, lines 515 to 519; `data/gear/standard-issue.yaml`, `interim_issue` and `not_received`; Chapter 3, section 3.16, steps 7 to 9; Chapter 2, section 2.10.

**Problem:** If a session begins partway through a procedure, interim Standard Issue waits until that procedure ends. Death gear is shared and promotion is also resolved when the procedure ends. Nothing orders the issue against the care window, the share-out, Retirement, or promotion. This changes who receives replacements and when Squad Supply refills. The explicit rule that a promoted Squadmate receives nothing makes the split observable: issue before promotion and the Squadmate is topped up; issue after promotion and the same soldier is excluded.

**Scenario:** A session resumes in round 3. A player character dies, the Titan Engagement ends, and a Squadmate is chosen for promotion at step 9. The deferred issue, the dead soldier's item share, Retirement, and promotion all have the same timing. The promoted soldier either receives fresh gas, blades, and a replacement horse as a Squadmate, or receives nothing as a player character.

**Fix options:**

1. Add deferred Standard Issue as a numbered step after sharing dead gear and before Retirement and promotion, then say whether the future promoted Squadmate receives it.
2. Resolve deferred issue only after the entire end procedure, including promotion, and remove or restate the promoted-Squadmate exception for that issue.
3. Move interim issue to the start of the next procedure after the resumed one ends.

### 2. Major. Higher Funding never upgrades working ODM Gear or horses

**Location:** `docs/rules/04-gear.md`, section 4.9, lines 436 and 443 to 454; `data/gear/standard-issue.yaml`, `by_funding` and `receiving.steps`.

**Problem:** The Funding table raises horse rating at Funding 5 and ODM Gear rating at Funding 6, and the design note says higher ratings come from higher Funding. The receiving procedure keeps any horse or ODM Gear whose current rating is above 0, regardless of its lower rating. A Funding increase therefore does not deliver either advertised upgrade unless the soldier first loses the item or drives it to 0. That makes the upper Funding rows false in ordinary use and rewards deliberate destruction before issue.

**Scenario:** The Squad rises from Funding 4 to 6. A soldier reports with working ODM Gear 1/1 and horse 1/1. The Funding 6 row says ODM 2 and horse 2, but both items are kept, so the soldier remains at rating 1. A comrade whose harness Jammed and horse became lame receives both rating 2 replacements.

**Fix options:**

1. Exchange an issued item when its rating is below the current Funding row, preserving the rule that equal-rated working gear is not restored.
2. State that Funding rows are minimum ratings and raise the item's rating while leaving its current rating unchanged.
3. If Funding is not meant to upgrade existing soldiers, remove that claim and define exactly who can receive the higher rows.

### 3. Major. Passing and death sharing can create several kits, but the sheet records only one

**Location:** `docs/rules/04-gear.md`, sections 4.7, 4.10 to 4.12, lines 374, 507, 515, and 527 to 537; `data/gear/carrying.yaml`, `passing_items` and `leaving_play`; `data/gear/sheet-fields.yaml`, `medical_kit`, `tool_kit`, and `squad_sheet_row`; `data/gear/standard-issue.yaml`, `specialty-item`.

**Problem:** A soldier may receive a kit by passing or from a dead soldier's share-out, with no one-kit limit. Each kit keeps its own rating and current rating, and restocking is limited once per kit per window. The gear sheet and compact Squadmate row have one `medical_kit` field and one `tool_kit` field. They cannot represent two kits with different current ratings. Standard Issue makes the state harder to resolve by exchanging a Specialty item only when the soldier has "only one" at 0, without saying what happens when they hold two spent kits.

**Scenario:** Two Medics start with one medical kit each. One dies, and the survivor receives the dead soldier's kit at the end of the fight. The survivor now holds kits at 1/1 and 0/1. The sheet has one `Med current/rating` slot, but treatment must know which kit supplies Gear Dice and medical supply must know which kit has used its once-per-window restock.

**Fix options:**

1. Limit each soldier to one kit of each kind and require an existing kit to be passed, dropped, or left before another is received.
2. Make the sheet fields and Squad row lists, one `current/rating` record per kit, and define Standard Issue for any number of spent kits.
3. Treat same-kind kits as one rated item with a separate spare count, then define swapping and restocking that count.

### 4. Major. Dead soldiers' gas and blades cannot be recovered during a Titan Engagement

**Location:** `docs/rules/04-gear.md`, section 4.11, lines 515 to 523; `data/gear/carrying.yaml`, `leaving_play`; OQ-68.

**Problem:** OQ-68 says the rule preserves canon's survivors taking gas canisters and Blade Sets from the fallen, but the chosen rule forbids anyone from taking an item until the procedure ends. In a Titan Engagement that means after the fight, when gas and blades can no longer save anyone. This is a significant Attack on Titan fidelity loss and weakens the resource game: the items most associated with desperate battlefield salvage are inaccessible at the only time that matters.

**Scenario:** A soldier dies at On Body with a half-full fitted canister and two Blade Sets. A living comrade at the same Position has run dry. The dead soldier's usable gas is listed as left for the Squad, but nobody can take it until the Titan Engagement ends, so the comrade cannot move or strike and the gas is shared only after survival has already been decided.

**Fix options:**

1. Adopt OQ-68 option (d), and require Chapter 5 to record a dead soldier's last Position until the Titan Engagement ends.
2. Add a `take-left-item` action using `item-give`, at the dead soldier's last Position, for one passable item.
3. If bodies will not hold Positions, let a comrade who held the same Position when the death occurred claim one passable item immediately by spending their next action.

### 5. Minor. Ammo is Phase 2 data, not a forward reference

**Location:** `docs/rules/04-gear.md`, section 4.10, lines 487 to 500, and the worked Squad row at line 583; `data/gear/squad-supply.yaml`, `kinds[ammo]` and `stock.ammo`; `data/gear/sheet-fields.yaml`, `squad_sheet`.

**Problem:** The chapter correctly forward-references every ammo rule as beyond Phase 1, but still defines Ammo as a current Squad Supply kind, gives it stock 0, puts it on the sheet, and prints it in the example. That is inert Phase 2 content drafted into Phase 1 rather than a forward reference. It also departs from the current glossary, though OQ-67 logs that departure.

**Scenario:** Every Phase 1 Squad records `Ammo 0` and carries the field through every resupply even though no Phase 1 item, action, or rule can change or read it.

**Fix options:**

1. Remove Ammo from the Phase 1 kind list and sheet, leaving one sentence that later weapon rules may add it.
2. Keep the reserved id in a design note or schema comment only, not as a tracked value on the live Squad sheet.

### 6. Minor. The outside mount and dismount Catalog row still disagrees with the horse rule

**Location:** `docs/rules/04-gear.md`, section 4.5, lines 230 to 242; `data/gear/horses.yaml`, `mounted.dismount.effect` and `mounted.outside_titan_engagement`; `data/character/action-catalog.yaml`, `mount-or-dismount.option_of`, lines 244 to 257.

**Problem:** The horse rule allows mounting or dismounting at any time when no procedure is under way, but the Catalog makes the option part of "the procedure under way" outside a Titan Engagement. It names no parent when there is no procedure. The YAML dismount effect also says the horse stays at the soldier's Position without limiting that statement to a Titan Engagement, although neither holds a Position outside one.

**Scenario:** Between procedures, a soldier dismounts before passing a kit. Section 4.5 permits it. The Catalog has no procedure for the option to belong to, and the source-data effect asks the horse to stay at a Position that does not exist.

**Fix options:**

1. Make `option_of` say "a move in a Titan Engagement; outside one, the procedure under way or free gear handling when none is under way", and scope the Position effect to a Titan Engagement.
2. Give outside mounting and dismounting a small named gear-handling procedure that exists whether or not another procedure is active.

## ADR-0014 gas re-simulation

The implemented Gas Rating 3 rule meets both medians in ADR-0014. My independent simulation produced these results:

| Gas Roll | Mean rounds | Median | 10th to 90th percentile | Empty by round 4 | Empty by round 6 |
|---|---:|---:|---:|---:|---:|
| Two dice, no Push | 9.2484 | 8 | 4 to 16 | 13.5155% | 32.2318% |
| Three dice, Pushing every round | 6.3388 | 6 | 3 to 11 | 32.2411% | 59.7338% |

These reproduce the drafter's reported mean 9.25, median 8, and mean 6.33, median 6. The target says results are medians, so both halves pass.

## Judgment on provisional choices

| OQ | Judgment | Reason |
|---|---|---|
| OQ-59 | Unsound in part | The interim issue closes the old resupply gap, but its deferred timing is unordered and higher Funding cannot upgrade working issued gear. Findings 1 and 2. |
| OQ-60 | Sound as a starting rule | Working ODM Gear is now required for aerial strikes, and the gas target passes. Chapter 5 still has the proper task of reporting gas per round of fighting. |
| OQ-61 | Sound in substance | The state transitions and horse Position record work. The remaining outside-procedure Catalog drift is Minor. Finding 6. |
| OQ-62 | Sound as a starting table | The trigger list is closed, the fall loop is gone, every total has a row, and damage uses current Health. Mission lethality remains a valid later simulation. |
| OQ-63 | Sound | Handles make the free swap meaningful, and the known higher-rating fragility is explicit for later Requisition pricing. |
| OQ-64 | Sound | Passenger gear now reaches the carrier's load and Strong Back removes only the fixed 5. The container exploit is closed. |
| OQ-65 | Sound | The passable list, same-Position rule, Down and Grabbed receiver, and no thrown pass are explicit. |
| OQ-66 | Sound | Prose and data now agree, attrition survives outside fights, and Help and Covering have closed limits. |
| OQ-67 | Unsound in part | The medical uses and Funding stock are sound. Ammo is active sheet data for rules explicitly beyond Phase 1. Finding 5. |
| OQ-68 | Unsound | Delaying every recovery until the fight ends defeats the stated canon reason for preserving gas and Blade Sets. Finding 4. |
| OQ-69 | Sound in substance | The rows moved to their owning files and the required earlier chapters were updated. The mount option needs the Minor correction in finding 6. |
| OQ-72 | Sound as an open acceptance test | Rating 1 remains below one-third over the quoted three-round Severity 2 to 4 probes. Chapter 5 must still run the binding case with its real Severity, Help, Covering, Stress Responses, and turn debt before the choice becomes final. |

## Dependencies, scope, and terminology

Chapter 4 honours the decisions file's explicit constraints. It adds passing and mounting rows, defines mounted and airborne, assigns horse wear to the horse, tunes wear at Stress 1, bases the third Gas Die on Pushed ODM Gear rolls rather than strikes, sizes falls against current Health 1 to 6, provides the one-line Squadmate gear row, and registers medical supplies as a Bonus Dice source. The decisions file still says current Health 1 to 5, but OQ-71 already logs the legal Health 6 build, and Chapter 4 correctly includes it.

The Round-1 fixes that touched Chapters 1 to 3 are present in the current dependency text and data: Specialty kits, the new Catalog entries and tracked values, the aerial strike requirement, Strong Back, the medical-supplies source, the Squadmate gear pointer, and Chapter 3's fall, death-gear, care-window, and Field Repair pointers. I found no new contradiction in those earlier-chapter changes beyond findings 1 and 6.

Requisition, Scarcity, Maintain Gear, Funding procedures, Expeditions, Chases, Operation Frames, Shifters, Titan placement, horse targeting, Break Attention effects, landing Positions, and round-end placement remain forward references. Ammo is the sole Phase 2 rule element drafted as current data. I found no unlogged glossary or ADR contradiction and no misuse of a glossary `_Avoid_` term.
