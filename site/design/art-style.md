# Wings of Freedom art style

The locked art style for the website (ADR-0022, ADR-0023). Every generated illustration and game icon reuses the blocks below word for word, so later batches match the style lock set in `site/art-src/style-lock/`. Change a block only with the owner's approval, and regenerate the style lock set when you do.

## Palette

| Token | Hex | Use in art |
| --- | --- | --- |
| Paper | `#E4DCC5` | Dust, parchment light, vignette background |
| Ink | `#29241D` | Shadows, linework, icon ink |
| Survey Corps green | `#2F4B3C` | Cloaks, foliage |
| Wax-seal red | `#8B2A21` | Sparing accent, icon accent |
| Gear steel | `#56605F` | ODM gear, blades, stone |
| Titan flesh | `#B38467` | Titan skin, earth |
| Cloth | `#16211B` | Deep cloak shadows |

## How to generate

Run the Codex CLI non-interactively from the output folder, with the prompt on stdin:

```bash
codex exec --skip-git-repo-check --ephemeral -s workspace-write \
  -C site/art-src/<batch>/originals --color never - < prompt.txt
```

Codex saves each image under `~/.codex/generated_images/<session>/` and copies it into the working folder under the filename the prompt names. One colour plate takes about 80 seconds. Several runs can go in parallel, but then a session may copy another session's newest image, so keep the copy guard in the run header, and after each batch check that no two files share a hash (`md5 -r *.png`). Icons go through the Codex `board-game-icon-assets` skill, named in the prompt.

The owner locked `plate-hero-sortie.png` and `plate-soldier-recruit.png` as the style references. Never regenerate or edit them. Attach both with `-i` to every generation, whether plate, vignette, or icon (for example `-i site/art-src/style-lock/originals/plate-hero-sortie.png -i site/art-src/style-lock/originals/plate-soldier-recruit.png`). For plates, start the prompt with this line:

```text
REFERENCE IMAGES: the attached images are approved plates from this same set. Match their rendering exactly: the same anime linework, painterly anime shading, muted warm palette, and level of stylisation. Do not copy their subjects.
```

Without references, subjects with a lot of bare skin or foliage (Titans, forests) drift toward photoreal. With them, the Titan plate matched the soldier plate on the first try. For icons, say the plates are world reference only (what ODM gear, wire, and blades look like, not how to render), and also attach approved icons for frame and texture.

Every prompt is assembled in this order: the run header, the aspect ratio line, the style block, the world block (plates only), the subject, then the exclusions.

### Run header

```text
Use your built-in image generation tool to create exactly ONE image, then copy the generated PNG into the current working directory, using only the exact file path your own image generation call returned in this session (never the newest file in ~/.codex/generated_images, which other sessions also write to), under the filename given below (copy the file; do not re-encode, crop, or resize it). Do not create or modify any other files, do not write code, and do not review anything. When done, reply with only the absolute path of the saved file.

FILENAME: <file-name>.png
Aspect ratio <ratio> (for example <width>x<height>).
```

## Colour plates

For the hero, chapter openers, Titan portraits, soldier portraits, and gear plates. Mounted on the page with a paper border and a plate caption.

### Style block: colour plate

```text
STYLE (locked, colour plate): Semi-realistic anime illustration, the high-end cinematic version of a premium dark-fantasy military anime, like a still from a theatrical anime film. Characters drawn with clean, confident dark linework and soft painterly anime shading; grounded human anatomy and proportions; accurate costume, leather, and metal equipment detail; detailed hand-painted backgrounds with visible brush texture. Not chibi, not photorealistic, not a 3D render, not Western comic style, not glossy digital concept art. Colour: slightly muted, warm, filmic palette that sits well mounted on aged paper, like a faded colour plate bound into an old field manual. Parchment and dust tones (#E4DCC5), iron-gall ink brown-black shadows (#29241D), deep military green (#2F4B3C), gunmetal steel (#56605F), muted flesh and earth (#B38467), dark cloth green (#16211B), with only a sparing wax-seal red accent (#8B2A21). Lifted blacks, restrained saturation, soft film grain, gentle vignette.
```

### World block

```text
WORLD: a walled, 19th-century-inspired world behind colossal stone Walls fifty metres tall. Survey Corps soldiers wear a short tan cropped field jacket, white shirt, white fitted trousers, dark brown leather harness straps crossing the chest, hips, and thighs, knee-high brown boots, and a hooded dark green cloak with the Wings of Freedom emblem (two overlapping stylised wings, one white and one blue, on a small shield) on the back. Omni-directional mobility (ODM) gear sits at the hips: a steel gas canister and a long rectangular blade scabbard box on each hip, and a compact grappling-hook launcher unit at the lower back.
```

### Exclusions: colour plate

```text
EXCLUSIONS: no text, no letters, no numbers, no captions, no signage, no watermarks, no signatures, no borders or frames, no logos except the wing emblem where the uniform carries it. Original characters only: no recognisable canon characters (not Levi, Eren, Mikasa, Armin, Erwin, Hange, or any other named character likeness) and no named canon Titans. No extra or missing fingers or limbs, no malformed horses, no modern objects, no firearms.
```

### Subject guidance

