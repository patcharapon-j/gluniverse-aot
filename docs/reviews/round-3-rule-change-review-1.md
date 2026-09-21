# Round 3 rule change, review round 1

Reviewer: independent senior TTRPG designer. Date: 2026-09-21.

**Scope.** Decision batch 13 (OQ-190 to OQ-194) as it stands in the tree: `git diff 68aa864..HEAD --
docs/rules data`, plus `CONTEXT.md`, the ADRs, and the chapters the change touches. Health, the
closed Position list and the Blind Spot clause, retargeting, and Frenzy.

**Out of scope, as instructed.** `docs/playtest/feedback/round-3/OWNER-DECISIONS.md` is settled and no
decision recorded there is reopened here. Every finding below is a decision applied wrongly,
incompletely, or inconsistently, or a mechanical consequence nobody wrote down. `tools/sim/` was not
run and no `docs/reviews/simulator-*` file was read; the dice numbers quoted are my own, from a
deterministic enumeration of the standard Medium Titan's table
(`/private/tmp/.../scratchpad/sim/frenzy.py`, all 6 D6 faces at each Frenzy and each previous
behavior, so the shares are exact, not sampled).

**Counts.** 6 Critical, 6 Major, 7 Minor.

---

## Critical

### C1. The glossary still gives the old Health formula

**Location.** `CONTEXT.md` line 227 (**Health**). Against `data/character/attributes.yaml`
(`derived_values`, `health`), `docs/rules/02-character-creation.md` line 102,
`docs/rules/03-harm-and-mind.md` line 49, and ADR-0005 as amended in batch 13.

**Problem.** The glossary entry reads "half of Strength plus Agility, rounded up". That is the
formula batch 13-1 replaced. `CONTEXT.md` *was* edited in this change (Blind Spot reworded, Frenzy
added), so the omission is not a missed file but a missed line. Batch 13's summary table records
"Glossary change: none" for 13-1, which is the drafting error: the glossary does not merely name
Health, it states the formula, and `CONTEXT.md` is listed as a source of truth above the chapters.

**Play scenario.** A second GM joins the campaign and builds an NPC Squadmate from the glossary,
which is the file the project tells newcomers to read first. Strength 3, Agility 3 gives Health 3.
The first GM's sheet for the same build says 5. The Titan's fourth Critical Injury puts one of them
Down and not the other, and the table has no way to tell which book is wrong.

**Fix options.**
1. Rewrite the entry to "2 plus half of Strength plus Agility, rounded up, where the rounding applies
   to the halved attributes and the 2 is added after: 4 to 6 for a built soldier and 4 to 8 for a
   rolled one", and record the glossary change against 13-1.
2. Delete the formula from the glossary entirely and point to `data/character/attributes.yaml`
   (`derived_values`), so the number lives in exactly one place and cannot go stale again. This is
   the same reasoning 13-4 used to rename `reported_squad_health_2`.

---

### C2. A Background Titan that enters at the end step never passes the Frenzy step

**Location.** `data/engagement/round.yaml` lines 63 to 72 (`end_steps`, `frenzy`);
`docs/rules/05-titan-engagement.md` line 463 (step 3) and line 468 (the OQ-77 design note);
`DECISIONS-2026-09-14.md` 13-10, *The end step*. Against
`data/engagement/background-titans.yaml` (`ticks`, `end-of-round`; `full_clock`).

**Problem.** The end steps run Gas Rolls, Regeneration, **Frenzy**, Background clocks, Momentum,
round ends. A Background Titan whose clock fills becomes a Focus Titan **at the background-clocks
step**, which is *after* the Frenzy step. So it is not a Focus Titan when Frenzy is raised, and it
sits at Frenzy 0 through the whole of its first full round.

Three statements say otherwise and cannot all be true:

- `round.yaml`, `frenzy`: "A Titan that became a Focus Titan this round is at 0 and rises to 1 here."
- Chapter 5, line 463: the same sentence.
- Chapter 5, line 468: "Regeneration comes before Background clocks, so a Titan that enters at the
  end of a round starts its first full round clean, **and Frenzy rises with it, so a Titan that
  entered this round leaves the end step at Frenzy 1**."

That last sentence contradicts itself. "Starts its first full round clean" is what the ordering
actually produces (Regeneration is placed before Background clocks precisely so an entering Titan's
clock does not tick); "leaves the end step at Frenzy 1" is what it would produce if Frenzy came after
Background clocks. Both are asserted in one sentence.

It also splits by route of entry, which nothing states: a Titan that enters **mid-round** because a
flare filled its clock (`background-titans.yaml`, `ticks`, `flare`) *is* a Focus Titan when the Frenzy
step comes, so it does leave that round at Frenzy 1. Two Titans entering the same round by different
routes end it at different Frenzy.

**Play scenario.** Round 4 ends. The retreat clock is at 5 of 8 and Background Titan 1's clock fills
at the background-clocks step, so a second Medium enters. Round 5, the new Titan's first card comes
up. Its GM rolls the Next Behavior. Reading `round.yaml` literally, the GM already ticked it to 1 at
the end of round 4 and rolls D6+1. Reading the step order, it is still 0 and rolls a plain D6. On a
raw 5 that is the difference between Grab and Bite against the same soldier, and nothing in the tree
resolves it. If a flare had brought the same Titan in two minutes earlier in the same round, the
answer would genuinely be 1.

