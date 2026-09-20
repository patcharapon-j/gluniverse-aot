# Round 3 rule change, review round 1: decider rulings on C2, C3, C4, C6, and M4

Decider: Fable, 2026-09-21. Read before deciding: `docs/playtest/HANDOFF.md` (Orchestration rules),
`docs/rules/DECISIONS-2026-09-14.md` batch 13, `docs/playtest/feedback/round-3/OWNER-DECISIONS.md`,
`docs/reviews/round-3-rule-change-review-1.md` in full, and the YAML, chapter, and ADR text each
finding cites. Every other finding in the review is the coordinator's and is not ruled on here.

**Constraints honoured.** Nothing in `OWNER-DECISIONS.md` is reopened: the Health formula, Frenzy's
shape (0, plus 1 a round, cap 3, added to the behavior roll), retargeting rather than downgrading, and
lethality restored through behavior all stand. Attack Dice, Nape Depth, and Tempo are not moved. No
ruling below presupposes a tuned number; each says what the pending rerun measures. `tools/sim/` was
not run and no `docs/reviews/simulator-*` file was read. The dice figures quoted are from my own
exact enumeration of the four tables in `data/titans/` (every D6 face, every previous behavior,
every count of Broken arms and legs, Frenzy 0 to 3), in
`/private/tmp/.../scratchpad/frenzy/frenzy_enum.py`. They reproduce the reviewer's C3 and C4 tables
exactly.

**Wording conventions.** Every replacement below is written to the packet conventions in
`HANDOFF.md`: no em dashes, game terms capitalised as in `CONTEXT.md`. The coordinator applies every
edit; nothing here was edited by me.

**Summary.**

| Finding | Ruling | Option | Changes what the rerun measures? |
|---|---|---|---|
| C2 | Keep the step order; the Frenzy step raises only a Titan that is a Focus Titan when it runs, as Regeneration fills only their clocks. Fix the three sentences that said otherwise | 1 | No new lever. The rerun must tick Frenzy before Background clocks, so an end-step entrant is at 0 through its first full round |
| C3 | The wrap from 6 to 1 stands at Frenzy 0. At Frenzy 1 or more the roll never wraps: an illegal result at 6 turns back down the table | Variant of 3 | Yes: every Frenzy 1 to 3 share where the result-6 entry is illegal. Frenzy 0 shares are unchanged |
| C4 | The one-half constraint binds at Frenzy 0 only; the Frenzy 1 to 3 shares are reported figures, and the rate and cap are the levers | 1 | No rule change. The by-Frenzy kill share 13-2 already schedules is the measurement |
| C6 | Amend ADR-0010 honestly: a failed striker draws the Titan's Attention on every ladder, and its next behavior when that behavior can reach Blind Spot. Rewrite the two live sentences | 1 | No rule change. One new reported figure: the failed striker's share of next behaviors and second-strike rate |
| M4 | Narrow the fiction, keep the mechanics: anchored to terrain behind the Titan, hanging from it or standing on it; airborne follows the move, and only Urban says otherwise | 2 | None |

---

## C2. A Background Titan that enters at the end step never passes the Frenzy step

**Ruling: option 1.** The step order stays as it is (Gas Rolls, Regeneration, Frenzy, Background
clocks, Momentum, round ends). The Frenzy step raises only a Titan that is a Focus Titan when the step
runs. A Titan that enters at the background-clocks step enters after the Frenzy step and is at 0
through its first full round; a Titan a flare brings in mid-round is a Focus Titan when the step runs
and leaves that round at 1. The three sentences that said an end-step entrant "rises to 1 here" and
"leaves the end step at Frenzy 1" are wrong and are replaced.

