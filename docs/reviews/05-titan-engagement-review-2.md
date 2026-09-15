# Chapter 5, Titan Engagement: review round 2

Reviewed:

- `docs/rules/05-titan-engagement.md`.
- Every file in `data/engagement/` (15 files).
- The probe scripts in `tools/probes/chapter-05/`.
- OQ-74 to OQ-90 and OQ-95 to OQ-97 in `docs/rules/OPEN-QUESTIONS.md`.
- The OQ-90 edits in Chapters 1 to 4 and their data (`data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`).

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended.
- `docs/rules/DECISIONS-2026-09-14.md`, including batch 2b, the Health boxes rule, and *Constraints on the undrafted Phase 1 chapters* for Chapter 5.
- Both round 1 reviews: `05-titan-engagement-review-1.md` (Opus) and `05-titan-engagement-review-1-codex.md` (Codex).

I did not read the parallel Codex round 2 review.

Odds come from Python scripts in the session scratchpad, which are not committed. The appendix gives the models. Every figure uses ADR-0014's reference builds as the batch 2b body states them: the Rookie with Stress 1, ODM Gear and horse 2, and no Talent dice on the dodge, Fly, Break Attention, Ride, or Read.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**0 Critical, 4 Major, 9 Minor** open this round.

The fix pass is thorough. Every round 1 Critical from both reviews is closed or reduced to a narrower case. The committed probes reproduce, and the earlier-chapter edits agree with every decided entry I checked.

The four Majors:

1. **Turn debt still makes declining a Grab dodge the better play** (finding 1). OQ-85's rule (d) fixes the common case. A victim whose first counted turn is already spent in advance still loses both Break Free actions by dodging. That is 9% of dodged Grabs in the reference fight.
2. **Decoys can still switch a Titan off** (finding 2). Bolting horses ended the loop, but every soldier still carries a horse and a cloak. Two Squadmates who send their horses and then throw their cloaks leave the Titan resolving 0.41 cards a round instead of 0.84. Critical Injuries per fight fall from 0.66 to 0.25.
3. **Large Titans as set rarely die in time** (finding 3). 36.6% of fights have no kill within 12 rounds. The interim setup table deals a Large Focus Titan 1 time in 6.
4. **No sheet field records a soldier's Position per Focus Titan** (finding 4). Section 5.3 and OQ-97's main round-time aid depend on one.

## Round 1 findings

### Opus review 1

| # | Round 1 | Status | Evidence |
|---|---|---|---|
| 1 | Critical: declining to dodge a Grab is better | **Partly resolved** | Rule (d) (`grab.yaml`, `countdown.first_turn_action`). I reproduce a lone victim at 70.0% after a failed dodge and 73.1% with no dodge. A victim with first-turn debt still gains by declining: finding 1. |
| 2 | Critical: the riderless horse is free and repeatable | **Resolved** | The horse bolts and leaves (`attention.yaml`, `riderless-horse`), and no decoy can be laid over one that holds. A bounded version of the problem remains: finding 2. |
| 3 | Major: the prepared-Squad kill does not reproduce | **Resolved** | The model is committed as `fight.py`. With 6,000 fights I get median round 3, 62.8% by round 3, 73.6% by round 4, and 0.73 Critical Injuries per fight (the chapter: 3, 62.4%, 73.1%, 0.71). OQ-78's simulator case logs the gap with my round 1 model. |
| 4 | Major: "comrades close" read as one comrade | **Logged (OQ-95)** | The entry exists and gives the two-comrade, three-comrade, and full-fight figures. See the OQ-95 judgment below. |
| 5 | Major: the order of move and action | **Resolved** | `round.yaml` (`turn_order`) allows either order and forbids splitting the move. Chapter 1 section 1.9 points to it. |
| 6 | Major: the lone Rookie misses 10% | **Logged (OQ-79)** | A Simulator target, with the Stress 0 reading withdrawn. I reproduce 13.1% at Stress 1 and 47.1% for the Levi-grade soldier at Stress 2. |
| 7 | Major: Read facts are public, and the tracker disagrees | **Resolved** | Counts and filled segments are public in `titan-harm.yaml`, `read.yaml`, and `round.yaml` alike. Only the Next Behavior, and an Abnormal's values, are hidden. A small leak remains: finding 9. |
| 8 | Major: the ending kills Down soldiers while returners could come back | **Resolved** | `engagement-flow.yaml` (`ending`): a returner and a one-round wait. |
| 9 | Major: retreat forced moves condemn fallen comrades | **Resolved** | `background-titans.yaml` (`retreat.moves`) options 3 and 4. A new edge: finding 12. |
| 10 | Major: Squad Tactic declarers | **Resolved** | Each tactic has `declared_by` and `when`, and `several_declarers` names the roll-off. A timing slip: finding 13. |

