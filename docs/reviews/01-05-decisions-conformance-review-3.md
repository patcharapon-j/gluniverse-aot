# Chapters 1 to 5: decisions conformance review, round 3

Reviewed:

- `docs/rules/01-core-rules.md`, `02-character-creation.md`, `03-harm-and-mind.md`, `04-gear.md`, and `05-titan-engagement.md`.
- The YAML in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`, and `data/engagement/`.
- The probes in `tools/probes/chapter-05/`, `tools/probes/batch-3b/`, and `tools/probes/batch-3c/`. They were run from a copy of the repository in the session scratchpad, so nothing in the repository was written.

Checked against:

- `docs/rules/DECISIONS-2026-09-14.md`:
  - *Batch 3c* (3c-1 to 3c-9) and *Batch 3d* (3d-1 to 3d-3), with their chapter impacts;
  - the `Revised by batch 3c:` lines on 3b-1 and 3b-8, and the `Revised by batch 3d:` lines on 3c-1 and 3c-3;
  - *Batch 3* and *Batch 3b* beneath them.
- ADR-0001 to ADR-0015, in particular:
  - ADR-0003's batch 3c and 3d `## Amended` paragraphs;
  - ADR-0010's batch 3c paragraph (the flag moment and the legal-route promise);
  - ADR-0014's batch 3c paragraph.
- `CONTEXT.md`: Attention, Attention Ladder, Draw Attention, Break Attention, Feint, Blind Spot, and Intent Table.
- The register lines for OQ-81 and OQ-111 in `docs/rules/OPEN-QUESTIONS.md`.
- The round 2 reviews: `01-05-decisions-conformance-review-2.md`, `-review-2-codex.md`, and `-review-2-fable.md`.

Not read, as the brief directs:

- `01-05-decisions-conformance-review-3-codex.md` and `06-standard-titans-review-3*.md`;
- `docs/rules/06-standard-titans.md`, `data/titans/`, and OQ-100 onward, except OQ-111's decision line, which batch 3d applies to ADR-0003.

Pointers from Chapter 5 into Chapter 6 are treated as expected.

Severity:

- **Critical:** contradicts an ADR or the glossary without being logged as an open question, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**One Critical, one Major, five Minors.**

**Batches 3c and 3d are applied.**
- Every chapter impact 3c-1 to 3c-9 names is present in prose, YAML, and the probes (table below).
- No universal 8.2% closure claim survives: 8.2% appears only in rows labelled as batch 3b's route check.
- The only one-card flag wording left is ADR-0003's own checklist item 2 (Minor 5).
- Every ADR-0014 target reproduces.

**The lone route holds (check 1).**
- In every state in which a Nape strike is legal, a lone soldier has a legal Break Attention and a legal sequence to the strike, with no GM invention.
- A Jam is repaired by Field Repair.
- A dry canister is changed for a spare.
- Against a grounded Titan with no working gear, the on-foot Feint precedes an on-foot step to Blind Spot.
- The one exception is a retreat, whose forced moves close the sequence (Minor 3).

**The struck-first rule does not survive, in two ways:**

1. **The Grab exception is recorded only for Draw Attention's flag (Critical 1).**
   - ADR-0003 item 2 names the holding card, but it speaks of Draw Attention's flag only.
   - ADR-0010's amended body and the glossary's Attention Ladder entry still say the just-hurt flag lasts until the Titan's next card that evaluates the ladder.
   - ADR-0010's "a striker who falls short draws the Titan's turn" has no exception.
   - Chapter 5 clears every flag on a holding card, as 3d-1 decided.
   - The same gap OQ-111 closed for ADR-0003 is open, and unlogged, in ADR-0010 and the glossary.
2. **A hold hands the flag to a card that does nothing (Major 2).**
   - Batch 3c kept flags through a hold so that the hold's last card reads them. That card resolves nothing and then clears them.
   - The Titan's next card, the one that acts, evaluates the ladder again with no flags.
   - On the committed `fight.py`, a flagged striker takes the next resolved behavior 100% of the time with no hold, but after a hold 0.0% (Medium, Hook and Cut) to 0.7% (Small, screen).
   - The short striker is instead barred from cutting again until that card.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 1, Core Rules | 0 | 0 | 0 |
| Chapter 2, Character Creation | 0 | 0 | 1 |
| Chapter 3, Harm and Mind | 0 | 0 | 0 |
| Chapter 4, Gear | 0 | 0 | 0 |
| Chapter 5, Titan Engagement | 1 | 1 | 4 |
| **Total** | **1** | **1** | **5** |

A finding that also touches an ADR, the glossary, the decisions file, or a probe is counted under the chapter it most affects, and its location names every file.

---

## Check 1: the lone route in every state where a Nape strike is legal

The lone soldier always holds Attention, so Break Attention needs 1, plus 1 for a Feint, plus the decoys in a row. A usable strike needs the soldier's next turn to come while the decoy holds, which is one round of the Titan's cards.

