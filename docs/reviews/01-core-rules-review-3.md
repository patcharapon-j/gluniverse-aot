# Chapter 1, Core Rules: review round 3 (final)

Reviewed: `docs/rules/01-core-rules.md`, `data/core/dice-pool.yaml`, `data/core/bonus-dice-sources.yaml`, `data/core/stress-changes.yaml`, OQ-01 to OQ-16 in `docs/rules/OPEN-QUESTIONS.md`, against `CONTEXT.md`, ADR-0001 to ADR-0015, `docs/reviews/01-core-rules-review-1.md`, `docs/reviews/01-core-rules-review-2.md`, and the parent-game extractions in `docs/research/`. Odds quoted below come from a 200k-trial Python simulation of the round-3 rules (model in the appendix). Severity follows the round's guide: Critical contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or an ADR-0014 target; Major is an undefined edge case or ordering problem likely in normal play, or a significant odds or fidelity problem; Minor is wording, clarity, or a small gap.

## Verdict

Every round-2 finding landed, in the prose and in the YAML, and none of the fixes added a judgment call or contradicted an ADR. The chapter is now usable on its own terms: a table with only Chapter 1 and a Severity number can build a pool, Push, Cover, Help, resolve a dodge against several cards, and know what a Reaction costs in every round including the last. No finding is Critical. Two Major gaps remain, both created by the round-1 and round-2 Reaction fixes: the Help test ("has not spent their action this round") gives a different answer from the OQ-09 text ("no move and no action") for a soldier whose turn was spent in advance, a state that arises in roughly half of all rounds for the soldier the Titan is targeting; and Help and Covering have closed eligibility lists with no "unless a rule forbids it" hook, so a Grabbed soldier can Help the Nape strike from inside the Titan's fist and Chapter 3 cannot write a result that stops a soldier Helping. Both are one-sentence fixes. Five Minor findings are wording and small gaps. With those two sentences added, the chapter is Done.

## Round 2 findings: resolution check

| # | Round 2 finding | Status | Note |
|---|---|---|---|
| 1 | Major. Turn debt at the end of a Titan Engagement undefined | **Resolved** | OQ-15 (a): turns spent in advance are cancelled when the Engagement ends. The final-round asymmetry is measured and logged, with a simulator case. |
| 2 | Major. "Always" foreclosed Down, Grabbed, and Chapter 3 results | **Resolved** | OQ-09 now "unless one of these is true", a closed list mirroring *When a soldier cannot Push*. Down goes to Chapter 3, Grabbed to Chapter 5. Finding 2 below is the same gap in Help and Covering. |
| 3 | Major. Retreat forfeited relief; file could not take a camp row | **Resolved** | OQ-10 (f): "held a Position at any point during it"; YAML `engagement-ends.who` matches and names retreat. Section 1.6 and the file header say a later chapter adds a row. |
| 4 | Minor. Two Pushed ODM rolls, three dice or four | **Resolved** | "Three dice however many of that round's rolls were Pushed ODM actions." OQ-12 records it as a flag and adds the two-Push gas case. |
| 5 | Minor. Declining a turn not stated | **Resolved** | OQ-16 (a), with the held move and action limited to Help and Reactions. |
| 6 | Minor. Two Cover offers; Covering outside an Engagement | **Resolved** | Pushing soldier chooses; Covering spends nothing outside an Engagement. YAML `cover.condition` and `spends` match. |
| 7 | Minor. Closest-Catalog-action route incomplete | **Resolved** | "The roll is that action for every purpose"; YAML attribute and gear `dice` prose updated. |
| 8 | Minor. Dodge hard-codes ODM Gear for a mounted soldier | **Not resolved, kept by design** | The drafter is right that ADR-0015 fixes the pool, so the chapter cannot change it. But the mounted case is now logged nowhere. Finding 4 below asks only that it be logged. |
| 9 | Minor. Stress Response change vs later dodge comparisons | **Resolved** | OQ-05 step 2 and OQ-14 both say "successes counted after step 2 of *Finishing a roll*". |
| 10 | Minor. Wording bundle | **Resolved** | xD6 restricted to table results; "comrade" defined in 1.8; "stopped Pushing"; failed roll has no effect unless stated; block reserved; OQ-14 wording; wear-vs-Stress note in OQ-01. |

