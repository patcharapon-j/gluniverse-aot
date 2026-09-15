# Chapter 3, Harm and Mind: review round 1

Reviewed:

- `docs/rules/03-harm-and-mind.md`.
- Every file in `data/harm/` and `data/mind/`.
- OQ-39 to OQ-55 in `docs/rules/OPEN-QUESTIONS.md`, and the Chapter 3 note added to OQ-38.

Checked against:

- `CONTEXT.md` and ADR-0001 to ADR-0015.
- Chapter 1 (`docs/rules/01-core-rules.md`, `data/core/`, OQ-01 to OQ-18).
- Chapter 2 (`docs/rules/02-character-creation.md`, `data/character/`, OQ-19 to OQ-38).
- The earlier reviews in `docs/reviews/`.

I did not read the parallel Codex review.

Odds come from Python scripts in the scratchpad, which are not committed. The YAML was converted to JSON with Ruby's standard library and read unmodified:

- Critical Injury, Death Roll, Stress Response, and Fear Roll odds are exact, enumerated from the rows.
- Care windows use 200k trials per case. The Grab model uses 60k trials per cell.

The appendix gives the models.

Severity follows the brief:

- **Critical:** contradicts an ADR or the glossary without being logged, rests on GM discretion, or is a rules bug that breaks play or makes an ADR-0014 target unreachable.
- **Major:** an undefined edge case or ordering problem likely in normal play, or a significant odds, balance, or fidelity problem.
- **Minor:** wording, clarity, or a small gap.

## Verdict

This is a strong first draft. The body and mind halves are closed and data-shaped, and every table rolls. Every Chapter 1 and Chapter 2 hook that Chapter 3 inherited is answered:

- OQ-03 (e): Down soldiers roll nothing but the Death Roll.
- OQ-09: Down soldiers make no Reaction.
- The Drive's result definition.
- The Catalog's `treat-injury` and `rally` requirements.

**No Critical findings.**

- No rule rests on GM discretion.
- No ADR or glossary departure is left unlogged. The third Down condition is logged as OQ-45.
- No `_Avoid_` term is used.
- No Phase 2 procedure is drafted.

**The Grab target is reachable.** In the model below, a Rookie alone dies about 60% of the time when Break Free needs 3 successes, and about 77% when untrained. Chapter 5 can reach about 1 in 3 with comrades close. But section 3.7 points Chapter 5 at the wrong levers:

- Chapter 3's Down row and Fear Rolls add about 19 points to the alone case.
- They add only about 1 to 5 points to the comrades-close case.
- With ADR-0015's Toughness 1 hand and two Rookie comrades free to strike it, deaths fall to 0.3% to 17%, whatever Chapter 3 does.

**Seven Majors.** The most important:

1. "Every harm a Titan behavior inflicts is a Critical Injury" collides with being devoured.
2. Lost Arm, Lost Leg, and Lost Eye have no effect at all for the 28 days before they heal.
3. Care windows make the `engagement` limit, which is 94% of first lethal results, kill under 2% of the time. That puts almost all of ADR-0014's PC death target on the Grab.

## Checks that passed

- **Every table is complete and rollable:**
  - The Injury Location table covers D6 totals from -3 to 9, each exactly once.
  - All four Critical Injury tables cover 2D6 plus worsening totals from -5 to 39, each exactly once.
  - The Stress Response and Fear Roll tables cover -30 to 39.
  - Death Roll outcomes cover 0 to 19 successes.
  - The Scar table covers all 36 D66 results exactly once, with no extra values.
- **Each `non_lethal_cap` is sound.** It exists, is neither lethal nor instant death, and every instant-death row has no other fields.
- **Every reference resolves:**
  - Every effect type and every Catalog entry named in a penalty.
  - Every Talent named by the chapter: Hard to Kill, Field Medicine, Sure Hands, Careful Nursing, Iron Nerve, Unshaken Command, Steady Voice, Carrying Voice, and Pry Loose.
  - Every OQ id cited in the chapter and the Chapter 3 YAML.
- **Most stated odds reproduce exactly:**
  - Torso lethality: 8.3%, 27.8%, and 50.0% with 0, 1, and 2 held, plus 8.3% instant death with 2.
  - Head Down: 41.7%.
  - The crushing Critical Injury: Down 16.7%, 41.7%, and 72.2%, and the Break Free penalty spread 16.7 / 41.7 / 25.0 / 16.7%.
  - Death Roll: 42.1%, 51.8%, and 59.8% to live, and 7.4%, 13.2%, and 19.6% to slow.
  - The 15.1% three-turn figure.
  - OQ-47's Stress Response claims and OQ-50's turn-loss claims.
  - The exceptions are in finding 10.
- **No glossary `_Avoid_` term appears** in the chapter or its YAML. "Body Part" appears only for the Titan's hand, and "Broken" does not appear.
- **Phase 2 content is only forward-referenced.** That covers Downtime, Havens, Expeditions, Operation Frames, and Shifters. The one Expedition-shaped rule, "a day passes at each night camp", is the unit ADR-0009 names and is logged as OQ-53.
- **Worked example.** The Critical Injury rows match the YAML. The turn-spending contradiction is finding 8.

## Findings

### 1. Major. "Every harm a Titan behavior inflicts is a Titan attack, and always a Critical Injury" contradicts the chapter's own devour example

