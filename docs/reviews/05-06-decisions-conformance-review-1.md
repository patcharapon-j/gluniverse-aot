# Chapters 5 and 6: decisions conformance review, round 1

Reviewed:

- `docs/rules/05-titan-engagement.md` and `docs/rules/06-standard-titans.md`.
- The YAML in `data/engagement/` and `data/titans/` (with `roster.yaml` renamed `index.yaml`, OQ-110), and the Attention rows of `data/character/action-catalog.yaml` (`draw-attention`, `break-attention`, `attention-shift`, `draw-attention-set`).
- The probes in `tools/probes/chapter-05/`, `chapter-06/`, `batch-3b/`, `batch-3c/`, and `batch-3e/`. Every run used a copy of the repository in the session scratchpad, so nothing in the repository was written.

Checked against:

- `docs/rules/DECISIONS-2026-09-14.md`: *Batch 3e* (3e-1 to 3e-6) and its chapter impacts, the `Revised by batch 3e:` lines on OQ-81's batch 3 entry, 3c-1, 3d-1, and 3d-2, batches 3 to 3d beneath them, and *Constraints on the undrafted Phase 1 chapters* (Chapters 5 and 6).
- ADR-0003 (item 2 in the list and the batch 3e paragraph), ADR-0010 (the batch 3e paragraph), and ADR-0014 (the batch 3e paragraph), with ADR-0001 to ADR-0015 behind them.
- `CONTEXT.md`: Attention, Attention Ladder, Draw Attention, Break Attention, Feint, Blind Spot, and Abnormal.
- `docs/rules/OPEN-QUESTIONS.md`: OQ-81, OQ-100 to OQ-111, and the register preamble.
- The previous round: `01-05-decisions-conformance-review-3.md`, `-review-3-codex.md`, `06-standard-titans-review-3.md`, and `-review-3-codex.md`.

Not read, as the brief directs: `05-06-decisions-conformance-review-1-codex.md`.

Severity:

- **Critical:** contradicts an ADR or the glossary without being logged as an open question, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**One Critical, one Major, five Minors.**

**The previous round's three Critical and Major items are resolved.**
- **(a) and (b).** ADR-0003 item 2, ADR-0010's batch 3e paragraph, `CONTEXT.md`, the Catalog's `draw-attention` note, Chapter 5 (prose, `attention.yaml`, `behavior-procedure.yaml`), Chapter 6 (introduction, section 6.6), and both fight probes state one flag lifetime. Each previous-round scenario now gives one target in every text, confirmed by driving the committed `fight6.py` through it (*Check 1*).
- **(c).** The Sprinting Abnormal's ladder names `current-holder`. Its GM section, `index.yaml` `reads_as`, OQ-102, OQ-103, and every Abnormal figure now describe the Titan the procedure runs. The bar holds on fresh seeds (helpers 0.0204 ± 0.0005 deaths against the Large twin's 0.0209 ± 0.0007).
- **The `nearest` procedure** is one procedure in ADR-0010, the glossary, `attention.yaml`, section 5.6, and Chapter 6's rendered ladder.

**The Abnormal as re-decided has a new Critical (finding 1).**
- **What the ladder does at the start.** A Titan Engagement starts with every soldier at Distant and no cards dealt, so the first evaluation always falls to the last tie-break: "the soldier listed first on the Squad sheet".
- **Why it matters now.** With `current-holder` that soldier stays the Abnormal's quarry until noise, a Nape strike, or a soldier On Body turns it. No rule sets the Squad sheet's order.
- **What the probe assumed.** It lists the cutters first. List the strikers first and nothing else, and the supported rows break the ceiling:
  - helpers 0.0368 deaths against the Large twin's 0.0212 (+15.8 standard errors);
  - the screen +9.9;
  - the screen with Hook and Cut and Hamstring Line +9.0.
- **A random first holder** also fails, with helpers +5.3 and the screen +3.0.

**A second consequence of `current-holder` is a Major (finding 2).** A quarry who stays mounted at Distant takes almost nothing from the Abnormal's table. A Squad that lists such a rider first halves the Abnormal's Critical Injuries (0.61 against 1.26 with the same rider listed last). That is below what the standard Medium Titan deals to the same Squad (0.95).

**The rest of batch 3e is applied.**
- **Figures.** Every figure the drafter reports reproduces exactly on the committed commands and within sampling on fresh seeds.
- **Tables.** Every table is complete and rollable (`titans.py`: 0 problems; `render.py check`: every block matches; the horse selftest passes).
- **The rename.** Every `index.yaml` pointer resolves to a key that exists, and no `roster.yaml` pointer survives outside history.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 2, Character Creation (Catalog Attention rows) | 0 | 0 | 0 |
| Chapter 5, Titan Engagement | 0 | 0 | 4 |
| Chapter 6, Standard Titans | 1 | 1 | 1 |
| **Total** | **1** | **1** | **5** |

A finding that also touches an ADR, the glossary, the decisions file, the register, or a probe is counted under the chapter it most affects, and its location names every file. Finding 1's root is a Chapter 5 tie-break, but only the Abnormal's `current-holder` rung makes it matter, so it is counted under Chapter 6.

---

## Check 1: one flag lifetime and one `nearest` procedure

### The texts, side by side

