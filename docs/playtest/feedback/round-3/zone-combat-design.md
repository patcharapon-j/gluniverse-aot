# Zone combat: a design for owner feedback items 8, 9 and 10

Written 2026-09-20. This is a proposal, not a decision. It answers "rework this into zone based combat
instead, hexagonal zone representation" and the isometric display that goes with it.

---

## 1. What is actually wrong today

Worth being precise, because the diagnosis picks the design.

**A soldier has no location, only a set of relations.** `data/engagement/positions.yaml` `relative_to`:
a soldier holds a Position relative to *each* Focus Titan and *each* corpse. Two Titans on the field
means two facts about where one soldier is, and they can disagree. The file then needs a `close_rule`
to stop a soldier being On Body of two Titans at once, and a whole `comparison` block to decide which
Titan two soldiers are compared relative to when a rule asks whether they are near each other. Those
two blocks are not features. They are the repair kit for having no shared space.

**Distant is terminal.** There is one value for "not near", so a soldier one stride outside a Titan's
reach and a soldier across the field are in the same place. That is the "2x far" the note names, and it
also means terrain between two soldiers cannot exist, because there is no between.

**Terrain is one global number.** The anchor rating is a property of the whole engagement
(`combat.system.anchor`), so a fight is entirely Wooded or entirely Urban. A ruined town beside an open
field cannot be drawn.

**On the canvas, tokens are at places the rules do not read.** Foundry shows every soldier standing
somewhere specific. None of it feeds the rules; the rules read Positions the tracker stores separately.
A table therefore sees two contradictory answers to "where am I", and the one that looks most real is
the one that means nothing. We think this is the largest single contributor to "positioning is
confusing", and it is not a rules problem at all.

---

## 2. The model

### 2.1 The field

An engagement is fought over a small field of **hexagonal zones**. A zone is about a Titan's reach
across, which makes one ODM move one zone and fixes the scale of everything else.

Field sizes, chosen per fight when the engagement is set up:

| Size | Zones | Use |
|---|---|---|
| Skirmish field | 7 (one ring) | An ambush, a single Titan, a corridor fight |
| Standard field | 13 | The default for a Leg encounter |
| Set piece | 19 (two rings) | A town, a breach, two Focus Titans |

Beyond the outermost ring is **off field**, which is what leaving the Titan Engagement means. We
recommend the standard field of 13 as the default, and sizing up rather than down for set pieces.

### 2.2 What a zone holds

- **Terrain**, which carries that zone's **anchor rating** (Open, Sparse, Wooded, Urban, Giant Forest)
  and so its anchor count. The rating stops being one number for the fight and becomes a property of
  the ground, which is what it always described.
- **Occupants**: soldiers, horses, Titans, corpses.
- **Effects**: fire, a steam cloud, smoke, rubble, a decoy, a flare. Effects currently have nowhere to
  live and are tracked as flags on soldiers or Titans. A zone gives them a home and, for the first
  time, makes an area effect expressible.

A Titan occupies one zone. A corpse occupies the zone the Titan died in and keeps its terrain effect on
that zone, which is a better statement of the corpse rules than the current recorded-Position rewriting.

### 2.3 Positions become derived, and conditions do the rest

This is the core of the recommendation. Keep the four Position names, stop storing them, and derive
each one from the zone plus the soldier's attachment:

| Position | Derived from |
|---|---|
| Distant | The soldier is not in this Titan's zone |
| In Reach | The soldier is in this Titan's zone, on the ground or anchored to terrain in it |
| On Body | The soldier is attached to this Titan (hooked in or standing on it) |
| Blind Spot | The soldier is anchored to terrain in this Titan's zone, behind it |

The **conditions** the owner names are the attachments, and they are one value per soldier, not one per
Titan:

- **On the ground** (the default)
- **Anchored**, ODM hooks in the terrain of their zone
- **Airborne**, mid flight between anchors
- **On a body**, hooked into a named Titan or corpse
- **In the blind spot** of a named Titan, anchored to terrain with its Nape in reach
- **Mounted**, **Grabbed** and **Pinned** as they are now

Three good things fall out of this and are worth stating, because they are the argument for the whole
design:

1. **Every Behavior Table Position requirement keeps working.** The stat blocks in `data/titans/` are
   large, tuned, and expensive to reopen. They read a Position, and a Position still exists.
