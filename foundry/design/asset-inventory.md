# Foundry asset inventory

Source of truth for Codex generation (ADR-0022, ADR-0027). Icons use the Codex `board-game-icon-assets` skill and the website's stamp icon style block (site/design/art-style.md); plates use the website's locked colour-plate style block and style references. Originals are kept out of git (like site/art-src); shipped files are downscaled webp under foundry/assets/.

## Reused from the website (site/src/assets)
attr-*, specialty-*, die-*, body-*, harm-*, injury-*, gear-*, pos-*, tier-*, titan-*, tactic-*, talent-dice, talent-rule, roll-push, roll-stress, brand-emblem, seal-wax; plates for the four Titans and chapter art.

## To generate
| Family | Count | Frame / format | Notes |
| --- | --- | --- | --- |
| Action Catalog icons | one per entry in data/character/action-catalog.yaml (about 46) | stamp, one action frame for the family | directional arrows for movement actions |
| Token status icons | about 12: Down, Grabbed, Pinned, Airborne, Jam, Overloaded, Lame, Mounted, Blind Spot, Engaged, Apart, Carrying | stamp, round status frame, reads at 24 px on a token | confirm list against data/ at batch time |
| Foe plates | 3: bandit, military-police-trooper, garrison-sentry | colour plate, portrait crop | data/skirmish/foes.yaml |
| Default Soldier portraits | 9, one per Specialty | colour plate, portrait crop | original faces, canon-lookalike exclusions |
| Setup background | 1 | colour plate, 16:9 | system card and setup screen |
| Dice So Nice d6 faces | 1 to 5 as engraved pips, 6 as the Wings emblem; Titan d6 with 5 and 6 as success marks | transparent PNG label + grooved greyscale bump map per face, 512 px | label carries no colour of its own beyond the engraving so DSN colorsets (bone, gunmetal, wax red, flesh) show through; bump derived from the same art so grooves line up |

## Style-lock set (approve before batch)
Action icons: Nape strike, Fly, Dodge, Rally. Status icons: Down, Grabbed. Foe plate: bandit. Soldier portrait: Slayer. Dice: the 6 (emblem) face and the 3 pip face, each with its bump map, shown on a rendered die in all four colorsets.
