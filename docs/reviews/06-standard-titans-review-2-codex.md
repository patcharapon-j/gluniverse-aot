# Chapter 6 review, round 2 (Codex)

## Verdict

Chapter 6 meets the Chapter 6 constraints in `DECISIONS-2026-09-14.md`, including batch 3b. The four stat blocks fit Chapter 5's format and Size Class bounds; the three standard blocks copy their class values exactly. All four Behavior Tables are complete, rollable, tier-correct, and retain a legal result after any combination of Broken parts. Every Titan attack that harms a soldier gives a Critical Injury, and no behavior names or directly causes death. I found no Shifter or other Phase 2 content.

The ADR-0014 targets reproduce. The two reported conflicts are not rules or balance failures. I found one Minor defect in the support probe's horse-state model. Open finding count: **0 Critical, 0 Major, 1 Minor**.

## Finding

### 1. Minor: the screen-support probe does not preserve a legal horse state

**Location:** `tools/probes/chapter-06/fight6.py:128-130`, `tools/probes/chapter-06/fight6.py:154-157`, inherited `tools/probes/chapter-05/fight.py:218-238` and `tools/probes/chapter-05/fight.py:783-798`

**Problem:** Section 6.6 says the two screening Squadmates ride to the Attention holder's Position, send their horses, then use cloaks and Feints. The model instead initializes a standard screen Squadmate unmounted, moves them by the inherited foot/ODM step while treating the horse as if it moved with them, and sends that horse from the new Position. At a mounted start, any move forcibly dismounts the screen; if no move is needed, a successful horse decoy clears `horse_here` but leaves `mounted` true. The inherited horse Break Attention path also skips `horse_after`, so a player character who Pushes such a roll cannot wear or lame the horse.

**At the table:** A mounted screen beside a Distant holder succeeds with the riderless-horse decoy. The model records `horse_here = false` and `mounted = true`; a later harmful card therefore lets that soldier dodge with the departed horse. If the holder is In Reach, the same policy reaches them on foot while its horse silently changes Position, although Chapter 4 records a dismounted horse where its rider left it.

This did not hide a balance failure. In an independent 12,000-fight rerun that initialized screens mounted, allowed their Distant/In Reach ride, dismounted them when the horse left, and routed horse rolls through horse wear, the four screen rows changed by no more than 0.6 percentage points killed by round 3 and 0.02 Critical Injuries per fight. It remains a false implementation of the published policy and can distort cases with a Pushing player character.

**Fix options:**

1. Track the horse's Position and mounted state explicitly in `fight6.py`; initialize `screen2` Squadmates mounted, ride before sending the horse, dismount on success, and call `horse_after` for every horse roll.
2. Reuse the horse-state and Break Attention primitives from `tools/probes/chapter-05/lone.py`, which already apply wear and clear mounted when a riderless horse succeeds.
3. Add deterministic probe cases asserting that a sent horse cannot supply a later dodge, a dismounted horse does not follow a foot/ODM move, and a Pushed horse roll can make it lame.

## Independent checks and simulations

I parsed all 58 authored YAML files, ran `titans.py`, and ran `render.py check`. Every rendered stat block matches its YAML. `titans.py` reported no structural or rollability errors. The maximum kill-tier move-up share is 0.50 for every table. With the previous result excluded and all required parts Broken, the minimum number of legal non-Thrash entries is 3 for Small, 2 for Medium, 3 for Large, and 1 for the Sprinting Abnormal.

I ran fresh simulations from a temporary directory outside the repository. Full fights used 8,000 trials per Titan; lone strikes used 300,000 trials per build; Grab cells used 200,000 trials; lone fights used 60,000 trials per Titan.

### Binding targets

| Target | Fresh result | Judgment |
|---|---:|---|
| Prepared Squad of 4 vs standard Medium | median round 3; 62.4% killed by round 3; 0.68 Critical Injuries, 0.028 deaths, and 0.206 Grabs per fight | Passes every Medium band |
| Lone Rookie, Stress 1, fresh Medium cut after Break Attention | 12.890% | Passes the amended 8% to 14% band |
| Lone Levi-grade soldier, Stress 2, pushing hard, fresh Medium cut | 47.398% | About 50% |
| Grab death, one comrade In Reach, Stress 2 and Grief 0 | 33.623% | About 1 in 3 |
| Grab death, alone after a failed dodge | 69.823% | About 2 in 3 |

