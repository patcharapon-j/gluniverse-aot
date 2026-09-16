# GM judgment: review fix plan, round 3

Date: 2026-09-16. Decider: the rules decider for batch 9 (Fable), who decided every finding of the round. Inputs: `docs/reviews/gm-judgment-review-3.md` (Opus: 0 Critical, 3 Major, 7 Minor) and `docs/reviews/gm-judgment-review-3-fable.md` (Fable: 0 Critical, 0 Major, 8 Minor), each finding verified against the chapters, `data/`, `CONTEXT.md`, and the ADRs; `OWNER-DECISIONS.md` (owner intent governs: trust the GM, Circumstances as dice, needs only from the fiction, results stand, the GM rules before the dice); decision batch 9 (9-1 to 9-41); ADR-0024's limits.

Rulings are recorded as **9-42 to 9-45** (OQ-181) in `docs/rules/DECISIONS-2026-09-14.md`. Both reviews confirm every one of round 2's fifteen findings resolved and every ruling 9-36 to 9-41 applied as written. This is the last round: the three Majors are consequences of 9-36's called roll inside a fight meeting older closed sentences, and each is settled below.

## 1. Counts

| Verdict | Finding ids | Problems |
|---|---|---|
| Rejected | none | 0 |
| Pure fix (records) | Opus m3 and Fable m8 (the same `PROGRESS.md` gap) | 1 |
| Applied by the decider | Opus m4 (four ADR-0003 citations inside `docs/adr/`) | 1 |
| Decided | Opus M1, M2, M3, m1, m2, m5, m6, m7; Fable m1 to m7 | 15, in four items |
| Pending owner | none | 0 |

Every finding was verified as real, with one premise corrected: Opus m6 says Chapter 1 section 1.8 *Requirements* never mentions the called roll, but its last bullet does ("or, on a called roll, the GM rules them present and able"); that bullet is itself stale for a Skirmish, so the finding's fix is 9-42's. One claim in the Fable review's walk is wrong and is noted under 9-45 item 1: Chapter 7's Reaction bullet and `circumstances.yaml` `reactions` carry the Reaction's timing only, not 9-36 item 6's ban on a called roll standing in for a Reaction, which was in no chapter and no YAML, as Opus m1 says. Nothing is escalated: no ruling changes a tuned number, a closed value, a measured figure, or an owner answer. The simulator is not rerun (9-17), and no YAML field these fixes edit is read by a `tools/sim/rules.py` guard.

**Duplicates merged.** Fable m1 and m2 are Opus M1 (9-42). Fable m6 is Opus M3 (9-44). Fable m5 is Opus m2 (9-45 item 2), and Fable m4 sits beside them in the same sentence. Fable m8 is Opus m3 (the records package).

## 2. Every finding

