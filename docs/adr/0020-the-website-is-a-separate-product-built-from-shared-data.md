# The website is a separate product built from the shared data

The player-facing compendium website lives in `site/` as an Astro and MDX project with its own package and build, apart from the rulebook drafts in `docs/rules/` and the future Foundry VTT system in `foundry/`. The site and the Foundry system both read the tables in `data/`, which stay the single source for every number (ADR-0012); neither copies a table. The site's prose is a separate rewrite in finished product language, second person and concise, with game terms as `CONTEXT.md` names them and no design vocabulary (no ADR, OQ, YAML, probe, playtest framing). Each site page records the source chapters and data files it was written from, and the site build prints a "needs resync" warning when a source changed after the page was last synced, so rules changes during playtest surface as a list instead of going stale silently. Chapter 7's Expeditions, Downtime, Requisition, and Skirmishes appear as normal chapters with an "Early rules" badge; rules not yet written do not appear at all.

The site is organized for readers, not for drafting order: Home, Learn to Play, Player's Guide, Compendium (filterable cards for Talents, Actions, Specialties, Origins, Gear, Squad Tactics, Scars, and Titans as a squad sees them), GM's Guide (a separate section with its own tone and a one-time notice; Titan hidden values and running advice live only here), and Reference (glossary, an on-screen quick reference, and a 3D dice tray that can Push and loads from "Try this roll" buttons). There is no character builder and no printable sheet; the builder belongs to the Foundry system. English only. three.js effects are limited to the landing hero and the dice tray and respect reduced motion.

## Considered Options

- Render `docs/rules/` directly: rejected, because the chapters are written as a design specification dense with ADR and OQ references and field names.
- Rewrite `docs/rules/` itself into product language: rejected, because the drafts carry the rationale the design process depends on.
- Start the rewrite from the playtest packet: rejected by the owner; the packet is a different product, and the site speaks as the finished game.
- A browser character builder: rejected by the owner; players browse options on the site and build characters in Foundry.
- A Vite React single page app: rejected; most pages are reading pages, and Astro ships interactive islands only where used.
