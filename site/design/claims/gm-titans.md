# Claims: the GM's Guide Titan pages

Pages: `site/src/content/gm/running-a-titan-fight.mdx` (`/gm/running-a-titan-fight/`), `site/src/content/gm/titans.mdx` (`/gm/titans/`), `site/src/content/gm/tuning-the-fight.mdx` (`/gm/tuning-the-fight/`).

Tables are rendered, never retyped: the interim setup table, the GM tracker, and each Titan's entry requirements come from `data/` through `site/src/lib/gm-tables.ts`; each Titan's stat block and Behavior Table come from `data/titans/*.yaml` through the existing `titanDossiers` loader and `TitanSpecimen.astro`. Check the wording maps in `gm-tables.ts` against the rows cited.

`C5` = `docs/rules/05-titan-engagement.md`, `C6` = `docs/rules/06-standard-titans.md`, `C1` = `docs/rules/01-core-rules.md`, `SET` = `data/engagement/engagement-setup.yaml`, `FLOW` = `data/engagement/engagement-flow.yaml`, `RND` = `data/engagement/round.yaml`, `BEH` = `data/engagement/behavior-procedure.yaml`, `BG` = `data/engagement/background-titans.yaml`, `ATT` = `data/engagement/attention.yaml`, `READ` = `data/engagement/read.yaml`, `IDX` = `data/titans/index.yaml`, `T5` = `data/engagement/tuning.yaml`, `T6` = `data/titans/tuning.yaml`.

## Running a Titan Fight

### Making the Call

- The GM rules before the dice, never after. Once rolled, no die or table result is overridden, re-rolled, or ignored, and the roll's entry, its Circumstances, and its stakes never change. C1 46, 63-64; `ADR-0024` limit 14
- Call a roll when no rule covers the act, the outcome is in doubt, and failure would cost something. Otherwise it happens, or it cannot be done and the GM says so before anyone rolls. C1 190, 194-196
- Name the roll: the closest Catalog entry marked as rolled when called, or the attribute alone; an attribute alone takes no Talent dice and no Gear Dice, and a helping tool counts toward the step instead. C1 200-206; `ADR-0024` limit 9
- A called roll always needs 1 success; the GM never raises it. C1 132, 219; `ADR-0024` limit 15
- One step of Circumstances per roll, weighing everything into one judgment, named with the stakes before any Bonus Dice are declared. C1 163-164; `ADR-0024` limit 16
- Standard is the assumption in a Titan Engagement. Another step only for what no rule prices: rain, smoke, full dark, ice, a gale. C5 (Rulings paragraph); C1 179
- A step reaches the soldiers' pools only. The Titan's Attack Dice, cards, Attention, and tables take none; a mired Titan makes the dodge Easy, named before its card comes up, and it loses no Attack Dice. C1 180; C5 514
- A Reaction takes the step in force when the attacker's card comes up, and none is named, raised, or lowered for it after. C1 170; C5 514
- Circumstances change dice, never what a roll needs (Nape Depth 4 at Hard still needs 4). C1 168
- One stake from the closed menu, out loud, before the dice: it does not happen, 1 Stress, a fall, 1 to 3 damage of a named Injury Type, a lost item or unit, or time and position. One failed roll costs one thing however many Pushes. C1 224-227; `data/core/dice-pool.yaml` (`called_roll`, `failure_menu`)
- The GM states the soldier's current Health with any stake that names damage or a fall. C1 231; `ADR-0024` limit 17 (9-35)
- What success gives: the act, information, a position, an object that is not a gear item, or found Squad Supply within its caps; never a gear item, Stress relief, a Health box or healing, a Commendation, a Research Point, or a Faction Standing change. C1 233
- In a fight a called roll is the last resort: entry as written, then an improvised act, then a called roll only when no entry of kind Action in that fight could model it and it changes nothing the fight tracks. It spends the action, never gives an entry's effect, never stands in for a Reaction; Help is the fight's Help at no named cost; a fall is low or high and never extreme, landing as the fall rule gives. C1 238-240; `ADR-0024` limits 7, 9, 17
- What a ruling never touches, fight side: Behavior Tables, the Attention Ladder, Attack Dice and Titan Dice, the Reaction procedure, only a Nape strike kills, the size of Openings, Steam, the falling Titan, Corpse Heat, the Grab countdown, Regeneration, the retreat clock, the end tests, a standard Titan's numbers, and which of them a Read reveals. C1 250-252; C6 36

### Setting Up the Fight

