# Chapter 6, Standard Titans: review round 1

Reviewed:

- `docs/rules/06-standard-titans.md`.
- Every file in `data/titans/`: `roster.yaml`, the four Titans, `tuning.yaml`, and the generated `probe-figures.yaml`.
- The probes in `tools/probes/chapter-06/`, and the Chapter 5 probe code they import (`core.py`, `fight.py`, `simple.py`).
- OQ-100 to OQ-105 in `docs/rules/OPEN-QUESTIONS.md`.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015, as amended.
- Chapters 1 to 5 and their data (`data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`, `data/engagement/`).
- `docs/rules/DECISIONS-2026-09-14.md`, including batch 3 and *Constraints on the undrafted Phase 1 chapters* for Chapter 6.

I did not read the parallel Codex review or the Chapters 1 to 5 conformance review files. No finding concerns OQ-81 itself; a separate section below lists the Chapter 6 content that depends on it.

The odds come from Python scripts in the session scratchpad, not committed. The appendix describes them. Every fight figure imports the drafter's `fight6.py` unchanged, or subclasses it for exactly one change, with fresh seeds.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**0 Critical, 6 Major, 12 Minor.**

The three standard Titans are sound and ready once the Majors on text and sensitivity rows are addressed:
- Every table is complete and rollable.
- Every value comes from its Size Class row.
- No entry rests on GM discretion.
- Every ADR-0014 target is met, and the figures reproduce on fresh seeds.
- The strict kill-share reading (OQ-101) is the right call, and each table was built to pass it.

The Sprinting Abnormal is where the work is. Its reported figures come from a model that leaves out two rules bearing directly on it (finding 1), and the riders row that justifies OQ-102 has a probe bug (finding 2). Corrected:
- The Abnormal kills in a median of round 3, not 2.
- 18.3% of fights have no kill within 12 rounds, 1.7 points under its own one-fifth bar.
- It deals 0.435 deaths per fight, 13 times the standard Medium Titan's.

The Abnormal's bar has no ceiling on lethality (finding 5).

A lone soldier against a Tempo 2 Titan (the Small Titan and the Abnormal) almost never gets a usable Nape strike under the current Break Attention rules (finding 3). Chapter 6's per-strike figures of about one in three hide that.

## Checks that passed

- **Tooling.** `render.py check` reports every rendered block matching its YAML, and `titans.py` reports 0 problems for all four Titans.
- **Stat blocks.**
  - Each standard Titan's Tempo, Nape Depth, Regeneration clock, Toughness by kind, and Severity by tier match `size-classes.yaml`.
  - Each has the five standard Body Parts in order and the standard ladder.
  - The Abnormal's values are inside the batch 3 range (Tempo 1 to 2, Nape Depth 3 to 5, Regeneration 2 to 4, Toughness 1 to 3, Severity 1 to 4).
- **Behavior Tables.**
  - Every table covers results 1 to 6, one entry per result, with 1 and 2 terrorize, 3 and 4 control, 5 and 6 kill, and one Thrash with results `[]`.
  - Each table has exactly one telegraph.
  - Every fallback names another entry or Thrash.
  - Every control and Thrash Critical Injury has `cannot_be_lethal: true`.
  - Each standard table has one Grab result and one lethal result.
  - A holder at In Reach meets 5, 5, 4, and 5 results in six. The Large Bite's result falls back to Crush, which works at In Reach.
  - No effect touches a horse, and no entry names death.
- **Move-up shares.** I traced the procedure by hand against `titans.py`'s enumeration:
  - The highest kill share at any previous behavior and any count of Broken eyes, arms, and legs is 0.50 on every table.
  - The fewest legal non-Thrash entries in any state is 2.
  - Under the same reading, the Chapter 5 reference table does reach 4 in 6 (previous Shake Off, both arms Broken), as 6.1 says.
  - Moving Grab to 6 and Bite to 5 is what sends a disarmed Titan's Grab share to a terrorize entry instead of doubling the Bite.
- **Harm (Chapter 3, ADR-0005, ADR-0015).**
  - Every harming effect is a Critical Injury as a Titan attack.
  - The Grab's harm is the torso crush, which cannot be lethal.
  - A knock-loose fall is Chapter 4 damage, not a Titan attack.
  - One exception to the "kills only through" sentence is finding 10.
- **Batch 3 constraints on Chapter 6.** Every item is honoured:
  - The format and values.
  - The table shape, the Injury Location and lethality listing, and the Grab mark.
  - At most one Grab and one lethal result.
  - The four-in-six Position share.
  - No horse effect.
  - The per-table targets at the reference start.
  - The Jam test per table.
  - Move-up shares reported by previous behavior and by Broken parts.
  - Abnormals reported and not tuned.
  - Public and hidden values.
  - No standard entry exceeds its class's kill Severity.

  Chapter 6 also re-ran the lone strike and the Grab cells, which the constraint said need not be re-run. That is harmless.
