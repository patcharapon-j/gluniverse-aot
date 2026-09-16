# Review: Expeditions & Downtime (rules accuracy)

1. **Critical — Recruit is offered when the rules say it is not.** Page: `expedition-tables.ts` `SQUAD_ACTION_TEXT.recruit` (rendered in the Downtime Actions table, "One for the Squad") and the Fig. 4 step `squad-action` ("The Squad takes one, chosen by the players"). Source: `data/campaign/downtime.yaml` `squad_actions.rows` recruit and `steps.squad-action`; C 299, 338: "Not offered while the playtest configuration holds, and it brings no Squadmate then... so the Squad Action is Honoring the Fallen." The page states only the joining rule, so a player reads Recruit as available now. Fix: open the Recruit wording with "Not offered while the playtest configuration holds", and say so in the Squad Action step.

2. **Minor — the Abnormal's source is misattributed.** Page line 91: "The Abnormal the route's own tables name". Source: `route.yaml` `mission_brief_fields.abnormal`, C 52: the Brief names it and the hazard tables' Abnormal rows use it. Fix: "the Abnormal the hazard tables name".

3. **Minor — unsourced item count.** Page: `LIST_TEXT['flintlock-pistol']` "It arrives empty, and counts as 1 item." `requisition.yaml` `list.rows` flintlock-pistol notes (C 437) say only "Arrives empty". Fix: drop "and counts as 1 item".

4. **Minor — a Leg with no Lead.** Page line 160: "nothing else changes" omits `legs.yaml` `expedition.every_soldier_down`: the failed Leg roll still spends its 2 rations and adds its +1. Fix: add that clause.

5. **Minor — defined term dropped.** Page line 197: "it is not a behavior"; source C 219 and `hazards.yaml` `straggler` comment say "not a Behavior Table card". Fix: restore the term.

6. **Minor — ledger example.** Page line 343 "Ask fourth ... 3 more for the ledger" assumes the three earlier asks were granted; `requisition.yaml` `ledger.value` counts grants. Fix: "Ask after three grants".
