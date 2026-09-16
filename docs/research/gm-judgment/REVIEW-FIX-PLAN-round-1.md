# GM judgment: review fix plan, round 1

Date: 2026-09-16. Decider: the rules decider for batch 9 (Opus). Inputs: `docs/reviews/gm-judgment-review-1.md` (Opus: C1, M1 to M8, m1 to m12) and `docs/reviews/gm-judgment-review-1-astra.md` (Astra: C1, C2, M1, M2, m1, m2), each finding verified against the chapters, `data/`, `CONTEXT.md`, and the ADRs; `OWNER-DECISIONS.md`; decision batch 9 (9-1 to 9-24 and the erratum under 9-14).

Rulings are recorded as **9-25 to 9-34** in `docs/rules/DECISIONS-2026-09-14.md`, with a second erratum under 9-14. ADR-0024 (limits 9, 14, 16, 17) and ADR-0005 carry the amendments. The register gains OQ-177 (Opus M4, open for the owner) and OQ-178 (this round's decisions, decided).

## 1. Counts

| Verdict | Finding ids | Problems |
|---|---|---|
| Rejected | none | 0 |
| Pure fix | Opus m1, m2, m3, m4, m6; Astra C2, m1, m2; plus the leftover ADR-0003 comments in `tools/probes/chapter-06` | 9 |
| Decided | Opus C1, M1, M2, M3, M5, M6, M7, M8, m5, m7, m8, m9, m10, m11, m12; Astra C1, M1, M2 | 16 (Opus M2 with Astra M1, and Opus M5 with Astra C1, are one problem each) |
| Pending owner | Opus M4 | 1 |

Every finding was verified as real. Nothing is escalated beyond M4: no ruling here changes a tuned number, a closed value, a measured figure, or an owner answer. The simulator is not rerun (9-17), and no YAML field these fixes edit is read by a `tools/sim/rules.py` guard.

## 2. Every finding

| Review | Id | Severity | Verdict | Decision item or fix | Files | Package |
|---|---|---|---|---|---|---|
| Opus | C1 | Critical | Decided | 9-25: a Reaction takes the step in force when the attacker's card comes up; no step named or changed after | `01` 1.4a, 1.9; `05` preface, 5.5; `07` 7.4; `circumstances.yaml`; `skirmish.yaml`; ADR-0024 limit 16 (applied) | R1, R4, R5 |
| Opus | M1 | Major | Decided | 9-29: a place yields Squad Supply to one called search; the others Help | `squad-supply.yaml`; `04` preface, 4.10 | R3 |
| Opus | M2 | Major | Decided (with Astra M1) | 9-28: Help's and a retry's cost is time or position only, named before the dice, falling when taken on | `01` 1.1 item 4, 1.8; `dice-pool.yaml`; `bonus-dice-sources.yaml`; `action-catalog.yaml` (nine rows); `CONTEXT.md`; ADR-0024 limit 17 (applied) | R1, R2, R6 |
| Opus | M3 | Major | Decided | 9-30: a fall a ruling names is low or high, never extreme | `01` 1.1; `dice-pool.yaml`; `falls.yaml`; `04` preface, 4.6; `03` 3.1; ADR-0005, ADR-0024 limit 17 (applied) | R1, R3 |
| Opus | M4 | Major | Pending owner | OQ-177; section 3 gives item 9-35 for each option | `03` 3.1; `health.yaml`; `01` 1.1; `dice-pool.yaml`; options (a) and (b) also `04` 4.6, `falls.yaml`, `CONTEXT.md`, ADR-0005 | M4 |
| Opus | M5 | Major | Decided (with Astra C1) | 9-27: in a fight the steps are not used; model entry is an `action` the soldier could take there; only a Nape strike taken as written kills; taking cover is a move | `01` 1.3, 1.9; `02` 2.9; `action-catalog.yaml`; `05` 5.4; `07` 7.4; ADR-0024 limit 9 (applied) | R1, R2, R4, R5 |
| Opus | M6 | Major | Decided | 9-26: one step per roll, weighed before the pool or the card, never added; "every ODM roll" is every roll whose Gear Dice come from ODM Gear | `01` 1.4a; `circumstances.yaml`; `05` preface, 5.5; ADR-0024 limit 16 (applied) | R1, R4 |
| Opus | M7 | Major | Decided | 9-31: success gives the act, information, a position, a non-gear object, or capped found supply; never a gear item, Stress relief, healing, a Commendation, a Research Point, or Faction Standing | `01` 1.1; `02` 2.9; `dice-pool.yaml`; `action-catalog.yaml`; `04` preface; `CONTEXT.md`; ADR-0024 limit 17 (applied) | R1, R2, R3, R6 |
| Opus | M8 | Major | Decided | 9-32: a passive roll is not a called roll, has no stakes; its row lists excluded sources in one field, plus `called_roll: false` and `stakes: none` | `01` 1.1 item 5; `dice-pool.yaml`; `CONTEXT.md` | R1, R6 |
| Opus | m1 | Minor | Pure fix | 4.1 | `01` 1.1 item 6 | R1 |
| Opus | m2 | Minor | Pure fix | 4.2; ADR-0024 limit 14 (applied) | `01` 1.1 item 5; `dice-pool.yaml` | R1 |
| Opus | m3 | Minor | Pure fix | 4.3 | `tools/render/render.py`; `01` 1.4a | R1 |
| Opus | m4 | Minor | Pure fix | 4.4 | `01` 1.3; `dice-pool.yaml` | R1 |
| Opus | m5 | Minor | Decided | 9-34 item 1: a shared act is one called roll with Help | `01` 1.1 item 1; `dice-pool.yaml` | R1 |
| Opus | m6 | Minor | Pure fix | 4.5 | `CONTEXT.md` | R6 |
| Opus | m7 | Minor | Decided | 9-34 item 2: "Hard" alone is the step; nothing renamed | `CONTEXT.md`; `01` 1.4a | R1, R6 |
| Opus | m8 | Minor | Decided | 9-34 item 3: the Straggler's Endure takes the step in force at the hazard roll | `hazards.yaml`; `07` 7.1 | R5 |
| Opus | m9 | Minor | Decided | 9-34 item 4: a directed Foe never leaves alone; the GM breaks the group sooner | `foes.yaml`; `07` 7.4 | R5 |
| Opus | m10 | Minor | Decided | 9-34 item 5 and erratum 2 under 9-14 (applied): one build for the Parley figures, 12%, 28%, 37%, and 2% | `07` 7.4 design note | R5 |
| Opus | m11 | Minor | Decided | 9-34 item 6: no `gm-horror` for an outcome a called roll's stakes named | `fear-rolls.yaml`; `03` 3.12 | R3 |
| Opus | m12 | Minor | Decided | 9-34 item 7: framed Background Titans none, one, or two, on clocks of 4, 6, or 8 | `engagement-setup.yaml`; `05` 5.1 | R4 |
| Astra | C1 | Critical | Decided (with Opus M5) | 9-27 | as Opus M5 | R1, R2, R4, R5 |
| Astra | C2 | Critical | Pure fix | 4.6 | `legs.yaml`; `07` 7.1; `squad-supply.yaml`; `04` 4.10 | R3, R5 |
| Astra | M1 | Major | Decided (with Opus M2) | 9-28 | as Opus M2 | R1, R2, R6 |
| Astra | M2 | Major | Decided | 9-33: the day's next Leg slot, or camp at the fallback Waypoint and ride it as the next day's first, at Steady | `legs.yaml`; `07` 7.1 | R5 |
| Astra | m1 | Minor | Pure fix | 4.7 | `titan-format.yaml`; `downtime.yaml` | R4, R5 |
| Astra | m2 | Minor | Pure fix | 4.8 | `07` 7.4 | R5 |
| Orchestrator | ADR-0003 comments | none | Pure fix | 4.9 | `tools/probes/chapter-06/run6.py`, `render.py` | R4 |

File shorthand: `01` to `07` are `docs/rules/0n-*.md`; YAML names are under `data/` as batch 9 gives them.

## 3. Pending owner: Opus M4 (OQ-177)

**The question.** Damage a ruling names (1 to 3, typed) that brings a soldier at 3 current Health or less to 0 makes them Down with a Critical Injury rolled at once, on the failed called roll itself. Is that within the owner's "never a direct Critical Injury" (answer 5)? The rules stand as written until the owner answers. Whichever option the owner picks, a decider records the matching text below as **9-35** in batch 9, marks OQ-177 decided, adds the ADR change it names, and WP-M4 applies it. Under each option the damage of a fall a ruling names is treated as that damage is; if the owner excludes falls, drop every clause marked *(falls)*.

### Option (a): damage a ruling names never takes Health below 1

- **Decision:** Damage a ruling names never takes a soldier's current Health below 1. It adds to Health lost only up to what leaves 1 current Health, so it never makes a soldier Down and never inflicts a Critical Injury; against a soldier at 1 current Health it does nothing. *(falls)* The damage of a fall a ruling names stops at 1 current Health in the same way.
- **Why:** The owner's "never a direct Critical Injury" is read as a failed called roll never producing one. 9-5's own reason for the ceiling of 3 ("a ruling that puts a Health 4 Rookie at 0 and rolls a Critical Injury is the musket's job") applies one box lower, at any current Health.
- **ADR change:** ADR-0005 `## Amended`: "After decision batch 9, item 9-35 (owner; OQ-177): damage a ruling names, including the damage of a fall a ruling names, never takes current Health below 1, so it inflicts no Critical Injury; the Health box paragraph's immediate Critical Injury applies to every other damage." ADR-0024 limit 17: append "Damage a ruling names never takes current Health below 1 (9-35)."
- **Chapter impact:**
  - `data/harm/health.yaml`, `harm_kinds`, `damage`: `by_ruling` gains `floor: 1   # decision batch 9, 9-35 (OQ-177): never takes current Health below 1, so it never makes a soldier Down or inflicts a Critical Injury`; `by_ruling.never` gains "taking current Health below 1"; the second `procedure` step gains the sentence "Damage a ruling names adds only up to what leaves 1 current Health (by_ruling, floor)."
  - *(falls)* `data/gear/falls.yaml`, `procedure`, the last step: append "The damage of a fall a ruling names never takes current Health below 1 (data/harm/health.yaml, harm_kinds, damage, by_ruling, floor)."
  - Chapter 3 section 3.1, *Harm a ruling names*, the damage bullet: replace "It follows *Losing Health* below, so it reaches a Critical Injury only at 0 current Health, as all harm that is not a Titan attack does, and that Critical Injury's Injury Location is rolled." with "It follows *Losing Health* below, but never takes current Health below 1: it stops at 1, so it never makes the soldier Down or inflicts a Critical Injury (decision batch 9, 9-35)." *(falls)* The fall bullet: append ", and its damage also stops at 1 current Health". *Losing Health*, step 2: append "Damage a ruling names adds only up to what leaves 1 current Health (*Harm a ruling names*)." The design note: replace "Damage stops at 3 because a ruling that takes a Health 4 Rookie to 0 and rolls a Critical Injury would do the musket's work without its roll." with "Damage stops at 3, and never takes current Health below 1, because a ruling that takes a soldier to 0 and rolls a Critical Injury would do the musket's work without its roll (OQ-177)."
  - *(falls)* Chapter 4 section 4.6, the **Named by a rule or a ruling** bullet: append "; the damage of a fall a ruling names never takes current Health below 1 (Chapter 3, section 3.1; decision batch 9, 9-35)".
  - Chapter 1 section 1.1, item 2, the menu: the damage bullet's "Never 4 or more." reads "Never 4 or more, and never taking current Health below 1 (decision batch 9, 9-35)."; *(falls)* the fall bullet gains ", whose damage never takes current Health below 1".
  - `data/core/dice-pool.yaml`, `called_roll.failure_menu`: `damage` appends "Never takes current Health below 1 (decision batch 9, 9-35)."; *(falls)* `fall` appends the same sentence.
  - `CONTEXT.md`, **Stakes**: "Never a direct Critical Injury." reads "Never a Critical Injury: harm a ruling names never takes current Health below 1."

### Option (b): damage a ruling names that brings Health to 0 gives no Critical Injury

- **Decision:** Damage a ruling names that brings current Health to 0 makes the soldier Down and inflicts no Critical Injury at once. This damage gives no Critical Injury, so it starts no Death Roll's time limit. Any later damage while the soldier is at 0 Health gives a Critical Injury as the damage procedure's last step gives. *(falls)* The damage of a fall a ruling names is treated the same way.
- **Why:** The failed roll puts the soldier Down, which is a real cost and opens care, but a Critical Injury comes only from a rolled attack or a rule's own harm, as the owner's answer reads.
- **ADR change:** ADR-0005 `## Amended`: "After decision batch 9, item 9-35 (owner; OQ-177): damage a ruling names, including the damage of a fall a ruling names, that brings current Health to 0 makes the soldier Down with no immediate Critical Injury; the Health box paragraph's 'Damage that brings current Health to 0 still inflicts one immediate Critical Injury' reads 'except damage a ruling names'." ADR-0024 limit 17: append "Damage a ruling names that brings Health to 0 gives no Critical Injury (9-35)."
- **Chapter impact:**
  - `data/harm/health.yaml`, `harm_kinds`, `damage`: `by_ruling` gains `at_zero: The soldier becomes Down and gains no Critical Injury from this damage (decision batch 9, 9-35; OQ-177).`; the third `procedure` step ("If that brings current Health to 0") appends "Damage a ruling names inflicts no Critical Injury here (by_ruling, at_zero)."
  - *(falls)* `data/gear/falls.yaml`, `procedure`, the last step: append "The damage of a fall a ruling names that brings current Health to 0 inflicts no Critical Injury (data/harm/health.yaml, harm_kinds, damage, by_ruling, at_zero)."
  - Chapter 3 section 3.1, *Harm a ruling names*, the damage bullet: replace "so it reaches a Critical Injury only at 0 current Health, as all harm that is not a Titan attack does, and that Critical Injury's Injury Location is rolled." with "except that when it brings current Health to 0 the soldier is Down and gains no Critical Injury from it (decision batch 9, 9-35)." *(falls)* The fall bullet: append ", whose damage at 0 Health gives no Critical Injury either". *Losing Health*, step 3: append "Damage a ruling names gives no Critical Injury here (*Harm a ruling names*)." The design note: replace "Damage stops at 3 because a ruling that takes a Health 4 Rookie to 0 and rolls a Critical Injury would do the musket's work without its roll." with "Damage stops at 3, and a ruling's damage at 0 Health gives no Critical Injury, because a ruling that rolls a Critical Injury would do the musket's work without its roll (OQ-177)."
  - *(falls)* Chapter 4 section 4.6, the **Named by a rule or a ruling** bullet: append "; the damage of a fall a ruling names that brings Health to 0 gives no Critical Injury (Chapter 3, section 3.1; decision batch 9, 9-35)".
  - Chapter 1 section 1.1, item 2, the menu: the damage bullet's "Never 4 or more." reads "Never 4 or more; if it brings Health to 0, the soldier is Down with no Critical Injury (decision batch 9, 9-35)."; *(falls)* the fall bullet gains the same clause.
  - `data/core/dice-pool.yaml`, `called_roll.failure_menu`: `damage` appends "If it brings current Health to 0, the soldier is Down with no Critical Injury (decision batch 9, 9-35)."; *(falls)* `fall` appends the same sentence.
  - `CONTEXT.md`, **Stakes**: "Never a direct Critical Injury." reads "Never a Critical Injury: harm a ruling names that brings Health to 0 makes a soldier Down with none."

### Option (c): keep the rule, and state Health with the stakes

- **Decision:** The rule stands: damage a ruling names that brings current Health to 0 makes the soldier Down with an immediate Critical Injury, as all damage does. When a called roll's stakes name damage or a fall, the GM states the soldier's current Health aloud with the stakes, so the table knows before the dice whether a failure can put the soldier Down. The playtest log (9-17) tags every Critical Injury that damage a ruling named caused. OQ-177 stays open as a playtest question, read at the retune.
- **Why:** The owner excluded a Critical Injury named as a stake, and this one comes through Health, as all human harm does (ADR-0005); the risk is shown before the dice, which is the batch's line.
- **ADR change:** none. ADR-0005's batch 9 review paragraph reads "decided (c), the Health box paragraph applies" in place of its OQ-177 sentence.
- **Chapter impact:**
  - Chapter 1 section 1.1, item 2: after the menu list and before "A stake is never" insert "When the stakes name damage or a fall, the GM states the soldier's current Health with them (decision batch 9, 9-35)."
  - `data/core/dice-pool.yaml`, `called_roll`: a new key after `failure_menu`: `harm_stakes: When the stakes name damage or a fall, the GM states the soldier's current Health with them (decision batch 9, 9-35; OQ-177).`
  - Chapter 3 section 3.1, *Harm a ruling names*: after "The harm is named with the stakes and does not change once the dice are rolled." insert "The GM states the soldier's current Health with it, so the table knows before the dice whether a failure can put the soldier Down with a Critical Injury (decision batch 9, 9-35)."
  - `data/harm/health.yaml`, `harm_kinds`, `damage`, `by_ruling`: gains `stated_with: the soldier's current Health, said aloud with the stakes (decision batch 9, 9-35; OQ-177)`.
  - No other file changes.

## 4. Pure fixes

Apply as written; no ruling is needed.

1. **Opus m1** (`01` 1.1 item 6): replace "the Leg roll, the hazard and Night tables and their modifiers" with "the Leg roll, except its Circumstances (section 1.4a), the hazard and Night tables and their modifiers".
2. **Opus m2** (`01` 1.1 item 5; `dice-pool.yaml`): in item 5 replace "The GM rolls out of sight only a **passive roll**:" with "The only soldier's roll the GM makes out of sight is a **passive roll**:". In `called_roll.secret` replace "is the only roll made out of sight." with "is the only soldier's roll made out of sight; the Next Behavior is the Titan's one hidden roll (Chapter 5)." ADR-0024 limit 14 is already edited.
3. **Opus m3** (`tools/render/render.py`; `01` 1.4a): add a `circumstances` block that renders `data/core/circumstances.yaml` `steps` as a two-column table, **Circumstances** and **Effect on the pool**, with the effects "+3 Bonus Dice", "+2 Bonus Dice", "+1 Bonus Die", "nothing", "a 1-die penalty", "a 2-die penalty", "a 3-die penalty" read from `dice` and `kind`. Place it in Chapter 1 section 1.4a directly after the first paragraph, between `<!-- BEGIN RENDERED: circumstances from data/core/circumstances.yaml -->` and `<!-- END RENDERED: circumstances -->`. Take `docs/rules/.lock-render.py` while editing `render.py`.
4. **Opus m4** (`01` 1.3; `dice-pool.yaml`): in step 1, *Rolls called for by attribute*, replace "a tool that is not a gear item counts toward its Circumstances (Chapter 4)." with "a gear item or other object that helps counts toward its Circumstances and gives no Gear Dice (Chapter 4, section 4.1; decision batch 9, 9-24)." In `components`, `gear`, `dice`, replace "where a tool that is not a gear item counts toward the Circumstances (decision batch 9, 9-16)" with "where a gear item or other object that helps counts toward the Circumstances and gives no Gear Dice (decision batch 9, 9-16 and 9-24)".
5. **Opus m6** (`CONTEXT.md`, **Titan Dice**): replace "takes no Bonus Dice, Help, Gear Dice, or Stress Dice." with "takes no Bonus Dice, Help, Gear Dice, Stress Dice, or Circumstances."
6. **Astra C2** (`legs.yaml`; `07` 7.1; `squad-supply.yaml`; `04` 4.10):
   - `data/expedition/legs.yaml`, `expedition.gear_back`: replace "What a Titan Engagement uses up stays used up until then." with "What a Titan Engagement uses up stays used up until then, except the Squad Supply a successful called search finds, as data/gear/squad-supply.yaml (spending) caps it."
   - Chapter 7 section 7.1, **Gas and gear.**: replace "stays used up until the next Depot or the next Expedition." with "stays used up until the next Depot or the next Expedition, except the Squad Supply a successful called search finds, as Chapter 4 caps it (section 4.10)."
   - `data/gear/squad-supply.yaml`, `kinds`, `shot`, `uses`: replace "No other rule spends shot." with "No other rule spends shot; a failed called roll whose stakes named 1 unit of shot spends it (spending)."
   - Chapter 4 section 4.10, the **Shot** bullet: replace "No other rule spends shot." with "No other rule spends shot, though a failed called roll's stakes may name 1 unit of it (below)."
7. **Astra m1** (`titan-format.yaml`; `downtime.yaml`): in `data/engagement/titan-format.yaml`, `titan_dice`, add `circumstances: never   # data/core/circumstances.yaml, never (decision batch 9, 9-2 and 9-4)` after `rolled`. In `data/campaign/downtime.yaml`, `rolls`, `infirmary-roll`, add `circumstances: never   # not an attribute roll (data/core/circumstances.yaml, never; decision batch 9, 9-2)` after `entry`. If the render check rejects the new key on the Downtime roll table, move the marker into the row's `entry` comment and report it.
8. **Astra m2** (`07` 7.4, *Damage*): replace "**Cut and Pierce,** which reach a soldier only in a Skirmish, carry riders" with "**Cut and Pierce,** which reach a soldier from a Foe's weapon in a Skirmish or as damage a called roll's stakes named (Chapter 3, section 3.1), carry riders".
9. **Leftover ADR-0003 comments** (`tools/probes/chapter-06/run6.py` line 97, `render.py` line 44): in both docstrings replace "ADR-0003 item 11, as amended in decision batch 7" with "ADR-0024, limit 11, as amended in decision batch 7". Then run `tools/probes/chapter-06/render.py check` and `run6.py check`.

## 5. Work packages

Each package owns its files alone, so R1 to R6 run in parallel (wof-drafter, one per package). Each applies the decision items' *Chapter impact* bullets for its files and the pure fixes listed. Re-rendering (Chapter 2 Appendix 2A, Chapter 7's roll tables, the new Chapter 1 ladder) writes through `tools/render/render.py`, so a package takes `docs/rules/.lock-render.py` (loop-wait if present, create it empty, delete when done) around any render write. No package edits `site/`, `tools/sim/`, or the packet.

