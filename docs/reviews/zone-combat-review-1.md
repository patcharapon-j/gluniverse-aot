# Batch E, zone combat, review round 1

Reviewer: independent senior TTRPG designer. Date: 2026-09-21.

**Scope.** Batch E as it stands in the tree (`git diff d6db8ae..HEAD`), following
`docs/playtest/process/zone-combat-review-task.md`: the rules (Chapters 1 to 7, `data/`, `CONTEXT.md`,
ADR-0029 and the ADRs it amends), the site (`site/src/content`, and the `site/src/lib` tables,
glossary, and pages those render), the playtest packet
(`docs/playtest/wings-of-freedom-playtest-packet.html`), and Foundry's user-visible strings
(`foundry/static/lang/en.json`, plus the one code path needed to show a string is reached). Foundry
logic and `tools/sim/` are out of scope and were not reviewed.

**Settled, not reopened.** Decision batches 16 and 17, ADR-0029, `OWNER-DECISIONS.md`, and
`docs/reviews/zone-retune-decisions.md`. Every finding below is a settled decision applied
incorrectly, incompletely, or inconsistently, or a mechanical gap the settled text leaves.

**Checks run.** A geometry script (`scratchpad/zr/f.py`, reading `data/engagement/zones.yaml`
directly) enumerated every ordered pair of zones on all three fields: the Stride's route rule always
has an on-field neighbour one zone closer (0 stuck pairs on every field), never more than two
candidates (so the lower-numbered tie-break always decides), and both worked Stride examples in
Chapter 5 and the packet are correct. The same script found that the Set piece's start zone is not an
edge zone (m1). A 200,000-field sample of the terrain mix (`scratchpad/zr/t.py`) gives the share of
rolled zones that differ from the field rating (m3). The printable field's SVG is 211 mm wide on a
211-unit viewBox, so each hex is 45.0 mm flat to flat and 52 mm corner to corner, which meets 16-36.

**Counts.** 1 Critical, 11 Major, 14 Minor.

---

## Critical

### C1. Two Momentum trims contradict each other in the middle of a Flight

