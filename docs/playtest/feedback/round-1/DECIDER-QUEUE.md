# Decider queue: round 1 implementation

Questions the drafters raised while implementing batch 7. All seventeen were settled by the Fable decider in decision batch 8 (`docs/rules/DECISIONS-2026-09-14.md`, 2026-09-15; OQ-148 indexes items 1 to 16, OQ-147 item 17). Each item below keeps its question and carries its ruling and the batch 8 item that records it. Stale text found outside a package's sections is listed for the package that owns it.

## From WP-0 (Catalog, firearms, supply)

1. 7-17's "no Gear Dice" is read as applying only inside a Titan Engagement, so Shoot uses the firearm's Gear Dice. **Settled (8-12):** confirmed; a Pushed 1 wears the firearm, and one at 0 cannot be fired until Field Repair or Maintain Gear. WP-F.
2. Firearms arrive empty. Is Reload outside a Skirmish possible at any time? **Settled (8-12):** yes, outside a Skirmish and a Titan Engagement, for 1 shot and nothing else; it stays loaded until fired. WP-F.
3. At a Standard Issue exchange, a kept item stays as if declined. May the soldier accept the exchange instead? **Settled (8-12):** yes, handing the kept item in; keeping is the default. WP-F (`standard-issue.yaml`, Chapter 4 section 4.9).
4. Letting go of a Held Foe has no Catalog entry (ADR-0003 item 12 asks for one). **Settled (8-12):** a new option `release`, no roll, spends nothing, changes `held-end`; a Foe never releases. WP-F.
5. Does a landed Grapple also deal damage? **Settled (8-12):** no; it sets Held, and the holder Fights bare-handed on later turns. WP-F.
6. Each roll changes only what its calling rule reads, narrower than the proposal's tracked-values sketch. Confirm. **Settled (8-12):** confirmed.
7. Rations stock prints as a sentence because `tools/render/render.py` cannot render it as a column. WP-F may fix the renderer. **Settled (8-12):** render it as a column; WP-F extends the renderer.

## From WP-S1 (simulator engine, part 1)

8. `lost_limb_riders` (7-6) is not modelled, so lost limbs do not carry into later fights in the sequence cases. Model them, or list them as unmeasured in the report? **Settled (8-13):** list as unmeasured, with prosthetics (8-10), naming the Straggler and the Bite rider as the rules that reach them.
9. For WP-D to confirm: a forced move happens even on a spent turn, and nobody picks up a dropped Blade Set. **Settled (8-13):** both confirmed; the Blade Set is left at the Position and shared out at the end as left items are.

## From WP-C (Critical Injuries step 1)

10. Two lost legs stack to a 4-die dodge penalty in the grades; the batch says 2. Which? **Settled (8-11):** 4; the rows' permanent effects stack per side, and 7-6's "2-die" described one row. WP-C2 corrects the YAML comment and the chapter's "keep the 2-die penalty".
11. Both arms lost: the batch does not say whether Shed Load, Mount or Dismount, the cloak and horse decoys, and ODM Gear Dice on the dodge are allowed. Left allowed. **Settled (8-11):** Shed Load allowed; Mount or Dismount only with a comrade's help (a comrade at the same Position who is not Down spends their action); the thrown-cloak decoy forbidden and the horse decoy allowed; no ODM Gear Dice on the dodge (the horse's while mounted). WP-C2.
12. Both legs lost: "hold the Position they are placed at" is read as forbidding mounted moves too. How does anyone move such a soldier, given Lift Comrade needs a Down comrade? **Settled (8-11):** the reading stands; Lift Comrade may carry a soldier the both-legs grade or Pinned forbids to move, at their consent, and a carried soldier who is not Down keeps their action for entries that need no move. WP-C2.
13. Medical Retirement: can Squadmates take it, and is declining final? **Settled (8-11):** Squadmates may, chosen by the players as one table; declining is not final, and the choice is offered again at the end of every Downtime while the grade applies. WP-C2.

## From WP-A (creation and Squadmates)

14. Free Build reported Squad: second 4 on Agility, 2s on Wits and Empathy; Talent 2 only on each soldier's own measured roll, since a Free Build allows one Talent at 2. Confirm this reading of ADR-0014's "Talent 2 on the roll each target measures". **Settled (8-13):** confirmed; 8-3 adds a Health 2 Free Build row beside it. WP-S1 part 3.
15. "Start with fewer Squadmates" was made a shared player choice, not the GM's session-zero call. Confirm. **Settled (8-13):** confirmed.
16. 7-1 says a Free Build has Health 4 or 3, but the 4, 4, 3, 3, 2, 2 array allows Health 2 and Resolve 2. The chapter now says 2 to 4. Which is intended? **Settled (8-3):** 2 to 4; the owner allowed Health 2, the chapter calls it fragile with its measured cost, and 7-1 is amended. WP-R adds the sentence to section 2.11.

