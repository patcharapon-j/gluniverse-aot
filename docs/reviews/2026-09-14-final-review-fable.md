# Wings of Freedom: adversarial final design review

Odds below are from `scratchpad/odds.py` (200k trials; "pushed" = re-roll dice showing neither 6 nor 1).

## Verdict

The chassis is sound, and the two decisions that carry the game (Behavior Tables with a hidden, Readable Next Behavior, and the Attention ban on Nape strikes) are the right ones. But the Titan Engagement rules as written do not enforce the setup-before-kill pillar, the Attention rule makes two of the five ADR-0014 targets structurally unreachable rather than tunable, and the Gas Roll cannot hit its target at any playable starting rating. Fix the Critical and Major findings before drafting character creation, because several change what a Specialty or Talent is worth.

## Findings

### 1. Critical. Setup is optional; nape pile-on is the dominant strategy
Terms: Nape, Blind Spot, Toughness, Nape Depth, Attention; ADR-0001, 0007, 0010, 0014.
Nothing gates a Nape strike on a Broken Body Part. Toughness needs a burst in one strike while Nape Depth accumulates, so setup is the worse use of a turn. Scenario: Wooded terrain, four soldiers; one stays In Reach, three take Blind Spot. A pushed 5-dice striker averages 1.39 sixes; two strikers (the one who "just hurt it" holds Attention and dodges) give 2.8 sixes a round, so a Medium Nape Depth of 5 or 6 falls in two rounds with zero setup. Breaking a leg instead needs two strikes each with 2 sixes in one roll (43% pushed), about five striker-turns before anyone touches the Nape. The "prepared squad in 3 rounds" target is met by an unprepared squad. Fixes: (a) a Nape strike needs a listed condition (Broken leg or eyes, a card swap this round, or Openings spent), otherwise it rolls attribute dice only; (b) invert the asymmetry: Body Parts accumulate, the Nape needs Depth in one strike unless Openings are spent; (c) a "turns to face" entry on every Behavior Table moves everyone at Blind Spot to In Reach unless a leg is Broken.

### 2. Critical. The lone-soldier targets in ADR-0014 are 0%, not 10% and 50%
Terms: Attention, Attention Ladder; ADR-0010, 0014. A lone soldier is always the only stimulus, so always holds Attention, so can never strike the Nape. Finding 7 makes this common. Fixes: (a) a "Break Attention" action in the Action Catalog (flare, horse, thrown gear) that hands Attention to a decoy for one card, and restate the targets as "after a decoy"; (b) let the Attention holder strike at double Nape Depth with no Openings, so solo is terrible rather than impossible; (c) replace those two targets with "striking while holding Attention means taking the next behaviour with no Reaction".

### 3. Major. Whether Titan behaviours roll dice is undecided, and it doubles lethality
ADR-0005, Reaction, Tempo, Critical Injury. If behaviours roll fixed dice Alien-style, an 8-dice attack hits a 5-dice dodge 49% (34% pushed), 10 dice 58% (43%). Every hit is a Critical Injury with no Health buffer. The Attention holder faces every card: Tempo 2 over four rounds is eight behaviours, a third kill-tier, so one to one and a half Critical Injuries per fight on one soldier, against a target of one per Expedition. And the soldier who dodged card 1 has no turn left for card 2 that round. Fixes: (a) Dragonbane style: behaviours auto-hit, the Reaction is a straight Agility roll, one Reaction covers every card from that Titan this round; (b) Reactions against Titans are free and only cost the next turn if pushed; (c) keep dice but make the table shape force a Telegraph card before any kill-tier entry.

### 4. Major. The Gas Roll cannot reach its ADR-0014 target
Gas Roll, Gas Rating, Standard Issue. Start 6 lasts 14.0 rounds unpushed and 7.2 pushing every round; start 3 lasts 10.6 and 5.5; only start 1 or 2 gives 6 to 9 rounds. "Empties in 6 to 8 rounds, about 4 pushing" needs a Standard Issue Gas Rating of 1 or 2, which makes Funding's gas scale meaningless and one bad roll a Jam. Fixes: (a) two fixed Gas dice per ODM round regardless of Rating (a third of a point lost per round: Rating 2 lasts 6 rounds, Rating 3 lasts 9; a Push adds a die); (b) gas as a counter, one per ODM Position step, the Gas Roll only after a Push; (c) keep supply dice but also lose 1 on any Gas Roll with no 6.

### 5. Major. Scars plus no in-field relief is a death spiral, not Levi
ADR-0008, Stress, Stress Response, Resolve, Rally. With base 5 and Resolve 3, the chance of a clean success (a 6 and no Mess Up) peaks at Stress 3 (0.77 vs 0.60 at Stress 0) then falls: 0.67 at 5, 0.58 at 6, 0.33 at 8. Repeated responses and Mess Ups add Stress; relief is minus 1 per Waypoint camp and Rally does not touch Stress. A two-Scar veteran who pushes twice a fight sits at Stress 5 or 6 by the second engagement of a Leg and Messes Up half their responses for the rest of the Expedition. Alien's four-attribute condition table also does not map onto six attributes. Fixes: (a) cap Stress at Resolve + 3; (b) each Scar raises minimum Stress and Resolve by 1, keeping the peak-at-3 sweet spot; (c) a data trigger for minus 1 Stress: a Nape kill or the end of an Engagement.