**Fix options.**
1. Keep the step where it is and fix the prose: `round.yaml` and Chapter 5 line 463 read "a Titan
   that became a Focus Titan before this step is at 0 and rises to 1 here; a Titan that enters at the
   background-clocks step enters after it and is at 0 through its first full round". Rewrite line
   468's clause to "and Frenzy does not rise for it either, so it begins its first full round at
   Frenzy 0, one round behind the Titan already in the fight".
2. Move the Frenzy step to sit after `background-clocks`, so that "every Titan that became a Focus
   Titan this round rises to 1" is true by route as well as by wording. Note this also makes the
   flare-entrant and the end-step entrant agree, at the cost of giving an entering Titan Frenzy 1 on
   its first full round while its Regeneration clock is still empty.
3. State explicitly that Frenzy starts at 0 and first rises at the **second** end step the Titan
   sees, whichever route it entered by, and delete the "rises to 1 here" sentence.

---

### C3. The move-up wrap inverts Frenzy: a maximally frenzied Titan that just Grabbed postures 4 times in 6

**Location.** `data/engagement/behavior-procedure.yaml` lines 38 to 53 (`next_behavior`, `roll`:
`roll`, `legal`, `move-up`); `data/engagement/titan-format.yaml` lines 71 to 74
(`result_above_the_table`) and lines 61 to 68 (`frenzy`, `why`);
`docs/rules/05-titan-engagement.md` lines 298 to 304 and 607 to 613. Against ADR-0001, as amended in
batch 13 ("this walks a Titan up its own table as a fight drags").

**Problem.** Three rules compose badly. The clamp pushes probability mass onto result 6; the
no-back-to-back rule makes result 6 illegal whenever the Titan's last behavior *was* the result-6
entry; and `move-up` sends an illegal result to "the next higher result (after 6 comes 1)". All the
mass the clamp concentrated on 6 therefore lands on **result 1**, the table's weakest terrorize
entry. Frenzy makes this worse monotonically, because it is what put the mass on 6 in the first
place.

Exact shares, standard Medium Titan, all 6 faces enumerated:

| Frenzy | prev = none | prev = Grab (result 6) | prev = Shake Off (result 4) |
|---|---|---|---|
| 0 | terrorize 2/6, control 2/6, kill 2/6 | **result 1: 2/6**; terrorize 3/6, kill 1/6 | kill 3/6 |
| 1 | terrorize 1/6, kill 3/6 | **result 1: 2/6**; terrorize 3/6, kill 1/6 | kill 4/6 |
| 2 | control 2/6, kill 4/6 | **result 1: 3/6**; terrorize 3/6, kill 1/6 | kill 5/6 |
| 3 | control 1/6, kill 5/6 | **result 1: 4/6**; terrorize 4/6, kill 1/6 | kill 6/6 |

At Frenzy 3 after a Grab the Titan is *more* likely to Gape than a Frenzy 0 Titan in the same state
(4/6 against 2/6), and its kill share (1/6) is the lowest of any state on the table. The wrap
pre-dates Frenzy, but at Frenzy 0 it moved 1 face; at Frenzy 3 it moves 4.

**Play scenario.** Round 4. The Medium is at Frenzy 3. Its card comes up and it Grabs Ilse. Ilse's
comrades cut her free on the next card. The Titan's next behavior is rolled: result 6 is Grab, its
previous behavior, so it is illegal; `move-up` wraps to result 1, Fixed Grin, a 3-dice telegraph that
raises 1 Stress. On four of six faces, that is what happens. The Squad has just watched the monster
reach maximum rage and then stand there grinning, in the exact round the design note promises it is
"trying to kill".

**Fix options.**
1. Make `move-up` wrap **downward** at the top of the table instead of round to 1: "if it cannot,
   take the entry that holds the next **lower** result, and after 1 comes 6". At Frenzy 3 after a
   Grab this gives Bite (result 5) instead of Fixed Grin, which is what "walks up its own table"
   means. Note this changes `move_up_shares` for every Titan and needs the batch 13-2 retune to read
   it.
2. Keep the wrap for the pre-Frenzy part of the roll and apply the clamp *after* the legality test:
   roll D6, add Frenzy, and if the resulting entry is illegal, step down to the highest legal result
   at or below the total before wrapping at all.
3. Exempt the clamped case: when the roll's total exceeded 6 and the result-6 entry is illegal, take
   the highest-numbered legal entry rather than wrapping. Narrowest change, and it leaves every
   unclamped roll exactly as it is today.

---

### C4. Frenzy breaks a live tuning constraint, and `move_up_shares` still asserts the constraint holds

**Location.** `data/titans/tuning.yaml` lines 219 to 226 (`targets`, `every_standard_table`, second
bullet); `data/engagement/behavior-procedure.yaml` lines 57 to 66 (`move_up_shares`).

