# Chapters 1 to 5: decisions conformance review, round 1

Reviewed:

- `docs/rules/01-core-rules.md`, `02-character-creation.md`, `03-harm-and-mind.md`, `04-gear.md`, and `05-titan-engagement.md`.
- The YAML in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`, and `data/engagement/`.
- The probe scripts in `tools/probes/chapter-05/`, read and run from a copy outside the repository.

Checked against:

- `docs/rules/DECISIONS-2026-09-14.md`:
  - *Batch 3* (OQ-74 to OQ-90, OQ-93 to OQ-99) and its chapter impacts;
  - the `Revised by batch 3:` lines on OQ-28, OQ-29, OQ-59, OQ-72, OQ-73, and batch 2b's Major 1 and Minor 5;
  - the Chapter 5 and Chapter 6 constraints and *What the Phase 1 simulator must model*.
- ADR-0001 to ADR-0015 as amended, including ADR-0014's batch 3 body and `## Amended` paragraph, and `CONTEXT.md` (Opening, Blind Spot, Break Attention).
- The register lines for OQ-25, OQ-59, OQ-70, OQ-72, OQ-79, OQ-81, OQ-93, and OQ-97 in `docs/rules/OPEN-QUESTIONS.md`.
- The previous reviews: `05-titan-engagement-review-3.md`, `05-titan-engagement-review-3-codex.md`, `01-04-decisions-conformance-review-2.md`, and `01-04-decisions-conformance-review-2-codex.md`.

Not read, as the brief directs: the parallel Codex and Fable files for this round, `docs/rules/06-standard-titans.md`, `data/titans/`, and OPEN-QUESTIONS entries from OQ-100 on.

Severity:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, a significant odds, balance, or fidelity problem, or a decided rule whose recorded reasons its own measurements contradict.
- **Minor:** wording, clarity, bookkeeping, or a small gap.

## Verdict

**No Critical findings. One Major, six Minors.**

Batch 3 is applied completely:

- **Tags.** No `PROVISIONAL` block or `provisional:` tag remains in the five chapters or their YAML.
- **Chapters 1 to 4.** Every impact batch 3 lists is present, in prose and in YAML.
- **ADR-0014.** Its amended targets appear word for word in `tuning.yaml` (`solo_nape.target`, `grab.target`, `probes.baseline_policy`).
- **Glossary.** The three rewritten entries agree with the chapters.
- **Figures.** Every figure I re-ran reproduces within sampling.

**The Major** is the drafter's first conflict. Escalating Break Attention needs are applied as decided. But OQ-79 and OQ-81 justify the rule with lone-soldier claims that the committed probe, and my card-aware model, contradict:

- "OQ-79's figures do not move";
- a median of 4 rounds with 1.67 Titan cards;
- "two or three cuts a fight";
- "the rejected cap would cost the lone soldier more".

Measured against the chosen rule rather than against no escalation, the rejected cap costs the lone Rookie less:

| Measure (card-aware lone Rookie) | Escalation (the rule) | Rejected cap |
|---|---|---|
| Usable cuts by round 12 | 1.16 | 1.64 |
| Lone kill by round 12 | 14.5% | 19.8% |

The chapter's "median 6 rounds" measures a policy that spends decoys on turns where no success can be used. ADR-0014's per-strike target is untouched (13.1%), so this is not Critical.

**The six Minors:**

- the lone band's measurement point under the full simulator;
- decision-record figures that the committed re-run no longer matches, one of them inverted;
- the new decoys-spent counter missing from the tracked values;
- ADR-0014's gas body wording;
- Fall Back's timing under standing Wings;
- the Squad sheet row still worded for Squadmates only.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 1, Core Rules | 0 | 0 | 0 |
| Chapter 2, Character Creation | 0 | 0 | 0 |
| Chapter 3, Harm and Mind | 0 | 0 | 0 |
| Chapter 4, Gear | 0 | 0 | 2 |
| Chapter 5, Titan Engagement | 0 | 1 | 4 |
| **Total** | **0** | **1** | **6** |

A finding that also touches an ADR, the decisions file, or OPEN-QUESTIONS is counted under the chapter it most affects, and its location names every file.

---

## Batch 3: application check

