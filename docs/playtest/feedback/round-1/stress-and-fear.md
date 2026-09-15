# Owner feedback, round 1: Stress Responses and Fear Rolls read bland

Owner note (verbatim): "Stress response and fear rolls result seem to be very bland compared to reference alien rpg panic table."

Research and opinion only. No rule was changed. Sources: `docs/rules/03-harm-and-mind.md` (sections 3.8 to 3.12), `data/mind/stress-responses.yaml`, `data/mind/fear-rolls.yaml`, `data/mind/scars.yaml`, `data/harm/effect-types.yaml`, `data/core/stress-changes.yaml`, `docs/rules/01-core-rules.md` (sections 1.5 and 1.6), ADR-0003, ADR-0004, ADR-0008, ADR-0010, ADR-0012, ADR-0014, `docs/rules/OPEN-QUESTIONS.md` and `DECISIONS-2026-09-14.md` (OQ-04, OQ-18, OQ-46 to OQ-52, OQ-97), the Chapter 3 reviews, the final review files, `docs/reviews/simulator-report.md`, `tools/sim/rules.py`, `tools/sim/dice.py`, `tools/sim/engine.py`, and the two source books (Alien RPG Evolved Edition pages 44 and 72 to 74; Coriolis: The Great Dark pages 68 and 69). Odds quoted without a source are exact enumerations of the D6 tables, computed in a throwaway script.

## What the rules do today

**Stress Response.** Triggered only by a Stress Die showing 1 on an attribute roll, before or after a Push; one per roll (ADR-0004; Chapter 1, section 1.5). Resolved at step 2 of *Finishing a roll*, after successes are counted and before the roll's effect. Roll D6 + Stress minus Resolve (Resolve is half of Instinct plus Empathy, rounded up, plus Scars, minus Grief). Nine rows:

| Total | Row | Kind | Mechanical effect |
|---|---|---|---|
| 0 or less | Steady | instant | nothing |
| 1 | Racing Thoughts | lasting | 1-die penalty on Read, Treat Injury, Field Repair |
| 2 | Narrowed Sight | lasting | 1-die penalty on Break Attention, Rally |
| 3 | Shaking Hands | lasting | 1-die penalty on Nape strike, Body Part strike, Break Free |
| 4 | Weak Knees | lasting | 1-die penalty on Fly, Ride, Dodge |
| 5 | Hair Trigger | lasting | 1 extra Stress on every Push |
| 6 | Flinch | instant | the roll loses 1 success |
| 7 | Locked Up | instant | loses 1 success; next turn spent |
| 8 or more | Botched | instant | the roll fails; gain 1 Stress |

Lasting rows are held; a repeat moves to the next row down; they end on Rally, at the end of the Titan Engagement, or when a day passes. Only Locked Up takes the soldier out of anything (one turn). No row touches another soldier, gear, Position, or Attention. No row creates a scene.

**Fear Roll.** Never caused by the dice. Five closed triggers (ADR-0003, item 1): first Titan Engagement, an Abnormal as Focus Titan, a second Focus Titan entering, a comrade Grabbed (every witness, never the victim), a comrade dying (every witness). One roll per soldier per event; none while Down. Same D6 + Stress minus Resolve. Nine rows, all instant:

| Total | Row | Mechanical effect |
|---|---|---|
| 0 or less | Steeled | nothing |
| 1 | Unnerved | gain 1 Stress |
| 2 | Rattled | gain 1 Stress; 1-die penalty on the next roll |
| 3 | Hesitate | next action spent |
| 4 | Falter | next action spent; gain 1 Stress |
| 5 | Frozen | next turn spent |
| 6 | Unguarded | next turn spent; no Reactions |
| 7 | Breaking Point | next turn spent; no Reactions; gain a Scar |
| 8 or more | Shattered | next 2 turns spent; no Reactions; gain a Scar |

A Drive shrugs off one whole result per session. Rows 3 to 8 take the soldier out of action for an action or one to two turns; rows 6 to 8 also let Titan behaviors land undodged. No row touches another soldier, gear, Position, or Attention. The only "story" a row creates is the Scar at 7 and up, which is the one place the mind rules carry AoT texture (Blood on the Blade, Cannot Look Away, Reckless Blade, Carrying Their Weight).

