# Claims: Making Your Soldier

Page: `site/src/content/rules/making-your-soldier.mdx` (route `/guide/making-your-soldier/`). Tables are rendered from `data/character/*` by `site/src/lib/character-tables.ts` through `CoreTable`; check each wording map there against the rows cited. `C` = `docs/rules/02-character-creation.md`, `AT` attributes, `LP` lifepath, `OR` origins, `EN` enlistment, `TY` training-years, `CR` class-rank, `GE` graduation-exam, `SP` specialties, `SQ` squadmates, `TA` talents, `AC` action-catalog (all `.yaml` in `data/character/`).

## What a Soldier Is

- Every player character is a Training Corps graduate in the Survey Corps; three procedures: Lifepath always, Template Build or Free Build when the campaign allows. C 41; LP 27-45
- Sheet: attributes; Health (boxes), Resolve, Stress, minimum Stress; Origin and Haven; Drive, named comrade if needed, used this session (cleared each session); Merit, Class Rank, declined Military Police (Top 10 only), none for built or promoted; Specialty; Talents with once-per-Titan-Engagement uses beside them; Canon Tie optional; Rank Private; harm (Health lost, Down, Scars, Grief, Critical Injuries, more in Wounds & Fear), none at creation; gear Standard Issue. C 43-53; LP 221-254
- Talents are the only trained abilities; roll = attribute + at most one Talent naming the entry + Bonus, Gear, Stress Dice. C 55
- Attributes table (Covers, Catalog entries that name each, key attribute of). AT 17-47
- Which attribute a roll uses is set only by its Catalog entry. C 61; AT 15-16
- Rated 2 to 5; only the Specialty key attribute can be 6. C 74; AT 9-12
- Attributes never rise after creation, whatever the procedure; growth via Talents and Scars. C 75; AT 13
- Health = (Strength + Agility) / 2 up, row of boxes; untreated Critical Injury crosses one box up to Health; damage marks the rest; 0 is Down; Titan attacks inflict Critical Injuries without reducing Health first. C 102; AT 153-159; `CONTEXT.md` 203, 207
- Resolve = (Instinct + Empathy) / 2 up, +1 per Scar, -1 per Grief, at most 3 Grief count; none at creation. C 103; AT 161-168
- Stress starts at 0, the no-Scar minimum. C 104; AT 169-178
- Carrying limit Strength + 4 before Overloaded. C 105; AT 179-182
- Rounding on halved attributes; computed from final ratings after swap and floor, or built ratings. C 107; AT 164

## The Lifepath

