# Playtest packet feedback, round 2: owner direction

Given 2026-09-17, on Artifact Version 3. **Applied 2026-09-17 as decision batch 10 (OQ-182 to OQ-186).** The owner answered every open question below, and the batch is recorded in `docs/rules/DECISIONS-2026-09-14.md` and applied across the data, the chapters, the packet, the site and the Foundry system. The simulator has not been rerun: batch 10 is a retune and every figure in `docs/reviews/simulator-report.md` and `data/engagement/tuning.yaml` is marked stale until it runs.

| # | Topic | Owner direction | Research file |
|---|---|---|---|
| 1 | ODM movement feel | "Movement feel a bit weird. In the show the odm gear is quite a set piece but in the game the move moment just happens. And fly roll is rarely used." Validated: confirmed and measured. | `odm-movement-feel.md` |
| 2 | Direction | "I want odm movement and environment to be more prominent. Dynamic and fun to play." | `odm-and-environment-design.md` |
| 3 | Sweep | "Check ALL part of the rule to see any similar issue exist." | `flatness-audit.md` |
| 4 | Three designs | "Propose three possible design to make the odm movement, flying etc more dynamic", plus fix Draw Attention, blade sets, environment, and the mounted step. | `design-proposals.md` |
| 5 | Gear Dice | "Let make it that gear dice is also rerolled on push." Analysed and measured; it works, but not for blades, and it breaks the Jam test as written. | `design-proposals.md`, fix 4 |
| 6 | All three designs | "I actually like all a b and c." Merged into one mechanism: C supplies the roll, B the currency, A the cap. | `unified-design.md` |
| 7 | Draw Attention, mounted | "Other two fix make sense." **Accepted by the owner.** | `design-proposals.md`, fixes 1 and 2 |

## Answered by the owner

Every question below was put to the owner and answered. The answers are the batch.

1. **The merged design.** Take all three: "I actually like all a b and c." Merged into one mechanism, since the three are one mechanism seen from three sides. Applied as 10-1.
2. **Bite.** Kept. It stays the first thing to cut if the rerun shows the kill-round target has moved, and the rerun must measure it separately.
3. **Table time.** Accepted at about +1 to +1.5 dice pools a round against 3.57. Flight is rolled for every ODM move, not only for a reach beyond one step.
4. **Anchor counts.** Accepted as the starting values: Open 0, Sparse 1, Wooded 2, Urban 3, Giant Forest 3.
5. **Blade swap.** Taken. Swap Blade Set spends the move in a Titan Engagement (10-4).
6. **The Gear Die package.** ~~Deferred to the post-playtest retune, as recommended.~~ **Taken 2026-09-18**, on the owner's instruction to do it in the same change as the site audit. Applied whole as decision batch 11 (OQ-187): a Push re-rolls a Gear Die showing 2 to 5, keeps a 6, and locks a 1; a Pushed roll wears its gear item by at most 1 point; and issued ODM Gear rises to rating 3 from Funding 3 up. Measured at 24.2% against the Jam test's bar of a third. The simulator rerun batch 10 schedules now covers it too.
7. **The Talent and the list-size lock.** "Remove the lock. Add the talent." Done: `list_size` reads at least eight, the Leader's list holds nine, the total is 84, the Foundry schema is `min(8)`, and the Talent is **Shout Them Off** (Leader, rule, once per Titan Engagement: you may spend your move on Draw Attention instead of your action). It follows Quick Refit's precedent, because no Talent in the game grants Bonus Dice and a dice Talent is impossible on an entry that is never rolled.

## Raised while applying, and decided

**OQ-186 / item 10-5**, raised by the packet drafter rather than left as a drafting guess: a move made under a **retreat is a Flight**, because a retreat narrows the soldier's own move rather than replacing it; a Fear Roll's **forced step never is**, because it is a change of Position a rule names and not the soldier's move. Momentum is the reward for choosing to fly, and a soldier flung back by fear has chosen nothing.

## Accepted by the owner, and applied

- **Draw Attention** (fix 1, applied as 10-3): while a soldier holds the loudest flag they also meet every rung any other candidate meets except hooked into its body. ADR-0010 is preserved as written rather than amended, because its promise protects rung 1 only and everything below it was the room the fix used. The Talent came with it (see item 7 above).
- **Mounted movement** (fix 2, applied as 10-2): the charge, and the double step at Open.

## Corrected

Findings 4 (Health inert) and 6 (Wits and Empathy thin) of `flatness-audit.md` were **wrong and are withdrawn**, with the correction on the page. Health is the buffer every Titan Critical Injury is spent against, since a Critical Injury crosses off a Health box and the last box makes the soldier Down. Treat Injury, Field Repair and Rally all do real work in a fight. No owner decision needed.

## Not recommended before the first playtest

Finding 7 of `flatness-audit.md`: Leap Clear is the only ODM-rated roll no Talent names. Small, and it can wait for Phase 2.
