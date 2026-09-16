# Every rule must be expressible as data

Every procedure is written as tables, tracks, counters, and explicit triggers. "GM discretion" may appear as flavor but never as the rule itself. Titan World's heavy reliance on GM discretion was its biggest weakness at the table, and data-shaped rules make the later Foundry VTT v14 system a translation rather than a redesign, while still playing fully on paper.

## Drafting requirements

Added after the final design review (2026-09-14), where both reviewers found discretion leaking back in:

1. Fear Roll triggers are a closed list.
2. A flag on a Focus Titan, such as Draw Attention's, lasts until the end of the Titan's next card that resolves a behavior; a card that resolves nothing leaves it standing. A card whose Attack Dice whiff has still resolved a behavior (ADR-0019).
3. Every Drive is written as a trigger ("When I ...").
4. Preparation Points have a price list.
5. Every Mission Brief and Operation Frame lists its Commendation triggers.
6. Research Point awards come from a table.
7. Help states its Position requirement.
8. The rulebook forbids the GM from overriding table rolls, and a Titan's Attack Dice are rolled in the open and never re-rolled or adjusted (ADR-0019).
9. An action outside the Action Catalog changes only a tracked value. The player names the value; the action uses a Catalog entry that changes it, or, for a value whose creating rule names an attribute roll, that attribute alone. An action that changes no tracked value has no mechanical effect.
10. Faction Standing changes and Mission Brief complications come from tables.
11. Every Behavior Table entry lists its Position requirement, Body Parts used, Attack Dice (none on a telegraph-only entry), and fallback, every harming effect lists its Injury Type (ADR-0017), and every table has a Thrash entry.
12. Every rule that creates a clock, counter, obstacle, or other value that soldiers change by acting adds it to the tracked values with the entries or attribute roll that change it, and every chapter checks that each consequential act in its scope has a tracked value and an entry. Chapter 4 adds passing an item to a comrade and mounting or dismounting a horse.
13. A state or result that forbids Pushing, Helping, Covering, or Reactions names what it forbids on its own row. The core eligibility rules carry one shared hook for state and result bans; core requirements, roll-specific bans, and Squadmate restrictions still apply.

## Amended

After the open-question decisions (2026-09-14, OQ-18 and OQ-35): item 9 was rewritten and items 12 and 13 were added, as the list above now reads. Item 9 originally read "Actions outside the Action Catalog use the closest catalog action, or the attribute alone", which let an act with no tracked value borrow a Catalog roll. After the conformance review of the same day (Minor 9), the superseded wording was removed from the list itself so that the checklist is applied as amended.

After decision batch 3c (2026-09-14, the Chapters 1 to 5 conformance review round 2): item 2's "lasts until the Titan's next card" reads "lasts until the Titan's next card that evaluates its Attention Ladder". A decoy holds a Titan for as many cards as its Tempo (ADR-0010 as amended in batch 3b), and only the hold's last card evaluates the ladder; a flag that cleared on an earlier card of the hold would never be read.

After decision batch 3d (2026-09-15, OQ-111): item 2 reads "lasts until the Titan's next card that evaluates its Attention Ladder, or that comes up while it holds a Grabbed soldier". The Grab holds Attention (ADR-0010, decision batch 3), so a flag set during it is never read, and the first card after the release evaluates the ladder from a clean slate; the batch 3c wording left those flags standing by its words alone, against the rule as applied and measured.

After decision batch 3e (2026-09-15, the Chapters 1 to 5 conformance review round 3): item 2 is the one rule for every Attention flag and is edited in the list, as item 9 was: "A flag on a Focus Titan, such as Draw Attention's, lasts until the end of the Titan's next card that resolves a behavior; a card that resolves nothing leaves it standing." The batch 3c wording ("the next card that evaluates its Attention Ladder") let the inert card that ends a decoy's hold read a flag and clear it before the card that acts, and the batch 3d clause for a card that comes up while the Titan holds a Grabbed soldier was written for Draw Attention's flag only; both are withdrawn. The batch 3c and 3d paragraphs above are history.

After decision batch 4 (2026-09-15, Chapter 6 and the Chapters 5 and 6 conformance review round 1): the Attention Ladder's last tie-break no longer reads the Squad sheet's order, which no rule sets and whoever writes the sheet would choose; a tie the initiative cards cannot break, at the start of a Titan Engagement or at an end step, leaves the Titan's Attention held by nothing until its next card, which evaluates the ladder with that round's cards dealt (ADR-0010, as amended in batch 4). Every other step of the evaluation is a test on public facts, so no player or GM chooses who holds Attention.

After decision batch 7 (2026-09-15, the playtest packet feedback round 1): item 1's closed list gains one trigger, `first-human-kill` (the soldier who kills a person for the first time rolls, when the kill resolves; 7-17), and stays closed. Item 11 reads "Every Behavior Table entry lists its Position requirement, Body Parts used, Severity, and fallback, every harming effect lists its Injury Type (ADR-0017), and every table has a Thrash entry." Item 12 is met by the playtest rules chapter for every clock, counter, and outcome it creates (Leg, camp, and hazard outcomes; the Requisition grant and the ledger; foe harm, Held, a firearm's load, a foe's yield, a foe's revealed intent, and the ambush), each with the entry that changes it. Item 8 covers Skirmish foes: the closed targeting rule in `data/skirmish/foes.yaml` decides what a foe does, and the GM chooses nothing (ADR-0018).

After decision batch 8 (2026-09-15, the playtest packet feedback round 1; ADR-0019): three items are edited in the list. Item 2 adds that a card whose Attack Dice whiff has still resolved a behavior, so the flags clear and the Next Behavior is re-rolled as on any resolved card (8-1). Item 8 adds the Titan's open roll, which the GM never re-rolls or adjusts. Item 11 reads "Attack Dice" where it read "Severity", since the entry now lists the pool it rolls and the Severity is the number that roll scores; the batch 7 paragraph's wording of item 11 is superseded. Item 12 is met by the new tracked values `pinned` and `heave-count`, changed by `leap-clear`, `heave`, and the Body Part strike (8-9), and by `held-end`'s new changer `release` (8-12).

## Superseded

Superseded in full by ADR-0024 *The GM rules where the rules are silent; procedures stay data* (2026-09-16, decision batch 9, 9-18). The owner made GM judgment valid, which reverses the founding sentence above ("GM discretion may appear as flavor but never as the rule itself") and Chapter 1 section 1.1's "No dice by judgment". Every drafting item above that survives (2, 3, 4, 5, 6, 7, 10, 11, 13 unchanged; 1, 8, 9, 12 rewritten) is restated in ADR-0024 as a limit with the same number, so "ADR-0003, item n" reads "ADR-0024, limit n". ADR-0024 is the record to cite. This file is kept as history; no live rule cites it.
