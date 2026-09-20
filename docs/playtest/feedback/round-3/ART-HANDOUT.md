# Art handout: batch 1 icons, and the engagement board set

A handout for the session that runs on the owner's machine, where the Codex CLI lives. Everything
below is assembled from `site/design/art-style.md`, `docs/adr/0022-*`, `docs/adr/0027-*`,
`foundry/design/asset-inventory.md`, `foundry/src/art.ts`, `foundry/tools/import-art.sh`, and
sections 2 and 7 of `docs/playtest/feedback/round-3/zone-combat-design.md`. You should not need any
of that conversation, only those files.

## 1. Context

Wings of Freedom is a tabletop RPG in an Attack on Titan setting, shipped as a public website and as
a Foundry VTT system. Soldiers fly on ODM gear around Titans that they can only kill by cutting the
Nape, so the interesting facts in a fight are vertical: hooked into the body, hanging in the blind
spot, airborne between anchors, grabbed in a hand. Round 3 of playtesting settled two pieces of work
that need art. The first is small and lands this week: three state marks that the Foundry tracker
draws on tokens, because Frenzy, Openings and a soldier's hooked-in flag drive decisions and are
currently invisible. The second is large and slow: a custom PIXI engagement board that takes over the
canvas area during a Titan Engagement and draws the fight as a small field of isometric hexes, with
terrain that carries the anchor rating, a Titan scaled by Size Class, and soldier figures placed on
the vertical axis. The board is the hero feature of batch E and its art has the longest lead time, so
it starts now.

## 2. Ground rules, before anything else

**The art style is locked.** `site/design/art-style.md` is binding. Do not write a new style block,
do not paraphrase an existing one, do not "improve" a colour. Where this handout needs something the
style file does not cover, it says so and lists it in section 8 as a question for the owner. Do the
same if you hit another gap: ask, do not invent.

**Read `site/design/art-style.md` in full before your first run.** This handout tells you which blocks
to use and in what order. It deliberately does not reproduce the locked blocks, because a
re-typed block is a changed block.

**Every prompt is assembled in this order** (art-style.md, "How to generate"):

1. the run header
2. the aspect ratio line
3. the style block
4. the world block (plates only)
5. the subject
6. the exclusions

**The `codex exec` invocation, verbatim from art-style.md:**

```bash
codex exec --skip-git-repo-check --ephemeral -s workspace-write \
  -C site/art-src/<batch>/originals --color never - < prompt.txt
```

Substitute the batch folder and add the `-i` references. Run it from the repository root, the folder
that holds `site/`, `foundry/` and `docs/`. art-style.md's own example writes `-i` paths relative to
that root while `-C` points elsewhere, so keep `-i` paths repo-root-relative; if a run cannot find a
reference, switch that `-i` to an absolute path.

**The style-lock references go on every single generation.** art-style.md: the owner locked
`plate-hero-sortie.png` and `plate-soldier-recruit.png` as the style references, they are never
regenerated or edited, and both are attached with `-i` to every generation, plate, vignette or icon.

```bash
REFS_PLATE="-i site/art-src/style-lock/originals/plate-hero-sortie.png -i site/art-src/style-lock/originals/plate-soldier-recruit.png"
```

`site/art-src/` is gitignored, so those two PNGs exist only on the owner's machine. Check them first:

```bash
ls -l site/art-src/style-lock/originals/plate-hero-sortie.png site/art-src/style-lock/originals/plate-soldier-recruit.png
```

If they are missing, the committed WebP copies of the same two plates are at
`site/src/assets/plates/plate-hero-sortie.webp` and `site/src/assets/plates/plate-soldier-recruit.webp`.
Decode them to PNG rather than passing WebP, because art-style.md only ever shows PNG references:

```bash
mkdir -p foundry/art-src/refs
for f in plate-hero-sortie plate-soldier-recruit; do dwebp site/src/assets/plates/$f.webp -o foundry/art-src/refs/$f.png; done
```

and point `REFS_PLATE` at `foundry/art-src/refs/`. Tell the owner in your report if you had to do
this, because it means the run used a downscaled reference.

### The operational warnings, carried over from art-style.md

These are not optional and they have bitten this project before.

- **A parallel run can copy another session's newest image.** art-style.md: several runs can go in
  parallel, but then a session may copy another session's newest image. Codex saves each image under
  `~/.codex/generated_images/<session>/` and copies it into the working folder.
- **The copy guard must stay in the run header, word for word.** It is the sentence that says to use
  only the exact file path the session's own image generation call returned, never the newest file in
  `~/.codex/generated_images`. Never trim the run header to make a prompt shorter.
- **Check every batch for duplicate hashes.** art-style.md: after each batch check that no two files
  share a hash (`md5 -r *.png`). Do it like this, and regenerate anything that collides:

```bash
md5 -r *.png | sort | uniq -d -w32
```

  A duplicate hash means one file is another run's image wearing the wrong name. Two assets that look
  similar but hash differently are fine; two that hash the same are always a bug.
- **Budget the time.** One colour plate takes about 80 seconds.
- **Subjects with bare skin or foliage drift photoreal without the references attached.** This is the
  single loudest warning in the file, and **this work is exactly those two subjects**: Titan figures
  are bare skin and Wooded, Sparse and Giant Forest tiles are foliage. art-style.md records that with
  the references attached the Titan plate matched the soldier plate on the first try, and without them
  it drifts. If you ever catch yourself dropping `-i` to save a token or two, you are about to burn a
  whole batch. Every prompt for a Titan or a forest also carries the line "clean anime linework, not
  photographic", which art-style.md requires for exactly this reason.

### Prepare the locked blocks once

Copy the locked text out of `site/design/art-style.md` into files, verbatim, and build each prompt by
concatenation. Copy, do not retype.

```bash
mkdir -p foundry/art-src/blocks
# From art-style.md, copy each fenced block verbatim into its own file:
#   "### Run header"                     -> foundry/art-src/blocks/header-plate.txt
#   "### Icon run header"                -> foundry/art-src/blocks/header-icon.txt
#   "### Style block: colour plate"      -> foundry/art-src/blocks/style-plate.txt
#   "### Style block: icon system"       -> foundry/art-src/blocks/style-icon.txt
#   "### Frames"                         -> foundry/art-src/blocks/frames.txt
#   "### World block"                    -> foundry/art-src/blocks/world.txt
#   "### Exclusions: colour plate"       -> foundry/art-src/blocks/excl-plate.txt
```

The style-lock reference line that art-style.md gives for plates, which is the first line of a plate
prompt, goes in `foundry/art-src/blocks/refline-plate.txt`. It begins "REFERENCE IMAGES: the attached
images are approved plates from this same set." Copy it verbatim too.

For icons, art-style.md says to state that the plates are world reference only (what ODM gear, wire
and blades look like, not how to render) and to also attach approved icons for frame and texture.
Put that sentence in `foundry/art-src/blocks/refline-icon.txt`, written as this handout uses it:

```text
REFERENCE IMAGES: the attached colour plates are world reference only. They show what ODM gear, wire, and blades look like in this world; they are not how to render this icon. The attached icons are approved icons from this same set: keep the frame exactly as in the attached references, and match their stroke weight, canvas margin, and stamp texture.
```

## 3. Batch 1: the icons needed now

### 3.1 What already exists

I checked `foundry/static/assets/icons/`, all 119 files, and `site/src/assets/icons/`, all 65.

