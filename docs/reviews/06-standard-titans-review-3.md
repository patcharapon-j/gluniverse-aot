# Chapter 6, Standard Titans: review round 3

Reviewed:

- `docs/rules/06-standard-titans.md`.
- Every file in `data/titans/`: `roster.yaml`, the four Titans, `tuning.yaml`, and the generated `probe-figures.yaml` (through the rendered tables, which `render.py check` confirms match), with `results/bar.json` for the bar's standard errors.
- The probes in `tools/probes/chapter-06/` (`titans.py`, `fight6.py`, `lone6.py`, `jam6.py`, `run6.py`, `cases6.json`), and the Chapter 5 code they import (`fight.py`, `lone.py`, `simple.py`, `core.py`).
- OQ-100 to OQ-111 in `docs/rules/OPEN-QUESTIONS.md`.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended through decision batch 3d.
- Chapters 1 to 5 and their data. I read Chapter 5 sections 5.1 and 5.4 to 5.9 in full, and `attention.yaml`, `titan-harm.yaml`, `titan-format.yaml`, `behavior-procedure.yaml`, `size-classes.yaml`, `engagement-setup.yaml`, and `engagement-flow.yaml` (`ending`).
- `docs/rules/DECISIONS-2026-09-14.md`: batch 3 (OQ-78 to OQ-82), 3b-8, batches 3c and 3d, and *Constraints on the undrafted Phase 1 chapters*.
- Round 2: `06-standard-titans-review-2.md` and `-review-2-codex.md`.

I did not read the parallel Codex round 3 review or the Chapters 1 to 5 conformance round 3 files.

The odds come from Python scripts in the session scratchpad, not committed; the appendix describes them. Every fight figure runs the committed `fight6.py` unchanged, or subclasses it only to count or to switch one reading, on fresh seeds.

Severity follows the brief:
- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**1 Critical, 0 Major, 4 Minor.**

Every round 2 Major and Minor is resolved except OQ-110, which is logged and waits on a Chapter 5 pass. The three standard Titans are ready:
- Every ADR-0014 target is met, and every headline figure reproduces on fresh seeds.
- The Large Titan's tight Jam cell holds on three more seeds.
- No standard table is unwinnable or trivial.

The Sprinting Abnormal has one Critical, and round 2 missed it, this reviewer included:
- **What the rule does.** Its ladder's last rung, `nearest`, is also the highest rung met on most of its cards. By `attention.yaml`'s evaluation steps, a top-rung `nearest` ties every candidate and narrows nothing, so the Titan keeps whoever already holds its Attention, wherever they stand.
- **What the chapter says.** The GM section, `roster.yaml`, and OQ-102 all say it "goes for whoever is nearest".
- **Why it matters.** The probes use the rule as written, so every Abnormal figure measures a fixating Titan, not the one the chapter describes. A table that plays the GM section plays a deadlier Abnormal, one that breaks its own ceiling in three supported rows by 8 to 10 standard errors (finding 1).

## Checks that passed

- **Tooling.** `titans.py` reports 0 problems for all four Titans. `render.py check` reports every rendered block matching its YAML. `fight6.py selftest` passes.
- **Stat blocks.**
  - Each standard Titan's Tempo, Nape Depth, Regeneration clock, Toughness by kind, and Severity by tier match `size-classes.yaml`.
  - Each has the five standard Body Parts in order and the standard ladder.
  - The Abnormal's values sit inside the batch 3 bounds, and its ladder uses rungs from the closed `tests` list and ends with `nearest`.
- **Behavior Tables.**
  - Every table covers results 1 to 6 with the tier pairs, one Thrash, and one telegraph.
  - Every fallback names another entry or Thrash, and every control and Thrash Critical Injury has `cannot_be_lethal: true`.
  - Each standard table has one Grab result and one lethal result.
  - A holder at In Reach meets 5, 5, 4, and 5 results in six.
  - No effect touches a horse, and no entry names death.
- **Legs (round 2 Major 1).**
  - Run Past, Trample, Headlong Lunge, and Heavy Tread list `[leg, leg]`, so one Broken leg makes each illegal, and `titans.py` fails any entry on a two-legged Titan that lists one leg.
  - In fresh fights the grounded Abnormal resolves 0.188 kill-tier cards per fight, all of them Grabs (the lethal Lunge needs both legs).
