# Round 1 owner feedback: character creation and Talents

Research and opinion only. No rule was changed. Sources: `CONTEXT.md`, `docs/rules/02-character-creation.md`, `data/character/*.yaml`, ADR-0003, ADR-0006, ADR-0011, ADR-0012, ADR-0014, `docs/rules/DECISIONS-2026-09-14.md` (batch 1, OQ-19 to OQ-38; batch 2b, OQ-70; batch 5, OQ-121), `docs/rules/OPEN-QUESTIONS.md`, the Chapter 2 reviews (`docs/reviews/02-character-creation-review-1.md` to `-3-codex.md`), `docs/reviews/simulator-report.md`, the playtest packet, and the two source books in `docs/reference/` (page numbers below are the printed ones). Figures marked "scratch" come from a throwaway model in the session scratchpad that reads the YAML and reproduces OQ-19's Lifepath distribution (key attribute 4/5/6 at 63.3/34.5/2.1%, Top 10 6.2%); they are not simulator results.

The three owner notes, verbatim:

1. "in addition to lifepath roll, also add a manual way of creating character as well where Player just choose what they get"
2. "discuss first, is the talent list a bit too sparse? is this enough to createu unique and fun characters. compared to Coriolis the great darka s well."
3. The Talent half of: "in terms of equipment and talent we can expand it beyond base material of attack on titan. the original show only have few equipment and titan type. but since we are desiggning a TRPG we can expand on it for variety to better suit TRPG game system."

---

## Note 1: A manual, choose-everything way to build a soldier

### Why now

**What the Lifepath randomises.** Eight rolls per Cadet (`data/character/lifepath.yaml`, `steps`):

| Step | Roll | What the row fixes | What the player still chooses |
|---|---|---|---|
| Origin | D66, 12 rows | 2 attribute points (which two), a pair of Talents, a pair of Havens, an optional Canon Tie | one Talent of the pair, one Haven, whether to take the tie |
| Why You Enlisted | D66, 12 rows | 1 attribute point | the Drive, from any row (OQ-23) |
| Training Year 1 to 3 events | D66 x 3, 12 rows each | 1 attribute point each, a pair of Talents each, a Merit change from -1 to +2 | one Talent of each pair (with the OQ-20 fallbacks) |
| Performance rolls x 3 | attribute dice only | 0 to 3 Merit each | which of two attributes when tied |
| Graduation | none | Class Rank from the Merit total; Top 10 at 6 or more gives +1 key attribute | the Specialty, and 1 Talent level from its list of 4 |

So of the mechanical outputs, the player chooses the Specialty, one Talent from each rolled pair, the Specialty Talent, the Drive, and where overflow points go. Everything else that carries weight (which attributes hold the 6 rolled points, Merit, Class Rank, the 19th point) is rolled.

**What it balances, and why rolled.** The reasons are deliberate and documented, not first-pass scope:

- **One measurable creation distribution (ADR-0014, OQ-19).** ADR-0014 tunes every Titan number against a reference Rookie (Strength 4, Agility 3, Wits 2, 3 elsewhere, Talent 1). OQ-19 went through three review rounds specifically to make creation independent of player strategy. The reviews measured the alternatives: letting the player choose the Why You Enlisted row moved the share of key attribute 5 or 6 from 36.6% to 53.2% (Codex review 1, finding 2; Opus review 1, finding 4), and a swap that fired only below 4 moved it to 22.3% (Codex review 2, finding 1). Option (h) was chosen because "ADR-0014 tunes against one creation distribution rather than a strategy" (OQ-19, Why). A point buy, option (a), was rejected because it "lets players reach the maximum by design".
- **No free points (OQ-19 (h), attributes.yaml `free_points: 0`).** Every attribute point comes from a rolled row.
- **Top 10 rarity (OQ-21 (d)).** 6.3% of Cadets, so that a 6 is "the canon prodigy who graduated near the top of the class", and the Merit skew toward Strength and Perception events was accepted rather than retuned.
- **No GM discretion (ADR-0003 item 8; Chapter 2, section 2.3).** "The GM plays no part in the Lifepath beyond reading tables with the players."
- **Compensation for bad rolls** is real but narrow: the Graduation swap moves the soldier's highest rating into the key attribute, the floor guarantees 4, overflow never wastes a point, no rolled row can force a dormant Talent (OQ-20 (d) and (g), OQ-33), and the Drive is a free pick. There is no compensation for Merit: Class Rank is luck, and the Exam was rebuilt to parity (OQ-22, OQ-37) so that playing it neither helps nor hurts.
- The glossary defines creation as the Lifepath ("The character creation procedure that walks a Cadet through their origin and three years of Training Corps events") and lists Merit and Class Rank as things every soldier has. Squadmate templates (`squadmates.yaml`, OQ-29 (j)) are the Rookie array, 18 points, one Talent at level 1.

