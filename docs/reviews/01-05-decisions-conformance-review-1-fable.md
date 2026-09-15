# Chapters 1 to 5, conformance review round 1: escalation review (Fable)

Scope: one multi-rule odds question, escalated from the round 1 conformance review. Nothing else in Chapters 1 to 5 is reviewed here.

**The question.** Under decision batch 3's OQ-81 rule (Break Attention needs 1 for the Attention holder, 2 for anyone else, plus 1 for each decoy already spent on that Titan) together with OQ-79 (Medium Nape Depth 4 stays; ADR-0014's lone-Rookie bound is about 10%, 8% to 14% at fight-start Stress 1): how many rounds and Titan cards does a lone Rookie take to reach a usable Nape strike against the standard Medium Titan, and what is that strike's success rate?

**The conflict.** OQ-79 and OQ-81 (`docs/rules/DECISIONS-2026-09-14.md`, Batch 3) say the lone line "comes a median of 4 rounds after starting at Distant with 1.67 Titan cards against the soldier meanwhile", that "the lone line keeps two or three cuts a fight", and that the rejected decoy cap "would cost the lone soldier more (3.72 Titan cards before a usable strike against 1.67)". The drafter who applied batch 3 measured the rule as written at a median of 6 rounds and 4.93 Titan cards through round 12, found the rejected cap cheaper (3.29 cards through round 12, 3.72 overall), and kept the rule with the measured figures quoted (`data/engagement/tuning.yaml`, `solo_nape.card_order_wait`; section 5.13 of `docs/rules/05-titan-engagement.md`).

Read: `CONTEXT.md` (Break Attention, Opening, Blind Spot), ADR-0010, ADR-0014 as amended, ADR-0015; Chapter 1 sections 1.2 to 1.9; Chapter 5 sections 5.3, 5.5, 5.6, 5.7, 5.13; `data/engagement/attention.yaml`, `round.yaml`, `tuning.yaml`, `size-classes.yaml`, `grab.yaml`, `titan-harm.yaml`, `behavior-procedure.yaml`, `positions.yaml`, `anchor-ratings.yaml`; `data/gear/odm-gear.yaml`, `horses.yaml`, `squad-supply.yaml`, `falls.yaml`; `data/mind/stress-responses.yaml`; `data/harm/critical-injuries.yaml`, `down.yaml`; and the probes `tools/probes/chapter-05/core.py`, `simple.py`, `run_simple.py`, `fight.py`. I did not read the parallel reviews.

Odds come from two scripts in the session scratchpad, outside the repository and not committed; the appendix describes them. Every figure uses ADR-0014's reference Rookie: Strength 4, Agility 3, Perception 3, Health 4, Resolve 3, ODM Gear 2, horse 2, Blade Set 1, Talent 1 on the Nape strike, Stress 1 when the fight begins, no Talent dice on Break Attention or the dodge, against the reference Medium Titan (Tempo 1, Nape Depth 4) in Wooded terrain. 200,000 trials per cell unless stated.

## Verdict

**0 Critical, 1 Major, 3 Minor.**

**Which figure is right.** The drafter's. Both parties ran the same card-order model with the same per-attempt rates (82.5% at need 1, 49.7% at need 2, 20.7% at need 3). The decider's "median 4 rounds, 1.67 cards" is that model with **no escalation**: it reproduces to the digit as the drafter's `no_escalation` row (median 4, mean 4.85 rounds, 1.68 cards), and the decider's "3.72 for the cap" is the cap **added to no escalation** (mean 6.86 rounds, 3.73 cards). So OQ-79 and OQ-81 quote the lone line under the rule batch 3 replaced, and the sentence comparing the cap with escalation compares the cap with the old rule instead. Under the rule the decision adopted, the same model gives the drafter's 42.3% by round 4, 60.8% by round 12, 4.9 cards through round 12, and the rejected cap is cheaper on every column (86.7% by round 12, 3.3 cards). The decider's error is a stale measurement, not a probe bug: the OQ-81 text itself reasons that "a lone soldier always holds it, so OQ-79's figures do not move", which is true of the holder-only rule and false of the escalation the same entry adds.

Neither measurement, though, is the lone line a player would play, for two reasons the probes leave out:

- **The cards are face up.** The probe attempts Break Attention on every turn. A success made before the Titan's card in the same round is spent by that card before the soldier can strike; with escalation each such success raises the next need for nothing but one negated card. A player who can see that the Titan's card comes after theirs simply holds, and attempts only on rounds where the Titan's card has already come. That policy alone lifts the rule's 60.8% by round 12 to 79.6% and cuts wasted decoys from 2.3 to 0.8 per fight.
- **The lone Rookie's decoys are a budget.** One horse (retried on failure, gone on success), two flares at Funding 3 (`squad-supply.yaml`), one cloak, and a flare or cloak is spent when declared, success or not. With escalation the second success needs 2 (49.7%), the third 3 (20.7%), the fourth 4 (5.7%). A lone Rookie places 1.4 successful decoys per fight and can never place more than four; in 28% of lone fights the horse and both flares are gone before a usable strike arrives. "Two or three cuts a fight" is not available: the rule gives about two thirds of one cut.

Under the rule as written, on a full lone-fight model (Behavior Table, dodges and the turns they spend, Pushes, Stress Responses, gear wear, gas, falls, Critical Injuries, the Grab) with that policy and that budget:

| Lone Rookie, Medium Titan, Wooded, 12-round horizon | The rule (OQ-81) | No escalation | Rejected cap, no escalation |
|---|---|---|---|
| Fights with a usable Nape strike | 67.1% | 79.2% | 73.0% |
| By round 2 / 3 / 4 / 6 | 20.8 / 37.1 / 47.8 / 59.4% | 20.6 / 40.4 / 55.4 / 70.4% | 20.7 / 32.0 / 40.8 / 54.8% |
| Round of the strike, median / mean (fights that strike) | 3 / 3.87 | 3 / 3.96 | 4 / 4.74 |
| Titan cards resolved against the soldier before the strike | 2.57 | 2.48 | 3.33 |
| Titan cards against the soldier per fight | 3.09 | 2.73 | 4.28 |
| Critical Injuries per fight | 0.10 | 0.07 | 0.20 |
| Dead (devoured) / Down per fight | 1.9% / 1.8% | 1.3% / 1.3% | 3.8% / 3.8% |
| Decoy budget exhausted before a strike | 28.0% | 17.2% | 13.5% |
| Stress when the cut is made | 2.62 | 2.53 | 2.71 |
| Nape strike succeeds, given a usable strike | 14.4% | 14.1% | 14.4% |
| Titan killed per lone fight | 9.7% | 11.2% | 10.5% |

So the answer to the question: a lone Rookie who plays the cards reaches a usable Nape strike in about two thirds of fights within 12 rounds, most often in round 3 (median 3, mean 3.9 among those), after about 2.6 Titan cards have resolved against them (mostly Roars taken at Distant) and 0.03 Critical Injuries; that cut succeeds 14.4% of the time, at a Stress that the Roars have lifted to about 2.6; about one lone fight in ten ends in a kill. The other third of fights end with the decoys spent (28%) or the soldier devoured or Down (4%). The escalation is the single largest cost in that picture: without it, 79% of fights reach a strike and 17% run out of decoys.

Nothing here makes an ADR-0014 target unreachable. The 8% to 14% band is defined at fight-start Stress 1 on a fresh soldier's cut and is met (13.1% in `solo_nape`); the full-rules 14.4% is the same cut after Roars, at the band's top edge (finding 3).

## Findings

### 1. Major. OQ-79 and OQ-81 rest their lone-soldier reasoning on figures measured without the escalation they adopt

**Location.** `docs/rules/DECISIONS-2026-09-14.md`, OQ-79 *Why* ("comes a median of 4 rounds after starting at Distant with 1.67 Titan cards against the soldier meanwhile"); OQ-81 *Why* ("so the lone line keeps two or three cuts a fight" and "The rejected cap would cost the lone soldier more (3.72 Titan cards before a usable strike against 1.67)"); OQ-81 *Decision* ("The rejected decoy cap ... stays rejected"). `tuning.yaml` `card_order_wait` carries the correct rows and its `no_escalation` and `..._rejected_decoy_cap` rows are the decider's figures.

**Problem.** Three claims in the two entries describe the rule batch 3 replaced, not the rule it adopted:

- "Median of 4 rounds ... 1.67 Titan cards" is the no-escalation row. Under escalation the same model gives no usable strike within 12 rounds in 39% of lone fights (naive policy) and 4.9 cards through round 12; on the informed policy with the decoy budget, 26% and 4.6 cards; on the full model, 33% of fights and 3.1 cards.
- "The rejected cap would cost the lone soldier more (3.72 against 1.67)" compares the cap with the old rule. Against escalation, the drafter's own model makes the cap cheaper (86.7% against 60.8% by round 12; 3.3 against 4.9 cards). The full model splits the question: the cap reaches a strike more often (73.0% against 67.1%) and runs out of decoys less often (13.5% against 28.0%), but costs more cards, harm and deaths (4.28 against 3.09 cards, 0.20 against 0.10 Critical Injuries, 3.8% against 1.9% devoured), because the blocked round keeps the soldier at In Reach under a live card. Neither rule dominates the other for the lone soldier; the decision says one does.
- "The lone line keeps two or three cuts a fight" counts per-attempt success rates (49.8%, 20.8%) as cuts. Each success is usable only if the soldier's next card comes before the Titan's (one in two), a flare or cloak is spent on failure, and the Rookie carries four decoys. The rule gives 1.4 successful decoys and 0.67 usable cuts per lone fight.

The decision's two grounds for escalation over the cap were the screen figures (0.562 against 0.534 cards a round when each is added to the round 2 rule) and the lone-soldier cost. The second ground is wrong. The choice may still stand on the first ground, on the tracking argument, and on the fiction, but the register cannot say the lone line is unchanged when the rule roughly halves the share of lone fights that ever reach a cut relative to no escalation (79% to 67%) and turns "two or three cuts" into two thirds of one.

**Play scenario.** A lone Rookie on a scouting Leg meets a Medium Titan in woodland. Round 1, the Titan's card comes first: Roar, Stress 2. She rides to In Reach and sends her horse (need 1): success, the decoy holds. Round 2, the Titan's card comes first again: it spends the decoy, resolves nothing, and she holds Attention at In Reach. She fires a flare (need 2 now): 49.7%, fails, the flare is gone. Round 3, her card comes first: she pulls back to Distant. Round 4, the Titan's card first: Roar, Stress 3; she moves in and fires her last flare at need 2: success. Round 5, her card first: she flies to Blind Spot and cuts, at Stress 3, needing 4: about one in seven. If the Titan's card had come first in round 5 instead, she would have had no decoy left in Wooded (the cloak needs On Body or Blind Spot, and a wasted success would have raised the need to 3), and the lone line would be over with no cut made. That branch happens in 28% of lone fights; the decision text tells the GM the soldier keeps two or three cuts.

**Fix options.**

1. Keep escalation. Add a `Revised on apply:` line to OQ-79 and OQ-81 replacing the three sentences with the figures under the rule: on the drafter's card-order model, 60.8% of lone fights reach a usable strike by round 12 with 4.9 cards through round 12 (the cap: 86.7% and 3.3); on the informed policy with the Rookie's decoy budget, 67% of fights reach a strike (median round 3), 2.6 cards resolve against the soldier before it, 28% of fights spend the horse and both flares first, and the cut succeeds about 14%. State that the cap's rejection rests on the screen rows (0.562 against 0.534) and the fiction, not on the lone soldier, for whom the two rules trade strikes against harm. Add the decoy budget and the face-up-card policy to section 5.13's lone-soldier note and `tuning.yaml` `card_order_wait.model` (finding 2). No ADR change.
2. Re-open the cap-against-escalation choice as a new decision entry, measured under the adopted rule on the informed policy with the decoy budget, quoting both models' columns above, since the entry's stated comparison never measured the two against each other.
3. Adopt holder-only needs with no escalation, which `tuning.yaml` already measures for the screen (0.601 cards a round and 0.42 Critical Injuries per fight beside the holder, against 0.661 and 0.47 with both rules) and which restores the decider's lone figures exactly on the card-order model (median 4, 1.7 cards) and gives 79% of lone fights a usable strike on the full model. This costs the Squad case 0.06 Titan cards a round and gives up "a Titan fooled once comes back fixated"; it is the smallest rule that meets OQ-81's stated goal of ending the round 2 screen (0.413 cards a round). A decision change, no ADR change.

