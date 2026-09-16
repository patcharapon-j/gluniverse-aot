# Review: Running Expeditions, and Foes and Skirmishes (rules accuracy)

Checked against `docs/rules/07-playtest-rules.md` (C7), `data/expedition/*.yaml`,
`data/skirmish/*.yaml`. Every Foe value, hazard row, Night row, Waypoint row, Parley
need, Grit, and both worked examples match their source. No Critical findings.

1. **Major** — `running-expeditions.mdx` 110-117 ("Your side of a Leg"). The bullets walk
   the Leg's steps but drop step 5: harm a row inflicts outside a Titan Engagement opens
   the outside-harm care window, with every soldier on the Expedition in its scope (C7 150;
   `legs.yaml` leg_steps `harm`). The same rule is given for Waypoint scenes, so its
   absence here reads as a difference. Fix: add a bullet for it before the fight bullet.

2. **Minor** — `gm-foe-tables.ts` 205-209, rendered in `foes-and-skirmishes.mdx` Fig. 1.
   Step 3's title is "Does it hold a loaded firearm?"; the step's test is a loaded firearm
   *and at least one candidate* (C7 618). Fix: name both in the title.

3. **Minor** — `foes-and-skirmishes.mdx` 63. The Sneak roll for the Ambush omits that the
   GM names its Circumstances (C7 493), on the page that lists the GM's calls. Fix: add
   "with the Circumstances you name".

4. **Minor** — `foes-and-skirmishes.mdx` 169-172. The Parley bullets state "no Help, no
   Cover" only for the outside-a-Skirmish case; in a Skirmish a Parley takes Help from up
   to 3 comrades who spend their action, and Cover (C7 647). Fix: state the in-Skirmish
   Help before the outside bullet.

5. **Minor** — `running-expeditions.mdx` 190. "Titans do not walk at night; only an
   Abnormal does" (C7 231) appears only as a field quote ending "count the exceptions".
   Fix: state it once as a rule above the Night table.

6. **Minor** — claim 59 says group size sits under a bar; `FoeDossier.astro` 23 prints
   "Group of N" openly. Fix: correct the claim.