**Odds at Resolve 3 (the Rookie).** Stress Response: at Stress 0 to 2 the result is Steady or a lasting 1-die penalty, never worse. It first costs a success at Stress 3 (1 in 6) and costs a success or worse half the time at Stress 5. Fear Roll: a witness loses an action or turn 2 in 6 at Stress 1, 3 in 6 at Stress 2, 4 in 6 at Stress 3; loses a whole turn 1 in 6 at Stress 2 and 2 in 6 at Stress 3; gains a Scar only from Stress 4 (1 in 6). These are the figures OQ-50 and section 3.7 tuned against.

**What the simulator sees.** `tools/sim/rules.py` reads both YAML tables and models exactly these effect types: penalty, push-stress, lose-successes, zero-successes, spend-next-turn, stress-gain (Stress Response) and stress-gain, next-roll-penalty, spend-next-action, spend-next-turn, no-reactions, gain-scar (Fear Roll). Any other effect type raises `ValueError`. So the tables are not merely "expressible as data" (ADR-0003, ADR-0012): the simulator runs them from the data, which is why they can be changed cheaply and also why any new effect type is engine work.

## The reference systems

### Alien RPG Evolved Edition

**Stress Response (page 44).** Triggered by any stress-die 1 on a skill roll. Roll D6 + stress level minus Resolve. Eight rows: 0 or less Keeping Cool (nothing); 1 Jumpy (pushing costs 2 stress); 2 to 5 a minus 2 dice condition on one attribute's skill rolls each (Wits, Empathy, Agility, Strength); 6 Deflated (cannot push); 7 and up Mess Up (the action fails, plus 1 stress). Rows 1 to 6 are enduring conditions; a repeat gives plus 1 stress instead; they are removed one per stress level relieved. This is the table WoF's Stress Response is modelled on, and WoF's version is structurally the same: one nothing row, five lasting rows, three instant rows, a repeat rule, an ending rule. WoF traded the four attribute-wide minus 2 penalties for five entry-specific minus 1 penalties because WoF has six attributes and no skills (OQ-47; fable final review finding 5). Neither table has flavor beyond the row name. If the owner finds WoF's Stress Response bland, the Alien Stress Response table is bland in the same way; the difference the owner is feeling is the **Panic** table.

**Panic Roll (pages 72 and 73).** Triggered by events, not dice: witnessing a PC become broken, seeing a horrifying Xenomorph for the first time, a terrifying one coming Adjacent, witnessing another PC suffer certain panic responses, or a horrifying event the GM or adventure names. Same D6 + stress level minus Resolve. Thirteen rows, 0 or less to 12 and up, and they escalate through four kinds of consequence:

- **Personal cost** (1 to 3): Spooked (plus 1 stress), Noisy (nearby enemies alerted, GM's discretion), Twitchy (an immediate supply roll for air, ammo, or power, GM's choice).
- **Gear and social** (4 to 6): Lose Item (drop a weapon or important item, GM decides which; a quick action to pick up), Paranoid (cannot give or receive help until panic ends), Hesitant (initiative card 10 until panic stops).
- **Out of action** (7 and 8): Freeze (lose next turn, no interrupts), Seek Cover (interrupt move to full cover, minus 1 stress, lose next turn; in an open zone becomes Scream).
- **Contagion and fiction** (9 to 12 and up): Scream (lose next turn, minus 1 stress, every friendly PC in the zone makes an immediate panic roll), Flee (interrupt move away, minus 1 stress, friendlies in the starting zone plus 1 stress, must keep fleeing until safe; Catatonic if you cannot move), Frenzy (attack the nearest person or creature, friend or foe, until someone is broken; friendlies in the zone panic), Catatonic (collapse, cannot move until panic stops).

Four rows affect other characters (Noisy, Scream, Flee, Frenzy). Three reduce the panicker's own stress (Seek Cover, Scream, Flee), which is a pressure-release design. Non-immediate effects last until a COMMAND roll by someone in speaking range (a full action), until the panicker is broken, or until a stretch passes. A second panic while panicking stacks both responses, or takes the higher, or moves a repeat up one row. Two rows lean on GM discretion (Noisy, Lose Item), which ADR-0003 forbids in WoF.

