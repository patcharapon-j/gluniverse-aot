# Chapter 3, Harm and Mind: review round 1

Reviewed `docs/rules/03-harm-and-mind.md`, every YAML file in `data/harm/` and `data/mind/`, Chapter 1 and `data/core/`, Chapter 2 and `data/character/`, `CONTEXT.md`, every ADR, and OQ-38 to OQ-55. I did not read the parallel Chapter 3 review.

I parsed all 27 YAML files across the four data directories and checked table coverage, effect ids, Action Catalog references, non-lethal cap rows, and prose against data. I ran the probability checks from `/private/tmp/wof-ch3-r1.qhcdyN`, outside the repository, with 1,000,000 trials per case.

## Verdict

No Critical finding remains. Three Major and two Minor findings are open.

The body and mind procedures are usable, the open-ended tables cover every possible total, and the Grab target remains reachable. The largest rules bug is at the end of a Titan Engagement. Stabilizing a lethal injury in the care window can award a fifth Scar after the Engagement has technically ended, which makes Retirement happen immediately in the middle of the ordered end procedure.

## Findings

### 1. Major. A fifth Scar gained in the end care window retires the soldier in the middle of the end procedure

**Location:** section 3.13, lines 420 to 447; section 3.16, lines 474 to 485; `data/mind/scars.yaml`, `gaining` and `retirement`; `data/harm/engagement-end.yaml`, steps `care-window` through `retirement-and-promotion`; OQ-51 and OQ-54.

**Problem:** Stabilizing a lethal Critical Injury gives a Scar. The end-of-Engagement care window happens after the Titan Engagement ends. Retirement waits for the final step only when the fifth Scar was gained "during" a Titan Engagement; otherwise it happens at once. A soldier who gains their fifth Scar from treatment in this care window must therefore retire before the remaining care rolls, Death Rolls, Grief, and the final Retirement and promotion step. This contradicts OQ-54's ordered procedure and Chapter 2's promotion timing.

**Scenario:** Mina has four Scars and an untreated Punctured Lung. The Titan Engagement ends. During the care window, another soldier stabilizes it, so Mina gains her fifth Scar. The Retirement rule says she leaves play immediately. The end procedure says she remains until step 8. Those readings can change whether Mina makes a later Treat Injury roll in the same window and whether her promotion happens before the pending Death Rolls.

**Fix options:**

1. Treat every Scar gained during the end-of-Engagement procedure as gained during that Titan Engagement for Retirement timing. Mark Retirement pending and resolve it only at step 8.
2. State that Retirement never resolves while an end-of-Engagement procedure is in progress, regardless of how the fifth Scar was gained.

### 2. Major. Careful Nursing gains a self-treatment use that Chapter 2 forbids

**Location:** section 3.6, line 277; `data/harm/healing.yaml`, `healing_time.careful_nursing`; Chapter 2, section 2.7 and `data/character/talents.yaml`, Talent `careful-nursing`, lines 327 to 339; OQ-44.

**Problem:** The closed Chapter 2 Talent triggers only when the soldier's Treat Injury roll succeeds on a comrade's Critical Injury. Chapter 3 instead halves the healing time whenever a soldier with Careful Nursing succeeds on a Critical Injury. Since Chapter 3 permits self-treatment, its rule grants a use the Done dependency does not. Healing a 21-day injury in 11 days is a material campaign benefit, not harmless wording drift.

**Scenario:** A medic with Careful Nursing treats their own Fractured Skull during a care window. Chapter 2 says the Talent does not trigger because the patient is not a comrade. Chapter 3 says to halve the remaining healing time.

**Fix options:**

1. Add "a comrade's" to section 3.6 and `healing.yaml` so Chapter 3 follows the existing Talent.
2. If self-care is intended, reopen Chapter 2 and change the Talent there rather than silently widening it in Chapter 3.

### 3. Major. Healed amputations reset worsening and permit impossible repeat injuries

**Location:** section 3.2, lines 95 to 123; section 3.6, lines 274 to 277; `data/harm/critical-injuries.yaml`, `worsening`, `held_injuries.sides`, and the Lost Arm, Lost Leg, and Lost Eye rows; OQ-41 and OQ-42.

