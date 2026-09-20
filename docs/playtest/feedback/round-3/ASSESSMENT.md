# Round 3 assessment: what each note asks for, what it costs, and what we recommend

Written 2026-09-20 against the tree at `claude/feedback-review-rule-changes-2485xv`. Each item states
what the rules and the system do today, with citations, then the recommendation, the files the change
would touch, the risk, and any question only the owner can answer. Nothing has been applied. The
consolidated change list is at the end.

Two framing notes before the items.

- **Items 1 and 2 are tuning-level and safe.** Item 1 in particular preserves the invariant the
  lethality targets rest on, for the reason given below. Both can ship in one batch.
- **Items 3 to 7 and 9 are Foundry-only.** They share one root cause: the system was built to apply
  consequences itself (ADR-0026) and it does that on whichever client happens to trigger the step,
  quietly, with a one-line note afterwards. Four of the owner's notes are four faces of that single
  design gap. Fixing it once fixes all four.
- **Item 8 is the large one** and is the only item that reopens settled design. It has its own file.

---

## 1. Health: drop the halving, crits cross off two boxes

### Today

`data/character/attributes.yaml` `derived_values.health`: `(strength + agility) / 2`, rounded up.
`data/harm/health.yaml` `health.boxes_crossed_off`: each untreated Critical Injury crosses off one box,
capped at Health. Current Health is Health minus crossed-off boxes minus Health lost to damage, and 0
current Health is Down (`data/harm/down.yaml`; ADR-0005 as amended 2026-09-14).

Buildable Health is 2 to 4 (Free Build caps attributes at 4; the lifepath allows 5, and 6 on a key
attribute). The reference builds are Health 4 (Rookie, Strength 4 Agility 3), 4 (Veteran), and 5
(Levi-grade), per ADR-0014.

### The proposal, and why it is safer than it looks

Health becomes `strength + agility` with no halving, so 4 to 8 buildable and 10 at the Levi-grade
ceiling. Damage values are unchanged. An untreated Critical Injury crosses off two boxes.

The important property, which is worth stating plainly because it is what makes this cheap: **the
number of untreated Critical Injuries that puts a soldier Down does not change.** Today that number
is `ceil((S+A)/2) / 1`. Under the proposal it is `(S+A) / 2`. For an even Strength plus Agility the two
are identical; for an odd total they are also identical, because the cap at Health still bites (Health
5, three crits, six boxes crossed capped to five, Down; today Health 3, three crits, Down).

That matters because Titan attacks bypass Health entirely and inflict Critical Injuries directly
(ADR-0005). So **Titan lethality inside a Titan Engagement is untouched by this change.** Every band and
target in ADR-0014 that is driven by Critical Injuries stays where it is. What changes is only the
weight of *damage*, which is falls, steam, corpse heat, human weapons, and damage a GM ruling names:
damage now needs roughly twice as many points to reach 0 Health. That is exactly the complaint.

We support this change. It is the cleanest possible version of "Health is too small".

### Consequences to accept, and one to decide

- **Damage-sourced Critical Injuries become rarer.** Damage that brings current Health to 0 inflicts
  one immediate Critical Injury (ADR-0005). With pools roughly doubled, falls and steam reach that
  point about half as often. Directionally intended, but it is the second-order effect and it should
  be measured rather than assumed.
- **Healing is unaffected.** `data/harm/healing.yaml` `each_day` restores *all* Health lost to damage
  when a day passes, so a bigger pool costs no extra recovery time. Only crossed-off boxes persist,
  and those scale with the same proportion. This was the main risk we checked for, and it is not there.
- **Skirmish gets materially less lethal, and this one is the owner's call.** The musket deals 4 damage
  (`data/skirmish/skirmish.yaml` weapons), which today drops a Rookie at Health 4 in one ball. At Health
  7 it does not, and no human weapon in the list can Down a soldier in one hit. "Keep all damage the
  same" as written produces that outcome. It may well be the right one, since the design says soldiers
  die to Titans, but it is a real change of feel in Chapter 7 and it should be chosen rather than
  inherited. Options: (a) keep every damage value as instructed and accept that bandits are now an
  attrition threat rather than a lethal one; (b) keep Titan-world damage as is and scale human weapon
  damage only, musket 4 to 7 or 8; (c) keep as is and revisit after the Skirmish is played. We
  recommend (a) for this batch with a measured report beside it, because it is what was asked and
  because the Skirmish has not been played yet.
