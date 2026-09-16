# Review: Skirmishes (rules accuracy)

Checked against `docs/rules/07-playtest-rules.md` 7.4, `data/skirmish/skirmish.yaml`,
`data/engagement/squad-tactics.yaml`, `data/mind/scars.yaml`. No Critical findings.

1. **Major** — `skirmishes.mdx` 238-248 ("An exchange in the doorway"). The named
   Military Police trooper rolls 4 Attack Dice and 3 Guard dice; the Foe row (07 591)
   gives it 7 and 4. Either a wrong stat block or a leak. Fix: make the attacker an
   unnamed Foe and drop the kind name.

2. **Major** — `skirmish-tables.ts` 219-235. The actions table is captioned "A soldier's
   action" with the note "One action a turn, and one of these", but its rows include
   Release, Mount or Dismount, Swap Blade Set, and Shed Load, which 07 520 keeps out of
   the action list; Release spends nothing (sk 341). Fix: group those four separately and
   reword the note.

3. **Major** — `engagement-tables.ts` 741 (Fall Back). The effect drops "does not change
   airborne" (squad-tactics.yaml 84), and the `squad-tactics` table uses the same wording.
   Fix: restore the clause.

4. **Minor** — `skirmish-tables.ts` 179 (Fig. 2). "It Fights, Shoots, reloads, closes in
   and Fights, or does nothing" is the GM-only foe rule's menu (07 606) and is not in the
   claims list. Fix: keep only "never attacks a Down soldier".

5. **Minor** — `skirmishes.mdx` 215. "Cut and Pierce reach you here as they reach you
   nowhere else"; 07 550 also names damage a called roll's stakes gave. Fix: add that case.

6. **Minor** — `skirmish-tables.ts` 186. The Squad-leaves exit omits "is not Held"
   (sk 417). Fix: add it.

7. **Minor** — `scars.astro` 103. Both rerolling rows read "because it never Pushes and
   never Covers"; Reckless Blade is the Push row, Carrying Their Weight the Cover row
   (scars.yaml 120, 145). Fix: give each row its own reason.

8. **Minor** — `engagement-tables.ts` 721 (Hook and Cut). Drops "neither Down nor Grabbed"
   and "Focus" Titan (squad-tactics.yaml 40-42). Fix: restore both.