| Requested | Already exists? |
|---|---|
| Hooked into the Titan | **No.** Nothing in the set means this. |
| Frenzy | **No.** |
| Openings | **No.** |
| Momentum pip, filled and outline | **No.** Nothing in the set serves. |

So all four are new. None of them can be skipped as already done. Two clarifications so you do not
duplicate something that is nearby but different:

- `pos-on-body.webp` exists and is the **Position** On Body. The hooked mark is not a Position: a
  soldier who made a Nape strike keeps the `hooked-by-strike` flag and meets the Attention Ladder's
  `hooked-into-its-body` rung even when their Position is Blind Spot
  (`foundry/src/rules/engagement/attention.ts`, `foundry/src/rules/engagement/strikes.ts`). The two
  marks appear side by side, so they must not look alike.
- `status-engaged.webp` and `status-held.webp` exist and mean Skirmish engagement and a Foe's hold.
  Neither is this.

One useful precedent: `tier-terrorize`, `tier-control` and `tier-kill` are an approved three step
escalation in one family, where the glyph gets more violent and the diamond fills heavier. That is
the repo's model for "a value that rises", and it is the reason for the Frenzy recommendation below.

### 3.2 Two important facts about how these are drawn

Read `foundry/src/tracker/badges.ts` before you generate, because two details in it constrain the art.

1. **Size.** The badge height is `Math.max(20, Math.round(grid * 0.28))` and the icon inside it is
   `h - pad * 2` with `pad = round(h * 0.15)`. On a default 100 px grid that is a 28 px badge holding
   a 20 px icon. So these read at 20 to 28 px, smaller than the 32 px art-style.md proofs at. Proof
   them at **20 px**, not 32.
2. **The badge inverts the icon.** `badges.ts` applies a `PIXI.ColorMatrixFilter` with
   `filter.negative(false)` to the badge icon, so an ink glyph on transparent alpha comes out as a
   pale glyph and the transparency is untouched. This means all three of these must be **flat ink
   stamps on transparent alpha**, in the website icon style, exactly like `pos-on-body.webp`. They
   must **not** be in the dark filled disc style of the `status-*.webp` token icons: inverted, a
   filled ink disc becomes a pale blob that swallows the glyph. If the owner also wants any of these
   on Foundry's own Token HUD status row, that is a second asset in the disc style; see section 8.

### 3.3 The assets

Family prefixes follow the shipped Foundry convention (`pos-`, `status-`, `titan-`, `action-`), not
art-style.md's older website list, which does not name a family for Titan state marks. That choice is
flagged in section 8.

Working folder for this batch: `foundry/art-src/batch-2/`. Generate into
`foundry/art-src/batch-2/originals/`.

```bash
mkdir -p foundry/art-src/batch-2/originals foundry/art-src/batch-2/icons foundry/art-src/batch-2/web
```

#### A. `pos-hooked.png` - hooked into the Titan

| | |
|---|---|
| File name | `pos-hooked.png`, keyed to `pos-hooked.png`, shipped as `pos-hooked.webp` |
| Destination | `foundry/static/assets/icons/pos-hooked.webp`, 128 px (matches the other `pos-*.webp`, which are 128 px in the shipped set) |
| Aspect ratio | 1:1, 1024x1024, transparent |
| Frame | WIDE-CAPSULE, the frame art-style.md assigns to Positions, so it sits in the badge row with the same silhouette as the four Position badges |
| Attach with `-i` | `$REFS_PLATE` plus `foundry/art-src/refs/pos-on-body.png` and `foundry/art-src/refs/pos-blind-spot.png` |

Make the icon references first:

```bash
mkdir -p foundry/art-src/refs
for f in pos-on-body pos-blind-spot tier-control tier-kill; do dwebp site/src/assets/icons/$f.webp -o foundry/art-src/refs/$f.png; done
```

Prompt assembly:

```bash
cd <repo root>
B=foundry/art-src/blocks
cat $B/header-icon.txt $B/refline-icon.txt $B/style-icon.txt $B/frames.txt subject-pos-hooked.txt > prompt.txt
codex exec --skip-git-repo-check --ephemeral -s workspace-write \
  -C foundry/art-src/batch-2/originals --color never \
  -i site/art-src/style-lock/originals/plate-hero-sortie.png \
  -i site/art-src/style-lock/originals/plate-soldier-recruit.png \
  -i foundry/art-src/refs/pos-on-body.png \
  -i foundry/art-src/refs/pos-blind-spot.png \
  - < prompt.txt
```

Set `<n>` in the icon run header to 1, and add the aspect ratio line and the filename line after it,
in the run header's own words:

```text
FILENAME: pos-hooked.png
Aspect ratio 1:1 (for example 1024x1024).
```

`subject-pos-hooked.txt`:

```text
SUBJECT, one icon:
FILE pos-hooked.png. Frame: WIDE-CAPSULE. Meaning: Hooked In, a soldier whose grapple is sunk into this Titan's body after a Nape strike.
GLYPH: the back of a head and neck in profile facing left, drawn as one bold solid ink silhouette, with a bold wedge-shaped notch cut out of the back of the neck, exactly as in the approved body-nape icon. Sunk into that notch is one harpoon-like grappling anchor in wax-seal red: a spear tip driven into the notch, two swept-back barbs, and an eyelet at its back. From the eyelet a single straight taut ink wire runs to the right and off to the inner edge of the capsule. Draw the wire as a solid bar at least 5 percent of canvas width, and the anchor head about 30 percent of canvas width long. Three shapes only: head-and-neck, red anchor, wire. Clean anime linework, not photographic.
```

Then append the icon exclusions. art-style.md's icon system block already carries "No text, letters,
numerals, or logos anywhere", so no separate icon exclusions block exists in the file; do not invent
one. Add only this line, which art-style.md requires of any prompt that shows a Titan in any form:

```text
It must not resemble any canon Titan: not the Smiling Titan (no bald head, no broad closed-lip smile, no long blonde hair), not the Attack Titan (no long black hair with a lipless skull grin), not the Colossal Titan (no skinless exposed muscle), not the Armored Titan (no armour plates), not the Female Titan (no blonde hair, no crystal hardening), not the Beast Titan (no fur), not the Cart Titan, not the Jaw Titan (no beak jaw or claws), not the War Hammer Titan. No arms-at-sides standing pose.
```

**Acceptance.** Right: at 20 px you read a neck with something bitten into it and a line running off;
it is instantly not `pos-on-body`, whose glyph is a soldier marker sitting on a Titan's shoulder.
Common failures to watch for: the anchor shrinks to a dot and the icon reads as a plain profile head;
the wire is drawn as a hairline and vanishes, which art-style.md warns about by name; the notch is
drawn as a curve low in the shape and reads as a smiling mouth, which art-style.md also warns about,
so keep the notch a straight-sided wedge.

#### B. `titan-frenzy.png` - the Frenzy mark

**Recommendation: one icon plus a code-drawn 0 to 3 track, not four states.** Reasons, in order:

1. At 20 px, four escalating stamps of the same glyph are not distinguishable. art-style.md records
   this failure mode directly: on the dice, a 52 percent face with 12 percent pips left marks at 2 px
   and `die-base` and `die-stress` looked alike. Frenzy's four steps are a much finer distinction
   than those two dice.
2. The value has to be readable as a *number*, because Frenzy is added to the behavior roll
   (OWNER-DECISIONS, item 12, and ASSESSMENT F2: D6 plus Frenzy). A track of three boxes filled to
   the value answers "how much" in one glance; a fill-weight ramp does not.
