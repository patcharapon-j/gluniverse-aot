# Review: Making Your Soldier, resync (Fable)

Scope: rules accuracy of `site/src/content/rules/making-your-soldier.mdx` and `site/src/lib/character-tables.ts` against `site/design/claims/making-your-soldier.md`, the cited lines of `docs/rules/02-character-creation.md`, and the cited rows of `data/character/*.yaml` and `data/core/circumstances.yaml`. The called-roll, improvised-act, Drive, Exam (Circumstances never), Graduation, build, and all four worked examples check out against their sources; every rendered table wording map reproduces its rows.

## Findings

1. **Minor.** Page, "Titan and Skirmish entries", Fly bullet (mdx line 562) and the nine-entries bullet (line 577). The claim "Fly outside a Titan Engagement needs 1" (claims line 126; `action-catalog.yaml` 665-667, C 590) is not on the page; only a called roll's "needs 1 success" (line 643) is, which leaves a rule-called Fly outside a Titan Engagement without a stated needs. Fix: add "Outside a Titan Engagement, Fly needs 1 success" to the Fly bullet.

2. **Minor.** Page, "Squadmates > Actions" (mdx line 724): "it makes any roll a rule or the GM calls for". `squadmates.yaml` 79 (`rolls`) and C 716 say only "a rule calls for"; the GM case is inferred from the Squadmate using section 2.9 as a player character does (`squadmates.yaml` 80-82). Fix: either drop "or the GM" or keep it and cite the outside-the-Catalog rule as its ground.

3. **Minor.** `character-tables.ts` 484, `SQUADMATE_RULE_WORDING["XP and gaining Talents"].note`: "Advancement rules are not covered yet." `squadmates.yaml` 65 reads "No current rule gives a Squadmate XP or Talent levels", which is the operative rule (claims line 149: "no XP or Talent levels"). Fix: change the note to "No current rule gives a Squadmate XP or Talent levels."

No Critical or Major findings.