**Location:**

- Section 3.1, *The kinds of harm* ("Death ... any rule that names death, such as being devoured (Chapter 5)").
- Section 3.1, *Titan attacks bypass Health* ("Every harm a Titan behavior inflicts on a soldier is a Titan attack. It is always a Critical Injury and never damage").
- Section 3.4, *Dying*.
- `health.yaml`: `harm_kinds[death].named_by` and `titan_attacks.definition`, `harm_kind`, `landing`.
- OQ-39.
- Glossary **Grabbed** ("devours them").

**Problem:** Two closed rules each claim the devour:

- `titan_attacks` makes every harm from a Titan behavior a Critical Injury that "lands unless the target's Reaction meets its Severity".
- `harm_kinds[death]` names being devoured as a rule that names death.

Nothing says the Grab's lift and devour are not Titan behaviors. The final design review brief described them as the Titan's next cards ("next Titan card lifts (telegraphed); card after devours"). ADR-0015 moved the countdown to the victim's turns, but never said the devour stops being something the Titan does.

If Chapter 5 or Chapter 6 writes the devour as a behavior, or as a Grab step with a Severity, Chapter 3's wording turns it into:

- a torso Critical Injury, which by itself never kills, and
- a harm that lands only unless dodged. Chapter 1 left open whether a Grabbed soldier can make a Reaction (OQ-09), so the victim may be able to dodge being eaten.

OQ-39 also rules out any Chapter 6 behavior that kills outright, such as a Large Titan's bite, and records no reasoning for the devour case. The chapter's own "no rulings" line then leaves the table with two rules and no way to pick one.

**Scenario:**

1. Chapter 6 gives a Medium Titan the entry "Devour: the Grabbed soldier is eaten", with Severity 3, as its Grab follow-up.
2. At the devour, the Grabbed soldier's player points at section 3.1: the harm comes from a Titan behavior, so it is a Critical Injury that lands unless dodged.
3. They dodge with Agility 3 and ODM Gear 1 (Chapter 5 has not forbidden it), and they fail.
4. The torso roll is 2D6 + 2 = 9, Crushed Ribs. The soldier is still alive in the Titan's mouth.
5. The GM's reading, that the soldier dies, has no rule behind it.

**Fix options:**

1. Narrow the definition: "Every harm a Behavior Table entry inflicts is a Titan attack, except death that the Grab procedure (Chapter 5) names." State in `titan_attacks` that lift and devour are Grab procedure steps with no Severity and no Reaction.
2. Define a Titan attack by its data: a behavior with a Severity and an Injury Location. Let Chapter 5 and Chapter 6 name `death` as a harm kind for a closed list of behaviors (the devour, and any bite Chapter 6 lists). Record the change in OQ-39.
3. Keep the rule absolute, and make the devour itself a Chapter 3 harm: an `instant_death` Critical Injury with no Reaction, named by the Grab. Say so in section 3.7.

### 2. Major. Lost Arm, Lost Leg, and Lost Eye have no effect while held, so a soldier who has just lost an arm strikes at full dice for 28 days

**Location:**

- `critical-injuries.yaml`: `arm-lost-arm`, `leg-lost-leg`, and `head-lost-eye` each have `effects: []` and `permanent_effects` that apply only "after it heals". The integrity script flags all three.
- Also `torso-internal-bleeding`, `torso-torn-open`, and `head-bleeding-skull`, which have `effects: []`.
- Section 3.2, *Reading a row* ("`permanent_effects`: Effects that stay after it heals").
- Section 3.6, *When it heals*.
- OQ-42 ("permanent effects on the worst arm, leg, and head rows").

**Problem:** A row's `effects` last while the Critical Injury is held, and its `permanent_effects` start when it heals. Lost Arm heals in 28 days, so:

- For the 28 days after an arm is lost, the soldier has no arm penalty at all.
- The lighter rows below it keep their penalties while held. Mangled Arm gives 2 dice less on strikes and Break Free. Fractured Arm gives 2 dice less. Even Wrenched Shoulder gives 1 die less on Break Free.
- Once Lost Arm is treated, Down ends. The soldier gets up in the same Titan Engagement and makes a Nape strike with full dice.
- Lost Leg and Lost Eye behave the same way.

The treated bleeding rows (Internal Bleeding, Torn Open, Bleeding Inside the Skull) also carry no penalty once treated. That is a smaller oddity: a soldier who was "Torn Open" last round now flies and dodges at full dice.

Lost Arm is not rare. With one arm Critical Injury held, 2D6 + 2 reaches 13 on 11 or 12, which is 8.3% of arm Critical Injuries.

**Scenario:**

1. Round 2: Private Dora holds a Gashed Forearm. A Titan attack at a rolled Injury Location lands on her arm again: 2D6 shows 11, plus 2, so 13, Lost Arm. She is Down, with a `turn` limit.
2. Round 3: Mila treats it. The injury is stabilized, Down ends, and Dora gains a Scar.
3. Round 4: Dora makes a Nape strike from Blind Spot at Strength 4 plus Clean Cut 2. Her only penalty is the Gashed Forearm's 1 die.
4. For the next four weeks she fights one-armed at no cost. On day 28 she suddenly loses 2 dice on strikes, Break Free, Treat Injury, and Field Repair for life.

**Fix options:**

