# Wings of Freedom

Wings of Freedom is an Attack on Titan tabletop RPG built on the Year Zero Engine. Soldiers of the Survey Corps ride out beyond the Walls, fight Titans as a squad, and come back if they can.

This repo holds the game and the two products built from it.

| Folder | What it is |
| --- | --- |
| `docs/rules/` | The rulebook drafts |
| `data/` | Every table in the game as YAML, the single source for all numbers |
| `site/` | The player-facing compendium website (Astro) |
| `foundry/` | The Foundry VTT v14 system |
| `docs/adr/` | Design decisions |
| `CONTEXT.md` | The game's glossary |

## Foundry VTT system

Play Wings of Freedom in Foundry VTT v14 with full sheets for soldiers, Titans, Squadmates and Foes, a guided Lifepath for building soldiers, dice pools with Push and Cover, and a Titan Engagement tracker. [Dice So Nice](https://foundryvtt.com/packages/dicesonice) is supported but optional.

### Install

In Foundry's **Game Systems** tab, choose **Install System** and paste this manifest URL:

```
https://github.com/patcharapon-j/gluniverse-aot/releases/latest/download/system.json
```

Foundry picks up new versions through its normal update check. Build and development notes are in [`foundry/README.md`](foundry/README.md).

### Releases

Every push to `main` that changes `foundry/` or `data/` publishes a new release through GitHub Actions. The patch version goes up automatically.

## Status

The rules are in playtest and still changing. Squad and Expedition sheets are not in the Foundry system yet.
