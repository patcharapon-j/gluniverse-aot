# Chapter 5, Titan Engagement: review round 2

Reviewed `docs/rules/05-titan-engagement.md`, all fifteen YAML files in `data/engagement/`, both round-1 reviews, `CONTEXT.md`, every ADR, `DECISIONS-2026-09-14.md`, Chapters 1 to 4, the OQ-90 changes in their YAML, and OQ-74 to OQ-90 plus OQ-95 to OQ-97. I did not read or edit the parallel round-2 review.

All 52 YAML files under `data/` parse with Ruby Psych. Independent probability work ran from `/private/tmp/wof-ch5-r2.hoO6KZ`, outside the repository, at 300,000 to 1,000,000 trials per headline cell. I also reran the committed Medium-fight probe twice with independent 20,000-fight seeds after supplying its YAML input through Ruby.

## Verdict

No Critical, four Major, and two Minor findings remain open.

The mechanical repairs work. The Grab no longer rewards declining a dodge, a dead victim releases the holding Titan, the horse decoy is once per Engagement, turn order and tactic declaration are executable, the Read fields agree, Open terrain no longer invents an anchor, and the retreat and ending rules allow rescue.

The arithmetic also reproduces. The Medium reference fight had median kill round 3 in both reruns, with 61.7% and 62.5% killed by round 3. My separate simulations gave 13.15% for the lone Rookie and 47.32% for the Levi-grade soldier, 69.68% death after a failed Grab dodge, 73.09% after declining, and 33.54% with one comrade at Stress 2 and no Grief. The widened Jam test gave 32.79% for two Large Titans under the table procedure and 35.51% if every card used kill Severity. Gas medians were 8 and 6.

The remaining problems are not numerical transcription errors. The Rookie still misses a hard ADR bound, the one-comrade reading does not settle the Grab target in the reference fight, the published tuning still calls partial probes its evidence, and no timed test supports the round-time claim.

## Round-1 Critical and Major findings

### Codex round 1

| Finding | Status | Round-2 result |
|---|---|---|
| C1. Jam test used arbitrary coin-flip support | Resolved | OQ-96 now tests every Help count with and without Covering against the table procedure. The independent worst legal cell was 32.79%. |
| C2. Wrong reference builds and missing ADR reports | Partly | Stress starts, full builds, Health variants, and template reports are corrected. The chapter still relies on stand-in probes that omit written options and says the simulator is not built. See finding 3. |
| C3. A dead Grabbed soldier leaves the Titan inert | Resolved | Death ends the Grab at once, resets the arm, clears Attention, and lets the next card act. |
| M4. Lone Rookie exceeds 10% | Not resolved | The independent result is 13.15% at the ADR fight start. OQ-79 logs but does not amend the target. See finding 1. |
| M5. Declining a Grab dodge is dominant | Resolved | The Grab spends the first counted action either way. Declining now gave 73.09% death, against 69.68% after a failed dodge. |
| M6. Tracker reveals Read facts | Resolved | Standard values are public and removed from its Read facts. Abnormal values stay hidden. |
| M7. Grip Toughness violates the count invariant | Resolved | A landed Grab resets the holding arm's count to 0, and release resets it again. |
| M8. Open terrain creates an anchorless Blind Spot | Resolved | Open reaches Blind Spot only after grounding the Titan. |
| M9. Squad Tactic declaration is not executable | Resolved | Every tactic now names its declarer and declaration moment, with the existing roll-off for disputes. |
| M10. OQ-90 leaves dangling Read pointers | Resolved | `read.yaml` points to the Chapter 1 rows now present in `bonus-dice-sources.yaml`. |
| M11. Call It disagrees about the reader | Resolved | Prose, Read data, and the Bonus Dice row all exclude the reader's own dodge. |
| M12. Round likely exceeds 20 minutes | Not resolved | Aids were added, but no timed paper test exists. See finding 4. |

### Opus round 1

