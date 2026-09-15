# Chapter 4, Gear: review round 1

Reviewed:

- `docs/rules/04-gear.md`.
- Every file in `data/gear/` (11 files).
- OQ-59 to OQ-69 in `docs/rules/OPEN-QUESTIONS.md`.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended.
- Chapter 1 (`docs/rules/01-core-rules.md`, `data/core/`).
- Chapter 2 (`docs/rules/02-character-creation.md`, `data/character/`, especially `action-catalog.yaml`, `talents.yaml`, `squadmates.yaml`, `attributes.yaml`).
- Chapter 3 (`docs/rules/03-harm-and-mind.md`, `data/harm/`, `data/mind/`).
- `docs/rules/DECISIONS-2026-09-14.md`, including the owner's Health boxes rule and *Constraints on the undrafted Phase 1 chapters*, and OQ-70 and OQ-71.

I did not read the parallel Codex review.

Odds come from Python scripts in the scratchpad, which are not committed:

- Gas lifetimes are exact, from a Markov chain over Gas Rating.
- Fall damage and Field Repair odds are exact.
- The Jam model uses 50k runs per case, and 100k for the three-round figures. Rookie gas with Pushes and the Blade Set figures use 200k.

The appendix gives the models.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

This is a strong first draft. Every item has a data row, a wear rule, an at-zero state, and a restore list. Every chapter hook Chapters 1 to 3 left open is answered, and every figure the drafter quotes reproduces.

**No Critical findings.**

- No rule rests on GM discretion. The chapter's *No rulings* paragraph holds throughout: players choose by Chapter 2's roll-off, and every band, count, and unit comes from a row.
- Both glossary departures (Standard Issue gains the horse and kits; Squad Supply gains ammo) are logged, under OQ-59 and OQ-67.
- No `_Avoid_` term is used (see *Checks that passed*).
- No Phase 2 procedure is drafted.
- ADR-0014's gas target is reachable: 9.25 rounds with two dice and 6.33 with three, exactly.

**Six Majors.** The most important:

1. **The fall procedure clears airborne only after it applies damage.** So a Jam fall that puts a soldier Down triggers the Down-while-airborne fall as well. That second fall at 0 Health gives a Critical Injury: 66.7% of the time for a Health 2 soldier falling from On Body, 33.3% for Health 3.
2. **No soldier can mount outside a Titan Engagement.** The mount requirement tests Positions, which do not exist there, and no rule returns a dismounted horse when the fight ends.
3. **Rating 1 ODM Gear Jams too often for the soldier holding Attention,** already above OQ-59's own "about a third" threshold. With Stress rising on each Push, it Jams within 3 rounds 27.8% of the time at Severity 2 and 31.5% at Severity 3, and every airborne Jam is a high fall. Squadmates never Push, so every Jam lands on a player character.

The other three Majors: no Phase 1 rule resupplies gear after character creation; a soldier who is out of gas or Jammed can still strike from Blind Spot every round; and Strong Back does nothing for a Strength 4 carrier at Funding 3, which means every Brawler.

Nine Minors follow.

## Checks that passed

