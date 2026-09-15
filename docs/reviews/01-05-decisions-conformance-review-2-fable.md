# Chapters 1 to 5 conformance review, round 2: narrow escalation (Fable)

**Scope:** one disputed finding only: `docs/reviews/01-05-decisions-conformance-review-2-codex.md`, finding 1 (Critical), "the repeatable Feint does not preserve the lone route against a grounded Titan at Open after ODM Gear Jams". Nothing else in this round was reviewed.

**Read:** `docs/rules/05-titan-engagement.md` (5.2, 5.3, 5.5, 5.6, 5.7, 5.11, 5.13, the grounded-Nape example), `data/engagement/anchor-ratings.yaml`, `positions.yaml`, `attention.yaml`, `round.yaml`, `behavior-procedure.yaml`, `titan-harm.yaml` (`grounded`), `size-classes.yaml`, `engagement-setup.yaml`, `squad-tactics.yaml` (Fall Back); `docs/rules/04-gear.md` (4.2, 4.5, 4.8, the Jam example), `data/gear/odm-gear.yaml`, `horses.yaml`, `field-repair.yaml`, `standard-issue.yaml`; `docs/rules/01-core-rules.md` (1.3, 1.9); `data/character/action-catalog.yaml` (`gear_requirement`, `break-attention`, `field-repair`, `mount-or-dismount`, `help`); `docs/rules/DECISIONS-2026-09-14.md` `## Batch 3b`; ADR-0003, ADR-0010, ADR-0014; `CONTEXT.md`.

**Simulation:** `open_grounded.py` in the session scratchpad (outside the repository), importing `tools/probes/chapter-05/core.py` for the dice conventions (Push, Stress Dice, Stress Responses), 100,000 trials per row unless stated. Figures are quoted below.

## Verdict

**Not a real dead end.** The state has a legal path to a Nape strike under the rules as written, and the rule that opens it is **Field Repair in a Titan Engagement** (Chapter 4, section 4.8; `data/gear/field-repair.yaml`, `target.whose.in_titan_engagement`, `in_titan_engagement`; `data/gear/odm-gear.yaml`, `jam.ends`). The Codex finding treats a Jam as permanent for the rest of the fight. It is not: a Jam "ends when the current rating rises above 0, through Field Repair", Field Repair is an action the soldier takes on "an item of the soldier's own" during the Titan Engagement, it needs 1 success, it is rolled with Wits alone when the soldier has no tool kit (`action-catalog.yaml`, `gear_requirement.attribute_alone`), it can be Pushed, and "a failed roll can be tried again on a later turn". The GM invents nothing.

**Severity: Minor** (rare edge, plus a clarity fix). Reasons in *Severity* below. Counts: Critical 0, Major 0, Minor 1.

## The legal path, step by step

The claimed state: Medium Titan (Tempo 1, leg Toughness 2, Regeneration clock 3) grounded by a Broken leg on Open; the lone soldier holds its Attention; ODM Gear Jammed (current rating 0), Gas Rating above 0; both flares and the cloak spent; the horse sound.

