# Chapter 1, Core Rules: review round 2

Reviewed: `docs/rules/01-core-rules.md`, `data/core/dice-pool.yaml`, `data/core/bonus-dice-sources.yaml`, `data/core/stress-changes.yaml`, OQ-01 to OQ-14 in `docs/rules/OPEN-QUESTIONS.md`, against `CONTEXT.md`, ADR-0001 to ADR-0015, `docs/reviews/01-core-rules-review-1.md`, and the parent-game extractions in `docs/research/`. Odds quoted below come from a 200k-trial Python simulation of the round-2 rules (model in the appendix). Severity follows the round's guide: Critical contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or an ADR-0014 target; Major is an undefined edge case or ordering problem likely in normal play, or a significant odds or fidelity problem; Minor is wording, clarity, or a small gap.

## Verdict

All eight Critical and Major findings from round 1 are resolved, and none of the fixes reintroduces GM discretion or contradicts an ADR. The chapter is now a closed, data-shaped core: every pool component, Stress trigger, and Bonus Dice source has a row, and the Position test for field relief and the "calling rule states it" test for Help outside a Titan Engagement are both evaluable by a Foundry implementation. Three Major gaps remain, two of them created by the round-1 fixes: the new Reaction rule (OQ-09 b) creates turn debt that nothing says what happens to when a Titan Engagement ends, "a soldier can always make a Reaction" forecloses the Down and Grabbed states, and the Position test for Stress relief gives a Squad that retreats nothing at all while the file has no other field relief. No finding is Critical. The chapter is one fix round from Done.

## Round 1 findings: resolution check

| # | Round 1 finding | Status | Note |
|---|---|---|---|
| 1 | Critical. OQ-09 made a soldier who had acted defenseless | **Resolved** | OQ-09 (b): a Reaction is always allowed and spends the earliest fully unspent turn. Glossary note logged. Creates findings 1 and 2 below. |
| 2 | Critical. OQ-01 re-rolled Gear Dice 2 to 5 | **Resolved** | OQ-01 (b): Gear Dice never re-rolled, wear only from first-roll 1s on a Pushed roll. `dice-pool.yaml` `gear.push_re_rolls_faces: []` matches. Odds in the appendix. |
| 3 | Critical. "Same scene" and "took part" undefined | **Resolved** | Help and Covering outside a Titan Engagement need the calling rule to state eligibility; silence means no Help. Relief triggers use "holds a Position". Creates finding 3 below. |
| 4 | Major. Stress Dice on the Death Roll | **Resolved** | OQ-03 (d): no Stress Dice, no Help; `roll_exceptions.death-roll` in the YAML. |
| 5 | Major. No Talent could name a dodge | **Resolved** | OQ-11 (a): Catalog entries for dodge, block, and Death Roll marked not an action. |
| 6 | Major. One dodge against several Severities undefined | **Resolved** | OQ-14 (a): final successes compared with each later behavior; stated as the one exception to "each success is used once". |
| 7 | Major. "Attribute alone" contradicted the Stress Dice rule | **Resolved** | Section 1.3 step 1 now says "no Talent dice", every other component applies. |
| 8 | Major. YAML hard-coded player characters | **Resolved** | OQ-13 (b): rows refer to Chapter 2's Squadmate action list; field relief includes Squadmates. |
| 9 | Minor. Call It row had `null` dice | **Resolved** | Row removed; file header says Chapter 5 adds it. |
| 10 | Minor. Pushed dodge did not burn gas | **Resolved** | OQ-12 (a). |
| 11 | Minor. Covering had no limit | **Resolved** | Simulator case "Covering sponge" logged under OQ-06 with an acceptable outcome. |
| 12 | Minor. YAML mismatches | **Resolved** | `gear.min: 1` with `min_when_worn: 0`, `stress.push_re_rolls_faces: [2, 3, 4, 5]`, structured `count.from`. |
| 13 | Minor. Wording and small gaps | **Resolved** | Push-count bullet, retry default, both-at-once relief, Help on Death Roll, no opposed rolls in Chapters 1 to 6. Campaign modifiers are covered generically by 1.7 item 1 (new sources add a row) and the named-penalty rule. |

## Findings