| Chapter | Impact | Status |
|---|---|---|
| 1 | Section 1.9 refund pointer names both dodges (OQ-85, OQ-99 item 1) | Applied |
| 2 | Sections 2.2 and 2.10 (stat block and note): "No other roll a target measures carries Talent dice, including the dodge, Fly, Break Attention, Ride, and Read" | Applied |
| 2 | Section 2.7 | Nothing to change: its OQ-28 note never restated the Talent list, and its "Hard to Kill ... simulator check" agrees with the closed list |
| 2 | `squadmates.yaml` `stat_block.matches_reference_build` and the `templates` comment | Applied |
| 2 | `action-catalog.yaml` `break-attention.needs` (OQ-81) | Applied, word for word |
| 2 | Section 2.8's Break Attention line | Unchanged; it does not quote the needs |
| 2 | `talents.yaml` Relentless and Sharp Call point to `titan-harm.yaml` and `read.yaml` (OQ-90) | Applied, word for word |
| 3 | Section 3.2 no-Talent sentence (OQ-94 item 1) | Applied, with the Death Roll, Rally, and Hard to Kill spelled out |
| 4 | Section 4.1 *Restoring*, section 4.5 *Lame*, section 4.9 interim sentence and OQ-59 note (OQ-93) | Applied |
| 4 | `standard-issue.yaml` `interim_issue.differences` and `why_narrow`; `items.yaml` `horse.restored_by` | Applied, word for word |
| 4 | Introduction "revised two of them and ADR-0014's reference builds"; 20.7% and 10.6% (OQ-94 item 3) | Applied. The rising-Stress table row is labelled a sample. The OQ-72 note's "about 11% and 23%" is a rounding of the ODM Jam rows and is harmless. |
| 4 | `sheet-fields.yaml` `positions` format and record, `squad_sheet_row.purpose`, header OQ-90 and OQ-97; section 4.12 | Applied (wording remnant: Minor 7) |
| 4 | `horses.yaml` unchanged; section 4.3 gas medians stand | Confirmed |
| 5 | Every `PROVISIONAL` block to a design note; every `data/engagement` tag to `decided:` | Applied (grep finds none left) |
| 5 | Introduction "Every ADR-0014 target is met as amended in decision batch 3" | Applied |
| 5 | Section 5.3 and `round.yaml`: Wings stand, band and bounds, timed test and fallbacks, one Positions record, cadence line, `decoys spent` field and example | Applied |
| 5 | Section 5.6 and `attention.yaml`: needs list, `needs_rule`, riderless-horse requirement | Applied (the design note's lone-soldier sentence: Major 1) |
| 5 | Section 5.7 OQ-83 note without the pending sentence | Applied |
| 5 | Section 5.9 and `grab.yaml`: refund for a compared dodge; OQ-85 note quotes the amended "comrades close" | Applied |
| 5 | Section 5.10 and `background-titans.yaml`: option 4 without Lift Comrade, carrier sentence | Applied |
| 5 | `squad-tactics.yaml` `rules.tuning` (OQ-99 item 5) | Applied, word for word |
| 5 | Section 5.13: OQ-79 and OQ-95 design notes, *Decoys* and *Large* bullets, `verdict`, `size-classes.yaml` 36.6%, `probes.baseline_policy`, `simulator_cases`, both targets | Applied (figures re-run: Minor 3) |
| 5 | Section 5.14 OQ-90 note; `anchor-ratings.yaml` Open row | Applied |
| 5 | `fight.py` `ba_need` carries OQ-81 (`holder_escalating` default) and the rows are re-run | Applied |

**Glossary and ADRs.**

- **Opening.** The glossary line, `titan-harm.yaml` `openings.own_openings`, `bonus-dice-sources.yaml` (`opening.condition`), and Hook and Cut's effect agree: comrades spend, the creator never does.
- **Blind Spot.** The line and the `anchor-ratings.yaml` Open row agree. "Behind" appears nowhere in the five chapters or their YAML.
- **Break Attention.** The line agrees with `needs_rule`.
- **ADR-0010** (unamended) still holds:
  - Break Attention shifts Attention for the Titan's next card;
  - escalation applies to every soldier, so it is not a penalty for acting alone;
  - the holder-only need restores it as the holder's own escape.
- **ADR-0015's countdown.** It still runs on the victim's turns. The extended refund changes only which turn counts as spent.
- **ADR-0003:**
  - item 2: Draw Attention's flag;
  - item 8: the *No rulings* list;
  - item 11: entry fields;
  - item 13: Grabbed's `forbids`.

  All four hold. Item 12 has one gap: Minor 4.
- **Register.** OQ-25, OQ-59, OQ-70, and OQ-72 now carry their batch 2b clauses (OQ-59 and OQ-70 their batch 3 clauses too). The decisions file's Counts line lists OQ-91, OQ-92, and batch 3.

## The drafter's three conflicts

1. **The lone Rookie's wait under escalation (4.93 cards and median 6, against 1.67 and 4).** Keeping the rule was right: OQ-81 decides it, and the escalation is what stops the beside-the-holder screen. Quoting the measured figure instead of the decision's was also right.
   - **The figure reproduces.** On a fresh seed I get median 6, 60.7% usable by round 12, and 4.93 cards.
   - **But it measures a wasteful policy.** The probe tries Break Attention on every turn, including turns whose card comes before the Titan's. There the Titan's own card spends the decoy, so a success can never be used, and under escalation each such success raises every later need.
   - **What is missing.** The figure that matters to a lone soldier, usable cuts per fight, is not reported.
   - **Against the chosen rule,** the decision's supporting claims are false. That is Major 1.
   - **A small slip.** Section 5.13's "with 1.67 cards" mixes the mean (`no_escalation_means`) with the through-round-12 column (1.65).
2. **OQ-97's clock list (6, 8, and 6 with 10).** No real conflict:
   - The decision lists the lengthened clocks in order of original length: 4, 6, and 4 with 8 become 6, 8, and 6 with 10.
   - `round.yaml` (`fallbacks`) writes the same set in table order: "6 becomes 8, 4 becomes 6, and 4 with 8 becomes 6 with 10".
   - "Each clock plus 2" is exactly the decision. No finding.
3. **Gas medians 8 and 6 against "about 9" and "about 6".** The exact Markov chain gives medians 8 and 6, means 9.25 and 6.33.
   - **Accepted.** ADR-0014's batch 2 `## Amended` paragraph accepts 8, and Gas Rating 3 is the closest rating: rating 2 gives medians 5 and 4, rating 4 gives 11 and 8.
   - **Chapters.** Chapters 4 and 5 state this correctly.
   - **ADR body.** It still reads "about 9 rounds" beside "results are medians", and batch 2b made the body the current statement. That is a wording gap in the ADR, not a chapter defect: Minor 5.

## ADR-0014 targets, re-simulated

The committed probes ran from a copy in the session scratchpad on seeds different from the drafter's. The independent core is described in the appendix.

| Target | Mine | Chapter / `tuning.yaml` | Verdict |
|---|---|---|---|
| Gas, full canister, two dice (exact) | median 8, mean 9.25, 4 to 16; 51.3% empty by round 8 | 8, 9.25 | Met as amended (Minor 5 on ADR wording) |
| Gas, three dice (exact) | median 6, mean 6.33, 3 to 11 | 6, 6.33 | Met |
| Medium kill, 4 Rookie PCs, reference policy (committed `fight.py`, 4,000 fights): median round, by round 3, by round 4, Critical Injuries, deaths, cards a round | 3, 63.4%, 73.8%, 0.68, 0.026, 0.85 | 3, 62.6%, 73.2%, 0.71, 0.027, 0.853 | Met: median kill in round 3 |
| 4 PCs and 2 helper Squadmates | 3, 69.7%, 80.1%, 0.64, 0.009, 0.832 | 2, 69.3%, 79.3%, 0.65, 0.006, 0.833 | Reproduces, but the median sits on the round 2/3 boundary (Minor 3) |
| Screen beside the holder under OQ-81 | 3, 67.5%, 77.5%, 0.47, 0.005, 0.663 | 3, 67.4%, 78.1%, 0.47, 0.005, 0.661 | Reproduces: a trade, not a dominant play |
| Lone Rookie after Break Attention, Nape Depth 4, Stress 0 / 1 / 2 (committed core, 200,000 trials) | 10.0% / **13.1%** / 15.7% | 10.0% / 13.1% / 15.9% | In the 8% to 14% band, 0.9 points under its top (Minor 2) |
| Same, independent core with no Stress Response effects | 10.1% / 13.6% / 16.8% | | Inside the band |
| Veteran, Stress 2; Levi-grade, Stress 2 (committed core) | 32.1%; **47.3%** | 32.3%; 47.4% | Levi-grade meets "about 50%" |
| Levi-grade, independent core | 47.7% | | Meets |
| Break Attention, Rookie, needs 1 / 2 / 3 / 4 (independent) | 82.6% / 49.8% / 20.6% / 5.7% | 82.6% / 49.6% / 20.6% / 5.6% | Reproduces |
| Grab alone: failed dodge / no dodge (committed `simple.py`, 30,000 each) | 69.5% / 72.9% | 69.9% / 73.1% | About 2 in 3; declining the dodge still gains nothing |
| Grab, one comrade, S1 G0 / S2 G0 / S3 G0 / S1 G1 / S2 G1 / S3 G1 (20,000 each) | 28.4 / **33.8** / 39.6 / 34.4 / 39.9 / 44.7% | 28.7 / 33.4 / 39.1 / 34.1 / 39.7 / 45.1% | Every cell under 50%, Stress 2 and Grief 0 near 1 in 3: met as amended |

---

## Findings

### 1. Major. Chapter 5: escalating Break Attention needs cost the lone soldier more than OQ-79 and OQ-81 say, and more than the rejected cap, while the chapter measures the lone line on a policy that wastes decoys

**Location:**

- **Chapter 5:**
  - Section 5.6, *Design note (OQ-81)*: the bullet *Only the holder needs 1* ("so the lone figures in section 5.13 do not move"), the bullet *The lone soldier's price*, and the bullet *Rejected*.
  - Section 5.13, *A lone soldier after Break Attention*, the card-order paragraph ("A usable strike comes a median of 6 rounds in ... Without escalation it came a median of 4 rounds in, with 1.67 cards").
- **YAML and probes:** `data/engagement/tuning.yaml` (`solo_nape.card_order_wait` and `solo_nape.verdict`); `tools/probes/chapter-05/simple.py` (`solo_wait`).
- **`docs/rules/DECISIONS-2026-09-14.md`:**
  - OQ-79 *Why*: "What the target protects still holds: ... comes a median of 4 rounds after starting at Distant with 1.67 Titan cards against the soldier meanwhile".
  - OQ-81 *Why*: "so OQ-79's figures do not move"; "so the lone line keeps two or three cuts a fight"; "The rejected cap would cost the lone soldier more (3.72 Titan cards before a usable strike against 1.67)".
- **`docs/rules/OPEN-QUESTIONS.md`:** OQ-81's `Decision` line.

**Problem:**

1. **The chapter's lone-line figure measures a wasteful policy.**
   - *How a decoy becomes usable.* A lone soldier holds Attention, so their Break Attention needs 1 plus the decoys already spent. A success is usable only if their next turn comes before the Titan's next card, because that card spends the decoy.
   - *What the probe does.* `solo_wait` tries Break Attention on every turn. When the soldier's card comes before the Titan's in the same round, the Titan's card this round always spends the decoy, so the success is wasted, and under escalation it raises every later need.
   - *What a player can do instead.* Cards are dealt face up (`round.yaml`, `initiative_cards.public`), so a player sees this at the deal.
   - *Card-aware play.* Trying Break Attention only after the Titan's card has come up gives the lone Rookie a first usable cut in a median of 4 to 5 rounds (50.1% by round 4), not 6.
2. **Measured against the chosen rule, the cap costs the lone soldier less, not more.**
   - OQ-81 compared the cap (3.72 mean cards) with the rule before escalation (1.67), never with escalation.
   - Every measure but the card-aware first-cut median favours the cap, with unlimited decoys and with the Funding 3 decoy stock.
3. **"Two or three cuts a fight" does not hold.**
   - Under escalation a card-aware lone Rookie gets about one usable cut in twelve rounds: 1.16 with unlimited decoys, 1.02 with Funding 3's two flares, one horse, and one cloak. Without escalation it is 2.27 and 1.65.
   - A lone kill within 12 rounds falls from 26.6% to 14.5%.
4. **Section 5.6 contradicts itself.** Its note first says the lone figures "do not move", then that the first usable cut comes later.
5. **The decision's figures are uncorrected.** OQ-79 and OQ-81 still carry the pre-escalation figures as the reason the rule is safe for the lone soldier, and the narrow escalation on this conflict starts from that record.

Lone Rookie against a Medium Titan (Tempo 1), card order only, Break Attention at the Rookie's rates for each need (82.6%, 49.6%, 20.6%, 5.6%). "Probe policy" tries on every turn; "card-aware" tries only once the Titan's card has come up that round.

| Decoys | Policy | Rule | First usable cut, median round | Usable by round 12 | Titan cards before it (or through round 12) | Usable cuts by round 12 | Lone kill by round 12 |
|---|---|---|---|---|---|---|---|
| Unlimited | Probe | Escalation (the rule) | 6 | 60.7% | 4.93 | 0.79 | 10.0% |
| Unlimited | Probe | No escalation | 4 | 97.2% | 1.65 | 2.27 | 26.6% |
| Unlimited | Probe | Rejected cap | 5 | 86.6% | 3.30 | 1.64 | 19.8% |
| Unlimited | Card-aware | **Escalation (the rule)** | **4 to 5** | **79.4%** | **4.43** | **1.16** | **14.5%** |
| Unlimited | Card-aware | No escalation | 4 | 97.2% | 2.81 | 2.27 | 26.6% |
| Unlimited | Card-aware | Rejected cap | 5 | 86.6% | 4.32 | 1.64 | 19.8% |
| Funding 3 stock | Probe | Escalation (the rule) | none (48.4% by 12) | 48.4% | 6.89 | 0.57 | 7.3% |
| Funding 3 stock | Card-aware | **Escalation (the rule)** | **5** | **73.9%** | **5.11** | **1.02** | **12.9%** |
| Funding 3 stock | Card-aware | No escalation | 4 | 89.1% | 3.54 | 1.65 | 20.0% |
| Funding 3 stock | Card-aware | Rejected cap | 5 | 85.2% | 4.54 | 1.52 | 18.5% |

The probe-policy escalation row reproduces `tuning.yaml` exactly. The kill column applies the 13.1% per cut to each usable cut. It ignores Stress rising before later cuts, and Openings, which the soldier cannot spend on their own cuts anyway.

**Why not Critical:**

- ADR-0014's lone target is per strike, and it does not move (13.1%).
- ADR-0010 is not contradicted: every soldier pays the escalation.
- The screen problem escalation solves is real: 0.661 cards a round against 0.413.

The defect is that the decision weighed the cap against escalation on a lone-soldier comparison that reverses once the chosen rule is measured, and the chapter tells players the lone line's cost from a policy they would not play.

**Fidelity.** A lone Levi-grade soldier's second decoy on the same Titan succeeds 65.9% of the time and the third 38.3%, so canon's lone kills survive, but the Rookie's lone line becomes mostly one cut.

**Scenario:** Private Hanna Vogt fights a Medium Titan alone at Wooded, Funding 3, with 2 flares, her horse, and her cloak.

1. **Round 1.** Hanna draws 4 and the Titan 11. Her player reads section 5.13 ("a median of 6 rounds") and sends the horse anyway. It succeeds (needs 1), and she flies to Blind Spot. Card 11 spends the decoy, and decoys spent becomes 1.
2. **Round 2.** The Titan draws 3 and Hanna 9. The Titan's card resolves against her. She throws her cloak (needs 2) and succeeds. Round 3's cards are Hanna 14 and Titan 6, so card 6 spends the cloak before she can cut. Decoys spent is 2.
3. **Round 4.** Her first flare needs 3 (20.6%) and fails, and the flare is gone. After her second flare, she has no decoy left and has not cut once.

Had she waited in round 1 for a round where the Titan's card came first, the horse would have bought a cut. Nothing in the chapter tells her the order matters, and the decision record tells the decider she keeps two or three cuts.

**Fix options:**

1. **Keep the rule and correct the record** (drafter and decider):
   - In `tuning.yaml` (`card_order_wait`), add a card-aware policy row and a Funding 3 stock row, with columns for usable cuts and lone kill by round 12, reported beside the per-strike target and not tuned.
   - In section 5.6, replace "so the lone figures in section 5.13 do not move" with "so the per-strike figures in section 5.13 do not move".
   - In section 5.13, quote the card-aware figures and say that a lone soldier should break Attention after the Titan's card.
   - The decider adds `Revised by batch 3 conformance:` lines to OQ-79 and OQ-81 replacing "median of 4 rounds with 1.67 cards", "two or three cuts a fight", and the cap comparison with the like-for-like figures above.
2. **Revisit the trade** (decider):
   - Measure needs 1 for the holder only *with* the cap, instead of escalation, against the beside-the-holder screen. Only the cap added to the round 2 rule was measured (0.509 cards a round).
   - Or measure escalation that counts only decoys whose card came up before their placer's next turn.
   - Choose on the screen row and the lone cuts per fight together.
3. **Accept escalation as the lone soldier's price in so many words.** OQ-81's *Why* states that a lone Rookie gets about one usable cut per Titan and a 13% to 15% lone kill within 12 rounds, and ADR-0014's lone target gains a reported, not tuned, lone kill per fight row.

### 2. Minor. Chapter 5: the lone band is measured at Stress 1 right after Break Attention, but the full simulator is told to re-measure it "with the full rules", where the cut comes several Titan cards later at higher Stress

**Location:**

- ADR-0014, body, second target ("between 8% and 14% at the Rookie's fight-start Stress of 1").
- Chapter 5 section 5.13, *Design note (OQ-79)*: "The simulator re-measures the band with the full rules, and a value outside it is a miss."
- `tuning.yaml`: `solo_nape.model` and `simulator_cases` ("the lone Rookie's 8% to 14% band").
- DECISIONS OQ-79 *Decision*.

**Problem:**

- **What the probe measures.** Up to three Break Attentions needing 1, then a strike at once, with only the Break Attention's Push adding Stress. The Rookie strikes at Stress 1 or 2 and scores 13.1%, 0.9 points under the band's top.
- **What the full rules produce.** Under the rules as decided, the first usable cut comes after 4.43 to 5.11 Titan cards (Major 1, card-aware), each of which can add terrorize Stress or a Pushed dodge. From Stress 2 the same strike scores 15.7% (committed core, fresh seed; 15.9% in `tuning.yaml`), and from Stress 3 17.4%, both outside the band. My independent core with no Stress Response effects gives 13.6% even at Stress 1.
- **The ambiguity.** "At the Rookie's fight-start Stress of 1" can mean the strike is made at Stress 1, or the fight starts at Stress 1. The decision's "a value outside it is a miss" makes the second reading a pre-armed miss.

**Scenario:** The Phase 1 simulator's author runs lone fights from Stress 1 under every rule and records each lone Nape strike. The rate comes out near 15%, outside the band. Under OQ-79 that is a miss, and Nape Depth 5, which OQ-79 already rejected for breaking the Levi-grade target, is proposed again.

**Fix options:**

1. **Pin the measurement point.** `tuning.yaml` (`solo_nape.model`) and section 5.13 state that the band is measured on a strike made from the Rookie's fight-start Stress of 1 directly after Break Attention (the probe's model). The full simulator reports the in-fight lone rate beside it, not tuned.
2. **Or the decider states** that the band binds the in-fight rate, and records what moves if it misses.

