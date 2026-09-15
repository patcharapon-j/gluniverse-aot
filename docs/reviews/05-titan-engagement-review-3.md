# Chapter 5, Titan Engagement: review round 3

Reviewed:

- `docs/rules/05-titan-engagement.md`.
- Every file in `data/engagement/` (15 files).
- The probe scripts and case files in `tools/probes/chapter-05/`.
- OQ-74 to OQ-90 and OQ-95 to OQ-98 in `docs/rules/OPEN-QUESTIONS.md`.
- The round 2 fix edits outside Chapter 5: Chapter 1 section 1.9, Chapter 4 section 4.12 and its example rows, `data/gear/sheet-fields.yaml`, and `data/character/action-catalog.yaml` (`break-attention`).

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended.
- `docs/rules/DECISIONS-2026-09-14.md`, including batch 2b and *Constraints on the undrafted Phase 1 chapters*.
- Both round 2 reviews: `05-titan-engagement-review-2.md` (Opus) and `05-titan-engagement-review-2-codex.md` (Codex).

I did not read the parallel Codex round 3 review.

Odds come from two scripts in the session scratchpad, which are not committed. The appendix describes them. One is an independent dice core written from the rules text. The other extends the committed `fight.py` without changing it. Every figure uses ADR-0014's reference builds as batch 2b rewrote them: the Rookie at Stress 1, with ODM Gear and horse rated 2, and no Talent dice on the dodge, Fly, Break Attention, Ride, or Read.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**0 Critical, 1 Major, 6 Minor** open this round.

Every Major from both round 2 reviews is resolved or logged with a register entry that exists and describes it. Every figure the drafter quotes reproduces, most within half a point. The earlier-chapter edits agree with every decided entry I checked.

The one Major is the round 2 decoy problem in a new form. The fix makes Break Attention need 1 success only beside the Attention holder. A Squadmate simply rides or flies to the holder's Position first. Played that way, two Squadmates leave the Titan resolving 0.42 cards a round and cut Critical Injuries to 0.26 per fight. That is almost exactly the result under the rule the fix replaced (0.40 and 0.24). OQ-81 and section 5.13 report 0.54 and 0.35, measured on a screen that stays at Distant, so the decider is working from figures that understate the problem.

## Round 2 Majors

### Opus review 2

| # | Round 2 | Status | Evidence |
|---|---|---|---|
| 1 | Turn debt makes declining a Grab dodge better | **Resolved** | Rule (e) in `grab.yaml` (`countdown.failed_dodge`, `grab_lands.failed-dodge`) and the Chapter 1 section 1.9 pointer. My independent model: a lone victim with turn debt dies 69.9% after a failed dodge and 73.1% without one (70.1% and 73.0% in the chapter). Without the refund it is 100%. A narrow case remains on Tempo 2 Titans: Minor finding 2. |
| 2 | Horses and cloaks cancel most Titan cards | **Partly resolved, logged (OQ-81)** | `break_attention.needs_rule` now asks 2 successes away from the holder, and OQ-81's *Still open for the decider* names four options. The rule is sidestepped by standing at the holder's Position, and the logged figures miss that: Major finding 1. |
| 3 | Large at Nape Depth 5 rarely dies in time | **Resolved** | `size-classes.yaml` sets Large Nape Depth 4, and OQ-78 records why. With the committed `fight.py` on fresh seeds: median round 3, 61.0% by round 3, 13.4% with no kill in 12 rounds, 1.40 Critical Injuries and 0.193 deaths per fight (the chapter: 3, 60.5%, 13.3%, 1.41, 0.19). One wording slip: Minor finding 7. |
| 4 | No sheet field for a soldier's Positions | **Resolved** | `data/gear/sheet-fields.yaml` has a `positions` field with invariants and a `positions` column. Chapter 4 section 4.12 lists both, OQ-90 item 14 records them, and `round.yaml` reads from them. Two small gaps remain: Minor finding 4. |