### 1. Major. A Reaction can spend a turn in a round that never comes, and nothing says whether the debt survives the Titan Engagement

**Location:** section 1.9, *Reactions*, PROVISIONAL (OQ-09), bullets 2 to 4; section 1.9 *Turns and actions* ("Both refresh at the start of each round, unless a Reaction has already spent that round's turn").

**Problem:** Under OQ-09 (b) a soldier who has spent any part of this round's turn pays for a Reaction with "the soldier's next turn in full", and "if that next turn is already spent, the Reaction spends the turn after it, and so on". Turns exist only inside a Titan Engagement (section 1.9, first sentence), so a turn owed when the Engagement ends has nowhere to be paid. The chapter does not say whether the debt is cancelled, carried into the next Titan Engagement, or paid some other way. This is not a corner case: the last round of every Engagement has this shape, and a Nape kill can end the Engagement on any card. Simulated over a uniform card draw, a given Titan card resolves after a given player character's card 50% of the time, so roughly half of all dodges made in the final round by a soldier who had already acted would cost nothing if the debt is dropped, and the other half (soldiers whose card came after the Titan's) pay in full. Whether a dodge was free then depends on card order, which is the same kind of card-luck OQ-09 (b) was adopted to remove. If the debt instead carries over, a soldier can start the next Engagement, possibly a Leg later, with no move and no action in round 1 for a dodge they made an hour ago. Either answer is playable; no answer is not.

**Scenario:** Round 3, Wooded terrain, Tempo 2. Brandt's card is 2. She moves to Blind Spot and makes a Nape strike, falls short, and holds Attention (ADR-0010). The Titan's card 7 resolves a Grab against her. She dodges; both her move and her action are spent, so the Reaction spends her round-4 turn. On card 9 Wendt reaches Nape Depth and kills the Titan, which ends the Engagement. Round 4 never happens. On the next Leg a second Titan Engagement starts: does Brandt have a turn in round 1? One table says the debt died with the Titan, the next table docks her turn. And in the first table's reading, Brandt's dodge was free because her card was 2 rather than 8.

**Fix options:**
1. State that owed turns are cancelled when the Titan Engagement ends, and accept the final-round asymmetry as the flip side of "act first, dodge later"; note it in OQ-09 so the simulator's Grab case models it.
2. State that owed turns carry into the soldier's next Titan Engagement (they begin it with that many turns spent in advance). Harsh but symmetrical, and it keeps the price of a Reaction at exactly one turn whatever the card order.
3. Pay the debt in something that exists outside an Engagement: an owed turn becomes 1 Stress when the Engagement ends. Needs a `stress-changes.yaml` row and a note that it is the only trigger of its kind.

### 2. Major. "A soldier can always make a Reaction" forecloses Down, Grabbed, and Chapter 3 results that must be able to say otherwise

**Location:** section 1.9, *Reactions*, PROVISIONAL (OQ-09), first sentence; compare section 1.5 *When a soldier cannot Push* (a closed list that includes "the roll's rule forbids a Push").

**Problem:** "Always" is absolute, and the chapter models nothing else that way: Pushing has an exceptions list, Help has a requirements list, Covering excludes Down soldiers. The glossary says a Down soldier "can do little more than crawl" and a Grabbed soldier is "held in a Titan's hand", yet under this sentence both can make a full-pool Agility dodge with ODM Gear Dice, and Chapter 3's Stress Response table cannot contain a "Freeze" result that removes a Reaction without contradicting Chapter 1. Because Titan behaviors "land unless dodged" (ADR-0015) and the Attention Ladder puts "nearest person in reach" second, a Down soldier is exactly the one a Titan targets next, so the case is common, not theoretical. The chapter already excludes Down soldiers from Help and Covering; it should be as careful with the Reaction.

**Scenario:** Wendt is Down at In Reach with a lethal leg injury. The Titan's next card resolves a stomp against him. His player reads section 1.9: "A soldier can always make a Reaction." He rolls Agility 3 plus ODM Gear 2 plus Stress 4, Pushes, and meets Severity 2. The GM, reading the glossary's Down entry, says he cannot. ADR-0003 item 8 says the GM does not override; the chapter gave the GM nothing to point to.

