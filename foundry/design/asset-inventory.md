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
| Dice So Nice d6 faces | only faces with a rules effect carry a mark (data/core/dice-pool.yaml), the rest are blank: 6 is the Wings emblem on base, Gear and Stress; Gear 1 a breaks mark; Stress 1 a stress mark; Titan 5 and 6 a Titan success mark (never the Wings emblem) | transparent PNG label + grooved greyscale bump map per face, 512 px | label is one neutral ink, recoloured per die kind by the colorset (see Dice So Nice presets below); bump derived from the same art so grooves line up |

## Style-lock set (approve before batch)
Action icons: Nape strike, Fly, Dodge, Rally. Status icons: Down, Grabbed. Foe plate: bandit. Soldier portrait: Slayer. Dice (locked): the four presets in `dice/final/`, shown on four rendered dice, one per die kind, each with its own baked label ink and material. Icons and plates: approved.

## Dice So Nice presets (locked)
Locked by the owner. The shipped set is `foundry/art-src/style-lock/dice/final/`: `<type>/face-<n>-label.png` (512 px, ink baked in) and `<type>/face-<n>-bump.png` for n = 1 to 6 and type = `db`, `dg`, `ds`, `dt`, plus `textures/{flesh,bone}-{texture,bump}.png`. Rebuild by running `make_textures.py` and then `make_dice.py` in `foundry/art-src/style-lock/dice/`.

One `dice3d.addDicePreset({type, labels, bumpMaps, colorset, system}, 'd6')` per die kind, each naming its own colorset (`dice3d.addColorset`) and listing six label files and six bump maps from `dice/final/<type>/`. Textures are registered with `dice3d.addTexture(id, {name, composite: 'multiply', source, bump})`. Blank faces use an empty label and a flat bump (`d6-blank`), so every array stays full. Type ids are proposals and must match the system's DiceTerm denominations. Sources: `foundry/art-src/style-lock/dice/make_dice.py` (marks, bumps, baked kind labels) and `make_textures.py` (seamless procedural textures).

**Per-face colour mechanism.** Dice So Nice draws an image label with the colorset's `labelComposite`: `source-over` draws the image as is, `tint` recolours every image label on the die with the one `foreground` colour. Per-face colour overrides exist only for Dice Library dice, not for presets a system registers. So the ink is baked into each kind's label PNGs (`make_dice.py`, `KIND_FACES`), every colorset keeps `labelComposite: 'source-over'`, and `foreground` only matters for text fallbacks. On Gear and Stress dice the 1 face is baked in signal-flare violet `#D4A8FF` (the Survey Corps emergency flare), so a 1 never looks like a 6. It scores 3.4:1 on gunmetal `#56605F` (6.8:1 on the darker rendered metal) and 4.4:1 on wax red `#8B2A21`, with a CIEDE2000 difference of 50 from brass and 39 from parchment. Red on red is avoided.

| Die kind | Preset type | Status | Face map | Locked source (in `foundry/art-src/style-lock/`) | Colorset | Body (background) | DSN material | Texture | Label ink (baked) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Base | `db` | locked | 6 Wings emblem; 1 to 5 blank | 6: `originals/dice-face-6-emblem.png` → `dice/d6-face-6`; blank: `dice/d6-blank` | `wof-bone` | `#EDE6D2` | `plastic` | `wof-bone` (`final/textures/bone-*`) | 6: `#29241D` iron-gall ink |
| Gear | `dg` | locked | 6 Wings emblem; 1 cracked cog; 2 to 5 blank | 6: as base; 1: `originals/die-mark-gear-1-cog.png` (first cog draw) → `dice/marks/gear-1-b` | `wof-gunmetal` | `#56605F` | `metal` | none | 6: `#E6C57C` brass; 1: `#D4A8FF` violet |
| Stress | `ds` | locked | 6 Wings emblem; 1 fracture; 2 to 5 blank | 6: as base; 1: `originals/die-mark-stress-1-fracture.png` (first fracture draw) → `dice/marks/stress-1-b` | `wof-wax` | `#8B2A21` | `pristine` (matte base under a hard clear coat: lacquered wax) | none | 6: `#F1E4C8` parchment; 1: `#D4A8FF` violet |
| Titan | `dt` | locked | 5 and 6 fang ring; 1 to 4 blank | 5, 6: `originals/die-mark-titan-bite-2a.png` (bite B1) → `dice/titan/titan-mark-b2a` | `wof-flesh` | `#D9B7A0` | `pristine` (rough base reads as skin, clear coat as a wet sheen; DSN has no subsurface material, so the translucency is painted into the texture) | `wof-flesh` (`final/textures/flesh-*`): pale mottled skin, cool bloodless patches, faint blue-violet veins | 5 and 6: `#3A0F0C` dark oxblood |
