# Wings of Freedom Phase 1 playtest packet: review, round 1

**Scope.** `docs/playtest/wings-of-freedom-playtest-packet.html` (2,704 lines), checked against Chapters 1 to 6 (`docs/rules/01-core-rules.md` to `06-standard-titans.md`), the `data/` YAML, `CONTEXT.md`, and `docs/rules/DECISIONS-2026-09-14.md` through 5-19. The review brief names 5-18; the owner's instruction extends it to 5-19. 5-19 only changes which deaths reading a tuning band uses, and nothing in the packet reads it. Brief: the playtest packet review brief (fidelity, completeness, structure, language, readability) and the drafter's Structure and Voice requirements.

**Not counted.** The packet follows the YAML where chapter prose disagrees, by design. These cases were reported by the drafter or are known chapter prose slips, and are not findings here:
- Fall Back is limited to soldiers who are not Down, Grabbed, or carried.
- Talent dice need the Talent's condition.
- Squadmates never Push or Cover, and the dodge is their only Reaction.
- The Nape strike's working ODM Gear requirement has a grounded-Titan exception.
- The Shattered Fear Roll result bans Reactions for two turns.
- The comrade-dies Fear Roll includes Grabbed witnesses.
- The Squad sheet row starts with the name.
- The Abnormal's Nape Depth bound is 3 to 4.

**Checks run.**
- **Tables, row by row against the YAML.**
  - Core Rules: Stress changes and Bonus Dice sources.
  - Character creation: attributes; Origin (12 rows, with Canon Ties and the Campaign Year condition); Why You Enlisted (12 rows).
  - Training Years: the three event tables (36 rows), the curricula, and the performance roll.
  - Graduation: Class Rank (11 rows), and the Graduation Exam Trials with the field exercise entry choices.
  - Specialties, and every dice Talent and rule Talent (39).
  - Squadmate templates (9), with Health and Resolve recomputed from the attributes.
  - Action Catalog: every active entry, the dormant and reserved lists, and the changes table.
  - Harm and Mind: Injury Location, the four Critical Injury tables (30 rows), time limits, Death Roll outcomes, Stress Responses (9), Fear Roll triggers and results (9), and Scars (12).
  - Gear: fall bands and fall damage, Standard Issue by Funding and by Specialty, Squad Supply stock, and carried items.
  - Titan Engagement: Position steps (20 rows), Size Classes, the four setup tables, decoys, and the ways out of a Grab.
  - The Titans: the four stat blocks, the four Behavior Tables (28 rows), and the Sprinting Abnormal's ladder.
  - Everything matches, apart from the findings below.
- **Procedures, walked against the YAML end to end.**
  - Rolling: building a pool, the Push, and Finishing a roll.
  - Harm and mind: damage to Down with its Critical Injury, Critical Injury worsening, Death Rolls, the engagement-end steps, and the interim day with the interim issue (5-2, 5-16).
  - Gear: a Gas Roll to running dry, a Jam, and a fall (5-5, 5-6).
  - The fight: the round and its end steps (5-10), Break Attention and the Feint, the Attention Ladder, and a Grab (5-6, 5-12).
  - Retreat and ending: the retreat (5-1, 5-13, 5-15), then leaving, the ending, and left-behind soldiers (5-18).
  - Content: Draw Attention from Distant (5-8), Ride and Horsemanship (5-3), and the per-Titan Background Size Class roll (5-17) are all rendered.
- **Language.**
  - No em dashes; en dashes appear only in numeric ranges.
  - No YAML, probe, simulator, OQ, ADR, or PROVISIONAL wording, and no simulation percentages.
  - No `_Avoid_` term outside glossary definitions copied from `CONTEXT.md`.
  - No "[missing rule" marker.
  - No PROVISIONAL marker remains in any chapter or non-tuning YAML file, so every "Playtest rule" tag marks a stopgap, not a chapter marker.
- **Layout.**
  - Tables: 57, all inside `.table-wrap`.
  - Links: 76 in-page links, none broken, and no duplicate ids.
  - No `html`, `head`, `body`, or `script` tag.
  - Theme contrast (WCAG ratio):

    | Colour pair | Light | Dark |
    |---|---|---|
    | Ink on paper | 14.8 | 14.5 |
    | Muted on paper | 6.0 | 7.1 |
    | Accent on paper | 7.2 | 8.0 |
    | GM colour on paper | 7.4 | 7.1 |
    | Band text on GM band | 7.4 | 7.1 |
    | Ink on table-header tint | 13.6 | 13.4 |

    The dark palette stays legible everywhere.
  - Headless Chrome at its narrowest window (500 px): the page `scrollWidth` equals `clientWidth`, and no element outside a table wrapper overflows. 22 table wrappers scroll sideways, as intended.
  - Headless Chrome print with the packet's print CSS (Letter, fallback fonts): 100 pages in all; the quick reference alone prints on 2.

## Verdict

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 4 |
| Minor | 24 |