2. **The close rule disappears.** A soldier cannot be On Body of two Titans because they have one
   attachment. The rule that patched this is not amended, it is deleted.
3. **The comparison block disappears.** "The same Position or one step apart", which today needs a
   paragraph to decide which Titan to measure relative to, becomes "in the same zone, or in an adjacent
   zone". Help, Covering, Treat Injury, Rally, Lift Comrade, Pass Item, Take Item and Field Repair all
   read one sentence instead of a lookup.

Blind Spot also gets an honest requirement for free: it needs terrain to anchor to, so it is unavailable
in an Open zone. That is already true in the step rows of `data/engagement/anchor-ratings.yaml`, but it
is invisible; on a map it is a thing you can see and plan around.

### 2.4 Moves

A move is still one move per turn, and it does one of these:

- **Step one zone**, on foot or mounted, into an adjacent zone.
- **Fly**, an ODM move, which is a Flight and is rolled exactly as it is now: one zone base, further
  zones by spending Momentum on Carry.
- **Attach or detach** within the zone: hook into a Titan in your zone (In Reach to On Body), take its
  blind spot, let go, or drop from the body.

Which of these a soldier can do is still governed by the anchor rating, but by **the rating of the
zones involved** rather than one global number.

### 2.5 The interesting part: flying over terrain versus the long way around

This is what the owner's note is reaching for, and zones make it expressible for the first time.

A Flight crosses a chain of adjacent zones. Two rules make the route a real decision:

- **Anchors carry you.** Each zone the Flight crosses that has anchors (Sparse and up) makes the next
  Carry cheap, because there is something to hook. Crossing an **Open** zone costs more Momentum,
  because there is nothing to hook and the soldier is committed to an arc. Concretely, we propose a
  Carry cost of 1 per extra zone, reduced to 0 when the zone entered has anchors of Wooded or better,
  and raised to 2 when the zone entered is Open. The Giant Forest's existing first-Carry-free trait
  (`data/engagement/anchor-ratings.yaml`) becomes one case of this instead of a special rule.
- **The short way goes past things.** A Flight that crosses a zone holding a Titan is seen: it sets the
  loudest flag on that Titan whatever the roll gave. A Flight that crosses a zone holding an effect
  (fire, a steam cloud) takes that effect's harm.

So the ruined town is two zones, cheap in Momentum, full of anchors and blind spots, and it takes you
past the Titan. The open field is four zones, expensive, and nobody sees you. That is a choice with no
right answer, made every turn, which is exactly the brief.

### 2.6 What happens to the rest

| Rule | Under zones |
|---|---|
| Two Focus Titans | Each sits in a zone. A soldier's one zone gives both Positions. `two_focus_titans` shrinks to a sentence |
| Corpse | An object in its zone. Attachments to it end when it falls; the soldier stands in that zone. Same outcome as today's "On Body and Blind Spot read In Reach", stated once |
| Falls | Unchanged procedure and bands. A fall detaches the soldier and lands them in the Titan's zone |
| Grab | Unchanged. A Grabbed soldier is in the holding Titan's zone, attachment Grabbed |
| Pinned | Unchanged, pinned in the corpse's zone |
| Leaving and returning | Leaving is moving off field from an edge zone. Returning is entering an edge zone |
| Retreat forced move | One zone directly away from the nearest Titan |
| Attention Ladder | Reads derived Positions and attachments. Unchanged as written |
| Horses | Occupy a zone. A dismounted horse stays in the zone it was left in, which replaces the recorded-Position rewriting entirely |
| Starting placement | Soldiers start in a named zone rather than at Distant |

### 2.7 Keeping the tuning

One detail protects the whole retune. **Default starting distance is one zone from the Focus Titan.**
Today a soldier at Distant reaches the Nape in two steps: Distant to In Reach, then In Reach to Blind
Spot. Under zones, starting one zone out gives step into the zone, then attach: also two. Rounds to the
Nape, exposure per approach and gas per fight therefore start where they are now, and the simulator
rerun is a check rather than a retune. Larger fields become a scenario choice that the GM makes
knowingly, not a silent change to every fight's tempo.

---

## 3. How a Titan moves, which is a rule that does not exist yet

Raised by the owner, 2026-09-20, and it is the most consequential thing anyone has found in this
design. It needs its own section because the answer is not an adjustment. It is a new rule.

