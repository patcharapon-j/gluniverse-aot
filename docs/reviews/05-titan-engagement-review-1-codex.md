# Chapter 5, Titan Engagement: review round 1

Reviewed `docs/rules/05-titan-engagement.md`, all fifteen YAML files in `data/engagement/`, OQ-74 to OQ-90, `CONTEXT.md`, every ADR, `DECISIONS-2026-09-14.md`, Chapters 1 to 4, and their data dependencies. I did not read the parallel `docs/reviews/05-titan-engagement-review-1.md`.

All 52 YAML files across `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`, and `data/engagement/` parse. Probability work ran from `/private/tmp/wof-ch5-review.u0L69O`, outside the repository. The main cells used 200,000 to 400,000 trials.

## Verdict

Three Critical, nine Major, and three Minor findings remain open.

The chapter has a strong procedural core. Attention, behavior selection, falls, Regeneration, Background Titan entry, leaving, and the two-Focus-Titan cap are mostly closed procedures. It also keeps Expeditions, Chases, Operation Frames, and Shifters as forward references.

The tuning evidence does not yet clear ADR-0014. The Jam test passes only after assigning a 50% probability to Help and Covering, a probability no rule creates. A legal always-supported case reaches 35.5%. The prepared-Squad run starts Rookies at Stress 0 instead of ADR-0014's Stress 1, and the required Health reports are absent. Separately, a Grabbed soldier who dies before devour can leave the Titan holding a dead Grabbed state forever.

## Findings

### 1. Critical. The binding Jam test fails a legal support pattern

**Location:** Section 5.13, lines 819 to 829; `data/engagement/tuning.yaml`, `jam_test`; `DECISIONS-2026-09-14.md`, lines 1059 to 1060; OQ-72.

**Problem:** The decisions file requires Help, Covering, and turn debt to be applied. The model instead declares that "a helper who also Covers is available half the time." No initiative, Position, action, or turn-debt procedure produces that 50% rate.

My independent run reproduces the reported worst case at 28.6% when support is available on a coin flip. With two Large Titans, Severity 4, three rounds, Stress Responses, Push wear, and a helper who Covers every dodge, the Jam rate is 35.5%. This support pattern is legal with the default Squad: two dodges per round can use two of the five comrades' actions. The claimed 28.5% pass therefore rests on an arbitrary simulator input and does not prove the binding ceiling.

**Scenario:** A Rookie holds both Titans' Attention. Two nearby comrades keep their actions to Help and Cover the two dodges each round. Covering keeps the Rookie's Stress lower, so later Pushes stay available. Their rating 2 ODM Gear Jams in 35.5% of simulated fights, above one third.

**Fix options:**

1. Derive helper availability from dealt cards, Positions, actions, Reactions, and turn debt in the full-fight simulator, then retune Severity or wear if any legal reference policy exceeds one third.
2. Define the acceptance policy exactly in the decisions and tuning data, if the target is meant to measure a particular support policy rather than the legal worst case.
3. Keep the current values provisional and do not mark OQ-72 passed until the full model is under one third.

### 2. Critical. The ADR-0014 tuning report changes the reference builds and omits required reports

**Location:** Section 5.13, lines 729 to 815; `data/engagement/tuning.yaml`, `builds`, `prepared_squad_kill`, `grab`, and `simulator_cases`; ADR-0014.

**Problem:** ADR-0014 starts the Rookie at Stress 1. The prepared-Squad model starts all four at Stress 0 without the target saying otherwise. The headline Grab uses a fresh Rookie at Stress 2, while ADR-0014's reference Rookie starts at Stress 1. The model also uses a simplified Down chance, omits Read, Call It, Break Attention, Squad Tactics, and several Grab escape routes, then records the full-rules runs as still owed.

ADR-0014 also requires every Health-dependent target to report Health 3 and Health 2, 5, and 6 variants. It specifically includes a Grab on a victim with untreated Critical Injuries. Chapter 5 reports none of those Grab cells. This is not logged as an open exception to ADR-0014.

As a sensitivity check, my legal damage-only Squad policy gave 81.5% killed by round 3 from Stress 0 and 83.1% from Stress 1, both with median round 2. That reduced model is not a replacement for the drafter's full-fight claim. It shows that changing the starting Stress changes the result and cannot be dismissed. The reported 77% by round 3 remains a run against the wrong reference start.