- **Phase 2.** Nothing is drafted. Shifters, Mission Briefs, Operation Frames, and Research Points appear only as forward references.
- **GM discretion.** None. The GM never picks a Titan, an entry, a target, or a fallback.
- **Example.** The arithmetic checks:
  - Oskar keeps Attention on the nearest-person-in-reach tie.
  - Fixed Grin's telegraph reveals the Grab.
  - Renate takes Attention on the second rung.
  - Her Closing Hand penalty removes one base die (Chapter 1, section 1.3, step 5), giving 2 base, 2 Gear, and 1 Stress Die.
  - Her Push re-rolls the base 2 into a 6, keeps the Gear Dice, and adds a Stress Die, for 3 successes against Severity 3.
- **Fidelity (845 to 850).** The standard tables read like canon:
  - Titans ignore horses, grin, and reach too slowly.
  - They swat soldiers out of the air and paw at their necks.
  - They bite and grab.
  - A Small Titan's mouth is at a soldier's waist, and a Large Titan's is far above the ground.
  - An Abnormal that ignores the nearest soldiers and charges the riders is a fair reading of why the long-range formation existed.

**Figures that reproduce.** My fresh seeds (6,000 fights, 80,000 or 40,000 Grab trials, four Jam seeds of 60,000), then the chapter:

| Figure | Mine | Chapter |
|---|---|---|
| Medium: by round 3, Critical Injuries, deaths, Grabs per fight | 62.6%, 0.68, 0.031, 0.207 | 62.8%, 0.69, 0.033, 0.201 |
| Small: median round, by round 3, Critical Injuries | 2, 80.9%, 0.84 | 2, 81.2%, 0.81 |
| Large: no kill in 12, Critical Injuries, deaths | 13.5%, 1.38, 0.162 | 13.0%, 1.38, 0.162 |
| Abnormal: by round 3, no kill in 12, Critical Injuries, deaths | 70.6%, 11.0%, 1.98, 0.266 | 70.7%, 11.1%, 1.98, 0.267 |
| Abnormal with 2 mounted Squadmates: by round 3, deaths | 84.0%, 0.014 | 84.1%, 0.013 |
| Grab alone (dodge failed), Severity 3 | 69.7% | 69.4% |
| Grab, one comrade, Stress 2 Grief 0, Severity 3 | 33.6% | 33.3% |
| Large, two Titans, Jam worst cell | 32.70% (seeds 32.8, 32.6, 32.8, 32.7) | 32.9% |
| Lone line at Tempo 1: usable strike within 4 and 12 rounds, cards through round 12 | 42.1%, 60.7%, 4.93 | Chapter 5: 42.3%, 60.8%, 4.93 |

## The ADR-0014 targets and how the Titans compare

Every ADR-0014 target these stat blocks control is met on the standard Medium Titan:
- **Squad of 4:** median kill round 3, with 62.8% of fights killed by round 3.
- **Lone Rookie after Break Attention:** 13.3% at Stress 1, inside 8% to 14%.
- **Levi-grade:** 47.2%.
- **Grab:** 69.4% alone, 33.3% with one comrade in reach at Stress 2 and no Grief, and all six cells under 50%.

Across the Titans, for the reference Squad:
- **Small** is the quickest kill: median round 2, 81% by round 3. It deals 0.81 to 0.84 Critical Injuries and 0.036 to 0.046 deaths per fight, a little above Medium, because it resolves 1.50 cards a round.
- **Large** drags. 13% of fights have no kill within 12 rounds, and it deals 1.38 Critical Injuries and 0.162 deaths, five times Medium's deaths. For a template Squad, 20.4% of fights have no kill within 12 rounds. It is Phase 1's hardest standard fight, not unwinnable.
- **The Sprinting Abnormal** as reported: median round 2, 11.1% no kill, 0.267 deaths. With its Fear Roll and a mounted start: median round 3, 18.3% no kill, 0.435 deaths, and 35.3% of its Grabs devour (finding 1). A template Squad under the same start has no kill in 31.2% of fights and takes 0.676 deaths. That is close to unwinnable for the Squad Chapter 2's templates build.
- **No table makes a fight trivial.**
- **The lone line** against Small or the Abnormal is close to unwinnable (finding 3).

## Findings

### 1. Major: the Abnormal's figures leave out its Fear Roll and the mounted start its ladder is built around

**Location:** section 6.6, *The Sprinting Abnormal* and *How the fights compare*; `data/titans/tuning.yaml` (`verdicts`, `sprinting_abnormal`); OQ-103; `tools/probes/chapter-06/fight6.py`, which inherits `tools/probes/chapter-05/fight.py` (`run`, `add`).

**Problem:** the figures that pass the Abnormal against its bar omit two things Chapter 5 states.
- **The Fear Roll.** `fight.py`'s `run` evaluates the ladder and starts round 1 with no Fear Roll. Chapter 5, section 5.1, step 6 and `fear-rolls.yaml` (`abnormal`) give every soldier holding a Position a Fear Roll when an Abnormal starts a Titan Engagement. Section 6.1 repeats it.
- **The mounted start.** Every soldier starts dismounted. Chapter 5 keeps mounted soldiers mounted at the start, and a Squad meeting an Abnormal on an Expedition rides. The Abnormal's top rung is `mounted`, and its Leap, Snatch, and Lunge all reach Distant. The one row with riders keeps two inert Squadmates in the saddle; no row starts the player characters mounted.