1. Give each of the three rows `effects` equal to its `permanent_effects`. State in `row_fields` that `permanent_effects` also apply while the injury is held.
2. Rename the field `lasting_effects` ("effects that start when the Critical Injury is gained and never end"). Record them on the sheet at once, as `permanent_injury_effects` already exists to do.
3. Also give the treated bleeding rows at least the penalty of the row below them, such as Crushed Ribs' 2 dice for Torn Open. Then treatment ends the danger but not the wound.

### 3. Major. Care windows make `engagement` limits nearly harmless, which puts almost all of ADR-0014's PC death target on Grabs

**Location:**

- Section 3.2 and OQ-42 (lethality stated as "15.3% of the time").
- Section 3.4 (time limits).
- Section 3.5, *Care windows*.
- Section 3.16, steps 5 and 6.
- OQ-43, OQ-44, OQ-54.
- ADR-0014 ("an Expedition of 4 to 6 Legs costs about 1 Squadmate and about 1 PC Critical Injury; a PC dies every 3 to 4 missions").

**Problem:** The chapter presents lethality as a property of the rows: a first Critical Injury at a rolled Injury Location is lethal 15.3% of the time. The rows and procedures turn that into very few deaths:

- **Almost every lethal first result is `engagement`.** Of the 15.3%, 14.4 points are `engagement` and 0.9 points are `turn`, so 93.9% of lethal first results. A first roll can reach a `turn` row only on a 12 at the torso or head.
- **The care window comes before the Death Roll** (OQ-54 (a)), and every living soldier who is not Down gets a roll with no Position requirement:

  | Soldiers able to roll (no medical kit, Stress 0, player characters Push) | Nobody treats the patient | Death at Strength 3 |
  |---|---|---|
  | 5, Wits 2 | 3.17% | 1.83% |
  | 5, Wits 3 | 0.72% | 0.42% |
  | 2, Wits 2 | 27.7% | 16.0% |
  | 1, Wits 2 | 40.2% | 23.3% |

- **A Squad that ends a Titan Engagement in good order loses at most about 1.2% of soldiers per first Critical Injury** to the lethal rows. That is 14.4% × at most 1.8%, plus 0.9% for `turn` rows even if every one killed, and those rows can also be treated mid-fight.

At ADR-0014's "about 1 PC Critical Injury" per Expedition, that is about 0.01 PC deaths per Expedition, against a target of about 0.25 to 0.33. Everything else must come from rules outside Chapter 3's rows:

- Devours.
- Down soldiers struck again and worsening into instant death. That needs two held at the torso or head.
- Titan Engagements the Squad loses outright.

The Grab's crushing Critical Injury is itself a PC Critical Injury, and it kills about 1 time in 3 with comrades close. Hitting both targets therefore needs roughly 0.8 to 1 PC Grab per mission. That is nearly the whole "about 1 PC Critical Injury" budget, leaving almost no room for any other Titan attack to hit a player character.

The OQ-42 simulator case asks for this run. But the chapter's framing, with 15.3% offered as the lethality dial and OQ-44's claim that the window keeps "Talents, Help, and the Squad's size" mattering, tells Chapters 5 and 6 the tables supply deaths. They do not, unless the Squad is broken.

**Scenario:** Round 3. A swat lands on Private Hale's leg: 2D6 11, Opened Artery (`engagement`, not Down).

1. He keeps fighting at 1 die less on dodges.
2. Two rounds later a Nape kill ends the Titan Engagement.
3. In the care window, Mila (Wits 2, no kit) rolls 2 dice and Pushes. She fails 40% of the time, and then Oskar, Ines, and two Squadmates roll in turn.
4. Hale is treated 97% of the time and gains a Scar for surviving. His chance of dying from the artery was about 2%.

**Fix options:**

1. **Adopt OQ-54 (b) for `engagement` limits:** the end-of-Engagement Death Roll comes before the care window, so treatment during the fight is what saves a soldier. Keep the window for `day` limits.
2. **Make a care-window treatment slow a lethal limit one step instead of stabilizing it** (OQ-44 (c)), or make it need 2 successes on a lethal Critical Injury. In-fight treatment stays one success.
3. **Keep the procedure, and correct the framing:**
   - Replace "lethal 15.3%" in section 3.2 and OQ-42 with the effective death rate for a Squad of 1, 2, and 5 able soldiers.
   - Add to OQ-42's simulator case that the PC death target then rests on Chapters 5 and 6.
   - Consider moving the 11 and 12 results at the arm and leg to `turn` limits, so that some first Critical Injuries kill within the fight.

### 4. Major. The Grab target is reachable, but section 3.7 overstates Chapter 3's levers, and OQ-50 measured the wrong loss

**Location:**

- Section 3.7 ("This is the main lever between 'alone' and 'comrades close'", and "Comrades pay a mind price").
- Section 3.12 and `fear-rolls.yaml` (the `hesitate` to `shattered` rows).
- OQ-42's simulator case, and OQ-50 (the drafting revision and the simulator case).
- ADR-0014 (Grab target), and ADR-0015 (hand Toughness 1, crushing Critical Injury cannot be lethal).

**Problem:** The brief asks whether Chapter 3 leaves ADR-0014's Grab target reachable once Chapter 5 adds the lift and devour. It does. The model in the appendix uses Chapter 3 exactly:

