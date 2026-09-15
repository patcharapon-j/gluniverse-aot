# Tables are authored as YAML data

Every table (Behavior Tables, Intent Tables, Critical Injuries, Lifepath, Talents, hazards, Discoveries) lives as YAML in `data/`, and the Markdown rulebook in `docs/rules/` renders its tables from that data. The later Foundry VTT v14 system imports the same files. This is ADR-0003 in practice: one source of truth, so the rulebook and the Foundry system cannot drift apart. We rejected writing tables in Markdown first (a conversion job later) and writing Foundry compendium JSON directly (unreadable while designing).