**Rules.** The packet is faithful. I found no rule that contradicts the chapters in the rule text itself. Every table I sampled matches its YAML, and nothing the players should not know appears before the GM band. A group with only this packet can make soldiers, run the interim day and issue, and run a Titan Engagement against each of the four Titans through the retreat and the end steps.

**The four Majors.**
- **The Timing tip.** One piece of table advice about decoys is wrong for Tempo 2 Titans.
- **Soldiers who left.** Two sentences put soldiers who have left back into the fight when a Background Titan enters.
- **The tie-break.** The player-side and quick-reference tie-break drops the end-step exception that every Background Titan's entry reaches.
- **The quick reference** is two printed pages, not one.

**The Minors.** Most are small dropped conditions in the GM procedures (the rule usually sits in the player chapter), plus a few passages that still read as design notes.

**Voice.** It is close to a published product: second person, bold triggers, numbered procedures, original epigraphs, and short worked examples for the Nape strike, the Feint, and the Grab.

### The edits that would most improve the packet

1. Rewrite or delete the Break Attention *Timing* paragraph (Major 1).
2. Write "every soldier who holds a Position holds Distant relative to it" in both places a Titan enters (Major 2).
3. Add "not before the deal or at an end step" to the lowest-card tie-break in the player chapter, the quick reference, and the Abnormal page (Major 3).
4. Fit the quick reference on one printed page (Major 4).
5. Put the last-Position reading (5-4) and the release when a holding Titan dies into the player text (Minors 2 and 3).
6. Move the timed paper test to the feedback page. Rename the tracker's "Flags" to "Marks". Replace the Squad sheet's variable letters with words (Minors 12, 14, 18).
7. Add a "What you need" box (dice, twenty cards, tokens) and a printable character sheet, Squad sheet, and tracker (Minor 23).

## Findings, most severe first

### Major 1. The Break Attention "Timing" tip says a decoy's hold ends on the Titan's next card, which is wrong for every Tempo 2 Titan

**Location.** Packet line 1908, Fighting Titans, *Break Attention and decoys*, the **Timing.** paragraph: "A decoy's hold ends on the Titan's next card. If you break its Attention before its card comes up this round, that card spends the hold before your next turn." The correct rule is stated two paragraphs earlier:
- Packet line 1894: "for as many of its next cards as its Tempo: one round of its cards, however the deal falls".
- The GM procedure at line 2301 agrees.
- `data/engagement/attention.yaml` (`break_attention`, the hold, line 263) agrees.
- Chapter 5 section 5.6 ("one round of its cards however the deal falls") agrees.
- No chapter or YAML text contains the tip.

**Problem.** The hold lasts as many cards as the Titan's Tempo. The standard Small Titan (Tempo 2) and the Sprinting Abnormal (Tempo 2) keep a decoy for two cards. The setup table makes a Small Titan the Focus Titan on 1 or 2, a third of Titan Engagements. The packet states two different rules for one hold, and the wrong one is written as practical advice, which is what players plan cuts with. I rate this Major rather than Critical because the rule itself is printed correctly above it and in the GM procedure, so the GM's resolution is correct. Only the players' planning goes wrong.

**Scenario.** Round 2, Wooded, against a standard Small Titan dealt cards 6 and 14. Private Roth (card 3, at Distant) breaks its Attention with a flare. Private Lang (card 10) holds In Reach and is the only soldier there.
- **Reading the tip:** card 6 spends the hold, and the Titan checks its ladder on card 6. Lang, the nearest person in reach, takes its Attention. A soldier holding a Titan's Attention cannot strike its Nape, so on card 10 he cannot cut. He spends his turn on a second Break Attention instead.
- **Under the rule:** cards 6 and 14 both resolve nothing, and the ladder is checked only after card 14. On card 10 the flare still holds the Attention, so Lang can make an ODM move to Blind Spot and strike the Nape.

The tip talks the Squad out of the cut the decoy was bought for.

**Fix options.**
1. Rewrite: "A decoy holds for as many of the Titan's cards as its Tempo. Against a Tempo 1 Titan, break its Attention after its card has come up and the hold usually lasts until your card next round. Against a Tempo 2 Titan the hold covers both of its cards."
2. Delete the paragraph. Line 1894 and the Feint example at line 1911 already carry the rule.

### Major 2. A Background Titan that enters puts soldiers who have left back into the fight

**Location.**
- Packet line 1775, *Two Focus Titans*: "A second Focus Titan arrives from outside the fight, so every soldier holds Distant relative to it."
- Packet line 2333, GM, *Entering*: "every soldier holds Distant relative to it", then "Soldiers make the Fear Roll for a second Focus Titan, or for an Abnormal."
- Source `data/engagement/background-titans.yaml` line 68: "Every soldier who holds a Position holds distant relative to it."
- Source `data/engagement/positions.yaml` lines 56 to 57: "No other Position changes."