| State | Nape strike legal? | Legal Break Attention | Legal sequence to the strike |
|---|---|---|---|
| Standing Titan, Wooded, Urban, or Giant Forest, working ODM Gear | Yes, at Blind Spot | Feint from In Reach or On Body; flare anywhere; cloak from On Body or Blind Spot; horse | Break Attention from In Reach after the Titan's card, then an ODM step to Blind Spot and the cut. The committed lone fight reaches it in 77.0% of fights |
| Standing Titan, Sparse | Yes | As above | From On Body one ODM step. From In Reach the step needs a Fly roll (need 1); a failure ends at On Body and the soldier tries again |
| Standing Titan, Open | No: no step reaches Blind Spot | Not needed | Not needed |
| Standing Titan, Jammed, gas left or a spare | No, until repaired | Field Repair (Wits alone, need 1, retried each turn), then as above | Yes, one turn later |
| Standing Titan, dry with a spare | No, until changed | Change Canister, then as above | Yes |
| Standing Titan, dry with no spare (or Jammed with no gas and no spare) | No | A mounted Feint is still legal | Not needed. The committed lone fight ends here in 0.2% of fights |
| Grounded Titan, working ODM Gear | Yes | The Feint by ODM Gear, horse, or on foot | As for a standing Titan, and at Open from On Body only |
| Grounded Titan, Jammed or dry, no horse, flares and cloak spent, eyes Broken | Yes | On-foot Feint from In Reach or On Body (Perception alone, need 2; Rookie 37.7%) | On foot to Blind Spot: from In Reach at Wooded, Urban, and Giant Forest; from On Body at every rating, Open included. Sparse's In Reach to Blind Spot row calls a Fly roll only for an ODM move (`step_fields.fly_roll`), so on foot it needs none |
| Grounded Titan at Open, within the Regeneration window | Yes, until the leg recovers | On-foot or ODM Feint from On Body | On Body to Blind Spot on foot. A Medium Titan whose only Broken part is a leg stands within 3 rounds (section 5.2) |
| Tempo 2 Titan | As above | The hold covers two cards | 77.4% on the reference table (waiting line) |
| Overloaded | As above | As above | Shedding load costs neither move nor action on the soldier's turn (`carrying.yaml`, `shedding`), so the ODM step to Blind Spot need not spend the action |
| A retreat | Yes, at Blind Spot | Available: a flare or cloak at Blind Spot, a Feint at In Reach or On Body | **Closed** whenever the forced move is relative to the same Titan (Minor 3) |

**The Tempo 2 hold and struck-first.** The flag of a short strike made under a hold survives to the hold's last card, which reads it. What that reading buys is Major 2.

**The Grab exception.** A strike made during a Grab loses its flag at the next holding card. That is the decided rule (3d-1), but it is unrecorded in ADR-0010 and the glossary (Critical 1).

## Batches 3c and 3d: application check

| Item | Impact | Status |
|---|---|---|
| 3c-1 | Section 5.5 step 2 (flags stay on a card that leaves the hold with cards left; the last card evaluates and then clears) | Applied |
| 3c-1 | Section 5.6 *Flags* and *Draw Attention* ("until that Titan's next card that evaluates its ladder") | Applied. Stale OQ-111 sentence and Grab wording: Minor 7 |
| 3c-1 | `attention.yaml` `flag_duration`, `changes.card`, `draw_attention.effect`, `on_success`; `behavior-procedure.yaml` `resolving_a_card.decoy` and `holding`; `round.yaml` `per_round_order` | Applied |
| 3c-1 | Catalog `draw-attention` notes | Applied for 3c. Grab exception missing: Minor 6 |
| 3c-1 | `fight.py` `flag_rule` switch, `resolve_card` keeps flags on a non-last hold card | Applied. Tempo 1 rows reproduce |
| 3c-2 | Section 5.6 Feint row: three ways, "their own horse", no gear on foot, the design note (Field Repair clears a Jam, the on-foot price, 37.7%) | Applied. "On foot" missing in the YAML requirement: Minor 4 |
| 3c-2 | Section 5.2 *A grounded Titan* (the Open window; the on-foot Feint pointer); section 5.7 *What Broken does* | Applied |
| 3c-2 | ADR-0010 batch 3c paragraph (the legal-route promise); glossary Feint entry | Applied |
| 3c-3 | `lone.py` `spare` and `repair` switches; `tuning.yaml` `lone_fight` model, column renamed `no_decoy_usable_first`, rows re-run | Applied. Committed rows reproduce exactly (below) |
| 3c-3 | Section 5.13 *The route* bullet, with the lone table's new first row and the definition of "No decoy usable first" | Applied, close to 3c-3's wording |
| 3c-4 | 3b-8 `Revised by batch 3c:` line; `fight.py` comment in `resolve_card` | Applied |
| 3c-5 | `decoys.feint.requirement` word for word; `gear` row; `needs_extra` removed in favour of a comment pointing to `feint_extra` | Applied |
| 3c-6 | `solo_nape.target` quotes ADR-0014's second target word for word | Applied |
| 3c-7 | Glossary Break Attention reset wording, Feint entry, Intent Table "false attacks"; ADR-0010 and ADR-0014 "on the reference table" | Applied |
| 3c-8 | Chapter 3 section 3.2 points to Chapter 5's lone Grab model | Applied |
| 3c-9 | Chapter 5 introduction names OQ-50, OQ-79, OQ-81, OQ-89, and OQ-97 under batch 3b; the DECISIONS Counts line; the governing-source sentences on 3b-1 and 3b-8; like-for-like helper figure (67.8% against 69.3%, both from `cases1.json`) | Applied. The register preamble lags: Minor 7 |
| 3d-1 | ADR-0003 batch 3d paragraph | Applied to ADR-0003. Not carried to ADR-0010 or the glossary's Attention Ladder entry: Critical 1. Checklist item 2 itself unedited: Minor 5 |
| 3d-2 | Glossary Draw Attention and Attention Ladder entries | Applied as worded. The Attention Ladder wording omits the exception: Critical 1 |
| 3d-3 | 3c-1 and 3c-3 cite the committed rows (77.0%) | Applied in the decisions file. ADR-0014 and the OQ-81 register still quote 76.9%: Minor 7 |

