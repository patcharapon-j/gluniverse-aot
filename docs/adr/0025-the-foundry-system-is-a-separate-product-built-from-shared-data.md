# The Foundry system is a separate product built from the shared data

The Foundry VTT system lives in `foundry/` as its own package, with id `wings-of-freedom` and title "Wings of Freedom", minimum and verified Foundry version 14. Work happens in the worktree `../gluniverse-aot-foundry` on branch `foundry`, which merges `main` deliberately, never automatically. The build compiles the YAML in `data/` into compendium packs and validates every file it reads against a schema, failing loudly when a shape changes (ADR-0012). Compendium descriptions reuse the website's player wording files where they exist and fall back to `data/` text (ADR-0020). English only, with every string in `lang/en.json`. During development the build output is symlinked into the local Foundry data folder; release zips come later.

- **Stack:** Vite and TypeScript; ApplicationV2 and TypeDataModel; Svelte 5 (runes) rendered inside ApplicationV2 with small action wrappers for Foundry drag and drop, context menus, and tooltips; anime.js v4 as the only DOM motion engine, driven by one shared motion-token file; no WebGL on the sheets: the gas and blade instruments are SVG (ADR-0027, amended 2026-09-23), and the engagement board draws with Foundry's PIXI (ADR-0029).
- **Actors:** Soldier and Titan get full sheets; Squadmate and Foe get compact sheets. Horses stay gear; Squads and Expeditions are not in the first version.
- **Items:** `talent`, `specialty`, `origin`, `gear` (subtypes odm, blade-set, firearm, horse, kit, prosthetic), `critical-injury`. The Action Catalog is system config, not items.
- **Soldier sheet:** a slim header with the portrait, one persistent vitals band (Health with Down, Stress, Resolve, Gas with the ODM Gear Dice, Blade Sets), and four index tabs on the file's edge: Soldier, Kit, Wounds & Mind, Record.
- **Character creation:** drag and drop from compendia plus a resumable Lifepath wizard that follows `lifepath.yaml`, where the player rolls (posted to chat) or chooses wherever the rules allow. No GM approval step.
- **Milestones:** (1) direction lock, (2) core, (3) Lifepath wizard, (4) Titan Engagement tracker with round-end automation. Squad and Expedition sheets are out of scope for the first version (owner, 2026-09-16) and come later.
- **Models:** Claude Opus implements design, rules logic, and reviews; Claude Sonnet handles mechanical steps (art wiring, small fixes, preview tweaks); Codex generates images only. Live checks in Foundry run once per milestone, at its end (owner, 2026-09-17). One tight Opus review per milestone against a fixed checklist (rules fidelity against `data/`, v14 API correctness, WebGL budget, no leaks on close, reduced-motion path), about 300 words, blocking and major findings only.

## Considered Options

- A separate repository with a copy of `data/`: rejected; two copies of every table drift.
- Plain ESM with three.js vendored, or TypeScript without a UI framework: rejected by the owner in favour of the highest-fidelity option.
- Vue 3: rejected; larger runtime and weaker motion tooling than Svelte 5 with anime.js.
- Building on the owner's Titan World Foundry system's code: rejected; it is a different product with different rules. Its visual design (tokens, layout, components) is the base and may be adapted (ADR-0027).
