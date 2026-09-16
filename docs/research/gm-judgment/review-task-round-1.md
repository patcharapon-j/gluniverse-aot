Review the GM judgment change to Wings of Freedom, review round 1: the rulebook Chapters 1 to 7, their YAML, and the records that govern them. Two reviewers run in parallel: wof-reviewer on Opus and Codex CLI gpt-6-astra. Each writes only its own file. The playtest packet is not in scope this round.

## What changed
- **The owner's direction** (2026-09-16), which governs intent: `docs/research/gm-judgment/OWNER-DECISIONS.md`. GM judgment is now valid. The GM calls rolls, names stakes, and sets Circumstances (a dice ladder, Effortless +3 to Desperate -3), including on the soldiers' own rolls inside a Titan Engagement. Results still stand.
- **Decision batch 9** in `docs/rules/DECISIONS-2026-09-14.md`: items 9-1 to 9-24 and the erratum under 9-14.
- **ADR-0024** (new, seventeen limits) superseding ADR-0003; amendments to ADR-0005, 0006, 0009, 0010, 0012, 0013, 0014, 0016, and 0018.
- **`CONTEXT.md`:** Called roll, Stakes, Ruling, Circumstances; revised Action Catalog, Help, Bonus Dice, Fear Roll, Foe, Grit, Parley.
- **`docs/rules/OPEN-QUESTIONS.md`:** OQ-167 to OQ-176 and the revised lines on OQ-27, OQ-35, OQ-141, OQ-155, OQ-164.
- **The packages** in `docs/research/gm-judgment/IMPLEMENTATION-PLAN.md`: WP-G0 to WP-G5, including `data/core/circumstances.yaml` (new), the `parley` value on every Foe kind, the nine `rolled: when_called` Catalog rows, and the `ROLLED` and Foes-table edits in `tools/render/render.py`.
- Background research, not binding: `ripple-audit.md` and `difficulty-mechanics.md` in the same folder.

## Sources of truth
- `data/` YAML first, then the chapters in `docs/rules/01` to `07`, `CONTEXT.md`, the ADRs, and the decisions. Where a chapter and its YAML differ, the chapter is wrong.
- ADR-0003 is superseded. A rule that gives the GM judgment ADR-0024 opens is correct, not a finding.
- Do not run `tools/sim/run.py`. Batch 9 changes no closed number (9-17); a simulator rerun is not expected. Do not review `site/`.

## Check, most important first
1. **The line between open and closed.** For every Rulings paragraph and every `gm:` or `gm_choices:` field, the text matches the 9-11 table and ADR-0024's limits: what the GM rules, then what the GM applies as written. Nothing lets a ruling change a result after the roll, a table row, a need, a Behavior card, Attention, the Reaction procedure, a Grab, Titan Dice, or Foe dice. Nothing still says "No rulings" where 9-11 opens judgment.
2. **Circumstances end to end** against 9-2 and 9-21: one step per roll; plus steps are a Bonus Dice source under the cap of 4; minus steps come off after the cap, base dice only, floor of 1 base die, never Gear or Stress Dice; the `never` list in `circumstances.yaml` matches a `circumstances: never` on each excluded roll; the passive roll; Help on a called roll; no Talent changes a step. Walk three pools: a Rookie with Easy and Help at the cap, a veteran at Desperate with Gear Dice, and a dodge in rain inside a Titan Engagement.
3. **Chapter 1 section 1.1 and 1.4a** read as complete rules a GM can use: when to roll, stakes before the dice, the failure menu (never a direct Critical Injury), retries only when something changes, secret rolls only for passive noticing.
4. **Needs come only from the fiction.** Every existing needs rule (Nape Depth, Toughness, Grit, Watch, Scarcity and the ledger, Break Free, Leg and camp rolls, the Parley) is unchanged by Circumstances, and the Parley reads the `parley` value (trooper 2) with the 9-14 erratum (Stand down needs 5) and 9-22.
5. **Titan Engagement scope** (9-4): Standard by default; framing (which Titan, Anchor Rating, Background Titans) with the setup table as default; improvised acts copy one model entry's effect and never kill; ADR-0014 figures stated as measured at Standard with no rulings.
6. **Harm, Fear, gear, supply** (9-5, 9-6, 9-16, 9-24): harm a ruling names (1 to 3 typed, or a fall with its band); the `gm-horror` trigger outside Titan Engagements with once per scene as advice only; improvised objects give Circumstances, never Gear Dice; a helpful item on an Attribute-only called roll counts as Circumstances and cannot wear; found supplies capped.
7. **Foes and Chapter 7** (9-7, 9-15, 9-22, 9-23): the foe rule as default, direction with a reason said aloud, Grit as the latest break; Waypoint scenes and a retreat begun in one; the GM's added Requisition rows with their limits and Playtest rule tag.
8. **Consistency and hygiene:** glossary terms used exactly and their Avoid words absent ("difficulty" appears only in the owner's quoted words); no "ADR-0003" citation in a live rule (only in `docs/adr/`, DECISIONS, OPEN-QUESTIONS, `docs/research/`); no leftover `PROVISIONAL:` from batch 9 work; no em dashes; the render check and YAML load pass; the simulator's phrase guards in `tools/sim/rules.py` still match the chapters.
9. **Edge cases likely at the table** that batch 9 leaves undefined.

## Severity for this review
This overrides any other guide.
- **Critical:** rule text that lets the GM change a result after the roll, a table row, a card, a need, or a Titan's or Foe's dice; text that leaves "no rulings" in force where 9-11 opens judgment; a contradiction with ADR-0024, the glossary, or an owner decision not logged as an open question; or a rules bug that breaks play.
- **Major:** a Rulings paragraph or `gm:` field that contradicts the 9-11 table; a ladder rule that differs from 9-2 or 9-21; a citation of ADR-0003 in a live rule; a chapter and YAML mismatch likely to matter at the table; an undefined edge case likely in normal play.
- **Minor:** wording, a single term, or a small gap.

## Output
Give the counts, then findings grouped by file with exact locations, then a short prioritised fix list.
