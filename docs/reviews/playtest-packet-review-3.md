# Wings of Freedom Phase 1 playtest packet: review, round 3

**Scope.**
- Under review: `docs/playtest/wings-of-freedom-playtest-packet.html` (2,892 lines, about 280 KB).
- Checked against Chapters 1 to 6, the `data/` YAML, `CONTEXT.md`, and `docs/rules/DECISIONS-2026-09-14.md` through 5-19.
- This round confirms the round 2 findings of both reviews (Opus: 1 Major, 5 Minor; Codex: 2 Critical, 1 Major, 1 Minor). It checks that the fixes add no new error, and gives the quick reference a full line-by-line check.
- Every count below is a finding still open in round 3. The two source notes at the end are not counted.

**Not counted.**
- The Artifact form (no doctype, `html`, `head`, or `body` tags, the opening `<title>`, Google Fonts, the theme tokens, and the scrolling table containers) is intended.
- The GM band now reads "For the GM" instead of the brief's "GM only". Chapter 6 makes the standard stat blocks and every Behavior Table public (lines 60 and 247), and the task asks for labels that match the chapters. "GM only" now sits on the Hidden values page alone, which is correct.
- "Round length" (line 2383) still carries a "Playtest rule" tag, although it is a timing target. This is the same labelling nit as round 2.

**Checks run.**
- **What changed.** I diffed the round 2 build (`scratchpad/phone-check.html`, 2,893 lines) against the current file. The only content changes are at lines 139, 664, 848, 1280, 1322, 1363, 1424, 1754, 1936, 2149, 2194, 2202, 2204, 2237 to 2242, 2307, 2392, and the four Titan kickers. Each one was checked against its source.
- **Quick reference, line by line** (lines 2114 to 2233), checked against:
  - `dice-pool` and Chapter 1 for rolling, Help, the Push, and wear;
  - `round.yaml` for the turn, deal, swap, and end steps;
  - `titan-harm.yaml` and `odm-gear.yaml` for strikes, Broken parts, and the Jam and dry rule;
  - `attention.yaml` for the ladder, marks, and Break Attention;
  - `grab.yaml` for the Grab;
  - `falls.yaml` and `background-titans.yaml` for falls and the retreat;
  - the Fear Roll and fall damage tables.
