# Chapters 1 to 5 decisions conformance review, round 3 (Codex)

Reviewed Chapters 1 to 5, their scoped YAML, the Chapter 5 and batch 3b/3c probes, the decision record through batch 3d, `CONTEXT.md`, ADR-0001 through ADR-0015, and all three round 2 reviews. I did not inspect Chapter 6, `data/titans/`, OQ-100 and above apart from the assigned OQ-111 follow-up, the parallel round 3 review, or any Chapter 6 round 3 review.

## Verdict

Batch 3c is mechanically complete. A lone soldier has a written Break Attention route wherever a Nape strike is legal, including grounded, Jammed, dry, horseless, and spent-consumable states. A Tempo 2 decoy hold preserves a pre-existing or newly set `hooked` flag through its non-final card, and only its final card evaluates the ladder and clears the flag. Batch 3d's Grab exception is implemented in the controlling procedure and `flag_duration`, but several nearby summaries and citations still describe the pre-3d state. That is the sole open finding.

| Chapter | Critical | Major | Minor |
|---|---:|---:|---:|
| Chapter 1 | 0 | 0 | 0 |
| Chapter 2 | 0 | 0 | 0 |
| Chapter 3 | 0 | 0 | 0 |
| Chapter 4 | 0 | 0 | 0 |
| Chapter 5 | 0 | 0 | 1 |
| **Total** | **0** | **0** | **1** |

## Required invariants

### Lone legal route

The rule now covers the full state space without a GM ruling:

| State in which the Nape strike is legal | Written Break Attention route | Written route back to the strike |
|---|---|---|
| Titan standing | The strike already requires working ODM gear. From Blind Spot, move to In Reach or On Body and Feint with ODM. Open terrain is not a counterexample because Blind Spot, and therefore the Nape strike, is unavailable there. | The decoy holds for the Titan's Tempo cards. Move back to Blind Spot and strike. Failed Feints may be retried. |
| Titan grounded, gear working | Use the same ODM Feint, a mounted sound horse, or the on-foot Feint. | Every close move is allowed on foot; grounded Open terrain adds On Body to Blind Spot. Return to Blind Spot and strike. |
| Titan grounded, gear Jammed or dry, no horse, all consumable decoys spent | Feint on foot from In Reach or On Body. It uses no gear item and has the same need as any Feint. | Move on foot to Blind Spot and strike. A Jam does not bar a grounded strike. Field Repair and a spare canister are also named recovery routes, but neither is needed for this grounded sequence. |

This is a legal route, not a promised success rate. The attempt, retry, movement, hold, and strike rules are all explicit.

### Struck-first through a Tempo 2 hold

The order is unambiguous. The Nape strike sets `hooked`; the first held card spends one Next Behavior but does not evaluate the ladder or clear flags; the last held card evaluates the ladder, reads `hooked` at the top rung, selects the striker, then clears the flag. The batch 3c flag probe also observes flags surviving non-final held cards under the committed rule.

## Re-simulation

I ran the scoped Python probes from `/tmp`, outside the repository, using their committed seeds and sample sizes.

| Check | Result |
|---|---|
| Gas endurance | Median **8** rounds for a fresh pair; median **6** after one canister |
| Medium kill timing, four-person baseline | Median **round 3**; killed by round 3 **62.6%**, by round 4 **73.2%**, no kill **5.1%** |
| Lone Rookie, fresh Nape cut, ND 4 | **10.0%** at Stress 0 and **13.1%** at fight-start Stress 1, within the required **8% to 14%** band |
| Levi-grade, ND 4 | **46.1%** at Stress 0 and **47.3%** at Stress 1, about 50% |
| Grab before kill | With one comrade close: **28.7%**, **33.4%**, and **39.1%** across the three specified cells, about 1 in 3; alone: **69.9%** with the failed-dodge rule, about 2 in 3 |
| Lone Medium usable strike | **77.0%**; no usable decoy **0.2%**; median usable strike round **4** |
| Medium screen, beside holder, batch 3c rule | Median **round 3**; by round 3 **67.1%**; by round 4 **78.2%**; Critical Injuries **0.46**; deaths **0.004**; Grabs **0.142**; cards resolved per round **0.627** |
| Medium screen with on-foot grounded Feint | Median **round 3**; by round 3 **67.8%**; by round 4 **78.3%**; Critical Injuries **0.45**; deaths **0.004**; Grabs **0.137**; cards resolved per round **0.628**; foot Feints **0.001** per fight |