**Location.** `data/engagement/anchor-ratings.yaml`, `anchors`, `momentum_cap` (lines 192 to 195),
against `momentum`, `gained` (lines 228 to 231) and `data/engagement/zones.yaml`, `flight`,
`momentum_trim: arrival-zone`. Chapter 5, section 5.2, *Momentum*, "Cap" (line 489) against *Flight*,
fourth bullet (line 474). The packet states both in one line (line 4174: "excess is lost at once when
your zone changes or its rating falls, and at the end of the move").

**Problem.** 16-4 says a soldier whose zone changes loses Momentum above the new zone's anchors "at
once". 16-14 says a Flight's Carry "is spent from it during the move" and Momentum above the anchors
of the zone the Flight ends in is lost "at the end of the move". Every zone step of a Flight changes
the soldier's zone, so the general rule trims at each step and the Flight rule trims only at the end.
Nothing orders them, and they give different answers to whether a declared Flight is legal. That is a
closed rule (ADR-0024: "whether a move is allowed, what a Flight's Carries cost") with two readings,
so the GM is left choosing between them.

**Play scenario.** Private Mila Brandt is free in a Giant Forest zone (anchors 3) and rolls 3
successes on her Flight: 3 Momentum. The Titan stands two zones away across an Open zone. Her Flight:
first step into the Open zone (free), Carry into the Titan's Open zone (2), Carry onto its body (1),
total 3. Under the Flight rule she arrives On Body with 0. Under the cap rule she enters the first
Open zone, drops to 0 at once, cannot pay the 2, and the Flight, which may not end free in an Open
zone, has no legal ending at all. One reading puts her on the Titan; the other forbids the move she
declared.

**Fix options.**
1. In `momentum_cap`, add "except during a Flight, whose Momentum is trimmed only at the end of the
   move (momentum, gained)", and mirror it in Chapter 5 line 489 and the packet line 4174.
2. Or make the Flight trim per step and delete `gained`'s end-of-move sentence and
   `momentum_trim: arrival-zone`; this is harsher on crossings of Open and Sparse zones and should be
   re-read by the simulator.

---

## Major

### M1. Chapter 5 section 5.11's end-step paragraph still reads the retired model

**Location.** `docs/rules/05-titan-engagement.md` line 1304, the sentence beginning "Then Chapter 3's
end steps run". Against `data/harm/engagement-end.yaml`, `positions_read` and
`momentum_and_anchors`, and 16-24.

**Problem.** It says the end steps read "each soldier's last Position relative to a Focus Titan that
died (section 5.2)" and that "Chapter 4 clears every Position record, with which the Titan
Engagement's Anchors and every soldier's Momentum are cleared". 16-24 retired the recording of last
Positions and the recorded labels; Positions are never recorded (16-9); the single Anchors count is
retired (16-4). The YAML reads Positions derived at the end relative to each living Focus Titan and
each corpse, and clears "the field, with every zone's rating". This is the leftover the task
suspected. Under ADR-0012 the prose is wrong.

**Play scenario.** A Titan dies in round 5 while Jonas is On Body. After the death the detach rule
makes him Anchored, and he flies to a Down comrade two zones away. A second Titan kills the Squad's
last standing soldier and the fight ends. The GM reads 5.11, looks for Jonas's "last Position
relative to" the dead Titan to decide the aftermath roll, finds no record anywhere on the sheet
(16-35 removed it), and has to guess whether "last" means On Body at the death or Distant now.

**Fix options.**
1. Replace the sentence with the YAML's: the end steps read the Positions derived from each soldier's
   zone and attachment as it ends, relative to each living Focus Titan and each corpse, and after the
   last of them the field, with every zone's rating, and every soldier's Momentum are cleared.

### M2. Heave's Help reach disagrees between Chapter 5 and its YAML

**Location.** Chapter 5 section 5.7, *Heave and cutting free*, line 1108: "Comrades at the same
Position may Help." Against `data/engagement/titan-harm.yaml`, `heave`, `help` (line 376: "in the
heaver's zone or an adjacent zone"), the glossary's **Help**, and the packet (line 3301, which
matches the YAML).

**Problem.** Under 16-11 "the same Position" between two soldiers reads the same zone, so the chapter
gives Heave a narrower Help reach (same zone) than the YAML, the glossary, and the packet (same or
adjacent zone). ADR-0012 makes the prose wrong, but a GM reading Chapter 5 will enforce the narrower
reach.

**Play scenario.** Hanne limb-pinned under a corpse in zone 7 Heaves; Dieter is in zone 8 with an
unspent action. The packet says he may Help; Chapter 5 says he may not. The Heave count reaching the
rating one turn earlier or later decides whether corpse heat takes another box.

**Fix options.**
1. Line 1108: "Comrades in the heaver's zone or an adjacent zone may Help, each spending their action
   (Chapter 1, section 1.8)."

### M3. Two more Chapter 5 readers of the old Position comparison

**Location.** Chapter 5 line 766 (a called roll: "Help on it is Help as this chapter gives it: a
comrade with an unspent action at the same Position or one step away"), and line 1298 (the no soldier
standing test: "a comrade who shares their Position may still lift them").

**Problem.** "The same Position or one step away" between two soldiers is exactly the phrase 16-11
and 16-37 replaced ("the same zone or an adjacent zone"), and Lift Comrade reads the same zone
(16-23). "Shares their Position" has no defined meaning for two soldiers any longer except through
16-11's mapping, which the reader must know to apply. Each is a reader of the old model in the
chapter that defines the new one.

**Play scenario.** A soldier past the stay limit who has lost both legs lies in zone 4; a comrade
stands in zone 4 On Body of a Titan. Is that "sharing their Position"? Relative to the Titan one is
In Reach and one On Body, so a literal reader says no, and the lift is refused. 16-11 says the same
zone is the test, so it is allowed.

**Fix options.**
1. Line 766: "a comrade with an unspent action in the same zone or an adjacent zone".
2. Line 1298: "a comrade in their zone may still lift them".

### M4. ADR-0001 and ADR-0014 were not amended for Z2

**Location.** `docs/adr/0001-titans-act-from-behavior-tables.md` line 22 ("Frenzy rises at the end
of every even-numbered round"); `docs/adr/0014-numbers-tuned-to-design-targets.md` lines 65 ("rising
1 every second round") and 69 ("one rise every second round, at the end of every even-numbered
round"). Against decision batch 17's index table, row Z2, column *ADR change*: "amends ADR-0001".

**Problem.** The decision names an ADR amendment and it was not written. ADR-0014 carried the rate
from the round 3 retune in the same shape and is now stale as well. `CONTEXT.md`, Chapter 5, the
YAML, the site, the packet, and Foundry all read every third round, so the ADRs are the only surfaces
that disagree, and ADRs are what a later decider reads first.

**Play scenario.** The next rules decider, asked whether Frenzy's cap should move, reads ADR-0001
and ADR-0014 as the record of what was decided, sees "every even-numbered round", and measures cap
options against the wrong rate.

**Fix options.**
1. Append to ADR-0001 an "Amended after the zone retune (Z2)" paragraph in the shape of its R1
   paragraph: every third round, cap 3, and why.
2. Append the same one-line amendment to ADR-0014 after its line 69 paragraph.

### M5. The site's Fighting Titans page renders Anchors as one fight-wide pool

**Location.** `site/src/content/rules/fighting-titans.mdx` lines 203 to 217 (*Momentum and
Anchors*), and the three tables it and `site/src/pages/reference/quick-reference.astro` (lines 210,
233, 235) render from `site/src/lib/engagement-tables.ts`: `positionStepsTable` note (line 177),
`TERRAIN_WORDING` (lines 206 and 209), `anchorsTable` note (line 217), `SPEND_WORDING` carry and
bite (lines 234 to 236).

**Problem.** Against 16-4, 16-5, 16-13, 16-14, 16-20, and 16-21:
- "Speed you are carrying, 0 up to the Anchors left", "a public pool the rating sets", "However many
  are left is every soldier's Momentum cap", and "The Anchors are the fight's own pool, public and
  never restored": the cap is the anchors of the soldier's own zone.
- "Never restored. A wreck destroys 1": a wreck takes one rating step off the Titan's zone.
- "At 0 ... no step row changes. However flat the place has been beaten, the route to the Nape stays
  open": a wreck to Open removes that zone's Blind Spot steps and converts Blind Spot to On Body
  (16-21). This is now the opposite of the rule.
- Sparse: "The first Anchor wrecked in the fight is not lost": the grace is per zone.
- Giant Forest: "The first step a Flight Carries costs no Momentum": withdrawn by 16-5; the trait is
  now the raised fall band.
- Carry: "One more Position step ... relative to the same Titan. You may Carry more than once": a
  Carry is a zone or attachment step at the entered zone's cost, at most 2.
- Bite: "against the Titan you flew relative to": now a Titan in the zone the Flight ended in.
- The step table's note: "a move that crosses two steps spends Momentum on Carry".

The same page's Flight subsection (lines 185 to 196) is correct, so the page contradicts itself.

**Play scenario.** A player reads the site's Terrain Trait table, flies into a Giant Forest zone as a
second step expecting it free "as the first Carry", and argues with a GM reading Chapter 5, where it
is free anyway but for a different reason, and where a Carry into Sparse costs 1. A worse case: the
GM reads "no step row changes at 0" and keeps a Blind Spot in a zone a Titan just wrecked to Open.

**Fix options.**
1. Rewrite *Momentum and Anchors* in the terms of Chapter 5 section 5.2 (*Momentum*, *Wrecking*), and
   regenerate the three tables from `anchor-ratings.yaml` with zone wording: the anchors and Carry cost
   per zone, the per-zone Sparse grace, the Giant Forest fall raise, Carry and Bite as 16-13 and 16-14
   write them.
2. Drop `positionStepsTable`'s Carry note in favour of the chapter's "Read as" column (zone step into
   it, attachment step in it).

### M6. The site's GM pages tell the GM to lower the fight's Anchors

**Location.** `site/src/content/gm/titans.mdx` line 72 ("wrecks an Anchor ... Lower the fight's
Anchors by 1, say so, and remember every Momentum cap just dropped with it");
`site/src/content/gm/tuning-the-fight.mdx` lines 58 ("Anchors are never restored") and 117 ("wreck an
Anchor ... Anchors at 0 close no step row"); `site/src/content/gm/running-a-titan-fight.mdx` line 124
("You mark an Anchor down when an effect takes it").

**Problem.** Same model error as M5, on the pages the GM runs the fight from. The same `titans.mdx`
paragraph correctly states Z3 (Pitch Headlong no longer wrecks), so it was edited in this batch and
kept the retired mechanic. "Anchors at 0 close no step row" contradicts 16-21.

**Play scenario.** The standard Medium's Swat lands in zone 7. The GM, following `titans.mdx`, lowers
"the fight's Anchors" from 2 to 1 and tells every soldier on the field their cap is now 1. Under the
rules only zone 7 changes, from Wooded to Sparse, and a soldier in zone 3 keeps a cap of 2.

**Fix options.**
1. `titans.mdx` 72: "takes one rating step off the Titan's own zone, landed or whiffed; say so, and
   every soldier in that zone loses Momentum above its new anchors".
2. `tuning-the-fight.mdx` 58 and 117 and `running-a-titan-fight.mdx` 124: speak of a zone's rating
   stepping toward Open, and say that a zone wrecked to Open under a standing Titan loses its Blind
   Spot.

### M7. The site glossary still defines the retired model and lacks every new term

**Location.** `site/src/lib/glossary.ts`: **Anchor Rating** (line 26: "How well a battlefield holds
... how many Anchors the field holds"), **Position** (41: not derived), **Blind Spot** (43:
"anchored to terrain behind it"), **Corpse** (233 to 236: "It keeps its Positions"), **Momentum**
(313: "up to the Anchors left"), **Anchor** (314: "The fight's public pool ... A Titan wrecks them"),
**Move** (390: "changes your Position relative to one Titan by one step"). No entry for Field, Zone,
Edge zone, Off field, Field rating, Attachment, or Stride.

**Problem.** 16-37 rewrote Position, Anchor Rating, Blind Spot, and Corpse and added seven terms;
`CONTEXT.md` carries all of them, the site glossary none. The site's glossary is what every
`<GlossaryTerm>` hover shows, so the Fighting Titans page's new text hovers into old definitions.

**Play scenario.** A new player hovers "Move" on the Rules of Play page and learns that a move changes
their Position relative to one named Titan by one step. On the field they try to "step" from Distant
of Titan B to In Reach of Titan B two zones away, which is two zone steps.

**Fix options.**
1. Mirror the 16-37 entries into `glossary.ts` from `CONTEXT.md`, add the seven new terms, and delete
   or reword **Anchor** as "a zone's anchors, which cap the Momentum of every soldier in it".

### M8. Other site readers of Position steps relative to a Titan

**Location.** `site/src/lib/engagement-tables.ts` line 986 (the round diagram's swap step: "at the
same Position or one step apart"); `site/src/pages/reference/quick-reference.astro` lines 143
(Covering: "one step away or nearer"), 173 (Help: "from one step away or nearer"), and 214 ("A move
changes one named Titan's Position by one step"); `site/src/pages/learn/index.astro` line 198;
`site/src/content/rules/rules-of-play.mdx` line 371 ("A move changes your Position by a step");
`site/src/lib/harm-tables.ts` lines 286 ("at your Position or one step away, compared relative to the
event's Titan") and 291 ("your Position changes by one step"); `site/src/lib/core-tables.ts` line 302.

**Problem.** 16-11 retired the comparison relative to a Titan, and 16-12 made a move a set of zone
and attachment steps. The swap step on the round diagram is the one a table reads every round.
The Fear Roll's "compared relative to the event's Titan" is the comparison lookup 16-11 deleted.

**Play scenario.** At the swap step two soldiers stand in adjacent zones 7 and 8; relative to the
Titan in zone 7 one is In Reach and the other Distant, "one step apart" in the old lookup. Two
soldiers in zones 4 and 9 are both Distant from it, "the same Position", so the old wording lets them
swap across the field, which the rule (and Foundry's `farDetail`) forbids.

**Fix options.**
1. Replace each with 16-11's wording: "in the same zone or adjacent zones", and "a move is a zone step
   or an attachment step".
2. `harm-tables.ts` 286: "every comrade in your zone or an adjacent zone".

### M9. The site's corpse paragraph contradicts the corpse and fall rules

**Location.** `site/src/content/rules/fighting-titans.mdx` line 255: "Your Positions relative to it
are then derived exactly as for a living Titan, On Body and Blind Spot reading In Reach ... and is no
fall's reference."

**Problem.** "On Body and Blind Spot reading In Reach" is the pre-zone corpse rule that 16-24 replaced
("becomes one statement instead of a rewrite"). Under zones the attachments naming the Titan end at
its death, but a soldier's move may then make an attachment step onto the corpse (`positions.yaml`,
`corpse`, `steps`), and they hold On Body relative to it. "No fall's reference" contradicts
`data/gear/falls.yaml` (line 67), whose first reference is "the body the soldier's attachment named
when they fell", which can be a corpse.

**Play scenario.** Jonas climbs On Body of a corpse on foot to Heave from there (Heave is allowed from
On Body), then lets go. The site says his fall has no reference in the corpse and his On Body
"reads In Reach", so the fall is low; the rules say the reference is the corpse, he held On Body, and
the fall is high.

**Fix options.**
1. "Every attachment naming it ends at the death, and afterwards soldiers can step onto it on foot as
   onto a grounded Titan; Positions relative to it are derived as for any body. It holds no Attention
   and plays no cards."

### M10. Foundry shows a raw localisation key for every Giant Forest zone

**Location.** `foundry/src/rules/engagement/momentum.ts` line 14 (`TerrainTrait` includes
`'fall-raised'`), `foundry/src/config.ts` line 37 (builds `WOF.TerrainTrait.<trait>`),
`foundry/src/tracker/view.ts` line 593 (localizes it for the tracker). `foundry/static/lang/en.json`,
`WOF.TerrainTrait`, has no `fall-raised` key.

**Problem.** 16-5 changed Giant Forest's trait to the raised fall band, and Foundry's rules code
follows it, but the string was never added, so the tracker shows the literal
`WOF.TerrainTrait.fall-raised` for every Giant Forest zone. The old `first-carry-free` string is still
present and now unreachable.

**Play scenario.** A Giant Forest field is rolled (1 fight in 6 on the setup table). Every zone's
trait cell in the tracker reads `WOF.TerrainTrait.fall-raised`, and the table has to look up in the
book the one trait on that field that matters for falls.

**Fix options.**
1. Add `"fall-raised": "Every fall that is not from a horse, in this zone, is raised one band."` and
   delete `first-carry-free`.

### M11. Foundry's other user-visible strings read the retired model

**Location.** `foundry/static/lang/en.json`: `WOF.Sheet.momentum.hint` ("Capped by the Anchors left
in the Titan Engagement", shown by `TabKit.svelte` line 181); `WOF.Tracker.cue.swap` ("same Position
or one step apart", shown by `tracker/view.ts` line 471); `WOF.MomentumSpend.carry` ("one more
Position step on this move") and `.bite` ("against the Titan you flew toward"); `WOF.TerrainTrait.
first-wreck-ignored` ("The first Anchor wrecked here is not lost"). `WOF.Tracker.anchors` ("Anchors
{left} of {full}") and `WOF.Tracker.gm.anchor` ("The field is {name}: {n} Anchors") have no caller.

**Problem.** Same model errors as M5 and M8, in the tool the table plays on. The swap cue contradicts
the swap's own refusal message two keys later (`farDetail`: "a swap needs the same or an adjacent
zone"). Bite's "the Titan you flew toward" names a Titan the Flight no longer names (16-14).

**Play scenario.** At the swap step the tracker's cue tells the players two soldiers "one step apart"
may swap; they pick two soldiers both Distant from the Titan in zones 1 and 13; Foundry refuses with a
message using a different rule.

**Fix options.**
1. Reword each to the zone rule: the cap is "the anchors of your zone"; the swap is "the same zone or
   adjacent zones"; Carry is "one more step, at the entered zone's Carry cost, at most 2 a Flight";
   Bite is "against a Focus Titan in the zone your Flight ended in"; Sparse is "The first wreck this
   zone takes while Sparse does nothing".
2. Delete the two uncalled Anchors strings.

---

## Minor

### m1. The Set piece's start zone is not an edge zone

**Location.** Decision 16-7's reason ("The start zone is an edge zone on every field"), repeated as
fact in Chapter 5's design note (line 168), against the Set piece coordinates in
`data/engagement/zones.yaml`.

**Problem.** The geometry script: on the Set piece, zone 11 (0, 1) is ring 1 and has six neighbours,
so it is not an edge zone (the edge zones are 1 to 4, 7, 8, 12, 13, 16 to 19, as Chapter 5's own
rendered block lists). A soldier who starts there needs two moves on foot to leave, not one. The rule
is fine; the stated reason, printed in the chapter, is false for one of the three fields.

**Play scenario.** On a Set piece a player argues, from the design note, that they can step off field
from the start zone on their first move.

**Fix options.**
1. Chapter 5 line 168: "The start zone is an edge zone on the Skirmish and Standard fields; on the Set
   piece it is one zone in from the edge."

### m2. A stale step number in section 5.10

**Location.** Chapter 5 line 1225: a Background Titan's Size Class is "rolled at step 3 of the interim
setup table".

**Problem.** The interim setup list now has field size, field rating, and zone terrain before the
Titans, so Background Titans are step 5 (lines 192 to 196).

**Play scenario.** A GM following the pointer rolls a Size Class during zone terrain.

**Fix options.**
1. "rolled at step 5".

### m3. "About a third" of rolled zones differ: it is a quarter on average

**Location.** Chapter 5 design note line 261.

**Problem.** Sampled over 200,000 fields with the field rating rolled on the setup table: 25.0% of
the eleven rolled zones differ from the field rating overall; 33.4% on Sparse and Wooded fields, and
16.6% on Open, Urban, and Giant Forest fields, because Open has no sparser rating and Urban and Giant
Forest have no denser one.

**Play scenario.** A GM expecting a third of an Urban field to vary rolls it several times and sees
about two zones in eleven change, and wonders whether they are rolling it wrong.

**Fix options.**
1. "about a quarter of the eleven rolled zones on average: a third on Sparse and Wooded fields, a
   sixth on the others".

### m4. Anchored soldiers can be left Anchored in an Open zone

**Location.** `anchor-ratings.yaml`, `zone_becomes_open` (only "while a standing Focus Titan is in
it"), and `grounded_titan`, `ends` / `positions.yaml`, `titan-stands-up` (converts only Blind Spot).

**Problem.** A zone becomes Open under a grounded Titan (its falling body's wreck when it is grounded,
or a wreck entry it resolves while grounded). 16-21's rule does not fire, so every soldier Anchored in
that zone stays Anchored, airborne, on lines in terrain that has none. When the Titan stands again,
the stands-up rule converts Blind Spot to On Body but leaves them Anchored. The state persists for the
fight; a Jam still drops them, and the board draws them hanging.

**Play scenario.** A Medium's leg Breaks in a Sparse zone that has already used its grace; its body
comes down and wrecks the zone to Open. Two cutters on their lines stay Anchored there for the rest of
the fight, and a Flight could never have put them there.

**Fix options.**
1. Extend `titan-stands-up` (or `zone_becomes_open`) so that every soldier Anchored in an Open zone
   becomes Ground and stops being airborne, with no fall, when the zone becomes Open whatever stands
   in it.

### m5. A fall with no reference body inside a Titan Engagement

**Location.** `data/gear/falls.yaml`, `height`, `steps` (lines 66 to 75).

**Problem.** The last fallback is "the Focus Titan nearest the soldier's zone". In the run-on after
the last Focus Titan died, an Anchored soldier (attachment names no body) who falls, for instance to a
Jam on a Pushed Flight, has no reference body; the band step then reads a Position relative to
nothing. The outside-a-Titan-Engagement rule does not apply. The band is a closed rule with no answer.

**Play scenario.** Beside a corpse, a soldier flies to a Pinned comrade, Pushes, and Jams. The GM
must pick low or high.

**Fix options.**
1. Add "otherwise the corpse nearest the soldier's zone, a tie going to the earliest label; with none,
   the fall is low".

### m6. Avoided terms: "battlefield" and "behind the Titan"

**Location.** "Battlefield" (`CONTEXT.md` **Field**, _Avoid_): Chapter 5 lines 393 and 545;
`anchor-ratings.yaml` line 86; `data/engagement/tuning.yaml` line 381. "Behind" (**Blind Spot**,
_Avoid_: rear, behind; 16-10, "It has no facing"): `fighting-titans.mdx` line 148; `glossary.ts` line
43; the packet lines 3182 and 4669; Foundry `WOF.PositionTip.blind-spot`, `WOF.Tracker.posTip.
blind-spot`, `WOF.Tracker.board.blindSpotNote`.

**Problem.** Glossary misuse. "Behind the Titan" in particular now suggests a facing the rules deny.

**Play scenario.** A player reads the Foundry tooltip and asks which side of the Titan is "behind",
and the GM has no rule to answer with.

**Fix options.**
1. "Field" or "ground" for battlefield; "anchored to terrain in the Titan's zone" for behind.

### m7. YAML-to-YAML drift on OQ-203 and OQ-201

**Location.** `data/engagement/positions.yaml`, `moves`, `forced_step` (lines 362 to 375) against
`data/harm/effect-types.yaml`, `forced-move` (line 198) and Chapter 5 line 463;
`data/engagement/zones.yaml` line 13 (`decided: [OQ-200, OQ-201, OQ-202]`).

**Problem.** The provisional OQ-203 exception (no step toward Distant for a soldier free in a zone
with no body) is in `effect-types.yaml` and the chapter but not in `positions.yaml`'s own statement of
the forced step, which reads as always taking option 1. OQ-201 is Open (provisional), yet `zones.yaml`
lists it as decided.

**Play scenario.** A Foundry or simulator maintainer reading `positions.yaml` alone implements the
outward step for a soldier already out of reach.

**Fix options.**
1. Add the OQ-203 clause to `forced_step`; move OQ-201 to a `provisional` key.

### m8. Chapter 5 still calls the Stride a starting value and the first lever

**Location.** Chapter 5 line 833 (design note: "The Stride values are the simulator's starting
values, and the Stride is the first lever the retune reads").

**Problem.** Z1 made them measured values and found the Stride inert above 0. Section 5.13 (line 1346)
already says so; the design note contradicts it.

**Fix options.**
1. "The Stride values were measured by the zone retune (Z1): at every reference start a Stride is one
   zone long, so values above 0 read the same."

### m9. The worked example's kill omits steam

**Location.** Chapter 5 lines 1583 to 1588.

**Problem.** Mila and Jonas are both at Blind Spot when the Titan dies. Death step 3 scalds every
soldier On Body or at Blind Spot; the example lists relief, removal, detach, and the end, and skips
the steam rolls. The example was edited in this batch (the detach bullet), so it is the place a reader
learns the order.

**Fix options.**
1. Add "Steam: Mila and Jonas are at Blind Spot, so each rolls D6 on the steam table" between relief
   and removal.

### m10. Letting go lands "free" in `zones.yaml` and "Ground" everywhere else

**Location.** `data/engagement/zones.yaml`, `moves`, `letting_go` ("lands free in the same zone")
against `positions.yaml`, `moves`, `letting_go` and `falls_land` ("attachment ground") and Chapter 5
line 460.

**Problem.** Free covers Ground and Anchored; the contract file the simulator and Foundry read is
looser than the rule.

**Fix options.**
1. "lands with attachment ground in the same zone".

### m11. Leftover "Position step" wording where the YAML now says zones

**Location.** Chapter 1 line 375 (the Push example: "Oskar Wendt is at the same Position"); Chapter 3
line 737 (Nothing Left: "comrades within 1 Position step"); Foundry `WOF.Sheet.effect.stressGainNearby`
("within one Position step"); Chapter 3 design notes lines 491 and 496.

**Problem.** Readable through 16-11's mapping, but each now differs from its YAML
(`effect-types.yaml`, `stress-gain-nearby`: "in the soldier's zone or an adjacent zone").

**Fix options.**
1. "is in Mila's zone"; "comrades in your zone or an adjacent zone".

### m12. The entry zone with no soldier on the field

**Location.** `zones.yaml`, `entry_zone`; Chapter 5 line 1239.

**Problem.** "Farthest from the nearest soldier on the field" has no value when every soldier has
left and a returner keeps the fight open for a round, which is exactly when a Background clock can
fill at the end step. The order list then falls to "lowest-numbered" only by inference.

**Fix options.**
1. Add "with no soldier on the field, the lowest-numbered edge zone".

### m13. The retreat's termination sentence overstates what a Stride leaves alone

**Location.** `background-titans.yaml`, `retreat`, `termination`; Chapter 5 line 1267; packet line
3435: "A Stride ... changes no soldier's ring".

**Problem.** A Stride carries every soldier On Body or Grabbed, changing their ring. The bound still
holds, because a soldier's ring matters only once they are free and a Stride never moves a free
soldier, but the stated reason is false.

**Fix options.**
1. "A Stride never lengthens this: it frees a soldier at Blind Spot, carries only soldiers who are not
   yet free, and never moves a free soldier."

### m14. The site's Expedition tables say a Waypoint sets the Anchor Rating

**Location.** `site/src/lib/gm-expedition-tables.ts` lines 271 and 280;
`site/src/lib/expedition-tables.ts` lines 226 and 548.

**Problem.** 16-6 and ADR-0009 as amended: a Waypoint's kind names the field rating. Chapter 7 and
`site/src/content/rules/expeditions-and-downtime.mdx` were updated; these table notes were not.

**Fix options.**
1. "sets the field rating of a Titan Engagement on the Leg that leads to it".
