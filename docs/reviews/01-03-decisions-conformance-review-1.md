# Chapters 1 to 3: decisions conformance review, round 1

Reviewed: `docs/rules/01-core-rules.md`, `docs/rules/02-character-creation.md`, `docs/rules/03-harm-and-mind.md`, every YAML file in `data/core/`, `data/character/`, `data/harm/`, and `data/mind/`, against `docs/rules/DECISIONS-2026-09-14.md` (OQ-01 to OQ-57, the Round-3 notes, and the owner decision on Health boxes), the amended ADR-0003, ADR-0005, ADR-0014, and ADR-0015, the other ADRs, `CONTEXT.md`, `docs/rules/OPEN-QUESTIONS.md`, and the round-3 reviews (`01-core-rules-review-3.md`, `02-character-creation-review-3.md` and `-codex.md`, `03-harm-and-mind-review-3.md` and `-codex.md`). The Codex conformance review was not read.

Odds below come from throwaway Python scripts run in the session scratchpad, outside the repository, reading the real YAML (100k to 200k trials; models in the appendix).

Severity: **Critical** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable. **Major** is an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem. **Minor** is wording, clarity, or a small gap.

## Verdict

The drafter applied the decisions thoroughly. Every chapter impact listed under *Chapter impacts, Chapters 1 to 3* is present in prose and YAML, no `PROVISIONAL` marker or `provisional:` tag survives, and Health boxes reach every place Health, Down, Critical Injuries, Treat Injury, revive, healing, the sheet, and the Squadmate stat block appear. Every Health-boxes figure the chapters quote reproduces from the real tables. All 13 round-3 Majors are resolved.

No finding is Critical. Three Majors remain, each created or exposed by applying a decision:

1. OQ-17 fixed round-start spent state only for whole turns. Chapter 1's "Both refresh at the start of each round" sentence therefore wipes out a next action that Hesitate or Falter spent in advance. That is the Fear result the OQ-50 Grab probe counts as costing a rescue.
2. The rebuilt Exam gives Help to exactly one Cadet per roll. Chapter 1 lets only a soldier who qualifies to Help a roll Cover it. Chapter 2's "any Cadet who has not yet rolled can Cover" now contradicts Chapter 1, and the two readings move Merit by about 0.12 per Cadet.
3. Health boxes make Health decide how many injuries a soldier carries before Down (mean 2.65 at Health 3 against 3.25 at Health 4). ADR-0014's reference Rookie does not fix Strength or Agility, so its Health, and with it the PC death target, is undefined.

Nine Minor findings cover wording, data derivation, and stale text.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 1, Core Rules | 0 | 1 | 2 |
| Chapter 2, Character Creation | 0 | 1 | 4 |
| Chapter 3, Harm and Mind | 0 | 1 | 3 |
| **Total** | **0** | **3** | **9** |

Findings that touch an ADR or the glossary are counted under the chapter they most affect, and their locations name every file involved.

## Conformance checks that passed

**Chapter 1.**
- 1.3 step 1 quotes amended ADR-0003 item 9 (OQ-35).
- 1.3 step 7 and the section's last sentence use `roll_exceptions` and list the Death Roll and the performance roll (OQ-03).
- 1.5 step 2 has the other-resolution hook (OQ-05).
- The four eligibility lists end with the forbid-hook line (OQ-18).
- 1.8 reads "an unspent action this round" (OQ-17).
- 1.9 has the round-start spent state, the shared hook, the lifted turn-spending sentence, the OQ-09 and OQ-16 wording, and the mounted-horse dodge (OQ-25).
- 1.10 lists what it settles about Squadmates.
- YAML: `bonus-dice-sources.yaml` `help.condition` and `condition_in_titan_engagement`, `stress-changes.yaml` `cover.condition`, and the `dice-pool.yaml` Push hook comment are all applied. `roll_exceptions` is unchanged.

