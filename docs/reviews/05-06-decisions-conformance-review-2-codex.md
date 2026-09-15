# Chapters 5 and 6 decision conformance review, round 2 (Codex)

Date: 2026-09-15

Scope: Chapters 5 and 6 after decision batch 4, including their YAML, current probes, Chapter 4 section 4.12, the Squad sheet fields, Chapter 2's Attention actions, every ADR, `CONTEXT.md`, and the two round-1 reviews. Older batch probes were treated as historical evidence, not as the current implementation. The parallel round-2 review was not read.

## Verdict

Batch 4 resolves the previous Critical and Major. The current Attention procedure has a deterministic, sheet-order-independent outcome at fight start, at end steps, in equal-distance ties, and when a prior holder rides to Distant. The adopted Sprinting Abnormal values also hold the stated bar in both committed Squad orders and in a fresh random-order run.

One new Major remains. The passive parked-rider probe does not cover a rider who repeatedly uses Draw Attention from Distant. That legal policy safely holds the Sprinting Abnormal above nearer soldiers and improves the Squad's pace and harm results. It makes active Distant luring a dominant strategy and contradicts the chapter's rider explanation.

| Chapter | Critical | Major | Minor |
|---|---:|---:|---:|
| Chapter 5 | 0 | 0 | 0 |
| Chapter 6 | 0 | 1 | 1 |
| **Total** | **0** | **1** | **1** |

## Findings

### Major 1: Chapter 6 permits a Distant rider to dominate the Sprinting Abnormal with Draw Attention

**Locations:** `docs/rules/06-standard-titans.md:307-327`, especially lines 310, 317, 322, and 327; `docs/rules/06-standard-titans.md:655-676`; `data/titans/index.yaml:44-70`.

**Problem:** The top rung of the Sprinting Abnormal's ladder is `loudest-or-brightest`. Chapter 6 says a loud soldier turns it first "wherever they are." Draw Attention is an unrolled action that grants that flag. The new Distant exclusion applies only to `current-holder`, so it does not stop a mounted soldier at Distant from becoming the loudest holder again every turn.

That holder is unusually safe. At Distant, Grab and Headlong Lunge do not meet their Position requirement; they fall back to Thrash and Pitch Headlong. Run Past adds Stress, Veer changes Position, and Trample is a nonlethal leg Critical Injury that a horse can help dodge. The rest of the Squad can attack while the rider spends actions refreshing the flag.

This also makes two Chapter 6 statements false as written. Line 322 says riders draw the Abnormal "only as the nearest," although a Distant rider can draw it through loudest. Line 327 says parking a rider buys nothing, but its cited probe tests only a rider who stays passive.

I ran the current fight model in a temporary directory for 120,000 fights per policy, using one mounted rider at Distant, one cutter, two strikers, and random Squad order. The only policy change was whether the rider used Draw Attention every available turn:

| Rider policy | Median kill round | By round 3 | No kill in 12 rounds | Critical Injuries/fight | Deaths/fight | Grabs/fight |
|---|---:|---:|---:|---:|---:|---:|
| Draw Attention from Distant | 3 | 71.0% | 3.29% | 0.782 +/- 0.003 | 0.0537 +/- 0.0008 | 0.210 |
| Remain passive at Distant | 3 | 59.6% | 16.11% | 1.374 +/- 0.006 | 0.1766 +/- 0.0014 | 0.444 |

The active lure improves kill pace, failure rate, Critical Injuries, deaths, and Grabs. It is not a marginal sampling result. It is also an obvious normal-play use of the action against the published ladder, so this is a significant balance problem rather than a missing sensitivity note. The fiction is strained too: the design note says the runner ignores outer riders, but a remote noise source can steer it continuously.

**Smallest fix:** Add a closed Abnormal-only Attention test whose loudest holder must not be at Distant, use it as this ladder's top rung, and add the active Distant-rider policy as a binding OQ-103 bar row in both sheet orders. Re-run every affected Abnormal row. Alternatives are to make its Distant fallbacks genuinely threaten the loud rider, or to retune the ladder and table against a binding active-lure row. Merely revising the rider prose would leave the dominant strategy intact.

### Minor 1: Chapter 6 overstates the Severity reduction

**Locations:** `docs/rules/DECISIONS-2026-09-14.md:1705-1707`; `docs/rules/OPEN-QUESTIONS.md:2405-2408`; compare `docs/rules/06-standard-titans.md:254-277`.