- **Move-up shares.**
  - The highest kill share in any state is 0.50 on every table.
  - The fewest legal non-Thrash entries are 3, 2, 3, and 1.
  - The Abnormal's single-entry state still resolves every result.
- **Harm (Chapter 3, ADR-0005, ADR-0015).**
  - Every harming effect is a Critical Injury as a Titan attack, and the Grab's harm is the torso crush, which cannot be lethal.
  - Section 6.1's list of how a Titan kills now includes falls.
  - Section 6.3's instant-death claim checks. Each held torso Critical Injury adds 2 to the torso roll (`core.gain_ci`; `critical-injuries.yaml`, `worsening`). After two crushes, a Bite's 2D6 + 4 reaches `torso-crushed` on 11 or 12, 1 roll in 12.
- **The Chapter 6 constraints.** Every item is honoured:
  - format and values;
  - table shape and the Grab mark;
  - at most one Grab and one lethal result per standard table;
  - the In Reach share;
  - no horse effect;
  - the per-table targets at the reference start;
  - the Jam test per table;
  - move-up shares by previous behavior and by Broken parts;
  - Abnormals reported and not tuned, inside the bounds;
  - public and hidden values;
  - no Small or Medium entry above its class's kill Severity.
- **Batches 3b, 3c, and 3d on Chapter 6.**
  - The lone rows are measured at each Titan's Tempo and Nape Depth, with a spare canister and Field Repair.
  - The support and Squad Tactic rows are present for every table.
  - `fight6.py` clears the flags on a card that comes up while the Titan holds a Grabbed soldier (3d-1), and keeps them through a hold's earlier cards (3c-1).
  - Section 6.6 reports the Abnormal's lone rate as its table's cost, as 3c-7 re-scoped ADR-0010.
- **Probes model the rules as written.** Spot-checked against the rules they model:
  - the ladder evaluation, literally as `attention.yaml` gives it (finding 1 turns on this);
  - the horse state (round 2 Codex Minor 1);
  - Gear Die wear only on a Pushed roll (`core.attr_roll`);
  - the start-of-fight Fear Roll after the first evaluation;
  - a Grabbed rider's countdown;
  - Death Rolls;
  - `left_behind` deaths when no soldier is standing (`engagement-flow.yaml`, `ending`).

  `fight6.choose` carries a dead clause (`and not (getattr(h, "mounted", False) and False)`) that changes nothing.
- **OQ-108's applied items.** The Abnormal's lone rows, and the design-note sentences that gave its Nape Depth and Toughness, are only in the GM subsections.
- **The example.** Oskar keeps the tie. Renate takes Attention on the second rung. Her Closing Hand pool is 2 base, 2 Gear, and 1 Stress Die, and her Push reaches 3 successes against Severity 3.
- **Phase 2 and GM discretion.** Shifters, Mission Briefs, and Research Points appear only as forward references. Nothing lets the GM pick a Titan, entry, target, or fallback, apart from finding 1's reading.
- **The setup mix.** 1/3 × 0.81 + 1/2 × (5/6 × 0.69 + 1/6 × 0.82) + 1/6 × 1.38 = 0.86 Critical Injuries per Titan Engagement. The same weighting gives 0.058 deaths.

## The ADR-0014 targets and the per-table rows, on fresh seeds

| Figure | Fresh | Chapter |
|---|---|---|
| **Squad of 4 against the standard Medium Titan** (12,000 fights): median kill round, by round 3, no kill in 12 rounds, Critical Injuries, deaths, Grabs | 3, 62.8%, 4.8%, 0.68, 0.032, 0.208 | 3, 62.8%, 4.8%, 0.69, 0.033, 0.201 |
| **Lone Rookie, fresh cut, Nape Depth 4** (200,000): Stress 1; Stress 0 | 13.18%; 9.89% | 13.3%; 10.1% |
| **Levi-grade, Stress 2**; Veteran, Stress 2 | 47.27%; 32.06% | 47.2%; 32.1% |
| Lone Rookie, Nape Depth 3 (Small Titan), Stress 1 | 33.13% | 33.1% |
| **Grab, Medium** (60,000): alone after a failed dodge; alone, no dodge | 69.59%; 73.04% | 69.4%; 72.9% |
| **Grab, Medium, one comrade:** S1 G0, S2 G0, S3 G0, S1 G1, S2 G1, S3 G1 | 29.0%, **33.5%**, 39.3%, 34.3%, 39.9%, 45.2% | 28.7%, 33.3%, 39.8%, 34.4%, 39.7%, 44.4% |
| Grab, one comrade at S2 G0: Small; Large | 33.9%; 33.6% | 33.9%; 33.5% |
| **Lone usable strike, waiting line** (100,000): Medium, Large, Small, Abnormal | **77.0%, 76.1%, 72.4%, 51.8%** | 77.0%, 76.1%, 72.5%, 52.0% |
| Lone fight, hurried line: Small, Abnormal (devoured) | 68.0% (13.0%), 56.1% (14.1%) | 68.0% (12.9%), 56.3% (14.0%) |
| Jam test, two Large Titans, Covered, no Help (200,000, three seeds); mounted | 32.5%, 32.6%, 32.5%; 32.4% | 32.9%; 32.6% |