### Codex review 2

| # | Round 2 | Status | Evidence |
|---|---|---|---|
| 1 | The lone Rookie breaks ADR-0014's 10% bound | **Logged (OQ-79)** | The entry exists, is typed Simulator target, and gives the figures and options. It says the only close is an ADR-0014 amendment or a decided lever. The chapter's introduction now says the target is not met. I reproduce 13.18% (240,000 trials). |
| 2 | OQ-95 does not settle "comrades close" | **Logged (OQ-95)** | The entry records both reviews' options, keeps (a) as current handling, and says why only the decider can close it. My one-comrade cells reproduce (28.6% to 45.1%). |
| 3 | Tuning rests on partial probes | **Partly resolved, logged (OQ-98)** | Every Squad Tactic alone and in pairs, plus Help on Break Free and Break Attention rescues, is now run and reported (`tuning.yaml`, `squad_tactics`). OQ-98 logs the rest of the full simulator as owed and recommends an ADR-0014 policy amendment. |
| 4 | No timed test for 12 to 20 minutes a round | **Logged (OQ-97)** | The entry exists with a playtest case for one and for two Focus Titans. My bookkeeping count is below; two-Focus-Titan rounds remain unlikely to fit. |

**Round 2 Minors.** All nine Opus Minors are closed:

- grounded reach to a holding arm;
- the `_Avoid_` word for Call It;
- flare timing;
- the Abnormal test list (kept on purpose under OQ-81);
- an Abnormal's clock on the tracker;
- the Simulator target labels;
- one tier per entry;
- staying in a retreat;
- Hook and Cut timing.

Codex Minor 5, the Opening glossary line, stays pending under OQ-90. Codex Minor 6, reproducibility, is closed: `tuning.yaml` (`probes.commands`) gives each command. My runs with `uv run --with pyyaml` reproduced the figures.

## Checks that passed