1. **Turn 1.** Move: if at In Reach, step on foot to On Body. A grounded Titan lets "every step row joining two of in-reach, on-body, and blind-spot" be made on foot at every rating (`anchor-ratings.yaml`, `grounded_titan.on_foot_steps`), and Open has the In Reach to On Body row. Action: **Field Repair** on the soldier's own ODM Gear, Wits alone (the Rookie has no tool kit unless an Engineer; `standard-issue.yaml`, `by_specialty`), needing 1, Push allowed. On a success the current rating rises to 1 or 2 and the Jam ends; the Gas Rating never changed (`odm-gear.yaml`, `jam.effect`, item 3), so the ODM Gear counts as had again. On a failure, try again next turn.
2. **Turn 2**, in a round where the Titan's card has already come (so its resolved behavior has set decoys in a row to 0). Action: **Break Attention, Feint**, from On Body, Gear Dice from the repaired ODM Gear (`attention.yaml`, `decoys.feint.requirement`: "holds in-reach or on-body ... and has ODM Gear that is not Jammed"). Needs 2 (holder 1, Feint 1, decoys in a row 0). This is ODM use, so a Gas Roll follows at the end of the round.
3. **Turn 3**, next round, if the soldier's card comes before the Titan's. Move: On Body to Blind Spot, on foot or by ODM, the step Open gains while the Titan is grounded (`grounded_titan.open_rating`). Action: **Nape strike**. It needs Blind Spot, not holding Attention (the decoy holds it until the Titan's next card), not Grabbed, and working ODM Gear "unless the Titan is grounded" (`titan-harm.yaml`, `nape_strikes`, `grounded`). All met; 2 Bonus Dice from `grounded-titan`.

Every step is a written rule with no choice left to the GM. The path is the same one a soldier with working ODM Gear takes at Open, plus one repair turn.

## The alternatives the brief asked me to check

| Route | Result |
|---|---|
| **Clearing the Jam in the fight** | Yes: Field Repair, own item, action, Wits alone without a kit, retry each turn. This is the path. |
| **Spare ODM Gear, swapping, Pass or Take Item** | No. Standard Issue issues one ODM Gear and replaces a Jammed one only when it is received between missions (`standard-issue.yaml`); Pass and Take Item need a comrade. Not needed. |
| **Running dry** (the sibling case: Gas Rating 0) | Change Canister with a spare (Funding 3 issues 1 spare). With no spare left, Field Repair does not help, and the residual noted under *Severity* applies. |
| **Hold length and card order** | A decoy holds a Tempo 1 Titan for one card (batch 3b, ADR-0010 as amended). A lone soldier gets at most one turn under the hold: the turn in the next round whose card is lower than the Titan's. Declining (Chapter 1, section 1.9) holds a move or action only for Help and Reactions, never for a later move; a Reaction spends turns, it never adds them; a second turn before the Titan's card exists only through a Wing Squadmate, and the soldier is lone. So from In Reach at Open (two steps to Blind Spot) a mounted horse Feint cannot be followed by a strike, exactly as Codex says. The path above starts the Feint at On Body, which the repair makes legal. |
| **Positions at Open, grounded** | Open has Distant to In Reach and In Reach to On Body; grounding adds On Body to Blind Spot and nothing else (`grounded_titan`: "They add no step that the rating's rows do not have, except open_rating"). No In Reach to Blind Spot step, so Codex is right that On Body is the only place a Feint can precede a strike at Open. |
| **Mounting and dismounting** | Mount needs the horse at the soldier's Position and no mounted move can make a close step while grounded, so the horse never reaches On Body; a mounted soldier at In Reach can dismount as part of the move that steps on foot to On Body (`horses.yaml`, `within_a_move`). None of this shortens the route; the horse route stays two turns short, as Codex says. |
| **Help or other rules that move a soldier** | Fall Back moves a soldier the wrong way (On Body or Blind Spot to In Reach) and needs the Squad to hold the tactic; Lift Comrade and Help need a comrade; a fall lands at In Reach. Nothing moves a lone soldier toward the Nape but their own move. |
| **Wings** | None for a lone soldier. (If a Squadmate were on a Wing, it could Field Repair the soldier's ODM Gear from the same Position, or Help the repair, and the soldier would not be lone.) |
| **Attention when the holder is elsewhere** | Leaving (from Distant) sets Attention to nothing until the next evaluation; returning lands at Distant and the next card picks the only candidate again. No gain, and the Nape is then three moves away. |
| **Disengage and re-engage** | As above. No route. |

## Numbers

**Field Repair per attempt**, Rookie (Wits 2 under ADR-0014), no tool kit, needs 1: 42.0% at Stress 1, 52.0% at Stress 2, 56.9% at Stress 3, 59.5% at Stress 4 without Pushing; **65.9%, 69.4%, 69.2%, 67.0%** with the Push. About two turns on average end the Jam.

**Turns to a legal strike from the disputed state** (informed policy: repair, then Feint from On Body only after the Titan's card, then the cut if the soldier's card comes first; card order a coin flip; harm to the soldier not modelled, since the lone-fight probe already reports it): a legal Nape strike within 12 rounds in **69.5%** of runs (median round 6, mean 6.6), against **77.9%** for the same state with working ODM Gear; the route closes by running dry with no spare in **0.2%**. The Jam costs about one round and eight points, which is the price Chapter 4's OQ-66 note names for a Jam ("the rounds lost in the fight").

**The grounded window.** This is the fact the Codex finding and the chapter's Open text both leave out. The Regeneration clock fills 1 segment a round and, when full, "the most damaged Body Part moves one state toward Intact: Broken before Wounded" (section 5.7). A Medium's clock is 3, so **a Broken leg heals to Wounded within 1 to 3 rounds** of the break, the Titan stands, and at Open "a soldier who holds Blind Spot relative to it holds On Body instead". A standing Titan at Open has no Blind Spot at all, for anyone, by OQ-74's design. Within a window of 3 rounds the repair path reaches a legal strike **8.6%** of the time (0% in 1 or 2 rounds, since repair, Feint, and cut need three turns); a soldier with working ODM Gear reaches it **26.1%** in 3 rounds and **13.3%** in 2. So at Open the Nape is a short race even for a soldier whose gear works, and the Jam roughly triples the odds against. That is a cost, not a closed route, and when the window shuts the Open rating's own rule, not the GM, says no Nape strike.

**Reachability.** Grounding itself is not the rare part: a Rookie striking a Medium's leg from In Reach every round Breaks it within 12 rounds in about 98% of runs and within 3 rounds in about 83% (upper bound; the Titan's own cards are ignored). The rare parts are the rating and the Jam: the setup table deals Open 1 time in 6, the committed lone probe Jams in 3.1% of lone fights (`lone_b3b.out`, row E), and the state also needs both flares and the cloak spent before the Jam with the horse still sound. Multiplying, well under 1% of lone fights ever stand in the claimed state, and the sibling state that Field Repair cannot fix (Gas Rating 0 with no spare canister, two full canisters spent in one fight) is a fraction of that.

## Severity

- **Not Critical.** Nothing rests on GM discretion: every step of the path is a named rule with a roll or a fixed effect, and the only "invented" element in the Codex scenario is the assumption that a Jam lasts the fight, which Chapter 4 contradicts. Play does not break: a soldier who cannot repair in time meets the Open rating's standing rule, which already closes the Nape to a whole Squad while the Titan stands.
- **Not Major.** The edge is not undefined; it is defined and merely unfavourable, and it is rare (Open, a Jam, spent decoys, and a 1-to-3-round window all at once).
- **Minor, for clarity.** Two sentences overstate the guarantee, and one residual case exists:
  - Section 5.13, *The route*: "under the rule it closes only when the ODM Gear Jams or runs dry with no sound horse left (8.2%), which also ends the Nape strike itself". This is a statement about the Wooded lone-fight probe, where a grounded Titan's In Reach to Blind Spot step is one move and a mounted horse Feint from In Reach works. Read as a general rule it is false at Open, where the horse does not carry the route and the repair does.
  - Batch 3b, 3b-1 *Why*: "the route now closes only by a Jam or running dry (8.2%), which also closes the Nape strike itself". Same scope, same overstatement for a grounded Titan, since grounding lifts the strike's ODM requirement.
  - The residual: at Open, grounded, with Gas Rating 0 and no spare canister, the Nape strike is legal but no Feint can precede it (no ODM, and the horse cannot reach On Body). This is rare enough that the committed lone probe would put it inside its 0.2% and the window makes it rarer, and it is the "running dry" close the decision already accepts. It is not a contradiction of ADR-0010, which promises Break Attention as the lone route and no flat penalty for acting alone, not a route that survives every gear loss.

## Finding

### 1. Minor. Chapter 5 section 5.13 and decision 3b-1 overstate when the lone route closes; the in-fight repair of a Jam is never mentioned where a reader looks for it

**Location:** `docs/rules/05-titan-engagement.md`, section 5.13, *A lone soldier after Break Attention*, the bullet *The route* (about line 844); the OQ-81 design note's *The lone soldier* bullet in section 5.6 (about line 458); `docs/rules/DECISIONS-2026-09-14.md`, 3b-1 *Why*, "the route now closes only by a Jam or running dry (8.2%), which also closes the Nape strike itself"; `data/engagement/tuning.yaml` `lone_fight` if it carries the same sentence.

**Problem:** The sentence is measured on the Wooded lone fight and is true there, but it reads as a rule for every rating. At Open a grounded Titan's Nape needs two steps from In Reach, so after a Jam the sound horse does not keep the route open; Field Repair does (Chapter 4, section 4.8), at the price of a turn and a Wits roll, inside a grounded window of 1 to 3 rounds. Neither section 5.6 nor 5.13 points at the repair, so a reviewer (and a player) can conclude the route is closed when it is not. The residual close (Gas Rating 0 with no spare, at Open, grounded) is real but is a variety of "running dry", not a new close.

**At the table:** Private Hanna, alone on the plain, Breaks the Medium's leg and then Jams her harness dodging its Swat; her flares and cloak are gone. Her player reads section 5.13, sees "closes only when the ODM Gear Jams", and rides for the Wall. The rules gave her a better line: walk to On Body, spend the action on Field Repair (about 2 in 3 with a Push), feint across its face after its next card, and cut the Nape from beside it before the clock heals the leg. Nothing tells her so.

**Fix options** (drafter-level wording; no decision, no ADR change, no re-run of any figure):

1. Rewrite the *The route* bullet in section 5.13 as: "in the lone fight (Wooded) the route closes only when the ODM Gear Jams or runs dry with no sound horse left (8.2%). A Jam is repaired in the fight by Field Repair (Chapter 4, section 4.8) and an empty canister changed for a spare; at Open a grounded Titan's Nape lies two steps from In Reach, so only a Feint from On Body, with repaired ODM Gear, precedes the cut, and the Regeneration clock stands the Titan again within 3 rounds." Add the same "(Wooded)" scope to the 3b-1 *Why* sentence in the decision record if the record is still being annotated, or leave the record as history and let the chapter govern.
2. Add one clause to the Feint row's design note in section 5.6 (*The Feint*): "A Jammed harness is repaired on the spot by Field Repair (Chapter 4, section 4.8), so a Jam delays the Feint rather than ending it."
3. Optionally, one sentence under *A grounded Titan* in section 5.2: "At Open the window is short: the Regeneration clock heals the Broken leg within 3 rounds and the Titan stands (section 5.7)."

**Not recommended:** the Codex fix options. Option 1 (a Feint on foot against a grounded Titan, with no Gear Dice) and option 3 (a mounted Feint that places the soldier On Body) are rule changes that widen the lone route against every grounded Titan at every rating, change the Feint's priced exposure, and would need a decision, a re-run of the Feint need and screen sensitivities, and an ADR-0010 note. Option 2 (a grounded-Open In Reach to Blind Spot step on foot) changes every grounded Open strike and escape. None is needed, because the state has a legal path and the residual is a rare gear-loss close that the decision already accepts.

## What is not a finding

- The Codex reading of the horse route is correct: a mounted Feint from In Reach at Open is followed by one turn under the hold, which reaches only On Body. The gap in the finding is Field Repair, not the movement rules.
- The Open rating closing the Nape while the Titan stands is OQ-74's design, recorded in `anchor-ratings.yaml` (`open.meaning`) and section 5.2's design note, and applies to a full Squad as much as to a lone soldier. It is not a lone-soldier penalty under ADR-0010.
- The lone-fight probe's Wooded binding row is the committed reference (ADR-0014's default battlefield). Adding an Open row to `lone.py` as a report would show the short window; it is not required by any target and I do not raise it as a finding.
