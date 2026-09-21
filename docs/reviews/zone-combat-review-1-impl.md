# Zone combat, review round 1: the implementations

Scope: the Foundry system (`foundry/src/rules/engagement/**`, `foundry/src/tracker/**`, `foundry/src/board/**`) and the
simulator (`tools/sim/space.py`, `engine.py`, `policy.py`) against decision batches 16 and 17, ADR-0029, and the YAML
in `data/`. Diff base `d6db8ae`. Prose is out of scope.

Runs: `cd foundry && pnpm test`: 26 files, 439 tests passed (one wording resync warning, Minor 9).
`pytest tools/sim/test_space.py`: 18 passed.

Counts: Critical 2, Major 8, Minor 12.

## Checked and found to agree

These agree across both implementations and the YAML. They are listed so the next round does not re-walk them.

- The field layouts, numbering, neighbours, distance, ring, and edge zones (`zones.ts` 84-178, `space.py` 36-95);
  Foundry's `ZONE_DEFAULTS` is tested equal to the data (`test/zones.test.ts` 47).
- The derivation order and the detach rule (`zones.ts` 198-217, `space.py` 132-140).
- Zone steps and attachment steps, and the entered-zone reading of the distant to in-reach row
  (`positions.ts` 128-160, `space.py` 255-293).
- Flight: first step free, Carry costs by rating entered (Open 2, Sparse 1, else 0), off field 1, attachment step 1,
  Carry limit 2, never ending free in Open, ending anchored, gain capped by the start zone, trim at the end zone
  (`positions.ts` 240-257 and 326-337, `space.py` 202-349, `engine.py` 830-887).
- The crossing zones (`zones.ts` 251-257, `space.py` 233-244): the start and end zones are never crossed.
- The Stride route and tie break (lowest-numbered neighbour one closer), stopping on entry, grounded Stride 0, the
  step between attention and choose (`stride.ts` 12-33, `space.py` 378-387, `engine.py` 1514-1548 and 1748).
- Field generation: centre and start at the field rating, D6 per other zone in number order, named zones not rolled
  (`zones.ts` 321-336, `space.py` 98-119).
- The entry zone (`zones.ts` 265-278, `space.py` 391-403).
- Wrecks: one `sparser` step on the Titan's own zone, per-zone Sparse grace, Open takes no step, whether the behavior
  landed or not, after the Stride (`engine.ts` 701, `engine.py` 1845).
- Frenzy every third round, cap 3 (`cards.ts` 140-142, `engine.py` 2441); Pitch Headlong's wreck is gone from the data
  both read.
- The `flight_options` cache key in `space.py` 306-307 is complete: every input `_flight_options` reads (the rules
  object, size, every zone's rating, the start placement, Momentum, each body's label, zone and `grounded()` (which
  is true for a corpse), `may_leave`, the limit) is in the key. The other module caches (`_STEP_KINDS`,
  `_ENTER_KINDS`) are keyed on `id(R)` and pure. No per-trial state is held at module level.

## Critical

### C1. Foundry: a standing Titan's death puts every airborne soldier attached to it on the ground

`foundry/src/rules/engagement/titan-death.ts` 53-60.

`const attachment = s.id === freed || falls ? ground : detached(s.airborne)`. When the Titan was standing (`falls`),
every soldier whose attachment named it becomes `ground`, airborne or not, and `airborne` is left set, so the soldier
is written as on the ground and airborne at once. `titan-harm.yaml`, `falling_titan`, `path`, `airborne`: "An airborne
soldier swings clear with no roll and keeps their attachment", and 16-24 then ends every attachment naming the corpse
under the detach rule (16-8): anchored if airborne. Only a soldier who made a Leap Clear roll (not airborne) lands
ground. The simulator is right (`engine.py` 1339 skips airborne soldiers in the path, then 1461-1463 sets In Reach
through `place_at`, which gives anchored when airborne). This is the common case, not an edge: a Nape kill is struck
from Blind Spot, usually reached by a Flight, so the killer is airborne. Their Momentum cap, the Jam rule, and every
airborne test read the wrong state afterward.

Fix: `const attachment = s.id === freed ? ground : falls && !s.airborne ? ground : detached(s.airborne)`, and add a
test for an airborne Blind Spot soldier at a standing Titan's kill.

### C2. Foundry: a Titan standing up frees its Pinned but leaves them `pinned` in the placement, so they can never move

`foundry/src/tracker/engine.ts` 1286-1290.

