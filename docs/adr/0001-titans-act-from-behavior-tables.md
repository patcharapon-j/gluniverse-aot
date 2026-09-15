# Titans act from Behavior Tables, not ordinary turns

A Titan is modeled as a natural disaster rather than a combatant: it has no normal turn and acts from a Behavior Table. How a Titan dies is set by ADR-0007, and how the Squad works together against it by ADR-0010. We chose this over tactical turn-by-turn titan combat and over abstract single-roll resolution because it keeps the Titan World feel: read it, work around it, set it up, then kill.

## Considered Options

- Tactical combat where the Titan is a combatant with turns: rejected, it turns titans into big humans and loses the disaster feel.
- One team roll per Titan Engagement: rejected, too thin for the game's headline pillar.

## Amended

After the final design review (2026-09-14), removed wording that required breaking Body Parts before any kill and that gave each Squad member a fixed job. Both contradicted ADR-0010.

After decision batch 8 (2026-09-15, the playtest packet feedback round 1; ADR-0019): the table picks the behavior, and the entry then rolls its Attack Dice in the open. That is the parents' shape (a Xenomorph's signature attack and a Coriolis creature's both roll a fixed pool after a table picks them) and it changes nothing here: the Titan still has no turn, chooses nothing, never Pushes, and acts only from the Behavior Table, so it is still a disaster to be read and worked around, not a combatant. A whiffed card still resolves a behavior for the flags and the Next Behavior.
