# Chapter 2, Character Creation: review round 3

Reviewed:

- `docs/rules/02-character-creation.md` and every file in `data/character/`.
- The Chapter 2 rows and reference edits in `data/core/dice-pool.yaml`, `data/core/stress-changes.yaml`, and `data/core/bonus-dice-sources.yaml`.
- OQ-19 to OQ-36 in `docs/rules/OPEN-QUESTIONS.md`, and the Chapter 1 erratum now recorded under OQ-03.

Checked against:

- `CONTEXT.md`, ADR-0001 to ADR-0015, and Chapter 1 (`docs/rules/01-core-rules.md`, OQ-01 to OQ-18).
- Both round 2 reviews (`02-character-creation-review-2.md` and `02-character-creation-review-2-codex.md`).
- The final design review brief.

I did not read the parallel round 3 Codex review.

Odds come from Python simulations in the scratchpad, which are not committed. The YAML was converted to JSON with Ruby's standard library and read unmodified:

- Lifepath runs use 200k Cadets.
- Graduation Exam runs use 120k to 240k Cadets per case, built from the current tables.
- The cost of a Covering Cadet's Stress uses 400k rolls per pool.

The appendix gives the models. An integrity script found:

- All five D66 tables cover 11 to 66 exactly once.
- Every Talent, entry, act, tracked value, template, and OQ id resolves.
- There are 40 Talents, 20 dice and 20 rule. Every dice Talent names only `action`, `reaction`, or `roll` entries.
- Every Talent row has a `description`.
- The Specialty and Talent lists agree in both directions.
- Every attribute's `used_by` list matches the Catalog.
- All 12 Drives begin "When I". Five use `most_recent_turn`, five use `since_most_recent_turn_start`, and two use `own_state`.
- All nine Squadmate templates total 18 points with key attribute 4 and no other attribute above 4. Their Health and Resolve match OQ-24, and their Talent is a dice Talent on their Specialty's list.
- The Class Rank rows are contiguous.
- Only `position-change` and `rule-named-value` are tracked values that no entry changes, and both are intentional.
- The Mira example still matches the YAML at every step.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

The round 2 fixes landed. Five of the six round 2 Majors are resolved or correctly logged:

- **Opus 2 (Drives outside a Titan Engagement).** Logged under OQ-36 with a closed hook.
- **Codex 1 (Specialty strategy).** The key attribute now always takes the highest rating. The figures reproduce exactly for every strategy, and the rule is consistent with ADR-0006 and the glossary.
- **Codex 2 (passive own-state Drives).** Closed by the provenance clause and the Draw Attention rewrite.
- **Codex 4 (the Cover dump).** Closed: a Cover now costs the Covering Cadet about 0.2 Merit on their own roll.
- **Opus 1 (Exam parity).** Holds for every Push policy.

No rule rests on GM discretion. No ADR or glossary contradiction is left unlogged, and no ADR-0014 target is made unreachable. **Chapter 2 has no open Critical.**

Two Majors remain open:

1. **The Graduation Exam still beats the roll it replaces when players coordinate.** Players can aim Help, roll order, and Covering at Cadets exactly one Merit short of Top 10. That raises Top 10 from 6.3% to 7.6% to 7.8% for four to six Cadets. The chapter says no policy moves it by more than 0.2 points, but OQ-22 tested only Push policies.
2. **OQ-35, carried as an Unresolved Major.** Section 2.9 gives no roll and no effect to an action that changes no tracked value. That already covers the commonest uncatalogued act in a Titan Engagement: handing a comrade a gas canister or a Blade Set.

Six Minors follow. The most useful ones:

- Two Exam rules override closed Chapter 1 procedures without a Chapter 1 hook, although the chapter says it changes no Chapter 1 rule.
- Under the always-swap rule, Hunters, Medics, and Engineers end with about 0.86 less Health plus Resolve than other Specialties from the same rolls.
- The own-state provenance test has three undefined edges.

## Round 2 verification

### Opus review 2

| # | Finding | Status | Evidence |
|---|---------|--------|----------|
| 1 | Major. The Exam pays more than the roll it replaces under simple play, and much more for small groups | **Partly** | Resolved as raised. The squad bonus is gone and the group-size effect with it. The reference Push policy reproduces OQ-22: Exam Merit 0.52 against 0.58, and Top 10 6.2% against 6.3% for four Cadets (one Cadet: 5.75% against 6.15%). Parity still rests on an untested policy, now Help and roll order instead of Pushing (finding 1). |
| 2 | Major. Drives and "once per Titan Engagement" Talents do nothing outside a Titan Engagement, and this is not logged | **Resolved (logged)** | OQ-36 (d): `drive_rules.outside_titan_engagement` and `limit_terms.once_per_titan_engagement` give later rules a closed hook. The section 2.5 PROVISIONAL states the 11 of 12 limit, and the count checks out (10 turn tests plus Prove Them Wrong). |

The round 2 Minors are all addressed:

- `gear_requirement` counts an item worn to 0 as not had.
- Relentless needs at least 1 success.
- OQ-20 (g) leaves 0 of 200k soldiers forced into a dormant level. The new fallback is used by 2.84%.
- The OQ-21 skew diagnosis is corrected.
- The shout example and step 1 are fixed.
- The promotion Origin step reads "gain 1 level".
- The named-comrade fallback exists, and the roll-off wording is fixed.
- `record_on_sheet` has `health_lost` and `down`.
- Talent descriptions are added, and Mira's dodge sentence and the entry groups are fixed.
- The stale Chapter 1 sentence is logged as an erratum under OQ-03.

### Codex review 2

| # | Finding | Status | Evidence |
|---|---------|--------|----------|
| 1 | Major. The Graduation swap does not make key attribute odds independent of Specialty choice | **Resolved** | OQ-19 (h). Key attribute 4 / 5 / 6 is 63.48 / 34.43 / 2.10% both with the highest attribute's Specialty and with a random one, and the two runs match exactly, as they must, since the key attribute always ends at the soldier's highest rating. The rule fits ADR-0006: only the key attribute reaches 6, and only through Top 10; the others stay 2 to 5; no permission is granted. It fits the glossary Specialty ("bonuses but never exclusive permission") and ADR-0011, since the swap happens inside the Lifepath. Its side effect on derived values is finding 4. |
| 2 | Major. `own_state` lets two Drives fire without an act | **Resolved** | Shield the Walls is now Draw Attention, a `most_recent_turn` test. Prove Them Wrong requires that the soldier's most recent change of Position was their own move, and `own_state` no longer names Attention. Three edges remain (finding 5). |
| 3 | Major. OQ-27 contradicts ADR-0003's attribute-alone fallback | **Not resolved (logged as Unresolved Major OQ-35)** | Needs an ADR decision. Carried as finding 2 with a Phase 1 case that OQ-35's scope note does not cover. |
| 4 | Major. Exam roll order lets a Cadet who has already rolled absorb Covering Stress | **Resolved** | OQ-22 (p): only a Cadet who has not yet rolled can Cover. Starting the squad field exercise at Stress 1 instead of 0 costs 0.16 to 0.21 Merit (pools of 4 to 8 dice). That is more than the roughly 0.07 a Covered Push gains the Pusher, so a Cover is a real trade for a Cadet whose Merit matters. It stays free only for a Cadet who cannot reach Top 10, which is part of finding 1. The rule itself has a Chapter 1 contract problem (finding 3). |

Both Codex round 2 Minors are addressed: the Chapter 1 erratum is logged under OQ-03, and OQ-28 now says nine.

## Findings

### 1. Major. Coordinated Help, roll order, and Covering make the Graduation Exam raise Top 10 graduates by about 1.4 points; the chapter's parity claim covers only Push policies

**Location:**

- Section 2.4, *The three Trials* (squad field exercise bullets) and the PROVISIONAL (OQ-22) block ("The share of Top 10 graduates is the same with the Exam and without it ... No Push policy tested raised it by more than 0.2 points").
- `graduation-exam.yaml`: `use.decided_by`, `roll_order_within_a_trial`, `trials[squad-field-exercise].help` and `.cover`.
- OQ-22, *Why* ("Help and Covering are the only group levers") and *Simulator case* ("re-run with Help concentrated on the weakest Cadets").
- OQ-21 (Top 10 is the only effect of Class Rank).

**Problem:** The round 2 fix made each Cadet's Merit depend only on their own rolls and put a price on Covering. It left three choices with the players:

- Who Helps whom, with up to 3 helpers on one roll.
- The roll order.
- Who Covers.

Class Rank has exactly one effect, Top 10 at Merit 6 or more (OQ-21), and the players know every Cadet's Merit when they decide:

- The table chooses to run the Exam before any Year 3 event, when Year 1 and Year 2 Merit are already known.
- It sets Help and order after every Year 3 event.

So a cooperative table spends the Exam on the Cadets it can push over the line:

- **5.5% of Cadets enter the Exam at Merit 5**, and 12.0% at Merit 4. A Merit 5 Cadet needs only the squad field exercise.
- **A Cadet who cannot reach 6 loses nothing** by giving their Help to that Cadet, or by Covering them.
- **A Merit 5 Cadet should not Push Trials 1 and 2**, since at Stress 0 they can never suffer a Stress Response.

OQ-22's model gave each Cadet one helper in a cycle, varied roll order only as strongest or weakest first, and tested five Push policies. The policy below is simple rather than optimal, so its gain is a floor:

- Cadets exactly 1 Merit short before the squad field exercise roll first, weakest first.
- Every Cadet's Help goes to them, up to 3 per roll.
- Only Cadets who cannot reach 6, or who are already safe by 2 or more, Cover their Pushes.
- Only Cadets 2 or 3 short Push Trials 1 and 2, at exactly 2 successes.

Top 10 with the Exam against without, same Cadets:

| Policy | 4 Cadets | 6 Cadets |
|---|---|---|
| OQ-22 reference: one helper each, strongest first, Push the squad field exercise when short and Trials 1 and 2 at 2 | 6.19 / 6.24% | 6.23 / 6.21% |
| Help aimed at Cadets 1 short, otherwise reference | 6.84 / 6.25% | 6.85 / 6.15% |
| Order and Covering aimed, one helper each | 6.59 / 6.19% | 6.65 / 6.25% |
| Help, order, and Covering aimed | **7.61 / 6.26%** | **7.75 / 6.26%** |
| Help and order aimed, no Covering | 7.43 / 6.19% | 7.54 / 6.26% |

By group size, the aimed policy gives 6.07 / 6.20% for 1 Cadet, 6.53 / 6.17% for 2, 7.55 / 6.23% for 4, and 7.46 / 6.25% for 6.

Four consequences follow:

- **The rise is 1.3 to 1.5 points, about 22% relative, on the only route to an attribute of 6** (OQ-19, OQ-21). In a Squad of four player characters, the chance that at least one is Top 10 goes from about 23% to about 27%.
- **Help and order carry most of it.** Covering adds about 0.2 points, so OQ-22 (p) did its job against the round 2 exploit.
- **A table with a Merit 4 or 5 Cadet after Year 2 has a mechanical reason to vote for the Exam,** so the optional prologue is a strategy choice rather than a flavor choice.
- **The chapter's PROVISIONAL states parity "for any number of Cadets from 1 to 6" without a policy qualifier,** and OQ-22's Why calls Help and Covering the only group levers, but never measures them.

**Scenario:** Four players.

1. After Year 2, Aldo has Merit 5, Brun 2, Cora 3, and Dov 1. The players vote to run the Exam. Aldo's Year 3 event changes his Merit by 0.
2. Aldo does not Push the ODM balance test or the Titan dummy course, so he enters the squad field exercise at Stress 0.
3. He rolls first and takes Rally: Empathy 3 plus Steady Voice 1, and Brun, Cora, and Dov all Help. That is 7 dice, needing 2.
4. If he falls short he Pushes, and Dov, who cannot reach Merit 6 and has not rolled, Covers.

Aldo succeeds about 68% of the time and cannot suffer a Stress Response. The Year 3 performance roll it replaced, Empathy 3, succeeds 42% of the time.

**Fix options:**

1. **Take the order and the Help assignment out of player choice.** Each Cadet rolls a D6 before each Trial, and Cadets roll highest first. Each Cadet Helps the next Cadet in that order, and the last Helps the first. Simulated with the aimed Push and Cover policy: 6.44 / 6.24% for 2 Cadets, 6.48 / 6.20% for 4, and 6.40 / 6.23% for 6. Remove "the order of Cadets in a Trial" from `group_choices`.
2. **Allow at most 1 helper per roll in the Exam,** keeping free choice otherwise. Simulated: 6.71 / 6.30% for 2 Cadets, 6.58 / 6.26% for 4, and 6.62 / 6.22% for 6.
3. **Keep the rule, and correct the chapter's PROVISIONAL and OQ-22** to report coordinated play: about 7.6% Top 10 for four to six Cadets. Record in OQ-21 that the Top 10 rate the Rookie calibration uses assumes no Exam, and move "Help aimed at Cadets one Merit short" from the simulator case list into the Why.

### 2. Major (Unresolved, logged as OQ-35). An action that changes no tracked value has no effect, and that already covers passing gear to a comrade in a Titan Engagement

**Location:**

- Section 2.9, steps 1, 3, and 5, *No rulings*, and the PROVISIONAL (OQ-27) block.
- Section 2.8, *Entries that need gear* (the Blade Set example).
- `action-catalog.yaml`: `tracked_values`, `change-canister`, `uncatalogued_actions`.
- Chapter 1 section 1.9 ("An action is either Help or one Action Catalog entry").
- ADR-0003 item 9; OQ-27, OQ-35.

**Status:** Logged as an Unresolved Major that needs an ADR decision, so it is not Critical. It is carried because OQ-35 describes the gap as scene values that later Operation Frame and hazard rules will create. The commonest case is ordinary Titan Engagement play.

**Problem:**

- In a Titan Engagement, a soldier's action is Help or one Catalog entry (Chapter 1, section 1.9). Anything else goes through section 2.9.
- No entry passes an item to a comrade, and no tracked value covers a soldier gaining a gas canister, a Blade Set, or any carried item.
- Naming `gas-restore` reaches only `change-canister`. That entry requires "the soldier carries a spare gas canister", and taking it changes the taker's own canister (Chapter 4). It cannot put gas in a comrade's rig.
- Naming `gear-restore` reaches `field-repair`, which restores a rating or ends a Jam. It does not replace a lost Blade Set.
- Section 2.8's example says a soldier whose last Blade Set is gone cannot make a Nape strike. Under section 2.9 no comrade can hand her one, so she cannot make one for the rest of the Titan Engagement. *No rulings* forbids the GM from fixing it.
- ADR-0003 item 9 says such an action uses the closest Catalog action or the attribute alone. The procedure gives neither.