On `p.result.stands` the engine clears `system.pinned.active` and nothing else. The placement row keeps
`{kind: 'pinned', body}`. `moveBlock` (`positions.ts` 195), `letGoBlock` (395), and `retreatBinds` read
`attachment.kind === 'pinned'`, so the freed soldier's move is refused as `pinned` for the rest of the fight. The same
split happens when the Wounds tab's Pinned checkbox is cleared (`TabWounds.svelte` 331), which writes only the actor.
Only `setPinned` (`engine.ts` 1607-1610) writes both. 16-23 and the grounded `ends` rule free the soldier to ground in
the body's zone.

Fix: route every Pinned clear through one helper that also writes `{kind: 'ground', body: null}` to the placement (as
`setPinned` does), and call it from the stand-up step. Either make the sheet checkbox call the same helper during a
Titan Engagement or make the placement the only source and derive `pinned` from it.

## Major

### M1. Foundry: the Stride trims no Momentum for the soldiers it carries

`foundry/src/tracker/engine.ts` 600-619.

On-body and grabbed soldiers change zone with the Titan (`strideMoves`), but the stride block never calls
`trimMomentum`. 16-4 (`anchor-ratings.yaml`, `momentum`, `cap`): "When a soldier's zone changes ... a soldier whose
Momentum is above the new cap loses the excess at once." A rider carried from a Wooded zone into a Sparse one keeps 2
Momentum and can bite with it. The simulator trims (`engine.py` 1546-1548). Foundry is wrong.

Fix: `trimMomentum(rec, combat, snap.field)` after the placements are recorded (the helper already reads the pending
placement rows). Do the same in `gmPlaceTitan` (`engine.ts` 1681-1691) so the ruling leaves a legal state.

### M2. Foundry: a zone turned Open grounds every anchored soldier in it even with no standing Titan there

`foundry/src/tracker/engine.ts` 114-127, called from 1037 and 1651.

`zoneBecomesOpen` computes `standing` only for the Blind Spot conversion; the `anchored` branch runs for every
soldier in the zone whatever stands there. 16-21 and `positions.yaml`, `zone-becomes-open`, condition the whole rule
on "while a standing Focus Titan is in it". The simulator applies both halves only when the Titan stands in the zone
(`engine.py` 1497-1507). Foundry is wrong: a zone wrecked to Open by a falling body (a corpse is not standing), or set
Open by ruling in an empty zone, knocks soldiers out of the air.

Fix: return early from `zoneBecomesOpen` when `standing` is empty.

### M3. Foundry: the Titan standing up in an Open zone is not applied

`foundry/src/tracker/engine.ts` 1286-1291.

`anchor-ratings.yaml`, `grounded_titan`, `ends` (16-21): when the Titan has no Broken leg, "in an Open zone, meaning
the zone the Titan is in: a soldier who holds blind-spot relative to it then holds on-body instead". The stand-up step
does nothing to the placements. The simulator applies it (`engine.py` 2447-2451). Foundry is missing the rule: a
Blind Spot soldier is left at a Blind Spot that no longer exists.

Fix: in the `stands` branch, when the Titan's zone rating is the Open rating, rewrite each `blind-spot` attachment
naming it to `on-body`, with a line in the note.

### M4. Foundry: the Open Terrain Trait reads the field rating, not the soldier's zone

`foundry/src/tracker/roll-context.ts` 100.

`terrainBreakAttentionDice(snap.anchor, s.mounted)`: `snap.anchor` is `ratingOf(field.rating)` (`snapshot.ts` 207).
16-5: "a mounted soldier's Break Attention gains 1 Bonus Die when the soldier is in an Open zone". On a Wooded field
with a wrecked Open zone the rider gets no die; on an Open field rider in a Sparse zone gets one.

Fix: pass `ratingOf(zoneOf(snap.field, s.zone)?.rating)`.

### M5. Foundry: the mounted charge is forced, and its Titan is not the rider's choice

`foundry/src/rules/engagement/positions.ts` 176-182; `foundry/src/tracker/engine.ts` 731-732;
`foundry/src/board/app.ts` 186-199.

`moveOptions` lists every Titan a mounted move touches in `charge`; the board sends the option as is, and
`checkedMove` keeps `o.charge.filter(...).slice(0, 1)`, the first label alphabetically. So every mounted move into or
out of a Titan's zone sets the loudest flag unless Quiet is paid, and the board's prompt treats it as a crossing
("goLoud" or "goQuiet"). `anchor-ratings.yaml`, `mounted_charge`: the move "may set the loudest flag on one such
Titan, the rider's choice", "the only move that sets a flag by the soldier's choice". A rider who has no Momentum
cannot ride past a Titan without drawing it.

Fix: split the offer from the choice. `moveOptions` keeps `charge` as the Titans a charge could name; the request
carries `charge: []` by default; the board's drop menu offers "Charge A" (one entry per Titan) beside a plain move,
and never offers Quiet for a charge. `checkedMove` accepts at most one label that is in the offer.