3. It matches the two patterns the project already picked. Openings are specified as "one mark per
   Opening" (ASSESSMENT section 7), and ADR-0027 locks "Pips and boxes: these show how many dice each
   value puts in a pool". A code-drawn track is the same idiom, it is free, it stays crisp at any
   zoom, and it needs no regeneration when the simulator moves the cap (OWNER-DECISIONS: the
   simulator moves the rate and the cap; the shape is settled).
4. It is one generation instead of four, on the batch that is due this week.

So: generate one mark, and have `badges.ts` draw three small boxes beside it with `PIXI.Graphics`,
filled to the current value, in the Titan's own badge colour, the same way the Momentum pips are
drawn for soldiers.

| | |
|---|---|
| File name | `titan-frenzy.png`, shipped as `titan-frenzy.webp` |
| Destination | `foundry/static/assets/icons/titan-frenzy.webp`, 128 px |
| Aspect ratio | 1:1, 1024x1024, transparent |
| Frame | DIAMOND, the frame art-style.md assigns to Titan attack tiers, so a Titan-side mark is a diamond and a soldier-side mark is a capsule at a glance |
| Attach with `-i` | `$REFS_PLATE` plus `foundry/art-src/refs/tier-control.png` and `foundry/art-src/refs/tier-kill.png` |

`subject-titan-frenzy.txt`:

```text
SUBJECT, one icon:
FILE titan-frenzy.png. Frame: DIAMOND, outline, the same stroke as the approved tier icons. Meaning: Frenzy, a Titan working itself up as the fight drags on.
GLYPH: one solid ink Titan head in profile facing left, filling the lower two thirds of the diamond's inner area: a lanky humanoid head slightly too large for a person, with a heavy low brow, one bold eye knocked out in paper colour, and a jaw hanging open as a straight-sided wedge. Above the head, one bold wax-seal red upward double chevron, two stacked chevrons pointing up, each stroke at least as thick as the frame stroke. Two shapes only: the ink head and the red double chevron. Clean anime linework, not photographic.
```

Append the canon Titan exclusion line from section 3.3 A.

**Acceptance.** Right: at 20 px, an ink head with a red "rising" mark over it; the double chevron is
the one thing that survives first. Common failures: the open jaw is drawn as a curve and reads as a
smile, which art-style.md flags and which here also risks reading as the Smiling Titan; the head
drifts toward a gorilla or golem shape, which art-style.md forbids for Titan pictograms; the chevron
is drawn as an arrow with a thin shaft and disappears. Never a plus sign or a cross for "more":
art-style.md rules it out because it reads as a medical cross.

#### C. `titan-opening.png` - the Openings mark

One mark, repeated once per Opening by `badges.ts`, in the Titan's own colour (ASSESSMENT section 7).

| | |
|---|---|
| File name | `titan-opening.png`, shipped as `titan-opening.webp` |
| Destination | `foundry/static/assets/icons/titan-opening.webp`, 128 px |
| Aspect ratio | 1:1, 1024x1024, transparent |
| Frame | DIAMOND, matching `titan-frenzy` |
| Attach with `-i` | `$REFS_PLATE` plus `foundry/art-src/refs/tier-control.png` and `foundry/art-src/refs/tier-kill.png`, and, once `titan-frenzy.png` is approved, that file too, so the two Titan marks share a diamond |

`subject-titan-opening.txt`:

```text
SUBJECT, one icon:
FILE titan-opening.png. Frame: DIAMOND, outline, the same stroke as the approved tier icons. Meaning: an Opening, a gap in the Titan's guard that a soldier can strike through.
GLYPH: one thick horizontal ink bar running the full inner width of the diamond, about 22 percent of canvas width tall, with a wide wedge-shaped gap bitten clean through its middle, the gap about 30 percent of canvas width across at the top and narrowing downward. Driven down into that gap is one bold wax-seal red wedge, a broad triangle pointing down, its point reaching just past the underside of the bar. Two shapes only: the notched ink bar and the red wedge. No die-face dots, no round holes.
```

No Titan is drawn, so the canon Titan exclusion line is not needed here.

**Acceptance.** Right: three of these in a row read as three of something, and each one reads as a
break in a line. Common failures: the gap closes up at 20 px and the mark reads as a solid bar, so
keep the gap generous, which art-style.md demands anyway ("no tiny counters or gaps"); the red wedge
turns into an arrowhead pointing at nothing; the mark ends up looking like `harm-critical-injury`,
the diagonal wound slash with a blood drop, which is a different thing and already in the set.

#### D. Momentum pips, filled and outline

**Recommendation: draw these in code, do not generate them.** `badges.ts` already draws its badge
backgrounds with `PIXI.Graphics`, and ADR-0027 locks pips and boxes as the idiom for "how many dice
this value puts in a pool". A pip is a filled circle and an outline circle. Generated at 1024 px and
shown at 6 to 10 px next to a 20 px icon, a stamp-textured circle is strictly worse than
`drawCircle`: it will not align to the pixel grid, it cannot be recoloured per Titan or per soldier,
and the stamp's rough broken edge, which is the whole point of the icon style, is invisible at that
size. The Momentum cap is the Anchors left in the engagement
(`data/engagement/anchor-ratings.yaml`), which changes during the fight, so the track is redrawn
constantly. Code wins on every axis.

If the owner overrules this, the two files are `pip-filled.png` and `pip-outline.png`, 1:1
1024x1024 transparent, no frame, destination `foundry/static/assets/icons/`, subjects "one solid ink
disc filling 70 percent of the canvas, with the stamp's rough broken edge and faint ink speckle" and
"the same disc drawn as a ring, the ring stroke 18 percent of canvas width, the centre empty and
transparent", attached with `$REFS_PLATE` plus two approved icons. But ask before spending the run.
Note that art-style.md's icon system block assumes every icon has a frame, so a frameless pip is
already a deviation, which is another reason to keep them in code.

### 3.4 After the batch 1 generations

1. Check hashes: `cd foundry/art-src/batch-2/originals && md5 -r *.png | sort | uniq -d -w32`.
2. If an icon came back on white, convert white to alpha against `#FFFFFF` and save a 1024 px
   transparent PNG into `foundry/art-src/batch-2/icons/` (art-style.md, "Post-processing").
3. Proof at 20 px on paper `#E4DCC5`, on white, and as a black silhouette, and also proof the
   inverted version, because that is what `badges.ts` actually shows. Put `pos-hooked` next to
   `pos-on-body`, `pos-blind-spot` and `status-engaged` in one strip; put `titan-frenzy` next to
   `titan-opening` and the three `tier-*` icons in another. If two read alike at 20 px, enlarge the
   inner marks, which is art-style.md's own remedy.
4. Make the WebP copies into `foundry/art-src/batch-2/web/` with the command art-style.md gives:
   `cwebp -q 82 -alpha_q 100 -m 6`.
5. Build a contact sheet for the owner at `foundry/art-src/batch-2/contact-sheet.png` and get the
   batch approved before anything is committed (ADR-0022).

## 4. Batch 2: the engagement board

Not urgent. Longest lead time, so it starts now. Section 7 of
`docs/playtest/feedback/round-3/zone-combat-design.md` is the full picture; read 7.3 to 7.7 before you
start. The board is a PIXI application mounted full-bleed over the canvas area during a Titan
Engagement, drawing a field of 7, 13 or 19 hex zones. Each zone carries terrain, which carries that
zone's anchor rating and so its anchor count.

**29 assets:** 15 hex tiles, 5 rim glyphs, 4 Titan figures, 2 soldier figures, 3 effect overlays.