## From the owner (2026-09-15)

17. **Prosthetics.** The owner wants a prosthetics option for a soldier who loses limbs, as an alternative to medical Retirement. Design it within ADR-0016: Paradis technology 845 to 850, invented items only through Requisition or Discovery. Cover what a prosthetic restores from the `lost_limb_riders` grades (ODM use, strikes, riding), its cost or availability, and whether it applies to one limb or both. The simulator does not model lost limbs (item 8). **Settled (8-10; OQ-147):** a prosthetic arm or leg per lost side, Requisition at Limited (or a Phase 2 Discovery), fitted at a Downtime after the loss heals; each lowers the grade one step (both to one, one to none), two never past the one-limb grade, and none removes the 13+ rows' own penalties; rated none, no dice, no item count, never a weapon; a player character may Requisition one for a Squadmate. WP-C2 and WP-F.

## Round 2 queue (raised after batch 8)

Items 18 to 25 were settled by the Fable decider in batch 8 items 8-16 to 8-19 (2026-09-15; OQ-151 indexes them). Each item keeps its question and carries its ruling. Item 26 (WP-B) is open.

### From WP-D (Fear table re-cut)

18. A forced strike that the soldier cannot legally make stays pending, and they take no other action until Rally, the Titan's death, or the fight's end. Should it lapse instead? **Settled (8-16):** no. It stays pending until made, Rally, the Titan's death, or the end; it waits while the soldier is Pinned as it waits while Grabbed or Down (a limb-pinned soldier's strike on the pinning limb of the event's Titan counts); Swap Blade Set is the one other action allowed. WP-C2 (`effect-types.yaml` `forced-action`; section 3.9).
19. "The event's Titan" for a Fear result that draws Attention: for a first fight, or a death no Titan's card or Grab caused, WP-D used the nearest Titan found by the fall rule's order. Confirm. **Settled (8-16):** confirmed; no change.
20. "Hesitate included" still appears in Chapter 5 section 5.13 and `data/engagement/tuning.yaml` as the record of the old measurement. Keep it as history, or reword after WP-S2? **Settled (8-16):** keep it until WP-S2; the verdict pass after the rerun replaces it with "every row of the re-cut table" in both places. Not WP-D's.

### From WP-S1 part 3 (simulator engine)

21. **Cutting free from a pin.** Batch 8 says cutting the pinning limb frees a Pinned soldier but names no Titan Body Part that pins. Which part pins (by Position, or the part the body falls on), and what does cutting it take? **Settled (8-17):** the Titan's Body Part of the same kind and side as the soldier's rolled Injury Location (the other of its kind if Broken; none if both are, when only Heave or a standing Titan frees); a body pin names none. Cutting it is the existing Body Part strike (Strength with the Blade Set, from In Reach or On Body, the pinned soldier included), counting toward its Toughness; Broken frees everyone it pins at In Reach; no flag and no Openings on a corpse. WP-C2 and WP-S1.
22. **Contradiction.** 8-11 lets Lift Comrade carry a soldier whom the both-legs grade or Pinned forbids to move, at their consent. 8-9, and WP-C2's section 4.7 line, says a Pinned soldier is not lifted. The engine followed 8-9. Which is right? **Settled (8-18):** 8-9. "or Pinned" is struck from 8-11; Lift Comrade's widened row names the both-legs grade only. A carrier whose Leap Clear fails is Pinned with the comrade, each with their own Crush Critical Injury. WP-C2 (`carrying.yaml`, section 4.7) and WP-S1 (as followed).
23. **Readings to confirm.** A Grabbed soldier is outside the falling Titan's path, and a Grab cannot take hold of a Pinned soldier. **Settled (8-18):** the first is amended: a soldier in another Titan's hand, or in the falling Titan's hand at a grounding, is outside the path; one freed by the holding Titan's death holds On Body for the steam and the fall and is in it (Leap Clear, or pinned with no roll if Down). The second is confirmed, with the crush landing: a Grab on a Pinned soldier lands its torso Crush Critical Injury and takes no hold, no countdown, no witnesses' Fear Roll. WP-C2 (`titan-harm.yaml`, `grab.yaml`; sections 5.7 and 5.9) and WP-S1.