- Write the subject as scene, then figures, then light and mood.
- Give every soldier an original, specific look (skin tone, hair, one mark such as a scar) so the model does not fall back on a canon face.
- Young soldiers with a black bob, messy black hair, or long dark hair tied back in a ponytail or bun drift toward canon faces (Mikasa, Eren, Levi) even when described as original. Give them another hair colour or cut, such as ginger, grey, shaved, braided, or curly, and add "no soldier with a black bob, messy black hair, long dark hair, a ponytail, or a man bun" to the exclusions of any scene with a visible face.
- Titans are generic: smooth, featureless, doll-like skin with no anatomical detail, lanky with awkward, slightly wrong proportions, a hungry expression, faint steam. Never describe a named Titan.
- Titans must be threatening, not only uncanny: a hunched, predatory, reaching posture seen from a low camera at a soldier's height. Never a Titan standing with its arms at its sides.
- Give each Titan a clearly original face built from specific asymmetric features: uneven eyes, a crooked nose, a slack or lopsided open jaw, unkempt matted hair of an ordinary colour. Rejected in the style lock: long shaggy dark hair with a lipless grin (reads as the Attack Titan); blond wisps with a toothy grin, and a bald moon face with a broad closed-lip smile (both read as the Smiling Titan).
- End every Titan prompt with the canon Titan exclusion line: "It must not resemble any canon Titan: not the Smiling Titan (no bald head, no broad closed-lip smile, no long blonde hair), not the Attack Titan (no long black hair with a lipless skull grin), not the Colossal Titan (no skinless exposed muscle), not the Armored Titan (no armour plates), not the Female Titan (no blonde hair, no crystal hardening), not the Beast Titan (no fur), not the Cart Titan, not the Jaw Titan (no beak jaw or claws), not the War Hammer Titan. No arms-at-sides standing pose."
- The approved Titan used this posture and face, which is a good starting point for other Medium Titans (change the hair, eyes, and jaw for each new one): "it hunches forward over the viewer with its head thrust low and tilted, one very long, too-thin arm reaching down toward the camera with bony splayed fingers, the other arm hanging awkwardly ... a gaunt, hollow-cheeked, long face with asymmetric features: the left eye noticeably larger and set lower than the right, both eyes wide, unblinking and fixed hungrily on the viewer; a crooked, flattened nose; a slack, lopsided open jaw hanging down on one side, showing a few uneven, human, yellowed teeth only on that side, a thread of steam or drool at the corner. Unkempt, greasy, mouse-brown hair in thin matted clumps down to the jaw".
- Frame Titans from the hips up with the lower body behind roots, mist, or terrain.
- In plates, write the full ODM blade description (long straight segmented strip, oblique squared tip, trigger handle, no crossguard or pommel) every time a blade appears, including still lifes. A bare "blade" becomes a sword or dagger.
- Put a soldier's distinctive head (hair, skin, one mark) early in the subject. Retries sometimes ignore a hair change that sits late in the prompt, and a face falls back to messy black hair.
- Titans drawn inside a scene (sketches pinned to a wall, specimen notes) are also generic Titans with smooth skin, faces, and hair. Skinless muscle studies read as the Colossal Titan. Add the canon Titan exclusion line to any prompt that shows a Titan in any form.
- Say "clean anime linework, not photographic", because Titans drift toward photoreal skin.
- Never write "naked" or name body parts for a Titan. The image safety filter blocks the output. Frame Titans from the waist up, or hide the lower body behind terrain, roots, mist, or a wall.
- Ask for plain stone walls when banners are not needed. Generated banners repeat the emblem and add clutter.

## Ink-wash vignettes

For small scenes inside rules pages. The same style, printed in one ink. Attach the soldier portrait first with `-i` and tell Codex to take the drawing manner from it. A realistic, hatched, Western pen-and-wash look was rejected twice in the style lock.

### Style block: ink-wash vignette

```text
STYLE (locked, ink-wash vignette): the same anime illustration style as the attached references, printed in one ink. It must read as anime, like a key-animation drawing from a premium anime production that was inked and toned by hand, never as a Western pen-and-ink illustration, engraving, or academic sketch. Line: clean, confident, closed contour lines with smooth tapered ends and a clear weight hierarchy (heavier outer contours, lighter inner lines); no hatching, no cross-hatching, no scratchy sketch lines, no stippling. Shading: cel-style shading rendered in ink wash: two or three flat, hard-edged wash tones per form (light, mid shadow, dark accent) with crisp shadow shapes, plus one soft wash gradient at most per area. Anatomy simplified in the anime manner: hands drawn with clean simple planes, long straight fingers, few knuckle lines, no wrinkles, veins, or skin texture. Metal rendered anime-style with hard-edged highlight bands, not realistic reflections or scratches. One ink only, brown-black #29241D, on plain paper tone #E4DCC5. No other colour. Background: flat plain paper tone #E4DCC5 with no texture, no border, and no frame; the drawing is a vignette whose edges dissolve into the paper with a few loose wash strokes, not a hard rectangle.
```

### Exclusions: ink-wash vignette

```text
EXCLUSIONS: no text, no letters, no numbers, no gauges with numerals, no logos, no watermarks, no signatures, no border or frame, no colour, no faces, no canon characters, no extra fingers, no firearms, no hatching, no realistic skin texture.
```

Drop "no faces" when the vignette needs a figure, and add the canon character line from the colour plate exclusions instead.

## Brand marks

The emblem, the wordmark, the favicon, and the social preview. Generated the same way as the icons, but they are the product's identity, so they are locked once picked: change one only with the owner's approval. Sources are in `site/art-src/brand/`, prompts in `site/art-src/brand/prompts/`.

The brand marks obey two grounds, not one. The masthead sits on the dark cloth band (`--cloth`, `#16211B`); pages and the social card sit on paper (`#E4DCC5`). A mark that only works on paper disappears in the masthead, which is what happened to the first emblem and to the ink wordmark. Proof every brand mark on paper, on cloth, and on white before picking it.

### Style block: brand emblem

```text
STYLE (locked, brand emblem): a printed heraldic emblem for the cover of an issued military field manual, struck like a rubber stamp or a woodcut: ink on paper. Not a glossy modern logo, not an app icon, not a 3D render, not chrome or metal, not a gradient, not a mascot. Flat front-on view: no perspective, no gloss, no bevel, no drop shadow, no glow, no halo. Bold, chunky, confident shapes with slightly rough, broken stamp edges and a faint ink speckle inside the solid areas, as if pressed unevenly onto dry paper. Every shape is a flat solid fill of one of exactly four inks and no others: iron-gall brown-black #29241D, parchment #E4DCC5, deep Survey Corps green #2F4B3C, and wax-seal red #8B2A21 used only as one small sparing accent. No other colour, no tints, no shading. Square 1024x1024 canvas, transparent background with true alpha, the mark centred with about 8 percent empty margin on each side.

READABILITY: this mark must survive being shrunk to 32 pixels and must still look right at 512 pixels. One large simple silhouette. Big solid shapes, no hairlines, no tiny counters, no feather-tip filigree, generous gaps between shapes. If a detail would close up at 32 px, leave it out.
```