**Cross-checks that passed:**

- **Chapter 1.** Nothing quotes a flag, the hold, or the Feint.
- **Chapter 3.** Section 3.2 is fixed, and section 3.7 still quotes the cells.
- **Chapter 4.** Section 4.8 already gives Field Repair's in-fight rules. Its OQ-66 note ("the rounds lost in the fight") agrees with Chapter 5's route text.
- **Chapter 2's Catalog.** `break-attention` is unchanged as 3c-2 directs. Its `requires_gear: false` rolls a no-gear Feint without Gear Dice (`gear_requirement.other_entries`).
- **ADR-0003 item 13.** The Grabbed state still forbids Break Attention by requirement.
- **Item 12.** The on-foot Feint adds no tracked value.

## ADR-0014 targets, re-simulated

Two kinds of run:

- **Committed commands.** Run on the scratchpad copy with `uv run --with pyyaml` and bytecode writing off.
- **Re-seeded runs.** `fight.py` rows were run on their committed case seeds (`7 + index`) with 10 worker processes instead of 12. That changes each chunk's seed, so these rows differ from `tuning.yaml` by sampling.

The independent core (`indep.py`, appendix) imports nothing from the probes.

| Target or row | Committed probe, this run | Independent or re-seeded | Chapter / `tuning.yaml` | Verdict |
|---|---|---|---|---|
| Gas, full canister, two dice | median 8 (`run_simple.py gas 200000`) | exact Markov chain: median 8, mean 9.250 | median 8, mean 9.25 | Met |
| Gas, three dice | median 6 | exact: median 6, mean 6.333 | median 6, mean 6.33 | Met |
| Medium kill, 4 Rookie player characters | | re-seeded: median 3, 62.7% by round 3, 73.4% by round 4, 0.70 Critical Injuries, 0.029 deaths | 3, 62.6%, 73.2%, 0.71, 0.027 | Met: median kill round 3 |
| Lone Rookie fresh cut, Nape Depth 4, Stress 0 / **1** / 2 | 10.0% / **13.1%** / 15.9% | 10.2% / **13.6%** / 16.9% (no Stress Response effects) | 10.0% / 13.1% / 15.9% | Inside 8% to 14% at fight-start Stress 1 |
| Levi-grade, Stress 2 | 47.4% | 47.6% | 47.4% | Meets "about 50%" |
| Grab alone: failed dodge / no dodge | 69.9% / 73.1% | | same | About 2 in 3 |
| Grab, one comrade, S1G0 / **S2G0** / S3G0 / S1G1 / S2G1 / S3G1 | 28.7 / **33.4** / 39.1 / 34.1 / 39.7 / 45.1% | | same | Every cell under 50%; S2G0 near 1 in 3 |
| Lone fight, the rule, Tempo 1 (`lone.py 100000`) | 77.0% usable strike, median round 4 (mean 4.43), 2.94 cards before it, 0.22 Critical Injuries, 3.9% devoured, **0.2% no decoy usable**, 14.2% cut at Stress 2.85, 10.9% kill | batch 3b's route-check row: 76.0% and 8.2% | same | Reproduces exactly |
| Lone fight, Tempo 2: waiting / hurried / one-card hold | 77.4% (6.77 cards, 0.27, 5.0%) / 68.1% (12.1% devoured) / 49.4% | | same | Reproduces |
| Medium, 4 player characters and 2 helper Squadmates | | re-seeded: median 2, 69.7%, 0.64 | 2, 69.3%, 0.65 | The boundary reading stands |
| Medium screen beside the holder, the rule | | re-seeded: median 3, 67.7% by round 3, 78.1% by round 4, 0.45 Critical Injuries, 0.628 cards a round, 0.79 decoy cards, 0.038 Squadmate Feints | 3, 67.8%, 78.5%, 0.45, 0.628, 0.79, 0.038 | Reproduces; still a trade |

