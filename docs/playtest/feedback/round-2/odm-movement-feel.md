# Owner feedback, round 2: ODM movement in a Titan Engagement reads flat

Owner note (verbatim): "I feel like during titan's turn engagement. Movement feel a bit weird. In the show the odm gear is quite a set piece but in the game the move moment just happens. And fly roll is rarely used."

Research and opinion only. No rule was changed and no YAML was edited. Sources: `docs/rules/05-titan-engagement.md` (sections 5.1 to 5.3, 5.6, 5.7), `docs/rules/04-gear.md` (sections 4.2, 4.3, 4.6), `data/engagement/anchor-ratings.yaml`, `data/engagement/positions.yaml`, `data/engagement/round.yaml`, `data/engagement/engagement-setup.yaml`, `data/engagement/attention.yaml`, `data/engagement/squad-tactics.yaml`, `data/engagement/tuning.yaml`, `data/gear/odm-gear.yaml`, `data/gear/falls.yaml`, `data/gear/items.yaml`, `data/gear/standard-issue.yaml`, `data/character/action-catalog.yaml`, `data/character/talents.yaml`, `data/character/specialties.yaml`, `data/character/squadmates.yaml`, `data/character/attributes.yaml`, ADR-0007, ADR-0009, ADR-0010, ADR-0014, ADR-0019, ADR-0024, `docs/rules/OPEN-QUESTIONS.md` (OQ-74, OQ-75, OQ-76, OQ-91, OQ-99, OQ-136, OQ-146), `docs/reviews/simulator-report.md` (sections 4.1, 6.10, 8), and `docs/research/research-prior-art.md` (sections E and F). Odds quoted without a source are exact binomial computations over the Year Zero pool at p = 1/6, done in a throwaway script.

## Verdict

**The observation is correct, and it is sharper than the note claims.** Movement in a Titan Engagement is the only part of the fight that is never rolled, never risked, and almost never paid for. The Fly roll is not merely rare: on the default battlefield it is **unreachable**, and on the two battlefields where it exists it stakes nothing that the safe step would not have cost anyway.

Three findings below are measured facts about the rules as written. The fourth is the reason the flatness is felt rather than merely true on paper.

## Finding 1: on 4 Anchor Ratings in 5, no move can ever call for a Fly roll

`data/engagement/anchor-ratings.yaml` holds **20 Position step rows across the five ratings. Exactly 2 carry a `fly_roll` (10%).**

| Anchor Rating | Step rows | Rows with a Fly roll |
|---|---|---|
| Open | 2 | 0 |
| Sparse | 4 | 1 (In Reach to Blind Spot) |
| Wooded | 4 | **0** |
| Urban | 5 | 1 (Distant to Blind Spot) |
| Giant Forest | 5 | **0** |

Wooded is the default battlefield of ADR-0014, the rating every figure in section 5.13 was measured on, and the rating the interim setup table deals 2 times in 6. **A Titan Engagement set up by the table has a 2 in 6 chance of containing any step that calls for a Fly roll at all,** and the Squad still has to choose to take that step.

This is not an oversight. OQ-74 considered option (b), "one graph at every rating, with the rating changing only Fly roll needs", and rejected it in favour of option (a), one step graph per rating. The consequence was not recorded at the time: the chosen graph put the Fly roll on the two rows that happened to need a tiebreaker and on nothing else.

## Finding 2: the two Fly rolls that exist stake no Position

Read the two rows against the alternative the same soldier already had:

| Rating | Fly row | On a failure the move ends at | What the ordinary step from the same Position reaches |
|---|---|---|---|
| Sparse | In Reach to Blind Spot, needs 1 | On Body | In Reach to On Body, no roll |
| Urban | Distant to Blind Spot, needs 1 | In Reach | Distant to In Reach, no roll |

**A failed Fly roll lands the soldier exactly where the safe, unrolled step would have put them.** The roll therefore risks no Position, no gas beyond what the safe ODM step already owes, no gear wear (wear comes only from a Push), and no fall (`data/gear/falls.yaml` `triggers` is a closed list, and no row is reachable from a move). The only thing staked is the Stress Die: at the reference Stress of 1 that is a 1 in 6 chance of a Stress Response, which at Resolve 3 is Steady or a lasting 1-die penalty and never worse.

