# Wings of Freedom — Phase 1 full review, round 1 (Astra)

Reviewed 2026-09-15. **2 Critical, 4 Major, 2 Minor; 8 new findings.** The packet needs corrections before a group can run it from the six chapters alone.

## Scope and method

Read Chapters 1–6 and the 59 YAML files in `data/` against `CONTEXT.md`, all amended ADRs, all batches of `DECISIONS-2026-09-14.md`, and `OPEN-QUESTIONS.md` through OQ-118. Traced creation, initiative, movement, Attention, harm, Grabs, retreat, and aftermath as table procedures. Used `tools/sim/`, its README-named `docs/reviews/simulator-report.md`, and the chapter probes; independently implemented the dice checks described below. No parallel full review or simulator round-2 review was read. No rule or data file was edited.

Only new, still-open findings are counted. OQ-112 and OQ-113 already record the four-striker advantage and the Abnormal's vulnerability to shouting Squadmates. OQ-114's seven Minors and OQ-115–118's simulator limitations are excluded. Decided compromises, including the intended dormant entries and the accepted Titan behavior abstractions, are not reopened.

## Findings

### C1 — Critical — Essential tables are not rendered into the rulebook

**Location:** Chapter 2, §§2.2–2.8 and 2.10; also Chapter 3's injury and mind tables, Chapter 4 §§4.6, 4.9–4.10, and Chapter 5 §§5.1–5.2. Authority: ADR-0012.

ADR-0012 requires the Markdown rulebook to render its tables from YAML. Much of Chapters 2–5 instead tells readers to find a row in a repository file. Chapter 3 even says it does not copy the rows. Chapter 6 demonstrates the intended arrangement with generated, readable stat blocks and behavior tables.

The values exist in the supplied YAML; this is a packet completeness and ADR conformance problem, not a claim that the author never defined them. A group using only the six chapters cannot complete creation or resolve ordinary injuries, Fear Rolls, or falls. Requiring players to navigate YAML also exposes them to internal and GM-only data rather than a usable rules reference.

**At the table:** A new player rolls Origin 11. Section 2.3.1 supplies neither the result nor its attributes, Talents, and Havens. Later, a soldier falls: §4.6 asks for the band's `adds` value and a `damage_table` row without printing either table. The GM must retrieve source files or invent the result.

**Missing packet material, grouped without counting each omission separately:**

- **Chapter 2:** the attribute reference; Origin D66 results and their choices/conditions; enlistment results and each Drive's actual trigger/target; all three Training Year event tables, performance-attribute pairs, curricula and Merit mapping; Class Rank ranges; the nine Specialties with key attributes and Talent lists; the complete Talent entries, including rule-Talent effects and limits; the optional Exam's row-defined choices and Merit rules; the Action Catalog entries; and the nine usable Squadmate templates. A description of a row's fields is not the row.
- **Chapter 3:** the Injury Location distribution; all four Critical Injury tables with limits, effects and healing times; Stress Response, Fear Roll and Scar result tables. Existing procedures explain how to read these tables but do not replace their result mappings.
- **Chapter 4:** fall-band modifiers and the damage table; Standard Issue quantities by Funding, particularly the default Funding 3 loadout; and Squad Supply stock by Funding. Some individual quantities appear in examples or notes, but there is no complete issue/stock reference to follow.
- **Chapter 5:** the interim setup's Anchor Rating, Size Class and Background Titan D6 rows, including clock lengths; and the complete movement graph by Anchor Rating, move kind and Fly requirements/failure destination. These must be accessible during each Engagement.
- **Chapters 1 and 6:** no additional table omission is counted here. Their procedures still depend on the missing Chapter 2–5 references. Chapter 6's four Titan blocks are present.

**Fix:** Generate player/GM tables or clearly located appendices from the existing YAML, as Chapter 6 already does. Include every live row needed by the procedures above; keep historical tuning results and hidden Abnormal material out of the player reference. This is Critical under the requested severity guide because the missing rendering directly contradicts ADR-0012.

### C2 — Critical — Action-before-move permits the lone cut that the retreat rule says it closes

**Location:** Chapter 5, §5.3 *Taking turns*, §5.6 *The Feint* design note, and §5.10 *The retreat*; `data/engagement/round.yaml` (`turn_order`), `background-titans.yaml` (`retreat`); ADR-0010's batch 3e amendment.

