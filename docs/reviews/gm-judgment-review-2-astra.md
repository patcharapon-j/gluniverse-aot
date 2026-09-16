# GM judgment review, round 2, Astra

Critical: 0. Major: 1. Minor: 1. Total: 2 open findings.

Date: 2026-09-16. Round 1 disposition: all 27 findings resolved, including those settled by an explicit ruling. None is counted again below. One new interaction gap remains after 9-33, and one records hygiene issue remains.

Scope: Chapters 1 to 7, their YAML, both round 1 reviews, the round 1 fix plan, decision batch 9 through 9-35 and both 9-14 errata, CONTEXT.md, the ADRs, OQ-167 to OQ-178, and the owner's decisions. YAML governs over chapter prose. The owner's 9-35 answer governs damage at low Health. The packet, site, and parallel round 2 review were not reviewed. No project file other than this review was edited. `tools/sim/run.py` was not run.

## Round 1 findings

Locations below refer to the current files. Chapter shorthand `01` through `07` means the corresponding file under `docs/rules/`.

| Review | Finding | Status | Current evidence and disposition |
|---|---|---|---|
| Opus | C1, Reaction timing | Resolved | 9-25 is in `01:109`, section 1.9's Attack and Reaction, `05:506`, `07` section 7.4's Reactions, and `data/core/circumstances.yaml:60-66`. The step locks when the attacker's card comes up, including the whole Foe group's card. Later cancellation reuses the original dodge. |
| Opus | M1, repeated supply searches | Resolved | 9-29 is in `data/gear/squad-supply.yaml`, `spending`, and `04:610`. A named place yields to one rolled search, whatever its result; others Help and later searches yield no supply. |
| Opus | M2, Help and retry payment | Resolved | 9-28 is in `01:47,290`, both core YAML files, the nine `when_called` Catalog rows, and the glossary. Only time or position is charged, when Help is declared or the retry is taken, separately from failure stakes. No Stress, damage, or fall trigger is needed for that payment. |
| Opus | M3, extreme ruling falls | Resolved | 9-30 restricts a ruling's fall to low or high in the core menu, `data/gear/falls.yaml`, `03` section 3.1, and `04:322`. Extreme remains available only through other rules. |
| Opus | M4, damage at low Health | Resolved | Deliberately retained by the owner in 9-35. `01:43`, `03:71`, and `data/harm/health.yaml`, `by_ruling.stated_with`, expose current Health with the stakes. Ordinary Down and Critical Injury rules apply. OQ-177 records the answer and retune follow-up. |
| Opus | M5, invalid model entries | Resolved | 9-27 is in `01` section 1.9, `02:621-632`, `05` section 5.4, `07` section 7.4, and `action-catalog.yaml`, `in_a_fight`. Models must be eligible `action` entries; Reactions, rolls, fixed rolls, and options are excluded. Unrolled models stay unrolled. Taking cover is a move. |
| Opus | M6, combining lasting conditions | Resolved | 9-26 is in `01:101`, `circumstances.yaml`, and the Chapter 5 Rulings and dodge paragraphs. Conditions are weighed into one step, never added; the rain example identifies rolls using ODM Gear dice. |
| Opus | M7, unrestricted success rewards | Resolved | 9-31 is in `01:45`, `02` section 2.9, `04:37`, `dice-pool.yaml`, and ADR-0024 limit 17. Gear, healing, Stress relief, and campaign awards cannot be granted as called-roll success. |
| Opus | M8, passive roll classification | Resolved | 9-32 is in `01:48`, `CONTEXT.md:175-177`, and the passive-roll YAML row. It is not a called roll, has no stakes, and excludes every Bonus Dice source except Circumstances in one field. |
| Opus | m1, Leg roll exception | Resolved | `01:49` expressly preserves the Leg roll's Circumstances. |
| Opus | m2, hidden Next Behavior | Resolved | `01:46-48`, `dice-pool.yaml`, and ADR-0024 limit 14 distinguish the passive soldier roll from the hidden Next Behavior. |
| Opus | m3, missing ladder table | Resolved | The rendered ladder begins at `01:89`; the render check includes it. |
| Opus | m4, gear on attribute-alone rolls | Resolved | `01:74` and the YAML gear component say a gear item or other object can inform Circumstances but supplies no Gear Dice on an attribute-alone called roll. |
| Opus | m5, shared acts | Resolved | 9-34 item 1 is in `01:28` and `dice-pool.yaml`, `called_roll.together`: one shared outcome means one roller with Help; individually resolved acts have individual rolls. |
| Opus | m6, Titan Dice glossary | Resolved | `CONTEXT.md:309-311` expressly excludes Circumstances. |
| Opus | m7, Hard terminology | Resolved | 9-34 item 2 is in `CONTEXT.md:179-181` and `01` section 1.4a. Hard alone means the step; Hard Ride is written in full. |
| Opus | m8, Straggler timing | Resolved | 9-34 item 3 is in `hazards.yaml`, the rendered Straggler roll row, and `07:274`. Its step is fixed before the hazard roll and cannot price the row's own danger again. |
| Opus | m9, a directed Foe running alone | Resolved | Deliberately closed by 9-34 item 4. `foes.yaml`, `directed_by_ruling.limits`, and `07:600` require breaking or surrendering the group; individual flight is not an available directed turn. |
| Opus | m10, mixed Parley builds | Resolved | 9-34 item 5 and erratum 2 are reflected at `07:711`. All four percentages use Empathy 3, Stress 1, no Talent, and the stated helpers. Independent simulation below confirms the rounded figures. |
| Opus | m11, horror after staked failure | Resolved | 9-34 item 6 is in `fear-rolls.yaml`, `gm-horror.called`, and `03` section 3.12's Weight bullet. The GM trigger cannot be called for a staked outcome; independently met listed triggers still apply. |
| Opus | m12, framed Background Titans | Resolved | 9-34 item 7 is in `engagement-setup.yaml`, `gm_choices`, and `05:117`: zero to two Background Titans, each on 4, 6, or 8 segments. |
| Astra | C1, tracked-value kill bypass | Resolved | 9-27 removes the matching steps from fights in both the Catalog YAML and Chapters 1, 2, 5, and 7. An invented act is still improvised when its tracked value matches. Only a Nape strike taken as written kills. |
| Astra | C2, Expedition supply prohibitions | Resolved | `legs.yaml`, `expedition.gear_back`, and `07:95` admit capped searches. The Shot descriptions in `squad-supply.yaml` and `04` section 4.10 admit a staked unit loss. |
| Astra | M1, priced Help trigger | Resolved | Same 9-28 resolution as Opus M2. The rules no longer try to charge a helper through the roller's failed-roll Stress or damage routes. |
| Astra | M2, last-slot retreat schedule | Resolved | 9-33 is in `legs.yaml:111-115` and `07:161`. A repeat uses the next legal slot, or the next day's first at Steady, with a Night Camp at the fallback. New finding M1 below concerns that camp's location-dependent rules, not the now-defined schedule. |
| Astra | m1, exclusion markers | Resolved | `titan-format.yaml:63` has the structured marker. `downtime.yaml:139-141` uses the comment fallback expressly authorized by pure fix 7 because the renderer closes the roll-row keys. The infirmary exclusion remains explicit in Chapter 7. |
| Astra | m2, Cut and Pierce sources | Resolved | `07:546` includes damage named as called-roll stakes outside a Skirmish. |

