# Chapters 1 to 3: decisions conformance review, round 2

Reviewed: `docs/rules/01-core-rules.md`, `docs/rules/02-character-creation.md`, `docs/rules/03-harm-and-mind.md`, and the YAML in `data/core/`, `data/character/`, `data/harm/`, and `data/mind/`. The review checks them against `docs/rules/DECISIONS-2026-09-14.md` (OQ-01 to OQ-58, the owner decision on Health boxes, and *Conformance follow-up*), all ADRs (0003, 0005, 0014, and 0015 as amended), `CONTEXT.md`, the OQ-58 entry in `docs/rules/OPEN-QUESTIONS.md`, and the two round-1 conformance reviews. The parallel Codex round-2 review was not read.

Odds below come from throwaway Python scripts run in the session scratchpad, outside the repository, with 200,000 trials per figure. The appendix gives the models.

Severity: **Critical** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable. **Major** is an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem. **Minor** is wording, clarity, or a small gap.

## Verdict

All three round-1 Majors are resolved, and so are the three decided Minors (8, 9, and the glossary part of 11). OQ-58 reaches ADR-0014, Chapter 2 sections 2.2 and 2.10, the Chapter 3 section 3.2 design note, and `squadmates.yaml`. The part-turn spent state reaches Chapter 1 section 1.9, the section 1.8 Help line, `bonus-dice-sources.yaml`, and `effect-types.yaml`. The Exam Cover fix follows round-1 fix option 1 in prose and YAML.

No finding is Critical. One Major is new, and it comes from how OQ-58 was worded. ADR-0014, Chapter 2, and `squadmates.yaml` now say the reference Rookie *is* the Slayer template. The Slayer template's only Talent is Clean Cut 1, which names only `nape-strike`. Every Grab figure in Chapter 3 instead measures a Rookie with Talent 1 on Break Free and on the hand strike. A fresh lone victim dies about 60% of the time with Grip Breaker 1 and about 69% with the Slayer template as written. That brings back the split baseline OQ-58 was decided to remove.

Six Minors cover the Health 3 report Squad, the Veteran build's attribute total, round-1 residue in Sure Seat and ADR-0015, Chapter 1's act block, and provenance tags and wording.

## Counts

| Chapter | Critical | Major | Minor |
|---|---|---|---|
| Chapter 1, Core Rules | 0 | 0 | 1 |
| Chapter 2, Character Creation | 0 | 0 | 1 |
| Chapter 3, Harm and Mind | 0 | 1 | 4 |
| **Total** | **0** | **1** | **6** |

A finding that touches an ADR, the glossary, or several chapters is counted under the chapter it most affects. Its location names every file involved.

---

## Round-1 findings: status

### Majors and decided Minors

| Round-1 finding | Status | Evidence |
|---|---|---|
| Major 1. The round-start refresh wiped out an action spent in advance by Hesitate or Falter | **Resolved** | 1.9: "Both refresh ... except a move or action already spent in advance, which begins its round spent", and *Spent at the start of the round* gains the action-only sentence. The 1.8 Help line reads "A turn or an action spent in advance". `bonus-dice-sources.yaml` `help.condition_in_titan_engagement` and `effect-types.yaml` `spend-next-action.reading` match. 3.9 *Next action spent* matches. Chapter 3 still changes no Chapter 1 rule. |
| Major 2. Exam Covering contradicted Chapter 1 once cycle Help gave each roll one qualifying helper | **Resolved** (fix option 1) | 2.4 and `graduation-exam.yaml` `trials[squad-field-exercise].help` make every Cadet other than the roller qualify to Help each Trial 3 roll while only the cycle helper Helps. Chapter 1's Cover test therefore yields every unrolled Cadet, narrowed by the `forbids: [cover]` rolled state. The simulator target names the same Cover set, and the 6.48% / 6.20% figure was measured with that set. |
| Major 3. Health boxes made the reference Rookie's Health decisive, and ADR-0014 left it undefined | **Resolved as decided** (OQ-58) | ADR-0014 carries the OQ-58 amendment. The 3.2 design note, the 2.2 OQ-19 note, the 2.10 stat block sentence, the `squadmates.yaml` template comment and `matches_reference_build`, and `decided: [..., OQ-58]` are applied. OPEN-QUESTIONS marks OQ-58 Decided. The wording creates findings 1, 2, and 3. |
| Minor 8. Reaction "on an enemy's turn" | **Resolved** | `CONTEXT.md` Reaction, the 2.8 `kind` row, and the `action-catalog.yaml` kind comment all read "when an enemy acts against the soldier, outside the soldier's own turn". No "enemy's turn" survives. |
| Minor 9. ADR-0003 checklist showed the superseded item 9 | **Resolved** | The ADR-0003 body lists the amended item 9 and items 12 and 13. `## Amended` is the change log and quotes the original item 9. |
| Minor 11, glossary part. Health and Down wording | **Resolved** | Health reads "crosses off one box, up to Health". Down reads "from damage, from untreated Critical Injuries crossing off every Health box, or both". The chapter parts are also done: `health.yaml` `day-passes.order` points to `healing.yaml` `each_day`, the header reads "reaching 0 current Health", and 3.3's bullet adds the exception. Down's last sentence keeps a separate slip (finding 7). |