The batch 3c `.out` files (`flags_b3c.out`, `lone_b3c.out`, `onfoot_b3c.out`) agree with the `tuning.yaml` rows that quote them. Of those three scripts, only `lone.py` was re-run here, since `lone_b3c.py` imports it unchanged.

---

## Findings

### 1. Critical. Chapter 5: the Grab exception is recorded only for Draw Attention's flag; ADR-0010 and the glossary still say the struck-first and just-hurt flags outlast a holding card

**Location:**

- **ADR-0010:**
  - body, "making a Nape strike counts as hooking in, so a striker who falls short draws the Titan's turn";
  - the batch 3c `## Amended` paragraph, "'just hurt it (until its next card)' reads 'until its next card that evaluates the ladder'".
- **ADR-0003:** the batch 3d `## Amended` paragraph, which amends item 2 (Draw Attention) only.
- **`CONTEXT.md`:** *Attention Ladder* ("just hurt it (until its next card that evaluates the ladder)"), against *Draw Attention*, which names the Grab exception.
- **Chapter 5:**
  - section 5.5 step 1 ("the flags clear");
  - section 5.6 *Flags*;
  - section 5.7 *Nape strikes* ("so a striker who falls short draws the Titan's turn").
- **YAML:** `attention.yaml` `flag_duration`; `behavior-procedure.yaml` `resolving_a_card.holding`.
- **Decisions:** 3d-1 ("the gap was in the ADR's words, not the rule") and 3d-2 ("No other one-card flag wording remains ... ADR-0010's body sentence is amended by its batch 3c paragraph").

**Problem:**

1. **The decided rule.** A card that comes up while the Titan holds a Grabbed soldier evaluates nothing and clears every flag: hooked-by-strike, just-hurt, and loudest. That is 3d-1, as Chapter 5 and both probes apply it.
2. **Only one flag's texts were amended.** OQ-111 found that ADR-0003 item 2's words ("until the Titan's next card that evaluates its Attention Ladder") did not allow this. Batch 3d amended ADR-0003 and the glossary's Draw Attention entry, which concern the loudest flag only.
3. **The same words still stand for the other two flags:**
   - *ADR-0010, as amended:* just hurt it lasts "until its next card that evaluates the ladder". A holding card does not evaluate, so by the ADR it does not clear the just-hurt flag.
   - *The glossary's Attention Ladder entry,* as 3d-2 worded it: the same.
   - *ADR-0010's struck-first sentence* has no exception at all. Yet 3d-1's *Why* explicitly rejects turning a freed Titan on "whoever cut its Nape during the Grab".
4. **Normal play hits it.** The glossary now gives one flag a Grab exception and another none. A soldier who strikes the Nape or the holding arm during a Grab is ordinary, because the reference policy sends every soldier but a ready striker at the hand, and the ready striker cuts.
5. **Frequency on the committed `fight.py`** (12,000 fights a row): a holding card finds a flag standing
   - 0.034 times per reference fight (0.011 hooked-by-strike and 0.025 just-hurt flags cleared);
   - 0.027 with Hook and Cut and Hamstring Line;
   - 0.028 in the Small Titan's screen rows.

   A cleared flag changes the Titan's next target whenever it would have broken a tie.
6. **Why Critical:** it is an ADR and glossary contradiction of exactly the kind OQ-111 was raised and decided for, and no open question logs it for ADR-0010 or the Attention Ladder entry. The fix is wording only: the chapter's rule is the decided one, and no figure moves.

**Scenario:** Wooded, Medium Titan A holds Private Anna Roth, Grabbed in round 4.

1. **Round 5, cards Ilse 4, Mila 8, Titan 11, Jonas 14.**
   - *Card 4.* Ilse, at In Reach, strikes the holding arm for 1 success of the 2 it needs, which sets just-hurt.
   - *Card 8.* Mila, at Blind Spot, makes the Nape strike Anna's hold on Attention allows. She rolls 2 successes against Nape Depth 4, which sets hooked-by-strike.
   - *Card 11.* The Titan holds Anna, so the card resolves nothing. Chapter 5 clears both flags.
   - *Card 14.* Jonas, at In Reach, strikes the arm for the second success. Anna is freed at In Reach, and nothing holds Attention.
2. **Round 6, the Titan's card comes first.** Ilse, Jonas, and Anna are at In Reach, Mila at Blind Spot.
   - **Chapter 5:** no flags. Rung 2 ties three soldiers, nothing narrows them, and the lowest card takes Attention.
   - **ADR-0010:** Mila fell short, so she "draws the Titan's turn".
   - **The glossary's Attention Ladder:** Ilse's just-hurt lasts until this card, the first that evaluates the ladder, so she wins the tie at rung 3.

Three texts give three targets for a Bite.

**Fix options:**

1. **Carry 3d-1 to the other two texts.**
   - Add a paragraph to ADR-0010's `## Amended`: "the flags a strike sets last until the Titan's next card that evaluates the ladder or that comes up while it holds a Grabbed soldier (ADR-0003 item 2, batch 3d), so a striker who falls short while the Titan holds a soldier draws its turn only if the Titan is freed before its next card".
   - Reword the glossary's Attention Ladder entry: "just hurt it (until its next card that evaluates the ladder, or that comes up while it holds a Grabbed soldier)".
   - Cite batch 3d in section 5.7's struck-first sentence.