- **GM discretion.** None. The *No rulings* list holds, and every procedure file keeps `gm_choices: none`. Every choice added in round 2 (the needs rule, rule (e), the retreat's rescue action, the Positions column) is fixed by data or by a player.
- **Glossary.** No `_Avoid_` term is misused. A scan of the chapter and its 15 YAML files for every `_Avoid_` term found only compound names (Focus Titan, Background Titan, Giant Forest) and ADR-0014's "Levi-grade".
- **Data.** All 52 YAML files under `data/` parse. The prose tables in sections 5.9 and 5.12 match `grab.yaml` and `squad-tactics.yaml`.
- **Decisions-file constraints on Chapter 5.** All still met:
  - the Grabbed row forbids Help, Covering, and Reactions, and a Grabbed soldier can still Push;
  - the lift and the devour are procedure steps, and the countdown runs on the victim's turns;
  - the holding hand has Toughness 1, and the crush crosses a Health box;
  - reach and strike penalties are explicit in data, all six OQ-50 cells pass, and Hesitate is kept;
  - witnesses, the ending, leaving, the Down move, and starting placement for Drives are defined;
  - Severity is tuned against the no-Talent Rookie dodge at Stress 1, and turn debt is modelled;
  - the Jam test passes under OQ-96's reading;
  - two-Titan Positions, recorded Positions, and soldiers who left are settled;
  - own Openings are answered (OQ-83).
- **Earlier-chapter edits.** No contradiction with decided entries OQ-09, OQ-14, OQ-17, OQ-25, OQ-29, OQ-35, OQ-46, OQ-55, or OQ-61:
  - **Chapter 1 section 1.9's refund pointer.** It changes a turn after the Grab lands, not which turn a Reaction spends, so the glossary's Reaction entry still holds.
  - **The `break-attention` needs line.** It matches `needs_rule` and keeps OQ-25's attribute and gear.
  - **Chapter 4 section 4.12, the Squad sheet row, and the example rows.** They add a column without removing any OQ-29 gear column.
- **Phase 2.** Expeditions, Mission Briefs, Chases, Operation Frames, Shifters, Squad Points, Rank, and Research Points are forward references only. The interim setup table and the two starting Squad Tactics are logged stopgaps. No new Phase 2 content was added in round 2.
- **Example.** The grounded kill still checks against the rows: the Bonus Dice, the Opening creators, Mila's hooked-by-strike flag taking Attention, Swat falling back to Thrash, the turn her dodge spends, and the mid-round Gas Rolls.

**Figures that reproduce** (mine, then the chapter's):

| Figure | Mine | Chapter |
|---|---|---|
| Lone Rookie, Nape Depth 4, Stress 0, 1, 2 (240,000 trials each) | 9.96, 13.18, 15.77% | 10.0, 13.1, 15.9% |
| Lone Veteran, Stress 2; Levi-grade, Stress 2 | 32.07%; 47.43% | 32.3%; 47.4% |
| Lone Grab: failed dodge, no dodge | 69.86, 73.03% | 69.9, 73.1% |
| Lone Grab with turn debt: failed dodge, no dodge, no refund | 69.91, 73.09, 100% | 70.1, 73.0, 100% |
| One comrade, six cells (S1 G0 to S3 G1) | 28.63, 33.55, 39.68, 34.16, 39.83, 45.05% | 28.7, 33.4, 39.1, 34.1, 39.7, 45.1% |
| Two comrades, S2 G0; one comrade, S2 G0 with debt | 17.39%; 41.81% | 17.3%; 41.5% |
| Jam, worst cell (two Large, Covered, no Help) | 32.82% | 32.7% |
| Jam, two Medium and two Small (Covered, no Help); one Large | 24.54, 22.59%; 12.45% | 24.5, 22.3%; 12.4% |
| Gas medians, 2 and 3 dice | 8, 6 | 8, 6 |
| Medium reference: median, by round 3, by round 4, Critical Injuries, deaths (12,000 fights) | 3, 61.8%, 72.7%, 0.71, 0.028 | 3, 62.6%, 73.2%, 0.71, 0.027 |
| 4 player characters and 2 helper Squadmates | 3, 69.1%, 0.65 | 2, 69.3%, 0.65 |
| Screen from Distant: cards resolved per round, Critical Injuries | 0.533, 0.35 | 0.535, 0.35 |

The S3 G0 cell is 0.6 points above the chapter's (240,000 trials against 40,000), still far under 50%. The helper Squadmates' median sits on the boundary between rounds 2 and 3. The Jam margin under a third is 0.5 points, so any Severity or wear change must re-run it (OQ-96 already says so).

## Findings

### 1. Major. Decoy Squadmates who stand beside the Attention holder sidestep OQ-81's fix

**Location:**

- `attention.yaml` (`break_attention.needs`, `needs_rule`, `decoys`).
- Section 5.6 *Break Attention and decoys* and its OQ-81 block ("Squadmates standing off at Distant cannot cheaply keep a Titan idle").
- Section 5.13, the *Decoys* bullet.
- `tuning.yaml` (`prepared_squad_kill.decoys`, `titan_cards_resolved_per_round`).
- OQ-81's round 2 revision and *Still open for the decider*.

**Problem:**

- A comrade needs 1 success if they "hold the same Position relative to it as the soldier who does". Nothing stops a decoyer moving there first.
  - At Wooded, Sparse, and Giant Forest, a mounted Squadmate rides from Distant to In Reach, where the cutters usually hold Attention, and sends the horse in the same turn. Move first, then act, is allowed by `turn_order`.
  - Once a striker who fell short at Blind Spot takes Attention, the dismounted Squadmate flies there and throws the cloak, again needing 1.
- A Squadmate never Pushes. With Perception 3, horse 2, and Stress 1 it succeeds about 66% of the time needing 1, against about 26% needing 2.
- The chapter's screen row and every OQ-81 figure use a screen that sends its horse from Distant and throws from Blind Spot whatever the holder's Position. That is the one policy the needs rule is built to stop.
- The decider's four options are compared on those figures. Played the easy way, option (2) buys almost nothing.

Figures: my extension of the committed `fight.py`, unchanged rules. Medium, Wooded, 4 Rookie player characters and 2 Squadmates, 12,000 fights per row. In the beside-the-holder rows, the screen's Break Attentions needed 1 on 2.49 rolls per fight and 2 on 0.28.

| Squadmates' policy | Titan cards resolved per round | Critical Injuries per fight | Grabs per fight | Killed by round 3 | Median kill round |
|---|---|---|---|---|---|
| Helpers, no decoys | 0.834 | 0.65 | 0.193 | 69.1% | 3 |
| Screen from Distant (the chapter's row) | 0.533 | 0.35 | 0.106 | 69.7% | 3 |
| **Screen beside the holder** | **0.419** | **0.26** | **0.076** | **73.5%** | **2** |
| The same, every Break Attention needing 1 (the round 2 rule) | 0.395 | 0.24 | 0.077 | 73.5% | 2 |
| Beside the holder, holding Hook and Cut and Hamstring Line | 0.366 | 0.22 | 0.070 | 77.9% | 2 |
| Beside the holder, with the rejected decoy cap (fix option 2) | 0.514 | 0.30 | 0.093 | 70.5% | 2 |
| Needs 1 for the holder only, screen sending and throwing anyway (fix option 1) | 0.604 | 0.42 | 0.132 | 68.4% | 3 |

- **Harm.** Against helper Squadmates, the screen beside the holder cuts Critical Injuries by 60% and Grabs by 61% while the kill gets faster. ADR-0014's Expedition Critical Injury and death targets are measured per Titan Engagement, so they inherit the cut.
- **The rule's effect.** It recovers 0.024 cards a round of the 0.44 the screen takes away.
- **Fidelity.** A riderless horse or a cloak in the face buys a moment. Here the Titan stands idle for half its cards, as round 2 found.

**Scenario:** Round 1 at Wooded.

1. Private Jonas Keller holds Attention at In Reach. Squadmates Ilse and Karl, mounted at Distant, each ride to In Reach and send their horses, needing 1 each. The Titan's next card resolves nothing.
2. In round 2, striker Mila falls short at Blind Spot and takes Attention on the Titan's card.
3. In round 3, Ilse and Karl fly to Blind Spot and throw their cloaks, needing 1 each.

The Titan resolves one behavior in three rounds. No rule was bent, and the needs rule applied at every roll.

**Fix options:**

1. **Needs 1 for the Attention holder only,** 2 for everyone else (and 2 against a holding Titan, as now). The lone soldier's escape and OQ-79's figures do not move, because the lone soldier holds Attention. Measured above: 0.60 cards a round and 0.42 Critical Injuries per fight, against 0.83 and 0.65 with helpers. Update `needs_rule`, the `break-attention` Catalog line, section 5.6, and OQ-81.
2. **Add a limit the Position cannot dodge:**
   - the Squad's decoys per Titan per Titan Engagement, such as one per Focus Titan per round;
   - or a Titan whose last card a decoy spent ignores decoys until a card resolves a behavior. On this policy that rejected cap reaches 0.51 and 0.30, and it costs the lone soldier (OQ-81).
3. **At minimum,** re-measure OQ-81's still-open options and section 5.13's *Decoys* bullet under the beside-the-holder policy, add that row to `tuning.yaml` (`decoys`), and delete the OQ-81 sentence that the rule stops Squadmates keeping a Titan idle.

### 2. Minor. On a Tempo 2 Titan, turn debt still turns a failed dodge against the first card into a certain devour

**Location:** `grab.yaml` (`countdown.failed_dodge`, the sentence excluding "a dodge made against an earlier card of the Titan this round"), section 5.9 *The countdown*, and OQ-85 option (e).

**Problem:**

- Rule (e) refunds only a dodge made against the Grab's own card.
- On a Small Titan (Tempo 2, every Severity 2 or less), a soldier carrying turn debt whose card comes after both Titan cards has no turn left this round, so a dodge against the first card spends next round's turn.
- If that dodge fails and the second card is a Grab, the Grab compares the same successes, fails, and lands.
  - The first counted turn (this round's) was spent in advance.
  - The second (next round's) was spent by the earlier dodge, and nothing gives it back.
  - The victim reaches the devour with no Break Free.
- Had they not dodged the first card, they would dodge the Grab fresh and keep one Break Free under rule (e).
- The Next Behavior for the second card is rolled only after the first resolves, so no player can see this coming. It is bad luck rather than a dominant play, but it is exactly the loss OQ-85 set out to remove.

**Scenario:** A Small Titan's cards are 3 and 7, and Anna's card is 12. Her round's turn was spent by a dodge last round.

1. Card 3 resolves Swat against her. She dodges, spends next round's turn, and fails.
2. Card 7 resolves Grab. Her failed dodge compares, and the Grab lands.
3. Card 12 is her first counted turn, already spent, and she is lifted. Next round's turn is her second, already spent, and she is devoured.

**Fix options:**

1. **Extend `failed_dodge`** to a dodge whose successes the Grab card compared, when that dodge spent a turn after the first counted turn.
2. **Or log the case** under OQ-85 with a frequency from the Small Titan fight.

### 3. Minor. Two files compare a dismounted horse's Position differently for the riderless-horse decoy

**Location:** `attention.yaml` (`decoys.riderless-horse.requirement`: the horse "holds the soldier's Position relative to the Titan") against `data/gear/horses.yaml` (`gear_dice.break-attention`: "both compared relative to the Focus Titan recorded with the horse's Position").

**Problem:**

- A dismounted horse's Position is recorded relative to one Focus Titan (`two_focus_titans.recorded_label`).
- Against a second Focus Titan B, `attention.yaml` asks for the horse's Position relative to B, which no rule defines, since `entering` places only soldiers.
- `horses.yaml` compares relative to the recorded Titan instead.
- The two readings give different answers whenever the soldier's Positions relative to A and B differ.

**Scenario:** Titan B entered two rounds ago. Karl's horse is recorded `@Distant A`. Karl holds Distant relative to A and In Reach relative to B, and declares a riderless-horse Break Attention against B. By `horses.yaml` the horse is at his Position; by `attention.yaml` its Position relative to B is undefined.

**Fix options:**

1. **Word the decoy requirement as `horses.yaml` does:** mounted, or the horse holds the soldier's Position, both relative to the Focus Titan recorded with the horse.

### 4. Minor. The Positions record has two homes, and the Squad sheet column may not exist for player characters

**Location:**

- `data/gear/sheet-fields.yaml`: the `positions` field and the `squad_sheet_row.positions` column. Its `purpose` says "One line per Squadmate ... A player character may use the same line", and its header lists only decided entries.
- Section 5.3 *What the GM tracks*: "Each soldier's Squad sheet row has a positions column".
- `round.yaml` (`titan_card_checklist`, `players_track`).

**Problem:**

- The ladder aid in section 5.3 reads "each soldier's" Positions from the Squad sheet. The Squad sheet row is required only for Squadmates, and optional for player characters.
- A player character's Positions may live only on their own sheet, and no rule says which copy governs when the two differ.
- The two formats differ: the field has "A In Reach, B Distant", and the column "A In Reach B Distant".
- The file's header lists `decided: [OQ-29, ...]` with no marker for the PROVISIONAL OQ-90 addition.

**Scenario:** Mila's player keeps her Positions on her own sheet. The Squad sheet has rows only for Ilse and Karl. On A's card the GM cannot read the ladder "straight off the Squad sheet", and Mila's sheet and her player's memory disagree about On Body.

**Fix options:**

1. **In a Titan Engagement, every soldier has a Squad sheet row,** or at least its positions column. That column is the record the ladder reads, and the sheet field mirrors it.
2. **Unify the two formats,** and add `provisional: [OQ-90]` to the file header beside `decided`.

### 5. Minor. Retreat option 4 names Lift Comrade, which can never satisfy it

**Location:** `background-titans.yaml` (`retreat.moves`, option 4), section 5.10, and OQ-87's round 2 revision.

**Problem:**

- Option 4 lets a soldier stay beside "such a comrade", a Down or Grabbed comrade who is not carried, once they have taken a rescue action for them, and it lists `lift-comrade`.
- After Lift Comrade the comrade is carried, so they are no longer such a comrade, and option 4 fails.
- A carrier must take option 1 or 2, which is what the rule wants. But the listed action misleads a reader into thinking a lift lets the carrier stay.

**Scenario:** In a retreat, Felix lifts Down Hans and declares option 4 to stay and let Greta Treat Hans next turn. Greta's player points out Hans is now carried.

**Fix options:**

1. **Delete `lift-comrade` from option 4's list** and from OQ-87's revision. If wanted, add a sentence saying a carrier heads out by option 1.

### 6. Minor. `squad-tactics.yaml` still says the tuning figures exclude Squad Tactics

**Location:** `squad-tactics.yaml` (`rules.tuning`: "The simulation figures in data/engagement/tuning.yaml were measured without Squad Tactics").

**Problem:** Since the round 2 fix, `tuning.yaml` (`prepared_squad_kill.squad_tactics`) reports every tactic alone and in pairs (OQ-89, OQ-98). The row now contradicts the file it points to.

**Scenario:** A reader checks whether Hook and Cut was tuned, reads this row, and misses the `squad_tactics` table.

**Fix options:**

1. **Replace the row** with "The reference rows are measured without Squad Tactics; every tactic alone and in pairs is reported beside them (data/engagement/tuning.yaml, prepared_squad_kill, squad_tactics)."

### 7. Minor. "Twice Medium's harm" understates a Large Titan's lethality

**Location:**

- Section 5.13, the *Large* bullet ("a fight deals 1.41 and 0.19, still twice Medium's harm").
- OQ-78's *Why* ("twice Medium's harm") and `tuning.yaml` (`verdict`).
- `size-classes.yaml` line 54 ("36.5%"), against 36.6% in `tuning.yaml`, section 5.13, and OQ-78.

**Problem:**

- Critical Injuries are twice Medium's (1.41 against 0.71), but deaths are seven times (0.19 against 0.027).
- The share of Grabs that kill is double: 17.3% in my run, 17.9% in `tuning.yaml`, against 8.8% and 9.1%.
- The interim setup table deals a Large Focus Titan 1 time in 6, so a reader weighing it needs the death figure.

**Scenario:** A table reads "twice the harm" and expects about twice Medium's deaths, not seven times.

**Fix options:**

1. **Say "twice Medium's Critical Injuries and seven times its deaths",** and make the `size-classes.yaml` comment read 36.6%.

## GM bookkeeping

Per-round means from my counters on the committed full-fight model:

| Item | 4 PCs | 4 PCs, 2 helper Squadmates | 4 PCs, 2 screen Squadmates beside the holder |
|---|---|---|---|
| Rounds per fight | 3.9 | 3.5 | 3.2 |
| GM tracker writes (after the deal, each Titan card, each strike or Break Attention, end steps) | 5.2 | 5.2 | 6.3 |
| Ladder evaluations (five rungs, struck-first, three tie-breaks) | 1.1 | 1.1 | 1.2 |
| Hidden Next Behavior rolls with move-up | 1.1 | 1.1 | 1.2 |
| Strike and Break Attention pools | 2.3 | 2.3 | 3.4 |
| Dodges | 0.5 | 0.5 | 0.2 |
| Witness Fear Rolls | 0.16 | 0.28 | 0.12 |
| Gas Rolls (the model's policy; real play has more ODM moves) | 0.6 | 0.6 | 0.5 |

On top of the table:

- **Live GM values per Focus Titan:** about 20.
  - cards and holder;
  - Next and previous behaviors, and any Call It;
  - five Body Part states and five counts;
  - Openings with creators, and the clock;
  - Grab fields and flags.
- **Background Titans and the Engagement line:** one line per Background Titan, and six fields on the Engagement line.
- **Positions column:** one sheet write per move that changes a Position, about 1 to 2 a round. It doubles with two Focus Titans, and the close rule adds writes.

**Time estimate** for 4 player characters and 2 Squadmates against one Tempo 1 Titan:

- Four player character turns at 1.5 to 2 minutes, and two Squadmate turns at about 1 minute.
- One Titan card at 1.5 to 2 minutes (checklist order, ladder read from the Positions column), end steps at 1 minute, and Wings and swaps at 1 to 2 minutes.
- **Typical round: 12 to 17 minutes,** likely inside the band.
- **Grab round: 16 to 22 minutes.** It adds five witness Fear Rolls rolled together, the crush, and the countdown.
- **Two-Focus-Titan round: 22 to 30 minutes, unlikely to fit.** It adds a second card procedure, a second ladder against a second Positions column, and a second tracker row. The interim setup table gives Background Titans on 4 results in 6, with clocks of 4 to 8 rounds against a fight of 3 to 4 rounds, so this is common rather than rare.

OQ-97 logs the round-time risk and owes a timed paper test for one and for two Focus Titans, so this is not a new finding. My estimate says the two-Titan test is the one likely to fail.

## Provisional decisions and logged targets

- **OQ-74 (Anchor Ratings, steps):** Sound.
- **OQ-75 (two Titans, placement, records):** Sound. The horse comparison wording is Minor finding 3.
- **OQ-76 (leaving, the Down move, falls):** Sound.
- **OQ-77 (cards, swaps, Wings, turn order, end steps):** Sound.
- **OQ-78 (Size Class values):** Sound as starting values.
  - Medium and Large at Nape Depth 4 reproduce. Large now finishes in a playable number of rounds; the kill now matches Medium's, and a canon Nape does not grow with the Titan.
  - Large's seven-times death rate is logged as a simulator case against the PC death target. The wording is Minor finding 7.
- **OQ-79 (lone Rookie, Simulator target):** Correctly logged, reproduced at 13.18%. Only the decider can close it. The recommended "about 10%" amendment remains the smallest honest change.
- **OQ-80 (Behavior Table procedure):** Sound.
- **OQ-81 (ladder, flags, decoys):** Ties, flags, Down candidates, and rescue by Break Attention are sound. The decoy needs rule does not do what its *Why* claims, and the *Still open* figures understate the loop (Major finding 1). Fix option 1 there, needs 1 for the holder alone, is measured and keeps ADR-0010's lone escape.
- **OQ-82 (Body Parts, grounding, Regeneration):** Sound. The grounded reach to a holding arm is fixed.
- **OQ-83 (own Openings):** Sound. The glossary line is still pending under OQ-90.
- **OQ-84 (Read, Call It):** Sound as written, and unsimulated. The Tactician simulator case is logged.
- **OQ-85 (Grab):** Rule (e) is sound and reproduced. The Tempo 2 residual is Minor finding 2.
- **OQ-86 (witnesses):** Sound.
- **OQ-87 (Background Titans, retreat, setup):** Sound. The Lift Comrade wording is Minor finding 5.
- **OQ-88 (ending):** Sound.
- **OQ-89 (Squad Tactics):** Sound, and the tactic pairs are now measured. With a screen beside the holder, Hook and Cut with Hamstring Line reach a median kill in round 2 (77.9% by round 3). That belongs to Major finding 1, not to the tactics. The stale tuning row is Minor finding 6.
- **OQ-90 (earlier-chapter rows):** Applied, including items 14 to 16, and consistent with every decided entry checked. Still pending:
  - `CONTEXT.md`'s Opening line;
  - Relentless and Sharp Call saying "Chapter 5 states";
  - the file header in Minor finding 4.
- **OQ-95 ("comrades close", Simulator target):** Logged, figures honest and reproduced. My round 2 view stands: take (c) and name the arrangement in ADR-0014, because the default Squad devours about 2% of Grabs.
- **OQ-96 (Jam acceptance reading):** Sound, reproduced at 32.8%, a margin of 0.5 points.
- **OQ-97 (round time):** Sound as an interim, with the playtest owed. Two-Focus-Titan rounds are the likely failure.
- **OQ-98 (tuning policy):** Sound as an interim. Its claim that every tactic pair keeps the median kill in round 3 holds for 4 player characters without Squadmates. Squadmates change that: the chapter's own 2-helper row with Hook and Cut and Hamstring Line has a median kill in round 2, and so do my screen rows.

## Appendix: models

All scripts ran in the session scratchpad with `uv run --with pyyaml python`. None is committed.

- **`indep.py`** is an independent dice core written from the rules text, not importing the probes. It reads the Stress Response, Fear Roll, and torso Critical Injury rows from YAML.
  - **Dice:** d6 pools with a 6 as a success, and penalties that never take base dice below 1. A Push when short and no Stress Die shows 1 adds 1 Stress and a Stress Die, or neither when Covered, plus Hair Trigger's Stress. It re-rolls base and Stress Dice not showing 6.
  - **Stress Responses:** one per roll, with lasting rows moving down when already held. Gear Dice showing 1 on a Pushed roll wear the item.
  - **Lone Nape strike** (240,000 trials per cell): up to three Break Attentions needing 1, with wear carried, then a Nape strike needing 4. There is no strike if Jammed, and no own Openings.
  - **Grab** (240,000 trials per case): a victim Rookie with Grip Breaker 1 and a failed dodge, conditioned on failure, at Severity 3, or no dodge. The torso crush uses the non-lethal cap.
    - Rule (d), plus the rule (e) refund.
    - Break Free needing 2, with a 2-die penalty once lifted.
    - Card order dealt each round.
    - Rescuers with Hamstringer 1 at In Reach, who need a move to On Body after the lift.
    - Witness Fear Rolls from the YAML rows.
    - Debt cases: the victim's card after the Titan's, with this round's turn already spent.
  - **Jam** (240,000 fights per cell): the reference Rookie dodges each Titan once a round for three rounds against table behaviors (move-up, no repeats, Shake Off at In Reach as Thrash). The Push goes toward the first card's Severity, with Help 0 or 1 and Covered or not.
  - **Gas:** 2 or 3 dice a round from Gas Rating 3.
- **`fight3.py`** imports the committed `fight.py` unchanged, then subclasses it (12,000 fights per case on seeds different from the drafter's):
  - **Counters:** tracker writes, ladder evaluations, Next Behavior rolls, pools, Fear Rolls, and soldiers using ODM Gear per round.
  - **`screen2` role, the horse phase:** a mounted Squadmate rides to the Attention holder's Position when it is Distant or In Reach (a mounted step at Wooded), then sends the horse when Break Attention needs 1. It sends needing 2 only when the holder is at On Body or Blind Spot.
  - **`screen2` role, the cloak phase:** dismounted, it flies to the holder's Position if that is On Body or Blind Spot (otherwise Blind Spot), and throws the cloak when it needs 1.
  - **Fix variants:** the rejected decoy cap (`decoy_cap`), and needs 1 for the holder alone, with the screen sending and throwing whatever it needs.