**Problem.** `every_standard_table` is a list of **constraints on the tables**, not a list of measured
figures, and its second entry reads: "No kill share by previous behavior exceeds one half at any
state. Chapter 6 reads 'any state' as every previous behavior with every count of Broken eyes, arms,
and legs." `behavior-procedure.yaml` repeats the verdict for Chapter 6's authors: "the reference
Titan's table reaches a kill share of 4 in 6 ... and **every table in `data/titans/` stays at or under
one half**."

Frenzy violates this by design and neither line was amended. Standard Medium, exact:

| Frenzy | highest kill share by previous behavior | state |
|---|---|---|
| 0 | 3/6 = 50.0% | prev Shake Off |
| 1 | 4/6 = 66.7% | prev Shake Off |
| 2 | 5/6 = 83.3% | prev Shake Off |
| 3 | 6/6 = 100% | prev Shake Off |

At Frenzy 3 with the previous behavior Shake Off, **every** face of the die gives a kill-tier entry.
The new stale-figures header in `data/titans/tuning.yaml` covers "every figure and verdict", which
does not reach a constraint that tells a future author what a legal table looks like, and it does not
reach `behavior-procedure.yaml`'s sentence at all, which is in a different file with no header.

**Play scenario.** A GM writes an Abnormal for their campaign and checks it against
`every_standard_table`: at most one grab result, at most one lethal Critical Injury, a holder at In
Reach meeting four results in six, and no kill share over one half. Their table passes at Frenzy 0
and is illegal at Frenzy 1 without a line changing. The constraint cannot be checked as written,
because "at any state" no longer names a finite set of states the author controls.

**Fix options.**
1. Amend the constraint to name Frenzy: "No kill share by previous behavior exceeds one half **at
   Frenzy 0** at any state; the rise above that at Frenzy 1 to 3 is the escalation batch 13-10
   intends, and the retune reads it." Update `move_up_shares` in the same words.
2. Cap the escalation instead: clamp the behavior roll's total at 5 rather than 6, or cap Frenzy at 2,
   so the constraint continues to bind. This is a number the simulator moves (13-10 records the rate
   and the cap as starting values), so it stays inside the settled decision.
3. Replace the constraint with one stated on the Frenzy-0 table and a second stated on the whole
   Frenzy range, so an author has something they can still check by hand.

---

### C5. A retarget's `loudest-matches` step re-admits a soldier who fails the entry's Position requirement

**Location.** `data/engagement/attention.yaml` lines 199 to 205 (`evaluation`, `steps`,
`loudest-matches`) read under lines 246 to 258 (`evaluation`, `retargeting`, `candidates` and `how`);
`data/engagement/behavior-procedure.yaml` lines 93 to 112 (`resolving_a_card`, `choose`);
`docs/rules/05-titan-engagement.md` lines 702 to 710.

**Problem.** Retargeting says the evaluation is run "exactly as any evaluation: the same rungs ... and
the same steps (top, loudest-matches, struck-first, narrow, holder, card, none), over that narrowed
set." But `loudest-matches` is not a filter, it is the one step that **adds**, and its own wording
overrides any narrowing: "Add to the tied set **every candidate** who holds the loudest flag ... and
it adds them **whatever Position they hold**, so a soldier who came in loud from distant is in the
set."

"Every candidate" is defined by `candidates` (line 68), not by the narrowed set. So the step can put
back a soldier who does not meet the entry's `position_requirement`, and the `narrow` step's
`loudest-or-brightest` rung then keeps only them. The entry resolves against a target it is not
allowed to have, and nothing in the tree says which reading wins.

The loudest flag is reachable from Distant: `flags`, `loudest`, `set_when` gives it to any soldier
whose Flight scored no successes, "from any Position, distant included", and a Flight away from the
Titan ends at Distant.

**Play scenario.** Wooded. Medium Titan, Attention on Mila, who is at Blind Spot with a Nape strike
behind her. Ruth flies from In Reach out to Distant to change a canister and rolls no successes on the
Flight, so she comes in loud and holds the loudest flag. Jonas is In Reach. The card comes up: the
Next Behavior is Grab, Position requirement In Reach or On Body. Mila fails it, so the Titan
retargets. The narrowed set is {Jonas}. `top` gives nearest-person-in-reach. `loudest-matches` adds
Ruth, "whatever Position they hold". `narrow` reaches loudest-or-brightest, which only Ruth meets, and
keeps her. The Titan now Grabs a soldier standing at Distant, out of its reach, on an entry that says
In Reach or On Body. The table stops.

**Fix options.**
1. Add one sentence to `retargeting`, `how`: "`loudest-matches` adds only candidates who are in the
   narrowed set; a loud soldier who fails the `position_requirement` is not added." This is the
   minimal fix and keeps the step deterministic.
2. Amend `loudest-matches` itself to read "every candidate **being tested**", and add a parenthesis
   noting that on a retarget the candidates being tested are the narrowed ones.
3. Run the retarget as a filter on the *result* rather than a re-evaluation: evaluate the ladder
   normally, then drop any returned soldier who fails the requirement and re-run. Larger change, and
   it may not terminate cleanly, so option 1 is preferred.

---