### Other round-1 findings, for the record

| Round-1 finding | Status |
|---|---|
| Opus Minor 4, current-Health derivation and `down` | Resolved. `sheet-fields.yaml` counts only held entries, adds `removed_when`, and has a `down` invariant. |
| Opus Minor 5, "treated or not" Grab figures | Resolved. 3.7 now reads "treated, or ... Health at least 2 more than the untreated Critical Injuries". The model reproduces 74.3% and 88.4% (appendix). |
| Opus Minor 6, Sure Seat "hard ride" | Partly resolved. The design note records the limit, but the `description` field is unchanged (finding 4). |
| Opus Minor 7, "wears the horse" | Partly resolved. Chapters 1 and 2 are fixed, but the ADR-0015 amendment still overstates wear (finding 4). |
| Opus Minor 10, per-chapter act check | Resolved. Chapter 1 has *Acts in this chapter*, and Chapter 2 section 2.9 has the Lifepath sentence. Wording issues remain (findings 5 and 7). |
| Opus Minor 12, Chapter 2 wording and tags | Resolved. "Down by their second", "suffers damage", the `decided:` lists, and Trial 3 `merit` in the `successes_min` form are all in place. |
| Codex Minor 1, over-cap treatment shorthand | Resolved in 3.1, 3.2, 3.3, 3.5, 3.6, `health.yaml`, `treat-injury.yaml`, and `critical-injuries.yaml` `held_injuries.treated`. |
| Codex Minor 2, Squadmate Health lost and Down at creation | Resolved in 2.10 *The starting Squad* and `squadmates.yaml` `starting_squad.creation`. |

## Conformance checks that passed

- **OQ-58.** The ADR-0014 amendment matches the decision text. The builds' derived values check: Rookie Health ceil(7/2) = 4 and Resolve 3; Veteran Health 4 and Resolve 3 + 2 = 5; Levi-grade Health 5 and Resolve 4. The 2.92 template mean (4/9 x 3.25 + 5/9 x 2.65 = 2.917) is right.
- **Part-turn spent state.** Every reader agrees: 1.9 *Spending a turn* skips a turn "whose move or action is already spent in advance", and a Reaction therefore never spends a turn whose action a result has already spent. Down's "a turn that begins while the soldier is Down" and *Ending Down restores nothing already spent* also agree, as does Chapter 3 end step 1's cancellation of "turns and actions a result would have spent".
- **Exam.** The `use`, `roll_order_within_a_trial`, `trials[*]` push, help, cover, and merit fields, `rolled_state.forbids`, and `stress-changes.yaml` `graduation-exam-ends` all agree with 2.4 and Chapter 1 sections 1.5 and 1.8.
- **Health boxes after the fixes.** The worked example's box counts check: Oskar at Health 3 is at 2, then 1; treating the Head Blow leaves one untreated injury, below 3, so Health returns to 2. The "had Oskar's Health been 2" aside checks, and so does Hale's hypothetical Help (Wits 2 + 1 Bonus Die - 2 penalty = 1 base die). Section 3.7's "Health at least 2 more than the untreated injuries" test is exactly the condition that the crushing injury does not take the last box.
- **No `PROVISIONAL` block, "three untreated", "Saddle Dodge", or "item 9, as amended"** survives in the three chapters, their YAML, the ADRs, or the glossary. No `_Avoid_` term appears in the revised text.