- **ADR-0014 gas target (exact Markov chain; drafter's figures in brackets):**

  | Full Gas Rating | Dice | Mean | Median | 10th to 90th | Empty by round 4 | Empty by round 6 |
  |---|---|---|---|---|---|---|
  | 3 | 2 | 9.25 (9.25) | 8 (8) | 4 to 16 | 13.5% (13.5) | 32.3% (32.2) |
  | 3 | 3 | 6.33 (6.33) | 6 (6) | 3 to 11 | 32.3% (32.4) | 59.7% (59.8) |
  | 3 | 2 in round 1, then 3 (Light Trigger once) | 6.67 (6.66) | 6 | 3 to 11 | 27.3% (27.4) | 55.6% (55.7) |
  | 2 | 2 / 3 | 6.25 / 4.33 (6.24 / 4.33) | 5 / 4 | | | |
  | 4 | 2 / 3 | 12.25 / 8.33 (12.26 / 8.33) | 11 / 8 | | | |

  Only 3 meets both halves of the target, as the chapter says. The Rookie who Pushes only when short (Agility 3, ODM Gear 1, Stress 1) gets 8.05 rounds when the roll needs 1 success, Pushing on 32.1% of rounds, and 7.09 when it needs 2, Pushing on 65.8% (drafter: 8.05 at 32%, 7.10 at 66%).
- **The Jam table reproduces** within 0.6 points. At rating 1, Jammed within 5 rounds is 52.5% when Pushing whenever allowed (drafter 52.7%; exact 1 − (1 − 5/36)^5 = 52.65%) and 46.9% when Pushing only when short (46.9%). Jammed no later than the canister empties is 59.3% and 55.8% (59.6, 55.9). Rating 2 gives 28.4 / 22.0%, and rating 3 gives 15.6 / 10.2%. Medians are 5, 6, 9, 10, 11, and 14 rounds, all as quoted.
- **Wear per Pushed roll** over the item's life, Pushing whenever allowed: 0.17, 0.23, and 0.28 points at ratings 1, 2, and 3, as quoted.
- **Blade Set figures reproduce.** Strength 4, Talent 1, Blade Set 1, Stress 1, Pushing when short: 22.3% Pushed and 4.6% ruined when the strike needs 1 success, 54.8% and 10.1% when it needs 2, 74.8% and 13.0% when it needs 3. That is 22.0, 9.9, and 7.7 strikes per set.
- **Falls.** `damage_table` covers every total, with open ends and no gaps. Low does 1.0 damage on average, high 2.0, and extreme 3.0. The Down-odds table in section 4.6 is exactly right for current Health 1 to 6. The 10.2% figure is 2/3 × 15.3%.
- **Counted items.** Each Funding row issues exactly as many counted items as its Funding number, 1 to 6, as OQ-59 says. The section 4.7 design note's carrying thresholds are correct.
- **The Chapter 4 constraints in the decisions file** are all met or logged:
  - `item-give`, `pass-item`, and mounting: rows written, and pending under OQ-69.
  - Mounted, horse Gear Dice, lame, and horse wear on a Pushed dodge: met, and consistent with Chapter 1 section 1.5, Chapter 2's `dodge` row, OQ-12, OQ-25, and ADR-0015 as amended.
  - A carried soldier is not airborne: met.
  - Gear Dice tuned at Stress 1, and gas tuned with Pushes on dodges, Fly, and Break Attention: met.
  - One-line Squad sheet row: met, with every mark OQ-29 asked for.
  - Medical supply use as a `bonus-dice-sources.yaml` row: met.
  - Falls sized against current Health: met. The chapter says 1 to 6, not the decisions file's "1 to 5". The chapter is right: Strength 6 with Agility 5 gives Health 6. This is already logged as OQ-71 item 7, and the fix belongs to the decisions file and Chapter 3.
- **ADR-0003 checklist.** Item 7: Field Repair states its Help requirement in and out of a Titan Engagement. Item 8: *No rulings*. Item 9: every new act is a Catalog option or action. Item 12: section 4.13 lists acts and tracked values. Item 13: no Chapter 4 state forbids a Push, Help, Cover, or Reaction, so none needs a `forbids` row.
- **`_Avoid_` terms.** The only hits are "one pair of ODM blades", which is the glossary's own Blade Set definition, and "Wooded terrain" in the example (Minor 11).
- **Phase 2.** Requisition, Scarcity, Maintain Gear, the Funding rules, the Expedition rules, and the Chase rules are only forward-referenced. The Funding 1 to 6 tables are the glossary's "scaled by Funding", not a Funding procedure.
- **Worked example arithmetic.** Jonas's pool, Push, wear, fall band and damage, Gas Roll, loads, and Squad sheet rows all match the YAML. The turn spending does not (Minor 7).

## Findings

### 1. Major. The fall procedure applies damage before it clears airborne, so a fall that Downs a soldier triggers a second fall

**Location:**

- Section 4.6, *Fall damage*, steps 3 and 4.
- `data/gear/falls.yaml`: `procedure` (damage, then "no longer airborne, mounted, or carried"), `triggers[down-airborne]`, `triggers[carried]`.
- `data/gear/carrying.yaml`: `carrying_a_comrade.ends` ("The carrier becomes Down ... If the carrier was airborne or mounted, both fall").

**Problem:** The procedure applies damage at step 3, but the soldier stops being airborne only at step 4. If step 3's damage brings current Health to 0, the soldier becomes Down while still airborne. `down-airborne` fires "once the harm that made them Down ... has been resolved", which is before step 4 is reached. So the soldier falls a second time.

- The second fall is taken at 0 current Health. Any damage then gives a Critical Injury (Chapter 3, section 3.1, step 3). A high fall always does damage, and a low one does 2 times in 3.
- The first fall's damage already gave a Critical Injury when it reached 0. So one Jam gives two Critical Injuries at rolled Injury Locations, and a repeat location brings worsening.
- A carrier suffers the same thing, and carries their comrade with them. The carrier's Jam fall drops the comrade (`carried`). Then the carrier becoming Down triggers "both fall" a second time.

The chance that a single airborne fall turns into a double fall and a second Critical Injury equals the chance the fall alone Downs the soldier:

| Current Health | High | Extreme |
|---|---|---|
| 1 | 100% | 100% |
| 2 | 66.7% | 100% |
| 3 | 33.3% | 66.7% |
| 4 | 0% | 33.3% |

**Scenario:**

1. Private Anke Roth (Strength 2, Agility 2, Health 2) is airborne at On Body. She Pushes a dodge, and her rating 1 ODM Gear's Gear Die shows 1, so it Jams.
2. She falls from On Body, which is high. The D6 shows 3, plus 2 makes 5: 2 damage. Her current Health drops to 0, she is Down, and she gains a Critical Injury at a rolled Injury Location.
3. Step 4 has not yet run, so she is still airborne. `down-airborne` fires, and she falls again from On Body.
4. The second D6 shows 1, plus 2 makes 3: 1 damage at 0 Health, which gives a second Critical Injury.
5. Jonas in the worked example would have had the same result on a D6 of 5 or 6 (3 damage against Health 3).

**Fix options:**

1. Reorder `procedure`: find the band, then the soldier is no longer airborne, mounted, or carried, then roll and apply the damage.
2. Add to `down-airborne`, `down-mounted`, and the carrier's Down row: "unless the harm that made them Down is a fall's own damage".
3. Do both, and add "a fall never causes another fall" to `not_a_fall`. OQ-62 would record it.

### 2. Major. No soldier can mount outside a Titan Engagement, and no rule says where a dismounted horse is when the fight ends

**Location:**

- Section 4.5, *Mounted and dismounted*: the Mount requirements, and the *Outside a Titan Engagement* bullet.
- `data/gear/horses.yaml`: `mounted.mount.requirements[0]` ("The soldier's own horse holds the Position the soldier holds"), `mounted.outside_titan_engagement` ("subject to the mount requirements above"), `horse_position`.
- `data/gear/sheet-fields.yaml`: `fields` (no horse Position), `squad_sheet_row` (no horse Position mark).
- Chapter 1, section 1.8: "Outside a Titan Engagement there are no Positions".

**Problem:**

- **Outside a Titan Engagement,** Chapter 4 allows mounting "at any time, subject to the mount requirements". The first requirement is that the horse holds the soldier's Position. Outside a Titan Engagement no one holds a Position, so the requirement can never be met, and a closed rule gives no other route.
- **When a Titan Engagement ends,** `horse_position` tracks a dismounted horse only "in a Titan Engagement". No row says whether that horse rejoins its soldier, stays where it was, or is lost.
- **During the fight,** a dismounted horse's Position is tested by the mount requirement and by the Break Attention clause (`gear_dice.break-attention`). The sheet and the Squad row have no field for it. With six soldiers, six horses can each be at a different Position with nothing on paper.

Every fight that starts from horseback and has soldiers dismount to fly ends here, which is most Survey Corps fights.

**Scenario:**

1. The Squad rides into a Wooded Titan Engagement. In round 1 all six soldiers dismount to make ODM moves, leaving their horses at Distant.
2. The Focus Titan dies in round 4. Every airborne soldier lands.
3. The Mission goes on, and the Chase rules, once written, call for the riders. Before then, the players want to mount under section 4.5's "at any time".
4. The rule says a soldier mounts only if their horse holds their Position. No soldier holds a Position, and no rule says where the six horses are. Nobody can mount.

**Fix options:**

1. Add `horses.yaml` `engagement_ends`: "When a Titan Engagement ends, every horse whose soldier is alive rejoins that soldier, lame or not." Replace the first mount requirement outside a Titan Engagement with "the soldier has a horse that is not lame".
2. Add `horse.position` to `sheet-fields.yaml` (recorded only in a Titan Engagement, and empty while the soldier is mounted), and a mark to the Squad row such as `Hr 1/1 @Distant`.
3. Do both, and log them under OQ-61.

### 3. Major. Rating 1 ODM Gear Jams too often for the soldier holding Attention, above OQ-59's own threshold, and every airborne Jam is a high fall

**Location:**

- Section 4.9, the *ADR-0014 reference builds* design note.
- `data/gear/standard-issue.yaml` `by_funding` (`odm_gear_rating: 1` at Funding 1 to 5).
- OQ-59, *Simulator case* ("If it Jams in more than about a third of fights, the first lever is (b)").
- Section 4.2, *Jam*, and section 4.6's `jam-airborne` trigger.

**Problem:**

- **The drafter's table already exceeds the threshold.** A Pushed roll on rating 1 gear Jams it whenever its single Gear Die shows 1. The table has the soldier Jammed within 5 rounds 52.5% of the time when Pushing whenever allowed. OQ-59 sets its lever at "about a third of fights".
- **The fixed-Stress model overstates Pushing,** so I re-ran it with Stress rising by 1 on each uncovered Push and the soldier Pushing only when short of the Severity. The rate is still at or near the threshold within a short fight:

  | ODM Gear | Severity | Jammed within 3 rounds | Jammed within 5 rounds | Jammed no later than the canister empties |
  |---|---|---|---|---|
  | 1 | 2 | 27.8% | 38.0% | 45.3% |
  | 1 | 3 | 31.5% | 42.8% | 49.1% |
  | 2 | 2 | 8.3% | 15.0% | 21.7% |
  | 2 | 3 | 10.6% | 18.8% | 25.8% |

  ADR-0014's prepared Squad kills in about 3 rounds.
- **Every Jam while airborne is a high fall** (On Body or Blind Spot). A Health 3 soldier is Down from full 33.3% of the time, and finding 1 can add a second Critical Injury.
- **Only player characters Jam.** A Squadmate never Pushes, so its ODM Gear never wears (Chapter 2, section 2.10). The whole Jam-and-fall cost falls on player characters, which pushes against ADR-0014's "a PC dies every 3 to 4 missions".
- **Canon.** Soldiers die to Titans, to empty canisters, and to lost blades far more often than to a failed harness. At 1 Pushed dodge in 6, a failed harness becomes routine.
- **The gas target.** At rating 1, Pushing every round Jams the gear no later than the canister empties 59.3% of the time. So the "about 6 rounds when pushing" half of the target is rarely what the table sees.

**Scenario:**

1. A Hunter-template player character (Strength 3, Agility 3, Health 3, ODM Gear 1, Stress 1) holds a Medium Titan's Attention at On Body in round 1.
2. Rounds 1 to 3: they dodge Severity 3 behaviors, Pushing when short. Stress reaches 3.
3. In round 2, the Gear Die of their Pushed dodge shows 1. The gear Jams, and they fall high: D6 6 + 2 = 8, 3 damage. Down, with a Critical Injury.
4. This happens to about 1 soldier in 3 who holds Attention for three rounds. A Squadmate in the same place would never Jam.

**Fix options:**

1. Take OQ-59 (b): ODM Gear rated 2 at Funding 3 and 4, with ADR-0014's Rookie amended to Gear Dice 2 for ODM Gear. Then 8.3% to 10.6% Jam within 3 rounds.
2. Keep rating 1 but add a strained step. The first point of wear on ODM Gear in a Titan Engagement marks it strained, and the next point lowers its current rating. That is still wear under ADR-0004, and it roughly halves early Jams without moving the reference build's dice.
3. Keep the rule, but record the rising-Stress figures above as the simulator case. Also bind Chapter 5 to a Severity or Tempo at which the Attention holder Jams in no more than a third of 3-round fights.

### 4. Major. No Phase 1 rule issues Standard Issue after character creation, so gas, Blade Sets, horses, and Squad Supply never come back

**Location:**

- Section 4.9, *When it is received*.
- `data/gear/standard-issue.yaml`: `when_received` (Lifepath finish, a starting or joining character, and "whenever a rule issues Standard Issue, as the Expedition rules (not yet written) will").
- `data/gear/squad-supply.yaml` `stock.when_set`.
- `data/gear/items.yaml` `restored_by` for `horse` and `gas-canister`.

**Problem:** Until the Expedition rules exist, a soldier receives Standard Issue exactly once. After that:

- A spent canister is never refilled, and a ruined Blade Set is never replaced, except from a dead soldier's share-out.
- A lame horse stays lame. Only Standard Issue restores a horse.
- Squad Supply rises only "whenever every soldier in the Squad receives Standard Issue together", which no Phase 1 rule causes. At Funding 3 that means 2 flares and 2 medical units for the whole campaign.

Only Field Repair restores anything, and only ODM Gear and tool kits.

Phase 1 is Chapters 1 to 6, so any playtest of more than one Titan Engagement runs on the first issue. The chapter already uses an interim value for an unwritten rule ("Until they are, Funding is 3"), but gives no interim trigger for resupply.

**Scenario:**

1. Session 1: the Squad fights one Medium Titan. Two canisters empty, three Blade Sets are ruined, one horse goes lame, and both medical units are spent in the care window.
2. Session 2: the GM runs a second Titan Engagement. No rule issues Standard Issue, so the Squad starts it with what is left.
3. Session 3: soldiers start with one Blade Set and no spare canister. The lame horse's rider cannot mount for the rest of the campaign, and no medical unit ever returns.

**Fix options:**

1. Add an interim row matching the Funding one: "Until the Expedition rules are written, every soldier in the Squad receives Standard Issue together at the start of each session."
2. Tie the interim issue to the Mission Brief instead: "each time the GM opens a new Mission Brief, until the Expedition rules replace this row."
3. State in section 4.9 that Phase 1 play resupplies only as the rows say. Record the gap in OQ-59, so that no simulator run of several fights assumes resupply.

### 5. Major. Running dry and Jams never stop a strike, so a soldier with no gas or a failed harness keeps cutting from Blind Spot, and gas matters only for moves and dodges

**Location:**

- Section 4.2, *Using ODM Gear* ("Neither is a roll made with a Blade Set ..., including every Nape strike").
- Section 4.3, *Running dry* ("Running dry does not make them fall").
- Section 4.6, *After the fall* ("Until a Chapter 5 rule moves them, the soldier keeps the Position they held").
- `data/character/action-catalog.yaml` `nape-strike.requirements` (Blind Spot and not holding Attention; no ODM Gear).
- OQ-60 (b).

**Problem:** A Nape strike needs Blind Spot, no Attention, and a Blade Set in the handles. Nothing requires ODM Gear that counts as had, and a strike is not ODM use. So:

- A soldier who runs dry at Blind Spot stays airborne there. They can make a Nape strike every round for the rest of the fight and never roll gas again.
- A soldier whose gear Jams at Blind Spot keeps Blind Spot until a Chapter 5 rule moves them. They too can strike next turn with Jammed gear.
- A soldier who reaches Blind Spot once and stays there spends no gas at all. Gas then limits only ODM moves and dodges, and the "rounds of ODM use" in ADR-0014's target stop matching rounds of fighting.

OQ-60 logged (b) only as a gas question, "any strike ... is also ODM use". It did not address strikes made with no working gear. In canon, the gas crisis at Trost is that soldiers with empty canisters cannot reach or cut a standing Titan: Mikasa runs dry mid-flight and is helpless on the ground.

**Scenario:**

1. Round 2: Private Mila Brandt reaches Blind Spot with an ODM move. At the end of the round her Gas Roll shows two 1s, leaving Gas Rating 1.
2. Round 3: she makes a Nape strike, not ODM use, which falls short. Holding Blind Spot costs nothing.
3. Rounds 4 to 8: she makes a Nape strike every round she does not hold Attention. Her Gas Rating stays at 1 all fight.
4. Had she Jammed in round 2, she would still hold Blind Spot and could strike in round 3 with no working harness.

**Fix options:**

1. Add a gear condition to `nape-strike`, and to `body-part-strike` made from On Body or Blind Spot: ODM Gear that counts as had, unless a Chapter 5 rule lifts it, such as a Titan grounded by a Broken leg. Put the requirement in the Catalog under OQ-69.
2. Make a strike made from On Body or Blind Spot ODM use, adding a two-die Gas Roll but never the third die, so OQ-12 and the decisions' Push basis stand. Re-report the gas figures per round of fighting beside the ADR-0014 figure.
3. Leave both to Chapter 5, but record them as named Chapter 5 constraints in OQ-60, so the strike rules cannot be drafted without them.

### 6. Major. A carried comrade counts as 5 items, so Strong Back does nothing for a Strength 4 carrier at Funding 3, which means every Brawler and the ADR-0014 Rookie

**Location:**

- Section 4.7, `items_counted` (a comrade counts as 5) and its design note.
- OQ-64 ("which is the choice that Talent exists for").
- `data/character/talents.yaml` `strong-back` (Brawler).
- `data/character/specialties.yaml` (Brawler key attribute Strength).
- `data/character/squadmates.yaml` (Brawler and Slayer templates at Strength 4).

**Problem:** At Funding 3, Standard Issue is 3 counted items, and a comrade adds 5, for 8 in all. Overloaded needs more items than the limit:

| Carrier Strength | Limit | Standard Issue + comrade (8) | With a Specialty kit (9) |
|---|---|---|---|
| 2 | 6 | Overloaded | Overloaded |
| 3 | 7 | Overloaded | Overloaded |
| 4 | 8 | not Overloaded | Overloaded |
| 5 | 9 | not Overloaded | not Overloaded |
| 6 | 10 | not Overloaded | not Overloaded |

- A Brawler's key attribute is at least 4, and Brawlers receive no kit. So Strong Back, one of the four Brawler Talents, never changes anything for a Brawler at Funding 1 to 3 unless they pick up extra items.
- The ADR-0014 reference Rookie (Strength 4) also carries a comrade with no penalty, so the simulator will never see an Overloaded rescuer.
- The soldiers who are slowed are the Strength 3 Hunters, Medics, and Engineers. Those are the ones who least often hold Strong Back.

**Scenario:**

1. A Brawler player character (Strength 4, Grip Breaker, Strong Back) and a Squadmate on the Hunter template (Strength 3) each lift a Down comrade at On Body.
2. The Brawler's load is 8 of 8, so Strong Back has no effect, and their next ODM move is free.
3. The Hunter's load is 8 of 7, so they are Overloaded and their ODM move costs their action.
4. The Talent chosen for carrying comrades makes no difference to the soldier it was written for.

**Fix options:**

1. A carried comrade counts as 5 plus the items that comrade carries. Tomas with Standard Issue makes 8, so any carrier with Standard Issue is Overloaded (11 against a limit of at most 10), and Strong Back always matters. This also fits carrying a soldier in full kit.
2. A carried comrade counts as 6. Then Strength 4 is Overloaded at Funding 3 (9 against 8), and Strength 5 only with a kit.
3. Keep 5, and change Strong Back in Chapter 2 to something a Strength 4 carrier gains, such as a lift that spends the move instead of the action.

### 7. Minor. The worked example lets Jonas act in round 2 after a Reaction spent that turn

**Location:** *Example: a Jam at On Body*, rounds 1 and 2. Chapter 1, section 1.9, *Which turn it spends*.

**Problem:**

- In round 1, Jonas spends his move (dismount and ODM move) before the Titan card resolves against him. His dodge therefore spends his next turn in full, and his round 2 turn begins with its move and action spent. In round 2 he "takes Change Canister as his action", which he cannot do.
- If the card had resolved before his turn instead, the dodge would have spent round 1's turn, and he would never have reached On Body.
- Separately, one move takes him from horseback, presumably at Distant, to On Body. Chapter 1's baseline move is one Position step. The example's disclaimer covers moves, but it also hides the turn error.

Chapter 3's round 1 review raised the same kind of error as a Minor.

**Fix options:**

1. In round 2, say his turn is spent by the round 1 dodge. Move Change Canister to round 3 and the lift to round 4.
2. Start the example with Jonas already airborne at In Reach. His round 1 move is then one step to On Body, and the card resolves after his turn. Keep option 1's timing.

### 8. Minor. Carrying has no end row for a carrier who dies

**Location:** Section 4.7, *Carrying ends*. `data/gear/carrying.yaml` `carrying_a_comrade.ends` and `leaving_play.carried_comrade`.

**Problem:** The list covers a carrier who is Down, Grabbed, or falls, and a carried comrade who dies. A carrier can also die without first being Down, from an instant-death Critical Injury row (Chapter 3, section 3.2).

A dead soldier holds no Position, so "the comrade holds the carrier's Position" has nothing to read. Nothing sets the comrade down, and nothing says whether they fall if the carrier was airborne or mounted.

**Scenario:** Jonas is airborne, carrying the Down Tomas. A Titan attack gives Jonas a head Critical Injury on an instant-death row. Tomas is still carried by a dead soldier, holds no defined Position, and cannot be lifted, because he is "already carried".

**Fix options:**

1. Add an `ends` row: "The carrier dies. The comrade is set down at the Position the carrier held, and falls if the carrier was airborne or mounted."
2. Put the same line in `leaving_play` beside `carried_comrade`.

### 9. Minor. Prose, YAML, and cross-file mismatches

**Locations and problems:**

- **Receiver state.** `catalog-additions.yaml` `pass-item.requirements` says "the receiver may be Down". `carrying.yaml` and section 4.7 say "Down or Grabbed". The Catalog row is the one section 2.9's match step reads.
- **Tool kit self-repair.** Section 4.8 says "a tool kit cannot repair itself". `field-repair.yaml` says only that the kit supplying the roll's Gear Dice cannot be the target, and `items.yaml` lets a kit be repaired "with none". A kit at current rating 0 counts as not had, so its owner can repair it with Wits alone. The prose forbids that.
- **Blade Set wording.** The section 4.4 note says rating 1 "is ruined on 1 Pushed strike in 6". Pushing only when short, it is about 1 in 5 (4.6% ruined of 22.3% Pushed), because a Push is declared only when the Gear Die is not a 6.
- **Horse falls.** Section 4.6 *Height* step 3 does not say whether it applies to step 1. As written, a fall from a horse in Giant Forest or beside a Large Titan becomes high.
- **Cloak decoy.** Section 4.1 uses "a rope or a cloak" as its example of an object with no mechanical effect. The glossary's Break Attention names "a thrown cloak" as a decoy. Chapter 5 can name it, but the example invites the wrong ruling.
- **Moves outside a Titan Engagement.** `mount-or-dismount` is `option_of: a move` with `context: any`. Outside a Titan Engagement there are no moves, yet `horses.yaml` allows mounting there.

**Fix options:**

1. Add "or Grabbed" to the `pass-item` row, and "(one at 0 can be repaired with Wits alone)" to section 4.8.
2. Change "1 Pushed strike in 6" to "1 Push in 6 when Pushing whenever allowed, and about 1 in 5 when Pushing only when short".
3. Make height step 3 read "Otherwise, raise ...", choose another example object than a cloak, and give `mount-or-dismount` `option_of: a move, or the procedure under way outside a Titan Engagement`.

### 10. Minor. OQ-69's list of earlier-chapter changes is incomplete, now that Chapters 1 to 3 can be edited

**Location:** OQ-69, *Changes*. Chapter 2, section 2.6. `data/character/action-catalog.yaml` rows `lift-comrade`, `change-canister`, `field-repair`, and `gas-roll`. Section 4.13 and the `catalog-additions.yaml` header.

**Problem:**

- **Specialty items.** Chapter 2, section 2.6 says a Specialty "adds nothing to Standard Issue". Chapter 4's `by_specialty` gives Medics and Engineers a kit. The next sentence ("Chapter 4 may give a Specialty an item") softens this but does not remove the contradiction. OQ-69 does not change it.
- **Lift Comrade requirements.** The Catalog's `lift-comrade.requirements` still says only "A Down comrade holds the soldier's Position". Chapter 4 adds three conditions in `carrying.yaml`: the comrade is not Grabbed, not already carried, and the lifter carries no one. Section 2.9's match step checks "an entry's requirements". A player who names `comrade-carry` can argue for lifting a Grabbed comrade from the Titan's hand, the case OQ-64 says the extra conditions exist to stop. ADR-0012 wants one source.
- **Stale pointers.** The Catalog's `field-repair` still reads `needs: set by Chapter 4` and `requirements: Set by Chapter 4`. `change-canister` and `gas-roll` point to "Chapter 4" rather than its files. OQ-69 lists no pointer changes for them.
- **Stale status.** Section 4.13 and the `catalog-additions.yaml` header still say Chapters 1 to 3 are under conformance review. They are Done, and OQ-69 can now be applied.

**Fix options:**

1. Add to OQ-69: section 2.6's sentence becomes "A Specialty adds nothing to Standard Issue except the kits Chapter 4 lists (`by_specialty`)".
2. Add to OQ-69: `lift-comrade.requirements` points to `data/gear/carrying.yaml` (`lifting_a_comrade`) for both contexts; `field-repair` gets `needs: 1` and points to `data/gear/field-repair.yaml`; `change-canister` and `gas-roll` point to `data/gear/odm-gear.yaml`.
3. Apply OQ-69 in the fix round, delete `catalog-additions.yaml`, and drop the "under conformance review" sentences.

### 11. Minor. Stale or loose wording

**Locations and problems:**

- **Chapter intro.** "Chapter 1 (... the three-die Gas Roll ...)". Chapter 1's Gas Roll is two dice, and three only after a Pushed ODM Gear roll.
- **OQ-59's glossary text.** It keeps "The gear every soldier receives before an Expedition". Section 4.9 also issues Standard Issue at the Lifepath finish and to any Squadmate who joins, so the definition would still be too narrow.
- **"Wooded terrain".** The example uses it twice. The glossary reserves Anchor Rating and avoids "terrain type". ADR-0014 uses the same phrase, so this is borderline, but "a Wooded Anchor Rating" costs nothing.

**Fix options:**

1. Change the intro to "the Gas Roll and its third die after a Pushed ODM Gear roll".
2. Change OQ-59's glossary text to "The gear every soldier receives when they join the Squad and before each Expedition, scaled by Funding: ..."
3. Change the example to "Anchor Rating Wooded".

### 12. Minor. Fly makes a soldier airborne even on a failed roll, and even while mounted

**Location:** Section 4.2, *Airborne* ("makes a roll for Fly with their own ODM Gear that a rule calls for"). `data/gear/odm-gear.yaml` `airborne.becomes_airborne`. `data/gear/horses.yaml` `gear_dice.choice` and `mounted.meaning` ("A mounted soldier is never airborne").

**Problem:**

- The trigger is making the roll, not succeeding at it. A soldier who fails a Fly roll that a rule calls for, for example to reach a Position, is airborne anyway.
- If a Chapter 5 or Chase rule calls for Fly from a mounted soldier, the soldier becomes airborne while mounted. That breaks the sheet invariant. `horses.yaml` makes an ODM Gear roll from the saddle "not make the soldier airborne" only for the dodge and Break Attention.

**Fix options:**

1. Change the trigger to "the rule that calls for Fly makes the soldier airborne", so the calling rule decides on success or failure.
2. Add to `horses.yaml`: "A mounted soldier's Fly roll dismounts them first", or "a rule never calls for Fly from a mounted soldier".

### 13. Minor. Ruin on any wear makes a higher-rated Blade Set the most fragile item in the game, and the design note gives rating 1 only

**Location:** Section 4.4, *Ruin* and its design note. `data/gear/blade-sets.yaml` `wear`. OQ-63.

**Problem:** A Pushed roll ruins a rating 1 set 16.7% of the time, rating 2 30.6%, and rating 3 42.1%, when Pushing whenever allowed. Every other item "has more to lose" at a higher rating, but a Blade Set does not. With Pushing only when short:

| Build | Nape strike needs | Ruined per strike | Strikes per set |
|---|---|---|---|
| Rookie: Strength 4, Talent 1, Blade Set 1, Stress 1 | 3 | 13.0% | 7.7 |
| Veteran: Strength 5, Talent 2, Blade Set 2, Stress 2 | 4 | 19.6% | 5.1 |
| Levi-grade: Strength 6, Talent 3, Blade Set 3, Stress 2 | 4 | 24.1% | 4.1 |

Canon's Levi does go through blades quickly, so this may be intended. Requisition, still unwritten, will price rating 2 and 3 sets without these figures, and ADR-0014's Levi-grade target, "pushing hard", spends a set about every second Push.

**Fix options:**

1. Keep the rule, and add the rating 2 and 3 rows to the design note and to OQ-63 for Requisition.
2. Give Blade Sets ordinary wear, with ruin at current rating 0. That is identical at rating 1, and a rating 3 set survives two worn Pushes. Record it as an OQ-63 option, since it departs from the brief's "a Pushed blade die 1 ruins the set".

### 14. Minor. Care-window order does not place restocking, and Squad Supply has no sheet field

**Location:** Section 4.10, *Medical supplies* (`restock-kit`). `data/gear/field-repair.yaml` `outside_titan_engagement.order`. `data/harm/treat-injury.yaml` `care_windows.order`. `data/gear/sheet-fields.yaml`.

**Problem:**

- Both windows order "rolls". Restocking a kit is not a roll, so nothing says whether a Medic can restock their spent kit before their own Treat Injury roll in the same window. That timing decides whether the kit adds a Gear Die.
- `sheet-fields.yaml` lists the soldier's gear and the Squadmate row, but no Squad sheet field for the four Squad Supply counts.

**Fix options:**

1. Add to `restock-kit`: "at any point in the window, including before or between rolls".
2. Add a `squad_sheet` block to `sheet-fields.yaml` with `rations`, `flares`, `medical`, and `ammo`.

### 15. Minor. Daily care windows in Downtime give every soldier a Field Repair roll every day, which leaves the Maintain Gear Downtime Action nothing to do for ODM Gear

**Location:** Section 4.8, *Outside a Titan Engagement* ("when a day passes"). OQ-66, *Why*. OQ-59 (d)'s reason. `data/harm/treat-injury.yaml` `care_windows[day].scope` (every soldier in Downtime).

**Problem:** OQ-66 limits Field Repair to care windows so that wear persists, and OQ-59 rejects (d) because it "would leave the Maintain Gear Downtime Action nothing to do". But a care window is held every time a day passes, including each day of Downtime, with the whole Squad in scope.

- A Wits 2 soldier repairs 30.6% of the time with no Push, a Wits 4 soldier 51.8%, and an Engineer with Gearwright 1 and a kit 66.5%.
- Over a Downtime of a week, six soldiers get 42 rolls. Every rating 1 to 3 harness is restored long before Maintain Gear is chosen.
- On an Expedition, every night camp does the same.

The limit holds between back-to-back Titan Engagements, but nowhere else.

**Fix options:**

1. Limit Field Repair to the window held when a Titan Engagement ends, and to day windows during an Expedition, never in Downtime.
2. Keep it, and correct OQ-59 and OQ-66: Maintain Gear's job for ODM Gear is then something else, such as raising a rating or removing a strain, for the Downtime rules to state.

## Provisional decisions OQ-59 to OQ-69

| OQ | Judgment |
|---|---|
| OQ-59 | Partly sound. The rows add up (each Funding row issues its Funding in counted items), and rating 1 is ADR-0014's Rookie. The glossary change is logged. But the chapter's own figures already pass its simulator threshold for the soldier holding Attention (finding 3). Standard Issue has no Phase 1 trigger after creation (finding 4). The proposed glossary text still says "before an Expedition" (finding 11). |
| OQ-60 | Sound on timing. Only at the end of the round is the three-die rule known, and the cut-short round is handled. Keeping a part-used canister is what OQ-35's gas handover needs. Excluding strikes from ODM use is defensible for gas, but it leaves a dry or Jammed soldier striking from Blind Spot (finding 5). |
| OQ-61 | Sound as a state model. Closed set and clear lists, and true or false flags, suit Foundry and the Squad row. Mounting outside a Titan Engagement fails its own requirement, the end of the fight loses the horses, and a horse's Position is unrecorded (finding 2). Fly while mounted is open (finding 12). |
| OQ-62 | The trigger list and table are sound, and every odds figure is exact. The procedure order doubles a fall that Downs the soldier (finding 1). A horse fall's band step is ambiguous (finding 9). The double Critical Injury from a Down-while-airborne fall is correctly logged as a simulator case against the PC death target. |
| OQ-63 | Sound. The handles give "free once per turn" something to limit, and the figures reproduce. Ruin on any wear makes higher ratings more fragile, which Requisition needs to see (finding 13). |
| OQ-64 | The item list and the Funding arithmetic are sound. The extra Lift Comrade conditions are right, but they are missing from the Catalog row (finding 10). A comrade counting as 5 leaves Strong Back dead for every Strength 4 carrier (finding 6). A carrier's death is missing (finding 8). |
| OQ-65 | Sound. Passing the fitted canister is the canon handover OQ-35 was written for. The Catalog row omits a Grabbed receiver (finding 9). |
| OQ-66 | Sound for Titan Engagements, and reusing care windows adds no timing. The reason does not hold for day windows in Downtime or at night camps (finding 15), and the tool kit wording disagrees with the YAML (finding 9). |
| OQ-67 | Sound for flares and medical supplies. Both medical uses sit outside Titan Engagements and aftermath rolls, so OQ-57's figures stand. Ammo is a reserved kind that no Phase 1 rule reads, and flare rounds are already flares. That is harmless as the owner's brief, but OQ-67 should name the later rule expected to read it. Restock timing within a window is open (finding 14). |
| OQ-68 | Sound procedurally. Share-out at promotion's moment interrupts no procedure. The fidelity cost is real: at Trost, survivors take gas and blades from the dead mid-fight. `pass-item` already exists, so a light version of (c), letting a living soldier at the same Position take one passable item from a dead comrade as `pass-item`, needs no new tracked value. Worth recording as an option. |
| OQ-69 | Sound approach, and now applicable because Chapters 1 to 3 are Done. The list is incomplete: section 2.6's Standard Issue sentence, and the `lift-comrade`, `field-repair`, `change-canister`, and `gas-roll` Catalog pointers (finding 10). |

## Appendix: models

**Gas (exact).** A Markov chain over Gas Rating G. Each round rolls d dice, and each 1 lowers G by 1. "Lasts" is the round whose Gas Roll brings G to 0 or below. Light Trigger uses 2 dice in round 1 and 3 dice afterwards.

**Dice pool** (every Monte Carlo case):

- Base dice = attribute + Talent. Gear Dice = the item's current rating. Stress Dice = Stress.
- A Push is not allowed if any Stress Die shows 1.
- A Push re-rolls base and Stress Dice not showing 6 and adds one new Stress Die. Gear Dice are never re-rolled.
- Wear is the number of Gear Dice showing 1 on a Pushed roll, capped at the current rating.
- "Whenever allowed" Pushes every roll with no Stress Die 1. "Only when short" Pushes when successes are below the need.

**Rookie gas** (200k canisters): Agility 3, ODM Gear 1, fixed Stress 1, one ODM Gear roll a round, needing 1 or 2. The Gas Roll is 3 dice on a round with a Push. Jams are not modelled, matching the drafter.

**Jam model** (50k runs; 100k for the three-round table):

- Agility 3, one ODM Gear roll a round, and a full canister rolled alongside.
- Drafter's case: Stress fixed at 1, needing 2 when Pushing only when short.
- Rising case: Stress starts at 1 and rises by 1 per uncovered Push, with no Stress relief. The soldier Pushes when short of Severity 2 or 3. Stress Response results are not applied.
- "No later than the canister empties" compares the Jam round with the round the canister's Gas Roll empties it.

**Blade Sets** (200k strikes per case): Pushing only when short. Rookie 5 base, 1 Gear, 1 Stress. Veteran 7 base, 2 Gear, 2 Stress. Levi-grade 9 base, 3 Gear, 2 Stress. Ruined means a Pushed roll with at least one Gear Die showing 1. No Blade Discipline.

**Falls (exact).** A D6 plus the band's adds, read on `damage_table`. Down odds are P(damage ≥ current Health). Finding 1's double-fall odds equal the single-fall Down odds, since any second fall from high or extreme does at least 1 damage at 0 Health.

**Field Repair (exact).** 1 − (5/6)^n for n dice, needing 1 success, with no Push.
