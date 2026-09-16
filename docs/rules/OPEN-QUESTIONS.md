# Open questions

Design decisions the ADRs do not settle, and review findings that could not be fixed without changing an ADR. Each entry records where it arose, the question, the options, the provisional choice, and why.

Entry types:

- **PROVISIONAL**: a choice made while drafting, marked `PROVISIONAL:` in the chapter.
- **Unresolved Major**: a Major review finding left open after the chapter's final review round.
- **Simulator target**: an ADR-0014 target the Phase 1 rules could not meet.
- **ADR question**: a review finding that cannot be fixed without changing an ADR. The current text stays until the ADR is decided.

All 57 entries were decided on 2026-09-14 (`DECISIONS-2026-09-14.md`, which also carries the owner's Health boxes decision). Each entry keeps its number and history and ends with its **Status**, **Decision**, and **ADR** lines; entries the Health boxes decision overrides also carry a **Revised by owner decision** line. OQ-58 arose from the conformance review of that application and was decided the same day under *Conformance follow-up* in the decisions file; OQ-59 to OQ-73, from Chapter 4's reviews and the second conformance round, were decided under *Batch 2*; OQ-91 and OQ-92 record the batch 2b rulings; OQ-74 to OQ-90 and OQ-93 to OQ-99, from Chapter 5's reviews and the round 2 conformance review of Chapters 1 to 4, were decided under *Batch 3*; batch 3b revised OQ-50, OQ-79, OQ-81, OQ-89, and OQ-97 after the Chapters 1 to 5 conformance review and Chapter 6's round 1 review; batch 3c revised OQ-81 after round 2; batch 3d decided OQ-111; batch 3e revised OQ-81 and OQ-111 after round 3. OQ-100 to OQ-110, from Chapter 6's reviews, were decided under *Batch 4* after the Chapters 5 and 6 conformance review, which also revised OQ-81's last tie-break. Batch 4b, after the round 2 review, revised OQ-102 and OQ-103 and opened OQ-112, an Unresolved Major. Batch 5, after the owner's final full review of Chapters 1 to 6 and the simulator review round 2, decided OQ-113, opened and decided OQ-119 to OQ-127, kept OQ-112 open, and revised OQ-87, OQ-103, OQ-115, and OQ-116. After the round 2 full reviews, batch 5's 5-15 to 5-18 opened and decided OQ-129 to OQ-131 and revised OQ-87, OQ-119, and OQ-120. After the simulator rerun, 5-19 opened OQ-132 (the Medium deaths band, missed through the end of the Titan Engagement) and revised OQ-126 and OQ-128. Batch 6, after the playtest packet round 3 review, decided OQ-134. Batch 7, after the owner's playtest packet feedback round 1, decided OQ-132, opened and decided OQ-135, OQ-136, OQ-137, OQ-139, OQ-141, OQ-142, and OQ-143, opened OQ-138, OQ-140, and OQ-144 for after the first playtest, and revised OQ-19, OQ-20, OQ-28, OQ-31, OQ-33, OQ-41, OQ-42, OQ-47, OQ-50, OQ-67, OQ-112, OQ-116, OQ-120, OQ-121, and OQ-130. Batch 8, after the owner's decisions on Titan attack resolution (Option C), Burn, the falling Titan, and prosthetics, decided OQ-138 (reopened by the owner for the first playtest), opened and decided OQ-145, OQ-146, OQ-147, and OQ-148, opened OQ-149 for Phase 2, and revised OQ-14, OQ-80, OQ-96, OQ-135, OQ-137, OQ-139, OQ-140, OQ-141, OQ-142, and OQ-143. Batch 8's 8-15, after the owner overrode 8-8's "no Cut or Pierce rider" default, opened and decided OQ-150 and revised OQ-138. Batch 8's 8-16 to 8-19, the drafters' round 2 questions, opened and decided OQ-151 and revised OQ-137, OQ-139, OQ-145, and OQ-146. Batch 8's 8-20 to 8-30, the drafters' round 3 questions, decided OQ-152 to OQ-155 (WP-F's provisional readings) and OQ-156 to OQ-161 (WP-C2's), opened and decided OQ-162, and revised OQ-122, OQ-126, OQ-136, OQ-137, OQ-138, and OQ-146. Batch 8's 8-31 to 8-33, after the full rerun, decided OQ-132 anew (the Medium band at 0.08), opened and decided OQ-163 (the run-on loop) and OQ-164 (the Skirmish figures), and revised OQ-87, OQ-126, OQ-140, OQ-143, OQ-155, and OQ-157. Batch 8's 8-34 decided OQ-165 and revised OQ-163. Batch 8's 8-35 to 8-42, the round 1 final review's decisions, opened and decided OQ-166 and revised OQ-31, OQ-36, OQ-136, OQ-139, OQ-141, OQ-146, OQ-152, OQ-163, and OQ-165.

## Entries

### OQ-01: Which dice a Push re-rolls

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, sections 1.5 and 1.7; `data/core/dice-pool.yaml`
- **Revised:** after review round 1 (finding 2). The earlier choice was (a).
- **Question:** ADR-0004 re-rolls "base and Stress Dice that did not show a 6" and locks Gear Dice 1s. It does not say in so many words whether Gear Dice showing 2 to 5 are re-rolled, or whether Bonus Dice are base dice.
- **Options:** (a) Gear Dice showing 2 to 5 are re-rolled and Gear Dice 1s lock; Bonus Dice are base dice. (b) Gear Dice are never re-rolled, so the only Gear Dice 1s are those from the first roll, and each wears the gear if the roll is Pushed; Bonus Dice are base dice. (c) Bonus Dice are a separate kind of die that a Push does not re-roll.
- **Provisional choice:** (b).
- **Why:** ADR-0004 step 2 and the glossary's Push entry both list only base and Stress Dice as re-rolled. Option (a) re-rolled dice they leave out, which a chapter cannot do without amending ADR-0004 and the glossary. Under (b), "stay locked" still means something: the Gear Die stays in the pool showing 1 and counts as wear. The Gear Dice glossary phrase "when a Push turns up 1s" is read as "when a Pushed roll shows 1s". Review round 1 measured the difference, which Chapter 4 must tune against: per Pushed roll with 2 Gear Dice, (b) gives any wear 30% of the time and 0.33 wear on average, against 48% and 0.55 under (a); with 3 Gear Dice, 42% and 0.50 against 62% and 0.84. Both parent games roll help dice as ordinary dice, and treating Bonus Dice as base dice avoids a fourth die color. Going back to (a) needs ADR-0004 step 2 and the glossary Push entry amended first. Review round 2 noted an emergent effect: because a Stress Die 1 forbids the Push and wear comes only from Pushed rolls, wear per roll falls as Stress rises (about 0.067 per roll at Stress 0, 0.020 at Stress 3, 0.006 at Stress 6, with 5 base dice and Gear 1). Chapter 4 should tune Gear Dice ratings against a soldier at Stress 1, not Stress 0.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (b): a Push re-rolls base dice, Bonus Dice included, and Stress Dice not showing 6; Gear Dice are never re-rolled, and each showing 1 wears its item by 1 when a Pushed roll is final.
- **ADR:** none

### OQ-02: How many times a roll can be Pushed

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.5
- **Question:** ADR-0004 describes one Push but does not limit how many a roll allows.
- **Options:** (a) Once per roll, unless a Talent allows more. (b) Any number of times while no Stress Die shows 1. (c) Once, with no exceptions.
- **Provisional choice:** (a).
- **Why:** Both parent games allow one Push, with Talent exceptions. ADR-0006 lets rule-bending Talents change rules. Unlimited Pushes would tie ADR-0014's Levi-grade odds to how much Stress a player will accept rather than to the build.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): one Push per roll unless a Talent allows a second; a Stress Die 1 after any Push forbids further Pushes.
- **ADR:** none

### OQ-03: Which rolls include Stress Dice

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, sections 1.3 and 1.8; `data/core/dice-pool.yaml`; `data/core/bonus-dice-sources.yaml`
- **Revised:** after review round 1 (finding 4). The earlier choice was (a).
- **Question:** The glossary adds Stress Dice "to a roll" without saying which rolls. The final design review (codex-gpt6-astra, finding 4) asked for this to be defined. Review round 1 showed that including them on the Death Roll lets Stress keep a dying soldier alive.
- **Options:** (a) Every attribute roll (any roll whose rule names an attribute), including the Death Roll, unless the roll's rule says otherwise. (b) Only rolls that can be Pushed. (c) Only action rolls. (d) Every attribute roll except the Death Roll, which has no Stress Dice and cannot be Helped. (e) As (d), and also a soldier who is Down rolls no Stress Dice on any roll.
- **Provisional choice:** (d). Gas Rolls and table rolls never include Stress Dice. Another roll leaves them out only if its own rule names it.
- **Why:** ADR-0008 says veterans "always roll Stress Dice", and a single trigger ("the rule names an attribute") is data-shaped for ADR-0003 and Foundry. But under (a), a Strength 3 soldier survived a Death Roll 42% of the time at Stress 0, 66% at Stress 3, and 81% at Stress 6, and suffered a Stress Response on 42% of Death Rolls at Stress 3 (review round 1). Trauma became life insurance, and Chapter 3 would have to resolve Stress Responses for a soldier who can only crawl. Both parent games leave stress out of death rolls. Barring Help keeps survival tied to the Critical Injury, Strength, and the soldier's own build; Chapter 3 can still add a named Bonus Dice source for medical care. Option (e) decides what a Down soldier can roll, which belongs to Chapter 3.
- **Chapter 1 erratum (Chapter 2 review round 2, Opus Minor 10 and Codex Minor 5):** section 1.3 still says `dice-pool.yaml` lists "the Death Roll's exceptions". Chapter 2 added the `performance-roll` row, and the `roll_exceptions` header now lets a later chapter add rows, so the sentence should read "It also lists the rolls with exceptions, such as the Death Roll." Chapter 1 is closed, so its text is unchanged, and the YAML governs (ADR-0012). The same review noted that `bonus-dice-sources.yaml` `help.applies_to` now bars Help from any roll whose `roll_exceptions` row excludes it. That generalizes section 1.8's "The roll is not a Death Roll" and gives the same result for both current rows; section 1.8 should say so when Chapter 1 is next opened.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Every attribute roll includes Stress Dice unless its own rule excludes them with a `roll_exceptions` row (the Death Roll and the performance roll). Roll-specific Help or Push bans stay with the calling procedure; state and result bans use OQ-18's hook.
- **ADR:** none

### OQ-04: Maximum Stress

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.6; `data/core/stress-changes.yaml`
- **Question:** No ADR sets a maximum Stress.
- **Options:** (a) No maximum. (b) A fixed maximum, such as 10. (c) A maximum of Resolve + 3, as suggested in the final design review (fable, finding 5).
- **Provisional choice:** (a).
- **Why:** ADR-0008's amendment answered the death-spiral finding by raising Resolve with each Scar, not by adopting the cap option. No maximum also avoids edge cases such as Pushing or Covering at the cap. Review round 1 simulated a three-Engagement Expedition with a Push on every roll and found median end Stress 2 for a Rookie and 3 for a two-Scar Veteran (worst seen 6 and 8), because Stress Die 1s block further Pushes. The simulator should re-run this once Chapter 3's named Stress gains exist.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): no maximum Stress.
- **ADR:** none

### OQ-05: Order of resolution when a roll finishes

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.5 (*Finishing a roll*)
- **Question:** ADR-0004 fixes the Push order but not when the Stress Response and gear wear resolve relative to the action's effect.
- **Options:** (a) Count successes, then the Stress Response, then the effect, then wear. (b) Count successes, then the effect, then the Stress Response, then wear. (c) Apply wear before the effect.
- **Provisional choice:** (a).
- **Why:** A Chapter 3 Stress Response result may need to change the action, which only works before the effect is applied. After review round 2 (finding 9), the chapter states that a result may change the roll's success count, and that the changed count is used for every later use of the roll, including a dodge's comparisons with later behaviors (OQ-14). The Chapter 3 drafter can write results that alter a success count. Applying wear last lets a Pushed strike or dodge land before ODM Gear Jams, so losing gear is a consequence rather than a failure after the fact.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), with one hook in step 2 of *Finishing a roll*: a roll's own rule may name another resolution for its Stress Response, as the Graduation Exam's Merit cost does.
- **ADR:** none

### OQ-06: Covering procedure

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.5 (*Covering*); `data/core/stress-changes.yaml`
- **Revised:** after review round 1 (findings 3, 8, and 11): the eligibility test outside Titan Engagements and the Squadmate test changed, and a simulator case was added. The mechanics are unchanged. After review round 2 (finding 6): if more than one comrade offers, the Pushing soldier chooses one, and outside a Titan Engagement Covering spends nothing, needing only Help's eligibility under the calling rule, not Help's price.
- **Question:** The glossary defines Covering only as "taking on a comrade's Stress from their Push". It gives no timing, price in Stress, or requirement, and does not say what happens to the Push's new Stress Die (raised in the final design review, codex-gpt6-astra, finding 2).
- **Options:** (a) Not an action; declared after the Push and before the re-roll; uses Help's eligibility; the Covering soldier gains the 1 Stress and the Pushing soldier adds no new Stress Die. (b) As (a), but the Pushing soldier still adds the new Stress Die. (c) The Covering soldier gains 2 Stress, like the Coriolis surcharge for taking on another's push. (d) Covering spends an action. (e) As (a), limited to once per soldier per round.
- **Provisional choice:** (a), with one Covering soldier per Push, who cannot be Down, and no limit per round. In a Titan Engagement the Covering soldier meets Help's Position requirement. Outside one, they must qualify to Help that roll under the rule that called for it (OQ-08). Squadmates can Cover only where Chapter 2 allows it (OQ-13).
- **Why:** A Stress Die reflects the roller's own Stress, so a Push whose Stress went to someone else adds none. That makes Covering a real trade: less risk, but fewer dice. Reusing Help's eligibility meets ADR-0003 without a new measurement. Spending an action would make Covering a weaker Help and undercut ADR-0010's soft teamwork levers. There is no surcharge because the glossary describes taking on the Stress, not more.
- **Simulator case:** "Covering sponge". One soldier who rarely rolls Covers every Push in the Squad for a full Expedition. Acceptable outcome: that soldier's Stress costs them at least as much, through Fear Rolls and their own rolls' Stress Responses, as the Squad saved. If it does not, adopt (e). Review round 1 (finding 11) and the codex-gpt6-astra final review both raised this. The case must include the Stress 0 roller: a Covered Push by a soldier at Stress 0 rolls no Stress Dice, so it can never cause a Stress Response (review round 2: need 1, 87% success and 0% Response, against 89% and 6% uncovered). Run it before Chapter 2 decides whether Squadmates can Cover.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): one Coverer per Push, chosen by the Pushing soldier, no per-round limit; the sponge case stands, with (e) as the fallback if its test fails.
- **ADR:** none

### OQ-07: Dice penalties

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.3 (step 5); `data/core/dice-pool.yaml`
- **Question:** The ADRs define what adds dice to a pool but not how an effect that removes dice works. Chapter 3 results are likely to need this.
- **Options:** (a) Penalties remove base dice only, never below 1 base die, never Gear Dice or Stress Dice, and apply after the Bonus Dice cap. (b) Penalties can remove any die, with a pool minimum of 1. (c) There are no penalties; effects forbid actions or add Stress instead.
- **Provisional choice:** (a).
- **Why:** Both parent games apply penalties only to base dice, with a 1-die floor. Leaving Stress Dice alone keeps them equal to Stress, which ADR-0008's reasoning depends on. Applying penalties after the cap stops extra Bonus Dice sources from cancelling penalties beyond the 4-die limit.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): penalties remove base dice only, never below 1 base die.
- **ADR:** none

### OQ-08: Help timing, and Help outside Titan Engagements

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.8; `data/core/bonus-dice-sources.yaml`
- **Revised:** after review round 1 (finding 3). The earlier choice was (a) and (d).
- **Question:** Help spends "an action", but the roll being Helped can come before the helper's turn, for example during a Reaction. Positions also exist only in Titan Engagements, so the glossary's Position requirement has no meaning outside them.
- **Options:** Timing: (a) Help can be given out of turn while the action is unspent, and the helper's later turn keeps only its move. (b) Help only on the helper's own turn, applying to a later roll that round. (c) Help out of turn spends the helper's whole turn. Outside Titan Engagements: (d) any player character "taking part in the same scene" can Help. (e) No Help outside Titan Engagements. (f) The rule that calls for the roll states whether it can be Helped, who qualifies, and what Help spends; if that rule says nothing, the roll cannot be Helped or Covered. (g) A fixed presence test in this chapter, such as being at the same Waypoint.
- **Provisional choice:** (a) and (f).
- **Why:** (a) keeps the glossary's price of exactly one action and lets Help reach Reactions, which matters for ADR-0015's rescue window. (b) needs tracking tokens, and (c) takes more than the glossary states. Review round 1 found that (d) rested on "scene" and "taking part", which nothing defines, so the table decided who could Help: the GM discretion ADR-0003 forbids. (e) would remove Help from Plan Rolls, Requisition, and Legs. (g) would need presence terms for Expeditions, Chases, and Downtime, whose rules are not yet written. (f) is closed, follows the same pattern as retries in section 1.1, and applies ADR-0003 item 7 (Help states its requirement) wherever Positions do not exist. It places a drafting duty on later chapters: every rule that calls for a roll outside a Titan Engagement, including Action Catalog entries, states its Help requirement. **Glossary note:** if (f) is confirmed, the Help entry in `CONTEXT.md` should say that Help spends an action in a Titan Engagement and, outside one, what the calling rule states, instead of "by spending an action" alone. OQ-16 records that a soldier may leave their action unspent on their turn and still Help later in the round.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a) and (f): Help is given while the helper's action is unspent this round; outside a Titan Engagement the rule that calls for the roll states whether and how it can be Helped, or it cannot.
- **ADR:** none

### OQ-09: When a Reaction can be made

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.9
- **Revised:** after review round 1 (finding 1). The earlier choice was (a). After review round 2 (finding 2): "a soldier can always make a Reaction" became "unless one of these is true", with a closed list: a Reaction already made against that Titan this round (OQ-14), or a rule that forbids it by naming a state or result. What happens to turns spent in advance when the Titan Engagement ends is OQ-15.
- **Question:** The glossary says a Reaction "spends the soldier's own turn for the round" but not whether a soldier who has already acted this round can still make one.
- **Options:** (a) Only if neither the move nor the action has been spent this round, and the Reaction spends both. (b) Always allowed. It spends the soldier's earliest turn, starting with this round's, whose move and action are both unspent; any part of this round's turn that is left stays usable; a turn spent in advance still counts as a turn for rules that count turns, but has no move and no action. (c) Always allowed, spending only an action (this round's or the next), never the move. (d) As (a), plus a Hold rule: a soldier can hold their whole turn and take it last if no Titan card targets them. (e) Allowed after acting, at a penalty.
- **Provisional choice:** (b), except where a rule forbids a Reaction. Chapter 3 states whether a Down soldier can make a Reaction, and Chapter 5 whether a Grabbed soldier can.
- **Why:** Under ADR-0015 a behavior lands unless dodged, so under (a) a soldier with no Reaction takes the behavior with no roll at all. Review round 1 found that at least one Titan card resolves after a given player character's card 50% of the time at Tempo 1, 67% at Tempo 2, and 75% at Tempo 3. ADR-0010 makes the striker who falls short the likeliest target, and that soldier has always just spent their action. ADR-0015 was amended because Reactions starved the soldier holding Attention of turns; (a) starved them of Reactions instead, and made ADR-0014's Grab target depend on card order. (b) always costs exactly one whole turn, which is what the glossary prices a Reaction at. It only moves the spending to the next turn when this round's is already partly used. A soldier who holds Attention every round can still dodge every round, at the price of every turn, which is the pressure ADR-0010 intends comrades to relieve with Break Attention. (c) contradicts the glossary's "own turn". (d) adds a queue and still leaves a striker who fell short with no roll against the Titan's next card. Counting a spent turn as a turn keeps ADR-0015's Grab countdown intact. Review round 2 found that "always" left no room for incapacity: the glossary's Down soldier "can do little more than crawl" and a Grabbed soldier is held in a Titan's hand, yet both could make a full-pool dodge, and Chapter 3 could not add a result that removes a Reaction. The exceptions list mirrors *When a soldier cannot Push* and leaves Down to Chapter 3 and Grabbed to Chapter 5, the chapters that own those states, rather than deciding them here. A soldier forbidden to react takes the behavior, which is ADR-0015's "lands unless dodged". **Simulator case:** the ADR-0014 Grab case must model the trade (b) makes: a striker who falls short, dodges the Grab, and fails has already spent next round's turn, so is lifted after a turn with no move or action and gets exactly one turn to get free before being devoured. **Glossary note:** if (b) is confirmed, the Reaction entry in `CONTEXT.md` should read "spends one of the soldier's turns, this round's if unspent, otherwise the next" instead of "spends the soldier's own turn for the round". The chapter does not change the glossary.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (b): a Reaction is allowed unless a state or result forbids it or one was already made against that Titan this round, and it spends the soldier's earliest turn whose move and action are both unspent.
- **ADR:** none

### OQ-10: Who loses Stress on a Nape kill and at the end of a Titan Engagement

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.6; `data/core/stress-changes.yaml`
- **Revised:** after review round 1 (finding 3): "taking part" was replaced by a Position test. After review round 2 (finding 3): the end-of-Engagement test changed from "holds a Position when it ends" to "held a Position at any point during it", so a retreat no longer forfeits relief. The Nape kill choice is unchanged.
- **Question:** ADR-0008 says Stress "drops by 1 when a Titan Engagement ends and by 1 on a Nape kill" without saying whose Stress. Review round 2 added: does a Squad that retreats, and so ends the Titan Engagement by leaving it, get the end-of-Engagement relief?
- **Options:** Nape kill: (a) Every soldier who holds a Position in the Titan Engagement when the kill happens. (b) Only the soldier who made the kill. (c) The soldier who made the kill, plus everyone who Helped or spent Openings on the strike. End of Engagement: (d) Every soldier who holds a Position when it ends, so a retreat gives nothing. (e) Every soldier who held a Position at any point during its final round. (f) Every soldier who held a Position at any point during the Titan Engagement. (g) As (d), with Chapter 5 defining a retreat as ending the Titan Engagement before anyone leaves.
- **Provisional choice:** (a) for the Nape kill and (f) for the end of the Titan Engagement. Whether Squadmates count is OQ-13.
- **Why:** ADR-0010 makes a kill the result of teamwork, so the kill relief goes to the whole Squad. Option (b) rewards only the striker and pushes players toward piling onto the Nape, and (c) needs extra tracking. Holding a Position is a state Chapter 5 already tracks, so the tests are closed; a soldier who has left holds no Position and gets nothing from a kill. For the end of the Engagement, ADR-0008 ties relief to the Engagement ending, with no exception for how it ends, and ADR-0009 names retreat as a normal way to end one. Review round 2 showed that (d) gave nothing to the Squad that most needs relief: over a three-Engagement Expedition a Rookie who wins every Engagement ends at median Stress 0, one who gets no relief at median 2 (90th percentile 4), and a two-Scar Veteran at median 3 (90th percentile 5). (e) still fails a staggered retreat, since a soldier at Blind Spot needs several rounds to leave and those who left first get nothing. (g) makes Chapter 5's retreat procedure carry a Stress rule. (f) needs only a record of who entered the Engagement. The field has no other relief yet: section 1.6 now says a later chapter adds a row to `stress-changes.yaml` for a new trigger, so the Expedition rules can add the Waypoint camp relief the settled design summary lists ("-1 Stress per Waypoint camp") without contradicting Chapter 1.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a) and (f): every soldier holding a Position at the kill; every soldier who held one at any point when the Titan Engagement ends.
- **ADR:** none

### OQ-11: Talents on rolls that are not actions

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, sections 1.3 (step 1) and 1.9; `data/core/dice-pool.yaml`
- **Question:** ADR-0006 says every Talent names the actions it applies to from the Action Catalog, and section 1.9 says Reactions and Death Rolls are not actions. Read together, no Talent could ever add dice to a dodge or a Death Roll (review round 1, finding 5).
- **Options:** (a) The Action Catalog has entries for dodge, block, and the Death Roll, each marked as not an action, and a Talent can name them. (b) As (a), but without a Death Roll entry, so no Talent adds dice to a Death Roll. (c) No Talent adds dice to a Reaction or a Death Roll; rule-bending Talents can still trigger on them. (d) Dodge is an ordinary Catalog action that is taken as a Reaction.
- **Provisional choice:** (a).
- **Why:** Both parent games have dodge Talents (Coriolis *Evasive*, Alien *Nimble*) and a death-roll Talent (Alien *Survivor*), and a Flier Specialty with no way to dodge better would be hard to justify. Listing the entries keeps one test for ADR-0006: a Talent adds dice only to a Catalog entry it names. (c) removes up to 3 dice from the roll that decides every Titan hit, with no settled reason. (d) blurs the line between actions and Reactions that Help and turn spending depend on. Unlike Stress Dice (OQ-03), Talent dice on a Death Roll are a build choice paid for with XP, and ADR-0014's lethality targets are tuned against the reference builds, which include Talents. (b) is the fallback if simulation shows Death Roll Talents move PC lethality off target.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): `dodge`, `block`, and `death-roll` are Catalog entries marked as not actions.
- **ADR:** none

### OQ-12: Whether a Pushed dodge burns extra gas

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.5 (*Pushing and gas*)
- **Revised:** after review round 2 (finding 4): the chapter now states that the Gas Roll is three dice however many of that round's rolls were Pushed ODM actions. The choice is unchanged.
- **Question:** The glossary makes the Gas Roll three dice "after a Pushed ODM action". Section 1.9 says a Reaction is not an action, yet a dodge takes its Gear Dice from ODM Gear. Read literally, Pushing a dodge burns no extra gas (review round 1, finding 10).
- **Options:** (a) Any Pushed roll whose gear item is ODM Gear counts as a Pushed ODM action, including a dodge. (b) Only Pushed action rolls count; a Pushed dodge does not. (c) Leave it for Chapter 4 to define "ODM action".
- **Provisional choice:** (a).
- **Why:** A Pushed dodge is a soldier venting gas to get clear, and ADR-0014's gas target ("about 6 when pushing every round") assumes every Pushed ODM use drains more. The gear item on the roll is a single data-shaped test. Leaving it to Chapter 4 would leave this chapter's gas sentence without a definition. If confirmed, the glossary Gas Roll entry could read "three after a Pushed roll that used ODM Gear". Under OQ-09 a soldier can Push an ODM action on their card and Push a dodge on the Titan's card in the same round. Three dice is a flag, not a count: the glossary gives the Gas Roll only two sizes, and ADR-0014's gas target ("about 6 when pushing every round") is stated per round. The gas simulator case should include rounds with two Pushed ODM rolls to confirm the target still holds.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): any Pushed roll whose gear item is ODM Gear makes the Gas Roll three dice; a Pushed dodge made with the horse wears the horse and leaves the Gas Roll at two.
- **ADR:** none

### OQ-13: Squadmates and the core rules

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, sections 1.5, 1.6, 1.8, and 1.10; `data/core/bonus-dice-sources.yaml`; `data/core/stress-changes.yaml`
- **Question:** The YAML rows limited Help, Covering, and field Stress relief to player characters, while the chapter said Chapter 2 would decide whether Squadmates use them (review round 1, finding 8). Which is it?
- **Options:** (a) Keep the rows limited to player characters, and let Chapter 2 add Squadmate rows. (b) Squadmates lose Stress through the field relief triggers like player characters. Whether a Squadmate can Help or Cover is set by Chapter 2, through the Squadmate action list and rules, and the rows refer to that. (c) Squadmates Help and lose field Stress like player characters, but never Cover. (d) Squadmates use every rule in this chapter like player characters.
- **Provisional choice:** (b).
- **Why:** The YAML is the source of truth (ADR-0012), so it cannot pre-decide what the prose defers. The settled design (final design review brief) has Squadmates make Fear Rolls and never Push. Fear Rolls use Stress, so Squadmates carry Stress, and without field relief it would only ever rise. Whether Help is on the Squadmates' short action list, and whether a Squadmate may absorb Pushes by Covering (a concern the codex-gpt6-astra final review raised), are Squadmate design questions for Chapter 2. Referring to Chapter 2's list keeps the rows closed without deciding them here. (a) pushes Squadmates toward a Stress spiral, and (d) decides Chapter 2's questions early.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (b), as Chapter 2 settled it: Squadmates roll Stress Dice, get field relief, Help and are Helped, never Push, never Cover.
- **ADR:** none

### OQ-14: One dodge against behaviors of different Severity

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, sections 1.4 (item 4) and 1.9
- **Revised:** after review round 2 (findings 9 and 10): "final successes" now reads "successes counted after step 2 of *Finishing a roll*", so a Stress Response result that changes the success count also applies to later comparisons (OQ-05). The choice is unchanged.
- **Question:** ADR-0015 says one Reaction covers every card from a Titan in the round, and that a behavior lands unless the Reaction meets its Severity. Behaviors on one table have different Severities, and the dodge is rolled before later cards are known. Is the same success count compared with each later card, does the first outcome carry over, and can a soldier wait for a later card (review round 1, finding 6)?
- **Options:** (a) Compare the dodge's final successes with each behavior's Severity as it resolves; the dodge avoids every behavior whose Severity it meets. A soldier can decline to dodge an early card and dodge a later one instead, but makes at most one Reaction against each Titan per round. (b) The first Reaction's outcome, dodged or not, applies to every later card from that Titan that round. (c) This chapter says only that there is one Reaction per Titan per round, and Chapter 5 decides which cards it covers.
- **Provisional choice:** (a).
- **Why:** (a) is the reading that honors both of ADR-0015's sentences at once. Under (b), a dodge that meets Severity 1 would also avoid a Severity 3 Grab, which moves ADR-0014's Grab target by card order. (c) would leave a GM with only this chapter unable to run a second card. Letting a soldier decline lets them decide when the Titan's card resolves, with that behavior's Severity in front of them, and gives no free information, because the Next Behavior stays hidden unless Read. Reusing successes across behaviors is stated as the one exception to "each success is used once".
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): one Reaction per Titan per round, compared with each later behavior's Severity.
- **ADR:** none
- **Revised by batch 8 (8-1):** "compared with" reads "cancelling against": the Titan rolls its entry's Attack Dice and the one dodge's successes cancel each later card's successes separately, never used up; no dodge is rolled against a card that whiffed, so the soldier keeps their Reaction for a later card (OQ-145; ADR-0019).

### OQ-15: Turns spent in advance when a Titan Engagement ends

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.9 (*Reactions*); review round 2, finding 1
- **Question:** Under OQ-09 (b), a Reaction by a soldier who has already acted spends a later turn. Turns exist only inside a Titan Engagement. If the Engagement ends before that turn comes up, which happens in the last round of every Engagement and whenever a Nape kill ends one mid-round, what happens to the debt?
- **Options:** (a) Turns spent in advance that have not come up are cancelled when the Titan Engagement ends. (b) They carry into the soldier's next Titan Engagement, which starts with that many turns already spent. (c) Each owed turn becomes 1 Stress when the Engagement ends, through a new row in `stress-changes.yaml`.
- **Provisional choice:** (a).
- **Why:** A turn is a unit of a round, and rounds belong to one Titan Engagement (section 1.9), so (a) keeps turns from existing outside the structure that defines them. (b) makes a dodge docked from a fight an hour or a Leg later, which needs tracking across Expeditions and punishes a soldier in a situation that has nothing to do with the dodge. (c) invents a Stress trigger that no ADR names, and Stress changes are ADR-0008's territory. The cost of (a) is an asymmetry in the final round: review round 2 found that a given Titan card resolves after a given player character's card 50% of the time, so a soldier who acts first and then dodges in the round the Engagement ends pays nothing, while one whose card comes after the Titan's pays with this round's turn. That is the flip side of "act first, dodge later", it only arises in one round per Engagement, and it never decides whether a dodge exists, which was the card-luck OQ-09 (b) removed. **Simulator case:** the ADR-0014 Grab and "prepared Squad" cases should model cancellation on the kill card.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): turns spent in advance are cancelled when the Titan Engagement ends.
- **ADR:** none

### OQ-16: Declining to use a move or action on one's turn

- **Type:** PROVISIONAL
- **Arose in:** Chapter 1, Core Rules, section 1.9 (*Turns and actions*); review round 2, finding 5
- **Question:** OQ-08 (a) lets an unspent action Help later in the round, and OQ-09 (b) makes a dodge spend this round's turn when it is wholly unspent. Both rely on a soldier being allowed to do nothing on their card and keep the move and action for later. The chapter neither allowed nor forbade this, and "cannot be saved for a later round" suggested an unused turn is lost when the card passes.
- **Options:** (a) A soldier may decline to use their move, action, or both on their turn; what is left stays available until the round ends, only for Help and Reactions, then is lost. (b) A move or action not used on the soldier's own turn is spent when the turn ends. (c) As (a), but a declined move can also be taken later in the round.
- **Provisional choice:** (a).
- **Why:** (a) is the reading OQ-08 (a) and OQ-09 (b) already depend on, and it makes the trade between acting now and holding back to dodge a stated choice rather than an accident of wording. Review round 2 noted it matches canon (letting an early swat pass to save the dodge for the lunge). (b) would turn a Reaction by any soldier whose card has passed into a charge on next round's turn and would remove out-of-turn Help after the helper's card, which changes ADR-0015's rescue window. (c) adds out-of-turn movement, a Chapter 5 question about the order of play that this chapter should not open. Limiting the held move and action to Help and Reactions keeps the order of play Chapter 5's to set.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), with the review 3 wording: a Reaction needs both the move and the action, and a move held alone does nothing once the soldier's card has passed.
- **ADR:** none

### OQ-17: Whether a soldier whose turn was spent in advance can Help

- **Type:** Unresolved Major
- **Arose in:** Chapter 1 review 3, finding 1. Section 1.8, *Requirements* ("They have not spent their action this round") and *What it spends* ("the helper spends their action"); section 1.9, *Reactions*, PROVISIONAL (OQ-09), last bullet ("it has no move and no action"); `data/core/bonus-dice-sources.yaml`, `help.condition_in_titan_engagement`.
- **Related:** OQ-08 (a), OQ-09 (b), OQ-16.
- **Question:** Under OQ-09 (b), a soldier who dodges after spending part of this round's turn spends their next turn in advance. When that round comes, their turn still happens but has no move and no action. Section 1.8 lets a comrade Help if they "have not spent their action this round", and in that round the soldier has spent nothing, because the spending happened the round before. Can they Help? The Help test says yes; OQ-09 and *What it spends* say no; and the YAML, the source of truth under ADR-0012, carries only the Help test, so a Foundry flag for "action spent this round" allows it. Review round 3 found the state common: a soldier targeted on every Titan card enters the next round with their turn already spent after 77% of rounds at Tempo 1, 60% at Tempo 2, and 48% at Tempo 3. That soldier is usually the striker who fell short and holds Attention at Blind Spot, one Position step from the comrade making the next Nape strike.
- **Options:**
  - (a) Review fix 1. Change the test in section 1.8 and in `help.condition_in_titan_engagement` to "They have an unspent action this round", and add to the OQ-09 bullet that a turn spent in advance has no action to Help with.
  - (b) Review fix 2. A soldier whose turn was spent in advance may still Help, because Help is given outside the soldier's own turn and their action was never used. The OQ-09 bullet then says the spent turn has no move and no action of its own but the soldier may still Help, and the ADR-0014 Grab simulator case counts that Help, since it makes a dodge cost less than one whole turn.
  - (c) The outcome of (a), fixed at the source. Section 1.9, *Turns and actions*, states that a turn spent in advance begins its round with its move and action already spent, and every test that asks whether a move or action is spent reads that state, not what the soldier did during the round. Help, the held move and action under OQ-16, and the Reaction's "earliest turn whose move and action are both unspent" then give one answer, and the YAML condition becomes a flag set at the start of each round, which Foundry can check directly.
- **Provisional choice:** the current chapter text, unchanged. Section 1.8 and `help.condition_in_titan_engagement` read "has not spent their action this round", and the OQ-09 bullet reads "has no move and no action". As written, the two give different answers for this soldier.
- **Why deferred:** Chapter 1 has had its third and last review round (`docs/rules/PROGRESS.md` allows three), and the round-3 review must stay an accurate review of the current text, so the fix was not applied. No ADR blocks any option. (a) and (c) keep OQ-09 (b)'s reasoning that a Reaction always costs exactly one whole turn, and keep the glossary's price for Help of one action. (b) makes a dodge in turn debt cheaper than the glossary's "own turn for the round". (c) is preferred because it closes the same "spent this round" reading for any later rule that tests a spent move or action, not only Help. Resolve it in the chapter and `bonus-dice-sources.yaml` before Chapter 5 drafts the order of play and before the simulator's Grab case is built, because the answer changes how often the soldier holding Attention can Help.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** (c): a turn spent in advance by a Reaction or by a result begins its round with its move and action already spent, and every rule reads that state, so such a soldier cannot Help that round.
- **ADR:** none

### OQ-18: A rule that forbids Help or Covering

- **Type:** Unresolved Major
- **Arose in:** Chapter 1 review 3, finding 2. Section 1.8, *Requirements* ("A comrade can Help only if all of these are true", and the list that follows); section 1.5, *Covering*, PROVISIONAL (OQ-06), "Who can Cover"; `data/core/bonus-dice-sources.yaml`, `help.condition`; `data/core/stress-changes.yaml`, `cover.condition`. Compare section 1.5, *When a soldier cannot Push* ("The roll's rule forbids a Push"), and section 1.9, PROVISIONAL (OQ-09) ("A rule forbids it").
- **Related:** OQ-06, OQ-08, OQ-09.
- **Question:** Pushing and Reactions each have a closed list of exceptions that includes a hook: a rule may forbid them by naming a state or result. Help and Covering have closed lists ("only if all of these are true") with no such hook, and the only state they exclude is Down. A Grabbed soldier, held in a Titan's hand and On Body, one Position step from Blind Spot, therefore meets every line and can Help the Nape strike meant to free them, or Cover that strike's Push. Chapter 5 cannot forbid it, and Chapter 3 cannot write a Stress Response result that stops a soldier Helping, without contradicting a list this chapter calls complete and YAML conditions Chapter 1 owns. Where does a later chapter forbid Help or Covering, and is the Grabbed case decided here?
- **Options:**
  - (a) Review fix 1. Add one requirement to Help and one to Covering, mirroring Pushing and Reactions: no rule forbids it, and such a rule names the state or result that forbids Helping or Covering, as Chapter 3 may for a Stress Response result and Chapter 5 for a Grabbed soldier. Add the same sentence to `help.condition` and `cover.condition`, and record it under OQ-06 and OQ-08.
  - (b) Review fix 2. Decide the obvious case in Chapter 1: a Grabbed soldier cannot Help or Cover, and every other exception is named by the rule that creates it. Record it under OQ-06 and OQ-08, and Chapter 5 inherits it.
  - (c) One shared hook instead of four. Chapter 1 states once that a state or result may forbid any of Pushing, Helping, Covering, and Reactions, and names which it forbids. Each of the four eligibility lists refers to that sentence, and in the YAML the state or result carries the list of what it forbids, so Chapter 3 and Chapter 5 add a field to their own rows instead of editing Chapter 1's conditions.
  - (d) (a) or (c), and also decide the Grabbed case now as in (b).
- **Provisional choice:** the current chapter text, unchanged. The Help and Covering lists have no hook, and `help.condition` and `cover.condition` match them. As written, a Grabbed soldier who meets the Position requirement can Help (with an unspent action) and can Cover, and no later chapter can forbid either without amending Chapter 1.
- **Why deferred:** Chapter 1 has had its third and last review round, and the round-3 review must stay an accurate review of the current text, so the fix was not applied. No ADR blocks any option. ADR-0003 item 8 is what makes the gap matter: a GM who refuses the Grabbed soldier's Help has no rule to point to. (b) and (d) are the least consistent with OQ-09, which left whether a Grabbed soldier can make a Reaction to Chapter 5; deciding Help and Covering in Chapter 1 but not the Reaction would split one question across two chapters. (c) is preferred: Pushing, Help, Covering, and Reactions get one test, and under ADR-0012 the forbidding entry lives in the row for the state that creates it. The odds are not small: one Bonus Die moves a Rookie's Severity 3 dodge from 28% to 37% (review round 3), and Help on the Nape strike that frees a Grabbed soldier feeds ADR-0014's Grab target. Resolve it in Chapter 1 and its YAML before Chapter 3 drafts the Stress Response table or Chapter 5 drafts the Grab.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** (d): Chapter 1 states one shared hook, read by the Push, Help, Cover, and Reaction tests, by which a state or result forbids them on its own row. Down forbids all four; Grabbed forbids Help, Cover, and Reactions but not Pushing; the Exam's Cover limit and the three Fear rows that ban Reactions use the same hook.
- **ADR:** ADR-0003 (drafting requirement 13)

### OQ-19: Attribute points at creation

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, Character Creation, section 2.2; `data/character/attributes.yaml` (`creation`); the `attributes` and `attribute` fields of `origins.yaml`, `enlistment.yaml`, and `training-years.yaml`.
- **Revised:** after Chapter 2 review round 1 (Opus findings 3 and 4, Codex finding 2). The Graduation floor became a swap followed by a floor, and the Why You Enlisted attribute point is always rolled (OQ-23). Under the earlier floor, a player who picked the Specialty whose key attribute was lowest gained 2 free points (20 points for 92% of soldiers), and choosing the Why You Enlisted row raised the share of key attribute 5 or 6 from 37% to 53%. The quoted distribution described neither strategy. After Chapter 2 review round 2 (Codex finding 1, Opus Minor 10): the swap now happens whenever another attribute is rated higher than the key attribute, not only when the key attribute is below 4. Under (e), a player who chose a Specialty keyed to an attribute already at 4 kept a 5 elsewhere, and always choosing that way moved key attribute 5 or 6 from 36.5% to 22.3% (Codex review 2, 500k Cadets). The quoted figures held for only one strategy.
- **Question:** ADR-0006 rates attributes 2 to 5, with only the Specialty's key attribute able to reach 6. ADR-0011 says attributes never rise after the Lifepath. Nothing sets how many points the Lifepath gives, who places them, or how often a new soldier reaches 5 or 6. ADR-0014's default Squad is "all Rookies" (key attribute 4). The final design reviews listed attribute points and limits at creation as an open decision.
- **Options:**
  - (a) A point buy, such as 24 points at 2 to 5.
  - (b) Lifepath points where the player picks one of two attributes per event, +1 to the key attribute at Graduation, and 3 free points. In simulation, a player who concentrates points reaches key attribute 6 about 68% of the time.
  - (c) Fixed placement from rolled rows, +1 to the key attribute at Graduation, cap 5 before it. Simulated: key 5 about 66%, 6 about 32%.
  - (d) Fixed placement from rolled rows (6 points on a base of 2), no free points, a key attribute floor of 4, and +1 to the key attribute only for a Top 10 Class Rank.
  - (e) As (d), but a key attribute below 4 first swaps its rating with the highest other attribute, and rises to 4 only if still below, lowering another attribute by the points added. The total never changes. (Opus review 1, fix 1.)
  - (f) As (d), paying for the floor by lowering the highest non-key attribute. (Opus fix 2.)
  - (g) The key attribute must be one of the soldier's two highest, with no floor. (Opus fix 3.)
  - (h) As (e), but the swap happens whenever another attribute is rated higher than the key attribute, so the key attribute always ends with the soldier's highest rating. (Codex review 2, fix 1.)
  - (i) Keep (e), simulate declared player strategies, and describe the resulting specialist and generalist profiles. (Codex review 2, fix 2.)
- **Provisional choice:** (h), with every Lifepath attribute point from a rolled row.
- **Why:**
  - Simulated after review round 2 (200k Cadets, current tables, rolled rows, overflow to the highest other attribute below 5): key attribute 4 in 63.5%, 5 in 34.3%, 6 in 2.1%; non-key mean 2.74; 18 points for 93.7% and 19 (Top 10) for 6.3%. The same figures came out, to within 0.3 points, when the player took the highest attribute's Specialty, a Specialty at random, or a Specialty keyed to an attribute rated 4. Under (h) no Specialty choice changes the key attribute's rating.
  - That keeps ADR-0014's Rookie as the typical new soldier. It still lets 5 and 6 be reached, which ADR-0011 requires, and makes a 6 the canon prodigy who graduated near the top of the class.
  - (a) and (b) let players reach the maximum by design. (c) makes Rookies the exception. (d) paid 2 points for choosing the Specialty that fits the rolls worst.
  - (e) made no Specialty choice worth points, but its distribution depended on strategy. (i) would turn ADR-0014's single creation distribution into a set of player profiles. (h) gives one closed, measurable distribution. Its cost is the generalist Codex review 2 described: a soldier can no longer keep a 5 outside the key attribute. Opus review 2 judged (e) sound and asked only for a qualifier to this entry. The reviews conflicted, and (h) was chosen because ADR-0014 tunes against one creation distribution rather than a strategy.
  - (f) still pays when the highest non-key attribute is well above 2. (g) forbids a Specialty the player wants for the story; under (h) that choice moves the soldier's best rating into the chosen key attribute instead. The floor after the swap fires only when every attribute is 3.
  - The Lifepath shapes the soldier's spread, and the Specialty decides which attribute holds the highest rating.
- **Simulator note:** when the key attribute is not Agility, Agility is 2 for 39% of soldiers, 3 for 49%, and 4 for 12%. Chapter 1 review 3 modeled the Rookie dodge at Agility 4, which only Fliers and Riders typically have. Chapters 5 and 6 should tune Severity against a soldier dodging with Agility 2 or 3. Because the swap moves ratings, Health and Resolve depend on the Specialty chosen. With the Specialty of the highest rolled attribute: Health 2 / 3 / 4 / 5 at 7 / 61 / 31 / 1%, and Resolve at 7 / 61 / 31 / 1%. With a Specialty chosen at random: Health 6 / 54 / 38 / 2%, and Resolve 9 / 66 / 24 / 1%. Squadmate templates total 18 (OQ-29).
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (h); Health and Resolve are computed from the final ratings after the Graduation swap; ADR-0014's reference builds get non-key attributes (3 for the Rookie with one at 2, 3 for the Veteran, 4 for the Levi-grade soldier) and Severity is tuned against Agility 3.
- **ADR:** ADR-0014
- **Revised by owner decision:** Health boxes. The Health 2 cost is larger: such a soldier is Down on their second untreated Critical Injury.
- **Revised by batch 7 (7-1):** "every point from a rolled row" now describes the Lifepath only. Two built procedures sit beside it, the Template Build (a Specialty's template array) and the Free Build (18 points, every attribute 2 to 4, the key attribute at 4, at most two attributes at 4), allowed per campaign by the GM; neither reaches a key attribute of 5 or 6 or a Top 10 Class Rank, so the one creation distribution ADR-0014 tunes against is the Lifepath's and the built soldiers sit inside its envelope (OQ-135).

### OQ-20: Talent levels at creation

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, sections 2.3.3 and 2.7; `data/character/lifepath.yaml` (`talent_levels_at_creation`); `data/character/training-years.yaml` (`talent_cap`, `curriculum`).
- **Revised:** after Chapter 2 review round 1. The choice is unchanged. Opus review 1 found the both-capped fallback never fired in 800k simulated Cadets; it stays as a guard. The Year 1 curriculum now lists Talents that name entries a current rule uses (OQ-33). Promotion takes its Talent levels from the same sources (OQ-31). After Chapter 2 review round 2 (Opus Minor 6): option (g) was added. When the usable Talent on an event was already capped and its partner named only dormant entries, the dormant one was the only legal pick, and 2.8% of soldiers were forced into at least one dormant level (for example Year 3 "The forced march" for a Cadet who took Strong Back from the Origin). With (g), no simulated soldier is forced into one (200k Cadets), and the new fallback is used by 2.9% of them. The both-capped fallback still never fired.
- **Question:** ADR-0006 caps Talents at level 2 at creation but sets no number of levels or where they come from. It also doesn't say what happens when a table offers only Talents that are already capped.
- **Options:**
  - Levels: (a) 5 levels, 1 from the Origin, 1 from each Training Year event, and 1 from the Specialty. (b) Add a free level at Graduation (6). (c) 1 from the Origin, 1 from the Specialty, and 3 more from the Specialty's list.
  - Fallback when both offered Talents are capped: (d) any Talent on that Training Year's curriculum list. (e) Any Talent. (f) The level is lost.
  - Fallback when only a dormant Talent can gain a level: (g) the Cadet may take it, or a curriculum Talent that can gain one (`if_only_dormant_can_gain`; Opus review 2, fix 1). (h) Replace the dormant partners on the affected events (Opus fix 2).
- **Provisional choice:** (a), (d), and (g).
- **Why:**
  - ADR-0014's Rookie has Talent 1. With 5 levels a focused player can reach level 2 in one Talent, usually through the Specialty level.
  - (c) turns the Lifepath's events into flavor.
  - (d) keeps the level tied to what the Cadet studied that year. (e) lets a player bypass the tables, and (f) punishes a roll the player did not choose.
  - (g) uses the same curriculum lists as (d), leaves the event tables as they are, and still lets a player take the dormant Talent for the story. Every curriculum list holds at least four Talents that name used entries, more levels than a Cadet can have capped by that year, so the fallback always has a usable pick. (h) would change six events to cover a case that affects fewer than 3% of soldiers.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (d), (g).
- **ADR:** none
- **Revised by batch 7 (7-1):** a built soldier holds the same 5 levels, one from its chosen Origin row's pair, one from its Specialty's list, and three from any Talent, with at most one Talent at level 2 and rule Talents at level 1 (OQ-135).

### OQ-21: Performance roll, Merit, Class Rank, and the Top 10

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, sections 2.3.3 and 2.3.4; `data/character/training-years.yaml` (`performance_roll`, `performance_attributes`); `data/character/class-rank.yaml`; `data/core/dice-pool.yaml` (`roll_exceptions`, row `performance-roll`, added by Chapter 2).
- **Revised:** after Chapter 2 review round 1 (Opus finding 11, Codex finding 3). Year 2's performance attributes changed from Agility and Strength to Agility and Perception, so each attribute is a performance attribute in exactly one year. `merit_from_successes` now states "3 or more" as `successes_min` and `successes_max`, where before it was only a comment a data import could not read.
- **Question:** The glossary has Training Year performance earn Merit, Merit decide Class Rank, and the Top 10 offered the Military Police. Nothing sets any of these:
  - The performance roll's pool, and which attributes it uses.
  - The Merit per result.
  - The Class Rank thresholds.
  - Whether Class Rank has a mechanical effect.
  - How a Military Police offer fits a Survey Corps campaign, an open decision from the codex-gpt6-astra final review.
- **Options:**
  - Roll: (a) the higher of two listed attributes, alone, with no Push and no Help. (b) The full pool with Talents.
  - Pairs: (k) Strength in two years (the earlier tables). (l) Each attribute in exactly one year.
  - Top 10 threshold: (c) Merit 5 or more (15%). (d) Merit 6 or more (6%).
  - Top 10 effect: (e) none. (f) +1 key attribute. (g) +1 Talent level. (h) Starting Commendations, which are Phase 2.
  - Military Police: (i) always declined. (j) Accepting it makes the character an NPC contact and the player creates another.
- **Provisional choice:** (a), (l), Merit equal to successes up to 3 plus the event's `merit_change`, (d), (f), and (i).
- **Why:**
  - With (a) Merit reflects the Cadet's rolled attributes and events. The Cadet's Stress is 0 during the Lifepath, so a Push would only add a Stress Die with no risk attached. (b) double-counts the event Talents.
  - (k) made a Cadet whose highest attribute was Strength reach Top 10 10.7% of the time against 3.9% for Agility (Opus review 1). Under (l), simulated after review round 2 with 200k Cadets and the policy stated under *Known skew*, Top 10 by the Cadet's highest rolled attribute is Strength 9.5%, Agility 3.8%, Wits 5.6%, Perception 7.2%, Instinct 5.2%, Empathy 6.3%.
  - Canon's Top 10 is 10 graduates in a class of about 200, and (d) keeps it rare among player characters: 6.3% of Cadets are Top 10 and 15.5% reach Merit 5 or more. In a four-player Squad, at least one player character is Top 10 about 23% of the time. These rates hold with or without the Graduation Exam (OQ-22).
  - (f) gives Class Rank a reason to matter and is the only route to an attribute of 6 (OQ-19). (g) widens the Talent gap that ADR-0014's reference builds assume is small. (h) belongs to rules not yet written.
  - (i) keeps the premise. (j) takes a character away from a player for rolling well.
  - The Class Rank numbers only describe the standing and have no other effect. Several graduates can share one.
- **Known skew:** corrected after Chapter 2 review round 2 (Opus Minor 7), which found the earlier diagnosis and per-attribute figures did not reproduce. By the attribute each event raises, event `merit_change` totals are Strength +6, Perception +4, Wits +1, Instinct +1, Empathy 0, and Agility -1 (+11 in all). Strength, not Agility, is the main driver. Simulated with 200k Cadets, overflow to the highest other attribute below 5, and the Specialty of the highest rolled attribute: key attribute 6 by that attribute is Strength 4.0%, Perception 2.7%, Empathy 2.0%, Wits 1.7%, Instinct 1.4%, Agility 0.9%. Because the swap (OQ-19) moves the soldier's highest rating into whichever key attribute they choose, the skew decides which Cadets reach Top 10, not which Specialties can hold a 6. Moving `merit_change` between events so each attribute's total is near +2 would keep the Top 10 rate. It was not adopted in this round, which kept to minimal fixes. Revisit it with the simulator.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (l), (d), (f), (i); the `merit_change` skew is accepted, not retuned.
- **ADR:** none

### OQ-22: Graduation Exam structure

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, section 2.4; `data/character/graduation-exam.yaml`; `data/core/stress-changes.yaml` (row `graduation-exam-ends`, added by Chapter 2).
- **Related:** OQ-37 (Unresolved Major: coordinated Help, roll order, and Covering in the squad field exercise, from Chapter 2 review round 3).
- **Revised:** after Chapter 2 review round 1 (Opus finding 6 and Minor finding 12, Codex finding 5). Before, Stress Responses were resolved on the Chapter 3 table and ended with the Exam through an `also` clause in `stress-changes.yaml`, Trials 1 and 2 paid -1, 0, or +1 Merit, and the parity figures assumed an unstated Push policy that the rules made free. Opus showed Pushing every roll below 3 successes raised Top 10 graduates from 6.4% to 9.3% and gave 99% of Exams a Chapter 3 result with no turns or Positions to read it against. Codex showed the `also` clause could end a Scar or a Critical Injury and that the quoted Merit comparison (0.20 against 0.50) was not close. After Chapter 2 review round 2 (Opus finding 1, Codex finding 4): the squad bonus was removed, and only a Cadet who has not yet rolled in the squad field exercise can Cover. Opus showed that "Push only after 0 successes" was not the best policy. Pushing the squad field exercise whenever it fell short made the Exam pay 0.73 Merit and raised Top 10 to 8.6% (against 6.2%) for four Cadets, and to 12.6% for a Cadet taking the Exam alone, because the squad bonus paid most when the fewest Cadets had to succeed. Codex showed that a Cadet who had already rolled could Cover every later Push for free, because the Stress they gained could no longer reach any roll of theirs before the reset.
- **Question:** The glossary defines the Graduation Exam as the optional played prologue that decides Class Rank, with three Trials. Chapter 2 includes it because the glossary lists it among the Lifepath terms. Nothing says:
  - How it combines with Merit.
  - What each Trial rolls.
  - Whether Exam Stress carries into play.
  - What a Stress Response does in a prologue with no rounds, turns, Positions, or Titans.
- **Options:**
  - Merit: (a) it replaces the Year 3 performance roll, and Trial results add Merit. (b) It replaces all Merit, and Trials set Class Rank directly. (c) Its Merit is added on top of all three performance rolls.
  - Stress: (d) it returns to 0 when the Exam ends, through a new row in `stress-changes.yaml`. (e) It carries into the campaign.
  - Stress Responses: (f) resolved on the Chapter 3 table, with every result gained ending with the Exam. (g) Each costs 1 Merit on the Trial that caused it, and nothing else happens (Opus fix 1). (h) Trial rolls cannot be Pushed (Opus fix 2). (i) Keep only the Stress reset, and let Chapter 3 name which results end after a scene (Codex fix 1).
  - Squad bonus: (j) every Cadet gains 1 Merit if every roll in the squad field exercise succeeds. (k) No squad bonus. (l) The bonus only when at least 3 Cadets take the Exam (Opus review 2, fix 2). (m) Total Exam Merit capped at 3 (Opus review 2, fix 1). (n) Keep the values and rewrite this entry (Opus review 2, fix 3).
  - Covering in the squad field exercise: (o) any other Cadet. (p) Only a Cadet who has not yet rolled in that Trial (Codex review 2, fix 1). (q) One Cover per Cadet, with all Stress resolved before anyone rolls (Codex fix 2). (r) Covering after one's own roll costs 1 Merit (Codex fix 3).
- **Provisional choice:** (a), (d), (g), (k), and (p), with exam issue items at Gear Dice 1, full Chapter 1 pools, Pushes allowed, Help and Covering only in the squad field exercise, Trials 1 and 2 paying 0 Merit for 0 to 2 successes and +1 for 3 or more, and the squad field exercise paying 1 Merit for a success.
- **Why:**
  - (b) throws away two played Training Years. (c) raises Merit for everyone who plays the Exam.
  - (f) needed Chapter 3 results to mean something with no turns or Positions, and ending "every Chapter 3 result" could erase lasting harm. It also wrote a non-Stress effect into Chapter 1's Stress file. (i) still leaves a Chapter 3 result with no reading inside the Exam. (g) is closed, keeps Chapter 3 out of the Exam, and gives a Push a real price. (h) removes the one place a new player practices Pushing before play. The reviews proposed different fixes; (g) was chosen as the one that satisfies ADR-0003 without pre-deciding Chapter 3.
  - Stress returns to 0, not to minimum Stress, because no Scar can arise during the Exam.
  - Simulated after review round 2. The model: 60k Cadets per case, built from the current tables. Each Cadet takes the squad field exercise entry with the largest pool, and each gets one helper when 2 or more take the Exam. Exam issue wear carries between Trials, and Sure Hands and Hunter's Eye apply. Cadets roll strongest first and, separately, weakest first. Top 10 is compared against the same Cadet's Year 3 performance roll.
    - **Reference policy** (Push the squad field exercise whenever it falls short; Push Trials 1 and 2 only at exactly 2 successes; Cover where allowed), four Cadets: Exam Merit 0.51 against 0.58 for the Year 3 roll it replaces, and Top 10 6.2% with the Exam against 6.1% without. 22% of Cadets and 66% of Exams see a Stress Response.
    - Same policy, 1 to 6 Cadets: Exam Merit 0.45 (one Cadet) to 0.53, and Top 10 with the Exam between 0.4 points below and 0.1 points above the rate without.
    - Pushing only when the Push's expected Merit gain is positive: Top 10 with the Exam never more than 0.1 points above the rate without, at any group size (0.4 points below for one Cadet).
    - Never Pushing: Merit 0.33, Top 10 4.4%. Pushing whenever short on every Trial: Merit -0.05, Top 10 4.9%, and 71% of Cadets see a Stress Response.
    - Across 1 to 6 Cadets, both roll orders, and all five policies, no case raised Top 10 by more than 0.2 points.
  - The same model reproduces Opus review 2 under the round 1 rule: four Cadets on the reference policy earned 0.72 Merit and Top 10 7.9% against 6.2%, and one Cadet 12.4% against 6.1%. Restricting Covering alone left four Cadets at 8.0% and two at 10.8%, so the squad bonus was the cause.
  - (k) removes the group-size effect at its source: each Cadet's Merit depends only on their own rolls, and Help and Covering are the only group levers. (l) still left four Cadets 1.7 points above the rate without. (m) changed no simulated result by more than 0.2 points, because an Exam rarely paid more than 3 Merit. (n) keeps an Exam that doubles a lone Cadet's Top 10 chance, which matters because a replacement character can take it alone (`use.applies_to`).
  - (p) makes every Cover cost the Covering Cadet an extra Stress Die on a roll still to come in that Trial, which answers Codex's cost transfer with one condition. (q) needs a declared order and early Stress resolution. (r) adds a second Merit cost to one act. Under (p) the last Cadet to roll in the Trial cannot be Covered.
  - The Exam pays a little less Merit on average than the roll it replaces, with a spread wide enough that the share of Top 10 graduates stays level. That share is the only mechanical effect of Class Rank (OQ-21). The Exam rewards Talents, Help, and Pushing with judgment, which the performance roll does not. A Cadet who never Pushes, or Pushes every short roll, earns less.
  - (e) starts some player characters above minimum Stress because of a prologue.
- **Simulator case:** re-run with Help concentrated on the weakest Cadets instead of one helper each, and with the Merit table at each group size, whenever an event's `merit_change` or an exam issue rating changes.
- **Glossary note:** if confirmed, the Graduation Exam entry in `CONTEXT.md` should say it contributes Merit toward Class Rank, and the Training Year entry that the Exam replaces the third year's performance roll.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** The Exam is rebuilt with OQ-37: the vote comes before the Lifepath, order within a Trial is rolled, Trials 1 and 2 pay 1 Merit at 2 successes and cannot be Pushed, Helped, or Covered, Trial 3 needs 3 successes with exactly one cycle helper, and a Stress Response costs 1 Merit.
- **ADR:** none

### OQ-23: Drive timing, trigger tests, and replacement

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, sections 2.3.2 and 2.5; `data/character/enlistment.yaml` (`use`, `drive_rules`, `rows`).
- **Related:** OQ-36 (Drives outside a Titan Engagement).
- **Revised:** after Chapter 2 review round 1 (Opus findings 2, 4, and 10; Codex finding 2). Before, six Drives triggered on states of the world (a comrade's Position, the soldier's Stress, Grief, or injury, a Titan's Broken Body Part, a Grabbed comrade), four did not begin "When I ...", the player could choose the Why You Enlisted row and so its attribute point, and a Drive died when its comrade "left the Squad Pool", which promotion does. After Chapter 2 review round 2 (Codex finding 2, Opus Minor 4 and Minor 9): `own_state` no longer names a Focus Titan's Attention, and a Position counts only if the soldier's own move put them in it. Shield the Walls became "When I took Draw Attention on my most recent turn", and Prove Them Wrong "When I hold Blind Spot or On Body, having moved there myself". Both reviews showed that the Attention Ladder could give a soldier who had done nothing a Focus Titan's Attention ("nearest"), and that a Grab could put a soldier On Body, so both triggers could be met without an act. A Drive that needs a named comrade, recorded when no other soldier in the Squad is alive, now falls back to a Drive that does not need one.
- **Question:** The glossary says a Drive lets a soldier shrug off one Fear Roll result per session while acting on it. ADR-0003 item 3 requires "When I ..." triggers, and the codex-gpt6-astra final review (finding 10) asked for an eligibility test. Nothing says:
  - When the trigger is checked.
  - What "acting on it" means as a test.
  - What happens to a Drive that can no longer trigger, and when a named comrade is named.
  - Whether the Why You Enlisted row is rolled or chosen.
- **Options:**
  - Timing: (a) checked when the result is about to take effect. (b) Checked before the Fear Roll is made.
  - Test: (c) three closed tests: any state, an entry taken on the most recent turn, or an entry used since that turn began. (d) Commitment: shrug the result off now, and if the soldier does not take the Drive's named action on their next turn, the result applies then. (i) As (c), but only acts and the soldier's own state count: `own_state` (the soldier's own Position, a Focus Titan's Attention on the soldier, or the soldier's own flight), an act on the most recent turn, or an act since that turn began. Acts are Catalog entries plus Pushing, and a Drive can require that the act was used on a named comrade or on a Grabbed or Down comrade.
  - Replacement: (e) a new Drive of the player's choice at the start of the next session, with no attribute point. (f) The Drive stays and never triggers.
  - Row: (g) rolled or chosen. (h) Rolled only. (j) Rolled for the attribute point, with the player free to take the Drive of any row.
  - Named comrade: (k) the Drive dies when the comrade leaves the Squad Pool, and comrades are named only when the Squad forms. (l) The Drive dies when the comrade dies, retires, or leaves the Squad; promotion does not leave the Squad; a Drive recorded later names a living comrade when it is recorded.
  - Own-state provenance: (m) `own_state` names only Positions and the soldier's own flight, a Position counts only if the soldier's most recent change of Position was their own move, and Shield the Walls uses Draw Attention (Codex review 2, fixes 1 and 2; Opus review 2, fix 1). (n) Keep the states, exclude being Grabbed by name, and record that the Attention Ladder can meet Shield the Walls without an act (Opus fix 2). (o) Amend the glossary so a Drive works while its trigger is met, whether or not the soldier acted (Codex fix 3).
  - No living comrade: (p) a Drive that needs a named comrade and is recorded when no other soldier in the Squad is alive is replaced by a Drive that does not need one (Opus review 2, Minor 9).
- **Provisional choice:** (a), (i), (e), (j), (l), (m), and (p).
- **Why:**
  - (a) lets the player see the result before spending the once-per-session use. (b) spends the Drive on a Fear Roll that might come to nothing.
  - (i) keeps the glossary's "while acting on it". Every trigger is met by something the soldier did or by a Position the soldier moved into. Under (m), `own_state` counts Blind Spot or On Body only when the soldier's own move put them there, and counts being airborne on ODM Gear, which only the soldier's own ODM use achieves. A Focus Titan's Attention is no longer an own state, because the Attention Ladder hands it to the nearest person with no act by that soldier, and a Grab is a change of Position another rule makes. (n) left one passive case written into the rules. (o) changes the glossary to fit two Drives. The Promise (Break Attention) and Shield the Walls (Draw Attention) are both decoy acts, but name different entries. The rewritten Drives keep their reasons: Knowledge (a Read or Body Part strike), Nothing Left (a Push), The Promise (Break Attention), Full Belly (a dodge, for a soldier who means to survive), Pay It Forward (aiding, treating, lifting, or freeing a Grabbed or Down comrade), and Stay Beside Them (Help, Cover, or Lift Comrade for the named comrade). (c) let a soldier who did nothing shrug off a result. (d) needs a deferred result tracked across turns.
  - (f) punishes Grief with a dead rule.
  - (j): both reviews found that choosing the row concentrated an attribute point, moving the share of key attribute 5 or 6 from 37% to 53%, past (g)'s own "few points" test. Opus fix 2 and Codex fix 1 agree on keeping the point rolled while letting the player play the Drive they want. (h) would take away that choice for no gain.
  - (l): promotion follows almost every player character death, and a Drive naming the promoted Squadmate should not end because of it. A Drive recorded after the Squad forms must be able to name someone. (p) covers a Squad in which no one else is left alive to name, which the procedure otherwise left with no answer.
- **Payoff note:** Duty, Stay Beside Them, and Pay It Forward overlap on Help and Cover, and Vengeance and Knowledge on the Body Part strike. The simulator should record how often each Drive is met when a Fear Roll arrives, once Chapter 3's triggers exist.
- **Glossary note:** if confirmed, the Drive entry in `CONTEXT.md` could read "while its trigger, an act of the soldier's or the soldier's own position, is met".
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (i), (e), (j), (l), (m), (p) with two changes: Pay It Forward also counts an act on a comrade who is Grabbed or Down when the Fear Roll result takes effect, and three own-state edges (placement, a Grab, carried flight) are closed.
- **ADR:** none

### OQ-24: Health formula and rounding of derived values

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, section 2.2; `data/character/attributes.yaml` (`derived_values`); `data/character/squadmates.yaml` (templates).
- **Question:** The glossary gives Resolve as "half of Instinct plus Empathy plus 1 per Scar" without rounding, and gives no Health formula. The Health formula (half of Strength plus Agility) appears only in the settled design summary in the final review brief. The codex-gpt6-astra final review listed rounding as an open decision.
- **Options:** (a) Round both halves up. (b) Round both down. (c) Health equal to Strength plus Agility, as in Coriolis.
- **Provisional choice:** (a), with the Health formula from the design summary. The Resolve formula in `attributes.yaml` now also states the glossary's Grief limit of 3 points (Opus review 1, Minor).
- **Why:**
  - Alien rounds both up.
  - Under OQ-19 most non-key attributes are 2 or 3, so rounding down would give many soldiers Resolve 2 and Health 2, below every reference build.
  - (c) roughly doubles Health, which ADR-0005 keeps small because Titan attacks bypass it.
- **Glossary note:** if confirmed, the Resolve entry in `CONTEXT.md` could read "half of Instinct plus Empathy, rounded up, plus 1 per Scar".
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): Health and Resolve round up, from the final attributes.
- **ADR:** none
- **Revised by owner decision:** Health boxes. The Health glossary text is superseded; the formula stands.

### OQ-25: Attribute and gear for Titan Engagement entries

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, section 2.8; `data/character/action-catalog.yaml`.
- **Question:** Chapter 1 has every attribute roll name its attribute and gear items through a Catalog entry. Only the dodge is fixed by an ADR (ADR-0015: Agility and ODM Gear). The fable final review (open decision 2) asked which attribute and gear item roll a Nape strike, a Body Part strike, and an ODM move.
- **Options:**
  - Strikes: (a) Strength with a Blade Set. (b) Agility with a Blade Set. (c) Strength with ODM Gear or a Blade Set, the roller's choice.
  - Break Attention: (d) Perception with ODM Gear or a horse. (e) Wits. (f) Instinct.
  - Draw Attention: (g) not rolled. (h) An Empathy roll.
  - ODM and riding: (i) Fly and Ride as rolls a Chapter 4 or 5 rule calls for. (j) Actions.
- **Provisional choice:** (a), (d), (g), and (i), with Read on Instinct (the glossary's "Reading Titans") and Break Free on Strength with an optional Blade Set.
- **Why:**
  - Agility already rolls the dodge, Fly, and Ride. Adding strikes under (b) would make it the only attribute that matters in a Titan Engagement. Opus review 1 noted that Strength strikes are the debatable fidelity call, since canon's best cutters rely on spin rather than mass.
  - (a) gives every attribute at least one Specialty as its key.
  - The design summary has a Pushed blade die ruin a Blade Set, so strikes take their Gear Dice from the Blade Set. (c) would make that optional.
  - (d) gives Perception, and so the Hunter, a Titan Engagement job.
  - (g) is the simplest way to set ADR-0003 item 2's flag.
  - (i) follows Chapter 1's baseline that a move changes Position with no roll.
- **Consequence for Chapter 4:** under OQ-12, only a Pushed roll whose gear item is ODM Gear makes the Gas Roll three dice. A Pushed strike, which uses a Blade Set, does not. ADR-0014's gas target "about 6 when pushing every round" should be simulated with Pushes on dodges and Break Attention, not on strikes.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep every assignment; the dodge's gear items are ODM Gear, or the horse while the soldier is mounted, and a Pushed dodge on the horse wears the horse. Revised by batch 2b (OQ-92): parity between the two dodges is restored by rating horses as ODM Gear.
- **ADR:** ADR-0015

### OQ-26: Catalog entries that are not attribute rolls

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, section 2.8; `data/character/action-catalog.yaml` (`kind`); `data/character/talents.yaml`.
- **Question:** ADR-0006 has every Talent name the actions it applies to from the Action Catalog. Rule Talents need to trigger on things that are neither actions nor attribute rolls: Help, Covering, Call It, Fear Rolls, Stress Response rolls, and Gas Rolls. OQ-11 added entries only for the dodge, block, and Death Roll.
- **Options:** (a) Add entries with the kinds `option` and `fixed-roll`, and let only dice Talents be restricted to attribute-roll kinds. (b) Let rule Talents name glossary events outside the Catalog. (c) No Talent can refer to these.
- **Provisional choice:** (a).
- **Why:**
  - It keeps ADR-0006's single test (a Talent applies only to entries it names) and gives Foundry one id space.
  - (b) creates a second, open list.
  - (c) removes the Leader and Tactician Talents that make teamwork levers (ADR-0010) better.
  - Help stays defined in Chapter 1. Its entry only points there.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-27: Actions outside the Action Catalog

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, sections 2.8 and 2.9; `data/character/action-catalog.yaml` (`gear_requirement`, `tracked_values`, `changes`, `requires_gear`, `without_gear`, `uncatalogued_actions`); `data/character/talents.yaml` (Make Do).
- **Related:** OQ-35.
- **Revised:** after Chapter 2 review round 1 (Opus finding 7, Codex finding 6). The gear rule now applies to every use of an entry. Before, it sat only inside this procedure, so a soldier with no Blade Set could Nape strike at full Strength by naming the entry but not by describing the action. A `rule-named-value` tracked value was added, giving the "attribute alone" branch a route for actions that no entry matches. After Chapter 2 review round 2 (Opus Minors 3 and 8): `gear_requirement` now counts an item worn down to 0 (for ODM Gear, a Jam) as not had, along with any state a Chapter 4 rule names, because a test of possession alone let a soldier Nape strike with a worn-out Blade Set and fly on Jammed ODM Gear. Make Do's trigger follows the same test. Step 1 now says the action's description never limits which value the player names. The earlier shout example concluded "no effect" when naming "add a die to a comrade's roll" reaches Help.
- **Question:** ADR-0003 item 9 says actions outside the Catalog use the closest Catalog action or the attribute alone, and Chapter 1 (section 1.3, step 1) left the procedure to Chapter 2. Chapter 1 review 3 (finding 3) added rolls that a rule calls for by attribute without naming an entry.
- **Options:** (a) Match by a closed list of tracked values the action is meant to change; with no match there is no effect; the attribute alone applies when a required gear item is missing, or when a rule calls for an attribute directly. (b) Keyword or purpose tags on entries, chosen by the player. (c) The GM picks the closest entry. (d) The player rolls whichever attribute they argue fits, alone. (e) As (a), with the gear rule applying to every use of an entry and a rule-named value reaching the attribute alone. (f) A general overcome-obstacle entry (Codex fix 2).
- **Provisional choice:** (e).
- **Why:**
  - (c) is the GM discretion ADR-0003 forbids.
  - (b) needs a judgment about whether a keyword fits.
  - (d) lets any attribute do anything, which flattens Specialties.
  - Under (e), tracked values are state the rules already own, so matching is closed, and what changes no tracked value is flavor, which ADR-0003 allows.
  - The gear rule keeps Talents narrow (ADR-0006): an improvised bandage rolls Wits alone, whether the player says "Treat Injury" or "a torn cloak". Make Do is the Talent that bends this.
  - (f) still needs someone to pick the attribute for each obstacle. A `rule-named-value` puts that choice in the rule that creates the obstacle, where ADR-0003 wants it.
  - **Reading of ADR-0003 item 9:** this procedure reaches "the attribute alone" in three cases: a missing gear item, a roll a rule calls for by attribute, and a rule-named value that no entry changes. An action that changes no tracked value gets no roll. Opus review 1 judged this sound but a reading of the ADR rather than its text. Codex review 1 judged it too narrow for consequential actions. Whether to amend the ADR is OQ-35.
- **Risk:** players may find "no mechanical effect" restrictive for clever ideas. The remedy is a new entry or tracked value added by a later chapter, not a ruling.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (e), which is now the text of ADR-0003 item 9 as amended under OQ-35.
- **ADR:** ADR-0003 (item 9, via OQ-35)
- **Revised by batch 9 (9-1, 9-12):** the tracked-values procedure stays as the default order and the list as an index, no longer as a gate. An act that matches no value, or is meant to change none, is ruled on under Chapter 1, section 1.1: a called roll, it happens, or it cannot be done (ADR-0024, limits 9 and 12).

### OQ-28: Talent list design and Specialty grants

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, sections 2.6 and 2.7; `data/character/talents.yaml`; `data/character/specialties.yaml`.
- **Related:** OQ-34 (trigger timing), OQ-36 (once per Titan Engagement outside one).
- **Revised:** after Chapter 2 review round 1 (Opus finding 8, Codex finding 1). Relentless gave a second Push on strikes with no limit. Both reviews simulated it: at Nape Depth 4 a Rookie's solo strike rose from about 12% to 28% and a Levi-grade soldier's from 47% to 64%; at Depth 5 they were 12% and 46%. No whole-number Nape Depth met both of ADR-0014's solo targets for soldiers with and without it. The simulator case list was extended. After Chapter 2 review round 2 (Opus Minor 5): Relentless now needs at least 1 success on the strike that falls short, so it no longer creates an Opening from a strike with none (14% of a Rookie's failed Depth 4 strikes). Opus review 2 also found that it still helps a lone striker's follow-up strike, if the striker can spend Openings from their own failed strike before Regeneration erases them: Rookie at Depth 4, 25.8% without Relentless and 32.0% with (Levi-grade 58.9% and 63.6%), measured before this change. Even without Relentless, that follow-up is well above ADR-0014's 10%, so whether a striker can spend their own Openings is a Chapter 5 question. The claim below is limited to a first strike. The count of Talents needing a simulator check was corrected to nine (Codex review 2, Minor 6).
- **Question:** No ADR sets the Talent list, whether rule Talents have levels, what a Specialty grants beyond its key attribute, or how specific Talents interact with ADR-0014 targets and ADR-0015's dodge pool.
- **Options:**
  - Rule Talents: (a) single level. (b) Scaled by level.
  - Specialty lists: (c) four Talents each, shareable, open to all. (d) Exclusive, which ADR-0006 rejects.
  - Specialty grants: (e) key attribute, swap and floor, and 1 Talent level. (f) Also a unique Specialty ability. (g) Also a Standard Issue item.
  - Relentless: (h) a second Push on strikes, unlimited. (i) A second Push only on Body Part strikes (Codex fix 2). (j) One extra base die after a failed strike (Codex fix 1). (k) A Nape strike that falls short creates 1 extra Opening (Opus fix 3). (l) A second Push once per Titan Engagement (Opus fix 1).
- **Provisional choice:** (a), (c), (e), and (k), with 40 Talents (20 dice, 20 rule).
- **Why:**
  - Single-level rule Talents are easy to read at the table and never stack with themselves.
  - (f) would recreate Alien's occupation-locked Talents in a new form. (g) belongs to Chapter 4.
  - (k) works through Openings, a teamwork lever ADR-0010 names, and never changes the striker's own roll, so neither solo Nape strike target moves for a first strike. A lone striker's follow-up strike is the one case it can raise (see *Revised*). A striker who falls short counts as hooked in (ADR-0010) and draws the Titan's turn, so the extra Opening serves the next striker, which is the moment ADR-0007 wants to preserve. (i) and (j) keep a bonus on the soldier's own strike that Chapter 6 would tune around. (l) still breaks both targets in the Engagement it is used. The reviews proposed different fixes; (k) was chosen as the most consistent with ADR-0007 and ADR-0010.
- **Simulator cases:**
  - **Relentless** under (k) against ADR-0014's prepared Squad target (a Medium Titan in about 3 rounds), and against a lone soldier's follow-up strike once Chapter 5 decides whether a striker can spend Openings from their own strike.
  - **Light Trigger** against the gas target. It is limited to once per Titan Engagement for that reason. ADR-0009 also drains gas in Chases, so the Chase rules decide whether the limit reaches them (OQ-36).
  - **Wide Awareness** and **Shoulder the Load** (two Position steps for Help and Covering) inside OQ-06's Covering sponge case.
  - **Sure Hands** (a second Push on Treat Injury) and **Hard to Kill** (dice on the Death Roll) against the player character death target.
  - **Pry Loose** against the Grab target. Under Chapter 1's unresolved OQ-18, a Grabbed soldier one step away can Help the prying roll.
  - **Unshaken Command** against Fear Roll outcomes, once Chapter 3 exists.
- **Note on Saddle Dodge:** it lets a mounted soldier dodge with the horse instead of ODM Gear, a rule Talent bending ADR-0015's pool as ADR-0006 allows. It is a partial answer to the mounted dodge that Chapter 1 review 3 (finding 4) asked to log. If Chapter 5 lets every mounted soldier's dodge use the horse, Saddle Dodge becomes redundant and should be replaced. Opus review 1 judged that a Talent changing a pool an ADR fixes should also be recorded in ADR-0015's amendment log. That is an ADR edit, left for the design owner.
- **Glossary note:** if (k) is confirmed, the Opening entry in `CONTEXT.md` could add "or a rule Talent that names the source", since Relentless creates an Opening the listed sources do not.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (c), (e), (k); Saddle Dodge is replaced by Sure Seat, a Rider rule Talent that ignores 1 point of horse wear from a Pushed named roll once per Titan Engagement.
- **ADR:** none
- **Revised by batch 7 (7-2):** (c)'s "four shareable Talents per Specialty" becomes eight, and the general list grows to twelve, all live; the Talent list ships in full for the first playtest (OQ-136). (a), (e), and (k) stand. The list of Talents that need a simulator check grows with every new Talent that names a measured entry or a fixed roll (ADR-0016, Talent guardrail 4).

### OQ-29: Squadmate stat block and which rules apply

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, section 2.10; `data/character/squadmates.yaml` (`stat_block`, `rules_applicability`, `action_list`, `templates`).
- **Related:** OQ-06, OQ-13, OQ-31.
- **Revised:** after Chapter 2 review round 1 (Opus findings 1, 5, and 14; Codex finding 7 and Minor finding 9). Before, templates had key attribute 4 and every other attribute 3 (19 points), Gear Dice were fixed at 1, Squadmates made no Gas Rolls and counted no Blade Sets or items, and the action list was six base entries plus one Specialty action, so only a Medic Squadmate could Treat Injury and none could Lift Comrade. XP and Downtime Actions were set to false.
- **Question:** The glossary and the design summary give Squadmates light stat blocks, no Pushing, and Fear Rolls. Chapter 1 (OQ-13) left Help, Covering, and the use of Stress Dice to Chapter 2. The fable final review asked whether Squadmates make Gas Rolls, carry Blade Sets, and take Downtime Actions.
- **Options:**
  - Stats: (a) key attribute 4, every other attribute 3 (19 points), plus one Talent at level 1. (b) Fixed pools per action with no attributes. (c) A full player character. (j) Key attribute 4, four attributes at 3, one at 2 (18 points), plus one Talent at level 1. (k) Key 4, one secondary 3, the rest 2 (15 points), with promotion adding the Lifepath's attribute points (Opus fix 1).
  - Covering: (d) never. (e) Allowed.
  - Gear: (f) no Gas Rolls, no Blade Set or item counting, all Gear Dice fixed at 1. (g) Gear recorded and used exactly as a player character's.
  - Stress Dice: (h) yes. (i) No.
  - Actions: (l) a base list plus one Specialty action. (m) Every entry a player character can take.
- **Provisional choice:** (j), (d), (g), (h), and (m). No current rule gives a Squadmate XP, Talent levels, or Downtime Actions; those rules decide.
- **Why:**
  - (j) matches the typical player character: 18 points (94% of new soldiers), non-key mean 2.8 against 2.74, and Agility 2 in 3 of the 7 templates whose key attribute is not Agility, against 41% of player characters. Health and Resolve are mostly 3, as for player characters. (a) out-built most player characters, including on the dodge ADR-0015 makes decide every hit. (k) needs promotion to raise attributes, which ADR-0011 forbids after the Lifepath, so Opus fix 1 was not taken. Promotion needs attributes, which rules out (b). ADR-0014's default Squadmates are Rookies, which (j) matches.
  - (m): the glossary's Specialty "never exclusive permission" and ADR-0006's "anyone can attempt any job" apply to every soldier. Under (l) the Specialty decided what a Squadmate could attempt. The template Talent still carries the specialization, so a Medic Squadmate treats with 1 more die than a Slayer.
  - (g): the glossary's Gas Roll is made "each round a soldier uses ODM Gear", ADR-0014 sets a gas target, and ADR-0004 makes gear a central cost. Under (f) the best play sent Squadmates to do every ODM move and strike at no cost (Codex review 1). Opus review 1 judged (f) sound for table load; the reviews conflicted, and (g) was chosen as the choice consistent with those ADRs. A Squadmate never Pushes, so its Gas Roll is always two dice and Push wear never touches its ratings, which keeps its tracking light.
  - (d) removes OQ-06's Covering sponge from NPCs, who roll rarely and have no player-facing cost for their Stress.
  - (h) follows Chapter 1 OQ-03 (every attribute roll has Stress Dice) and OQ-13 (Squadmates carry Stress).
  - The earlier `applies: false` for XP and Downtime Actions decided rules not yet written (both reviews).
- **Simulator note:** Squadmates never Push, so their Stress stays near its minimum and their Fear Rolls may go better than a player character's at the same Resolve (Opus review 1). Gas attrition in ADR-0014's cases now falls on Squadmates too.
- **Table load note (Chapter 2 review round 2, Opus judgment):** (g) and (m) give up the design summary's "light stat blocks ... from a short list". Each Squadmate tracks Gas Rating, spare canisters, Blade Sets, carried items, Gear Dice ratings, Health lost, Stress, and injuries, and makes a Gas Roll every round it uses ODM Gear. With two starting Squadmates, the table tracks six soldiers in full. Measure this against the fable final review's estimate of 12 to 20 minutes per round, and consider a one-line Squad sheet row format in Chapter 4.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (j), (d), (g), (h), (m); `stat_block.fields` adds `health_lost`; Chapter 4 gives a one-line Squad sheet row for Squadmate gear.
- **ADR:** none (ADR-0014 via OQ-19)
- **Revised by owner decision:** Health boxes. Squadmates use the same row of boxes; no further field is added.

### OQ-30: Wing limits and directing Squadmates

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, sections 2.3 and 2.10; `data/character/squadmates.yaml` (`wing`, `action_list.reaction_turn`); `data/character/lifepath.yaml` (`group_choices`).
- **Revised:** after Chapter 2 review round 1 (Opus Minor findings 12 and 14). The D6 roll-off now also settles every choice this chapter gives the players together. A Squadmate's own Reaction spends its own turn under OQ-09. The choices below are unchanged. After Chapter 2 review round 2 (Opus Minor 9, Codex finding 4): the roll-off now rolls one D6 per proposed choice, rolled by one player who proposed it. "Each player proposing a different choice rolls" left open whether three players backing one choice roll three dice against one, which moves that choice's odds from 1 in 2 to about 4 in 5. Codex review 2 found that the free choice of roll order inside a Trial let a Cadet who had already rolled absorb later Covering Stress; that is fixed in the Exam's Covering rule (OQ-22), not in the order rule.
- **Question:** The glossary says a Squadmate on a Wing acts right after its player character and can be directed by any player. It sets no limit per Wing and no rule for disagreements. The fable final review noted initiative overflow with many soldiers. Chapter 1 review 3 noted that a Wing Squadmate acts after a turn spent in advance.
- **Options:**
  - Per Wing: (a) at most 1. (b) At most 2. (c) No limit.
  - Disagreement: (d) the Wing's player decides, and a D6 roll-off decides otherwise. (e) Majority vote. (f) The GM decides.
  - A turn spent in advance: (g) the Squadmate still acts. (h) The Squadmate loses its turn too.
- **Provisional choice:** (a), (d), and (g). The roll-off in (d) also settles shared choices during creation: running the Graduation Exam, the campaign start year, Trial order, and starting Squadmate templates.
- **Why:**
  - (a) keeps each card to at most two soldiers.
  - (e) can tie. (f) contradicts "directed by any player" and ADR-0003.
  - (h) would double the cost of a Reaction for the soldier with a Wing, which ADR-0015's amendment tried to avoid.
  - Chapter 5 still owns assignment and Squadmates on no Wing.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (d), (g).
- **ADR:** none

### OQ-31: Starting Squad size and promotion

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, section 2.10; `data/character/squadmates.yaml` (`starting_squad`, `promotion`).
- **Related:** OQ-23, OQ-29, OQ-38 (Unresolved Major: several promotions at once).
- **Revised:** after Chapter 2 review round 1 (Opus findings 5 and 10, Codex finding 8 and Minor finding 9). Before, promotion added Talent levels "until the soldier has 5" from no named source, recalculated Health (healing a wounded Squadmate), created player-character gear from nothing, and removed the soldier from the Squad Pool, ending any Drive that named it. The Squad target of 7 with a player character Squad Leader decided a Rank rule not yet written. After Chapter 2 review round 2 (Opus Minor 9): the Origin step now reads "gain 1 level in one of its two Talents, following the level caps", like the event step. A promoted Squadmate may already hold an Origin Talent from its template, such as a Rider with Horsemanship 1 who rolls Horse Ranch, and "gain level 1" could be read as setting it to 1 and gaining nothing, which would leave the soldier short of 5 levels.
- **Question:** The design summary says the Squad aims for 6 soldiers, and that on a player character's death a player promotes a Squadmate. Nothing sets:
  - How many Squadmates a new Squad starts with.
  - When a promotion happens.
  - How a Squadmate becomes a full player character.
  - Whether Retirement also allows promotion.
- **Options:**
  - Starting Squadmates: (a) 6 minus the number of player characters, minimum 0. (b) Always 2. (c) Minimum 1.
  - Timing: (d) at the end of the Titan Engagement. (e) Immediately, mid-round.
  - Conversion: (f) keep attributes and harm, add a Drive and Haven from rolls, and top up to 5 Talent levels. (g) A full new Lifepath, keeping only the name. (h) No change beyond gaining a Drive. (j) Keep everything in its current state, including Health lost and gear; the template Talent counts as the Specialty level; roll an Origin, Why You Enlisted, and one event per Training Year for Haven, Drive, and 4 Talent levels, with no attribute points or Merit (Opus fix 2).
  - Retirement: (i) also allows promotion.
- **Provisional choice:** (a), (d), (j), and (i).
- **Why:**
  - (a) gives ADR-0014's default of 4 player characters and 2 Squadmates. Any change for a player character Squad Leader belongs to the Rank rules.
  - (e) would insert a new player character's initiative card mid-round, a Chapter 5 problem.
  - (j) takes the promoted soldier's 5 Talent levels from the same rolled sources as a new soldier, so neither route out-builds the other. Its attributes total 18 like a new soldier without a Top 10 Class Rank (OQ-29), and ADR-0011 keeps them unchanged. Keeping Health lost and current gear stops a death from healing and resupplying the soldier who replaces the dead one (Codex review 1). Squadmates now record gear like player characters, so nothing has to be invented. (f) named no source for its levels and let the player choose freely. (g) erases the Squadmate the player chose to promote, and (h) leaves them well short of the rest of the Squad.
  - ADR-0011's first-level Talent restriction is read as applying to XP purchases, not to this conversion.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (j), (i); promotion is timed exactly like Retirement, at the end of the procedure in which the death or Retirement happened, at once only if none is under way.
- **ADR:** none
- **Revised by batch 7 (7-11):** (a) stays the default and the rule; a table may start with fewer Squadmates than 6 minus the player characters, and the chapter and the packet state the cost (about three times the deaths a fight for four Rookies alone, and no one to promote). The first playtest runs four player characters with no Squadmates (7-12). `no_squadmate` now reads: the player creates a new character by any procedure the campaign allows, who joins at the next Waypoint on an Expedition, at the start of the next Titan Engagement when no Expedition is under way, or at the next Downtime, whichever comes first.
- **Revised by batch 8 (8-38):** a data row, `squadmates.yaml` `playtest_configuration` (4 player characters, 0 Squadmates), tagged Playtest rule, records the first playtest's Squad. While it holds, Recruit brings no Squadmate and is not offered, and a dead player character is replaced by a new character. Squadmates stay the default rule (OQ-166).

### OQ-32: Campaign start year and Canon Tie

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2, sections 2.3 and 2.3.1; `data/character/origins.yaml` (`condition`, `canon_tie`, `haven_choice`); `data/character/lifepath.yaml` (step `campaign-start-year`).
- **Revised:** after Chapter 2 review round 1 (Opus Minor finding 15). The choice is unchanged. The Shiganshina Haven "A parent who reached the safety of Wall Rose" was replaced by one true in any start year, and the Year 3 event "An afternoon on the Wall" now takes place on an outer district's wall.
- **Question:** Some Origins depend on history. A refugee from the fall of Wall Maria in 845 cannot have graduated before 848. The glossary says a Canon Tie is optional and drawn from the Lifepath, but gives it no effect.
- **Options:**
  - Start year: (a) the players record it before the Lifepath, and Origin rows with a minimum year are rolled again if the start year is earlier. (b) No conditions on rows. (c) The Canon Clock rules decide, and nothing is conditional until they exist.
  - Canon Tie: (d) no mechanical effect in Phase 1, at most one, gained only from Origin rows. (e) A small mechanical effect now.
- **Provisional choice:** (a) and (d).
- **Why:**
  - (b) produces soldiers whose history contradicts canon, and (c) leaves Chapter 2's table unusable.
  - The start year is a campaign setting like Canon Proximity, and the Canon Clock rules can take ownership of it.
  - (e) would pre-empt the Canon Clock and Canon Proximity rules, which are not yet written.
- **Open for the Canon Clock rules:** only 3 of 12 Origins give a Canon Tie, none to a Survey Corps figure, so a Squad of four has none about 32% of the time (Opus review 1). A Canon Tie table for rows without one belongs with the rules that give ties an effect.
- **Glossary note:** "campaign start year" has no glossary entry. If confirmed, `CONTEXT.md` could add it under Campaign.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a) and (d), with the year kept as a current value, the Campaign Year, recorded before the Lifepath, advanced only by the Canon Clock rules, and tested by every Origin condition.
- **ADR:** none

### OQ-33: Dormant Catalog entries and Lifepath Talent choices

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2 review round 1 (Opus finding 9); sections 2.3.3, 2.7, and 2.8; `data/character/action-catalog.yaml` (`dormant`); `data/character/talents.yaml` (`dormant_talents`); `data/character/origins.yaml`; `data/character/training-years.yaml`.
- **Question:** Seven roll entries (`spot`, `size-up`, `survive`, `persuade`, `endure`, `sneak`, `recall`) exist for Expedition, Downtime, and Chase rules not yet written, and `fight` and `block` are reserved. Eight dice Talents name only those entries. Five Origins and three events offered only such Talents, so 57% of new soldiers started with at least one Talent level no Phase 1 rule could use, even when the player always took a usable Talent where one was offered. The entries also fixed attributes for rolls Phase 2 has not designed.
- **Options:**
  - (a) Change the tables so every Origin row and every event offers at least one Talent that names an entry a current rule uses; mark the seven entries dormant, with their later rules free to change the attribute (Opus fix 1).
  - (b) A fallback that lets a dormant level go to a usable Talent, and revert the fallback when Phase 2 lands (Opus fix 2).
  - (c) Reserve the seven entries and remove their Talents from the Lifepath (Opus fix 3).
- **Provisional choice:** (a). The changes: Wall Maria Refugee offers Hard to Kill (was Long Haul); Trost Merchant Family, Steady Voice (was Judge of Character); Forest Hunting Village, Lure (was Fieldcraft); Underground City, Grip Breaker (was Hand-to-Hand); Interior Merchant House, Titan Reader (was Silver Tongue). Year 1 "Found in the storehouse" offers Slip Away (was Long Haul), "Three days alone" Iron Nerve (was Quiet Step), and the Year 1 curriculum lists four usable Talents. Year 3 "Lost at night" offers Wide Awareness (was Keen Eyes). A script check confirmed every Origin row, event, and Specialty list offers at least one usable Talent.
- **Why:**
  - (a) removes almost every forced dead level, and the player can still take a dormant Talent for the story, as Mira does in the chapter's example. Nothing has to revert when Phase 2 lands. Opus review 2 found that (a) alone still forced 2.8% of soldiers into a dormant level, when the usable Talent on an event was already capped. The claim holds with OQ-20 (g), under which no simulated soldier is forced into one.
  - (b) adds a temporary rule. (c) removes Talents the later rules will need and forces a second Lifepath revision.
  - Marking entries dormant stops this chapter from fixing attributes for rolls Phase 2 has not designed, the scope concern Opus review 1 raised.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a).
- **ADR:** none
- **Revised by batch 7 (7-14, 7-16, 7-17):** every dormant roll entry (spot, survive, endure, ride, size-up, persuade, recall, sneak) and both reserved entries (fight, block) are called by the playtest rules chapter, so no Talent is dormant, and the packet's dormant tag goes; the fallbacks of (d) and (g) stay for any entry a later rule marks dormant again.

### OQ-34: When rule Talents that change eligibility or cost apply

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2 review round 1 (Codex finding 4); section 2.7; `data/character/talents.yaml` (`trigger_timing`).
- **Question:** Wide Awareness, Carrying Voice, Shoulder the Load, Quick Refit, and Rescue Ride triggered on "You Help", "You Cover", or "You take" an entry, then changed who qualifies or what the entry costs. Under Chapter 1 a soldier two Position steps away never qualifies to Help, so the trigger never occurred and the Talent did nothing. Hunter's Eye, Loose the Horse, Saddle Dodge, Sharp Call, Make Do, and Pry Loose change an attribute, gear item, cost, or permission in the same way.
- **Options:** (a) A "You declare" trigger, met when the soldier declares the entry, before its requirements, targets, pool, and cost are checked (Codex fix 2). (b) A general pre-declaration phase for every rule Talent (Codex fix 1). (c) Structured overrides stored on entries instead of triggers (Codex fix 3).
- **Provisional choice:** (a), used by every Talent that changes who qualifies, a target, an attribute, a gear item, or a cost. If the use still does not qualify after the effect applies, it is not taken and nothing is spent.
- **Why:** (a) is readable in the trigger text and closed. (b) would also move Talents that should trigger on events, such as Iron Nerve and Blade Discipline. (c) splits one Talent across two files. Spending nothing on a declaration that fails keeps the outcome a rule rather than a GM call.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-35: Actions that change no tracked value

- **Type:** Unresolved Major (it cannot be fixed without an ADR change; first logged as an ADR question)
- **Arose in:** Chapter 2 review round 1 (Codex finding 6; Opus judgment on OQ-27); Chapter 2 review round 2 (Codex finding 3, Major; Opus judgment on OQ-35); Chapter 2 review round 3 (`docs/reviews/02-character-creation-review-3.md`, finding 2, Major; `docs/reviews/02-character-creation-review-3-codex.md`, finding 1, Major). Section 2.9 (steps 1, 3, and 5, *No rulings*, and the PROVISIONAL (OQ-27) block); section 2.8, *Entries that need gear* (the Blade Set example); `data/character/action-catalog.yaml` (`tracked_values`, `change-canister`, `uncatalogued_actions`); Chapter 1 section 1.9 ("An action is either Help or one Action Catalog entry"); ADR-0003 item 9.
- **Related:** OQ-27.
- **Question:** ADR-0003 item 9 says an action outside the Catalog "uses the closest catalog action, or the attribute alone". Under OQ-27 an action that changes no tracked value gets no roll at all. Codex review 1 judged this makes ordinary consequential actions inert, for example a soldier bracing a collapsing beam so civilians can escape. Opus review 1 judged it sound but a narrowing of the ADR's text that belongs in writing.
  - **Phase 1 case (Opus review 3):** the gap is not only about scene values that later Operation Frame and hazard rules will create. In a Titan Engagement a soldier's action is Help or one Catalog entry (Chapter 1, section 1.9), and no tracked value or entry lets a soldier give a carried item to a comrade. Naming `gas-restore` reaches only `change-canister`, which needs the taker's own spare canister and changes the taker's own rig. Naming `gear-restore` reaches `field-repair`, which restores a rating or ends a Jam but does not replace a lost Blade Set. A soldier at Gas Rating 0, or whose last Blade Set is gone (section 2.8's example), cannot be resupplied by a comrade for the rest of the Titan Engagement, and *No rulings* bars the GM from allowing it. Mounting or dismounting a horse, which Saddle Dodge and Rescue Ride assume, has the same gap. Opus review 3 notes the canon weight: in Trost in 850, Armin gives Mikasa his gas.
- **Options:**
  - (a) Amend ADR-0003 item 9 to say actions outside the Catalog change only tracked values, and that every rule creating a consequential value must add it (Codex review 1 fix 3; Codex review 3 fix 1; Opus review 3 fix 1, which also adds to the Chapter 3 to 5 drafting briefs a check that every consequential act in their scope has a tracked value and an entry).
  - (b) A general obstacle entry with a player-chosen attribute, which brings back the judgment ADR-0003 forbids.
  - (c) The current text: a rule that creates a scene value names the attribute roll that changes it (`rule-named-value`), reaching "the attribute alone"; values no rule creates stay flavor. Codex review 3 fix 2, a general obstacle entry whose creating rule fixes its attribute, stakes, and tracked value before play, is what `rule-named-value` already does.
  - (d) Without the ADR change, close the Phase 1 gear case in Chapter 2's data: add a tracked value `item-give` ("give a carried item to a comrade") and an unrolled action `pass-item` with Help's requirement (the same Position or one step). Chapter 4 sets which items can be passed and whether a thrown item needs a roll (Opus review 3, fix 2).
  - (e) Keep (c), and record here that gear handover and mounting or dismounting a horse are tracked values and entries Chapter 4 must add before it can be Done, so the Phase 1 gap has an owner (Opus review 3, fix 3).
  - (f) (c) for Chapter 2, with (e) made concrete: Chapter 4, which owns carrying and horses (`docs/rules/PROGRESS.md`, chapter scope), adds `item-give`, a `pass-item` entry, and the mount and dismount values and entries to `action-catalog.yaml` as its own rows, and cannot be Done without them. OQ-35 then covers only scene values, and (a) or (c) is settled for those before the Operation Frame and Expedition rules are drafted.
- **Provisional choice:** (c), the current chapter text, unchanged, with no ADR change. Section 2.9 gives an action that changes no tracked value no roll and no effect, and no entry passes an item to a comrade or mounts or dismounts a horse.
- **Why deferred:** (a) changes an ADR, which a chapter fix cannot do. (c) meets ADR-0003's ban on judgment and still reaches "the attribute alone" whenever a rule creates the value, so the Codex example gets a roll once an Operation Frame or hazard creates a civilian-escape clock. How many scene values those rules need is theirs to decide. Settle (a) or (c) before the Operation Frame and Expedition rules are drafted.
- **Review round 2:** the reviews conflict. Opus review 2 judged (c) a sound provisional choice, correctly typed as an ADR question. Codex review 2 (finding 3, Major) judged it unsound while ADR-0003 item 9 reads as it does: an ordinary consequential action, such as bracing a collapsing beam, still gets no roll unless another rule has already created the value. Codex's fix 2, a general obstacle entry whose creating rule fixes the attribute and stakes before play, is what `rule-named-value` already does, so it does not reach the case. Codex's fix 1 is (a). Without an ADR change, (c) stays the choice most consistent with the ADRs, because the only other way to give such an action a roll is (b), which brings back the judgment ADR-0003 item 8 forbids. The finding is logged here as an Unresolved Major rather than fixed.
- **Review round 3:** both reviews carry the finding as a Major. Codex review 3 (finding 1) repeats round 2: (c) stays unsound while ADR-0003 item 9 reads as it does, and its example (a soldier bracing a collapsing beam during an evacuation) still gets no roll. Opus review 3 (finding 2) judges (c) the choice most consistent with ADR-0003 item 8 short of an ADR change, but finds this entry's scope note ("values no rule creates stay flavor") understated: the commonest uncatalogued act is a Phase 1 one, passing gas or a Blade Set to a comrade in a Titan Engagement (see *Question*). Chapter 2 has had its third and last review round (`docs/rules/PROGRESS.md` allows three), and the round-3 reviews must stay accurate reviews of the current text, so no option was applied. (a) still needs an ADR change. (d) needs none, but writes item rules that belong to Chapter 4 into Chapter 2's data. (f) is preferred: it gives the gear handover and horse cases an owner and a Done criterion in the chapter that owns carrying and horses, with no ADR change, and leaves the ADR decision to cover only scene values. Resolve the gear handover and horse cases before Chapter 4 is Done, and settle (a) or (c) before the Operation Frame and Expedition rules are drafted.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** (a) and (f): ADR-0003 item 9 is amended so that an action outside the Catalog changes only a tracked value and an act that changes none has no effect; Chapter 4 adds `item-give`, `pass-item`, and the mount and dismount move.
- **ADR:** ADR-0003 (item 9 rewritten; drafting requirement 12 added)
- **Revised by batch 9 (9-1, 9-12):** the rejected option "a general obstacle entry with a player-chosen attribute" is not adopted, but its worry no longer holds: GM judgment is valid (ADR-0024), so the bracing-beam example becomes a called Strength roll at needs 1 with the Circumstances and stakes the GM names. "No match means no effect" is withdrawn; "no match means a ruling" replaces it.

### OQ-36: Drives and once-per-Titan-Engagement Talents outside a Titan Engagement

- **Type:** PROVISIONAL
- **Arose in:** Chapter 2 review round 2 (Opus finding 2); sections 2.5 and 2.7; `data/character/enlistment.yaml` (`drive_rules.trigger_tests`, `drive_rules.outside_titan_engagement`); `data/character/talents.yaml` (`limit_terms.once_per_titan_engagement`).
- **Related:** OQ-08, OQ-10, OQ-23, OQ-28.
- **Question:** Ten Drives use a turn test, and turns exist only in a Titan Engagement. Prove Them Wrong names Positions, which also exist only there (OQ-10). Only Freedom can be met anywhere. Light Trigger, Well-Kept Rig, Blade Discipline, and Unshaken Command are "once per Titan Engagement" and were never usable outside one. Fear Rolls, Gas Rolls, and wear will also happen in Chases, on Legs, and in Operation Frames. ADR-0009 drains gas in Chases, and the glossary's Fear Roll example, a Titan seizing a comrade, is what a Chase at Grabbing Distance produces. The glossary's Drive entry has no scene limit. Should Drives and these Talents work outside a Titan Engagement, and who decides?
- **Options:**
  - (a) Widen the turn tests and the limit now to "a Titan Engagement or a Chase" (Opus review 2, fix 1).
  - (b) Keep the limit, and record it here (Opus fix 2).
  - (c) Give Drives a scene-based test, with "scene" defined by the Chase and Expedition rules (Opus fix 3).
  - (d) Keep the limit, with a closed hook: a later rule that gives soldiers turns outside a Titan Engagement may state that the turn tests count those turns, and a later rule that creates a procedure with a start and an end may state that "once per Titan Engagement" applies to it. Until a rule states that, the limit holds.
- **Provisional choice:** (d).
- **Why:**
  - (a) needs Chase turns, and the Chase rules have not defined whether a Chase has turns, rounds, or a most recent turn. Choosing now would decide the Chase's structure in Chapter 2.
  - (c) rests on "scene", which nothing defines. OQ-08 rejected that word for Help for the same reason.
  - (b) leaves later chapters no data hook, so extending a Drive to a Chase would mean editing Chapter 2's rules.
  - (d) follows OQ-08 (f): the rule that creates the situation states what applies, and if it says nothing the answer is closed. It adds no Chase structure and no GM ruling. Shield the Walls, rewritten to Draw Attention under OQ-23, is also a turn test.
  - Prove Them Wrong stays a Titan Engagement Drive unless a later rule adds a Chase state to its row. Unshaken Command's trigger names Positions, so it too needs a Titan Engagement whatever the limit says.
- **Simulator case:** Chapter 3's closed Fear Roll trigger list should mark which triggers can arise outside a Titan Engagement, so the simulator can measure how often each Drive can be met when a Fear Roll arrives (OQ-23 payoff note). The Chase rules should decide Light Trigger against ADR-0009's Chase gas.
- **Glossary note:** if (d) is confirmed, the Drive entry in `CONTEXT.md` could add "in a Titan Engagement, or where a later rule extends its trigger".
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (d), with Freedom's own-flight exception made explicit.
- **ADR:** none
- **Revised by batch 8 (8-39):** a Titan Engagement or Skirmish that begins inside a Leg or a Night Camp is its own procedure with its own once-per uses. A use in it does not spend the outer one, and the outer one does not spend it (OQ-166).

### OQ-37: Coordinated Help, roll order, and Covering in the Graduation Exam

- **Type:** Unresolved Major
- **Arose in:** Chapter 2 review round 3: `docs/reviews/02-character-creation-review-3.md`, finding 1 (Major), and `docs/reviews/02-character-creation-review-3-codex.md`, finding 2 (Major). Section 2.4, *How the Exam is played* ("Within a Trial, Cadets roll in the order the players choose"), *The three Trials* (the squad field exercise bullets), and the PROVISIONAL (OQ-22) block ("The share of Top 10 graduates is the same with the Exam and without it ... for any number of Cadets from 1 to 6. No Push policy tested raised it by more than 0.2 points"); `data/character/graduation-exam.yaml` (`use.decided_by`, `roll_order_within_a_trial`, `trials[squad-field-exercise].help` and `.cover`); `data/character/lifepath.yaml` (`group_choices`); OQ-22, *Why* ("Help and Covering are the only group levers") and *Simulator case*.
- **Related:** OQ-19, OQ-21, OQ-22, OQ-30.
- **Question:** OQ-22 made each Cadet's Merit depend only on their own rolls, but left three squad field exercise choices with the players: who Helps whom (up to 3 helpers on one roll), the roll order, and who Covers. Class Rank has one effect, Top 10 at Merit 6 or more, and that is the only route to an attribute of 6 (OQ-19, OQ-21). Every Cadet's Merit is known when these choices are made: the players vote to run the Exam before any Year 3 event, with Year 1 and Year 2 Merit known, and set Help and order after every Year 3 event. OQ-22's parity model gave each Cadet one helper in a cycle, varied order only as strongest or weakest first, and tested only Push policies. Should these choices stay open, and if they do, what does the chapter claim about parity?
  - **Opus review 3:** a simple aimed policy, a floor rather than an optimum (Cadets exactly 1 Merit short roll first and receive every Help, up to 3; only Cadets who cannot reach 6 or are safe by 2 or more Cover; only Cadets 2 or 3 short Push Trials 1 and 2), gives Top 10 7.61% with the Exam against 6.26% without for 4 Cadets, and 7.75% against 6.26% for 6. Help and order carry most of the rise, and Covering adds about 0.2 points. In a Squad of four player characters, the chance that at least one is Top 10 rises from about 23% to about 27%. A table with a Merit 4 or 5 Cadet after Year 2 has a mechanical reason to vote for the Exam.
  - **Codex review 3:** a Merit 5 Cadet with 5 base dice before Help, 1 Gear Die, and Stress 0, Pushing when short of 2 successes, reaches Top 10 without a Stress Response 63.35% of the time with one helper and 76.01% with three (1,000,000 trials). In a four-Cadet case where only that Cadet can reach Top 10, that adds 3.16 points to the per-Cadet Top 10 share.
- **Options:**
  - (a) Rolled order and cycle Help. Each Cadet rolls a D6 before each Trial, and Cadets roll highest first. Each Cadet Helps the next Cadet in that order, and the last Helps the first. Remove the order of Cadets in a Trial from `group_choices`. Simulated with the aimed Push and Cover policy: Top 10 6.44 / 6.24% for 2 Cadets, 6.48 / 6.20% for 4, and 6.40 / 6.23% for 6 (Opus review 3, fix 1).
  - (b) At most 1 helper per roll in the squad field exercise, with free choice otherwise. Simulated: 6.71 / 6.30% for 2 Cadets, 6.58 / 6.26% for 4, and 6.62 / 6.22% for 6 (Opus review 3, fix 2; Codex review 3, fix 1).
  - (c) Re-simulate targeted Help at each group size and Merit state, and retune the Trial until the Top 10 rate stays within the intended envelope (Codex review 3, fix 2).
  - (d) Keep the rule, and say plainly that the Exam lets the Squad raise a chosen Cadet's Class Rank. Correct the section 2.4 PROVISIONAL and OQ-22 to report coordinated play (about 7.6% Top 10 for four to six Cadets), record in OQ-21 that the Top 10 rate the Rookie calibration uses assumes no Exam, and move Help aimed at Cadets one Merit short from OQ-22's *Simulator case* into its *Why* (Opus review 3, fix 3; Codex review 3, fix 3).
  - (e) (a), and also take the vote to run the Exam before any Cadet rolls a Year 1 event, so that no Exam choice except a Push or a Cover is made with Merit known. A replacement character who takes the Exam alone (`use.applies_to`) decides before rolling their Lifepath. The simulator must confirm parity with the earlier vote.
- **Provisional choice:** the current chapter text, unchanged. Up to 3 other Cadets can Help a squad field exercise roll, and each Cadet Helps at most one roll. The players choose the roll order through `group_choices`. Only a Cadet who has not yet rolled can Cover (OQ-22 (p)). The players vote on the Exam before any Year 3 event. The section 2.4 PROVISIONAL states Top 10 parity for 1 to 6 Cadets with no policy qualifier.
- **Why deferred:** Chapter 2 has had its third and last review round (`docs/rules/PROGRESS.md` allows three), and the round-3 reviews must stay accurate reviews of the current text, so no fix was applied. No ADR blocks any option. It matters because ADR-0014 tunes against one creation distribution, and Top 10 is the only route to the 6 that ADR-0006 reserves for a key attribute. (a) and (b) both measured near parity. (a) came closest, removes a group choice instead of adding a limit, and still gives every Cadet Help. (c) is the check any option needs. (d) leaves a coordinated table's Top 10 rate about 1.4 points above the rate the calibration assumes, and makes voting for the optional prologue a strategy choice. (e) is preferred: it keeps (a)'s figures and also closes the vote, the one Exam choice (a) still lets the players make with Merit known. Resolve it in section 2.4, `graduation-exam.yaml`, `lifepath.yaml` `group_choices`, and OQ-22 before the simulator fixes the creation distribution that ADR-0014's cases use.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** (e), folded into OQ-22: vote before the Lifepath, rolled order, one cycle helper, Cover only by a Cadet who has not rolled.
- **ADR:** none

### OQ-38: Several promotions at once

- **Type:** Unresolved Major
- **Arose in:** Chapter 2 review round 3: `docs/reviews/02-character-creation-review-3-codex.md`, finding 3 (Major). Section 2.10, *Promotion*, steps 1, 2, and 4; `data/character/squadmates.yaml` (`promotion.timing`, `who_chooses`, `eligible`, `contested`, `no_squadmate`).
- **Related:** OQ-30, OQ-31.
- **Question:** Promotion happens at the end of the Titan Engagement for every player character who died or retired during it, so several can fall due at once. Step 2 settles two or more players wanting the same Squadmate with a D6 roll, but the chapter neither orders several replacements nor says what a player who loses that roll does: choose again from the Squadmates still in the Squad Pool, take the one left, or follow the no-Squadmate branch. Each promotion removes a Squadmate from the Squad Pool, so the order changes what later players can choose. Codex review 3's scenario: two player characters die in the same Titan Engagement, two Squadmates survive, and both players want the same one. One wins the D6 roll, and nothing says what the other does.
- **Options:**
  - (a) Roll once to order the affected players. Each then chooses in turn from the Squadmates still in the Squad Pool, and follows the no-Squadmate branch when none remain (Codex review 3, fix 1).
  - (b) Each affected player submits a ranked list of choices. Resolve each contested Squadmate with the D6 roll, and repeat with the players who lost until every player has a Squadmate or the no-Squadmate branch (Codex review 3, fix 2).
  - (c) Keep step 2's simultaneous choice and D6 roll, and add: every player who loses chooses again from the living Squadmates no player has taken, repeating step 2 with any other player who chooses the same one, and a player with none left follows step 4. Contested rolls use OQ-30's roll-off (one D6 per player, highest wins, ties roll again).
- **Provisional choice:** the current chapter text, unchanged. Step 2 and `promotion.contested` settle one contested Squadmate with a D6 roll. Neither says what a player who loses does, or in what order several promotions resolve.
- **Why deferred:** Chapter 2 has had its third and last review round, and the round-3 reviews must stay accurate reviews of the current text, so no fix was applied. No ADR blocks any option. ADR-0003 item 8 is why it matters: with no order, the table has no rule for which player gets the only suitable replacement, and the GM may not decide. All three options are closed. (c) is preferred: it changes nothing when no Squadmate is contested, adds no ordering roll and nothing to record, and uses the same roll-off as every other shared choice in the chapter (OQ-30). (a) settles every contest with one ordering roll and lets an early player take a Squadmate a later player wanted with no roll between them. (b) adds a ranked list to record. Resolve it in section 2.10 and `squadmates.yaml` `promotion` before Chapter 3 drafts death and Retirement, which create the triggers.
- **Chapter 3 note:** Chapter 3 was drafted with OQ-38 still open. It creates the death and Retirement triggers and sends every promotion to the last step of the end of a Titan Engagement (`data/harm/engagement-end.yaml`), after all deaths and Retirements of that fight are known. It does not order several promotions.
  - **Revised after Chapter 3 review round 1** (Opus finding 9, Minor; Codex finding 1, Major). OQ-38's own precondition, that it be resolved before Chapter 3 drafted death and Retirement, was not met. Chapter 3 now batches into its last end step every player character who died during the fight, died at its end, or retired. That includes a fifth Scar gained in the end care window (OQ-51, OQ-54). Several promotions at once are therefore more likely than when OQ-38 was deferred. Chapter 3 does not change Chapter 2's promotion rule. Option (c) should be carried into Chapter 2's next revision, before Chapter 5 drafts the Grab, which adds more same-fight deaths.
  - **Chapter 3 review round 2** (Codex finding 1, Major; Opus finding 5, Minor).
    - Codex found that Chapter 3's last end step (now step 9) still cannot finish two contested promotions.
    - Opus added a timing gap. Outside a Titan Engagement Chapter 2 promotes "immediately", so two player characters who die at one day's Death Rolls also fall due together. A player character who dies at step 2 of a day passing is promoted at once, while one who retires that night waits for the day's last step (OQ-51).
    - Codex fix 2, writing option (c) into Chapter 3's last end step as a temporary override, was not taken. It would add a rule to a closed Chapter 2 procedure, and it would still not cover promotions outside a Titan Engagement.
    - The entry stays an Unresolved Major. Chapter 2's next revision should adopt (c) for every set of promotions that fall due together. It should also state that a promotion due while a day passes waits for that day's last step, matching Retirement.
- **Round-3 note:** `docs/reviews/03-harm-and-mind-review-3.md` M3: Step 9 still sends every death and Retirement of a fight to one promotion step that cannot finish two contested promotions, so this stays an Unresolved Major, and option (c) should head Chapter 2's reopening list ahead of Chapter 5's Grab.
- **Round-3 note:** `docs/reviews/03-harm-and-mind-review-3-codex.md` M1: Beyond the missing next step for the player who loses the contest, a player character who fails a step-6 Death Roll has two promotion times (Chapter 2 promotes "immediately" after a death outside a Titan Engagement, while step 9 waits), and the fixes are option (c) for every promotion batch in a reopened Chapter 2 with Chapter 3's end-step deaths defined as part of that batch, or a Chapter 3 retry procedure and timing override that records it supersedes Chapter 2.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** (c): simultaneous choice, a D6 roll-off per contested Squadmate, and losers choose again from the untaken living Squadmates. Every death of a fight or its end steps and every Retirement due there is one step-9 batch; five-Scar soldiers retire and retiring Squadmates leave the Squad Pool before anyone chooses.
- **ADR:** none

### OQ-39: Kinds of harm, Titan attacks, and damage at 0 Health

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, Harm and Mind, section 3.1; `data/harm/health.yaml` (`harm_kinds`, `titan_attacks`).
- **Revised:** after Chapter 3 review round 1 (Opus finding 1, Major).
  - **The problem.** The draft made "every harm a Titan behavior inflicts" a Titan attack, which is always a Critical Injury that lands unless dodged. It also named being devoured as a rule that names death. If Chapter 5 or Chapter 6 wrote the devour as a behavior with a Severity, the two closed rules both claimed it. Being eaten became a torso Critical Injury that never kills by itself, and possibly one the victim could dodge.
  - **The change.** A Titan attack is now the harm a Behavior Table entry inflicts when a Titan's card resolves it. The Grab countdown's lift and devour (ADR-0015) are Grab procedure steps. They are never Behavior Table entries, have no Severity, and are answered by no Reaction, and the devour names death (`titan_attacks.grab_countdown`).
  - **The reviews.** The Codex review judged the original choice sound. The Opus fix was taken because the devour case had two closed rules and no way to pick between them (ADR-0003 item 8).
- **Revised after review round 2** (Opus finding 4, Minor). "The harm a Behavior Table entry inflicts" did not say whether it covered harm that follows through another rule, such as a Down soldier falling from their anchor or a Jam. A Titan attack is now only the harm the entry itself names. Harm another rule causes as a result is the kind that rule names, so Chapter 4's fall damage applies whatever made the soldier fall. This keeps the "is it an attack" judgment that (b) was rejected for out of chain cases (Opus review 2, fix 1).
- **Question:** ADR-0005 has Titan attacks skip Health and inflict Critical Injuries directly, and the glossary has reaching 0 Health inflict an immediate Critical Injury. Nothing says what else lowers Health, whether any Titan behavior can take Health instead (debris or a shockwave, for example), what more damage does to a soldier already at 0 Health, or whether the Grab's devour is a Titan attack.
- **Options:**
  - (a) Three kinds of harm: damage, Critical Injury, and death. Every harm a Behavior Table entry inflicts when a card resolves it is a Titan attack, and so a Critical Injury. The Grab countdown's lift and devour are Grab procedure steps, not Titan attacks, and the devour names death. Damage at 0 Health gives another Critical Injury.
  - (b) As (a), but Chapter 6 may mark indirect harm from a Titan behavior as damage.
  - (c) Damage at 0 Health does nothing more.
  - (d) Drop Health, and make Down a Critical Injury result only (fable final review, Minor finding on Health).
  - (e) Define a Titan attack by its data, a behavior with a Severity and an Injury Location, and let Chapters 5 and 6 name death for a closed list of behaviors, such as the devour or a Large Titan's bite (Opus review 1, fix 2).
  - (f) Keep the rule absolute, and make the devour an `instant_death` Critical Injury with no Reaction, named by the Grab (Opus review 1, fix 3).
- **Provisional choice:** (a).
- **Why:**
  - (a) reads ADR-0005 with no exceptions for any Behavior Table entry, so no entry needs a judgment about whether its harm is "an attack".
  - The Grab countdown comes from ADR-0015's count of the victim's turns, not from a card. Chapter 1's Reaction answers a card that resolves a behavior (section 1.9), so no Reaction can answer the lift or the devour without a new rule.
  - (b) reopens the "is it an attack" judgment for every entry.
  - (c) would make a soldier at 0 Health immune to falls, the one Phase 1 source of damage.
  - (d) contradicts the glossary's Health and Down entries.
  - (e) lets a Behavior Table entry kill outright. ADR-0005 has Titan attacks inflict Critical Injuries directly, so a behavior that kills with no Critical Injury, such as a bite, would need an ADR-0005 change.
  - (f) routes death through a Critical Injury table for no gain, and its "instant death" row would need a Severity-free exception to ADR-0015 anyway.
  - Consequence: in Phase 1, Health matters only to damage rules, which means Chapter 4's falls. Chapter 2 review round 3 noted that some Specialties start at Health 2. Chapter 4 should size fall damage against Health 2 to 5.
  - Consequence: Chapter 5 must write the lift and the devour as Grab procedure steps, never as Behavior Table entries, and Chapter 6 must not list a killing behavior.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a) as revised: three kinds of harm, a Titan attack is only the harm a Behavior Table entry names, the lift and devour are Grab steps, damage at 0 Health gives another Critical Injury.
- **ADR:** none
- **Revised by owner decision:** Health boxes. Damage marks only the boxes not crossed off by untreated Critical Injuries.

### OQ-40: Restoring Health

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, sections 3.1 and 3.5; `data/harm/health.yaml` (`restoring`); `data/harm/treat-injury.yaml` (`uses`).
- **Question:** Nothing sets how Health lost comes back.
- **Options:**
  - (a) Treat Injury restores 1 Health per success, only to a Down soldier at 0 Health. All Health lost returns each time a day passes.
  - (b) Treat Injury restores Health to any soldier with Health lost.
  - (c) Health lost returns at the end of each Titan Engagement.
  - (d) 1 Health returns per day.
- **Provisional choice:** (a).
- **Why:**
  - Both parent games restore Health by first aid only to a character who has collapsed. That keeps Treat Injury aimed at getting comrades up.
  - (b) turns a medic's action into a Health refill during every fight.
  - (c) makes damage meaningless between Titan Engagements on the same Leg.
  - (d) leaves a Health 2 soldier who fell twice at 0 Health for several days.
  - A day is the one unit of field time ADR-0009 names (OQ-53).
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): revive and a day passing are the only ways Health lost comes back.
- **ADR:** none
- **Revised by owner decision:** Health boxes. A day restores Health lost to damage only; crossed-off boxes come back by treating or healing, and revive needs Health lost to damage above 0.

### OQ-41: The Injury Location roll

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.2; `data/harm/critical-injuries.yaml` (`injury_location_table`, `held_injuries.sides`).
- **Question:** The glossary lists four Injury Locations, and the design summary picks one with a D6. Nothing gives the weights or says whether the side of the body counts.
- **Options:**
  - (a) 1 to 2 arm, 3 to 4 leg, 5 torso, 6 head, with no sides tracked.
  - (b) Equal weights, re-rolling two blank faces.
  - (c) Six faces (left arm, right arm, left leg, right leg, torso, head), each side its own Injury Location.
- **Provisional choice:** (a).
- **Why:**
  - Arms and legs have the least lethal tables. With (a), a first Critical Injury at a rolled Injury Location is lethal 15.3% of the time.
  - (b) adds a re-roll. (c) adds Injury Locations the glossary does not list, and halves how often worsening applies.
  - Titan attacks with a fixed Injury Location (the Grab at the torso) come from Chapter 6. The weights matter only for rolled Titan attacks and for damage at 0 Health.
  - Consequence of untracked sides: a row with permanent effects can be gained only once per soldier (OQ-42, `repeat_row`).
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a): 1 to 2 arm, 3 to 4 leg, 5 torso, 6 head, no sides.
- **ADR:** none
- **Revised by batch 7 (7-4):** option (c), the six-part body, is now taken (ADR-0017): 1 left arm, 2 right arm, 3 left leg, 4 right leg, 5 torso, 6 head, with every location weight unchanged and worsening counted by location and side. The reason (c) was refused, that six locations halve how often worsening applies to limbs, is now the point: it stops the same limb from being lost twice, and the small fall in deaths goes in the direction OQ-132 needed (OQ-137).

### OQ-42: Critical Injury tables and worsening

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, sections 3.2 and 3.7; `data/harm/critical-injuries.yaml` (`gaining`, `worsening`, `tables`).
- **Revised:** after Chapter 3 review round 1.
  - **Permanent effects from the start** (Opus finding 2, Major). Lost Arm, Lost Leg, and Lost Eye had `effects: []` and permanent effects that began only on healing. A soldier who had just lost an arm therefore struck at full dice for 28 days, while the lighter rows below it carried penalties. `permanent_effects` now apply from the moment the row is gained and stay after it heals.
  - **Bleeding rows keep a penalty** (Opus finding 2, fix 3). Internal Bleeding, Torn Open, and Bleeding Inside the Skull had no effects, so once treated they cost the soldier nothing while held. They now carry penalties that stay while held:
    - Internal Bleeding: 1 die on `fly`, `dodge`, and `break-free`.
    - Torn Open: 2 dice on the same entries.
    - Bleeding Inside the Skull: 1 die on `read`, `break-attention`, and `fly`.

    None of these rows is reachable by the crushing Critical Injury, so the Grab odds in section 3.7 do not change.
  - **Worsening keeps anatomy** (Opus finding 15 and Codex finding 3, Major). Worsening counted only held Critical Injuries, so a healed Lost Arm reset the arm Injury Location, and the same arm could be lost again and again, stacking 4 dice of permanent penalty. Now:
    - A healed Critical Injury whose row has permanent effects keeps counting toward worsening at its Injury Location.
    - Each row with permanent effects can be gained once. A repeat uses its `repeat_row`: Mangled Arm, Shattered Knee, or Fractured Skull.
  - **Stress gains once** (Opus finding 11). Winded's and Dazed's Stress gain is now defined in `effect-types.yaml` as gained once when the Critical Injury is recorded. It no longer rests on a YAML comment.
  - **Figures corrected** (Opus finding 10).
    - Down on a first Critical Injury at a rolled Injury Location is 23/216 = 10.6%, not 10.7%. The Codex review's simulation gave 10.668%, which rounds to 10.7%, but the exact enumeration governs.
    - Torso with two held now reads "lethal 50.0% and instant death 8.3%": 58.3% of results kill or can kill.
    - Head with two held is added: lethal 63.9% and instant death 8.3%.
  - **Lethality framed against treatment** (Opus finding 3, fix 3). See section 3.2 and OQ-54.
- **Question:** The glossary labels each Critical Injury with whether it puts the soldier Down, whether it is lethal and how fast, its effect, and its healing time. It also says a second Critical Injury at the same Injury Location lands on a worse result. The design summary rolls 2D6 on each Injury Location's table. ADR-0015 says the Grab's crushing Critical Injury cannot be lethal. Nothing sets the rows, how much worse a second result is, how "cannot be lethal" reads a lethal row, when permanent effects start, or what a healed permanent injury does to later rolls.
- **Options:**
  - Worsening:
    - (a) +2 per Critical Injury held at that Injury Location, treated or not.
    - (b) +3 per held Critical Injury.
    - (c) Roll 3D6 and keep the highest two.
    - (d) Only untreated Critical Injuries count.
  - Cannot be lethal:
    - (e) Each table names a non-lethal cap row, used in place of any lethal or instant-death row.
    - (f) Re-roll a lethal result.
    - (g) Keep the row and ignore its lethal field.
  - Instant death:
    - (h) Only at totals a first Critical Injury at that Injury Location cannot reach.
    - (i) On a roll of 12.
  - Healed permanent injuries:
    - (j) A healed row with permanent effects keeps counting toward worsening, and a repeat of it uses a named `repeat_row` (Opus review 1, finding 15, fix 2; Codex review 1, fix 2).
    - (k) Track destroyed anatomy by side, with a replacement rule for each result a soldier can no longer suffer (Codex review 1, fix 1).
    - (l) Rename permanent rows as impairments that can recur (Codex review 1, fix 3).
  - Permanent effects:
    - (m) Apply from the moment the row is gained (Opus review 1, finding 2, fix 1 and fix 2).
    - (n) Apply only after healing.
- **Provisional choice:** (a), (e), (h), (j), and (m), with the rows in the file.
  - Effects are 1- or 2-die penalties on named Catalog entries or a Stress gain.
  - A torso row puts the soldier Down only on the cap row and on fast lethal rows, and a head row from 8 up.
  - Lost Arm, Lost Leg, and Lost Eye leave permanent effects that start when gained.
  - "Worse result" means the roll is made with the worsening bonus. It does not mean the new row is compared with the earlier one (Opus finding 15, fix 1).
- **Why:**
  - (a) keeps every total on the table and makes a second Critical Injury a real escalation (an arm Critical Injury is lethal 16.7% of the time with none held, 41.7% with one) without making a third certain death. (b) makes a second one lethal more than half the time. (c) is slower to read at the table and in Foundry. (d) lets treatment erase the history the glossary counts.
  - (e) gives ADR-0015's rule one closed reading and a known Down chance for Chapter 5 (section 3.7). (f) adds rolls. (g) leaves rows such as Lost Arm Down with no time limit.
  - (h) keeps harm "deadly but earned": no first Critical Injury at an Injury Location kills outright. (i) would make a fixed head attack fatal 1 time in 36 with no earlier harm.
  - (j) keeps the location history the glossary's "worse result" needs without tracking sides, which OQ-41 rejected. (k) needs sides. (l) lets a soldier lose the same arm twice.
  - (m) gives the worst rows the worst penalties at once. (n) left them lighter than the rows below them for 28 days.
  - Penalties name Catalog entries rather than attributes, so no arm penalty to strikes ever touches a Death Roll, which is also a Strength roll.
- **Glossary note:** if (j) is confirmed, the Critical Injury entry in `CONTEXT.md` could read "a later injury to the same location is rolled worse". Codex review round 2 (finding 7, Minor) raised the same mismatch. Its fix 2 was not taken: flooring the new row one row worse than the worst injury counting there changes every figure in this entry and in section 3.7. Its fix 1 is this glossary change, which belongs to the owner of `CONTEXT.md`.
- **Simulator case:**
  - Run ADR-0014's "about 1 PC Critical Injury" per Expedition and "a PC dies every 3 to 4 missions" with these rows and Chapter 6's Injury Locations before changing any row.
  - Of the 15.3 points of lethal first results, 14.4 have an `engagement` limit and 0.9 a `turn` limit. Under OQ-54 (b), if nobody treats them during the fight or with an aftermath roll (OQ-57), the `engagement` rows alone kill on 8.5% of first Critical Injuries at a rolled Injury Location at Strength 3 and 7.1% at Strength 4. With one attempt, Opus review round 2 measured about 1.0% with a Rookie Medic and 2.8% with an untrained comrade. The PC death target therefore depends on how often a comrade treats during the fight or is within one step when it ends.
  - The Grab case should use the crushing Critical Injury's Down chance (16.7%, 41.7%, and 72.2% with 0, 1, and 2 torso Critical Injuries held) and the Break Free penalty spread in section 3.7.
- **Review round 1 Grab models** (not yet the simulator). Section 3.7 no longer quotes their comrades-close figures. They freed the soldier at H = 3 to 5 successes on the hand, with two rescue actions per comrade, and ADR-0015's Toughness 1 hand allows only H = 1 or 2 unless Chapter 5 adds a threshold (Opus review round 2, finding 2, Major):
  - **Opus model.** Rookie Strength 4, Talent 1, Blade Set 1; witnesses at Stress 2 and Resolve 3; comrades strike the Toughness 1 hand; 60,000 trials per cell. N is the successes Break Free needs, and H is the successes on the hand that free the soldier.
    - N = 3: a lone Rookie dies 59.6%, or 40.8% if the crushing injury never made the soldier Down. With one torso Critical Injury already held it is 73.7%, and with two, 88.0%. With two comrades close and H = 1, 3, or 5: 0.3%, 4.7%, and 17.4%. With no Fear Rolls at H = 3: 0.6%.
    - N = 2: alone 34%, and with two comrades close 0.1%, 2.8%, and 9.8%.
    - An untrained Strength 3 soldier alone dies 48% at N = 2 and 77% at N = 3.
  - **Codex model.** A Rookie Brawler at N = 3 dies alone 60.1% with two Break Free actions before the devour, and 76.8% with one. Two rescuers who each succeed 60% of the time, after witness Fear Roll losses, give about 32.7%.
  - **Conclusion.** The alone target is reachable. The comrades-close target depends on Chapter 5's reach, hand, and lift rules. Opus fix 3 (make the torso cap row a Break Free penalty instead of Down) was not taken: Chapter 5 has not set Break Free, and the Down row is the lever on the alone target.
- **Review round 2 Grab models** (not yet the simulator), which section 3.7 summarizes. H is 1 or 2 (a Toughness 1 hand is Wounded at 1 success and Broken at 2, ADR-0007), and Break Free needs N = 3.
  - **Opus model** (60,000 trials per cell). The victim is a Rookie with two Break Free turns. Rescuers strike the hand at Strength 4, Talent 1, Blade Set 1, and Stress 2. Witnesses are at Resolve 3.
    - Two rescue actions per comrade: two comrades 0.3% (H = 1) and 2.7% (H = 2); one comrade 4.5% and 20.2%. With two comrades close, 1 in 3 is out of reach.
    - One rescue action per comrade, two comrades, witnesses at Stress 2: 33.5% with Fear Rolls and 7.3% without at H = 2; 19.8% and 0.9% at H = 1.
    - Witness Stress 1, 2, and 3 at H = 2: 26.0%, 33.5%, and 42.1% at Resolve 3; 34.7%, 42.5%, and 51.8% at Resolve 2 (one Grief). At H = 1: 10.5%, 19.8%, and 32.4%; 19.6%, 31.4%, and 45.2%.
    - Alone: 60.6% at N = 3 and 34.4% at N = 2; 74.3% and 88.3% with one and two torso Critical Injuries held. Replacing the crushing injury's Down results with Crushed Ribs gives 53.9%, so the Down row's size depends on its replacement: about 7 points here, about 19 in round 1's model.
  - **Codex model** (300,000 trials per cell, round 1 Rookie assumptions). Alone: 60.3% with two Break Free turns and 76.7% with one. One rescuer with one hand strike after the lift, after the witness Fear Roll, while the victim keeps both Break Free turns: 33.9%.
  - **Conclusion.** Both targets remain reachable. The comrades-close target needs Chapter 5 to leave each comrade about one rescue action, and then depends on witness Fear Rolls, Squad Stress, and Grief (OQ-50).
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep every row, the +2 worsening, the non-lethal caps, and the repeat rows; if PC death runs low in the simulator, the first lever is the arm and leg 11 and 12 rows to `turn` limits.
- **ADR:** none
- **Revised by owner decision:** Health boxes. Injuries before Down now follow Health (mean 1.89 at Health 2 to 3.70 at Health 5); first-injury Down odds are unchanged.
- **Revised by batch 7 (7-5, 7-6):** every row keeps its tuned fields and gains one name per Injury Type (Crush, Bite, Burn, Cut, Pierce); the Bite type's rider sets the arm and leg 12 and 13+ rows to a turn limit; the lost-limb rows are graded (one arm, both arms, one leg, both legs) as `lost_limb_riders` states; `repeat_row` applies per side for limbs and as before for the eye (OQ-137, ADR-0017). Option (k), destroyed anatomy by side, is now taken through the sided location.

### OQ-43: Lethal time limits and Death Roll outcomes

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.4; `data/harm/death-rolls.yaml`.
- **Related:** OQ-03, OQ-11, OQ-15, OQ-54, OQ-56.
- **Revised:** after Chapter 3 review round 1.
  - Option (g)'s figure corrected from 5.9% to 2.9% (Opus finding 10). 5.9% was the figure for option (e).
  - An `engagement` limit now runs out before the end-of-Engagement care window (OQ-54).
  - A soldier who has left a Titan Engagement still under way keeps taking turns in it, so a `turn` limit keeps running out (OQ-56).
- **Question:** The glossary makes a Death Roll (Strength, no Push) each time a lethal Critical Injury's time limit runs out, and OQ-03 left out Stress Dice and Help. Nothing sets the units of a time limit, what surviving a Death Roll does, or how a dying soldier with no medic ever stops rolling.
- **Options:**
  - Units:
    - (a) Turn, engagement, and day.
    - (b) Rounds and scenes.
  - A turn limit runs out:
    - (c) At the end of each of the soldier's turns, starting with the first turn that begins after the Critical Injury.
    - (d) At the end of each round.
  - Outcomes:
    - (e) 0 successes dies; 1 lives and the limit runs out again; 2 or more lives and the limit slows one step.
    - (f) Any success lives and stabilizes.
    - (g) Any success lives, and only Treat Injury stabilizes.
    - (h) Three successes stabilize.
  - Outside a Titan Engagement:
    - (i) An immediate care window and one Death Roll, after which a survived turn or engagement limit becomes day.
- **Provisional choice:** (a), (c), (e), and (i).
- **Why:**
  - "Scene" is undefined, and OQ-08 rejected it for the same reason.
  - (c) uses the clock that ADR-0015's Grab and OQ-09's spent turns already count, so every turn counts, including a Down soldier's. (d) would make a soldier hurt by the round's last card roll before any comrade could act.
  - (f) makes a lethal Critical Injury survivable 42.1% of the time at Strength 3 with no one's help, which removes the reason to treat it.
  - (g) leaves a lone Strength 3 soldier with a turn limit and a Death Roll penalty of 1 alive after three turns only 2.9% of the time with no way to improve it, and Hard to Kill only delays death.
  - (h) needs 3 successes, which 4 dice reach 1.6% of the time.
  - (e) gives a self-rescue that grows with Strength and Hard to Kill (2 or more successes: 13.2% with 4 dice, 26.3% with 6) while keeping a comrade with a medical kit the reliable answer.
  - (i) keeps harm outside a Titan Engagement closed without inventing turns there. Its care window comes before the Death Roll, unlike the end of a Titan Engagement (OQ-54), because no fight comes first in which a comrade could have treated the harm.
- **Simulator case:** the "PC dies every 3 to 4 missions" target, with Hard to Kill at levels 0 to 3 (OQ-28), and with and without a Medic in the Squad.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (c), (e), (i).
- **ADR:** none

### OQ-44: Treat Injury and care windows

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.5; `data/harm/treat-injury.yaml`; `data/character/action-catalog.yaml` (`treat-injury`, which leaves its requirements, needs, and Help outside a Titan Engagement to Chapter 3).
- **Related:** OQ-06, OQ-08, OQ-10, OQ-54, OQ-56.
- **Revised:** after Chapter 3 review round 1.
  - **Window moved after the Death Rolls** (Opus finding 3, Major). With the end-of-Engagement care window before the end-of-fight Death Rolls, five soldiers with Wits 2 and no kit left an `engagement` Critical Injury untreated only 3.2% of the time, and it killed a Strength 3 soldier 1.8% of the time. With two able soldiers it was 27.7% untreated and 16.0% dead. `engagement` limits were nearly harmless, which put almost all of ADR-0014's PC death target on the Grab. The window now comes after those Death Rolls (OQ-54).
  - **Scope, Help, and Covering stated** (Opus finding 13). Every window has a scope. A soldier who has already made or Helped a roll in the window can still Cover.
  - **Careful Nursing** (Codex finding 2, Major; Opus finding 11). Careful Nursing now halves healing time only for a comrade's Critical Injury, as the closed Chapter 2 Talent's trigger says. The draft had widened it to self-treatment.
  - **Same Position after leaving** (OQ-56). Two soldiers who have both left a Titan Engagement still under way count as holding the same Position.
- **Revised after review round 2** (Opus finding 5, Minor; Codex finding 5, Minor).
  - **Scope.** The outside-harm window's scope is now the soldiers the rule that caused the harm names as taking part. If it names none, the scope is every soldier in the Squad on the same Expedition as a harmed soldier. The day window's scope is every soldier on that Expedition. No window now lets a soldier at headquarters treat someone on an Expedition, the reason (k) was rejected, and an absent medic can no longer treat a rider in a Chase.
  - **One window per event.** An event that harms several soldiers opens one window. It is held as soon as the event is resolved, unless the rule that caused the harm names a later point in its own procedure, such as the end of a Chase.
  - **No retry through a new event.** A roll in an outside-harm window may only treat a Critical Injury that window's event gave, or revive a soldier it made Down. A second rider's fall no longer reopens the first patient. Opus fix 2's retry limit (no second roll on a patient until a day passes) was not taken: it would also bar a treater from a new Critical Injury on the same patient, and it needs a record.
  - **Aftermath rolls** (OQ-57, Opus finding 1, Major) are a second way to roll Treat Injury outside a Titan Engagement, before the end-of-fight Death Rolls.
  - **Help and Covering between soldiers who left** (OQ-56).
- **Question:** What Treat Injury needs and does, whom it can treat and from where, and, as Chapter 1 section 1.1 item 4 and OQ-08 (f) require, how often it can be tried and whether it can be Helped outside a Titan Engagement.
- **Options:**
  - Uses:
    - (a) Revive (1 Health per success) or treat (one Critical Injury becomes treated, and a lethal one is stabilized), each needing 1 success.
    - (b) Successes needed rise with the time limit.
    - (c) Each success slows a lethal limit one step instead of stabilizing it.
  - Failure:
    - (d) Nothing happens.
    - (e) The time limit speeds up one step.
  - Self:
    - (f) Treat only, at a 2-dice penalty.
    - (g) Not allowed.
  - Outside a Titan Engagement:
    - (h) Care windows at the end of a Titan Engagement, at once after harm outside one, and each day, with one roll or one Help per soldier.
    - (i) Any number of rolls between Titan Engagements.
  - Window scope:
    - (j) End of a Titan Engagement: soldiers in the Squad who held a Position at any point during it. Other windows: every soldier in the Squad, which the Downtime rules may narrow in Downtime (Opus review 1, fix 1).
    - (k) Every soldier in the Squad for every window.
    - (o) As (j) for the end of a Titan Engagement. Outside-harm windows: one per event, with the scope the calling rule names, or else every soldier in the Squad on the same Expedition, and rolls only on that event's harm. Day windows: every soldier on that Expedition (Opus review 2, fixes 1 and 2; Codex review 2, fix 1).
  - Covering in a window:
    - (l) Any soldier who qualifies to Help can Cover, even after making or Helping a roll (Opus review 1, fix 2).
    - (m) Only a soldier who has not yet rolled or Helped.
  - Care-window treatment of a lethal Critical Injury:
    - (n) Slows its limit one step instead of stabilizing it, or needs 2 successes (Opus review 1, finding 3, fix 2).
- **Provisional choice:** (a), (d), (f), (h), (o), and (l). In a Titan Engagement the patient holds the treater's Position, matching Lift Comrade.
- **Why:**
  - (a) is one test per use. It is what ADR-0014's "comrades close" needs: a comrade at the same Position can save a dying soldier on their own turn. (b) and (c) add tracking to every lethal row.
  - (e) makes an attempt worse than none, which discourages the untrained soldier ADR-0006 says can attempt anything.
  - (g) leaves a soldier alone with a Punctured Lung nothing to do.
  - (i) makes every lethal limit after the fight harmless by allowing retries until one succeeds. (h) gives each soldier one attempt, so Talents, Help, and the Squad's size matter for `day` limits and harm outside a Titan Engagement.
  - The end-of-Engagement window saves soldiers from their `day` limits, but no longer from the end-of-fight Death Roll, which only treatment during the fight or an aftermath roll prevents (OQ-54, OQ-57).
  - (n) was not taken: it changes a care-window success into a partial one, and moving the window after the Death Rolls reaches the same aim with no new outcome to track.
  - (j) uses the same record as OQ-10 (f), so a Squadmate who never entered the fight takes no part in its window. (k) lets a soldier at headquarters treat someone on an Expedition. (o) applies the same reasoning to the other windows, and one window per event stops a second harm from reopening rolls on the first.
  - (l) matches Chapter 1's Cover test outside a Titan Engagement ("qualifies to Help that roll"), which asks about eligibility, not about what the soldier has already spent. (m) would make the order of rolls decide who can Cover.
  - Careful Nursing: Chapter 2 is closed, and Chapter 3 may not widen a Talent's trigger (Codex finding 2, fix 1).
- **Round-3 note:** `docs/reviews/03-harm-and-mind-review-3-codex.md` M2: Every window limits rollers and helpers to its scope, but `care_windows.who_rolls` allows "any use and patient" and `patients.comrade` is any living soldier, so in the engagement-end and day windows a roller in scope can treat or revive a patient outside it (a soldier at headquarters, or one on another Expedition), and the fixes are to require every care-window patient to be in that window's scope or to give each window its own `patients` field; it stays open as an Unresolved Major.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep the uses, costs, windows, and event-only retry; every care-window patient must be a living soldier in that window's scope.
- **ADR:** none
- **Revised by owner decision:** Health boxes. Revive's patient is a Down soldier at 0 current Health with Health lost to damage above 0.

### OQ-45: Down

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.3; `data/harm/down.yaml`.
- **Related:** OQ-03 option (e), OQ-09, OQ-18.
- **Revised after review round 2** (Opus finding 3, Major; Codex finding 2, Major). The two reviews found two sides of one gap.
  - **The problem.** `becoming_down_mid_round` took "any action they still hold this round", including the action of a turn not yet taken. `after_ending` gave "the soldier's next turn" its move and action with no condition, even a turn a Reaction had already spent. A soldier Down before their turn and treated before it had two readings, and so did a later dodge that round.
  - **The change.**
    - Becoming Down takes the unused action of a turn that has begun or ended this round. That action counts as spent, including when a Reaction looks for a turn whose move and action are both unspent.
    - A turn that has not come up keeps its move and action if Down has ended by then (Opus fix 1). A same-round treatment is worth the patient's action.
    - Ending Down restores nothing already spent, so a turn a Reaction or a result spent stays spent (Codex fix 1).
    - A turn that comes up while the soldier is Down has no action, even if Down ends during it.
  - **Not taken.** Opus fix 2, taking this round's action whether or not the turn has come up, makes a treatment before the patient's turn worth nothing that round.
- **Question:** The glossary's Down soldier "can do little more than crawl". Chapter 1 left to this chapter whether a Down soldier can make a Reaction (OQ-09) and whether they roll Stress Dice (OQ-03 (e)); it already bars Help and Covering. The glossary labels a Critical Injury with whether it puts the soldier Down, but its Down entry lists only 0 Health and three untreated Critical Injuries.
- **Options:**
  - Conditions: (a) 0 Health, three untreated Critical Injuries, or an untreated Critical Injury whose row says Down until treated. (b) Only the two glossary conditions, with "puts the soldier Down" meaning the row takes the soldier to 0 Health.
  - Turn: (c) move only, as Chapter 5 allows. (d) No move and no action. (e) One action from a short list.
  - Reactions: (f) none. (g) A dodge at 1 base die (Chapter 1 review round 2, finding 2, fix 3).
  - Fear Rolls: (h) none. (i) As normal.
  - Stress Dice: (j) a Down soldier makes no attribute roll but the Death Roll, so no Stress Dice. (k) A state exception to Stress Dice, as OQ-03 (e).
  - This round's turns: (l) becoming Down takes the unused action of a turn already begun or ended, a turn still to come keeps its action if Down has ended, and ending Down restores nothing spent (Opus review 2, fix 1; Codex review 2, fix 1). (m) Becoming Down takes this round's action whether or not the turn has come up (Opus review 2, fix 2).
- **Provisional choice:** (a), (c), (f), (h), (j), and (l).
- **Why:**
  - (a) gives the glossary's Down label a reading that never touches Health, which ADR-0005 keeps apart from Titan attacks. (b) would make a Titan attack change Health.
  - (c) matches "crawl" and leaves movement to the chapter that owns Positions. (d) removes crawling. (e) contradicts "little more than crawl".
  - (g) makes a crawling soldier dodge a stomp 1 time in 6, which Chapter 1 review round 2 judged hard to justify.
  - (h) follows both parent games, which stop fear rolls for a collapsed character, and reduces the Fear Roll load the codex final review flagged (finding 11).
  - (j) needs no Chapter 1 change. (k) would add a state-based exclusion that `roll_exceptions` in `data/core/dice-pool.yaml` cannot express.
  - Consequence: a Down soldier takes every Titan attack that reaches them, so Chapter 5's decision on whether the Attention Ladder can choose a Down soldier bears on ADR-0014's PC death target.
  - Review round 1 judged this entry sound in both reviews. The soldier who leaves a Titan Engagement while it goes on is OQ-56.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep as drafted, with `forbids: [push, help, cover, reaction]` under OQ-18; the action of a turn that begins while Down counts as spent for every rule that asks.
- **ADR:** none
- **Revised by owner decision:** Health boxes. Down has two conditions, 0 current Health and a Down row; the three-untreated condition is deleted.

### OQ-46: Results that spend a turn or action, or forbid Reactions

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.9; `data/harm/effect-types.yaml` (`spend-next-turn`, `spend-next-action`, `no-reactions`); Chapter 1 review round 3, Minor finding 5.
- **Related:** OQ-09, OQ-16, OQ-17, OQ-18.
- **Revised:** after Chapter 3 review round 1 (Opus finding 6, Major).
  - **The problem.** The ban on Reactions lasted until the end of the turn its row spent, so its length depended on the soldier's turn debt. Take a striker who fell short and then dodged: their next turn was already spent in advance, which review round 3 of Chapter 1 found after 77% of rounds at Tempo 1 (OQ-17). Unguarded then spent the turn after that, and the soldier could not dodge into the round after next. A soldier with an unspent turn lost Reactions only until the end of this round's turn.
  - **The change.** The ban now lasts until the end of the first of the soldier's turns that begins after the result, or the second for a row that spends two turns, whichever turn the row spends. The ban also ends when the Titan Engagement ends.
  - **The reviews.** The Codex review judged the original sound. The Opus fix was taken because ADR-0010 makes the soldier in turn debt the likeliest target.
- **Question:** Chapter 1 defines which turn a Reaction spends, but not which turn any other rule takes. Stress Response and Fear Roll results need to take a turn, an action, or Reactions, and a ban on Reactions needs a length.
- **Options:**
  - (a) By reference to the Reaction rule: the earliest turn, starting with the current round's, whose move and action are both unspent. An action result takes the earliest unspent action. A ban on Reactions lasts until the end of the turn the same row spends.
  - (b) Always the soldier's turn in the next round.
  - (c) The current round's turn, and nothing if it is already spent.
  - (d) Dice penalties instead of turn loss.
  - (e) As (a) for spending, but a ban on Reactions lasts until the end of the first of the soldier's turns that begins after the result (the second for two turns), whichever turn is spent (Opus review 1, fix 1).
  - (f) A Fear Roll or Stress Response result spends the current round's turn if any part of it is unspent. The Reaction's own rule is unchanged (Opus review 1, fix 2).
  - (g) Cap the ban at the end of the next round (Opus review 1, fix 3).
- **Provisional choice:** (e).
- **Why:**
  - Chapter 1 review round 3 (Minor finding 5, fix 2) asked for turn spending by reference to the Reaction, which (a) and (e) keep.
  - (e) gives every soldier the same ban length for the same result. It uses the same "first turn that begins after" clock as a `turn` time limit (OQ-43 (c)), so it adds no new unit.
  - (a)'s ban punished the soldier ADR-0010 already puts under the most pressure.
  - (b) and (c) create turn-spending rules that differ from a Reaction's, and (c) makes a result after a Reaction free.
  - (d) loses canon's soldiers frozen by fear.
  - (f) is a second turn-spending rule beside the Reaction's.
  - (g) adds a round-based clock that nothing else uses.
  - Open dependency: whether a soldier whose turn a result has spent in advance can still Help that round is OQ-17's question, and this chapter follows its answer.
  - No result forbids Help or Covering, because OQ-18 leaves no hook for it. If OQ-18 (c) is adopted, a Fear Roll row such as Shattered could add that ban.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (e); the OQ-17 dependency is closed by OQ-17 (c).
- **ADR:** none

### OQ-47: The Stress Response table

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.10; `data/mind/stress-responses.yaml` (`result_rules`, `table`).
- **Related:** OQ-04, OQ-05.
- **Revised:** after Chapter 3 review round 1 (Opus findings 11 and 12). The prose no longer lists the kinds of work the lasting rows penalize; the rows name their Catalog entries. A lasting result gained at the steps after a Titan Engagement ends, such as on a care-window roll, counts as gained outside it, and the sheet records which ending applies. The rows are unchanged.
- **Question:** The design summary rolls D6 + Stress − Resolve on a table. The fable final review (finding 5) noted that Alien's table is built for four attributes. Nothing sets the rows, how long a result lasts, what a repeated result does, or how a result ends.
- **Options:**
  - Rows: (a) lasting 1-die penalties on four kinds of work and extra Stress on a Push, then instant results: lose a success; lose a success and the next turn; the roll fails and 1 Stress. (b) A 2-die penalty row for each attribute. (c) Instant results only.
  - Repeats: (d) the next row down. (e) +1 Stress. (f) No effect.
  - Ending: (g) Rally, the end of the Titan Engagement, and, outside one, the calling rule or a day passing. (h) One ends per point of Stress lost. (i) Only Rally.
- **Provisional choice:** (a), (d), and (g).
- **Why:**
  - (a) covers every kind of Catalog entry a Titan Engagement uses without a row per attribute. 1-die penalties stop five lasting rows from stacking into pools of 1 base die.
  - (b) needs six penalty rows and leaves no room in a D6 spread to escalate. (c) removes the lasting harm that gives Rally its job.
  - (e) feeds the Stress spiral the fable final review warned about. (f) makes a soldier who holds every lasting row immune to them.
  - (h) ties results to relief that comes only at the end of a fight or on a kill, which ends them almost when (g) does, with more tracking. (i) leaves a result gained outside a fight with no end.
  - No row forbids a Push. Chapter 1's list of reasons a soldier cannot Push names the roll's own rule, not a state, so Hair Trigger makes a Push dearer instead.
- **Simulator case:** re-run OQ-04's Stress simulation with these rows. Hair Trigger, Botched, and several Fear Roll and Critical Injury rows add Stress gains that Chapter 1's run did not have.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (d), (g).
- **ADR:** none
- **Revised by batch 7 (7-9):** every row keeps its effects and gains a fiction-first name and a one-line `text` field the render prints beside it; the mechanics of (a), (d), and (g) stand (OQ-139).

### OQ-48: Rally

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.11; `data/mind/stress-responses.yaml` (`rally`); `data/character/action-catalog.yaml` (`rally`); `data/character/talents.yaml` (Carrying Voice, which extends "what Chapter 3 allows").
- **Question:** The Catalog leaves Rally's Position requirement, needs, and effect to this chapter, and Chapter 1 requires its Help and retry rules outside a Titan Engagement.
- **Options:**
  - Position: (a) the same Position or one step away, like Help. (b) The same Position only.
  - Effect: (c) one lasting Stress Response cleared per success. (d) All of them on any success.
  - Outside a Titan Engagement: (e) no Help or Covering, and once per comrade until that comrade gains another lasting result. (f) No Rally outside a Titan Engagement.
- **Provisional choice:** (a), (c), and (e). The sheet records who has Rallied a soldier outside a Titan Engagement (OQ-55). Two soldiers who have both left a Titan Engagement still under way count as holding the same Position (OQ-56).
- **Why:**
  - (a) uses the step count players already know from Help, so Carrying Voice reaches two steps, as Wide Awareness does for Help. (b) makes Rally useless between Blind Spot and In Reach.
  - (c) gives Steady Voice's dice a purpose. (d) clears up to five results on one success.
  - (e) is closed with no interval unit. (f) leaves a result gained on a Leg to end only when a day passes.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (c), (e).
- **ADR:** none

### OQ-49: Fear Roll triggers

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.12; `data/mind/fear-rolls.yaml` (`triggers`, `limits`).
- **Related:** OQ-23, OQ-36.
- **Revised:** after Chapter 3 review round 1 (Opus finding 11; Codex finding 4). `faced_a_titan` is now set when the soldier first holds a Position in a Titan Engagement, whether or not they make the Fear Roll. A soldier Down in their first Titan Engagement no longer keeps a false field and a pending first-Engagement Fear Roll. Both reviews proposed this fix.
- **Question:** ADR-0003 item 1 requires a closed list of Fear Roll triggers. OQ-36 asks this chapter to mark which triggers can arise outside a Titan Engagement. The codex final review (finding 11) counted up to five witness Fear Rolls per Grab as table load.
- **Options:**
  - List: (a) first Titan Engagement, an Abnormal Focus Titan, a second Focus Titan, a comrade Grabbed, and a comrade dying. (b) Also a comrade becoming Down, gaining a lethal Critical Injury, and a Titan coming within reach. (c) Only the two comrade triggers.
  - Limits: (d) one Fear Roll per soldier per event, and none while Down. (e) No limits.
  - Outside a Titan Engagement: (f) only where the rule that creates the situation states who rolls. (g) Every soldier in the Squad rolls.
  - First Titan Engagement while Down: (h) the trigger is used up when the soldier first holds a Position. (i) The soldier rolls at their next Titan Engagement.
- **Provisional choice:** (a), (d), (f), and (h). Chapter 5 defines who witnesses the two comrade triggers.
- **Why:**
  - (a) is the set of canon moments the design summary names: a first Titan, Abnormals, a Background Titan joining the fight, and a comrade Grabbed or eaten.
  - (b) roughly doubles Fear Rolls per fight and turns every injured Squadmate into a roll. (c) drops the first Titan Engagement and the Abnormal.
  - (e) lets one death count as several events.
  - (g) makes riders a Leg away roll for a death they did not see. (f) follows OQ-36 (d).
  - (h) gives the sheet field one closed test that matches the trigger's event. (i) makes the field depend on whether a roll was made.
- **Drive note** (Opus finding 14, Minor). The Pay It Forward Drive (`data/character/enlistment.yaml`) needs an act on a Grabbed or Down comrade since the start of the witness's most recent turn. The `comrade-grabbed` Fear Roll is made as soon as the Grab has been resolved, before any act on that comrade can have happened. So the Drive can never shrug off the first `comrade-grabbed` roll for the Grab it describes. It can shrug off later triggers, such as `comrade-dies` or a second Grab while the witness is already helping a comrade. Opus fix 2, letting a witness's result take effect at the start of their next turn, changes the rescue window and waits for the Grab simulator case. Chapter 2 is closed; OQ-23 should record this when Chapter 2 is next opened. Codex review round 2 (finding 6, Minor) raised it again. Both of its fixes change the closed Drive's trigger or text, so the gap stays recorded here.
- **Simulator case:** OQ-23's Drive payoff note, using `can_arise_outside_titan_engagement`.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (d), (f), (h); the Drive note is closed by OQ-23's Pay It Forward change.
- **ADR:** none

### OQ-50: The Fear Roll table and what a Drive shrugs off

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.12; `data/mind/fear-rolls.yaml` (`result`, `table`); `data/character/enlistment.yaml` (`drive_rules.effect`, which leaves what counts as a Fear Roll's result to Chapter 3).
- **Revised:** after Chapter 3 review round 1 (Opus finding 4, Major).
  - **The problem.** The drafting revision below reported only turn loss, but a rescue needs only the action.
  - **The figures.** At Resolve 3, a witness loses their next action or whole turn 2 times in 6 at Stress 1, 3 in 6 at Stress 2, and 4 in 6 at Stress 3. They lose the whole turn 0, 1, and 2 times in 6. The Codex review measured 49.98% at Stress 2.
  - **The reviews.** The Codex review judged the quoted turn figures correct, and they are. Section 3.7 and section 3.12 now give both figures. The rows are unchanged.
- **Revised after review round 2** (Opus finding 2, Major).
  - **The problem.** Section 3.7 said witness Fear Rolls add about 1 to 5 points to the comrades-close Grab death rate. That figure came from freeing the soldier at 3 to 5 successes on the hand with two rescue actions per comrade. ADR-0015's Toughness 1 hand is Wounded at 1 success and Broken at 2 (ADR-0007), and in that regime two rescue actions per comrade cannot reach 1 in 3.
  - **The figures.** Where 1 in 3 is reachable, with about one rescue action per comrade, witness Fear Rolls add about 26 points, and the rate moves about 16 points across witness Stress 1 to 3 (OQ-42, review round 2 Grab models).
  - **The change.** Section 3.7 now gives those figures and the Stress and Grief spread. The simulator case below gains a tolerance band. The rows are unchanged.
- **Question:** The Fear Roll's rows, how long results last, and what "one Fear Roll result" is when a Drive shrugs it off.
- **Options:**
  - Rows: (a) Stress, a penalty on the next roll, a spent action, a spent turn, no Reactions, a Scar from a total of 7, and two spent turns from 8. (b) Results that make other soldiers roll, such as a shout that spreads fear. (c) A Scar only from 9.
  - Result: (d) every effect of the row. (e) Every effect except the Scar.
- **Provisional choice:** (a) and (d), with every row instant.
- **Why:**
  - (a) ties every result to something Chapter 1 already tracks: Stress, turns, Reactions, and penalties.
  - (b) cascades Fear Rolls across six soldiers, the load the codex final review flagged. No row causes another Fear Roll.
  - (c) makes Scars from fear almost impossible for a soldier with Resolve 3 or more.
  - (e) splits the single result the glossary lets a Drive shrug off.
  - **Drafting revision:** an earlier draft spent a turn from a total of 4. The rows were moved one step up after the odds showed that witnesses of a Grab at Stress 2 and Resolve 3 would lose their turn 1 time in 3. They now lose it 1 time in 6, and lose their action or turn 3 times in 6.
- **Simulator case:** in the Grab case, measure how often a witness who would have acted in the rescue window loses that rescue action (not only the turn) to a Fear Roll, and the comrades-close death rate, at witness Stress 1, 2, and 3 with Grief 0 and 1.
  - **Tolerance for ADR-0014's "about 1 in 3".** Chapter 5 should hold the comrades-close rate near 1 in 3 for Rookie witnesses at Stress 2 with no Grief. It should also stay below 50%, halfway to the alone target, in every one of those six cases.
  - Review round 2's Opus model gave 26.0% to 51.8% across the six cases with the hand freeing the soldier at 2 successes, so Chapter 5 has little room.
  - **If Chapter 5 cannot hold the band,** the Chapter 3 lever is Opus review 2 fix 3: make Hesitate a 1-die next-roll penalty instead of a spent action. A witness at Resolve 3 and Stress 2 would then lose the rescue 2 times in 6 instead of 3. It was not taken now, because Chapter 5 has not set the lift, reach, or hand rules it would be tuned against.
- **Round-3 note:** `docs/reviews/03-harm-and-mind-review-3.md` M2: Section 3.7 and OQ-42's round 2 conclusion tell Chapter 5 that 1 in 3 needs about one rescue action per comrade, but in that regime the tolerance band's worst cell (witness Stress 3, one Grief) reaches 51% to 54% whenever the base cell is near 1 in 3, while one comrade with two rescue actions, H = 2, and a 3-die strike penalty holds all six cells at 30.4% to 40.2%, so the fixes are to state both regimes and record the sweep in OQ-42, take the Hesitate lever now, or loosen the band, and it stays open as an Unresolved Major.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep every Fear row, including Hesitate, and the six-cell band; Chapter 5 may use either rescue structure with reach and strike penalties stated in data, and must pass all six cells. No Hesitate replacement is authorized. Revised by batch 3b: Chapter 5's structure and ADR-0014's one-comrade definition (OQ-95) stand; Chapter 3 section 3.7 points to Chapter 5 section 5.13.
- **ADR:** none
- **Revised by owner decision:** Health boxes. The Grab probes are unchanged for a fresh victim; only a victim already carrying untreated injuries moves.
- **Revised by batch 7 (7-8):** the Fear Roll table is re-cut on AoT rows that hold the action-lost, turn-lost, and Scar profile at every total, so the six cells are a check the rerun confirms; (b) is revised to contagion as Stress, not rolls (comrades within one Position step gain 1 Stress on the top row), and no row causes another Fear Roll; results may drop a Blade Set, force a Gas Roll, set the loudest flag, force a move, or, from total 7, force a strike (OQ-139).

### OQ-51: Scars and Retirement timing

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.13; `data/mind/scars.yaml`.
- **Related:** OQ-31, OQ-38, OQ-54.
- **Revised:** after Chapter 3 review round 1 (Codex finding 1, Major; Opus finding 9, Minor).
  - **The problem.** Stabilizing a lethal Critical Injury in the end-of-Engagement care window gives a Scar after the Titan Engagement has ended. Under "otherwise at once", a fifth Scar gained there retired the soldier partway through the end steps, before the remaining care rolls, Grief, and the promotion step. Codex scenario: Mina has four Scars and her Punctured Lung is stabilized in the window.
  - **The change.** Retirement now never interrupts a procedure. A fifth Scar gained during a Titan Engagement or at its end steps retires the soldier at the last end step. One gained while a day passes retires the soldier after the day's last step. One gained in an outside-harm care window retires the soldier after that window and its Death Roll.
- **Revised after review round 2** (Codex finding 3, Major; Opus finding 5, Minor).
  - **Survivor's Guilt order.** A comrade's death triggers both Survivor's Guilt (1 Stress) and the `comrade-dies` Fear Roll, whose total uses current Stress, and nothing ordered them. At Stress 3 and Resolve 3, the order moved the chance of losing an action or turn from 66.7% to 83.3%, and of a Scar from 0% to 16.7% (Codex). The Stress now comes after the soldier's Fear Roll for that death, or when the death happens if they make none (`applies_after`).
    - This matches Grief's timing (OQ-52 (e)): a death never worsens the Fear Roll it causes.
    - No other Scar row needs an order. Numb removes the Fear Roll, Cannot Look Away and Old Nightmare change a Fear Roll's total directly, and the other rows' triggers are not Fear Roll events.
  - **Retirement timing.** "Any other fifth Scar retires the soldier at once" still retired a soldier in the middle of a Chase. Such a Scar now retires the soldier when the procedure in which it was gained ends, as that procedure's rule states. It retires them at once only if no procedure is under way. The outside-harm branch now reads "the Death Rolls that follow it, if any", because a window opened by Down alone has none (Opus review 2, fix 3).
- **Question:** The glossary makes a Scar a lasting named trauma with a mechanical effect, and ADR-0008 raises minimum Stress and Resolve by 1 per Scar and retires a soldier at five. Nothing sets how a Scar is gained, what the named effects are, or when a soldier who gains a fifth Scar retires.
- **Options:**
  - Gaining: (a) a Fear Roll row from 7, and surviving a lethal Critical Injury. (b) A roll after the session following a high fear result. (c) Fear Roll rows only. (d) Also surviving any Grab.
  - Table: (e) D66 with twelve Scars, each a trigger and a drawback, re-rolling duplicates. (f) Scars with an upside.
  - Retirement: (g) at the end of the Titan Engagement. (h) At once. (i) When the procedure in which the fifth Scar was gained is complete: the last end step for a Titan Engagement and its end, the last step of a day passing, the end of an outside-harm care window and its Death Rolls, or the end of any other procedure its rule states; at once only if no procedure is under way (Codex review 1, fix 1 and fix 2; Opus review 2, fix 3).
  - Survivor's Guilt: (j) its Stress comes after the soldier's `comrade-dies` Fear Roll for the same death (Codex review 2, fix 1). (k) Before it.
- **Provisional choice:** (a), (e), (i), and (j). A Squadmate re-rolls a Scar whose trigger is a Push or a Cover.
- **Why:**
  - (a) ties Scars to two moments canon treats as scarring, and both are data events. (b) adds a session-end roll the table does not feel in the field. (c) leaves a steady soldier unscarred however often they nearly die. (d) scars about two of every three Grabbed soldiers under ADR-0014's target, reaching five Scars too fast.
  - (e) gives the "weight at the table" ADR-0008 asks for, while the Resolve rise stops it spiralling. (f) turns Scars into rewards.
  - (i) keeps (g)'s match with promotion timing (OQ-31) and also covers the procedures outside a fight that give Scars. (g) alone missed the end care window. (h) would replace a player character mid-round or mid-procedure.
  - At minimum Stress, a Scar's two rises cancel out on Fear Roll and Stress Response totals. Only Stress above the minimum and the row's drawback make a veteran break, which is ADR-0008's reasoning.
- **Simulator case:** Scars per soldier per Expedition, to check that ADR-0014's two-Scar Veteran is reachable and that Retirement happens, though rarely before a player character's likely death.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a), (e), (i), (j).
- **ADR:** none

### OQ-52: Grief

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, sections 3.8 and 3.14; `data/mind/grief.yaml`.
- **Related:** OQ-10.
- **Revised:** after Chapter 3 review round 1 (Opus finding 7, Major).
  - **The reviews.** The Codex review judged the original sound. The Opus review showed that Squad-wide Grief with no Phase 1 relief saturates.
  - **The problem.** At ADR-0014's death rates each soldier gains about 1.3 Grief per Expedition, and the whole Squad reaches 3 Grief in about three Expeditions unless Downtime removes more. At Resolve 0 and Stress 2, a Fear Roll costs the action every time, costs the whole turn 4 times in 6, and gives a Scar 2 times in 6. A Squad at that point witnesses a Grab about as badly as a lone soldier.
  - **The change.** Grief from a death in a Titan Engagement now goes only to soldiers who held a Position in it. The deaths of one Titan Engagement give at most 1 Grief each, plus the named-comrade and Numb additions. The Downtime relief target below is recorded.
- **Revised after review round 2** (Opus finding 6, Minor).
  - **The problem.** Deaths outside a Titan Engagement gave 1 Grief each with no cap. Two comrades who failed `day` Death Rolls at one night camp cost every survivor 2 Resolve, while the same two dying at the end of a fight cost 1.
  - **The change.** The cap in (l) now also covers the deaths of one day passing, and the deaths from one event outside a Titan Engagement with the Death Rolls that follow its care window. A later procedure, such as a Chase, may state that all deaths during it count as one event (Opus review 2, fix 1).
  - **Not taken.** Opus fix 2, a cap per day, would also merge unrelated deaths on the same day, such as a Chase and that night's camp.
- **Question:** The glossary gives Grief after a comrade dies, lowering Resolve by 1 per point up to 3 points until it is dealt with in Downtime. Nothing sets who gains it, how much, when, whether Grief above 3 is held, or whether Resolve has a floor.
- **Options:**
  - Who: (a) every soldier in the Squad. (b) Only witnesses. (k) For a death in a Titan Engagement, soldiers in the Squad who held a Position at any point during it; for any other death, every soldier in the Squad (Opus review 1, fix 1).
  - Amount: (c) 1, plus 1 for a soldier whose Drive named the dead soldier. (d) 1 for everyone. (l) At most 1 from the deaths of one Titan Engagement, plus the named-comrade addition for each dead named comrade (Opus review 1, fix 2). (n) As (l), with the same cap for one day passing and one event outside a Titan Engagement (Opus review 2, fix 1).
  - Timing: (e) at the end of the Titan Engagement. (f) At once.
  - Limit: (g) at most 3 held. (h) No limit, with only 3 counting.
  - Floor: (i) none. (j) Resolve never below 0.
  - Relief: (m) keep (a), and set a Downtime relief target now (Opus review 1, fix 3).
- **Provisional choice:** (k), (c) with (l) and (n), (e), (g), and (i), and the relief target from (m) for the Downtime rules.
- **Why:**
  - The glossary does not say who gains Grief. (k) uses the record OQ-10 (f) already needs, so a soldier who never entered the fight does not grieve it at the fight's end. (a) made saturation the default for the whole Squad. (b) would need Chapter 5's witness rule for a Squad-wide effect.
  - (l) stops one bad fight from taking two or three points of Resolve at once from every survivor. (c) still gives the Drive's named comrade weight. The Numb Scar's extra Grief stays per death, because it is that Scar's drawback.
  - Neither (k) nor (l) prevents saturation over several Expeditions, because most deaths happen in fights the whole Squad is in. That rests on Downtime.
  - (e) stops a death from lowering Resolve on the very Fear Roll it causes, and matches canon's grief after the fight. (f) doubles the spiral mid-fight.
  - (g) matches "up to 3 points" and `attributes.yaml`. (h) hides Grief that Downtime relief might never reach.
  - (i) keeps the formula as written. The lowest possible Resolve is -1 (Instinct 2, Empathy 2, 3 Grief). (j) would make the third point of Grief do nothing for that soldier.
- **Downtime relief target:** each Downtime should let a soldier who uses the relief (Visit Haven or Honoring the Fallen) remove at least 2 Grief. That keeps a Squad at ADR-0014's death rates at median Grief 1 or less when an Expedition starts. The Downtime rules must meet this or record why not.
- **Simulator case:** median Resolve and Grief across four Expeditions and their Downtimes at ADR-0014's death rates, with and without the relief target.
- **Glossary note:** if confirmed, the Grief entry in `CONTEXT.md` could add "gained by the soldiers who were in that fight, when it ends".
- **Round-3 note:** `docs/reviews/03-harm-and-mind-review-3-codex.md` M3: Outside a Titan Engagement `grief.yaml` gives Grief from a death "at once" with no order against that death's `comrade-dies` Fear Roll, and applying Grief first raises a Stress 2, Resolve 3 witness's chance of losing an action or turn from 50.0% to 66.7%, against this entry's reason for (e) and OQ-51 (j), so the fixes are an `applies_after` order in `grief.yaml` putting Grief after every Fear Roll the death causes, or requiring each later rule that names death witnesses to resolve those Fear Rolls first; it stays open as an Unresolved Major.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep the caps, additions, and relief; Grief from a death applies only after every Fear Roll that death causes, at end step 8 in a Titan Engagement and immediately after those rolls outside one.
- **ADR:** none

### OQ-53: Healing time in days

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.6; `data/harm/healing.yaml`; `data/harm/death-rolls.yaml` (`day`).
- **Question:** The glossary gives each Critical Injury a healing time, and Careful Nursing halves it. ADR-0009 counts days outside the Walls by night camps. The Phase 1 rules have no Expedition or Downtime procedure to count time with.
- **Options:** (a) Days: a day passes at each night camp, and the Downtime rules give a Downtime's days. (b) Legs. (c) Expeditions and Downtimes. (d) Titan Engagements.
- **Provisional choice:** (a). A lethal Critical Injury cannot heal before it is stabilized.
- **Why:**
  - (a) is the one unit ADR-0009 names for time outside the Walls.
  - (b) varies with Pace. (c) is too coarse for Critical Injuries that heal in 1 to 7 days. (d) heals soldiers by fighting.
  - A lethal Critical Injury that cannot heal first never outruns its Death Rolls.
  - The Expedition and Downtime rules must confirm when a day passes and how many days a Downtime spans.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a).
- **ADR:** none
- **Revised by owner decision:** Health boxes. A Critical Injury that heals while untreated gives back its Health box.

### OQ-54: What resolves when a Titan Engagement ends, and in what order

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.16; `data/harm/engagement-end.yaml`.
- **Related:** OQ-10, OQ-15, OQ-31, OQ-38, OQ-44, OQ-51, OQ-56.
- **Revised:** after Chapter 3 review round 1.
  - **Care window moved** (Opus finding 3, Major). The care window moved from before the end-of-fight Death Rolls to after them, so the choice changed from (a) to (b).
  - **Retirement held to the last step** (Codex finding 1, Major). Retirement and promotion now wait for the last step even when the fifth Scar was gained at an earlier step.
  - **Reaction bans** (OQ-46). Step 1 now also ends every ban on Reactions.
  - **The reviews.** The Codex review judged (a) sensible. The Opus review judged (b) the best lever for its finding 3. (b) was taken as closer to ADR-0014's PC death target.
- **Revised after review round 2** (Opus finding 1, Major).
  - **The problem.** Under (b), the end of a Titan Engagement fired every `engagement` Death Roll before any care, and the players control when it ends. One more round let a comrade treat, which cut an untreated `engagement` death at Strength 3 from 57.9% to 6.9% with a Rookie Medic, or 19.6% with an untrained comrade. The best play was to hold a ready Nape strike or stay in reach for a round, against canon and against ADR-0014's kill in about 3 rounds.
  - **The change.** A new step before the Death Rolls gives every soldier within one Position step of a dying soldier one aftermath roll with no Help (OQ-57). Ending the fight is then worth about as much as one more round of treatment. That also removes most of (b)'s cost for a soldier hurt by the last card. The end steps are now nine: the Death Rolls, care window, Grief, and Retirement and promotion are steps 6 to 9.
  - **The reviews.** The Codex review round 2 judged this entry sound.
- **Question:** Chapter 1 cancels turns spent in advance and applies Stress relief when a Titan Engagement ends, and Chapter 2 promotes then. This chapter adds engagement time limits, lasting Stress Responses, a care window, Grief, and Retirement. Nothing orders them.
- **Options:**
  - Care window: (a) before the engagement Death Rolls. (b) After them.
  - Grief: (c) after those Death Rolls. (d) Before them.
  - Retirement: (e) before promotion, in the same step. (f) After promotion. (g) As (e), and a fifth Scar gained at any earlier step also waits for that step.
  - Before the Death Rolls: (h) nothing. (i) Aftermath rolls from within one Position step of the patient (OQ-57).
- **Provisional choice:** (b), (c), (g), and (i).
- **Why:**
  - **Why (b).** Under (a), 14.4 of the 15.3 points of lethal first Critical Injuries have `engagement` limits, and the window before their Death Rolls let every able soldier try to treat them. Opus measured the result:
    - With five soldiers at Wits 2, an untreated Opened Artery killed a Strength 3 soldier under 2% of the time.
    - A Squad that ended a Titan Engagement in good order lost at most about 1.2% of soldiers per first Critical Injury.
    - At ADR-0014's "about 1 PC Critical Injury" per Expedition that is about 0.01 PC deaths per Expedition, against a target of about 0.25 to 0.33. Almost the whole target fell on the Grab.
  - **What (b) does.** Treatment during the fight now prevents the end-of-fight Death Roll, which gives an in-fight medic, and comrades close, the weight ADR-0014's targets need. An untreated `engagement` row with no penalty kills on that roll 57.9% of the time at Strength 3 and 48.2% at Strength 4.
  - **The cost of (b) alone.** A soldier hurt by the card just before a Nape kill had no chance to be treated first, and a Squad gained by delaying the kill (review round 2). Under (a) the Squad could treat them after a fast kill. (i) gives each soldier within one step the treatment one more round would have given, without the round.
  - **Where the window still comes first.** `day` limits keep their care window before the Death Roll. Harm outside a Titan Engagement keeps its immediate window before its Death Roll, because no fight comes first in which a comrade could have treated it (OQ-43 (i)).
  - (c) counts every death of the fight once, including deaths at the end.
  - (g) lets one promotion step replace dead and retired player characters together, and stops a care-window Scar from retiring a soldier mid-procedure (OQ-51). OQ-38 still governs the order of several promotions.
- **Simulator case:** the "PC dies every 3 to 4 missions" target with (b) and (i), measuring how often a lethal Critical Injury is treated during the fight or with an aftermath roll, with and without a Medic.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep the nine steps; step 5 uses OQ-57's limits, step 7 recognizes Scars from injuries stabilized at step 5, and step 9 holds the full promotion batch of OQ-38.
- **ADR:** none
- **Revised by owner decision:** Health boxes. A successful aftermath roll gives back the treated injury's box and can end Down at step 5.

### OQ-55: Sheet fields Chapter 3 adds

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3, section 3.17; `data/harm/sheet-fields.yaml`; `data/character/lifepath.yaml` (`record_on_sheet`); `data/character/squadmates.yaml` (`stat_block.fields`).
- **Revised:** after Chapter 3 review round 1 (Opus findings 11 and 12; Codex finding 5).
  - **Fields added or changed:**
    - The `halved` flag, already in the YAML, is now named in section 3.17.
    - `healed_permanent_injuries` replaces the list of permanent effects, because a healed permanent row also counts toward worsening and blocks a repeat (OQ-42).
    - Each lasting Stress Response now records when it ends.
    - `rallied_outside_titan_engagement_by` enforces Rally's once-per-comrade limit outside a Titan Engagement.
    - `faced_a_titan` is set when the soldier first holds a Position, whether or not they roll (OQ-49).
  - **Tracked elsewhere.** Unshaken Command's once-per-Titan-Engagement use is a Chapter 2 Talent limit, not a Chapter 3 field. Who held a Position in a Titan Engagement is the Titan Engagement's own record (OQ-10).
- **Revised after review round 2** (Codex finding 4, Minor). A literal reading of Chapter 2's promotion list could drop Chapter 3's fields. A healed Lost Arm, for example, lives only in `healed_permanent_injuries`, not among held Critical Injuries. Chapter 2 already says a promoted Squadmate "keeps everything it has, in its current state". `sheet-fields.yaml` (`promotion`) now names this chapter's fields among what it keeps, and section 3.17 says so. Chapter 2's procedure is unchanged.
- **Question:** Chapter 2's lists of what the character sheet and Squadmate stat block record do not include the state this chapter needs. That state is:
  - each Critical Injury's treated state, time limit, healing days left, and whether it was halved;
  - healed Critical Injuries with permanent effects;
  - lasting Stress Responses and when each ends;
  - who has Rallied the soldier outside a Titan Engagement;
  - a pending next-roll penalty;
  - whether the soldier has faced a Titan;
  - which Critical Injuries have already given a Scar;
  - a pending Retirement.

  Chapter 2 is closed, and adding fields to its data is not a reference-text edit.
- **Options:** (a) This chapter lists its fields in its own file. (b) Add the fields to Chapter 2's files.
- **Provisional choice:** (a).
- **Why:** it leaves Chapter 2's closed data unchanged, and Foundry can merge the two lists. When Chapter 2 is next opened:
  - `record_on_sheet` and `stat_block.fields` could refer to `data/harm/sheet-fields.yaml`.
  - `promotion.steps` could name that file among what it keeps. Today its list omits the Chapter 3 fields, which `sheet-fields.yaml` (`promotion`) covers (Opus finding 12, fix 2; Codex review 2, finding 4).
  - Chapter 2 should state where once-per-Titan-Engagement Talent uses are recorded.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a); Chapter 2's `record_on_sheet` and `stat_block.fields` refer to `sheet-fields.yaml`, `promotion.steps` names it, and once-per-Titan-Engagement Talent uses are recorded beside the Talent.
- **ADR:** none
- **Revised by owner decision:** Health boxes. No stored field is added; current Health is derived from `health`, `health_lost`, and the untreated Critical Injuries.

### OQ-56: A soldier who leaves a Titan Engagement while it goes on

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3 review round 1: `docs/reviews/03-harm-and-mind-review-1.md`, finding 5 (Major). Chapter 3, section 3.16 (*Soldiers who left before the end*), sections 3.4, 3.5, and 3.11; `data/harm/engagement-end.yaml` (`soldiers_who_left`); `data/harm/death-rolls.yaml` (`time_limits`, `turn`); `data/harm/treat-injury.yaml` (`in_titan_engagement`); `data/mind/stress-responses.yaml` (`rally`).
- **Related:** OQ-10, OQ-15, OQ-43, OQ-44, OQ-48, OQ-54, OQ-57.
- **Revised after review round 2** (Opus finding 7, Minor). The same-Position rule for soldiers who have left covered Treat Injury and Rally, but not Help and Covering on those rolls, which Chapter 1 ties to Position. It now covers them too (Opus review 2, fix 1). It also applies to aftermath rolls (OQ-57).
- **Question:** Chapter 1 (OQ-10 (f)) lets a soldier leave a Titan Engagement before it ends, and ADR-0009 names retreat. A soldier who has left holds no Position, so the draft gave no answer to three questions:
  - Does the soldier still take turns, so that a `turn` limit keeps running out?
  - Can a comrade who left with them treat or Rally them? Both need a shared Position, and outside a Titan Engagement treatment happens only in care windows.
  - Do the end steps include them?

  Opus scenario: Oskar takes Internal Bleeding (`turn` limit, Death Roll penalty 1, Down). Mila carries him out with Lift Comrade while the Squad fights on for three more rounds. Either Oskar rolls 2 dice every turn with Mila barred from treating him, or his limit freezes, and nothing picks one.
- **Options:**
  - (a) Until the Titan Engagement ends, the soldier is still in it for Chapter 3's rules. They keep taking turns, two soldiers who have both left count as holding the same Position for Treat Injury and Rally, and the end steps apply to them (Opus review 1, fix 1).
  - (b) Leaving ends the Titan Engagement for that soldier. Apply the end steps to them when they leave, with a care window among the soldiers who left together (Opus review 1, fix 2).
  - (c) Log it for Chapter 5's retreat rule to answer (Opus review 1, fix 3).
- **Provisional choice:** (a).
- **Why:**
  - (a) keeps one clock and one end procedure per Titan Engagement. It matches OQ-10 (f), where end-of-Engagement relief goes to everyone who held a Position at any point, and OQ-15, where turns belong to their Titan Engagement. It lets a carrier treat the comrade they carried.
  - (b) splits Stress relief, Grief, and the end-of-fight Death Rolls across several moments of one fight, and needs a rule for who "left together".
  - (c) leaves Chapters 1 to 3 without an answer until Chapter 5 is drafted, and ADR-0003 item 8 needs one now.
  - (a) does not track who left together. Every soldier who has left counts as sharing one Position, which is generous to a staggered retreat.
  - Chapter 5 must state how a soldier leaves and what their move and action can do afterward, and may narrow the same-Position rule.
- **Simulator case:** a staggered retreat that carries out a comrade with a `turn` limit, in the PC death target case.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-57: Aftermath rolls at the end of a Titan Engagement

- **Type:** PROVISIONAL
- **Arose in:** Chapter 3 review round 2: `docs/reviews/03-harm-and-mind-review-2.md`, finding 1 (Major). Chapter 3, sections 3.4, 3.5 (*Aftermath rolls*), and 3.16; `data/harm/treat-injury.yaml` (`aftermath_rolls`); `data/harm/engagement-end.yaml` (`aftermath-rolls`); `data/harm/death-rolls.yaml` (`engagement`).
- **Related:** OQ-42, OQ-43, OQ-44, OQ-54, OQ-56.
- **Question:** OQ-54 (b) puts the end-of-fight Death Rolls before any care, so only treatment during the fight prevents them. The players decide when a fight ends, with a Nape kill or a retreat. How can the end of a fight keep `engagement` limits dangerous without making a delayed kill the best play?
- **Options:**
  - (a) Keep (b) with nothing before the Death Rolls, and log the incentive (Opus review 2, fix 3).
  - (b) An `engagement` limit runs out at the end of the soldier's third turn after it was gained, or when the fight ends, whichever comes first (Opus review 2, fix 1).
  - (c) Before the Death Rolls, each soldier at the patient's Position, or who left with the patient, may make one Treat Injury roll on that patient with no Help (Opus review 2, fix 2).
  - (d) As (c), but from the patient's Position or one Position step away, and a soldier may roll on their own Critical Injury.
  - (e) Move the care window back before the Death Rolls (OQ-54 (a)).
- **Provisional choice:** (d).
  - Each soldier makes at most one aftermath roll. It uses treat on an untreated `engagement` Critical Injury, including a `turn` limit that has just become `engagement`.
  - No one can Help or Cover it, and it can be Pushed.
  - A failed roll cannot be tried again before the Death Rolls. It does not use up the soldier's roll in the care window.
- **Why:**
  - **What a delay bought.** One more round gives a comrade a move and an action: the move to the patient's Position and the Treat Injury. (d) gives exactly that without the round. A delayed kill now buys only Help, a second attempt, or a treater two or more steps away, each at the price of a round of Titan cards.
  - (c) still makes a delay worth it when the comrade is one step away, which is the review's own scenario.
  - (a) leaves the incentive in every fight with a dying comrade, against canon and ADR-0014's kill in about 3 rounds.
  - (b) limits how long a Squad delays, not whether it delays while turns remain.
  - (e) lets every soldier in the fight roll, with Help. Review round 1 measured that as nearly harmless (OQ-44, OQ-54).
  - Self-treatment is allowed because a soldier alone could also treat themselves during one more round.
  - **Lethality.** Opus review round 2 measured one attempt with no Help, at Stress 1 with one Push. The end-of-Engagement relief comes first, so real aftermath rolls usually have fewer Stress Dice.
    - An untreated `engagement` row with no penalty kills a Strength 3 soldier 57.9% of the time.
    - One attempt leaves 6.9% by a Rookie Medic, 19.6% by an untrained comrade, and 22.2% by the soldier alone.
    - Across first Critical Injuries at a rolled Injury Location, `engagement` rows then kill about 1.0% with a Rookie Medic within reach and 2.8% with an untrained comrade, against 8.5% with nobody.
  - **Consequence.** ADR-0014's PC death target now leans more on soldiers with no comrade within one step when a fight ends, on `turn` rows, and on the Grab. A `turn` row still runs out at the end of each of the soldier's turns before the kill.
- **Simulator case:** the "PC dies every 3 to 4 missions" target with aftermath rolls. Measure how often a dying soldier has a comrade within one step when a fight ends, and how often a Squad still gains by delaying a kill or a retreat.
- **Round-3 note:** `docs/reviews/03-harm-and-mind-review-3.md` M1: The limit is one aftermath roll per soldier, not per patient, so every soldier within one step rolls on the same patient after Stress relief, and three untrained rollers leave an untreated `engagement` row at Strength 3 fatal 3.8% of the time, near the level review round 1 rejected, which cuts the worth of treatment during the fight and makes this entry's one-roller lethality figures too high for a clustered Squad; the fixes are one aftermath roll per patient, rollers only from the patient's own Position plus the patient, or keeping (d) and restating lethality by number of rollers here and in OQ-42 and OQ-54, and it stays open as an Unresolved Major.
- **Status:** Decided (see DECISIONS-2026-09-14.md)
- **Decision:** One aftermath roll per patient and at most one per treater, chosen by the players, on one untreated lethal `engagement` Critical Injury, from the patient's ending Position or one step away, Pushable, with no Help or Cover; a failure uses up the patient's attempt.
- **ADR:** none
- **Revised by owner decision:** Health boxes. A successful aftermath roll also gives back the injury's box.

### OQ-58: The reference builds' Health under Health boxes

- **Type:** PROVISIONAL
- **Arose in:** Chapters 1 to 3 decisions conformance review, round 1: `docs/reviews/01-03-decisions-conformance-review-1.md`, finding 3 (Major). Chapter 3, section 3.2 (design note *Injuries before Down*) and section 3.7 (*Earlier injuries*); Chapter 2, section 2.10 (*The stat block*); `data/character/squadmates.yaml` (`templates`); `docs/adr/0014-numbers-tuned-to-design-targets.md` (reference builds and the OQ-19 amendment).
- **Related:** OQ-19, OQ-29, OQ-42, OQ-50, the owner decision on Health boxes.
- **Question:** Under Health boxes, Health decides how many untreated Critical Injuries a soldier carries before Down (mean 2.65 at Health 3, 3.25 at Health 4). ADR-0014, as amended, gives the Rookie "key attribute 4, other attributes 3, one at 2" without naming the key attribute, so its Strength, Agility, and Health are open. The decisions' Health boxes section and consistency check assume Health 4 (Strength 4, Agility 3), but 5 of the 9 Squadmate templates, which Chapter 2 calls the Rookie build, have Health 3. The Expedition targets ("about 1 PC Critical Injury", "a PC dies every 3 to 4 missions") and the Grab case for a victim already carrying injuries depend on which Health the simulator uses.
- **Options:**
  - (a) Give every reference build a Strength key attribute: Rookie Strength 4, Agility 3 (Health 4), Veteran Health 4, Levi-grade Strength 6, Agility 4 (Health 5). The simulator reports the same targets for Health 2, 3, and 5 builds beside them.
  - (b) Make the Rookie Strength 3, Agility 3 (Health 3), matching the Agility 3 dodge and the majority of templates (review fix 1).
  - (c) Build the default Squad from the nine Squadmate templates in equal shares, with targets as medians over that mix (review fix 2).
- **Provisional choice:** (a).
- **Why:**
  - It is the Health the decisions already quote for the reference builds (Health boxes odds and the *Reference builds* consistency check), so no figure in the decisions or the chapters moves.
  - The lone-Rookie Grab model behind ADR-0014's alone target and the OQ-50 probes already uses Strength 4.
  - Reporting Health 3 beside it keeps the majority-template case visible, which answers the review's scenario of two simulator authors with different baselines.
  - (b) would re-measure every Health-boxes figure and move the PC death baseline without a decision behind it. (c) ties the reference to template choices players make at the table.
  - Any option is final only once ADR-0014's reference builds name their Strength and Agility, which a drafter cannot amend.
- **Simulator case:** the Expedition PC Critical Injury and PC death targets, and the Grab case for a victim with one and two untreated earlier Critical Injuries, at Health 3 and Health 4; report the gap.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Conformance follow-up*)
- **Decision:** (a), made exact: the Rookie is Strength 4, Agility 3, Wits 2, and 3 elsewhere (Health 4, Resolve 3); the Veteran Strength 5, Agility 3, and 3 elsewhere (Health 4); the Levi-grade soldier Strength 6, Agility 4, and 4 elsewhere (Health 5). Targets stay measured on these builds; every Health-dependent target is also reported for a Squad of Health 3 soldiers, and Health 2 and 5 figures are reported beside them.
- **ADR:** ADR-0014 (reference builds)

### OQ-59: Standard Issue contents, ratings, Funding, and resupply

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, Gear, sections 4.1, 4.9, and 4.12; `data/gear/standard-issue.yaml`, `data/gear/items.yaml`, `data/gear/sheet-fields.yaml`.
- **Revised:** after Chapter 4 review round 1 (`docs/reviews/04-gear-review-1.md` Majors 3 and 4 and Minor 11; `docs/reviews/04-gear-review-1-codex.md` judged the entry sound). Adds the interim issue at the start of each session and corrects the proposed glossary text. The Jam rate for the soldier holding Attention, and its simulator case, move to OQ-72. Revised again after review round 2 (`docs/reviews/04-gear-review-2.md` Major 2 and Minors 7 and 11; `docs/reviews/04-gear-review-2-codex.md` Majors 1, 2, and 3). The interim issue no longer replaces Jammed ODM Gear or a kit at 0. An interim issue that waits for a procedure comes after that procedure's last step, including sharing out, Retirement, and promotion. A full issue replaces ODM Gear or a horse rated below the Funding row. The Specialty step and the sheet handle any number of kits.
- **Related:** OQ-01, OQ-25, OQ-28, OQ-29, OQ-58, OQ-66, OQ-67, OQ-68, OQ-72.
- **Question:** The glossary scales Standard Issue by Funding and lists ODM Gear, spare canisters, and Blade Sets. No ADR gives quantities or ratings, and the Funding rules are not written. Every soldier needs a horse (ADR-0009, ADR-0015 as amended), and Chapters 2 and 3 name medical kits and tool kits with no source for either. What does a soldier receive, when, and what happens to worn items, to items rated below a higher Funding row, and to a second kit of a kind? Until the Expedition rules exist, how does gear come back after character creation?
- **Options:**
  - (a) The `by_funding` table: ODM Gear rated 1 (2 at Funding 6), 0 to 2 spare canisters, 2 to 5 Blade Sets rated 1, and a horse rated 1 (2 at Funding 5 and 6). A Medic also receives a medical kit and an Engineer a tool kit, each rated 1. Funding is 3 until the Funding rules exist. A full issue tops up canisters and Blade Sets; replaces ODM Gear that is Jammed or rated below the row, a horse that is lame or rated below the row, and a Specialty's kits when none of that kind is above 0; never restores a kept item's current rating; and lets a soldier decline spares. Until the Expedition rules are written, every soldier in the Squad receives an interim issue together at the start of each session, or, if a procedure is under way then, after that procedure's last step. The interim issue is a full issue except that it keeps Jammed ODM Gear rated at least the row, and keeps a kit at 0.
  - (b) As (a), but ODM Gear rated 2 at Funding 3, so a Rookie's harness survives its first worn Pushed roll. This needs ADR-0014 amended (OQ-72).
  - (c) Horses and kits issued apart from Standard Issue, under their own term.
  - (d) Standard Issue restores every item to its full rating each time it is received.
  - (e) As (a), with no interim issue: Phase 1 play runs on the gear issued at creation.
  - (f) As (a), but the interim issue comes each time the GM opens a new Mission Brief.
  - (g) As (a), but the interim issue is a full issue, as revised after round 1.
  - (h) As (a), but an interim issue that waits for a procedure comes at the share-out, before Retirement and promotion.
  - (i) As (a), but a Funding row raises the rating of a kept item to the row's, leaving its current rating.
  - (j) As (a), but a soldier holds at most one kit of each kind, so a second kit cannot be passed, taken, or shared out to them.
- **Provisional choice:** (a).
- **Why:**
  - ADR-0014's Rookie has Gear Dice 1, so the default Funding must issue rating 1. (b) moves the reference build.
  - Standard Issue is the glossary's "gear every soldier receives", and a horse is gear every soldier needs. A second term for issued gear (c) splits one idea in two.
  - Specialty kits match Chapter 3's worked example (Oskar carries a kit, Hale has none) and the allowance Chapter 2 made under OQ-28. Chapter 2 section 2.6 now names them.
  - Each Funding row issues exactly as many counted items as its Funding, 1 to 6, so no row Overloads a Strength 2 soldier without a Specialty kit, and a soldier can decline whatever would.
  - (d) would leave the Maintain Gear Downtime Action nothing to do. (g) is (d) in practice: every item a Funding 1 to 4 row gives is rated 1, so an item below its rating is at 0 and was replaced every session. OQ-66's care-window limit then bound only between fights in one session, and two tables playing the same fights got different wear depending on where a session broke (Opus review 2 Major 2). Under (a) the interim issue brings back what a fight uses up: gas, Blade Sets, Squad Supply, and a lame horse, since no Phase 1 rule restores a horse. It leaves a Jam to Field Repair and a spent medical kit to restocking. A session break still refills consumables, which is the interim issue's job.
  - Under (e), a spent canister, a ruined Blade Set, a lame horse, and the Squad's two Funding 3 medical units never come back, so any Phase 1 playtest of more than one Titan Engagement runs on the first issue (Opus review 1 Major 4). The chapter already uses an interim value for the unwritten Funding rules, and the interim issue follows the same pattern.
  - A session is a unit the rules already count (a Drive's one use per session). A Mission Brief (f) has no procedure yet, so opening one is not a trigger the rules can read.
  - Waiting until after the procedure's last step gives the interim issue one place against the share-out, Retirement, and promotion, so totals never depend on an unstated order, and a promoted Squadmate is issued with the rest of the Squad (Codex review 2 Major 1; Opus review 2 Minor 7). No Titan Engagement or care window is resupplied partway through. (h) would top up a Squadmate in the middle of the step that promotes it.
  - Replacing only items rated below the row lets a higher Funding reach soldiers whose gear still works, without restoring the current rating of an equal-rated item (Codex review 2 Major 2). (i) breaks "the rating never changes". Funding stays 3 until the Funding rules exist, so no Phase 1 table sees the difference yet.
  - Passing, taking, and the share-out can give a soldier a second kit of a kind (Codex review 2 Major 3). The sheet records one rating and current rating per kit, and the Specialty step reads "no kit of that kind above 0". (j) adds a receiving limit to three rules for a case no canon picture forbids.
- **Figures (Chapter 4, section 4.9):** at a fixed Stress 1, Agility 3, and one ODM Gear roll a round, rating 1 Jams within 5 rounds 52.7% of the time when Pushing whenever allowed, or 46.9% when Pushing only when short of 2 successes. It Jams no later than a full canister empties 59.6% or 55.9% of the time. Rating 2 gives 28.0% or 21.8%, and rating 3 gives 15.4% or 10.7%. The rising-Stress figures for the soldier holding Attention are in OQ-72.
- **Glossary change needed:** Standard Issue becomes "The gear every soldier receives when they join the Squad and whenever a rule issues it, such as before each Expedition, scaled by Funding: ODM Gear, gas canisters, Blade Sets, a horse, and a Specialty's kit."
- **Simulator case:** see OQ-72.
- **Review choices:** round 1: the Codex review judged this entry sound, and the Opus review found the resupply gap and the Jam threshold. The rows stay as Codex found them, (a)'s interim issue fills the resupply gap, and the Jam question goes to OQ-72 because its main lever needs an ADR. Round 2: the Opus review judged the entry partly sound and the Codex review unsound in part. Their fixes do not conflict, and all are applied: Opus fix 1 for what the interim issue replaces, Codex fix 2 for its timing (after the whole procedure, with the promoted-Squadmate rule restated), Codex fix 1 for Funding, and Codex fix 2 for several kits.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a); ODM Gear is rated 1, 1, 2, 2, 2, 3 by Funding (OQ-72); a soldier may decline the exchange of Jammed ODM Gear or a lame horse and keep it at 0; the between-sessions rationale is corrected. Glossary Standard Issue changed as proposed. Revised by batch 2b (OQ-91, OQ-92): horses are rated 1, 1, 2, 2, 2, 3 by Funding, and a full issue also replaces worn ODM Gear and worn horses, with the decline covering each exchange. Revised by batch 3 (OQ-93): the interim issue also replaces a worn horse.
- **ADR:** none (ADR-0014 via OQ-72)

### OQ-60: ODM use, Gas Roll timing, running dry, strikes, and part-used canisters

- **Type:** Unresolved Major (first logged as PROVISIONAL; Chapter 4's `PROVISIONAL (OQ-60)` blocks still point here)
- **Arose in:** Chapter 4, sections 4.2 and 4.3; `data/gear/odm-gear.yaml` (`odm_use`, `strikes`, `gas_roll`, `change_canister`, `running_dry`, `jam`); `data/character/action-catalog.yaml` (`nape-strike`, `body-part-strike`).
- **Revised:** after Chapter 4 review round 1 (Opus Major 5; Codex Critical 2). A Nape strike, and a Body Part strike made from On Body or Blind Spot, now need ODM Gear that counts as had. The chapter introduction no longer calls the Gas Roll three dice. The gas figures are now exact. Revised again after review round 2 (`docs/reviews/04-gear-review-2.md` Major 1 and Minors 6 and 8). The strike requirement applies only in a Titan Engagement, so the Graduation Exam's Titan dummy course can be rolled, and the Exam's training ODM Gear never counts as not had for lack of a canister. A soldier whose fitted canister is passed or taken after ODM use makes that round's Gas Roll at once. The gas figures are stated as medians, as ADR-0014 reports them, and were re-run with the same results.
- **Related:** OQ-12, OQ-22, OQ-25, OQ-35, OQ-50, OQ-65.
- **Question:** The glossary rolls gas "each round a soldier uses ODM Gear", and ADR-0014 sets the target, but nothing says what counts as using ODM Gear, when in the round the Gas Roll is made, what running dry does, what happens to a canister that still holds gas when it is taken off, or whether a soldier who is Jammed or has run dry can still strike.
- **Options:**
  - (a) ODM use is an ODM move, a roll with ODM Gear as its gear item, or an act Chapter 5 names. The Gas Roll comes at the end of the round, and at once if the Titan Engagement ends mid-round. Running dry makes ODM Gear count as not had but does not make an airborne soldier fall. A canister taken off with gas stays as a spare with its Gas Rating, and Change Canister spends the action in a Titan Engagement. In a Titan Engagement, a Nape strike, and a Body Part strike made from On Body or Blind Spot, need ODM Gear that counts as had; only a Chapter 5 rule that names the requirement lifts it, and a rule outside a Titan Engagement applies it only by naming it. The Graduation Exam's training ODM Gear never counts as not had for its Gas Rating. A fitted canister passed or taken after ODM use makes that round's Gas Roll at once.
  - (b) As (a), but any strike from On Body or Blind Spot, including a Nape strike, is also ODM use: a two-die Gas Roll, never the third die.
  - (c) The Gas Roll is made as soon as the soldier first uses ODM Gear in the round.
  - (d) Running dry makes an airborne soldier fall, as a Jam does.
  - (e) A canister taken off is always discarded.
  - (f) As (a), without the strike requirement: a strike needs no working ODM Gear, as first drafted.
  - (g) As (f), with the strike question left to Chapter 5 as a named drafting constraint.
  - (h) As (a), but the strike requirement applies everywhere, and the Graduation Exam's `requirements_ignored` lists it.
  - (i) As (a), but a canister passed after ODM use carries its gas untouched, and the passer makes no Gas Roll for the round.
- **Provisional choice:** (a).
- **Why:**
  - Only at the end of the round is the three-die rule known, because a Push later in the round still raises it. (c) would need a second roll or a retroactive die.
  - The decisions tune gas against Pushes on dodges and Break Attention, not strikes, and a strike's gear item is a Blade Set. The strike requirement adds no Gas Roll and no third die, so that basis (OQ-12) stands.
  - Under (f), a soldier who runs dry or Jams at Blind Spot keeps that Position and can make a Nape strike every round with no gas and no working harness (Opus Major 5). Canon's gas crisis at Trost is soldiers with empty canisters who cannot reach or cut a standing Titan. (g) leaves that open until Chapter 5 is drafted.
  - (b) would also make gas track rounds of fighting, but it adds a Gas Roll to every striker's round and changes the definition the Codex review judged sound. It stays the lever in the simulator case below.
  - The glossary gives the fall to the Jam only. (d) doubles the harm of Pushing ODM Gear and leaves stranded soldiers, a canon picture, no place.
  - (e) makes the handover OQ-35 was written for (one soldier giving a comrade their gas) impossible unless the giver carries a full spare.
  - The requirement stands in two Catalog rows that Chapter 5 owns, and Chapter 2 section 2.8 names it. A Titan grounded by a Broken leg is the likely case for a Chapter 5 rule that lifts it.
  - Applied everywhere, the requirement made the Graduation Exam's Titan dummy course impossible, because the exam issue has no canister: every Cadet scored 0 on Trial 2, which pays 1 Merit 13.2% to 26.3% of the time, and OQ-22's decided parity target fell out of its band (Opus review 2 Major 1). (h) fixes that by editing the decided Exam file. Scoping the requirement to Titan Engagements changes only this chapter's rule, and every strike it was written for is in one. The same missing canister would have taken the Gear Die from the Exam's Fly and Break Attention rolls, so the training ODM Gear is excused from running dry.
  - Passing a fitted canister after an ODM move moved gas that the end-of-round Gas Roll would have lowered, a third of a point on average (Opus review 2 Minor 8). Rolling when the canister leaves closes that without changing any Gas Roll's dice, so the ADR-0014 figures do not move. (i) is the canon handover with its small gain accepted.
- **Figures:** exact, from a Markov chain over Gas Rating (Chapter 4, section 4.3), re-run in fix round 2 with the same results. ADR-0014 reports medians. With a full Gas Rating of 3, a canister lasts a median of 8 rounds with no Push (mean 9.25, 10th to 90th percentile 4 to 16, emptied by round 8 51.3% of the time) and a median of 6 Pushing every round (mean 6.33, 3 to 11). Rating 2 gives medians of 5 and 4, and rating 4 gives 11 and 8, so 3 gives the closest whole-number medians to about 9 and about 6.
- **Simulator case:** once Chapter 5 fixes how often soldiers move, dodge, and strike, report gas per round of fighting beside the ADR-0014 figure per round of ODM use, and how often the strike requirement stops a strike. If a soldier who holds Blind Spot and strikes rarely empties a canister in a fight of about 3 rounds, the lever is (b). The no-Push half of the ADR-0014 gas target is accepted at a median of 8 rounds, the closest a whole-number Gas Rating reaches.
- **Review choices:** the Codex review judged the entry as first drafted sound, and its Critical 2 was an error in the chapter introduction, now fixed. The Opus review found the strike gap. The fix adds a requirement instead of changing what counts as ODM use, which keeps the part Codex found sound. Round 2: both reviews judged the entry sound. The Opus review's Exam finding takes its fix 1 (a Titan Engagement only), its median finding its fix 1, and its canister-pass finding its fix 1.
- **Round-3 note:** `docs/reviews/04-gear-review-3-codex.md` M2: The Gas Roll made at once on a fitted canister that is passed or taken can bring it to 0 (30.6% for a Gas Rating 1 canister on two dice, 42.1% on three), and then `gas_roll.canister_removed`, `passing_items.passable` and `taking_items.effect` ("as a spare with its Gas Rating"), the discard of an empty canister on removal in `items.yaml`, and the sheet invariant that every spare is 1 or more disagree on whether the receiver gains a Gas Rating 0 spare, gains nothing for a spent action, or the act never happened, so the fixes are to discard the canister with the action spent and nothing transferred, to let the passer or taker cancel with the Gas Roll standing, or to move the canister first and apply the roll on the receiver's sheet; `docs/reviews/04-gear-review-3.md` finding 2 rates the same gap Minor (listed in OQ-73), OQ-65 and OQ-68 share the fix, and it stays open as an Unresolved Major.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a). A soldier who used ODM Gear this round makes that round's Gas Roll before their fitted canister can be passed, taken, or, on their death, left; a canister that roll empties is discarded and moves nowhere, and the pass or take is then not made and spends nothing.
- **ADR:** none

### OQ-61: Airborne, mounted, and a soldier's horse

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, sections 4.2, 4.5, and 4.12; `data/gear/odm-gear.yaml` (`airborne`), `data/gear/horses.yaml`, `data/gear/items.yaml` (`horse`), `data/gear/sheet-fields.yaml` (`horse`, `squad_sheet_row`), `data/character/action-catalog.yaml` (`mount-or-dismount`).
- **Revised:** after Chapter 4 review round 1 (Opus Major 2 and Minors 9 and 12). Mounting outside a Titan Engagement no longer tests a Position. When a Titan Engagement ends, horses stop holding Positions. The sheet and the Squad row record a dismounted horse's Position. A Fly roll makes a soldier airborne only when its calling rule says so, and a mounted soldier made airborne is dismounted first. The mount option's `option_of` covers the procedure under way outside a Titan Engagement. Revised again after review round 2 (`docs/reviews/04-gear-review-2-codex.md` Minor 6; `docs/reviews/04-gear-review-2.md` Minor 11). The mount option's `option_of` also covers the time when no procedure is under way, a dismounted horse stays at a Position only in a Titan Engagement, and the lift row, which could never happen, is gone from what ends airborne.
- **Related:** OQ-23, OQ-25, OQ-28, OQ-29, OQ-35, OQ-36.
- **Question:** OQ-23, OQ-25, and OQ-35 require Chapter 4 to define airborne, mounted, and mounting and dismounting before Chapter 5 defines moves and Positions. What sets and clears each state, whose horse can a soldier ride, where is a horse its rider has left, and where are the horses when a fight ends?
- **Options:**
  - (a) Airborne and mounted are states that closed lists set and clear. An ODM move, or a Fly roll whose calling rule says so, makes a soldier airborne, dismounting a mounted soldier first. A move that is not an ODM move, a fall, a Grab, or the end of the Titan Engagement ends it. Mounting and dismounting are part of a move in a Titan Engagement, only onto the soldier's own horse, which holds a Position there, stays where its rider dismounted, and has that Position on the sheet. Outside a Titan Engagement no horse holds a Position, and a soldier mounts their own horse if it is not lame. The horse's Gear Dice go to the dodge and Ride only while mounted, and to Break Attention while mounted or while it holds the soldier's Position. There are forced dismounts for lame, Down, and Grabbed.
  - (b) Airborne is read from Position: On Body and Blind Spot are always airborne, and Distant and In Reach never are.
  - (c) Any soldier may mount any horse that no one is riding and that is not lame.
  - (d) As (a), but a horse left at a Position when a Titan Engagement ends stays there, and its soldier must reach it under a later rule.
  - (e) As (a), but making a Fly roll makes the soldier airborne whatever its result, as first drafted.
- **Provisional choice:** (a).
- **Why:**
  - (b) cannot tell a soldier standing on a roof from one hanging in the trees at the same Position, and it leaves Freedom undefined outside a Titan Engagement, where OQ-36 lets its flight trigger work.
  - A true or false field is one value for Foundry and one mark on the Squad sheet row.
  - Riding only one's own horse keeps horse wear on one sheet, which the one-line row depends on, and matches Standard Issue's one horse per soldier. (c) would need a record of who last rode each horse.
  - The Break Attention clause keeps Loose the Horse usable after the rider dismounts to loose it.
  - As first drafted, the mount requirement tested a Position outside a Titan Engagement, where no one holds one, so no soldier could mount there, and nothing said where the dismounted horses were when a fight ended (Opus Major 2). (d) needs a rule for reaching a horse that neither Chapter 5 nor the Chase rules have, and a Squad that fights on foot and then rides on is canon.
  - The horse's Position is one short mark on the Squad row (`@Distant`), which keeps OQ-29's one line, and it is what the mount requirement and the Break Attention clause read.
  - (e) puts a soldier in the air on a failed Fly roll, and lets a rule's Fly roll make a mounted soldier airborne without dismounting (Opus Minor 12).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a); a dismounted horse's Position and a dead soldier's left-item Position are recorded with the Focus Titan they are relative to, and the mount and take tests read that Titan; Chapter 5 states the two-Focus-Titan case.
- **ADR:** none

### OQ-62: Falls

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, section 4.6; `data/gear/falls.yaml`.
- **Revised:** after Chapter 4 review round 1 (Opus Major 1 and Minor 9). The procedure now ends the airborne, mounted, and carried states before the damage, so a fall never causes a second fall. A fall from a horse is never raised by Anchor Rating or Size Class. A carrier who dies while airborne or mounted makes the carried comrade fall. Revised again after review round 2 (`docs/reviews/04-gear-review-2.md` Minor 4). A carrier who becomes Down while airborne or mounted keeps carrying until step 2 of their own fall, so the comrade falls with them under the carried trigger.
- **Related:** OQ-39, OQ-58, OQ-64, OQ-72, the owner decision on Health boxes.
- **Question:** Chapter 3 leaves falls, and a soldier who becomes Down while airborne or mounted, to Chapter 4, and the decisions size such damage against current Health (1 to 6 for a soldier not yet Down, with Health 2 to 6). No ADR says when a soldier falls, how high, or how much damage a fall does.
- **Options:**
  - (a) A closed trigger list: a Jam while airborne, Down while airborne or mounted, lame while mounted, a carrier who falls, becomes Grabbed while airborne, or dies while airborne or mounted, or a rule that names a fall. The band comes from Position: low for Distant, In Reach, or a horse; high for On Body or Blind Spot; one step higher, except from a horse, for a Giant Forest or a Large Focus Titan. The procedure ends airborne, mounted, and carried first, then rolls D6 plus 0, 2, or 4 on a table giving 0 to 4 damage, with a rolled Injury Location. A fall never causes another fall. Chapter 5 sets where the soldier lands.
  - (b) Fixed damage by band: 1, 2, or 3.
  - (c) A soldier who becomes Down while airborne hangs on their wires and does not fall.
  - (d) A fall inflicts a leg Critical Injury directly instead of damage.
  - (e) As (a), but the damage comes before airborne ends, as first drafted.
- **Provisional choice:** (a).
- **Why:**
  - Exact odds under (a) that a fall alone puts a soldier Down, by current Health, low / high / extreme: Health 1: 66.7 / 100 / 100%; Health 2: 33.3 / 66.7 / 100%; Health 3: 0 / 33.3 / 66.7%; Health 4: 0 / 0 / 33.3%; Health 5 or 6: never.
  - (b) makes every high fall put a Health 2 soldier Down and never a Health 3 soldier from full, with no spread.
  - (d) bypasses Health, which ADR-0005 keeps for Titan attacks only.
  - (c) removes canon's most common image of a lost soldier, but (a) costs lives. A soldier already at 0 current Health who falls gains a Critical Injury 66.7% of the time from low and always from high or extreme. That is lethal or instant death about 10.2% and 15.3% of the time on a first Critical Injury at that Injury Location.
  - (e) lets a fall whose damage Downs an airborne soldier start a second fall at 0 current Health, which always gives a second Critical Injury from high or extreme. That happens whenever the first fall Downs the soldier: from a high fall, 66.7% of the time at current Health 2 and 33.3% at Health 3 (Opus Major 1). No canon picture needs a soldier to fall twice.
  - A horse's height does not change with the forest or the Titan, so the raise skips a fall from a horse.
  - A carrier who became Down while airborne set the comrade down at once, and being set down is never a fall, so the carrying row said the comrade fell and the closed trigger list said not (Opus review 2 Minor 4). Keeping the comrade carried until the carrier's fall makes both files agree, and matches the Grab and death rows, which already make the comrade fall.
- **Simulator case:** the "PC dies every 3 to 4 missions" target with falls after Down while airborne included. If it comes out high, the first lever is using the low band for the down-airborne trigger; the second is (c).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a). Health 6 is legal; Chapter 4's 1 to 6 range stands and the decisions' constraint is corrected to it.
- **ADR:** none

### OQ-63: Blade Sets, the handles, and the swap

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, section 4.4; `data/gear/blade-sets.yaml`.
- **Revised:** after Chapter 4 review round 1 (Opus Minors 9 and 13). Adds the rating 2 and 3 figures and corrects the "1 Pushed strike in 6" wording. The rule is unchanged.
- **Related:** OQ-01, OQ-28 (Blade Discipline).
- **Question:** The design brief counts Blade Sets as a unit, has a Pushed blade Gear Die 1 ruin the set, and makes the swap free once per turn. What holds the set in use, how does ruin meet a Talent that ignores wear, and when can a soldier swap?
- **Options:**
  - (a) The handles hold one Blade Set, and only it supplies Gear Dice and counts as had. Ruin follows any point of wear left after Talents. A swap fits a carried set into empty handles once during each of the soldier's own turns, spending nothing, and at any time outside a Titan Engagement. The handles are filled when a Titan Engagement begins.
  - (b) Every carried Blade Set counts as had, there is no handles state, and ruin removes one set.
  - (c) As (a), but a swap may also eject a sound set from full handles.
  - (d) As (a), but a Blade Set takes ordinary wear and is ruined when its current rating reaches 0. This is identical at rating 1, and a rating 3 set survives two worn Pushes.
- **Provisional choice:** (a).
- **Why:**
  - Under (b) the swap does nothing, so "free once per turn" limits nothing.
  - With (a), a soldier whose set is ruined on their own action can refit before their next strike without spending it, and a Blade Discipline use saves a set that took exactly 1 point.
  - (c) adds a way to throw away a sound set that no rule rewards.
  - Because any wear ruins a set, a higher rating makes a set more fragile per strike, the reverse of every other item. Canon's Levi goes through Blade Sets quickly, so (a) is kept. (d) departs from the brief's "a Pushed blade die 1 ruins the set" and is left for the decider, and for the Requisition rules, which must price rating 2 and 3 sets against these figures.
- **Figures:** Chapter 4, section 4.4. A simulation of 200,000 strikes per case, Pushing only when short. Rookie (Strength 4, Talent 1, Blade Set 1, Stress 1): ruined on 4.5%, 10.1%, and 13.0% of strikes needing 1, 2, or 3 successes, about 22, 10, or 8 strikes per set. Veteran (Strength 5, Talent 2, Blade Set 2, Stress 2) needing 4: 19.4%, about 5. Levi-grade (Strength 6, Talent 3, Blade Set 3, Stress 2) needing 4: 24.0%, about 4. A rating 1 set is ruined on 1 Pushed roll in 6 when Pushing whenever allowed, and about 1 in 5 when Pushing only when short.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-64: Items, a carried comrade, Overloaded, and shedding load

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, section 4.7; `data/gear/carrying.yaml` (`items_counted`, `overloaded`, `shedding`, `lifting_a_comrade`, `carrying_a_comrade`); `data/character/talents.yaml` (`strong-back`); `data/character/action-catalog.yaml` (`lift-comrade`).
- **Revised:** after Chapter 4 review round 1 (Opus Major 6 and Minors 8 and 10; Codex Major 3). A carried comrade now counts as 5 items plus every item that comrade carries, and Strong Back removes only the 5, which changes Strong Back's effect in Chapter 2. A carrier who dies or retires sets the comrade down. The Catalog's `lift-comrade` requirements point to `lifting_a_comrade`. Revised again after review round 2 (`docs/reviews/04-gear-review-2.md` Minors 5, 7, and 11). A Down comrade's items can be taken with `take-item` (OQ-65). A retiring carrier's comrade stops being carried, and a comrade set down outside a Titan Engagement holds no Position. Each kit counts as 1. The design note no longer says that dropping one's own items always clears Overloaded, and Strong Back's description matches its effect.
- **Related:** OQ-23, OQ-35, OQ-45, OQ-65, OQ-68.
- **Question:** The glossary sets the carrying limit at Strength + 4 items and what Overloaded does, but not what counts as an item, what a carried comrade counts as, how a soldier sheds load, or how carrying a comrade works. Chapter 3 leaves that to Chapter 4, and Strong Back assumes a comrade counts.
- **Options:**
  - (a) A closed list: worn ODM Gear (with its fitted canister, handles, and scabbards) and the Blade Set in the handles count as 0; each spare canister, each other Blade Set, and each kit count as 1; a carried comrade counts as 5 plus every item that comrade carries, and Strong Back removes the 5; a horse and Squad Supply count as 0. An Overloaded soldier with no unspent action cannot make an ODM move. Shedding load is free on the soldier's own turn, and dropped items leave play. Lift Comrade also needs a comrade who is not Grabbed or already carried and a lifter who carries no one. A carried comrade holds the carrier's Position, and carrying ends on the listed events, including the carrier's death or Retirement.
  - (b) Count the fitted canister and every Blade Set as items.
  - (c) A carried comrade counts as that comrade's own Strength + 4.
  - (d) A dropped item stays at its Position and can be picked up.
  - (e) As (a), but a carried comrade counts as a flat 5, their items count only against their own limit, and Strong Back removes the whole comrade, as first drafted.
  - (f) As (e), but a carried comrade counts as 6.
  - (g) As (e), but a Down or carried soldier cannot receive items.
  - (h) As (a), but Strong Back removes the comrade and their items.
- **Provisional choice:** (a).
- **Why:**
  - Under (e), a Down comrade was a container with no limit: the Squad could pass any number of spare canisters and Blade Sets to them and carry them for a flat 5 (Codex Major 3). And Strong Back did nothing for a Strength 4 carrier at Funding 3, which means every Brawler and ADR-0014's Rookie, since 3 + 5 = 8 fits a limit of 8 (Opus Major 6).
  - Under (a), a carrier and a comrade who both hold Funding 3 Standard Issue make at least 11 items, above every limit (at most 10), so Strong Back matters for every carrier. With it the load is 6 to 8: it fits Strength 4 or more always, Strength 3 unless both soldiers hold a kit, and Strength 2 unless either does. Without it, dropping all their own items clears Overloaded only for a carrier of Strength 4 or more whose comrade holds no kit; any other carrier must take items from the Down comrade and drop them, an action for each item taken.
  - (h) would bring the container back for any soldier with Strong Back. Removing only the 5 is the Codex review's version of the fix both reviews proposed.
  - (f) keeps the container. (g) forbids the Down receiver that OQ-35 decided may be passed an item.
  - (b) Overloads a Strength 2 soldier at Funding 4 before any comrade is lifted.
  - (c) makes a lifted comrade as heavy as any full load, whatever the carrier holds, and turns a light soldier into a burden no one can carry.
  - (d) needs a pick-up act, a tracked value, and item Positions for little play. A dead soldier's left items are the one exception (OQ-68), because recovering gas and Blade Sets from the fallen during a fight is the canon picture.
  - The glossary's "cost the soldier's action as well" is read so that a soldier with nothing left to pay cannot make the move.
  - The extra Lift Comrade conditions narrow the Catalog row, which names Chapters 4 and 5 as its owners and now points to `lifting_a_comrade`, so Chapter 2's match step reads them. They stop a Titan's hand from being emptied by lifting and a soldier from carrying two comrades at once.
  - A dead soldier holds no Position (Chapter 3), so a dead carrier's comrade is set down at the Position the carrier held, and falls if the carrier was airborne or mounted (Opus Minor 8).
- **Earlier-chapter change (applied):** `strong-back.effect` in `data/character/talents.yaml` reads "The comrade's own 5 items do not count toward the items you carry. The items that comrade carries still count (data/gear/carrying.yaml, items_counted)." Its `description` reads "Carrying a comrade without their weight slowing you down."
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-65: Passing an item

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, section 4.7; `data/gear/carrying.yaml` (`passing_items`); `data/character/action-catalog.yaml` (`pass-item`).
- **Revised:** after Chapter 4 review round 1 (Opus Minor 9; the Codex judgment that the entry was unsafe with OQ-64). The Catalog row now names a Grabbed receiver, as `carrying.yaml` does. Passing to a Down receiver stays, because OQ-64's revised count makes an item passed to a carried comrade count for the carrier. Revised again after review round 2 (`docs/reviews/04-gear-review-2.md` Minors 5 and 8; `docs/reviews/04-gear-review-2-codex.md` Major 4). Adds the unrolled action `take-item` and the tracked value `item-take`: a soldier takes one passable item from a Down comrade who is not Grabbed, or, in a Titan Engagement, one left item where a dead comrade's items lie (OQ-68). Passing or taking a fitted canister after ODM use makes that round's Gas Roll at once (OQ-60).
- **Related:** OQ-35, OQ-60, OQ-64, OQ-68.
- **Question:** OQ-35 creates `item-give` and `pass-item` and leaves to Chapter 4 which items can be passed, the requirement outside a Titan Engagement, and whether a thrown pass to one Position step away exists.
- **Options:**
  - (a) Passable: a spare canister, the fitted canister if it has gas, a Blade Set not in the handles, a medical kit, and a tool kit. The receiver may be Down or Grabbed. Outside a Titan Engagement, the receiver takes part in the same procedure, and passing spends nothing. There is no thrown pass.
  - (b) Only spare canisters, spare Blade Sets, and kits can be passed.
  - (c) Add a thrown pass to one Position step away as an Agility roll, and a lost item on a failure.
  - (d) As (a), but a Down or carried soldier cannot receive an item.
  - (e) As (a), with no way to take an item from a Down comrade, as first drafted.
- **Provisional choice:** (a).
- **Why:**
  - The act OQ-35 was written for is a soldier giving a comrade their own gas, which is the fitted canister. (b) forbids it.
  - (c) adds a roll, a failure state, and a lost-item rule for what one move and a pass already do.
  - (d) is the Codex review's third fix for the container. OQ-35 decided that the receiver may be Down, so the container is closed in OQ-64 instead.
  - Under (e) nobody could move an item off a Down comrade, so a Strength 2 or 3 rescuer stayed Overloaded whatever they dropped, and a spare canister the rescuer needed stayed on the comrade (Opus review 2 Minor 5). Taking is its own act with its own tracked value, `item-take`, because OQ-35 decided `item-give` as the holder giving an item. The same action takes a dead comrade's left items in a fight (OQ-68), so one new entry serves both.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a); outside a Titan Engagement, disagreement about who takes an item, or in what order, uses the `group_choices` roll-off.
- **ADR:** none

### OQ-66: Field Repair

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, section 4.8; `data/gear/field-repair.yaml`; `data/character/action-catalog.yaml` (`field-repair`, which now points to that file).
- **Revised:** after Chapter 4 review round 1 (Codex Major 4; Opus Minors 9 and 15). The prose now follows the YAML: only the tool kit supplying the roll's Gear Dice cannot be its target, and a kit at 0 can be repaired with another kit or with Wits alone. Outside a Titan Engagement, Field Repair is rolled only in the care window held when a Titan Engagement ends, or when a day passes during an Expedition, never in Downtime.
- **Related:** OQ-08, OQ-44, OQ-57.
- **Question:** What can Field Repair fix, how much does a success restore, and when can it be rolled outside a Titan Engagement?
- **Options:**
  - (a) It repairs ODM Gear or a tool kit, the soldier's own or a comrade's at the same Position, restoring 1 current rating per success. The kit supplying the Gear Dice cannot be the target, but a kit at 0 can be repaired with another kit or with Wits alone. Outside a Titan Engagement, each soldier gets one roll in each care window held when a Titan Engagement ends or a day passes during an Expedition, with Help and Covering on the care-window pattern, and a failure waits for a later window.
  - (b) Outside a Titan Engagement, Field Repair can be tried any number of times.
  - (c) Any success restores the item's full rating.
  - (d) Field Repair can also restore horses and medical kits.
  - (e) As (a), but also in the care window held when a day passes in Downtime, as first drafted.
  - (f) As (a), but a worn-out tool kit can be repaired only with another tool kit.
- **Provisional choice:** (a).
- **Why:**
  - (b) and (c) erase wear and Jams between fights, so Pushing ODM Gear would cost something only inside the fight. After review round 2, the interim issue no longer replaces Jammed ODM Gear rated at the Funding row or a kit at 0 (OQ-59), so this limit holds across session breaks as well as between fights in one session.
  - Under (e), a day window is held every day of Downtime with the whole Squad in scope. A Wits 2 soldier repairs 30.6% of the time with no Push, a Wits 4 soldier 51.8%, and an Engineer with Gearwright 1 and a kit 66.5%, so a week of Downtime restores every harness before the Maintain Gear Downtime Action is chosen (Opus Minor 15). Night camps on an Expedition keep their rolls: gear upkeep between Legs is canon, and the Expedition rules may narrow it.
  - Reusing Chapter 3's care windows adds no new timing and no new scope.
  - Medical kits are restored by medical Squad Supply and horses by Standard Issue, which keeps a use for supplies and for the Maintain Gear Downtime Action that (d) would erase.
  - Both reviews read the YAML as letting a worn-out kit be repaired with Wits alone, and the prose said the opposite (Codex Major 4). A kit at 0 supplies no Gear Dice, so repairing it with Wits alone does not use the kit on itself. (f) would strand an Engineer whose only kit wears out until the next Standard Issue.
- **Earlier-chapter change (applied):** `data/harm/treat-injury.yaml` `care_windows.gear` reads "Chapter 4 adds medical kit restocking to every care window (data/gear/squad-supply.yaml, medical_uses), and Field Repair rolls to the windows held when a Titan Engagement ends or a day passes during an Expedition (data/gear/field-repair.yaml)." Chapter 3 section 3.5 says the same.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a); the rationale is corrected (the limit keeps restoration inside care windows and Maintain Gear, and a Jam is nearly always repaired in its fight's window), and the window figures are the simulator case.
- **ADR:** none

### OQ-67: Squad Supply kinds, stock, and medical uses

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, sections 4.10 and 4.12; `data/gear/squad-supply.yaml`; `data/gear/sheet-fields.yaml` (`squad_sheet`); `data/core/bonus-dice-sources.yaml` (`medical-supplies`); `data/character/action-catalog.yaml` (`restock-medical-kit`).
- **Revised:** after Chapter 4 review round 1 (Opus Minor 14 and the Opus judgment on this entry). Restocking a kit can happen at any point in a care window, including before a Medic's own roll. The Squad sheet records the four counts. The rules expected to read ammo are named. The rows now live in their target files (OQ-69).
- **Related:** OQ-44, OQ-57, OQ-59; ADR-0009.
- **Question:** The glossary lists rations, flares, and medical supplies, ADR-0009 doubles Squad Supply on a failed Leg, the design brief adds ammo, and Chapter 3 asks Chapter 4 to state any medical use. What does Phase 1 track, how much does the Squad hold, and what can medical supplies do?
- **Options:**
  - (a) Four kinds (rations, flares, medical supplies, ammo), each a count of units held by the whole Squad and recorded on the Squad sheet. Flares and medical supplies are stocked by Funding, and rations and ammo are 0 until later rules. Flares are spent by rules that name them. Medical supplies give 1 Bonus Die on a care-window Treat Injury roll, or restock a medical kit at any point in a care window. Ammo is reserved.
  - (b) One undivided Squad Supply count.
  - (c) Supply dice rolled on each use, as Alien RPG does.
  - (d) As (a), without an ammo kind.
- **Provisional choice:** (a).
- **Why:**
  - ADR-0009's doubled cost works on any kind, and separate kinds stop a flare spent in a fight from eating the Squad's rations.
  - (c) repeats the Gas Roll's shape and adds a roll to every use.
  - Both medical uses sit outside Titan Engagements and aftermath rolls, so Chapter 3's in-fight and aftermath lethality figures (OQ-57) do not move.
  - Restocking at any point in the window lets a Medic whose kit is spent restock it before their own Treat Injury roll, so that roll gets its Gear Die. Both care windows in Chapter 3 order only rolls, so without this the timing was open.
  - Ammo is in the owner's brief. Reserving it now keeps the kind list stable for the rules beyond Phase 1 that add weapons which spend it; those rules state its stock and uses, and no Phase 1 rule reads it.
- **Review choices:** round 2: the Codex review (Minor 5) judged ammo inert Phase 2 data on the live Squad sheet and proposed removing it from the kinds and the sheet, which is (d). The Opus review judged the entry sound. The reviews conflict, and neither ADR-0009 nor a decided entry settles ammo, so the chapter keeps (a): the owner's brief names ammo, and keeping it at 0 on the sheet spares the later weapon rules a sheet change. The decider can take (d) when ruling on the glossary change.
- **Glossary change needed:** Squad Supply becomes "The shared pool of rations, flares, medical supplies, and ammo the Squad draws on in the field."
- **Simulator case:** `day`-limit Death Rolls with the care-window Bonus Die from medical supplies, against the "PC dies every 3 to 4 missions" target.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** (d): three kinds in Phase 1, no ammo kind, stock, or sheet field; one forward-reference sentence. Glossary Squad Supply unchanged.
- **ADR:** none
- **Revised by batch 7 (7-14, 7-17):** rations gain their stock by Funding (6, 7, 8, 9, 10, 12) and their uses on Legs and at night camps; ammo returns as the shot kind, stocked 0, 0, 6, 6, 8, 10 by Funding and spent by Reload (OQ-141, OQ-143).

### OQ-68: The gear of a soldier who dies or retires

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, section 4.11; `data/gear/carrying.yaml` (`leaving_play`); Chapter 3, section 3.4, and `data/harm/death-rolls.yaml` (`dying.gear`), which now point to `leaving_play`.
- **Revised:** after Chapter 4 review round 1 (the Opus judgment on this entry). Records a light form of (c) as option (d). The provisional choice is unchanged. A carrier's death or Retirement now also has a row (OQ-64). Revised again after review round 2 (`docs/reviews/04-gear-review-2-codex.md` Major 4; `docs/reviews/04-gear-review-2.md` Minor 7). The provisional choice is now (e): in a Titan Engagement a dead soldier's left items lie at the Position they held when they died, and a soldier there can take one with `take-item`. An interim Standard Issue that waits for the procedure comes after the share-out (OQ-59).
- **Related:** OQ-31, OQ-38, OQ-51, OQ-59, OQ-61, OQ-64, OQ-65.
- **Question:** What happens to a dead soldier's gear, and a retiring soldier's?
- **Options:**
  - (a) A dead soldier's ODM Gear and horse leave play. Their other items are shared out by the players among soldiers who took part, when the procedure ends and before promotion. A retiring soldier's gear leaves play.
  - (b) All of a dead soldier's gear leaves play.
  - (c) During a Titan Engagement, a comrade at the same Position can take an item from the dead with an action.
  - (d) As (a), and during a Titan Engagement a living soldier at the Position a dead comrade last held may take one passable item from them as `pass-item`, spending their action.
  - (e) As (a), and in a Titan Engagement the left items of a soldier who dies while holding a Position and not Grabbed lie at that Position until the Titan Engagement ends, recorded on the dead soldier's sheet. A soldier who is not Down and holds that Position may take one of them with the unrolled action `take-item`, which changes the tracked value `item-take`, spending their action. Items not taken are shared out as in (a).
- **Provisional choice:** (e).
- **Why:**
  - Canon's survivors take gas canisters and Blade Sets from the fallen during the fight, as at Trost. Under (a) nobody could take them until the fight ended, when gas and blades no longer save anyone (Codex review 2 Major 4).
  - A dead soldier holds no Position (Chapter 3), and (e) does not change that. It records where the items lie instead, on the dead soldier's sheet, as a dismounted horse's Position is recorded (OQ-61). That record is what (d) lacked.
  - (d) put the take on `pass-item`, whose decided row (OQ-35) is the holder giving an item. A separate `take-item` keeps that row as decided, and the same action serves a Down comrade (OQ-65).
  - (c) is (e) without a named entry or a record of where the items lie.
  - A soldier who dies while Grabbed is in a Titan's hand, so their items lie nowhere a comrade can reach, and are only shared out.
  - (b) throws away what the Squad would keep.
  - Sharing out at promotion's moment means no procedure is interrupted (OQ-31).
  - OQ-64 rejected item Positions for dropped items. A dead comrade's left items are the one case where a fight needs them.
- **Review choices:** round 1: the Codex review judged (a) sound; the Opus review asked only that (d) be recorded. Round 2: the reviews conflict, since the Opus review judged (a) sound and the Codex review judged it unsound. (e) follows the Codex review's fix 1, recording the Position in Chapter 4 instead of Chapter 5. It keeps everything the Opus review found sound (what leaves play, the share-out, and its timing), adds only the take during a fight, and changes no ADR or decided entry.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (e); the share-out is two steps (give, then unassigned items leave play); a dead soldier's canister is left only after their round's Gas Roll (OQ-60).
- **ADR:** none

### OQ-69: Rows and text Chapter 4 needs in Chapters 1 to 3

- **Type:** PROVISIONAL
- **Arose in:** Chapter 4, section 4.13. Chapters 1 to 3 were under conformance review when Chapter 4 was drafted, so none of their files was edited then.
- **Revised:** applied in the Chapter 4 fix round 1 (2026-09-14), once Chapters 1 to 3 were Done, with the additions Opus Minor 10 found missing and the earlier-chapter edits the other round 1 fixes need (items 11 to 17). Item 10 is not applied. Revised after review round 2: items 18 to 22 add the earlier-chapter edits that round's fixes need, and Chapter 4's empty file of rows for earlier chapters is removed.
- **Related:** OQ-35 (Chapter 4 cannot be Done without `item-give`, `pass-item`, and mounting), OQ-44, OQ-59 to OQ-68.
- **Question:** Chapter 4's acts and its medical Bonus Die need rows in files that Chapters 1 and 2 own, and some Chapter 2 and 3 text points to "Chapter 4" where a file now exists. What exactly changes?
- **Options:**
  - (a) Apply the changes listed below, keep each row only in its target file, and point Chapter 4's references to the target files.
  - (b) Keep the rows in Chapter 4's files, and have the Catalog and the Bonus Dice file include them by reference, as `record_on_sheet` includes `data/harm/sheet-fields.yaml`.
- **Provisional choice:** (a).
- **Changes** (all applied except item 10):
  1. `data/character/action-catalog.yaml`, `tracked_values`, after `comrade-carry`: the rows `item-give`, `mount-change`, `blade-set-swap`, and `load-shed`.
  2. `data/character/action-catalog.yaml`, `entries`, after `change-canister`: `pass-item` (action, never rolled), and the options `mount-or-dismount`, `swap-blade-set`, `shed-load`, and `restock-medical-kit`.
  3. `data/core/bonus-dice-sources.yaml`, `sources`, after `grounded-titan`: `medical-supplies`.
  4. `docs/rules/02-character-creation.md` section 2.8, *Groups of entries*: `pass-item` joins the actions used in and out of a Titan Engagement, and a new bullet lists the options Chapter 4 adds and how they work outside a Titan Engagement.
  5. `docs/rules/02-character-creation.md` section 2.9, design note (OQ-27, OQ-35): it lists the four tracked values, `pass-item`, and the four options.
  6. `data/harm/death-rolls.yaml`, `dying.gear`, and `docs/rules/03-harm-and-mind.md` section 3.4, *Dying*: both point to `leaving_play` in `data/gear/carrying.yaml`.
  7. `data/harm/down.yaml`, `set_by_other_chapters`: the airborne-or-mounted item points to `data/gear/falls.yaml`.
  8. `data/harm/treat-injury.yaml`: `squad_supply` points to `data/gear/squad-supply.yaml` and the `medical-supplies` source; `care_windows.gear` gives the OQ-66 pointer. `docs/rules/03-harm-and-mind.md` section 3.5, *Talents and supplies*: the Chapter 4 bullet names the medical uses, the Bonus Dice row, and the Field Repair windows.
  9. `data/character/squadmates.yaml`, `stat_block.gear`: points to `squad_sheet_row` in `data/gear/sheet-fields.yaml`.
  10. `CONTEXT.md`: the Standard Issue glossary change under OQ-59 and the Squad Supply glossary change under OQ-67. **Not applied:** the glossary belongs to the decider.
  11. `docs/rules/02-character-creation.md` section 2.6: a Specialty adds nothing to Standard Issue except the kit Chapter 4 gives a Medic or an Engineer (`by_specialty`).
  12. `data/character/action-catalog.yaml`: `lift-comrade.requirements` points to `lifting_a_comrade` and states the Titan Engagement case; `field-repair` gets `needs: 1` and points to `data/gear/field-repair.yaml` for its requirements and Help; `change-canister` and `gas-roll` point to `data/gear/odm-gear.yaml`.
  13. `data/character/action-catalog.yaml`: `nape-strike`, and `body-part-strike` made from On Body or Blind Spot, need ODM Gear that counts as had; `docs/rules/02-character-creation.md` section 2.8 says so (OQ-60).
  14. `data/character/talents.yaml`, `strong-back.effect`: it removes the carried comrade's own 5 items only (OQ-64).
  15. `pass-item.requirements`: the receiver may be Down or Grabbed (OQ-65).
  16. `option_of` for `mount-or-dismount`, `swap-blade-set`, and `shed-load` names the case outside a Titan Engagement, where there are no moves or turns (OQ-61).
  17. Chapter 4 keeps no file of its own for rows in earlier chapters' files. Every row lives only in its target file, and section 4.13 lists them.
  18. `data/character/action-catalog.yaml`: the tracked value `item-take` and the unrolled action `take-item` (OQ-65, OQ-68); the `nape-strike` and `body-part-strike` requirements apply in a Titan Engagement (OQ-60); `mount-or-dismount.option_of` names the time when no procedure is under way (OQ-61).
  19. `docs/rules/02-character-creation.md` section 2.8: `take-item` joins the actions used in and out of a Titan Engagement, and the strike requirement is scoped to a Titan Engagement. Section 2.9's design note lists `item-take` and `take-item`.
  20. `docs/rules/02-character-creation.md` section 2.10, design note (OQ-29, OQ-58): a Squadmate's ODM use spends gas, and because it never Pushes its gear never wears and its Blade Sets are never ruined (Opus review 2 Minor 9).
  21. `docs/rules/02-character-creation.md` section 2.6: the kits come to a Medic or an Engineer through Standard Issue, worded so it no longer reads as a contradiction (Opus review 2 Minor 11). This replaces item 11's wording.
  22. `data/character/talents.yaml`, `strong-back.description`: "Carrying a comrade without their weight slowing you down." (Opus review 2 Minor 11).
- **Why:**
  - ADR-0012 needs one source per row, and OQ-35 names the Catalog as the home of `item-give` and `pass-item`.
  - Making mounting, the swap, shedding load, and restocking into Catalog options means Chapter 2's procedure for actions outside the Catalog matches them at its *match* step, with no change to its steps. A special case like `position-change` would need one.
  - (b) would make the Catalog incomplete on its own, and the Catalog is the list Talents name.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** Keep (a); item 10 applied for Standard Issue and withdrawn for Squad Supply.
- **ADR:** none

### OQ-70: The reference Rookie's Talent

- **Type:** Unresolved Major
- **Arose in:** Chapters 1 to 3 decisions conformance review, round 2: `docs/reviews/01-03-decisions-conformance-review-2.md`, finding 1 (Major). Chapter 3, section 3.2, design note *Reference builds (OQ-58)* ("the Slayer Squadmate template, with Health 4 and Resolve 3, and the victim in the lone-Rookie Grab model in section 3.7"); section 3.7, the lone-victim model ("Strength 4, Grip Breaker 1") and the OQ-50 rescue probe ("The rescuers have Strength 4, Talent 1"); section 3.12, *Acceptance test for Chapter 5 (OQ-50)*. The same identity is stated in Chapter 2, section 2.2 (OQ-19 design note) and section 2.10 (*The stat block*: "The simulator's reference Rookie is the Slayer template"), `data/character/squadmates.yaml` (`stat_block.matches_reference_build`, the `templates` comment, `templates[slayer].talent: {id: clean-cut, level: 1}`), and ADR-0014's OQ-58 amendment ("the Slayer template: Health 4, Resolve 3").
- **Related:** OQ-19, OQ-29, OQ-50, OQ-58.
- **Question:** ADR-0014's body gives the Rookie "Talent 1", and every Grab figure in Chapter 3 reads that as level 1 in the Talent that names the roll measured: Grip Breaker 1 on Break Free for the lone victim, and a Talent on the hand strike for the rescuers. OQ-58 fixed the Rookie's attributes by pointing at the Slayer template, and Chapter 2, `squadmates.yaml`, and the 3.2 note now say the reference Rookie *is* that template. The Slayer template's only Talent is Clean Cut 1, which names only `nape-strike`, so a Slayer-template soldier has no Talent dice on Break Free or any Body Part strike. Grip Breaker 1 belongs to the Brawler template, which has the same attributes. The review's lone-Grab model gives a fresh Strength 4 victim death 60.4% of the time with Grip Breaker 1 and 69.0% with the Slayer template's Talents. Rescuers built from the template lose a die on every hand strike, which raises every OQ-50 comrades-close cell (worst passing cell 40.6%). A Squad of Slayer templates also has no Talent on Body Part strikes for the prepared-Squad kill target. Two simulator authors can each cite a decided text and get two Grab baselines, the split OQ-58 was decided to remove. Which Talent does the reference Rookie have on each roll a target measures?
- **Options:**
  - (a) Keep OQ-58's attributes and say so exactly. The reference Rookie has the Slayer template's attributes (and so Health 4 and Resolve 3), and Talent 1 in the Talent that names each roll a target measures, as ADR-0014's body says. ADR-0014's amendment reads "the Slayer template's attributes". The 3.2 note, Chapter 2 sections 2.2 and 2.10, and `matches_reference_build` read "has the Slayer template's attributes". The Grab models stay as they are (review fix 1).
  - (b) Name one Talent that covers the measured rolls: "Strength 4, Agility 3, Wits 2, 3 elsewhere, Blade Discipline 1" in ADR-0014 and the 3.2 note (review fix 2). As written this does not work: `talents.yaml` makes `blade-discipline` a `rule` Talent (ignore 1 point of Blade Set wear), not a `dice` Talent, so it adds no dice to any roll. The dice Talents that name the measured rolls are `clean-cut` (`nape-strike`), `hamstringer` (`body-part-strike`), and `grip-breaker` (`break-free`), one each.
  - (c) Keep the template identity literally and re-measure the lone Grab, the six-cell OQ-50 probe, and the prepared-Squad kill target with no Talent on Break Free or Body Part strikes (review fix 3). Chapter 3's 60% becomes about 69%, and Chapter 5 tunes the Grab against that.
  - (d) Name a buildable player character instead of a Squadmate template: the Slayer template's attributes with Clean Cut 1, Hamstringer 1, and Grip Breaker 1. A new player character takes one Talent level from its Origin, one per Training Year event, and one from its Specialty (Chapter 2, sections 2.3.1, 2.3.3, and 2.3.4), so it can hold all three. The Lifepath and Specialty lists must be checked to confirm the combination is reachable. A Squadmate holds one Talent, so the reference Squad's 2 Squadmates would then differ from the 4 player characters.
  - (e) (a) for tuning, and also report, not tune, each Talent-dependent target (the lone Grab, the OQ-50 cells, the prepared-Squad kill) for a Squad built literally from `squadmates.yaml` templates. This mirrors OQ-58's pattern of tuning on the reference build and reporting a Health 3 Squad beside it, and shows the table what a Squadmate-heavy Squad faces.
- **Current handling:** the chapter text, unchanged. Chapter 3 section 3.2 says the reference Rookie is the Slayer Squadmate template and the victim in the section 3.7 lone-Rookie Grab model. Section 3.7 measures that victim with Grip Breaker 1 and the rescuers with Talent 1, and quotes about 60% for a lone fresh victim. Chapter 2 sections 2.2 and 2.10, `squadmates.yaml`, and ADR-0014's OQ-58 amendment name the Slayer template as the reference Rookie.
- **Why still open:** Chapters 1 to 3 have had their second and last conformance round, and the round-2 reviews must stay accurate reviews of the current text, so no fix was applied. The fix changes ADR-0014's wording, so it needs the decider, and it must be settled before the ADR-0014 simulator fixes the Grab baseline that Chapter 5 tunes against. It awaits the next decision pass. (b) fails as written. (a) is the smallest change and keeps every Chapter 3 figure. (e) adds the report that shows what the rest of the Squad faces. (c) and (d) would re-measure or re-state figures that Chapter 5 has not yet used.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** (a) with (e): the reference Rookie has the Slayer template's attributes and Talent 1 in the Talent that names each measured roll; the Grab models stand; Talent-dependent targets are also reported for a Squad built from the templates. Revised by batch 2b (OQ-91): narrowed to the Nape strike, the Body Part strike, Break Free, and Treat Injury; no Talent dice on the dodge, Fly, Break Attention, Ride, or Read, nor on any other roll a target measures (batch 3, OQ-94).
- **ADR:** ADR-0014

### OQ-71: Open Minor findings from the Chapters 1 to 3 conformance round 2

- **Type:** Unresolved Minor batch
- **Arose in:** `docs/reviews/01-03-decisions-conformance-review-2.md` (Minors 2 to 7) and `docs/reviews/01-03-decisions-conformance-review-2-codex.md` (Minors 1 to 3). Neither review found a Critical. The only Major is OQ-70.
- **Related:** OQ-12, OQ-17, OQ-18, OQ-19, OQ-25, OQ-28, OQ-36, OQ-52, OQ-58, OQ-70.
- **Question:** The next decision and fix pass should settle each Minor below. Each line gives the review file, finding number, chapter and location, and the problem. The review files hold the scenarios and fix options.
- **Findings:**
  1. `01-03-decisions-conformance-review-2.md`, Minor 2. Chapter 3, section 3.2, *Reference builds* note and ADR-0014's OQ-58 amendment, against Chapter 2, sections 2.2 and 2.10, and OQ-58. ADR-0014 and 3.2 build the Health 3 report Squad by moving every soldier to Strength 3, while Chapter 2 and OQ-58 change only Health, so the report would show an 8.5-point Grab gap (60.4% against 68.9%) that Health does not cause.
  2. `01-03-decisions-conformance-review-2.md`, Minor 3. Chapter 3, section 3.2, *Reference builds* note, and ADR-0014's OQ-19 and OQ-58 amendments. The Veteran build (Strength 5, Agility 3, 3 elsewhere) totals 20 attribute points, which no soldier can have (18, or 19 with a Top 10 Class Rank, Chapter 2 section 2.2).
  3. `01-03-decisions-conformance-review-2.md`, Minor 4. Chapter 2, section 2.7, OQ-28 design note; `data/character/talents.yaml` `sure-seat.description`; ADR-0015's amendment. Sure Seat's player description still promises protection on "a hard ride", and ADR-0015 still says every Pushed mounted dodge wears the horse, both wordings round 1 flagged.
  4. `01-03-decisions-conformance-review-2.md`, Minor 5. Chapter 1, section 1.10, *Acts in this chapter*, and section 1.9, *Reactions*, "When the Titan Engagement ends". The act block says every listed act has a Catalog entry but lists the move, and the end bullet cancels only turns spent in advance by a Reaction, not actions a result spent.
  5. `01-03-decisions-conformance-review-2.md`, Minor 6. Chapters 1 and 3 YAML: `data/core/bonus-dice-sources.yaml` `help`, `data/core/stress-changes.yaml` `cover`, `data/harm/down.yaml`, `data/mind/fear-rolls.yaml`, and `data/harm/effect-types.yaml` `no-reactions`. Their `decided:` tags omit OQ-17, OQ-18, and OQ-52, which those rows implement.
  6. `01-03-decisions-conformance-review-2.md`, Minor 7. Chapter 3, section 3.17, *Every act in this chapter has a Catalog entry*, and `CONTEXT.md` Down. The act check names entries without tracked values and pairs a Death Roll with `death-roll`, whose `changes` is empty, and glossary Down still says "Reaching 0 Health" where it means current Health.
  7. `01-03-decisions-conformance-review-2-codex.md`, Minor 1. Chapter 2, sections 2.2 and 2.3.4; Chapter 3, section 3.2; `DECISIONS-2026-09-14.md` Health-box rule 13 and the Chapter 4 constraints. A legal Lifepath with a swap and a Top 10 Class Rank reaches Strength 6 and Agility 5 (Health 6), but Chapter 3 reports Health 2 to 5 and Chapter 4 is told to size damage for current Health 1 to 5.
  8. `01-03-decisions-conformance-review-2-codex.md`, Minor 2. Chapter 1, section 1.5, *Pushing and gas*; ADR-0015's amendment; `DECISIONS-2026-09-14.md` OQ-12 and OQ-25. ADR-0015 and the decisions say a Pushed dodge made with the horse wears the horse without Chapter 1's condition that only final Gear Dice showing 1 do.
  9. `01-03-decisions-conformance-review-2-codex.md`, Minor 3. Chapter 2, section 2.7 and its OQ-28 design note; `data/character/talents.yaml` `sure-seat`. The description advertises a Hard Ride use that the Talent's `once_per_titan_engagement` limit forbids outside a Titan Engagement.
- **Overlaps:** items 3, 8, and 9 are one fix in two parts, the ADR-0015 sentence and the Sure Seat description. Items 1, 2, and 7 all touch the ADR-0014 reference and report builds and should be decided with OQ-70.
- **Current handling:** the chapter, YAML, ADR, and glossary text, unchanged.
- **Why still open:** the round-2 conformance reviews must stay accurate reviews of the current text, and Chapter 4 is under review against it. Items 1, 2, 3, 6, 7, and 8 need ADR, glossary, or decisions-file edits, which belong to the decider. Every item awaits the next decision and fix pass.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** All nine ruled: report Squad is the reference Squad with Health set to 3; Veteran Wits 2 (19 points); Sure Seat description and ADR-0015 wear sentence corrected; Chapter 1 act block and end bullet; `decided:` tags; Chapter 3 act check with tracked values and glossary Down "0 current Health"; Health 6 legal and reported.
- **ADR:** ADR-0014, ADR-0015

### OQ-72: How often rating 1 ODM Gear Jams for the soldier holding Attention

- **Type:** Unresolved Major (it cannot be fixed without an ADR change; first logged as an ADR question)
- **Arose in:** Chapter 4 review round 1, `docs/reviews/04-gear-review-1.md` Major 3. Chapter 4, section 4.9, the design note and its `PROVISIONAL (OQ-72)` block; `data/gear/standard-issue.yaml` (`by_funding`, `odm_gear_rating: 1` at Funding 1 to 5); section 4.2, *Jam*; `data/gear/falls.yaml` (`jam-airborne`).
- **Revised:** after Chapter 4 review round 2 (`docs/reviews/04-gear-review-2.md` Major 3, carried; `docs/reviews/04-gear-review-2-codex.md` judged the log sound as an open acceptance test). Option (a)'s test now covers cards from every Titan that acts on the soldier in a round, the two-Titan figures are added, and the entry asks the decider to settle it before Chapter 5 is drafted.
- **Related:** OQ-01, OQ-25, OQ-58, OQ-59, OQ-62; ADR-0014, ADR-0015.
- **Question:** A Pushed roll on rating 1 ODM Gear Jams it whenever its one Gear Die shows 1, and a Jam while airborne at On Body or Blind Spot is a high fall. OQ-59 set a threshold of about a third of fights. The soldier who holds a Titan's Attention and dodges every round Pushes often, and a Squadmate never Pushes, so every Jam from wear lands on a player character. Does rating 1 Jam too often, and if so, which lever moves it?
- **Options:**
  - (a) Keep rating 1 at Funding 1 to 5, and make the threshold a binding Chapter 5 test: at the Severity and Tempo Chapter 5 sets, the soldier who holds Attention and dodges for three rounds, receiving cards from every Titan that Chapter 5 lets act on them in a round, Pushing when short with Stress rising, and with Stress Responses, Help, and Covering applied, Jams in no more than a third of those fights.
  - (b) ODM Gear rated 2 at Funding 3 and 4, with ADR-0014's Rookie amended to Gear Dice 2 for ODM Gear (OQ-59 (b)).
  - (c) Keep rating 1, but the first point of wear on ODM Gear in each Titan Engagement only marks it, and the next point lowers its current rating. The mark clears when the Titan Engagement ends.
  - (d) Keep rating 1, and use the low band for a Jam's fall (OQ-62's lever), so a Jam costs less without happening less often.
  - (e) As (c), but the first-wear mark applies only in a round in which a second Titan's card reaches the soldier, which leaves the one-Titan figures unchanged.
- **Current handling:** (a), with the widened test. Chapter 4 section 4.9 quotes the figures below, including the two-Titan case, and marks the rating `PROVISIONAL (OQ-72)`.
- **Why:**
  - ADR-0014 fixes the Rookie's Gear Dice at 1, and the Funding 3 row is that Rookie. (b) is the cleanest lever, but it needs ADR-0014 amended, which a drafter cannot do.
  - With Stress rising on each Push, the worst-case soldier Jams within 3 rounds 27.8% to 32.2% of the time at Severity 2 to 4: just under the threshold, not over it. The fixed-Stress figures the chapter first quoted (52.7% within 5 rounds) overstated Pushing.
  - (c) needs a new mark on every sheet and on the Squad row, and at rating 1 it makes Well-Kept Rig, which ignores 1 point of wear once per Titan Engagement, close to redundant.
  - (d) cuts lethality, not frequency, and no canon picture supports a Jam at Blind Spot that lands low.
  - Canon soldiers die to Titans, empty canisters, and lost Blade Sets far more often than to a failed harness. That is the case for (b), or (c), if Chapter 5's test fails.
  - One dodge covers one Titan's cards (ADR-0015), so a soldier whom a second Focus Titan's cards reach makes two dodges a round. Rating 1 then Jams within 3 rounds 42.1% of the time at Severity 2 and 46.9% at Severity 3, above the threshold, where one Titan gives 28.0% and 31.7% (Opus review 2 Major 3, reproduced in fix round 2). The first test measured one Titan only, so (a) now names every Titan that acts on the soldier.
  - (b) moves the reference dodge that Chapter 5 tunes Severity against (a Rookie's Severity 3 dodge goes from 24% to 29%, OQ-25), so it is cheapest to decide before Chapter 5 is drafted. The decider should settle this entry before then.
  - The decisions file's Chapter 5 constraints do not yet carry this test, and a drafter cannot edit that file. Whichever option is decided, the decider records the test there.
  - Review choices: the Opus review carried this as a Major, and the Codex review judged the log sound as an open acceptance test. Both leave the question to the decider, because (b) needs ADR-0014 amended. The entry takes the Opus review's fixes 1 and 2 and keeps (e) as a recorded option.
- **Figures:** Agility 3, one ODM Gear roll a round, Stress starting at 1 and rising by 1 on each Push, Pushing only when short of the Severity, Stress Responses not applied, 100,000 runs per case (Chapter 4, section 4.9). Rating 1 Jams within 3 rounds 27.8%, 31.6%, and 32.2% of the time at Severity 2, 3, and 4; within 5 rounds 38.0%, 42.9%, and 44.0%; and no later than a full canister empties 45.0%, 49.3%, and 50.1%. Rating 2 Jams within 3 rounds 8.3%, 10.5%, and 11.0% of the time. The Opus review's independent run gave 27.8% and 31.5% within 3 rounds at Severity 2 and 3. With two dodges a round, one per Titan, Stress carried between them, gas ignored, over 3 rounds (fix round 2 re-run, 100,000 runs per case): rating 1 Jams 42.1% and 46.9% of the time at Severity 2 and 3, and rating 2 18.1% and 22.4%. The Opus review 2 run gave 41.9%, 46.9%, 17.8%, and 22.7%.
- **Simulator case:** the soldier holding Attention across Chapter 5's Severity and Tempo, including rounds in which a second Titan's cards reach them, with Stress Responses, Help, Covering, and turn debt applied. Report the share of fights of about 3 rounds with a Jam, and the PC death target with Jam falls included. If the share is above a third, the first lever is (b), then (c).
- **Round-3 note:** `docs/reviews/04-gear-review-3.md` M1: The figures reproduce (31.4% of 3-round fights at Severity 3 with one Titan and 47.2% with two, above this entry's one-third threshold, with every airborne Jam at On Body or Blind Spot a high fall and every Jam from wear landing on a player character), the widened test is still absent from the decisions file's Chapter 5 constraints, and the fixes are to settle this entry before Chapter 5 is drafted and record the test there, to adopt (b) with ADR-0014 amended, or to adopt (e), so it stays open as an Unresolved Major.
- **Round-3 note:** `docs/reviews/04-gear-review-3-codex.md` M1: An independent 500,000-fight run gives 42.0% and 46.9% at Severity 2 and 3 with two Titans, so the rating 1 choice already fails the widened test and (a) only postpones a known failure into Chapter 5, and the fixes are (b) with ADR-0014's ODM Gear Dice amended, (e), or, if (a) stays, requiring Chapter 5 to show the full model under one-third before any Severity or Tempo value is accepted, so it stays open as an Unresolved Major.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** (b): ODM Gear rated 2 at Funding 3 to 5 and 3 at 6, ADR-0014's Rookie with ODM Gear Dice 2; the widened Jam test binds Chapter 5 and is recorded in the decisions file's constraints; (c), (d), and (e) rejected. Revised by batch 2b (OQ-92): horses follow the same ladder.
- **ADR:** ADR-0014

### OQ-73: Open Minor findings from Chapter 4 review round 3

- **Type:** Unresolved Minor batch
- **Arose in:** `docs/reviews/04-gear-review-3.md` (Minors 2 to 7) and `docs/reviews/04-gear-review-3-codex.md` (Minors 3 and 4). Neither review found a Critical. The Majors are OQ-72 (both reviews) and OQ-60 (Codex finding 2).
- **Related:** OQ-59, OQ-60, OQ-61, OQ-65, OQ-66, OQ-67, OQ-68, OQ-72.
- **Question:** The next decision and fix pass should settle each Minor below. Each line gives the review file, finding number, location, and the problem. The review files hold the scenarios and fix options.
- **Findings:**
  1. `04-gear-review-3.md`, Minor 2. `data/gear/odm-gear.yaml` `gas_roll.canister_removed`; `data/gear/carrying.yaml` `passing_items.passable`, `taking_items.effect`, and `leaving_play.death.left_for_the_squad`; sections 4.3 and 4.7. The Gas Roll made at once can empty a canister being passed or taken with no rule for what reaches the receiver, and no rule says whether a soldier who dies after ODM use makes that round's Gas Roll before the fitted canister becomes a left item.
  2. `04-gear-review-3.md`, Minor 3. `data/gear/field-repair.yaml` `target.whose.outside_titan_engagement` and `outside_titan_engagement.rolls`; section 4.8; section 4.9 `PROVISIONAL (OQ-59)`; the *Why* of OQ-59 and OQ-66. Every soldier in the end-of-fight care window can aim their one Field Repair roll at the same harness, so a Jam outlasts its fight only when most of the Squad is Down, and the stated reason that wear carries between sessions seldom holds.
  3. `04-gear-review-3.md`, Minor 4. `data/gear/standard-issue.yaml` `receiving.steps` (`odm-gear`, `horse`, `decline`); section 4.9, *Receiving it*, steps 1, 4, and 6; OQ-59 (a). A full issue replaces Jammed ODM Gear or a lame horse at the Funding row's rating with no way to decline, so a broken item rated above the row is downgraded, and the interim issue does the same to a horse.
  4. `04-gear-review-3.md`, Minor 5. `data/gear/carrying.yaml` `taking_items.requirements.outside_titan_engagement` and `spends.outside_titan_engagement`; section 4.7, *Taking an item*. Outside a Titan Engagement no rule orders two takes of the same item or settles a disagreement, while Field Repair order and the share-out both use the `group_choices` roll-off in `data/character/lifepath.yaml`.
  5. `04-gear-review-3.md`, Minor 6. `data/gear/horses.yaml` `horse_position` and `mounted.mount.requirements.in_titan_engagement`; `data/gear/carrying.yaml` `leaving_play.death.where_left` and `taking_items.requirements.in_titan_engagement`; `data/gear/sheet-fields.yaml` `horse.position`, `left_at`, and the Squad row marks; the introduction's Chapter 5 list. A recorded horse or left-item Position names no Focus Titan, so the mount and take tests read two ways once a second Focus Titan is in play.
  6. `04-gear-review-3.md`, Minor 7. `odm-gear.yaml` `gas_roll.canister_removed`; section 4.1, *Restoring*; OQ-72 *Why*; section 4.3, gas design note; `horses.yaml` `forced_dismount`. Wording and figure slips: a garbled dice phrase in `canister_removed`, section 4.1 saying the interim issue never replaces Jammed ODM Gear, OQ-72's *Why* giving 28.0% and 31.7% against its own 27.8% and 31.6%, the Rookie Push-when-short gas figures given only as means, and only the Grabbed forced dismount saying the horse stays at the Position.
  7. `04-gear-review-3-codex.md`, Minor 3. Sections 4.10 and 4.12; `data/gear/squad-supply.yaml` `kinds.ammo` and `stock.ammo`; `data/gear/sheet-fields.yaml` `squad_sheet`. Ammo is still a live Squad Supply kind recorded at 0 on every Squad sheet, though no Phase 1 rule reads or changes it.
  8. `04-gear-review-3-codex.md`, Minor 4. Section 4.11, *Sharing out*; `data/gear/carrying.yaml` `leaving_play.death.shared_out`. The closing clause "or leave it, and then it leaves play" can be read to make an item just given to a living soldier leave play as well.
- **Overlaps:** item 1's first part is the Codex Major logged under OQ-60 and should be fixed with it. Item 6's OQ-72 figure slip should be corrected when OQ-72 is decided. Items 2 and 3 both touch OQ-59's issue rules and its *Why*, and item 2 bears on the cost of a Jam the decider weighs under OQ-72. Item 7 is the ammo conflict between the round 2 reviews that OQ-67 already leaves to the decider with its glossary change. Items 1, 4, and 5 all touch Take Item (OQ-65, OQ-68).
- **Current handling:** the chapter, YAML, and OPEN-QUESTIONS text, unchanged.
- **Why still open:** Chapter 4 has had its third and last review round, and the round-3 reviews must stay accurate reviews of the current text, so no fix was applied. Item 7 depends on OQ-67's glossary change, and items 1, 2, 3, and 6 change the reasoning or figures of OQ-59, OQ-60, OQ-66, and OQ-72, which the decision pass settles first. Every item awaits the next decision and fix pass.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2*)
- **Decision:** All eight ruled: handover and death Gas Roll (OQ-60); Field Repair rationale (OQ-66); decline the exchange (OQ-59); take roll-off (OQ-65); Focus Titan on recorded Positions (OQ-61); all wording slips fixed; ammo removed (OQ-67); share-out in two steps (OQ-68).
- **ADR:** none

### OQ-74: Anchor Ratings, kinds of move, and Position steps

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.2; `data/engagement/anchor-ratings.yaml`, `data/engagement/positions.yaml` (`moves`)
- **Related:** OQ-23, OQ-60, OQ-61, OQ-62
- **Question:** The glossary says an Anchor Rating decides which Position changes ODM Gear allows, and Chapter 1 gives a move one Position step as a baseline. No ADR says which steps exist at each rating, which of them a move on foot or a mounted move can make, what a grounded Titan changes, or how a soldier at On Body or Blind Spot with no working ODM Gear gets down.
- **Options:** (a) One step graph per rating. Every rating joins Distant and In Reach, and In Reach and On Body; every rating but Open also joins On Body and Blind Spot. Sparse adds In Reach to Blind Spot with a Fly roll (failure ends at On Body), Wooded adds it with no roll, Urban adds it and Distant to Blind Spot with a Fly roll (failure ends at In Reach), and Giant Forest adds both with no roll. Open's Distant to In Reach step is made on foot or mounted only, and nothing reaches Blind Spot at Open until the Titan is grounded, when a step on foot or by ODM joins On Body and Blind Spot (a soldier holding Blind Spot there holds On Body once it stands). A mounted move makes only the Distant to In Reach step, and not at Urban. A grounded Titan lets moves on foot make its close steps. Any soldier at On Body or Blind Spot may let go, a rule-named fall. (b) One graph at every rating, with the rating changing only Fly roll needs. (c) Ratings change how many moves a step takes.
- **Provisional choice:** (a).
- **Why:** (a) makes the rating decide what ODM Gear allows, as the glossary says, one row per step with nothing to judge. Open is the plain where only a horse helps; Giant Forest is where the Survey Corps fights best. Mounted soldiers never reach a Titan's body, which matches canon and Chapter 4's dismount on an ODM move. Letting go gives a Jammed or dry soldier a way down whose price is a fall, and a grounded Titan is one soldiers can climb. (b) wastes the rating, and (c) breaks Chapter 1's one-step baseline. The prepared-Squad figures use the Wooded graph.
- **Revised (Chapter 5 review round 1):** Codex finding 8 showed that Open's On Body to Blind Spot step had no anchor to hold a soldier behind a standing Titan. The step now exists at Open only while the Titan is grounded, lying where its Nape is reached from the ground; Open's other rows are unchanged. The chapter prose also now says a mounted move cannot make the Urban Distant to In Reach step (Opus finding 15).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a): one step graph per Anchor Rating, Open's Blind Spot only while the Titan is grounded, letting go as a rule-named fall; the Fly roll needs are simulator starting values.
- **ADR:** none

### OQ-75: Positions relative to two Focus Titans, placement, and recorded Positions

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, sections 5.1 and 5.2; `data/engagement/positions.yaml` (`comparison`, `two_focus_titans`, `placement`, `horses`, `left_items`)
- **Related:** OQ-23, OQ-56, OQ-61
- **Question:** Chapter 4 (OQ-61) asks how a soldier's Positions relative to two Focus Titans relate, what a recorded horse or left-item Position becomes when its Focus Titan dies, where soldiers and horses start, whether any rule moves a horse or left items, and whether a behavior can target a horse. Rules that compare two soldiers' Positions (Help, Covering, Treat Injury, Pass Item) also need to know which Titan they compare against.
- **Options:** (a) A Position per Focus Titan, with one close rule: a soldier never holds On Body or Blind Spot relative to two Titans at once, and the other drops to In Reach. A Titan that enters starts Distant from everyone. Records naming a dead Titan become Distant relative to the living Focus Titan with the earliest label. Everyone starts Distant, mounted or not as they were, unless the rule that begins the Titan Engagement names other starting Positions (no Phase 1 rule does). Only a rider's move moves a horse (a riderless horse that succeeds as a decoy leaves the Titan Engagement instead), nothing moves left items, and no effect type affects a horse. A comparison uses the Titan the roll or act names, otherwise the earliest living label. (b) One Position shared across Focus Titans. (c) A Position per Titan with no close rule.
- **Provisional choice:** (a).
- **Why:** (b) makes a second Titan change nothing, and (c) lets a soldier hook into two Titans at once. A Titan arriving from outside the fight is Distant from everyone. Starting Distant is placement by a rule (OQ-23), so no Drive fires on it. Naming the compared Titan keeps Help and Covering on a strike or a dodge honest when the two Titans' Positions differ.
- **Revised (Chapter 5 review round 1):** the chapter prose now states the starting-rule exception that `positions.yaml` already had (Codex finding 14), and a decoy horse no longer moves to Distant but leaves (Opus finding 2, OQ-81).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a): a Position per Focus Titan with the close rule; records naming a dead Titan become Distant relative to the earliest living label; everyone starts Distant; only a rider's move moves a horse and no effect type affects one; the riderless-horse decoy compares Positions relative to the Focus Titan recorded with the horse (OQ-99 item 2).
- **ADR:** none

### OQ-76: Leaving, soldiers who left, a Down soldier's move, and where a fall lands

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, sections 5.2 and 5.11; `data/engagement/positions.yaml` (`moves.down_soldier`, `moves.letting_go`, `falls_land`, `leaving`)
- **Related:** OQ-45, OQ-56, OQ-62, OQ-64, OQ-65, OQ-66
- **Question:** Chapter 3 (OQ-45, OQ-56) and Chapter 4 ask Chapter 5 how a soldier leaves a Titan Engagement, what their move and action can do after, whether soldiers who left count as the same Position for Field Repair, Pass Item, Take Item, and Lift Comrade, which Position changes a Down soldier's move can make, and which Position a fall leaves a soldier at.
- **Options:** (a) A soldier leaves with a move while Distant relative to every Focus Titan and not Down, Grabbed, or carried. They still take turns, can return with a later move (not during a retreat), and can take any Catalog entry that needs no Position relative to a Titan. All soldiers who left count as one Position for every rule that compares Positions, and never as the same Position as, or one step from, a soldier who still holds one. A Down soldier's move can make only the step from In Reach to Distant on foot. A fall from On Body or Blind Spot lands In Reach; a fall from In Reach or Distant keeps the Position. (b) Leaving is final. (c) A Down soldier's move changes nothing.
- **Provisional choice:** (a).
- **Why:** Chapter 3 already treats soldiers who left as one Position for Treat Injury and Rally; extending that to Chapter 4's acts keeps one rule. Returning lets a soldier carry a comrade clear and come back. A crawl out of reach gives a Down soldier's move one use without letting them leave the scene. Landing In Reach matches Chapter 4, which bands falls from On Body and Blind Spot as high.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-77: Initiative cards, swapping, Wings, and end steps

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.3; `data/engagement/round.yaml`
- **Related:** OQ-16, OQ-17, OQ-29, OQ-60
- **Question:** ADR-0010, Chapter 1, and Chapter 2 name initiative cards, Tempo, swapping cards, and Wings. None says what the cards are, who may swap and when, when Wings are set, what a Squadmate on no Wing does, or the order of the round's end steps.
- **Options:** (a) Twenty numbered cards dealt face up each round: one to each player character and each Squadmate on no Wing, and Tempo cards to each Focus Titan. A soldier takes a turn's move and action in either order, never splitting the move around the action, and a Wing Squadmate acts after the whole turn. A swap step before the first card lets two soldiers, neither Down nor Grabbed and within one Position step, exchange cards, once each per round, never with a Titan. Wings are assigned at the start of every round; a Squadmate on no Wing draws its own card. End steps run Gas Rolls, then Regeneration, then Background clocks. (b) Wings fixed for the whole Titan Engagement. (c) Swaps between any two soldiers, wherever they are.
- **Provisional choice:** (a).
- **Why:** Distinct numbers make ties impossible, and face-up cards let the Squad plan. The one-step limit makes swapping a teamwork lever tied to Position, like Help (ADR-0010). Assigning Wings each round absorbs Squadmate losses with no special rule. Gas Rolls come first as Chapter 4 expects, and Regeneration comes before Background clocks so a Titan entering at the end of a round starts clean the next.
- **Revised (Chapter 5 review round 1):** Chapter 1 delegates the order of a turn's move and action here, and the draft never gave it (Opus finding 5). `round.yaml` now has `turn_order`: either order, so a soldier can fly in and strike or strike and fly clear, with the move made at one point so every Position check happens once. Chapter 1 section 1.9 points to it (OQ-90).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a), except that Wings stand from the first wings step and change only after a soldier died, left, became Down or Grabbed, or a Focus Titan entered or died (OQ-97).
- **ADR:** none

### OQ-78: Size Class starting values

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, sections 5.4 and 5.13; `data/engagement/size-classes.yaml`, `data/engagement/tuning.yaml`
- **Related:** OQ-72, OQ-79, OQ-85
- **Question:** ADR-0014 tunes Toughness, Nape Depth, Severity, Tempo, and Regeneration by simulation, and no values existed.
- **Options:** (a) Small: Tempo 2, Nape Depth 3, Regeneration 2, Toughness 1 for every kind, Severity 1, 2, 2. Medium: Tempo 1, Nape Depth 4, Regeneration 3, Toughness 2, Severity 1, 2, 3. Large: Tempo 1, Nape Depth 4 (5 before review round 2), Regeneration 4, Toughness eyes 2, arm 3, leg 2, Severity 2, 3, 4. (b) Medium at Tempo 2. (c) Large at Tempo 2 with leg Toughness 3. (d) Small at Tempo 1.
- **Provisional choice:** (a). Every value is a starting value for the simulator.
- **Why:** (a) meets the prepared-Squad target for Medium (median kill round 3) at ADR-0014's fight-start Stress 1, under every dodge and striker policy measured. (b) keeps a median of 3 but deals 2.08 Critical Injuries and 0.34 deaths per fight, against 0.71 and 0.03. (c) was measured only in the first draft's model, at 2.75 to 3.59 Critical Injuries per fight. (d) makes a Small Titan barely dangerous (0.34 Critical Injuries per fight). No Chapter 5 target measures Large. At Nape Depth 4 its median kill is round 3, 13.3% of fights have no kill within 12 rounds, and a fight deals 1.41 Critical Injuries and 0.19 deaths, twice Medium's harm; Large keeps its higher Severity, slower Regeneration, tougher arms, and higher fall band. Eyes and arm Toughness were not measured.
- **Figures:** full-fight model in `tools/probes/chapter-05/fight.py`, 12,000 fights per case, Wooded, 4 Rookie player characters at Stress 1, strikers eager, dodging every harming behavior, re-run after review round 2: Medium median kill round 3, 62.6% by round 3, 73.2% by round 4, 5.1% no kill in 12 rounds, 0.71 Critical Injuries and 0.027 deaths per fight. Strikers who wait: 61.7%, 0.76. Dodging only Grab and Bite: 65.5%, 0.96 and 0.057. From Stress 0: 58.7%, 0.74. With 2 helper Squadmates: median 2, 69.3%, 0.65 and 0.006. Template Squad (reported, not tuned): median 4, 49.7%, 0.87. Small at Tempo 2: median 2, 81.5%, 0.84; at Tempo 1, 87.2%, 0.34. Large at Nape Depth 4: median 3, 60.5%, 13.3% no kill in 12 rounds, 1.41 and 0.19; at Nape Depth 5: median 5, 33.6%, 36.6%, 2.38 and 0.43. Medium alternatives: Regeneration 2 57.5%, Regeneration 4 61.8%, Nape Depth 3 median 2 (85.0%), Nape Depth 5 median 5 (35.1%, 1.19 Critical Injuries), Tempo 2 52.5% (2.07 and 0.34). Medium Severity 1, 2, 2: 63.5% and 0.52; Severity 2, 3, 3: 62.2% and 0.88. Full tables in `tuning.yaml`.
- **Revised (Chapter 5 review round 1):** the draft's figures (77% by round 3) came from an uncommitted model started at Stress 0. Codex finding 2 objected to the start, and Opus finding 3 could not reproduce the figure (its model gave median 4 and 43% to 60% by round 3). The reviews offered two fixes, retuning a lever or committing the model; this pass commits the probe scripts in `tools/probes/chapter-05/`, states each policy in `tuning.yaml`, and re-runs at Stress 1. The target still holds, so no value moved. The gap between the two models is left for the `tools/` simulator to settle.
- **Revised (Chapter 5 review round 2):** Opus finding 3 (Major) showed that Large at Nape Depth 5 fails play: 36.6% of fights reach no kill within 12 rounds, at 12 to 20 minutes a round, and the interim setup table deals a Large Focus Titan 1 time in 6. Of its three fixes (Nape Depth 4, taking Large off the interim table, or a Large target in ADR-0014), this pass takes Nape Depth 4. It needs no ADR change, it fixes Large wherever a later rule places one, and only Nape Depth moved the kill: Severity 2, 3, 3 and Regeneration 5 each left over a third of fights unfinished (the review's figures). A Large target in ADR-0014 remains the decider's option. The Codex review did not raise Large.
- **Simulator case:** every value above under the full rules, eyes and arm Toughness, and Large against the PC Critical Injury and PC death targets.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a): every Size Class value is a simulator starting value; eyes and arm Toughness for every class and Large against the PC Critical Injury and death targets are simulator cases; the Large wording reads twice Medium's Critical Injuries and seven times its deaths.
- **ADR:** none

### OQ-79: The lone Nape strike at Stress 1

- **Type:** Unresolved Major
- **Arose in:** Chapter 5, section 5.13; `data/engagement/tuning.yaml` (`solo_nape`); `data/engagement/size-classes.yaml` (medium `nape_depth`)
- **Related:** OQ-78, OQ-83
- **Question:** ADR-0014 wants a lone average soldier who has used Break Attention to succeed on no more than 10% of Nape strikes against a Medium Titan, and a Levi-grade soldier pushing hard to succeed about 50%. No Nape Depth meets both for a Rookie who starts at Stress 1.
- **Options:** (a) Nape Depth 4: the Rookie succeeds 10.0% from Stress 0, 13.1% from Stress 1 (ADR-0014's fight start), and 15.9% from Stress 2; the Veteran 32.3% from its Stress 2 start; the Levi-grade soldier 47.4% from its Stress 2 start (46.1% to 47.4% over Stress 0 to 3). (b) Nape Depth 5: Rookie 2.3%, 3.6%, 5.2%; Levi-grade 28.6% from Stress 2; and the prepared Squad's median kill becomes round 5 (35.5% by round 3). (c) Nape Depth 4 with a strike penalty for a soldier acting alone, which ADR-0010 rules out. (d) Amend ADR-0014's bound to read "about 10%".
- **Provisional choice:** (a), recommending (d) to the decider.
- **Why:** (a) misses the Rookie bound by about 3 points at ADR-0014's own fight start; (b) misses the Levi-grade target by about 21 points and breaks the prepared-Squad target. Both reviews rejected the draft's other reading of (d), which read the Rookie at Stress 0: ADR-0014's body starts every reference Rookie at Stress 1, so that reading contradicts the ADR, and it is withdrawn. The lone line is also slow in card order: a lone Rookie's Break Attention succeeds 82.6% of attempts, and a usable Nape strike comes a median of 4 rounds after starting at Distant, with 1.67 Titan cards against the soldier meanwhile, so the solo cut is rarely the fastest play even when it lands.
- **Revised (Chapter 5 review round 1):** Opus finding 6 and Codex finding 4. Figures re-run with 100,000 trials per cell in `tools/probes/chapter-05/simple.py`.
- **Revised (Chapter 5 review round 2):** Codex finding 1 (Major) again: 13.1% breaks a hard bound, and recommending "about 10%" is not yet a rule. Its fixes were to amend ADR-0014, to find a lever that lowers the Rookie without pulling the Levi-grade soldier far below 50%, or to keep this entry open and stop implying every target is met. No lever exists inside the ADRs: Nape Depth moves both builds and the prepared-Squad kill, ADR-0010 rules out a penalty for acting alone, and spendable own Openings raise the Rookie. The Break Attention change under OQ-81 leaves the lone holder needing 1 success, so the figures stand and re-run identically (Rookie 10.0%, 13.1%, 15.9%, 17.4% from Stress 0 to 3; Levi-grade 47.4% from Stress 2). The chapter's introduction now says this target is not met. Opus finding 10 (Minor): the chapter's block is labelled Simulator target, matching this entry.
- **Current handling:** Medium Nape Depth 4, PROVISIONAL.
- **Why still open:** only an ADR-0014 amendment, option (d), or a decided lever outside the ADRs closes it.
- **Round-3 note:** `docs/reviews/05-titan-engagement-review-3-codex.md` M1: the lone Rookie still succeeds on 13.18% of Nape strikes over 500,000 independent trials against ADR-0014's 10% ceiling, so the review judges (a) unsound as final and offers amending the bound to "about 10%" with 13.1% accepted, a Rookie-side limiter that leaves the Levi-grade pool (47.30%) alone and re-runs the Medium kill, or keeping the value provisional and not accepting it as the starting rule.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** (a) with (d): Medium Nape Depth stays 4, and ADR-0014's bound becomes "about 10%", 8% to 14% at the Rookie's fight-start Stress of 1, with 13.1% accepted; every lever was measured and rejected (Nape Depth 5, a 1- or 2-die penalty on the lone cut, no Push). Revised by batch 3b: the lone-line figures are replaced by the full lone-fight rows under the rule as revised (76.0% of lone fights reach a usable strike within 12 rounds, most often in round 4; the cut succeeds 14.2% in the fight), and the band is read on a fresh cut directly after Break Attention at fight-start Stress 1, with the in-fight cut reported beside it.
- **ADR:** ADR-0014 (body and `## Amended`) and again in batch 3b (the band's measurement point)

### OQ-80: The Behavior Table procedure

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, sections 5.4 and 5.5; `data/engagement/titan-format.yaml`, `data/engagement/behavior-procedure.yaml`
- **Related:** OQ-39, OQ-42
- **Question:** ADR-0001 and ADR-0003 item 11 require Behavior Tables whose entries list a Position requirement, Body Parts used, Severity, and fallback, with a Thrash entry, and the design brief names escalating tiers, a hidden Next Behavior, Telegraphs, and no back-to-back repeats. No rule says how an illegal result moves, when Positions are checked, what a card does while the Titan holds a Grabbed soldier or after Break Attention, what each tier may inflict, or which effects exist.
- **Options:** (a) A D6 table: results 1 and 2 terrorize, 3 and 4 control, 5 and 6 kill. When rolled, an entry that repeats the previous behavior or needs Broken parts moves up to the next entry, wrapping from 6 to 1, else Thrash. At the card, missing parts give Thrash, and a Position requirement the holder does not meet gives the fallback (Thrash if the fallback repeats or also fails). A holding Titan's card resolves nothing and keeps the Next Behavior; a decoy's card spends it. Terrorize inflicts only Stress, control adds falls and non-lethal Critical Injuries, kill adds lethal ones and the Grab. A closed list of five effect types. (b) Re-roll illegal results. (c) Check Positions when rolling, against the current holder.
- **Provisional choice:** (a).
- **Why:** Moving up needs one roll and no loop, so the hidden die is never rolled again (ADR-0003 item 8). Positions change between the roll and the card, so only a check at the card with a listed fallback needs no guess. Tiers by result give escalation a table shape and keep lethal harm to a third of rolls, which is what the kill and Jam figures measured.
- **Revised (Chapter 5 review round 1):** Opus finding 11 showed that moving up makes an entry's share swing with the previous behavior and with Broken parts (with both arms Broken, Bite takes Grab's result). The rule stands, because the swing is what a Titan that cannot repeat itself does, but `behavior-procedure.yaml` (`move_up_shares`) now warns Chapter 6's authors, and the simulator reports kill share by previous behavior and by Broken parts.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a).
- **ADR:** none
- **Revised by batch 8 (8-1):** the card's step 5 becomes *Roll and announce*: the GM rolls the entry's Attack Dice in the open and announces the behavior, its targets, and its successes; step 6's Reactions cancel one for one, and a roll of 0 whiffs against everyone. Illegal results still move up the table and the hidden die is still rolled once (OQ-145; ADR-0019).

### OQ-81: Attention Ladder ties, flags, Down soldiers, and Break Attention

- **Type:** Unresolved Major
- **Arose in:** Chapter 5, section 5.6; `data/engagement/attention.yaml`
- **Related:** OQ-45, OQ-50, OQ-72
- **Question:** ADR-0010 gives the standard ladder and says Break Attention moves Attention to a decoy for the Titan's next card; Chapter 3 asks whether the ladder can choose a Down soldier. No rule settles ties, how long the hooked and just-hurt flags last, what Break Attention needs, what each decoy requires, or whether Break Attention frees a Grabbed soldier.
- **Options:** (a) Ties narrow down the lower rungs, then the current holder keeps Attention, then the lowest card, then Squad sheet order. Every flag lasts until the Titan's next card, and at the top rung a soldier holding the hooked-by-strike flag outranks one only On Body. The card tie-break is skipped at an end step. Down and carried soldiers meet only the nearest test. Break Attention needs 1 success from the soldier holding the Titan's Attention or a comrade at their Position, 2 from anyone else, and 2 from anyone against a Titan holding a Grabbed soldier, which frees them; extra successes create Openings. Break Attention cannot be taken while a decoy holds the Titan's Attention. A flare spends Squad Supply and fills Background clocks; a riderless horse bolts and leaves the Titan Engagement until it ends; a thrown cloak works once per Titan Engagement from On Body or Blind Spot. Broken eyes stop flares and cloaks. When the decoy's card comes up it resolves nothing and the ladder is evaluated. (b) The ladder never chooses a Down soldier. (c) Break Attention cannot free a Grabbed soldier.
- **Provisional choice:** (a).
- **Why:** Keeping the holder on a tie stops Attention flickering between equal soldiers. A Down soldier who is chosen only when no one is closer or louder lets comrades shield them by standing nearer, without making a Down soldier safe when alone. A harder Break Attention that frees a victim is the third escape the design brief names. Each decoy has a different price (supply and more Titans, the horse for the rest of the fight, a once-per-fight cloak), so each has a reason to be picked. Tying the easy decoy to the soldier the Titan is fixed on keeps Break Attention a lever for soldiers in the fight, not for Squadmates standing off.
- **Revised (Chapter 5 review round 1):** the draft's claim that the horse decoy had a price was false (Opus finding 2): a horse sent to Distant could be sent again, so two mounted Squadmates idled a Titan. In the full-fight model, two Squadmates sending horses every turn cut the Titan's resolved cards to 0.30 a round and Critical Injuries to 0.19 per fight; with the horse leaving, 0.48 and 0.31, against 0.85 and 0.71 with no decoys. The no-decoy-over-a-decoy requirement closes the Opening farm in Opus finding 13. The struck-first narrowing (Opus finding 12) makes a short Nape strike draw the Titan as ADR-0010 intends, and skipping the card tie-break at an end step (Codex finding 13) stops a Background Titan choosing by the cards of a round that has ended.
- **Revised (Chapter 5 review round 2):** Opus finding 2 (Major) showed that every soldier still brings a horse and a cloak, so two Squadmates who send their horses from Distant and then throw their cloaks left the Titan resolving 0.41 cards a round and cut Critical Injuries per fight by 62%. It offered three fixes: (1) a Titan whose last card a decoy spent ignores decoys until a card resolves a behavior; (2) Break Attention needs 1 success from the Attention holder or a comrade at their Position and 2 from anyone else; (3) a decoy's card resolves Thrash. This pass takes (2), which leaves the lone soldier (ADR-0010, OQ-79) and a rescuer's 2 successes unchanged. (3) would turn ADR-0010's decoy for the Titan's next card into an attack. (1) was measured and rejected: added to (2) it gains only 0.04 cards a round, and it raises the Titan cards a lone soldier faces before a usable strike from 1.67 to 3.72. Figures (`tools/probes/chapter-05/fight.py`, 12,000 fights, Medium, 4 Rookie player characters and 2 Squadmates): no decoys 0.853 cards a round and 0.71 Critical Injuries per fight; horses then cloaks 0.535 and 0.35 under (2), 0.395 and 0.24 when every Break Attention needed 1, and 0.575 and 0.38 with (1) added; horses alone 0.579 and 0.39, against 0.480 and 0.30 before. Opus finding 7 (flare timing) is under OQ-87. Opus finding 8 (Minor): the `tests` rows the standard ladder does not use (mounted, airborne, carrying a comrade, most harmed, Down) are kept on purpose, as the closed format Chapter 6's Abnormal ladders choose from; the chapter now says so.
- **Still open for the decider:** decoys still cut a Titan's cards by about a third and its harm by about half when two Squadmates spend every action on them, while the kill stays as fast as with helper Squadmates (69.5% by round 3, against 69.3%). Options: (a) accept it as the price of two soldiers who never strike; (b) add fix (1) as well; (c) limit decoys per Titan Engagement for the Squad; (d) fix (3), with an ADR-0010 amendment. Current handling: (2) alone, PROVISIONAL.
- **Round-3 note:** `docs/reviews/05-titan-engagement-review-3.md` M1: Squadmates who first ride or fly to the Attention holder's Position need only 1 success, so a screen beside the holder leaves the Titan resolving 0.419 cards a round with 0.26 Critical Injuries per fight (0.834 and 0.65 with helper Squadmates, 0.395 and 0.24 under the round 2 rule), which means this entry's *Why*, its *Still open* figures, section 5.13's *Decoys* bullet, and `tuning.yaml` (`decoys`) understate the loop, and the review offers needs 1 for the Attention holder alone (measured 0.604 and 0.42), a decoy limit the Position cannot dodge, or at minimum re-measuring these options under the beside-the-holder policy.
- **Round-3 note:** `docs/reviews/05-titan-engagement-review-3-codex.md` M3: the horse-and-cloak screen still cuts resolved Titan cards from 0.852 to 0.529 a round and Critical Injuries from 0.70 to 0.35 per fight (0.477 and 0.31 with Hook and Cut and Hamstring Line, median kill round 2) because a decoy erases a card rather than redirecting it, and the review offers turning a decoyed card into a limited Thrash or movement result, a shared per-round decoy limit or escalating success cost per Titan, or a concrete resource or exposure cost on the screen.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Break Attention needs 1 for the soldier holding the Titan's Attention, 2 for anyone else, 2 against a Titan holding a Grabbed soldier, plus 1 for each decoy the Titan has fallen for since its last card that resolved a behavior (decoys in a row on the tracker, reset by such a card); a fourth decoy, the Feint (the soldier's own pass from In Reach or On Body with working ODM Gear or a sound horse under them), is repeatable, spends nothing, and needs 1 more; ties, flags, Down candidates, and the other three decoys stand; the decoy cap and the Thrash conversion are rejected. Revised by batch 3b from batch 3's permanent count, which with finite decoys could close a lone soldier's route (Codex Critical 1). Measured on the committed probes and the full lone-fight model: two Squadmates screening beside the holder leave 0.624 Titan cards a round and 0.44 Critical Injuries per fight (helpers 0.836 and 0.65; the round 2 rule 0.413 and 0.25), and a lone Rookie reaches a usable strike in 76.0% of fights within 12 rounds (batch 3's rule 67.0%, with 27.9% out of decoys). A decoy holds for as many of the Titan's next cards as its Tempo (Chapter 6 review, Major 3; ADR-0010 amended), so the lone line is the same against a Tempo 2 Titan (77.1%) where a one-card hold gave 49.5%. Revised by batch 3c: the Feint can also be made on foot against a grounded Titan, so a Feint is available in every state in which a Nape strike is legal (outside a retreat, batch 3e), and the lone probe's route column is corrected (0.2% of lone fights end with no decoy usable, 77.0% reach a usable strike on the committed seed). Revised by batch 3e: a flag lasts until the end of the Titan's next card that resolves a behavior, and a card that resolves nothing leaves it standing; the nearest rung is met by the candidates at the closest Position, so when it is the highest rung met the tied set is those candidates and the holder step decides only ties at equal distance; the closed tests list gains current-holder for Abnormal ladders (3e-6). Revised by batch 4: a tie the card step cannot break, at the start of a Titan Engagement or at an end step, leaves Attention held by nothing until the Titan's next card, and the Squad sheet's order chooses nothing (4-3).
- **ADR:** none in batch 3 (ADR-0010 holds); ADR-0010 `## Amended` in batch 3b (the decoy's hold reads Tempo cards); ADR-0003 item 2 and ADR-0010's body flag moment in batch 3c; ADR-0003 item 2 rewritten and ADR-0010 amended in batch 3e

### OQ-82: Body Parts, what Broken does, a grounded Titan, and Regeneration

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.7; `data/engagement/titan-harm.yaml`, `data/engagement/titan-format.yaml` (`stat_block`)
- **Related:** OQ-60, OQ-78
- **Question:** ADR-0007 sets Toughness, the three states, Regeneration, and 2 dice for a Broken leg, and the glossary names eyes, an arm, and an ankle. No rule says which Positions strike each part, what happens to a count at a state change, what Broken eyes or a Broken arm do, what else grounding does, or what a full Regeneration clock resets.
- **Options:** (a) Standard Body Parts are eyes, two arms, and two legs. Eyes are struck from On Body or Blind Spot, arms and legs from In Reach or On Body, and every part from In Reach, On Body, or Blind Spot while grounded. The count returns to 0 at each state change, and successes beyond Broken become Openings. Broken eyes stop flare and cloak decoys, a Broken arm frees its victim, and a Broken leg grounds the Titan: 2 Nape strike dice, no working ODM Gear needed for strikes, and close steps on foot. A full clock erases Openings, sets every count to 0, and moves the most damaged part one state toward Intact (Broken before Wounded, then stat block order). (b) A full clock moves every part one state. (c) Counts survive Regeneration.
- **Provisional choice:** (a).
- **Why:** One part per clock is what the glossary says. Clearing counts makes Regeneration a real deadline, which the kill figures depend on: at Regeneration 2 the Medium kill by round 3 falls from 62% to 58% (full-fight model at Stress 1; OQ-78). Grounding that lifts the ODM Gear requirement is the rule Chapter 4's `strikes.lifted_only_by` waits for.
- **Revised (Chapter 5 review round 2):** Opus finding 5 (Minor): grounding let every Body Part be struck from In Reach, which contradicted the narrowed reach to a lifted victim's holding arm. The holding arm now keeps `grab.yaml`'s reach whether or not the Titan is grounded (`escapes`, `strike-the-holding-arm`, `grounded`; `titan-harm.yaml`, `body_part_strikes`, `grounded`), so only Clear the Hand widens it. The review measured that the one-comrade cells move by at most 0.5 points either way.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-83: Whether a soldier can spend Openings they created

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.7; `data/engagement/titan-harm.yaml` (`openings.own_openings`); `data/core/bonus-dice-sources.yaml` (`opening`)
- **Related:** OQ-28, OQ-79, OQ-90
- **Question:** OQ-28 left to Chapter 5 whether a striker can spend Openings from their own strike (the Relentless case). The glossary says any ally can spend them.
- **Options:** (a) Never: only a soldier other than its creator can spend an Opening, whatever created it. (b) Any soldier, its creator included. (c) Only Openings from a Nape strike are barred to their creator.
- **Provisional choice:** (a).
- **Why:** (b) takes the lone Rookie further past the 10% bound and lets a lone soldier's short cut feed their own next cut, which ADR-0007 rejected when it stopped Nape cuts adding up. (a) reads "any ally" as the creator's comrades and keeps Openings a teamwork lever (ADR-0010). (c) needs creator marks too, so (a) is no harder to track.
- **Figures:** a lone soldier after Break Attention, Nape Depth 4: under (a), 100,000 trials per cell, the Rookie succeeds 10.0% from Stress 0 and 13.1% from Stress 1, and the Levi-grade soldier 46.1% to 47.4%. Under (b), from the first draft's run of 40,000 trials per cell, the Rookie succeeded 12.2% and 15.9% and the Levi-grade soldier 50.3% to 51.6%.
- **Pending glossary change:** `CONTEXT.md`'s Opening entry says any ally can spend an Opening. Under (a) it should say any comrade of the soldier who created it (OQ-90). This chapter does not edit the glossary.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a): a soldier never spends an Opening they created; the glossary now says so.
- **ADR:** none

### OQ-84: Read and Call It

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.8; `data/engagement/read.yaml`
- **Related:** OQ-11, OQ-28, OQ-90
- **Question:** The glossary and the Action Catalog name Read (Instinct, facts for the whole Squad) and Call It (Bonus Dice on the target's Reaction), and Sharp Call assumes a success count. No rule sets what a Read needs, the facts, any bonus for Reading from Distant, how many successes Call It takes, or its dice.
- **Options:** (a) A Read needs 1 success and gains 2 Bonus Dice from Distant. Each success reveals one fact from a closed list. Against any Focus Titan the fact is the Next Behavior; against an Abnormal it can also be a named Body Part's Toughness, the Nape Depth, the Regeneration clock's length, or the Attention Ladder. Everything else is public: Body Part states and counts, filled clock segments, Size Class, whether a Titan is an Abnormal, and a standard Titan's stat values and ladder. Call It takes 2 successes, the Next Behavior's included (1 with Sharp Call), and gives 2 Bonus Dice to each dodge, other than the reader's, against the card that resolves the Called behavior. (b) Call It gives 1 die. (c) A Read reveals a whole Behavior Table.
- **Provisional choice:** (a).
- **Why:** The final design review's brief gave Read 2 dice from Distant and Call It 2 dice for 2 successes; (a) keeps those and closes the lists. A standard Titan's numbers come from its public Size Class row, so only what the table cannot already see is a fact, and a success is never wasted. Call It helping comrades only is teamwork (ADR-0010). Both dice sources are rows in Chapter 1's Bonus Dice list (OQ-90). Read and Call It were not simulated.
- **Revised (Chapter 5 review round 1):** the tracker showed counts and clocks that `read.yaml` called hidden (Opus finding 7, Codex finding 6). Opus proposed making them public, and Codex proposed hiding them on the tracker. This pass makes them public, which leaves less for the GM to hide and fits a Size Class row anyone can read, and keeps hidden facts only for Abnormals. The Read pointers now name the Chapter 1 rows (Codex finding 10), and the reader's own dodge gains nothing, matching the `call-it` row (Codex finding 11).
- **Revised (Chapter 5 review round 2):** the chapter and `read.yaml` no longer describe Call It with the glossary's `_Avoid_` word (Opus finding 6). An Abnormal's public counts and state changes show its Toughness over time, which `read.yaml` and `titan-harm.yaml` now say, and until a Read reveals an Abnormal's Regeneration clock length the tracker shows only its filled segments (Opus finding 9).
- **Simulator case:** a Tactician Reading from Distant every round and Calling It, reported against the Jam test and the PC Critical Injury target.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a); the Tactician Read and Call It case is a simulator case.
- **ADR:** none

### OQ-85: The Grab procedure and its rescue structure

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.9; `data/engagement/grab.yaml`, `data/engagement/tuning.yaml` (`grab`)
- **Related:** OQ-18, OQ-39, OQ-42, OQ-50
- **Question:** ADR-0015 gives the countdown in the victim's turns, the Toughness 1 hand, and the non-lethal crush; OQ-50 requires reach and strike penalties stated in data and all six cells passed. No rule says what Break Free needs, what the lift does, who can strike the hand before and after it, what a holding Titan's cards do, where a freed soldier ends up, or what "comrades close" means for the target.
- **Options:** (a) Break Free and Pry Loose need 2 successes, with a 2-die penalty once the soldier is lifted. Before the lift the holding arm can be struck from In Reach, On Body, or Blind Spot; after it, only from On Body or Blind Spot; no strike penalty. The holding Titan's cards resolve nothing. Break Attention needing 2 successes frees the victim. A soldier freed before the lift holds In Reach; after it they fall and land In Reach. The reference "comrades close" is one comrade in reach. (b) As (a) with a strike penalty of 1. (c) Break Free needs 3 with no lift penalty, as in Chapter 3's probe. (d) As (a), with the action of the victim's first counted turn spent by the Grab, whether or not a Reaction or any other result already spent it. (e) As (d), and a failed dodge against the Grab's card that spent a turn later than the victim's first counted turn gives that turn back as the Grab lands, with the first counted turn counting as spent instead.
- **Provisional choice:** (e).
- **Why:** (d) keeps (a)'s rescue window, in which comrades must spend a move to reach the hand after the lift and the victim's own chance falls, and removes (a)'s dominant play: under (a) a lone victim who declined to dodge a revealed Grab kept their action and died 42.7% of the time, against 70.0% after a failed dodge (Opus finding 1, Codex finding 5). Under (d) declining gains nothing: 73.1% against 69.9%, and a victim who always dodges the Grab card dies 55.5% of the time per card, so dodging is 17.6 points better. (b) keeps two comrades in the band but pushes one comrade to 46.8%, and a penalty of 3 breaks the band. (e) closes the edge (d) left. A dodge spends the earliest wholly unspent turn, so when the first counted turn was already spent in advance, which one earlier Reaction does to a soldier holding Attention, a failed dodge under (d) spent the second counted turn and left no Break Free: alone, that victim died 100% of the time after a failed dodge and 73.1% without one. Under (e) the figures are 70.1% and 73.0%, and 55.4% per Grab card for a victim who always dodges.
- **Also revised in round 1:** a Grabbed soldier who dies by any rule, a turn-limit Death Roll included, ends the Grab at once, so the holding Titan acts again (Codex finding 3). The holding arm's count is 0 while it holds and after release, so an Intact arm needs 2 successes and a Wounded one 1 (Codex finding 7, Opus finding 14).
- **Figures:** 80,000 trials for lone rows, 40,000 per cell, victim a reference Rookie at Stress 1 unless stated. Lone victim whose dodge failed 69.9%; who did not dodge 73.1%; who always dodges, per Grab card, 55.5%; with no Grip Breaker 75.1%; victim at Stress 2 68.1%. Template victims alone: Brawler (Grip Breaker 1) 69.5%, Slayer 75.0%, Flier 76.3%, Hunter 76.3%. Comrades close, cells Stress 1, 2, 3 with Grief 0 then Grief 1: one comrade 28.7%, 33.4%, 39.1%, 34.1%, 39.7%, 45.1%; one comrade with a victim who did not dodge 29.9% to 46.9%; two comrades 13.1% to 30.3%; three comrades 6.4% to 21.9%; one template comrade with no strike Talent 32.0% to 46.9%; one comrade against an already Wounded arm, Stress 2 and Grief 0, 25.0%. Turn debt (the victim's card after the Titan's, their turn this round spent in advance): alone, failed dodge 70.1%, no dodge 73.0%, per Grab card 55.4% under (e), against 100%, 73.1%, and 79.3% under (d); one comrade at Stress 2 and Grief 0, 41.5%, 43.4%, and 33.2% under (e), against 59.9%, 43.8%, and 47.4%. In the reference fight a failed dodge had its turn given back on 0.010 of 0.209 Grabs per fight (4.9%). Victims with two earlier untreated leg injuries (one at Health 2), alone and with one comrade at Stress 2 and Grief 0: Health 2, 100% and 47.9%; Health 3, 100% and 47.9%; Health 4, 69.8% and 33.1%; Health 5, 69.7% and 33.7%; Health 6, 69.7% and 33.2%; fresh victims about 70% alone at every Health. First draft's rejected strike penalties: penalty 1, one comrade 31.3% to 46.8%; penalty 3, a cell at 50.6%.
- **Revised (Chapter 5 review round 2):** Opus finding 1 (Major) found and measured the turn-debt edge; its fix 1 is (e), applied in `grab.yaml` (`countdown`, `failed_dodge`; `grab_lands`, `failed-dodge`) with a pointer in Chapter 1 section 1.9. It does not change which turn a Reaction spends when made, so the glossary's Reaction entry still holds. The Codex review judged rule (d) resolved and raised nothing that conflicts. The six OQ-50 cells and the lone rows have no turn debt and are unchanged.
- **Simulator case:** the six cells with Help, Pry Loose, and Break Attention rescues included, and the Squad-model Grab rate (OQ-95).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (e), extended: the refund also covers a dodge whose successes the Grab's card compared, when that dodge spent a turn after the first counted turn (OQ-99 item 1).
- **ADR:** none

### OQ-86: Witnesses

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.9; `data/engagement/engagement-flow.yaml` (`witnesses`)
- **Related:** OQ-47, OQ-49, OQ-50
- **Question:** Chapter 3 asks Chapter 5 to define who witnesses a comrade becoming Grabbed or dying in a Titan Engagement.
- **Options:** (a) Every living soldier who holds a Position in the Titan Engagement when the event is resolved, other than the victim; soldiers who left are not witnesses. (b) Only soldiers at the victim's Position or one step away. (c) Every soldier in the Titan Engagement, including those who left.
- **Provisional choice:** (a).
- **Why:** A Titan eating a soldier is seen across the field. (b) would let spacing avoid Fear Rolls, which the OQ-50 band does not assume: its cells give every rescuer the roll. (c) contradicts Chapter 3, which treats soldiers who left as outside the scene.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-87: Background Titans, the retreat, and the interim setup table

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, sections 5.1 and 5.10; `data/engagement/background-titans.yaml`, `data/engagement/engagement-setup.yaml`, `data/engagement/attention.yaml` (`flare`)
- **Related:** OQ-44, OQ-67
- **Question:** The glossary makes Background Titans closing clocks that enter as a second Focus Titan, and the design brief caps Focus Titans at two, beyond which the scene becomes a retreat. No rule sets clock lengths, what fills a clock, what a retreat requires, or where a Titan Engagement's setup comes from before Expeditions and Mission Briefs exist.
- **Options:** (a) A clock fills 1 segment a round and 1 for each flare spent on Break Attention. A full clock brings its Titan in as a Focus Titan, Distant from everyone, while fewer than two are alive; otherwise the Titan Engagement becomes a retreat. In a retreat no clock fills and no Titan enters, every soldier able to must move along a shortest chain toward Distant and then leave, or move toward or stay beside a Down or Grabbed comrade who is not carried, and no one returns. An interim D6 setup table gives the Anchor Rating, the Focus Titan's Size Class, and Background Titans with clocks of 4, 6, or 8. (b) A retreat ends the Titan Engagement at once. (c) No setup table; the GM picks.
- **Provisional choice:** (a).
- **Why:** (b) skips the escape that makes a retreat dangerous, and (c) is GM discretion (ADR-0003). Flares that fill clocks give the flare decoy a price in Titans drawn in, as signal flares do in canon. The setup table is a stopgap like Chapter 4's interim issue, replaced when Mission Briefs and Expeditions name these values.
- **Revised (Chapter 5 review round 1):** the draft's forced moves left no way back to a Down or Grabbed comrade who was not already on the way out (Opus finding 9). Two options are added: a step that brings the soldier closer to such a comrade, and staying beside one. Positions are compared relative to the holding Titan for a Grabbed comrade and to the earliest living label for a Down one. A carried comrade does not count, so a carrier must head out.
- **Revised (Chapter 5 review round 2):** Opus finding 7 (Minor): a flare's clock segment now fills once its Break Attention, and any Hook and Cut it allows, is resolved, so a Titan that enters never interrupts that roll. Opus finding 12 (Minor): staying beside a fallen comrade in a retreat (option 4) now needs a rescue action for that comrade taken earlier the same turn (Lift Comrade, Treat Injury, or for a Grabbed comrade Pry Loose, a strike on the holding arm, or Break Attention against the holding Titan), so a Down comrade no one lifts cannot keep soldiers fighting indefinitely.
- **Simulator case:** clock lengths against a retreat rate per Titan Engagement.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a); Lift Comrade leaves retreat option 4 (OQ-99 item 4); the interim setup table stands; clock lengths are simulator starting values and OQ-97's fallback lever for two-Titan round time.
- **ADR:** none
- **Revised by batch 5:** A retreat also starts when the Titan Engagement's retreat clock is full, 8 segments on the interim setup table, filled at the background-clocks end step after the Background clocks and never by a flare (decision batch 5, 5-10; OQ-126), so every fight that lasts reaches the retreat; under it the forced move comes before the action except a stay-with-a-comrade move (5-1; OQ-119). The retreat rate per Titan Engagement reads 8.2% at the standard Medium Titan's reference start and 13.8% at the Large (`tools/probes/batch-5/retreat_b5_explore.out`).
- **Revised by batch 5b:** no Nape strike is made during a retreat, on a turn or through Hook and Cut (decision batch 5, 5-15; OQ-129), which is how the retreat closes the lone cut on every Anchor Rating; the items of a soldier who dies left behind leave play (5-18; OQ-131). The Background Titans' Size Class rolls are unchanged and Chapter 5 section 5.1 renders them (5-17).
- **Revised by batch 8 (8-32):** while no Focus Titan is alive, a retreat's options 3 and 4 are open only on its first rounds, as many as the retreat clock has segments; from the next round no soldier steps toward or stays with any comrade, and every standing soldier moves out by option 1 or 2. The promise that a retreat never makes a Squad abandon a comrade holds while a Focus Titan lives; over a corpse the Squad stays as long as the retreat clock ran, then leaves, and a Pinned comrade dies under the body (8-21; OQ-163).

### OQ-88: When a Titan Engagement ends, and soldiers left behind

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.11; `data/engagement/engagement-flow.yaml` (`ending`)
- **Related:** OQ-54, OQ-56, OQ-57
- **Question:** Chapter 3 asks Chapter 5 when a Titan Engagement ends. It can end with its Titans dead or with every soldier gone or Down; nothing says what becomes of Down soldiers still holding a Position when everyone else has gone.
- **Options:** (a) It ends when no Focus Titan is alive, or when no soldier holding a Position is alive and not Down. The second test ends it at once if no soldier holds a Position or no returner exists (a soldier who has left, alive, neither Down nor carried, outside a retreat); otherwise it ends at the round-ends step of the next round if the test still holds, or at once when the last returner is gone. In the second case, with a Titan alive, every soldier still holding a Position dies, with no Fear Rolls. (b) Down soldiers left behind survive. (c) It does not end while any soldier holds a Position, and the Titans keep acting against Down soldiers.
- **Provisional choice:** (a).
- **Why:** (b) lets a Squad abandon Down comrades at no price, which canon never allows, and (c) runs rounds with no player choices. (a) makes carrying a comrade out (Chapter 4) the way to save them.
- **Revised (Chapter 5 review round 1):** the draft ended the Titan Engagement at once, killing Down soldiers while a comrade who had left could still come back for them (Opus finding 8). The one-round wait gives a returner a turn to come back, and ends at once when no one can.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a).
- **ADR:** none

### OQ-89: Squad Tactics for Phase 1

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.12; `data/engagement/squad-tactics.yaml`
- **Related:** OQ-35
- **Question:** ADR-0010 and the glossary name Squad Tactics, usable once per Titan Engagement when a condition is met. No list exists, and nothing says how many a Squad holds or how it gets them.
- **Options:** (a) Four tactics (Hook and Cut, Hamstring Line, Clear the Hand, Fall Back); a Squad holds 2, chosen by the players before its first Titan Engagement; later rules may add more. Each tactic names who declares it and when; a use is spent once declared, and players who may each declare the same use and disagree go to the roll-off in `data/character/lifepath.yaml` (`group_choices`). (b) Every Squad holds all four. (c) No Squad Tactics in Phase 1.
- **Provisional choice:** (a).
- **Why:** Each tactic rewards a different kind of coordination (a decoy and a cut, Helped leg strikes, a rescue, a pull-back), each is one rule change behind a closed condition, and holding two makes the choice matter. (c) leaves a glossary term with no rule. The kill with each tactic held, alone and in pairs, is measured below; the Grab cells were not run with tactics.
- **Revised (Chapter 5 review round 1):** the draft named a declarer only for tactics whose condition names one soldier (Opus finding 10, Codex finding 9). Each tactic now has `declared_by` and `when`: Hook and Cut by the striking comrade as the Break Attention succeeds; Hamstring Line by the striker after Help and before the roll; Clear the Hand by the comrade declaring a strike only it allows; Fall Back by any eligible soldier's player at the wings step, with each player choosing for their own soldier. Clear the Hand's prose now says it removes the ODM Gear need from every strike on the arm (Opus finding 15).
- **Revised (Chapter 5 review round 2):** Hook and Cut is declared once every success step of the Break Attention is resolved, a freed soldier's release included, and before any other rule (Opus finding 13, Minor). Codex finding 3 (Major) asked at minimum for every pair of held tactics beside the no-tactic row, with every Grab escape in the Squad model (OQ-98); both are run below.
- **Figures:** full-fight model, 12,000 fights, Medium, 4 Rookie player characters, with Help on Break Free and Break Attention rescues in the policy (`tuning.yaml`, `squad_tactics`). Median kill round 3 in every row. Killed by round 3 and Critical Injuries per fight: no tactic 62.6%, 0.71; Hook and Cut 63.2%, 0.64; Hamstring Line 64.6%, 0.69; Clear the Hand 62.0%, 0.70; Fall Back 61.8%, 0.72; Hook and Cut with Hamstring Line 66.2%, 0.63; with Clear the Hand 63.5%, 0.65; with Fall Back 64.2%, 0.64; Hamstring Line with Clear the Hand 64.2%, 0.68; with Fall Back 64.5%, 0.67; Clear the Hand with Fall Back 62.8%, 0.69. With 2 helper Squadmates and Hook and Cut with Hamstring Line: median 2, 72.5%, 0.58. Uses per fight: Hook and Cut 0.36, Hamstring Line 0.99, Clear the Hand 0.08; Fall Back moved a stranded soldier in 0.3% of fights.
- **Simulator case:** the six Grab cells with each tactic held, and tactic policies beyond the probe's.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a); Hook and Cut's Break Attention follows OQ-81's needs. Revised by batch 3b: the needs as revised (decoys in a row, the Feint, a hold of Tempo cards); with Squadmates the median sits on the boundary between rounds 2 and 3.
- **ADR:** none

### OQ-90: Rows and pointers Chapter 5 needs in Chapters 1 to 4

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.14
- **Related:** OQ-18, OQ-28, OQ-35, OQ-45, OQ-49, OQ-56, OQ-61, OQ-62, OQ-83, OQ-84
- **Question:** Chapters 1 to 4 were under conformance review while Chapter 5 was drafted, so Chapter 5 changed none of their files. These are the exact changes that make them agree with Chapter 5.
- **Changes:**
  1. `data/core/bonus-dice-sources.yaml`: add the rows `read-from-distant` and `call-it` exactly as `data/engagement/read.yaml` (`proposed_bonus_dice_sources`) gives them, then delete that block and its comment from `read.yaml`. In the `opening` row, append to `condition`: "The roller did not create the Opening (data/engagement/titan-harm.yaml, openings, own_openings)." Delete the header comment "Call It gets its row when Chapter 5 sets its dice." Then delete the pending-change comment at the end of `titan-harm.yaml`.
  2. `data/character/action-catalog.yaml`, tracked values: add `{id: initiative-swap, name: exchange initiative cards with a comrade, rules: [05-titan-engagement]}` and `{id: squad-tactic-use, name: use a Squad Tactic, rules: [05-titan-engagement]}`.
  3. `data/character/action-catalog.yaml`, entries: add `swap-initiative-card` (kind option, rolled never, context titan-engagement, requirements "data/engagement/round.yaml (swapping)", changes [initiative-swap]) and `squad-tactic` (kind option, rolled never, context titan-engagement, requirements "data/engagement/squad-tactics.yaml (rules, tactics)", changes [squad-tactic-use]).
  4. `data/character/action-catalog.yaml`, existing entries: `break-attention` requirements become "data/engagement/attention.yaml (break_attention)", needs "1, or 2 against a Titan holding a Grabbed soldier; extra successes create Openings (data/engagement/attention.yaml)", and notes "Against a Titan holding a Grabbed soldier, a success frees them (data/engagement/grab.yaml)". `draw-attention` requirements become "data/engagement/attention.yaml (draw_attention)". `read` requirements become "data/engagement/read.yaml (read)" and needs "1; each success reveals one fact (data/engagement/read.yaml, facts)". `call-it` requirements become "Spends successes from a Read (data/engagement/read.yaml, call_it)". `break-free` requirements become "The soldier is Grabbed and not Down, or holds Pry Loose (data/engagement/grab.yaml, escapes)" and needs "2, with a 2-die penalty once lifted (data/engagement/grab.yaml, escapes)". `body-part-strike` requirements replace "The Position requirement Chapter 5 sets for the struck Body Part." with "The Position and state requirements in data/engagement/titan-harm.yaml (body_part_strikes) and data/engagement/grab.yaml (escapes)." and add "unless the Titan is grounded" after the ODM Gear sentence; its needs pointer becomes "(data/engagement/titan-harm.yaml)". `nape-strike` requirements add "The soldier is not Grabbed." and "unless the Titan is grounded (data/engagement/titan-harm.yaml, grounded)" after the ODM Gear sentence.
  5. `data/character/squadmates.yaml`: `wing.assignment_and_unattached_squadmates` becomes "data/engagement/round.yaml (wings)".
  6. `data/harm/down.yaml`: in `while_down.turn`, replace "Chapter 5 states which Position changes a Down soldier's move can make. Until a Chapter 5 rule allows one, the move changes nothing." with "The move can make only the change data/engagement/positions.yaml (moves, down_soldier) allows." In `set_by_other_chapters`, replace the Attention Ladder item with "The Attention Ladder counts a Down soldier only for tests marked down_can_meet (data/engagement/attention.yaml, candidates)."
  7. `data/mind/fear-rolls.yaml`: `comrade-grabbed` and `comrade-dies` `who_rolls` point to "data/engagement/engagement-flow.yaml (witnesses)".
  8. `data/gear/falls.yaml`: `after_the_fall.position` becomes "data/engagement/positions.yaml (falls_land)".
  9. `data/gear/horses.yaml`: `horse_position` replaces its Chapter 5 sentences with pointers to `data/engagement/positions.yaml` (`placement`, `horses`, `two_focus_titans`); `mounted.within_a_move`'s Chapter 5 sentence points to `data/engagement/anchor-ratings.yaml`; the `gear_dice` Break Attention sentence points to `data/engagement/attention.yaml` (`break_attention.decoys`, riderless-horse).
  10. `data/gear/carrying.yaml`: `leaving_play.death.where_left` replaces its Chapter 5 sentence with a pointer to `data/engagement/positions.yaml` (`left_items`, `two_focus_titans`); `carrying_a_comrade.ends` adds "The carried comrade becomes Grabbed. Carrying ends with no fall (data/engagement/grab.yaml)." `passing_items` and `taking_items` requirements, and `data/gear/field-repair.yaml`'s comrade-item target, add that soldiers who have both left count as one Position (data/engagement/positions.yaml, leaving, after_leaving).
  11. `data/gear/odm-gear.yaml`: the Chapter 5 sentences in `odm_moves.definition`, `odm_use.definition`, `strikes.lifted_only_by`, `airborne.stops_being_airborne`, `gas_roll.when`, and `running_dry.airborne` point to `anchor-ratings.yaml`, `positions.yaml` (`moves.odm_use_named_by_this_chapter`, `moves.letting_go`), `titan-harm.yaml` (`grounded`), `grab.yaml`, and `round.yaml` (`end_steps`) respectively. `data/gear/items.yaml` `other_objects` and `data/gear/squad-supply.yaml` `kinds.flares` point to `data/engagement/attention.yaml` (`break_attention.decoys`).
  12. `data/harm/engagement-end.yaml`: the header comment and `soldiers_who_left.set_by_chapter_5` point to `data/engagement/engagement-flow.yaml` (`ending`) and `data/engagement/positions.yaml` (`leaving`); `soldiers_who_left.turns` points to `data/engagement/round.yaml`. `data/harm/health.yaml` `titan_attacks.grab` and `grab_countdown`, `data/harm/treat-injury.yaml`'s Position sentence, `data/mind/stress-responses.yaml` Rally's Position sentence, and `data/character/enlistment.yaml` `trigger_tests.own_state` replace "(Chapter 5)" with the matching `data/engagement` file.
  13. Markdown: the sentences in Chapter 1 section 1.9, Chapter 3's introduction and sections 3.1, 3.3, 3.7, and 3.12, and Chapter 4's introduction and sections 4.2, 4.5, 4.6, and 4.11 that say Chapter 5 will state a rule gain the section 5.x reference; Chapter 2 sections 2.8 and 2.9 list the two new options and tracked values; Chapter 2 section 2.10 points Wings to section 5.3.
- **Options:** (a) Apply every change as listed. (b) Apply the rows (items 1 to 4 and 10's new `ends` row) and leave the pointers until the next conformance pass.
- **Provisional choice:** (a).
- **Why:** ADR-0012 keeps one source per table, so the Bonus Dice and Catalog rows belong in Chapters 1 and 2's files, and ADR-0003 item 12 needs the two new acts there. A pointer that says Chapter 5 will set a rule is stale once Chapter 5 does.
- **Applied (Chapter 5 review round 1 fix):** every change above, in the named files, with four amendments. The `call-it` row's condition says the reader's own dodge gains nothing (Codex finding 11). `read.yaml`'s pointers name the Chapter 1 rows, and `titan-harm.yaml`'s pending-change comment is deleted, so no pointer dangles (Codex finding 10). `data/gear/horses.yaml` and `data/gear/sheet-fields.yaml` record a riderless horse that succeeds as a decoy as having left (Opus finding 2). Chapter 1 section 1.9 points to `data/engagement/round.yaml` (`turn_order`) (Opus finding 5).
- **Added and applied (Chapter 5 review round 2 fix):**
  14. `data/gear/sheet-fields.yaml`: a `positions` field (the soldier's Position relative to each living Focus Titan, by letter, or left) with its invariants, and a `positions` column in `squad_sheet_row`; Chapter 4 section 4.12 lists both (Opus finding 4). `data/engagement/round.yaml` (`titan_card_checklist`, `players_track`) reads from them.
  15. `data/character/action-catalog.yaml`, `break-attention` `needs`: 1 for the Attention holder or a comrade at their Position, otherwise 2, and 2 against a Titan holding a Grabbed soldier (OQ-81).
  16. Chapter 1 section 1.9, *Which turn it spends*: a pointer to the turn a failed Grab dodge gives back (OQ-85).
- **Still pending:** `CONTEXT.md`'s Opening entry says any ally can spend an Opening; to match OQ-83 it should say any comrade of the soldier who created it (Opus finding 16). `data/character/talents.yaml` Relentless and Sharp Call still say Chapter 5 states their details; they were not in this list and are unchanged. The Codex review round 2 (Minor 5) raised the Opening glossary wording again; it stays pending here because this pass does not edit `CONTEXT.md`.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Applied as listed; the Opening glossary entry, the Relentless and Sharp Call pointers in `talents.yaml`, and the `sheet-fields.yaml` header are closed.
- **ADR:** none

### OQ-91: The reference builds' Talent dice on the dodge, Fly, and Break Attention

- **Type:** Unresolved Major
- **Arose in:** Chapters 1 to 4 decisions conformance review, round 1: `docs/reviews/01-04-decisions-conformance-review-1.md`, finding 1 (Major). ADR-0014's OQ-70 amendment ("Talent 1 in the Talent that names each roll a target measures"); Chapter 4 sections 4.3 and 4.9 (dodge, Jam, and gas figures with no Talent); Chapter 2 section 2.10; Chapter 3 section 3.2; the decisions file's Chapter 5 and 6 constraints.
- **Related:** OQ-19, OQ-25, OQ-58, OQ-70, OQ-72.
- **Question:** OQ-70 gave the reference Rookie Talent 1 in the Talent that names each measured roll, and Slip Away, Wirework, and Lure name the dodge, Fly, and Break Attention, so a simulator built from ADR-0014 dodged one base die better than every batch-2 dodge, Jam, and gas figure (Severity 3 alone: 29.2% against 20.7%). Which reading is the baseline Chapter 5 tunes Severity against, and what full builds do the Jam test and the Chapter 6 ladder name?
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2b*, Major 1)
- **Decision:** The reference builds carry no Talent dice on the dodge, Fly, Break Attention, Ride, or Read; Talent applies to the Nape strike, the Body Part strike, Break Free, and Treat Injury. The Jam test and both sides of the Chapter 6 ladder name their full builds (supported Rookie 29.2%, lone Veteran 26.1% at Severity 3), and the Flier template is reported, not tuned.
- **ADR:** ADR-0014 (body rewritten to state the three builds in full)

### OQ-92: Horse ratings against ODM Gear ratings in Standard Issue

- **Type:** Unresolved Major
- **Arose in:** Chapters 1 to 4 decisions conformance review, round 1: `docs/reviews/01-04-decisions-conformance-review-1.md`, finding 2 (Major). `data/gear/standard-issue.yaml` `by_funding` (`odm_gear_rating` 1, 1, 2, 2, 2, 3 against `horse_rating` 1, 1, 1, 1, 2, 2); Chapter 4 sections 4.5 and 4.9; `data/gear/horses.yaml` `gear_dice.choice`; OQ-25's reasoning.
- **Related:** OQ-25, OQ-28, OQ-59, OQ-72.
- **Question:** OQ-72 raised ODM Gear to rating 2 at Funding 3 and left the horse at 1, so a mounted soldier's dodge from the saddle with ODM Gear outrolled the horse dodge (20.7% against 16.0% at Severity 3), lamed the horse three times as often as the harness Jammed, and made Sure Seat and Loose the Horse worthless at Funding 3 and 4, against OQ-25's premise of the same pool in a different currency. Should horses follow the ODM Gear ladder, should the saddle choice go, or should the trade be recorded as a Chapter 5 constraint?
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 2b*, Major 2)
- **Decision:** Standard Issue rates horses 1, 1, 2, 2, 2, 3 by Funding, the same ladder as ODM Gear, so ADR-0014's Rookie has a horse rated 2; the saddle choice stays, and the two dodges again differ only in currency.
- **ADR:** ADR-0014 (the Rookie's horse rated 2, in the rewritten body)

### OQ-93: A worn horse at the interim issue

- **Type:** Unresolved Major
- **Arose in:** Chapters 1 to 4 decisions conformance review, round 2: `docs/reviews/01-04-decisions-conformance-review-2.md`, finding 1 (Major). Chapter 4 section 4.9, *When it is received* (the interim issue "replaces a horse only if the soldier has none, it is lame, or its rating is below the row's, so a worn horse rated at least the row's is kept as it is") and the OQ-59 design note; section 4.5, the OQ-25 design note ("a mounted soldier's dodge has the same pool with either item") and *Lame* ("No other Phase 1 rule restores a horse"); section 4.8 (a horse is not a Field Repair target); `data/gear/standard-issue.yaml` `interim_issue.differences` (the horse step) and `why_narrow`; `data/gear/items.yaml` `horse.restored_by`; `data/gear/horses.yaml` `lame.ends` and `gear_dice.break-attention`; `DECISIONS-2026-09-14.md`, *Batch 2b* Minor 5 and Major 2, and the Chapter 5 constraint ("a mounted Rookie's horse is rated 2 and dodges the same").
- **Related:** OQ-25, OQ-28, OQ-59, OQ-66, OQ-72, OQ-92.
- **Question:** Batch 2b rated the Funding 3 horse 2, so a horse now has a worn state, 1 of 2. The interim issue is the only issue Phase 1 play has, it keeps a worn horse rated at least the row's, and no Phase 1 rule restores a horse, so one point of wear lasts until the horse goes lame. Worn ODM Gear is kept too, but Field Repair restores it in the care window. At 1 of 2 the mounted Rookie (Agility 3, Stress 1, Push when short) rolls one Gear Die, the rating 1 pool OQ-72 and OQ-92 moved away from: a Severity 3 dodge succeeds 16.0% of the time against 20.7%, a Severity 2 dodge 43.9% against 49.8%, and the horse goes lame within three rounds at Severity 3 31.5% of the time against 10.6%. The worn state is common: after three mounted dodges at Severity 3, 40.8% of horses are worn but not lame. Two decided texts stop holding once a horse is worn. The saddle choice is dominated again, so Sure Seat and Loose the Horse lose their point. A lame horse returns next session at 2 of 2 while a worn one never does, the incentive *Batch 2b* Minor 5 ruled out for the full issue, and a soldier can lame their own horse with no fall by Pushing Break Attention with it as the gear item. Should the interim issue, or another Phase 1 rule, restore a worn horse?
- **Options:**
  - (a) Review fix 1. The interim issue's horse step reads like the full issue's: it also replaces a worn horse, and the decline still applies. ODM Gear keeps the narrow rule, since Field Repair restores it in the care window. This changes `interim_issue.differences`, `why_narrow`, `items.yaml` `horse.restored_by`, section 4.1 *Restoring*, the interim sentence in section 4.9, and the OQ-59 note, with no new mechanic.
  - (b) Review fix 2. Give horses a care-window restore, for example 1 current rating per care window held when a Titan Engagement ends. This is a new rule, and it widens restoration past what OQ-66 kept to ODM Gear and tool kits.
  - (c) Review fix 3. Keep the rule and record the trade under OQ-59 and OQ-92 with the figures above. The Chapter 5 constraint becomes "a mounted Rookie's horse at 2 of 2 dodges the same", and Chapter 5's simulator carries a horse worn between fights.
  - (d) (a) written as a test instead of a horse exception: the interim issue replaces a worn item whose `restored_by` list names no written Phase 1 rule other than Standard Issue. Today that is the horse alone; ODM Gear (Field Repair) and medical and tool kits (restocking, Field Repair) keep the narrow rule, and an item a later chapter adds without a restore rule is covered with no further amendment. Same files as (a); `why_narrow` then states that wear carries between sessions only on items the care window can restore.
- **Current handling:** the chapter text, unchanged. Section 4.9, section 4.5, `interim_issue.differences`, `why_narrow`, and `horse.restored_by` keep a worn horse rated at least the Funding row through the interim issue, and the Chapter 5 constraint reads "rated 2 and dodges the same".
- **Why still open:** found in the round 2 conformance review of Chapters 1 to 4 and logged rather than fixed while Chapter 5's reviews run; awaiting the next decision pass. No ADR blocks any option. (a) and (d) follow *Batch 2b* Minor 5's reasoning and change only Chapter 4, its YAML, and OQ-59's summary; (c) changes the decisions file's Chapter 5 constraint and the simulator case instead. Decide it before Chapter 5 tunes mounted Severity against that constraint.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** (a): the interim issue's horse step reads like the full issue's and replaces a worn horse, decline included; ODM Gear keeps the narrow rule because Field Repair restores it in the care window; `why_narrow` states the principle (wear carries between sessions only on items another Phase 1 rule can restore).
- **ADR:** none

### OQ-94: Open Minor findings from the round 2 conformance review of Chapters 1 to 4

- **Type:** Unresolved Minor batch
- **Arose in:** Chapters 1 to 4 decisions conformance review, round 2: `docs/reviews/01-04-decisions-conformance-review-2.md` (Opus, three Minors) and `docs/reviews/01-04-decisions-conformance-review-2-codex.md` (Codex, one Minor).
- **Related:** OQ-59, OQ-70, OQ-72, OQ-73, OQ-91, OQ-92.
- **Findings:**
  1. `01-04-decisions-conformance-review-2.md`, finding 2, Chapter 3 section 3.2 *Reference builds* (also ADR-0014's body, Chapter 2 sections 2.2, 2.7, and 2.10, and `squadmates.yaml` `stat_block.matches_reference_build`): ADR-0014 names four rolls that carry Talent dice and five that carry none, so `death-roll`, `rally`, `field-repair`, `fight`, `block`, and the Expedition rolls `survive`, `endure`, `spot`, and `size-up` read either way for a target's baseline (the Death Roll at Strength 4 is 51.8% without Hard to Kill 1 and 59.8% with it).
  2. `01-04-decisions-conformance-review-2.md`, finding 3, Chapter 4's citations into `OPEN-QUESTIONS.md` (the `Decision` lines of OQ-25, OQ-59, OQ-70, and OQ-72): the register's decision summaries predate batch 2b and do not point to OQ-91 or OQ-92, and OQ-70's still states the withdrawn "Talent 1 in the Talent that names each measured roll" reading.
  3. `01-04-decisions-conformance-review-2.md`, finding 4, Chapter 4 introduction and section 4.9's OQ-72 and reference-builds notes (also the `DECISIONS-2026-09-14.md` preamble *Counts* line): the Counts line leaves OQ-91 and OQ-92 out of the decided entries, the introduction says batch 2b revised three of the chapter's entries when it revised two, and section 4.9 quotes 20.6%, 10.5%, and "about 11%" where batch 2b and the constraints give 20.7% and 10.6%.
  4. `01-04-decisions-conformance-review-2-codex.md`, finding 1, Chapter 4 section 4.3 (also `DECISIONS-2026-09-14.md` OQ-73 item 6): OQ-73 still gives the pre-OQ-72 reference-Rookie median of 6 rounds for a roll needing 2 successes, against Chapter 4's correct remeasured 7, and has no revision line (the finding's `PROGRESS.md` part is superseded by the round 2 row).
- **Current handling:** the chapter, YAML, ADR, decisions file, and register text, unchanged.
- **Why still open:** Minors do not block Done under `PROGRESS.md`, and these were logged rather than fixed while Chapter 5's reviews run; awaiting the next decision pass, which may apply them together with OQ-93.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** All four ruled: ADR-0014 closes its no-Talent list by exclusion ("No other roll a target measures carries Talent dice"); the OQ-25, OQ-59, OQ-70, and OQ-72 summaries above carry their batch 2b clause; the Counts line, Chapter 4's introduction, and its 20.7% and 10.6% figures are corrected; OQ-73's stale median is revised in the decisions file.
- **ADR:** ADR-0014 (body)

### OQ-95: What "comrades close" means for the Grab target in a Squad fight

- **Type:** Unresolved Major
- **Arose in:** Chapter 5, sections 5.9 and 5.13; `data/engagement/tuning.yaml` (`grab`, `prepared_squad_kill`); `docs/reviews/05-titan-engagement-review-1.md`, finding 4 (Major)
- **Related:** OQ-50, OQ-85
- **Question:** ADR-0014 wants a Grab to kill about 1 time in 3 with comrades close. OQ-50's six cells read that as one comrade in reach, and they pass. In a real Squad fight two or three comrades are often close, and the chapter allows rescues the cells leave out (Help on Break Free, Pry Loose, Break Attention needing 2), so a Grab kills far less often. Which figure is the target?
- **Options:** (a) Keep the one-comrade six cells as the band test and report the two-comrade, three-comrade, and Squad-model figures beside it. (b) Tune the Squad-model figure to about 1 in 3, with a lever such as the holding arm keeping its normal Toughness after the lift, Break Attention needing 3 against a holding Titan, or a rescue strike penalty. (c) Amend ADR-0014 to name the arrangement "comrades close" means, or add a Squad-model floor such as "a Grab kills at least 1 time in 10 in the reference fight".
- **Provisional choice:** (a), with (c) left to the decider.
- **Why:** OQ-50's band and its six cells are a decided constraint, and they pass at one comrade. (b) would break them: every lever that lifts the Squad-model rate to 1 in 3 lifts the one-comrade Stress 3, Grief 1 cell past 50%, and keeping normal Toughness after the lift contradicts ADR-0015's Toughness 1 hand. (c) needs an ADR change, which this chapter cannot make. The review offered (b) and a floor under (c); a floor is the decider's call.
- **Figures:** one comrade (the reference), Stress 2 and Grief 0, 33.4% (all six cells 28.7% to 45.1%); two comrades 17.3% (13.1% to 30.3%); three comrades 9.9% (6.4% to 21.9%). Full-fight model (`tools/probes/chapter-05/fight.py`, 12,000 fights, Medium, Stress 1, re-run after review round 2): 4 Rookie player characters 0.209 Grabs and 0.019 devours per fight, 9.1% of Grabs; with 2 helper Squadmates 0.194 and 0.004, 2.1%; template Squad 0.244 and 0.035, 14.4%; 4 player characters and 2 helper Squadmates holding Hook and Cut and Hamstring Line, with Help on Break Free and Break Attention rescues in the policy, 1.3%. The Opus review's model gave about 1 Grab in 18 devoured.
- **Simulator case:** the Squad-model Grab death rate with Help, Pry Loose, and Break Attention rescues, reported under whichever reading the decider picks.
- **Revised (Chapter 5 review round 2):** both reviews judged (a) unsound as a final reading. Opus (provisional-decision audit) recommends (c), naming the arrangement in ADR-0014, and notes that ADR-0014's default Squad of 4 player characters and 2 Squadmates devours about 2% of Grabs, not about 1 in 3. Codex finding 2 (Major) offers amending ADR-0014 to exactly one comrade in reach, a binding Squad-model floor tuned against every written rescue, or reading the reference Squad's actual Positions when the Grab lands and retuning. Where the reviews differ, Opus names one arrangement and Codex also allows a floor or a retune; every one of those options needs an ADR-0014 change or overrides OQ-50's decided band, so this pass takes none of them, keeps (a), and leaves the choice to the decider.
- **Current handling:** (a), PROVISIONAL.
- **Why still open:** every option that settles it amends ADR-0014 or overrides OQ-50's decided band.
- **Round-3 note:** `docs/reviews/05-titan-engagement-review-3-codex.md` M2: the one-comrade cells reproduce (33.70% at Stress 2 and Grief 0, 28.70% to 45.24% across cells) but do not show that "comrades close" holds for a reference Squad with several legal rescuers, where Grabs kill far less often, so the review offers amending ADR-0014 to exactly one available comrade with its reference build and starting state, adding a full-reference-Squad floor tuned alongside the one-rescuer case, or retuning rescue limits or the countdown against the actual reference Squad.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** (c): ADR-0014 names comrades close as one comrade in reach with the reference build and starting state over OQ-50's six cells; the reference Squad's Grab death share is reported, not tuned; no Squad-model floor.
- **ADR:** ADR-0014 (body and `## Amended`)

### OQ-96: The Jam test's acceptance reading

- **Type:** PROVISIONAL
- **Arose in:** Chapter 5, section 5.13; `data/engagement/tuning.yaml` (`jam_test`); `docs/reviews/05-titan-engagement-review-1-codex.md`, finding 1 (Critical)
- **Related:** OQ-72, OQ-78
- **Question:** The decided Chapter 5 constraint (OQ-72) says the reference Rookie holding Attention and dodging for three rounds, with Stress Responses, Help, Covering, and turn debt applied, Jams in no more than a third of fights. It does not say which Help and Covering pattern counts, or which behaviors the Titans resolve. The first draft gave support on a coin flip, which no rule produces. Covering every Push raises the Jam rate, because a Covered soldier's Stress stays low and later Pushes stay available.
- **Options:** (a) Accept on the worst legal support pattern (Help of 0 to 3 dice on every dodge, and Covering on every Push or on none), with the Titans' behaviors dealt by the Behavior Table procedure on the reference table (move-up, no repeats, Shake Off at In Reach resolving as Thrash). Report every card at kill Severity as an upper bound. (b) Accept on the worst support pattern with every card at kill Severity. (c) Keep the coin-flip support pattern.
- **Provisional choice:** (a).
- **Why:** (c) rests on an arbitrary input (Codex finding 1). (b) measures a Titan no Behavior Table can produce, because the procedure never repeats a behavior and turns entries the holder's Position does not allow into fallbacks. (a) is the worst case a legal fight reaches. Under (a) the worst cell is two Large Titans, Covered, no Help, at 32.7%, under a third by 0.6 points. Under (b) two Large Titans reach 35.4% and two Medium Titans 34.6%. If the decider picks (b), the levers are the Medium and Large kill Severity or Chapter 4's wear rule, not this chapter's procedure.
- **Figures:** 60,000 fights per cell, the reference Rookie (Agility 3, ODM Gear 2, no dodge Talent, Stress 1), each Titan dealt its Tempo in cards, and one dodge per Titan per round Pushed toward the first card's Severity. Worst cell over Help 0 to 3 and Covered or not, under (a): one Titan 8.5% Small, 9.1% Medium, 12.4% Large; two Titans 22.3% Small, 24.5% Medium, 32.7% Large. Under (b): one Titan 10.8%, 13.2%, 13.7%; two Titans 28.2%, 34.6%, 35.4%. Random tiers, two Large Titans, Covered: 32.8%. Covering raises every cell. Help lowers the rate in every cell but one, which moves by 0.1 points.
- **Simulator case:** the Jam test inside the full-fight model, with helpers' cards, Positions, and actions deciding who can Help and Cover.
- **Re-run (Chapter 5 review round 2 fix):** no Severity, Tempo, or wear value changed, and the committed probe gives the same figures: the worst cell under (a) is 32.7%, two Large Titans, Covered, no Help; under (b), 35.4% and 34.6%. Both reviews reproduced (a) (32.4% to 32.9%).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a): accepted on the worst legal support pattern against Behavior Table behaviors (32.7%), with every card at kill Severity as an upper bound (35.4%); any Severity, Tempo, or wear change re-runs it.
- **ADR:** none
- **Revised by batch 8 (8-1, 8-14):** the holder now dodges rolled Attack Dice, and "every card at kill Severity" reads "every card at the kill pool"; the test is re-run under Attack Dice as a check (OQ-145).

### OQ-97: Round time and the bookkeeping aids

- **Type:** Unresolved Major
- **Arose in:** Chapter 5, section 5.3; `data/engagement/round.yaml` (`gm_tracker`, `titan_card_checklist`, `rolled_together`; `end_steps`, gas-rolls); `docs/reviews/05-titan-engagement-review-1-codex.md`, finding 12 (Major); `docs/reviews/05-titan-engagement-review-1.md`, finding 20 (Minor)
- **Related:** OQ-29, OQ-77
- **Question:** The final design review wants 12 to 20 minutes per round with six fully tracked soldiers (decisions file, OQ-29). Codex review 1 counted 12 to 15 GM update moments and about twenty live tracker marks per Titan, and judged a typical round unlikely to fit. No timed test exists.
- **Options:** (a) Keep every rule and add aids: a Titan-card checklist in procedure order, each soldier's Position in one Squad sheet column per Focus Titan, Gas Rolls and one event's witness Fear Rolls rolled together, and fewer hidden fields (a standard Titan's values are public, OQ-84). Owe a timed paper test before accepting the bookkeeping. (b) Fix Wings for the whole Titan Engagement and replace dealt cards with a smaller initiative method. (c) Collapse each Body Part's state and count into one track, or make gas one Squad-level check.
- **Provisional choice:** (a).
- **Why:** (b) changes the cards and Wings that ADR-0010 and OQ-77 rest on, and (c) changes ADR-0007's Body Part States or Chapter 4's decided gas rule. (a) saves time without changing a rule. The paper test decides whether (b) or (c) is needed.
- **Playtest case:** a timed paper round with 4 player characters and 2 Squadmates against one Medium Titan, and one against two Focus Titans, reporting the median round time.
- **Revised (Chapter 5 review round 2):** Codex finding 4 (Major): no timed test supports the round-time claim, and a second Focus Titan roughly doubles the Titan-side work. Opus finding 4 (Major) found that the Squad sheet column (a) relies on did not exist; `data/gear/sheet-fields.yaml` now has a `positions` field and Squad sheet column (OQ-90 item 14). The Opus review counted, in the full-fight model, 5.2 tracker writes, 1.1 ladder evaluations, and 2.3 strike or Break Attention pools per round, and estimated 12 to 17 minutes for a typical round, 16 to 22 for a Grab round, and 22 to 30 for a round against two Focus Titans. A timed paper round is a playtest, which this drafting pass cannot run.
- **Current handling:** (a), PROVISIONAL.
- **Why still open:** the playtest case above. If the one-Titan median misses 20 minutes, the decider weighs (b) or (c).
- **Round-3 note:** `docs/reviews/05-titan-engagement-review-3-codex.md` M5: no timed test supports 12 to 20 minutes a round, and the review counts 12 to 15 GM procedure moments in a one-Titan round and 20 to 25 with two Titans before player deliberation, dice, and sheet updates, so it asks for timed one- and two-Titan paper rounds with unfamiliar players reporting median and upper-quartile times, simpler tracker updates, targeting, or card resolution if they miss, or describing the band as an unverified design target (the Opus round 3 review's estimate, 22 to 30 minutes for two Focus Titans, also names that round as the likely failure).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** Keep (a) with trims and bounds: the 12 to 20 minute band binds the one-Titan round with 4 player characters and 2 Squadmates, a two-Focus-Titan round is bounded at 30 minutes; Wings stand between losses; every soldier's Positions are read from the Squad sheet; the timed paper test has pass criteria and pre-decided fallbacks (fixed Wings and no swap step with an ADR-0010 amendment, then longer interim Background clocks). Revised by batch 3b: the fallback clock list is 8, 6, and 6 with 10.
- **ADR:** none now; ADR-0010 only if the first fallback is triggered

### OQ-98: The policy each Chapter 5 tuning figure is measured under

- **Type:** Unresolved Major
- **Arose in:** Chapter 5, section 5.13; `data/engagement/tuning.yaml` (`probes`, `prepared_squad_kill`, `simulator_cases`); `tools/probes/chapter-05/`; `docs/reviews/05-titan-engagement-review-2-codex.md`, finding 3 (Major)
- **Related:** OQ-78, OQ-85, OQ-89, OQ-95, OQ-96
- **Question:** ADR-0014 tunes numbers with a simulator, and `PROGRESS.md` lists that simulator as not started. Chapter 5's figures come from probe scripts that play one stated policy with no Read, Call It, Wings, or swaps, and until this pass with no Squad Tactic, although every Squad holds two from its first Titan Engagement. Which policy does each target row measure, and what must be run before the starting values are accepted?
- **Options:** (a) Build the full simulator cases in `tuning.yaml` (`simulator_cases`) before accepting any starting value. (b) Amend ADR-0014 so each target names its baseline policy (no Read, no Squad Tactic, no swap, no Wing), with tactic, Read, and rescue policies reported beside it as sensitivity rows. (c) Keep the baseline rows as the tuning evidence, report every held tactic alone and in pairs and every Grab escape a Rookie Squad has beside them, and keep the full simulator owed.
- **Provisional choice:** (c), recommending (b) to the decider.
- **Why:** (a) is the Phase 1 simulator item in `PROGRESS.md`, a separate work item rather than a chapter fix. (c) is the review's minimum, and it shows the starting values hold under every legal tactic pair: the Medium median kill stays in round 3, and Critical Injuries per fight stay between 0.63 and 0.72. (b) changes ADR-0014's wording, which only the decider can do.
- **Figures:** as OQ-89. The Grab escapes (Help on Break Free, and Break Attention needing 2 from a rescuer who cannot reach the hand) changed no figure under the probe's rescue policy, because a rescuer who can reach the hand always strikes it; Pry Loose is left out because no reference soldier holds it. The probes now give exact commands (`tuning.yaml`, `probes`, `commands`), and `core.py` names PyYAML as their dependency (Codex finding 6, Minor).
- **Current handling:** (c), PROVISIONAL.
- **Simulator case:** every item in `tuning.yaml` (`simulator_cases`), including rescue policies that choose Help and Break Attention where a player would.
- **Round-3 note:** `docs/reviews/05-titan-engagement-review-3-codex.md` M4: the probes still leave out Read, Call It, Wings, swaps, Background effects, treatment, Pry Loose, and their combinations, so they cannot set the balance envelope of ADR-0014's named reference builds (the decoy-and-tactics row already reaches a round 2 median kill at 0.31 Critical Injuries per fight), and the review offers extending the simulator to every reference-build action with published policies, amending ADR-0014 so the current baseline is the target population with sensitivity bounds for omitted abilities, or keeping every affected tuning choice provisional until the full cases run.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** (b) with (c): ADR-0014 states the baseline policy each target is measured under, with sensitivity rows beside it; the tactic and escape rows stand as that evidence, and `tuning.yaml` `simulator_cases` plus the decisions file's Chapter 6 list are the Phase 1 simulator's specification.
- **ADR:** ADR-0014 (body and `## Amended`)

### OQ-99: Open Minor findings from Chapter 5 review round 3

- **Type:** Unresolved Minor batch
- **Arose in:** `docs/reviews/05-titan-engagement-review-3.md` (Opus, Minors 2 to 7) and `docs/reviews/05-titan-engagement-review-3-codex.md` (Codex, Minors 1 to 3). Neither review found a Critical. The Majors are logged under OQ-81 (Opus finding 1, Codex Major 3), OQ-79 (Codex Major 1), OQ-95 (Codex Major 2), OQ-98 (Codex Major 4), and OQ-97 (Codex Major 5).
- **Related:** OQ-75, OQ-78, OQ-83, OQ-85, OQ-87, OQ-89, OQ-90, OQ-98.
- **Question:** The next decision and fix pass should settle each Minor below. Each line gives the review file, finding number, location, and the problem. The review files hold the scenarios and fix options.
- **Findings:**
  1. `05-titan-engagement-review-3.md`, Minor 2. `data/engagement/grab.yaml` (`countdown.failed_dodge`); section 5.9 *The countdown*; OQ-85 option (e). On a Tempo 2 Titan, a soldier with turn debt whose failed dodge against the first card spent next round's turn gets no refund when the second card is a Grab, so the Grab lands with both counted turns spent and the victim is devoured with no Break Free.
  2. `05-titan-engagement-review-3.md`, Minor 3. `data/engagement/attention.yaml` (`decoys.riderless-horse.requirement`) against `data/gear/horses.yaml` (`gear_dice.break-attention`). One file compares a dismounted horse's Position relative to the targeted Titan, which no rule defines against a second Focus Titan, and the other relative to the Focus Titan recorded with the horse.
  3. `05-titan-engagement-review-3.md`, Minor 4. `data/gear/sheet-fields.yaml` (`positions`, `squad_sheet_row.positions`, file header); section 5.3 *What the GM tracks*; `data/engagement/round.yaml` (`titan_card_checklist`, `players_track`). The ladder aid reads every soldier's Positions from a Squad sheet row only Squadmates must have, no rule says which copy governs when the sheet field and the column differ, their formats differ, and the file header has no `provisional: [OQ-90]` marker.
  4. `05-titan-engagement-review-3.md`, Minor 5. `data/engagement/background-titans.yaml` (`retreat.moves`, option 4); section 5.10; OQ-87's round 2 revision. Option 4 lists Lift Comrade as a rescue action that lets a soldier stay beside an uncarried comrade, but the lift makes the comrade carried, so it can never satisfy the option.
  5. `05-titan-engagement-review-3.md`, Minor 6. `data/engagement/squad-tactics.yaml` (`rules.tuning`). The row says the tuning figures were measured without Squad Tactics, though `tuning.yaml` (`prepared_squad_kill.squad_tactics`) now reports every tactic alone and in pairs.
  6. `05-titan-engagement-review-3.md`, Minor 7. Section 5.13, *Large* bullet; OQ-78's *Why*; `data/engagement/tuning.yaml` (`verdict`); `data/engagement/size-classes.yaml` line 54. "Twice Medium's harm" hides that a Large fight deals seven times Medium's deaths (0.19 against 0.027), and the `size-classes.yaml` comment gives 36.5% where the other texts give 36.6%.
  7. `05-titan-engagement-review-3-codex.md`, Minor 1. `CONTEXT.md` Opening entry; section 5.7 *Openings*; OQ-90. The glossary still lets any ally spend an Opening, against Chapter 5's rule that its creator never can.
  8. `05-titan-engagement-review-3-codex.md`, Minor 2. Section 5.3 *What the GM tracks* (the review's "5.3.4"); `data/engagement/round.yaml` (tracker update cadence); section 5.9 *The countdown*. The cadence lists the Grab countdown update only after each Titan card, though the lift advances after each counted turn of the Grabbed soldier.
  9. `05-titan-engagement-review-3-codex.md`, Minor 3. `data/engagement/anchor-ratings.yaml` (the Blind Spot wording, line 45); `CONTEXT.md` Blind Spot note. The YAML describes Blind Spot as "behind" the Titan, the shorthand the glossary avoids.
- **Overlaps:** item 7 is the glossary change already pending under OQ-83 and OQ-90 (round 2 Opus finding 16 and Codex Minor 5), and item 3's header marker is also in the Opus round 3 audit of OQ-90. Item 1 is a residual of OQ-85's rule (e), item 6 corrects OQ-78's *Why*, item 4 corrects OQ-87's round 2 revision, and item 5 should follow OQ-89 and OQ-98. Item 2 touches OQ-75's recorded horse Positions.
- **Current handling:** the chapter, YAML, `CONTEXT.md`, and OPEN-QUESTIONS text, unchanged.
- **Why still open:** Chapter 5 has had its third and last review round, and the round 3 reviews must stay accurate reviews of the current text, so no fix was applied. Items 1, 4, 6, and 7 change the reasoning or wording of OQ-85, OQ-87, OQ-78, and OQ-83, which the decision pass settles first. Minors do not block Done under `PROGRESS.md`; every item awaits the next decision and fix pass.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3*)
- **Decision:** All nine ruled: the Tempo 2 refund (OQ-85), the riderless-horse wording (OQ-75), one Positions record on the Squad sheet with a unified format and the OQ-90 header (OQ-97), Lift Comrade off retreat option 4 (OQ-87), the tuning row (OQ-89), the Large wording and 36.6% (OQ-78), the Opening glossary (OQ-83), the countdown cadence line (OQ-97), and Blind Spot without "behind" in the YAML and the glossary.
- **ADR:** none

### OQ-100: How Chapter 6 marks a Grab entry and lists its harm

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, section 6.1; `data/titans/index.yaml` (`grab_mark`); every entry in `data/titans/standard-small.yaml`, `standard-medium.yaml`, `standard-large.yaml`, and `sprinting-abnormal.yaml`; Chapter 6 review round 1 (Opus finding 11)
- **Related:** OQ-39, OQ-42, OQ-80, OQ-105
- **Question:** The Chapter 6 constraints require:
  - each harming entry to list its Injury Location and whether its Critical Injury cannot be lethal;
  - entries with a grab effect to be marked, because the Closing Hand Scar triggers on "a behavior that Chapter 6 marks as a Grab".

  `data/engagement/titan-format.yaml` (`entry_fields`) has no field for that mark, and a grab effect has no Injury Location field.
- **Options:**
  - (a) Give each entry a `marked_grab` field and a `harm` list (source, Injury Location, cannot_be_lethal), checked against `effects` by a probe, and point the Scar at `marked_grab`.
  - (b) Add no field. An entry whose effects include a grab effect is marked; each rendered table shows the mark in its Grab column; the Scar's trigger reads "a behavior whose Behavior Table entry has a grab effect". A critical-injury effect already names its Injury Location and lethality, and a grab effect's harm is the Grab's crush in `data/harm/health.yaml`.
  - (c) Keep a table-level list of Grab entries and a harm summary beside each table.
- **Provisional choice:** (b). The first draft took (a).
- **Why:**
  - **(a) restated `effects`.** Two sources for one fact inside one YAML entry is what ADR-0012's single source exists to prevent, and the drift check compared a Grab's harm against the word "torso" written into `titans.py`, a rule value in a probe that claims none. Once the Scar read `marked_grab`, a dodge pool depended on the copy (review round 1, Opus finding 11).
  - **(b) meets the constraint's word "marked"** with the fact that decides it. The Grab column is rendered from the effects, so it cannot disagree with them.
  - **(c)** splits one entry's data across two places.
- **Earlier-chapter change needed:** applied in the round 1 fix pass (OQ-105):
  - `data/mind/scars.yaml` (`the-closing-hand`) triggers on an entry with a grab effect, shown in each table's Grab column;
  - `data/harm/health.yaml` (`named_by`, `titan_attacks.definition`) points to the effects in `data/titans/` and `index.yaml` (`grab_mark`);
  - `data/engagement/titan-format.yaml` (`entry_fields`) lists only `text`.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** Keep (b): an entry is marked as a Grab by its grab effect alone, shown in each table's Grab column; the Closing Hand Scar reads it; no entry field is added.
- **ADR:** none

### OQ-101: The standard Behavior Tables, and the reading of the kill-share constraint

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, sections 6.1 to 6.4 and 6.6; `data/titans/standard-small.yaml`, `standard-medium.yaml`, `standard-large.yaml`; `data/titans/tuning.yaml` (`targets`); `tools/probes/chapter-06/titans.py`; Chapter 6 review round 1 (Opus finding 4, Codex findings 2 and 6)
- **Related:** OQ-78, OQ-80, OQ-96, OQ-98, OQ-105
- **Question:** The Chapter 6 constraints fix each standard table's shape and targets, but not its entries: the behaviors, Injury Locations, targets, fallbacks, telegraphs, and Body Parts used. They also say "a table whose kill share by previous behavior exceeds one half at any state is redrawn", without saying whether a state includes Broken parts.
- **Options:**
  - (a) The tables as revised, with "any state" read as every previous behavior combined with every count of Broken eyes, arms, and legs.
    - **Small:** Gape, Lurch Closer (telegraph), Clutch at the Legs (arm; leg Critical Injury), Scrabble, Bite (leg, can be lethal), Grab (one arm).
    - **Medium:** Fixed Grin (eyes, telegraph), Snap Short, Swat (arm; rolled location), Shake Off, Bite (torso, can be lethal), Grab.
    - **Large:** Loom (telegraph), Heavy Tread (holder and Position, needs both legs, OQ-109), Crush (holder, leg), Shrug Off, Bite (On Body only, torso, can be lethal, falls back to Crush), Grab.
  - (b) The same tables, with "any state" read as previous behaviors on an unbroken Titan only.
  - (c) The reference table's entries, renamed, for all three classes.
  - (d) The first draft's entries (Totter Closer, Groping Reach, Brush Off), whose text described legs and hands their rows did not list.
- **Provisional choice:** (a).
- **Why:**
  - **Canon (845 to 850).**
    - Titans go for people, not pain and not horses. They grin and stare, snap at the air, swat soldiers from the air, roll and heave to shake off what clings to them, and bite or grab and eat.
    - A Small Titan stands 3 to 5 m, taller than a soldier, but crouches, crawls, and ducks its head, so it clutches at legs and bites them. The first draft's claim that its head sits at a standing soldier's waist was wrong (Codex finding 6).
    - A Large Titan's mouth is far above the ground, so its Bite needs a soldier on its body.
    - Each table telegraphs once, because a Titan's intent shows in its body.
  - **The strict reading.** OQ-80 made the move-up shift a measured quantity because Broken parts move shares, so a state that leaves out Broken parts would miss the case the constraint is for.
    - Under this reading the reference table reaches 4 results in 6 (both arms Broken, previous behavior Shake Off), so (c) fails.
    - Every table in (a) peaks at exactly one half.
    - What makes that possible on the standard tables: the kill results are 5 and 6, a control entry at 3 uses a Body Part kind only if the kill entry at 6 uses it too, and the entries at 4 and 5 use none. The Sprinting Abnormal's table puts its Grab at 5 and passes by enumeration (OQ-102).
    - (b) would have accepted the first Large and Abnormal drafts, which reached 4 in 6.
  - **Text and Body Parts (d).** A Broken Body Part makes the entries that use it illegal (glossary, Body Part State), so an entry whose text shows a hand or a leg its row does not list gives two readings at the table (Opus finding 4, Codex finding 2). Adding the part breaks the kill-share limit (`titans.py`, `share_report`):
    - Small Lurch Closer with a leg: 0.67 (previous Scrabble, both arms and both legs Broken).
    - Medium Snap Short with an arm (Groping Reach's hand): 1.00 (previous Shake Off, eyes and both arms Broken). Medium Shake Off with an arm: 1.00.
    - Large Shrug Off with an arm: 0.67. Large Crush with a leg: 0.83.

    So those entries were renamed and their text rewritten to need no Body Part, and the Small Grab uses one hand. `titans.py` (`validate`) now fails any `text` that names the Titan's arm, leg, or eyes when `body_parts_used` does not list that kind, and all four Titans pass.
  - **Figures at the reference start** (12,000 fights; `data/titans/probe-figures.yaml`), re-run after decision batch 3e, whose flag and nearest rules moved them within sampling:
    - **Medium:** median kill round 3, 62.8% by round 3, 0.68 Critical Injuries, 0.031 deaths, and 0.200 Grabs per fight, inside every Medium band. A mounted start gives 61.6%, 0.69, and 0.029; a first Titan Engagement with its Fear Roll gives median 3, 57.9%, 0.74, and 0.040, still inside every band.
    - **Small:** median round 2, 0.81 Critical Injuries.
    - **Large:** median round 3, 12.8% with no kill within 12 rounds, 1.38 Critical Injuries, and 0.160 deaths, with Heavy Tread needing both legs (13.0%, 1.38, and 0.162 with one leg before batch 3e; OQ-109).
    - **Jam test's worst cells:** Small 8.4% and 22.5%, Medium 9.3% and 24.4%, Large 12.4% and 32.9% (one and two Titans, Covered, no Help). Mounted at Distant: 8.6% and 23.1%, 9.8% and 25.9%, 12.2% and 32.6%. The Large two-Titan cell is under a third by 0.4 points, against about 0.2 points of sampling error, so any change to the Large table re-runs it.
  - **Large's Crush:**
    - Striking everyone at the holder's Position (4,200 fights), 16.6% of fights had no kill within 12 rounds, over the 15% limit, with 2.66 Critical Injuries and 0.284 deaths.
    - On the holder only (3,000 fights): 13.5%, 1.40, and 0.139.
    - On the holder only, with Bite falling back to Thrash instead of Crush: 11.9%, 1.09, and 0.135.
    - Bite falling back to Crush was kept, because a Titan that cannot reach a grounded soldier's head still crushes them. The 12,000-fight run confirms it inside the limit.
  - **The Medium Bite** fixed at the torso gives the same deaths per fight as the reference table's rolled Bite (0.031 against 0.030 in the port check). It stacks with Grab crushes under Chapter 3's torso worsening, which section 6.3 states.
  - **Round 2 lines** (review round 2, Opus findings 8 and 9). Crush slams the Titan's bulk down beside the soldier and pins their legs, so its leg Critical Injury, which cannot be lethal, reads as a pin rather than a 15 m Titan's full weight. The design note's Swat swats at soldiers, since it has no knock-loose. Gape, Fixed Grin, and Loom work at any Position, so their lines no longer show the Titan touching a soldier at Distant or looking at one at Blind Spot, and `titans.py` fails such phrases.
  - **Thrash in play** (review round 3, Opus Minor 2). Thrash is the behavior every table resolves most: 30.2% of the Small Titan's resolved cards, 41.6% of the Medium Titan's, 40.6% of the Large Titan's, and 38.2% of the Sprinting Abnormal's at their reference starts (`tools/probes/batch-3e/abnormal_b3e.py`, 12,000 fights a table; `data/titans/tuning.yaml`, `verdicts`, `thrash_share`). Nearly all of it comes from a holder at a Position the rolled entry excludes, most often a Nape striker who fell short at Blind Spot, not from a Broken part. The tables keep Thrash as the fallback: pointing each fallback at the table's own knock-loose entry would re-open the kill share, the Jam test, and every reference row, and the repeat rule would still turn a repeated fallback into Thrash. Section 6.1 states the share, and each table's Thrash line describes that Titan's own body (Small writhes and rolls, Medium jerks and twists, Large heaves, the Sprinting Abnormal spins on the spot).
- **Simulator case:** Broken eyes in the full fight with a policy that strikes eyes (only titans.py covers them), and every table with Squad Tactics, screens, and helper Squadmates under the full rules. Since decision batch 3b (3b-8) the probes report those rows for every table, and every Squad Tactic alone and in pairs for the standard Medium Titan (Chapter 6, section 6.6, *Support rows*), so the simulator re-measures them rather than measuring them first (`data/titans/tuning.yaml`, `simulator_cases`).
- **Earlier-chapter change needed:** `data/engagement/behavior-procedure.yaml` (`move_up_shares`) states the reading; applied in the round 1 fix pass (OQ-105, item 8).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** Keep (a): the three standard tables as revised, with "any state" read as every previous behavior combined with every count of Broken parts; Thrash's share of resolved cards is an accepted, stated consequence of the fallback rule; any change to the Large table re-runs the two-Titan Jam cell.
- **ADR:** none

### OQ-102: The Sprinting Abnormal's Attention Ladder and Behavior Table

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, section 6.5; `data/titans/index.yaml` (`ladders`); `data/titans/sprinting-abnormal.yaml` (`behavior_table`); Chapter 6 review round 1 (Codex finding 1; Opus findings 2, 7, 8, 9, 13, 18); review round 2 (Opus findings 1, 2, and 9)
- **Related:** OQ-81, OQ-84, OQ-101, OQ-103, OQ-105, OQ-107, OQ-109
- **Question:** The glossary gives an Abnormal its own Behavior Table, and Chapter 5 gives the format of its table and ladder and the closed tests list. Nothing says what an Abnormal's ladder or table should hold, or which Abnormal of 845 to 850 Phase 1 should use.
- **Options:**
  - (a) A Titan-only runner.
    - **Ladder:** loudest-or-brightest, nearest.
    - **Table:** Run Past (holder and Position, Distant or In Reach, both legs); Veer (telegraph); Trample (leg Critical Injury that cannot be lethal, Distant or In Reach, both legs); Pitch Headlong (knock loose, On Body or Blind Spot, Severity 1); Grab (In Reach or On Body, arm); Headlong Lunge (rolled location, can be lethal, In Reach or On Body, both legs, falls back to Pitch Headlong).
  - (b) The same table with the ladder loudest-or-brightest, hooked-into-its-body, current-holder, nearest. Decision batch 3e (3e-6) added current-holder to the closed `tests` list for Abnormal ladders.
  - (b1) The round 2 ladder, loudest-or-brightest, hooked-into-its-body, nearest, under decision batch 3e's nearest rule.
  - (c) The same table with the standard ladder.
  - (d) The first draft: ladder mounted, loudest-or-brightest, airborne, nearest; Leap, Snatch, and Open-Jawed Lunge reaching Distant, and Buck.
  - (e) A crawling Abnormal that goes for Down and injured soldiers (tests down and most-harmed).
  - (f) The same table with a runner's ladder on a new test added to Chapter 5's closed `tests` list, such as "the Position holding the most soldiers" or "the farthest soldier": loudest-or-brightest, the new test, hooked-into-its-body, nearest.
- **Provisional choice:** (b). Round 1 took (a); the round 2 fix pass moved to (b1) (review round 2, Opus finding 2), whose figures measured a Titan that kept its holder, because the nearest rung as then written tied every candidate and the holder step kept them (review round 3, Opus Critical 1). The decision batch 3e pass names current-holder, so the ladder says what the figures measure.
- **Why:**
  - **(d) borrowed a Shifter.** In manga chapter 22 (anime episode 17) the ordinary Abnormal ignores the outer riders, runs toward the formation's centre, and is brought down when riders cut its legs and then its Nape. The Titan that then runs down riders, snatches a soldier out of the air, and changes course to intercept is the Female Titan, a Shifter (Codex finding 1). Shifters are not Phase 1 (ADR-0002, ADR-0013), so the rider-first ladder, Snatch, and Leap are withdrawn.
  - **Why (a) fell.** Round 1 read canon as "ignores the soldiers close to it, including those attacking it" and took a ladder with no hooked rung. But the nearest rung keeps On Body, then In Reach, then Blind Spot. So (a) went straight for the soldiers clinging to it and the cutters at its legs, and passed over only the Nape striker at Blind Spot, even one who had just struck. That is the opposite of its canon reason, and it made the Abnormal the quickest Medium-class kill.
  - **Canon for (b).** The runner pays no heed to the soldiers in its reach or to the riders cutting at its legs, and once it has picked its way it keeps to it, past the outer riders, until riders bring it down. So (b) drops the standard ladder's rungs for reach (nearest-person-in-reach) and pain (just-hurt-it), and names current-holder above nearest: the soldier it last turned on stays its quarry, wherever they stand, at Distant or Down, until noise, a blade at its Nape, or a soldier On Body turns it. Only when nothing holds its Attention (when the fight begins, when a decoy's hold or a Grab ends, or when its holder is gone) does it go for the nearest, so the cutters at its legs draw it only then. Like every Titan it turns on what digs into it, an anchor in its body or a blade at its Nape, which ADR-0010 counts as hooking in, so a striker who falls short draws its next behavior. Noise still outranks everything, standing in for what draws it away. (b) keeps the ADR-0010 clause that (a) set aside, so the round 1 question of ADR-0010's wording no longer arises. (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
  - **Why (b1) fell.** Under decision batch 3e's rule, nearest narrows to the closest candidates, so (b1) leaves its quarry for whoever stands closer, like a standard Titan with no rung for reach or pain. It fails the bar's ceiling in three supported rows at 120,000 fights a row (`tools/probes/batch-3e/abnormal_b3e.py`): helpers 0.0304 deaths against the standard Large Titan's 0.0196 (12.7 standard errors), the screen 0.0165 against 0.0106 (10.4), and the screen with Hook and Cut and Hamstring Line 0.0137 against 0.0092 (8.0).
  - **How often it runs its quarry down** (its reference start, 60,000 fights, `abnormal_b3e.py`): the current-holder rung keeps a holder who is not at the closest Position 1.45 times a fight, 0.76 of its cards a fight resolve against a holder at Distant while a candidate stands closer, and 0.18 against a Down holder. (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
  - **(f) is the faithful runner.** Canon's Abnormals head for where the most people are, and no test on the closed list says that. It needs a new test in `data/engagement/attention.yaml` (`tests`) and a decision, which this fix pass may not make while the batch 3c decision on Chapter 5 runs. Under (f) every Abnormal figure re-runs.
  - **(c)** keeps the standard Titan's turn on reach and pain, which canon's runner does not show.
  - **Figures** (12,000 fights at the Abnormal's reference start, OQ-103; `data/titans/probe-figures.yaml`), each with the round 2 table (leg entries needing both legs, OQ-109; Pitch Headlong at Severity 1, OQ-103), under decision batch 3e's rules:
    - (b): median kill round 2, 74.6% by round 3, 5.2% with no kill within 12 rounds, 0.83 Critical Injuries, 0.071 deaths.
    - (a): median kill round 3, 74.7%, 2.0%, 1.18, 0.099. Under batch 3e's nearest rule (a) goes for whoever is closest, usually the cutters at its legs.
    - (c): 70.5%, 3.9%, 1.13, 0.124.

    (b) holds every part of the bar in every row (OQ-103). It still falls sooner than the standard Medium Titan (62.8% by round 3), which its Nape Depth of 3 decides (OQ-103), but a Squad now pays at the Nape. (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
  - **Riders.** Two mounted Squadmates waiting at Distant give 75.3% by round 3 and 0.057 deaths. Nothing on its ladder prefers a rider, so they neither draw it nor screen it. The rider model runs Chapter 5's Grab countdown for a Grabbed rider (round 1, Opus finding 2), and a mounted soldier who goes Down falls (round 1, Codex finding 5). (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
  - **Riders after decision batch 3b** (3b-8). A decoy holds a Focus Titan for as many of its next cards as its Tempo, so a riderless horse sent at this Abnormal buys one round of its cards (two cards) rather than one. The riders row sends no horse. The support rows do. Two Squadmates screening beside the holder start mounted, ride to the holder's Position, send their horses, throw their cloaks, and Feint. They leave it resolving 1.181 cards a round, with 0.51 Critical Injuries and 0.009 deaths per fight, against 1.547, 0.73, and 0.021 with helpers (Chapter 6, section 6.6, *Support rows*). Since the round 2 fix pass the model keeps each horse's state legal (review round 2, Codex finding 1). Since decision batch 3e a flag lasts until the end of the Titan's next card that resolves a behavior, so a flag set during the horse's two-card hold stands until the Titan next acts, and these rows were re-run under that rule. (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
  - **Draw Attention** under (b) pulls the Titan off its quarry and off a striker who has just struck, since the loudest flag outranks every rung: 75.7% by round 3 and 3.2% with no kill, while the loud cutter at In Reach takes the cards (0.94 Critical Injuries, 0.088 deaths). (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
  - **The lone fight** (decision batch 3b; section 6.6, GM subsection): its table is the chapter's deadliest for a lone Rookie. Run Past and Trample reach a soldier waiting at Distant, so 52.0% of lone fights reach a usable strike within 12 rounds, with 20.8% Down and 1.53 Critical Injuries per lone fight, against 77.0% on the standard Medium Titan. A report, not part of the bar. The lower rate is a table effect (Trample reaching Distant, and the start's Fear Roll), not a closed route: no decoy is usable first in 0.0% of its waiting lone fights (decision batch 3c, 3c-7). The ladder does not act in a lone fight, and the lone model breaks no Body Part, so the round 2 changes leave these rows as they were; they were re-run with batch 3c's spare canister and Field Repair. (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
  - **Text and effects agree.**
    - No entry promises what its effects lack (round 1, Opus finding 8).
    - No entry has two harming effects, so OQ-107's case does not arise (round 1, Opus finding 9).
    - No text uses a glossary Avoid term (round 1, Opus finding 18).
    - A grounded Titan cannot run past, trample, or lunge (OQ-109).
    - Veer's and Pitch Headlong's lines work at any Position and grounded (review round 2, Opus finding 9).
  - **Kill share.** Its highest kill share in any state is one half (previous Pitch Headlong). After Veer, with both arms Broken and a leg Broken, only Pitch Headlong can be rolled, and it falls back to Thrash away from On Body and Blind Spot.
  - **The mounted Jam reading** (round 1, Opus finding 13): a holder on horseback at Distant loses the horse within three rounds in 8.6% of Titan Engagements against one Sprinting Abnormal and 23.0% against two.
  - **(e)** belongs with ADR-0009's night rules for Abnormals, which the Expedition rules have not written.
- **Earlier-chapter change needed:** none left for (b): decision batch 3e added current-holder to `data/engagement/attention.yaml` (`tests`) and Chapter 5, section 5.6, and made the nearest rung narrow when it is the highest rung met. Option (f) adds a test to the same list and section.
- **Simulator case:** a Read revealing its ladder, and a Draw Attention policy that uses it (`data/titans/tuning.yaml`, `simulator_cases`).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** (b)'s ladder and table, with two Chapter 5 changes (4-3): a tie the card step cannot break, at the start of a Titan Engagement or at an end step, leaves Attention held by nothing until the Titan's next card, so the Squad sheet's order chooses nothing (the Opus conformance review's Critical 1: the committed probe's cutters-first sheet chose the quarry, and the strikers first or a random order broke the ceiling by 5 to 16 standard errors); and current-holder is met only by a holder who is not at Distant, so a quarry who rides clear is dropped and cannot be parked (Major 2). Under the rule the sheet order does nothing (0.126 deaths at the reference start either way), and the values as committed fail the ceiling, so OQ-103 changes. Option (f) stays rejected (tools/probes/batch-4/runner_b4.py). Revised by batch 4b: the ladder's first rung is hooked-into-its-body, as on every ladder (a rule of the ladder format, ADR-0010), so it reads [hooked-into-its-body, loudest-or-brightest, current-holder, nearest]; a rider shouting from Distant no longer pays (4b-1).
- **ADR:** ADR-0003 and ADR-0010 (`## Amended`, batch 4)

### OQ-103: The Sprinting Abnormal's values, and the bar an untuned Abnormal is reported against

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, sections 6.5 and 6.6; `data/titans/sprinting-abnormal.yaml` (stat block, Pitch Headlong's Severity); `data/titans/tuning.yaml` (`targets`, `abnormals`); `tools/probes/chapter-06/run6.py` (`bar`); Chapter 6 review round 1 (Opus findings 1 and 5, Codex finding 4); review round 2 (Opus finding 3, the drafter's conflict 2)
- **Related:** OQ-78, OQ-98, OQ-102, OQ-104, OQ-109
- **Question:** The Chapter 6 constraints report Abnormals under the probes, untuned, with values inside the Size Class rows' bounds. They do not say which values an Abnormal takes, at what start it is measured, or what a report must show before its stat block stands. The brief asks that no Chapter 6 fight be unwinnable or trivial, which needs a measurable test.
- **Options:**
  - (a) Medium Size Class, Tempo 2, Nape Depth 3, Regeneration 3, Toughness 2 for every Body Part, and Severity 1, 2, and 3 by tier, except Pitch Headlong at 1. Reported at its reference start (4 Rookie player characters under the baseline policy, all mounted at the start, each making the `abnormal` Fear Roll) against a bar whose every limit is a standard Titan's measured figure. Every part is read row against row: each Abnormal row against the standard Medium and Large Titans' rows with the same support (its twins), or their reference rows where they have none. A limit holds within sampling when the figure is past its twin's by no more than 2 standard errors of the difference, at 120,000 fights a row. (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
    - **Not trivial:** in every row, a median kill in round 2 or later and at least the Medium twin's Critical Injuries; at the reference start, more deaths than the Medium Titan's reference row.
    - **Winnable:** in every row, a median kill by round 4 and no more fights with no kill within 12 rounds than the Large twin.
    - **Ceiling:** in every row, deaths per fight at most the Large twin's.
    - **Report:** Critical Injuries and deaths per Titan Engagement from the setup table, with and without its Abnormal roll.
  - (a1) Round 1's reading: the same values with Pitch Headlong at 2, the floor read row against row, and the winnable limits and the ceiling fixed at the standard Large Titan's reference and template figures (15%, 20.4%, 0.162, 0.268).
  - (a2) (a)'s bar with Pitch Headlong at the medium row's control Severity of 2.
  - (b) (a) with leg Toughness 3.
  - (c) The first draft's bar: winnable (median within 4 rounds, under a fifth with no kill) and not trivial (more Critical Injuries and deaths than the standard Medium Titan), at the on-foot reference start with no Fear Roll, sensitivity rows exempt.
  - (d) Report the figures with no bar.
  - (e) Keep (a1)'s reference-figure ceiling, but say it binds only the reference and template rows, and record that a supported Squad finds the Abnormal deadlier than the standard Large Titan.
- **Provisional choice:** (a). Round 1 took (a1).
- **Why:**
  - **The start** (round 1, Opus finding 1). Chapter 5 gives every soldier the `abnormal` Fear Roll when it starts a Titan Engagement, and a Squad meeting it on an Expedition rides. The probes model both. Starting on foot with the same Fear Roll changes nothing beyond sampling (74.9% by round 3, 0.82 Critical Injuries, 0.072 deaths).
  - **One reading for every part** (review round 2, Opus finding 3).
    - (a1) read the floor row against row, as decision batch 3b directs, but held the ceiling at the Large Titan's reference figure of 0.162 deaths. The Large Titan's support rows deal 0.008 to 0.019 deaths, so that ceiling was 8 to 20 times too loose to bind a supported Squad.
    - The gap it hid was real. At 120,000 fights the round 1 Abnormal's deaths with helpers, the screen, and the screen with the pair sat about 4, 6, and 7 standard errors above the Large Titan's (review round 2).
    - 3b-8 says the Abnormal's bar is read row against row, with no carve-out. (a) reads all three parts that way, and (a1)'s provisional line was the reading that let the Abnormal pass.
  - **The sampling tolerance** is stated once, in `tuning.yaml` (`abnormals`, `sampling`), and applies alike to the floor, the winnable limit, and the ceiling.
    - A twin within sampling neither fails a row nor passes one that is truly past it.
    - The bar runs at 120,000 fights a row, where a death rate of 0.01 to 0.02 per fight has a standard error of 0.0003 to 0.0006.
    - The median kill round is read exactly.
  - **(e)** would accept that a supported Squad meets an Abnormal deadlier than the hardest standard fight Phase 1 accepts, with no row telling a Mission Brief author so.
  - **Figures under (a)** (the round 2 table, and OQ-102's ladder with current-holder, OQ-109; every row and bar row re-run under decision batch 3e's rules; `data/titans/probe-figures.yaml`; history: before decision batch 4, see the Decision line and Chapter 6, section 6.6):
    - **Reference start** (12,000 fights): median kill round 2, 74.6% by round 3, 83.0% by round 4, 5.2% with no kill within 12 rounds, 0.83 Critical Injuries, 0.071 deaths, and 0.322 Grabs per fight, 16.6% of them fatal.
    - **The bar** (120,000 fights a row): every row holds every part. The closest row to each limit:
      - Critical Injuries: the screen with the pair, 0.44 against the Medium Titan's 0.38.
      - No kill within 12 rounds: the template Squad, 17.3% against the Large Titan's 20.0%.
      - Deaths: with helpers, 0.0198 ± 0.0005 against 0.0196 ± 0.0006, 0.3 standard errors apart and within sampling. Screening gives 0.0098 against 0.0106, and screening with the pair 0.0083 against 0.0092.
      - Without current-holder, the same rows fail the ceiling by 8.0 to 12.7 standard errors (OQ-102, *Why (b1) fell*).
    - **Template Squad** (12,000 fights): median round 3, 51.1% by round 3, 17.4% with no kill, 1.32 Critical Injuries, 0.208 deaths.
    - **Jam test** worst cells 9.1% and 24.8%; mounted, 8.6% and 23.0%.
  - **(a2), Pitch Headlong at Severity 2, fails the ceiling.**
    - Under OQ-102 (b)'s ladder, a Nape striker who falls short draws the Abnormal's next behavior, and Pitch Headlong's knock-loose throws them.
    - Measured in the round 2 fix pass with `fight6.py`'s `entry_over`, 60,000 fights a row (not committed as rows, since each fails the bar): helpers 0.0259 ± 0.0008 deaths against the Large Titan's 0.0189 ± 0.0009, about 6 standard errors apart. The screen with the pair gave 0.0089 ± 0.0004 against 0.0073 ± 0.0005. The reference start gave 74.9% by round 3, 0.90 Critical Injuries, and 0.088 deaths.
    - Changing Headlong Lunge instead (a fixed leg or arm location, or Severity 2) left the helpers row at 0.024 to 0.025, because the Lunge causes few of those deaths.
    - Pitch Headlong at Severity 1, a slow, heaving roll that a clinging soldier can ride out or leap clear of, holds: helpers 0.0194 at 60,000 fights, and 0.0199 at 120,000.
  - **(b)** failed the ceiling: its template Squad row gave 0.296 deaths per fight at 12,000 fights, over 0.268 (round 1). With every Toughness the Medium row's, only Tempo, Nape Depth, and Pitch Headlong's Severity differ from the Medium row.
  - **Nape Depth 3** is load-bearing. At Nape Depth 4, with the round 1 ladder, the template Squad row gave a median kill in round 7, 36.9% with no kill, and 0.418 deaths (review round 2). With the table and ladder as they stand, under decision batch 3e's rules (`tools/probes/batch-3e/abnormal_b3e.py`, 120,000 fights a row), every row read fails the winnable limit and the ceiling: the reference start 18.5% with no kill against the Large Titan's 13.0% and 0.172 deaths against 0.164; helpers 12.6% against 9.3% and 0.051 against 0.020; the template Squad a median kill in round 6, 37.0% against 20.0%, and 0.344 against 0.278. Nape Depth 3 is why the Abnormal falls sooner than the standard Medium Titan (74.6% by round 3 against 62.8%). Tempo 2 is how fast it runs.
  - **What a Read teaches** (review round 3, Opus Minor 3). Its Nape Depth is a Read fact, so a Tactician who reads it learns that this Abnormal's Nape is shallower than a standard Medium Titan's, where nothing in 845 to 850 makes Abnormals softer at the Nape. The chapter keeps Nape Depth 3 and states the cost in its GM note (section 6.6): the lesson is about this Titan, which is dangerous for its speed and its two cards a round, and every Abnormal's Nape Depth is its own hidden value, so the next one a Squad reads can be deeper. The levers that would keep Nape Depth 4 (leg Toughness, a kill Severity, or its Grab's reach) each move a row the bar already binds tightly, and none was measured to hold; the decider may prefer re-choosing them.
  - **The setup mix** (OQ-104): 0.84 Critical Injuries and 0.054 deaths per Titan Engagement without the Abnormal roll, 0.85 and 0.057 with it. (History: before decision batch 4; see the Decision line and Chapter 6, section 6.6.)
  - **(d)** leaves "neither unwinnable nor trivial" unmeasured, against ADR-0014's rule that "deadly but earned" must be measurable.
  - **The PC death target** stays the Expedition simulator's test, at the setup table's rate and any Mission Brief's.
- **Simulator case:** the Abnormal against the PC Critical Injury and PC death targets (`data/titans/tuning.yaml`, `simulator_cases`).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** (a)'s bar unchanged, read under batch 4's tie-break in both sheet orders; Medium class, Tempo 2, Nape Depth 3, Regeneration 3, Toughness 2 stand; the Grab and Headlong Lunge move to Severity 2, so both kill entries are one below the medium kill tier's Severity 3, Pitch Headlong one below the medium control tier's Severity 2, and Trample at that control Severity (4-4; 4b-7). At 120,000 fights a row, in both sheet orders, the ceiling holds with helpers (0.0205 and 0.0197 deaths against the Large twin's 0.0205 and 0.0216), the screen (0.0104 and 0.0102 against 0.0104 and 0.0105), and the screen with the pair (0.0078 and 0.0081 against 0.0086 and 0.0082), and the floor and the winnable limit hold by 20 standard errors or more; the Grab alone at Severity 2 fails one seed in the pair row (+2.1). The reference start moves to median round 2, 69.7% by round 3, 0.85 Critical Injuries, 0.078 deaths. Every Abnormal figure re-runs. Revised by batch 4b: the bar's limits are unchanged, and a row past 2 standard errors on one seed is re-run on a second seed and fails only on the pooled figure; the decided helpers ceiling sits at the Large twin's rate, and the Grab alone at Severity 2 sits above it, pooled +3.5 standard errors (4b-4). Under the swapped ladder (4b-1) the bar holds in both orders: helpers 0.0206 and 0.0194 deaths against 0.0207 and 0.0215, the screen 0.0101 and 0.0096 against 0.0108 and 0.0101, the screen with the pair 0.0078 and 0.0080 against 0.0088 and 0.0092.
- **ADR:** ADR-0014 (`## Amended`, batch 4)
- **Revised by batch 5:** The bar's winnable limit reads "no kill" for "no kill within 12 rounds", the share of fights that end with the Focus Titan alive under the retreat clock (decision batch 5, 5-10; OQ-126). Re-measured under the clock at 120,000 fights a row in both sheet orders, the bar holds every limit in every row, the helpers ceiling at −10.5 and −11.8 standard errors (`tools/probes/batch-5/retreat_b5_bar.out`).

### OQ-104: When the Abnormal enters Phase 1 play

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, section 6.1; `data/titans/index.yaml` (`abnormals`, `enters_play`); `data/engagement/engagement-setup.yaml` (`medium_abnormal`); Chapter 5, section 5.1; Chapter 6 review round 1 (Codex finding 3, Opus finding 14)
- **Related:** OQ-87, OQ-103, OQ-105
- **Question:** Until Mission Briefs exist, every Titan Engagement's Focus and Background Titans come from the interim setup table, which gives only a Size Class. Chapter 6 makes that class's standard Titan the one that appears, and no Phase 1 rule names an Abnormal, so without a roll the Sprinting Abnormal, the `abnormal` Fear Roll, and the Abnormal Read facts never reach play.
- **Options:**
  - (a) The Abnormal appears only when a starting rule names it, and the setup table is unchanged.
  - (b) When the Focus Titan's Size Class roll gives Medium, roll D6 on `medium_abnormal`: on a 6 the Focus Titan is the Sprinting Abnormal (1 Titan Engagement in 12 that the table sets up). Background Titans are always standard.
  - (c) A Chapter 6 table rolled after the setup table.
  - (d) A playtest-only starting rule that names it for one scripted Titan Engagement.
- **Provisional choice:** (b). The first draft took (a).
- **Why:**
  - **(a) left it unreachable** in the written Phase 1 game (Codex finding 3), and untested before Mission Briefs, where the model is least trusted (Opus finding 14).
  - **(b)** is a deterministic step in the one setup procedure (ADR-0003, ADR-0012). Its cost is measured: 0.84 Critical Injuries and 0.054 deaths per Titan Engagement without it, 0.85 and 0.057 with it (after the decision batch 3e re-run) (the Focus Titan's reference row, weighted by the table's odds; `data/titans/probe-figures.yaml`).
  - **Background Titans stay standard,** so no Phase 1 Titan Engagement has two hidden-value trackers, and the Background Titan figures Chapter 5 measured stand.
  - **(c)** splits one setup procedure across two chapters' files (ADR-0012). **(d)** is outside the rules a table plays by.
- **Earlier-chapter change needed:** applied in the round 1 fix pass: `data/engagement/engagement-setup.yaml` gains `medium_abnormal` and names it in the `focus-titan` step, and Chapter 5 section 5.1 lists it with a `PROVISIONAL:` line.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** Keep (b): the medium_abnormal roll in the setup table, 1 Titan Engagement in 12; Background Titans are always standard; the setup mix re-runs under 4-4.
- **ADR:** none

### OQ-105: Rows and pointers Chapter 6 needs in Chapters 1 to 5

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, sections 6.1, 6.5, 6.6, and 6.7; Chapter 6 was drafted while the conformance review of Chapters 1 to 5 ran, so its first draft edited none of their files; Chapter 6 review round 1 (Opus finding 15)
- **Related:** OQ-80, OQ-81, OQ-90, OQ-98, OQ-100, OQ-101, OQ-104, OQ-106, OQ-107
- **Question:** Several earlier-chapter sentences and rows say Chapter 6 will state something, point at a file that did not exist, or need a field Chapter 6 adds. Which should change?
- **Items**, all applied in the Chapter 6 round 1 fix pass except where noted:
  1. `data/engagement/engagement-setup.yaml` (`steps`, `focus-titan`, `background-titans`): point to `data/titans/index.yaml` (`standard_titans`), with the `medium_abnormal` roll (OQ-104).
  2. `data/engagement/background-titans.yaml`: the stat block a Background Titan uses points to `data/titans/index.yaml`.
  3. `data/mind/scars.yaml` (`the-closing-hand`): the trigger reads an entry with a grab effect (OQ-100).
  4. `data/harm/health.yaml` (`titan_attacks.definition`): points to the effects in `data/titans/` and `index.yaml` (`grab_mark`).
  5. `data/engagement/titan-format.yaml`: `entry_fields` lists `text`; its closing comment points to `data/titans/`.
  6. `data/engagement/attention.yaml` (`abnormal_ladder_format` comment) and `data/engagement/read.yaml` (`facts`, `attention-ladder`): point to `data/titans/index.yaml` (`ladders`).
  7. `data/engagement/tuning.yaml`: `simulator_cases` gains Chapter 6's cases, including the start-of-fight Fear Rolls; the `simulation_reference_titan` comment points to `data/titans/`.
  8. `data/engagement/behavior-procedure.yaml` (`move_up_shares`): states Chapter 6's reading of "any state" (OQ-101), and that the reference table reaches 4 in 6 under it.
  9. Chapter prose pointers to `data/titans/` files and Chapter 6 section numbers: Chapter 1 (introduction, the section 1.9 example note), Chapter 3 (introduction, section 3.1), Chapter 4 (introduction, example note), Chapter 5 (introduction, sections 5.1, 5.2, 5.4, 5.6, and 5.13).
  10. `docs/rules/PROGRESS.md`: Chapter 6's row. Not edited, by instruction.
  11. `data/harm/health.yaml` (`named_by`): points to `data/titans/` (Opus finding 15).
  12. `data/engagement/titan-format.yaml` (`stat_block.fields.attention_ladder`): an Abnormal's ladder id is found in `data/titans/index.yaml` (`ladders`) (Opus finding 15).
  13. Chapter 5, section 5.10: a Background Titan's stat block is public except an Abnormal's hidden values, as `background-titans.yaml` says (Opus finding 15).
  14. `CONTEXT.md`, Nape Depth and Regeneration: not applied; logged as OQ-106 (Opus finding 15).
  15. Chapter 5's probe `fight.py` makes no start-of-fight Fear Roll. Chapter 6's `fight6.py` makes them, and item 7 lists the case for the simulator (Opus finding 15).
  16. A sentence in `data/engagement/behavior-procedure.yaml` (`resolving_a_card`) for a card's later effects on a target who has died: not applied; logged as OQ-107.
  17. The Titan index renamed from `data/titans/roster.yaml` to `data/titans/index.yaml`, with every pointer in items 1, 2, 4, 6, and 12 and in Chapter 5's prose: applied in the decision batch 3e pass (OQ-110).
- **Provisional choice:** apply items 1 to 9 and 11 to 13 as pointers, comments, and field lists; item 1's `medium_abnormal` roll is the one rule among them, and it is OQ-104's.
- **Why:** each applied item points at, or lists, what Chapter 6's files already state. Items 14 and 16 change a glossary entry or a Chapter 5 rule, so they wait for a decision.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** The applied items stand; item 14 is decided as OQ-106 and item 16 as OQ-107; item 10 (PROGRESS.md) stays the coordinator's; item 15 stays a simulator case.
- **ADR:** none

### OQ-106: The glossary's "set by Size Class" for Nape Depth and Regeneration

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, section 6.5; `data/titans/sprinting-abnormal.yaml`; `CONTEXT.md` (Nape Depth, Regeneration); Chapter 6 review round 1 (Opus finding 15)
- **Related:** OQ-78, OQ-103, OQ-105
- **Question:** The glossary defines Nape Depth as the successes a Nape strike needs, "set by Size Class", and Regeneration as a clock that ticks "at a pace set by Size Class". Batch 3's Chapter 6 constraint lets an Abnormal list every value in full, with Nape Depth 3 to 5 and Regeneration 2 to 4 whatever its Size Class, and the Sprinting Abnormal's Nape Depth of 3 is not the Medium row's 4. Which wording holds?
- **Options:**
  - (a) Amend both glossary entries to "set by Size Class, or by an Abnormal's own stat block".
  - (b) Keep the glossary and narrow the constraint so an Abnormal's Nape Depth and Regeneration always match its Size Class row.
  - (c) Leave both as they are.
- **Provisional choice:** (a). Chapter 6 follows the batch 3 constraint meanwhile and cites this entry in section 6.5.
- **Why:**
  - **(a)** matches the decided constraint and the glossary's own Abnormal entry, which gives an Abnormal its own table. Only `CONTEXT.md` changes, which Chapter 6 may not edit.
  - **(b)** reopens a batch 3 decision and removes the lighter build the Sprinting Abnormal is measured with (OQ-103).
  - **(c)** leaves a glossary term contradicting a stat block.
- **Earlier-chapter change needed:** `CONTEXT.md`, the Nape Depth and Regeneration entries.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** Keep (a): the glossary's Nape Depth and Regeneration entries read "set by Size Class, or by an Abnormal's own stat block".
- **ADR:** none (CONTEXT.md edited)

### OQ-107: A card's later effects on a target who has died

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, section 6.1; `data/engagement/behavior-procedure.yaml` (`resolving_a_card`); `tools/probes/chapter-06/fight6.py`; Chapter 6 review round 1 (Opus finding 9)
- **Related:** OQ-80, OQ-102, OQ-105
- **Question:** Chapter 5 applies a card's effects in order. An effect can kill its target, through a fall's Critical Injury or a lethal Critical Injury's instant-death row. Nothing says whether the card's later effects still apply to that target, for Grief, the record, or a second Critical Injury. The first draft's Leap (knock loose, then a Critical Injury) reached the case.
- **Options:**
  - (a) A target who dies receives none of the card's later effects; every other target still does.
  - (b) Every effect applies, and effects on a dead target are recorded but change nothing.
  - (c) Forbid any entry that gives a target an effect after one that harms them.
- **Provisional choice:** (a). No Chapter 6 entry gives a target any effect after one that harms them, so no table in Chapter 6 reaches the case, and `fight6.py` models (a).
- **Why:**
  - **(a)** is the reading a table reaches without a ruling: a dead soldier cannot dodge, take Stress, or be knocked loose, and the Critical Injury that killed them is already recorded.
  - **(b)** invites a second Critical Injury on a corpse to count for Grief and records.
  - **(c)** constrains later Abnormals and Mission Brief Titans that the procedure could serve.
- **Earlier-chapter change needed:** one sentence in `data/engagement/behavior-procedure.yaml` (`resolving_a_card`, effects) and Chapter 5's card procedure prose. This is a Chapter 5 rule, so it waits for a decision.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** Keep (a) as a Chapter 5 rule: a target who dies receives none of the card's later effects; every other target still does (Chapter 5 section 5.5; behavior-procedure.yaml, resolving_a_card, effects).
- **ADR:** none

### OQ-108: Where the rulebook prints an Abnormal's hidden values

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, sections 6.1, 6.5, and 6.6; `data/titans/index.yaml` (`abnormals`, `hidden_until_read`); Chapter 6 review round 1 (Opus finding 16)
- **Related:** OQ-84, OQ-102, OQ-103
- **Question:** Chapter 5 makes an Abnormal's Toughness, Nape Depth, Regeneration clock length, and Attention Ladder Read facts. The first draft printed all of them, with a player-facing summary of the ladder, in a chapter every player reads, so a Read's successes bought nothing a player had not already read.
- **Options:**
  - (a) Print the hidden values and the ladder, with what they mean at the table, only in a GM section of section 6.5 that players do not read, and mark section 6.6's Abnormal figures as the GM's. The Behavior Table, which is not a Read fact, stays public.
  - (b) Keep them public, and state that they are hidden at the table, not in the book.
  - (c) Move Abnormals to a separate GM book or chapter.
- **Provisional choice:** (a).
- **Why:**
  - **(a)** keeps a Read worth its successes and matches Chapter 5's list of what is hidden, no more. The GM section decides nothing (ADR-0003): it holds values Chapter 5's procedures read. `data/titans/` stays the single source, and a tool that follows `hidden_until_read` hides the same values.
  - **(b)** makes Reads against an Abnormal worthless for any group that has read the chapter.
  - **(c)** splits one chapter's rules across books before the Phase 1 rulebook has a GM book.
- **Applied in the round 2 fix pass** (review round 2, Opus finding 4):
  - The Sprinting Abnormal's lone-strike and lone-fight rows are rendered only in section 6.6's GM subsection. `render.py` renders the public `solo` and `lone-fight` tables for the standard Titans and a separate block for each Abnormal.
  - The design-note sentences that gave its Nape Depth moved into that subsection.
  - Section 6.5's player-facing note no longer gives its Toughness.
  - What stays public is not a Read fact: its Tempo, its Behavior Table and each entry's Severity, its move-up shares, the Jam test, the Grab cells, and its support rows.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** Keep (a): an Abnormal's hidden values and ladder print only in a GM section; its table, Tempo, Severities, shares, Jam test, Grab cells, and support rows stay public.
- **ADR:** none

### OQ-109: What a grounded Titan's leg entries need

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6, sections 6.1, 6.4, and 6.5; `data/titans/sprinting-abnormal.yaml` (`run-past`, `trample`, `headlong-lunge`); `data/titans/standard-large.yaml` (`heavy-tread`); `tools/probes/chapter-06/titans.py` (`validate`); Chapter 6 review round 2 (Opus finding 1)
- **Related:** OQ-80, OQ-82, OQ-101, OQ-102, OQ-103
- **Question:** One Broken leg grounds a Titan (Chapter 5, section 5.7; ADR-0007 pictures the leg dropping it to the ground). An entry that lists `leg` once needs only one unbroken leg (`titan-format.yaml`, `entry_fields`, `body_parts_used`). So a Titan lying on the ground could still run past, trample, or lunge in one long stride, and the standard Large Titan could still walk at a soldier with Heavy Tread. At the Abnormal's reference start, about 0.48 leg entries a fight resolved while it was grounded, 0.32 of them Trample or Headlong Lunge Critical Injuries (review round 2, 12,000 fights). What stops a grounded Titan's leg entries?
- **Options:**
  - (a) Every Chapter 6 entry that uses a leg lists both legs (`[leg, leg]`), so one Broken leg makes it illegal and its result moves up. `titans.py` fails an entry on a two-legged Titan that lists one leg.
  - (b) Keep one leg, and rewrite the texts and section 6.5 for a grounded Titan that drags itself at a soldier.
  - (c) A Chapter 5 rule in `behavior-procedure.yaml`: a grounded Titan cannot meet an entry that lists `leg`.
- **Provisional choice:** (a).
- **Why:**
  - **(a)** uses the format as it stands: a kind listed twice needs two. It changes only Chapter 6's rows, and the grounded picture, the rows, and the text agree. The move-up keeps every table legal: the highest kill share in any state stays 0.50 on every table, and the fewest legal entries besides Thrash stay 3 on the Large Titan and 1 on the Sprinting Abnormal (after Veer with both arms Broken and one leg Broken, only Pitch Headlong). Listing both legs on Run Past and Trample alone fails the limit at 0.67 (previous Pitch Headlong, one leg Broken; review round 2), so Headlong Lunge lists both legs too.
  - **The standard Large Titan** does not move beyond sampling. At 120,000 fights its reference row gives 12.9% with no kill within 12 rounds, 1.40 Critical Injuries, and 0.161 deaths per fight, against 13.0%, 1.38, and 0.162 at 12,000 fights with one leg. A grounded Heavy Tread moves up to Crush, which harms only an In Reach holder. The Jam test resolves no Broken part, so its cells do not change.
  - **The Sprinting Abnormal** loses its grounded sprint. With its round 1 ladder, both legs gave 83.1% by round 3, 0.86 Critical Injuries, and 0.049 deaths at the reference start, against 82.6%, 1.08, and 0.058 with one leg (review round 2). Its figures under the round 2 ladder and Severities are in OQ-103.
  - **(b)** keeps a Titan on the ground doing a runner's acts, which the grounded rule and ADR-0007's picture contradict, and keeps the Abnormal's grounded Critical Injuries.
  - **(c)** states the rule once for every two-legged Titan, but it is a Chapter 5 rule that this fix pass may not write while the batch 3c decision on Chapter 5 runs, and every table would re-run. If the decider takes (c), `[leg, leg]` becomes `[leg]` again with the same effect.
- **Earlier-chapter change needed:** none for (a). Option (c) would add a sentence to `data/engagement/behavior-procedure.yaml` (`next_behavior`, `roll`, `legal`, and `resolving_a_card`, `choose`) and Chapter 5 section 5.5.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** Keep (a): every Chapter 6 entry that uses a leg lists both legs, so a grounded Titan cannot resolve it; no new Chapter 5 rule; titan-format.yaml notes the convention.
- **ADR:** none

### OQ-110: The file name `data/titans/roster.yaml`

- **Type:** PROVISIONAL
- **Arose in:** Chapter 6 review round 2 (Opus finding 10); `data/titans/roster.yaml`
- **Related:** OQ-100, OQ-102, OQ-104, OQ-105
- **Question:** The glossary lists "roster" among Squad Pool's _Avoid_ terms. Chapter 6's index of Titans is `data/titans/roster.yaml`, and Chapter 5's files and prose point to it by that name. A file of Titans named `roster` invites the word back into use for the Squad. Should the file be renamed, and when?
- **Options:**
  - (a) Rename it `data/titans/index.yaml`, in a pass that may edit Chapter 5, moving every pointer at once.
  - (b) Keep the name, and add a `CONTEXT.md` note that file names are exempt from the _Avoid_ lists.
  - (c) Rename it now, in Chapter 6's files alone.
- **Provisional choice:** (a), applied in the decision batch 3e pass, which may edit Chapter 5: the file is `data/titans/index.yaml`, every pointer below names it, and `titans.py` loads it as `TITAN_INDEX`. Before that, in the round 2 fix pass, Chapter 6 changed what it owns:
  - the file's `id` is now `chapter-6-titans`;
  - its header comment names this entry;
  - no Chapter 6 rule text uses the word except as the file's name.
- **Why:**
  - **(c)** breaks the pointers in Chapter 5's files and prose. The round 2 fix pass may not edit them while the batch 3c decision on Chapter 5 runs.
  - **(b)** leaves the pattern a later author copies, such as a Foundry importer naming the Squadmate compendium after the Titan file.
  - **(a)** keeps one source of truth (ADR-0012) and moves the pointers together.
- **Earlier-chapter change needed:** applied in the decision batch 3e pass. The file was renamed, then every pointer updated:
  - `data/engagement/engagement-setup.yaml` (`steps`, `focus-titan` and `background-titans`), `background-titans.yaml`, `attention.yaml` (the `abnormal_ladder_format` comment), `read.yaml` (`facts`, `attention-ladder`), and `titan-format.yaml` (`stat_block.fields.attention_ladder`);
  - `data/harm/health.yaml` (`titan_attacks`) and `data/mind/scars.yaml` (`the-closing-hand`);
  - `docs/rules/05-titan-engagement.md` (introduction, sections 5.1 and 5.6);
  - in Chapter 6: `tools/probes/chapter-06/titans.py` (`ROSTER`, now `TITAN_INDEX`), `run6.py`, and `render.py`, the pointers in every `data/titans/*.yaml` file, the chapter's file table and references, and OQ-100 to OQ-109. This entry keeps the old name where it states the question. The decisions file, the reviews, and the glossary's _Avoid_ line keep it as history.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 4*)
- **Decision:** Keep (a): data/titans/index.yaml, applied in the batch 3e pass with every pointer.
- **ADR:** none

### OQ-111: Flags on a card that comes up while the Titan holds a Grabbed soldier

- **Type:** PROVISIONAL
- **Arose in:** applying decision batch 3c (3c-1); Chapter 5 sections 5.5 and 5.6; `data/engagement/attention.yaml` (`flag_duration`)
- **Related:** OQ-81, OQ-89, OQ-102
- **Question:** ADR-0003 item 2, as amended in decision batch 3c, says a flag lasts until the Titan's next card that evaluates its Attention Ladder. Decision 3c-1 adds that a card which resolves nothing because the Titan holds a Grabbed soldier still clears the flags, though that card evaluates no ladder. Read by its words alone, the ADR keeps those flags until the first card after the Grab ends. Which governs?
- **Options:**
  - (a) Follow 3c-1: a card that comes up while the Titan holds a Grabbed soldier clears the flags. The Grab holds Attention, so a flag set during it is never read, and the first card after release starts clean, as batch 3 ruled.
  - (b) Follow the ADR's words: flags survive the Grab, and the first card that evaluates the ladder after release reads them, so a soldier who struck the Nape during the Grab draws the freed Titan's turn.
  - (c) Amend ADR-0003 item 2 to name the exception: a flag lasts until the Titan's next card that evaluates its Attention Ladder or that comes up while it holds a Grabbed soldier.
- **Provisional choice:** (a), applied in Chapter 5 sections 5.5 and 5.6, `attention.yaml` (`flag_duration`), `behavior-procedure.yaml` (`resolving_a_card`), and `round.yaml` (`per_round_order`), and in `tools/probes/chapter-05/fight.py` and `tools/probes/chapter-06/fight6.py`, which clear the flags on a holding card. (c) is the wording that would close the gap. (History: revised by batch 3e, both probes now keep the flags on a holding card.)
- **Why:**
  - **(a)** is 3c-1's explicit text and the batch 3 Grab ruling it cites, and every committed Chapter 5 and 6 figure was measured under it.
  - **(b)** changes whom a freed Titan turns on, which the Grab rescues were not measured against, and would re-run every row with a Grab.
  - The gap is in the ADR's wording, which this pass may not edit.
- **Earlier-chapter change needed:** under (a), none beyond the ADR-0003 item 2 amendment in (c). Under (b), Chapter 5 sections 5.5 and 5.6, `attention.yaml` (`flag_duration`), `behavior-procedure.yaml`, `round.yaml`, both fight probes, and every Chapter 5 and 6 row with a Grab re-run. (History: under the batch 3e decision, (b), these were made.)
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 3d*, revised under *Batch 3e*)
- **Decision:** (c) in batch 3d, revised by batch 3e to (b): a flag lasts until the end of the Titan's next card that resolves a behavior, so a card that comes up while the Titan holds a Grabbed soldier leaves the flags standing, like every card that resolves nothing, and the first acting card after the release reads them; measured, the Grab rows do not move (3e-1).
- **ADR:** ADR-0003 (`## Amended`, batch 3d; item 2 rewritten in the list and `## Amended`, batch 3e)

### OQ-112: Four strikers beat the baseline Squad on every table

- **Type:** Unresolved Major
- **Arose in:** Chapters 5 and 6 decisions conformance review, round 2: `docs/reviews/05-06-decisions-conformance-review-2.md`, finding 2 (Major). Chapter 5, section 5.13 (the baseline roles) and `data/engagement/tuning.yaml` (`prepared_squad_kill`, `simulator_cases`); Chapter 6, section 6.1 (Thrash's share), section 6.5 *Cut one leg*, and section 6.6 *How the fights compare*; ADR-0014's sensitivity rows. Measured in decision batch 4b (4b-2, `tools/probes/batch-4b/strikers_b4b.py`, 60,000 fights a row).
- **Related:** OQ-78, OQ-80, OQ-98, OQ-101, OQ-103.
- **Question:** A Squad of four eager Nape strikers kills every Titan sooner and takes less harm than the baseline Squad of two leg cutters and two strikers. On Chapter 5's reference Titan: 78.4% killed by round 3, 0.43 Critical Injuries, 0.008 deaths, and a median kill in round 2, against the baseline's 61.9%, 0.71, 0.030, and round 3. On the standard Small Titan 90.4%, 0.65, 0.019 against 80.6%, 0.84, 0.043; the standard Medium 78.1%, 0.42, 0.011 against 61.6%, 0.70, 0.034; the standard Large 78.8%, 0.79, 0.084 against 61.4%, 1.42, 0.165; the Sprinting Abnormal 91.4%, 0.62, 0.019 against 69.4%, 0.86, 0.079. The strikers make 4.6 Nape strikes a fight against the baseline's 3.3 and 0.3 Body Part strikes against 5.8. A striker who falls short holds Attention at Blind Spot, where most entries fall back to Thrash's knock-loose (OQ-101), while the cutters stand at In Reach, where every Grab, Bite, Trample, and Lunge applies; two more Nape attempts a round and the Openings a short strike leaves are worth more than the grounded dice the cutters buy. So cutting legs, which the chapters, Hamstring Line, and canon teach, is the worse policy under the rules as written. Which rule or value, if any, should make the cutters' work worth its price?
- **Options:**
  - (a) Accept it and say so: ADR-0014's kill target is read under the baseline policy, the four-striker row is reported beside every target, and the cutters' role is restated as grounding a Titan that must be stopped (a retreat, a Background Titan, a Grab rescue), not killing it faster.
  - (b) Limit what Blind Spot holds: at most two soldiers hold Blind Spot relative to one Titan (canon's pair at the Nape), so a third striker waits at In Reach.
  - (c) Give the Titan its turn against a Blind Spot holder: a holder at Blind Spot counts as In Reach for an entry's Position requirement. Measured in batch 4b: the baseline's harm doubles on the target's own table (the reference Titan 1.14 Critical Injuries and 0.061 deaths against 0.71 and 0.030; the standard Medium 1.09 and 0.073) and four strikers stay ahead (0.84 and 0.029, 76.4% by round 3), so it breaks the target rows without closing the gap.
  - (d) Raise the grounded-titan Bonus Dice from 2 to 3. Measured in batch 4b: the baseline moves to 65.8% by round 3, 0.66, and 0.025, and four strikers stay ahead (78.6%, 0.42, 0.008).
  - (e) Redraw the Behavior Tables so that a control or kill entry reaches a Blind Spot holder (a Thrash from On Body's height, or a fallback that harms), re-running the kill-share constraint, the Jam test, the move-up shares, the lone band, and the Levi-grade figure.
- **Current handling:** (a) (decision batch 4b, 4b-2): no rule or value changes; the kill target is read under the baseline policy (ADR-0014, as amended in batch 4b); Chapter 5 section 5.13 and Chapter 6 section 6.6 report the four-striker row, and `simulator_cases` in both tuning files list it, with three strikers and one cutter, beside every target.
- **Why still open:** The target is met under its stated policy, no rule is broken, and no ruling is needed, so the finding is a balance and fidelity cost rather than a defect in play. The two nearest levers were measured and fail: (c) breaks the target rows without closing the gap, and (d) leaves the gap as it is. (b) changes Chapter 5's Positions and every screen and decoy that flies to Blind Spot, and (e) redraws every table; neither can be measured to hold inside a conformance batch, and each re-runs the kill-share constraint, the Jam test, the lone band, and the Levi-grade figure. The decision waits on the Phase 1 simulator's report of the four-striker row beside every ADR-0014 target, and then chooses between (b), (e), and accepting (a) with the cutters' role restated. The owner's final full review of Chapters 1 to 6 (`docs/reviews/01-06-full-review-1-fable.md`, `docs/reviews/01-06-full-review-1-astra.md`) saw this entry and added nothing to it; decision batch 5 (5-9) keeps it open.
- **Simulator case:** four strikers, three strikers and one cutter, and the baseline on every table, beside each ADR-0014 target (`data/engagement/tuning.yaml` and `data/titans/tuning.yaml`, `simulator_cases`).
- **Status:** Open
- **Revised by batch 7 (7-10):** the owner accepted the canon charter's order of work (ADR-0016), under which the first Phase 2 Titan batch includes an Abnormal that punishes stacking at Blind Spot (the Roller of the gear research) as this entry's candidate answer, beside (b) and (e). The entry stays open; no rule changes.

### OQ-113: Two Squadmates who shout from Distant make the Sprinting Abnormal softer than the standard Medium Titan

- **Type:** Unresolved Major
- **Arose in:** Chapters 5 and 6 decisions conformance review, round 3: `docs/reviews/05-06-decisions-conformance-review-3.md`, finding 1 (Major; figures in *Check 1* and *Check 2*). Chapter 6, section 6.5 (the rendered ladder, with rung 2 `loudest-or-brightest` above `current-holder`; the GM bullets *Then noise* and *Riders*; the design note *Why a blade at its Nape comes before noise*) and section 6.6 *The Sprinting Abnormal* (the *Riders*, *Draw Attention*, and *A loud rider* bullets, and the bar, which has no loud-Squadmate row); `data/titans/tuning.yaml` (`abnormals.rule`, `simulator_cases`, which names "a soldier who takes Draw Attention from Distant every turn"); `data/titans/index.yaml` (`reads_as`). Chapter 5, section 5.6 *Draw Attention* and `data/engagement/attention.yaml` (`draw_attention`, unrolled and with no Position requirement). Chapter 2, `data/character/squadmates.yaml` (`action_list`, `directing`).
- **Continues:** `docs/reviews/05-06-decisions-conformance-review-2-codex.md`, Major 1 (a Distant rider dominates the Sprinting Abnormal with Draw Attention), and decision batch 4b's 4b-1. 4b-1 made hooked-into-its-body the first rung of every ladder, and its *The stance closes* measured a player character who gives up a cutter to shout, and that rider beside two helpers, but no Squadmate who shouts. The Opus round 3 review marks Codex's round 2 Major partly resolved, and this entry is the part left open. `05-06-decisions-conformance-review-3-codex.md` marks the same Major resolved on the player-character form alone and did not run the Squadmate form.
- **Related:** OQ-81, OQ-102, OQ-103, OQ-112.
- **Question:** ADR-0014's reference Squad is four player characters and two Squadmates, a Squadmate may take any Catalog action, and the players direct it. Two Squadmates who stay mounted at Distant and take Draw Attention every turn therefore cost the Squad no soldier. While no one is hooked into the Sprinting Abnormal, their loudest flag outranks its quarry and the nearest soldier from any Position, so they draw 1.83 of its cards a fight away from the cutters at In Reach. What reaches a mounted soldier at Distant: Run Past and Veer deal Stress at Severity 1; Trample deals a leg Critical Injury that cannot be lethal, at Severity 2, dodged with the horse; every other entry falls back to a Thrash whose knock-loose does nothing to a soldier who is neither airborne, On Body, nor at Blind Spot. Draw Attention is unrolled, so the shouting itself risks nothing. ADR-0010's promise still holds (no card resolved on a holder without the hooked-by-strike flag while a hooked striker stood, in any simulated row), and on the standard tables loudest is the fourth rung, below In Reach, so the stance is wasted there. Which rule or bar reading, if any, should close the Squadmate form of the Distant-noise stance?
- **Figures:** `loudsm_r3.py` (the review's appendix; run in its session scratchpad and not committed), the reference Squad plus two loud Squadmates, every twin mounted, 120,000 fights a row from seed 95001:
  - **Cutters first.** 76.5% killed by round 3, 1.74% with no kill within 12 rounds, 0.534 Critical Injuries, 0.0195 deaths, and 0.152 Grabs a fight. The standard Medium twin with the same Squad gives 61.8%, 5.03%, 0.694, and 0.0252; the standard Large twin 61.6%, 12.97%, 1.404, and 0.0564; the Abnormal's helpers row 76.9%, 4.07%, 0.789, and 0.0215. The not-trivial floor (Critical Injuries per fight at least those of the standard Medium Titan's twin) fails by 42.5 standard errors, and deaths sit below the Medium twin's by 8.1 standard errors.
  - **Strikers first.** 76.6%, 1.72%, 0.533, 0.0191, and 0.149, against the Medium twin's 61.8%, 5.03%, 0.695, and 0.0254, the Large twin's 61.4%, 13.14%, 1.417, and 0.0582, and the helpers row's 76.9%, 4.04%, 0.793, and 0.0206. The floor fails by 43.2 standard errors, and deaths sit below the Medium twin's by 8.9.
  - **Against its helpers row** the stance is better for the Squad on every measure but pace: Critical Injuries 0.53 against 0.79, Grabs 0.15 against 0.29, no kill 1.7% against 4.1%, and deaths lower by 2.8 and 2.1 standard errors; pace is 76.5% against 76.9% by round 3.
  - **Read as `abnormals.rule` gives it** (a row with a rider Squadmate has no twin of its own), the row falls against the Medium reference row's 0.70 Critical Injuries and fails the floor all the same.
  - **On the standard tables** (`stance_r3.py`, 60,000 fights a row), the same two Squadmates draw 0.11 (Medium) to 0.17 (Large) cards a fight: the standard Medium Titan gives 61.7%, 4.90%, 0.694, and 0.0246, and the standard Large Titan 61.1%, 13.10%, 1.422, and 0.0572.
  - **What the chapter says instead.** Section 6.6's *Riders* bullet says mounted Squadmates at Distant "neither draw it nor screen it", and section 6.6 says the Abnormal holds every part of its bar in every row.
- **Options:**
  - (a) Loudest is met only away from Distant (Codex round 2's test, now compatible with 4b-1's first rung). Measured (`fixloud_r3.py`, 60,000 fights, patched on every ladder): the loud-Squadmate row gives 70.1% by round 3, 7.6% with no kill, 0.86 Critical Injuries, and 0.065 deaths, the silent-rider row's 0.85 and 0.064; the loud cutter row (69.1%, 1.03, 0.088) and the standard Medium Titan's loud-Squadmate row (0.70, 0.025) do not move. Cost: the bar's loud player-character row becomes a wasted soldier like the parked rider (59.2%, 16.4% with no kill, 1.38, 0.180), past the Large reference's 13.1% and 0.163, so the bar must read it against the standard Medium Titan with the same Squad, as it reads the parked rider, or drop it.
  - (b) Draw Attention needs a Position other than Distant (`attention.yaml` `draw_attention` and the Catalog's `draw-attention` row). The loudest flag behaves as under (a) with no change to the closed `tests` list; the loud-rider rows stop being a legal policy and leave the bar; on the standard ladders nearly nothing moves (loud Squadmates draw 0.11 cards a fight on the Medium Titan).
  - (c) Keep the rules and bind the row: add the loud-Squadmate row to the bar in both Squad sheet orders and to `simulator_cases`, record its failure in OQ-103 as an accepted cost, and rewrite section 6.6's claim that the Abnormal holds every part of its bar in every row, and its *Riders* bullet.
  - (d) Move current-holder above loudest on the Abnormal's ladder. Measured and not recommended by the review (`fixorder_r3.py`): it lifts the loud-Squadmate row to 0.75 Critical Injuries and 0.053 deaths, but fails the winnable limit in the loud-rider row (15.0% with no kill) and in the loud cutter row (13.9%, 1.40, 0.134) against the Large reference's 13.1%.
- **Current handling:** the rules as written after decision batch 4b. No chapter, YAML, probe, or ADR text changed; section 6.6 still says riders neither draw nor screen the Abnormal, and its bar has no loud-Squadmate row.
- **Why still open:** Chapters 5 and 6 have had their last conformance round, and the review must stay an accurate review of the current text, so the finding is logged rather than fixed. No rule breaks and no ADR-0014 target moves: ADR-0010's promise holds, every state resolves, and an Abnormal is held against a reported bar. It is still a significant balance and fidelity problem in an obvious legal play, because two riders on the flank steer the runner off every cutter for the whole fight, against section 6.5's design note of a runner that pays no heed to outer riders. Each fix is the decider's call: (a) changes the loudest test on every ladder and the bar's loud-rider reading, (b) changes a Catalog action's requirement, and (c) accepts a failed floor in OQ-103; (a) and (b) each re-run every Sprinting Abnormal row with Draw Attention.
- **Simulator case:** the reference Squad plus two Squadmates who stay mounted at Distant and take Draw Attention every turn, on the Sprinting Abnormal and every standard table, in both Squad sheet orders, read against the bar's twins; under whichever option is chosen, the loud-rider and loud cutter rows beside it.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** Option (b): Draw Attention needs a Position other than Distant relative to the named Focus Titan (`attention.yaml` `draw_attention`, the Catalog's `draw-attention` row). The closed `tests` list, the ladders, and the bar's limits are unchanged; the loud-rider and loud-Squadmate rows are no longer legal policies and leave section 6.6 and the bar, and the loud cutter row stays; the figures are this entry's option (a) figures (decision batch 5, 5-8).
- **ADR:** ADR-0010 (`## Amended`, batch 5)

### OQ-114: Open Minor findings from the round 3 conformance review of Chapters 5 and 6

- **Type:** Unresolved Minor batch
- **Arose in:** Chapters 5 and 6 decisions conformance review, round 3: `docs/reviews/05-06-decisions-conformance-review-3.md` (Opus, Minors 2 to 6) and `docs/reviews/05-06-decisions-conformance-review-3-codex.md` (Codex, Minor 1); and the Phase 1 simulator's report, `docs/reviews/simulator-report.md`, section 10 (one Minor chapter bug). Neither review found a Critical. The one Major, Opus finding 1, is logged under OQ-113.
- **Related:** OQ-81, OQ-102, OQ-103, OQ-112, OQ-113.
- **Question:** The next decision and fix pass should settle each Minor below. Each line gives the source and finding, the chapter and location, the problem, and a one-line fix. The review files and the simulator report hold the scenarios and any other fix options.
- **Findings:**
  1. `05-06-decisions-conformance-review-3.md`, Minor 2. Chapter 6, section 6.5, the design note *Why a blade at its Nape comes before noise*; also `DECISIONS-2026-09-14.md` 4b-1, *The stance closes*. Both say the loud rider does "worse than the baseline on every measure", but its 7.4% with no kill is better than the reference's 7.6% (about 2.4 standard errors better at 120,000 fights) and its deaths are equal within sampling. **Fix:** read "slower and costlier in Critical Injuries (65.6% by round 3, 0.91), with the same deaths and no more fights with no kill within sampling".
  2. `05-06-decisions-conformance-review-3.md`, Minor 3. Chapter 6, `data/titans/tuning.yaml` (`abnormals.rule`), section 6.5's bar note, section 6.6's bar note *Not trivial* ("by 17 standard errors or more"), `verdicts.sprinting_abnormal`, and `tools/probes/chapter-06/run6.py` (`no_twin`). The no-twin sentence and the same-roles sentence both apply to the loud-rider row, only the probe's code picks the no-twin reading, and against the same-roles standard Medium twin (0.914 Critical Injuries) the row's floor sits 1.87 and 1.15 standard errors below, at the tolerance's edge. **Fix:** make the no-twin sentence read "has no twin of its own, even when it names the player characters' roles".
  3. `05-06-decisions-conformance-review-3.md`, Minor 4. Chapter 6, section 6.6 *Four strikers and no cutters* (the rendered row for Chapter 5's reference Medium Titan, median round 2 and 78.9%, and the note *Medians on the boundary*), and `data/titans/index.yaml` (the comment above `ladders`). Chapter 5 section 5.13 gives the same row median round 3 and 78.6%, and Chapter 6's boundary note does not cover it; the comment still states the ladder format from before 4b-1 ("highest first, ending with nearest"). **Fix:** add "Chapter 5's reference Titan is round 2 here and round 3 in section 5.13's 12,000-fight row" to *Medians on the boundary*, and make the comment read "highest first, beginning with hooked-into-its-body and ending with nearest".
  4. `05-06-decisions-conformance-review-3.md`, Minor 5. Chapter 5, `data/engagement/attention.yaml` (`abnormal_ladder_format.rules`, `evaluation.struck-first`), section 5.6 *Abnormal ladders*, and section 5.7 *Nape strikes*; also ADR-0010's batch 4b paragraph, Chapter 6 section 6.5's first GM bullet, and `data/titans/index.yaml` (`reads_as`). "A Nape striker who falls short draws the Titan's next behavior" reads as a promise to each striker, but when several fall short the ladder's lower rungs, the holder, and the lowest card pick one of them, and the others may strike again before the Titan acts. **Fix:** add "When several strikers fell short, one of them does, as the ladder's lower rungs, the holder, and the lowest card pick" in each place.
  5. `05-06-decisions-conformance-review-3.md`, Minor 6. Chapter 5 (counted there): `CONTEXT.md` Attention (4b-6), against `data/engagement/attention.yaml` (`changes.holder-gone`), `data/engagement/grab.yaml` (`release`), section 5.6's change list, and section 5.9's release. The glossary names only an evaluation that picks no one as the way nothing holds Attention, but the rules also hold nothing from when a holder is gone or a Grab releases until the Titan's next card, which decides who may strike the Nape in between. **Fix:** extend the glossary sentence to "nothing holds it when no rung, its holder, or the cards pick one out, as at the start of a Titan Engagement, and from when its holder is gone or freed until its next card".
  6. `05-06-decisions-conformance-review-3-codex.md`, Minor 1. Chapter 6, section 6.6 *The Sprinting Abnormal*, the last sentence of the *A loud rider* bullet. It cites "section 6.3's table" for the standard Medium Titan's loud-rider figures (49.1% by round 3, 0.90 Critical Injuries, 0.078 deaths), but section 6.3 holds that Titan's stat block and Behavior Table; the row is in section 6.6 *A prepared Squad kills the standard Medium Titan in about 3 rounds*. **Fix:** point to "section 6.6's standard Medium fight table".
  7. `simulator-report.md`, section 10 (Minor). Chapter 5, section 5.13 *A lone soldier after Break Attention* (the design note's table, the Veteran row), `data/engagement/tuning.yaml` (`solo_nape`, `chosen_nape_depth_4` and `alternative_nape_depth_5`, `veteran`), and `data/titans/probe-figures.yaml` (`solo`, every Titan, `veteran`, `stress_0` and `stress_1`). They give the Veteran's fresh cut from Stress 0 and 1 (27.4% and 29.7% at Nape Depth 4), but the Veteran's two Scars set a minimum Stress of 2 (`tuning.yaml`, `builds.veteran.minimum_stress`) and Stress never starts below the minimum, so those starts cannot happen; the Chapter 5 probe's `core.py` started the soldier at the Stress asked for. The bold fight-start cell and every target are unaffected, and Chapter 6's rendered tables print the Veteran from Stress 2 only. **Fix:** mark the Veteran's Stress 0 and 1 cells in both YAML files as below its minimum Stress (or repeat the Stress 2 cell), and start the probe's soldier at no less than the build's minimum Stress.
- **Overlaps:** items 1 and 2 concern the loud player-character row, which OQ-113's options (a) and (b) would re-read or remove from the bar, so they wait on OQ-113; item 2's precedence also decides the twin a loud-Squadmate row reads against under OQ-113's option (c). Item 1 also corrects decision batch 4b's own text. Item 4 touches ADR-0010's batch 4b paragraph and the four-striker stance of OQ-112, which runs on one striker holding Attention at Blind Spot while the others cut. Item 5 is a glossary change following 4b-6. Item 7 changes no figure a target reads.
- **Current handling:** the chapters, YAML, probes, ADRs, `CONTEXT.md`, and decisions file, unchanged.
- **Why still open:** Chapters 5 and 6 have had their last conformance round, and the review files must stay accurate reviews of the current text, so no fix was applied. Items 1, 4, and 5 change the wording of the decisions file, an ADR, or the glossary, which the decision pass settles first. Minors do not block Done under `PROGRESS.md`; every item awaits the next decision and fix pass.
- **Status:** Open

### OQ-115: Simulator target: two Focus Titans, Background Titans, and leaving and returning outside a retreat are not measured

- **Type:** Simulator target
- **Arose in:** Phase 1 simulator review round 1: `docs/reviews/simulator-review-1.md` (Opus, Critical 1 and Major 4) and `docs/reviews/simulator-review-1-codex.md` (Codex, Critical 1 and Major 3). Simulator report: `docs/reviews/simulator-report.md`, sections 4.3, 6.9, 6.10, and 12.
- **Related:** OQ-72, OQ-87, OQ-96, OQ-97, OQ-104.
- **Question:** The simulator's engine (`tools/sim/engine.py`) runs one Focus Titan in each Titan Engagement. It does not model a second Focus Titan in the same fight, Background Titans and their clocks (`data/engagement/engagement-setup.yaml`, `background_titans`), the retreat a Background clock forces, or soldiers leaving and returning outside a retreat. The retreat clock's retreat, and leaving during it, run in every full fight (see the batch 5 line). Four things are left unmeasured:
  - The Jam test inside the full fight for two Focus Titans (`data/engagement/tuning.yaml`, `simulator_cases`, the full-fight Jam item; `data/titans/tuning.yaml`, `targets`, `every_standard_table`, "for one and for two Titans"). Two-Titan cells are measured only in the probes' Jam model.
  - Round-time counters for two Focus Titans (`data/engagement/round.yaml`, `round_time`).
  - The setup mix with its Background Titans (`data/titans/tuning.yaml`, `targets`, `abnormals`, `report`; the `simulator_cases` item on the setup table's rate). The report gives the Focus Titan's fight alone.
  - Background clock lengths against a retreat rate per Titan Engagement (OQ-87).
- **Options:**
  - (a) Extend the engine to deal two Titans' cards in one round, with Attention per Titan, the Background clocks, and the retreat, then re-run the cases listed.
  - (b) Keep the probes' two-Titan Jam model as the measurement for two Titans and report the full fight for one Focus Titan only.
- **Current handling:** (b). The report marks the affected `simulator_cases` items partly measured or not measured, and names this entry beside each affected target and report.
- **Why still open:** The two-Titan round, Background clocks, and the retreat touch Attention, the deal, and the round's end steps together. Until they are built, the two-Titan Jam limit in the full fight, the two-Titan paper-test time, the setup mix's Background Titans, and OQ-87's clock lengths stay unmeasured.
- **Simulator case:** the full-fight Jam test for two Focus Titans of each class pair and a standard Titan with the Abnormal; round-time counters for two Focus Titans; the setup mix with Background Titans and the retreat; OQ-87's clock lengths.
- **Status:** Open
- **Revised by batch 5:** The retreat is now a rule every fight can reach (the retreat clock, decision batch 5, 5-10; OQ-126) and is measured on one Focus Titan in `tools/probes/batch-5/retreat_b5.py`. Two Focus Titans, Background Titans, and the retreat a Background clock forces stay unmeasured, and this entry stays open for them.
- **Revised after the simulator review round 3** (`docs/reviews/simulator-review-3.md`, Minor 4): since the simulator's run with decision batches 5 and 5b, the retreat clock, the retreat, and leaving during it run in every full fight of `tools/sim/` (`docs/reviews/simulator-report.md`, section 6.12). The title and question now name only what is still unmeasured: two Focus Titans in one fight, Background Titans and their clocks with the retreat they force, and leaving and returning outside a retreat, which the report cites this entry for.

### OQ-116: Simulator target: no rule gives the cadence of Titan Engagements, care windows, and the interim issue

- **Type:** Simulator target
- **Arose in:** Phase 1 simulator review round 1: `docs/reviews/simulator-review-1.md` (Opus, Major 3) and `docs/reviews/simulator-review-1-codex.md` (Codex, Critical 1). Simulator report: `docs/reviews/simulator-report.md`, section 6.11.
- **Related:** OQ-59, OQ-93.
- **Question:** `data/engagement/tuning.yaml` (`simulator_cases`) asks for treatment in the care windows between fights, Death Rolls, and the interim issue between sessions. Measuring that over several fights needs to know how many Titan Engagements a session holds and when a day passes outside an Expedition, and no Phase 1 rule says. The reference Rookie also holds no medical kit, since Standard Issue gives one only to the Medic, so its Treat Injury rolls use the attribute alone.
- **Options:**
  - (a) The Expedition rules (Phase 2) set the cadence, and the sequence is re-run then.
  - (b) An interim cadence is written beside the interim issue (`data/gear/standard-issue.yaml`, `interim_issue`).
  - (c) The simulator keeps a stated provisional cadence as a report only.
- **Provisional choice:** (c). The simulator's sequence family (`tools/sim/cases.py`, `SEQUENCE`; `families.py`, `sequence_job`; report section 6.11) rests on these readings, none given by a rule:
  1. A sequence is 2 sessions of 2 Titan Engagements against the standard Medium Titan.
  2. No day passes anywhere in the sequence.
  3. The interim issue comes at the start of each later session, never mid-session.
  4. Every engagement-end step runs after each fight, and every living soldier takes part in the next Titan Engagement, Down or not (`positions.yaml`, `placement`, `who_takes_part`).
  5. A player character who died or retired is replaced by promoting a living Squadmate through the contest (`squadmates.yaml`, `promotion`); the promoting player takes the Squadmate with the fewest untreated Critical Injuries (`policy.promotion_choice`), and the promotion's Lifepath rolls are not made, so the promoted Squadmate gains no Talent levels.
  6. A player with no Squadmate left makes a new character, the reference Rookie, who joins at the start of the next session; a Titan Engagement in which no player character takes part is not played.
  7. A second sequence is reported with every soldier holding a medical kit rated 1, since the reference Rookie holds none.
  8. A new character for a player whose character the interim day killed joins at the start of that session, with the others (report section 6.11).
  The simulator review round 2 (`docs/reviews/simulator-review-2.md`, Minor 11) asked for readings 4 to 6 to be listed here, and round 3 (`docs/reviews/simulator-review-3.md`, Minor 4) for reading 8.
- **Why still open:** The cadence is an Expedition matter. Untreated injuries carried into later fights, deaths across a sequence, and worn gear at a fight's start all depend on it, so the sequence figures are not a target measurement.
- **Simulator case:** the sequence rows, re-run under the cadence the Expedition rules set.
- **Status:** Open
- **Revised by batch 5:** Option (b) is now written for the day: one day passes at the start of each session, before the interim issue, with `each_day` as written and no Stress or Grief change (decision batch 5, 5-2; OQ-120), which settles reading 2 (a day passes between sessions, none within one) and fixes reading 3's timing (the interim issue follows the interim day). Readings 1 and 4 to 7 stay the simulator's: the number of Titan Engagements a session holds, the Down soldier's part in the next fight, the promotion choice and its unmade Lifepath rolls, the new character, and the kit row. The sequence is re-run under the interim day; the entry stays open for those readings and for the Expedition cadence that replaces the interim day.
- **Revised after the simulator review round 3** (`docs/reviews/simulator-review-3.md`, Minor 4): reading 8, which the interim day added, is listed; readings 1 and 4 to 8 stay the simulator's.
- **Revised by batch 7 (7-14):** the Expedition rules now exist as the playtest minimum (Chapter 7, OQ-141), so option (a) is written: readings 1 and 4 to 8 are replaced by the Expedition cadence (two Legs and a night camp a day, about two Titan Engagements per Expedition of 4 to 6 Legs, the day passing at each night camp, no interim issue between days, promotion at a Leg's end, a new character joining at the next Waypoint). The sequence family re-runs under it when the simulator learns Legs; until then the sequence rows keep the interim day as a report and say so.

### OQ-117: Simulator target: the Veteran's two Scars name no Scar rows

- **Type:** Simulator target
- **Arose in:** Phase 1 simulator review round 1, applying the Scar table's rows (`docs/reviews/simulator-review-1.md`, Major 4). Simulator report: `docs/reviews/simulator-report.md`, sections 12 and 14.
- **Related:** OQ-114 (item 7).
- **Question:** `data/engagement/tuning.yaml` (`builds`, `veteran`) gives the Veteran two Scars (Resolve 5, minimum Stress 2) but names no rows of the Scar table (`data/character/scars.yaml`). The simulator applies Scar rows by id, so its Veteran carries the minimum Stress and Resolve and no row's penalty, trigger, or Stress gain. This affects the Veteran cells of the fresh lone cut (`solo_nape`) and any Veteran figure. No ADR-0014 target reads the Veteran.
- **Options:**
  - (a) Name the Veteran's two rows in `builds.veteran`.
  - (b) State that the reference Veteran's Scars carry their minimum Stress and Resolve and no row effects.
- **Provisional choice:** (b), as the simulator's reading.
- **Why still open:** It is a build definition in a tuning file, and the choice of rows changes every Veteran figure.
- **Simulator case:** the fresh lone cut's Veteran cells under the rows chosen.
- **Status:** Open

### OQ-118: Simulator target: the gap to the Opus review 1 model on the prepared-Squad kill is not measured

- **Type:** Simulator target
- **Arose in:** Phase 1 simulator review round 1: `docs/reviews/simulator-review-1.md` (Opus, Major 4). Simulator report: `docs/reviews/simulator-report.md`, section 12.
- **Related:** OQ-78.
- **Question:** `data/engagement/tuning.yaml` (`simulator_cases`) asks for the gap between the Chapter 5 probes and the Opus review 1 model on the prepared-Squad kill (OQ-78). That model's code and assumptions are not committed, so the simulator cannot run it. The report gives the committed probes' figures and the simulator's on the same cases (sections 9 and 10), which affect Target 1.
- **Options:**
  - (a) Commit the review model, or a description of its rules and policies precise enough to rebuild, then measure the gap.
  - (b) Drop the item, since the simulator now re-measures the committed probes' cases on one engine.
- **Current handling:** not measured.
- **Why still open:** Removing a `simulator_cases` item is a tuning-file change for the decision pass, and the model is not available to measure.
- **Simulator case:** the prepared-Squad kill under the Opus review 1 model beside the simulator's reference rows.
- **Status:** Open

### OQ-119: Under a retreat, the order of a soldier's forced move and their action

- **Type:** Rules gap (Critical in the final full review)
- **Arose in:** the owner's final full review of Chapters 1 to 6: `docs/reviews/01-06-full-review-1-astra.md`, C2. Chapter 5 sections 5.3 and 5.10; `data/engagement/round.yaml` (`turn_order`); `data/engagement/background-titans.yaml` (`retreat`, `moves`, `actions`); ADR-0010 (batch 3e paragraph).
- **Related:** OQ-77, OQ-87, OQ-99.
- **Question:** Section 5.3 lets a soldier take the move and the action in either order, and section 5.10's retreat forces only the move, so a soldier at Blind Spot whose card comes before the Titan's can cut the Nape and then make the forced step, which ADR-0010 says the retreat closes by design.
- **Options:**
  - (1) Accept the last cut and rewrite the ADR and section 5.10.
  - (2) Under a retreat the forced move comes before the action, except a stay-with-a-comrade move, whose action comes first.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** (2), decision batch 5, 5-1. Section 5.3 reads "in either order, except under a retreat"; the retreat's effects gain an order row; `round.yaml` `turn_order` and `background-titans.yaml` `retreat` agree with the ADR.
- **ADR:** ADR-0010 (`## Amended`, batch 5)
- **Revised by batch 5 (5-13):** the order has a second exception, decided from the drafter's PROVISIONAL in section 5.10: a move on a turn whose action is Lift Comrade comes after the lift, so a soldier who shares a Down comrade's Position lifts them and carries them out by option 1 or 2 in the same turn. The chapter marker goes (Chapter 5 section 5.10; `background-titans.yaml` `order`; `tuning.yaml` `retreat`).
- **Revised by batch 5b (5-15):** the ordering closes the cut only where every shortest chain to Distant passes through In Reach; at Giant Forest and Urban, beside a Down comrade at Blind Spot, and through Hook and Cut it does not. Decision 5-15 (OQ-129) adds that no Nape strike is made during a retreat, and ADR-0010's batch 5 sentence is superseded by its batch 5b paragraph. The ordering stands.

### OQ-120: A day between sessions until the Expedition and Downtime rules exist

- **Type:** Rules gap (Major in the final full review)
- **Arose in:** the owner's final full review of Chapters 1 to 6: `docs/reviews/01-06-full-review-1-fable.md`, Major 1. Chapter 3 sections 3.1 and 3.6; Chapter 4 section 4.9; `data/harm/healing.yaml` (`day_passes`, `each_day`); `data/gear/standard-issue.yaml` (`interim_issue`).
- **Related:** OQ-59, OQ-93, OQ-116, the owner's Health boxes decision.
- **Question:** No Phase 1 rule ever makes a day pass, so nothing heals, Down from damage never ends without a revive, and a day-limit Death Roll never comes, while the interim issue already stands in for the unwritten Expedition rules at the start of each session.
- **Options:**
  - (1) An interim day: one day passes at the start of each session, before the interim issue.
  - (2) One to three days at the players' choice.
  - (3) Leave it to the Expedition rules.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** (1), decision batch 5, 5-2: `healing.yaml` `day_passes` gains an `interim` row cited by `standard-issue.yaml` `interim_issue`, Chapter 3, and Chapter 4; `each_day` runs as written and Stress and Grief do not change; the Expedition and Downtime rules replace the row. OQ-116's cadence becomes this one.
- **ADR:** none
- **Revised by batch 5b (5-16):** the interim day's care window covers every soldier in the Squad, and Field Repair is allowed in it, as on an Expedition day (OQ-130); `treat-injury.yaml` `care_windows.day.scope` and `field-repair.yaml` `outside_titan_engagement.when` gain the interim day as a third branch.
- **Revised by batch 7 (7-14):** while an Expedition is under way the interim day does not happen; the night camp takes its place, and the Downtime rules (seven days, Chapter 7) follow the gate. The interim day stands for play outside an Expedition.

### OQ-121: Ride is never rolled, and Horsemanship names only Ride

- **Type:** Dead content (Major in both final reviews)
- **Arose in:** the owner's final full review of Chapters 1 to 6: `docs/reviews/01-06-full-review-1-fable.md`, Major 2; `docs/reviews/01-06-full-review-1-astra.md`, M4. Chapter 2 sections 2.7, 2.8, and 2.10; Chapter 4 section 4.5; `data/character/action-catalog.yaml` (`ride`); `data/character/talents.yaml` (`horsemanship`); `data/gear/horses.yaml` (`gear_dice`).
- **Related:** OQ-25, OQ-70, OQ-71.
- **Question:** The Catalog and Chapter 2 say a Chapter 4 or Chapter 5 rule calls the Ride roll, and none does; Horsemanship, the Rider template's Talent and three Lifepath rows' offer, names only Ride, so it is dead in Phase 1.
- **Options:**
  - (1) Mark Ride dormant until the Chase rules and let Horsemanship also name the dodge a mounted soldier makes with the horse's Gear Dice.
  - (2) Add a Ride roll to a mounted step.
  - (3) Mark Horsemanship dormant and repair the Lifepath rows.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** (1), decision batch 5, 5-3: `ride` is dormant, called by the Chase rules; `horsemanship` names `ride` and the mounted dodge; the Rider template, the Lifepath rows, and the Mira example stand; the false "called by a Chapter 4 or Chapter 5 rule" claims are corrected. No reference build holds Horsemanship, so no figure moves.
- **ADR:** none
- **Revised by batch 7 (7-14):** `ride` is called by the Hard Ride Leg roll (Chapter 7), with the horse's Gear Dice, so it is no longer dormant; Horsemanship's `names: [ride, dodge]` stands and both are live.

### OQ-122: Positions after the last Focus Titan dies, read by the engagement-end steps

- **Type:** Rules contradiction (Major in the final full review)
- **Arose in:** the owner's final full review of Chapters 1 to 6: `docs/reviews/01-06-full-review-1-astra.md`, M1. `data/engagement/positions.yaml` (`a_focus_titan_dies`); `data/harm/treat-injury.yaml` (`aftermath_rolls`, `who_rolls`); `data/harm/engagement-end.yaml`; Chapter 5 sections 5.7 and 5.11; Chapter 3 section 3.5.
- **Related:** OQ-57, OQ-88.
- **Question:** Killing the last Focus Titan makes every soldier stop holding a Position relative to it and ends the Titan Engagement, while the aftermath rolls need the Positions held when it ended.
- **Options:**
  - (1) The Position held at the moment a Focus Titan dies is recorded as the last Position relative to it; when no Focus Titan is left, the engagement-end steps read those last Positions, and Chapter 4 clears the records after the last of them.
  - (2) Aftermath rolls need no Position when the fight ended by a kill.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** (1), decision batch 5, 5-4.
- **ADR:** none
- **Revised by batch 8 (8-20):** a corpse keeps its Positions (OQ-146), so the last Positions this entry froze at the death are kept live as Positions relative to the corpse, and the end steps read them as they stand when the Titan Engagement ends, run-on or not; with no Focus Titan alive, comparisons and the aftermath roll are relative to the corpse of the Titan that died last, as "the Focus Titan alive last" already read (OQ-156, OQ-162).

### OQ-123: A fall's reference Titan when two Focus Titans give different heights

- **Type:** Rules gap (Major in the final full review)
- **Arose in:** the owner's final full review of Chapters 1 to 6: `docs/reviews/01-06-full-review-1-astra.md`, M2. `data/gear/falls.yaml` (`height`); `data/engagement/positions.yaml` (`falls_land`, `two_focus_titans`); Chapter 4 section 4.6; Chapter 5 section 5.2.
- **Related:** OQ-64, OQ-96.
- **Question:** A fall's band and landing read the Position held relative to a Titan, and with two Focus Titans a soldier holds two Positions that can give different bands.
- **Options:**
  - (1) The Focus Titan the soldier holds the closest Position to (On Body, Blind Spot, In Reach, Distant); on a tie, the Titan whose card, Grab, or effect caused the fall, else the earliest label.
  - (2) Always the earliest label.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** (1), decision batch 5, 5-5; the band, the Large-class raise, and the landing all read that Titan.
- **ADR:** none

### OQ-124: The Grab's crush resolves before the hold

- **Type:** Rules contradiction (Major in the final full review)
- **Arose in:** the owner's final full review of Chapters 1 to 6: `docs/reviews/01-06-full-review-1-astra.md`, M3. `data/engagement/grab.yaml` (`grab_lands`, `steps`); `data/gear/falls.yaml` (`triggers`); Chapter 5 section 5.9.
- **Related:** OQ-42, OQ-50, OQ-107.
- **Question:** `grab_lands` runs the crush before the hold, so a target the crush makes Down while airborne falls, though the text says they are Down in the Titan's hand; the probes and the simulator resolve the hold first.
- **Options:**
  - (1) Reorder the steps: failed dodge, hold, crush, attention, witnesses.
  - (2) Keep the order and add a no-fall exception to the crush.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** (1), decision batch 5, 5-6: at the hold step the target becomes Grabbed (airborne ends, a mounted target dismounts without a fall, a carried comrade falls); the crush lands on a soldier already in the hand and causes no fall. The Grab figures are unchanged.
- **ADR:** none

### OQ-125: Minor wording findings of the final full review

- **Type:** Minor batch
- **Arose in:** the owner's final full review of Chapters 1 to 6: `docs/reviews/01-06-full-review-1-fable.md`, Minors 2 and 3; `docs/reviews/01-06-full-review-1-astra.md`, m1. Chapter 5 sections 5.2 and 5.4; Chapter 6 sections 6.1, 6.2, and 6.5; `data/engagement/positions.yaml` (`distant`).
- **Related:** OQ-100, OQ-104, OQ-114.
- **Question:** Three wording gaps: the standard Titan's telegraph borrows the Shifter term Intent; Distant is defined as out of the Titan's reach while Run Past and Trample reach it; the Small Titan design note says one success breaks an Intact Body Part.
- **Options:** the wordings in decision batch 5, 5-7.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** 5-7: "what the Titan will do next shows" replaces Intent in Chapters 5 and 6; Distant reads "out of a standing Titan's reach" with a sentence on running Abnormals; the note reads "two successes break an Intact part". No value changes and no glossary entry changes.
- **ADR:** none

### OQ-126: How a Titan Engagement that neither kills the Titan nor loses every soldier ends

- **Type:** Rules gap (Critical in the simulator review round 2)
- **Arose in:** `docs/reviews/simulator-review-2.md`, Critical 1. `data/engagement/engagement-flow.yaml` (`ending`, `left_behind`); `data/engagement/background-titans.yaml` (`retreat`); `data/engagement/engagement-setup.yaml`; `data/engagement/round.yaml` (`end_steps`, `gm_tracker`); Chapter 5 sections 5.1, 5.3, 5.10, 5.11, and 5.13; Chapter 6 section 6.6; both tuning files' "no kill within 12 rounds" columns and limits.
- **Related:** OQ-86, OQ-87, OQ-88, OQ-103, OQ-115.
- **Question:** No rule ended a Titan Engagement that neither killed the Focus Titan nor lost every soldier, so the simulator's 12-round horizon was a model choice whose readings gave different verdicts on the Medium deaths band (0.039 or at least 0.101 against 0.05) and moved the Abnormal helpers ceiling from −4.2 to +1.7 standard errors.
- **Options:**
  - (1) A retreat clock on every Titan Engagement, whose filling starts the retreat already written.
  - (2) A rule that the Squad may disengage, with Down and Grabbed soldiers left behind.
  - (3) Keep a model horizon and log it.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** (1), decision batch 5, 5-10: 8 segments on the interim setup table, filled at the background-clocks end step after the Background clocks and never by a flare; when full the Titan Engagement becomes a retreat, and the retreat's rules and the no-returner ending end it, with soldiers left behind as `left_behind` says; the simulator's horizon goes and "no kill within 12 rounds" reads "no kill". Measured on the committed simulator with the clock (`tools/probes/batch-5/retreat_b5.py`): the Medium deaths band holds at its edge (0.0499 and 0.0482), the Large no-kill band holds (14.4% and 14.6%), the Abnormal's bar holds every limit in both orders, and clocks of 6, 9, 10, and 12 all leave more dead than 8.
- **ADR:** ADR-0014 (`## Amended`, batch 5)
- **Revised by batch 5 (5-19):** "the Medium deaths band holds at its edge" was the during-the-fight reading; the band reads deaths through the end of the Titan Engagement, on which the committed rerun misses it (0.0573; 0.0546 and 0.0552 in the bar's orders), logged as OQ-132. The clock stands at 8.
- **Revised by batch 8 (8-21):** when no-soldier-standing ends the Titan Engagement, with or without a living Focus Titan, every Pinned soldier dies under the body as a `left_behind` death; the others die only while a Focus Titan is alive. The retreat's options 3 and 4 read a Pinned comrade beside a Down or Grabbed one, with Heave and the strike on the pinning Body Part as the staying actions, so a retreat never marches a Squad away from a comrade it could still lift (OQ-157, OQ-162).
- **Revised by batch 8 (8-32):** `always_ends` failed in the run-on retreat: with no Focus Titan alive, a comrade whose Stress Responses cancel every success could stay by option 4 with a limb-pinned soldier on every turn (29 fights of about 1.9 million at the safety cap). While no Focus Titan is alive, the fallen-comrade options now close after as many retreat rounds as the retreat clock has segments, so every standing soldier walks out, a limb-pinned soldier left alone goes Down to corpse heat, and no-soldier-standing ends it (OQ-163).

### OQ-127: Tolerances for the "about" targets of ADR-0014

- **Type:** Target definition (Major in both simulator reviews, round 2)
- **Arose in:** `docs/reviews/simulator-review-2.md`, Major 3; `docs/reviews/simulator-review-2-codex.md`, Major 2. ADR-0014; `data/engagement/tuning.yaml` (`solo_nape`, `grab`, `prepared_squad_kill`, `gas`, the verdicts); `data/titans/tuning.yaml` (`adr_0014_targets_quoted`); `tools/sim/report.py`.
- **Related:** OQ-50, OQ-79, OQ-95.
- **Question:** The Levi-grade "about 50%", the lone Grab's "about 2 in 3", and the Stress 2, Grief 0 cell's "near 1 in 3" carried no tolerance, so the report could neither meet nor miss them while the tuning files called them met.
- **Options:**
  - (1) Decide the bands in the ADR and carry them in the tuning files.
  - (2) Label the figures Logged until a band exists.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*)
- **Decision:** (1), decision batch 5, 5-11: "about" a proportion is five percentage points either side (45% to 55%; 61.7% to 71.7%; 28.3% to 38.3%, beside OQ-50's exact "every cell under 50%"); a stated range or limit is exact; "about" a count reads as the median equal to the stated whole number; a rate reads on the mean within its range; a figure past an edge by at most 2 standard errors is judged on a pooled second seed (4b-4). Every target is Met today (47.2%, 69.9%, 33.2%).
- **ADR:** ADR-0014 (`## Amended`, batch 5)
- **Provisional readings logged after the simulator review round 3** (`docs/reviews/simulator-review-3.md`, Minor 2; open for the decision pass): two readings the simulator applies when it judges a figure (`tools/sim/targets.py`; report section 14) are not given by 5-11's words.
  1. **The pooled figure's margin.** A figure re-run on a second seed is Met only when the pooled figure is strictly inside the band. The bar keeps a margin of 2 standard errors on its pooled figure (4b-4), and 5-11's "as the Abnormal's bar is" fits either reading.
  2. **Runs of one reference start.** A per-table band's reference start runs as Chapter 6's 12,000-fight row and as the bar's two 120,000-fight twin rows, and each run is judged on its own, so a band is Met only when all three are. The 12,000-fight row has 3.2 times the others' standard error and decides most figures near an edge. The Large no-kill row is 1.3 standard errors inside its edge, and the bar's runs 5.6 to 5.8. A fresh 12,000-fight row would land past 15% about 4% of the time and could be Missed on a pooled 15.1% while 240,000 fights say 14.4%.
  - **Options:** (a) keep both readings; (b) keep the bar's 2-standard-error margin on every pooled figure; (c) judge each band on the figure pooled over every run of its reference start, since the sheet order chooses nothing (4-4), with the runs printed beside it.
  - **Provisional choice:** (a). No verdict depends on either reading today: no second seed was due in the committed run.

### OQ-128: Simulator target: three gaps to committed probe figures are not explained

- **Type:** Simulator target
- **Arose in:** Phase 1 simulator review round 2: `docs/reviews/simulator-review-2.md` (Opus, Minor 8). Simulator report: `docs/reviews/simulator-report.md`, section 11.
- **Related:** OQ-103, OQ-115.
- **Question:** Three simulator figures sit more than 3 standard errors from their committed probe figures. `tools/sim/run.py` re-ran each on new seeds at 5 times its trials, and the gap stayed. No model difference between the simulator and the probe is named for any of them:
  - The standard Small Titan's helpers row (4 player characters and 2 helper Squadmates), deaths during the fight: simulator 0.009 against the committed 0.004. The re-check gives 0.006 (+2.3), and the committed probe on new seeds gives 0.007.
  - The bar's Medium twin for the screen beside the holder with Hook and Cut and Hamstring Line and the escapes, cutters first, Critical Injuries: 0.391 against 0.383. The re-check gives 0.390 at 600,000 fights (+3.6). The bar family has no probe re-run.
  - The Flier template's dodge at Severity 3 without Stress Responses: 37.7% against 38.0%. The re-check gives 37.8% at 1,000,000 trials (−4.5). The committed figure states no trial count, so its own sampling error and rounding are left out of z.
- **Options:**
  - (a) Re-run the bar's twin rows on the committed probe, as the report already does for the Chapter 6 full-fight rows, and find and name the model difference behind each gap (for example, Break Attention naming its decoy).
  - (b) Re-measure the Flier dodge with a stated trial count and replace the committed figure.
  - (c) Keep the gaps listed as not explained in the report's section 11.
- **Current handling:** (c). No target, band, or bar verdict moves: the Sprinting Abnormal's Critical Injuries floor against that Medium twin holds by about 21 standard errors, the Small helpers row is in no band, and the Flier dodge is reported beside the targets, not tuned.
- **Why still open:** A persistent 2% gap in Critical Injuries on a bar twin points to a model difference no one has named. If a later bar row lands within 2 standard errors of that twin's floor, a reader cannot tell whether the simulator or the probe gives the right twin.
- **Simulator case:** the three rows above, with the bar twin re-run on the committed probe and the Flier dodge at a stated trial count.
- **Status:** Open
- **Revised by batch 5 (5-19):** the simulator's full rerun with batches 5 and 5b (`docs/reviews/simulator-report.md`, section 11) explains the standard Small Titan's helpers row and the bar twin's Critical Injuries; only the Flier template's dodge at Severity 3 without Stress Responses is still unexplained (37.7%, and 37.8% at 1,000,000 trials on new seeds, against the committed 38.0%, which states no trial count), and the entry stays open for it alone: option (b), re-measure the Flier dodge with a stated trial count and replace the committed figure.

### OQ-129: The retreat's last cut at Giant Forest and Urban

- **Type:** Rules contradiction (Critical in the full review round 2)
- **Arose in:** the full review round 2: `docs/reviews/01-06-full-review-2-fable.md`, Critical 1. Chapter 5 sections 5.6 (the Feint design note), 5.10 (*The retreat*, option 1, the OQ-87 design note), and 5.12 (Hook and Cut); `data/engagement/background-titans.yaml` (`retreat.effects.moves`, `actions`); `data/engagement/anchor-ratings.yaml` (`giant-forest`, `urban`, the distant to blind-spot step); `data/engagement/attention.yaml` (the Feint row); ADR-0010 (the batch 5 paragraph).
- **Related:** OQ-74, OQ-87, OQ-119, OQ-126.
- **Question:** ADR-0010 said the retreat's move-first order gives no last cut because a soldier steps to In Reach before acting, but at Giant Forest and Urban a shortest chain from On Body to Distant may pass through Blind Spot, a step toward a Down comrade at Blind Spot ends there on every rating, and a Hook and Cut on a decoy's card before the striker's lets a striker still at Blind Spot cut before their forced move.
- **Options:**
  - (1) A forced move never ends at Blind Spot, with a clause for option 3.
  - (2) No Nape strike is made during a retreat, on a turn or through Hook and Cut.
  - (3) Amend the ADR to Open, Sparse, and Wooded only and log the exploit.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*, 5-15)
- **Decision:** (2), decision batch 5, 5-15. `background-titans.yaml` `retreat.effects.actions`, the Feint row, and `squad-tactics.yaml` `hook-and-cut` carry it; the forced move's option 1 is unchanged. No figure moves: the simulator's retreat policy makes no Nape strike in a retreat.
- **ADR:** ADR-0010 (`## Amended`, batch 5b)

### OQ-130: The interim day's care window scope and Field Repair

- **Type:** Rules gap (Major in both full reviews, round 2)
- **Arose in:** the full review round 2: `docs/reviews/01-06-full-review-2-fable.md`, Major 1; `docs/reviews/01-06-full-review-2-astra.md`, M1. Chapter 3 sections 3.5 and 3.6; Chapter 4 sections 4.8 and 4.9; `data/harm/treat-injury.yaml` (`care_windows`, `day`, `scope`); `data/harm/healing.yaml` (`day_passes`, `interim`); `data/gear/field-repair.yaml` (`outside_titan_engagement`, `when`).
- **Related:** OQ-59, OQ-66, OQ-116, OQ-120.
- **Question:** The interim day (5-2) runs `each_day`, whose `day` care window has a scope only for an Expedition day and a Downtime day, and Field Repair outside a Titan Engagement has the same two branches, so every session start needed a reading.
- **Options:**
  - (1) Scope: every soldier in the Squad; Field Repair allowed, as on an Expedition day.
  - (2) The same scope; Field Repair forbidden, as on a Downtime day.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*, 5-16)
- **Decision:** (1), decision batch 5, 5-16: the interim day stands in for ADR-0009's night camps and takes the Expedition day's reading on both counts; a third branch in `care_windows.day.scope` and in `outside_titan_engagement.when`, cited by `healing.yaml` `day_passes.interim`.
- **ADR:** none
- **Revised by batch 7 (7-14):** the night camp's day care window has the Expedition day's reading (every soldier on the Expedition; Field Repair allowed), as the interim day does; the interim day's third branch stands for play outside an Expedition.

### OQ-131: Minor findings of the full review round 2

- **Type:** Minor batch
- **Arose in:** the full review round 2: `docs/reviews/01-06-full-review-2-fable.md`, Minors 2 to 4 (Minor 1 is 5-13's queued marker removal); `docs/reviews/01-06-full-review-2-astra.md`, M2 (a render omission). Chapter 2 section 2.8; Chapter 3 section 3.17; Chapter 4 section 4.11; Chapter 5 sections 5.1 and 5.11; `data/gear/carrying.yaml` (`leaving_play`, `death`, `shared_out`); `data/engagement/engagement-setup.yaml` (`steps`, `background-titans`).
- **Related:** OQ-68, OQ-87, OQ-88, OQ-121.
- **Question:** The Oskar example heals at "the next night camp"; a soldier left behind has their items shared out to comrades who fled; section 2.8's Dormant rolls list omits Ride; Chapter 5 section 5.1 omits the per-Background-Titan Size Class roll the YAML gives.
- **Options:** the wordings and the rule in decision batch 5, 5-17 and 5-18.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 5*, 5-17 and 5-18)
- **Decision:** 5-18: the example reads "when the next day passes"; the left items of a soldier who dies left behind leave play; `ride` joins the Dormant rolls list. 5-17: no rule decision, Chapter 5 step 3 renders the Size Class roll for each Background Titan in clock order, with no Abnormal roll.
- **ADR:** none

### OQ-132: Simulator target: the Medium deaths band is missed through the end of the Titan Engagement

- **Type:** Simulator target
- **Arose in:** the simulator's full rerun with decision batches 5 and 5b: `docs/reviews/simulator-report.md` (the Summary's missed results; the Medium band; the bar's twin rows). Decision batch 5, 5-10, 5-14, and 5-19; ADR-0014 as amended in batch 5c; `data/titans/tuning.yaml` (`targets`, `medium`, `deaths_per_fight`); Chapter 5 section 5.13; Chapter 6 section 6.6.
- **Related:** OQ-78, OQ-87, OQ-103, OQ-115, OQ-126, OQ-127.
- **Question:** Chapter 6's Medium band, at most 0.05 deaths per fight at the reference start, reads deaths through the end of the Titan Engagement (5-19). Under the retreat clock (5-10) the committed rerun gives 0.0573 (standard error 0.0030, 2.4 past the limit, beyond the second-seed rule) at the reference start and 0.0546 and 0.0552 (standard error 0.0009) in the bar's two sheet orders, against 0.037 before the clock. During the fight the same rows give 0.050, 0.0485, and 0.0493, the band's edge. The extra deaths are the Down soldiers a retreat leaves behind (about 0.020 a fight) and the end steps' Death Rolls on the survivors' untreated injuries (about 0.007). The clock's length is not the lever: 6, 9, 10, and 12 all leave more dead than 8 (`tools/probes/batch-5/retreat_b5_explore.out`). Every other target and band is Met, and the Abnormal's bar holds on the same reading.
- **Options:**
  - (a) Re-set the band to at most 0.06 through the end, with the reason that the retreat's cost is the design's (1 death in 17 standard fights, 1 in 20 at the last card), and keep the 0.05 during-the-fight figure as a report.
  - (b) Model the retreat's rescues the rules already give and the reference Squad does not use. First, Treat Injury on a Down comrade during the retreat, before the lift (a revived comrade walks out). Second, Treat Injury by soldiers who have left, on each other and on a comrade one of them carried out (`data/engagement/positions.yaml`, `leaving`, `after_leaving`), during the rest of the fight and so before the aftermath rolls and end Death Rolls. If the reference policy with them meets 0.05, the baseline policy (`data/engagement/tuning.yaml`, `prepared_squad_kill`) names them. The aftermath roll and the care window are not levers: the simulator already runs both after every fight, and the care window comes after the end Death Rolls (`data/harm/engagement-end.yaml`).
  - (c) A rule lever on the retreat: a Down comrade at Distant when the Squad leaves is carried out by the leaving soldiers without a Lift Comrade action, or a horse carries a Down comrade; measured against the Abnormal's bar and the Large row.
  - (d) A value lever: the standard Medium Titan's control Severity or the Grab's, measured against every Medium band and the Small and Large rows.
- **Current handling:** Missed and logged. No value, rule, or band changes; the tuning files name the reading and the miss beside the band, and the report renders it Missed (OQ-132).
- **Why still open:** The miss is the cost of the retreat clock, a rule the design needs (5-10), and each lever touches a measured row: (a) moves a stated target, which ADR-0014 allows only with a reason that survives it; (b) is a policy the simulator must build; (c) and (d) change rules or values after the last conformance round. The decision belongs after the simulator round 3 review, on the full rows.
- **Simulator case:** the Medium reference row and the bar's twin rows under (b), with Treat Injury during the retreat and by soldiers who have left in the baseline policy, beside (c) and (d), deaths through the end and during the fight both reported.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 7*, 7-13; decided anew in *Batch 8*, 8-31)
- **Decision:** Option (a), provisionally: the band reads "at most 0.06 deaths per fight through the end of the Titan Engagement", with deaths during the fight reported beside it, because the retreat's cost is the design's and the owner has since chosen fights that are each lethal on their own (item 7 of the round 1 feedback); the committed 0.0573, 0.0546, and 0.0552 read Met against it. Options (b) to (d) are not taken before the playtest. The band is re-set again, with every deaths band and bar limit, when OQ-140 retunes the Titans on playtest data.
- **ADR:** ADR-0014 (`## Amended`, batch 7; batch 8, 8-31)
- **Revised after the simulator review round 3** (`docs/reviews/simulator-review-3.md`, Major 1 and Minors 3 and 4; `docs/reviews/simulator-review-3-codex.md`, Major 1):
  - **Option (b).** It named the care window, which already runs and comes too late. It now names the two rescues no row measures.
  - **Soldiers who have left.** They take no action in the simulator, a policy choice stated in the report's section 14, so a case under (b) must add that policy.
  - **The order guard.** The retreat order guard now checks what follows an action taken first. That action must be one of option 4's actions, and the only move after it is the stay with the comrade it was taken for. A lift must be followed by the move out. A policy that treats a comrade and then walks on now raises, instead of reporting a rescue the order forbids.
  - **The miss in the files.** The tuning files name the band's reading (5-19), and `data/titans/tuning.yaml`'s Medium verdict reads Missed. The report's missed-result map and OQ-128's gap list are synchronized with this register, and the rerun renders the three Medium deaths rows Missed (OQ-132).
- **Decided anew by batch 8 (8-31), after the full rerun:** the band reads "at most 0.08 deaths per fight through the end of the Titan Engagement", with deaths during the fight reported beside it, recorded as the owner's chosen lethality for the first playtest (`OWNER-DECISIONS.md`, *After the full rerun*). The rerun under the round 1 package read 0.0754 (standard error 0.0034) at the reference start and 0.0687 and 0.0693 (standard error 0.0010) in the bar's two orders, Missed against 0.06 and Met against 0.08; during the fight, 0.0663, 0.0606, and 0.0614. No option (b) to (d) and no lever of 8-14 is taken. The first-Titan-Engagement row (0.073 to 0.095 through the end) is a sensitivity row no target reads. OQ-140 still re-sets the band after the playtest.

### OQ-133: Simulator target: eye strikes at the Small and Large Size Classes and arm Toughness are not measured

- **Type:** Simulator target
- **Arose in:** Phase 1 simulator review round 3: `docs/reviews/simulator-review-3.md` (Opus, Minor 5) and `docs/reviews/simulator-review-3-codex.md` (Codex, Major 2). Simulator report: `docs/reviews/simulator-report.md`, section 12 (`data/engagement/tuning.yaml`, `simulator_cases`, item 10).
- **Related:** OQ-78, OQ-103, OQ-118.
- **Question:** `data/engagement/tuning.yaml` (`simulator_cases`, item 10) asks for eyes and arm Toughness for every Size Class, with Large against the PC Critical Injury and PC death targets, and Medium at Tempo 2 and the other rejected alternatives as sensitivity rows (OQ-78). The simulator measures three parts: eye strikes on every table whose entries use eyes (only the standard Medium Titan's), each table at its own arm Toughness, and Chapter 5's Size Class and rejected-alternative rows. Two parts are not measured:
  - eye strikes on Chapter 5's reference Titan at the Small and Large Size Classes;
  - any change to arm Toughness, at any Size Class.
  The PC Critical Injury and PC death targets are Expedition targets (Phase 2), so the Large figures are read per Titan Engagement.
- **Options:**
  - (a) Add an eye-strike row on the reference Titan at the Small and Large Size Classes, and a row with each Size Class's arm Toughness one above and one below its value, reported beside the targets and bands.
  - (b) Keep the item partly measured: no standard Small or Large table uses eyes, and no decision has proposed an arm Toughness change.
- **Current handling:** (b). The report marks the item Partly measured and names this entry beside it.
- **Why still open:** A later balance pass that changes an arm Toughness or an eye-strike policy has no measurement to stand on. The Large no-kill band (14.6% against at most 15%) is close enough to its edge that an arm Toughness change could decide it.
- **Simulator case:** eye strikes on Chapter 5's reference Titan at Small and Large; arm Toughness at each Size Class's value plus and minus 1, on each standard table and the reference Titan, beside the Large no-kill band and the Medium bands.
- **Status:** Open

### OQ-134: Does a retreat stop the Regeneration clock?

- **Type:** Rules gap (packet review 3, Source note 2)
- **Arose in:** the playtest packet round 3 review: `docs/reviews/playtest-packet-review-3.md`, Source note 2. `data/engagement/background-titans.yaml` (`ticks`, `stopped`; `retreat`, `effects`, `no-entries`); `data/engagement/titan-harm.yaml` (`regeneration`, `tick`); `data/engagement/round.yaml` (`end_steps`); Chapter 5 sections 5.3, 5.7, and 5.10; decision batch 5, 5-10.
- **Related:** OQ-82, OQ-87, OQ-126.
- **Question:** "No clock fills during a retreat, the retreat clock included" could be read narrowly (the Background Titans' clocks and the retreat clock, where the sentence sits) or widely (every clock, Regeneration included), and the two readings differ at the table on whether a Broken leg heals mid-retreat, which moves Positions and Grabs while soldiers are leaving.
- **Options:**
  - (a) Narrow: the Background Titans' clocks and the retreat clock stop; the Regeneration clock fills as always.
  - (b) Wide: every clock stops, the Regeneration clock included.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 6*)
- **Decision:** (a), decision batch 6, 6-1: the three YAML keys and the three Chapter 5 passages name the clocks that stop and say the Regeneration clock still fills; the simulator already measured every row that way, so no figure moves.
- **ADR:** none

### OQ-135: Character creation without the Lifepath

- **Type:** Rules gap (owner feedback, playtest packet round 1)
- **Arose in:** `docs/playtest/feedback/round-1/OWNER-DECISIONS.md` item 1 and `character-creation-and-talents.md` note 1. Chapter 2 sections 2.1, 2.3, 2.3.5, 2.4, and 2.10; `data/character/lifepath.yaml`, `attributes.yaml`, `class-rank.yaml`, `squadmates.yaml`; ADR-0014's reference builds.
- **Related:** OQ-19, OQ-20, OQ-21, OQ-29, OQ-31, OQ-58.
- **Question:** The owner wants a way to create a soldier by choosing what they get, beside the rolled Lifepath, and asked for both a template build and a freer build, with the GM allowing either per campaign. The reviews of OQ-19 measured that choosing rows or spending a raw budget with a cap of 5 puts a key attribute of 5 or 6 on nearly every soldier, against 36.6% rolled, so a built soldier must sit inside the Lifepath's envelope (18 points, key attribute at least 4, the rest averaging about 2.7, 5 Talent levels with none above 2) or ADR-0014's one creation distribution is gone.
- **Options:**
  - (a) Template Build only: the Specialty's Squadmate template array, a chosen Origin, Drive, and Talents.
  - (b) Template Build and a Free Build with a cap of 4 on every attribute, the key attribute at 4, and at most two attributes at 4 (the arrays 4, 3, 3, 3, 3, 2 and 4, 4, 3, 3, 2, 2).
  - (c) A Free Build with a cap of 5, or a Specialist array (5, 3, 3, 3, 2, 2).
  - (d) Roll then swap one row.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 7*, 7-1)
- **Decision:** (b). The Lifepath is always available; the GM decides at session zero whether the campaign also allows the Template Build, the Free Build, or both, once for the campaign and for every soldier created in it, replacements included. Both builds: no Merit, Class Rank none, no Top 10, no Exam, Rank Private; a chosen Origin row (Haven, optional Canon Tie, one of its two Talents), a chosen Drive from any row, 5 Talent levels (one Origin, one from the Specialty's list, three from any Talent), at most one Talent at level 2, rule Talents at level 1. Rolling stays the only way to a 5, a 6, or a Top 10. (c) puts the population at the Veteran end of ADR-0014's builds; (d) re-opens OQ-19's measurements for a small gain. The Template Build is ADR-0014's template Squad, already reported; the Free Build Squad is a new reported row.
- **ADR:** ADR-0014 (`## Amended`, batch 7)
- **Simulator case:** a Squad of four Free Build soldiers (the second-4 array, Talent 2 on the roll each target measures) beside the Talent-dependent targets, reported and not tuned.
- **Revised by batch 8 (8-3, 8-13):** the second-4 array may put its 2s on Strength and Agility, so a Free Build's Health is 2 to 4, not 4 or 3; the chapter calls Health 2 fragile with its measured cost, and a second reported row (that array with Strength 2 and Agility 2, Health 2) sits beside the Health-dependent targets. The reported Squad's second 4 is on Agility with the 2s on Wits and Empathy, and Talent 2 sits only on each soldier's own measured roll.

### OQ-136: The full Talent list

- **Type:** Rules gap (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md` items 2 and 2b and `character-creation-and-talents.md` notes 2 and 3. Chapter 2 sections 2.6, 2.7, and Appendix 2A; `data/character/talents.yaml`, `specialties.yaml`, `action-catalog.yaml`.
- **Related:** OQ-28, OQ-33, OQ-121, OQ-135, OQ-141, OQ-142, OQ-143, OQ-144.
- **Question:** 40 Talents, 32 live, with Hunter holding two live Talents on a list of four, read as sparse next to Coriolis: The Great Dark's 83. The owner wants the full list shipped for the playtest, past the research's 60, with non-canon Talents under guardrails. What size and shape, and what keeps the additions safe for ADR-0014?
- **Options:**
  - (a) Hold at 40.
  - (b) Six per Specialty and a general list of six to eight, about 60.
  - (c) Eight per Specialty and a general list of twelve, about 84, all live, with the dormant entries made live by the playtest rules chapter.
  - (d) (c) plus a level-3 capstone effect on each Specialty's signature dice Talent.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 7*, 7-2 and 7-3)
- **Decision:** (c). Between 80 and 90 Talents: nine Specialty lists of eight (shareable; at most four Talents shared between two lists), each with at least three dice Talents, one of them conditional, at least three rule Talents, and at least two Talents that name a Leg, camp, Requisition, or Skirmish roll or trigger; a general list of twelve about temperament and survival, at most four of them dice Talents. Every Talent names live entries; the dormant tag goes. The guardrails are ADR-0016's Talent section, and a Talent that names only a Leg, camp, Requisition, or Skirmish roll carries no dice in any ADR-0014 baseline. Capstones (d) are OQ-144, after the playtest. XP stays Phase 2: at the playtest Talents come from creation only.
- **ADR:** ADR-0016 (new); ADR-0014 (`## Amended`, batch 7)
- **Simulator case:** a sensitivity row for every new Talent that names a measured entry or a fixed roll, where the engine can express it without new code; the rerun lists the rest as unmeasured, and the packet marks them as playtest rules.
- **Revised by batch 8 (8-26):** no Heave Talent joins either list. Grip Breaker names `heave` beside `break-free` ("Tearing free of a grip, even a Titan's, and heaving its body off a comrade."), the lists keep their counts, and a sensitivity row on the pin rows reports it (OQ-162).
- **Revised by batch 8 (8-42):** under guardrail 8's default, Quick Refit and Rescue Ride are once per Titan Engagement and Stay With the Column is once per Leg. Sure Hands keeps no limit, with a design note (OQ-166).

### OQ-137: Critical Injuries step 1: sides, Injury Type, the Bite rider, and lost limbs

- **Type:** Rules change (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md` items 3 and 4 and `critical-injuries.md`. Chapter 3 sections 3.1, 3.2, 3.7, 3.17, and the example; Chapter 4 section 4.6; Chapter 5 section 5.9; Chapter 6 every harming entry; `data/harm/critical-injuries.yaml`, `health.yaml`, `sheet-fields.yaml`; `data/engagement/titan-format.yaml`, `grab.yaml`; `data/gear/falls.yaml`; `data/titans/*.yaml`; `tools/render/render.py`; `tools/probes/chapter-06/render.py`; `tools/sim/dice.py` (`gain_ci`).
- **Related:** OQ-41, OQ-42, OQ-132, OQ-138, OQ-143.
- **Question:** The owner wants body-part injuries with left and right, a damage-type feel, and a unique feel per cause, with no mental Critical Injuries and lost limbs graded rather than banned. How much of that ships before the playtest without moving the tuned rows?
- **Options:**
  - (a) Sides and per-type names only.
  - (b) (a) plus the Bite rider, graded lost-limb riders, Injury Type on every harming effect and on damage, Crush for every non-Bite Titan source, Cut and Pierce through the Skirmish rules, Burn named on the rows with no source.
  - (c) (b) plus Burn sources (steam, corpse pinning, fire) and Cut, Pierce, and Burn riders now.
  - (d) Full per-type tables.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 7*, 7-4 to 7-6)
- **Decision:** (b), as ADR-0017 records. The location die is 1 left arm, 2 right arm, 3 left leg, 4 right leg, 5 torso, 6 head; a rule that names arm or leg without a side rolls D6, odd left and even right. Worsening counts by location and side. Each row keeps its id and tuned fields and gains `names` keyed by type. The Bite rider sets the arm and leg 12 and 13+ rows to a turn limit. Lost limbs: one arm keeps the 2-die penalty on the strikes, Break Free, Treat Injury, and Field Repair and adds a 1-die penalty on Fly, Fight, and Block; both arms forbid every entry that requires ODM Gear, a Blade Set, a firearm, or handling an item or comrade; one leg keeps the 2-die penalty on Fly, Ride, and the dodge and makes every move on foot spend the action as well; both legs forbid Fly, Ride, ODM moves, on-foot moves, and Lift Comrade, and the soldier travels across a comrade's saddle or in the wagon. A soldier who has lost both arms or both legs may retire at the player's choice when the procedure ends, as at five Scars. No mental rows. (c) is OQ-138.
- **ADR:** ADR-0017 (new); ADR-0003 item 11, ADR-0005, ADR-0015 (`## Amended`, batch 7)
- **Simulator case:** `gain_ci` counts worsening by side and applies the Bite rider; the Medium band, the Grab cells, the first-Titan-Engagement row, and the Abnormal's bar are re-measured as a check.
- **Revised by batch 8 (8-8, 8-10, 8-11):** the Burn rider ships and the Burn names print in the packet (OQ-138); the 13+ rows' permanent penalties stack per side, so two lost legs dodge at 4 dice; a Prosthetic lowers the lost-limb grade one step (OQ-147); both arms lost may Shed Load, use the horse decoy, and mount with a comrade's help, but not throw a cloak or take ODM Gear Dice on the dodge; a soldier the both-legs grade forbids to move may be carried by Lift Comrade; medical Retirement is open to Squadmates and re-offered at the end of every Downtime.
- **Revised by batch 8 (8-18):** 8-11's "or Pinned" is struck. Lift Comrade's widened row names only a soldier the both-legs grade forbids to move; a Pinned soldier is never lifted or carried until freed (OQ-146, OQ-151).
- **Revised by batch 8 (8-23, 8-25):** both arms lost: Leap Clear takes no ODM Gear Dice (the horse's while mounted) and Heave is forbidden; the lost-arm row's permanent penalty list gains `heave`. Both legs lost: Leap Clear is allowed, and the lost-leg row's permanent penalty list gains `leap-clear`, stacking per side. Mount or Dismount with both arms lost outside a Titan Engagement: in a Skirmish a comrade taking part who is not Down spends their action; elsewhere a comrade on the same Expedition, or in the Squad when none is under way, who is not Down helps, spending nothing (OQ-159, OQ-161, OQ-162).

### OQ-138: Critical Injuries step 2: Burn sources and the type riders

- **Type:** Rules gap (owner feedback, playtest packet round 1)
- **Arose in:** `critical-injuries.md`, recommendation step 2; decision batch 7, 7-7; reopened by the owner (`OWNER-DECISIONS.md`, *Titan attack resolution*, the Burn paragraph).
- **Related:** OQ-137, OQ-132, OQ-140, OQ-146, OQ-149.
- **Question:** Burn has names on every row and no source. The owner's images (Titan steam at a Nape cut, a soldier pinned under a corpse, fire) need source rules in Chapters 4 and 5, and the Cut, Pierce, and Burn riders (bleeding on a turn limit, a Death Roll penalty, doubled healing, a medical kit requirement, a Scar) need measuring against the Critical Injuries band before they ship.
- **Options:**
  - (a) Steam as damage at the Nape kill step for soldiers On Body or at Blind Spot (a D6 table like falls), Pinned under a dead Titan as the Burn Critical Injury source with Lift Comrade or a Body Part strike as the escapes, Fire as a Chapter 4 hazard stub, and the riders per type.
  - (b) Steam as a Stress or Gas cost only.
  - (c) A Burn Critical Injury at every Nape kill.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-7 and 8-8)
- **Decision:** (a), before the first playtest, at the owner's word ("steam and corpse heat must come right now"), which reverses 7-7. Steam is damage on a D6 table (1 to 3 nothing, 4 or 5 1, 6 2), Burn, location rolled, at the kill for every soldier On Body or at Blind Spot and at a Regeneration fill that recovers a Body Part for every soldier On Body. Corpse heat is a Burn Critical Injury at the start of each turn a soldier lies Pinned under a dead Titan (OQ-146 gives the pin), and 1 Burn damage to each Heave against a corpse. Fire ships in the Skirmish as a Bandit's firebrand (Fight, Burn 1) and a flare fired at a person (Shoot, Burn 1, 1 flare); burning terrain is OQ-149. The Burn rider on every table: healing doubled, lethal rows on a day limit, Treat Injury only with a medical kit or medical supplies; no Stress or Scar; Cut and Pierce carry no rider. The packet prints the Burn names.
- **ADR:** ADR-0017 (`## Amended`, batch 8); ADR-0005 (`## Amended`, batch 8)
- **Simulator case:** the Medium and Small Critical Injuries bands with steam on and a "without steam" row beside each (expected up by less than 0.05 on the Medium); deaths from corpse heat in the pin rows (OQ-146); the sequence cases' day Death Rolls under the Burn rider. The first lever if a band misses is the Regeneration steam trigger, then the steam table, then the falling Titan's path (8-14).
- **Revised by batch 8 (8-15):** "Cut and Pierce carry no rider" is withdrawn at the owner's word. Both carry riders in the Bite rider's shape: a Cut's lethal `engagement` rows read `turn`, and a Pierce from the 7 row up takes a 1-die penalty on Treat Injury and does not heal while untreated (OQ-150). The Burn rider is unchanged.
- **Revised by batch 8 (8-24):** the Burn rider's "one unit of medical supplies" is the care-bonus spend, made in a care window; in a Titan Engagement or a Skirmish only a medical kit that counts as had meets it, and the aftermath roll never reaches a Burn, since its lethal rows carry a `day` limit (OQ-160, OQ-162).

### OQ-139: The Fear Roll table re-cut and the Stress Response names

- **Type:** Rules change (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md` item 5 and `stress-and-fear.md`. Chapter 3 sections 3.9 to 3.12; `data/mind/fear-rolls.yaml`, `stress-responses.yaml`; `data/harm/effect-types.yaml` (`never_used`); `data/core/stress-changes.yaml`; `data/engagement/attention.yaml`, `positions.yaml`; Chapter 4 sections 4.3 and 4.4; `tools/sim/rules.py`, `engine.py`.
- **Related:** OQ-04, OQ-18, OQ-47, OQ-50, OQ-95, OQ-97, OQ-113.
- **Question:** Both tables read as a penalty menu next to Alien RPG Evolved's Panic table. The owner allows results that touch gear and that force actions or moves. OQ-50 (b) refused contagion by rolls for table load, and the Fear rows carry ADR-0014's Grab target through the six-cell test. How far does the re-cut go?
- **Options:**
  - (a) Rename and describe only.
  - (b) Re-cut the Fear table on AoT rows that hold today's action-and-turn profile per total, with new effect types (the loudest flag, Stress to comrades within one step, a forced move, a forced strike from total 7, a dropped Blade Set, a Gas Roll), and rename and describe the Stress Response table.
  - (c) A full Alien-style ladder with Scream cascades.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 7*, 7-8 and 7-9)
- **Decision:** (b). Placement rules bind the drafter: totals 1 and 2 cost Stress, a next-roll penalty, or a Gas Roll and no action; 3 and 4 spend the next action; 5 and 6 spend the next turn; 7 and up spend the turn and give a Scar; a forced strike only at 7 or more; a gear effect that costs an action to undo only on a row that already spends the action or turn; no row forces another Fear Roll; no row helps; at most one tracker write per row; no GM choice. Contagion is Stress, not rolls, on the top row. The six-cell test stays ADR-0014's target and is a check the rerun confirms; a cell that misses goes back to the decider, not to the profile. The Stress Response table keeps every effect and gains fiction-first names and a `text` line.
- **ADR:** ADR-0010 (`## Amended`, batch 7); ADR-0014 (`## Amended`, batch 7)
- **Simulator case:** the six Grab cells, the first-Titan-Engagement row, the Abnormal's bar, and the Medium band under the new rows; the OQ-04 Stress trajectory with contagion, as a report.
- **Revised by batch 8 (8-1, 8-13):** the six-cell check is unchanged under Attack Dice, since the cells depend on the crush and the rescue and not on how the Grab landed (research Table 3, no rider). Confirmed for the drafter: a forced move happens at the start of the soldier's next turn even when that turn is spent in advance, and a dropped Blade Set is left at the Position until the end, when it is shared out as left items are. The Unguarded row and the other no-Reactions rows now read: the card lands on 1 or more Titan successes, and a whiff spares the soldier.
- **Revised by batch 8 (8-16):** a forced strike the soldier cannot legally make never lapses: it waits while they are Grabbed, Down, or Pinned (a limb-pinned soldier's strike on the pinning limb of the event's Titan counts), allows Swap Blade Set and no other action, and ends as the row says. The event's Titan for a result no card or Grab caused is the nearest by the fall rule's order, confirmed. "Hesitate included" in Chapter 5 section 5.13 and `data/engagement/tuning.yaml` stays until WP-S2's verdict pass rewords it as "every row of the re-cut table" (OQ-151).
- **Revised by batch 8 (8-40):** every total for one event's Fear Rolls is found from the Stress and Resolve each soldier had when the event resolved, then every result applies, Drive decisions first. Contagion counts on the next event, and the order still changes nothing (OQ-166).

### OQ-140: Simulator target: retune the Titans so the default Squad loses a PC about every 8 typical rolled fights

- **Type:** Simulator target (owner feedback, playtest packet round 1; after the first playtest)
- **Arose in:** `OWNER-DECISIONS.md` item 7 (B) and `squadmates-and-lethality.md`; decision batch 7, 7-12. ADR-0014's targets; Chapter 5 section 5.13; Chapter 6 section 6.6; both tuning files.
- **Related:** OQ-78, OQ-112, OQ-132, OQ-138, OQ-116.
- **Question:** The owner wants each fight lethal on its own: after the first playtest, the Titans are retuned so that the default Squad (4 PCs and 2 Squadmates) loses a PC about every 8 typical rolled fights, about 0.125 PC deaths a fight on the interim setup mix, against today's 0.018 on the standard Medium Titan with two helpers and 0.136 for four Rookies alone across the mix. Which levers, and what happens to every band and bar limit?
- **Options:**
  - (a) Kill-entry Severity up one step on the Medium and Large tables (the Medium at 2, 3, 3 gives 0.069 for four Rookies alone).
  - (b) Nape Depth 5 on the Medium (0.124 alone) or Regeneration 2.
  - (c) Tempo 2 on the Medium (0.406 alone; too far).
  - (d) The Critical Injury rows: the arm and leg 11 and 12 rows to turn limits (OQ-42's first lever), or worsening at +3.
  - (e) The Expedition hazard table hotter (Titan rows from 5, the Straggler at 7) and the In Reach starts, which the fights alone do not count.
  - (f) A combination, measured across the setup mix with two Squadmates, re-setting every deaths band and bar limit to the new rate.
- **Current handling:** no retune before the playtest. The first playtest runs 4 PCs with no Squadmates on today's tuning, where a PC dies about every 7 typical rolled fights, which is the owner's rate today. The Medium band stands at 0.06 through the end (OQ-132).
- **Why still open:** every lever moves every band, the Abnormal's bar, the Jam test, and the lone and Levi-grade figures, and the owner wants the playtest count of fights, Critical Injuries, and deaths per Expedition first. The typical rolled fight must be defined for the target (the interim setup mix, or a Mission Brief mix) before a lever is chosen.
- **Simulator case:** the setup mix with 4 Rookies and 2 helper Squadmates, deaths per fight through the end, under each lever and the chosen combination, beside every existing band and the bar.
- **Status:** Open
- **Revised by batch 8 (8-1, 8-14):** option (a)'s lever is now Attack Dice, a smooth knob (each Titan die adds about a sixth of a success against a Rookie who cancels about 1.8), but the research measured that no rolled shape at any Health reaches this target by dice alone (about 36 kill dice on sixes, or a pool no one rolls), so the retune uses (b), (d), (e), or (f) with Attack Dice as a fine adjustment only. Steam, corpse heat, and the falling Titan (OQ-138, OQ-146) add deaths outside the attack roll and are counted in the playtest's per-Expedition tally before this is decided.
- **Revised by batch 8 (8-31):** in the current handling the Medium band stands at 0.08 through the end, not 0.06, since the owner accepted the rerun's 0.075 as the playtest's lethality (OQ-132). This target is unchanged and still aims above it.

### OQ-141: Expeditions and Downtime, the playtest minimum

- **Type:** Rules gap (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md` (minimal rules, answers 5, 7, and 8) and `minimal-rules-expeditions-requisition-combat.md` sections 1 and 6. New Chapter 7 and `data/expedition/`, `data/campaign/downtime.yaml`; Chapter 3 sections 3.5, 3.6; Chapter 4 sections 4.9, 4.10; Chapter 5 section 5.1; `data/core/stress-changes.yaml`; `data/gear/squad-supply.yaml`; `data/harm/healing.yaml`, `treat-injury.yaml`; `data/character/action-catalog.yaml`.
- **Related:** OQ-36, OQ-44, OQ-52, OQ-53, OQ-67, OQ-116, OQ-120, OQ-121, OQ-130, OQ-137, OQ-140.
- **Question:** Nine Talents name rolls no rule calls, and no rule makes a day pass on an Expedition or gives the fight cadence. The owner chose minimal rules, and the proposal left fifteen items to the decider.
- **Options:** the proposal's section 1 as written, with the decider's choices on the Hard Ride entry, the Formation Post modifiers, the Signal Relay flare, rations and hunger, the interim route's Distance Bands, the Straggler's pick and Injury Type, and the Downtime amounts.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 7*, 7-14 and 7-15)
- **Decision:** The proposal's section 1, with: the Hard Ride Leg roll is Ride with the horse's Gear Dice; the Posts and modifiers as proposed, the Signal Relay flare once per Leg; rations 6, 7, 8, 9, 10, 12 by Funding, and no rations means every soldier gains 1 Stress with no roll and the camp gives no relief; Distance Bands by position on the interim route; the Straggler victim rolled at random (D6, 1 to 4 a Squadmate, 5 to 6 a player character, then a die over the living soldiers of that kind; a player character when no Squadmate lives), Endure with no Help and no retry, a Bite Critical Injury at a rolled location that can be lethal; the hazard table as written; Downtime seven days with the infirmary roll (four dice, needs 1, once per patient per day), Recover 2 Stress, Visit Haven 2 Stress and 2 Grief, Requisition, Maintain Gear, the Squad Action Honoring the Fallen (1 Grief each) or Recruit, and Squadmates losing 2 Stress and 1 Grief; OQ-52's relief target is met by Visit Haven. While an Expedition runs, the interim day and interim issue do not happen.
- **ADR:** ADR-0009 (`## Amended`, batch 7); ADR-0005 (`## Amended`, the Straggler sentence); ADR-0003 item 12 (the new tracked values)
- **Simulator case:** none before the playtest; the sequence family under the Expedition cadence once the simulator learns Legs (OQ-116); the In Reach starts (Straggler, Overrun) and the night Abnormal as sensitivity rows then.
- **Revised by batch 8 (8-7, 8-12):** the Prowlers row's Bandits, and any Bandit group met at night, carry a firebrand (Fight, Burn, damage 1) in place of the club; the rations stock renders as a column of the Squad Supply stock table; a firearm may be loaded outside a Skirmish at any time for 1 shot. The Straggler's Bite rolls no Attack Dice: its Endure roll is its whole test (OQ-145).
- **Revised by batch 8 (8-35, 8-37, 8-38):** a Leg roll or camp roll no soldier can make fails. A retreat from a Titan Engagement the Night table begins falls back overnight to the Waypoint the day's last Leg started from, and that Leg is ridden again the next day. Recruit brings no Squadmate while the playtest configuration holds (OQ-166).
- **Revised by batch 9 (9-15):** the GM as Command authors the Mission Brief and may frame a Waypoint scene between Legs on called rolls. The Leg roll, the hazard and Night tables and their modifiers, the Straggler's random victim, and every rolled row are applied as written (ADR-0009 as amended in batch 9).
- **Revised by batch 9 (9-37):** "their modifiers" reads their amounts and their application, which the route the Brief sets, the night camps made, the Leg roll, and the flare decide; the route's own Distance Bands, Posts, and Hard Ride days are Command's, read as written once the Expedition begins. A Brief's route keeps within the interim route's envelope in the first playtest: 4 to 6 Legs, no Leg deeper than the interim route gives its place, and at most one Depot, never the gate. Phase 2 may widen the bounds (OQ-179).

### OQ-142: Requisition, the playtest minimum

- **Type:** Rules gap (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md` (minimal rules, answers 3 and 4; item 6) and `minimal-rules-expeditions-requisition-combat.md` section 2. Chapter 7; `data/campaign/requisition.yaml`; Chapter 4 sections 4.9 and 4.12; `data/gear/items.yaml`, `sheet-fields.yaml`.
- **Related:** OQ-59, OQ-63, OQ-141, OQ-143.
- **Question:** Requisition and Scarcity are glossary terms with no rule, and Blade Set ratings 2 and 3 wait for one. What is the smallest Requisition rule, and does it start before the first Expedition?
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 7*, 7-16)
- **Decision:** The proposal's section 2, with the "before the first Expedition" sentence dropped: Requisition is a Downtime Action, once per player character per Downtime, so the first playtest runs on the reference kit. Persuade or Recall, needs equal to Scarcity (1, 2, 3) plus the ledger; the Funding gate (Standard at 1 or 2, Limited from 3, Rare from 5); Size Up once per Downtime lowers the ledger by 1; Help by a player character spends their own Requisition; the 14-row playtest list as proposed, the pistol and musket included; a kept item is never taken by Standard Issue. No prices.
- **ADR:** ADR-0016 (new, item 8)
- **Simulator case:** none; the Jam and gas figures at ODM Gear 3 and the Blade Set fragility figures under OQ-63 are the sensitivity record.
- **Revised by batch 8 (8-10, 8-12):** the list gains one row, a prosthetic arm or leg at Limited, one per Requisition, fitted at a Downtime after the loss has healed, and a player character may Requisition it for a Squadmate (OQ-147); at a Standard Issue exchange a soldier may hand a kept item in and take the issue instead.

### OQ-143: Skirmishes, the playtest minimum, and the Skirmish probe

- **Type:** Rules gap (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md` (minimal rules, answers 1, 2, 4, 6, and 9) and `minimal-rules-expeditions-requisition-combat.md` section 3. Chapter 7; `data/skirmish/skirmish.yaml`, `foes.yaml`; Chapter 1 section 1.9; Chapter 3 section 3.16; Chapter 4 sections 4.1 and 4.10; `data/character/action-catalog.yaml`; `data/core/bonus-dice-sources.yaml`, `stress-changes.yaml`; `data/mind/fear-rolls.yaml`; `data/harm/health.yaml`, `sheet-fields.yaml`.
- **Related:** OQ-18, OQ-36, OQ-137, OQ-141, OQ-142.
- **Question:** Block and Fight are reserved with no enemy, and Cut and Pierce have no source. The owner put human conflict in scope with Military Police, bandits, and Garrison sentries, guns as lethal as Titan fights, a Fear Roll on a first human kill, and bare hands that never kill.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 7*, 7-17)
- **Decision:** The proposal's section 3 as written (ADR-0018), with: the foe table's numbers and group sizes as proposed, the Garrison sentry kept; a Skirmish's end gives the 1 Stress relief as a `skirmish-ends` row; `first-human-kill` joins the closed Fear Roll trigger list; Hand-to-Hand's live entry names Fight and Block with a Blade Set, bare-handed, or as a Grapple; Blade Discipline also names Fight; Carrying Voice reads any soldier in the Skirmish; Pry Loose stays Titan-only; Wide Awareness and Shoulder the Load change nothing in a Skirmish. The musket's damage 3 leaves a Health 4 Rookie one box from Down, and one extra success puts them Down; that is the reading of "a landed musket hit puts a Rookie Down".
- **ADR:** ADR-0018 (new); ADR-0003 item 1 (`## Amended`, batch 7); ADR-0015 (`## Amended`, batch 7)
- **Simulator case:** a Skirmish probe, reported and not tuned: one Rookie against one Military Police trooper, the reference Squad against three troopers, and the reference Squad against three Bandits who have the ambush; deaths, Down, and Blade Sets ruined per Skirmish.
- **Revised by batch 8 (8-4, 8-7, 8-12):** humans share ADR-0019's shape: each Block or Dodge success cancels one attack success, the attack lands on 1 or more net successes, and damage is the weapon's base plus 1 per net success beyond the first; a Foe's Guard is its cancelling roll and never Pushes. The musket's damage is 4, so a landed ball at net 1 puts a Health 4 Rookie Down with the Pierce Critical Injury, which is the reading of "a landed musket hit puts a Rookie Down". Shoot uses the firearm's Gear Dice outside a Titan Engagement; a Grapple deals no damage; a new `release` option ends a hold; a flare may be fired at a person (Shoot, Burn, damage 1, 1 flare) and a Bandit at night carries a firebrand (Fight, Burn, damage 1). The probe reports the new shape and the musket (OQ-145).
- **Revised by batch 8 (8-33):** the Skirmish probe carries three reported figures, not ADR-0014 targets: the reference Squad against a Military Police patrol, 0.02 to 0.04 deaths with a win of at least 90%; the Bandit night ambush, 0.01 to 0.03 deaths; one Rookie against one trooper, a win of 50% to 70%. The trooper rolls 7 Attack Dice, has Grit 4, and comes as a patrol of 4, so the probe's main row reads four troopers (the sweep: 0.024 deaths and a 97.6% win; the lone Rookie 56.2%; the ambush 0.015, Bandits unchanged) (OQ-164).

### OQ-144: Capstone Talents

- **Type:** Rules gap (owner feedback, playtest packet round 1; after the first playtest)
- **Arose in:** `character-creation-and-talents.md` note 2, option (C); decision batch 7, 7-2.
- **Related:** OQ-28, OQ-136.
- **Question:** Should each Specialty's signature dice Talent gain a rule effect at level 3, so that the Levi-grade build has a name to aspire to? That is a new Talent shape (`talent_rules.types`), reachable only through XP, and a capstone on the Nape strike moves the Levi-grade cut (47.2% in a 45% to 55% band).
- **Options:**
  - (a) A level-3 effect on the signature dice Talent, measured against the Levi-grade cut and the prepared-Squad kill.
  - (b) A separate rule Talent with the signature Talent at 3 as a prerequisite, a second new shape.
  - (c) No capstones.
- **Current handling:** (c); no Talent has a level-3 effect, and no Talent has a prerequisite.
- **Why still open:** it needs the XP rules (Phase 2) to be reachable at all, and a measurement against the Levi-grade target before it ships.
- **Simulator case:** the Levi-grade cut and the prepared-Squad kill with each candidate capstone.
- **Status:** Open

### OQ-145: Titan attack resolution: rolled Attack Dice and the cancelling Reaction

- **Type:** Rules change (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md`, *Titan attack resolution*; `docs/playtest/feedback/round-1/opposed-rolls.md` (rounds 1 to 3). Chapter 1 sections 1.1 and 1.9; Chapter 2 section 2.8; Chapter 3 sections 3.1, 3.2, 3.7; Chapter 4 sections 4.2, 4.3; Chapter 5 sections 5.4, 5.5, 5.8, 5.9, 5.13; Chapter 6 every stat block and 6.6; Chapter 7 section 7.4; `data/engagement/size-classes.yaml`, `titan-format.yaml`, `behavior-procedure.yaml`, `grab.yaml`, `read.yaml`, `tuning.yaml`; `data/titans/*.yaml`; `data/harm/critical-injuries.yaml`; `data/skirmish/*.yaml`; `tools/sim/`.
- **Related:** OQ-09, OQ-14, OQ-25, OQ-80, OQ-96, OQ-132, OQ-135, OQ-140, OQ-143.
- **Question:** The owner wants Titans to roll their attacks in the open, the Reaction to cancel one for one, a lucky roll to be able to kill outright, a bad roll to whiff even against a soldier who cannot react, and humans to share the shape. Which shape, at which pools, at which Health, and what happens to every tuned figure?
- **Options:**
  - (a) Cancellation, net 1 lands, extra net worsens the Critical Injury roll (Option C), Titan Dice on 5 or 6 at 3, 6, 9, and 12, today's Health.
  - (b) The same on sixes at 6, 12, 18, and 24.
  - (c) Tiers by net (a glancing net 1).
  - (d) Damage and a crit threshold into Health (Option D), or a hybrid, at Health 4 or 6.
  - (e) Keep fixed Severity (ADR-0015).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-1 to 8-6)
- **Decision:** (a). Attack Dice at 3 per former Severity point, keyed to the Severity values (the Large's control tier rolls 9); Titan Dice succeed on 5 or 6, never Push, and are rolled in the open when the card comes up; each dodge success cancels one; the card lands on 1 or more net successes and whiffs on 0 against anyone, a soldier who cannot react included, on whom it lands on 1 or more Titan successes; +1 to the Critical Injury roll per net success beyond the first, with the cap and instant-death rows applying; no rider on a Grab, a knock loose, or Stress; one Pushable Reaction per Titan per round, cancelling against each later card separately; the devour always lands; Health unchanged; humans share the shape with damage plus 1 per net success beyond the first and the musket at 4; Chapter 1 item 5 deleted and the procedure defined once, the acting side's roll final first and the reacting side Pushing last. (b) has the same mean with a wider spread and pools outside Alien's range; (c) halves deaths at equal dice and needs about 22 kill dice; (d) cannot reach today's lethality at small pools, overshoots at Health 4 with the owner's pools, and reverses ADR-0005; (e) is the rule leaving.
- **ADR:** ADR-0019 (new, superseding ADR-0015); ADR-0001, ADR-0003, ADR-0005, ADR-0014, ADR-0018 (`## Amended`, batch 8)
- **Simulator case:** every target, band, bar limit, and reported row re-measured under Attack Dice as a check (the Medium band at most 0.06 through the end, expected 0.058; the six Grab cells; the Abnormal's bar; the Jam test at the kill pool; the lone and Levi-grade cuts; the gas medians); the Large's deaths reported (0.156 against 0.185); the Skirmish probe with the musket at 4. No Attack Dice count changes before the playtest.
- **Revised by batch 8 (8-19):** the rider is +1 per net success beyond the first, so 8-2's worked example reads 2D6+2 for a roll of 5 against a Reaction of 2 (corrected in place); a telegraph-only entry omits `attack_dice` rather than listing 0 (OQ-151).

### OQ-146: The falling Titan, Pinned, Heave, and the corpse

- **Type:** Rules gap (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md`, *Titan attack resolution*, the Burn paragraph ("the titan falling onto them"); Titan World 3rd Edition, *Titan Bodies*; `critical-injuries.md` Option 2's Pinned sketch. Chapter 5 sections 5.2, 5.7, 5.11; Chapter 3 sections 3.9, 3.16; Chapter 4 section 4.7; `data/engagement/titan-harm.yaml`, `positions.yaml`, `engagement-flow.yaml`, `size-classes.yaml`, `anchor-ratings.yaml`; `data/character/action-catalog.yaml`; `data/harm/effect-types.yaml`, `sheet-fields.yaml`; `data/gear/carrying.yaml`.
- **Related:** OQ-122, OQ-123, OQ-126, OQ-138, OQ-137, OQ-132.
- **Question:** The owner wants a killed or toppled Titan's body to come down on the soldiers under it, with a pinned state that combines with corpse heat, in the first playtest. Who is in the path, what test avoids it, what does the pin do, how is a soldier freed, and how does a corpse hold Positions after the Titan's death ends them, without a Critical Injury at every kill?
- **Options:**
  - (a) The path is On Body and Blind Spot for soldiers who are not airborne; Leap Clear (Agility with ODM Gear or the horse, needs 1, not a Reaction); a failure pins with a capped Crush Critical Injury; Heave counts toward a Size Class rating, or the pinning limb is Broken; the corpse keeps its Positions as a grounded body; the Titan Engagement runs on while anyone is Pinned.
  - (b) The path includes In Reach for every soldier on foot or mounted.
  - (c) An opposed roll: the body rolls the Titan's control Attack Dice as Crush and the soldier cancels.
  - (d) Freeing at the end steps only, with no rounds after the last Focus Titan dies.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-9)
- **Decision:** (a). (b) would put a Leap Clear on the baseline's two on-foot cutters at every grounding and press the Small table's Critical Injuries band (at most 1.0, today 0.86); a soldier at In Reach stands beside the legs, and the airborne striker swings clear, as canon shows. (c) makes every kill a control-tier attack on the killer, which the research showed breaks the Medium band. (d) makes the rescue an end step instead of a scene under the retreat clock and the Background Titans. A Down soldier in the path is pinned with no roll; a carried one follows the carrier. A limb pin leaves the action; a body pin takes it. A Pinned soldier under a living grounded Titan takes its cards as one who cannot react and is freed when it stands; under a corpse they take corpse heat each turn (OQ-138). No new Fear Roll trigger.
- **ADR:** ADR-0019; ADR-0003 item 12 (`## Amended`, batch 8)
- **Simulator case:** pins per fight, Burn Critical Injuries per pin, deaths from corpse heat, and the share of Titan Engagements that run on for a Pinned soldier, on the reference start and the Jam and mounted rows; expected within sampling on the baseline. The narrowing of the path to On Body is the third lever if a band misses (8-14).
- **Revised by batch 8 (8-17, 8-18):** a limb pin names the Titan's Body Part of the same kind and side as the rolled Injury Location (the other of its kind if Broken; none if both are, when only Heave or a standing Titan frees); cutting free is the existing Body Part strike against it, counting toward its Toughness, with no flag and no Openings on a corpse. A Pinned soldier is never lifted or carried; a carrier whose Leap Clear fails is Pinned with the comrade, each with their own Crush Critical Injury. A soldier in another Titan's hand, or in the falling Titan's hand at a grounding, is outside the path; one freed by the holding Titan's death holds On Body for the steam and the fall and is in it. A Grab on a Pinned soldier lands its crush and takes no hold (OQ-151).
- **Revised by batch 8 (8-20 to 8-23):** 8-9's "and for nothing else" is withdrawn: a corpse's Positions are Positions in the Titan Engagement for every rule that reads one, and Heave and the strike on a pinning Body Part are the only acts against a corpse; with no Focus Titan alive, comparisons are relative to the corpse of the Titan that died last. Every Pinned soldier dies when no-soldier-standing ends the fight, with or without a living Titan, and the retreat's forced moves read a Pinned comrade. The heave count is cleared when a living Titan stands and by nothing else, so "never resets" is amended and no Heave frees on 0 successes. The lost-limb grades read Leap Clear and Heave (OQ-156 to OQ-159, OQ-162).
- **Revised by batch 8 (8-41):** a soldier whose pinned arm or leg is lost to corpse heat stays limb-pinned, and the freeing list stays closed. The packet's feedback page counts such losses (OQ-166).

### OQ-147: Prosthetics as the alternative to medical Retirement

- **Type:** Rules gap (owner feedback, playtest packet round 1)
- **Arose in:** `OWNER-DECISIONS.md`, *Batch 7 "Needs owner" answers*, item 1; `DECIDER-QUEUE.md` item 17. Chapter 3 sections 3.2 and 3.13; Chapter 4 section 4.1; Chapter 7 section 7.3; `data/harm/critical-injuries.yaml` `lost_limb_riders`; `data/gear/items.yaml`, `carrying.yaml`; `data/campaign/requisition.yaml`; `data/mind/scars.yaml`.
- **Related:** OQ-137, OQ-142, OQ-138.
- **Question:** The owner wants a prosthetics option for a soldier who loses limbs, inside ADR-0016's era (Paradis, 845 to 850; invented items only through Requisition or a Discovery). What does a prosthetic restore from the lost-limb grades, how is it obtained, and does it apply to one limb or both?
- **Options:**
  - (a) A prosthetic arm or leg per lost side, Requisition at Limited or a Discovery, fitted at a Downtime after the loss heals; each lowers the grade one step, never past the one-limb grade for two, and never removes the rows' own permanent penalties.
  - (b) A prosthetic restores the limb in full.
  - (c) A prosthetic only for legs.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-10 and 8-11)
- **Decision:** (a). The era has hooks, sockets, and peg legs and nothing that grips an ODM trigger with two iron hands, so two prosthetics stop at the one-limb grade; reading the grade with one fewer side lost per prosthetic is one sentence on `sides_lost`. Rated none, no Gear Dice, counts as no item, never a weapon, a kept item; a player character may Requisition one for a Squadmate. Medical Retirement stays beside it, open to Squadmates, and is offered again at the end of every Downtime while the loss stands. Lost limbs and prosthetics are unmeasured.
- **ADR:** ADR-0017 (`## Amended`, batch 8)
- **Simulator case:** none; listed as unmeasured.

### OQ-148: The drafters' round 1 questions

- **Type:** Rules gap (drafter questions, `DECIDER-QUEUE.md` items 1 to 16)
- **Arose in:** WP-0, WP-S1, WP-C, and WP-A while applying batch 7.
- **Related:** OQ-135, OQ-137, OQ-139, OQ-141, OQ-142, OQ-143.
- **Question:** Sixteen readings the drafters could not settle from batch 7: firearms' Gear Dice and loading, a kept item at an exchange, releasing a hold, a Grapple's damage, what a roll changes, the rations render, lost limbs in the simulator, a forced move on a spent turn and a dropped Blade Set, the stacking of lost-limb penalties, what both arms and both legs still allow, who may take medical Retirement, the Free Build reported Squad, fewer Squadmates as whose choice, and the Free Build's Health range.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-3 and 8-11 to 8-13)
- **Decision:** Each item is settled in 8-11 (10 to 13), 8-12 (1 to 7), 8-13 (8, 9, 14, 15), and 8-3 (16), and `DECIDER-QUEUE.md` marks every item with its batch 8 item.
- **ADR:** none; ADR-0014 (`## Amended`, batch 8, the unmeasured list)
- **Simulator case:** none.

### OQ-149: Burning terrain and fire beyond weapons

- **Type:** Rules gap (owner feedback, playtest packet round 1; Phase 2)
- **Arose in:** decision batch 8, 8-7; `critical-injuries.md` Option 2's Chapter 4 fire stub.
- **Related:** OQ-138, OQ-141.
- **Question:** Burn's playtest sources are steam, corpse heat, a firebrand, and a fired flare. A fire that spreads (a burning town at an Urban Waypoint, a stable, a wagon set alight at night) has no rule, because no Phase 1 or playtest rule names one and ADR-0016 item 6 forbids a table nothing reads.
- **Options:**
  - (a) A Chapter 4 fire hazard with a D6 table like falls, named by a Night table row and by the Urban Waypoint's Titan Engagement setup.
  - (b) Fire only as weapons, as now.
- **Current handling:** (b).
- **Why still open:** it needs a rule that names it, which the Expedition Night table (shipped as written for the playtest count) and the Waypoint kinds do not yet give; decided with Phase 2's Expedition rules.
- **Simulator case:** none before a rule names it.
- **Status:** Open

### OQ-150: The Cut and Pierce riders

- **Type:** Rules change (owner feedback, playtest packet round 1; the batch 8 "Needs owner" item 5)
- **Arose in:** `IMPLEMENTATION-PLAN.md` *Needs owner* item 5, which the owner overrode; decision batch 8, 8-8; `critical-injuries.md` Sample 3. Chapter 3 sections 3.2, 3.4, 3.5, 3.6; Chapter 7 section 7.4; `data/harm/critical-injuries.yaml`, `treat-injury.yaml`, `healing.yaml`, `death-rolls.yaml`; `tools/render/render.py`; `tools/sim/` (the Skirmish probe).
- **Related:** OQ-137, OQ-138, OQ-143, OQ-145.
- **Question:** 8-8 gave Cut and Pierce no rider, because their only sources are a Foe's blade and shot in a Skirmish and the Skirmish is unmeasured. The owner refused the default: each type gets a rider, as Bite and Burn have, with Cut bleeding and Pierce lodging as the prompts. Which fields, on which rows, in the existing rider shape, and what does it do to Skirmish lethality?
- **Options:**
  - (a) Cut: every lethal `engagement` row reads `turn`, on all four tables, and a Skirmish's turns count for `turn` limits. Pierce: from the 7 row up, Treat Injury on the Critical Injury takes a 1-die penalty and it does not heal while untreated; the graze and clip rows carry no rider.
  - (b) Cut as (a); Pierce needs 2 successes to treat.
  - (c) Cut as (a); Pierce adds 1 to the Death Roll penalty on its lethal rows.
  - (d) Cut as (a); an untreated Pierce festers into a lethal `day` limit when a day passes.
  - (e) No rider, 8-8's default.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-15)
- **Decision:** (a). Cut reuses the Bite rider's field on more rows, so Bite severs and Cut bleeds and they overlap only on the limb 12 rows; Pierce takes the aftermath rather than the fight, through the `penalty` effect and the treated flag the sheet already records, with two new rider fields (`treat_injury.penalty`, `heals_untreated`). (b) makes a Rookie Medic with a kit treat a Pierce 26% of the time; (c) makes Pierce a second fast type beside Cut; (d) is Burn's death twice; (e) is the default the owner refused. Neither type has a Titan source, so no Titan figure moves. The push is upward and Skirmish-only: a lethal Cut untreated by a Strength 3 soldier kills about 58% at a fight's end today and about 80% after two `turn` Death Rolls; a lethal Pierce costs about 1 death more in 100 through the harder aftermath roll.
- **ADR:** ADR-0017 (`## Amended`, batch 8, 8-15)
- **Simulator case:** the Skirmish probe with and without the riders, report-only: deaths and Down per Skirmish, Death Rolls per lethal Cut, and Pierce Critical Injuries left untreated at the Skirmish's end. No Titan case.

### OQ-151: The drafters' round 2 questions

- **Type:** Rules gap (drafter questions, `DECIDER-QUEUE.md` items 18 to 25)
- **Arose in:** WP-D, WP-S1 part 3, and WP-R while applying batch 8. Chapter 3 section 3.9; Chapter 4 section 4.7; Chapter 5 sections 5.7, 5.9, 5.13; `data/harm/effect-types.yaml`, `sheet-fields.yaml`; `data/engagement/titan-harm.yaml`, `grab.yaml`, `tuning.yaml`; `data/gear/carrying.yaml`; `tools/sim/engine.py`.
- **Related:** OQ-137, OQ-139, OQ-145, OQ-146, OQ-148.
- **Question:** Eight readings the drafters could not settle from batch 8: whether a forced strike the soldier cannot make lapses; the event's Titan for a result no card or Grab caused; the "Hesitate included" record; which Titan Body Part pins a soldier and what cutting it takes; whether Lift Comrade can carry a Pinned soldier (8-11 against 8-9); whether a Grabbed soldier is in the falling Titan's path and whether a Grab can hold a Pinned soldier; 8-2's rider example; and a telegraph-only entry's `attack_dice`.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-16 to 8-19)
- **Decision:** Each item is settled in 8-16 (18 to 20), 8-17 (21), 8-18 (22 and 23), and 8-19 (24 and 25), and `DECIDER-QUEUE.md` marks every item with its batch 8 item. 8-9 governs over 8-11 on Pinned; the freed Grab victim is in the falling Titan's path, as 8-9's reasoning already said; the pinning Body Part is read from the Injury Location roll already made, and cutting it is the Body Part strike as it stands.
- **ADR:** none.
- **Simulator case:** none new; the pin rows of 8-14 item 3 count the freed victim's Leap Clear and the share freed by cutting, Heave, or death.

### OQ-152: Expedition readings of the playtest minimum

- **Type:** Rules gap (drafter readings, WP-F; playtest packet feedback round 1)
- **Arose in:** Chapter 7 section 7.1 under decision batch 7, 7-14; `data/expedition/legs.yaml`, `hazards.yaml`, `route.yaml`; `data/gear/horses.yaml`.
- **Related:** OQ-116, OQ-120, OQ-141.
- **Question:** 7-14 adopts the proposal's section 1 as written, which leaves six readings open:
  - (a) The proposal gives each Leg a Pace in the Mission Brief, and also calls a Hard Ride a third Leg squeezed in before dark. Is a Hard Ride ordered per Leg or per day?
  - (b) Does a Leg ridden again after a retreat count toward the day's two Legs?
  - (c) Hunger applies when the Squad has no rations for a Leg or a camp. Does a Squad that holds fewer rations than the spend meet it?
  - (d) May the Straggler's victim be Down, when a Down soldier makes no roll but the Death Roll? What if no soldier qualifies? Is the care window for its Critical Injury held before the Titan Engagement that begins at once?
  - (e) Who is mounted on a Leg and at a night camp, where a soldier with a lame horse rides, and what happens on a Hard Ride when no soldier can make the Ride roll?
  - (f) Which Distance Band the night hazard adds, and which Anchor Rating a Titan Engagement from the Night table takes.
- **Options:** (a) per Leg in the Brief, or per day after the day's second Leg. (b) It counts, or it does not. (c) Short counts as none, or only 0 does. (d) Any living soldier or only soldiers not Down; the outside-harm window at once, or the Titan Engagement's end window. (e) Every soldier able to ride mounted on a Leg and dismounted at camp, or no rule; a failed Leg roll, or a Steady Leg instead. (f) The day's last Leg and the Waypoint it reached, or the route's next Leg.
- **Current handling (PROVISIONAL):** (a) Per day: after a day's second Leg, on a day the Brief lists or on a 5 or 6 on the interim route; a day's first or second Leg is never a Hard Ride. (b) It counts. (c) Short counts as none: the Squad spends what it holds and meets hunger. (d) Only soldiers who are not Down; with none of either kind the row reads as Titan on the formation; the Critical Injury counts as gained as the Titan Engagement begins, so that Titan Engagement's windows and limits govern it. (e) Every soldier who is not Down and whose horse is not lame is mounted on a Leg, everyone dismounts at a night camp, a soldier with a lame horse rides in the wagon, and a Hard Ride with no soldier who can roll Ride fails its Leg roll. (f) The day's last Leg's Distance Band and the kind of the Waypoint it reached.
- **Why:** Each is the reading closest to the proposal's own sentences and to ADR-0009 (a Hard Ride is squeezed in before dark; a retreat costs the ride; hunger is running short), keeps every choice closed (ADR-0003), and moves no figure, since no ADR-0014 target reads an Expedition.
- **Simulator case:** none before the playtest.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-27)
- **Decision:** All six readings confirmed as drafted: a Hard Ride per day after the second Leg; a Leg ridden again after a retreat counts; short rations meet hunger; the Straggler's pool excludes the Down, falls back to Titan on the formation, and its Critical Injury is gained as the fight begins; mounted on a Leg and dismounted at camp, the wagon for a lame horse, a Hard Ride nobody can ride fails its Leg roll; the night reads the last Leg's Distance Band and its Waypoint's Anchor Rating. The markers become citations of 8-27 (OQ-162).
- **ADR:** none
- **Revised by batch 8 (8-35, 8-37):** (e)'s failed Hard Ride extends to every Leg roll and the camp roll that no soldier can make. (b) also covers the Leg a night retreat falls back from, ridden again as the next day's first Leg (OQ-166).

### OQ-153: Downtime readings of the playtest minimum

- **Type:** Rules gap (drafter readings, WP-F; playtest packet feedback round 1)
- **Arose in:** Chapter 7 section 7.2 under decision batch 7, 7-15; `data/campaign/downtime.yaml`; `data/harm/healing.yaml`, `treat-injury.yaml`, `death-rolls.yaml`.
- **Related:** OQ-52, OQ-120, OQ-141, OQ-147.
- **Question:**
  - (a) 7-15 says Downtime lasts seven days, and the glossary calls it the time between Expeditions. When does it end, and does an interim day or interim issue fall between its end and the next Expedition?
  - (b) Is a care window held on each of the seven days, as a day passing holds one, or only the infirmary's first?
  - (c) In what order do the Downtime Actions, the Squad Action, prosthetic fitting (8-10), the medical Retirement offer (8-11), and a Requisition's arrival fall?
  - (d) A Downtime Action or the Squad Action is a soldier's choice that changes Stress, Grief, or gear. ADR-0003 item 12 asks for a Catalog entry for each consequential act, and 7-15 names none.
- **Options:** (a) until the next Expedition begins, or after the seventh day with the interim rows between. (b) the first window only, or one a day. (c) any order the rule fixes. (d) procedure choices with no entry, or new Catalog options.
- **Current handling (PROVISIONAL):** (a) Downtime runs until the next Expedition begins; its seven days pass at the infirmary, and no interim day or interim issue happens while it runs. (b) Only the infirmary's first window; each day gets the infirmary roll instead. (c) Infirmary, Downtime Actions, Squad Action, then fitting, the Retirement offer, Retirements and promotions, and the granted items' arrival. (d) Procedure choices with no Catalog entry, as 7-15 lists them.
- **Why:** (a) follows the glossary and adds no eighth day; (b) is the proposal's text (one care window, then the infirmary roll each day); (c) lets a limb that heals during the seven days take a prosthetic the same Downtime and puts every Retirement after the choices that could avoid it; (d) needs a decision, since new entries would be a Catalog change 7-15 did not make.
- **Simulator case:** none.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-28)
- **Decision:** (a) and (b) confirmed. (c) amended: the after-actions step reads granted Requisitions arrive, prosthetics are fitted, medical Retirement is offered again, then retirements and promotions resolve, so a limb that heals during the seven days takes a prosthetic the same Downtime. (d) amended: two Catalog option entries, `downtime-action` and `squad-action`, each keeping its rows in `downtime.yaml`, with the tracked values `stress-lower`, `grief-lower`, and `squad-recruit` (Maintain Gear changes `gear-restore` and `gas-restore`; Requisition changes `requisition-grant` through `persuade` and `recall`); ADR-0003 item 12 is met (OQ-162).
- **ADR:** none in text (ADR-0003 item 12 met)

### OQ-154: Requisition readings of the playtest minimum

- **Type:** Rules gap (drafter readings, WP-F; playtest packet feedback round 1)
- **Arose in:** Chapter 7 section 7.3 under decision batch 7, 7-16, and decision batch 8, 8-10; `data/campaign/requisition.yaml`.
- **Related:** OQ-142, OQ-147.
- **Question:**
  - (a) Size Up lowers the ledger by 1. Can the ledger fall below 0, so that a Standard row needs 0 successes? Who may roll Size Up, and does it spend a Downtime Action?
  - (b) When does a granted item arrive?
  - (c) What canon label does the prosthetic row carry?
- **Options:** (a) a floor of 0 or none; any soldier or only a player character; a Downtime Action or none. (b) at once, or at the end of the Downtime. (c) canon, canon-adjacent, or invented.
- **Current handling (PROVISIONAL):** (a) Never below 0; any soldier in the Squad who is not Down, a Squadmate included, spending no Downtime Action. (b) At the end of the Downtime's steps, before the next Standard Issue. (c) Canon-adjacent.
- **Why:** (a) A needs of 0 is no roll, and the proposal names only "one soldier" with no cost. (b) The proposal says the item arrives before the next Standard Issue. (c) The show gives no Survey Corps soldier a prosthetic, and 8-10 calls it an era item a workshop can make; no playtest rule reads the label.
- **Simulator case:** none.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-29)
- **Decision:** All three readings confirmed: the ledger never below 0 and Size Up by any soldier not Down, a Squadmate included, spending no Downtime Action; a grant arrives at the after-actions step, before the next Standard Issue and, under 8-28, before prosthetics are fitted; the prosthetic row is canon-adjacent (OQ-162).
- **ADR:** none

### OQ-155: Skirmish readings of the playtest minimum

- **Type:** Rules gap (drafter readings, WP-F; playtest packet feedback round 1)
- **Arose in:** Chapter 7 section 7.4 under decision batch 7, 7-17, and decision batch 8, 8-4, 8-7, 8-12; `data/skirmish/skirmish.yaml`, `foes.yaml`; `data/harm/treat-injury.yaml`.
- **Related:** OQ-143, OQ-145, OQ-148.
- **Question:** 7-17 adopts the proposal's section 3 as written, which leaves these readings open:
  - (a) How many Foes a start that names none brings (the trooper's group is "2 to 4"), and whether a Skirmish can hold several Foe groups.
  - (b) Which weapon a Bandit carries (club or knife), what a Garrison sentry Engaged with a soldier fights with, whether Foes' firearms start loaded, and whether a Foe's Reload spends shot.
  - (c) Whether a Foe attacks a Down soldier, and what a Down soldier's move does.
  - (d) When the Squad may try for the ambush, since "if the Squad approaches unseen" is a judgment.
  - (e) Whether Burn damage at 0 Health kills a Foe or puts it out cold, since ADR-0018 says only Cut or Pierce kills and Burn joined later.
  - (f) When the Squad may leave, and how a Skirmish ends when every soldier is Down.
  - (g) Whether a hold ends when the holder becomes Down, and what a Held Foe does when its group breaks.
  - (h) How Treat Injury and Rally work in a Skirmish, which has no Positions and is not a care window.
  - (i) Whether a Foe with the ambush gains dice, when a Foe's pool "takes nothing else" but the proposal says the ambush applies the same against the Squad.
  - (j) No Foe on the playtest list Grapples under the foe rule, so no playtest rule makes a soldier Held. Should a Foe Grapple?
- **Options:** as each question states.
- **Current handling (PROVISIONAL):** (a) One Foe group; the start's number, or the kind's group size, with the trooper at D3+1. (b) A D6 for each Bandit as the Skirmish begins, 1 to 3 a club (a firebrand at night) and 4 to 6 a knife; a sentry Engaged fights bare-handed; Foes' firearms start loaded; a Foe's Reload spends its turn and no shot. (c) A Foe never attacks a Down soldier; a Down soldier's move changes nothing. (d) The Squad may roll Sneak before round 1 of any Skirmish whose start does not give the Foes the ambush, and a failure gives no side the ambush. (e) Out cold. (f) The players may declare the Squad leaves at the end of a round in which every soldier not Down is Apart from every Foe, not Held, and holding no Foe, and every Down soldier is carried; if every soldier is Down or dead, the Foe group leaves and takes nothing. (g) A hold ends when the holder becomes Down; a Held Foe of a broken group stays Held and leaves at the end of the round its hold ends. (h) Actions used as in a Titan Engagement with no Position requirement, the patient any soldier taking part, tried again on a later turn. (i) A Foe with the ambush rolls 2 more Attack Dice against a soldier who has not yet acted. (j) No Foe Grapples; the Held-soldier rules stay written for later Foes.
- **Why:** Each keeps the GM choosing nothing (ADR-0003, item 8), reads the proposal's and ADR-0018's words literally where they speak, and otherwise mirrors the nearest Titan Engagement rule (the setup table's rolls, the Down soldier's limits, the end steps). None moves a Titan figure; the Skirmish probe reads (a), (b), (c), (e), and (i).
- **Simulator case:** the Skirmish probe (OQ-143), reported and not tuned.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-30)
- **Decision:** (a), (b), (c), (d), (f), (g), (h), (i), and (j) confirmed as drafted. (e) amended: Burn kills. A Foe brought to 0 Health by Cut, Pierce, or Burn is dead and Crush alone puts one out cold; the first-human-kill trigger reads the three types, so a flare that kills is a first kill. (j): no Foe Grapples in the playtest and Held stays soldier-only; the Held-soldier rules stay written for Phase 2's Foes, where an MP arrest party is the canon image and a Grappling Foe needs a holding step in the foe rule and an outcome for a Squad that is taken. What a winning Foe group takes when every soldier is Down (an arrest, a Bandit's loot) is Phase 2's; the playtest group leaves and takes nothing (OQ-162).
- **ADR:** ADR-0018 (`## Amended`, batch 8, 8-30: Burn kills)
- **Revised by batch 8 (8-33):** (a)'s trooper roll of D3+1 is amended to a fixed group of 4, with the trooper's Grit at 4, so a patrol fights to the last and its Parley needs rise with its Grit; a start that names a number still uses it (OQ-164).
- **Revised by batch 9 (9-7, 9-14):** item (d)'s "if the Squad approaches unseen" is now a ruling: the GM rules whether the approach is possible, and the Sneak is then made against Watch as written. The foe rule is the default and the GM may direct a Foe with a reason said aloud; Grit is the latest a group breaks. The Parley need reads each Foe kind's new `parley` value in place of Grit (ADR-0018 as amended in batch 9).

### OQ-156: Positions while the Titan Engagement runs on under a corpse

- **Type:** Rules gap (WP-C2 drafter question, decision batch 8, 8-9)
- **Arose in:** WP-C2. Chapter 5 sections 5.2, 5.7, 5.11; `data/engagement/positions.yaml` (`corpse`, `holding_a_position`, `comparison`), `engagement-flow.yaml` (`ending`).
- **Related:** OQ-122, OQ-146, OQ-151.
- **Question:** 8-9 runs the rounds on after the last Focus Titan dies while a soldier lies Pinned, keeps the no-soldier-standing test, and says Positions relative to a corpse count for Help, Heave, strikes on a pinning Body Part, and corpse heat "and for nothing else". But "holding a Position in the Titan Engagement" means holding one relative to a Focus Titan, so with none alive no soldier holds a Position, the no-soldier-standing test ends the fight at once, and Treat Injury, Rally, and Lift Comrade compare Positions relative to a living Focus Titan that does not exist. What do Positions mean during the run-on?
- **Options:**
  - (a) While no Focus Titan is alive and the fight runs on, a Position relative to a corpse is a Position in the Titan Engagement; a rule that compares relative to the living Focus Titan with the earliest label compares relative to the corpse with the earliest label instead; a soldier who returns holds Distant relative to every corpse.
  - (b) No soldier holds a Position during the run-on, and the no-soldier-standing test is read only for the body-pinned.
  - (c) The run-on ends at once unless a comrade is Heaving or cutting; the rest waits for the end steps.
- **Current handling (PROVISIONAL):** (a), in `positions.yaml` `corpse.run_on`.
- **Why:** It is the only reading under which 8-9's run-on, its no-soldier-standing test, and a rescue by Treat Injury or Help all work as written, and it adds no new comparison, only a substitute body for the one that died.
- **Simulator case:** none; the engine already runs the rounds on for present soldiers.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-20)
- **Decision:** (a), with the reference amended. A Position relative to a corpse is a Position in the Titan Engagement whenever a corpse lies on the field, for every rule that reads one, so 8-9's "and for nothing else" is withdrawn; Heave and the strike on a pinning Body Part are the only acts against a corpse. Comparisons with no Focus Titan alive are relative to the corpse of the Titan that died last, not the earliest label, since labels order arrivals and the first corpse's Positions go stale while the second Titan is fought; the aftermath roll already reads "the Focus Titan alive last". The end steps read the corpse's Positions as they stand at the end. The marker `PROVISIONAL (OQ-152)` in `positions.yaml` indexes this entry and becomes a citation of 8-20 (OQ-162).
- **ADR:** none

### OQ-157: A soldier still Pinned when the Titan Engagement ends

- **Type:** Rules gap (WP-C2 drafter question, decision batch 8, 8-9)
- **Arose in:** WP-C2. Chapter 5 section 5.11; `data/engagement/engagement-flow.yaml` (`ending`, `left_behind`, `pinned_at_the_end`); `data/engagement/titan-harm.yaml` (`falling_titan`, `freeing`).
- **Related:** OQ-88, OQ-126, OQ-146, OQ-156.
- **Question:** 8-9 says the end of the Titan Engagement frees no one. `left_behind` kills every soldier still holding a Position only when the fight ends by no-soldier-standing while a Focus Titan is alive. If it ends that way (every standing soldier Down or gone, or the retreat) with no Focus Titan alive and a soldier Pinned under a corpse, what happens to that soldier?
- **Options:**
  - (a) Every soldier still Pinned dies, left under the body, as `left_behind` reads, whether or not a Focus Titan is alive.
  - (b) They stay Pinned after the end with no rule to free them.
  - (c) They are freed at the end, against 8-9's sentence.
- **Current handling (PROVISIONAL):** (a), in `engagement-flow.yaml` `ending.pinned_at_the_end`.
- **Why:** (b) leaves a soldier in a state no rule ends, and (c) contradicts 8-9. (a) is `left_behind`'s own reason: a comrade nobody stayed to lift dies.
- **Simulator case:** a counter for deaths by this row beside corpse-heat deaths (8-14 item 3).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-21)
- **Decision:** (a), with its scope fixed: every Pinned soldier dies under the body when no-soldier-standing ends the Titan Engagement (the only test that can while anyone is Pinned; the retreat ends by it), whether or not a Focus Titan is alive, as a `left_behind` death; every other soldier holding a Position dies only while a Focus Titan is alive. The retreat's options 3 and 4 read a Pinned comrade, with Heave and the strike on the pinning Body Part as the staying actions. The marker `PROVISIONAL (OQ-153)` in `engagement-flow.yaml` indexes this entry and becomes a citation of 8-21 (OQ-162).
- **ADR:** none
- **Revised by batch 8 (8-32):** when the retreat's stay limit closes the stays while no Focus Titan is alive, the comrades walk out, and once no-soldier-standing ends the Titan Engagement the Pinned soldier dies under the body by this entry's reading. A limb-pinned soldier who is not Down keeps it running alone until corpse heat makes them Down, unless they free themselves first (OQ-163).

### OQ-158: A new pin on a body whose heave count has already reached its Heave rating

- **Type:** Rules gap (WP-C2 drafter question, decision batch 8, 8-9)
- **Arose in:** WP-C2. `data/engagement/titan-harm.yaml` (`falling_titan`, `heave`).
- **Related:** OQ-146.
- **Question:** The heave count "never resets", and freeing happens "when the count reaches the Heave rating". A living Titan that was heaved off a soldier, stood at a Regeneration fill, and is grounded again can pin a soldier while its count already stands at or past its rating. When is that soldier freed?
- **Options:**
  - (a) By the next Heave made against it, whatever its successes.
  - (b) At once, as the pin is applied.
  - (c) The count resets when a living Titan stands, so a new grounding starts at 0.
- **Current handling (PROVISIONAL):** (a), in `titan-harm.yaml` `falling_titan.heave.count_already_reached`.
- **Why:** It keeps "never resets" and "reaches" literal, needs an act rather than a free release, and matches the engine, which tests the count after each Heave.
- **Simulator case:** none; rare.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-22)
- **Decision:** (c), amending the provisional (a): the heave count is cleared when a living Titan stands, and by nothing else (not a Regeneration fill, not the Titan's death, not between Heaves), so a body that comes down again is a fresh fall and no Heave frees on 0 successes. The engine clears the count where the Titan stops being grounded. The marker `PROVISIONAL (OQ-154)` in `titan-harm.yaml` indexes this entry and goes with `count_already_reached` (OQ-162).
- **ADR:** none

### OQ-159: The lost-limb grades and Leap Clear and Heave

- **Type:** Rules gap (WP-C2 drafter question, decision batches 8-9 and 8-11)
- **Arose in:** WP-C2. `data/harm/critical-injuries.yaml` (`lost_limb_riders`); Chapter 3 section 3.2 *Lost limbs*.
- **Related:** OQ-137, OQ-146, OQ-147.
- **Question:** 8-11 gives a soldier with both arms lost no Gear Dice from ODM Gear on the dodge, because the grade forbids ODM use. Leap Clear also takes Gear Dice from ODM Gear. And no rule says whether a soldier with both arms lost may Heave, or one with both legs lost may Leap Clear.
- **Options:**
  - (a) Both arms: no ODM Gear Dice on Leap Clear, as on the dodge; Heave allowed. Both legs: Leap Clear allowed, since it is not a move.
  - (b) Both arms: Heave forbidden, as Lift Comrade is. Both legs: no Leap Clear, so a soldier who cannot move is pinned with no roll.
- **Current handling (PROVISIONAL):** (a), in the both-arms grade's `no_gear_dice_from` row.
- **Why:** (a) applies 8-11's own reason to the second roll that uses ODM Gear and adds no ban the decisions did not name.
- **Simulator case:** none; lost limbs are unmeasured (8-13).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-23)
- **Decision:** (a) for Leap Clear on both grades, (b) for Heave with both arms lost: Leap Clear takes no ODM Gear Dice with both arms lost (the horse's while mounted) and is allowed with both legs lost, since it is not a move; Heave is forbidden with both arms lost, as Lift Comrade and Break Free are. The `arm-lost-arm` row's permanent penalty list gains `heave` and the `leg-lost-leg` row's gains `leap-clear`, stacking per side and surviving a prosthetic (OQ-162).
- **ADR:** none

### OQ-160: The medical supplies that meet the Burn rider's Treat Injury requirement

- **Type:** Rules gap (WP-C2 drafter question, decision batch 8, 8-8)
- **Arose in:** WP-C2. `data/harm/treat-injury.yaml` (`type_riders`); `data/gear/squad-supply.yaml` (`medical_uses`); Chapter 3 section 3.5.
- **Related:** OQ-67, OQ-138.
- **Question:** 8-8: Treat Injury on a Burn needs "a medical kit or one unit of medical supplies". The only spend of a medical unit on a roll is the care-bonus use, made in a care window and giving a Bonus Die. Is that the spend that meets the requirement, and can a unit be spent in a Titan Engagement or on an aftermath roll?
- **Options:**
  - (a) The care-bonus spend meets it (and gives its Bonus Die), so in a fight and at an aftermath roll only a kit does.
  - (b) A new use spends a unit on any Burn treatment, in or out of a fight, with no Bonus Die.
- **Current handling (PROVISIONAL):** (a).
- **Why:** (a) uses the one medical spend Chapter 4 defines and adds no new use to Squad Supply.
- **Simulator case:** the sequence cases' Burn treatment, which reads the kit (WP-S1 part 3).
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-24)
- **Decision:** (a). The care-bonus spend is the unit and gives its Bonus Die; in a Titan Engagement or a Skirmish only a medical kit that counts as had (rating above 0) meets the requirement; the aftermath roll never reaches a Burn, whose lethal rows carry a `day` limit. No new spend. The marker `PROVISIONAL (OQ-156)` in `treat-injury.yaml` indexes this entry and becomes a citation of 8-24 (OQ-162).
- **ADR:** none

### OQ-161: Mounting with a comrade's help outside a Titan Engagement

- **Type:** Rules gap (WP-C2 drafter question, decision batch 8, 8-11)
- **Arose in:** WP-C2. `data/harm/critical-injuries.yaml` (`lost_limb_riders`, both-arms, `mount_values`); `data/gear/horses.yaml` (`mounted`).
- **Related:** OQ-61, OQ-137.
- **Question:** 8-11: a soldier with both arms lost mounts or dismounts only when a comrade at the same Position who is not Down spends their action to help, "and never otherwise". Outside a Titan Engagement there are no Positions and no actions, so read literally the soldier can never mount there.
- **Options:**
  - (a) Outside a Titan Engagement, a comrade who takes part in the same procedure and is not Down helps, spending nothing, as Lift Comrade's outside row reads.
  - (b) Never outside a Titan Engagement; the soldier travels in the wagon.
- **Current handling (PROVISIONAL):** (a).
- **Why:** (a) is the pattern Chapter 4 already uses for every comrade act outside a fight, and 8-11 keeps Ride for the both-arms grade.
- **Simulator case:** none.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-25)
- **Decision:** (a), with the tests named: in a Skirmish a comrade taking part who is not Down spends their action, with no range test; anywhere else a comrade in the Squad who is not Down and is on the same Expedition, or in the Squad when none is under way, helps, spending nothing; with no such comrade the soldier is not mounted and travels as the both-legs grade's soldier does (OQ-162).
- **ADR:** none

### OQ-162: The drafters' round 3 questions

- **Type:** Rules gap (drafter questions: WP-C2's OQ-156 to OQ-161, WP-B's `DECIDER-QUEUE.md` item 26, WP-F's OQ-152 to OQ-155 and the coordinator's three open points on them)
- **Arose in:** WP-C2 while drafting the falling Titan, the corpse, the lost-limb grades, and the Burn rider; WP-B while drafting the Brawler list; WP-F while drafting Chapter 7. Chapter 2 Appendices 2A.1, 2A.3, 2A.5; Chapter 3 sections 3.2, 3.5, 3.12, 3.16; Chapter 4 section 4.5; Chapter 5 sections 5.2, 5.7, 5.10, 5.11; Chapter 7 sections 7.2, 7.4; `data/engagement/positions.yaml`, `engagement-flow.yaml`, `background-titans.yaml`, `titan-harm.yaml`; `data/harm/engagement-end.yaml`, `treat-injury.yaml`, `critical-injuries.yaml`; `data/gear/horses.yaml`; `data/character/talents.yaml`, `action-catalog.yaml`; `data/campaign/downtime.yaml`, `requisition.yaml`; `data/skirmish/skirmish.yaml`, `foes.yaml`; `data/mind/fear-rolls.yaml`; `tools/sim/engine.py`, `policy.py`.
- **Related:** OQ-122, OQ-126, OQ-136, OQ-137, OQ-138, OQ-146, OQ-151, OQ-152 to OQ-161.
- **Question:** Eleven readings the drafters could not settle from batches 7 and 8: what a corpse's Positions count for during the run-on; a soldier still Pinned when the fight ends; the heave count after a re-grounding; the lost-limb grades against Leap Clear and Heave; the Burn rider's "one unit of medical supplies"; a both-arms mount outside a Titan Engagement; a Heave Talent; WP-F's Expedition, Downtime, Requisition, and Skirmish readings; whether a Foe should Grapple; whether Downtime Actions need Catalog entries; whether Burn kills a Foe.
- **Options:** as each entry states.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-20 to 8-30)
- **Decision:** 8-20 (OQ-156, the reference amended to the corpse of the Titan that died last), 8-21 (OQ-157, confirmed, the scope fixed and the retreat's moves made consistent), 8-22 (OQ-158, amended: the count is cleared at a stand), 8-23 (OQ-159, Heave forbidden with both arms lost; the rows' penalty lists gain `heave` and `leap-clear`), 8-24 (OQ-160, confirmed), 8-25 (OQ-161, confirmed, the tests named), 8-26 (item 26: Grip Breaker names `heave`, no new Talent), 8-27 (OQ-152, all confirmed), 8-28 (OQ-153, the after-actions order amended; two Catalog option entries), 8-29 (OQ-154, all confirmed), 8-30 (OQ-155, Burn kills a Foe; no Foe Grapples). WP-C2's markers `PROVISIONAL (OQ-152)`, `(OQ-153)`, `(OQ-154)`, and `(OQ-156)` collide with WP-F's numbers and index OQ-156, OQ-157, OQ-158, and OQ-160; every marker of this round becomes a citation of its item.
- **ADR:** ADR-0018 (`## Amended`, batch 8, 8-30). ADR-0003 item 12 met by 8-28's entries, no text change.
- **Simulator case:** none new; 8-14 item 3's pin rows count the run-on, the Pinned who die at the end, and Grip Breaker's sensitivity row on Heave; the Skirmish probe reads `killed_by`.

### OQ-163: A retreat that never ends while a comrade lies Pinned under a corpse

- **Type:** Rules gap (the full simulator rerun after the round 1 packages)
- **Arose in:** `docs/reviews/simulator-report.md` (the Summary's retreat line; section 6.12, 29 fights at the safety cap over every full-fight run). Decision batch 8, 8-8, 8-9, 8-21; `data/engagement/engagement-flow.yaml` (`always_ends`, `ending`, `left_behind`); `data/engagement/background-titans.yaml` (`retreat.effects.moves`, options 3 and 4); `data/engagement/round.yaml` (`gm_tracker`); Chapter 5 sections 5.10 and 5.11; `tools/sim/engine.py` (`SAFETY_CAP`), `policy.py`.
- **Related:** OQ-87, OQ-126, OQ-146, OQ-157.
- **Question:** 29 fights of about 1.9 million reached the simulator's safety cap. In each, a Down, limb-pinned soldier lies under a corpse, no Titan is alive, and one comrade at In Reach stays under the retreat by option 4, Heaving or striking the pinning Body Part on every turn, while their Stress Responses cancel every success. Corpse heat never kills a limb-pinned soldier during the fight (Burn's lethal rows go to a `day` limit, and the arm and leg tables have no instant-death row), and the counts rise only on successes, so nothing ends the Titan Engagement and `always_ends` fails. What limit restores it, and what happens to the Pinned soldier when the stay ends?
- **Options:**
  - (a) The simulator agent's proposal: a soldier may take option 4 for a Pinned comrade on at most as many turns as the retreat clock has segments; after that only options 1 to 3 apply.
  - (b) While no Focus Titan is alive, options 3 and 4 are open for every comrade only on the retreat's first rounds, as many as the retreat clock has segments; then every standing soldier moves by option 1 or 2.
  - (c) Corpse heat kills a limb-pinned soldier during the fight.
  - (d) A round limit on the run-on that ends the Titan Engagement.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-32)
- **Decision:** (b). (a) leaves the loop open: a soldier past the count steps out by option 1 and back by option 3 and makes the same Heave or strike on each return, and a stay with a Down comrade by a cancelled Treat Injury loops the same way while the Pinned soldier keeps the run-on open. (b) is one field on the tracker's Engagement line (the round the retreat began), adds no number, and binds only the run-on retreat, since no Focus Titan dies in a retreat. When the stay ends the comrades walk out. A freeing on the way ends the Titan Engagement at once; otherwise no-soldier-standing ends it and every Pinned soldier dies under the body as a `left_behind` death (8-21). Down comrades who hold a Position live, since no Focus Titan is alive, and a limb-pinned soldier who is not Down runs on alone until corpse heat makes them Down. (c) reverses 8-8's day limit; (d) is a third ending test that skips the walk out.
- **ADR:** none
- **Simulator case:** the retreat's stay policy follows the limit and the order guard raises past it; a counter for the stays the limit ended and the Pinned who then died; the safety-cap count in the final rerun, expected 0.
- **Revised by batch 8 (8-34):** past the stay limit with no Focus Titan alive, a soldier whom a lost-limb grade forbids every move (the both-legs grade), and who is not Down, Pinned, or carried, is not standing for no-soldier-standing. They cannot hold the run-on open, and they live through the end steps (OQ-165).
- **Revised by batch 8 (8-36):** the stay limit for a comrade Pinned under a corpse binds in every retreat, whether or not a Focus Titan is alive, since a Focus Titan that enters during the run-on places everyone at Distant and is no clock. Down and Grabbed comrades keep (b)'s reading (OQ-166).

### OQ-164: Skirmish figures: deadlier human fights, a notch below Titan fights

- **Type:** Simulator target (reported figures, not ADR-0014 targets; owner decision after the full rerun)
- **Arose in:** `OWNER-DECISIONS.md`, *After the full rerun*, the Skirmishes item; `docs/reviews/simulator-report.md` section 6.14; the simulator agent's Foe sweep. Decision batch 7, 7-17; batch 8, 8-4, 8-30; `data/skirmish/foes.yaml`, `skirmish.yaml`; Chapter 7 section 7.4; `tools/sim/cases.py`, `report.py`.
- **Related:** OQ-143, OQ-145, OQ-155.
- **Question:** The owner wants Skirmishes somewhat deadlier and not Titan-level, about 0.02 to 0.04 deaths per squad fight. Today 4 Rookies against 3 Military Police troopers win 100% with 0.002 deaths, 1 Rookie against 1 trooper wins 74.6%, and a Bandit night ambush kills 0.016. Which figures does the probe report against, and which existing Foe values reach them?
- **Options:** the sweep's settings (8,000 Skirmishes a row, riders on, fixed seeds): (a) four troopers, Grit 4, Attack Dice 7 (0.024 deaths, a 97.6% win; the lone Rookie 56.2%); (b) (a) with the sabre at 3 (0.030, 96.0%, 53.0%); (c) three troopers, Grit 3, Attack Dice 8, sabre 3, pistol 3 (0.020, 98.1%, 45.5%); (d) (c) with Health 5 (0.030, 95.6%, 34.7%). A single changed field tops out near 0.005. The Bandit ambush reads 0.015 in every setting.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-33)
- **Decision:** Three reported figures, each range read exactly with the Cut and Pierce riders on: the reference Squad against a Military Police patrol, 0.02 to 0.04 deaths with a win of at least 90%; the Bandit night ambush with firebrands, 0.01 to 0.03 deaths; one Rookie against one trooper, a win of 50% to 70%. Values (a), recorded in `foes.yaml`: the trooper's `attack_dice` 7, `grit` 4, and `group_size` a fixed 4 (8-30 (a)'s D3+1 amended), so the probe's main row reads four troopers. The Bandit and the Garrison sentry are unchanged. (b)'s sabre would out-cut the Blade Set, and its margin is not needed at the full probe's count; (c) and (d) change four or five fields and put the lone Rookie below even. If the owner wants the ambush inside 0.02 to 0.04, the smallest change to measure is the Bandit's `attack_dice` 5, since that row's deaths are knife Cuts and a firebrand's Burn kills by the day. A Foe still never attacks a Down soldier (8-30 (c)).
- **ADR:** none (ADR-0014's amendment for 8-31 notes that these are reported figures)
- **Simulator case:** the Skirmish probe in the final rerun with its main row against four troopers, each figure reported beside its range, and the "without the riders" rows beside each.
- **Revised by batch 9 (9-14):** the trooper's Grit 4 stays for breaking; its Parley need reads a new `parley` value of 2, because Grit 4 had made a Parley against the Military Police succeed about 2% of the time even with a Push. The probe never Parleys, so its three reported figures are unchanged and no check runs.

### OQ-165: A soldier who cannot move keeps a run-on retreat open past the stay limit

- **Type:** Rules gap (WP-T, applying decision batch 8, 8-32)
- **Arose in:** decision batch 8, 8-32; `data/engagement/engagement-flow.yaml` (`always_ends`, `ending`, `no-soldier-standing`); `data/engagement/background-titans.yaml` (`retreat.effects.moves`, the stay limit); `data/harm/critical-injuries.yaml` (`lost_limb_riders`, `both-legs`, `moves`); Chapter 5 sections 5.10 and 5.11.
- **Related:** OQ-87, OQ-126, OQ-157, OQ-163.
- **Question:** 8-32 closes options 3 and 4 after the retreat's first rounds so that every standing soldier walks out. A standing soldier whose every move is forbidden, as under the both-legs grade (no move on foot, mounted, or by ODM Gear), can make neither option 1 nor option 2. They change nothing, still hold a Position, and so keep the no-soldier-standing test from being met. Beside a soldier Pinned under a corpse they can Heave, strike the pinning Body Part, or treat the Pinned soldier's corpse-heat Critical Injuries on every turn, with no limit. That is the loop OQ-163 closed for everyone else. A soldier who has also lost both arms can change nothing at all, and since corpse heat kills only by the day, the Titan Engagement then never ends while the Pinned soldier lives. A comrade can carry them out only by choosing Lift Comrade before the last comrade leaves. How does `always_ends` hold?
- **Options:**
  - (a) Past the stay limit, with no Focus Titan alive, a soldier who is not Down, Pinned, or carried and can make no move of any kind is not standing for no-soldier-standing, as a body-pinned soldier is not (8-20). They keep their Position and their turns, and when the Titan Engagement ends they live and go through the end steps, as a Down comrade beside a corpse does (8-21).
  - (b) As (a), but the soldier dies left behind with the Pinned.
  - (c) Past the stay limit, the leaving comrades carry such a soldier out without a Lift Comrade action.
  - (d) No change, and `always_ends` names the exception.
- **Provisional choice:** (a). It is marked `PROVISIONAL (OQ-165)` in `engagement-flow.yaml` (`ending`, the `no-soldier-standing` test's `past_the_stay_limit`, and `always_ends`) and in Chapter 5 section 5.11.
- **Why:** (a) is the smallest reading that makes `always_ends` true. It reuses 8-20's "not standing" test and 8-21's reading that only the Pinned die when no Focus Titan is alive. It adds no number, and it binds only a state no reference build reaches, since lost limbs are unmeasured (8-13). Its cost is 8-32's cost for every comrade: once the others have gone, a soldier with no legs who could still Heave no longer holds the fight open for the comrade under the body. Under (a) that soldier still acts, so treating a limb-pinned comrade can delay the corpse heat that puts them Down but not prevent it, because the heat crosses off a box every turn and only a success gives one back. (b) kills a soldier no Titan threatens, which 8-21 refuses for a Down comrade beside a corpse. (c) moves a soldier with no action spent, which the lift rule of 5-13 and 8-18 do not allow. (d) leaves the rerun's loop open for a rarer state.
- **Simulator case:** none. Lost limbs are unmeasured (8-13) and no reference build loses both legs; the final rerun's safety-cap count, expected 0, stays the check.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-34)
- **Decision:** (a), with the test named by the grade. In a retreat with no Focus Titan alive, from the first round past the stay limit, a soldier whom a lost-limb grade forbids every kind of move (today the both-legs grade), and who is not Down, Pinned, or carried, is not standing for no-soldier-standing. It is checked as that round begins, before its wings step, and after every event from then on. A soldier who loses a single turn's move is not caught. They keep their Position, their turns, and their actions. A comrade who shares their Position may still lift them at their consent and carry them out by option 1 or 2 (5-13), and no rule obliges the lift. They live through the end steps, and every Pinned soldier dies under the body (8-21). (b) kills a soldier nothing threatens and would make being Down safer than being awake. A required lift needs a carrier and consent that no rule guarantees, and would still need this fallback. (c) and (d) fall for the reasons in *Why*. The markers `PROVISIONAL (OQ-165)` in `engagement-flow.yaml`, Chapter 5 section 5.11, and `tools/sim/report.py` become citations of 8-34.
- **ADR:** none
- **Revised by batch 8 (8-36):** the reading also applies past 8-36's limit while a Focus Titan is alive, and `left_behind` then applies as written (OQ-166).

### OQ-166: The round 1 final review's eight decisions

- **Type:** Rules gap (the two final reviews of the round 1 change, triaged in `docs/playtest/feedback/round-1/REVIEW-FIX-PLAN.md` section 2)
- **Arose in:** `docs/reviews/feedback-round-1-final-review-1.md` and `feedback-round-1-final-review-1-astra.md`, findings R01, R03, R05, R06, R07, R14, R21, R34, and R43. Chapters 2, 3, 5, and 7; `data/expedition/legs.yaml`, `hazards.yaml`; `data/engagement/background-titans.yaml`, `engagement-flow.yaml`, `titan-harm.yaml`; `data/character/squadmates.yaml`, `talents.yaml`; `data/campaign/downtime.yaml`; `data/skirmish/skirmish.yaml`; `data/mind/fear-rolls.yaml`; `data/harm/effect-types.yaml`; `tools/sim/engine.py`.
- **Related:** OQ-31, OQ-36, OQ-136, OQ-139, OQ-141, OQ-146, OQ-152, OQ-163, OQ-165.
- **Question:** Eight gaps the triage could not close without a ruling: an Expedition with every living soldier Down (D1); a Focus Titan that enters during the run-on (D2); a retreat from a Titan Engagement the Night table begins (D3); Recruit under the playtest configuration (D4); once-per limits inside a nested procedure (D5); the order of one event's Fear Rolls (D6); a pinned limb lost to corpse heat (D7); Talents without guardrail 8's default limit (D8). Also, whether the fixes need another full simulator rerun.
- **Options:** as `REVIEW-FIX-PLAN.md` sections 2 and 5 state.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 8*, 8-35 to 8-42)
- **Decision:** Every recommendation, as the owner chose: 8-35 (D1, the roll fails), 8-36 (D2, limit per pin, with 8-34's reading past it), 8-37 (D3, fall back overnight), 8-38 (D4, a data row), 8-39 (D5, its own use), 8-40 (D6, snapshot), 8-41 (D7, still pinned), 8-42 (D8, the default on the three). Simulator option (b): no full rerun. 8-40's engine change is checked in memory on the Medium reference start, the first-Titan-Engagement row, and the Abnormal's bar, and every changed file gets a snapshot note. R43's erratum is recorded under 8-3.
- **ADR:** ADR-0009 (`## Amended`, 8-35 and 8-37); ADR-0014 (`## Amended`, 8-39 and 8-40).
- **Simulator case:** the in-memory checks of 8-40; one full rerun only if a checked row moves beyond sampling or the Medium band reads past 0.08.

### OQ-167: Lethality drift when GMs harden or frame Titan Engagements

- **Type:** Simulator target (a playtest measurement for the target B retune; nothing tuned now)
- **Arose in:** decision batch 9, 9-4, 9-15, 9-17; `docs/research/gm-judgment/OWNER-DECISIONS.md` (answer 1); `docs/research/gm-judgment/difficulty-mechanics.md` section 2.5 and section 7; `docs/research/gm-judgment/ripple-audit.md` E4, E14; ADR-0014 (`## Amended`, batch 9); ADR-0024 limit 16.
- **Related:** OQ-132, OQ-140.
- **Question:** The owner opened the Titan Engagement to the GM's difficulty, read as Circumstances on the soldiers' pools with Standard as the default (9-4), and to framing the start (9-15). A Hard dodge loses 14.5 points of success and 12 points of Push rate for the reference Rookie (research section 2.5), and a start framed with Large Titans and Background Titans plays above the setup mix every band reads. Every ADR-0014 figure is defined at Standard with no rulings. How far does play drift from the baseline, and does the retune (OQ-140) need to price it?
- **Options:** (a) log and read: the playtest tags every non-Standard step named in a Titan Engagement, the roll it was named on, and every framed start off the setup table, beside every ruling-caused death, Critical Injury, and Scar; the retune reads rules deaths and ruling deaths apart. (b) Sensitivity rows now: the reference Squad with every soldier roll at Hard, with every dodge at Hard, and with framed starts, reported beside the targets. (c) No Circumstances on the dodge inside a Titan Engagement.
- **Status:** Open, (a) now and (b) at the retune (decision batch 9, 9-17; ADR-0014 as amended). (c) is not taken: the owner said everywhere, and rain that reaches the Fly reaches the dodge made with the same gear.
- **Decision:** pending the playtest.
- **ADR:** ADR-0014 (`## Amended`, batch 9); ADR-0024.
- **Simulator case:** the sensitivity rows of (b), added with the target B retune; no rerun before the playtest.
- **Revised by batch 9 (9-37):** (a)'s log also tags every route a Mission Brief set (the number of Legs, each Leg's Distance Band and Post, the Hard Ride days, and the Depots) and marks an interim route as rolled, so the retune reads authored Expeditions apart from rolled ones as it reads framed starts apart from the setup table (OQ-179).

### OQ-168: Called rolls, roll proliferation, and the Stress economy

- **Type:** Rules gap (a playtest test of decision batch 9, 9-1 and 9-2)
- **Arose in:** decision batch 9, 9-1, 9-2, 9-5; `docs/research/gm-judgment/ripple-audit.md` E1, E4, E5; `docs/research/gm-judgment/difficulty-mechanics.md` section 5, item 3; ADR-0004; ADR-0024 limits 9, 14, and 17.
- **Related:** OQ-04, OQ-167.
- **Question:** Called rolls were never measured. Each one can be Pushed, and a Push is 1 Stress; Help and a plus step can reach the cap on every called roll so that failure stops meaning anything; a Squad of four can chain attempts at one obstacle. The brakes are closed (stakes named first, no roll without risk, one attempt per changed situation, one cost per failed roll, the cap of 4). Are they enough, and does Stress carried out of social and field scenes into the next Titan Engagement move the fight-start Stress the Grab cells and the deaths bands assume (Rookie 1, Veteran 2)?
- **Options:** (a) log and read: the playtest counts called rolls per session, their Circumstances, how many were Pushed, the Stress each soldier carries into each Titan Engagement, and every cost paid from the menu. (b) A hard once-per-scene limit on called rolls per soldier. (c) A written cost for Help on a called roll (the helper's time or 1 Stress).
- **Status:** Open, (a) (decision batch 9, 9-17).
- **Decision:** pending the playtest.
- **ADR:** ADR-0024.
- **Simulator case:** none; if fight-start Stress drifts, the Grab cells and the deaths bands are re-read at the observed Stress as a sensitivity row at the retune.

### OQ-169: GM-called Fear Rolls as a Scar faucet

- **Type:** Rules gap (a playtest test of decision batch 9, 9-6)
- **Arose in:** decision batch 9, 9-6; `docs/research/gm-judgment/OWNER-DECISIONS.md` (answer 6, "left to GM discretion"); `docs/research/gm-judgment/ripple-audit.md` E11; `data/mind/fear-rolls.yaml` (`gm-horror`); ADR-0008; ADR-0024 limit 1.
- **Related:** OQ-139, OQ-168.
- **Question:** Fear rows at high totals give Scars, five Scars retire a soldier, and each Scar raises minimum Stress (ADR-0008). The owner left the once-per-scene cap to discretion, so it is advice in the GM's Guide and not a rule. The closed brakes are the trigger's weight (as horrifying as a listed trigger), the Titan Engagement's closed list, and the Drive shrug-off. Does GM-called horror outside fights add Scars at a rate the veteran spiral was not designed for?
- **Options:** (a) log and read: the playtest counts every `gm-horror` roll, its total, and any Scar it gave, beside the listed triggers' rolls. (b) Make the once-per-scene limit a rule. (c) `gm-horror` rolls read one row lower on the table.
- **Status:** Open, (a) (decision batch 9, 9-6).
- **Decision:** pending the playtest.
- **ADR:** ADR-0024 (limit 1).
- **Simulator case:** none; the Fear table and every measured trigger are unchanged.

### OQ-170: Phase 2 content under rulings: Pursue a Lead, table-made Abnormals and Foes

- **Type:** Rules gap (Phase 2; deferred by decision batch 9, 9-20)
- **Arose in:** decision batch 9, 9-7, 9-16, 9-20; `docs/research/gm-judgment/ripple-audit.md` E18, E20, E21; ADR-0016 (`## Amended`, batch 9); `CONTEXT.md` (Downtime Action: Train, Investigate, Contribute to Research wait for Phase 2).
- **Related:** OQ-153, OQ-154.
- **Question:** Three things the audit recommended and the batch deferred. A Downtime Action, working name *Pursue a Lead*, that spends the soldier's action on a called-roll scene inside the Walls with outcomes from a short menu (an Intel Question answered truthfully, a named contact, or Circumstances on the Squad's next Requisition), the playtest stand-in for Investigate. A GM-built Abnormal in the Chapter 5 format with the closed effect list and ladder tests, played as unmeasured and marked so. A GM-built Foe kind on the Foe row fields, Attack Dice and Guard no higher than the trooper's 7 and 4. Which of these ships in Phase 2, and in what order beside the Titans-before-gear order ADR-0016 sets?
- **Options:** (a) Pursue a Lead with the Downtime rules; Abnormals with the Phase 2 Titans; Foe kinds with the Skirmish rewrite. (b) Pursue a Lead before the second playtest as a playtest rule. (c) None until the full Downtime rules exist.
- **Status:** Open (Phase 2).
- **Decision:** pending.
- **ADR:** ADR-0016 (`## Amended`, batch 9).
- **Simulator case:** none; each is marked unmeasured until a target reads it.

### OQ-171: The website's dice tray and Compendium under the Circumstances ladder

- **Type:** Rules gap (the site is the owner's separate work; out of every drafting package)
- **Arose in:** decision batch 9, 9-2, 9-12, 9-20; `docs/research/gm-judgment/ripple-audit.md` E25; `docs/research/gm-judgment/difficulty-mechanics.md` section 8 (Site); `site/src/lib/dice-rules.ts` (rolls any pool from 0 to 12 base dice with no Bonus Dice cap or penalty logic), `site/src/lib/shared-data.ts` (loads the Action Catalog for Compendium cards); ADR-0020.
- **Related:** OQ-167.
- **Question:** The site's dice rules encode the pool and the Push and will need the ladder: the floor of 1 base die, the cap of 4, a Circumstances stepper on the roll button, and the `when_called` value in the Action card renderer. The rules-of-play page pins `01-core-rules.md` as its source, so the build flags it as needing resync after the batch, by design (ADR-0020). When does the site take the ladder, and does the GM's Guide page on rulings come with it?
- **Options:** (a) After the packet's Version 3 and the owner's review, in the owner's site work: resync `rules-of-play.mdx`, add the ladder to `dice-rules.ts` with the floor and the cap, add a `gm/` page on rulings. (b) Before the first playtest. (c) Leave the tray without the ladder (a pool is a pool) and add only the floor.
- **Status:** Open (owner's site work; no drafting package touches `site/`).
- **Decision:** pending the owner.
- **ADR:** none (ADR-0020 to ADR-0023 unchanged).
- **Simulator case:** none.

### OQ-172: Needs of 2 or more on small pools: the Sneak at Watch 2 and the Parley values after the playtest

- **Type:** Rules gap (a playtest test of decision batch 9, 9-3 and 9-14)
- **Arose in:** decision batch 9, 9-3, 9-14; `docs/research/gm-judgment/difficulty-mechanics.md` section 2.6 (the Sneak at Watch 2 is 37.7% Pushed for an Agility 3 soldier who cannot be Helped; the Parley against the Military Police was 2.0%); `data/skirmish/foes.yaml` (`parley`, `watch`); `data/skirmish/skirmish.yaml`.
- **Related:** OQ-155, OQ-164.
- **Question:** Needs stay in the fiction and the GM never changes one (9-3). 9-14 fixed the Parley by giving each Foe kind its own `parley` value and left Watch and every other closed need as written. The research shows a need of 2 costs about 4 dice at the Sneak's pool, and the Sneak for the Ambush cannot be Helped. Do the trooper's `parley` 2 and the sentry's and trooper's Watch 2 sit where the owner wants after play, and should the Sneak be Helpable by one comrade?
- **Options:** (a) log and read: the playtest records every Sneak for the Ambush and every Parley, the need, the pool, the Push, and the outcome. (b) Watch 1 for the sentry. (c) Help on the Sneak by one comrade who is not Down, spending nothing. (d) The trooper's `parley` at 3 if the owner wants the Military Police close to immovable.
- **Status:** Open, (a) (decision batch 9, 9-14).
- **Decision:** pending the playtest; (d) is the owner's if they want the Military Police to stand firm (`IMPLEMENTATION-PLAN.md`, *Owner questions*).
- **ADR:** none.
- **Simulator case:** none; the Skirmish probe never Sneaks or Parleys.

### OQ-173: The passive roll and a plus step of Circumstances

- **Type:** PROVISIONAL (WP-G0: Chapter 1, section 1.1, item 5; `data/core/dice-pool.yaml`, `roll_exceptions`, `passive-roll`)
- **Arose in:** decision batch 9, 9-2 and 9-10; `docs/research/gm-judgment/IMPLEMENTATION-PLAN.md` (WP-G0 gives the `passive-roll` row `bonus_sources_excluded: all`); ADR-0024, limits 14 and 16.
- **Related:** OQ-168.
- **Question:** 9-10 builds a passive roll's pool "with the Circumstances the GM names to themselves; no Bonus Dice", and the plan gives its row `bonus_sources_excluded: all`. 9-2 makes each plus step (Easy, Routine, Effortless) a Bonus Dice source. Does a passive roll the GM names at Easy or better gain the step's dice?
- **Options:** (a) Every step applies in full: a plus step adds its dice, and every other Bonus Dice source stays excluded. (b) Only Standard and the minus steps apply; a plus step adds nothing to a passive roll. (c) A passive roll takes no Circumstances.
- **Provisional choice:** (a). The row reads `bonus_sources_excluded: all` with `bonus_sources_allowed: [circumstances]`, and Chapter 1 section 1.1 item 5 says so.
- **Why:** 9-10 names the Circumstances as part of the passive pool without limiting the step, and 9-2 item 5 gives a step to every attribute roll it does not exclude. "No Bonus Dice" reads as the sources a roller declares (Help, Openings, and the rest), which a soldier who does not know they are rolling cannot declare; the plus step is the one source the GM names. Reading (b) would make an obvious clue no easier to notice than an ordinary one, which is what the plus steps express.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 9*, 9-21)
- **Decision:** (a). A passive roll takes its Circumstances on the whole ladder: a plus step adds its dice as the `circumstances` Bonus Dice source, and no other Bonus Dice source applies. 9-10's "no Bonus Dice" means the sources a roller declares. The markers in Chapter 1 section 1.1 item 5 and `dice-pool.yaml` become citations of 9-21.
- **ADR:** none (ADR-0024, limit 14 allows the passive roll under every option).
- **Simulator case:** none; the simulator makes no passive roll.

### OQ-174: A failed threat, and Size Up, once the Parley reads its own value and Foes can be directed

- **Type:** Rules gap (a reading of decision batch 9, 9-7 and 9-14, for Chapter 7 section 7.4)
- **Arose in:** WP-G4 drafting; decision batch 9, 9-7 and 9-14; `data/skirmish/skirmish.yaml` (`grit.failed_threat`, `parley`, `size_up`); `data/skirmish/foes.yaml` (`gm_rulings`).
- **Related:** OQ-155, OQ-164, OQ-172.
- **Question:** (1) A failed Parley made as a threat raised the group's Grit by 1 "for breaking and for later Parleys". 9-14 moved the Parley need from Grit to each Foe kind's `parley` value and 9-7 keeps the +1 Grit, but neither says whether a failed threat still makes later Parleys harder. (2) Size Up on a Foe group states what each Foe will do on the group's next card "under the foe rule as things stand". Under 9-7 the GM may direct a Foe with a reason, so the answer can be untrue if the GM already means to direct one.
- **Options:** (1a) a failed threat raises the group's Grit and its Parley value by 1 each; (1b) it raises Grit only, and later Parleys are unchanged. (2a) Size Up also states what a Foe the GM already means to direct will do, and the reason; (2b) Size Up states the foe rule's pick only, and a later direction may differ.
- **Provisional choice:** (1a) and (2a).
- **Why:** (1a) keeps what a failed threat did before 9-14, and keeps 9-14's own claim that nothing changes for a Bandit or a Garrison sentry, whose Parley value equals their Grit. (1b) would quietly remove a cost from threats. (2a) keeps Size Up truthful, as Chapter 7 section 7.5 requires, and fits 9-7's rule that a reason the table cannot hear is not a reason. (2b) would make Size Up a guess against a GM who directs.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 9*, 9-22)
- **Decision:** (1a) and (2a). A failed threat in a Skirmish raises the group's Grit and its Parley value by 1 each for the rest of that Skirmish. On a successful Size Up the GM states the foe rule's pick, or a direction the GM already means with its reason, and what the GM states holds for that Foe's turn on the next card unless something that happens after the Size Up changes it; the GM never directs on that card for a reason held back. The markers in Chapter 7 section 7.4 and `skirmish.yaml` become citations of 9-22.
- **ADR:** none (ADR-0018 as amended and ADR-0024, limit 8, allow every option).
- **Simulator case:** none; the Skirmish probe never Parleys or Sizes Up.

### OQ-175: A retreat from a Titan Engagement that a Waypoint scene begins

- **Type:** Rules gap (a reading of decision batch 9, 9-15, for Chapter 7 section 7.1)
- **Arose in:** WP-G4 drafting; decision batch 9, 9-15; ADR-0009 (`## Amended`, batch 9); `data/expedition/legs.yaml` (`day.waypoint_scene`).
- **Related:** OQ-141, OQ-152.
- **Question:** A Waypoint scene may begin a Titan Engagement by the fiction (9-15, item 3). Chapter 7 says where the Squad falls back after a retreat from a Titan Engagement that a Leg's hazard row or the Night table begins, but not from one that a Waypoint scene begins.
- **Options:** (a) it falls back as one begun by a hazard row of the Leg that reached this Waypoint: to the Waypoint that Leg started from, riding that Leg again with a new Leg roll and a new hazard; (b) the Squad stays at the Waypoint and the scene ends, with no Leg ridden again; (c) the GM's framing of the scene names where it falls back.
- **Provisional choice:** (a).
- **Why:** ADR-0009 as amended in batch 7 makes a retreat fall back to the previous Waypoint and ride the Leg again, and batch 9 leaves the guarantee and the ride's engine as written. (a) applies that rule unchanged. (b) would make a retreat inside a scene cheaper than the same retreat on the Leg. (c) would put a retreat's cost in a ruling after the fight has begun.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 9*, 9-23)
- **Decision:** (a). The scene ends, and the Squad falls back as from a Titan Engagement begun by a hazard row of the Leg that reached this Waypoint: it rides that Leg again from step 1, counted among the day's Legs, and step 7 applies again on arrival, including a Depot's Standard Issue. The markers in Chapter 7 section 7.1 and `legs.yaml` become citations of 9-23.
- **ADR:** ADR-0009 (as amended; the guarantee unchanged under every option).
- **Simulator case:** none; no Expedition figure is measured before the playtest.

### OQ-176: Gear Dice on a called roll made with an attribute alone

- **Type:** Rules gap (a reading made while applying decision batch 9, WP-G1)
- **Arose in:** decision batch 9, 9-1, 9-9, 9-12, 9-16; Chapter 2, section 2.9 (*Rolls called by attribute*); `data/character/action-catalog.yaml` (`uncatalogued_actions`, `rolls_called_by_attribute`).
- **Related:** OQ-27, OQ-35, OQ-168.
- **Question:** A rule that calls for an attribute roll without naming a Catalog entry gives Gear Dice only from a gear item that rule names. When the GM calls a roll on an attribute alone because no `when_called` entry fits, may the ruling name a rated gear item the act plainly uses (a tool kit, ODM Gear), which would then add its Gear Dice and wear on a Push?
- **Options:** (a) No: a ruling is not a rule that names a gear item, so the roll takes no Gear Dice, and any item that helps, rated or improvised, is part of its Circumstances. (b) Yes: the GM may name one rated item the act uses; it adds its Gear Dice and wears as on any roll. (c) The GM names the closest entry that lists the item, even an entry not marked `when_called`.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 9*, 9-24)
- **Decision:** (a). A called roll made with an attribute alone takes no Gear Dice. A gear item that helps counts toward its Circumstances, as any object does, and cannot be worn by a Push on that roll. Gear Dice reach a called roll only through the entry the GM names (`fly` for ODM Gear, `ride` for the horse). Chapter 4 section 4.1 and `items.yaml` gain one sentence each, and the markers in Chapter 2 section 2.9 and `action-catalog.yaml` become citations of 9-24. (b) lets a ruling add dice beside the one-step ladder, and (c) reopens the entries 9-12 kept out of called rolls.
- **ADR:** ADR-0024 (limits 9 and 16); ADR-0004; ADR-0006.
- **Simulator case:** none; called rolls are not measured (9-17).

### OQ-177: Damage a ruling names that brings a wounded soldier to 0 Health

- **Type:** Owner question (the GM judgment review round 1, Opus M4; triaged in `docs/research/gm-judgment/REVIEW-FIX-PLAN-round-1.md`)
- **Arose in:** `docs/reviews/gm-judgment-review-1.md`, M4; decision batch 9, 9-5; `docs/rules/03-harm-and-mind.md`, section 3.1 (*Harm a ruling names*; *Losing Health*); `data/harm/health.yaml` (`harm_kinds`, `damage`, `procedure` and `by_ruling`); ADR-0005 (as amended); `docs/research/gm-judgment/OWNER-DECISIONS.md`, answer 5.
- **Related:** OQ-167, OQ-168.
- **Question:** The owner said a failure's cost is never a direct Critical Injury (answer 5), and 9-5 read that as "only through Health": damage of 1 to 3 reaches the Critical Injury tables only at 0 Health. For a soldier at 3 current Health or less, which describes most soldiers after one fall or one Skirmish, the menu's damage makes the failed called roll itself put them Down with a Critical Injury rolled at once, which can be lethal and start a Death Roll's time limit. Example: Brandt, at 2 current Health after a Bandit ambush, fails a called Endure to carry a civilian across a ford, staked at 2 Crush damage, and is Down with a Crush Critical Injury. Is that within "never a direct Critical Injury"?
- **Options:** (a) Damage a ruling names never takes current Health below 1: it stops at 1, so it never makes a soldier Down or inflicts a Critical Injury. (b) Damage a ruling names that brings Health to 0 makes the soldier Down with no immediate Critical Injury (an ADR-0005 amendment). (c) Keep the rule; the GM states the soldier's current Health with the stakes, so the table sees the risk before the dice, and the playtest logs every such Critical Injury. Under each option the damage of a fall a ruling names is treated as that damage is, unless the owner says otherwise.
- **Status:** Decided by the owner on 2026-09-16 (see DECISIONS-2026-09-14.md, *Batch 9*, 9-35).
- **Decision:** (c). The rule stands: damage a ruling names that brings current Health to 0 makes the soldier Down with the immediate Critical Injury that all damage gives. When a called roll's stakes name damage or a fall, the GM states the soldier's current Health aloud with the stakes, so the table sees before the dice whether a failure can put the soldier Down. The playtest log (9-17) tags every Critical Injury that damage a ruling named caused, and the question is read again at the retune as a playtest question.
- **ADR:** none amended. Options (a) and (b) would have amended ADR-0005; under (c) its Health box paragraph applies as written, and its batch 9 review paragraph records the answer in place of its OQ-177 sentence. ADR-0024, limit 17, is unchanged.
- **Simulator case:** none; rulings are not measured (9-17).

### OQ-178: The GM judgment review round 1's decisions

- **Type:** Rules gap (the two round 1 reviews of decision batch 9, triaged in `docs/research/gm-judgment/REVIEW-FIX-PLAN-round-1.md`)
- **Arose in:** `docs/reviews/gm-judgment-review-1.md` (Opus: C1, M1, M2, M3, M5, M6, M7, M8, m5, m7 to m12) and `docs/reviews/gm-judgment-review-1-astra.md` (Astra: C1, M1, M2). Chapters 1, 2, 3, 4, 5, and 7; `CONTEXT.md`; `data/core/`; `data/character/action-catalog.yaml`; `data/mind/fear-rolls.yaml`; `data/gear/squad-supply.yaml`, `falls.yaml`; `data/engagement/engagement-setup.yaml`; `data/skirmish/skirmish.yaml`, `foes.yaml`; `data/expedition/legs.yaml`, `hazards.yaml`; ADR-0005; ADR-0024.
- **Related:** OQ-167, OQ-168, OQ-169, OQ-172, OQ-175, OQ-177.
- **Question:** The gaps the triage could not close without a ruling: when a Reaction's Circumstances are named (C1); a lasting step meeting a further condition (M6); a matched tracked value bypassing the model entry, and which entries may be a model (M5, Astra C1); what Help and a retry cost and when it falls (M2, Astra M1); found supplies per roll against per place (M1); an extreme fall named by a ruling (M3); what success gives (M7); whether a passive roll is a called roll (M8); a Waypoint-scene retreat with no Leg slot left that day (Astra M2); and seven minor readings (a shared act, "Hard", the Straggler's Endure, a lone Foe running, the Parley note's figures, `gm-horror` after a staked outcome, framed Background Titans).
- **Options:** as the review files and the plan's section 2 state.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 9*, 9-25 to 9-34, and erratum 2 under 9-14)
- **Decision:** 9-25 (a Reaction takes the step in force when the attacker's card comes up); 9-26 (one step per roll, weighed, never added; "every ODM roll" is every roll whose Gear Dice come from ODM Gear); 9-27 (in a fight the steps are not used; a model entry is an `action` the soldier could take there; only a Nape strike taken as written kills; taking cover is a move); 9-28 (Help's and a retry's cost is time or position only, falling when taken on); 9-29 (a place yields Squad Supply to one called search); 9-30 (a ruling's fall is low or high); 9-31 (success never gives a gear item, Stress relief, healing, a Commendation, a Research Point, or Faction Standing); 9-32 (a passive roll is not a called roll and has no stakes); 9-33 (the next Leg slot, or camp at the fallback and ride as the next day's first); 9-34 (the seven minor readings). Opus M4 is OQ-177, for the owner.
- **ADR:** ADR-0024 (limits 9, 14, 16, 17; `## Amended`); ADR-0005 (`## Amended`, 9-30).
- **Simulator case:** none; no closed number changes (9-17), and no edited YAML field is read by a simulator guard.

### OQ-179: A called roll inside a fight, and the bounds of a Mission Brief's route

- **Type:** ADR question (the two findings of the GM judgment review round 2 that needed a ruling; the round's other findings are the Opus decider's)
- **Arose in:** `docs/reviews/gm-judgment-review-2.md` (Opus M1 and M3). Chapter 1 section 1.1 (items 1, 4, and the Help sentence), 1.3, 1.8, 1.9; Chapter 2 section 2.9 and its *Acts* paragraph; Chapters 5 and 7's Rulings paragraphs; Chapter 7 sections 7.1 (*The route*, *Waypoint scenes*) and 7.4 (*What a soldier can do*); `data/core/dice-pool.yaml`, `circumstances.yaml`; `data/character/action-catalog.yaml`; `data/skirmish/skirmish.yaml`; `data/expedition/route.yaml`, `hazards.yaml`; ADR-0009; ADR-0014; ADR-0024.
- **Related:** OQ-141, OQ-167, OQ-168, OQ-178.
- **Question:** (M1) Batch 9 never said whether a called roll can be made inside a Titan Engagement or a Skirmish, and four rules answered differently: item 1 named no context, item 4 and the Help sentence assumed one exists in a fight, Chapter 2 section 2.9 split the called roll into *Outside a fight* and the improvised act into *In a fight*, and Chapter 7's Skirmish action list was closed against one. An act no entry of kind `action` could model (hauling a granary's doors shut so the Titan cannot follow the civilians) had no answer, and the stakes menu, one cost per failed roll, 9-35's Health statement, Help, retries, and the fall band each read differently by the answer. (M3) The Brief the GM writes sets three of the Leg Hazard roll's five modifiers (the Distance Band, the Post, the Pace), which Chapter 1 item 6 and Chapter 7's *Decided* note listed as applied as written, and nothing bounded the route's Legs or how many Waypoints were Depots, which ADR-0009's attrition rests on; nor did 9-17's log tag an authored route.
- **Options:** (M1) (a) a called roll is an outside-a-fight instrument, and an act no entry can model in a fight happens, cannot be done, or is described with no roll; (b) a called roll may be made in a fight for an act no entry of kind `action` could model and that changes nothing the fight tracks, spending the action, with Help as the fight gives it, a low or high fall, and a time-or-position cost and a success that touch nothing the fight tracks. (M3) (a) reword the closed sentences to name the amounts and their application as closed and the route's values as Command's; (b) bound the route to the interim route's envelope; (c) tag the framed route in the playtest log; in any combination.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 9*, 9-36 and 9-37)
- **Decision:** (M1) option (b), 9-36: the model entry is tried first, so an act whose effect any entry has is an improvised act; a called roll in a fight is the residue, for the act that lives in the fiction beside the fight; it spends the action, Help on it is the fight's Help with no cost the GM names, its fall is low or high and the Height steps never raise it, its time or position cost and its success touch nothing the fight tracks, it is tried again on a later turn, and Chapter 2's Drive sentence stands as written. (M3) all three, 9-37: the closed sentences read "their rolls and their modifiers' amounts, which the route, the night camps made, the Leg roll, and the flare decide"; a Brief's route has 4 to 6 Legs, no Leg deeper than the interim route gives its place, and at most one Depot, never the gate, with Posts and Hard Ride days Command's under the day rules; the playtest log tags every route a Brief set and marks an interim route as rolled.
- **ADR:** ADR-0024 (limits 7, 9, 17; `## Amended`, 9-36); ADR-0009 (`## Amended`, 9-37); ADR-0014 (`## Amended`, 9-37).
- **Simulator case:** none; no closed number changes (9-17), no Expedition figure is measured before the playtest, and a called roll in a fight reaches nothing the simulator measures.

### OQ-180: The GM judgment review round 2's remaining decisions

- **Type:** Rules gap (the findings of the GM judgment review round 2 other than the two OQ-179 covers, triaged in `docs/research/gm-judgment/REVIEW-FIX-PLAN-round-2.md`)
- **Arose in:** `docs/reviews/gm-judgment-review-2.md` (Opus: C1, M2, m1 to m9) and `docs/reviews/gm-judgment-review-2-astra.md` (Astra: M1, and m1, already fixed). Chapter 1 section 1.1; Chapter 2 section 2.9; Chapter 4 sections 4.6 and 4.10; Chapter 5 section 5.4; Chapter 7 sections 7.1 and 7.4; `data/core/circumstances.yaml`, `dice-pool.yaml`; `data/gear/falls.yaml`, `squad-supply.yaml`; `data/engagement/titan-harm.yaml`; `data/character/action-catalog.yaml`; `data/skirmish/skirmish.yaml`, `foes.yaml`; `data/mind/fear-rolls.yaml`; `data/expedition/legs.yaml`, `hazards.yaml`; `data/campaign/downtime.yaml`; `tools/render/render.py`; ADR-0024, limit 17.
- **Related:** OQ-141, OQ-167, OQ-168, OQ-169, OQ-177, OQ-178, OQ-179.
- **Question:** (C1) Inside a Titan Engagement, Chapter 4's *Height* procedure still read a Position for a fall a ruling names and then raised the band, so the fall reached extreme, against 9-30 and ADR-0024 limit 17, whose cap has no exception for a fight. (M2) An improvised act modelled on the Nape strike had no defined outcome when its successes reached the Nape Depth, since 9-27 removed the kill and left the threshold band empty, so rolling better paid worse. (Astra M1) After a Waypoint-scene retreat with no Leg slot left, the Squad camps at the Waypoint the last Leg started from, but the Night procedure read the abandoned Waypoint's terrain for the Anchor Rating, and a second retreat sent the Squad where it already was; nothing said whether the Night modifier keeps the last ridden Leg's Distance Band, or what became of the queued repeat. (m1 to m9) Nine smaller readings: what "a place" is for a called search; the payer clauses 9-34 item 1 lost in application; how far "any roll a Leg Hazard or Night row calls for" reaches; where the ladder's hazard timing lives; the Skirmish's model entry and the options it wrongly offered; the infirmary roll's comment marker; a table-made Foe kind that appears in no chapter; `gm-horror` in a Skirmish; and 9-35's Health sentence, absent where a GM stakes a fall.
- **Options:** as the review files state, each finding with two or three. For C1: (1) a general rule-or-ruling step in *Height*; (2) a carve-out for a ruling's fall only; (3) reverse 9-30, which needs the owner. For M2: (1) the act creates Openings as a strike that falls short does; (2) take the Nape strike out of the model set; (3) it produces nothing at the threshold. For Astra M1: record the camp's Waypoint separately, or write a fallback-camp exception into the Night procedure.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 9*, 9-38 to 9-41)
- **Decision:** (C1) option (2), 9-38: *Height* gains a first step that stops at a band already named, so a fall a ruling names is low or high and never extreme in a Titan Engagement as well as outside one, while a knock loose, letting go, and a release from a lift, which name no band, still take the steps. (M2) option (1), 9-39: an act modelled on the Nape strike is resolved as a strike that falls short whatever its successes, 1 Opening per success with Relentless adding 1 more and the flag set, and successes that reach the Nape Depth create their Openings and nothing else. (Astra M1) 9-40: the camp's own Waypoint sets the Anchor Rating of a Titan Engagement the Night table begins; a retreat at a camp already at the fallback Waypoint moves it no further and consumes no second camp roll, ration, or night hazard; the night hazard keeps the Distance Band of the day's last ridden Leg; and 9-33's queued repeat is unchanged. (m1 to m9) 9-41, as its nine items give, including an erratum on 9-34 item 3. Astra's m1 needed no decision: the two ADR-0003 citations in ADR-0016 and ADR-0019 are already replaced with ADR-0024 limits, verified by grep.
- **ADR:** none. Each item applies a limit ADR-0024 already carries; limit 17 is unchanged and 9-38 makes Chapter 4 obey it, which 9-36's fall reading depends on.
- **Owner may veto:** 9-41 item 1's cap of two called searches a Waypoint scene, which extends 9-29 and is unmeasured, so the playtest logs the units found; and 9-41 item 7's deferral of a table-made Foe kind to Phase 2, which states what 9-7 item 5 already decided and closes a power the YAML read as live.
- **Simulator case:** none; no closed number changes (9-17), no simulator family makes an improvised act or a called roll, and no Expedition figure is measured before the playtest.

### OQ-181: The GM judgment review round 3's decisions

- **Type:** Rules gap (the findings of the GM judgment review round 3 that needed a ruling, triaged in `docs/research/gm-judgment/REVIEW-FIX-PLAN-round-3.md`)
- **Arose in:** `docs/reviews/gm-judgment-review-3.md` (Opus: M1, M2, M3, m1, m2, m5, m6, m7; m3 and m4 are records fixes) and `docs/reviews/gm-judgment-review-3-fable.md` (Fable: m1 to m7; m8 is the same records fix as Opus m3). Chapter 1 sections 1.1, 1.5, 1.8, 1.9; Chapter 2 section 2.9 and Appendix 2A; Chapter 4 sections 4.6 and 4.10; Chapter 5 section 5.4; Chapter 7 sections 7.1 and 7.4; `CONTEXT.md`; `data/core/dice-pool.yaml`, `bonus-dice-sources.yaml`; `data/character/action-catalog.yaml`; `data/engagement/titan-harm.yaml`; `data/gear/falls.yaml`, `squad-supply.yaml`; `data/skirmish/skirmish.yaml`; `data/expedition/legs.yaml`, `hazards.yaml`; ADR-0024, limits 7 and 17.
- **Related:** OQ-168, OQ-178, OQ-179, OQ-180.
- **Question:** (M1) A Skirmish is outside a Titan Engagement, so `bonus-dice-sources.yaml` `help`, the glossary's **Help**, Chapter 1's Covering and Help requirements, Chapter 2 section 2.9, and the Catalog's nine `when_called` rows still gave a called roll in a Skirmish the GM-ruled Help, free or at a cost the GM names, that 9-36 replaced with the Skirmish's Help at an action each. (M2) Before 9-36 a Skirmish had no called roll, so `fly`'s "as a called roll outside a Titan Engagement" and Chapter 7's "no Fly roll" never met; now one GM could name Fly with its Gear Dice and another Agility alone for the same act. (M3) A fall staked on a called roll at On Body or Blind Spot lands the soldier at In Reach by `falls_land`, a Position the same rule says a called roll never touches. (Minors) The turn and the Reaction ban of 9-36 in no chapter; the hooked-by-strike flag and Relentless's trigger by pointer only; the Skirmish's parenthetical short of Attack Dice and Watch; "Otherwise" before the default in section 2.9; found Squad Supply in Chapter 1's fight success list and not Chapter 5's; a fallback camp at the departure gate with no Waypoint kind.
- **Options:** (M1) narrow the stale sentences and give the pointed-at file the fight's clause; or replace all of them with one pointer. (M2) forbid Fly in a Skirmish with Agility alone in its place; or allow it as the one Fly roll, with no airborne soldier. (M3) the fall lands as `falls_land` gives, the "nothing the fight tracks" limit binding the act, the cost, and the success; or no fall is staked at On Body or Blind Spot.
- **Status:** Decided (see DECISIONS-2026-09-14.md, *Batch 9*, 9-42 to 9-45)
- **Decision:** (M1) 9-42, the review's options 1 and 2 together: no new rule, every "as the GM rules" Help sentence scoped to outside a Titan Engagement and a Skirmish, and `bonus-dice-sources.yaml`, the glossary, Chapter 1, Chapter 2, and the nine Catalog rows carry the Skirmish's Help. (M2) 9-43, option 2: the GM may name Fly, the one Fly roll a Skirmish has; it takes the ODM Gear's Gear Dice (9-24), makes no soldier airborne, makes no Gas Roll, drops no one on a Jam, and gives no Engaged or Apart, all as Chapter 4 already reads. (M3) 9-44, option 1: a staked fall is a fall in full and lands as `falls_land` gives; the change of Position is the fall rule's, not the ruling's; ADR-0024 limit 17 says so. (Minors) 9-45, six items: the turn and the Reaction ban printed; the flag and Relentless's trigger in words; Attack Dice and Watch named; the model entry read first; no found Squad Supply in a fight; a camp at the departure gate rolls the setup table and the Expedition goes on.
- **ADR:** ADR-0024 (limit 17; `## Amended`, 9-44). ADR-0006, ADR-0010, and ADR-0013: the four operative ADR-0003 citations 9-18's sweep left inside `docs/adr/` now cite ADR-0024 limits (review round 3, Opus m4).
- **Owner may veto:** 9-43, which opens Fly to a called roll in a Skirmish and reads Chapter 7's "no Fly roll" as "no Fly roll a rule calls for"; and 9-45 item 5, which closes found Squad Supply to a called roll in a fight.
- **Simulator case:** none; no closed number changes (9-17), no simulator family makes a called roll, and no Expedition figure is measured before the playtest.
