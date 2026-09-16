# Claims: Wounds & Fear

Page: `site/src/content/rules/wounds-and-fear.mdx` (route `/guide/wounds-and-fear/`). Every table on the page is rendered from `data/harm/*` and `data/mind/*` by `site/src/lib/harm-tables.ts`; check the wording maps there against the rows cited. The three drawings (`HarmTrack.astro`, `StepFlow` fed by `criticalInjurySteps()`, `MindPaths.astro`) read the same files through that module.

`C` = `docs/rules/03-harm-and-mind.md`, `H` = `data/harm/health.yaml`, `CI` = `data/harm/critical-injuries.yaml`, `DN` = `data/harm/down.yaml`, `DR` = `data/harm/death-rolls.yaml`, `TI` = `data/harm/treat-injury.yaml`, `HL` = `data/harm/healing.yaml`, `EFF` = `data/harm/effect-types.yaml`, `END` = `data/harm/engagement-end.yaml`, `SR` = `data/mind/stress-responses.yaml`, `FR` = `data/mind/fear-rolls.yaml`, `SC` = `data/mind/scars.yaml`, `GR` = `data/mind/grief.yaml`.

## Health and Harm

- Health is half of Strength plus Agility, rounded up, and never changes, because attributes never rise. C 49; H `health`
- Health is a row of boxes, each clean, marked by damage, or crossed off by an untreated Critical Injury. C 50; H `health`, `kept_as`
- Boxes crossed off are the smaller of the untreated Critical Injuries held and Health; extras cross off nothing, and treating one gives back no box until fewer untreated remain than Health. C 51; H `health`, `boxes_crossed_off`
- Health lost is never more than Health minus the boxes crossed off. C 52; H `health`, `current_min`
- Current Health is Health minus boxes crossed off minus Health lost, never below 0. C 53; H `health`, `current`
- Health is small because Titan attacks bypass it. C 54; H `titan_attacks`
- The three kinds of harm, what each does, and what names each. C 58-62; H `harm_kinds` (rendered as the harm-kinds table)
- Damage procedure: 0 inflicts nothing whatever the current Health; above 0, add to Health lost up to Health minus boxes crossed off; reaching 0 gives Down and one Critical Injury of the damage's type at once, then check Down again; at 0 already, no Health lost and one Critical Injury. C 79-83; H `harm_kinds`, `damage`, `procedure` (rendered as Fig. 1)
- The Critical Injury's Injury Location is rolled unless the damage's rule names one; its Injury Type is the damage's. C 84
- A new untreated Critical Injury crosses off a clean box, else a box marked by damage with Health lost falling by 1, else none. C 86; H `harm_kinds`, `critical-injury`, `health_box`
- A Critical Injury that crosses off the last box makes the soldier Down and inflicts no further Critical Injury. C 88; H `last_box`
- Harm a ruling names: damage of 1 to 3 of the Injury Type of its source (Crush blow or hard knock, Cut edge, Pierce point, Burn fire), Injury Location rolled; or a fall, low or high as the GM names, never extreme, low if none named. C 66-69; H `harm_kinds`, `damage`, `by_ruling`
- The harm is named with the stakes and does not change once the dice are rolled; the GM states the soldier's current Health with it; never 4 damage or more, which is a musket's and is rolled; no ruling gives a Critical Injury, death, a Death Roll, a Scar, or Grief directly, names an Injury Location, a row, or a time limit, or opens or closes a care window; harm away from a fight holds a care window only as any other event's harm does. C 71; H `by_ruling`, `fixed`, `stated_with`, `never`
- A Titan attack is the harm a Behavior Table entry inflicts when a card resolves it; only the harm the entry names; harm another rule causes as a result is that rule's kind. C 96; H `titan_attacks`, `definition`
- It is always a Critical Injury and never damage, whatever the Health; no entry names death. C 96; H `harm_kind`, `never`
- Each harming entry lists Injury Location, Injury Type, and whether it cannot be lethal; a Bite is Bite, every other Titan attack is Crush. C 97; H `titan_attacks`, `injury_type`
- Attack Dice rolled as Titan Dice, lands on 1 or more Net Successes after the Reaction cancels; 0 successes whiffs against every target; a soldier who cannot react cancels nothing. C 98; H `titan_attacks`, `landing`
- The Grab's crush is a torso Crush Critical Injury that cannot be lethal. C 99; H `titan_attacks`, `grab`
- The Grab countdown is not a Titan attack: the lift and devour are Grab steps, roll no Attack Dice, no Reaction answers them, the devour names death. C 100; H `grab_countdown`
- Three harms outside the Behavior Tables: steam is Burn damage reaching the tables only at 0 current Health with a 0 roll inflicting nothing; the falling Titan gives a Crush Critical Injury that cannot be lethal and Pins; corpse heat gives a Burn Critical Injury at the start of each turn of a soldier Pinned under a corpse and 1 Burn damage to each Heaver. C 101
- A soldier with no Health lost can be Down or dying from Titan attacks alone; a soldier at 0 takes a Titan attack as any other does. C 103
- Getting Health back: revive, a treated or healed Critical Injury, a day passing, each with its amount and who. C 109-111; H `restoring` (rendered as the health-restore table)
- Nothing else restores Health lost in the field. C 113
- The effect types, their readings, and what each does away from a Titan Engagement. C 556-576; EFF `effect_types` (rendered as the harm-effects table)
- Penalties add up, never take the base dice below 1, never remove Gear Dice or Stress Dice. C 271; EFF `penalty`
- No row damages or wears gear; only the forced-strike row forbids Help or Covering, and Down forbids both on its own row; no row causes a Fear Roll or any roll by a comrade. C 578; EFF `never_used`

