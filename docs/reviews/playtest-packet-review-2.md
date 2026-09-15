# Wings of Freedom Phase 1 playtest packet: review, round 2

**Scope.**
- Under review: `docs/playtest/wings-of-freedom-playtest-packet.html` (2,893 lines, about 280 KB).
- Checked against Chapters 1 to 6 (`docs/rules/01-core-rules.md` to `06-standard-titans.md`), the `data/` YAML, `CONTEXT.md`, and `docs/rules/DECISIONS-2026-09-14.md` through 5-19.
- This round confirms the 28 round 1 findings, judges the three changes that went beyond round 1's wording, and runs the full brief again: fidelity, completeness, structure, language, and readability.
- Every count below is a finding still open in round 2.

**Not counted.**
- The packet is published as a Claude Artifact. The missing doctype, `html`, `head`, and `body` tags, the opening `<title>`, Google Fonts, the light and dark theme tokens, and the scrolling table containers are all intended.
- The packet follows the YAML where the chapters were corrected today to match it: Talent conditions, Squadmates never Push or Cover, the grounded-Titan exception for strikes, the Shattered Fear Roll's Reactions ban, Grabbed witnesses of a comrade's death, the Squad sheet row, the Sprinting Abnormal's Nape Depth of 3 to 4, Fall Back limits, and the 5-19 deaths reading. The packet matches each one.
- "Round length" (line 2384) keeps its "Playtest rule" tag, although it is now a timing target rather than a rule the table runs. See change (a) below. It is a labelling nit, not a finding.

**Checks run.**
- **Tables, row by row against the YAML.**
  - Harm and Mind: all four Critical Injury tables, Scars, Stress Responses, and Fear Rolls.
  - Gear: Standard Issue, Squad Supply, fall bands, and fall damage.
  - Setup: the four setup tables and Size Classes.
  - Character: Origins, Class Rank, and Drive triggers.
  - The Titans: the four stat blocks and the four Behavior Tables.
  - Every row matches, apart from the findings below.
- **Procedures, walked end to end against the YAML.**
  - The Titan Engagement: the round, the deal, the Titan cards, the end steps, and the ending tests.
  - The retreat: the clock, forced moves, the ban on Nape strikes, and Lift Comrade before the move.
  - Break Attention and the Feint: the decoy requirements, the hold timing at Tempo 1 and Tempo 2, and decoys in a row.
  - The Attention Ladder: the rungs, the marks, and the tie-break that skips the lowest card at an end step.
  - A Grab: the countdown, the lift, the ways out, the crush, the devour step, and a Grabbed soldier's death with its witnesses' Fear Rolls.
  - Critical Injuries and Down: damage to Down, the rolled Injury Location, worsening, Death Rolls, and a Down fall with its reference Titan.
  - The interim day: care windows and their scope, Field Repair, the interim issue with declining, and left-behind items.
  - The worked examples: the Pushed dodge, the Feint, the Nape strike on a grounded Titan, and the Grab with its rescue. All four reach the results the rules give.
- **Language.**
  - No em dashes. En dashes appear only in numeric ranges.
  - No YAML, probe, simulator, OQ, ADR, PROVISIONAL, or flag-lifetime wording, and no simulation percentages.
  - No `_Avoid_` term, and no "[missing rule" marker.
  - None of the `CONTEXT.md` terms outside Phase 1 appear (Commendations, Faction, Squad Points, and the rest).
- **Layout.**
  - 70 tables, all inside `.table-wrap`.
  - 106 ids with no duplicates, and 98 in-page links, none broken.
  - Headless Chrome at its narrowest window (500 px): the page `scrollWidth` equals the viewport, and no element outside a table wrapper overflows. 26 wrappers scroll sideways, as intended.
  - Headless Chrome print with the packet's print CSS (fallback fonts): 104 pages in all, and the quick reference prints on one. With and without the Part One divider the page count is the same, so the divider is not stranded.
- **Odds.** I ran two small Python calculations in a scratch directory to judge how often the two quick-reference findings come up at the table. The numbers are quoted in those findings.