### Subject: the emblem

A heater shield (flat top edge, straight sides curving to a point at the bottom) with a solid deep Survey Corps green field, a pair of stylised wings crossing at the centre and sweeping out and up to left and right, and one small wax-seal red diamond at the crossing point. Both wings are filled parchment, and the front wing is told from the one behind it by a bold ink gap where they overlap. Around the ink border runs a parchment keyline about half its thickness: the keyline is what keeps the shield from dissolving into the cloth masthead, so it must be unbroken and even in width. In the picked emblem the wings sweep past the shield edges and carry the keyline along their own outer edge, so shield and wings ring as one silhouette.

What the rejected candidates taught:

- Bare crossed wings with no container (no shield, no disc) turn to mush at 32 px and vanish on cloth. The shield carries the silhouette.
- One wing green and one wing ink was the first reading of "one lighter, one darker". At small sizes the ink wing merges into the ink border and the mark reads as half a wing. Both wings parchment, split by an ink gap, is what survives.
- Five or six feather blades per wing close up at 32 px. Three or four fat blunt blades with wide gaps of field between them do not.
- Without the parchment keyline the shield loses its right edge on the cloth masthead.

### Exclusions: brand emblem

```text
EXCLUSIONS: no text, no letters, no numerals, no captions, no wordmark, no watermark, no signature, no background, no paper texture behind the mark, no vignette, no shadow, no additional ornament, no laurel wreath, no banner ribbon, no stars, no skulls, no swords, no eagles or realistic birds, no feathers drawn realistically, no canon characters, no recognisable real-world military or national insignia.
```

### The wordmark

"WINGS OF FREEDOM" is drawn art, not type, but it keeps the site's stencil voice.

```text
STYLE (locked, brand wordmark): drawn stencil lettering stamped in ink on dry paper, the kind pressed through a cut brass stencil plate onto an issued military manual cover or a supply crate. Condensed, tall, heavy, geometric capitals with flat squared terminals and no serifs, in the manner of a stencil display face: each letter is broken by one or two small stencil bridges, narrow gaps that interrupt a stroke, and those bridges are clean and deliberate, never random speckle holes. Letterforms are upright, of even weight, evenly spaced, and sit on one exact shared baseline with one exact shared cap height; the whole line is flat and level, not arched, not curved, not in perspective, not italic.

INK AND WEAR: one ink only, iron-gall brown-black #29241D, flat solid fill, no other colour, no gradient, no shading, no gloss, no bevel, no drop shadow, no glow, no outline. Slightly worn: the stamped edges are a little rough and broken and there is a faint ink speckle inside the solid strokes, as if the plate pressed unevenly. The wear must stay subtle: never break a letter into unreadable pieces, never eat a whole stroke, never bleed two letters together.

BACKGROUND: transparent with true alpha. Nothing behind the lettering: no paper texture, no plate, no card, no rectangle, no border, no frame, no vignette, no shadow.
```

Generated lettering is unreliable, so spell the words out for the model:

```text
TEXT, the only content of the image, and it must be spelled exactly right: WINGS OF FREEDOM

Spelled out character by character in order: W, I, N, G, S, space, O, F, space, F, R, E, E, D, O, M. That is three words and fourteen letters. The first word is five letters, W-I-N-G-S. The second word is two letters, O-F. The third word is seven letters, F-R-E-E-D-O-M, and it contains a double E in the middle. Every letter is a capital. Do not add a letter, drop a letter, duplicate a letter, mirror a letter, or change the order. Check the spelling before you finish.

EXCLUSIONS: no other text of any kind anywhere in the image: no tagline, no subtitle, no motto, no serial number, no year, no unit number, no signature, no watermark, no emblem, no wings, no crest, no shield, no logo, no decorative rules or lines, no underline, no stars, no ornament, no illustration. Lettering only, nothing else.
```

Rules for the wordmark:

- **Never ship a misspelled wordmark.** Composite each candidate onto paper first, because ink on a transparent canvas reads as black on black in most viewers, then blow it up and read every letter. Reject a malformed, doubled, missing, or extra letter. Up to four attempts per lockup; if none comes back clean, keep the typographic wordmark in place and say so.
- The horizontal one-line lockup with a smaller OF is the picked one: it fits the masthead without changing its layout. A stacked two-line lockup was generated and rejected, its first line cramped with W, I, and N almost colliding.
- The wordmark's wear lives in the **alpha** channel and its colour is one flat ink, so it can be reprinted in another ink losslessly: replace RGB, keep alpha. That is how the parchment version for the cloth masthead is made. Never redraw the letters to change their colour.
- Where a wordmark image is used, the real words stay in the DOM: the image is decorative (empty `alt`) and `.brand-text` sits under it, invisible but read by assistive tech, and a script drops the image if it never loads so the typographic wordmark takes over. See `SiteHeader.astro` and `.brand b > .brand-text` in `base.css`.

### The social preview

`site/public/og.jpg`, 1200x630. **Generate the artwork only, never the lettering.** The generated backdrop is a blank aged parchment sheet on green cloth with no mark on it at all; the emblem and the type are composed over it afterwards, which is the only way the card's emblem is guaranteed to be the same drawing as the masthead's.