- the crushing Critical Injury rows and cap,
- Down, the Break Free penalties, and Winded's Stress,
- the Stress Response and Fear Roll tables,
- Chapter 1 Pushing.

It sweeps two Chapter 5 unknowns: the successes Break Free needs (N), and the accumulated successes on the hand that free the soldier (H). The victim gets two turns, and each close comrade gets two rescue actions, less what its Fear Roll spends.

Soldier dies, alone and with comrades close (comrades strike the hand, witness Stress 2, Resolve 3):

| Break Free needs | Alone, Rookie (Str 4, Talent 1, Blade 1) | Alone, untrained (Str 3, Blade 1) | 1 comrade, H = 1 / 3 / 5 | 2 comrades, H = 1 / 3 / 5 |
|---|---|---|---|---|
| 2 | 34% | 48% | 2.4 / 14.7 / 26.1% | 0.1 / 2.8 / 9.8% |
| 3 | 60% | 77% | 4.3 / 25.6 / 45.9% | 0.3 / 4.7 / 17.4% |

So:

- **Alone at about 2 in 3 is reachable.** Break Free needs 3 successes for a Rookie, or 2 against an untrained Strength 3 soldier.
- **Comrades close at about 1 in 3 is not reached by Chapter 3's parts.** With a Toughness 1 hand and two comrades free to strike it, deaths stay under 18% even if the hand needs 5 accumulated successes. Chapter 5 must reach 1 in 3 through reach and Position, how many comrades can strike the hand, or what the lift does. It can, so the target is not unreachable.
- **The Down row is a lever on the alone case, not on the gap.** With N = 3, alone is 59.6% with the rows as written and 40.8% if the crushing injury never made the soldier Down: about 19 points. With comrades close (2 comrades, H = 3) it is 4.7% against 3.2%: 1.5 points. Section 3.7 calls it "the main lever between 'alone' and 'comrades close'". It mostly widens the gap by raising the alone case.
- **Fear Rolls add 1 to 5 points to the comrades-close case.** With 2 comrades, N = 3, and H = 3, deaths are 0.6% with no Fear Rolls and 4.7% at witness Stress 2. With a Help-first policy, N = 3, H = 3, and 2 comrades, the rate rises from 28.0% without Fear Rolls to 36.9% at witness Stress 4.
- **OQ-50 measured turn loss, but a rescue needs the action.** At Resolve 3, a witness loses the next action or the whole turn 2 in 6 at Stress 1, 3 in 6 at Stress 2, and 4 in 6 at Stress 3. OQ-50's drafting revision reports "lose their turn 1 time in 6" at Stress 2, and its simulator case measures only the turn.
- **"Cannot be lethal" makes the crushing injury more incapacitating than a normal torso roll.** With nothing held, the cap turns 16.7% of crushes into Down, against 11.1% Down or dead on the normal rows (41.7% against 30.6% with one held, 72.2% against 55.6% with two). A Grab alone is deadlier because of the cap. Section 3.7 does not say so.
- **Held torso Critical Injuries push the alone case past the target on their own.** With N = 3, alone is 73.7% with one held and 88.0% with two. They stay held for 7 to 28 days, so a soldier Grabbed twice in one Expedition is past 2 in 3 whatever Chapter 5 sets.

**Scenario:** Chapter 5 is drafted from section 3.7.

1. The drafter trusts the "main lever" sentence and the 1 in 6 turn-loss figure. They set Break Free to 2 successes, and let the hand break on 2 accumulated successes.
2. A Rookie alone dies 34% of the time, about half the target.
3. With two comrades close, a Rookie dies under 1% of the time, far below 1 in 3.
4. Neither Chapter 3 lever can close either gap.

**Fix options:**

1. **Rewrite section 3.7 with measured sizes:**
   - the Down row adds about 19 points alone and 1 to 2 with comrades close;
   - witness Fear Rolls add about 1 to 5 points with comrades close;
   - the comrades-close target rests on Chapter 5's reach, action, and hand rules.
   Replace "the main lever" accordingly.
2. **Correct OQ-50** to report action loss (2/6, 3/6, and 4/6 at Stress 1 to 3, Resolve 3). Change its simulator case to count lost rescue actions, not lost turns.
3. **If Chapter 5 wants Break Free at 2 successes, change the torso cap row** to give a Break Free penalty instead of Down, for example Crushed Ribs for every capped total. The alone case then depends on Break Free odds, not on a 1 in 6 automatic death. Record the trade in OQ-42.

### 5. Major. A soldier who leaves a Titan Engagement while it goes on has no turn, treatment, or care-window rule

**Location:**

- Section 3.4 (`turn`: "the end of each of the soldier's turns in a Titan Engagement"; "Outside a Titan Engagement, there are no turns").
- Section 3.5, *In a Titan Engagement* ("The patient must hold the same Position as the treater") and *Care windows* ("at once, when a soldier outside a Titan Engagement becomes Down or gains a lethal Critical Injury").
- Section 3.16, step 4.
- `death-rolls.yaml` (`time_limits[turn]`), `treat-injury.yaml` (`care_windows.held`).
- Chapter 1, OQ-10: a soldier can leave a Titan Engagement before it ends. ADR-0009 names retreat.

