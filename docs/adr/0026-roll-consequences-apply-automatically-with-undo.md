# Roll consequences apply automatically with undo

A roll starts from an Action Catalog entry. The roll dialog fills in the attribute and Talent, and the roller sets Bonus Dice, Circumstances, one Gear item, and, on a called roll, the GM's Stakes. The chat card shows the four die kinds apart, offers Push and Cover, and rolls the Stress Response itself when a Stress Die shows 1. Dice So Nice is a recommended module, not a requirement: the system registers its own dice styles (bone base dice, gunmetal Gear Dice, wax-red Stress Dice, flesh Titan Dice, the Wings emblem on success faces). The chat card never animates dice itself; it shows the result, with each die as an icon, and tables without Dice So Nice simply get the card. A Push rolls only the re-rolled dice through Dice So Nice and updates the same card in place.

Consequences that follow from the dice apply automatically: Stress gain, gear wear on a pushed 1, Gas Rating loss, and (from milestone 4) the round-end steps. Every card records what it changed and has an Undo button for the actor's owner and the GM, and the GM can switch auto-apply off per category in world settings.

## Considered Options

- One-click Apply buttons on the card: rejected by the owner as slower in play.
- Leave consequences to the table: rejected; the rules are data-shaped so the system can carry them (ADR-0003).
- The system's own three.js dice in the card: rejected by the owner after the first previews; Dice So Nice already tumbles the dice on screen, so rolling them again in the card is redundant.
- Requiring Dice So Nice: rejected; the card stands on its own.
