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

Codex saves each image under `~/.codex/generated_images/<session>/` and copies it into the working folder under the filename the prompt names. One colour plate takes about 80 seconds. Several runs can go in parallel. Icons go through the Codex `board-game-icon-assets` skill, named in the prompt.

The owner locked `plate-hero-sortie.png` and `plate-soldier-recruit.png` as the style references. Never regenerate or edit them. Attach both with `-i` to every generation, whether plate, vignette, or icon (for example `-i site/art-src/style-lock/originals/plate-hero-sortie.png -i site/art-src/style-lock/originals/plate-soldier-recruit.png`). For plates, start the prompt with this line:

```text
REFERENCE IMAGES: the attached images are approved plates from this same set. Match their rendering exactly: the same anime linework, painterly anime shading, muted warm palette, and level of stylisation. Do not copy their subjects.
```

Without references, subjects with a lot of bare skin or foliage (Titans, forests) drift toward photoreal. With them, the Titan plate matched the soldier plate on the first try. For icons, say the plates are world reference only (what ODM gear, wire, and blades look like, not how to render), and also attach approved icons for frame and texture.

Every prompt is assembled in this order: the run header, the aspect ratio line, the style block, the world block (plates only), the subject, then the exclusions.

### Run header

```text
Use your built-in image generation tool to create exactly ONE image, then copy the generated PNG into the current working directory under the filename given below (copy the file; do not re-encode, crop, or resize it). Do not create or modify any other files, do not write code, and do not review anything. When done, reply with only the absolute path of the saved file.

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
- Titans are generic: smooth, featureless, doll-like skin with no anatomical detail, lanky with awkward, slightly wrong proportions, a hungry expression, faint steam. Never describe a named Titan.
- Titans must be threatening, not only uncanny: a hunched, predatory, reaching posture seen from a low camera at a soldier's height. Never a Titan standing with its arms at its sides.
- Give each Titan a clearly original face built from specific asymmetric features: uneven eyes, a crooked nose, a slack or lopsided open jaw, unkempt matted hair of an ordinary colour. Rejected in the style lock: long shaggy dark hair with a lipless grin (reads as the Attack Titan); blond wisps with a toothy grin, and a bald moon face with a broad closed-lip smile (both read as the Smiling Titan).
- End every Titan prompt with the canon Titan exclusion line: "It must not resemble any canon Titan: not the Smiling Titan (no bald head, no broad closed-lip smile, no long blonde hair), not the Attack Titan (no long black hair with a lipless skull grin), not the Colossal Titan (no skinless exposed muscle), not the Armored Titan (no armour plates), not the Female Titan (no blonde hair, no crystal hardening), not the Beast Titan (no fur), not the Cart Titan, not the Jaw Titan (no beak jaw or claws), not the War Hammer Titan. No arms-at-sides standing pose."
- The approved Titan used this posture and face, which is a good starting point for other Medium Titans (change the hair, eyes, and jaw for each new one): "it hunches forward over the viewer with its head thrust low and tilted, one very long, too-thin arm reaching down toward the camera with bony splayed fingers, the other arm hanging awkwardly ... a gaunt, hollow-cheeked, long face with asymmetric features: the left eye noticeably larger and set lower than the right, both eyes wide, unblinking and fixed hungrily on the viewer; a crooked, flattened nose; a slack, lopsided open jaw hanging down on one side, showing a few uneven, human, yellowed teeth only on that side, a thread of steam or drool at the corner. Unkempt, greasy, mouse-brown hair in thin matted clumps down to the jaw".
- Frame Titans from the hips up with the lower body behind roots, mist, or terrain.
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
```

The shield frame is set by ADR-0023 but was not in the style lock test sheet. Proof it with its first batch.

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
- ODM blades are the anime's long, perfectly straight, uniform-width steel strips with an oblique squared tip, divided into snap-off segments by diagonal score gaps like a box-cutter blade, on a chunky pistol-like trigger handle with a trigger guard. No crossguard or pommel, never medieval swords or katanas. Draw a pair side by side and parallel, each blade a solid strip 13 percent of canvas width wide with only four segments (3 percent score gaps), 6 percent apart, on handles about 20 percent long. Crossed blades read as a close "X" at 32 px, and thin strips read as "//".
- A bite is a rounded scoop with scalloped tooth marks, and the die outline follows the bite edge. A stepped cut reads as stairs.
- For a retry or a later batch, attach approved icons with `-i` and say "keep the frame exactly as in the attached references".

### Post-processing

If an icon comes back on white, convert white to alpha (colour-to-alpha against `#FFFFFF`) and save it as a 1024 px transparent PNG. Proof every icon at 32 px on paper, on white, and as a black silhouette before approval.

## Sizes

| Asset | Aspect | Generated size | Web copy |
| --- | --- | --- | --- |
| Hero colour plate | 16:9 | about 1672x941 | WebP, 1600 px long edge, quality 82 |
| Chapter opener or gear plate | 16:9 or 3:2 | about 1672x941 or 1536x1024 | WebP, 1600 px long edge, quality 82 |
| Titan or soldier portrait | 4:5 | about 1024x1280 | WebP, 1600 px long edge, quality 82 |
| Ink-wash vignette | 1:1 | 1024x1024 | WebP, quality 82 |
| Game icon | 1:1 | 1024x1024, transparent | WebP with alpha, quality 82, alpha quality 100 |

WebP copies are made with `cwebp -q 82 -alpha_q 100 -m 6`, adding `-resize` when the long edge is over 1600 px. Crop to the target ratio before encoding if the model returns a near miss.

## File naming

Names describe meaning, never appearance, in lowercase kebab case.

- Colour plates: `plate-<subject>-<detail>.png`, for example `plate-hero-sortie.png`, `plate-titan-medium.png`, `plate-soldier-recruit.png`.
- Ink-wash vignettes: `vignette-ink-<subject>.png`, for example `vignette-ink-odm-canister.png`.
- Icons: `<family>-<meaning>.png`. Families are `die`, `roll`, `tier`, `gear`, `talent`, `attr`, `harm`, `size`, `position`, `tactic`, `specialty`. Examples: `die-stress.png`, `roll-push.png`, `tier-kill.png`, `gear-odm.png`.
- Retries keep the name and add `-v2`, `-v3` in `originals/` until one is picked. The picked file takes the plain name.

## Folders

- `site/art-src/<batch>/originals/`: generated PNGs as Codex saved them (gitignored).
- `site/art-src/<batch>/icons/`: keyed transparent icon PNGs (gitignored).
- `site/art-src/<batch>/web/`: WebP copies, the files that get committed once the owner approves the batch contact sheet.
- `site/art-src/<batch>/contact-sheet*.png`: review sheets for the owner.
