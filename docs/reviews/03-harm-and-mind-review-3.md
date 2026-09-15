# Chapter 3, Harm and Mind: review round 3

Reviewed:

- `docs/rules/03-harm-and-mind.md`.
- Every file in `data/harm/` and `data/mind/`.
- OQ-39 to OQ-57 in `docs/rules/OPEN-QUESTIONS.md`, and the Chapter 3 notes under OQ-38.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015.
- Chapter 1 (`docs/rules/01-core-rules.md`, `data/core/`, OQ-01 to OQ-18).
- Chapter 2 (`docs/rules/02-character-creation.md`, `data/character/`, OQ-19 to OQ-38).
- Both round 2 reviews: `03-harm-and-mind-review-2.md` and `03-harm-and-mind-review-2-codex.md`.

I did not read the parallel round 3 Codex review.

Odds come from Python scripts in the scratchpad, which are not committed:

- Critical Injury and Death Roll odds are exact.
- Treat Injury odds use 400k rolls per case.
- The Grab model uses 40k trials per headline cell, and 20k to 30k per sweep cell.

The appendix gives the models. The Grab model reproduces round 2's figures to within half a point.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

**No Critical findings.**

- No rule rests on GM discretion. The new aftermath rolls use Chapter 2's roll-off for their order.
- No ADR or glossary departure is left unlogged.
- No `_Avoid_` term appears.
- No Phase 2 procedure is drafted.
- Nothing in Chapter 3 changes a Chapter 1 or Chapter 2 rule.
- ADR-0014's Grab target stays reachable. A lone Rookie dies 60.7% of the time, and two comrades with one rescue action each give 33.9%.

Of round 2's six Majors, four are resolved, one is partly resolved, and one is still open but logged (OQ-38).

**Three Majors are open.** Two were introduced by the round 2 fixes:

1. **Aftermath rolls stack.** Every soldier within one Position step rolls on the same patient. Three untrained comrades leave an untreated `engagement` row 3.8% fatal. That is close to the level review round 1 rejected as nearly harmless, and treating these rows during the fight is now worth much less.
2. **Section 3.7 points Chapter 5 at the wrong regime for OQ-50's tolerance band.** It says 1 in 3 needs about one rescue action per comrade. In that regime the band's worst cell reaches 51% to 54% whenever the base cell is near 1 in 3. A regime section 3.7 rules out, with two rescue actions and a harder strike, holds the band.
3. **Several contested promotions** (Codex round 2, carried). OQ-38 is still an Unresolved Major.

Four Minors follow.

## Round 2 Majors: status

| Round 2 finding | Status | Evidence |
|---|---|---|
| Opus 1: end-of-fight Death Rolls rewarded stalling | Partly resolved | Aftermath rolls (OQ-57 (d)) cut one round's value to a dying comrade with a one-step treater from 38 to 51 points down to 6 to 15. A treater two steps away still gains about 35 points from one round of delay (finding 4). The fix creates finding 1. |
| Opus 2: section 3.7 measured Grab levers in the wrong regime | Resolved, with a new problem | Section 3.7 now uses H = 1 or 2, one or two rescue actions, and the witness Stress and Grief spread. OQ-50 adds a tolerance band, and the old "5 successes" sentence is gone. My model reproduces every figure. The claim that 1 in 3 needs one rescue action conflicts with the new band (finding 2). |
| Opus 3: Down that ends before the soldier's turn had two readings | Resolved | `becoming_down_mid_round` takes only the action of a turn already begun or ended. `after_ending` gives a later turn its move and action unless they are already spent. OQ-45 (l) records the change. A wording gap remains (finding 5). |
| Codex 1: step 9 cannot finish two contested promotions | Not resolved, logged | OQ-38 stays an Unresolved Major, and Chapter 2 is closed. See finding 3. |
| Codex 2: ending Down restored a spent future turn | Resolved | `after_ending` now opens with "Ending Down restores nothing already spent", and section 3.3 matches. |
| Codex 3: Survivor's Guilt had no order against the death's Fear Roll | Resolved | `applies_after` on the row, section 3.13's paragraph, and OQ-51 (j) put the Stress after that Fear Roll, or at the death if there is no Fear Roll. |

