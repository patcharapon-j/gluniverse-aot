# The Soldier sheet overhaul: plan

The Soldier sheet is rebuilt to the owner's pick, the **Refined Dossier** (source `prev-a/src.html` in the design session scratchpad, built copy `foundry/design/preview-sheet-a-refined-dossier.html`; brief and audit in `foundry/design/sheet-overhaul-spec.md`). Same Personnel File, pressed flat: a slim header, one vitals band, index tabs on the file's right edge, and every quick roll filed under the attribute it rolls. The gas and blade widgets become the preview's **Instrument** drawings (SVG on the paper, motion through anime.js), and three.js leaves the system.

Work happens in the worktree `../gluniverse-aot-foundry` on branch `sheet-overhaul`. Nothing is committed by an agent; the owner commits. Live checks run once, at the end (section 10).

## 1. Goal

At the default window (860 x 820) the Soldier tab shows the vitals band, the attribute heads, the Bonus Dice picker, at least 20 quick-roll rows and the Talent list without scrolling. Every control the sheet has today still exists and does the same thing (section 6). The sheet stays right at 720 wide and at 1000 and up, and the Squadmate sheet, which reuses the band and two of the tabs, keeps working at its 600 px default.

## 2. Decisions

Owner decisions (2026-09-23):

- **Refined Dossier layout** for the Soldier sheet:
  - a slim header: a small clipped portrait plate, the kicker line with the file serial, the name with the status tags on its right, one read-only meta line (Specialty, Origin, Rank, Class Rank);
  - **one vitals band** of five cells: Health (with the Down stamp and the injury chips), Stress (boxes, stepper, the Scar minimum, the response chips), the **Resolve seal** (a wax seal; a click shows how Resolve is built), **Gas**, and **Blade Sets**;
  - **index tabs on the right edge** of the file instead of the tab row (01 Soldier, 02 Kit, 03 Wounds & Mind, 04 Record, each with its colour mark);
  - the **footer text on the binder edge** (the leather below the paper), not inside the paper;
  - **attribute heads own their quick rolls**: each attribute is a head (icon, name, Key stamp, its dice, its value) with its rolls listed under it; a click on the head rolls the attribute alone; the attribute's one-line summary moves to the head's tooltip;
  - **Bonus Dice and the Stress line on the quick-roll label line**: "Quick rolls", the Bonus Dice picker, and the Stress Dice every attribute roll adds, on one line;
  - a **compact Talent list** with expand: one line per Talent (icon, name, level pips, Dice or Rule, the use box), the rules text and the "for" line open in place;
  - **Kit ledger rows about 30 px**, every control inline;
  - **Wounds & Mind without the repeated Health and Stress tracks**: the band already shows them; the tab keeps the figure, injuries, responses, Scars and Grief, and gains a short **readout** of what the band is built from;
  - **Record as a typed form** that fills the width, with the rubber stamps and the notes visible.
- **Gas and blades**: the three.js widgets (ADR-0027, one shared WebGL renderer: `src/motion/widgets.ts`, `Widget3d.svelte`) and the current SVG rig (`EquipmentRig.svelte`) are replaced by the preview's **"1 Instrument"** design, drawn in Svelte as SVG with anime.js motion. The Engraved plate and Field kit variants and the preview's Gear switch are preview-only and are dropped. ADR-0027 and the stack line of ADR-0025 are amended (section 3.4).
- **Dice-pool glyphs are unchanged.** `.da .dt .db .dg .ds .dx` keep the look they have in `sheet.css` today (owner, 2026-09-23, after a trial of alternatives). The overhaul changes where glyphs sit, not how they look.

Plan decisions (made here, not owner calls):

