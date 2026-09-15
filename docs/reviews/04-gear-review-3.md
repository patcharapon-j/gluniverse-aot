# Chapter 4, Gear: review round 3

Reviewed:

- `docs/rules/04-gear.md`.
- Every file in `data/gear/` (10 files; `catalog-additions.yaml` is gone).
- OQ-59 to OQ-69 and OQ-72 in `docs/rules/OPEN-QUESTIONS.md`.
- The earlier-chapter files the second fix round changed: `data/character/action-catalog.yaml` (`take-item`, `item-take`, the strike rows, `mount-or-dismount.option_of`), `data/character/talents.yaml` (Strong Back), and Chapter 2 sections 2.6, 2.8, 2.9, and 2.10.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended.
- Chapters 1 to 3 and their data, including `data/character/graduation-exam.yaml`, `data/character/enlistment.yaml` (`drive_rules`), `data/character/squadmates.yaml` (`promotion`), `data/harm/engagement-end.yaml`, and `data/harm/treat-injury.yaml`.
- `docs/rules/DECISIONS-2026-09-14.md`: every decided entry the edits touch (OQ-12, OQ-13, OQ-22, OQ-25, OQ-28, OQ-29, OQ-31, OQ-35, OQ-44, OQ-45, OQ-56) and *Constraints on the undrafted Phase 1 chapters*.
- Both round 2 reviews: `04-gear-review-2.md` and `04-gear-review-2-codex.md`.

I did not read the parallel round 3 Codex review.

Odds come from Python scripts in the scratchpad, which are not committed. The appendix gives the models.

- Gas lifetimes, the Gas Roll on a moving canister, and single Field Repair rolls are exact.
- The Jam models use 100,000 runs per case, the Field Repair window 200,000, and Rookie gas 200,000 canisters.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**No Critical findings.**

- No rule rests on GM discretion. The new take and interim-issue rules are procedure steps, and the `gm` rows still forbid rulings.
- Every glossary departure is logged: Standard Issue (OQ-59), ammo in Squad Supply (OQ-67), and Overloaded's "no move with no action left" (OQ-64).
- No `_Avoid_` term is misused, and no pointer dangles. Nothing outside `docs/reviews/` names `catalog-additions.yaml`, and all 37 YAML files under `data/` parse.
- No Phase 2 procedure is drafted. Ammo stays a reserved kind at 0, and the two round 2 reviews' disagreement on it is logged for the decider under OQ-67.
- ADR-0014's gas target is reachable, and the chapter's figures reproduce exactly.

**Round 2.** All seven round 2 Majors are resolved except Opus Major 3, which is logged as OQ-72 and still open. The eight round 2 Opus Minors are resolved. One fix created a new Minor (finding 2).

**One Major open:** rating 1 ODM Gear Jams for the soldier holding Attention in 31.4% of 3-round fights at Severity 3, and 47.2% when a second Focus Titan's cards reach them. It is logged as OQ-72, which needs ADR-0014 amended and is not yet recorded among the decisions file's Chapter 5 constraints.

**Six Minors follow.** The most useful to the decider are:

- **Finding 2:** the Gas Roll made at once can empty the canister being handed over, and no rule says what then reaches the receiver.
- **Finding 3:** the end-of-fight care window repairs almost every Jam, so the claim in OQ-59 and OQ-66 that wear carries between sessions seldom holds.

## Round 2 Majors

