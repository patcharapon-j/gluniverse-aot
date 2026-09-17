# Round 2 design: make ODM movement and the environment prominent, dynamic, and fun

Owner direction (verbatim): "I want odm movement and environment to be more prominent. Dynamic and fun to play."

Design proposal only. No rule was changed and no YAML was edited. Builds on `odm-movement-feel.md` in this folder, which validated the owner's round 2 note. Measured figures come from `tools/probes/round-2/swing.py` (output in `swing.out`), a stand-in probe in the manner of `tools/probes/chapter-05`, not the ADR-0014 simulator. Odds quoted without a source are exact binomial computations at p = 1/6.

## What the probe found, and why it changed the design

`odm-movement-feel.md` recommended a "long swing": an opt-in two-step move on a Fly roll. Measuring it first turned up something the earlier research missed, and it is the more important finding.

**Approach to Blind Spot, one striker starting Distant, 40,000 trials per cell** (`swing.out`):

| Anchor Rating | Reaches Blind Spot on round 1, today | Mean round reached, today |
|---|---|---|
| Open | never while the Titan stands | n/a |
| Sparse | 0.0% | 2.38 |
| Wooded | 0.0% | 2.00 |
| Urban | 66.6% | 1.45 |
| **Giant Forest** | **100.0%** | **1.00** |

**The environment's only current job is to decide how fast the Squad reaches the kill, and it does it monotonically.** Giant Forest hands a striker the Nape on round 1, free, guaranteed, with no roll. Open denies it entirely. The three ratings in between are a speed dial. There is no rating where movement is *interesting*; there is only more of it or less of it.

That inverts the drama. The place the Survey Corps fights best should be the place where flying is most *expressive*, not the place where the approach stops existing. And it means the naive long swing is the wrong fix: adding a free speed-up to Wooded would move the ADR-0014 kill-round target (round 1 arrival goes from 0.0% to 66.2%, mean round 2.00 to 1.34) while doing nothing at all at Urban and Giant Forest, where the graph already allows the two-step move.

So the design below buys **options, not speed**, and makes the environment a **finite, destructible resource** rather than a speed dial.

## The design: Anchors

Four connected pieces. Everything is public, printed, and read off a table: no GM judgment enters (ADR-0024, limits 8 and 10), and no Attention rung is touched (ADR-0010).

### 1. Anchors: the battlefield becomes a resource the Squad spends

At setup, the Anchor Rating gives the Titan Engagement a pool of **Anchors**, held by the Squad as a whole and tracked publicly beside Openings on the GM tracker:

| Anchor Rating | Anchors | What they are |
|---|---|---|
| Open | 0 | nothing but the Titan itself |
| Sparse | 2 | a farmstead roof, a supply wagon, one good tree |
| Wooded | 3 | boughs and trunks |
| Urban | 4 | chimney stacks, gables, a bell tower |
| Giant Forest | 5 | trunks wider than a house, in every direction |

The numbers are the tuning dial (see *What must be measured*). An Anchor is spent by the acting soldier, from the Squad's pool, and is never restored during a Titan Engagement.

### 2. The Swing: the move becomes a decision

The ordinary move is **unchanged**: one step, no roll, free, guaranteed. Nothing in the fight gets slower or more likely to fail, which is what `research-prior-art.md` section F demands ("ODM must feel fast, not rationed into paralysis").

Added beside it:

> **A Swing.** When a soldier's move is an ODM move, they may spend 1 Anchor to make it a **Swing**: two steps along a chain of step rows their move could make, relative to one named Focus Titan, instead of one. It calls for a roll for `fly` with the soldier's own ODM Gear, needing 1. On a success the move ends at the far Position. On a failure it ends at the middle Position. Either way the soldier is airborne, the move is ODM use, and that round's Gas Roll is three dice.

A failed Swing still makes the ordinary step, so **a Swing never leaves a soldier worse off positionally than today.** What it stakes is the Anchor and the third Gas die. That is the point: the gamble is over a shared, shrinking resource, not over a wasted turn.

Odds at need 1: reference Rookie (Agility 3, Stress 1, ODM Gear 2, no Talent dice on `fly` per OQ-91) rolls 6 dice and succeeds **66.5%**. Flier template (Agility 4) at Wirework 1 rolls 8 and succeeds **76.7%**; at Wirework 3, 10 dice and **83.8%**. That band is where a gamble is worth taking and not automatic, and it finally gives Wirework and the Flier's own promise to "reach the hard Positions" something to do.

### 3. Momentum: a good roll buys more than arrival

Each success beyond the first on a Fly roll gives 1 **Momentum**, spent at once by the roller, each on one of:

- **one more step** along the chain (so a great Swing crosses three Positions);
- **1 Bonus Die** on that soldier's own next roll this turn against the named Titan, within the cap of 4 (the come-in-fast-and-cut moment);
- **a clean line:** the round's Gas Roll is two dice instead of three.

Three printed choices, resolved inside the move, nothing carried between turns, and no new tracked value. It reuses Bonus Dice and the existing three-die Gas Roll, so Light Trigger interacts with it for free.

### 4. The Titan wrecks the field: the environment becomes dynamic

This is what makes the fight an arc rather than a state.