The standard Titans are not sensitive to this: the Medium Titan with a mounted start gives 62.5% by round 3, 0.70 Critical Injuries, and 0.038 deaths, unchanged within sampling.

Against the Sprinting Abnormal (6,000 fights each; mounted soldiers dismount on their first move):

| Case | Median | By round 3 | No kill in 12 | Critical Injuries | Deaths | Grabs that kill |
|---|---|---|---|---|---|---|
| As reported | 2 | 70.7% | 11.1% | 1.98 | 0.267 | 25.8% |
| Start Fear Roll | 3 | 65.0% | 14.5% | 2.22 | 0.349 | 31.1% |
| Start mounted | 3 | 67.2% | 13.4% | 2.13 | 0.344 | 32.4% |
| Both | 3 | 60.8% | 18.3% | 2.51 | 0.435 | 35.3% |
| Both, template Squad | 4 | 42.7% | 31.2% | 3.40 | 0.676 | 41.6% |

Three sentences in 6.6 no longer hold:
- The Abnormal "falls fastest to a Squad that keeps cutting (median round 2)".
- "70.7% ... by round 3".
- "11.1% ... under the one-fifth limit". The corrected figure clears it by 1.7 points.

**Scenario:** a Mission Brief names the Sprinting Abnormal on a Leg.
1. Four Rookies on horseback hold Distant and all make the `abnormal` Fear Roll. One rolls Hesitate and loses a turn.
2. The Titan's first card finds every soldier mounted and Snatches the lowest card at Distant.
3. Two comrades must first step In Reach before they can strike the hand.

None of that is in the figures the chapter quotes.

**Fix options:**
1. Model the starting Fear Rolls in `fight6.py` for every Titan: `abnormal`, and `first-titan-engagement` for a case that names it. Add an all-mounted start as the Abnormal's reported row. Re-render 6.6, OQ-103, and `tuning.yaml`.
2. Make the mounted start with the Fear Roll the Abnormal's reference start in `tuning.yaml` (`targets`, `abnormals`), since any rule that names it will begin on horseback.
3. If the corrected no-kill share stays within sampling of one fifth, change one value and re-measure before accepting. For example, leg Toughness 2 grounds it sooner.

### 2. Major: in the riders row, a Snatched rider's Grab countdown never runs

**Location:** `tools/probes/chapter-06/fight6.py` (`Fight6.soldier_turn`, the `rider` branch); section 6.6, *The Sprinting Abnormal*, the Riders bullet; OQ-102 (*Why*, "(b) makes the Abnormal trivial for riders").

**Problem:** the rider branch returns before Chapter 5's `soldier_turn` runs.
- **What it skips:** Chapter 5's Grabbed branch counts the victim's turns, lifts them, rolls Break Free, and devours them (`grab.yaml`, `countdown`).
- **The rider Squadmate:** a rider the Abnormal Snatches is never lifted, never tries Break Free, and is never devoured.
- **The Titan:** it resolves nothing while holding (`while_holding`) until a comrade cuts the hand.

The row OQ-102 relies on therefore undercounts rider deaths. Running Chapter 5's Grabbed branch for the rider (8,000 fights) gives:

| Case | By round 3 | Critical Injuries | Deaths | Grabs that kill |
|---|---|---|---|---|
| As reported | 84.1% | 1.57 | 0.013 | 1.6% |
| Countdown running | 83.9% | 1.70 | 0.077 | 13.5% |
| Countdown running, start Fear Roll | 78.3% | 1.83 | 0.109 | 17.2% |

The rider deaths are six times the reported figure. OQ-102's conclusion that riders are prey, not a free screen, gets stronger. The quoted figures ("at 0.013 deaths", "0.97 of its 1.57 Critical Injuries") are wrong, and so may be the rejected option (b)'s 94.7% and 0.003, which used the same role.

**Scenario:** the Abnormal Snatches Squadmate Ilse from the saddle at Distant.
- **By the rules:** she is lifted after her next turn and eaten after the one after, unless the cutters reach the hand first.
- **In the probe:** she hangs in the hand indefinitely and the Abnormal stands frozen, so the Squad strikes the Nape at leisure.

**Fix options:**
1. In `Fight6.soldier_turn`, run Chapter 5's Grabbed branch for every role before the rider return. Re-run every rider row, including OQ-102 (b).
2. Re-quote section 6.6's Riders bullet, OQ-102, and `tuning.yaml` (`verdicts`) from the corrected run.

### 3. Major: a lone soldier almost never gets a usable Nape strike against a Tempo 2 Titan

**Location:** section 6.6, *A lone soldier after Break Attention* (the table and its design note); `data/titans/tuning.yaml` (`verdicts`, `lone_strike`); `tools/probes/chapter-06/lone6.py`.

