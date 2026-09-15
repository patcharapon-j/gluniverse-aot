# Chapters 1 to 5 decision conformance review, round 2 (Codex)

**Date:** 2026-09-14  
**Scope:** `docs/rules/01-core-rules.md` through `05-titan-engagement.md`; scoped YAML in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`, and `data/engagement/`; batch 3 and 3b decisions; ADRs; glossary; Chapter 5 and batch 3b probes. Chapter 6, `data/titans/`, OQ-100 and above, and the parallel round-2 reviews were excluded.

## Verdict

Batch 3b fixes the permanent finite-decoy lock identified in round 1, but the replacement is not a legal lone route after every finite-resource history. The gap appears when Open terrain, a grounded Titan, and Jammed ODM Gear meet. The Nape remains mechanically reachable and strikeable without ODM Gear, yet the repeatable Feint cannot be placed from the Position where it can buy the cut. This contradicts ADR-0010 without an open question.

All 52 scoped YAML files parse, no direct list has a duplicate `id`, and the only scoped provisional marker is the excluded OQ-104 setup pointer. I found no stale operative batch 3 escalation wording. The Chapter 3 Grab contract, fallback clocks, Fall Back timing, Squad sheet row, decoy counter, and Catalog `changes` row now agree with their decisions.

| Chapter | Critical | Major | Minor |
|---|---:|---:|---:|
| Chapter 1 | 0 | 0 | 0 |
| Chapter 2 | 0 | 0 | 0 |
| Chapter 3 | 0 | 0 | 0 |
| Chapter 4 | 0 | 0 | 0 |
| Chapter 5 | 1 | 0 | 0 |
| **Total** | **1** | **0** | **0** |

Only findings still open this round are counted.

## Findings

### 1. Critical. Chapter 5: the repeatable Feint does not preserve the lone route against a grounded Titan at Open after ODM Gear Jams

**Location:** Chapter 5 sections 5.2, 5.6, 5.7, and 5.13, especially `docs/rules/05-titan-engagement.md:138-163`, `:430-460`, `:503-521`, and `:832-844`; `data/engagement/anchor-ratings.yaml:40-49` and `:97-107`; `data/engagement/attention.yaml:180-216` and its `feint` row; ADR-0010.

**Problem:** Batch 3b adds the Feint so a lone soldier's Break Attention never runs out. It needs working ODM Gear or a sound horse the soldier is mounted on, and can be taken only from In Reach or On Body. At Open, a grounded Titan adds only the On Body to Blind Spot step. In Reach to On Body and On Body to Blind Spot remain two separate moves. Mounted movement reaches only In Reach, while close steps around a grounded Titan are not mounted.

This creates a legal state where the Nape itself is still available but Break Attention cannot buy access to it:

- The Titan is grounded, so a Nape strike at Blind Spot needs no working ODM Gear.
- The lone soldier's ODM Gear is Jammed, but they still have a sound horse.
- Their flares and cloak have been spent, a finite-resource history the new rule is meant to survive.
- From On Body they cannot Feint because the Jammed ODM Gear is not working and they cannot be mounted there.
- From In Reach they can mount and Feint with the horse, but their next turn can move only to On Body. The decoy's one-card hold ends before another turn can move to Blind Spot and strike.

The chapter's claim that the route closes only when Jam or empty gas also ends the Nape strike is therefore false for grounded Titans. Grounding expressly lifts the strike's working-ODM requirement. The committed lone-fight probe cannot expose the gap because its binding row is Wooded, where grounded In Reach to Blind Spot is one step.

**At the table:** Private Hanna has Broken a Medium Titan's leg on an Open field. Her ODM Gear then Jams. She has already spent both flares and her cloak, but her horse is sound. She can walk to the grounded Nape and her blades still work. If she stays On Body, no legal repeatable decoy exists. If she mounts at In Reach and succeeds on a horse Feint, the next turn gets her only to On Body before the Titan's card ends the hold and returns Attention to her. The rules offer no path to a legal Nape strike, so the GM must invent one.

**Fix options:**

1. Let a Feint against a grounded Titan be made without working ODM Gear from On Body, using no Gear Dice unless a qualifying item is available. Re-run the Feint need and screen sensitivities if this changes the roll.
2. Add a grounded-Open In Reach to Blind Spot step on foot. Audit how that changes every grounded Open strike and escape, not only this edge.
3. Give a mounted horse Feint at Open a specific success effect that places the soldier at On Body, leaving their next move for Blind Spot. State whether the horse remains and what happens on failure.

## Batch 3b application audit

- **Break Attention needs and counter:** Chapter 2's Catalog row and Chapter 5's prose/YAML use 1 for the holder, 2 for anyone else, 2 against a holding Titan, +1 for Feint, and +1 per decoy in a row. `attention-shift` now names both the shift and counter increase, and `break-attention.changes` includes it.
- **Reset and hold:** `attention.yaml`, `behavior-procedure.yaml`, and `round.yaml` reset decoys in a row only after a card resolves a behavior. A card suppressed by a decoy, a Grab, or no holder does not reset it. They state unambiguously that a decoy holds for Tempo cards, every held card resolves nothing, and only the last ends the hold and evaluates the ladder.
- **Probe implementation detail:** the full-fight probe evaluates the ladder on each held card and then restores the decoy until the counter reaches zero. No current rule observes those intermediate evaluations, so the result is identical to the prose/YAML's last-card-only evaluation. The committed outputs reproduce, but the implementation should be kept aligned if ladder evaluation ever gains an effect.
- **Other chapter impacts:** Chapter 3 sections 3.7 and 3.12 now use Break Free 2, the decided one-comrade contract, and Chapter 5 as the measured source. Chapter 4's Squad row says soldier, permits player-character gear dashes, and always records Positions. Chapter 5 and YAML say Fall Back occurs before Wings are assigned or kept. The fallback clocks are 8, 6, and 6 with 10.
- **Stale wording:** references to permanent decoys spent or one-card holds occur only in named rejected, historical, or sensitivity rows. No operative scoped rule retains them.

## Simulation rerun

I copied the scoped data and probes to `/tmp/wof-review2.C7mJjo` and ran the Python simulations there with their fixed seeds. I also ran every script in `tools/probes/batch-3b/` from the repository as a smoke test. All completed once PyYAML was supplied to Python. The documented `uv run --with pyyaml` command could not use the host cache in this sandbox and network access was unavailable; that is an execution-environment restriction, not a probe failure.

| ADR-0014 or batch 3b row | Reproduced result | Judgment |
|---|---|---|
| Gas, independent 1,000,000-canister Python run | Two dice: median 8, mean 9.254. Three dice: median 6, mean 6.337 | Meets the amended target |
| Prepared Squad, Medium, 12,000 fights | Median kill round 3; 62.6% by round 3; 73.2% by round 4 | Meets the target |
| Fresh Nape cut, 100,000 trials per cell | Rookie at Stress 1: 13.1%. Levi-grade at Stress 2: 47.4% | Meets 8% to 14% and about 50% |
| Grab alone, 40,000 trials per cell | 69.9% after a failed dodge; 73.1% without a dodge | Meets about 2 in 3 |
| Grab with one comrade in reach | 28.7%, 33.4%, 39.1%, 34.1%, 39.7%, 45.1%; Stress 2, Grief 0 is 33.4% | All six are under 50%; center cell is about 1 in 3 |
| Lone fight, Tempo 1, 100,000 fights | 76.0% reach a usable strike within 12 rounds; median round 4; 2.88 cards before it; 0.183 Critical Injuries; 3.1% devoured; 14.2% cut success; 10.8% kill per fight | Reproduces batch 3b, but only at Wooded; finding 1 remains |
| Lone fight, Tempo 2, 100,000 fights | Waiting line: 77.0% usable; median round 4; 6.73 cards before it; 0.257 Critical Injuries; 4.6% devoured. Hurried line: 67.4% usable; median round 3; 10.8% devoured | Tempo-card hold restores the intended access rate |
| Medium screen, dedicated batch 3b probe, 12,000 fights | Rule: 0.624 behavior cards per round, 0.44 Critical Injuries, 67.9% killed by round 3. Helpers: 0.836, 0.65, 68.9%. Batch 3 rule: 0.663, 0.49, 67.0% | Reproduces the decision run |
| Medium screen, full Chapter 5 case, 12,000 fights | 0.628 behavior cards per round, 0.45 Critical Injuries, 67.8% killed by round 3 | Reproduces the applied `tuning.yaml` row; sampling difference is immaterial |

## Round 1 findings

### Primary round 1 review

| Finding | Status this round |
|---|---|
| Major 1, escalating Break Attention lone cost and mismatched comparison | **Resolved.** Decoys in a row, the reset, Feint, informed policy, and full lone rows replace the disputed rule and figures. Finding 1 is a narrower unmodelled terrain and gear state. |
| Minor 2, fresh-cut band versus in-fight Stress | **Resolved.** ADR-0014, Chapter 5, and tuning pin the band to the fresh cut and report the in-fight cut separately. |
| Minor 3, stale and inverted OQ-81 figures | **Resolved.** The `Revised by batch 3b` line withdraws them and names the committed rows. |
| Minor 4, decoy counter absent from tracked values | **Resolved.** `attention-shift` names the counter increase and the Catalog `changes` row uses it. |
| Minor 5, gas target wording | **Resolved.** ADR-0014 states median and mean for both cases. |
| Minor 6, Fall Back timing | **Resolved.** Prose and YAML say before Wings are assigned or kept. |
| Minor 7, Squad row still worded for Squadmates | **Resolved.** The row applies to every soldier and defines player-character dashes. |

### Codex round 1 review

| Finding | Status this round |
|---|---|
| Critical 1, finite decoys permanently remove the lone route | **Resolved for finite decoy exhaustion under the normal working-gear line.** Feint is repeatable and the counter resets after a resolved behavior. Finding 1 identifies the remaining Jammed, grounded, Open line. |
| Critical 2, stale Chapter 3 Grab contract | **Resolved.** Sections 3.7 and 3.12 carry the decided model and pointer. |
| Minor 3, fallback clock arithmetic | **Resolved.** The decision record, chapter, and YAML say 8, 6, and 6 with 10. |

### Fable round 1 review

| Finding | Status this round |
|---|---|
| Major 1, OQ-79 and OQ-81 use pre-escalation lone figures | **Resolved.** Batch 3b withdraws them and the committed full-fight row measures the adopted rule. |
| Minor 2, wasteful policy and mixed median | **Resolved.** The binding lone row uses face-up card order and reports the struck-fight median. The naive row remains labelled as an upper bound. |
| Minor 3, Roars lift the in-fight cut beyond the fresh band | **Resolved.** The fresh 13.1% binds; the 14.2% in-fight cut is reported, not tuned. |
| Minor 4, Distant start claimed but not modelled | **Resolved.** The full lone probe starts mounted at Distant and models the move to In Reach. |

## Checks that passed

- ADR-0010, ADR-0014, the glossary, Chapters 1 to 5, and the scoped YAML agree on the operative batch 3b rule except for finding 1's lone-state reachability claim.
- The revised Chapter 3 Grab figures and rescue contract match Chapter 5 and ADR-0014.
- The Break Attention glossary entry matches the holder distinction, decoys-in-a-row concept, Feint examples, and Tempo-card hold at glossary depth.
- No new broken scoped cross-reference, incomplete D6 row, duplicate direct-list ID, or prose/YAML table gap was found.