**Problem:** The decision record and decided OQ say "every harmful entry" is one below the standard Medium row's tier Severity. That is true of the kill entries: Grab and Headlong Lunge are Severity 2 against the Medium kill tier's Severity 3. It is also true of Pitch Headlong against the Medium control tier. It is not true of Trample, a harming control entry at Severity 2, equal to the Medium control tier's Severity 2.

The Chapter 6 table and YAML agree on the actual values, so play is defined. This is a claim-level contradiction in the decision summary, not a mechanical mismatch.

**Smallest fix:** Replace the blanket sentence with: "Both kill entries are one below the Medium kill tier; Pitch Headlong is one below the Medium control tier; Trample remains at the Medium control tier's Severity."

## Attention conformance

The live rule is substantively identical across ADR-0003, ADR-0010, `CONTEXT.md`, Chapter 2, Chapter 5, Chapter 6, `data/engagement/attention.yaml`, and `data/titans/index.yaml`: flags expire at the end of the Titan's next card that resolves a behavior; an inert card leaves them standing; the ladder evaluates highest rung first; equal candidates go to the current holder, then lowest card; if no card can decide, nothing holds Attention until the Titan's next card. The standard and Abnormal wording consistently makes `current-holder` false at Distant.

The requested walks produce one outcome each:

1. **Fight start:** Anna and Bram are both Distant, with no flags, holder, or cards. `nearest` ties them, `current-holder` cannot break it, and no card exists. Nothing holds Attention until the Titan's first card.
2. **End step:** A new Titan enters against the same uncarded, equal-distance pair. Its end-step evaluation reaches the same unbreakable tie. Nothing holds Attention until its next card.
3. **Equal-distance tie during a round:** Anna and Bram are tied at In Reach and Anna is the current holder. The holder tie-break selects Anna. If there were no holder, the lower distinct player card would select its owner.
4. **Parked mounted quarry:** Anna previously held the Sprinting Abnormal but is now mounted at Distant; Bram is In Reach, and neither has a higher flag. Anna fails `current-holder`, `nearest` selects Bram, and Bram holds Attention.

No step consults player choice, GM choice, or Squad row order. Chapter 4 section 4.12 and `data/gear/sheet-fields.yaml` prescribe column order only; they do not order soldiers. No live rule uses that row order. This resolves the former first-listed-quarry bug. The active-lure finding above is a separate higher-rung policy exploit, not a failure of the new tie-break.

## Abnormal bar and statistical checks

I reproduced `tools/probes/batch-4/abnormal_b4.py` with its committed seeds. The rejected **Grab-only** variant fails the Large-twin death ceiling with helpers in both orders:

- cutters first: 0.0219 against 0.0200, **+2.2 standard errors**;
- strikers first: 0.0218 against 0.0194, **+2.8 standard errors**.

That is a real miss under OQ-103's explicit per-row, per-seed 2-standard-error acceptance rule, not a result the text may dismiss as ordinary sampling. OQ-103 does cover it correctly: Chapter 6 labels Grab-only rejected and reports both failures. The adopted smallest fix, lowering Headlong Lunge to Severity 2 as well, is present in prose and YAML.

The adopted values hold every committed bar row in both Squad orders. A fresh random-order run at 60,000 fights per row also held the core supported rows:

| Row | Abnormal deaths | Large-twin deaths | Difference | Abnormal CI | Medium-twin CI |
|---|---:|---:|---:|---:|---:|
| Helpers | 0.0203 | 0.0217 | -1.15 SE | 0.798 | 0.639 |
| Screen | 0.0098 | 0.0096 | +0.31 SE | 0.519 | 0.423 |
| Screen plus pair | 0.0076 | 0.0086 | -1.56 SE | 0.457 | 0.384 |

The reference median is on a sampling boundary, not a rules mismatch. In ten independent random-order samples of 12,000 fights, eight had median round 2 and two had median round 3; the round-2 cumulative share ranged from 49.6% to 51.1%. The 120,000-fight bar rows give round 2 while the 12,000-fight displayed reference gives round 3. Chapter 6 explicitly reports that boundary.

The `current-holder` rung remains load-bearing. Removing it produces two supported rows at +2.4 standard errors on the committed probe. That is a rejected alternative, not a defect in the adopted rule. Likewise, replacing the Abnormal ladder with the standard ladder is no longer deadlier: its reported deaths are 0.065 against the adopted Abnormal's 0.079.

