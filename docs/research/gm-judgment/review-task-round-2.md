Review the GM judgment change to Wings of Freedom, review round 2: the rulebook Chapters 1 to 7, their YAML, and the records that govern them. Two reviewers run in parallel: wof-reviewer on Opus and Codex CLI gpt-6-astra. Each writes only its own file. The playtest packet is being edited in parallel and is not in scope this round.

## What this round covers
Round 1 raised 27 findings across two reviews. All were triaged: none rejected, 8 applied as pure fixes, 18 decided as rulings (items 9-25 to 9-34), and one put to the owner and decided as item 9-35. Six fix packages then applied them.

- **Round 1 reviews:** `docs/reviews/gm-judgment-review-1.md` (Opus: C1, M1 to M8, m1 to m12) and `docs/reviews/gm-judgment-review-1-astra.md` (Codex: C1, C2, M1, M2, m1, m2). Read both.
- **The triage and fix plan:** `docs/research/gm-judgment/REVIEW-FIX-PLAN-round-1.md`, which maps every finding to its verdict, decision item, and files.
- **The rulings:** decision batch 9 in `docs/rules/DECISIONS-2026-09-14.md`, items 9-1 to 9-35 and the two errata under 9-14.
- **The records:** ADR-0024 (superseding ADR-0003) and the amendments to ADR-0005, 0006, 0009, 0010, 0012, 0013, 0014, 0016, 0018; `CONTEXT.md`; `docs/rules/OPEN-QUESTIONS.md` OQ-167 to OQ-178.
- **Owner intent, which governs:** `docs/research/gm-judgment/OWNER-DECISIONS.md`, plus the owner's 2026-09-16 answer on OQ-177 recorded in 9-35 (the rule stands: damage a ruling names that empties Health leaves the soldier Down with the Critical Injury damage always causes, and the GM states the soldier's current Health aloud with the stakes).

## Your job, most important first
1. **Confirm each round 1 finding is resolved** by the rule as it now reads, or that the recorded decision deliberately left it, and that no fix introduced a new error. Give a table of the 27 findings with Resolved, Still open, or Changed for the worse.
2. **Check the round 1 fixes for gaps they opened.** In particular: the Reaction timing rule against every place a Reaction is rolled (Chapter 5 section 5.5, Chapter 7 section 7.4, Chapter 1 section 1.9); one step per roll against lasting conditions and framing; the model entry rule against every kind of Catalog entry; Help and retry costs against the Stress, damage and fall routes; capped finds against Expedition supply and Standard Issue; what success may give against Requisition, Standard Issue and the tables under ADR-0024 limits 5 and 6; passive rolls against secret rolls and the Next Behavior.
3. **Walk the whole change fresh for anything both round 1 reviews missed**, especially: the interaction of Circumstances with Talents, Openings, Cover, Push and Stress Dice; a Skirmish end to end with a directed Foe, a Parley and a Stand down; an Expedition day with a Waypoint scene, a retreat after the last Leg, a Night Camp and Downtime; and harm a ruling names under 9-35 at every Health total.
4. **Records and hygiene:** every decision item 9-25 to 9-35 is reflected in the rules exactly as written; no live "ADR-0003" citation; no `PROVISIONAL:` marker from batch 9 work; no em dashes; "difficulty" only in the glossary's Avoid lines; glossary terms used exactly; the render check and YAML load pass; the simulator's phrase guards in `tools/sim/rules.py` still match the chapters.

Sources of truth: `data/` YAML first, then the chapters, `CONTEXT.md`, the ADRs, the decisions. Where a chapter and its YAML differ, the chapter is wrong. ADR-0003 is superseded: a rule that gives the GM judgment ADR-0024 opens is correct, not a finding. Do not run `tools/sim/run.py`; batch 9 changes no closed number. Do not review `site/` or the packet.

## Severity for this review
This overrides any other guide.
- **Critical:** rule text that lets the GM change a result after the roll, a table row, a card, a need, or a Titan's or Foe's dice; a round 1 Critical still open; a contradiction with ADR-0024, the glossary, or an owner decision that is not logged as an open question; or a rules bug that breaks play.
- **Major:** a round 1 Major still open or reopened elsewhere; a decision item applied differently from how it reads; a chapter and YAML mismatch likely to matter at the table; an undefined edge case likely in normal play.
- **Minor:** wording, a single term, or a small gap.

## Output
Give the counts, then the round 1 findings table, then new findings grouped by file with exact locations, then a short prioritised fix list.
