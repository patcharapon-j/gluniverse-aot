## Verdict

The design is not ready for rulebook drafting. Kill eligibility, Push resolution, and rescue timing still admit incompatible interpretations that would change character balance, lethality, and the value of Talents.

## Findings

1. **Critical: Kill eligibility contradicts both setup and solo targets.**

   ADR-0001 requires breaking Body Parts before a kill; ADR-0010 calls Attention the only hard restriction. For a lone soldier already noticed by a Titan, Attention also makes a Nape strike illegal regardless of Talent or successes. Levi-grade odds are therefore zero in that situation, not ADR-0014's approximately 50%.

   **Options:** Explicitly supersede the mandatory Body Part gate and define a solo action that loses Attention; or retain mandatory teamwork and revise the solo target to describe only already-eligible strikes.

2. **Critical: Push lacks an executable resolution order.**

   ADR-0004 locks all 1s, while Stress Response triggers when a Stress Die shows 1. A soldier rolls a Stress 1 and a Gear 1, then Pushes: does the first Response resolve before that choice, does the locked 1 trigger again, and does the newly gained Stress Die join this Push? Covering makes ownership of that new die another question. Alien Evolved explicitly prohibits pushing after an initial Stress 1; its procedure cannot silently fill this gap. See the [Alien extraction, §2](/Users/frostnoxia/Developer/gluniverse-aot/docs/research/research-alien-evolved.md:77).

   **Options:** Keep Alien's prohibition; or permit pushing and specify one ordered procedure covering Response timing, retained dice, gear wear, and Covering.

3. **Critical: Initiative can remove the entire rescue window.**

   Under Reaction, Grabbed, Tempo, and ADR-0014, a Tempo-2 Titan can grab and lift after every soldier has acted, then draw the first card next round and devour. Nearby comrades receive no intervening turn. A failed Reaction also spends the victim's escape turn; additional Titan cards can attack someone whose defense is already exhausted.

   **Options:** Give soldiers a separate defensive resource; permit a defined rescue interrupt; or make devouring wait until a specified rescue opportunity has occurred. Simulate actual card order, not an average number of actions per round.

4. **Major: Permanent Stress risks making veterans progressively unplayable.**

   Under ADR-0008, a veteran whose Scars set minimum Stress to 3 has a 42.1% Response trigger chance on every ordinary roll, even after full recovery. At five Stress it is 59.8%. If Alien Evolved's 7+ automatic-failure Response survives, Stress 9 with Resolve 3 automatically invalidates at least 80.6% of rolls. Conversely, mild Responses plus easy Rally can make Scars mostly free dice. Covering could concentrate the cost on a Squadmate who mainly Helps.

   **Options:** Cap the Scar contribution; provide a recovery or retirement route; or tune the complete Response, Fear, Rally, and Covering economy together. Define NPC Stress and which rolls include Stress Dice.

5. **Major: Attention and behavior scheduling have no conflict rules.**

   ADR-0010 and Next Behavior leave “just hurt it” without a duration, tie-breaker, or target eligibility test. A comrade wounds a Titan holding another soldier: does new Attention cancel the scheduled devour and release the captive? Separately, breaking the arm named by a Read can invalidate the promised attack. Rerolling until an enabled, non-repeated entry appears fails when none exists.

   Regeneration adds another ordering choice: a cut immediately before healing might disappear before any ally can exploit it. Starting, resetting, and advancing that clock need explicit triggers.

   **Options:** Specify target eligibility and expiry, then an event priority order for Grab, Telegraphs, disabled parts, and healing; give every table an explicit fallback. Decide whether a disabled queued attack fizzles or changes predictably.

6. **Major: Gas requires distribution targets, not just a nominal duration.**

   Under Gas Roll and ADR-0014, exact expected depletion takes 6 rolls at Rating 1, 8.73 at Rating 2, and 13.94 at Rating 6. Rating 1 sounds compliant, yet 51.8% of tanks empty by round four. Rating 2 gives medians of seven rounds normally and four with one Push every round, but means of 8.73 and 4.61.

   A soldier can therefore exhaust a nominal “six-round” issue during their first fight, or receive high-Funding gas lasting far beyond the target.

   **Options:** Specify a reference Funding level and acceptable early-depletion probability; use fixed expenditure with a reserve roll; or explicitly target medians and retain the volatility.

7. **Major: Direct Critical Injuries do not define incapacitation or accumulated harm.**

   ADR-0005 and Down only connect incapacitation to zero Health. A soldier can receive repeated non-incapacitating Titan injuries while Health stays full unless the injury tables add a separate rule. Repeated hits to an already ruined arm also need a resolution. A torso injury from Grab could kill before the advertised countdown even begins.

   **Options:** Give injuries explicit Down, stacking, and duplicate-location effects; or define a cumulative injury threshold. Keep Health relevant through human attacks and environmental harm, and specify whether Grab's initial injury is included in its mortality target.