**Problem:** Worsening counts only held Critical Injuries. Healing removes an injury from the held list even when its permanent effect remains. Because the game tracks neither sides nor destroyed anatomy, a healed Lost Arm, Lost Leg, or Lost Eye leaves no location state for the next injury roll. The same location can restart at a light result, and the literal loss result can occur repeatedly without limit. This also weakens the glossary promise that a second injury to the same Injury Location lands on a worse result.

**Scenario:** Oskar loses an eye, survives, and completes the 28-day healing time. His Lost Eye stops being held. His next head Critical Injury rolls 4 and becomes Dazed. Later he can roll Lost Eye again, then do so a third time after that injury heals.

**Fix options:**

1. Track a permanent destroyed-location state and give each injury table a closed replacement rule for results the soldier can no longer suffer.
2. Keep a healed injury with `permanent_effects` as location history for worsening, while stating exactly how many such results one location can hold.
3. Rename the permanent rows as impairments that can recur without requiring missing anatomy.

### 4. Minor. A Down soldier's first Titan Engagement leaves the `faced_a_titan` field false

**Location:** section 3.12, lines 379 to 395; section 3.17, line 497; `data/mind/fear-rolls.yaml`, trigger `first-titan-engagement` and `limits.not_down`; `data/harm/sheet-fields.yaml`, field `faced_a_titan`; OQ-49.

**Problem:** The first-Engagement trigger records `faced_a_titan` after the Fear Roll, but a Down soldier makes no Fear Roll. Such a soldier can hold a Position and satisfy the historical event without ever setting the field meant to record it. Rules text can remember the fiction; a sheet or Foundry implementation cannot rely on the declared field.

**Scenario:** A wounded soldier is carried into their first Titan Engagement while Down. They make no Fear Roll. They recover before the next Titan Engagement, but their sheet still says `faced_a_titan: false`, so an implementation can call for the first-Engagement roll again.

**Fix options:**

1. Set `faced_a_titan` when the soldier first holds a Position, whether or not they are eligible for the Fear Roll.
2. Record a skipped first-Engagement roll as consuming the trigger.

### 5. Minor. The chapter and OQ-55 omit the field that enforces Careful Nursing's once-per-injury limit

**Location:** section 3.17, lines 489 to 499; `data/harm/sheet-fields.yaml`, `critical_injuries.each_records.halved`; OQ-55, lines 882 to 889.

**Problem:** The YAML correctly records `halved`, which prevents Careful Nursing from halving one injury more than once. The chapter's claimed field inventory and OQ-55's question omit it. A paper sheet built from the prose has no stated place to record that the one-time benefit was used.

**Scenario:** A treated 21-day injury falls to 11 days. At the next care window a second medic with Careful Nursing treats it. The data field can reject a second halving, but the rulebook's field list gives the table no record to check.

**Fix options:**

1. Add the `halved` flag to section 3.17 and OQ-55's field list.

## Grab target check

The crushing injury's current distribution is correct. With no held torso injury, it gives no Break Free penalty on 16.7% of rolls, a 1-die penalty on 41.7%, a 2-die penalty on 25.0%, and Down on 16.7%. My general injury run also reproduced the chapter's 15.3% lethal and 10.7% Down rates for a first Critical Injury at a rolled location: 15.271% and 10.668%.

For reachability, I modeled an ADR-0014 Rookie Brawler with Strength 4, Grip Breaker 1, one Gear Die, Stress 2, and Resolve 3. The model applied the torso result, Pushing, Stress Responses, and the rule that Down forbids Break Free. At a Chapter 5 difficulty of three successes, solo death was 76.788% when the countdown left one Break Free action and 60.059% when it left two. The target of about two in three lies between those legal cases, so Chapter 3 has not made it unreachable.

The nearby-comrade gap is also reachable. At Stress 2 and Resolve 3, a witness lost their next action or turn to the Fear Roll 49.981% of the time. Two nearby rescuers who each succeed on their rescue action 60% of the time produced a combined 51.016% rescue chance after that Fear loss. Applied to a two-in-three solo death rate, that leaves 32.656% death, close to one in three.

These figures are a reachability test, not Chapter 5 calibration. Chapter 5 still has to fix the Break Free difficulty, whether a failed dodge leaves one or two usable escape actions before devouring, the rescue action's success condition, and which nearby comrades witness the Grab. The final simulation must use those exact rules.

## Judgment on OQ-38 to OQ-55