- The eight setup steps in order, including the Focus Titan labelled A, Body Parts Intact, no Openings, an empty Regeneration clock, the first hidden Next Behavior, placement, the ladder evaluated with no cards dealt, the start Fear Rolls, Squad Tactics unused, and round 1. C5 92-100; FLOW (`starting`)
- If a rung picks out one soldier at setup, that soldier holds Attention from setup (the Straggler's victim at In Reach while everyone else is Distant); otherwise nothing holds it and the first card turns it, which is what a Squad of two or more starting at one Position gets. C5 97
- Everyone who takes part starts Distant unless the starting rule places named soldiers; mounted stay mounted, nobody is airborne, a dismounted soldier's horse holds Distant. C5 104-108
- The GM may frame the Focus Titan (any Titan in the book), the Anchor Rating, and the Background Titans with clocks of 4, 6, or 8 segments, where the starting rule names none. C5 114-118; SET (`gm_choices`)
- What the GM names is never rolled, and no Abnormal roll is made for a named Focus Titan. A value a starting rule names stands and is never swapped. C5 120-121
- Closed to the GM: everyone starts Distant, the retreat clock's 8 segments unless a rule names a length, a setup row once rolled, and the start Fear Rolls as the list gives them. C5 122-125
- Framing that leans heavy on Large Titans with Background Titans plays above the lethality the fight was set for. C5 127 (design note)
- The interim setup table, rendered: Anchor Rating D6 (1 Open, 2 Sparse, 3-4 Wooded, 5 Urban, 6 Giant Forest); Size Class D6 (1-2 Small, 3-5 Medium, 6 Large) with the standard Titan of the class; on Medium a second D6 (1-5 the Medium Titan, 6 the Sprinting Abnormal); Background Titans D6 (1-2 none, 3-4 one on a clock of 6, 5 one on a clock of 4, 6 two on clocks of 4 and 8); the retreat clock 8 segments, never rolled. SET 41-84
- The Abnormal roll makes the Sprinting Abnormal the Focus Titan of 1 Titan Engagement in 12 the table sets up, computed on the page from the two rolls. C5 155; SET 62-70
- A Background Titan the table gives is always the standard Titan of its class and never rolls for an Abnormal; a starting rule may still name one. C6 48-49

### What You Track

- One Engagement line, one row per Focus Titan, one per Background Titan, and a corpse row that stays. Everything is public except an unrevealed Next Behavior and the values an Abnormal keeps until a Read. RND 126-180; C5 342
- Every field of every tracker line, rendered from the table with wording keyed per row. RND 127-180
- Update order within a round: after the deal, after each Titan card, after each strike or Break Attention, after each counted turn of a Grabbed soldier, after each fall of a Titan's body and each Heave, and at the end steps. RND 181-189
- On a Titan's card the GM reads the row in the card procedure's order; the Squad sheet's positions column is the one record of Positions. RND 190-197
- Rolls that do not depend on each other are rolled together: the end-step Gas Rolls and the Fear Rolls of one event. RND 198-201
- Round time: one Focus Titan with 4 player characters and 2 Squadmates runs 12 to 20 minutes; a Grab round runs to the top of that plus the witnesses' Fear Rolls; two Focus Titans at most 30 minutes. RND 210-216; C5 366

### Rolling the Next Behavior

- The Next Behavior is hidden, rolled out of sight, recorded face down, and revealed only by a Read, a telegraph, or the card that resolves it. BEH 13-18
- Rolled when the Titan becomes a Focus Titan, after each card that resolved a behavior, and after a card that came up while a decoy held its Attention. BEH 19-22; C5 462-465
- Kept when a card resolves nothing because the Titan holds a Grabbed soldier or nobody holds its Attention. BEH 23-25
- The roll: D6, the entry cannot be rolled if it is the previous behavior or needs Body Parts the Titan no longer has unbroken, then the next higher result wrapping 6 to 1, and Thrash if none passes. BEH 27-40; C5 468-473
- Rolling never checks Positions or Attention. BEH 41-43
- A blocked entry passes its share to the entry above it (both arms Broken: Bite takes Grab's share). BEH 44-55; C5 475
- Card bookkeeping in order: dead; holding (nothing resolves, no ladder, Next Behavior kept, nothing it noticed clears); decoy (nothing resolves, the hold loses a card, the Next Behavior is spent and re-rolled, any Call It ends, the ladder only when the hold ends, decoys in a row unchanged); Attention (nothing resolves if nobody holds it); choose (Thrash without the Body Parts, the fallback if the holder's Position fails, Thrash if the fallback repeats or fails); roll and announce in the open with no step and no adjustment; Reactions (0 successes whiffs against everyone, nobody dodges); effects in card order; next (the behavior becomes previous, decoys in a row to 0, what it noticed clears, a new Next Behavior). BEH 57-108; C5 479-497
- A telegraph reveals the new Next Behavior, and it stays revealed until a card resolves it or a decoy's card spends it. BEH 103-108; C5 497
- Example: a Grab against a holder at Blind Spot falls back, the fallback fails, and the card is Thrash; 2 Attack Dice successes, 1 cancelled, 1 Net Success knocks the soldier loose. Built from the Medium Titan's table (`data/titans/standard-medium.yaml`) and the card procedure.

### Background Titans and the Retreat

- A Background Titan is a closing clock: its Size Class, stat block, and clock are public except an Abnormal's Read values, and no soldier holds a Position relative to it. C5 865-869; BG 15-24
- Its clock fills 1 segment at the end of each round, and 1 for each flare spent on Break Attention once that Break Attention and any Hook and Cut are resolved; a flare-filled clock resolves mid-round. A flare never fills the retreat clock. BG 42-59
- Several full clocks resolve in the order the tracker lists them. BG 65-66
- Fewer than two Focus Titans alive: it enters with the next unused label, clean, everyone Distant, evaluating its Attention (no cards at an end step, that round's cards mid-round after a flare), the second Focus Titan or Abnormal Fear Roll, and cards from the next round. C5 877-884; BG 65-79
- The retreat clock: its length from the starting rule or the setup table (8), starting empty, public on the Engagement line, filling 1 segment last at the background-clocks end step. C5 871-875; BG 29-59
- A retreat begins when a Background clock fills while two Focus Titans are alive, or when the retreat clock is full. C5 885-890
- During a retreat: no Background clock fills, the retreat clock does not fill, no Titan enters, and Regeneration still fills. C5 890
- Forced moves, the four options as written, with Lift Comrade excluded from the list, and letting go or changing nothing for a soldier who can do none. C5 891-900
- Order: the move before the action, except a stay-with-a-comrade move (after that comrade's action) and a move on a turn whose action is Lift Comrade (after the lift). C5 906-908
- No return during a retreat. C5 909
- No Nape strike during a retreat, on a turn or through Hook and Cut; every other action still taken. C5 910
- The stay limit: options 3 and 4 open only for as many rounds as the retreat clock has segments, counted from the round after the retreat began; covering a comrade Pinned under a corpse in every retreat, and every comrade while no Focus Titan is alive; past it a soldier whom a lost-limb grade forbids every move is not standing. C5 901-905
- The GM never ends a Titan Engagement: only the two tests do. C5 946

## Titans

- The GM may name the Focus Titan and the Background Titans as framing, any Titan in the chapter; a named Titan is never rolled and rolls no Abnormal roll. C6 42-44
- Otherwise the standard Titan of the rolled Size Class, with the Medium Abnormal roll as the one exception, and Background Titans always standard. C6 45-49
- An Abnormal also appears when a starting rule names it; starting or becoming a Focus Titan, it causes the Abnormal Fear Roll. C6 50-51
- A stat block gives Size Class, Abnormal, Tempo (cards a round), Nape Depth (successes one Nape strike needs), Regeneration clock segments, Heave rating (the heave count that frees everyone its body pins), Body Parts in stat block order with Toughness, and the Attention Ladder. The order breaks Regeneration ties and decides which arm Grabs. C6 54-62
- A standard Titan's numbers are public; an Abnormal's Toughness, Nape Depth, Regeneration clock length, and ladder are hidden until a Read, and the tracker shows only filled segments until the length is revealed. C6 63-64; READ 41-56
- Each Titan's entry requirements, rendered: results, behavior, targets (holder, or holder and everyone at their Position), the holder's Positions, the Body Parts needed unbroken (a kind listed twice needs two), the fallback, and the Grab mark read from the grab effect. `data/engagement/titan-format.yaml` 85-105; IDX 82-87; each Titan file
- Thrash is the entry each table resolves most, almost all of it from a holder standing where the rolled entry cannot reach, most often a Nape striker at Blind Spot; each table's Thrash line is written for that body; the share is accepted and not tuned. C6 100-102
- Small Titan: Lurch Closer and Bite need no Body Part; Clutch at the Legs and Grab each need an arm, so both arms Broken move those results to Scrabble and Gape; it acts twice a round, so it deals more Critical Injuries and more Grabs than the Medium Titan out of smaller pools. C6 151-154, 855-856
- Medium Titan: Fixed Grin uses its eyes, so Broken eyes move that result to Snap Short and remove the telegraph; Snap Short and Shake Off need no Body Part; the Bite is fixed at the torso and reads worse for each torso Critical Injury the soldier already carries that counts toward worsening, a Grab's crush among them, so an instant-death row or several Net Successes can kill outright; Grab at 6 and Bite at 5 means both arms Broken move the Grab's share to Fixed Grin. C6 197-202
- Large Titan: Bite needs On Body and becomes Crush against a holder In Reach; Heavy Tread needs both legs and hits everyone at the holder's Position, and a grounded Titan moves that result to Crush; Crush and Shrug Off need no Body Part; Crush harms the holder alone and its leg Critical Injury cannot be lethal. C6 245-250
- Sprinting Abnormal, public: Medium, Tempo 2, Heave 3, its Body Part counts and states, its clock's filled segments, and its whole Behavior Table. C6 261-263
- Its table at the table: Run Past and Trample reach a holder at Distant or In Reach, and Trample's leg Critical Injury cannot be lethal while a rider who goes Down from it falls; Grab and Headlong Lunge need In Reach or On Body, the Lunge falls back to Pitch Headlong, and both roll the Medium Titan's control pool rather than its kill pool; Run Past, Trample, and Headlong Lunge each need both legs, so one Broken leg stops it running and Nape strikes gain the grounded dice; Pitch Headlong knocks loose a holder On Body or at Blind Spot on the smallest pool on its table; no entry affects a horse. C6 294-300
- Its hidden values, under bars: each Body Part's Toughness, Nape Depth, the Regeneration clock's length, and the ladder, each revealed by a Read and staying revealed for the rest of the fight. C6 302-304; READ 41-56
- Its ladder, rendered under bars, highest first: hooked into its body, loudest or brightest, current holder, nearest. IDX 48-53; ATT 101-125
- What its ladder means: a blade at its Nape or a soldier On Body turns it first and a striker who falls short draws its next behavior; then noise, only while nobody is hooked in and only from a Position other than Distant; then the soldier it is already running down while they are not at Distant; then whoever is nearest; and a fight begins with nothing holding its Attention because no rung picks out a Distant start and no card can break the tie. C6 320-330; IDX 54-77
- Any Abnormal: values in full within Tempo 1 to 2, Nape Depth 3 to 4, Regeneration 2 to 4, Toughness 1 to 3, Attack Dice 3 to 12; its own ladder from the closed list, beginning with hooked into its body and ending with nearest, with a Grab and a decoy overriding it as they override the standard ladder; Toughness, Nape Depth, Regeneration, and the ladder are Read facts and the Behavior Table is not; the Abnormal Fear Roll. C6 253-258

## Tuning the Fight

Plain guidance only. No percentage, no figure table, and nothing about how any number was arrived at.

- A prepared Squad of four kills a Medium Titan in about three rounds; most fights end by the third or fourth. C5 999; T6 189-196, 222
- The Small Titan usually falls in two rounds and still costs more than the Medium Titan, because it acts twice a round. C6 570-580, 855-856
- The Large Titan kills in about the same round as the Medium Titan but drags, a real share of fights ending with no kill, and deals close to twice the Medium Titan's harm. C6 581-598, 857-858
- The Sprinting Abnormal falls sooner than the Medium Titan and later than the Small one, hurts about as much as the Small Titan, and kills rather more often. C6 859-860
- Every fight costs something: a Critical Injury in most fights, and a Grab every few. C6 862-864
- No single standard fight is expected to kill; deaths accumulate across a campaign. C6 861-864; T6 195
- A Grab kills about 1 in 3 with comrades close and about 2 in 3 alone. C5 1070; `ADR-0014` as amended
- A first Titan Engagement is slower and costlier because of its Fear Roll. C6 566-568
- A canister lasts about 8 rounds of ODM use, about 6 Pushing every round, which is why the retreat clock is 8 segments. C5 1111-1115, 873-875
- Template-built soldiers against the Large Titan are the hardest standard fight: a round longer, far more fights with no kill, and twice the harm. C6 597-598
- Rounds against two Focus Titans run to about half an hour, and the clocks keep them rare. RND 210-216; C5 366
- Four strikers and no cutters beat the baseline Squad on every table, reported and not tuned. C6 900-904 (Four strikers and no cutters)
- Support wins sooner but never trivially: under the strongest support the Medium Titan still takes two or three rounds and still deals Critical Injuries. C6 866-876
- The GM's levers before a fight: the Titan, the Anchor Rating, the Background Titans and their clocks, and the support the Squad has. C5 114-118; C6 866-876
- Never moved: a Titan's numbers, the Behavior Tables and Attention Ladders, an open roll once fallen, the hidden Next Behavior, which values a Read reveals, the clocks and the retreat, and the closed stake menu. C6 36; C1 250-252; `ADR-0024` limits 8, 14, 16, 17