**Chapter 2.**
- 2.1 and 2.2 carry the row of boxes and once-per-Titan-Engagement uses beside the Talent.
- 2.3 has *Before the Lifepath* with the Campaign Year and the Exam vote, and removes Trial order from shared choices.
- 2.4 is rewritten to OQ-22: Trials 1 and 2 at 2 successes with no Push, Help, or Cover; Trial 3 at 3 with cycle Help and the `forbids: [cover]` state.
- 2.5 has the Pay It Forward and own-state edges (OQ-23).
- 2.7 has Sure Seat and eight simulator checks. The file holds 40 Talents, 20 dice and 20 rule, as stated.
- 2.8 has the dodge gear line.
- 2.9 cites amended item 9 and the Chapter 4 rows.
- 2.10 has promotion timing, the OQ-38 contest with retirees removed first, and `sheet-fields.yaml` kept on promotion.
- YAML: `lifepath.yaml` step 0, `group_choices`, `record_on_sheet`; `origins.yaml` `campaign_year_min`; `graduation-exam.yaml` `use`, `roll_order_within_a_trial`, `trials[*]`; `enlistment.yaml` `drive_rules` and `the-walls-are-a-cage`; `talents.yaml`, `specialties.yaml`, and `training-years.yaml` (Sure Seat at the Year 3 "From saddle to trees" event); `action-catalog.yaml` `dodge.gear`; `squadmates.yaml` `health_lost`, the include row, the line-18 comment, and `promotion.*`. No "Saddle Dodge" survives outside the decision register.

**Chapter 3.**
- 3.1 is rebuilt to the row of boxes: current Health, rules 4 to 7, and three restore routes.
- 3.2 treats to give the box back and carries the worsening sentence.
- 3.3 has two Down conditions, the ending routes, the forbid row, and the Down turn's spent action.
- 3.5 has the revive patient test, the care-window patient scope, and one aftermath roll per patient and per treater.
- 3.6 restores damage only on a day passing, and healing gives the box back.
- 3.7 has both rescue structures and the six-cell probe.
- 3.9 states the OQ-17 answer and matches "What no row does" to the hook.
- 3.12 has the acceptance test with Hesitate kept, and Grief after the Fear Rolls.
- 3.14 has the Grief timing.
- 3.16 has the step 5, 7, and 9 wording.
- The sheet paragraph and the worked example use boxes (Mila's single aftermath roll; Hale's care-window roll).
- YAML: `health.yaml`, `down.yaml` (the `three-untreated` condition is gone), `critical-injuries.yaml` `held_injuries.treated`, `treat-injury.yaml`, `healing.yaml`, `sheet-fields.yaml` `derived`, `effect-types.yaml`, `fear-rolls.yaml` (`forbids: [reaction]` on Unguarded, Breaking Point, and Shattered, plus `limits.timing`), `grief.yaml` `applies_after`, `engagement-end.yaml`, and `death-rolls.yaml` all match.

**Glossary and ADRs.**
- All 18 glossary edits are in `CONTEXT.md`.
- ADR-0003 has items 12 and 13 in its amendment.
- ADR-0005, ADR-0014, and ADR-0015 carry their amendments verbatim.
- No chapter uses a glossary `_Avoid_` term in the new text.

**Figures reproduced from the real tables** (100k trials):

| Figure | Chapters quote | Simulation |
|---|---|---|
| First Critical Injury puts the soldier Down | 10.6% | 10.7% |
| First Critical Injury is lethal or instant death | 15.3% | 15.4% |
| Mean untreated injuries before Down, Health 2 / 3 / 4 / 5 | 1.89 / 2.65 / 3.25 / 3.70 | 1.89 / 2.65 / 3.25 / 3.71 |
| Down by the third injury, Health 4 / 5 | 39.6% / 39.5% | 39.8% / 39.4% |
| Down by the fourth injury, Health 5 | 55.5% | 55.2% |
| Crushing injury Down, 0 / 1 / 2 torso injuries held | 16.7 / 41.7 / 72.2% | 16.6 / 41.8 / 72.3% |
| Ordinary torso injury Down, 0 / 1 / 2 held | 11.1 / 30.6 / 47.2% | 11.1 / 30.7 / 47.5% |

