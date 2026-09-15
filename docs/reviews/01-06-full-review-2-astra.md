# Wings of Freedom — Chapters 1–6, full review, round 2

Reviewer: Codex / Astra. Date: 2026-09-15.

## Verdict

**0 Critical, 2 Major, 0 Minor findings still open this round.** The original round 1 findings are resolved. Two gaps remain for a group playing from the six chapters: the interim day's treatment participants, and the Background Titan size rolls omitted from the chapter's setup instructions. Resolve these before handing out the packet.

This is a rules review, not evidence of a completed human playtest. OQ-112's four-striker advantage remains an acknowledged unresolved Major; it is not counted again here. Other logged measurement and playtest limitations remain as described below.

## Scope and method

Reviewed Chapters 1–6, their YAML, `CONTEXT.md`, the amended ADRs, the decisions register through batch 5's late decisions 5-13 and 5-14, and `OPEN-QUESTIONS.md`. Verified the scenarios in both round 1 reviews. Followed `.claude/agents/wof-reviewer.md`. Did not read either parallel round 2 review.

Checked rendered references against their YAML, inspected the renderers, loaded all 59 YAML files with duplicate-key rejection, checked live Talent references and Lifepath choices, and enumerated Behavior Table move-up outcomes. Used Python simulations in `/private/tmp/wof-round2-astra/`; distinguished an independent dice model from fresh executions of the repository's fight model. No project file was changed except this review.

## Findings still open

### M1 — Major — The interim day's care window has no scope outside an Expedition or Downtime

**Location:** Chapter 3, §3.5 *Care windows* and §3.6 *Healing time*; Chapter 5, §5.1 *Sessions*. Sources: `data/harm/treat-injury.yaml`, `care_windows.held[id=day].scope`; `data/harm/healing.yaml`, `day_passes.interim` and `each_day`.

Batch 5 successfully makes a day pass at the start of a Phase 1 session. That day runs `each_day`, including a care window before day-limit Death Rolls. But the scope of the day window still has only two cases: soldiers on the Expedition during which the day passes, or all the Squad for a day in Downtime. The new interim day is not assigned either case. Phase 1 explicitly permits a chain of Titan Engagements before Expedition procedures exist. The glossary also defines Downtime as time inside the Walls between Expeditions, so a pause in a field scene does not automatically qualify.

Scope is a mechanical eligibility condition: it restricts patients, treaters, helpers, and Coverers. The rules supply an explicit all-Squad fallback when no Expedition is underway for the *outside-harm* window, but omit that fallback from the *day* window. OQ-120 and OQ-116 settle when the interim day passes; neither supplies this missing scope.

**At the table:** Session 1 ends after a field Engagement. A soldier is Down with an untreated lethal injury whose limit is `day`. No Expedition or Downtime procedure is underway. Session 2 opens with the interim day before the issue. A standing Medic wants to treat the patient, with a comrade helping, before the day-limit Death Roll. The day must open a care window, but no scope identifies whether these three soldiers participate. The group must add a participant rule at the point where treatment eligibility affects whether the patient faces a Death Roll.

This is an undefined integration case, not a renewed objection to the decided session-day cadence. The original absence of a day trigger is resolved.

**Fix options:**

1. Add the interim case to the day window: when no Expedition is underway, its scope is every soldier in the Squad. Mirror it in §3.5.
2. Explicitly assign interim days a named scope of their own, with a complete default for the Phase 1 chain of Engagements. Do not require the group to invent an Expedition to determine it.

### M2 — Major — Chapter 5 omits the rolls that determine Background Titan sizes

**Location:** Chapter 5, §5.1 *The interim setup table*, numbered step 3 and the rendered Size Class and Background Titans tables; §5.10 *Background Titans*. Source: `data/engagement/engagement-setup.yaml`, `steps[id=background-titans].text`.

The YAML gives a complete procedure: roll for the number of Background Titans, then roll D6 on `size_class` separately for each, in clock order; never make the Abnormal check for these Titans. The chapter only says to roll for Background Titans and their clock lengths, followed by “Each Background Titan is the standard Titan of its Size Class.” It never calls the per-Titan Size Class rolls. The rendered size table is expressly titled “The Focus Titan's Size Class,” and its final column is “Focus Titan.” The rendered Background table supplies counts and clock lengths but no sizes.