### 2. Minor. The chapter's lone-line figures describe a policy no player would use, and its "median of 6 rounds" mixes fights that never strike into the median

**Location.** `docs/rules/05-titan-engagement.md` section 5.13, *A lone soldier after Break Attention* ("A usable strike comes a median of 6 rounds in: within 4 rounds in 42.3% of lone fights and within 12 in 60.8%, with 4.93 Titan cards against the soldier through round 12"); `tuning.yaml` `solo_nape.card_order_wait` (`the_rule: [6, 42.3%, 50.8%, 60.8%, 4.93]`, `model`, `verdict`); `tools/probes/chapter-05/simple.py` `solo_wait`.

**Problem.** The figures reproduce (I get 6, 42.3%, 50.9%, 60.9%, 4.91), but two things about them mislead a reader. First, `solo_wait` attempts on every soldier turn, so half of all successes are placed before the Titan's card in the same round and are spent by it; with escalation each wasted success raises the next need, and with the horizon at 1,000 rounds 18.5% of trials still never strike. The "median of 6" is the median over a distribution whose upper 40% is pinned near 1,000; among fights that do strike the median is 4, and the honest statement is that two lone fights in five reach no cut in 12 rounds. Second, the model ignores that the cards are dealt face up (section 5.3: "Cards are dealt face up") and that the Rookie has four decoys. On the informed policy with the budget, the card-order model gives 74.2% by round 12, median round 3 among fights that strike, 2.7 cards before the strike, and 4.6 cards through round 12; the full model gives 67.1%, 3, 2.6 and 3.1.

**Play scenario.** A GM reads section 5.13 to set expectations for a session in which a player character is cut off: "a usable strike comes a median of 6 rounds in" suggests a slow but reliable approach. At the table the soldier either cuts in round 3 or 4 or runs out of decoys by round 5; six-round waits are rare. The note also says nothing about the fact that in Wooded, Sparse and Open terrain a Break Attention made from Distant can never be followed by a strike (no step reaches Blind Spot from Distant in one move), which is the first thing the lone player needs to know.

**Fix options.**

1. Reword the note and `tuning.yaml` `verdict`: "Under Break Attention's escalating needs about a third of lone fights never reach a usable strike within 12 rounds: on the probe's every-turn policy 39%, and 26% for a soldier who attempts only after the Titan's card has come and who carries the Rookie's horse, two flares and cloak. Among fights that reach one the median is round 3, after about 2.7 Titan cards against the soldier. Without escalation, 3% and 11%." Add one sentence that the Break Attention must be made from In Reach, or from Blind Spot with a flare or the cloak, to be usable the next turn in Wooded terrain.
2. Add the informed policy and the decoy budget to `solo_wait` as two arguments, and report its rows in `card_order_wait` beside the naive row, with the naive row kept as the upper bound on waste.

### 3. Minor. The full-rules lone cut lands at the band's top edge because Roars lift Stress before it

**Location.** ADR-0014 body, second target; `tuning.yaml` `solo_nape.model` and `verdict`; section 5.13 *Design note (OQ-79)*.

**Problem.** The band is measured on a fresh Rookie at Stress 1 who makes up to three need-1 Break Attentions and then cuts (13.1%). In a lone fight the soldier waits at Distant, where the reference table can only Roar or Thrash, and each Roar adds 1 Stress with no dodge. The cut is therefore made at a mean Stress of 2.6, and Stress Dice add successes, so the success rate given a usable strike is 14.4% on the rule (14.1% without escalation; 11.8% from fight-start Stress 0). That is inside "about 10%" and at the edge of "8% to 14%". It is not a miss, because the target names the Stress it is measured at, but the ADR-0014 simulator's re-measure "with the full rules" (OQ-79) will read 14.4%, and the entry should say in advance how that reads against a band defined at Stress 1.

**Play scenario.** The simulator's first run reports the lone Rookie at 14.4% and a reviewer flags the band as missed by half a point; the decider then re-litigates Nape Depth 4, which OQ-79 already settled on levers that were all measured and rejected.

**Fix options.**

