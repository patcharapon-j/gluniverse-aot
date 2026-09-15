# Chapter 5 review, round 3

## Verdict

Chapter 5 is playable and substantially stronger than the round-2 draft. It now honours the Chapter 5 constraints in the decisions record, and the revised Large Titan, Grab, declined-dodge, Jam, and Gas results reproduce within sampling error. The remaining balance exceptions are recorded as PROVISIONAL choices, so none rises to Critical under this review's severity rules. Five Major findings remain: the lone Rookie target is still missed, the Grab target has been narrowed to a favorable interpretation, decoys still suppress too much Titan activity, the full reference-squad simulation remains outstanding, and the round-time target has not been demonstrated.

Counts in this review: **0 Critical, 5 Major, 3 Minor**.

## Round-2 Critical and Major verification

Neither round-2 review reported a Critical finding.

### Codex round 2

| Finding | Status | Verification |
|---|---|---|
| M1. Lone Rookie Nape strike exceeds the ADR-0014 ceiling | **Not resolved** | The draft logs the exception in OQ-79, but does not meet the target. My independent run produced **13.18%**, against the required **no more than 10%**. See Major 1. |
| M2. “Comrades close” is not represented by the favorable one-comrade Grab case | **Not resolved** | OQ-95 declares one nearby comrade to be the comparison case. That is a proposed reinterpretation of the target, not a demonstration that the reference Squad meets it. See Major 2. |
| M3. Tuning evidence uses a partial fight probe rather than the ADR-0014 reference simulator | **Partly resolved** | OQ-98 and the current probes add tactics, pairings, and escape cases. They still exclude several reference-build abilities and important fight actions. See Major 4. |
| M4. The 12 to 20 minute round target is unsupported | **Not resolved** | OQ-97 records the test debt. No timed paper test is supplied, and the current procedure remains too dense to accept the target by inspection. See Major 5. |

### Opus round 2

| Finding | Status | Verification |
|---|---|---|
| M1. A victim with turn debt fares better by declining the dodge | **Resolved** | The failed-dodge refund removes the inversion. With turn debt, my runs gave **69.66%** death after a failed dodge and **73.40%** after declining it. |
| M2. Cheap off-position decoys cancel most Titan cards | **Partly resolved** | Requiring 2 successes improves the case, but the combined horse-and-cloak screen still reduced resolved Titan cards from **0.852 to 0.529 per round** and Critical Injuries from **0.70 to 0.35** in my fight runs. See Major 3. |
| M3. Large Titans rarely die under the old Nape Depth | **Resolved** | Nape Depth 4 restored the target: median kill round **3**, **61.7%** killed by round 3, and **13.0%** still alive after round 12. |
| M4. Character sheets lack a Position field per focus Titan | **Resolved** | `data/gear/sheet-fields.yaml` now defines the field, and the chapter supplies a Squad-sheet position column and update points. |

## Independent simulation results

I copied the Chapter 5 probes to a temporary directory outside the repository, supplied independent random seeds, and increased the sample sizes. I did not use the drafter's reported percentages as inputs.

| Test | Independent result | Assessment |
|---|---:|---|
| Rookie, Solo 1, Nape Depth 4 after Break Attention | **13.18%** over 500,000 trials | Misses the ADR ceiling |
| Levi-grade, Solo 2, same strike | **47.30%** over 500,000 trials | Meets “about 50%” |
| Grab, alone, failed dodge | **69.93%** death | Reproduced |
| Grab, alone, declined dodge | **73.01%** death | Reproduced |
| Grab with turn debt, failed dodge | **69.66%** death | Failed dodge is correctly better |
| Grab with turn debt, declined dodge | **73.40%** death | OQ-85 result reproduced |
| Grab, one Solo 2 / Gear 0 comrade | **33.70%** death | Meets the selected one-comrade case |
| Grab, one Solo 1 / Gear 0 comrade | **28.70%** death | Within the reported cell range |
| Grab, one Solo 3 / Gear 1 comrade | **45.24%** death | Within the reported cell range |
| Jam, two Medium Titans, table behaviors, no Help, Covered | **24.41%** | Below the 33% threshold |
| Jam, two Large Titans, same conditions | **32.66%** | Widened worst case reproduced |
| Gas, reference builds | medians **8 and 6 rounds** | Reproduced |
| Medium reference fight | median round **3**; **62.2%** by round 3; **73.1%** by round 4; **5.1%** no kill by round 12 | Meets the headline kill target |
| Large reference fight | median round **3**; **61.7%** by round 3; **73.3%** by round 4; **13.0%** no kill by round 12 | Revised depth works |