| Finding | Status | Round-2 result |
|---|---|---|
| C1. Declining a Grab dodge is better | Resolved | Same repair and reproduced result as Codex M5 above. |
| C2. Riderless horse is free and repeatable | Resolved | A successful horse decoy leaves the Engagement and cannot be sent again. |
| M3. Prepared-Squad result does not reproduce | Resolved | Independent reruns gave median round 3 and 61.7% to 62.5% by round 3. |
| M4. One-comrade reading misses the real-Squad Grab rate | Not resolved | OQ-95 keeps the one-comrade band while reporting 2.0% to 13.9% in Squad models. See finding 2. |
| M5. Move and action order undefined | Resolved | Either order is allowed, and the move cannot be split. |
| M6. Lone Rookie exceeds 10% | Not resolved | Same miss as Codex M4. See finding 1. |
| M7. Read facts conflict with public tracker | Resolved | Same repair as Codex M6. |
| M8. Ending kills soldiers a returner can reach | Resolved | The ending waits through the next round when a returner exists. |
| M9. Retreat forbids rescue movement | Resolved | Forced moves may approach or stay with an uncarried Down or Grabbed comrade. |
| M10. Squad Tactic declaration undefined | Resolved | Same repair as Codex M9. |

## Findings

### 1. Major. The lone Rookie still breaks ADR-0014's upper bound

**Location:** Section 5.13, lines 788 to 804; `data/engagement/tuning.yaml`, `solo_nape`; ADR-0014; OQ-79.

**Problem:** ADR-0014 says a lone average soldier who has used Break Attention succeeds on no more than 10% of Nape strikes against a Medium Titan. Its Rookie starts a fight at Stress 1. The chapter reports 13.1% and recommends changing the meaning to "about 10%", but neither ADR-0014 nor a decision makes that change.

My independent 300,000-trial implementation gave 13.15% for the Rookie and 47.32% for the Levi-grade soldier. The latter meets "about 50%". The former misses a hard ceiling by 3.15 percentage points, or about 31% relative. OQ-79 makes the contradiction provisional rather than Critical, but its recommended reinterpretation is not yet a rule.

**Scenario:** A reference Rookie enters at Stress 1, gets past Attention with Break Attention, and Pushes the Nape strike. Across repeated attempts, roughly 13 in 100 strikes kill instead of at most 10.

**Fix options:**

1. Amend ADR-0014 to say "about 10%" and explicitly accept 13.1% at Stress 1.
2. Change a lever that lowers the Rookie without pulling the Levi-grade result far below 50%, then rerun the Medium fight.
3. Keep OQ-79 open and stop saying the Chapter 5 targets are met until the decider rules.

### 2. Major. OQ-95 does not settle what "comrades close" means in the fight ADR-0014 defines

**Location:** Section 5.13, lines 806 to 830; `data/engagement/tuning.yaml`, `grab`; Chapter 3, sections 3.7 and 3.12; ADR-0014; OQ-50 and OQ-95.

**Problem:** The one-comrade cell reproduces at 33.54%, and all six reported cells pass OQ-50. That verifies one rescue arrangement. It does not settle ADR-0014's unqualified phrase "with comrades close".

The chapter itself reports 17.3% with two comrades and 9.9% with three at Stress 2 and no Grief. Its fight probes report only 2.0% to 13.9% of Grabs killing in Squad play, and those probes omit Help on Break Free, Pry Loose, and Break Attention rescues that can lower the rate further. Chapter 3's own example rescue structures use two comrades or one comrade with two actions. OQ-95 chooses the least-supported reading and leaves an ADR amendment to the decider. That is not a sound final interpretation of a teamwork target.

**Scenario:** A Grab lands on the front-line cutter in the reference Squad while the other cutter and a helper are In Reach. The measured death rate is 17.3%, about half the stated target, before every legal rescue is included.

**Fix options:**

1. Amend ADR-0014 to define "comrades close" as exactly one comrade in reach, keeping the six-cell test.
2. Add a binding Squad-model floor and tune against every written rescue option.
3. Replace the one-comrade interpretation with the reference Squad's actual Positions when the Grab lands, then retune the rescue structure.

### 3. Major. The tuning evidence is still a partial probe, not the simulator ADR-0014 calls for

