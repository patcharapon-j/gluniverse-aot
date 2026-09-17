# Playtest packet feedback, round 2: owner direction

Given 2026-09-17, on Artifact Version 3. Nothing is applied yet. When fixing starts, a decider turns these into a decision batch (DECISIONS, ADRs, CONTEXT, OQ entries) before any chapter or YAML changes, per `docs/playtest/HANDOFF.md`.

| # | Topic | Owner direction | Research file |
|---|---|---|---|
| 1 | ODM movement feel | "Movement feel a bit weird. In the show the odm gear is quite a set piece but in the game the move moment just happens. And fly roll is rarely used." Validated: confirmed and measured. | `odm-movement-feel.md` |
| 2 | Direction | "I want odm movement and environment to be more prominent. Dynamic and fun to play." | `odm-and-environment-design.md` |
| 3 | Sweep | "Check ALL part of the rule to see any similar issue exist." | `flatness-audit.md` |
| 4 | Three designs | "Propose three possible design to make the odm movement, flying etc more dynamic", plus fix Draw Attention, blade sets, environment, and the mounted step. | `design-proposals.md` |
| 5 | Gear Dice | "Let make it that gear dice is also rerolled on push." Analysed and measured; it works, but not for blades, and it breaks the Jam test as written. | `design-proposals.md`, fix 4 |

## Open for the owner

These need the owner's answer before a decider can record a batch.

1. **Which movement design.** A (Anchors: the field is a resource the Titan destroys), B (Momentum: keep flying or lose it), or C (Approach Roll: every flight is rolled and its successes spent). Recommendation is A now and B next, since they compose. See `design-proposals.md`.
2. **Anchors as a Squad-wide pool**, if A is taken. Open 0 to Giant Forest 5, spent by any soldier, destroyed by the Titan and never restored. Accept the shape, or prefer a per-soldier budget?
3. **How far the retune may go.** The new move is gated so it can first be measured as a sensitivity row. If the kill-round target has moved, is the design's own budget the value that gets tuned, or may the Titans be retuned instead?
4. **Gear Dice on a Push.** Reading A (re-roll 2 to 5, keep 6, lock 1, the Stress Die's own pattern) takes the Jam test from 26.3% to 53.1% against a bar of a third, and still does not make blades run out inside a fight. Take it for the Blade Set only, take it everywhere with a wear cap and issued ODM Gear 3, or set a new Jam bar deliberately?
5. **The blade swap.** Making blades bite inside a fight needs the swap to cost the move, not a higher ruin rate. Do it?
6. **Draw Attention.** The proposed fix (`design-proposals.md`, fix 1) lets the loudest flag match every rung except hooked into its body, which is exactly the room ADR-0010 leaves. Take it, or take the XS packet-only wording fix instead?
7. **Mounted movement.** The proposed fix (`design-proposals.md`, fix 2) is the charge (a mounted Distant to In Reach step may set the loudest flag) plus a double step at Open. Take both, one, or neither?

## Corrected

Findings 4 (Health inert) and 6 (Wits and Empathy thin) of `flatness-audit.md` were **wrong and are withdrawn**, with the correction on the page. Health is the buffer every Titan Critical Injury is spent against, since a Critical Injury crosses off a Health box and the last box makes the soldier Down. Treat Injury, Field Repair and Rally all do real work in a fight. No owner decision needed.

## Not recommended before the first playtest

Finding 7 of `flatness-audit.md`: Leap Clear is the only ODM-rated roll no Talent names. Small, and it can wait for Phase 2.