## Findings

### 1. Major. The Help test says "has not spent their action this round", which a soldier whose turn was spent in advance satisfies, while OQ-09 says that turn "has no move and no action"

**Location:** section 1.8, *Requirements*, "They have not spent their action this round"; `bonus-dice-sources.yaml` `help.condition_in_titan_engagement` ("The helper has not spent their action this round"); section 1.9, PROVISIONAL (OQ-09), last bullet ("A turn spent in advance still happens when it comes up ... but it has no move and no action"); section 1.8 *What it spends* ("the helper spends their action").

**Problem:** OQ-09 (b) creates a state the Help rule was not written for: a round in which the soldier's turn exists (it "still happens", so the Wing Squadmate acts after it and the Grab countdown ticks) but has no move and no action. The Help requirement is phrased as a negative, "has not spent their action this round", and the soldier in that state has not spent anything this round; the spending happened last round. Read that way, they can Help. Read through *What it spends*, Help "spends their action" and there is no action to spend, so they cannot. The YAML is the source of truth (ADR-0012) and its `condition_in_titan_engagement` carries only the negative phrasing, so a Foundry implementation that checks an `action_spent_this_round` flag allows the Help. The state is common, not a corner: the soldier who strikes the Nape, falls short, and holds Attention (ADR-0010) is targeted after acting whenever a Titan card comes after theirs, which is 50% per card. Simulated with one soldier targeted every round of a four-round Engagement, that soldier enters the next round with the turn already spent after 77% of rounds at Tempo 1, 60% at Tempo 2, and 48% at Tempo 3. In every one of those rounds they are at Blind Spot, one step from the comrade making the next Nape strike, with the strongest possible reason to Help it.

**Scenario:** Round 2, Wooded. Brandt's card is 3. She moves to Blind Spot and strikes the Nape, falls short, holds Attention. The Titan's card 7 resolves a Grab; she dodges and meets Severity 2. Both her move and action were spent, so the Reaction spends her round-3 turn. Round 3: Wendt is at Blind Spot with 2 Openings and Brandt's player says "I Help, I haven't spent my action this round." One table reads section 1.8 and allows it (+1 die on a strike that needs 4). The next reads OQ-09's "no move and no action" and refuses. A Foundry build follows the YAML and allows it.

**Fix options:**
1. Change the test in both places to "They have an unspent action this round", and add to the OQ-09 bullet: "A turn spent in advance has no action to Help with." One word in the prose, one in the YAML.
2. State the opposite deliberately: a soldier whose turn was spent in advance may still Help, because Help is out-of-turn and their action was never used for anything. Then OQ-09 should say the spent turn "has no move and no action of its own, but the soldier may still Help", and the simulator's Grab case must count it, since it makes the dodge cheaper than one turn.

### 2. Major. Help and Covering have closed eligibility lists with no "unless a rule forbids it" hook, so a Grabbed soldier can Help the Nape strike and Chapter 3 cannot forbid Helping

**Location:** section 1.8, *Requirements* ("A comrade can Help only if all of these are true"), and the list that follows; section 1.5, *Covering*, "Who can Cover"; `bonus-dice-sources.yaml` `help.condition`; `stress-changes.yaml` `cover.condition`. Compare section 1.5 *When a soldier cannot Push* ("The roll's rule forbids a Push") and section 1.9 OQ-09 ("A rule forbids it. Such a rule names the state or result that forbids Reactions").

**Problem:** Round 2 (finding 2) replaced "a soldier can always make a Reaction" with a closed list that includes a hook for later chapters: a rule may forbid a Reaction by naming a state or result. Push has had the same hook since round 1. Help and Covering did not get one. Their lists are closed ("only if all of these are true") and the only state they exclude is Down. So a Grabbed soldier, who the glossary says is "held in a Titan's hand", and who is On Body and therefore one Position step from Blind Spot, can Help the Nape strike that is meant to save them, and can Cover the striker's Push. Chapter 5 will have to forbid it, and when it does it contradicts a list this chapter calls complete and a YAML condition it does not own. Chapter 3 has the same problem in the other direction: Alien's Stress Response table, which the design cites as the model, includes "cannot give or receive help" (Paranoid), and a "Freeze" or "Flee" result that stops a soldier Helping is the obvious kind of entry. Under this chapter's list such a result cannot exist. The odds make the Grabbed case matter: Help on a Nape strike or a dodge is the rescue window ADR-0015 was amended to protect. A Rookie dodge at Severity 3 goes from 28% with no Bonus Dice to 37%, 45%, 52%, and 59% with one to four; a Grabbed soldier's own Help die is worth about 9 points on the roll that decides whether they are eaten.