**Mental Trauma (page 74).** A 9 or higher on a panic roll during a session forces an Empathy roll after the session; failure gives a D66 trauma. Twenty-two rows with named, mostly mechanical effects (Apathetic cannot push, Obsessive must push, Overwhelmed Resolve minus 2, Phobic, Flashbacks, Panic Attacks, Violent). WoF's Scars are the equivalent, gained instead in-fight at Fear totals 7 and up, plus surviving a lethal Critical Injury.

**What Evolved changed from the original Alien table.** The research extraction (`docs/research/research-alien-evolved.md`, line 20) records this from general knowledge, not from the book, and flags it for verification: in the 2019 edition any stress-die 1 went straight to the single panic table at D6 + stress with no Resolve; Evolved split it into a dice-driven Stress Response table (page 44) and an event-driven Panic table (pages 72 to 73), subtracted a new Resolve score from both, and moved the "what a Xenomorph does to your nerves" triggers onto events. WoF followed that split exactly (ADR-0004 names the Evolved model), and then wrote its Panic-equivalent as a second penalty ladder instead of a fiction ladder.

### Coriolis: The Great Dark

TGD has no stress dice and no panic table (pages 68 and 69). Pushing costs Hope (1s on base dice); external horror inflicts despair that an Empathy roll can cancel. The combat rule is **Fight, Flight, or Freeze**: a character who takes 1 or more despair from an external source in combat must, on their next turn, choose one of three: run at maximum speed away from the source, attack the source in close combat, or lose their next turn. At 0 Hope the character is broken by despair (one move a round, no actions) and rolls once on a D66 Mental Trauma table of twenty-two rows (conditions, ongoing penalties, phobias, derangements, catatonia, and a 66 heart attack). Recovery is A Friendly Voice, an Empathy action by a comrade that only works on a broken victim. TGD's lesson for WoF is different from Alien's: the three-way fork gives the player a choice inside the panic, so the fiction is authored at the table without a long random table, and the mental trauma is rare and heavy.

## Why now

The thinness has several real causes, and one is plain first-pass scope.

1. **The tables were built as tuning parts, not as scenes.** OQ-47's provisional choice (a) was picked because it "covers every kind of Catalog entry a Titan Engagement uses without a row per attribute" and "1-die penalties stop five lasting rows from stacking into pools of 1 base die"; option (c), instant results only, was rejected because it "removes the lasting harm that gives Rally its job". OQ-50's choice (a) was picked because it "ties every result to something Chapter 1 already tracks: Stress, turns, Reactions, and penalties". The decisions (DECISIONS OQ-47 and OQ-50, first pass, 2026-09-14) say "Keep (a), (d), (g)" and "Keep (a) and (d), all current Fear Roll rows including Hesitate" and give no reason about feel. No review round ever assessed flavor; all three Chapter 3 reviews checked completeness ("the Stress Response and Fear Roll tables cover -30 to 39"), odds, and ordering.

2. **Contagion was deliberately rejected.** OQ-50 option (b), "results that make other soldiers roll, such as a shout that spreads fear", was refused: "(b) cascades Fear Rolls across six soldiers, the load the codex final review flagged. No row causes another Fear Roll." The load finding is the codex gpt-6-astra final review, finding 11 ("A Grab can then require five witness Fear Rolls"), and the fable final review's item 12 ("whether Scream-style cascades are capped for seven soldiers"). OQ-97 then set the round-time band at 12 to 20 minutes for one Titan, and names "a round with a Grab may run to the band's top plus its witnesses' Fear Rolls, rolled together". So the absence of any Alien-style Scream or Frenzy rider is a decision, recorded, with a stated reason.

3. **The Fear rows are bound to an ADR-0014 target.** ADR-0014's fourth target ("a Grab kills about 1 time in 3 with comrades close") is measured through witness Fear Rolls: the six-cell acceptance test in section 3.12 (OQ-50, OQ-95) reads witness Stress 1 to 3 with Grief 0 and 1, and the rows were moved one step up the table during drafting so that a Stress 2 witness loses the whole turn 1 time in 6 rather than 1 in 3 (OQ-50, drafting revision). Section 3.12 states "Every Fear Roll row, including Hesitate, stays as written while Chapter 5 is tuned against this test", and batch 3 adds "No automatic future replacement of Hesitate is authorized". The table's shape (action lost at 3 and 4, turn lost from 5, Scar from 7) is what the simulator's Grab target passes on today: 33.2% in the named cell, worst cell 45.0% (simulator report, section 1).