The Medium fight result used 30,000 sequential fights. Grab used 150,000 trials per cell, Jam 300,000 per case, and the solo strike and Gas probes 500,000 trials. A 16,000-fight sensitivity run also reproduced the remaining decoy concern described below.

## Findings

### Major 1: The lone Rookie target remains out of bounds

**Location:** `docs/rules/05-titan-engagement.md`, 5.15 Tuning Notes, “Solo Nape strike after Break Attention”; `docs/rules/OPEN-QUESTIONS.md`, OQ-79; ADR-0014.

**Problem:** The hard ADR target is no more than 10%. The current rules produce **13.18%** in 500,000 independent trials. Logging 13.1% in OQ-79 makes the conflict visible and therefore not Critical, but it does not make the provisional choice sound. This is a relative increase of about 32% over the ceiling. The Levi-grade result, **47.30%**, is healthy, so a broad penalty to every attacker would damage a target that already works.

**At the table:** A Rookie who obtains the chapter's normal Break Attention setup lands the decisive Nape result more often than the lethality model permits. Across repeated engagements, this weakens the intended distinction between a Rookie opening and Levi-grade execution.

**Fix options:**

1. Amend ADR-0014 explicitly from “no more than 10%” to “about 10%” and record that 13.1% is accepted.
2. Add a narrow Rookie-side limiter that does not reduce the Levi-grade pool, then rerun the Medium fight target.
3. Leave the value provisional and do not accept it as the starting rule until the target or mechanic changes.

### Major 2: OQ-95 proves a one-comrade cell, not “comrades close” for the reference Squad

**Location:** `docs/rules/05-titan-engagement.md`, 5.15 Tuning Notes, “Grab outcomes”; `docs/rules/OPEN-QUESTIONS.md`, OQ-95; ADR-0014.

**Problem:** OQ-95 defines the “comrades close” target as exactly one available rescuer. That cell does reproduce at **33.70%** for Solo 2 / Gear 0, with sampled cells ranging from **28.70% to 45.24%**. It does not settle the ordinary-language or reference-build reading in which several nearby Squad members can attempt rescue. The chapter itself reports much lower death rates for a full Squad, helpers, and tactics. The provisional decision selects the one favorable cell instead of specifying what the target is meant to protect across the reference Squad.

**At the table:** A four-soldier Squad with several legal rescuers experiences Grab as substantially less lethal than “kills about 1 in 3 with comrades close,” while the tuning note can still claim that the target passed by counting only one rescuer.

**Fix options:**

1. Amend ADR-0014 to say “with exactly one available comrade,” including the rescuer's reference build and legal starting state.
2. Add a separate full-reference-Squad floor and tune Grab against both it and the one-rescuer case.
3. Retune rescue limits or the countdown against the actual reference Squad rather than redefining the tested population.

### Major 3: Decoy screens still suppress too much of the Titan's game

**Location:** `docs/rules/05-titan-engagement.md`, 5.6.1 Decoy rules and 5.15 Tuning Notes; `data/engagement/attention.yaml`; `docs/rules/OPEN-QUESTIONS.md`, OQ-81.

**Problem:** The new 2-success requirement for an off-position decoyer helps, but the remaining horse-and-cloak screen is still dominant. In independent Medium fights, the baseline resolved **0.852 Titan cards per round** and produced **0.70 Critical Injuries** per fight. The current screen reduced those to **0.529 cards per round** and **0.35 Critical Injuries**. Adding the tested Hook/Cut and Hamstring tactics lowered them further to **0.477 cards** and **0.31 Critical Injuries**, with median kill moving from round 3 to round 2. A decoy still erases the card rather than converting or redirecting Titan action, so repeated cheap decoys remove a large fraction of the opposition's turns.

**At the table:** Squadmates who are poorly placed to attack can spend their actions blanking Titan cards. The Titan appears passive while the striker completes the kill, and the decoy role outperforms several riskier support choices.

**Fix options:**

