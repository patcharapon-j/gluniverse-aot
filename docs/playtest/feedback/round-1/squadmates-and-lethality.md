# Squadmates and lethality

Research and opinion only. No rule was changed. Written 2026-09-15 against the Phase 1 rules as committed (Chapters 1 to 6 Done, simulator Done, playtest packet published).

Owner notes (verbatim): "Also, do 4 PC squad always need squad mates, it is possible to play with just 4 pc without squadmates?" and "Also just so that I get the picture of this, how deadly is this game?"

Sources read: `CONTEXT.md`; `docs/rules/PROGRESS.md`; Chapter 2 section 2.10 and `data/character/squadmates.yaml`; Chapter 5 with `data/engagement/attention.yaml`, `squad-tactics.yaml`, `positions.yaml`, `anchor-ratings.yaml`, `engagement-setup.yaml`, `round.yaml`, `tuning.yaml`; `data/harm/down.yaml`, `death-rolls.yaml`, `critical-injuries.yaml`; `data/mind/fear-rolls.yaml`, `grief.yaml`; ADR-0005, 0008, 0010, 0014, 0015; DECISIONS OQ-29 to OQ-31, OQ-38, batch 4b and 5; OPEN-QUESTIONS OQ-31, OQ-112, OQ-115, OQ-116, OQ-132; `docs/reviews/simulator-report.md` sections 1, 2.1, 2.3, 3, 6.1, 6.8, 6.9, 6.11, 6.12, 7, 14; `tools/sim/cases.py`, `policy.py`, `families.py`, `engine.py`, `dice.py`; the packet's Squadmates and Dying sections; Alien RPG Evolved pp. 18, 68 to 71, 153 (PDF 22, 72 to 75, 157); Coriolis: The Great Dark pp. 65 to 67 (PDF 69 to 71); `docs/research/research-prior-art.md`.

Confidence conventions used below. **Measured (committed)**: a figure in `docs/reviews/simulator-report.md` or the tuning YAML. **Measured (probe)**: a figure from a throwaway script in the scratchpad that imports the committed `tools/sim` engine unchanged; seeds and sample sizes are in the appendix. **Estimate**: arithmetic on measured figures under a stated assumption. **Not modelled**: the rules do not exist yet or the simulator does not run them.

---

## Question 1: do 4 player characters need Squadmates?

### Why now

**What the rule says.** The Squad aims for 6 soldiers, and starting Squadmates are 6 minus the number of player characters, minimum 0 (Chapter 2 section 2.10, `squadmates.yaml` `starting_squad`; OQ-31 option (a), decided 2026-09-14). Four player characters therefore start with two Squadmates, which is also ADR-0014's default Squad ("4 PCs plus 2 Squadmates, all Rookies"). The packet repeats it word for word. Nothing in the rule says why 6, beyond "the design summary says the Squad aims for 6 soldiers" (OQ-31, Question). The Rank rules, not yet written, may change the number.

**What a Squadmate does mechanically.** There are no assigned roles in a Titan Engagement (ADR-0010), and no "Anchor" role exists: `CONTEXT.md` reserves Anchor for ODM Gear (the Anchor Rating), and the Haven entry says so. So a Squadmate fills no mandatory slot. What it adds is measurable:

1. **More cards and more Help.** Two more turns a round, and Help dice on Nape and Body Part strikes up to the cap of 4 Bonus Dice. The standard Medium Titan dies by round 3 in 68.6% of fights with two helper Squadmates against 62.0% without, and 5.0% of fights end in a retreat against 7.4% (report section 2.1). Shorter fights mean fewer Titan cards against the Squad.
2. **Grab rescues.** A rescuer strikes the holding arm (Toughness 1 while it holds) or Helps Break Free. The share of Grabs that end in a devour drops from 10.7% (4 player characters) to 3.6% (4 and 2 helpers) on the standard Medium Titan, and from 16.1% to 5.6% on the Large (section 2.3).
3. **Decoys and screens.** Break Attention from Distant with the horse, or a thrown cloak and Feints beside the Attention holder, spend the Titan's cards: 0.63 to 0.65 Titan cards resolved a round with a screen against 0.85 without (`tuning.yaml` `titan_cards_resolved_per_round`). Deaths through the end fall to 0.016 with a screen beside the holder (probe).
4. **The replacement pipeline.** Promotion is the rule for a dead or retired player character (Chapter 2 section 2.10, OQ-31, OQ-38). Prior art recorded the lesson directly: "Lethality needs player agency and replacement pipelines" (`research-prior-art.md` line 252). Without a Squadmate the player builds a new character and waits until the start of the next session (`promotion.no_squadmate`).
5. **Narrative weight.** Named comrades for Drives (a Drive can name a Squadmate), witnesses and victims for Fear Rolls (comrade-grabbed, comrade-dies), Grief when they die, and the canon shape of a Survey Corps squad: a handful of named soldiers around the cast.
6. **What they do not do.** They never Push or Cover (OQ-29 (d), the Covering-sponge concern of OQ-06), so they cannot spiral into Stress Responses on the players' behalf, and their gear never wears from Pushes. They have no Drive, no XP, no Downtime Action yet.

**The design also tunes around them less than the default suggests.** ADR-0014 Target 1 (the kill in about 3 rounds) is read on 4 player characters alone, and so are every Chapter 6 band and the reference start of every table (report section 1, "Target 1 reads the Squad of 4 player characters the target names"). The 2-Squadmate row sits beside the target as a report. So the fight is tuned for four soldiers; the Squadmates are the margin on top.

**Absorbing Attention.** The reference helper Squadmate absorbs less than one might expect. In the helpers row, Squadmates take 0.08 of the 0.63 Critical Injuries a fight and 0.003 to 0.004 of the 0.022 deaths (report section 6.1: total deaths 0.022, PC deaths 0.018). The standard Attention Ladder goes for whoever is hooked in, then the nearest person in reach; the helper policy stands one step away and Helps, so the Titan keeps turning on player characters. Decoy and screen policies spend the Titan's cards instead of soaking its hits. So "Squadmates die instead of PCs" is not what the numbers show; "Squadmates make the fight shorter and rescue Grabs" is.

### Answer

**Yes, four player characters can play without Squadmates today, and no rule breaks.** I checked each candidate:

- **Attention.** The ladder works with any number of soldiers, and a Titan Engagement starts with nothing holding Attention for "a Squad of two or more" (ADR-0010 batch 4). One soldier is the lone-fight case, which is measured.
- **Round structure.** The wings step assigns "each living Squadmate", which is nothing; Fall Back's condition reads the wings step, which still happens. Initiative, swaps, and end steps do not count Squadmates.
- **Engagement setup, Squad Tactics, Grief, Fear Rolls, Drives.** None requires a Squadmate. A Drive's named comrade is "a living player character or Squadmate other than your own"; with four player characters there are three candidates.
- **Promotion.** `promotion.no_squadmate` already covers the empty pool: a new character from the Lifepath, joining at the start of the next session.
- **The starting-Squad rule itself** is the only text a 4-player, 0-Squadmate table contradicts. "Minimum 0" exists for six player characters, not four. It is a one-line rule with no dependants, so a table that skips it breaks nothing downstream.
- **Round-time band and the timed paper test** (OQ-97) assume 4 and 2. Fewer soldiers only make rounds faster.
- **The simulator's own baseline is this Squad.** Every "reference start" row is 4 player characters and no Squadmates, so the cost of playing without them is the best-measured number in the project.