So on the two rows where Fly exists it is close to a free lottery ticket. There is no moment where a player weighs it. That is the mechanical shape of "the move moment just happens".

## Finding 3: ODM Gear is barely touched in a fight, and half the reference Squad never touches it at all

A move costs one thing: ODM use makes that round's Gas Roll (`data/gear/odm-gear.yaml`, `gas_roll`). Two dice, count the 1s, one gas each.

- Expected gas lost per round of ODM use: **0.33** of a full rating of 3.
- Chance a round of ODM use costs any gas at all: **30.6%**.
- A full canister lasts a median of **8 rounds** of ODM use (`data/engagement/tuning.yaml`, `gas`).
- The Chapter 5 reference fight lasts **3.91 rounds** and the retreat clock is 8 segments (`docs/reviews/simulator-report.md`, section 6.10).

Gas is tuned to an Expedition and spent in a fight. It cannot bite inside one.

The simulator's own round-time counters make the point directly. Against the standard Medium Titan with four player characters:

| Measure | Per round |
|---|---|
| Gas Rolls (all four soldiers) | **0.57** |
| Dice pools rolled (all four soldiers) | 3.57 |
| Dodges | 0.46 |

A Gas Roll is made by every soldier who used ODM Gear that round **in any way**, dodges with the gear and Feints included. So across a whole 3.9-round fight the entire four-soldier Squad touches its ODM Gear about **2.2 soldier-rounds**, and ODM *movement* is a subset of that. Roughly 14% of soldier-rounds involve the signature equipment of the setting.

The baseline policy in `data/engagement/tuning.yaml` (`prepared_squad_kill`, `model`) explains why:

- **Strikers** "move to blind-spot and make Nape strikes". On Wooded that is Distant to In Reach, then In Reach to Blind Spot: **two moves, both automatic**, on rounds 1 and 2. After that the striker stands still for the rest of a 3.9-round fight.
- **Cutters** "move to in-reach and strike the more damaged leg". On Wooded, Distant to In Reach is `on_foot: true`, and a Body Part strike from In Reach does not require working ODM Gear (`data/gear/odm-gear.yaml`, `strikes`, which scopes the requirement to the Nape strike and to Body Part strikes made from On Body or Blind Spot). **A cutter can fight an entire Titan Engagement on foot and never use the harness once.**

So the typical player's experience of the ODM gear in a fight is: announce one or two free steps in the first two rounds, then never think about it again.

## Finding 4: the content that promises movement has nothing to attach to

- The Flier Specialty's own summary reads "The best on the wires. Fliers **reach the hard Positions**, dodge what others cannot..." (`data/character/specialties.yaml`). Reaching a hard Position is not a roll on 4 ratings in 5.
- **Wirework** is a dice Talent to max level 3 whose `names` list is `[fly]` and nothing else. In a Titan Engagement it is live on 2 of 20 step rows, both optional, both on ratings that come up 2 times in 6. A player who spends three Talent levels on it can play a whole campaign on Wooded and Giant Forest battlefields and never roll it.
- **Airborne** is almost purely a liability flag. Reading every `airborne` reference across `data/`, being in the air blocks setting down a carried comrade, blocks mounting, opens two fall triggers (`jam-airborne`, `down-airborne`), and gives exactly one benefit: exemption from Leap Clear when a Titan falls. Nothing in the fight rewards being in the air.
- **Position matters enormously**, through the Attention Ladder, the Nape strike gate, Feint requirements, Help and Covering range, and falls. The destination is loaded with meaning. **The journey carries none of it.** That gap is precisely what the owner is feeling: the game cares intensely about where you are and not at all about how you got there.

## Why it is this way, and what must not break

This is a deliberate architecture, not a bug, and the fix has to respect it.

