# Playtest feedback, round 3: owner notes from the first session

Given 2026-09-20, after the first run at the table with the Foundry system. Recorded verbatim, split
into numbered items. Nothing here is decided yet: `ASSESSMENT.md` holds the analysis and the proposed
change list, `zone-combat-design.md` the design for item 8. The owner's own words are quoted; the
numbering is ours.

| # | Area | Owner's words |
|---|---|---|
| 1 | Health | "Health is way too small. Let uses the same formula but not divided by two instead. Keep all damage the same but crit injuries block off two health instead of one." |
| 2 | Steam | "remove steam damage from titan healing and keep it for only on death." |
| 3 | GM authority (Foundry) | "Gm should ne able to have way to do anything. I have issue today marking a specific crature to he grabbed due to narrative reason. Automation should be helpful but not restrictive." |
| 4 | Silent harm (Foundry) | "fall damamge, steam/fire damage etc should show as card for gm to roll with details about what is happening and who does it affect. Currently it applied sliently so gm have no idea what is going on." |
| 5 | Player-rolled consequences (Foundry) | "when player suffer feom crit injurted show chat card and allow them roll themsleves. So they can see. Apply similair principles across all things. Even on gas roll." |
| 6 | Flight prompted on the wrong client (Foundry) | "when gm mark player position changes via odm move for fly. It should show char caed for the player to perform the fly roll. It currently prompt gm for the roll which is wrong." |
| 7 | Token readouts (Foundry) | "there should be some visual: icon to show each char ter current momentum, anchor, as well as opening on titan token." |
| 8 | Zone combat | "realtive postion is extremely confusing and does not support thing like 2x far. Let rework this into zone based combat instead. Hexganal zone representation. People, titan, terrain, effect inside the zone. With flying, on body, odm achored to body, in blind spot being conditions. That can also make stuff like flying over complex twrrain vs flying the long easy way more interesting." |
| 9 | Engagement display (Foundry) | "I also want some cool visual way to represent this in forundry during titan engagement. Like sone sort of visual and tactile isometrix hex zone display wihh to player character in, floating /flying, on body. With titan and terrain element in the zones as well." |
| 10 | Positioning, general | "positioning is currently a bit confusing." (read as a restatement of item 8) |

Scope named by the owner for the work that follows: "the rule. Website and foundry."

## Owner revisions, 2026-09-20 (second pass)

| # | Revises | Owner's words |
|---|---|---|
| R1 | Item 1 | "heal is 2 + (current formula) instead of just straight dropping the divide two. And keep this rest the same." |
| R2 | Item 2 | "keep the steam on regen but make it less severe. Maybe the reason player got it is my mistake because i think they got hit when they are all on body." |
| R3 | New, item 11 | "also i want to be more clabout after a nape strike. Is that people still in blind spot or on body. What actiom cause positiom changes. This might solve the steam issue." |
| R4 | Item 9 | "for isometrix zone convat display i want it tobe on foundry canvas dirwctly. Make it a hero feature of this game system. So it must looks good like a game as well." |
| R5 | Items 8 and 9 | "Also we might need to consider how the titian will move across the zone now that it is zone based as well." |

## Owner decisions, 2026-09-20 (third pass)

| # | Item | Owner's words | Status |
|---|---|---|---|
| D1 | Health | "for health I mean keep the orginal rules (crit cross off 1 box, like we just keep the current rule just add 2 to all starting heath)" | Settled |
| D2 | Steam | "in that case keeping the current steam damage for now (orignial) player might just be frustred because they dont know the rules and I just roll 6 on that" | Settled, A4 withdrawn |
| D3 | Positions | "ah then I run it wrong then, so it is right the stay in blind spot then on their turn the atten laddter focus on then, then what will be thier status? on body is the literally on body right? then characcter can goes form in reach to blind spot directly without going on body first? ... but please make it more clear" | Answered in ASSESSMENT item 11; clarity work is batch A |
| D4 | The board | "we can ither used foundry canvas or custom ui entirely up to you, art twill be handled codex to generate later" | Our call: a custom board taking over the canvas area. Art list specified for Codex |
| D5 | Titan movement | "please reinvent titan movment as suggested" | The Stride accepted, `zone-combat-design.md` section 3 |