| Package | Files it owns | Applies |
|---|---|---|
| **WP-R1** Chapter 1 and `data/core` | `docs/rules/01-core-rules.md`; `data/core/circumstances.yaml`, `dice-pool.yaml`, `bonus-dice-sources.yaml`; `tools/render/render.py` (under its lock) | 9-25, 9-26, 9-27, 9-28, 9-30, 9-31, 9-32 and 9-34 items 1 and 2, each for these files; pure fixes 1 to 4 |
| **WP-R2** Chapter 2 and the Catalog | `docs/rules/02-character-creation.md`; `data/character/action-catalog.yaml` | 9-27, 9-28 (the nine rows; re-render Appendix 2A), 9-31 |
| **WP-R3** Chapters 3 and 4, harm, mind, gear | `docs/rules/03-harm-and-mind.md`, `04-gear.md`; `data/mind/fear-rolls.yaml`; `data/gear/squad-supply.yaml`, `falls.yaml` | 9-29, 9-30, 9-31 (Chapter 4), 9-34 item 6; pure fix 6 (`squad-supply.yaml` and Chapter 4 parts) |
| **WP-R4** Chapter 5 and `data/engagement` | `docs/rules/05-titan-engagement.md`; `data/engagement/engagement-setup.yaml`, `titan-format.yaml`; `tools/probes/chapter-06/run6.py`, `render.py` | 9-25, 9-26, 9-27 (Chapter 5), 9-34 item 7; pure fixes 7 (`titan-format.yaml`) and 9 |
| **WP-R5** Chapter 7, Skirmish, Expedition, Downtime | `docs/rules/07-playtest-rules.md`; `data/skirmish/skirmish.yaml`, `foes.yaml`; `data/expedition/legs.yaml`, `hazards.yaml`; `data/campaign/downtime.yaml` | 9-25 (Chapter 7 and `skirmish.yaml`), 9-27 (Chapter 7), 9-33, 9-34 items 3, 4, 5; pure fixes 6 (`legs.yaml` and Chapter 7 parts), 7 (`downtime.yaml`), 8 |
| **WP-R6** the glossary | `CONTEXT.md` | 9-28, 9-31, 9-32, 9-34 item 2; pure fix 5 |
| **WP-M4** (blocked on the owner) | the files of the option chosen in section 3: `01`, `dice-pool.yaml`, `03`, `data/harm/health.yaml`, and for (a) or (b) `04`, `falls.yaml`, `CONTEXT.md` | 9-35 once recorded; starts after R1, R3, and R6 finish, or is folded into them if the owner answers before they start |
| **WP-P3** the packet | `docs/playtest/wings-of-freedom-playtest-packet.html` | the *Packet impact* list below, after R1 to R6 (and WP-M4 if answered) |

