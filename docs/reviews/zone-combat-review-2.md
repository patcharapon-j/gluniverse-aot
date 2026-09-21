# Batch E, zone combat, review round 2 (confirmation)

Reviewer: independent senior TTRPG designer. Date: 2026-09-21.

**Scope.** A narrow confirmation round. Only: (1) whether each Critical and Major of
`docs/reviews/zone-combat-review-1.md` and `docs/reviews/zone-combat-review-1-impl.md` is fixed at
every location it named, read in the tree as it stands now (fix commits eaa649d, d45870a, af1e7af,
7933eee, 184599e); (2) whether those fixes left the YAML, Chapter 5, the site, the packet, and
Foundry's user-visible strings or engine behavior disagreeing on the same rules; (3) whether OQ-205 to
OQ-207 read the same on every surface that states them. Severity follows
`docs/playtest/process/zone-combat-review-task.md`.

**Rulings held.** Rules C1 is resolved as "a Flight's Momentum is trimmed only at the end of the
move". Implementation M2 is overruled by OQ-205, so Foundry landing every Anchored soldier in a zone
that becomes Open, whatever stands in it, is correct and is not a finding.

**Runs.** `cd foundry && pnpm test`: 446 passed. `pytest` is not installed for the system Python,
so `tools/sim/test_space.py` was not run; the simulator fix (M8) was confirmed by reading it.

**Counts.** Round 1 Criticals and Majors: 22 checked (3 Critical, 19 Major). 20 Confirmed, 1 Overruled by OQ-205 and consistent (implementation M2), 1 Not fixed (rules M5, in part).
New findings: 0 Critical, 3 Major, 3 Minor.

---

## Round 1 rules review (`zone-combat-review-1.md`)

| Finding | Verdict | Evidence now |
|---|---|---|
| C1, two Momentum trims | **Confirmed** | `anchor-ratings.yaml` `anchors.momentum_cap` (192-196) now excepts a Flight: its zone steps trim nothing and it is trimmed at the end, to the end zone's anchors. `momentum.gained` (228-231) and `zones.yaml` `flight.momentum_trim: arrival-zone` agree. Chapter 5 line 489 and line 474 match. Packet lines 2847, 2873, and 4174 match. The site's Flight bullet (`fighting-titans.mdx` 189) trims at the end only and says nothing per step. Foundry spends Carry from the post-roll Momentum, cuts the route where it runs out, and trims once at the end (`engine.ts` `flightResolver.apply` and `applyMove`), so it does not trim mid-Flight. |
| M1, 5.11 end steps | **Confirmed** | Chapter 5 line 1304 now reads Positions derived from zone and attachment, relative to each living Focus Titan and each corpse, then clears the field with every zone's rating and every soldier's Momentum, citing `positions_read` and `momentum_and_anchors`. |
| M2, Heave's Help reach | **Confirmed** | Chapter 5 line 1108: "Comrades in the heaver's zone or an adjacent zone may Help". Matches `titan-harm.yaml` 377 and packet 3301. |
| M3, two more Chapter 5 readers | **Confirmed** | Line 766: "a comrade with an unspent action in the same zone or an adjacent zone". Line 1298: "a comrade in their zone may still lift them". |
| M4, ADR-0001 and ADR-0014 for Z2 | **Confirmed** | ADR-0001 line 24 and ADR-0014 line 73 each carry a Z2 amendment paragraph: every third round, cap 3, with the reason. |
| M5, site Fighting Titans Anchors as one pool | **Not fixed (in part)** | Every location the finding listed is fixed: *Momentum and Anchors* (`fighting-titans.mdx` 203-217), `TERRAIN_WORDING`, the `anchorsTable` note, `SPEND_WORDING` Carry and Bite, and the `positionStepsTable` note, which now has the "Read as" column. But the step-table sentence the finding quoted, "a move that crosses two steps spends Momentum on Carry", still appears word for word in `site/src/components/PositionsMap.astro` line 73. That component is the Fig. on the same Fighting Titans page, on the Quick Reference, and on Learn. The round diagram on that page and on the Quick Reference still ends the Momentum step with "up to the Anchors left" (`engagement-tables.ts` line 1020, `ROUND_STEPS.momentum`), which describes the retired fight-wide pool. See the fix below the table. |
| M6, site GM pages lower the fight's Anchors | **Confirmed** | `titans.mdx` 72, `tuning-the-fight.mdx` 58 and 117, and `running-a-titan-fight.mdx` 124 and 197 now speak of one rating step off the Titan's own zone. A zone wrecked to Open under a standing Titan loses its Blind Spot step. |
| M7, site glossary | **Confirmed** | `glossary.ts` rewrites Anchor Rating, Position, Blind Spot ("It has no facing"), Corpse, Momentum, Anchor, and Move, and adds Field, Zone, Edge zone, Off field, Field rating, Attachment, and Stride (lines 26-33). |
| M8, other site Position-step readers | **Confirmed** | The swap step (`engagement-tables.ts` 987), Covering and Help (`quick-reference.astro` 143 and 173), the move (quick-reference 214, `learn/index.astro` 198, `rules-of-play.mdx` 371), and nearby Stress (`harm-tables.ts` 286, `core-tables.ts` 302) all now read zones. |
| M9, site corpse paragraph | **Confirmed** | `fighting-titans.mdx` 255 now reads: every attachment naming the body ends at the death, and soldiers then step onto it on foot. The paragraph also says a corpse can be a fall's reference. |
| M10, Foundry `fall-raised` key | **Confirmed** | `en.json` `WOF.TerrainTrait.fall-raised` is present and `first-carry-free` is gone. |
| M11, other Foundry strings | **Confirmed** | `Sheet.momentum.hint`, `Tracker.cue.swap`, `MomentumSpend.carry`, `MomentumSpend.bite`, and `TerrainTrait.first-wreck-ignored` are reworded to zones. `Tracker.anchors` and `Tracker.gm.anchor` are deleted. |