The Death Roll figures (42.1 / 51.8 / 59.8% alive with 3 / 4 / 5 dice) and the Fear Roll action-loss figures (2, 3, and 4 in 6) are exact.

---

## Findings

### 1. Major. The round-start refresh wipes out a next action spent in advance by Hesitate or Falter

**Location:**
- Chapter 1, section 1.9 *Turns and actions*: "Both refresh at the start of each round, unless that round's turn was spent in advance", and *Spent at the start of the round*.
- Chapter 1, section 1.8 Help test ("A turn spent in advance or by a result begins its round with its action spent").
- Chapter 3, section 3.9 *Next action spent*, and the Chapter 3 introduction ("It changes no rule in either chapter").
- `data/harm/effect-types.yaml` `spend-next-action`; `data/mind/fear-rolls.yaml` rows `hesitate` and `falter`; `data/core/bonus-dice-sources.yaml` `help.condition_in_titan_engagement`.

**Problem:** OQ-17 (c) fixed the spent state at the start of a round, but Chapter 1 wrote it for whole turns only: "A turn spent in advance by a Reaction, or spent by a result, begins its round with its move and action already spent." The refresh sentence has the same whole-turn exception.

Chapter 3's `spend-next-action` spends "the action of the soldier's earliest turn, starting with the current round's, whose action is unspent". When the soldier has already acted this round, that is next round's action, spent in advance while its move stays unspent. Nothing in Chapter 1 says a lone action spent in advance begins its round spent, and the refresh sentence says it refreshes. Chapter 3 says it changes no Chapter 1 rule, and section 1.1 bars a GM ruling. On the literal text, Hesitate and Falter taken after the witness's own card has passed do nothing.

This is the common case:
- At Resolve 3, Hesitate or Falter is 2 results in 6 at witness Stress 1, 2, and 3 alike.
- A Grab happens after the witness has acted in roughly half of rounds.
- The next round is exactly the Grab's rescue window, because the countdown runs in the victim's turns.
- The OQ-50 probe in section 3.7 assumes "Fear Roll results spend rescue actions". If the literal reading holds, the six-cell band is being measured against a rule the text does not give.

Chapter 3's Down rule avoids the problem only because it speaks at the moment a turn begins.

**Scenario:** Private Dov (Stress 2, Resolve 3) has already struck a Body Part this round. A later card Grabs Mila. Dov's `comrade-grabbed` Fear Roll totals 3, Hesitate. His current action is spent, so Hesitate spends next round's action. Next round begins. Dov's player reads section 1.9 and says his move and action "refresh", because his turn was not "spent in advance". Dov strikes the hand, or Helps Bea's strike ("an unspent action this round"). Mila's player reads `effect-types.yaml` and says the action stays spent. Both readings are literal, and no one may rule.

**Fix options:**
1. In section 1.9, extend the round-start state to parts of a turn: "A turn, or a move or action, spent in advance by a Reaction or a result begins its round already spent. Both refresh at the start of each round except what was spent in advance." Mirror it in the 1.8 Help line and `bonus-dice-sources.yaml`.
2. Add to `effect-types.yaml` `spend-next-action.reading`: "An action spent in a later round begins that round spent (Chapter 1, section 1.9)", and give Chapter 1 the matching sentence, so Chapter 3 still changes no Chapter 1 rule.
3. If the literal reading is the one wanted, limit `spend-next-action` to the current round's action and re-run the OQ-50 six-cell probe with the cheaper Hesitate and Falter.

### 2. Major. Exam Covering contradicts Chapter 1 now that cycle Help gives each roll exactly one qualifying helper

**Location:**
- Chapter 2, section 2.4 *The three Trials*, squad field exercise *Covering*, and its design note (the 6.48% against 6.20% Top 10 figure).
- `data/character/graduation-exam.yaml` `trials[squad-field-exercise].help`, `.cover`, `.rolled_state`.
- Chapter 1, section 1.5 *Who can Cover* ("Outside a Titan Engagement, they qualify to Help that roll under the rule that called for it").
- `data/core/stress-changes.yaml` `cover.condition`.
- Chapter 2 introduction ("It changes no Chapter 1 rule").