**Checks for every package:** `uv run --with pyyaml python tools/render/render.py check`; the YAML load command in `docs/playtest/HANDOFF.md`; the simulator's `tools.sim.rules.Rules()` smoke load, whose phrase guards must still pass (no fix here edits a guarded field; WP-R5 leaves `skirmish.yaml` `grit.breaks_when`, `grit.on_breaking`, `reactions`, and `foes.yaml` `foe_rule` untouched); for WP-R4 also `tools/probes/chapter-06/render.py check` and `run6.py check`; a grep of the package's files for em dashes, `PROVISIONAL`, and "ADR-0003" (none outside the ADR files, the decisions file, the register, and the research folder). Nobody runs `tools/sim/run.py`. After R1 to R6, round 2 of the review runs as `IMPLEMENTATION-PLAN.md` *Review* gives.

## 6. Packet impact

Findings whose fix changes text the packet Version 3 must carry. Line numbers are from the packet as read on 2026-09-16 and may have moved; the anchors and quoted phrases hold.

- **9-25 (Opus C1):** `#fight-circumstances` (a dodge takes the step in force when the Titan's card comes up); the Skirmish Reactions text and its roll table's Block or Dodge row; the Circumstances box (`#core-circumstances`), item on Reactions.
- **9-26 (Opus M6):** `#fight-circumstances`: "every ODM roll" reads as every roll with ODM Gear; the mired-Titan sentence gains "named when it is mired and before its card comes up", with the weighing clause; one step, never added, in the Circumstances box.
- **9-27 (Opus M5, Astra C1):** the turn bullet (about line 389); `#actions-ruled` *In a fight* (about 1204 to 1211: steps not used in a fight, the model entry definition, the one kill, taking cover); the shout example (about 1267) rewritten to Help; the Skirmish improvised act (about 3528); the GM section's improvised acts line (about 3928); the Titan Engagement section's improvised acts examples, if it carries them.
- **9-28 (Opus M2, Astra M1):** `#core-dice` *Trying again* (about 195); the Bonus Dice sources table's Help row (about 356); `#core-help` called-roll bullet (about 380); glossary **Help** (about 4509).
- **9-29 (Opus M1):** Squad Supply units paragraph (about 2383); GM section **Found supplies** (about 3921).
- **9-30 (Opus M3):** the fall named by a ruling (about 2156: low or high, never extreme); GM section menu **A fall** (about 3914).
- **9-31 (Opus M7):** `#core-dice` *Name the roll and the stakes first* (about 193); `#actions-ruled` stakes bullet (about 1201); GM section *Name the stakes* (about 3905) with the success list; glossary **Stakes** (about 4513).
- **9-32 (Opus M8):** `#core-dice` *Secret rolls* (about 196: not a called roll, no stakes); glossary **Called roll** (about 4511).
- **9-33 (Astra M2):** the Expedition section's Waypoint scene retreat line.
- **9-34 item 1 (m5):** `#core-dice` *Roll when it matters* (a shared act is one roll with Help).
- **9-34 item 2 (m7):** glossary **Circumstances** (about 4512).
- **9-34 item 3 (m8):** the Expedition roll table's Straggler row and the Circumstances line under it (about 3317 and 3319).
- **9-34 item 4 (m9):** the foe rule's *What a directed Foe still does* (about 3604).
- **9-34 item 6 (m11):** the Fear trigger line for `gm-horror` and the GM section's horror advice, if either carries the weight rule.
- **9-34 item 7 (m12):** the Titan Engagement section's framing line for Background Titans.
- **Pure fix 1 (Opus m1):** `#gm-stands`, if its list names the Leg roll.
- **Pure fix 2 (Opus m2):** `#core-dice` *Secret rolls* (about 196).
- **Pure fix 5 (Opus m6):** glossary **Titan Dice** (about 4542).
- **Pure fix 6 (Astra C2):** Squad Supply **Shot** (about 2381); Expedition **Gas and gear** (about 3164).
- **Pure fix 8 (Astra m2):** Skirmish damage **Cut and Pierce** (about 3553).
- **OQ-177 (Opus M4), once answered:** `#core-dice` stakes menu (about 193), the GM section menu's damage line, glossary **Stakes**, and the harm section's damage line.

Not in the packet: 9-34 item 5 (the Parley design note is not carried), pure fixes 3, 4, 7, and 9.

## 7. Records applied by this decider

- `docs/rules/DECISIONS-2026-09-14.md`: 9-25 to 9-34, the summary table rows, the batch intro sentence, erratum 2 under 9-14, and the *Review round 1* paragraph under *Chapter impacts of batch 9*.
- ADR-0024: limits 9, 14, 16, and 17 edited in the list, with a `## Amended` paragraph.
- ADR-0005: a `## Amended` paragraph for 9-30 and the OQ-177 pointer.
- `docs/rules/OPEN-QUESTIONS.md`: OQ-177 (open, owner) and OQ-178 (decided), written under the register lock.

## 8. Escalations

Only Opus M4 (section 3). No other finding reopens a tuned number, a closed value, or an owner answer: Opus M6's option 2 (steps that add) would have changed 9-2 and was not taken, and every other ruling applies batch 9's own limits.