1. In `tuning.yaml` `solo_nape.verdict` and the OQ-79 design note, add: "The full-fight model makes the cut at a mean Stress of about 2.6, after the Roars a soldier takes while waiting at Distant, and succeeds 14.4% of the time; the band is read at the Stress the cut is made at, so the simulator reports both the fresh cut and the in-fight cut, with the Stress at the cut beside it."
2. Widen the band's wording to "8% to 15%" in ADR-0014 when the simulator confirms the in-fight figure, as a `## Amended` line under OQ-79's authority.

### 4. Minor. "Starting at Distant" is claimed but not modelled, and the Distant start changes the lone line

**Location.** `docs/rules/DECISIONS-2026-09-14.md`, OQ-79 *Why* ("comes a median of 4 rounds after starting at Distant"); `tuning.yaml` `card_order_wait.model` ("Card order only").

**Problem.** `solo_wait` has no Positions. The lone soldier's Position decides what the Titan can do to them (only Roar reaches Distant; Swat, Grab and Bite reach In Reach; every card at Blind Spot is a knock-loose with a high fall), and in Wooded terrain a Break Attention from Distant can never be followed by a strike, so the soldier must be at In Reach when the decoy is placed and fly one step to Blind Spot on the next turn. The decision's "after starting at Distant" reads as if the two moves were counted; they were not. In the full model the start Position barely moves the figures (starting dismounted with the horse at Distant gives 67.0% and 2.57 cards, the same as mounted), but the sentence attributes precision the probe does not have.

**Play scenario.** A player at Distant sends their horse on a round in which the Titan's card has already come, succeeds, and on their next turn discovers that Distant to Blind Spot is two steps: the decoy is spent by the Titan's next card, the need rises to 2, and the horse is gone. Nothing in section 5.13 or the OQ-79 entry warned them; section 5.2 does, two hundred lines earlier.

**Fix options.**

1. Drop "after starting at Distant" from OQ-79 under the `Revised on apply:` line of finding 1, and add to section 5.13's lone-soldier note the one-line requirement that the decoy be placed from In Reach, On Body or Blind Spot (or from Distant only at the Urban and Giant Forest ratings).
2. Give `solo_wait` a Position, or point the note at the full lone-fight case as one of `simulator_cases`.

## Whether a decision or ADR change is needed

- **ADRs:** none. ADR-0010 holds (escalation is not a penalty for acting alone, though it falls hardest on the soldier with the fewest decoys), and ADR-0014's amended target is met on its own terms.
- **Decisions:** OQ-79 and OQ-81 need a `Revised on apply:` line correcting the three lone-soldier sentences and restating why the cap stays rejected (finding 1, option 1). If the owner wants the lone-soldier cost to be a ground for the choice, the choice is re-opened (options 2 and 3), which is a decision change, not an ADR change.
- **Chapter and YAML:** section 5.13's lone-soldier note, `tuning.yaml` `card_order_wait` and `verdict`, and `solo_wait` (findings 2 to 4). The rule text in section 5.6 and `attention.yaml` is unchanged by any of this.

## Appendix: the models

Both scripts live in the session scratchpad, outside the repository, and are not committed. Each seeds its own generator; 200,000 trials per cell.

**A. Card-order model** (`cardorder.py`). The drafter's `solo_wait` reimplemented, with per-attempt Break Attention rates for the reference Rookie at needs 1 to 7 rolled on the committed dice core (82.5, 49.7, 20.7, 5.7, 0.9, 0.1, 0.0%): each round the soldier's and the Titan's card come up in random order; a success holds until the Titan's next card, which then resolves nothing; a strike is usable if the soldier's next turn comes before that card; each decoy that has held adds 1 to the need. Four switches: escalation on or off; the rejected cap (no attempt on a Titan whose most recent card a decoy spent); the informed policy (attempt only on rounds in which the Titan's card has already come); the decoy budget (a horse retried until it succeeds and then gone, plus three one-shot decoys spent on any attempt). Rows quoted above:

| Policy | Struck by round 4 / 6 / 12 | Median rounds, all trials / trials that strike | Cards through round 12 | Decoys placed / wasted |
|---|---|---|---|---|
| Naive, escalation (drafter's row), 1,000-round horizon | 42.3 / 50.9 / 60.9% | 6 / 4 | 4.91 | 3.08 / 2.27 |
| Naive, no escalation (decider's figure) | 57.5 / 78.5 / 97.3% | 4 / 4 (mean 4.85; 1.68 cards before the strike) | 1.65 | 3.18 / 2.18 |
| Naive, no escalation, rejected cap (decider's 3.72) | 44.1 / 60.9 / 86.7% | 5 / 5 (mean 6.86; 3.73 cards before the strike) | 3.30 | 3.13 / 2.13 |
| Naive, escalation, rejected cap | 37.2 / 47.4 / 60.0% | 7 / 5 | 5.29 | 3.04 / 2.22 |
| Informed, escalation, unlimited decoys, 12 rounds | 49.7 / 64.1 / 79.6% | 5 / 4 | 4.41 | 1.62 / 0.80 |
| Informed, escalation, decoy budget, 12 rounds | 49.8 / 64.0 / 74.2% | 5 / 3 | 4.64 | 1.49 / 0.74 |
| Informed, no escalation, decoy budget | 57.7 / 77.5 / 89.2% | 4 / 4 | 3.23 | 1.79 / 0.89 |
| Informed, no escalation, rejected cap, decoy budget | 44.3 / 61.1 / 85.4% | 5 / 4 | 4.35 | 1.73 / 0.85 |
| Naive, escalation, decoy budget | 42.3 / 48.3 / 48.5% | 12 / 3 | 5.87 | 1.78 / 1.29 |

**B. Full lone-fight model** (`lone.py`, on a copy of the committed `core.py` for dice, Pushes, Stress Responses, Critical Injury tables and falls). The reference Rookie alone against the reference Medium Titan, one card each, face up, in Wooded terrain. Modelled: the Behavior Table procedure with move-up, no repeats, Position requirements and Thrash fallbacks; the lone soldier always holding Attention, so needs 1 plus decoys spent (2 plus decoys spent while Grabbed); the horse (usable while mounted or at the soldier's Position, no cost on failure, bolts on success), two flares and one cloak (spent when declared; the cloak only from On Body or Blind Spot); the dodge with ODM Gear or the horse while mounted, needing Severity, spending the earliest wholly unspent turn, one per round; Pushes, Stress Responses with lasting penalties, Gear Dice wear on Pushed rolls, the Jam and its fall, the two- or three-die Gas Roll, running dry and one spare canister; Critical Injuries crossing Health boxes, Down (which ends the lone fight), turn-limit Death Rolls; the Grab with the crush, the first counted turn's action spent, the lift, one Break Free at a 2-die penalty needing 2, and the devour; the Nape strike from Blind Spot with working ODM Gear, Strength 4 with Talent 1, Blade Set 1 and Stress Dice, needing 4, Pushing when short, own Openings never spent. Not modelled: Fear Rolls (no witnesses), Regeneration (nothing to regenerate), Field Repair. The trial ends at the first usable Nape strike or when the soldier is dead, Down, or has no decoy left with none holding, or at round 12.

Policy: wait at Distant; on a round in which the Titan's card has already come, move to In Reach and Break Attention with the horse, then with a flare once the horse is gone; if the decoy still holds when the soldier's next turn comes, fly to Blind Spot and cut; if the Titan's card spent it, attempt again from In Reach on the next such round, and pull back to Distant on a round in which the soldier's card comes first; dodge every harming behavior. Variants (12-round horizon, the rule): the Blind Spot line, in which the soldier flies to Blind Spot on the round the flare or cloak is thrown so a usable success needs no move, and holds their turn to dodge the knock-loose otherwise, reaches a strike in 67.0% of fights but takes 0.36 falls and 0.19 Critical Injuries per fight, with 8.7% Down; dodging only Grab and Bite gives 67.4% and 0.11 Critical Injuries; a 24-round horizon gives 67.5%; a dismounted start 67.0%; no flares (the horse alone) 48.4%, with 50.5% of fights exhausted; fight-start Stress 0 gives 66.2% and a cut that succeeds 11.8%. The no-escalation and cap rows in the verdict table run the same policy with the need fixed at 1 (2 while Grabbed) and, for the cap, no attempt on a Titan whose most recent card a decoy spent.