| Text | Flag lifetime | `nearest` |
|---|---|---|
| ADR-0003, item 2 (edited in the list) | "lasts until the end of the Titan's next card that resolves a behavior; a card that resolves nothing leaves it standing" | not stated |
| ADR-0010, batch 3e paragraph | The same, for all three flags. It names the three inert cards (a decoy's hold, a Grab, no holder) and says "during a Grab, the first acting card after the release" lands on the striker | "the closest Position any candidate holds: when it is the highest rung met, the Titan turns to whoever stands closest, and only a tie at equal distance keeps its current target"; `current-holder` is for Abnormals |
| `CONTEXT.md` | Draw Attention: "until the end of the Titan's next card that resolves a behavior". Attention Ladder: "just hurt it (until its next card that resolves a behavior)", without "the end of" (Minor 5) | "nearest (the closest Position)" |
| Catalog `draw-attention.notes` | Same as ADR-0003, with the three inert cards | not stated |
| Chapter 5: section 5.5 steps 1 to 3 and 8; section 5.6 *Flags*, *Draw Attention*, *Break Attention*; section 5.7 *Nape strikes*; `flag_duration`, `changes.card`, `draw_attention.effect`, `on_success`; `resolving_a_card` `holding`, `decoy`, `attention`, `next` | Same, with every card that clears or keeps the flags named | Section 5.6 rung 5 and evaluation steps 1, 3, 4; `tests.nearest`; `evaluation` `top`, `narrow`, `holder` |
| Chapter 6: the introduction, section 6.6 *Support rows*, `data/titans/tuning.yaml` `probes.files.fight6.py` | Same, quoted in full | Same; the rendered ladder carries `tests.nearest` word for word |
| `fight.py` and `fight6.py` | `flags="acting"`: a holding card, every card of a hold, and a card with no holder keep the flags; `resolve_card` clears them only after a behavior resolves | `nearest="narrows"`; `fight6.py` meets `current-holder` with `t.holder is s` |

The two glossary entries differ by three words. Otherwise the texts agree.

### The previous reviews' scenarios, walked

Each was driven through the committed `fight6.py` (`scen.py`, appendix), which implements Chapter 5's card procedure and ladder line for line.

**(a) The Grab round** (01-05 review 3, Critical 1). Medium Titan A holds Anna.
1. **The strikes.** Ilse strikes the holding arm (just-hurt). Mila makes a short Nape strike from Blind Spot (hooked-by-strike).
2. **The Titan's holding card.** It resolves nothing and leaves both flags standing.
3. **The release.** Jonas frees Anna with an arm strike (just-hurt). Anna is at In Reach, and nothing holds Attention.
4. **Round 6, the Titan's card first.** Rung 1 is met by Mila's flag, and the struck-first step keeps her.

**Single target in every text: Mila.** The Bite falls back to Thrash against her at Blind Spot, and the flags clear at the Next step. On the Sprinting Abnormal's ladder the target is also Mila, since hooked is its highest rung met.

**(b) A decoy's hold, then a short Nape strike, against a Tempo 2 Titan** (01-05 review 3, Major 2, at Tempo 2; the Small Titan).
1. **Round 3.** Jonas, holding Attention at In Reach, fires a flare (hold 2). Mila cuts at once with Hook and Cut and falls short (hooked).
2. **Round 4, the Titan's first card.** The hold has 1 card left. Nothing resolves, and the flags stand.
3. **Ilse's card.** She strikes a leg (just-hurt).
4. **The Titan's second card.** The hold ends, and the ladder gives Mila Attention. Nothing resolves, both flags stand, and decoys in a row stays 1. Mila cannot cut on her card.
5. **Round 5, the Titan's first card.** The ladder gives Mila Attention again, and the behavior resolves against her. The flags clear, and decoys in a row returns to 0.

**Single target of the Titan's next behavior in every text: Mila.** This matches 3e-1's *Why* and ADR-0010's "under a hold, the hold's last card gives the striker Attention and the next acting card lands on them".

**(c) The Sprinting Abnormal with no one loud or On Body** (06 review 3, Critical 1). Striker Bram holds its Attention at Blind Spot with no flag. Ilse and Kurt are In Reach.

| Case | Target |
|---|---|
| **Ladder as committed:** `current-holder` is the highest rung met | Bram (a Grab falls back to Thrash) |
| **The same, with Bram Down at Distant** | Bram |
| **The ladder without `current-holder`** | Ilse, by the lowest card (a Grab lands) |
| **Nothing holds Attention** (a hold has just ended) | Ilse |

The GM section's bullets, `reads_as`, OQ-102's *Canon for (b)*, the rendered ladder, and the procedure all give Bram, so the ladder and its description agree. What decides Bram at the start of a fight is finding 1.

## Check 2: the Sprinting Abnormal as re-decided

- **GM text, `reads_as`, OQ-102, OQ-103.**
  - All four describe a runner that keeps its quarry until noise, a Nape strike, or a soldier On Body turns it.
  - All four say that only when nothing holds its Attention does it go for the nearest.
  - Each figure quoted (1.45, 0.76, and 0.18 a fight; 12.7, 10.4, and 8.0 standard errors without the rung; Nape Depth 4 failing) is in `abnormal_b3e.out`.
- **The bar, as committed** (`results/bar.json`, every row read against its twins; appendix):
  - Every part holds in every row.
  - The ceiling's closest rows are helpers (+0.26 standard errors), the screen (−1.60), and the screen with the pair (−1.80).
  - The floor's closest is the screen with the pair: 0.443 Critical Injuries against 0.384, +19.8 standard errors on the permitted side.
- **The bar, on fresh seeds** (120,000 fights a row): helpers −0.58, the screen −1.40, the screen with the pair −1.18. It holds.
- **Fidelity, 845 to 850.**
  - Chapter 22's runner ignores the soldiers in its reach and the riders cutting at its legs, which the ladder's missing reach and pain rungs model.
  - "Once it has picked its way it keeps to it" is a fair reading of a quarry.
  - The pick itself is not faithful as written: at every fight start it is the first name on a sheet (finding 1).
  - A rider who parks the quarry at Distant has a canon echo in riders leading Titans off, but it turns the Abnormal into the easiest Medium-class fight (finding 2).

## Check 3: tables, pointers, and wording

- **Every table.**
  - Results 1 to 6 with the terrorize, control, and kill pairs, one Thrash, and one telegraph (Small Lurch Closer, Medium Fixed Grin, Large Loom, Abnormal Veer).
  - No back-to-back repeat survives the move-up.
  - Every combination of previous behavior and Broken eyes, arms, and legs leaves at least one legal entry besides Thrash (fewest: Small 3, Medium 2, Large 3, Abnormal 1).
  - The highest kill share is 0.50 on every table.
- **The rename (OQ-110).**
  - Pointers to `data/titans/index.yaml` appear in `attention.yaml`, `background-titans.yaml`, `engagement-setup.yaml`, `read.yaml`, `titan-format.yaml`, `data/harm/health.yaml`, `data/mind/scars.yaml`, the four `data/titans/` stat files, Chapter 5, Chapter 6, and the register.
  - Each key named (`standard_titans`, `abnormals`, `ladders`, `grab_mark`) exists.
  - `titans.py`, `run6.py`, and `render.py` load it.
  - "roster" survives only in the glossary's _Avoid_ line, the decisions file, and OQ-110's question, as history.
- **Batch 3e's chapter impacts.** Every item in *Chapter impacts of batch 3e* is present. Chapter 6's provenance sentence reads as 3e directs, and the pre-round-2 flag figures are gone from section 6.6.
- **Tags.**
  - No `PROVISIONAL:` tag cites a decided entry.
  - `attention.yaml` lists OQ-111 under `decided`.
  - Chapter 6's tags cite only OQ-100 to OQ-109, all Open.
- **Earlier chapters.**
  - Chapter 2's Catalog rows match `needs_rule` and `flag_duration`.
  - Chapter 3's `down.yaml` points to `down_can_meet`.
  - `round.yaml` `per_round_order` clears flags "when the card resolved a behavior".

## Check 4: figures, re-simulated

Two kinds of run:

- **Committed commands.** Run on the scratchpad copy with `uv run --with pyyaml` and bytecode writing off. Every figure reproduced exactly.
- **Fresh seeds.** `rows.py` (appendix) imports the committed probes unchanged.

| Figure | Committed command, this run | Fresh seed or independent | Chapter | Verdict |
|---|---|---|---|---|
| Gas, full canister, two dice / three dice | median 8 / 6 (`run_simple.py gas 200000`) | Exact chain (`gas.py`): median 8, mean 9.250 / median 6, mean 6.333 | median 8 (mean 9.25) / 6 (6.33) | Met |
| Medium kill, 4 Rookie player characters, standard Medium Titan | | 12,000 fights: median round 3; 62.2% by round 3; 72.8% by round 4; 0.69 Critical Injuries; 0.032 deaths; 0.202 Grabs | 3, 62.8%, 73.3%, 0.68, 0.031, 0.200 | Met |
| Lone Rookie fresh cut, Nape Depth 4, Stress 1 (Stress 0) | 13.1% (10.0%), Chapter 5; 13.3% (10.1%), Chapter 6 | 200,000: 13.13% (9.94%) | 13.1% and 13.3% | Inside 8% to 14% |
| Levi-grade, Stress 2 | 47.4% (Chapter 5), 47.2% (Chapter 6) | 47.42% | 47.2% | About 50% |
| Veteran, Stress 2; Rookie at Nape Depth 3, Stress 1 | 32.1%; 33.1% (Small), 33.4% (Abnormal) | 32.03%; 33.36% | same | Reported |
| Grab alone, failed dodge | 69.9% (Chapter 5), 69.4% (Chapter 6) | 120,000: 70.0% | 69.4% | About 2 in 3 |
| Grab, one comrade, S2 G0 / S3 G1 | 33.4% / 45.1% (Chapter 5); 33.3% / 44.4% (Chapter 6); Abnormal 33.4% | 60,000: 33.77% / 44.92%; Abnormal 33.87% | 33.3% | Near 1 in 3; every cell under 50% |
| Lone usable strike, waiting line: Medium / Large / Small / Abnormal | 77.0% / 76.1% / 72.5% / 52.0% (0.2 / 0.2 / 0.0 / 0.0% with no decoy usable) | 100,000: 76.6% / 76.4% / 72.4% / 51.7% | same | Reproduces |
| Lone fight, Tempo 2 on the reference table: waiting / hurried / one-card hold | 77.4% / 68.1% / 49.4% | | same | Reproduces |

**Screen rows, fresh seeds** (12,000 fights a row). Each cell gives, in order: killed by round 3, Critical Injuries per fight, and Titan cards resolved per round.

| Titan | 2 helpers | Screen beside the holder | Hook and Cut and Hamstring Line | Screen with that pair | Screen against helpers |
|---|---|---|---|---|---|
| Small | 86.7%, 0.80, 1.489 | 87.0%, 0.53, 1.108 | 82.9%, 0.78, 1.458 | 88.7%, 0.49, 1.071 | cards −26%, Critical Injuries −33% |
| Medium | 68.0%, 0.64, 0.835 | 66.8%, 0.43, 0.633 | 66.2%, 0.60, 0.790 | 69.6%, 0.39, 0.592 | −24%, −33% |
| Large | 67.7%, 1.27, 0.854 | 66.1%, 0.90, 0.651 | 64.7%, 1.20, 0.805 | 69.6%, 0.77, 0.609 | −24%, −29% |
| Sprinting Abnormal | 80.4%, 0.72, 1.538 | 80.9%, 0.51, 1.179 | 77.8%, 0.70, 1.489 | 83.9%, 0.45, 1.144 | −23%, −30% |

Every row matches the rendered support table within sampling. The Abnormal's fresh reference start gives median round 2, 75.0% by round 3, 0.82 Critical Injuries, and 0.077 deaths.

**The Abnormal's bar rows** (120,000 fights a row; deaths ± standard error; a positive gap is past the ceiling):

| Row | Committed `bar.json` | Fresh seeds | Strikers listed first (`order_bar.py`) | Random sheet order per fight (`order_rand.py`) |
|---|---|---|---|---|
| Reference start | 0.0722 ± 0.0012 against Large 0.1635 (−37.8) | | 0.126 against 0.1675 (−15.7); median round 3, 11.4% with no kill | 0.1027 against 0.1632 (−24.0) |
| 2 helper Squadmates | 0.0198 ± 0.0005 against 0.0196 ± 0.0006 (+0.26) | 0.0204 against 0.0209 (−0.58) | **0.0368 against 0.0212 (+15.8)** | **0.0256 against 0.0207 (+5.3)** |
| Screen beside the holder | 0.0098 against 0.0106 (−1.60) | 0.0099 against 0.0106 (−1.40) | **0.0163 against 0.0107 (+9.9)** | **0.0109 against 0.0094 (+3.0)** |
| Screen with Hook and Cut and Hamstring Line | 0.0083 against 0.0092 (−1.80) | 0.0078 against 0.0083 (−1.18) | **0.0125 against 0.0080 (+9.0)** | 0.0080 against 0.0076 (+0.9) |

---

## Findings

### 1. Critical. Chapter 6: the Sprinting Abnormal's quarry for the whole fight is the soldier listed first on the Squad sheet, an order no rule sets, and its bar holds only under the probe's cutters-first order

**Location:**

- **Chapter 5:**
  - section 5.1 step 5 and `engagement-flow.yaml` `starting` (the ladder is evaluated after placement, before any card is dealt);
  - `positions.yaml` `placement` and section 5.1 *Where they start* (every soldier at Distant);
  - `attention.yaml` `evaluation` steps `card` ("Skip this step if no cards have been dealt this round, or if the evaluation is made at an end step") and `sheet` ("the tied soldier listed first on the Squad sheet"), and section 5.6 evaluation steps 5 and 6.
- **Chapter 4:** `data/gear/sheet-fields.yaml` `squad_sheet_row` and section 4.12: one line per soldier, in no stated order.
- **Chapter 6:**
  - section 6.5, GM section bullets "Then the one it is already running down" and "Only then whoever is nearest ... (when the fight begins ...) ... Ties at the same distance go to the lowest card, then the Squad sheet", and the design note *Why current-holder*;
  - `data/titans/index.yaml` `ladders` `reads_as`;
  - section 6.6, the bar design note ("It holds every part of its bar in every row") and *How the fights compare* ("For every Squad, supported or not, it deals no more deaths than the Large Titan's row");
  - `data/titans/tuning.yaml` `verdicts.sprinting_abnormal`.
- **Register:** OQ-102 (*Canon for (b)*, *How often it runs its quarry down*) and OQ-103 (*Figures under (a)*).
- **Probes:** `fight.py` `build_squad` (roles in the order cutter, cutter, striker, striker, then Squadmates), `run` (`evaluate(end_step=True)`), and `evaluate`'s final `t.holder = tied[0]`.

**Problem:**

1. **The first evaluation always ties.** Every Titan Engagement starts with every soldier at Distant and no cards dealt. For the Sprinting Abnormal no one is loud, On Body, hooked, or holding its Attention, so `nearest` is met by everyone and the `card` step is skipped. The soldier listed first on the Squad sheet takes Attention, which `scen.py` (d) confirms on the committed code.
2. **Before batch 3e this was harmless.** A standard Titan re-evaluates at its first card and turns to whoever came In Reach.
3. **With `current-holder` it lasts.** The Sprinting Abnormal keeps that soldier "wherever they stand" until noise, a Nape strike, or a soldier On Body turns it. At the committed start it is kept against a closer soldier 1.45 times a fight.
4. **Nothing orders the Squad sheet.** Neither `sheet-fields.yaml` nor any chapter says who lists the soldiers or in what order. The GM section tells the GM only that ties go "then the Squad sheet". Whoever wrote the sheet chose the Abnormal's quarry for the fight, which is a choice no rule makes (ADR-0003; Chapter 5's *No rulings*: "The GM never decides ... who holds Attention").
5. **The figures depend on it.** The probe lists a cutter first, so every Abnormal figure measures a Titan fixed on a cutter at In Reach. Listing the strikers first, with nothing else changed (120,000 fights a row, twins under the same order):
   - **Reference start:** median kill round 3 (committed: 2), 63.1% by round 3 (74.6%), 11.4% with no kill (5.1%), 1.06 Critical Injuries (0.82), 0.126 deaths (0.072), 0.435 Grabs (0.322).
   - **Ceiling:** helpers 0.0368 deaths against the Large Titan's 0.0212 (+15.8 standard errors); the screen 0.0163 against 0.0107 (+9.9); the screen with the pair 0.0125 against 0.0080 (+9.0).
   - **Random order per fight** (what a roll would give): helpers +5.3 and the screen +3.0 still fail; the pair holds (+0.9).
