# Zone retune: the decider's rulings

Rulings on batch E's rerun (plan stage 4, `docs/playtest/feedback/round-3/IMPLEMENTATION-PLAN-E.md`), read against `docs/reviews/simulator-report.md` and `tools/sim/results/results.json` (commit `153b9b0`: 949 cases and 52 second-seed runs, 61,408,000 trials, rules hash `0035c5a43fc832a3`, re-checks skipped because the probe figures predate zones). Made 2026-09-21 by the zone retune decider, under decision batch 16 (16-38 names the levers and their order) and ADR-0029, in the shape of `docs/reviews/round-3-retune-decisions.md`. Nothing here is applied; the **Apply** list under each ruling names every file and block, and Z5 says what the confirming run must read. Decision batch 17 (`docs/rules/DECISIONS-2026-09-14.md`) is the index.

**What is settled and was not reopened:** the zone model, derived Positions, and the Stride as a rule (ADR-0029, 16-1 to 16-19); wrecking made local and applying whether the behavior landed or whiffed (16-20); retargeting; Frenzy's shape (starts at 0, rises at a round-end step, capped, added to the behavior roll); the Health formula (lethality is not fixed through Health); Attack Dice, Nape Depth, and Tempo in reserve; every band and bar limit as batch 15 left them. Decision 16-38 names the Stride values, the Carry limit and mounted pace (OQ-200), and the terrain mix (OQ-202) as starting values the simulator moves, in that order; decision 13-10 names Frenzy's rate and cap as the simulator's. Z2 and Z3 move tuned numbers, which is this role's, and each says so and argues it.

## The rulings in one table

| # | Ruling (one line) | Moves a settled rule? | Moves a tuned number? | Needs the confirming run? |
|---|---|---|---|---|
| Z1 | The Stride stays **Small 1, Medium 2, Large 2, Sprinting Abnormal 3**. At every start the rerun measures, a Stride is taken over one zone and no more, so no value above 0 moves any figure, and 0 removes the rule | no | no (measured, confirmed) | no |
| Z2 | Frenzy rises at the end of **every third round** (the third, sixth, ninth), not every second; the cap stays 3 | no: 13-10 names the rate as the simulator's | the rate, 2 to 3 | yes |
| Z3 | The Sprinting Abnormal's **Pitch Headlong loses its wreck effect**; Run Past keeps its wreck | one table line of the Abnormal's; no rule | one entry's effect list | yes: the whole bar |
| Z4 | OQ-200 and OQ-202 are **decided (a)**: the Carry limit stays 2, the mounted pace stays 2, and the terrain mix stays 1 sparser, 2 to 5 the field rating, 6 denser | no | no (measured, confirmed) | no |
| Z5 | One confirming run after Z2 and Z3, then every figure paragraph is re-rendered; nothing else moves: not the Stride, OQ-200's or OQ-202's values, the wreck rule, any other entry's wreck, Attack Dice, Nape Depth, Tempo, Health, any band or bar limit | no | no | it is the run |

**Said plainly:** the owner's named levers do not move either miss. The Stride is inert above 0 (Z1), and the Carry limit, the mounted pace, and the terrain mix each move the Medium's deaths by at most 0.003 (Z4). The rise comes from two mechanisms of equal size on the Medium: the Stride existing at all, and wrecks, which no run before this one modelled. The Abnormal's miss is wrecks alone, and one entry's wreck in particular. So Z3 removes that wreck, and Z2 takes the Medium's overshoot back through Frenzy, the behavior lever the previous retune used and the one 13-10 hands the simulator. Attack Dice, Nape Depth, and Tempo stay in reserve because a behavior lever still works.

## How the figures were measured

A harness in the session scratchpad (`zh.py`, `t1.py` to `t4.py`) imports `tools/sim` unchanged, takes each case's configuration from `cases.all_cases()`, and runs `families.fight_job` in a Pool of 10 on seeds of its own (910000 up), with the value under test overridden in memory only: `rules.R.stride`, `R.carry_limit`, `R.zone_terrain`, `R.frenzy_rate`, `R.frenzy_cap`, `R.wreck_grace`; `engine.Titan.__init__` wrapped to drop the wreck effect from named entries; `engine.Fight.wreck_zone` stubbed (no wreck at all) or gated on a landed behavior. No file under `data/`, `docs/rules/`, or `tools/` was edited and `tools/sim/run.py` was not run. The diagnostic cells are the bar's own runs of each reference start, cutters first (`bar/cutters_first/...`), at 160,000 fights a cell; the verification is every bar case in both orders, the four Chapter 6 reference starts, and Chapter 5's reference, at 120,000 fights a cell, judged with `barcheck.check` under both death readings. The harness reproduces the report: as shipped it reads 0.1661 +/- 0.0016 deaths through the end on the Medium's bar run against the report's 0.1673 +/- 0.0019, the Abnormal's no kill 9.98% +/- 0.07 against 9.88%, and the Large twin's 7.35% +/- 0.07 against 7.28%.