**Accepted by the owner, 2026-09-20: "please reinvent titan movement as suggested."** The Stride below
is the design to build. The Stride values in 3.3 remain starting values for the simulator to move.

### 3.1 Today, a Titan never moves. At all.

This is worth stating flatly, because it is easy to miss and it is true. The closed list of behavior
effects in `data/engagement/titan-format.yaml` `effect_types` is: stress, critical-injury, knock-loose,
grab, wreck, telegraph. **None of them changes anyone's Position, and there is no Titan movement rule
anywhere else in the ruleset.**

The Large Titan's Heavy Tread entry reads "It walks straight at the soldier, and every step shakes the
ground under everyone beside them", and mechanically it deals 1 Stress and a wreck. The walking is
flavour. The Titan does not close.

That is not an oversight. It is the necessary consequence of relative Positions: if every soldier's
location is defined relative to the Titan, then the Titan is the origin of the coordinate system and it
cannot move relative to itself. Instead, a Titan that cannot reach its Attention holder resolves its
entry's **fallback** (usually Thrash). "The Titan is too far away to do this" is expressed as the card
doing something else.

### 3.2 Why zones break it

Once there is a shared map, "the Titan never moves" stops being invisible and becomes absurd. A soldier
who stands two zones away is permanently, provably safe. Every entry whose `position_requirement`
includes Distant becomes nonsense, because the Titan can never arrive. The monster becomes scenery.

So Titan movement is not an optional extra for the zone model. **The zone model cannot ship without
it.** Good catch.

### 3.3 The proposal: a Titan strides toward its Attention holder

The design constraints are tight and they point at one answer:

- **Titans do not roll** (ADR-0018), so movement cannot be a roll.
- **Titans act from Behavior Tables** (ADR-0001), so movement should come from the cards.
- **The GM never picks a row, a fallback, a target, or an order** (ADR-0024, limit 8), so the GM must
  not be choosing where the Titan walks either.

All three are satisfied if movement has a determined destination, and the game already has exactly one:
**Attention**.

> **The Stride.** When a Focus Titan's card resolves and its Attention holder is not in its zone, the
> Titan first moves toward that soldier by the shortest route, up to its **Stride** in zones. The
> entry's `position_requirement` is then checked as it is today: if the Stride brought the holder into
> reach, the entry happens; if not, the fallback happens.

Stride by Size Class, as a starting value for the simulator to move:

| Class | Tempo | Stride | Zones per round |
|---|---|---|---|
| Small | 2 | 1 | 2 |
| Medium | 1 | 2 | 2 |
| Large | 1 | 2 | 2 |
| Sprinting Abnormal | 2 | 3 | 6 |

The Abnormal's number is the point of the Abnormal. It should cross the field.

### 3.4 Why this is the right answer and not just a workable one

- **It needs no new decision from anybody.** The destination is derived, so ADR-0024 is untouched and
  the GM does not become a chess player.
- **It makes Attention physical.** Drawing Attention already takes the Titan off a comrade; now it
  drags fifteen metres of monster across the map. A decoy does not redirect an abstraction, it moves the
  thing. This is the single biggest upgrade the zone model gives the existing teamwork loop, and it
  costs nothing because the Attention Ladder is unchanged.
- **Every existing Behavior Table keeps working, unedited.** Entries requiring Distant describe what
  happens as it closes; entries requiring In Reach happen once it has. The stat blocks in `data/titans/`
  do not need reopening, which was the same reason we recommended deriving Positions rather than
  replacing them.
- **The fiction already says it.** Heavy Tread and Run Past are written as the Titan crossing ground.
  The rule finally does what the text has always claimed.

### 3.5 The consequences, which are mostly gifts

**Breaking a leg pins it in place.** A grounded Titan is one with at least one Broken leg
(`data/engagement/titan-harm.yaml` `grounded`), and the data already notes that a grounded Titan does
not walk (OQ-109). So **Stride 0 while grounded.** Today breaking a leg changes which Position steps
are available; under zones it stops the monster from following you. That is an enormous increase in the
value of an existing mechanic, for free, and it gives a Squad a real answer to "we need to get out of
here".

