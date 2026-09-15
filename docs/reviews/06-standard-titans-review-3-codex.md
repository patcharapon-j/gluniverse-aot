# Chapter 6, Standard Titans: review round 3 (Codex)

Reviewed `docs/rules/06-standard-titans.md`, every file in `data/titans/`, the Chapter 6 probes, `CONTEXT.md`, ADR-0001 to ADR-0015, Chapters 1 to 5 and their data, `DECISIONS-2026-09-14.md` through batch 3d, OQ-100 to OQ-111, and both Chapter 6 round 2 reviews. I did not read either parallel round 3 review or any Chapters 1 to 5 conformance review.

The dice reruns used Python from a temporary directory outside the repository. Static checks used the authored validators without writing generated files.

## Verdict

Chapter 6 is mechanically ready apart from one deliberately deferred file-name cleanup. Open finding count: **0 Critical, 0 Major, 1 Minor**.

The four tables are complete and rollable. Every result from 1 to 6 is present, every table has one Thrash and a telegraph, no back-to-back repeat survives the move-up procedure, and every combination of previous behavior and Broken parts leaves at least one legal non-Thrash entry. The three standard stat blocks copy their Size Class values. The Sprinting Abnormal stays inside the permitted bounds and has its own closed, deterministic ladder. Every direct Titan attack that harms gives a Critical Injury, the control entries and the Grab crush cannot be lethal, and no behavior names death. I found no Shifter or other Phase 2 rule in a playable block.

## Finding

### 1. Minor: `roster.yaml` still uses a glossary Avoid term

**Location:** `data/titans/roster.yaml`; Chapter 6 lines 19, 40, 72, 296, 840, and 849; OQ-110 in `docs/rules/OPEN-QUESTIONS.md`

**Problem:** The glossary reserves "roster" as an Avoid term for Squad Pool, but the Titan index still has that name. OQ-110 logs the conflict and chooses `data/titans/index.yaml`, so this is not an unlogged glossary contradiction. The fix remains unapplied because it must move Chapter 5 and Chapter 6 pointers together.

**Concrete play scenario:** A Foundry importer follows the Titan file pattern and calls the Squad Pool a roster, putting a forbidden synonym back into player-facing UI and data identifiers.

**Fix options:**

1. Take OQ-110 option (a): rename the file to `data/titans/index.yaml` and update every pointer listed in OQ-110 in one pass.
2. If file names should be exempt, take option (b) and state that exception in `CONTEXT.md`. This is weaker because later authors will copy the term.

## Static conformance and table audit

- All 59 YAML files in the named dependency directories parse.
- `tools/probes/chapter-06/titans.py` reports zero problems for all four Titans.
- `tools/probes/chapter-06/render.py check` reports every rendered block matches its YAML.
- Reconstructing `probe-figures.yaml` in memory from the seven committed result JSON files gives a byte-for-byte match.
- The horse-state self-test added after round 2 passes.
- Maximum kill-tier move-up share is 0.50 on every table. The fewest legal non-Thrash entries after combining the previous behavior with Broken eyes, arms, and legs are Small 3, Medium 2, Large 3, and Abnormal 1.
- A holder at In Reach meets Small 5, Medium 5, Large 4, and Abnormal 5 results in six.
- Heavy Tread, Run Past, Trample, and Headlong Lunge require both legs. One Broken leg therefore disables every running or treading entry while preserving a legal move-up result.
- Toughness, Nape Depth, Regeneration, Tempo, and tier Severities match `size-classes.yaml` for all standard Titans. The Abnormal's Tempo 2, Nape Depth 3, Regeneration 3, Toughness 2, and Severities 1 to 3 are all within the Chapter 6 bounds.

## ADR-0014 simulations

Fresh fixed-seed reruns reproduce the published targets. The full-fight rows used 12,000 fights each, lone cuts 200,000 rolls, the lone Grab 120,000 trials, the comrade Grab cell 60,000 trials, and lone fights 100,000 trials per Titan.

| Target | Fresh result | Judgment |
|---|---:|---|
| Prepared Squad of 4 against standard Medium | median kill round 3; 62.4% killed by round 3; 0.691 Critical Injuries, 0.032 deaths, 0.206 Grabs per fight | Passes every Medium band |
| Lone Rookie, Stress 1, fresh Medium cut directly after Break Attention | 13.259% | Passes the amended 8% to 14% band |
| Lone Levi-grade soldier, Stress 2, pushing hard, fresh Medium cut | 47.279% | About 50% |
| Grab death, alone after a failed dodge | 69.626% | About 2 in 3 |
| Grab death, one reference comrade In Reach, Stress 2 and Grief 0 | 33.535% | About 1 in 3 |

The committed-seed lone-fight figures reproduce exactly:

| Titan | Usable strike within 12 rounds | Median strike round | Cards before strike | Critical Injuries per fight | Dead | Down | No decoy usable first | Cut succeeds | Lone fights that kill |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Standard Small | 72.5% | 4 | 6.29 | 0.322 | 6.1% | 5.0% | 0.0% | 33.6% | 24.3% |
| Standard Medium | 77.0% | 4 | 2.93 | 0.217 | 4.0% | 4.3% | 0.2% | 14.5% | 11.2% |
| Standard Large | 76.1% | 4 | 2.88 | 0.248 | 5.0% | 3.0% | 0.2% | 14.9% | 11.4% |
| Sprinting Abnormal | 52.0% | 4 | 7.44 | 1.533 | 6.4% | 20.8% | 0.0% | 31.7% | 16.5% |

