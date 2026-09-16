# GM judgment: review fix plan, round 2

Date: 2026-09-16. Deciders: the rules decider for batch 9 (Opus), who decided Opus C1, Opus M2, Astra M1, and the nine Opus Minors; and a Fable decider running in parallel, who decided Opus M1 and Opus M3. Inputs: `docs/reviews/gm-judgment-review-2.md` (Opus: C1, M1, M2, M3, m1 to m9) and `docs/reviews/gm-judgment-review-2-astra.md` (Astra: M1, m1), each finding verified against the chapters, `data/`, `CONTEXT.md`, and the ADRs; `OWNER-DECISIONS.md`; decision batch 9 (9-1 to 9-35 and both errata under 9-14); ADR-0024's limits.

Rulings are recorded as **9-36 and 9-37** (the Fable decider; OQ-179) and **9-38 to 9-41** (this decider; OQ-180) in `docs/rules/DECISIONS-2026-09-14.md`. Both reviews confirm every one of round 1's 27 findings resolved, and nothing changed for the worse.

## 1. Counts

| Verdict | Finding ids | Problems |
|---|---|---|
| Rejected | none | 0 |
| Pure fix | none: every finding needed a ruling, or was already fixed | 0 |
| Already fixed, verified | Astra m1 | 1 |
| Decided | Opus C1, M1, M2, M3, m1 to m9; Astra M1 | 14 |
| Pending owner | none | 0 |

Every finding was verified as real. Nothing is escalated: no ruling in this round changes a tuned number, a closed value, a measured figure, or an owner answer. The simulator is not rerun (9-17), and no YAML field these fixes edit is read by a `tools/sim/rules.py` guard.

**Astra m1 is already fixed and needs no work package.** `docs/adr/0016-content-beyond-canon-follows-the-charter.md` charter item 6 now reads "ADR-0024 limits 9 and 12", and `docs/adr/0019-titan-attacks-are-rolled-and-the-reaction-cancels.md`'s attack paragraph now closes on "ADR-0024, limit 8". A grep for `ADR-0003` across both files returns nothing, and the historical mentions that explain the supersession are untouched, as the finding asked.

## 2. Every finding

| Review | Id | Severity | Verdict | Decision item | Files | Package |
|---|---|---|---|---|---|---|
| Opus | C1 | Critical | Decided | 9-38: the Height procedure stops at a band already named; a ruling's fall is low or high, never extreme, inside a Titan Engagement as well as outside one; knock loose, letting go, and a release from a lift still take the steps | `04` 4.6; `falls.yaml` | WP-S1 |
| Opus | M1 | Major | Decided by the Fable decider | 9-36: a called roll can be made in a fight, only for an act no entry of kind `action` could model that changes nothing the fight tracks; it spends the action, Help is the fight's, its fall is low or high | `01` 1.1, 1.3, 1.8, 1.9; `02` 2.9; `05` preface, 5.4; `07` preface, 7.4; `dice-pool.yaml`, `circumstances.yaml`, `action-catalog.yaml`, `skirmish.yaml`; `CONTEXT.md`; ADR-0024 limits 7, 9, 17 (applied) | WP-S2, S3, S4, S5, S6 |
| Opus | M2 | Major | Decided | 9-39: an act modelled on the Nape strike is resolved as a strike that falls short, whatever its successes; reaching the Nape Depth creates its Openings and nothing else | `02` 2.9; `05` 5.4; `titan-harm.yaml`, `action-catalog.yaml` | WP-S2, S3 |
| Opus | M3 | Major | Decided by the Fable decider | 9-37: the route sets each Leg's Band, Post, and Pace, which the hazard roll reads as written; the modifiers' amounts stay closed; 4 to 6 Legs, no Leg deeper than the interim route gives its place, at most one Depot; the log tags an authored route | `01` 1.1 item 6; `07` preface, 7.1; `route.yaml`, `hazards.yaml`; `CONTEXT.md`; ADR-0009, ADR-0014 (applied) | WP-S4, S5, S6 |
| Opus | m1 | Minor | Decided | 9-41 item 1: a place is one building, wagon, or cache; a Waypoint scene yields Squad Supply to at most two called searches; the units found are logged | `squad-supply.yaml`; `04` 4.10; `07` 7.1 | WP-S1, S4 |
| Opus | m2 | Minor | Decided | 9-41 item 2: 9-34 item 1's payer clauses restored (a lost item is the roller's, a lost unit the Squad's, time or position the situation's) | `01` 1.1 item 1; `dice-pool.yaml` | WP-S5 |
| Opus | m3 | Minor | Decided | 9-41 item 3: a row's own rolls only; a fight a row begins takes its Circumstances as any fight does. An erratum on 9-34 item 3 | `07` 7.1 | WP-S4 |
| Opus | m4 | Minor | Decided | 9-41 item 4: `circumstances.yaml` gains `hazard_rows` beside `reactions` | `circumstances.yaml` | WP-S5 |
| Opus | m5 | Minor | Decided | 9-41 item 5: the Skirmish's model entry is one of kind `action`, which rules out `reload`, `release`, `swap-blade-set`, `shed-load`, and `mount-or-dismount`; 9-27's two clauses appended | `skirmish.yaml` | WP-S4 |
| Opus | m6 | Minor | Decided | 9-41 item 6: the renderer's roll-row schema takes `circumstances` as an optional unrendered key, and the infirmary roll carries the real field | `render.py`; `downtime.yaml` | WP-S4 |
| Opus | m7 | Minor | Decided | 9-41 item 7: a table-made Foe kind waits for Phase 2, said in the chapter and as a field, as 9-7 item 5 already implied | `foes.yaml`; `07` 7.4 | WP-S4 |
| Opus | m8 | Minor | Decided | 9-41 item 8: `gm-horror` may be called in a Skirmish, which is outside a Titan Engagement (owner answer 6); Chapter 7 names it, and the design note records that the probe never calls one | `fear-rolls.yaml`; `07` 7.4 | WP-S4 |
| Opus | m9 | Minor | Decided | 9-41 item 9: 9-35's Health sentence printed where a GM stakes a fall | `04` 4.6; `falls.yaml` | WP-S1 |
| Astra | M1 | Major | Decided | 9-40: the camp's own Waypoint sets the Anchor Rating; a second retreat moves the camp no further; the night hazard keeps the day's last ridden Leg's Band; 9-33's queued repeat is unchanged | `legs.yaml`, `hazards.yaml`; `07` 7.1 | WP-S4 |
| Astra | m1 | Minor | Already fixed, verified | none needed | `docs/adr/0016-*.md`, `docs/adr/0019-*.md` | none |

