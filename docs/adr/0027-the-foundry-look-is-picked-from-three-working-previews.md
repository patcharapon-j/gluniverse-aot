# The Foundry look is picked from working previews on the Titan World base

The system must look and feel premium and tactile, but flat: the sheet is HTML and CSS animated with anime.js, not a 3D scene. The first round of three previews (Survey Corps Dossier, ODM Apparatus, Beyond the Walls; kept in `foundry/design/preview-*.html`) was rejected by the owner as overkill. The base is now the owner's Titan World "field dossier" sheet (paper in a leather binder, numbered file tabs, stamps, CSS-only textures), done better: a 10px text floor, one 4px spacing scale, a real type scale, and a crest in the palette. A second round of three variants on that base, built from `foundry/design/preview-spec-v2.md`, is published as Artifacts for the owner to pick.

The owner picked **Personnel File** (`foundry/design/preview-v2-1-personnel-file.html`), with these changes:
- **Art and icons:** a mounted colour plate as the portrait, and the website's stamp icons throughout.
- **Silhouettes:** inked figures that show injuries viscerally, as in Titan World. Soldiers show Critical Injuries by location and side; Titans show Body Part States. A per-viewer Gore setting offers Low, Standard, or Graphic.
- **Regeneration clock:** the Titan's clock is drawn as a real segmented clock.
- **Pips and boxes:** these show how many dice each value puts in a pool (attribute pips, Talent level dots, Gear Dice boxes, Stress boxes).
- **Chat cards:** the header of a card is one line at most, and the body shows the dice rolled, the successes, and the effects.

**Locked tokens:** paper #ece2cb / #f4ecd8 / #e2d5b8 / #d6c6a4, ink #241f1b, red #8e2323, brass #b9924a, leather #3a2618, iron #34383c. Attribute inks: Strength #8e2323, Agility #2b6b5c, Wits #5c4a86, Perception #2f4a6e, Instinct #a3542c, Empathy #6e5325. **Fonts:** Playfair Display (names and numerals), Special Elite (labels), Noto Serif (prose), self-hosted as subset woff2. **Textures** are CSS only; Codex makes no materials.

**Generated art** (Codex, `board-game-icon-assets` for icons, the website's locked plate style for plates; ADR-0022), listed in `foundry/design/asset-inventory.md`: one stamp icon per Action Catalog entry, token status icons, three Foe plates, nine default Soldier portraits (one per Specialty), a setup-screen plate, and custom Dice So Nice faces. The dice faces are labels with transparent backgrounds and matching grooved bump maps, so the Dice So Nice material and colour of each die kind show through and the marks read as engraved. Talents reuse the dice and rule icons with a Specialty badge added in code; Origins and Critical Injuries reuse website icons; the silhouettes stay code-drawn SVG because their states change live. A style-lock set (4 Action icons, 2 status icons, 1 Foe plate, 1 Soldier portrait, the success face and one pip face of the dice) is approved on a contact sheet before any batch. Website icons are reused where they fit. UI glyphs use Phosphor.

**WebGL scope:** three.js draws only two small vitals widgets, the gas canisters and the blade sets, through one shared renderer that renders when a value changes (plus a short settle), not every frame; everything is torn down on close; `prefers-reduced-motion` respected, and a client setting offers Full, Reduced, or Off, where Off shows the widgets as static icons. No sound.

## Considered Options

- A 3D or WebGL-heavy sheet (the first round): rejected by the owner as overkill.
- Static mockups: rejected; the motion has to be felt.
- One renderer per sheet: rejected; browsers cap WebGL contexts near 16 and Foundry's canvas already holds one.
- UI sound from CC0 libraries: rejected by the owner.