**Reasoning.** The Frenzy step was placed beside Regeneration deliberately (13-10: "so a Titan that
entered at the end of the previous round starts its first full round clean"), and Regeneration
already has exactly the property the reviewer calls a split by route: the regeneration step fills the
clock of every living Focus Titan at that moment, so a flare entrant's clock fills at its first end
step and an end-step entrant's does not. Frenzy reading the same way is one rule, not two. It also
keeps the shape 13-10 describes for every Titan alike: first full round at 0 ("postures in round
1"), trying to kill by its third. Option 2 would give an end-step entrant Frenzy 1 on its first full
round, one round ahead of the Titan already in the fight, which is not what "postures in round 1"
means, and it would separate Frenzy from Regeneration for no reason the record gives. Option 3 needs a
count of end steps seen per Titan, which is bookkeeping the tracker does not have. The prose was the
bug; the order was right.

**Simulator.** No lever. The rerun must run the end steps in the order `round.yaml` lists them, so a
Background Titan that enters at the background-clocks step rolls plain D6 through its first full round
and first rises at the end of it. The coordinator should confirm the simulator's end-step order
matches before the rerun, since I did not read `tools/sim/`.

**Apply.**

1. `data/engagement/round.yaml`, `end_steps`, `frenzy`. Replace the sentence
   "A Titan that became a Focus Titan this round is at 0 and rises to 1 here." with:
   > It raises only a Titan that is a Focus Titan when this step runs, as the regeneration step fills only their clocks: a Titan that entered mid-round when a flare filled its clock rises to 1 here, and a Titan that enters at the background-clocks step, which comes after this one, enters at 0 and stays at 0 through its first full round (data/engagement/background-titans.yaml, ticks; full_clock).
2. `docs/rules/05-titan-engagement.md`, section 5.3, End steps, step 3 (line 463). Replace
   "A Titan that became a Focus Titan this round is at 0 and rises to 1 here." with:
   > It raises only a Titan that is a Focus Titan when the step runs: one that entered mid-round on a flare rises to 1 here, and one that enters at step 4 enters at 0 and stays there through its first full round.
3. `docs/rules/05-titan-engagement.md`, the OQ-77 design note (line 468). Replace
   "Regeneration comes before Background clocks, so a Titan that enters at the end of a round starts its first full round clean, and Frenzy rises with it, so a Titan that entered this round leaves the end step at Frenzy 1 (decision batch 13, 13-10)." with:
   > Regeneration and Frenzy come before Background clocks, so a Titan that enters at the end of a round starts its first full round clean on both counts: its clock is empty and its Frenzy is 0, one round behind the Titan already in the fight (decision batch 13, 13-10, as read after round 3 review 1, C2). A Titan a flare brought in mid-round is a Focus Titan when both steps run, so it fills and rises with the others.
4. `data/engagement/titan-format.yaml`, `frenzy`, `rises`. Append:
   > A Titan that enters at the background-clocks end step enters after this step has run, so it stays at 0 through its first full round; a Titan a flare brings in mid-round rises at that round's end (data/engagement/round.yaml, end_steps, frenzy).
5. `data/engagement/background-titans.yaml`, `full_clock`, `fewer_than_two_focus_titans`. After
   "It starts as data/engagement/engagement-flow.yaml (starting, titan-values) states." insert:
   > Its Frenzy is 0. When the clock filled at the background-clocks end step, the frenzy step of that round has already run, so it stays at 0 through its first full round (data/engagement/round.yaml, end_steps, frenzy).
6. `docs/rules/DECISIONS-2026-09-14.md`, 13-10, the paragraph headed **The end step.** Replace it with:
   > **The end step.** A new `frenzy` step sits between the regeneration step and the background-clocks step, and it raises only a Titan that is a Focus Titan when it runs, as the regeneration step fills only their clocks. So a Titan that enters at the background-clocks step of one round starts its first full round clean on both counts, its clock empty and its Frenzy 0, and first rises at the end of that round; a Titan a flare brings in mid-round rises with the others at that round's end. Frenzy rises during a retreat, as Regeneration does. (Corrected after round 3 review 1, C2, in `docs/reviews/round-3-review-decisions.md`: as first written this paragraph said the entrant left the end step at Frenzy 1, which the step order it chose does not produce.)
7. No change to ADR-0001 ("rising by 1 at a round-end step" is true as written) or to `CONTEXT.md`.

---

## C3. The move-up wrap inverts Frenzy

**Ruling: a stated variant of option 3.** The move-up rule keeps its wrap from 6 to 1 at Frenzy 0 and
loses it at Frenzy 1 or more. At Frenzy 1 or more an illegal result moves up the table as before, and
if the entry at 6 cannot be rolled either, the search turns back down: the entry holding the next
result below the total, then the next below that, to 1. It never wraps to 1. Thrash stays the answer
when nothing can be rolled.

**Verified.** The current `move-up` step reads "take the entry that holds the next higher result
(after 6 comes 1), skipping entries already checked", and `roll` clamps the total at 6 before the
legality test. So every face Frenzy carries past 6 lands on result 6, and if that entry is illegal
every one of those faces wraps to result 1. My enumeration of the standard Medium reproduces the
reviewer's table exactly: after a Grab, Fixed Grin is 2 in 6 at Frenzy 0 and 4 in 6 at Frenzy 3, with
the kill share stuck at 1 in 6. The review understated it. The same inversion fires whenever result 6
is illegal for any reason, and Broken arms are the common one: a Medium with both arms Broken, whose
Grab is illegal on every roll, grins 3 in 6 at Frenzy 2 and 4 in 6 at Frenzy 3 whatever it did last,
and 5 in 6 after a Bite. Frenzy 3 with both arms Broken is the state a Squad reaches by fighting well
for three rounds, and under the current text it is the state in which the Titan is most inert.

**Why this shape and not option 1 or the reviewer's option 3 as worded.** Option 1 (wrap downward
always) changes every Frenzy 0 share: after a Bite the Medium's kill share falls to 1 in 6, after a
Fixed Grin it rises to 3 in 6, and the entry after a Broken part's entry stops being the one that is
"rolled more often", which is the sentence Chapter 6's authors were given. The reviewer's option 3
as worded ("when the roll's total exceeded 6") splits two faces that both read as 6: at Frenzy 1
after a Grab, a raw 5 (total 6, not exceeded) wraps to Fixed Grin and a raw 6 (total 7) turns down
to Bite. That cannot be said at the table. Keying the wrap to Frenzy 0 instead is one sentence, and it
has three properties the record needs. Every Frenzy 0 share is untouched, so Chapter 6's tables were
authored to a rule that still holds, its rendered shares table ("every table peaks at exactly one
half") stays true, and the chapter-06 probes, which run at Frenzy 0, need no change. At Frenzy 1 or
more it is identical to the clean unconditional rule (climb, then descend), so no roll ever lands on
the bottom of the table because it was frenzied. And it reads as the fiction it is: a frenzied Titan
denied the top of its table takes the most dangerous thing left to it, never the least.

Enumerated under the ruling, standard Medium, exact shares in sixths:

| State | Frenzy 0 | Frenzy 1 | Frenzy 2 | Frenzy 3 |
|---|---|---|---|---|
| previous Grab: kill / result 1 | 1 / 2 (unchanged) | 3 / 0 | 4 / 0 | 5 / 0 |
| previous Shake Off: kill | 3 (unchanged) | 4 | 5 | 6 |
| both arms Broken, worst result-1 share | 3 (unchanged) | 0 | 0 | 0 |

On every one of the four tables the highest share of any result-1 entry at Frenzy 1 to 3 is 0 in 6,
and every Frenzy 0 peak is exactly one half, nothing Broken, as Chapter 6 prints it.

**Simulator.** Yes. This changes every Frenzy 1 to 3 share in which the result-6 entry is illegal
(previous behavior, or a Broken arm for the three Grabs and two Broken legs for Headlong Lunge), so
the kill share by previous behavior and by Broken parts under the Frenzy roll, which 13-2 already
schedules, is what measures it. The rerun should also report the share of rolls resolving the
result-1 entry by Frenzy, so the inversion is seen not to return. `tools/sim/engine.py` line 219
implements the wrap as a modulo (`(r - 1 + i) % 6 + 1`) and must implement this ruling before the
rerun; that file is outside this change and is named for the package that owns it. The chapter-06
probes (`jam6.py`, `fight6.py`, `titans.py`, same expression) run at Frenzy 0 and are unaffected.

**Apply.**

1. `data/engagement/behavior-procedure.yaml`, `next_behavior`, `roll`, step `move-up`. Replace its text with:
   > If it cannot, take the entry that holds the next higher result, skipping entries already checked, and test it the same way. Repeat until an entry can be rolled. What happens at the top of the table depends on the Titan's Frenzy at the roll. At Frenzy 0, after 6 comes 1, as it always has. At Frenzy 1 or more the roll never wraps: if the entry at 6 cannot be rolled, turn back down and take the entry that holds the next result below the total, then the next below that, to 1 (decision batch 13, as amended after round 3 review 1, C3). A frenzied Titan denied the top of its table takes the most dangerous thing left to it, never the bottom.
2. `data/engagement/behavior-procedure.yaml`, `next_behavior`, `move_up_shares`. Replace the first sentence
   "For Chapter 6's authors: an entry that cannot be rolled passes its share of results to the entry above it." with:
   > For Chapter 6's authors: at Frenzy 0 an entry that cannot be rolled passes its share of results to the entry above it, and the entry at 6 passes its share to the entry at 1. At Frenzy 1 or more the entry at 6 passes its share to the entry at 5 instead, and so on down, so the faces Frenzy piles onto result 6 never land on the table's weakest entry.
   (The last sentence of the same block changes under C4 below.)
3. `data/engagement/titan-format.yaml`, `behavior_table`, `result_above_the_table`. Append:
   > If that entry cannot be rolled, a frenzied Titan's roll turns back down the table and never wraps to 1 (data/engagement/behavior-procedure.yaml, next_behavior, move-up).
4. `docs/rules/05-titan-engagement.md`, section 5.5, To roll it, step 3 (line 607). Replace
   "3. If it cannot, take the entry holding the next higher result, wrapping from 6 to 1, and test again." with:
   > 3. If it cannot, take the entry holding the next higher result and test again. At Frenzy 0, after 6 comes 1. At Frenzy 1 or more the roll never wraps: from 6 it turns back down, to the next result below the total, and so on to 1.
5. `docs/rules/05-titan-engagement.md`, section 5.5, the paragraph beginning "Rolling never checks Positions" (line 614). After "with both arms Broken, Bite takes Grab's result (`move_up_shares`)." append:
   > A frenzied Titan's roll turns back down from 6 instead of wrapping to 1, so Frenzy never sends a Titan to the bottom of its table.
6. `docs/rules/05-titan-engagement.md`, the OQ-80 design note (line 648). After
   "Illegal results move up the table instead of being re-rolled, so the hidden die is rolled once and never again." insert:
   > The wrap from 6 to 1 stands at Frenzy 0, where it costs one face and every table in Chapter 6 was built on it. At Frenzy 1 or more the roll turns back down from 6 instead, because Frenzy piles up to four faces onto result 6 and a wrap would land every one of them on the table's weakest entry: a Medium at Frenzy 3 that had just Grabbed, or that had both arms Broken, would have grinned 4 faces in 6 (round 3 review 1, C3).
7. `docs/adr/0001-*.md`, the batch 13 amendment. Append a paragraph:
   > Amended after round 3 review 1 (2026-09-21, C3): the move-up rule's wrap from 6 to 1 stands at Frenzy 0 and does not apply at Frenzy 1 or more, where an illegal result at 6 turns back down the table. Without that, every face Frenzy carried past 6 wrapped to result 1 whenever the entry at 6 was the previous behavior or needed a Broken arm, so a Titan at Frenzy 3 grinned more often than one at Frenzy 0, which inverts the escalation this amendment exists to produce. Every Frenzy 0 share is unchanged, so Chapter 6's tables and the constraint they were authored to stand.
8. `CONTEXT.md`, **Frenzy**. Append to the entry:
   > An illegal result at the top of a frenzied Titan's table turns back down the table, never round to 1.
9. `docs/rules/DECISIONS-2026-09-14.md`, 13-10, under **Measurement.** Append:
   > The move-up rule's wrap is keyed to Frenzy 0 after round 3 review 1 (C3; `docs/reviews/round-3-review-decisions.md`).
10. Outside this change's files, for the rerun's owner: `tools/sim/engine.py` line 219 (the modulo wrap) implements this ruling before the rerun. `tools/probes/chapter-06/*.py` run at Frenzy 0 and need no change.

---

## C4. Frenzy breaks a live tuning constraint, and `move_up_shares` still asserts it holds

**Ruling: option 1.** The constraint "no kill share by previous behavior exceeds one half at any
state" binds at Frenzy 0 and is amended to say so. At Frenzy 1 to 3 the kill share climbs past one
half by design, and those shares are figures the rerun reports, by table, previous behavior, Broken
parts, and Frenzy, not constraints a table's author checks. The rate and the cap remain the levers if
the rerun reads the escalation too high, exactly as 13-10 records.

**Reasoning.** Under C3's ruling, my enumeration gives every standard table the same escalation with
nothing Broken: highest kill share by previous behavior 3, 4, 5, and 6 in 6 at Frenzy 0 to 3, and
6 in 6 already at Frenzy 2 on the Small and Medium with both arms Broken. That is the escalation the
owner chose ("trying to kill by round 3"), so a constraint that forbids it is a constraint on the
wrong thing. Option 2 (clamp at 5 or cap at 2) presupposes a number the simulator has not measured,
and 13-10 says the rate and cap are starting values the simulator moves, so the rerun is where that
choice belongs. Option 3 (a second constraint over the whole range) would either be vacuous or fail
every table as written, which would mean re-authoring tables, and 13-10 promises none is. The
constraint is a promise to a table's author: at Frenzy 0 it is one they can check by hand, and it is
still true of every table in `data/titans/`.

**Simulator.** No rule change. The measurement is the by-Frenzy kill share 13-2 already schedules,
now read as a figure and not as a pass or fail. If the rerun's bands (ADR-0014, deaths per fight in
particular) read too high, the levers are Frenzy's rate and cap, in that order, and the record for
choosing between them is 13-10's Measurement paragraph.

**Apply.**

1. `data/titans/tuning.yaml`, `targets`, `every_standard_table`, second bullet. Replace it with:
   > No kill share by previous behavior exceeds one half at any state at Frenzy 0. Chapter 6 reads "any state" as every previous behavior with every count of Broken eyes, arms, and legs, not only an unbroken Titan (decision batch 4, OQ-101). At Frenzy 1 to 3 the kill share rises past one half by design, since that is the escalation decision batch 13 (13-10) intends: those shares are figures the rerun reports by table, previous behavior, Broken parts, and Frenzy, not constraints an author checks, and Frenzy's rate and cap are the levers if they read too high (round 3 review 1, C4).
2. `data/engagement/behavior-procedure.yaml`, `next_behavior`, `move_up_shares`. Replace the last sentence
   "Under that reading the reference Titan's table reaches a kill share of 4 in 6 (previous behavior Shake Off, both arms Broken), and every table in data/titans/ stays at or under one half (data/titans/tuning.yaml, targets, every_standard_table; OQ-101)." with:
   > Under that reading, at Frenzy 0, the reference Titan's table reaches a kill share of 4 in 6 (previous behavior Shake Off, both arms Broken), and every table in data/titans/ stays at or under one half (data/titans/tuning.yaml, targets, every_standard_table; OQ-101). The constraint is checked at Frenzy 0 only. At Frenzy 1 to 3 every table's kill share by previous behavior climbs past one half and reaches 6 in 6 at Frenzy 3 after its result-4 entry, which is what Frenzy is for; the rerun reports those shares, and no author checks them (round 3 review 1, C4).
3. `docs/rules/06-standard-titans.md`, the design note beginning "Read strictly, the Chapter 6 constraint says" (line 102). Replace
   "no state of previous behavior and Broken parts may push the kill share past one half." with:
   > no state of previous behavior and Broken parts may push the kill share past one half at Frenzy 0; Frenzy 1 to 3 climb past it by design (Chapter 5, section 5.4).
4. `docs/rules/06-standard-titans.md`, after the sentence "Every table peaks at exactly one half." (line 388). Append:
   > That is at Frenzy 0, where the constraint binds. Frenzy adds to the roll and lifts every peak past one half by design, to every result in six at Frenzy 3 after the entry at result 4 (Chapter 5, section 5.4).
5. Outside this change's files: the rendered header "Highest kill share, any state" in the Chapter 6 shares table comes from `tools/probes/chapter-06/render.py` and should read "Highest kill share, any state, Frenzy 0" when that package is next touched. It is not wrong today, since the probe runs at Frenzy 0, and the chapter sentence in item 4 says so.
6. No change to the stale-figures headers in either `tuning.yaml`; they are right as they stand.

---

## C6. Retargeting breaks ADR-0010's promise that a failed Nape striker draws the Titan's next behavior

**Ruling: option 1.** ADR-0010 is amended honestly. The batch 4b promise is narrowed, not withdrawn:
a Nape striker who falls short draws the Titan's **Attention** on every ladder, and draws its next
behavior **when that behavior's Position requirement includes Blind Spot**. When it does not, the Titan
retargets down the ladder to a comrade it can reach, its Attention goes with it, and the striker, no
longer holding Attention, may strike again. The two live sentences that still make the old promise
(Chapter 5 line 822, `attention.yaml` `struck-first`) are rewritten, and the ladder step's prose and
the Nape strike entry are brought into line.

**Reasoning.** Option 2, exempting a soldier who holds the hooked-by-strike flag from every retarget,
is the settled decision's exact counter-case: 13-9 was made because "with Attention on a soldier at
Distant or Blind Spot a Medium Titan could not Bite or Grab at all", and a striker at Blind Spot is
that soldier. Exempting them re-parks the fight on every failed strike, which is most strikes, and
`OWNER-DECISIONS.md` records no such exception. Option 3 contradicts `attention_moves` and adds a
return-of-Attention step no tracker carries. Option 1 changes no mechanics: it makes the record say
what the rules now do. The price of a failed strike has not vanished, it has moved: it falls on the
comrade the Titan can reach, which ADR-0010 names as the tension the whole design exists to produce.
On the standard Medium, whose result 1 and result 4 entries alone reach Blind Spot, the striker takes
the behavior 2 rolls in 6 at Frenzy 0 and 1 in 6 at Frenzy 1 to 3 under C3's ruling, and Shake Off
(result 4) is the one that knocks them loose, so the price that remains is the right one. What must
not be lost is the lone-strike band: a striker freed to cut twice may move it, and that is a thing to
measure, not to guess. The exemption of option 2 is kept in the file as the held alternative, beside
downgrading, if that band breaks upward.

**Simulator.** No rule change. One new reported figure: of Nape strikes that fall short, the share
whose striker is the target of the Titan's next resolved behavior, and the striker's second-strike
rate (a second Nape strike before the Titan's Attention returns to them), by table and by Anchor
Rating. The lone-strike band in ADR-0014 is the band it is read against.

**Apply.**

1. `docs/adr/0010-*.md`. Append a new amendment paragraph after the batch 13 one:
   > After round 3 review 1 (2026-09-21, C6; `docs/reviews/round-3-review-decisions.md`): the batch 13 paragraph's closing sentence overstated what was unchanged. Retargeting narrows the batch 4b promise that a Nape striker who falls short draws the Titan's next behavior on every ladder. The striker still draws the Titan's **Attention** on every ladder, since every ladder's first rung is hooked-into-its-body and the struck-first step keeps them, and they draw its next behavior **when that behavior's Position requirement includes Blind Spot**. When it does not, the Titan retargets down the ladder to a comrade it can reach, its Attention moves to that comrade, and the striker, no longer holding Attention, may strike again on their next turn. On the standard Medium, whose result 1 and result 4 entries alone reach Blind Spot, the striker takes the behavior 2 rolls in 6 at Frenzy 0 and 1 in 6 at Frenzy 1 to 3. The price of a failed strike is therefore paid by whoever is in the Titan's hands' reach, which is the cover-your-comrade tension this record exists to produce, and the rerun reports the share of failed strikes whose striker takes the next resolved behavior and the striker's second-strike rate against the lone-strike band (ADR-0014). If that band breaks upward, the held alternative is that a retarget never moves Attention off a soldier holding the hooked-by-strike flag and the entry falls back instead; it is held beside downgrading (decision batch 13, 13-9) and is not taken now.
2. `docs/rules/05-titan-engagement.md`, section 5.7, Nape strikes (line 822). Replace
   "Every Nape strike, whatever its result, sets the hooked-by-strike flag, so a striker who falls short draws the Titan's next behavior, whatever cards come between, on every ladder, since every ladder's first rung is hooked into its body (section 5.6; decision batch 3e; decision batch 4b, 4b-1)." with:
   > Every Nape strike, whatever its result, sets the hooked-by-strike flag, so a striker who falls short draws the Titan's Attention, whatever cards come between, on every ladder, since every ladder's first rung is hooked into its body (section 5.6; decision batch 3e; decision batch 4b, 4b-1). They take its next behavior when that behavior can reach Blind Spot. When it cannot, the Titan retargets to a comrade it can reach and its Attention goes with it (*Retargeting*, section 5.6; decision batch 13, 13-9), so the price of a failed strike falls on whoever is within its hands' reach.
3. `docs/rules/05-titan-engagement.md`, same section, two lines below (line 824). Replace
   "Getting it off them takes a comrade's Draw Attention, or a Break Attention with a decoy." with:
   > Getting it off them takes a comrade's Draw Attention, a Break Attention with a decoy, or the Titan retargeting to someone it can reach.
4. `docs/rules/05-titan-engagement.md`, section 5.6, the evaluation's step 3 (line 689). Replace
   "A Nape striker who falls short draws the Titan before a soldier who is only On Body." with:
   > A Nape striker who falls short draws the Titan's Attention before a soldier who is only On Body; whether they take its behavior depends on whether the rolled entry reaches Blind Spot (*Retargeting*, below).
5. `data/engagement/attention.yaml`, `evaluation`, `steps`, `struck-first`. Replace
   "so a striker who falls short draws the Titan's next behavior (ADR-0010; flag_duration)." with:
   > so a striker who falls short draws the Titan's Attention, and its next behavior when that behavior's position_requirement includes blind-spot; when it does not, the card's choose step retargets (retargeting; ADR-0010, as amended after round 3 review 1, C6; flag_duration).
6. `data/character/action-catalog.yaml`, `nape-strike`, `notes`. Replace
   "cannot strike again until the Attention moves (decision batch 13, 13-7; OQ-191)." with:
   > cannot strike again until the Attention moves: by a comrade's Draw Attention, by a decoy, or by the Titan retargeting to someone it can reach (data/engagement/attention.yaml, evaluation, retargeting; decision batch 13, 13-7 and 13-9; OQ-191, OQ-192).
7. `docs/rules/05-titan-engagement.md`, the design note "Flags last until the Titan acts" (line 772). After
   "lands on that striker 98.9% to 99.8% of the time" insert:
   > (measured before decision batch 13's retargeting, which turns that behavior onto a comrade when it cannot reach Blind Spot; the rerun re-reads it)
8. `data/engagement/tuning.yaml`, `simulator_cases`. Add a case in the block's existing shape:
   > Failed Nape strikes: of strikes that fall short, the share whose striker is the target of the Titan's next resolved behavior, and the striker's second-strike rate, a second Nape strike before the Titan's Attention returns to them, by table and by Anchor Rating, read against the lone-strike band (ADR-0014; round 3 review 1, C6).
9. `docs/rules/DECISIONS-2026-09-14.md`, 13-9. Append to the **ADR.** line:
   > ADR-0010's batch 4b promise is narrowed by this, recorded after round 3 review 1 (C6; `docs/reviews/round-3-review-decisions.md`): a failed striker draws the Titan's Attention on every ladder, and its next behavior when that behavior can reach Blind Spot.
10. No change to the ladders, the `hooked-by-strike` flag, `flag_duration`, the Nape strike's Attention restriction, or any table.

---

## M4. Blind Spot "standing on a tree" against `airborne` and `jam`

**Ruling: option 2.** The mechanics stay. The fiction is narrowed to what 13-6 actually decided: a
soldier at Blind Spot is anchored to terrain behind the Titan and is not on it. Whether they are
hanging from that anchor or standing on it, and so whether they are airborne, is not a property of
the Position: it follows the move that brought them there, as it does everywhere else in the game,
and the Urban Terrain Trait alone says the roof holds them. "The soldier stands on a tree" was
drafting's elaboration, and it is the sentence that reads wrongly against `airborne`, `jam`, and the
Falling Titan; the three files that depend on the airborne reading are right and are not touched.

**Reasoning.** Option 1 (never airborne at Blind Spot, at any rating) changes two measured things
the owner did not ask to change: a Jam would stop dropping a Nape striker at Sparse, Wooded, and Giant
Forest (the Jam test's worst-cell constraint in `data/titans/tuning.yaml` is read on exactly that
fall), and a falling Titan's body would catch every Blind Spot soldier instead of missing the
airborne ones. It would also strip Urban of its Terrain Trait and need a new one authored. Option 3
leaves the contradiction and signposts it. Option 2 costs nothing, keeps 13-6's real point ("not on
the monster", so steam at a fill misses them and Open ground has no Blind Spot), and matches the
fiction the source material actually shows: a soldier behind the nape in a forest is on lines hooked
into a trunk, in the air, and a Jam there is the canonical death. It also stays compatible with the
batch E zone design, which lists "anchored" and "airborne" as separate conditions and defines Blind
Spot as "anchored to terrain in this Titan's zone, behind it".

**Simulator.** None. No rule the simulator models changes.

**Apply.**

1. `data/engagement/positions.yaml`, `positions`, `blind-spot`, `meaning`. Replace
   "The soldier stands on a tree, a roof, or whatever else the Anchor Rating gives, and is not touching the Titan." with:
   > The soldier is anchored to a tree, a roof, or whatever else the Anchor Rating gives, hanging from it on their lines or standing on it, and is not touching the Titan. Whether they are airborne follows the move that brought them there, not the Position: an ODM move leaves them airborne, as anywhere (data/gear/odm-gear.yaml, airborne), so a Jam drops them (data/gear/odm-gear.yaml, jam) and a falling Titan's body misses them (data/engagement/titan-harm.yaml, falling_titan, path, airborne); the Urban Terrain Trait alone says the roof holds them and they are not airborne (data/engagement/anchor-ratings.yaml, ratings, urban, terrain_trait).
2. `data/engagement/positions.yaml`, `positions`, `blind-spot`, `not_on_the_titan`. Replace
   "the Urban Terrain Trait says a Blind Spot soldier is anchored to a roof and is not airborne, because they are standing on one" with:
   > the Urban Terrain Trait says a Blind Spot soldier is anchored to a roof and is not airborne, because there they are standing on one, where at every other rating they hang from their anchor and stay airborne (decision batch 13, 13-6, as read after round 3 review 1, M4)
3. `docs/rules/05-titan-engagement.md`, section 5.2, Positions, the Blind Spot bullet (line 191). Replace
   "The soldier is on a tree or a roof, not touching the Titan: it is a place in the world, not a place on the monster." with:
   > The soldier is anchored to a tree or a roof, hanging from it on their lines or standing on it, and not touching the Titan: it is a place in the world, not a place on the monster. Whether they are airborne follows the move that brought them there, as anywhere: an ODM move leaves them airborne, so a Jam drops them (Chapter 4, section 4.3) and a falling Titan's body misses them (section 5.7); only the Urban Terrain Trait says the roof holds them.
4. `docs/rules/05-titan-engagement.md`, section 5.2, the paragraph beginning "That last clause is worth reading twice" (line 193). Replace
   "The Urban Terrain Trait says a Blind Spot soldier is anchored to a roof and is not airborne, because they are standing on one." with:
   > The Urban Terrain Trait says a Blind Spot soldier is anchored to a roof and is not airborne, because there they are standing on one; at every other rating they hang from their anchor and stay airborne.
5. `CONTEXT.md`, **Blind Spot**. Replace
   "the soldier stands on a tree or a roof and is not touching the Titan" with:
   > the soldier is anchored to a tree or a roof, hanging from it or standing on it, and is not touching the Titan; whether they are airborne follows the move that brought them there
   The `_Avoid_` line stands.
6. `docs/rules/DECISIONS-2026-09-14.md`, 13-6, **Decision.** Replace
   "on a tree or a roof, not touching the Titan" with "anchored to a tree or a roof, hanging from it or standing on it, not touching the Titan", and append to the paragraph:
   > Whether the soldier is airborne is not a property of the Position: it follows the move that brought them there, and only the Urban Terrain Trait says otherwise, so the Jam and the Falling Titan read exactly as they did (round 3 review 1, M4; `docs/reviews/round-3-review-decisions.md`).
7. No change to `data/gear/odm-gear.yaml` (`airborne`, `jam`), `data/engagement/anchor-ratings.yaml` (`urban`, `terrain_trait`), or `data/engagement/titan-harm.yaml` (`falling_titan`). The packet and the site sheet follow the YAML under `HANDOFF.md`'s conventions and pick the wording up from item 1.

---

## For the rerun, in one place

- **Implement before running:** C3's move-up rule (wrap at Frenzy 0 only; turn back down at Frenzy 1 or more), at `tools/sim/engine.py` line 219. Confirm the end-step order ticks Frenzy before Background clocks (C2).
- **Report, beyond what 13-2 schedules:** the share of rolls resolving the result-1 entry by Frenzy (C3); the by-Frenzy kill share by previous behavior and Broken parts read as figures, not pass or fail (C4); of failed Nape strikes, the share whose striker takes the next resolved behavior and the striker's second-strike rate, against the lone-strike band (C6).
- **Levers, in order, if the bands read badly:** Frenzy's rate, then its cap (C4, per 13-10); the hooked-by-strike exemption from retargeting (C6), held beside downgrading (13-9). Attack Dice, Nape Depth, and Tempo stay in reserve behind the report.
