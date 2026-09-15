# Wings of Freedom Phase 1 playtest packet: round 3 fix verification (Fable)

**Scope.** A narrow verification, not a full review. It judges the round 3 fixes in `docs/playtest/wings-of-freedom-playtest-packet.html` (2,894 lines) against their sources:

1. Each finding in `playtest-packet-review-3.md` (Opus: 1 Major, 3 Minor) and `playtest-packet-review-3-codex.md` (Codex: 1 Critical, 2 Major, 1 Minor), with the Codex Critical (the retreat order) read word by word against decision 5-13 and Chapter 5 section 5.10 *Order*.
2. Decision 6-1 (OQ-134): a retreat stops only the Background Titans' clocks and the retreat clock, and Regeneration still fills, in every packet sentence and in the six sources it names.
3. The tracker example in `data/engagement/round.yaml` against the packet's.
4. New errors in the touched lines, and whether the quick reference's re-layout dropped any rule text.

The rest of the packet was not re-reviewed, and the simulator was not run.

**Checks run.**
- **Touched lines.** I diffed the round 2 build (`scratchpad/phone-check.html`, 2,893 lines) against the current file: 40 changed line ranges, of which the round 3 fixes are lines 94 to 104 (print CSS), 1825, 1830, 1988, 2068, 2131, 2132, 2137, 2139, 2148, 2162, 2171, 2184, 2185, 2201 to 2217 (the moved Fall table), 2309, 2368, 2372, and 2379. The others are the round 3 changes the two round 3 reviews already checked.
- **Quick reference, text diff.** I stripped the tags from the drafter's pre-fix quick reference (`scratchpad/m-baseline-r3.html`) and from the current one and diffed the text. The only differences are the seven intended additions (turn, dodge, swap, end steps, Body Part strike, ladder note, Feint, Grab). Every other line, the Fall and Fear Roll tables included, is identical. Nothing was dropped in the move.
- **Print.** The quick reference alone, with the packet's own print CSS, printed in headless Chrome to **one page**. Google Fonts may not have loaded in that run, so the measurement is of the fallback stack; the drafter's scratch files show both were measured.
- **Sources read.** Decisions 5-10, 5-13, and 6-1; Chapter 5 sections 5.3 (*Order of play*, *End steps*), 5.7 *Regeneration*, and 5.10; `background-titans.yaml`; `round.yaml`; `titan-harm.yaml` (`regeneration.tick`); `attention.yaml` (flags, evaluation); `grab.yaml` (`first_turn_action`, `escapes`); `falls.yaml`; `fear-rolls.yaml`; `action-catalog.yaml` (`lift-comrade`); `CONTEXT.md` (Feint, Retreat clock).

## Verdict

| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 0 |
| Minor | 1 |

All eight round 3 findings are resolved in the packet, and no fix introduced an error in the lines it touched. The one Minor is a wording leftover of Codex Major 1 that sits in the glossary, which copies `CONTEXT.md` faithfully; the fix belongs in the source glossary.

## Round 3 findings

| Finding | Status | Evidence |
|---|---|---|
| Codex Critical 1. The turn summaries make every retreat move happen before the action | **Resolved** | 1830, 2131, 2203, and 2372 all carry both exceptions. See *The retreat order, word by word* below |
| Opus Major 1. The Grab's first-turn action spend is missing from both Grab summaries | **Resolved** | 2184: "The Grab spends the action of your 1st counted turn. End of that turn: lifted. End of your 2nd: devoured." 2185: "Break Free 2 or Pry Loose 2 at On Body (each 2-die penalty once lifted)". 2379: "The Grab spends the action of the first counted turn, whether or not a dodge or anything else already spent it." All match `grab.yaml` (`first_turn_action`; `break-free` and `pry-loose` both `needs: 2`, `lifted_penalty: 2`, Pry Loose at On Body) |
| Codex Major 1. The quick-reference Feint permits an unmounted horse | **Resolved** in the quick reference | 2171: "Feint (In Reach or On Body; working ODM Gear, mounted on your own horse that is not lame, or on foot against a grounded Titan)". Matches `attention.yaml` (feint) and the packet's own decoy table. The glossary entry at 2646 still reads "from a sound horse": Minor 1 |
| Codex Major 2. The print stylesheet disables the break before the first Titan | **Resolved** | The old line 96, `#titan-small{break-before:auto}`, is gone. Line 94 keeps `.titan{break-before:page}`, and no inline style overrides it |
| Opus Minor 1. The Dodge line omits the comparison with later behaviors | **Resolved** | 2132: "One dodge per Titan per round; its successes also count against every later behavior from that Titan this round" |
| Opus Minor 2. The ladder note skips the narrowing and the Down and carried limit | **Resolved** | 2162: "Down or carried soldiers meet only nearest. Ties: narrow by each lower rung, then current holder, then lowest card (not before the deal or at an end step), then nothing." Matches `attention.yaml` (`evaluation`: top, struck-first, narrow, holder, card, none; `down_can_meet` only on nearest for the standard ladder) |
| Opus Minor 3. Four conditions dropped from the quick reference | **Resolved** | Swap, 2137: "each holds a card, same Position or one step (or both have left), neither Down nor Grabbed, one swap each" (`round.yaml`, `swapping`). Feint, 2171, as above. Body Part strike, 2148: "Past Broken, each success is an Opening." End steps, 2139: "neither during a retreat" |
| Codex Minor 1. The `round.yaml` tracker example deals the Medium Titan two cards | **Resolved** | `round.yaml` line 160: "A Medium \| cards 4 \| ...". The packet's 2309 matches it field for field (see *The tracker example* below) |

