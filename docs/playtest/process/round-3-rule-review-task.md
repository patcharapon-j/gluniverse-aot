# Review task: round 3 rule change, review round 1

Review the round 3 rule change of "Wings of Freedom", a private Attack on Titan tabletop RPG on the
Year Zero Engine. This is a **rule change review**, not a chapter review and not a packet review. The
thing under review is decision batch 13 (OQ-190 to OQ-194) as it now stands in the tree.

## What changed

Run `git diff 68aa864..HEAD -- docs/rules data` to see the change. Four rules:

1. **Health** is now `2 + (strength + agility) / 2`, rounded up (was `(strength + agility) / 2`
   rounded up). An untreated Critical Injury still crosses off exactly one box. No damage value
   changed anywhere.
2. **Position clarity.** A closed 14-row list of what changes a Position, headed by the principle
   that an action never changes a Position; Blind Spot described everywhere as anchored to terrain
   *behind* the Titan and never on the Titan; a sentence on the Nape strike; three diagrams of the
   Position map, one per shape of Anchor Rating.
3. **Retargeting.** A Titan whose Attention holder cannot meet a rolled Behavior Table entry's
   Position requirement re-runs the Attention Ladder over the soldiers who *can* meet it, and its
   Attention moves to the new target, instead of the behavior falling to Thrash.
4. **Frenzy.** Each Focus Titan starts at 0, rises by 1 at a new round-end step to a cap of 3, and
   adds it to its behavior roll, counted as of the moment the Next Behavior is rolled.

## Sources of truth, in this order

- `docs/playtest/feedback/round-3/OWNER-DECISIONS.md` is settled. **Do not reopen a decision recorded
  there.** Disagreeing with a settled decision is not a finding; a decision applied incorrectly,
  incompletely, or inconsistently across surfaces is.
- `docs/playtest/feedback/round-3/ASSESSMENT.md` holds the analysis behind each decision.
- `CONTEXT.md` (glossary and terms), the ADRs in `docs/adr/`, the six chapters in `docs/rules/`, and
  the YAML in `data/`. ADR-0014 governs the odds, ADR-0024 the limits of GM judgment.
- `docs/rules/DECISIONS-2026-09-14.md` batch 13 is the change list as recorded.

## Check, most important first

1. **Retargeting and Frenzy are genuinely new Titan rules. Attack them hardest.** Walk them at the
   table. Is the retarget loop terminating in every case, including when nobody qualifies, when the
   only qualifying soldier is Down or dead, when the Titan is Hooked In, and when two soldiers tie on
   the Attention Ladder? Is the order of the Ladder's tie breaks still defined after a re-run? Does
   Attention moving mid-behavior break Break Attention, the Feint, Draw Attention, Openings, or the
   retreat triggers? Is Frenzy's timing unambiguous against every other round-end step, does the
   clamp to the table's highest claimed result leave any row unreachable or any row newly
   unreachable, does Frenzy reset, and what happens to it when the Titan's Attention moves or the
   Titan leaves and re-enters the engagement?
2. **Health.** Every place a Health value, a Health-derived number, a Health box count, or a "Health
   is" formula appears in `docs/rules/`, `data/`, and the reference builds. Untreated Critical
   Injuries against an 8-box track. Anything that assumed the old range.
3. **Consistency across surfaces.** Chapter prose against its YAML, and the YAML against the rendered
   blocks. Where prose and YAML differ, the YAML wins and the chapter is the bug.
4. **The closed Position list.** Is it actually closed: does any other rule in any chapter change a
   Position by a route the list does not name? Does "an action never changes a Position" hold against
   every action in `data/character/action-catalog.yaml`?
5. **Blind Spot as terrain behind the Titan.** Consistent everywhere, and consistent with the
   Anchor Rating rules and the three Position maps.
6. ADR contradictions, glossary misuse (including `_Avoid_` terms), undefined edge cases, ordering
   problems, incomplete or unrollable tables.
7. Attack on Titan (845 to 850) fidelity and Year Zero Engine fit.

When odds matter, run a small Python dice simulation in a temporary directory and quote the numbers.
**Do not run `tools/sim/`** and do not read `docs/reviews/simulator-*` files: the simulator has not
yet been taught either new rule, and every tuned figure in the tree is marked stale until it is.

## Prior reviews

None. This is review round 1 for this change. Up to three rounds are available.

## Severity

- **Critical**: a rule that contradicts another rule or an ADR, a loop or an ordering that does not
  terminate or has no defined answer in play, or a number that is wrong.
- **Major**: a dropped condition or exception likely to matter in play, an inconsistency between a
  chapter and its YAML, or a decision applied to one surface and not another.
- **Minor**: wording, a single term, a small presentation problem.

## Output

Write the review to `docs/reviews/round-3-rule-change-review-1.md`. Rank findings most severe first.
Each finding: severity, location (file and line), the problem, a concrete play scenario, and 1 to 3
fix options. Do not edit any project file except your review.