Compose with `site/art-src/brand/og-compose.html`, which loads the site's own self-hosted fonts, and capture it:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --window-size=1200,630 --screenshot=og.png file://<absolute path>/og-compose.html
```

The compose page lays a copy of the paper back over everything at `mix-blend-mode: multiply` and low opacity, so the emblem and the type pick up the paper's fibre instead of looking pasted on.

Image generation tops out at 1536 px wide, so a 3:2 canvas is cropped to the central letterbox band. Tell the prompt so: "everything that matters must sit inside the central horizontal band of the canvas, between 22 percent and 78 percent of the canvas height".

The card is **JPEG, not PNG**. A 1200x630 photographic card cannot be a PNG under 300 KB without visible damage: quantising to 96 colours still lands near 335 KB and bands the paper. JPEG at quality 88 with no chroma subsampling, which keeps the stencil edges crisp, is about 215 KB.

### Brand file names

Brand marks use the `brand` family. Names say which ink, because the cloth masthead and the paper card need different ones.

| File | What it is |
| --- | --- |
| `src/assets/icons/brand-emblem.webp` | The emblem, 512 px square, transparent. The masthead and any future large use. |
| `src/assets/brand/brand-wordmark.webp` | The wordmark in iron-gall ink, for paper grounds. Builds `og.jpg`. Kept out of `assets/icons/`, whose contents `IconSlot.astro` globs eagerly and ships whole. |
| `src/assets/icons/brand-wordmark-light.webp` | The same wordmark in parchment ink. The masthead, on cloth. |
| `public/favicon.ico` | The simplified emblem at 16, 32, and 48 px. |
| `public/favicon-32.png`, `public/favicon-192.png` | The same mark as PNG. |
| `public/apple-touch-icon.png` | 180 px, flattened onto paper, since iOS composites transparency onto black. |
| `public/og.jpg` | The social preview, 1200x630. |

The favicon is the emblem **simplified**: the same shield, wings, red diamond, and parchment keyline, but with the wings held inside the shield and fewer, fatter feather blades. Proof it at 16 and 32 px on paper, on cloth, on white, and on mid grey before picking.

## Game icons

Stamp icons, generated with the Codex `board-game-icon-assets` skill. Shown at 32 to 128 px and proofed at 32 px.

### Icon run header

```text
Use the `board-game-icon-assets` skill for this task (read its SKILL.md and references/icon-principles.md first and follow them). Use your built-in image generation tool to create <n> stamp icons for a tabletop RPG website, one image per icon, and copy each generated PNG into `icons/` inside the current working directory with the exact filename listed (copy the file; do not re-encode, crop, or resize). Do not write code and do not review anything; only generate and copy images. Generate the first icon to lock the frame, stroke, and ink texture, then generate every following icon using the previously generated icons as the visual reference, keeping the frame geometry, stroke weight, canvas margin, and stamp texture identical within each family and across the set. When done, reply with the list of saved absolute paths and one line per icon naming its glyph.
```

For a later batch, attach one or two approved style lock icons with `-i` so the frame and stroke carry over.

### Style block: icon system

```text
ICON SYSTEM (locked for every icon):
- Stamp icons printed like a rubber stamp or a woodcut: ink on paper. One ink, iron-gall brown-black #29241D, plus one accent, wax-seal red #8B2A21, used sparingly and never as the only cue.
- Bold, chunky, flat shapes; one thick consistent stroke of about 7 percent of canvas width; slightly rough, broken stamp edges with a faint ink speckle inside the solid areas. No gradients, no shading, no 3D, no glow, no drop shadows, no perspective: flat front-on view.
- Square 1024x1024 canvas. The icon is centred and its frame fills a shared safe area: the outer edge of every frame sits exactly within the central 84 percent of the canvas (8 percent empty margin on each side), and every frame of the same family is the same size.
- Background: transparent with true alpha. If transparency is not available, a plain flat pure white #FFFFFF background with nothing else on it (no paper texture, no shadow, no vignette).
- Must stay readable at 32 px: one large simple glyph per icon, at most two or three identifying details, no hairlines, no tiny counters or gaps, generous space between the glyph and the frame.
- No text, letters, numerals, or logos anywhere.
- No electronics shapes: no computer chips, pin tabs, circuit traces, or modern machine parts. The world is pre-industrial.
```

### Frames

```text
FRAMES (fixed per family):
- ROUND frame: a thick solid ink ring. Used by dice and by rolls.
- DIAMOND frame: a thick ink diamond (a square rotated 45 degrees) with the same stroke. Used by Titan attack tiers.
- SQUARE frame: a thick ink square with slightly rounded corners and the same stroke. Used by gear.
- SHIELD frame: a thick ink heater shield with the same stroke. Used by Talents.
- HEXAGON frame: a thick ink regular hexagon with flat top and bottom edges and pointed left and right corners, with the same stroke. Used by Attributes.
- CARTOUCHE frame: a thick ink rectangle, slightly wider than tall, whose four corners are cut inward as small concave quarter-circles, like an engraved plaque, with the same stroke. Used by Specialties.
- DROP frame: a thick ink upright teardrop, a round bottom rising to a single point at the top, with the same stroke. Used by Harm states.
- HAZARD frame: a thick ink equilateral triangle pointing up with rounded corners, like a warning sign; the glyph sits in its lower two thirds, with the same stroke. Used by Injury Types.
- TALL-CAPSULE frame: a thick ink vertical capsule: a tall rectangle about 60 percent as wide as it is tall with fully rounded top and bottom, with the same stroke. Used by Body Parts.
- ARCH frame: a thick ink tall arch: flat bottom edge, straight sides, and a full semicircle top, like a doorway, with the same stroke. Used by Titan Size Classes.
- WIDE-CAPSULE frame: a thick ink horizontal capsule: a wide rectangle about 60 percent as tall as it is wide with fully rounded left and right ends, centred vertically, with the same stroke. Used by Positions.
- BANNER frame: a thick ink horizontal banner: a wide rectangle about 60 percent as tall as it is wide, square left end, right end cut into a deep swallowtail notch, centred vertically, with the same stroke. Used by Squad Tactics.
```

The shield frame is set by ADR-0023. The other new frames were proposed for batch 1 so that every family has a contour that is distinct from the others at 32 px.

### Glyph rules

- Dice glyphs sit on an upright rounded-square die face inside the ring. Rolls have no die face; the glyph sits directly in the ring. That is how a roll reads apart from a die.
- The four die kinds differ in silhouette, not colour: base (three diagonal pips), Gear (die inside a cast-iron cog wheel), Stress (jagged crack), Titan Attack (bite out of a corner).
- Dice sizing rule: every die is an outline die face, never a solid fill. The face is 56 percent of canvas width, with an outline stroke of 8 percent, pips of 15 percent, and at least 3 percent clear gap to the ring. The Gear Die is a pre-industrial cast-iron cog wheel about 62 percent of canvas width with eight tapered teeth, holding an outline die face of about 34 percent with one pip of 13 percent. A square die face with tabs on its sides was rejected because it reads as a computer chip. A Stress crack has only three or four large zigs and is 9 percent wide. A Titan Attack bite reaches 40 percent into the face. A 52 percent face with 12 percent pips was still too small: the marks shrank to 2 px and die-base and die-stress looked alike. Proof all dice side by side as 32 px black silhouettes. If two look alike, enlarge the inner marks.
- Titan attack tiers escalate twice: the glyph gets more violent (eye, grasping hand, open jaw) and the diamond fills heavier (outline, half filled, solid).
- Reduce equipment to two or three identifying parts.
- ODM gear icon: one harpoon-like grappling anchor (spear tip, two swept-back barbs, eyelet) on a straight taut wire to a reel. Canisters with an upward three-pronged hook read as a trident or pitchfork. Draw the wire as a solid bar at least 5 percent of canvas width, the anchor head about 30 percent long, and the reel about 22 percent. A hairline wire vanishes at 32 px.
- Gear icons fill about 75 percent of the frame's inner area, and no line is thinner than 5 percent of canvas width.
- The glyph fills about 65 to 70 percent of the frame's inner area and is built from big solid shapes, with lines at least as thick as the frame stroke. Smaller or outline-only glyphs collapse at 32 px.
- Hands and creatures are one clean solid pictogram silhouette, never knuckles, nails, or wrinkles.
- No plus signs or cross shapes, in red or in ink: a plus reads as a medical cross. Show "more" with an upward double chevron.
- Human pictograms, including the scale figure in Titan Size Class icons, are Survey Corps soldiers: a hooded cloak and two blades held low. Without this, the model draws a medieval knight with a sword and a round shield.
- Titan pictograms are lanky humanoids with a slightly too-large head, never a gorilla or golem shape.
- A curved line low inside a round or drop frame reads as a smiling mouth. Draw scars and similar marks as straight diagonals.
- Dots in a grid appear only on dice. A biscuit, a panel, or a pattern with round holes reads as a die face at 32 px.
- In icons, ODM blades are always the segmented strip on a trigger handle, even inside another glyph such as the Slayer Specialty. A bare "blade" becomes a medieval sword.
- ODM blades are the anime's long, perfectly straight, uniform-width steel strips with an oblique squared tip, divided into snap-off segments by diagonal score gaps like a box-cutter blade, on a chunky pistol-like trigger handle with a trigger guard. No crossguard or pommel, never medieval swords or katanas. Draw a pair side by side and parallel, each blade a solid strip 13 percent of canvas width wide with only four segments (3 percent score gaps), 6 percent apart, on handles about 20 percent long. Crossed blades read as a close "X" at 32 px, and thin strips read as "//".
- A bite is a rounded scoop with scalloped tooth marks, and the die outline follows the bite edge. A stepped cut reads as stairs.
- For a retry or a later batch, attach approved icons with `-i` and say "keep the frame exactly as in the attached references".

### Frames by family

| Frame | Shape | Families |
| --- | --- | --- |
| round | a thick solid ink ring | approved: dice and rolls |
| diamond | a thick ink diamond, a square rotated 45 degrees | approved: Titan attack tiers |
| square | a thick ink square with slightly rounded corners | approved: gear |
| shield | a thick ink heater shield: flat top edge, straight sides curving to a point at the bottom | Talents |
| hexagon | a thick ink regular hexagon with flat top and bottom edges and pointed left and right corners | Attributes |
| cartouche | a thick ink rectangle, slightly wider than tall, whose four corners are cut inward as small concave quarter-circles, like an engraved plaque | Specialties |
| drop | a thick ink upright teardrop, a round bottom rising to a single point at the top | Harm states |
| hazard | a thick ink equilateral triangle pointing up with rounded corners, like a warning sign; the glyph sits in its lower two thirds | Injury Types |
| tall-capsule | a thick ink vertical capsule: a tall rectangle about 60 percent as wide as it is tall with fully rounded top and bottom | Body Parts |
| arch | a thick ink tall arch: flat bottom edge, straight sides, and a full semicircle top, like a doorway | Titan Size Classes |
| wide-capsule | a thick ink horizontal capsule: a wide rectangle about 60 percent as tall as it is wide with fully rounded left and right ends, centred vertically | Positions |
| banner | a thick ink horizontal banner: a wide rectangle about 60 percent as tall as it is wide, square left end, right end cut into a deep swallowtail notch, centred vertically | Squad Tactics |

Positions share one scene (a side-view Titan from the waist up, facing left) in which only a red soldier marker moves. Titan Size Classes share one scene (a ground line and a tiny soldier for scale at the lower left) in which only the Titan changes.

### Icon inventory

Built from `CONTEXT.md` and `data/` (attributes, specialties, talents, items and squad supply, harm, critical injuries, Titan Body Parts, size classes, positions, Squad Tactics). File names follow the data ids. Abnormal is not a size class in the data but shares the Size Class frame. The first twelve rows are the style lock set.

| File | Family | Frame | Meaning | Glyph |
| --- | --- | --- | --- | --- |
| `die-base.png` | Dice | round | Base die | Outline die face, three diagonal pips (style lock) |
| `die-gear.png` | Dice | round | Gear Die | Outline die face inside a cast-iron cog wheel (style lock) |
| `die-stress.png` | Dice | round | Stress Die | Outline die face split by a red zigzag crack (style lock) |
| `die-titan-attack.png` | Dice | round | Titan Attack Die | Outline die face with a scalloped bite (style lock) |
| `roll-push.png` | Rolls | round | Push | Circular arrow, red arrowhead (style lock) |
| `roll-stress.png` | Rolls | round | Stress roll | Heartbeat line with a red spike (style lock) |
| `tier-terrorize.png` | Titan attack tiers | diamond | Terrorize | Staring eye, outline diamond (style lock) |
| `tier-control.png` | Titan attack tiers | diamond | Control | Red grasping hand, half-filled diamond (style lock) |
| `tier-kill.png` | Titan attack tiers | diamond | Kill | Open jaw of teeth, solid red diamond (style lock) |
| `gear-odm.png` | Gear | square | ODM Gear | Red harpoon anchor on a taut wire to a reel (style lock) |
| `gear-blades.png` | Gear | square | Blade Set | Two parallel segmented blades on trigger handles (style lock) |
| `gear-horse.png` | Gear | square | Horse | Horse head with bridle (style lock) |
| `attr-strength.png` | Attributes | hexagon | Strength | A bold flexed arm, upper arm and forearm bent at a right angle with a big round bicep, in profile |
| `attr-agility.png` | Attributes | hexagon | Agility | A single large feather curving diagonally, with three bold notches along its vane |
| `attr-wits.png` | Attributes | hexagon | Wits: planning, mechanics, medicine | A pair of drafting compasses (dividers) standing open like an upside-down V with a round hinge at the top |
| `attr-perception.png` | Attributes | hexagon | Perception | A brass spyglass (collapsible telescope) lying diagonally, three stepped tube sections wide to narrow, the wide lens end at the upper right |
| `attr-instinct.png` | Attributes | hexagon | Instinct: gut calls, survival, reading people and Titans | A wolf head in profile facing left with ears pricked and raised hackles, one bold eye knocked out in paper colour |
| `attr-empathy.png` | Attributes | hexagon | Empathy | Two hands clasped in a firm handshake, drawn as one bold solid shape, seen from the side |
| `spec-slayer.png` | Specialties | cartouche | Slayer: makes the Nape strike | One long straight ODM blade pointing down to the lower left, with a bold curved slash arc sweeping across its tip |
| `spec-flier.png` | Specialties | cartouche | Flier: best on the wires | A small solid soldier silhouette in mid-swing with cloak streaming behind, hanging from two taut straight wires that run up to the two upper corners |
| `spec-hunter.png` | Specialties | cartouche | Hunter: decoys, spots danger, feeds the camp | A curved hunting horn with a flared bell and a carrying strap |
| `spec-tactician.png` | Specialties | cartouche | Tactician: reads the Titan and the field | A bold curved route arrow sweeping from the lower left around a single solid map-pin marker to the upper right |
| `spec-leader.png` | Specialties | cartouche | Leader: rallies and steadies the squad | A raised flag on a tall pole, the flag rippling to the right, the pole planted at the bottom |
| `spec-medic.png` | Specialties | cartouche | Medic: keeps the injured alive | A rolled bandage with a loose tail unrolling to the right and a curved suture needle beside it |
| `spec-engineer.png` | Specialties | cartouche | Engineer: keeps ODM Gear flying | A large open-ended spanner (wrench) crossed with a claw hammer |
| `spec-rider.png` | Specialties | cartouche | Rider: at home in the saddle | A big horseshoe, open end up, with six bold nail holes knocked out in paper colour |
| `spec-brawler.png` | Specialties | cartouche | Brawler: tears free of a Titan's grip | A heavy chain of three big links snapping in the middle, the broken ends flying apart with two short burst marks |
| `talent-dice.png` | Talent types | shield | Dice Talent: adds base dice to named rolls | An upright outline die face with three big pips on the diagonal (the same die face as the approved die-base), a small bold plus mark at its upper right |
| `talent-rule.png` | Talent types | shield | Rule Talent: changes a rule when triggered | A large old iron key pointing down, with a round bow at the top and two bold square teeth on its bit |
| `gear-gas-canister.png` | Gear | square | Gas canister | One tall upright steel gas canister, a long rounded capsule with a band near the top and a small valve fitting on top |
| `gear-medical-kit.png` | Gear | square | Medical kit (medical supplies) | A leather satchel with a buckled flap, a rolled bandage sticking out of its top |
| `gear-firearm.png` | Gear | square | Firearm (flintlock pistol or musket) | A flintlock pistol in profile pointing left: long barrel, curved wooden grip, a clear hammer and trigger guard |
| `gear-flares.png` | Gear | square | Flares (signal flare gun) | A short wide-barrelled signal flare gun at the lower left pointing up to the upper right, with a curving smoke trail rising from its muzzle to a bold burst star |
| `gear-prosthetic.png` | Gear | square | Prosthetic | A workshop-made wooden prosthetic forearm and hand, upright, with an iron hinge at the wrist, a rigid cupped hand, and two leather straps with buckles around the forearm cuff |
| `gear-rations.png` | Gear | square | Rations | A round lidded ration tin on the left with a square hardtack biscuit leaning against it, the biscuit showing a three by three grid of docking holes knocked out in paper colour |
| `harm-health.png` | Harm | drop | Health | A bold simple heart shape centred in the round lower part of the drop |
| `harm-critical-injury.png` | Harm | drop | Critical Injury: a lasting wound | A bold diagonal wound slash with ragged edges and one small blood drop falling below it |
| `harm-down.png` | Harm | drop | Down: at 0 Health, can only crawl | A solid human pictogram lying flat on its front with one arm reaching forward along a short ground line |
| `harm-death-roll.png` | Harm | drop | Death Roll: the roll to see whether a soldier dies | A simple skull seen from the front with two big eye sockets and a few square teeth, sitting on top of a small outline die face with one pip |
| `harm-scar.png` | Harm | drop | Scar: a lasting named trauma | A thick curved scar line crossed by five short bold stitch marks |
| `harm-fear.png` | Harm | drop | Fear: the Fear Roll | A solid human pictogram crouched and hunched, both arms wrapped over its head, with three short shake marks on each side |
| `injury-crush.png` | Injury Types | hazard | Crush | A heavy solid block pressing straight down onto a flattened bar, with two short impact lines on each side |
| `injury-bite.png` | Injury Types | hazard | Bite | A bite mark: two opposed curved rows of four big blunt tooth marks, the upper row pointing down and the lower row pointing up, a gap between them |
| `injury-cut.png` | Injury Types | hazard | Cut | One bold straight diagonal slash from upper right to lower left with a sharp tapered end, and a thin parallel shadow slash beside it |
| `injury-pierce.png` | Injury Types | hazard | Pierce | A thick spike with a sharp point driving down through a horizontal bar, the point emerging below the bar |
| `injury-burn.png` | Injury Types | hazard | Burn | A bold three-tongued flame |
| `body-eyes.png` | Body Parts | tall-capsule | Eyes | Two big almond eyes stacked vertically, one above the other, each with a solid round pupil |
| `body-arm.png` | Body Parts | tall-capsule | Arm | A long upright arm silhouette from elbow to open hand, fingers spread at the top |
| `body-leg.png` | Body Parts | tall-capsule | Leg | A long upright leg silhouette from thigh to foot, knee slightly bent, foot pointing left at the bottom |
| `body-nape.png` | Body Parts | tall-capsule | Nape: the kill point | The back of a head and neck in profile facing left, with a bold notch cut out of the back of the neck and a red target mark in the notch |
| `pos-distant.png` | Positions | wide-capsule | Distant: out of the Titan's reach | Shared POSITION SCENE with the soldier marker far at the left end, separated from the Titan by a bold gap of three short dashes. |
| `pos-in-reach.png` | Positions | wide-capsule | In Reach: within reach of the Titan's hands | Shared POSITION SCENE with the soldier marker directly in front of the Titan's lowered open hand, almost touching its fingers. |
| `pos-on-body.png` | Positions | wide-capsule | On Body: hooked into or standing on the Titan | Shared POSITION SCENE with the soldier marker sitting on the Titan's shoulder. |
| `pos-blind-spot.png` | Positions | wide-capsule | Blind Spot: out of sight, nape within reach | Shared POSITION SCENE with the soldier marker behind the Titan's head at nape height, on the side away from its face, and a short bold sight line from the Titan's eye pointing away to the left. |
| `titan-small.png` | Titan Size Classes | arch | Small Titan (3 to 5 m) | Shared SIZE SCENE with a squat Titan silhouette about 40 percent of the arch's inner height, big head and stubby limbs. |
| `titan-medium.png` | Titan Size Classes | arch | Medium Titan (6 to 10 m) | Shared SIZE SCENE with a lanky Titan silhouette about 70 percent of the arch's inner height. |
| `titan-large.png` | Titan Size Classes | arch | Large Titan (11 to 15 m) | Shared SIZE SCENE with a heavy Titan silhouette filling the arch's full inner height, its head stooped under the curve of the arch. |
| `titan-abnormal.png` | Titan Size Classes | arch | Abnormal Titan: breaks the standard pattern | Shared SIZE SCENE with a Titan silhouette about 60 percent of the arch's inner height running low on all fours in a twisted, lunging stride, with two bold red jagged motion marks behind it. |
| `tactic-hook-and-cut.png` | Squad Tactics | banner | Hook and Cut: a comrade strikes the Nape the moment attention breaks | A grappling hook on the left with a short taut line to one long straight ODM blade slashing down on the right |
| `tactic-hamstring-line.png` | Squad Tactics | banner | Hamstring Line: a helped strike against a leg gains a success | A big leg silhouette in profile with a bold horizontal slash across the back of the knee, and two small chevrons pointing at the slash from the left |
| `tactic-clear-the-hand.png` | Squad Tactics | banner | Clear the Hand: anyone can strike the arm holding a grabbed comrade | A large Titan hand opening, fingers spreading, with a small solid soldier silhouette dropping free below it, and a bold slash across the wrist |
| `tactic-fall-back.png` | Squad Tactics | banner | Fall Back: soldiers on the Titan drop back into reach | Two bold chevrons pointing left, one behind the other, moving away from a solid vertical bar at the right |

### Post-processing

If an icon comes back on white, convert white to alpha (colour-to-alpha against `#FFFFFF`) and save it as a 1024 px transparent PNG. Proof every icon at 32 px on paper, on white, and as a black silhouette before approval.

