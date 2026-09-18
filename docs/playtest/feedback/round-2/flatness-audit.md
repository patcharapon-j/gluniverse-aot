# Round 2: a sweep of the whole ruleset for the same flatness the ODM note found

Owner direction (verbatim): "also while you are working on this, check ALL part of the rule to see any similair issue exist"

Research and opinion only. No rule was changed and no YAML was edited. Companion to `odm-movement-feel.md` and `odm-and-environment-design.md` in this folder.

## Method

The ODM note turned out to be four distinct failure modes wearing one coat. This sweep applies those four as a lens to every data file under `data/` (the source of truth under ADR-0012) and to `docs/rules/01` through `07`:

- **F1 Unreachable.** A rule exists but play almost never reaches it.
- **F2 No stakes.** An option whose failure costs nothing, which a free alternative dominates, or which actively harms the player who takes it as written.
- **F3 Wrong timescale.** A resource tuned so that it cannot bite inside the scene where it is spent.
- **F4 Orphan content.** Talents, Specialties, or attributes attached to F1 rolls.

Claims below were checked by enumeration over the YAML or against `docs/reviews/simulator-report.md`. Where the simulator has a measured figure, it governs and is cited. Coverage is the mechanics, not the prose: this is not a wording or conformance review.

## Findings, worst first

### 1. Mounted movement has no unique step anywhere in the game (F1, F4). Chapters 4 and 5

Enumerating all 20 Position step rows in `data/engagement/anchor-ratings.yaml`: **there is not one step a mounted move can make that a move on foot cannot.** Every row with `mounted: true` also has `on_foot: true`.

| Movement mode | Steps only it can make |
|---|---|
| ODM | 14 of 20 rows |
| On foot | 0, but it covers every mounted row |
| **Mounted** | **0** |

So "mounted" is a third named movement mode that moves a soldier nowhere a walk would not. A horse's entire value inside a Titan Engagement is its Gear Dice on the dodge and Break Attention, plus the riderless-horse decoy. This is the exact shape of the ODM finding one level down: a whole mode of movement with no movement to call its own, and the Rider Specialty carries the same unfunded promise the Flier does.

Cheapest fix in the same family as the Anchors design: give the horse one step nothing else has (a mounted-only Distant to In Reach *charge* that also sets the loudest flag, or a mounted two-step at Open where nothing else moves). Effort S plus a rerun.

### 2. Draw Attention is a trap, not a flat option (F2). Chapter 5

This is worse than flat and should be looked at first.

Measured (`simulator-report.md`, section 6.7, cutters take Draw Attention while a striker holds Attention): **Critical Injuries z +9.7, deaths through the end z +2.5**, and the kill is no faster. Section 6.6's Read row that adds it repeats the result: **Critical Injuries z +10.1**. Taking the action as its text invites makes the fight substantially worse.

The ladder explains why, and the reason is deliberate. Draw Attention sets the loudest flag, which is **rung 4** of the standard ladder. Standing at In Reach is **rung 2** and free; being On Body or holding the hooked-by-strike flag is **rung 1**. So:

- A soldier at In Reach or On Body already outranks their own shout. The flag changes the outcome only as a tiebreak among soldiers who already meet the same higher rung.
- It **cannot** do the thing players will assume it does. A striker who falls short holds hooked-by-strike, rung 1; a comrade shouting from In Reach sets rung 4 and the Titan still turns on the striker. ADR-0010 says so on purpose: "no rung, noise included, turns a Titan off a blade at its Nape or a soldier On Body."
- A soldier at Blind Spot who uses it forfeits the Nape strike, which requires not holding Attention.
- `simulator-report.md` 6.7 also counts 0.49 attempts a fight **barred** because the soldier was at Distant.

So the one action in a Titan Engagement with no Talent attached to it is also the one that punishes the player for reading its name. The rule is correct under ADR-0010; the **presentation** is the bug. Either the packet says plainly what it can and cannot do, or the action earns a real effect (for example, it makes the drawer count one rung higher rather than setting a rung-4 flag). Effort XS for the wording, M plus a rerun for the mechanical version.

### 3. Blade Sets cannot run out in a fight (F3). Chapter 4

The most repeated image in the show is a soldier discarding spent blades. In play:

- A Blade Set is ruined **only** by wear from a Pushed roll (`blade-sets.yaml`, `wear`). Issued sets are rating 1, so one point ruins one, at **1/6 per Pushed strike** (a Gear Die is never re-rolled and its 1 is locked).
- **Swapping is free**: once per turn, at any point, spending neither the move nor the action.
- A Funding 3 Rookie carries **3** Blade Sets (`standard-issue.yaml`).
- The reference fight is **3.91 rounds** and a striker makes roughly two or three strikes in it.

A soldier would have to Push nearly every strike, and be unlucky, to reach their last set, and reaching it costs a free swap. Blades are the same shape as gas: a consumable tuned to an Expedition and spent inside a scene it cannot reach. If the owner wants the blades to bite, the lever is the swap (make it the move, or the action) rather than the ruin rate, because raising the ruin rate taxes the Push, which ADR-0004 makes the player's one lever.

### 4. WITHDRAWN: "Health is barely touched by the primary threat"

**This finding was wrong and is withdrawn.** It was checked again against `data/harm/health.yaml` after the owner queried it.

