# Review: GM's Guide Titan pages (rules accuracy)

Every Titan value shown or barred matches its YAML stat block and Behavior Table; the Tuning page carries no percentage or test figure. Findings:

1. **Major.** Running a Titan Fight, "When a clock fills", line 287: "the soldiers make the second Focus Titan Fear Roll, or the Abnormal one if it is an Abnormal". Source `data/engagement/background-titans.yaml` 76-79 and `data/mind/fear-rolls.yaml` 40-42: the second-focus-titan roll is made only if the entering Titan is now one of two Focus Titans, and the abnormal trigger applies as well, one Fear Roll per soldier for the event. Fix: "if it is now one of two Focus Titans, the second Focus Titan Fear Roll; if it is an Abnormal, the Abnormal one; one Fear Roll per soldier."

2. **Major.** `site/src/lib/gm-tables.ts` line 344, rung "The loudest or brightest" (rendered under a bar on Titans): "Only Draw Attention does that." Source `data/engagement/attention.yaml` 90-93: a Fear Roll result's draw-attention effect also sets the loudest flag. Fix: "Draw Attention, or a Fear Roll result that names this Titan, does that, never from Distant."

3. **Minor.** Running a Titan Fight, example, line 258: "The fallback fails too". `data/titans/standard-medium.yaml` 112 gives Grab's fallback as Thrash itself, so nothing fails (`behavior-procedure.yaml` 84-85). Fix: "and its fallback is Thrash."

4. **Minor.** `gm-tables.ts` lines 107, 117, 130: the setup table says "in this order" but lists Size Class before the Background Titans row, while `docs/rules/05-titan-engagement.md` 130-132 rolls the Background row first, then a Size Class per Background Titan. Fix: note that Background Titans are rolled before their Size Classes.

5. **Minor.** `gm-tables.ts` line 188, Call It: "every other target" leaves unsaid other than whom. `data/engagement/read.yaml` 85-89: every target except the Reader. Fix: "every target other than the Reader".

6. **Minor.** `gm-tables.ts` line 342, rung "Hooked into it": "one whose strike has just hooked into it". `attention.yaml` 86-87: only a Nape strike sets the flag. Fix: "whose Nape strike".