**Fix for the M5 residue.**
1. `PositionsMap.astro` line 73: replace "a move that crosses two steps spends Momentum on Carry" with
   the `positionStepsTable` note's wording: "every Carry past the first step pays that step's cost".
2. `engagement-tables.ts` line 1020: "Anyone who flew keeps what they hold, up to the anchors of the
   zone they are in."

## Round 1 implementation review (`zone-combat-review-1-impl.md`)

| Finding | Verdict | Evidence now |
|---|---|---|
| C1, a standing Titan's death grounds airborne soldiers | **Confirmed** | `titan-death.ts` 58-59: the freed soldier lands ground; if the body falls, only a soldier who is not airborne lands ground; everyone else goes through `detached(s.airborne)`, so an airborne soldier ends Anchored. The fall list excludes airborne soldiers. There is a test at `engagement-rules.test.ts` 1205. |
| C2, stand-up leaves the `pinned` placement | **Confirmed** | `field.ts` `titanStands` writes a `ground` placement for every soldier pinned by the Titan, and `engine.ts` 1306-1314 applies it. A Pin cleared on the sheet reads as ground through `reconcilePin` in `snapshot.ts` 151. `setPinned` writes both fields (1626-1633). |
| M1, the Stride trims no Momentum | **Confirmed** | `engine.ts` 611-612 applies `strideMomentum` to the soldiers the Stride carries. `gmPlaceTitan` and the other GM placements call `trimMomentum` (1675, 1694, 1713). |
| M2, Open zone grounds Anchored soldiers with no standing Titan | **Overruled (OQ-205), consistent** | `field.ts` `zoneOpened` lands every Anchored soldier whatever stands in the zone. It moves Blind Spot to On Body only for a standing Focus Titan in the zone (`!t.grounded`). That matches the provisional rule. |
| M3, the stand-up in an Open zone | **Confirmed** | `titanStands` rewrites `blind-spot` to `on-body` when the Titan's zone rating is `zoneRules().openRating`. |
| M4, the Open trait reads the field rating | **Confirmed** | `roll-context.ts` 100 calls `breakAttentionTerrainDice(s, snap.field, ratingOf)`, which reads the soldier's own zone (`momentum.ts` 35-39). |
| M5, the mounted charge is forced | **Confirmed** | `moveFlags` flags only `chargeOn`, and only when it is in `charge`. `checkedMove` (`engine.ts` 739) keeps only a named, offered label. The board offers a plain move and one "Charge" entry per Titan, and offers none once the move is spent (`app.ts` 200-211). |
| M6, the move already spent is not checked | **Confirmed** | `guard.ts` refuses a `zone-move` whose soldier is in `movesSpent`. `checkedMove` refuses too (`engine.ts` 730). `moveOptionsFor` returns `[]` for a spent soldier (`positions.ts` 336). A Flight marks the move spent when it is asked (`engine.ts` `flight`, `markMoveSpent`). |
| M7, no mount or dismount within a move | **Confirmed** | `moveOptions` offers on-foot steps to a mounted soldier with `dismount` set. It also offers mounted steps to a free soldier whose horse is in the zone, with `mount` set (`positions.ts` 199-200 and the `canRide` walk). `applyMove` writes the horse and `horseZone` (`engine.ts` 885-898). The "after the steps" half is not offered; see n4. |
| M8, simulator retreat option 3 in the comrade's zone | **Confirmed** | `policy.py` `retreat_toward` returns False when `s.zone == target.zone` (review 1, M8). |