- A new Behavior Table effect type, **`wreck`**, destroys 1 Anchor. Like `telegraph`, it applies whether the behavior landed or whiffed, because it is the Titan crashing through the treeline rather than an attack on a person. It goes on the heavy entries of each table (the charges, the sweeps, the falls), so a Titan that is having a good fight is also flattening the Squad's options.
- The **falling Titan** (on death or on being grounded, `titan-harm.yaml`) destroys 1 Anchor where it lands.
- Anchors are never restored during a Titan Engagement.

The result is the shape the show has and the game does not: **round 1 in a forest is a playground, round 5 is a splintered clearing.** Mobility is at its richest exactly when the Squad knows least, and it drains as the fight goes long. It gives the retreat clock a visible companion, it rewards committing early, and it makes "we have one anchor left" a sentence players will say.

It also gives each rating a real identity instead of a place on a speed dial:

- **Open** is the plain where the gear gives you nothing and the horse is the only thing that moves you. That is canon, and today it is already true; now it reads as a character rather than an absence.
- **Giant Forest** is where the Corps fights best, and the five Anchors say so in the currency the fight actually spends.
- **Urban** is rich and brittle: four Anchors, and a Titan in a town brings buildings down fastest.

### 5. One Terrain Trait per rating

Each rating gets a single printed, always-on rule so the place has a face beyond its step rows. These are tuning changes, so they are candidates, not settled:

- **Open:** a mounted soldier's Break Attention gains 1 Bonus Die (the horse is the only decoy the plain offers).
- **Sparse:** the first Anchor spent each round is refunded (the lone good tree you keep coming back to).
- **Wooded:** none. The default stays the plain baseline every ADR-0014 figure is measured on.
- **Urban:** a soldier at Blind Spot is anchored to a roof and is not airborne, so a Jam does not drop them.
- **Giant Forest:** a Swing's Gas Roll is two dice, not three. Falls here already run one band higher, which is the price.

Wooded deliberately gets nothing, so the tuned default is untouched by this piece.

## Why this shape and not the alternatives

| Alternative | Why not |
|---|---|
| Free two-step move at every rating | Measured: moves round 1 arrival on Wooded from 0.0% to 66.2% and the mean approach from 2.00 to 1.34 rounds, in a 3.91-round fight. It shortens the fight and moves the kill-round target while adding no decision. |
| Movement costs the action, or a Fly roll on every step | The mobility bottleneck `research-prior-art.md` section F names as the reason existing AoT games fail. Dead turns, not drama. |
| Positions decay: Blind Spot expires each round | A tax. It moves the fight's pressure off Attention, which is ADR-0010's whole architecture, and moves every measured target at once. |
| Full thrust dice (prior art E2) | The richest answer and the right Phase 2 shape, but a new roll kind, a new spending economy beside Openings, a new failure table, and substantial engine work. Revisit if Anchors prove the appetite. |

## What must be measured before any of this is accepted

Every number here is a starting value under ADR-0014. The rerun has to answer:

1. **The kill-round target** (`prepared_squad_kill`, median exactly 3). The Anchor budget is the dial. On Wooded, 3 Anchors across 4 soldiers and a 3.91-round fight means two strikers swinging to the Nape on round 1 spend two thirds of the Squad's mobility for the whole fight. Whether that nets out faster or slower is the first thing the simulator must say, and the budget is what gets tuned if it lands wrong.
2. **The PC Critical Injury and death targets.** A soldier who arrives a round earlier is exposed a round earlier.
3. **ADR-0010's legal-route promise.** A Nape strike must stay reachable and Break Attention must stay available in every state where it is legal. The one-step chain is untouched, so the promise holds by construction, but `families.route_check` must confirm it with Anchors at 0.
4. **The `wreck` rate.** How many Anchors a fight actually loses, per table and Size Class, and whether a Squad is ever stranded by it. A floor (Anchors never reduce the step graph, only the Swing) keeps this safe, which is why `wreck` takes Anchors and never takes step rows.
5. **The Skirmish** (Chapter 7) has no Positions and no Anchors, and nothing here reaches it.

Because the Swing is opt-in and gated by a resource, it can first be measured as a **sensitivity row beside the baseline** rather than as a retune. That is the cheap way to find out whether the kill-round target moves at all.

## Implementation order

| # | Work | Files | Rerun |
|---|---|---|---|
| 1 | Anchors: the pool, the setup row per rating, the tracker row | `anchor-ratings.yaml`, `engagement-setup.yaml`, `round.yaml` (`gm_tracker`), chapter 5 sections 5.1 to 5.3 | yes |
| 2 | The Swing and Momentum | `positions.yaml` (`moves`), `action-catalog.yaml` (`fly` requirements), `odm-gear.yaml` (the three-die Gas Roll), chapter 5 section 5.2, chapter 4 section 4.3 | yes |
| 3 | The `wreck` effect type and the falling Titan's Anchor | `titan-format.yaml` (`effect_types`), `titan-harm.yaml`, the four `data/titans/` tables, `tools/sim/rules.py` | yes |
| 4 | Terrain Traits | `anchor-ratings.yaml`, chapter 5 section 5.2 | yes |
| 5 | Packet | `wings-of-freedom-playtest-packet.html` | no |

Pieces 1 and 2 are the smallest shippable version and already answer the owner's direction. Piece 3 is what makes it *dynamic*; without it Anchors are just a budget. Piece 4 is polish and the easiest to defer.

Process note: this reopens OQ-74, which chose the current step graph and considered neither a two-step move nor a terrain resource. A decider opens the OQ entry and records the batch before any chapter or YAML changes, per `docs/playtest/HANDOFF.md`.