8. **Major: Success spending and pool limits remain too undefined to balance.**

   Under Toughness, Opening, and ADR-0006, three successes against Toughness 3 might create zero Openings or two, depending on whether “extra” means beyond the threshold or beyond the first success. That difference changes every setup action.

   The raw engine is tunable. Two dice produce at least one success 30.6% of the time; twelve produce one 88.8%. Four successes from six existing dice after one locked-1 Push occur 5.4% of the time; from thirteen, 50.8%, excluding new Stress Dice and Responses. But attribute budgets, Talent caps, gear stacking, and Opening limits do not establish those populations yet.

   **Options:** Spend each success once, after satisfying the action's threshold; define pool limits and Opening generation, expenditure, and ownership before simulation.

9. **Major: Expedition attrition breaks at casualties and empty resources.**

   ADR-0009 guarantees arrival, Formation Posts cannot change before a Waypoint, and failed Legs double Gas and Squad Supply costs. If Vanguard dies during a Leg and the Squad has no gas, neither the acting replacement nor the cost of continuing is defined. If a third Titan forces retreat, does guaranteed arrival mean the intended Waypoint or another refuge? It is also unclear why uneventful travel on horseback consumes ODM gas.

   **Options:** Define emergency Post succession and explicit shortage consequences while retaining arrival; or distinguish guaranteed navigation progress from survival through an interrupting Engagement. Specify Leg duration and when days-outside escalation advances.

10. **Major: GM discretion re-enters through permissions and information.**

    ADR-0003 is not satisfied merely by naming actions. Preparation Points do not price or constrain flashbacks: a player can claim a pre-positioned gas cache unless the GM invents a limit. Drive needs an eligibility test, and repeated Reads need Research Point award limits. A Squad extracting a human early also collides with a clock-locked Discovery despite Canon Clock allowing divergence.

    **Options:** Supply bounded preparation packages, explicit Drive triggers, and discovery award conditions; distinguish unavailable technology from facts characters have already demonstrated. Give unlisted actions a defined adjudication procedure.

11. **Major: Paper-table load is heavy, and YAML alone will not solve it.**

    With six Body Parts and Tempo 2, one Titan requires roughly fourteen states/cards when including Regeneration, Nape cuts, Attention, current and previous Behavior, and Openings. Six soldier Positions, two Background clocks, and two Wings bring the encounter to roughly two dozen tracked elements before personal resources. A Grab can then require five witness Fear Rolls. Wing turns can further concentrate spotlight.

    **Options:** Run a timed paper encounter and combine trackers that prove redundant; delegate Wings and soldier resources to players. For ADR-0012's Foundry v14 translation, define stable action/effect identifiers, hidden-information ownership, and ordered state transitions. YAML containing prose still needs mechanical interpretation.

12. **Major: The stated canon scope needs allied Shifters.**

    ADR-0002 and Shifter make every Shifter a GM-side threat, yet the official chronology places Eren's Survey Corps membership and his successful Trost gate-sealing operation in 850. A Close campaign needs procedures for protecting and coordinating with that ally. [Official character chronology](https://shingeki.tv/season1/character/)

    For example, a Trost Operation Frame needs to determine when Eren advances the objective, how soldiers enable that progress, and what interrupts it. An enemy Intent Table does not answer those questions.

    **Options:** Treat allied Shifters as GM-controlled mission assets with bounded actions; or narrow the supported campaign scope. Neither option requires playable Shifters.

## Open decisions

- Set attribute budgets and limits, starting Talent levels, minimum dice after penalties, rounding for Health and Resolve, and action-to-attribute assignments. Confirm Perception has a distinct job beside Instinct.
- Decide whether the Graduation Exam replaces or modifies Merit, how Class Rank is calculated, and how accepting Military Police membership fits a Survey Corps campaign.
- Define standard attack pools, dodge/block eligibility, movement graphs, altitude/falling, anchor loss, and Position relative to two Titans.
- Specify gear contributions and wear allocation when blades and ODM are used together; gas-zero effects, carrying casualties, field repairs, refill amounts, and who carries Squad Supply.
- Define Fear duration and recovery, Scar acquisition, Grief effects, Death Roll dice and stabilization, and how an inaccessible Haven affects Downtime.
- Fix ADR-0014's simulation populations and denominators: four soldiers or four PCs plus Squadmates; fresh or scarred; starting Positions, terrain, and preparation; mean or median duration; deaths per PC or per Squad. Include failed missions, retreats, and replacement soldiers.

## Keep

- Regenerating Body Parts and cumulative Nape cuts make timing and coordinated attacks matter without ordinary Titan Health.
- Attention offers a visible tactical problem players can manipulate once its timing and eligibility are explicit.
- Guaranteed Leg progress turns navigation failure into consequences instead of repeated rolls.
- Squad-owned advancement and promotable Squadmates preserve campaign continuity through casualties.
- One table source for rules and VTT provides a foundation for keeping paper and automated procedures consistent.