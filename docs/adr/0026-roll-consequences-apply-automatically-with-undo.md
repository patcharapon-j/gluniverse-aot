# Roll consequences apply automatically with undo

A roll starts from an Action Catalog entry. The roll dialog fills in the attribute and Talent, and the roller sets Bonus Dice, Circumstances, one Gear item, and, on a called roll, the GM's Stakes. The chat card shows the four die kinds apart, offers Push and Cover, and rolls the Stress Response itself when a Stress Die shows 1. Dice So Nice is a recommended module, not a requirement: the system registers its own dice styles (bone base dice, gunmetal Gear Dice, wax-red Stress Dice, flesh Titan Dice, the Wings emblem on success faces). The chat card never animates dice itself; it shows the result, with each die as an icon, and tables without Dice So Nice simply get the card. A Push rolls only the re-rolled dice through Dice So Nice and updates the same card in place.

Consequences that follow from the dice apply automatically: Stress gain, gear wear on a pushed 1, Gas Rating loss, and (from milestone 4) the round-end steps. Every card records what it changed and has an Undo button for the actor's owner and the GM, and the GM can switch auto-apply off per category in world settings.

## Considered Options

- One-click Apply buttons on the card: rejected by the owner as slower in play.
- Leave consequences to the table: rejected; the rules are data-shaped so the system can carry them (ADR-0003).
- The system's own three.js dice in the card: rejected by the owner after the first previews; Dice So Nice already tumbles the dice on screen, so rolling them again in the card is redundant.
- Requiring Dice So Nice: rejected; the card stands on its own.

## Amended

After decision batch 13 (2026-09-20, the owner's decisions on playtest feedback round 3, items 3 to 6; decision batch 13, 13-13): two changes, both from what the first session felt.

**Automatic application is a default the GM can step over** (ADR-0028). This record's "consequences apply automatically" and the per-category auto-apply switches stand as the default behaviour, and they are no longer the only path: Direct Control, the direct state setters, and every other override of ADR-0028 sit beside them, and an override writes the same note this record's cards write, marked as a ruling, and carries the same Undo. Automatic application is how the system helps; it is not an authority over the GM.

**A consequence about a soldier is rolled by that soldier's owner, on their own client, through a prompt card.** The system applied consequences on whichever client happened to trigger the step, quietly, with a one-line note afterwards, and the owner's four notes about silent harm and about the Flight bug were four faces of that. One prompt-card mechanism now carries all of it, and it carries these cases: **steam**, **falls**, **Critical Injuries**, **Gas Rolls**, and **the Flight**. A GM card names the cause and everyone affected, and each affected soldier's owner rolls their own die on their own client; a Critical Injury is rolled by the injured player; a Gas Roll prompts its owner at the round end; and a Flight prompts the moving soldier's owner, never whichever client called it, which is the bug this fixes.

**An unanswered prompt waits.** Waiting is the default, because auto-rolling by default would quietly restore the problem the prompt card exists to fix. The GM has a **"roll it for them"** control on every prompt as the live table's escape hatch, and an optional auto-roll **timeout** is offered for asynchronous tables, **off by default** and 60 seconds when switched on. The recorder and the round-end checklist tolerate a step that is waiting on a player.