## Critical Injuries

- A Critical Injury is a lasting wound at an Injury Location of an Injury Type; the row says Down, lethal and how fast, effects, and healing time. C 117
- The five Injury Types and their sources. C 124-131; CI `types` (rendered as the injury-types table)
- The type picks the row's name and applies the table's rider for that type; everything else on the row is the same for every type. C 133; CI `type_rules`, `picks`
- Blast is a delivery, not a type: two Critical Injuries, one Burn and one Crush, each at its own rolled location; no rule yet names one. C 134; CI `type_rules`, `blast`
- No row wounds the mind; the Stress on the lowest torso and head rows stays; no lethal row gains Stress. C 135; CI `no_mental_rows`
- The eight steps of gaining a Critical Injury, in order. C 143-150; CI `gaining`, `steps` (rendered as Fig. 2)
- Worsening adds 2 per Critical Injury at that location and side that counts: every one held there treated or not, and every healed one there whose row has permanent effects; the other arm or leg never counts; the torso and head have no side. C 144; CI `worsening` (rendered in each table's note)
- The Net Success rider adds 1 per Net Success beyond the first, on a Titan attack's Critical Injury only; every success is net against a soldier who made no Reaction; no other harm takes it. C 145; CI `net_success_rider`
- The D6 Injury Location table, and the side roll when a rule names an arm or a leg without one: odd left, even right. C 159-168; CI `injury_location_table`, `sides` (rendered as the injury-location table)
- The four Injury Location tables, every row with its totals, its five names, Down, lethal and its limit, Death Roll penalty, effects, healing days, permanent effects, and repeat row. C 199-264; CI `tables` (rendered as the four injury tables)
- Each table's non-lethal cap row. C 200, 216, 232, 250; CI `non_lethal_cap` (rendered in each table's note)
- The type riders per table, which rows each picks and what it sets. C 212, 228, 246, 263; CI `type_riders` (rendered as the injury-riders table)
- Every table has an open-ended first and last row, so every total finds one. C 152
- Instant death appears only at totals 2D6 alone cannot reach. C 193
- Holding: held from gaining until healing; held ones count toward worsening treated or not; a healed one with permanent effects goes on counting. C 268; CI `held_injuries`
- Sides: an arm or leg Critical Injury is held at its side; a row with permanent effects is gained at most once per side at a limb and at most once at the head. C 269; CI `held_injuries`, `sides`
- Treating does three things: stabilizes a lethal one, ends a Down row's hold, gives back the box unless as many untreated Critical Injuries as Health are still held; it never removes effects, and a treated one keeps its healing time and still counts toward worsening. C 270; CI `held_injuries`, `treated`
- No Critical Injury damages or removes gear. C 272
- A side is lost at the 13 or more row and stays lost after healing; a later roll of it at that side uses its repeat row. C 295; CI `lost_limb_riders`, `sides_lost`
- A grade applies from the moment it is met, for life, on top of the row's own permanent effects, which stack: two lost legs at 4 dice on the dodge, Fly, and Ride; two lost arms at 4 on the strikes. C 295; CI `lost_limb_riders`, `applies`, `held_injuries`, `stacking`
- The four grades with their penalties, forbidden entries and decoys, Gear Dice removed, moves, mount rule, and what each keeps. C 300-303; CI `lost_limb_riders`, `grades` (rendered as the lost-limbs table)
- Cannot take: the entry cannot be taken, made, or used, and nothing needing its roll can be done; a forbidden decoy cannot be named for Break Attention. C 308; EFF `forbids-entries`
- A move that also spends the action cannot be made if the action is spent, as an Overloaded soldier's ODM move; away from a fight it does nothing unless the procedure's rule says so. C 309; CI `move_values`, `spends_action`
- A move that cannot be made leaves the soldier holding the Position they are placed at. C 310; CI `move_values`, `forbidden`
- No Gear Dice from an item still rolls the entry with any other item's dice; both arms lost takes the horse's dice on the dodge while mounted and none from ODM Gear, and Leap Clear takes none from ODM Gear. C 311; CI `no_gear_dice_from`
- Mount or Dismount with a comrade's help, with the three settings and the rule that without it there is no mount or dismount. C 312; CI `mount_with_help`
- Carried: a soldier the both-legs grade forbids to move may be lifted by Lift Comrade at their consent and keeps their action for entries needing no move; a Pinned soldier is never lifted. C 313
- Medical Retirement is open to a soldier who has lost both arms or both legs. C 314; SC `retirement`, `trigger`, `lost-limbs`
- Prosthetics: a gear item by Requisition at Limited Scarcity, one per Requisition, a player character may obtain one for a Squadmate; fitted to one lost side during a Downtime once that Critical Injury has healed, at most one per side; no roll, spends nothing, stays for life; a grade is read against sides lost less prosthetics of that kind; two never lower past the one-limb grade; the row's permanent effects stay and stack; it gives no dice, is never a weapon, and cannot be obtained before the loss has healed. C 305, 316; CI `prosthetics`