2. **Or state the flag moment once.** Rewrite ADR-0003 item 2 as a rule for every flag ("A flag, such as Draw Attention's, lasts until ..."), and have ADR-0010 and the glossary point to it rather than repeat it.
3. **Or log it** as an open question beside OQ-111, if the owner wants option (b) of OQ-111 for strike flags only. That is a rule change, and every Grab row re-runs.

### 2. Major. Chapter 5: after a decoy's hold, the struck-first flag is read by a card that resolves nothing and cleared before the card that acts, so a short striker never draws the Titan's behavior and is instead barred from cutting again

**Location:**

- **Chapter 5:**
  - section 5.5 step 2 ("if that was the hold's last card, the hold ends, the ladder is evaluated, and then the flags clear") and step 3;
  - section 5.6 *Flags*, and the design note *Flags under a hold* ("A Nape striker who falls short while a decoy holds a Tempo 2 Titan still draws its turn when the hold ends");
  - section 5.6 *Draw Attention*; section 5.7 *Nape strikes*.
- **YAML:** `behavior-procedure.yaml` `resolving_a_card.decoy` and `attention`; `attention.yaml` `flag_duration`, `on_success`.
- **ADRs:** ADR-0010 body (struck-first sentence) and batch 3c paragraph; ADR-0003 item 2.
- **Decisions:** 3c-1 *Why* ("Keeping flags until the evaluating card restores the rule").
- **Probe:** `fight.py` `resolve_card`, which models it as written.

**Problem:**

1. **What 3c-1 restored.** It kept the hooked-by-strike flag alive until the hold's last card, because only the ladder reads it.
2. **What that card does with it.**
   - It evaluates the ladder, so the striker takes Attention.
   - It resolves nothing, since every card of the hold does.
   - It clears the flags.
3. **What the next card does.** It evaluates the ladder again (step 3), now with no flags. A striker at Blind Spot meets only rung 5, so any comrade at On Body or In Reach takes Attention and the behavior.
4. **Without a hold, it works.** The evaluating card is the acting card, and the striker takes the behavior.
5. **This is not a Tempo 2 edge.** Every hold ends on an inert card, so it happens at Tempo 1 too, whenever a comrade strikes while a decoy holds. That is exactly the Hook and Cut line, and a screen's.
6. **What the rule does instead:**
   - For the one card, the striker holds Attention and so cannot make the follow-up Nape strike that their Openings, or a comrade's, set up.
   - They take no behavior for it.
   - Draw Attention taken while a decoy holds fails the same way: its loudest flag is read by the inert card and gone before the acting one.
7. **Measured on the committed `fight.py`** (12,000 fights a row). `struck.py` counts the evaluations where a hold's last card gives Attention to a flagged striker, and whether the Titan's next resolved behavior targets that striker:

| Case | Holds ending with a flagged striker taking Attention, per fight | Next resolved behavior on that striker, after a hold | Next resolved behavior on a flagged striker, no hold |
|---|---|---|---|
| Medium, 4 player characters, escapes, Hook and Cut and Hamstring Line | 0.19 | **0.0%** | 100% |
| Medium, 4 player characters and 2 Squadmates screening beside the holder, escapes, the same pair | 0.46 | **0.3%** | 100% |
| Small (Tempo 2), the same screen and pair | 0.16 | **0.7%** | 100% |
| Small, the screen, no tactics | 0.15 | **0.0%** | 100% |

8. **Why not Critical.** The rule is deterministic, needs no ruling, and no ADR-0014 target reads it. If the owner reads ADR-0010's "draws the Titan's turn" as its next behavior rather than its Attention, this is an unlogged ADR contradiction and should be treated as Critical.

**Scenario:** Wooded, Medium Titan A (Tempo 1). The Squad holds Hook and Cut.

1. **Round 3.** On Jonas's card 9, he holds Attention at In Reach, fires a flare, and succeeds. Mila, at Blind Spot, cuts at once with Hook and Cut: 3 successes against Nape Depth 4, which sets hooked-by-strike and leaves 3 Openings for comrades.
2. **Round 4, cards Titan 6, Ilse 8, Mila 10, Jonas 14.**
   - *Card 6.* The hold's last card evaluates the ladder. Mila's flag wins, so she holds Attention. The card resolves nothing, and the flags clear.
   - *Card 8.* Ilse, at In Reach, strikes a leg.
   - *Card 10.* Mila holds Attention, so she cannot cut again.
3. **Round 5, the Titan's card 4.**
   - The ladder is evaluated again, with no flags.
   - Jonas and Ilse at In Reach tie at rung 2, and Mila is not in the tie.
   - The lowest card takes Attention, and the Bite lands on Ilse.

A table reading section 5.6's note expects the Titan to turn on Mila. Instead it never does, and the rule cost her a cut.

**Fix options:**