## New findings by file

### `data/expedition/legs.yaml`

#### M1. Major: a fallback Night Camp still uses the abandoned Waypoint's terrain and retreat destination

Locations: `data/expedition/legs.yaml:111-115`, `day.waypoint_scene.retreat`; `data/expedition/legs.yaml:264-273`, `night_camp.retreat`; `data/expedition/hazards.yaml:184-194`, `night.modifiers`, `anchor_rating`, and `retreat`. Prose copies: `docs/rules/07-playtest-rules.md:161` and section 7.1, The Night Camp, step 4 at lines 229-230.

9-33 creates a Night Camp at the start of the day's last Leg after a Waypoint-scene retreat. The existing Night procedure assumes the camp is at that Leg's destination. Its Titan Engagement therefore uses the kind of the Waypoint the last Leg reached, and a night retreat falls back to the Waypoint that Leg started from. In the new case that destination is already the camp's present location. No exception selects the actual camp's terrain or states whether a second retreat moves farther back. OQ-175 and 9-33 settle the repeat's scheduling, not these references.

At the table: the third Leg runs from forest A to open plain B. A Waypoint-scene Titan Engagement at B ends in retreat. With no slot left, the Squad camps at A. An Abnormal at night then starts on Open terrain, although the camp is in the forest. If the Squad retreats again, the Night rule sends it to A, where it already is, and still queues A-to-B for morning. The GM must either run that literal result or repair two closed procedures by judgment. Anchor Rating materially changes ODM movement and the fight's options.

