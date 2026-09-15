# Rewrite issues

Disagreements and unclear rules found while rewriting pages. The page follows the tables where they disagree with chapter prose; nothing in `docs/rules/` or `data/` was edited.

## The Rules of Play (`site/src/content/rules/rules-of-play.mdx`)

1. **Who cannot be Helped.** `docs/rules/01-core-rules.md` 201 names only the Death Roll's exception row as excluding Help. `data/core/bonus-dice-sources.yaml` (help, `applies_to`) and `data/core/dice-pool.yaml` (performance-roll, `bonus_sources_excluded`) also exclude Help from the performance roll. Page follows the tables: Help requirements and the Bonus Dice table name both rolls.
2. **Stress triggers beyond the chapter.** `01-core-rules.md` 155-173 lists the core triggers, defers Chapter 7 amounts, and omits two rows. `data/core/stress-changes.yaml` gives the amounts (camp relief 1, Skirmish end 1, Downtime 2) and adds `graduation-exam-ends` (all Stress) and Fear contagion under `named-gain`. Page renders the table, so all of these appear.
3. **Unclear: a Push that "would re-roll no die".** `01-core-rules.md` 131 and `stress-changes.yaml` (cover, `condition`) say such a Push cannot be Covered. An uncovered Push always adds and rolls a new Stress Die (94), so the test only works if it means "no existing base die or Stress Die would be rolled again". Page keeps the source wording ("because every base die and Stress Die already shows 6").
4. **Voice guide conflict.** `site/design/voice-guide.md` asks for "Field report" callouts but bans the word "field". Page text avoids "field": examples use the report component with the default "Example" eyebrow, and quotes cite "Survey Corps manual".
5. **DiceKey retypes a table.** `site/src/components/DiceKey.astro` hardcodes the die-type rows instead of rendering `dice-pool.yaml` `die_types`. The wording agrees with the table today. It also labels Titan Dice "Titan Attack Dice", which `CONTEXT.md` does not use as a term. Not changed in this rewrite.
6. **Glossary pop-up uses an avoid word.** The existing `Titan` entry in `site/src/lib/glossary.ts` calls a Titan "a mindless giant"; `CONTEXT.md` lists "giant" under Avoid. This page does not attach a pop-up to "Titan" for that reason. Not changed in this rewrite.