The source rule is defined, so this is a chapter procedure omission rather than an undefined canonical mechanic. Byte-for-byte renderer agreement does not detect it: the generator renders the lookup rows but not this source instruction. Section 5.10 requires the Background Titan's Size Class and stat block to be public at setup, and Chapter 6 maps a known Size Class to a standard Titan without telling the reader how to determine it.

**At the table:** The Focus Titan is Medium. The Background roll is 6, giving two Titans with clocks 4 and 8. A group using the chapters has no instruction to determine either Background Titan's class. Reusing Medium, rolling twice, and choosing sizes produce different encounters. The YAML's single answer is two additional Size Class rolls in clock order: for example, rolls 2 and 6 produce a standard Small Titan on clock 4 and a standard Large Titan on clock 8. That procedure must reach the packet reader.

**Fix options:**

1. Restore the explicit per-Background-Titan Size Class roll to numbered step 3, including clock order and the absence of the Abnormal roll. Retitle the size lookup so both uses are clear.
2. Render the setup's procedural steps from YAML alongside its lookup tables, preserving the distinction between the Focus-only Abnormal check and the shared Size Class lookup.

## Round 1 verification

“Resolved” below concerns the reported defect. It does not imply that every neighboring procedure is complete; M1 and M2 above identify the remaining integration and packet gaps.

### Critical and Major scenarios

| Prior finding | Status | The outcome the current rules give |
|---|---|---|
| Astra C1 — essential tables absent | Resolved | Origin 11 is now readable as Shiganshina District, with its attribute, Talent, and Haven choices. A fall's band modifier and damage lookup are printed in Chapter 4. Creation, injuries, mind results, issue, movement, and Titan tables are present as generated references. M2 above concerns an omitted procedural instruction, not a missing lookup table. |
| Astra C2 — retreat allowed the lone cut before departure | Resolved | In the original Wooded scenario, the soldier at Blind Spot of A and Distant from B must make the retreat move before their action. Their earlier initiative card and decoy do not permit the fresh Nape cut before moving. Option 4 is a rescue exception, not a free cut. The late 5-13 exception permits Lift Comrade before movement; spending that action on the lift does not restore the prohibited cut. |
| Astra M1 — last kill removes aftermath Positions | Resolved | The Down patient's and standing Medic's last In Reach Positions survive as the end-step comparison records. Killing the last Titan allows the Medic the patient's one aftermath attempt before the Death Roll. Success stabilizes the chosen injury; failure leaves its Death Roll due. Cleanup does not erase eligibility first. |
| Astra M2 — two Titans give different fall heights | Resolved | For a soldier airborne On Body of Large A and In Reach of Medium B, a Jam on the dodge against B reads the closer Position, On Body of A. Large raises high to extreme. A raw 5 becomes 9 and deals 4 damage: at current Health 3 the soldier becomes Down and takes the resulting Critical Injury. The landing changes A's Position to In Reach; B's In Reach remains. The causing Titan breaks a distance tie; otherwise the earliest label does. |
| Astra M3 — crush made the victim Down before the hold | Resolved | The hold establishes Grabbed and ends the victim's own airborne state before the crush crosses off a Health box. A crush that makes the victim Down leaves them Down in the hand, with the Grab countdown; it does not also trigger the formerly possible airborne fall and extra injury. |
| Astra M4 — Horsemanship has no live caller | Resolved | The Minor Noble House / Rider build can legally acquire Horsemanship and add its level as base dice to a mounted dodge using the horse. Ordinary mounted movement is unrolled. Ride itself stays dormant until Chase rules call it. |
| Fable Major 1 — no rule makes a day pass | Resolved | At session 2's start, before the interim issue, a day passes: Ilse's damage heals and Oskar's treated arm with 10 healing days remaining drops to 9. Day-limit Death Rolls follow the day's care window. If the session resumes mid-procedure, the day waits until that procedure ends. Stress and Grief do not reset. M1 above identifies the new window's missing scope, rather than a missing day trigger. |
| Fable Major 2 — Ride and Horsemanship never used | Resolved | The Rider template and the affected Lifepath Talent choices now have the mounted-dodge caller. Horsemanship contributes its level there; it does not demand a roll for routine mounted movement. The Action Catalog explicitly keeps Ride dormant for Chase. |

