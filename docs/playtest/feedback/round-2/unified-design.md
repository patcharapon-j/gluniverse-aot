# Round 2: Flight, Momentum, and the Field. The three designs merged

Owner direction (verbatim): "I actually like all a b and c / for gear dice thing what do you suggest then / other two fix make sense"

Design proposal only. No rule was changed and no YAML was edited. Supersedes the three separate designs in `design-proposals.md`, which stay on the page as the working. Figures from `docs/reviews/simulator-report.md` and `tools/probes/round-2/`.

Draw Attention (fix 1) and mounted movement (fix 2) are accepted by the owner and carry over from `design-proposals.md` unchanged.

## The three designs were the same design seen from three sides

Stacking A, B and C naively would give three currencies and a roll on every move, which is too much. They do not need stacking, because each supplies a different part of one mechanism:

| Design | What it really contributes |
|---|---|
| **C Approach Roll** | **the roll.** Flying is dice, every time. |
| **B Momentum** | **the currency.** What a good flight is worth, and why you keep moving. |
| **A Anchors** | **the clock.** What the field allows, and how the Titan takes it away. |

So: **C's roll produces B's currency, and A's clock caps it.** One roll, one currency, one shrinking battlefield. Nothing is dropped.

## The design

### 1. Flight

> **Flight.** An ODM move is a **Flight**. Roll for `fly` with your own ODM Gear. **The move's step happens whatever the result.** Each success gives you 1 **Momentum**, up to your cap. On no successes you come in loud: you set the **loudest** flag.

The step always happens, so movement is never slower or less reliable than it is today. What the roll decides is what the flight was *worth*, and whether you arrived badly. That is design C, with its teeth kept and its bottleneck removed.

### 2. Momentum

> **Momentum** is public and sits on your sheet. You lose all of it at the end of any round in which you made no ODM move. Spend any amount at any time, 1 each:
>
> - **Carry:** one more Position step on this move.
> - **Bite:** 1 Bonus Die on a strike or Break Attention this turn, against the Titan you flew relative to.
> - **Brace:** 1 Bonus Die on your next dodge this round.
> - **Quiet:** you set no flag this turn, the loudest flag from a failed Flight included.
> - **Clean line:** this round's Gas Roll is not made.

Keep flying or lose it. That is design B, and it inverts the thing the tuned baseline does today, where a striker reaches Blind Spot on round 2 and then stands still for the rest of the fight.

### 3. The Field

> **Anchors.** The Anchor Rating gives the Titan Engagement a public pool of **Anchors**. **Every soldier's Momentum cap is the number of Anchors left.** Anchors are never restored during a Titan Engagement.

| Anchor Rating | Anchors |
|---|---|
| Open | 0 |
| Sparse | 1 |
| Wooded | 2 |
| Urban | 3 |
| Giant Forest | 3 |

> **Wrecking.** A new Behavior Table effect type, `wreck`, destroys 1 Anchor. Like `telegraph` it applies whether the behavior landed or whiffed, because it is the Titan going through the treeline rather than an attack on a person. It goes on the heavy entries of each table. The falling Titan destroys 1 where it lands.

That is design A, and making Anchors the **cap** rather than a second currency is what lets all three coexist. One number on the battlefield, and when the Titan smashes it every soldier's ceiling drops at once. At 0 Anchors nobody holds Momentum and the fight has become Open, whatever it started as.

### 4. Terrain Traits

One printed line per rating, so each place has a face beyond its Anchor count. Candidates, not settled, and the tuning knob of last resort:

- **Open:** a mounted soldier's Break Attention gains 1 Bonus Die. The plain is the horse's.
- **Sparse:** the first Anchor wrecked each Titan Engagement is not lost. One good tree survives.
- **Wooded:** none. The tuned default stays the plain baseline.
- **Urban:** a soldier at Blind Spot is anchored to a roof and is not airborne, so a Jam does not drop them.
- **Giant Forest:** Carry costs no Momentum for the first step of any Flight. The Corps' home ground.

