# Review: Fighting Titans (rules accuracy)

Checked every claim in `site/design/claims/fighting-titans.md` against the cited lines and YAML rows, the rendered table wording in `engagement-tables.ts`, and the RoundDiagram, PositionsMap, GrabCountdown, and StepFlow text. No Critical findings: no hidden Abnormal values, tracker, Next Behavior roll procedure, setup table, or tuning appears on the page.

1. **Major.** Fig. 1, Wings step. Drops "A Wing holds at most one Squadmate" (C 307; RND `wings`). Fix: add the sentence to the Wings step wording.

2. **Minor.** Fig. 1, Wings step. "Wings stand until a soldier dies..." reads as Wings dissolving at that event; the source lets them be *changed* only at a later wings step after such an event (C 307). Fix: "They may be changed at a later wings step only if, since the last one, ...".

3. **Minor.** Fig. 1, Play step. Omits that a Wing Squadmate acts right after its player character even on a turn spent in advance (C 308). Fix: add "even when that turn was spent in advance".

4. **Minor.** Behavior tiers table, Kill row limit. "a Grab entry does nothing else" is stricter than the source's "no other harming effect" (C 418; FMT `tier_rules.kill`). Fix: "inflicts nothing else".

5. **Minor.** "A Grab, seen coming" example. If Otto's dodge spent his next round's turn, that turn *is* his first counted turn, so no turn is given back; the refund applies only to a dodge that spent a turn after the first counted one (C 819; GRB `countdown.failed_dodge`). Fix: say the Grab spends that turn's action, leaving his second counted turn free, or drop the refund sentence.

6. **Minor.** Pinned table note: "A Death Roll, a Fear Roll, and a Gas Roll are never forbidden" has no source in the cited ranges (EFF `pinned` lists entries only). Fix: cite the rule or drop the sentence.

7. **Minor.** Section 1, step 4. "usually nothing holds its Attention" blurs the rule: nothing holds it unless a rung picks out one soldier (C 97). Fix: replace "usually" with that condition.
