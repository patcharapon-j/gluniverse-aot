# Wings of Freedom, Chapters 1 to 6: final full review, round 3 (verification, Fable)

**Scope.** The Phase 1 rulebook after decision batch 5b (5-15 to 5-18): `docs/rules/01-core-rules.md` to `06-standard-titans.md`, every YAML file the batch 5b fixes touched (`background-titans.yaml`, `attention.yaml`, `squad-tactics.yaml`, `titan-harm.yaml`, `engagement-setup.yaml`, `engagement-flow.yaml`, `tuning.yaml`, `treat-injury.yaml`, `healing.yaml`, `field-repair.yaml`, `carrying.yaml`, `standard-issue.yaml`, `action-catalog.yaml`), `anchor-ratings.yaml` in full, `CONTEXT.md`, ADR-0001 to ADR-0015, `DECISIONS-2026-09-14.md` batch 5 (5-1 to 5-18), OQ-129 to OQ-131 and the `Revised by batch 5b` lines on OQ-87, OQ-119, and OQ-120, and both round 2 reviews. Per the brief, scope is the round 2 findings and what their fixes touched; other findings are reported only at Critical or Major. The simulator's full rerun was in progress and was not read. One small simulation of my own, in the scratchpad (`fable_r3/repair.py`), is quoted in the interim-day walk.

**Checks run.** `uv run --with pyyaml python tools/render/render.py check`: every rendered block matches the YAML (32 blocks in 4 chapters). `tools/probes/chapter-06/render.py check`: passes. `grep -rni provisional docs/rules/0*.md data/`: no marker remains in any chapter or data file. `grep -rn "In Reach before|before acting" docs/rules/0*.md data/ CONTEXT.md`: no stale copy of the superseded ADR-0010 batch 5 sentence outside the ADR's own history paragraph.

## Verdict

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| 1 Core Rules | 0 | 0 | 0 |
| 2 Character Creation | 0 | 0 | 0 |
| 3 Harm and Mind | 0 | 0 | 0 |
| 4 Gear | 0 | 0 | 0 |
| 5 Titan Engagement | 0 | 1 | 0 |
| 6 Standard Titans | 0 | 0 | 0 |
| **Total** | **0** | **1** | **0** |

Every round 2 Critical and Major is Resolved in the chapters and in the strike's own data rows, and every Minor is Resolved (section 5). The one Major is a leftover of the 5-15 apply: the retreat's `actions` row in `background-titans.yaml`, the row the decision named as the rule's carrier and the row every pointer cites, was not edited and still says actions are not limited. The rule is nonetheless in data at the Nape strike's requirement rows, so play resolves one way; the fix is one sentence. Nothing else found at Critical or Major. Minor-level observations were not collected this round, as the brief asked.

## Findings, most severe first

### Major 1. `background-titans.yaml` `retreat.effects.actions` still reads "Actions are not limited by the retreat", and it is the row every Nape strike ban pointer cites

**Location.** `data/engagement/background-titans.yaml`, `retreat.effects`, `- id: actions` (line 124: "Actions are not limited by the retreat, only ordered after the forced move (order)."). Cited as the source of the ban by: Chapter 5 section 5.10 *Actions are not limited* ("`actions`; decision batch 5, 5-15, OQ-129"); section 5.7 *Nape strikes* ("no retreat under way (section 5.10; ...)"); `data/engagement/titan-harm.yaml` `nape_strikes.requirements` ("No retreat is under way (data/engagement/background-titans.yaml, retreat, actions ...)"); `data/character/action-catalog.yaml` `nape-strike.requirements` (same pointer) and its rendered copy in Chapter 2, Appendix 2A.4, line 847; `data/engagement/squad-tactics.yaml` `hook-and-cut.condition` (same pointer); `data/engagement/attention.yaml` `break_attention.decoys.feint.repeatable` (same pointer); OQ-129's Decision line ("`background-titans.yaml` `retreat.effects.actions` ... carry it"); decision 5-15's own text ("`retreat.effects.actions` reads 'Actions are not limited by the retreat, only ordered after the forced move, except that no Nape strike is made during a retreat'"); ADR-0010 batch 5b paragraph.