| Review | Id | Severity | Verdict | Decision item | Files | Package |
|---|---|---|---|---|---|---|
| Opus | M1 | Major | Decided | 9-42: no new rule; every "as the GM rules" Help sentence is scoped to outside a Titan Engagement and a Skirmish, and `bonus-dice-sources.yaml`, the glossary, Chapter 1's Covering and Help requirements, Chapter 2 section 2.9, and the Catalog's nine `when_called` rows carry the Skirmish's Help (the review's options 1 and 2) | `01` 1.5, 1.8; `02` 2.9, Appendix 2A; `bonus-dice-sources.yaml`, `action-catalog.yaml`; `CONTEXT.md` | WP-K1, K2 |
| Opus | M2 | Major | Decided | 9-43: the GM may name Fly for a called roll in a Skirmish, the one Fly roll a Skirmish has; it takes the ODM Gear's Gear Dice (9-24), makes no soldier airborne, makes no Gas Roll, drops no one on a Jam, and gives no Engaged or Apart; "no Fly roll" reads "no Fly roll a rule calls for" (the review's options 2 and 3) | `07` 7.4; `skirmish.yaml`, `action-catalog.yaml` | WP-K2, K4 |
| Opus | M3 | Major | Decided | 9-44: a staked fall in a Titan Engagement is a fall in full and lands as `falls_land` gives; that change of Position is the fall rule's, not the ruling's; the "nothing the fight tracks" limit binds the act, the cost, and the success (the review's options 1 and 3; ADR-0024 limit 17 amended) | `01` 1.1; `04` 4.6; `05` 5.4; `dice-pool.yaml`, `falls.yaml` | WP-K1, K3 |
| Opus | m1 | Minor | Decided | 9-45 item 1: a called roll in a fight is made on the soldier's turn, and no called roll stands in for a Reaction, printed in every place the called roll is | `01` 1.9; `05` 5.4; `07` 7.4; `dice-pool.yaml`, `skirmish.yaml` | WP-K1, K3, K4 |
| Opus | m2 | Minor | Decided (merged with Fable m4, m5) | 9-45 item 2: the modelled Nape strike sets the hooked-by-strike flag, and Relentless adds its Opening only on at least 1 success | `02` 2.9; `05` 5.4; `titan-harm.yaml`, `action-catalog.yaml` | WP-K2, K3 |
| Opus | m3 | Minor | Pure fix (records) | none: the `PROGRESS.md` package table gains the ten missing rows, round labels that end the WP-S1 and WP-S2 collision, the Review row's rounds 2 and 3, the process line, and this round's rows | `docs/rules/PROGRESS.md` | WP-K5 |
| Opus | m4 | Minor | Applied by the decider | none: ADR-0006 cites ADR-0024 limits 9 and 12; ADR-0010's batch 3e and batch 4 paragraphs cite limits 2 and 8; ADR-0013 cites limit 8; each ADR's batch 9 paragraph records the swap | `docs/adr/0006-*.md`, `0010-*.md`, `0013-*.md` | none (done) |
| Opus | m5 | Minor | Decided | 9-45 item 4: "Otherwise, before the pool is built" reads "When an entry of kind `action` the soldier could take in that fight can model it, before the pool is built"; no sentence moves | `02` 2.9; `action-catalog.yaml` | WP-K2 |
| Opus | m6 | Minor | Decided (folded into 9-42) | 9-42: section 1.8 *Requirements*' last bullet is rewritten for a Skirmish and points at the **On a called roll** bullet | `01` 1.8 | WP-K1 |
| Opus | m7 | Minor | Decided | 9-45 item 5: in a fight, success on a called roll never gives found Squad Supply; a place at hand is searched once the fight has ended, under section 4.10's caps | `01` 1.1; `04` 4.10; `05` 5.4; `dice-pool.yaml`, `squad-supply.yaml` | WP-K1, K3 |
| Fable | m1 | Minor | Decided (merged into Opus M1) | 9-42: the Chapter 2 and Catalog sentences | `02` 2.9; `action-catalog.yaml` | WP-K2 |
| Fable | m2 | Minor | Decided (merged into Opus M1) | 9-42: the glossary's **Help** | `CONTEXT.md` | WP-K2 |
| Fable | m3 | Minor | Decided | 9-45 item 3: the Skirmish's parenthetical names a Foe's Attack Dice and Watch | `07` 7.4; `skirmish.yaml` | WP-K4 |
| Fable | m4 | Minor | Decided (merged with Opus m2) | 9-45 item 2: Relentless's trigger, at least 1 success | `05` 5.4; `titan-harm.yaml`, `action-catalog.yaml` | WP-K2, K3 |
| Fable | m5 | Minor | Decided (merged with Opus m2) | 9-45 item 2: the hooked-by-strike flag in both chapters | `02` 2.9; `05` 5.4 | WP-K2, K3 |
| Fable | m6 | Minor | Decided (merged into Opus M3) | 9-44: the landing clause in section 5.4 | `05` 5.4 | WP-K3 |
| Fable | m7 | Minor | Decided | 9-45 item 6: a camp at the gate the Expedition left rolls its Anchor Rating on the setup table, and the Expedition goes on (the review's first option; ending the Expedition there was rejected, since only the route's last Waypoint ends it) | `07` 7.1; `legs.yaml`, `hazards.yaml` | WP-K4 |
| Fable | m8 | Minor | Pure fix (records, merged with Opus m3) | none: the `PROGRESS.md` rows, the Review row, and the process line | `docs/rules/PROGRESS.md` | WP-K5 |

File shorthand: `01` to `07` are `docs/rules/0n-*.md`; YAML names are under `data/` as batch 9 gives them.

## 3. Work packages

Each package owns its files alone, so **WP-K1 to WP-K4 run in parallel** (wof-drafter, one per package), and **WP-K5 runs after they report**, since it records their status. The names WP-K1 to WP-K5 are new: WP-R1 to WP-R6 were review round 1's, WP-S1 to WP-S6 review round 2's, and WP-0, WP-A to WP-D, WP-F, WP-R, WP-T, WP-S1, WP-S2, and WP-P the feedback round's. Each package applies the *Chapter impact* bullets of its items for the files it owns, and nothing else. Re-rendering writes through `tools/render/render.py`, so a package takes `docs/rules/.lock-render.py` (loop-wait if present, create it empty, delete when done) around any render write. No package edits `site/`, `tools/sim/`, the packet, or `docs/rules/PROGRESS.md` except WP-K5.

| Package | Files it owns | Applies |
|---|---|---|
| **WP-K1** Chapter 1 and `data/core` | `docs/rules/01-core-rules.md`; `data/core/dice-pool.yaml`, `bonus-dice-sources.yaml` | 9-42 (section 1.5 *Covering*, section 1.8 *Requirements*; `bonus-dice-sources.yaml` `help`); 9-44 (section 1.1 **A fall**; `dice-pool.yaml` `failure_menu.fall`); 9-45 items 1 (section 1.9; `dice-pool.yaml` `in_a_fight`) and 5 (section 1.1 *What success gives*; `dice-pool.yaml` `success_gives`) |
| **WP-K2** Chapter 2, the Catalog, and the glossary | `docs/rules/02-character-creation.md`; `data/character/action-catalog.yaml`; `CONTEXT.md` | 9-42 (section 2.9 *Outside a fight* and *Rolls called by attribute*; the Catalog's `rolls_called_by_attribute`, the nine `when_called` rows' `help_outside_titan_engagement`, the `help` entry's `notes`; re-render Appendix 2A; `CONTEXT.md` **Help**); 9-43 (`fly` `requirements`); 9-45 items 2 (section 2.9's 9-39 sentence; the Catalog's `in_a_fight` Relentless and flag clause) and 4 (section 2.9 and `in_a_fight`, "Otherwise") |
| **WP-K3** Chapters 4 and 5, falls, supply, and Titan harm | `docs/rules/04-gear.md`, `05-titan-engagement.md`; `data/gear/falls.yaml`, `squad-supply.yaml`; `data/engagement/titan-harm.yaml` | 9-44 (section 4.6 **Named by a rule or a ruling**; section 5.4 *A called roll in a Titan Engagement*; `falls.yaml` `after_the_fall.gm`); 9-45 items 1 (section 5.4, the turn sentence), 2 (section 5.4's 9-39 sentence; `titan-harm.yaml` `nape_strikes.modelled`), and 5 (section 4.10; section 5.4's success clause; `squad-supply.yaml` `spending`) |
| **WP-K4** Chapter 7, the Skirmish, and the Expedition | `docs/rules/07-playtest-rules.md`; `data/skirmish/skirmish.yaml`; `data/expedition/legs.yaml`, `hazards.yaml` | 9-43 (section 7.4 *Engaged and Apart* and **A called roll**; `skirmish.yaml` `not_positions` and `actions.called_roll`); 9-45 items 1 (section 7.4 **A called roll**; `skirmish.yaml` `actions.called_roll`), 3 (the parenthetical, both places), and 6 (section 7.1 *The Night Camp* step 4; `legs.yaml` `night_camp.at_waypoint`; `hazards.yaml` `night.anchor_rating`) |
| **WP-K5** the records | `docs/rules/PROGRESS.md` (under `docs/rules/.lock-PROGRESS.md`, loop-wait if present, create it empty, delete when done) | The repair Opus m3 and Fable m8 ask for, section 3a below, and this round's rows |

**Sequencing.** WP-K1 to WP-K4 have no ordering between them: no package reads a file another package writes, and every cross-reference each package inserts points at a section or key that already exists. WP-K2 is the largest (nine Catalog rows and an Appendix 2A re-render) and should start first if drafters are added one at a time. WP-K5 starts once WP-K1 to WP-K4 have reported, so its rows carry their real status; no other package touches `PROGRESS.md`, which is what ended round 2 with a package table one round behind.

**Already applied by the decider, so no package touches them:** ADR-0024 (limit 17, with `## Amended`, for 9-44), ADR-0006, ADR-0010, and ADR-0013 (the four ADR-0003 citations, for Opus m4), `docs/rules/DECISIONS-2026-09-14.md` (9-42 to 9-45, their summary rows, and the *Review round 3* paragraph), and `docs/rules/OPEN-QUESTIONS.md` (OQ-181).

**Guarded fields, untouched.** WP-K4 leaves `skirmish.yaml` `ambush`, `reactions`, `grit.breaks_when`, `grit.on_breaking`, and `ending` as they are, and does not open `foes.yaml`; WP-K3 leaves `titan-harm.yaml` `regeneration` alone. Every field these packages edit is prose the simulator does not parse.

**Checks for every package:** `uv run --with pyyaml python tools/render/render.py check`; the YAML load command in `docs/playtest/HANDOFF.md`; the simulator's `tools.sim.rules.Rules()` smoke load, whose phrase guards must still pass; a grep of the package's files for em dashes, `PROVISIONAL`, and `ADR-0003`; and, for WP-K2 and WP-K4, a grep of their files for "as the GM rules" to confirm that every remaining hit is scoped to outside a fight. WP-K2 runs the render check after the Appendix 2A re-render; WP-K4 runs it after its `skirmish.yaml` edits (the rendered `called-roll` row does not change, so no table moves) and also `tools/probes/chapter-06/render.py check`. Nobody runs `tools/sim/run.py`.

### 3a. The `PROGRESS.md` repair (WP-K5)

The *GM judgment packages* table (`docs/rules/PROGRESS.md`, lines 71 to 91 as the file stands) lists WP-G0 to WP-G5, 9-21 to 9-24, Review, WP-M4, WP-R6, WP-S6, and WP-P3, and no row for WP-R1 to WP-R5 or WP-S1 to WP-S5, though the chapter rows above describe their work; and the *Feedback round 1 packages* table names its simulator packages WP-S1 and WP-S2, so the same two names mean two things one table apart. WP-K5 does all of the following, and nothing else in the file:

1. **The ten missing rows.** Insert, after the WP-M4 row and before the WP-R6 row, one row each for WP-R1 to WP-R5 (Done), with the files and items `docs/research/gm-judgment/REVIEW-FIX-PLAN-round-1.md` section 5 gives each; and, after the WP-R6 row and before the WP-S6 row, one row each for WP-S1 to WP-S5 (Done), with the files and items `REVIEW-FIX-PLAN-round-2.md` section 3 gives each. The chapter rows at lines 13 to 19 already state what each applied and are the source for the scope column.
2. **The round labels.** In that table, every package cell of a review fix package reads its round beside its name: "WP-R1 (review round 1)" to "WP-R6 (review round 1)", "WP-S1 (review round 2)" to "WP-S6 (review round 2)", and "WP-K1 (review round 3)" to "WP-K5 (review round 3)". Add one sentence to the paragraph above the table: "WP-R1 to WP-R6 are the GM judgment review's round 1 fix packages and WP-S1 to WP-S6 its round 2 packages (`docs/research/gm-judgment/REVIEW-FIX-PLAN-round-1.md`, `-round-2.md`), distinct from the simulator packages WP-S1 and WP-S2 of the *Feedback round 1 packages* table above; WP-K1 to WP-K5 are round 3's (`-round-3.md`)." No package is renamed anywhere else: the plans, the chapter rows, and the decisions file keep the names as written.
3. **The Review row.** Extend it to rounds 2 and 3: round 2 ran on `review-task-round-2.md`, Opus (`docs/reviews/gm-judgment-review-2.md`: 1 Critical, 3 Major, 9 Minor) and Codex gpt-6-astra (`-2-astra.md`: 1 Major, 1 Minor), triaged in `REVIEW-FIX-PLAN-round-2.md`, decided as 9-36 to 9-41, applied through WP-S1 to WP-S6; round 3, the last, ran on `review-task-round-3.md`, Opus (`gm-judgment-review-3.md`: 0 Critical, 3 Major, 7 Minor) and Fable (`-3-fable.md`: 0 Critical, 0 Major, 8 Minor), both confirming every round 2 finding closed, triaged in `REVIEW-FIX-PLAN-round-3.md`, decided as 9-42 to 9-45, applied through WP-K1 to WP-K5. No Critical or Major finding is left open.
4. **This round's rows.** Add WP-K1 to WP-K5, each with its status as reported and its scope as section 3 gives, WP-K5's own row last, with the check results it ran.
5. **The process line.** In the paragraph at line 9, replace "and one GM judgment review (Opus and Codex gpt-6-astra) runs before the packet's Version 3 (WP-P3)." with "and the GM judgment review runs in up to three rounds (Opus, with Codex gpt-6-astra or Fable as the second reviewer), each round's findings triaged in a `REVIEW-FIX-PLAN-round-<n>.md` and applied by package, before the packet's Version 3 (WP-P3)."
6. **The chapter rows.** Append to each of the Chapter 1, 2, 4, 5, and 7 rows one clause in the rows' existing style, "GM judgment review round 3 fix package WP-K<n> applied: ..." naming the items applied to that chapter, as reported by WP-K1 to WP-K4.

## 4. Packet impact

Findings whose fix changes text the packet must carry. The packet is not edited by these packages; it takes the text at its next republish (WP-P3), as every item's own note says. Anchors and quoted phrases hold even where line numbers have moved.

- **9-42 (Opus M1; Fable m1, m2):** `#core-help`'s called-roll bullet and its requirements list, wherever the packet gives Help on a called roll "as the GM rules" (scope it to outside a Titan Engagement and a Skirmish, and name the Skirmish's Help); the Covering line that reads "on a called roll, as the GM rules"; `#actions-ruled`'s "Help as the GM rules" sentences; the glossary **Help**.
- **9-43 (Opus M2):** the Skirmish's *Engaged and Apart* line "no ODM move, no Fly roll, and no airborne soldier"; the Skirmish's *A called roll* paragraph, which gains the Fly sentence; the Fly entry's requirements line if the packet's Catalog carries it.
- **9-44 (Opus M3; Fable m6):** `#core-dice`'s menu, the **A fall** line, which gains the in-fight landing sentence; the Titan Engagement section's *A called roll* paragraph; the GM section's fall line if it carries the stakes.
- **9-45 item 1 (Opus m1):** the Titan Engagement and Skirmish *A called roll* paragraphs and `#core-dice`'s improvised-act text, which gain "on the soldier's turn" and the Reaction sentence.
- **9-45 item 2 (Opus m2; Fable m4, m5):** the Titan Engagement section's improvised acts text, wherever it carries the modelled Nape strike's Openings (the flag and Relentless's trigger).
- **9-45 item 3 (Fable m3):** the Skirmish's *A called roll* parenthetical, if carried.
- **9-45 item 5 (Opus m7):** `#core-dice`'s success list and the GM section's **Found supplies** line, which gain "never in a fight".
- **9-45 item 6 (Fable m7):** the Expedition section's Night Camp text, if it carries the Anchor Rating sentence of 9-40.

Not in the packet: 9-45 item 4 (a one-word change to a chapter paragraph the packet condenses), Opus m3 and Fable m8 (records), Opus m4 (ADR citations), and the YAML-only clauses.

## 5. Records applied by this decider

- `docs/rules/DECISIONS-2026-09-14.md`: items 9-42 to 9-45, their four summary-table rows, and the *Review round 3* paragraph under *Chapter impacts of batch 9*. Written under `docs/rules/.lock-DECISIONS-2026-09-14.md`.
- `docs/rules/OPEN-QUESTIONS.md`: OQ-181 (decided), with two readings the owner may veto. Written under `docs/rules/.lock-OPEN-QUESTIONS.md`.
- `docs/adr/0024-the-gm-rules-where-the-rules-are-silent.md`: limit 17's fall clause and a third `## Amended` paragraph (9-44).
- `docs/adr/0006-attributes-and-talents-no-skills.md`, `0010-teamwork-from-titan-attention.md`, `0013-shifters-use-intent-and-extraction.md`: the four operative ADR-0003 citations now cite ADR-0024 limits 9 and 12, 2, 8, and 8, with one sentence in each batch 9 paragraph recording the swap (Opus m4). A grep of `docs/adr/` for `ADR-0003` now finds only ADR-0003 itself, ADR-0024's supersession sentence, the historical mentions in ADR-0012 and ADR-0018, and these three recording sentences.

## 6. Escalations

None. No finding this decider settled reopens a tuned number, a closed value, a measured figure, or an owner answer. Two readings the owner has not seen are listed in OQ-181 as readings **the owner may veto**, in the batch's existing practice:

- **9-43** opens Fly to a called roll in a Skirmish and reads Chapter 7's "no Fly roll" as "no Fly roll a rule calls for". It follows owner answer 1 (rulings everywhere) and 9-24 (Fly keeps its Gear Dice), and Chapter 4's airborne, Gas Roll, and Jam rules already give every answer, so no procedure is added and no Skirmish figure moves; but the "no Fly roll" sentence was batch 7's and the owner may prefer the harness closed in a Skirmish.
- **9-45 item 5** closes found Squad Supply to a called roll in a fight. It touches no stock number and keeps 9-29 and 9-41 item 1 as written; the owner may prefer a mid-fight search to be allowed under those caps.

Opus M3's option 2 (no fall staked at On Body or Blind Spot) and Fable m7's alternative (the Expedition ends at the departure gate) were rejected for the reasons 9-44 and 9-45 item 6 give; neither needs the owner.