"Deaths" below is deaths through the end of the Titan Engagement, the reading every band and bar limit is judged on.

### The diagnosis, one lever at a time (160,000 fights a cell, bar runs, cutters first)

| Cell | Medium deaths | Medium CIs | Large deaths | Large no kill, % | Abnormal deaths | Abnormal no kill, % | Abnormal Thrash / Stride reach, % |
|---|---|---|---|---|---|---|---|
| As shipped | 0.1661 +/- 0.0016 | 0.880 | 0.2730 | 7.35 +/- 0.07 | 0.2518 | 9.98 +/- 0.07 | 14.8 / 6.6 |
| Stride 0 on every table | 0.1462 +/- 0.0015 | 0.811 | 0.2463 | 6.96 | 0.2462 | 10.82 | 19.1 / 0.0 |
| Stride 1 on every table | 0.1646 +/- 0.0016 | 0.882 | 0.2725 | 7.36 | 0.2573 | 10.08 | 14.7 / 6.6 |
| Abnormal Stride 2 | | | | | 0.2570 | 10.15 | 14.7 / 6.6 |
| Carry limit 1 | 0.1694 +/- 0.0016 | 0.903 | 0.2789 | 7.58 | 0.2580 | 10.19 | 15.3 / 6.6 |
| Carry limit 3 | 0.1679 +/- 0.0016 | 0.886 | 0.2733 | 7.32 | 0.2544 | 9.93 | 14.7 / 6.6 |
| Wide mix (1 to 2 sparser, 6 denser) | 0.1686 +/- 0.0016 | 0.884 | 0.2740 | 7.39 | 0.2564 | 10.09 | 14.8 / 6.6 |
| Uniform field (OQ-202 option (d)) | 0.1656 +/- 0.0016 | 0.882 | 0.2697 | 7.23 | 0.2568 | 10.11 | 14.7 / 6.5 |
| No wreck at all | 0.1450 +/- 0.0015 | 0.816 | 0.2284 | 5.70 | 0.1625 | 4.78 +/- 0.05 | 12.7 / 7.8 |
| Wreck only when the behavior lands | 0.1636 | 0.869 | 0.2660 | 7.03 | 0.2021 | 7.00 | 14.0 / 7.2 |
| First wreck a zone takes does nothing, every rating | 0.1607 | 0.858 | 0.2561 | 6.74 | 0.2404 | 9.28 | 14.1 / 6.8 |
| Medium: Swat without its wreck | 0.1584 +/- 0.0016 | 0.863 | | | | | |
| Large: Heavy Tread without its wreck | | | 0.2660 | 7.08 | | | |
| Large: Crush without its wreck | | | 0.2628 | 6.76 | | | |
| Abnormal: Run Past without its wreck | | | | | 0.2228 | 8.34 +/- 0.07 | 14.2 / 7.0 |
| **Abnormal: Pitch Headlong without its wreck (Z3)** | | | | | **0.1917 +/- 0.0018** | **6.31 +/- 0.06** | 13.9 / 7.3 |
| Frenzy cap 2 (rate 2) | 0.1565 +/- 0.0015 | 0.875 | 0.2615 | 7.24 | 0.2454 | 9.96 | 15.1 / 6.6 |
| **Frenzy rate 3, cap 3 (Z2)** | **0.1423 +/- 0.0015** | 0.826 | 0.2369 | 6.74 +/- 0.06 | 0.2253 | 9.10 +/- 0.07 | 14.6 / 6.6 |
| Z2 and Z3 | 0.1423 +/- 0.0015 | 0.829 | 0.2376 | 6.62 +/- 0.06 | 0.1639 +/- 0.0016 | 5.57 +/- 0.06 | 13.7 / 7.3 |
| Swat and Pitch Headlong without wrecks, Frenzy cap 2 | 0.1494 +/- 0.0015 | 0.861 | 0.2607 | 7.29 | 0.1865 | 6.28 | 14.2 / 7.3 |

