# Final design review brief: Wings of Freedom

You are an independent senior tabletop RPG designer doing an adversarial final review of a game design BEFORE drafting begins. Do not edit any files. Read, think, and report.

## What the project is

"Wings of Freedom" is a private (non-published) Attack on Titan tabletop RPG built on the Year Zero Engine (YZE). Its mechanical base is Alien RPG Evolved Edition and Coriolis: The Great Dark (both Free League, both d6-pool YZE games). Titan World 3rd Edition (a thin PbtA fan game) is only loose inspiration: the owner loved its titans-as-natural-disasters feel, required teamwork and setup before a kill, body-part injuries, and lethality, but found it thin, incomplete, and full of GM fiat. The system will later become a Foundry VTT v14 game system. Design has been settled through a long interview; drafting will proceed in rulebook order starting with character creation.

## Where the design lives (repo root: /Users/frostnoxia/Developer/gluniverse-aot)

- `CONTEXT.md`: the glossary of every resolved term. Definitions carry much of the design.
- `docs/adr/0001` to `0014`: the hard decisions with reasoning.
- `docs/research/research-alien-evolved.md`, `research-coriolis-great-dark.md`, `research-prior-art.md`: extractions of the two base games and prior art (other AoT games, other YZE games, the YZE Free Tabletop License).
- `docs/reference/Titan World_ 3rd Edition.md`: the inspiration game.

Read CONTEXT.md and all ADRs fully. Consult the research files when judging fidelity to the base games.

## Summary of the agreed design (for orientation; the files are authoritative)