One review already flagged the design's distance from its parents: "Rolled attributes with no point buy are less Year Zero Engine than Traveller" (Opus review 1, closing notes).

**How the parents do it.**

- *Alien RPG Evolved* (p. 24 to 26): the default is chosen. Pick a career, distribute 14 attribute points (2 to 4, key attribute 5), 10 skill points (career skills to 3, others to 1), one career Talent from a list of three. A sidebar on p. 25 offers random attributes (roll 4D6, re-roll 1s and 6s, assign). The Life Path (p. 282 to 288) is an appendix alternative, and the book warns on p. 24 that it "can result in less balanced characters"; it starts every attribute at 2, rolls origin, three D66 Early Life rows, a D66 Life Event, then one to three career terms with a random career Talent each, +2 attributes of choice, and out-of-range results are simply re-rolled or chosen (p. 282).
- *Coriolis: The Great Dark* (p. 19 to 21): nearly every step reads "roll or choose": origin, specialty, quirk, equipment, and the reason for becoming an Explorer. Attributes are a 24-point distribution (2 to 5, key attribute 6). Talents are one from origin, one from specialty, and three more levels chosen from the profession's four key talents, no talent above 2 at start. Rolling is flavour; the budget carries the balance.

WoF is therefore the odd one out: it rolls the parts its parents budget. The reason is sound (ADR-0014 needs one distribution) but it is a stronger commitment to rolling than either parent makes.

### Opinion

I agree with the note, with one firm condition: a manual build must not be a better build. The reviews already proved the obvious manual shape breaks the balance, and the scratch model makes it concrete.

**"Pick one row per step" is the wrong shape.** If a Slayer simply chooses the best row on every table (Wall Rose Farm, Vengeance, The storm march, The wooden nape, Taking command), the scratch model gives: key attribute 6 in 88.9% of builds (against 2.1% rolled), Top 10 in 88.9% (against 6.2%), Health 4 always, and Clean Cut 2 guaranteed (against 4.1% of rolled Slayers). That is not a parallel path; it is the Lifepath with the dice removed and the ceiling as the floor. The attribute point and the Merit change ride on the row, so choosing rows chooses them.

**A raw point budget is only a little better.** Six points on a base of 2 with a cap of 5 lets anyone put +3 in the key attribute (5 every time, against 34% rolled) and build 5, 5, 2, 2, 2, 2 for Health 5 on a Strength and Agility pair. The whole population drifts to the Veteran end of ADR-0014's builds.

**What a manual build has to match** is the Lifepath's envelope: 18 points, key attribute at least 4, the rest averaging about 2.7, 5 Talent levels with none above 2, and Top 10 as something rare. The clean way to match it is to hand out the Lifepath's *typical* result rather than its *best* result: the 18-point Rookie array (4, 3, 3, 3, 3, 2), which is exactly the Squadmate template and exactly ADR-0014's reference Rookie. A manual soldier is then "a template plus what the promotion procedure already adds": Origin (chosen, for Haven, Canon Tie, and one Talent), a Drive (chosen, as now), and four more Talent levels. Section 2.10's promotion conversion already does this with rolled Talent sources; the manual build only replaces those rolls with choices.