**Figures reproduced from the real tables** (200,000 trials each):

| Figure | Chapter quotes | Simulation |
|---|---|---|
| Lone fresh Grab victim dies (Strength 4, Grip Breaker 1) | about 60% | 60.4% |
| Same, one or two earlier torso Critical Injuries | about 74% / 88% | 74.3% / 88.4% |
| Crushing injury Down, 1 or 2 torso injuries held | 41.7% / 72.2% | exact (15/36, 26/36) |
| Death Roll, Strength 4 and penalty 1, alive after the third turn | 15.1% | 15.06% (exact) |

---

## Findings

### 1. Major. The reference Rookie is named as the Slayer template, but every Grab figure measures a Rookie with a Talent that template lacks

**Location:**
- Chapter 3, section 3.2 design note *Reference builds (OQ-58)*: "the Slayer Squadmate template, with Health 4 and Resolve 3, and the victim in the lone-Rookie Grab model in section 3.7".
- Chapter 3, section 3.7 lone model ("Grip Breaker 1") and rescue probe ("rescuers have Strength 4, Talent 1"); section 3.12 *Acceptance test*.
- Chapter 2, section 2.10 *The stat block*: "The simulator's reference Rookie is the Slayer template"; section 2.2 OQ-19 design note.
- `data/character/squadmates.yaml`: `stat_block.matches_reference_build` ("the slayer template is the reference Rookie") and the `templates` comment; `templates[slayer].talent: {id: clean-cut, level: 1}`.
- `data/character/talents.yaml`: `clean-cut.names: [nape-strike]`.
- `docs/adr/0014-numbers-tuned-to-design-targets.md`, OQ-58 amendment ("the Slayer template: Health 4, Resolve 3").

**Problem:** ADR-0014's body gives the Rookie "Talent 1". The Grab models have always read that as level 1 in the Talent that names the roll being measured:
- the lone victim has Grip Breaker 1 on Break Free;
- the OQ-50 rescuers have Talent 1 on a Body Part strike against the hand.

OQ-58 fixed the Rookie's attributes by pointing at the Slayer template. Chapter 2 and `squadmates.yaml` go further and say the reference Rookie *is* that template. A template is a whole stat block, and the Slayer's only Talent is Clean Cut 1, which names only `nape-strike`. A Slayer-template soldier has no Talent dice on Break Free, on the hand strike, or on any Body Part strike.

Grip Breaker 1 belongs to the Brawler template, whose attributes are identical to the Slayer's. Chapter 3's claim that the Slayer template is "the victim in the lone-Rookie Grab model" is therefore false as written.

The difference is material. In the lone-Grab model (appendix), a fresh Strength 4 victim dies:
- 60.4% with Grip Breaker 1, the model 3.7 quotes;
- 69.0% with the Slayer template's Talents, which give Break Free no Talent dice.

A rescuer built from the template also loses one die on every hand strike. That raises every OQ-50 comrades-close cell, where the passing structure's worst cell is 40.6% and the other structure already fails at 52.5%. The prepared-Squad kill target has the same problem, because a Squad of Slayer templates has no Talent on Body Part strikes.

This is the split baseline that round-1 Major 3 and OQ-58 set out to remove. It now sits in Talents rather than Health.

**Scenario:** Two people build the ADR-0014 simulator.
- Author A follows Chapter 2 section 2.10 ("the simulator's reference Rookie is the Slayer template") and imports `squadmates.yaml` `templates[slayer]`. The lone Grab kills 69%, "about 2 in 3". Break Free and the crushing rows need no change, and the six-cell band runs hotter.
- Author B follows the section 3.7 model with Grip Breaker 1 and gets 60%, so Chapter 5 should make Break Free harder.

Both authors cite a decided text, and Chapter 5's Grab tuning has two baselines.