The amended ADR says that retreat's forced moves close the lone cut. Section 5.10 makes the claim concrete: even a soldier already at Blind Spot with a decoy holding Attention must step away, so the lone cut is closed. But §5.3 expressly permits the action before the move, and §5.10 says actions are unaffected. Neither rule makes departure precede a Nape strike.

**At the table:** With two Focus Titans alive, a soldier finishes a round at Blind Spot of A, Distant from B, with their decoy holding A's Attention. A Background clock fills and starts a retreat. Next round the soldier's card precedes A's. They take a fresh Nape strike against A first, then use their forced move toward Distant. The cut is legal without assistance; making the compulsory move afterward satisfies the retreat rule. The exact state the note says closes the cut still permits it.

This does not establish an infinite retreat loop or a miss of the fresh-cut percentage target. It establishes a direct, unlogged contradiction between the amended authority and the actual turn procedure.

**Fix options:**

1. If the last cut is intended, amend the ADR and the two explanatory passages to say retreat prevents remaining at Blind Spot, while allowing a strike before departure.
2. If the cut must be closed, state the required ordering/restriction explicitly, preserving the action-first rescue exception in retreat option 4.

### M1 — Major — Killing the last Titan removes the Positions needed for aftermath treatment

**Location:** Chapter 5, §5.7 *A Titan dies* and §5.11 ending procedures; Chapter 3, §3.5 *Aftermath rolls*; `data/engagement/titan-harm.yaml`, `positions.yaml` (`a_focus_titan_dies`, `comparison`), and `data/harm/treat-injury.yaml` (`aftermath.who_rolls`).

The Titan-death procedure ends Positions relative to the Titan before ending the Engagement. With the last Titan dead, no soldier retains a Position and there is no living Focus Titan for `positions.comparison` to select. Aftermath treatment nevertheless requires a treater who, when the Engagement ended, held the patient's Position or one step away. The general ending procedure's later cleanup does not restore the records already ended by Titan death.

**At the table:** A Down soldier has an untreated lethal `engagement` injury. A standing Medic shares their In Reach Position. Another soldier kills the only Titan. Following the death steps first removes both Positions; following the intended treatment-distance test against their last battlefield Positions allows the Medic's rescue roll. These give different answers immediately before the patient's Death Roll. The patient cannot resolve this by self-treatment while Down.

OQ-57 decides the aftermath opportunity and distance limit; it does not define a snapshot before the last Titan's Position records disappear.

**Fix:** Preserve the final battlefield Positions and the relevant comparison Titan specifically for aftermath eligibility, taking that snapshot before Titan-death cleanup. Alternatively, delay removal of those records until the aftermath steps finish, while making clear the dead Titan cannot act.

### M2 — Major — A fall has no defined reference Titan when two Positions give different heights

**Location:** Chapter 4, §4.6 *Height* and *After the fall*; Chapter 5, §5.2; `data/gear/falls.yaml` (`height`) and `data/engagement/positions.yaml` (`two_focus_titans`, `falls_land`).

Fall height uses “the Position” held when the soldier fell, then checks whether the Focus Titan it is relative to is Large. Soldiers can hold two different Positions. The close rule prevents On Body/Blind Spot relative to both Titans, but permits On Body relative to A and In Reach relative to B. No fall rule chooses which of these supplies its band. The comparison rule for rolls, acts, Help and Cover does not identify a fall's physical origin, and fall triggers include states such as a Jam or becoming Down.

**At the table:** At Wooded, a soldier is airborne On Body relative to Large A and In Reach relative to Medium B. Their Pushed dodge against B Jams their ODM Gear. Reading the fall relative to A gives extreme height; reading it relative to the attack's Titan B gives low height. On a raw D6 of 5, that is 4 damage versus 2. With 3 current Health, one reading gives a Critical Injury and Down, while the other leaves 1 Health. The landing rule also needs to know which Position the fall changes.

**Fix:** Give every fall one explicit reference-selection rule, covering both attack-triggered and self-triggered falls, and use the same reference for height and landing. If the intended rule is to use the occupied On Body/Blind Spot Position whenever one exists, state that and supply the fallback when neither Position is close.

### M3 — Major — Grab crush resolves Down before the target becomes Grabbed

