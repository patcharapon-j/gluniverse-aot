# Wings of Freedom, Phase 1 rulebook: full review, round 1 (Fable)

Reviewed fresh, as a table would play it, without relying on earlier reviews:

- `docs/rules/01-core-rules.md` to `06-standard-titans.md`, every file under `data/core/`, `data/character/`, `data/harm/`, `data/mind/`, `data/gear/`, `data/engagement/`, and `data/titans/` (the tuning files by their headline sections).
- `CONTEXT.md` (glossary and every `_Avoid_` list), ADR-0001 to ADR-0015 as amended, `docs/rules/DECISIONS-2026-09-14.md` where a rule cites it, and `docs/rules/OPEN-QUESTIONS.md` (OQ-01 to OQ-118; OQ-112 to OQ-118 in full).
- `tools/sim/README.md` and `docs/reviews/simulator-report.md` for the ADR-0014 figures. I did not read `01-06-full-review-1-astra.md` or any `simulator-review-2*.md`.

Odds I quote as my own come from `fable_review_sims.py` in the session scratchpad (not committed; the appendix describes it). No finding below rests on an odds claim.

Severity follows the brief: **Critical** is a situation in normal play the rules cannot resolve or that needs GM invention (ADR-0003), an unlogged contradiction with an ADR or the glossary, or a rules bug that breaks play or makes an ADR-0014 target unreachable; **Major** is an undefined edge case or ordering problem likely in normal play, a significant odds, balance, or fidelity problem, or a gap that blocks a first playtest; **Minor** is wording, clarity, or a small gap.

## Verdict

**0 Critical, 2 Major, 3 Minor.**

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| 1 Core rules | 0 | 0 | 0 |
| 2 Character creation | 0 | 1 | 0 |
| 3 Harm and mind | 0 | 1 | 0 |
| 4 Gear | 0 | 0 | 0 |
| 5 Titan Engagement | 0 | 0 | 3 |
| 6 Standard Titans | 0 | 0 | 0 |
| **Total** | **0** | **2** | **3** |