Every target is met:
- **Squad of 4:** median round 3, 62.8% by round 3.
- **Lone Rookie:** 13.18%, inside 8% to 14% though near the top of the band.
- **Levi-grade:** 47.3%, about 50%.
- **Grab:** about 1 in 3 with one comrade close (33.5% at S2 G0, every cell under 50%), and about 2 in 3 alone (69.6%).
- **Jam test:** the Large two-Titan cell, 0.4 points under a third in the chapter, sits 0.7 to 0.9 points under on fresh seeds.

**Screen and Squad Tactic rows per table** (12,000 fights; by round 3, Critical Injuries, cards resolved per round):

| Titan | 2 helpers | Screen beside the holder | Hook and Cut and Hamstring Line | Screen with that pair |
|---|---|---|---|---|
| Medium | 69.5%, 0.64, 0.834 | 67.2%, 0.45, 0.630 | 65.5%, 0.60, 0.785 | 71.3%, 0.41, 0.585 |
| Small | 86.8%, 0.79, 1.480 | 87.2%, 0.52, 1.102 | 82.8%, 0.78, 1.455 | 89.3%, 0.50, 1.070 |
| Large | 68.2%, 1.28, 0.856 | 67.8%, 0.86, 0.641 | 65.5%, 1.18, 0.802 | 70.2%, 0.77, 0.600 |
| Sprinting Abnormal | 80.7%, 0.71, 1.542 | 81.8%, 0.51, 1.183 | 77.1%, 0.70, 1.492 | 84.7%, 0.44, 1.149 |

Medium Squad Tactic rows: none with the escapes 61.4% and 0.70; Clear the Hand and Fall Back 62.0% and 0.67. Each row matches its committed row within sampling. The screen cuts a Titan's cards by 23% to 25% and its Critical Injuries by 29% to 35% on every table, and kills no faster than helpers.

**How the Titans compare** (fresh reference starts, 12,000 fights; the death routes come from a tagging run):
- **Small:** median round 2, 80.9% by round 3, 1.8% with no kill, 0.84 Critical Injuries, 0.030 to 0.050 deaths over two seeds. About half its deaths are devours.
- **Medium:** 0.031 deaths, of which 0.018 are devours, 0.006 Death Rolls, and 0.008 whole-Squad losses.
- **Large:** median round 3, 61.5% by round 3, 13.6% with no kill (under 15%), 1.44 Critical Injuries, 0.157 to 0.174 deaths.
  - Of 0.157 deaths per fight, 0.099 are soldiers left to the Titan when no one is standing (`engagement-flow.yaml`, `left_behind`) and 0.052 are devours.
  - Its lethal Bite, On Body only, causes 0.0003.
  - The hardest standard fight kills by wearing the Squad Down (Crush and raised-band falls), not by biting. That is a legitimate Large Titan, but no sentence in 6.4 or 6.6 tells a Mission Brief author so.
- **Sprinting Abnormal** (the rule as written): median round 2, 75.0% by round 3, 5.3% with no kill, 0.82 Critical Injuries, 0.068 deaths. 78% of its deaths are devours (0.318 Grabs per fight).
- **Unwinnable:** no table. The worst row is the Large template Squad, 20.0% with no kill in 12 rounds (fresh tagging run).
- **Trivial:** no table under the rule as written. The strongest support still costs the Small Titan's Squad 0.50 Critical Injuries a fight.
- **Two degenerate states** take three Broken parts and are rare in play:
  - A grounded Abnormal with both arms Broken alternates Veer and Pitch Headlong, telegraphed, and cannot harm a holder at Distant or In Reach.
  - A Medium Titan with Broken eyes never telegraphs.