### From WP-R (done)

24. 8-2's worked example says a roll of 5 against a Reaction of 2 gives 2D6+3, but the rule (+1 per net success beyond the first) gives +2. WP-R followed the rule. **Settled (8-19):** the rule stands; the example is corrected to 2D6+2 in 8-2; ADR-0019 carries no example; Chapter 3's example stands.
25. A telegraph-only entry leaves out `attack_dice` instead of listing 0. Confirm. **Settled (8-19):** confirmed.

Noted, no decision needed: the Grab table in Chapter 5 section 5.9 shows Attack Dice beside cells measured under Severity; WP-S2's rerun refreshes them.

Routed to packages, no decision needed: the Health 2 Free Build reported row needs `reported_squad_health_2` in `data/character/attributes.yaml`, now in WP-C2's scope (`IMPLEMENTATION-PLAN.md`), mirroring `reported_squad` with Health 2 (8-3). WP-C2's YAML keys should match what the engine reads, or the engine reconciles when they land.

Routed to packages, no decision needed: widening the Catalog value `stress-response-clear` to pending Fear results (WP-F, under the action-catalog lock); the end-of-fight step in `engagement-end.yaml` and section 3.16 cancelling pending Fear results and sharing out dropped Blade Sets (WP-F).

### From WP-B (full Talent list)

26. Once WP-C2 adds `leap-clear` and `heave` to the Catalog, should the Brawler list gain a Heave Talent (or a general one)? Batch 8 forbids dice on Leap Clear, not on Heave. **Settled (8-26):** neither list gains a Talent. Grip Breaker names `heave` beside `break-free` (description: "Tearing free of a grip, even a Titan's, and heaving its body off a comrade."), so the Brawler keeps eight and the general list twelve; a sensitivity row on the pin rows (WP-S1 part 2b). WP-B, after WP-C2's Catalog entry lands.

## Round 3 (settled in batch 8, 8-20 to 8-30; OQ-162 indexes them)

### From WP-C2 (logged as OQ-156 to OQ-161)

- (a) Positions relative to a corpse during the run-on. **Settled (8-20):** a Position relative to a corpse is a Position in the Titan Engagement for every rule that reads one; comparisons with no Focus Titan alive are relative to the corpse of the Titan that died last (amended from the earliest label); Heave and the strike on a pinning Body Part are the only acts against a corpse. OQ-156.
- (b) Still Pinned at the end. **Settled (8-21):** every Pinned soldier dies under the body when no-soldier-standing ends the fight, whether or not a Focus Titan is alive; the others die only while one is; the retreat's options 3 and 4 read a Pinned comrade. OQ-157.
- (c) The heave count after a re-grounding. **Settled (8-22):** amended; the count is cleared when a living Titan stands, and by nothing else. OQ-158.
- (d) Lost limbs with Leap Clear and Heave. **Settled (8-23):** both arms: Leap Clear with no ODM Gear Dice, Heave forbidden; the lost-arm row's penalty list gains `heave`; both legs: Leap Clear allowed, the lost-leg row's penalty list gains `leap-clear`. OQ-159.
- (e) The Burn rider's medical supplies. **Settled (8-24):** confirmed; the care-bonus spend is the unit, so a fight needs a kit that counts as had. OQ-160.
- (f) Mount with help outside a Titan Engagement. **Settled (8-25):** confirmed; in a Skirmish a comrade taking part who is not Down spends their action; elsewhere a comrade on the same Expedition (or in the Squad) who is not Down helps, spending nothing. OQ-161.
- The markers `PROVISIONAL (OQ-152)`, `(OQ-153)`, `(OQ-154)`, and `(OQ-156)` in `positions.yaml`, `engagement-flow.yaml`, `titan-harm.yaml`, and `treat-injury.yaml` collide with WP-F's register numbers and are replaced by citations of 8-20 to 8-24.

### From WP-F (OQ-152 to OQ-155) and the coordinator