---

## New findings

### N1 (Major). The Bonus Dice tables still give Bite and the Open trait in the retired model

**Location.** `site/src/lib/core-tables.ts` line 411, the `momentum` row: "against the Titan you flew
relative to, for Bite". Line 418, the `terrain-trait` row: "The fight is at the Open Anchor Rating."
Both render in the Bonus Dice sources table on the Rules of Play page (`CoreTable table="bonus-dice"`).
The packet's copy of the same table, line 416: "against the Focus Titan your Flight named".

**Problem.** `data/core/bonus-dice-sources.yaml` (the source under ADR-0012) gives Bite "against a
Focus Titan in the zone their Flight ended in". It gives the Open trait "a mounted soldier's Break
Attention gains 1 in an Open zone", read from the zone the soldier is in (16-5, 16-14). The round 1
fixes reworded Bite in `SPEND_WORDING`, on the packet's spend table (2882 and 4175), and in Foundry's
`MomentumSpend.bite`. They moved Foundry's Open trait to the soldier's zone (implementation M4) and
fixed the packet's own Terrain Trait row (417). The site's Bonus Dice table and the packet's Bite cell
were left behind. Each surface now contradicts itself: the packet at lines 416 and 2882, the site
between Rules of Play and Fighting Titans. A Flight names no Titan any longer, so "the Titan your
Flight named" and "the Titan you flew relative to" have no referent.

**Play scenario.** A Standard field rated Wooded, where zone 7 has been wrecked to Open. A mounted
soldier in zone 7 Breaks Attention. The player reads the site's Bonus Dice table: the fight is not at
the Open rating, so no die. Foundry gives the die, and the YAML and the packet agree with Foundry. In
the same fight, a soldier flies through zone 6 to land In Reach of Titan B in zone 8 and spends Bite.
The packet's table asks which Titan the Flight "named", and the rules have no answer.

**Fix options.**
1. `core-tables.ts` 411: "A strike or a Break Attention this turn against a Focus Titan in the zone
   your Flight ended in, for Bite." Line 418: "You are mounted, in an Open zone."
2. Packet line 416: "against a Focus Titan in the zone your Flight ended in".

### N2 (Major). The Quick Reference lets a mounted charge be made twice in one move

**Location.** `site/src/pages/reference/quick-reference.astro` line 241: "The mounted charge: a
mounted step between Distant and In Reach may mark you loudest. ... at Open it may be made twice in
one move."

**Problem.** `anchor-ratings.yaml` `mounted_charge` and `horses.yaml` `charge` (16-15) say a mounted
move "that enters or leaves a zone holding a Focus Titan may set the loudest flag on one such Titan,
the rider's choice, once per move". Foundry now enforces exactly one, by the rider's choice
(implementation M5). The Quick Reference still states the pre-zone rule: a Position step, with two
charges at Open. The Fighting Titans page and the packet do not repeat it. This is the same rule the
implementation M5 fix touched, and the site now disagrees with the YAML and with Foundry.

**Play scenario.** On an Open field two Titans stand in zones 7 and 8. A rider rides from zone 6
through 7 into 8 and, from the Quick Reference, marks both Titans loudest to pull them off a comrade.
Foundry offers one "Charge" entry per Titan and accepts only one. The table argues it out mid-round.

**Fix options.**
1. "The mounted charge: a mounted move that enters or leaves a zone holding a Focus Titan may mark
   one such Titan loudest, your choice, once per move. Never rolled, not ODM use."

### N3 (Major). Foundry's fall ignores OQ-206: no corpse fallback, and no raise with no body

**Location.** `foundry/src/rules/engagement/harm-rolls.ts` `referenceBody` (lines 67-76) and
`fallBand` (line 50), called from `foundry/src/tracker/harm.ts` 109-115.

**Problem.** OQ-206's provisional ruling, stated in `falls.yaml` `height.steps`, Chapter 4 section
4.6, Chapter 5 line 557, the packet (2928), and the site (243), has two parts:
- With no Focus Titan alive, the reference body is the corpse nearest the soldier's zone, a tie going
  to the earliest label.