Codex Critical 1's second fix option also asked for Chapter 5 section 5.3 and `round.yaml` `turn_order` to lose the shorthand "except under a retreat, where the forced move comes first". Decision 5-13 keeps that shorthand on purpose ("`round.yaml` `turn_order` still says 'except under a retreat'; the retreat's `order` row names both exceptions"), and both sources point at the order row. The packet is right to fix only its own summaries, and the sources are not in conflict with it.

## The retreat order, word by word

**Sources.** Decision 5-13: "the move comes before the action with two exceptions: a stay-with-a-comrade move (option 4) comes after the action taken for that comrade, and a move on a turn whose action is Lift Comrade comes after the lift, so a soldier who shares a Down comrade's Position lifts them and carries them out by option 1 or 2 in the same turn." Chapter 5 section 5.10 *Order* (lines 779 to 781) and `background-titans.yaml` `retreat.effects.order` say the same.

**The four packet lines.**
- **Player turn line, 1830:** "Under a retreat, the forced move comes first, with two exceptions: staying with a comrade comes after the action taken for them, and a move on a turn whose action is Lift Comrade comes after the lift (see Retreats)." Both exceptions, in the source's words. Correct.
- **Quick reference turn line, 2131:** "In a retreat the forced move comes first, except staying after acting for a comrade, and Lift Comrade before the move." Compressed, and each clause carries the right rule: the stay comes after the action for the comrade, and the lift comes before the move. Correct.
- **Quick reference retreat line, 2203:** "Forced moves: toward Distant, leave, toward a Down or Grabbed comrade, or stay after acting for them. Lift Comrade before the move. No Nape strikes." Correct. The "or a Background clock fills with two Focus Titans alive" trigger, added in round 3, is also present.
- **GM retreat bullet, 2372:** "Each soldier's forced move comes before their action, except that staying with a comrade comes after the action taken for them, and a move on a turn whose action is Lift Comrade comes after the lift (see Retreats)." Correct.

The detailed rule at 2081 (unchanged this round) and the four summaries now give one order. The Codex scenario, Hanne at Distant beside a Down comrade, now reads the same on every page: lift, then leave carrying them.

## Decision 6-1: the clocks a retreat stops

**Packet.** Every sentence about clocks during a retreat says the narrow rule. None says "no clock fills"; a search for "no clock" finds nothing.
- 1825 (end step 3): "During a retreat no Background Titan's clock fills and the retreat clock does not fill; step 2's Regeneration clocks still fill."
- 1988 (Regeneration): "fills 1 segment at the end of each round, retreat or not: a retreat stops only the Background Titans' clocks and the retreat clock."
- 2068 (Retreats): "no Background Titan's clock fills, the retreat clock does not fill, and no Titan enters. Each Focus Titan's Regeneration clock still fills."
- 2139 (quick reference): "Regeneration +1, retreat or not; Background clocks +1, then retreat clock +1, neither during a retreat".
- 2368 (GM Regeneration): "fills at the end step, retreat or not."
- 2372 (GM retreat): "no Background Titan's clock fills, the retreat clock does not fill, and no Titan enters; each Focus Titan's Regeneration clock still fills."