- **Sheet layout.** A row of 4 to 10 boxes replaces a row of 2 to 4 on the printed sheet, the site
  sheet, and the Foundry actor sheet. At 10 boxes the row needs to wrap or shrink. Small work, but it
  is real work in three places.

### Files

`data/character/attributes.yaml` (the formula, `reported_squad`, `reported_squad_health_2`),
`data/harm/health.yaml` (`boxes_crossed_off`, `current`, and the restoring rules),
`data/harm/critical-injuries.yaml` (the box a Critical Injury crosses off, and treating one gives back
two), `data/harm/treat-injury.yaml`, `data/character/squadmates.yaml` (every template's health, now
recomputed from Strength plus Agility), ADR-0005 (a new amendment paragraph), ADR-0014 (the reference
builds' Health figures and the Health-dependent reported rows, now Health 4 to 8 rather than 2 to 6),
`docs/rules/02-character-creation.md` and `03-harm-and-mind.md`, the packet, the site sheet and
`foundry/src/rules/derived.ts` plus the actor sheet's box row.

### Risk

Low on the rules, low on the tuning, moderate only in the number of places that quote a Health number.

---

## 2. Steam at a Regeneration fill: remove it

### Today

`data/engagement/titan-harm.yaml` `steam.triggers` holds two: `kill` (a Titan's death, for soldiers On
Body or at Blind Spot) and `regeneration-fill` (a fill that moves a Body Part toward Intact, for
soldiers On Body). The second came in as decision 8-7.

### Recommendation

Take it. Remove the `regeneration-fill` trigger and the step that calls it in `regeneration.when_full`.
This is the cheapest change on the list and it was already written down as the first lever to pull if
a Critical Injuries band missed (`IMPLEMENTATION-PLAN.md`, round 1, lever 1). Removing it moves the
bands in the safe direction, and it stacks with item 1 in the same direction, which is one more reason
to measure the two together rather than separately.

One thing is lost worth naming: the Regeneration fill was the only rule that punished parking on a
Titan's body across rounds. After removal, nothing costs a soldier anything for staying On Body while
the clock fills. If that pressure turns out to be missed at the table, the replacement should be a Gas
or Stress cost rather than damage, since damage at every fill is what made this too sharp in the first
place. We do not recommend adding anything now. Remove it, play it, see if the absence is felt.

### Files

`data/engagement/titan-harm.yaml` (`steam.triggers`, `regeneration.when_full` step 4),
`data/harm/critical-injuries.yaml` (`types.burn.named_by` drops the fill),
`data/harm/health.yaml` (the damage `named_by` line), `docs/rules/05-titan-engagement.md` section 5.7,
the packet, `foundry/src/rules/engagement/titan-death.ts` and wherever the fill calls `rollSteam`,
`data/titans/tuning.yaml` (the "with steam" and "without steam" reported rows collapse to one case).

### Risk

Very low.

---

## 3. The GM must be able to do anything

### Today

The tracker is built so that a player asks and the GM's client decides: every change runs through
`checkTrackerRequest` (`foundry/src/rules/engagement/guard.ts`) and `performRequest`
(`foundry/src/tracker/engine.ts`). That part is right. The problem is that the *rules checks* are not
separated from the *permission checks*, so the GM's own client runs into the same blocks a player
does. `movePosition` returns `warn('move.notOneStep')` for the GM exactly as for a player; a Grab is
only ever written by `grab()` inside a landed Behavior Table card
(`foundry/src/tracker/results.ts`), so there is no path at all to say "this creature is Grabbed
because of what just happened in the fiction", which is precisely the case the owner hit.

### Recommendation

We agree with this one without reservation, and we would go further: it deserves an ADR, because it is
a standing principle and not a single fix. Proposed as ADR-0028, "automation assists the GM and never
blocks them", sitting beside ADR-0024 (the GM rules where the rules are silent) and amending ADR-0026
(consequences apply automatically) to say that automatic application is a default the GM can always
step over.

Concretely:

- **A GM override modifier on every tracker control.** Holding a modifier key, or a persistent "Direct
  Control" toggle in the tracker header, makes every cell menu offer *every* value rather than only the
  legal ones. Position cells offer all four Positions relative to every Titan and corpse, with no step
  check, no anchor check, no Grabbed check.
- **Direct state setters the rules do not otherwise expose**: set or clear Grabbed on any soldier for
  any Focus Titan, set or clear Pinned, set Momentum, set airborne, set the anchor rating mid-fight,
  set or clear a loudest flag, set an Opening, set or clear Attention, mark a turn spent or unspent,
  and move a soldier into or out of the engagement.
- **Every override is logged, not silent.** It writes the same note the rules path writes, marked as a
  GM ruling, and it goes through the same `Recorder` so Undo still works. That keeps ADR-0026's
  promise and keeps the table informed, which is the same thing item 4 is asking for.
- **Nothing is removed.** The legal path stays the default and stays first in every menu, so the
  system still teaches the rules. The override is the second section of the menu, visually distinct.

### Files

New `docs/adr/0028-*.md`; `foundry/src/tracker/engine.ts` (a `force` flag through `movePosition`,
`performRequest` and friends), `foundry/src/rules/engagement/guard.ts` (permission and rules checks
separated so the GM path skips only the rules ones), `foundry/src/tracker/view.ts` and
`components/Board.svelte` (the override section in each cell menu, the header toggle), new GM-only
setters in `foundry/src/tracker/engine.ts`, the language file, and the Foundry system's own docs.

### Risk

Low, and mostly a question of keeping the override visually separate so a player-facing table does not
drift into using it by habit.

---

## 4, 5 and 6. Harm and its rolls happen on the wrong client, and quietly

These are three symptoms of one gap, so they get one recommendation.

### Today

- **Fall and steam damage.** `foundry/src/tracker/harm.ts` rolls a bare `1d6` inline, applies the
  damage through the recorder, and adds one line to a note that is posted after the fact
  (`postNote`, `foundry/src/tracker/notes.ts`, which renders a single summary paragraph). Nobody is
  asked to do anything, and the "what is happening and to whom" the owner wants is compressed into
  half a sentence.
- **Critical Injuries.** `gainOn` (`foundry/src/tracker/results.ts`) rolls the location die and the 2d6
  on the GM's client and writes the item straight onto the actor. The player watches a line of text
  appear about their own soldier's broken arm.
- **The Flight roll.** `flight()` in `foundry/src/tracker/engine.ts` calls
  `rollAction(req.actor, 'fly', {})` on **whichever client called it**. Because a player's move request
  is proxied to the GM (`foundry/src/tracker/requests.ts`), and because the GM moves tokens themselves,
  the GM's client rolls the player's Fly. This is a straightforward bug, not a design choice: the
  intent in `positions.yaml` `moves.flight.rolled_as` is explicitly "a soldier's roll like any other",
  which means Circumstances, Stress Dice, Talents, Help, Push and Cover, all of which belong to the
  player's dialog.
- **Gas Rolls.** Same pattern at the round end.

The system already has the right pattern and does not use it here. A Titan attack is posted as a card
by the GM and each target answers from their own client with their own dodge card
(`foundry/src/dice/reactions.ts`). That is exactly the shape all of the above want.

### Recommendation

Build one mechanism, **the prompt card**, and route every one of these through it.

A prompt card is a chat card that names what is happening, why, and to whom, and carries a button that
only the named actor's owner (and the GM) can press. Pressing it opens the normal roll dialog or rolls
the fixed die, on that user's client, and writes the result back through the existing recorder so Undo
and the round-end checklist are unchanged.

- **Header and body say what is going on**, not just the result: "Titan A dies. Steam scalds everyone
  On Body or at Blind Spot", then a line per affected soldier with their current Health.
- **Two kinds.** A *fixed* prompt (steam, fall, the Critical Injury dice, the Gas Roll) has one button
  and no options, because those rolls take no Push, Help, or Stress Dice. An *action* prompt (the
  Flight) opens the full roll dialog.
- **Who is asked.** Rolls about a soldier go to that soldier's owner. Rolls about the world go to the
  GM. Per the owner's note the fall and steam card is a GM card listing everyone it affects, and each
  affected player rolls their own die from it, so one card carries several buttons.
- **The GM is never blocked.** Every prompt card has a GM "roll it for them" control, and a world
  setting for a timeout after which unanswered prompts auto-roll, so an absent player never stalls a
  fight. That timeout preserves ADR-0026's speed promise while making the default visible.
- **The Flight fix is inside this.** `flight()` stops rolling and posts a Flight prompt to the moving
  soldier's owner; the step applies when the card resolves, which is already how the rules read (the
  step happens whatever the roll gives, so the move is not gated on the answer, only the Momentum and
  the loudest flag are).