**Fix options:**
1. Keep OQ-58's attributes and say so exactly (decider for ADR-0014; drafter for the chapters and YAML). The reference Rookie has the Slayer template's attributes, and Talent 1 in the Talent that names each roll a target measures, as ADR-0014's body already says. Change 3.2 to "the Slayer template's attributes". Change 2.10 and `matches_reference_build` to "has the Slayer template's attributes". Keep the Grab models as they are.
2. Name a buildable Talent that covers the measured rolls. Blade Discipline 1 names `nape-strike`, `body-part-strike`, and `break-free`, so "Strength 4, Agility 3, Wits 2, 3 elsewhere, Blade Discipline 1" matches the lone model, the rescuers, and the Nape-strike target together. State it in ADR-0014 and the 3.2 note.
3. Keep the template identity literally, and re-measure the lone Grab, the six-cell probe, and the prepared-Squad target with no Talent on Break Free or Body Part strikes.

### 2. Minor. The Health 3 report Squad is specified two ways, and ADR-0014's version also lowers Strength

**Location:**
- `docs/adr/0014-numbers-tuned-to-design-targets.md`, OQ-58 amendment, and Chapter 3, section 3.2 design note: "every soldier at Strength 3 and Agility 3 (Health 3)".
- Chapter 2, section 2.2 OQ-19 design note and section 2.10: "a Squad of Health 3 soldiers".
- `docs/rules/OPEN-QUESTIONS.md` OQ-58: **Decision** "a Squad of Health 3 soldiers"; **Simulator case** "at Health 3 and Health 4".
- `DECISIONS-2026-09-14.md` OQ-58 **Why**: the Grab "is 60% at either Health" with one earlier injury, a figure measured at Strength 4.

**Problem:** The report exists to show how Health spreads the Down point. ADR-0014 builds it by moving every soldier to Strength 3, which also takes a die off every Break Free and every strike. The decision's own Health 3 Grab comparison kept Strength 4, and Chapter 2 and the register describe only Health.

The ADR's Squad also leaves the rest of each soldier open. It does not say which attribute is 4, which is 2, or so what Resolve is, and Resolve feeds every Fear Roll and Stress Response in the Grab probes.

Health has no effect on a fresh lone victim, since the crushing row alone decides Down. Yet the model gives 60.4% at Strength 4 and 68.9% at Strength 3, so the ADR's report would show an 8.5-point Grab gap with no Health cause. "Every target that depends on Health" is also never listed.

**Scenario:** The simulator reports "Grab alone: 60% reference, 69% Health 3 Squad". A Chapter 5 drafter reads that as Health 3 soldiers dying more often in a Grab, and asks for a gentler crushing row. No Health 3 soldier without earlier injuries is affected by Health at all.

**Fix options:**
1. Define the report Squad as the reference builds with only Health changed to 3 (a simulator override of the derived value), which is what the decision's Why measured. Align the ADR-0014 and 3.2 wording with Chapter 2 and the register.
2. If a buildable soldier is wanted, name one, such as the Hunter or Engineer attributes (Strength 3, Agility 3, Resolve 3) with the reference Talent levels. State that the report then mixes a Strength change with the Health change.
3. List the targets that depend on Health: the Expedition PC Critical Injury and death targets, and the Grab for a victim carrying untreated injuries.

### 3. Minor. The Veteran reference build has 20 attribute points, which no soldier can have

**Location:** `docs/adr/0014-numbers-tuned-to-design-targets.md`, OQ-19 and OQ-58 amendments ("Veteran is Strength 5, Agility 3, and 3 elsewhere"); Chapter 3, section 3.2 design note; Chapter 2, section 2.2 item 5 ("every new soldier has 18 attribute points, or 19 with a Top 10 Class Rank"); ADR-0011.

**Problem:** Strength 5 plus five attributes at 3 is 20 points. A player character has 18, or 19 with a Top 10 Class Rank, and attributes never rise. A Squadmate has 18 and gains none on promotion. The Levi-grade build (26 points, key 6) is plainly an outlier, but the Veteran is meant to be what a surviving Rookie becomes, and no Veteran can hold these attributes.

This does not re-litigate the choice of builds. A legal Veteran exists with the same derived values: the Rookie template plus a Top 10 Class Rank (Strength 5, Agility 3, Wits 2, 3 elsewhere, 19 points). It has Health 4 and Resolve 5 with two Scars, so no quoted Health or Resolve figure moves. Only a Wits-based Veteran figure, such as Treat Injury, would be one die high.