**Problem:** A soldier who leaves holds no Position while the Titan Engagement continues. Leaving happens in every staggered retreat, and whenever Lift Comrade carries a dying soldier out. The chapter never says whether that soldier is inside or outside the Titan Engagement:

- **Turns.** If they still take turns (Chapter 1 section 1.9 gives every player character a turn each round), a `turn` limit keeps running out. If they do not, it freezes until the Titan Engagement ends.
- **Treatment.** "The patient must hold the same Position as the treater", and neither soldier holds one. Outside a Titan Engagement, Treat Injury is rolled only in a care window. The outside-harm window opens only for harm gained outside, and this injury was gained inside.
- **The end.** Step 4 (`turn` becomes `engagement`) and step 5 (the care window) wait until the Titan Engagement ends. Nothing says whether the soldiers who left take part.

So carrying a comrade with Internal Bleeding away from the Titan can leave them rolling a Death Roll every turn, with 2 dice at Strength 3, while the carrier who saved them is barred from treating them.

**Scenario:**

1. Round 2: Oskar (Strength 3) takes Internal Bleeding (`turn`, Death Roll penalty 1, Down).
2. Round 3: Mila takes Lift Comrade, and Chapter 5 lets them both leave by round 4. The rest of the Squad fights on for three more rounds.
3. Either Oskar keeps rolling 2 dice each turn, and is alive after three turns 5.9% of the time with Mila forbidden to treat him, or his limit freezes because he has no turns in a Titan Engagement.
4. Nothing in Chapters 1 to 3 picks one.

**Fix options:**

1. A soldier who has left a Titan Engagement that is still under way keeps taking turns in it for every rule that counts turns. Treat Injury and Rally between two soldiers who both hold no Position in it count as the same Position.
2. Leaving ends the Titan Engagement for that soldier. When they leave, apply steps 4 to 6 of `engagement-end.yaml` to them, with a care window among the soldiers who left together.
3. Log it as an open question now, naming the Lift Comrade case and the three rules above, so Chapter 5's retreat rule must answer it.

### 6. Major. "No Reactions" lasts until a turn that can be two or three rounds away for the soldier holding Attention

**Location:**

- Section 3.9 ("**No Reactions** forbids the soldier's Reactions until the end of the last turn the same row spends").
- `effect-types.yaml`: `spend-next-turn` ("the earliest turn, starting with the current round's, whose move and action are both unspent") and `no-reactions`.
- `fear-rolls.yaml` rows `unguarded`, `breaking-point`, `shattered`.
- OQ-46.
- Chapter 1 OQ-17 (turns spent in advance are common).

**Problem:** OQ-46 reuses the Reaction's turn-spending rule, which is sound for losing a turn. Tying the Reaction ban to that turn makes the ban's length depend on the soldier's turn debt instead of on the result:

- A soldier whose turn this round is unspent loses Reactions until the end of this round's turn.
- A soldier who has already acted and dodged this round has next round's turn already spent. The earliest turn with both parts unspent is two rounds away, and the ban runs until it ends.
- For Shattered (2 turns), the ban can run into the third round.

Chapter 1 review round 3 found that a soldier targeted on every card starts the next round with the turn already spent after 77% of rounds at Tempo 1 (OQ-17). ADR-0010 makes that soldier the likeliest target: the striker who fell short, holding Attention. Every card against them lands until the ban lifts.

**Scenario:**

1. Round 3: Kaya strikes the Nape and falls short. The Titan's first card targets her, and she dodges, so her round 4 turn is spent in advance.
2. The Titan's second card Grabs a comrade. Kaya's Fear Roll totals 6: Unguarded.
3. Her round 4 turn is already spent, so Unguarded spends her round 5 turn, and she cannot make a Reaction until her round 5 turn ends.
4. Every card the Titan plays against her in the rest of round 3, all of round 4, and round 5 before her card lands without a dodge.
5. Ines rolls the same total in the same round with her turn unspent. She loses only round 3's turn, and can dodge again from round 4.

**Fix options:**

1. Tie the ban to time, not to the spent turn: "cannot make a Reaction until the end of the soldier's next turn to come up", whichever turn the row spends. For `turns: 2`, the ban lasts until the end of the turn after that.
2. Let `spend-next-turn` from a Fear Roll or Stress Response spend the current round's turn if any part of it is unspent. Leave the Reaction's own rule unchanged.
3. Cap the ban at the end of the next round, and record in OQ-46 why the ban differs from Chapter 1's turn-spending reference.

### 7. Major. Squad-wide Grief with no Phase 1 relief pushes Resolve to 0 within a few Expeditions, and at Resolve 0 a Fear Roll gives a Scar 1 time in 3

**Location:**

- Section 3.14 and `grief.yaml` (`who: every other living soldier in the Squad`, `maximum: 3`, `losing.in_the_field: never`).
- Section 3.8 (no floor).
- OQ-52.
- ADR-0008 (Resolve rises with Scars to stop the spiral).
- ADR-0014 (about 1 Squadmate per Expedition, and a PC every 3 to 4 missions).

**Problem:** Every death gives every other soldier in the Squad 1 Grief, including soldiers who were never in that Titan Engagement. A Drive's named comrade or the Numb Scar adds more. No Phase 1 rule lowers it.

At ADR-0014's rates, each soldier gains about 1.3 Grief per Expedition, and the whole Squad reaches 3 Grief after about three Expeditions. That lasts unless the unwritten Downtime rules remove more than that each Downtime. A Rookie's Resolve then falls from 3 to 0.