**Scenario:** Four reference Rookies enter at the ADR's Stress 1. Their extra Stress Dice improve strikes and change Stress Responses, Push frequency, wear, and injury exposure. The published median and 77% figure describe a different Squad.

**Fix options:**

1. Re-run every Chapter 5 target with the amended reference builds and the full written procedures, including the required Health and template reports.
2. Amend ADR-0014 explicitly if the prepared-Squad or Grab target needs a different starting Stress, then state the exception in the target itself.
3. Keep all dependent values marked unaccepted starting values until the complete simulator produces the required report matrix.

### 3. Critical. A Grabbed soldier's death can make the holding Titan permanently inert

**Location:** Section 5.9, lines 575 to 601; `data/engagement/grab.yaml`, `grabbed_state`, `countdown`, and `while_holding`; `data/harm/death-rolls.yaml`, `dying`.

**Problem:** Dying removes a soldier from play and removes their Positions, but no rule ends Grabbed or releases the Titan's hand. The holding rule suppresses every Titan card while it "holds a Grabbed soldier." The countdown advances only on that soldier's turns, and dead soldiers receive no cards. The Titan can therefore keep the dead Grabbed state, its hidden behavior, and its complete card suppression forever.

**Scenario:** A soldier enters a Grab with an untreated `turn`-limit Critical Injury. At the end of their first counted turn they fail its Death Roll. They die before devour. The Titan still holds a Grabbed soldier, so its later cards resolve nothing, while the dead soldier has no second turn to trigger devour.

**Fix options:**

1. Add death to `release`, ending Grabbed at once and freeing the holding Titan to act on its next card.
2. Give death in a Titan's hand a fixed disposal step that ends the Grab, clears Attention, and states whether the corpse falls.
3. Make `while_holding` apply only while the held soldier is alive, with an ordered cleanup when they die.

### 4. Major. The lone Rookie misses ADR-0014 at the reference starting Stress

**Location:** Section 5.13, lines 781 to 797; `data/engagement/tuning.yaml`, `solo_nape`; OQ-79; ADR-0014.

**Problem:** ADR-0014's Rookie begins a fight at Stress 1 and must succeed on no more than 10% of lone Nape strikes after Break Attention. My independent model, including batch 2b's no-Talent Break Attention, Stress Responses, Push wear, and up to three Break Attention attempts, produced 13.1%. The drafter reports 12.9%. Stress 0 gives 10.1% in my run and 9.8% in the chapter, but Stress 0 is not the reference start.

The Levi-grade side does fit: my four Stress columns were 46.1%, 47.0%, 47.4%, and 46.6%, close to the reported 46.4% to 47.3%.

**Scenario:** A fresh reference Rookie starts at Stress 1, succeeds at Break Attention, and Pushes a Nape strike. The rule exceeds the ADR's hard upper bound by about 3 points.

**Fix options:**

1. Amend the target to "about 10%" and accept 12.9% as its tolerance.
2. State that this one target is measured from Stress 0, despite the build's fight start.
3. Change a lever that affects the lone Rookie more than the Levi-grade soldier, then re-run the prepared-Squad target.

### 5. Major. A revealed Grab makes refusing the dodge the dominant survival choice

**Location:** Section 5.9, lines 593 to 628; section 5.13, lines 799 to 817; `data/engagement/grab.yaml`, `countdown`; OQ-85.

**Problem:** A failed dodge spends the victim's first counted turn, leaving only a penalized Break Free after the lift. Refusing the dodge preserves the pre-lift attempt. My independent run reproduced 68.5% death after a failed dodge and 40.3% after refusing, against the chapter's 68.4% and 40.1%.

The inversion is especially visible after Read reveals Grab. A defense roll should not add 28 points of mortality compared with accepting the attack. It also means the advertised lone target is met only by assuming a choice an informed player should reject.

**Scenario:** A Read reveals that the next card is Grab. The target intentionally accepts the crushing Critical Injury because keeping their first Break Free action is much safer than attempting the dodge.

**Fix options:**