## Findings

### 1. Critical: the Sprinting Abnormal's ladder fixates on its current holder under the rule as written, while the chapter tells the GM it goes for the nearest soldier, and its bar holds only under the unstated reading

**Location:**
- `data/engagement/attention.yaml`: `evaluation` (`top`, `narrow`, `holder`) and `tests` (`nearest`, "Every candidate meets it. When it narrows a tied set ...").
- Chapter 5 section 5.6: the standard ladder's rung 5 ("Nearest: the closest Position"), the evaluation steps, and *Down and carried soldiers* ("A Titan turns to a Down soldier only when no one is closer").
- Chapter 6 section 6.5, GM section, *What its ladder means at the table* ("Otherwise whoever is nearest. Nearest keeps the soldiers On Body, then In Reach, then at Blind Spot, then Distant, and the current holder keeps a tie"; "Riders are nearest only by their Position"), and its design note.
- `data/titans/roster.yaml` (`ladders`, `reads_as`: "Otherwise it goes for whoever is nearest").
- OQ-102 (*Canon for (b)*), OQ-103, and section 6.6 (*Its bar, row against row*).

**Problem:** the ladder's written procedure and its description disagree.
- **The procedure.** `evaluation` makes the tied set every candidate who meets the highest rung met. Lower rungs narrow it, and `nearest` narrows "when it narrows a tied set". When `nearest` is itself the highest rung met, every candidate is tied and no rung is left to narrow, so the `holder` step keeps the current holder wherever they stand. `fight6.py` implements exactly this.
- **Where it bites.** On the standard ladder the case almost never arises, because In Reach, hooked, hurt, or loud is nearly always met first. On the Sprinting Abnormal's `[loudest-or-brightest, hooked-into-its-body, nearest]` it is the normal case: no one is loud, no one is On Body, and flags clear after each evaluating card.
- **The counts.** Counting both readings at the Abnormal's reference start (60,000 fights):

| Per fight | Standard Medium | Sprinting Abnormal |
|---|---|---|
| Ladder evaluations | 4.31 | 6.16 |
| Evaluations whose highest rung met is `nearest` | 1.21 | 5.04 |
| Of those, the Titan keeps a holder who is not at the closest Position | 0.002 | 1.52 |
| Cards resolved against a holder at Distant while someone is closer | not counted | 0.79 (0 if nearest narrows) |
| Cards resolved against a Down holder | not counted | 0.21 (0.11 if nearest narrows) |

- **What the probes measured.** Every Abnormal figure in the chapter, the bar, OQ-102, and OQ-103 is the fixating Titan's.
- **What the chapter describes.** The GM section, `reads_as`, and OQ-102's canon reason all describe a Titan that narrows to the nearest. The Draw Attention row's reason ("pulls the Titan off a striker who has just struck") is also a fixation effect: under the described reading the Titan leaves the striker for an In Reach cutter anyway.

The two readings are different Titans. Rows under each at 60,000 fights, against the committed Large twins at 120,000:

| Row | Written reading: by round 3, Critical Injuries, deaths ± SE | Described reading: by round 3, Critical Injuries, deaths ± SE | Large twin's deaths ± SE | Ceiling under the described reading |
|---|---|---|---|---|
| Reference start | 75.0%, 0.81, 0.0686 ± 0.0016 | 68.9% (median 3), 1.18, 0.1269 ± 0.0022 | 0.1608 ± 0.0021 | holds |
| 2 helper Squadmates | 80.5%, 0.71, 0.0196 ± 0.0007 | 76.6%, 1.06, **0.0292 ± 0.0008** | 0.0188 ± 0.0006 | **fails, 10.4 SE** |
| Screen beside the holder | 81.7%, 0.49, 0.0089 ± 0.0004 | 78.4%, 0.77, **0.0169 ± 0.0006** | 0.0100 ± 0.0004 | **fails, 9.6 SE** |
| Screen with Hook and Cut and Hamstring Line | 84.8%, 0.43, 0.0068 ± 0.0004 | 81.7%, 0.67, **0.0130 ± 0.0005** | 0.0081 ± 0.0003 | **fails, 8.4 SE** |
| Template Squad | 51.9%, 1.30, 0.1928 ± 0.0026 | 54.1%, 1.58, 0.2598 ± 0.0032 | 0.2728 ± 0.0027 | holds |