**Scenario:** Wendt is Grabbed, On Body, torso Critical Injury, one turn from being lifted. Brandt is at Blind Spot with 3 Openings and strikes the Nape. Wendt's player: "I'm one step away and my action is unspent. I Help." Section 1.8's list is satisfied on every line. The GM says a man in a Titan's fist cannot steady a blade, and ADR-0003 item 8 gives the GM nothing to point to. Later, Chapter 3 wants to write "Frozen: cannot act, Help, or React until Rallied", and finds that Chapter 1 lets it forbid the action and the Reaction but not the Help.

**Fix options:**
1. Add one requirement line to Help and one to Covering, mirroring Push and Reactions: "No rule forbids it. Such a rule names the state or result that forbids Helping (or Covering), as Chapter 3 may for a Stress Response result and Chapter 5 for a Grabbed soldier." Add the same sentence to `help.condition` and `cover.condition`. Log it under OQ-08 and OQ-06.
2. Decide the obvious case here: a Grabbed soldier cannot Help or Cover, and every other exception is named by the rule that creates it. Record it in OQ-08 and OQ-06 and let Chapter 5 inherit it.

### 3. Minor. "Actions ... are all attribute rolls" is over-broad, and the uncatalogued route covers actions but not rolls that a rule calls for

**Location:** section 1.3, first paragraph ("Actions, Reactions, and Death Rolls (which name Strength) are all attribute rolls"); section 1.3 step 1 ("Every attribute roll is made for one Action Catalog entry" and "**Actions outside the catalog.** For an action with no Catalog entry ..."); section 1.1 item 1 (a roll is made "when they take an action whose Action Catalog entry marks it as rolled, or when a rule or table result calls for a roll").

**Problem:** Section 1.1 says some Catalog actions are not rolled, so "Actions ... are all attribute rolls" contradicts it; "rolled actions" is meant. More substantively, section 1.1 recognises a second source of rolls, "a rule or table result calls for a roll", and step 1 then says every attribute roll is made for a Catalog entry. The glossary's Plan Roll (Wits), the Vanguard's Leg roll (Instinct), Requisition (Empathy), and any Chase roll are attribute rolls called for by rules, not by taking a Catalog action. They must each get a Catalog entry, or fall to the uncatalogued route, which is written for "an action with no Catalog entry" and gives a procedure "that picks the action or the attribute", neither of which describes a Plan Roll. This is a drafting duty the chapter places on every later chapter without saying so, and a roll a later chapter forgets to list has no route.

**Fix options:**
1. Reword the first sentence to "Rolled actions, Reactions, and Death Rolls ..." and the route heading to "**Rolls with no Catalog entry.** A roll, whether an action or a roll a rule calls for, that has no Catalog entry ...". Add one sentence: "A later chapter that calls for an attribute roll gives it a Catalog entry or names its attribute and gear item directly; a roll that does neither uses the attribute alone."
2. Keep step 1 as written and add to section 1.1 item 1 that a rule which calls for an attribute roll names the Catalog entry it is made for.

### 4. Minor. The mounted dodge is kept by design, but the case is now logged nowhere

**Location:** section 1.9, *Against a Titan* ("uses ODM Gear for its Gear Dice"); ADR-0015; round 2 finding 8.

**Problem:** The drafter's reason for keeping the sentence is correct: ADR-0015 fixes the dodge at "Agility plus ODM Gear Dice", and a chapter does not amend an ADR. But the consequence is real and unrecorded: a rider at Distant, which is where every Titan Engagement starts for a riding formation and where every Chase happens, dodges with ODM Gear Dice for gear they have not deployed and gets nothing from the horse the design gives Gear Dice to. OPEN-QUESTIONS has no entry for it, so Chapter 4 (horses) and Chapter 5 (the dodge entry, Positions) will each meet it cold, and the only place it lives is a resolved review.