Health is not inert. Health is kept as a row of boxes, and an untreated Critical Injury **crosses one off** (`health`, `boxes_crossed_off`). A Critical Injury that crosses off the last box makes the soldier Down (`critical-injuries.yaml`, `down-check`). So a soldier's Health rating is exactly **how many untreated Critical Injuries they can carry before they go down**, and Critical Injuries are the only thing a Titan inflicts. Health is the buffer the whole Titan threat is spent against.

What is narrowly true is much smaller and is not a defect. `titan_attacks` carries `harm_kind: critical-injury` and `never: damage`: a Titan attack never adds to **Health lost**, the damage track. So inside a Titan Engagement that one track moves only from falls, steam, corpse heat, and a ruling's staked damage. That is ADR-0005 working exactly as written, and the round 1 measurement it was confused with (`round-1/opposed-rolls.md`) was about damage *amount and threshold* as lethality knobs, not about Health as a stat.

No action. The finding is left in place rather than deleted so the error is on the record.

### 5. Sparse and Wooded are the same battlefield (F1). Chapter 5

Enumerated: the two ratings have identical step rows except that Sparse's In Reach to Blind Spot step needs a Fly roll and Wooded's does not. Five named terrains, and two of them differ by one die roll that (per `odm-movement-feel.md`, finding 2) stakes no Position.

`tools/probes/round-2/swing.out` shows what the ratings actually do: they set how fast a striker reaches the Nape, monotonically, and nothing else. Giant Forest gives it on round 1, free, guaranteed; Wooded on round 2; Open never while the Titan stands. The environment is a speed dial with no trade-offs on it. This is the environment half of the owner's note and the reason `odm-and-environment-design.md` proposes Anchors and Terrain Traits rather than more step rows.

### 6. WITHDRAWN: "Wits and Empathy barely touch a Titan Engagement"

**This finding was overstated and is withdrawn.** It was built from `attributes.yaml` `used_by` alone, without reading what those entries do in a fight.

- **Wits, Treat Injury.** `treat-injury.yaml` `in_titan_engagement` makes it an action at the patient's Position, and its `treat` use makes a named Critical Injury treated and **gives back the Health box it crossed off**. Since a Critical Injury crossing off the last box is what makes a soldier Down (finding 4), a Medic in a fight can take a comrade off the floor. That is one of the strongest actions in the chapter.
- **Wits, Field Repair.** It clears a Jam mid-fight. The simulator measures 1.06 Field Repairs in the lone Jammed fight (`simulator-report.md`, section 8), so it is load-bearing, not decorative.
- **Empathy, Rally.** It clears a Stress Response, which is a lasting dice penalty on the entries the soldier most needs.

What remains true is a statement about the **measured baseline policy**, not about the rules: `tuning.yaml` `full_fight` excludes Treat Injury during the fight, so the tuned figures do not show the Medic's fight value. That is a gap in what has been measured, not a thin attribute.

No action, beyond noting that a simulator case for a Medic treating during a fight would be worth having.

### 7. Leap Clear is the only ODM roll with no Talent (F4). Chapter 5

`odm-gear.yaml` `rolls_it_rates` is `[dodge, break-attention, fly, leap-clear]`. Talents name the first three (dodge 5, Break Attention 7, Fly 3) and **none** names Leap Clear. It is also called only by the falling Titan, so it is rare and unsupported at once. Draw Attention is the matching gap on the action side: the only Titan Engagement action no Talent names.

## Checked and healthy

Recorded so the sweep is not read as "everything is flat".

- **Read and Call It** are the opposite of the Fly roll. The simulator measures a Tactician Reading from Distant every round and Calling It at **deaths through the end z -3.2 to -5.8 and Critical Injuries z -2.2 to -3.8**, with the kill no slower (`simulator-report.md`, 6.6). The information action pays for itself handsomely. It is the model for what a movement option should feel like.
- **Openings and Regeneration** are a live clock, not a flat one: a Medium Titan's Regeneration clock is 3 rounds against a 3.91-round fight, a Small Titan's is 2 against 2.81, so Openings really are erased mid-fight and the Squad really does race the clock.
- **Break Attention's escalation** (+1 to the need for each decoy in a row) is a genuine decision with a rising price, and the Feint keeps a lone soldier's route open without making it free.
- **The Grab** and its countdown are the sharpest thing in the chapter and need nothing.
- **Behavior Table reachability** was already audited: `simulator-report.md` section 4.1 checks every table's In Reach results against a floor of 4 of 6, and every standard table Meets it.

## Suggested order

1. **Draw Attention** (finding 2). It is the only finding where the rule as printed actively harms the player who follows it. Wording fix is XS and can ship with the round 2 packet.
2. **Anchors and the Swing** (`odm-and-environment-design.md`), which carries findings 5 and, with one extra row, 1.
3. **Mounted movement** (finding 1), folded into the same rerun as 2 so the horse and the harness are retuned together.
4. **Blade Sets** (finding 3) if the owner wants the blades to bite; it is a small lever with a large feel change.
5. Finding 7 is recorded, not recommended: Leap Clear having no Talent is small and can wait. Findings 4 and 6 are **withdrawn**; both were errors, and both are kept on the page with the correction rather than deleted.