Under the described reading the Abnormal is, in effect, the standard-ladder row the chapter already rejects (70.4%, 1.11 Critical Injuries, 0.118 deaths). That follows from the rungs: `nearest` ranks On Body before In Reach, the same order the standard ladder's two top rungs give. The earlier ladder `[loudest-or-brightest, nearest]` changes as much: 83.0%, 0.86, 0.053 as written, against 74.5%, 1.17, 0.099 as described.

Round 2's finding 2 reasoned from the described reading, as OQ-102 does, so its account of why (a) fell was also wrong about the mechanism.

This is Critical rather than Major for three reasons:
- The chapter's only GM-facing statement of the ladder contradicts the procedure behind every Abnormal figure, so a table must choose a reading.
- Under the reading the chapter states, the stat block fails the bar that decides whether it stands.
- Nothing logs the gap. The same edge also contradicts Chapter 5's own promise that comrades shield a Down soldier by standing closer, though for the standard ladder at 0.002 evaluations a fight.

**Scenario:** the setup table gives the Sprinting Abnormal. The Squad rides in and dismounts.
1. Striker Bram falls short on a Nape strike from Blind Spot. The Titan's next card turns on him: struck-first, as the GM section says.
2. On the card after that, no one is loud, On Body, or hooked, and cutters Ilse and Kurt stand In Reach.
3. By `attention.yaml`, every candidate ties on `nearest` and Bram keeps the Titan's Attention, so he cannot strike the Nape.
4. By the GM section's "Otherwise whoever is nearest", Ilse takes it, Bram is free to cut again, and Ilse faces the Grab.
5. Two tables playing the same book get a 0.069-death fight and a 0.127-death fight.

**Fix options:**
1. **Make the written reading explicit, and describe the fixating Titan.**
   - Chapter 5: `attention.yaml` (`evaluation`, `top`) states the case: "if the highest rung met is nearest, every candidate is tied, and the holder step decides". Section 5.6 changes rung 5's gloss and the Down-soldier sentence to match.
   - Chapter 6: the GM bullets, `reads_as`, OQ-102, and the Draw Attention bullet describe a runner that keeps whoever it last turned on until noise, a Nape strike, or a soldier On Body turns it.
   - No committed figure moves, and the standard ladders move by 0.002 evaluations a fight. The fixed stare is defensible for an Abnormal, but OQ-102's canon argument must be rewritten for it.
