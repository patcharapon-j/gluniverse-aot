# Wings of Freedom, Chapters 1 to 6: full review, round 3

Reviewer: Codex / Astra. Date: 2026-09-15.

## Verdict

**0 Critical, 0 Major, 1 Minor finding still open.** The round 2 Critical and Major play scenarios now have determinate outcomes. One sentence in the retreat YAML still lacks the exception decision 5-15 required. The explicit requirements in the Nape strike, Action Catalog, and Hook and Cut close the exploit, so the remaining defect is Minor source consistency, not a surviving last-cut bug.

This finding is the unfinished application of round 2 Fable Critical 1. No unrelated new Minor is reported. No new Critical or Major was established within this verification scope.

## Scope and method

Followed `.claude/agents/wof-reviewer.md`. Reviewed the six chapters and their dependencies with priority on both round 2 reports and the changes required by decisions 5-13 to 5-18. Applied `CONTEXT.md`, ADR-0001 to ADR-0015 as amended, the decisions register across its batches, and `OPEN-QUESTIONS.md`. Historical decisions superseded by later batches were not treated as competing current rules.

Checked the changed prose against YAML, the rendered references, the glossary, and the ADRs. Loaded all 59 YAML files with duplicate mapping keys rejected. Enumerated the Anchor Rating graphs in `/private/tmp/wof-round3-astra/check.py`, then traced the movement, strike, and tactic requirements. The graph enumeration checks connectivity; the textual review also checks move-kind permissions and Fly failures.

Did not read any parallel round 3 review or the simulator's running rerun. No project file was changed except this review. These are rules and data checks, not a completed human playtest or a new full balance measurement. No finding depends on disputed odds, so no dice simulation was needed this round.

## Finding still open

### m1. Minor: the retreat's actions row still omits the decided Nape-strike exception

**Location:** Chapter 5, section 5.10, *The retreat*, the Actions bullet; `data/engagement/background-titans.yaml:124`, `retreat.effects[id=actions].text`. Related requirements are in Chapter 5 sections 5.7 and 5.12, `data/engagement/titan-harm.yaml`, `data/character/action-catalog.yaml`, and `data/engagement/squad-tactics.yaml`.

**Problem:** The YAML row still reads:

> Actions are not limited by the retreat, only ordered after the forced move (order).

Decision 5-15 expressly requires that row to add the Nape-strike exception. Section 5.10 already prints it, as do the Nape strike and Hook and Cut requirements. Several of those updated rows point back to this unchanged `actions` row as their source. OQ-129 says the row carries the decision, but it does not.

**At the table:** In Giant Forest, a soldier starts their retreat turn On Body while a decoy holds Attention. They take the legal step to Blind Spot. Section 5.7 and the Catalog explicitly forbid a Nape strike, so they cannot cut. However, a reader following section 5.10's source pointer finds a blanket statement that retreat does not limit actions. The legal result is settled by the strike's specific requirement, but the source explanation is stale.

**Severity:** Minor. This is residue of the round 2 Critical fix, already covered by decision 5-15 and OQ-129. It neither restores a legal cut nor creates an unlogged ADR contradiction requiring a ruling. The explicit action requirements are why it is no longer Critical.

**Fix:** Apply the already decided sentence to `retreat.effects[id=actions].text`: actions remain available in the specified order, except that no Nape strike is made during a retreat. Keep the specific strike and tactic requirements. No new design decision is needed.

## Round 2 Critical and Major scenarios

### Retreat from On Body, with a decoy holding

**Chapter 5, sections 5.2, 5.7, 5.10, and 5.12.** At the end of round 8 the retreat clock fills. A soldier at On Body has working ODM Gear, a Blade Set, an unspent next turn, and a decoy holding the Titan's Attention. Their card precedes the Titan's in round 9.

- **Giant Forest:** They choose the shortest chain On Body, Blind Spot, Distant. Their forced move reaches Blind Spot. They cannot declare a Nape strike because a retreat is under way. Their action remains available for another legal use.
- **Urban:** The same chosen first step reaches Blind Spot without a Fly roll. The Fly roll belongs to the separate Blind Spot to Distant step. Again, the Nape strike is forbidden. If they attempt that later outward step and fail, they end at In Reach; failure does not permit a cut.
- **Hook and Cut before the striker's card:** A comrade's successful Break Attention still resolves, including releasing a Grabbed soldier. During retreat, Hook and Cut's condition fails. No cut happens, no striker action is spent by it, and the tactic remains unused.
- **A flare that starts the retreat:** If no retreat is under way before the flare resolves, an otherwise legal Hook and Cut happens before the flare fills Background clocks. A retreat beginning afterward does not invalidate that earlier cut. Once the retreat starts, every subsequent cut is forbidden. This is the ordering of `ticks.flare` and the tactic's `when`, not an exception during retreat.

