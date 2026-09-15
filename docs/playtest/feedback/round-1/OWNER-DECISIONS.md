# Playtest packet feedback, round 1: owner decisions

Given 2026-09-15, in answer to the five research files in this folder. Nothing is applied yet. When fixing starts, a Fable decider turns these into a decision batch (DECISIONS, ADRs, CONTEXT, OQ entries) before any chapter or YAML changes.

| # | Topic | Owner decision | Research file |
|---|---|---|---|
| 1 | Manual character creation | Add both the Template Build and a freer choose-what-you-get build, alongside the lifepath roll. The GM allows either per campaign. | `character-creation-and-talents.md` |
| 2 | Talent list size | Grow past the ~60 recommendation: ship the full Talent list as part of the playtest. | `character-creation-and-talents.md` |
| 2b | Non-canon Talents | Accepted, with guardrails as recommended. | `character-creation-and-talents.md` |
| 3 | Critical Injuries | Cause variety, confirmed. No mental Critical Injuries, because Scars, Fear Rolls, Stress Responses, and Grief already cover lasting mental harm. Left and right locations and Injury Type as recommended. | `critical-injuries.md` |
| 4 | Lost limbs | Graded, not a hard ban. Losing one limb makes things harder; losing both is severe. The decider sets exact effects for one arm, both arms, one leg, and both legs. | `critical-injuries.md` |
| 5 | Fear and Stress results | May touch gear (dropped blades, burned gas) and may force actions or moves (flee, cling, berserk). | `stress-and-fear.md` |
| 6 | Canon and era | No Marley for now. Otherwise as recommended: era lock 845 to 850, later inventions as Canon Clock Discoveries, invented items only through Requisition or Discovery, Nape-only kills, Funding and Scarcity with no prices, Titans before gear in Phase 2, nothing new in gear or Titans before the playtest, the charter recorded as an ADR. | `gear-and-canon-expansion.md` |
| 7 | Where deaths come from | Fights, each lethal on its own. A now (playtest with 4 PCs, no Squadmates), B after the playtest (retune Titans). See Open. | `squadmates-and-lethality.md` |
| 8 | Death Roll odds | Take the recommendation: keep the Death Roll as written for the playtest and revisit on playtest data. | `squadmates-and-lethality.md` |
| - | Squadmates | As recommended: keep 4 PCs plus 2 Squadmates as the default; allow fewer with the stated cost. | `squadmates-and-lethality.md` |

## Open

- Item 7 needs the owner's confirmation before the decider settles OQ-132.
- Item 7, settled: each fight should be lethal on its own, to suit AoT. **A now:** the first playtest runs 4 PCs with no Squadmates on today's tuning (measured: a PC dies about every 7 typical rolled fights). Squadmates stay the default rule. **B after the playtest:** retune the Titans so the default Squad (4 PCs plus 2 Squadmates) loses a PC about every 8 typical rolled fights. No retune happens before the playtest.

## Prerequisite done

The simulator check is fixed (`tools/sim/rules.py` lines 624 to 630; engine already matched OQ-134). The committed results are stale until the full rerun after the round 1 changes.

## Titan attack resolution (owner, 2026-09-15, in progress)

Research: `opposed-rolls.md`. The owner is weighing Option C (rolled Titan attacks, the Reaction cancels, crits direct) against Option D (Coriolis damage into Health with a crit threshold), including PC Health size, crit box loss, and hybrids. Round 3 research is running. Settled for any rolled model:

- Titan dice succeed on 5+, with pools of 3, 6, or 9.
- +1 to the Critical Injury roll per extra net success.
- The devour step always lands.
- 0 successes whiffs, even against a soldier who cannot react. Luck spikes are wanted.

**Decided after round 3 (owner, 2026-09-15):**