## Verdict

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 1 |
| Minor | 5 |

**Rules.**
- All 28 round 1 findings are resolved, and none of the fixes introduced an error.
- The player chapters and the GM section state every rule I walked the way the chapters and YAML do.
- The one Major finding sits in the quick reference. Its Jam and Dry lines drop both halves of the strike rule the chapters corrected today: the ban on Body Part strikes from On Body or Blind Spot, and the grounded-Titan exception.
- A group with only this packet can make soldiers, run the interim day and the interim issue, and run a Titan Engagement against each of the four Titans through the retreat and the end steps.

**Structure.**
- The order is right: player material, quick reference, GM section, glossary, and feedback page.
- Print breaks fall before the GM band and before each Titan.
- No hidden value appears before the Hidden values page.
- The remaining structure problem is labelling. The GM band says players do not read the Titans' stat blocks and Behavior Tables, and four lines later it says the Behavior Tables are public (Minor 2).

## The three changes beyond round 1

**(a) The fallback paragraph in the round timing note was removed. Acceptable.**
- The removed fallbacks were triggered by a median taken across playtest tables. One table cannot work that out during play, so the paragraph could not be run as a rule.
- The note that remains (lines 2384 to 2386) gives the target band and sends the GM to the feedback page's timed rounds table. That is all a first playtest needs.
- The "Playtest rule" tag on a target is the only leftover. "Playtest target" would be more accurate, but it misleads no one.

**(b) The Titan pages say "GM section" and the Hidden values page says "GM only". Partly right.**
- **What the chapters make public.** Chapter 6 says "A standard Titan's numbers are public" (line 60), and an Abnormal's Behavior Table "stays public" (line 247). Only an Abnormal's Toughness, Nape Depth, Regeneration clock length, and ladder are printed "only in a GM section, which players do not read".
- **What the packet puts where.** Nothing hidden appears on the four Titan pages, and the hidden values sit only on the Hidden values page. The split of content is correct.
- **Where the labels go wrong.**
  - Chapter 6 uses "GM section" as its label for the hidden material itself (line 289: "GM section: the Sprinting Abnormal's hidden values"). The packet puts that label on the public pages.
  - The GM band (line 2239) still lists the stat blocks and Behavior Tables among what players do not read.
  - A reader can't tell from "GM section" and "GM only" which pages they may show a player. See Minor 2.

**(c) 15 glossary terms were moved under "Terms for later rules". Acceptable.**
- Each moved term is either unused in the packet or used only to say that its rule is not in Phase 1.
- Every term the packet's rules use is in the main glossary.

## Round 1 findings

