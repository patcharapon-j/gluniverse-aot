# Chapter 4, Gear: review round 2

Reviewed:

- `docs/rules/04-gear.md`.
- Every file in `data/gear/` (11 files, including the emptied `catalog-additions.yaml`).
- OQ-59 to OQ-69 and OQ-72 in `docs/rules/OPEN-QUESTIONS.md`.
- The earlier-chapter files the fix round changed: `data/character/action-catalog.yaml`, `data/character/talents.yaml` (Strong Back), `data/core/bonus-dice-sources.yaml`, `data/character/squadmates.yaml`, `data/harm/treat-injury.yaml`, `data/harm/down.yaml`, `data/harm/death-rolls.yaml`, Chapter 2 sections 2.6, 2.8, 2.9, and Chapter 3 sections 3.4 and 3.5.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended.
- Chapters 1 to 3 and their data, including `data/character/graduation-exam.yaml` and `data/harm/engagement-end.yaml`.
- `docs/rules/DECISIONS-2026-09-14.md`, every decided entry and *Constraints on the undrafted Phase 1 chapters*.
- Both round 1 reviews: `04-gear-review-1.md` and `04-gear-review-1-codex.md`.

I did not read the parallel round 2 Codex review.

Odds come from Python scripts in the scratchpad, which are not committed:

- Gas lifetimes are exact, from a Markov chain over Gas Rating.
- Exam payout and fall odds are exact.
- The Jam models use 100,000 runs per case. Rookie gas with Pushes uses 200,000 canisters.

The appendix gives the models.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**No Critical findings.**

- No rule rests on GM discretion. The interim issue's session trigger is a real-world unit, but decided Chapter 2 text already counts sessions (a Drive's one use per session, a new character joining at the next session). Finding 2 treats it as a balance problem, not discretion.
- Every glossary departure is logged: Standard Issue under OQ-59, Squad Supply's ammo under OQ-67, and Overloaded's "cannot move with no action left" under OQ-64.
- No `_Avoid_` term is misused, and every cross-file pointer in the chapter and the touched files resolves.
- No Phase 2 procedure is drafted. The interim Funding value and the interim issue are stopgaps that name the rules replacing them.
- ADR-0014's gas target is reachable, and its figures reproduce exactly.

**Round 1.** Both Codex Criticals are resolved. Of the eight round 1 Majors, seven are resolved and one is logged (OQ-72). Two fixes created new Majors.

**Three Majors open:**

1. **The new strike requirement breaks the Graduation Exam's Titan dummy course.** The Exam issues training ODM Gear with no canister, so its Gas Rating is 0 and it counts as not had. The Exam's closed list of ignored requirements does not cover that, so no Cadet can make Trial 2's `nape-strike`. That takes 13% to 26% of a Merit off each Cadet and pushes decided OQ-22's parity target out of its band.
2. **At Funding 1 to 4 the interim issue fully restores every issued item each session.** Every item is rated 1, so any item below its rating is at 0 and is exchanged. That is the option (d) OQ-59 rejects, and it empties OQ-66's Field Repair limit of purpose. How much wear a Squad carries into a fight depends on where the session broke.
3. **Carried forward, logged as OQ-72:** rating 1 ODM Gear still Jams for the soldier holding Attention in 31.5% of 3-round fights at Severity 3. OQ-72's test models one Titan. With cards from two Titans it is 46.9%.

**Eight Minors follow.** The most consequential are a carrier who becomes Down while airborne, where two YAML rows disagree on whether the Down comrade falls (finding 4), and a Down comrade whose items nobody can remove (finding 5).

## Round 1 findings

| Round 1 finding | Status | Evidence |
|---|---|---|
| Codex Critical 1: the closed item rule forbade ADR-0010's thrown-cloak decoy | Resolved | Section 4.1 and `items.yaml` `other_objects` now say an unlisted object has an effect where another rule names it, citing the cloak decoy. A wording slip remains (finding 11). |
| Codex Critical 2: the introduction called the Gas Roll three dice | Resolved | Line 5 reads "the two-die Gas Roll and its third die after a Pushed ODM Gear roll". |
| Codex Major 3: a carried comrade was an unlimited container | Resolved | `items_counted` makes a carried comrade 5 items plus everything they carry, and Strong Back removes only the 5. Passing items to a carried comrade now loads the carrier. The fix leaves a Down comrade's own items stuck on them (finding 5). |
| Codex Major 4: the Field Repair prose and YAML disagreed about a worn-out tool kit | Resolved | Section 4.8 follows `field-repair.yaml`. Only the kit supplying the Gear Dice cannot be the target, and a kit at 0 can be repaired with Wits alone. |
| Opus Major 1: the fall applied damage before clearing airborne, so a fall that Downed a soldier caused a second fall | Resolved | `procedure` step 2 ends airborne, mounted, and carried before the damage, and `never_a_second_fall` states the result. A separate carrier case is open (finding 4). |
| Opus Major 2: no soldier could mount outside a Titan Engagement | Resolved | `mount.requirements.outside_titan_engagement` tests no Position, `titan_engagement_ends` releases every horse, and the sheet and Squad row record a dismounted horse's Position (`@Distant`). |
| Opus Major 3: rating 1 ODM Gear Jams too often for the Attention holder | Not resolved, logged as OQ-72 | The ADR question is logged and the figures reproduce. Carried as finding 3. |
| Opus Major 4: no Phase 1 rule issued Standard Issue after creation | Resolved as raised | `interim_issue` issues it at the start of each session. The fix creates finding 2. |
| Opus Major 5: a dry or Jammed soldier could keep striking from Blind Spot | Resolved | `strikes` in `odm-gear.yaml`, and the `nape-strike` and `body-part-strike` Catalog rows, need ODM Gear that counts as had. Gas-free striking from a held Blind Spot stays logged in OQ-60's simulator case. The fix creates finding 1. |
| Opus Major 6: Strong Back did nothing for a Strength 4 carrier | Resolved | Carrier and comrade at Funding 3 now make at least 11 items, above every limit. With Strong Back the load is 6 to 8. The design note's arithmetic checks out, but one sentence overstates it (finding 5). |

