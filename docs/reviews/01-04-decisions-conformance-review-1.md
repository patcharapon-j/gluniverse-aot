# Chapters 1 to 4: decisions conformance review, round 1

Reviewed:

- `docs/rules/01-core-rules.md`, `02-character-creation.md`, `03-harm-and-mind.md`, and `04-gear.md`.
- Every YAML file in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, and `data/gear/`.

Checked against:

- `docs/rules/DECISIONS-2026-09-14.md`, especially *Batch 2* (OQ-59 to OQ-73), its chapter impacts, the `Revised by batch 2:` lines on OQ-25, OQ-28, OQ-39, and OQ-58, Health boxes rule 13, and the Chapter 4 to 6 constraints.
- ADR-0001 to ADR-0015 as amended (ADR-0014 and ADR-0015 by batch 2), and `CONTEXT.md` (Standard Issue and Down as amended).
- OQ-59 to OQ-73 in `docs/rules/OPEN-QUESTIONS.md`. Entries OQ-74 and above were ignored.
- The previous reviews: `docs/reviews/04-gear-review-3.md`, `04-gear-review-3-codex.md`, `01-03-decisions-conformance-review-2.md`, and `01-03-decisions-conformance-review-2-codex.md`.

I did not read the parallel Codex review of this round.

Every figure below is exact. It comes from a pure Python script in the session scratchpad, outside the repository, that enumerates dice faces and runs dynamic programs over gear rating, Stress, and Gas Rating. Nothing was sampled. The appendix gives the models. All 37 YAML files under `data/` parse (Ruby Psych).

Severity:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**No Critical findings.** Batch 2 is applied in substance, completely.

- Every OQ-59 to OQ-73 chapter impact is present in prose and YAML, and so is every ruling in the OQ-71 and OQ-73 Minor batches. One OQ-73 wording fix is only partly done (finding 8).
- No `PROVISIONAL` block, `provisional:` tag, ammo kind, "hard ride", or unconditional "wears the horse" survives in the four chapters, their YAML, the ADRs, or the glossary.
- ADR-0014, ADR-0015, and the glossary entries Standard Issue and Down read as the decisions say.
- Every batch-2 figure reproduces within 0.3 points: the Jam rates, the reference dodge, the Rookie gas medians, and the gas target.
- ADR-0014's gas target stays reachable as amended: medians of 8 and 6 rounds, the closest any whole-number Gas Rating gets to about 9 and about 6.

**Two Majors.** Both come from OQ-72's rating 2 ODM Gear meeting an earlier decision, not from a drafting error:

1. **Two dodge baselines.** OQ-70's wording gives the reference Rookie Talent 1 on each measured roll, and the dodge has a dice Talent (Slip Away). Every batch-2 dodge, Jam, and gas figure, and the Chapter 5 and 6 constraints, use no Talent. The gap is one base die: a Severity 3 dodge succeeds 20.7% of the time without it and 29.2% with it.
2. **The horse dodge is dominated.** At Funding 3, 4, and 6, a mounted soldier's dodge with ODM Gear beats the dodge with the horse on success, on wear, and on falls. That undoes OQ-25's "same pool shape" premise and the dice benefit of the Rider's Loose the Horse.

**Six Minors** cover:

- the horse's Break Attention test, which still reads a bare Position;
- two edges of the early Gas Roll, and Chapter 1's sentence on three-die Gas Rolls;
- a full issue that rewards leaving a Jam unrepaired;
- ADR-0014's stale body and the Veteran's gear parity;
- Chapter 2 provenance;
- wording and bookkeeping slips.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 1, Core Rules | 0 | 0 | 0 |
| Chapter 2, Character Creation | 0 | 0 | 1 |
| Chapter 3, Harm and Mind | 0 | 0 | 0 |
| Chapter 4, Gear | 0 | 2 | 5 |
| **Total** | **0** | **2** | **6** |

A finding that touches an ADR, the decisions file, or several chapters is counted under the chapter it most affects. Its location names every file involved. Finding 4 also names Chapter 1, and finding 1 names Chapters 2 and 3.

---

## Batch 2: application check