**Sources.** All six agree with 6-1.
- Chapter 5 end step 3 (line 296): "During a retreat no Background clock fills and the retreat clock does not fill; step 2's Regeneration clocks still fill (decision batch 6, OQ-134)."
- Chapter 5 section 5.7 (line 622): "retreat or not: a retreat stops only the Background clocks and the retreat clock".
- Chapter 5 section 5.10 (line 771): "No Background Titan's clock fills again, the retreat clock does not fill, and no Titan enters. Each Focus Titan's Regeneration clock still fills."
- `background-titans.yaml` `ticks.stopped` (lines 60 to 63) and `retreat.effects.no-entries` (88 to 92): both name the two clocks that stop and say the Regeneration clock still fills.
- `titan-harm.yaml` `regeneration.tick` (128 to 132): "A retreat does not stop it: only the Background Titans' clocks and the retreat clock stop filling".
- `round.yaml` `end_steps.background-clocks` (65 to 72): "During a retreat no Background Titan's clock fills and the retreat clock does not fill; the regeneration step still fills every living Focus Titan's Regeneration clock".

The glossary entries for Regeneration (2636) and Retreat clock (2655) make no claim about a retreat and copy `CONTEXT.md`; they need no change.

## The tracker example

`round.yaml` line 160: `A Medium | cards 4 | Att: Jonas | Next: [hidden] | Prev: Bite | Eyes I0 LA W1 RA I0 LL B0 RL I1 | Op 2 (Mila, Mila) | Regen 1/3 | Decoys 0 | Grab: - | Flags: hooked Mila`.

Packet line 2309 is identical through `Grab: -`, then reads `Marks: Mila struck its Nape`.

**Judgement: the rendering tells a table the same thing.** `hooked` is the `hooked-by-strike` flag, which `attention.yaml` (line 87) sets when "the soldier makes a Nape strike against the Titan, whatever its result". The packet names that mark "struck its Nape" everywhere it appears: the quick reference's rung 1 (2156, "struck its Nape (struck first)"), the GM's marks line (2363, "Marks (struck its Nape, hurt it, loud)"), and the tracker sheet (2826, "Marks standing on soldiers"). The row is also internally consistent: `Op 2 (Mila, Mila)` is a Nape strike that fell short by two successes, which is exactly what sets the mark. A GM reading the row knows Mila is first on rung 1 at the Titan's next card.

## Findings

### Minor 1. The packet's glossary Feint entry keeps "from a sound horse"

**Location.** Packet line 2646: "made with working ODM Gear, from a sound horse, or on foot against a grounded Titan". It copies `CONTEXT.md` line 301 word for word. The rule is `attention.yaml` (feint): mounted on the soldier's own horse that is not lame.

**Problem.** Codex Major 1 was fixed in the quick reference (2171), but the same loose phrase stands in the packet's glossary. "Sound" is not a packet term (the packet says "not lame"), and "from a sound horse" drops both ownership and the mounted state, the two conditions the fix restored. The packet is faithful to its source glossary, so this is a `CONTEXT.md` wording issue that the packet inherits, not a packet error; it is counted because a player who reads the glossary instead of the quick reference gets the Codex scenario back.

**Scenario.** Ilse stands In Reach on foot beside a comrade's sound horse. She looks up Feint in the glossary and reads "from a sound horse". The quick reference beside it says "mounted on your own horse that is not lame". The two pages disagree, and the GM has to open Chapter 5.

**Fix options.**
1. In `CONTEXT.md`'s Feint entry, and so in the packet's glossary, replace "from a sound horse" with "mounted on your own horse that is not lame".
2. If the glossary must stay short: "made with working ODM Gear, from your own horse while mounted, or on foot against a grounded Titan".

## Not counted

- **Compression in the two quick-reference retreat lines.** 2131 and 2203 omit that option 4 needs the soldier to share the comrade's Position, and that the comrade must not be carried. Both conditions are in the Forced moves box at 2071 to 2078, which the lines summarise, and neither omission is new this round.
- **"A soldier beside a Down comrade" at 2081.** Lift Comrade requires the comrade to hold the soldier's Position (`action-catalog.yaml`, `lift-comrade`); "beside" is loose but the box above says "share such a comrade's Position". The line was not touched this round.
- **The glossary's Background Titan entry (2654)** says the Titan "enters as a second Focus Titan when the clock fills"; it can also enter as the only one. It copies `CONTEXT.md`, and it was not touched this round.