### 3. Minor. Chapter 5: the decision record's OQ-81 figures differ from the committed re-run the chapter quotes, and one comparison is inverted

**Location:**

- DECISIONS OQ-81: *Why* and *Chapter impact*.
- Batch 3 *Chapter impacts*, Chapter 5 ("screen beside the holder under the old rule 0.423 and 0.26").
- OQ-79 *Why* (49.8%, 20.8%).
- OPEN-QUESTIONS OQ-81 `Decision` line (0.423 and 0.26).
- Chapter 5 sections 5.6 and 5.13, and `tuning.yaml` (`decoys`, `titan_cards_resolved_per_round`, `break_attention_by_need`).

**Problem:** The drafter re-ran every row with the committed probes, and the chapter follows its files, as it says it will. The decision record was not updated.

| Figure | Decision record (`decoy_b3.py`, `solo_b3.py`) | Chapter and `tuning.yaml` (committed probes) |
|---|---|---|
| Screen beside the holder, round 2 rule: cards a round, Critical Injuries per fight | 0.423, 0.26 | 0.413, 0.25 |
| Holder-only needs, no escalation | 0.609, 0.45 | 0.601, 0.42 |
| Rule, by round 3 | 67.5% | 67.4% |
| Rookie's second and third decoy | 49.8%, 20.8% | 49.6%, 20.6% |
| **Rejected cap added to the round 2 rule, against escalation added to it** | **0.562 against 0.534** | **0.509 against 0.538** |