## Down and Dying

- The two Down conditions, checked whenever Health lost changes, a Critical Injury is gained or heals, or one becomes treated. C 326-331; DN `conditions`
- What a Down soldier can do: turns with move and no action that still count as turns; a move only as Fighting Titans allows; Death Rolls; being the patient of Treat Injury, the target of Rally, and lifted; Stress, lasting results, Grief, Scars, and a Grabbed state stay, and they can still gain Stress, Critical Injuries, Scars, and Grief. C 335-339; DN `while_down`
- What a Down soldier cannot do: any action including Help and every Catalog action; Push, Help, Cover, or make a Reaction, and a behavior they cannot react to lands; any attribute roll but the Death Roll, so never a Push, never Stress Dice, never a Stress Response while Down; a Fear Roll. C 343-346; DN `forbids`, `cannot`
- A Grabbed soldier who becomes Down stays Grabbed and cannot take Break Free; a comrade can still free them. C 348
- Down ends at once when current Health is above 0 and no untreated Down row holds them; only treating or healing a Critical Injury, a revive, or a day passing can bring that about; nothing else ends Down. C 352-358; DN `ending`
- The four rules for Down and this round's turns. C 364-367; DN `becoming_down_mid_round`, `after_ending`
- The three time limits and what each means, listed fastest first, with stabilized past the last. C 379-388; DR `time_limits` (rendered as the time-limits table)
- Away from a Titan Engagement and a Skirmish a turn or engagement limit runs out once, right after the care window held for that harm; after a Death Roll made away from both, including at end steps, a surviving turn or engagement limit becomes day; a Death Roll during a Skirmish follows its outcome row. C 390; DR `outside_titan_engagement_restart`
- Death Roll pool: Strength plus one Talent that names it, minus the Death Roll penalty. C 396; DR `death_roll`, `pool`
- Left out: no Stress Dice, Help, Push, Circumstances, gear, or Bonus Dice source. C 397
- Needs 1 success. C 398; DR `needs`
- One roll per Critical Injury, the player choosing the order; the first failed roll kills and no more are made. C 399; DR `one_roll_per_injury`
- Not an action, spends nothing. C 400; DR `not_an_action`
- The three outcomes. C 406-408; DR `outcomes` (rendered as the death-roll-outcomes table)
- Dying: sources; leaves play and holds no Position; a player character replaced by promotion or a new character when the procedure ends; a Squadmate leaves the Squad Pool; every Drive that named them can never trigger again; the death is a Fear Roll trigger and gives Grief; Gear & ODM has the gear. C 412-418; DR `dying`