| At Stress 2 | Fear Roll: loses action or turn | Loses whole turn | Gains a Scar | Stress Response costs a success or worse |
|---|---|---|---|---|
| Resolve 3 (no Grief) | 3/6 | 1/6 | 0/6 | 0/6 |
| Resolve 1 (2 Grief) | 5/6 | 3/6 | 1/6 | 2/6 |
| Resolve 0 (3 Grief) | 6/6 | 4/6 | 2/6 | 3/6 |

A soldier with Instinct 2, Empathy 2, and 3 Grief (Resolve -1) gains a Scar on 1 Fear Roll in 6 even at Stress 0. ADR-0008's answer to the spiral, +1 Resolve per Scar, restores 1 of the 3 points per Scar, at the price of permanent minimum Stress.

The glossary allows this: Grief lasts "until it is dealt with during Downtime". But choosing "every soldier" (OQ-52 (a)) over "witnesses" makes saturation the default for a whole Squad, and every Phase 1 playtest has no relief at all.

**Scenario:**

1. Expedition 1: Squadmate Bren is devoured. All five survivors gain 1 Grief.
2. Expedition 2: a player character dies. Expedition 3: another Squadmate dies. Every soldier now holds 3 Grief.
3. Expedition 4, first Grab: every witness at Stress 2 loses their rescue action, two in three lose the whole turn, and one in three gains a Scar.
4. The Grab victim's comrades-close odds are now at least those of the victim alone.

**Fix options:**

1. Give Grief only to soldiers who held a Position in the Titan Engagement where the death happened, or who share that Expedition. Soldiers not present gain it at the next Downtime or not at all. The glossary does not say who gains Grief.
2. Cap Grief gained from one Titan Engagement at 1 per soldier, however many die, plus the named-comrade point.
3. Keep OQ-52 (a), but record a Downtime relief target now ("each Downtime removes all Grief" or "at least 2"). Add a simulator case for median Resolve across four Expeditions and Downtimes at ADR-0014's death rates.

### 8. Minor. The worked example contradicts Chapter 1's turn spending for Oskar's Reaction

**Location:** *Example: a bad round*, bullets 2 and 3. Chapter 1 section 1.9, PROVISIONAL (OQ-09).

**Problem:** Oskar dodged the Titan's first card this round. Under OQ-09 (b):

- If his turn this round was wholly unspent when he dodged, the Reaction spent it, and he holds no action. Bullet 2's "He loses the action he was still holding" is then wrong.
- If he had already used part of this round's turn, the Reaction spent his next turn. Bullet 3's "His next turn has its move and action" is then wrong.

Either way one sentence breaks the rule the example is teaching.

**Scenario:** A new GM reads the example and concludes that ending Down restores a turn spent in advance.

**Fix options:**

1. State that Oskar had moved but not acted before the first card. His Reaction spent his next turn, so he was holding this round's action, and "His next turn has no move and no action, because his dodge spent it."
2. State that his turn was unspent when he dodged. Delete "He loses the action he was still holding", and keep bullet 3.

### 9. Minor. OQ-38's precondition was not met, and the end-of-Engagement steps make simultaneous promotions more likely

**Location:**

- Section 3.16, steps 6 to 8; `engagement-end.yaml` (`retirement-and-promotion`).
- Section 3.13, *Retirement*.
- OQ-38 (the "Why deferred" line: "Resolve it ... before Chapter 3 drafts death and Retirement"), OQ-54.

**Problem:**

- OQ-38 asked for the promotion order to be settled before this chapter created the triggers. Chapter 3 drafted around it.
- Step 8 now gathers into one moment every player character who died during the fight, at its end (step 6), or who retired. It still has no order.
- A second gap: a fifth Scar gained in the step 5 care window, from stabilizing a lethal Critical Injury, is gained after the Titan Engagement ended. Under *Retirement* the soldier therefore retires "at once", partway through the steps, not at step 8. The two texts give different moments.

**Scenario:** Two player characters die in one fight: one devoured in round 4, one at step 6. Two Squadmates survive, and both players want the Medic. Nothing orders them or says what the loser does.

**Fix options:**

1. Record in OQ-38 that Chapter 3 now batches promotions at step 8, and carry OQ-38 (c) into Chapter 2's next revision.
2. State in `retirement.timing` that a fifth Scar gained during the steps of `engagement-end.yaml` retires at step 8.

### 10. Minor. Four stated figures are wrong or ambiguous

**Location:** Section 3.2 PROVISIONAL (OQ-42); OQ-42; OQ-43.

- **Down 10.7%:** a first Critical Injury at a rolled Injury Location puts the soldier Down 23/216 = **10.6%** of the time.
- **OQ-43 option (g):** "alive after three turns only 5.9%". Under (g), where any success lives and nothing slows, 2 dice give 0.306³ = **2.9%**. 5.9% is the figure for the chosen option (e) with 2 dice.
- **Torso with two held:** "lethal 50.0% ... when it is also instant death 8.3%" reads as if instant death were part of the 50%. The two are separate, so 58.3% of results kill or can kill.
- **Head, missing figure:** the head table with two held gives 63.9% lethal plus 8.3% instant death, and OQ-42 omits it.

