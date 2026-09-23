# Soldier sheet overhaul: preview spec (2026-09-23)

Owner request: overhaul the player character (Soldier) sheet. Better, more compact, much less white space, better looking, more immersive, intuitive and satisfying to use, subtle animation. Visual preview first; no implementation yet.

Two previews, same content, same locked tokens:
- **A. Refined Dossier**: the locked Personnel File look (paper file in a leather binder), tightened and deepened.
- **B. Field Kit**: a bolder take. Same fonts and palette tokens, but the frame is the soldier's kit: iron-and-leather case, paper cards clipped or pinned inside, a persistent left "status column". Still clearly the same product.

## Audit of the current sheet (screenshots taken 2026-09-23, 860x822 window)

1. Fixed chrome eats ~45% of the height: header (~70px), vitals strip (~150px), tab row (~30px), footer (~20px). The Soldier tab's scroll area is ~220px tall, so Quick rolls start below the fold.
2. Vitals: Health block has a big empty area under its 2x3 boxes; Resolve is a full column for one number; the gas and blade 3D widgets are large dark boxes (~140x80 each) with separate Spend/Change and Ruin/Swap buttons below.
3. Attributes: six large cards (~95x80) mostly spent on a 3-line description.
4. Quick rolls: 46 entries as two-column tiles (~42px each) grouped by attribute, far below the fold; a bonus-dice row takes its own 60px bar.
5. Talents sidebar: every Talent shows its full rules text, so only 3 fit.
6. Kit tab: each gear row ~45px tall, a wide empty middle column, rating stepper far right.
7. Wounds & Mind: repeats Health and Stress boxes that the vitals strip already shows; the body figure takes a 100px x 300px column with space around it.
8. Record: a narrow form box plus loose rotated stamps; notes below the fold.
9. Section headers ("01 Attributes ..... each dot is a base die") cost a full row each.

## Hard constraints

- Foundry VTT v14 ApplicationV2 window, default ~860 wide x ~820 tall, resizable (must still look right at 720 wide and 1000+ wide). Preview renders the sheet as a window on a dim Foundry-like canvas backdrop (dark, a hint of the scene) with the Foundry window title bar ("TEST" style: small caps, close button). At phone width the preview simply scales the window down or lets it scroll horizontally inside its own container; the page body never scrolls sideways.
- Keep the locked tokens: `foundry/static/styles/sheet.css` lines 7-26 (`--paper`, `--ink`, `--red`, brass, leather, iron, the six attribute colours `--str --agi --wit --per --ins --emp`, the 4px spacing scale, the type scale with a 10px floor). Fonts locked: Playfair Display (display), Special Elite (labels, typewriter), Noto Serif (body). Load them from Google Fonts in the preview. CSS-only textures (SVG noise data URIs are fine).
- Single-theme artifact (the sheet is a physical object); paint every colour explicitly.
- Real icons only, inlined as data URIs from `foundry/static/assets/icons/*.webp` (128px webp, small): `attr-*`, `action-*`, `harm-*`, `gear-*`, `die-*`, `talent-dice`, `talent-rule`, `specialty-flier`, `brand-emblem`, `status-*`, `injury-*`, `pos-*`. Portrait: `foundry/static/assets/portraits/portrait-flier.webp`. Wounds figure: `foundry/static/assets/anatomy/body-cadet.webp` (the anime cadet body the owner approved). Use Font Awesome free (cdnjs, pinned) only for small UI glyphs if needed.
- Inline everything into one self-contained HTML file (write a tiny node or python build script in your scratch dir that replaces `src="icons/x.webp"` with data URIs; keep total under 3 MB).
- The gas canister and blade widgets are three.js in the real sheet (ADR-0027: three.js only for these two). In the preview, draw them as good-looking SVG/CSS stand-ins at the size and placement you propose; label nothing about three.js on the page.
- Motion: anime.js v4 is the sheet's motion engine; in the preview use CSS transitions/keyframes or anime.js from cdnjs/jsdelivr (pinned). Subtle, physical, fast (120-260ms), and all off under `prefers-reduced-motion`. Examples that fit: a Health box being crossed with an inked stroke drawn in; a Stress box filling with a small jolt of the strip; a rubber stamp thud for status tags and Down; the index tab sliding the page (short, not a carousel); a roll row pressing in and a dice glyph flicking; bonus dice pips popping; gas band draining with a hiss-flash; blade snapping on Ruin. Nothing loops except, at most, one very quiet ambient detail.
- Everything interactive in the preview should actually respond (click boxes, steppers, tabs, bonus dice, roll rows show a tiny "rolled" toast, gear toggles), with in-page state only. No real dice logic needed.
- Copy: product voice, no design jargon (never "ADR", "YAML", "data", "three.js", "preview spec"). Use the sheet's real labels (lang strings in `foundry/static/lang/en.json`, `WOF.Sheet.*`).