| OQ | Judgment | Reason |
|---|---|---|
| OQ-38 note | Sound, dependency still open | The note accurately delays all promotions until the last end step and does not pretend to order several promotions. OQ-38's old ambiguity remains in closed Chapter 2, but Chapter 3 does not worsen it. It is not counted again as a Chapter 3 finding. |
| OQ-39 | Sound | The three harm kinds give every harm a closed route, and treating all Titan behavior harm as a Titan attack follows ADR-0005 without judgment. |
| OQ-40 | Sound | Revive is limited to getting a Down soldier above 0 Health, while daily recovery keeps ordinary damage relevant across a Leg. |
| OQ-41 | Sound with a table-state gap | The D6 weighting is rollable and produces the stated lethality. No-side tracking becomes unsound only when a permanent loss heals and location history disappears. Finding 3. |
| OQ-42 | Unsound in part | The tables, worsening bonus, caps, and first-injury instant-death guard all work. Removing permanent losses from held location history permits impossible repeat results. Finding 3. |
| OQ-43 | Sound | Turn, engagement, and day limits have complete start, expiry, slowing, and outside-Engagement rules. The quoted Death Roll odds are correct. |
| OQ-44 | Sound procedure, dependency conflict | Revive, treatment, retries, self-treatment, and care-window permissions are closed. The adjacent Careful Nursing rule widens a Chapter 2 Talent. Finding 2. |
| OQ-45 | Sound | The added Down-row condition is logged, preserves ADR-0005's separation from Health, and gives the Grab a usable lethality lever. |
| OQ-46 | Sound | Turn and action spending reuse Chapter 1's ordered turn rule. OQ-17 remains openly inherited rather than hidden. |
| OQ-47 | Sound | Every total is covered, repeated lasting rows escalate deterministically, and all ending triggers are explicit. The stated Stress 1, 3, and 5 odds are correct. |
| OQ-48 | Sound | Position, successes, outside-Engagement eligibility, Help, Covering, and retries are all fixed. |
| OQ-49 | Unsound in part | The trigger list and event limits are closed, but skipping a Down soldier's roll fails to update the history field. Finding 4. |
| OQ-50 | Sound | Every total is covered, each row uses defined effect types, and a Drive clearly cancels the whole result. The quoted turn-loss and Scar thresholds are correct. |
| OQ-51 | Unsound in part | The D66 table is complete and duplicate handling terminates before Retirement. Permanent anatomy and the fifth-Scar timing conflict remain. Findings 1 and 3. |
| OQ-52 | Sound | Who gains Grief, amount, timing, cap, and the lack of a Resolve floor are all explicit. The minimum possible Resolve is covered by both mind tables. |
| OQ-53 | Sound | Days are the ADR-0009 unit, lethal injuries cannot heal before stabilization, and the Expedition and Downtime procedures remain forward references. |
| OQ-54 | Unsound in part | The stated step order is sensible, but the Retirement rule can interrupt it during the care window. Finding 1. |
| OQ-55 | Sound mechanism, incomplete inventory | Keeping Chapter 3 fields in its own YAML avoids changing closed Chapter 2 data. The prose and OQ omit the `halved` field already present in that YAML. Finding 5. |

## Data, dependencies, scope, and terminology

All scoped YAML parsed. The Injury Location D6 covers every face once. Each location table has continuous open-ended coverage for every possible 2D6 plus worsening total, and every non-lethal cap id exists. Death Roll outcomes cover every success count. The Stress Response and Fear Roll tables cover arbitrarily low and high totals. The Scar D66 table covers all 36 legal results once. Every used effect type exists, and every penalty names an Action Catalog entry.

The rule prose and YAML agree on the harm routes, worsening, Down, time limits, care windows, healing, Stress Responses, Rally, Fear Rolls, Scars, Grief, and end-of-Engagement order except where the findings say otherwise. I found no misuse of a glossary `_Avoid_` term.

This workspace has no `.git` directory, so no version-control comparison can attribute earlier edits to Chapter 1, Chapter 2, `data/core/`, or `data/character/`. A direct content check found no Chapter 3 rule inserted into those Done chapters beyond their designed extension references. The Careful Nursing contradiction is finding 2.

No Downtime, Haven visit, Expedition, Operation Frame, or Shifter procedure is drafted here. Night camps and Downtime days are only timing hooks for healing; their procedures remain assigned to later rules. The Chapter 4 to 6 references leave owned values open without contradicting an ADR or glossary term.