**Why this is better than a budget with guardrails.** It needs no new balance argument, because the array is the tuned build; it keeps rolling as the only route to a 5, a 6, or a Top 10, which gives the Lifepath a reason to exist beyond nostalgia (the gamble has an upside as well as a downside); it makes a replacement character buildable in ten minutes, which matters when ADR-0014 targets a PC death every 3 to 4 missions and section 2.10 step 4 currently sends a player with no Squadmate through a full Lifepath; and it is data-shaped for Foundry, because the nine arrays already exist in `squadmates.yaml`.

**The one place choice matters more than the array: Talents.** A rolled Slayer holds Clean Cut 2 at creation 4.1% of the time; any dice Talent at 2, 24.1%. A chooser will take Clean Cut 2 every time. The scratch fresh-cut figure (need 4, Gear 1, Stress 1, one Push) moves from 12.4% with Strength 4 and Talent 1 to 18.5% with Talent 2, about what a rolled Strength 5 soldier gets (18.8%). That is inside the Lifepath's envelope, so a single level-2 Talent is acceptable. What is not inside the envelope is stacking: Strength 5 array plus Clean Cut 2 plus Hamstringer 2 plus Relentless is a build the Lifepath produces well under 1% of the time. Hence the guardrail: the Rookie array, and at most one Talent at level 2.

**On the fiction.** The Lifepath's real value is the 104th's texture (bread lines, the dummy course, the dismissal list). A manual builder should still pick an Origin row and may pick event rows for the story with no mechanical effect, exactly as Coriolis lets you "roll or choose" a quirk.

### Impact and options

Common impact of any manual build:

- **Chapter 2:** a new subsection beside 2.3 ("Building a soldier without the Lifepath"), edits to 2.1, 2.3.5 (Merit and Class Rank recorded as "none", the value promotion already uses), 2.4 (a manual builder takes no Exam Merit), and 2.10 step 4 (the no-Squadmate fallback may use it).
- **YAML:** `lifepath.yaml` (a second procedure block, or a `mode` on the steps), `attributes.yaml` (the array, or the budget), `class-rank.yaml` (what a manual build records), `squadmates.yaml` (promotion and the manual build share the conversion steps).
- **CONTEXT.md:** the Lifepath entry defines creation as the Lifepath; either widen it or add a sibling term ("Template Build" or "Quick Build"). Merit and Class Rank entries need "or none".
- **ADRs:** none need amending for the template option. ADR-0014 needs an amendment only if the manual build can exceed the reference Rookie (a key attribute of 5, or Talent 2 on the key roll for every soldier).
- **Decisions:** a new OQ and batch entry, since OQ-19 and OQ-21 were decided on "every point from a rolled row".
- **Simulator:** no rerun for the template option (the reference Squad is literally this build). A rerun of the Lifepath distribution cases, not the fight targets, if arrays with a 5 are allowed; a full sensitivity pass if guaranteed Talent 2 is allowed on measured rolls.
- **Character sheet:** `merit`, `class_rank`, and `declined_military_police` need a "none" state (precedent: promotion).
- **Table time:** the Lifepath is about 15 to 25 minutes per player plus the Exam; a template build is about 10. Mixed tables work because both produce 18-point soldiers.
- **Foundry (ADR-0003, ADR-0012):** a second branch in the creation app. Arrays and pick-lists are data; a budget with exceptions is logic.
- **Packet:** one new box under "Creating your soldier".

Options:

**(A) Template Build (recommended).** Choose a Specialty and take its Squadmate template array (18 points, key 4). Choose an Origin row for its Haven, Canon Tie, and one of its two Talents. Choose a Drive. Choose 4 more Talent levels from any Talent, at most one Talent at level 2, rule Talents at most 1. No Merit, no Class Rank, no Top 10, 18 points always. May pick event rows for the story with no effect. Effort S. Risk: players who want a 5 will roll, which is the intended trade.