**Location:** Section 5.13, lines 739 to 786; `data/engagement/tuning.yaml`, `prepared_squad_kill`, `grab`, and `simulator_cases`; `tools/probes/chapter-05/`; ADR-0014; OQ-78, OQ-84, OQ-89, OQ-95, and OQ-96.

**Problem:** The corrected probe reproduces its own policy and fixes the wrong-build and missing-report parts of round-1 Codex C2. The chapter still says the ADR simulator is not built and calls these scripts stand-ins. The Medium fight omits Read, Call It, Squad Tactics, Wings, swaps, Help on Break Free, Pry Loose, and Break Attention rescue. The tuning data still lists full-rules runs, each held Squad Tactic, the full Squad Grab rate, the full-fight Jam test, Body Part Toughness, and behavior shares as owed.

Several omissions are ordinary play options, not exotic build choices. In particular, every Squad holds two Squad Tactics from its first Engagement. The reported reference policy silently never uses either. Hamstring Line alone raised kills by round 3 from 61.8% to 63.7% in a 30,000-fight sensitivity run, while preserving median round 3. That one check did not test Hook and Cut, defensive Reads, or the combined policy.

**Scenario:** The players choose Hook and Cut and Hamstring Line as their two tactics and use both in the reference fight. The published target row does not describe that legal prepared Squad, and no reported run shows whether its timing or casualties stay in band.

**Fix options:**

1. Build the listed full simulator cases and publish the untuned policy rows before accepting the starting values.
2. Define the ADR target as a named no-Read, no-tactic, no-swap baseline policy, then treat the full-rules cases as sensitivity reports.
3. At minimum, run every pair of held tactics beside the no-tactic row and include all Grab escapes in the Squad model.

### 4. Major. The 12 to 20 minute round target still has no supporting test

**Location:** Section 5.3, lines 190 to 254; `data/engagement/round.yaml`, `round_steps`, `gm_tracker`, `titan_card_checklist`, and `rolled_together`; OQ-97.

**Problem:** OQ-97 adds useful aids but does not remove bookkeeping. In a routine six-soldier, one-Medium round, the GM still handles about 12 to 15 update or procedure moments: Wing state, the deal, swaps, Attention and flags, behavior legality and fallback, target order, the Reaction comparison, effects, the next hidden roll, two to four strike or Opening updates, Regeneration, and any Background clock. The six players also update actions, Position, Stress, gear, and Gas Rolls. A second Focus Titan duplicates most Titan-side work and adds a Position column for every soldier.

No timed paper test exists. The provisional text concedes that the test is owed. Nothing in the new checklist shows that a typical round, especially a Grab or two-Titan round, now fits 12 to 20 minutes.

**Scenario:** Six soldiers fight one Medium Titan. Three Push, one Stress Response fires, two Help actions are spent, a Grab causes five simultaneous Fear Rolls, four soldiers used ODM Gear, and a Background clock ticks. Even at one minute per soldier turn, the remaining procedure has 6 to 14 minutes for more than a dozen GM steps.

**Fix options:**

1. Run timed paper rounds for one and two Focus Titans and publish the median and upper quartile.
2. Keep OQ-97 open and do not accept the bookkeeping until the one-Titan median fits the target.
3. If it misses, take OQ-97 option (b) or (c) and retest.

### 5. Minor. The Opening rule still contradicts the glossary

**Location:** `CONTEXT.md`, Opening; section 5.7, lines 504 to 518; `data/engagement/titan-harm.yaml`, `openings.own_openings`; `data/core/bonus-dice-sources.yaml`, `opening`; OQ-83 and OQ-90.

**Problem:** The glossary says any ally can spend an Opening. Chapter 5 and Chapter 1 forbid its creator from spending it. OQ-90 logs the glossary edit as pending, so this is not a Critical glossary contradiction, but the player-facing definition still states the wrong eligibility.

**Scenario:** A lone striker creates an Opening. The glossary permits them to spend it on their next Nape strike, while both data rows forbid it.

**Fix options:**

1. Change the glossary to "any comrade of its creator" as OQ-90 already records.
2. If self-spending is intended, reverse OQ-83 and rerun the solo target.