**Fix options:**
1. Add a short OQ entry (a Chapter 4 and 5 question, not a Chapter 1 PROVISIONAL): whether the dodge Catalog entry may allow "ODM Gear, or the horse when mounted" under the one-item rule, which needs an ADR-0015 note, or whether a mounted soldier at Distant is simply never the target of a behavior that allows a Reaction, which needs nothing.
2. Add one sentence to ADR-0015's amendment log recording that the ODM-only pool is deliberate and applies mounted or not.

### 5. Minor. A rule that takes a turn from a soldier has no definition of which turn it takes

**Location:** section 1.9, *Reactions*, OQ-09 ("A Reaction spends the soldier's earliest turn, starting with this round's, whose move and action are both unspent"); section 1.5, *Finishing a roll*, step 2 ("If the result changes the roll or the action, apply that change now").

**Problem:** The chapter defines, carefully, which turn a Reaction spends and what a turn spent in advance is. It does not say that this is the general rule for anything that costs a turn. Chapter 3's Stress Response table will almost certainly include results that cost a turn (Alien's Seek Cover, Scream, and Freeze all do), and a Stress Response resolves at Finishing step 2, often on a Reaction, which may itself have just spent next round's turn. Without a general rule, Chapter 3 either invents its own turn-spending, which will drift from this one, or writes "as a Reaction does", which imports a rule this chapter calls Reaction-specific.

**Fix options:**
1. Lift the sentence out of the Reaction bullet into *Turns and actions*: "Whenever a rule spends or takes a turn from a soldier, it takes the soldier's earliest turn, starting with this round's, whose move and action are both unspent. A Reaction is one such rule." Keep the Reaction bullets as the worked case.
2. Leave it and add a drafting note to OQ-09: Chapter 3 results that cost a turn must use the Reaction's turn-spending rule by reference.

### 6. Minor. Prose says a roll's own rule can leave out Stress Dice; the YAML says only rolls listed under `roll_exceptions` can

**Location:** section 1.3 step 7, PROVISIONAL (OQ-03) ("Another roll leaves out Stress Dice only if its own rule names it"); `dice-pool.yaml` `components.stress.per_roll` ("included in every attribute roll except the rolls listed under roll_exceptions") and the `roll_exceptions` comment ("A roll not listed here uses every component and rule above").

**Problem:** Two different tests. Under the prose, a later chapter's rule can exclude Stress Dice by saying so; under the YAML, the roll is not excluded until it has a row. The file is the source of truth, so the prose should say a rule that leaves out a component adds the roll to `roll_exceptions`, the same pattern section 1.6 and 1.7 already use for Stress triggers and Bonus Dice sources.

**Fix options:**
1. Reword step 7: "Another roll leaves out Stress Dice only if its own rule names it and the roll is listed under `roll_exceptions` in `data/core/dice-pool.yaml`; a later chapter that creates such a roll adds it there."

### 7. Minor. Wording and small gaps

- Section 1.9, OQ-09, second bullet: "whatever is left of this round's turn can still be used". After the soldier's card has passed, a leftover move cannot be used for anything, because OQ-16 limits a held move and action to Help and Reactions, a move alone cannot Help, and a Reaction needs both. The sentence is true only while the card is still to come. Say "can still be used on the soldier's card, if it has not yet come".
- Section 1.9, OQ-16: "stays available until the round ends, but only for Help (section 1.8) and Reactions". A soldier who moved and held their action may read this as "my held action lets me dodge with this round's turn". It does not, because the move is spent. Add "(a Reaction needs both the move and the action)".
- Section 1.5, *When a soldier cannot Push*: "The Push would roll no dice." An uncovered Push always rolls at least the new Stress Die, so this bullet is reachable only by a Covered Push whose base and Stress Dice all show 6, and the Cover is offered after the Push decision the bullet gates. Either drop it or move it to the Covering rule ("a Push that would re-roll nothing cannot be Covered").
- Section 1.10: "this chapter settles only that Squadmates lose Stress through the two field relief triggers". It also settles that a Squadmate is a comrade, can be Helped and Covered as a roller, and can Help or Cover if Chapter 2's list allows. Say "settles only these things about Squadmates: ..." and list them.
- `bonus-dice-sources.yaml` `help.condition` and section 1.8 exclude a Down helper but nothing says whether a Down soldier can be Helped or Covered as the roller. The Death Roll is already excluded; if a Down soldier's other rolls (Chapter 3) can be Helped, say so in one clause so Chapter 3 does not have to.