The batch 3d committed-seed matrix to carry forward is Medium **77.0%** with **0.2%** no usable decoy, Large **76.1%**, Small **72.5%**, and Abnormal **52.0%**. The Medium row is in this review's scope and reproduced exactly. The other size rows belong to the excluded Chapter 6 and titan-data scope and are quoted, not independently reopened here.

All 52 scoped YAML files parse. The scoped YAML has no duplicate mapping keys, duplicate record IDs, or broken explicit file references.

## Round 2 findings

### `01-05-decisions-conformance-review-2.md`

| Prior finding | Status | Evidence |
|---|---|---|
| Major: Chapter 5 flags cleared before the hold's last card could read them | **Resolved** | Sections 5.5 and 5.6, `behavior-procedure.yaml`, and `attention.yaml` preserve flags on non-final held cards and evaluate only the last card. |
| Major: Chapter 5 had no universal grounded, dry/Jammed lone route | **Resolved** | The on-foot grounded Feint plus grounded close movement supplies the route; Field Repair and the spare canister are named. |
| Minor: Chapter 5 lone probe omitted the spare and Field Repair | **Resolved** | The lone probe models one spare canister and Field Repair. |
| Minor: Chapter 5 decision record said every held card re-evaluated | **Resolved** | Batch 3c says only the last held card evaluates; chapter, YAML, and probe agree. |
| Minor: Chapter 5 Feint YAML omitted gas and duplicated a value | **Resolved** | The Feint method rows distinguish ODM, horse, and grounded on-foot methods and their costs. |
| Minor: Chapter 5 tuning still carried the stale solo target | **Resolved** | The target is now the legal-route guarantee plus reference-table rates, not universal 8.2% closure. |
| Minor: Chapter 5 glossary reset wording and missing Feint | **Resolved** | `CONTEXT.md` rewords Break Attention and defines Feint. |
| Minor: Chapter 3 pointer was stale | **Resolved** | Section 3.2 points to the current Chapter 5 attention, Feint, and recovery rules. |
| Minor: Chapter 5 bookkeeping and figures were incomplete | **Resolved** | Section 5.13 and the probes include the revised hold, lone, repair, and screen rows. |

### `01-05-decisions-conformance-review-2-codex.md`

| Prior finding | Status | Evidence |
|---|---|---|
| Critical: Chapter 5 repeatable Feint did not preserve a lone route after a grounded Open-terrain Jam | **Resolved** | The on-foot Feint works against a grounded Titan without gear, and grounded Open terrain supplies the On Body to Blind Spot edge. |

### `01-05-decisions-conformance-review-2-fable.md`

| Prior finding | Status | Evidence |
|---|---|---|
| Minor: Chapter 5 and batch 3b overstated universal closure and omitted Field Repair | **Resolved** | The text promises a legal route rather than a universal rate, and names Field Repair and the spare-canister route. |

## Open finding

### Minor: Chapter 5 still carries pre-batch-3d summaries of the Grab flag exception

**Locations:** Chapter 5, introduction and sections 5.5 to 5.6 (`docs/rules/05-titan-engagement.md:58`, `:420`, `:429`); Chapter 5 YAML (`data/engagement/attention.yaml:9`, `:65`, `:174`); Chapter 2 action catalog (`data/character/action-catalog.yaml:161`).

**Problem:** The controlling Chapter 5 procedure and `flag_duration` correctly clear flags when a card comes up while the Titan holds a Grabbed soldier. However, section 5.6 still says ADR-0003 names no such card and OQ-111 records the gap. Batch 3d closed that gap and amended ADR-0003. The chapter introduction also says every cited entry was decided on 2026-09-14 and lists revisions only through batch 3c, while the Draw Attention paragraph and its two YAML summaries say the flag lasts only until an evaluating card. Those shorter statements omit the batch 3d Grab exception and still cite batch 3c only.

**Scenario:** A soldier uses Draw Attention while the Titan holds a Grabbed comrade. A reader following the Draw Attention paragraph or action-catalog summary preserves `loudest` because the next Grab-hold card does not evaluate the ladder. Section 5.5 and `flag_duration` instead clear it on that card. The controlling procedure supplies the answer, so this is a misleading local summary rather than an undefined play state.

**Suggested fixes:**

1. Remove the obsolete sentence saying ADR-0003 does not name the Grab card, and update the chapter introduction to include the 2026-09-15 batch 3d/OQ-111 follow-up.
2. In the Draw Attention prose and both YAML action summaries, say the flag lasts until the Titan's next ladder-evaluating card, or until a card comes up while it holds a Grabbed soldier.
3. Add OQ-111 and batch 3d to the affected YAML decision and ADR provenance.
