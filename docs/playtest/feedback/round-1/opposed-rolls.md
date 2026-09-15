# Opposed rolls for Titan attacks and Skirmishes: research, measurement, and opinion

Written 2026-09-15 by a Fable 5.1 research agent for the playtest packet feedback round 1. Research only: no rule, ADR, chapter, YAML, or simulator file was changed. Every measurement was run on the snapshot `.snapshots/pre-feedback-round-1-2026-09-15.tar.gz`, extracted into the session scratchpad, with throwaway scripts that import the snapshot's simulator modules (`tools/sim/`). Nothing was run against the live tree, and nothing under `tools/sim/` in the repository was touched. Scripts, seeds, and sample sizes are listed in the appendix.

Two owner positions arrived while this was being written and are treated as settled, not as questions: a Titan that rolls badly should be able to whiff even against a soldier who cannot react (Down, Grabbed, Unguarded), and a lucky Titan roll that kills outright through a Critical Injury is wanted dread, not a risk to design out. The options below give the whiff and keep the spikes; the average is tuned through dice counts.

## Summary

- **The history does not apply.** The 2026-09-14 final review tested exactly the owner's proposal (each dodge six cancels one attack six, a hit on net 1 or more), at 6, 8, and 10 attack dice against a 5-die dodge. "Roughly doubled lethality" in ADR-0015 is a paraphrase of that finding's headline, not a measurement against a fixed-Severity baseline: no such baseline existed yet. The Severity shape adopted instead was later tuned so that a Medium Titan's kill entry lands on the reference Rookie 79% of the time, far above the 49% the review feared. Measured today, opposed cancellation at Alien-range dice counts is **less** lethal than the current rules, by half or more. The three things that made the review's number frightening (one Reaction per card, the Grab counting in the Titan's cards, and every hit a Critical Injury with no Health) were each fixed or kept by a separate decision, and all three are independent of whether the Titan rolls.
- **The parent games already work the owner's way.** Alien Evolved's signature attacks and Coriolis TGD's creature attacks are rolled from a fixed base-dice pool chosen by a D6 table, and the target's Defend, Block, or Dodge cancels successes one for one. "The table picks the behavior, then the behavior rolls dice" is the parents' shape, not a departure from it.
- **Measured (standard Medium Titan, 4 Rookie PCs, 6,000 fights a row):** today 0.054 deaths a fight during the fight and 0.061 through the end. Opposed cancellation at Alien-like dice (terrorize 5, control 8, kill 10) gives 0.018 and 0.022. Matching today's Medium band needs about **6/12/18** dice (0.062 and 0.069 at 6/12/18; 0.043 and 0.050 at 5/11/16). The first-Titan-Engagement row (0.083 today) and the whole setup mix (0.083 today) are both matched at the same 6/12/18. The owner's future target B (0.125 PC deaths a fight with 2 Squadmates on the mix; 0.023 today) is reached only at about **36 kill dice**, which is not a rollable pool: B needs a lever other than dice, under any shape.
- **The Grab targets survive if the Grab takes no extra-net rider.** With the crush rider the lone Grab drifts from 69.5% to 73 to 81% and the worst rescue cell crosses 50%; with no rider every cell and the lone figure sit within sampling of today's.
- **The whiff against a soldier who cannot react costs nothing measurable** (every tier within 2 standard errors of the same shape with today's auto-land), so the owner can have it for free. A whiff on the devour step, if wanted, lowers the named Grab cell by about 4 points at 10 kill dice and 1 point at 18.
- **Option D (Coriolis damage and crit threshold), measured on request (section 5b):** no setting at 8 dice or fewer comes within a quarter of today's Medium band (best 0.014 and 0.015 against 0.054 and 0.061), damage and threshold move deaths by at most 0.005 at fixed dice, and harm per hit is three to four times more spread than Option C's. Lethality here lives in the Critical Injury tables, and only the landing rate reaches them. Not recommended.
- **Small pools measured:** Option C with Titan dice that succeed on 5 and 6 at 3/6/9 (Large kill 12) reproduces today's Medium band, first-Titan-Engagement row, and setup mix (0.052, 0.094, 0.079 against 0.054, 0.083, 0.083), with a narrower spread per hit than 18 dice on sixes.
- **Round 3 (Health size, the crit box-loss spiral, hybrids; the owner's fixed inputs: 5+ dice at 3/6/9, the rider, the devour always lands):** C on 5+ at today's Health reproduces every row (Medium 0.050 and 0.058, first row 0.082, mix 0.076, cells hold). D at Health 4 overshoots on all 20 settings (0.078 to 0.115) with nothing in damage or threshold to bring it back; D matches only at Health 6 with double damage, and then the Large reads a third of today's at any pool. The best hybrid (control damage 1 threshold 2 into Health, kill as C) matches the Medium band at Health 4 but the Large runs hot or cold with the pool mapping. Per hit and per fight, D spreads harm four to six times as widely as C and makes the second fight of a session four times as deadly as the first (2.2 today), then the night camp wipes the damage: a spiral inside a session, no clock across one. Health 3 doubles to quadruples deaths under every shape. No finalist approaches target B (0.025 to 0.031 against 0.125).
- **Recommended shape:** the Titan rolls its entry's attack dice once per card; its successes are that card's Severity, so the Reaction needs that many (the landing condition is identical to cancellation with net 1 or more, and it is the sentence ADR-0018 already uses for human attacks); 0 successes is a whiff against anyone; each success beyond the Reaction's adds +1 to the Critical Injury roll (a Grab takes no rider); the Reaction stays Pushable and one per Titan per round; Call It, Help, Covering, and Attention are untouched. Land it before the first playtest at dice counts matched to today's lethality (6/12/18 on the Medium on sixes, or 3/6/9 on Titan dice that succeed on 5 and 6, both measured), and keep target B for after the playtest as decided in 7-12.

## 1. History: what the final review tested and what "doubled" meant

**Sources:** `docs/reviews/2026-09-14-final-review-fable.md` (finding 3), `docs/reviews/2026-09-14-fable-odds.py` (section E), `docs/reviews/2026-09-14-final-review-codex-gpt6-astra.md` (finding 3), ADR-0015 with its amendments, `DECISIONS-2026-09-14.md` OQ-09, OQ-14, OQ-17, OQ-18, and batch 7 items 7-12, 7-13, 7-17.

**Exactly which mechanic the review tested.** Section E of `fable-odds.py` is titled "Titan attack with fixed dice vs dodge (each dodge six cancels one attack six)". It rolls `atk` dice for the Titan, a dodge of 5 dice (unpushed, or Pushed with 1s locked in the Coriolis style) or 8 dice Pushed, and counts a hit when the attack's sixes minus the dodge's sixes are 1 or more. That is opposed cancellation with net 1 or more landing: the owner's proposal, not "any success lands unless dodged". Dice counts tested: 6, 8, and 10 attack dice. Results the review quoted: 8 dice hit a 5-die dodge 49% unpushed and 34% Pushed; 10 dice 58% and 43%.

**What "doubled lethality" was.** Finding 3 reads: "Whether Titan behaviours roll dice is undecided, and it doubles lethality." The body computes the Attention holder's exposure at Tempo 2 over four rounds: eight behaviours, a third of them kill-tier, each landing about half the time, "so one to one and a half Critical Injuries per fight on one soldier, against a target of one per Expedition", with every hit a Critical Injury and no Health buffer, and with "the soldier who dodged card 1 has no turn left for card 2". It then proposes three fixes, the first of which (auto-hit behaviours, a straight Agility Reaction, one Reaction per Titan per round) became ADR-0015. Nothing in the review measures a fixed-Severity alternative; the comparison is between the rolled shape and the PC Critical Injury target of ADR-0014, not between two resolution shapes. "Doubled" is the review's own word for "about twice the target", and ADR-0015 compressed it into "rolled Titan attacks roughly doubled lethality". The Codex Astra review's finding 3 is about the Grab's rescue window under initiative, which ADR-0015's soldier-turn countdown fixed; it says nothing about rolled attacks.

**What became of the Severity shape.** After ADR-0015 the Severity values were tuned by simulation (batches 2 to 5). Today the Medium kill entries are Severity 3, and the reference Rookie (Agility 3, ODM Gear 2, Stress 1, Pushing when short) fails a Severity 3 dodge 79% of the time, a Severity 2 dodge 50%, and a Severity 1 dodge 18% (section 5, table 1). The review's frightening 49% is below today's tuned kill tier. So the sentence in ADR-0015 is true of nothing that was measured against today's rules, and the measurements in section 5 show the opposite sign: at Alien-range dice, opposed cancellation is the gentler shape.

**Separating what is inherent from what was separately fixed.**

| Problem the review raised | Inherent to Titans rolling? | Where it was fixed or kept | Independent of this proposal? |
|---|---|---|---|
| The Attention holder spends a turn per card, so at Tempo 2 they never act | No: a consequence of one Reaction per card | OQ-14: one Reaction per Titan per round, compared with every later card | Yes. One Reaction per round works unchanged with a rolled attack (section 4). Under a rolled attack a whiff needs no Reaction at all, so the holder loses fewer turns, not more (dodges per fight 2.0 today, 1.5 to 1.7 rolled). |
| The Grab counts in the Titan's cards, so a Tempo 3 Titan eats a soldier before anyone acts | No | ADR-0015: the countdown runs on the victim's turns | Yes. The countdown is not a card and has no roll; section 4 says what a devour whiff would do if the owner wants one. |
| Every hit is a Critical Injury with no Health buffer, so hits are deadly | No: ADR-0005, kept on purpose | ADR-0005, amended for Health boxes | Yes. The owner now names the spike as wanted dread. |
| A rolled kill entry lands about half the time against a 5-die dodge | Yes, and it is the point | Tuned away by fixed Severity, then tuned back up to 79% | This is the only part the dice counts govern, and section 5 gives the counts. |
| Attack odds depend on the Titan's dice count, which nothing had set | Yes | Never set; Severity replaced it | Section 5 sets it. |

## 2. Parent games

Pages are the printed page numbers of the two core books in `docs/reference/`; descriptions are paraphrased, and no table is reproduced.

**Alien RPG Evolved.**
- Opposed rolls (p. 44): both sides roll; more successes wins; the passive side may also Push. Combat defence is cancellation, not a straight comparison.
- Defend (p. 62): declared before the attacker rolls; a quick-action interrupt that needs an unspent quick action; each defender success removes one attacker success; if none remain the attack misses; if any remain, base damage plus 1 per remaining success beyond the first. The flowchart on p. 62 spells out the two branches (defend, or a straight roll).
- Dodge (p. 65): the same cancellation against ranged attacks, rolled on Mobility, only if aware of the attacker.
- Xenomorph combat rules (p. 208): no attributes; skills rolled as base dice only; never Push; Speed gives one card per turn; each turn is one signature attack or a move; the signature attack is a D6 roll on the creature's table, re-rolled on a repeat, and "the GM is not bound to always follow the random result"; Xenomorphs never dodge or defend; **their signature attacks can be defended against unless stated otherwise**.
- Signature attack tables (for example Soldier and Sentry, p. 218): each entry carries its own fixed pool ("twelve base dice, base damage 1, armor piercing"; the Headbite ten base dice, and any damage on a human kills outright). Low entries are terror, middle entries control, high entries kill, and several entries chain into the next (a grapple that becomes an automatic bite). Extra successes add damage exactly as a human attack's do. Some entries can be dodged but not defended (Charge), and some cannot be avoided at all.
- Instant death rules (p. 71): a single instance of damage at twice max Health, and named signature attacks.

**Coriolis: The Great Dark.**
- Opposed rolls (p. 49); Block and Dodge (p. 61 and p. 63): declared before the attacker rolls; each defender six eliminates one attacker six; the Block consumes the defender's turn and can be Pushed; the flowcharts on p. 62 and p. 63 give the same two branches as Alien.
- The p. 61 sentence that creature attacks cannot be blocked unless specified, against p. 222's rule that Engaged signature attacks can be blocked and ranged ones dodged: the research file already flags the inconsistency, and ch. 13 is the creature chapter, so p. 222 is the operative rule.
- Creatures in combat (p. 222 to 223): a behavior table for what the creature is doing when met; Ferocity cards; signature attacks rolled with a set number of base dice ("creatures never roll for attributes when performing a signature attack, they always roll the specified number of dice instead"); a base damage and crit threshold like a weapon; never the same attack twice in a row (+1 on the die); despair and Blight attacks cannot be blocked or dodged. The Gargantuan (a 30-Health guardian) sweeps everyone at Short with 9 dice and crushes with 10.

**Does the parents' shape already match the owner's idea?** Yes, on every count: a random table picks the behavior; the behavior carries its own fixed pool, not a skill; the creature never Pushes; the target's Reaction cancels; extra successes worsen the result; some entries kill on any damage. Wings of Freedom's Behavior Tables (ADR-0001) already copy the table half. What ADR-0015 changed was only the second half, replacing the pool with a fixed number the Reaction must meet. Two things the parents do that WoF should not copy: the GM override of the table roll (forbidden by ADR-0003) and Health-buffered damage from creatures (ADR-0005 keeps Titan harm as direct Critical Injuries).

## 3. The owner's reasons, assessed

1. **A lucky roll of many sixes shows how dangerous Titans are.** True, and measurable. At 18 kill dice the Titan scores 3 or more successes 60% of the time and 5 or more 17%; against the Rookie's Pushed dodge the landed net is 2 or more on about 40% of landed hits and 3 or more on 17%. Under the recommended shape each net success beyond the first adds +1 to the 2D6 Critical Injury roll, so a 5-success Bite against a 2-success dodge rolls 2D6+3 on the torso table, where the lethal and instant-death rows begin. That is the spike the owner wants, and ADR-0005 makes it bypass Health by design. The cost is variance: at matched averages, deaths concentrate in fewer, worse cards. Section 5's death rates already include the rider, so the average is tuned with it in.

2. **Seeing the dice makes the danger tactile.** True, with a price. Matching today's lethality needs about 18 dice on a Medium kill entry and 24 on a Large one (section 5), because the Rookie's Pushable 6-die Reaction cancels about 1.8 successes on average. Alien tops out at 12 base dice. Two ways to keep pools Alien-sized without losing lethality: Titan dice that succeed on 5 and 6 (9 dice on 5+ has the same mean as 18 dice on 6, with a narrower spread; an estimate, not measured), or no Push on the Reaction (measured: matches today at about 14 to 16 kill dice, but it removes the player's one lever and is not recommended). The fine sweep in section 5 gives the whole curve, so the owner can pick the pool size and read off the lethality.

3. **Partial defence still helps.** True for humans, and only partly true for Titans. The landing condition of cancellation (net 1 or more) is the same as needs-equals-successes (Reaction successes below the attack's): a Reaction one short of the attack fails in both. What cancellation adds is that every Reaction success still removes one net success from the effect. For a human attack, that is damage: a Block of 2 against a sabre with 3 successes takes 2 damage instead of 4. For a Titan behavior, the effect is a Critical Injury row, a Grab, a knock loose, or Stress, and only the Critical Injury roll can take a graded rider without inventing new tiers, so the partial defence shows there. Option B in section 4 invents the tiers (a glancing net 1) and halves lethality at equal dice, which is the "partial defence" the owner may have in mind; it costs about 22 kill dice to match today.

4. **So the overall difficulty can be pushed harder.** Half true. The dice count is a smooth knob, which today's integer Severity is not (the Medium kill tier can only be 2, 3, or 4, and Severity 2 to 3 is the difference between 0.028 and 0.061 deaths). But the knob is weak per die: each Titan die adds a sixth of a success, and the Rookie cancels about 1.8. Measured, the owner's target B (0.125 PC deaths with two Squadmates on the setup mix) needs about 36 kill dice, a pool no one will roll. Difficulty beyond today's needs a non-dice lever under either shape: Nape Depth, Regeneration, the injury rows, or the hazard table (OQ-140's options b, d, and e). Partial defence does not let difficulty rise at the same death rate: the death rate is the difficulty.

5. **A Titan should be able to whiff, even against a soldier who cannot react (owner addition).** Cheap and worth having. A pool of 6 whiffs 33% of the time, 12 dice 11%, 18 dice 4%. Measured, letting the whiff apply to Down, Grabbed, and Unguarded targets moves the death rate by nothing detectable at any tier (A against A-autoland in section 5, within 2 standard errors everywhere), because a fresh card against a target who cannot react is rare: a Grabbed soldier's Titan holds and resolves nothing, and a Down soldier draws a card only while they still hold Attention. So today's "the behavior lands on them" can become "the behavior lands on them if the Titan rolls at least one success" for free. The devour step is a different question (section 4).

6. **Luck spikes are wanted dread (owner addition).** Taken as given. Every option below keeps the extra-net rider on Critical Injuries, and the dice counts in section 5 are tuned with it in. The only spike this report argues against is the same rider on the Grab, because it does nothing dramatic (a crush that cannot be lethal) and quietly breaks the Grab targets (section 5).

## 4. Design options

Common to all three: the entry's Severity column becomes an **attack dice** column; the Titan rolls once per card, and every target of an area entry compares against the same roll; a Titan never Pushes; a roll of 0 successes is a whiff against everyone, including a soldier who cannot react; the Reaction is unchanged in who may make it, what it spends, its Gear Dice, Help, Covering, and Call It's Bonus Dice; the soldier decides whether to dodge after seeing the Titan's roll (the parents declare before, but Titans never Push, so nothing is lost and the whiff is visible at once); the Reaction may be Pushed, and the soldier Pushes knowing the number to beat.

**One Reaction per Titan per round survives, and gets better.** Today's rule (OQ-14): one dodge per Titan per round, its successes compared with every later behavior from that Titan. Rolled: the dodge is rolled against the first card of that Titan that scores at least one success and that the soldier chooses to answer; its successes are then compared with each later card's roll. Because a whiff needs no Reaction, the Attention holder keeps more turns (measured 1.5 to 1.7 dodges a fight against 2.0 today, and the kill by round 3 up one to three points). The turn-starvation problem the review found is fixed by OQ-14 already; rolling makes it milder.

**Attention and teamwork (ADR-0010) are untouched.** The ladder, flags, decoys, Break Attention, and the promise that a striker who falls short draws the next behavior read Positions and flags, not Severity. Call It still adds 2 Bonus Dice to a comrade's dodge against the Called card; Help still adds a helper's die. One new fact: a Read that reveals the Next Behavior now also reveals its dice count, which is what a soldier "reads" in the canon image.

**The Grab countdown.** Not a card and not an attack; no Severity today, no dice under any option. If the owner wants the devour to be able to whiff (owner addition 1 read widely), the least invasive rule is: at the devour step the Titan rolls the Grab entry's dice, and on 0 successes the jaws miss, the soldier stays Grabbed and lifted, and the step repeats on their next counted turn. Measured in section 5 (rows "devour roll"): at 10 kill dice it lowers the named Grab cell from 33 to 29.5% and the lone Grab from 70 to 67%; at 18 dice by about 1 point. Recommendation: do not add it. The countdown's whole design is that two turns is what a comrade has, and a 4% fumble at 18 dice is not worth a second procedure; the Grab's own roll is where the Titan can whiff.

**The Unguarded row and Down.** "No Reactions" stays what it is; the behavior lands on any Titan success (owner addition 1).

### Option A: cancellation, net 1 lands, extra net worsens (the owner's example)

| Harm type (Chapters 5 and 6) | net 0 (whiff or dodged) | net 1 | net 2 or more |
|---|---|---|---|
| Stress +1 (terrorize) | nothing | +1 Stress | +1 Stress per net success |
| Telegraph | the Next Behavior is still revealed (it is information, not harm) | revealed | revealed |
| Critical Injury, cannot be lethal (Swat, Clutch at the Legs, Thrash) | nothing | the row as written | 2D6 + (net minus 1) on the location table; the cap row still applies |
| Critical Injury, can be lethal (Bite, Headlong Lunge, Trample) | nothing | as written | 2D6 + (net minus 1); an instant-death row kills outright, which is the spike |
| Knock loose (a fall from On Body or Blind Spot) | nothing | the fall as written | the fall as written (a fall is a fall; the band is set by height, Chapter 4) |
| Grab | nothing | Grabbed; the crush as written | Grabbed; **the crush as written, no rider** (section 5 shows why) |
| Falls, fire, human weapons | not Titan attacks; unchanged | | |

Push: yes. One Reaction per round: yes. Humans: Block and Dodge cancel one for one; net 1 or more lands; damage is the weapon's damage plus 1 per net success beyond the first (the Alien and Coriolis rule, p. 62 and p. 61). A foe's Guard dice are its cancelling roll and it never Pushes. Firearms: Dodge only, never Block; the musket at damage 3 puts a Rookie one box from Down at net 1 and Down with a Pierce Critical Injury at net 2, which is the reading 7-17 already gives. An ambushed target cannot React (unchanged).

### Option B: net sets a tier

| Harm type | net 0 | net 1 (glancing) | net 2 (as written) | net 3 or more |
|---|---|---|---|---|
| Stress +1 | nothing | +1 Stress | +1 Stress | +1 per net beyond 2 |
| Critical Injury, cannot be lethal | nothing | +1 Stress only (a glancing blow) | the row as written | 2D6 + (net minus 2) |
| Critical Injury, can be lethal | nothing | the row, but it cannot be lethal (the cap row) | as written | 2D6 + (net minus 2) |
| Knock loose | nothing | knocked loose | knocked loose | knocked loose |
| Grab | nothing | a clutch: +1 Stress and knocked loose | Grabbed, crush as written | Grabbed, crush as written, no rider |

Push and one Reaction per round: as A. Humans: the same as A (a human attack has no tiers to downgrade; damage already scales). This is the option that makes reason 3 literal for Titans: a Reaction one short of the attack turns a Bite into a survivable wound and a Grab into a near miss. Its price is dice: it halves deaths at equal dice (section 5), so matching today's Medium band needs about 22 kill dice, and it adds a third outcome to explain at the table for every entry.

### Option C: rolled Severity (recommended)

The Titan rolls its attack dice; **its successes are the card's Severity**; the Reaction needs that many; each Reaction success beyond that number does nothing and each Titan success beyond the Reaction's adds +1 to the Critical Injury roll. This is Option A stated in the sentence ADR-0018 already uses for human attacks ("the attack's successes are its Severity, and it lands unless the target's Reaction scores that many successes"), so:

- the landing condition is identical to A's (a Reaction with fewer successes than the attack fails; one with equal or more avoids it), and section 5's Option A rows measure it exactly;
- the extra-net rider is the same as A's, on Critical Injuries only, never on a Grab;
- the human rules of ADR-0018 need no reshaping: humans and Titans now share one sentence, and a Block against a sabre reduces its extras the same way (ADR-0018's "damage plus 1 per success beyond the first" is read on the successes beyond the Reaction's, which is the Alien rule);
- Chapter 1 section 1.1 item 5 can stay true as written or go: no pool is "set against" another to decide a winner; the attack's roll sets a number, and the Reaction needs it, exactly as a human attack does today. This report recommends deleting the item anyway, because it was a scope note from `docs/reviews/01-core-rules-review-1.md` (which offered "state Phase 1 has no opposed rolls, or give the two-line procedure"), not a principle, and keeping a sentence that has to be explained is worse than a two-line procedure.

Effects by net for C are the A table above. Rolling and Pushing order at the table: the GM rolls the Titan's dice in the open (the "GM only" section of the packet keeps the hidden Next Behavior; the dice are rolled when the card comes up), announces the successes, and each target decides; a target Pushes knowing the number.

**A measured variant:** Titan dice that succeed on 5 and 6, at half the counts (3/6/9 on the Medium, 12 on a Large kill). Same mean as 6/12/18 on sixes, narrower spread (9 dice on 5+ whiff 2.6% against 3.8% for 18 on sixes; fewer 5-success spikes: 14% against 17%). Measured in section 5b: the Medium band 0.052 during and 0.059 through the end, the first-Titan-Engagement row 0.094, the setup mix 0.079, the Large 0.150 (against 0.185 today, the one row that reads lower, since the spikes are rarer). It keeps pools inside Alien's range and needs a different-coloured Titan die, which the packet's GM tables can print.

## 5. Measurement

**Method.** Throwaway scripts in the scratchpad import the snapshot's `tools/sim` modules and monkeypatch `engine.Fight.titan_card` (the card resolution), `engine.Fight.grabbed_turn` (only for the devour-roll variant), the Grab-cell trial, and the crush's Critical Injury roll (for the rider). Everything else, policies, Fear Rolls, Death Rolls, the retreat clock, end steps, the interim setup rows, is the committed engine. Dice are keyed to today's Severity value of each entry (1, 2, 3, or 4), so one dice map covers every table: the Medium's tiers are 1/2/3, the Large's 2/3/4, the Small's 1/2/2. "During" is deaths during the fight; "end" is deaths through the end of the Titan Engagement (the batch 5 reading that binds the Medium band). Fixed seeds; 6,000 fights a row (standard error about 0.003 to 0.004 on a Medium death rate) and 20,000 Grab trials a cell (about 0.33 points). Today's rows were re-run on the same seeds and agree with the committed figures within sampling (Medium band 0.054 during and 0.061 end against the committed 0.050 and 0.057; the named Grab cell 33.6 against 33.2).

### Table 1. Per-card landing odds (analytic, 60,000 trials a cell, Stress Responses left out)

Reference Rookie dodge: Agility 3, ODM Gear 2, Stress 1, Pushing when short (Gear Dice never re-roll).

| Today's Severity | lands on the Rookie | on a Levi-grade soldier (9 dice) |
|---|---|---|
| 1 | 0.18 | 0.10 |
| 2 | 0.50 | 0.34 |
| 3 | 0.79 | 0.62 |
| 4 | 0.94 | 0.83 |

| Titan dice (sixes) | whiff | lands on the Rookie | net 2 or more | net 3 or more | lands on a soldier who cannot react |
|---|---|---|---|---|---|
| 5 | 0.40 | 0.18 | 0.05 | 0.01 | 0.60 |
| 8 | 0.23 | 0.31 | 0.12 | 0.04 | 0.77 |
| 10 | 0.16 | 0.39 | 0.19 | 0.07 | 0.84 |
| 12 | 0.11 | 0.47 | 0.26 | 0.11 | 0.89 |
| 14 | 0.08 | 0.55 | 0.33 | 0.16 | 0.92 |
| 18 (extrapolated) | 0.04 | about 0.66 | about 0.45 | about 0.25 | 0.96 |

Reading: a terrorize entry at 5 dice matches today's Severity 1; a control entry at about 13 dice matches Severity 2; no Alien-range pool matches Severity 3's 79% against a Pushed Rookie. The unpushed Rookie (turn already spent, or a Stress Die 1) is hit 45% at 8 dice and 54% at 10, against 74% and 94% for Severity 2 and 3 today. This is why the fights match at fewer dice than the per-card odds suggest: in a fight the dodge is often unpushable, Squadmates never Push, and the rider adds harm.

### Table 2. Full fights at matched and Alien-like dice (6,000 fights a row)

Deaths per fight; "PC end" is player-character deaths through the end with 2 helper Squadmates.

| Shape | dice (terr/ctrl/kill/Large kill) | Medium 4 PCs: during | end | CIs | Grabs | kill by 3 | Medium + 2 Squadmates: PC end | first-Titan-Engagement row: end | setup mix, 4 PCs alone: end | setup mix, PC end with 2 Squadmates |
|---|---|---|---|---|---|---|---|---|---|---|
| **today (Severity 1/2/3, Large 2/3/4)** | n/a | **0.054** | **0.061** | 0.70 | 0.22 | 61.6% | **0.018** | **0.083** | **0.083** | **0.023** |
| A | 4/6/8/10 | 0.013 | 0.014 | 0.25 | 0.08 | 65.8% | 0.006 | 0.025 | 0.018 | 0.007 |
| A | 5/8/10/12 (Alien-like) | 0.018 | 0.022 | 0.33 | 0.10 | 64.1% | 0.011 | 0.038 | 0.031 | 0.012 |
| A | 5/9/14/19 | 0.041 | 0.047 | 0.47 | 0.15 | 63.2% | 0.019 | 0.051 | 0.053 | 0.018 |
| A | 5/11/16/21 | 0.043 | 0.050 | 0.54 | 0.17 | 63.6% | 0.024 | 0.066 | 0.069 | 0.025 |
| **A** | **6/12/18/24** | **0.062** | **0.069** | 0.60 | 0.18 | 62.0% | **0.031** | **0.088** | **0.083** | **0.030** |
| A | 7/13/20/27 | 0.084 | 0.089 | 0.66 | 0.20 | 61.4% | 0.035 | 0.114 | 0.107 | 0.037 |
| A | 8/16/24/32 | 0.114 | 0.126 | 0.81 | 0.24 | 59.9% | 0.057 | 0.172 | 0.151 | 0.056 |
| A | 10/20/30/40 | 0.179 | 0.197 | 0.92 | 0.28 | 60.7% | 0.083 | 0.238 | 0.217 | 0.079 |
| A | 12/24/36/48 | 0.246 | 0.261 | 1.03 | 0.30 | 59.3% | 0.133 | 0.332 | 0.301 | **0.119** |
| A, no Push on the Reaction | 5/9/14/19 | 0.046 | 0.052 | 0.58 | 0.17 | 62.9% | 0.025 | 0.071 | 0.068 | 0.025 |
| A, no Push on the Reaction | 5/11/16/21 | 0.070 | 0.077 | 0.68 | 0.19 | 62.0% | 0.033 | 0.089 | 0.094 | 0.033 |
| A, no Push on the Reaction | 12/24/36/48 | 0.268 | 0.289 | 1.09 | 0.31 | 60.3% | 0.138 | 0.379 | 0.330 | 0.128 |
| B | 5/8/10/12 | 0.013 | 0.014 | 0.23 | 0.05 | 65.3% | 0.006 | 0.018 | 0.016 | 0.006 |
| B | 6/12/18/24 | 0.037 | 0.042 | 0.46 | 0.13 | 64.2% | 0.018 | 0.053 | 0.047 | 0.017 |
| B | 7/15/22/29 | 0.055 | 0.062 | 0.58 | 0.14 | 62.9% | 0.028 | 0.097 | 0.083 | 0.027 |
| B | 8/16/24/32 | 0.083 | 0.090 | 0.67 | 0.19 | 60.1% | 0.035 | 0.118 | 0.105 | 0.035 |
| B | 12/24/36/48 | 0.191 | 0.206 | 0.96 | 0.24 | 60.2% | 0.087 | 0.270 | 0.222 | 0.080 |

Standard errors: about 0.004 on a Medium 4-PC death rate, 0.002 to 0.003 on a helper row. The kill median is 3 in every row. The Large reference row at 6/12/18/24 gives 0.163 during and 0.172 end against 0.172 and 0.185 today; the Small 0.051 and 0.063 against 0.045 and 0.055; the Sprinting Abnormal 0.088 and 0.099 against 0.095 and 0.106. So one dice map keyed to today's Severity values reproduces every table's lethality at once.

**Findings.**
- **At matched dice counts (Alien-like 5/8/10), Option A gives about a third of today's deaths and half of today's Critical Injuries.** The 2026-09-14 finding does not transfer.
- **Today's targets are met by Option A at about 6/12/18 (Large kill 24):** the Medium band (0.062 during, 0.069 end, against 0.054 and 0.061 today and the batch 7 limit of 0.06 through the end; 5/11/16 sits at 0.043 and 0.050, so the matching count is about 17), the first-Titan-Engagement row (0.088 against 0.083), and the setup mix (0.083 against 0.083). Option B needs about 7/15/22.
- **Target B (0.125 PC deaths a fight, 4 PCs and 2 Squadmates, setup mix) is reached by Option A only at about 36 kill dice** (0.119 at 12/24/36; 0.128 at 12/24/36 with no Push), and by Option B not before 40. That is not a rollable pool. B needs a lever other than dice under any shape, as OQ-140's options already list.
- **The whiff against soldiers who cannot react changes nothing measurable**: A against A with today's auto-land, at every tier, within 2 standard errors (for example 0.062 against 0.068 at 6/12/18, 0.018 against 0.020 at 5/8/10).
- **Fewer Reactions and slightly faster kills**: dodges per fight 1.5 to 1.7 against 2.0; the kill by round 3 up one to three points; Grabs per fight down with the dice count (0.18 at 6/12/18 against 0.22 today), since a Grab must now roll.
- **Removing the Push from the Reaction** matches today at about 14 to 16 kill dice instead of 17; it is not recommended, because the Push is the player's one lever and the source of the Jam test's meaning.

### Table 3. The Grab: the six cells and the lone Grab (20,000 trials a cell, standard Medium)

Target: the Stress 2, Grief 0 cell 28.3 to 38.3%; every cell under 50%; alone 61.7 to 71.7%.

| Shape | dice | S1 G0 | **S2 G0** | S3 G0 | S1 G1 | S2 G1 | S3 G1 | alone |
|---|---|---|---|---|---|---|---|---|
| **today** | n/a | 28.7 | **33.6** | 39.7 | 34.6 | 39.4 | 44.7 | **69.5** |
| A with the crush rider | 5/8/10/12 | 30.2 | 35.8 | 42.1 | 35.9 | 42.2 | 47.4 | 73.6 (miss) |
| A with the crush rider | 6/12/18/24 | 32.3 | 37.1 | 44.0 | 37.6 | 44.2 | **50.7 (miss)** | 78.1 (miss) |
| **A, Grab takes no rider** | 5/8/10/12 | 28.1 | **33.3** | 39.4 | 33.8 | 40.0 | 45.1 | **70.2** |
| **A, Grab takes no rider** | 6/12/18/24 | 28.8 | **33.4** | 39.1 | 34.3 | 39.7 | 44.9 | **69.1** |
| A, no rider, devour can whiff | 5/8/10/12 | 25.0 | 29.5 | 34.8 | 30.3 | 34.8 | 40.1 | 66.8 |
| A, no rider, devour can whiff | 6/12/18/24 | 27.8 | 32.9 | 38.5 | 32.9 | 40.1 | 43.8 | 68.8 |
| B, Grab takes no rider | 6/12/18/24 | 29.1 | 33.8 | 39.2 | 33.6 | 40.3 | 45.0 | 69.8 |

**Findings.** The Grab cells do not depend on how the Grab landed; they depend on the crush and the rescue. With the extra-net rider on the crush the victim is Down in the hand more often (a Down soldier cannot Break Free), the lone Grab misses its band at every tier, and the worst cell crosses 50% at the matched count. With no rider on the Grab, every cell and the lone figure sit within sampling of today's, at every dice count. The devour whiff lowers the named cell by 4 points at 10 dice and 0.7 at 18 (a 16% and a 4% fumble per step).

## 5b. Option D: Coriolis damage and crit threshold

Added after the owner asked for one more shape to be measured: Titan attacks that work like Coriolis weapons, so that base damage and a crit threshold carry the lethality and pools stay small. The Coriolis rules, checked in the TGD PDF: a hit deals base damage plus 1 per success beyond the first (p. 61 to 63); Block and Dodge cancel successes one for one, so every cancelled extra also removes 1 damage (p. 61, p. 63); armor and cover roll gear dice equal to their rating against the damage and each six removes 1 (p. 65); a single instance of damage that, after reductions, equals or exceeds the weapon's crit threshold causes a critical injury, which does not itself break you (p. 66); 0 Health is broken, being broken by damage is not fatal, only critical injuries kill, and any damage while broken is an automatic crit (p. 65 to 66); creatures roll a fixed pool with a base damage and crit threshold per signature attack (p. 222; the Blight Crawlers' Crystal Storm on p. 224 is 8 base dice, damage 1, crit 3). The p. 61 and p. 222 disagreement on blocking creature attacks is as section 2 says.

### The shape

- **Entries.** Every harming Behavior Table entry carries attack dice, a base damage, and a crit threshold, in place of Severity. Its Injury Location and Injury Type stay (the crit's Critical Injury takes them; a Bite's crit is Bite and carries WP-C's rider; a Swat's is Crush). Terrorize entries carry dice only (their effect is Stress). The Titan rolls once per card in the open; 0 successes whiffs against everyone; Titans never Push.
- **Reaction.** Unchanged: Agility with ODM Gear or the horse, Help, Covering, Call It, Pushable with the number known, one per Titan per round compared with every later card. Each Reaction success cancels one Titan success; net 1 or more lands.
- **Damage.** A landed harming entry deals base damage plus 1 per net success beyond the first, as damage in Chapter 3's sense (`health.yaml`, `damage`): it marks Health boxes; if it brings current Health to 0 the soldier is Down and gains a Critical Injury at once; damage taken at 0 inflicts one. **Crit:** if the damage of one hit reaches the entry's crit threshold, the hit inflicts a Critical Injury at the entry's location and type even with Health left. One Critical Injury per hit at most (the threshold, reaching 0, or being at 0 all give the same one), with the entry's cannot-be-lethal flag as today (control-tier crits cannot be lethal, kill-tier crits can). A day passing restores Health lost to damage, as today.
- **Grab.** Lands on net 1 or more; the crush is exactly today's torso Crush Critical Injury that cannot be lethal, with no damage and no rider, because the Grab's harm is the countdown (ADR-0015) and section 5 showed that any rider on the Grab breaks the six cells and the lone figure. Break Free, the lift, and the devour are unchanged.
- **Knock loose and falls.** Unchanged: knocked loose on net 1 or more; a fall is damage by Chapter 4's band table, which already runs through the same damage pipeline, so a fall and a Swat are now the same kind of harm.
- **Spikes.** Kept: a 5-success Bite against a 2-success dodge deals base plus 3, which reaches the threshold and crits, and puts a Rookie Down in one hit if the damage is 4 or more. Nothing damps it.
- **Unification with ADR-0018.** Complete: a Titan's Bite, a sabre, and a fall all deal typed damage that marks boxes, Downs at 0, and crosses to the Critical Injury tables at 0; the only Titan-specific step is the crit threshold, which a musket could carry too (Coriolis gives every weapon one). Armor does not exist in WoF, so the p. 65 gear-dice roll has no home; a cloak or a horse could be given one later.

**What D amends, and why ADR-0005 resists it.** ADR-0005's founding reason is that Titan attacks skip Health "and stop a soldier from shrugging off a Titan's swat because they happen to have Health left", keeping Titan World's body-part injuries with one tracked number. The owner's Health boxes decision (DECISIONS, step 2) then made Health a row of boxes that untreated Critical Injuries cross off and damage marks, with 0 as Down, and left Titan attacks causing no Health loss of their own. Option D is exactly the shrugged-off swat: a Rookie with Health 4 takes a control-tier hit at damage 1 as a marked box and nothing else three times before anything reaches the tables, unless the threshold is set so low that every hit crits, at which point D is Option C plus bookkeeping. The measurements below show what that means in numbers: on this engine, Titan lethality lives in the Critical Injury tables (lethal rows with Death Rolls, instant-death rows through worsening, and the devour), not in Health, and damage that does not reach a crit kills nobody.

### Measurements (6,000 fights a row, same seeds and rows as Table 2)

Sweep: dice 3/5/7 (Large kill 9), 4/6/8 (10), and 5/8/10 (12), by Severity value as before; control (damage, threshold) in {(1,2), (1,3), (2,3)}; kill in {(2,2), (2,3), (3,3), (3,4), (4,3)}; 45 settings, 405 fight rows, seeds 900000+. The Grab cells are unchanged by construction (the Grab lands as Option C with no rider, Table 3). "Hits" are landed Critical Injury entries on the Medium; "boxes per hit" is current Health before minus after (a crossed-off box or a marked one), with its standard deviation across hits; "P(death per hit)" is a hit that kills outright.

| Setting (dice; control d/c; kill d/c) | Medium: during | end | CIs | Grabs | first row: end | Small: end | Large: end | Abnormal: end | mix alone: end | mix, PC end with 2 Squadmates | hits per fight | boxes per hit, mean (SD) | P(crit per hit) | P(death per hit) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **today** | **0.054** | **0.061** | 0.70 | 0.22 | **0.083** | 0.055 | 0.185 | 0.106 | **0.083** | **0.023** | | | | |
| **C, sixes, 6/12/18/24** | 0.055 | 0.061 | 0.59 | 0.18 | 0.086 | 0.061 | 0.158 | 0.104 | 0.081 | 0.034 | 0.33 | 1.05 (0.36) | 1.00 | 0.016 |
| **C, 5+, 3/6/9/12** | 0.052 | 0.059 | 0.60 | 0.18 | 0.094 | 0.066 | 0.150 | 0.092 | 0.079 | 0.030 | 0.33 | 1.02 (0.22) | 1.00 | 0.004 |
| C, 5+, 3/5/8/11 | 0.051 | 0.059 | 0.55 | 0.18 | 0.066 | 0.042 | 0.142 | 0.078 | 0.069 | 0.022 | 0.29 | 1.02 (0.24) | 1.00 | 0.007 |
| D 3/5/7/9; 1/2; 2/2 | 0.009 | 0.010 | 0.18 | 0.07 | 0.016 | 0.009 | 0.031 | 0.011 | 0.014 | 0.005 | 0.12 | 2.60 (1.13) | 0.72 | 0.000 |
| D 3/5/7/9; 2/3; 4/3 | 0.012 | 0.013 | 0.18 | 0.07 | 0.018 | 0.009 | 0.042 | 0.015 | 0.017 | 0.006 | 0.13 | 3.38 (0.94) | 0.74 | 0.000 |
| D 4/6/8/10; 1/2; 2/2 | 0.011 | 0.012 | 0.19 | 0.07 | 0.023 | 0.012 | 0.037 | 0.023 | 0.017 | 0.006 | 0.13 | 2.71 (1.15) | 0.74 | 0.000 |
| D 4/6/8/10; 1/3; 3/3 | 0.012 | 0.014 | 0.19 | 0.08 | 0.026 | 0.020 | 0.030 | 0.027 | 0.020 | 0.008 | 0.15 | 2.80 (1.36) | 0.60 | 0.000 |
| **D 4/6/8/10; 1/3; 4/3 (best at 8 dice)** | **0.014** | **0.015** | 0.20 | 0.08 | **0.020** | 0.014 | 0.034 | 0.028 | **0.019** | **0.008** | 0.15 | 2.89 (1.37) | 0.64 | 0.000 |
| D 4/6/8/10; 2/3; 3/3 | 0.011 | 0.013 | 0.21 | 0.08 | 0.025 | 0.019 | 0.055 | 0.030 | 0.024 | 0.008 | 0.15 | 3.35 (0.95) | 0.72 | 0.000 |
| D 5/8/10/12; 1/2; 3/3 | 0.025 | 0.027 | 0.29 | 0.11 | 0.035 | 0.043 | 0.063 | 0.055 | 0.040 | 0.012 | 0.19 | 2.96 (1.33) | 0.73 | 0.000 |
| **D 5/8/10/12; 2/3; 3/3 (best at 10 dice)** | **0.029** | **0.032** | 0.30 | 0.11 | **0.034** | 0.037 | 0.087 | 0.067 | **0.046** | **0.013** | 0.20 | 3.38 (0.95) | 0.76 | 0.000 |
| D 5/8/10/12; 2/3; 4/3 | 0.027 | 0.030 | 0.29 | 0.11 | 0.048 | 0.035 | 0.092 | 0.054 | 0.044 | 0.014 | 0.19 | 3.34 (0.98) | 0.75 | 0.000 |

The full 45-row table is in `opposed-d.log` in the scratchpad. Across all 45 settings the Medium death rate spans 0.005 to 0.029 during the fight (0.006 to 0.032 through the end); the 15 settings at 7 dice span 0.005 to 0.012, the 15 at 8 dice 0.010 to 0.014, and the 15 at 10 dice 0.016 to 0.029.

**Findings.**
- **No Option D setting at 8 dice or fewer comes within a quarter of today's Medium band**; the best (4/6/8, control 1/3, kill 4/3) gives 0.014 during and 0.015 through the end against 0.054 and 0.061, the first-Titan-Engagement row 0.020 against 0.083, and the setup mix 0.019 against 0.083. At 10 dice the best reaches half (0.029 and 0.032). Small, Large, and Abnormal rows sit at a fifth to a third of today's at every setting. Target B is not approached: the mix with two Squadmates gives 0.004 to 0.014 PC deaths against 0.125.
- **Damage and threshold are nearly inert as lethality knobs.** At fixed dice, moving kill damage from 2 to 4 and the threshold from 3 to 2 moves the Medium band by at most 0.005, within 2 to 3 standard errors, while moving dice from 7 to 10 doubles it. The reason is structural: a Titan hit kills only through the Critical Injury tables (a lethal row's Death Roll, an instant-death total reached through worsening, or the devour), never through Health; damage that does not crit Downs a soldier and kills nobody; and the threshold can at most make every landed hit a crit, which is what Option C already does at net 1. So D's ceiling at k dice is Option C at k dice plus Down states, and Option C at 8 to 10 dice is a fifth to a third of today (Table 2). Base damage cannot substitute for landing rate.
- **"More stable" is not borne out.** Per landed hit, Option C at 6/12/18 costs 1.05 boxes with a standard deviation of 0.36 (a hit is one crossed-off box, sometimes none when every box is gone), and kills outright 1.6% of the time through the rider; the 5+ variant costs 1.02 (0.22) and kills outright 0.4%. Option D's best settings cost 2.9 to 3.4 boxes a hit with a standard deviation of 0.9 to 1.4, on a Rookie with 4 boxes, and land a third as many hits a fight (0.13 to 0.20 against 0.33). D concentrates the same Health into fewer, heavier hits: the spread per hit is three to four times C's, and the whiff rate at 8 dice (23%) is six times the rate at 18 (4%). Per fight, the death rate's spread is set by the death rate itself (a Bernoulli variance), and D's is lower only because its mean is lower.
- **What D changes at the table.** More Down soldiers (a Rookie is Down after two control hits at damage 2, or one kill hit at damage 4), which the engine turns into more turns lost and more Down-soldier auto-crits, yet fewer deaths, because Down soldiers are carried out at the retreat and Death Rolls are what kill. That is the profile ADR-0005 was written to avoid: Health absorbing Titan harm.
- **The one way D could match today at 8 dice** is Alien's Headbite rule: a kill-tier hit that crits kills outright, or damage at twice max Health kills (Alien p. 71). That is not a damage-and-threshold shape any more; it is "a landed Bite is death", which at 8 dice lands 31% of the time against a Pushed Rookie and would put the Medium band far above today's with no Death Roll. It was not measured because it is a different design question, and it is listed as an owner question below.

### Verdict: C against D

| | Option C (rolled Severity, Critical Injury rider) | Option D (damage and crit threshold) |
|---|---|---|
| Table feel | One number per entry (dice), one open roll, one comparison; the outcome is a row on the location table, as today | Three numbers per entry; the same roll and comparison, then damage arithmetic, box marking, and a threshold check; Down more often; the Critical Injury reached less often |
| Pool size | 18 kill dice on sixes, or 9 on 5+ (measured: 3/6/9/12 on 5+ reproduces today's Medium band, mix, and first row; the Large reads 0.150 against 0.185) | 8 dice or fewer cannot reach today's lethality; 10 dice reaches half |
| Lethality control | One knob (dice), and it works: 8 to 36 kill dice spans 0.013 to 0.26 deaths a fight | Three knobs, of which two barely move deaths; dice still decide |
| Luck | A 5-success Bite rolls 2D6+3 on the torso table; instant death possible | A 5-success Bite deals base plus 3 and crits; instant death only through worsening, since there is no rider on the crit's roll |
| Grab, falls, knock loose, Injury Types, Bite rider | Unchanged | Unchanged (the Grab must keep its Critical Injury crush) |
| ADR-0005 | One sentence (the rider) | Amended in substance: Titan attacks deal Health damage; the founding reason is reversed |
| ADR-0014 | Severity re-read as dice; every band re-measured (holds at the matched counts) | The same, plus every Health-dependent row (the Health 3, 2, 5, 6 reports) becomes a tuned row, since Health now absorbs Titan harm |
| ADR-0015 | Superseded by one new ADR | The same |
| ADR-0018 | First sentence superseded; the human rule becomes the shared sentence | Fully unified with the human damage pipeline (the genuine gain) |
| Chapter 3 | 3.1's one sentence and the example | The Titan attack paragraph, the damage kind's `named_by`, Down's frequency, the treatment and healing figures, the example |
| Chapter 5 | 5.5, 5.9, 5.13 | The same |
| Chapter 6 | One column per stat block | Three columns per stat block and a design note per entry on damage and threshold |
| Simulator | `titan_card`, the dodge and Jam families | The same plus the damage pipeline in `titan_card`, and the Health rows re-read as tuned |
| Effort | One to two agent-days | Three to four, and a retune that the sweep says cannot land at small pools |

**Recommendation.** Option C, with the 5+ Titan die at 3/6/9/12 if the owner wants pools inside Alien's range (now measured, not estimated). Option D does not deliver its premise on this engine: damage and threshold do not carry lethality, the Critical Injury tables do, and reaching them still needs the landing rate that only dice give. D also reverses ADR-0005 for no measured gain and adds arithmetic to every hit. Its one real benefit, a single harm pipeline for Titans and humans, is available under C at the level that matters: humans and Titans share the Reaction sentence and the extras rule, and both cross to the same tables by type.

**Owner questions Option D raises.**
1. If small pools are the goal, is the 5+ Titan die (3/6/9 on the Medium, 12 on a Large kill) acceptable? It is measured to reproduce today's lethality with a narrower spread than 18 dice on sixes.
2. Is a Titan hit that marks Health boxes without reaching the tables wanted at all? ADR-0005 says no, and the owner's Health boxes decision kept Titan attacks off Health. D needs that reversed.
3. Would the owner accept Alien's Headbite rule (a landed kill-tier hit kills outright, no Death Roll) to make 8-dice pools deadly? It is the only route to today's lethality at that pool size, and it removes the Death Roll from the deaths it causes. It can be measured on request.

## Round 3: Health size, crit box loss, and C/D hybrids

Added after the owner said they are interested in both C and D. Fixed for every rolled model in this round, as the owner answered: Titan dice succeed on 5 and 6, in pools of 3, 6, or 9; +1 to the Critical Injury roll per extra net success (on a C crit and on a D threshold crit alike); the devour step always lands; luck spikes stay; 0 successes whiffs against anyone. Same scratch copy, same engine, fixed seeds.

**Pool mapping.** The sweep keyed the three pools to today's Severity values (1 to 3, 2 to 6, 3 and 4 to 9), which keeps the Large Titan's control tier at the big pool and caps its kill tier at 9. Keying them to tiers instead (terrorize 3, control 6, kill 9 on every table) makes the three Size Classes roll the same pools, and then only damage and threshold (D and the hybrid) or a fourth pool of 12 can make a Large Titan deadlier than a Medium one. Both readings were measured on the Large row for the finalists (Table R3-3).

**Pruning.** One sweep of 594 fight rows (66 settings over the nine rows, 6,000 fights each, seeds 1000000+): Option C on 5+ at Health 4, 3, and 6; Option D at Health 4 and 3 over control (damage, threshold) in {(1,2), (1,3), (2,2), (2,3)} and kill in {(2,2), (3,2), (3,3), (4,3), (4,4)}; Option D at Health 6 over control {(2,3), (2,4), (3,4)} and kill {(4,4), (5,4), (6,4), (6,5)}; the hybrid at every control setting with the kill tier as C. Health 3 stands for both "flat 3" and "half rounded down" (identical for the Rookie, whose Strength 4 and Agility 3 give 3.5). Health 6 is a flat 6 in the model; a formula that gives it is Strength plus Agility minus 1 (Rookie 6, Veteran 7, Levi-grade 9). Then the Grab cells at each Health (20,000 trials a cell, seeds 1100000+), six sequences (2 sessions of 2 fights with the interim day between, the helper Squad, 3,000 sequences each, seeds 1200000+), and the Large-row mapping check (seeds 1300000+). Kill damage and threshold were pruned first, because at every Health they moved the Medium band by less than 0.02 (Table R3-1), which left Health and the control tier as the live knobs.

### Table R3-1. Health size under each shape (Medium, 4 Rookie PCs; 5+ dice at 3/6/9; Large kill capped at 9)

| Shape | Medium: during | end | CIs | first-Titan-Engagement row: end | Medium + 2 Squadmates: PC end | Small: end | Large: end | Abnormal: end | setup mix, alone: end | setup mix, PC end with 2 Squadmates |
|---|---|---|---|---|---|---|---|---|---|---|
| **today (Health 4, Severity)** | **0.054** | **0.061** | 0.70 | **0.083** | 0.018 | 0.055 | 0.185 | 0.106 | **0.083** | **0.023** |
| C 5+, Health 4 | 0.050 | 0.058 | 0.60 | 0.082 | 0.026 | 0.053 | 0.154 | 0.099 | 0.076 | 0.028 |
| C 5+, Health 3 | 0.106 | 0.121 | 0.83 | 0.166 | 0.045 | 0.124 | 0.245 | 0.183 | 0.148 | 0.045 |
| C 5+, Health 6 | 0.046 | 0.052 | 0.56 | 0.068 | 0.028 | 0.043 | 0.042 | 0.078 | 0.050 | 0.023 |
| D, Health 4, all 20 settings | 0.078 to 0.115 | 0.086 to 0.124 | 0.52 to 0.64 | 0.109 to 0.152 | 0.029 to 0.041 | 0.088 to 0.143 | 0.236 to 0.334 | 0.119 to 0.167 | 0.115 to 0.161 | 0.035 to 0.048 |
| D, Health 4, control 1/2, kill 2/2 (the mildest) | 0.078 | 0.086 | 0.57 | 0.109 | 0.029 | 0.088 | 0.238 | 0.128 | 0.115 | 0.035 |
| D, Health 3, all 20 settings | 0.167 to 0.229 | 0.179 to 0.242 | 0.71 to 0.86 | 0.224 to 0.300 | 0.056 to 0.086 | 0.175 to 0.243 | 0.391 to 0.586 | 0.209 to 0.278 | 0.219 to 0.296 | 0.066 to 0.105 |
| D, Health 6, all 12 settings | 0.060 to 0.067 | 0.065 to 0.074 | 0.45 to 0.50 | 0.084 to 0.111 | 0.025 to 0.034 | 0.062 to 0.099 | 0.065 to 0.105 | 0.081 to 0.116 | 0.069 to 0.089 | 0.023 to 0.030 |
| **D, Health 6, control 2/3, kill 4/4 (best D)** | **0.060** | **0.065** | 0.49 | **0.085** | 0.029 | 0.062 | 0.082 | 0.090 | **0.069** | **0.025** |
| Hybrid, Health 4, control 1/2, kill C (best hybrid) | **0.057** | **0.064** | 0.56 | **0.094** | 0.031 | 0.065 | 0.261 | 0.100 | 0.100 | 0.030 |
| Hybrid, Health 4, control 1/3 | 0.064 | 0.074 | 0.53 | 0.091 | 0.026 | 0.060 | 0.235 | 0.106 | 0.099 | 0.032 |
| Hybrid, Health 4, control 2/2 or 2/3 | 0.067 to 0.070 | 0.073 to 0.078 | 0.56 to 0.62 | 0.103 to 0.111 | 0.029 to 0.032 | 0.070 to 0.093 | 0.307 to 0.324 | 0.113 to 0.117 | 0.119 to 0.122 | 0.039 |
| Hybrid, Health 3, any control | 0.110 to 0.160 | 0.125 to 0.173 | 0.72 to 0.83 | 0.171 to 0.203 | 0.043 to 0.062 | 0.122 to 0.175 | 0.417 to 0.580 | 0.164 to 0.219 | 0.176 to 0.245 | 0.054 to 0.085 |
| Hybrid, Health 6, control 2/4 | 0.049 | 0.055 | 0.45 | 0.065 | 0.026 | 0.038 | 0.076 | 0.069 | 0.054 | 0.021 |

Standard errors: about 0.004 on a Medium 4-PC rate, up to 0.010 on the Health 3 rows. The kill median is 3 in every row and the kill by round 3 sits at 61 to 64% everywhere. The Grab cells are the same at every Health (Table R3-2).

**Findings on Health size.**
- **Under C the size of Health is a lethality dial with a wide dead band.** Health 3 doubles today's deaths (0.106 against 0.054) because a Rookie is Down after three untreated injuries instead of four; Health 6 lowers them by a tenth (0.046), since Titan harm never touches Health under C and the only effect is how many injuries fit before Down. Today's formula is the one C reproduces.
- **Under D with the owner's fixed pools, Health 4 overshoots and nothing in damage or threshold brings it back.** All 20 Health 4 settings sit between 0.078 and 0.115 on the Medium band (today 0.054), because the 9-die 5+ pool lands as often as 18 dice on sixes did, every landed kill hit now crits with the rider, and the damage on top Downs a 4-box Rookie once in eight fights (the "downs by damage" column in the raw table, 0.12 to 0.25 a fight). The knobs that were nearly inert in section 5b are still nearly inert: the whole 20-setting range is 0.04 wide. With the pools fixed, D's only working dial is Health itself.
- **Health 3 under D or the hybrid is three to four times today's lethality** (0.17 to 0.23; 0.11 to 0.16) and is ruled out by the numbers.
- **D reaches today's band at Health 6 with about double base damage** (control 2, kill 4, thresholds 3 and 4): Medium 0.060 and 0.065, the first-Titan-Engagement row 0.085, the setup mix 0.069, PC deaths with two Squadmates 0.029 on the Medium and 0.025 on the mix. Its Large row is a third of today's at any mapping (Table R3-3), because a 6-box Rookie absorbs the Large's control damage that used to be a lethal-capable injury.
- **The hybrid reaches today's Medium band at Health 4 with control damage 1 and threshold 2** (0.057 and 0.064) and its first-Titan-Engagement row reads 0.094 against 0.083. Its Large row is the problem: with the Large's control tier on the 9 pool, damage 1 plus extras into 4 boxes gives 0.261 (today 0.185); with tier-keyed pools it gives 0.118. Either the Large gets its own control damage (0 with a threshold, so its swat crits or misses, which is C) or the mapping is chosen for it.
- **Target B is not approached by any finalist:** 0.025 to 0.031 PC deaths a fight on the mix with two Squadmates against 0.125 (D at Health 4 reaches 0.035 to 0.048, D at Health 3 up to 0.105 at three to four times today's PC-alone rate, which is not a trade the owner asked for). The conclusion of section 5 stands under every shape: B needs a lever outside the attack roll.

### Table R3-2. The Grab cells by Health (C on 5+ with no rider; identical for D and the hybrid, whose Grab is the same)

| Health | S1 G0 | S2 G0 (target 28.3 to 38.3) | S3 G0 | S1 G1 | S2 G1 | S3 G1 | alone (61.7 to 71.7) |
|---|---|---|---|---|---|---|---|
| 4 (today's formula) | 28.0 | 33.3 | 39.8 | 33.9 | 40.0 | 44.5 | 69.8 |
| 3 | 28.9 | 33.7 | 39.7 | 33.7 | 39.7 | 45.2 | 70.3 |
| 6 | 28.6 | 33.6 | 39.6 | 33.5 | 39.4 | 45.3 | 69.4 |

The cells do not move with Health: the crush cannot be lethal and never Downs a fresh soldier at Health 3 or more, and the rescue and the devour decide the rest. Every cell and the lone figure hold at every Health, under every shape in this round.

### Table R3-3. The Large Titan by pool mapping (Large reference start and Large with 2 Squadmates; today 0.185 and 0.045 PC)

| Shape | pools on the Large (terrorize/control/kill) | Large 4 PCs: end | Large + 2 Squadmates: PC end |
|---|---|---|---|
| C 5+, Health 4 | tier-keyed 3/6/9 | 0.085 | 0.020 |
| C 5+, Health 4 | Severity-keyed 6/9/9 (the sweep's reading) | 0.147 | 0.036 |
| C 5+, Health 4 | fourth pool 6/9/12 | 0.156 | 0.045 |
| Hybrid, Health 4, control 1/2 | tier-keyed | 0.118 | 0.028 |
| Hybrid, Health 4, control 1/2 | Severity-keyed | 0.241 | 0.062 |
| D, Health 6, control 2/3, kill 4/4 | tier-keyed | 0.042 | 0.012 |
| D, Health 6, control 2/3, kill 4/4 | fourth pool 6/9/12 | 0.077 | 0.019 |

Under C the Large needs the Severity-keyed reading or a fourth pool to stay a Large (0.15 against 0.185 today; the 12 pool adds little because the Large's lethality comes from its control tier's lethal-capable leg injuries, which the 9 pool already carries). Under D at Health 6 the Large cannot be made Large by pools at all: 0.042 to 0.077 against 0.185, because six boxes absorb what the leg injuries used to do. Under the hybrid the mapping decides between too hot (0.241) and a little cold (0.118).

### The crit box-loss spiral, measured over a sequence

Two sessions of two Titan Engagements each, the helper Squad (4 PCs, 2 Squadmates), the interim day between sessions (its care window treats injuries and restores Health lost to damage; crossed-off boxes come back only by treatment or healing), 3,000 sequences a row.

| Shape | fight 1: deaths | fight 2 (same session): deaths | Down at the start of fight 2 (soldiers per Squad) | fight 3 (after the day): deaths | fight 4: deaths | Down at the start of fight 4 | Health the day restored (boxes per Squad) |
|---|---|---|---|---|---|---|---|
| today | 0.023 | 0.050 | 0.044 | 0.055 | 0.130 | 0.080 | 1.75 (falls only) |
| C 5+, Health 4 | 0.034 | 0.075 | 0.044 | 0.073 | 0.146 | 0.090 | 1.71 |
| D, Health 6, 2/3 and 4/4 | 0.034 | **0.140** | **0.128** | 0.084 | **0.216** | 0.155 | 3.21 |
| D, Health 4, 1/2 and 2/2 | 0.041 | 0.102 | 0.087 | 0.071 | 0.162 | 0.117 | 2.88 |
| Hybrid, Health 4, control 1/2 | 0.037 | 0.061 | 0.061 | 0.053 | 0.144 | 0.087 | 2.11 |
| Hybrid, Health 6, control 2/4 | 0.031 | 0.076 | 0.055 | 0.077 | 0.149 | 0.081 | 2.30 |

Untreated injuries carried into fight 2 are 0.28 per Squad today, 0.24 under C, 0.21 under D at Health 6, and 0.21 under the hybrid; the care window saves 0.3 to 0.5 soldiers from a lethal limit after every fight under every shape.

**Reading.** The spiral the owner asked about has two layers, and they behave differently.
- **Crossed-off boxes (untreated Critical Injuries) are the long-memory layer**, the same under every shape: an untreated injury crosses off a box until it is treated or heals, so a soldier who fights on with two untreated injuries is two boxes nearer Down, and the day's care window is what turns that around. This is the AoT attrition clock the design already has, and C keeps it unchanged.
- **Damage is the short-memory layer that D adds.** Within a session it compounds: the second fight of a session is four times as deadly as the first under D at Health 6 (0.140 against 0.034), against 2.2 times today and under C, and 1.6 times under the hybrid; three times as many soldiers start fight 2 Down. Then the interim day wipes it (3.2 boxes restored per Squad), so fight 3 falls back to 0.084. That is a spiral inside a session and no clock across sessions: D's attrition does not accumulate over an Expedition, it resets at every night camp, while the injuries that do accumulate are the ones C already tracks.
- **Treat Injury and the day.** Treat Injury restores a crossed-off box (treated-or-healed); nothing in Phase 1 restores damage before a day passes (Chapter 3, section 3.6; today only falls deal damage, so the gap is invisible). Under D a soldier put Down by damage alone stays Down until the night camp, whatever a Medic does, because Treat Injury has no injury to treat. Coriolis fills this with First Aid, which un-breaks; WoF would need an equivalent action or a rule that Treat Injury can clear damage. That is a new procedure, and it is the same gap for the hybrid, only rarer (0.02 Downs by damage a fight against D's 0.11 to 0.25).
- **Damage at 0 Health never fired inside a fight** (the "zero crits" column is 0.00 in every row): a Down soldier does not draw a second card while Down in these fights, so the auto-crit rule matters only across fights within a session, where it is part of the four-times figure above.

### Variance of harm per landed hit and per fight (Medium, 4 Rookie PCs)

| Shape | landed harming hits a fight | boxes lost per hit, mean (SD) | outright death per hit | boxes lost per fight, mean (SD) | Critical Injuries per fight, mean (SD) | Downs by damage a fight |
|---|---|---|---|---|---|---|
| C 5+, Health 4 | 0.33 | 1.03 (0.27) | 0.008 | 0.34 (0.61) | 0.60 (0.90) | 0 |
| D, Health 6, 2/3 and 4/4 | 0.34 | 4.53 (1.57) | 0.012 | 1.53 (2.78) | 0.49 (0.79) | 0.11 |
| D, Health 4, 1/2 and 2/2 | 0.35 | 3.01 (1.16) | 0.009 | 1.05 (1.86) | 0.57 (0.90) | 0.12 |
| Hybrid, Health 4, control 1/2 | 0.34 | 1.51 (1.00) | 0.009 | 0.51 (1.04) | 0.56 (0.87) | 0.02 |
| Hybrid, Health 6, control 2/4 | 0.35 | 1.83 (1.28) | 0.007 | 0.64 (1.30) | 0.45 (0.72) | 0.01 |

Read as a share of the soldier's Health: a C hit costs a quarter of a 4-box Rookie with a spread of 7% of Health; a D hit at Health 6 costs three quarters with a spread of 26%; a hybrid hit costs 38% with a spread of 25%. Per fight, C's harm is 0.34 boxes with SD 0.61 (15% of Health); D's is 1.53 with SD 2.78 (46% of Health); the hybrid's 0.51 with SD 1.04 (26%). Outright deaths per hit are the same order everywhere (0.7 to 1.2%), because they come from the injury table's instant-death rows through the rider, which every shape now shares. So at matched death rates D is the least stable shape per hit and per fight, the hybrid sits between, and C is the most stable; "more stable" was the premise of D and it is the reverse of what the dice do.

### Knock-on effects of a Health change

- **Down.** Health 3: a Rookie is Down after three untreated injuries; the Rookie's first-fight Down rate doubles with the deaths. Health 6: Down needs six injuries or D's damage, so Down comes from damage, not injuries, which inverts Chapter 3's picture.
- **The Death Roll** (Strength, no Push): untouched by Health, but the number of Death Rolls per fight follows the lethal rows, which follow the crit count, which D lowers (0.49 CIs a fight) and Health 3 raises (0.83).
- **Treat Injury and healing.** Unchanged in procedure; under D a new rule is needed for damage before the day (above). Health 6 halves the share of a soldier's Health one treatment gives back (one box of six).
- **The Free Build Health range** (the plan's Needs owner item 2). Today's formula gives 2 to 5 for buildable soldiers; a 2 and 2 pair on Strength and Agility gives Health 2, and the report's Health 2 helper row is 0.076 deaths a fight against 0.038 at 3 and 0.018 at 4, so Health 2 is four times as deadly as the reference and should be disallowed or reported beside the row (a floor of 3, or the second 4 forced onto Strength or Agility). Half rounded down gives 3 to the Rookie and 2 to the 2 and 2 pair, which is the same question. Health 6 as Strength plus Agility minus 1 gives 3 to 9, and the 2 and 2 pair 3.
- **Human Skirmishes (ADR-0018).** The musket at damage 3 was set so a landed ball leaves a 4-box Rookie one from Down and one extra success Downs them. At Health 3 every landed ball Downs; at Health 6 a Rookie takes two balls, so the musket needs damage 5 to keep the owner's "guns as lethal as Titan fights", and the sabre 3 instead of 2. Under D or the hybrid, human damage and Titan damage share one pipeline, which is the one clean gain.
- **Falls.** Chapter 4's fall table deals 1 to 4 damage; a Shattering landing (4) Downs a 4-box or 3-box Rookie and leaves a 6-box one standing. Health 6 needs the table rescaled (about 1.5 times) or accepts softer falls; Health 3 makes a Heavy landing (3) a Down.
- **Horses.** No Health of their own (Gear Dice); a fall from a horse is a Low-band fall, so it follows the fall note.
- **Squadmate templates and the reference builds.** Every template's Health field, every Health-dependent report row (Health 2, 3, 5, 6), the Veteran and Levi-grade builds, and Chapter 2's derived value change with the formula.

### Bookkeeping at the table

| | C | Hybrid | D |
|---|---|---|---|
| Per landed control hit | roll 2D6 plus the rider on the location table, cross off one box, apply the row | add base plus extras, mark that many boxes, compare with the threshold, roll the injury if met | the same as the hybrid |
| Per landed kill hit | as C | as C | add damage, mark boxes, compare, roll the injury (always met at kill 4 with threshold 4) |
| Marks per hit | one cross | one to four damage marks, sometimes a cross | two to six damage marks and usually a cross |
| Sheet | as today (boxes crossed by injuries, marked by falls) | as today, plus the marked-by-damage state used every fight | the same, and a "Down by damage" state that Treat Injury cannot clear |
| GM table per entry | dice | dice, damage, threshold on control entries | dice, damage, threshold on every harming entry |
| Erasing | treatment or healing clears crosses; the day clears marks | the same | the same, with more to erase each day |

### Verdict of round 3

| | C on 5+ (Health 4, 3/6/9, Severity-keyed pools) | Best hybrid (Health 4, control 1/2, kill C) | Best D (Health 6, control 2/3, kill 4/4) |
|---|---|---|---|
| Medium band (today 0.054 and 0.061) | 0.050 and 0.058 | 0.057 and 0.064 | 0.060 and 0.065 |
| First-Titan-Engagement row (0.083) | 0.082 | 0.094 | 0.085 |
| Setup mix, 4 PCs (0.083) | 0.076 | 0.100 (0.077 with the Large tier-keyed) | 0.069 |
| Large (0.185) | 0.147 to 0.156 | 0.241 (0.118 tier-keyed) | 0.042 to 0.077 |
| Grab cells | hold | hold | hold |
| Target B (0.125 PC deaths, mix, 2 Squadmates) | 0.028 | 0.030 | 0.025 |
| Spread per hit (SD of boxes lost) | 0.27 | 1.00 | 1.57 |
| Spread per fight | 0.61 | 1.04 | 2.78 |
| Second fight of a session against the first | 2.2 times | 1.6 times | 4.1 times |
| Health formula | today's | today's | new (Strength plus Agility minus 1, or a flat 6) |
| New rules | none beyond section 4 | Health damage from control entries; a damage-before-the-day rule | Health damage from every entry; the damage rule; the musket and fall tables rescaled; every Health-dependent row retuned |
| ADRs touched | 0015, 0018 (sentence), 0014, 0005 (one sentence) | those, plus ADR-0005 amended in substance | those, plus ADR-0005 reversed and ADR-0014's Health reports made targets |
| Effort | one to two agent-days | two to three | four to five, and a Large that cannot be made Large by pools |

**Recommendation of this round.** Option C on 5+ at 3/6/9 with today's Health formula, pools keyed to Severity values (or a fourth pool of 12 for a Severity 4 entry), is the only finalist that reproduces every row the targets read without a new Health formula or a new damage rule, and it has the narrowest spread per hit and per fight. If the owner wants graded harm from swats, the hybrid at Health 4 with control damage 1 and threshold 2 is playable and reproduces the Medium band; its costs are the Large row (choose the pool mapping for it, or give its swat no damage), a damage-before-the-day rule, and a per-hit spread four times C's. Option D does not survive this round on its own premise: with the owner's pools fixed it overshoots at today's Health, needs a new Health formula of about 6 to come back, makes the Large a Medium, and doubles the harm it was meant to steady.

## 6. Impact and sequencing

**ADRs.**
- **ADR-0015** (Titan attacks land unless dodged): superseded by a new ADR, "Titan behaviors roll attack dice; the Reaction needs their successes" (or amended in full). Keep from it: one Reaction per Titan per round; Titans cannot be blocked; the Grab counts in soldier turns; the grip's Toughness 1; the crush cannot be lethal. Add: the whiff, the rider on Critical Injuries, no rider on the Grab, no Push for Titans, the roll made in the open when the card comes up.
- **ADR-0018** (Humans roll; Titans do not): its title and first sentence are superseded; its content (typed damage, Health in front of the tables, foes by closed rules, bare hands never kill, Block only against a person) stands. Under Option C its Reaction sentence becomes the shared sentence, and its "damage plus 1 per success beyond the first" is read beyond the Reaction's successes. Under A or B the human rule is restated as cancellation. Its Considered Options paragraph ("rejected, because Chapter 1 forbids opposed rolls") no longer holds and should say so.
- **ADR-0014**: the Severity sentence ("Severity is tuned against a Rookie dodging with Agility 3 and ODM Gear 2") becomes "attack dice are tuned against ..."; every band and bar limit is re-measured (section 5 says they hold at 6/12/18); the batch 7 paragraph's target B stays a target in waiting.
- **Chapter 1 section 1.1 item 5**: delete, or (Option C) leave and add "a Titan's or a foe's attack roll sets the number a Reaction needs; that is not an opposed roll". Deleting is cleaner.
- **ADR-0005**: one sentence: the extra-net rider adds to the Critical Injury roll; Titan attacks still inflict Critical Injuries directly and cause no Health loss.
- **ADR-0010**: no change. **ADR-0003**: the Titan's roll is open and the GM chooses nothing; add the whiff to item 2's flag list only if a whiffed card is to count as "resolved" for flags (it should: the card resolved a behavior that missed, and the flags clear as today).
- **ADR-0001, 0007, 0017**: no change.

**Glossary (`CONTEXT.md`):** Severity ("the successes a Reaction needs to avoid a Titan's behavior") becomes "the successes a Titan's attack roll scored, which a Reaction needs"; its Avoid list drops "attack dice", which becomes the term for the pool; Reaction gains the whiff sentence; Behavior Table gains the dice column.

**Chapters.** Chapter 1 (1.1 item 5; 1.9 Reactions against a Titan; the example); Chapter 2 (the Catalog's dodge row, "the behavior's Severity"); Chapter 3 (3.1's "lands unless the Reaction meets its Severity"; the Grab countdown paragraph; the example's second attack); Chapter 4 (the Jam test design notes cite "Severity 3" throughout; the example); Chapter 5 (5.5 Resolving a card, Dodging a Titan; 5.9 When a Grab lands; 5.13 tuning verdicts); Chapter 6 (every stat block's Severity column, every design note that cites Severity, 6.6 tuning). Chapter 7 (WP-F's Skirmish section) if humans change shape.

**YAML.** `data/engagement/size-classes.yaml` (`severity` becomes `attack_dice`, with `measured`); `data/engagement/titan-format.yaml` (`tier_rules`, the column); `data/engagement/behavior-procedure.yaml` (steps 5 and 6: roll, announce, react); `data/engagement/grab.yaml` (the crush's no-rider note; nothing else); `data/titans/standard-small.yaml`, `standard-medium.yaml`, `standard-large.yaml`, `sprinting-abnormal.yaml` (the column); `data/engagement/tuning.yaml` and `data/titans/tuning.yaml` (the `medium_severity` rows become dice rows; every verdict sentence); `data/titans/probe-figures.yaml` (every committed figure is stale and must be re-measured); `data/harm/critical-injuries.yaml` (the rider as a `gaining` step); `data/skirmish/skirmish.yaml` if the human rule is restated; `data/character/action-catalog.yaml` (the dodge entry's "needs" text). `render.py` and the Chapter 6 probe render for the column.

**Simulator.** `engine.Fight.titan_card` (the patch in the appendix is the spec: about 60 lines), `families.grab_trial` and `dodge_job` (the dodge family measures "dodge Severity 3"; it becomes "dodge k dice"), the Jam test family (`jam_job` models the holder dodging at a Severity every round), `report.py` (every sentence that says Severity), `targets.py` (unchanged in shape). The committed probes under `tools/probes/` (chapter-06 `fight6.py`, batch-5 `retreat_b5.py`) model Severity and become historical; the re-check step in `run.py` that imports `fight6.py` would compare against a stale model and must be pointed at the new one or disabled for the run.

**Packet.** 14 lines mention Severity or the dodge; every GM Behavior Table (`#gm-*`, `#titan-*`) gains a dice column; the quick reference's Reaction line; the Titan Engagement section's "Dodging a Titan"; the Grab box; the glossary. If Titan dice on 5+ are chosen, a dice legend.

**In-flight packages (`IMPLEMENTATION-PLAN.md`).**
- **WP-0** (Catalog): the dodge entry's needs text is one row; no conflict if this lands after WP-0.
- **WP-C** (Critical Injuries): edits every harming entry's effect text in Chapter 6 and the four Titan files, and `critical-injuries.yaml`'s `gaining`. A Severity-to-dice change touches the same rows and the same procedure (the rider). Land after WP-C, on its shapes (`injury_type`, sides), not in parallel.
- **WP-S1** (engine): owns `tools/sim/`. `titan_card` is the same function WP-S1 changes for the Bite rider and sides. Hand WP-S1 the patch as the spec once WP-C's YAML shape is fixed, or run this as a follow-on package on the same agent.
- **WP-D** (Fear re-cut): the six-cell Grab test is unaffected by the Grab's landing (Table 3, no rider), so WP-D's check stands. Its Unguarded row gains the whiff reading. No conflict in files if this lands after WP-D's Chapter 5 sections 5.2 and 5.6 (this touches 5.5 and 5.9).
- **WP-F** (Skirmishes): under Option C its human rule is unchanged in landing and gains one reading (extras beyond the Reaction). Under A or B its `skirmish.yaml` sentence is restated. Either way WP-F should be told now, so its prose says "successes beyond the Reaction's" rather than "beyond the first".
- **WP-S2** (the full rerun): if this lands before WP-S2, one rerun measures everything; if after, WP-S2 runs twice and the packet is republished twice. This is the strongest reason to decide now.
- **WP-P** (packet): after WP-S2 either way.

**Before or after the first playtest?** Before, at dice counts matched to today's lethality (6/12/18, Large 24, or the 5+ variant at half counts once it is measured), and **without** folding in target B. Reasons: the owner has already decided the shape they want to play, and a playtest of the fixed-Severity rule would test a rule that is leaving; the matched counts exist and reproduce every band, bar, and Grab figure (Tables 2 and 3), so the first playtest measures the same lethality the packet promises; and target B cannot be reached by dice under any shape, so folding it in would mean choosing the non-dice lever (Nape Depth, injury rows, the hazard table) before the playtest that 7-12 said should inform it. Keep B where 7-12 put it. The one argument for after: the rerun and the packet republish add work before a date; the effort estimate below says it is small next to WP-B and WP-F.

**Effort.** Rules, YAML, glossary, ADRs, and the two tuning files: about one drafter-day (the change is one column and one procedure, repeated in six places). Simulator: about half a day given the appendix patch (the Jam and dodge families are the only new modelling). The rerun and its report: the WP-S2 run, no extra. Packet: about half a day, inside WP-P. Review: inside the planned Fable review of the whole change. In all, one to two agent-days added to the plan, and no new package in the critical path if it is scheduled between group 2 and WP-S2.

## 7. Recommendation

Adopt **Option C** (rolled Severity with the Critical Injury rider) before the first playtest:

1. Every Behavior Table entry carries attack dice in place of Severity. The Titan rolls them in the open when its card resolves; its successes are the card's Severity. A roll of 0 is a whiff for every target, a Down, Grabbed, or Unguarded soldier included. Titans never Push.
2. The Reaction is unchanged: Agility with ODM Gear or the horse, Help, Covering, Call It's 2 dice, a Push allowed with the number known, one per Titan per round compared with every later card of that Titan.
3. Each Titan success beyond the Reaction's adds +1 to the 2D6 Critical Injury roll (the rider makes the spike). A Grab takes no rider. Knock loose and Stress take none.
4. Dice: 6 terrorize, 12 control, 18 kill on the Medium (the Large 12/18/24, the Small 6/12/12), which reproduce today's lethality on every measured row; or, for pools inside Alien's range, Titan dice on 5+ at 3/6/9 (Large 6/9/12), measured to the same result with a narrower spread (section 5b).
5. Humans keep ADR-0018's sentence, which is now the shared one; extras are read beyond the Reaction's successes (the Alien and Coriolis damage rule), which is the partial defence the owner asked for.
6. Chapter 1 section 1.1 item 5 goes. ADR-0015 and ADR-0018's first sentence are superseded by one new ADR; ADR-0014 re-reads Severity as dice; ADR-0005 takes the rider sentence.
7. Target B stays for after the playtest, with the note that dice alone cannot reach it.
8. Schedule it after WP-C and WP-D, on the WP-S1 agent, before WP-S2.

After round 3: keep today's Health formula (Health 3 doubles deaths under every shape; Health 6 exists only to make D fit); key the 3/6/9 pools to Severity values so a Large Titan's control tier rolls 9 (or add a 12 pool for Severity 4 entries), since tier-keyed pools halve the Large's deaths; if graded harm from swats is wanted, the hybrid at Health 4 with control damage 1 and threshold 2 is the playable alternative, with a rule for damage before the day and a decision on the Large.

Do not: put the rider on the Grab; add a devour whiff; remove the Push from the Reaction; adopt Option B's glancing tier unless the owner prefers three outcomes per card to two and accepts 22 kill dice; adopt Option D (section 5b), which cannot reach today's lethality at small pools and reverses ADR-0005 for no measured gain.

## Questions for the owner

1. **Pool size or dice face.** 18 kill dice on sixes, or 9 Titan dice on 5+ (same average, smaller pool, a different-coloured die; both measured, section 5b)?
2. **The rider's shape.** +1 to the Critical Injury roll per extra success (recommended, measured), or a bigger step (+2), which would raise the spike and require lower dice counts? Both are one number in the patch.
3. **The devour.** Should the devour step be able to whiff (measured: about 4 points off the named Grab cell at 10 dice, 1 at 18), or stay the fixed two-turn countdown (recommended)?
4. **Option B's glancing tier.** Do you want a Reaction one short of the attack to turn a Bite into a survivable wound and a Grab into a near miss (Option B), at the price of about 22 kill dice and a third outcome to explain, or is the Critical Injury rider enough partial defence?
5. **Humans.** Confirm that a Block or Dodge that falls short still removes its successes from a human attack's extras (a Block of 2 against a 3-success sabre takes 2 damage, not 4). This is the Alien rule and the recommended reading of ADR-0018.
6. **Sequencing.** Before the first playtest at matched lethality (recommended), or after it with the packet as published?
7. **Chapter 1 item 5.** Delete it, or keep it with the "not an opposed roll" reading?

**Round 3 questions, each with its measured consequences.**
1. **Health formula.** Keep half of Strength plus Agility rounded up (Rookie 4): C 0.050, hybrid 0.057, D 0.078 to 0.115 on the Medium. Flat 3 or half rounded down: C 0.106, hybrid 0.11 to 0.16, D 0.17 to 0.23. Strength plus Agility minus 1 (Rookie 6): C 0.046, hybrid 0.049, D 0.060 to 0.067, with the musket and fall tables to rescale and the Large a third of today's under D.
2. **Shape.** C on 5+ (matches every row; spread per hit 0.27; no new rule); hybrid at Health 4 (matches the Medium band; Large 0.24 or 0.12 by mapping; spread 1.00; a damage-before-the-day rule); D at Health 6 (matches the Medium band; Large 0.04 to 0.08; spread 1.57; the fight after a fight four times as deadly; ADR-0005 reversed).
3. **Pool mapping.** Pools keyed to Severity values (the Large's swat rolls 9: C Large 0.147) or to tiers (every class rolls 3/6/9: C Large 0.085), or a fourth pool of 12 for Severity 4 entries (C Large 0.156, today 0.185).
4. **Free Build Health 2.** Allowed (0.076 deaths a fight with helpers, four times the reference) or floored at 3 (0.038)?
5. **Damage before the day** (hybrid or D only). A Down-by-damage soldier stays Down until the night camp, or Treat Injury may clear damage (a new procedure, unmeasured)?
6. **Target B.** Confirm it is pursued with a lever outside the attack roll (Nape Depth, Regeneration, injury rows, the hazard table), since no rolled shape at any Health reaches it without tripling the PC-alone rate.

## Appendix: scripts, seeds, and sample sizes

All in the session scratchpad under `opposed/tools/sim/` (a copy of the snapshot's simulator), never in the repository:

- `odds_opposed.py`: the analytic tables (Table 1), 60,000 trials a cell, seed 11.
- `opposed_patch.py`: the monkeypatch. `cfg["opp"]` takes `mode` (A or B), `dice` (by Severity value), `autoland`, `grab_bonus`, `no_push`, `devour_roll`. Option C is Option A's landing rule with `grab_bonus: False`.
- `run_opposed.py`: the coarse sweep, 281 jobs, 6,000 fights and 20,000 Grab trials a row, seeds 500000+ and 600000+. Output `opposed-sweep.log`, `opposed-results.json`.
- `run_fine.py`: the fine sweep over kill dice 8 to 36 in steps of 2 (control two thirds, terrorize a third, the Large's kill four thirds), modes A, A without Push, and B, over the nine rows the targets read; 405 jobs, 6,000 fights each, seeds 700000+. Output `opposed-fine.log`, `opposed-fine.json`.
- `run_grab2.py`: the Grab cells with no rider and with the devour whiff, 20,000 trials a cell, seeds 800000+. Output `opposed-grab2.log`.
- `run_d.py`: the Option D sweep (mode D in the patch: `damage` by tier as (base damage, crit threshold), damage through a copy of `health.yaml`'s procedure, one Critical Injury per hit at the threshold, at 0, or while at 0), 45 settings over the nine rows, 6,000 fights each, seeds 900000+; per-hit harm tracking for C and D. Output `opposed-d.log`, `opposed-d.json`.
- Round 3: `run_r3.py` (66 settings over the nine rows, 6,000 fights each, seeds 1000000+; `opposed-r3.log`, `opposed-r3.json`), `run_grab_r3.py` (the cells at Health 4, 3, 6; 20,000 trials a cell, seeds 1100000+; `opposed-grab-r3.log`), `run_seq_r3.py` (six sequences of 2 sessions of 2 fights, 3,000 each, seeds 1200000+; `opposed-seq-r3.log`), `run_large_r3.py` (the Large row by pool mapping, 6,000 fights, seeds 1300000+; `opposed-large-r3.log`). The patch gained mode `H` (kill tier as C, control and Thrash as D), the crit rider on D, `face`, and per-hit and per-fight harm tracking.
- `run_face5.py`: Option C with Titan dice succeeding on 5 and 6 (`face: 5`) at 3/6/9/12, 3/5/8/11, and 4/7/10/13, 6,000 fights a row, seeds 950000+.
- The snapshot's `tools/sim/rules.py` loaded without the retreat-clock failure the brief anticipated; no fix was needed.

Sampling: a Medium 4-PC death rate at 6,000 fights has a standard error of about 0.003 to 0.004; a helper-row PC death rate about 0.002; a Grab cell at 20,000 trials about 0.33 points. Every "matches today" claim above is within 2 standard errors of today's re-run on the same seeds.