## What it feels like, and the numbers behind it

A Flight is one roll with four outcomes rather than a fact:

| Build | 0 (comes in loud) | 1 | 2 | 3+ | Mean Momentum |
|---|---|---|---|---|---|
| Reference Rookie, 6 dice | 33.5% | 40.2% | 20.1% | 6.2% | **1.00** |
| Flier template, Wirework 1, 8 dice | 23.3% | 37.2% | 26.0% | 13.5% | **1.33** |
| Flier, Wirework 3, 10 dice | 16.2% | 32.3% | 29.1% | 22.5% | **1.67** |

Three things follow that the current rules do not deliver:

1. **Every flight is a moment.** A third of a Rookie's flights go wrong, and going wrong means the Titan looks at you, which is the correct consequence in this game and costs no new machinery.
2. **Wirework stops being a dead Talent.** It is the difference between 1.00 and 1.67 Momentum a Flight, which is the difference between a soldier who arrives and a soldier who arrives with a die in hand. The Flier's own promise to "reach the hard Positions" is finally funded.
3. **The fight has an arc.** Round 1 in a giant forest is three Anchors and soldiers crossing two Positions a turn. By round 4 the Titan has wrecked the place and everyone is walking.

## Costs, honestly

**Table time.** Today the Squad rolls 3.57 dice pools a round and makes 0.57 Gas Rolls a round, which bounds how often anyone touches ODM Gear at all. Flight adds one pool per ODM move, and the design will also make soldiers fly more. Estimate **+1 to +1.5 pools a round against 3.57**, so roughly a third more dice in a Titan Engagement. That is the real price of design C's prominence, and it is the number to watch in the first playtest.

**Stress.** Every Flight is an attribute roll, so it rolls Stress Dice. A Rookie at Stress 1 takes a 1-in-6 Stress Response chance per Flight where today a move risks nothing. That is a feature (flying is frightening) and a cost (Stress Responses compound), and it feeds the Stress and Fear targets.

**Tuning.** Ranked by how hard each pushes on a measured target:

1. **Bite** is the dangerous one. Bonus Dice on strikes shorten the fight and move `prepared_squad_kill` (median exactly 3). **It is the first thing to cut** if the target moves, and the simulator should measure the design with and without it.
2. **The loudest flag on a failed Flight** feeds the PC Critical Injury and death targets, and it interacts with the accepted Draw Attention fix, since both now write the same flag. Measure them together.
3. **Anchor counts** are the global dial. Everything above scales with them.
4. **ADR-0010's legal route** must still hold with Anchors at 0: `families.route_check` has to confirm that a Nape strike stays reachable and Break Attention stays available. It should, because the one-step move is untouched, but it must be confirmed rather than assumed.

Because Flight replaces the move rather than adding to it, this cannot be measured as a sensitivity row. **It is a retune.** That is the honest difference from the single-design options, and it is the price of taking all three.

## The Gear Dice question: what I suggest

Two separate things got tangled, and they want separate answers.

### What actually makes blades run out: the swap, not the die

Blades cannot run out today because **Swap Blade Set spends nothing**: once per turn, at any point, costing neither the move nor the action. Raising the ruin rate cannot fix that, because the replacement is free.

> **Suggested now.** In a Titan Engagement, Swap Blade Set **spends the soldier's move**.

- It makes blades bite immediately, and it touches **no die and no tuned number**.
- It costs exactly the right thing. A move can change no Position, so a soldier at Blind Spot who ruins a blade still strikes that turn; what they lose is their Flight, and under this design losing a Flight means losing Momentum and losing ground. The over-committed Push that wrecks your steel now costs you your next move. That is the show.
- It does not close ADR-0010's route: a Nape strike needs a Blade Set in the handles (`without_gear: not_possible`), and a soldier can still refit with their move and strike with their action on the same turn.
- Rerun needed (the simulator already models Blade Set ruin), but **no tuned value moves**, so it is the cheapest kind of rerun.

