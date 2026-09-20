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

## 1. Health: 2 plus the current formula

**Owner's revision, 2026-09-20:** not `strength + agility`, but `2 + (strength + agility) / 2` rounded
up. Everything else as proposed: an untreated Critical Injury crosses off two boxes, every damage
value unchanged.

### What it gives

Health becomes 4 to 6 buildable (Free Build), 6 for both the Rookie and the Veteran reference builds,
7 for the Levi-grade, and 8 at the lifepath ceiling. Damage tolerance rises by a flat 2, which is a
100% increase for the most fragile soldier and 50% for a Rookie. That is a real and legible buffer, and
the numbers stay small enough to print as a single row of boxes. On the damage axis this does exactly
what was asked.

### What it costs, and this one matters

The version we assessed first (`strength + agility`, crits at two boxes) had one property that made it
free: the number of untreated Critical Injuries that puts a soldier Down did not change for any build.
**The `+2` version does not have that property.** With crits crossing two boxes, the count is
`ceil(Health / 2)`, and adding a flat 2 to a halved value does not track it.

| Strength + Agility | Health today | Crits to Down today | Health at +2 | Crits to Down at +2 | Damage to Down today | at +2 |
|---|---|---|---|---|---|---|
| 4 | 2 | 2 | 4 | 2 | 2 | 4 |
| 5 or 6 | 3 | 3 | 5 | 3 | 3 | 5 |
| 7 or 8 | 4 | **4** | 6 | **3** | 4 | 6 |
| 9 or 10 | 5 | **5** | 7 | **4** | 5 | 7 |
| 11 | 6 | **6** | 8 | **4** | 6 | 8 |

Read the bold rows. **Every build at today's Health 4 or above loses one Critical Injury of
tolerance.** That covers the Rookie (Strength 4, Agility 3), the Veteran, the Levi-grade, and most Free
Builds. A Rookie today goes Down on the fourth untreated Critical Injury; under this formula, the
third.

Since Titan attacks bypass Health and inflict Critical Injuries directly (ADR-0005), that is a **25%
increase in Titan lethality for the reference Squad**, on the axis all the lethality bands are measured
against. Two knock-on effects:

- The simulator rerun stops being a check and becomes a **retune**. Every Critical Injury band, every
  death band, and every bar limit in ADR-0014 moves.
- It also **compresses the spread**. Crits to Down runs 2 to 6 today and 2 to 4 under this formula, so
  buying Strength and Agility buys noticeably less survivability than it does now.

### Our recommendation: take it anyway, knowingly, and measure it

The direction is not wrong. Decision 7-12 (OQ-140) records a lethality target **in waiting** that the
owner has already chosen: the default Squad should lose a PC about every 8 typical fights, roughly
0.125 deaths a fight, against the 0.058 measured today. Nothing found so far reaches that by dice. A
formula that raises Titan lethality about 25% for the builds actually in play is a step toward a target
the owner already wants, arriving as a side effect of a change made for a different reason.

So: **take the `+2` formula as instructed.** Treat the simulator run as a retune rather than a check,
and read the Medium death band first, since it sits at 0.058 against a cap of 0.06 and this change
pushes it up.

If the band overshoots and the owner does not want the lethality yet, there is one clean lever that
needs no further design: **Health = 2 x today's Health** (that is, Strength plus Agility rounded up to
an even number: 4, 6, 8, 10). The right-hand columns of the table above show it restores the old crits
to Down at every total exactly, while still halving damage's weight. It is the same change with the
numbers moved two steps, so it can be swapped in after the run without reopening anything.

### Consequences that hold either way

- **Healing is unaffected.** `data/harm/healing.yaml` `each_day` restores all Health lost to damage
  when a day passes, so a bigger pool costs no extra recovery time. Only crossed-off boxes persist.