## Judgment on the provisional decisions

- **OQ-01 (b), OQ-02, OQ-03 (d), OQ-04, OQ-05, OQ-07, OQ-11 (a), OQ-12 (a), OQ-13 (b), OQ-14 (a):** unchanged since round 2 and still sound. Round-3 odds match round 2's within a few points (appendix), so nothing in the round-2 fixes moved the numbers Chapter 4, 5, and 6 will tune against.
- **OQ-06:** sound. The two-offers rule and "spends nothing outside an Engagement" close the round-2 gaps. The sponge case is well specified. One more number for it: a Covered Push at Stress 0 has a 0% Response chance at a cost of about 4 to 10 points of success (need 1: 87% against 91%; need 2: 54% against 64%), because the pool loses the new Stress Die. That is a real trade at Stress 0 and vanishes by Stress 3 (need 2: 77% against 78%), where the roller's own Stress Dice carry the risk anyway. Covering is therefore most attractive exactly when it is cheapest for the Coverer to absorb, at low Stress. The sponge simulator should run at Stress 0 to 2, not 3.
- **OQ-08 (a) and (f):** sound. Finding 1 is the one state (a) did not anticipate, and finding 2 is the missing hook.
- **OQ-09 (b):** sound. The closed exceptions list is the right shape. Note for the ADR-0014 Grab case: once a soldier is in turn debt and keeps being targeted, they stay in debt (each dodge spends the next turn), so they never move again and cannot Break Attention themselves; only comrades can relieve them. That is the ADR-0010 pressure by design, but the simulator should measure how long the Attention holder typically sits in that state, since it is where the "PC dies every 3 to 4 missions" target will actually be decided.
- **OQ-10 (a) and (f):** sound. The end-of-Engagement test now needs only a record of who entered, and the retreat case is decided. One consequence to log rather than fix: a soldier who sat at Distant on horseback the whole Engagement and never rolled gets the same relief as the striker. That is defensible (being there is the fear) and it is closed.
- **OQ-15 (a):** sound. Cancellation is the only option that keeps turns inside the structure that defines them, and the asymmetry is confined to one round, measured, and logged. One small incentive worth a line in the OQ: a Squad that has decided to retreat next round can React freely this round, because every debt dies with the Engagement. Retreat already costs a Waypoint (ADR-0009), so this is not exploitable in a way that matters, but the simulator's retreat case should include it.
- **OQ-16 (a):** sound. It states the trade OQ-09 (b) depends on and keeps out-of-turn movement out of this chapter. The wording note in finding 7 is the only clarification it needs.

## Glossary and term use

No `_Avoid_` term appears in the chapter or the three YAML files. "Re-roll" is the glossary's own verb in the Push entry; "reroll" as a noun does not appear. "Level" appears only for Talent levels, "Depth" only in Nape Depth, "Anchor" only in Anchor Rating. "Comrade" is now defined in 1.8. Glossary notes logged for Reaction (OQ-09), Help (OQ-08), Gas Roll (OQ-12), and Gear Dice (OQ-01) are all still correct and none has been applied to `CONTEXT.md`, which is right until the OQs are confirmed.

## ADR-0003 checklist

Items 7, 8, and 9 are met. Help states its Position requirement in a Titan Engagement and delegates to a stated requirement outside one; 1.1 items 2 and 3 forbid overriding rolls and adding dice by judgment; uncatalogued actions follow item 9 (finding 3 widens the route to rule-called rolls). I found no rule in the chapter that rests on GM discretion. Finding 2 is the one place a GM would be forced into a call, and it arises because the rule is too closed rather than too open.

## Fidelity and engine fit