## The wax seal

One asset, `site/src/assets/icons/seal-wax.webp`, drawn on every plate that carries `seal` (the Home opener and the opener layout). It is the one deliberate exception to the flat ink rules above: a seal is a material object mounted on the page, not a printed mark, so it is rendered as real wax with light and depth. It therefore does not take the style-lock plates as `-i` references, because the anime rendering pulls it back toward line art. Everything else still holds: it uses the palette, the folder layout, and the naming rules.

### Style block: wax seal

```text
STYLE (wax seal): a rich, product-quality rendering of one blob of real poured sealing wax, seen straight on from directly above, flat to the camera, filling the frame. Real sealing-wax material: a softly glossy waxy surface with fine wax grain, a few tiny air pockets and pinholes, and a gentle specular sheen rather than a plastic or glass shine. Colour: deep oxblood to crimson and nothing else. The body sits around #8B2A21, the deepest crevices and the shaded walls around #5E1A13, and the lit upper-left rim brightens toward #A63A2C. One soft light source from the upper left: the raised rim is lit along its upper left, throws a short shadow across the wax toward the lower right, and the pressed basin catches a soft gradient from lit upper left to dark lower right.
```

### Subject

```text
SUBJECT: one generously poured seal of wax about 94 percent of the canvas wide, centred, as if it had just been stamped onto a letter. It is not a neat circle: the pour spread a little more to the lower right, so the blob is faintly oval and clearly hand-made. Its outer edge is a thick molten rim that swells and thins the whole way round, with two long thin wax runs trailing outward at the lower right, a thicker lobe at the left, and one or two small teardrops of wax that broke away and set just past the rim. Inside that rim the wax is pressed down into a deep basin by a heavy metal stamp, leaving a broad raised ring where the stamp's edge bit in and a faint concentric pressure ridge just inside it. Pressed into the floor of the basin, crisp, sharply defined and exactly centred, is the Survey Corps Wings of Freedom emblem: two large stylised wings mirrored left and right and overlapping at the centre, each wing built from five long tapered feathers fanning outward and upward from the shared centre point, the feathers clean, bold and clearly separated. The emblem is debossed into the wax, so each feather's upper-left cut wall lies in shadow and its lower-right wall catches the light. The emblem must read clearly and unmistakably even when the whole seal is shown only 120 pixels across, so keep the feathers few, thick and well separated, with no hairlines and no tiny gaps.
```