### 6. Major. Pushing after a locked Stress-die 1 is undefined, and base-die 1s mean nothing
ADR-0004, Push, Stress Dice, Gear Dice. Coriolis locks 1s because they are the push cost (Hope). Here base 1s cost nothing, so locking them only shrinks the re-roll. Alien forbids the push after a Stress-die 1; the ADR implies you can. Scenario: a Stress die shows 1, Response rolled; the player pushes, the new Stress die shows 1. Two Responses for one action? Does the locked 1 count again? Fixes: (a) Alien's rule: a Stress-die 1 forbids the push, only Gear 1s lock; (b) one Response per roll, evaluated once after the push decision, base 1s re-roll normally; (c) give base 1s a cost (Gas or Blade wear) if the lock stays.

### 7. Major. Formation Posts split the Squad and starve the teamwork engine
Formation Post, Leg; ADR-0009, 0010. Posts are per soldier and the hazard hits one Post, so a six-soldier Squad across six Posts is kilometres apart and the hit soldier responds alone (finding 2). Canon squads ride as one unit in one part of the formation. Fixes: (a) Post is a Squad property and the hazard d6 picks which Wing pair is at the point of contact; (b) Posts are Wing-pair posts; (c) keep per-soldier Posts with a flare-relay clock of two or three rounds before the rest arrive.

### 8. Major. The Grab countdown is in cards, so lethality scales with Tempo
Grabbed, Tempo; ADR-0014. Tempo 3 can grab, lift and devour on three consecutive cards in one round, before any player acts if the Titan's cards come first; Tempo 1 gives two full rounds. Breaking the hand needs two Toughness bursts (43% each at 5 dice pushed), impossible in one turn. "1 in 3 with comrades close" is about 1 in 3 at Tempo 1 and near certain at Tempo 3, before the torso Critical Injury's own lethal entries. Fixes: (a) count in the victim's turns: lift after their next turn, devour after the one after; (b) a Grab consumes the Titan's remaining cards that round (it holds and stares, which is canon); (c) a hand is Toughness 1 while holding someone.

### 9. Major. Behaviour and Position can mismatch, and tables can run out of legal entries
Next Behavior, Attention Ladder, Body Part State. Next Behavior is pre-rolled before the target is known and Attention is re-evaluated at resolution: a Grab against a Distant "loudest" target, a stomp against an On Body soldier. Two Broken parts plus the no-repeat rule can leave a d6 table with no legal entry. Nothing says whether an Attention holder at Blind Spot stays there when the Titan turns. Fixes: (a) every entry carries a Position requirement and a fallback (usually "the target moves one step toward In Reach"); (b) tables keyed by Position band; (c) re-roll Next Behavior, revealed, whenever a part breaks (a visible reward for setup).

### 10. Major. An allied Shifter is unmodelled and unavoidable at Close Canon Proximity in 850
ADR-0002, Shifter ("always a GM-side threat"), Canon Proximity. Trost, the 57th Expedition, Stohess, Utgard, the Uprising and Shiganshina all put Eren on the Squad's side. Fixes: (a) allied Shifter as a Background clock that resolves an objective when full (the boulder) and doubles as a Fear source; (b) a Canon Clock-locked Squad Tactic; (c) restrict Close Proximity to campaigns starting after 850, stated in the ADR.