**Location:** Chapter 5, §5.9 *A Grab lands*; Chapter 4, §§4.2 and 4.6; Chapter 3, §§3.2–3.3; `data/engagement/grab.yaml` (`grab_lands.steps`), `data/gear/falls.yaml` (`triggers`).

The ordered Grab steps apply the crushing Critical Injury before the `hold` step makes the target Grabbed. The target therefore remains airborne or mounted while that injury is resolved. Becoming Down in either state triggers a fall once the harm is resolved. The protection supplied by becoming Grabbed—ending airborne status and dismounting without a fall—only arrives in the next step. This conflicts with the same Grab text's description of the target becoming Down in the Titan's hand.

**At the table:** A fresh Health 4 soldier is airborne On Body of a Medium Titan when Grab lands. The torso roll is 10, giving the nonlethal Down result. Resolving the injury before `hold` now triggers a high fall. A raw fall roll of 5 does 3 damage, exhausting the three boxes left after the crush and adding another Critical Injury. Alternatively, treating the soldier as already in the hand prevents that fall. Both readings have explicit procedural support.

**Independent check:** With 200,000 fresh-victim trials, applying crush-before-hold produces a fall in **16.660%** and an additional Critical Injury from its damage in **5.5525%** of landed Grabs. Exact dice enumeration gives **1/6 = 16.6667%** and **1/18 = 5.5556%** respectively. These are conditional on this airborne On Body setup, not overall Grab death rates. The discrepancy is frequent enough to matter in the first playtest.

**Fix options:** Establish the held state before applying crush, retaining the dodge-refund step first; or explicitly defer/suppress the crush-triggered fall until the target has become Grabbed. Check carrying and forced dismount in the same ordering amendment.

### M4 — Major — Horsemanship has no live caller, defeating the creation guarantee

**Location:** Chapter 2, §2.3.3 *Choosing a Talent*, §§2.7–2.8 and 2.10; Chapter 4, §4.5; `data/character/talents.yaml` (`horsemanship`), `action-catalog.yaml` (`ride`), `origins.yaml`, `training-years.yaml`, and `squadmates.yaml`.

Horsemanship names only Ride. Ride is rolled only when a rule calls for it, but none of the six chapters calls for a Ride roll. Ordinary mounted movement is unrolled; a mounted dodge remains the dodge entry, and mounted Break Attention remains Break Attention. Ride is not included among the seven dormant entries.

Consequently, the promise that every Origin/event offers at least one Talent a current rule uses is false. This is not a complaint about intentionally optional dormant Talents; some rows provide no live alternative at all, and their fallback does not recognize the problem.

**At the table:** A new soldier rolls **51–53, Minor Noble House**. The choices are Horsemanship and Judge of Character, whose Size Up caller is explicitly dormant. Or they roll **44–46, Year 1: Fire in the stables**, choosing between Horsemanship and Keen Eyes, whose Spot caller is dormant. Either way the purported usable choice supplies no bonus to any Phase 1 roll. The Rider Squadmate likewise receives Horsemanship as its sole Talent but cannot use it.

**Fix options:** Mark Ride/Horsemanship dormant and repair these choices and the Rider template to preserve the creation guarantee; or add a specific Phase 1 procedure that calls for Ride. Merely describing mounted actions as riding does not make this Talent apply under §2.7.

### m1 — Minor — The Small Titan note says one success breaks an Intact Body Part

**Location:** Chapter 6, §6.2, design note beginning “A Small Titan stands 3 to 5 m”; Chapter 5, §5.7.

The note says every Body Part “breaks at one success (Toughness 1).” Toughness 1 advances the part one state per success: Intact → Wounded → Broken. A fresh part therefore needs two successes. A player following the note could ground the Small Titan with a one-success strike against an Intact leg.

**Fix:** Say that each success advances a part one state, and two successes break an Intact part. The Toughness value itself needs no change.

### m2 — Minor — Unquoted commas silently truncate several YAML strings

**Location:** Chapter 2, §§2.8–2.10; `data/character/action-catalog.yaml` (`tracked_values`) and `data/character/squadmates.yaml` (`rules_applicability`).

Several flow-map values contain unquoted commas. YAML accepts them as additional mapping keys rather than part of the string. For example, the `rule-named-value` name loads as only `change a clock`; `counter` and the remainder become null-valued keys. Its `changed_by` text is split too. The position-change row loses “not a Catalog entry” from its `changed_by` value. Squadmate applicability similarly loads `Health` as the rule name, with `Critical Injuries`, `Down`, and `and Death Rolls` as separate null-valued keys; other comma-bearing notes and names are affected.