Not on the list, by decision: the grapple line and the gas trail, which section 7.7 says are better
generated in code as particles than drawn. Also not on the list: the Wounded and Broken Body Part
overlays themselves. ADR-0027 locks that the silhouettes stay code-drawn SVG because their states
change live, so the generated Titan figure has to be drawn so code can put an overlay on it; the
overlay is not art you generate.

### 4.0 What art-style.md does not cover here, and what to do about it

**There is no board style block, and you must not write one.** art-style.md defines five style
blocks: colour plate, ink-wash vignette, brand emblem, brand wordmark, and wax seal, plus the icon
system. A shallow-isometric board tile is none of them. Section 7.7 of the design doc says the board
is held "to the locked art language, painted plates and inked figures in the paper palette", and
OWNER-DECISIONS lists ADR-0027 as amended to say the board is a new surface with its own budget.

So: **use the locked colour plate style block, verbatim, for every painted board asset**, and put
every board-specific requirement (the isometric angle, the transparent background, the seamless
tiling, the flat lighting) in the **subject and exclusions**, which are per-asset text and are not
locked. This is the smallest honest reading of the rules. It is also listed in section 8 as a
question, because if the owner wants a board style block added to art-style.md then a style lock for
the board has to be approved first, exactly as ADR-0022 requires for every other family.

Two more gaps, both in section 8: art-style.md's Sizes table has no row for a board asset, and
art-style.md's folder rules have no board folder. The choices below are proposals.

Folders and batch name:

```bash
mkdir -p foundry/art-src/board/originals foundry/art-src/board/web
```

Destination in the shipped system: a new `foundry/static/assets/board/` directory.
`foundry/src/art.ts` has `iconPath()` and `anatomyPath()` but nothing for board art, and
`foundry/tools/import-art.sh` has no board rule, so both need a small addition. Leave that wiring to
the session the owner opens for it, and see section 7.

References for every painted board asset:

```bash
REFS_PLATE="-i site/art-src/style-lock/originals/plate-hero-sortie.png -i site/art-src/style-lock/originals/plate-soldier-recruit.png"
```

Plus, for the Titan figures only, the approved Titan plates:

```bash
for f in plate-titan-small plate-titan-medium plate-titan-large plate-titan-sprinting-abnormal; do
  dwebp site/src/assets/plates/$f.webp -o foundry/art-src/refs/$f.png
done
```

Prompt assembly for every painted board asset (tiles, figures, effects):

```bash
B=foundry/art-src/blocks
cat $B/header-plate.txt $B/refline-plate.txt $B/style-plate.txt $B/world.txt subject-<asset>.txt excl-board.txt > prompt.txt
codex exec --skip-git-repo-check --ephemeral -s workspace-write \
  -C foundry/art-src/board/originals --color never \
  -i site/art-src/style-lock/originals/plate-hero-sortie.png \
  -i site/art-src/style-lock/originals/plate-soldier-recruit.png \
  <extra -i for this asset> \
  - < prompt.txt
```

The world block is included for the hex tiles and the soldier figures, because both show the world's
architecture, uniforms and gear. Omit it for the effect overlays, which show no built thing, and for
the rim glyphs, which are icons and use the icon pipeline.

`excl-board.txt` is the locked colour plate exclusions block, verbatim, plus this transparency
paragraph. The transparency wording is lifted from art-style.md's wax seal exclusions, which is the
one place in the file that specifies a transparent painted asset, so it is carried over rather than
invented:

```text
BACKGROUND: transparent background with true alpha, nothing behind the subject at all: no ground plane, no sky, no paper, no vignette, no drop shadow, no cast shadow, no glow, no reflection, no background colour. If transparency is impossible, put the subject on a plain flat pure white #FFFFFF background with nothing else on it.
```

Do **not** add that paragraph to the hex tile prompts, which need their own edge treatment; the tile
subjects below carry their own background line.

### 4.1 Hex terrain tiles, 15 files

Five anchor ratings, ids taken from `data/engagement/anchor-ratings.yaml`: `open`, `sparse`,
`wooded`, `urban`, `giant-forest`. Three variants each so a field of 13 does not visibly repeat.

| File name | Destination | Aspect ratio | `-i` |
|---|---|---|---|
| `hex-open-1.png` .. `-3.png` | `foundry/static/assets/board/hex-open-1.webp` .. `-3.webp` | 16:9, about 1536x864 | `$REFS_PLATE` |
| `hex-sparse-1.png` .. `-3.png` | `.../hex-sparse-1.webp` .. `-3.webp` | 16:9 | `$REFS_PLATE` |
| `hex-wooded-1.png` .. `-3.png` | `.../hex-wooded-1.webp` .. `-3.webp` | 16:9 | `$REFS_PLATE` |
| `hex-urban-1.png` .. `-3.png` | `.../hex-urban-1.webp` .. `-3.webp` | 16:9 | `$REFS_PLATE` |
| `hex-giant-forest-1.png` .. `-3.png` | `.../hex-giant-forest-1.webp` .. `-3.webp` | 16:9 | `$REFS_PLATE` |

Generate variant 1 of each rating first, get them approved, then attach the approved variant 1 with
`-i` when generating variants 2 and 3 of the same rating, so a rating's three tiles match each other.

Shared subject scaffold, `subject-hex.txt`. Substitute `<TERRAIN>` from the table below:

```text
SUBJECT: one hexagonal terrain tile for a game board, seen in shallow isometric projection from a high three-quarter angle, as if looking down on a diorama from about 30 degrees above the horizon.
GEOMETRY, exact: one flat-top hexagon, that is a hexagon with a flat top edge, a flat bottom edge, and a pointed corner at the left and at the right. It is centred in the canvas, its width is the full canvas width less a small margin, and its height is exactly half its width, which is the standard two-to-one isometric foreshortening. Nothing at all is drawn outside the hexagon. The six edges are clean straight cuts with no border, no outline, no rim and no frame drawn on them.
TILING: the ground surface runs right up to all six edges and is cut off flat by them, with no fade, no vignette and no darkening at the edges, so that many copies of this tile placed edge to edge read as one continuous field. Nothing on the tile crosses an edge or overhangs it.
LIGHT: flat, even, overcast daylight from high and slightly to the upper left, with no long cast shadows, no dramatic rim light and no sun flare, so that tiles of different terrain sit together without a lighting seam. Small contact shadows directly under objects are fine.
TERRAIN: <TERRAIN>
SCALE: one tile is about a Titan's reach across, roughly fifteen metres, so everything on it is sized to that.
Painted with visible brush texture, clean anime linework, not photographic. No figures of any kind: no soldiers, no Titans, no horses, no animals, no people.
BACKGROUND: everything outside the hexagon is transparent with true alpha, nothing there at all: no sky, no ground, no paper, no shadow, no glow. If transparency is impossible, make everything outside the hexagon plain flat pure white #FFFFFF.
```