This is a canon-central act: in Trost in 850, Armin gives Mikasa his gas so she can keep fighting. OQ-35 is right that (c) beats a player-chosen attribute, but its scope note ("values no rule creates stay flavor") reads as if only Phase 2 rules are affected. Chapters 4 and 5 are Phase 1.

**Scenario:** Round 4 of a Titan Engagement.

1. Private Ines's Gas Rating is 0, and her last Blade Set was lost on a Body Part strike.
2. Private Roe holds her Position with two spare canisters and two Blade Sets. His player says Roe throws her a canister and a Blade Set.
3. Step 1 offers no value for either item. If the player names `gas-restore`, step 3 gives `change-canister`, which Roe takes on his own rig.
4. Ines stays grounded and bladeless until the Titan Engagement ends. No one at the table has a rule that lets the handover count.

**Fix options:**

1. **Settle OQ-35 (a) now:** amend ADR-0003 item 9 so an action outside the Catalog changes only tracked values. Add to the Chapter 3 to 5 drafting briefs a check that every consequential act in their scope has a tracked value and an entry.
2. **Without the ADR change, close the Phase 1 case in this chapter's data.** Add a tracked value `item-give` ("give a carried item to a comrade"). Add an unrolled action `pass-item`, with the same Position or one step as its requirement, as Help. Chapter 4 sets which items can be passed, and whether a thrown item needs a roll. OQ-35 is then left with scene values only.
3. **Record in OQ-35 that gear handover, and mounting or dismounting a horse** (which Saddle Dodge and Rescue Ride assume), are values Chapter 4 must add before it can be Done, so the gap has an owner.

### 3. Minor. Two Exam rules override closed Chapter 1 procedures without a Chapter 1 hook, and the chapter says it changes no Chapter 1 rule

**Location:**

- Chapter 2 introduction: "except where a roll's own procedure lists an exception" and "It changes no Chapter 1 rule."
- Section 2.4, *Stress Responses*, and the squad field exercise Cover bullet.
- `graduation-exam.yaml`: `conditions.stress_responses` and `trials[squad-field-exercise].cover`.
- Chapter 1 section 1.5: PROVISIONAL (OQ-06) "Who can Cover" ("Outside a Titan Engagement, they must qualify to Help that roll under the rule that called for it") and PROVISIONAL (OQ-05) step 2.
- `stress-changes.yaml` `cover.condition`; OQ-18.

**Problem:** Both Exam rules are good design. The problem is the contract with Chapter 1.

- **Covering.** Chapter 1 ties Covering outside a Titan Engagement to Help eligibility under the calling rule. The Exam's Help rule makes every other Cadet eligible, and frames its one use per Trial as "all Help spends". Chapter 1 separates what Help spends from who qualifies. So a Cadet who has already rolled still qualifies to Help the later rolls, and under Chapter 1 can Cover them. The Exam forbids that. It is a Cover-only ban, exactly the hook OQ-18 records Chapter 1 does not have.
- **Stress Responses.** OQ-05 step 2 resolves every Stress Response on the Chapter 3 table. Chapter 1 lets a roll's own rule change its Stress Dice (OQ-03), forbid a Push (section 1.5), or set Help outside a Titan Engagement (section 1.8). Nothing lets a rule replace the Stress Response resolution. The Exam replaces it with a Merit cost.

The introduction's "except where a roll's own procedure lists an exception" claims a general power Chapter 1 does not grant, and "changes no Chapter 1 rule" is not quite true.

**Scenario:** The Foundry importer builds Covering eligibility from `stress-changes.yaml` `cover.condition`: the Covering soldier "qualifies to Help that roll under the rule that called for it". In the squad field exercise, Aldous rolls first and then offers to Cover three later Pushes. The sheet accepts each one, because Aldous still qualifies to Help. That is the Codex round 2 exploit, back through the data file Chapter 1 owns.

**Fix options:**

1. **Log both as Chapter 1 errata.** Under OQ-18, the Exam is the first rule that needs option (c)'s shared forbid hook. Under OQ-05, a rule may replace Stress Response resolution by naming it. Change the introduction to "It changes no Chapter 1 rule except the two Graduation Exam exceptions logged under OQ-05 and OQ-18."
2. **Rephrase the Exam's Help rule** so a Cadet who has made their own roll in the Trial no longer qualifies to Help. Chapter 1's own Cover test then gives the same limit with no override. Re-simulate OQ-22, because the last roller loses their Help.

### 4. Minor. Under the always-swap rule, three Specialties end with less Health and Resolve from the same rolls, and a Specialty can take away the body the Lifepath rolled

**Location:** Section 2.2, *How the Lifepath sets attribute ratings*, step 4.1; `attributes.yaml` `creation.graduation.key_attribute_swap` and `derived_values`; OQ-19, *Simulator note*; OQ-24.