- **The inversion.** In the decision's figures the cap restores more of the screened Titan's cards than escalation. Its sentence ("buys less than escalation") says the opposite.
- **Which is right.** The committed probe gives the ordering the sentence needs, and the Opus round 3 review measured the cap at 0.514, so the decision's 0.562 is the outlier.
- **Why it matters.** OQ-81's reason for rejecting the cap rests on this comparison and on the lone-soldier one in Major 1.
- **One case, two medians.** `tuning.yaml` itself gives the same case, 4 player characters and 2 helper Squadmates with no Squad Tactic, a median kill of round 2 in `squads` (69.3% by round 3) and round 3 in `squad_tactics` (69.2%). My fresh-seed run gives round 3 (69.7%). The median sits on the boundary. Yet section 5.13's *Squad Tactics* bullet ("With Squadmates the median moves whatever the tactics") and OQ-89's *Why* treat round 2 as settled, and the screen's "kill more slowly than two helpers" leans on it.

**Scenario:** The Fable escalation on conflict 1 reads OQ-81 and finds the cap restoring 0.562 cards to escalation's 0.534. It concludes the cap is both better against screens and cheaper for the lone soldier, then finds the chapter saying the opposite, and cannot tell which file is wrong.

**Fix options:**

1. **The decider adds a `Revised by batch 3 conformance:` line** to OQ-81 (and its register line) quoting the committed rows: 0.413 and 0.25, 0.601 and 0.42, the cap 0.509 against escalation 0.538, and 49.6% and 20.6%.
2. **Or states in batch 3's preamble** that `tuning.yaml` governs every Chapter 5 figure, and that the decision's `decoy_b3.py` rows are superseded.