### 11. Minor findings
- **Health is vestigial** (ADR-0005). Only falls, fire and human weapons touch it, and 845 to 850 has one arc of human combat. Keep it tiny, or drop it and make Down a condition any Critical Injury can inflict. Restrict the block Reaction to human fights; blocking a Titan is absurd.
- **Initiative overflow.** Five PCs plus two Focus Titans at Tempo 3 is 11 cards from 10. State a rule (second Focus Titan enters at Tempo 1, or Wings share a card).
- **Two Focus Titans make Position a matrix.** "One move = one Position step" needs "relative to one named Titan".
- **Squadmate stat block contradicts its duties.** Fear Rolls need Stress and Resolve; do Squadmates Gas Roll, carry Blade Sets, act when their PC spent the turn on a Reaction, take Downtime Actions ("each soldier")? "Nearest" on the ladder means Squadmates soak Attention by default, shielding PCs from the "PC dies every 3 to 4 missions" target. Decide whether that red-shirt economy is intended.
- **ADR-0003 leaks.** "Loudest or brightest" needs a Draw Attention action that sets a flag; "just hurt it" needs a window (since the Titan's last card); Fear Roll triggers "such as" need a closed list; Help's "concretely support" needs a Position rule; Commendations' "following orders" needs per-Frame triggers; Alien's "GM may override the table roll" must be forbidden in text; Preparation Points, Faction Standing drift and Mission Brief complications need tables. Grief has no mechanical effect yet.

## Table and GM load

Per Focus Titan: about six Body Part states, Regeneration clock(s), Nape carry-over, Attention holder, hidden Next Behavior (with no-repeat and disabled entries), Tempo cards, Telegraph flag, Grab countdowns, Openings: about twelve live values, thirty with a second Focus Titan and Background clocks. Per soldier about nine, mostly player-held. A round at four PCs, two Squadmates and Tempo 2 has eight slots, and a PC action can involve three sub-rolls (pool, Stress Response D6, Gas Roll) plus Gear and Blade checks. Estimate 12 to 20 minutes a round on paper: the target kill is 45 to 60 minutes, a two-Titan scene 90 plus. Runnable with a printed Titan card and a Squad sheet; the hidden pre-roll per card is the main paper pain and the main Foundry win. The learning curve (Position graph per Anchor Rating, Ladder, Openings, Reaction cost, Gas, Blades, Stress, Fear, four Injury Location tables, Body Part tables, Behavior Tables per Size Class and Abnormal) is heavier than either parent. The spotlight risk is the Attention holder losing every turn to Reactions.

## Attack on Titan fidelity

It will produce reading a Titan, the turn-around when a cut falls short, blade swaps, gas anxiety, grabs with witnesses' fear, formation attrition, capture ops and research unlocks. Missing or mis-modelled: the allied Shifter (finding 10); night, when Titans are inactive (a Pace or Leg modifier, the reason for night camps); an evacuation Operation Frame (845 Shiganshina, Trost civilians) and a "hopeless order" frame for the 846 reclamation, where Commendations and survival pull apart; "just hurt it" at the top of the ladder is not canon (Titans barely react to pain and are drawn to people), so put "hooked into it" and "nearest human" above it and let Openings rather than pain be the setup currency; the nape cut is a constant 1 m by 10 cm, so Nape Depth by Size Class should be justified as reach and time, not cut size.

## Year Zero Engine fit

The hybrid is incoherent at finding 6. Coriolis' one-gear-item rule collides with ODM and Blade Set dice both applying to a strike: assign ODM to moves and blades to strikes, or state one item per roll. Alien's supply dice are not Stress Dice; say so for Gas Rolls. YZE plays well because a roll is one pool and one push; here an action is a pool, a push of a subset, two 1-checks, a D6 table, a Gas Roll and a blade check. Pools reach 21 dice (Agility 5, Talent 3, Gear 3, Help 3, Openings 4, Stress 3): 21 pushed reaches 5 sixes 73% and 6 sixes 55%, so a veteran squad one-rounds a Large Titan, and ADR-0014 has no reference builds to bind its targets to.

## Foundry VTT v14 (light touch)

yze-combat's initiative groups fit Wings and multi-card creatures fit Tempo; hidden Next Behavior is a GM-only roll with reveal. Data model calls needed now: a Squad actor (Openings, Squad Supply, Squad Points, Tactics, Funding, Faction Standing) like MYZ's Ark actor; Position as a soldier-to-Titan relation, not a token flag; Ladder inputs (hurt since last card, hooked, loud) as flags that expire on the Titan's card; a YAML-to-compendium build step. YZUR and yze-combat compatibility with v14 (ApplicationV2, DataModels) is unverified.

## Open decisions before drafting

1. Attribute scale and point buy (Alien 2 to 5 or Coriolis 2 to 6); Health and Resolve formulas follow.
2. Which attribute and which gear item roll a Nape strike, a Body Part strike, an ODM move, a dodge.
3. Titan behaviours: rolled or auto-hit; what a Reaction cancels; one Reaction per Titan per round or per card.
4. The Nape strike gate (finding 1) and the solo rule (finding 2).
5. "Just hurt it" window; whether Blind Spot counts as hooked; the Attention holder's Position when the Titan turns; Behavior entry Position requirements and the table-exhaustion rule.
6. Regeneration: one clock per Titan or per part; ticks per round or per card; what a tick resets.
7. Grab countdown unit.
8. Stress: cap, push after a Stress-die 1, one Response per roll or per die, meaning of base-die 1s, six-attribute condition table.
9. Gas Roll variant and Standard Issue Gas Ratings by Funding; the gas cost of a Leg.
10. Formation Post ownership (Squad or soldier).
11. Squadmate stat block contents and Downtime Actions.
12. Grief's mechanical effect; Haven recovery amounts; a closed Fear Roll trigger list and whether Scream-style cascades are capped for seven soldiers.
13. Allied Shifter handling under Close Canon Proximity.
14. Three named reference builds (Rookie, Veteran, Levi-grade) for the ADR-0014 simulator.

## Keep

- Behavior Tables with a hidden, pre-rolled Next Behavior plus Read and Call It: a "read the Titan" loop that is data, not fiat.
- The Attention ban on Nape strikes as the single hard teamwork rule, with soft levers around it.
- Legs always advance and failure doubles cost: fail-forward expeditions with no stalling.
- Extraction instead of a kill for Shifters, and the Colossal as a scene-wide disaster.
- YAML as the one source of truth plus simulator-bound targets: the rulebook and the Foundry system cannot drift.
