# Chapters 1 to 5: decisions conformance review, round 2

Reviewed:

- `docs/rules/01-core-rules.md`, `02-character-creation.md`, `03-harm-and-mind.md`, `04-gear.md`, and `05-titan-engagement.md`.
- The YAML in `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`, and `data/engagement/`.
- The probes in `tools/probes/chapter-05/` and `tools/probes/batch-3b/`, run from the repository with bytecode writing off. Nothing in the repository was changed; outputs went to the session scratchpad.

Checked against:

- `docs/rules/DECISIONS-2026-09-14.md`:
  - *Batch 3b* (3b-1 to 3b-8) and its chapter impacts;
  - the `Revised by batch 3b:` lines on OQ-50, OQ-79, OQ-81, OQ-89, and OQ-97;
  - *Batch 3*, and the Chapter 5 constraints and *What the Phase 1 simulator must model* as batch 3b edits them.
- ADR-0001 to ADR-0015, including ADR-0010's new `## Amended` paragraph and ADR-0014's batch 3b body and `## Amended` paragraph.
- `CONTEXT.md` (Break Attention, Attention, Attention Ladder, Draw Attention, Opening).
- The register lines for OQ-79, OQ-81, OQ-89, and OQ-97 in `docs/rules/OPEN-QUESTIONS.md`.
- The round 1 reviews: `01-05-decisions-conformance-review-1.md`, `-review-1-codex.md`, and `-review-1-fable.md`.

Not read, as the brief directs: `01-05-decisions-conformance-review-2-codex.md`, `06-standard-titans-review-2*.md`, `docs/rules/06-standard-titans.md`, `data/titans/`, and OQ-100 and later. Pointers from Chapter 5 into Chapter 6 are treated as expected. `screen6_b3b.py` was run only as a smoke test.

Severity:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, a significant odds, balance, or fidelity problem, or a decided rule whose recorded guarantee is false in a reachable case.
- **Minor:** wording, clarity, bookkeeping, or a small gap.

## Verdict

**No Critical findings. Two Majors, seven Minors.**

**Batch 3b is applied completely.** Every chapter impact 3b-1 to 3b-8 names is present in prose and YAML, with no stale batch 3 escalation wording: no "decoys spent", "never resets", or `per_decoy_already_spent` survives in the five chapters, their YAML, or the rule text of either probe. Batch 3's rule survives only as a labelled sensitivity switch. Every ADR-0014 target reproduces (table below).

**The rule works for the ordinary lone fight.** Decoys in a row, the Feint, and a hold of Tempo cards give a lone Rookie a usable strike in 76.0% of fights at Tempo 1 and 77.0% at Tempo 2. The Titan's own resolved card always brings the Feint back to need 2. The Squad screen stays a trade (0.624 cards a round, 0.44 Critical Injuries per fight).

**The decoy's hold is unambiguous in the chapter.** The drafter read it as evaluating the Attention Ladder only on the hold's last card. Chapter 5 sections 5.5 and 5.6, `attention.yaml` (`changes`, `card`), and `behavior-procedure.yaml` (`resolving_a_card`, `decoy`) all say exactly that, and it is the only coherent reading. The decision record's sentence says every card of the hold re-evaluates the ladder, which should be corrected (Minor 4).

**The two Majors come from applying the rule, not from its choice:**

1. **The hold clears flags that no evaluation reads.** Every card of a hold clears the Titan's flags, but only the last evaluates the ladder. Against a Tempo 2 Titan, a Nape striker who falls short early in a hold loses the hooked-by-strike flag before anything reads it. ADR-0010's "a striker who falls short draws the Titan's turn" then fails: 0.175 flags lost per fight in the Small Titan screen with Hook and Cut.
2. **Batch 3b's route guarantee is false in one reachable history.** The chapter says the route closes "only when the ODM Gear Jams or runs dry ... which also ends the Nape strike itself". A grounded Titan's Nape needs no working ODM Gear. So a lone soldier who is dry, with no spare canister, no sound horse, no flares, and no cloak can stand at Blind Spot with a legal Nape strike and no legal Break Attention.

**The seven Minors:**

- the lone probe counts a dry soldier with a spare canister, and a repairable Jam, as a closed route (5.4 of the 8.2 points are the spare);
- the decision record's hold sentence, which the chapter departs from without a note;
- the Feint's YAML requirement omitting gas, and a duplicated value;
- `tuning.yaml`'s `solo_nape.target` still quoting batch 3's wording;
- the glossary's "since it last acted" and the unlisted term Feint;
- a stale Chapter 3 pointer to a model section 3.7 no longer holds;
- batched bookkeeping and figure slips.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 1, Core Rules | 0 | 0 | 0 |
| Chapter 2, Character Creation | 0 | 0 | 0 |
| Chapter 3, Harm and Mind | 0 | 0 | 1 |
| Chapter 4, Gear | 0 | 0 | 0 |
| Chapter 5, Titan Engagement | 0 | 2 | 6 |
| **Total** | **0** | **2** | **7** |

A finding that also touches an ADR, the glossary, the decisions file, OPEN-QUESTIONS, or a probe is counted under the chapter it most affects, and its location names every file.

---

## Batch 3b: application check

