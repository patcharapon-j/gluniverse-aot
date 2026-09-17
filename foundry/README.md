# Wings of Freedom (Foundry VTT system)

Wings of Freedom is an Attack on Titan game on the Year Zero Engine. This package is the
Foundry VTT system that runs it: actor and item sheets, the dice pools and roll cards, the
engagement tracker, and the compendia (talents, specialties, origins, gear, critical injuries,
titans, foes, squadmates, and field notes).

## Requirements

- Foundry VTT v14.
- [Dice So Nice](https://foundryvtt.com/packages/dicesonice) (optional). The system ships its
  own dice presets for it; without it, rolls still work and post as chat cards.

## Install

In Foundry's **Game Systems** tab, choose **Install System** and paste this manifest URL:

```
https://github.com/patcharapon-j/gluniverse-aot/releases/latest/download/system.json
```

Foundry downloads the latest release automatically. Updates work the same way, through
Foundry's own update check.

## Local development

This package lives in `foundry/` inside the main repo and is built with
[pnpm](https://pnpm.io).

```
cd foundry
pnpm install
pnpm build
```

`pnpm build` compiles the system into `foundry/dist/`, reading the shared rules data from
`../data` and the shared wording from `../site`. `pnpm watch` rebuilds on change.

To try it in a local Foundry install, symlink the build into your Foundry data folder:

```
pnpm run link
```

This links `foundry/dist` to `systems/wings-of-freedom` under your Foundry User Data folder
(override the location with `FOUNDRY_DATA` if it isn't at the default path). It only touches
that one symlink.