### 4. Minor. Chapter 5: the new decoys-spent counter changes when a soldier acts, but no tracked value or Catalog `changes` row names it (ADR-0003 item 12)

**Location:**

- `data/character/action-catalog.yaml`: `tracked_values` (`attention-shift`: "shift a Focus Titan's Attention onto a decoy") and `break-attention.changes: [attention-shift, openings-create, grabbed-end]`.
- Chapter 5 section 5.14, *Acts in this chapter* (Break Attention row).
- `attention.yaml` (`break_attention.needs_rule`, `on_success`) and `round.yaml` (`gm_tracker.focus_titan_row`).
- ADR-0003 item 12.

**Problem:**

- **The counter.** OQ-81 creates a counter on the tracker that only a soldier's successful Break Attention changes, and that changes every later Break Attention's need.
- **What item 12 requires.** A rule that creates a counter soldiers change by acting adds it to the tracked values with the entry that changes it. Neither the Catalog nor the section 5.14 table does.
- **Precedent.** Chapter 5 treats Background clocks, which a flare also ticks, as a procedure step. Decoys spent is different: it is set by a soldier's act and read by a soldier's roll.

**Scenario:** The Foundry importer builds the Break Attention macro from `break-attention.changes`. It shifts Attention and creates Openings but never raises the Titan's decoys spent, so every later Break Attention against that Titan is offered at need 1 or 2 again. The screen OQ-81 closed reopens in the VTT.