Round 2 Minors:

- **Resolved:** Opus 4 to 8, and Codex 4 and 5.
- **Logged and still open:** Codex 6 (Pay It Forward, OQ-49) and Codex 7 (the glossary's "worse result", OQ-42). They are not raised again here.

## Checks that passed

- **Every table is complete and rollable:**
  - The Injury Location D6 covers every face once, with open ends.
  - All four Critical Injury tables run from an open first row to an open last row with no gaps or overlaps.
  - The Stress Response and Fear Roll tables cover every total, and Death Roll outcomes cover every success count.
  - The Scar D66 table covers all 36 results.
  - Every `non_lethal_cap` row exists and is neither lethal nor instant death.
  - Every `repeat_row` exists and has no permanent effects.
- **Every reference resolves** (script):
  - Every Catalog entry a penalty names.
  - Every effect type a row uses.
  - Every OQ id cited in the chapter and its YAML, including OQ-57.
- **Every quoted figure reproduces:**
  - First Critical Injury at a rolled Injury Location: 15.3% lethal and 10.6% Down, split 14.4 / 0.9 between `engagement` and `turn`.
  - Untreated `engagement` rows kill 8.5% at Strength 3 and 7.1% at Strength 4.
  - Torso and head: 8.3 / 27.8 / 50.0%, 8.3% instant death, 41.7% Down, 63.9% lethal.
  - The crushing Critical Injury: 16.7 / 41.7 / 72.2% Down against 11.1 / 30.6 / 47.2%, and the Break Free spread 16.7 / 41.7 / 25.0 / 16.7%.
  - Death Rolls: 42.1 / 51.8 / 59.8% and 7.4 / 13.2 / 19.6%, and 42.1% and 15.1% for the three-turn case.
  - OQ-47's Stress Response claims, and OQ-50's 2/6, 3/6, and 4/6 action loss.
  - Treat Injury at Stress 1 with one Push: 66.2% untrained, 61.7% self, and 88.2% for a Rookie Medic.
- **The Grab model reproduces round 2** (round 2 in brackets):
  - Alone: 60.7% (60.6), and 53.8% (53.9) with Crushed Ribs in place of Down.
  - Two comrades, one action, H = 2: 33.9% / 7.4% (33.5 / 7.3). At H = 1: 19.8% / 0.8% (19.8 / 0.9).
  - Two comrades, two actions: 2.7% / 0.4% (2.7 / 0.3).
- **No glossary `_Avoid_` term** appears. The only grep hit is the id `second-focus-titan`.
- **Chapters 1 and 2.**
  - No Chapter 3 row is added to `data/core/` or `data/character/`.
  - Aftermath rolls follow Chapter 1's Push and its rule that a roll outside a Titan Engagement with no Help has no Cover. Sure Hands and Careful Nursing apply as their closed text says.
  - Promotion keeps Chapter 3's fields under Chapter 2's "keeps everything it has".
- **Phase 2 content is only forward-referenced.**
- **The worked example** now gives Oskar's Wits and kit, and the aftermath and care-window pools add up. Finding 6 covers one misleading choice.

## Findings

### 1. Major. Aftermath rolls stack across every soldier within one step, so `engagement` rows are again nearly harmless when a fight ends in a cluster

**Location:**

- Section 3.5, *Aftermath rolls* ("**Who rolls:** every living soldier who is not Down ... **Limits:** each soldier makes at most one aftermath roll").
- Section 3.16, step 5.
- `treat-injury.yaml` (`aftermath_rolls.who_rolls`, `limit`).
- OQ-57, *Why* ("One attempt leaves ...", and "`engagement` rows then kill about 1.0% with a Rookie Medic within reach and 2.8% with an untrained comrade").
- The OQ-57 box in section 3.5.
- OQ-54, *What (b) does*.
- OQ-44, *Revised after round 1* (1.8% judged nearly harmless).

**Problem:** The limit is one roll per soldier, not one per patient. Every soldier within one step of a dying comrade rolls on them in turn, and each roll can be Pushed. The rolls come after step 2's Stress relief, so the rollers usually have Stress 0.

Death from an untreated Opened Artery at Strength 3, by the number of soldiers who make aftermath rolls:

| Rollers within one step | Wits 2, no kit | Wits 2, kit 1 | Rookie Medic (Wits 4, Field Medicine 1, kit 1) |
|---|---|---|---|
| 0 | 57.9% | 57.9% | 57.9% |
| 1 | 23.2% | 19.4% | 6.5% |
| 2 | 9.3% | 6.5% | 0.7% (2.6% with one untrained comrade) |
| 3 | 3.8% | 2.2% | 0.1% |

Across first Critical Injuries at a rolled Injury Location, untrained rollers leave the `engagement` rows killing 8.5%, 3.4%, 1.4%, and 0.55% of the time for 0 to 3 rollers.

Consequences:

- **Round 1's problem comes back.** Review round 1 rejected a care window before the Death Rolls because five soldiers at Wits 2 left an Opened Artery 1.8% fatal (OQ-44, OQ-54). Three untrained soldiers within one step now reach 3.8%. They need no Help, spend no action, and face no Titan card.
- **Treatment during the fight is worth much less.** OQ-54 (b) was taken so that in-fight treatment prevents the end-of-fight Death Roll. With two untrained comrades within one step, an untrained comrade who spends their action to treat a non-Down `engagement` row cuts death only from 9.3% to 3.2%, and that action could have gone to the Titan. The row is serious only for a soldier with no comrade near them when the fight ends.
- **The chapter's figures assume one roller.** OQ-57's 1.0% and 2.8%, and the lethality reasoning behind OQ-54 and OQ-42's simulator case, count one attempt. A Squad of six, ADR-0014's default, often ends a fight with two or more soldiers near the wounded one.

**Scenario:**

1. Round 4: a swat gives Private Hale an Opened Artery (`engagement` limit, not Down). Hale is In Reach.
2. Mila is at Hale's Position with her action. Ines and Oskar are one step away. None has a medical kit.
3. The table reasons that if Mila treats now, Hale still dies 3.2% of the time, and if Mila strikes instead, three free aftermath rolls leave him 3.8%. Mila strikes.
4. Kaya kills the Titan. The three aftermath rolls save Hale 96% of the time, and nobody spent an action on him.

**Fix options:**

1. **One aftermath roll per patient.** The players choose one soldier within one step to roll it, or the patient rolls on themselves. The figures OQ-57 quotes then hold. A delay gains more for a patient with several comrades close (finding 4), so re-run OQ-57's delay case.
2. **One roll per soldier, but only from the patient's own Position, plus the patient on themselves** (OQ-57 (c) with self-treatment). Fewer rollers qualify, and a treater one step away gains from a delay again.
3. **Keep (d) and log the stacking.** Rewrite OQ-57's lethality as a table by number of rollers, and do the same for the simulator cases in OQ-54 and OQ-42. State that `engagement` rows are near harmless for a clustered Squad, and that ADR-0014's PC death target then leans almost entirely on Grabs, `turn` rows, and isolated soldiers.

### 2. Major. Section 3.7 points Chapter 5 at the one regime where OQ-50's tolerance band cannot hold

**Location:**

- Section 3.7, *What these parts can and cannot do*: "The target is reachable only if Chapter 5's lift and reach rules leave each comrade about one rescue action", and "Chapter 5 must hold the target across that spread (OQ-50)".
- OQ-50, *Simulator case*, *Tolerance for ADR-0014's "about 1 in 3"*.
- OQ-42, *Review round 2 Grab models*.

**Problem:** OQ-50's band asks for two things:

- The comrades-close rate is near 1 in 3 for Rookie witnesses at Stress 2 with no Grief.
- It stays below 50% in all six cells: witness Stress 1 to 3, with Grief 0 and 1.

The one-action regime cannot meet both. At Resolve 2 and Stress 3, a witness loses their only rescue action 5 times in 6, against 3 in 6 at the base cell, so the rate climbs back toward the alone rate of 60.7%.

I swept that regime: 1 to 4 comrades, H = 1 or 2, and a strike penalty of 0 to 4 dice, standing in for Chapter 5's reach rules:

| One rescue action per comrade | Stress 2, no Grief | Worst cell (Stress 3, one Grief) |
|---|---|---|
| 1 comrade, H = 1, no penalty | 34.4% | 53.4% |
| 2 comrades, H = 2, no penalty | 33.8% | 52.1% |
| 2 comrades, H = 2, 1-die penalty | 36.4% | 53.4% |
| 3 comrades, H = 2, 3-die penalty | 32.9% | 52.2% |
| Best case that holds the band: 3 comrades, H = 2, 1-die penalty | 25.9% | 49.8% |

Every one-action case whose base cell lands between 29% and 40% puts the worst cell between 51% and 54%. The cases that stay under 50% have a base cell of 26% to 28%.

The regime section 3.7 rules out holds the band. With one comrade who gets two rescue actions, H = 2, and a strike at a 3-die penalty, the six cells run from 30.4% to 40.2%, with the base cell at 32.7%. So "reachable only if ... about one rescue action" is not true. Chapter 5 could also reach 1 in 3 by keeping the hand in reach and making the strike harder, and only that regime meets the band this chapter sets.

**Scenario:**

1. A Chapter 5 drafter follows section 3.7. The lift takes the hand out of reach, so each comrade gets one rescue action, and H = 2.
2. Two Rookie comrades at Stress 2 give 33.8%, and the drafter is satisfied.
3. The simulator's worst cell gives 52.1%, which fails OQ-50.
4. Every change that brings that cell under 50% drops the base cell to about 26%. Section 3.7 never mentions the two-action, harder-strike alternative.

**Fix options:**

1. **Rewrite the bullet with both regimes.** One rescue action per comrade reaches 1 in 3 but breaks the band. Two rescue actions with a strike penalty, or with fewer comrades in reach, reach 1 in 3 and hold the band. Record the sweep in OQ-42.
2. **Take OQ-50's recorded lever now**, and make Hesitate a 1-die next-roll penalty instead of a spent action. In my model, two comrades with one rescue action, H = 2, and a 2-die strike penalty then give 32.7% in the base cell and 48.1% in the worst cell, inside the band. With no penalty they give 25.8% and 44.8%.
3. **Loosen the band** to what the rows allow, for example below 55% in every cell, and record why.

### 3. Major (carried from Codex round 2, logged). Step 9 still cannot finish two contested promotions

**Location:** Section 3.4 (*Dying*, "OQ-38 still governs several promotions at once"); section 3.16, step 9; `engagement-end.yaml` (`retirement-and-promotion`); Chapter 2, section 2.10 and `squadmates.yaml` (`promotion.contested`); OQ-38.

**Problem:** Chapter 3 batches every death and Retirement from a fight into step 9. Chapter 2's contest settles one Squadmate and says nothing about the player who loses. OQ-38 records this as an Unresolved Major, and prefers option (c) for Chapter 2's next revision.

It is not Critical because it is logged and Chapter 2 is closed. It is still open, and it still leaves step 9 with no next step for the losing player. Round 2 also noted that outside a Titan Engagement, Chapter 2 promotes "immediately", while Retirement waits for the end of the procedure.

**Scenario:** Codex's round 2 scenario still applies. Mina and Oskar die in one fight, two Squadmates survive, and both players choose Mila. Mina wins the D6. No rule says what Oskar's player does next.

**Fix options:**

1. Adopt OQ-38 (c) in Chapter 2's next revision, with a matching wait for promotions that fall due while a day passes.
2. Until then, keep OQ-38 at the top of Chapter 2's reopening list, ahead of Chapter 5's Grab, which adds more deaths in the same fight.

### 4. Minor. The OQ-57 box says a Squad "gains little" by delaying, but a one-round delay still buys a lot when the treater is two steps away

**Location:** The OQ-57 box in section 3.5 ("so a Squad gains little by delaying a Nape kill or a retreat"); OQ-57, *What a delay bought*.

**Problem:** One more round gives an in-fight attempt at Stress 1 and still leaves the aftermath roll at the end. For an untreated `engagement` row at Strength 3:

| Nearest treater | End the fight now | Delay one round |
|---|---|---|
| Untrained, one step away | 23.2% | 7.9% |
| Rookie Medic, one step away | 6.5% | 0.8% |
| Untrained, two steps away | 57.9% (no aftermath roll) | 23.2% (one move makes the aftermath roll possible) |

OQ-57's *Why* lists what a delay buys, but the box's "gains little" hides the two-step case. That case keeps most of round 2's incentive, and it is common when the patient is Distant and the striker is at Blind Spot.

**Fix options:**

1. Replace "gains little" in the box with the three rows above.
2. Name the two-step case in OQ-57's simulator case ("how often a Squad still gains by delaying").

### 5. Minor. A turn that came up while the soldier was Down "has no action", but only the rule for becoming Down says the lost action counts as spent

**Location:**

- Section 3.3, *Down and this round's turns*, bullets 1 and 3.
- `down.yaml`: `becoming_down_mid_round` ("That action counts as spent for every rule that asks") and `ending.after_ending` ("has no action").
- Chapter 1, section 1.8 ("They have not spent their action this round"); OQ-16; OQ-17; OQ-46.

**Problem:** The bullet for becoming Down closes the question for Help and Reactions. The bullet for a turn that comes up while Down does not. That turn's action was never spent. It simply did not exist. Once Down ends later that round, Chapter 1's Help test reads "have not spent their action". This is the shape of OQ-17, and OQ-46 cites OQ-17 for results, but OQ-45 and `after_ending` do not.

**Scenario:**

1. Kaya is Down when her turn comes up. She takes her move and has no action.
2. After her turn, Mila treats her, and Down ends.
3. Later that round, Ines makes a Nape strike one step from Kaya, and Kaya declares Help.
4. One reading allows it, because Kaya's action was never spent. The other forbids it, because the turn "has no action". A later dodge that round has the same two readings for which turn it spends.

**Fix options:**

1. Add to `after_ending` and section 3.3: "That turn's action counts as spent for every rule that asks, as for a soldier who becomes Down."
2. Add a sentence to OQ-45 that this case follows OQ-17, as OQ-46 says for results.

### 6. Minor. The worked example's care-window Help adds nothing

**Location:** *Example: a bad round*, the care-window bullet.

**Problem:** Oskar treats himself with Wits 2 and the 2-die self penalty, which the floor holds at 1 base die. Hale's Help makes it 3 − 2 = 1 base die, the same pool. Hale gives up his only roll in the window for no gain, and the example does not say so. A reader learns that Help offsets the self-treatment penalty, which it does not at Wits 2.

**Fix options:**

1. Have Hale roll Treat Injury on Oskar himself, with no self penalty.
2. Keep the Help and add one sentence: the penalty floor means Help gains nothing here.

### 7. Minor. Small prose, YAML, and figure mismatches

**Locations and problems:**

- **Section 3.12, *Triggers*.** "For the others it is every soldier who holds a Position in that Titan Engagement." But `first-titan-engagement.who_rolls` is "that soldier", the one facing a Titan for the first time. Read alone, the prose has the whole Squad roll when one soldier faces their first Titan.
- **`engagement-end.yaml`, `care-window` step.** It says a lethal Critical Injury "stabilized here gives its Scar". Section 3.16, step 7 says "here or at step 5". `scars.yaml`'s trigger already covers any Treat Injury success, so no rule is missing, but the YAML step is the source of truth (ADR-0012).
- **OQ-57, *Lethality*.** The one-untrained-comrade figure is 8.52% × 33.8% = 2.88%, which rounds to 2.9%, not 2.8%. Round 2's Opus review gave the same rounding.

**Fix options:**

1. Change the section 3.12 sentence to "For `first-titan-engagement` it is that soldier, and for the other two it is every soldier who holds a Position."
2. Add "or at the aftermath-rolls step" to the YAML `care-window` step.
3. Change 2.8% to 2.9% in OQ-57, or replace it with finding 1's table.

## Provisional decisions OQ-39 to OQ-57

| OQ | Judgment |
|---|---|
| OQ-38 note | Accurate. It records the step 9 batch and the timing gap outside a Titan Engagement. It is still an Unresolved Major (finding 3). |
| OQ-39 | Sound. Chain harm is now closed. |
| OQ-40 | Sound. |
| OQ-41 | Sound. |
| OQ-42 | Sound rows and figures. The round 2 Grab summary is correct, but it omits the two-action regime that holds OQ-50's band (finding 2). The glossary note is logged. |
| OQ-43 | Sound. Every figure reproduces. |
| OQ-44 | Sound. One window per event, event-only patients, and Expedition-bound scopes close round 2's gaps. |
| OQ-45 | Sound. (l) gives one reading. A wording gap remains for a turn that came up while Down (finding 5). |
| OQ-46 | Sound. |
| OQ-47 | Sound. |
| OQ-48 | Sound. |
| OQ-49 | Sound. The Pay It Forward gap is logged. |
| OQ-50 | The rows are sound. The tolerance band cannot hold in the one-action regime section 3.7 prescribes, and the recorded Hesitate lever brings it within reach (finding 2). |
| OQ-51 | Sound. Survivor's Guilt order and the Retirement timing branches are closed. |
| OQ-52 | Sound. The cap now covers a day passing and an event outside a Titan Engagement. |
| OQ-53 | Sound. |
| OQ-54 | The order is sound. (i) carries finding 1: aftermath rolls stack, which weakens (b)'s reason for putting the Death Rolls before care. |
| OQ-55 | Sound. `sheet-fields.yaml` (`promotion`) names the kept fields under Chapter 2's "keeps everything it has". |
| OQ-56 | Sound. Help, Covering, and aftermath rolls are now covered. |
| OQ-57 | Partly sound. It closes most of the stalling incentive for a treater one step away, but one roll per soldier rather than per patient makes clustered fights nearly harmless (finding 1). The box overstates how little a delay buys (finding 4). |

## Appendix: models

**Exact enumerations** read the rows from the YAML:

- 2D6 with worsening and the cap, weighted by the D6 Injury Location table.
- Death Rolls are binomial on 6s.

**Treat Injury** (400k rolls per case):

- One Push when the roll has no success and no Stress Die shows 1. The Push re-rolls base dice and adds 1 Stress Die, and Gear Dice stay.
- Penalties come off base dice, with a minimum of 1.
- Aftermath rolls use Stress 0, after the end-of-Engagement relief. In-fight attempts use Stress 1.
- Death is the product of each roller's failure chance and 57.9%, for Strength 3 with no Death Roll penalty.
- The delay case is one in-fight attempt at Stress 1 followed by one aftermath roll at Stress 0.

**Grab model.** This is round 2's Opus model, rebuilt:

- **Victim:** a Rookie with Strength 4, Grip Breaker 1, Blade Set 1, Stress 2, and Resolve 3. The crushing torso row uses the cap: Winded +1 Stress, Break Free penalties of 1 or 2, and Caved-In Chest is Down with a 1-die penalty. Break Free needs 3 successes in one roll, on each of two turns. The victim Pushes when short.
- **Stress Responses** use the full table, including "next row down", lost successes, the roll failing, Locked Up's spent turn, Shaking Hands, and Hair Trigger.
- **Witnesses** make a Fear Roll first:
  - Hesitate and Falter cost 1 action. Frozen, Unguarded, and Breaking Point cost 1 turn. Shattered costs 2 turns.
  - Stress gains and Rattled's penalty apply to the strike.
- **Rescue:** each witness strikes the hand at Strength 4, Talent 1, Blade Set 1, their Stress, and Resolve 3 or 2, Pushing on no success. Successes add up toward H, and comrades act before the victim.
  - "One action" means one strike before the lift.
  - "Two actions" means a strike before each victim turn, and a spent turn costs the first strike.
- **Sweep:** 1 to 4 comrades, H = 1 or 2, one or two actions, and a strike penalty of 0 to 4 base dice. The six cells are witness Stress 1 to 3 at Resolve 3 and at Resolve 2.
- **The Hesitate lever** replaces Hesitate's spent action with a 1-die next-roll penalty. Every other row is unchanged.
