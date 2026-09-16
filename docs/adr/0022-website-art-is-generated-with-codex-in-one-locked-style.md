# Website art is generated with Codex in one locked style

All game art on the website is generated with the Codex CLI. Game icons (attributes, the four die kinds, Stress, Harm and Body Parts, Talent types, gear types, Titan Size Classes, Positions, Squad Tactics, Specialties) use the Codex `board-game-icon-assets` skill, shown at 32 to 128 px and proofed at that size. Illustrations (hero, chapter vignettes, soldier portraits, Titans, gear plates) are semi-realistic, high-quality anime art made from one locked style prompt, and show original soldiers only: canon places, uniforms, ODM Gear, the Wings of Freedom emblem, and generic Titans are fine, canon characters are not. Interface controls (search, menu, arrows, close) use Phosphor as inline SVG, since generated raster icons blur at small sizes. How icons and illustrations look inside the site is ADR-0023. Fonts are chosen with the google-fonts skill for the picked design direction and self-hosted.

The owner approves a style lock (four test illustrations and a twelve-icon sheet) before batch generation, then each batch's contact sheet before it is committed. Committed art is compressed WebP or AVIF in plain git; source images stay in a gitignored `site/art-src/`. Git LFS is revisited if committed art passes about 200 MB.

## Considered Options

- game-icons.net for game icons: rejected by the owner in favour of a generated set in the site's own style.
- Lucide, then Font Awesome Free, for interface icons: replaced by Phosphor once the Field Manual direction was picked (ADR-0023).
- Canon characters in illustrations: rejected, because the players' own squad should be the face of the game, and it keeps an unlisted public site away from character likeness.
- Git LFS from the start: rejected; it complicates Vercel builds and future Foundry release zips for a size the project has not reached.