**Fix options:**

1. **Add a tracked value**, such as `decoys-spent-add` ("raise a Focus Titan's decoys spent"), to `tracked_values` and to `break-attention.changes`, and add it to the section 5.14 row.
2. **Or reword `attention-shift`** to "shift a Focus Titan's Attention onto a decoy and raise its decoys spent", so the one value carries both.

### 5. Minor. Chapter 4: ADR-0014's body still states the gas target as "about 9 rounds" beside "results are medians", while the exact median is 8

**Location:**

- ADR-0014: the body's fourth target and "results are medians"; the `## Amended` paragraph for batch 2 ("lasts a median of 8 rounds on two dice and 6 on three").
- Chapter 4 section 4.3, *Design note (ADR-0014 gas target)*; Chapter 5 section 5.13 *Gas*; `tuning.yaml` (`gas`).

**Problem:**

- **Numbers.** Exact: median 8 and mean 9.25 on two dice; median 6 and mean 6.33 on three; 51.3% of canisters empty by round 8.
- **Accepted but not visible.** The amendment history accepts 8, and the chapters say so correctly. But batch 2b made the ADR body the current statement of every target, and read alone it reports a miss.
- **Low stakes.** No rating reaches a median of 9 (rating 4 gives 11 and 8), so nothing in the chapters should change.

