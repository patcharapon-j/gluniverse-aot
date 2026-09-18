# Round 2 design proposals: three ODM movement designs, and four targeted fixes

Owner direction (verbatim): "propose three possbile design to make the odm movement, flying etc more dtamic, * fix draw attention * also blade set cannot run out, let make it that gear dice is also rerolled on push * fix environment * fix mounted movment unique step * also wdym health is inert and wits/empath is thin"

Design proposal only. No rule was changed and no YAML was edited. Measured figures come from `docs/reviews/simulator-report.md` and from the two probes in `tools/probes/round-2/` (`swing.py`, `gear_die.py`), which are stand-ins in the manner of `tools/probes/chapter-05`, not the ADR-0014 simulator. Odds without a source are exact binomial computations at p = 1/6.

**On the last question first:** the Health and Wits/Empathy findings were wrong. Both are withdrawn, with the correction on the page, in `flatness-audit.md` findings 4 and 6. The short version is in *Two withdrawn findings* at the end of this file.

## Shared ground

All three designs hold these, so they can be compared on their merits rather than on their safety:

- **The ordinary one-step move stays free, unrolled, and guaranteed.** No design taxes movement. `research-prior-art.md` section F names the mobility bottleneck as the reason existing AoT games fail, and every design below adds an option above the guaranteed step rather than a toll on it.
- **No GM judgment enters.** Everything is printed and read off a table (ADR-0024, limits 8 and 10).
- **No Attention rung moves**, except in the Draw Attention fix, which is scoped to preserve ADR-0010's actual promise.
- **The environment is part of the design, not an appendix.** Each design carries its own terrain mechanic, because `swing.out` showed the Anchor Rating is currently a monotonic speed dial to the kill and nothing else: Giant Forest hands a striker Blind Spot on round 1, free and guaranteed; Wooded on round 2; Open never while the Titan stands.

Reference odds on a Fly roll (need 1 unless stated). Reference Rookie: Agility 3, Stress 1, ODM Gear 2, no Talent dice on `fly` (OQ-91), so 6 dice. Flier template: Agility 4, Wirework 1, so 8 dice.

| Pool | 1+ success | 2+ | 3+ |
|---|---|---|---|
| Rookie, 6 dice | 66.5% | 26.3% | 6.2% |
| Flier, 8 dice | 76.7% | 39.5% | 13.5% |
| Flier at Wirework 3, 10 dice | 83.8% | 51.5% | 22.5% |

---

## Design A: Anchors. The field is a resource the Squad spends and the Titan destroys

Full version in `odm-and-environment-design.md`. Summarised here for comparison.

**Movement.** Spend 1 Anchor to make an ODM move a **Swing**: two steps instead of one, on a Fly roll needing 1. A failure still makes the ordinary step, so a Swing is never worse than today; what it stakes is the Anchor and a third Gas die. Extra successes buy Momentum: a third step, a Bonus Die on your next roll this turn, or a clean line (two-die Gas Roll).

**Environment.** Each rating gives the Squad a public pool of Anchors (Open 0, Sparse 2, Wooded 3, Urban 4, Giant Forest 5). A new `wreck` effect on the heavy Behavior Table entries destroys 1, as does the falling Titan. Anchors are never restored.

**The feel.** Attrition and arc. Round 1 in a forest is a playground; round 5 is a splintered clearing. "We have one anchor left" becomes a sentence players say.

**Tuning risk.** Moderate and controllable. The Anchor budget is the dial, and because the Swing is gated by a shared resource it can first be measured as a sensitivity row rather than a retune.

**Effort.** M. One new effect type is the only engine work.

---

## Design B: Momentum. Keep flying or lose it

**Movement.**

> **Momentum.** When a soldier makes an ODM move they gain 1 **Momentum**, to the cap their Anchor Rating gives. At the end of a round in which they made no ODM move, they lose all of it. Momentum is public and sits on the soldier's sheet.
>
> Momentum is spent at the moment of a move or a roll, any amount at once:
> - **1:** one more Position step on this move.
> - **1:** 1 Bonus Die on a strike or a Break Attention this turn against the Titan you moved relative to, within the cap of 4.
> - **2:** this round's Gas Roll is not made.

**Environment.** The rating sets the cap, so the terrain decides how much flow is possible at all:

| Rating | Momentum cap |
|---|---|
| Open | 0 |
| Sparse | 1 |
| Wooded | 2 |
| Urban | 3 |
| Giant Forest | 3 |

**The feel.** This is the show's rhythm, and the most *fun* of the three. A striker builds speed across two rounds of flying and cashes it into a cut. Standing still on the Nape for three rounds, which is what the tuned baseline does today, becomes the worst thing you can do. Open genuinely reads as the place where the gear stops working.

**The built-in risk is already in the rules.** Holding Momentum means you keep making ODM moves, so you are airborne every round, and airborne is where `knock-loose` drops you and a Jam drops you (`falls.yaml`, `triggers`). The design needs no new punishment: it makes the existing one matter for the first time.

