# Automation assists the GM and never blocks them

The Foundry system applies the rules for the table, and everything it applies is a **default the GM can step over**. Where the rules path and the GM disagree, the GM wins, at once, without leaving the tracker and without arguing with a guard. Recorded after the owner's decisions of 2026-09-20 on playtest feedback round 3 (`docs/playtest/feedback/round-3/OWNER-DECISIONS.md`, item 3; decision batch 13, 13-12), which state it in one line: automation assists the GM and never blocks them.

This is the Foundry counterpart of ADR-0024, which says the same thing about the paper game: the GM's judgment is valid and is part of the rules, and a ruling is a prompt at the table rather than a missing rule. ADR-0024 also draws the line the system must not blur: the GM rules **before** the dice, never after them. A tool that refuses a GM a legal state is a tool that has turned a data model into an authority, which ADR-0024 never gave it.

## What this means in the system

- **A Direct Control mode.** When it is on, every cell menu offers **every value**, not only the ones the rules path allows from the current state. The GM sets what they have ruled and moves on.
- **Direct setters** for every state the tracker holds: Grabbed, Pinned, Momentum, airborne, the anchor rating, the flags, Openings, Attention, whether a turn is spent, and whether a soldier is in or out of the fight. Each is set directly, without running the rule that would normally produce it.
- **Rules checks and permission checks are separate.** A guard that says "this is not what the rules would do" is not the same as one that says "you may not do this". The first is advice to the GM and a block for a player; the second is ownership.
- **Every override is recorded like the rule it replaced.** An override writes the **same note the rules path writes**, marked as a ruling so the log reads honestly, and it is **undoable** by the same Undo the automatic path offers (ADR-0026, as amended).
- **The legal path stays the default and stays first.** Direct Control is off until the GM turns it on, and in every menu the values the rules allow come first, so the common case is one click and the override is a deliberate one.

## Considered Options

- **Keep the guards and add exceptions as they are found:** rejected. The first session found four separate places where the system stood in the GM's way, and they were four faces of one design gap; patching them one at a time leaves the gap.
- **Drop the guards entirely:** rejected. The automation is why the system is worth running, and a player must still not be able to set another soldier's state. The fix is to separate the two kinds of check, not to remove one.
- **Ask for confirmation on every override:** rejected as slower in play, the same reason ADR-0026 rejected one-click Apply buttons. The record and the Undo are what make an override safe, not a dialog.
- **Log overrides separately from rules changes:** rejected. One log that marks its rulings is readable; two logs are reconciled by nobody.
