# Round 3 retune: the decider's rulings

Rulings on the retune that decision batch 13 scheduled (`docs/rules/DECISIONS-2026-09-14.md`, 13-2 and 13-10; `docs/playtest/feedback/round-3/OWNER-DECISIONS.md`), read against `docs/reviews/simulator-report.md` (1002 cases, 63,040,000 trials, rules hash `92434a4378646c6e`). Made 2026-09-21 by the Fable decider, under `docs/playtest/HANDOFF.md` (*Orchestration rules*: a ruling that moves a tuned number is the decider's, and the decider may amend ADRs). Nothing here is applied; the **Apply** list under each ruling names every file and block, with the replacement wording, and the last section says what the confirming run must read.

**What is settled and was not reopened:** Health's formula; Frenzy's shape (starts at 0, rises at a round-end step, capped, added to the behavior roll); retargeting rather than downgrading; lethality restored through behavior and not through Attack Dice; Attack Dice, Nape Depth, and Tempo in reserve. Decision 13-10 records Frenzy's **rate and cap as starting values the simulator moves**, so R1 moves one of them inside the settled design. R2, R4, and R5 move tuned numbers, which is this role's, and each says so and argues it.

## The rulings in one table

| # | Ruling (one line) | Moves a settled rule? | Moves a tuned number? | Needs the confirming run? |
|---|---|---|---|---|
| R1 | Frenzy rises at the end of **every even-numbered round** (the second, fourth, sixth), not every round; the cap stays 3 | no: 13-10 names the rate as the simulator's | the rate | yes |
| R2 | The Medium deaths band reads **at most 0.15** through the end of the Titan Engagement; Grabs **0.15 to 0.45**; killed by round 3 **55% to 75%**; the Critical Injuries band 0.5 to 0.9 stands | no | three bands | yes |
| R3 | Neither held alternative is taken: the hooked-by-strike exemption restores the inertness 13-9 removed, and downgrading turns Thrash into Fixed Grin | no | no | no |
| R4 | Target 2's band reads **8% to 16%**; the miss is decision batch 11's Gear Die re-roll on the Push, not batch F's | no | one band | no (the run re-reads it) |
| R5 | The standard Large Titan's **Bite reaches In Reach as well as On Body**, as the Small's and the Medium's do; the Sprinting Abnormal's bar is judged only after that, because until then its ceiling twin sits below its floor twin and the bar has no solution | one table line; the design note of OQ-101 is rewritten | no | yes: the whole bar, the Large band, the Large's Jam test |
| R6 | Every figure paragraph the run renders is re-rendered after the confirming run; nothing else moves: not Attack Dice, Nape Depth, Tempo, any Attention Ladder, the Grab, the retreat clock, or the Abnormal's values | no | no | it is the run |

**Said plainly, as asked:** no rate and no cap of Frenzy lands the Medium deaths band at 0.08 while retargeting is on. Retargeting alone, with Frenzy switched off entirely, reads 0.070 on the reference start and meets that band; the smallest Frenzy that still has the settled shape (cap 1, first rising at the end of round 5) already reads 0.089. So the choice was between removing Frenzy, which is a rule the owner chose and is not this role's to remove, and re-setting the band to what the chosen rule set measures at the rate the design's own purpose picks, which is what decision batch 8 (8-31) did the last time and what R2 does now. The owner's dial, with every stop measured, is in R1.

## How the figures were measured

A sweep in the session scratchpad (`sweep.py`, `target2.py`) imports `tools/sim` unchanged, sets `rules.R.frenzy_cap`, and monkeypatches `engine.Fight.end_steps` (the rate and the first rise), `engine.Fight._retarget` (off, or exempting a holder with the hooked-by-strike flag), and `engine.Fight.choose_behavior` (downgrading, exactly as 13-9 describes the rejected alternative). Every full-fight cell is the standard Medium Titan's **reference start** (`data/titans/probe-figures.yaml`, `reference: true`: 4 Rookie player characters, eager, dodge when harmed, Wooded) unless the row names another, at 140,000 fights (the timing grid and the decomposition) or 70,000 (every other cell), 14 chunks on fixed seeds. The harness reproduces the report: as shipped it reads 0.1744 +/- 0.0017 deaths through the end against the report's 0.169 +/- 0.006, 0.948 Critical Injuries against 0.928, 0.403 Grabs against 0.389, and 71.1% killed by round 3 against 71.5%, each within the report's sampling. The bar rows below are 70,000 fights a row against `tools/sim/barcheck.py`'s own `check`, in both sheet orders. No project file was edited and `tools/sim/run.py` was not run.

The orchestrator's table was measured on a bare `standard-medium` configuration and runs about 0.02 hotter than the reference start throughout; its ordering holds, but one figure it rested on does not: retargeting alone reads **0.070**, not 0.088, on the start every band reads.

### The decomposition, standard Medium, reference start (140,000 fights a cell)

| Cell | Deaths through the end | Critical Injuries | Grabs | Killed by round 3 | Thrash, % of cards | Rounds |
|---|---|---|---|---|---|---|
| Neither rule (Frenzy off, no retargeting) | 0.0396 +/- 0.0006 | 0.463 | 0.160 | 66.4% | 41.2 | 3.65 |
| Retargeting only, Frenzy off | 0.0697 +/- 0.0009 | 0.693 | 0.248 | 71.4% | 15.4 | 3.42 |
| Frenzy only (cap 3, every round), no retargeting | 0.1148 +/- 0.0013 | 0.648 | 0.279 | 66.0% | 44.5 | 3.83 |
| Both, cap 1, every round | 0.1147 +/- 0.0013 | 0.843 | 0.330 | 71.2% | 16.1 | 3.50 |
| Both, cap 2, every round | 0.1539 +/- 0.0016 | 0.930 | 0.379 | 71.0% | 16.1 | 3.57 |
| Both, cap 3, every round (as shipped) | 0.1744 +/- 0.0017 | 0.948 | 0.403 | 71.1% | 16.0 | 3.59 |

The bands: deaths at most 0.08, Critical Injuries 0.5 to 0.9, Grabs 0.15 to 0.30, killed by round 3 55% to 70%, median kill round 3 (met in every cell).

### Frenzy's rate and cap, both rules on (140,000 fights a cell)

| Rate and cap | Deaths through the end | Critical Injuries | Grabs | Killed by round 3 | Rolls Frenzy lifted |
|---|---|---|---|---|---|
| cap 1, rises at rounds 2, 4, 6 | 0.1050 +/- 0.0012 | 0.789 | 0.299 | 71.4% | 23.5% |
| cap 2, rises at rounds 2, 4, 6 | 0.1281 +/- 0.0014 | 0.826 | 0.324 | 71.3% | 23.7% |
| **cap 3, rises at rounds 2, 4, 6 (R1)** | **0.1368 +/- 0.0015** | **0.836** | **0.332** | **71.3%** | **23.6%** |
| cap 1, rises at rounds 3, 6 | 0.0975 +/- 0.0012 | 0.760 | 0.283 | 71.3% | 15.0% |
| cap 3, rises at rounds 3, 6 | 0.1157 +/- 0.0013 | 0.785 | 0.300 | 71.4% | 15.0% |
| cap 1, rises at rounds 4, 8 | 0.0940 +/- 0.0011 | 0.748 | 0.276 | 71.3% | 10.3% |
| cap 3, rises at rounds 4, 8 | 0.1024 +/- 0.0012 | 0.756 | 0.282 | 71.4% | 10.2% |
| cap 3, every round from the end of round 2 | 0.1469 +/- 0.0016 | 0.853 | 0.347 | 71.1% | 23.8% |
| cap 3, every round from the end of round 3 | 0.1288 +/- 0.0015 | 0.807 | 0.315 | 71.2% | 15.1% |
| cap 1, every round from the end of round 5 | 0.0889 +/- 0.0011 | 0.737 | 0.269 | 71.4% | 7.4% |

Every cell is above 0.08. The last row is the least Frenzy that still has the settled shape, and it is past the band by 8 standard errors of its own count and by more than any second seed could recover. Killed by round 3 is 71% in every cell with retargeting on, whatever Frenzy does.

### The held alternatives (140,000 fights a cell)

| Cell | Deaths through the end | Critical Injuries | Grabs | Killed by round 3 | Thrash, % of cards |
|---|---|---|---|---|---|
| Hooked-by-strike exemption, cap 3 every round | 0.1197 +/- 0.0013 | 0.661 | 0.282 | 65.8% | 42.8 |
| Hooked-by-strike exemption, cap 1 | 0.0728 +/- 0.0009 | 0.575 | 0.215 | 65.6% | 43.2 |
| Hooked-by-strike exemption, Frenzy off | 0.0414 +/- 0.0006 | 0.471 | 0.161 | 66.1% | 39.4 |
| Downgrading (13-9's rejected alternative), cap 3 every round | 0.1246 +/- 0.0014 | 0.748 | 0.279 | 66.3% | 4.5 (40.5% of cards downgraded) |
| Downgrading, cap 2 | 0.1016 +/- 0.0012 | 0.718 | 0.254 | 66.4% | 4.8 |
| Downgrading, cap 1 | 0.0737 +/- 0.0010 | 0.648 | 0.213 | 66.4% | 5.4 |
| Downgrading, Frenzy off | 0.0437 +/- 0.0007 | 0.558 | 0.161 | 66.5% | 7.0 (35.3% downgraded) |

### Where the lethality went, reconstructed on today's engine (70,000 fights a cell)

The previous run predates decision batches 10 and 11 as well as 13, so its figures are not a batch-13 baseline. Reconstructed with Health set to 4 and the batch 11 Gear Die re-roll on the Push switched off (`dice.roll` re-executed without that one line), with neither batch-13 Titan rule:

| Titan, cell | Deaths through the end | During the fight | Critical Injuries | Killed by round 3 |
|---|---|---|---|---|
| Medium, Health 4, no re-roll, neither rule (the previous run's rules bar batch 10) | 0.0608 +/- 0.0012 | 0.0537 | 0.639 | 62.6% |
| Medium, Health 4, neither rule | 0.0487 +/- 0.0011 | 0.0424 | 0.548 | 66.2% |
| Medium, Health 6, neither rule | 0.0396 +/- 0.0006 | | 0.463 | 66.4% |
| Medium, Health 6, retargeting only | 0.0697 +/- 0.0009 | | 0.693 | 71.4% |
| Large, Health 4, no re-roll, neither rule | 0.1407 +/- 0.0023 | 0.1315 (committed: 0.1426) | 1.148 | 62.1% |
| Large, Health 4, neither rule | 0.1116 +/- 0.0020 | 0.1036 | 0.995 | 65.6% |
| Large, Health 6, neither rule | 0.0384 +/- 0.0010 | 0.0358 | 0.683 | 65.7% |
| Large, Health 4, retargeting only | 0.0986 +/- 0.0018 | 0.0924 | 1.109 | 68.8% |
| Large, Health 6, retargeting only | 0.0534 +/- 0.0011 | | 0.881 | 69.2% |

So on the Medium, Health took 0.009 off and batch 11 took 0.012 off, and retargeting alone puts back more than both (0.040 to 0.070, against the previous run's 0.075). On the Large, Health took **0.073** off (0.112 to 0.038), because the Large killed through falls: its Thrash and Shrug Off knock a soldier loose at 9 Attack Dice, and at Health 4 the fall finished them. Retargeting at Health 4 makes the Large *less* deadly (0.112 to 0.099) because it removes those Thrashes. Both batch A and batch F remove the Large's one kill path by design, and its Bite, which needs a soldier On Body, was never a path against a Squad that stays off its body. That is R5.

### Every standard table under the settings that matter (70,000 fights a cell, each table's reference start)

| Titan | Neither rule | Retargeting only | As shipped | Cap 3, rounds 2, 4, 6 (R1) | Cap 1, rounds 2, 4, 6 |
|---|---|---|---|---|---|
| Small: deaths, Critical Injuries (band at most 1.0) | 0.035, 0.60 | 0.038, 0.68 | 0.089, 0.87 | 0.065, 0.76 | 0.054, 0.74 |
| Medium: deaths, Critical Injuries, Grabs | 0.038, 0.46, 0.16 | 0.070, 0.70, 0.25 | 0.174, 0.94, 0.40 | 0.136, 0.84, 0.33 | 0.106, 0.79, 0.30 |
| Large: deaths, Critical Injuries, no kill (band at most 15%) | 0.036, 0.67, 6.2% | 0.053, 0.88, 4.2% | 0.159, 1.13, 5.6% | 0.128, 1.03, 5.0% | 0.091, 1.00, 4.8% |
| Sprinting Abnormal: deaths, Critical Injuries | 0.046, 0.54 | 0.079, 0.74 | 0.193, 1.09 | 0.151, 0.93 | 0.131, 0.90 |

Every median kill round is its band's (Small 2, Medium 3, Large 3) in every cell. The Large sits **below the Medium** in every cell, which no rule of Chapter 6 permits: it is "the hardest standard fight Phase 1 accepts" and the twin the Abnormal's ceiling reads.

### The bar's reference and helpers rows (70,000 fights a row, both orders, `barcheck.check`)

| Setting | Ceiling (Abnormal deaths at most the Large twin's), reference row | Winnable (no kill at most the Large twin's) | Floor and reference deaths |
|---|---|---|---|
| As shipped | past: 0.193 vs 0.161, z +8.9; 0.192 vs 0.162, z +8.5 | past, z +7.2 and +6.7 | hold |
| Retargeting only, Frenzy off | past: 0.074 vs 0.053, z +12.1; 0.077 vs 0.052, z +14.4 | hold | hold |
| R1 (cap 3, rounds 2, 4, 6) | past: 0.155 vs 0.132, z +7.2; 0.155 vs 0.123, z +9.9 | within sampling; past z +4.2 | hold |
| R1 with **the Large's Bite reaching In Reach (R5)** | **holds: 0.155 vs 0.217, z -16.8; 0.155 vs 0.214, z -16.4** | **holds, z -2.8 and -2.7** | **hold, z -5.3 and -5.6** |
| R1 with R5, helpers row | holds: 0.062 vs 0.117, z -22.7; 0.064 vs 0.116, z -21.2 | holds, z -3.8 and -4.7 | holds |
| Retargeting only with R5 | holds, z -21.3 and -19.1 | holds | hold |

The ceiling fails with Frenzy off entirely. It is not Frenzy's failure and not the Abnormal's: the Abnormal is 1.1 times the Medium now against 1.45 times before, and the Large fell under both. With the Large below the Medium, the floor (more than the Medium's reference row) and the ceiling (at most the Large's) bound an empty interval, so no value of the Abnormal's can pass.

### Rows reported beside the targets under R1 (70,000 fights)

| Row | Retargeting only | R1 | As shipped |
|---|---|---|---|
| ADR-0014's default Squad, 4 player characters and 2 helper Squadmates: deaths through the end, PC deaths | 0.038, 0.031 | 0.066, 0.050 | 0.083, 0.061 |
| A first Titan Engagement, with its Fear Roll: deaths through the end | 0.092 | 0.196 | 0.249 |

Target B (OQ-140), the owner's target in waiting, wants about 0.125 PC deaths a fight for the default Squad on the setup mix. R1 gives 0.050 on the standard Medium with helpers; as shipped gave 0.061. Neither is near it, and the mix's deadlier tables raise it only so far, so R1 does not overtake the owner's stated destination; it moves toward it.

### Target 2 (400,000 trials a cell, `families.solo_job`)

| Cell | Rookie, Stress 1, Nape Depth 4 | Levi-grade, Stress 2, Nape Depth 4 |
|---|---|---|
| The rules as written (batch 11's Gear Die re-roll on) | 14.93% +/- 0.06 | 52.20% +/- 0.08 |
| Batch 11's re-roll off, nothing else changed | 12.93% +/- 0.05 | 47.42% +/- 0.08 |
| Nape Depth 5, re-roll on | 4.38% +/- 0.03 | 33.66% +/- 0.07 |

The whole of Target 2's move (13.0% to 15.0% in the report) is the Push re-rolling the blade's Gear Dice showing 2 to 5. Health, retargeting, and Frenzy do not touch a fresh cut.

---

## R1. Frenzy rises at the end of every even-numbered round; the cap stays 3

**Ruling.** Frenzy's rate halves: it rises by 1 at the frenzy end step of the **second, fourth, sixth** round of the Titan Engagement and every even-numbered round after, never above 3, and the step does nothing at the end of an odd-numbered round. Everything else about Frenzy stands as decision batch 13 and round 3 review 1 left it: it starts at 0, a Titan that enters at the background-clocks step stays at 0 through its first full round and first rises at the next even-numbered round's end, a Titan a flare brings in mid-round rises with the others, it rises during a retreat, it never falls, a corpse holds none, a roll takes the Frenzy that stood when it was made, and the move-up rule wraps at Frenzy 0 only. The parity is the Titan Engagement's round count, which the tracker already carries, not a count per Titan.

**Why the rate and not the cap.** Frenzy's lethality is not spread over its three steps: it is concentrated in the first one and in *when* it lands. On every standard table the entry at result 6 is the Grab (the Abnormal's is Headlong Lunge, with its Grab at 5), and a total above 6 reads as 6, so Frenzy 1 puts two faces on the Grab, Frenzy 2 three, and Frenzy 3 four. At the rate as shipped, Frenzy 1 is on the roll a Titan makes during round 2 and so on the card it resolves in round 3, the round ADR-0014's kill target names: every Squad, including the one that fights exactly as intended, pays it, and 40% of all behavior rolls are lifted. Cap 1 at that rate still reads 0.115. Halving the rate instead leaves a Squad that kills in three rounds untouched, puts Frenzy 1 on the round-4 card, Frenzy 2 on the round-6 card, and Frenzy 3 on the round-8 card, which is where the retreat clock fills: the top of the shape is reserved for the fight nobody ended, which is the "gets eaten" 13-10 asks for, and 24% of rolls are lifted. That is the reading 13-10 gives of its own purpose ("self-correcting in the direction the design wants: a Squad that kills fast sees little Frenzy, and a Squad that grinds gets eaten") made literal. Lowering the cap to 2 beside it buys 0.006 to 0.009 on the Medium and 0.013 on the Large and takes the escalation's end away; it is not taken. Keeping the rate and delaying the first rise ("every round from the end of round 2") reads 0.147 and reaches Frenzy 3 on the round-5 card; it is a second parameter rather than the one 13-10 names, and it is not taken.

**The dial, for the owner.** On the reference start, deaths through the end: Frenzy off with retargeting 0.070; cap 1 at rounds 2, 4, 6: 0.105; **R1: 0.137**; as shipped: 0.174. Each is measured above, with its Critical Injuries, Grabs, and kill figures. The first of those removes a rule the owner chose and is the one this ruling does not take; the owner may.

**Numbers on R1, reference start:** 0.1368 +/- 0.0015 deaths through the end (about 0.127 during the fight), 0.836 Critical Injuries, 0.332 Grabs, 71.3% killed by round 3, median 3, 4.7% no kill, 15.8% of cards Thrash, 26.7% retargeted, 3.51 rounds. The bar's runs of the same start read about 0.005 hotter than the reference case (as shipped: 0.1765 and 0.1738 against 0.169), so expect about 0.142 there at 120,000 fights, standard error 0.002.

**Apply.**

1. `data/engagement/titan-format.yaml`, `frenzy`. After `cap: 3` insert:
   > `rate: 2   # rises at the frenzy end step of every even-numbered round of the Titan Engagement; the simulator moved it from 1 (round 3 retune, R1; docs/reviews/round-3-retune-decisions.md)`
   Replace `rises` with:
   > By 1 at the frenzy end step of every even-numbered round of the Titan Engagement, the second, the fourth, the sixth, and so on, for every living Focus Titan, never above the cap (rate; data/engagement/round.yaml, end_steps, frenzy). At the end of an odd-numbered round the step does nothing. It never falls. A Titan that enters at the background-clocks end step enters after this step has run, so it stays at 0 through its first full round and first rises at the next even-numbered round's end; a Titan a flare brings in mid-round rises with the others at that end. The rate was 1 as decision batch 13 first wrote it; the retune halved it (round 3 retune, R1).
   Replace, in `why`, "it postures in round 1 and is trying to kill by round 3. A Squad that kills fast sees little of it." with:
   > it postures for three rounds and is trying to kill from round 4. A Squad that kills in the three rounds ADR-0014 targets never sees it, and a Squad that grinds meets Frenzy 3 on the round the retreat clock fills.
2. `data/engagement/round.yaml`, `end_steps`, `frenzy`, `text`. Replace "Raise every living Focus Titan's Frenzy by 1, never above its cap of 3 (data/engagement/titan-format.yaml, frenzy)." with:
   > Raise every living Focus Titan's Frenzy by 1, never above its cap of 3, at the end of an even-numbered round only, the second, the fourth, the sixth, and so on (data/engagement/titan-format.yaml, frenzy, rate); at the end of an odd-numbered round this step does nothing.
   Then replace "a Titan that entered mid-round when a flare filled its clock rises to 1 here, and a Titan that enters at the background-clocks step, which comes after this one, enters at 0 and stays at 0 through its first full round" with:
   > a Titan that entered mid-round when a flare filled its clock rises here with the others when the round is even-numbered, and a Titan that enters at the background-clocks step, which comes after this one, enters at 0 and stays at 0 through its first full round, rising first at the next even-numbered round's end
   The sentence "It rises during a retreat as well ... never touches a Next Behavior already rolled" stands.
3. `data/engagement/round.yaml`, `gm_tracker`, `focus_titan_row`, the Frenzy field. Replace "raised by 1 at the frenzy end step and added to every behavior roll" with:
   > raised by 1 at the frenzy end step of every even-numbered round and added to every behavior roll
4. `tools/sim/rules.py`, the Frenzy block (line 716 on). After `self.frenzy_start = int(fz["starts_at"])` add `self.frenzy_rate = int(fz["rate"])`, extend the check to `or self.frenzy_rate < 1`, and change the guard to:
   > `guard(r"By 1 at the frenzy end step of every even-numbered round of the Titan Engagement, the second, the fourth, the sixth, and so on, for every living Focus Titan, never above the cap", fz["rises"], "when Frenzy rises")`
5. `tools/sim/engine.py`, `Fight.end_steps`. Replace `if not t.dead and t.frenzy < R.frenzy_cap:` with:
   > `if not t.dead and t.frenzy < R.frenzy_cap and self.rnd % R.frenzy_rate == 0:`
   and extend the comment above it: "It rises only at the end of a round that is a multiple of the rate, every even-numbered round at rate 2 (round 3 retune, R1)." `tools/sim/report.py` prose that says Frenzy rises "1 a round" (grep `a round` near `Frenzy`) reads "every second round".
6. `docs/rules/05-titan-engagement.md`:
   - Section 5.3, end step 3 (line 466). Replace "each living Focus Titan's Frenzy rises by 1, never above 3 (section 5.4). It raises only a Titan that is a Focus Titan when the step runs: one that entered mid-round on a flare rises to 1 here, and one that enters at step 4 enters at 0 and stays there through its first full round." with:
     > at the end of an even-numbered round (the second, the fourth, the sixth, and so on), each living Focus Titan's Frenzy rises by 1, never above 3 (section 5.4); at the end of an odd-numbered round this step does nothing. It raises only a Titan that is a Focus Titan when the step runs: one that entered mid-round on a flare rises here with the rest, and one that enters at step 4 enters at 0 and stays there through its first full round.
   - Section 5.3, the tracker (line 487). Replace "raised at the Frenzy end step" with "raised at the Frenzy end step of every even-numbered round".
   - Section 5.4, the Frenzy paragraph (line 539). Replace "rises by 1 at the Frenzy end step of each round (section 5.3), and never falls" with "rises by 1 at the Frenzy end step of every even-numbered round (section 5.3), and never falls", and "it postures in round 1 and is trying to kill by round 3. A Squad that kills fast sees little of it, and a Squad that grinds gets eaten." with:
     > it postures for three rounds and is trying to kill from round 4. A Squad that kills in the three rounds the design targets never sees it, and a Squad that grinds meets Frenzy 3 on the round the retreat clock fills. The rate was every round when the rule was first written; the retune halved it, because at every round the Squad fighting exactly as intended paid it too (round 3 retune, R1).
   - Section 5.3's design note (line 471), "and Frenzy rises with it" reads "and Frenzy rises with it on an even-numbered round".
   - The worked example (lines 1349 and 1370). "Frenzy 2" reads "Frenzy 1" in the tracker row; "Two rounds have ended, so its Frenzy is 2 and every behavior roll it makes now is D6 plus 2." reads "Two rounds have ended, so its Frenzy is 1 (it rises at the end of every even-numbered round) and every behavior roll it makes now is D6 plus 1."; "D6 plus the Frenzy of 2 that stands at this moment" reads "D6 plus the Frenzy of 1 that stands at this moment". The drafter re-reads every total the example gives after that roll.
7. `CONTEXT.md`, **Frenzy**. Replace "rises by 1 at each round end" with "rises by 1 at the end of every even-numbered round".
8. `docs/adr/0001-titans-act-from-behavior-tables.md`. Append after the round 3 review 1 amendment:
   > Amended after the round 3 retune (2026-09-21, R1; `docs/reviews/round-3-retune-decisions.md`): Frenzy rises at the end of every even-numbered round of the Titan Engagement, not every round; the cap of 3 stands. Decision batch 13 (13-10) named the rate and the cap as starting values the simulator moves, and the retune moved the rate: at one rise a round, Frenzy 1 sat on the round-3 card, the round the kill target names, so every Squad paid it and the Medium deaths band read 0.174 against 0.08; no rate or cap landed that band with retargeting on (the least Frenzy that keeps this shape read 0.089), so R2 re-set the band and R1 chose the rate on the rule's own purpose, which is to leave a Squad that kills on time alone and to eat a Squad that grinds. At the halved rate Frenzy 1 is on the round-4 card, Frenzy 2 on the round-6 card, and Frenzy 3 on the round-8 card, where the retreat clock fills.
9. `docs/rules/DECISIONS-2026-09-14.md`, 13-10, **Measurement.** Append:
   > The retune moved the rate to one rise every second round, at the end of every even-numbered round, and kept the cap (round 3 retune, R1; `docs/reviews/round-3-retune-decisions.md`).
   And add a `## Batch 15: the round 3 retune, applied` section in batch 14's shape whose summary table carries R1 to R6 one line each, pointing at this file for the reasoning and the figures.
10. `docs/rules/OPEN-QUESTIONS.md`, OQ-193. Append:
    > - **Revised by the round 3 retune (R1):** the rate is one rise every second round, at the frenzy end step of every even-numbered round; the cap stays 3. The shape is unchanged.
11. Site. `site/src/content/rules/fighting-titans.mdx` (line 312): "gains **1 at the end of each round, to a cap of 3**" reads "gains **1 at the end of every second round (the second, the fourth, the sixth), to a cap of 3**"; line 314 and every "By round three it is trying to kill you" (`fighting-titans.mdx` 314, `gm/running-a-titan-fight.mdx` 140, `pages/learn/index.astro` 213, `updates/tougher-soldiers-worse-titans.mdx` 139, `lib/engagement-tables.ts` 1023 exit text) reads "By round four it is trying to kill you", with "Round one it postures" reading "For three rounds it postures". `gm/tuning-the-fight.mdx` 51 "gains 1 Frenzy at the end of each round, to 3" and 110 "rises 1 a round to 3" read "gains 1 Frenzy at the end of every second round, to 3" and "rises 1 every second round to 3"; "a fight that runs past round three costs more" reads "past round four". `gm/running-a-titan-fight.mdx` 125 "1 a round to a cap of 3" reads "1 every second round to a cap of 3, at the end of rounds 2, 4, and 6"; 138 "rising by **1 at the end of each round, to a cap of 3**" reads "rising by **1 at the end of every even-numbered round, to a cap of 3**". `pages/reference/quick-reference.astro` 253, `updates/tougher-soldiers-worse-titans.mdx` 135, `lib/glossary.ts` 35, `lib/gm-tables.ts` 195, `lib/gm-screen.ts` 198, and `lib/engagement-tables.ts` 1022: "at the end of each round" (and "at each round's end step", "gains 1 Frenzy, up to 3", "gains 1 Frenzy, to a cap of 3") reads "at the end of every even-numbered round" in each. `scripts/gm-screen/controller.ts` keeps its cap of 3 at line 352; if the screen's end-of-round automation raises Frenzy, it raises it on even rounds only. The update page (`tougher-soldiers-worse-titans.mdx`, line 186) adds one sentence: "The retune has since halved Frenzy's rate to one rise every second round; the first playtest runs at that rate."
12. The packet, `docs/playtest/wings-of-freedom-playtest-packet.html`, under `HANDOFF.md`'s conventions (no em dashes, banned words): line 2814 "rises by 1, never above 3. It rises during a retreat as well." reads "rises by 1 at the end of every even-numbered round (the second, the fourth, the sixth), never above 3, and not at all at the end of an odd-numbered round. It rises during a retreat as well."; line 2880 "It rises by <b>1</b> at the end of each round, and stops at <b>3</b>." reads "It rises by <b>1</b> at the end of every second round (rounds 2, 4, and 6), and stops at <b>3</b>."; line 3971 "gains 1 at each round end, and caps at 3" reads "gains 1 at the end of every even-numbered round, and caps at 3"; line 3982 "Frenzy +1 (cap 3, during a retreat too)" reads "Frenzy +1 on an even-numbered round (cap 3, during a retreat too)"; line 4303 "raised by 1 at each round end" reads "raised by 1 at the end of every even-numbered round"; line 4366 "gains 1 at its own end step of each round, to a cap of 3, during a retreat as well" reads "gains 1 at its own end step of every even-numbered round, to a cap of 3, during a retreat as well"; line 4393 "If this is the fight's third round the Titan sits at Frenzy 2, so that roll is D6 + 2, and any total of 7 or more reads as result 6." reads "If this is the fight's third round the Titan sits at Frenzy 1, so that roll is D6 + 1, and a total of 7 reads as result 6."; line 4489 "raise it by 1 at its own end step of each round, just after the Regeneration clocks, to a cap of 3" reads "raise it by 1 at its own end step of every even-numbered round, just after the Regeneration clocks, to a cap of 3, and leave it alone at the end of an odd-numbered round"; line 4490 "A Titan that enters in round 4 starts at 0 while the first is at 3." reads "A Titan that enters in round 5 starts at 0 while the first is at 2."; line 4548 "gains 1 at the end of each round, and caps at 3" reads "gains 1 at the end of every even-numbered round, and caps at 3"; the five stat-block rows `<dt>Frenzy</dt><dd>starts at 0, rises 1 at each round end, caps at 3, ...` (lines 4562, 4599, 4636, 4672, 4718) read "rises 1 at the end of every even-numbered round"; the glossary row (line 4825) "rising by 1 at the end of each round" reads "rising by 1 at the end of every even-numbered round"; the tracker legend (line 5101) "+1 at each round end" reads "+1 at the end of every even-numbered round". The playtest question at line 5229 stands.
13. Foundry. `foundry/src/rules/engagement/cards.ts`: beside `FRENZY_CAP` add `export const FRENZY_RATE = 2;` and change `frenzyAfterRound(frenzy)` to `frenzyAfterRound(frenzy: number, round: number): number { return round % FRENZY_RATE === 0 ? Math.min(frenzy + 1, FRENZY_CAP) : frenzy; }` with the doc comment "Frenzy, starting at 0 and rising by 1 at the end of every even-numbered round, to this cap (round 3 retune, R1)". `foundry/src/rules/engagement/round.ts`: `planFrenzy(titans, round)` passes the round through; its doc comment reads "1 more on every living Focus Titan's Frenzy at the end of an even-numbered round, never above the cap; at the end of an odd-numbered round nothing changes". `foundry/src/tracker/engine.ts`, `raiseFrenzy`: pass `combat.round` to `frenzyAfterRound`, and log `tr('end.frenzyHeld', { label })` on an odd round. `foundry/static/lang/en.json`: `frenzyNote` reads "Rises 1 at the end of every even-numbered round, to 3. Added to the behavior roll."; add `"frenzyHeld": "{label} Frenzy unchanged: it rises at the end of even-numbered rounds."` beside `end.frenzy`. Comments at `models/actors.ts` 210, `tracker/combat.ts` 56, `tracker/view.ts` 163, and `tracker/snapshot.ts` 71 read "rises 1 at the end of every even-numbered round". Tests: `foundry/test/engagement-rules.test.ts`, the Frenzy block (lines 554 to 567), asserts `frenzyAfterRound(0, 1) === 0`, `frenzyAfterRound(0, 2) === 1`, `frenzyAfterRound(1, 3) === 1`, `frenzyAfterRound(1, 4) === 2`, `frenzyAfterRound(2, 6) === 3`, `frenzyAfterRound(3, 8) === 3`, and that six rounds from 0 give 3; the end-step order test (line 709) stands.
14. `docs/playtest/HANDOFF.md` and `docs/rules/PROGRESS.md`: the next-work pointer reads "the round 3 retune is ruled (`docs/reviews/round-3-retune-decisions.md`, R1 to R6); apply, then the confirming run".

**Needs the confirming run:** yes. It is the retune's own figure and the run reads every band on it.

---

## R2. The Medium bands are re-set: deaths at most 0.15, Grabs 0.15 to 0.45, killed by round 3 55% to 75%; Critical Injuries stand

**Ruling.** Chapter 6's Medium bands at the reference start read: median kill round 3 (unchanged); killed by round 3 **55% to 75%**; Critical Injuries per fight **0.5 to 0.9** (unchanged); deaths per fight **at most 0.15**, deaths through the end of the Titan Engagement, with deaths during the fight reported beside it (the batch 5c reading, unchanged); Grabs per fight **0.15 to 0.45**. The Small and Large bands are unchanged and are met under R1 (Small median 2 and 0.755 Critical Injuries against at most 1.0; Large median 3 and 5.0% no kill against at most 15%). The second-seed rule (5-11) still applies to every band. Target B (OQ-140) stays a target in waiting, and this band is re-set again with every deaths band when it is taken.

**Reasoning.** This is a tuned-number move and it is argued, as the brief asks.

*The deaths band.* Its history is three re-sets, each to a measured figure: 0.05 (batch 5), 0.06 (7-13), 0.08 (8-31, "the owner's chosen lethality for the first playtest, with no value or rule changed for it"). It has never been a design target; ADR-0014's targets are the median kill round, the lone cut, the Grab, gas, and the Expedition. It was set under a procedure in which 41% of the Titan's cards Thrashed and the Medium's Grab landed 0.16 times a fight, which is the inertness the owner named at the table and batch 13 removed. The owner's direction was that lethality is restored through behavior; the record's own arithmetic then says that a Titan that acts on every card is deadlier than one that flails on two in five, and a Frenzy that puts extra faces on the Grab is deadlier again. Retargeting alone lands exactly on the old figure (0.070 against the previous run's 0.075, "restored" to the letter) and Frenzy at any rate or cap lands above the band, so the band and the rule the owner chose cannot both stand. Between them, the band is the one this role may move and the rule is not. It is re-set to 0.15, the round figure above R1's 0.137 at the reference start and about 0.142 on the bar's runs (standard error 0.002 at 120,000 fights, a margin of about four standard errors). The orchestrator asked whether the band should move because Health moved from 2 to 4 to 4 to 6; measured, that is not the reason (Health took 0.009 off the Medium), and the ruling does not rest on it. It rests on the owner's chosen rules measuring where they measure, exactly as 8-31 did. The owner's target in waiting, 0.125 PC deaths a fight for the default Squad, is above what R1 gives that Squad (0.050), so this re-set does not overtake the owner's stated destination.

*The Grabs band.* It was a guard on a table's shape: "a second Grab result doubles Grabs per fight" (Constraints on the undrafted Phase 1 chapters). Frenzy puts up to four faces on the entry at result 6, which on every standard table is the Grab, so Grabs rise by construction under the settled shape, from 0.25 under retargeting alone to 0.33 under R1 and 0.40 as shipped. The shape guard itself is now checked directly (report section 4.1, "Grab results at most 1", Met on every table), so the band's job is done there, and the band is re-read at the measured figure with the same headroom above it that 0.30 gave 0.196. Its floor stays 0.15, because a Medium whose Grab lands less than once in seven fights is not doing its job either.

*Killed by round 3.* It reads 71% in every cell with retargeting on, at every Frenzy setting and with Frenzy off, and 66% with retargeting off, at Health 4 and at Health 6 alike. The 5 points are retargeting's second-strike effect, which round 3 review 1 (C6) foresaw and scheduled a measure for: a striker who falls short no longer parks the Titan's Attention on themselves, so they cut again sooner, and fights are shorter (3.42 rounds against 3.65). That is the settled decision working as designed, not a miss to correct, and no lever the record allows moves it back (the one that does, the hooked-by-strike exemption, is R3's first refusal). ADR-0014's own target, the median kill round of exactly 3, holds (45% by round 2). The band's top moves from 70% to 75%; its floor stands.

*The Critical Injuries band* stands at 0.5 to 0.9 and R1 meets it: 0.836 at the reference start and about 0.86 on the bar's runs (as shipped read 0.948, Missed).

**Numbers.** R1 on the reference start: 0.137 deaths, 0.836 Critical Injuries, 0.332 Grabs, 71.3% by round 3, median 3. Every band above is Met on those figures with the margins stated.

**Apply.**

1. `data/titans/tuning.yaml`, `targets`, `medium`, `at_the_reference_start`. Replace the four value lines with:
   > `killed_by_round_3: 55% to 75%   # 55% to 70% before the round 3 retune (R2): retargeting's second-strike effect adds five points at every Frenzy setting`
   > `critical_injuries_per_fight: 0.5 to 0.9`
   > `deaths_per_fight: at most 0.15, deaths through the end of the Titan Engagement; deaths during the fight reported beside it   # round 3 retune, R2 (docs/reviews/round-3-retune-decisions.md): re-set to what the owner's batch 13 rules measure at Frenzy's halved rate, as 8-31 re-set it to 0.08; history: at most 0.08 under decision batch 8, 8-31, 0.06 under decision batch 7, 7-13, and 0.05 under decision batch 5, 5-19; re-set again under OQ-140`
   > `grabs_per_fight: 0.15 to 0.45   # 0.15 to 0.30 before the round 3 retune (R2): Frenzy puts up to four faces on the Grab by design; the one-Grab-result guard is checked directly (every_standard_table)`
2. `docs/rules/06-standard-titans.md`, section 6.6, the Medium design note (lines 563 to 566). "inside 55% to 70%" reads "inside 55% to 75%"; "inside 0.15 to 0.30" reads "inside 0.15 to 0.45"; in the deaths bullet, "the band, at most 0.08, reads deaths through the end" reads "the band, at most 0.15, reads deaths through the end", and after "as the owner's chosen lethality for the first playtest, with no value or rule changed for it;" insert "and the round 3 retune (R2, `docs/reviews/round-3-retune-decisions.md`), from 0.08 to 0.15, because retargeting and Frenzy, the rules the owner chose, measure there at Frenzy's halved rate and no rate or cap of Frenzy lands 0.08;". The figures in those bullets are re-rendered from the confirming run (R6).
3. `docs/rules/05-titan-engagement.md`, section 5.13, the deaths column note (line 1186): "Chapter 6's Medium band (at most 0.08 deaths per fight at the standard Medium Titan's reference start, the owner's chosen lethality for the first playtest)" reads "Chapter 6's Medium band (at most 0.15 deaths per fight at the standard Medium Titan's reference start, re-set by the round 3 retune to what retargeting and Frenzy measure)"; the figures follow the confirming run.
4. `docs/adr/0014-numbers-tuned-to-design-targets.md`. Append one amendment paragraph:
   > After the round 3 retune (2026-09-21; `docs/reviews/round-3-retune-decisions.md`, R1 to R5): the retune batch 13 scheduled has run and been ruled on. Frenzy's rate is one rise every second round, at the end of every even-numbered round, and its cap stays 3 (R1): no rate or cap of Frenzy landed the Medium deaths band at 0.08 with retargeting on (retargeting alone reads 0.070, the least Frenzy that keeps the settled shape 0.089, the rate as first written 0.174), so the band was re-set rather than the rule removed. Chapter 6's Medium bands at the reference start read: median kill round 3; killed by round 3, 55% to 75%; Critical Injuries 0.5 to 0.9; deaths at most 0.15 through the end of the Titan Engagement, with deaths during the fight reported beside it; Grabs 0.15 to 0.45 (R2). The killed-by-round-3 and Grabs bands moved for structural reasons the settled rules produce (retargeting frees a failed striker to cut again, five points at every Frenzy setting; Frenzy piles its extra faces on the Grab), and the deaths band moved as 8-31 moved it, to the figure the owner's chosen rules measure; the one-Grab-result guard is now read directly in the report. Target 2's band reads 8% to 16% (R4): the fresh cut rose from 13.0% to 15.0% because decision batch 11's Push re-rolls the blade's Gear Dice, and every lever that would restore 14% (Nape Depth 5, the blade's dice excluded from the re-roll) breaks Target 3 or unpicks a package the owner took whole; Target 3 stands at 45% to 55%. The standard Large Titan's Bite reaches In Reach as well as On Body (R5), because at Health 6 the Large's only kill was the fall from a flail, which Health and retargeting both remove, and it read softer than the Medium at every setting, leaving the Abnormal's bar with no solution; with it the bar holds in every row measured. The Health-dependent reported rows are unchanged in definition. Target B (OQ-140) stays in waiting and is nearer: the default Squad reads 0.050 PC deaths a fight on the standard Medium under R1. Every figure this record names is re-read on the confirming run.
5. `docs/rules/OPEN-QUESTIONS.md`, OQ-132. Append:
   > - **Decided anew by the round 3 retune (R2):** the band reads "at most 0.15 deaths per fight through the end of the Titan Engagement", with deaths during the fight reported beside it. Retargeting and Frenzy (decision batch 13) measure 0.137 at the reference start at Frenzy's halved rate, 0.070 with Frenzy off, and 0.174 at the rate as first written; no rate or cap lands 0.08 with retargeting on, so the band moved as 8-31 moved it. OQ-140 still re-sets it after the playtest.
   And OQ-140, append:
   > - **Revised by the round 3 retune (R2):** the Medium band stands at 0.15 through the end; the default Squad reads about 0.050 PC deaths a fight on the standard Medium under R1, against this target's 0.125. Still in waiting.
6. `data/engagement/tuning.yaml`, the batch 13 header comment (lines 43 to 58): "rising 1 a round to a cap of 3" reads "rising 1 every second round to a cap of 3 (the round 3 retune halved the rate, R1)", and the stale marker paragraph gains: "The retune has run and is ruled on in docs/reviews/round-3-retune-decisions.md; the confirming run re-reads every figure under R1 to R5."
7. The site's tuning page (`site/src/content/gm/tuning-the-fight.mdx`) and the packet's GM tuning notes quote no band value that changes here; if either quotes "at most 0.08", it reads "at most 0.15".

**Needs the confirming run:** yes. The bands are read on it, with the second-seed rule.

---

## R3. Neither held alternative is taken

**Ruling.** The hooked-by-strike exemption from retargeting (round 3 review 1, C6, held) and downgrading the entry instead of retargeting (13-9, held) are both left where they are held. Neither is a lever for this retune.

**Reasoning, with the numbers.** The exemption cuts deaths (0.174 to 0.120 at cap 3; 0.073 at cap 1) by one mechanism only: it puts the Thrash share back to 43% of cards, against 16% with retargeting and 41% with no retargeting at all. It is retargeting switched off for the case that matters most, the striker parked at Blind Spot, which is the exact case 13-9 was made for. It also puts killed by round 3 back to 66% for the same reason. It is self-defeating as a lever, as the orchestrator suspected, and C6 held it only for the case that the lone-strike band breaks upward, which it has not (Target 2's move is R4's, and the lone cut does not read the table). Downgrading reads 0.125 at cap 3 and 0.074 at cap 1 with Thrash at 5%, which looks like a fix until the next column: 40% of cards are downgraded, and on the standard Medium a holder at Distant can be reached only by Fixed Grin and one at Blind Spot only by Fixed Grin and Shake Off, so the monster grins at the soldier it cannot reach. That is the owner's complaint in the round 3 feedback ("the Titan only does 1, 2, whatever") with a different name on the card, and 13-9 rejected it in those words ("it keeps the Titan fixated on the person deliberately standing where it cannot hurt them"). It also holds killed by round 3 at 66% because the parked striker stays parked. Both stay held, and the record does not need to name a condition for taking them, because the retune has now measured them and neither does what a lever must.

**Apply.** None to the rules. One line each, so the record shows they were measured:

1. `docs/rules/DECISIONS-2026-09-14.md`, 13-9, the **Rejected, and kept in the file** paragraph. Append: "Measured in the round 3 retune (R3): at Frenzy's cap of 3 it reads 0.125 deaths against retargeting's 0.174 on the reference start, with 40% of cards downgraded and 5% Thrash, and the holder it cannot reach is grinned at instead of flailed at. Not taken."
2. `docs/adr/0010-teamwork-from-titan-attention.md`, the round 3 review 1 amendment, after "and is not taken now." append: "Measured in the round 3 retune (R3): the exemption reads 0.120 deaths at Frenzy cap 3 against 0.174, by restoring the Thrash share to 43% of cards; it is retargeting switched off for the parked striker and is not a lever."

**Needs the confirming run:** no.

---

## R4. Target 2's band reads 8% to 16%; the cause is decision batch 11

**Ruling.** ADR-0014's second target reads "between 8% and 16% on a cut made directly after Break Attention from the Rookie's fight-start Stress of 1", in place of "8% and 14%". Nothing else in the target moves: "about 10%" becomes "about 1 in 7" where the prose says it, the Levi-grade band stays 45% to 55% (52.0%, Met), and the in-fight cut is still reported beside it and not tuned.

**Reasoning.** The fresh cut is a Strength roll with the blade's Gear Dice and a Push; it reads no Titan table, no Health, no Frenzy. Its move from 13.0% to 15.0% is entirely decision batch 11's rule that a Push re-rolls Gear Dice showing 2 to 5: with it off and nothing else changed the Rookie reads 12.93% and the Levi-grade soldier 47.42%, the previous run's figures. Batch 11 was the owner's, taken whole ("no part of it holds on its own"), and it made every Push stronger by design; Target 3 absorbed the same push inside its band. The levers that would put the Rookie back under 14% each break something the record protects: Nape Depth 5 gives 4.4% and pulls the Levi-grade soldier to 33.7%, the same failure batch 3 recorded; excluding the blade's Gear Dice from the re-roll unpicks the owner's package; Nape Depth is in any case reserved. The precedent is batch 3, which re-read "about 10%" to 8% to 14% when the fight-start Stress of 1 added a Stress Die to the pool and accepted the measured 13.1%. The same reading applies to the same kind of cause. The design's claim, that a lone Rookie's cut is a long shot and a Levi-grade soldier's a coin flip, holds at 1 in 7 and 52%. This is batch 11's cost, not batch F's, and the retune's Frenzy levers have nothing to do with it; naming that was worth more than fitting it.

**Apply.**

1. `docs/adr/0014-numbers-tuned-to-design-targets.md`, the body's second target: "between 8% and 14%" reads "between 8% and 16%"; the amendment paragraph of R2 item 4 records why.
2. `data/engagement/tuning.yaml`, `solo_nape`: `target` "between 8% and 14%" reads "between 8% and 16%"; `tolerance` reads `{rookie_fresh_cut: 8% to 16%, levi_grade: 45% to 55%}   # ADR-0014, as amended in decision batch 5 (OQ-127) and by the round 3 retune (R4): batch 11's Gear Die re-roll on the Push`; `measurement_point` "(this model: 13.1%)" reads "(this model: 13.1% before decision batch 11, 15.0% after it)".
3. `data/titans/tuning.yaml`, `adr_0014_targets_quoted`: `bands`, `lone_strike` reads `{rookie_fresh_cut: 8% to 16%, levi_grade: 45% to 55%}`; the `lone_strike` quotation's "between 8% and 14%" reads "between 8% and 16%"; the `verdicts` `grab` or lone paragraph's "(8% to 14%)" (line 403) reads "(8% to 16%)" and its figure follows the confirming run.
4. `docs/rules/05-titan-engagement.md`, section 5.13 (line 1211): "succeeds 13.0% of the time, inside ADR-0014's band of 8% to 14%" reads "succeeds 15.0% of the time, inside ADR-0014's band of 8% to 16% (re-read by the round 3 retune, R4, because decision batch 11's Push re-rolls the blade's Gear Dice; 12.9% without that rule)"; the OQ-79 design note (line 1233) quotes the amended target. `docs/rules/06-standard-titans.md` line 625 the same.
5. `docs/rules/OPEN-QUESTIONS.md`, OQ-79. Append:
   > - **Revised by the round 3 retune (R4):** the band reads 8% to 16% on the fresh cut. Decision batch 11's Push re-rolls the blade's Gear Dice, which moved the fresh cut from 13.0% to 15.0% (12.9% with the re-roll off, nothing else changed) and the Levi-grade cut from 47.2% to 52.2%; Nape Depth 5 reads 4.4% and 33.7%, and the batch 11 package is the owner's, taken whole. Same reading as batch 3's, same kind of cause.
6. The site and the packet quote no lone-cut band; where the site's tuning page quotes "about 10%", it reads "about 1 in 7".

**Needs the confirming run:** no; the run re-reads the figure as a check and it is exact to 0.1 points.

---

## R5. The standard Large Titan's Bite reaches In Reach; the bar is judged after that

**Ruling.** In `data/titans/standard-large.yaml`, Bite's `position_requirement` reads `[in-reach, on-body]`, as the Small's and the Medium's Bites do. Its fallback stays Crush, which is now reached only when no soldier is In Reach or On Body. The Sprinting Abnormal's bar, every one of its 27 rows in both orders, is judged on the confirming run with that Large as the ceiling twin, and is not judged on this run: on this run its ceiling twin sits below its floor twin at every Frenzy setting, so its failures say nothing about the Abnormal.

**Reasoning.** This is the one ruling that touches a table, and it is made because nothing else meets the case. Chapter 6 calls the Large "the hardest standard fight Phase 1 accepts" and builds the bar on it: the Abnormal must be deadlier than the Medium's reference row and no deadlier than the Large's twin row. Measured on this run's rules, the Large is the softest standard Titan but the Small: 0.053 against the Medium's 0.070 with Frenzy off, 0.128 against 0.137 under R1, 0.159 against 0.174 as shipped. The interval the bar bounds is empty, and the report's 25 bar failures, every one but a single Critical Injuries floor in the support rows a ceiling or a winnable limit, are that emptiness, not a property of the Abnormal (which sits at 1.1 times the Medium, against 1.45 times before). The cause is in the reconstruction above: the Large killed through falls, from Thrash and Shrug Off at 9 Attack Dice on a soldier with Health 4, and at Health 6 that path is gone (0.112 to 0.038), while retargeting takes the Thrashes away too. Its Bite, which the OQ-101 design note put On Body only because "a Large Titan's mouth is far above the ground", never reached a Squad that stayed off its body, so with the falls gone the Large's only kill is a Grab that needs an arm. Widening the Bite to In Reach, the requirement every other Bite in Chapter 6 has, restores the Large as the hardest fight (0.210 under R1, 0.122 with Frenzy off, against the pre-batch-13 0.14), and with it every limit of the bar's reference and helpers rows holds in both orders by 2.7 standard errors or more, the Abnormal sitting between 0.137 and 0.217. The alternatives measured are worse: Bite falling back to Grab keeps the fiction but funnels two results into the Grab (0.67 Grabs a fight against 0.42, the doubling the Grab guard exists to catch) and stalls the kill (64% by round 3 against 69%); Nape Depth 5 reads 0.460 deaths, a median kill in round 4, and 21.6% no kill against the band's 15%, and it is a reserved lever besides. The Large's constraints hold with the change: In Reach meets 5 results in 6 (at least 4), one Grab result, one lethal result, and the kill share at Frenzy 0 is untouched because Position requirements do not enter the move-up. The fiction is amended, not abandoned: the Large stoops to bite; it is far above the ground and it comes down.

This reopens one line of a Chapter 6 table and rewrites one design note of OQ-101, which a decider wrote (batch 4). It does not touch Attack Dice, Nape Depth, or Tempo. The promise in 13-9 and 13-10 that no table is re-authored *for retargeting or Frenzy* stands: this is re-authored because Health 6 removed the Large's kill and the Large must anchor the bar, and the confirming run is where the owner sees it. The one risk the run must read: the Large's Jam test, whose "table" reading (25.1% for two Titans) moves toward its "every card at the kill pool" reading (31.0%) as Bite reaches the In Reach holder; both are under a third today.

**Numbers under R1, Large reference start:** 0.210 +/- 0.003 deaths through the end (0.128 without the change), 1.16 Critical Injuries, 0.42 Grabs, 68.6% by round 3, median 3, 5.7% no kill. The bar's reference row: Abnormal 0.155 against the Large twin 0.217 and 0.214 (ceiling holds, z -16.8 and -16.4), against the Medium reference 0.138 and 0.137 (floor holds, z -5.3 and -5.6), no kill 5.41 against 5.76 and 5.35 against 5.68 (winnable holds), Critical Injuries 0.92 against the Medium twin's 0.83 (floor holds), median 2. The helpers row holds every limit by 3.8 standard errors or more.

**Apply.**

1. `data/titans/standard-large.yaml`, the `bite` entry: `position_requirement: [on-body]` reads `position_requirement: [in-reach, on-body]   # on-body alone until the round 3 retune (R5, docs/reviews/round-3-retune-decisions.md): at Health 6 the fall from a flail no longer kills, so the Large's Bite must reach the ground`. Its `text` gains "It stoops," at the front if the sentence reads well; otherwise unchanged. Then `uv run --with pyyaml python tools/probes/chapter-06/render.py write` and `check`, so Chapter 6's rendered rows (line 227) follow the data.
2. `docs/rules/06-standard-titans.md`, the design note at line 244. Replace "A Large Titan's mouth is far above the ground, so Bite needs a soldier On Body and becomes Crush against one In Reach." with:
   > A Large Titan's mouth is far above the ground, and until the round 3 retune its Bite needed a soldier On Body and became Crush against one In Reach. That left a fall from a flail as the Large's only kill against a Squad that kept off its body, and Health 6 and retargeting both remove that fall by design: with neither rule the Large read 0.038 deaths a fight against the Medium's 0.038, and with retargeting 0.053 against 0.070, under the twin the bar reads it as. So it stoops: Bite reaches In Reach as every other Bite in this chapter does, and Crush is its fallback only when nobody is within reach (round 3 retune, R5; `docs/reviews/round-3-retune-decisions.md`).
3. `data/titans/tuning.yaml`, `targets`, `abnormals`, `rule`: after "the hardest standard fight Phase 1 accepts, gives the winnable limit and the ceiling" insert "(read with its Bite reaching In Reach, as the round 3 retune set it, R5; before that the Large read below the Medium at Health 6 and the bar had no solution)". The `verdicts`, `sprinting_abnormal` paragraph is re-written from the confirming run (R6).
4. `docs/rules/OPEN-QUESTIONS.md`: append to OQ-101 "**Revised by the round 3 retune (R5):** the Large's Bite reaches In Reach; the design note is rewritten"; to OQ-103 "**Revised by the round 3 retune (R5):** the bar is judged on the confirming run with the Large's Bite reaching In Reach; on the retune's first run the Large twin sat below the Medium reference at every Frenzy setting and every ceiling and winnable failure was that"; and open and decide:
   > ### OQ-198: The standard Large Titan is softer than the Medium at Health 6
   > - **Type:** Simulator target (the round 3 retune)
   > - **Arose in:** `docs/reviews/round-3-retune-decisions.md`, R5; `docs/reviews/simulator-report.md` sections 2.1, 5.1, and 6.15; `data/titans/standard-large.yaml`; Chapter 6 section 6.4.
   > - **Related:** OQ-101, OQ-103, OQ-140, OQ-190, OQ-192.
   > - **Question:** With Health 6 the Large's Thrash and Shrug Off falls no longer kill, and its Bite, On Body only, never reached a Squad off its body, so the Large read 0.038 deaths a fight with neither batch 13 rule (0.112 at Health 4), 0.053 with retargeting, and below the Medium at every Frenzy setting, and the Abnormal's bar, which reads the Large as its ceiling and the Medium as its floor, bounded an empty interval.
   > - **Options:** (a) Bite reaches In Reach as well as On Body (0.122 with Frenzy off, 0.210 under R1; every bar row measured holds). (b) Bite falls back to Grab (0.108 and 0.184; 0.67 Grabs a fight, the doubling the Grab guard exists to catch). (c) Nape Depth 5 (0.460, median 4, 21.6% no kill; a reserved lever). (d) Leave it and read the bar as unjudged.
   > - **Status:** Decided (round 3 retune, R5)
   > - **Decision:** (a). One table line and OQ-101's design note; nothing reserved is touched. The confirming run reads the whole bar, the Large band, and the Large's Jam test on it.
   > - **ADR:** ADR-0014, as amended by the round 3 retune.
5. Site and Foundry read the Large's table from the shared data (ADR-0020, ADR-0025), so the Bite's requirement flows through their builds; the packet's Large stat block (line 4636's table) re-renders from the YAML under `HANDOFF.md`'s "the packet follows the YAML". The site's Large page prose, if it says the Large bites only a soldier on its body, reads "its Bite reaches a soldier In Reach or On Body".
6. `docs/rules/DECISIONS-2026-09-14.md`, batch 15's table (R1 item 9) carries R5 with "amends one Chapter 6 table line and OQ-101's note; the bar is judged on the confirming run".

**Needs the confirming run:** yes, and it is the reason the run exists beyond R1: the bar's 27 rows in both orders with second seeds where the rule asks, the Large band, the Large's Jam test (both readings, one and two Titans), the setup mix, and every Large sensitivity row.

---

## R6. The confirming run, and what it re-renders

**Ruling.** After R1 to R5 are applied, one full run (`uv run --with pyyaml python tools/sim/run.py`, about 50 minutes) is the confirming run. It is a check, not a retune: every band and target above is expected Met on the figures here, and a figure past a band by more than the second-seed rule allows comes back to the decider with this file open. Every figure paragraph the run renders is then re-rendered or re-written by the drafter from the report: Chapter 5 section 5.13, Chapter 6 section 6.6 (the Medium, Small, Large, and Abnormal notes and the bar's verdict), both tuning files' `verdicts`, `data/titans/probe-figures.yaml` where the run re-commits it, and the stale markers in both tuning files and ADR-0014, which come off. Nothing else moves: Attack Dice, Nape Depth, Tempo, every Attention Ladder, the Grab, the retreat clock, the Abnormal's values, and the Health formula all stand.

**What the run must read, beyond the bands:** the Medium bands on the reference start and on the bar's two runs of it (R2); Target 2 at 8% to 16% (R4); the bar in both orders with the Large's Bite widened (R5); the Large's Jam test, both readings; the by-Frenzy kill shares and the result-1 shares (round 3 review 1, C3 and C4) at the halved rate, which now first change on the round-4 card; the failed-striker measures of C6 against the lone band; the default Squad and first-Titan-Engagement rows, reported and not tuned (about 0.066 and 0.196 under R1); the Thrash share before and after retargeting (41% to 16% on the Medium); and the setup mix. It is also the run that reads batches 10 and 11 for the first time, which this report already did and this file does not repeat.

**Expected on the confirming run, for the reader checking it:** Medium reference start about 0.137 deaths, 0.84 Critical Injuries, 0.33 Grabs, 71% by round 3, median 3; bar runs of it about 0.142, 0.86, 0.35; Large about 0.21 deaths, 5 to 6% no kill, median 3; Small about 0.065 deaths, 0.76 Critical Injuries, median 2; Abnormal reference about 0.155, holding every limit against a Large twin near 0.215; Target 2 about 15.0%, Target 3 about 52%, Target 4 unchanged from this run.

**Apply.** `docs/playtest/HANDOFF.md` and `docs/rules/PROGRESS.md` name the order: apply R1 to R5, run, re-render, then the owner's read of the report before the first playtest.

**Needs the confirming run:** it is the run.

---

## Not ruled, and why

- **Attack Dice, Nape Depth, Tempo:** untouched. Batch F did not fall short; on the Medium it overshot, and on the Large what fell short was the Large's own Bite, which R5 fixes without them.
- **Frenzy's cap:** untouched at 3. Measured, its third step is worth 0.006 to 0.009 on the Medium under R1 and lands on the round the retreat clock fills.
- **The Critical Injuries band:** untouched at 0.5 to 0.9, and Met under R1.
- **The Abnormal's values:** untouched. It was never the bar's problem.
- **Target B (OQ-140):** in waiting, as the owner set it; R2 records where the default Squad now sits against it.
- **The owner's veto point:** R1's dial. If the first playtest is to run at the 0.08 lethality the owner chose before batch 13, the setting is retargeting with Frenzy off (0.070), and that is a rule removal the owner makes, not this ruling.