## Treating Wounds

- Treat Injury is the Wits action, medical kit for Gear Dice, Wits alone without one; declare one use and one patient before rolling; needs 1 success; nothing on a failure. C 424, 428, 435; TI `needs`, `on_failure`
- The two uses, their patients, and what a success does. C 430-431; TI `uses` (rendered as the treat-injury-uses table)
- Treat and revive are separate uses and the players choose; a revive raising current Health to 1 ends Down unless a Down row holds them. C 433; TI `use_choice`
- Circumstances as on any attribute roll, Standard if none, adding up with the self-treatment and Pierce penalties, changing no need; Standard is the default in a fight, another step only for what no rule prices. C 437; TI `circumstances`
- The Burn rider: a medical kit that counts as had, or 1 medical unit spent on the roll; without either the roll is not made; the only medical unit spent on a roll is the care bonus, which also gives its Bonus Die; an aftermath roll never reaches a Burn because every lethal Burn row has a day limit. C 441; TI `type_riders`, `requires_kit_or_supplies`
- The Pierce rider: a 1-die penalty on every treat use on it, in a fight, as an aftermath roll, and in a care window, added to the self-treatment penalty. C 442; TI `type_riders`, `penalty`
- Patients: any other living soldier; self on a treat at a 2-base-dice penalty; never a self revive; in a care window a living soldier in scope. C 446-448; TI `patients`
- In a Titan Engagement: an action, the patient at the same Position, Helped, Pushed, and Covered, retried on a later turn; two soldiers who have both left count as holding the same Position, for Help and Covering too. C 452-454; TI `in_titan_engagement`
- In a Skirmish: an action, no Position requirement. C 458; TI `in_skirmish`
- The five care windows with their times and scopes, and the outside-harm window's one-per-event rule, its Death Rolls following it, and its patient limit. C 460-468; TI `care_windows`, `held` (rendered as the care-windows table)
- In a care window: the scope limits patients as well as rollers, helpers, and Coverers; one roll each for a living soldier not Down; no Position requirement; Help only from a qualifying soldier who has not rolled or Helped, declared before the roll and spending their roll, at most 3; Covering open to anyone who qualifies to Help, spending nothing; the players choose the order with the roll-off; Squadmates take part; a failed roll retried only in a later window. C 472-477; TI `care_windows`
- Aftermath rolls: patient, treater choice and Position test with the corpse and both-left readings, the Skirmish reading, one roll per patient and per treater, the roll and what a success does, a failure using up the attempt, no Help or Cover, Push allowed with Sure Hands, not a care window, the players choosing the order. C 483-489; TI `aftermath_rolls`
- Talents: Field Medicine adds dice, Sure Hands a second Push, Careful Nursing halves a treated comrade's healing time. C 502-503; TI `talents`
- When a day passes: at each Night Camp, on each of Downtime's seven days at the infirmary with an infirmary roll before its Death Rolls and no care window, and at the start of each session before the interim issue or once the procedure under way has ended, with Stress and Grief unchanged; never inside a Titan Engagement. C 512; HL `day_passes`
- The four steps of a day passing, in order. C 513-517; HL `each_day` (rendered as a numbered list)
- A lethal Critical Injury cannot heal while lethal; its healing time stops at 1 day. C 518; HL `lethal_injuries`
- An untreated Pierce from the 7 row up keeps its healing time, heals only after a successful Treat Injury, keeps its effects and box meanwhile, and a stabilized one still untreated still does not heal; a Burn's days are doubled. C 519; HL `not_while_untreated`
- When it heals: stops being held, effects end, the box comes back if it was untreated unless as many untreated remain as Health, permanent effects stay and it keeps counting toward worsening, any other healed one stops counting. C 520; HL `heals`
- Careful Nursing halves the remaining time, rounding up, once per Critical Injury, never on the soldier's own. C 521; HL `careful_nursing`

## Stress Responses and Rally