### How the tables compare

| Titan | Median kill | Killed by round 3 | No kill by round 12 | Critical Injuries/fight | Deaths/fight |
|---|---:|---:|---:|---:|---:|
| Standard Small | 2 | 80.9% | 1.4% | 0.81 | 0.038 |
| Standard Medium | 3 | 62.4% | 4.8% | 0.68 | 0.028 |
| Standard Large | 3 | 61.6% | 13.6% | 1.40 | 0.176 |
| Sprinting Abnormal | 2 | 82.5% | 1.7% | 1.10 | 0.059 |

The Small Titan is fast to kill but dangerous through Tempo 2. The Large Titan is the slowest and costliest standard fight; its fresh 13.6% no-kill result remains below the 15% limit. The Sprinting Abnormal dies as quickly as the Small but inflicts more harm, placing it between Small and Large in cost. No baseline or support table makes a fight unwinnable or trivial. The Large template Squad's published 20.4% no-kill row remains a reported build sensitivity, not a failure caused by the Behavior Table alone.

In the lone-fight rerun, a usable waiting-line strike appeared in 72.4% of Small fights, 75.7% of Medium fights, 75.1% of Large fights, and 51.8% of Sprinting Abnormal fights. The resulting fight-kill shares were 24.6%, 11.1%, 11.4%, and 16.6%. The Abnormal's lower access is paid for by its specific table: `Run Past` and `Trample Through` reach Distant, while the batch 3b reference Tempo 2 table used for the 77.1% comparison never does. Batch 3b requires the row to be reported, not tuned to 77.1%. The route remains legal and succeeds in a little over half of fights, so the reported 51.9% is sound.

The Abnormal's support deaths being just above the Large Titan's same-support rows is also not a contradiction. Batch 3b expressly makes the Medium floor row-by-row; OQ-103 provisionally keeps the winnability and death ceilings at the Large reference values, 0.162 deaths for ordinary rows and 0.268 for the template row. The Abnormal stays below those fixed ceilings. The 0.002 to 0.003 same-support differences are also only about one to two standard errors at 12,000 fights.

## Rules and fidelity audit