**Scenario:** Chapter 6's ladder compares "a supported Rookie at Severity 3" with "a lone Veteran", and a Chapter 5 treatment figure is measured on a Veteran with Wits 3. A table's two-Scar Top 10 Slayer with Talent 2 matches every other statistic but has Wits 2, one die short of the published figure.

**Fix options:**
1. Ask the decider to give the Veteran Wits 2 (19 points, a Top 10 Rookie with two Scars) in ADR-0014, and mirror it in the 3.2 note.
2. Or state in ADR-0014 that the Veteran, like the Levi-grade soldier, is deliberately above any buildable total.

### 4. Minor. Sure Seat's description and ADR-0015's amendment still carry the wording round 1 flagged

**Location:**
- `data/character/talents.yaml` `sure-seat.description`: "A seat that keeps the horse sound when a dodge or a hard ride is Pushed."
- Chapter 2, section 2.7 OQ-28 design note: "whatever its description says about a hard ride".
- `docs/adr/0015-titan-attacks-land-unless-dodged.md` `## Amended`: "A Pushed dodge made with the horse wears the horse".

**Problem:** Round 1 Minors 6 and 7 were fixed in chapter prose, but the texts a player or importer reads first still say the old thing.
- **Sure Seat.** The design note now tells readers to disregard the Talent's own `description`, the field section 2.7 says is written "for players". That is rulebook-to-data drift of the kind ADR-0012 exists to prevent, and "hard ride" also lowercases the glossary Pace *Hard Ride*.
- **ADR-0015.** The amendment still says every mounted Pushed dodge wears the horse. Chapters 1 and 2 correctly say only Gear Dice showing 1 do, which on 1 Gear Die is 1 Push in 6.

**Scenario:** A Rider's Foundry item card shows "when ... a hard ride is Pushed". The player expects Sure Seat on Hard Ride Legs, but it never triggers outside a Titan Engagement. A Chapter 4 drafter quoting ADR-0015 writes horse wear on every Pushed mounted dodge.

**Fix options:**
1. Change the description to "A seat that keeps the horse sound when a dodge, Ride, or Break Attention made with the horse is Pushed in a Titan Engagement", and drop the design note's "whatever its description says" clause.
2. Ask the decider to change ADR-0015's sentence to "When a dodge made with the horse is Pushed, its Gear Dice showing 1 wear the horse, not ODM Gear, and it does not raise the Gas Roll."

### 5. Minor. Chapter 1's act block misdescribes the move, and its end-of-Engagement bullet speaks only of Reaction turns

**Location:** Chapter 1, section 1.10 *Acts in this chapter*; section 1.9 *Reactions*, "When the Titan Engagement ends"; `data/character/action-catalog.yaml` `tracked_values[position-change].changed_by`; Chapter 3, section 3.16 step 1.

**Problem:**
- *Acts in this chapter* opens "Each act this chapter lets a soldier choose has a Catalog entry and a tracked value", then lists the move. The Catalog says `position-change` is "changed_by: a move, not a Catalog entry".
- Section 1.9 now lets a result spend an action in advance on its own. Its OQ-15 bullet still says only that "Turns spent in advance exist only inside the Titan Engagement where the Reaction was made". Chapter 3's end step 1 cancels turns and actions that a result spent, so no rule is missing, but Chapter 1 read alone carries a result-spent action into the next Titan Engagement.

**Scenario:** A Foundry combat tracker built from section 1.9 clears the Reaction turn-debt flags when combat ends but leaves an action flag set by Hesitate. The soldier's first turn of the next Titan Engagement starts with no action.

**Fix options:**
1. Write "Each act ... has a tracked value, and a Catalog entry unless it is a move".
2. Change the bullet to "Turns and actions spent in advance, by a Reaction or a result, exist only inside the Titan Engagement where they were spent ... (Chapter 3, section 3.16, step 1)".

### 6. Minor. `decided:` tags in Chapter 1 and Chapter 3 YAML lag the decisions they implement

**Location:**
- `data/core/bonus-dice-sources.yaml` `help.decided: [OQ-03, OQ-08, OQ-13]`: it implements OQ-17 (unspent action) and OQ-18 (forbid hook).
- `data/core/stress-changes.yaml` `cover.decided: [OQ-06, OQ-08, OQ-13]`: it implements OQ-18.
- `data/harm/down.yaml` `decided: [OQ-45]`: the `forbids` row is OQ-18.
- `data/mind/fear-rolls.yaml` `decided: [OQ-49, OQ-50]`: the three `forbids: [reaction]` rows are OQ-18, and `limits.timing` is OQ-52.
- `data/harm/effect-types.yaml` `no-reactions.decided: [OQ-09, OQ-46]`: its hook sentence is OQ-18.