Counters behind the reading (as shipped): a Stride is taken on 0.21 cards a fight on the Medium and the Large and 0.35 on the Abnormal, and every one of them is one zone long (`stride_zones` equals `strides`), because the Squad is never more than one zone from the Titan when a card resolves. The Titan's zone loses its Blind Spot in 3.7% of the Abnormal's fights against 0.4% to 0.5% of the standard tables'. The Abnormal makes 1.90 Nape strikes a fight against the Large's 3.00, and 9.8% of its fights end in a retreat against 7.2%.

### The verification (120,000 fights a cell, Z2 and Z3 together, both orders)

| Figure | Cutters first | Strikers first | Limit | Reading |
|---|---|---|---|---|
| Medium deaths, Chapter 6 reference start | 0.1428 +/- 0.0017 | | at most 0.15 | holds, 4.2 standard errors inside |
| Medium deaths, the bar's run of it | 0.1416 +/- 0.0017 | 0.1417 +/- 0.0017 | at most 0.15 | holds |
| Medium Critical Injuries, Grabs, killed by round 3, median (reference) | 0.828, 0.321, 70.2%, 3 | | 0.5 to 0.9; 0.15 to 0.45; 55% to 75%; 3 | hold |
| Small Critical Injuries, median (reference) | 0.814, 2 | | at most 1.0; 2 | hold |
| Large no kill, median (reference) | 6.86%, 3 | | at most 15%; 3 | hold |
| Chapter 5's reference: killed by round 3, median | 70.8%, 3 | | ADR-0014 Target 1, median 3 | holds |
| Abnormal reference row: winnable | 5.79 vs 6.86, z -10.7 | 5.54 vs 6.61, z -10.9 | no kill at most the Large twin's | holds |
| Abnormal reference row: ceiling | 0.1695 vs 0.2423, z -24.4 | 0.1642 vs 0.2356, z -24.4 | deaths at most the Large twin's | holds |
| Abnormal reference row: reference deaths | 0.1695 vs 0.1416, z -10.9 | 0.1642 vs 0.1417, z -8.9 | more than the Medium reference | holds |
| Abnormal reference row: Critical Injuries floor | 0.923 vs 0.825, z -16.5 | 0.915 vs 0.825, z -15.2 | at least the Medium twin's | holds |
| Helpers row: winnable (the closest winnable limit) | 3.36 vs 3.60, z -3.2 | 3.35 vs 3.67, z -4.3 | | holds |
| Draw Attention row: ceiling (past as shipped) | 0.1663 vs 0.2423, z -25.7 | 0.1662 vs 0.2356, z -23.6 | | holds |
| Screen with Hook and Cut and Hamstring Line: Critical Injuries floor (OQ-199) | 0.511 vs 0.515, z +1.0 | 0.511 vs 0.509, z -0.4 | | within sampling; holds |

Every limit of every judged row holds in both orders under both death readings (the one figure past its twin is OQ-199's floor, cutters first, within sampling at +1.0). The two ladder rows R7 reports hold every limit as well (the standard ladder's floor 0.826 vs 0.825 and 0.820 vs 0.825, within sampling).

---

## Z1. The Stride stays Small 1, Medium 2, Large 2, Sprinting Abnormal 3

**Ruling.** No Stride value moves. The values 16-16 wrote are confirmed as measured, not starting values any longer, and `zone-combat-design.md` 3.6's "Stride values as the first lever" is recorded as tried and found inert at these starts.

**Why.** The design expected the Stride to act by distance: a Titan that closes further closes more often. The rerun shows it acts only by existing. Under 16-7 the Squad starts one zone out and closes on the Titan's zone on its own turns, so when a card resolves the holder is either in the Titan's zone or one zone away; every Stride the simulator records is one zone long, on every table. Stride 1, 2, and 3 therefore read the same (Medium 0.1646, 0.1661, and 0.161 on the report's row; the Abnormal at 2 reads 0.2570 against 0.2518 at 3), and only Stride 0 moves anything: the Medium to 0.1462 +/- 0.0015, which is the Stride's whole share of the rise, 0.020, the Thrash share back from 7.5% to 13.1% as 3.6 predicted. Stride 0 is a Titan that never moves, which 3.2 says the zone model cannot ship without, and it makes the Abnormal harder to kill, not easier (no kill 10.82% against 9.98%). The lever the design named is real only as the rule's presence, and the rule is the owner's.

**What would make it a lever again.** A start two or more zones out, a Skirmish or Set piece field, or a retreat chase. None is a reference start; the report's sensitivity rows (section 7.2) keep measuring 0, 1, and 3 so a later start that needs the Stride's size sees it.

**Apply.**

1. `data/engagement/size-classes.yaml`, the `stride` field's description and the history line "stride for every class (... measured first by batch E's rerun)", and `data/titans/sprinting-abnormal.yaml`, the `stride: 3` comment: append "(measured in the zone retune, Z1: at every reference start a Stride is taken over one zone, so values above 0 read the same; docs/reviews/zone-retune-decisions.md)". The values do not change.