**Problem.** Holding a Position is the test for being in a Titan Engagement (packet line 1720). Read as printed, the entering Titan gives a Position to every soldier, including soldiers who have left and the comrades they carried out. Those soldiers become:
- ladder candidates;
- witnesses;
- bound by a later retreat's forced moves;
- no longer returners for the no-soldier-standing test.

The GM line also drops who makes the entry Fear Roll. The trigger table at line 1133 is correct, but the procedure a GM follows at the moment of entry is not. The interim clocks of 4 and 6 fill before the retreat clock of 8, and soldiers leave in exactly those rounds to carry comrades out, so the case comes up often.

**Scenario.** Round 6, one Background Titan with a clock of 6. On his turn this round, Private Weber, carrying Down Private Albers, leaves the Titan Engagement. At the round's end step the Background Titan enters as B. As printed:
- Weber and Albers hold Distant relative to B, so both are back in the fight.
- Albers, Down, meets B's nearest rung.
- Weber makes the second Focus Titan Fear Roll.
- When the retreat clock fills two rounds later, Weber must spend his moves on forced moves instead of staying out.

Under the rule, neither holds a Position, neither is a candidate or a witness, and Weber stays a returner.

**Fix options.**
1. At lines 1775 and 2333, write "every soldier who holds a Position holds Distant relative to it; no other Position changes, and soldiers who have left stay out."
2. At line 2333, also write "every soldier holding a Position makes the Fear Roll for a second Focus Titan, or for an Abnormal, once."

### Major 3. The player-side tie-break drops "skip the lowest card at an end step", and every Background Titan's entry reaches that step

**Location.**
- Packet line 1862, *The Attention Ladder*: "If still tied, the soldier already holding its Attention keeps it; then the lowest card this round takes it (a Wing Squadmate counts just after its player character); otherwise nothing holds its Attention until its next card."
- Quick reference line 2130: "Ties: current holder, then lowest card, then nothing."
- Line 2514, the Abnormal page: "the tie-breaks are the same: the current holder, then the lowest card, then nothing."
- Source `data/engagement/attention.yaml` lines 196 to 197: "Skip this step if no cards have been dealt this round, or if the evaluation is made at an end step, as when a Background Titan enters at the background-clocks end step". Chapter 5 section 5.6 says the same.
- The GM procedure at line 2320 is correct.

**Problem.** A Background Titan enters at the background-clocks end step with every candidate at Distant relative to it. Its first ladder check therefore always ties at the nearest rung, finds no current holder, and reaches the card step.
- **The rule:** skip that step, and nothing holds the Titan's Attention until its first card.
- **The player chapter and the quick reference:** the soldier with the lowest card of the round that just ended takes it.

The quick reference is the page most players will have open, so the table can argue down to the GM's text.

**Scenario.** End of round 4, Sparse, with a Background clock of 4. Squadmate Ilse, on no Wing, held card 2 that round.
- **The GM section:** nothing holds B's Attention.
- **The quick reference:** Ilse holds it.

On B's first card in round 5, every soldier is still at Distant and the tie reaches the holder step:
- **Under the quick reference:** Ilse keeps it as current holder, so B's first behavior targets her.
- **Under the rule:** the lowest card of round 5 takes it.

The reading decides who is attacked, and who needs 1 success rather than 2 to Break B's Attention.

**Fix options.**
1. At line 1862, write "then the lowest card this round takes it, unless no cards have been dealt this round or the ladder is checked at an end step".
2. At lines 2130 and 2514, write "Ties: current holder, then lowest card (not before the deal or at an end step), then nothing."

### Major 4. The quick reference prints on two pages, not the one printable page the owner asked for

**Location.** `#quickref`, packet lines 2081 to 2199. The print CSS at line 88 starts it on a new page. Owner's Structure item 4: "Quick reference: one printable page of the most-used numbers and steps."

**Problem.** The section holds eight boxes plus the fall damage table (5 rows) and the Fear Roll table (9 rows). Printed with the packet's own print rules (10.5 pt, Letter, default margins; headless Chrome with fallback fonts, which run close to Source Serif 4 and IBM Plex in width), it takes 2 pages.

**Scenario.** The GM prints one quick reference per player. The second sheet, holding the Fear Roll and fall damage tables, is the one set aside. Then the first comrade is Grabbed, and every witness looks for the Fear Roll table.

**Fix options.**
1. Drop the two tables from the quick reference, since full copies sit at lines 1143 and 1441, and keep the eight boxes on one page. Or keep the tables and move the *Gear* and *Falls and retreats* boxes to a second, GM-side reference.
2. Add print rules for `#quickref`: a three-column grid, 9 pt text, and tighter table padding, then re-check the page count.

### Minor 1. The nearest rung reads "any soldier", and the Abnormal page loses the rung's narrowing reading

