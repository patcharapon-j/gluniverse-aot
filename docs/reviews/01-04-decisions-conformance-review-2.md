# Chapters 1 to 4: decisions conformance review, round 2

Reviewed:

- `docs/rules/01-core-rules.md`, `02-character-creation.md`, `03-harm-and-mind.md`, and `04-gear.md`.
- Every YAML file in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, and `data/gear/`.

Checked against:

- `docs/rules/DECISIONS-2026-09-14.md`:
  - *Batch 2* (OQ-59 to OQ-73), with its `Revised by batch 2:` and `Revised by batch 2b:` lines.
  - *Batch 2b* (Majors 1 and 2, Minors 5, 6, and 8, and its chapter impacts).
  - The Chapter 4 to 6 constraints.
- ADR-0001 to ADR-0015, with ADR-0014's body as rewritten in batch 2b, and `CONTEXT.md`.
- `docs/rules/OPEN-QUESTIONS.md`: OQ-01 to OQ-73, OQ-91, and OQ-92. OQ-74 to OQ-90, `docs/rules/05-titan-engagement.md`, and `data/engagement/` were not reviewed.
- Both round 1 files: `docs/reviews/01-04-decisions-conformance-review-1.md` and `01-04-decisions-conformance-review-1-codex.md`.

I did not read the parallel Codex review of this round.

Every figure below is exact unless marked otherwise. A pure Python script in the session scratchpad, outside the repository (`wof_r2_exact.py`), enumerates dice faces and runs dynamic programs over current rating and Stress, plus a Markov chain over Gas Rating. Nothing was sampled. The appendix gives the models. All 37 YAML files under the five directories parse (Ruby Psych).

Severity:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**No Critical findings.** Batch 2b is applied completely and correctly in prose and YAML.

- **Findings closed.** Every Major and Minor from both round 1 files is resolved.
- **ADR-0014.** Its body now reads word for word as the batch 2b decision gives it.
- **Standard Issue.** The horse ladder is 1, 1, 2, 2, 2, 3. A full issue replaces worn ODM Gear and worn horses, and the decline covers each exchange.
- **No-Talent sentence.** Chapters 2, 3, and 4 and `squadmates.yaml` all carry it.
- **Figures.** Every batch 2b figure is within 0.25 points of exact.
- **Gas target.** It is still reachable as amended: medians of 8 and 6 rounds, mean 9.25 with no Push.

**One Major**, from batch 2b's rating 2 horse meeting the unchanged interim issue (finding 1):

- The interim issue is the only issue Phase 1 play has. It replaces a lame horse but keeps a worn one, and no Phase 1 rule restores a worn horse.
- A horse worn once therefore stays at 1 of 2 for the rest of Phase 1 play. Its dodge is back to the rating 1 figures OQ-92 moved away from.
- It also rewards letting a horse go lame, the incentive batch 2b removed from the full issue.
- 40.8% of three-round mounted fights at Severity 3 leave the horse worn but not lame.

**Three Minors:**

- rolled entries that ADR-0014's two Talent lists leave unclassified, the Death Roll among them (finding 2);
- OPEN-QUESTIONS decision summaries that predate batch 2b (finding 3);
- bookkeeping and figure slips (finding 4).

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 1, Core Rules | 0 | 0 | 0 |
| Chapter 2, Character Creation | 0 | 0 | 0 |
| Chapter 3, Harm and Mind | 0 | 0 | 1 |
| Chapter 4, Gear | 0 | 1 | 2 |
| **Total** | **0** | **1** | **3** |

A finding that touches an ADR, the decisions file, OPEN-QUESTIONS, or several chapters is counted under the chapter it most affects, and its location names every file involved. Finding 2 also names Chapter 2 and ADR-0014. Finding 3 also names Chapters 2 and 3.

---

## Round 1 findings: status