**Tuning risk. High, and this is the honest cost.** Momentum feeds Bonus Dice into strikes, so it shortens the fight directly and moves `prepared_squad_kill` (median exactly 3). It also compounds for the soldier already doing well. The caps are the dial, and the Bonus Die option is the first thing to cut if the target moves too far.

**Effort.** M to L. A new tracked value on the sheet, a new Bonus Dice source row, and simulator policy work to decide when an agent spends.

---

## Design C: The Approach Roll. Every flight is a small scene

**Movement.**

> **The approach.** An ODM move calls for a roll for `fly` with the soldier's own ODM Gear, needing 1. The move's step happens whatever the result. Each success **beyond the first** buys one thing from the printed list the Anchor Rating offers:
> - **another step** along a chain your move could make;
> - **1 Bonus Die** on your next roll this turn against that Titan;
> - **braced:** 1 Bonus Die on your next dodge this round;
> - **quiet:** you set no flag this turn.
>
> On **0 successes** the step still happens, but you come in loud: you set the loudest flag.

**Environment.** Each rating prints which of the four the ground actually offers, so terrain changes what flying *is* rather than how fast it is:

| Rating | Offers |
|---|---|
| Open | nothing; no roll is made, because there is nothing to fly from |
| Sparse | braced |
| Wooded | another step, braced |
| Urban | braced, quiet, another step |
| Giant Forest | another step, another step again, quiet |

**The feel.** Maximal prominence: the harness is rolled every time it is used, and the roll is a little menu rather than a pass/fail. This is the closest of the three to the prior-art "thrust dice" proposal (`research-prior-art.md`, E2) at a fraction of its cost, because it spends the existing success economy instead of adding dice.

**Tuning risk. High in a different way.** The failure is real (you become the loudest thing on the field at rung 4), so it feeds the Critical Injury and death targets, and the Rookie fails 33.5% of the time. It also adds roughly one dice pool per moving soldier per round against today's 3.57 pools per round for the whole Squad, which is a real cost in table time: this is the design most likely to slow play.

**Effort.** M. No new effect type and no new tracked value, but every rating needs its menu tuned and the simulator needs a spending policy.

---

## Which to take

| | Prominence | Fun | Table speed | Tuning risk | Effort |
|---|---|---|---|---|---|
| **A Anchors** | high | high | unchanged | **moderate** | M |
| **B Momentum** | high | **highest** | unchanged | high | M to L |
| **C Approach Roll** | **highest** | high | **slower** | high | M |

**Recommendation: A now, B next.** Design A changes the fewest measured things, gives the environment the arc it lacks, and is the only one that can be measured as a sensitivity row before anything is retuned. Design B is the one that will make players grin, and it composes with A: Anchors can be the resource that raises your Momentum cap, so the field you are fighting in decides how fast you can go and the Titan takes that away from you as it wrecks the place. Design C is the right Phase 2 shape once the playtest says how much dice-rolling the table will bear.

---

## Fix 1: Draw Attention

Today it sets the loudest flag, which is rung 4. Standing at In Reach is rung 2 and free, and being hooked in is rung 1, so the action cannot pull a Titan off the comrade a player most wants to save, and the simulator measures taking it at **Critical Injuries z +9.7** (`simulator-report.md`, 6.7).

ADR-0010's promise is precise: "no rung, **noise included**, turns a Titan off a blade at its Nape or a soldier On Body." That protects rung 1 only. Everything below it is fair game, and that is the room the fix uses.

> **Draw Attention.** As now, an unrolled action from a Position other than Distant, setting the **loudest** flag. While a soldier holds that flag, they also count as meeting every rung any other candidate meets **except hooked into its body**.

So a shout now matches the cutter standing at In Reach and then beats them at the loudest rung, and it still cannot take a Titan off a striker at the Nape or a soldier On Body. That is exactly the action players already believe they are taking, it is one printed sentence, no GM judgment, and ADR-0010 is untouched.

Pair it with a Talent so it stops being the only Titan Engagement action with none: a Leader or Rider rule Talent, once per Titan Engagement, "when you Draw Attention, you also gain 1 Bonus Die on your next dodge this round" (bracing for what you just invited).

**Effort** S. **Rerun required:** it makes the fight safer for strikers and more dangerous for the drawer, so it moves the PC Critical Injury and death targets in both directions and the net is not guessable.

If the owner would rather not touch the ladder, the fallback is XS and packet-only: print plainly what the action can and cannot do, so nobody walks into it.

## Fix 2: Mounted movement gets a step of its own

There is not one mounted-only step among the 20 rows. Two additions, both printed, both cavalry:

1. **The charge.** A mounted move that makes the Distant to In Reach step may also set the **loudest** flag. No other move sets a flag, so this is the horse's own capability, it gives the Rider the bait role that Loose the Horse and Cavalry Cut already gesture at, and it composes with the Draw Attention fix above.
2. **The plain.** At **Open** only, a mounted move may make the Distant to In Reach step **twice** (in, and out again, or the reverse). Open is the one rating where nothing else moves a soldier, and this makes the horse the answer to it rather than the consolation prize.