1. Take OQ-85 option (d): the first counted turn begins with its action spent whether or not a Reaction spent it.
2. Delay lift and devour by one additional counted turn when the target attempted a dodge.
3. Give a failed Grab dodge a concrete benefit, such as one success toward the first Break Free, and retune all six cells.

### 6. Major. The GM tracker publicly reveals facts that Read says are hidden

**Location:** Section 5.3, lines 232 to 247; section 5.8, lines 540 to 554; `data/engagement/round.yaml`, `gm_tracker`; `data/engagement/read.yaml`, `facts` and `public_without_a_read`; OQ-84.

**Problem:** The tracker says everything is public except an unrevealed Next Behavior. Its public Focus Titan row includes every Body Part's count and the Regeneration clock. Read lists those same values as facts a success must reveal, and omits them from `public_without_a_read`.

**Scenario:** The GM records `RL W1` and `Regen 2/3` on the public row. A player can read the count and clock without spending Read, making two of its five facts worthless.

**Fix options:**

1. Mark Body Part counts and the Regeneration clock hidden until Read reveals them, while keeping states public.
2. Make those fields public and remove them from Read's fact list, replacing them with facts that are not already on the tracker.
3. Split the tracker into public and GM-only columns and name each field's visibility.

### 7. Major. Temporary grip Toughness can violate the Body Part count invariant

**Location:** Section 5.4, line 255; section 5.9, lines 584 to 620; `data/engagement/grab.yaml`, `grab_lands.hold` and `release`; `data/engagement/titan-harm.yaml`, `states.count` and `body_part_strikes`.

**Problem:** A Medium arm can hold count 1 under Toughness 2. Grab changes its Toughness to 1 while explicitly leaving its state and count unchanged. The count is now already at Toughness, violating the rule that it ranges only to Toughness minus 1. On the next strike it rises to 2, but the procedure advances a state "when the count reaches" 1. The rules do not say whether it advances immediately, advances on the next success, or can never advance while holding.

**Scenario:** A Wounded Medium arm has count 1, then Grabs a soldier. If count 1 resolves against temporary Toughness 1 immediately, the arm becomes Broken and frees them without a rescue roll. If it does not, the next success takes the count past its threshold.

**Fix options:**

1. Reset the holding arm's count to 0 when grip Toughness begins.
2. Resolve its existing count against Toughness 1 immediately, including release if it becomes Broken.
3. Change state advancement to count greater than or equal to Toughness and state exactly how a pre-existing count behaves when Toughness changes.

### 8. Major. Open terrain creates a Blind Spot with no legal anchor

**Location:** Section 5.2, lines 121 to 144; `data/engagement/anchor-ratings.yaml`, `ratings.open`; `data/engagement/positions.yaml`, `positions.blind-spot`; OQ-74; ADR-0010.

**Problem:** Blind Spot is anchored to terrain rather than the Titan. Open terrain is defined as having no anchors except the Titan, yet its graph allows an ODM move from On Body to Blind Spot. The move ends at a Position whose required anchor does not exist.

**Scenario:** On a bare plain, a soldier hooks into the Titan at On Body, then takes the On Body to Blind Spot step. The rules say they are now anchored to terrain behind or above it, despite the Anchor Rating saying there is no such terrain.

**Fix options:**

1. Remove Open's On Body to Blind Spot step. A Squad must ground the Titan before reaching its Nape there.
2. Add an explicit Open-only aerial transition that releases the Titan hook and names what holds the soldier at Blind Spot without contradicting ADR-0010.
3. Redefine Open as sparse enough to support that transition, which makes it overlap Sparse and needs both ratings rewritten.

### 9. Major. Squad Tactics do not have an executable declaration rule

**Location:** Section 5.12, lines 702 to 723; `data/engagement/squad-tactics.yaml`, `rules.declared_by` and all four tactics; OQ-89.

**Problem:** The declaring player is "the player of the soldier the condition names." Fall Back's condition names no soldier and its effect changes every eligible soldier. Hook and Cut names the Break Attention soldier and the Nape striker. Clear the Hand can have two eligible victims when two Titans each hold someone. The rules do not identify who decides to spend the once-per-Engagement use or resolve disagreement.

**Scenario:** Fall Back is unused when a round begins. One player wants to spend it to pull everyone to In Reach; another wants to save it. No soldier is named by the condition, so nobody has authority to declare it and the usual roll-off is not invoked.