**Problem:** the `solo` table gives a lone Rookie 33.1% against the Small Titan and 33.4% against the Abnormal, three times the Medium figure. Those are per-strike odds, given that a Break Attention has already bought the strike. The design note says the lone line "still waits on the card order", but the chapter measures that wait only for Tempo 1 (Chapter 5, section 5.13).

Against a Tempo 2 Titan, the decoy a soldier places on their card is spent by the Titan's next card. Usually both of the Titan's cards fall before the soldier's next turn. Each spent decoy raises the next need by 1.

I re-ran Chapter 5's card-order model (`simple.solo_wait`) with Tempo as a parameter, 100,000 trials each. Rookie Break Attention succeeds 82.6%, 49.6%, 20.6%, and 5.6% at needs 1 to 4. The Tempo 1 row reproduces Chapter 5's figures.

| Titan's Tempo, Break Attention needs | Usable strike within 4, 6, 12 rounds | Titan cards against the soldier through round 12 |
|---|---|---|
| Tempo 1, rising needs (the rule) | 42.1%, 50.7%, 60.7% | 4.93 |
| Tempo 2, rising needs (the rule) | 19.3%, 24.0%, 30.4% | 16.42 |
| Tempo 2, need never rises | 26.7%, 41.0%, 69.0% | 9.21 |
| Tempo 2, need capped at 2 | 20.5%, 29.6%, 51.1% | 12.89 |

So the Titans with the easiest per-strike figure are the hardest for a lone soldier. After 12 rounds, 7 lone Rookies in 10 have yet to make a usable cut, having faced 16 Titan cards. The chapter never says so. Section 6.6's comparison reads as though Nape Depth 3 makes the Small Titan the easy lone kill.

**Scenario:** the setup table deals a Small Titan (2 results in 6), and one Rookie is left standing.
1. On round 3 the Rookie's Break Attention succeeds on card 9.
2. The Titan's card 11 spends the decoy.
3. The Titan's card 15 Grabs the Rookie before their next turn.

The table above shows that pattern is the norm.

**Fix options:**
1. Add the card-order wait to the `solo` family for every Titan's Tempo, and render it beside the per-strike table. State in 6.6 that against Tempo 2 Titans the per-strike figure overstates a lone soldier's chances.
2. Give the OQ-81 decider these figures. The Tempo 2 rows are the Chapter 6 content most sensitive to that dispute. A Chapter 5 change such as "a decoy holds a Tempo 2 Titan's Attention until its next card after the decoyer's next turn" would need measuring before adoption.

### 4. Major: entries whose text uses a Body Part list none, so Broken parts never stop them

**Location:** section 6.2 design note ("With its legs cut it cannot totter forward"); `standard-small.yaml` (`totter-closer`); `standard-medium.yaml` (`groping-reach`, `shake-off`); `standard-large.yaml` (`brush-off`); OQ-101 (*Why*, "the entries at 4 and 5 use none").

**Problem:** to keep the kill share at one half, OQ-101's layout gives the entries at 4 and 5 no Body Parts, and puts a part at 2 only where its share falls into a control entry. The `text` fields describe parts the entries do not list:
- **Totter Closer** ("stumbles toward the soldier on short, uneven legs") lists no leg. The 6.2 design note says the opposite of the YAML: the broken-shares table shows Totter Closer keeping its result with both legs Broken.
- **Groping Reach** ("a hand as wide as a cart") lists no arm.
- **Shake Off** ("pawing at the back of its own neck") lists no arm.
- **Brush Off** ("drags a hand ... across its own shoulders") lists no arm.

The glossary's Body Part State says a Broken Body Part disables the behaviors that use it. At the table, a legless Titan totters and an armless one reaches with its hand.

This is normal play, not an edge case. A Small Titan's legs have Toughness 1, so the baseline cutters, who strike legs first, break each with one success.

Giving Totter Closer `leg` does not fix it. With previous behavior Scrabble and both arms and both legs Broken, result 2 moves up past Totter Closer (leg) and Clutch at the Legs (arm) to Scrabble, the previous behavior, and on to Bite. Results 3 and 4 also reach Bite, so Bite takes 4 results in 6. The layout really does force the text to change.

**Scenario:** a cutter breaks both of a Small Titan's legs, and the next roll is a 2.
- **By the YAML:** Totter Closer resolves, with +1 Stress and a telegraph, while the text has it stumbling forward on its legs.
- **By the design note:** a GM treats Totter Closer as illegal and moves up to Clutch at the Legs, inflicting a leg Critical Injury at Severity 2 instead of Stress.

The two readings give different results.

**Fix options:**
1. Rewrite the four `text` fields and the 6.2 design note so an entry that lists no Body Part describes none. For example:
   - **Totter Closer:** "It lurches at the soldier head first, however it can."
   - **Groping Reach:** "Its head swings down, jaws working, a moment too late."
   - **Shake Off:** "It hunches and rolls its shoulders."
   - **Brush Off:** "It rolls its back against whatever is behind it."