**Effort** S. **Rerun required**, and it should ride in the same rerun as the chosen movement design so the harness and the horse are tuned together.

## Fix 3: The environment

Covered inside each design above rather than bolted on, because the finding was that the ratings only set the *speed* of the approach. Whichever design is taken, the rating stops being a speed dial and starts saying what kind of place this is:

- **A:** how much mobility the field holds, and how fast the Titan wrecks it.
- **B:** how much flow the ground allows.
- **C:** what flying here can buy you.

In all three, **Open** finally reads as a character (no anchors, no flow, no menu, bring a horse) and **Giant Forest** reads as the Corps' home ground in the currency the fight actually spends.

## Fix 4: Gear Dice re-rolled on a Push

Good idea, and it does something real, but the numbers say it does not do the thing it was aimed at, and it breaks a hard target on the way. All figures from `tools/probes/round-2/gear_die.out`.

Today a Gear Die is never re-rolled: faces stay, a 1 is locked, and each 1 showing when a Pushed roll is final wears the gear by 1. Two readings of the proposal:

| Rule | P(die shows 1, wears) | P(die shows 6, success) |
|---|---|---|
| today, never re-rolled | 16.7% | 16.7% |
| **A** re-roll 2-5, keep 6, lock 1 (the Stress Die's own pattern) | **27.8%** | **27.8%** |
| **B** re-roll everything but 6 (1s not locked) | 13.9% | 30.6% |

Reading **A** is the consistent one: it is exactly how the Stress Die already behaves. It makes the Push both stronger and more dangerous by the same 67%, which is a genuinely good trade and very much in the spirit of ADR-0004.

**But it does not make blades run out in a fight.**

| Rule | Blade ruined per Pushed strike | Pushed strikes per ruin | Sets ruined in a 3.91-round fight* |
|---|---|---|---|
| today | 16.7% | 6.0 | 0.25 |
| A | 27.8% | 3.6 | 0.42 |

\* a striker making about 2.5 strikes and Pushing 60% of them.

A Rookie carries 3 sets. Under A they ruin one every 2.4 fights instead of every 4. That turns blades into a real **Expedition** resource, which is coherent with ADR-0014 Target 6 putting the grinder in the Expedition, but a soldier still walks out of any single fight with blades to spare. The thing stopping blades from biting inside a fight is not the ruin rate, it is that **the swap is free** (once per turn, spending neither move nor action). If the owner wants the show's moment where a soldier is out of steel with a Titan on them, the lever is the swap.

**And reading A breaks the Jam test.** The bar is "Jams in no more than a third of fights" and the worst cell measured today is 28.3%:

| Rule | ODM Gear 2 (issued at Funding 3 to 5) | ODM Gear 3 |
|---|---|---|
| today | 26.3% | 17.8% |
| **A** | **53.1%** | **47.7%** |
| B | 19.8% | 11.8% |

Raising the issued rating does not rescue it, because a higher rating also rolls more Gear Dice. A capped variant (A's faces, but a Pushed roll wears at most 1 point) lands at 46.8% at rating 2 and 24.2% at rating 3, so **A plus a wear cap plus issued ODM Gear 3** is the only combination tested that stays under the bar, and that is three tuned values moving at once.

**Recommendation.** Take reading A for the **Blade Set only**, or take A everywhere with the wear cap and accept a Funding-table change, or set a new Jam bar deliberately. What not to do is adopt A across the board and leave the Jam test where it is: the Attention holder would Jam in more than half of fights, and a Jammed soldier cannot Nape strike at all.

**Effort** S to write, L to land: every Pushed roll with a gear item is touched, so it is a full rerun and a Major change.

---

## Two withdrawn findings

**Health is not inert. I was wrong.** Health is a row of boxes, an untreated Critical Injury crosses one off, and the Critical Injury that crosses off the last box makes the soldier Down. Since a Titan's only harm is Critical Injuries, **Health is precisely the buffer the entire Titan threat is spent against**, and it is one of the most load-bearing numbers on the sheet. What is true is far narrower and is not a defect: `titan_attacks` carries `never: damage`, so a Titan attack never adds to *Health lost*, the damage track, which inside a fight moves only from falls, steam and corpse heat. That is ADR-0005 working as designed, and I had conflated it with round 1's separate measurement that damage *amount and threshold* are weak lethality knobs.

**Wits and Empathy are not thin. Also overstated.** I read `attributes.yaml` `used_by` without reading what those entries do in a fight. Treat Injury's `treat` use works during a Titan Engagement, makes a Critical Injury treated, and **gives back the Health box it crossed off**, so a Medic can take a comrade off the floor mid-fight. Field Repair clears a Jam, and the simulator measures 1.06 of them in the lone Jammed fight. Rally clears a Stress Response. What is actually true is a statement about the measured baseline, not the rules: `tuning.yaml` excludes Treat Injury during the fight, so the tuned figures never show the Medic's fight value. That is a gap in the measurement worth a simulator case, not a thin attribute.

Both are corrected in place in `flatness-audit.md` rather than deleted, so the error stays on the record.