The round 1 Opus Minors are all addressed:

- 7: the example now spends Jonas's round 2 turn, and moves Change Canister and the lift later.
- 8: a carrier's death has an `ends` row.
- 9: all six mismatches are fixed.
- 10: OQ-69 items 11 to 17 are applied.
- 11: the introduction, the OQ-59 glossary text, and "Anchor Rating Wooded" are fixed.
- 12: a Fly roll makes a soldier airborne only when its calling rule says so.
- 13: the rating 2 and 3 Blade Set rows are added.
- 14: restock timing and the Squad sheet line are added.
- 15: Field Repair is never rolled in Downtime.

## Checks that passed

- **ADR-0014 gas target (exact; drafter's figures in brackets).** ADR-0014 says results are medians, so the median and the cumulative odds around it are shown:

  | Full Gas Rating | Dice | Mean | Median | 10th to 90th | Empty by round 4 | Empty by round 6 | Empty by round 8 | Lasts 9 or more |
  |---|---|---|---|---|---|---|---|---|
  | 3 | 2 | 9.25 (9.25) | 8 (8) | 4 to 16 | 13.5% (13.5) | 32.3% (32.3) | 51.3% | 48.7% |
  | 3 | 3 | 6.33 (6.33) | 6 (6) | 3 to 11 | 32.3% (32.3) | 59.7% (59.7) | 78.8% | 21.2% |
  | 3 | 2 in round 1, then 3 (Light Trigger once) | 6.67 (6.67) | 6 | 3 to 11 | 27.3% | 55.6% | | |
  | 2 | 2 / 3 | 6.25 / 4.33 | 5 / 4 | | | | | |
  | 4 | 2 / 3 | 12.25 / 8.33 | 11 / 8 | | | | | |

  Gas Rating 3 is the closest whole number to both halves of the target. The no-Push median of 8 sits one round under "about 9" (finding 6). The Rookie who Pushes only when short (Agility 3, ODM Gear 1, Stress 1) gets:
  - 8.05 rounds when the roll needs 1 success, Pushing on 32.1% of rounds (drafter: 8.05 at 32%).
  - 7.09 rounds when it needs 2, Pushing on 65.8% (drafter: 7.10 at 66%).
- **The Jam figures reproduce** (rising Stress, Pushing when short, 100,000 runs; drafter's figures in brackets):
  - Rating 1, Jammed within 3 rounds at Severity 2, 3, 4: 27.7%, 31.3%, 31.8% (27.8, 31.6, 32.2).
  - Rating 2, same measure: 8.2%, 10.4%, 10.8% (8.3, 10.5, 11.0).
  - Rating 1, Jammed no later than the canister empties: 45.0%, 49.1%, 50.0% (45.0, 49.3, 50.1).
  - Rating 1, Jammed within 5 rounds, ignoring gas: 37.9%, 42.7%, 43.8% (38.0, 42.9, 44.0). The chapter's 5-round column counts rounds of dodging whatever the gas. A soldier who stops when the canister empties Jams within 5 rounds 36.2%, 40.3%, and 41.2% of the time.
- **Falls** are unchanged and exact. Low, high, and extreme average 1, 2, and 3 damage, and the Down-odds table is right for current Health 1 to 6.
- **Blade Sets.** The added rating 2 and 3 rows (19.4% and 24.0% ruined per strike) match round 1's independent run (19.6% and 24.1%).
- **Carrying arithmetic:**
  - Each Funding row issues its Funding number in counted items.
  - At Funding 3, carrier plus comrade is 3 + 5 + 3 = 11, above the largest limit of 10.
  - With Strong Back the load is 6 to 8, which fits the limits the design note states.
  - The worked example's loads (3/7, 4/7, 11/7, 8 after dropping, 6 with Strong Back) are right.
- **Worked example:**
  - Jonas's dodge pool, Push, successes, wear, Jam, fall band and damage, and three-die Gas Roll match the YAML.
  - The round 1 dodge spends his round 2 turn, as Chapter 1 section 1.9 requires.
  - Ilse's Field Repair (Wits 4 alone, same Position) and Jonas's Change Canister in round 3 are legal.
  - Every Squad row matches `squad_sheet_row`.
- **The decisions file's Chapter 4 constraints** are all met or logged:
  - `item-give`, `pass-item`, and the mount option are in the Catalog.
  - Mounted, horse Gear Dice, lame, and horse wear on a Pushed dodge are defined.
  - A carried soldier is not airborne.
  - Wear is tuned at Stress 1, and gas is tuned with Pushes on dodges, Fly, and Break Attention.
  - Falls are sized against current Health. The chapter says 1 to 6 where the decisions say 1 to 5; that is logged as OQ-71 item 7.
  - The one-line Squad row exists.
  - The medical Bonus Die is a `bonus-dice-sources.yaml` row.
- **Earlier-chapter edits against decided entries.** Each edit was checked against the decided entry it touches:
  - OQ-35 (`pass-item`): adding a Grabbed receiver extends the decided row without contradicting it.
  - OQ-12 and OQ-25: the dodge and gas rows are untouched.
  - OQ-23: carried soldiers are never airborne.
  - OQ-28: its rejected option (g) said a Specialty's Standard Issue item "belongs to Chapter 4", so the kits are in scope.
  - OQ-29: the Squad row exists.
  - OQ-31 and OQ-51: share-out comes at promotion's moment.
  - OQ-44: the medical Bonus Die is a Bonus Dice row.
  - OQ-45: Lift Comrade still reaches a Down soldier.
  - OQ-57: medical supplies never touch aftermath rolls.
  - The owner's Health boxes rule: falls use the damage procedure.
  - The one exception is finding 1, decided OQ-22's Exam.
- **ADR-0010.** Its "only hard restriction" is about teamwork. Needing working ODM Gear to strike is a gear condition of the same kind as needing a Blade Set, so it does not add a second restriction.
- **ADR-0003 checklist:**
  - Item 7: Field Repair states its Help requirement in and out of a Titan Engagement.
  - Item 8: the *No rulings* paragraph, and `gm` rows in `falls.yaml` and `standard-issue.yaml`.
  - Item 9: every new act is a Catalog option or action.
  - Item 12: section 4.13 lists acts and tracked values.
  - Item 13: no Chapter 4 state forbids a Push, Help, Cover, or Reaction.

## Findings

### 1. Major. The new strike requirement makes the Graduation Exam's Titan dummy course impossible

**Location:**

- `data/character/action-catalog.yaml` `nape-strike.requirements` and `body-part-strike.requirements`, changed under OQ-69 item 13.
- `data/gear/odm-gear.yaml` `strikes` and `gas.gas_rating` ("A soldier with no fitted canister has Gas Rating 0").
- `data/gear/items.yaml` `odm-gear.counts_as_not_had`.
- `data/character/graduation-exam.yaml` `conditions.exam_issue` (training ODM Gear, no canister), `conditions.gas_rolls: false`, `conditions.requirements_ignored`, and `trials[titan-dummy-course].entry: nape-strike`.
- Chapter 2 section 2.4.
- DECISIONS OQ-22, item 4 and its simulator target.

**Problem:**

- The `nape-strike` row now requires the striker's ODM Gear to count as had: "not Jammed, and with a Gas Rating above 0".
- The Exam issues training ODM Gear and no canister, and a soldier with no fitted canister has Gas Rating 0. Their ODM Gear therefore counts as not had.
- `requirements_ignored` is a closed list: requirements that need "a Titan, a Position, Attention, a Grabbed or Down soldier, a patient, a comrade with a Stress Response, or a worn or Jammed item". An empty or missing canister is not on it.
- Its other sentence, "The listed exam issue item always meets the entry's gear requirement", covers the training Blade Set, which is `nape-strike`'s gear item. It does not cover a requirement on a different item.

So Trial 2 cannot be rolled. Every Cadet scores 0 there.

The Exam's parity target is decided. OQ-22 says the Exam's mean Merit must be within 0.1 of the Year 3 performance roll's 0.583, and the decided schedule pays 0.612. Trial 2 pays 1 Merit at 2 or more successes with no Push (exact):

- 13.2% for a Strength 3 Cadet with no Talent (4 dice).
- 26.3% for Strength 4 with Clean Cut 1 (6 dice).

Losing that moves the mean to roughly 0.35 to 0.48, outside the band.

A secondary gap: the Trial 3 `body-part-strike` clause is keyed to "made from On Body or Blind Spot". Positions are ignored in the Exam, so whether the clause applies there is open.

**Scenario:**

1. Four Cadets vote to run the Exam. In Trial 2, Cadet Anke Roth declares `nape-strike` with her training Blade Set.
2. The Catalog row checks her ODM Gear. She has no canister, so her Gas Rating is 0 and her ODM Gear counts as not had.
3. `requirements_ignored` does not list it, so the strike cannot be made. Anke scores 0 Merit, and so does every other Cadet.
4. A Cadet near the Merit 6 Top 10 line misses it because a Chapter 4 gas rule reached into character creation.

**Fix options:**

1. Add to `odm-gear.yaml` `strikes`, and to both Catalog rows: "This requirement applies only in a Titan Engagement." The Exam is not one (`conditions.titan_engagement: false`), and a Chase rule that calls for strikes can name it.
2. Add "ODM Gear that counts as had (data/gear/odm-gear.yaml, strikes)" to `requirements_ignored` and to section 2.4's list. Log it under OQ-69 item 13.
3. Give the exam issue a training canister at full Gas Rating that never changes. This is weaker, because it adds a gas record to a procedure with no Gas Rolls.

### 2. Major. The interim issue restores every rating 1 item in full each session, which undoes the attrition OQ-59 and OQ-66 were written to keep

**Location:**

- Section 4.9, *When it is received* and *Receiving it*.
- `data/gear/standard-issue.yaml`: `interim_issue`, `by_funding` (ODM Gear, horse, Blade Sets, and kits all rated 1 at Funding 1 to 4), `receiving.steps` 1, 4, and 5, and `kept_items`.
- OQ-59 *Why* ("(d) would leave the Maintain Gear Downtime Action nothing to do").
- OQ-66 *Why* ("(b) and (c) erase wear and Jams between fights").
- `data/gear/field-repair.yaml` `outside_titan_engagement.when`.

**Problem:**

- `kept_items` says Standard Issue "never restores the current rating of an item the soldier keeps". At Funding 1 to 4, though, every item Standard Issue gives is rated 1: ODM Gear, horse, Blade Sets, and kits. An item rated 1 is either at full or at 0.
- Receiving exchanges Jammed ODM Gear, a lame horse, and a Specialty kit at 0 for fresh ones. So every item below its rating is replaced at full. For the default Funding 3 this is option (d), which OQ-59 rejects.
- OQ-66 confines Field Repair to certain care windows so that "wear persists" between fights. With an issue every session, a Jam persists only until the session ends. The limit binds only between fights played in the same session.
- Squad Supply returns to its Funding row every session as well.
- The resupply unit is where the table stops playing, not a fight or a mission. Two tables that play the same two Titan Engagements get different attrition if one splits them across two sessions.
- It is not Critical: decided Chapter 2 text already counts sessions (Drives, a new character joining), and OQ-59 logs the choice. The balance cost is real, and OQ-59's stated reasons no longer hold.

**Scenario:**

1. Session 3, Funding 3. The Hunter PC holding Attention Jams (31.5% within 3 rounds at Severity 3; finding 3). A Rider's horse goes lame. Both medical units are spent in the care window.
2. The Hunter's Wits 3 Field Repair in the end-of-fight care window fails. It succeeds 42.1% of the time.
3. **Table A** ends the session there. Session 4 opens with the interim issue: a new harness at 1/1, a new horse at 1/1, Medical 2. The second fight starts fresh.
4. **Table B** plays the second fight the same evening. The Hunter starts it Jammed, the Rider on foot, and the Squad with Medical 0.
5. At no point did either table's gear need the Maintain Gear Downtime Action, the rule OQ-59 kept (d) out to protect.

**Fix options:**

1. Make the interim issue top up only consumables: canisters, Blade Sets, and Squad Supply. It also exchanges a lame horse, since no Phase 1 rule restores one. Jammed ODM Gear and spent or worn-out kits are exchanged only by a full Standard Issue (the Lifepath, joining, or the Expedition rules), so Field Repair and restocking keep their job.
2. Keep the rule, and correct OQ-59's and OQ-66's *Why*. At Funding 1 to 4 the interim issue restores every issued item each session. Add to OQ-59's simulator case that Phase 1 attrition is measured per session, so no multi-fight run assumes wear carries over a session break.
3. Keep the rule, but let the interim issue exchange an item at 0 only if it was already at 0 when the previous issue was received. A harness Jammed this session must be repaired, or wait one more session.

### 3. Major (logged as OQ-72). Rating 1 ODM Gear Jams in about a third of the Attention holder's fights, and nearly half when a second Titan's cards reach them

**Location:**

- Section 4.9, the *ADR-0014 reference builds* note and `PROVISIONAL (OQ-72)`.
- `data/gear/standard-issue.yaml` `by_funding` (`odm_gear_rating: 1` at Funding 1 to 5).
- OQ-72, option (a) and its simulator case.
- `data/gear/falls.yaml` `jam-airborne`.

**Status:** logged as an ADR question, so it is not Critical. It is carried because it is still open, and because OQ-72's test measures a case narrower than Chapter 5's scope.

**Problem:**

- The figures reproduce (see *Checks that passed*). At Severity 3 the Attention holder Jams within 3 rounds 31.3% to 31.5% of the time, 1.8 to 2 points under OQ-72's threshold of a third. That is in a model that applies no Stress Responses.
- Every Jam while airborne at On Body or Blind Spot is a high fall.
- Squadmates never Push, so every Jam from wear lands on a player character.
- OQ-72 (a)'s binding test is one soldier dodging one Titan. ADR-0015 gives one dodge per Titan per round, and Chapter 5's scope includes Background Titans. A soldier who draws cards from two Titans makes two Pushed ODM Gear dodges a round.

With Stress rising and Pushing when short (100,000 runs), Jammed within 3 rounds:

| ODM Gear | Severity | One Titan | Two Titans |
|---|---|---|---|
| 1 | 2 | 27.9% | 41.9% |
| 1 | 3 | 31.5% | 46.9% |
| 2 | 2 | 8.2% | 17.8% |
| 2 | 3 | 10.5% | 22.7% |

- The test is recorded only in OQ-72, not in the decisions file's Chapter 5 constraints, so a Chapter 5 drafter reading those constraints will not see it.
- ADR-0014 tunes Severity against the Rookie's dodge. If rating 2 (OQ-72 (b)) is adopted after Chapter 5 tunes Severity, every Severity figure moves: the Rookie's Severity 3 dodge goes from 24% to 29% (OQ-25). The lever is cheaper before Chapter 5 than after.

**Scenario:**

1. A Hunter PC (Strength 3, Agility 3, Health 3, ODM Gear 1, Stress 1) holds a Medium Focus Titan's Attention at On Body. A Background Titan also resolves a card against them each round.
2. They dodge both, Severity 3, Pushing when short.
3. By the end of round 3 their harness has Jammed 46.9% of the time. Each airborne Jam is a high fall: 3 damage on a D6 of 5 or 6, which Downs them from full Health a third of the time.

**Fix options:**

1. Ask the decider to settle OQ-72 before Chapter 5 is drafted, since (b) moves the reference dodge Chapter 5 tunes against.
2. Keep (a), but widen its test: the soldier holding Attention receives cards from every Titan Chapter 5 lets act on them in a round, with Stress Responses, Help, and Covering applied. Record the test in the decisions file's Chapter 5 constraints when OQ-72 is decided.
3. Adopt (c)'s first-wear mark only when a round contains a second Titan's card, which leaves the single-Titan figures untouched.

### 4. Minor. When an airborne or mounted carrier becomes Down, one row says the comrade falls and the closed fall list says they do not

**Location:**

- `data/gear/carrying.yaml` `carrying_a_comrade.ends` ("The carrier becomes Down. The comrade is set down at the carrier's Position. If the carrier was airborne or mounted, both fall").
- `data/gear/falls.yaml` `triggers[carried]` ("falls, becomes Grabbed while airborne, or dies while airborne or mounted"), `not_a_fall` ("nor being set down by a carrier"), and the header "A soldier falls only when a row here happens".
- Section 4.7, *Carrying ends*.

**Problem:** The trigger list is closed and has no row for a carrier becoming Down.

- The carrier becoming Down sets the comrade down at once. That is the carrying row, and `not_a_fall` says being set down is never a fall.
- The carrier's own `down-airborne` fall comes later, "once the harm ... has been resolved". By then the carrier carries no one, so `triggers[carried]` ("a comrade who carries the soldier falls") does not fire.
- Read by the closed list, the comrade does not fall. Read by the carrying row, "both fall".

The stakes are high. The carried comrade is usually Down at 0 current Health, and a fall at 0 gives a Critical Injury: 2 times in 3 from low, always from high. The Grabbed and death rows do have matching triggers; only Down is missing.

**Scenario:**

1. Jonas is airborne at On Body, carrying the Down Tomas.
2. A Titan attack gives Jonas a Critical Injury that crosses off his last box, so he is Down.
3. The carrying row sets Tomas down and says both fall. Jonas falls high under `down-airborne`.
4. Tomas has no trigger, and being set down is not a fall. One player reads that Tomas takes a high fall and a Critical Injury; another reads that he takes nothing.

**Fix options:**

1. Add "becomes Down while airborne or mounted" to `triggers[carried]`. In the carrying row, say that when the carrier was airborne or mounted, carrying ends at step 2 of the carrier's fall, not when they become Down.
2. Drop "both fall" for the comrade: a Down carrier's comrade is set down with no fall, as for Retirement. Record the choice in OQ-62.

### 5. Minor. Nobody can take items off a Down comrade, so a Strength 2 or 3 rescuer stays Overloaded whatever they drop, and the design note says otherwise

**Location:**

- Section 4.7's design note ("Without Strong Back, such a carrier is Overloaded unless they first drop items of their own").
- `data/gear/carrying.yaml` `carrying_a_comrade.items` ("only the comrade can drop or pass them"), `shedding.not_while: [down]`, and `passing_items.requirements` (the passer is not Down).
- OQ-64 and OQ-68 (d).

**Problem:**

- A carried comrade counts as 5 plus their items. The comrade is almost always Down, and a Down soldier can neither drop nor pass, while no rule lets anyone else take an item from them.
- A Funding 3 comrade with Standard Issue makes the carrier's floor 5 + 3 = 8, even after the carrier drops everything of their own. That is above a Strength 3 limit (7) and a Strength 2 limit (6).
- The design note's "unless they first drop items of their own" is true only for Strength 4 or more. The worked example (Jonas at 8 against 7) already contradicts it.
- Stripping a wounded comrade's spare canisters is the canon Trost handover. OQ-68 (d) records it for the dead but not for the living Down.

**Scenario:** Ilse (Strength 3, limit 7) lifts the Down Tomas, who holds a spare canister and two spare Blade Sets.

1. She drops all four of her own items and is still at 8 of 7, so every ODM move costs her action.
2. Tomas's spare canister, which Ilse needs, cannot be moved to her by any rule.

**Fix options:**

1. Let a soldier at the same Position take one passable item from a Down comrade with `pass-item`, spending their action. That needs no new tracked value.
2. Let a carrier shed the carried comrade's items as part of `shed-load`.
3. Otherwise, correct the design note to "a carrier of Strength 4 or more, unless they first drop items of their own", and log the stuck load in OQ-64.

### 6. Minor. The gas design note reports means, while ADR-0014 measures medians

**Location:** Section 4.3, *Design note (ADR-0014 gas target)* ("Only 3 meets both halves of the target"). OQ-60, *Figures*. ADR-0014 ("results are medians").

**Problem:**

- The note's claim rests on the means, 9.25 and 6.33.
- Under ADR-0014's convention the no-Push lifetime is a median of 8. The canister has emptied by round 8 in 51.3% of cases and lasts 9 or more rounds 48.7% of the time. The Pushing median is 6, on target.
- Rating 4 gives medians of 11 and 8, two rounds over on both halves, so 3 is still the best whole number.
- As written, a simulator author who follows the ADR measures 8 and reports a missed target that the chapter says is met.

**Scenario:** The ADR-0014 simulator reports "gas no-Push median 8 rounds against a target of about 9: fail". The chapter says the target is met.

**Fix options:**

1. Lead the table with medians. State that 8 and 6 are the closest whole-number medians to about 9 and about 6, and that rating 4 gives 11 and 8.
2. Add to OQ-60's simulator case that the no-Push half is accepted at a median of 8.

### 7. Minor. Two things that happen when a procedure ends have no order, and one carrying row reads a Position outside a Titan Engagement

**Location:**

- `data/gear/standard-issue.yaml` `interim_issue` ("they receive it when that procedure ends instead"), `receiving.steps` 2 and 3 ("added until the soldier has the row's number ... None is taken away").
- `data/gear/carrying.yaml` `leaving_play.death.shared_out`, and the `ends` row for a carrier who retires.
- `data/harm/engagement-end.yaml` `during_the_steps`.

**Problem:**

- **Order.** If a session starts partway through a Titan Engagement in which a soldier dies, both the interim issue and the share-out come when that procedure ends, and neither rule orders them. Standard Issue tops up to the row and never removes, so the order changes totals.
- **Retirement.** It happens at the last end step, which is "resolved outside the Titan Engagement". The row "the carrier retires: the comrade is set down at the Position the carrier held" then has no Position to read.

**Scenario:** Anke has one Blade Set when the fight ends, and the dead Tomas's two spare Blade Sets are shared out to her.

- Issue first, then share-out: she is topped up to 3, then gets 2, for 5.
- Share-out first, then issue: she gets 2, has 3, and the issue adds none, for 3.

**Fix options:**

1. In `interim_issue`, say it comes after the share-out and promotion of the procedure that ends, or before them.
2. Change the retirement row to "the comrade stops being carried, with no fall".

### 8. Minor. A soldier who uses ODM Gear and then passes their fitted canister escapes that round's Gas Roll

**Location:** Section 4.3, *The Gas Roll* (step 5 lowers the Gas Rating at the end of the round). `data/gear/carrying.yaml` `passing_items.passable` (the fitted canister). `odm-gear.yaml` `gas.gas_rating`.

**Problem:**

- The Gas Roll lowers whatever canister is fitted at the end of the round. A soldier who made an ODM move and then passed their fitted canister has none fitted and Gas Rating 0, so the roll's 1s lower nothing.
- The canister arrives untouched, saving on average 1/3 of a Gas Rating point, or 1/2 after a Pushed ODM Gear roll.
- Changing canisters mid-round is harmless, because total gas is conserved. Passing moves gas to another soldier's sheet, so it is not.
- After the pass the passer's ODM Gear counts as not had, so no later roll can change that round's dice count. The Gas Roll can be made at the moment of passing without changing any other rule.

**Scenario:** Armin, at Gas Rating 3, makes an ODM move to Mikasa and passes her his fitted canister as his action. His end-of-round Gas Roll shows a 1 and lowers nothing, and Mikasa's spare is at 3 instead of 2.

**Fix options:**

1. Add to `passing_items`: a soldier who has used ODM Gear this round and passes their fitted canister makes that round's Gas Roll first, on that canister, and makes none at the end of the round.
2. Accept it and say so in OQ-65. It is small, and it matches the canon handover.

### 9. Minor. Squadmates never ruin Blade Sets or spend gas on strikes, but Chapter 2 says they do

**Location:**

- Chapter 2 section 2.10, *Design note (OQ-29, OQ-58)* ("Full gear tracking makes a Squadmate's ODM work and strikes spend gas and Blade Sets as a player character's do").
- Section 4.2 (a strike is never ODM use). Section 4.4 (ruin needs a Pushed roll). Section 4.13.
- `data/character/squadmates.yaml` `rules_applicability` (Push false).

**Problem:**

- Under Chapter 4, a strike spends no gas.
- A Squadmate never Pushes, so its Blade Sets are never ruined, its ODM Gear never Jams, its horse never goes lame, and its kits never wear.
- A Squadmate's row changes only in its Gas Rating, its load, its horse's Position, and its airborne, mounted, and carrying marks.
- Chapter 2's note promises Blade Set attrition that never happens. The one-line row OQ-29 asked for is tracking columns that cannot move.
- Fidelity: canon's rank-and-file burn through blades faster than anyone.

**Scenario:** A Slayer-template Squadmate makes a Nape strike every round for three Titan Engagements. It never swaps, never uses a spare Blade Set, and its row reads `Bl 1+2` throughout.

**Fix options:**

1. Correct Chapter 2's note to "spend gas on ODM use as a player character's does. A Squadmate never Pushes, so its gear never wears", and log the edit under OQ-69.
2. Record a question for the decider in OQ-63: whether a Squadmate's strike that falls short with a Gear Die showing 1 ruins its Blade Set. That is a new rule, not a Push, so it would leave OQ-13 intact.

### 10. Minor. Several Chapter 5 dependencies that Chapter 4 now relies on are not in the chapter's Chapter 5 list

**Location:** The chapter introduction's *Later chapters own these rules* list. Section 4.5, *Within a move*. Section 4.13 ("ODM moves, taking off, and landing are moves, which change `position-change`"). OQ-60 and OQ-72, simulator cases. `data/harm/engagement-end.yaml` `soldiers_who_left.same_position`.

**Problem:** The introduction lists what Chapter 5 owns, but the fix round added dependencies that live only in OQ entries or implied text:

- **A move with no change of Position.** A soldier at Distant who wants only to mount, or an airborne soldier who wants only to land, needs one. Chapter 1's baseline move changes Position by one step. Section 4.13 also says landing changes `position-change`.
- **The strike requirement's lift,** such as a Titan grounded by a Broken leg.
- **What a Jammed or dry soldier's dodge is.** A dry soldier stranded at Blind Spot still dodges with their full Agility, only one Gear Die short. Canon's dry soldier is helpless.
- **OQ-72's Jam test** and **OQ-60's gas per round of fighting.**
- **Soldiers who have left a Titan Engagement.** Chapter 3 lets two of them count as holding the same Position for Treat Injury and Rally, but not for Field Repair.

A Chapter 5 drafter reading the introduction and the decisions file's constraints will miss these.

**Scenario:** Chapter 5 is drafted with moves as Position steps only. A dismounted soldier airborne at Distant cannot land and mount beside their horse without leaving Distant, and nothing flags the gap.

**Fix options:**

1. Add each item above to the introduction's Chapter 5 bullet.
2. Collect them in one OQ entry, *Chapter 5 constraints from Chapter 4*, for the decider to copy into the decisions file.

### 11. Minor. Wording and small data slips

**Locations and problems:**

- **`items.yaml` `other_objects` and section 4.1.** The sentence about objects that are not gear items gives the Break Attention decoys "a flare, a riderless horse, or a thrown cloak" as its examples. A horse is a gear item, and a flare is Squad Supply. Only the cloak fits.
- **Strong Back's description** still reads "Carrying a comrade without being slowed down". Under OQ-64 a Strength 3 carrier with Strong Back who, like the comrade, holds a kit is still Overloaded (8 against 7). This is the same kind of description drift OQ-71 item 3 logs for Sure Seat.
- **`standard-issue.yaml` step 5.** "Has only one at current rating 0" is unclear for a Medic holding two medical kits, one at 0.
- **`sheet-fields.yaml` `derived.items_carried`.** "The sum of items_counted over everything the soldier has" does not say that a carried comrade's 5 items and their carried items are added.
- **`odm-gear.yaml` `stops_being_airborne`.** "A comrade lifts the soldier with lift-comrade" can never happen. Lifting needs a Down comrade, and a soldier who becomes Down while airborne falls first.
- **Chapter 2 section 2.6.** "A Specialty grants nothing beyond the key attribute, the swap and floor, and one Talent level", followed at once by "It adds nothing to Standard Issue except the kit", reads as a contradiction.

**Fix options:**

1. Keep only the thrown cloak as the example in `other_objects`, and rewrite Strong Back's description as "Carrying a comrade without their weight slowing you down".
2. Change step 5 to "who holds no such item at a current rating above 0", and add the carried comrade to the `items_carried` formula.
3. Delete the lift row from `stops_being_airborne`. Recast section 2.6 as "Through Standard Issue (Chapter 4), a Medic or an Engineer also receives a kit."

## Provisional decisions OQ-59 to OQ-69 and OQ-72

| OQ | Judgment |
|---|---|
| OQ-59 | **Partly sound.** The rows add up, rating 1 is ADR-0014's Rookie, and the corrected glossary text now covers joining the Squad. The interim issue fills the resupply gap, but at Funding 1 to 4 it is option (d) for every issued item, so the *Why* against (d) no longer holds (finding 2). |
| OQ-60 | **Sound.** The strike requirement closes the dry and Jammed strike without touching OQ-12's gas basis, and (b) stays the recorded lever for gas-free striking. It must be limited to Titan Engagements or excused in the Exam (finding 1). Its figures should be reported as medians (finding 6). |
| OQ-61 | **Sound.** Mounting outside a Titan Engagement, the horses at the end of a fight, the horse's Position on the sheet, and Fly all work now. Moves with no change of Position belong to Chapter 5 and should be named there (finding 10). |
| OQ-62 | **Sound.** The reordered procedure removes the double fall, and the horse band is fixed. One trigger is missing, for an airborne or mounted carrier who becomes Down (finding 4). |
| OQ-63 | **Sound.** The rating 2 and 3 figures reproduce. A Squadmate's Blade Sets are never ruined, which Chapter 2's note misstates (finding 9). |
| OQ-64 | **Sound.** Counting 5 plus the comrade's items closes the container and gives Strong Back a job for every carrier. A Down comrade's items cannot be removed by anyone (finding 5). |
| OQ-65 | **Sound.** The Grabbed receiver is now in the Catalog row. Passing the fitted canister after ODM use skips that round's Gas Roll (finding 8). |
| OQ-66 | **Sound in itself.** Excluding Downtime windows answers round 1's finding. Its purpose, keeping wear between fights, is largely undone by the interim issue (finding 2). |
| OQ-67 | **Sound.** Restocking at any point in the window, the Squad sheet line, and the named later reader of ammo are all in place. Both medical uses stay outside Titan Engagements and aftermath rolls. |
| OQ-68 | **Sound.** (d) is recorded with a clear reason it waits for Chapter 5. Its end-of-procedure timing is unordered against the interim issue (finding 7). |
| OQ-69 | **Sound.** Items 1 to 9 and 11 to 17 are applied as listed. The only glossary item is left for the decider. Item 13 needs an Exam or Titan-Engagement-only clause (finding 1), and Chapter 2's section 2.10 note needs a matching edit (finding 9). |
| OQ-72 | **Sound as a log.** The figures reproduce. (a)'s test covers only one Titan's cards, and the case with two Titans raises the Jam rate from 31.5% to 46.9% at Severity 3. The test is not yet in the decisions file's Chapter 5 constraints, and (b) is cheaper before Chapter 5 tunes Severity (finding 3). |

## Appendix: models

**Gas (exact).** A Markov chain over Gas Rating G. Each round rolls d dice, and each 1 lowers G by 1. "Lasts" is the round whose Gas Roll brings G to 0 or below. The median is the smallest round n where P(empty by n) is at least 50%. Light Trigger uses 2 dice in round 1 and 3 dice afterwards.

**Rookie gas** (200,000 canisters): Agility 3, ODM Gear 1 (wear not modelled), fixed Stress 1, one ODM Gear roll a round needing 1 or 2 successes, Pushing when short and allowed. The Gas Roll is 3 dice on a round with a Push.

**Dice pool** (every Monte Carlo case):

- Base dice are the attribute. Gear Dice are the item's current rating. Stress Dice are the soldier's Stress.
- No Push if any Stress Die shows 1.
- A Push adds 1 Stress, re-rolls base and Stress Dice not showing 6, and adds one new Stress Die. Gear Dice are never re-rolled.
- Wear is the number of Gear Dice showing 1 on a Pushed roll, capped at the current rating. The gear Jams at 0.
- Stress Responses are not applied.

**Jam, one Titan** (100,000 runs per case): Agility 3, Stress starting at 1, one dodge a round against Severity 2, 3, or 4, Pushing when short. A full canister is rolled alongside. "No later than the canister empties" compares the Jam round with the empty round. The gas-ignored variant runs 5 rounds regardless.

**Jam, two Titans** (100,000 runs per case): as above, but two dodges a round, one per Titan, with Stress carried between them. Gas is ignored, over 3 rounds.

**Exam Trial 2 payout (exact).** P(at least 2 sixes) on n dice with no Push: 1 − (5/6)^n − n(1/6)(5/6)^(n−1). Four dice give 13.2% and six give 26.3%.

**Falls and Field Repair (exact).** As in round 1. Field Repair with n dice and no Push succeeds 1 − (5/6)^n of the time: 42.1% at Wits 3.