**At the table:** A reference generated from the canonical `name`, `rule` or `note` fields drops parts of the intended rule, even though a YAML syntax check passes. This matters directly to the missing-table rendering in C1; the surrounding prose currently supplies much of the lost meaning.

**Fix:** Quote these comma-bearing values or use block scalars. Check expected mapping keys as well as successful parsing so silent scalar splitting is caught.

## Numerical and structural checks

Independent Python files and output are in `/private/tmp/wof-full-astra-20260915/`. They are outside the repository as requested. `independent.py` imports no project simulator code; its dice constants and procedures were transcribed from the rules. `structure.py` independently checks the behavior tables and the conditional Grab ordering case. `run_existing.py` exercises the live simulator and records hashes of its source snapshot.

| Target/check | Fresh result | Reading |
|---|---|---|
| Rookie fresh Nape cut; fight-start Stress 1 | **13.2045%** of 196,100 eligible cuts, from 200,000 trials | Within 8–14% |
| Levi-grade fresh Nape cut; fight-start Stress 2 | **47.3596%** of 199,455 eligible cuts, from 200,000 trials | Consistent with about 50% |
| Gas Rating 3, two dice each round | Median **8**, mean **9.2502**; 200,000 canisters | Meets median 8 |
| Gas Rating 3, three dice each round | Median **6**, mean **6.3329**; 200,000 canisters | Meets median 6 |
| Prepared baseline Squad versus standard Medium, live simulator | Median **round 3**; 41.7667% killed by round 2, 61.6917% by round 3; 12,000 fights | Target holds under this modeled policy |
| Landed Medium Grab after failed dodge, alone; live simulator | **70.170%** deaths; 20,000 trials | Consistent with about two in three |
| Same, one close comrade at Stress 2/Grief 0; live simulator | **33.305%** deaths; 20,000 trials | Consistent with about one in three |

The independent fresh-cut test follows the measurement setup: up to three Break Attention attempts, then a fresh Nape strike with no accumulated Openings or Help; Stress, lasting Stress Responses and ODM wear carry forward. The reported percentage is conditional on reaching the cut, not the chance of killing in an arbitrary complete fight. Seed: 9152026. The independent Grab-order check uses seed 9152027. The live simulator runs use seeds 9152026–9152030.

The Medium fight and Grab death rows are **simulator checks, not independently rebuilt complete fights**. No Critical or Major odds claim rests on them. In particular, M3 identifies a rule-order ambiguity rather than asserting that the accepted Grab death target has been independently disproved. The simulator's two-Titan, retreat, campaign-cadence and reference-build limitations remain the already-logged OQ-115–118.

All 59 YAML files parsed. Parsing alone does not catch m2. Chapter 6's `render.py check` passed: its rendered blocks match the source data. For each of the four Titans, independently enumerating six D6 results across **144 combinations** of available Body Parts and previous behavior found complete face coverage, valid fallback references and a maximum **50% kill-tier selection share**. This checks the behavior-table constraint, not complete fight balance.

No additional unlogged 845–850 fidelity violation or operative Shifter/Phase 2 mechanic was found. Explicit reservations for later rules are not treated as leaked mechanics. No new trivial or unwinnable Titan is claimed beyond the already-logged balance problems.

## Counts by chapter

Cross-chapter findings are counted once, under their primary location. C1 is assigned to Chapter 2, where the packet first blocks creation; its missing references in later chapters are included in that finding. M1 and M3 are assigned to Chapter 5, which supplies the conflicting event order.

| Primary chapter | Critical | Major | Minor | Total |
|---|---:|---:|---:|---:|
| 1 — Core Rules | 0 | 0 | 0 | 0 |
| 2 — Character Creation | 1 | 1 | 1 | 3 |
| 3 — Harm and Mind | 0 | 0 | 0 | 0 |
| 4 — Gear | 0 | 1 | 0 | 1 |
| 5 — Titan Engagement | 1 | 2 | 0 | 3 |
| 6 — Standard Titans | 0 | 0 | 1 | 1 |
| **Total** | **2** | **4** | **2** | **8** |
