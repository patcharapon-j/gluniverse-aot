# Playtest packet feedback, round 2: owner direction

Given 2026-09-17, on Artifact Version 3. Nothing is applied yet. When fixing starts, a decider turns these into a decision batch (DECISIONS, ADRs, CONTEXT, OQ entries) before any chapter or YAML changes, per `docs/playtest/HANDOFF.md`.

| # | Topic | Owner direction | Research file |
|---|---|---|---|
| 1 | ODM movement feel | "Movement feel a bit weird. In the show the odm gear is quite a set piece but in the game the move moment just happens. And fly roll is rarely used." Validated: confirmed and measured. | `odm-movement-feel.md` |
| 2 | Direction | "I want odm movement and environment to be more prominent. Dynamic and fun to play." | `odm-and-environment-design.md` |
| 3 | Sweep | "Check ALL part of the rule to see any similar issue exist." | `flatness-audit.md` |
| 4 | Three designs | "Propose three possible design to make the odm movement, flying etc more dynamic", plus fix Draw Attention, blade sets, environment, and the mounted step. | `design-proposals.md` |
| 5 | Gear Dice | "Let make it that gear dice is also rerolled on push." Analysed and measured; it works, but not for blades, and it breaks the Jam test as written. | `design-proposals.md`, fix 4 |
| 6 | All three designs | "I actually like all a b and c." Merged into one mechanism: C supplies the roll, B the currency, A the cap. | `unified-design.md` |
| 7 | Draw Attention, mounted | "Other two fix make sense." **Accepted by the owner.** | `design-proposals.md`, fixes 1 and 2 |

## Open for the owner

These need the owner's answer before a decider can record a batch.

1. **The merged design** (`unified-design.md`). Flight (every ODM move is rolled, the step always happens), Momentum (each success, lost the moment you stop flying), Anchors as everyone's Momentum cap, wrecked by the Titan. Accept the merge, or keep the three separate and pick one?
2. **Bite.** Momentum spent for a Bonus Die on a strike is the piece that shortens the fight and moves the kill-round target. Keep it and let the Anchor counts absorb it, or cut it and keep Momentum to movement and defence only?
3. **Table time.** The merge adds roughly a third more dice pools to a Titan Engagement (about +1 to +1.5 a round against 3.57). Acceptable for the first playtest, or is Flight only rolled when a soldier reaches for more than one step?
4. **Anchor counts.** Open 0, Sparse 1, Wooded 2, Urban 3, Giant Forest 3. Accept as the starting values for the retune?
5. **Blade swap** (`unified-design.md`, the Gear Dice question). Swap Blade Set spends the move in a Titan Engagement. This is the recommendation and it needs no tuned value to change. Do it?
6. **The Gear Die package.** Re-roll 2 to 5, keep 6, lock 1, plus a wear cap of 1 per Pushed roll, plus issued ODM Gear rising to rating 3. Measured at 24.2% on the Jam test against a bar of a third. Recommended **at the post-playtest retune**, not now. Agreed, or do you want it sooner?

## Accepted by the owner

- **Draw Attention** (`design-proposals.md`, fix 1): while a soldier holds the loudest flag they also meet every rung any other candidate meets except hooked into its body, plus a Talent so it stops being the only Titan Engagement action with none.
- **Mounted movement** (`design-proposals.md`, fix 2): the charge (a mounted Distant to In Reach step may set the loudest flag), and at Open a mounted move may make that step twice.

## Corrected

Findings 4 (Health inert) and 6 (Wits and Empathy thin) of `flatness-audit.md` were **wrong and are withdrawn**, with the correction on the page. Health is the buffer every Titan Critical Injury is spent against, since a Critical Injury crosses off a Health box and the last box makes the soldier Down. Treat Injury, Field Repair and Rally all do real work in a fight. No owner decision needed.

## Not recommended before the first playtest

Finding 7 of `flatness-audit.md`: Leap Clear is the only ODM-rated roll no Talent names. Small, and it can wait for Phase 2.
