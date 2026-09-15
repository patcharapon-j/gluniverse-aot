# Claims: The Rules of Play

Page: `site/src/content/rules/rules-of-play.mdx` (route `/guide/rules-of-play/`). Tables are rendered from `data/core/*` by `site/src/lib/core-tables.ts`; check the wording map there against the rows cited. `C` = `docs/rules/01-core-rules.md`, `DP` = `data/core/dice-pool.yaml`, `SC` = `data/core/stress-changes.yaml`, `BD` = `data/core/bonus-dice-sources.yaml`.

## Dice and Successes

- Roll only when an action's Catalog entry is rolled, or a rule or table result calls for a roll. C 27
- GM never overrides, has rolled again, or ignores a die or table result; a roll changes only by a Push or a rule naming the change. C 28
- No dice by judgment; dice enter or leave only via pool steps, Bonus Dice sources, penalties, or a named rule. C 29
- Trying again: in a Titan Engagement, same action on a later turn; outside, the calling rule decides; silent rule means no retry unless it calls again. C 30
- D6, xD6 (added; tables and adding rolls only, never a pool), D66 (tens then ones, 11 to 66). C 34
- Pool holds base, Gear, Stress Dice; distinct colours; Bonus Dice are base dice. C 35
- Every 6 is a success on any kind. C 36; DP 15, 21, 29
- Titan Dice: in no pool, succeed on 5 or 6, never Push, never take Bonus Dice, Help, Gear Dice, Stress Dice. C 36, 289
- Die kinds, Push behaviour, and 1s (DiceKey): base 1 nothing, rolled again unless 6; Gear never rolled again, 1 wears if Pushed; Stress rolled again unless 6, 1 is a Stress Response. DP 13-32
- Attribute roll = rule names an attribute; rolled actions, Reactions, Death Rolls (Strength), called attribute rolls. Only these use a pool, count successes, can be Pushed. C 41
- Other rolls (Gas Roll, table) roll stated dice, add nothing, cannot be Pushed. C 43
- Pool = attribute + one Talent + Bonus Dice + Gear Dice + Stress Dice, in order: name, attribute, Talent, Bonus, penalties, Gear, Stress. C 47-60; DP 36-117
- Step limits (Fig. 1): attribute 2 to 5, 6 on Specialty key attribute; Talent 0 to 3, one Talent; Bonus 0 to 4; penalties never below 1 base die, never Gear or Stress Dice; Gear 1 to 3 from one item, 0 worn; Stress = current Stress, no maximum. DP 44-47, 59-60, 73-74, 86-87, 99-101, 112-113
- Name the roll: one Catalog entry unless a rule calls an attribute directly; entry names attribute and gear; dodge, block, Death Roll are not actions but Talents can name them. C 49
- Talent: at most one dice-adding Talent, must name the entry; entry condition applies (Horsemanship: mounted, horse's Gear Dice); rule-bending Talents apply on trigger and stack. C 55
- Penalties: from a named rule (e.g. Wounds & Fear table), after the cap. C 57
- Gear: worn to 0 adds none; choose one before rolling if several; entry allows none, no Gear Dice. C 59
- Stress Dice in every attribute roll except listed exceptions. C 60
- Rolls called by attribute: attribute alone, no Talent dice; Bonus Dice from covering sources, Gear only from item the rule names, Stress Dice. C 53
- Actions outside the Catalog: change only a named value; player names it; uses an entry that changes it, or the attribute alone where the creating rule names an attribute roll; entry for every purpose; no value, no effect. C 51
- Death Roll: no Stress Dice, never a Stress Response, cannot be Helped. C 60
- A roll leaves out pool parts only if its rule says so and it is listed; a procedure may forbid Help or Push without a listing (Graduation Exam Trials). C 60
- Exceptions table: Death Roll (Strength; leaves out Stress Dice; no Help; no Push; Talent dice allowed); performance roll (higher performance attribute; leaves out Talent, Bonus, Gear, Stress; no Help; no Push). DP 129-145
- Final when Pushing stops or cannot; each 6 one success. C 66
- Needs 1 success unless rule names more; Nape strike needs Nape Depth; Reaction needs none, cancels; failure does only what rule states, else no effect. C 67
- Successes beyond need do only what the rule lists; some rules total across rolls (Toughness). C 68
- Each success used once; exception: Reaction cancels against several attacks from same Titan or Foe that round. C 69
- Examples (Liesel, Emil): Nape strike is Strength with Blade Set gear; Clean Cut names Nape strike. `data/character/action-catalog.yaml` 117-122; `data/character/talents.yaml` 74-80

## Pushing Your Luck

- Push trades Stress (and wear) for a second chance; allowed after failure or success. C 73
- Cannot Push: Stress Die 1 on the roll or after an earlier Push; rule forbids (Death Roll, first two Trials); not an attribute roll; already Pushed the allowed number (once unless a Talent); a held state or result forbids (Down). C 77-85; `data/harm/down.yaml` 23
- Extra Pushes follow the same procedure; a Stress Die 1 after any Push rules out more. C 85
- Push steps (Fig. 2): roll, Stress Die 1 means Stress Response and no Push; decide, one comrade may Cover before any die is rolled again; gain 1 Stress and add 1 Stress Die, or Covering soldier gains it and no die is added; roll again base and Stress Dice not showing 6 plus the new die, 6s stay, Gear Dice never rolled again; Stress Die 1 now means a Stress Response. C 91-96; SC 21-27
- Bonus Dice rolled again unless 6; Gear Die 1 stays locked. C 94; DP 24
- One Stress Response per roll, however many 1s or Pushes. C 98
- Gas: Pushed roll with ODM Gear makes that round's Gas Roll three dice; three however many; not if the Gas Roll was already made; Pushed ODM dodge counts; Pushed mounted horse dodge wears the horse and does not by itself make it three. C 108
- Gear Die 1: if Pushed, each 1 when final wears its item by 1; these are first-roll 1s; unPushed roll no wear; ODM Gear at 0 Jams. C 103; DP 25
- Base die 1 nothing; Stress Die 1 a Stress Response. C 102, 104
- Finishing order: count; resolve Stress Response on Wounds & Fear table at post-Push Stress unless the rule names another resolution (Graduation Exam), which still has the Response and still cannot be Pushed after; apply a change to roll or action now; changed count holds for later uses incl. Reaction cancelling; apply effect; apply wear if Pushed. C 112-117
- Who can Cover: not the Pusher, not Down; player character (Squadmates never Cover); in a Titan Engagement same Position or one step; outside, qualifies to Help under the calling rule, no Help means no Cover; no held state or result forbids. C 125-130; SC 29-45; `CONTEXT.md` 57
- When: after Push declared, before any die rolled again; one Cover per Push; Pusher can refuse; Pusher chooses among offers; Push rolling no die again (all base and Stress Dice show 6) cannot be Covered. C 131
- What it takes: Coverer gains 1 Stress; not an action; spends neither move nor action; outside spends nothing, needs only Help eligibility. C 132; SC 32, 43
- Effect: Pusher gains no Stress, adds no die; Stress Dice still rolled again; Stress Die 1 still gives the Pusher a Stress Response; Gear 1s still wear the Pusher's gear; Coverer makes no roll, no Stress Response. C 133-134
- Example (Greta): any wear ruins a Blade Set. `data/gear/items.yaml` 93

## Stress

- Stress is fear and adrenaline; Stress Dice = current Stress except exceptions (Death Roll); 6 succeeds, 1 sets off a Stress Response; more capable and more likely to break. C 140
- No maximum; starts at minimum; losses stop at minimum. C 140, 142; SC 11-17
- Carries over between Titan Engagements, Expeditions, sessions; changes only through listed triggers; GM never changes it without one. C 144, 155
- Minimum = number of Scars, 0 with none; never below; rises immediately on a new Scar. C 148-150; SC 12-15
- Scars mean at least that many Stress Dice; Scar raises Resolve by 1; Resolve counts against Stress Response and Fear Roll results; five Scars must retire. C 151
- Table rows: Push +1 (uncovered); Cover +1; named gains incl. hunger and Fear contagion (within one Position step, Stress not a roll, no Fear Roll); Engagement ends -1 (any reason incl. retreat; everyone, PCs and Squadmates, who held a Position at any point); Nape kill -1 (everyone holding a Position at the kill); named losses; camp relief -1 (camp roll succeeds, no hunger; everyone on the Expedition); Skirmish ends -1 (everyone who took part); Downtime -2 (Recover, Visit Haven, Squadmate relief); Graduation Exam ends, lose all (every Cadet who took it). SC 20-110
- Both at once: Nape kill ending the Engagement triggers both in full. C 163; SC 66, 75
- Holding a Position is the test; end relief includes soldiers who left, retreat still gets it however many rounds; kill relief for holders at the moment, not only the striker; departed soldiers get nothing from the kill. C 165-168
- Rally clears a Stress Response, does not lower Stress. C 171
- Downtime: Haven lowers Stress and Grief via Downtime Actions such as Visit Haven. C 173
- Stress Response only from a Stress Die 1, at most one per roll, never on a roll with no Stress Dice; table and Resolve in Wounds & Fear. C 177
- Fear Roll never from dice; closed list of horrifying events in Wounds & Fear. C 178

## Bonus Dice and Help

- Bonus Dice are extra base dice from Help, Openings, and listed situations. C 182
- Listed sources only; declare before rolling, none after, not even before a Push; cap 4 from all sources; over the cap roller picks; unused sources unspent (Openings stay, unused helper keeps action); base dice (6 succeeds, Push rolls again unless 6, 1 nothing); penalties after cap. C 184-189; BD 9-12
- Table rows: Help 1 per helper up to 3 (not Death Roll, performance roll, or roll whose rule forbids Help; spends action in a Titan Engagement, else what the rule states); Opening 1 per Opening spent (Nape strike; not your own Opening; spends the Opening); grounded Titan 2 (Nape strike; Broken leg); Reading from Distant 2 (Read; hold Distant to the Focus Titan); Call It 2 (dodge; comrade's Read Called the behavior; reader's own dodge gains nothing); medical supplies 1 (Treat Injury in a care window, never in a Titan Engagement or aftermath; 1 medical unit held; spends it); Ambush 2 (soldier's Fight or Shoot in a Skirmish; Squad has the ambush and Foe has not acted). BD 14-130
- Help adds 1 die; up to 3 comrades; comrade = any other soldier, PC or Squadmate. C 193
- Help requirements: not roller, not Down; PC or Squadmate whose action list has Help; roll allows Help (exceptions table, own rule); declared before; in a Titan Engagement unspent action this round (turn or action spent in advance begins spent) and same Position or one step; outside, calling rule's requirement; no held state or result forbids. C 199-207; BD 23-42
- Effect: 1 Bonus Die per helper, counts toward cap; helper does not roll, cannot Push it, no Stress, no Stress Response. C 211-212
- Spends: helper's action in a Titan Engagement; can Help outside own turn or during a comrade's Reaction while action unspent; later own turn has only its move. C 216
- Outside a Titan Engagement: allowed only where the calling rule allows; that rule (Catalog entry, Chase, Expedition, Downtime) states who and what it spends; silent means no Help and no Cover; Effect limits apply. C 220

## Turns, Actions, and Reactions

- Titan Engagement runs in rounds; Fighting Titans sets order (initiative cards, Tempo, Wings). C 224
- Each round every PC takes one turn of one move and one action; baseline move is one Position step; Overloaded makes ODM moves spend the action too. C 228
- Action = Help or one Catalog entry not marked as not an action. C 229
- Move and action once per round, not saved, refresh each round except those spent in advance. C 230
- Declining: may decline either or both; unspent parts stay until round end but only for Help and Reactions (Reaction needs both); a lone held move does nothing after the card passes; held parts lost at round end. C 231
- Spending a turn: earliest turn from this round with move and action both unspent; if this round's is partly spent, next such turn, skipping turns spent in advance. C 232
- Spent in advance: begins its round spent; a result spending only the action in advance leaves the move; rules read that state; turn spent means no Help, no Reaction with that turn, nothing to decline; action spent means no Help, no Reaction with that turn, hold only the move. C 233
- Forbidding: a state or result forbids Push, Help, Cover, or Reaction only by naming it; other requirements still apply; Down forbids all four; Grabbed forbids Help, Cover, Reaction. C 234; `data/harm/down.yaml` 23; `data/engagement/grab.yaml` 16
- Not actions: Reactions, Pushing, Covering, declaring Bonus Dice sources, spending Openings on the roll they join. C 235
- Reaction: dodge or block when a Titan or Foe acts against you, outside your turn; against a Titan, when a card resolves a behavior against you and its Attack Dice are rolled. C 239
- Full-pool attribute roll for its own entry; can be Helped and Pushed. C 240
- Spends one whole turn (move and action). C 241
- Can react whether or not you acted, if no earlier Reaction against that Titan or Foe this round and nothing forbids it; none against a 0-success attack, Reaction kept. C 242-246
- Which turn: this round's if both unspent; else next turn in full and this round's remainder usable on your card if not yet come; if next is partly spent, the one after, and so on; Grab gives back a later turn spent by the dodge against that card or the earlier cancelling dodge; turns spent in advance still happen and count for turn-counting rules, begin with no move or action, no Help or holding. C 247-252
- Engagement ends: turns and actions spent in advance cancelled; nothing owed; next Engagement starts unspent. C 253
- Severity = attack's successes; Net Successes = what remains after cancelling. C 259, 262; `CONTEXT.md` 187-189, 332-334
- Attack and Reaction (Fig. 3): attacker rolls and finishes first incl. allowed Push (soldier vs person may Push; Titan and Foe never), Severity announced, roll then fixed; each target decides knowing Severity, rolls for own entry with Help and Bonus Dice declared before, Pushes last, changes only by its own Push and Finishing step 2; target already reacted to that Titan or Foe this round rolls nothing new and cancels with that Reaction; each Reaction success cancels one attack success; leftover = Net Successes, 1+ lands and effect reads Net Successes, 0 whiffs; no Reaction or forbidden one cancels nothing; 0-success attack whiffs against all, no Reaction made. C 259-263
- Each target cancels against the same roll with their own Reaction; one attack can land on one and whiff on another. C 265
- Against a Titan: only dodge, no block; Agility, Gear Dice from ODM Gear or horse while mounted, one item; Titan attack is the behavior's Attack Dice as Titan Dice; one Reaction per Titan per round; choose to dodge when a card resolves against you with 1+ successes, declining leaves all net and keeps a later dodge; dodge successes (after Finishing step 2) cancel against that card and separately against later cards that round; each card on its own Net Successes; later cancelling does not use successes up; Critical Injury adds 1 per Net Success beyond the first; Grab, knock loose, Stress gain take no rider. C 267-274
- Against a person: in a Skirmish, dodge or block as the attack allows; one Reaction covers every attack that Foe makes against you that round, separately; landed attack deals weapon damage plus 1 per Net Success beyond the first; Skirmishes gives which attacks, Guard, ambush. C 276
- Block only where the attack allows it: a Foe's Fight attack in a Skirmish; no Titan allows it. C 278
- Closing example (Mila, Oskar): all numbers and steps. C 297-314