## Z2. Frenzy rises at the end of every third round; the cap stays 3

**Ruling.** Frenzy's `rate` is **3**: it rises by 1 at the frenzy end step of the **third, sixth, ninth** round of the Titan Engagement and every third round after, never above 3, and the step does nothing at the end of any other round. Everything else about Frenzy stands as batch 15 left it: it starts at 0, a Titan that enters at the background-clocks step first rises at the next rising round's end, a flare-brought Titan rises with the others, it rises during a retreat, never falls, a corpse holds none, and the move-up rule wraps at Frenzy 0 only. The step reads the Titan Engagement's round count, which the tracker carries.

**Why this lever.** The Medium's deaths band is at most 0.15 and the rerun reads 0.1689 at the reference start and 0.167 on both bar runs. The design's first lever (Z1) and the second and third (Z4) cannot take 0.017 off. Two mechanisms put it there, of equal size: the Stride's presence, +0.020 (Z1), and wrecks, +0.021 (no wreck at all reads 0.1450), which the round 3 retune's confirming run never modelled (`data/engagement/tuning.yaml`, the corrected comment: that run held no Momentum, spent no Carry, and applied no wreck effect). Neither is a value: the Stride is the owner's rule, and 16-20 settled that a wreck steps the Titan's own zone whether the behavior landed or not. The Medium's one wrecking entry, Swat, is worth 0.008 (0.1584 without it), not enough alone and a table line on the reference Titan every band reads. Frenzy is the lever 13-10 hands the simulator, it is behavior and not dice, and it is the one the previous retune moved for the same band. Cap 2 at the present rate reads 0.1565 +/- 0.0015 and misses; rate 3 at cap 3 reads **0.1423 +/- 0.0015** on the bar run and 0.1428 +/- 0.0017 at the reference start, inside the band by 4 standard errors, and leaves every other band where it was (Critical Injuries 0.828, Grabs 0.321, killed by round 3 70.2%, median 3; Small and Large bands met).

**What it costs, said plainly.** R1 put Frenzy 1 on the round-4 card and Frenzy 3 on the round-8 card, where the retreat clock fills. At rate 3, Frenzy 1 is on the round-5 card, Frenzy 2 on the round-8 card, and Frenzy 3 only on the round-11 card, which a fight reaches only through a long retreat. The shape is intact and 13-10's purpose reads more strongly (a Squad that kills in the three rounds ADR-0014 targets, or in four, never sees Frenzy), but the top of the cap is now a retreat's and not the fight's. Keeping rate 2 and lowering the cap to 2 would keep the top in the fight, and it misses the band. That is the owner's dial: rate 2 cap 3 reads 0.166, rate 2 cap 2 reads 0.157, rate 3 cap 3 reads 0.142.

**Apply.**