1. On a successful decoy, redirect the card into a limited Thrash or movement result instead of cancelling it.
2. Give each Titan a shared per-round decoy limit or an escalating success cost, then rerun both solo and Squad fights.
3. Price the screen through a concrete resource or exposure cost large enough to preserve Titan activity.

### Major 4: OQ-98 still falls short of the full ADR-0014 reference simulation

**Location:** `docs/rules/05-titan-engagement.md`, 5.15 Tuning Notes and “Simulator cases”; `docs/rules/OPEN-QUESTIONS.md`, OQ-98; ADR-0014.

**Problem:** The current probe is useful and now includes tactics, pairings, and selected escape cases. It still excludes Read, Call It, Wings, position swaps, Background effects, treatment, Pry Loose, and combinations of those choices. The chapter acknowledges that the complete cases remain owed. Because ADR-0014 defines named reference builds rather than an abstract attack loop, a partial action model cannot establish the final balance envelope or the interaction between lethality, Critical Injuries, and Titan pressure.

**At the table:** A legal ability combination can shift kill time, rescue odds, or incoming harm beyond the reported envelope even though the tuning table appears final. The decoy-plus-tactics sensitivity is already one example: its median kill is round 2 and its incoming Critical Injuries fall to 0.31.

**Fix options:**

1. Extend the simulator to all actions and abilities in the ADR-0014 reference builds and publish the exact policies used.
2. Explicitly amend ADR-0014 so the current baseline is the target population, then add separate sensitivity bounds for omitted abilities.
3. Keep all affected tuning choices provisional until the complete reference cases are run.

### Major 5: The round procedure has not earned the 12 to 20 minute target

**Location:** `docs/rules/05-titan-engagement.md`, 5.3 Round Sequence and 5.15 Tuning Notes; `data/engagement/round.yaml`; `docs/rules/OPEN-QUESTIONS.md`, OQ-97.

**Problem:** OQ-97 correctly records a timed-test debt, but the target is especially doubtful for two Titans. For one Titan, a typical round exposes roughly 12 to 15 GM procedure or update moments in addition to six soldier turns: deal and reveal; inspect holding and decoys; walk the five-step target ladder with tie handling; check legality and fallback; announce; resolve reactions; resolve ordered card effects; roll or reveal the next card; update flags; process two to four strike, Opening, and Break Attention changes; and complete three end-of-round updates. Grab adds witness Fear rolls and victim-turn countdown state. Two Titans bring the GM-side count to roughly 20 to 25 moments before player deliberation, dice, narration, Gas, Fear, and sheet updates. There is no timed evidence that this fits 12 to 20 minutes.

**At the table:** A two-Titan round with one Grab, two reactions, and several position changes requires repeated cross-checks across cards, Positions, Openings, Attention, and countdowns. Even decisive players are likely to exceed the time budget.

**Fix options:**

1. Run timed paper tests for one- and two-Titan rounds using unfamiliar players and report median and upper-quartile times.
2. If the tests miss, combine tracker updates and simplify targeting or card resolution before adjusting the target.
3. Keep OQ-97 open and describe 12 to 20 minutes as an unverified design target, not a supported property.

### Minor 1: The Opening glossary entry contradicts the self-spend rule

**Location:** `CONTEXT.md`, glossary entry for Opening; `docs/rules/05-titan-engagement.md`, 5.7 Openings; `docs/rules/OPEN-QUESTIONS.md`, OQ-90.

**Problem:** The glossary says any ally can spend an Opening. Chapter 5 says the soldier who creates it cannot spend it. OQ-90 records the intended self-spend rule, so this is a logged glossary cleanup rather than an unlogged contradiction.

**At the table:** A player consulting the glossary spends their own Opening, while a player consulting Chapter 5 is forbidden from doing so.

**Fix options:**

1. Change the glossary to “any other ally.”
2. Point the glossary entry directly to the Chapter 5 spending restriction.

### Minor 2: The tracker cadence omits the victim-turn Grab update

**Location:** `docs/rules/05-titan-engagement.md`, 5.3.4 Update the Tracker; `data/engagement/round.yaml`, tracker update cadence; 5.9.3 Grabbed Victim Turns.

**Problem:** The cadence lists a Grab countdown after each Titan card, but lifting advances after each counted turn of the Grabbed soldier. The substantive Grab rule is clear, so this is a tracker-instruction gap rather than an undefined mechanic.