- **Model: Option C.** Titans roll Titan dice in the open, and the Reaction cancels one for one. The attack lands on 1 or more net successes, and 0 whiffs. Critical Injuries stay direct, skipping Health (ADR-0005 kept), with +1 to the Critical Injury roll per extra net success. Grab, knock loose, and Stress take no rider. One Reaction per Titan per round, Pushable. This supersedes ADR-0015 and amends ADR-0018 (humans share the shape), ADR-0014, and ADR-0005. Chapter 1's "no opposed rolls" item is deleted.
- **Health formula:** unchanged, half of Strength plus Agility rounded up (Rookie 4).
- **Pool mapping:** Titan dice on 5+, pools keyed to today's Severity values (1 rolls 3, 2 rolls 6, 3 rolls 9), plus a fourth pool of 12 for Severity 4 entries. Measured Large row 0.156 against today's 0.185.
- **Free Build Health 2:** allowed. The chapter says the build is fragile; it measured at 0.076 deaths a fight against 0.018 at Health 4. Report the Health 2 row beside the targets, not tuned.
- Rejected: Option B tiers, Option D, the hybrid, a Headbite-style instant-death rule, and Health changes.
- Target B (OQ-140) cannot be reached by dice under any shape. The post-playtest retune uses other levers, chosen then.

- **Timing:** Option C lands before the first playtest, with one full simulator rerun.
- **Human attacks:** use the same shape. Block or Dodge successes cancel attack successes one for one, and damage is the weapon's base plus 1 per net success beyond the first, so a partial defence cuts damage.
- **Musket damage: 4.** A landed ball Downs a Health 4 Rookie, with the immediate Pierce Critical Injury.
- **Burn now, not after the playtest (reverses 7-7's deferral and OQ-138's post-playtest status).** In the owner's words, "steam and corpse heat must come right now as well as anything else that should deal burn damage". Steam, corpse heat, and every other fitting Burn source ship in the first playtest, with Burn names in the packet. So do crushing hazards from a Titan falling onto soldiers: the killed Titan's body coming down on the soldiers under or on it. Titan World (`docs/reference/Titan World_ 3rd Edition.md`) handles both steam and falling Titans, and the owner cites it as the model.

**Batch 8 "Needs owner" answers (owner, 2026-09-15):** all confirmed as the defaults.

1. Steam at a Regeneration fill that recovers a Body Part scalds soldiers On Body.
2. The falling Titan's path covers On Body and Blind Spot, for soldiers who are not airborne.
3. The Titan Engagement runs on while anyone is Pinned.
4. A flare fired at a person is a Burn 1 weapon that spends a flare.
5. Prosthetics as written: Limited Scarcity, fitted at a Downtime after healing, one grade step each, two never past the one-limb grade, and the rows' own penalties stay.
6. **Changed from the default: Cut and Pierce get their own Injury Type riders.** Examples given to the owner: Cut bleeds (a Death Roll comes sooner unless treated), and Pierce lodges (Treat Injury is harder). A Fable decider designs them as item 8-15, and WP-C2 implements them.

Group 2 (WP-R, WP-D, WP-F, WP-B, WP-S1 part 3) started 2026-09-15.

## After the full rerun (owner, 2026-09-15)

The run: 943 cases and every ADR-0014 target Met, but Medium deaths Missed. The reference start read 0.075 through the end and 0.066 during the fight, and both bar runs read 0.069, against at most 0.06. The first-Titan-Engagement row rose from 0.073 to 0.095. Steam adds about 0.010, and the rest comes from the whole round 1 package.

- **Medium deaths band: accept the lethality.** For the playtest, re-set the Medium band to about 0.08 through the end of the Titan Engagement, recorded as the owner's chosen lethality. No levers, and no rule changes for it. The post-playtest retune (OQ-140) still aims higher.
- **Final review decisions** (`REVIEW-FIX-PLAN.md` section 2), all as recommended:
  - **D1:** a Leg or camp roll nobody can make fails.
  - **D3:** a night retreat falls back overnight to the day's last starting Waypoint, and that Leg is ridden again the next day.
  - **D4:** a playtest configuration row in `squadmates.yaml` (4 PCs, 0 Squadmates); Recruit brings no one while it holds.
  - **D6:** Fear Rolls for one event are snapshotted before any result applies.

  - **D2:** the stay limit counts per pin under a corpse, whether or not a Titan is alive.
  - **D5:** a fight nested in a Leg or Night Camp gets its own once-per uses.
  - **D7:** a pinned limb lost to corpse heat leaves the soldier still Pinned, and the feedback page counts such losses.
  - **D8:** the default limit on Quick Refit and Rescue Ride (once per Titan Engagement) and on Stay With the Column (once per Leg); Sure Hands stays unlimited, with a design note.
  - **Simulator:** option (b), targeted in-memory checks plus snapshot notes, not another full rerun.
