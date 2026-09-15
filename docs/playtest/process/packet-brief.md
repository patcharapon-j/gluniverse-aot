Build the Wings of Freedom Phase 1 playtest packet: one self-contained HTML file at `docs/playtest/wings-of-freedom-playtest-packet.html`.

Purpose: the owner reads it first and gives feedback, then it goes to the first playtest table. Write it like a real TRPG playtest packet: concise, readable, rules a player can learn from and a GM can run from. It is not a copy of the chapters. Cut design notes, probe figures, decision history, OQ references, and "why" paragraphs. Keep every rule a table needs, every procedure step, and every table. Where a chapter says PROVISIONAL, mark the rule with a small "Playtest rule" tag (and a one-line Playtest note only if players need to know what to watch) instead of explaining it.

Sources (rules as written today): `docs/rules/01-core-rules.md` to `06-standard-titans.md`, their YAML in `data/`, `CONTEXT.md` for term names, and `docs/rules/DECISIONS-2026-09-14.md` only to settle a conflict. Where prose and YAML disagree, the YAML wins; list every such case in your reply. Do not invent rules; if the packet needs a rule the chapters lack, add a visible "[missing rule: ...]" marker and list it in your reply.

Structure (one file, player material first, GM material at the back):
1. Cover: title, "Phase 1 playtest packet", date, a one-paragraph pitch (Survey Corps soldiers, 845 to 850), what Phase 1 covers and what it does not (no Shifters, no Expeditions).
2. Contents with in-page links.
3. Player section: Core Rules (dice pool, successes, Push, Stress, Help, Bonus Dice); Making a Soldier (Lifepath, Attributes, Specialties, Talents, Squadmates, sheet fields) with a step list; Actions (the Action Catalog as a compact table); Harm and Mind (Health boxes, Critical Injuries, Down, Death Rolls, Stress Responses, Fear Rolls, Scars, Grief); Gear (ODM Gear, gas and Gas Rolls, Jams, Blade Sets, horses, carrying, Standard Issue, Field Repair); Fighting Titans from the player's side (Positions, Attention and how to Break Attention including Feints, the round and cards, Nape strikes and Openings, Read, being Grabbed and Break Free, Wings, Squad Tactics).
4. Quick reference: one printable page of the most-used numbers and steps.
5. GM section (clearly headed "GM only"): running a Titan Engagement (setup, clocks, card procedure, Attention Ladder evaluation and flags, Behavior Table procedure, Toughness and Body Part States, Regeneration, grounding, Background Titans, retreats); the Standard Small, Medium, and Large Titans and the Sprinting Abnormal as stat blocks with their Behavior Tables and ladders; Titan-side Critical Injury and harm tables the players do not roll themselves; hidden values.
6. Glossary: short definitions of the game terms used, from `CONTEXT.md`.
7. Playtest feedback page: a short list of things to watch for and note (round length, lone-soldier odds, Grab lethality, gas, anything confusing).

HTML: a single file, no external resources, no JavaScript needed. Minimal inline CSS: readable serif or system font, max-width about 46em, clear heading hierarchy, simple bordered tables, a print stylesheet (page breaks before the GM section and each Titan, no link colors), a subtle box style for procedures and examples. Semantic HTML (section, h1 to h3, table, ol). Tables for every d6 table and stat block. Keep it readable at phone width.

Voice (owner requirement: the language must read like a published TRPG product, not a design document). Model it on the conventions of Year Zero Engine rulebooks and other professional TTRPG books:
- Address players as "you" and the GM as "the GM" (or "you" inside the GM section). Rules are stated as rules: "Roll", "Count", "When you...", never "the system models" or "per ADR".
- Lead each rule with what happens at the table, then the exception. One rule per paragraph; procedures as numbered steps; triggers bolded ("**When you Push**...").
- Game terms capitalised consistently as in `CONTEXT.md`, defined on first use, never replaced by synonyms. Dice written the house way (for example "roll your dice pool", "count successes").
- No developer or spreadsheet language: no "YAML", "probe", "Monte Carlo", "OQ", "PROVISIONAL", "flag lifetime", "evaluation step", variable names, or percentages of simulation results. Translate data-model terms into table language (for example a flag becomes "the Titan remembers who just hurt it until its next action").
- Setting flavour in small doses: a short in-world line to open each chapter (a Survey Corps order, a training instructor's saying), original text only, no quotes from the manga or anime.
- Sidebars for examples, designer-free "Playtest note" boxes only where a rule is provisional, and clear "GM only" headings.
- Short sentences, active voice, no em dashes, no filler. One short worked example per complex procedure (a Nape strike, a Break Attention, a Grab).

Do not edit chapters, YAML, ADRs, `CONTEXT.md`, DECISIONS, OPEN-QUESTIONS, PROGRESS, or reviews.

Reply under 150 words: file path, section list with rough length, rules marked provisional, prose/YAML conflicts found, missing-rule markers.
