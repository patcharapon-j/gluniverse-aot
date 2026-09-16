# Wings of Freedom website: voice and rewrite guide

Every rewrite agent reads this before touching a page. The site is the finished game, written for players and GMs who have never seen the design documents.

## Voice

- A published tabletop RPG, confident and plain. Players are "you"; the Game Master is "the GM".
- Concise and to the point. Say each rule once, in the place a reader looks for it. Cut restatement, hedging, and cross-reference chains. A player page should land well under the source's length without losing a rule.
- Lead with what the rule is for in one sentence, then how it works.
- Procedures are numbered steps. Triggers are bold ("**When a Stress Die shows a 1**, ..."). Lists over paragraphs when the content is a list.
- Game terms are capitalised exactly as `CONTEXT.md` names them, and its "Avoid" words are never used.
- Every page opens with a one or two sentence in-world passage: a line from the Survey Corps field manual, a field order, a recruit's diary, an instructor's saying. Original voices only, no canon characters quoted or named.
- Examples of play are short "Field report" callouts (margin or inline), with an original soldier and concrete dice.
- No em dashes. Use periods, commas, or colons.

## Never on the page

ADR, OQ, YAML, data, schema, "field" in the data sense (a record field; in-world uses like "Field report" and "in the field" are fine), row id, probe, simulator, Monte Carlo, simulation percentages, playtest, provisional, flag, decision batch, catalog id (note: "flag" is banned only in the data sense, as a stored marker; a signal flag a soldier raises is fine), "Who uses these rules", "tracked value", "dormant", "reserved", internal ids like `nape-strike` or `roll_exceptions`, chapter and section numbers of the design drafts ("Chapter 4, section 4.3"). Link to the site page instead.

## Rules fidelity

- Every number, condition, limit, exception, and ordering in the source survives. Concise means fewer words, never fewer rules.
- Where chapter prose and the `data/` tables disagree, the tables win. Log the disagreement in `site/design/rewrite-issues.md` (page, source lines, what differs); do not edit `docs/rules/` or `data/`.
- Tables are never retyped. Pages render them from `data/` through the site's components.
- If a rule is unclear or seems to contradict another page, keep the source wording's meaning, and log it in `rewrite-issues.md`.
- Update each page's `sources` frontmatter (path and current git blob sha) when done.

## Teaching tools (use them, do not dump text)

- **Diagram** any procedure with steps, branches, or a loop (Push, a Titan round, the Grab countdown, Positions).
- **Try this roll** on every example that rolls dice.
- **Glossary pop-ups** on the first use of a game term on each page.
- **Margin notes** for cross-references, reminders, and quick "why this matters" lines.
- **Icons** from the site set for dice kinds, tiers, gear, and Titan sizes.
- **Plates and ink vignettes** placed where the page turns to a new scene of play; placeholders until art lands.

## Handoff for review (keeps reviews cheap)

For each finished page write `site/design/claims/<page-slug>.md`: a flat list of every rule the page states (numbers, conditions, exceptions, order), each with the source file and line range it came from. The reviewer checks that list and the page against those lines only. Keep it terse.