| Item | Impact | Status |
|---|---|---|
| 3b-1 | Section 5.6 needs list (1 more for a Feint; plus decoys in a row, with the count's start, rise, reset, and the cards that leave it) | Applied |
| 3b-1 | Section 5.6 *The decoys*: the Feint row (requirement, gear, spends nothing, works against Broken eyes, 1 more) | Applied (YAML wording: Minor 5) |
| 3b-1 | Section 5.6 OQ-81 design note: decoys in a row, the Feint, the lone soldier, Rejected | Applied; figures follow `tuning.yaml` |
| 3b-1 | Section 5.3 *What the GM tracks* and `round.yaml` `gm_tracker.focus_titan_row`, `per_round_order`, `titan_card_checklist`, example `Decoys 0` | Applied |
| 3b-1 | `attention.yaml` `needs` (`feint_extra`, `per_decoy_in_a_row`), `needs_rule`, `on_success`, `decoys.feint` | Applied |
| 3b-1 | `behavior-procedure.yaml` `resolving_a_card.next` resets the count; `decoy` leaves it | Applied |
| 3b-1 | `action-catalog.yaml` `break-attention.needs` and `attention-shift` renamed "shift a Focus Titan's Attention onto a decoy and raise its decoys in a row"; `changes` unchanged | Applied, word for word; section 5.14's row matches (round 1 Minor 4 closed) |
| 3b-1 | `grab.yaml` `escapes.break-attention` and section 5.9's table (2, 1 more for a Feint, plus decoys in a row) | Applied |
| 3b-1 | Section 5.12 OQ-89 note; `squad-tactics.yaml` unchanged | Applied |
| 3b-1 | `tuning.yaml` `decoys` rows and `titan_cards_resolved_per_round` re-run; `fight.py` `ba_rule` default `holder_in_a_row`, reset in `titan_card`, `screen2` Feints | Applied; rows reproduce (below) |
| 3b-1 | Section 2.8 | Nothing to change: it does not quote the needs |
| 3b-2 | Section 5.13 lone-soldier note: `lone_fight` rows (the rule, no Feint, no escalation, batch 3, the cap), where to break Attention, the band's measurement point, the route, Tempo 2 | Applied (route sentence: Major 2 and Minor 3) |
| 3b-2 | Section 5.13 OQ-79 note quotes ADR-0014 as amended | Applied |
| 3b-2 | `tuning.yaml` `solo_nape.measurement_point`, `verdict`, `lone_fight` from a committed `tools/probes/chapter-05/lone.py`, `card_order_wait` kept as the bound, `simulator_cases` in-fight cut with its Stress | Applied (`target` field: Minor 6) |
| 3b-2, 3b-4 | ADR-0014 body: the fresh-cut band and the gas medians and means; `## Amended` paragraph | Applied; `tuning.yaml` `gas.target` quotes it |
| 3b-3 | OQ-97's list reads 8, 6, and 6 with 10 | Applied in the decision record and register; `round.yaml` and section 5.3 already agreed |
| 3b-5 | Fall Back "before Wings are assigned or kept" in section 5.12 and `squad-tactics.yaml` | Applied |
| 3b-6 | `sheet-fields.yaml` `squad_sheet_row` (name "the soldier's name", purpose, dash, positions always filled); section 4.12 | Applied |
| 3b-7 | Section 3.7: standing models and rescue contract replaced by the decided figures and pointer; section 3.12 pointer | Applied. Section 3.12 now points to section 5.13 and `tuning.yaml` rather than section 5.9; "permitted" is gone. Residual pointer in section 3.2: Minor 8 |
| 3b-8 | Section 5.6 hold sentence and design note; section 5.5 step 2; `attention.yaml` `changes.card`, `changes.decoy`, `on_success`; `behavior-procedure.yaml` `decoy` and `next_behavior.rolled_when`; tracker "Att: flare, 1 left" | Applied (flags: Major 1; record wording: Minor 4) |
| 3b-8 | Section 5.13 *Decoys*: the Small Titan's screen rows are Chapter 6's | Applied |
| 3b-8 | `fight.py` `hold_left = t.tempo`, `decoy_hold` switch; no Chapter 5 figure moves | Applied; Tempo 1 rows unchanged |
| ADR-0010 | `## Amended` paragraph: "for the Titan's next cards, as many as its Tempo" | Applied; the body is left as written, as 3b-8 directs |
| Glossary | Break Attention entry as staged | Applied (wording: Minor 7) |

**Cross-checks that passed:**

- **Chapter 1.** No change needed; nothing there quotes Break Attention's needs or the hold.
- **Chapter 4.** `horses.yaml`, `items.yaml`, and `squad-supply.yaml` already point to `attention.yaml` and need nothing for the Feint.
- **ADR-0003:**
  - item 11 (every entry's fields): unaffected;
  - item 12: holds, since the one act that changes the new counter names it in `changes`;
  - item 13: the Grabbed state still forbids Break Attention by requirement.
- **ADR-0015.** The countdown is untouched.
- **Rejected alternative stays rejected.** The Thrash conversion stays out.
- **No unmeasured screen exploit.** A holder who Feints on every free turn blanks few cards. With 4 Rookie player characters against the Medium Titan it drops cards resolved from 0.855 to 0.799 a round and Critical Injuries from 0.72 to 0.67 per fight, with the kill unchanged (62.4% by round 3). The holder is rarely at In Reach or On Body with an action to spare.

## ADR-0014 targets, re-simulated

The committed commands in `tuning.yaml` (`probes`, `commands`) were run from the repository. The fight subset was re-run in a different case order, which changes its seeds. The independent core (appendix) imports nothing from the probes.

| Target or row | Committed probe, this run | Independent or re-seeded | Chapter / `tuning.yaml` / decision | Verdict |
|---|---|---|---|---|
| Gas, full canister, two dice | median 8 (`run_simple.py gas`) | exact: median 8, mean 9.250 | median 8, mean 9.25 | Met as ADR-0014 now words it |
| Gas, three dice | median 6 | exact: median 6, mean 6.333 | median 6, mean 6.33 | Met |
| Medium kill, 4 Rookie player characters (12,000 fights) | median 3, 62.6% by round 3, 73.2% by round 4, 0.71 Critical Injuries, 0.027 deaths | re-seeded: 3, 62.1%, 72.7%, 0.72, 0.028 | 3, 62.6%, 73.2%, 0.71, 0.03 | Met: median kill round 3 |
| 4 player characters and 2 helper Squadmates | re-seeded: median 2, 69.5% | re-seeded: median 3, 68.2% | median 2, 69.3% (boundary noted) | Reproduces; the boundary reading stands |
| Lone Rookie fresh cut, Nape Depth 4, Stress 0 / **1** / 2 | 10.0% / **13.1%** / 15.9% | 10.1% / **13.5%** / 16.8% (no Stress Response effects) | 10.0% / 13.1% / 15.9% | In the 8% to 14% band at its pinned point |
| Levi-grade, Stress 2 | 47.4% | 47.9% | 47.4% | Meets "about 50%" |
| Break Attention by need, Rookie, 1 / 2 / 3 / 4 | 82.6% / 49.6% / 20.6% / 5.6% | 82.5% / 49.7% / 20.7% / 5.6% | same | Reproduces |
| Grab alone: failed dodge / no dodge | 69.9% / 73.1% | | 69.9% / 73.1% | About 2 in 3 |
| Grab, one comrade, S1G0 / S2G0 / S3G0 / S1G1 / S2G1 / S3G1 | 28.7 / **33.4** / 39.1 / 34.1 / 39.7 / 45.1% | | same | Every cell under 50%; S2G0 near 1 in 3 |
| Lone fight, the rule, Tempo 1 (`lone.py`, 100,000): usable strike, median round, cards before it, cut, kill, route closed | 76.0%, 4, 2.88, 14.2% at Stress 2.81, 10.8%, 8.2% | spare canister counted: 76.5%, route closed 3.1% (Minor 3) | 76.0%, 4, 2.88, 14.2%, 10.8%, 8.2% | Reproduces exactly; the route figure is overstated |
| Lone fight, Tempo 2, waiting line / one-card hold | 77.0% / 49.4% | `lone_t2_b3b.py`: 77.1% / 49.5% | 77.0% / 49.4% (decision 77.1% / 49.5%) | Reproduces |
| Screen beside the holder, the rule (`screen_b3b.py` E) | 0.624 cards a round, 0.44 Critical Injuries, 67.9% by round 3, 0.03 Squadmate Feints | committed `fight.py` re-seeded: 0.629, 0.46, 67.5%, median 3 | decision 0.624 and 0.44; `tuning.yaml` 0.628 and 0.45, 67.8% | Reproduces; still a trade |
| Screen, batch 3's rule / decoys in a row without the Feint / no escalation | 0.663 and 0.49 / 0.633 and 0.44 / 0.603 and 0.43 | re-seeded: 0.659 and 0.47 / 0.632 and 0.45 | 0.665, 0.633, 0.601 | Reproduces |
| Helpers (screen_b3b) | 0.836, 0.65, 68.9% | | 0.836 and 0.65 | Reproduces |
| Card-order wait, the rule (`run_simple.py wait`) | median 4, 50.6%, 69.0%, 92.3%, 2.45 cards | | same | Reproduces |

**The probes run as committed.** All eleven commands exit 0 from the repository:

- **Batch 3b scripts.** They find their files through their own directory, and `lone_b3b.py`, `lone_t2_b3b.py`, and `screen_b3b.py` reproduce their committed `.out` files to the digit.

**They model the rules as written, with three differences:**

- **Flags during a hold.** `fight.py` clears the flags on every card of a hold. That is the rule as written, and the source of Major 1.
- **The hold's evaluation.** `fight.py` evaluates the ladder on every card of a hold and then restores the decoy, which gives the same result as evaluating only on the last card.
- **The route check.** `lone.py` ends a fight as "exhausted" when the soldier is dry with a spare canister or Jammed, and it has no Field Repair (Minor 3).

---

## Findings

### 1. Major. Chapter 5: a hold of Tempo cards clears flags on cards that evaluate nothing, so against a Tempo 2 Titan a Nape striker who falls short can escape the struck-first rule

**Location:**

- **Chapter 5:**
  - Section 5.5, *Resolving a card*, step 2 ("the flags clear" on every card of a hold).
  - Section 5.6, *Flags* ("each clears once the Titan's next card has come up") and *Draw Attention* ("until that Titan's next card").
- **YAML:**
  - `data/engagement/behavior-procedure.yaml`: `resolving_a_card`, `decoy` ("Clear the flags for this Titan" whether or not the hold has cards left).
  - `data/engagement/attention.yaml`: the `flags` comment; `changes.card` ("only the hold's last card ends it and evaluates the Attention Ladder"); `draw_attention.effect`.
- **ADRs:** ADR-0010, body ("a striker who falls short draws the Titan's turn") and `## Amended`; ADR-0003, item 2.
- **Probe:** `tools/probes/chapter-05/fight.py` `resolve_card`, which models it as written.

**Problem:**

1. **Two rules that used to coincide no longer do.**
   - *Clearing.* A flag clears once the Titan's next card has come up.
   - *Reading.* Only the ladder reads a flag.
   - *Under a hold of Tempo cards,* the first card of a Tempo 2 hold clears every flag but evaluates nothing (3b-8).
2. **What is lost.** A soldier who makes a Nape strike after the decoy is laid and before that first card sets hooked-by-strike, and the flag is gone before the last card evaluates. The same happens to the just-hurt flag and to Draw Attention's loudest flag.
3. **When it happens.** It does not happen at Tempo 1 (every hold is one card), or outside a hold. It lands exactly on the Hook and Cut line, where the tactic's Nape strike comes at once after the decoy succeeds.
4. **Which rules it breaks:**
   - ADR-0010's struck-first sentence, the reason the `struck-first` evaluation step exists.
   - The intent of ADR-0003 item 2: a Draw Attention taken early in a Tempo 2 hold does nothing.
5. **Frequency.** My counter on the committed `fight.py` counts hooked-by-strike flags present when a non-last card of a hold clears them (12,000 fights a row):

| Case | Flags cleared unread, per fight |
|---|---|
| Medium (Tempo 1), any support | 0.000 |
| Small (Tempo 2), 4 player characters, the holder Feints on free turns | 0.061 |
| Small, 4 player characters and 2 Squadmates screening beside the holder, Hook and Cut and Hamstring Line | **0.175** |
| Small, 4 player characters, holder Feints, Hook and Cut and Hamstring Line | 0.089 |

About one supported Small Titan fight in six contains a failed Nape striker whom the Titan never turns to, because of card timing alone.

**Why not Critical:** the result is deterministic and needs no ruling, the struck-first rule still works whenever no hold spans two cards, and no ADR-0014 target reads it (the Chapter 5 targets are Tempo 1).

**Scenario:** The Squad fights the Small Titan (Tempo 2) at Wooded and holds Hook and Cut. Round 2's cards are Jonas 3, the Titan 7 and 15, and Mila 12.

1. **Card 3.** Jonas, holding Attention at In Reach, breaks Attention with a flare (needs 1) and succeeds. The hold has 2 cards left. Mila, at Blind Spot, declares Hook and Cut and strikes at once. She makes 2 successes against Nape Depth 3 and sets hooked-by-strike.
2. **Card 7.** The decoy step: the hold falls to 1, nothing is evaluated, and the flags clear.
3. **Card 15.** The hold's last card evaluates the ladder. Mila, at Blind Spot with no flag, meets no rung above nearest. Jonas at In Reach meets "nearest person in reach" and takes Attention back.

A table that reads ADR-0010 expects the Titan to turn on Mila. Before batch 3b, card 7 would have evaluated with her flag and done so.

**Fix options:**

1. **Keep flags through a hold.** In `behavior-procedure.yaml` (`decoy`) and section 5.5, clear the flags only on the card that ends the hold (the one that evaluates). State in `attention.yaml` (`flags`) that a flag lasts until the Titan's next card that evaluates its ladder. ADR-0003 item 2 then reads as intended, and no Tempo 1 figure moves.
2. **Or tie flags set during a hold to its end.** A flag set while a decoy holds clears after the hold's last card is evaluated. This is equivalent in play, but a second rule.
3. **Or accept the lapse in so many words** in ADR-0010's `## Amended` paragraph and in section 5.6. This is a fidelity cost at every Tempo 2 table, and needs a decision.

### 2. Major. Chapter 5: batch 3b's lone-route guarantee is false against a grounded Titan, where a dry lone soldier can have a legal Nape strike and no legal Break Attention

**Location:**

- **Chapter 5:**
  - Section 5.13, *A lone soldier after Break Attention*, bullet *The route* ("it closes only when the ODM Gear Jams or runs dry with no sound horse left (8.2%), which also ends the Nape strike itself").
  - Section 5.6, *The decoys*, Feint ("with working ODM Gear or mounted on a horse that is not lame"), and the design note ("the lone soldier's Break Attention that never runs out").
  - Section 5.7, *What Broken does* (a grounded Titan: "Nape strikes and Body Part strikes against it need no working ODM Gear"; close steps on foot).
- **YAML:** `data/engagement/attention.yaml` (`decoys.feint.requirement`); `data/engagement/titan-harm.yaml` (`grounded`); `data/engagement/tuning.yaml` (`lone_fight.model`, "the route is closed").
- **ADR-0010:** `## Amended` ("a repeatable Feint decoy so that it never runs out").
- **DECISIONS 3b-1:** *Why* ("the route now closes only by a Jam or running dry (8.2%), which also closes the Nape strike itself").

**Problem:**

1. **What the guarantee rests on.** Batch 3b accepts that the lone route can close through gear, because working ODM Gear is what the Nape strike needs anyway.
2. **Where that fails.** A grounded Titan's Nape strike needs no working ODM Gear, and every close step against it can be made on foot.
3. **The dead end.** A lone soldier is stuck while all of these hold:
   - their Gas Rating is 0 with no spare canister, so Change Canister cannot end running dry;
   - their horse has bolted as a decoy or is lame;
   - the Squad Supply has no flare;
   - their cloak is thrown, or the Titan's eyes are Broken;
   - the Titan has a Broken leg.

   They can walk to Blind Spot and would have a legal Nape strike with 2 Bonus Dice. But they hold Attention, and no decoy's requirement can be met: the Feint needs working ODM Gear or a mount. Nothing in Chapters 1 to 5 moves Attention off them.
4. **Each step is ordinary play:**
   - leg strikes are the reference Squad's plan, from In Reach with no gear need;
   - a canister and one spare empty over a long fight;
   - Standard Issue at Funding 3 gives two flares;
   - the horse and cloak are the decoys the chapter tells a soldier to spend first.

   The soldier is lone when every comrade has left, died, or is being carried out.
5. **Not a stall.** The rules still resolve the fight (the soldier leaves, or the Titan's cards end it), so the dead end needs no GM ruling. It does contradict the guarantee batch 3b and ADR-0010's amendment state.
6. **A Jam is not a closure.** Field Repair can clear a Jam with Wits alone and be retried (`field-repair.yaml`, `gear`, `in_titan_engagement.retry`). So "Jams" in the chapter's sentence overstates the closure (see Minor 3).

**Scenario:** Private Anna Roth's Squad has Broken the Medium Titan's left leg at Wooded. Her comrades are Down and carried out, so she is alone.

1. **What she has spent.** Earlier she sent her horse (it bolted), the Squad fired both flares, and she threw her cloak. Her canister and spare ran dry in round 7.
2. **What she can still do.** On foot she steps from In Reach to Blind Spot, a close step the grounded Titan allows. Her Nape strike is legal without working ODM Gear and would gain 2 Bonus Dice. She holds Attention, so she cannot make it.
3. **What she cannot do.** She names a Feint; it needs working ODM Gear or a mount. Flare, horse, and cloak are gone.
4. **How it ends.** For the two rounds before Regeneration stands the Titan up, the one soldier with a legal cut can do nothing that leads to it.

**Fix options:**

1. **Let the Feint be made on foot against a grounded Titan.** In `attention.yaml` (`decoys.feint.requirement`) and section 5.6: "with working ODM Gear, mounted on a horse that is not lame, or on foot against a grounded Titan". The roll then has no gear item (Perception alone), at the same need. Re-run `lone.py` with a grounding line to report it.
2. **Or allow a Feint with no gear item anywhere at 1 more still** (need 3 for the holder). Re-run the `decoys` screen rows, since Squadmates could then Feint dry.
3. **Or record the closure as accepted.** State it in 3b-1's *Why*, ADR-0010's `## Amended` ("never runs out while the soldier has working ODM Gear or a sound horse"), and section 5.13's route bullet, naming the grounded Titan as the one case where the Nape strike survives it.

### 3. Minor. Chapter 5: the lone probe's "route closed first" counts a dry soldier with a spare canister, and a Jam that Field Repair clears, so the 8.2% overstates a closure the rules do not impose

**Location:** `tools/probes/chapter-05/lone.py`: `any_decoy_left` and the end-of-round check in `run` after the Gas Roll. `tuning.yaml` `lone_fight` (`route_closed_first`, `model`). Section 5.13, bullet *The route*. DECISIONS 3b-1 *Why* ("(8.2%)").

**Problem:**

1. **When the check runs.** After the end-of-round Gas Roll, `run` ends the fight as exhausted when `any_decoy_left` is false.
2. **What it misses.** `feint_usable` tests `odm_working()`, which is false at Gas Rating 0 even when the soldier carries a spare. The soldier's own turn would change the canister first (`soldier_turn`), but the check fires before that turn comes.
3. **What else is left out.** The model has no Field Repair, so a Jam ends the fight too.
4. **The measurement.** I re-ran the committed model with one change: a soldier with Gas Rating 0, a spare canister, and unjammed ODM Gear still has a usable decoy. 100,000 lone fights, seed 304:

| Case | Usable strike | Route closed | Of which dry with a spare | Devoured | Still waiting at round 12 |
|---|---|---|---|---|---|
| Tempo 1, as committed | 76.0% | 8.2% | 5.4 points | 3.1% | 9.3% |
| Tempo 1, spare counted | 76.5% | 3.1% | 0 | 3.6% | 13.0% |
| Tempo 2 waiting line, as committed | 77.1% | 2.7% | 1.7 points | 4.6% | 10.2% |
| Tempo 2, spare counted | 77.3% | 1.0% | 0 | 4.9% | 11.1% |

   The 3.1% left at Tempo 1 is almost all Jams (3.2% of fights Jam), which Field Repair with Wits alone can clear.
5. **What the chapter's figure is.** "The route closes first in 8.2% of lone fights" is mostly a probe artefact. Under the rules the route rarely closes within 12 rounds; `dry` with no spare is 0.0% to 0.2%.
6. **Stakes.** The usable-strike figure barely moves, and nothing is tuned on this column.

**Scenario:** A reader of section 5.13 concludes that one lone fight in twelve simply runs out of options. At the table the soldier changes canisters or repairs the harness and goes on, and the Phase 1 simulator's author, coding from the model statement, reproduces the wrong closure.

**Fix options:**

1. **Fix the check.** In `lone.py` `any_decoy_left`, count unjammed ODM Gear with a carried spare. Add a Field Repair line for a Jammed soldier (Wits, no gear unless a tool kit is held). Re-run the `lone_fight` rows.
2. **Or rename the column.** Call it "no decoy usable at a round's end, before Change Canister or Field Repair" in `tuning.yaml` and section 5.13. Drop "closes" from the route bullet and 3b-1's *Why*.

### 4. Minor. Chapter 5: the decision record says every card of a hold re-evaluates the ladder, while the chapter and YAML evaluate only on the last card, with no note of the reading

**Location:**

- **DECISIONS 3b-8** *Decision* ("Each of those cards resolves nothing, spends the Next Behavior, and re-evaluates the ladder; the last of them ends the hold").
- **Chapter 5:** section 5.5 step 2 and section 5.6 ("except a card that leaves a decoy's hold with cards left").
- **YAML:** `attention.yaml` `changes.card`; `behavior-procedure.yaml` `resolving_a_card.decoy`.
- **Probe:** `fight.py` `resolve_card`, which evaluates on every card and then restores the decoy in `titan_card`.

**Problem:**

1. **The chapter is unambiguous.** Only the hold's last card evaluates the ladder:
   - section 5.5 says "if that was the hold's last card, the hold ends and the ladder is evaluated; otherwise the decoy keeps Attention";
   - section 5.6 excludes a card that leaves the hold with cards left from the moments Attention changes;
   - `attention.yaml` says "only the hold's last card ends it and evaluates the Attention Ladder".
2. **The drafter's reading is the only coherent one.** A mid-hold evaluation would name a soldier holder while the decoy holds. That soldier could not make a Nape strike and would need 1 on Break Attention, which contradicts "the decoy keeps Attention". `lone.py` models this reading.
3. **The probe gets the same result another way.** `fight.py` evaluates every card and overwrites the result with the decoy.
4. **The gap.** The decision record's literal sentence says otherwise, and no `Revised on apply:` line records that the drafter departed from it. The next decider or simulator author will find two texts.

**Scenario:** The Phase 1 simulator's author implements 3b-8 as written: each hold card evaluates and sets the holder, then the decoy is restored. Between the two Tempo 2 hold cards, their Nape-strike check reads the evaluated holder and bars that soldier's strike, where the chapter allows it.

**Fix options:**

1. **Correct the record.** Add a `Revised on apply:` line to 3b-8: "Each of those cards resolves nothing and spends the Next Behavior; only the last ends the hold and evaluates the ladder (Chapter 5 sections 5.5 and 5.6)."
2. **Mark the probe.** Add a comment in `fight.py` `resolve_card` that the evaluation on a non-last hold card is overwritten and has no effect.

### 5. Minor. Chapter 5: the Feint's YAML requirement omits gas, which the chapter's "working ODM Gear" includes, and its extra need is stored twice

**Location:** `data/engagement/attention.yaml`: `decoys.feint.requirement` ("has ODM Gear that is not Jammed or is mounted on their own horse that is not lame"), `decoys.feint.needs_extra: 1`, and `break_attention.needs.feint_extra: 1`. Chapter 5 section 5.6, the Feint row ("with working ODM Gear or mounted on a horse that is not lame"). `data/gear/odm-gear.yaml` (`strikes`, `running_dry`).

**Problem:**

- **Gas.** Chapter 4 defines working ODM Gear as "not Jammed, and with a Gas Rating above 0". The YAML row says only "not Jammed". A reader can reach the right answer through `running_dry` ("counts as not had for every Action Catalog entry"). But the row that is the source of truth for the requirement does not say it, and the prose and YAML use different tests.
- **Two sources for one value.** The extra success is stored in `needs.feint_extra` and again in `decoys.feint.needs_extra`, against ADR-0012's single source. A later retune of one leaves the other stale.
- **Whose horse.** The prose drops "their own".

**Scenario:** The Foundry importer builds the Feint's eligibility from `decoys.feint.requirement`. A soldier whose canister and spare are empty still sees Feint offered with ODM Gear. The roll is ODM use (Gas Roll) with a Gear Die from gear that counts as not had.

**Fix options:**

1. **Rewrite the requirement.** "has working ODM Gear (data/gear/odm-gear.yaml, strikes: not Jammed, Gas Rating above 0), or is mounted on their own horse that is not lame". Match the prose's "their own horse". Replace `needs_extra: 1` with a pointer to `needs.feint_extra`.

### 6. Minor. Chapter 5: `tuning.yaml`'s `solo_nape.target` still quotes batch 3's wording of the target it says is amended by batch 3b

**Location:** `data/engagement/tuning.yaml` `solo_nape.target` ("between 8% and 14% at the Rookie's fight-start Stress of 1 ... (ADR-0014, as amended in decision batches 3 and 3b; OQ-79)"). ADR-0014, body, second target.

**Problem:**

- **What the ADR body now reads:** "between 8% and 14% on a cut made directly after Break Attention from the Rookie's fight-start Stress of 1, with the cut a lone soldier makes after the cards they took while waiting reported beside it and not tuned".
- **Where the new wording lives.** `measurement_point` carries the substance, and section 5.13's OQ-79 note quotes the body.
- **The stale field.** `target` keeps the ambiguous batch 3 wording that 3b-2 set out to remove, while citing 3b as its source.
- **Precedent.** Batch 3 had the target fields quoted word for word, and round 1 checked that they were.

**Scenario:** A simulator author reads `solo_nape.target` alone, the field their harness keys on, and flags the 14.2% in-fight cut as a miss. That is the re-litigation 3b-2 was written to stop.

**Fix options:**

1. **Quote the ADR-0014 body's second target word for word** in `solo_nape.target`.

### 7. Minor. Chapter 5: the glossary's Break Attention entry says "since it last acted", which does not match the reset rule, and Feint is a new rules term with no entry

**Location:** `CONTEXT.md`, *Break Attention* ("harder for each decoy the Titan has fallen for since it last acted") and *Shifter Intent Table* ("deliberate tactics such as feints"). Chapter 5 section 5.6, design note *Decoys in a row* ("a Titan fooled again before it has acted"). `attention.yaml` `needs_rule` ("since the last of its cards that resolved a behavior").

**Problem:**

- **Two texts for the reset.** The rule resets the count only when a card resolves a behavior. A card that resolves nothing (under a hold, while holding a Grabbed soldier, or while no one holds Attention) leaves it. "Since it last acted" leaves open whether a Titan that spent a card holding a victim, or on a decoy, has acted.
- **The term.** Feint is now a named decoy the Catalog and YAML key on, but it has no glossary entry. The glossary already uses "feints" for Shifter tactics.

**Scenario:**

1. A Titan holds a Grabbed soldier for a card.
2. A comrade's flare frees them, and that flare's hold ends the Titan's next card.
3. A player reads the glossary: the Titan "acted" by holding the soldier, so they claim the count reset before the flare, and the next flare needs 1.
4. The needs rule says the count is still 1, so the flare needs 2.

**Fix options:**

1. **Reword the glossary.** "harder for each decoy the Titan has fallen for since one of its cards last resolved a behavior".
2. **Add a Feint entry.** "A decoy for Break Attention: the soldier's own pass across a Focus Titan's face from In Reach or On Body, which spends nothing and needs 1 more success", with `_Avoid_: bait, taunt`. Reword the Shifter line to avoid the collision if the owner wants the term reserved.

### 8. Minor. Chapter 3: section 3.2 still calls the Rookie "the victim in the lone-Rookie Grab model in section 3.7", which 3b-7 removed

**Location:** Chapter 3 section 3.2, design note *Reference builds* ("It is the victim in the lone-Rookie Grab model in section 3.7"). Section 3.7 as rewritten ("The models this chapter recorded before Chapter 5 was drafted ... are withdrawn").

**Problem:**

- **What 3b-7 did.** Section 3.7 now quotes Chapter 5's figures and names section 5.13 and `tuning.yaml` (`grab`) as the only source. It holds no model.
- **What still points there.** Section 3.2's sentence sends a reader to a model that no longer exists.
- **A pointer that is fine.** The sentence two paragraphs later ("the rescue cells in section 3.7") still works, because section 3.7 quotes the cells.

**Scenario:** A reader following the reference Rookie from section 3.2 reaches section 3.7, finds the withdrawal notice, and must search for Chapter 5's `grab` model on their own.

**Fix options:**

1. **Point to the source.** "It is the victim in the lone Grab model of Chapter 5 (section 5.13, `data/engagement/tuning.yaml`, `grab`), whose figures section 3.7 quotes."

### 9. Minor. Chapter 5: batched bookkeeping and figure slips

**Location and problem:**

1. **The chapter introduction lists too few revised entries.** It reads "with OQ-79 and OQ-81 as revised under *Batch 3b*" (line 58). OQ-89 and OQ-97 also carry `Revised by batch 3b:` lines that change what the chapter states (Hook and Cut's needs, the helpers' boundary, Fall Back's moment, the Squad sheet row). The DECISIONS header's Counts line ("revised for OQ-79 and OQ-81 under *Batch 3b*") has the same omission, and OQ-50 too.
2. **Record figures and chapter figures differ by sampling:**

   | Figure | Decision record (3b-1, 3b-8) and OQ-81 register | Chapter 5 and `tuning.yaml` |
   |---|---|---|
   | Tempo 1 lone fight | 75.9% | 76.0% |
   | Tempo 2 waiting line | 77.1% | 77.0% |
   | One-card hold | 49.5% | 49.4% |
   | Devoured at Tempo 2 | 4.7% | 4.6% |
   | Squadmate Feints per fight | 0.03 | 0.04 (0.038) |

   OQ-81's revised line makes `tuning.yaml` govern, so these are harmless. A reader comparing the ADR-0010 amendment ("about three lone fights in four") with the register will still see two sets.
3. **The OQ-81 design note compares figures from two runs.** The note gives the screen's kill as "67.8% by round 3 against 69.3%". The 67.8% is `tuning.yaml`'s screen row. The 69.3% is its `squads` helpers row, from a different run; `screen_b3b.py`, the run the decision's screen figures come from, gives 68.9% for the same helpers case. The comparison holds either way, but it is not like for like.

**Scenario:** A decider checking whether the Tempo 2 hold made the lone line "the same at Tempo 1 and 2" reads 77.1% against 75.9% in the register and 77.0% against 76.0% in the chapter. They cannot tell whether the probes were re-run, and asks for a re-run that changes nothing.

**Fix options:**

1. **Fix the lists.** Add OQ-89 and OQ-97 (and OQ-50 in the Counts line) to both lists of batch 3b revisions.
2. **Note the governing source.** Add one sentence to 3b-1 and 3b-8, or the register, that the committed `lone.py` and `tuning.yaml` rows govern where they differ from the staged scripts by sampling. Quote the helpers' by-round-3 figure from the same run as the screen row it is compared with.

---

## Round 1 findings: status

### `01-05-decisions-conformance-review-1.md` (Opus)

| Finding | Status | Evidence |
|---|---|---|
| Major 1: escalation's lone cost misstated; the probe policy wasted decoys | **Resolved** | 3b-1 and 3b-2 revise the rule and withdraw the sentences (`Revised by batch 3b:` on OQ-79 and OQ-81). Section 5.13 reports `lone_fight` on the informed policy and the decoy budget. `card_order_wait` is kept and labelled the bound on waste. The section 5.6 note no longer says the lone figures "do not move". |
| Minor 2: the band's measurement point | **Resolved** | ADR-0014 body; `tuning.yaml` `solo_nape.measurement_point`; section 5.13. Residual `target` wording: Minor 6. |
| Minor 3: decision-record figures and the inverted cap comparison | **Resolved** | OQ-81's batch 3b line quotes the committed rows (0.413 and 0.25, 0.601 and 0.42, the cap 0.509 against 0.538), withdraws "buys less than escalation", and makes `tuning.yaml` govern. |
| Minor 4: decoy counter with no tracked value | **Resolved** | `attention-shift` now "shift a Focus Titan's Attention onto a decoy and raise its decoys in a row"; section 5.14 row. |
| Minor 5: ADR-0014 gas wording | **Resolved** | Body reads "about 9 rounds of ODM use (median 8, mean 9.25), about 6 when pushing every round (median 6, mean 6.33)". |
| Minor 6: Fall Back's moment | **Resolved** | "before Wings are assigned or kept" in section 5.12 and `squad-tactics.yaml`. |
| Minor 7: Squad sheet row worded for Squadmates | **Resolved** | `sheet-fields.yaml` name "the soldier's name", purpose with the dash rule, positions always filled; section 4.12. |

### `01-05-decisions-conformance-review-1-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Critical 1: finite decoys close the lone route | **Resolved for the finite-decoy history; still open in one gear history** | The reset and the repeatable Feint keep the route open whenever the soldier has working ODM Gear or a sound horse. Against a grounded Titan, a dry soldier with no decoy left has a legal Nape strike and no Break Attention (Major 2). |
| Critical 2: Chapter 3 section 3.7's stale Grab contract | **Resolved** | Section 3.7 quotes Break Free 2, 69.9% and 73.1%, and the six one-comrade cells, and withdraws the old models; section 3.12 points to section 5.13. Stale pointer in section 3.2: Minor 8. |
| Minor 3: OQ-97's clock list | **Resolved** | 3b-3; OQ-97's batch 3b line and register line read 8, 6, and 6 with 10. |

### `01-05-decisions-conformance-review-1-fable.md`

| Finding | Status | Evidence |
|---|---|---|
| Major 1: OQ-79 and OQ-81 lone reasoning measured without escalation | **Resolved** | Withdrawn and replaced by the full lone-fight rows under the revised rule. The cap's rejection now rests on the screen rows and the lone model (3b-2). |
| Minor 2: the naive policy's "median of 6" | **Resolved** | Section 5.13 quotes `lone_fight` and says where to break Attention (after the Titan's card, from In Reach, from Blind Spot with a flare or cloak, from Distant only at Urban and Giant Forest). `card_order_wait.model` warns that the 1,000-round horizon inflates a median. |
| Minor 3: the in-fight cut at the band's top edge | **Resolved** | The band is pinned to the fresh cut. The in-fight 14.2% at Stress 2.81 is reported beside it (ADR-0014, `tuning.yaml`, section 5.13). |
| Minor 4: "after starting at Distant" not modelled | **Resolved** | Dropped from OQ-79's revised line. The committed `lone.py` has Positions and starts mounted at Distant. |

---

## Appendix: models

All scripts ran in the session scratchpad and are not committed. The committed probes were run from the repository with `PYTHONDONTWRITEBYTECODE=1`, as `tuning.yaml` (`commands`) and each batch 3b script's docstring give them.

- **Committed runs.** From `tools/probes/chapter-05`:
  - `run_simple.py gas 200000`, `solo 100000`, `wait`, and `grab 40000`;
  - `lone.py 100000`;
  - `fight.py` on cases 0, 4, 6, 18, 27, and 28 of `cases1.json` (re-seeded by their order), 12,000 fights each.

  From `tools/probes/batch-3b`:
  - `screen_b3b.py 12000`, `lone_b3b.py 100000`, and `lone_t2_b3b.py 100000`;
  - `screen6_b3b.py 600` and `cardorder.py 20000`, as smoke tests.
- **Independent core (`indep.py`).** Written from Chapters 1 and 4. It imports nothing.
  - **Gas.** An exact Markov chain over Gas Rating 3 on two or three dice. Each 1 lowers the rating by 1.
  - **Dice.** Base dice are attribute plus Talent; Gear Dice are the current rating; Stress Dice equal Stress. A 6 succeeds.
  - **Push.** When short with no Stress Die showing 1: add 1 Stress and a Stress Die, then re-roll the base and Stress Dice not showing 6. Gear Dice showing 1 on a Pushed roll wear the item.
  - **Not applied.** Stress Response effects.
  - **Fresh cut.** Up to three Break Attentions needing 1 (Perception 3, ODM Gear 2, no Talent), then a Nape strike needing 4 (Strength 4 and Talent 1, Blade Set 1). 200,000 trials per cell.
- **Holder Feint and flag lapse (`holderfeint.py`).** Subclasses the committed `fight.py`, imported read-only.
  - **Holder Feint.** A player character who holds Attention at In Reach or On Body, with working ODM Gear, an unspent action, and no decoy holding, Feints first. It needs 1, plus decoys in a row, plus 1, and Pushes; then the normal turn follows.
  - **Flag counter.** Counts hooked-by-strike flags present when a card of a hold that is not its last is resolved, and so cleared.
  - **Runs.** 12,000 fights a row on 4 processes.
- **Spare canister (`lonespare.py`).** Subclasses the committed `lone.py`.
  - **`Tag`.** Records, for each fight ended as exhausted, whether the soldier had unjammed ODM Gear, Gas Rating 0, and a spare canister.
  - **`Fix`.** Also counts that state as a usable decoy.
  - **Runs.** 100,000 lone fights a row, seed 304, at Tempo 1 and at Tempo 2 on the waiting line.