**Scenario:** The Phase 1 simulator's author codes the gas check from ADR-0014's body: median about 9. They get 8, flag a miss, and propose Gas Rating 4, which overshoots both halves.

**Fix options:**

1. **The decider writes** "A full gas canister lasts about 9 rounds of ODM use (median 8, mean 9.25), about 6 when pushing every round" in the body.
2. **Or states** that the gas target is read on the mean, beside "results are medians".

### 6. Minor. Chapter 5: Fall Back is declared "before Wings are assigned", a moment that no longer happens at most wings steps

**Location:** Chapter 5 section 5.12, the Fall Back row ("before Wings are assigned"); `data/engagement/squad-tactics.yaml` (`fall-back.when`: "At the wings step, before Wings are assigned"); `round.yaml` (`wings.when`, `round_steps.wings`: "Assign Wings, or keep them").

**Problem:**

- **What changed.** Under OQ-77 as changed by OQ-97, Wings are assigned at the first wings step and stand. At a later step they may change only after a death, a departure, a new Down or Grabbed soldier, or a Focus Titan entering or dying.
- **The gap.** At every other wings step nothing is assigned, so Fall Back's `when` names a moment that does not occur there.
- **What the table must guess.** The condition ("The wings step of a round begins") still fires, so a table must decide whether the tactic can be declared in a round where Wings are only kept.
- **Frequency.** This is the common case, since Fall Back is for a soldier stranded high with no working ODM Gear mid-fight.

**Scenario:** In round 3, with no loss since round 2, Jonas is at Blind Spot with a Jammed harness. His player declares Fall Back at the wings step. Another player reads "before Wings are assigned", says the tactic waits for a round that reassigns Wings, and no rule settles it.

**Fix options:**

1. **Write "At the wings step, before Wings are assigned or kept"** in `squad-tactics.yaml` and section 5.12.

### 7. Minor. Chapter 4: the Squad sheet row is now kept for every soldier in a Titan Engagement, but its name column and purpose are still worded for Squadmates

**Location:** `data/gear/sheet-fields.yaml`: `squad_sheet_row.purpose` ("One line per Squadmate on the Squad sheet holds all of its gear") and `columns[name].format` ("the Squadmate's name"). Chapter 4 section 4.12, *The Squad sheet row*.

**Problem:**

- **The new requirement.** OQ-97 and OQ-99 item 3 give every soldier who takes part a row, whose positions column is the record the ladder reads, and batch 3 added that sentence.
- **What still reads as Squadmate-only.** The name column is formatted only for a Squadmate. The row's gear columns are required for a Squadmate and only optional for a player character ("may use the rest of the line"), yet no format says what an unused gear column holds.
- **Impact.** Nothing breaks, but the one record of Positions is written on a row whose format does not describe half its users.

**Scenario:** A new GM prints Squad sheets from `sheet-fields.yaml`. The row template reads "Squadmate name", so they print two rows for the two Squadmates and none for the four player characters. On the Titan's first card the ladder cannot be read from the sheet as section 5.3 says.

**Fix options:**

1. **Name format "the soldier's name".** Add to `purpose` that a player character's row may carry a dash in every gear column its character sheet already holds.

---

## Previous reviews: status

### `05-titan-engagement-review-3.md` (Opus)

| Finding | Status | Evidence |
|---|---|---|
| Major 1: decoy screen beside the holder | **Resolved** (OQ-81) | Holder-only needs plus escalation: 0.661 cards a round and 0.47 Critical Injuries per fight, against 0.413 and 0.25 before (`tuning.yaml`; my fresh-seed run 0.663 and 0.47, median kill round 3). The lone-soldier cost it introduced is Major 1. |
| Minor 2: Tempo 2 turn debt | **Resolved** | `grab.yaml` `countdown.failed_dodge` and `grab_lands.failed-dodge` cover a compared dodge; Chapter 1 section 1.9 and sections 5.5 and 5.9 match. |
| Minor 3: riderless-horse comparison | **Resolved** | `attention.yaml` wording matches `horses.yaml` and `items.yaml`. |
| Minor 4: two homes for Positions | **Resolved** | One record, format unified, header lists OQ-90. Wording remnant: Minor 7. |
| Minor 5: retreat option 4 names Lift Comrade | **Resolved** | Removed. The carrier sentence is added. |
| Minor 6: `squad-tactics.yaml` tuning row | **Resolved** | Word for word. |
| Minor 7: "twice Medium's harm" | **Resolved** | Section 5.13, `verdict`, and `size-classes.yaml` 36.6%. |