**Problem.** Decision 5-15 made the ban a rule of the retreat itself and placed it in the retreat's `actions` row. The file's header comment and its `decided` list record OQ-129, and the chapter prose, the Feint row, Hook and Cut's condition, and the Nape strike's requirement rows all state the ban and point at `retreat, actions` as its source. The row they point at was not changed: read alone it says the opposite of the ADR-0010 batch 5b sentence "no Nape strike is made during a retreat". Under ADR-0012 the YAML is the only source of truth and the reason for that rule is that the rulebook and the Foundry import cannot drift; here two data rows disagree (`retreat.effects.actions` against `nape_strikes.requirements` and the Catalog's `nape-strike`), and the general row is the one the specific rows cite as their authority. A strict reading of the brief's Critical clause (an unlogged contradiction with an ADR) fits the row's text; I rate it Major because the specific requirement rows carry the ban in data, so no situation at the table is unresolvable and the ADR's rule is expressed as data, and because the fix is the one sentence the decision already wrote.

**Scenario.** A group builds its tracker aids from the YAML, as ADR-0012 invites. Their retreat card copies `retreat.effects` verbatim: "Actions are not limited by the retreat, only ordered after the forced move." Giant Forest, round 9, the retreat clock full. Mila's forced move is one step along a shortest chain from On Body to Distant, and On Body, Blind Spot, Distant is one, so she flies to Blind Spot with a decoy holding the Titan. Her player reads the retreat card: not limited. The GM reads section 5.7 or the Catalog: no retreat under way. The strike's own row wins, and the answer is no cut, but the table has just argued over a rule the decision settled, and the file the rulebook names as the retreat's source says the player was right. A Foundry translation that reads `retreat.effects` to build the retreat's restrictions would ship the wrong card.

**Fix options.**
1. Edit the row to the decision's wording: "Actions are not limited by the retreat, only ordered after the forced move (order), except that no Nape strike is made during a retreat, on a soldier's own turn or through Hook and Cut (data/engagement/titan-harm.yaml, nape_strikes; data/engagement/squad-tactics.yaml, hook-and-cut; decision batch 5, 5-15, OQ-129)." One line; every existing pointer then lands on the rule it cites. Preferred.
2. Keep the row as the general statement and re-point every citation (section 5.10, 5.7, the Catalog row and Appendix 2A.4, the Feint row, Hook and Cut, OQ-129) at `titan-harm.yaml` `nape_strikes.requirements` instead. Eight edits for the same result; only worth it if the decider prefers the ban to live on the strike alone.

## Round 2 scenarios walked under the batch 5b text

Each is the at-the-table scenario the brief names, followed by the single outcome the rules now give.

### Retreat from On Body at Giant Forest and at Urban, with a decoy holding (Fable Critical 1; Astra C2's remainder)

Giant Forest, Medium Titan A, round 9, the retreat clock filled at the end of round 8. Mila at On Body; Jonas's flare holds A's Attention with one card of the hold left; Mila's card 6 comes before A's card 9.

1. **Move first** (section 5.3 *Order of play*; `round.yaml` `turn_order`; `background-titans.yaml` `retreat.effects.order`). Neither exception applies: she is not staying with a fallen comrade and her action is not Lift Comrade.
2. **The forced move** (option 1) is one step along a shortest chain of steps her ODM move can make from On Body to Distant. At Giant Forest both On Body, In Reach, Distant and On Body, Blind Spot, Distant are two steps (`anchor-ratings.yaml`, `giant-forest`), so she may name either. She names Blind Spot. Legal.
3. **Her action.** A Nape strike needs "no retreat under way" (section 5.7; `titan-harm.yaml` `nape_strikes.requirements`; `action-catalog.yaml` `nape-strike.requirements`). Illegal. The decoy's hold, her not holding Attention, and her working ODM Gear no longer matter. She may take any other action from Blind Spot: an eye strike (eyes are struck from On Body or Blind Spot, section 5.7), a Read, a Draw Attention, or a flare or cloak Break Attention (the Feint needs In Reach or On Body). Nothing she does gives a cut.
4. **Next turn** (round 10, if the fight has not ended): Blind Spot to Distant is a Giant Forest step, so option 1 takes her to Distant; the turn after, option 2, she leaves.

Urban gives the same walk: On Body, Blind Spot, Distant is a shortest chain there too (Distant to Blind Spot exists with a Fly roll, which does not apply in the Blind Spot to Distant direction of her later move since the row is "either way" and the Fly roll is on the row itself; a failed Fly roll on that step ends her at In Reach, which is still toward Distant). The action at Blind Spot is the same: no Nape strike.

**Hook and Cut on a card before hers.** Jonas's Break Attention succeeds on card 4 while Mila is still at Blind Spot from round 8. `squad-tactics.yaml` `hook-and-cut.condition` requires "no retreat is under way", and adds "During a retreat the Break Attention still resolves, and this tactic is not used or spent." Section 5.12's table carries the condition. The decoy holds A; no cut; the tactic stays unused for a fight that will not need it.

**Option 3 toward a Down comrade at Blind Spot.** Hale is Down at Blind Spot beside a grounded Titan at Wooded. Ilse at In Reach takes option 3 (In Reach to Blind Spot lowers the steps to Hale from 1 to 0). At Blind Spot her action cannot be a Nape strike; it can be Treat Injury on Hale, after which option 4 lets her stay next turn, or Lift Comrade, after which the move (option 1) takes both toward Distant the same turn (5-13).

One outcome on every rating: no Nape strike during a retreat, by any route. Resolved.

### Session start with a treated injury, an untreated injury, and worn ODM Gear before the interim issue (Fable Major 1; Astra M1)

Session 2 opens. Oskar holds a treated arm injury with 9 healing days left; Ilse an untreated non-lethal leg injury; Hale's ODM Gear (rated 2, Funding 3) is at 1 of 2; nobody is mid-procedure.

1. **The interim day passes first** (`healing.yaml` `day_passes.interim`; section 3.6; Chapter 4 section 4.9: the interim issue comes after the day and its care window).
2. **Step 1, the day care window** (`each_day`; `treat-injury.yaml` `care_windows.day`). Its scope is the third branch: "For the interim day ... every soldier in the Squad" (section 3.5 says the same). So Oskar, Ilse, Hale, and every Squadmate are patients, rollers, helpers, and Coverers. Any living soldier not Down may make one Treat Injury roll; Ilse's leg is a legal treat use for anyone, and Ilse may self-treat at the 2-dice penalty. Field Repair is rolled in this window (`field-repair.yaml` `outside_titan_engagement.when`: "or on the interim day"; section 4.8; the `gear` row of `treat-injury.yaml` and section 3.5 *Talents and supplies* list it). Hale, or any soldier in scope, makes one Field Repair roll on Hale's harness; at Wits 3 with no tool kit and Stress 0, one roll with one Push succeeds 72.2% of the time (`repair.py`, 200,000 rolls; Wits 2: 59.7%; an Engineer with a tool kit at Wits 4: 85.9%), and one success restores the harness to 2 of 2. Help of up to 3 dice from other soldiers in scope applies as the row states.
3. **Step 2:** no `day` Death Rolls are due.
4. **Step 3:** all Health lost to damage returns.
5. **Step 4:** Oskar's healing time drops to 8; Ilse's untreated leg drops by 1 as well, and heals at 0 whether or not it was treated.
6. **Then the interim issue** (`standard-issue.yaml` `interim_issue.when`; section 4.9). Hale's ODM Gear is rated at the row (2), so it is kept as it is: 2 of 2 if the repair landed, 1 of 2 if it failed. Canisters refill, Blade Sets top up, a worn horse is replaced.

Stress and Grief do not change. One reading, no invention. Resolved.

### A Background Titan entering (Astra M2)

Interim setup: Anchor Rating 3 (Wooded), Focus Size Class 4 (Medium), `medium_abnormal` 2 (standard Medium), Background 6 (two Titans, clocks 4 and 8). Section 5.1 step 3 now says: for each Background Titan, in clock order, roll D6 on the Size Class table, and never the Abnormal roll. Rolls 2 and 6: a standard Small Titan on the clock of 4, a standard Large Titan on the clock of 8. Both Size Classes go on the tracker's Background rows (section 5.3) and are public (section 5.10 *Clocks*, which now points at step 3). The rendered table is titled "Size Class (D6), for the Focus Titan and for each Background Titan" with a "Standard Titan" column; `render.py check` confirms it matches `engagement-setup.yaml`.

End of round 4, background-clocks step: the clock of 4 fills, one Focus Titan is alive, so the Small Titan enters as Focus Titan B (`full_clock.fewer_than_two_focus_titans`): every soldier holds Distant relative to it, its ladder is evaluated with no cards choosing, so nothing holds its Attention until its first card; every soldier holding a Position makes the `second-focus-titan` Fear Roll; it is dealt cards from round 5. Then the retreat clock fills to 4 of 8. End of round 8, if A and B both live: the clock of 8 fills while two Focus Titans are alive, so the Large Titan does not enter and the Titan Engagement becomes a retreat (`two_focus_titans_alive`); the retreat clock does not fill (`stopped`), which changes nothing since it would have filled to 8 and started the same retreat. One outcome. Resolved.

## Every Anchor Rating under a retreat

The brief asked whether any rating's step rows or any forced move reopens a last cut. With 5-15 the answer no longer depends on geometry, but the sweep is recorded so the ADR's sentence is checked on every rating, not asserted.

| Rating | Shortest chains from On Body to Distant | Shortest chains from Blind Spot to Distant | Forced move can end at Blind Spot? | Nape strike there? |
|---|---|---|---|---|
| Open | On Body, In Reach, Distant | (no Blind Spot while standing; grounded: Blind Spot, On Body, In Reach, Distant) | Only by option 3 toward a Down comrade at Blind Spot of a grounded Titan | No: `nape_strikes.requirements`, `nape-strike.requirements` |
| Sparse | On Body, In Reach, Distant | Blind Spot, In Reach, Distant (2 steps; Blind Spot to On Body to In Reach to Distant is 3) | Only by option 3 | No |
| Wooded | On Body, In Reach, Distant | Blind Spot, In Reach, Distant | Only by option 3 | No |
| Urban | On Body, In Reach, Distant; On Body, Blind Spot, Distant | Blind Spot, Distant (1 step, Fly roll; a failed roll ends at In Reach) | Yes, option 1 or 3 | No |
| Giant Forest | On Body, In Reach, Distant; On Body, Blind Spot, Distant | Blind Spot, Distant (1 step) | Yes, option 1 or 3 | No |

Other routes to a Nape strike checked and closed: Hook and Cut (`hook-and-cut.condition`, "no retreat is under way"); the Grab's `titan-dies` escape (a Nape strike, so unreachable in a retreat; Break Free, Pry Loose, the arm strike, and Break Attention remain, as 5-15 says); Relentless (adds an Opening to a short strike, never a strike); no Talent, Squad Tactic, Behavior Table entry, or Chapter 6 rule grants a strike outside the `nape-strike` entry (`talents.yaml`, `squad-tactics.yaml`, `data/titans/*.yaml` grepped). A retreat starts only at an end step or after a flare's Break Attention and its Hook and Cut are fully resolved (`ticks.flare`), so no Nape strike is ever mid-resolution when one begins. ADR-0010's batch 5b sentence ("no Nape strike is made during a retreat, so the promise holds on every Anchor Rating whatever chain a forced move takes") is true on every rating. The one place the data still says otherwise is Major 1.

## The drafter's addition: "no retreat under way" on the Nape strike's requirement rows

Beyond 5-15's listed impacts, the drafter added the requirement to section 5.7, `titan-harm.yaml` `nape_strikes.requirements`, and `action-catalog.yaml` `nape-strike.requirements` (rendered in Appendix 2A.4). Checked:

- **Consistent with the decision and the ADR.** It states the same rule on the strike that 5-15 states on the retreat; ADR-0010 batch 5b names the ban as a rule of the retreat, and a requirement on the strike is how a data-shaped rule reaches the Catalog (ADR-0003 items 9 and 12; ADR-0012). It is also what makes Major 1 a Major rather than a Critical: the ban is in data on the row a player's roll is built from.
- **No side effects.** The Catalog entry keeps `context: titan-engagement`, and a retreat exists only inside one. Chapter 6 tables and the Sprinting Abnormal name nothing about the strike's requirements. The Feint row's "in every state in which a Nape strike is legal, outside a retreat" reads correctly against a requirement that itself excludes a retreat. Hook and Cut's condition ("meets the Nape strike's requirements, and no retreat is under way") now states the retreat test twice, once through the requirement and once directly; redundant, not contradictory.
- **Pointer.** All three rows cite `background-titans.yaml, retreat, actions` as the source, which is the row Major 1 concerns. Fix option 1 there makes the pointers true.

## Consistency sweep of the changed prose, YAML, rendered tables, glossary, and ADRs

- **5-15.** Section 5.10 *Actions are not limited*, the OQ-87 design note, section 5.6's Feint note, section 5.3's OQ-77 note, section 5.12's Hook and Cut row, `attention.yaml` Feint `repeatable`, `squad-tactics.yaml` `hook-and-cut`, `tuning.yaml` `prepared_squad_kill.model.retreat` ("No Treat Injury, Nape strike, Squad Tactic, or Draw Attention is taken during the retreat"), section 5.13's lone-fight text ("no cut follows"), OQ-129, OQ-87 and OQ-119 revised lines, and ADR-0010 batch 5b all agree. The exception is `retreat.effects.actions` (Major 1). ADR-0010's batch 5 paragraph still contains the superseded "steps to In Reach before acting" sentence, but the batch 5b paragraph names it as superseded, which is the ADR's history convention; not a finding.
- **5-16.** `treat-injury.yaml` `care_windows.day.scope` (third branch), its `gear` row, `healing.yaml` `day_passes.interim`, `field-repair.yaml` `outside_titan_engagement.when`, `standard-issue.yaml` `interim_issue.when`, Chapter 3 introduction, sections 3.1, 3.5, 3.6, Chapter 4 sections 4.8 and 4.9, OQ-120's revised line, and OQ-130 agree. The glossary's Downtime entry ("between Expeditions") is untouched and the interim day is not called Downtime anywhere, so the Downtime prohibition on Field Repair does not catch it.
- **5-17.** `engagement-setup.yaml` `steps.background-titans` and Chapter 5 section 5.1 step 3 agree; the rendered block matches; section 5.10 *Clocks* points at step 3. No YAML change was needed and none was made.
- **5-18.** Section 3.17's Oskar example reads "When the next day passes (at a night camp once the Expedition rules exist, and until then at the start of the next session, section 3.6)". `carrying.yaml` `shared_out.left_behind`, `engagement-flow.yaml` `left_behind`, Chapter 4 section 4.11 *Left behind*, and Chapter 5 section 5.11 agree that a left-behind soldier's items leave play with the field and a passed item stays the comrade's. Section 2.8 lists `ride` under *Dormant rolls* with "(decision batch 5, OQ-121)" and not under *Harm, gear, and mind*; the eight dormant entries (`spot`, `size-up`, `survive`, `persuade`, `endure`, `sneak`, `recall`, `ride`) match section 2.3.3's "Eight" and the attribute table's dormant marks.
- **5-13 (round 2 Minor 1).** No `PROVISIONAL` marker in any chapter or data file; section 5.10's *Order* bullet, `background-titans.yaml` `order`, and `tuning.yaml` `retreat` cite 5-13.
- **Glossary.** No entry contradicts the changes: Nape, Blind Spot, Attention, Feint, Squad Tactic, Retreat clock, and Standard Issue read as before and none states the retreat's action rule; no term listed under `_Avoid_` was introduced by the batch 5b edits.
- **Renderers.** Both checks pass; the two rendered blocks batch 5b touched (the interim setup table's Size Class title and column; Appendix 2A.4's Nape strike row) match their YAML.

## Round 2 findings: status

| Finding | Status | Where |
|---|---|---|
| Fable Critical 1: retreat's last cut at Giant Forest and Urban | Resolved (5-15, OQ-129) in the chapter and the strike's rows; the retreat's `actions` row not yet edited (Major 1 above) | Ch5 5.6, 5.7, 5.10, 5.12; `titan-harm.yaml`; `action-catalog.yaml`; `attention.yaml`; `squad-tactics.yaml`; ADR-0010 5b |
| Fable Major 1 / Astra M1: interim day's care window scope and Field Repair | Resolved (5-16, OQ-130) | Ch3 3.5, 3.6; Ch4 4.8, 4.9; `treat-injury.yaml`; `healing.yaml`; `field-repair.yaml` |
| Astra M2: Background Titans' Size Class rolls omitted from Chapter 5 | Resolved (5-17) | Ch5 5.1 step 3 and the rendered table; 5.10 *Clocks* |
| Fable Minor 1: PROVISIONAL marker for 5-13 | Resolved (5-13, 5-18) | Ch5 5.10; `background-titans.yaml` `order`; `tuning.yaml` `retreat` |
| Fable Minor 2: Oskar example's "next night camp" | Resolved (5-18) | Ch3 3.17 |
| Fable Minor 3: a left-behind soldier's items shared out | Resolved (5-18, OQ-131) | Ch4 4.11; Ch5 5.11; `carrying.yaml`; `engagement-flow.yaml` |
| Fable Minor 4: Dormant rolls count | Resolved (5-18) | Ch2 2.8 |
| Astra C2 (round 1) remainder at Giant Forest and Urban | Resolved by 5-15 | as Fable Critical 1 |
| OQ-112 four strikers | Logged, open, unchanged | OQ-112 |
| OQ-128 report vs probe gaps; stale simulator report | Logged, open; rerun in progress, not read | OQ-128 |

## Readiness

With Major 1's one-line edit to `retreat.effects.actions`, the six chapters, their data, and the ADRs state the same rules at every place batch 5b touched, both renderer checks pass, no PROVISIONAL marker remains, and the three round 2 scenarios each give one outcome without a ruling. No new Critical or Major was found elsewhere in the touched material. The rulebook is ready for the playtest packet once that row is fixed and the simulator's rerun report is regenerated so the chapters' figures and the report agree (OQ-128).