**On foot, you cannot escape, and that is the premise of the game.** A Titan covering 2 zones a round
against a soldier's 1 zone on foot means fleeing on foot fails. ODM with Momentum spent on Carry, and a
horse, are what let you outpace it. The setting's central claim, that ODM gear is the only reason
humans can fight these things, becomes a mechanical fact rather than a flavour note.

**The Blind Spot becomes genuinely precarious.** A soldier at Blind Spot is anchored to terrain, not
hooked into the Titan (`positions.yaml`), so **they do not move with it.** If the Titan strides away,
it walks out from under them and they are left anchored in the zone it left, now Distant. A soldier On
Body or Grabbed does move with it. That is a legible risk-reward split between the two ways of being
close, and it feeds directly into the clarity work of item 11: on the canvas board you would watch it
happen.

**Wrecking becomes spatial.** The `wreck` effect currently removes 1 Anchor from the whole engagement.
Under zones it should remove one anchor-rating step from **the Titan's current zone**, so the monster
flattens the ground it is standing on and the battlefield degrades where it has been. Fighting it in
the ruins it already levelled is worse than fighting it in the part of town it has not reached. We
recommend that striding through a zone does **not** wreck by itself, so the tuning lever stays on the
entries that carry the effect, but it is an obvious thing to try later.

**Passing through a zone harms nobody.** A soldier standing in a zone the Titan enters is simply In
Reach now, which is dangerous enough. We do not want a trample rule: harm outside the Behavior Tables
is exactly what ADR-0005 and ADR-0019 are careful about, and Run Past already exists as a card.

### 3.6 The consequence that is not a gift

**Fallbacks will fire far less often.** Today, a Titan whose Attention holder is out of position
resolves Thrash instead of its real entry, and that is a meaningful share of a fight's cards. Once the
Titan closes first, most entries reach their requirement and resolve as written. That is a **rise in
Titan effectiveness**, on top of the rise already coming from the Health change in batch A.

Two lethality increases stacking in the same retune is the thing most likely to overshoot the bands. It
should be measured as its own row, with Stride values as the first lever if it does. It is also an
argument for keeping the default start at one zone, per section 2.7, so round one is unchanged and only
the later rounds carry the difference.

### 3.7 Smaller questions this opens

- **Background Titans.** Today they are an off-map clock that promotes one to Focus. With a map they
  could walk in from an edge and be visible as they come, which would make the retreat clock something
  you watch rather than something you are told. Tempting, and out of scope for the first version. Place
  a newly promoted Titan in an edge zone and leave the clock alone.
- **The retreat.** Retreating currently moves soldiers a step toward Distant on a clock. With a Titan
  that follows, a retreat becomes a chase. That is better, and it needs checking that the retreat's
  forced moves and its ending conditions still terminate.
- **Two Focus Titans** each stride toward their own Attention holder. No interaction needed.
- **Does the Stride happen before or after the card resolves?** Before, as written above: the Titan
  arrives, then swings. It also animates well on the canvas board.
- **Does a soldier get to react to the Stride?** No. The dodge answers the attack, as it does now.

### 3.8 What this costs

A new `stride` field on `data/engagement/size-classes.yaml` and on the Abnormal; the Stride rule in
`data/engagement/positions.yaml` or a new `titan-movement` block; the grounded Stride 0 line in
`titan-harm.yaml`; the local wreck in `anchor-ratings.yaml` and `titan-format.yaml`; the Blind Spot
"does not travel with it" line; Chapter 5 sections 5.2, 5.4 and 5.6; the packet and the GM section; the
Foundry engine and the board's stride animation. And, the large one: **the simulator has no concept of
space at all today**, so the movement model is the biggest single piece of new simulator work in the
whole package.

---

## 4. The alternative we are not recommending

Replace Positions outright: zones and conditions are the only location facts, and every rule is
rewritten to read them. It is cleaner on paper, it removes the derived layer, and it would read better
in the book.

It also reopens every Behavior Table Position requirement in `data/titans/`, every Attention Ladder
rung, and roughly thirty data files, and it forces a full retune rather than a check. We recommend
deriving now and revisiting after the zone model has been played. If the derived layer turns out to
carry no weight at the table, deleting it later is a clean, mechanical change. Doing it first is not.

---

## 5. What this costs