The round-2 fixes improved both. Holding a turn to dodge free (OQ-16) is the canon beat of letting the swat pass and moving on the lunge, and the turn-debt lock (OQ-09) is Levi holding a Titan's attention while the squad sets up, which is what ADR-0010 wants. The mounted dodge remains the one fidelity snag and is now a logging question, not a chapter one. On engine fit the pool build is unchanged at seven steps and three die colours; a Push is base and Stress Dice only, which is the Alien Push exactly; wear reads off the first roll, which is cleaner than Coriolis. The one departure from either parent is the Reaction that spends a future turn, and it is the right departure for a game where "cannot React" means a Critical Injury with no Health buffer.

## ADR-0014 note for Chapters 5 and 6

Round-3 odds confirm round 2: with no Bonus Dice and a Push whenever short, a Levi-grade soldier (6, 3, 3, Stress 1) reaches 4 successes 47% of the time and a Rookie (4, 1, 1, Stress 1) about 12%, so a Medium Nape Depth of 4 still lands both solo targets. New this round: the Help rescue window on a dodge. A Rookie at Severity 3 goes 28 / 37 / 45 / 52 / 59% with 0 to 4 Bonus Dice; a Veteran 57 / 62 / 66 / 70 / 73%. Three helpers plus Call It at +2 hits the cap of 4, so the cap binds on exactly the roll it should. Chapter 6's Severity 3 entries are therefore survivable by a supported Rookie about as often as a lone Veteran, which is the teamwork shape ADR-0010 asks for.

## Keep

- The resolution record: ten findings fixed in prose and data with no new judgment calls, over three rounds.
- The closed exceptions list for Reactions (OQ-09) and OQ-15's cancellation: a Reaction always exists, always costs one turn, and never outlives the fight.
- OQ-16's "held for Help and Reactions only": a hold has a real cost, so it is a decision rather than a free option.
- "The rule that called for the roll states it" and "a later chapter adds a row" as the two patterns that let this chapter be closed without pre-deciding Chapters 2 to 6.

## Appendix: simulation model

200,000 trials per cell (`scratchpad/ch1_r3_odds.py`, not committed). Push follows the round-3 chapter: forbidden if any Stress Die shows 1 on the first roll; re-rolls base and Stress Dice not showing 6; Gear Dice never re-rolled; one new Stress Die unless Covered; one Stress Response per roll. "Push when short" Pushes only when the first roll has fewer successes than needed. Card order draws 4 player-character cards plus Tempo Titan cards from 10 without replacement. The turn-debt model targets one soldier on every Titan card for four rounds: a dodge after acting spends next round's turn, a dodge while in debt spends the turn after, and the figure is the share of rounds after which the next turn is already spent.

| Quantity | Value |
|---|---|
| Dodge, Rookie (Agi 4, Talent 0, Gear 1, Stress 1), Severity 1 / 2 / 3, +0 Bonus Dice | 0.86 / 0.58 / 0.28 |
| Dodge, Rookie, Severity 3, +0 / +1 / +2 / +3 / +4 Bonus Dice | 0.28 / 0.37 / 0.45 / 0.52 / 0.59 |
| Dodge, Rookie with Talent 1, Severity 2 / 3, +0 to +4 | 0.65 to 0.85 / 0.37 to 0.66 |
| Dodge, Veteran (5, 2, 2, Stress 3), Severity 3, +0 to +4 | 0.57 / 0.62 / 0.66 / 0.70 / 0.73 |
| Covered vs uncovered Push, Rookie Stress 0, need 1 / 2: success, Response | 0.87, 0.00 / 0.54, 0.00 vs 0.91, 0.05 / 0.64, 0.10 |
| Covered vs uncovered Push, Rookie Stress 1, need 1 / 2 | 0.87, 0.20 / 0.59, 0.25 vs 0.89, 0.23 / 0.65, 0.31 |
| Covered vs uncovered Push, Veteran Stress 3, need 2 | 0.77, 0.50 vs 0.78, 0.52 |
| Worked example pool (5 base, 2 gear, 1 stress), Severity 2, Covered / uncovered | 0.63 / 0.69 success; 0.24 / 0.30 Response |
| P(a given Titan card resolves after a given PC's card); at least one | 0.50; 0.50 / 0.67 / 0.75 at Tempo 1 / 2 / 3 |
| Share of rounds after which a soldier targeted every round has next turn already spent | 0.77 / 0.60 / 0.48 at Tempo 1 / 2 / 3 |