### M6. Foundry: a player's zone move is not checked against the move already spent

`foundry/src/rules/engagement/guard.ts` 202-218; `foundry/src/tracker/engine.ts` 740-758;
`foundry/src/rules/engagement/positions.ts` 315-320.

Neither the `zone-move` rules check, nor `requestZoneMove`, nor `moveOptionsFor` (the board's lit destinations) reads
`snap.movesSpent`. A player can drag the same soldier again and again in one turn, or post two Flight prompts before
either is answered; each lands. The rule is one move per turn, and the swap check already reads `moveSpent`
(`positions.ts` 441). The old `movePosition` path had the same gap, but the board makes it one gesture now.

Fix: in `checkTrackerRules`, `zone-move` and `quiet`-with-move: refuse when `s.movesSpent.includes(soldier.id)`;
have `moveOptionsFor` return `[]` for a spent soldier so the board lights nothing; mark the move spent when the Flight
prompt is posted, not when it is answered. The GM's Direct Control stays the override.

### M7. Foundry: a mounted soldier's move cannot include a dismount or a mount

`foundry/src/rules/engagement/positions.ts` 225-239.

`if (!s.mounted)` withholds every on-foot option from a mounted soldier, and nothing adds a mount after a move.
`horses.yaml`, `within_a_move` (16-12): "A move can include one mount or one dismount, made in the zone the soldier is
in before or after that move's steps." In Foundry a rider cannot step on foot into an Urban zone, or make an
attachment step onto a body, without first unticking the horse on the item sheet, which is no move at all and checks
nothing (`ItemSheet.svelte` 253). The simulator implements it (`engine.py` 768-771 and 809-813, `mount(within_move)`
933-944). Foundry is missing the rule.

Fix: for a mounted soldier also offer the on-foot options with a `dismount: true` flag (the horse stays in the start
zone, as the ODM path already does at `engine.ts` 876-881), and for a free soldier whose horse is in the zone offer
mounted options with `mount: true`. `applyMove` writes the horse item and `horseZone`.

### M8. Simulator: retreat option 3 takes attachment steps inside the comrade's zone

`tools/sim/policy.py` 792-800.

When the soldier is already in the fallen comrade's zone, `retreat_toward` makes an attachment step toward the
comrade's Position (for example onto the body toward a Grabbed comrade). `background-titans.yaml`, `retreat`, `moves`,
option 3: "one step that lowers the number of zones between the soldier and a ... comrade". In one zone the number of
zones is already 0, so no such step exists; the soldier must take option 1, 2, or 4. Foundry reads it correctly
(`retreat.ts` 80-84 counts zones only). The simulator gives a bound soldier an extra move that keeps them on the body
during a retreat, which lengthens retreats and raises exposure in the confirming run's retreat rows.

Fix: return False from `retreat_toward` when `s.zone == target.zone`; the soldier then takes option 4 after an action,
or option 1.

## Minor

### m1. Foundry: Frenzy's rate and cap are constants, not data

`foundry/src/rules/engagement/cards.ts` 131-141. `FRENZY_CAP = 3`, `FRENZY_RATE = 3`. `titan-format.yaml`,
`frenzy`, `rate` and `cap` are the source (ADR-0012), and the simulator reads them (`rules.py` 864-866). The test at
`engagement-rules.test.ts` 491 pins the literal, not the data, so the next retune of the rate would pass every Foundry
test while Foundry plays the old rate: the same defect the rate had before. Fix: export `frenzy: {rate, cap}` from
`engagementConfig` (`tools/config-data.ts`), read it in `frenzyAfterRound` and `view.ts`, and test it equal to the
YAML as `zones.test.ts` 47 does for the zones.

### m2. Foundry: rating ids hard-coded where the simulator derives them from the data

- `zones.ts` 292: the Sparse grace reads `from === 'sparse'`. The simulator finds the rating whose trait names the
  first wreck (`rules.py` 709-713).
- `positions.ts` 37, 234, 280 and `engine.ts` 1037, 1651: `'open'` for the grounded extra step, the mounted stop, and
  zone-becomes-open. The simulator reads `R.open_rating` (the rating that is its own `sparser`) and
  `R.grounded_extra_rating`.
- `positions.ts` 12-40: the grounded permissions (`NEAR_GROUND`, the on-body to blind-spot pair, on foot yes, mounted
  no) are encoded, with no guard against `grounded_titan` in the data.
- `harm-rolls.ts` 53: `'giant-forest'` for the fall raise (the simulator reads `R.fall_raise_ratings`).
- `momentum.ts` 49: `SPEND_COST = 1` while `config-data.ts` already exports each spend's cost.

Fix: add `openRating`, `graceRating`, and `fallRaise` to `ZoneRules` from the data (as `zoneRulesOf` already does
for the ladder) and read the spend costs from `E().momentum.spends`.

### m3. Foundry: unknown ratings and zones fall back silently

`zones.ts` 138 (`ratingRule` returns anchors 0, Carry 0 for an unknown id), `snapshot.ts` 150 (`zone: row.zone ?? 0`,
a zone that does not exist), `snapshot.ts` 69 (`bySize[... ?? 'medium'] ?? 0`, a Stride of 0 for an unknown class),
`engine.ts` 701, 1132, 1133, 1284 (`?? 0` zones passed to `wreck` and board events). A bad row turns into a Titan
that never strides or a wreck that does nothing, with no message. Fix: warn once (`console.warn` plus
`ui.notifications.warn` for the GM) when a lookup misses.

### m4. Foundry: Quiet paid with a Flight that goes nowhere is not recorded

`foundry/src/tracker/engine.ts` 812-822 and 863-868. When the answered Flight has no legal prefix, `o` is null;
`buys` has already taken 1 Momentum and suppressed the no-successes flag, but `applyMove` records Quiet only through
`o?.quiet`, so the soldier's later flags this turn land although they paid. Fix: in `applyMove`, record Quiet when
`extra.quietPaid` whether or not `o` is null.

### m5. Foundry: `boardEvent` sequence can collide across concurrent recorders

`foundry/src/tracker/engine.ts` 99-103. `seq` is `max(pending, combat.system.boardEvent.seq) + 1`, read when the
event is built. Two GM-side operations in flight at once (a Flight answer and a card start, both async) read the same
committed seq and both write `seq + 1`; every client drops the second as a replay (`app.ts` 204). Fix: compute `seq`
inside `Recorder.commit` from the document's current value, or use a monotonically increasing client counter combined
with the round and a timestamp.

### m6. Foundry: board start and teardown can race

`foundry/src/board/app.ts` 493-512. `board` is assigned before `await b.start()`; a `deleteCombat` during the load
destroys it, then `start` continues, sets `ready`, and draws on a destroyed renderer. Fix: after `await b.start()`,
return if `board !== b`, and guard `redraw` on a `destroyed` flag.

### m7. Foundry: board failures reach only the console

`foundry/src/board/app.ts` 343-345, 397-400, 447-450, 506-509. A refused or failed move, a failed Quiet, and a board
that fails to start are logged with `console.error` and nothing is shown, so the player sees a drop that did nothing.
Fix: add `ui.notifications.error` with a short localized line beside each log.

### m8. Foundry: the zone tooltip writes actor names as HTML

`foundry/src/board/app.ts` 424-436. Soldier and Titan names go into `tip.innerHTML` unescaped; a player who names
their actor with markup injects it into every client's board. Fix: build the lines with `textContent`, or escape with
`foundry.utils.escapeHTML`.

### m9. Foundry: a wording entry is stale

`pnpm test` warns: `foundry/wording/statuses.yaml` (`statuses.carrying`) was written against
`data/gear/carrying.yaml` sha `f93f5ee2329e`, now `5bc97040dbdd` (16-23 changed where a set-down comrade is). Fix:
check the sentence against the new source and record the sha.

### m10. Simulator: the Open and Urban Terrain Traits are not modelled, and not listed as not modelled

`tools/sim/engine.py` 984-995 (a Jam drops any airborne soldier; Urban's Blind Spot soldier "is anchored to a roof and
is not airborne"), 2115-2124 and 2166-2194 (no Open Bonus Die for a mounted Break Attention). Both read the soldier's
zone after 16-5. Neither touches the reference start (a Wooded field reaches Open only by two wrecks, and Urban only on
an Urban field), but the Urban field row (`cases.py` 231) and wrecked Open zones read without them, and the module
docstring's "Not modelled" list (`engine.py` 60-63) does not say so. Fix: model both (a `jam_drops` check on the
zone's trait, and the die in `break_attention` when `s.mounted` and the zone is Open), or list them as not modelled.

### m11. Simulator: a stale comment on the Frenzy rate

`tools/sim/engine.py` 2440: "every even-numbered round at rate 2 (round 3 retune, R1)". The rate is 3 (Z2). Fix: "every
third round at rate 3 (zone retune, Z2)".

### m12. Foundry: the retreat check is not repeated when a Flight is answered

`foundry/src/tracker/engine.ts` 797-823. `checkedMove` applies the retreat's options when the Flight is asked, but the
answer re-checks only the route (`routeOption`). A retreat that begins between the ask and the answer (the end steps
fill the clock) lets an unbound Flight land. Fix: run the same `retreatOptions` comparison in `flightResolver.apply`
and cut the Flight to no step when it fails.