This is the single highest-value piece of Foundry work on the list. It is also the one that most
improves the table's understanding of the rules, because every automatic consequence becomes a thing
someone sees and touches.

### Files

New `foundry/src/dice/prompt.ts` (the card kind, its guard, its resolution) beside the existing
`card.ts`, `post.ts`, `proxy-guard.ts`; `foundry/src/tracker/harm.ts` (steam and fall through prompts),
`foundry/src/tracker/results.ts` (`gainOn`), `foundry/src/tracker/engine.ts` (`flight`, the round-end
Gas Rolls), `foundry/src/tracker/recorder.ts` (pending values that survive a prompt's round trip),
`foundry/src/dice/proxy.ts` (a prompt extension), the language file, the system settings menu (the
auto-roll timeout), and the styles.

### Risk

Moderate, and the risk is in the timing rather than the code: steam, a fall, and a Critical Injury
currently resolve inside one synchronous recorder transaction, and a prompt makes them asynchronous
with a player in the middle. The round-end checklist and Undo both need to tolerate a step that is
waiting on someone. That is the part to design carefully, and it is why this should be its own package
rather than a set of small edits.

---

## 7. Momentum, anchors and Openings on the tokens

### Today

`foundry/src/tracker/badges.ts` already draws per-Titan Position badges above each soldier token, with
the Titan's letter, its colour, hollow at Distant and ringed while Grabbed. That is the pattern and it
works; it simply does not cover the three values the owner names. Momentum lives on the actor
(`system.momentum`, capped by `momentumCap(snap.anchors)`), the anchor rating is one value for the whole
engagement (`combat.system.anchor`, and `anchors` as the Momentum cap), and Openings live on the Titan
actor.

### Recommendation

Agree, and it is a small piece of work on an existing foundation.

- **Momentum**: a row of pips under the soldier's badges, filled to current Momentum and outlined to
  the cap, so the cap is legible at a glance and the terrain's contribution is visible without opening
  the tracker.
- **Anchors**: because the anchor rating is a property of the engagement rather than of a soldier, it
  belongs in the scene, not on every token. We recommend the tracker HUD plus a small scene-corner
  plate naming the rating and its anchor count, and the Momentum pip track carrying the cap as above.
  If item 8 lands, the anchor rating becomes per zone and moves onto the zone tile, which is a better
  home for it, so this piece should be built in a way that survives that move.
- **Openings**: a badge on the Titan token, one mark per Opening, in the Titan's own colour, beside a
  Broken or Wounded Body Part readout if that is cheap to add at the same time. Openings are the single
  most decision-relevant Titan state a player can see, and they are currently invisible on the canvas.

### Files

`foundry/src/tracker/badges.ts` (a second badge row and the Titan variant), `foundry/src/tracker/hud.ts`
and `components/Hud.svelte` (the anchor plate), `foundry/src/tracker/state.svelte.ts` and `view.ts`
(the values flowing through to the badge layer), the icons in `foundry/assets`.

### Risk

Low.

---

## 8 and 10. Relative Positions to zones

The full design is in `zone-combat-design.md`. The summary of our position:

**We agree with the diagnosis, including the part that was not said.** The four Positions are relative
to each Focus Titan independently (`data/engagement/positions.yaml` `relative_to`), which means a
soldier's location is not one fact but a set of facts, one per Titan and per corpse, reconciled by a
`close_rule` and a `comparison` block that exist only to paper over the fact that there is no shared
space. "2x far" is not expressible because Distant is the terminal value in every direction. And in
Foundry the tokens sit at real places on a real canvas that the rules do not read at all, so the table
sees two positions for each soldier, only one of which matters. That gap is a better explanation of
"positioning is confusing" than the rules text alone.

**We agree with the proposed direction**, including the attachment idea (flying, On Body, anchored,
Blind Spot as conditions rather than places), which is the part of the owner's note that does the most
work. It is what makes a shared map possible without losing what the Positions encoded.

**We recommend the smaller of the two possible versions.** Zones become the substrate; the four
Position names stay as values *derived* from zone geometry plus conditions. Distant becomes "not in the
Titan's zone", In Reach becomes "in the Titan's zone, on the ground", On Body and Blind Spot become
attachment conditions. Every Behavior Table Position requirement, every Attention Ladder rung, and
every "same Position or one step apart" test then keeps working unchanged, while the map supplies
multi-zone distance, per-zone terrain, and the flying-over-versus-around choice the owner wants. The
alternative, replacing Positions outright, is cleaner on paper and reopens roughly thirty files plus a
full retune.

**This is the one item that cannot ship with the others.** It needs its own batch, its own simulator
rerun, and the Foundry display of item 9 to land with it rather than after it.

---

## 9. The isometric hex display

Agreed, and it should be treated as the same package as item 8 rather than a separate visual layer,
because the display is what makes the zones legible and the rules change is what gives the display
something true to draw. `foundry/src/tracker/components/Board.svelte` already renders the engagement as
a soldier-by-Titan matrix in a ledger spread; the zone board replaces the left page of that spread with
a hex field and keeps the right page (the Titan blocks and the clocks) as it is. Scope and the
interaction model are in `zone-combat-design.md`, section 6.

---

## Consolidated change list

Grouped into the batches we would ship them in.

### Batch A: harm numbers (rules, site, Foundry, packet)

| # | Change | Where |
|---|---|---|
| A1 | Health formula becomes Strength plus Agility, no halving | `data/character/attributes.yaml`, ADR-0005, ADR-0014, Chapters 2 and 3, packet, site, `foundry/src/rules/derived.ts` |
| A2 | An untreated Critical Injury crosses off two Health boxes; treating one gives two back | `data/harm/health.yaml`, `critical-injuries.yaml`, `treat-injury.yaml`, ADR-0005, Chapter 3, packet |
| A3 | Every damage value unchanged; Skirmish lethality re-measured and reported | `data/skirmish/*` untouched, `data/titans/tuning.yaml` reported rows |
| A4 | Squadmate template Health recomputed | `data/character/squadmates.yaml` |
| A5 | Health box row re-laid out for up to 10 boxes | printed sheet, site sheet, Foundry actor sheet |
| A6 | Steam at a Regeneration fill removed | `data/engagement/titan-harm.yaml`, `critical-injuries.yaml`, Chapter 5, packet, Foundry |
| A7 | Simulator rerun and the report, with the Skirmish probe beside it | `tools/sim`, `docs/reviews/simulator-report.md`, `data/titans/tuning.yaml` |

### Batch B: the GM is never blocked (Foundry)

| # | Change | Where |
|---|---|---|
| B1 | ADR-0028: automation assists and never blocks; ADR-0026 amended | `docs/adr/` |
| B2 | Rules checks separated from permission checks | `foundry/src/rules/engagement/guard.ts`, `tracker/engine.ts` |
| B3 | Direct Control toggle: every cell menu offers every value | `tracker/view.ts`, `components/Board.svelte` |
| B4 | GM setters for Grabbed, Pinned, Momentum, airborne, anchor, flags, Openings, Attention, turn spent, in or out of the fight | `tracker/engine.ts` |
| B5 | Every override writes a note marked as a ruling and is undoable | `tracker/notes.ts`, `tracker/recorder.ts` |

### Batch C: the prompt card (Foundry)

| # | Change | Where |
|---|---|---|
| C1 | The prompt card kind, its guard, and its resolution | new `foundry/src/dice/prompt.ts`, `proxy.ts`, `proxy-guard.ts` |
| C2 | Steam and falls become a GM card naming the cause and everyone affected, each rolling their own die | `tracker/harm.ts` |
| C3 | Critical Injuries roll on the injured player's client | `tracker/results.ts` |
| C4 | Gas Rolls prompt their owner at the round end | `tracker/engine.ts`, `rules/engagement/round.ts` |
| C5 | Flight prompts the moving soldier's owner, never the GM: the bug fix | `tracker/engine.ts` |
| C6 | GM "roll for them" on every prompt, plus an auto-roll timeout setting | `settings-menu.ts` |
| C7 | The recorder and the round-end checklist tolerate a step waiting on a player | `tracker/recorder.ts`, `tracker/combat.ts` |

### Batch D: token readouts (Foundry)

| # | Change | Where |
|---|---|---|
| D1 | Momentum pips on soldier tokens, filled to current and outlined to the cap | `tracker/badges.ts` |
| D2 | Anchor rating and anchor count in the HUD and a scene plate | `tracker/hud.ts`, `components/Hud.svelte` |
| D3 | Openings badge on Titan tokens | `tracker/badges.ts` |

### Batch E: zone combat (rules, site, Foundry) - its own batch, see `zone-combat-design.md`

| # | Change | Where |
|---|---|---|
| E1 | ADR for zones as the substrate, Positions derived, attachments as conditions | `docs/adr/`, amends ADR-0009 and ADR-0010 |
| E2 | The zone model: a hex field, per-zone terrain and anchor rating, occupants and effects | new `data/engagement/zones.yaml` |
| E3 | Positions derived from zone plus attachment; the close rule and the comparison block retired | `data/engagement/positions.yaml` |
| E4 | Moves become zone steps, with the flying-over-terrain choice | `data/engagement/anchor-ratings.yaml`, `positions.yaml` |
| E5 | Every rule that reads a Position re-checked against the derivation | falls, grab, retreat, carrying, attention, engagement-flow, engagement-end |
| E6 | The isometric hex board | `foundry/src/tracker/components/Board.svelte` and a new zone layer |
| E7 | Retune and rerun: step counts change the tempo of closing to the Nape | `tools/sim`, ADR-0014 |

---

## Questions only the owner can answer

1. **Skirmish lethality (item 1).** With damage values unchanged, no human weapon can Down a soldier in
   one hit any more. Accept, scale human weapon damage, or decide after the Skirmish has been played?
2. **Health ceiling (item 1).** Strength plus Agility gives 4 to 8 buildable and 10 at the Levi-grade
   ceiling. Is a ten-box row acceptable on the sheet, or should Health cap at 8?
3. **The pressure removed with the fill steam (item 2).** Leave nothing in its place for now, as we
   recommend, or add a Gas or Stress cost for staying On Body while the clock fills?
4. **Prompt timeout (items 4 to 6).** How long should an unanswered prompt wait before the system rolls
   it, and should the default be "wait forever" at a live table?
5. **Zones, the size of the step (item 8).** The smaller version keeps the four Position names as
   derived values and is roughly one batch; the full version replaces them and is a redesign with a
   retune. We recommend the smaller. Confirm?
6. **Zone count and shape (item 8).** Our proposal is a small field of 7 to 19 hexes sized to the fight
   rather than a large map. Section 2 of the design file has the options.
7. **Sequencing.** Batches A to D are independent of E and could be at the table within one cycle.
   Should E start in parallel, or after A to D have been played?