- With no body at all, the band "starts low before any raise", so the Giant Forest raise still
  applies. The OQ says so explicitly.

Foundry does neither:
- `referenceBody` filters `status === 'focus'` and returns null when no Focus Titan lives, so a corpse
  is never the reference.
- `fallBand` returns `'low'` at once when there is no Position, before the raise step.

The fix pass added the ruling on every prose surface and in the YAML, but not in the one engine
players roll with. The Large Size Class raise from a Large corpse is lost as well.

**Play scenario.** The run-on after the last kill. A Large Titan's corpse lies in zone 7, a Giant
Forest zone, and a comrade is Pinned under it. Mila, Anchored in zone 7, Pushes a Flight toward the
Pinned comrade and Jams. The rules give the corpse as reference. Mila is Anchored, so she holds In
Reach relative to it and the band starts low. The Giant Forest raise and the Large raise together take
it to high, which adds 2 on the damage table. Foundry posts a low fall, adds 0, and the damage roll
reads two rows lower.

**Fix options.**
1. In `referenceBody`, after the Focus Titan fallback: when no Focus Titan is alive, take the nearest
   `status === 'corpse'` row by `zoneDistance`, ties to the earliest label.
2. In `fallBand`, with no Position, start at `'low'` and still apply the zone raise (and the size
   raise when a corpse is the reference). Add a test for each.

### n4 (Minor). Foundry offers a mount or dismount only before a move's steps

**Location.** `foundry/src/rules/engagement/positions.ts` `option` (lines 199-200) and the `canRide`
walk; `engine.ts` 885-898.

**Problem.** `horses.yaml` `within_a_move`: a move can include one mount or one dismount, "made in the
zone the soldier is in before or after that move's steps". Foundry now builds only the "before" half,
dismount then step on foot, or mount then ride. A rider cannot ride two zones and dismount on
arrival. A soldier on foot cannot step into the zone where their horse stands and mount. Implementation
M7's scenarios are fixed. This half is still missing.

**Play scenario.** A rider rides two zones to a Down comrade and wants to be on foot there to Lift
Comrade next turn without spending next turn's move on a dismount step. Foundry has no such option,
and the Direct Control override is the only way.

**Fix options.**
1. Also offer mounted routes that end with `dismount: true`, leaving the horse in the end zone, and
   on-foot steps into the horse's zone that end with `mount: true`.

### n5 (Minor). The site states only half of OQ-205 and drops OQ-206's corpse tie-break

**Location.** `site/src/content/rules/fighting-titans.mdx` line 215 (and `quick-reference.astro`
240); line 243.

**Problem.** The site says a wreck to Open converts a standing Titan's Blind Spot to On Body. It
never says that every Anchored soldier in a zone that becomes Open lands Ground with no fall, whatever
stands there. That is OQ-205's provisional half, stated in both YAML files, Chapter 5 line 512, and
the packet (2060, 2915). Nothing on the site contradicts it, but the site gives a player no rule for
it. Line 243 gives OQ-206's fallback as "the nearest corpse" with no tie-break, where the YAML,
Chapters 4 and 5, and the packet all add "a tie going to the earliest label". It is also the only
surface that does not mark OQ-205 as provisional.

**Fix options.**
1. Line 215: add "and every soldier Anchored in that zone lands Ground with no fall, whatever stands
   there, a provisional rule not yet settled".
2. Line 243: "the corpse nearest your zone, a tie going to the earliest label".

### n6 (Minor). The simulator still lands Anchored soldiers only under a standing Titan

**Location.** `tools/sim/engine.py` `wreck_zone` line 1512 (`if to == R.open_rating and standing:`)
and its docstring; `tools/sim/report.py` line 68.

**Problem.** OQ-205 (a) lands every Anchored soldier whatever stands in the zone. Foundry does this.
The simulator still gates both halves on a standing Focus Titan. The OQ says no simulator case is
needed, and that is a fair call for the figures. But the report's provenance line lists "the OQ-205
landing" among the YAML changes that had "no measured case changes". A maintainer could read that as
saying the engine implements it, and it does not.

**Fix options.**
1. Move the Anchored landing out of the `standing` gate in `wreck_zone` (no re-run needed, as the OQ
   argues), or
2. Reword `report.py` line 68 to say the engine keeps the pre-OQ-205 gate.