**Fix options:**
1. Reword to "A soldier can make a Reaction unless a rule forbids it, as Chapter 3 does for a Down soldier and Chapter 5 for a Grabbed one", mirroring the Push exceptions list, and add "Cannot React" as a state that rows in later chapters can set. Keep the rest of OQ-09 (b) as written.
2. Decide the two obvious cases here: a Down or Grabbed soldier cannot make a Reaction; every other exception is named by the rule that creates it. Record it in OQ-09.
3. Keep "always" and make Chapter 3 and Chapter 5 express incapacity as penalties rather than prohibitions (a Down soldier dodges at 1 base die). This preserves ADR-0015's "lands unless dodged" literally but makes a crawling soldier dodge a stomp one time in six, which is hard to justify in fiction.

### 3. Major. The Position test for field relief gives a retreating Squad nothing, and the file has no other relief in the field

**Location:** section 1.6, *Gaining and losing Stress*, "End of a Titan Engagement" and PROVISIONAL (OQ-10) ("a soldier who has left it holds no Position"); `stress-changes.yaml` `reductions.engagement-ends.who`; section 1.6 "Stress changes only through a trigger in that file."

**Problem:** Relief at the end of a Titan Engagement goes to "every soldier who holds a Position when the Titan Engagement ends", and a soldier who has left holds none. A retreat (ADR-0009: "a Squad that retreats from a Chase or Titan Engagement falls back to the previous Waypoint") ends the Engagement by everyone leaving, so at the moment it ends nobody holds a Position and nobody gets relief. Whether that is intended is not stated, and the ordering (does the Engagement end before the last soldier leaves, or because they left?) is left to Chapter 5, which will have to know that Chapter 1 hung the relief trigger on it. The consequence is one-sided: the Squad that most needs relief, one that fled at high Stress into a Chase, gets none, then rides the next Leg. The settled design summary had "-1 Stress per Waypoint camp" as the field's baseline relief; ADR-0008 does not, the file has no camp row, and, unlike section 1.7 for Bonus Dice, section 1.6 never says a later chapter may add a row, so as written the Expedition rules cannot add one without contradicting "Stress changes only through a trigger in that file". Simulated over a three-Engagement Expedition with one roll per round and a Push whenever short, a Rookie who wins every Engagement ends at median Stress 0 (90th percentile 0); the same Rookie with no relief ends at median 2 (90th percentile 4, worst 6), and a two-Scar Veteran at median 3 (90th percentile 5, worst 8). At Stress 4 the Stress Response chance per roll is 52% unpushed and 56% pushing; at 5 it is 60% and 63%. That is not a spiral over one Expedition, but it is a step change in danger for the Squad that already lost, and nothing in the data says whether the design wants it.

**Scenario:** Two Focus Titans, the second just entered from a Background clock. Brandt is at Stress 4, Wendt at 3. The Squad retreats. As the last rider leaves In Reach the Engagement ends; by section 1.6 nobody holds a Position, so nobody loses Stress. The Chase costs two more Pushes. At the Waypoint camp the players look for a relief trigger and the file has `downtime` only. Brandt rides the next Leg at Stress 6, where a Stress Response fires on two rolls in three.

**Fix options:**
1. Change the test to "every soldier who held a Position in that Titan Engagement at any point during its final round", which is still a tracked state and covers a retreat, and add one sentence to 1.6: "The Expedition and Chase rules may add rows to the file", so a Waypoint camp row has somewhere to go.
2. Keep the test and decide the retreat case explicitly: a retreat ends the Titan Engagement before anyone leaves, and Chapter 5 defines it that way. Record in OQ-10 that a retreating Squad does get the end-of-Engagement relief.
3. Keep both as written and log the consequence: a retreat forfeits relief by design, and the only field relief is winning. Then add the "later chapters may add rows" sentence anyway, and add "retreat at Stress 4" as an ADR-0014 simulator case with an acceptable outcome.

### 4. Minor. Two Pushed ODM rolls in one round: three Gas Roll dice or four

**Location:** section 1.5, *Pushing and gas*, PROVISIONAL (OQ-12); glossary Gas Roll ("three after a Pushed ODM action").