- Standard Tempo, Nape Depth, Regeneration, Toughness, and tier Severities exactly match their Small, Medium, and Large Size Class rows. The Abnormal's Tempo 2, Nape Depth 3, Regeneration 3, Toughness 2, and Severities 1/2/3 are all inside the permitted ranges; its Nape Depth exception is explicitly logged in OQ-106.
- Each table has two terrorize, two control, and two kill results, one Thrash, complete Position requirements and fallbacks, at least one Telegraph, no repeat lock, at most one Grab, and at most one lethal-capable Critical Injury. Broken-part move-up always leaves a legal entry.
- Harm is consistent with Chapter 3 and ADR-0005. Behaviors inflict Critical Injuries at fixed or rolled locations, with the `cannot_be_lethal` flag stated; death can arise only from the Critical Injury procedure or the Chapter 5 Grab countdown.
- The ordinary Titans are blunt, appetite-driven threats: grasping, biting, swatting, trampling, staring, and wandering without tactical intent. The Sprinting Abnormal's runner pattern is erratic and fixation-driven, ignores wounds in its ladder, and does not reproduce the Female Titan's purposeful anti-soldier tactics. That fits the 845-850 distinction between seemingly unintelligent Titans that consume humans and the conspicuously purposeful Female Titan described by the official publisher ([series description](https://kodansha.us/2011/10/20/kodansha-comics-announces-hajime-isayamas-attack-on-titan-at-new-york-comic-con/), [Volume 6](https://kodansha.us/series/attack-on-titan/volume-6/)).
- References to Shifters, Mission Briefs, and the Phase 1 simulator only mark excluded or future scope. No Shifter action, Intent Table, Research Point rule, or other Phase 2 mechanic enters a stat block or procedure.

## Provisional decisions

| Entry | Judgment |
|---|---|
| OQ-100 | Sound. Treating the `grab` effect as the mark avoids duplicate truth and matches the Closing Hand trigger after its earlier-chapter correction. |
| OQ-101 | Sound. The combined previous-behavior and Broken-parts reading is the conservative ADR-0001 reading, and enumeration proves every table stays at or below one-half kill share. |
| OQ-102 | Sound. The runner table and loudest-then-nearest ladder are closed, deterministic, canon-facing, and no longer borrow Shifter tactics. The departure from ADR-0010's standard hooked rung is explicit. |
| OQ-103 | Sound. The Medium floor is row-by-row as batch 3b requires; the Large winnability and death ceilings remain fixed because batch 3b does not make those comparisons row-by-row. Both reported conflicts are disclosed and acceptable. |
| OQ-104 | Sound. The 1-in-12 setup roll makes the Abnormal reachable without adding a second setup procedure, and its aggregate cost is reported. |
| OQ-105 | Sound and complete. Items 1-9 and 11-13 are applied; the intentionally untouched `PROGRESS.md` item follows the drafting instruction; the two genuine earlier-rule changes are separately logged as OQ-106 and OQ-107. |
| OQ-106 | Sound. Amend `CONTEXT.md` so Nape Depth and Regeneration are set by Size Class or an Abnormal's own stat block. This preserves the batch 3 constraint. |
| OQ-107 | Sound. Amend Chapter 5 and `behavior-procedure.yaml` so a dead target receives no later effects while other targets continue. Current Chapter 6 tables do not reach the edge case. |
| OQ-108 | Sound. Keeping Read facts in a marked GM section preserves Read's value while leaving the non-secret Behavior Table public. |

No OQ numbered above 108 is present in the current register.

## Round 1 disposition

Every Major and Minor from both round 1 reviews is resolved. The probe-state defect above is new and narrower than the former probe findings.

| Review | Round 1 finding | Status this round |
|---|---|---|
| `06-standard-titans-review-1.md` | M1: Abnormal figures omitted Fear and mounted start | Resolved: both are in the start and every Abnormal row. |
| | M2: rider Grab countdown did not run | Resolved: the rider branch now delegates a Grabbed rider to the full countdown. |
| | M3: Tempo 2 lone route was nearly closed | Resolved: batch 3b's Tempo-card hold and Feint produce a legal, measured route. |
| | M4: prose-used parts did not disable entries | Resolved: prose, `body_parts_used`, and move-up behavior agree. |
| | M5: Abnormal bar lacked a lethality ceiling | Resolved: OQ-103 gives fixed Large death ceilings and applies them. |
| | M6: no tactic or screen rows | Resolved: section 6.6 contains every required support row and the full Medium tactic matrix. |
| | m7: ADR-0010 exception was not logged | Resolved in OQ-102 and the table's design note. |
| | m8: prose promised absent effects | Resolved by rewriting the entries and explanatory text. |
| | m9: later effects after death undefined | Resolved for Chapter 6; the general rule is explicitly logged in OQ-107. |
| | m10: kill sentence omitted instant-death rows | Resolved in section 6.1. |
| | m11: OQ-100 duplicated and misstated fields | Resolved: the grab effect is the sole mark. |
| | m12: Grab probe ignored the Titan's Severity | Resolved: the cells use each block's Grab Severity. |
| | m13: Abnormal Jam holder was impossible | Resolved: the row is identified as the acceptance-table placement rather than an Abnormal ladder claim. |
| | m14: Abnormal was unreachable | Resolved by OQ-104's setup roll. |
| | m15: OQ-105 missed earlier pointers | Resolved; all four additions are applied or logged as OQ-106/OQ-107. |
| | m16: hidden Abnormal facts were player-facing | Resolved by the marked GM section and OQ-108. |
| | m17: standard tables lacked provisional labels | Resolved in sections 6.1 to 6.4. |
| | m18: glossary Avoid terms | Resolved; the flagged terms no longer appear in rules text. |
| `06-standard-titans-review-1-codex.md` | M1: Abnormal copied Female Titan tactics | Resolved by the runner redesign. |
| | M2: fiction-used limbs did not disable behaviors | Resolved by aligned prose and part requirements. |
| | M3: Abnormal was dead content | Resolved by OQ-104's 1-in-12 setup roll. |
| | M4: Abnormal bar accepted trivial or failed builds | Resolved by the Medium floor, Large ceilings, and per-row checks. |
| | m5: mounted Down omitted the fall | Resolved in `fight6.py`. |
| | m6: Small Titan scale contradicted its description | Resolved: it is now 3 to 5 m and its low attacks come from crouching and crawling. |

## Counts

- Critical: 0
- Major: 0
- Minor: 1