**Fix options:**

1. Make tactic use a Squad choice with the existing group roll-off whenever more than one player is eligible to declare.
2. Give each tactic a single declarer field. For Fall Back, name one eligible soldier and narrow its effect to that soldier.
3. Let any eligible player declare, with the first declaration binding, and state how simultaneous declarations resolve.

### 10. Major. OQ-90 creates dangling Read pointers when applied exactly

**Location:** `docs/rules/OPEN-QUESTIONS.md`, OQ-90 item 1; `data/engagement/read.yaml`, lines 19 to 21 and 64 to 68.

**Problem:** OQ-90 moves the two Bonus Dice rows out of `proposed_bonus_dice_sources` and deletes that block. It does not retarget `read.from_distant` or `call_it.effect`, both of which still point to the deleted block. Applying the listed exact changes therefore leaves two broken data references.

**Scenario:** The earlier-chapter fix pass applies OQ-90 verbatim. A Foundry importer follows the Read bonus pointer and finds no `proposed_bonus_dice_sources` key.

**Fix options:**

1. Add exact edits that retarget both pointers to `data/core/bonus-dice-sources.yaml`.
2. Keep a forwarding key in `read.yaml`, though that preserves two sources for one table and is weaker than option 1.

### 11. Major. Call It disagrees on whether the reader can benefit from their own warning

**Location:** Section 5.8, lines 556 to 565; `data/engagement/read.yaml`, `call_it.effect` and `proposed_bonus_dice_sources.call-it`; OQ-84.

**Problem:** The procedure gives the bonus to "each target" who makes a dodge. The Bonus Dice condition requires "a comrade's Read," which excludes the reader themselves under Chapter 1's definition of comrade. This changes a normal defense by 2 dice.

**Scenario:** A lone soldier Reads a Grab, spends the second success to Call It, and becomes its target. The procedure grants 2 dice to their dodge; the Bonus Dice source denies them because no comrade made the Read.

**Fix options:**

1. Make Call It teamwork-only and say "each target other than the reader" in prose and data.
2. Let the reader benefit and replace "a comrade's Read" with "a Read" in the Bonus Dice condition.

### 12. Major. A typical round is unlikely to stay inside 12 to 20 minutes

**Location:** Sections 5.3 to 5.9; `data/engagement/round.yaml`, `round_steps` and `gm_tracker`.

**Problem:** The default Squad produces six soldier turns. A typical one-Titan round also needs Wing assignment, seven unique cards, any swaps, one Attention evaluation through up to five rungs and three tie-breaks, one behavior legality and fallback check, target Reactions, a hidden behavior roll, roughly two to four strike or Break Attention tracker updates, up to six Gas Rolls, Regeneration, and Background clocks. That is about 12 to 15 GM update moments, plus six player decisions and their rolls, Pushes, Stress Responses, Help, and gear wear.

The tracker itself carries about twenty live marks for one Titan once the five Body Part state/count pairs, flags by creator, Openings by creator, behavior state, Attention, cards, Regeneration, and Grab fields are counted. A second Focus Titan duplicates most of that and doubles every soldier's Position record. Even at one minute per soldier turn, the remaining procedures have only 6 to 14 minutes. First-session and two-Titan rounds will routinely exceed 20 minutes.

**Scenario:** Four player characters and two Squadmates fight one Medium Titan with one Background clock. Three soldiers Push, one Stress Response fires, two Help actions occur, and four soldiers used ODM Gear. The round requires well over twenty separate decisions, rolls, or tracker mutations before table talk.

**Fix options:**

1. Run a timed paper test with six soldiers and publish median round time. Do not accept the current bookkeeping until typical rounds meet the target.
2. Fix Wings for the Engagement, replace dealt cards with a smaller initiative method, and collapse Body Part count plus state into one track per part.
3. Move Gas Rolls to one Squad-level end check or roll them simultaneously, and give the GM a generated tracker that exposes only fields currently needed.

### 13. Minor. A Background Titan can choose Attention from the previous round's cards

**Location:** Section 5.10, lines 648 to 654; `data/engagement/background-titans.yaml`, `full_clock`; `data/engagement/attention.yaml`, `evaluation.card`; `data/engagement/round.yaml`, `end_steps`.