**Problem:** Under OQ-09 (b) and OQ-12 (a) a soldier can Push an ODM action on their card and Push a dodge on the Titan's card in the same round. The rule says "three dice instead of two", per round, which reads as no stacking, but it does not say so, and ADR-0014's gas target ("about 6 when pushing every round") is tuned to one Push per round. Chapter 4 owns the Gas Roll, but Chapter 1 introduces the three-die rule and should say whether it is a flag or a count.

**Fix options:**
1. Add "however many rolls that round were Pushed" after "three dice instead of two", and note it in OQ-12.
2. Make it a count (one extra die per Pushed ODM roll that round) and record that the gas simulator case must include two Pushes per round.

### 5. Minor. Nothing says a soldier may pass on their card and keep the turn for a later Reaction or Help

**Location:** section 1.9, *Turns and actions* ("A move and an action can each be spent once per round and cannot be saved for a later round"); *Reactions*, OQ-09 (b).

**Problem:** OQ-09 (b) rewards a soldier who has not spent their turn when the Titan's card comes: the dodge costs this round's turn, which would otherwise be gone at the end of the round, so it is effectively free. OQ-08 (a) likewise lets an unspent action Help a comrade's dodge later in the round. Both depend on a soldier being allowed to do nothing on their card and keep the move and action unspent until the round ends. The text neither allows nor forbids it, and "cannot be saved for a later round" invites the reading that an unused turn is lost when the card passes. This is the deliberate tactical choice (act now and pay later, or hold and dodge free) that makes OQ-09 (b) work, and it should be stated.

**Fix options:**
1. Add one sentence: "A soldier may decline to move or act on their card. An unspent move or action stays available for Help and Reactions until the round ends, then is lost."
2. State the opposite: a turn not used on the soldier's card is spent. Then OQ-09 (b) should say so, because it changes the odds of a free dodge.

### 6. Minor. Covering: two offers, and what Covering pays outside a Titan Engagement

**Location:** section 1.5, *Covering*, PROVISIONAL (OQ-06), "Who can Cover" and "When"; `stress-changes.yaml` `gains.cover.condition`.

**Problem:** "Only one soldier can Cover a given Push, and the Pushing soldier can refuse the offer" does not say who chooses when two comrades offer. Outside a Titan Engagement, the Covering soldier "must qualify to Help that roll under the rule that called for it"; that rule also states what Help spends (OQ-08 f), but the chapter says Covering "spends neither the move nor the action", which are Engagement terms. Whether Covering pays the outside-Engagement price of Help (a Downtime Action, say) is unstated.

**Fix options:**
1. "If more than one comrade offers, the Pushing soldier chooses one." And: "Outside a Titan Engagement, Covering spends nothing; it needs only the eligibility the calling rule gives Help, not its price."
2. Same first sentence; make Covering pay what Help pays in that context, and say so in the YAML row.

### 7. Minor. The closest-Catalog-action route does not say whether that action's Talent applies, and the YAML attribute row assumes a Catalog entry

**Location:** section 1.3, step 1, *Actions outside the catalog*; `dice-pool.yaml` `components.attribute.dice` ("the rating of the attribute the roll's Action Catalog entry names") and `components.talent.uncatalogued_action` (covers only the attribute-alone case); `components.gear.dice`.

**Problem:** The two routes in ADR-0003 item 9 are handled unevenly. "The attribute alone" is fully specified (no Talent dice, all else applies). "The closest Catalog action" is not: it is natural that a Talent naming that action adds dice, and that the entry's gear items apply, but the chapter says only "uses the closest Catalog action". The YAML attribute row's `dice` prose names the entry's attribute, which does not exist on the attribute-alone route (the prose says "the attribute the Chapter 2 procedure names").

**Fix options:**
1. Add to step 1: "When the closest Catalog action is used, the roll is that action for every purpose: its attribute, its gear items, and any Talent that names it." Change the YAML `dice` prose on the attribute and gear rows to "of the Catalog entry, or the attribute and gear item the Chapter 2 procedure names".

### 8. Minor. The dodge hard-codes ODM Gear, so a rider with no gear deployed dodges with no Gear Dice