2. **Make `nearest` narrow when it is the highest rung met,** as Chapter 5's prose and Down-soldier note already read. Keep Chapter 6's prose, re-run every Abnormal row, and re-choose its values against the bar, which three supported rows fail by 8 to 10 standard errors.
   - Limiting its Grab to On Body is not the lever: with that change the reference start makes 0 Grabs and 0.46 Critical Injuries (under the Medium Titan's 0.69) with 0.0018 deaths, which fails the floor.
   - The standard tables do not move (Medium reference 62.6%, 0.69, 0.030 under this reading).
3. **Ask for a decision adding a fixation test to the closed `tests` list,** for example `current-holder: the soldier holds the Titan's Attention`. Name it on the Abnormal's ladder (`[loudest-or-brightest, hooked-into-its-body, current-holder, nearest]`) and settle the top-rung case in Chapter 5 as in option 1 or 2. The ladder then says what the figures measure, and a Read reveals a rung a player can understand.

**Earlier-chapter change needed** under any option: `data/engagement/attention.yaml` (`evaluation`, `tests.nearest.meaning`) and Chapter 5 section 5.6 (rung 5's gloss, and *Down and carried soldiers* or its OQ-81 design note), so that the top-rung case has one written reading.

### 2. Minor: Thrash is the behavior every table resolves most, 30% to 42% of cards

**Location:** every non-Thrash entry's `fallback` in `data/titans/standard-*.yaml` and `sprinting-abnormal.yaml`; section 6.1 (*Reading a Behavior Table*) and the OQ-101 design note on what Titans do.

**Problem:** almost every fallback is `thrash`, and fallbacks fire whenever the holder is at a Position the entry excludes. The commonest case is a Nape striker who fell short and holds Attention at Blind Spot, against whom five of six Medium results become Thrash.

Share of resolved cards that are Thrash (reference starts, 12,000 fights):

| Titan | Thrash | Kill tier |
|---|---|---|
| Small | 30% (1.26 of 4.17) | 24% |
| Medium | 42% (1.39 of 3.35) | 17% |
| Large | 41% (1.49 of 3.67) | 9% |
| Sprinting Abnormal | 38% (1.99 of 5.22) | 12% |

The glossary presents Thrash as the fallback "when no other entry can legally happen". In play it is the modal act, so the authored behaviors, whose lines carry the chapter's 845-to-850 fidelity, show on about six cards in ten. Mechanically nothing breaks, since Thrash is a knock-loose at the control Severity, as Shake Off is. The fidelity cost is the GM narrating "it writhes and rolls in every direction at once" on four cards in ten.

**Scenario:** a Medium Titan with a striker clinging at its Blind Spot draws Snap Short, Swat, Bite, and Grab on four cards. All four resolve as Thrash with the same line.

**Fix options:**
1. State the share in section 6.1 or the OQ-101 design note ("a Titan with a soldier at its Nape mostly thrashes"), and give each table's Thrash line enough variety to carry it.
2. Point the fallbacks of Blind Spot-excluded entries at the table's own knock-loose entry (for example Snap Short to Shake Off), then re-run the kill share, the Jam test, and the reference rows. The repeat rule turns a repeated fallback into Thrash, so the share falls but does not vanish.

### 3. Minor: the one Abnormal a Phase 1 table meets has a shallower Nape than a standard Medium Titan, which a Read then teaches as a fact about Abnormals

**Location:** `data/titans/sprinting-abnormal.yaml` (`nape_depth: 3`); section 6.6 GM design note ("Nape Depth 3 keeps the fight a race"); OQ-103 (*Nape Depth 3 is load-bearing*).

**Problem:** the Abnormal's Nape Depth is a Read fact. The first Tactician who spends a success on it learns that the Survey Corps' feared Abnormal has an easier Nape than an ordinary Medium Titan. Nothing in 845 to 850 supports that: Abnormals are dangerous for what they do, not tougher or softer at the Nape.
- The chapter accepts it because Nape Depth 4 failed the template Squad row (median round 7, 36.9% with no kill, 0.418 deaths, round 2).
- As written the Abnormal falls sooner than the Medium Titan (75.0% by round 3 against 62.8%) while dealing twice its deaths. So the fight is not trivial, but the lesson a Read teaches is backwards.
- Under finding 1's option 2 the values are re-chosen anyway, and Nape Depth is one of the levers.

**Scenario:** a Squad that has read the Abnormal's Nape Depth of 3 tells its next Rookie that "Abnormals go down in one clean cut", the opposite of canon's lesson.

**Fix options:**
1. When finding 1 re-chooses values, prefer a lever that keeps Nape Depth 4, such as leg Toughness, a kill Severity, or its Grab's reach, and report Nape Depth 4 beside the chosen row.
2. Keep Nape Depth 3, and add to OQ-103 that its fidelity cost is the Read lesson, for the decider to accept.

### 4. Minor: section 6.6 states the flag rule without batch 3d's Grab clause, and cites flag comparisons measured on the pre-round-2 model

**Location:** section 6.6, *Support rows* paragraph ("a flag lasts until the Titan's next card that evaluates its ladder") and the *Flags under a hold* bullet ("88.4% ... against 88.7% and 0.51 on the Small Titan, and 85.3% and 0.43 against 85.5% and 0.43 on the Sprinting Abnormal"); the chapter introduction ("with flags that wait for the hold's last card").

**Problem:**
- **The rule's statement.** ADR-0003 item 2, as amended in batch 3d (OQ-111), reads "until the Titan's next card that evaluates its Attention Ladder, or that comes up while it holds a Grabbed soldier". The chapter's statement stops before the Grab clause. The probe applies it (`tuning.yaml`, `fight6.py`), so no figure is wrong, but a reader of 6.6 alone would keep a striker's flag through a Grab.
- **The evidence.** The four comparison figures come from `flags_b3c.py` at 6,000 fights. 3d-3 records that they were measured on the pre-round-2 Chapter 6 model (one-leg entries, the old ladder, Pitch Headlong at Severity 2), and they do not match the rendered support rows (Small 88.8% and 0.50; Abnormal 84.5% and 0.44).
- **Chapter 5.** Section 5.6 still says "ADR-0003's amended words name no such card, and OQ-111 records the gap", which batch 3d closed. That is Chapter 5's text, noted here for the conformance pass.

**Scenario:** during a Small Titan's Grab, a striker cuts the Nape and falls short. The GM, reading 6.6's rule, keeps the hooked flag, and the freed Titan turns on the striker instead of whoever the ladder picks from a clean slate.

**Fix options:**
1. Quote the flag rule in full in 6.6 and the introduction.
2. Re-run the flag comparison on the committed model (`flags_b3c.py` against the current `fight6.py`), or drop the figures and cite 3d-3.

### 5. Minor: four sentences misstate their rows or figures

**Location and problem:**
- **Tactic range.** Section 6.6's *Squad Tactics* bullet gives "0.62 to 0.71 Critical Injuries per fight". The rendered tactics table runs 0.62 to 0.70 (Clear the Hand and Fall Back), as `tuning.yaml`'s verdict says.
- **Horse wear.** Section 6.6's *The start of a fight* says "every Break Attention made with a horse wears it". Only a Pushed roll's Gear Dice showing 1 wear it (ADR-0004; `core.attr_roll`), which `tuning.yaml` states correctly ("so a Pushed roll can lame it").
- **The single-entry state.** Section 6.6 says the Sprinting Abnormal is left with one legal entry "after Veer, with both arms and both legs Broken". With `[leg, leg]` the state arises with both arms and one leg Broken, as OQ-102 and OQ-109 say. The broken-shares table shows it from "arm 2, leg 1".
- **Large Bite's line.** "A soldier on the ground is too far below its mouth, so it pins them under its bulk instead." That describes its Crush fallback, which works only In Reach. A holder at Blind Spot or Distant gets Thrash, not a pin.

**Scenario:** a GM reading the start paragraph wears a rider's horse on an unpushed Break Attention and lames it a card early.

**Fix options:**
1. "0.62 to 0.70"; "every Pushed Break Attention made with a horse can wear it"; "with both arms and a leg Broken"; and for Bite, "A soldier In Reach is too far below its mouth, so it pins them under its bulk instead."

## Round 2 findings

**Opus round 2:**

| # | Severity | Finding | Status |
|---|---|---|---|
| 1 | Major | A grounded Abnormal still ran past, trampled, and lunged; a grounded Large Titan still treaded | Resolved: `[leg, leg]` on all four entries (OQ-109), linted, and the grounded Abnormal's kill tier is now only its Grab (0.188 cards per fight) |
| 2 | Major | The Abnormal's ladder did the opposite of its canon reason | Resolved as asked: OQ-102 took (b). The finding's premise shared finding 1's misreading of `nearest`, so the ladder's description is still wrong in a new way (finding 1) |
| 3 | Major | The ceiling was read against the Large reference figure while the floor was row against row | Resolved: every part row against row, with a 2-standard-error tolerance at 120,000 fights. As written it holds on fresh seeds (helpers 0.0196 ± 0.0007 against 0.0188 ± 0.0006) |
| 4 | Minor | Hidden values printed in player-facing text | Resolved: the Abnormal's lone rows and Toughness sentence moved to GM subsections |
| 5 | Minor | ADR-0010's batch 3b amendment read as a rate promise | Resolved by 3c-7: "on the reference table", a legal route |
| 6 | Minor | "Kills only through" missed knock-loose falls | Resolved: section 6.1's third route |
| 7 | Minor | The roster said every Background Titan is standard | Resolved: scoped to the setup table |
| 8 | Minor | Swat and Crush lines promised effects the rows lack | Resolved |
| 9 | Minor | Lines contradicted their Position requirement | Resolved: Gape, Fixed Grin, Loom, and Veer rewritten, and `POSITION_PHRASES` linted |
| 10 | Minor | `roster.yaml` uses an _Avoid_ term | Still open: logged as OQ-110 (a), waiting on a pass that may edit Chapter 5 |

**Codex round 2:**

| # | Severity | Finding | Status |
|---|---|---|---|
| 1 | Minor | The screen probe's horse state was illegal | Resolved: `fight6.py` tracks `mounted` and `horse_pos`, routes horse rolls through `horse_after`, and `selftest` checks each case |

## Open questions OQ-100 to OQ-111

- **OQ-100 (b):** sound. The Grab column is rendered from the fact the Closing Hand reads.
- **OQ-101 (a):** sound. The strict "any state" reading holds at 0.50 on every table. Finding 2 adds that fallbacks make Thrash the modal act, which the tables' fidelity argument should state.
- **OQ-102 (b):** unsound as reasoned (finding 1).
  - Its canon argument and `reads_as` describe a ladder that narrows to the nearest soldier, but the procedure it cites keeps the current holder on 1.5 cards a fight.
  - Its figures are sound for the procedure as written.
  - Either the argument must become one for a fixating runner, or the reading must change and the values be re-chosen.
- **OQ-103 (a):** the method is sound (one reading, a stated tolerance, twins at 120,000 fights).
  - As written it holds on fresh seeds.
  - Under the ladder reading the chapter describes, it fails the ceiling in three supported rows by 8 to 10 standard errors (finding 1).
  - Nape Depth 3's fidelity cost is finding 3.
- **OQ-104 (b):** sound. The setup mix checks.
- **OQ-105:** sound, and its items are in place. Finding 1 adds a Chapter 5 item (`attention.yaml`, `evaluation`) that OQ-105 does not list.
- **OQ-106 (a):** sound and still needed. `CONTEXT.md` still says Nape Depth and Regeneration are "set by Size Class".
- **OQ-107 (a):** sound. No Chapter 6 entry reaches it.
- **OQ-108 (a):** sound, and applied.
- **OQ-109 (a):** sound for Phase 1: the rows, lines, and grounded rule now agree.
  - (c) remains the better long-term home. The rule "a grounded Titan does not walk, run, or stride" (section 6.1) lives only in `titans.py`'s lint over `data/titans/`.
  - A later Titan, such as a Mission Brief's, is held to it only if it lands in that folder.
- **OQ-110 (a):** sound, not yet applied.
- **OQ-111:** decided (c) in batch 3d, and applied in the probes. Chapter 6's prose statement of the rule lags it (finding 4).

## Appendix: models

Every script lives in the session scratchpad, is not committed, and writes nothing in the project. Each imports the committed probes unchanged.

- **`r3_repro.py`:** the chapter's headline families on fresh seeds.
  - `fight6.run_many` on `cases6.json`'s reference, helper, support, and two tactic rows (12,000 fights, seeds 7700 onward).
  - `lone6.solo_cell` (200,000) and `lone6.grab_cell` (60,000).
  - `lone.run_many` on `lone6.lone_cfg`, waiting and hurried lines (100,000).
- **`r3_ladder.py`:** `fight6.Fight6` subclassed only in `evaluate`.
  - It counts evaluations whose highest rung met is `nearest`, and those where the holder the written procedure keeps is not at the closest Position.
  - With `nearest_top: narrow` it narrows a top-rung `nearest` to the closest Position; with `literal` it is `fight6.py`'s evaluation line for line.
  - Rows: the Abnormal's reference, helpers, template, screen, screen with the pair, and earlier ladder, at 12,000 and 60,000 fights; Medium and Large reference and Large helpers at 12,000.
  - The Grab-reach check reuses it with `fight6.py`'s own `entry_over` (Grab `position_requirement: [on-body]`), 60,000 fights.
- **`r3_down.py`:** `r3_ladder.Lad` subclassed in `choose`, counting cards resolved against a Down holder and against a Distant holder while someone is closer (24,000 fights per reading).
- **`r3_causes.py`:** `fight6.Fight6` subclassed to tag each Critical Injury with the context it was gained in (a card, a fall, the crush) through a wrapper on `core.gain_ci`.
  - Each death gets a route: devoured, a Death Roll by origin, an instant-death row by origin, or left behind with no soldier standing.
  - It also counts cards resolved by tier, and while grounded.
  - Rows: the four reference starts and the Large and Abnormal template Squads, 12,000 fights each.
- **Jam re-run:** `jam6.jam_cell` for two standard Large Titans, Covered with no Help, on three seeds at 200,000 fights, plus the mounted reading, the one-Titan cell, and the Medium two-Titan cell.
- **Committed bar standard errors:** read from `tools/probes/chapter-06/results/bar.json`.