- Scope: Paradis 845 to 850. Canon Clock with Divergence Hooks. Squad-level Canon Proximity plus per-character Canon Tie. Shifters are GM-only threats.
- Core roll: d6 pool, 6 = success. Pool = attribute + one Talent level + Gear Dice + Stress Dice. Six attributes: Strength, Agility, Wits, Perception, Instinct, Empathy. No skill list; Talents (Coriolis-style, levels) name trigger actions from an Action Catalog; at most one dice-adding Talent per roll; rule-bending Talents stack.
- Push: +1 Stress; re-roll dice showing neither 6 nor 1; 1s stay locked and count. 1s on Gear Dice wear gear; Stress Dice 1s trigger a Stress Response. Covering: a comrade takes your Push's Stress. Fear Rolls are event-triggered.
- Mind: Resolve = (Instinct + Empathy) / 2. Stress Response and Fear Roll = D6 + Stress - Resolve on tables. Scars raise minimum Stress. Grief after deaths. Haven recovers Stress/Grief in Downtime; Drive shrugs off one Fear result per session. In the field, -1 Stress per Waypoint camp; Rally clears a Stress Response; full reset to minimum only in Downtime.
- Body: Health = (Strength + Agility) / 2. Titan attacks bypass Health and inflict Critical Injuries directly (d6 location then 2d6 on that location's table). At 0 Health a human is Down, takes an immediate Critical Injury; lethal injuries have time limits and Death Rolls (Strength, no Push).
- Titans: no Health. Body Parts Intact -> Wounded -> Broken when a strike meets Toughness; Regeneration heals on a clock set by Size Class (Small 3-5 m, Medium 6-10 m, Large 11-15 m). Kill only by reaching Nape Depth; shallow cuts carry over until Regeneration. Titan draws initiative cards equal to Tempo; each card resolves its pre-rolled, hidden Next Behavior from a d6 Behavior Table (escalating terrorize / control / kill, Telegraphs, no back-to-back repeats, Broken parts disable entries) against whoever holds Attention. Abnormals have own tables and Attention Ladders.
- Teamwork: no assigned roles in fights. Attention Ladder (standard: just hurt it > hooked into its body > in reach > loudest/brightest > nearest) re-evaluated each time the Titan acts. Positions: Distant, In Reach, On Body, Blind Spot. Nape strikes only from Blind Spot and never by the soldier holding Attention. Anchor Rating (Open, Sparse, Wooded, Urban, Giant Forest) defines which Position steps exist (Open: Blind Spot only via On Body). Soft levers: Help (+1 die per helper, max 3, costs helper's action), Openings (extra setup successes become tokens spendable as Nape strike dice until Regeneration), Covering, initiative card swapping, Squad Tactics (Squad-owned team moves, once per engagement on a condition). No solo penalty.
- Turn: one move (one Position step) + one action. Reactions (dodge, block) happen on the enemy's turn but spend your own turn. Grabbed: torso Critical Injury + witnesses' Fear Rolls; next Titan card lifts (telegraphed); card after devours. Escape by Breaking the hand, Strength/blade self-escape, or breaking Attention. Background Titans are closing clocks that enter as a second Focus Titan when full; max 2 Focus Titans, beyond that the scene becomes a retreat. Read (Instinct, +2 dice from Distant): each success reveals one fact (Next Behavior, Attention Ladder, a Body Part's Toughness, Tempo, Regeneration speed) to the Squad; 2 successes can Call It (+2 dice to the target's Reaction). Chases: bands Grabbing Distance / Close / Far / Escaped, opposed Agility + horse Gear Dice vs Titan pursuit dice.
- Field gear: ODM Gear gives Gear Dice (1-3). Gas Roll once per round of ODM use (roll dice = Gas Rating, each 1 lowers it), extra Gas Roll after a Pushed ODM action; ODM Gear at 0 Jams (airborne = fall). Blade Sets counted in pairs; pushed blade die 1 ruins the set; swap free once per turn. Squad Supply for rations, flares, medical, ammo. Carry Strength + 4 items; Overloaded makes ODM moves cost your action too. Horses are gear (Gear Dice wear on Push, 0 = lame).
- Expeditions: pointcrawl of Legs between Waypoints; every Leg reaches the next Waypoint; Command sets Pace (Steady / Hard Ride); Vanguard leads (Instinct); failure doubles Squad Supply and Gas cost and raises hazard; hazard d6 picks the Formation Post hit (Vanguard, Flank Scout, Signal Relay, Center, Supply Wagon, Rear Guard), then d6 + Distance Band (Near/Far/Deep) + days outside + failure picks the hazard; the hit Post responds. Formation Posts change only at Waypoints. Plan Roll (Wits) before a mission yields Intel Questions and Preparation Points (Blades-style flashbacks).
- Characters: Lifepath (Origin d66, Why You Enlisted -> Drive, 3 Training Years with d66 events and performance rolls earning Merit, Graduation: Class Rank from Merit, Top 10 offered Military Police, pick one of 9 Specialties: Slayer, Flier, Hunter, Tactician, Leader, Medic, Engineer, Rider, Brawler). Optional Graduation Exam prologue with three Trials. Squad aims for 6 soldiers (PCs + Squadmates), 7 with a PC Squad Leader. Squadmates: light stat blocks, attach to a PC's Wing, act right after that PC from a short list, never Push, make Fear Rolls; on PC death a player promotes one.
- Campaign: Downtime = 2 Downtime Actions per soldier (Recover, Visit Haven, Train, Requisition, Maintain Gear, Investigate, Contribute to Research) + 1 Squad Action. XP from session questions buys Talents (5 x level); a new Talent needs a successful untrained use that session or a Train action; attributes never rise. Squad Points buy Squad Tactics and HQ Upgrades. Research Points buy Discoveries (some Canon Clock locked). Rank (Private / Squad Leader / Section Commander) via Commendations thresholds. Funding 1-6 sets Standard Issue and Requisition Gear Dice; Requisition = Empathy + Rank dice + Funding dice vs Scarcity; pushing it costs Commendations. Faction Standing -3..+3 dice with six factions. Operation Frames (objective clock, threat clock, special actions, outcomes) for Wall Defense, Holding Action, Capture Operation, Resupply Under Siege. Shifters: Intent Table, Hardening, Extraction clock instead of death, Shifter Stamina; Colossal Titan is a scene-wide disaster.
- Process: tables as YAML data, Markdown rulebook, dice simulator tuning against ADR-0014 targets.

## What to review (be concrete and adversarial)

1. **Contradictions** between ADRs, glossary definitions, and the summary.
2. **Mechanical interaction bugs and math risks.** Examples to probe, not an exhaustive list: pool sizes and success odds at the low and high end; Stress Dice + Scar minimum Stress as a death spiral or as an overpowered veteran bonus; locked 1s on Push interacting with Stress Dice 1s (does a locked stress-die 1 re-trigger?); Reactions spending your turn plus multiple Titan cards starving players of actions; Grab countdown timing vs initiative; whether "just hurt it" at the top of the ladder makes setup self-defeating or trivially exploitable; Openings economy; whether Health still matters after ADR-0005; Gas Roll dice math vs ADR-0014 gas targets; whether ADR-0014 targets are mutually achievable with this dice engine.
3. **Table and GM load.** Count what the GM tracks in a typical fight (Focus Titan: Body Part States, Regeneration clock, Nape cut carry-over, Attention, hidden Next Behavior, Tempo cards, Openings; Background clocks; Squadmates on Wings). Is it runnable at a real table and pleasant? Turn length, spotlight, learning curve.
4. **Attack on Titan fidelity.** Will it produce canon moments? What canon element from 845 to 850 is missing or mis-modeled?
5. **Year Zero Engine fit.** Where does the Alien/Coriolis hybrid become incoherent, or depart from what makes YZE play well?
6. **Hidden assumptions and gaps.** Decisions that were silently assumed and still need an explicit call before drafting.
7. **ADR-0003 compliance.** Where does GM discretion sneak back in?
8. **Foundry VTT v14 readiness** (light touch).

## Output format

Plain Markdown, at most about 2,000 words:

1. **Verdict** in 2 to 3 sentences.
2. **Findings**, ranked most severe first. Each finding: severity (Critical / Major / Minor), area, the problem, a concrete play scenario that shows it, the ADR or glossary term involved, and 1 to 3 fix options (options, not decisions).
3. **Open decisions** still needed before drafting, as a short list.
4. **Keep**: the 3 to 5 strongest parts of the design, one line each.

Be specific. Do not pad. Do not praise without a reason.