**Location:** section 1.9, *Against a Titan* ("uses ODM Gear for its Gear Dice"); ADR-0015 ("Agility plus ODM Gear Dice").

**Problem:** ADR-0015 fixes the dodge pool, so this is a fidelity note rather than a contradiction. A soldier at Distant on horseback (every Titan Engagement starts this way for a riding formation, and every Chase is this) dodges with ODM Gear Dice they have not deployed and no horse dice, even though the design brief gives horses Gear Dice and canon's riders survive by horsemanship until they hook in. Chapter 5 and the Catalog entry for dodge could let the entry allow "ODM Gear, or the horse when mounted" under the one-item rule (step 6) without changing ADR-0015's meaning.

**Fix options:**
1. Soften the sentence here to "uses ODM Gear for its Gear Dice (Chapter 5 says when a mounted soldier may use their horse instead)". Chapter 5 decides.
2. Leave it and log the mounted case in OQ-14 or a new entry for Chapter 5.

### 9. Minor. A Stress Response that "changes the roll" is not reconciled with the dodge's later-card comparisons

**Location:** section 1.5, *Finishing a roll* step 2 (OQ-05); section 1.9, OQ-14 ("the dodge's final successes are compared ...").

**Problem:** If a Chapter 3 result changes the roll (the obvious candidates are "this roll fails" or "lose N successes"), it is applied at Finishing step 2, before the effect. OQ-14 compares "final successes" with each later behavior. Whether "final" means the count from step 1 or the count after step 2 decides whether a Freeze on card 1 also lets card 2 land. The likely intent is after step 2; it should be said, and the Chapter 3 drafter told that a result may alter a success count.

**Fix options:**
1. In OQ-14's bullet, replace "final successes" with "successes after Finishing step 2".
2. In OQ-05, add: "A change to the roll changes its success count for every use of that roll, including a dodge's later comparisons."

### 10. Minor. Wording and small gaps

- Section 1.2: "xD6 means roll x dice and add them together" sits next to a pool that counts sixes and never adds. Say a dice pool is never written as xD6, or that "xD6" is used only for table results.
- "Comrade" is used about twenty times and is not defined or in the glossary. One sentence in 1.8: "A comrade is any other soldier in the Squad, player character or Squadmate."
- Section 1.4 item 1: "final once the soldier has Pushed or chosen not to" should read "has stopped Pushing" now that OQ-02 allows Talent-granted second Pushes.
- The chapter never says what a failed roll does. YZE's answer is "nothing beyond what the roll's rule states"; one sentence in 1.4 closes it.
- Section 1.9: block is defined, given a Catalog entry (OQ-11), and unusable against any enemy in Chapters 5 and 6. Say plainly that block is reserved for enemies later chapters add, so no one hunts for the rule.
- OPEN-QUESTIONS OQ-14, "Why": "lets them decide on their turn with the Severity in front of them". The decision is made on the Titan's card, not the soldier's turn. Fix the wording so it does not suggest the soldier waits for their card.
- Section 1.5, *What 1s mean*: with a Stress Die 1 forbidding the Push and wear only on a Pushed roll, gear wear per roll falls as Stress rises (0.067 wear per roll at Stress 0, 0.020 at Stress 3, 0.006 at Stress 6, base 5 and Gear 1). Emergent, not wrong, but Chapter 4 should tune Gear Dice ratings against a Stress-1 soldier, not a Stress-0 one.

## Judgment on the provisional decisions