- **ADR-0010** puts the fight's tension in Titan Attention rather than in assigned roles or in movement. Break Attention, decoys, Openings, Help, and card swaps are the levers, and "the soft levers stay soft".
- **ADR-0024** limit 8: the GM never picks a step, whether a move can make it, or where a move ends. Movement is deliberately judgment-free. Limit 15: a printed Fly roll need never changes.
- **ADR-0014** ties `fly_roll` needs on every step row to the simulator as tuning starting values, so any change to a step that the baseline route uses moves the 3-round kill target and requires a rerun.
- The project's own prior-art research (`docs/research/research-prior-art.md`, section F) names the failure mode to avoid: **"Mobility bottleneck: movement scarcity creates dead turns. ODM must feel fast, not rationed into paralysis."** Anything that makes reaching the Nape slower or more likely to fail makes the fight worse, not better.
- The same research, section E item 2, already proposed the fix the design did not take: **"Thrust dice modeled on ammo dice. Add d6s to a maneuver roll. Extra 6s buy position, speed, or a second anchor, and the pip sum drains gas. Multiple 1s mean a jammed or snapped anchor. This gives the 'burn gas for a big move' choice."**

The design target is therefore narrow and clear: **add a decision to movement without adding a tax to it.** The guaranteed step must stay guaranteed and free. What is missing is something to reach for above it.

## Options

Effort is drafting plus review. "Rerun" means the ADR-0014 simulator must re-measure before the change is accepted.

### Option 1: leave it (baseline)

No target is missed and no rule is broken. The cost is that the owner's complaint stands, Wirework and the Flier Specialty stay thin, and the setting's signature equipment is the least interesting object on the character sheet during its signature scene. **Effort none. No rerun.**

### Option 2: presentation only, the zero-risk first move

The note says the move "just happens". Part of that is table presentation, not mechanics: section 5.2 and the packet describe moves as graph transitions and give the GM and players no prompt to narrate one. Add to the packet, in the voice of a published product:

- One line under *Positions and moves*: when a soldier makes an ODM move, the player says what the swing looks like and what they anchored to, and the GM answers with what the Titan does as they come in.
- A short flavour line per Position (Distant, In Reach, On Body, Blind Spot) so the destinations read as places rather than labels.
- A named example of a two-move approach on Wooded worked through in fiction.

This changes no rule, no YAML, and no number. It will not satisfy a player who wants a decision, but it directly addresses "the move moment just happens" at the table, and it can ship immediately. **Effort XS, packet only. No rerun.** Recommended regardless of which mechanical option is taken.

### Option 3: give the two existing Fly rows real stakes

Change `failure_ends_at` on the two rows so that a failed Fly roll ends the move at the **near** Position rather than at the middle one: Sparse In Reach to Blind Spot fails back to In Reach, Urban Distant to Blind Spot fails back to Distant. The roll then buys two steps for one move at the risk of buying none, against a safe step that always buys one.

Cheapest real fix in the repo: two scalar edits in `data/engagement/anchor-ratings.yaml` plus the rendered table and the OQ-74 design note. It turns two dead rows into genuine decisions. It does not touch Wooded, so it does not answer the main complaint, and it makes Sparse and Urban slightly slower routes to the Nape. **Effort S, data plus chapter plus packet. Rerun required** on the Sparse and Urban rows (the `fly_roll` needs are named simulator starting values, and the setup mix in simulator-report section 6.9 reads both ratings).

### Option 4: the long swing (recommended)

Add one opt-in move to `data/engagement/positions.yaml` (`moves`) and one block to `anchor-ratings.yaml`:

> **A long swing.** Instead of the one step a move makes, a soldier whose move is an ODM move may declare a **long swing**: two steps along a chain of step rows their move could make, relative to one named Focus Titan. It calls for a roll for `fly` with the soldier's own ODM Gear, needing 1. On a success the move ends at the far Position. On a failure it ends where the soldier started. Either way the soldier is airborne, the move is ODM use, and **that round's Gas Roll is three dice**.

Why this shape:

- **It adds no tax.** The ordinary one-step move is untouched: still free, still automatic, still guaranteed. Nothing gets slower or more likely to fail. The prior-art warning about a mobility bottleneck is respected because the new option makes the fight *faster* when taken.
- **It is a real decision with a computable price.** Distant to Blind Spot in one turn instead of two, staked against losing the turn's movement entirely and paying a third Gas die. For the reference Rookie (Agility 3, Stress 1, ODM Gear 2) the pool is 6 dice and the roll succeeds **66.5%**. For a Flier template (Agility 4) at Wirework 1 it is 8 dice and **76.7%**; at Wirework 3, 10 dice and **83.8%**. That band is exactly where a gamble is interesting, and it finally gives Wirework and "reach the hard Positions" something to mean.
- **It reuses existing machinery and adds no new effect type.** The three-die Gas Roll is already in `data/gear/odm-gear.yaml` (`gas_roll.dice.after_pushed_odm_roll`, maximum 3), so Light Trigger interacts with it for free and `tools/sim/rules.py` needs no new effect kind. Failure ending at the start is a Position change a rule names, already the standard pattern.
- **It respects ADR-0010 and ADR-0024.** It touches no Attention rung, adds no penalty for acting alone, and leaves the GM nothing to judge: the chain is read off the printed step rows, the need is printed, and where a failure ends is printed.
- **It exists on every rating**, including Wooded and Giant Forest, so it answers the actual complaint. It is also self-limiting on Open, where the graph has only two rows and a chain of two exists only against a grounded Titan.
- **It turns gas into an in-fight currency at last.** A striker who long-swings twice in a fight pays two three-die Gas Rolls, expected 1.0 gas of 3, against the 0.67 a cautious striker pays. That is still not paralysis, but it is the first time in the fight that the canister is something a player thinks about.

Risks to check in the rerun: the kill-round target (a long swing saves a striker one round of approach, which is a full round off a 3.9-round fight if taken on round 1), the Grab and Critical Injury targets (a soldier who arrives a round earlier is exposed a round earlier), and the lone-soldier route promise of ADR-0010 (the long swing must not become the only legal route, which it cannot, since the one-step chain is untouched). Because the option is opt-in, it can first be measured as a **sensitivity row beside the baseline** rather than as a retune, which is the cheap way to find out whether it moves the target at all.

**Effort M.** Data (`positions.yaml`, `anchor-ratings.yaml`), chapter 5 section 5.2, chapter 4 section 4.3 for the Gas Roll die, the Action Catalog's `fly` requirements line, the packet, and an OQ entry. Simulator: one new policy switch and one sensitivity family. **Rerun required.**

### Option 5: thrust dice (the prior-art proposal in full)

`research-prior-art.md` E2: a maneuver roll whose extra successes buy position, speed, or an anchor, and whose 1s jam or snap. This is the richest answer and the one closest to the fiction, and it is also a new subsystem: a new roll kind in the Catalog, a new success-spending economy alongside Openings, a new failure table, and substantial simulator work. It would also put the fight's second spending economy next to Openings and Bonus Dice, which ADR-0007 and ADR-0010 kept deliberately thin.

Not recommended now. It is the Phase 2 shape of Option 4 if Option 4 proves the appetite. **Effort L. Rerun and engine work required.**

### Option 6: make the destination expire

Force movement by making Blind Spot unstable: a soldier who stays at Blind Spot through a Titan's card drifts to On Body, or the Titan's Regeneration step displaces them. This creates movement per round rather than per fight.

**Not recommended.** It is a tax, it fights ADR-0010 (it would move the fight's pressure off Attention), it directly recreates the mobility bottleneck the prior art warns about, and it would move every measured target at once. Listed for completeness because it is the obvious first idea and should be explicitly rejected.

## Recommendation

**Option 2 now, Option 4 next, Option 3 folded into Option 4's rerun.**

Option 2 ships today, costs nothing, and addresses the half of the complaint that is about presentation. Option 4 is the smallest mechanical change that puts a real decision into the move without making movement slower or more likely to fail, gives the Flier Specialty and Wirework the job their own text promises, and makes gas matter inside a fight for the first time. Option 3 is two scalars and should ride along in the same rerun, because once the long swing exists, the two legacy Fly rows are the only rolls in the game whose failure costs nothing, and that inconsistency will read as a mistake.

Next step if the owner agrees: a decider opens an OQ entry against OQ-74 (which chose the current step graph and did not consider a two-step move), records the batch, and the rerun measures Option 4 as a sensitivity row before any target is retuned.
