# Chapters 1 to 5 decision conformance review, round 1 (Codex)

**Date:** 2026-09-14  
**Scope:** `docs/rules/01-core-rules.md` through `05-titan-engagement.md`; YAML in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`, and `data/engagement/`; the glossary, ADRs, batch 3 decisions, and the four named previous reviews. Chapter 6, `data/titans/`, and Chapter 6 open questions were excluded.

## Verdict

Batch 3 is largely present in prose and data. All 52 scoped YAML files parse, no direct list has a duplicate `id`, and no scoped chapter or YAML file retains a `PROVISIONAL` or `provisional` marker. Two contradictions remain. One is a lone-play failure created by OQ-81 itself; the other is Chapter 3's stale pre-batch-3 Grab contract. The OQ-97 clock parenthetical is also wrong even though Chapter 5 and its source YAML apply the arithmetic correctly.

| Chapter | Critical | Major | Minor |
|---|---:|---:|---:|
| Chapter 1 | 0 | 0 | 0 |
| Chapter 2 | 0 | 0 | 0 |
| Chapter 3 | 1 | 0 | 0 |
| Chapter 4 | 0 | 0 | 0 |
| Chapter 5 | 1 | 0 | 1 |
| **Total** | **2** | **0** | **1** |

Only findings still open in this round are counted.

## Findings

### 1. Critical. Chapter 5: escalating Break Attention can permanently remove the lone soldier's only legal route to the Nape

**Location:** Chapter 5, sections 5.6 and 5.13, especially `docs/rules/05-titan-engagement.md:431-452`, `:458-466`, and `:807-823`; `data/engagement/attention.yaml:171-205`; `data/engagement/tuning.yaml:527-556`; batch 3 OQ-79 and OQ-81 in `docs/rules/DECISIONS-2026-09-14.md:1126-1149`; ADR-0010.

**Problem:** ADR-0010 says a lone soldier gets past the hard Attention restriction with Break Attention. The OQ-81 escalation makes every successful decoy permanently raise the next need, while every usable decoy is finite. At Funding 3 the Squad has two flares; a lone soldier also has one horse and one cloak. Flares and the cloak are spent when declared, and a horse that succeeds leaves the engagement. Once those sources are gone, a surviving Titan that still has its Nape is a rules dead end: the lone soldier holds Attention, cannot strike the Nape, and cannot name a decoy for another Break Attention.

The decision's numerical justification does not measure the adopted rule. OQ-79 and OQ-81 cite a median of 4 rounds and 1.67 Titan cards, but those are `card_order_wait.no_escalation_means`. The adopted row is median 6, only 42.3% usable by round 4 and 60.8% by round 12, with 4.93 Titan cards through round 12. The rejected cap has 3.29 cards through round 12 and a 3.72-card uncensored mean; the decision reverses this comparison by treating the no-escalation 1.67 as the escalation result.

I also ran 200,000 favorable resource-aware trials with seed 14092027. The soldier reused the horse after failures, then had two flares and one cloak; Titan harm, gear wear, laming, and death were omitted, and every Nape attempt retained the published 13.1% success rate. Even on those favorable assumptions, only 48.240% obtained any usable Nape strike, 7.138% obtained two, 0.269% obtained three, and 7.313% killed the Titan before the route closed. A separate impossible-best-case model that granted all four successful decoys regardless of declaration costs still produced only 24.245% with two usable cuts and 4.039% with three. This contradicts OQ-81's claim that the lone line “keeps two or three cuts a fight.”

**At the table:** A Rookie succeeds with the horse but loses card order, succeeds with a flare and misses the Nape, then spends the second flare and cloak on failed Break Attention rolls. The Titan is alive, the soldier holds Attention, and the rules offer no action that can create another legal Nape strike. The GM must invent a decoy or end the scene, which both breaks play and contradicts ADR-0010.

**Fix options:**

1. Replace permanent per-Titan escalation with a bounded rule that never exhausts a lone soldier's route, then re-run both the lone card-order model and the squad screen model.
2. Keep escalation for screens but give the Attention holder a repeatable, priced escape that does not require an unspent decoy, and include its failures, costs, and Titan harm in the lone model.
3. Reopen the rejected cap or another anti-screen rule, compare alternatives on the same horizon and metric, and require the chosen rule to leave a legal lone path after every finite-resource history.

### 2. Critical. Chapter 3: section 3.7 still imposes the superseded Grab model and acceptance contract

**Location:** Chapter 3, section 3.7, `docs/rules/03-harm-and-mind.md:355-375`, especially lines 365, 367, and 369; section 3.12 at `:512-518`; Chapter 5 sections 5.9 and 5.13; ADR-0014 as amended by OQ-95.

**Problem:** Chapter 3 says its standing models use Break Free at 3 successes, quotes about 60% lone death, permits two different rescue structures, says a single near-one-third figure does not meet the target, and presents two-comrade results as an acceptance model. Chapter 5 now uses Break Free at 2 successes and reports 69.9% after a failed dodge or 73.1% with no dodge. More importantly, OQ-95 amended ADR-0014 so that “comrades close” specifically means one reference comrade in reach across the six witness cells. Chapter 5 correctly applies that definition at 28.7%, 33.4%, 39.1%, 34.1%, 39.7%, and 45.1%.

Chapter 3 therefore contradicts both the amended ADR and Chapter 5. The problem is not a harmless old sample: section 3.7 says what Chapter 5 “may use” and “must pass,” and section 3.12 still points readers to its two “permitted rescue structures.”

**At the table or in later drafting:** A maintainer following Chapter 3 can reject the decided one-comrade target as insufficient, restore Break Free 3, or tune a future Titan against the obsolete 60% model. That creates two incompatible conformance tests inside the same rulebook.

**Fix options:**

1. Replace section 3.7's models and rescue-contract paragraphs with the decided Break Free 2 results and OQ-95's one-comrade six-cell definition.
2. Remove the superseded model detail and point exclusively to Chapter 5 section 5.13 and `data/engagement/tuning.yaml` as the current measured source.
3. At minimum, change section 3.12's final pointer so it no longer calls the section 3.7 structures “permitted,” but this does not by itself cure the contradictory numbers above.

### 3. Minor. Chapter 5: OQ-97's fallback clock list does not add 2 to the first base clock

**Location:** Chapter 5 decision OQ-97, `docs/rules/DECISIONS-2026-09-14.md:1259-1271`, especially line 1267; Chapter 5 section 5.3; `data/engagement/engagement-setup.yaml:44-50`; `data/engagement/round.yaml:192-203`.

**Problem:** The setup table's non-empty clock results are 6, 4, and 4 with 8. Adding 2 produces 8, 6, and 6 with 10. Chapter 5 says only “lengthens by 2,” and `round.yaml` correctly spells out 8, 6, and 6 with 10, but the decision record says 6, 8, and 6 with 10. The decision and its applied source therefore disagree about the first two rows.

**At the table:** If the timed paper test triggers fallback 2, a maintainer applying the decision record literally leaves the first clock at 6, lengthens the second to 8, and produces a different encounter rate from the YAML.

**Fix:** Change OQ-97's parenthetical to “8, 6, and 6 with 10.”

## Reported conflict rulings

1. **OQ-81 escalation:** confirmed and more severe than the reported median mismatch. The chapter now quotes the reproduced 6-round median and 4.93 cards through round 12, but the decision rationale still uses the no-escalation 4-round and 1.67-card figures. Finite decoys can close the lone path completely, so this is Critical finding 1.
2. **OQ-97 clocks:** the drafter applied the arithmetic correctly. The error remains in the decision record, so this is Minor finding 3.
3. **Gas:** no finding. Independent runs of 1,000,000 canisters per case gave median 8 and mean 9.249 rounds without Push, and median 6 and mean 6.337 while Pushing every round. Rating is discrete, Chapter 4 identifies these as the closest whole-number medians, and the results remain consistent with “about 9” and “about 6.”

## ADR-0014 target rerun

The committed probes were run from temporary copies outside the repository.

| Target | Reproduced result | Judgment |
|---|---|---|
| Gas | Median 8, mean 9.249 without Push; median 6, mean 6.337 Pushing every round; 1,000,000 trials per case | Meets “about 9” and “about 6” |
| Prepared Squad against Medium | Median kill round 3; 62.6% by round 3; 73.2% by round 4; 12,000 fights | Meets target |
| Lone Nape strike after Break Attention | Rookie at Stress 1: 13.1%; Levi-grade at Stress 2: 47.4%; 100,000 trials per cell | Per-strike ADR-0014 target met; access path fails ADR-0010 as finding 1 describes |
| Grab, alone | 69.9% after a failed dodge; 73.1% without a dodge; 40,000 trials per cell | Meets about 2 in 3 |
| Grab, one comrade in reach | 28.7%, 33.4%, 39.1%, 34.1%, 39.7%, 45.1%; Stress 2, Grief 0 is 33.4%; 40,000 trials per cell | Meets amended target |

## Batch 3 application check

- OQ-74 to OQ-78, OQ-80, and OQ-82 to OQ-90 are converted from provisional blocks to decided design notes and matching YAML tags. The card procedure, body parts, Openings, Grab sequence, Read, Background Titans, engagement end, Squad Tactics, and Chapter 1 to 4 pointers agree except where finding 2 identifies stale Chapter 3 text.
- OQ-79's amended per-strike band is consistent in ADR-0014, Chapter 5, and `tuning.yaml`. OQ-81's holder, other-soldier, Grab, and escalation needs match in Chapter 2, Chapter 5, `action-catalog.yaml`, and `attention.yaml`, but the decided mechanic fails as finding 1 describes.
- OQ-93's interim issue replaces a worn horse in Chapter 4, `standard-issue.yaml`, and `items.yaml`.
- OQ-94 closes the Talent list by exclusion in ADR-0014, Chapters 2 and 3, and Squadmate data. Its register and figure corrections are present.
- OQ-95's one-comrade definition matches ADR-0014 and Chapter 5 but not Chapter 3, as finding 2 describes. OQ-96 and OQ-98's accepted Jam policy, baseline policies, sensitivity rows, and future simulator specification are present.
- OQ-97's standing Wings, one Positions record, tracker cadence, time bounds, test, and fallbacks are present except for finding 3's decision-record typo.
- All nine OQ-99 corrections are present in their named prose and data locations.

## Previous Major and batched Minor findings

| Previous finding | Status this round |
|---|---|
| Chapter 5 review 3, Major 1: adjacent Squadmates bypass Break Attention | **Resolved.** Holder-only need plus escalation removes the position bypass. Finding 1 is a new consequence of that resolution. |
| Chapter 5 Codex review 3, Major 1: lone Rookie target out of bounds | **Resolved.** OQ-79 amended the per-strike target and the 13.1% result is inside it. |
| Chapter 5 Codex review 3, Major 2: Grab target models one comrade, not the reference Squad | **Resolved.** OQ-95 defines the target as one reference comrade and requires the Squad share only as a report. |
| Chapter 5 Codex review 3, Major 3: decoy screens suppress too much Titan play | **Resolved as decided.** The current screen row is 0.661 cards and 0.47 Critical Injuries per fight against 0.833 and 0.65 with helpers. Finding 1 is the separate lone-play regression. |
| Chapter 5 Codex review 3, Major 4: incomplete ADR-0014 reference simulation | **Resolved as a chapter decision.** OQ-98 defines the baseline, sensitivity rows, and full simulator debt. This review does not re-litigate that accepted staging. |
| Chapter 5 Codex review 3, Major 5: unearned 12 to 20 minute target | **Resolved as a chapter decision.** OQ-97 makes it a timed test with pass bounds and pre-decided fallbacks. |
| Chapters 1 to 4 review 2, Major 1: worn interim horse cannot be restored | **Resolved.** OQ-93 replaces a worn or lame horse at interim issue, with decline preserved. |
| Chapter 5 review 3, Minor 2: Tempo 2 failed-dodge turn debt | **Resolved.** OQ-99 item 1 refunds the compared dodge turn. |
| Chapter 5 review 3, Minor 3: riderless-horse Position wording | **Resolved.** OQ-99 item 2 gives prose and data the same comparison. |
| Chapter 5 review 3, Minor 4: two Positions records and missing PC Squad row | **Resolved.** OQ-99 item 3 makes the Squad row authoritative for every soldier and the character field a mirror. |
| Chapter 5 review 3, Minor 5: retreat names Lift Comrade | **Resolved.** OQ-99 item 4 removes it and sends carriers through option 1. |
| Chapter 5 review 3, Minor 6: Squad Tactics tuning statement stale | **Resolved.** OQ-99 item 5 distinguishes reference and sensitivity rows. |
| Chapter 5 review 3, Minor 7: Large “twice harm” wording | **Resolved.** OQ-99 item 6 reports twice the Critical Injuries and seven times the deaths. |
| Chapter 5 Codex review 3, Minor 1: Opening glossary permits self-spend | **Resolved.** OQ-83 and OQ-99 item 7 forbid the creator from spending it. |
| Chapter 5 Codex review 3, Minor 2: Grab tracker cadence | **Resolved.** OQ-99 item 8 adds every counted victim-turn update. |
| Chapter 5 Codex review 3, Minor 3: “behind” returns in anchor text | **Resolved.** OQ-99 item 9 uses the decided Blind Spot wording. |
| Chapters 1 to 4 review 2, Minor 2: unclassified Talent rolls | **Resolved.** OQ-94 item 1 closes the list by exclusion. |
| Chapters 1 to 4 review 2, Minor 3: stale register summaries | **Resolved.** OQ-94 item 2 updates OQ-25, OQ-59, OQ-70, and OQ-72. |
| Chapters 1 to 4 review 2, Minor 4: bookkeeping and figure slips | **Resolved.** OQ-94 item 3 corrects the counts, introduction, 20.7%, and 10.6% statements. |
| Chapters 1 to 4 Codex review 2, Minor 1: stale OQ-73 gas median and Major count | **Resolved in the scoped rules and decision record.** OQ-94 items 3 and 4 correct them; the batch assigns the `PROGRESS.md` row to the orchestrator. |

## Checks that passed

- No new prose/YAML mismatch was found in the Chapter 1 turn-debt refund, Chapter 2 action catalog, Chapter 4 interim issue, Chapter 5 Attention, Grab, round, retreat, Position, Openings, Read, or Squad Tactics rules beyond the findings above.
- The glossary's Break Attention, Opening, Blind Spot, Gear Dice, Stress Dice, Covering, Help, Reaction, Grabbed, Squadmate, and Standard Issue entries agree with the amended ADRs and operative rules.
- Behavior D6 rows, setup D6 rows, Grab steps, and tracked state are complete and deterministic. No new GM-choice gap was found.
- Forward references to Chapter 6 were treated as expected and were not reviewed.