The six chapters are internally consistent to an unusual degree. I found no rule that rests on GM discretion inside a Titan Engagement, no prose row that disagrees with its YAML (Chapter 6's rendered tables match `data/titans/` entry for entry, and every Size Class number, Severity, fallback, and Grab mark checks), no ordering conflict between the round's end steps, the Gas Roll, and the engagement-end steps, and no `_Avoid_` term used for the glossary term it is banned from. Every ADR-0014 target the report says is met I could reproduce in ballpark with an independent model (section *ADR-0014 targets*). The two Majors are both gaps rather than bugs: one is a dead roll that leaves a Talent, a Squadmate template, and three Lifepath rows with nothing to do; the other is that nothing in Phase 1 ever makes a day pass, so nothing heals between fights.

## Findings

### Major 1. No Phase 1 rule ever makes a day pass, so nothing heals, no damage comes back, and day limits never run out

**Chapter 3**, sections 3.1 *Getting Health back*, 3.3 *Ending Down*, 3.4 *Time limits*, 3.6 *Healing time*, 3.10 *When lasting results end*, 3.14 Grief; `data/harm/healing.yaml` (`day_passes`), `data/harm/health.yaml` (`restoring`, `day-passes`), `data/harm/down.yaml` (`ending`), `data/mind/stress-responses.yaml` (`lasting_ends`), `data/mind/grief.yaml` (`in_the_field: never`). Touches Chapter 1 section 1.6 (`data/core/stress-changes.yaml`, `downtime`) and Chapter 4 section 4.9 (`data/gear/standard-issue.yaml`, `interim_issue`), the one cross-session stopgap the rulebook has.

**Problem.** `healing.yaml` says a day passes "at each night camp" (Expedition rules, not yet written) or as the Downtime rules state (not yet written), and never inside a Titan Engagement. No other Phase 1 rule names a day. Everything that heals a soldier is keyed to a day passing:

- Health lost to damage comes back only when a day passes (`health.yaml`, `restoring`; section 3.1: "Nothing else restores Health lost in the field"). Revive gives it back only to a soldier at 0 current Health.
- A held Critical Injury's healing time drops only when a day passes, so no Critical Injury ever heals; a treated one keeps its effects forever.
- A lethal Critical Injury with a `day` limit never causes its Death Roll and can never heal.
- A lasting Stress Response gained outside a Titan Engagement ends "when a day passes" if its rule says nothing, so one gained on a care-window roll lasts until a Rally.
- Grief is never lowered (`grief.yaml`: "no Phase 1 rule lowers Grief"), and the only Stress relief is 1 point at a Nape kill and 1 at the end of the Titan Engagement.
- Down from damage ends only by revive or a day passing.

Chapter 4 saw the same cross-session problem for gear and wrote the interim issue ("Until the Expedition rules are written, every soldier in the Squad receives the interim issue together at the start of each session"). Chapter 3 has no interim day. The chapters do declare the Expedition and Downtime rules unwritten (Chapter 3, introduction), and OQ-116 logs the missing cadence, but only as a simulator matter ("no rule gives the cadence of Titan Engagements, care windows, and the interim issue"); its options are about what the simulator should assume. The play consequence is not logged anywhere, and it is worse than a measurement gap: it is the thing a playtest packet hits in its second fight.

**Scenario.** Session 1, first Titan Engagement, Wooded. The Medium Titan's Thrash knocks Ilse loose from Blind Spot: a high fall, D6+2 = 6, 2 damage. Oskar takes a Swat, a rolled arm Critical Injury, treated in the care window (healing time 10 days). The session ends; at the start of session 2 the interim issue refills every canister and swaps every worn horse, as written. Ilse still has 2 of 4 Health, Oskar still has his treated arm injury with its penalty, and the GM is asked "did we rest?". The rules answer only "the Downtime rules, not yet written, state how many days a Downtime spans." Three sessions on, every soldier who has taken a fall is a Health 1 or 2 soldier, and a soldier who went Down from damage without a successful revive is still Down. The GM either invents a day (ADR-0003) or runs a Squad that only ever gets worse.

**Fix options.**

1. Add an interim day beside Chapter 4's interim issue: "Until the Expedition and Downtime rules are written, one day passes at the start of each session, before the interim issue" (a row in `healing.yaml` `day_passes`, cited by `standard-issue.yaml` `interim_issue` and Chapter 3 section 3.6), with the `each_day` steps as written. One day per session keeps the Health-dependent targets and the sequence rows of `tools/sim/cases.py` (`SEQUENCE`, OQ-116) close to what they measure now, and gives the simulator the cadence OQ-116 asks for.
2. Same as 1, but let the players choose 1 to 3 days per session so Grief and Stress relief can wait for the Downtime rules while injuries move (needs a Stress and Grief row in the interim day, or an explicit "no Stress or Grief changes").
3. Log it as a play gap in OQ-116 (or a new entry) with an explicit statement in Chapter 3's introduction that a Phase 1 playtest is one Titan Engagement per Squad state, and let the packet say so.

### Major 2. The `ride` roll is never called, so Horsemanship, the Rider Squadmate template, and three Lifepath rows do nothing

**Chapter 2**, section 2.7 *Dice Talents* (Horsemanship), section 2.8 *What an entry states* and the roll entries list ("Fly (ODM Gear) and Ride (horse): Agility rolls that a Chapter 4 or Chapter 5 rule calls for"), section 2.3 *Choosing a Talent* ("Every Origin row and every event offers at least one Talent that names an entry a current rule uses"), section 2.10 templates, and the worked example (Mira takes Horsemanship 1 at Origin; "Horsemanship was the other choice"); `data/character/action-catalog.yaml` (`ride`: "Called by a Chapter 4 or Chapter 5 rule, or by the Chase rules (not yet written)", `rules: [04-gear, 05-titan-engagement]`, not marked `dormant`); `data/character/talents.yaml` (`horsemanship`, `names: [ride]`, no dormant comment); `data/character/squadmates.yaml` (`rider` template, `talent: horsemanship`); `data/character/origins.yaml` (`minor-noble`: horsemanship or judge-of-character); `data/character/training-years.yaml` (year 1 *Stable duty*: horsemanship or fieldcraft; year 3 *The signal relay*: keen-eyes or horsemanship). Also Chapter 4 section 4.5 and `data/gear/horses.yaml` (`gear_dice`, `ride`), `data/gear/items.yaml` (`horse`, `gear_dice_for`), and Sure Seat's description.

**Problem.** I searched every chapter and every YAML file for a rule that calls for a Ride roll. There is none. `anchor-ratings.yaml` calls only `fly`; mounted steps roll nothing; `horses.yaml` states when the horse rates Ride but nothing calls it; `odm-gear.yaml` `rolls_it_rates` names Fly and never Ride. The Catalog row and Chapter 2 both assert that a Chapter 4 or Chapter 5 rule calls it, which is false. Because `ride` is not marked `dormant`, Horsemanship counts as a live Talent everywhere Chapter 2 tests for dormancy, so:

- The Rider template's only Talent adds dice to a roll that never happens. A player who chooses Rider at Graduation and takes Horsemanship (its first-listed Talent) spends the Specialty's one Talent level on nothing; the other three Rider Talents (Loose the Horse, Sure Seat, Rescue Ride) do work.
- Three Lifepath rows offer no Talent that any Phase 1 rule uses: Minor Noble House (Horsemanship, Judge of Character which names dormant `size-up`), *Stable duty* (Horsemanship, Fieldcraft which names dormant `survive`), and *The signal relay* (Keen Eyes which names dormant `spot`, Horsemanship). `origins.yaml` and `training-years.yaml` both promise "Every row offers at least one Talent that names an entry a current rule uses (OQ-20)", and Chapter 2 repeats it. The Training Year fallback (`if_only_dormant_can_gain`) does not trigger for these rows because Horsemanship's entry is not dormant, and the Origin table has no fallback at all.
- The worked example builds Mira with Horsemanship 1 as one of her five levels and presents it as the usable alternative to Keen Eyes.
- Sure Seat's "Pushed dodge, Ride, or Break Attention", the Weak Knees Stress Response and four Critical Injury rows' penalties on `[fly, ride, dodge]`, and ADR-0014's "no Talent dice on ... Ride" all reference a roll that does not exist in play. Harmless, but they make the Catalog row look live.

This is not OQ-33 (dormant entries and Lifepath choices), which was decided on the premise that Ride is live. It is a useless option and a false claim in two tables, so Major rather than Minor.

**Scenario.** A new group makes soldiers. One rolls 52 at Origin: Minor Noble House. Both Talents are dead in Phase 1 (one openly dormant, one not), and no fallback applies, so the player takes Horsemanship 1 on the chapter's assurance that it is a usable choice. She chooses Rider at Graduation and takes Horsemanship 2. In the first Titan Engagement she rides to In Reach, dodges with the horse (Agility, no Talent), feints from the saddle (Perception, no Talent), and asks when she rolls Ride. Nothing in Chapters 4 to 6 ever asks her to. Two of her five Talent levels are blank.

**Fix options.**

1. Mark `ride` dormant now (`action-catalog.yaml`, with the Chase rules as the rule that will call it; add the dormant comment to `horsemanship` in `talents.yaml`), fix the two false "Called by a Chapter 4 or Chapter 5 rule" claims (the Catalog row and Chapter 2 section 2.8), and repair the three Lifepath rows so each offers a live Talent (for example, Minor Noble House: Judge of Character or Sure Seat; *Stable duty*: Loose the Horse or Fieldcraft; *The signal relay*: Keen Eyes or Wide Awareness), then re-read the Origin comment, the Chapter 2 claim, and the Mira example. Give the Rider template Loose the Horse or another live Talent.
2. Give Ride a Phase 1 call: a mounted Distant to In Reach step at the Sparse, Wooded, and Giant Forest ratings, or a mounted move away from a Titan whose card has come this round, rolls Ride needing 1 with the horse as gear item, failing to stay at the start Position (a `ride_roll` field on the mounted step rows of `anchor-ratings.yaml`, mirroring `fly_roll`). This gives the Rider a job and Horsemanship a roll, but it changes the mounted screen rows of Chapters 5 and 6, so it must be re-run in the simulator.
3. Keep Ride uncalled but add an Origin fallback matching the Training Year one, and mark Horsemanship dormant in Chapter 2's text. Weakest, since the Rider template still holds a dead Talent.

### Minor 1. Section 5.13 says the ADR-0014 simulator "is not yet built"

**Chapter 5**, section 5.13, the paragraph opening "Every value in `size-classes.yaml` is a starting value for the ADR-0014 simulator in `tools/`, which is not yet built."

**Problem.** `tools/sim/` exists, `docs/reviews/simulator-report.md` is generated from it, and Chapter 6 section 6.6 quotes its rows. A playtest packet would carry a false statement about its own tuning.

**Fix.** Read "the ADR-0014 simulator in `tools/sim/`, whose report is `docs/reviews/simulator-report.md`" and point the *Probes* paragraph at the report as the current measurement.

### Minor 2. "The Titan's intent shows either way" borrows the Shifter term Intent

**Chapter 5**, section 5.4, the `telegraph` bullet ("because the Titan's intent shows either way"); Chapter 6, section 6.1, the *Terrorize* bullet ("Its intent shows in its body").

**Problem.** Intent is the glossary's Shifter term (Intent Table, ADR-0013), and Chapter 6's introduction says Intent Tables are not Phase 1. Using the word for a standard Titan's telegraph invites the very confusion the glossary guards against, and it is the only Phase 2 term I found leaking into the six chapters.

**Fix.** "because what the Titan will do next shows either way" and "What it will do next shows in its body."

### Minor 3. Distant is defined as "out of the Titan's reach", but Run Past and Trample reach it

**Chapter 5**, section 5.2 and `data/engagement/positions.yaml` (`positions`, `distant`: "Out of the Titan's reach"); glossary Position entry; Chapter 6 section 6.5, the *It runs through people* bullet ("a soldier on horseback at Distant is not out of its path") and the Sprinting Abnormal's Run Past and Trample rows (`position_requirement: [distant, in-reach]`).

**Problem.** The Abnormal's entries are decided (OQ-102, OQ-103) and I do not question them. But the Position's one-line meaning, which players learn first, says the opposite of what the Sprinting Abnormal does, and Chapter 6 has to explain it away in a GM bullet. A player at Distant who takes Trample will read section 5.2 and say the rules contradict themselves.

**Fix.** Make the meaning "Out of a standing Titan's reach. A Behavior Table entry may still name Distant in its Position requirement, as a running Abnormal's does (Chapter 6)", in `positions.yaml`, section 5.2, and the glossary.

## ADR-0014 targets and balance

The simulator report (rules hash `cf5de67236fa50b4`) gives every target as met or reported inside its words. My independent model (appendix) is simpler: it applies the Chapter 1 pool, one Push that re-rolls base and Stress Dice and adds a Stress Die, the no-Push rule on a Stress Die showing 1, and Gear Die wear, but it does not resolve Stress Responses on the Chapter 3 table and does not roll the Grab's crush injury row. So it should sit a little above the report on cuts and well below it on Grab deaths, and it does.

| Target | ADR-0014 words | Report | My model (200,000 trials) |
|---|---|---|---|
| Lone Rookie fresh cut, Nape Depth 4, Stress 1 | 8% to 14% | 13.0% | 13.5% of cuts (98.2% of trials reach the cut); 10.0% from Stress 0 |
| Levi-grade fresh cut, Nape Depth 4, Stress 2 | about 50% | 47.2% | 48.0% |
| Grab kills, alone, after a failed dodge | about 2 in 3 | 69.9% | 52.1% without the crush row and Stress Responses (so the report's higher figure is what the torso rows and Locked Up add; consistent) |
| Grab kills, one Rookie comrade close, Stress 2, Grief 0 | about 1 in 3 | 33.2% | 18.7% under the same simplification |
| Gas Rating 3, medians | 8 and 6 | 8 and 6 (means 9.24, 6.34) | 8 and 6 (means 9.24, 6.36) |
| Medium kill, prepared Squad | median round 3 | round 3 (61.7% by round 3) | not modelled; the report's figure is consistent with a Nape Depth 4 cut at 13% to 34% per attempt with Openings and two to four attempts a round |

Nothing in the rules as written makes a target unreachable. On balance:

- **Four strikers and no cutters** dominating the baseline is OQ-112, unresolved Major, and I have nothing worse to add: the rules never break and the target is met under its stated policy.
- **Two loud Squadmates at Distant** softening the Sprinting Abnormal is OQ-113, unresolved Major, likewise.
- **Draw Attention on the standard tables** is nearly a null action (loudest is the fourth rung, under In Reach and just-hurt), which OQ-113 already notes. Not re-reported.
- **No Titan is trivial or unwinnable.** The Small Titan's Tempo 2 and Nape Depth 3 (my fresh cut 33.8%) balance; the Large Titan's 13% of fights with no kill in 12 rounds is reported and accepted (OQ-78). At the Open rating no Nape strike is possible until a leg is Broken (4 successes on a Medium leg before Regeneration's 3-round clock restores it), which is hard but reachable and is decided (OQ-74).
- **Useless options:** Horsemanship and the Rider template (Major 2). Every other Talent names a live entry or is marked dormant; every Squad Tactic, decoy, and escape has a use I could find in play.

## Completeness for a first playtest

A new group can make soldiers (Chapter 2 with `data/character/`), equip them (Chapter 4's Standard Issue at Funding 3), roll the interim setup table, and run a Titan Engagement against each of the four Chapter 6 Titans, including the Sprinting Abnormal from its GM section, using only these chapters. The card checklist and tracker (`round.yaml`, `gm_tracker`) and the Squad sheet row (`sheet-fields.yaml`) are enough to run it on paper. What is missing, in order of how soon a playtest hits it:

1. **When a day passes** between Titan Engagements or sessions (Major 1). Without it no soldier heals, no damage returns, Grief never falls, and day-limit Death Rolls never come.
2. **When a Titan Engagement begins, and how many a session holds.** The setup table answers what it looks like once it begins; nothing says when. In Phase 1 that is GM scene framing (OQ-116 notes the cadence as unwritten). The packet should say so in one line so the GM is not left inferring it from ADR-0003.
3. **What happens between fights inside a session** other than the engagement-end care window (which is written): no travel, no camp, no Stress relief. Acceptable if the packet says a Phase 1 session is a chain of Titan Engagements with care windows.
4. **Advancement.** No XP, Train, or Rank rules (declared unwritten, ADR-0011). A playtest of more than two sessions has no growth. Acceptable as declared, but the packet should say the Squad is static.
5. **A sheet layout.** Every field is listed (`lifepath.yaml`, `sheet-fields.yaml` in `harm/` and `gear/`, `squadmates.yaml` `stat_block`) but no character sheet or Squad sheet handout exists. A packet needs one; it is a rendering task, not a rules gap.
6. **A one-page order of a Titan card and a round.** It exists as `round.yaml` `titan_card_checklist` and `behavior-procedure.yaml` `resolving_a_card`; the packet should print it.
7. **Chase and leaving the field.** A Squad at Distant can leave and the Titan Engagement ends (section 5.11); nothing chases them. Fine for Phase 1, declared.

## Attack on Titan (845 to 850) fidelity, and Phase 2 or Shifter leaks

- The setting texture is right for 845 to 850: Shiganshina, Trost, Mitras, the Underground, the Church of the Walls, Wall Maria refugees from 848 on (three Training Years after the fall), the 3-year Training Corps, the Top 10 and the Military Police offer, Survey Corps formations, flares, horses, cloaks, and the Nape as the only kill. Canon Ties (Hannes, Armin, Sasha) are optional and mechanically empty, as ADR-0001's fidelity stance wants.
- The Titans behave like Titans: Attention on whoever is hooked in, Grabs that lift and devour over two turns, Regeneration that erases Openings, an Abnormal that runs past the cutters. The one place fidelity is bent is decided: a standard Titan does not close on a soldier at Distant (Positions are relative and the Titan does not move), so a Squad that stays out of reach is safe until Background clocks force a retreat. That is ADR-0010's model and the Chase rules' job; not re-litigated.
- No Shifter or Phase 2 mechanics leak in. Shifters, Intent Tables, Chases, Expeditions, Requisition, Rank, and XP appear only as "not yet written" pointers. The one term slip is Minor 2.
- The glossary's `_Avoid_` lists are respected. I searched all six chapters for every banned word; the hits are "NPC" (not banned), "Wooded terrain" (ADR-0014's own phrase; the ban is "terrain type"), "group" for the Cadets in the Exam (who are not yet a Squad), and "role" for cutter and striker fight roles (the ban is on "role" for Specialty). None misuses a glossary term.

## Things checked and found sound

Recorded so the next pass need not repeat them.

- Prose versus YAML: Funding 3 Standard Issue (ODM 2, horse 2, 1 spare, 3 Blade Sets, flares 2, medical 2); the Size Class rows and every Chapter 6 rendered table; Break Attention needs (holder 1, others 2, 2 against a holding Titan, +1 Feint, +1 per decoy in a row) in Chapter 5, `attention.yaml`, and `grab.yaml`; the flag lifetime across `attention.yaml`, `behavior-procedure.yaml`, `draw-attention`, Chapter 5, and Chapter 6; the Mira example against `origins.yaml`, `training-years.yaml`, and `class-rank.yaml` (Merit 5 is Class Rank 25); the Squadmate templates' Health and Resolve; 40 Talents, 20 dice and 20 rule; seven dormant entries.
- Tables roll: every D6, D66, 2D6 with worsening, and D6 plus band table has rows that cover every total (`min: null` and `max: null` where needed). The Scar table's 12 rows cover D66 in threes. The fall table covers up to 10. The Fear Roll and Stress Response tables cover every D6 + Stress − Resolve.
- Procedures close: a Titan card with a holder at any Position always resolves (fallback, then Thrash); a Next Behavior whose Body Parts broke after it was rolled becomes Thrash; a Grab, a decoy's hold, and "nothing holds Attention" each say what the card does; the two-Focus-Titan close rule, the horse and left-item records when a Focus Titan dies, leaving and returning, the retreat, the no-soldier-standing wait, and left-behind deaths are all defined; a Grabbed soldier who goes Down, a carrier who is Grabbed, a soldier On Body on foot when a grounded Titan stands, and a canister passed before its Gas Roll each have a rule.
- Ordering: Gas Rolls before engagement-end steps; sharing out a dead soldier's gear before promotion before the interim issue; Wings reassigned only at the wings step; a Wing Squadmate whose player character died still takes its turn.
- ADR-0003 and ADR-0010: every procedure file ends with `gm_choices: none`, and I found no step where the GM picks a target, a row, a fallback, an order, or a Position.

## Appendix: the scratchpad model

`fable_review_sims.py` (session scratchpad, not committed) rolls the Chapter 1 pool with one Push that re-rolls base and Stress Dice not showing 6 and adds one Stress Die, forbids the Push when a Stress Die shows 1, and wears the gear item by Gear Dice showing 1 on a Pushed roll. Fresh cut: Break Attention up to three times needing 1 (Perception, ODM Gear, Stress Dice; a Jam ends the trial), then one Nape strike needing the Nape Depth (Strength plus Talent, Blade Set, Stress Dice), for the Rookie (4, 1, 1; Perception 3, ODM 2; Stress 1), the Levi-grade soldier (6, 3, 3; 4, 3; Stress 2), and Nape Depth 3. Grab alone: a Severity 3 dodge (Agility 3, ODM 2, Stress 1), then, on a failed dodge, one Break Free on the second counted turn needing 2 with the 2-die lifted penalty (Strength 4 plus Talent 1 minus 2, Blade 1, Stress after the dodge). One comrade: a Rookie at In Reach strikes the holding arm once before the lift needing 2 successes against grip Toughness 1, then the victim's Break Free. Gas: a 2-die or 3-die Gas Roll each round from Gas Rating 3, rounds until 0. Stress Responses are not resolved and the crush's torso row is not rolled, which is why the Grab cells sit under the report's; the report's figures are the ones to read.