## Requested simulations

Fresh simulations used the current probes and Python code copied to a temporary directory outside the repository. The results agree with the drafter's report:

| Check | Fresh result | Reported target |
|---|---:|---:|
| Gas canister, efficient use | median **8** | 8 |
| Gas canister, Pushed use | median **6** | 6 |
| Standard Medium kill round | median **3** | 3 |
| Fresh Rookie Nape cut, Depth 4, fight-start Stress 1 | **13.16%** | 8% to 14% |
| Levi-grade Pushed cut, Depth 4, Stress 2 | **47.40%** | about 50% |
| Grab death, alone after failed dodge | **69.89%** | about 2 in 3 |
| Grab death, one comrade at Stress 2/Grief 0 | **33.58%** | about 1 in 3 |

Fresh 60,000-fight lone waiting rows were also consistent:

| Titan | Usable strike | Median strike round | Critical Injuries/fight | Dead | Down |
|---|---:|---:|---:|---:|---:|
| Medium | **76.8%** | 4 | 0.219 | 4.2% | 4.3% |
| Large | **76.1%** | 4 | 0.249 | 5.0% | 3.0% |
| Small | **72.4%** | 4 | 0.327 | 6.2% | 5.2% |
| Sprinting Abnormal | **52.4%** | 4 | 1.520 | 5.3% | 19.8% |

## Prose, YAML, and table audit

- All 23 scoped YAML files parse.
- The Chapter 6 renderer check reports every rendered block identical to YAML.
- Each Behavior Table covers d6 results 1 through 6 exactly once, follows the tier escalation, has Telegraphs, prevents immediate repeats, and always leaves a legal resolution after Broken-part disabling and fallback. The static table check reported zero problems for all four Titans.
- Maximum reachable kill shares are 0.50 for every table. Minimum non-Thrash legal entries after breakage are 3 Small, 2 Medium, 3 Large, and 1 Sprinting Abnormal. Position-valid entries at In Reach are 5/6, 5/6, 4/6, and 5/6 respectively.
- The standard Titans have one Grab and one potentially lethal result each. The Sprinting Abnormal has its decided Severity 2 Grab and Headlong Lunge in both prose and YAML.
- Regeneration, Nape Depth, flag lifetime, `current-holder`, nearest, holder-gone, Telegraphs, and no-repeat behavior agree between prose and data.
- No decided Batch 4 entry retains stale `PROVISIONAL` rule wording. `OPEN-QUESTIONS.md` retains historical `Type: PROVISIONAL` labels but gives those entries final `Status: Decided` and a decision.
- The Abnormal remains recognizably the 845 to 850 runner: Tempo 2, persistence on a nearby quarry, leg-dependent running attacks, no Shifter or Female Titan abilities, and full-stride Severity 2 kill entries. The Distant-noise exploit is the one fidelity exception that affects play and is counted above.

## Previous-round findings

### `05-06-decisions-conformance-review-1.md`

1. **Critical 1, first-listed quarry:** Resolved. An uncarded tie now leaves no holder, neither Squad order affects results, and the bar is measured in both orders.
2. **Major 2, mounted quarry parked at Distant:** Resolved as reported. A Distant prior holder fails `current-holder`, and the passive parked-rider row is costly. Major 1 above is a new active Draw Attention exploit.
3. **Minor 3, Down-soldier promise too broad:** Resolved. The promise is scoped to the standard ladder and the Abnormal exception is explicit.
4. **Minor 4, misleading nearest counter label:** Resolved. The tuning label and note now state what is counted.
5. **Minor 5, glossary omitted "end of":** Resolved. `CONTEXT.md` gives the same end-of-card expiry as the rule.
6. **Minor 6, stale OQ-111/OQ-81 record:** Resolved. The revised decision lines carry the final flag lifetime.
7. **Minor 7, holder Grabbed by another Focus Titan:** Resolved. Holder-gone covers it in prose, data, and the Abnormal explanation.

### `05-06-decisions-conformance-review-1-codex.md`

1. **Chapter 5 Minor, batch-3b probe advertised as current:** Resolved. Its module description marks it as a historical snapshot and points to the live imports.
2. **Chapter 6 Minor, batch-3b cross-table probe advertised as current:** Resolved. Its module description does the same.

## Final counts

Critical: **0**  
Major: **1**  
Minor: **1**