- OQ-152, the six Expedition readings. **Settled (8-27):** all confirmed.
- OQ-153, the Downtime readings. **Settled (8-28):** (a) and (b) confirmed; (c) amended: granted Requisitions arrive before prosthetics are fitted, then the Retirement offer, then retirements and promotions; (d) Downtime Actions get two Catalog option entries, `downtime-action` and `squad-action`, with the tracked values `stress-lower`, `grief-lower`, and `squad-recruit`.
- OQ-154, the Requisition readings. **Settled (8-29):** all confirmed.
- OQ-155, the Skirmish readings. **Settled (8-30):** nine confirmed; (e) amended: Burn kills a Foe at 0 Health, Crush alone puts one out cold, and the first-human-kill trigger reads Cut, Pierce, or Burn (ADR-0018 amended); (j) confirmed: no Foe Grapples in the playtest, Held stays soldier-only until Phase 2's Foes.

Routed to packages, no decision needed: Horse Whistle's exception in `positions.yaml` (WP-C2). WP-F is checking five Talents that cite Chapter 7 terms (Lookout Tree, Forager, Campfire Talk, Hard Rider, Headlock).

## Open after WP-T

27. **OQ-165 (provisional, from WP-T).** A standing soldier with both legs lost cannot walk out when the 8-round stay limit closes (8-32), so `always_ends` could still fail. Provisional reading: past the stay limit, such a soldier is not standing, lives, and goes through the end steps. Decide with the review fixes; lost limbs are unmeasured. **Settled (8-34):** (a) confirmed, with the test named by the grade: past the stay limit with no Focus Titan alive, a soldier whom a lost-limb grade forbids every move, and who is not Down, Pinned, or carried, is not standing. It is checked as the first round past the limit begins. They keep their turns, a comrade at their Position may still lift and carry them out, and they live through the end steps.

## For the final review (found in passing, not yet fixed)

From the WP-P Actions segment (the packet follows the YAML; the chapters need fixing):
- Chapter 2 section 2.8 says Shoot cannot be taken without a firearm, but the Catalog says Shoot does not need its gear (a fired flare is a Shoot with no gear item).
- Chapter 2 section 2.8 "Groups of entries" leaves out Heave, Leap Clear, Release, Block, Downtime Action, and Squad Action.
- Chapter 7 section 7.4 says Block is made "with a Blade Set"; the Catalog says with a Blade Set if you have one.
- Question: Squadmates list only the dodge as a Reaction, but Chapter 7 says Squadmates take part in Skirmishes like PCs. Can a Squadmate Block?
- Fly has no needs value in the Catalog ("as the step gives"). Confirm it is intended.

From the WP-P Talent segment:
- Chapter 2 section 2.7's design note says no Talent names Heave yet, but Grip Breaker now does (8-26).
- Four measured Talents never fired in their sensitivity rows (Tourniquet, Got Your Back, Formation Drill, Gallows Humour). Tag them as unmeasured in the packet, or fix their rows?
- The packet's Talent tags were set from the WP-S2 report. Re-check them against the final rerun's report.
- Lookout Tree says "a forest or a giant forest" in lowercase. Should it be the Anchor Rating names?

