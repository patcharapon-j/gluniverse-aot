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

## 3. The alternative we are not recommending

Replace Positions outright: zones and conditions are the only location facts, and every rule is
rewritten to read them. It is cleaner on paper, it removes the derived layer, and it would read better
in the book.

It also reopens every Behavior Table Position requirement in `data/titans/`, every Attention Ladder
rung, and roughly thirty data files, and it forces a full retune rather than a check. We recommend
deriving now and revisiting after the zone model has been played. If the derived layer turns out to
carry no weight at the table, deleting it later is a clean, mechanical change. Doing it first is not.

---

## 4. What this costs

| Area | Work |
|---|---|
| ADRs | One new ADR for the model; amendments to ADR-0009 and ADR-0010 |
| Data | New `data/engagement/zones.yaml`; rewrite of `positions.yaml`; changes to `anchor-ratings.yaml`, `engagement-setup.yaml`, `engagement-flow.yaml`, `background-titans.yaml` (retreat), `grab.yaml`, `titan-harm.yaml` (corpse), `attention.yaml`, `harm/engagement-end.yaml`, `gear/falls.yaml`, `gear/carrying.yaml`, `gear/horses.yaml` |
| Chapters | Chapter 5 sections 5.1, 5.2, 5.7, 5.11 rewritten; smaller edits in 1, 3, 4 |
| Site | The Chapter 5 pages and a zone diagram |
| Foundry | `rules/engagement/positions.ts` rewritten around zones; the board (section 6); setup gains a field builder |
| Packet | The Titan Engagement section, the quick reference, the map |
| Tuning | Rerun as a check, with rounds to the Nape and gas per fight watched specifically |

Honest estimate: this is the largest single package since the round 1 batches, and larger than the
whole of batches A to D in `ASSESSMENT.md` put together.

---

## 5. Open design questions

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

---

## 6. The isometric hex board in Foundry (item 9)

### 6.1 Where it goes

`foundry/src/tracker/components/Board.svelte` already draws the engagement as a two page ledger
spread: the soldier by Titan Position matrix on the left, the Titan blocks and the clocks on the right.
The zone board **replaces the left page** and leaves the right page alone. The tracker keeps its shape,
its ledger styling and its round-end checklist, and the matrix becomes a map.

### 6.2 What it draws

- **Zone tiles** in a shallow isometric projection, each carrying its terrain art and a small anchor
  rating mark in the corner. Effects sit on the tile as overlays.
- **A Titan figure** standing in its zone, scaled by Size Class, with Openings and Broken Body Parts
  marked on the figure itself. This is also where item 7's Openings badge naturally lives.
- **Soldier pieces** standing on their tile, with the vertical axis carrying the attachment: a soldier
  On Body is drawn on the Titan figure at the right height, one in the Blind Spot is drawn behind it
  with a marker, one Airborne floats above the tile with a line down to their anchor, one Grabbed is in
  the Titan's hand, one Pinned is under the corpse. The condition is the thing you see, which is the
  point of the design.
- **Momentum pips** under each piece, matching the token badges from item 7, so the two readouts agree.

### 6.3 How it is used

- **Drag a piece to a zone to move.** Legal destinations light up, with the Momentum cost and the roll
  the move will ask for shown on each. With Direct Control on (batch B), every zone lights up and no
  cost is charged.
- **Click a piece's height band** to attach, take the blind spot, or let go.
- **Hover a zone** for its terrain, its anchor rating, and what is in it.
- Pieces lift and settle using the existing motion tokens in `foundry/src/motion/`, so it feels like
  the rest of the system rather than a different product.

### 6.4 The canvas question

There is a choice here worth putting to the owner. The board above is a panel inside the tracker: it is
self contained, it is the smaller build, and it leaves the Foundry scene canvas as scenery.

The more ambitious version draws the zones **on the scene canvas itself**, as regions, and reads each
soldier's zone from where their token actually stands. That closes the gap named in section 1: the
tokens stop lying, there is one answer to "where am I", and the GM moves people by dragging tokens on
the map they already use. It costs more, it constrains scene art to zone-shaped maps, and it makes the
tracker board a mirror rather than the primary control.

We recommend building the panel board first, with the zone model kept strictly separate from its
rendering so the canvas version is a second renderer rather than a rewrite.