### C6. Retargeting breaks ADR-0010's standing promise that a Nape striker who falls short draws the Titan's next behavior

**Location.** ADR-0010, *Amended* after decision batch 4b (4b-1) and reaffirmed after batch 5, against
ADR-0010's batch 13 amendment; `docs/rules/05-titan-engagement.md` line 822;
`data/engagement/attention.yaml` lines 206 to 211 (`struck-first`) and lines 180 to 186
(`abnormal_ladder_format`, `rules`); `data/engagement/behavior-procedure.yaml` lines 93 to 105.

**Problem.** ADR-0010 makes an explicit promise, three times, and batch 13 does not withdraw it. Batch
4b: "the promise that a Nape striker who falls short draws the Titan's next behavior **on every
ladder** is a rule of the ladder format". Batch 5: "...and the promise that a Nape striker who falls
short draws the Titan's next behavior." Batch 13's own amendment closes with "The rungs, the first
rung that no shout can outbid, and the Nape strike's Attention restriction are all **unchanged**."

Retargeting breaks the promise in the common case. The striker takes Attention at the card's
`attention` step, as designed. Then the `choose` step finds that Blind Spot is not in the rolled
entry's `position_requirement` and moves Attention onto someone else, on the same card, for free. The
striker draws nothing, and is freed to strike again next turn.

How often, standard Medium (`position_requirement` includes `blind-spot` only on result 1, Fixed
Grin, and result 4, Shake Off):

| Frenzy | share of rolls that keep the Blind Spot striker | share that retarget away from them |
|---|---|---|
| 0 | 2/6 = 33.3% | 66.7% |
| 1 | 1/6 = 16.7% | 83.3% |
| 2 | 1/6 = 16.7% | 83.3% |
| 3 | 1/6 = 16.7% | 83.3% |

Frenzy makes it worse, because it pushes the roll toward results 5 and 6, which are In Reach or On
Body. So the two halves of batch 13 compound: the lever that was meant to put lethality back also
removes the one price a failed Nape strike ever paid.

The prose still asserts the old behaviour. Chapter 5 line 822: "a striker who falls short draws the
Titan's next behavior, **whatever cards come between**, on every ladder". `struck-first`'s own
rationale: "so a striker who falls short draws the Titan's next behavior". Both are now false five
times in six.

This is not a request to reopen 13-9. ADR-0010's batch 13 amendment says in its own words that a
striker "no longer parks the whole fight", so the direction is settled. What is wrong is that the
amendment claims nothing changed while a standing promise of the same record, and two live sentences
in the chapter and the data, now read false.

**Play scenario.** Giant Forest, round 3, Frenzy 2. Mila strikes the Nape and falls 2 successes short,
turning them into Openings. The hooked-by-strike flag fires, and the Titan's next card turns to her.
Her player accepts it: that is the deal the rules made, and she is about to be Shrugged Off. The
Choose step rolls Grab. Blind Spot is not on it, so the Titan retargets to Jonas In Reach and Grabs
him instead. Mila is still on her tree, still holding two comrades' Openings, and her turn comes round
with a clean board. Jonas's player asks why the person who put a blade in its neck is the one the
monster ignores.

**Fix options.**
1. Amend ADR-0010 honestly: state that batch 13 narrows the batch 4b promise to "a striker who falls
   short draws the Titan's Attention, and its next behavior when that behavior can reach Blind Spot",
   and rewrite Chapter 5 line 822 and `attention.yaml` `struck-first` to match. No mechanics change;
   the rules stop lying.
2. Keep the promise by exempting the striker: a retarget never moves Attention off a soldier holding
   the `hooked-by-strike` flag; that Titan's entry falls back instead, as it did before batch 13. This
   restores the price of a failed strike and still fixes the Distant-parking case 13-9 was aimed at,
   since a Distant holder holds no flag.
3. Keep the promise one card deep: a retarget moves Attention for this card's resolution only, and
   Attention returns to the flag holder at the card's `next` step. Heavier bookkeeping, and it
   contradicts `attention_moves`, so it is the weakest of the three.

---

## Major

### M1. The fallback entry is never retargeted, so the inertness 13-9 fixed survives in two tables

**Location.** `data/engagement/behavior-procedure.yaml` lines 93 to 105 (`choose`);
`docs/rules/05-titan-engagement.md` lines 629 to 631; `data/engagement/titan-format.yaml` lines 143 to
147 (`entry_fields`, `fallback`). Affects `data/titans/standard-large.yaml` (Bite, fallback Crush) and
`data/titans/sprinting-abnormal.yaml` (Headlong Lunge, fallback Pitch Headlong).

**Problem.** `choose` retargets the **rolled** entry and then, if nobody qualified, "the behavior is
its fallback entry; and if that fallback is thrash, is the previous behavior, or **fails either
test**, the behavior is Thrash." The fallback's `position_requirement` is therefore tested against the
*unchanged* Attention holder, with no retarget. In every table whose fallback is `thrash` that is
harmless, because Thrash lists all four Positions. In the two tables with a real fallback it
reproduces exactly the failure 13-9 exists to remove.

