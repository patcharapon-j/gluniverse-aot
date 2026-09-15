# Chapter 5, Titan Engagement: review round 1

Reviewed:

- `docs/rules/05-titan-engagement.md`.
- Every file in `data/engagement/` (15 files, `tuning.yaml` included).
- OQ-74 to OQ-90 in `docs/rules/OPEN-QUESTIONS.md`.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended.
- Chapters 1 to 4 and their data (`data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`).
- `docs/rules/DECISIONS-2026-09-14.md`, including batch 2b, the Health boxes rule, and *Constraints on the undrafted Phase 1 chapters* for Chapter 5.

I did not read the parallel Codex review.

Odds come from Python scripts in the session scratchpad, which are not committed. The appendix gives the models. All figures use the batch 2b reference builds: no Talent dice on the dodge, Fly, Break Attention, Ride, or Read, and Rookie ODM Gear and horse rated 2.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**2 Critical, 8 Major, 10 Minor.**

The chassis is strong. The Behavior Table procedure, the hidden Next Behavior checked against Positions only at the card, the Attention Ladder with closed tie-breaks, Openings with creators, and the Grab as procedure steps are all rules with nothing to judge. No rule rests on GM discretion. The solo, Jam, and Grab figures reproduce.

Two rules break play:

1. **Declining to dodge a Grab is the better play** (finding 1). Every Grab is announced before Reactions, and a failed dodge spends the victim's one unpenalized Break Free. A rational lone victim dies 40.1% of the time, not about 2 in 3, and the reference rescue cell falls from 32.9% to 19.5%. OQ-85 logs it but leaves it open. It needs a fix before the chapter is accepted.
2. **The riderless-horse decoy is free and repeatable** (finding 2). Two Squadmates at Distant who Break Attention every turn stop 72.5% of a Medium Titan's cards. That cuts a prepared Squad's Critical Injuries per fight from 1.10 to 0.33.

The headline kill figure did not reproduce (finding 3). My literal model of the stated policy gives median round 4 and 43.8% by round 3, not median 3 and 77%. The only Nape Depth that reaches median 3 in my model breaks the solo bound. I rate it Major because the drafter's model is not in the repository and differs in stated ways. It becomes Critical if the `tools/` simulator confirms the gap.

## Checks that passed

- **Glossary.** No `_Avoid_` term appears in the chapter or its YAML. The only near-hit, "Giant Forest", is itself a glossary term.
- **GM discretion.** None. The *No rulings* list, the `gm` row of `squad-tactics.yaml`, the interim setup table, and the closed effect-type, fact, test, and decoy lists leave nothing to judge.
- **Data.** All 52 YAML files under `data/` parse. Every prose table points to its YAML block, and the prose does not copy rows, apart from the slips in finding 15.
- **Decisions-file constraints on Chapter 5.** All met:
  - The Grabbed row carries `forbids: [help, cover, reaction]`, and a Grabbed soldier can Push.
  - The lift and the devour are procedure steps with no Severity and no Reaction (ADR-0015).
  - Reach and strike penalties are in `grab.yaml` (`escapes`).
  - The crush crosses a Health box under the owner's Health boxes rule.
  - Witnesses, the ending, leaving, and a Down soldier's move are defined.
  - The Jam test and the six Grab cells are shown.
  - Positions relative to two Focus Titans and recorded horse and item Positions are settled (OQ-61).
  - Soldiers who left count as one Position.
  - The own-Openings question from OQ-28 is answered.
  - The one partial gap, Severity tuning, is finding 18.
- **Phase 2.** Nothing is drafted: Chases, Operation Frames, Shifters, Squad Points, and Research Points are forward references only. The interim setup table is a logged stopgap (OQ-87), like Chapter 4's interim issue.
- **Example.** The dice arithmetic checks. Mila's 8 base dice, 2 then 3 successes, and Stress 2; Jonas's 7 base dice with 4 successes; Mila's 7-die dodge meeting Severity 2; and the Opening spend of 3, 2, then 1 all agree with the rules.