2. Add a `titans.py` lint listing every entry whose `body_parts_used` is empty and whose `text` names a hand, arm, leg, or eye, for the author to clear.

### 5. Major: the Abnormal's bar has no ceiling on how deadly it may be

**Location:** OQ-103; `data/titans/tuning.yaml` (`targets`, `abnormals`); section 6.5, the bar design note.

**Problem:** the bar is "winnable" (a median kill within 4 rounds, under one fifth with no kill in 12) and "not trivial" (more Critical Injuries and deaths than the standard Medium Titan). Nothing caps the cost. As reported, the Abnormal kills 0.267 soldiers per fight, 8 times Medium. Under finding 1's start it kills 0.435, 13 times Medium, and 0.676 for a template Squad. All of these pass the bar.

ADR-0014's PC death target (a PC dies every 3 to 4 missions) is the only lethality budget, and OQ-103 defers it to the Expedition simulator. That is where the appearance rate will be set. Until then, a Mission Brief that names this Titan costs about four tenths of a soldier per fight, and no rule says how often one may.

"More than Medium" is also a floor that any Tempo 2 Titan clears.

**Scenario:** a Mission Brief author, reading "reported against its bar and passes", names the Sprinting Abnormal on two Legs of one Expedition. At 0.435 deaths per fight, that one Expedition spends about one death on this Titan alone, the whole PC death budget of three or four missions.

**Fix options:**
1. Add a ceiling to the bar at the reference start with a mounted Squad: deaths per fight at most a stated multiple of Medium, or at most a share of the PC death target per Expedition at an assumed appearance rate. Measure against it.
2. Report deaths per fight for the template Squad and the mounted start as part of the bar, not only as sensitivity rows.
3. Keep the bar, but state in 6.5 and `roster.yaml` (`enters_play`) that no Mission Brief may name the Abnormal until the Expedition simulator sets its rate.

### 6. Major: no Squad Tactic or decoy-screen rows for any Chapter 6 table, and the "not trivial" verdict depends on OQ-81

**Location:** section 6.6, *Baseline* and *How the fights compare*; `data/titans/tuning.yaml` (`simulator_cases`, first item).

**Problem:** ADR-0014 as amended reports sensitivity rows "beside each target": every Squad Tactic alone and in pairs, decoy screens, and helper Squadmates. Chapter 5 reported the tactics and screens only against the reference table. Chapter 6 replaces that table with the standard Medium Titan the first target is now measured on, and reports only helper Squadmates. The rest is deferred to a `simulator_cases` line, with no open question and no mention in 6.6.

The tables differ from the reference in exactly the ways screens and tactics touch:
- **Heavy Tread (Large)** hits every soldier beside the holder, which is where a decoy screen stands.
- **The Abnormal's Tempo 2** means one decoy covers half its cards.
- **Hook and Cut** starts with a Break Attention, whose need is what the OQ-81 dispute is about.

The chapter's "no fight in this chapter is unwinnable or trivial" is measured with no screen at all. Chapter 5 recorded what a screen did without escalation: a Medium Titan resolving 0.41 cards a round and dealing 0.25 Critical Injuries per fight, against 0.83 and 0.65. If the escalating need is capped or removed, that is the likely shape for the Medium and Large tables, and Chapter 6 has no row that would show it.

**Scenario:** two Squadmates ride to the Large Titan's holder and take turns sending horses and throwing cloaks. The chapter cannot say whether that makes the Large fight trivial, or whether Heavy Tread's Stress on everyone beside the holder makes the screen a trap.

**Fix options:**
1. Run Chapter 5's decoy-screen and Squad Tactic cases (`data/engagement/tuning.yaml`, `decoys`, `squad_tactics`) through `fight6.py` for every Chapter 6 table, and render them in 6.6.
2. If they stay deferred, log the deferral as an open question. State in 6.6 that "not trivial" is measured without screens and must be re-run when OQ-81 is settled.

### 7. Minor: the Abnormal's ladder sets aside ADR-0010's "a striker who falls short draws the Titan", and OQ-102 does not say so

**Location:** `roster.yaml` (`ladders`, `sprinting-abnormal`); section 6.5, *What it means at the table*; OQ-102.

**Problem:** ADR-0010 makes a Nape strike count as hooking in, so a striker who falls short draws the Titan's turn. ADR-0007 protects the same moment. The Abnormal's ladder has no `hooked-into-its-body` rung. Chapter 5's format allows that, but whenever a soldier is mounted or holds the loudest flag, a short striker is never drawn. OQ-102 names the missing rung without naming the clause it gives up.