| Finding | Status | Evidence |
|---|---|---|
| Opus 1 (Major): two dodge baselines | **Resolved** | ADR-0014's body now reads "the dodge, Fly, Break Attention, Ride, and Read carry no Talent dice". The same sentence is in Chapter 2 sections 2.2 and 2.10, Chapter 3 section 3.2, and `squadmates.yaml` (`matches_reference_build` and the `templates` comment). Chapter 4 names "no dodge Talent" in section 4.3's gas note, both section 4.9 notes, and the introduction's Chapter 5 list. The Jam test and both sides of the Chapter 6 ladder name full builds. The Flier template is reported in Chapter 3 section 3.2. Finding 2 is a narrower gap in the same sentence. |
| Opus 2 (Major): the horse dodge is dominated | **Resolved** at full current rating | `standard-issue.yaml` `by_funding.horse_rating` is 1, 1, 2, 2, 2, 3, and its comment matches. The section 4.5 OQ-25 note states parity. The section 4.9 reference-builds note gives the lame figures. The example rows read `Hr 2/2`, and the `sheet-fields.yaml` example reads `Hr 2/2 M`. Finding 1 is how parity is lost once a horse is worn. |
| Opus 3 (Minor): horse Break Attention reads a bare Position | **Resolved** | "compared relative to the Focus Titan recorded with the horse's Position" is in section 4.1, section 4.5, `items.yaml` `horse.counts_as_not_had`, and `horses.yaml` `gear_dice.break-attention`. |
| Opus 4 (Minor): early Gas Roll edges | **Resolved** | Chapter 1 section 1.5 adds "unless that soldier's Gas Roll for the round has already been made (Chapter 4, section 4.3)". Rules 1 and 3 in section 4.3 and in `odm-gear.yaml` `canister_removed` add "and has not yet made that round's Gas Roll", and so do `carrying.yaml` `passing_items.gas_roll`, `taking_items.effect`, and `left_for_the_squad`. |
| Opus 5 (Minor): a full issue rewards leaving a Jam | **Resolved** for the full issue | Section 4.9 steps 1, 4, and 6 and the OQ-59 note; `standard-issue.yaml` `receiving.steps` and `interim_issue.differences`; `items.yaml` `restored_by` for ODM Gear and the horse; section 4.1 *Restoring*; section 4.2 and `odm-gear.yaml` `jam.ends`. Finding 1 is the same incentive for horses at the interim issue. |
| Opus 6 (Minor): ADR-0014's body is stale | **Resolved** | The body paragraph and the closing `## Amended` paragraph match the batch 2b text word for word, and the two old body sentences are gone. Section 4.9 reads "The Veteran's ODM Gear and horse ratings equal the Rookie's", and the Chapter 6 constraint quotes both sides of the ladder. |
| Opus 7 (Minor): Chapter 2 provenance | **Resolved** | `talents.yaml` `sure-seat.decided: [OQ-28, OQ-71]`. The section 2.10 note now names the four Talent rolls instead of "every roll". |
| Opus 8 (Minor): wording, figure, and bookkeeping slips | **Resolved** | `canister_removed` now reads "Its dice are set by gas_roll.dice (below)". Section 4.7 reads "after any Gas Roll the pass makes". The rating 1 wording is "fails ... against two Titans ... just under it against one", in section 4.9 and in OQ-72's *Why*. The rating 3 "only when short" row reads 10.3% and 21.3%. The introduction lists OQ-59 to OQ-69, OQ-72, and OQ-73. Minor 8 items 1 to 13 are all present in the decisions file (preamble, Round-3 notes, Counts, OQ-25, OQ-58, OQ-59, OQ-70, OQ-72, Chapter 5 and 6 constraints, batch 2 intro, and the consistency check). `PROGRESS.md` still matches the latest review round, which is the orchestrator's to update. Finding 4 covers a new slip in the rewritten Counts line. |
| Codex 1 (Minor): garbled `canister_removed` sentence | **Resolved** | As Opus 8. |

## Batch 2b: application check