**Figures that reproduce** (mine, then the chapter's):

| Figure | Mine | Chapter |
|---|---|---|
| Lone Rookie, Nape Depth 4, Stress 0 to 3 | 9.8, 13.2, 15.8, 17.4% | 9.8, 12.9, 15.5, 17.4% |
| Lone Veteran, Nape Depth 4 | 27.0, 29.7, 32.2, 33.7% | 26.9, 29.8, 32.2, 33.8% |
| Lone Levi-grade, Nape Depth 4 | 46.0, 46.9, 47.3, 46.5% | 46.4, 47.2, 47.3, 46.3% |
| Lone Rookie, Nape Depth 5 | 2.2, 3.5, 5.2, 6.8% | 2.3, 3.7, 5.2, 6.8% |
| Lone Levi-grade, Nape Depth 5 | 24.6, 26.6, 28.7, 28.2% | 24.7, 26.5, 28.5, 28.5% |
| Jam test worst cell, one Titan then two (Small, Medium, Large) | 9.1/21.1, 11.6/26.7, 12.3/28.5% | 8.8/20.9, 11.4/26.8, 12.3/28.5% |
| Grab, one comrade, victim dodged, six cells | 28.2, 32.8, 38.9, 33.3, 39.1, 44.1% | 28.3, 32.9, 38.9, 33.1, 39.0, 43.7% |
| Grab, two comrades, victim dodged | 12.4, 17.2, 23.1, 17.2, 23.4, 29.7% | 12.8, 17.2, 23.4, 17.3, 23.4, 29.9% |
| Grab, lone victim, dodged / did not dodge | 68.6% / 40.1% | 68.4% / 40.1% |

## Findings

### 1. Critical. Declining to dodge a Grab is the better play, so both Grab targets miss under rational play

**Location:** Section 5.9 *The countdown* and OQ-85's known issue. Also `grab.yaml` (`countdown.counts`), section 5.5 *Resolving a card* steps 5 and 6, and Chapter 1 section 1.9 *Which turn it spends*.

**Problem:**

- The countdown counts the victim's own turns, including a turn spent in advance.
- A failed dodge spends the victim's earliest wholly unspent turn. That is always the first counted turn: this round's turn if their card has not come up, otherwise next round's.
- So a victim who dodged and failed reaches the lift with no Break Free attempt. Their only attempt comes after the lift, with a 2-die penalty. A victim who did not dodge gets one unpenalized attempt and one penalized one.
- Step 5 announces the behavior before step 6's Reactions, so every victim knows it is a Grab before deciding. OQ-85 says this bites "once a Read has revealed a Grab". It bites on every Grab.

The Rookie's dodge meets Severity 3 only 20.5% of the time at Stress 1 (100,000 trials). A lone victim who always dodges therefore dies on about 54.5% of Grab cards (79.5% × 68.6%). One who never dodges dies on 40.1%. Refusing a Reaction is dominant by 14 points.

The same holds with a comrade. The chapter's reference cells assume the victim dodged. With a rational victim who does not dodge:

| One comrade close | S1 G0 | S2 G0 | S3 G0 | S1 G1 | S2 G1 | S3 G1 |
|---|---|---|---|---|---|---|
| Victim dodged (chapter reference) | 28.2% | 32.8% | 38.9% | 33.3% | 39.1% | 44.1% |
| Victim did not dodge | 16.9% | 19.5% | 22.9% | 20.1% | 22.9% | 26.2% |
| Two comrades, victim did not dodge | 7.3% | 10.2% | 13.6% | 10.0% | 13.9% | 17.6% |

ADR-0014's "about 2 in 3 when alone" becomes 40%. The OQ-50 reference cell (Stress 2, no Grief), which the decisions file wants near a third, becomes 19.5%. This is a rules bug that makes an ADR-0014 target unreachable under optimal play. The known-issue note does not make it acceptable.

It is also a fidelity and feel problem. The game teaches players to stand still when a hand comes for them.

**Scenario:** Round 2. Private Anna Roth holds In Reach and Attention, and her card (14) comes after the Titan's (6). The Titan's card announces Grab, Severity 3.

- **If she dodges:** she rolls 5 dice and fails. The dodge spends her round 2 turn. The Grab lands, and her round 2 card comes up already spent, so she is lifted with no attempt. In round 3 she rolls Break Free with 2 dice fewer, needing 2, and fails. She is devoured.
- **If she does not dodge:** her round 2 card (14) is a full Break Free at 6 dice, before the lift.

The player who knows the rules never dodges.

**Fix options:**

1. **OQ-85 option (d).** The first counted turn begins with its action spent. Both choices then lose the unpenalized attempt, and dodging becomes strictly better. Lone victim 68.0%; one-comrade cells 27.8, 32.9, 39.0, 33.2, 39.2, 43.6%, all unchanged within noise.
2. **A turn spent by a Reaction against the Grab does not count toward the countdown, and Break Free needs 3 successes.** Dodgers and non-dodgers then get the same attempts. Lone victim 67.7%; one comrade 28.0, 33.3, 38.8, 32.8, 38.9, 44.3%; two comrades 12.5, 17.0, 23.4, 17.3, 23.2, 30.0%. With a lift penalty of 1 instead of 2, the lone victim is 64.0%.
3. Whichever fix is chosen, re-measure with the victim's choice made optimally in the model. Record both the always-dodge and the never-dodge figures in `tuning.yaml` (`grab`) so the dominance test is repeatable.

### 2. Critical. The riderless-horse decoy is free and repeatable from Distant, so two Squadmates can switch a Titan off

**Location:** Section 5.6 *Break Attention and decoys*, `attention.yaml` (`break_attention.decoys`, `riderless-horse`: `spends_when_declared: none`), and OQ-81's claim that "each decoy has its own price".

**Problem:**

- A soldier at Distant with their horse at Distant meets the riderless-horse requirement. On success the horse "holds Distant", which is where it already was, so the requirement is met again on the soldier's next turn.
- Nothing is spent. The horse wears only on a Pushed roll (ADR-0004), and a Squadmate never Pushes (section 5.14), so a Squadmate's horse never goes lame.
- The decoy works against Broken eyes.
- Each success stops a whole Titan card and spends its Next Behavior. Extra successes also create Openings for the strikers.

OQ-81's "price (a horse)" does not exist. The flare costs supply and brings Titans, and the cloak works once. The horse costs nothing.

Medium Titan, Tempo 1, 6 rounds, decoyers with Perception 3, horse 2, Stress 1 (40,000 fights). Share of the Titan's cards that resolve a behavior:

| Decoyers at Distant | Push when short | Never Push (a Squadmate) |
|---|---|---|
| None | 100% | 100% |
| One | 40.5% (horse lame by round 6 in 7.0% of fights) | 48.4% (never lame) |
| Two | 20.8% | 27.5% |
| One, with three swap partners | 32.1% | 41.9% |

In the full prepared-Squad model (4 Rookie player characters plus 2 Squadmates, Wooded, Nape Depth 4, 12,000 fights), the two Squadmates were either idle or Distant horse decoyers:

| Squadmates | Median kill round | By round 3 | By round 4 | Critical Injuries per fight | Grabs per fight | Titan cards resolved per round |
|---|---|---|---|---|---|---|
| Idle | 4 | 43.7% | not recorded | 1.10 | 0.35 | 0.88 |
| Horse decoyers | 3 | 52.9% | 70.4% | 0.33 | 0.12 | 0.31 |

- **Targets.** Critical Injuries fall by 70% and devours to 0.002 per fight. This breaks ADR-0014's Expedition Critical Injury and death targets, and the premise that a Titan is a natural disaster.
- **Solo play.** A lone soldier with a horse can loop Break Attention safely until the card order lets them strike.
- **Fidelity.** Titans in 845 to 850 ignore horses and go for people. The glossary names the decoy, but a repeatable one makes the animal more interesting to a Titan than the soldiers.

**Scenario:** Round 1. The players post Squadmates Ilse and Karl, mounted, at Distant. Every round each takes Break Attention naming their own horse and never Pushes. Ilse succeeds on 5 dice needing 1 about 60% of the time, and Karl covers her failures. The four player characters cut the legs and the Nape. The Titan resolves about one card in three, and the Squad learns that the Survey Corps' real weapon is two riders waving at a Titan.

**Fix options:**

1. **The horse bolts.** On success it leaves the Titan Engagement riderless and is recovered when the Engagement ends. Each horse decoys once per Engagement, a price comparable to the cloak.
2. **Titans are not fooled twice running.** A Titan whose previous card was spent by a decoy ignores decoys on its next card: Break Attention against it cannot succeed until a card has resolved a behavior. This caps any decoy at every other card.
3. **Break Attention needs the soldier at In Reach or closer.** The decoy has to be placed under the Titan's eyes, so decoyers share the danger. Pair this with option 1 or 2, because In Reach alone still allows a loop.

### 3. Major. The prepared-Squad kill figure does not reproduce

**Location:** Section 5.13 *A prepared Squad kills a Medium Titan in about 3 rounds*, `tuning.yaml` (`prepared_squad_kill`), and OQ-78's figures.

**Problem:** I built the stated sequential policy literally:

- two Rookies cut the more damaged leg from In Reach, Helped by up to two comrades not at Blind Spot;
- two strike the Nape from Blind Spot once others' Openings and the grounded dice give at least 2 Bonus Dice, or from round 3.

The model has the standard ladder with tie-breaks, move-up and fallbacks, Openings with creators, grounding, Regeneration 3, turn debt, Push wear, Jams, falls, gas, Grabs with rescue, witnesses' Fear Rolls, and Critical Injuries crossing Health boxes. Medium, Nape Depth 4, 12,000 to 15,000 fights per row:

| Case | Median kill round | By round 3 | By round 4 | Critical Injuries per fight |
|---|---|---|---|---|
| Chapter, sequential | 3 | 77% | 84% | 0.55 |
| Dodge every harming behavior, Stress 0 | 4 | 42.7% | 57.2% | 1.12 |
| Dodge when the behavior would harm, Stress 0 | 4 | 43.8% | 57.7% | 1.10 |
| Same, Stress 1 (ADR-0014's fight start) | 4 | 47.3% | not recorded | not recorded |
| Dodge only lethal and Grab behaviors, Stress 0 | 4 | 45.0% | not recorded | 1.44 |
| Best case (strikers never wait, Help only in round 1, grounded moves on foot), Stress 0 | 3 | 55.6% | 67.2% | 0.82 |
| Best case, Stress 1 | 3 | 59.8% | not recorded | 0.77 |
| Nape Depth 3, dodge when it would harm | 3 | 70.2% | 84.6% | 0.84 |
| Nape Depth 3, best case | 2 | 81.9% | not recorded | not recorded |

Per fight in the default row there were 3.45 Nape strikes, 6.55 Body Part strikes, and 2.57 dodges. The Titan was grounded by the end of round 2 in 77% of fights, so the setup works; the Nape Depth 4 cut is what takes time.

In my model, Nape Depth 3 is the value that meets "about 3 rounds". But at Nape Depth 3 the lone Rookie after Break Attention succeeds 29.0%, 32.6%, and 35.6% from Stress 0, 1, and 2, and the Levi-grade soldier 70.2%, 68.7%, and 68.2%. Both miss the solo target badly.

If my model is right, Nape Depth cannot meet ADR-0014's kill and solo targets together, and another lever has to move. The drafter's figure may differ because of its dodge policy, its "simplified Down chance", or Help assignment, none of which the chapter states. The chapter's Critical Injury figure is half mine.

Separately, `tuning.yaml` starts the Rookies at Stress 0, while ADR-0014's reference Rookie starts at Stress 1.

**Scenario:** The decider accepts OQ-78 on the strength of "77% by round 3". The `tools/` simulator is built from the rules text and returns median round 4 with twice the Critical Injuries. Every Size Class value tuned beside Medium (Small's Tempo 2 and Large's Severity) was chosen against a figure that does not hold, and Chapter 6's Titans inherit it.

**Fix options:**

1. **Commit the model.** Put the drafter's simulation script in `tools/`, or state its dodge policy, Down model, and Help rule in `tuning.yaml` (`prepared_squad_kill.model`), so the figure can be reproduced. Re-run at Stress 1.
2. **If the gap holds, move a lever that leaves the solo target alone.** Candidates are Medium leg Toughness, the grounded Bonus Dice, or the Regeneration clock. Measure the kill, the solo strike, the Jam test, and Critical Injuries together. Do not lower Nape Depth.
3. **Report the dodge policy as a column** (always, when harmful, lethal only), because Critical Injuries per fight vary from 0.82 to 1.44 across policies.

### 4. Major. "Comrades close" is read as one comrade, but a real Squad fight has more, and a Grab there kills about 1 time in 18

**Location:** Section 5.13 *A Grab kills about 1 in 3*, the OQ-85 block in section 5.9, and `tuning.yaml` (`grab`).

**Problem:** OQ-85 passes the target by reading "comrades close" as one comrade in reach. In the reference fight, a Grab usually lands on a leg cutter at In Reach, with the other cutter and one or two helpers at In Reach and the strikers at Blind Spot. That means two or three comrades are close before the lift.

- **With two comrades,** the victim dodging, the six cells are 12.4% to 29.7% (Stress 2, no Grief: 17.2%). With the victim not dodging (finding 1), they are 7.3% to 17.6%.
- **The cells also omit three rescues the chapter allows:**
  - Break Attention needing 2 successes, which works from Distant with a horse;
  - Help on Break Free, which needs only one Position step;
  - Pry Loose.
- **In the full prepared-Squad model** there were 0.36 Grabs and 0.02 devours per fight, about 1 Grab in 18.

ADR-0014 names a Grab's lethality "with comrades close" as a target. A reading that matches only the least likely Squad arrangement meets the letter of the target and misses its purpose. OQ-85's own simulator case lists these rescues as unmeasured.

**Scenario:** A standard Squad of 4 player characters and 2 Squadmates fights a Medium Titan. Three are at In Reach when the Titan grabs Jonas.

1. Before the lift, two comrades strike the hand with Help. Ilse, mounted at Distant, takes Break Attention needing 2.
2. Jonas is free before his first counted turn ends.

The players come away believing Grabs are survivable. The table never shows them the canon image of a comrade devoured beside the Squad.

**Fix options:**

1. **Measure "comrades close" in the Squad model.** Define it as the Squad's positions when the Grab lands, with every rescue the chapter allows, and tune that figure to about 1 in 3. Candidate levers: the holding arm keeps its normal Toughness after the lift, Break Attention needs 3 against a holding Titan, or rescue strikes take a 1-die penalty.
2. **Keep the one-comrade cells as the OQ-50 band test,** but add a binding Squad-model floor, for example a Grab kills at least 1 in 5 in the reference fight. Record both in `tuning.yaml`.

### 5. Major. The order of a soldier's move and action is undefined, though Chapter 1 delegates it here

**Location:** Section 5.3 *Order of play* and `round.yaml` (`order_of_play`). Chapter 1 section 1.9 says "Chapter 5 explains how a turn is ordered".

**Problem:** Section 5.3 says a soldier "takes their turn of one move and one action" and stops there. Nothing says whether:

- the action may come before the move;
- the move may be split around the action;
- a Squadmate on a Wing may act between its player character's move and action.

The worked example shows move then action but states no rule. Several rules turn on the order.

**Scenario:**

- **Cutters.** Jonas at In Reach strikes the leg with 1 success, taking the just-hurt flag, then steps to Distant. On the Titan's card, Ilse, still at In Reach, meets the second rung and takes Attention away from Jonas. If action-first is legal, every cutter can hit and step out, and the In Reach rung becomes a hot potato. If it is not, Jonas stays.
- **Reads.** A Tactician who Reads from Distant for 2 Bonus Dice and then moves In Reach gets the bonus and the Position in one turn only under action-first.
- **Retreat.** A soldier at In Reach beside a Down comrade must use their move toward Distant (finding 9). Lift Comrade needs the same Position, so move-first condemns the comrade and action-first saves them.

Players will read it both ways, and the GM cannot rule.

**Fix options:**

1. **State in `round.yaml`:** "The move and the action may be taken in either order. The move is not split around the action." Add a pointer line to section 5.3. OQ-90's Chapter 1 pointer then has a target.
2. **Fix the order as move, then action.** Simpler, but it removes the Distant Read-then-close play, and the retreat needs finding 9's fix to save Down comrades.

### 6. Major. The lone Rookie misses the 10% bound at ADR-0014's own fight-start Stress, and OQ-79's option (d) contradicts the ADR

**Location:** Section 5.13 *A lone soldier after Break Attention*, OQ-79, and `tuning.yaml` (`solo_nape`).

**Problem:**

- ADR-0014's reference Rookie starts a fight at Stress 1. The target says a lone average soldier who has used Break Attention "succeeds on no more than 10%".
- The Rookie succeeds 13.2% from Stress 1 in my runs (12.9% in the chapter) and 15.8% from Stress 2. A Push on Break Attention raises Stress before the strike, so the Stress 1 row is itself generous.
- OQ-79 option (d) proposes reading the figure at Stress 0. That contradicts the build ADR-0014 fixes for every other target, so the Jam test and the solo test would use different Rookies.
- The miss is logged, so it is not Critical. But it is a hard bound missed at the reference build, and finding 3 shows Nape Depth cannot rise to close it.

**Scenario:** A player's lone Rookie, at Stress 2 after a Pushed Break Attention, makes the Nape strike about 1 time in 6. In a campaign with frequent Break Attention openings, solo kills by Rookies happen several times per Expedition, against the design's "almost never".

**Fix options:**

1. **The decider amends the bound to "about 10%"** and records 13% at Stress 1 as meeting it. This is the smallest honest change.
2. **Reject option (d)'s Stress 0 reading.** Keep one reference Rookie across all targets.
3. **If the bound must hold, find a lever together with finding 3.** It must not be a flat penalty for acting alone (ADR-0010). Examples: a Nape strike made while a decoy holds Attention takes no grounded Bonus Dice, or Break Attention's extra successes create no Openings when no comrade holds a Position within one step.

### 7. Major. Read's facts are mostly public already, and the tracker and `read.yaml` disagree on what is public

**Location:** Section 5.8 *Read* (`read.yaml`, `facts`, `public_without_a_read`), section 5.3 *What the GM tracks* ("Everything on the tracker is public except an unrevealed Next Behavior"), `round.yaml` (`gm_tracker` comment and fields), `titan-harm.yaml` (`body_parts.public`: "Its count and Toughness are revealed by a Read"), and section 5.4 *Stat blocks*.

**Problem:** Two contradictions:

- The tracker lists each Body Part's count and the Regeneration clock and calls the tracker public. `titan-harm.yaml` says counts are revealed only by a Read. `read.yaml` lists the Regeneration clock as a Read fact and omits it from `public_without_a_read`.

For a standard Titan, the facts are hollow:

- Section 5.4 says a standard Titan "takes every number from its Size Class row". Toughness, Nape Depth, and the clock length are printed in `size-classes.yaml`, and the standard ladder is printed in `attention.yaml`.
- Of the five facts, only the Next Behavior is worth a success against any Titan that is not an Abnormal.

**Scenario:** The tracker in the example reads `RL W1 | Regen 2/3`. Jonas Reads with 2 successes and picks "right leg Toughness and count" and "the Regeneration clock". The GM must either repeat what the table already shows or hide values the chapter says are public. Neither is a rule.

**Fix options:**

1. **Hide counts and the Regeneration clock** on the tracker, list both as hidden fields in `round.yaml`, and reveal each only by a Read. The fact list is then worth a success, and the Nape-kill planning rewards the Tactician.
2. **Cut the fact list to what is hidden:** the Next Behavior, counts, the clock, and, for an Abnormal only, its stat values and ladder. Fix `titan-harm.yaml` to match.

### 8. Major. The ending test kills Down soldiers while comrades who left could still come back

**Location:** Section 5.11 *Ending* and `engagement-flow.yaml` (`ending.no-soldier-standing`, `left_behind`). This conflicts with section 5.11 *Leaving* ("A later move can bring them back at Distant") and OQ-76's reason ("come back for the next").

**Problem:**

- The test fires "as soon as" no soldier who holds a Position is alive and not Down.
- A soldier who left holds no Position, so they do not count. When the last standing soldier on the field goes Down, every Down soldier dies at once, even outside a retreat.
- The soldiers who left may return on their next move and can Lift Comrade.
- OQ-88's reason ("rounds with no choices") does not hold while a returning soldier has a choice.

**Scenario:** Round 5, no retreat.

1. Anna carries Down Ben to Distant and leaves.
2. Carl, the last standing soldier on the field, holds In Reach beside Down Dora. The Titan's Bite puts Carl Down.
3. The test fires after the Bite resolves. Carl and Dora die, left to the Titans.
4. Anna's card, three places later, would have brought her back, and Carl's own crawl would have reached Distant.

The rule turns carrying a comrade out into a death sentence for the two left behind.

**Fix options:**

1. **Outside a retreat, count a soldier who has left and is alive and not Down as standing.** Add a round limit so the Engagement cannot stall: it ends at the end step of a round in which no standing soldier holds a Position.
2. **Check `no-soldier-standing` only at the round's end steps,** after soldiers who left have had their turns to return.

### 9. Major. The retreat's forced moves condemn any Down or Grabbed comrade who is not already on the way out

**Location:** Section 5.10 *The retreat* and `background-titans.yaml` (`retreat`).

**Problem:** Every soldier who holds a Position must use each move to step toward Distant, then leave. No one returns.

- **Distant soldiers must leave.** A soldier Distant from every Focus Titan must use their move to leave, so no one can wait at Distant for a Down comrade to crawl out.
- **No step toward a comrade.** No soldier may step toward a Down comrade or toward a Grabbed comrade's hand. After the lift, the hand needs On Body or Blind Spot, so only Clear the Hand or a Break Attention needing 2 can save them.
- **Order matters.** Lift Comrade needs the same Position. Whether a soldier can lift before the forced move depends on finding 5.

Retreats are likely wherever the interim setup table rolls Background Titans and a second Focus Titan is alive.

**Scenario:** Two Focus Titans are alive, and Background 1's clock fills.

- Titan A has lifted Eva, held since round 4. Felix and Greta at In Reach relative to A must step toward Distant, so neither can reach the hand at On Body.
- Down Hans crawls from In Reach to Distant on his card, 17. Irma, at Distant with card 3, was forced to leave on her turn and cannot return.
- Hans and Eva both die, and no player choice was available to save them.

**Fix options:**

1. **Add an alternative to the forced-move list:** "a step toward, or staying at, the Position of a Down or Grabbed comrade". It is a rule-named test with nothing to judge.
2. **Replace forced moves with prohibitions.** In a retreat, a soldier may not step toward In Reach, On Body, or Blind Spot except to reach a Down or Grabbed comrade's Position. Leaving stays voluntary but final.
3. **Resolve finding 5** so a soldier can Lift Comrade before the forced move.

### 10. Major. Who declares a Squad Tactic, and when, is undefined for three of the four

**Location:** Section 5.12 and `squad-tactics.yaml` (`rules.declared_by`, each `condition`).

**Problem:** `declared_by` is "the player of the soldier the condition names":

- **Fall Back** names no soldier ("The wings step of a round begins"). No player can declare it. Its effect says each soldier "may" hold In Reach, but nothing says whether the once-per-Engagement use is spent when some soldiers decline.
- **Hook and Cut** names two soldiers: the Break Attention roller and the Blind Spot comrade. Nothing says whose player declares, or what happens if one wants it and the other does not.
- **Hamstring Line** names the striker and the Helper. Its condition says "declares a Body Part strike", but nothing says whether the tactic is declared before the roll or after it. After the roll, the players spend it only when a success shows, so it is never wasted.
- **Clear the Hand** names a Grabbed soldier who may be Down. Nothing says whether a Down soldier's player can declare an option.

The Chapter 2 roll-off covers choosing tactics, not using them (ADR-0003 item 8).

**Scenario:** Mila's Break Attention succeeds. Jonas, at Blind Spot, has an unspent action. Mila's player declares Hook and Cut. Jonas's player wants to keep the tactic for the Grab they expect and refuses. No rule decides.

**Fix options:**

1. **Name one declarer per tactic in its row:**
   - Hook and Cut: the comrade who strikes.
   - Hamstring Line: the striker, before the roll.
   - Clear the Hand: the first player in card order whose soldier is not Down.
   - Fall Back: any player at the wings step, with each soldier's player choosing whether that soldier moves. The use is spent once declared.
2. **Use Chapter 2's group roll-off for any disagreement at use time,** and state before-roll declaration for every tactic whose effect changes a roll.

### 11. Minor. The move-up rule makes the kill share swing from 17% to 67% by the previous behavior, and moves a Broken arm's share onto Bite

**Location:** Section 5.5 *Rolling the Next Behavior* step 3, `behavior-procedure.yaml` (`next_behavior`), and OQ-80's reason ("keep lethal harm to a third of rolls").

**Problem:** Moving an illegal result up to the next entry adds its share to that entry. The shares come from an exact Markov chain on the reference Titan's table, with the no-repeat rule:

| Table state | Terrorize | Control | Kill | Bite |
|---|---|---|---|---|
| All parts intact, long run | 33.3% | 33.3% | 33.3% | 16.7% |
| All intact, previous behavior was result 4 | 33.3% | 16.7% | 50.0% (Grab 33%) | 16.7% |
| All intact, previous behavior was result 6 | 33.3% | 50.0% | 16.7% | 0% |
| Both arms Broken, long run | 41.0% | 27.2% | 31.8% | 31.8% |
| Both arms Broken, previous result 4 | 33.3% | 0% | 66.7% | 66.7% |

- "A third of rolls" holds only as a long-run average.
- The previous behavior is public, so the swing is readable, which may be a feature.
- Breaking arms keeps the kill share near a third and converts the Grab's share into Bite, instead of softening the Titan.

**Scenario:** The Squad breaks both arms to stop Grabs. Two cards later the previous behavior was a Stomp (result 4). The next card is a Bite two times in three, with no Read needed to know it.

**Fix options:**

1. **Move down toward terrorize instead of up,** wrapping from 1 to 6, so disabling parts softens the Titan and rewards setup (ADR-0007).
2. **Keep move-up but tell Chapter 6's authors** that the entry after a part-dependent entry inherits its share. Have the simulator report per-table conditional kill shares.

### 12. Minor. A Nape striker who falls short does not draw the Titan while anyone is On Body

**Location:** Section 5.6 *The Attention Ladder* rung 1 and *evaluation* step 2. Section 5.7 *Nape strikes* ("so a striker who falls short draws the Titan's turn"). ADR-0010.

**Problem:**

- Rung 1 is met by being at On Body or by holding the hooked-by-strike flag. A tie narrows through the lower rungs to nearest, which ranks On Body above Blind Spot.
- A soldier On Body beats the short striker unless the striker also just hurt the Titan or is loudest.
- ADR-0010's and section 5.7's sentence is then false in the common grounded-Titan fight, where soldiers climb on.

**Scenario:** Jonas is On Body cutting the eyes. Mila at Blind Spot strikes the Nape and falls short. On the Titan's card both meet rung 1. Neither is In Reach or loudest, and Jonas's eye strike had no success. Nearest picks Jonas, and Mila is never looked at.

**Fix options:**

1. **Split rung 1** into "holding hooked-by-strike" above "at On Body", which keeps ADR-0010's order of stimuli.
2. **Keep the rung and correct the sentence** in section 5.7 and ADR-0010's consequence note to "draws the Titan's turn unless someone is On Body".

### 13. Minor. Break Attention can be taken while a decoy already holds, and farms Openings

**Location:** `attention.yaml` (`break_attention.requirements`, `on_success`) and section 5.6.

**Problem:**

- No requirement stops a second Break Attention while a decoy holds the Titan's Attention.
- The second success changes nothing about Attention but still creates an Opening for each extra success.
- A Rookie with a horse (5 dice, needing 1) averages 0.24 extra successes per unpushed roll. With finding 2's loop, two Distant riders add about 0.47 Openings a round for the strikers.

**Scenario:** Ilse's decoy already holds. Karl, whose card comes next, takes Break Attention anyway and rolls two 6s, creating an Opening for Mila's Nape strike at no cost.

**Fix options:**

1. **Add a requirement:** "No decoy holds the named Titan's Attention."
2. **Create Openings only from a Break Attention** that moved Attention or freed a Grabbed soldier.

### 14. Minor. A holding arm's existing count against its Toughness of 1 is undefined

**Location:** Section 5.9 *When a Grab lands* step 2, `grab.yaml` (`grab_lands`, `release`), and `titan-harm.yaml` (`count`: "from 0 up to one less than its Toughness").

**Problem:**

- The Grab uses the first unbroken arm, which may be Wounded or carry a count.
- **Count on hold.** At Toughness 1, a count of 1 exceeds the allowed range. Nothing says whether the arm changes state at once or the count clears.
- **Count on release.** Nothing says what happens to the count when Toughness returns to normal.
- **A Wounded arm.** A Wounded holding arm needs 1 success to Break, not the "2 accumulated successes" the escapes table states. The six cells assumed an Intact arm.

**Scenario:** The left arm is Intact with count 1 (Toughness 2) from Anna's strike. The Titan's Grab lands with that arm, and its Toughness becomes 1. Is it Wounded now, before anyone strikes it?

**Fix options:**

1. **In `grab_lands.hold`:** "Set the holding arm's count to 0." In `release`: "Its count returns to 0."
2. **State in the escapes row** that a Wounded holding arm Breaks on 1 success. Report a Wounded-arm Grab cell in `tuning.yaml`.

### 15. Minor. Prose and YAML slips

**Location and problem:**

- **Mounted steps.** Section 5.2's OQ-74 block says "A mounted move makes only the Distant to In Reach step". Urban's row in `anchor-ratings.yaml` has `mounted: false` on that step, so a mounted soldier makes no step at all in Urban. OQ-74 option (a) says only that Open lacks flying.
- **The holding step.** Section 5.5 *Resolving a card* step 1 omits "Clear the flags for this Titan", which `behavior-procedure.yaml` (`holding`) has. Section 5.6 still clears flags at the card, so the effect agrees, but the step list does not.
- **Clear the Hand.** Section 5.12's row reads as if only the In Reach strike needs no working ODM Gear. `squad-tactics.yaml` lifts the requirement for every strike against the arm.
- **Kill model prose.** The section 5.13 kill design note omits `tuning.yaml`'s "Critical Injuries use a simplified Down chance" and its Stress 0 start (finding 3).

**Scenario:** A table in Urban has a Rider who reads section 5.2, rides from Distant to In Reach, and is told by the YAML that the step does not exist.

**Fix options:**

1. **Correct the prose to match the YAML** in each case. If mounted soldiers should reach In Reach in Urban, correct the YAML row instead.

### 16. Minor. Glossary and ADR wording lag the chapter

**Location:** `CONTEXT.md` **Opening** ("Any ally can spend them"), OQ-83 and OQ-90, ADR-0010 ("The Blind Spot is anchored to terrain"), and `anchor-ratings.yaml` Open ("no anchors but the Titan itself", with an On Body to Blind Spot ODM step).

**Problem:**

- OQ-83 bars a creator from spending their own Openings and logs its reading of "any ally", but OQ-90 lists no `CONTEXT.md` change. The glossary still tells a reader they can spend their own.
- Open has nothing to anchor the Blind Spot to, yet allows it, against ADR-0010's wording. It is defensible, since a soldier can anchor to the Titan's back, but it is unlogged.

**Scenario:** A new player reads the glossary, spends their own Relentless Opening, and is corrected by a rule that is not in the glossary.

**Fix options:**

1. **Add a CONTEXT.md item to OQ-90:** "Any comrade of its creator can spend them."
2. **Log the Open Blind Spot under OQ-74** as anchored to the Titan's body on Open, or remove Open's On Body to Blind Spot step.

### 17. Minor. The example skips the Gas Rolls made when the Engagement ends mid-round

**Location:** Example, *The kill*, and `data/gear/odm-gear.yaml` (`gas_roll.when`: "If the Titan Engagement ends during a round, the Gas Rolls for that round are made at once").

**Problem:**

- Mila used ODM Gear on her dodge and Jonas on his ODM move, so both owe a Gas Roll before Chapter 3's end steps. The example goes straight to Chapter 3's end steps.
- Section 5.3 *End steps* does not mention the mid-round case either.

**Scenario:** A table following the example never rolls gas when a kill ends the fight, and canisters last longer than Chapter 4's figures.

**Fix options:**

1. **Add a line to the example:** "Mila and Jonas each make their Gas Roll at once."
2. **Add a pointer in section 5.3** to Chapter 4's mid-round rule.

### 18. Minor. Severity was never varied for Medium, so the Severity constraint is met only nominally

**Location:** Section 5.13, `tuning.yaml` (`alternatives_rejected`), and the decisions file's Chapter 5 constraint "Tunes Severity against a Rookie dodging with Agility 3, ODM Gear 2, no dodge Talent, and Stress 1".

**Problem:**

- Medium Severity 1, 2, 3 was chosen and never compared. Only Large's Severity changed.
- The Rookie dodge is about 50% at Severity 2 and 20.5% at Severity 3, a swing that moves Critical Injuries per fight and the Jam test more than any Tempo change measured.
- The kill figures ran at Stress 0, not the Stress 1 the constraint names.

**Scenario:** The decider asks whether Severity 3 on the kill tier is right. Neither the chapter nor `tuning.yaml` has a Medium row to answer from.

**Fix options:**

1. **Add Medium rows** for Severity 1, 2, 2 and 2, 3, 3 at Stress 1, reporting the kill, Critical Injuries, deaths, and the Jam test.

### 19. Minor. The solo model ignores card order, so a lone soldier's time and exposure are unmeasured

**Location:** `tuning.yaml` (`solo_nape.model`) and section 5.13.

**Problem:**

- A decoy holds until the Titan's next card, and the soldier's next action is next round.
- Against Tempo 1, a Break Attention placed before the Titan's card is spent by that card. A success is usable only if the soldier's card fell after the Titan's this round and falls before it next round: half of successes.
- Against a Small Titan at Tempo 2, a success placed after both of its cards is usable 1 time in 3.
- The per-strike figure ADR-0014 names is unaffected, but the rounds spent and the behaviors taken while trying are not reported. Players will judge the solo route by those.

**Scenario:** Levi-grade Captain Vera fights a Small Titan alone. Her card lands between the Titan's two cards for three rounds running. Each Break Attention is spent before she can strike, and she takes three behaviors in a figure that says she strikes at once.

**Fix options:**

1. **Add rounds-to-strike and harming behaviors per strike** to `solo_nape`.
2. **Note in section 5.13** that Hook and Cut, or a swap partner, removes the card-order wait, which is the teamwork lever ADR-0010 intends.

### 20. Minor. Grab rounds and two-Titan rounds are unlikely to run in 20 minutes

**Location:** Sections 5.3 *What the GM tracks*, 5.6, and 5.9. See *GM bookkeeping* below.

**Problem:**

- A typical round against one Tempo 1 Titan runs in about 13 to 18 minutes.
- A Grab round adds up to five witness Fear Rolls, a Critical Injury, and countdown bookkeeping.
- Two Focus Titans double the tracker, the ladders, and every Position record.
- Both are likely to exceed 20 minutes. The chapter offers no aid beyond the tracker line.

**Scenario:** Round 4 against two Focus Titans. One Grab lands and a Background clock fills. Six Positions per Titan, two ladders with tie-breaks, five Fear Rolls, a Critical Injury, and two Regeneration clocks put the round near 30 minutes.

**Fix options:**

1. **Print a Titan card** with the ladder as a checklist and the tracker fields in card order, and a per-soldier Position strip with one column per Titan label.
2. **Let witnesses roll their Fear Rolls together** and resolve them in card order, which Chapter 3's one-roll-per-event rule already permits.

## GM bookkeeping

Per-round means from the prepared-Squad model (4 Rookie player characters, one Medium Titan, Tempo 1, Wooded):

| Item | Per round |
|---|---|
| Pool rolls with their Stress Response rolls | 3.4 to 4.0 |
| Pushes | 1.2 |
| GM tracker writes (after the deal, each Titan card, each strike or Break Attention, end steps) | 7.5 |
| Ladder evaluations (up to five rungs, three tie-breaks) | 0.88 |
| Hidden Next Behavior rolls with move-up tests | 0.88 |
| Fear Rolls | 0.2 |
| Critical Injury events (two table rolls each) | 0.22 |
| Falls | 0.16 |
| Gas Rolls | 1.35 |

**Live GM values per Focus Titan:** about 20, counting:

- cards;
- the holder;
- the Next Behavior, the previous behavior, and any Call It;
- five states and five counts;
- Openings, each with a creator;
- the clock;
- the Grab victim, countdown, and lifted;
- flags by soldier.

Add one per Background Titan and five for the Engagement line. Players hold Positions per Titan, turn debt, Stress, harm, and gear.

**Time estimate** for six soldiers:

- Six turns at 1.5 to 2 minutes, including Bonus Dice declarations and Help: 9 to 12 minutes.
- One Titan card at 1.5 to 2 minutes, end steps at 1 minute, and the Wings and swap talk at 1 to 2 minutes.
- Total: **13 to 18 minutes for a typical round**, inside the 12-to-20-minute band.
- A Grab round: 18 to 24 minutes. A two-Focus-Titan round: 22 to 30 minutes (finding 20).

The hidden roll with move-up and the ladder with tie-breaks are the only GM-side procedures with branching. Both are short on a printed card.

## Provisional decisions OQ-74 to OQ-90

- **OQ-74 (Anchor Ratings, steps):** Sound. The prose slip on mounted moves in Urban and the unlogged Open Blind Spot are findings 15 and 16.
- **OQ-75 (two Titans, placement, records):** Sound. The close rule is clean, and starting Distant avoids a Drive trigger.
- **OQ-76 (leaving, Down move, falls):** Sound on its own. Its "return for the next" reason conflicts with OQ-88's ending test (finding 8).
- **OQ-77 (cards, swaps, Wings, end steps):** Sound, but the order of move and action inside a turn is missing (finding 5).
- **OQ-78 (Size Class values):** Not yet supported. The Medium kill figure does not reproduce (finding 3), and Medium Severity was not varied (finding 18). Hold until the model is committed.
- **OQ-79 (lone Rookie at Stress 1):** The miss is real, 13.2% in my runs. Prefer amending the bound to "about 10%" over option (d)'s Stress 0 reading, which contradicts ADR-0014's build (finding 6).
- **OQ-80 (Behavior Table procedure):** Sound and free of judgement. Move-up skews the conditional kill share (finding 11).
- **OQ-81 (ladder, flags, Down, Break Attention):** The ties and Down-soldier rules are sound. The decoy "price" claim is false for the riderless horse (finding 2), and stacked Break Attention farms Openings (finding 13).
- **OQ-82 (Body Parts, Broken, Regeneration):** Sound. One part per clock matches the glossary, and clearing counts is a real deadline.
- **OQ-83 (own Openings):** Sound and well argued. OQ-90 needs the glossary line (finding 16).
- **OQ-84 (Read, Call It):** Unsound as drafted. The fact list is mostly public, and the tracker contradicts `read.yaml` (finding 7). Call It's 2 dice are reasonable but unsimulated.
- **OQ-85 (Grab):** Unsound as chosen. The logged known issue is a rules bug (finding 1), and the one-comrade reading misses the target's purpose (finding 4). Adopt option (d) or the uncounted-Reaction fix, then re-measure in the Squad model.
- **OQ-86 (witnesses):** Sound, and it matches the OQ-50 assumption. It is the main driver of Grab-round time.
- **OQ-87 (Background Titans, retreat, setup table):** Clocks and entry are sound, and the setup table is a proper stopgap. The forced-move list condemns Down and Grabbed comrades (finding 9).
- **OQ-88 (ending):** Sound in intent, but it fires too early while comrades who left could return (finding 8).
- **OQ-89 (Squad Tactics):** A good list of four distinct levers, all unsimulated. Declarers and timing are undefined (finding 10). Hook and Cut also neatly answers finding 19's card-order wait.
- **OQ-90 (changes to Chapters 1 to 4):** The rows and pointers are exact and complete for what the chapter now says. Add `CONTEXT.md` **Opening** (finding 16). Chapter 1 section 1.9's "how a turn is ordered" pointer needs finding 5's rule to point at. Every fix above that changes a Catalog requirement (Break Attention, Squad Tactics) needs matching rows.

## Appendix: models

All scripts share one dice model, seeded for repeatability:

- d6 pools; 6 is a success.
- Push when short, blocked by a Stress Die showing 1, adding 1 Stress and a new Stress Die. Base and Stress Dice not showing 6 are re-rolled; Gear Dice are never re-rolled.
- Gear 1s on a Pushed roll wear the item.
- Stress Response on any Stress Die 1: D6 + Stress − Resolve, with the lasting rows, Hair Trigger, and Locked Up turn debt.
- Fear Roll rows with their spent actions and turns.
- Critical Injury rows from Chapter 3's torso, arm, leg, and head tables, with the non-lethal cap and Health boxes.

Models:

- **Lone Nape strike** (60,000 per cell; Nape Depth 3 at 100,000):
  - Break Attention (Perception, ODM Gear, needs 1) up to three times, Pushing when short.
  - Then a Nape strike (Strength plus Talent, Blade Set) needing the Nape Depth, Pushing when short.
  - No own Openings, no Help, no grounding; a Jam blocks the strike.
- **Jam test** (60,000 per cell): the chapter's `jam_test` model, with one and two Titans, two cards a round each, and Help and Covering available half the time in help rows.
- **Grab** (30,000 per cell):
  - Victim: Rookie, Grip Breaker 1, Blade Set 1, Stress 2, crushed by the real torso rows.
  - Countdown in the victim's turns, with the card order of the Grab round kept.
  - A failed dodge spends the earliest wholly unspent turn.
  - Break Free needs 2, with 2 fewer dice after the lift.
  - Rescuers: Hamstringer 1, Resolve 3 minus Grief. They make witnesses' Fear Rolls, strike the Toughness 1 hand from In Reach before the lift, and spend a move to reach On Body after it.
  - Fix variants change needs, the lift penalty, and whether the first counted action is spent.
- **Rookie dodge** (100,000): Agility 3, ODM Gear 2, Stress 1 or 2, needing Severity 3, Pushing when short.
- **Horse decoy loop** (40,000 fights, 6 rounds):
  - One Medium Titan at Tempo 1 and one or two decoyers at Distant with Perception 3, horse 2, Stress 1.
  - Each decoyer takes Break Attention on their card if no decoy holds, Pushing or not.
  - Optional swap partners let a decoyer whose card follows the Titan's swap earlier.
- **Move-up chain** (exact): a Markov chain over the previous behavior, with move-up on repeats and part-dependent entries (Swat result 3 and Grab result 5 use arms), wrapping from 6 to 1, else Thrash.
- **Prepared Squad** (12,000 to 15,000 fights per row):
  - Four Rookie player characters, Wooded, the `tuning.yaml` reference Titan, and cards dealt at random with no swaps.
  - Roles as `prepared_squad_kill` states.
  - Dodge policy per row.
  - The full ladder with flags and tie-breaks, move-up, fallbacks to Thrash, and Regeneration 3 clearing counts and Openings.
  - Openings with creators, grounding (2 dice, no ODM Gear needed), and Help from up to two comrades within one step with an unspent action and not at Blind Spot.
  - Turn debt, Jams, falls from knock-loose, Gas Rolls, and Grabs with the Grab model's rescue.
  - Witnesses' Fear Rolls, and Critical Injuries on Health boxes.
  - The Squadmate rows add two Squadmates who never Push, either idle or running the horse decoy loop.
  - Bookkeeping counters record each table write, roll, and evaluation.