| Round 1 finding | Status | Evidence (packet line) |
|---|---|---|
| Major 1. The decoy hold ends on the next card, which is wrong at Tempo 2 | Resolved | 1940: the hold lasts as many cards as the Titan's Tempo, with both Tempo cases spelled out |
| Major 2. An entering Background Titan puts soldiers who have left back in | Resolved | 1807 and 2370: "a soldier who has left stays out" |
| Major 3. The player-side tie-break drops the end-step skip | Resolved | 1894, 2163, and 2555 all carry it |
| Major 4. The quick reference prints on two pages | Resolved | Headless Chrome print: one page |
| Minor 1. The nearest rung reads "any soldier" | Resolved | 1890 and 2553 |
| Minor 2. The last-Position rule is only in the GM section | Resolved | 1090 and 1996 |
| Minor 3. The release rule does not cover a holding Titan that dies | Resolved | 2056 and 2368 |
| Minor 4. The start-of-fight bullets give the retreat clock to the GM | Resolved | 1744 and 1747 |
| Minor 5. The Position meanings drift from the source | Resolved, with one new drift | 1754 to 1757. The Distant sentence now drifts the other way (Minor 3 below) |
| Minor 6. Dropped conditions in Read and the Grab | Resolved | 2008 and 2042 |
| Minor 7. The GM card procedure drops small conditions | Resolved | 2291 and 2337 to 2344 |
| Minor 8. The Abnormal ladder notes drop qualifiers | Resolved | 2361, 2560, and 2561 |
| Minor 9. When the ending tests are checked, and the order of full clocks | Resolved | 2095 and 2370 |
| Minor 10. The GM Grab bullets drop "still Grabbed" and what follows a death | Resolved | 2378 and 2380 |
| Minor 11. The Hidden values page calls everything on it Read-only | Resolved | 2535 names the public values |
| Minor 12. The timing note reads as a test protocol | Resolved | 2383 to 2386, and the feedback page's timed rounds table |
| Minor 13. "You may show them" makes public tables optional | Resolved | 2243: "show them to any player who asks". The band at 2239 now contradicts it (Minor 2 below) |
| Minor 14. The tracker example uses "Flags" and unexplained codes | Resolved | 2308 to 2311: "Marks", a key to every code, and the full player tracking list. The example's card count is wrong (Minor 4 below) |
| Minor 15. GM procedures have no pointers to player rules | Resolved | 2244 |
| Minor 16. The Titans intro is stranded, and later GM pages are unmarked | Resolved | Print CSS `#titan-small{break-before:auto}`, and a kicker on every Titan page and the Hidden values page |
| Minor 17. "Tally" and "count", Body Part State, glossary extras | Resolved | "count" throughout, Body Part State in the glossary |
| Minor 18. The Squad sheet columns use variable letters | Resolved | 1722 and 1723 |
| Minor 19. Design-document asides remain | Resolved | 2393, and the parenthetical at 826 is gone |
| Minor 20. "Dormant" and "reserved" are used before they are defined | Resolved | 409 |
| Minor 21. "Two Focus Titans" is tagged Playtest rule and called a stand-in | Resolved | The tag is removed, and 2880 is reworded |
| Minor 22. The feedback page has no question on the lone soldier | Resolved | 2876 |
| Minor 23. No "what you need" list, the D20 note, no sheets | Resolved | The What you need box, 185, and the sheets section |
| Minor 24. Three quick-reference lines can be misread | Resolved | 2121, 2123, and 2133 |

## The edits that would most improve the packet

1. Give the quick reference's Jam and Dry lines the full strike rule: no Nape strike, and no Body Part strike from On Body or Blind Spot, unless the Titan is grounded (Major 1).
2. Rewrite the GM band so it no longer lists the Behavior Tables and standard stat blocks as unreadable. Label the Titan pages as public and keep "GM only" on Hidden values (Minor 2).
3. Add "not from a horse" to the quick reference's fall band raise (Minor 1).
4. Make Distant's sentence say any Behavior Table entry that names Distant reaches it, not only a running Titan's (Minor 3).
5. Give the tracker example a Medium Titan one card, and make the same fix in `data/engagement/round.yaml` (Minor 4).

## Findings

### Major 1. The quick reference's Jam and Dry lines drop both halves of the strike rule

**Location.**
- Quick reference, Gear box, lines 2194 and 2195:
  - "**Jam** at ODM Gear 0: no ODM moves, no Nape strike, and you fall if airborne."
  - "**Dry** at Gas 0: no ODM moves or Nape strike, but no fall."
- Sources: the player chapter at line 1290, and `data/gear/odm-gear.yaml` (strikes, jam, running_dry).

**Problem.**
- The rule has two halves:
  - While Jammed or dry, you cannot make a Nape strike, and you cannot make a Body Part strike from On Body or Blind Spot.
  - Both restrictions are lifted while the Titan is grounded.
- The quick reference gives only "no Nape strike". It drops the Body Part strike ban, so it permits a strike the rules forbid. It also drops the grounded-Titan exception, so it forbids a strike the rules allow.
- The chapters' strike text was corrected today to carry this exception, so the owner already treats it as a rule that matters.
- The quick reference is the page the table keeps open mid-fight. Round 1's Major 3 set the precedent that a condition dropped from it is Major.