6. **Why Critical.**
   - The chapter's acceptance test for the stat block ("holds every part of its bar in every row") is true only under an order the rules never state, the same shape as last round's (c).
   - The quarry for the whole fight is decided by an unassigned list, which is a choice outside every rule.
   - No open question logs it.
7. **Fidelity.** Canon's runner picks where it goes by what it sees. This one picks by whose name is written first.

**Scenario:** the interim setup table gives the Sprinting Abnormal. The Squad sheet happens to read Bram (striker), Mila (striker), Ilse (cutter), Kurt (cutter), in the order the players sat down. Every soldier starts mounted at Distant.

1. **The start.** The first evaluation ties all four at Distant, so Bram takes its Attention.
2. **Round 1.** Bram rides in and flies to Blind Spot. He holds Attention, so he cannot cut. Ilse and Kurt cut its legs untouched while its two cards a round go to Bram: Pitch Headlong or Thrash knocks him loose to In Reach, then its Grab and Headlong Lunge reach him.
3. **Round 2.** Mila falls short at the Nape, and her flag turns it onto her. From then on she is its quarry.
4. **Another table.** The same Squad with Ilse's name first fights the committed Titan, where Ilse at In Reach is the quarry and both strikers cut freely.
5. **The difference.** 0.126 against 0.072 deaths per fight. With two helper Squadmates, one table's Abnormal is inside the bar and the other breaks its ceiling by 15.8 standard errors.