| Variant | `<TERRAIN>` text |
|---|---|
| `hex-open-1` | Open ground, an empty grass plain. Short dry grass in muted greens and parchment tones over bare earth, a few faint cart ruts, two or three small stones. Nothing tall enough for a grapple to catch. No trees, no walls, no buildings. |
| `hex-open-2` | Open ground, a bare ploughed field. Low parallel furrows of muted brown earth running diagonally across the tile, thin stubble between them, one shallow puddle. No trees, no walls, no buildings. |
| `hex-open-3` | Open ground, a dry stony flat. Pale packed earth in parchment and dust tones, scattered flat stones and gravel patches, sparse tufts of dead grass. No trees, no walls, no buildings. |
| `hex-sparse-1` | Sparse ground, a grass plain with three widely spaced ordinary trees, each tall and solid enough for a grapple to bite, with a clear gap of open grass between them. |
| `hex-sparse-2` | Sparse ground, a ruined farmstead. One roofless stone cottage with two standing gable walls, a broken low stone field wall running past it, dry grass between them, and one bare tree at the far side. |
| `hex-sparse-3` | Sparse ground, a supply halt. One heavy four-wheeled wooden supply wagon standing on dry grass with its canvas cover on, a stack of crates beside it, and one lone tree. No horses. |
| `hex-wooded-1` | Wooded ground, ordinary woodland. A stand of ordinary deciduous trees of a person's height and more, their canopies seen from above as soft masses of deep military green, with dark leaf litter and a winding gap of open ground between them. |
| `hex-wooded-2` | Wooded ground, denser woodland. A thicker stand of ordinary deciduous trees with their canopies nearly closing over the tile, one pale fallen trunk lying across the litter, and a small clearing at one edge. |
| `hex-wooded-3` | Wooded ground, woodland edge. Ordinary deciduous trees filling rather more than half the tile with rough grass and low scrub over the rest, and two or three saplings on the boundary between them. |
| `hex-urban-1` | Urban ground, a street of a walled town. Two rows of two-storey stone and timber houses with steep tiled roofs seen from above, a cobbled street running between them corner to corner, shuttered windows, no signage of any kind. |
| `hex-urban-2` | Urban ground, a small town square. A cobbled open square with a stone well at its centre, flanked by two-storey stone and timber houses with steep tiled roofs, and a narrow alley leading off one side. No signage of any kind. |
| `hex-urban-3` | Urban ground, a breached street. The same street of two-storey stone and timber houses, with one house collapsed into a heap of broken stone and snapped roof timbers spilling across the cobbles, and thick dust settled over everything. No fire. |
| `hex-giant-forest-1` | Giant Forest ground, trees taller than any Titan. Three enormous smooth-barked trunks rising straight out of the tile and running out of the top of the frame, each trunk many metres across, with their bases flaring into heavy roots; deep shadow and leaf litter on the forest floor between them. The canopy is far above and is not shown. |
| `hex-giant-forest-2` | Giant Forest ground, a wider gap between giants. Two enormous smooth-barked trunks rising out of the tile and running out of the top of the frame, set well apart, with a broad floor of deep leaf litter, moss and heavy exposed roots between them. The canopy is far above and is not shown. |
| `hex-giant-forest-3` | Giant Forest ground, a fallen giant. One enormous smooth-barked trunk rising out of the tile and running out of the top of the frame, and beside it the mossy horizontal flank of a colossal fallen trunk lying across the tile with torn roots at one end. The canopy is far above and is not shown. |

**Acceptance, per tile.** Right: dropped into a hex grid next to a copy of itself, the ground runs
across the seam with no visible line, no darkening and no repeated hero object sitting dead centre;
the anchor story is legible at a glance, which is section 7.4's requirement that where the anchors
are is never more than a glance away, so Open reads as nothing to hook, Sparse as a few things,
Wooded as many, Giant Forest as overwhelming. Common failures, in order of how often they will
happen:

1. **Photoreal drift on the foliage tiles.** Wooded, Sparse and Giant Forest are exactly the subject
   art-style.md warns about. If the canopy comes back looking like a photograph or a 3D render,
   check that both style-lock plates were attached, then retry; do not try to fix it by editing the
   style block.
2. **A border.** The model loves to draw a rim or outline on a hex. The rim glyph and the rating
   colour are drawn by code on top, so a baked rim is unusable. Reject any tile with a drawn edge.
3. **Edge vignette or fade.** Kills the tiling. Reject.
4. **Wrong projection.** A tile drawn flat top-down, or in full perspective with a horizon, will not
   sit in the field. Check the height is half the width and that you can see the sides of objects,
   not just their tops.
5. **A figure wandering in.** The exclusions say no figures; check anyway.

### 4.2 Anchor rating rim glyphs, 5 files

Drawn on the tile rim, tinted per rating by code (section 7.4: the rating shown on the rim as a
colour and a glyph). These are icons, so they use the icon pipeline, the icon run header, the icon
system style block, and `refline-icon.txt`.

**Frameless, on purpose.** These sit on a tile rim which is itself a shape, so an icon frame would
fight it. art-style.md's icon system block assumes every icon has a frame, so this is a deviation and
it is listed in section 8; the alternative is the HEXAGON frame, which suits a hex board but is
assigned to Attributes in the frame table. Ask the owner before you spend the runs if you would
rather not carry the deviation.

| File name | Destination | Aspect ratio | `-i` | Glyph |
|---|---|---|---|---|
| `rim-open.png` | `foundry/static/assets/board/rim-open.webp` | 1:1, 1024x1024, transparent | `$REFS_PLATE` plus two approved icons | One bold horizontal ink bar, flat and unbroken, filling 70 percent of the canvas width, with nothing standing on it. Empty ground. |
| `rim-sparse.png` | `.../rim-sparse.webp` | 1:1 | same | The same bold horizontal ink bar with one simple solid tree standing on it, a straight trunk and one round canopy mass, well clear of the bar's ends. |
| `rim-wooded.png` | `.../rim-wooded.webp` | 1:1 | same | The same bar with three of those simple solid trees standing on it, evenly spaced, all the same height, with generous gaps between them. |
| `rim-urban.png` | `.../rim-urban.webp` | 1:1 | same | The same bar with two solid house shapes standing on it, each a plain block with a steep triangular roof, one slightly taller than the other, with a gap between them. No windows, no doors. |
| `rim-giant-forest.png` | `.../rim-giant-forest.webp` | 1:1 | same | The same bar with two very thick solid vertical trunks standing on it, each about 22 percent of canvas width wide, rising straight off the top edge of the canvas with no canopy shown, so they read as far taller than the frame. |

Shared subject preamble for all five:

```text
SUBJECT, one icon:
FILE <name>.png. NO FRAME: this glyph has no ring, no diamond, no capsule and no border of any kind. The glyph alone sits centred on the canvas, filling about 70 percent of the canvas width and about 60 percent of its height, with the rest transparent. ONE INK ONLY, iron-gall brown-black #29241D, with no wax-seal red accent anywhere, because this glyph is recoloured in code. Built from big solid shapes with every line at least as thick as 7 percent of canvas width. Must stay readable at 24 pixels.
GLYPH: <glyph text from the table>
```

**Acceptance.** Right: the five in a row read as a count going up, 0, 1, 3, buildings, giants, and
each one survives being tinted to a single flat colour, because tinting flattens any internal
contrast. Common failures: red creeps in from the icon system block's accent rule, which breaks the
code tint, so check every file for a red pixel; the trees are drawn with thin trunks that vanish at
24 px; the Giant Forest trunks get canopies and stop reading as "taller than the frame"; the Open bar
comes back with a texture or a tuft on it and stops reading as empty.

### 4.3 Titan figures, 4 files

Scaled by Size Class on the board (section 7.4), posed to read at a glance, and drawn so code can put
Wounded and Broken Body Part overlays on the limbs.