- Resolve is half of Instinct plus Empathy rounded up, plus 1 per Scar, minus 1 per Grief; it counts against both totals; it has no floor. C 548-550
- Iron Nerve counts Resolve as 1 higher on the soldier's own Stress Response; Unshaken Command can let a nearby comrade's Fear Roll use its holder's higher Resolve. C 551-552
- A Stress Response happens only on a Stress Die showing 1, or after a Push of the roll; a roll causes at most one; resolved after successes are counted and before the roll's effect. C 590; SR `roll`
- A roll whose own rule names another resolution still has the Stress Response and still cannot be Pushed after it, but does not use the table. C 592; SR `exceptions`
- The total, and no pool, Push, Help, Stress Dice, or Circumstances; Stress after any Push, current Resolve. C 596-597; SR `roll`
- The table, with every row's total, name, line, duration, and effects. C 604-612; SR `table` (rendered as the stress-responses table)
- Instant applies once to the roll that caused it; lasting is held and applies from the next roll on; a lasting row already held sends the soldier one row down, repeatedly. C 619-621; SR `result_rules`
- Lasting results end at Rally, at the end of the Titan Engagement they were gained in, or away from one as the calling rule says, or when a day passes; a result gained at the end steps was gained outside the fight; a Down soldier keeps them. C 627-631; SR `lasting_ends`, `down`
- Rally: target, needs 1 with each success clearing one, nothing on a failure, never lowers Stress, never on yourself, the target may be Down. C 641-644; SR `rally`
- Rally in a Titan Engagement: an action, the target at the same Position or one step with Carrying Voice adding one, Helped, retried on a later turn, both-left reading. C 645-648; SR `in_titan_engagement`
- Rally away from one: any soldier not Down, no Help, no Covering, once per comrade until they gain another lasting result. C 649-651; SR `outside_titan_engagement`
- Steady Voice adds dice. C 652; SR `talents`
- Stress in the field: the gains, the losses with their amounts, and the minimum of one per Scar. C 862-864

## Fear

- The seven triggers, their events, who rolls, and whether each can arise away from a Titan Engagement. C 664-681; FR `triggers` (rendered as the fear-triggers table)
- The GM's trigger: at least a listed trigger's weight; an event a listed trigger covers uses that row and never this one; never inside a Titan Engagement; never for an outcome a called roll's stakes named, with a listed trigger that outcome later meets still applying; the roll is every Fear Roll's; the advice of at most one in a scene and none for a horror already rolled for that day. C 683-688; FR `gm-horror`
- Limits: one per soldier per event; none for a Down soldier; none for a death during the steps after a fight; made as soon as the event is fully resolved, with Grief waiting for every Fear Roll of that death. C 692-695; FR `limits`
- One snapshot per event: everyone rolls together from Stress, Resolve, and Scars as they stood when the event resolved, Unshaken Command reading the comrade's Resolve at the same moment; find every row, then each Drive decision, then every result not shrugged off; no result of the event changes another total for it, so the order changes nothing. C 696-701; FR `limits`, `timing`
- The roll and its exclusions; two Scars raise the total for certain triggers; a Squadmate rolls like a player character. C 707-709; FR `roll`
- What each total costs, and the Reaction ban from 6 up with a 0-success card still sparing the soldier. C 715-720; FR `placement`
- The table, with every row's total, name, line, effects, and forbids. C 728-737; FR `table` (rendered as the fear-rolls table)
- A forced strike only on a row of 7 or more, a dropped Blade Set only on a row that spends the action or the turn, Stress to comrades only on the top row; no row causes another Fear Roll or helps. C 721; FR `placement`
- The event's Titan for each trigger, the nearest-Focus-Titan reading with its order and tie-break, the GM trigger's none-or-nearest, and the substitution when it has died or none is alive. C 740-749; FR `event_titan`
- What counts as the result, and that a Drive shrugs off all of it while the Fear Roll still counts as made. C 751; FR `result`

## Scars and Grief