**Problem:** OQ-19 (h) moves the soldier's highest rating into the key attribute, and the key attribute's old rating into that attribute. Health counts Strength and Agility, and Resolve counts Instinct and Empathy, but Wits and Perception count toward neither. The same 200k Lifepaths, graduated into each Specialty:

| Specialty (key attribute) | Health | Resolve | Health + Resolve | Health 2 or less |
|---|---|---|---|---|
| Slayer, Brawler (Strength); Flier, Rider (Agility) | 3.83 | 2.98 | 6.82 | 0.0% |
| Tactician (Instinct), Leader (Empathy) | 2.98 | 3.83 | 6.83 | about 11% |
| Hunter (Perception), Medic and Engineer (Wits) | 2.97 | 2.98 | 5.96 | about 11% |

Two things follow:

- **Hunters, Medics, and Engineers pay about 0.86 of derived value** for their Specialty. OQ-19's note says Health depends on the Specialty, but not that three Specialties lose on both values. The Medic is the Specialty meant to stay beside the injured. The Squadmate templates show the same pattern (Medic, Engineer, and Hunter at 3 and 3), so it looks accepted but is not stated.
- **The Lifepath's story can be swapped away.** A Wall Rose Farm Cadet who hauled grain and threw a Cadet twice her size ends at Strength 2 if she graduates as a Medic.

**Scenario:** Mira's final ratings before Graduation are Strength 5, Agility 2, Wits 2, Perception 4, Instinct 2, and Empathy 3.

- As a Slayer she has Health 4 and Resolve 3.
- Had she chosen Medic, Wits 5 and Strength 2 would give her Health 2 and Resolve 3. Chapter 3's Down and Critical Injury odds would treat her as the frailest soldier in the Squad, on the same 18 points.

**Fix options:**

1. **Keep the rule, and add the table above to OQ-19's simulator note.** Ask Chapter 3 to tune Down and Critical Injury odds against the 11% of Hunters, Tacticians, Leaders, Medics, and Engineers at Health 2.
2. **Compute Health and Resolve from the ratings before the Graduation swap.** The rolled body stays the body, and the swap decides only which attribute the Specialty uses. Record it in OQ-24. The cost is one more set of numbers at creation.

### 5. Minor. The own-state provenance test has three undefined edges

**Location:** Section 2.5, *Trigger tests*, `own_state`; `enlistment.yaml`: `drive_rules.trigger_tests.own_state`, rows `prove-them-wrong` and `freedom`; OQ-23 (m), *Why*.

**Problem:** The test asks whether the soldier's most recent change of Position was a move they made. It covers the round 2 cases, but three cases are left open:

- **No change of Position yet.** Chapter 5 will place soldiers when a Titan Engagement begins. A soldier who starts at Blind Spot, as in an ambush, has no most recent change of Position, so Prove Them Wrong can be read as met (no other rule moved them) or not met (no move of theirs).
- **Grabbed while already On Body.** OQ-23 treats a Grab as "a change of Position another rule makes". If Chapter 5 leaves a soldier seized On Body at On Body, their most recent change is still their own move, and Prove Them Wrong is met by being seized.
- **Freedom has no provenance clause.** OQ-23 says only the soldier's own ODM use makes them airborne. A Down soldier carried by a comrade on ODM Gear, or a soldier left in the air by a Titan behavior, may count as airborne, depending on how Chapter 4 defines it.

**Scenario:** Private Roe takes Lift Comrade on Down Private Hale (Freedom) and swings out on his ODM Gear. A Fear Roll result lands on Hale. If Chapter 4's airborne rule covers a carried soldier, Hale shrugs it off without having done anything.

**Fix options:**

1. **Extend `own_state`.** "A Position the soldier was placed at when the Titan Engagement began does not count until they move", and "airborne on ODM Gear through their own move". State that a Grab on a soldier already On Body counts as a change another rule made.
2. **Leave all three to Chapters 4 and 5,** and list them in OQ-23 as questions those chapters must answer, so the simulator's Drive payoff case models one reading.

### 6. Minor. The ODM balance test and the Titan dummy course almost never pay Merit

**Location:** `graduation-exam.yaml`: `trials[odm-balance-test].merit` and `trials[titan-dummy-course].merit` (1 Merit at 3 or more successes); section 2.4; OQ-22.

**Problem:** Trials 1 and 2 pay 1 Merit only at 3 successes, and typical pools are 4 to 6 dice:

- A 5-die pool reaches 3 successes 3.5% of the time unpushed.
- Under OQ-22's reference policy, 7.2% of Trial 1 and 2 rolls pay Merit. Under the aimed policy of finding 1 it is 3.7% to 4.0%, because fewer Cadets Push.
- Even a Flier with Agility 5, Wirework 2, and training ODM Gear 1 reaches 3 successes only 13.5% of the time unpushed.