1. **Leave the flags past the card that ends a hold.**
   - The rule: the card that ends a hold evaluates the ladder and leaves the flags. They clear once the Titan's next card evaluates the ladder, or on a holding card.
   - Where it goes: `behavior-procedure.yaml` `decoy`, section 5.5, `flag_duration`, and ADR-0003 item 2.
   - Measured on the same seeds (`fixopt.py`), the next behavior lands on the striker 99.2% to 99.8% of the time, and the fight rows move within sampling:

     | Case | Rule as committed | With this fix |
     |---|---|---|
     | Medium, Hook and Cut and Hamstring Line | 65.6% by round 3, 0.60 Critical Injuries | 65.7%, 0.61 |
     | Medium screen with that pair | median 2, 71.4%, 0.42 | median 3, 70.4%, 0.39 (the boundary this row already sits on) |
     | Small screen with that pair | 88.5%, 0.50 | 87.9%, 0.49 |

   - It needs a decision and a re-run of the Tempo 2 support rows.
2. **Or have the hold's last card evaluate nothing.** It would resolve nothing and leave Attention to nothing, and the Titan's next card would evaluate with the flags standing.
   - This is closer to "the decoy holds for its cards".
   - But in the gap nobody holds Attention, so every Break Attention needs 2. The screen rows must be re-run.
3. **Or accept the lapse and say so.**
   - ADR-0010's `## Amended`, section 5.6's note, section 5.7, and 3c-1's *Why* would state that a strike made while a decoy holds draws the Titan's Attention on the card that ends the hold, barring the striker's next cut until the Titan's next card, and draws a behavior only if the ladder picks them again.
   - This is a fidelity cost at every table that uses Hook and Cut.

### 3. Minor. Chapter 5: in a retreat, a lone soldier at Blind Spot has a legal Break Attention but no legal sequence to the Nape strike, against the promise "in every state in which a Nape strike is legal"

**Location:**

- **Chapter 5:** section 5.10 *The retreat* (forced moves); section 5.6, the Feint design note ("keeps Break Attention available in every state in which a Nape strike is legal").
- **YAML:** `background-titans.yaml` `retreat.effects.moves` ("cannot decline their move").
- **ADR-0010:** batch 3c paragraph ("What it promises is a legal route").
- **Decisions:** 3c-2.

**Problem:**

1. **The strike is legal in a retreat.** Actions are unaffected.
2. **Every move is forced.** Each soldier not Down, Grabbed, or carried must use each move, and it must step toward Distant relative to the earliest-labelled Titan they are not Distant from, unless a fallen comrade gives another option.
3. **A lone soldier at Blind Spot relative to that Titan is stuck:**
   - Break Attention from Blind Spot (flare or cloak), and the same turn's forced move takes them to In Reach.
   - A Feint from On Body or In Reach, and no later move may bring them back toward Blind Spot.
   - The cut needs their next turn at Blind Spot, and no order of move and action gives it.
4. **Where a sequence survives.** Only when the forced move is relative to the other Titan: a soldier at Blind Spot relative to B, while still not Distant from A.
5. **What this is.** Rare, needing two Focus Titans, a third clock, and no comrades, and it needs no ruling. But ADR-0010's promise and section 5.6's note say "every state".

**Scenario:** Titans A and B are in play and a Background clock fills, so the fight becomes a retreat. Private Hanna Vogt is the last soldier standing, at Blind Spot relative to A and holding A's Attention, with one flare left.

1. **Her turn.** She fires the flare and succeeds, then must step to In Reach relative to A.
2. **Her next turn.** She must step to Distant.
3. **The result.** A decoy holds a Titan whose Nape she could legally cut, and the rules never let her reach it.

**Fix options:**

1. **Scope the promise.** ADR-0010's batch 3c sentence and section 5.6's note would read "in every state in which a Nape strike is legal, outside a retreat", with one sentence in section 5.10's note that a retreat closes the lone cut by design.
2. **Or add a retreat option 5.** "Stay put at Blind Spot, if a decoy the soldier placed holds that Titan's Attention." This changes the retreat and needs a decision.

### 4. Minor. Chapter 5: the Feint's grounded way says "on foot" in the prose and glossary but not in the YAML requirement, so a mounted soldier may or may not Feint with no gear item

**Location:**

- **YAML:** `attention.yaml` `decoys.feint.requirement` ("or the Titan is grounded") and `gear` ("on foot against a grounded Titan, no gear item ... A soldier on foot is not mounted").
- **Chapter 5:** section 5.6, the Feint row ("or, on foot, a grounded Titan"); section 5.7 *What Broken does*.
- **Glossary:** Feint ("or on foot against a grounded Titan").
- **Decisions:** 3c-2 (on foot) and 3c-5 (the YAML wording).

**Problem:**

1. **The requirement.** A mounted soldier at In Reach relative to a grounded Titan meets the YAML requirement through grounding alone.
2. **The gear row.** It then names the no-gear way "on foot", and defines on foot as not mounted.
3. **The prose and glossary** allow the no-gear way only on foot.
4. **Why a player would pick it.** A player may prefer no Gear Dice to spare their horse the wear of a Pushed roll (`horses.yaml`). The importer, which reads `requirement`, would offer it; the rulebook forbids it.