**Scenario:** a mounted Squadmate at Distant holds the Abnormal's Attention. Two strikers at Blind Spot alternate cuts, each spending the other's Openings, and the Titan never turns to them. (It costs the rider: finding 2's corrected row gives 0.077 deaths.)

**Fix options:**
1. Add to OQ-102's reasons the ADR-0010 clause it sets aside, and why canon supports that.
2. Measure the ladder `[mounted, loudest-or-brightest, hooked-into-its-body, airborne, nearest]`, which keeps a short striker ahead of other flyers.

### 8. Minor: prose and text promise effects the entries do not have

**Location:** section 6.5 design note ("its Leap and Buck bring them down"); `sprinting-abnormal.yaml` (`leap` text, "rider or flyer, and crashes down after them"); `standard-medium.yaml` (`swat` text, "backhands the soldier out of the air").

**Problem:** the text and the effects disagree for three entries:
- **Leap:** `titan-format.yaml` (`effect_types`, `knock-loose`) says a mounted target is not affected, so a Leap only injures a rider. Snatch is the only entry that takes a rider off a horse.
- **Buck:** it needs On Body or Blind Spot, where no rider can be.
- **Swat:** it has no knock-loose, so a soldier who fails to dodge takes a Critical Injury and stays airborne.

**Scenario:** a rider fails to dodge a Leap. The text says the Titan brings them down; the rules leave them in the saddle with a Critical Injury.

**Fix options:**
1. Reword the design note ("Its Snatch plucks riders from the saddle, and its Leap and Buck bring flyers down") and the Leap and Swat text.
2. If a Leap should unhorse a rider, add a dismount effect type to Chapter 5's closed list through a decision, as the batch 3 constraint requires for horse effects.

### 9. Minor: after Leap's knock-loose, what happens to a target who dies or goes Down before its Critical Injury is undefined

**Location:** `sprinting-abnormal.yaml` (`leap`, effects in order); `behavior-procedure.yaml` (`resolving_a_card`, `effects`).

**Problem:** Leap is the only entry with two harming effects: knock-loose, then a Critical Injury. The fall's damage can bring an airborne soldier to 0 Health, which inflicts an immediate Critical Injury, and that one can be lethal or instant death. The procedure says to apply effects in order, but not whether later effects still apply to a target who has died. The probe stops (`if s.dead: break`). A landed Leap can also give two Critical Injuries, which no note mentions.

**Scenario:** a flyer at Blind Spot with 1 Health box left fails to dodge a Leap. The fall puts them Down with a damage Critical Injury that is instant death. Does the Leap's own Critical Injury still land, for Grief and the record?

**Fix options:**
1. State in `behavior-procedure.yaml` (`effects`) that a target who dies stops receiving effects (a Chapter 5 change).
2. Put Leap's Critical Injury before its knock-loose, and note that a Leap can inflict two Critical Injuries.

### 10. Minor: "a Titan kills only through a lethal Critical Injury's Death Roll or the Grab's devour" misses instant-death rows

**Location:** section 6.1, *Reading a Behavior Table*, last paragraph.

**Problem:** `critical-injuries.yaml` has instant-death rows at 15 or more: Crushed (torso) and Crushed Skull (head). The Medium and Large Bites are fixed at the torso, and every Grab crush is a torso Critical Injury that counts for worsening, even when capped as non-lethal. So the two now stack:
- A soldier holding one torso Critical Injury who takes a Bite reaches Torn Open (lethal, turn) on 11 or more: 8.3%.
- A soldier holding two dies outright on 11 or more: 8.3%.

The reference table's rolled Bite reached the torso 1 time in 6.

**Scenario:** a soldier freed from one Grab, then Grabbed and freed again, is Bitten by a Medium Titan. On an 11 they die at once, with no Death Roll.

**Fix options:**
1. Reword: "a Titan kills through a lethal Critical Injury (a Death Roll, or an instant-death row) or the Grab's devour step."
2. Add a sentence to the 6.3 design note that a torso Bite stacks with Grab crushes.

### 11. Minor: OQ-100's restated fields duplicate `effects`, and one of its sentences is wrong

**Location:** section 6.1 (PROVISIONAL, OQ-100); `roster.yaml` (`entry_fields`); `tools/probes/chapter-06/titans.py` (`validate`, the `harm` comparison); OQ-100.

**Problem:** three separate faults:
- **Duplication.** `marked_grab` and `harm` restate `effects`. That is two sources for one fact inside the YAML, which ADR-0012's single source exists to avoid. The Foundry importer or a hand edit can change one and not the other.
- **A hard-coded value.** The drift check compares a grab's harm against the literal `"torso"` written into `titans.py`, a rule value in a probe whose header says none are written in.
- **A wrong sentence.** 6.1 says "no card result depends on them". Once OQ-105 item 3 lands, the Closing Hand Scar reads `marked_grab`, so a dodge pool does.

OQ-100's option (b), where a grab effect is the mark, meets the constraint's word "marked" with no new field.

**Scenario:** a later decision changes the crush's Injury Location in `grab.yaml` and `health.yaml`. Every `harm` row goes stale, and `titans.py` reports no problem, because it checks against its own `"torso"`.

**Fix options:**
1. Prefer OQ-100 (b): trigger the Scar on "a behavior with a grab effect" and let health.yaml's listing read `effects`. Drop `marked_grab` and `harm`, and keep `text`.
2. Keep (a), but have `titans.py` read the crush location from `data/harm/health.yaml` (`titan_attacks`, `grab`), and reword 6.1 to "they restate the effects, so they can never disagree with them".

### 12. Minor: the Grab-cell probe does not use the Titan's own Severity to decide a failed dodge

**Location:** `tools/probes/chapter-06/lone6.py` (`grab_cell`, `grab_trial_sev`); `tools/probes/chapter-05/simple.py` (`grab_trial`, the `res["succ"] < 3` loop).

**Problem:** `lone6.py` patches the dodge's Push target to the Titan's Grab Severity. `grab_trial` still accepts a dodge as failed only when it scores under 3:
- **Small (Severity 2):** a dodge of exactly 2 successes counts as failed.
- **Large (Severity 4):** a dodge of exactly 3 is thrown away.

The docstring's claim that the dodge is "Pushed toward the Titan's Grab Severity" is only half done. With the test corrected, the cells do not move: alone 70.3%, 69.7%, and 69.8% at Severity 2, 3, and 4; one comrade at Stress 2, Grief 0 is 33.6% at each.

**Scenario:** none at the table; a reader re-deriving the Small cells from the code gets a different model from the one the docstring states.

**Fix options:**
1. Add a `severity` parameter to `simple.grab_trial` (a Chapter 5 probe change) and pass it from `lone6.py`.
2. Or state in `lone6.py` that failure is tested at 3 and quote the corrected figures above.

### 13. Minor: the Abnormal's Jam test holds a holder the Abnormal's ladder never picks

**Location:** `tools/probes/chapter-06/jam6.py`; section 6.6, *The Jam test*.

**Problem:** the Jam test puts the Rookie on foot at In Reach for every Titan. The Abnormal's ladder picks a rider first and a flyer second. A mounted holder dodges with the horse, rated 2; each Pushed dodge's Gear Dice showing 1 wear the horse, and at 0 it is lame and the rider falls. No test bounds how often an Abnormal lames a rider's horse in three rounds, the mounted twin of the Jam test. With Tempo 2 and Leap, Snatch, and Lunge at Distant, a rider dodges often.

**Scenario:** a Squadmate on horseback holds the Abnormal's Attention for three rounds, dodging and Pushing, until the horse goes lame and throws them.

**Fix options:**
1. Add a mounted-holder cell to `jam6.py` for the Abnormal, with horse Gear Dice at Distant, and report the lame share beside the Jam figures.

### 14. Minor: under OQ-104 (a), Phase 1 playtests never meet the Abnormal

**Location:** section 6.1, *Which Titan appears*; `roster.yaml` (`abnormals`, `enters_play`); OQ-104.

**Problem:** option (a) is sound as a rule and changes no file under review. But no Phase 1 rule names the Abnormal, so none of the following gets played before Mission Briefs:
- the `abnormal` Fear Roll;
- the Abnormal Read facts;
- the hidden-value tracker;
- the timed paper test of an Abnormal round.

Findings 1, 2, and 5 show the Abnormal is where the model is least trustworthy, which argues for playtesting it early rather than late.

**Scenario:** the first time a table meets hidden Toughness and a mounted-first ladder is in a live campaign.

**Fix options:**
1. Add a playtest-only starting rule in `roster.yaml` that names the Sprinting Abnormal for one scripted Titan Engagement, outside the setup table's odds.
2. Revisit OQ-104 (b) once finding 1's re-run is in.

### 15. Minor: OQ-105 misses four earlier-chapter pointers

**Location:** OQ-105.

**Problem:** OQ-105's items are correct and none changes a rule, but the list is incomplete:
1. **Health pointer.** `data/harm/health.yaml` line 66 (`named_by: Titan attacks (Chapter 6)`) points at Chapter 6 alongside the `titan_attacks.definition` line item 4 covers.
2. **Ladder pointer.** `data/engagement/titan-format.yaml` (`stat_block.fields.attention_ladder`) says an Abnormal ladder id is found in `data/engagement/attention.yaml`. Item 6's provisional choice keeps the ladder in `roster.yaml`, so this field pointer must change too, or an importer following the format cannot find `sprinting-abnormal`.
3. **Background Titan prose.** Chapter 5, section 5.10 says a Background Titan's "stat block ... [is] public". `background-titans.yaml` excepts an Abnormal's hidden values, and Chapter 6 makes that case reachable (`enters_play` names Background Titans).
4. **Glossary.** `CONTEXT.md` defines Nape Depth as "set by Size Class" and Regeneration as a pace "set by Size Class". The Abnormal's Nape Depth 3 is not.

Finding 1's cause is also a Chapter 5 probe gap: `fight.py` has no start-of-fight Fear Roll of any kind, including `first-titan-engagement`.

**Scenario:** the one-pass pointer fix OQ-105 plans leaves `titan-format.yaml` sending readers to a file with no `sprinting-abnormal` ladder.

**Fix options:**
1. Add the four items to OQ-105, plus a Chapter 5 probe item for starting Fear Rolls.

### 16. Minor: the Abnormal's hidden values are printed where players read them

**Location:** section 6.5 (the stat block's Toughness, Nape Depth, and clock; the ladder; *What it means at the table*).

**Problem:** Chapter 5 makes an Abnormal's Toughness, Nape Depth, clock length, and ladder Read facts. Chapter 6 prints all of them in the chapter every player reads, with a player-facing summary of the ladder. A Read's successes are worth nothing to a table that has read section 6.5.

**Scenario:** a Tactician Reads the Abnormal for its ladder. Every player already knows it runs for riders.

**Fix options:**
1. Mark the Abnormal's stat block, ladder, and *What it means at the table* as GM-facing, or move them to a GM section.
2. Or state in 6.5 that the hidden values are hidden at the table, not in the book, so Reads cost nothing for groups who have read it.

### 17. Minor: the standard tables are provisional, but 6.2 to 6.4 carry no `PROVISIONAL:` line

**Location:** sections 6.2 to 6.4; the chapter introduction.

**Problem:** the introduction says each rule left open "is marked `PROVISIONAL:`". The three standard tables and the kill-share reading are OQ-101 and appear only in design-note headers and the YAML `provisional` lists. Section 6.5 marks its OQs with the line; 6.2 to 6.4 do not.

**Scenario:** a reader skimming for `PROVISIONAL:` concludes the standard tables are settled.

**Fix options:**
1. Add a `PROVISIONAL:` line citing OQ-101 in 6.1 (for the tables and the kill-share reading), or one under each of 6.2 to 6.4.

### 18. Minor: two glossary `_Avoid_` terms

**Location:** `sprinting-abnormal.yaml` (`thrash` text) and section 6.5 ("It spins and stamps in place, limbs going every way"); section 6.5 design note ("Its speed is its Tempo").

**Problem:** "limb" is on Body Part's `_Avoid_` list, and "speed" is on Tempo's.

**Scenario:** a reader takes "limbs" for a Body Part kind, or "speed" for a stat beside Tempo.

**Fix options:**
1. "arms and legs going every way"; "Two cards a round is how fast it runs (Tempo 2)."

## Chapter 6 content that depends on OQ-81's escalating need

Nothing in `data/titans/` reads Break Attention's need, and no baseline fight row uses Break Attention. The following would change or break if the need stopped escalating or were capped:

- **The lone line against Tempo 2 Titans (finding 3):**
  - with the rising need: a usable strike within 12 rounds in 30.4% of fights;
  - with the need capped at 2: 51.1%;
  - with a need that never rises: 69.0%.
- **The "not trivial" verdict for every table (finding 6).** It is measured without screens. Without escalation, Chapter 5's screen cut a Medium Titan to 0.41 cards a round.
- **Section 6.6's lone design note,** "the lone line still waits ... on Break Attention's rising needs", which would need rewording.
- **OQ-102's riders argument** does not depend on escalation. A riderless horse is one decoy per horse whatever the need, so it would stand.

## Open questions OQ-100 to OQ-105

- **OQ-100.** Workable, but (b) is cleaner (finding 11).
- **OQ-101.** Sound. The strict reading catches the Broken-part case the constraint exists for, and every table passes it. Accept it with finding 4's text fix.
- **OQ-102.** Faithful to canon, and Leap and Snatch at Distant is the right direction. Its figures need finding 2's re-run, and its reasons should name the ADR-0010 clause (finding 7).
- **OQ-103.** The bar needs a lethality ceiling (finding 5), and the model needs the Fear Roll and the mounted start (finding 1).
- **OQ-104.** Sound as a rule, weak for playtesting (finding 14).
- **OQ-105.** Sound, but incomplete (finding 15).

## Appendix: models

Every script lives in the session scratchpad, is not committed, and writes nothing in the project. Each imports the drafter's probes unchanged:

- **`verify_fights.py`:** `fight6.run_many` on the Medium, Small, Large, Abnormal, and Abnormal-with-riders cases, 6,000 fights each, seeds 9100 to 9104.
- **`abnormal_variants.py`:** subclasses `fight6.Fight6` with two options, 6,000 fights per case:
  - `start_fear`: after the first ladder evaluation, every soldier makes Chapter 5's `fear` roll, and its spent actions and turns land on round 1;
  - `start_mounted`: every soldier starts mounted and is dismounted by their first move.
- **`rider_fix.py`:** the same subclass, with a Grabbed rider's turn sent through Chapter 5's `Fight.soldier_turn` so the countdown, Break Free, lift, and devour run; 8,000 fights per case.
- **`lone_wait_tempo.py`:**
  - Rookie Break Attention rates from `core.attr_roll` at needs 1 to 7, 100,000 rolls each.
  - Chapter 5's `solo_wait` card-order model, rewritten so the Titan draws Tempo cards among the soldier's one.
  - Rising needs, needs that never rise, or needs capped at 2; 100,000 trials each.
- **`grab_jam_checks.py`:**
  - `simple.grab_trial` with the victim's dodge Pushed to Severity 2, 3, or 4, and its success reported so the `< 3` loop tests that Severity.
  - `jam6.jam_cell` for two Large Titans, Covered, no Help, on four fresh seeds of 60,000.