### The Gear Die re-roll: a good change, aimed at the wrong target, and not yet

Read as the Stress Die's own pattern (re-roll 2 to 5, keep 6, lock 1), a Gear Die's 1 and its 6 both go from 16.7% to **27.8%**. The Push gets 67% better and 67% more dangerous at once, which is genuinely in ADR-0004's spirit and a good change on its own merits.

But it is not a blade fix (one ruin every 2.4 fights instead of every 4, so a soldier still walks out of any single fight with steel), and on its own it breaks a hard target:

| | ODM Gear 2 (issued at Funding 3 to 5) | ODM Gear 3 |
|---|---|---|
| Jam test today (bar: no more than a third; worst measured cell 28.3%) | 26.3% | 17.8% |
| Re-roll, as proposed | **53.1%** | **47.7%** |
| Re-roll, wear capped at 1 per Pushed roll | 46.8% | **24.2%** |

A higher rating does not rescue it on its own, because a higher rating rolls more Gear Dice. Only one tested combination stays under the bar:

> **Suggested at the retune, as one package:** the Gear Die re-roll (2 to 5 re-rolled, 6 kept, 1 locked), **plus** a Pushed roll wears the gear by at most 1, **plus** issued ODM Gear rises to rating 3. Measured at **24.2%** against a bar of a third.

That is three tuned values moving together, including a Funding-table change, and it touches every Pushed roll with a gear item in the game. It should not go in before the first playtest alongside a movement retune. Put it in the same package as the post-playtest Titan retune that OWNER-DECISIONS round 1 item 7 already schedules.

**So: swap costs the move now; the Gear Die package at the retune.** The first gives you what you asked for (blades that run out) this week and for free. The second gives you the Push economy you are reaching for, once there is playtest data to retune against.

## Implementation order

| # | Work | Files | Rerun |
|---|---|---|---|
| 1 | Swap Blade Set spends the move | `blade-sets.yaml`, `action-catalog.yaml`, chapter 4 section 4.4 | yes, no tuned value moves |
| 2 | Draw Attention fix, and its Talent | `attention.yaml`, `talents.yaml`, chapter 5 section 5.6 | yes |
| 3 | Mounted charge, and the double step at Open | `anchor-ratings.yaml`, `positions.yaml`, `horses.yaml`, chapter 5 section 5.2 | yes |
| 4 | Anchors: the pool, the per-rating row, the tracker | `anchor-ratings.yaml`, `engagement-setup.yaml`, `round.yaml` | yes |
| 5 | Flight and Momentum | `positions.yaml`, `action-catalog.yaml` (`fly`), `bonus-dice-sources.yaml`, `odm-gear.yaml`, `sheet-fields.yaml`, chapter 5 section 5.2, chapter 4 section 4.3 | yes, a retune |
| 6 | The `wreck` effect and the falling Titan's Anchor | `titan-format.yaml`, `titan-harm.yaml`, the four `data/titans/` tables, `tools/sim/rules.py` | yes |
| 7 | Terrain Traits | `anchor-ratings.yaml`, chapter 5 section 5.2 | yes |
| 8 | Packet | `wings-of-freedom-playtest-packet.html` | no |

Items 1 to 3 are small, independent, and can ship first. Items 4 to 6 are the design and go in one batch and one rerun, because measuring them apart would mean three reruns of the same fight. Item 7 is polish.

Process note: this reopens **OQ-74** (the step graph, which considered neither a rolled move nor a terrain resource) and touches **ADR-0004** (what a Push costs), **ADR-0010** (Draw Attention's rung, scoped to preserve its promise), and **ADR-0014** (every figure above). A decider opens the OQ entries and records the batch before any chapter or YAML changes, per `docs/playtest/HANDOFF.md`.