**At the table:** A Grabbed soldier's counted turn occurs during a Soldier card. A GM following only the tracker cadence does not mark the lift then, and may update it later after the wrong Titan card, changing reach, penalties, or rescue time.

**Fix options:**

1. Add “after each counted turn of a Grabbed soldier” to both cadence lists.
2. Reserve the post-Titan-card Grab update for a newly landed Grab and label it that way.

### Minor 3: An anchor description reintroduces the rejected “behind” shorthand

**Location:** `data/engagement/anchor-ratings.yaml`, Blind Spot description; `CONTEXT.md`, glossary note for Blind Spot.

**Problem:** The YAML describes Blind Spot as being “behind” the Titan. The glossary explicitly avoids that shortcut because Blind Spot is a named engagement Position, not ordinary facing geometry.

**At the table:** Players infer that any character physically behind a miniature qualifies, even when the Position record says otherwise.

**Fix options:**

1. Replace “behind” with “at Blind Spot.”
2. Describe it as “out of the Titan's sight” and retain the named Position requirement.

## Provisional decision audit

| Decision | Judgment | Note |
|---|---|---|
| OQ-74 | Sound | The four-position model and explicit records satisfy the chapter constraint. Minor 3 is terminology only. |
| OQ-75 | Sound | Separate tracker records preserve multi-Titan state. |
| OQ-76 | Sound | The Focus-led targeting ladder is deterministic and handles legal fallback. |
| OQ-77 | Sound | The action and reaction structure is coherent with Chapter 2. |
| OQ-78 | Sound as a starting procedure | The revised Large Nape Depth now meets the sampled kill target. Limb and eye sensitivities remain part of Major 4's evidence debt. |
| OQ-79 | Unsound as final | The logged 13.1% result still exceeds the ADR ceiling. See Major 1. |
| OQ-80 | Sound | Called strikes and Nape prerequisites are explicit. |
| OQ-81 | Unsound as final | Decoy suppression remains too strong. See Major 3. |
| OQ-82 | Sound as a starting procedure | Attention and Break Attention are deterministic and recorded. |
| OQ-83 | Sound mechanically | The non-creator spending rule works. The glossary cleanup remains Minor 1. |
| OQ-84 | Sound as a starting procedure | Tactics have usable timing and costs; complete combination evidence remains under Major 4. |
| OQ-85 | Sound | Declining a dodge is now worse, including with turn debt. |
| OQ-86 | Sound | Toughness 1 and the Grab injury rule match the Health-box decision. |
| OQ-87 | Sound | Witness Fear and victim-turn handling are explicit. |
| OQ-88 | Sound | Leaving, ending, and Down movement are defined without drafting Chapter 6. |
| OQ-89 | Sound mechanically | The tactic sensitivity rows reproduce closely. |
| OQ-90 | Partly complete | The cross-chapter mechanical edits are present; the Opening glossary remains stale. |
| OQ-95 | Unsound as final | It narrows the target to exactly one rescuer without settling the reference-Squad reading. See Major 2. |
| OQ-96 | Sound | The widened legal Jam table stays below one-third; the worst sampled case was 32.66%. |
| OQ-97 | Evidence pending | The timing debt is properly logged, but the current procedure is unlikely to meet the target for two Titans. See Major 5. |
| OQ-98 | Partly supported | New tactic and escape cases are useful, but the full ADR reference simulator remains incomplete. See Major 4. |

No entries after OQ-98 were present at review time.

## Dependency, data, and scope audit

The chapter honours the explicit constraints in `docs/rules/DECISIONS-2026-09-14.md`, including batch 2b and the Health-box rule: Grabbed soldiers cannot Help, Cover, or react but can Push; lift and devour timing uses victim turns; Grabbed Toughness is 1; crushing Critical Injury marks a Health box; witnesses test Fear; leaving, engagement end, and Down crawling are defined; starting placement does not use Drive; Critical Injury Severity uses the full Rookie value; turn debt is preserved; Jam, per-Titan Positions, and recorded engagement state are implemented; and self-created Openings cannot be spent by their creator.

The Chapter 6 material is forward-referenced rather than drafted here. I found no Phase 2 subsystem inserted into Chapter 5. The 15 YAML files under `data/engagement/` parse successfully and match the chapter's principal tables. Apart from the findings above, the chapter fits the Year Zero dice language and the intended Attack on Titan pressure: movement, setup, teamwork, and sudden harm remain central.