**Problem:** A Background Titan enters during the background-clock end step and evaluates Attention immediately. Cards were dealt for the round that is ending, so the "lowest card this round" tie-break does not skip. The new Titan uses stale cards even though it receives no card until the next round.

**Scenario:** Titan B enters at the end of round 3. Two Distant soldiers tie on every rung, so B chooses the soldier with round 3's lower card. Round 4 then deals new cards before B can act and re-evaluates on its card.

**Fix options:**

1. Skip the card tie-break for a Titan entering at the end step and use Squad sheet order.
2. Delay its first Attention evaluation until the next round's deal or its first card.

### 14. Minor. Starting placement disagrees on whether a starting rule may override Distant

**Location:** Section 5.1, lines 88 to 96; `data/engagement/positions.yaml`, `placement.default`; OQ-75.

**Problem:** The prose and OQ say everyone starts Distant. The YAML says the rule that begins the Engagement may name other Positions for named soldiers. That exception matters once Mission Briefs begin engagements from ambushes, breaches, or rescues.

**Scenario:** A later Mission Brief starts one soldier On Body. The YAML permits it, while section 5.1 tells the table that every participant starts Distant.

**Fix options:**

1. Add the YAML exception to the prose and OQ-75.
2. Remove the exception from YAML and require every later starting rule to begin at Distant.

### 15. Minor. The tuning build data omits fields the amended ADR requires

**Location:** `data/engagement/tuning.yaml`, `builds`; section 5.13, lines 740 to 748; ADR-0014.

**Problem:** The YAML build strings omit several full-build fields. Rookie omits Wits, Empathy, Resolve derivation, Health, horse, and its default Stress. Veteran omits Wits, Agility details beyond the short list, Health, horse, and default Stress. Levi-grade omits Health, horse, Scars, and default Stress. The models then supply different Stress values ad hoc. A simulator cannot construct the amended reference builds from this purported source of truth without rereading the ADR and model prose.

**Scenario:** A later simulator loads `tuning.yaml` to run the prepared-Squad and Grab targets. It cannot tell whether the Rookie starts at Stress 1 or the model's 0 or 2, or generate the required Health reports from a structured build.

**Fix options:**

1. Store every reference field as structured YAML, including all attributes, Health, Resolve, Scars, item ratings, Talent policy, and starting Stress.
2. Make `tuning.yaml` point to one structured reference-build table instead of restating incomplete prose strings.

## Independent odds audit

The independent runs used the amended Rookie ODM Gear rating 2 and batch 2b's zero Talent dice on dodge, Fly, Break Attention, Ride, and Read.

| Target or probe | Chapter | Independent |
|---|---:|---:|
| Rookie lone Nape, Stress 0 | 9.8% | 10.1% |
| Rookie lone Nape, Stress 1 | 12.9% | 13.1% |
| Levi-grade lone Nape, Stress 0 to 3 | 46.3% to 47.3% | 46.1% to 47.4% |
| Lone Grab, failed dodge | 68.4% | 68.5% |
| Lone Grab, no dodge | 40.1% | 40.3% |
| Two Large Titans, 50% Help and Cover | 28.5% | 28.6% |
| Two Large Titans, Help and Cover every dodge | not reported | 35.5% |

The lone Nape and Grab arithmetic reproduces. The reproduced numbers confirm findings 4 and 5 rather than clearing them. The Jam figure reproduces only with the chapter's unsupported 50% availability input. The prepared-Squad 77% cannot be accepted as the ADR target because that run starts at Stress 0 and uses a reduced rules model. My damage-only sensitivity probe is reported under finding 2, not offered as a replacement full-fight result.

The six Grab cells were not independently accepted as full-rules cells. `tuning.yaml` says they exclude Help, Covering, Drive, Pry Loose, Break Attention rescue, Nape kills, and Squad Tactics, while `simulator_cases` says the full cases remain owed. Their reported one-comrade values, 28.3%, 32.9%, 38.9%, 33.1%, 39.0%, and 43.7%, satisfy the narrow OQ-50 band in that reduced model. They do not finish ADR-0014 verification under the actual Chapter 5 choices.

## GM bookkeeping count