- **OQ-01 (b):** sound. It reads ADR-0004 step 2 literally, keeps "locked" meaningful, and makes wear visible before the Push decision, which is the Coriolis intent ("gear wears through player choice") delivered more cleanly than Coriolis does it. Cost: the Push is worth less to gear-heavy pools. Levi-grade at 9 base, 3 gear, Stress 1, Pushing when short: need 3 succeeds 69% under (b) against 74% under the old (a); need 4, 47% against 54%; need 5, 26% against 33%. Wear per Pushed roll: Gear 1 0.17, Gear 2 0.33, Gear 3 0.50. Chapter 4 tunes against these.
- **OQ-02:** sound. Unchanged.
- **OQ-03 (d):** sound. The Death Roll exception is in the prose and the YAML; the Down question is correctly left to Chapter 3.
- **OQ-04:** sound. Re-run under the round-2 Push rule with a Push only when short of a success (the realistic policy), a Rookie who wins every Engagement ends an Expedition at Stress 0 and a two-Scar Veteran at 2; with no relief at all, 2 and 3 (worst 6 and 8). No cap needed on this evidence. Re-run again when Chapter 3's named gains exist.
- **OQ-05:** sound. Finding 9 is a one-line clarification.
- **OQ-06:** sound, with one number the sponge case should include: a Covered Push by a soldier at Stress 0 rolls no Stress Dice at all, so it can never cause a Stress Response (need 1: 87% success, 0% Response, against 89% and 6% uncovered). The entire risk of the Push moves to the Coverer; the "acceptable outcome" test in the OQ is the right one and should be run before Chapter 2 decides whether Squadmates can Cover.
- **OQ-07:** sound. Unchanged.
- **OQ-08 (a) and (f):** sound. (f) is closed and puts a visible drafting duty on later chapters. Finding 5 is the one clarification (a) needs.
- **OQ-09 (b):** sound in principle, and the right shape: exactly one turn per Reaction, never card-luck about whether a dodge exists. Findings 1 and 2 are the two things it does not say. Note also the trade it makes on a Grab: a striker who falls short, dodges the Grab, and fails has spent next round's turn, so is lifted after a turn with no action and gets exactly one turn to self-escape before being devoured; under the old (a) they had two escape turns and no dodge. That is a fair trade (dodge odds at Severity 2 are 54% for a Rookie, 77% for a Veteran) but the ADR-0014 Grab case must model it.
- **OQ-10:** sound as a test; finding 3 is about the retreat case it pre-decides.
- **OQ-11 (a):** sound. Matches both parents and keeps ADR-0006's single test.
- **OQ-12 (a):** sound. Finding 4 is the stacking question.
- **OQ-13 (b):** sound. It is the only choice that keeps the YAML from deciding Chapter 2's questions.
- **OQ-14 (a):** sound. It is the only reading that honors both of ADR-0015's sentences. Finding 9 is a wording fix; the OQ's "on their turn" phrase is finding 10.

## Glossary and term use

No `_Avoid_` term appears in the chapter or the three YAML files. "Scene" is gone. "Level" appears only for Talent levels, as ADR-0006 uses it. "Comrade" is undefined (finding 10). The chapter's glossary notes for Reaction (OQ-09) and Gas Roll (OQ-12) are logged and correct; the Help entry's "by spending an action" will also need a note once OQ-08 (f) is confirmed, because outside a Titan Engagement Help spends what the calling rule states, which may not be an action.

## ADR-0003 checklist

Items 7, 8, and 9 are met: Help states its Position requirement inside a Titan Engagement and delegates to a stated requirement outside one; 1.1 items 2 and 3 forbid overriding rolls and adding dice by judgment; uncatalogued actions follow item 9. I found no rule in the chapter that rests on GM discretion. The only judgment calls left are the ones deferred to Chapter 2's procedure for picking the closest Catalog action, which is where ADR-0003 item 9 puts them.

## Fidelity and engine fit

The round-2 chapter keeps everything round 1 praised and fixes the one engine departure (the old Reaction rule). One dodge covering a Titan's whole round now reads as sustained flight rather than a single sidestep, which is the right ODM feel, and declining an early card to save the dodge for the Grab is a canon decision (Levi lets the swat come and moves on the lunge). The dodge pool hard-coded to ODM Gear is the one fidelity snag (finding 8). On engine fit, the "Gear Dice never re-rolled" rule is a clean simplification: a Push is now base and Stress Dice only, which is the Alien Push exactly, with Coriolis wear read off the first roll. The pool build is still seven steps; nothing in this round added to it.

## ADR-0014 note for Chapters 5 and 6

Under the round-2 Push rule, with no Bonus Dice and a Push whenever short: a Rookie (Agility 4, Talent 0 to 1, Gear 1, Stress 1) reaches 4 successes 7% to 12% of the time; a Levi-grade soldier (6, 3, 3, Stress 1) reaches 4 successes 47% of the time and 5 successes 26%. A Medium Nape Depth of 4 therefore lands both solo targets (no more than 10%, about 50%) at once; Depth 5 misses the Levi target. Both targets are reachable from this chapter's rules.