Nearly all Exam Merit therefore comes from the squad field exercise, which Help and roll order decide (finding 1). Canon's Training Corps rankings rest on ODM Gear and Titan dummy scores, so two of the three Trials in the glossary's played prologue carry Stress and wear into Trial 3 but rarely decide Class Rank.

**Scenario:** The best Flier in the class rolls 8 dice on the ODM balance test and scores 2 successes. The Medic in her group rolls 7 dice with three helpers on the squad field exercise and passes. The Medic leaves the Exam with more Merit, from the one Trial built on group choices.

**Fix options:**

1. **Pay 1 Merit at 2 successes in Trials 1 and 2,** and re-simulate parity at 1 to 6 Cadets. If needed, raise the squad field exercise to 3 successes, or lower its Merit, to compensate.
2. **Keep the values, and state in OQ-22** that Trials 1 and 2 pay Merit on about 7% of rolls and exist mainly to build Stress and wear before the squad field exercise.

### 7. Minor. The Origin year condition uses the campaign start year for characters created or promoted later

**Location:** Section 2.3.1, step 2; `origins.yaml`: `condition_fields.campaign_start_year_min` and row `wall-maria-refugee`; `squadmates.yaml` `promotion.steps` (the Origin roll "rolling again if a condition is not met") and `promotion.no_squadmate`; OQ-32.

**Problem:** The condition compares the row's minimum year with the campaign start year, which never changes. A replacement character, or a promoted Squadmate who rolls an Origin, joins later in the campaign. A refugee who fled in 845 and graduated in 848 fits any campaign in 848 or later, but a campaign that started earlier still rerolls the row for every later soldier. Phase 1 has no current campaign year to test instead.

**Scenario:** A campaign starts in 846. In 850 a player character dies with no Squadmate to promote, and the player's new Cadet rolls 15, Wall Maria Refugee. The row is rerolled, although the character is graduating five years after the fall.

**Fix options:**

1. **Record in OQ-32** that characters created or promoted after the campaign starts use the start year until the Canon Clock rules add a current campaign year, and give that year to the Canon Clock rules.
2. **Add a `campaign_year` to the campaign record now,** changed only by rules that name it, and test every Origin condition against it.

### 8. Minor. Glossary `_Avoid_` terms in new text

**Location:** `talents.yaml` descriptions of `hand-to-hand` ("with blades or bare hands") and `blade-discipline` ("keeps blades sharp"); section 2.4, squad field exercise ("the whole group succeeding").

**Problem:** The glossary's Blade Set entry lists "blades" under `_Avoid_`, and the Squad entry lists "group". The descriptions were added in the round 2 fix and are player-facing text that the Foundry import will show.

**Scenario:** A Talent card reads "keeps blades sharp", while the gear sheet counts Blade Sets, and a player asks whether a blade is half a Blade Set.

**Fix options:**

1. Use "with a Blade Set or bare hands", "keeps Blade Sets sharp", and "There is no bonus for every Cadet succeeding."

## Chapter 1 YAML and rule edits