| Area | Work |
|---|---|
| ADRs | One new ADR for the model; amendments to ADR-0009 and ADR-0010 |
| Titan movement | The Stride rule, `stride` on every Size Class and the Abnormal, grounded Stride 0, the local wreck, the Blind Spot line (section 3) |
| Data | New `data/engagement/zones.yaml`; rewrite of `positions.yaml`; changes to `anchor-ratings.yaml`, `engagement-setup.yaml`, `engagement-flow.yaml`, `background-titans.yaml` (retreat), `grab.yaml`, `titan-harm.yaml` (corpse), `attention.yaml`, `harm/engagement-end.yaml`, `gear/falls.yaml`, `gear/carrying.yaml`, `gear/horses.yaml` |
| Chapters | Chapter 5 sections 5.1, 5.2, 5.7, 5.11 rewritten; smaller edits in 1, 3, 4 |
| Site | The Chapter 5 pages and a zone diagram |
| Foundry | `rules/engagement/positions.ts` rewritten around zones; the board (section 6); setup gains a field builder |
| Packet | The Titan Engagement section, the quick reference, the map |
| Tuning | A retune. Titan movement is new simulator work from nothing, and fallbacks firing less often raises Titan effectiveness on top of batch A |

Honest estimate: this is the largest single package since the round 1 batches, and larger than the
whole of batches A to D in `ASSESSMENT.md` put together.

---

## 6. Open design questions

1. **Titan reach and Size Class.** A Large Titan plausibly reaches into adjacent zones. Simplest model:
   it does not, and Size Class instead governs how many zones it crosses in a move. More faithful:
   Large Titans threaten adjacent zones, which makes the field around them dangerous to cross. We lean
   simple first.
2. **Elevation.** Rooftops and canopy are a natural second axis and the show trades on them heavily. We
   recommend leaving elevation out of the first version and letting a zone's terrain imply it, then
   adding a height band per zone only if the table wants it.
3. **Zone shape on the table.** Hexes are right for Foundry. For play without Foundry, the packet needs
   a printable field. A 13-hex sheet with dry-wipe markers is the cheapest answer.
4. **Do soldiers block zones?** We recommend no. Zones hold any number of occupants.
5. **Stride values.** Small 1, Medium 2, Large 2, Abnormal 3, against a soldier's 1 zone on foot. These
   are starting values for the simulator to move, not settled numbers. The Stride rule itself is
   accepted (section 3).
6. **Does striding wreck the zones it crosses**, or only the `wreck` effect on the Titan's own zone? We
   recommend the latter first, because it keeps the tuning lever where it already is.
7. **Do Background Titans walk in visibly**, or stay an off-map clock until promoted? We recommend the
   clock for the first version.

---

## 7. The engagement board (items 9 and 4 of the second pass)

**Owner, 2026-09-20: "we can either use foundry canvas or custom ui, entirely up to you. Art will be
handled by Codex to generate later."**

### 7.1 The decision: a custom board that takes over the canvas area during an engagement

Not Foundry's token layer, and not a separate window either. During a Titan Engagement the system
renders its own full-bleed board in the space the canvas occupies, and the scene canvas is simply not
used. Outside an engagement, Foundry behaves exactly as it does now, so travel and exploration scenes
are untouched.

Three reasons, in order of weight:

1. **Foundry's canvas has no vertical axis, and the vertical axis is this game.** On Body, Blind Spot,
   airborne on a tether, Grabbed in a hand, Pinned under a corpse: these are the most important facts on
   screen and a token on a 2D grid cannot express any of them. A token cannot be attached to another
   token's shoulder. We would spend the whole build fighting the engine for the one thing that matters
   most.
2. **Nothing about the canvas earns its keep here.** Zones are 13 discrete cells, so continuous
   positioning is not wanted; walls, vision and lighting are atmosphere we would mostly disable. What
   the canvas offers is a grid, and a grid is the cheapest part of this.
3. **"It must look like a game" means controlling the frame.** Isometric projection, parallax, the
   flight arc, tethers, effect overlays, a Titan that fills the screen when it strides into your zone.
   All of that is straightforward in our own renderer and a running battle inside someone else's.

And the objection that pushed us toward the canvas in the first pass, that tokens on the map would
contradict the rules, is answered better by replacement than by adoption: **during an engagement there
is exactly one picture of the fight**, because the other one is not on screen.

### 7.2 What we give up, and how it is covered