**Problem:** Round 1 finding 12 completed Chapter 2's provenance tags only. The files the Foundry system imports still cannot answer "which rows implement OQ-18" from their tags.

**Scenario:** A later decision revises the forbid hook. The maintainer searches `decided:` for OQ-18, finds only `graduation-exam.yaml`, and misses Down, the three Fear rows, Help, Cover, and No Reactions.

**Fix options:**
1. Add OQ-17 and OQ-18 to `help`; add OQ-18 to `cover`, `down.yaml`, `fear-rolls.yaml`, and `no-reactions`; add OQ-52 to `fear-rolls.yaml`.

### 7. Minor. Chapter 3's act check names entries without tracked values, and glossary Down says "0 Health"

**Location:** Chapter 3, section 3.17 *Every act in this chapter has a Catalog entry*; `data/character/action-catalog.yaml` `death-roll.changes: []`; ADR-0003 item 12; `CONTEXT.md` Down.

**Problem:**
- ADR-0003 item 12 asks each chapter to check that each consequential act "has a tracked value and an entry". Chapter 3's list gives entries only, and it pairs "Surviving a lethal Critical Injury" with `death-roll`, whose `changes` is empty. Chapter 1 settles the same kind of case by calling a Push a step of a roll. Chapter 3 does not say the Death Roll is a roll its rule calls for rather than an act.
- The glossary Down entry ends "Reaching 0 Health through damage also inflicts an immediate Critical Injury". Health, the rating, never changes, and the entry itself begins "0 current Health". Round 1 fixed the same slip in the `health.yaml` header.

**Scenario:** A Chapter 4 reviewer applying item 12 asks what tracked value the Death Roll changes. Chapter 3's answer points to an entry that changes none.

**Fix options:**
1. Give each act its tracked value: `treat-injury` changes `critical-injury-treat`, `health-restore`, and `down-end`; `rally` changes `stress-response-clear`; `lift-comrade` changes `comrade-carry`. Add "The Death Roll is a roll its rule calls for, not an act, so it needs no tracked value".
2. Ask the decider to change the glossary to "Reaching 0 current Health through damage".

---

## Appendix: models

**Lone Grab (`grab.py`, `grab2.py`, 200,000 trials per figure).**
- **Victim:** Strength 4 or 3, Break Free Talent 1 or 0, Blade Set 1 Gear Die, Stress 2, Resolve 3.
- **Crushing injury:** the torso rows at 2D6 plus 2 per earlier torso injury. A lethal or instant-death row becomes the `torso-caved-chest` cap. The row's `break-free` penalty applies, and Winded's 1 Stress is gained on recording.
- **Down:** a Down row means no Break Free, so a lone victim dies.
- **Break Free:** two turns, each needing 3 successes. Push when short and no Stress Die showed 1: Stress +1 (+1 more with Hair Trigger), a new Stress Die, and base and Stress Dice not showing 6 re-rolled, with the Gear Die kept.
- **Stress Responses:** resolved on the real table at post-Push Stress. Lasting rows (with the already-held shift) apply from the next roll: Shaking Hands gives a Break Free penalty, Hair Trigger gives Push Stress. Flinch loses 1 success; Locked Up loses 1 success and the second turn; Botched sets successes to 0 and adds 1 Stress.
- **Not modeled:** Help, Cover, Drives, Titan cards, and gear depletion. Earlier torso injuries add worsening only, not their own penalties.
- **Results:** 60.4% (Strength 4, Talent 1), 69.0% (Strength 4, Talent 0), 68.9% (Strength 3, Talent 1), 74.3% and 88.4% (Strength 4, Talent 1, one or two earlier torso injuries).

**Exact figures.** The crushing Down odds are 2D6 totals of 8 or more (15/36) and 6 or more (26/36). The Death Roll after three `turn` limits sums P(slowed on turn 1) + P(1 success, then slowed) + P(1 success twice, then alive) on 3 dice.
