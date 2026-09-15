# Review: The Rules of Play (rules accuracy)

Checked every claim in `site/design/claims/rules-of-play.md` against `docs/rules/01-core-rules.md` lines 27-314, `data/core/dice-pool.yaml`, `data/core/stress-changes.yaml`, `data/core/bonus-dice-sources.yaml`, and the cited rows in `data/harm/down.yaml`, `data/engagement/grab.yaml`, `data/character/action-catalog.yaml`, `data/character/talents.yaml`, `data/gear/items.yaml`, and `CONTEXT.md`. Page content covered: `rules-of-play.mdx`, `DiceKey`, `PoolBuild`, `PushSteps`, `StepFlow` (Fig. 3 steps), the three `CoreTable` wording maps in `lib/core-tables.ts`, and the glossary entries the page links.

All numbers, conditions, exceptions, and orderings match. The four worked examples (Liesel, Greta, Emil, Mila) add up and follow the procedures. The three rendered tables reproduce every YAML row with the right amounts, targets, and spends. No rule on the page contradicts or quietly changes its source, and nothing in the claims list is missing from the page.

1. **Minor.** `PushSteps.astro` line 23, step 2 ("A comrade nearby may Cover you"). Source: C 128-129. "Nearby" is only the Titan Engagement condition (same Position or one step); outside one, Covering depends on Help eligibility under the calling rule, not distance. Fix: change "nearby" to "who could Help you", or drop the word and let the Covering section carry the requirement.