**How often it comes up.** A soldier makes a Gas Roll of 2 dice at the end of every round they used ODM Gear, and each 1 costs a point of a Gas Rating of 3. Before any refit:
- One soldier runs dry within 4 rounds 13.5% of the time, and within 5 rounds 22.5% of the time. One Pushed ODM roll in those rounds raises the figures to 17.8% and 27.3%.
- For 4 player characters, at least one is dry by round 4 about 44% of the time, and by round 5 about 64% of the time.
- Running dry does not make a soldier fall. An airborne soldier stays at their Position (line 1364), so the dry soldier On Body is the common case.

**Scenario.**
- **The Body Part strike.** Round 5 against the standard Large Titan. Mila ran dry at the end of round 4 and, since running dry is not a fall, still holds On Body. She checks the quick reference, which bans only Nape strikes, and strikes the Titan's arm. Under the rules she cannot make that strike, so every success she scores on that arm is one the rules never allowed.
- **The grounded exception.** Jonas's ODM Gear Jammed while he was airborne at Blind Spot, so he fell and landed In Reach. Kurt then Broke the Titan's left leg, so it is grounded, and every step between In Reach and Blind Spot can now be made on foot (line 1800). Jonas walks back to Blind Spot. The quick reference says a Jammed soldier makes no Nape strike, so he Breaks Attention instead. Under the rules the grounded Titan lifts the ban, and he could have struck with the grounded Titan's Bonus Die (line 1978).

**Fix options.**
1. Replace both lines with one: "**Jammed or dry:** no ODM moves; no Nape strike, and no Body Part strike from On Body or Blind Spot, unless the Titan is grounded. Jammed and airborne, you fall. Dry, you do not."
2. Keep two lines and add the same clause to each: "...no Nape strike or Body Part strike from On Body or Blind Spot (a grounded Titan lifts this)...".

### Minor 1. The quick reference's fall band applies the Giant Forest and Large raise to a fall from a horse

**Location.**
- Quick reference, Falls and retreats box, line 2203: "Band: horse or Distant or In Reach low (+0); On Body or Blind Spot high (+2). Giant Forest or Large raises one step, to extreme (+4) at most."
- Sources: the player chapter, lines 1453 to 1455, and `data/gear/falls.yaml` (height, steps 2 and 4): "A fall from a horse is low, and no later step changes it", and "For a fall that is not from a horse, raise the band one step".

**Problem.**
- The raise sentence has no "not from a horse", so it reads as applying to every band the first sentence gives, the horse's included.
- The player chapter is right, and a careful reader may take "horse ... low" as fixed. That is why this is Minor rather than Major, the same weighting as round 1's Minor 24.

**Scenario.**
- **The fight.** An engagement with Anchor Rating Giant Forest, against the Sprinting Abnormal. The Squad rode in, and Ilse is still mounted when she becomes Down, so she falls from a horse.
- **The misread.** The table reads the quick reference, raises her low band to high, and rolls D6+2.
- **The odds.** Low (D6+0) does no harm on a 1 or 2, averages 1 damage, and does 2 or more 33.3% of the time. The misread high band (D6+2) always does harm, averages 2 damage, and does 2 or more 66.7% of the time.
- **The cost.** The misread doubles her expected fall damage and removes her one-in-three chance of landing unharmed.

**Fix options.**
1. "Giant Forest or Large raises a fall not from a horse one step, to extreme (+4) at most."
2. Split the band line: "From a horse: always low (+0). Otherwise: Distant or In Reach low, On Body or Blind Spot high; Giant Forest or Large raises one step."

### Minor 2. The GM band says players do not read the Titan pages, then says their tables are public, and the labels do not tell a reader which is which

**Location.**
- GM band, line 2239: "**Players do not read this section.** It holds how the GM runs a Titan Engagement, the Titans' stat blocks and Behavior Tables, and the values an Abnormal keeps hidden."
- Line 2243: "Behavior Tables are public. ... show them to any player who asks."
- The kickers: "GM section" on the four Titan pages (lines 2397, 2431, 2465, 2499), and "GM only" on the band (2238) and on Hidden values (2533).
- Sources:
  - `docs/rules/06-standard-titans.md` line 60: "A standard Titan's numbers are public."
  - Line 247: an Abnormal's Behavior Table "stays public".
  - Line 289: Chapter 6 uses "GM section" as the label for the hidden values subsection itself.