**Play scenario.** Open ground, standard Large. Attention is on Ruth, mounted at Distant. Jonas is In
Reach on foot; nobody is On Body. The card rolls Bite (On Body only). Retarget: no candidate holds On
Body, so the fallback is taken. The fallback is Crush, which needs In Reach. Ruth, still the holder,
is at Distant, so Crush fails and the behavior is Thrash. Jonas is standing inside the Large Titan's
reach and it flails instead of crushing him. Under 13-9's own principle ("it takes what it can catch")
it should have turned on Jonas and Crushed him, and the change list says explicitly that "no Behavior
Table is re-authored and every `fallback` value stands", which is only true if the fallback is
reachable.

**Fix options.**
1. Apply the retarget to the fallback too: "test the fallback entry the same way, retargeting over the
   candidates who meet *its* `position_requirement`, and reach Thrash only when nobody meets that
   either." One sentence, and it makes the fallback field mean something again.
2. Keep the fallback untested against Position and let it resolve against whoever the retarget would
   pick for it; simpler to state but it changes what `fallback` means.
3. Declare fallbacks other than `thrash` obsolete under retargeting, set both to `thrash`, and record
   that the field is retained for Abnormals that want a specific flail. This is the only option that
   touches `data/titans/`, which 13-9 says it does not want to do.

---

### M2. The closed Position list has a hole: a *living* Titan going down

**Location.** `data/engagement/positions.yaml` lines 30 to 133 (`changes_to_position`, `list`);
`docs/rules/05-titan-engagement.md` lines 195 to 221 (the table). Against
`data/engagement/titan-harm.yaml` `falling_titan` (`when`, `grounding`; `leap_clear`, `success`, line
272; `pinned`).

**Problem.** The list claims to be closed: "Nothing else in the game moves a soldier between Distant,
In Reach, On Body, and Blind Spot." The Falling Titan rule fires on two triggers, `death` and
**`grounding`** (a living Focus Titan becoming grounded). On either, every soldier On Body or at Blind
Spot who is not airborne either clears ("They hold In Reach relative to the Titan") or is Pinned
(which holds In Reach relative to the body). Both are changes of Position.

The death trigger is covered, by the `focus-titan-dies` row. **The grounding trigger is on no row.**
It is not a fall (the Titan falls, not the soldier, and `data/gear/falls.yaml` does not list it), it is
not a knock loose, it is not the close rule, and the `titan-stands-up` row covers the Titan getting
back *up* at the Open rating, not going down. The list's own `not_changed_by` paragraph makes the hole
worse by asserting that "Becoming Down, Pinned, or Grabbed changes a Position only as a row above
states", when no row above states it for Pinned.

**Play scenario.** Wooded. Mila is at Blind Spot, Jonas is On Body. Ruth breaks the Titan's second leg
with a Body Part strike and it becomes grounded. Its body comes down. Both Mila and Jonas roll Leap
Clear; Jonas makes it and Mila fails and is Pinned. The GM writes In Reach for both, correctly, from
`titan-harm.yaml`. A player checks the closed list in section 5.2, finds no row that allows it, and
points out that the chapter says an action never changes a Position and only these fourteen things do.
Both readings are supported by the text.

**Fix options.**
1. Add a fifteenth row: "A Titan's body coming down (a death or a grounding) — every soldier On Body or
   at Blind Spot who is not airborne holds In Reach relative to that body, whether they Leap Clear or
   are Pinned (section 5.7, `titan-harm.yaml`, `falling_titan`)." Add it to `positions.yaml` and to the
   chapter table.
2. Broaden the `fall` row to "any fall, and a Titan's body coming down", and name Leap Clear and
   Pinning in its effect.
3. Broaden the `focus-titan-dies` row to "a Focus Titan dying **or becoming grounded**", and state the
   grounding result separately, since a grounded Titan keeps its Positions and does not become a
   corpse.

---

### M3. "No Action Catalog entry changes a Position" is false

**Location.** `data/engagement/positions.yaml` line 134 (`changes_to_position`, `not_changed_by`);
`docs/rules/05-titan-engagement.md` line 216. Against `data/character/action-catalog.yaml` `leap-clear`
(line 706, `kind: roll`) and `fly` (line 670, `kind: roll`).

**Problem.** The *principle* is stated precisely — "An **action** never changes a Position" — and that
is true of every entry of `kind: action`. But `not_changed_by` then overreaches to the whole Catalog:
"**No Action Catalog entry** changes a Position ... The Nape strike, the Body Part strike, Break
Attention, Draw Attention, Read, Heave, Treat Injury, Rally, and **every other entry in the Catalog**
leave every soldier exactly where they stand, whatever they roll." Chapter 5 line 216 repeats it:
"None of them moves anyone, whatever it rolls."

`leap-clear` is a Catalog entry, and its success is literally a change of Position (M2). `fly` is a
Catalog entry, and every Flight is an ODM move that changes a Position — the list's own `own-move` row
says so ("An ODM move is a Flight"). `mount-or-dismount` is an option that rides along with a move. The
sentence the reader is told to trust is the one that is wrong; the one that is right is the heading
above it.

