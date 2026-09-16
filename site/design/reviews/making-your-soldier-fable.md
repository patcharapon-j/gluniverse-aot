# Review: Making Your Soldier (rules accuracy)

Checked every claim in `site/design/claims/making-your-soldier.md` against the committed (`HEAD`) line ranges of `docs/rules/02-character-creation.md` and `data/character/*.yaml`, and every rendered table's wording map in `site/src/lib/character-tables.ts` against its YAML rows. Both worked examples recompute correctly (Mira: rolls, rows, Merit 5, Class Rank 25, 18 points, 5 levels, Health 4, Resolve 3, Nape strike 7; Tomas: 18 points, two 4s, 5 levels, Health 4, Resolve 3, Nape strike 6; Anka: order, fixed Help, Cover eligibility). The two ratios ("about three times", "about four times") match the source figures (0.057/0.022 and 0.187/0.058; 0.076/0.018).

No Critical or Major findings.

## Minor

1. **Minor.** Section 7, "Which rules apply" table, row "XP and new Talent levels": the Applies cell reads "None given". Source `data/character/squadmates.yaml` line 65 has `applies: set by the XP rules (not yet written)`, which defers the rule rather than answering it. Fix: change `applies: 'None given'` in `SQUADMATE_RULE_WORDING` (character-tables.ts line 484) to "Set by the XP rules, not yet written".

2. **Minor.** Section 6, Fig. 3 step 2 ("Moves") says the action is a move if the value is changing Position "or becoming Engaged with or Apart from a Foe in a Skirmish". The chapter prose (C 601) says this, but the governing YAML step (`uncatalogued_actions.steps.moves`, action-catalog.yaml line 939) names only `position-change`. Fix: either drop the Engaged/Apart clause to match the YAML, or have the drafters add it to the YAML step so the page and data agree.
