# Claims: Learn to Play

Page: `site/src/pages/learn/index.astro` (route `/learn/`). It is a page, not a chapter, so it states no rule of its own and retypes no table: every rule below is the simple case of a rule the finished chapters already own, and the page links to the chapter for the rest. Its sources are therefore the chapters themselves, which carry the `docs/rules` and `data/` shas in their own frontmatter.

Written against:

| Source | Blob sha at sync |
| --- | --- |
| `site/src/content/rules/rules-of-play.mdx` (`R`) | `2991fca91892ee8b98f66db29cd42b66580cc4fd` |
| `site/src/content/rules/fighting-titans.mdx` (`F`) | `df757265fd1415f124a4921ba22370b26991b35b` |
| `site/src/content/rules/making-your-soldier.mdx` (`M`) | `e0f323a092b528af27b1ec546594430204a5c92e` |
| `site/src/content/rules/gear-and-odm.mdx` (`G`) | `ad1fa713ee3473c9f3bc7a734b61fe2e0ae6657e` |

The diagrams (`PushSteps`, `PositionsMap`, `GrabCountdown`, `DiceKey`, `IconKey`) are the chapters' own components and draw from `data/` through `lib/`; they are not re-checked here.

## What this game is

- One GM plays the world; every other player plays a soldier. Framing, not a rule: `site/design/voice-guide.md` ("Players are 'you'; the Game Master is 'the GM'") and the home page pitch. Every player character is a Training Corps graduate who has joined the Survey Corps. M 70
- The player characters and their Squadmates are the Squad, which aims for 6 soldiers. M 746; glossary `Squad`, `Squadmate`
- A pool holds base dice, Gear Dice, and Stress Dice; give each kind its own colour so they stay apart during a Push. R 75
- Only a Nape strike kills a Titan, and it is made from Blind Spot. F 480-489

## Step 1: your first roll

- Build a pool of D6, roll it, count the sixes; every 6 is a success whatever kind of die shows it. R 59, 76, 132
- Pool = attribute + at most one Talent that names the entry + Bonus Dice + Gear Dice + one Stress Die per point of Stress, less penalties. R 93-106; M 89
- A roll needs 1 success unless its rule names another number, and every such number is a quantity in the world or a tuned value; the Nape Depth is one. R 133
- Field Repair: names Wits, allows a tool kit as its gear item, needs 1 success. `data/character/action-catalog.yaml` 632-651 (`field-repair`); `data/gear/items.yaml` 147-151 (`tool-kit`, rated, gear dice for field-repair)
- Gear Dice come from the current rating of one gear item the entry allows. R 104; G (items table)
- Circumstances: the GM names one step; name none and the roll is Standard. R 160
- Example pool (Toma): Wits 4 = 4 base dice, no Talent naming the entry = no Talent dice, tool kit rated 2 = 2 Gear Dice, Stress 0 = no Stress Dice. R 93-106

## Step 2: pushing your luck

- A Push trades Stress, and sometimes wear on gear, for a second chance at successes; you can Push a failed roll or a successful one. R 331
- The five steps of a Push are the chapter's `PushSteps` diagram, rendered unchanged. R 334
- You cannot Push when any Stress Die showed a 1, when the roll's rule forbids it, or when you have already Pushed it: once, unless a Talent allows more. R 346-350
- A comrade may Cover: the Covering soldier gains the 1 Stress, and the Pushing soldier gains none and adds no new Stress Die. R 388, 400-402
- The Push adds 1 Stress and 1 new Stress Die, then rolls again every base die and Stress Die not showing a 6. R 334 (`PushSteps`), 337
- A Gear Die showing 1 is locked; one showing 2 to 5 rolls again; a 6 stays. R 367; DiceKey (`dice-pool.yaml`)
- On a Pushed roll, each Gear Die showing 1 when the roll is final wears its item by one point. R 367
- Stress carries over between Titan Engagements, Expeditions, and sessions, and changes only through the triggers on the Stress table. R 427, 447
- Every attribute roll gets Stress Dice equal to current Stress; a Stress Die showing 6 is a success, a Stress Die showing 1 sets off a Stress Response, and a roll causes at most one. R 427, 460

## Step 3: your soldier in one minute