**Play scenario.** A GM adjudicating an improvised act checks whether it could move the soldier and
reads "no Catalog entry changes a Position, whatever it rolls". Two minutes later the same soldier
falls under the Titan's body and rolls `leap-clear`, and the GM has to decide whether the success
moves them to In Reach or leaves them where they were. The two sentences in section 5.2 give opposite
answers.

**Fix options.**
1. Narrow both sentences to "No entry of kind `action` in the Action Catalog changes a Position", and
   add "`fly` and `leap-clear` are not actions: a Flight is the soldier's own move, which the first row
   covers, and Leap Clear is the Falling Titan's roll, which M2's new row covers."
2. Keep the broad claim and add the two named exceptions inline, so the reader who scans the paragraph
   sees them.

---

### M4. Blind Spot "standing on a tree" against `airborne` and `jam`, at every rating but Urban

**Location.** `data/engagement/positions.yaml` lines 24 to 43 (`blind-spot`, `meaning` and
`not_on_the_titan`); `docs/rules/05-titan-engagement.md` lines 191 to 193;
`CONTEXT.md` line 369. Against `data/gear/odm-gear.yaml` `airborne` (`becomes_airborne`), `jam`
(effect, fifth bullet, line 185), and `data/engagement/anchor-ratings.yaml` `urban`, `terrain_trait`.

**Problem.** 13-6 is a clarification, and it clarifies in a direction the rest of the tree does not
follow. Blind Spot is now described everywhere as "the soldier **stands** on a tree, a roof, or
whatever else the Anchor Rating gives". But reaching Blind Spot at Sparse, Wooded, or Giant Forest is
an ODM move, and `becomes_airborne` says "The soldier makes an ODM move", so that soldier is
**airborne**: "in the air on their own ODM Gear". Only the Urban Terrain Trait says otherwise, and it
is written as a *benefit* of that one rating.

Two live rules now read strangely under the new wording:

- `jam`: a soldier at Blind Spot in a Giant Forest whose harness Jams on a Pushed Nape strike is
  airborne, so they fall, with Giant Forest raising the band. The chapter has just told the table they
  are standing on a tree.
- `falling_titan`, `path`, `airborne`: "An airborne soldier swings clear with no roll and keeps their
  Position." So the Wooded Blind Spot soldier is safe from the falling body for free, while the Urban
  one — the only one the rules say is standing on something solid — must Leap Clear or be Pinned. The
  rating that grants the anchor is the rating that makes the body dangerous.

Before 13-6 the Blind Spot read as "hanging off an anchor point", and both rules were coherent. The
clarification is right about the fiction and was applied to three files without reconciling the two
that depend on the old reading.

**Play scenario.** Giant Forest. Mila is at Blind Spot, described to the table as braced on a branch
behind the Titan's neck. She Pushes her Nape strike, the Gear Die shows 1, her ODM Gear Jams, and the
GM tells her she falls from an extreme-band height because she was airborne. Her player reads out
section 5.2: "the soldier is on a tree or a roof, not touching the Titan". The GM has no answer that
is not "Urban is special".

**Fix options.**
1. Make the Urban clause general: a soldier who holds Blind Spot is anchored to terrain and is not
   airborne at **any** rating, and give Urban a different Terrain Trait. Cleanest reading of 13-6, but
   it changes what a Jam costs and what the Falling Titan catches, so the retune must read it.
2. Keep the mechanics and narrow the fiction: state in `blind-spot`, `meaning` that the soldier is
   anchored to terrain **behind** the Titan and may be standing on it or hanging from it, and that
   whether they are airborne follows the move that got them there and the Terrain Trait. Costs
   nothing, and keeps 13-6's real point, which is "not on the monster".
3. Leave both and add a cross-reference from `blind-spot`, `not_on_the_titan` to `airborne` and `jam`,
   so the reader at least finds the exception. Weakest option; the contradiction stays, it is merely
   signposted.

---

### M5. Frenzy is not on Chapter 1's closed list of what the GM applies as written

**Location.** `docs/rules/01-core-rules.md` line 49 (section 1.1, item 6). Against
`data/engagement/titan-format.yaml` lines 63 to 65 (`frenzy`, `gm`: "none (ADR-0024, limit 8)"),
`CONTEXT.md` **Ruling** ("The rules the GM applies as written are listed in Chapter 1, section 1.1"),
and `data/core/circumstances.yaml` (`in_titan_engagement`).

**Problem.** Chapter 1 item 6 is the single closed list the glossary points a GM to, and it names
"the Behavior Tables, the Attention Ladder, Attack Dice and Titan Dice, the Reaction procedure ... the
Grab countdown, **Regeneration**, **the retreat clock**, and the end tests". Frenzy is a new Titan
counter of exactly that kind and is on none of these lists. Chapter 1 was not touched by this change
at all. Retargeting is arguably covered by "the Attention Ladder"; Frenzy is covered by nothing.

`titan-format.yaml` does say the GM never raises, lowers, or spends it, so the rule exists — but it
exists only in the file the GM is least likely to open mid-fight, and the list that is supposed to be
exhaustive is now not.