**Problem:** Before the decisions, every Cadet qualified to Help every Trial 3 roll, so Chapter 1's Cover test let any Cadet Cover. The rolled state then narrowed that to Cadets who had not yet rolled. OQ-22 made Help fixed: "The Cadet who rolls next in the order Helps the current roller ... No other Help is possible in this Trial." Under Chapter 1, only that one Cadet now qualifies to Help a roll, so only that Cadet can Cover its Push.

Chapter 2 still says "Only a Cadet who has not yet made their own roll in this Trial can Cover a Push, whether or not they have Helped." That reads as a grant to every unrolled Cadet, and the OQ-18 hook can only forbid, not grant. The "whether or not they have Helped" clause is empty under Chapter 1's reading, because the one qualifying Cadet has never yet Helped.

The two readings differ materially. With a sponge policy (the last roller Covers every earlier Push), the other Cadets gain about 0.12 Merit each, which is the Top 10 lever Chapter 2 review 3 measured. The design note's 6.48% parity figure was measured with the old, any-Cadet Cover eligibility.

**Scenario:** Four Cadets roll order Aldous, Bea, Cato, Dov. Aldous is short on the squad field exercise and Pushes. Dov, who cannot reach Top 10, offers to Cover so Aldous adds no Stress Die. Chapter 2 allows it, since Dov has not rolled. Chapter 1, and a Foundry import of `stress-changes.yaml`, refuses it, since only Bea qualifies to Help Aldous's roll.

Probe (6 base dice including the cycle Help, 1 Gear Die, need 3, Push when short, every Push Covered when a Coverer exists):

| Cadets | Cover reading | Mean Merit | Last roller | Other Cadets |
|---|---|---|---|---|
| 4 | only the qualifying helper (Chapter 1) | 0.174 | 0.080 | 0.205 |
| 4 | any unrolled Cadet, last roller sponges (Chapter 2) | 0.205 | -0.140 | 0.320 |
| 6 | only the qualifying helper | 0.170 | 0.092 | 0.186 |
| 6 | any unrolled Cadet, last roller sponges | 0.225 | -0.248 | 0.320 |

**Fix options:**
1. Make every Cadet taking the Exam qualify to Help each Trial 3 roll while only the cycle helper may spend Help on it. Chapter 1's Cover test then gives Chapter 2's intended set with no override. Re-run the Top 10 parity target with the sponge policy.
2. Keep Chapter 1 literal. Write "Only the Cadet who Helps a roll can Cover its Push", drop the rolled state and "whether or not they have Helped", and re-run parity.
3. Forbid Covering in all three Trials, which removes the lever. Re-run parity, since a Push at Stress 0 then always risks a Merit-costing Stress Response.

### 3. Major. Health boxes make the reference Rookie's Health decisive, and ADR-0014 does not define it

**Location:**
- Chapter 3, section 3.2 design note *Injuries before Down*, and section 3.7 *Earlier injuries*.
- Chapter 2, section 2.10 (the templates "That is ADR-0014's Rookie build") and the section 2.2 OQ-19 design note.
- `docs/adr/0014-numbers-tuned-to-design-targets.md` (reference builds and the OQ-19 amendment).
- `DECISIONS-2026-09-14.md` *Consistency check*, "Reference builds" bullet.
- `data/character/squadmates.yaml` `templates`.

**Problem:** Under the old three-injury rule every build went Down at the same point, so the reference builds never needed Strength or Agility. Under Health boxes, Health spreads the Down point: mean untreated injuries before Down are 2.65 at Health 3 and 3.25 at Health 4. The decisions' consistency check asserts that the Rookie has Health 4 ("Strength 4 and Agility 3"), but the amended ADR-0014 gives the Rookie only "key attribute 4, other attributes 3, one at 2".

That fits a Slayer or Brawler. A Medic, Tactician, Leader, Hunter, or Engineer Rookie has Health 3, and 5 of the 9 Squadmate templates, which Chapter 2 calls the Rookie, have Health 3. The Veteran and Levi-grade Health (4 and 5) likewise assume a Strength key.