### Codex review 1

| # | Round 1 | Status | Evidence |
|---|---|---|---|
| 1 | Critical: the Jam test fails a legal support pattern | **Resolved** (reading logged as OQ-96) | Worst legal pattern, table behaviors: 32.7% in the chapter. I get 32.4% Pushing toward the first card and 32.9% Pushing toward the highest Severity (60,000 fights). With landed harm applied, the same cell is 17.0%, because Grabs and Down end the dodging. The reading is therefore conservative, though its margin is under 1 point. |
| 2 | Critical: the builds changed and reports are missing | **Resolved** | Stress 1 start, structured builds in `tuning.yaml` (`builds`), Grab Health reports at Health 2 to 6, template rows, and the Flier dodge. |
| 3 | Critical: a Grabbed soldier's death leaves the Titan inert | **Resolved** | `grab.yaml` (`grabbed_soldier_dies`, `while_holding.applies`). |
| 4 | Major: the lone Rookie at Stress 1 | **Logged (OQ-79)** | As Opus 6. |
| 5 | Major: refusing a revealed Grab dodge | **Partly resolved** | As Opus 1. Finding 1. |
| 6 | Major: the tracker reveals Read facts | **Resolved** | As Opus 7. |
| 7 | Major: grip Toughness breaks the count invariant | **Resolved** | The count is 0 on hold and on release. The escapes row gives Intact 2 and Wounded 1. |
| 8 | Major: Open's Blind Spot has no anchor | **Resolved** | The step exists at Open only while the Titan is grounded (`anchor-ratings.yaml`, `grounded_titan.open_rating`). |
| 9 | Major: Squad Tactic declaration | **Resolved** | As Opus 10. |
| 10 | Major: dangling Read pointers | **Resolved** | `read.yaml` names the `read-from-distant` and `call-it` rows in `bonus-dice-sources.yaml`. All 52 YAML files under `data/` parse. |
| 11 | Major: whether the reader benefits from Call It | **Resolved** | The prose, `read.yaml` (`call_it.reader`), and the `call-it` row all say the reader gains nothing. |
| 12 | Major: round time | **Logged (OQ-97)** | The entry exists, adds aids, and owes a timed paper test. One of its aids has no data home: finding 4. |

## Checks that passed

- **GM discretion.** None. The *No rulings* list holds. `gm_choices: none` stands in every procedure file, and every choice belongs to a player, a table row, or a roll-off.
- **Glossary.** No `_Avoid_` term appears except "warning" for Call It (finding 6).
- **Data.** All 52 YAML files parse. The prose points to blocks rather than copying rows. The prose tables in sections 5.9 and 5.12 agree with `grab.yaml` and `squad-tactics.yaml`.
- **Decisions-file constraints on Chapter 5.** All met:
  - The Grabbed row carries `forbids: [help, cover, reaction]`, and a Grabbed soldier can Push.
  - The lift and the devour are procedure steps with no Severity.
  - ADR-0015's victim-turn countdown and Toughness 1 hand are kept.
  - Reach and strike penalties are in data, all six OQ-50 cells pass, and Hesitate is unchanged.
  - The crush crosses a Health box.
  - Witnesses, ending, leaving, the Down move, and starting placement for Drives are defined.
  - Severity is tuned against the no-Talent Rookie dodge at Stress 1, and Medium Severity is varied (1, 2, 2 and 2, 3, 3).
  - Turn debt is modelled.
  - The Jam test passes under OQ-96's reading.
  - Two-Titan Positions and recorded Positions are settled, and so are soldiers who left.
  - Own Openings are answered (OQ-83).