**Outcome:** No last cut during retreat, regardless of card order, decoy hold, grounded state, or arrival at Blind Spot. ADR-0010's batch 5b promise holds. Its earlier claim that every soldier first steps to In Reach is expressly superseded. The remaining source sentence is m1 above.

### Session start with treated and untreated injuries and worn ODM Gear

**Chapter 3, sections 3.5 and 3.6; Chapter 4, sections 4.8 and 4.9; Chapter 5, section 5.1.** Session 2 starts outside an Expedition, Downtime, or an unfinished procedure. Oskar has a treated arm injury with 9 healing days left. Ilse has an untreated nonlethal leg injury with more than 1 healing day left. Hale has ODM Gear at current rating 1, rated 2. No relevant Talent changes the example, and rolls below are not Pushed.

1. The interim day opens a care window whose scope is every soldier in the Squad. Living soldiers who are not Down may treat, Help, or Cover under the written limits. No Position requirement or invented Expedition is needed.
2. A comrade rolls one success to treat Ilse's injury. It becomes treated and returns its crossed-off Health box, subject to the ordinary cap for other untreated injuries. Oskar's already treated injury is not eligible for another `treat` use.
3. A legal Field Repair roll on Hale's harness gets one success. Its current rating rises from 1 to 2. Field Repair has its own allowance, separate from Treat Injury, so a soldier's treatment roll does not consume their repair roll.
4. No day-limit Death Roll is due in this example. The day erases damage marks and reduces remaining healing times by one. Oskar's arm now has 8 days left. Ilse's remaining time also drops by one; treatment alone does not instantly heal the injury.
5. The interim issue follows the whole day, including its repairs. Hale keeps the now 2-of-2 harness. If the repair had failed, he would instead keep it at 1-of-2: the issue tests its rating, not its current rating, and does not automatically restore kept ODM Gear.

For Astra M1's lethal variant, the same all-Squad window precedes the Death Roll. A successful treatment stabilizes the chosen injury and removes its day limit. If treatment fails and the injury remains lethal, its day-limit Death Roll follows the window. Down affects who can act, not whether the patient is in scope.

If the session resumes an unfinished Titan Engagement or care window, the interim day waits until that procedure ends, then precedes the issue. The day gives no automatic Stress or Grief reset; ordinary effects of treatment, Pushes, Scars, and deaths still apply.

**Outcome:** Both participant scope and repair timing are defined. Fable Major 1 and Astra M1 are Resolved.

### A Background Titan enters

**Chapter 5, sections 5.1 and 5.10; Chapter 6, sections 6.1, 6.2, and 6.4.** Focus Titan A is Medium. The Background roll is 6, giving clocks 4 and 8. The two subsequent Size Class rolls, in that order, are 2 and 6.

- Setup records a standard Small Titan on clock 4 and a standard Large Titan on clock 8. Their Size Classes and standard stat blocks are public. Neither receives a `medium_abnormal` roll.
- With A still alive, the first clock fills at the end of round 4. The Small Titan enters as B with Intact parts, no Openings, an empty Regeneration clock, and its hidden Next Behavior rolled. Every soldier still holding a Position is Distant from B. Soldiers who already left do not re-enter.
- B evaluates Attention at the end step, where the ending round's cards do not break a tie. With several eligible soldiers equally Distant and no distinguishing flag, nothing holds B's Attention. The second-Focus-Titan Fear trigger applies, with Down soldiers exempt and one Fear Roll per soldier for the event. B gets its two cards starting next round.
- If both A and B still live when the second clock fills, the Large Titan does not enter. The Engagement becomes a retreat. If a Focus slot is available instead, it enters with its already determined Large stat block.

**Outcome:** The chapter now supplies the same separate, ordered Size Class rolls as YAML. No selection or inference by the GM is required. Astra M2 is Resolved.

## Every Anchor Rating checked

`anchor-ratings.yaml` contains **five ratings and 20 base step rows**. The setup table has six die faces because Wooded occupies two. Checked every row in both directions, its on-foot, mounted, and ODM permissions, both Fly failure destinations, and the grounded additions.

| Rating | Retreat paths checked | Nape strike during retreat |
|---|---|---|
| Open | Standing Titan has no route to Blind Spot. Grounding adds On Body to Blind Spot, including on foot. Rescue movement can reach that Position; standing again changes it to On Body. | Forbidden |
| Sparse | The ordinary outward route goes through In Reach. The Fly step between In Reach and Blind Spot can fail to On Body. Grounding allows the close steps on foot. | Forbidden |
| Wooded | Ordinary outward steps pass through In Reach. Movement toward a fallen comrade may instead end at Blind Spot, including on foot when grounded. | Forbidden |
| Urban | On Body may step to Blind Spot along a shortest outward chain. Blind Spot to Distant needs Fly; failure ends at In Reach. Mounted movement lacks the Distant to In Reach step. | Forbidden |
| Giant Forest | On Body may step to Blind Spot, then directly to Distant without Fly. Grounding and rescue moves do not change the strike requirement. | Forbidden |