**Fix options:**

1. **Chapter 5: take the fight-start tie out of the sheet.** At the start and at an end step, let the ladder leave Attention held by nothing, so the Titan's first card evaluates with the `card` step, or break the tie with a roll named in `evaluation`. Then re-run every Abnormal row and re-choose its values against the bar: under a random first holder, helpers fail by 5.3 and the screen by 3.0 standard errors as the stat block stands.
2. **Chapter 6: let `current-holder` keep only a quarry the Titan has acted on.** Met by the soldier who held its Attention when its last card resolved a behavior, so the start's tie-break chooses nothing that lasts. This needs a decision on the test's `meaning` in `attention.yaml`, and every Abnormal row re-runs.
3. **Or state an order and bar the worst one.** Give `sheet-fields.yaml` a stated order (for example player characters in the players' chosen order, then Squadmates), and hold the Abnormal's bar under the order worst for it. That reads the bar the way a table can play it. As measured, strikers first fails by 9.0 to 15.8 standard errors, so the values move. In every option, section 6.5's bullets, `reads_as`, OQ-102, and OQ-103 must say how the quarry is first chosen.

### 2. Major. Chapter 6: a quarry who stays mounted at Distant draws almost nothing from the Sprinting Abnormal's table, so a Squad can park it and fight the easiest Medium-class Titan in the chapter

**Location:**

- **Chapter 6:**
  - section 6.5, GM section bullets "Then the one it is already running down. ... A holder who flies to Blind Spot or rides out to Distant is still its quarry" and "Riders ... a rider it is already running down stays its quarry at Distant";
  - the design note (OQ-102, OQ-103);
  - `data/titans/sprinting-abnormal.yaml` (only Run Past, Veer, and Trample meet a holder at Distant, and a mounted holder is not knocked loose);
  - `data/titans/tuning.yaml` `targets.abnormals.not_trivial` and `cases6.json` (no row with a parked quarry).
- **Chapter 5:** `attention.yaml` `tests.current-holder`.

**Problem:**

1. **What reaches a holder at Distant.** Against a mounted holder at Distant the Sprinting Abnormal's six results give:
   - Run Past (Stress 1) and Veer (Stress 1);
   - Trample (a leg Critical Injury that cannot be lethal, Severity 2, dodged with the horse);
   - Pitch Headlong, Grab, and Headlong Lunge, which each fall back to Thrash, whose knock-loose does nothing to a mounted soldier at Distant.
2. **What `current-holder` adds.** It keeps that holder ahead of every cutter at its legs, so the other soldiers work unharmed until a Nape strike or a soldier On Body turns it.
3. **The tactic is legal and easy to find.** Who holds Attention is public, and a Read reveals the ladder. So a Squad lists a rider first (finding 1) or rides its quarry out, and parks them there.
4. **Measured** (subclassing the committed `fight6.py` only to set the roles and sheet order; 24,000 fights a row; mounted start; the other three soldiers play the baseline):

| Row | Killed by round 3 | No kill in 12 rounds | Critical Injuries per fight | Deaths per fight | Grabs per fight | Cards against the first-listed soldier |
|---|---|---|---|---|---|---|
| Abnormal, rider listed first | 75.7% | 7.2% | **0.61 ± 0.009** | 0.070 ± 0.002 | 0.143 | 2.69 |
| Abnormal, the same rider listed last | 67.5% | 11.5% | 1.26 ± 0.012 | 0.143 ± 0.003 | 0.386 | 2.89 |
| Abnormal, rider first, strikers wait | 73.4% | 5.8% | 0.62 | 0.056 | 0.117 | 4.25 |
| Abnormal, rider last, strikers wait | 53.2% | 13.6% | 1.82 | 0.192 | 0.568 | 4.30 |
| Standard Medium Titan, rider listed first | 49.7% | 13.1% | **0.95 ± 0.008** | 0.083 | 0.275 | 0.26 |

   The parked quarry halves the Abnormal's Critical Injuries and deaths. Its 0.61 Critical Injuries are 28 standard errors under what the standard Medium Titan deals the same Squad. That is the bar's own floor ("at least the Medium twin's Critical Injuries") failing under a legal policy no row tests.

5. **Why Major and not Critical.** The bar is defined at the baseline policy, which this is not, and the rule needs no ruling. It is a significant balance problem the chapter does not state, in the one Abnormal Phase 1 plays.

**Scenario:** the Squad has read the Abnormal's ladder in an earlier fight. Private Tomas Graf rides at the front, so he is its quarry from the start.

1. **Tomas parks.** He stays mounted at Distant and takes Break Attention with his horse only if someone is Grabbed.
2. **The others work.** Ilse and Kurt hamstring it from In Reach. It never turns to them, and its cards give Tomas Stress and one non-lethal Trample that his horse may dodge.
3. **The kill.** Once it is grounded, Mila's cut draws it onto her for one behavior. She flies clear to Distant and becomes the new parked quarry, and Bram cuts.
4. **The table's lesson.** The Abnormal is the soft fight of Phase 1.

**Fix options:**

1. **Add the parked quarry as a bar row.** One rider listed first who stays at Distant, read against the standard Medium Titan's row with the same Squad. Re-choose the values if the floor fails, as it does now by 28 standard errors.
2. **Narrow `current-holder`.** For example, met only by a holder not at Distant ("it runs down the soldier it last turned on while they are within its reach or on it"). A rider who gets away loses its Attention to the nearest, and every Abnormal row re-runs. This changes a Chapter 5 test row and needs a decision.
3. **Accept it and say so.** Section 6.5 and OQ-102 state that a rider can lead it off, as canon riders lead Titans away from a formation. OQ-103 records the parked row's figures for the decider as an accepted cost of the ladder.

### 3. Minor. Chapter 5: the Down-soldier promise is stated for every Titan but holds only for ladders without `current-holder`

**Location:**

- **Chapter 5:**
  - section 5.6 *Down and carried soldiers* ("A Titan turns to a Down soldier only when no one is closer, hooked in, hurting it, or louder");
  - the OQ-81 design note, *Ties* ("a Down soldier is reached only when no one stands closer") and *Down soldiers* ("lets comrades shield them by standing closer").
- **Decisions:** 3e-6 ("a Titan turns to a Down soldier only when no one is closer, as section 5.6 promises").
- **Contrast:** Chapter 6 section 6.5, GM bullet *Down soldiers* ("A holder who goes Down stays its quarry"); `attention.yaml` `tests.current-holder` (`down_can_meet: true`).

**Problem:**

- **What the Abnormal does.** A Down holder meets `current-holder`, so the Sprinting Abnormal keeps them while comrades stand closer: 0.18 of its cards a fight resolve against a Down holder at its reference start. Standing closer does not shield them there; only Draw Attention, a Nape strike, a soldier On Body, or a decoy does.
- **Where it is already scoped.** Chapter 6's bullet and `candidates.down` ("On the standard ladder ...") scope it correctly.
- **Where it is not.** The Chapter 5 sentences are unscoped, and the design note gives shielding by position as the reason for the rule.

**Scenario:** Kurt goes Down at Distant while he is the Abnormal's quarry. Ilse flies in to In Reach to stand between them, which section 5.6 says shields him because she is closer. Nobody is loud, hooked, or On Body. The Titan's next card resolves against Kurt, because he still meets `current-holder`, which ranks above `nearest`.

**Fix options:**

1. **Scope the sentences.** Section 5.6 reads "On the standard ladder, a Titan turns to a Down soldier only when ...", and the OQ-81 note adds "; an Abnormal ladder naming current-holder keeps a Down holder". 3e-6's clause can stay as history.

### 4. Minor. Chapter 5: the `nearest_rung` rows and the sentences quoting them describe a counter that measures something else

**Location:**

- **YAML:** `data/engagement/tuning.yaml` `prepared_squad_kill.nearest_rung` (`columns`, every `as_written` row, `note`).
- **Probe:** `tools/probes/batch-3e/nearest_b3e.py` `evaluate`.
- **Chapter 5:** the OQ-81 design note, *Ties* ("a holder farther off than the closest candidate was kept 0.002 times a fight or less").
- **Chapter 6:** section 6.6, *Support rows* design note ("On the standard ladders the nearest rung keeps a holder farther off than the closest soldier 0.002 times a fight or less").

**Problem:**

1. **How the counters run.** `nearest_b3e.py` counts only in its `narrows` branch. In `written` mode it returns `super().evaluate()` before any counter.
2. **What the `as_written` zeros mean.** Every `as_written` row reads 0.000 for both columns because nothing was counted. The note's explanation ("the top step counted the rung as met by every candidate") is not why.
3. **What the second counter measures.** In `narrows` mode it counts evaluations whose highest rung is `nearest` and whose holder is *not* at the closest Position. That is where the pre-3e reading would have kept a farther holder and the rule does not.
4. **What the texts say instead.** The column name ("holder kept while not at the closest position"), the note ("Under the rule a holder farther off ... is kept 0.002 times a fight or less, through the lower-rung narrowing"), and section 6.6's present-tense sentence all say the rule keeps such a holder. It never does through the top rung, and the counter never looks at the lower-rung narrowing.
5. **Figures.** None move. 3e-6's *Why* reads the counter correctly ("keeps a holder who is not closest 0.000 to 0.002 times a fight" of the earlier reading).

**Scenario:** A simulator author ports `nearest_rung` as a regression check that "the rule keeps a farther holder at most 0.002 times a fight". The first correct implementation reports 0.000, and the check looks like a bug.

**Fix options:**

1. **Rename and correct.** Name the column `evaluations_where_the_earlier_reading_kept_a_farther_holder_per_fight`, mark `as_written` "not counted", and correct the note. Section 6.6 and the OQ-81 note then read "the earlier reading kept a holder farther off ... 0.002 times a fight or less; the rule never does".
2. **Or count in both modes and commit the output.** Make the counters run in both modes and re-run `nearest_b3e.py`.

### 5. Minor. Chapter 5: the glossary's Attention Ladder entry drops "the end of" from the flag lifetime

**Location:** `CONTEXT.md`, Attention Ladder ("just hurt it (until its next card that resolves a behavior)"), against the Draw Attention entry, ADR-0003 item 2, `attention.yaml` `flag_duration`, and the Catalog's `draw-attention` note, which all say "until the end of" that card.

**Problem:** Read literally, the Attention Ladder wording lets a table clear just-hurt as that card comes up, before that card's own evaluation reads the flag. That is the same card-versus-moment slip batch 3c's wording made, and batch 3e's rule exists to close it. The glossary is the text a player checks first.

**Scenario:** Ilse cuts a leg, and the Titan's next card comes up. A player reading the glossary says her flag has run out "until its next card", so the evaluation skips just-hurt and the card lands on Jonas at In Reach. Chapter 5 gives Ilse.

**Fix options:**

1. **Match the other texts.** Read "just hurt it (until the end of its next card that resolves a behavior)".

### 6. Minor. Chapter 5: the register's OQ-111 and OQ-81 entries lag batch 3e

**Location:** `docs/rules/OPEN-QUESTIONS.md`, OQ-111 (*Provisional choice*, *Earlier-chapter change needed*) and OQ-81 (*Decision*).

**Problem:**

1. **OQ-111's body** still says its provisional choice (a) is "applied in ... `fight.py` and `fight6.py`, which clear the flags on a holding card". Its *Earlier-chapter change needed* describes (a) as current. Both files now keep the flags, and only the Decision line says so.
2. **OQ-81's Decision line** reads "Revised by batch 3c and 3e: a flag lasts ...; the Feint can also be made on foot ...". It puts the batch 3c Feint change under batch 3e, and the next sentence repeats "Revised by batch 3e".

**Scenario:** A reader of OQ-111 checks `fight.py` for the holding-card clear the entry describes and finds the opposite.

**Fix options:**

1. **OQ-111.** Add "(history; revised by batch 3e: both probes keep the flags)" after its *Provisional choice* and *Earlier-chapter change needed*.
2. **OQ-81.** Read "Revised by batch 3c: the Feint can also be made on foot ...; revised by batch 3e: a flag lasts ...".

### 7. Minor. Chapter 6: the GM section's list of when nothing holds the Abnormal's Attention misses a quarry Grabbed by another Focus Titan

**Location:**

- **Chapter 6:** section 6.5, GM bullet *Only then whoever is nearest* ("when its holder dies, leaves, or holds no Position"); `index.yaml` `reads_as` ("when its holder is gone").
- **Chapter 5:** `attention.yaml` `changes.holder-gone` (dies, leaves, is freed, stops holding a Position) against `candidates.never` ("A soldier held Grabbed by another Focus Titan").

**Problem:**

- **When it happens.** A standard Background Titan can enter as B while the Sprinting Abnormal is A, which the interim setup table allows. If B Grabs the Abnormal's quarry, that soldier is no longer A's candidate.
- **What the ladder does.** A's next evaluation finds no one meeting `current-holder` and goes for the nearest, so the procedure is sound.
- **What the texts say.** The GM bullet's list and `holder-gone` do not name the case, so the GM text says the Abnormal keeps a quarry it cannot choose.

**Scenario:** Titan B Grabs Kurt, the Abnormal's quarry. Reading section 6.5, the GM expects A to keep running Kurt down. Its next card turns to Ilse at In Reach.

**Fix options:**

1. **Add the case.** "or is Grabbed by another Focus Titan" in the GM bullet and `reads_as`, and optionally in `holder-gone`'s `when`.

---

## Previous-round findings: status

### `01-05-decisions-conformance-review-3.md` (Opus)

| Finding | Status | Evidence |
|---|---|---|
| Critical 1: the Grab exception covered only the loudest flag | **Resolved** | 3e-1: one lifetime in ADR-0003 item 2 (the list), ADR-0010's batch 3e paragraph, the glossary, Catalog, section 5.5 step 1, section 5.6 *Flags*, section 5.7, `flag_duration`, `holding`; scenario (a) gives Mila in every text and on the probe |
| Major 2: after a hold, the flag was read by an inert card and cleared before the acting card | **Resolved** | `decoy` step keeps the flags; scenario (b) gives Mila the next behavior; `flags_under_a_hold` 98.9% to 99.8% |
| Minor 3: the legal-route promise in a retreat | **Resolved** | 3e-2 in ADR-0010, section 5.6's Feint note, section 5.10's note, `attention.yaml` `feint.repeatable` |
| Minor 4: the Feint's grounded way not "on foot" in the YAML | **Resolved** | `feint.requirement` "or is not mounted and the Titan is grounded"; "A mounted soldier against a grounded Titan Feints with the horse" |
| Minor 5: ADR-0003 item 2 unedited in the list | **Resolved** | Item 2 carries the batch 3e wording; paragraphs kept as history |
| Minor 6: Catalog `draw-attention` note | **Resolved** | Note carries the batch 3e rule and cites it |
| Minor 7: batch 3d bookkeeping | **Resolved** | Stale OQ-111 sentence removed; Draw Attention and *Who holds Attention* name the rule; ADR-0014 batch 3e paragraph and OQ-81 quote 77.0%; register preamble names OQ-50, OQ-89, OQ-97, batch 3d, and batch 3e. Residual register lags: new Minor 6 |

### `01-05-decisions-conformance-review-3-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Minor: pre-batch-3d summaries of the Grab exception | **Resolved** | Superseded by 3e-1; every summary states the one rule and cites batch 3e; Chapter 5 introduction lists batches 3b to 3e |

### `06-standard-titans-review-3.md` (Opus)

| Finding | Status | Evidence |
|---|---|---|
| Critical 1: the Abnormal's ladder fixated under the procedure while the chapter described a nearest-seeker | **Resolved as decided** | 3e-6 and its option (name `current-holder`): the ladder, GM bullets, `reads_as`, OQ-102, OQ-103, and figures agree (scenario (c)); the bar holds as committed and on fresh seeds. How the first quarry is chosen reopens the bar: new Critical 1 |
| Minor 2: Thrash is the modal behavior | **Resolved** | Section 6.1 states the shares (30%, 42%, 41%, 38%) and their cause; `verdicts.thrash_share`; OQ-101 |
| Minor 3: Nape Depth 3 teaches a backwards Read lesson | **Resolved** | Option 2: the GM design note *What a Read teaches* and OQ-103 state the cost; Nape Depth 4 measured failing every row read |
| Minor 4: section 6.6's flag rule and pre-round-2 figures | **Resolved** | Section 6.6 and the introduction quote the batch 3e rule; the flag comparison now cites Chapter 5's `flags_under_a_hold` |
| Minor 5: four misstated sentences | **Resolved** | "0.60 to 0.70"; "a Pushed Break Attention made with a horse can wear it"; "with both arms and a leg Broken"; Large Bite's line "A soldier In Reach is too far below its mouth" |

### `06-standard-titans-review-3-codex.md`

| Finding | Status | Evidence |
|---|---|---|
| Minor 1: `roster.yaml` uses an _Avoid_ term | **Resolved** | Renamed `data/titans/index.yaml` (OQ-110 (a)); every pointer resolves to an existing key (*Check 3*) |

---

## Appendix: models

Every script below ran in the session scratchpad against a copy of the repository, with bytecode writing off. None is committed, and each imports the committed probes unchanged unless it says otherwise.

- **Committed commands.** From the copy:
  - `chapter-05`: `run_simple.py gas 200000`, `solo 100000`, `grab 40000`; `lone.py 100000`;
  - `chapter-06`: `run6.py check` (with the selftest), `render.py check`, `run6.py solo 100000`, `grab 40000`, `lone 100000`.
- **`gas.py`.** An exact chain over Gas Rating 3 on two or three d6 a round, each 1 lowering the rating. Imports nothing.
- **`scen.py`.** Builds the three scenarios' states on `fight6.Fight6` (Grab, decoy hold, holder, flags, cards) and calls the committed `titan_card` and `release`, printing the holder, whether a behavior resolved, and the flags after each card. Its case (d) prints the holder of the reference start's first evaluation.
- **`rows.py`.**
  - `fight6.run_many` on `cases6.json`'s reference, helper, and support rows (12,000 fights, seeds 9101 onward) and the Abnormal's three tight bar rows with their Large twins (120,000);
  - `lone.run_many` on `lone6.lone_cfg` (100,000);
  - `simple.solo_cell` (200,000) and `lone6.grab_cell` (60,000 per comrade cell, 120,000 alone).
- **`quarry.py`.** Subclasses `fight6.Fight6` only in `build_squad` (roles and their order, player characters only) and `choose` (counting cards against a Distant holder and against the first-listed soldier). 24,000 fights a row, mounted start, seeds 4400 onward.
- **`order_bar.py`.** Subclasses `fight6.Fight6` only in `build_squad`, listing the player characters striker, striker, cutter, cutter, then Squadmates. It runs the Abnormal, the standard Large Titan, and the standard Medium Titan at the reference start and the three supported rows, 120,000 fights a row, with standard errors of the difference.
- **`order_rand.py`.** Subclasses `fight6.Fight6` only to shuffle the Squad sheet per fight with the fight's own generator. It runs the Abnormal and the standard Large Titan in the same four rows at 120,000 fights.
- **Committed bar check.** Reads `results/bar.json`'s rows and computes every part of the bar with its standard-error gap.