| Lost | Covered by |
|---|---|
| Token selection and targeting | The board has its own selection, which sets Foundry's targets so chat cards and the tracker keep working unchanged |
| Status effect icons on tokens | Drawn on the board's figures from the same status data the token layer reads |
| Lighting, fog, weather | Baked into the tile art plus a tint and vignette pass, which is more controllable anyway |
| GM muscle memory for dragging tokens | The board is drag-and-drop on the same mouse gestures |

### 7.3 How it is built

PIXI, which ships inside Foundry and which the system already uses for the token badges
(`foundry/src/tracker/badges.ts`). The board is a PIXI application mounted full-bleed over the canvas
area, activated when an engagement starts and torn down when it ends. State comes from the same
snapshot the tracker reads (`foundry/src/tracker/snapshot.ts`), so the board is a renderer over the
existing engine rather than a second source of truth. That separation is what lets the board be
replaced or re-skinned later without touching a rule.

Respect the existing Full, Reduced and Off motion setting. Off leaves a clean static board that is
completely playable.

### 7.4 What it draws

- **Zone tiles** in shallow isometric, terrain art per anchor rating, the rating shown on the rim as a
  colour and a glyph. Where the anchors are is what makes route choice a decision, so it is never more
  than a glance away.
- **The Titan**, scaled by Size Class, with Openings and Broken Body Parts marked on the figure, and an
  Attention line drawn to whoever holds it. Attention is the core teamwork mechanism and it is invisible
  today.
- **Soldier figures on the vertical axis**, which is the whole reason for building our own board: On
  Body pinned to the Titan's silhouette at nape, shoulder, arm or leg; Blind Spot standing behind it,
  visibly not on it; airborne lifted above the tile with a grapple line running down to its anchor and a
  shadow below; Grabbed in the hand; Pinned under the corpse.
- **Momentum pips and a small gas gauge** under each figure, matching the token badges of item 7.
- **Zone effects**: steam, fire, dust as animated overlays.

### 7.5 The two set pieces

**The Flight.** When a Flight resolves the figure arcs along its chosen route, hex by hex, grapple
firing ahead to each anchor, gas trail behind, landing in the destination zone. Round 2's note was that
the ODM gear is a set piece in the show and "the move just happens" in play. This is the answer to it,
and it is only possible because we control the renderer.

**The Stride.** When a Titan closes on its Attention holder (section 3) it walks, zone by zone, before
the card resolves. The monster crossing the field toward a named soldier, with the Attention line
drawn to them, is the most dramatic thing this game has and it currently happens in a sentence of chat
text.

### 7.6 Interaction

- **Drag a figure to a zone.** Legal destinations light up, each labelled with its Momentum cost and the
  roll the move will ask for. Dropping sends the Flight prompt to that player (item 6).
- **Drag onto the Titan to attach**, onto the rear marker to take the Blind Spot, off it to let go,
  which warns that it is a fall before it commits.
- **With Direct Control on** (batch B) every zone and every attachment lights up and nothing is checked,
  so the GM can place anyone anywhere for narrative reasons. The board should look visibly different
  while it is on.
- **Hover a zone** for terrain, anchor rating, occupants and effects.

### 7.7 What gates it

- **Field setup must be nearly free.** A generator: pick a field size and a terrain mix, get the zones,
  the tiles and the starting placements. Without it the hero feature does not get used.
- **The art list for Codex**, which can be specified now and generated later: hex terrain tiles for the
  five anchor ratings with about three variants each; anchor-rating rim glyphs; Titan figures for Small,
  Medium, Large and the Abnormal, in a pose that reads at a glance and takes damage-state overlays;
  soldier figures with a standing and a hanging pose; effect overlays for steam, fire and dust; the
  grapple line and gas trail, which are better generated in code as particles than drawn.
- **ADR-0027 needs amending.** It locks the look as flat and paper with WebGL scoped to two small vitals
  widgets. The board is a new surface with its own budget, and the amendment should say so while holding
  the art to the locked language, painted plates and inked figures in the paper palette, so it reads as
  the same product.

### 7.8 What the tracker becomes

The ledger spread keeps its right page (Titan blocks, clocks, the round-end checklist) and its left page
becomes a compact readout of the field rather than the Position matrix: who is in which zone, with what
attachment, and how much Momentum. The board is where you act; the tracker is where you check.
