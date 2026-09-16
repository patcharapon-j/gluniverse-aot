# Review: Wounds & Fear (rules accuracy)

Six findings. No Critical.

1. **Major.** *How to read an effect* table, "Outside a Titan Engagement" column (`harm-tables.ts`, `OUTSIDE_STANDARD`, line 315): Next turn spent, Next action spent, No Reactions, and A forced step all render a bare "Nothing." The source (C 576; `effect-types.yaml` lines 12-14) says these do nothing there *unless the rule that called for the roll or created the situation states what they do*. The qualified strings already written in `EFFECT_WORDING` are dead code, so a procedure that gives a spent turn meaning is silently lost. Fix: drop the `no effect` entry from `OUTSIDE_STANDARD` so `w.outside` is used.

2. **Minor.** Care windows, mdx line 366: "Every living soldier in the scope who is not Down **makes** one roll" turns a permission into a duty; C 473 and `treat-injury.yaml` line 181 read "may make one". Fix: "may make one roll".

3. **Minor.** Treat Injury uses table, Revive success (`harm-tables.ts` line 829): "and a Down row still holds them" states as fact what the source makes conditional (`treat-injury.yaml` line 31). Fix: "and Down goes on if a Down row still holds them".

4. **Minor.** Harm-kinds table, Damage (`harm-tables.ts` line 154): "At 0 current Health it gives a Critical Injury **instead**" blurs damage that *brings* a soldier to 0, which marks boxes and gives one, with damage taken at 0 (`health.yaml` procedure, steps 3-4). Fix: name the two cases.

5. **Minor.** `HarmTrack.astro` line 37 renders "you cannot pushing, help, covering, reactions, take an action". Fix: reword the joined `forbids` list.

6. **Minor.** The Fear table calls `draw-attention` "the loudest thing on the event's Titan"; the effects table and Drive box call it "the loudest mark". Fix: one name.