**Fix options:**

1. Correct 10.7% to 10.6% and (g) to 2.9%.
2. Write "lethal 50.0% and instant death 8.3%".

### 11. Minor. Prose, YAML, and Talent wording disagree in four places

**Location and problem:**

- **Section 3.10:** the lasting rows penalize "thinking, reading a Titan, cutting, moving". Narrowed Sight penalizes `break-attention` and `rally`, and Racing Thoughts already takes `read`.
- **Section 3.6 and `healing.yaml` (`careful_nursing`):** "a Treat Injury roll by a soldier with Careful Nursing succeeds on a Critical Injury". The Talent's trigger is "succeeds on a *comrade's* Critical Injury", so the chapter's summary extends it to self-treatment.
- **Sections 3.8 and 3.12:** "Unshaken Command can replace the soldier's Resolve with a nearby comrade's". The Talent applies only if the comrade's Resolve is higher, once per Titan Engagement, from the same Position or one step, and only when that comrade is not Down.
- **Winded and Dazed:** their `stress-gain` is "gained once, when the Critical Injury is recorded" only in a YAML comment, while `row_fields.effects` says effects "last while the Critical Injury is held". Foundry's import drops comments.
- **`faced_a_titan`:** `sheet-fields.yaml` sets it "once the soldier has held a Position in a Titan Engagement". `fear-rolls.yaml` sets it "after the roll", which a Down soldier never makes. For a soldier Down when first entering, the two files disagree on whether they roll next time.

**Fix options:**

1. Correct the prose to name the entries. Quote the Talent triggers, or say "as the Talent states".
2. Add `applies: once_when_gained` to the two `stress-gain` effects, or define in `effect-types.yaml` that `stress-gain` on a Critical Injury applies once.
3. Set `faced_a_titan` in both files when the soldier first holds a Position, whether or not they roll.

### 12. Minor. The sheet fields miss state that the rules test

**Location:** `sheet-fields.yaml`; section 3.10 (*When lasting results end*); section 3.11 (*Outside a Titan Engagement*); `engagement-end.yaml` step 3; Chapter 2 `promotion.steps`; OQ-55.

**Problem:**

- **Where a lasting result was gained.** Step 3 ends only lasting Stress Responses "gained during the Titan Engagement". One gained in a care window carries into the next fight and ends at the next day. The sheet records only the row id.
- **Rally outside a Titan Engagement.** It is allowed "once per comrade until that comrade gains another lasting result". No field records who has Rallied whom.
- **Unshaken Command's per-Engagement use.** No field records it.
- **Promotion.** Chapter 2's `promotion.steps` keeps a fixed list that includes Critical Injuries. The Chapter 3 fields (permanent effects, lasting Stress Responses, next-roll penalty, `faced_a_titan`, Scars already given, retiring) are not in it. The list does not say "everything".

**Scenario:** A Squadmate with Lost Arm's permanent penalty is promoted. The steps say what is kept, and the penalty is not listed.

**Fix options:**

1. Add `gained_in_titan_engagement` to each lasting Stress Response, and a `rallied_by` list cleared when a new lasting result is gained.
2. Add a note to OQ-55 that `promotion.steps` should keep every field in `sheet-fields.yaml` when Chapter 2 is next opened.

### 13. Minor. Care-window scope and Covering are underspecified

**Location:** Section 3.5, *Care windows*; `treat-injury.yaml` (`who_rolls`, `help`, `cover`).

**Problem:**

- "Every living soldier who is not Down" has no scope. It could mean every soldier in the Squad, every soldier on the Expedition, or every soldier who held a Position. With no Position requirement, a Squadmate a Leg away or at headquarters in Downtime qualifies.
- "A soldier who qualifies to Help a roll can Cover its Push" leaves unanswered whether a soldier who has already Helped one roll, which spends their roll, still qualifies to Help, and so Cover, another. Chapter 2's Graduation Exam states this case, and this chapter does not.

**Fix options:**

1. Scope it: "every living soldier in the Squad who held a Position in that Titan Engagement" for the end-of-Engagement window, and "every living soldier in the Squad on that Expedition" for day windows. Downtime rules set their own.
2. State: "A soldier who has made or Helped a roll in the window can still Cover a later roll's Push."

### 14. Minor. The Pay It Forward Drive can never shrug off the Fear Roll for the Grab it was written for

**Location:** Section 3.12, *Limits* ("Fear Rolls are made as soon as the event has been fully resolved"); `enlistment.yaml`, Pay It Forward (`grabbed_or_down_comrade`, `since_most_recent_turn_start`); OQ-49; Chapter 2 OQ-23.

**Problem:**

- The `comrade-grabbed` Fear Roll happens the moment the comrade is Grabbed. No act on that comrade "who was Grabbed" can have happened since the witness's most recent turn began.
- The rescuer's Drive meets its trigger only if another comrade was already Down or Grabbed and the witness acted on them.
- Canon's rescuer who throws themselves at the hand despite the terror is exactly the soldier this Drive describes.

**Fix options:**

1. Record in OQ-23 or OQ-49 that the rescue Drive covers the `comrade-dies` Fear Roll and later triggers, but never the first `comrade-grabbed` roll.
2. Let a witness's Fear Roll result take effect at the start of their next turn, so an act in between can meet the Drive. This changes the rescue window and needs the Grab simulator case.