- The two Scar triggers, and that a shrugged-off result gives none; each Critical Injury gives the stabilizing Scar at most once. C 777-778; SC `gaining`, `triggers`
- The five steps in order: roll D66 and roll again on a held row, a Squadmate rolling again on a marked row; record; minimum Stress rises by 1 and Stress rises to it at once; Resolve rises by 1; five Scars retire. C 782-786; SC `gaining`, `steps`
- Never more than five Scars, and a Scar gained at five does nothing. C 788; SC `maximum`
- Every Scar raises minimum Stress and Resolve by 1. C 792; SC `every_scar`
- The twelve Scar rows with their D66 results, names, triggers, effects, and Squadmate re-rolls. C 797-808; SC `table` (rendered as the scars table)
- Survivor's Guilt comes after that death's Fear Roll, and when no Fear Roll is made, when the death happens. C 811
- Five Scars must retire; both arms or both legs lost may retire at the player's choice whatever prosthetics are fitted; offered when the procedure ends or at once, and again at the end of every Downtime while the loss stands; declining is not final; a Squadmate may take it with the players choosing as one table and the roll-off; Retirement then happens at the moment a fifth Scar gained then would give. C 817-819; SC `retirement`, `trigger`
- Retirement never interrupts a procedure, with the four timings. C 820-824; SC `retirement`, `timing`
- Until then the soldier follows every rule as normal; they leave play as an instructor or Squad contact; a player character is replaced by promotion or a new character and a Squadmate leaves the Squad Pool; every Drive that named them can never trigger again; Retirement gives no Grief and is not a Fear Roll trigger. C 826-830; SC `what_happens`
- Who gains Grief in the three cases. C 839-841; GR `gaining`, `who`
- How much: 1 in total for the deaths of one Titan Engagement, of one Skirmish, of one day passing, and of one event away from a fight with the Death Rolls after its care window; a later procedure may make its deaths one event; any other death gives 1; plus 1 for each dead soldier a Drive named and plus 1 per death with Numb, both only for a soldier who gains Grief from that death. C 842-846; GR `amount`, `additions_apply_to`
- When: at the Grief step when a fight ends for deaths in it or at its end steps, so Grief never changes Resolve during that fight; otherwise immediately after every Fear Roll that death causes, or at once if none; never before that death's own Fear Rolls. C 847-850; GR `timing`, `applies_after`
- At most 3 Grief, and anything beyond is lost. C 851; GR `maximum`, `at_maximum`
- Each point lowers Resolve by 1 with no floor, and Grief does nothing else. C 852; GR `effect`
- No field rule lowers Grief; in Downtime Visit Haven lowers it by 2, Honoring the Fallen every soldier's by 1, the Squadmate relief each Squadmate's by 1. C 853; GR `losing`
- Retirement, promotion, and leaving the Squad Pool give no Grief; Squadmates gain Grief like player characters. C 854; GR `not_grief`

## After the Fight

- The nine end steps, in order, with what each does. C 872-880; END `steps` (rendered as the engagement-end table)
- The steps are resolved outside the Titan Engagement, and nobody retires and no promotion happens before the last step. C 882; END `during_the_steps`
- A Skirmish ends with the same steps, with Skirmish in place of Titan Engagement. C 886; END `procedures`, `skirmish`
- A fight does not end by its no-Focus-Titan test while a soldier lies Pinned; its end frees no one, and every soldier still Pinned when it ends by the no-soldier-standing test dies under the body, counted for Grief. C 884
- Soldiers who left: still in the fight for every rule here until it ends; they still take a turn each round and those turns count, so a turn limit keeps running out and a result can spend the turn; two who have both left count as holding the same Position for Treat Injury, Rally, Help and Covering on those rolls, and aftermath rolls, and one who has left never shares a Position with, or stands one step from, a soldier still in the fight; every end step applies to them. C 892-896; END `soldiers_who_left`
- Squadmates use every rule in the chapter, with three differences: no Drive so no shrug-off, never Push so no extra Push Stress and no Pushed forced strike, and a re-roll on a Scar triggered by a Push or a Cover. C 905-908

## Not on the page, and why

- The design notes (C 73, 137, 274-291, 318, 369, 420, 491-498, 506, 580-582, 633-635, 703, 753-767, 813, 832, 856, 888, 900, 928) are reasons, measured figures, and reference builds, not rules.
- C 3-39 (the chapter's own contents, source-file list, and decision citations) and C 902-936 ("Who uses these rules", the sheet-field list, and the Catalog mapping) are drafting scaffolding. The three Squadmate differences from C 905-908 are kept as rules; the sheet-field list at C 910-926 is a character-sheet specification and is left for the sheet.
- C 527-541 (the Grab and its target) is Fighting Titans' section; the page links there and states only what this chapter owns: the crush is a torso Crush Critical Injury that cannot be lethal, it crosses off a box like any other, and witnesses make a Fear Roll.