### 6. Minor. The committed probes are not reproducible from the repository alone

**Location:** Section 5.13, lines 739 to 750; `tools/probes/chapter-05/core.py`, line 13; the repository root.

**Problem:** `core.py` imports `yaml`, but the repository has no dependency file or run instructions. On the review machine, the documented Python entry points fail immediately with `ModuleNotFoundError: No module named 'yaml'`. I could rerun them only by supplying a temporary Ruby-backed YAML adapter. The tuning file names scripts and trial counts but not exact commands.

**Scenario:** A reviewer checks out these files and runs `python3 tools/probes/chapter-05/run_simple.py solo`. The probe never reaches a trial, so the committed evidence cannot be checked without guessing its environment.

**Fix options:**

1. Add a minimal locked Python dependency file and exact commands for every reported table.
2. Remove the external YAML dependency from the probes by committing the small parsed inputs they need.
3. Add one runner that checks dependencies and reproduces every published headline cell.

## Provisional decision audit

| Entry | Judgment |
|---|---|
| OQ-74 | Sound. Open and grounded movement now respect the Anchor Rating and terrain anchor. |
| OQ-75 | Sound. Per-Titan Positions and the close rule close the two-Titan cases. |
| OQ-76 | Sound. Leaving, returning, falls, and the Down crawl are executable. |
| OQ-77 | Sound. Turn order, swaps, Wings, and end steps have fixed timing. |
| OQ-78 | Partly supported. Medium values reproduce; the full simulator, tactics, eyes, arms, and Large sensitivities remain owed. |
| OQ-79 | Not sound as a final choice. It keeps a value that misses ADR-0014 and recommends an amendment not yet made. |
| OQ-80 | Sound. Move-up, fallback, no-repeat, and Thrash give a closed procedure. |
| OQ-81 | Sound. The horse now has a once-per-Engagement cost and decoys cannot chain. |
| OQ-82 | Sound as a starting procedure. Regeneration order and ties are closed. |
| OQ-83 | Mechanically sound, but the glossary edit remains open under finding 5. |
| OQ-84 | Sound as written. Standard and Abnormal information now has one visibility rule. Its dice remain an unmeasured starting value. |
| OQ-85 | Sound. The first-action rule fixes dodge dominance, and the quoted odds reproduce. |
| OQ-86 | Sound. Witness scope is closed and matches the Grab cells. |
| OQ-87 | Sound. Setup, clocks, entry, and rescue-capable retreat moves need no GM ruling. |
| OQ-88 | Sound. A reachable returner gets one round, while abandonment still kills those left behind. |
| OQ-89 | Executable. Its balance remains part of finding 3's missing reports. |
| OQ-90 | Applied except for the logged glossary wording in finding 5. |
| OQ-95 | Not sound as a final interpretation. See finding 2. |
| OQ-96 | Sound under its stated acceptance reading. The independent worst table cell was 32.79%; the all-kill upper bound was 35.51%. |
| OQ-97 | Evidence pending. The aids are reasonable, but the required timed test has not happened. |

## Scope, fidelity, and bookkeeping

Chapter 5 honors the decisions-file constraints on Grabbed, the Grab countdown, the Toughness 1 hand, Health boxes, witnesses, leaving, Down movement, starting placement, the no-Talent Severity baseline, two-Focus-Titan Positions, and self-created Openings. The widened Jam test passes under OQ-96's logged reading.

The chapter forward-references Chapter 6, Expeditions, Chases, Operation Frames, Shifters, Squad Points, Rank, and Research Points. It does not draft their Phase 2 procedures. Its 845 to 850 fidelity is broadly sound: Titans act by involuntary tables, Attention rewards coordinated cuts and decoys, the Nape remains the only kill, and Grabs create a short rescue window.

The GM count remains about 12 to 15 update or procedure moments in a normal one-Titan round, plus six player turns and sheet updates. Two Titans push the GM side to roughly 20 to 25 moments before player deliberation. I would not expect the latter to fit 20 minutes, and the typical one-Titan round remains unproved until OQ-97's paper test.