### Exclusions: wax seal

```text
EXCLUSIONS: transparent background with true alpha, nothing behind the seal at all: no paper, no envelope, no desk, no table, no fabric, no ribbon, no cord, no drop shadow, no cast shadow, no glow, no reflection, no vignette, no background colour. If transparency is impossible, put the seal on a plain flat pure white #FFFFFF background with nothing else on it. No text, no letters, no numbers, no signature, no watermark, no border, no frame, no ring of beads or rope around the emblem, no second seal, no hand, no stamp tool, no candle. Nothing in the frame but the single wax seal. Not a flat vector icon, not a cartoon, not a line drawing, not a 3D plastic render.
```

### Rules

- The page adds the rotation and the drop shadow (`.seal` in `base.css`), so the asset carries neither. A baked shadow doubles up and breaks when the seal overhangs the plate's edge.
- The emblem, not the wax, is what fails first. Proof every candidate at 120 px, rotated 12 degrees, on paper tone `#E4DCC5`. A shallow deboss with thin grooves flattens into a leaf or a fern at that size; the wings must still split visibly down the middle.
- Keep the alpha bounding box centred in the canvas, since the page positions the square box, not the visible blob. Clamp alpha at or above 250 to fully opaque before encoding: the generator returns a body at 253 and the near-transparent pixels fringe on paper.
- Generated seals come back browner than the palette. Measure the mean colour over the opaque pixels and lift the RGB until it lands near `#8B2A21`; the picked seal needed a 1.15 multiplier.
- Three candidates were made. The picked one had the boldest wing split at 120 px; a shallow-deboss candidate and a candidate whose wings left a hollow V both read as foliage and are kept in `site/art-src/seal/rejected/`.