- **Packet length (owner, 2026-09-15):** no length limit, as long as the packet stays concise and complete. The quick reference no longer has to fit one page, so restore the lines WP-P cut to fit: carrying and Overloaded, decoy requirements, the Attention tie-break, Titan Dice never Pushing, the rider exclusions, Blade Set ruin, horse falls, Help on Leg and camp rolls, and the others its segment report lists. The language conventions are unchanged: TRPG voice, banned developer words, no em dashes, no simulation percentages.
- **Skirmishes: somewhat deadlier, not Titan-level.** Measured today: 4 Rookies against 3 Military Police troopers win 100% with 0.002 deaths; 1 Rookie against 1 trooper wins 74.6%; a Bandit night ambush kills 0.016 with the riders. Retune Foes before the playtest toward about 0.02 to 0.04 deaths per squad fight, keeping human fights a notch below Titan fights.

## Batch 7 "Needs owner" answers (owner, 2026-09-15)

1. **Medical Retirement (7-6):** allowed at the player's choice after losing both arms or both legs, AND add an option for prosthetics as an alternative to retiring. The decider designs prosthetics within ADR-0016's era guardrails (845 to 850 Paradis technology).
2. **Free Build (7-1):** allow 4, 4, 3, 3, 2, 2 beside 4, 3, 3, 3, 3, 2. The Health range may move with the Health size research.
3. **Capstone Talents (7-2, OQ-144):** deferred to after the playtest. The owner asked that it be tracked in the project so it is not forgotten (`docs/rules/PROGRESS.md`, "Deferred until after the first playtest").
4. **Build methods (7-1):** a session-zero choice for the whole campaign, replacements included, with methods mixed freely within the allowed set.
5. **Still to ask with the attack model:** the Burn names in the packet, musket damage, partial Block against human attacks, and the timing (before the playtest).

## Minimal rules for Talent hooks (owner, 2026-09-15)

The owner chose minimal rules to work with (not tags) for Expeditions, Requisition, and human-versus-human combat. Proposal: `minimal-rules-expeditions-requisition-combat.md`. Owner questions in its section 5, all answered as recommended:

1. Human conflict is in scope. First foes: Military Police, bandits, Garrison sentries. No Marley.
2. Guns are as lethal as Titan fights (a landed musket hit puts a Rookie Down).
3. No Requisition before the first Expedition. The first playtest uses the reference kit; Requisition starts at the first Downtime.
4. Pistol, musket, and the shot kind are accepted as the one exception to "nothing new in gear".
5. Straggler victims are picked at random, not by the players.
6. Add a Fear Roll trigger for a soldier's first human kill.
7. Downtime is a fixed 7 days for the playtest.
8. The hazard table ships as written, because item 7 is A now (no Squadmates, so Straggler victims are PCs). Tune it on the playtest count.
9. Keep "bare hands never kill": Crush puts a foe out cold; only Cut or Pierce kills.

The proposal's section 6 goes to the Fable decider.
- Two proposals both claim ADR-0016 (Injury Type, canon charter), and the Talent guardrails want an ADR too. The decider numbers them.

## Process for the fixes

- Implementation: Opus.
- Research: Opus or Fable, chosen per task.
- Decisions: a Fable decider, as needed.
- Final review: Fable, as in the Phase 1 full reviews. Then fix every issue, concern, and inconsistency it raises.