From the WP-P Making a Soldier segment:
- `data/character/attributes.yaml` `used_by` omits Heave, Leap Clear, and Shoot, which the Catalog gives Strength, Agility, and Agility.
- `data/character/squadmates.yaml` still says the Downtime Actions row is "set by the Downtime rules (not yet written)"; `downtime.yaml` now sets it.
- Chapter 2 section 2.3.1 still calls the Downtime rules "not yet written" (the Haven's use is Visit Haven).

From the WP-P Gear segment:
- Chapter 4 sections 4.2 and 4.5, and `data/gear/items.yaml`, list what ODM Gear and the horse rate without Leap Clear. The Catalog and `titan-harm.yaml` add Leap Clear.
- `data/gear/blade-sets.yaml` records only a set in the handles and a count, while `sheet-fields.yaml` records a rating per set. The packet follows `sheet-fields.yaml`; reconcile the two files.
- The horse's "left as a decoy" state exists only in `sheet-fields.yaml`.

From the WP-P Harm (body) segment:
- Chapter 3 section 3.2 step 6 says a type rider's fields "replace" the row's fields. `critical-injuries.yaml` actually multiplies the healing days, stops healing while untreated, and adds a Treat Injury requirement or penalty.
- Chapter 3 section 3.5 covers aftermath rolls only at a Titan Engagement's end. `engagement-end.yaml` also gives them at a Skirmish's end.
- `data/harm/health.yaml`'s day-restoring row still calls the Expedition and Downtime rules "not yet written".
- Reading to confirm: the both-arms 4-die strike penalty applies once a prosthetic lowers the grade, since the both-arms grade forbids strikes outright.

From the WP-P Playtest rules segment:
- `data/campaign/downtime.yaml` and Chapter 7 section 7.2's infirmary healing step leave out `healing.yaml`'s rule that an untreated Pierce does not heal (8-15).
- Chapter 7 defines a retreat on a Leg (fall back and ride the Leg again) but not for a Titan Engagement started from the Night table.
- Chapter 7 writes Lead, Depot, Night Camp, Ambush, Shot, and Net Successes in lowercase, but `CONTEXT.md` capitalises them.

From the WP-P GM segments:
- `data/engagement/positions.yaml` says no Phase 1 rule names other starting Positions, but the Straggler and Overrun hazard rows do (Chapter 5 section 5.1, `hazards.yaml`).
- Chapter 5 section 5.5 announces only the behavior and its targets, and has no dead-Titan step, and its decoy step does not end a Call It. `behavior-procedure.yaml` announces name, tier, and targets and has both steps.
- Chapter 5 section 5.4 omits `titan-format.yaml`'s "a mounted target is not affected" by knock loose.
- Readings to confirm:
  - The Abnormal's Heave rating is public.
  - Overrun's clocks each roll a Size Class.
  - A Straggler victim placed at In Reach holds Attention from setup.

From the WP-P glossary, sheets, and feedback segments:
- `data/engagement/round.yaml`'s timed rounds still assume 4 PCs and 2 Squadmates, but the playtest runs with no Squadmates.
- `CONTEXT.md`'s Ambush definition is looser than Chapter 7 section 7.4. `CONTEXT.md` also has no Guard entry.
- `CONTEXT.md`'s Grabbed definition should say "gripped in a Titan's hand", since Held is now Skirmish-only.
- The packet's glossary adds later-Phase terms (Discovery, Commendations, Faction, Faction Standing, HQ Upgrade) because other entries mention them. Confirm they belong in a playtest glossary.

From the WP-P Fighting Titans segment:
- `data/engagement/background-titans.yaml` retreat options 3 and 4 compare Positions to "the living Focus Titan with the earliest label", which is undefined with no Titan alive. 8-20 says to use the Corpse of the Titan that died last; apply it to this file.
- 8-32's "8 rounds" is written in the YAML and Chapter 5 as the retreat clock's length, not as a separate close. Confirm the two are the same (the clock is 8 segments).

From WP-P assembly:
- `CONTEXT.md`'s Camp Relief entry omits the YAML's "not hungry" condition.
- Chapter 1 section 1.6 still says the Expedition rules "will" add a Stress row, but that row now exists.

From the simulator agent:
- `tools/probes/chapter-06/fight6.py` still models the old fixed need. It is being updated to Attack Dice now.

- No Chapter 6 stat block prints a Heave rating, though the YAML carries one (WP-C2 report). The verdict-pass drafter after WP-S2, or WP-P, should add it.
- Skirmish lethality looked low in the pre-run probe (0.008 to 0.016 deaths against three Bandits), against the owner's "guns as lethal as Titan fights". Check against the full-run figures.

- Em dashes in some rendered table cells and in `tools/render/render.py` output, which predate round 1.
- Three older Talent names that the count script flags against Avoid lists: Hard to Kill, Wide Awareness, Pry Loose.
- `docs/rules/PROGRESS.md` rows for WP-0, WP-C, WP-A, WP-D, and WP-B.

## Done since the queue opened

- Replacement timing: the simulator now has replacements join at the next Titan Engagement per 7-11 (`tools/sim/families.py`), not the next session.
- The queue itself: every item settled in batch 8; `IMPLEMENTATION-PLAN.md` revised for WP-R, WP-C2, and WP-S1 part 3.
- The round 2 queue: items 18 to 25 settled in 8-16 to 8-19; `IMPLEMENTATION-PLAN.md` revised for WP-C2, WP-S1 part 3, and WP-S2's verdict pass.

## Stale text for other packages

- Chapter 2's example calls two Talents dormant (WP-B).
- Chapter 4's intro lists Expeditions, Requisition, and human combat as unwritten (WP-F).
- Chapter 1 section 1.1 item 5 and every "Severity" that names a pool (WP-R).
- Chapter 3 section 3.2's lost-limbs table says "keep the 2-die dodge penalty" and the YAML comment says the same (WP-C2).
- `docs/rules/PROGRESS.md` has not been updated for WP-0, WP-C, or WP-A (whoever finishes the next package updates the rows it owns).