4. **Closed effect types and no GM choice.** ADR-0003 item 8 forbids the GM from overriding table rolls, and `effect-types.yaml` gives every row exactly one closed reading; the `other` type ("stated effect") is reserved for Scars. Alien's Noisy ("GM's discretion") and Lose Item ("the GM decides which one") could not be ported as written. `effect-types.yaml` also records two deliberate abstentions under `never_used`: "No Chapter 3 table row uses the forbids hook for Help or Cover" (though OQ-18's hook exists exactly for a "Freeze or Flee result that stops a soldier Helping", per Chapter 1 review 3 finding 4) and "No Chapter 3 row damages, wears, or removes gear. Chapter 4 owns gear damage." So drop-your-blades and waste-your-gas rows were fenced off by chapter ownership, not by a design objection.

5. **The Stress Response resolves inside a roll.** It fires at step 2 of *Finishing a roll* on any attribute roll, including a dodge made on the Titan's card. A long or scene-changing result there stalls the card. That is a real reason to keep the Stress Response short; it is not a reason to keep the Fear Roll short, which is rare, event-driven, and rolled by all witnesses together (Chapter 5, section 5.3, `rolled_together`).

6. **The design brief asked for more than this.** `docs/research/research-prior-art.md`, recommendation 6, "Titan fear", says: use the Alien panic table with Mothership's inevitability, fold in T2K suppression ("being near a titan attack forces a Coolness-style roll or you freeze"), and Vaesen or Flood-style conditions and Scars for survivors. The Scars delivered on the last part. The panic-table texture did not survive the drafting pass. On that point the answer to "why" is simply first-pass scope: the drafter wrote the smallest tables that Chapters 1 and 5 could track and the simulator could measure, and nobody asked for more.

7. **The Stress Response table is almost invisible in play at the reference Stress.** The simulator reports the Rookie's Severity 3 dodge at 20.9% without Stress Responses and 20.7% with them, and the Flier template at 37.7% and 37.8% (`simulator-report.md`, section 2.4). At Stress 1 to 2 and Resolve 3 the table can only hand out 1-die lasting penalties, which barely move a 6-die pool. So "bland" is also measurable: the Stress Response table changes almost nothing until Stress 3 or a two-Scar veteran.

## Opinion

I agree with the owner, with changes. The tables are mechanically sound, closed, and tuned, and they play like a penalty menu. Three things the Alien Panic table does that WoF's Fear table does not: it changes what your character is doing in the fiction (flee, scream, hide, attack), it reaches other characters (four of thirteen rows), and it touches resources (a supply roll, a dropped item). WoF's nine rows are all variations of "you lose dice, an action, a turn, or Reactions". The row names are the only texture, and names like Hesitate, Falter, Frozen, and Unguarded are a synonym gradient, not four different soldiers doing four different things.

Where I disagree is on the remedy. Copying Alien's thirteen-row Panic table is the wrong move for WoF for four reasons.

- **Cascades are the wrong kind of load here.** Alien parties are four or five PCs in one zone; a WoF Squad is four PCs plus two Squadmates, all of whom witness a Grab across the field (OQ-86). A Scream that forces every witness to roll again would turn one Grab into two rounds of Fear Rolls, and OQ-97's round-time band is already at its top on a Grab round. The decision in OQ-50 (b) was right about the cost. It was wrong only in taking that as a reason to have no contagion at all: a row can spread Stress without spreading rolls.
- **The Fear rows carry a target.** The Grab rescue window is one or two actions. Today's table is calibrated so that a Stress 2 witness loses the rescue half the time and the whole turn one time in six. Any new table must keep that same "action lost / turn lost" profile at each total, or the six-cell test must be re-run and possibly re-decided. This is easy to respect: the fiction can change while the number of turns and actions spent stays the same.
- **GM discretion is out.** ADR-0003 rules out "GM decides which item" and "enemies nearby are alerted (GM's discretion)". Every WoF row must name the item (the Blade Set in hand), the Titan (the nearest Focus Titan, or the Titan that caused the event), and the Position step.
- **The Stress Response must stay short.** It resolves mid-roll on every attribute roll in the game, including the roll a Squadmate makes on a Titan's card. Its blandness is structural and shared with Alien's own Stress Response table. It should get better names and one line of read-aloud texture, not scene-changing rows.