ADR-0014's default Squad is "all Rookies". Its Expedition targets ("about 1 PC Critical Injury", "a PC dies every 3 to 4 missions") and the Grab case for a victim already carrying injuries now depend on a Health the ADR leaves open. A Down soldier also cannot dodge, so the later attacks that land depend on it too. OQ-42's first lever (moving arm and leg 11 and 12 results to `turn` limits) would be tuned against whichever Health the simulator author happens to pick.

**Scenario:** The ADR-0014 simulator author builds the default Squad from the Squadmate templates, four at Health 4 and five at Health 3, drawing six of them. A second author uses the decisions' "Rookie with Strength 4 and Agility 3" for all six. Their "PC dies every N missions" results differ, and neither contradicts ADR-0014, so Chapter 5's Severity and Grab tuning has no fixed baseline.

**Fix options:**
1. Amend ADR-0014 to give each reference build its Strength and Agility, and so its Health. For example, the Rookie at Strength 3 and Agility 3 (Health 3), consistent with the Agility 3 dodge and the majority of templates. Report Health 2, 4, and 5 beside it.
2. State that the default Squad's soldiers use the nine Squadmate templates in equal shares, and that targets are medians over that mix.
3. Have the Chapter 3 design note name the Health every quoted Expedition and Grab figure assumes, and correct the consistency-check bullet.

### 4. Minor. The current-Health derivation counts healed entries, and `down` is stored with no invariant

**Location:** Chapter 3, section 3.17 *The sheet*; `data/harm/sheet-fields.yaml` `derived.current_health` and `fields.critical_injuries`; `data/character/lifepath.yaml` and `squadmates.yaml` field `down`.

**Problem:** Two data gaps.
- `untreated_critical_injuries` is "the number of entries in critical_injuries with treated false". No row says a Critical Injury leaves `critical_injuries` when it heals. `healed_permanent_injuries` is a separate list, which implies removal, but only for permanent rows, and `healing.yaml` says only that a healed injury "stops being held". An import that keeps a healed, never-treated entry with `treated: false` keeps crossing off its box, contradicting rule 3.
- OQ-55 made current Health derived so the row cannot drift, but `down` stays a stored boolean. Down is fully derivable: current Health 0, or any held untreated `down: until_treated` row.

**Scenario:** A Twisted Ankle heals untreated after 2 days in Downtime. The Foundry sheet keeps the entry with `treated: false`, so the soldier's Health 3 row still shows one box crossed off. The next Titan attack takes them to current 1 rather than 2, and a later one puts them Down a box early.

**Fix options:**
1. Define `untreated_critical_injuries` as held entries with `treated: false`, and state that a healed entry leaves `critical_injuries` (moving to `healed_permanent_injuries` if its row has permanent effects).
2. Make `down` a derived value in `sheet-fields.yaml` with its formula, or add the invariant that ties it to current Health and Down rows.

### 5. Minor. Section 3.7's "treated or not" figures are wrong for untreated earlier injuries at Health 3 or less

**Location:** Chapter 3, section 3.7, *Earlier injuries*.

**Problem:** "A torso Critical Injury still held from earlier, treated or not, raises the lone chance to about 74% with one and about 88% with two." Under Health boxes this holds only for treated injuries, or at Health 4 and above. Two untreated torso injuries at Health 3 make the crushing injury the third box, so the victim is Down and dies every time in the lone model. The next sentence says Health matters, but the first still states a figure for "treated or not".

**Scenario:** Chapter 5's drafter takes 88% as the lone-victim death rate for a Health 3 Squadmate carrying two untreated torso injuries, when the model gives 100%.

**Fix options:**
1. Replace "treated or not" with "treated, or untreated at Health 4 or more", and add the Health 3 case (100%).
2. Split the bullet into treated and untreated earlier injuries.

### 6. Minor. Sure Seat promises a "hard ride" that its once-per-Titan-Engagement limit can never reach

**Location:** Chapter 2, section 2.7 design note (OQ-28); `data/character/talents.yaml` `sure-seat` (`description`, `names`, `limit`).