Fix options:

1. Record the actual camp Waypoint separately from the Leg queued for repetition. Use that Waypoint for the Night Engagement's Anchor Rating, and decide the fallback and next morning's route if the Squad retreats from that camp too. State explicitly whether the Night modifier keeps the last ridden Leg's Distance Band.
2. Add a specific fallback-camp exception to 9-33 and the Night procedure that names its Anchor Rating, second-retreat destination, and pending repeat. If retreating without changing Waypoint is intentional, say so explicitly and describe what the retreat represents.

### `docs/adr/0016-content-beyond-canon-follows-the-charter.md` and `docs/adr/0019-titan-attacks-are-rolled-and-the-reaction-cancels.md`

#### m1. Minor: two current rule statements still direct readers to ADR-0003

Locations: `docs/adr/0016-content-beyond-canon-follows-the-charter.md:12`, charter item 6; `docs/adr/0019-titan-attacks-are-rolled-and-the-reaction-cancels.md:5`, the current attack procedure's closing citation.

The charter cites "ADR-0003 items 9 and 12", and the attack ADR cites "ADR-0003, item 8". These are operative instructions and citations, rather than the historical mentions explaining why ADR-0003 was superseded. The batch 9 amendment preserves the charter's published-data requirement, and ADR-0019 remains the live attack ADR. Decision 9-18 requires replacing citations with ADR-0024's corresponding limits.

Use case: a later drafter follows the charter's reference for a new item's Catalog entry and reads the superseded no-ruling rule first. The supersession notice eventually corrects that reading, so this is citation hygiene rather than a new permission to override ADR-0024.

Fix: replace these references with ADR-0024 limits 9 and 12, and limit 8, respectively. Preserve historical references that explain the reversal.

## Interaction checks and validation