## Content (one sample soldier, show real states so the design is tested)

- Name **Ilse Brandt**, Specialty Flier (key attribute Agility, max 6), Origin Minor Noble House, Haven "An old family servant who raised you", Canon Tie blank, Rank Private, Class Rank 12th, Merit 2, XP 3 of 10. File serial like "FILE K7Q-2M".
- Attributes (scale 1-5, key to 6): Strength 2, Agility 4 (key), Wits 3, Perception 4, Instinct 2, Empathy 3. One-line summaries: take them from `data/character/attributes.yaml`.
- Health 5 max, 3 current (2 boxes crossed). Health formula: 2 + ceil((Str + Agi)/2) = 5.
- Stress 2 (effective), minimum 1 (one Scar). Stress boxes show at least 6; each box is a Stress Die.
- Resolve: ceil((Ins 2 + Emp 3)/2) = 3, + Scars 1, - Grief 1 = 3.
- Held Critical Injury: one, e.g. "Cracked Ribs" style row: pick a real Critical Injury row name from `data/harm/` (a crush type, torso), treated. Show it as a chip in vitals and pinned on the body figure.
- One lasting Stress Response: pick a real one from `data/mind/stress-responses.yaml` that is lasting.
- One Scar: pick a real one from `data/mind/scars.yaml`. Grief 1 of 3.
- Talents (real names/text from `data/character/talents.yaml`): Wirework (dice, level 1 of 3), High Vantage (dice, 1), Lure (dice, 1), Fieldcraft (dice, 1), Judge of Character (dice, 1), plus one rule Talent with a once-per-session limit, not used yet.
- Drive: "Knowledge: what lies beyond the Walls", named comrade "Tomas", Drive not used this session.
- Gear: ODM Gear (rating 2, current 2, carried), Blade Set x2 (one in the handles rating 1, one carried), Gas: full Gas Rating 3, fitted canister at 2, spares [3, 1]; Horse (rating 2, dismounted); Rations; Medical Kit. Load: items carried vs Strength + 4 = 6.
- Status tags to show: Standing; one warn tag (Wounded / injury treated); one info tag (Airborne) toggled off by default is fine.
- Quick rolls: all rolled Action Catalog entries from `data/character/action-catalog.yaml`, grouped by the attribute they roll (plus a "fixed dice" group for Death Roll and friends). Each row: action icon, name, a small context tag like FIGHT for Titan-engagement-only rolls, the pool as coloured dots (attribute dice, Talent dice, gear dice), and the total. Use plausible pools: attribute + matching Talent level + gear dice where the entry allows gear (Nape strike: Str 2 + Blade Set 1 = 3; Fly: Agi 4 + Wirework 1 + ODM 2 = 7).
- Tabs: Soldier, Kit, Wounds & Mind, Record. Design all four fully; the Soldier tab must be the strongest.

## Design goals to hit (both previews)

- At 860x820 the Soldier tab shows vitals, attributes, the bonus dice selector, and at least ~20 quick-roll rows plus the Talent list without scrolling.
- Vitals collapse into one compact band (or, for B, a vertical status column) that never duplicates on other tabs. Everything clickable in the band: Health boxes, Stress boxes and +/-, Down stamp, gas spend/change, blade ruin/swap, injury/response chips.
- Attributes and their rolls read as one idea (roll under the attribute you mean). Clicking an attribute rolls it alone; the description moves to a tooltip.
- Talents compact: name, level pips, dice/rule mark, limit checkbox; rules text on hover or on expand.
- Section headers become light labels, not full rows. Numbers use tabular figures.
- Kit rows ~30px, all controls inline. Wounds & Mind: the figure plus injuries/responses/scars without the duplicate tracks (formulas as a compact readout). Record: a typed form that fills the width, with the stamps and notes visible.
- Immersive touches that earn their place: paper grain, ink, rubber stamps, brass eyelets or clips, a wax seal, typewriter labels, index tabs that stick out of the file. Tactile hover (slight lift, ink darkening), satisfying press states.
- Accessible: visible focus, 10px text floor, contrast on paper.

Also put, above the window on the page, a slim caption strip: the preview's name (A. Refined Dossier / B. Field Kit), and a one-line "what changed" note. Below the window, a short list (5-7 bullets) of the main changes versus the current sheet. Keep that text small; the window is the point.