**Play scenario.** Round 5. The Squad is grinding and the GM feels the fight tipping too hard. He
says: "I'll hold the Titan at Frenzy 2, it has just taken a leg." A player checks section 1.1 item 6,
finds Regeneration and the retreat clock named and no mention of Frenzy, and concludes the GM is
within his rights. He is not — ADR-0024 limit 8 and `titan-format.yaml` both close it — but the one
list written to settle this argument does not settle it.

**Fix options.**
1. Add "Frenzy and its end step" to the item 6 list, beside Regeneration and the retreat clock.
2. Add it there and to `data/core/circumstances.yaml`'s "never for the Titan's dice, cards, Attention,
   or tables", which should read "...cards, Attention, Frenzy, or tables".
3. Do both, and add a Frenzy line to the Rulings paragraph of Chapter 5, section 5.4.

---

### M6. The simulator's Grab model and `health_reports` still specify the old Health values

**Location.** `data/engagement/tuning.yaml` line 933 (`grab`, `model`) and lines 972 to 985
(`grab`, `health_reports`, `model` / `with_earlier_injuries` / `fresh_victim_lone`). Against
`data/engagement/tuning.yaml` `builds`, `rookie` (line 218, Health 6) and batch 13-2 ("the
`health_reports` rows, whose reachable Health values are now 4 to 8").

**Problem.** The stale-figures header added at the top of this file covers measured figures. These two
blocks are not figures, they are **model specifications** that tell the rerun what to run:

- `grab`, `model`: "Victim: the reference Rookie (Strength 4, **Health 4**, Resolve 3, Blade Set 1,
  Grip Breaker 1, Stress 1)". The reference Rookie's Health is now 6, in the same file, 700 lines
  above.
- `health_reports`, `model`: "two [earlier injuries] at Health 3 to 6, and **one at Health 2** so the
  victim starts with a box left", with `columns` running `health_2` to `health_6`.

`simulator_cases` (line 1105) *was* updated to "the Health 4, 7, and 8 builds". The block those cases
point at was not, so the two disagree about which rows exist. 13-2 also says the Health 2 and 3 rows
"describe Health values no soldier can now have", and the model still asks for them.

**Play scenario.** The retune is run. Whoever writes the case file opens `grab`, `model`, builds the
victim at Health 4 as written, and reports every Grab figure against a soldier two boxes short of the
reference Rookie. Every band in ADR-0014 is then read against the wrong victim, and the comparison
with the pre-batch-13 figures — which is the entire point of measuring A and F together — is
meaningless.

**Fix options.**
1. Update both blocks: the Grab victim reads Health 6, and `health_reports` reads "two at Health 5 to
   8, and one at Health 4 so the victim starts with a box left", with columns `health_4` through
   `health_8`.
2. Replace the literal number in `grab`, `model` with a reference — "the reference Rookie (`builds`,
   `rookie`)" — so it can never go stale again, the same reasoning 13-4 applied to the `reported_squad`
   key.
3. Mark both blocks explicitly as superseded and move the old rows into a `history` key, so the rerun
   author cannot read them as a specification.

---

## Minor

### m1. Retargeting can turn a Titan's kill-tier entry onto a Down soldier, and nothing says so

`data/engagement/attention.yaml` lines 74 to 78 (`candidates`, `down`) and lines 246 to 251
(`retargeting`, `candidates`). A Down soldier is a candidate and meets `nearest`, which is
`down_can_meet: true`. In a narrowed set containing only Down soldiers, `top` finds `nearest` and picks
one. A Down soldier makes no Reaction, so every success of the card is net, and the Critical Injury
adds 1 per Net Success beyond the first. Before batch 13 that Titan would have Thrashed.

*Scenario.* Round 4, Frenzy 2. Jonas is Down at In Reach with two untreated Critical Injuries; Mila is
treating him from In Reach and has spent her Reaction; everyone else is at Blind Spot or Distant. The
card rolls Bite. Attention is on a Blind Spot striker, who fails; the narrowed set is {Jonas, Mila};
`nearest` keeps both at In Reach; the card tie-break picks Jonas. Nine Titan Dice, every success net,
+1 to the roll per Net Success beyond the first, on a soldier already at 1 box.