- **Procedures walked again.** The round, the Attention Ladder and its evaluation, Break Attention with the Feint and the hold timing, the Grab (hold, crush, countdown, ways out, release, a Grabbed soldier's death), the retreat's triggers and forced moves, a Titan's death, and Background entry.
- **Worked examples.** I recomputed all four: the Pushed dodge, the Feint, the Nape strike on a grounded Titan, and the Grab with its rescue. Each pool, success count, Push, wear, Opening, and hold reaches the result the rules give.
- **Tables.** Changed rows: Hand-to-Hand (`talents.yaml`) and the riderless-horse decoy (`attention.yaml`). Re-sampled: the Sprinting Abnormal's Behavior Table and hidden stat block, row by row against `sprinting-abnormal.yaml`, and the torso Critical Injury table. All match.
- **Language.** No em dashes. No YAML, probe, simulator, OQ, ADR, PROVISIONAL, or flag wording: the two case-insensitive "adr" hits are in "adrenaline". No `_Avoid_` term, and no "[missing rule" marker.
- **Layout.**
  - 70 tables, all inside `.table-wrap`.
  - 106 ids with no duplicates, and 101 in-page links, none broken.
  - Headless Chrome at 500 px, its narrowest window: `scrollWidth` 500 equals the viewport, and no element outside a table wrapper overflows.
  - The quick reference grew this round, so I printed it again with the packet's print CSS: **one page**.
  - The whole-packet print hung in headless Chrome and was not re-run. The print CSS is unchanged from round 2, which verified the breaks.
- **Odds.** A Python simulation (400,000 Grabs a row, scratch directory) measures how much Major 1 changes a Grabbed soldier's chance of freeing themselves.

## Verdict

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 1 |
| Minor | 3 |

- **Round 2 findings.** Every one is resolved, and no fix introduced an error. The quick reference's Jam, dry, Body Part strike, fall band, and retreat lines now match the sources.
- **The open Major.** The quick reference's Grab box drops the rule that the Grab spends the action of the victim's first counted turn, and the GM's Running a Grab bullets drop it too. Only the player chapter's Grab section (line 2036) and its example state it. With both summaries silent, a table misses it easily, and the miss more than doubles a lone soldier's chance of breaking free. That distorts Grab lethality, one of the things this playtest measures.
- **The Minors.** All three are smaller omissions in the quick reference: the dodge's comparison with later behaviors, the ladder's tie narrowing and the Down-soldier limit, and four small conditions.
- **Completeness.** A group with only this packet can make soldiers, run the interim day and interim issue, and run a Titan Engagement against each of the four Titans through the retreat and the end steps.

## Round 2 findings

| Round 2 finding | Status | Evidence (packet line) |
|---|---|---|
| Opus Major 1 / Codex Critical 1. The quick reference's Jam, dry, and Body Part strike lines drop the strike ban and the grounded exception | Resolved | 2194: one line, "no Nape strike or Body Part strike from On Body or Blind Spot unless the Titan is grounded". 2149: the Body Part line adds "Not Grabbed, part not Broken; working ODM Gear from On Body or Blind Spot unless grounded" and "except a holding arm". 1322 and 1363 add the grounded exception to the Jam and dry boxes. All match `odm-gear.yaml` (strikes) and `titan-harm.yaml` (body_part_strikes, grounded) |
| Opus Minor 1 / Codex Critical 2. The quick reference raises a horse fall | Resolved | 2202: "from a horse always low (+0). Otherwise ... Giant Forest or a Large reference Titan raises it one step". Matches `falls.yaml` |
| Codex Major 1. The quick reference omits the Background-clock retreat trigger | Resolved | 2204: "or a Background clock fills with two Focus Titans alive". Matches `background-titans.yaml` (retreat.starts) |
| Opus Minor 2. The GM band bars players from public pages, and the labels are unclear | Resolved | 2237 and 2238: "For the GM", with only Hidden values GM only. 2242 names the stat blocks and Behavior Tables as shown on request. 2392: "Every page of this chapter is public". Kickers at 2396, 2430, 2464, and 2498 read "For the GM · public", and 2532 keeps "GM only". The content split still hides nothing it should show and shows nothing it should hide |
| Opus Minor 3. Distant says only a running Titan reaches it | Resolved | 1754: an entry whose needed Positions include Distant, "Any" included, still happens there. Matches `positions.yaml` (distant.meaning) |
| Opus Minor 4. The tracker example deals a Medium Titan two cards | Resolved in the packet | 2307: "cards 4". The source example is still wrong (Source note 1) |
| Opus Minor 5. The riderless horse does not name its Focus Titan | Resolved | 1936, 848, 1280, and 1424 all add "relative to the Focus Titan recorded with it". Matches `attention.yaml` (riderless-horse) |
| Codex Minor 1. Hand-to-Hand reads "Blade Sets" | Resolved | 664: "with blades or bare hands". Matches `talents.yaml` |

## The edits that would most improve the packet

1. Add the Grab's action spend to the quick reference's Grab box and to the GM's Running a Grab bullets, with Pry Loose's penalty after the lift (Major 1).
2. Add the dodge's comparison with later behaviors to the quick reference's Dodge line (Minor 1).
3. Add the lower-rung narrowing and the Down and carried limit to the quick reference's ladder note (Minor 2).
4. Tighten the four small quick-reference omissions in Minor 3.
5. Re-print the quick reference after these edits to confirm it still fits one page.

## Findings

### Major 1. The Grab's spend of the first counted turn's action is missing from both Grab summaries

**Location.**
- Quick reference, The Grab box, lines 2177 to 2187: "End of your 1st counted turn: **lifted**. End of your 2nd: **devoured**." and "**Out:** Break Free 2 (2-die penalty lifted); Pry Loose 2 at On Body; ...".
- GM section, Running a Grab, lines 2376 and 2377: records the arm and the countdown and counts the turns, with no action spend.
- Sources:
  - `data/engagement/grab.yaml` (countdown.first_turn_action): "The action of the Grabbed soldier's first counted turn is spent by the Grab, whether or not a Reaction or any other result has already spent it."
  - Chapter 5 line 701, and line 731: "the Grab spends it, dodge or no dodge, so declining to dodge a revealed Grab gains nothing".
  - The packet states it only at line 2036, and shows it in the example at 2062.

**Problem.**
- **What the rule does.** A Grabbed soldier's own Break Free can come only on their second counted turn, after the lift, at the 2-die penalty. The rule makes a dodged Grab and an undodged Grab cost the same.
- **What the summaries allow.** The two procedures a table runs a Grab from both omit the spend. The quick reference's "Break Free 2 (2-die penalty lifted)" invites an unpenalised Break Free on the first counted turn. Pry Loose's own 2-die penalty after the lift (`grab.yaml`, pry-loose, lifted_penalty) is also missing from the box.
- **Who catches it.** Nobody reliably. The GM's bullets are silent, so the GM will not stop it. The misread also makes declining a dodge against a revealed Grab strictly better, which the rule exists to prevent.
- **Why it matters.** Grab lethality is one of the brief's feedback items, and the feedback page's session log records how each Grab ended.

**How much it changes.**
- **The model.** A Grabbed soldier who did not dodge, with a Blade Set rated 1, no Help, and one Push when short and allowed. The crush is rolled on the torso table, where 10 or more gives Caved-In Chest and so Down (1 in 6). Stress Response effects are ignored.
- **Rules:** one Break Free, on the second counted turn, with the lifted penalty.
- **Misread:** a Break Free on the first counted turn with no lifted penalty, then, on a failure, a second one lifted.
- **Results, the chance the soldier frees themselves:**

| Soldier | Rules | Misread |
|---|---|---|
| Strength 3, no Talent, Stress 1 | 18.9% | 43.1% |
| Strength 3, no Talent, Stress 2 | 25.8% | 50.0% |
| Strength 5, Grip Breaker 1, Stress 1 | 36.1% | 65.7% |
| Strength 5, Grip Breaker 1, Stress 2 | 40.2% | 67.7% |

**Scenario.**
- **The Grab.** Against the standard Medium Titan, the Titan's card 5 resolves Grab (Severity 3) on Lena, who holds card 9. She has Agility 3, ODM Gear 2, and Stress 1: 6 dice needing three 6s. She declines to dodge, and the Grab lands.
- **The crush.** Cracked Ribs: a 1-die penalty on Break Free.
- **The misread.** On card 9 her player reads the quick reference and takes Break Free with 2 base dice, 1 Gear Die, and 1 Stress Die. The GM's Grab bullets do not object.
- **The rules.** Card 9's action is spent by the Grab, and Lena is lifted at its end. Her only Break Free comes next round, at 1 base die.
- **The cost.** The session log then reports a Grab the Squad "survived easily". The table learns to decline every dodge against a revealed Grab.

**Fix options.**
1. Quick reference Grab box: "The Grab spends the action of your 1st counted turn. End of that turn: **lifted**. End of your 2nd: **devoured**." Add "(2-die penalty lifted)" after Pry Loose as well. GM bullet: "The Grab spends the action of the soldier's first counted turn, whether or not a dodge or anything else already spent it."
2. If the page is tight, shorten the Out line to "Break Free or Pry Loose 2 (2-die penalty once lifted)", and add the spend to the countdown line. Re-print to confirm one page.

### Minor 1. The quick reference's Dodge line omits that one dodge is compared with every later behavior that round

**Location.**
- Quick reference, line 2133: "**Dodge:** ... Spends your earliest wholly unspent turn. One dodge per Titan per round."
- Sources:
  - Chapter 1 (Reactions) and the packet's own line 355: "compare its successes with that behavior's Severity and, separately, with every later behavior that Titan resolves against you this round".
  - The packet at 1867, and `behavior-procedure.yaml` (resolving_a_card, reactions).

**Problem.**
- "One dodge per Titan per round" is true, but on its own it reads as "after one dodge, later behaviors land". The comparison is half of the rule.
- It matters against Tempo 2 Titans: the standard Small Titan (a third of setup rolls) and the Sprinting Abnormal.
- The GM's card procedure (line 2341) prompts the comparison, so the table is likely to get it right. That makes this Minor. But the quick reference is what a player reads when deciding whether a dodge on the first card is worth a turn.

**Scenario.**
- **The first card.** Against the standard Small Titan, card 3 resolves Clutch at the Legs (Severity 2) on Dieter. He dodges with 2 successes.
- **The second card.** Card 14 resolves Bite (Severity 2) on him.
- **The misread.** Reading "one dodge per round", he takes the Bite's leg Critical Injury.
- **The rules.** His 2 successes are compared again, and the Bite misses.

**Fix options.**
1. "One dodge per Titan per round. Its successes also count against every later behavior from that Titan this round."
2. "One dodge covers the round: compare it with each later behavior from that Titan."

### Minor 2. The quick reference's ladder note skips the lower-rung narrowing and the Down and carried limit

**Location.**
- Quick reference, Attention Ladder box, line 2163: "Ties: current holder, then lowest card (not before the deal or at an end step), then nothing."
- Sources:
  - `attention.yaml` (evaluation, narrow): ties are narrowed by each lower rung before the holder or a card decides.
  - `attention.yaml` (candidates, down and carried): Down and carried soldiers meet only rungs that allow it, on the standard ladder only nearest.
  - The packet states both at lines 1894 and 1895, and in the GM section at 2354 and 2360.

**Problem.**
- The note sends a tie straight to the current holder. The rules first narrow it by the lower rungs.
- The box also never says that a Down or carried soldier meets only the nearest rung.
- The GM evaluates the ladder from the complete GM procedure, so this misleads players' plans rather than the result. That makes this Minor.

**Scenario.**
- **Narrowing.** Against the standard Medium Titan, Kurt holds its Attention at In Reach. Mila, also In Reach, strikes its left leg for 1 success. By the note, the two tie on rung 2 and Kurt keeps the Titan's Attention, so Mila stays put to cut again. By the rules, the tie narrows at "just hurt it", and the Titan's next card turns on Mila.
- **Down.** Jonas lies Down at In Reach, and Ilse, marked as loud, holds Blind Spot. By the box, Jonas is on rung 2. By the rules he meets only nearest, so Ilse draws the card.

**Fix options.**
1. "Down or carried soldiers meet only Nearest. Ties: narrow by each lower rung, then current holder, then lowest card (not before the deal or at an end step), then nothing."
2. Keep the note short and add "(narrowed by lower rungs first; see The Attention Ladder)".

### Minor 3. Four smaller conditions dropped from the quick reference

**Location and sources.**
- **Swap, line 2138:** "same Position or one step, neither Down nor Grabbed". `round.yaml` (swapping) also lets two soldiers who have both left swap, requires each to hold a card, and limits each soldier to one swap a round. The packet has all three at 1834.
- **Feint, line 2172:** "working ODM Gear, sound horse, or on foot against a grounded Titan". `attention.yaml` (feint) requires being **mounted on** your own horse that is not lame. "Sound" is also not a packet term: the packet says "not lame".
- **Body Part strike, line 2149:** omits that once the part is Broken, each remaining success creates an Opening (`titan-harm.yaml`, body_part_strikes, resolving). The Openings box elsewhere in the packet (1986) has it, but the quick reference's only Opening sources are the Nape strike and Break Attention.
- **End steps, line 2140:** omits that no clock fills during a retreat (`background-titans.yaml`, ticks.stopped; packet 1826).

**Problem.** Each is a small condition. The GM section or the player chapter carries every one, so none is likely to stand at the table for long.

**Scenario.**
- **The misread.** At Wooded, Hanne is dismounted In Reach, and her horse (rated 2) holds In Reach beside her. Her ODM Gear is Jammed. She reads "sound horse" and Feints with 2 Gear Dice from the horse.
- **The rules.** The Feint needs her mounted, so the Feint is not available to her. The riderless horse is her only decoy with the horse.

**Fix options.**
1. Swap: "same Position or one step (or both have left), neither Down nor Grabbed, one swap each". Feint: "mounted on a horse that is not lame". Body Part strike: add "past Broken, each success is an Opening". End steps: add "(no clock fills in a retreat)".
2. If space is short, fix the Feint wording only, since it is the one that permits a roll the rules forbid, and re-print.

## Source notes (not counted in the packet findings)

### Source note 1. The tracker example in `round.yaml` deals the standard Medium Titan two cards (confirmed)

**Location.** `data/engagement/round.yaml`, `gm_tracker.focus_titan_row.example` (line 158): "A Medium | cards 4, 15 | ... | Prev: Bite | ... | Regen 1/3 | ...".

**Problem.**
- The row can only be the standard Medium Titan:
  - "Prev: Bite" is on the standard Medium Titan's Behavior Table, but not on the Sprinting Abnormal's, the only other Medium.
  - "Regen 1/3" shows a clock length, which the tracker shows for the Abnormal only once a Read reveals it.
- The standard Medium Titan is Tempo 1 (`data/titans/standard-medium.yaml`, line 18), so it is dealt one card.
- No Phase 1 Titan is Medium, has Bite, and draws two cards.
- The example is YAML only: Chapter 5 does not render it, so only the data file carries the error. The packet now reads "cards 4" and no longer copies it.

**Fix.** Change the example to "cards 4".

### Source note 2. "No clock fills during a retreat" does not say whether the Regeneration clock stops

**Location.**
- `background-titans.yaml`: ticks.stopped and retreat.effects (no-entries), "No clock fills, the retreat clock included".
- DECISIONS 5-10: "no clock fills during a retreat".
- Chapter 5 line 771.
- `round.yaml` states it only inside the background-clocks end step.
- `titan-harm.yaml` (regeneration.tick) has no retreat exception.

**Problem.**
- The sources can be read two ways:
  - **Narrow:** the rule covers Background and retreat clocks, as its placement in `round.yaml` suggests.
  - **Wide:** it covers every clock, the Regeneration clock included, as "no clock" says.
- The packet copies the sources faithfully. Line 1826 sits inside end step 3 and reads narrow. Lines 2069 and 2370 read wide: "From then on, no clock fills".

**Scenario.** A retreat is under way against a standard Medium Titan with a Broken leg and its Regeneration clock at 2 of 3. Under the narrow reading, the clock fills at the end step and the leg heals to Wounded. The Titan stands, and a soldier holding Blind Spot at Open is moved to On Body. Under the wide reading, it stays grounded for the rest of the retreat.

**Fix.** A one-line decision naming the clocks the retreat stops. The packet's lines 1826, 2069, and 2370 then follow it.

## Structure pass

- **Order.** Cover, contents, What you need, Part One (Core, Soldier, Actions, Harm, Gear, Fight), quick reference, the GM band, the Titans, Hidden values, glossary, sheets, and feedback. This is the owner's order.
- **Labels.** Players are told which GM pages they may see: every Titan page is marked public, and only Hidden values is GM only. This matches Chapter 6.
- **Hidden information.** No Abnormal hidden value appears outside the Hidden values page.
- **Links and printing.** Every in-page link resolves. The quick reference prints on one page. The print breaks (before each chapter, the quick reference, the GM band, each Titan, the glossary, and the feedback page) are unchanged from round 2.

## Language and readability pass

- **Voice.** Players are addressed as "you" and the GM as the GM. Triggers are bolded and procedures numbered. Capitalised terms match `CONTEXT.md`; the one stray word is "sound" (Minor 3).
- **Round 3 text.** The new sentences read as rules, with no design-document asides.
- **Clean text.** No em dashes and no developer vocabulary.
- **Phone width.** At 500 px the body does not scroll sideways, and wide tables scroll inside their wrappers.
