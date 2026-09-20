# Wings of Freedom (Foundry VTT system)

Wings of Freedom is an Attack on Titan game on the Year Zero Engine. This package is the
Foundry VTT system that runs it: actor and item sheets, the dice pools and roll cards, the
engagement tracker, and the compendia (talents, specialties, origins, gear, critical injuries,
titans, foes, squadmates, and field notes).

## Requirements

- Foundry VTT v14.
- [Dice So Nice](https://foundryvtt.com/packages/dicesonice) (optional). The system ships its
  own dice presets for it; without it, rolls still work and post as chat cards.
- [Phil's Token Studio](https://foundryvtt.com/packages/phils-token-studio) (optional). Sheets
  open it on the actor whose Token you are drawing; without it, the same button opens Foundry's
  own prototype Token sheet.

## Install

In Foundry's **Game Systems** tab, choose **Install System** and paste this manifest URL:

```
https://github.com/patcharapon-j/gluniverse-aot/releases/latest/download/system.json
```

Foundry downloads the latest release automatically. Updates work the same way, through
Foundry's own update check.

## Using a character sheet

### Edit mode and Play mode

Every Soldier and Squadmate sheet carries a **Play / Edit** switch in its header.

- **Play** is how a sheet sits at the table. Everything a session moves still moves: health,
  stress, gas and spare canisters, Blade Sets, Critical Injuries, Scars, Stress Responses, the
  kit ledger, positions, bonus dice, rolls and notes. What the character *is* holds still: the
  name, the attributes, the Specialty, the Origin, Talent levels, the Drive, and the service
  record. Dropping an Origin, a Specialty or a Talent on a sheet in Play mode is declined.
- **Edit** opens the file for amendment and unlocks all of that. A red strip runs along the top
  and bottom edge while it is open, so nobody rewrites a character thinking they are playing one.
  The strip holds still under the Reduced and Off motion settings.

The choice is remembered per character, in this browser only: switching to Edit never changes the
world or what anybody else sees. A sheet with no Origin, Specialty or Talent yet opens in Edit, so
a new soldier reaches the Lifepath wizard straight away; every other sheet opens in Play.

### Character images

The plate in the header holds three buttons, and the same entries sit in its right-click menu:

- **Browse** picks an image already in the world.
- **Upload** takes one from your own computer. Dropping an image file on the plate does the same
  and sets the Token image too. Uploads are saved under `worlds/<world>/wings-of-freedom/portraits`
  unless the GM points **Character image folder** somewhere else in the system settings; each one
  is filed under the character's name, so a new image never overwrites an old one. Uploading needs
  Foundry's file upload permission.
- **Token Studio** opens [Phil's Token Studio](https://foundryvtt.com/packages/phils-token-studio)
  on that actor, where the Token can be drawn and saved. The module is optional: without it, the
  button opens Foundry's own prototype Token sheet instead, and a second button next to it always
  does. The plate menu also copies the portrait onto the Token, browses for a Token image on its
  own, and puts both back to the system's default art.

### Reading a Talent or an action in full

A sheet row has space for a line. Resting the pointer on one raises a card beside it with the rest:

- A **Talent** gives its description, its trigger and effect, the once-per limit and whether that
  use is spent, the Specialties that teach it, and the Talent dice it is worth.
- An **action** gives what it does, what it requires, what it needs, its gear requirement, how it
  is helped, and the pool this character would throw — attribute, Talent, Bonus Dice, Gear Dice,
  penalties and Stress, one line each — or why it cannot be rolled at all.

Names inside a card are cards of their own: rest on the action a Talent names to read that action,
or on a Talent listed under an action to read the Talent. The pointer can travel onto a card to
follow them; moving off, clicking, scrolling or pressing Escape closes it. Keyboard focus raises
the same card, and a screen reader reads it with the row.

The same cards sit behind the Lifepath wizard's own choices — the Talents offered by an Origin, a
Training Year, the Graduation Exam and the build steps, and the entries a Trial can be attempted
with — and behind the named chips on a Talent, Specialty or Origin slip, so a choice can be read in
full before it is made. Cards hold still under the Reduced and Off motion settings.

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