- **Skirmish gets less lethal, and it is still the owner's call.** The musket deals 4 damage
  (`data/skirmish/skirmish.yaml`), tuned against Health 4. At Health 6 no human weapon in the list can
  Down a soldier in one hit. Options unchanged from the first pass: accept it, scale human weapon
  damage, or decide after the Skirmish has been played. Note this one cuts against the lethality
  direction of the Health change itself, so the two should be read together in the report.
- **Damage-sourced Critical Injuries become rarer**, since damage reaches 0 Health less often.
- **Sheet layout.** A row of 4 to 8 boxes. Easier than the 4 to 10 of the first proposal, but still a
  change in three places.

### Files

`data/character/attributes.yaml` (the formula, `reported_squad`, `reported_squad_health_2`),
`data/harm/health.yaml` (`boxes_crossed_off`, `current`, restoring),
`data/harm/critical-injuries.yaml` and `treat-injury.yaml` (two boxes crossed, two given back),
`data/character/squadmates.yaml` (template Health recomputed), ADR-0005 (an amendment),
ADR-0014 (reference build Health, the Health-dependent reported rows, and the retune),
`docs/rules/02-character-creation.md` and `03-harm-and-mind.md`, the packet, the site sheet,
`foundry/src/rules/derived.ts` and the actor sheet's box row.

### Risk

Low on the rules. **Moderate on the tuning**, which is new since the first pass: this is now a retune
of the lethality bands rather than a check of them.

---

## 2. Steam at a Regeneration fill: keep it, make it gentler

**Owner's revision, 2026-09-20:** keep the trigger, reduce the severity. The owner also suspects the
session's steam was their own error, because the soldiers were all On Body.

### What actually happened

Worth saying plainly: **the rule fired correctly, and it was not a GM error.** The fill trigger names
"every soldier who holds On Body relative to the Titan"
(`data/engagement/titan-harm.yaml` `steam.triggers.regeneration-fill`). Blind Spot is deliberately not
in that list. So the Nape strikers were never exposed to it; only soldiers who had climbed onto the
body were, and they took it as written.

That means the design intent is already the right one: **fill steam is a tax on climbing the body, not
on attacking the Nape.** What went wrong at the table was not the rule but the visibility of who was
where, which is item 11 below, and the silence with which it applied, which is item 4. Both are being
fixed. There is a good chance the fill steam reads completely differently once a card says "the Titan's
arm knits back together. Everyone on its body is scalded" and the board shows who that is.

### Recommendation

Reduce it, and reduce it on the table rather than the trigger, so the rule stays one sentence.

| Roll | Kill steam (unchanged) | Fill steam today | Fill steam proposed |
|---|---|---|---|
| 1 to 3 | 0 | 0 | 0 |
| 4 | 1 | 1 | 0 |
| 5 | 1 | 1 | 1 |
| 6 | 2 | 2 | 1 |

Average damage per fill drops from 0.67 to 0.33, and the two-point spike disappears, so a fill can
never take a soldier from two boxes to Down. Combined with the Health change, the fill's weight against
a Rookie's pool falls from one sixth of their Health to one eighteenth, which is a texture rather than a
threat. The kill steam keeps its current table: a Titan's death should still be dangerous to be standing
on.

Implementation: `steam` gains a `rows` set per trigger rather than one shared table, which is a small
schema change and makes future tuning of either one independent.

### Files

`data/engagement/titan-harm.yaml` (`steam.table` becomes per trigger), `docs/rules/05-titan-engagement.md`
section 5.7, the packet, `foundry/src/rules/engagement/harm-rolls.ts` and `foundry/src/tracker/harm.ts`
(`steamDamage` takes the trigger), `data/titans/tuning.yaml` (the reported rows).

### Risk

Very low.

---

## 11. Where a soldier is after a Nape strike, and what changes a Position

Raised by the owner alongside item 2, and we think it is the most valuable small item on the list,
because it is the thing that made item 2 look like a bug.

### The rules answer, which is unambiguous but nowhere stated in one place

