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

## 1. Health: add 2, and change nothing else

**Owner's final form, 2026-09-20:** Health = `2 + (strength + agility) / 2` rounded up. An untreated
Critical Injury crosses off **one** box, exactly as today. Every damage value unchanged.

### This is the smallest version of the change that exists

One line of the ruleset moves: the formula in `data/character/attributes.yaml`. `boxes_crossed_off`,
Treat Injury, healing, the damage procedure and ADR-0005's Health paragraph are all untouched. Nothing
new has to be explained at the table: every soldier simply has two more boxes.

| Strength + Agility | Health today | Health new | Untreated crits to Down | Damage to Down |
|---|---|---|---|---|
| 4 | 2 | 4 | 2 to **4** | 2 to **4** |
| 5 or 6 | 3 | 5 | 3 to **5** | 3 to **5** |
| 7 or 8 (Rookie, Veteran) | 4 | 6 | 4 to **6** | 4 to **6** |
| 9 or 10 (Levi-grade) | 5 | 7 | 5 to **7** | 5 to **7** |
| 11 | 6 | 8 | 6 to **8** | 6 to **8** |

Both axes soften by a flat 2.

### What it costs, stated once and then left alone

This is a **large reduction in Titan lethality**, and it should be said plainly so it is a choice rather
than a surprise. Titan attacks bypass Health and inflict Critical Injuries directly (ADR-0005), so two
extra boxes are two extra Titan attacks survived: 50% more for a Rookie, 100% more for the most fragile
build. Every Critical Injury band and death band in ADR-0014 falls, and it moves **away** from the
lethality target held in waiting under 7-12 (OQ-140), which wants roughly 0.125 PC deaths a fight
against the 0.058 measured today.

**We still recommend taking it**, for a reason that outranks the target: the target was set before
anyone had played, and the first session said soldiers felt too fragile. Play beats projection.

What follows from that is a recommendation about the retune rather than about Health. **When lethality
is put back, put it on the Titans, not on Health.** The levers are the Attack Dice pools (already the
tuned value, keyed at 3 dice per former Severity point), Nape Depth, and Tempo. Keeping Health as a
stable, generous, player-facing number and making the monsters carry the danger is the healthier split
in any case: dying because the thing is strong reads better than dying because you had three boxes.

Two smaller effects, for the record:

- **The spread compresses toward survivability.** The most fragile build doubles its tolerance while
  the Levi-grade gains 40%, so Strength and Agility buy relatively less than they do now.
- **Damage-sourced Critical Injuries get rarer**, since damage reaches 0 Health less often.

### Still open

**Skirmish.** The musket deals 4 damage against a Rookie's new pool of 6, so no human weapon in the
list can Down a soldier in one hit. Accept it, scale human weapon damage, or decide after the Skirmish
has been played. Unchanged from the first pass, and now the only question left on this item.

### Files

`data/character/attributes.yaml` (the formula, `reported_squad`, `reported_squad_health_2`),
`data/character/squadmates.yaml` (template Health recomputed), ADR-0005 (a one-paragraph amendment),
ADR-0014 (the reference build Health figures and the Health-dependent reported rows),
`docs/rules/02-character-creation.md` and `03-harm-and-mind.md` (every quoted Health range), the packet,
the site sheet, `foundry/src/rules/derived.ts`, and the Health box row on all three sheets, now 4 to 8
boxes.

### Risk

Lowest possible on the rules, one line. **Moderate on the tuning**: a retune of every lethality band,
downward.

---

## 2. Steam: leave it exactly as it is

**Owner's decision, 2026-09-20:** keep the current steam, both triggers and the current table. The
frustration was that the table did not know the rule, and a 6 came up.

We agree, and we would have argued for this once the diagnosis was clear. Three reasons:

1. **The rule was working.** The fill trigger names On Body only, so the Nape strikers were never
   exposed; the soldiers who were scalded had climbed onto the body, which is what the rule taxes.
2. **The Health change already softens it.** Against a Rookie's new pool of 6, the 6-face two-damage
   result is a third of their Health rather than half, and the average fill costs 0.67 against 6 rather
   than against 4. The number moved without touching the table.