**Scenario:** Private Tomas Graf is mounted at In Reach against a grounded Medium Titan, with his canister dry.

1. **His choice.** He names the Feint's grounded way to avoid wearing his rating 2 horse.
2. **The YAML** accepts the requirement.
3. **The gear row and section 5.6** say he is not on foot.

The table needs to choose.

**Fix options:**

1. **Add "on foot" to the requirement.** "... or is not mounted and the Titan is grounded". The prose and glossary already say so.
2. **Or allow any soldier against a grounded Titan to take the no-gear way.** Drop "on foot" from section 5.6, section 5.7, and the glossary.

### 5. Minor. Chapter 5: ADR-0003's checklist item 2 still reads "lasts until the Titan's next card", though the ADR's own precedent edits the list so the checklist is applied as amended

**Location:**

- **ADR-0003:** *Drafting requirements* item 2; the first `## Amended` paragraph ("the superseded wording was removed from the list itself so that the checklist is applied as amended"); the batch 3c and 3d paragraphs.
- **Decisions:** 3d-2 ("No other one-card flag wording remains in CONTEXT.md or `docs/adr/`").

**Problem:**

- **What the paragraphs say.** The batch 3c and 3d paragraphs say what item 2 "reads", but the list still carries the one-card wording.
- **What the precedent says.** Item 9's history set the rule that a drafter applying the checklist reads the list, not the paragraphs.
- **What 3d-2 missed.** Its sweep missed this list line.

**Scenario:** The drafter of the Shifter chapter applies the checklist to an Intent Table flag and writes it to last "until the Titan's next card", which is the wording batches 3c and 3d replaced.

**Fix options:**

1. **Edit item 2 in the list** to its batch 3d wording, as item 9 was edited, and keep the paragraphs as history. If Critical 1's option 2 is taken, item 2 becomes the one flag rule.

### 6. Minor. Chapter 2: the Catalog's `draw-attention` note omits the Grab exception batch 3d added to ADR-0003 item 2

**Location:** `data/character/action-catalog.yaml`, `draw-attention.notes` ("Sets a flag that lasts until the Titan's next card that evaluates its Attention Ladder (ADR-0003, item 2, as amended in decision batch 3c; ...)"). ADR-0003's batch 3d paragraph; `CONTEXT.md` *Draw Attention*.

**Problem:**

- **What the row says.** It is the row a Talent or a Foundry tooltip reads, and it states the flag's end without the holding card.
- **What it cites.** The ADR as of batch 3c.
- **What the other texts say.** The glossary entry and the ADR now name the exception. `flag_duration`, which the note points to, is correct.

**Scenario:** A Drive of the "When I took Draw Attention" kind ("Shield the Walls") rests on the flag. A player reads the Catalog row and expects their loudest flag, set while the Titan holds a comrade, to survive the Titan's holding card.

**Fix options:**

1. **Append the exception.** Add ", or that comes up while it holds a Grabbed soldier" and cite "as amended in decision batches 3c and 3d".

### 7. Minor. Chapter 5: batch 3d bookkeeping left behind

**Location and problem:**

1. **A stale sentence in section 5.6 *Flags*.** "ADR-0003's amended words name no such card, and OQ-111 records the gap." Batch 3d decided OQ-111 and amended ADR-0003, so the sentence is now false. 3d's *Chapter impacts* said "None".
2. **The Grab exception is missing where Draw Attention is stated.**
   - Section 5.6 *Draw Attention* ("lasts until that Titan's next card that evaluates its ladder (ADR-0003, item 2, as amended in decision batch 3c)") and `attention.yaml` `draw_attention.effect` omit it. The YAML reaches it through its pointer to `flag_duration`; the prose does not.
   - `flag_duration` itself, and section 5.6 *Flags*, cite batch 3c only.
3. **A missing exception in section 5.6's *Who holds Attention* list.** It says Attention changes "when one of its cards comes up, except a card that leaves a decoy's hold with cards left", without `attention.yaml` `changes.card`'s "and the Titan does not hold a Grabbed soldier".
4. **Old lone figure.** ADR-0014's batch 3c paragraph ("the usable-strike figure moves within sampling (76.9%)") and OQ-81's register decision line (76.9%) quote the decider's seed. 3d-3 makes the committed 77.0% govern, and Chapter 5 and `tuning.yaml` quote it.
5. **The register preamble** (`OPEN-QUESTIONS.md`, line 12) still says "batch 3b revised OQ-79 and OQ-81 ... and batch 3c revised OQ-81". It omits OQ-50, OQ-89, and OQ-97 under batch 3b, and batch 3d. The DECISIONS Counts line was corrected under 3c-9.

**Scenario:** A reader of section 5.6 goes looking for OQ-111's open gap, finds it Decided with ADR-0003 amended, and cannot tell whether the chapter or the ADR is behind.

**Fix options:**