| OQ | What the decision requires of the chapters | Status | Evidence |
|---|---|---|---|
| 59 | `by_funding` ODM Gear 1, 1, 2, 2, 2, 3; decline the exchange of Jammed ODM Gear or a lame horse; corrected rationale; 4.1 *Restoring* wording; `provisional` to `decided` | Applied | `standard-issue.yaml` rows and `decline` step; 4.9 steps 1, 4, 6 and both OQ-59 notes; 4.1 reads "Jammed ODM Gear only if it is rated below the Funding row"; `items.yaml` `restored_by` for ODM Gear and horse. Finding 5 is a consequence of rating 2, not a missed impact. |
| 60 | Rules 1 to 3: roll before a canister moves; an emptied canister is discarded and the act spends nothing; a dead soldier rolls first | Applied | 4.3 *A canister about to move*; 4.7 passing and taking; 4.11 *Death*; `odm-gear.yaml` `canister_removed`; `carrying.yaml` `passable`, `gas_roll`, `taking_items.effect`, `left_for_the_squad`. Finding 4 is an edge the decision text leaves. |
| 61 | The Focus Titan is recorded with a horse's or left items' Position; mount and take compare against it; forced dismounts say the horse stays; Chapter 5 list | Applied | `horses.yaml` `horse_position`, `mount.requirements`, `forced_dismount`; `carrying.yaml` `where_left`, `taking_items`; `sheet-fields.yaml` `horse.position`, `left_at`, `focus_titan_label`, invariant, `@In Reach A` marks; intro bullet. Finding 3 is the third reader of the recorded Position, which the decision did not name. |
| 62 | Design note; Health 1 to 6 | Applied | 4.6 OQ-62 note; `falls.yaml` `decided`. |
| 63 | Design note; Blade Sets unchanged | Applied | 4.4 note; `blade-sets.yaml` and `items.yaml` `decided`. |
| 64 | Design note | Applied | 4.7 note; `carrying.yaml` `decided`. |
| 65 | Take roll-off outside a Titan Engagement; no veto | Applied | 4.7 *Taking an item*; `carrying.yaml` `taking_items.requirements.outside_titan_engagement`. |
| 66 | Corrected rationale and window figures; 4.9 loses "so wear carries" | Applied | 4.8 OQ-66 note; 4.9 OQ-59 note; `field-repair.yaml` `decided`. |
| 67 | No ammo kind, stock, or sheet field; one forward sentence; example Supply line | Applied | 4.10; `squad-supply.yaml` `kinds`, `stock`, `not_a_kind`; `sheet-fields.yaml` `squad_sheet`; the example's `Supply \| Rations 0 \| Flares 2 \| Medical 2`. |
| 68 | Share-out in two steps; left canister after the Gas Roll | Applied | 4.11 *Sharing out*; `carrying.yaml` `shared_out.steps`. |
| 69 | 4.13 note: glossary changes applied or withdrawn | Applied | 4.13 OQ-69 note. |
| 70 | The Rookie has the Slayer template's attributes and Talent 1 per measured roll; the template Squad is reported | Applied | Chapter 2 2.2 and 2.10; Chapter 3 3.2; `squadmates.yaml` `matches_reference_build` and `templates` comment; `decided` adds OQ-70. Finding 1 follows from the wording. |
| 71.1 | The Health 3 report Squad is the reference Squad with only Health set to 3 | Applied | ADR-0014; Chapter 2 2.2 and 2.10; Chapter 3 3.2. |
| 71.2 | Veteran Wits 2, 19 points; Levi-grade deliberately above | Applied | ADR-0014; Chapter 2 2.2 and 2.10; Chapter 3 3.2. |
| 71.3, 8, 9 | Sure Seat description; 2.7 note drops the "hard ride" clause; ADR-0015 wear sentence | Applied | `talents.yaml` `sure-seat.description`; 2.7 note; ADR-0015 `## Amended`. Finding 7 covers the tag. |
| 71.4 | Chapter 1 act block; OQ-15 bullet covers result-spent actions | Applied | 1.10 "a Catalog entry unless it is a move"; 1.9 "Turns and actions spent in advance, by a Reaction or a result". |
| 71.5 | `decided:` tags | Applied | `bonus-dice-sources.yaml` `help` [..., OQ-17, OQ-18]; `stress-changes.yaml` `cover` [..., OQ-18]; `down.yaml` [OQ-18, OQ-45]; `fear-rolls.yaml` [OQ-18, OQ-49, OQ-50, OQ-52]; `effect-types.yaml` `no-reactions` [OQ-09, OQ-18, OQ-46]. |
| 71.6 | Chapter 3 act check with tracked values; Death Roll sentence; glossary Down | Applied | 3.17; `CONTEXT.md` Down "Reaching 0 current Health through damage". |
| 71.7 | Health 6 reported | Applied | 3.2 *Injuries before Down* (mean 3.99; 39.6 / 55.5 / 70.0 / 99.7%). |
| 72 | Design note; reference note names ODM Gear 2; `by_funding`; example Jonas `ODM 1/2`, Ilse `ODM 2/2`; Chapter 5 Jam test; Chapter 6 ladder at Gear 2 | Applied | 4.9 both notes; `standard-issue.yaml`; example rows; decisions Chapter 5 and 6 constraints; ADR-0014 `## Amended`. Findings 1, 2, and 6 follow from the decision. |
| 73.1 to 5, 7, 8 | As under OQ-59, 60, 61, 65, 66, 67, 68 | Applied | See those rows. |
| 73.6 | Wording and figure slips | Partly applied | 4.1, the 4.3 Rookie medians (both ratings), and the `forced_dismount` rows are done. `canister_removed` still reads "Its dice are the ones dice (below) gives" (finding 8). The OQ-72 *Why* slip is moot, as decided. |

**Revised-by-batch-2 lines.**

- OQ-25's revised dodge figures (16.0 / 20.6 / 25.6% at Agility 3) are in the decisions file, and the 16.0 and 20.6% figures are in Chapter 4's section 4.9 OQ-72 note.
- ADR-0015's amended wear sentence (only Gear Dice showing 1 on a Pushed roll wear the horse) matches Chapters 1, 2, and 4.
- OQ-28's Sure Seat description is in `talents.yaml`.
- OQ-39's range and Health boxes rule 13 read 1 to 6, as Chapter 4 does.
- OQ-58's builds are as OQ-70 and OQ-71 state.
- The Chapter 4 constraints are met, and the Chapter 5 and 6 constraints carry the Jam test and the ODM Gear 2 ladder.