3. **The real fix is information, not arithmetic.** A card that says "the Titan's arm knits back
   together. Everyone on its body is scalded", with the roll made by the players it affects (item 4),
   and a board that shows who is on the body and who is behind it (item 11), turns an unexplained
   two points of damage into a consequence the table saw coming.

If it still bites after those two land, the gentler fill table we drafted is in the history and can be
dropped in without reopening anything.

### Files

None. A6 is withdrawn from batch A.

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

## 9. The engagement board, as the hero feature

**Owner, 2026-09-20: on the Foundry canvas directly, a hero feature, and it has to look like a game.
Then, on the second pass: canvas or custom UI is our call, and Codex will generate the art.**

**Our call: a custom board that takes over the canvas area during a Titan Engagement.** Not Foundry's
token layer, not a separate window. Outside an engagement Foundry behaves exactly as it does today.

The short reason: **Foundry's canvas has no vertical axis, and the vertical axis is this game.** On
Body, Blind Spot, airborne on a tether, Grabbed in a hand, Pinned under a corpse are the most important
facts on the screen, and a token on a 2D grid cannot express any of them. Meanwhile nothing the canvas
is good at is wanted here: zones are 13 discrete cells, so continuous positioning, walls and vision are
mostly things we would switch off. And the objection that first pushed us toward the canvas, that
tokens standing on a map would contradict the rules, is answered better by replacement than adoption:
during an engagement there is exactly one picture of the fight, because the other one is not on screen.