**Problem.**
- **Line 2239 against line 2243.** Line 2239 bars players from reading the Behavior Tables, and line 2243 tells the GM to show them.
- **The standard stat blocks.** Line 2239 also bars players from the standard Titans' stat blocks, which Chapter 6 makes public. Line 2243 names only the Behavior Tables as public, so the stat blocks are covered by neither sentence.
- **The labels.** "GM section" and "GM only" mean the same thing to a reader. In Chapter 6, "GM section" is the label for hidden material. Nothing on the Titan pages tells a player or GM that the page may be shown.
- **No leak.** The content split is correct and no hidden value is exposed. This is labelling, so Minor.

**Scenario.**
- **The request.** Before the first fight, a player asks to see the standard Large Titan's Toughness and Behavior Table so she can plan who strikes the legs.
- **The GM's reading.** The GM turns to the page, sees "GM section" and the band's "Players do not read this section", and refuses.
- **The cost.** The players plan blind against a Titan whose numbers the rules make public. At the next table, another GM reads line 2243 and shows the tables. The two playtest groups then report on different games.

**Fix options.**
1. Reword the band: "Players do not read the running notes or the Hidden values page. The Titans' stat blocks and Behavior Tables are public: show them to any player who asks." Kicker the four Titan pages "Public: show players".
2. Keep "GM section" on the Titan pages but add a one-line note under each Titan's heading: "This page is public. Only the Hidden values page is not." Correct line 2239 to match.

### Minor 3. Distant says only a running Titan's behavior reaches it, but the standard Small and Large Titans reach it too

**Location.**
- Player chapter, Positions and moves, line 1754: "**Distant** is out of a standing Titan's reach. A running Titan's behavior can still reach it."
- Sources:
  - `data/engagement/positions.yaml` (distant.meaning): "A Behavior Table entry may still name distant in its Position requirement, as a running Abnormal's does".
  - Chapter 6, line 126: the standard Small Titan's Lurch Closer needs "Distant, In Reach".
  - Chapter 6, line 214: the standard Large Titan's Heavy Tread needs "Distant, In Reach", and it targets "holder and everyone at their Position".

**Problem.**
- The YAML gives the running Abnormal as one example of an entry that names Distant.
- The packet turns that example into the whole rule, so players are told that no standing Titan can touch Distant.
- Two of the three standard Titans can, and neither is running.
- The Behavior Tables are public, so a player can check. That is why this is Minor. But this sentence is the first thing a player learns about Distant.

**Scenario.**
- **The plan.** Against the standard Large Titan, the Squad pulls back to Distant to regroup, holding Attention with Kurt, since "a standing Titan's reach" cannot touch them.
- **The behavior.** The Titan's card turns up Heavy Tread, which needs the holder at Distant or In Reach and both legs. It hits Kurt and every soldier at his Position.
- **The cost.** All four take Stress +1 from a behavior the player chapter told them could not reach.

**Fix options.**
1. "**Distant** is out of a standing Titan's reach. A Behavior Table entry that names Distant still reaches it, such as the Small Titan's Lurch Closer, the Large Titan's Heavy Tread, or the Sprinting Abnormal's Trample."
2. "**Distant** is out of reach of a Titan's hands. A Behavior Table entry that names Distant still reaches you there; check the Titan's table."

### Minor 4. The tracker example deals a Medium Titan two cards

**Location.**
- GM section, tracker example, line 2308: "A Medium | cards 4, 15 | Att: Jonas | ...".
- Inherited from `data/engagement/round.yaml` (gm_tracker.focus_titan_row.example, line 158), which has the same "cards 4, 15".
- The standard Medium Titan is Tempo 1 (`data/titans/standard-medium.yaml`, line 18), and the packet's own stat block agrees.