Also checked rescue options 3 and 4, the Lift Comrade order exception, letting go and falls, Fall Back, the two-Titan close rule, movement relative to the earlier-labelled Titan, and turns whose move or action was spent already. None grants permission to ignore Nape strike requirements. A soldier cannot rename the cut as an uncatalogued action either: Chapter 2 section 2.9 makes the matching Catalog entry apply for every purpose.

Grounding removes the working-ODM requirement and supplies its stated movement permissions and Bonus Dice. It does not remove the independent retreat requirement. Clear the Hand alters holding-arm strikes only. These distinctions preserve the available rescues without reopening Hook and Cut.

## Each round 2 finding

| Previous finding | Status this round | Verification |
|---|---|---|
| Fable Critical 1, retreat last cut | **Still open at Minor severity only** | The mechanical exploit is resolved in sections 5.7, 5.10, and 5.12 and their specific YAML requirements. The incomplete `actions` sentence is m1 above. |
| Fable Major 1, interim scope and Field Repair | **Resolved** | Chapters 3 and 4 now state the all-Squad scope, repair permission, and day-before-issue order. |
| Fable Minor 1, stale 5-13 marker | **Resolved** | The lift exception is decided in section 5.10 and the YAML order row. No PROVISIONAL marker remains in chapters or data. |
| Fable Minor 2, next-night-camp example | **Resolved** | Chapter 3 section 3.17's Oskar example says the next day passes at the next session start under the interim rule. |
| Fable Minor 3, left-behind gear shared to survivors | **Resolved** | Chapter 4 section 4.11, Chapter 5 section 5.11, and `carrying.yaml` explicitly remove left-behind items from play and exclude them from sharing. Previously passed items stay with their recipients. |
| Fable Minor 4, Dormant rolls count | **Resolved** | Chapter 2 sections 2.3.3 and 2.8 agree on eight. YAML marks exactly `ride`, `spot`, `size-up`, `survive`, `persuade`, `endure`, `sneak`, and `recall` dormant. |
| Astra M1, interim-day participant scope | **Resolved** | Same all-Squad window and lethal-day ordering verified above. |
| Astra M2, omitted Background Size Class rolls | **Resolved** | Section 5.1 step 3 calls every roll in clock order, and the rendered size lookup explicitly serves Focus and Background Titans. |

## Rendering, markers, and limits

The requested `uv run --with pyyaml python ... check` commands were attempted with a temporary cache. Both failed fetching PyYAML because DNS access to PyPI was unavailable. Ran the same check entry points successfully with cached PyYAML and bytecode writing disabled:

```text
tools/render/render.py check
 every rendered block matches the YAML (32 blocks in 4 chapters)

tools/probes/chapter-06/render.py check
 every rendered block matches the YAML
```

All 59 YAML files loaded with no duplicate mapping keys. The changed setup table agrees with its data. The Nape-strike requirement also appears in Chapter 2's rendered Catalog reference. Renderer success does not establish prose completeness; the retreat `actions` sentence is outside the rendered blocks and remains m1.

A case-insensitive search of `docs/rules/` and `data/` found **no PROVISIONAL text in any of the six chapters or any data file**. Remaining matches are in `OPEN-QUESTIONS.md`, historical decision records and removal instructions in `DECISIONS-2026-09-14.md`, and the general completion criterion in `PROGRESS.md`. None is an unregistered live provisional rule.

No additional contradiction affecting the verified outcomes was found between the changed prose, glossary, ADRs, and tables. The glossary's Blind Spot definition gives a necessary Position, not unconditional permission to strike. Its Critical Injury, Health, Standard Issue, and Background Titan meanings remain consistent with the fixes.

Previously logged limitations remain separate: OQ-112's four-striker advantage, OQ-115's combined two-Titan and Background measurements, OQ-116 to OQ-118's simulation qualifications, OQ-128's reconciliation gaps, and the timed paper test. This review does not close them or predict the parallel simulator's result. No changed die pool, Severity, Nape Depth, or timing probability is asserted here as newly measured.

## Counts by chapter

Only the still-open residue is counted. Previous severities and resolved findings are not added to these totals.

| Chapter | Critical | Major | Minor |
|---|---:|---:|---:|
| 1 Core Rules | 0 | 0 | 0 |
| 2 Character Creation | 0 | 0 | 0 |
| 3 Harm and Mind | 0 | 0 | 0 |
| 4 Gear | 0 | 0 | 0 |
| 5 Titan Engagement | 0 | 0 | 1 |
| 6 Standard Titans | 0 | 0 | 0 |
| **Total** | **0** | **0** | **1** |
