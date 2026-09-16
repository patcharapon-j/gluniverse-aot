# GM judgment review, round 1, Astra

Critical: 2. Major: 2. Minor: 2. Total: 6 open findings.

Reviewed against the owner's 2026-09-16 direction, batch 9 including 9-21 to 9-24 and the 9-14 erratum, ADR-0024, the amended records, and the YAML-first source order. The packet and site are excluded. Findings below count each underlying problem once, including its prose and YAML copies. Existing questions about lethality drift, roll proliferation, horror frequency, and Parley balance remain the logged playtest questions, not new findings.

## Findings by file

### `data/character/action-catalog.yaml`

#### C1. Critical: matching a tracked value bypasses the improvised-act limits

**Locations:** lines 1003 to 1005, 1008 to 1023, and 1034 to 1058, `uncatalogued_actions`; `docs/rules/02-character-creation.md`, section 2.9, lines 601 to 607 and 621.

The new model-entry procedure applies only to an action the preceding steps do not resolve. Those steps still say the description never limits the value the player names, and a matching action becomes the chosen entry for every purpose. Thus a player can resolve an invented act through `titan-kill` without ever reaching the GM's model choice or the prohibition on an improvised kill. This contradicts ADR-0024 limit 9 and batch 9-8. Keeping the matching steps as the default under 9-12 does not settle this overlap.

**At the table:** a soldier at Blind Spot, with working ODM Gear and a Blade Set, does not hold Attention and is not retreating. They describe dropping masonry onto the Titan and name `titan-kill`. The Nape-strike row qualifies under the written requirements. Step 3 makes the masonry drop a Nape strike, including its kill effect, whereas the improvised-act paragraph forbids that result. The ordinary Nape Depth and gear requirements do not close the bypass.

**Fix options:**

1. Determine whether the described act is an actual Catalog action before matching values. Route an invented act through the model-entry procedure even when its desired value has a match.
2. Make the model-entry limits explicitly govern every uncatalogued act in a fight, including matches at step 3. Reserve the kill effect for actually making the written Nape strike.

### `data/expedition/legs.yaml`

#### C2. Critical: the Expedition still forbids the supply recovery the GM may now award

**Locations:** lines 36 to 39, `expedition.gear_back`; `docs/rules/07-playtest-rules.md:95`, **Gas and gear**. Related stale restriction: `data/gear/squad-supply.yaml:35-37`, the Shot description, and `docs/rules/04-gear.md:609`, section 4.10's Shot bullet.

`gear_back` says Squad Supply comes back **only** through full Standard Issue and remains used up until a Depot or the next Expedition. Batch 9-5 expressly allows a successful called search to add supply, and `data/gear/squad-supply.yaml:43-48` implements it. The new Waypoint scene even points to that permission at `legs.yaml:96-99`. These are conflicting live YAML rules, not merely a chapter differing from its source. The Shot description likewise says no rule other than Reload spends Shot, although a failed called roll may now stake one unit of any kind.

**At the table:** after using the last medical supplies in a Titan Engagement, the Squad searches an abandoned surgery at a non-Depot Waypoint. Two successes permit up to two medical-supply units under the new rule, while `gear_back` forbids recovering them there. Applying the older restriction closes judgment that 9-5 and the 9-11 supply row explicitly open.

**Fix:** qualify the Expedition restriction with the capped called-search exception. Qualify Shot's exclusive spend sentence with the staked-unit exception. Keep canisters, Blade Sets, Standard Issue, and all unrelated restock rules as written.

#### M2. Major: a Waypoint retreat after the last daily Leg has no scheduling rule

**Locations:** lines 77 to 89 and 103 to 109, `day.steps`, `day.counted_legs`, and `day.waypoint_scene.retreat`; `docs/rules/07-playtest-rules.md:108-114,156-161`; decision 9-23 and OQ-175.

The scene may happen after the day's third, Hard Ride Leg. A retreat then requires riding that Leg again, counted toward the day. The day permits two Legs, or a third when Command orders it, and forbids night travel. Neither 9-23 nor its implementation says when to perform the repeat once those slots are exhausted, or which Pace it uses. OQ-175 settles the destination, the new rolls, and repeated Depot issue, but not this scheduling case.

**At the table:** the Squad completes its Hard Ride, fights a Titan in the resulting Waypoint scene, and retreats. Immediate repetition creates a fourth Leg. Waiting requires deciding where the Night Camp happens and moving the repeat to the next day, neither of which the new retreat clause states. This changes rations, the hazard total, and healing and Death Roll timing.

**Fix options:**

1. State that a repeat uses the next legal daily Leg slot. If none remains, camp at the fallback Waypoint and repeat as the next day's first Leg, with its ordinary Pace.
2. Decide an explicit late-retreat exception, including Pace, rations, and Night Camp timing, and record it beside 9-23. Do not leave those closed procedures to an unstated ruling.

### `data/core/bonus-dice-sources.yaml`

#### M1. Major: a priced Help has no rule for charging its cost

**Locations:** lines 41 to 43, `sources[help].spends_outside_titan_engagement`; `data/core/dice-pool.yaml:153-156`, `called_roll.help`; `docs/rules/01-core-rules.md:275`, section 1.8's called-roll Help bullet. Conflicting cost trigger: `data/core/stress-changes.yaml:48-54`.