File shorthand: `01` to `07` are `docs/rules/0n-*.md`; YAML names are under `data/` as batch 9 gives them.

## 3. Work packages

Each package owns its files alone, so **WP-S1 to WP-S6 run in parallel** (wof-drafter, one per package). Each applies the *Chapter impact* bullets of its items for the files it owns, and nothing else. Because 9-36 and 9-37 touch the same chapters and YAML as this decider's items, the Fable decider's items are assigned to the package that owns each file rather than to packages of their own: that is what keeps the file sets disjoint. Re-rendering writes through `tools/render/render.py`, so a package takes `docs/rules/.lock-render.py` (loop-wait if present, create it empty, delete when done) around any render write. No package edits `site/`, `tools/sim/`, or the packet.

| Package | Files it owns | Applies |
|---|---|---|
| **WP-S1** Chapter 4, falls, supply | `docs/rules/04-gear.md`; `data/gear/falls.yaml`, `squad-supply.yaml` | 9-38 (all of it); 9-41 items 1 (the `squad-supply.yaml` and 4.10 parts) and 9 |
| **WP-S2** Chapter 5 and Titan harm | `docs/rules/05-titan-engagement.md`; `data/engagement/titan-harm.yaml` | 9-39 (the Chapter 5 and `titan-harm.yaml` parts); 9-36 (the Chapter 5 preface and 5.4 parts) |
| **WP-S3** Chapter 2 and the Catalog | `docs/rules/02-character-creation.md`; `data/character/action-catalog.yaml` | 9-39 (the Chapter 2 and `action-catalog.yaml` parts); 9-36 (the Chapter 2 and `action-catalog.yaml` parts) |
| **WP-S4** Chapter 7, Skirmish, Expedition, Downtime, the renderer | `docs/rules/07-playtest-rules.md`; `data/skirmish/skirmish.yaml`, `foes.yaml`; `data/expedition/legs.yaml`, `hazards.yaml`, `route.yaml`; `data/campaign/downtime.yaml`; `data/mind/fear-rolls.yaml`; `tools/render/render.py` (under its lock) | 9-40; 9-41 items 1 (the 7.1 sentence), 3, 5, 6, 7, 8; 9-36 (the Chapter 7 and `skirmish.yaml` parts); 9-37 (the Chapter 7, `route.yaml`, and `hazards.yaml` parts) |
| **WP-S5** Chapter 1 and `data/core` | `docs/rules/01-core-rules.md`; `data/core/circumstances.yaml`, `dice-pool.yaml` | 9-41 items 2 and 4; 9-36 (the Chapter 1, `dice-pool.yaml`, and `circumstances.yaml` parts); 9-37 (Chapter 1 item 6) |
| **WP-S6** the glossary | `CONTEXT.md` | 9-36 (**Called roll**); 9-37 (**Mission Brief**) |

**Sequencing.** None. WP-S1 to WP-S6 have no ordering between them: no package reads a file another package writes, and every cross-reference each package inserts points at a section or key that already exists or that its own item creates. WP-S4 is the largest and should start first if drafters are added one at a time.

