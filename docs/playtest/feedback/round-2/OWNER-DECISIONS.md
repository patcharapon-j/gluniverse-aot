# Playtest packet feedback, round 2: owner direction

Given 2026-09-17, on Artifact Version 3. Nothing is applied yet. When fixing starts, a decider turns these into a decision batch (DECISIONS, ADRs, CONTEXT, OQ entries) before any chapter or YAML changes, per `docs/playtest/HANDOFF.md`.

| # | Topic | Owner direction | Research file |
|---|---|---|---|
| 1 | ODM movement feel | "Movement feel a bit weird. In the show the odm gear is quite a set piece but in the game the move moment just happens. And fly roll is rarely used." Validated: confirmed and measured. | `odm-movement-feel.md` |
| 2 | Direction | "I want odm movement and environment to be more prominent. Dynamic and fun to play." | `odm-and-environment-design.md` |
| 3 | Sweep | "Check ALL part of the rule to see any similar issue exist." | `flatness-audit.md` |

## Open for the owner

These need the owner's answer before a decider can record a batch.

1. **Anchors as a Squad-wide pool.** The design makes the environment a finite resource the whole Squad spends and the Titan destroys (Open 0 to Giant Forest 5). Accept the shape, or prefer a per-soldier budget, or prefer no resource at all and only the Swing?
2. **How far the retune may go.** The Swing is gated so it can first be measured as a sensitivity row. If the simulator shows the kill-round target has moved, is the Anchor budget the value that gets tuned, or may the Titans be retuned instead?
3. **Draw Attention** (`flatness-audit.md`, finding 2) is measured as actively harmful: Critical Injuries z +9.7. Fix the wording so the packet says what it can and cannot do, or give the action a real effect and rerun?
4. **Blade Sets** (`flatness-audit.md`, finding 3) cannot run out in a fight. Leave as is, or make the swap cost the move so blades bite?
5. **Mounted movement** (`flatness-audit.md`, finding 1) has no unique step anywhere. Give the horse one, or accept that its fight value is Gear Dice and the decoy?

## Not recommended before the first playtest

Findings 4, 6, and 7 of `flatness-audit.md` (Health inert under ADR-0005; Wits and Empathy thin in a fight under ADR-0006; Leap Clear with no Talent). Each is a consequence of a settled ADR and reopening one is a larger job than the playtest needs.