| File name | Destination | Aspect ratio | `-i` |
|---|---|---|---|
| `titan-small.png` | `foundry/static/assets/board/titan-small.webp` | 4:5, about 1024x1280, transparent | `$REFS_PLATE` plus `foundry/art-src/refs/plate-titan-small.png` |
| `titan-medium.png` | `.../titan-medium.webp` | 4:5 | `$REFS_PLATE` plus `foundry/art-src/refs/plate-titan-medium.png` |
| `titan-large.png` | `.../titan-large.webp` | 4:5 | `$REFS_PLATE` plus `foundry/art-src/refs/plate-titan-large.png` |
| `titan-sprinting-abnormal.png` | `.../titan-sprinting-abnormal.webp` | 4:5 | `$REFS_PLATE` plus `foundry/art-src/refs/plate-titan-sprinting-abnormal.png` |

Those four `plate-titan-*` files are the approved Titan plates already shipped in
`site/src/assets/plates/` and `foundry/static/assets/plates/`, so each board figure inherits the face
and build of the Titan the game already shows for that Size Class. Decode them to PNG as shown in
section 4.0.

**Read this before you write a Titan prompt.** art-style.md is explicit on two points and they pull
against a full-body board figure:

- "Never write 'naked' or name body parts for a Titan. The image safety filter blocks the output.
  Frame Titans from the waist up, or hide the lower body behind terrain, roots, mist, or a wall."
- "Frame Titans from the hips up with the lower body behind roots, mist, or terrain."

A board figure standing on a tile needs legs. The workaround below stays inside the documented rules
by using the documented hiding device, a low bank of steam, which also gives the figure a base that
sits on the hex. It is additionally supported by the system's own existing full-body Titan body
study, `foundry/static/assets/anatomy/titan-ordinary.webp`, which shows the Titan in plain dark brown
short trunks. **Do not attach that file with `-i`**: it is not in the locked style and it will drag
the render photoreal. It is cited only as the repo's precedent for how a full-body Titan is dressed.
If the safety filter still refuses, stop and ask the owner; see section 8.

Shared subject scaffold, `subject-titan-board.txt`:

```text
SUBJECT: one Titan figure for a game board, a full-length standing figure seen in shallow isometric projection from a high three-quarter angle, about 30 degrees above the horizon, matching the angle of the board's terrain tiles. The figure faces to the left and slightly toward the viewer.
CLOTHING: it wears plain dark brown short trunks and nothing else, exactly as the system's existing Titan body study does. Do not describe or name anything the trunks cover.
BASE: a low bank of pale steam lies across the figure from mid-thigh down, hiding the lower legs and the feet and reading as the ground it stands on. The steam is part of the figure and sits at the very bottom of the canvas.
POSE: <POSE>
FACE AND BUILD: <FACE>
LIMBS, important: the two arms and the two shoulders are clearly separated from the torso and from each other, with open space around each limb and no arm crossing the body, so that a wound mark can be drawn over any one of them without touching another. The head and neck are clear of the shoulders so the Nape can be marked.
Generic Titan: smooth, featureless, doll-like skin with no anatomical detail, no muscle definition, no veins, no skin texture, lanky with awkward, slightly wrong proportions, a hungry expression, faint steam rising from the shoulders. Clean anime linework, not photographic.
LIGHT: flat, even, overcast daylight from high and slightly to the upper left, matching the terrain tiles, with no dramatic rim light and no cast shadow.
```

Then the canon Titan exclusion line, verbatim, which art-style.md requires at the end of every Titan
prompt, then `excl-board.txt`.

| File | `<POSE>` | `<FACE>` |
|---|---|---|
| `titan-small` | It hunches low and forward with its head thrust out ahead of its shoulders and both arms held out and slightly bent, reaching, a scuttling, eager stance. It is squat, with a big head and short stubby limbs. | Follow the attached approved Small Titan plate for the face and build. |
| `titan-medium` | It hunches forward with its head thrust low and tilted, one very long, too-thin arm reaching out ahead of it with bony splayed fingers, the other arm hanging awkwardly behind. Never arms at its sides. | Follow the attached approved Medium Titan plate for the face and build: a gaunt, hollow-cheeked, long face with asymmetric features, the left eye noticeably larger and set lower than the right, both eyes wide and unblinking, a crooked flattened nose, a slack lopsided open jaw hanging down on one side, unkempt greasy mouse-brown hair in thin matted clumps. |
| `titan-large` | It stoops under its own height, shoulders rolled forward, head hung low and turned to the side, both long arms hanging forward and slightly apart with heavy splayed hands. Never arms at its sides. | Follow the attached approved Large Titan plate for the face and build. |
| `titan-sprinting-abnormal` | It runs, low and twisted, one long arm swung far forward and the other far back, torso wrenched around, head low and thrust ahead of the leading shoulder, caught mid-stride at full sprint. | Follow the attached approved Sprinting Abnormal plate for the face and build. |

**Acceptance.** Right: at the size the board will draw it, roughly 200 to 400 px tall, you read the
Size Class from the silhouette alone, the pose is unmistakably predatory, and there is clear
background between each arm and the torso. Common failures:

1. **Photoreal skin.** The loudest one. Titans are bare skin and art-style.md says they drift photoreal
   without the references. Check both style-lock plates went on every run, and keep "clean anime
   linework, not photographic" in the prompt.
2. **The safety filter refuses.** If it does, do not start renaming things to get around it. Stop and
   ask; section 8.
3. **Arms at sides.** art-style.md forbids it by name and the canon Titan exclusion line ends with it.
4. **A canon Titan face.** art-style.md lists the three specific rejected faces; read that list before
   you approve anything.
5. **Arms fused to the torso**, which makes the Broken Arm overlay impossible to place. This is the
   failure unique to the board, and it is the one nobody catches until the overlay code is written.
   Proof each figure by drawing a rough red blob over one arm and asking whether it stays on that arm.
6. **A baked cast shadow or a ground disc.** The board draws its own.

### 4.4 Soldier figures, 2 files

| File name | Destination | Aspect ratio | `-i` |
|---|---|---|---|
| `soldier-standing.png` | `foundry/static/assets/board/soldier-standing.webp` | 4:5, about 1024x1280, transparent | `$REFS_PLATE` |
| `soldier-hanging.png` | `.../soldier-hanging.webp` | 4:5 | `$REFS_PLATE`, and once `soldier-standing.png` is approved, that file too |

Both use the colour plate style block **and the world block**, which is where the uniform and the ODM
gear are specified. art-style.md also requires the full ODM blade description every time a blade
appears: "long straight segmented strip, oblique squared tip, trigger handle, no crossguard or
pommel". Both of these figures carry blades, so write it out.

`subject-soldier-standing.txt`:

```text
SUBJECT: one Survey Corps soldier figure for a game board, a full-length standing figure seen in shallow isometric projection from a high three-quarter angle, about 30 degrees above the horizon, matching the angle of the board's terrain tiles. The soldier faces to the left and slightly toward the viewer, standing alert on the balls of the feet, knees slightly bent, weight forward, head up and looking left, one blade held low in each hand and angled away from the body.
The soldier is an original character with a specific look: light brown skin, short cropped ginger hair, and a short straight scar across the left cheekbone. No soldier with a black bob, messy black hair, long dark hair, a ponytail, or a man bun.
Each blade is the anime's long, perfectly straight, uniform-width steel strip with an oblique squared tip, divided into snap-off segments by diagonal score gaps, on a chunky pistol-like trigger handle with a trigger guard, with no crossguard and no pommel. Not a sword, not a katana, not a dagger.
The hooded dark green cloak hangs down the back and is still, not streaming.
LIGHT: flat, even, overcast daylight from high and slightly to the upper left, matching the terrain tiles, with no dramatic rim light and no cast shadow.
The figure must read at a glance at about 120 pixels tall: one clear silhouette, arms clear of the torso, the two blades clearly separate from the legs. Clean anime linework, not photographic.
```