The standard fights compare cleanly. Small is the quickest standard kill, at median round 2 and 80.8% by round 3, but Tempo 2 still produces 0.833 Critical Injuries per fight. Medium is the reference fight. Large is the costliest standard fight, at median round 3, 12.92% with no kill in 12 rounds, and 1.418 Critical Injuries per fight. The Abnormal falls in median round 2, with 74.5% killed by round 3, 5.33% with no kill in 12 rounds, and 0.810 Critical Injuries per fight. None is unwinnable or trivial under the baseline or committed support rows.

The Abnormal's lower lone access is a real table cost, not a closed route. Run Past and Trample reach Distant, while the Feint remains usable whenever a Nape strike can become legal. Its row is dangerous, but it remains below the Large twin's winnability and death ceilings and above the Medium twin's harm floor under OQ-103's row-against-row test.

## Behavior and 845 to 850 fidelity

The standard Titans act as appetite-driven, erratic threats: staring, snapping, swatting, rolling, biting, and grabbing. They target humans rather than horses and show no tactical intent. The Large Titan's high mouth explains its On Body Bite and In Reach Crush fallback. The Small Titan's crouching and crawling make its low Grab and Bite credible at 3 to 5 m.

The Sprinting Abnormal now matches the chapter-22 runner rather than the Female Titan. It barrels past outer riders, reaches Distant soldiers through running entries, ignores the standard reach and pain rungs, and can be stopped by cutting one leg. The hooked rung makes a failed Nape cut draw it without restoring the standard ladder. No rider preference, aerial snatch, deliberate interception, Hardening, Intent Table, or Extraction remains.

## Provisional decisions

| Entry | Judgment |
|---|---|
| OQ-100 | Sound. The `grab` effect is the mark and the rendered Grab column exposes it without duplicating data. |
| OQ-101 | Sound. The strict combined-state reading is the only reading that tests the Broken-part shift the constraint is meant to control. Enumeration proves every table remains at or below one-half kill share. |
| OQ-102 | Sound. Option (b) restores the hooked rung, keeps the runner distinct from the standard ladder, and avoids the Female Titan's deliberate tactics. |
| OQ-103 | Sound. One row-against-row rule governs the floor, winnability limit, and ceiling. The stated two-standard-error tolerance at 120,000 fights is applied consistently. |
| OQ-104 | Sound. The 1-in-12 Focus-Titan rate makes the Abnormal playable through the single setup procedure without changing Background Titan generation. |
| OQ-105 | Sound and applied where permitted. The remaining glossary, later-effects, and file-name changes are separately logged as OQ-106, OQ-107, and OQ-110. |
| OQ-106 | Sound. The glossary should say that Size Class or an Abnormal's own stat block sets Nape Depth and Regeneration. The current contradiction is explicitly logged. |
| OQ-107 | Sound. A dead target receives no later effects, while other targets continue. No current Chapter 6 entry reaches the edge case. |
| OQ-108 | Sound and applied. Hidden Abnormal values and its ladder appear only in marked GM subsections; its public Behavior Table and Tempo remain public. |
| OQ-109 | Sound and applied. Requiring both legs uses the existing data format and disables running or treading as soon as the Titan is grounded. |
| OQ-110 | Sound but still open. Rename to `index.yaml` and move all Chapter 5 and Chapter 6 pointers together. This is finding 1. |
| OQ-111 | Decided consistently in batch 3d. ADR-0003 now names the Grab exception, and Chapter 6's probes clear flags on a holding card as measured. |

## Round 2 disposition

| Review and finding | Status |
|---|---|
| `06-standard-titans-review-2.md` Major 1, grounded Titans still run or tread | Resolved. Every leg entry now requires both legs, and the validator enforces it. |
| Major 2, Abnormal ladder contradicted its canon reason | Resolved. The hooked rung now makes a failed Nape striker draw Attention, while reach and pain remain absent. |
| Major 3, Abnormal ceiling was not row against row | Resolved. OQ-103 and the 120,000-fight bar compare every row with its same-support twin. |
| Minor 4, hidden Abnormal values appeared in player text | Resolved. Those values and lone rows are in marked GM subsections. |
| Minor 5, ADR-0010 appeared to promise the reference lone rate for every table | Resolved by batch 3c. ADR-0010 and ADR-0014 now scope the rate to the reference table and promise a legal route. |
| Minor 6, the kill-routes sentence omitted knock-loose falls | Resolved. Section 6.1 names falls and their possible lethal Critical Injury. |
| Minor 7, Background Titans were said to be always standard | Resolved. The restriction now applies only to Background Titans generated by the interim setup table. |
| Minor 8, prose described effects absent from rows | Resolved. Swat and Crush prose now matches their effects. |
| Minor 9, behavior text contradicted Position requirements | Resolved. The four lines were rewritten and position-phrase lint added. |
| Minor 10, `roster.yaml` uses a glossary Avoid term | Still open as OQ-110. The proposed coordinated rename is sound. Counted as finding 1. |
| `06-standard-titans-review-2-codex.md` Minor 1, screen probe had an illegal horse state | Resolved. The model tracks mounted state and horse Position, applies horse wear, and passes its deterministic self-test. |

## Counts

- Critical: 0
- Major: 0
- Minor: 1