| Round 2 finding | Status | Evidence |
|---|---|---|
| Opus Major 1: the strike requirement made the Graduation Exam's Titan dummy course impossible | Resolved | `odm-gear.yaml` `strikes` applies only in a Titan Engagement, and its `outside_titan_engagement` row names the Exam. Both Catalog rows say "In a Titan Engagement", and so does section 2.8. `items.yaml` also excuses the Exam's training ODM Gear from running dry, which keeps the Gear Die on Trial 1's Fly and Trial 3's Break Attention. `graduation-exam.yaml`, decided under OQ-22, is untouched. |
| Opus Major 2: the interim issue fully restored every rating 1 item each session | Resolved as raised | `interim_issue.differences` keeps Jammed ODM Gear rated at the Funding row and keeps a kit at 0. A lame horse is still exchanged, as OQ-59 intends, since no Phase 1 rule restores a horse. Finding 3 shows that Field Repair at the end of a fight now does most of what the old issue did, which is a rationale problem, not a return of the bug. |
| Opus Major 3: rating 1 ODM Gear Jams too often for the Attention holder | Not resolved, logged as OQ-72 | OQ-72 (a)'s test now covers cards from every Titan that acts on the soldier, and the two-Titan figures are in section 4.9. The entry still needs the decider, and the test is still not in the decisions file. Carried as finding 1. |
| Codex Major 1: deferred Standard Issue had no order against the end procedure | Resolved | `interim_issue.when` puts it after the procedure's last step, "after sharing out a dead soldier's gear, Retirement, and promotion". `not_received` says the promoted Squadmate receives that issue. |
| Codex Major 2: higher Funding never upgraded working ODM Gear or horses | Resolved | `receiving.steps` 1 and 4 replace ODM Gear or a horse rated below the row. Finding 4 is a narrower case the change leaves: a broken item rated above the row is downgraded. |
| Codex Major 3: several kits, one sheet field | Resolved | `sheet-fields.yaml` records one rating and current rating pair per kit, the Squad row shows `Med 1/1 0/1`, and `specialty-item` reads "holds no item of its kind at a current rating above 0". |
| Codex Major 4: a dead soldier's gas and blades could not be recovered during a fight | Resolved | OQ-68 (e): `where_left` puts the left items at the dead soldier's Position, the sheet records it in `left_at`, and `take-item` takes one there for an action. |

The round 2 Opus Minors:

- **4, the airborne carrier who becomes Down:** resolved. The `ends` row keeps carrying until step 2 of the carrier's fall, and `triggers[carried]` names the Down fall.
- **5, a Down comrade's items stuck on them:** resolved by `take-item`. The section 4.7 design note now says which carriers must take items.
- **6, means against medians:** resolved in the gas table. The Rookie sentence is still in means (finding 7).
- **7, order at the end of a procedure, and the retiring carrier:** resolved.
- **8, passing a fitted canister skipped the Gas Roll:** resolved by `canister_removed`. The fix opens finding 2.
- **9, Chapter 2's note on Squadmate gear:** resolved in section 2.10.
- **10, the Chapter 5 dependency list:** resolved in the introduction.
- **11, wording:** resolved.

The round 2 Codex Minors: Minor 6 (the mount option outside a Titan Engagement) is resolved. Minor 5 (ammo) is kept and logged under OQ-67 as a conflict between the two round 2 reviews, so I do not count it.

## Checks that passed