**Location.**
- Packet line 1858: "at the closest Position any soldier holds".
- Packet line 2512 and line 2519 (Abnormal): "the closest Position any candidate holds".
- Source Chapter 5 section 5.6 ("any candidate"), and `data/engagement/attention.yaml` lines 57 to 62 and 113 to 116: "as the highest rung met, ... the candidates at the closest Position any candidate holds; as a lower rung, by the tied soldiers at the closest Position any of them holds". The GM step at line 2318 is correct.

**Problem.** Soldiers who have left or are held by another Titan are not candidates, but "any soldier" lets them set the closest Position. The Abnormal rows give only the highest-rung reading, not the narrowing one.

**Scenario.**
- **Standard ladder.** With two Focus Titans, Private Kurt is Grabbed by B and holds In Reach relative to A; every candidate for A is at Distant. By line 1858 the closest Position is In Reach, no candidate meets the rung, and A's card resolves nothing. By the rule, the candidates at Distant meet it.
- **The Abnormal.** Two soldiers marked loud tie on its loud rung, one at Blind Spot and one at Distant, while an unmarked comrade stands In Reach. By line 2512 neither tied soldier is at the closest Position, so the tie falls to the card. By the rule the soldier at Blind Spot wins.

**Fix options.**
1. Line 1858: "any candidate holds".
2. Lines 2512 and 2519: add "when it narrows a tie, the tied soldiers at the closest Position any of them holds".

### Minor 2. The last-Position rule (5-4) is only in the GM section, and the aftermath roll text reads as if Positions ended with the Titan