## Previous findings: status

| Finding | Status |
|---|---|
| `04-gear-review-3.md` Major 1, rating 1 ODM Gear Jams too often | **Resolved** by OQ-72 (b). ADR-0014 is amended, and the test is in the Chapter 5 constraints. |
| `04-gear-review-3.md` Minor 2, the Gas Roll empties a moving canister; a dead soldier's canister | **Resolved** by OQ-60 rules 1 to 3. Finding 4 is a narrower edge. |
| `04-gear-review-3.md` Minor 3, Field Repair rationale | **Resolved** (4.8 and 4.9 notes). |
| `04-gear-review-3.md` Minor 4, a broken item rated above the row is downgraded | **Resolved** (the decline covers the exchange). |
| `04-gear-review-3.md` Minor 5, take order outside a Titan Engagement | **Resolved** (roll-off). |
| `04-gear-review-3.md` Minor 6, a recorded Position names no Focus Titan | **Resolved** for mount and take. Finding 3 is Break Attention. |
| `04-gear-review-3.md` Minor 7, wording and figure slips | **Partly resolved**. The garbled dice phrase remains (finding 8). |
| `04-gear-review-3-codex.md` Major 1, rating 1 fails the two-Titan test | **Resolved** (rating 2: 22.6% exact). |
| `04-gear-review-3-codex.md` Major 2, the immediate Gas Roll destroys the promised canister | **Resolved** (rule 2). |
| `04-gear-review-3-codex.md` Minors 3 and 4, ammo and the share-out | **Resolved**. |
| `01-03-decisions-conformance-review-2.md` Major 1, the reference Rookie named as the Slayer template | **Resolved** by OQ-70. Finding 1 is the same kind of split, now on the dodge. |
| `01-03-decisions-conformance-review-2.md` Minors 2 to 7 | **All resolved** (OQ-71 items 1 to 6, as tabled above). |
| `01-03-decisions-conformance-review-2-codex.md` Minors 1 to 3, Health 6, ADR-0015 wear, Sure Seat | **All resolved** (OQ-71 items 7, 8, 9). |

## Checks that passed