**A Nape strike does not move you. The striker is still in the Blind Spot afterwards.**

`data/character/action-catalog.yaml` `nape-strike.requirements` ends with "Making the strike counts as
hooking into the Titan". That sentence sets the `hooked-by-strike` flag
(`data/engagement/attention.yaml`), which exists for exactly one purpose: the Attention Ladder's first
rung is `hooked-into-its-body`, and the flag makes a striker meet it so a Nape striker who falls short
draws the Titan onto themselves rather than onto a comrade. It is an Attention fact. It is not a
Position change, and nothing in `positions.yaml` reads it.

More generally, and this is the principle that should be written down:

> **An action never changes a Position.** Only the soldier's own move changes it, plus the closed list
> of rules that name a change.

The complete list of what changes a Position today, gathered from `positions.yaml`, `grab.yaml`,
`titan-harm.yaml`, `falls.yaml` and `carrying.yaml`:

| What | Effect |
|---|---|
| The soldier's own move | One step, or a mount, dismount, or leave. An ODM move is a Flight |
| Letting go | Instead of a move: fall, then In Reach |
| Any fall | From On Body or Blind Spot to In Reach relative to the fall's reference Titan |
| A Fear Roll's forced move | One step at the start of the next turn |
| A Grab landing | The Grabbed soldier holds On Body relative to the holding Titan |
| Being freed from a Grab | In Reach, with a fall first if they had been lifted |
| A Behavior Table knock loose | Close to In Reach, with a fall |
| The close rule | Becoming On Body or Blind Spot of one Titan sets the other Titan's close Position to In Reach |
| A Titan becoming a Focus Titan | Everyone holds Distant relative to it |
| A Focus Titan dying | Positions become relative to its corpse; On Body and Blind Spot read In Reach |
| Being carried | The carried soldier moves with the carrier |
| Starting placement, leaving, returning, a retreat's forced moves | As each rule states |

And what does **not** change a Position, which is the half nobody can see: the Nape strike, the Body
Part strike, Break Attention, Draw Attention, Read, Heave, Treat Injury, Rally, and every other action
in the Catalog.

### Recommendation

1. **State the principle in the data.** A `changes_to_position` block in
   `data/engagement/positions.yaml` holding the table above as a closed list, with the one-line
   principle at the top. Nothing about the rules changes; the rule becomes findable.
2. **Say it where the Nape strike is defined.** One sentence on the Catalog entry and in Chapter 5:
   the striker stays in the Blind Spot, and hooking in is an Attention fact only.
3. **A "where am I now" table in the packet and the quick reference**, built from the same block.
4. **Make it visible in Foundry.** The tracker note after a Nape strike should say the striker is still
   at Blind Spot and now counts as hooked in; `hooked-by-strike` should show as its own badge rather
   than being invisible; and the Position cell should never look like it might have changed. Under item
   8 this gets much better still, because the board draws the striker behind the Titan and the climber
   on it, and the difference stops being a word.

### Files

`data/engagement/positions.yaml` (the new block), `data/character/action-catalog.yaml` (one sentence),
`docs/rules/05-titan-engagement.md` sections 5.2 and 5.5, the packet and the quick reference, the site,
`foundry/src/tracker/badges.ts` and the tracker notes.

### Risk

None. This is documentation of rules that already work, plus one badge.

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

## 9. The isometric hex display, on the canvas, as the hero feature

**Owner's direction, 2026-09-20:** it goes on the Foundry canvas directly, not in a panel, and it has
to look like a game.

That settles the open question we had flagged, and it settles it the more ambitious way. It also makes
items 8 and 9 one piece of work rather than two, because a canvas board is only truthful if the rules
underneath it have a shared space to draw. Section 6 of `zone-combat-design.md` is rewritten around
this: a native Foundry hexagonal grid where one hex is one zone, painted terrain tiles, a vertical
layer that draws the attachment (on the Titan, in its blind spot, airborne on a tether, in its hand),
Flights that animate along their route instead of teleporting, and drag-to-zone movement with the legal
destinations and their Momentum costs lit up.