- Cadet from Origin through three Training Years to Graduation; create together, because the Exam and starting Squad involve everyone. C 111
- Fig. 1 summarises steps: Origin (base 2, D66, +1 two attributes, Talent 1, Haven, Canon Tie; condition means roll again); Why You Enlisted (+1, any row's Drive, point never moves); Training Years (event +1 attribute, +1 Talent level, Merit; performance roll; Exam replaces third); Graduation (Class Rank, Specialty, swap and floor, Top 10, Specialty Talent; no attribute above 5 before Graduation, no Talent above 2); Finish (derived values, Rank, harm, Standard Issue, name; then Squadmates and named comrades). LP 73-149
- Campaign Year: players record 845 to 850 if none; changes only when a rule names a change, none does; Origin conditions use the current year; later soldiers use the year reached. C 121; LP 74-84
- Exam vote before the Lifepath; a later replacement votes alone before its Lifepath and takes the Exam alone. C 122; LP 76-84; GE 13-19
- GM plays no part beyond reading tables; every result from a roll, row, or table-given choice. C 115
- Shared choices: each proposed choice rolled once with a D6 by one proposer; highest decides; ties roll again; covers Exam, Campaign Year, fewer starting Squadmates, Squadmate templates; Trial order is rolled; campaign choice is the GM's. C 117; LP 13-20
- Campaign choice: GM at session zero before the first soldier; Template, Free, or both; never changes; covers every soldier incl. replacements; each player picks any allowed procedure; tables can mix. C 113; LP 47-61
- Origin steps 1-6: set 2s; D66, roll again on unmet condition; +1 each of two; level 1 in one of two Talents; one of two Havens; Visit Haven lowers Stress and Grief; may record Canon Tie. C 126-131; LP 86-93
- Canon Tie optional, no effect on play, at most one, only from an Origin row. C 133
- Origin table rows (D66 bands, attributes, Talents, Havens, Canon Ties, Wall Maria Refugee kept only in Campaign Year 848 or later). OR 18-194
- Why You Enlisted: D66, +1 to rolled row's attribute; rolled Drive or any other row's; point never moves; named comrade named when the Squad forms. C 156-160; EN 13-17; LP 95-100
- Why You Enlisted table rows (reason, attribute, Drive, trigger, test, target, needs a named comrade). EN 90-248
- Training Year: event D66, +1 attribute, +1 level in one of two Talents, add Merit (can be negative); then performance roll adds Merit. C 185-189; TY 11-15; LP 102-121
- Before Graduation no attribute above 5; overflow to another attribute below 5, player's choice. C 81; AT 59-62
- No Talent above level 2 at creation; rule Talent not above its max level (usually 1). C 191; TY 17-18
- Fallback: neither Talent can gain, take 1 level in any curriculum Talent that can; only gainer names only uncalled entries, take it or a curriculum Talent. C 197-198; TY 19-26
- Lifepath gives exactly 5 Talent levels: Origin 1, events 3, Specialty 1. C 200; LP 65-70
- Training Years table (performance attributes, curriculum) and the three event tables (D66 bands, attribute, Talents, Merit change). TY 44-277
- Performance roll: attribute roll for its own entry; higher of the two attributes, pick if equal; each attribute in exactly one year; attribute alone, no Talent, Bonus, Gear, Stress Dice; no Push, no Help; Merit by successes; one per year, never tried again. C 275-280; TY 31-42
- Merit table 0/1/2/3+ successes give 0/1/2/3. TY 37-41
- Exam replaces the third performance roll; third event still happens. C 291; TY 42; GE 20-21
- Graduation order: Class Rank from total Merit (shared ranks allowed); Specialty, not rolled, no requirement, never changes; swap then floor; Top 10 declines Military Police, key attribute +1 up to 6; 1 level in a Specialty list Talent up to 2. C 299-305; LP 123-131; SP 12-19
- Specialty Talent never from the general list (general list gets no Specialty level). SP 34-37
- Swap: any other attribute higher, swap with the highest of the other five; player picks among ties; key holds highest. C 83; AT 65-69
- Floor: still below 4, raise to 4, lower another attribute rated 3+ by 1 per point; only when every attribute is 3. C 84; AT 70-72
- Top 10: record "Declined the Military Police"; only way to 6; no other effect. C 85, 303-304; CR 63-69
- No free points; total unchanged; 18 points, 19 with Top 10. C 86; AT 73, 76
- Class Rank table (bands, ranks, Top 10 at 6+; class of 200; shared ranks). CR 10-61
- Finish: built soldier uses same steps; Health boxes, Resolve, Stress 0, minimum Stress 0; Private; Health lost 0, not Down, no Scars, Grief 0, no Critical Injuries; Standard Issue; name. C 327-333; LP 133-141
- Medic also receives a medical kit and an Engineer a tool kit via Standard Issue. C 473
- After all finish: starting Squadmates; each Drive needing one names a living PC or Squadmate other than own soldier. C 337-338; LP 143-149; EN 75-78
- Example (Mira): all rolls, rows, attributes, Merit, Class Rank 25, Slayer no swap, Tactician and Hunter alternatives, final ratings 18, Talents 5, Health 4, Resolve 3; Nape strike 7 base dice; Horsemanship dodge only mounted with the horse. C 797-824; OR 71-82; EN 172-183; TY 92-97, 128-133, 236-241; CR 38-41; TA 74-80, 134-139, 194-199, 268-277

## The Graduation Exam

- Optional prologue of three Trials; Merit replaces third performance roll; feeds Class Rank. C 344; GE 1-2
- Vote before Lifepath; all Cadets created together take it; later replacement decides before its Lifepath and takes it alone. C 348; GE 11-19
- After every Cadet's third event, before Graduation. C 349; GE 22
- Merit of all three Trials, after Stress Response costs, replaces third roll; third event keeps attribute, Talent level, Merit. C 350; GE 20-21, 64-67
- Built soldiers take no Trial, no Exam Merit, whatever the vote; only Lifepath Cadets count in roll order and Help. C 351; LP 167-172
- Not a Titan Engagement: no rounds, turns, Positions, Attention, Titans; no Gas Rolls, no Blade Set counting; ignored requirements (Titan, Position, Attention, Grabbed or Down soldier, patient, comrade with a Stress Response, worn or Jammed item); exam issue always meets gear requirement. C 355-356; GE 24-27, 50-54
- Exam issue table: training ODM Gear, Blade Set, medical kit, tool kit, each 1 Gear Die; wear applies during, no effect after; handed back. C 356; GE 28-43
- Pools: full pool, one dice Talent naming the entry, Bonus Dice only from Trial 3 Help, Gear Dice from the listed item, Stress Dice; rule Talents apply; only Trial 3 can be Pushed. C 357; GE 44-51
- No Trial roll takes Circumstances: the Exam is creation, played before the campaign begins. C 357; GE 28
- Stress starts 0, stays through later Trials, adds Stress Dice; returns to 0 at the end. C 358; GE 55-58
- Stress Response still happens, no Push after; not on the Wounds & Fear table; costs 1 Merit on that Trial; can go negative; nothing else. C 359; GE 59-67
- Order: finish a Trial before the next; D6 each Trial, descending; ties roll again among themselves; players never choose. C 360; GE 69-74
- Trials table (Fly with training ODM Gear, 2+ successes 1 Merit, no Push, no Help; Nape strike with training Blade Set, same; squad field exercise, six rolls with gear, 3+ successes 1 Merit, Push yes, fixed Help). C 364-381; GE 76-131
- Trials 1 and 2 cannot be Pushed, Helped, or Covered. C 385-386
- Trial 3: pick a roll, needs 3 for 1 Merit, can Push; every other Cadet qualifies to Help but only the next in order Helps, first Helps last; each Helps exactly one roll, declared before, spends only that; alone means no Help. C 387-388; GE 111-117
- Covering: any Cadet who qualifies to Help can Cover whether or not they Helped, until they have made their own roll; then cannot Cover until the Trial ends; Covering spends nothing. C 389; GE 118-128
- Merit only from own roll; no group bonus. C 390; GE 132
- Example (Anka): D6 order and re-roll of ties, cycle Help, Read pool (Instinct 3, Titan Reader 1, Help 1, no gear, no Stress), Push Covered by an unrolled Cadet, Coverer's Stress adds a Stress Die to his later roll, Pusher adds no Stress Die. GE 70-74, 111-128; TA 159-164; `docs/rules/01-core-rules.md` 125-134

## Drives

- Keeps a soldier fighting; shrugs off one Fear Roll result per session while the trigger is met by own act, a Position moved into, or own ODM flight; a Why You Enlisted row; "When I ..." trigger. C 400; EN 19-28
- Using: result about to take effect; check trigger by test and target; if met and unused this session, may shrug off (it does not take effect); one per session; record the use. C 404-407; EN 21-28
- Own state: Position held or own ODM flight, true when the result is about to take effect; Position counts only if own move put you there; placed at start or by another rule does not count until own move; Grab counts as another rule's change even if still On Body; flight only through own ODM use, carried soldier not airborne; never Attention, comrade's state, Body Parts, own Stress, Grief, injuries. C 413-416; EN 34-46
- Most recent turn: took a named act on most recent turn in the current Titan Engagement, earlier this round or an earlier round. C 417; EN 47-51
- Since most recent turn began: took or used a named act from the start of that turn until now, on it or outside it (Help, Cover, dodge, Push on a comrade's turn). C 418; EN 52-57
- Turn tests never met before first turn, never outside a Titan Engagement unless a turn-giving rule says so (Skirmish turns; no Leg roll or camp roll is a turn); Position triggers only in a Titan Engagement; flight anywhere. C 420; EN 58-61
- Acts are Catalog entries plus Push; Covering is the Cover entry. A called roll counts as the roller's own act of the entry the GM named for it, an improvised act in a fight as its model entry, and a called roll named on an attribute alone is no act; the turn tests keep their timing, so a called roll meets one only in a Titan Engagement or a Skirmish. C 422; EN 29-37
- Targets: any; named comrade (Help to their roll, Cover of their Push, entry on them); Grabbed or Down comrade (at use, or when the result is about to take effect; already used, intention never counts; Help, Cover, Treat Injury, Lift Comrade, Break Free on a Grabbed comrade's behalf with Pry Loose, Body Part strike on the holding hand). C 424-428; EN 62-74
- Named comrade: living PC or Squadmate other than the soldier; named at Squad forming or when recorded later (replacement, promoted Squadmate, new character); promoted Squadmate stays named; no other living soldier means take a Drive needing none. C 432-434; EN 75-83
- Comrade dies, retires, or leaves: Drive never triggers again; promotion is not leaving; next session pick any row's Drive, no attribute point. C 435-436; EN 84-88

## Specialties and Talents

- Specialties table (key attribute, summary, eight-Talent lists; General list of twelve). C 446-461; SP 39-108
- Choose at Graduation or a build's Specialty step; not rolled, no requirement, never changes. C 463; SP 12-15
- Grants: key attribute (only one that can be 6); swap and floor at Graduation only, highest rating and at least 4 without adding points, built soldier takes neither; 1 level in a list Talent at Graduation or a build's Talents step, max 2. C 464-467; SP 16-19
- Never grants permission: every soldier can attempt every entry, hold any Talent; untrained still rolls full attribute; Squadmate rules still apply. C 468; SP 20-24
- List limits only the granted level. C 469; SP 25-27
- Each list eight Talents: 3+ dice (one with a condition), 3+ rule, 2+ naming a Leg, Night Camp, Requisition, or Skirmish roll or trigger; a Talent on at most two lists, at most four do; Well-Kept Rig on Flier and Engineer. C 470; SP 28-33
- General list: twelve temperament and survival Talents, at most four dice; any soldier; never takes the Specialty level. C 471; SP 34-37
- Specialty grants nothing else besides Standard Issue kits. C 473
- Levels 0 to 3; not above 2 at creation; rule Talent max level 1 unless stated; level 1 means having it. C 481-482; TA 15-29
- Description only summarises; type, max level, names, condition, trigger, effect, limit are the rule. C 477; TA 38-40
- Creation 5 levels; Lifepath rows offer only some Talents; others via a build or after creation. C 507
- After creation only XP and Train Downtime Action (not yet covered). C 508; TA 66-69
- Dice Talent: base dice = level on a named entry's roll; condition limits (Horsemanship mounted with horse as gear; Ground Work against a grounded Titan); condition may name an Expedition moment (Route Finder on the Leg roll, as Lead), elsewhere never met; at most one dice Talent per roll, roller picks; names only action, reaction, roll kinds; non-naming Talent adds nothing; unusual actions decided by the outside-Catalog steps, and on a called roll or an improvised act by the entry the GM names. C 486-490; TA 20-24; TA 88-96, 173-181, 268-277
- No Talent changes, ignores, or lowers a Circumstances step; one that helps against bad conditions adds dice instead. C 491
- Rule Talent: effect every time trigger occurs, within limit; "You declare" met at declaration before requirements, targets, pool, cost; changes those checks; still unqualified means not taken, nothing spent; other triggers on the event; Talents changing who qualifies, target, attribute, gear, cost use "You declare". C 494-495, 503; TA 30-36
- Rule Talents stack with each other and the dice Talent. C 496; TA 25-29
- Changes only what its effect states; no Bonus Dice, Stress, or uncalled roll unless it says. C 500
- Squad-shared effect (Leg hazard roll, Night Camp ration, Camp Relief) says so, applies once per use however many hold it. C 499
- Changes to values another chapter sets (Rally Position requirement, canister cost) apply to what that chapter sets. C 501
- Once per Titan Engagement: between start and end of each, never outside, unless a rule creating another procedure applies it; applies to Leg, Night Camp, Skirmish; nested Titan Engagement or Skirmish inside a Leg or Night Camp has its own use, neither spends the other. C 497; TA 45-54
- Once per Leg, Night Camp, Skirmish, Downtime: Talents only that procedure can trigger; once each, never outside; Leg from Leg roll to end of hazard; Night Camp from camp roll until the day has passed. C 498; TA 55-65

## Actions

- Catalog is the complete list of named actions and rolls, the list Talents name; every attribute roll is for one entry. C 516
- Kinds: action (your action in a Titan Engagement or Skirmish); reaction (Titan or Foe acts against you, outside your turn, spends a turn, not an action); roll (attribute roll when a rule calls for it, and for the nine called-roll entries when the GM calls one, not an action, spends no turn); option (use of another entry or rule, not action or roll, spends nothing unless stated); fixed roll (not an attribute roll; Fear Roll, Stress Response roll, Gas Roll; never Talent dice; only rule Talents name it). C 523, 577, 587; AC 13-30
- Entries state rolled (when taken, when a rule calls, when a rule or the GM calls, never), attribute, gear (pick one), requires gear, context, requirements and needs, changes, Help outside a Titan Engagement including Help on a called roll; owning chapter gives procedure. C 521-534, 552; AC 27-50
- Help and Draw Attention unrolled actions, Cover and Call It options, in the Catalog for rule Talents. C 576
- Gear rule applies every time an entry is taken, made, or called, named or via the outside-Catalog steps, PC or Squadmate; requires gear and none: attribute alone (attribute, no Talent dice, no Gear Dice, rest applies; only a rule Talent naming it changes it, Make Do) or not possible; worn to 0 counts as not had (ODM Gear: Jam), and other states Gear & ODM names; requires_gear false with no item rolls without Gear Dice. C 540-545; AC 48-62; TA 824-829
- Examples: last Blade Set gone, no Nape strike; no medical kit, Treat Injury on Wits alone. C 547
- Entries defined only as far as Talents and pools need. C 551; AC 5-6
- Nape strike Strength, Blade Set, only from Blind Spot, never by the holder of Attention; Nape strike, and Body Part strike from On Body or Blind Spot, need ODM Gear that counts as had unless grounded. C 551, 555; AC 115-138
- Body Part strike Strength, Blade Set; Break Attention Perception, ODM Gear or horse; Read Instinct no gear; Break Free Strength, Blade Set if any, also while Held; Heave Strength no gear, body off a Pinned comrade; Draw Attention not rolled; Fly Agility ODM Gear, called roll, not an action; Leap Clear Agility, ODM Gear or horse while mounted, called by a falling Titan, not action or Reaction, spends nothing; Ride Agility horse, not an action, Leg roll on a Hard Ride; Dodge Agility, ODM Gear or horse while mounted, Pushed horse dodge wears the horse not ODM Gear and does not by itself make the Gas Roll three dice, also against a Foe's Fight attack or shot. C 555-564
- Fight Strength, Blade Set in handles or bare-handed no Gear Dice, Grapple is a Fight with no Gear Dice; Shoot Agility, loaded pistol or musket, or flare at a person (1 flare, no Gear Dice), neither means not taken; Block Strength, Blade Set if any, Foe's Fight attack only, no Titan; Reload option unrolled, loads, 1 shot of Squad Supply; Release option unrolled, lets go of a Grappled Foe, spends neither move nor action. C 568-572
- Spot, Survive, Endure on Legs and Night Camp; Persuade, Recall, Size Up for Requisition and Skirmish; Sneak for the ambush. C 575, 589
- Those seven, with Fly and Ride, are the nine entries a called roll is made for; Fly outside a Titan Engagement needs 1, and a called Ride or Fly takes that entry's Gear Dice. C 581, 590, 632
- Mount or Dismount part of a move; Swap Blade Set, Shed Load parts of a turn; Restock Medical Kit part of a care window; Swap Initiative Card part of the swap step; Squad Tactic uses a held Squad Tactic; outside a Titan Engagement each used as its entry states; Downtime Action and Squad Action are Downtime options. C 582-583, 589
- Outside the Catalog (Fig. 3), outside a Titan Engagement and a Skirmish only: name the one value; description never limits; value alone decides; none means the GM rules on it; Position or Engaged and Apart is a move (Fighting Titans, Skirmishes), stop; list every entry that changes it, meet requirements of one, pick; that entry for every purpose (kind, attribute, gear, needs, effect, cost, Talents); apply gear rule, not possible cannot be used; no usable entry: rule-named value rolls its named attribute alone, otherwise the steps cannot change it and the GM rules. C 599-607; AC 1040-1071
- Rule-created clock, counter, obstacle: names the entries or the attribute roll; attribute alone, no Talent dice, Gear only from a named item. C 630, 632; AC 102-113
- Called roll (ruling before anyone rolls, outside a fight): the GM says it happens with no roll, cannot be done, or is a called roll; names the entry (one of the nine, or an attribute alone), the Circumstances (Standard if none), and the stakes (what failure costs, and what success gives where it is not obvious); needs 1 success; made for the named entry for attribute, gear items, the gear rule, and every Talent naming it; can be Pushed and Covered, Help as the GM rules; entry, Circumstances, and stakes fixed once the dice are rolled. C 609-619; AC 1072-1085
- Called on an attribute alone: no Talent dice and no Gear Dice; a gear item or other object that helps counts toward the Circumstances and cannot be worn by a Push; a called Fly or Ride does take that entry's Gear Dice. C 632; AC 1128-1138
- In a fight the steps are not used: the action is Help, an entry taken as written, or an improvised act, and which it is, is part of the GM's ruling. C 621; AC 1086-1127
- Improvised act with a model entry: the GM names it before the pool is built and the ruling stands; always an Action the soldier could take in that fight, never a Reaction, roll, fixed roll, or option; spends the action; made as that entry is made (rolled only if it is rolled, its attribute, gear items, Talents, needs, Circumstances as any roll); meets every requirement and restriction; on a success gives only that entry's effect at its size; never kills a Titan, changes Nape Depth, Toughness, Attack Dice, or a card, cancels or delays a card, creates more Openings than the entry could, or gives an effect no entry has; an act modelled on the Nape strike resolves as a Nape strike that falls short, each success 1 Opening, and counts as hooking in. C 621-629; AC 1086-1127
- Improvised act with no model entry, changing nothing the fight tracks: a called roll, spending the action, with the fight's Help, never giving an entry's effect; changing nothing at all means no roll; the GM says before anyone rolls if it cannot be done. C 621; AC 1096-1104
- Fight examples: wagon cut loose is Break Attention with its needs; swung lantern is Draw Attention, never from Distant; chimney on a leg is a Body Part strike toward that leg's Toughness; rope to a comrade is Help or Lift Comrade; a non-gear object hurled at a person is a Shoot at damage 1 and Crush with no Gear Dice; a dive behind a chimney stack is a move or nothing, never modelled on the dodge and no Circumstances to a later dodge. C 629; AC 1118-1127
- Rulings in this section: whether an unresolved action happens, cannot be done, or is a called roll; a called roll's entry or attribute, Circumstances, and stakes; in a fight, whether an act is an entry taken as written, an improvised act with its model entry, or a called roll. Applied as written: the steps, the entry picked at Match, the gear rule, the rule that a Talent adds dice only to a roll for an entry it names, and every roll's needs, which no ruling raises or lowers. C 634; AC 1139-1148
- Examples (Jonas): torn cloak is Treat Injury, Wits alone; the shout in a Titan Engagement is an improvised act whose model entry is Help, since Call It is an option and never a model entry, so it spends the action, needs Help's Position, is not rolled, and adds 1 die to the comrade's dodge; the prayer finds no match at step 5 and the GM rules that it happens with no roll and no effect. C 638-640
- Example (Ilse, called roll): no value covers holding up a beam, so the GM rules; outcome in doubt and failure would cost, so a roll is called; Endure does not fit a moment's lift, so Strength alone; Circumstances Hard, a 1-die penalty; stakes 2 Crush damage if it fails, with the soldier's current Health stated; needs 1 success; Strength 4 gives 3 base dice plus Stress Dice; Push, Cover, and Help as the GM rules. C 641

## Squadmates

- Named soldier with the PCs; any player directs; Titans target it; can be promoted; serving Squadmates are the Squad Pool. C 625; `CONTEXT.md` 56-62
- What Squadmates are for (more turns and Help, reach Grabbed comrades, decoys, screen Attention, promotion, Drive and grief). C 728
- Templates table (ratings, Talent 1, Health, Resolve; build checks Health and Resolve against ratings). SQ 186-251; AT 152-168
- Nine templates: key 4, four 3s, one 2, 18 points, PC total without Top 10; one dice Talent at 1; Health 3 or 4; derived as for a PC. C 629; SQ 12-21
- Records: name, Specialty, attributes, Talent, Health boxes and Health lost, Resolve, Stress, minimum Stress, Scars, Grief, Critical Injuries, Down, gear, Wing, harm fields; crossed boxes are untreated Critical Injuries. C 630; SQ 13-29
- Does not record Origin, Haven, Drive, Canon Tie, Merit, Class Rank, XP. C 631; SQ 30
- Gear: Standard Issue, recorded exactly as a PC (Gas Rating, spare canisters, Blade Sets, carried items, Gear Dice ratings); ratings change only when a rule names it; never Pushes, no Push wear; one-line Squad sheet row. C 632; SQ 31-36
- Rules table (Yes/No per rule, Gas Rolls always two dice, template Talent only, no XP or Talent levels, Squadmate relief instead of Downtime Actions). C 661-684; SQ 47-67
- Actions: every entry a PC can take as an action incl. Help and options such as Call It; meets requirements; Specialty never limits; uses outside-Catalog steps, and an act they do not resolve is ruled on the same way; only Reaction is the dodge; makes any roll a rule or the GM calls for (Fly, Ride, Death Roll); never Pushes or Covers; own Reaction spends own turn, on a Wing the turn right after its PC's. C 714-717; SQ 71-85; SP 20-24
- Wing: one PC's Wing during a Titan Engagement; at most one Squadmate per Wing; acts right after that PC's turn with one move and one action, even if that turn was spent in advance; Fighting Titans sets assignment and unassigned Squadmates. C 699-703; SQ 88-96
- Directing: any player proposes; on a Wing, that PC's player decides; off a Wing, D6 roll-off by a proposer, highest decides, ties again; GM never directs a Squadmate, though the GM may give one a voice. C 731-734; SQ 97-105
- Squad aims for 6; starting Squadmates = 6 minus PCs, min 0; four PCs start with two. C 716-717; SQ 106-109
- Fewer allowed at session zero down to 0; disagreement is a shared choice; costs: about three times deadlier fights for PCs, no one to promote with no living Squadmate. C 718; SQ 110-121
- Players choose template and name; Standard Issue; Health lost 0, not Down, Stress 0, no Scars, Grief, Critical Injuries. C 726; SQ 122-125
- Promotion timing: end of the procedure where the death or Retirement happened, as Retirement is timed (last end step of a Titan Engagement, last step of a day passing, end of an outside-harm care window and its Death Rolls, end of any other procedure as stated); at once if none; due together at the same moment. C 734, 740; SQ 150-157, 161
- Who chooses: retirements first, retiring Squadmate leaves the Pool; affected players choose simultaneously; same choice rolls D6, highest takes, ties again; losers choose again from untaken Squadmates, repeating, until each has one or none left. C 736-739; SQ 158-167
- Conversion: keep name, Specialty, attributes, Talent, Health and Health lost, Resolve, Stress, Scars, Grief, Critical Injuries, Down, gear, harm fields; not recalculated; template Talent is the Specialty level; Origin D66 (roll again on condition), Haven, optional Canon Tie, 1 level in one of two Talents, held Talent rises by 1, no attribute points; Why You Enlisted D66 Drive, no point, name a comrade now if needed; each Training Year D66 once, 1 level in one of two Talents, no point, no Merit; caps and fallback; 5 levels total; Merit and Class Rank none, Private; follows PC rules, leaves any Wing, no longer a Squadmate, stays in the Squad. C 742-748; SQ 177-184
- No Squadmate: new character by any allowed procedure, Template Build quickest; joins with Standard Issue at the first of next Waypoint during an Expedition, start of next Titan Engagement with no Expedition, next Downtime. C 749-752; SQ 168-176

## Building Without the Lifepath

- A built soldier is the steady soldier the Titans were made to face, player choosing; rolled is the same on average with a chance ahead or worse. C 760
- Only when the campaign allows; GM plays no other part; same steps, differ only at step 3. C 762; LP 154-165
- Steps 1-9: Campaign Year as the Lifepath, no Exam or Exam Merit; Specialty chosen, not rolled, no requirement, never changes; Template Build ratings unchanged, not the template Talent; Free Build shapes 4,3,3,3,3,2 or 4,4,3,3,2,2 placed one each with a 4 on the key; Origin chosen by condition, one Haven, Canon Tie if wanted, level 1 in one of two Talents, no attributes; any row's Drive, no point; optional story event per year, no point, level, Merit, no performance roll; Specialty list level then 3 any; Merit and Class Rank none, not Top 10, no offer, no bonus; finish and join as the Lifepath. C 766-776; LP 166-219; CR 71-81
- Built ratings: 18 points, 2 to 4, key exactly 4, at most two 4s; no rolled points, swap, floor, or Top 10 bonus. C 92-96; AT 79-103
- Talent limits: 5 total (Origin 1, Specialty 1, any 3); none above 2; at most one at 2; rule Talent within max level; held Talent rises by 1. C 782-785; LP 156-165
- Built soldier: 18 points, key 4, Health and Resolve 2 to 4; Health 2 fragile, two untreated Critical Injuries put them Down; about four times the losses of the same Squad at Health 4; only the Lifepath reaches key 5 or 6, Top 10, or the Exam. C 789; LP 25-26
- Example (Tomas): Free Build Slayer, two-fours placement, Underground City Grip Breaker 1 and Haven, Duty from any row, Clean Cut 2 via Specialty and any level, Hamstringer 1, Field Medicine 1, one Talent at 2, Health 4, Resolve 3, Nape strike 6 base dice. AT 96-103; OR 114-126; EN 159-170; SP 40-44