It is built in PIXI, which ships inside Foundry and which the system already uses for token badges, and
it renders from the same snapshot the tracker reads, so it is a renderer over the existing engine
rather than a second source of truth. Full detail, the art list for Codex, and the two set pieces (the
Flight arc and the Titan's Stride) are in section 7 of `zone-combat-design.md`.

One thing this touches: **ADR-0027 locks the look as flat and paper, with WebGL scoped to two small
vitals widgets.** The board is a new surface and needs the ADR amended to give it its own budget, with
the art held to the locked language so it reads as the same product.

---

## 11. Positions made clear: Blind Spot, On Body, and what moves you

The owner's questions, answered in order, then the fix. This turned out to be the most valuable item on
the list, because every one of these answers is correct in the rules today and findable nowhere.

### "So they stay in the Blind Spot, then the Attention Ladder focuses on them. What is their status?"

**Their Position does not change. They are still at Blind Spot.** Attention and Position are two
different facts about a soldier and neither one moves the other.

What changed is that they now hold the Titan's Attention, and that has one sharp consequence:

> A Nape strike requires that the soldier holds Blind Spot **and does not hold the struck Titan's
> Attention** (`data/character/action-catalog.yaml`, `nape-strike.requirements`; ADR-0010).

So the striker who draws Attention onto themselves is standing in exactly the right place and **cannot
strike again** until the Attention moves. That is not a bug; it is the engine of the whole game. Getting
it off them needs a comrade to Draw Attention, or a Break Attention roll with a decoy. This is what
ADR-0010 means when it says teamwork comes from Titan Attention.

The mechanism that put Attention on them is the `hooked-by-strike` flag. Making a Nape strike "counts
as hooking into the Titan", which makes the striker meet the Attention Ladder's first rung
(`hooked-into-its-body`), so a striker who falls short of the Nape Depth pulls the Titan onto themselves
instead of onto a comrade. It is an Attention fact only. Nothing in `positions.yaml` reads it.

**Their full status after a failed strike: Blind Spot, holding Attention, flagged as hooked in, locked
out of the Nape strike until Attention moves, and the target of the Titan's next card.**

### "On Body is literally on the body, right?"

Yes. On Body is hooked into or standing on the Titan's body, anywhere but the Nape.

**And here is the trap: Blind Spot is not on the Titan at all.** A soldier at Blind Spot is anchored to
*terrain*, a tree or a roof, out of the Titan's sight with its Nape within reach. They are not touching
it. The name sounds like a place on the monster and it is a place in the world behind the monster.

We think this single misreading explains most of the confusion, including the steam incident: if you
believe Blind Spot is a spot on the body, then "steam hits everyone On Body" sounds like it should hit
the Nape strikers, and it does not.

Everything follows from that one fact:

- Steam at a Regeneration fill hits On Body and not Blind Spot, because Blind Spot is not on it.
- The Urban terrain trait says a Blind Spot soldier "is anchored to a roof and is not airborne, so a Jam
  does not drop them". They are on a roof.
- Under zones (item 8) a Titan that strides away **leaves a Blind Spot soldier behind**, because they
  were never attached to it, while an On Body soldier travels with it.

### "Is it a tier, In Reach then On Body then Blind Spot, or do they branch?"

**Both, depending on the terrain.** This is the honest answer and it is stated nowhere: the shape of the
Position map is a property of the Anchor Rating, and the rows are buried in
`data/engagement/anchor-ratings.yaml`.

**Open** (0 anchors). There is nothing to anchor to, so the Blind Spot does not exist while the Titan
stands. You cannot Nape strike a standing Titan on a plain:

```
Distant --- In Reach --- On Body
```

**Sparse** (1 anchor). One good tree. A chain: you reach the Nape by way of the body.

```
Distant --- In Reach --- On Body --- Blind Spot
```

**Wooded, Urban, Giant Forest** (2 to 3 anchors). A branch: from In Reach you may go onto the body
**or** straight to the Blind Spot, and you can move between the two.

```
                      /--- On Body ---\
Distant --- In Reach -                  - (joined)
                      \--- Blind Spot -/
```

So the answer to "can a character go from In Reach to Blind Spot directly without going On Body first?"
is **yes in Wooded, Urban and Giant Forest, no in Sparse, and there is no Blind Spot at all in Open.**
A grounded Titan changes this again: every step among In Reach, On Body and Blind Spot can then be made
on foot, and at the Open rating a grounded body finally joins On Body to Blind Spot.

That is a real rule doing real work. Terrain decides whether you can get behind the thing, which is why
the Corps fights in forests. It has simply never been drawn.

### What changes a Position

The closed list, and the principle that should head it:

> **An action never changes a Position.** Only the soldier's own move, plus the rules named here.

| What | Effect |
|---|---|
| The soldier's own move | One step, or a mount, dismount, or leave. An ODM move is a Flight |
| Letting go | Instead of a move: a fall, then In Reach |
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

Not on the list, and this is the half nobody can see: the Nape strike, the Body Part strike, Break
Attention, Draw Attention, Read, Heave, Treat Injury, Rally, and every other action in the Catalog.
None of them moves you.

### The fix

1. **A `changes_to_position` block** in `data/engagement/positions.yaml` holding the table above as a
   closed list, with the principle at its head.
2. **Say what Blind Spot is every time it is introduced.** "Anchored to terrain behind the Titan, not
   on it." One clause, in the Position list, in Chapter 5, in the packet, and in the Foundry tooltip.
3. **Draw the three maps.** The Open, Sparse and branching diagrams above belong in Chapter 5, on the
   site, and in the packet's quick reference, one per Anchor Rating, next to the terrain that produces
   them. This is the single highest-value page of the packet that does not exist yet.
4. **One sentence on the Nape strike entry**: the striker stays at Blind Spot, hooking in is an
   Attention fact, and holding Attention locks them out of striking again.
5. **In Foundry**, show `hooked-by-strike` as its own badge, have the tracker note say the striker is
   still at Blind Spot, and put the legal steps for the current terrain in the move menu so the shape
   of the map is visible where the choice is made.

### How item 8 finishes the job

Under zones this stops being a diagram and becomes the picture. Blind Spot is a soldier standing behind
the Titan in its zone, anchored to a roof; On Body is a figure on the Titan itself. The terrain
dependence survives and becomes legible, because the Blind Spot's availability reads off the zone's own
anchor rating, which is drawn on the tile: no anchors, no Blind Spot. The clarity work below is worth
doing now regardless, because batch A ships long before batch E.

### Files

`data/engagement/positions.yaml`, `data/character/action-catalog.yaml`, `docs/rules/05-titan-engagement.md`
sections 5.1, 5.2 and 5.5, the packet and its quick reference, the site's Chapter 5 pages and the
diagrams, `foundry/src/tracker/badges.ts`, `view.ts` and the language file.

### Risk

None to the rules. This documents behaviour that already works, plus one badge and three diagrams.

---

## Consolidated change list

Grouped into the batches we would ship them in.

### Batch A: Health and Position clarity (rules, site, Foundry, packet)

| # | Change | Where |
|---|---|---|
| A1 | Health formula becomes `2 + (strength + agility) / 2`, rounded up. Nothing else about harm changes | `data/character/attributes.yaml`, ADR-0005, ADR-0014, Chapters 2 and 3, packet, site, `foundry/src/rules/derived.ts` |
| A2 | Squadmate template Health recomputed | `data/character/squadmates.yaml` |
| A3 | Health box row re-laid out for up to 8 boxes | printed sheet, site sheet, Foundry actor sheet |
| A4 | ~~Steam softened~~ **Withdrawn.** Steam keeps both triggers and its current table | none |
| A5 | The closed list of what changes a Position, headed by "an action never changes a Position" | `data/engagement/positions.yaml` |
| A6 | Blind Spot described as anchored to terrain behind the Titan, not on it, everywhere it is introduced | `positions.yaml`, Chapter 5, packet, site, Foundry tooltips |
| A7 | The three Position maps drawn, one per Anchor Rating shape (Open, Sparse, branching) | Chapter 5, packet quick reference, site |
| A8 | The Nape strike sentence: still at Blind Spot, hooking in is an Attention fact, Attention locks out the next strike | `data/character/action-catalog.yaml`, Chapter 5, packet |
| A9 | `hooked-by-strike` badge, the striker's tracker note, legal steps shown in the move menu | `foundry/src/tracker/badges.ts`, `view.ts` |
| A10 | **Retune**, downward: every Critical Injury and death band re-measured. Lethality goes back on the Titans, not on Health | `tools/sim`, `docs/reviews/simulator-report.md`, `data/titans/tuning.yaml`, ADR-0014 |

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
| E4b | **Titan movement**: the Stride toward the Attention holder, `stride` per Size Class, grounded Stride 0, wrecking made local, Blind Spot does not travel with the Titan | `data/engagement/size-classes.yaml`, `positions.yaml`, `titan-harm.yaml`, `titan-format.yaml`, `anchor-ratings.yaml`, Chapter 5, packet, Foundry |
| E5 | Every rule that reads a Position re-checked against the derivation | falls, grab, retreat, carrying, attention, engagement-flow, engagement-end |
| E6 | The engagement board: a custom PIXI board taking over the canvas area during an engagement, with the Flight arc and the Stride animated | a new `foundry/src/board/`, `foundry/src/tracker/snapshot.ts`, ADR-0027 amended |
| E7 | Retune and rerun: step counts change the tempo of closing to the Nape, and fallbacks fire less often once Titans close | `tools/sim`, ADR-0014 |
| E8 | The simulator gains a spatial model, which it has none of today | `tools/sim` |

---

## Questions still open

Settled on 2026-09-20: the Health formula (add 2, crits stay at one box), steam left exactly as it is,
the Position clarity work, the Stride for Titan movement, and a custom board rather than the Foundry
canvas. What is left:

1. **Skirmish lethality.** With damage unchanged and a Rookie at Health 6, no human weapon can Down a
   soldier in one hit. Accept, scale human weapon damage, or decide after the Skirmish has been played?
   We recommend accepting for this batch and reading it in the report.
2. **Where lethality goes back.** The Health change lowers every band and moves away from the target in
   waiting (7-12, OQ-140). We recommend putting it back on the Titans when the retune comes, through
   the Attack Dice pools, Nape Depth and Tempo, rather than on Health. Confirm that direction?
3. **Prompt timeout.** How long should an unanswered prompt card wait before the system rolls it, and
   should the default be "wait forever" at a live table?
4. **Zones, the size of the step.** Derived Positions (our recommendation, roughly one batch) or a full
   replacement (a redesign with its own retune)?
5. **Field size.** 13 hexes as the default, 7 for a corridor fight, 19 for a set piece?
6. **Stride values.** Small 1, Medium 2, Large 2, Abnormal 3, against a soldier's 1 zone on foot. The
   rule is accepted; these are the numbers the simulator will move.
7. **Does striding wreck the zones it crosses**, or only the `wreck` effect on the Titan's own zone? We
   recommend the latter first, so the tuning lever stays where it already is.
8. **Sequencing.** Batches A to D could be at the table within one cycle. Does E start in parallel, or
   after A to D have been played?