**ADR-0014 gas target (exact Markov chain; the chapter's figures in brackets):**

| Full Gas Rating | Gas Roll | Mean | Median | 10th to 90th | Empty by round 4 | Empty by round 6 | Empty by round 8 | Lasts 9 or more |
|---|---|---|---|---|---|---|---|---|
| 3 | two dice | 9.25 (9.25) | 8 (8) | 4 to 16 (4 to 16) | 13.5% (13.5) | 32.3% (32.3) | 51.3% (51.3) | 48.7% (48.7) |
| 3 | three dice | 6.33 (6.33) | 6 (6) | 3 to 11 (3 to 11) | 32.3% (32.3) | 59.7% (59.7) | 78.8% | 21.2% |
| 2 | two / three dice | 6.25 / 4.33 | 5 / 4 (5 / 4) | 2 to 11 / 2 to 8 | 39.5% / 61.9% | | | |
| 4 | two / three dice | 12.25 / 8.33 | 11 / 8 (11 / 8) | 6 to 20 / 4 to 13 | 3.1% / 12.5% | | | |

Gas Rating 3 gives medians of 8 and 6 against "about 9" and "about 6". Rating 4 overshoots both halves and rating 2 undershoots both. The no-Push half is accepted at 8 in OQ-60's simulator case, and ADR-0014's own OQ-72 paragraph now states it, so the target is reachable as amended. The mean with no Push is 9.25.

**Reference Rookie gas** (Agility 3, fixed Stress 1, Push when short, wear not modelled; the chapter's figures in brackets):

| Case | Pushes | Mean | Median | 10th to 90th |
|---|---|---|---|---|
| ODM Gear 2, needs 1 | 26.8% (27%) | 8.24 (8.24) | 7 (7) | 4 to 14 (4 to 14) |
| ODM Gear 2, needs 2 | 60.3% (60%) | 7.24 (7.23) | 7 (7) | 3 to 12 (3 to 12) |
| ODM Gear 1, needs 1 | 32.2% (32%) | 8.06 (8.06) | 7 (7) | 4 to 14 (4 to 14) |
| ODM Gear 1, needs 2 | 65.9% (66%) | 7.10 (7.10) | 6 (6) | 3 to 12 (3 to 12) |

**Jam, Stress starting at 1 and rising on each Push, Push when short** (section 4.9's rising-Stress table in brackets):

| ODM Gear | Severity | By round 3 | By round 5 | No later than the canister empties | Two Titans, by round 3 |
|---|---|---|---|---|---|
| 1 | 2 | 27.8% (27.9) | 38.0% (38.2) | 45.1% (45.2) | 41.9% (41.8) |
| 1 | 3 | 31.5% (31.7) | 42.7% (42.8) | 49.1% (49.2) | 46.9% (46.8) |
| 1 | 4 | 32.2% (32.3) | 43.9% (44.1) | 50.2% (50.3) | |
| 2 | 2 | 8.3% (8.3) | 14.9% (14.9) | 21.7% (21.8) | 17.9% (17.9) |
| 2 | 3 | 10.6% (10.5) | 18.9% (18.9) | 25.9% (25.8) | 22.6% (22.6) |
| 2 | 4 | 11.1% (11.2) | 20.0% (20.0) | 27.2% (27.2) | |

The decisions file's 27.7 / 31.7 / 41.6 / 47.1% and 8.4 / 10.7 / 17.8 / 22.6% are within 0.3 points. ADR-0014's "about a third ... nearly half ... about a tenth and a fifth" holds.

**Reference dodge** (Agility 3, Stress 1, Push when short, no Talent): 16.0%, 20.7%, and 25.5% at Severity 3 with Gear 1, 2, and 3 (Chapter 4 section 4.9 gives 16.0 and 20.6, and OQ-25's revised line gives 25.6), and 43.9% and 49.8% at Severity 2 with Gear 1 and 2 (section 4.9: 44.0, 49.7).

**Section 4.9 fixed-Stress table.** All rows but one match within 0.3 points. The rating 3 "only when short" row is 0.4 to 0.6 points high (finding 8).

**Other checks:**

- **Chapter 4 worked example.** It is correct against the YAML:
  - Jonas: `ODM 1/2`, one Gear Die, Push, Jam, and high fall (4 + 2 = 6, 2 damage, Health 3 to 1).
  - Gas: a three-die Gas Roll takes 3 to 1.
  - Ilse: Field Repair takes Jonas from 0 to 1 of 2; Change Canister leaves a Gas 1 spare.
  - Loads: 3 + 5 + 3 = 11 against 7, and 6 with Strong Back.
  - The after-fight Field Repair on 1 of 2 is correct.
- **Chapter 1's example.** Mila's rating 2 ODM Gear now matches the Funding 3 issue.
- **ADR-0003 item 12.** The act lists in 1.10, 3.17, and 4.13 each pair every act with a tracked value. Item 13: no Chapter 4 state forbids a Push, Help, Cover, or Reaction.
- **Glossary.** No `_Avoid_` term appears in any revised text. Standard Issue, Down, Gas Roll, Jam, Squad Supply, and Overloaded agree with the chapters; Overloaded's reading is logged under OQ-64.
- **Chapter 4 constraints** in the decisions file are all met: Catalog rows, mounted, airborne, wear at Stress 1, gas Pushes from ODM rolls, falls against current Health 1 to 6, the Squad row, and the medical Bonus Dice row.

---

## Findings

### 1. Major. The reference dodge has two baselines: ADR-0014 gives the Rookie Talent 1 on each measured roll, but every batch-2 dodge, Jam, and gas figure has no Talent

**Location:**

- **Chapter 4:**
  - Section 4.9, *Design note (OQ-72)*: "a Rookie with Agility 3 and Stress 1, Pushing when short, dodges Severity 3 20.6% of the time at ODM Gear 2".
  - Section 4.9, *Design note (ADR-0014 reference builds)*.
  - Section 4.3, gas design note: "the reference Rookie, who makes one ODM Gear roll each round with Agility 3, ODM Gear 2 (OQ-72), and Stress 1".
- **ADR-0014, `## Amended`:**
  - OQ-70 paragraph: "Talent 1 in the Talent that names each roll a target measures".
  - OQ-72 paragraph: "its Gear Dice are 2 on the dodge, Fly, and Break Attention".
  - OQ-19 paragraph: "Severity is tuned against a Rookie dodging with Agility 3".
- **`docs/rules/DECISIONS-2026-09-14.md`:**
  - Chapter 5 constraints: "Tunes Severity against a Rookie dodging with Agility 3 and ODM Gear 2"; the Jam test names no build.
  - Chapter 6 constraints: "a lone Rookie dodges Severity 3 20.6% of the time and Severity 2 49.7%".
  - OQ-25, *Revised by batch 2*.
- **Chapter 2**, section 2.10 design note: "The reference Rookie has Talent 1 in every roll a target measures". **Chapter 3**, section 3.2 *Reference builds*.
- **`data/character/talents.yaml`:** `slip-away` (dice, `names: [dodge]`), `wirework` (dice, `[fly]`), and `lure` (dice, `[break-attention]`).

**Problem:**

- OQ-70 closed the Grab split by giving the reference Rookie "Talent 1 in the Talent that names each roll a target measures".
- Each of the three ODM Gear rolls has exactly such a dice Talent.
- ADR-0014's targets all contain dodges by the reference Squad: the prepared-Squad kill (the Attention holder), the Grab, and the Expedition PC Critical Injury and death targets. So a simulator built from ADR-0014 as amended gives the Rookie Slip Away 1.
- Batch 2 measured everything with Agility 3, ODM Gear 2, and Stress 1, and no Talent dice: the quoted reference dodge, the Chapter 5 tuning baseline, the Chapter 6 ladder, the binding Jam test, and the Rookie gas figures.

One base die separates the two readings (exact):

| Roll (Agility 3, ODM Gear 2, Push when short) | No Talent (batch 2's figures) | Slip Away 1 (ADR-0014 as amended) |
|---|---|---|
| Lone Rookie dodge, Severity 2 | 49.8% | 58.9% |
| Lone Rookie dodge, Severity 3 | 20.7% | 29.2% |
| Rookie dodge with 1 Help, Severity 3 | 29.2% | 37.8% |
| Jam within 3 rounds, Severity 3, one Titan / two Titans | 10.6% / 22.6% | 10.2% / 21.8% |
| Rookie gas, one roll a round needing 1 success, median rounds | 7 | 8 |

Chapter 4 already uses both readings. Its section 4.4 Blade Set table measures the Rookie strike as "Strength 4, Talent 1, Blade Set 1, Stress 1", but its section 4.3 and 4.9 dodge, Jam, and gas figures give the same Rookie no Talent die.

The Chapter 6 ladder ("a supported Rookie at Severity 3 about as often as a lone Veteran") holds only when both builds are read the same way:

- With no dodge Talent, the supported Rookie makes 29.2% and a lone Veteran (Agility 3, Gear 2, Stress 2) 26.1%.
- With Talent on the dodge, the Rookie makes 37.8% and the Veteran, with Slip Away 2, 41.3%.

The constraint quotes only the Rookie's no-Talent figure, and the Jam test names no attributes, Talent, or gear. This is the split OQ-70 was decided to remove, moved from the Grab to the dodge.

**Scenario:**

1. The Chapter 5 drafter sets a Medium Titan's sweep to Severity 3, reading the constraint: "a lone Rookie dodges Severity 3 20.6% of the time".
2. The ADR-0014 simulator's author builds the reference Squad from the ADR as amended, with Talent 1 in the Talent that names each measured roll, and runs the Expedition PC Critical Injury target. The same sweep is dodged 29.2% of the time alone and 37.8% with Help.
3. The target comes out low, so the author asks for Severity 4.
4. The drafter, citing the constraint, says Severity 3 is already tuned.
5. Both cite decided texts.

**Fix options:**

1. The decider states, in ADR-0014 and the Chapter 5 and 6 constraints, that the reference Rookie's dodge, Fly, and Break Attention carry no Talent dice. Talent 1 then applies to the strike, Break Free, and treatment rolls the targets measure, and Chapter 4's figures stand as the baseline. The Flier template (Agility 4, Slip Away 1) is reported, not tuned.
2. Give the Rookie Slip Away 1, Wirework 1, and Lure 1 in OQ-70's sense. Restate the Chapter 4 figures (Severity 3 29.2%, Severity 2 58.9%, Jam 10.2% and 21.8%, gas medians 8 and 7) and the Chapter 5 and 6 constraints.
3. Whichever reading is chosen, name the full build (attributes, Talent, gear, starting Stress) in the Jam test and on both sides of the Chapter 6 ladder.

### 2. Major. At Funding 3, 4, and 6 the horse dodge is dominated by the ODM Gear dodge from the saddle, which undoes OQ-25's premise and blunts the Rider's Talents

**Location:**

- **Chapter 4:**
  - Section 4.5, *What a horse rates*: "A mounted soldier's dodge or Break Attention may take its Gear Dice from ODM Gear instead".
  - Section 4.9, reference-builds note: "a Funding 3 horse is rated 1, so a mounted dodge made with it follows the rating 1 rows".
  - `data/gear/standard-issue.yaml` `by_funding`: `odm_gear_rating` 1, 1, 2, 2, 2, 3 against `horse_rating` 1, 1, 1, 1, 2, 2.
  - `data/gear/horses.yaml` `gear_dice.choice`; section 4.2 *Jam* item 5 (only an airborne soldier falls).
- **`docs/rules/DECISIONS-2026-09-14.md`:**
  - OQ-25 *Why*: "The pool shape does not change ... what changes is the currency, horse wear instead of gas and ODM wear".
  - OQ-72: "the Blade Set and horse ratings are unchanged".
- **Chapter 2**, section 2.7 OQ-28 design note: Sure Seat gives the Rider what Well-Kept Rig gives the Flier.
- **`data/character/talents.yaml`:** `loose-the-horse` and `sure-seat`.
- **ADR-0015**, the OQ-25 amendment.

**Problem:** Before batch 2 the horse was rated at least as high as ODM Gear at every Funding. Now ODM Gear outrates it at Funding 3 and 4 (2 against 1) and at Funding 6 (3 against 2). A mounted soldier may take the dodge's Gear Dice from either item, and the ODM Gear dodge wins on everything but gas.

| Mounted Rookie (Agility 3, Stress 1, Push when short) | Horse, rated 1 | ODM Gear, rated 2 |
|---|---|---|
| Dodge, Severity 3 | 16.0% | 20.7% |
| Dodge, Severity 2 | 43.9% | 49.8% |
| Item at 0 within 3 rounds of dodging one Titan at Severity 3 | 31.5% lame, a fall from a horse, no mount | 10.6% Jammed, no fall, because a mounted soldier is never airborne |
| Cost | none beyond wear | a Gas Roll each round; Pushing on 77.7% of Severity 3 dodges empties a canister in a median of 6 rounds |

Several decided texts assumed parity and no longer hold:

- **OQ-25:** its reason (same pool, different currency) is gone. A player dodges with the horse only to save gas.
- **Loose the Horse:** the Rider's Break Attention with the horse rolls Agility 4 plus Gear 1, 5 dice. Without the Talent, Perception 3 plus ODM Gear 2 also rolls 5. The Talent's dice gain at Funding 3 and 4 is gone; it was 5 against 4.
- **Sure Seat:** it protects a horse that a rational Rider no longer Pushes.
- **Chapter 5's Severity baseline** is ODM Gear 2, so every horse dodge runs one Gear Die under it.
- **Canon:** the Survey Corps' riders live or die by their horses, and OQ-25 was decided on that picture.

**Scenario:**

1. The Squad enters a Titan Engagement from formation, mounted at Distant, at Funding 3.
2. The Titan's first card sweeps the Squadmate Rider, Severity 3.
3. With the horse she dodges 16.0% of the time, and each Pushed dodge lames and throws her 1 time in 6.
4. With ODM Gear from the saddle she dodges 20.7% of the time, a Jam never drops her, and the price is a two-die Gas Roll.
5. Every player makes the same choice every time. The horse's Gear Dice matter only to a soldier who has run dry.

**Fix options:**

1. Rate the horse like ODM Gear: `horse_rating` 1, 1, 2, 2, 2, 3. This is a data change. Revise OQ-25's *Why* and the 4.9 note; lame rates then match the rating 2 Jam figures (10.6% and 22.6%).
2. While mounted, the dodge and Break Attention take Gear Dice only from the horse, so `gear_dice.choice` goes. This keeps OQ-25's currency, but a mounted soldier dodges one Gear Die under the baseline, which a Chapter 5 constraint must then name.
3. Keep both rules, and record the trade in an OQ-25 *Revised by batch 2* line with these figures. Add a Chapter 5 constraint that Severity for behaviors reaching mounted soldiers is checked against horse Gear 1.

### 3. Minor. The horse's Break Attention test still compares a bare Position, while mount and take now name the Focus Titan

**Location:** Chapter 4:

- Section 4.1, *At 0, and counting as not had*, the horse bullet.
- Section 4.5, *What a horse rates*.
- `data/gear/items.yaml` `horse.counts_as_not_had`: "it does not hold the soldier's Position".
- `data/gear/horses.yaml` `gear_dice.break-attention`.

Compare `horses.yaml` `mount.requirements.in_titan_engagement` and the OQ-61 decision.

**Problem:**

- OQ-61 records a dismounted horse's Position with its Focus Titan, so that the mount and take tests read one way when two Focus Titans are in play.
- The Break Attention Gear Dice test ("while it holds the soldier's Position") is the third rule that reads the recorded Position, and it kept the bare comparison.
- The introduction's Chapter 5 item covers how Positions relative to two Titans relate in general. But Chapter 4 put the Titan into the mount and take tests themselves, and this test is left out.

**Scenario:**

1. Ilse dismounts at In Reach of Titan A, and her row reads `Hr 1/1 @In Reach A`.
2. Titan B enters as a second Focus Titan, and Ilse later holds In Reach relative to B.
3. She takes Break Attention against B with the horse's Gear Die.
4. One reading gives her the die. The mount test, one line above it, refuses her the saddle at the same moment.

**Fix options:**

1. Add "relative to the Focus Titan recorded with the horse's Position" to the four locations.
2. Or name the Break Attention clause in the introduction's Chapter 5 list beside the mount and take tests.

### 4. Minor. After the early Gas Roll, later ODM use that round spends no gas, a death can roll the round's gas twice, and Chapter 1 still says every Pushed ODM Gear roll makes the round's Gas Roll three dice

**Location:**

- Chapter 4, section 4.3, *A canister about to move*, rules 1 to 3.
- `data/gear/odm-gear.yaml` `gas_roll.canister_removed`; `data/gear/carrying.yaml` `passing_items.gas_roll` and `leaving_play.death.left_for_the_squad`.
- Chapter 1, section 1.5, *Pushing and gas*: "The Gas Roll is three dice however many of that round's rolls were Pushed rolls with ODM Gear."
- `DECISIONS-2026-09-14.md` OQ-60 rules 1 to 3.

**Problem:**

- Rule 1 makes the early roll "that soldier's Gas Roll for the round, and none is made for them at the round's end, whatever canister they fit later in it".
- Rule 2 lets a passer whose canister that roll empties "still take an action that turn", and that action can be Change Canister.
- From then on the soldier holds a full canister and has already made the round's Gas Roll. A later Pushed ODM Gear dodge that round spends no gas, which contradicts Chapter 1's unconditional sentence.
- Rule 3, "A soldier who dies after using ODM Gear this round makes that round's Gas Roll at once", has no "unless already made". The same soldier dying later that round makes a second Gas Roll on the new canister.
- The decision chose "whatever canister they fit later", so the free use is a ruled trade. The Chapter 1 sentence and rule 3's second roll are gaps.

**Scenario:**

1. Armin, at Gas Rating 1, makes an ODM move to Mikasa's Position and declares Pass Item on his fitted canister.
2. The early two-die Gas Roll shows a 1, which happens 30.6% of the time. The canister is discarded, and the pass is not made.
3. He uses his action on Change Canister and fits his full spare.
4. A later card that round resolves against him. He dodges with ODM Gear and Pushes.
5. Chapter 1 says his Gas Roll this round is three dice. Chapter 4 says he has none left to make.
6. Had he instead held a lethal `turn` Critical Injury from the round before, his Death Roll at the end of this turn could kill him. Rule 3 would then have him roll the round's gas again, before his new canister becomes a left item.

**Fix options:**

1. Add to Chapter 1 section 1.5 "unless that soldier's Gas Roll for the round has already been made (Chapter 4, section 4.3)", and add "if they have not already made it this round" to rule 3.
2. Or have rule 1 give a soldier who fits another canister after the early roll a second, end-of-round Gas Roll on it, with the dice from the rolls made after the early roll. The glossary's Gas Roll entry would need to allow it.

### 5. Minor. With ODM Gear rated 2, a full issue replaces a Jammed harness but keeps a worn one, so leaving a Jam unrepaired beats repairing it

**Location:**

- Chapter 4, section 4.9, *Receiving it*, steps 1 and 4, and "Standard Issue never restores the current rating of an item a soldier keeps".
- `data/gear/standard-issue.yaml` `receiving.steps` (`odm-gear`, `horse`) and `kept_items`.
- Section 4.9, OQ-59 design note; section 4.8.

**Problem:**

- At rating 1, a worn harness was a Jammed one, so step 1's "Jammed" covered every worn harness.
- At rating 2, the Funding 3 default, 1 of 2 is the common state after a fight; the worked example leaves Jonas there.
- Step 1 exchanges a Jammed harness (0 of 2 becomes 2 of 2) and keeps a worn one (1 of 2 stays 1 of 2).
- One Field Repair success turns 0 of 2 into 1 of 2. A successful repair therefore converts an item the next full issue would replace into one it keeps worn.
- Rating 2 horses at Funding 5 already had the same shape.
- No Phase 1 table sees it, since the interim issue keeps both harnesses alike. Every pre-Expedition full issue will.

**Scenario:**

1. The Squad fights its last Titan Engagement before an Expedition that will begin with a full issue.
2. Jonas's harness is Jammed, and in the care window Ilse offers him Field Repair.
3. If repaired, it goes into the Expedition at 1 of 2. If not, it is exchanged for 2 of 2.
4. The players decline the repair, and the rule rewards them for it.

**Fix options:**

1. Full issue step 1 also replaces ODM Gear whose current rating is below its rating, and step 4 a horse likewise. The decline stays for a soldier who wants to keep a higher-rated item.
2. Or record the case in OQ-59 as a constraint on the Expedition and Maintain Gear rules.
3. Or let a full issue restore the current rating of kept ODM Gear and horses rated at the row, and leave the interim issue unchanged.

### 6. Minor. ADR-0014's body and Chapter 4's reference note still describe the pre-batch builds

**Location:**

- ADR-0014: the body line "Rookie (key attribute 4, Talent 1, Gear Dice 1)", and the OQ-19 paragraph's "Unless the build is a Flier or Rider".
- Chapter 4, section 4.9, reference-builds note: "The Veteran's and Levi-grade soldier's higher ratings come from higher Funding or from Requisition".
- `DECISIONS-2026-09-14.md`, Chapter 6 constraint: the ladder is re-measured only for the Rookie side.

**Problem:**

- **Scattered build.** The body still gives the Rookie Gear Dice 1. Five `## Amended` paragraphs change the build's attributes, Talent sense, report Squads, and ODM Gear. A reader must assemble it from all of them.
- **Precedent.** Conformance Minor 9 moved ADR-0003's amended checklist into its body for this reason.
- **Vestigial clause.** "Unless the build is a Flier or Rider" no longer has a case, since OQ-58 fixed all three builds with Strength as the key attribute.
- **Veteran parity.** The Veteran's Gear Dice 2 now equal the Rookie's ODM Gear 2. The 4.9 sentence is true only of Blade Sets, horses, and kits, and the Chapter 6 ladder compares two builds with the same ODM Gear while re-measuring only one of them (finding 1 gives the Veteran's figures).

**Scenario:** A simulator author codes the builds from ADR-0014's body line and gives the Rookie ODM Gear 1. They reproduce the pre-batch 16.0% Severity 3 dodge and the 31.5% Jam rate, and report that Chapter 5 fails the Jam test.

**Fix options:**

1. The decider rewrites ADR-0014 so that its body states the current three builds in one paragraph, and `## Amended` keeps the history.
2. Section 4.9 reads "The Veteran's Blade Set, horse, and kit ratings of 2, and the Levi-grade soldier's ratings of 3, come from higher Funding or from Requisition. The Veteran's ODM Gear rating equals the Rookie's."
3. The Chapter 6 constraint quotes the lone Veteran's dodge at the Talent reading finding 1 settles.

### 7. Minor. Chapter 2's provenance and phrasing lag batch 2

**Location:**

- Chapter 2, section 2.10, design note (OQ-29, OQ-58, OQ-70): "The reference Rookie has Talent 1 in every roll a target measures". Section 2.10's stat block and ADR-0014 read "in the Talent that names each roll a target measures".
- `data/character/talents.yaml` `sure-seat.decided: [OQ-28]` and the file's top-level `decided`. OQ-71 item 3 changed Sure Seat's description.

**Problem:**

- The conformance round 2 provenance fix (OQ-71 item 5) exists so that searching `decided:` finds every row a decision changed. The Sure Seat row does not name OQ-71.
- The design note's "every roll" is broader than the ADR's wording. It reads naturally as including the dodge, which is finding 1's ambiguity.

**Scenario:** A later decision revises OQ-71's Sure Seat ruling. The maintainer searches `decided:` for OQ-71, finds no row in `talents.yaml`, and leaves the description stale.

**Fix options:**

1. Add OQ-71 to `sure-seat.decided`.
2. Word the 2.10 design note as the stat block and ADR-0014 do.

### 8. Minor. Wording, figure, and bookkeeping slips

**Locations and problems:**

- **`data/gear/odm-gear.yaml` `canister_removed`, first rule:** "Its dice are the ones dice (below) gives for the rolls the soldier has made so far this round" is still garbled. OQ-60 and OQ-73 item 6 said the rewrite removed the phrase.
- **Chapter 4, section 4.7, *Passing an item*:** "the passer's fitted canister, if it has gas after the Gas Roll that passing it makes" reads as if every pass makes a Gas Roll. `carrying.yaml` correctly limits it to a passer who has used ODM Gear this round.
- **Chapter 4, section 4.9, *Design note (OQ-72)*, and `DECISIONS-2026-09-14.md` OQ-72 *Why*:** "Rating 1 fails the Jam test before Chapter 5 adds anything: about 32% of three-round fights against one Titan at Severity 3". 31.5% is under a third, so rating 1 fails only against two Titans (46.9%).
- **Chapter 4, section 4.9, fixed-Stress table:** the rating 3 "only when short" row gives 10.7% and 21.9%. The exact values are 10.3% and 21.3%; every other row matches within 0.3 points.
- **Chapter 4, introduction:** "this chapter's own entries, OQ-59 to OQ-73". OQ-70 and OQ-71 belong to Chapters 1 to 3.
- **`DECISIONS-2026-09-14.md`:**
  - The preamble and *Round-3 notes* still say "The register ends at OQ-57".
  - The *Counts* line reads "under *Batch 2*. and marked Decided".
  - That line's ADR and glossary tallies do not include batch 2.
- **`docs/rules/PROGRESS.md`:** the open Major columns (Chapter 3 "1 + 0", Chapter 4 "1 + 2") predate batch 2, which closed OQ-60, OQ-70, and OQ-72.

**Scenario:** A Chapter 5 drafter reads the 4.9 note and concludes that one-Titan fights at rating 1 already failed the Jam test. They carry that false premise into the two-structure Tempo choice. Or a Foundry importer displays the garbled `canister_removed` text on the Gas Roll card.

**Fix options:**

1. Read "It has the dice that `dice` (below) gives for the rolls the soldier has made so far this round", and in section 4.7 "if it has gas after any Gas Roll the pass makes (section 4.3)".
2. Write "Rating 1 fails the Jam test against two Titans (about 47% at Severity 3) and sits just under it against one (about 32%)". Correct the rating 3 row, and "this chapter's own entries, OQ-59 to OQ-69 and OQ-72 to OQ-73".
3. The decider updates the decisions file's preamble and *Counts* line; the orchestrator updates `PROGRESS.md`.

---

## Appendix: models

All figures are exact, from a pure Python script in the session scratchpad (`wof_b2_exact.py`, not committed).

**Dice pool.**

- **Pool:** base dice are the attribute plus Talent plus Help. Gear Dice are the item's current rating. Stress Dice are the soldier's Stress.
- **Roll:** each die is enumerated as 6, 1, or other.
- **No Push** if any Stress Die shows 1.
- **Push when short:** a Push happens when the roll is below what it needs. "Push always" Pushes whenever it is allowed.
- **Push:** adds one Stress Die, and re-rolls base and Stress Dice not showing 6 (binomial). Gear Dice keep their faces.
- **Wear:** the number of Gear Dice showing 1 on a Pushed roll.
- **Not applied:** Stress Responses, Covering, and turn debt.

**Jam.**

- **State:** a dynamic program over (current rating, Stress), with Stress starting at 1 and rising by 1 on each Push.
- **Rounds:** one dodge a round against one Titan, or two a round against two, with Stress carried between them.
- **Jam:** at current rating 0.
- **Canister column:** adds Gas Rating 3, and the Gas Roll each round is three dice after a Push and two otherwise. It counts a Jam that happens no later than the round the canister empties.

**Fixed-Stress table.** As the Jam model, with Stress fixed at 1, one roll a round needing 2 successes, and Pushing "always" or "when short".

**Gas.**

- **Target:** a Markov chain over Gas Rating with d dice a round. "Lasts" is the round whose Gas Roll brings the rating to 0. The median is the smallest round with P(empty) of 50% or more.
- **Rookie gas:** the per-round Push probability comes from the pool model at fixed Stress 1, and the Gas Roll is three dice with that probability.