### `05-titan-engagement-review-3-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Major 1: lone Rookie over the bound | **Resolved** by ADR-0014's amendment (OQ-79) | 13.1% in the 8% to 14% band (my run 13.1%). Measurement point: Minor 2. |
| Major 2: "comrades close" | **Resolved** by ADR-0014's amendment (OQ-95) | The one-comrade cells stand as the band test; the Squad share is reported (9.0%, 2.1%, 14.4%). |
| Major 3: decoy screens | **Resolved** (OQ-81) | As Opus Major 1 above. |
| Major 4: partial simulator | **Resolved as a decision** (OQ-98) | ADR-0014 now defines the baseline policy and sensitivity rows. `simulator_cases` lists everything the constraints name. The full simulator remains the Phase 1 item, not a chapter defect. |
| Major 5: round time unproven | **Resolved as a bounded target** (OQ-97) | Band, 30-minute two-Titan bound, timed test with pass criteria, and ordered fallbacks are in section 5.3 and `round.yaml` (`round_time`). The evidence is owed by the playtest, by design. |
| Minor 1: glossary Opening | **Resolved** | Glossary updated. |
| Minor 2: tracker cadence | **Resolved** | "after each counted turn of a Grabbed soldier" is in section 5.3 and `per_round_order`. |
| Minor 3: "behind" | **Resolved** | Open row and glossary Blind Spot reworded; no "behind" remains. |

### `01-04-decisions-conformance-review-2.md` (Opus)

| Finding | Status | Evidence |
|---|---|---|
| Major 1: interim issue keeps a worn horse | **Resolved** (OQ-93) | `standard-issue.yaml` `interim_issue.differences` and `why_narrow`, `items.yaml` `horse.restored_by`, and sections 4.1, 4.5, and 4.9. The simulator case "a horse returns to 2 of 2" is in `simulator_cases`. |
| Minor 2: unclassified rolls | **Resolved** (OQ-94 item 1) | The closed sentence is in ADR-0014, sections 2.2, 2.10, and 3.2, and `squadmates.yaml`. |
| Minor 3: stale register summaries | **Resolved** | OQ-25, OQ-59, OQ-70, and OQ-72 `Decision` lines carry their clauses. |
| Minor 4: bookkeeping and figure slips | **Resolved** | Counts line; Chapter 4 introduction "revised two of them"; 20.7%; 10.6% with the sample labelled. |

### `01-04-decisions-conformance-review-2-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Minor 1: OQ-73's stale median | **Resolved** | `Revised by batch 3:` line on OQ-73 (median 7, mean 7.23, 3 to 12). The `PROGRESS.md` row is the orchestrator's. |

---

## Appendix: models

All scripts ran in the session scratchpad, outside the repository, and none is committed.

- **Gas (`gas.py`).** An exact Markov chain over Gas Rating 3 with two or three dice a round. Each 1 lowers the rating by 1, and "lasts" counts rounds up to and including the one that empties the canister.
- **Committed probes.** `tools/probes/chapter-05/` copied with `data/harm/critical-injuries.yaml`, run with `uv run --with pyyaml`:
  - `fight.run_many` on `cases1.json` cases 0 (reference), 4 (helper Squadmates), and 18 (screen beside the holder), 4,000 fights each, seeds 7101, 7104, and 7118;
  - `simple.grab_cell` on the lone cells (30,000 trials each) and the six one-comrade cells (20,000 each), seeds from 4401;
  - `core.attr_roll` for the lone strike and Break Attention by need, seeds 77 and 91.
- **Independent core (`indep.py`).** Written from Chapter 1 and ADR-0004, not importing the probes.
  - **Dice.** Base dice are attribute plus Talent; Gear Dice are the current rating; Stress Dice equal Stress. A 6 succeeds.
  - **Push.** When short and no Stress Die shows 1: add 1 Stress and a Stress Die, and re-roll base and Stress Dice not showing 6.
  - **Wear.** Gear Dice showing 1 on a Pushed roll wear the item.
  - **Not applied.** Stress Response effects, so it brackets the probe from above.
  - **Lone line.** Up to three Break Attentions needing 1 with ODM Gear and no Talent, wear carried; then a Nape strike needing 4 with Talent and a Blade Set.
- **Card-order wait (`indep.py`, `wait3.py`).**
  - **Cards.** Each round the lone Rookie and a Tempo 1 Titan come up in random order.
  - **Break Attention.** It succeeds at the committed core's rate for 1 plus the decoys spent (escalation), 1 always (no escalation), or 1 always with no attempt after a card a decoy spent (the rejected cap).
  - **Decoys and the strike.** A decoy holds until the Titan's next card, which resolves nothing. A strike is made on the soldier's next turn if the decoy still holds, and it spends that turn's action.
  - **Probe policy.** Try on every turn.
  - **Card-aware policy.** Try only when the Titan's card has already come up that round.
  - **Funding 3 stock.** The horse is tried first and lost only on success. The 2 flares, then the cloak, are spent when declared.
  - **Counts.** Titan cards not spent by a decoy are counted through round 12, or until the first usable cut for the "before it" column.
  - **Samples.** `wait3.py` 60,000 trials a row and `indep.py` 100,000.
  - **Lone kill.** It applies 13.1% to each usable cut through round 12.