**Problem:** The description reads "A seat that keeps the horse sound when a dodge or a hard ride is Pushed." "Hard Ride" is the glossary's Expedition Pace, which happens outside a Titan Engagement, and the Talent names `ride`, which the Chase rules will call. Its `limit: once_per_titan_engagement` means "never outside one" unless a later procedure extends it (section 2.7, OQ-36). The description only summarizes, but it points players at a use the rule forbids. It also lowercases a glossary term.

**Scenario:** A Rider takes Sure Seat at the "From saddle to trees" event, expecting to spare the horse on Hard Ride Legs. On an Expedition it never triggers.

**Fix options:**
1. Reword the description: "... when a dodge, a Ride, or Break Attention made with the horse is Pushed in a Titan Engagement."
2. Record in the OQ-28 note that the Expedition and Chase rules decide whether Sure Seat's limit extends to them.

### 7. Minor. "A Pushed dodge made with the horse wears the horse" overstates wear

**Location:** Chapter 1, section 1.5 *Pushing and gas* ("it wears the horse and leaves the Gas Roll at two dice"); Chapter 2, section 2.8 dodge bullet; ADR-0015 amendment.

**Problem:** A Pushed roll wears its item only for Gear Dice showing 1 when the roll is final (section 1.5, *What 1s mean*). On 1 Gear Die that is 1 Push in 6. "Leaves the Gas Roll at two dice" is also untrue if the same soldier Pushed an ODM Gear roll earlier that round. The sentence means only that the dodge itself does not raise the Gas Roll.

**Scenario:** A mounted Rookie declines to Push a short dodge because the rules say the Push "wears the horse". A Foundry macro built from the sentence deducts horse wear on every mounted Pushed dodge.

**Fix options:**
1. Write "its Gear Dice showing 1 wear the horse, not ODM Gear, and it does not by itself make the Gas Roll three dice", in both chapters.
2. Ask the decider to align the ADR-0015 amendment's wording.

### 8. Minor. The Reaction glossary entry, Chapter 2, and the Catalog still place a Reaction "on an enemy's turn", but Titans take no turns

**Location:** `CONTEXT.md` Reaction (edited under OQ-09); Chapter 2, section 2.8 field table (`reaction`); `data/character/action-catalog.yaml` kind comment.

**Problem:** ADR-0001 and the Behavior Table entry say Titans act from Behavior Tables instead of taking turns, and Chapter 1 section 1.9 correctly places a Reaction "outside the soldier's own turn", when a card resolves a behavior. The glossary edit under OQ-09 rewrote the rest of the entry but kept "made during an enemy's turn".

**Scenario:** A reader asks when a Titan's "turn" starts so they can dodge. The only rule is card resolution (section 1.9), which the glossary wording obscures.

**Fix options:**
1. Glossary, Chapter 2 table, and YAML comment: "made when an enemy acts against the soldier, outside the soldier's own turn".

### 9. Minor. ADR-0003's checklist still shows the superseded item 9 in its body

**Location:** `docs/adr/0003-rules-expressible-as-data.md` item 9 ("use the closest catalog action, or the attribute alone") and `## Amended`; Chapter 2, section 2.9 and Chapter 1, section 1.3 cite "item 9, as amended".

**Problem:** The drafting checklist is what reviewers and drafters apply item by item. Its body still lists the rule OQ-35 replaced, and items 12 and 13 appear only in the amendment paragraph. ADR-0001's amendment removed superseded wording from its body; ADR-0003's did not.

**Scenario:** A Chapter 4 drafter reads item 9 in the list, lets passing a canister use "the closest catalog action" (Change Canister), and writes a row the amended rule forbids.

**Fix options:**
1. Mark item 9 in the body "(superseded, see Amended)" and append items 12 and 13 to the numbered list.
2. Rewrite the checklist body to the amended text and keep the amendment paragraph as the change log.

### 10. Minor. Chapters 1 and 2 do not record ADR-0003 item 12's per-chapter act check