## Keep

- The resolution table above is the chapter's real achievement: every round-1 fix landed in both the prose and the YAML, and none of them added a judgment call.
- OQ-09 (b) and OQ-14 (a) together: one Reaction per Titan per round, always available, always one turn, compared with each behavior's Severity. This is the rule ADR-0015 was reaching for.
- The `roll_exceptions` block in `dice-pool.yaml`: a single place for every roll that leaves out a component, so a Foundry importer never guesses.
- "The rule that called for the roll states it" as the pattern for retries, Help, and Covering outside a Titan Engagement: closed, and it makes later chapters' duties visible.

## Appendix: simulation model

200,000 trials per cell unless stated (`scratchpad/ch1_r2_odds.py`, not committed). Push follows the round-2 chapter: forbidden if any Stress Die shows 1 on the first roll; re-rolls base and Stress Dice not showing 6; Gear Dice never re-rolled; one new Stress Die unless Covered; wear counts Gear Dice showing 1 when final, only if Pushed; one Stress Response per roll. "Push when short" Pushes only when the first roll has fewer successes than needed. Card order draws 4 player-character cards plus Tempo Titan cards from 10 without replacement. The Expedition model is 3 Engagements of 4 rounds, one roll per round on 5 base dice and 1 Gear Die, need 1, Push when short, 20,000 trials; "win" relief is -2 per Engagement (end plus kill), "retreat" is none.

| Quantity | Value |
|---|---|
| Dodge, Rookie (Agi 4, Talent 0, Gear 1, Stress 1), Severity 1 / 2 / 3 | 0.84 / 0.54 / 0.24 (Response 0.25 / 0.34 / 0.39) |
| Dodge, Rookie with Talent 1, Severity 1 / 2 / 3 | 0.88 / 0.62 / 0.33 |
| Dodge, Veteran (5, 2, 2, Stress 3), Severity 1 / 2 / 3 | 0.94 / 0.77 / 0.55 (Response 0.45 / 0.52 / 0.60) |
| Dodge, Levi-grade (6, 3, 3, Stress 1), Severity 1 / 2 / 3 | 0.97 / 0.87 / 0.70 |
| Dodge, Rookie with +1 / +2 / +3 Bonus Dice, Severity 2 | 0.62 / 0.69 / 0.75 |
| Levi-grade need 3 / 4 / 5, OQ-01 (b) vs old (a) | 0.69 / 0.47 / 0.26 vs 0.74 / 0.54 / 0.33 |
| Wear per Pushed roll, Gear 1 / 2 / 3 | P(any) 0.17 / 0.31 / 0.42; mean 0.17 / 0.33 / 0.50 |
| P(Stress Response per roll), Stress 1 / 3 / 4 / 5 / 6 / 8, Push when short | 0.24 / 0.47 / 0.56 / 0.63 / 0.68 / 0.78 (unpushed 0.17 / 0.42 / 0.52 / 0.60 / 0.66 / 0.77) |
| P(first roll allows a Push), Stress 1 / 3 / 5 / 8 | 0.83 / 0.58 / 0.40 / 0.23 |
| Covered Push at Stress 0, need 1 / 2: success, Response | 0.87, 0.00 / 0.54, 0.00 (uncovered 0.89, 0.06 / 0.60, 0.12) |
| P(a given Titan card resolves after a given PC's card) | 0.50 at any Tempo; at least one card after: 0.50 / 0.66 / 0.75 at Tempo 1 / 2 / 3 |
| Expedition end Stress, Rookie, win / retreat: median, 90th, max | 0, 0, 2 / 2, 4, 6 |
| Expedition end Stress, 2-Scar Veteran, win / retreat: median, 90th, max | 2, 2, 4 / 3, 5, 8 |
| P(>= k successes), Rookie (4, 0, 1, 1), k = 1 to 6 | 0.84, 0.54, 0.24, 0.07, 0.01, 0.00 |
| P(>= k successes), Levi-grade (6, 3, 3, 1), k = 1 to 6 | 0.97, 0.88, 0.70, 0.47, 0.26, 0.12 |