**What it costs.** On the standard Medium Titan in Wooded terrain (deaths through the end of the Titan Engagement, the rules' reading):

| Squad | Killed by round 3 | Critical Injuries a fight | Deaths a fight | Deaths a fight per player character | Grabs that devour | Confidence |
|---|---|---|---|---|---|---|
| 4 Rookie PCs, no Squadmates | 62.0% | 0.68 | 0.057 | 1.4% | 10.7% | Measured (committed); probe reproduces 0.0573 at 40,000 fights |
| 4 Rookie PCs and 2 helper Squadmates | 68.6% | 0.63 (0.55 on PCs) | 0.022 (0.018 on PCs) | 0.45% | 3.6% | Measured (committed) |
| 4 Rookie PCs and 2 Squadmates on Wings | 67.5% | 0.63 | 0.022 (0.021 on PCs) | 0.5% | about 3.4% | Measured (committed; PC split from probe) |
| 4 Rookie PCs and 2 Squadmates screening beside the holder | 66.0% | 0.42 | 0.016 (0.015 on PCs) | 0.4% | 3.8% | Measured (probe) |
| 4 Veteran PCs, no Squadmates | 83.8% | 0.45 | 0.008 | 0.2% | 1.3% | Measured (probe) |
| 4 Veteran PCs and 2 Rookie Squadmates | 86.4% | 0.46 | 0.005 (0.004 on PCs) | 0.1% | 0.3% | Measured (probe) |

On the standard Large Titan the gap is wider: 0.187 deaths a fight for 4 Rookie player characters alone against 0.058 with two helpers (report section 3 and the bar's twin rows; probe 0.183 and 0.057). On the Sprinting Abnormal, 0.115 against 0.042.

So without Squadmates a Rookie table takes about **two and a half to three times the deaths per fight**, kills more slowly, retreats more often, and has no replacement pool. That is the whole cost; the game still runs.

**Over an expedition or a run of fights the gap compounds** (probe, three standard Medium fights in a row with no day between, the harshest legal cadence): 0.58 player character deaths per three fights without Squadmates against 0.16 with two, and 23% of such expeditions lose at least one of the four original player characters against 9%. Details in question 2.

### Impact and options

1. **Keep Squadmates required as written (4 and 2).** No change. The packet already states the rule. Cost: the owner's question suggests it reads as a burden; the packet gives no reason for the number.
2. **Squadmates optional with an adjustment.** Keep 4 and 2 as the default and add one sentence to the packet: a table may play with fewer, and the two consequences are that fights run about three times deadlier for player characters and that a dead player's replacement waits for the next session. Optional adjustment for a 0-Squadmate table: each player pre-rolls a second Cadet at session zero (a full Lifepath, kept on a sheet) who joins as the promotion rule's new character does. This restores the pipeline without Squadmates on the table. Cost: one paragraph; no tuning changes, since the 4-player figures are already the measured baseline.
3. **A PC-only variant rule.** For example, 4 player characters with the Veteran build (the Top 10 build with two Scars, 0.008 deaths a fight) or with Health raised. This changes character creation for a table-load preference and is not worth it: the Veteran table is a different game (Squads of Levi-grade cast), and Health 5 or 6 with helpers only moves deaths from 0.022 to 0.018 (report section 6.1).
4. **Cut the table load instead of the Squadmates.** If the real concern is running six sheets, the rules already have the answer: put both Squadmates on Wings. A Wing Squadmate is dealt no card, acts right after its player character, and is directed by that player (round.yaml `wings`; OQ-30). The Wings row measures the same as the helpers row (0.022 deaths, 67.5% by round 3). Chapter 4 also gives the one-line Squad sheet row for Squadmate gear (OQ-29). The timed paper test (OQ-97) is the playtest item that will tell whether 6 soldiers fit 12 to 20 minutes a round, with "Wings fixed for the whole Titan Engagement" as its first fallback.

### Recommendation

Keep the rule (option 1) and adopt option 2's sentence and option 4's advice in the packet: "Four player characters start with two Squadmates. You can play with fewer, but expect about three times the deaths and no one to promote; the easiest way to run Squadmates is on Wings." Do not build a PC-only variant. If the owner wants 4 player characters to be the intended table with no Squadmates at all, that is a design change with a measurable price, and the place to pay it is the Medium deaths band (OQ-132 is already the 4-player reading), not the Squad size rule.

One thing to fix regardless: the packet should say in one line what Squadmates are for. The rule reads as bookkeeping because its reasons live in OQ-31, ADR-0010, and the simulator report.

---

## Question 2: how deadly is this game?

### Lethality in plain terms

**One fight.** A fresh Rookie Squad of four, no Squadmates, against one standard Medium Titan in ordinary woods: about 1 fight in 17 kills someone (0.057 deaths a fight), so each player character has about a **1 in 70 chance of dying in a given fight**. With two Squadmates it is about 1 in 45 fights, or **1 in 220 per player character**. About two fights in three end with the Titan dead by round 3, and about 1 in 14 ends in a retreat. Two fights in three leave someone with a Critical Injury (0.68 a fight). A Grab happens about 1 fight in 5; if it lands on a lone soldier they die 7 times in 10, but in a real fight with comrades near, 1 Grab in 9 ends in a devour without Squadmates and 1 in 28 with them.

**A Veteran** (the Top 10 build: Strength 5, Talent 2, gear rated 2, two Scars, Resolve 5) is far safer: about 1 death in 120 fights for the Squad, **1 in 480 per Veteran**, on the same Titan. The Veteran kills faster (84% by round 3), takes fewer hits, and passes Death Rolls more often. Two Scars and Resolve 5 also keep its Stress from spiralling.

**Terrain and Titan matter more than the build.** The Large Titan kills 0.187 a fight for four Rookies (1 in 21 per player character). Open ground with no anchors kills 0.187 on the Medium and 0.54 on the Large, because no one can reach the Blind Spot until a leg is Broken. Rolled on the interim setup table across all Size Classes and Anchor Ratings, a random Phase 1 fight kills 0.136 a fight for four Rookies alone, about **1 in 30 per player character**, and 41% of those deaths come from the 17% of fights on Open ground (report section 6.9).

**A run of fights is where it bites.** Injuries heal in 2 to 28 days, a Down soldier has no Health boxes left, Stress and Grief carry over, and no Downtime rule exists yet. Three standard Medium fights back to back (a plausible expedition) kill 0.58 player characters for a Rookie Squad without Squadmates and 0.16 with them; the third fight is six times deadlier than the first for the Squad without Squadmates (0.34 against 0.054 deaths). Ten fights with only one day between every two: **more than half of the original four Rookies are dead** without Squadmates, a quarter with them, 7% for Veterans. Those are ceilings, since a campaign will have Downtime between expeditions; the floor, if every fight started fresh, is 13% and 5% over ten fights. The truth for a real campaign is between, and closer to the ceiling within an expedition and to the floor across them.

**How often a Squadmate dies instead.** Rarely, in the measured policies: 0.003 to 0.004 a fight beside 0.018 player character deaths with two helpers, and 0.45 of the two starting Squadmates over a ten-fight run (most of those after being promoted). The ADR-0014 Expedition target ("about 1 Squadmate" per Expedition of 4 to 6 Legs) is where the design intends Squadmates to die, and that rule does not exist yet.

**The death path.** Five gates stand between a Titan's attack and a grave, and the player chooses at three of them.

1. **The attack lands unless dodged** (ADR-0015). Severity is the successes the dodge needs: a Rookie makes Severity 1 about 9 times in 10, Severity 2 about 1 in 2, Severity 3 about 1 in 5, Pushing when short (report section 2.4). Choice: Position (most Blind Spot entries fall back to a knock-loose; In Reach is where Grab and Bite apply), whether to Push, whether to dodge everything or only the killers (dodging only Grab and Bite raises deaths from 0.049 to 0.065). Helping or Covering dodges is a trap: it spends actions and nearly triples deaths (0.144, report section 7).
2. **The Critical Injury roll** (ADR-0005: Titan attacks skip Health). D6 for the location, 2D6 on that location's table. A first injury at a location is lethal on 10+ for arm, leg, and head and 11+ for torso: about 15% weighted; it puts the soldier Down about 11% of the time; instant death (15+) is impossible on a fresh location. Control-tier entries (Swat, Shake Off) can never be lethal. A second injury at the same location adds 2, so lethal becomes 42% and instant death 8% on torso and head. Dice only, except that the location is often fixed by the entry.
3. **Down.** At 0 current Health (crossed-off boxes plus damage) or on a Down row. A Down soldier cannot dodge, Help, or Push; a Titan's next behavior lands. Rookie Health is 4, so four untreated injuries, or fewer plus damage, and a Down soldier who rides out again next fight has no margin. Choice: Treat Injury during the fight (0.043 deaths against 0.057), Lift Comrade and carry them to Distant (measured as neutral, 0.058), Fall Back.
4. **The Grab**, the one way to die with no Critical Injury: lifted after the victim's next turn, devoured after the one after, so comrades get one round of cards. Break Free (Strength plus Talent, harder once lifted), Pry Loose, strike the holding arm (Toughness 1), or a comrade's Break Attention frees them. Choice all the way: who moves to the hand, who Helps, whether the Squad holds Clear the Hand.
5. **The Death Roll.** Strength alone, no Stress Dice, no Push, no Help; 1 success to live, 2 to slow the limit one step (turn to engagement to day to stabilized). A Rookie at Strength 4 **fails 48% of the time** per roll, 58% with a 1-die penalty, 69% with 2; a Veteran at Strength 5 fails 40%. A turn-limit injury rolls at the end of every one of the soldier's turns until treated, so it is a clock of a few rounds; an engagement-limit injury rolls once at the fight's end, after one aftermath Treat Injury roll, and a day-limit one rolls each day. Treat Injury is Wits plus the medical kit's Gear Dice; a Rookie has Wits 2 and no kit unless a Medic. Choice: who treats, when, and with what.

So dice decide whether an attack lands and what it rolls; players decide Position, dodge policy, Pushes, rescues, treatment, and Squad composition, and those choices move deaths per fight between about 0.02 (four strikers, or a screen) and 0.14 (Help on dodges) on the same Titan with the same dice. The design's phrase for this is "deadly but earned" (ADR-0014; OQ-42 kept a first head injury from killing outright for the same reason).

### The numbers

All rows are the standard Medium Titan in Wooded terrain at the reference start unless stated. "Per PC" divides Squad deaths by four.

| Situation | Figure | Per player character | Confidence |
|---|---|---|---|
| One fight, 4 Rookie PCs, no Squadmates | 0.057 deaths a fight; 0.050 during the fight, the rest from left-behind soldiers and end Death Rolls | 1.4% | Measured (committed); OQ-132 records the 0.05 band miss |
| One fight, 4 Rookie PCs and 2 Squadmates | 0.022 deaths, 0.018 on PCs | 0.45% | Measured (committed) |
| One fight, 4 Veteran PCs, no Squadmates | 0.008 | 0.2% | Measured (probe, 40,000 fights) |
| One fight, 4 Veteran PCs and 2 Rookie Squadmates | 0.005, 0.004 on PCs | 0.1% | Measured (probe) |
| A first Titan Engagement, with its Fear Roll (4 Rookie PCs) | 0.073 | 1.8% | Measured (committed) |
| Small Titan / Large Titan / Sprinting Abnormal, 4 Rookie PCs | 0.069 / 0.187 / 0.115 | 1.7% / 4.7% / 2.9% | Measured (committed) |
| Large Titan, 4 Rookie PCs and 2 Squadmates | 0.058 (0.047 on PCs) | 1.2% | Measured (committed and probe) |
| Medium on Open ground / Giant Forest, 4 Rookie PCs | 0.187 / 0.121 | 4.7% / 3.0% | Measured (committed) |
| A random interim-setup fight, all Size Classes and Anchor Ratings, 4 Rookie PCs | 0.136 | 3.4% | Measured (committed); Background Titans not modelled (OQ-115) |
| Share of Grabs that devour, 4 PCs / with 2 Squadmates | 10.7% / 3.6% | Grab lands on a PC about 1 fight in 19 | Measured (committed) |
| A Grab on a lone soldier after a failed dodge / one comrade in reach | 70% / 33% (cells 29% to 45%) | | Measured (committed), ADR-0014 Target 4 |
| Death Roll failure, Strength 4 / 5 / 6, no penalty | 48% / 40% / 33% per roll | | Exact arithmetic |
| Three fights in a row, no day between, 4 Rookie PCs / with 2 Squadmates | 0.58 / 0.16 PC deaths; at least one original PC dead 23% / 9% | 15% / 4% | Measured (probe, 6,000 runs); harshest legal cadence |
| Three fights in a row, 4 Veteran PCs / with 2 Squadmates | 0.06 / 0.02 PC deaths | 1.5% / 0.5% | Measured (probe) |
| Ten fights, one day between every two, 4 Rookie PCs / with 2 Squadmates | 54% / 27% of original PCs dead; at least one dead in 70% / 45% of runs | | Measured (probe, 4,000 runs); a ceiling, no Downtime |
| Ten fights, one day between every fight, 4 Rookie PCs / with 2 Squadmates | 40% / 21% of original PCs dead | | Measured (probe); still no Downtime |
| Ten fights, 4 Veteran PCs / with 2 Squadmates, one day between every two | 7% / 3% of original PCs dead | | Measured (probe) |
| Ten independent fights (full recovery between each) | 13% (4 Rookie PCs) / 5% (with Squadmates) / 2% (Veterans) | | Estimate, the floor |
| Per Expedition, ADR-0014 Target 6: about 1 Squadmate and about 1 PC Critical Injury per 4 to 6 Legs; a PC dies every 3 to 4 missions | 0.25 to 0.33 PC deaths a mission | 6% to 8% per mission; about half the seats lose their original character by mission 10 | Not modelled (Phase 2); the target is the design's stated intent |
| Squadmate deaths, 2 helpers | 0.003 to 0.004 a fight; 0.45 of the two over ten fights | | Measured (committed and probe) |

**Why a run of fights compounds.** The probe's variants say what drives it. Healing every injury between fights cuts the three-fight total from 0.58 to 0.26 deaths; resetting Stress and Grief instead cuts it only to 0.52. So the compounding is mostly untreated Critical Injuries (crossed-off Health boxes, dodge penalties, Down soldiers who ride out again because every living soldier takes part, `positions.yaml` `placement`), then gear and supply attrition (worn ODM Gear, spent spare canisters, ruined Blade Sets, bolted horses, spent flares), and only last the mind. Mean Stress still climbs from 1 to about 4 over ten fights with a day between each, because only Downtime lowers it.

**What the simulator does not model.** Expedition Legs and their hazards (ADR-0009, Phase 2), Downtime, XP, two Focus Titans and Background Titans in one fight (OQ-115), a real cadence of fights per session (OQ-116 is provisional), Squadmates directed by players rather than a fixed policy, and the Veteran's actual Scar rows (OQ-117). Every campaign figure above is therefore a fight-only picture.

### Comparison

**Alien RPG Evolved** (pp. 68 to 71). Health is the average of Strength and Agility, the same formula WoF uses. Damage reduces Health first; at 0 you are broken and roll one D66 critical injury; further damage while broken is another. Of the 36 results, 12 are lethal with a time limit of a shift, stretch, or round (a third of the table) and 3 are instant death; the death roll is Stamina, not pushable, no stress dice, failure is death, and three successes on your own end the rolling; first aid stabilizes, and a failed first aid worsens the limit one step (p. 71). Instant kill also comes from damage of twice maximum Health in one hit and from some Xenomorph attacks. Page 18 states the two modes plainly: in cinematic play "most of your PCs probably won't live to see the end", while campaign play is "brutal and deadly" with chances of survival "generally higher"; page 153's theme "Expendable Assets" is the setting's own meat-grinder line. WoF differs in shape: every landed Titan hit is a Critical Injury roll with no Health pool in front of it, but each roll is lethal only about 1 in 6 on a fresh location against Alien's 4 in 10, and WoF's Grab gives a two-turn rescue window where the Xenomorph's Headbite gives none. WoF also lacks Alien's three-successes exit and uses "2 successes slows the limit" instead. Net: per hit WoF is gentler than the Xenomorph; per fight it lands more hits, since attacks land unless dodged. Alien's campaign mode is the right comparison and WoF's per-fight numbers are in its range; Alien's cinematic mode is deadlier by design and WoF has no equivalent.

**Coriolis: The Great Dark** (pp. 65 to 67). Broken at 0 Health, one move a round; a critical injury only when a single hit reaches the weapon's crit threshold, so many fights end with no crit at all. Of its 36 results, 8 are lethal (about a fifth) and 2 are instant death. Dying is a single clock: "die after one shift has passed, unless stabilized", one Logic roll with medical gear, and the same person cannot retry without better gear (p. 66). There are no repeated death rolls. Creature attacks cannot be blocked unless stated (p. 61), which is ADR-0015's ancestor. TGD's lethality lives in attrition (supply, Blight, despair, delve hazards by role) rather than in combat crits. WoF sits between the two parents: Coriolis-style unblockable monster attacks that skip straight to the crit table, with Alien-style death rolls behind them.

**The Attack on Titan fiction.** The series states the odds in Erwin's recruitment speech (anime episode 16, manga chapter 21): a large share of recruits die on their first expedition beyond the Walls and most are dead within a few years; the figures should be checked against the episode before any packet text quotes them. The named cast dies rarely per fight and mostly in set pieces; the unnamed soldiers die in droves on expeditions. WoF's numbers map onto that split well: player characters are the cast (1 in 70 per standard fight, with real Death Roll dread), and the meat grinder is meant to live in the Expedition (ADR-0014 Target 6, one Squadmate per Expedition, a PC death every 3 to 4 missions). Today the grinder is unbuilt, so the playtest will feel like the cast's fights without the expedition's losses: deadly enough to fear a Grab, not deadly enough to feel the Corps' attrition. Squadmates in particular die less than canon's rank and file because they never Push and the Squad protects them.

**Does ADR-0014 match "the Survey Corps is a meat grinder"?** Its targets do, once Target 6 exists. A PC death every 3 to 4 missions plus a Squadmate per Expedition is far above most campaign TTRPGs (where a PC death a campaign is common) and about half of each seat's original characters gone by mission 10. The fights alone give 13% to 29% over ten fights depending on terrain and Titan; the gap between that and the target is the Expedition. If the owner wants the grinder felt in Phase 1 play, the dials below can bring the fights up; if the owner wants named-cast survival with the grinder in the expeditions, the current fight numbers are already there and the work is Phase 2.

### Dials

Each dial names its measured effect on deaths a fight (standard Medium, 4 Rookie PCs, 0.057 base) or the section that measures it.

**Deadlier**
- Tempo 2 on the Medium: 0.406 (rejected alternative). The single biggest lever.
- Nape Depth 5: 0.124; Regeneration 2: 0.061.
- Kill-entry Severity: the Medium at Severity 2, 3, 3 gives 0.069; at 1, 2, 2 it gives 0.028.
- Terrain: Open 0.187, Giant Forest 0.121; the setup table's Anchor Rating odds are a dial in themselves.
- Health: every soldier at Health 3 gives 0.038 with helpers against 0.022; Health 2 gives 0.076.
- Worsening (+2 per held injury) and the instant-death rows at 15+; OQ-42 named the arm and leg 11 and 12 rows moving to turn limits as the first lever if deaths ran low.
- Cadence: fights per session and days between (OQ-116, OQ-120); a Down soldier riding out again (`placement.who_takes_part`).
- The retreat clock: 8 segments is the minimum of deaths; 6, 9, 10, and 12 all leave more dead (OQ-132).
- Fear Roll at a first Titan Engagement: 0.073.
- Expedition hazards (Phase 2, ADR-0009) and Background Titans (OQ-115), both unmeasured.

**Gentler**
- Two Squadmates: 0.022; a screen beside the holder: 0.016.
- Four strikers and no cutters: 0.021, which is OQ-112's problem: the safest legal policy is the one canon and the chapters teach against. Players who find it will make the game gentler than the bands say.
- Squad Tactics: Hook and Cut with Hamstring Line, 0.037.
- Treat Injury during the fight: 0.043; a medical kit rated 1 on everyone: 0.054 (small).
- Talents on the Death Roll (Hard to Kill), Strength, and the Veteran build (0.008): growth is the intended path to safety (ADR-0011).
- Downtime (Phase 2): the only thing that resets Stress, Grief, and healing days, and therefore the lever on the campaign ceiling.

**Fidelity dials, not numbers.** Whether Squadmates should absorb Attention more (a decoy-first Squadmate policy already spends a third of the Titan's cards), and whether a Down soldier should be allowed to sit a fight out.

---

## Questions for the owner

1. Is the concern behind "do we need Squadmates" the table load of six sheets, or a preference for a four-character cast? If load, Wings are the answer and the timed paper test is the check. If cast, the price is about three times the deaths per fight and no promotion pool; is that acceptable as a stated "hard mode", or should the default Squad change?
2. Should the packet say why Squadmates exist (faster kills, Grab rescues, decoys, the replacement pipeline, named comrades)? One paragraph would do.
3. Should a player with no Squadmate to promote be able to bring in a pre-rolled second Cadet at once, instead of waiting for the next session?
4. Which meat grinder do you want: the cast's fights (about 1 death in 70 per PC per standard fight, as now) with the losses in the Expedition rules, or fights that themselves kill more often? The answer decides whether OQ-132 is closed by re-setting the band or by a lever, and whether Tempo, Severity, or Health should move now.
5. Is a Death Roll that fails 48% of the time for a Rookie the intended dread, or should Strength 4 be closer to a coin's better side (for example, 2 base dice added, about 33%)?
6. Should Squadmates be more expendable than they are (a canon-facing dial: decoy-first policy, or a rule that a Squadmate at In Reach draws Attention ahead of a player character), or is "they die on Expeditions, not in fights" the intended split?
7. The compounding run of fights rests on two readings no rule fixes: every living soldier rides out again, Down or not, and the number of fights between days and Downtime. Should Phase 1 say that a Down or lethally injured soldier stays with the wagons?

---

## Appendix: probe method and one stale check

Throwaway scripts in the session scratchpad (`vet_squad.py`, `campaign10.py`) import the committed `tools/sim` engine, policies, and rules unchanged, write nothing under the repository, and do not write bytecode. Full fights: 40,000 per row, seeds 424242 to 424251 in row order, standard Medium and Large at the reference start (`policy: eager`, `sheet_order: cutters_first`), `build: veteran` for Veteran rows, `squadmates: 2` with `squadmate_role` helper, screen2, or decoyer, `wings: true` for the Wings row. The Rookie reference row reproduces the committed 0.0573 deaths through the end. Runs of fights: `campaign10.py` mirrors `families.sequence_job` (its provisional cadence, promotion contest, interim day and interim issue, new characters joining at the next session) and tracks the four original player characters; 6,000 runs for three fights (seeds 515151 to 515154), 4,000 runs for ten fights under each cadence, with `heal` and `rest` variants that clear injuries, or Stress and Grief, after each fight.

One finding for the maintainers: `tools/sim/rules.py` line 624 checks `background-titans.yaml` `ticks.stopped` for the phrase "the retreat clock included", which decision batch 6 (OQ-134) reworded to "the retreat clock does not fill". The committed simulator therefore refuses to load the current YAML, and `run.py` will fail until that one pattern is updated. The probes patched the pattern in memory and changed nothing else; the report's rules hash predates batch 6.