1. `data/engagement/titan-format.yaml`, `frenzy`. `rate: 3`, comment: "rises at the frenzy end step of every third round of the Titan Engagement; the simulator moved it from 1 to 2 (round 3 retune, R1) and from 2 to 3 (zone retune, Z2; docs/reviews/zone-retune-decisions.md)". `rises`: replace "every even-numbered round of the Titan Engagement, the second, the fourth, the sixth, and so on" with "every third round of the Titan Engagement, the third, the sixth, the ninth, and so on"; "At the end of an odd-numbered round the step does nothing" with "At the end of any other round the step does nothing"; "the next even-numbered round's end" with "the next such round's end"; and the history sentence with "The rate was 1 as decision batch 13 first wrote it, 2 after the round 3 retune (R1), and 3 after the zone retune (Z2)." `why`: replace "it postures for three rounds and is trying to kill from round 4" with "it postures for four rounds and is trying to kill from round 5", and "meets Frenzy 3 on the round the retreat clock fills" with "meets Frenzy 2 on the round the retreat clock fills, and Frenzy 3 only in a long retreat".
2. `data/engagement/round.yaml`, `end_steps`, `frenzy`, `text`, and `gm_tracker`, `focus_titan_row`: "even-numbered round" becomes "third round (the third, the sixth, the ninth, and so on)" in each place, and "odd-numbered round" becomes "any other round".
3. `tools/sim/rules.py`, the Frenzy guard (line 870): the pattern follows the new `rises` wording. `tools/sim/engine.py` needs no change (`self.rnd % R.frenzy_rate == 0`), only its comment at line 2440.
4. `docs/rules/05-titan-engagement.md`: the end-step list (line 627), the tracker line (649), the Frenzy paragraph (713), and the worked example if it names a rising round. `CONTEXT.md`, **Frenzy**. OQ-193's revision line in `OPEN-QUESTIONS.md` gains "Revised again by the zone retune (Z2): every third round." The site, the packet, and Foundry follow in their stage-4 follow-ups (P3 for Foundry).

## Z3. The Sprinting Abnormal's Pitch Headlong loses its wreck effect

**Ruling.** In `data/titans/sprinting-abnormal.yaml`, Pitch Headlong's `effects` become `[{type: knock-loose}]`. Run Past keeps its wreck. No other value of the Abnormal's moves, and no other Titan's entry changes.

**What the miss is.** Sixteen judged cells fail the winnable limit ("no kill at most the Large twin's"), for example 9.88% against 7.28% at the reference start, cutters first, and the Draw Attention row fails the ceiling as well (0.303 against 0.272). The runner wrecks its own zone more than any standard Titan: Tempo 2 doubles its cards, two of its six entries wreck, and Pitch Headlong is also Headlong Lunge's fallback, so every Lunge rolled at a holder who is not In Reach or On Body becomes a wreck, and Frenzy lifts rolls toward that 6. A wreck applies whether the behavior landed or whiffed (16-20), and Pitch Headlong rolls 3 Attack Dice, so most of them whiff and still flatten the ground. And the runner almost never leaves: 0.35 Strides a fight, because its holder is in its zone. It stands in the zone it wrecks, Wooded to Sparse to Open, and with it goes the Squad's Momentum cap and, in 3.7% of fights, its Blind Spot: 1.90 Nape strikes a fight against the Large's 3.00, a retreat in 9.8% of fights. With no wreck at all the runner reads 4.78% no kill and 0.1625 deaths, so this is the whole miss. Batch 10 put the wrecks on the entries (commit `cce9d88`), batch 16 made them local, and no run before this one applied either.

**Why this entry, and why not the rule.** Removing Pitch Headlong's wreck alone takes the runner to 6.31% +/- 0.06 no kill against the Large's 7.35% (holds by about 11 standard errors) and its Blind Spot losses to none; removing Run Past's instead reads 8.34% and still fails. The rule-wide alternatives are weaker and wider: a wreck only when the behavior lands reads 7.00% against the Large's 7.03% on the same run (on the edge), and a grace on every rating's first wreck reads 9.28%; both reopen 16-20, which the owner settled, and both move every table. The fiction also points here: Pitch Headlong is "a slow, heaving roll that scrapes off whatever clings to it", a move against soldiers on its body, while Run Past is the pounding legs crossing ground that the wreck describes. R6 and R7 held the Abnormal's values because its values were never the bar's problem; on this run one of them is, through an effect no run before measured, and the change is to that effect only.

**What it does not do.** It leaves the runner the deadlier fight of the Medium's pair and inside the Large's ceiling: under Z2 and Z3 its reference row reads 0.1695 deaths against the Medium reference's 0.1416 (z -10.9) and the Large twin's 0.2423 (z -24.4), and its Critical Injuries 0.923 against the Medium twin's 0.825. Every judged row holds every limit in both orders (the verification table above).

**Apply.**

1. `data/titans/sprinting-abnormal.yaml`, `pitch-headlong`, `effects`: remove `- {type: wreck}`. Add to the stat block comment's list of values that differ from the medium row: "Pitch Headlong carries no wreck (zone retune, Z3): with Tempo 2 and as Headlong Lunge's fallback it flattened the runner's own zone to Open, and the Squad failed to kill it more often than the Large twin (docs/reviews/zone-retune-decisions.md)."
2. `docs/rules/06-standard-titans.md`, section 6.5: re-render the table and entry rows with `tools/probes/chapter-06/render.py` (the Effects cell of row 4 reads "Knock loose (fall: Crush)"). The section 6.5 design note gains one sentence citing Z3. `data/titans/tuning.yaml`, `verdicts`, `sprinting_abnormal`, is re-rendered from the confirming run.
3. Site, packet, and Foundry stat blocks follow in their stage-4 follow-ups.

