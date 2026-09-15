# Chapter 4, Gear: review round 3

Reviewed `docs/rules/04-gear.md`, all ten YAML files in `data/gear/`, Chapters 1 to 3 and the earlier-chapter data changed by the fix, `CONTEXT.md`, every ADR, `DECISIONS-2026-09-14.md`, OQ-59 to OQ-69, and OQ-72. OQ-72 is the only entry from OQ-72 onward. I read both round-2 reviews and did not read the parallel round-3 review.

All 37 YAML files under `data/` parse. I ran the gas and Jam checks from `/private/tmp/wof-ch4-r3.Kqk2hS`, outside the repository. The gas runs used 1,000,000 canisters per case. The Jam runs used 500,000 fights per case.

## Verdict

No Critical finding remains. Two Major and two Minor findings remain open.

The round-2 repair pass fixed the Standard Issue, Graduation Exam, kit tracking, salvage, carrying, Squadmate, and dependency defects. One repair introduced a new normal-play edge: a Gas Roll can empty the canister that Pass Item or Take Item promises to deliver. Rating 1 ODM Gear also remains above its own Jam threshold in the two-Titan probe. Ammo is still live Phase 2 data, and the death-gear share-out sentence is ambiguous about whether an assigned item then leaves play.

## Round-2 Critical and Major verification

Neither round-2 review had a Critical finding. These checks do not add to this round's counts.

### Codex round 2

1. **Major 1, deferred Standard Issue had no order against death, Retirement, and promotion: Resolved.** `interim_issue.when` now places the issue after the procedure's last step, including the share-out, Retirement, and promotion. `not_received` states that the promoted soldier then receives the waiting issue.
2. **Major 2, higher Funding did not upgrade working ODM Gear or horses: Resolved.** Full issue now replaces either item when its rating is below the Funding row. The interim issue uses the same test for ODM Gear and still replaces a lower-rated horse through the full horse step.
3. **Major 3, several kits could not be recorded: Resolved.** `medical_kits` and `tool_kits` now record one pair per kit, the Squad row prints each pair, and the Specialty step handles any number of spent kits.
4. **Major 4, dead soldiers' gas and Blade Sets could not be recovered during a Titan Engagement: Resolved.** The sheet records the dead soldier's left items and Position, and Take Item recovers one item there for an action.

### Opus round 2

1. **Major 1, the working-ODM requirement made the Graduation Exam's dummy course impossible: Resolved.** The requirement is limited to Titan Engagements. Training ODM Gear never counts as not had for lack of a canister.
2. **Major 2, interim issue erased all rating 1 wear each session: Resolved.** It now keeps equal-rated Jammed ODM Gear and spent kits. Gas, Blade Sets, lame horses, and Squad Supply still return for Phase 1 testing.
3. **Major 3, rating 1 ODM Gear Jams too often: Partly resolved.** OQ-72 now widens the binding Chapter 5 test to every Titan acting on the soldier, and Chapter 4 puts that dependency in its Chapter 5 list. The current choice still exceeds the threshold in the two-Titan probe, so finding 1 carries it.

## Findings

### 1. Major. Rating 1 ODM Gear still fails OQ-72's two-Titan Jam threshold

**Location:** Section 4.9, design note and `PROVISIONAL (OQ-72)`; `data/gear/standard-issue.yaml`, Funding 1 to 5; OQ-72.

**Problem:** OQ-72 sets no more than one Jam in three three-round fights for the soldier holding Attention. Its widened test properly includes cards from every Titan, but the current rating 1 choice already exceeds that threshold when two Titans force one dodge each per round. My independent 500,000-fight runs, with Agility 3, Stress starting at 1 and rising on each Push, Pushing when short, and Stress Responses not applied, gave:

| Severity | One Titan | Two Titans |
|---|---:|---:|
| 2 | 27.813% | 42.038% |
| 3 | 31.457% | 46.944% |

Stress Responses, Help, Covering, and turn debt can move the final result, but no drafted rule yet brings 42% to 47% under the binding one-third limit. The current handling therefore postpones a known balance failure into Chapter 5. That is risky because raising ODM Gear to 2 also changes the reference dodge that Chapter 5 must tune.