- Reaction timing is consistent across Chapters 1, 5, and 7. A new condition during a Foe group's card cannot change a later soldier's Reaction step against that card. Help, choice of eligible gear, and the reacting player's Push still happen after Severity is known. These choices do not reopen GM judgment on the step.
- The Catalog's `action`, `reaction`, `roll`, `fixed-roll`, and `option` kinds were checked against the model rule. A legal unrolled model stays unrolled. Context and state requirements still apply, and the explicitly permitted thrown object's Shoot uses its stated damage 1, Crush, and no Gear Dice. No model grants Requisition or Downtime effects merely because those values appear in the index.
- A Rookie Nape pool with Strength 4, Talent 1, Easy, and three helpers has 9 base dice, 1 Gear Die, and 1 Stress Die. The Bonus Dice cap is already full, so an additional Opening requires replacing a selected source. Unused Openings remain. A minus step is applied after the cap and never removes Talent eligibility, Gear Dice, or Stress Dice. Covering redirects the Push's Stress and removes its new Stress Die; it does not change Circumstances or allow the pool's Bonus Dice sources to be selected again.
- In a directed-Foe walkthrough, the GM states the reason before the Foe acts, rolls its unchanged weapon pool, then resolves the soldier's Reaction at the already fixed step. A successful Size Up holds the announced direction unless the specified later change occurs. A failed threat increases both Grit and Parley; a later soldier's Stand down uses the raised Parley value, and success ends the Skirmish through its written ending steps. Stand Down and Silver Tongue remain alternative dice Talents, never additive. Menace applies to a threat, which uses Strength while remaining Persuade.
- A Waypoint search can add only its named kind, capped by successes and exhausted for that place after its one roll. A return after retreat does not renew that search. A Depot issues Standard Issue again on arrival because 9-23 expressly requires it. That issue and a Requisition grant are written procedures, not called-roll rewards. Commendations, Research Points, and Faction Standing remain behind their own rules, including ADR-0024 limits 5 and 6.
- Passive Spot and Size Up retain their full permitted pool and Circumstances, but no other Bonus Dice source, Help, Cover, Push, failure stakes, or Stress Response. The hidden Next Behavior follows its own existing procedure. Neither exception permits another secret roll.
- The Expedition walkthrough reaches an ordinary Night Camp after a late Waypoint retreat, with one camp roll, ration, Night result, and day passing. M1 is the remaining location interaction. Arrival at the final gate ends the Expedition and begins the seven-day Downtime sequence. Care, infirmary rolls, Death Rolls, healing, Downtime Actions, and Requisition retain their written order.
- For 9-35, damage 1, 2, or 3 at current Health 1 causes Down and one immediate Critical Injury in every case. At Health 2 only damage 2 or 3 does; at Health 3 only damage 3 does; at Health 4, 5, or 6 none does. Positive damage at Health 0 gives another Critical Injury under the ordinary damage procedure, although a soldier already Down cannot be assigned a new called attribute roll. Zero fall damage gives none at any Health. A low or high ruling fall applies the same Health procedure to its rolled damage. Crossed-off boxes do not cause a recursive Critical Injury. No floor at 1 or exemption from the immediate Critical Injury has been introduced.

### Checks run

- All 67 YAML files load with PyYAML.
- `tools/render/render.py check` passes: 55 blocks in 6 chapters.
- `tools/probes/chapter-06/render.py check` passes.
- `tools.sim.rules.Rules()` constructs successfully; its YAML phrase guards pass. The Reaction, Foe, and Expedition wording was also compared with the chapter procedures above. Construction alone does not test the new fallback-camp interaction.
- Chapter 6's `family_check()` and horse-state selftest pass. The check's generated shares output was redirected to `/private/tmp/wof-gm-r2-avcl5ie0/chapter6-check`, outside the repository.
- Chapters 1 to 7, `data/`, CONTEXT.md, the renderer, simulator, and Chapter 6 probe code contain no `ADR-0003`, batch 9 `PROVISIONAL:` marker, or em dash. The only `difficulty` hits in that live rules scope are CONTEXT.md's three Avoid lines. The broader ADR citation check found m1. Historical decisions, research, and explicitly superseded text retain their historical vocabulary.
- The 9-25 to 9-35 fixes are present. The infirmary marker uses the fix plan's authorized comment fallback. OQ-177 records the owner's decision rather than leaving the rule awaiting an answer; the retune question remains legitimate. Existing OQ-167, OQ-168, OQ-169, and OQ-172 playtest concerns are not counted as new findings.

### Independent dice check

Python simulation ran outside the repository at `/private/tmp/wof-gm-r2-avcl5ie0/checks.py`, seed 92535, 400,000 trials per case. Empathy 3, Stress 1, no Talent or Gear Dice, Standard Circumstances; Push only when short and no Stress Die shows 1, keep successes, reroll eligible dice, add the new Stress Die. With Resolve 3 and no Grief, the reachable Stress Responses do not remove successes from these rolls.

| Parley case | Simulated success | Chapter 7's rounded figure |
|---|---:|---:|
| Need 3, alone | 11.595% | about 12% |
| Need 3, two helpers | 27.998% | 28% |
| Need 3, three helpers | 36.674% | 37% |
| Former need 5, two helpers | 2.006% | 2% |

These confirm Opus m10's resolution. No new odds or tuning finding is raised, and no full simulator family was run.

## Prioritised fix list

1. Resolve the fallback Night Camp's terrain and second-retreat route, M1, in the YAML and Chapter 7 together.
2. Replace the two operative ADR-0003 citations, m1.