**(B) Arrays plus budget.** As (A), but offer two arrays: Rookie (4, 3, 3, 3, 3, 2) and Specialist (5, 3, 3, 3, 2, 2), the key attribute taking the first value. Same Talent guardrail. Still no Top 10. Effort M (a Lifepath-distribution rerun to state the new mix, and a note in ADR-0014's amendment log that the population now leans Specialist). Risk: everyone takes Specialist, and the Rookie the game is tuned for becomes the Squadmate only.

**(C) Roll then swap.** Roll the Lifepath, then replace up to one rolled row (Origin or one event) with any row of the same table. Preserves the fiction and most of the distribution, but the swap is a strategy (take the +2 Merit row, or the row with the key attribute), so OQ-19 and OQ-21 have to be re-measured and probably re-argued. Effort L for a modest gain. Not recommended as the manual path; it could be a later "reroll one row" mercy rule if the playtest shows bad Lifepaths hurt.

### Recommendation

Adopt (A) as a second creation procedure, written as data next to the Lifepath, reusing the templates and the promotion conversion. Keep rolling as the only way to a key attribute of 5 or 6, a Top 10, or the Exam. Cap the manual build at one level-2 Talent. Present both in the packet as equals ("roll your Training Corps years, or build from a template"), and use the template build as the default replacement-character path.

---

## Note 2: Is the Talent list too sparse?

### Why now

**Counts (`data/character/talents.yaml`).** 40 Talents: 20 dice, 20 rule. Nine Specialty lists of 4 (36 slots, 35 distinct because Well-Kept Rig is on both Flier and Engineer) plus 5 general Talents (Iron Nerve, and four that name only dormant or reserved entries: Hand-to-Hand, Silver Tongue, Quiet Step, Long Haul). Eight dice Talents are dormant or reserved (those four plus Keen Eyes, Fieldcraft, Judge of Character, Book Learning), so **32 Talents are live in Phase 1: 12 dice and 20 rule.** Live per Specialty: Slayer 4, Flier 4, Leader 4, Engineer 4, Rider 4, Brawler 4, Tactician 3, Medic 3, Hunter 2. Live general: 1.

**What a soldier holds.** 5 levels at creation (OQ-20 (a)), none above 2, rule Talents at most 1, so a new PC holds 3 to 5 distinct Talents. Scratch: any dice Talent at level 2 in 24% of Lifepaths; a Slayer with Clean Cut 2 in 4%. The Lifepath offers each Talent unevenly: expected offers per Lifepath run from Horsemanship 0.67 and Titan Reader 0.42 down to 0.08 for sixteen Talents that appear on exactly one event row (Clean Cut, Relentless, Pry Loose, Sure Hands, Sharp Call, and so on). Every Talent is offered by at least one row.

**Growth.** ADR-0011: XP buys Talent levels; a first level needs a successful use without it, or a Train action. The XP rules are unwritten, so the campaign count is an estimate from the parents: both charge 5 XP for a new Talent (Coriolis 5 x level to raise; Alien has no levels) and award about 1 XP per "yes" on 8 or 9 end-of-session questions. At 4 to 6 XP a session that is roughly one level a session. A 20-session campaign then adds 15 to 20 levels, but ADR-0014 expects a PC death every 3 to 4 missions and Retirement at 5 Scars, so a typical soldier sees maybe 5 to 10 bought levels. A Specialty list of 4 holds at most 8 levels (two dice Talents to 3, two rule Talents at 1), so most soldiers never exhaust their list, and the reference Levi-grade build (Talent 3) is a late-campaign survivor.

**Why 40 and 4 per list.** OQ-28 chose "(c) four shareable Talents per Specialty" and "(a) single-level rule Talents", with 40 as the drafted count; the reasons given are readability at the table and never stacking a rule Talent with itself. There is no recorded reasoning for 40 as a target size, and no review raised the count. The number is first-pass scope, shaped by two real constraints: every Talent must name Action Catalog entries (ADR-0006, ADR-0003), and eight of the Talents were written for Phase 2 entries and then kept as dormant (OQ-33).

**The Action Catalog is the real bound.** 29 live entries. Dice Talents may name only action, reaction, and roll kinds; of the live rolled entries, every one already has a dice Talent (Nape strike, Body Part strike, Break Attention, Read, Break Free, Dodge, Fly, Treat Injury, Rally, Field Repair, Death Roll), and ten live entries have no Talent at all (Draw Attention, Swap Initiative Card, Squad Tactic, Pass Item, Take Item, Mount or Dismount, Swap Blade Set, Shed Load, Restock Medical Kit, the performance roll). So the dice-Talent space is saturated: a second Talent naming the Nape strike would be Clean Cut with another name. Room to grow is in rule Talents, in conditional dice Talents (the Horsemanship pattern: dice only while mounted), and in Phase 2 entries.

**Parents.**

- *Coriolis: The Great Dark* (p. 50 to 53): about 83 talents in nine categories (Combat 14, Social 11, Vehicle and Exo 5, Knowledge 15, Insight 2, Equipment 6, Recovery 7, Stealth and Mobility 12, Resilience 11). About 67 are leveled 1 to 3 and give +1 base die per level in a narrow case (Blade Fighter for blades, Evasive for dodging ranged attacks, Ruin Delver for leading through a ruin); about 16 are single-level rule perks (Fast Reflexes draws two initiative cards, Nine Lives swaps the digits of a critical roll, Renowned pushes Empathy twice). Eight professions of 4 key talents each. A starting Explorer has 5 levels, none above 2 (p. 21). **WoF's starting shape is a direct port of this: 5 levels, max 2, lists of 4.** The difference is list size: 40 against 83, but Coriolis's list serves social, knowledge, vehicle, and trek play that WoF's Phase 2 will own. Coriolis's combat, recovery, resilience, and equipment categories together are 38, against WoF's 32 live.
- *Alien RPG Evolved* (p. 48 to 51): 56 binary talents, 27 career-locked (3 per career, such as the Medic's Field Medic, Nurse, Surgeon) and 29 general (Bodyguard, Fast Reflexes, Hardened, Survivor, Weapon Specialist). A starting character has 1. Identity there rides on 12 skills with 10 points, which ADR-0006 removed. So WoF's Talents carry what Alien splits across skills and talents, and the right comparison is Coriolis, which also has no skills.

### Opinion

**Not too sparse for what Phase 1 covers, but it feels sparse, and the feeling is right about three things.**

1. **A fifth of the list is dead on the page.** 8 of 40 Talents do nothing until Phase 2, and the packet prints them with "(dormant)". Hunter has 2 live Talents on a list of 4, Tactician and Medic have 3. A Hunter player reads their Specialty and sees half of it greyed out.
2. **The Lifepath hands out situational off-list Talents.** Horsemanship is the most-offered Talent (0.67 per Lifepath) and adds dice only to Ride (dormant) and a mounted dodge. Iron Nerve (0.42) is +1 Resolve on a Stress Response roll. A rolled soldier's sheet reads as one or two real abilities plus filler, even though the count is 3 to 5.
3. **The general list is one Talent.** Coriolis's Resilience and Recovery categories (Tough, Hopeful, Survivor, Nine Lives, Lone Wolf) are where a character's temperament shows regardless of profession. WoF has Iron Nerve and Hard to Kill, and Hard to Kill is on the Brawler list.

**Would two Slayers feel different?** On the sheet, a little: the swap guarantees the same key rating, the other five attributes vary around 2.7, the Drive (12 options) and Origin differ, and the four rolled Talent levels almost always differ. In a Titan Engagement, not much: both make the Nape strike with Clean Cut, and the list's other three Talents (Hamstringer, Relentless, Blade Discipline) are the only in-fight expressions of "Slayer". That sameness is structural, not a Talent-count problem: there are six Titan Engagement actions plus the dodge and Help, and ADR-0010 wants kills to be teamwork, so every Slayer's job is the same job. What distinguishes two Slayers in play is the Drive, the Stress they carry, and which teammate they set up. Two Tacticians or two Leaders differ even less, because Read and Rally are single rolls with one dice Talent each.

**Compared with Coriolis at the table:** a starting Explorer with 5 levels from a list of 83 and a profession list of 4 has the same shape and the same number of things on the sheet as a WoF Cadet; the Coriolis player just picked them. The extra breadth shows over a campaign, when the crew buys into knowledge and social talents, which is exactly the Phase 2 ground (Expeditions, Downtime, Chases, Factions) that WoF's dormant entries reserve.

**So my answer to "is this enough":** enough for the first playtest's Titan Engagements, not enough for the game the vision describes, and the cheapest wins are not more dice Talents. They are: fill the live gaps per Specialty (at least 4 live everywhere, ideally 6 on each list), grow the general list to 6 to 8 live Talents about temperament and survival, add conditional dice Talents and rule Talents that make the same action feel different (a Slayer who cuts eyes, a Flier who fights in Giant Forest, a Leader who Draws Attention for the strikers), and think about one level-3 capstone per Specialty so the Levi-grade build has a name to aspire to. Target about 55 to 65 Talents by the end of Phase 1 playtesting, with the Phase 2 ones added as their entries arrive, which would land WoF around Coriolis's size at the same point of coverage.

**A caution on stacking.** Rule Talents stack with each other and with the dice Talent, and once-per-Titan-Engagement limits are the only brake. Adding many rule Talents to one list raises the chance that a Veteran holds four of them and every one of ADR-0014's targets moves. OQ-28 already named eight Talents that need a simulator check; each new one that touches a measured roll needs a sensitivity row (ADR-0014's "reported beside each target" pattern) before it ships.

### Impact and options

- **Chapter 2:** section 2.7 and Appendix 2A grow; `talents.yaml` is the only source; the render check covers it. Any Talent that names a Phase 2 entry waits for that entry or is marked dormant (OQ-33's problem again, so prefer live entries).
- **specialties.yaml:** lists of 4 become lists of 6 (OQ-28 (c) said four; a batch entry records the change). `training-years.yaml` and `origins.yaml` pairs can stay; new Talents that no row offers are XP-only, which is fine (Coriolis's origin table offers only 13 of its 83).
- **CONTEXT.md:** no term changes; "narrow" in the Talent entry stays the standard.
- **ADRs:** none for count. ADR-0014 if a Talent touches Health, Resolve, or a measured roll (see Note 3 guardrails).
- **Simulator:** sensitivity rows for every new Talent that names a measured entry or a fixed roll (Gas Roll, Fear Roll, Stress Response roll, Death Roll). No target changes.
- **Character sheet:** no change; a longer Talent reference in the packet.
- **Table time:** unchanged in play; a longer pick at XP time. Foundry: rows in the same file.
- **Effort:** S per Talent that names live entries and touches no target; M for a batch of 15 to 25 including a sensitivity rerun; L only if new Catalog entries are needed now.

Options:

**(A) Hold at 40 for the first playtest** and grow with Phase 2. Cheapest; the packet's dormant rows stay visible. Risk: players' first impression of Specialty depth is the Hunter's two live Talents.

**(B) Fill to 6 live per Specialty plus a general list of 6 to 8 (about 60 total), before the first playtest.** About 20 new Talents, mostly rule and conditional dice, each naming live entries, with a sensitivity row for the ones that touch targets. Effort M. Recommended.

**(C) Also add one level-3 capstone effect per Specialty** (a dice Talent whose row gains a rule effect at level 3). Small extra effort on top of (B), but it changes `talent_rules.types` and needs an OQ, because rule effects on dice Talents are a new shape. Worth an owner decision.

### Recommendation

(B), with (C) put to the owner. Grow to about 60 by filling live gaps and the general list, not by duplicating dice Talents. Keep the 5-level, max-2 start; keep lists shareable. Move the eight dormant Talents to a "Phase 2" subsection of the appendix and the packet so the live list reads as the list.

---

## Note 3: Talents beyond the source material

### Why now

Every current Talent is either a canon technique (the Nape cut, the decoy flare, the horse as bait) or a generic soldier's skill. That is first-pass scope, not a rule: ADR-0006 and ADR-0003 constrain the *shape* of a Talent (narrow, names Catalog entries, adds dice or bends a rule), not its *source*. Nothing in the ADRs or decisions says Talents must appear on screen. The one hard canon fence is ADR-0002 (Shifters are not playable), which rules out any Talent that is a Titan power.

### Opinion

Agree, and more strongly than the note puts it. The show's cast shows fewer than a dozen techniques, but the Survey Corps as an institution implies a doctrine that a TRPG can fill out without breaking the feel: the long-distance scouting formation and its flare relays, wagon crews, decoy riders, capture operations, Wall cannon drill, field surgery, gear maintenance under fire, and Hange's research. Non-canon Talents that describe *how a soldier trained* rather than *what superhuman thing they do* keep the walls-era feel. The test is whether a Talent could be a paragraph in a Training Corps manual.

**Guardrails that keep the AoT feel and the design safe.**

1. **Names live Catalog entries and grants no permission** (ADR-0006). A Talent never lets a soldier do something others cannot attempt.
2. **No supernatural or Titan-derived effects** (ADR-0002). Ackerman-grade ability is a 6 and a Talent at 3, not a Talent with "innate" in its name.
3. **No attribute raises, and no Health or Resolve maxima without a simulator row** (ADR-0011, ADR-0014). Coriolis's Tough and Hopeful and Alien's Hardened and Seen It All add +1 to a derived maximum; in WoF, Health decides every Critical Injury count and Resolve every Fear Roll, so such a Talent must be reported beside the Health-dependent targets before it ships, or avoided.
4. **Every Talent touching a measured roll or a fixed roll gets a sensitivity row** (the OQ-28 list of eight is the precedent).
5. **Period tech only** (Campaign Year 845 to 850). Thunder Spears and anti-personnel gear are Discoveries on the Canon Clock; Talents tied to Phase 2 gear wait for that gear's Chapter 4 row.
6. **Rule Talents over dice Talents**, because the dice space is saturated; conditional dice Talents (the Horsemanship pattern) are the exception.
7. **Teamwork levers first** (ADR-0010): Openings, Help, Cover, Wings, Attention, Squad Tactics. Solo power is what ADR-0014's solo targets guard.
8. **Once per Titan Engagement is the default limit** for anything that changes a cost or a roll count.
9. **Names in the setting's register:** plain soldier's English, the CONTEXT.md avoid-lists respected (no "aggro", "taunt", "feat", "perk").

**Prompts, not rules**, to show the room (entry named in brackets; "sim" marks a sensitivity row):

- Slayer: *Eye Cutter* (Body Part strike on the eyes with a condition, dice only there); *Follow-Through* (Nape strike: when you spend 2 or more Openings, the strike counts as hooked in for the Attention Ladder one card later, so the next striker's window opens; sim).
- Flier: *Forest Runner* (Fly: dice only in Giant Forest or Wooded); *Gas Miser* (Gas Roll: once per Titan Engagement, re-roll one 1; sim against the gas target).
- Hunter: *Flare Discipline* (Break Attention with a flare: the decoy holds one card longer; sim); *Trail Sense* (Survive, dormant, waits for Expeditions).
- Tactician: *Formation Drill* (Help: your Wing Squadmate may Help you from two steps); *Second Read* (Read: once per Titan Engagement, leftover Read successes survive one Regeneration).
- Leader: *Hold the Line* (Draw Attention: while you hold Attention, a comrade's Nape strike from Blind Spot gains 1 Bonus Die, inside the cap of 4; sim); *Last Word* (Rally: may target a Grabbed comrade).
- Medic: *Triage* (Treat Injury outside a Titan Engagement: two patients in one care window action; sim against the death target); *Field Surgeon* (Treat Injury: a lethal Critical Injury's time limit steps down one more step on 2 or more successes; sim).
- Engineer: *Spare Parts* (Field Repair: restore 2 instead of 1); *Safe Landing* (Fly: when your ODM Gear Jams, once per Titan Engagement make one Fly roll to land instead of falling; sim against fall damage).
- Rider: *Mounted Cut* (Body Part strike from horseback against a grounded Titan, dice only there); *Wagon Master* (Formation Post, Phase 2).
- Brawler: *Shoulder Charge* (Break Free: on a success, the Titan gains an Opening); *Thick Skull* (Critical Injury roll to the head: once per session, re-roll; sim against lethality).
- General: *Veteran's Calm* (Fear Roll: +1 Resolve once per session; sim); *Comrade's Shadow* (Cover: no Position step needed for your named comrade); *Drill Instructor*, *Cannoneer*, *Signal Relay* (Train, Wall Defense Operation Frame, Formation Post: all Phase 2).

About half of these name live entries and could ship in Phase 1 under guardrail 4; the rest wait for their entries, which is how OQ-33 wants it.

### Impact and options

- **Chapter 2 and `talents.yaml`:** additive rows; `specialties.yaml` lists grow. No Catalog change for the Phase 1 half; Phase 2 prompts wait.
- **CONTEXT.md:** none. **ADRs:** none, unless the owner wants a short ADR stating "Talents may go beyond canon within these guardrails", which would give future drafters a test to cite. I would write it; it is one paragraph and it closes the question for good.
- **Simulator:** sensitivity rows for the "sim" ones; no target change. The report's "beside each target" pattern already exists for Pry Loose and the Squad Tactics (simulator report, section 6.3).
- **Character sheet, table time, Foundry:** as Note 2.
- **Effort:** S for the ADR; M for a Phase 1 batch of 10 to 12 with sensitivity rows; the Phase 2 half is free until Phase 2.
- **Risk:** power creep by stacking, and drift from the Survey Corps register into generic fantasy feats. The nine guardrails and the review pipeline (wof-reviewer plus Codex) are the mitigation.

Options: **(A)** guardrails as a design note in Chapter 2 only; **(B)** guardrails as a short ADR plus a first batch of Phase 1-safe Talents (recommended); **(C)** wait for Phase 2 and add everything with the new entries.

### Recommendation

(B). Record the guardrails as an ADR so that "non-canon but period-true" is a settled principle, then fold a first batch into the Note 2 expansion.

---

## Questions for the owner

1. **Manual build ceiling.** Should a manual build ever reach a key attribute of 5 or 6, or a Top 10 Class Rank, or is that the reward for rolling the Lifepath? (My recommendation: rolling only.)
2. **Manual build Talents.** Is one Talent at level 2 the right cap for a chosen build, or should a chosen build be capped at level 1 everywhere so the rolled Slayer with Clean Cut 2 stays special?
3. **Mixed tables.** Should players at one table be free to mix rolled and built soldiers, or is the choice made once per campaign?
4. **Merit for built soldiers.** Should a built soldier record a chosen non-Top-10 Class Rank for the story, or "none" as promoted Squadmates do?
5. **Target list size.** Is about 60 Talents by the end of Phase 1 playtesting the right scale, or do you want to hold at 40 until Phase 2 brings its entries?
6. **Capstones.** Do you want a level-3-only effect on each Specialty's signature dice Talent (a new Talent shape that needs an OQ)?
7. **Derived maxima.** May a Talent ever raise Health or Resolve, as Coriolis's Tough and Hopeful do, given every such Talent moves the lethality targets?
8. **Dormant Talents in the packet.** Keep them visible with the "(dormant)" tag, or move them to a Phase 2 appendix so the live list reads as the list?
9. **Specialty lists and XP.** Should buying on-list Talents be cheaper or gated differently from off-list ones? The XP rules are unwritten and OQ-28 left this to them, but it decides how much Talents can differentiate two soldiers of one Specialty.
10. **Non-canon principle.** Do you want the guardrails recorded as an ADR, so future drafters have a test to cite?