**Scenario:** A soldier at On Body holds one Focus Titan's Attention while a second Focus Titan also targets them. They dodge each Titan once per round at Severity 3 and Push when short. Their rating 1 harness Jams within three rounds in 46.944% of runs, and an airborne Jam at On Body causes a high fall.

**Fix options:**

1. Decide OQ-72 before Chapter 5 and issue rating 2 ODM Gear at Funding 3 and 4, amending ADR-0014's ODM reference Gear Dice.
2. Keep rating 1 and adopt OQ-72 option (e), the first-wear mark only in a round where a second Titan's card reaches the soldier.
3. If option (a) remains, require Chapter 5 to demonstrate the full model below one-third before any Severity or Tempo value is accepted. Do not treat the current simplified two-Titan figures as a pass.

### 2. Major. The immediate Gas Roll can destroy the canister that Pass Item or Take Item says the receiver gains

**Location:** Section 4.3, lines 136 to 150; section 4.7, Passing and Taking an item; `data/gear/odm-gear.yaml`, `gas`, `gas_roll.canister_removed`; `data/gear/carrying.yaml`, `passing_items.passable` and `taking_items.effect`.

**Problem:** The round-2 fix rolls gas on a fitted canister before it moves. If that roll lowers Gas Rating to 0, three rules disagree about what happens next:

- A canister at 0 is discarded when removed, and every spare must have Gas Rating 1 or more.
- Pass Item says the receiver gains the fitted canister as a spare with its Gas Rating.
- Take Item says the fitted canister reaches the taker as a spare with its Gas Rating.

The rules do not say whether the action transfers nothing, whether the receiver gets an illegal Gas Rating 0 spare, or whether the canister transfers with its pre-roll rating. This is likely during the desperate low-gas handover the rule was added to support. Exact enumeration gives a 30.556% chance that a two-die Gas Roll empties a Gas Rating 1 canister, or 42.130% on three dice. At Gas Rating 2 the chances are 2.778% and 7.407%.

**Scenario:** Armin used ODM Gear this round and has Gas Rating 1. At Mikasa's Position he passes her the fitted canister. The immediate two-die Gas Roll shows one 1, so its Gas Rating becomes 0. The canister rule discards it on removal, while Pass Item says Mikasa receives it as a spare.

**Fix options:**

1. Resolve the Gas Roll before the transfer. If it empties the canister, discard it and state that Pass Item or Take Item is spent but transfers nothing.
2. Let the passer or taker cancel the action after the Gas Roll empties the canister, while the Gas Roll still counts for the round.
3. Move the canister first, mark it as owing its former user's Gas Roll, and apply the loss to it on the receiver's sheet, discarding it there if it reaches 0.

### 3. Minor. Ammo is still drafted as live Phase 2 data

**Location:** Section 4.10, Kinds and units and Stock; section 4.12; `data/gear/squad-supply.yaml`, `kinds.ammo` and `stock.ammo`; `data/gear/sheet-fields.yaml`, `squad_sheet`.

**Problem:** The text calls ammo reserved for rules beyond Phase 1, but Phase 1 still creates an Ammo kind, sets it to 0, records it on every Squad sheet, and prints it in the example. That is inert Phase 2 content rather than a forward reference. OQ-67 logs the glossary change but does not make the live field useful.

**Scenario:** Every Phase 1 Squad repeatedly records and restocks `Ammo 0`, though no Phase 1 item or procedure can change or read it.

**Fix options:**

1. Remove Ammo from the Phase 1 kinds, stock, sheet, and example. Keep one forward-reference sentence saying later weapon rules may add it.
2. Keep `ammo` only as a reserved schema id in a design note, not as a tracked Squad value.

### 4. Minor. The share-out wording can make an assigned item leave play

**Location:** Section 4.11, Sharing out; `data/gear/carrying.yaml`, `leaving_play.death.shared_out`.

**Problem:** The prose says the players "give each left item ... to a living soldier ... or leave it, and then it leaves play." The YAML similarly ends "or leave it, and a left item leaves play." Grammatically, the final clause can apply to every left item, including one just assigned. That contradicts the purpose of sharing out gear.