`subject-soldier-hanging.txt`:

```text
SUBJECT: one Survey Corps soldier figure for a game board, a full-length figure hanging in the air on a tether, seen in shallow isometric projection from a high three-quarter angle, about 30 degrees above the horizon, matching the angle of the board's terrain tiles. The soldier hangs suspended with the body angled forward and to the left, both arms up and ahead as if holding a taut line that runs up and out of the top of the frame, legs trailing back and slightly apart, knees bent, boots clear of anything. The hooded dark green cloak streams back and up behind the body. One blade is held in each hand.
The soldier is an original character with a specific look: light brown skin, short cropped ginger hair, and a short straight scar across the left cheekbone, the same soldier as the standing figure.
Each blade is the anime's long, perfectly straight, uniform-width steel strip with an oblique squared tip, divided into snap-off segments by diagonal score gaps, on a chunky pistol-like trigger handle with a trigger guard, with no crossguard and no pommel.
IMPORTANT: no wire, no cable, no rope, no grapple, no hook and no anchor is drawn anywhere in this image. The line the soldier hangs from is drawn by the game in code, so the hands must be posed as if gripping it while the frame stays completely empty around them.
LIGHT: flat, even, overcast daylight from high and slightly to the upper left, matching the terrain tiles, with no dramatic rim light and no cast shadow.
The figure must read at a glance at about 120 pixels tall: one clear silhouette. Clean anime linework, not photographic.
```

Both take the world block, the colour plate exclusions, and `excl-board.txt`.

**Acceptance.** Right: the two figures are obviously the same soldier, the standing one reads as
planted and the hanging one as airborne even at 120 px, and the hanging figure has clean empty space
running up and out of frame where code will draw the grapple line. Common failures: a drawn wire in
the hanging pose, which will double up with the particle line and is the single most likely reject;
the blades come back as swords or katanas, which art-style.md warns happens whenever the full blade
description is left out; the face falls back to a canon likeness, which is why the hair and scar sit
early in the subject, as art-style.md requires; the cloak is drawn streaming in the standing pose and
the two figures stop reading as still and moving.

### 4.5 Effect overlays, 3 files

Drawn over a tile as animated zone effects (section 7.4: steam, fire, dust). They are tinted and
animated in code, so each one is a single element on transparent alpha, not a scene.

| File name | Destination | Aspect ratio | `-i` |
|---|---|---|---|
| `fx-steam.png` | `foundry/static/assets/board/fx-steam.webp` | 1:1, 1024x1024, transparent | `$REFS_PLATE` |
| `fx-fire.png` | `.../fx-fire.webp` | 1:1 | `$REFS_PLATE` |
| `fx-dust.png` | `.../fx-dust.webp` | 1:1 | `$REFS_PLATE` |

Colour plate style block, **no world block**, then the subject, then the colour plate exclusions and
`excl-board.txt`.

```text
SUBJECT: one <EFFECT>, painted as a single isolated element on nothing, for a game to composite over its board. It is centred, fills about 85 percent of the canvas, and is the only thing in the image. Its edges dissolve softly into full transparency all the way round, with no hard cut, no container shape and no ground beneath it. Painted with visible brush texture in the muted warm palette, clean anime rendering, not photographic, not a 3D render, not a photographic smoke plate.
```

| File | `<EFFECT>` |
|---|---|
| `fx-steam` | billowing cloud of hot white Titan steam, soft-edged and rolling, rising and spreading outward, in parchment white and pale warm grey with cool grey shadow in its folds and no colour cast |
| `fx-fire` | body of open flame, broad at the base and breaking into three or four large tongues that curl upward and apart, in muted warm orange and wax-seal red deepening to iron-gall brown-black at the tips, with a darker smoke haze thinning off the top |
| `fx-dust` | low rolling cloud of kicked-up dust and grit, wider than it is tall, heavier and more opaque along its lower edge and tattering into nothing along its upper edge, in parchment and muted earth tones with a few small dark flecks of debris in it |

**Acceptance.** Right: composited at 40 percent opacity over a `hex-wooded` tile it reads as the
effect and not as a pasted sticker, and there is no hard edge anywhere on it. Common failures: a
photographic smoke plate, which is the usual result if the style-lock plates are not attached; a
visible rectangular or circular boundary where the alpha was cut; the fire coming back neon orange
and breaking the muted palette; a ground line or a burning object painted under the flame.

## 5. Where the finished files go

Same shape as the existing batches, so nothing here is new machinery.

| Stage | Batch 1 icons | Batch 2 board |
|---|---|---|
| Raw generations, as Codex saved them | `foundry/art-src/batch-2/originals/` | `foundry/art-src/board/originals/` |
| Keyed transparent PNGs | `foundry/art-src/batch-2/icons/` | not needed if alpha came back clean; otherwise alongside `originals/` |
| WebP copies, the files that get approved | `foundry/art-src/batch-2/web/` | `foundry/art-src/board/web/` |
| Contact sheet for the owner | `foundry/art-src/batch-2/contact-sheet.png` | `foundry/art-src/board/contact-sheet.png` |
| Shipped | `foundry/static/assets/icons/*.webp` | `foundry/static/assets/board/*.webp` |

`foundry/art-src/` is gitignored, so none of the first four rows is committed. Only the shipped WebP
files are.

WebP with the command art-style.md gives: `cwebp -q 82 -alpha_q 100 -m 6`, adding `-resize` when the
long edge is over 1600 px.

## 6. What has to be updated after

Three things, in this order.

1. **`foundry/design/asset-inventory.md`.** It is named in ADR-0027 as the source of truth for Codex
   generation, and it has no row for any of these. Add the three batch 1 icons to the
   "Token status icons" area or a new row, and add a row for the board set with its 29 files and its
   folder. Also record whichever of section 8's open questions the owner settles, because the
   inventory is where the next batch will look.
2. **`foundry/tools/import-art.sh`.** It copies approved art from `foundry/art-src` into
   `foundry/static/assets` and the build never reads `art-src`, so nothing ships until this runs.
   As written it only knows `$B1="$ART/batch-1/web"` and loops over `action-*` and `status-*`. It has
   **no rule for `pos-*`, no rule for `titan-*` icons, no `batch-2` path and no board section**, so
   it must be extended:
   - a line for the batch 1 icons at 128 px, matching the existing `pos-*` files, which are 128 px in
     the shipped set;
   - a board section that makes `$OUT/board` and copies `foundry/art-src/board/web/*.webp` into it.
   Then run it: `sh foundry/tools/import-art.sh`. It needs `cwebp` on the path.
3. **`foundry/src/art.ts`.** `iconPath()` already resolves the batch 1 icons by name, so those need
   no change there beyond whatever `badges.ts` does with them. The board assets need a new accessor
   next to `anatomyPath()`, because nothing in `art.ts` points at a `board/` directory today.

**Leave 2 and 3 to the session the owner opens for the wiring**, unless the owner asks you to do
them. Several agents work in this tree in parallel and `import-art.sh` and `art.ts` are both live
files. Your job is the images. Report the file list and let the wiring happen where the rest of
batch D and batch E is being built.

Also note, so you are not surprised: `foundry/src/tracker/board.ts` already exists and is the
tracker's Ops Ledger window, which is a different thing from the engagement board described here. The
name collision is a problem for the wiring session, not for the art.