## Sizes

| Asset | Aspect | Generated size | Web copy |
| --- | --- | --- | --- |
| Hero colour plate | 16:9 | about 1672x941 | WebP, 1600 px long edge, quality 82 |
| Chapter opener or gear plate | 16:9 or 3:2 | about 1672x941 or 1536x1024 | WebP, 1600 px long edge, quality 82 |
| Titan or soldier portrait | 4:5 | about 1024x1280 | WebP, 1600 px long edge, quality 82 |
| Ink-wash vignette | 1:1 | 1024x1024 | WebP, quality 82 |
| Game icon | 1:1 | 1024x1024, transparent | WebP with alpha, quality 82, alpha quality 100 |
| Wax seal | 1:1 | 1024x1024, transparent | WebP with alpha, 768 px, quality 82, alpha quality 100 |

WebP copies are made with `cwebp -q 82 -alpha_q 100 -m 6`, adding `-resize` when the long edge is over 1600 px. Crop to the target ratio before encoding if the model returns a near miss.

## File naming

Names describe meaning, never appearance, in lowercase kebab case.

- Colour plates: `plate-<subject>-<detail>.png`, for example `plate-hero-sortie.png`, `plate-titan-medium.png`, `plate-soldier-recruit.png`.
- Ink-wash vignettes: `vignette-ink-<subject>.png`, for example `vignette-ink-odm-canister.png`.
- Wax seal: `seal-wax.png`, one file.
- Icons: `<family>-<meaning>.png`. Families are `die`, `roll`, `tier`, `gear`, `talent`, `attr`, `harm`, `size`, `position`, `tactic`, `specialty`. Examples: `die-stress.png`, `roll-push.png`, `tier-kill.png`, `gear-odm.png`.
- Retries keep the name and add `-v2`, `-v3` in `originals/` until one is picked. The picked file takes the plain name.

## Folders

- `site/art-src/<batch>/originals/`: generated PNGs as Codex saved them (gitignored).
- `site/art-src/<batch>/icons/`: keyed transparent icon PNGs (gitignored).
- `site/art-src/<batch>/web/`: WebP copies, the files that get committed once the owner approves the batch contact sheet.
- Approved copies are committed under `site/src/assets/`: plates and vignettes in `plates/`, icons in `icons/`. Both go through `astro:assets`, which serves each page a copy at the size it is drawn. Nothing shown on a page belongs in `site/public/`, which Astro copies verbatim: a 1024 px icon is about 100 KB, and the Glossary alone shows twenty of them.
- `site/art-src/seal/`: the wax seal's 1024 px original, with its unpicked candidates in `rejected/` (gitignored).
- `site/art-src/brand/`: the brand batch. `prompts/` holds every prompt as it was sent, `originals/` the picked generations, `rejected/` the ones that lost, `web/` the processed masters, and `og-compose.html` the page the social card is captured from (all gitignored).
- `site/art-src/<batch>/contact-sheet*.png`: review sheets for the owner.