### 15. Minor. Worsening does not guarantee the glossary's "worse result", and untracked sides let a soldier lose the same arm twice

**Location:** Section 3.2; `critical-injuries.yaml` (`worsening`, `held_injuries.sides`); glossary **Critical Injury** ("a second injury to the same location lands on a worse result"); OQ-41, OQ-42.

**Problem:**

- +2 shifts the roll but does not compare it with the first injury. A first arm roll of 11 (Torn Artery) and a second of 3 + 2 = 5 (Gashed Forearm) is legal.
- Worsening counts only held Critical Injuries. A soldier whose Lost Arm has healed rolls a new arm Critical Injury as if unhurt, and can roll Lost Arm again. The permanent penalties then stack to 4 dice.

**Fix options:**

1. Record in OQ-42 that "worse" means "rolled with +2", and propose the glossary wording "lands on a worse roll".
2. Count a healed row with `permanent_effects` toward worsening at that Injury Location. After a Lost Arm, re-roll a second Lost Arm as Mangled Arm.

## Provisional decisions OQ-38 to OQ-55

| OQ | Judgement |
|---|---|
| OQ-38 note | Accurate, but OQ-38's own precondition was not met (finding 9). |
| OQ-39 | Sound reading of ADR-0005, but the devour case contradicts it (finding 1). |
| OQ-40 | Sound. Matches both parent games. Health now matters only for Chapter 4 falls, as the entry says. |
| OQ-41 | Sound. The untracked-sides consequence is finding 15. |
| OQ-42 | Table shape, cap, and worsening are sound and fully rollable. The Lost rows have no effect while held (finding 2). The 15.3% lethality framing misleads (finding 3). Two figures are off (finding 10). |
| OQ-43 | Sound. The ladder and the "2 or more slows" rule give Hard to Kill a job. The option (g) figure is wrong (finding 10). |
| OQ-44 | Procedure closed and consistent with Chapter 1's OQ-06 and OQ-08. Care windows before the Death Rolls make `engagement` limits nearly harmless (finding 3). Scope gaps are finding 13. |
| OQ-45 | Sound. Settles OQ-03 (e) and OQ-09 without a Chapter 1 change. Leaving a Titan Engagement is open (finding 5). |
| OQ-46 | Sound for spending turns and actions. The Reaction ban's length is finding 6. |
| OQ-47 | Sound. 1-die lasting rows, "next row down", and the endings all hold up. Prose mismatch is finding 11. |
| OQ-48 | Sound. |
| OQ-49 | Sound and closed. It satisfies ADR-0003 item 1. The Drive timing gap is finding 14. |
| OQ-50 | Rows sound, and every result maps to tracked state. The revision measured turn loss, not action loss (finding 4). |
| OQ-51 | Sound. Two data-shaped triggers, and a complete D66 table. The fifth-Scar timing gap is finding 9. |
| OQ-52 | Revisit (finding 7). |
| OQ-53 | Sound, and it depends only on ADR-0009's night camp. |
| OQ-54 | Order is coherent. Option (b) is the best lever for finding 3. |
| OQ-55 | Sound as a holding pattern. Gaps in finding 12. |

## Appendix: models

**Exact enumerations** read the rows from the YAML:

- Critical Injury odds enumerate 2D6 with worsening and the cap.
- Death Roll odds are binomial on 6s:
  - a `turn` limit rolls each turn until death or a slow;
  - an untreated `engagement` limit rolls once, then daily until it stabilizes or kills, giving survival 4.8%, 11.1%, and 19.6% with 3, 4, and 5 dice.
- Stress Response and Fear Roll odds enumerate D6 at each Stress and Resolve. They ignore already-held lasting rows.

**Care window** (200k trials per case):

- Each soldier rolls Wits dice alone (`treat-injury` without a kit is `attribute_alone`) at Stress 0.
- Player characters Push once when they have no success, adding a Stress Die. Squadmates do not Push.
- The patient dies if nobody succeeds and a Strength 3 Death Roll then fails.
- The model ignores Help, which is never better than a roll for a single patient.

**Grab model** (60k trials per cell), Chapter 3 parts exact:

- The torso roll uses the cap, Down, Break Free penalties, and Winded's Stress.
- Rolls follow Chapter 1: one Push when short, unless a Stress Die shows 1. The Stress Response is resolved on the table at Resolve 3, including lost successes, the roll failing, and a turn spent.
- Each witness makes a Fear Roll at Resolve 3 and loses 1 action for Hesitate or Falter, 1 for Frozen, Unguarded, or Breaking Point, and 2 for Shattered.

**Grab model, Chapter 5 assumptions:**

- The victim takes two turns, lifted after the first and devoured after the second.
- Each comrade has two rescue actions in the window and acts before the victim each round.
- A comrade's rescue is a Body Part strike on the hand (Rookie: Strength 4, Talent 1, Blade Set 1, Stress 2, Push when short), accumulating successes toward H.
- The victim, unless Down, rolls Break Free each turn needing N, with penalties applied after the Talent.
- "Never Down" runs shift the torso roll so that no capped row is reached.
- A first run had comrades Help the victim's Break Free instead of striking. At N = 3 and H = 2 it gave 31.7% with two comrades, but only because Help on a 3-success roll is weak play. The findings use the strike policy.