One thing this touches that the other items do not: **ADR-0027 locks the system's look as flat and
paper, with WebGL scoped to two small vitals widgets.** A canvas hero feature is not a contradiction of
that, because the canvas is a different surface from the sheet, but it does need the ADR amended to say
so and to set the canvas its own budget. The art language should stay the one that is already locked,
painted plates and inked figures in the paper palette, so the board reads as the same product rather
than a different game bolted on.

---

## Consolidated change list

Grouped into the batches we would ship them in.

### Batch A: harm numbers (rules, site, Foundry, packet)

| # | Change | Where |
|---|---|---|
| A1 | Health formula becomes `2 + (strength + agility) / 2`, rounded up | `data/character/attributes.yaml`, ADR-0005, ADR-0014, Chapters 2 and 3, packet, site, `foundry/src/rules/derived.ts` |
| A2 | An untreated Critical Injury crosses off two Health boxes; treating one gives two back | `data/harm/health.yaml`, `critical-injuries.yaml`, `treat-injury.yaml`, ADR-0005, Chapter 3, packet |
| A3 | Every damage value unchanged; Skirmish lethality re-measured and reported | `data/skirmish/*` untouched, `data/titans/tuning.yaml` reported rows |
| A4 | Squadmate template Health recomputed | `data/character/squadmates.yaml` |
| A5 | Health box row re-laid out for up to 8 boxes | printed sheet, site sheet, Foundry actor sheet |
| A6 | Steam keeps both triggers; the fill gets its own gentler table (0/0/0/0/1/1) | `data/engagement/titan-harm.yaml`, Chapter 5, packet, `foundry/src/rules/engagement/harm-rolls.ts` |
| A7 | The closed list of what changes a Position, and the Nape strike sentence | `data/engagement/positions.yaml`, `action-catalog.yaml`, Chapter 5, packet, quick reference, site |
| A8 | **Retune**, not a check: every Critical Injury and death band re-measured, Medium deaths read first | `tools/sim`, `docs/reviews/simulator-report.md`, `data/titans/tuning.yaml`, ADR-0014 |

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

## Questions still open

Answered on 2026-09-20: the Health formula (`+2`), steam kept and softened, the Position clarity work,
and the canvas board. What is left:

1. **Skirmish lethality.** With damage values unchanged, no human weapon can Down a soldier in one hit
   any more. Accept, scale human weapon damage, or decide after the Skirmish has been played? Our
   recommendation is to accept for this batch and read it in the report.
2. **The lethality retune.** The `+2` formula raises Titan lethality about 25% for the reference builds
   and moves the Medium death band, which sits at 0.058 against a cap of 0.06. If it overshoots, do we
   take the step toward the OQ-140 target in waiting and re-cut the band, or swap in `Health = 2 x
   today's Health`, which restores the old crits to Down exactly?
3. **Prompt timeout.** How long should an unanswered prompt card wait before the system rolls it, and
   should the default be "wait forever" at a live table?
4. **Zones, the size of the step.** The smaller version keeps the four Position names as values derived
   from zone plus attachment and is roughly one batch; the full version replaces them and is a redesign
   with its own retune. We recommend the smaller. Confirm?
5. **Field size.** Our proposal is 13 hexes as the default, 7 for a corridor fight and 19 for a set
   piece. Confirm, or pick another default?
6. **Titan reach and Size Class.** Does a Large Titan threaten adjacent zones, or does Size Class only
   govern how far it moves? We lean on the simple version first.
7. **Art budget for the board.** The canvas board needs a terrain tile set, Titan figures at three Size
   Classes, and soldier pieces, all in the locked style. That is a real art batch and it gates the hero
   feature. Confirm it goes in the same cycle?
8. **Sequencing.** Batches A to D could be at the table within one cycle. Does E start in parallel, or
   after A to D have been played?