1. **Replace the stale sentence** with "(ADR-0003, item 2, as amended in decision batch 3d; OQ-111)".
2. **Add the exception** to section 5.6's Draw Attention sentence and to its *changes* list, and cite batch 3d in `flag_duration`.
3. **Quote 77.0%** in ADR-0014's batch 3c paragraph and the OQ-81 register line, or add "(77.0% on the committed seed, which governs)".
4. **Name OQ-50, OQ-89, OQ-97, and batch 3d** in the register preamble.

---

## Round 2 findings: status

### `01-05-decisions-conformance-review-2.md` (Opus)

| Finding | Status | Evidence |
|---|---|---|
| Major 1: a hold clears flags on cards that evaluate nothing | **Resolved as decided** | 3c-1 applied in section 5.5, section 5.6, `behavior-procedure.yaml`, `attention.yaml`, and `fight.py`: no flag is lost before the hold's last card. The card that reads it acts on nothing (new Major 2), and the Grab exception is unrecorded outside ADR-0003 (new Critical 1) |
| Major 2: the lone-route guarantee fails against a grounded Titan | **Resolved** | The on-foot Feint (3c-2) in section 5.6, section 5.7, `attention.yaml`, and the glossary; ADR-0010's legal-route promise. Retreat residual: new Minor 3 |
| Minor 3: the probe counted a spare and a Jam as a closed route | **Resolved** | `lone.py` `spare` and `repair` switches; `no_decoy_usable_first` 0.2%; 77.0% usable, reproduced exactly |
| Minor 4: the record's hold-evaluation sentence | **Resolved** | 3b-8 `Revised by batch 3c:` line; `fight.py` comment in `resolve_card` |
| Minor 5: the Feint's YAML requirement and duplicated value | **Resolved** | 3c-5 wording word for word; `needs_extra` removed; "their own horse" in section 5.6. "On foot" gap: new Minor 4 |
| Minor 6: `solo_nape.target` wording | **Resolved** | Quotes ADR-0014's second target word for word |
| Minor 7: glossary reset wording and the Feint term | **Resolved** | Break Attention "since one of its cards last resolved a behavior"; Feint entry; Intent Table "false attacks" |
| Minor 8: Chapter 3 section 3.2 pointer | **Resolved** | Points to section 5.13 and `tuning.yaml` `grab` |
| Minor 9: bookkeeping and figure slips | **Resolved** | Introduction list and Counts line; governing-source sentences on 3b-1 and 3b-8; like-for-like 67.8% against 69.3%. Register preamble and ADR-0014's 76.9%: new Minor 7 |

### `01-05-decisions-conformance-review-2-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Critical 1: no lone route at Open against a grounded Titan after a Jam | **Resolved** | Field Repair named as the route out of a Jam (section 5.6 note, section 5.13 *The route*, `attention.yaml` `repeatable`, ADR-0010). The on-foot Feint also covers the dry case with no spare. Section 5.2 states the Open window |

### `01-05-decisions-conformance-review-2-fable.md`

| Finding | Status | Evidence |
|---|---|---|
| Minor 1: the route sentence overstated, and the in-fight repair never mentioned | **Resolved** | Section 5.13 *The route* is scoped to the Wooded lone fight and names Field Repair, the spare, and the Open grounded sequence; section 5.6's Feint note; 3b-1's `Revised by batch 3c:` line |

---

## Appendix: models

Every script below ran in the session scratchpad on a copy of the repository, with bytecode writing off. None is committed.

- **Committed runs.** From the copied `tools/probes/chapter-05`:
  - `run_simple.py gas 200000`, `solo 100000`, and `grab 40000`;
  - `lone.py 100000`.
- **`subset.py`.** Imports the committed `fight.py` unchanged and runs `cases1.json` rows 0, 4, and 18 on their seeds (`7 + index`) with 10 processes, 12,000 fights each.
- **`indep.py`.** Imports nothing from the probes.
  - *Gas:* an exact chain over Gas Rating 3 on two or three dice, each 1 lowering the rating.
  - *Fresh cut:* up to three Break Attentions needing 1 (Perception 3, ODM Gear 2), then a Nape strike needing 4 (Strength 4, Talent 1, Blade Set 1), Pushing when short with no Stress Die showing 1. Push wear carries. No Stress Response effects. 200,000 trials per cell.
- **`struck.py`.** Subclasses the committed `fight.py` and adds counters only.
  - *At the card that ends a hold,* whether the ladder gave Attention to a soldier holding hooked-by-strike, and whether the Titan's next card that resolved a behavior targeted that soldier.
  - *At every card with no hold and no Grab,* the same for a flagged striker.
  - *At every holding card,* the hooked-by-strike and just-hurt flags it cleared.
  - *Rows:* `cases1.json` row 0; `cases3.json` rows 5 and 14; row 14 at Small; and the Small screen without tactics. 12,000 fights each.
- **`fixopt.py`.** Subclasses `struck.py`. At the card that ends a hold, it restores the flags after `resolve_card` clears them, so the Titan's next evaluation reads them. It compares with the committed rule on the same seeds: `cases3.json` rows 5 and 14, and row 14 at Small, 12,000 fights each.