What WoF has that Alien does not, and should use: a Titan Attention Ladder whose fourth rung is "loudest or brightest" (ADR-0010; `attention.yaml`, `loudest` flag, set today only by Draw Attention), a Position graph with a forced-move-toward-Distant procedure already written for retreats (`background-titans.yaml`, retreat; `engine.py`, `retreat_step`), a Gas Roll (`gas-roll`), Blade Sets that can be left on the ground (Chapter 4, `carrying.yaml`), a Help and Cover forbid hook (OQ-18, ADR-0003 item 13), and a Rally action that already exists to clear lasting states. Every AoT result the owner lists maps onto one of these without a new subsystem:

| Owner's image | Mechanical teeth available today | Interacts with |
|---|---|---|
| Freezing in place | spend-next-turn (exists) | Grab rescue window, ADR-0014 target 4 |
| Dropping blades | the Blade Set in hand is left at the soldier's Position; Swap Blade Set to refit (Chapter 4) | `effect-types.yaml` `never_used.gear_damage` must be amended; Chapter 4 ownership |
| Wasting gas in a panicked burst | an immediate Gas Roll, or Gas Rating minus 1 (Chapter 4, `odm-gear.yaml`) | same amendment; gas target is per round of ODM use, so one extra roll is a small, visible cost |
| Screaming that draws Titan Attention | the soldier holds the loudest flag for the nearest Focus Titan until the end of its next card that resolves a behavior (tracked value `draw-attention-set`, already automated) | ADR-0010: loudest is rung 4, so a soldier On Body, In Reach, or who just hurt it still outranks the screamer; a Distant screamer sets the flag but OQ-113 keeps Draw Attention's own action Distant-proof, so the row should say the flag is set only if the soldier holds a Position other than Distant |
| Retching at the carnage | spend-next-action plus gain 1 Stress (exists) | none |
| Berserk charge ("kill them all") | forced action: next action must be a Nape strike or Body Part strike on the Titan that caused the event, Pushed if short (the Reckless Blade Scar's wording); cannot Help or Cover until then (`forbids`) | ADR-0010: a striker who falls short draws the Titan's next behavior; in a Grab, a Body Part strike on the holding arm is the rescue, so berserk can lower the Grab death rate |
| Despair, stops fighting | spend-next-turn 2 plus no Reactions (Shattered's shape), or "turns spent until Rallied, at most 2" | Rally gets a job in the Fear table too |
| Clinging to a comrade | forced move one step toward the nearest comrade; cannot Help or Cover until the end of next turn; next action spent | ADR-0010 soft levers; no roll |
| Fleeing toward the Wall | forced move one step toward Distant on each of the next two turns (the retreat's move rule), then may leave; no Reactions | Positions and leaving (section 5.11); a soldier who leaves stops being a witness |
| Protective rage for a Squadmate | on comrade-grabbed or comrade-dies only: gain 1 Stress, and the soldier's next action must be against that Titan; +1 Bonus Die on it | this is a benefit row; it would move the six-cell test down |
| Laughing hysterically | gain 1 Stress; loudest flag; comrades within one Position step gain 1 Stress (Alien's Flee rider, without a roll) | contagion without a cascade |

On contagion specifically: the cheap, load-neutral form is Alien's Flee rider, not its Scream rider. "Comrades within one Position step gain 1 Stress" costs no roll, one sheet mark each, and it feeds the Stress spiral that ADR-0008 already governs, so it needs the OQ-04 trajectory model re-run but no new tracker.

Comparison in numbers, Resolve 3 in both games. Alien at stress 2: no Mess Up possible, no Panic row at 7 or above possible; the Panic table's contagion rows (9 and up) are unreachable below stress 6. WoF at Stress 2: a Fear Roll spends an action or turn 3 in 6. So WoF's table already bites harder, earlier, than Alien's; it bites in a duller way. The owner's complaint is about texture, not severity, and the fix should not add severity.

## Impact and options

**Chapters and files.** Chapter 3 sections 3.9 to 3.12 and their design notes; `data/mind/stress-responses.yaml`, `data/mind/fear-rolls.yaml`; `data/harm/effect-types.yaml` (new types, and the `never_used` block if gear or Help bans are used); `data/harm/sheet-fields.yaml` (any new lasting state and its end); `data/core/stress-changes.yaml` (a nearby-Stress row is a new named gain, so a new row under `gains`); Chapter 1 section 1.9 only if a row forbids Help or Cover (the hook exists; no Chapter 1 rule changes); Chapter 4 `odm-gear.yaml` and `carrying.yaml` for a Gas Roll or dropped Blade Set result (Chapter 4 owns those, so the row points at Chapter 4 and Chapter 4 gains a sentence); Chapter 5 `attention.yaml` (`loudest` flag gains a second `set_when`), `positions.yaml` (forced moves outside a retreat), section 5.9 (a berserk or rage row that changes the rescue); Chapter 2 `squadmates.yaml` (a forced action must be on a Squadmate's short list, or the row must say what a Squadmate does instead); the packet's Stress Responses, Rally, Fear Rolls, and quick reference; `tools/render/render.py` re-render (the drafter runs it).

**ADRs.** None needs amending for a rename-and-describe pass. A contagion row or a scream that sets Attention needs no ADR change but should be recorded against OQ-50 (b) as a revision (Stress spread, not roll spread) and against ADR-0010's soft-lever list (a Fear result that sets the loudest flag is a new way Attention moves). A gear row amends `effect-types.yaml`'s `never_used` note, not an ADR. A row that forbids Help or Cover uses ADR-0003 item 13 as intended. A berserk or flee row that forces an action or a move is the first Chapter 3 effect that decides what a soldier does on their turn; ADR-0003 item 9 (actions change tracked values) is satisfied because the forced act uses a Catalog entry, but it deserves an ADR-0010 note that a forced strike is not a "penalty for acting alone".

**CONTEXT terms.** Stress Response ("the harmful reaction set off when a Stress Die shows a 1") and Fear Roll need no change. If a Fear row can set the loudest flag, the Draw Attention entry's "An action that makes the soldier the loudest..." should say "or a Fear Roll result". If a Fear row forces a flight, the Retreat clock entry is unaffected but the forced-move wording in `positions.yaml` should say it is shared. No `_Avoid_` term is at risk; "panic" stays banned as a term (the CONTEXT entry avoids it), so row names must not use it.

**Simulator (ADR-0014).** Fear Roll rows feed: target 4's six cells (33.2% named cell, 45.0% worst), the first-Titan-Engagement sensitivity row (deaths 0.066 against the reference start's 0.050), every Sprinting Abnormal bar row (they all carry the abnormal Fear Roll), and the Medium deaths band already Missed at 0.0573 (OQ-132). Stress Response rows feed every measured roll: the lone cut (13.0% in an 8% to 14% band, close to the top), the Levi-grade cut (47.2%), the Jam test, and the prepared-Squad kill. A rerun is needed for any change to a row's numbers or effect types; a rename-only pass needs no rerun. New effect types (loudest flag, nearby Stress, forced move, forced strike, Gas Roll, dropped Blade Set) need `rules.py` and `engine.py` changes before the rerun; the engine already carries the loudest flag, the retreat's forced move, Gas Rolls, and Blade Sets, so each is a wiring job rather than a model. A forced strike on the holding arm during a Grab changes the rescue model and will lower the named cell; keep it off the rows that a Grab witness can reach at Stress 1 to 3 (totals 1 to 6), or accept re-tuning target 4.

**Character sheet.** Today the sheet holds lasting Stress Responses and when each ends, a pending next-roll penalty, and a pending ban on Reactions. New lasting states (Fleeing, Clinging, Berserk) need a field each with an end condition (Rally, the turn count, the end of the Titan Engagement). Keep every new state clearable by Rally so the sheet keeps one column.

**Table time.** Alien-style cascades break OQ-97's band; Stress-to-neighbours does not (one mark per neighbour, no roll). A flag set on the Titan's tracker row is one GM write. A forced move is one Position change on the Squad sheet. Keep it to at most one tracker write per row.

**Foundry (ADR-0003, ADR-0012).** Every new effect type is one more automation hook; the data-driven simulator is the proof that the shape holds. Flag-setting, Stress gains to soldiers within one step (the Help comparison already exists), a Gas Roll, and turn or action spending are cheap. Forced actions (berserk, flee, cling) are the expensive ones, because automation has to constrain a player's choices rather than apply an effect; on paper they are the cheapest and most vivid. Write them as "your next action must be X; until then you cannot Y" so the VTT can enforce them as a filter on the action list rather than as a scripted turn.

**Risks.** (1) Re-opening OQ-50's six-cell tuning; (2) Stress contagion feeding the ADR-0008 spiral for a two-Scar veteran (minimum Stress 2, Resolve 5: safe at the named cell, less safe with Grief 2); (3) forced moves colliding with Grabbed, Down, carried, and mounted states, each of which needs a stated exception (the retreat rule already lists them, reuse it); (4) a row that helps (protective rage) inverting the Fear Roll's meaning and lowering target 4 below its band; (5) the packet and simulator report both need regeneration, and PROGRESS.md's Done rows re-open for Chapter 3.

### Options

**Option A, rename and describe (effort S).** Keep every row's mechanics. Give each row a fiction-first name and a one-line `text` field in the YAML that the render and the packet print beside the effects ("You scream. Everyone hears it. Nothing else changes."). Add read-aloud lines to the Stress Response table too. No rerun, no ADR, no engine change. Fixes "reads bland" only. It is honest to say this is what a lot of Alien's texture actually is: Freeze, Seek Cover, and Catatonic are all "lose your next turn" with different prose.

**Option B, re-cut the Fear table on AoT rows, keep the Stress Response short (effort M).** Recommended. Ten Fear rows (0 or less to 9 and up) that keep today's action-and-turn profile at each total (the numbers the six cells were tuned on) and add texture through three cheap new effect types: `draw-attention` (the loudest flag on the nearest Focus Titan), `stress-gain-nearby` (comrades within one Position step gain 1 Stress), and `forced-move` (one step toward Distant or toward the nearest comrade, using the retreat's move rule). One row uses the OQ-18 hook to forbid Help and Cover. The Stress Response table keeps its mechanics and gets Option A's treatment plus one optional swap: Hair Trigger becomes a gas or blade row if the owner wants gear teeth (that swap alone pulls in Chapter 4 and is what moves this from M to the top of M). Rerun required: target 4's six cells, the first-Titan-Engagement row, the Abnormal bar, the Medium band, and the OQ-04 trajectory model for Stress contagion. Expected movement: within sampling on the six cells if the action and turn profile is held; the first-Titan-Engagement row and the Abnormal bar move by the Stress spread only.

**Option C, a full Alien-style ladder (effort L).** Twelve or thirteen Fear rows including a Scream that forces witness rolls, Flee and Frenzy as lasting states ended by Rally or the end of the fight, Lose Item and a Gas Roll row, and a Stress Response table with Alien's per-attribute minus 2 penalties. Reverses OQ-50 (b), re-opens OQ-97's band (a Grab round with a Scream is two rounds of Fear Rolls for six soldiers), needs five or six new effect types and matching engine code, a Chapter 4 ownership change, a Chapter 2 Squadmate list change, and a full retune of target 4. Most of C's texture is reachable in B without its load.

## Recommendation

Take Option B. Put the AoT texture where it is cheap and rare (the Fear Roll, five triggers, rolled together) and keep the roll-interrupting Stress Response short and renamed. Hold the "action lost, turn lost, Scar" profile per total exactly as today so the six-cell test is a check rather than a redesign, and add texture through effects the engine and the Attention rules already carry: the loudest flag, Stress to neighbours, and the retreat's forced move. Do not add rows that force witness re-rolls. Record the change as a new decision batch revising OQ-47 (names and text), OQ-50 (b) (contagion as Stress, not rolls), and `effect-types.yaml`'s `never_used` block if a gear row is taken; note it against ADR-0010's soft levers. Rerun the simulator after the YAML lands, before the packet is republished.

Two placement rules for the drafter, so the numbers hold: rows 3 and 4 spend the action (the Grab rescue window), rows 5 and 6 spend the turn, rows 7 and up spend the turn and give the Scar, and any forced strike goes only on a row at total 7 or higher, where a Stress 1 to 3 Rookie witness cannot reach it, so that the rescue model in target 4 is not changed by a berserk rescue.

## Sample rows

Recommended format: the YAML keeps `id`, `name`, `results`, `effects`, and `forbids`, and gains a `text` field (one or two sentences of second-person fiction, no rule words, no GM choice) that the render prints in a "What happens" column. Effects stay closed. Six Fear rows and two Stress Response rows, with today's row in brackets for the profile check.

| Total | Result | What happens | Effects (data) | Interacts with |
|---|---|---|---|---|
| 3 [Hesitate] | Hand Won't Fire | Your thumb is on the trigger and the anchor does not launch. You watch the hand close. | spend-next-action | Grab rescue window unchanged |
| 4 [Falter] | Retching | The smell hits you before the sight does: blood, steam, and what was inside a person. You fold over the saddle. | spend-next-action; stress-gain 1 | none |
| 5 [Frozen] | Someone Is Shouting Your Name | You hear it from far away. Your body does not move. | spend-next-turn 1 | none |
| 6 [Unguarded] | Scream | It comes out of you before you know it is yours. The Titan's head turns. | spend-next-turn 1; no-reactions; draw-attention (the loudest flag for the nearest Focus Titan, if you hold a Position other than Distant); forbids: [reaction] | ADR-0010 ladder rung 4; a comrade On Body, In Reach, or who just hurt it still outranks you; the flag lasts until the end of the Titan's next card that resolves a behavior |
| 7 [Breaking Point] | Run for the Wall | You wheel the horse, or fire the anchor the wrong way. Behind you, someone is still fighting. | spend-next-turn 1; no-reactions; forced-move (one step toward Distant, before the spent turn's action, as a retreat's move; ignored if Grabbed, Down, or carried); gain-scar; forbids: [reaction] | Positions and leaving (5.11); a soldier who leaves stops being a witness and cannot be Rallied |
| 8 or more [Shattered] | Nothing Left | You put the blades down. There is no point. Your comrades see it in your face. | spend-next-turn 2; no-reactions; gain-scar; stress-gain-nearby 1 (every comrade within one Position step); forbids: [reaction, help, cover] until the end of the second spent turn | contagion without a roll; OQ-18 hook; ADR-0008 spiral check for Scarred neighbours |

Alternative for 7 or 8 if the owner wants the berserk beat on the table rather than in the Reckless Blade Scar: **Kill Them All**: "You are not afraid. You are not anything. You go for it." Effects: forced-action (your next action must be a Nape strike or Body Part strike against the Titan that caused the event, Pushed if it falls short); forbids: [help, cover] until then; gain-scar. Interacts with ADR-0010 (a striker who falls short draws the Titan's next behavior) and, in a Grab, with the rescue itself, so it belongs at 8 or more.

Two Stress Response rows, mechanics unchanged, showing what Option A does to that table:

| Total | Result | What happens | Effects (data) |
|---|---|---|---|
| 3 [Shaking Hands] | Blade Chatter | The blades rattle in the handles. You cannot get the grip you trained for. | penalty 1 on Nape strike, Body Part strike, Break Free (lasting) |
| 7 [Locked Up] | Hanging on the Wire | You swing to a stop on the line and just hang there, watching. | lose-successes 1; spend-next-turn 1 |

## Questions for the owner

1. **Which table is the complaint really about?** The Alien table the note names is the Panic table, whose WoF counterpart is the Fear Roll. Is the Stress Response table acceptable with better names and a fiction line (Option A treatment), or should it also change mechanically, knowing it resolves in the middle of every roll?
2. **Contagion: Stress or rolls?** OQ-50 (b) rejected rows that make other soldiers roll, for table load. Is "comrades within one step gain 1 Stress" the contagion you want, or do you want Alien's Scream (every witness rolls again) and accept a longer Grab round?
3. **May a Fear result touch gear?** `effect-types.yaml` says no Chapter 3 row damages, wears, or removes gear. Dropping a Blade Set or burning a Gas Roll needs that fence moved and Chapter 4 to gain a sentence. Yes or no?
4. **May a Fear result decide a soldier's next action or move?** Flee, cling, and berserk are forced acts. They are vivid on paper and the hardest to automate in Foundry, and a forced strike on a holding arm changes the Grab target. Take them, take only the forced move, or keep results to spent turns and flags?
5. **Is the six-cell Grab band a hard constraint on this rewrite?** If the new rows must keep today's action-and-turn profile per total, the rewrite is a check. If you would rather re-tune target 4 around a berserk or rage row, that is a decision batch and a full rerun.
6. **Should any row help?** A "protective rage" row that adds a Bonus Die on the next act for a Grabbed comrade reads well and lowers the Grab death rate. Do you want the Fear table to be able to help, or should help stay with Drives and Squad Tactics?
7. **Scope of the pass.** Rename-and-describe only (S, no rerun), the recommended re-cut (M, one rerun), or the full ladder (L)?