The behaviour is defined, so this is not a bug. It is a lethality change nobody wrote down, in the same
batch that raised Health to reduce lethality. Fix: name it in the 13-2 retune brief as a case to
measure (a Down soldier's share of retargeted kill-tier cards), and add a sentence to Chapter 5's
*Retargeting* section so a GM is not surprised the first time it happens.

### m2. The branch-map diagram reads as a fourth Position

`data/engagement/anchor-ratings.yaml` lines 141 to 144 (`diagram_lines`);
`docs/rules/05-titan-engagement.md` lines 289 to 293.

```
                      /--- On Body ----\
Distant --- In Reach -                  - (joined)
                      \--- Blind Spot -/
```

A reader at the table sees a node labelled "(joined)" to the right of On Body and Blind Spot, which
looks like a fifth place to stand. The intended statement is that On Body and Blind Spot join **each
other**. Fix: draw it as a triangle with In Reach at the left and a vertical bar between On Body and
Blind Spot, or drop the ASCII and write the three joins as three lines of text ("In Reach — On Body",
"In Reach — Blind Spot", "On Body — Blind Spot").

### m3. `call_it` names the fallback and Thrash but not a retarget

`data/engagement/read.yaml` lines 88 to 92 (`call_it`, `effect`): "This holds when the card resolves it
as its fallback or as Thrash." The list was written to close exactly this question and a third case was
added to the game without joining it. Reading "each target" literally, a retargeted target does gain
the Bonus Dice; the explicit list invites the opposite reading. Fix: append "or when a retarget moves
its targets (`behavior-procedure.yaml`, `resolving_a_card`, `choose`)".

### m4. Chapter 5's close-rule row drops a qualifier the YAML has

`docs/rules/05-titan-engagement.md` line 211 reads "Becoming On Body or Blind Spot of one Titan sets
**the other Titan's** Position to In Reach". `positions.yaml` `close_rule` reads "their Position
relative to every other Focus Titan **that is on-body or blind-spot** becomes in-reach". As rendered,
the chapter says a soldier who climbs onto Titan A is pushed to In Reach relative to Titan B even if
they were at Distant from B. Fix: restore the qualifier in the table cell.

### m5. A retarget can in principle return nobody

`data/engagement/attention.yaml` lines 232 to 240 (`evaluation`, `steps`, `none`) read under
`retargeting`, `how`, which lists `none` among the steps the retarget runs. If the narrowed evaluation
reaches `none`, nothing holds Attention, but `choose` says "The soldier that evaluation returns holds
the Titan's Attention ... and the entry resolves against them". There is no soldier and no defined
outcome. The `none` step is unreachable at a card in Phase 1 (cards are dealt, every player character's
card is distinct, and a Wing holds one Squadmate), so this costs nothing today and will cost something
the first time a Wing holds two. Fix: add to `retargeting`, `none`: "if the narrowed evaluation reaches
the `none` step, treat it as no candidate meeting the requirement and fall back."

### m6. A label in `tuning.yaml` still reads the old template Health

`data/engagement/tuning.yaml` line 960: `{case: "Hunter (Strength 3, Health 3, no Break Free Talent)"}`.
The Hunter template's Health is now 5 (`squadmates.yaml` line 216). The figure beside it is stale under
the file's new header, but the *label* names a build that no longer exists, which is the failure mode
13-4 renamed `reported_squad_health_2` to avoid. Fix: read "Hunter (Strength 3, Health 5 since batch
13, no Break Free Talent)", or drop the Health from the label, since the case is about the missing
Talent.

### m7. The glossary's Attention entries do not mention the second reading of the Ladder

`CONTEXT.md` **Attention** and **Attention Ladder**. The Ladder is defined as "the ranked stimuli a
Focus Titan turns its Attention toward **each time it acts**", and Attention as changing when "no rung,
its holder, or the cards pick one out". Neither names the retarget, which is now a second, distinct
occasion on which the Ladder is read and Attention moves — and which happens *after* the Titan has
already acted on the Ladder once in the same card. Frenzy got a full glossary entry in this change;
retargeting got none. Fix: add a clause to **Attention Ladder** ("and read a second time, over the
soldiers who meet a rolled entry's Position requirement, when its holder does not"), or add a
**Retarget** entry of its own.

---

## What is right

Worth saying, because a findings list reads as if nothing landed.

- The Health change is genuinely one line, and it was carried into every derived number I could find:
  nine Squadmate templates, three reference builds, the `reported_squad` and `reported_squad_fragile`
  rows, Chapter 2's worked example (Mira, 2 + 3.5 → 6), Chapter 3's worked example (Oskar, and the
  "Had Oskar's Health been 2" clause correctly rewritten as history), Chapter 4's fall table row "5 or
  more", and the musket note. The `reported_squad_health_2` rename is exactly the right instinct.
- The stale-figure headers in both `tuning.yaml` files are unusually honest, and they name what the
  rerun must answer rather than just declaring the numbers old.
- 13-11's ordering call — Frenzy counts at the moment the Next Behavior is rolled — is the right one,
  is argued from ADR-0024 limit 14, and is stated identically in five places
  (`behavior-procedure.yaml` `frenzy_when`, `round.yaml` `frenzy`, `titan-format.yaml` `frenzy`,
  Chapter 5 line 618, ADR-0001). I could not find a reading of the procedure where Frenzy is re-read
  after the roll.
- The closed Position list is a real improvement even with the hole in M2, and `not_changed_by` naming
  Attention, retargets, decoys, flags, and Frenzy as things that move nobody is the paragraph most
  likely to prevent an argument at the table.
- Retargeting terminates. It is one evaluation, not a loop: the narrowed set is fixed before the
  evaluation starts, the evaluation has a finite step order, and the `none` branch of `choose` is
  reached without recursion. The only way it fails to return a legal answer is C5 and m5.
- Chapter 6's rendered behavior tables picked up the `wreck` effects that were already in
  `data/titans/*.yaml` and missing from the prose. That is a stale-render bug fixed in passing, and it
  is the direction the task's rule says it should be fixed in: the YAML won and the chapter was the
  bug.