**Location.**
- Packet line 1964 (a Titan's death: "every Position relative to it ends") and line 2064 ("Then the end steps run").
- Packet line 1057, aftermath rolls: "Positions are compared as they stood then", and "or the patient treating themselves with the 2-die penalty".
- Source `data/harm/treat-injury.yaml` `aftermath_rolls.who_rolls` ("the patient's last Position or a Position one step from it, relative to the Focus Titan alive last ... or the patient, if not Down, treating themselves"), `data/harm/engagement-end.yaml` `positions_read`, and `data/engagement/positions.yaml` `a_focus_titan_dies`. The GM line 2331 has the record.

**Problem.** A player reading Harm and Mind and Fighting Titans concludes that when a Nape kill ends the fight, no one held a Position "then". The self-treatment clause also drops "if not Down". The Down rules at line 995 forbid it anyway, but the sentence invites the question.

**Scenario.** A Nape kill ends the fight. Medic Ilse is at Blind Spot, and Down Private Dieter at In Reach holds a Torn Artery. The players read line 1964 with line 1057 and decide nobody can make Dieter's aftermath roll. By 5-4 Ilse's last Position is one step from Dieter's, so she can.

**Fix options.**
1. Line 1057: "compare the last Positions held relative to the Focus Titan alive last (a Titan's death records them)".
2. Line 1964: add "record each soldier's last Position relative to it for the end steps".
3. Line 1057: "or the patient, if not Down, treating themselves".

### Minor 3. The release rule does not cover a holding Titan that dies

**Location.** Packet line 2024 ("Once you are freed: before the lift you hold In Reach with no fall; after the lift you fall from On Body's height and land In Reach") and GM line 2331 ("a soldier it holds is freed"). Source `data/engagement/grab.yaml` lines 179 to 181: "A soldier freed by the holding Titan's death holds no Position relative to it. If they were lifted, they still fall. Their Positions relative to any other Focus Titan stay as they are."

**Problem.** Line 2024 puts a soldier freed by a kill In Reach of a dead Titan, against line 1964. The fall's reference Titan is also left unstated when the holding Titan is dead.

**Scenario.** Two Focus Titans. Lena is lifted by B, and a comrade kills B. The table places her In Reach of B, which no longer exists. The rule says she falls, with the band read against A, and her Position relative to A stands.

**Fix options.**
1. Add to line 2024: "If the holding Titan's death frees you, you hold no Position relative to it; if lifted, you still fall, and your Positions relative to any other Focus Titan stay as they are."
2. Say the same in the GM death bullet at line 2331.

### Minor 4. The start-of-fight bullets say the GM rolls the retreat clock, and hedge the opening Attention

**Location.**
- Packet line 1712: "names its Anchor Rating, its Focus Titan, any Background Titans, and its retreat clock. Until Expeditions exist, the GM rolls them on the setup table."
- Packet line 1715: "nothing usually holds its Attention until its first card".
- Source `data/engagement/engagement-setup.yaml` lines 31 to 34 ("Nothing is rolled"); packet lines 2216 and 2257.

**Problem.** The retreat clock is a fixed 8, never rolled. "Usually" invites a GM ruling where the GM text gives a rule: a Squad of two or more starts with nothing holding its Attention.

**Scenario.** A player asks what the GM rolled for the retreat clock, or argues that a lone soldier at Distant should draw the first card's behavior "usually". Neither question has an answer in this paragraph.

**Fix option.** Line 1712: "the GM rolls the first three on the setup table; the retreat clock has 8 segments." Line 1715: "a Squad of two or more starts with nothing holding its Attention."

### Minor 5. The Position meanings drift from the source

**Location.**
- Packet line 1723: "In Reach is within its hands and teeth, on the ground or in the air around it."
- Packet line 1724: "On Body is hooked into the Titan itself."
- Source `data/engagement/positions.yaml` line 20: "Within reach of the Titan's hands, on the ground or on anchors beside it."
- Source `data/engagement/positions.yaml` line 23: "Hooked into the Titan's body or standing on it, anywhere but the Nape."

**Problem.** "In the air around it" suggests an airborne soldier is In Reach by default. Dropping "anywhere but the Nape" loses the line between On Body and Blind Spot.

**Scenario.** A soldier who hooked onto the Titan's shoulder blades says they are at Blind Spot, because they are behind it. Line 1724 does not settle the claim; the source's "anywhere but the Nape" and Blind Spot's "anchored to the terrain" do.

**Fix option.** Use the YAML meanings verbatim.

### Minor 6. Two small conditions dropped in Read and the Grab

**Location.**
- Packet lines 1976 to 1980 (Read facts). Source `data/engagement/read.yaml` lines 25 to 26: each fact can be picked once per Read, and a success that picks no fact is lost unless Call It spends it.
- Packet line 2010 (a Grabbed soldier's death). Source `data/engagement/grab.yaml` line 191: "The dead soldier holds no Position and does not fall." The GM line 2343 has "the body does not fall"; the player text has neither part.

**Scenario.**
- **Read.** A Tactician with 3 successes against the Sprinting Abnormal picks its Next Behavior twice and asks what the third success does.
- **The Grab.** A Grabbed soldier dies to a Death Roll after the lift. The players roll a high fall for the body and argue over where the left items lie.

**Fix option.** Add the two sentences.

### Minor 7. The GM card procedure drops several small conditions

**Location.** Packet lines 2255 and 2301 to 2307. Source `data/engagement/behavior-procedure.yaml` lines 69, 85 to 86, 88, 91 to 93, 97 to 98, and 108, and `data/engagement/engagement-flow.yaml` lines 23 to 24.

**Problem.**
- **Effects (2306).** "Targets in card order" gives no place to a Wing Squadmate, who holds no card. The source puts it after its player character.
- **Reactions (2305).** "Each target dodges" reads as a forced dodge. The source says each target chooses whether to dodge, and a target whose Reactions are forbidden cannot.
- **Announce (2304).** It drops the tier.
- **Decoy (2301).** It drops "any Call It on it ends".
- **Next (2307).** It does not say a telegraphed Next Behavior stays revealed until a card resolves it or a decoy's card spends it.
- **Choose (2303).** It drops "Thrash can always happen, and is the only entry that can follow itself".
- **Starting step 3 (2255).** It drops count 0 and "no previous behavior".

**Scenario.** The standard Large Titan's Heavy Tread lands on a holder and everyone at their Position, including a Wing Squadmate and the comrade it would carry. The GM has no order in which to apply the effects. In the same fight, a GM reading step 6 literally makes a Down target roll a dodge.

**Fix option.** Add each clause at its step. For step 6, write "Each target chooses whether to dodge, or compares a dodge already made; a target who cannot make a Reaction takes it."

### Minor 8. The Abnormal ladder notes drop qualifiers

**Location.**
- Packet line 2324: "The Sprinting Abnormal's current holder rung also allows it" (Down soldiers).
- Packet lines 2519 to 2521.
- Source `data/engagement/attention.yaml` lines 66 to 67 and 120 to 121 ("keeps a Down holder who is not at Distant"), `data/titans/index.yaml` lines 64 to 70, and Chapter 6 lines 320 to 323.

**Problem.**
- **Line 2324** omits "not at Distant". The rung row at 2511 has it.
- **Line 2520** omits that the cutters at its legs draw it only when it is running no one down and they are the nearest.
- **Line 2519** omits that the fight starts with nothing holding its Attention.

**Scenario.** A Down holder at Distant is kept as the Abnormal's quarry by a GM reading line 2324 alone, while a closer standing soldier should draw it.

**Fix option.** Add "not at Distant" to line 2324, and the two missing sentences to the bullets.

### Minor 9. When the ending tests are checked, and the order of several full clocks, are not stated

**Location.** Packet lines 2059 to 2063 and 2332 to 2335. Source:
- `data/engagement/engagement-flow.yaml` lines 63 to 65: "As soon as the event that makes a test true has been fully resolved, including the Fear Rolls and Drive decisions it causes."
- `data/engagement/background-titans.yaml` line 63: "When several clocks are full at once, resolve them in the order the tracker lists them."
- Chapter 5 section 5.11.

**Scenario.** The last standing soldier is Grabbed, and the witnesses' Fear Rolls could make a Drive shrug off a Frozen result. The GM ends the fight before the Fear Rolls and Drive decisions resolve. Separately, a starting rule with two equal clocks leaves no order for which Titan enters as B.

**Fix option.** Add the timing sentence to *How a Titan Engagement ends*, and the clock order to the GM *Entering* bullet.

### Minor 10. The GM Grab bullets drop "still Grabbed", and what follows a Grabbed soldier's death

**Location.**
- Packet line 2341: "At the end of the first, mark them lifted."
- Packet line 2343 (a Grabbed soldier's death).
- Source `data/engagement/grab.yaml` line 76 ("while they are still Grabbed"), line 97, and lines 192 to 196. The latter say Attention is held by nothing until the Titan's next card, and witnesses make the comrade-dies Fear Roll once. The player text at line 2006 has "still Grabbed".

**Scenario.** A soldier is freed by a Break Attention on their own first counted turn. A GM running from the GM bullets still marks them lifted at that turn's end.

**Fix option.** Add "if still Grabbed" to the lift. At 2343, add "nothing holds its Attention until its next card, and every witness makes one Fear Roll for the death".

### Minor 11. The Hidden values page says everything on it is revealed only by a Read, but half of it is public

**Location.** Packet line 2494: "Everything on this page is revealed at the table only by a Read." The stat block below it lists Size Class, Abnormal, and Tempo 2, which line 2462 and `data/engagement/read.yaml` line 57 make public. Chapter 6 line 291 has the same sentence, so the packet inherited it.

**Scenario.** A GM withholds that the Sprinting Abnormal draws two cards a round, and the players discover it only when the second card resolves a behavior.

**Fix option.** "Players do not read this page. The values listed under Hidden until Read are revealed only by a Read; its Size Class, that it is an Abnormal, and its Tempo are public." Chapter 6 section 6.5 wants the same edit.

### Minor 12. The "Timing rounds" note is written as a test protocol, not as a rule the GM runs

**Location.** Packet lines 2346 to 2351, tagged Playtest rule.
- "The first thing this playtest measures is a timed paper test with players new to the rules ... Report the median and upper-quartile times. The test passes if the one-Titan median is 20 minutes or less and the two-Titan median 30 or less."
- "If the one-Titan median misses, Wings are fixed for the whole Titan Engagement and the swap step is removed."

**Problem.** This is the design document's measurement plan in rule form. A table cannot apply "if the median misses" during play. Medians and quartiles are the vocabulary the voice brief keeps out of the packet.

**Scenario.** At the end of the first session the GM asks whether Wings are now fixed and swapping is gone. The answer depends on a median across several tables that no single group has.

**Fix options.**
1. Keep one sentence in the GM section ("A round of one Focus Titan against six soldiers should take 12 to 20 minutes"). Move the timed test to the feedback page's *Timed rounds* table, and leave the fallback rules for the owner to apply after the playtest.
2. Cut the fallback paragraph.

### Minor 13. "You may show them" makes public Behavior Tables sound optional

**Location.** Packet line 2208: "Behavior Tables are not secret. They sit in this section to keep the player chapters short, and you may show them." Chapter 6 line 247 and packet line 2462 say a Behavior Table is public.

**Scenario.** One GM keeps the tables behind the screen and another hands them out. Players at the first table cannot judge Positions against Severity the way the rules assume they can.

**Fix option.** "Behavior Tables are public. Show them to any player who asks."

### Minor 14. The tracker example uses "Flags" and unexplained codes, and the players' tracking list is short

**Location.**
- Packet line 2272: "Eyes I0 LA W1 RA I0 LL B0 RL I1 | Op 2 (Mila, Mila) | ... | Decoys 0 | Grab: - | Flags: hooked Mila".
- Packet line 2274: "Players track everything else on their sheets: Positions, mounted, airborne, carrying, turns spent in advance, Stress, harm, and gear."
- Source `data/engagement/round.yaml` lines 158 and 187 to 189. The source list also names carried, actions spent in advance, Stress Responses, Critical Injuries, Health, and Gas Rating.

**Problem.** The packet renamed flags to marks everywhere else (line 1869), but the example row still says Flags. I, W, B, the numbers after them, "Op", and "Decoys" are never explained.

**Scenario.** A new GM copies the example row, cannot tell what "LA W1" means, and records Body Parts differently from the procedure text.

**Fix option.**
- Write "Marks: hooked Mila".
- Add a one-line legend: "I, W, B: Intact, Wounded, Broken, with the part's count; Op: Openings and who created them."
- Use the source's full tracking list.

### Minor 15. The GM procedures depend on player-chapter rules with no pointers

**Location.** GM section lines 2311 to 2335. The rungs and the moments Attention changes are only at lines 1842 to 1865. The ending rules (no returner ends it at once, otherwise at the next round's end) are only at line 2063. Grounding is at line 1767. The retreat's forced moves and left-behind deaths are at lines 2035 to 2064.

**Problem.** Nothing is hidden in the wrong place. But a GM working through "Running a Titan Engagement" has no link back to the procedures they run from the player chapter. The drafter's brief listed grounding and retreats as GM-section contents.

**Scenario.** A retreat starts mid-fight. The GM searches the GM section for forced moves, finds only the trigger, and has to page back through Fighting Titans while six players wait.

**Fix option.** Add a link at each step, for example "(the rungs: see The Attention Ladder)" or "(forced moves: see Retreats)", plus a short "Also run from the player chapter" line under the GM band.

### Minor 16. Print: the Titans intro is stranded on its own page, and later GM pages carry no GM-only marker

**Location.** Print CSS line 88 (`.chapter, ... .titan {break-before:page}`); `#titans` (line 2354, class `chapter gm`) and `#titan-small` (line 2360, class `titan`); `#gm-hidden` (line 2492). Only `#gm-running` has the `gm-band` (line 2203).

**Problem.** The Titans chapter breaks before its heading, then again before the Small Titan after only an epigraph and two paragraphs. Each Titan and the Hidden values page print as separate sheets, and none says "GM only".

**Scenario.** The GM hands the Sprinting Abnormal's Behavior Table page to a player, as line 2208 allows. The Hidden values sheet, printed next to it, looks the same and has no label.

**Fix options.**
1. Exempt the first `.titan` from the break (`#titan-small{break-before:auto}`).
2. Put a small "GM only" kicker at the top of each `.titan` and of `#gm-hidden`.

### Minor 17. Term consistency: "tally" and "count", Body Part State, and glossary extras

**Location.**
- **"tally":** lines 1925, 1926, 1960, 1996, 2024.
- **"count":** lines 2268, 2329, 2462, and `data/engagement/titan-harm.yaml` line 33 ("Each Body Part has a count").
- **"Body Part states":** lower case at lines 1929 and 1981, although `CONTEXT.md` defines **Body Part State**. The glossary (line 2527 onward) has no entry for it.
- **Glossary extras:** the glossary defines six terms the packet never uses outside it (Chase Band, Scarcity, Distance Band, Waypoint, Canon Clock, Operation Frame). The drafter's brief asked for "the game terms used".

**Scenario.** A player's sheet says "tally 1" while the GM's tracker says "count 1", and the table asks whether these are two different values.

**Fix option.** Use "count" throughout. Capitalise Body Part State and add its glossary entry. Drop the six unused glossary entries, or keep them under a "Terms for later rules" heading.

### Minor 18. The Squad sheet columns use variable letters

**Location.** Packet lines 1690 and 1691: "Gas g, then +g for each spare canister" and "Bl h+n: h is 1 if a Blade Set is in the handles and 0 if not; n is the number carried". The voice brief rules out variable names.

**Scenario.** A player new to the notation writes "Bl 3" for three Blade Sets and cannot tell from the column whether the handles are filled.

**Fix option.** "Gas: the fitted canister's Gas Rating, then + and each spare's Gas Rating, such as Gas 3 +3." "Blade Sets: 1 or 0 for the handles, then + and the number carried, such as Bl 1+2."

### Minor 19. A few design-document asides remain, and the no-discretion principle is restated in most chapters

**Location.**
- Line 2357: "Below each table, one line per entry describes the behavior; the line decides nothing, and the row does."
- Line 826: "(A later rule that creates a clock or obstacle may name an attribute roll that changes it; no Phase 1 rule does.)"
- The principle restated: line 818 ("never by the GM"), 876 ("The GM never decides whether harm happens, how much, where it lands, or how long it lasts"), 1223, 1628, 1708 ("The GM runs the Titans from their tables and procedures and decides nothing"), and 2207.

**Problem.** Each line is short and accurate. Together they read as the design principle being argued rather than applied. Published Year Zero Engine books state once how the GM runs the game.

**Scenario.** A first-time GM reads six variations of "you decide nothing" and asks what the GM's job is. Only line 2207 answers: roll the Next Behavior, keep the tracker, reveal facts.

**Fix option.**
- State it once in Core Rules, near "Results stand" at line 157, and keep line 2207 in the GM section.
- Cut line 826's parenthetical.
- Rewrite line 2357's clause as "The description line under each table is flavour; the row is the rule."

### Minor 20. "Dormant" and "reserved" are used from line 370 and defined at line 807

**Location.** "(dormant)" and "(reserved)" appear in the Attributes, Origin, Training Year, Specialty, and Talent tables (lines 370 to 655). The definition is at line 807, in the Actions chapter.

**Scenario.** A player rolls Found in the storehouse, is offered Quiet Step (dormant) or Slip Away, and has to read ahead two chapters to learn that Quiet Step does nothing in Phase 1.

**Fix option.** Add one line under the Attributes table: "Dormant entries wait for rules Phase 1 does not include; reserved entries wait for enemies fought hand to hand. Talents that name only these do nothing yet (see Actions)."

### Minor 21. "Two Focus Titans" is tagged as a Playtest rule, and the feedback page calls it a stand-in

**Location.** Packet line 1773 (`<span class="tag">Playtest rule</span>`), and lines 2676 and 2682 ("These rules stand in for rules the full game will add ... Two Focus Titans").

**Problem.** The close rule and a Titan's Positions after another Titan enters are decided Chapter 5 rules, not stopgaps. The chapters' stopgaps are:
- the interim day and interim issue;
- Funding 3;
- the setup table, with its retreat clock length;
- the round-time band.

The tag tells playtesters this rule is expected to change.

**Scenario.** After a rough two-Titan round, the group decides the close rule is provisional and ignores it for the rest of the session.

**Fix option.** Remove the tag at line 1773. Move the item to the feedback *Questions* list ("Did a second Titan enter, and could the table follow the Positions?").

### Minor 22. The feedback page has no question on the lone soldier

**Location.** Packet lines 2685 to 2694. Owner's Structure item 7 names "round length, lone-soldier odds, Grab lethality, gas, anything confusing". Round length, Grabs, gas, and confusion are covered.

**Scenario.** The playtest never records whether anyone tried a Nape strike alone, or how it went, although that is one of the numbers the owner asked the table to watch.

**Fix option.** Add "Did a soldier strike a Nape with no Openings or Help? What did they need, and did it land?"

### Minor 23. No "what you need" list, a D20 note that conflicts with "every die is a six-sided die", and no printable sheets

**Location.**
- Packet line 154: "Every die is a six-sided die."
- Packet line 166: "Use a different colour for each".
- Packet line 1787: "Shuffle twenty cards numbered 1 to 20 (a D20 with repeats re-rolled works)".
- The character sheet (line 733), the Squad sheet (line 1681), and the tracker (line 2264) are field lists only. Chapter 5 line 264 and `data/engagement/round.yaml` line 13 carry the D20 note, so the tension is inherited.

**Problem.** A group preparing a first playtest has to assemble the components themselves:
- D6s in three colours, enough for a pool;
- twenty numbered cards;
- Opening tokens;
- clock tracks.

Line 154 makes the D20 option read like a rule break. There is no blank sheet or tracker to print.

**Scenario.** The group arrives with one colour of dice and no cards. The GM improvises initiative with a D20, and a player cites line 154.

**Fix options.**
1. Add a "What you need" box after Contents: D6s in three colours, twenty cards numbered 1 to 20 or a D20, tokens for Openings and marks, and pencil clocks.
2. Line 154: "Every die in a dice pool or on a table is a six-sided die."
3. Add a one-page character sheet, Squad sheet, and tracker before the feedback page.

### Minor 24. Three quick-reference lines can be misread

**Location.**
- Line 2088: "Base dice: attribute + Talent + Bonus Dice (4 at most)".
- Line 2090: "Help: +1 Bonus Die per helper, 3 helpers at most. Same Position or one step away; spends the helper's action."
- Line 2100: "Dodge: Agility with ODM Gear or horse".

**Problem.**
- The first line can read as a cap of 4 base dice.
- Help's Position and cost apply only in a Titan Engagement.
- The horse supplies a dodge's Gear Dice only while you are mounted.

**Scenario.** A Slayer with Strength 4, Clean Cut 2, and 2 Openings reads line 2088 as "4 at most" and rolls 4 base dice instead of 8.

**Fix option.**
- "Base dice: attribute + one Talent + Bonus Dice (Bonus Dice 4 at most)."
- "Help (in a Titan Engagement): ..."
- "Dodge: Agility with ODM Gear, or your horse while mounted."

## Structure and readability, checked and passing

- **Structure.**
  - The order is cover, contents, player chapters, quick reference, GM section, glossary, and feedback page, as the owner asked.
  - The GM section opens with a "GM only" band and "Players do not read this section".
  - Titan stat blocks, Behavior Tables, the Abnormal's hidden values, and the GM procedures all sit behind it.
- **Printing.** Page breaks fall before each chapter, the quick reference, the GM band, each Titan, the glossary, and the feedback page. Boxes and table rows avoid splitting, and links print without colour.
- **Theme.** Colours are defined as light tokens, with dark overrides for both the system setting and an explicit dark theme, and a light print override. The body paints its own background.
- **Tables.** Every table sits in a scrolling wrapper, and the body never scrolls sideways.
- **Phone width.** The stat block definition lists stack to one column at 480 px or less.
- **Voice.**
  - Second person to players, bold triggers ("When you Push", "When you take Break Attention"), and numbered procedures.
  - Game terms are capitalised as in `CONTEXT.md`.
  - Eight in-world epigraphs, all original.
  - Worked examples for a Pushed dodge, a Feint, a Nape strike on a grounded Titan, and a Grab. Their dice, Stress, Critical Injury rows, and Fear Roll totals check out.
- **Batch 5.** 5-1, 5-2, 5-3, 5-4 (in the GM text), 5-5, 5-6, 5-7, 5-8, 5-10, 5-12, 5-13, 5-15, 5-16, 5-17, and 5-18 are all reflected. 5-9, 5-11, 5-14, and 5-19 touch nothing a table uses.