Help may cost an item from the failure menu, but that menu and its implementing rows resolve costs only when the roller fails. The Stress row specifically charges the soldier who rolled and never a successful roll. A helper rolls nothing. The rules do not say whether the helper pays upon declaring Help, only if their die is selected under the cap, or only on the roller's failure. They also do not say how helper costs interact with the one-cost-per-failed-roll limit. Decision 9-12 grants the permission but does not supply this procedure.

**At the table:** the GM allows a comrade to Help brace a collapsing beam at a cost of 1 Stress. The bracing roll succeeds. Charging the helper has no matching Stress trigger; charging nobody makes the stated price ineffective. On failure, charging both the roller's staked damage and the helper's Stress needs an explicit exception to the one-cost limit.

**Fix options:**

1. Define a separate Help-cost procedure and matching triggers, naming the payer, timing, cap-selection refund, and relationship to the roller's stakes.
2. Narrow which menu costs can price Help until those triggers exist. Record the interpretation in the decisions and update all nine called-roll Catalog rows together.

### `data/engagement/titan-format.yaml` and `data/campaign/downtime.yaml`

#### m1. Minor: two excluded rolls lack the required structured marker

**Locations:** `data/engagement/titan-format.yaml:58-66`, `titan_dice`; `data/campaign/downtime.yaml:136-143`, `rolls[infirmary-roll]`; exclusion declaration in `data/core/circumstances.yaml`, `never`.

Titan Dice are excluded in prose, and the infirmary roll is correctly identified as non-attribute, but neither owns a `circumstances: never` field. Decision 9-2 item 5 and this round's exclusion check require that marker on each excluded roll's row or file. Death, performance, Trials, Foe dice, Gas, and fall rolls have it.

**Use case:** a data reader following the declared exclusion convention finds no explicit exclusion at the Titan Dice or infirmary-roll node and must interpret prose instead. This is a data-contract gap; the written rules already prohibit applying Circumstances to either roll.

**Fix:** add the two structured markers and include them in the exclusion audit.

### `docs/rules/07-playtest-rules.md`

#### m2. Minor: Cut and Pierce are still described as Skirmish-only

**Location:** line 545, section 7.4, **Damage**, third bullet.

The sentence says Cut and Pierce reach a soldier only in a Skirmish. A called roll may now stake Cut damage from an edge or Pierce damage from a point, including in a Waypoint scene, under `data/harm/health.yaml`, `harm_kinds[damage].by_ruling`, and Chapter 3 section 3.1.

**At the table:** a soldier at 1 current Health fails a climb whose stated cost is 2 Pierce damage from a broken iron railing. The resulting Pierce Critical Injury and its treatment rider apply outside a Skirmish. This sentence incorrectly excludes that source.

**Fix:** remove the Skirmish-only claim and retain the pointer to Chapter 3's riders.

## Verification and pool walkthroughs

- All 67 YAML files load. Exactly nine Catalog rows use `when_called`, with the intended IDs; six retain `when_a_rule_calls`.
- Main render check passes, 54 blocks in five chapters. Chapter 6's separate render check also passes.
- The simulator's `Rules` object constructs successfully, including its YAML phrase guards. No `tools/sim/run.py` run was made.
- Chapter 6's validation and horse-state selftest pass. The check's generated shares file was redirected to a temporary directory outside the repository.
- A structural comparison against HEAD found no changes to existing numeric or Boolean YAML leaves. New Circumstances and Parley fields were reviewed separately.
- Scoped scans found no live ADR-0003 citation, batch-9 `PROVISIONAL:` marker, or em dash in Chapters 1 to 7 and their YAML. `difficulty` appears in the glossary's Avoid lists, where it belongs. No finding is assigned to historical language in the decisions, ADRs, or research.

The requested pools, before any Push, follow the decided order:

| Case | Base dice | Gear Dice | Stress Dice | What stays fixed |
|---|---|---|---|---|
| Reference Rookie Nape strike, Easy, three eligible helpers | 4 Strength + 1 Talent + 4 Bonus Dice = 9. Easy and Help exactly reach the cap. | 1 | 1 | Nape Depth; adding an Opening would require choosing within the same cap. |
| Reference Veteran Nape strike, Desperate, no Bonus Dice | 5 Strength + 2 Talent - 3 = 4 | 2 | 2 | Desperate removes no Gear or Stress Dice. Further penalties stop at 1 base die. |
| Reference Rookie dodge with ODM Gear in rain, Hard, no Help | 3 Agility - 1 = 2 | 2 | 1 | Titan Dice are unchanged; dodge successes cancel normally and remain the same against later cards that round. |

A passive Spot at Easy adds one Circumstances Bonus Die, with no other Bonus source, Help, Cover, Push, or Stress Response. A negative step removes base dice after the cap and respects the same floor. No odds finding depends on a new simulation.

## Prioritised fixes

1. Close the tracked-value bypass of the improvised-act limits, C1.
2. Remove the conflicting supply restrictions, C2.
3. Decide priced Help's payment procedure and the late-day retreat schedule, M1 and M2.
4. Add the two exclusion markers and remove the stale Skirmish-only harm claim, m1 and m2.