## 7. Acceptance, batch level

Before you take anything to the owner:

- [ ] `md5 -r *.png | sort | uniq -d -w32` is empty in every `originals/` folder.
- [ ] Every run had both style-lock plates on `-i`. If you cannot say this for a file, regenerate it.
- [ ] Batch 1: each icon proofed at 20 px on paper `#E4DCC5`, on white, as a black silhouette, and
      inverted, and in a strip beside the icons it will sit next to.
- [ ] Batch 2 tiles: each rating's three variants tiled edge to edge in a test image with no seam.
- [ ] Batch 2 Titans: a rough overlay blob dropped on each arm, each leg and the nape stays where it
      is put.
- [ ] Batch 2 figures and effects: alpha is genuinely transparent, not white, and the alpha bounding
      box is centred, which is the rule art-style.md sets for the wax seal and is the same problem
      here since code positions the box and not the visible pixels.
- [ ] No text, letters or numerals anywhere in any asset.
- [ ] Contact sheet built and sent to the owner. ADR-0022: the owner approves each batch's contact
      sheet before it is committed.

## 8. Open questions

Things `site/design/art-style.md` does not cover.

### 8.0 Settled before hand-over, do not re-ask

Four of the questions below are answered by rules the repository already holds, so they are settled
here rather than sent to the owner. They are kept in the numbered list for context; treat these four
as decided.

- **10 (Frenzy as one icon plus a code-drawn track) and 11 (Momentum pips drawn in code): confirmed,
  as recommended.** ADR-0027 already settles the principle. It keeps the soldier and Titan silhouettes
  as code-drawn SVG "because their states change live", and a 0 to 3 Frenzy track and a filled-to-cap
  pip row are exactly that. Generate the one Frenzy mark and draw both tracks in code.
- **12 (damage-state overlays are code, not art): confirmed.** Same ADR-0027 sentence, same reason.
  The Titan figures only have to be drawn so an overlay can land cleanly.
- **5 (the copy guard missing from the icon run header): confirmed, add it.** This is an internal
  inconsistency in art-style.md rather than a question of taste: the file states the parallel-run
  hazard and requires the guard in the run header, and the icon header simply omits the sentence the
  plate header carries. Add it to your icon prompts, note that you did, and report it so art-style.md
  can be amended to match.

Everything else below is genuinely the owner's call. **None of them should block you**: each one names
the default this handout already assumes, so generate on that default and flag it in your report back.
The expensive one to get wrong is 2, since 15 tiles depend on it, so raise that one before you start
the batch rather than after.

### 8.1 For the owner

Do not decide these on your own.

1. **There is no board style block.** art-style.md has colour plate, ink-wash vignette, brand emblem,
   brand wordmark, wax seal and the icon system, and none of them is a shallow-isometric board tile.
   This handout says to use the colour plate block verbatim and carry the board-specific requirements
   in the subject. Should a board style block be added to art-style.md instead, and if so, does the
   board get its own approved style lock first, as ADR-0022 requires for every other family?
2. **Hex orientation is not fixed anywhere.** Section 7 of the zone design says hexagonal zones and
   shallow isometric, but not flat-top or pointy-top. This handout assumes flat-top with two-to-one
   foreshortening, so the tile is twice as wide as it is tall. Confirm before 15 tiles are generated.
3. **art-style.md's Sizes table has no board row**, so the aspect ratios and the shipped sizes here
   (16:9 for tiles, 4:5 for figures, 1:1 for effects and glyphs) are proposals.
4. **art-style.md's folder rules have no board folder and no Foundry batch naming.** This handout
   proposes `foundry/art-src/batch-2/` for the icons, `foundry/art-src/board/` for the board, and
   `foundry/static/assets/board/` as the shipped destination.
5. **The icon run header in art-style.md does not contain the copy guard.** The plate run header does:
   it names the exact-path rule and says never the newest file in `~/.codex/generated_images`. The
   icon run header only says to copy each generated PNG with the exact filename. Since art-style.md
   also says to keep the copy guard in the run header when running in parallel, the guard sentence
   should be added to the icon header, and art-style.md amended to match. Until the owner says so,
   add the guard sentence to your icon prompts and note that you did.
6. **`icons/` is ambiguous in the icon run header.** The header says to copy into `icons/` inside the
   working directory, but art-style.md's folder rules say `<batch>/icons/` holds keyed transparent
   PNGs and `<batch>/originals/` holds raw generations. With `-C .../batch-2/originals` the raw icons
   land in `originals/icons/`, which is what this handout assumes. Confirm.
7. **Frame family for the three new marks.** art-style.md's frame table assigns a frame per family and
   has no family for a Titan state mark or a hooked-in flag. This handout proposes WIDE-CAPSULE for
   `pos-hooked`, because it sits in the Position badge row, and DIAMOND for `titan-frenzy` and
   `titan-opening`, because that frame is already the Titan side of the set. Confirm, and confirm the
   file name prefixes, since art-style.md's family list (`die`, `roll`, `tier`, `gear`, `talent`,
   `attr`, `harm`, `size`, `position`, `tactic`, `specialty`) predates the shipped Foundry prefixes
   (`pos-`, `status-`, `titan-`, `action-`).
8. **Frameless rim glyphs.** art-style.md's icon system block assumes every icon has a frame. The rim
   glyphs sit on a tile rim and are tinted in code, so this handout proposes no frame and no red
   accent. The alternative is the HEXAGON frame, which is assigned to Attributes.
9. **Full-body Titans versus the safety filter.** art-style.md says to frame Titans from the waist up
   or hide the lower body, because naming body parts gets the output blocked. The board needs standing
   figures. This handout keeps them in plain dark brown short trunks, as the system's own
   `anatomy/titan-ordinary.webp` does, with a bank of steam across the thighs. If the filter still
   refuses, the owner has to decide between a waist-up figure with a steam skirt and something else.
10. **Frenzy: one icon plus a code-drawn track, or four states.** Recommended as one icon plus a
    track, for the reasons in section 3.3 B. Owner's call.
11. **Momentum pips in code rather than generated.** Recommended in section 3.3 D. Owner's call.
12. **Damage-state overlays.** ADR-0027 locks the silhouettes as code-drawn SVG because their states
    change live, so this handout treats the Wounded and Broken Body Part marks as code, not art, and
    only requires the Titan figures to be drawn so an overlay can land. Confirm that reading.

## 9. How to report back

Paste this into a new session in the repository, so the work can be wired up:

1. **Which batch you ran** and whether the owner approved the contact sheet.
2. **The exact file list**, one line per file, as shipped paths, for example
   `foundry/static/assets/icons/pos-hooked.webp`. This is what the wiring needs most.
3. **Whether you ran `foundry/tools/import-art.sh`**, and if you extended it, which lines you added.
   If you did not extend it, say so plainly, because then nothing has shipped yet.
4. **Which of section 8's questions the owner answered, and what they answered**, verbatim. These
   have to go into `site/design/art-style.md` and `foundry/design/asset-inventory.md` and they are
   lost otherwise.
5. **Anything regenerated and why**, especially any photoreal drift, any safety-filter refusal, and
   any duplicate hash you hit. That is the record art-style.md is built out of.
6. **Anything you did not generate**, and why. A short honest list beats a silent gap.
7. For the Frenzy and Momentum decisions, **say which way the owner went**, because `badges.ts` is
   written differently for each.

Do not commit anything. Say what you produced and let the wiring session open the pull request.