For a typical one-Titan round with the default six soldiers, the GM handles roughly:

- 7 card assignments and up to 3 swap pairs;
- 1 Attention evaluation, 1 behavior legality or fallback check, 1 target pass, and 1 hidden behavior roll;
- about 2 to 4 strike, Break Attention, Opening, or flag updates;
- up to 6 Gas Roll results;
- 1 Regeneration update and 0 to 2 Background clock updates.

That is about 18 to 25 discrete GM-facing checks or mutations before player roll resolution and table discussion. The live one-Titan tracker holds about twenty marks. A second Focus Titan adds another behavior cycle, another full tracker row, and a second Position for every soldier. Finding 12 records the timing risk.

## Provisional decisions

| OQ | Judgment | Reason |
|---|---|---|
| OQ-74 | Partly sound | The graphs are closed, but Open permits a terrain-anchored Blind Spot where no terrain anchor exists. Finding 8. |
| OQ-75 | Sound in substance | Per-Titan Positions and the close rule work. The starting-rule exception needs the Minor synchronization in finding 14. |
| OQ-76 | Sound | Leaving, returning, the one shared outside Position, the Down crawl, and fall landing all terminate. |
| OQ-77 | Sound mechanically | Cards, swaps, Wings, and end steps have a complete order. Their combined table cost is finding 12. |
| OQ-78 | Not yet sound | Values rely on the wrong prepared-Squad start and an invalid Jam acceptance model. Findings 1 and 2. |
| OQ-79 | Unsound | The reference Stress 1 Rookie is above ADR-0014's 10% ceiling. Finding 4. |
| OQ-80 | Sound | Illegal rolls, previous behavior, Position fallback, holding, decoys, tiers, and Telegraphs have a closed order. |
| OQ-81 | Sound | Candidate tests, ties, flags, Down soldiers, decoys, and Grab rescue are explicit. |
| OQ-82 | Partly sound | Body Part and Regeneration rules work except when grip Toughness drops below an existing arm count. Finding 7. |
| OQ-83 | Sound | Creator marks enforce ADR-0007 and ADR-0010 without a solo carry-over. |
| OQ-84 | Not sound | Tracker visibility defeats two Read facts, and Call It disagrees on self-benefit. Findings 6 and 11. |
| OQ-85 | Unsound | Refusing a revealed Grab is much safer, death in a grip is not cleaned up, and the full rescue simulator cases remain owed. Findings 3 and 5. |
| OQ-86 | Sound | Witness scope and timing agree with Chapter 3 and the Fear Roll limits. |
| OQ-87 | Sound as an interim procedure | Setup tables roll every field, clock entry order is closed, and the retreat enforces the two-Titan cap. |
| OQ-88 | Sound | Both ending tests terminate and make carrying the explicit rescue for Down soldiers. |
| OQ-89 | Not sound | The list exists, but tactic declaration is undefined and none is simulated. Findings 9 and 12. |
| OQ-90 | Partly sound | The listed earlier-chapter changes are otherwise appropriate, but item 1 leaves dangling pointers. Finding 10. |

## Dependencies, scope, and terminology

Chapter 5 meets the decisions file's explicit Grabbed forbid hook, victim-turn countdown, Toughness 1 hand, non-lethal crushing injury, witnesses, leaving, Down movement, starting-Position Drive rule, two-Titan Position rule, and own-Opening decision. Findings 1 and 2 are the failures against its tuning constraints.

OQ-90 correctly names the earlier Chapter 1 to 4 rule changes needed for the new Bonus Dice sources, Catalog entries, Grab carrying edge, and stale forward pointers, apart from finding 10. Those changes should land only after this review's mechanical decisions, so the owning earlier chapters do not need two repair passes.

Expeditions, Mission Briefs, Chases, Operation Frames, Shifters, hostile Titan stat blocks, Rank, Squad Points, and Research Points are only forward-referenced. I found no drafted Phase 2 procedure and no misuse of a glossary `_Avoid_` term. Attack on Titan fidelity is strongest in Attention, the single-cut Nape kill, grounding, rescue pressure, and the two-Focus-Titan retreat. It is weakest where Open terrain invents an anchor and where an informed soldier survives a Grab by refusing to dodge.
