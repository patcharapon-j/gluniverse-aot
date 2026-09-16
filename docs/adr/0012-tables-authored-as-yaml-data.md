# Tables are authored as YAML data

Every table (Behavior Tables, Intent Tables, Critical Injuries, Lifepath, Talents, hazards, Discoveries) lives as YAML in `data/`, and the Markdown rulebook in `docs/rules/` renders its tables from that data. The later Foundry VTT v14 system imports the same files. This is ADR-0003 in practice: one source of truth, so the rulebook and the Foundry system cannot drift apart. We rejected writing tables in Markdown first (a conversion job later) and writing Foundry compendium JSON directly (unreadable while designing).

## Amended

After decision batch 9 (2026-09-16, GM judgment; ADR-0024, 9-11): the YAML holds the rules and the default tables, and a ruling needs no row. Every `gm:`, `gm_choices:`, and `gm_rulings:` field names the ruling it allows in that file's scope, or reads `none` and cites ADR-0024. The Circumstances ladder is data (`data/core/circumstances.yaml`), as is the menu of a failed roll's costs, the `gm-horror` Fear trigger, the `passive-roll` exception, the `ruling` Stress gain, and each Foe kind's `parley` value, so that the Foundry system reads the same answer the paper game gives. This is still ADR-0024 in practice, as it was ADR-0003's.