**Already applied by the deciders, so no package touches them:** ADR-0024 (limits 7, 9, and 17, with `## Amended`, for 9-36), ADR-0009 and ADR-0014 (`## Amended`, for 9-37), `docs/rules/DECISIONS-2026-09-14.md`, and `docs/rules/OPEN-QUESTIONS.md`. ADR-0024 limit 17 needs no edit for 9-38: it already states the cap, and 9-38 is the chapter fix that makes Chapter 4 obey it.

**Checks for every package:** `uv run --with pyyaml python tools/render/render.py check`; the YAML load command in `docs/playtest/HANDOFF.md`; the simulator's `tools.sim.rules.Rules()` smoke load, whose phrase guards must still pass (no fix here edits a guarded field; WP-S4 leaves `skirmish.yaml` `grit.breaks_when`, `grit.on_breaking`, and `reactions`, and `foes.yaml` `foe_rule`, untouched); a grep of the package's files for em dashes, `PROVISIONAL`, and `ADR-0003`. WP-S4 runs the render check twice, once after the `render.py` change of 9-41 item 6 and once after its YAML edits, and also `tools/probes/chapter-06/render.py check`. Nobody runs `tools/sim/run.py`.

## 4. Packet impact

Findings whose fix changes text the packet must carry. The packet is not edited by these packages; it takes the text at its next republish (WP-P3), as 9-36's and 9-37's own notes say. Anchors and quoted phrases hold even where line numbers have moved.

- **9-36 (Opus M1):** `#core-dice` *Roll when it matters* (a called roll can be made in a fight, and when); the stakes menu's **Time or position** and the success list; *Trying again*; `#core-help`'s called-roll bullet; `#actions-ruled` *In a fight*; the Titan Engagement section's improvised acts text; the Skirmish's *What a soldier can do*; glossary **Called roll**.
- **9-37 (Opus M3):** `#gm-stands` and the GM section's Expedition text (the hazard and Night tables, their rolls, and their modifiers' amounts); the Expedition section's route text, which gains the bounds; the Rulings log, which gains the row "A route a Brief set (its Legs, each Leg's band and Post, the Hard Ride days, its Depots)"; glossary **Mission Brief**.
- **9-38 (Opus C1):** the fall named by a ruling (low or high, never extreme, and the Height steps never raise it, inside a Titan Engagement as outside one); the GM section menu's **A fall** line, if it carries the band.
- **9-39 (Opus M2):** the Titan Engagement section's improvised acts text, wherever it carries "an act modelled on the Nape strike never does".
- **9-40 (Astra M1):** the Expedition section's Night Camp text, if it carries the Anchor Rating sentence or the overnight fall back.
- **9-41 item 1 (m1):** the Squad Supply units paragraph and the GM section's **Found supplies** line, which gain the place and the two-search scene cap.
- **9-41 item 2 (m2):** `#core-dice` *Roll when it matters*, the shared-act sentence, which gains the payer clauses.
- **9-41 item 8 (m8):** the Skirmish's Fear Roll list, which gains `gm-horror`.
- **9-41 item 9 (m9):** the fall stake line, which gains the current-Health sentence.

Not in the packet: 9-41 items 3, 4, 5, 6, and 7 (a chapter Circumstances paragraph, YAML keys, the renderer, and a Phase 2 marker the packet never carried).

## 5. Records applied by this decider

- `docs/rules/DECISIONS-2026-09-14.md`: items 9-38 to 9-41, their four summary-table rows, and the *Review round 2* paragraph under *Chapter impacts of batch 9*. Written under `docs/rules/.lock-DECISIONS-2026-09-14.md`.
- `docs/rules/OPEN-QUESTIONS.md`: OQ-180 (decided), recording this decider's four rulings beside OQ-179's two. Written under `docs/rules/.lock-OPEN-QUESTIONS.md`.
- No ADR change. 9-38 to 9-41 each apply a limit ADR-0024 already carries.
- Verified, not written: Astra m1, already fixed in ADR-0016 and ADR-0019.

## 6. Escalations

None. No finding this decider settled reopens a tuned number, a closed value, a measured figure, or an owner answer:

- **Opus m8** was settled the owner's way, not against it. Owner answer 6 permits a GM-called Fear Roll outside a Titan Engagement, and a Skirmish is outside one, so the review's second option (restricting `gm-horror` in a Skirmish) would have reversed 9-6 and the owner. It was not taken; the Skirmish probe's baseline is recorded instead.
- **Opus m1's** scene cap of two called searches extends 9-29 rather than reversing it, and touches no stock number. It is new and unmeasured, so it is logged for the retune and listed here as a reading **the owner may veto**, in the batch's existing practice for readings the owner has not seen.
- **Opus m7's** deferral of a table-made Foe kind to Phase 2 states what 9-7 item 5 already decided ("none ships in the first playtest") and leaves ADR-0016 as amended unchanged. It is the second reading **the owner may veto**, since it closes a power the YAML currently reads as live.
- Opus M3's bounds (9-37) set counts nothing has measured; that item is the Fable decider's, and its own record carries the reasoning and the playtest log that answers it.
