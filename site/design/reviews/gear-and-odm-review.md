# Review: Gear & ODM (rules accuracy)

No Critical findings. Every rendered number, band, stock row, and Standard Issue row matches its
YAML source; the tables, Fig. 1 to Fig. 3, the worked example, and the Compendium cards check out.

1. **Major.** Carrying table, the carried-comrade row (`gear-text.yaml`, `carrying`,
   `a-comrade-the-soldier-carries`): the cell "A comrade you carry, plus every item they carry"
   sits against "5 items", so the row reads as 5 items for the comrade *and* their load.
   `data/gear/carrying.yaml:36-39` counts 5 **plus** each carried item again by its own row.
   Fix: word the cell "A comrade you carry" and carry "plus every item they carry, each counted by
   its own row" as the row's note.

2. **Minor.** Horses, "Mounting and dismounting" (mdx:337): "Outside one there are no moves"
   contradicts `data/gear/horses.yaml:79-81`, where a Skirmish move may include one mount or
   dismount. Fix: "Outside one there are no moves, except in a Skirmish."

3. **Minor.** Field Repair outside a fight (mdx:164): "A soldier who is not rolling may Help" drops
   the Helper's own requirements in `data/gear/field-repair.yaml:64-66` (living, in the scope, not
   Down). Fix: "Another living soldier in the scope who is not Down may Help."

4. **Minor.** "Where the horse is" (mdx:326): a decoy horse "holds no Position and gives no Gear
   Dice"; `data/gear/horses.yaml:27-29` also bars mounting it. Fix: add "and cannot be mounted".

5. **Minor.** Jam (mdx:255; Fig. 1, last step): "you make none afterwards" reads as permanent, while
   `data/gear/odm-gear.yaml:172` stops Gas Rolls only while the harness stays Jammed. Fix: "and none
   while it stays Jammed".

6. **Minor.** Light Trigger (mdx:230-232 note, Fig. 2 step 3) omits its once per Titan Engagement
   limit (`data/character/talents.yaml`, `light-trigger`), which Fig. 1 states for the wear Talents.
   Fix: add "once per Titan Engagement".