| Ruling | What it requires of Chapters 1 to 4 | Status |
|---|---|---|
| Major 1 | Chapter 2 sections 2.2 and 2.10 (note and stat block) say "Talent 1 in the Talent that names the Nape strike, the Body Part strike, Break Free, or Treat Injury; no Talent dice on the dodge, Fly, Break Attention, Ride, or Read" | Applied |
| Major 1 | `squadmates.yaml` `matches_reference_build` and the `templates` comment say the same | Applied |
| Major 1 | Chapter 3 section 3.2: the same sentence, the Flier report (38.0% and 66.6%), and section 3.7 left unchanged | Applied |
| Major 1 | Chapter 4 sections 4.3 and 4.9 say "no dodge Talent", with the full build in the Jam test | Applied |
| Major 2 | `by_funding.horse_rating` and its comment | Applied |
| Major 2 | The section 4.9 `by_funding` and reference-builds sentences (10.5% and 22.6%) and the section 4.5 parity note | Applied (the 10.5% is taken up in finding 4) |
| Major 2 | Example rows `Hr 2/2 @Distant A` and `Hr 2/2 M`, and the `sheet-fields.yaml` example | Applied |
| Minor 5 | Steps 1, 4, and 6 replace worn items and decline them | Applied |
| Minor 5 | The interim issue is unchanged, with the narrower horse test stated | Applied (finding 1) |
| Minor 5 | `items.yaml` `restored_by` for ODM Gear and the horse | Applied |
| Minor 6 | ADR-0014's body and closing paragraph | Applied, word for word |
| Minor 6 | The section 4.9 Veteran sentence | Applied |
| Minor 8 | Items 1 to 13 in the decisions file | Applied (finding 4 on item 3's wording) |

**Batch 2 re-check.** Every OQ-59 to OQ-73 impact that round 1 found applied is still in place. The only changes are the ones batch 2b ordered: OQ-59's worn-item replacement and horse ladder, OQ-70's narrowed Talent sense, and OQ-72's horse ladder.

- No `PROVISIONAL` block, `provisional:` tag, ammo kind, "hard ride", or unconditional "wears the horse" has come back.
- Nowhere in the four chapters, their YAML, the ADRs, or the glossary does a horse read as rated 1 at Funding 3.
- ADR-0015's amended wear sentence, glossary Standard Issue, and glossary Down agree with the chapters.

## Checks that passed

**ADR-0014 gas target** (exact Markov chain; the chapter's figures in brackets):

| Full Gas Rating | Gas Roll | Mean | Median | 10th to 90th | Empty by round 4 | Empty by round 6 | Empty by round 8 | Lasts 9 or more |
|---|---|---|---|---|---|---|---|---|
| 3 | two dice | 9.25 (9.25) | 8 (8) | 4 to 16 (4 to 16) | 13.5% (13.5) | 32.3% (32.3) | 51.3% (51.3) | 48.7% (48.7) |
| 3 | three dice | 6.33 (6.33) | 6 (6) | 3 to 11 (3 to 11) | 32.3% (32.3) | 59.7% (59.7) | 78.8% | 21.2% |
| 2 | two / three dice | 6.25 / 4.33 (6.25 / 4.33) | 5 / 4 (5 / 4) | 2 to 11 / 2 to 8 | 39.5% / 61.9% | | | |
| 4 | two / three dice | 12.25 / 8.33 (12.25 / 8.33) | 11 / 8 (11 / 8) | 6 to 20 / 4 to 13 | 3.1% / 12.5% | | | |

- **Medians.** Gas Rating 3 gives 8 and 6 against "about 9" and "about 6". Rating 2 undershoots both halves and rating 4 overshoots both.
- **Where the 8 is accepted.** ADR-0014's OQ-72 `## Amended` paragraph states it, so the target is reachable as amended.
- **Batch 2b.** Nothing in batch 2b touches gas. A horse dodge makes no Gas Roll, and the no-Talent reading is the one the Rookie gas figures already used.

**Reference dodges** (Push when short, Stress Responses not applied; exact, with the quoted figure in brackets):

| Build | Severity 2 | Severity 3 | Severity 4 |
|---|---|---|---|
| Lone Rookie: Agility 3, ODM Gear 2, Stress 1, no Talent | 49.8% (49.7) | 20.7% (20.7 batch 2b; 20.6 section 4.9) | |
| Same, ODM Gear or horse at 1 current | 43.9% (44.0) | 16.0% (16.0) | |
| Same, ODM Gear 3 | | 25.5% (25.6) | |
| Rookie with one Help die | | 29.2% (29.2) | |
| Rookie with Slip Away 1, alone / with Help | 58.9% | 29.2% (29.2) / 37.8% (37.7) | |
| Lone Veteran: Agility 3, ODM Gear 2, Stress 2 | 54.2% (54.0) | 26.1% (26.1) | |
| Flier template: Agility 4, Slip Away 1, ODM Gear 2, Stress 1 | 66.5% (66.6) | 37.8% (38.0) | |
| Lone Levi-grade: Agility 4, ODM Gear 3, Stress 2 | | 38.4% (38.6) | 17.3% (17.2) |

The Chapter 6 ladder holds on the named builds: a supported Rookie dodges Severity 3 29.2% of the time against a lone Veteran's 26.1%. The Veteran's Severity 2 figure (54.0 against 54.2) is the one quoted figure more than 0.2 points from exact, which is within the stated sampling.

**Jam, or lame for a horse of the same rating** (Stress starting at 1 and rising on each Push, Push when short; section 4.9's rising-Stress table in brackets):

| Rating | Severity | By round 3 | By round 5 | Two Titans, by round 3 |
|---|---|---|---|---|
| 1 | 2 | 27.8% (27.9) | 38.0% (38.2) | 41.9% (41.8) |
| 1 | 3 | 31.5% (31.7) | 42.7% (42.8) | 46.9% (46.8) |
| 1 | 4 | 32.2% (32.3) | 43.9% (44.1) | 48.3% |
| 2 | 2 | 8.3% (8.3) | 14.9% (14.9) | 17.9% (17.9) |
| 2 | 3 | 10.56% (10.5) | 18.9% (18.9) | 22.6% (22.6) |
| 2 | 4 | 11.1% (11.2) | 20.0% (20.0) | 24.0% |

The drafter's 10.5% for a rating 2 horse going lame matches the table. Batch 2b's 10.6% matches the exact 10.56%. Both are within 0.1 point, so neither figure is wrong (finding 4 suggests one figure throughout).

**Other checks:**

- **Chapter 4 worked example.** It is correct against the YAML:
  - Jonas: `ODM 1/2`, one Gear Die, a Push, a Jam, a high fall of 4 + 2 = 6 for 2 damage, and a three-die Gas Roll that takes 3 to 1.
  - Horse rows: `Hr 2/2 @Distant A` for Jonas, and `Hr 2/2 M` then `Hr 2/2 @Distant A` for Ilse.
  - Round 2: Field Repair takes Jonas from 0 to 1 of 2.
  - Loads: 3 + 5 + 3 = 11 against 7, or 6 with Strong Back.
  - Supply line: `Supply | Rations 0 | Flares 2 | Medical 2`.
- **ADR-0003.** Item 12: the act lists in sections 1.10, 3.17, and 4.13 are unchanged, and batch 2b adds no act. Item 13: no batch 2b state forbids a Push, Help, Cover, or Reaction. No batch 2b rule rests on GM discretion.
- **Glossary.** Standard Issue, Down, Gas Roll, Jam, Reaction, and Gear Dice agree with the chapters. The Gas Roll entry's "three after a Pushed roll that used ODM Gear" is a summary; Chapter 1 carries the early-roll exception. The batch 2b text adds no `_Avoid_` term.
- **Chapter 5 and 6 constraints.** Both name the full Rookie build, and the Chapter 5 constraint adds the mounted clause. Finding 1 qualifies "dodges the same".

---

## Findings

### 1. Major. Chapter 4: the interim issue keeps a worn rating 2 horse, and no Phase 1 rule restores it, so one point of wear undoes OQ-92's parity for the rest of Phase 1 play and makes a lame horse better than a worn one

**Location:**

- **Chapter 4:**
  - Section 4.9, *When it is received*, the interim issue sentence: "it replaces a horse only if the soldier has none, it is lame, or its rating is below the row's, so a worn horse rated at least the row's is kept as it is".
  - Section 4.9, *Design note (OQ-59; decision batch 2b)*: "keeping worn ODM Gear and worn horses rated at least the row's, so that wear still carries between sessions".
  - Section 4.5, *Design note (OQ-25; decision batch 2b)*: "a mounted soldier's dodge has the same pool with either item".
  - Section 4.5, *Lame*: "No other Phase 1 rule restores a horse".
  - Section 4.8, *Target*: a horse cannot be repaired.
- **YAML:**
  - `data/gear/standard-issue.yaml`: `interim_issue.differences` (the `horse` row) and `interim_issue.why_narrow`.
  - `data/gear/items.yaml`: `horse.restored_by`.
  - `data/gear/horses.yaml`: `lame.ends` and `gear_dice.break-attention`.
- **`docs/rules/DECISIONS-2026-09-14.md`:**
  - *Batch 2b*, Minor 5: "The interim issue is unchanged ... a horse when missing, lame, or rated below the row".
  - *Batch 2b*, Major 2.
  - The Chapter 5 constraint: "a mounted Rookie's horse is rated 2 and dodges the same".

**Problem:**

- **Before batch 2b.** A Funding 3 horse was rated 1, so it was either 1 of 1 or lame. The interim issue replaced a lame horse, so every horse began every session at full.
- **After batch 2b.** The horse is rated 2 and has a worn state, 1 of 2. The interim issue keeps it. Field Repair cannot target a horse, and no other Phase 1 rule restores one.
- **Only one issue in play.** Until the Expedition rules exist, the interim issue is the only issue Phase 1 play has. A horse worn once therefore stays at 1 of 2 until it goes lame.
- **The ODM Gear comparison.** Worn ODM Gear is also kept by the interim issue, but the end-of-fight care window's Field Repair restores it. That is what "wear still carries between sessions" was written for: the rare harness the window could not fix. For a horse, the wear carries for good.

At 1 of 2 the horse rolls one Gear Die, the pool OQ-72 and OQ-92 moved away from:

| Mounted Rookie (Agility 3, Stress 1, Push when short) | Horse at 2 of 2, or ODM Gear 2 | Horse at 1 of 2 |
|---|---|---|
| Dodge, Severity 3 | 20.7% | 16.0% |
| Dodge, Severity 2 | 49.8% | 43.9% |
| Lame or Jammed within 3 rounds, one Titan, Severity 3 | 10.6% | 31.5% (the rating 1 rate OQ-72 rejected) |
| Lame or Jammed within 3 rounds, one Titan, Severity 2 | 8.3% | 27.8% |

Normal play produces the worn state often. A horse rated 2 at full, dodging every round with Stress rising from 1:

| Severity | Rounds | Still 2 of 2 | Worn, 1 of 2 | Lame |
|---|---|---|---|---|
| 2 | 1 | 80.0% | 18.0% | 2.0% |
| 2 | 3 | 55.9% | 35.8% | 8.3% |
| 3 | 1 | 75.6% | 22.1% | 2.3% |
| 3 | 3 | 48.7% | 40.8% | 10.6% |
| 3 | 5 | 34.6% | 46.5% | 18.9% |

Two decided texts stop holding once a horse is worn:

- **Batch 2b Minor 5's incentive.** It was ruled against for the full issue: an issue that replaces an item at 0 but keeps a worn one rewards driving the item to 0. The interim issue keeps that shape for horses. A lame horse returns next session at 2 of 2, and a worn one never does.
- **The saddle choice.** It is dominated again for that soldier, as it was before batch 2b, so Sure Seat and Loose the Horse lose their point.

A soldier can lame their own horse with no fall. `horses.yaml` gives the horse's Gear Dice to Break Attention while it holds the soldier's Position, and a Pushed roll made with the horse wears it, whether or not the soldier is mounted.

**Scenario:**

1. A player character Rider at Funding 3 makes three mounted dodges at Severity 3 in the session's Titan Engagement. One Pushed dodge shows a 1 on a Gear Die, and her row reads `Hr 1/2`.
2. The care window offers nothing for the horse. The next session's interim issue keeps it at 1 of 2.
3. From then on she dodges from the saddle with ODM Gear, 20.7% against 16.0%, and her Sure Seat and Loose the Horse go unused.
4. Her player learns the trick. Late in a fight, dismounted at the Position her horse holds, she declares Break Attention with the horse as its gear item and Pushes. The single Gear Die shows 1 once in 6 Pushes, and each time it does the horse goes lame with no fall.
5. At the next session's interim issue she receives a horse at 2 of 2.

**Fix options:**

1. The interim issue's horse step reads like the full issue's: it also replaces a worn horse, and the decline still applies. ODM Gear keeps the narrow rule, since Field Repair restores it in the care window. This changes `interim_issue.differences`, `why_narrow`, `items.yaml` `horse.restored_by`, section 4.1 *Restoring*, the interim sentence in section 4.9, and the OQ-59 note. It is a data and wording change with no new mechanic.
2. Give horses a care-window restore, for example 1 current rating per care window held when a Titan Engagement ends. This is a new rule, and it widens Field Repair's role, which OQ-66 kept to ODM Gear and tool kits.
3. Keep the rule, and record the trade under OQ-59 and OQ-92 with the figures above. Reword the Chapter 5 constraint to "a mounted Rookie's horse at 2 of 2 dodges the same", and give Chapter 5's simulator a horse carried worn between fights.

### 2. Minor. Chapter 3: ADR-0014's two Talent lists leave the Death Roll, Rally, Field Repair, and the Expedition rolls unclassified

**Location:**

- **ADR-0014, body:** "Talent applies to the Nape strike, the Body Part strike, Break Free, and Treat Injury, with the dice Talent that names the roll; the dodge, Fly, Break Attention, Ride, and Read carry no Talent dice."
- **Chapter 3,** section 3.2, *Reference builds*, which also says "the Veteran's Talent 2 and the Levi-grade soldier's Talent 3 apply to the same rolls".
- **Chapter 3,** the OQ-43 design note on the Death Roll: 42.1%, 51.8%, and 59.8% with 3, 4, and 5 dice.
- **Chapter 2:** section 2.2, the OQ-19 note; section 2.10, the stat block and the OQ-29/OQ-58/OQ-70 note; section 2.7, the OQ-28 note, which lists Hard to Kill as a simulator check.
- **`data/character/squadmates.yaml`:** `stat_block.matches_reference_build` and the `templates` comment.
- **`docs/rules/DECISIONS-2026-09-14.md`:** OQ-70 `Revised by batch 2b` ("narrowed to") and *Batch 2b* Major 1.

**Problem:**

- **Two explicit lists.** The sentence names four rolls that carry Talent dice and five that carry none.
- **Rolls in neither list.** The Action Catalog has other rolled entries with a dice Talent that ADR-0014's targets can reach:
  - `death-roll` (Hard to Kill), in the PC death target;
  - `rally` (Steady Voice), which clears Stress Responses in a fight;
  - `field-repair` (Gearwright), in OQ-66's window case reported beside the PC death target;
  - `survive`, `endure`, `spot`, and `size-up` (Fieldcraft, Long Haul, Keen Eyes, Judge of Character), which the Expedition targets will likely call for;
  - `fight` and `block` (Hand to Hand).
- **Which reading is meant.** The decisions file says OQ-70's wording was "narrowed", which supports "no Talent anywhere else". But the ADR spells out a second, closed no-Talent list, and that makes an unlisted roll read either way.
- **What is at stake.** For the Death Roll it is one die. With no penalty, Strength 4 succeeds 51.8% of the time, and Strength 4 with Hard to Kill 1 succeeds 59.8%.
- **Where the intent shows.** Chapter 2's OQ-28 note checks Hard to Kill against the PC death target as an addition, which implies the baseline has none. The ADR does not say so.

This is round 1's Major 1 in a smaller form: a split baseline created by wording. It is Minor because the decided texts lean toward one reading and no chapter uses the other.

**Scenario:**

1. The simulator's author codes the Expedition PC death target. The Rookie's lethal Critical Injury calls for Death Rolls.
2. `death-roll` is in neither list, so they read "Talent 1" in the body's build line and give the Rookie Hard to Kill 1. Every Death Roll gains a die.
3. The PC death target comes out low, and they ask Chapter 3 to raise a Death Roll penalty.
4. A second author, reading "narrowed" in the decisions file, measures the same target with no Talent and finds it on target.

**Fix options:**

1. In ADR-0014's body, and in the restatements in Chapters 2 and 3 and `squadmates.yaml`, write "... and Treat Injury, with the dice Talent that names the roll. No other roll a target measures carries Talent dice, including the dodge, Fly, Break Attention, Ride, and Read."
2. Or extend the no-Talent list by name: the Death Roll, Rally, Field Repair, and every roll the Expedition rules add, unless a target names a Talent.

### 3. Minor. Chapter 4: the OPEN-QUESTIONS decision summaries for OQ-59, OQ-70, and OQ-72 predate batch 2b, and OQ-70's still states the withdrawn reading

**Location:**

- `docs/rules/OPEN-QUESTIONS.md`:
  - OQ-59, `Decision`: "a soldier may decline the exchange of Jammed ODM Gear or a lame horse".
  - OQ-70, `Decision`: "Talent 1 in the Talent that names each measured roll".
  - OQ-72, `Decision`: ODM Gear only.
  - OQ-25, `Decision`.
- OQ-91 and OQ-92 list these entries under *Related*, but none of them points back.
- Compare the `Revised by batch 2b:` lines under OQ-25, OQ-59, OQ-70, and OQ-72 in `DECISIONS-2026-09-14.md`.
- Chapters 2 and 3 carry OQ-70's current wording.

**Problem:**

- **The decisions file is current.** It records each batch 2b revision on the entry it revises.
- **The register is not.** Its one-line summaries do not, and OQ-70's summary states the reading batch 2b withdrew. That reading gives the reference Rookie Slip Away, Wirework, and Lure, and it is the one round 1's Major 1 traced the split to.
- **OQ-59 and OQ-72.** Their summaries omit the horse ladder and the replacement of worn items that Chapter 4 now applies.
- **Why it matters.** Chapters cite the register as (OQ-nn), so the register is where a reader lands first.

**Scenario:**

1. The Chapter 6 drafter follows Chapter 2's "(OQ-58, OQ-70)" citation to OPEN-QUESTIONS.
2. They read that the reference Rookie has Talent 1 in "each measured roll", and they re-measure the Severity ladder with Slip Away 1.
3. They get 37.8% for the supported Rookie against the constraint's 29.2%.

**Fix options:**

1. Append to each of the four `Decision` lines "Revised by batch 2b (OQ-91)" or "(OQ-92)", with the one-clause change. OQ-70: "narrowed to the Nape strike, the Body Part strike, Break Free, and Treat Injury". OQ-59: "horses 1, 1, 2, 2, 2, 3; a full issue also replaces worn ODM Gear and horses". OQ-72: "horses on the same ladder". OQ-25: "parity restored by rating horses as ODM Gear".
2. Or rewrite OQ-70's summary to the current rule and add a *Related* pointer from OQ-25, OQ-59, OQ-70, and OQ-72 to OQ-91 and OQ-92.

### 4. Minor. Chapter 4: bookkeeping and figure slips

**Locations and problems:**

- **`DECISIONS-2026-09-14.md`, preamble *Counts* line.** It reads "the four batch 2b rulings; all 73 entries are marked Decided in OPEN-QUESTIONS.md". OQ-91 and OQ-92 are register entries marked Decided that record two of those rulings. The decided entries are OQ-01 to OQ-73, OQ-91, and OQ-92, which is 75, while OQ-74 to OQ-90 are open. This is Minor 8 item 3's exact text, written before OQ-91 and OQ-92 were numbered.
- **Chapter 4, introduction.** It reads "Decision batch 2b revised three of them". "Them" means this chapter's own entries, and batch 2b revised two of those, OQ-59 and OQ-72. The third revision it lists, no Talent dice, revises OQ-70 (Chapters 2 and 3).
- **Chapter 4, section 4.9.** The same two figures are quoted differently in different places:
  - *OQ-72 note:* the lone Rookie dodges Severity 3 "20.6%". Batch 2b, the Chapter 5 and 6 constraints, and the decisions file's Major 1 text say 20.7% for the same build. The exact figure is 20.69%.
  - *Reference-builds note:* a rating 2 horse goes lame "10.5%" of the time, where batch 2b says 10.6%. The exact figure is 10.56%, and the 10.5% table row is a 200,000-run sample.
  - *OQ-72 note:* "Rating 2 gives about 11% and 23%", beside its own table's 10.5% and 22.6%.
  
  None is wrong by more than 0.1 point, but a reader cross-checking the constraints sees three values for two figures.

**Scenario:** A maintainer reads the Counts line to see how many register entries remain open before Chapter 6. They count 73 decided, miss OQ-91 and OQ-92, and report two phantom open entries. Separately, a Chapter 5 reviewer checking the Severity baseline against Chapter 4 reads 20.6% and the constraint's 20.7%, and spends a simulation run finding out whether the builds differ.

**Fix options:**

1. The decider changes the Counts line to "... and the four batch 2b rulings (OQ-91 and OQ-92 record the two Majors); OQ-01 to OQ-73, OQ-91, and OQ-92 are marked Decided in OPEN-QUESTIONS.md."
2. In Chapter 4, write "Decision batch 2b revised two of them and ADR-0014's reference builds: ...". Quote 20.7% in the section 4.9 OQ-72 note. Either quote the exact 10.6% for the lame figure (and re-run the table row exactly), or keep 10.5% and say "about 11%" consistently.

---

## Appendix: models

All figures are exact, from `wof_r2_exact.py` in the session scratchpad, which is not committed.

**Dice pool.**

- **Pool:** base dice are the attribute plus Talent plus Help. Gear Dice are the item's current rating. Stress Dice are the soldier's Stress.
- **Roll:** each die is enumerated as 6, 1, or other.
- **No Push** if any Stress Die shows 1.
- **Push when short:** a Push happens only when the roll has fewer successes than it needs.
- **Push:** adds one Stress Die, and re-rolls base and Stress Dice not showing 6 (binomial). Gear Dice keep their faces.
- **Wear:** the number of Gear Dice showing 1 on a Pushed roll.
- **Not applied:** Stress Responses, Covering, turn debt, Sure Seat, and Well-Kept Rig.

**Jam and lame.**

- **State:** a dynamic program over (current rating, Stress), with Stress starting at 1 and rising by 1 on each Push.
- **Rounds:** one dodge a round against one Titan, or two a round against two, with Stress carried between them.
- **At 0:** Jammed or lame. The worn-horse table in finding 1 reports the distribution of current rating at the end of the stated rounds, with lame counted when it first happens.
- **Horse at 1 of 2:** it rolls exactly as rating 1 from full, so the rating 1 rows apply.

**Gas target.**

- **Model:** a Markov chain over Gas Rating with d dice a round.
- **Lasts:** the round whose Gas Roll brings the rating to 0.
- **Median:** the smallest round with P(empty) of 50% or more. The mean sums P(not yet empty) over rounds.

**Death Roll.** With no penalty and no Push, the chance of at least one 6 on n dice is 1 − (5/6)^n: 51.8% for 4 dice and 59.8% for 5.