| File, row, or rule | Consistent with Chapter 1 | Changes a Chapter 1 rule |
|---|---|---|
| `dice-pool.yaml` `roll_exceptions.performance-roll` and the header's adding pattern | Yes. Every exclusion has a Chapter 1 hook. | No |
| `dice-pool.yaml` `components[gear]` text (none for `attribute_alone`, the calling rule's item for a roll called by attribute) | Yes, matches section 1.3 step 1. | No |
| `stress-changes.yaml` `graduation-exam-ends` | Yes. It is Stress-only and follows section 1.6's pattern. | No |
| `bonus-dice-sources.yaml` `help.applies_to` (any roll whose `roll_exceptions` row excludes Help) | Same result as section 1.8 for both rows. | No change in effect. Logged as an erratum under OQ-03. |
| `action-catalog.yaml` `gear_requirement`: an item worn to 0 counts as not had | Extends section 1.3 step 6 ("adds no dice") only for Chapter 2's `requires_gear`. | No |
| Exam Cover limit (a Cadet who has already rolled cannot Cover) | No. Chapter 1 allows any Cadet who qualifies to Help. | **Yes, without a hook** (finding 3) |
| Exam Stress Response costs Merit instead of the Chapter 3 table | No. OQ-05 step 2 has no replacement hook. | **Yes, without a hook** (finding 3) |

## Judgment on the provisional decisions

- **OQ-19 (h):** sound.
  - The figures reproduce: key attribute 4 / 5 / 6 at 63.48 / 34.43 / 2.10%, identical for any Specialty strategy. 18 points for 93.74%, 19 for 6.26%. Non-key mean 2.735. Overflow fires for 3.7% of Cadets.
  - It is consistent with ADR-0006, ADR-0011, and the glossary Specialty.
  - Its cost in derived values is finding 4.
- **OQ-20 (a), (d), (g):** sound.
  - 0% of soldiers are forced into a dormant level, and (g) is used by 2.84%. The both-capped fallback never fired.
  - The curriculum lists hold 4, 6, and 4 usable Talents, enough for (g) always to have a pick.
- **OQ-21 (a), (l), (d), (f), (i):** sound.
  - Top 10 is 6.26% and Merit 5 or more 15.55%.
  - *Known skew* now names Strength correctly.
  - The Top 10 rate holds only without coordinated Exam play (finding 1).
- **OQ-22 (a), (d), (g), (k), (p):**
  - Sound as structure, and (k) and (p) fixed both round 2 exploits. The reference-policy parity reproduces.
  - The "any number of Cadets" parity claim is unsound, because Help, order, and Covering are group choices that were never measured (finding 1).
  - The Cover limit needs a Chapter 1 hook (finding 3), and Trials 1 and 2 barely pay (finding 6).
- **OQ-23 (a), (i), (e), (j), (l), (m), (p):** sound.
  - The provenance clause closes the passive triggers. Three edges are in finding 5.
  - The glossary note ("an act of the soldier's or the soldier's own position") is the right wording.
- **OQ-24 (a):** sound. See finding 4 for the Specialty effect.
- **OQ-25:** sound.
- **OQ-26 (a):** sound.
- **OQ-27 (e):** sound as a closed procedure. Its reach is finding 2.
- **OQ-28 (a), (c), (e), (k):** sound.
  - Requiring 1 success removes the zero-success Opening. The lone follow-up strike is correctly handed to Chapter 5.
  - The simulator list (nine Talents) is complete.
- **OQ-29 (j), (d), (g), (h), (m):** sound. The table-load note is logged.
- **OQ-30 (a), (d), (g):** sound. The roll-off wording is closed. Fix 1 of finding 1 would remove Trial order from `group_choices`.
- **OQ-31 (a), (d), (j), (i):** sound. The Origin step now matches the event step and always yields 5 levels.
- **OQ-32 (a), (d):** sound for the starting Squad. Later characters are finding 7.
- **OQ-33 (a):** sound. With OQ-20 (g), "no Cadet is ever forced" is now true in simulation.
- **OQ-34 (a):** sound.
- **OQ-35:** correctly typed as an Unresolved Major.
  - Short of an ADR change, (c) remains the choice most consistent with ADR-0003 item 8.
  - Its scope note should name the Phase 1 gear handover (finding 2), which does not wait for Operation Frames.
- **OQ-36 (d):** sound.
  - The hook is closed. It keeps the Chase's turn structure out of this chapter, and it follows OQ-08 (f).
  - The count of ten turn-test Drives checks out.

## ADR-0003 checklist

- **Item 3:** met. All 12 Drives are "When I ..." triggers with a closed test and target.
- **Item 7:** met. Wide Awareness and Shoulder the Load keep a stated Position requirement, and the Exam states who can Help and Cover and what Help spends.
- **Item 8:** met. See "The GM plays no part in the Lifepath", section 2.9's *No rulings*, and "The GM never directs a Squadmate". Every shared choice has the D6 roll-off.
- **Item 9:** open under OQ-35 (finding 2).

No rule in the chapter rests on GM discretion.

## Glossary and term use

- **`_Avoid_` terms.** A search of the chapter and all eleven character YAML files found "blades" twice and "group" once (finding 8). "Anchor" appears only for ODM anchors, and "healing" only in a Critical Injury's healing time, the glossary's own usage.
- **Terms with no entry.** "Campaign start year" is logged (OQ-32). "Airborne" and "mounted" are left to Chapter 4.
- **Pending glossary notes, correctly logged rather than applied:**
  - Drive (OQ-23, OQ-36).
  - Resolve rounding (OQ-24).
  - Graduation Exam and Training Year (OQ-22).
  - Opening's extra Relentless source (OQ-28).
  - Help outside a Titan Engagement (OQ-08).
- **Specialty.** The glossary's "grants bonuses but never exclusive permission" holds. The swap is not a permission, and section 2.6 says so.

## Fidelity and engine fit

- **The Drives read as the 104th.** Shield the Walls as the decoy, Stay Beside Them as Mikasa, Full Belly as the soldier who dodges to live. Draw Attention is a better fit for Shield the Walls than holding Attention was.
- **Squadmates** who can do every job and pay their own gas still fit canon's squads.
- **The always-swap rule** makes a Specialty the soldier's defining strength, which is Year Zero Engine friendly: one key attribute, one number to tune against. Its narrative cost is finding 4.
- **Two fidelity gaps** matter at the table: two of the three Trials barely count (finding 6), and a soldier cannot hand a comrade gas or blades (finding 2).

## Scope check: Phase 2 content

No XP spending, Downtime procedure, Rank rule, Requisition, Expedition, Chase, Canon Clock, or Operation Frame rule is drafted.

- OQ-36's hook leaves every out-of-Engagement decision to the rule that creates the scene.
- The dormant entries still leave their attributes open.
- The mid-campaign join is still a labelled stopgap.

## Keep

- The always-swap Graduation: one closed distribution, identical for every Specialty strategy, with no free points.
- The Drive provenance clause, and Shield the Walls on Draw Attention.
- OQ-20 (g): the curriculum fallback for a dormant-only choice, which leaves the tables alone and still lets a player take a dormant Talent for the story.
- The Exam with no squad bonus and a priced Cover. It needs only its group choices closed.
- OQ-36's closed hook in place of a Chase structure decided here.
- `gear_requirement` counting a worn or Jammed item as not had, with Make Do reading the same test.
- The Mira example, still correct at every step.

## Appendix: simulation model

Scripts are in the scratchpad (`r3/common.py`, `integrity.py`, `life.py`, `exam.py`, `exam_variants.py`, `fixes.py`) and are not committed. YAML was converted to JSON with Ruby and read unmodified.

**Lifepath (200k Cadets):**

- Start year 850, rows rolled uniformly.
- Overflow goes to the highest other attribute below 5.
- The Talent pick prefers one that names a used entry and can gain a level, then applies `if_both_capped` and `if_only_dormant_can_gain`.
- Graduation applies `creation.graduation` in order: swap whenever another attribute is higher, then floor, then Top 10. The same Cadet was graduated into every Specialty for the derived-value table.

**Graduation Exam:**

- Cadets are built by the Lifepath model, with Year 1 and Year 2 performance rolls.
- Trial 1 is Agility plus Wirework; Trial 2 is Strength plus Clean Cut. Both use exam issue Gear Dice 1, and Push wear lowers ratings for later Trials.
- In the squad field exercise, each Cadet takes the entry with the largest pool. Hunter's Eye and Sure Hands apply.
- A Stress Response costs 1 Merit on that Trial. Stress carries between Trials. Top 10 is Merit 6 or more, compared with the same Cadet's Year 3 performance roll.
- The reference policy follows OQ-22.
- The aimed policy is described in finding 1:
  - Cadets exactly 1 short roll the squad field exercise first, weakest first, and receive every Help, up to 3 each.
  - Only Cadets who cannot reach 6, or who are safe by 2 or more, Cover.
  - Only Cadets 2 or 3 short Push Trials 1 and 2, at exactly 2 successes.
  - A Cadet exactly at 6 never Pushes.

**Dice:**

- A Push re-rolls base and Stress Dice not showing 6, and adds a Stress Die unless Covered. Gear Dice are never re-rolled.
- A Push is forbidden after any Stress Die shows 1.

| Quantity | Value |
|---|---|
| Key attribute 4 / 5 / 6, highest-attribute or random Specialty | 63.48 / 34.43 / 2.10% (both) |
| Total points 18 / 19; non-key mean | 93.74 / 6.26%; 2.735 |
| Agility 2 / 3 / 4 when not key | 38.9 / 48.9 / 11.9% |
| Top 10; Merit 5 or more | 6.26%; 15.55% |
| Merit before the Exam: 3 / 4 / 5 / 6 | 18.5 / 12.0 / 5.5 / 1.9% |
| Forced into a dormant level; `if_only_dormant_can_gain` used; overflow | 0%; 2.84%; 3.69% |
| Health / Resolve means: Strength or Agility key; Instinct or Empathy key; Wits or Perception key | 3.83 / 2.98; 2.98 / 3.83; 2.97 / 2.98 |
| Exam, reference policy, 1 / 2 / 4 / 6 Cadets: Merit; Top 10 with / without | 0.45; 5.75 / 6.15% · 0.53; 6.36 / 6.33% · 0.52; 6.21 / 6.30% · 0.53; 6.31 / 6.22% |
| Exam, never Push, 4 Cadets: Merit; Top 10 with / without | 0.33; 4.38 / 6.26% |
| Exam, aimed policy, 1 / 2 / 4 / 6 Cadets: Top 10 with / without | 6.07 / 6.20 · 6.53 / 6.17 · 7.55 / 6.23 · 7.46 / 6.25% |
| Exam, aimed policy, variant run, 4 / 6 Cadets | 7.61 / 6.26 · 7.75 / 6.26% |
| Trial 1 and 2 rolls that pay Merit: reference / aimed | 7.2% / 3.7 to 4.0% |
| Squad field exercise Merit at Stress 0 against 1 (base 4 + gear 0; 5 + 1; 6 + 1; 7 + 1) | 0.281 / 0.125; 0.474 / 0.296; 0.572 / 0.381; 0.658 / 0.451 |
| Fix 1 (rolled order, cycle Help), 2 / 4 / 6 Cadets | 6.44 / 6.24 · 6.48 / 6.20 · 6.40 / 6.23% |
| Fix 2 (at most 1 helper per roll), 2 / 4 / 6 Cadets | 6.71 / 6.30 · 6.58 / 6.26 · 6.62 / 6.22% |
| Aldo's squad field exercise (7 dice, needs 2, Covered Push when short) against Empathy 3 performance roll | 68.2% against 42.1% |