- **ADR-0014 gas target (exact; the chapter's figures in brackets):**

  | Full Gas Rating | Dice | Mean | Median | 10th to 90th | Empty by round 4 | Empty by round 6 | Empty by round 8 | Lasts 9 or more |
  |---|---|---|---|---|---|---|---|---|
  | 3 | 2 | 9.25 (9.25) | 8 (8) | 4 to 16 (4 to 16) | 13.5% (13.5) | 32.3% (32.3) | 51.3% (51.3) | 48.7% (48.7) |
  | 3 | 3 | 6.33 (6.33) | 6 (6) | 3 to 11 (3 to 11) | 32.3% (32.3) | 59.7% (59.7) | 78.8% | 21.2% |
  | 3 | 2 in round 1, then 3 (Light Trigger once) | 6.67 (6.67) | 6 (6) | 3 to 11 (3 to 11) | 27.3% (27.3) | 55.6% (55.6) | 76.3% | 23.7% |
  | 2 | 2 / 3 | 6.25 / 4.33 (6.25 / 4.33) | 5 / 4 (5 / 4) | 2 to 11 / 2 to 8 | 39.5% / 61.9% | | | |
  | 4 | 2 / 3 | 12.25 / 8.33 (12.25 / 8.33) | 11 / 8 (11 / 8) | 6 to 20 / 4 to 13 | 3.1% / 12.5% | | | |

  Gas Rating 3 gives the closest whole-number medians to about 9 and about 6. OQ-60's simulator case records the no-Push half as accepted at a median of 8. Rating 2 misses both halves and rating 4 overshoots both, so no whole number does better, and the target is not unreachable.
- **Rookie gas, Pushing only when short** (Agility 3, ODM Gear 1, Stress 1, 200,000 canisters):
  - Needing 1 success: mean 8.06, median 7, 10th to 90th percentile 4 to 14, Pushing on 32.1% of rounds. The chapter gives 8.05 and 32%.
  - Needing 2: mean 7.10, median 6, 3 to 12, Pushing on 65.8%. The chapter gives 7.10 and 66%.
- **Jam figures** (rising Stress, Pushing when short, 3 rounds, gas ignored, 100,000 runs; chapter's figures in brackets):

  | ODM Gear | Severity | One Titan | Two Titans |
  |---|---|---|---|
  | 1 | 2 | 28.0% (27.8) | 42.1% (42.1) |
  | 1 | 3 | 31.4% (31.6) | 47.2% (46.9) |
  | 2 | 2 | 8.3% (8.3) | 18.0% (18.1) |
  | 2 | 3 | 10.5% (10.5) | 22.6% (22.4) |

  All are within simulation noise.
- **Carrying.** The section 4.7 design note is now exact:
  - Dropping one's own items clears Overloaded only for Strength 4 or more with a kit-free comrade (5 + 3 = 8).
  - With Strong Back the load is 6 to 8. That fits Strength 3 unless both soldiers hold a kit, and Strength 2 unless either does.
  - A Strength 3 carrier needs one Take Item (an action) and a free drop.
- **Worked example.** Unchanged since round 2 and still correct against the YAML: Jonas's dodge, wear, Jam, high fall, three-die Gas Roll, Ilse's Field Repair, Change Canister, and the 11/7 load.
- **The decisions file's Chapter 4 constraints** are all met or logged:
  - `item-give`, `pass-item`, and `mount-or-dismount` are in the Catalog.
  - Mounted, dismounted, horse Gear Dice, horse wear, and lame are defined.
  - A carried soldier is not airborne.
  - Wear is tuned at Stress 1, and gas is tuned with Pushes on dodges, Fly, and Break Attention, never strikes.
  - Falls are sized against current Health. The chapter says 1 to 6 where the decisions say 1 to 5, which OQ-71 item 7 logs.
  - The one-line Squad row exists.
  - The medical Bonus Die is a `bonus-dice-sources.yaml` row.
- **The round 2 earlier-chapter edits against decided entries:**
  - OQ-22: the Exam file is untouched, and the Exam fix lives only in Chapter 4's rows.
  - OQ-25 and OQ-12: the dodge and Gas Roll rows are unchanged.
  - OQ-28 (e): section 2.6 still grants a Specialty only the key attribute, the swap and floor, and one Talent level. The kit comes "separately, through Standard Issue", which OQ-59 logs.
  - OQ-13 and OQ-29: the section 2.10 note now says a Squadmate's gear never wears because it never Pushes. That follows from both entries.
  - OQ-35: `pass-item` is unchanged apart from the Grabbed receiver round 2 accepted. `take-item` is a separate entry with its own tracked value, as ADR-0003 item 12 allows.
  - OQ-56: Chapter 3's same-Position rule for soldiers who left is untouched. Extending it to gear acts is forwarded to Chapter 5, which OQ-56 gives what a leaver's action can do.
- **Drives.** Taking an item is not on `drive_rules.targets.grabbed_or_down_comrade`'s closed list, so stripping a Down comrade never counts toward Pay It Forward.
- **ADR-0003 checklist:**
  - Item 7: Field Repair states its Help requirement in and out of a Titan Engagement.
  - Item 8: the *No rulings* paragraph and the `gm` rows.
  - Item 9: every new act is a Catalog entry.
  - Item 12: `item-take` and `take-item` are listed in section 4.13 and section 2.9.
  - Item 13: no Chapter 4 state forbids a Push, Help, Cover, or Reaction.
- **Glossary terms.** The only near-hit on an `_Avoid_` term is "one pair of ODM blades" inside the Blade Set definition, which is the glossary's own wording.

## Findings

### 1. Major (logged as OQ-72). Rating 1 ODM Gear Jams in about a third of the Attention holder's fights, and nearly half with a second Focus Titan

**Location:**

- Section 4.9, the *ADR-0014 reference builds* note and `PROVISIONAL (OQ-72)`.
- `data/gear/standard-issue.yaml` `by_funding` (`odm_gear_rating: 1` at Funding 1 to 5).
- OQ-72, option (a) and its simulator case.
- `docs/rules/DECISIONS-2026-09-14.md`, *Chapter 5, Titan Engagement* constraints, which do not carry the test.

**Status:** carried from round 2. It is logged as an ADR question, so it is not Critical. This is the chapter's last review round, so only the decider can close it.

**Problem:**

- The figures reproduce. Within 3 rounds, the soldier holding Attention Jams 31.4% of the time at Severity 3 with one Titan, and 47.2% with two Titans. That is above OQ-72's own threshold of a third. The model applies no Stress Responses, Help, or Covering.
- Every airborne Jam at On Body or Blind Spot is a high fall.
- A Squadmate never Pushes, so every Jam from wear lands on a player character.
- OQ-72 now states the widened test, but the Chapter 5 constraints in the decisions file do not, and a drafter cannot add it.
- Option (b), rating 2, moves the reference dodge Chapter 5 tunes Severity against. A Rookie's Severity 3 dodge goes from 24% to 29% (OQ-25). It is cheapest to choose before Chapter 5 is drafted.

**Scenario:**

1. A Hunter player character (Agility 3, ODM Gear 1, Stress 1) holds a Medium Focus Titan's Attention at On Body.
2. A Background Titan's clock fills, and it enters as a second Focus Titan whose cards also reach the Hunter.
3. The Hunter dodges both Titans each round at Severity 3, Pushing when short.
4. By the end of round 3 the harness has Jammed 47.2% of the time. Each airborne Jam is a high fall that Downs a Health 3 soldier from full a third of the time.

**Fix options:**

1. The decider settles OQ-72 before Chapter 5 is drafted, and records the chosen test among the decisions file's Chapter 5 constraints.
2. Adopt (b): ODM Gear rated 2 at Funding 3 and 4, with ADR-0014's Rookie amended to Gear Dice 2 for ODM Gear. With two Titans that gives 18.0% at Severity 2 and 22.6% at Severity 3.
3. Adopt (e): the first-wear mark applies only in a round in which a second Titan's card reaches the soldier. This keeps the one-Titan figures and rating 1.

### 2. Minor. The Gas Roll made at once can empty the canister being passed or taken, and nothing says what reaches the receiver

**Location:**

- `data/gear/odm-gear.yaml` `gas_roll.canister_removed`.
- `data/gear/carrying.yaml` `passing_items.passable`: the fitted canister, "if its Gas Rating is above 0 ... The receiver gains it as a spare with its Gas Rating". Also `taking_items.effect`.
- `data/gear/items.yaml` `gas-canister.holds`: "An empty canister is discarded when it is removed from ODM Gear".
- `data/gear/sheet-fields.yaml` invariant: "Every entry in spare_canisters is 1 or more".
- Sections 4.3 and 4.7. `data/gear/carrying.yaml` `leaving_play.death.left_for_the_squad`.

**Problem:** The round 2 fix rolls the round's Gas Roll on the fitted canister "before it moves". The passable test ("if its Gas Rating is above 0") is met when the act is declared, but the roll can then bring the canister to 0. Three rules then disagree:

- The pass says the receiver gains it "as a spare with its Gas Rating", which is 0. The sheet invariant forbids a spare at 0.
- The canister rule says an empty canister is discarded on removal. The receiver gets nothing, and the passer's action is spent for nothing.
- A reading that re-checks "above 0" makes the pass illegal after the roll, but nothing says whether the action is refunded or the roll stands.

Exact odds that the immediate roll empties the canister:

| Canister's Gas Rating | Two-die Gas Roll | Three-die Gas Roll |
|---|---|---|
| 1 | 30.6% | 42.1% |
| 2 | 2.8% | 7.4% |

**A related gap:** a soldier who dies after using ODM Gear in a round has their fitted canister become a left item at once, "as a spare if its Gas Rating is above 0". No rule says whether that soldier's Gas Roll for the round is still made, so the canister escapes it. A comrade can then take it with the round's gas untouched, the same gain round 2 Minor 8 closed for passing.

**Scenario:**

1. Armin, at Gas Rating 1, makes an ODM move to the dry Mikasa at Blind Spot and passes her his fitted canister as his action.
2. His immediate two-die Gas Roll shows 1 and 4.
3. One player says Mikasa receives a canister at Gas Rating 0. Another says it is discarded and Armin's action is gone. A third says the pass never happened.

**Fix options:**

1. Add to `canister_removed`: "If the roll brings the canister to 0, it is discarded. The soldier is at Gas Rating 0 with no canister fitted, nothing reaches the receiver or taker, and the action is still spent."
2. Make the passable test read the Gas Rating after that roll. If it is 0, the canister is discarded, the pass or take is not made, and the action is not spent. The Gas Roll stands.
3. For a death, add to `gas_roll`: a soldier who dies after using ODM Gear this round makes that round's Gas Roll at once, on the fitted canister, before it becomes a left item.

### 3. Minor. The end-of-fight care window repairs almost every Jam, so the claim that wear carries between sessions seldom holds

**Location:**

- `data/gear/field-repair.yaml`: `target.whose.outside_titan_engagement` ("An item of any soldier in the care window's scope") and `outside_titan_engagement.rolls` (one roll per soldier).
- Section 4.8.
- Section 4.9, `PROVISIONAL (OQ-59)`: "It leaves a Jam to Field Repair and a spent kit to restocking or Field Repair, so wear carries from one session to the next".
- OQ-59, *Why*: "It leaves a Jam to Field Repair".
- OQ-66, *Why*, bullet 1, as revised: "this limit holds across session breaks as well as between fights in one session".

**Problem:** Each soldier in the window gets one Field Repair roll, but every soldier can aim that roll at the same item, and rating 1 ODM Gear needs 1 success.

The simulation rolls soldiers in turn on the Jammed harnesses until each is repaired. Player characters (Wits 3, Stress 1) Push when short, and Squadmates (Wits 3, Stress 0) never Push. It gives these odds that a Jam is still there after the window:

| Soldiers not Down in the window | 1 Jam | 2 Jams |
|---|---|---|
| 6 (4 player characters, 2 Squadmates) | 0.1% | 1.9% |
| 4 (2 player characters, 2 Squadmates) | 2.1% | 17.8% |
| 3 (1 player character at Wits 2, 2 Squadmates) | 11.3% | 50.1% |

So a Jam outlasts the fight it happened in only when most of the Squad is Down or dead. The round 2 change that keeps Jammed ODM Gear through the interim issue then applies to almost no harness.

The rule itself is sound and canon-plausible, since soldiers maintain their gear after a fight. What is wrong is the stated reason. OQ-66 says that without its limit "Pushing ODM Gear would cost something only inside the fight", and with the limit that is what happens in nearly every fight. The decider will weigh OQ-72 on the cost of a Jam, and that cost is the fall and the lost rounds, not a harness carried into the next session.

**Scenario:**

1. In session 3, the Hunter Jams in round 2.
2. In the end-of-fight care window, the other four soldiers who are not Down roll on the Hunter's harness in turn, and the second roll succeeds.
3. Session 4's interim issue finds no Jammed harness to keep. The rule OQ-59 cites for carrying wear between sessions had nothing to apply to.

**Fix options:**

1. Keep the rule and correct the *Why* of OQ-59 and OQ-66 and the section 4.9 block. A Jam nearly always ends in the care window of the fight it happened in. What carries past a fight is a Jam when most of the Squad is Down, a lame horse until the next session, and spent Squad Supply.
2. If carried wear is wanted, allow one Field Repair roll per item per window, with Help as now. One roll at Wits 3 and Stress 1, Pushed when short, still fails 25.2% of the time (exact).
3. Record the figures above as OQ-66's simulator case, next to the PC death target, so the choice is made with them in view.

### 4. Minor. A full Standard Issue downgrades a Jammed or lame item rated above the Funding row

**Location:**

- `data/gear/standard-issue.yaml` `receiving.steps`:
  - `odm-gear`: Jammed ODM Gear is replaced "with the row's rating".
  - `horse`: a lame horse is replaced "with the row's rating".
  - `decline`: only spares, Blade Sets, and Specialty items can be declined.
- Section 4.9, *Receiving it*, steps 1, 4, and 6.
- OQ-59 (a).

**Problem:**

- Round 2 made a full issue replace ODM Gear or a horse rated below the row. It still replaces Jammed ODM Gear or a lame horse at the row's rating, whatever that item was rated, and neither exchange can be declined.
- A rating 2 item issued at Funding 5 or 6, or by the Requisition rules, that is broken when a lower-Funding issue arrives leaves play for a rating 1 item.
- The interim issue avoids this for ODM Gear but not for a horse, which it also exchanges at the row's rating.
- No Phase 1 table sees it, since Funding stays 3 and every issued item is rated 1. The Funding, Requisition, and Maintain Gear rules will.

**Scenario:**

1. After a failed Expedition, Funding falls from 6 to 4 under the Funding rules.
2. A Veteran's rating 2 horse went lame in the last fight.
3. The next Expedition's full issue gives a rating 1 horse, and the rating 2 horse leaves play, although a Maintain Gear Downtime Action could have restored it.

**Fix options:**

1. Replace a Jammed or lame item at the higher of the row's rating and the old item's rating.
2. Let the soldier decline the exchange and keep the item at 0.
3. Record the case in OQ-59 for the Funding and Requisition rules to settle.

### 5. Minor. Taking an item outside a Titan Engagement has no order when players disagree

**Location:**

- `data/gear/carrying.yaml` `taking_items.requirements.outside_titan_engagement` and `spends.outside_titan_engagement` ("nothing").
- Section 4.7, *Taking an item*.
- For comparison, `field-repair.yaml` `outside_titan_engagement.order` and `carrying.yaml` `leaving_play.death.shared_out`, which both use the roll-off in `data/character/lifepath.yaml` (`group_choices`).

**Problem:**

- Outside a Titan Engagement, `take-item` spends nothing and has no timing.
- Two players can each declare taking the same item from a Down comrade, and the Down soldier's own player may object to losing it.
- In a Titan Engagement, turn order settles who takes first. Outside one, no rule orders the takes or settles the disagreement.
- The two neighbouring procedures, Field Repair order and the share-out, both name the roll-off. Taking does not.

**Scenario:**

1. After a fight, the Squadmate Tomas is Down with one spare canister.
2. In the care window, two players whose soldiers ran dry each declare Take Item on that canister.
3. No rule says whose take happens.

**Fix options:**

1. Add to `taking_items.outside_titan_engagement`: "If players disagree about who takes an item, or in what order, use the roll-off in data/character/lifepath.yaml (group_choices)."
2. Outside a Titan Engagement, let taking from a Down comrade happen only as the players choose together, as the share-out does.

### 6. Minor. A recorded horse or left-item Position does not name the Focus Titan it is relative to

**Location:**

- `data/gear/horses.yaml` `horse_position` and `mounted.mount.requirements.in_titan_engagement`.
- `data/gear/carrying.yaml` `leaving_play.death.where_left` and `taking_items.requirements.in_titan_engagement`.
- `data/gear/sheet-fields.yaml`: `horse.position`, `left_at`, and the Squad row marks `@Distant` and `Dead @`.
- `data/gear/falls.yaml` `height`, step 3 ("the Focus Titan that the Position is held relative to").
- The introduction's Chapter 5 list.
- The glossary: Position ("relative to a Focus Titan") and Background Titan ("enters as a second Focus Titan when the clock fills").

**Problem:**

- Positions are relative to a Focus Titan, and a Titan Engagement can hold two.
- The sheet records a dismounted horse's Position and a dead soldier's left items as a bare Position. The mount requirement and `take-item` compare that record with "the Position the soldier holds", which may be held relative to either Titan.
- The fall rule already assumes a Position is held relative to one named Focus Titan, so the records are the odd ones out.
- The introduction lists what Chapter 5 must settle about horses and left items, but not this.

**Scenario:**

1. Ilse dismounts at In Reach of Titan A, and her row reads `Hr 1/1 @In Reach`.
2. Titan B enters as a second Focus Titan, and Ilse later holds In Reach of Titan B.
3. One reading lets her mount, because she holds In Reach. The other forbids it, because the horse is at Titan A's In Reach.

**Fix options:**

1. Record the Focus Titan with the Position (`@In Reach A`, `Dead @On Body A`), and state that the mount and take tests compare both.
2. Add to the introduction's Chapter 5 list: how a soldier's Position, and a recorded horse or left-item Position, work when two Focus Titans are in play.

### 7. Minor. Wording and figure slips

**Locations and problems:**

- **`odm-gear.yaml` `gas_roll.canister_removed`:** "with the number of dice that dice (below) gives" is garbled.
- **Section 4.1, *Restoring*:** "the interim issue replaces a lame horse but not Jammed ODM Gear or a kit at 0". Section 4.2 and `interim_issue` say it does replace Jammed ODM Gear rated below the row.
- **OQ-72, *Why*:** "where one Titan gives 28.0% and 31.7%". Its own *Figures* and section 4.9 give 27.8% and 31.6%.
- **Section 4.3, gas design note:** the Rookie Push-when-short figures are means only (8.05 and 7.10), while ADR-0014 reports medians and the table above them now leads with medians. The medians are 7 and 6, with 10th to 90th percentiles of 4 to 14 and 3 to 12.
- **`horses.yaml` `forced_dismount`:** only the Grabbed row says the horse stays at the Position. The lame and Down rows do not, though `dismount.effect` covers them. The difference invites a reader to think those horses go elsewhere.

**Fix options:**

1. Read "with the dice that `dice` (below) gives for the rolls they have made so far this round". In section 4.1, add "unless it is rated below the Funding row".
2. Use 27.8% and 31.6% in OQ-72's *Why*, and add the Rookie medians to the section 4.3 note.
3. Add "The horse stays at the Position." to the lame and Down rows of `forced_dismount`, or remove it from the Grabbed row and rely on `dismount.effect`.

## Provisional decisions OQ-59 to OQ-69 and OQ-72

| OQ | Judgment |
|---|---|
| OQ-59 | **Sound.** Both round 2 Majors on it are fixed: the interim issue keeps a Jam and a spent kit, and a full issue reaches soldiers whose gear is rated below the row. Its *Why* overstates how often a Jam carries between sessions (finding 3). A full issue still downgrades a broken item rated above the row (finding 4). |
| OQ-60 | **Sound.** Scoping the strike requirement to Titan Engagements fixes the Exam without editing a decided file. The medians are reported and reproduce. The Gas Roll made at once can empty the handed-over canister (finding 2). |
| OQ-61 | **Sound.** The mount option outside a Titan Engagement and the Titan-Engagement-only horse Position are fixed. A recorded Position names no Focus Titan (finding 6). |
| OQ-62 | **Sound.** The carried trigger and the carrying `ends` row now agree for a carrier who becomes Down while airborne or mounted, and `never_a_second_fall` covers the carrier whose own fall Downs them. |
| OQ-63 | **Sound.** Unchanged, and Chapter 2's section 2.10 note now matches it. |
| OQ-64 | **Sound.** `take-item` removes the stuck load, and the design note's arithmetic is exact. |
| OQ-65 | **Sound.** `take-item` is its own entry and tracked value, so the decided `pass-item` row stays as OQ-35 wrote it. Takes outside a Titan Engagement need a dispute rule (finding 5). |
| OQ-66 | **Sound as a rule.** Its revised *Why* claims a persistence the per-soldier rolls almost never allow (finding 3). |
| OQ-67 | **Sound.** Ammo is the one open disagreement between the round 2 reviews, and the entry leaves it to the decider with the glossary change. |
| OQ-68 | **Sound.** (e) gives canon's salvage during a fight without giving a dead soldier a Position, and a soldier who dies Grabbed leaves nothing to take. The dead soldier's Gas Roll for the round is unstated (finding 2). |
| OQ-69 | **Sound.** Items 18 to 22 are applied as listed, the file of rows for earlier chapters is gone, and no reference to it remains outside the review files. |
| OQ-72 | **Sound as a log, still open.** The figures reproduce, and the widened test is right. It needs the decider before Chapter 5, and the test must be copied into the decisions file (finding 1). |

## Appendix: models

**Gas (exact).** A Markov chain over Gas Rating G. Each round rolls d dice, and each 1 lowers G by 1. "Lasts" is the round whose Gas Roll brings G to 0 or below. The median is the smallest round n where P(empty by n) is at least 50%. Light Trigger uses 2 dice in round 1 and 3 afterwards.

**Dice pool** (every Monte Carlo case):

- Base dice are the attribute. Gear Dice are the item's current rating. Stress Dice are the soldier's Stress.
- No Push if any Stress Die shows 1.
- A Push adds 1 Stress, re-rolls base and Stress Dice not showing 6, and adds one new Stress Die. Gear Dice are never re-rolled.
- Wear is the number of Gear Dice showing 1 on a Pushed roll. The gear Jams at 0.
- Stress Responses, Help, and Covering are not applied.

**Rookie gas** (200,000 canisters): Agility 3, ODM Gear 1 (wear not modelled), fixed Stress 1, one ODM Gear roll a round needing 1 or 2 successes, Pushing when short and allowed. The Gas Roll is 3 dice on a round with a Push.

**Jam** (100,000 runs per case): Agility 3, Stress starting at 1 and rising by 1 on each Push, Pushing when short of the Severity, over 3 rounds with gas ignored. One Titan gives one dodge a round. Two Titans give two dodges a round, with Stress carried between them.

**Field Repair window** (200,000 runs per case): each soldier who is not Down makes one roll, in turn, on a Jammed rating 1 harness until every Jam is repaired or every soldier has rolled. No tool kit and no Help. Player characters have Wits 3 and Stress 1 and Push when short. Squadmates have Wits 3 and Stress 0 and never Push. The three-soldier case gives its player character Wits 2.

**Single Pushed Field Repair roll (exact).** Wits 3 and Stress 1 give 4 dice, which show no 6 with probability (5/6)^4 = 48.2%. A roll with no success has its Stress Die showing 1 one time in 5, which forbids the Push. Otherwise 5 dice are rolled again and show no 6 with probability (5/6)^5 = 40.2%. Failure is 0.482 × (0.2 + 0.8 × 0.402) = 25.2%.

**The Gas Roll on a moving canister (exact).** P(at least g dice show 1) on d dice, for Gas Rating g of 1 or 2 and d of 2 or 3.