## Z4. OQ-200 and OQ-202 are decided (a)

**Ruling.** The Carry limit stays 2 and the mounted pace stays 2 (OQ-200, option (a)); the terrain mix stays 1 sparser, 2 to 5 the field rating, 6 denser (OQ-202, option (a)). Both Open Questions close with this ruling and their provisional markers come off.

**Why.** Measured, none is a lethality lever: Carry limit 1 reads 0.1694 and 3 reads 0.1679 against 0.1661 as shipped; the wide mix 0.1686 and the uniform field 0.1656; each within 0.003 of the value in force, on every table and on the Abnormal's no kill (9.93% to 10.19%). The mounted pace moves only mounted rows (report section 7.2: pace 3 reads 0.186 against 0.167, pace 1 0.171), and the value in force is the one that neither raises lethality nor gives up the design's promise that a horse outpaces a striding Titan. With nothing to buy, the values chosen to close the gap stand.

**Apply.** `docs/rules/OPEN-QUESTIONS.md`, OQ-200 and OQ-202: **Status** "Decided", **Decision** "Zone retune, Z4 (decision batch 17): option (a), measured", with the figures above. `data/engagement/zones.yaml` (`carry_limit`, `zone_steps`) and `engagement-setup.yaml` (`zone_terrain`): drop the PROVISIONAL marker and cite Z4. `tools/sim/cases.py` keeps the `zones/` rows as sensitivity rows.

## Z5. The confirming run, and what it must show

**Ruling.** One full run (`uv run --with pyyaml python tools/sim/run.py --no-recheck`, then `--commit-probe-figures`) after Z1 to Z4 are applied, alone, from a tree nobody is editing; then every figure paragraph the run renders (`data/engagement/tuning.yaml`, `data/titans/tuning.yaml` verdicts, Chapters 5 and 6, the site) is re-rendered from it. Nothing else moves.

**It must show:**

- the standard Medium's deaths through the end **at most 0.15** at the reference start and on both bar runs. Expect about 0.142 +/- 0.002 on the bar runs. The reference start runs 12,000 fights (standard error about 0.006), so it may read past the edge by up to 2 standard errors on its first seed; the second-seed rule then judges it pooled, and it is a miss only if the pooled figure is past;
- Medium Critical Injuries about 0.83, Grabs about 0.32, killed by round 3 about 70%, median 3; Small Critical Injuries about 0.81; Large no kill about 7%, median 3; every ADR-0014 target Met as before (Frenzy does not reach Targets 2 to 5);
- the Sprinting Abnormal's bar holding every limit of every judged row in both orders, under both readings: winnable by about 10 standard errors at the reference start, and by 3 to 4 in the helpers row, the closest; the ceiling by 20 or more;
- OQ-199's cell (the screen with Hook and Cut and Hamstring Line, Critical Injuries floor) read as it falls: the harness puts it within sampling (+1.0 cutters first, -0.4 strikers first). If the run reads it holding or within sampling in both orders, the next decider may close OQ-199; this ruling does not;
- the sensitivity rows of section 7.2 re-read, with the Stride rows again equal above 0.

If a band or limit is past on the pooled figure, it comes back here; nothing is re-tuned in the drafting.

## Not ruled, and why

- **Stride 0**, which alone takes the Medium to 0.146: it removes the rule the zone model cannot ship without (Z1).
- **A wreck only on a landed behavior, or a first-wreck grace for every rating:** both reopen 16-20, move every table, and do less for the Abnormal than Z3 (7.00% and 9.28% no kill).
- **Swat's wreck, Heavy Tread's, Crush's:** worth 0.008, 0.007, and 0.010 on their own tables; with Z2 the bands are met without them, and the standard Titans' wrecks are what makes the ruins cost something, which is 16-20's point.
- **Frenzy's cap:** cap 2 alone misses (0.1565), and with Z2 it would only dull the retreat further.
- **Attack Dice, Nape Depth, Tempo, Health, any band:** a behavior lever works, so the reserve stays in reserve and no band is re-read.