**Location:** Chapter 1 (no act check); Chapter 2, section 2.9 (lists Chapter 4's rows, not its own); compare Chapter 3, section 3.17 *Every act in this chapter has a Catalog entry*.

**Problem:** Amended item 12 requires that "every chapter checks that each consequential act in its scope has a tracked value and an entry". Chapter 3 records such a check. Chapter 1 does not, and its acts include things with no entry or tracked value: Push, declaring Bonus Dice, and spending Openings. They are parts of a roll rather than acts, but nothing says so. Chapter 2 does not state that the Lifepath has no field acts.

**Scenario:** A conformance reviewer for Chapter 4 asks whether Push needs a tracked value, since Drives name `push` as an act. No chapter answers.

**Fix options:**
1. Add a short block to Chapter 1 mapping Help to `help` / `roll-dice-add`, Cover to `cover` / `stress-raise`, and the dodge to `dodge` / `behavior-avoid`. State that a Push, declaring Bonus Dice, and spending Openings are steps of a roll, not acts.
2. Add one sentence to Chapter 2 that the Lifepath has no act a soldier changes a tracked value with.

### 11. Minor. Chapter 3 pointers and Health wording

**Location:** Chapter 3 and its YAML; `CONTEXT.md`.
- `data/harm/health.yaml` `restoring.day-passes.order` cites `data/harm/treat-injury.yaml` for the day's order, which lives in `data/harm/healing.yaml` `each_day`.
- The `health.yaml` header still says "reaching 0 Health", where Down is at 0 current Health.
- Section 3.3 *Ending Down* says treating or healing "gives back its box", without the section 3.1 exception for injuries beyond Health.
- Glossary Down reads "whether from damage or from untreated Critical Injuries crossing off every Health box", which omits "or both" (ADR-0005 has it). Glossary Health reads "Each untreated Critical Injury crosses off one box", which omits the cap at Health.

**Problem:** Small mismatches that a reader or importer can follow to the wrong place, or read as exclusive.

**Scenario:** A Health 3 soldier with one damage mark and two crossed-off boxes is at 0. A player reads the glossary's "damage or ... Critical Injuries" as exclusive and argues the soldier is not Down.

**Fix options:**
1. Point `day-passes.order` at `healing.yaml` `each_day`, and change the header to "reaching 0 current Health".
2. Add "if it crossed one off" to the 3.3 bullet.
3. Ask the decider to add "or both" to Down, and "up to Health" to Health, in `CONTEXT.md`.

### 12. Minor. Chapter 2 wording and YAML bookkeeping

**Location:** Chapter 2 and `data/character/`.
- The section 2.2 design note says a Health 2 soldier "is Down on their second untreated Critical Injury". Chapter 3 correctly says "by the second", since 10.7% go Down on the first through a Down row.
- Section 2.10 *Which rules apply* says a Squadmate "suffers Health loss". The Health-boxes term is damage.
- `decided:` tags lag the decisions: `graduation-exam.yaml` lists only OQ-22 (it implements OQ-18 and OQ-37); `lifepath.yaml` omits OQ-22 and OQ-55; `squadmates.yaml` omits OQ-38 and OQ-55.
- `graduation-exam.yaml` Trial 3 `merit` uses `{result: failure/success}` while Trials 1 and 2 use `successes_min` / `successes_max`, so an importer needs two schemas.

**Problem:** Wording drift and incomplete provenance tags in files the Foundry system imports.

**Scenario:** An importer keyed on `successes_min` reads no Merit band for the squad field exercise and awards 0 Merit on every success.

**Fix options:**
1. "Down by their second"; "suffers damage".
2. Complete the `decided:` lists and give Trial 3's `merit` the `successes_min` form (0 to 2 for 0 Merit, 3 or more for 1 Merit).

---

## Round-3 Majors: status after the decisions

| Review | Finding | Status | Where |
|---|---|---|---|
| Ch1 review 3 | M1. The Help test disagrees with "no move and no action" for a turn spent in advance | Resolved | OQ-17: section 1.8 "an unspent action this round"; section 1.9 round-start state; `bonus-dice-sources.yaml`. The same state is incomplete for action-only spends (finding 1). |
| Ch1 review 3 | M2. No forbid hook for Help and Covering | Resolved | OQ-18: hook in section 1.9 and every eligibility list; Down, Fear rows, and the Exam state use it |
| Ch2 review 3 (Opus) | M1. Coordinated Help, order, and Covering raise Top 10 | Resolved as decided | OQ-22 and OQ-37: vote before the Lifepath, rolled order, cycle Help. Cover eligibility now conflicts with Chapter 1 (finding 2). |
| Ch2 review 3 (Opus) | M2. An action changing no tracked value has no effect (OQ-35) | Resolved | ADR-0003 item 9 amended; sections 1.3 and 2.9; Chapter 4 owns `pass-item` and mounting |
| Ch2 review 3 (Codex) | M1. OQ-35 contradicts ADR-0003 | Resolved | As above |
| Ch2 review 3 (Codex) | M2. Exam calibration omits targeted Help | Resolved | Cycle Help; simulator target in section 2.4 |
| Ch2 review 3 (Codex) | M3. Promotion cannot resolve several replacements at once | Resolved | OQ-38 (c) in section 2.10 and `promotion.contested` |
| Ch3 review 3 (Opus) | M1. Aftermath rolls stack across every nearby soldier | Resolved | OQ-57: one roll per patient and per treater; sections 3.5 and 3.16, `treat-injury.yaml` |
| Ch3 review 3 (Opus) | M2. Section 3.7 points Chapter 5 at a regime that breaks the band | Resolved | OQ-50: both rescue structures and the six-cell table in section 3.7 |
| Ch3 review 3 (Opus) | M3. Step 9 cannot finish two contested promotions | Resolved | OQ-38 and OQ-54: step 9 names the full batch and the contest |
| Ch3 review 3 (Codex) | M1. Step 9 contested promotions and batch timing | Resolved | As above; OQ-31 timing in section 2.10 |
| Ch3 review 3 (Codex) | M2. Care windows limit rollers but not patients | Resolved | OQ-44: patient scope sentence in section 3.5 and `treat-injury.yaml` |
| Ch3 review 3 (Codex) | M3. Outside-Engagement Grief is unordered against its Fear Rolls | Resolved | OQ-52: `applies_after` in section 3.14, `grief.yaml`, `fear-rolls.yaml` |

---

## Appendix: models

**Health boxes (`hb2.py`, 100k trials).**
- Parses `data/harm/critical-injuries.yaml`.
- Injury Location by D6 (1 to 2 arm, 3 to 4 leg, 5 torso, 6 head).
- 2D6 plus 2 per injury held at that location.
- `repeat_row` for a permanent row already gained.
- Every injury untreated.
- A soldier is Down when a row has `down: until_treated` or the untreated count reaches Health. An instant-death row ends the count (0.1 to 0.2% of runs at Health 4 and 5).
- Crushing rows apply `cannot_be_lethal` with the table's `non_lethal_cap`.

**Exam Cover (`exam_cover.py`, 200k Cadets per cell).**
- Squad field exercise only.
- Every Cadet starts at Stress 0, since Trials 1 and 2 cannot be Pushed.
- Pool: 5 base dice plus 1 cycle Help die (none for a lone Cadet), 1 Gear Die, and Stress Dice equal to current Stress; needs 3.
- A Stress Die 1 on the first roll forbids the Push and costs 1 Merit.
- Push when short: re-roll base and Stress Dice not showing 6; add a Stress Die unless Covered; a Stress Die 1 afterwards costs 1 Merit.
- A Covered Push gives the Coverer 1 Stress, carried to their own roll.
- Reading "helper": the next Cadet in order Covers every roll but the last.
- Reading "unrolled": the last roller Covers every earlier Push.
- Policies are deliberately simple (always Push when short, always accept Cover). The comparison between readings is the point, not the absolute Merit.

**Fear Roll frequency (exact).** D6 + Stress - Resolve at Resolve 3. Hesitate (3) and Falter (4) are 2 faces in 6 at Stress 1, 2, and 3.