- The six attributes: Strength, Agility, Wits, Perception, Instinct, Empathy. M 73
- Attributes are rated 2 to 5; only the Specialty's key attribute can be rated 6; they never rise after creation. M 96-97
- Health and Resolve are derived from the attributes; at 0 Health you are Down; Resolve counts against Stress Response and Fear Roll results. M 106-107, 439
- A Specialty sets the key attribute and grants 1 level in one Talent on its list. It never grants permission: every soldier can attempt every entry, and a soldier without the Talent still rolls their full attribute. M 459-464
- Talents: 5 levels in total at creation, none above level 2. A dice Talent adds base dice equal to its level to the entries it names; a rule Talent applies its effect every time its trigger occurs. M 472-475, 484, 496
- Gear comes from Standard Issue. G 465; page lists ODM Gear, a Blade Set, gas, and a horse, each named in G's Standard Issue tables.
- The sheet also records Origin, Haven, and Drive. M 76-78

## Step 4: your first Titan

- A Titan Engagement runs in rounds; each round a player character takes one turn of one move and one action. R 530; F 94, 115
- A move changes your Position relative to one named Focus Titan by one step. F 159
- The four Positions and the steps joining them are the chapter's `PositionsMap`, drawn here for the Urban Anchor Rating. F 145; `data/engagement/anchor-ratings.yaml` 75-88
- Attention is held by one soldier, by a decoy, or by nothing, and who holds it is public. The holder cannot make a Nape strike against that Titan. F 375
- When a card comes up the Titan reads its Attention Ladder and turns to whoever meets the highest rung anyone meets. F 397-402
- Standard ladder order used in the example: hooked into its body, then nearest person In Reach. `data/engagement/attention.yaml` 147 (`rungs`), 172-195 (`evaluation`); F 394-400
- Nape strike: a Strength roll with Gear Dice from a Blade Set, needing Blind Spot, not holding its Attention, not Grabbed, working ODM Gear unless the Titan is grounded, and no retreat under way. F 480-485
- Reaching the Nape Depth kills the Titan; falling short turns each success into 1 Opening created by you. F 489
- You can never spend an Opening you made yourself; a soldier making a Nape strike spends Openings as Bonus Dice, 1 die each. F 495
- The Bonus Dice cap is 4 from all sources together. R 475
- Titan Dice succeed on a 5 or 6, are rolled in the open, never Push, and take no Bonus Dice, Help, Gear Dice, Stress Dice, or Circumstances. R 77; F 270-272
- The attack's successes are its Severity, the same number for every target. F 272
- The only Reaction against a Titan is a dodge: an Agility roll with Gear Dice from ODM Gear, or the horse while mounted. F 339
- Each Reaction success cancels one of the attack's; what is left is its Net Successes, and the attack lands on 1 or more. R 604-611
- A Reaction spends one whole turn, both a move and an action; it spends your earliest wholly unspent turn. R 566, 572-575; F 343
- Medium Titan: Nape Depth 4, Tempo 1, kill-tier behaviors roll 9 Attack Dice. `data/engagement/size-classes.yaml` 52-60
- A Grab lands on 1 or more Net Successes: the hold, a crushing Critical Injury to the torso that cannot be lethal, its Attention, and a Fear Roll for every witness. F 643-648
- Grabbed forbids Help, Covering, and Reactions; you can still Push; your move changes nothing and Break Free is your only action; you hold On Body. F 630-636
- The countdown counts the Grabbed soldier's own turns: lifted at the end of the first, devoured at the end of the second. F 658-661
- While the Titan holds a living Grabbed soldier its cards resolve nothing and its Next Behavior waits. F 288-289, 663
- On a Nape kill: every soldier holding a Position takes the Nape-kill Stress relief; steam scalds every soldier at On Body or Blind Spot; the body comes down. F 513-518
- Positions at the start of a fight: everyone holds Distant relative to Focus Titan A. F 101
- Openings, decoys, Body Parts, Squad Tactics, and the retreat are named as elsewhere, not stated. F 426-442, 450-472, 719-735, 764-779

## Not stated on the page

Deliberately left to the chapters, and so not claims to check: Circumstances rows and their dice, the Bonus Dice table, the Stress table, the Attention Ladder table, the Behavior Tables, the Positions and step tables in numbers, the roll-exceptions table, Standard Issue tables, called rolls and their closed cost menu, improvised acts, Regeneration, Pinned, Leap Clear, Read and Call It, retreat and the ending tests. Every one of them is reached by a link from this page.