### Minor findings

| Prior finding | Status | Verification |
|---|---|---|
| Astra m1 — one success breaks an intact Small Body Part | Resolved | The note now advances the part one state per success. An intact Toughness 1 part still needs two successes to become Broken. |
| Astra m2 — unquoted commas truncate YAML strings | Resolved | The affected strings retain the complete clauses, including Squadmate harm handling and the prohibition on changing a clock, counter, or obstacle. YAML loading and generated references preserve them. |
| Fable Minor 1 — simulator described as not yet built | Resolved | §5.13 identifies `tools/sim/` and its report. The existing report's stale snapshot banner is a separate, explicitly disclosed rerun state. |
| Fable Minor 2 — telegraph uses Shifter term Intent | Resolved | The sentence now describes what the Titan will do next without using the reserved term. |
| Fable Minor 3 — Distant contradicts running behaviors | Resolved | Distant is outside the standing Titan's reach; the named running behaviors explicitly reach it. Run Past and Trample follow their stated targets and effects. |

## Rendering, data, and first-playtest completeness

Both checks passed against the reviewed files:

```text
tools/render/render.py check
Every rendered block matches the YAML (32 blocks in 4 chapters).

tools/probes/chapter-06/render.py check
Every rendered block matches the YAML.
```

Commands ran with Python bytecode disabled and the existing temporary PyYAML installation on `PYTHONPATH`. All 59 YAML files loaded without duplicate mapping keys. Origin and enlistment D66 rows cover the 36 possible results; referenced Talents exist, and offered Talent choices retain live options. These checks establish source integrity and rendered agreement, not semantic completeness; M2 is the distinction in practice.

A new group can now follow the Lifepath or Squadmate route, assign gear and supplies, read the action and Talent effects, resolve injury and mind rolls, and use the four Chapter 6 stat blocks and Behavior Tables. The engagement procedures cover Attention, movement, strikes, Grab and rescue, Titan death, retreat, aftermath, and promotion. The interim day provides actual recovery and lethal-day timing between sessions. **The remaining missing rules for that route are the two findings above.**

The four Titan procedures were also checked for unavailable-part and repeat-entry handling. Independent enumeration covered 144 combinations of broken parts and previous behavior per Titan, with all six starting rolls in each. No enumerated state exceeded the one-half kill-tier move-up ceiling; the no-eligible-entry case has the written fallback. No new unresolvable standard-Titan or Abnormal behavior was found.

The packet remains a Phase 1 engagement playtest. Expedition missions, Chase's Ride caller, Downtime actions, and campaign recovery of Stress/Grief are expressly deferred; the interim day promises neither Stress nor Grief relief. A recurring campaign and the Expedition attrition targets are not validated by this review. The physical sheets/cards and a timed table rehearsal remain practical preparation; the chapters' records can be transcribed for the first playtest.

## ADR-0014 and balance

Applied batch 5's actual tolerances: five percentage points for the specified “about” proportions, exact stated limits and medians, and the second-seed pooled reading for a result just outside an edge. Did not impose an old 12-round artificial ending. Did not treat a sensitivity row as the reference baseline.

### Independent dice simulation

`/private/tmp/wof-round2-astra/independent.py` is a standalone dice model, with no repository simulation imports. Seed **91522026**, **200,000 trials per row**. It models the fresh cut after successful Break Attention, the stated reference pools and Push handling, Stress Responses and applicable wear; the success rate below is conditional on reaching the cut, not the unconditional chance of the whole attempt. Gas is separately rolled through exhaustion.

| Check | This run | Decided target |
|---|---:|---|
| Rookie fresh Nape cut | 25,781 / 195,986 cuts = **13.1545%** | 8–14% |
| Levi-grade fresh Nape cut | 94,459 / 199,445 cuts = **47.3609%** | 45–55% |
| Gas, two dice | Median **8**, mean **9.2378** rounds | Median 8; reference mean 9.25 |
| Gas, three dice | Median **6**, mean **6.3434** rounds | Median 6; reference mean 6.33 |