**Problem.**
- A Focus Titan is dealt as many cards as its Tempo. The example row shows a Medium Titan with two.
- The row is marked only "A Medium", so a GM reads it as the standard Medium Titan.
- The Sprinting Abnormal is also Medium but Tempo 2. The row's Regeneration clock of 3 matches the standard Medium Titan and not the Abnormal, whose clock length is hidden and would not show as "1/3".
- The packet copies the source faithfully, but the source example is internally wrong.

**Scenario.**
- **The setup.** A GM copies the tracker layout for the first fight against the standard Medium Titan, following the example.
- **The deal.** At the deal they hand the Titan two cards.
- **The cost.** The Titan acts twice a round. Its hold timing shifts too, because a decoy now holds for two cards.
- **Why no one catches it.** The Size Class table and stat block say Tempo 1, but the GM has trusted the worked example over the table. The first fight's feedback then reports a Medium Titan that is far too deadly.

**Fix options.**
1. Change the example to "cards 4". Make the same change in `round.yaml` so the chapter and packet stay matched.
2. Make the row "A Small | cards 4, 15" and update its Regeneration clock to the Small Titan's length. The example then still shows how two cards look.

### Minor 5. The riderless-horse decoy row does not say which Focus Titan the horse's Position is compared against

**Location.**
- Decoys table, line 1936: "Your own horse is not lame, and you are mounted on it or it holds your Position."
- Also line 848 and line 1280, the not-had rules: "it holds your Position".
- Sources:
  - `data/engagement/attention.yaml` (riderless-horse.requirement): "both compared relative to the Focus Titan recorded with the horse's Position".
  - The packet itself says this for mounting at line 1406, and records the horse's Position with a Focus Titan at line 1395.

**Problem.**
- With two Focus Titans, every soldier holds two Positions, and the horse's Position is recorded against one of them.
- The decoy row does not say which comparison counts.
- The packet's mounting row does say it, so the omission is also an inconsistency inside the packet.
- It only matters with two Focus Titans, so it is Minor.

**Scenario.**
- **The positions.** A Background Titan has entered as Titan B. Jonas dismounted In Reach of Titan A, and his sheet records the horse at In Reach relative to A. He now holds In Reach of A and Distant of B.
- **The question.** Titan B's Attention is on Mila, and Jonas wants to send his horse at B.
- **The two readings.** One player reads "it holds your Position" as In Reach, the horse's Position, matched against Jonas's Position relative to B, which is Distant. That fails. Another compares both against A, as the YAML does, and the requirement is met.
- **The cost.** Nothing on the page settles it, so the table argues.

**Fix options.**
1. "Your own horse is not lame, and you are mounted on it or it holds your Position relative to the Focus Titan recorded with it."
2. Add the same clause to lines 848 and 1280, so all three horse checks read alike.

## Structure pass

- **Order.** Cover, contents, What you need, Part One (Core, Soldier, Actions, Harm, Gear, Fight), quick reference, GM band, the Titans, Hidden values, glossary, sheets, and feedback page. This is the owner's order.
- **Links.** All 98 in-page links resolve, with no duplicate ids.
- **Printing.** Page breaks fall before each chapter, the quick reference, the GM band, each Titan, the glossary, and the feedback page. The quick reference fits one page, and the Titans intro is no longer stranded.
- **Hidden information.** Nothing hidden appears in the player section. The Sprinting Abnormal's page shows only its public Size Class, Abnormal status, Tempo, and Behavior Table.
- **Labels.** The one open structure issue is Minor 2.

## Language and readability pass

- **Voice.** Players are addressed in the second person and the GM as the GM. Triggers are bolded and procedures are numbered. The capitalised terms match `CONTEXT.md`, with "mark" used consistently for the Attention marks.
- **Clean text.** No design-document asides remain, and there is no developer vocabulary, em dash, or filler.
- **Phone width.** At 500 px, the narrowest window headless Chrome allows, the body does not scroll sideways, and every wide table scrolls inside its own container.