- The overhaul is scoped to the Soldier sheet's frame and its four tabs. The Titan, Foe, Item and Lifepath windows keep their look; shared components gain opt-in variants instead of changing for everyone.
- The Squadmate sheet keeps its own frame (horizontal tabs, footer inside the paper); it picks up the new band (compact) and the new Kit and Wounds & Mind tabs because it reuses them (section 3.3).
- Haven and Canon Tie move from the header to the Record form, where Rank, Class Rank and Merit already are; the header meta line is read-only.
- The mode switch and the Token door stay in the header (right end of the kicker line), not in Foundry's window title bar.
- Header status tags stay read-only; Down toggles on the band's stamp, Airborne on the Kit tab (open question 2).
- A band chip (a Critical Injury or a Stress Response) takes the viewer to Wounds & Mind and highlights that card; the item still opens from the chip's context menu and from the card.
- The destructive Ruin stays an explicit button; the blade drawing is not clickable. The canister is a pointer shortcut for Spend 1 (the Spend 1 button is the keyboard path).
- The default window grows from 860 x 760 to 860 x 820 (the brief's size).
- New stylesheets per area, so steps can run side by side without editing one file (section 4).

## 3. Component map

### 3.1 Soldier sheet, file by file

| File | Today | After | |
| --- | --- | --- | --- |
| `sheets/components/SoldierSheet.svelte` | paper with header, vitals, tab row, body, footer | root `.wof-file`: the paper (`.wof-sheet.file`) and the index tab column side by side, the footer text on the binder edge below; panel switch slides in from the right (`slideIn`) | changed |
| `sheets/components/Header.svelte` | 76 x 96 plate, five editable fields on one line, tags row, crest with mode switch and Token door | slim: 52 x 62 clipped plate; kicker line (specialty icon, kicker, serial, mode switch, Token door); name row (name input, tags on the right); read-only meta line; crest dropped | changed |
| `sheets/components/Plate.svelte` | plate with caption and buttons under it | adds `size="slim"`: no caption, the browse, upload and Token buttons move into a hover and focus overlay; the context menu and file drop stay | changed |
| `sheets/components/Vitals.svelte` | strip of five columns, rigs for gas and blades | the band: Health, Stress, Resolve seal, Gas, Blade Sets cells; keeps the `compact` prop for the Squadmate | changed |
| `sheets/components/HealthTrack.svelte` | boxes, two rows of four past 4 | adds `size="band"`: one row, preview box size (15 x 19) | changed |
| `sheets/components/StressTrack.svelte` | boxes, wraps, tally past `max` | adds `size="band"`: one row, 12 x 17 boxes, `max` 10 in the band, tally past it | changed |
| `sheets/components/GasInstrument.svelte` | none | new: fitted canister, pressure dial, spare rack (section 5) | new |
| `sheets/components/BladeInstrument.svelte` | none | new: trigger handle and blade, scabbard of stored sets (section 5) | new |
| `sheets/instrument.ts` | none | new: pure geometry and change rules for the two instruments, unit tested | new |
| `sheets/components/EquipmentRig.svelte` | the SVG rig | deleted | deleted |
| `sheets/components/Widget3d.svelte` | three.js canvas (already unused since the rig landed) | deleted | deleted |
| `motion/widgets.ts` | the shared three.js renderer | deleted | deleted |
| `motion/fx.ts` | anime.js wrappers | adds `slideIn`, `thud`, `flick`, `drain`, `puff`, `swing`, `slideHome`, `snap` (all through `fx()`, so Motion and reduced motion gate them in one place) | changed |
| `sheets/components/Tabs.svelte` | numbered folder tabs in a row | adds `edge="right"`: vertical index tabs, `aria-orientation="vertical"`, ArrowUp and ArrowDown as well as Left and Right, Home and End; the default stays the row the Titan and Squadmate sheets use | changed |
| `sheets/tab-keys.ts` | none (key logic inline in Tabs) | new: `nextTab(key, index, count)`, unit tested | new |
| `sheets/components/TabSoldier.svelte` | attribute cards, quick rolls in tiles, Talents with full text, Enlistment box | attribute heads with their rolls in columns (2, or 3 at 900 px and up), the label line, compact Talents, Drive card, Enlistment card (Key, Load), dice legend | changed |
| `sheets/components/Pips.svelte` | clickable dice glyph rating | adds `variant="square"` for Talent levels (the preview's small squares); the glyph default is unchanged | changed |
| `sheets/components/Sec.svelte` | section rule with § number and hint | unchanged markup; inside `.wof-sheet.file` it is styled as the light label (red title, small § number, hint, no rule line) | CSS only |
| `sheets/components/TabKit.svelte` | ledger rows about 45 px, option checkboxes under the name | ledger: icon, Article, Status stamp, Gear Dice, Kept; status stamps are the toggles; rows with extra fields (a dismounted horse's Position, a prosthetic's side) open a sub-row; the rest of the tab as compact fields | changed |
| `sheets/components/TabWounds.svelte` | figure, Health and Stress tracks, Resolve, injuries, Scars, responses, field record | three columns: figure (150 px) with the Gore switch; Critical Injuries and Stress Responses; Scars and Grief, the readout, the field record; no tracks | changed |
| `sheets/components/TabRecord.svelte` | narrow form box, loose stamps, notes below the fold | the typed form across the width (Haven and Canon Tie added), earned stamps pinned to its corner, notes on ruled paper under it | changed |
| `sheets/sheet-state.svelte.ts` | `view`, `tab`, `bonus` | adds `openTalents` (a set of item ids, so an open Talent survives a re-render and a tab switch) and `spotlight` (the injury or response card to highlight after a band chip is clicked) | changed |
| `sheets/soldier-sheet.ts` | 860 x 760 | 860 x 820; the Soldier window gets class `wof-file-window` so its content padding leaves room for the tab column | changed |
| `sheets/soldier-view.ts` | view builder | small additions only if a component needs a derived value it cannot read today (for example the milestone list moves here from `TabRecord` if the header or band needs it); no rules change | maybe |
| `sheets/components/ModeSwitch.svelte`, `EditBanner.svelte`, `TokenButton.svelte`, `LifepathBanner.svelte`, `DetailCards.svelte` | as today | unchanged; placed in the new frame (Edit banners at the paper's top and bottom edge, the Lifepath banner between the band and the pages) | placed |
| `index.ts` | exposes `widgetStats` on `game.wof` | the import and the `game.wof.widgetStats` entry are removed | changed |

### 3.2 Dead code and tests

- `src/motion/widgets.ts` (the renderer, 621 lines) and `src/sheets/components/Widget3d.svelte`. `Widget3d` has had no importer since the SVG rig landed (commit 33d28af); `widgets.ts` is kept alive only by `index.ts` importing `widgetStats`, which is why three.js is still in the bundle.
- `src/sheets/components/EquipmentRig.svelte`, once the band mounts the instruments.
- `test/widgets.test.ts` (four tests: renderer lifecycle, one WebGL context, dispose on last unmount, Reduced motion).
- `three` and `@types/three` in `package.json` (and the lockfile, through `pnpm remove three @types/three`).
- `tools/build-equipment-preview.mjs` and `tools/check-equipment-browser.cjs`: they compile `EquipmentRig` into a workbench page and drive it; neither is part of the build. The `foundry/design/equipment-*` files stay as design history.
- `sheet.css`: the ODM rig section ("ODM mechanisms fitted into a worn equipment cradle", about lines 964 to 1038) and the widget-slot rules of the compact vitals (about 903 to 914), with the rest listed in section 4.

**Is three.js used anywhere else?** No. `src/motion/widgets.ts` is the only file that imports `three`. The engagement board (`src/board/`) draws with Foundry's own PIXI; the tracker (`src/tracker/`) is HTML; the dice (`src/dice/`, including `dsn.ts`) render through Dice So Nice, which ships its own three.js inside that module. Nothing else in `src/` or `tools/` imports it.

### 3.3 The Squadmate sheet

`SquadmateSheet.svelte` reuses `Vitals` (with `compact`), `TabKit`, `TabWounds`, `Tabs`, `Sec`, `Pips`, `ModeSwitch`, `TokenButton` and `EditBanner`. What changes for it:

- **Band**: the new band renders in the Squadmate's 600 px window. At a paper narrower than about 640 px the band lays out as two rows (Health, Stress, Resolve; then Gas and Blade Sets), each cell full height, instruments at their narrow size (80 x 24 canister, 96 x 24 blade). `compact` keeps its current meaning: response chips are plain chips, not links.
- **Wounds & Mind**: loses the Health and Stress tracks as the Soldier's does; the band above shows them, so nothing is lost. In the Squadmate's narrow window the three columns fold to figure plus one column, then the second stack below (container queries on the paper, as in the preview's width responses).
- **Kit**: the new ledger, the same at 600 px (the Status column narrows; the Article's sub text hides).
- **Tabs**: stays the horizontal row (`edge` default); the Squadmate keeps its footer inside the paper.
- **Sec**: the light label style applies inside `.wof-sheet.file` only; the Squadmate root gets the `file` class too, so its sections read the same as the tabs it borrows. The Titan, Foe, Item and Lifepath windows keep the § rule.

Step 3 ends with the Squadmate sheet open beside the Soldier sheet and working; the live pass (section 10) screenshots it once.

### 3.4 ADR text changes

**ADR-0027** (`docs/adr/0027-the-foundry-look-is-picked-from-three-working-previews.md`):

1. Replace the whole paragraph that begins "**WebGL scope:** three.js draws only two small vitals widgets" with:

   > **Gas and blades:** the two kit vitals, the gas canisters and the Blade Sets, are drawn as SVG instruments on the paper (a side-on canister with a gauge window and a pressure dial, a rack of spare canisters, a trigger handle with its segmented blade, a scabbard of stored sets) and animated with anime.js like the rest of the sheet. `prefers-reduced-motion` is respected, and a client setting offers Full, Reduced, or Off, where Off draws them still. The sheet uses no WebGL. No sound.

2. In "Considered Options", after "One renderer per sheet: rejected; ...", add:

   > - three.js widgets for the gas and blades through one shared WebGL renderer: built in milestone 2, then withdrawn (owner, 2026-09-23). They read as dark boxes on the paper, held a WebGL context, and kept three.js in the bundle for two small drawings.

3. At the end of "Amended", add:

   > After the Soldier sheet overhaul (owner, 2026-09-23; `foundry/docs/sheet-overhaul-plan.md`): the **two-widget WebGL scope is withdrawn**. The gas canisters and the Blade Sets are SVG instruments animated with anime.js (the "Instrument" drawing of `foundry/design/preview-sheet-a-refined-dossier.html`), and three.js leaves the system. The sheet and the tracker use no WebGL; the engagement board's PIXI context, under its own budget above, is the only one the system makes. The Soldier sheet's layout is the **Refined Dossier**: a slim header, one vitals band (Health, Stress, the Resolve seal, Gas, Blade Sets), index tabs on the file's right edge, the footer on the binder edge, attribute heads that own their quick rolls, and a Wounds & Mind tab without the repeated tracks. The locked tokens, fonts, dice-pool glyphs and the flat-and-paper lock are unchanged.

   The two earlier amendment paragraphs that mention "the two-widget WebGL scope" stay as written; they are dated history and the new paragraph supersedes them.

**ADR-0025** (`docs/adr/0025-the-foundry-system-is-a-separate-product-built-from-shared-data.md`):

1. Stack bullet: replace "; three.js (WebGLRenderer) only for the gas and blade widgets (ADR-0027)." with "; no WebGL on the sheets: the gas and blade instruments are SVG (ADR-0027, amended 2026-09-23), and the engagement board draws with Foundry's PIXI (ADR-0029)."
2. Soldier sheet bullet: replace "a persistent vitals rail (portrait, Health boxes, Stress, Resolve, Down, ODM, Gas, and Blade gauges) and four tabs: Soldier, Kit, Wounds & Mind, Record." with "a slim header with the portrait, one persistent vitals band (Health with Down, Stress, Resolve, Gas with the ODM Gear Dice, Blade Sets), and four index tabs on the file's edge: Soldier, Kit, Wounds & Mind, Record."
3. "Plain ESM with three.js vendored" under Considered Options stays (history). "WebGL budget" in the review checklist stays (the board has one).

**`foundry/docs/core-plan.md`**: section 2 file layout, "three 0.186" leaves the `package.json` line and "(2e) widgets.ts, the one three.js renderer" leaves the `motion/` line; the 2e row keeps its history, with "(three.js widgets withdrawn 2026-09-23, see `docs/sheet-overhaul-plan.md`)" added after "blade set widgets"; section 9 gets a status note when the overhaul lands, closing the pending call recorded in "The kit vitals, read at a glance".

## 4. CSS

**Tokens.** Everything reads the locked tokens on `.wof-app` (`sheet.css` lines 7 to 26): paper, ink, red, brass, leather, iron, the six attribute inks, the 4 px spacing scale, the type scale with its 10 px floor, the three fonts, `--ease`, `--ink-grain`. No new colour tokens. Two scoped overrides: `.wof-sheet.file { --gr: 12px; }` (the right gutter narrows because the index tabs stand outside the paper) and each index tab's `--tc` (red, iron-hi, agi, brass). The instrument drawings use their own metal paints (steel, brass, glass, gas), defined once as SVG gradients inside each instrument.

**New stylesheets**, registered in `static/system.json` after `sheet.css` (step 3 registers all of them at once, so no other step edits `system.json`):

| File | Holds | Owner step |
| --- | --- | --- |
| `styles/instrument.css` | canister, dial, spares rack, blade, scabbard, their stamps and hover states | 2 |
| `styles/dossier.css` | the file frame (binder padding, paper, eyelets, index tab column, binder footer), slim header and plate, the band and its cells, chips, stepper, Resolve seal and popover, light section labels inside `.wof-sheet.file`, width responses (container queries on the paper at 700 and 900 px), and the motion gates below | 3 |
| `styles/dossier-soldier.css` | attribute heads, roll rows, label line, Talent list, Drive and Enlistment cards, legend | 4 |
| `styles/dossier-kit.css` | ledger, status stamps, Kept clip, canister chips, load bar, the fields below the ledger | 5 |
| `styles/dossier-wounds.css` | the three columns, injury and response cards, healing days, Grief, readout | 6 |
| `styles/dossier-record.css` | typed form, stamps, ruled notes | 7 |

**`sheet.css` sections the overhaul replaces** (deleted in step 8, after checking with a grep that no other window still uses each class): Header (from "── Header", about 146 to 200); Vitals strip and track boxes (201 to 297, the track box rules move to `dossier.css`); the kit vitals (298 to 327); Attribute cards, Quick rolls, Talents and file notes (374 to 459); Kit (460 to 494); Wounds & Mind up to the figure (495 to 548); Record (615 to 639); Narrow (640 to 666); compact vitals (903 to 914); ODM rig and the Health-above-Stress layout (964 to 1067); header controls (1089 to 1098). **Kept**: the window and paper base, base controls, mini buttons, Tabs (the row still serves the Titan and Squadmate), the § section rule (other windows), dice glyphs (unchanged), the figure and Gore, the Titan, Foe, Squadmate and item sections, the Edit strip, the plate and its drop state, the hover card.

**Motion gates in CSS.** Hover lifts, the sheen sweep, the index tab slide and the Talent expand are CSS transitions. They run only under `.wof-sheet[data-motion=full]`; under `reduced` only colour and opacity transitions remain, at 160 ms at most; under `off`, and under `@media (prefers-reduced-motion: reduce)`, none. Nothing loops.

**Text floor.** No text under 10 px. The preview draws the DRY and EMPTY stamps and the scabbard count as SVG text at 7 to 7.4 px; in the system they are HTML stamps laid over the drawing at `--t-xs` (a test guards this, section 8).

## 5. The Instrument: gas and blades

### 5.1 Pure part: `src/sheets/instrument.ts`

- `needleAngle(level, full)`: `-110 + (level / full) * 220` degrees, clamped; the dial's red arc sits at the empty end.
- `gaugeBands(level, full)`: one band per point of full Gas Rating (`view.fullGas`, 3 today), laid across the 42 px gauge window; on or off.
- `gasStamp({ hasOdm, jammed, level })`: `noOdm`, then `jammed`, then `dry`, else none (the same order as today's note).
- `sparesShown(spares, room)`: the first `room` spares as canisters (4 in the band, 3 under 700 px) and the rest as a count ("+2") that opens the Kit tab.
- `bladeState(gear)`: the set in the handles (its Gear Dice) or none, and the stored count.
- `gasChange(prev, next, swapRequest)` returns `spend`, `fill`, `swap`, or nothing; `bladeChange(prev, next)` returns `ruin`, `fit`, or nothing. The first render and a change of the Motion setting never animate. The rules are the ones `EquipmentRig` runs inline today, moved here so they are tested; any client's update (a roll's gas loss, the GM, another player) animates the same way.

### 5.2 Components

**`GasInstrument.svelte`**: props `level`, `full`, `spares`, `stamp`, `disabled`, `swapEvent`, `onspend`, `onfit(index)`.
- The fitted canister, 100 x 30 (80 x 24 under 700 px): brass end caps, steel body, glass gauge window with its bands, brass valve, the pressure dial with its needle at `needleAngle`. It is a `<button tabindex="-1">` whose click spends 1 (the band's Spend 1 button is the keyboard and screen-reader path); its tooltip reads the level.
- The spare rack: small upright canisters (11 x 28) on a leather strap, each a `<button>` (label and tooltip `WOF.Sheet.gas.fitThis`) that fits it; the overflow count as a small chip.
- The stamp (Dry, Jammed, No ODM) as an HTML `.stamp` over the gauge; with no ODM Gear the drawing dims.

**`BladeInstrument.svelte`**: props `inHand` (the set's rating, or null), `stored`, `disabled`, `onswap`.
- The handle and blade, 120 x 30 (96 x 24 under 700 px): leather grip, iron body, brass trigger, the blade in two pieces (base and tip) so it can snap. `role="img"` with the label "In hand" or "Empty"; not clickable. Empty handles show the blade's dashed outline and an HTML "Empty" stamp.
- The scabbard, 24 x 30: a leather box with up to three blade edges standing out of it and the stored count on a brass plate (HTML, 10 px or more). A `<button>` that swaps (fits one) when a set is stored and the handles are empty, `aria-disabled` otherwise.

Gradient and clip ids are prefixed with `$props.id()`, so two sheets open at once never share an id. The band cell around each instrument keeps what it has today: the label with its icon, the level over full (gas) and the ODM Gear Dice (`Dots`, tooltip `gas.odmDice`), the in-hand Gear Dice and the Blade Discipline note (blades), and the mini buttons Spend 1, Change, Ruin (red), Swap, all behind the same busy lock (`equipmentAction`) and the same `soldier-ops.ts` calls (`spendGas`, `fitCanister`, `ruinBladeInHandles`, `fitBladeSet`).

### 5.3 Motion (anime.js through `fx()`)

| Change | Full | Reduced | Off |
| --- | --- | --- | --- |
| Spend | the emptied band drains (scaleX to 0, 260 ms, a ghost band over the new state); a puff at the valve (scale and fade, 300 ms); the needle swings from the old angle (300 ms, slight overshoot) | the needle jumps; the gauge flashes (opacity, 160 ms) | static |
| Change or fit a spare | the canister slides home from 12 px right with a small overshoot (240 ms); the click marks flash; the needle swings; the returned canister fades into the rack | a fade on the canister (160 ms) | static |
| Ruin | a ghost of the blade: the tip snaps away (rotate, drop, fade, 260 ms), a spark (180 ms), the base fades; then the Empty stamp thuds (scale 1.6 to 1, 220 ms) | the ghost fades (160 ms) | static, no ghost |
| Fit a blade | the blade slides in from 26 px right (260 ms) | a fade (160 ms) | static |
| Hover | lift 1 px and a sheen sweep across the steel (CSS, Full only) | none | none |

Ghosts render from the previous snapshot while their animation runs and are removed on completion, with a timer backstop (as `countUp` has) so a sleeping tab cannot leave one behind. The Motion setting is read through `motionMode()`, which already caps Full at Reduced when the OS asks for reduced motion.

### 5.4 Accessibility

Every control is a real button with a label: canister (tabindex -1, duplicate of Spend 1), each spare, the scabbard, and the four mini buttons. The drawings carry `role="img"` and a label from the existing strings (`gas.level`, `blades.hand`, `blades.handEmpty`, `blades.stored`). Disabled state (Observer, Play without rights, busy) disables every button, drops the hover lift and the pointer cursor. Focus shows the paper's blue outline. No information is in colour alone: the stamps carry words.

## 6. Behaviour parity

Every control on today's Soldier sheet, and where it lives after.

**Header**
- Portrait plate (browse, upload, drop an image, Token, context menu): slim plate, buttons in its hover and focus overlay, context menu and drop unchanged.
- Name (Edit mode): header name input.
- Specialty and Origin (open on click, context menu Open and Remove, drag from the Enlistment box today): header meta line, same click, menu and drag.
- Haven (select from the Origin's havens, or text): Record form.
- Canon Tie (text, placeholder from the Origin): Record form.
- Rank select and Class Rank number: Record form (already there); header shows them as text.
- Status tags (Standing or Down, injuries, responses, out of gas, jammed, horse lame, handles empty, overloaded, pinned, airborne, carrying, carried by, next roll penalty, retiring): header name row, same list, read-only.
- Mode switch, Token door: kicker line, right end.

**Vitals**
- Down stamp (toggle; "?" and the rule tooltip when the stamp and the rule disagree): Health cell.
- Health boxes (click to lose or regain; crossed boxes show the blocking injury): Health cell, one row.
- Injury chips (open the item today): Health cell; click goes to Wounds & Mind and highlights the card; context menu Open.
- Stress minus and plus, Stress boxes, "min n", the tally past the last box: Stress cell.
- Response chips (go to Wounds & Mind): Stress cell, and the card is highlighted; "No response held" when there is none.
- Resolve with its formula tooltip and the floor note: the seal; tooltip on hover, the formula popover on click (Escape or a click outside closes it).
- Gas: the level, ODM Gear Dice, the no ODM, jammed and dry states, each spare fits on click, Spend 1, Change: Gas cell (section 5).
- Blades: the in-hand Gear Dice or Empty, the stored count, Blade Discipline ready or used, Ruin, Swap: Blade Sets cell.

**Frame**
- Lifepath banner (open or resume): between the band and the pages.
- Edit mode strips: top and bottom edge of the paper.
- Tab row with arrow keys: index tabs, arrow keys in both axes, Home and End.
- Footer: binder edge.
- Drag and drop of Talents, Specialty, Origin, Gear, Critical Injuries onto the sheet: unchanged (`_onDropItem`); the index tab column and the binder edge are inside the window, so a drop there lands too.

**Soldier tab**
- Roll an attribute alone (icon or name today): the whole attribute head.
- Attribute rating pips (Edit mode): in the head, beside the roll button (not inside it); in Play they read as dice.
- Key stamp and its tooltip: the head.
- Attribute summary: the head's tooltip.
- Call a roll (GM): end of the quick-roll label line.
- Bonus Dice picker (reset after a roll): the label line.
- Each roll row (click rolls, detail hover card, Titan Engagement tag with tooltip, blocked rows disabled with the reason): under its attribute head; the reason moves into the tooltip and the hover card; fixed rolls in their own group last.
- Dice legend: under the Talent list.
- Talents (drag, context menu Open, Mark used or ready, Remove; hover card; level pips in Edit; Dice or Rule; the use checkbox; rules text; "for" line; open by name): one line each; the row toggles the expand; the text, the "for" line and an Open link inside the expand; the use box on the line; drag, menu and hover card on the line.
- Talent drop hint (Edit): foot of the Talent card.
- Drive, named comrade (Edit), Drive used this session: Drive card (inputs in Edit, typed text in Play; the used box in both).
- Key line: Enlistment card, with a Load line (items carried of the limit).

**Kit tab**
- Per gear row: open, drag, context menu (Open, Keep or Unkeep, Remove), status, Gear Dice current (click), rating stepper (Edit), remove button, In handles, Loaded, Mounted, the horse's Position, Titan and Left, a prosthetic's side, Kept: the ledger row. In handles, Loaded and Mounted become the Status stamp's toggle (same disabled rules: handles full, airborne); Kept is the clip button; the rating stepper shows in Edit; the remove button shows in Edit, Remove stays in the context menu in both modes; Position, Titan, Left and side open in a sub-row.
- Gas: the fitted canister's level (click to set), each spare's level (click), Fit, remove a spare, add a spare: the gas canisters row of the ledger (canister chips).
- Momentum minus and plus: fields below the ledger.
- Load bar and Overloaded: under the ledger.
- Carrying, Carried by, dropped Blade Sets: fields below.
- Titan Engagement: Airborne, Left the engagement, the place readout from the tracker: fields below.
- Left at: zone and items: fields below.
- Drop hint for gear: under the ledger.

**Wounds & Mind**
- Figure with pins (focus an injury), Gore switch: figure column.
- Health track, Health lost stepper, Down checkbox: removed (the band's boxes and stamp set the same fields); the readout shows current, crossed and the formula; "Match the rules" appears in the readout when Down and the rule disagree.
- Stress track and the minimum note: removed from the tab (band); the note moves to the readout.
- Resolve formula and floor note: readout.
- Each Critical Injury (open, context menu, type, side, time limit, halved, Scar gained, healing days, Treat or Untreat, the lines it adds): injury card, all controls kept.
- Scars (list, remove, add), Grief: Scars and Grief.
- Lasting Stress Responses (ends, ends note, clear, add): response cards.
- Next roll penalty, pending Fear results, healed permanent injuries, Pinned, rallied by, faced a Titan, killed a person, retiring: field record.

**Record**
- Class Rank, Merit, declined the Military Police, Rank, XP (boxes and stepper): typed form; XP boxes are clickable, the stepper stays for past 10.
- Milestone stamps: the earned ones, stamped on the form's corner (open question 3).
- Notes (Foundry's editor, editable in Play): ruled paper under the form, full width.

**Everywhere**: Foundry tooltips (`use:tooltip`), detail hover cards (`detailHover`), context menus, drag (`dragItem`), read-only Observer view (every input and button disabled from `view.editable` or `view.statsEditable` as today, the tabs, Talent expand and hover cards still work), Motion Full, Reduced, Off and `prefers-reduced-motion`, Gore, and all text from `static/lang/en.json`.

## 7. Strings

All in `static/lang/en.json`, under the website's text guard (run by `pnpm build`), in product voice. Final keys are the implementing step's call; reuse an existing key wherever its English already fits.

**Added** (proposed):
- `WOF.Sheet.rolls.stressAdds` "+{n} Stress Dice on every attribute roll", `WOF.Sheet.rolls.noStress` "No Stress Dice"
- `WOF.Sheet.talent.count` "{n} held", `WOF.Sheet.talent.expand` "Show the rules text", `WOF.Sheet.talent.collapse` "Hide the rules text", `WOF.Sheet.talent.usedAria` "{name}: its use is spent", `WOF.Sheet.talent.readyAria` "{name}: its use is ready"
- `WOF.Sheet.soldier.loadLine` "{items} of {limit} carried"
- `WOF.Sheet.resolve.show` "Resolve {n}. Show how it is built"
- `WOF.Sheet.stress.noResponse` "No response held"
- `WOF.Sheet.gas.spendTip` "Fitted canister: {current} of {full}. Click to spend 1.", `WOF.Sheet.gas.more` "{n} more spares on the Kit page", `WOF.Sheet.gas.stampNoOdm` "No ODM" (the Dry and Jammed stamps reuse `WOF.Sheet.gas.dry` and `WOF.Derived.jammed`), `WOF.Sheet.blades.stampEmpty` only if `WOF.Sheet.blades.handEmpty` ("Empty") cannot serve
- `WOF.Sheet.blades.inHandTip` "Blade Set in the handles: {dice} Gear Dice. Any wear ruins it.", `WOF.Sheet.blades.storedTip` "{n} Blade Sets stored. Click to fit one in the handles."
- `WOF.Sheet.kit.more` "More", `WOF.Sheet.kit.less` "Less"
- `WOF.Sheet.wounds.readout` "Readout", `WOF.Sheet.wounds.readoutHint` "What the band is built from"
- `WOF.Sheet.record.xpOf` "{n} of {max}"

**Removed** once nothing reads them (step 8 sweeps every `WOF.Sheet.*` key with a grep over `src/`; the Squadmate, Titan and Lifepath still use several of these, so each is checked, not assumed): `WOF.Sheet.gas.spareTanks`, `WOF.Sheet.soldier.attributesHint`, `WOF.Sheet.soldier.rollsHint`, `WOF.Sheet.wounds.healthHint`, `WOF.Sheet.wounds.stressHint`, `WOF.Sheet.header.plate` (if no other plate shows a caption).

## 8. Tests

**Add**
- `test/instrument.test.ts`: needle angles at 0, 1, 2, 3 of 3 and a full of 4; band states; stamp order (no ODM before jammed before dry); spares shown and the overflow count; `gasChange` for spend, fill, swap (by request and by spares diff), no change on an unrelated update, none on first render or a Motion change; `bladeChange` for ruin and fit.
- `test/tab-keys.test.ts`: `nextTab` with arrows in both axes, wrap-around, Home, End, other keys ignored.
- `test/text-floor.test.ts`: no `font` or `font-size` under 10 px in `static/styles/*.css` (fixing or listing any old exception it finds), and no SVG `<text>` in the two instrument components.

**Update**
- `test/sheet-rules.test.ts` if `groupRollsByAttribute` gains or changes a label (the preview's "Fixed rolls" group).
- `test/lifepath-wiring.test.ts` and `test/packs.test.ts` only if a removed key is one they read.

**Delete**
- `test/widgets.test.ts`.

## 9. Steps

Each step is sized for one agent. Opus implements design and anything with behaviour to preserve; Sonnet takes the mechanical steps with a tight brief. Every step ends with `pnpm test`, `pnpm typecheck` and `pnpm exec svelte-check`, and touches only the files it owns.

| Step | Model | Delivers | Needs | Parallel with |
| --- | --- | --- | --- | --- |
| **1** Docs and three.js removal | Sonnet | ADR-0027, ADR-0025 and core-plan edits (section 3.4); delete `motion/widgets.ts`, `Widget3d.svelte`, `test/widgets.test.ts`, the two equipment tools; drop `widgetStats` from `index.ts`; `pnpm remove three @types/three` | none | 2 |
| **2** The Instrument | Opus | `sheets/instrument.ts` and its test; `GasInstrument.svelte`, `BladeInstrument.svelte`; the motion helpers in `motion/fx.ts`; `styles/instrument.css`. Built against the preview's "1 Instrument" drawing, not mounted yet | none | 1 |
| **3** Frame, header, band | Opus | `SoldierSheet`, `Header`, `Plate` slim, `Vitals` band (mounting the instruments), `HealthTrack` and `StressTrack` band sizes, `Tabs` right edge and `tab-keys.ts` with its test, `SheetState` additions, `soldier-sheet.ts` size and class, `styles/dossier.css`, `system.json` registration of all six new stylesheets; delete `EquipmentRig.svelte`; the Squadmate sheet checked working (band, both rows) | 2 | none |
| **4** Soldier tab | Opus | `TabSoldier`, `Pips` square variant, `styles/dossier-soldier.css` | 3 | 5, 6, 7 |
| **5** Kit tab | Sonnet | `TabKit` ledger and fields, `styles/dossier-kit.css`; the parity list in section 6 is the brief | 3 | 4, 6, 7 |
| **6** Wounds & Mind | Sonnet | `TabWounds` columns, readout, chip spotlight arrival, `styles/dossier-wounds.css`; Squadmate's narrow fold | 3 | 4, 5, 7 |
| **7** Record | Sonnet | `TabRecord` typed form with Haven and Canon Tie, stamps, ruled notes, `styles/dossier-record.css` | 3 | 4, 5, 6 |
| **8** Cleanup | Sonnet | delete the replaced `sheet.css` sections (grep each class first), the string sweep, `text-floor.test.ts`, a grep for leftovers (`three`, `widget`, `EquipmentRig`, `odm-rig`) | 1, 4 to 7 | none |
| **9** Checks and live pass | Sonnet | section 10 | 8 | none |
| **10** Review and fixes | Opus | one review against the checklist (rules and behaviour parity against section 6, v14 API use, no WebGL on the sheets, no leaks on close, reduced-motion and Off paths, text floor, strings), about 300 words, blocking and major findings only; then the fixes | 9 | none |

Only 1 and 2 run together at the start; 4 to 7 run together after 3. Step 3 is the bottleneck on purpose: the frame, the `SheetState` fields and the stylesheet registration land once, so the four tab steps never edit a shared file. New strings: each step adds its own keys to `en.json` in its own block (`WOF.Sheet.talent.*`, `kit.*`, `wounds.*`, `record.*`); step 3 adds the band and gas and blade keys.

## 10. Verification

**Automated (step 9, and at the end of every step):**
- `pnpm test` (the suite, with the three new files and without `widgets.test.ts`).
- `pnpm typecheck`.
- `pnpm exec svelte-check`: 0 errors, no new warnings (a11y warnings included).
- `pnpm build`: code, packs, and the text guard over every lang string.
- A grep of `src/`, `tools/` and `package.json` for `three` finds nothing but prose; the size of `dist/wings-of-freedom.mjs` before and after is recorded (three.js leaving should shrink it markedly).

**Live pass (once, at the end):** on the isolated scratch server of core-plan section 6 (the 14.365 install on its own port, data path in the agent's scratchpad, the system symlinked in, the licence copied in for the run and deleted after, the `wof-dev` world only; the owner's server and worlds are never touched). Two browser contexts: the GM and one player who owns one soldier and observes another. At most six screenshots:
1. GM, the sample soldier's Soldier tab at 860 x 820 in Play: band, heads, label line, at least 20 rows and the Talents above the fold.
2. Kit tab.
3. Wounds & Mind, reached by clicking an injury chip (the card highlighted).
4. Record in Edit mode (the Edit strips on).
5. The player observing the other soldier at 720 wide (read-only: controls disabled, tabs and hover cards working).
6. The Squadmate sheet at 600 wide.

Checked without screenshots, by script: no console errors opening, switching and closing each sheet; Spend 1, Change, a spare fit, Ruin and Swap update the actor and animate under Full, fade under Reduced, stand still under Off and with reduced motion emulated; an attribute head roll and a quick roll post cards and reset the Bonus Dice; a Talent dragged from a compendium lands and levels up on a second drop; gear context menu and Talent hover card work; the Resolve popover opens and closes with Escape; no element's text reads `WOF.` (a missing key); `document.querySelectorAll('canvas')` inside the sheet windows finds none; opening and closing five sheets leaves no mounted Svelte roots and no stray listeners.

## 11. Risks

- **Height.** The fold target depends on Foundry's window header (32 px against the preview's 30) and the band standing about 74 px. Step 3 measures it; if rows fall short of 20, the band's paddings and the header's margin tighten before any row shrinks.
- **The Squadmate window.** 600 px is narrower than any width the preview was drawn for; the two-row band and the folded Wounds columns are the plan's answer and are checked in steps 3 and 6.
- **Parallel steps.** Steps 4 to 7 are safe side by side only while each keeps to its files (section 9 table). A step that needs a shared change stops and hands it back to the coordinator.
- **Animations started by other clients.** A roll's gas loss or the GM's edit arrives as a document update; the change rules in `instrument.ts` decide what animates, and two quick updates must not stack ghosts (the ghost is keyed to the change id, as `EquipmentRig` does today).
- **Hover cards and the tab column.** The detail hover card is placed beside its row; with the tab column on the right, step 4 checks a card never covers the index tabs or leaves the window.

## 12. Open questions for the owner

1. The Squadmate sheet keeps its own frame (horizontal tabs, footer inside the paper) and only picks up the new band, Kit and Wounds & Mind. Should it move to the Dossier frame (index tabs, binder footer) too, now or later?
2. The preview lets a click on the header's Standing or Down tag and its Airborne tag toggle them. The plan keeps the tags read-only, so each field has one control (the band's Down stamp, the Kit tab's Airborne). Should the tags toggle as well?
3. The Record's stamps: the preview shows only the milestones a soldier has earned; today the unearned ones show faded. The plan shows earned only. Keep the faded ones?