### Fresh fight-probe checks

Separately ran the current Chapter 6 fight probes from an external Python harness: **12,000 fights per Titan**, seeds **91522026–91522029**, eager baseline policy, and the Abnormal's mounted-start configuration. These are fresh executions of the repository model, **not a second independent implementation of full combat**. All four runs reported zero safety-cap endings.

| Titan | Median kill round | Killed by round 3 | No kill | Critical Injuries/fight | Deaths/fight |
|---|---:|---:|---:|---:|---:|
| Small | 2 | 81.3% | 1.90% | 0.8298 | 0.0472 |
| Medium | 3 | 61.1% | 8.32% | 0.6948 | 0.0490 |
| Large | 3 | 60.9% | 14.62% | 1.3362 | 0.1732 |
| Sprinting Abnormal | 2 | 69.5% | 8.77% | 0.8648 | 0.1147 |

Medium Grabs were **0.216 per fight**, within 0.15–0.30. Its death estimate has standard error **0.0026**: this small rerun supports the result but cannot settle a very narrow boundary alone. Batch 5's recorded larger runs give **0.0499 and 0.0482** against the exact 0.05 edge. The Large no-kill result agrees with the recorded **14.4% and 14.6%**. Large deaths are not judged against the Medium-only death ceiling.

The amended ADR records the lone Grab at **69.9%** and the close-comrade reference cell at **33.2%**, inside their 61.7–71.7% and 28.3–38.3% bands. Those are authority-recorded results, not additional independent measurements in this review. Batch 5 records the Abnormal bar holding in both orders, including the helpers margins of **−10.5 and −11.8 standard errors**. The baseline rerun above does not independently reproduce that entire policy matrix.

The newly decided **5-14** explicitly assigns first-Titan-Engagement deaths of **0.063** to a sensitivity row; it is not an unlogged miss of the reference-start band. **5-13** decides the Lift-before-move exception. Any remaining PROVISIONAL marker on that exact exception is tracked by OQ-119 and its removal instruction, so it is not a fresh finding.

At review close, `docs/reviews/simulator-report.md` still carries its stale-snapshot warning and pre-batch-5 horizon material. As the task warned, that report is being rerun. I have not used its stale horizon verdicts as current failures or represented its full coverage as current. Neither new Major above rests on a disputed odds claim.

### Known balance and validation limits

- **OQ-112:** Four strikers outperform the two-cutter/two-striker baseline. This remains the acknowledged dominant-policy problem; no materially worse result established here warrants duplicating it.
- **OQ-115:** Two Focus Titans, Background arrivals, and the retreat forced by Background clocks still lack the full combined measurements. The one-Focus retreat check does not close that item.
- **OQ-116–118 and OQ-128:** Retain the register's sequence, build/model, and reconciliation qualifications. The new interim day does not validate a complete campaign simulation.
- The timed human round test remains necessary. Dice results cannot establish that six participants can execute the tracker and turn procedure within its time target.

## Fidelity and scope

No new actionable 845–850 fidelity defect or operative Shifter/Phase 2 leak was found. Standard Titans use public fixed procedures; the Abnormal's hidden values and Read facts remain bounded. ODM wear, gas, horses, lethal injuries, panic, and rescue keep their stated consequences. Reserved later-phase terms and dormant actions are identified as such. This review does not reopen decided abstractions on taste.

## Counts by chapter

Each new finding is counted once in its primary chapter. Resolved round 1 findings and already logged issues are excluded.

| Chapter | Critical | Major | Minor |
|---|---:|---:|---:|
| 1 — Core Rules | 0 | 0 | 0 |
| 2 — Character Creation | 0 | 0 | 0 |
| 3 — Harm and Mind | 0 | 1 | 0 |
| 4 — Gear | 0 | 0 | 0 |
| 5 — Titan Engagement | 0 | 1 | 0 |
| 6 — Standard Titans | 0 | 0 | 0 |
| **Total** | **0** | **2** | **0** |