- **Earlier-chapter edits (OQ-90).** Checked against the decided entries OQ-16, OQ-17, OQ-18, OQ-23, OQ-45, OQ-50, OQ-56, OQ-60, OQ-61, OQ-62, OQ-65, and OQ-68, with no contradiction:
  - Chapter 1 sections 1.7 to 1.9 and `bonus-dice-sources.yaml` (`opening` condition, `read-from-distant`, `call-it`);
  - `action-catalog.yaml` (the two options, the two tracked values, and the requirement pointers);
  - `down.yaml`, `fear-rolls.yaml`, `engagement-end.yaml`, and `health.yaml`;
  - `horses.yaml` (a decoy horse leaves and is the soldier's own again when the fight ends);
  - `carrying.yaml` (the Grabbed `ends` row, and soldiers who left count as one Position);
  - `odm-gear.yaml`, `falls.yaml`, `sheet-fields.yaml` (a horse recorded as left), and Chapters 2 to 4's pointers.
- **Phase 2.** Expeditions, Chases, Operation Frames, Shifters, Squad Points, Rank, and Research Points are forward references only. The interim setup table and the two starting Squad Tactics are logged stopgaps. The one borderline item is finding 8.
- **Example.** The dice arithmetic, the struck-first narrowing, the fallback to Thrash, the turn Mila's dodge spends, the Opening spends, and the mid-round Gas Rolls all check.

**Figures that reproduce** (mine, then the chapter's):

| Figure | Mine | Chapter |
|---|---|---|
| Lone Rookie, Nape Depth 4, Stress 0, 1, 2 (120,000 trials each) | 9.9, 13.1, 15.9% | 10.0, 13.1, 15.9% |
| Lone Levi-grade, Stress 1 and 2 | 47.2, 47.1% | 47.3, 47.4% |
| Prepared Squad, Medium: median, by round 3, Critical Injuries per fight | 3, 62.8%, 0.73 | 3, 62.4%, 0.71 |
| With 2 helper Squadmates | 2, 69.7%, 0.65 | 2, 69.2%, 0.65 |
| Large: median, by round 3, no kill in 12, deaths per fight | 5, 34.4%, 36.6%, 0.43 | 5, 34.1%, 36.5%, 0.42 |
| Large at Nape Depth 4 | 3, 61.4%, 13.8%, 0.20 | 3, 60.8%, 13.2%, 0.19 |
| Lone Grab: failed dodge, no dodge | 70.0, 73.1% | 69.9, 73.1% |
| One comrade, Stress 2, Grief 0 | 33.6% | 33.4% |
| Jam, two Large Titans, Covered, no Help | 32.4 to 32.9% | 32.7% |

## Findings

### 1. Major. A victim carrying turn debt still does better by declining to dodge a Grab

**Location:** `grab.yaml` (`countdown.first_turn_action`), section 5.9 *The countdown*, and OQ-85's "One edge remains" note. Chapter 1 section 1.9 *Which turn it spends*.

**Problem:**

- Rule (d) makes the Grab spend the action of the victim's first counted turn, so dodging and not dodging cost the same when the first counted turn is wholly unspent.
- A dodge, though, spends the earliest turn whose move and action are both unspent. If the first counted turn is already spent in advance, the dodge skips it and spends the second counted turn.
- The victim then reaches the devour with no Break Free at all. A victim who declines keeps the second counted turn's action.
- This is the normal state of an Attention holder. Section 5.3 says turn debt is "how a soldier holding Attention runs short of turns".
- OQ-85 says the edge "needs two separate results in one round". It needs only one earlier Reaction whose turn has not yet come up.

Figures, on the committed Grab model with the real torso rows (60,000 trials per cell). The victim's turn this round was spent in advance, and their card comes after the Titan's:

| Case | Failed dodge | Did not dodge | Per Grab card, always dodging |
|---|---|---|---|
| Lone, no debt (for comparison) | 70.0% | 73.1% | 55.5% |
| Lone, first-turn debt | 100% | 73.2% | 79.3% |
| One comrade at Stress 2, first-turn debt | 59.7% | 43.2% | 47.3% |

The per-card column uses the 20.7% Rookie dodge at Severity 3. In the reference full fight, 49 of 537 dodged Grabs (9.1%) landed on a victim with first-turn debt. The debt is on the victim's own sheet, so an informed player can see when to decline.

**Scenario:** Round 2. Private Anna Roth holds In Reach and Attention. Her card (4) comes before the Titan's (12), and she dodges a Swat, which spends her round 3 turn.

In round 3 the Titan's card is 6 and Anna's is 15. The card announces Grab, Severity 3.

- **If she dodges and fails:** the dodge cannot spend round 3's turn, so it spends round 4's. Card 15 is her first counted turn, and she is lifted. Round 4 is her second counted turn, already spent, so she is devoured with no attempt.
- **If she declines:** round 4's turn is free for a Break Free at a 2-die penalty.

The player who reads the countdown declines.

**Fix options:**

1. **Move the dodge's cost onto the first counted turn.** When a failed dodge against a Grab card spent a turn other than the victim's first counted turn, that turn is restored and the first counted turn counts as spent instead. A successful dodge spends as Chapter 1 states. The common case and its figures are unchanged.
2. **Uncount the dodge's turn.** A turn spent by a Reaction against the Grab card does not count toward the countdown, and Break Free needs 3 successes. Round 1's Opus figures for this variant were a 67.7% lone victim and one-comrade cells from 28.0% to 44.3%. Re-measure.
3. **At minimum,** correct OQ-85's edge note to "first counted turn already spent in advance", and add the debt rows to `tuning.yaml` (`grab`).

### 2. Major. Horses and cloaks still let a Squad cancel most of a Titan's cards

**Location:** `attention.yaml` (`break_attention`, `decoys`), section 5.6 *Break Attention and decoys*, OQ-81's "each has a different price", and `squad-tactics.yaml` (`hook-and-cut`).

**Problem:**

- Every soldier has a horse and a cloak. A six-soldier Squad therefore brings 12 decoys to a fight whose Medium Titan plays about 3.5 cards before it dies.
- Each successful decoy cancels one Titan card outright: it resolves nothing and spends the Next Behavior. The "no decoy over a decoy" rule stops stacking within one card, not a decoy on each card.
- A Rookie decoyer succeeds about 83% of the time (Perception 3, Gear Dice 2, needs 1). Decoyers can act at any card position, because a decoy holds until the Titan's next card, even into the next round.
- The horse's price does not bite. Leaving needs no horse, the horse is the soldier's own again when the fight ends, and a Distant Squadmate rarely needs a mounted dodge.
- Hook and Cut turns each decoy into a free Nape strike as well.

The committed full-fight model, extended with a "screen" role (6,000 fights, Medium, Wooded): two Squadmates send their horses from Distant, then fly to Blind Spot and throw their cloaks.

| Squadmates | Titan cards resolved per round | Critical Injuries per fight | Grabs per fight | Deaths per fight | Killed by round 3 |
|---|---|---|---|---|---|
| Helpers (the chapter's row) | 0.84 | 0.66 | 0.20 | 0.006 | 68.0% |
| Horses that bolt (the chapter's row) | 0.48 | 0.31 | 0.09 | 0.004 | 71.5% |
| Horses, then cloaks | 0.41 | 0.25 | 0.08 | 0.002 | 73.5% |

- **Harm.** Critical Injuries fall 62% and Grabs 62%, while the kill gets faster.
- **Squadmates.** The best use of a Squadmate is to switch the Titan off.
- **ADR-0014.** The Expedition Critical Injury and death targets are measured per Titan Engagement, so they inherit the cut.
- **Fidelity.** Canon decoys (flares, riderless horses, a cloak in the face) buy a moment, not a Titan that stands idle for most of a fight.

**Scenario:** Round 1. Squadmates Ilse and Karl stay mounted at Distant.

1. Ilse sends her horse, and the Titan's card resolves nothing.
2. Round 2: Karl sends his, and Mila uses Hook and Cut on it.
3. Rounds 3 and 4: Ilse and Karl, now at Blind Spot, throw their cloaks.

The Titan acts once in four rounds, and both horses are back in the stable after the fight.

**Fix options:**

1. **Titans are not fooled twice running.** A Titan whose last card was spent by a decoy ignores decoys until one of its cards resolves a behavior. This caps decoys at every other card and leaves ADR-0010's lone escape intact.
2. **Tie the decoy to the holder.** Break Attention needs 1 success when taken by the soldier holding Attention or a comrade at their Position, and 2 otherwise. The lone soldier's figure (OQ-79) does not move.
3. **A decoy's card is not idle.** It resolves Thrash against the nearest candidate instead of nothing. Whichever option is taken, report the screen row in `tuning.yaml` (`prepared_squad_kill.squads`).

### 3. Major. Large Titans as set rarely die within a playable number of rounds

**Location:** `size-classes.yaml` (`large`), OQ-78, section 5.13 *A prepared Squad kills a Medium Titan in about 3 rounds* (the Large bullet), and `engagement-setup.yaml` (`size_class`, result 6).

**Problem:**

- At Nape Depth 5, a prepared Squad of 4 Rookies has a median kill in round 5, and 36.6% of fights have no kill in 12 rounds. Each fight costs 2.37 Critical Injuries and 0.43 deaths (my runs; the chapter gives 36.5% and 0.42).
- The interim setup table, which sets every Titan Engagement until Mission Briefs exist, makes the Focus Titan Large on a 6. Each Background Titan is Large 1 time in 6 as well.
- At the 12 to 20 minutes per round OQ-29 targets, a 12-round fight is 2.4 to 4 hours.
- OQ-78 keeps Nape Depth 5 because "no Chapter 5 target measures Large". But the chapter's own data show the value fails play, and a measured alternative exists.

Other Large levers (6,000 fights each):

| Large case | Median | By round 3 | No kill in 12 | Critical Injuries | Deaths |
|---|---|---|---|---|---|
| As set (Nape Depth 5, Severity 2, 3, 4, Regeneration 4) | 5 | 34.4% | 36.6% | 2.37 | 0.43 |
| Severity 2, 3, 3 | 5 | 35.5% | 35.4% | 2.18 | 0.36 |
| Regeneration 5 | 5 | 34.3% | 34.6% | 2.31 | 0.41 |
| Nape Depth 4 | 3 | 61.4% | 13.8% | 1.41 | 0.20 |
| Nape Depth 4, Severity 2, 3, 3 | 3 | 62.5% | 12.8% | 1.25 | 0.15 |

Only Nape Depth moves the kill.

**Scenario:** A table rolls the interim setup: Wooded, then a 6 for Size Class. Four Rookies fight a Large Titan. By round 8 two soldiers are Down, the Titan has regenerated both legs twice, and the session ends with it alive. The only exit is for everyone to leave. Nothing in the rules told the table the fight was unwinnable, and the table meets it once every six engagements.

**Fix options:**

1. **Set Large Nape Depth to 4**, keeping Large's difference in Severity, Regeneration, arm Toughness, and the fall band. Record the Nape Depth 4 row as the starting value.
2. **Keep Nape Depth 5, but take Large off the interim table's Focus Titan roll** (results 1 to 2 Small, 3 to 6 Medium) until the simulator sets Large.
3. **Ask the decider for a Large target in ADR-0014,** such as a median kill by round 4, so the value is tuned rather than inherited.

### 4. Major. No sheet or tracker field records a soldier's Position relative to each Focus Titan

**Location:**

- Section 5.3 *What the GM tracks*: "Players track everything on their own sheets: Positions per Focus Titan..."; and "The Squad sheet gives each soldier's Position in one column per Focus Titan".
- `round.yaml` (`gm_tracker.players_track`, `titan_card_checklist`).
- `data/gear/sheet-fields.yaml` (`squad_sheet_row`) and `data/harm/sheet-fields.yaml`.
- OQ-90 and OQ-97.

**Problem:**

- `squad_sheet_row` has columns for name, ODM Gear, gas, Blade Sets, horse, kits, load, and state. None records the soldier's own Position.
- `data/harm/sheet-fields.yaml` has none, and no Chapter 2 sheet field does.
- `players_track` says Positions go "on the sheets Chapters 2 to 4 define", which do not define one. OQ-90 lists no sheet change for it.
- Position is the most-read value in a round: the ladder, every strike's requirement, Help, Covering, swaps, `holder-and-position` targets, and the retreat all compare it. With two Focus Titans each soldier holds two, and the close rule changes them.
- OQ-97's main aid, reading the ladder "straight off" the Squad sheet, has nothing to read. Under ADR-0012 the Foundry import has no field to bind.

**Scenario:** Titan B enters at the end of round 4.

1. The GM evaluates B's ladder "from the Squad sheet column per label" and finds no column.
2. On A's next card, Jonas's player says he flew to Blind Spot relative to A last turn, and Mila's player remembers On Body. The Grab's target turns on the answer.
3. No record decides it, and the GM may not rule.

**Fix options:**

1. **Add a `positions` column to `squad_sheet_row`,** one entry per Focus Titan label (such as `A In Reach, B Distant`, or `Left`), and a matching player-sheet field. Record both as a new OQ-90 item.
2. **Put each soldier's Positions on the GM tracker** as one row per soldier, and correct section 5.3, `players_track`, and `titan_card_checklist` to read from it.

### 5. Minor. A grounded Titan's reach and the lifted hand's reach disagree

**Location:** `titan-harm.yaml` (`body_part_strikes.requirements`, `grounded.effects`), `grab.yaml` (`escapes`, `strike-the-holding-arm.reach_after_lift`), the section 5.9 escapes table, OQ-85, and `squad-tactics.yaml` (`clear-the-hand`).

**Problem:**

- A Body Part strike needs one of the part's Positions "or one of the Positions grounded or `grab.yaml` (escapes) allows". Grounding allows In Reach for every Body Part.
- So after the lift, a grounded Titan's holding arm can be struck from In Reach. That contradicts the table's "From On Body or Blind Spot only" and OQ-85's "the reach narrows".
- On a grounded Titan, Clear the Hand's condition (a strike "that only this tactic's effect allows") can never be met.
- Most Grabs in the reference fight land on grounded Titans.
- The odds barely move. With no narrowing after the lift, the one-comrade cells are 28.7, 33.5, 39.5, 34.3, 40.0, and 44.9% (60,000 trials each), against 28.7 to 45.1%.

**Scenario:** Anna is lifted by a grounded Titan. Jonas at In Reach says grounding lets him strike the hand, and Ilse cites section 5.9's table.

**Fix options:**

1. **In `strike-the-holding-arm`, state that `reach_after_lift` applies even while the Titan is grounded.**
2. **Or add In Reach to `reach_after_lift` while grounded,** and correct the table, OQ-85, and Clear the Hand's condition.

### 6. Minor. Call It is described with its `_Avoid_` term

**Location:** Section 5.8 *Call It* ("It is a warning to comrades"), and `read.yaml` (`call_it.reader`: "A warning shouted to comrades").

**Problem:** `CONTEXT.md` lists "warning" under Call It's `_Avoid_`. Both sentences were added by the fix pass.

**Scenario:** A later chapter copies "a Warning" as a name for Call It.

**Fix options:**

1. **Write "It helps comrades only" in the prose,** and "Calling It helps comrades; a soldier who Reads for themselves already knows what comes" in `read.yaml`.

### 7. Minor. A flare can bring in a Titan in the middle of the Break Attention that spends it

**Location:** `attention.yaml` (`flare.background_titans`, `spends_when_declared`), `background-titans.yaml` (`ticks.flare`, `full_clock`), and section 5.6.

**Problem:**

- The flare is spent when Break Attention is declared, and each flare spent fills every Background clock "at once".
- A clock one segment short therefore fills before the roll. A Titan enters, or a retreat begins, and the `second-focus-titan` Fear Rolls are made.
- The declarer's Hesitate or Frozen row now spends "the next action". No rule says whether that is the Break Attention being taken, or whether the roll still happens.

**Scenario:** Background 1 sits at 3 of 4. Mila declares Break Attention with a flare against A, and B enters. Mila's Fear Roll is Hesitate. Is her Break Attention cancelled?

**Fix options:**

1. **Fill the clocks after the Break Attention is resolved,** while keeping the flare spent when declared.

### 8. Minor. The Abnormal test list carries rows no Phase 1 rule reads yet

**Location:** `attention.yaml` (`tests`: `mounted`, `airborne`, `carrying-a-comrade`, `most-harmed`, `down`).

**Problem:**

- The standard ladder uses five tests, and the other five are for Abnormal ladders Chapter 6 has not written.
- Chapter 6 has one Abnormal. OQ-67 removed a Squad Supply kind that no Phase 1 rule read, as Phase 2 content on a live file.
- By the same test, any row Chapter 6's Abnormal does not use is Phase 2 content.

**Scenario:** A Foundry importer builds five ladder tests that no stat block names.

**Fix options:**

1. **Keep only the tests Chapter 6's Abnormal names,** added when Chapter 6 is drafted.
2. **Or record the list under OQ-81** as a deliberate format provision.

### 9. Minor. An Abnormal's hidden values show through public fields

**Location:** `round.yaml` (`gm_tracker`: "Regeneration clock, filled segments of its length"), `titan-harm.yaml` (`states.public`), and `read.yaml` (`facts`, `hidden_until_read`).

**Problem:**

- For an Abnormal, the Regeneration clock's length is a Read fact, but the tracker writes filled segments "of its length".
- Counts are public, and each count runs to Toughness minus 1. A count of 2 shows Toughness is at least 3, and a state change shows it exactly.

**Scenario:** The tracker reads `Regen 1/5` for an Abnormal, and no player spends a success on its clock.

**Fix options:**

1. **For an Abnormal, the tracker shows filled segments only** until the length is revealed.
2. **State in `read.yaml`** that counts and state changes reveal Toughness over time, so the Toughness fact is worth a success only early.

### 10. Minor. OQ-79 and OQ-95 are labelled PROVISIONAL, but their register type is Simulator target

**Location:** The chapter introduction ("PROVISIONAL decisions ... OQ-74 to OQ-90 and OQ-95 to OQ-97"), and section 5.13's `PROVISIONAL (OQ-79)` and `PROVISIONAL (OQ-95)` blocks. OPEN-QUESTIONS OQ-79 and OQ-95 (`Type: Simulator target`).

**Problem:** The labels disagree, so a reader counting open PROVISIONAL decisions for Done under `PROGRESS.md` gets two different lists.

**Fix options:**

1. **Retitle both blocks** as `Simulator target (OQ-79)` and `Simulator target (OQ-95)`, and adjust the introduction's sentence.

### 11. Minor. The Behavior Table format lets one entry span two tiers

**Location:** `titan-format.yaml` (`behavior_table.rows`: "An entry may cover more than one result", and `escalation`).

**Problem:** Tiers are fixed by result pairs, but nothing forbids an entry with `results: [2, 3]`. Such an entry would be terrorize by its first result and control by its second, and the tier rules would disagree on what it may inflict.

**Scenario:** Chapter 6 writes Lunge as results 2 and 3 with a non-lethal Critical Injury.

**Fix options:**

1. **Add to `rows`:** "An entry's results lie within one tier's pair."

### 12. Minor. "Stay with a fallen comrade" lets a retreat be ignored indefinitely

**Location:** `background-titans.yaml` (`retreat.moves`, option 4) and section 5.10.

**Problem:**

- Option 4 allows a move that changes nothing while the soldier shares a Down or Grabbed comrade's Position.
- A Down comrade who is never lifted keeps every soldier at their Position fighting both Focus Titans for as long as they like.
- No clock fills during a retreat, so the retreat ends the Background threat without forcing anyone out.

**Scenario:** Hans is Down at In Reach. Felix and Greta stand beside him for six rounds, cutting A's legs, and never lift him.

**Fix options:**

1. **Allow option 4 only on a turn whose action is Lift Comrade, Treat Injury, Pry Loose, or a strike on a holding arm.**
2. **Or allow option 4 for a Grabbed comrade only,** since a Down one can be lifted.

### 13. Minor. Hook and Cut acts "before any other rule", including Break Attention's own success steps

**Location:** `squad-tactics.yaml` (`hook-and-cut.when`) and `attention.yaml` (`break_attention.on_success`).

**Problem:** "Before any other rule acts" puts the Nape strike before the decoy's hold is recorded, before a Grabbed soldier is freed, and before a lifted victim's fall. If the strike kills the Titan first, the release happens by `titan_death` and the victim's Position ends by that rule, not by `release.not_lifted`.

**Scenario:** Karl's Break Attention needing 2 succeeds against a Titan holding lifted Anna. Mila declares Hook and Cut and kills it. Does Anna fall and land with no Position, or get freed first and land In Reach?

**Fix options:**

1. **Change `when` to** "as soon as every `on_success` step of the Break Attention is resolved, before any other rule acts".

## GM bookkeeping

Per-round means from the committed full-fight model, extended with counters (6,000 fights, 4 Rookie player characters, one Medium Titan, Wooded; mean fight 3.9 rounds):

| Item | Per round |
|---|---|
| GM tracker writes (after the deal, each Titan card, each strike or Break Attention, end steps) | 5.2 (6.2 with two decoy Squadmates) |
| Ladder evaluations (up to five rungs, struck-first, three tie-breaks) | 1.1 |
| Hidden Next Behavior rolls with move-up | 1.1 |
| Strike and Break Attention pools | 2.3 (3.4 with the decoy screen) |
| Dodges | 0.5 |
| Witness Fear Rolls | 0.17 (0.29 with 2 Squadmates) |
| Gas Rolls | about 2 to 3 |

**Live GM values per Focus Titan:** about 20, as round 1 counted:

- the cards;
- the holder;
- the Next and previous behaviors, and any Call It;
- five states and five counts;
- Openings with creators;
- the clock;
- the Grab fields;
- flags by soldier.

Add one line per Background Titan and six fields on the Engagement line.

**Time estimate** for 4 player characters and 2 Squadmates against one Tempo 1 Titan:

- Four player character turns at 1.5 to 2 minutes, and two Squadmate turns at about 1 minute.
- One Titan card at 1.5 to 2 minutes, end steps at 1 minute, and Wings and swaps at 1 to 2 minutes.
- **12 to 17 minutes for a typical round,** likely inside the band.
- **A Grab round:** 16 to 22 minutes (five witness Fear Rolls, the crush, the countdown).
- **A two-Focus-Titan round:** 22 to 30 minutes. Unlikely to fit.

OQ-97 logs the risk and owes the timed test, so this is not a new finding. Its column aid does not exist until finding 4 is fixed.

## Provisional decisions and logged targets

- **OQ-74 (Anchor Ratings, steps):** Sound. The Open fix removes the unanchored Blind Spot.
- **OQ-75 (two Titans, placement, records):** Sound.
- **OQ-76 (leaving, the Down move, falls):** Sound.
- **OQ-77 (cards, swaps, Wings, turn order, end steps):** Sound. `turn_order` closes round 1's gap.
- **OQ-78 (Size Class values):** Medium is sound and reproduced (median 3, 62.8% by round 3). Small is plausible. Large is unsound as a play value (finding 3). Eyes and arm Toughness are unmeasured and logged.
- **OQ-79 (lone Rookie, Simulator target):** Correctly logged, and 13.1% is reproduced. The recommendation to read the bound as "about 10%" is the smallest honest change.
- **OQ-80 (Behavior Table procedure):** Sound, and `move_up_shares` warns Chapter 6. The format gap is finding 11.
- **OQ-81 (ladder, flags, decoys):** Ties, struck-first narrowing, the end-step tie-break skip, and no decoy over a decoy are sound. "Each decoy has a different price" still overstates the horse and cloak (finding 2).
- **OQ-82 (Body Parts, grounding, Regeneration):** Sound. The grounded reach conflict is finding 5.
- **OQ-83 (own Openings):** Sound. The glossary line is pending under OQ-90.
- **OQ-84 (Read, Call It):** Sound as revised, but unsimulated. Wording is finding 6.
- **OQ-85 (Grab):** Rule (d) is sound for the common case and reproduced (70.0%, 73.1%, 33.6%). Its edge note misdescribes the case that remains, and that case is not measured (finding 1).
- **OQ-86 (witnesses):** Sound.
- **OQ-87 (Background Titans, retreat, setup):** Sound. Findings 7 and 12 are small. The setup table's Large roll feeds finding 3.
- **OQ-88 (ending):** Sound. The returner wait closes round 1's finding.
- **OQ-89 (Squad Tactics):** Sound and closed. Hook and Cut's timing is finding 13. Paired with a decoy screen it amplifies finding 2, so the tactic simulator case should include the screen.
- **OQ-90 (earlier-chapter rows):** Applied, and consistent with every decided entry checked. Still pending: `CONTEXT.md` Opening, and the Relentless and Sharp Call descriptions that say "Chapter 5 states". It lacks the Position sheet field (finding 4).
- **OQ-95 ("comrades close", Simulator target):** Logged, and the figures are honest. Option (a)'s one-comrade reading sits badly with ADR-0014's own default, "Unless a target says otherwise, the Squad is 4 PCs plus 2 Squadmates". The Grab target names no Squad, and in that Squad the chapter's own full fight devours 2.0% of Grabs, not about 1 in 3. OQ-50's six cells are a necessary test ("counts as met only if"), not a sufficient one. The decider should take (c) and name the arrangement in the ADR.
- **OQ-96 (Jam acceptance reading):** Sound. The worst legal support pattern with table behaviors is the right reading, and it is conservative: applying landed harm lowers the worst cell to 17.0%. The margin at 32.7% is under 1 point, so any Severity or wear change must re-run it.
- **OQ-97 (round time):** Sound as an interim, with the timed test owed. Its main aid needs finding 4.

## Appendix: models

All scripts ran in the session scratchpad with `uv run --with pyyaml python`. None is committed.

- **`indep.py`** is an independent dice core written from the rules text, not from the probes.
  - **Dice:** d6 pools with 6 as a success. Push when short and no Stress Die shows 1, adding 1 Stress and a new Stress Die, or neither when Covered. Base and Stress Dice not showing 6 are re-rolled, and Gear Dice never are.
  - **Stress Responses:** one per roll on D6 + Stress − Resolve, with the lasting rows and their penalties, Hair Trigger, Flinch, Locked Up, and Botched. Gear Dice showing 1 on a Pushed roll wear the item.
  - **Lone Nape strike** (120,000 trials): Break Attention (Perception, ODM Gear, needs 1) up to three times, then a Nape strike with Talent dice needing Nape Depth 4. No own Openings, and a Jam blocks the strike.
  - **Jam test** (60,000 fights per cell): the reference Rookie holding the Attention of two Titans for three rounds. Behaviors come from the reference table with move-up and no repeats, and Shake Off at In Reach becomes Thrash. Help 0 or 1 is given on every dodge, with Covering on every Push or none. The Push goes toward the first card's Severity or the highest.
  - **Landed-harm Jam variant:** landed Roar and Lunge add Stress. Landed Swat and Bite add a Critical Injury, with dodge penalties on leg and torso rows. A landed Grab, or reaching Down, ends the dodging.
- **`grabvar.py`** is the committed `simple.py` Grab model (real torso rows, rule (d), Break Free needs 2 with a 2-die penalty once lifted, rescuers with Hamstringer 1 and witness Fear Rolls), with two options:
  - `debt`: the victim's card is after the Titan's, and their turn this round is already spent in advance.
  - `narrow=False`: rescuers strike the lifted hand from In Reach without a move.
  - 60,000 trials per cell.
- **`probe2.py`** subclasses the committed `fight.py` (6,000 fights per case, 12 processes):
  - **Counters:** tracker writes, ladder evaluations, Next Behavior rolls, Fear Rolls, and pools.
  - **Turn-debt record:** for each dodged Grab, whether the victim's first counted turn already had its move or action spent.
  - **Screen role:** a Squadmate sends its horse from Distant while no decoy holds, then flies to Blind Spot and throws its cloak with ODM Gear Dice, needing 1.
- **`fight.py` reruns** of the committed cases, plus Large at Severity 2, 3, 3, at Nape Depth 4 with Severity 2, 3, 3, and at Regeneration 5 (6,000 fights each).