**Scenario:** The players give a dead soldier's Blade Set to Ilse. One reading adds it to Ilse's gear; the literal final clause then makes the same left item leave play.

**Fix options:**

1. Say, "The players give each item to an eligible living soldier. Any item they leave unassigned then leaves play."
2. Split assignment and disposal into two ordered steps in `shared_out`.

## ADR-0014 gas re-simulation

The Gas Rating 3 rule remains the closest whole-number fit to ADR-0014's targets. The ADR reports medians. My independent simulation produced:

| Gas Roll | Mean rounds | Median | 10th to 90th percentile | Empty by round 4 | Empty by round 6 |
|---|---:|---:|---:|---:|---:|
| Two dice, no Push | 9.2470 | 8 | 4 to 16 | 13.4765% | 32.2556% |
| Three dice, Push every round | 6.3325 | 6 | 3 to 11 | 32.2175% | 59.7321% |

These reproduce the drafter's reported mean 9.25, median 8, and mean 6.33, median 6. Rating 3 therefore gives a median of 8 against about 9 rounds of ODM use and a median of 6 against about 6 when Pushing every round. The no-Push canister was empty by round 8 in 51.3331% of runs.

## Provisional decisions

| OQ | Judgment |
|---|---|
| OQ-59 | **Sound.** The interim issue preserves wear, has an explicit place after a delayed procedure, upgrades lower-rated issued gear, and records several kits. |
| OQ-60 | **Partly sound.** The Exam exception, strike requirement, medians, and immediate Gas Roll premise work. The empty-canister transfer outcome is undefined. Finding 2. |
| OQ-61 | **Sound.** Airborne, mounted, horse Position, outside mounting, forced dismounts, and the Catalog option agree. |
| OQ-62 | **Sound.** The closed trigger list and procedure now carry a comrade through a Down carrier's fall without a double fall. |
| OQ-63 | **Sound.** The handles, swap, ruin, and higher-rating warning are explicit. Squadmates correctly never ruin a set because they never Push. |
| OQ-64 | **Sound.** The passenger and their items count, Strong Back has the intended limit, and Take Item gives weak carriers a costly way to shed the passenger's load. |
| OQ-65 | **Partly sound.** Passing and taking have closed requirements and tracked values. A Gas Roll that empties the fitted canister leaves their effect undefined. Finding 2. |
| OQ-66 | **Sound.** Field Repair has closed targets, ordering, Help, Covering, and care-window limits. |
| OQ-67 | **Partly sound.** Flares and both medical uses are closed. Ammo is Phase 2 data on the live sheet. Finding 3. |
| OQ-68 | **Sound in substance.** Battlefield recovery, last Position, and share-out timing work. The final share-out sentence needs the Minor clarification in finding 4. |
| OQ-69 | **Sound.** Items 1 to 9 and 11 to 22 are present in their owning files. The two glossary edits remain deliberately unapplied for the decider. |
| OQ-72 | **Unsound as the current rating choice.** The widened acceptance test is correct, but the two-Titan probe is already above its one-third threshold. Finding 1. |

## Dependencies, scope, and data checks

Chapter 4 honours the decisions file's Chapter 4 constraints: the Catalog has passing, taking, mounting, and dismounting; mounted and airborne are explicit; horse wear belongs to the horse; tuning uses Stress 1 and gas Pushes from ODM Gear rolls rather than strikes; falls use current Health; the Squadmate gear row is one line; and medical supplies have a Bonus Dice row.

The decisions file's older Chapter 4 constraint says current Health 1 to 5. OQ-71 logs the legal Health 6 build, and Chapter 4 correctly checks 1 to 6. This is not an unlogged contradiction. The earlier-chapter changes required by the round-2 fixes are present in Chapters 2 and 3 and their YAML. I found no new contradiction there beyond finding 2's Catalog effect.

Requisition, Scarcity, Maintain Gear, Funding procedures, Expeditions, Chases, Operation Frames, Shifters, Titan placement, horse targeting, Break Attention effects, landing Positions, and round-end placement remain forward references. Ammo is the only Phase 2 element drafted as current state. No current file refers to the removed `data/gear/catalog-additions.yaml`. I found no unlogged ADR or glossary contradiction and no misuse of a glossary `_Avoid_` term.
