# Rewrite plan: source sections to site pages

Sources are the drafts in `docs/rules/` (headings as of 2026-09-16) and the tables in `data/`. "Player" pages hold only what a player at the table needs; running advice and hidden values go to the GM's Guide. Page slugs are proposals; the skeleton's routes win if they differ.

Left out everywhere: every "Who uses these rules" section, the "Acts in this chapter" and "Rows and changes" lists, simulator tables in 5.13 and 6.6, and Appendix 2A.5 (tracked values).

## Player's Guide

### The Rules of Play (ch. 1)
| Page | Source |
|---|---|
| Dice and Successes | 1.1 The dice are final, 1.2 Dice, 1.3 Attribute rolls and the dice pool, 1.4 Counting successes |
| Pushing Your Luck | 1.5 Pushing (all subsections, incl. Covering and gas) |
| Stress | 1.6 Stress |
| Bonus Dice and Help | 1.7 Bonus Dice, 1.8 Help |
| Turns, Actions, and Reactions | 1.9 Turns, actions, and Reactions; the closing example |

### Making Your Soldier (ch. 2)
| Page | Source |
|---|---|
| What a Soldier Is | 2.1, 2.2 Attributes and derived values |
| The Lifepath | 2.3 (Origin, Why You Enlisted, Training Years and tables, performance roll, Graduation, Finishing) ; the creation example |
| The Graduation Exam | 2.4 |
| Drives | 2.5 |
| Specialties and Talents | 2.6, 2.7 (rules only; lists live in the Compendium) |
| Actions | 2.8, 2.9 (rules only; entries live in the Compendium) |
| Squadmates | 2.10 |
| Building Without the Lifepath | 2.11 |

### Wounds and Fear (ch. 3)
| Page | Source |
|---|---|
| Health and Harm | 3.1, 3.9 Effects that change rolls, turns, and Reactions |
| Critical Injuries | 3.2 |
| Down and Dying | 3.3, 3.4 |
| Treating Wounds | 3.5 Treat Injury, 3.6 Healing time |
| Stress Responses and Rally | 3.8 Resolve, 3.10, 3.11, 3.15 Stress in the field |
| Fear | 3.12 Fear Rolls |
| Scars and Grief | 3.13, 3.14 |
| After the Fight | 3.16 When a Titan Engagement ends; 3.7 (the Grab note folds into Fighting Titans: The Grab); the "bad round" example |

### Gear and ODM (ch. 4)
| Page | Source |
|---|---|
| Gear and Gear Dice | 4.1 (ratings, wear, firearms, prosthetics, kept items), 4.8 Field Repair |
| ODM Gear and Gas | 4.2, 4.3; the Jam example |
| Blades | 4.4 |
| Horses | 4.5 |
| Falling | 4.6 |
| Carrying | 4.7 |
| Standard Issue and Squad Supply | 4.9, 4.10, 4.11 |

### Fighting Titans (ch. 5, player side; ch. 6.1 reading)
| Page | Source |
|---|---|
| How a Titan Fight Works | 5.1 (what players see of setup), 5.3 The round (not "What the GM tracks") |
| Positions and Moves | 5.2 |
| Reading a Titan | 5.4, 6.1 Reading a stat block, Reading a Behavior Table |
| When a Titan Acts | 5.5 (resolving a card, dodging; not the hidden Next Behavior roll mechanics beyond what players see) |
| Attention | 5.6 |
| Cutting Titans Down | 5.7; the Nape kill example |
| Read and Call It | 5.8 |
| The Grab | 5.9, 3.7; the telegraphed Grab example |
| Retreat and Ending the Fight | 5.10 (player side), 5.11 |
| Squad Tactics | 5.12 (rules; entries in the Compendium) |

### Expeditions and Downtime (ch. 7, Early rules)
| Page | Source |
|---|---|
| Expeditions | 7.1 player side (route, the day, Formation Posts, riding a Leg, the Leg roll, Straggler, Night Camp, rations) |
| Downtime | 7.2 |
| Requisition | 7.3 player side |

### Skirmishes (ch. 7.4, Early rules)
| Page | Source |
|---|---|
| Skirmishes | 7.4 player side (Engaged and Apart, Ambush, rounds, attacks, Reactions, damage, weapons, Grapple, Parley, Size Up, ending) |

## GM's Guide (Commander's copy)
| Page | Source |
|---|---|
| Running Wings of Freedom | 1.1 (the dice are final, as GM principle), GM-facing notes across chapters |
| Running a Titan Fight | 5.1 setup table, 5.3 What the GM tracks, 5.5 Rolling the Next Behavior, 5.10 Background Titans and clocks |
| Titans | 6.1 Which Titan appears, 6.2 to 6.5 full stat blocks with hidden values (Abnormal secrets) |
| Tuning the Fight | 5.13 and 6.6 headline expectations only ("a prepared Squad kills a Medium Titan in about 3 rounds"), as plain guidance, no percentages or tables |
| Expedition Hazards and Nights | 7.1 GM tables (Leg Hazard table, Night Camp), the night example |
| Foes and Skirmishes | 7.4 Foes, the foe rule, Grit and breaking |

## Compendium (rendered from data, no prose rewrite)
Talents (data/character/talents.yaml, specialties.yaml), Actions (action-catalog.yaml), Specialties, Origins and Lifepath (origins, enlistment, training-years, class-rank, graduation-exam, lifepath), Gear (gear/*.yaml), Squad Tactics (engagement/squad-tactics.yaml), Scars (mind/scars.yaml), Titans (titans/*.yaml public side). Short intro lines per list are written in the voice guide's style; card text comes from the tables' player-facing fields.

## Reference
| Page | Source |
|---|---|
| Glossary | CONTEXT.md definitions, rewritten plain; no "Avoid" lists |
| Quick Reference | distilled from the finished Player's Guide pages, written last |
| Dice Tray | interactive; no source text |

## Learn to Play
Written after the Player's Guide: a short illustrated walkthrough (your first roll, pushing your luck, your first Titan) built only from finished pages.

## Order
1. The Rules of Play (proves the pipeline and review loop).
2. Making Your Soldier and the Compendium character lists.
3. Fighting Titans and the GM's Titan pages.
4. Wounds and Fear, Gear and ODM.
5. Expeditions and Downtime, Skirmishes, remaining GM pages.
6. Glossary, Quick Reference, Learn to Play.
