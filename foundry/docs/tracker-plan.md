# Milestone 4: the Titan Engagement tracker, plan

The last milestone of the first release (ADR-0025): a tracker that runs a Titan Engagement round by round as `data/engagement/round.yaml` states it (wings, deal, swap, play, end), records every Position, Grab, Opening, Attention holder, and clock the GM tracker row lists (`round.yaml`, `gm_tracker`), applies the round-end steps itself with Undo (ADR-0026), and runs a Skirmish with the same surfaces (`data/skirmish/skirmish.yaml`). The look is the locked **Ops Ledger** (`foundry/design/tracker-preview-3-ops-ledger.html`, `foundry/design/tracker-preview-spec.md`): an always-visible HUD strip at the top of the screen, a two-page Engagement board window, and Position badges on soldier tokens.

Owner decisions this plan follows: the HUD is not in the sidebar (the GM keeps the sidebar on Chat); it is content-sized (about 800 px, at most 860), centred between the left controls with the scene navigation and the sidebar; spent chips fold to numbered tabs, then the row scrolls; Positions show on the board and on the canvas as small icon-and-letter badges coloured by the Focus Titan they refer to; round-end steps apply themselves with Undo, and the GM switches that off per category.

## 1. Where things live

| Piece | File |
| --- | --- |
| Tables the tracker reads, baked into `CONFIG.WOF.engagement` at build time | `tools/config-data.ts` (`engagementConfig`); schemas for `round.yaml`, `positions.yaml`, `anchor-ratings.yaml`, `grab.yaml`, `background-titans.yaml`, `engagement-setup.yaml`, `squad-tactics.yaml`, `titans/index.yaml` (ladders), `skirmish.yaml` and `foes.yaml` (the foe rule), `critical-injuries.yaml` (gaining) in `tools/data/schemas.ts` |
| Pure rules, no Foundry globals, unit tested | `src/rules/engagement/` : `cards.ts` (deal, turn order, swap), `positions.ts` (steps, moves, close rule, entering and dying Titans, leaving), `attention.ts` (candidates, ladder, the choose step), `grab.ts` (hold, countdown, release), `round.ts` (state machine, Wings, round-end plan, ops and their inverse), `strikes.ts` (Nape strike, Body Part strike, Break Attention outcomes), `skirmish.ts` (deal, foe rule, Guard and damage, Grit, ending), `injury.ts` (the Critical Injury gaining roll), `guard.ts` (what a player may ask the GM to change) |
| Combat and Combatant documents and their data models | `src/tracker/combat.ts` |
| A plain snapshot of the running engagement for the rules and the views | `src/tracker/snapshot.ts` |
| GM actions (setup, deal, swap, next card, Titan cards, round end, Undo) | `src/tracker/engine.ts` |
| Player requests through the GM proxy | `src/tracker/requests.ts` (a new `tracker` request kind on the existing `wings-of-freedom.proxy` query) |
| Results on roll cards (strikes on a Titan, Titan attack effects, Guard and Foe attacks) | `src/tracker/results.ts`, `src/tracker/foes.ts`, `src/tracker/injury.ts` |
| HUD strip, board window, setup dialog, token badges | `src/tracker/hud.ts`, `src/tracker/board.ts`, `src/tracker/setup.ts`, `src/tracker/badges.ts`, `src/tracker/components/*.svelte`, `static/styles/tracker.css` |
| Statuses the engagement derives | `src/rules/statuses.ts`, `src/documents/actor.ts` |
| Strings | `static/lang/en.json` (`WOF.Tracker.*`), under the website's text guard |

## 2. Data model

### 2.1 Foundry's Combat is the encounter

A Titan Engagement or a Skirmish is a `Combat` of system type `engagement` (`documentTypes.Combat.engagement`, `CONFIG.Combat.dataModels.engagement`), so the core combat tracker, turn markers, `game.combat`, and combat hooks keep working. The system's `WofCombat` class:

- `setupTurns()` sorts ascending by card (`round.yaml`, `initiative_cards.order`), places a Wing Squadmate right after its player character, and leaves out combatants holding no card this round (a Titan that entered mid-round, a dead soldier, a dead Titan's removed cards). It never advances the round itself.
- `nextTurn()` past the last card moves the step to `end` instead of starting a round; `nextRound()` is refused unless the end steps are all stamped (then it starts the next round at its wings step). `rollInitiative`, `rollAll`, and `rollNPC` deal the cards (GM) instead of rolling.
- `_onStartTurn` and `_onEndTurn` (they run on the active GM only) resolve a Focus Titan's card and count a Grabbed soldier's turns.

**Cards are Combatant initiatives.** One Combatant (system type `card`) per card holder: each soldier and Squadmate taking part, each Wing Squadmate (initiative null; it acts after its player character), one per Tempo card of each Focus Titan (the same token, `system.index` 0 or 1), and in a Skirmish one for the Foe group (the first Foe's token). Cards are integers 1 to 20, unique in the round, dealt face up.

`Combatant.system` (`card`): `kind` (`soldier`, `wing`, `titan`, `foe-group`), `titan` (the Focus Titan's key, for kind `titan`), `index`.

### 2.2 `Combat.system` (`engagement`)

| Field | Meaning | Source |
| --- | --- | --- |
| `mode` | `titan` or `skirmish` | spec |
| `step` | `wings`, `deal`, `swap`, `play`, `end` (Skirmish: `deal`, `play`, `end`) | `round.yaml` round_steps; `skirmish.yaml` rounds |
| `anchor` | Anchor Rating id | `anchor-ratings.yaml` |
| `soldiers` | actor ids taking part, in Squad order; `dead`, `left` per soldier are read from the actors | `positions.yaml` placement, who_takes_part |
| `titans[]` | per Focus Titan (and corpse): `key` (token id), `label` (A, B), `status` (`focus`, `corpse`), `entered` (round), `grab` (`{soldier, counted, lifted, arm}` or null), `decoy` (`{name, left}` or null), `decoysInRow`, `flags` (`hooked`, `hurt`, `loud`: soldier ids), `dodges` (soldier id to successes this round), `pending` (the attack card this card rolled) | `round.yaml` gm_tracker focus_titan_row, corpse_row |
| `background[]` | `name`, `titan` (stat block id), `actor` (uuid of a world or pack Titan to bring in), `length`, `filled`, `entered` | `background-titans.yaml`; `engagement-setup.yaml` |
| `retreat` | `length` (8), `filled`, `active`, `began` (round) | `background-titans.yaml` retreat_clock, retreat |
| `wings` | Squadmate id to player character id | `round.yaml` wings |
| `wingEvents` | whether a death, a departure, a Down, a Grab, or a Focus Titan entering or dying happened since the last wings step, and which Squadmates must be assigned again | `round.yaml` wings.when |
| `swaps` | this round's swaps (`a`, `b`, the cards given) and a pending proposal | `round.yaml` swapping |
| `odmUsed` | soldier ids who used ODM Gear this round | `odm-gear.yaml` odm_use |
| `tactics` | held and used Squad Tactics; `cloaks` thrown | `squad-tactics.yaml`; `round.yaml` engagement_line |
| `noOneStanding` | the round the no-soldier-standing test became true, or null | `engagement-flow.yaml` ending |
| `endLog[]` | the round-end steps: `step`, `state` (`done`, `undone`, `pending`, `skipped`), `ops` | ADR-0026 |
| `skirmish` | `foes` (token ids, label order), `kind`, `night`, `ambush` (`squad`, `foes`, none), `acted` (who has acted), `engaged` (soldier id to Foe token ids), `holds` (soldier to Foe), `lastAttacker` (Foe to soldier), `grit` and `parley` rises, `broken`, `sizedUp`, `parleyed` | `skirmish.yaml`; `foes.yaml` |

### 2.3 What stays on the actors

- **Soldier and Squadmate:** `positions.entries` (`titan` label, `position`) and `positions.left` are the record the board shows and the ladder reads (`round.yaml`, gm_tracker titan_card_checklist: the Squad sheet's positions column, mirrored by the sheet field). `airborne`, `carrying`, `carried_by`, `pinned`, `down`, and gear stay where milestone 2 put them. Death is the `dead` status (core) on the actor.
- **Titan (the token's actor):** body parts, Regeneration, Openings, heave count, Next and previous behavior, `attention_holder`, `focus_titan_label`, `corpse`. New field `openings_by` (the soldier id that created each Opening, `''` for one the GM added on the sheet); `openings` stays its count, and both are written together.
- **Foe:** `health_lost`, `held`, `out`, `weapon`, `firearm_loaded` (milestone 2).

## 3. The round, as a state machine

`src/rules/engagement/round.ts` is a pure reducer: `can(state, action)` returns null or the reason, `next(state, action)` returns the new state. The engine calls it before every write, and the views call it to enable a button and show the reason on a disabled one.

```
setup ─▶ wings ─▶ deal ─▶ swap ─▶ play ─▶ end ─▶ (round + 1) wings
Skirmish:  setup ─▶ deal ─▶ play ─▶ end ─▶ (round + 1) deal
```

- **setup** (`engagement-flow.yaml`, starting; `engagement-setup.yaml`): the GM picks or rolls the Anchor Rating, the Focus Titan (a Titan token on the scene), the Background Titans with clock lengths 4, 6, or 8 (or rolls them), and who takes part (every soldier and Squadmate token on the scene by default). The retreat clock is 8 and never set. The start labels the Titan A, resets its values (every Body Part Intact with count 0, no Openings, empty clock, no previous behavior) and rolls its Next Behavior, places every soldier at Distant relative to A (horses: not tracked, section 10), evaluates the ladder (nothing holds it at the start), posts a chat note of who makes the first-engagement and Abnormal Fear Rolls, marks every held Squad Tactic unused, and opens round 1 at its wings step. A Skirmish start picks one Foe group (its Foe tokens, labelled 1 upward, at full Health, firearms loaded, Bandit weapons rolled), night, and the Ambush (the Squad's Sneak roll against the group's Watch when the GM rules an approach is possible).
- **wings** (`round.yaml`, wings): at the first wings step, Wings are assigned; later only when `wingEvents` says a change is allowed, and a Squadmate whose player character died or left must be assigned again. A Wing holds at most one Squadmate. Fall Back (`squad-tactics.yaml`) is offered here when held and unused. The GM, or the owner of the player character, sets a Wing.
- **deal** (`round.yaml`, deal): the GM deals. One card to each living player character, to each living Squadmate not on a Wing, and Tempo cards to each living Focus Titan; Down, Grabbed, carried, and departed soldiers are still dealt. Cards are drawn without replacement from 1 to 20, so no two share a number; a Titan's cards are listed lowest first. More than 20 holders is refused with a note (rules question 11).
- **swap** (`round.yaml`, swapping): two soldiers who each hold a card, neither Down nor Grabbed, holding the same Position or one step apart under the Anchor Rating relative to the comparison Titan (`positions.yaml`, comparison, otherwise), or both departed, exchange cards; each soldier swaps at most once a round; a Titan's card and a Wing never swap. Both must agree: the GM makes any legal swap; a player proposes one for their own soldier, and the other soldier's owner (or the same player, or the GM) accepts it.
- **play**: cards come up lowest first; a Wing Squadmate acts right after its player character. The GM advances ("Next card"); the owner of the acting soldier may end that soldier's turn. On a Focus Titan's card the active GM's client resolves it (section 5.3).
- **end** (section 6): the steps apply in order; after the last one is stamped, "Begin round N" moves to the next round's wings step (a Skirmish: its deal step), clears the swaps, the ODM list, and each Titan's dodges.

The ending tests (`engagement-flow.yaml`, ending) are checked after every change and shown on the board. The tracker never ends the engagement on the GM's word (`gm: none`): its End button is enabled only when a test is met, and then makes the owed Gas Rolls, clears every Position, the derived statuses, and the Pinned and airborne records, and posts the engagement-end steps as a checklist note (the steps themselves stay with the table, section 10). Core's own End Combat stays available.

## 4. Who may do what

| Act | GM | A player, for a soldier they own | How |
| --- | --- | --- | --- |
| Setup, deal, next card, round end, Undo, any Position "by a rule" | yes | no | direct writes |
| Assign a Wing | yes | for their own player character's Wing | `tracker` request `wing` |
| Propose, accept, or cancel a swap | yes (makes it) | yes | requests `swap-propose`, `swap-accept`, `swap-cancel` |
| Move (change a Position by a legal step), let go, leave, return | yes | yes | the actor update is the player's own; the ODM mark goes through `odm` |
| End their soldier's turn | yes | when the current card is that soldier's | core `nextTurn` (players may change the turn of their own combatant) |
| Draw Attention (sets the loudest flag) | yes | yes | request `flag` |
| Declare a thrown cloak, Fall Back, Hook and Cut | yes | yes | request `tactic` |
| Apply a strike, a Break Attention, a Break Free, a Guard, a Foe attack | the GM's client applies it from the roll card (section 5) | the roll is theirs | no request: the GM's client reacts to the card |

`src/rules/engagement/guard.ts` checks each `tracker` request on the GM's client before anything is written, the same way `proxy-guard.ts` does for cards: the user must own the soldier named (for `swap-accept`, the other soldier), the soldier must be taking part, the step must allow the act, and the act must be legal by the rules functions; the request carries ids only, never the values to write, and the GM computes every value.

## 5. Milestone-2 deferrals now wired

### 5.1 Requirements on a roll

The roll dialog gains an **Against** line for entries made against a Titan (Nape strike, Body Part strike, Break Attention, Break Free, Read) listing the living Focus Titans (a targeted Titan token is preselected), and for Fight and Shoot in a Skirmish, the Foes. `entryBlock` now reads the engagement:

- **Nape strike** (`titan-harm.yaml`, nape_strikes): Blind Spot relative to that Titan, not its Attention holder, not Grabbed, no retreat under way, and working ODM Gear unless that Titan is grounded (rules question 6 closed: the struck Titan is now known). Openings the striker did not create can be spent, one Bonus Die each, within the cap of 4; the grounded-titan source adds its 2 dice (`bonus-dice-sources.yaml`).
- **Body Part strike**: a Body Part that is not Broken, struck from its kind's Positions or any of in-reach, on-body, blind-spot when grounded; a holding arm only from in-reach, on-body, blind-spot before the lift and on-body, blind-spot after it (Clear the Hand widens it once declared); not Grabbed; working ODM Gear from on-body or blind-spot unless grounded. The part is chosen in the dialog.
- **Break Attention**: holds a Position relative to the Titan, not Grabbed, no decoy holds it, and the named decoy's requirement (flare: the GM confirms the Squad Supply, eyes not Broken; thrown cloak: on-body or blind-spot, not yet thrown, eyes not Broken; Feint: in-reach or on-body with working ODM Gear, mounted, or on foot against a grounded Titan; riderless horse: the horse is not lame and mounted or at the soldier's Position). Needs: 1 for the holder, else 2, 2 against a holding Titan, +1 for a Feint, +1 per decoy in a row (`attention.yaml`, break_attention).
- **Grabbed** soldiers roll only Break Free (needs 2, a 2-die penalty once lifted). A departed soldier cannot roll entries that need a Position.

### 5.2 Results on a Titan (strikes)

The roll card gains `target` (the Titan key, the Body Part, the decoy, the Openings spent, or the Foe and a Grapple). When a card of those entries is posted or Pushed, **the active GM's client** computes the result from the stored card and the engagement (`strikes.ts`) and applies it, recording its changes in a separate message flag (`wings-of-freedom.result`, so a player's later Cover or Reaction rewrite never races it); a Push undoes the previous result and applies the new one. The card shows the result lines with Undo and Redo for the GM, and "Not applied" with Apply when the GM switched the category off.

- **Nape strike:** the spent Openings are removed; successes at least the Nape Depth kill the Titan (section 5.4); otherwise each success creates an Opening by the striker, plus one with Relentless on at least 1 success; the hooked-by-strike flag is set either way.
- **Body Part strike:** `strikeSuccesses` on the part (the holding arm at grip Toughness 1), Openings beyond Broken, just-hurt on at least 1 success; a Broken holding arm frees the Grabbed soldier; a newly Broken leg grounds the Titan (the Leap Clear rolls of the falling Titan are posted as a reminder, section 10).
- **Break Attention:** on success the decoy holds the Attention for Tempo cards, decoys in a row +1, each success beyond the need is an Opening, a Grabbed soldier is freed, the riderless horse bolts (note), a thrown cloak is recorded; a flare fills every Background clock by 1 after the roll whatever its result (full clocks resolve at once, section 6).
- **Break Free:** on success the soldier is freed (`grab.yaml`, release).
- **Draw Attention** (unrolled): a board button sets the loudest flag (not from Distant, not Grabbed).

### 5.3 A Focus Titan's card

On the active GM's client, when the card comes up (`behavior-procedure.yaml`, resolving_a_card): dead, nothing; holding a Grabbed soldier, nothing (Next Behavior kept, flags stay); a decoy, the hold counts down, the Next Behavior becomes previous and a new one is rolled (the ladder is evaluated on the hold's last card); otherwise the ladder is evaluated (`attention.ts`: candidates, rungs top to bottom, struck-first, narrowing, holder keeps a tie, lowest card with a Wing after its player character, else nothing) and written to `attention_holder`; no holder, nothing. Then the choose step picks the entry (Body Parts, the holder's Position against the requirement, the fallback, Thrash) and the attack card is rolled in the open at its targets (the holder, or the holder and everyone at the same Position who is not Grabbed); a soldier's dodge already made against this Titan this round is written onto the card as their Reaction. Everything is announced in a Titan card chat line. When the card ends (the GM advances), the attack's effects are resolved if the GM has not resolved them yet, and the next step applies: previous behavior, decoys in a row 0, flags cleared, a new Next Behavior rolled and revealed after a telegraph.

### 5.4 Landed attack effects (Titan attack cards)

The attack card lists each target's Net Successes; "Resolve" (GM, or automatically at the card's end) applies, target by target in card order, only where the card landed: **stress** (a Stress op), **critical-injury** (the gaining roll, `injury.ts`: the Injury Location as named or rolled with its side, 2D6 plus 2 per held injury at that location and side, plus 1 per Net Success beyond the first, the repeat row, the non-lethal cap, the type riders; the row's compendium entry is added with its type and side; instant death marks the soldier dead), **grab** (`grab.ts`: the hold, the holding arm, the Titan's Attention, the crush as a torso Crush injury that cannot be lethal, airborne and mounted cleared, carrying ended, the witnesses' Fear Rolls listed; a Pinned target takes only the crush), **knock-loose** (an airborne soldier, or one on-body or blind-spot, falls: Position to in-reach, airborne cleared, a fall note with its band; a mounted target is not affected), and **telegraph** (the next Next Behavior is revealed). Each change is an op with Undo.

A Titan's death (`titan-harm.yaml`, titan_death): relief, a held soldier freed (a fall if lifted), steam rolls listed for everyone on-body or blind-spot, the body's fall listed when it was not grounded, Openings and Next Behavior and remaining cards removed, positions relative to it become its corpse's (on-body and blind-spot read in-reach), the tracker row becomes a corpse row, and the ending test is checked.

### 5.5 The Grabbed countdown

At the end of each of the Grabbed soldier's own card turns after the Grab landed (a Wing Squadmate's turn counts at its player character's card): the first counted turn's action is marked spent, and at its end the soldier is lifted; at the end of the second, still Grabbed, the soldier dies and the Grab ends, and the witnesses' Fear Rolls are listed. A soldier freed during a counted turn is not counted. Turns spent in advance by a dodge are the table's to note (section 10).

### 5.6 Foe attacks, Guard, and a Skirmish's harm

On the Foe group's card the board lists each Foe's pick by the foe rule (`skirmish.ts`: held, engaged, loaded, empty, close in, nothing; last attacker, then lowest card), and "Act" rolls it: a Foe attack card with its Attack Dice as base dice (6s), 2 more with the Ambush against a soldier who has not acted, the target's Block (Fight only) or Dodge cancelling, and on 1 or more Net Successes the weapon's damage plus 1 per Net Success beyond the first applied to the soldier's Health (a Critical Injury of the weapon's type when current Health reaches 0). A soldier's Fight or Shoot against a Foe rolls the Foe's Guard on the GM's client (none against an Ambush on a Foe that has not acted) and applies the damage to the Foe (out at 0: killed by cut, pierce, or burn, out cold by crush; out Foes leave every pair), a Grapple holds the Foe instead, and Grit is checked. A Reload or a shot updates the firearm. Every change has Undo.

### 5.7 Statuses now derived

`grabbed` (held in a Focus Titan's hand), `engaged` (Engaged with at least one Foe), and a soldier's `held` (holding a Foe or held by one) now follow the running engagement: the Token HUD refuses to toggle them with a note, and they redraw on every combat change. A Foe's `held` stays its field.

## 6. Round-end automation with Undo (ADR-0026)

When the last card has come up, the step becomes `end` and the active GM's client runs the end steps in order (`round.yaml`, end_steps), each as a list of ops written to `endLog`:

| Step | Category (GM switch) | What it does |
| --- | --- | --- |
| Gas Rolls | `roundGas` | a Gas Roll card for every soldier in `odmUsed` who is alive, rolled at once; each card keeps its own Undo, and the step's Undo also deletes the cards |
| Regeneration +1 | `regeneration` | every living Focus Titan's clock +1; a full clock applies `regenerate` (Openings erased, counts cleared, the most damaged part healed, steam listed for on-body soldiers, a healed leg stands the Titan and frees the soldiers it pins) |
| Background clocks | `clocks` | during no retreat, every Background clock +1 in tracker order; a full clock enters as a Focus Titan when fewer than two are alive (next free label, its token is created from its actor next to the first Focus Titan, values reset, Next Behavior rolled, everyone holding a Position at Distant relative to it, ladder evaluated with no cards, Fear Rolls listed, cards from the next round), else the engagement becomes a retreat |
| Retreat clock | `clocks` | during no retreat, +1; full makes the engagement a retreat, recording the round it began |
| Round ends | none | the stamp only |

A step whose category is switched off stops the run and shows "Not applied" with **Apply** (and **Skip**), because later steps read its result. Each stamped step shows **Undo**; undoing a step first undoes every later stamped step, in reverse order, and leaves them all waiting with Apply. An op records the document, the path, the value before, and the value after; Undo writes the value before only when the value is still the one the op wrote (a later change is kept and named in a warning), and a created token or combatant is deleted. The GM switches live in the preferences menu beside the card switches.

The Skirmish end has two steps, both automatic: broken groups leave (their Foes are marked out and removed from every pair), and the ending is checked.

## 7. Positions

`positions.ts` builds the step graph of the Anchor Rating (`anchor-ratings.yaml`) with the grounded permissions (every step among in-reach, on-body, blind-spot on foot; at Open, on-body to blind-spot on foot or by ODM), a corpse always counting as grounded. `moveOptions(soldier, titan)` lists, for each Position, whether a move can reach it and how (on foot, mounted, ODM, a Fly roll with its need and failure Position), or why not: Grabbed, Pinned, or carried (nothing changes), Down (only in-reach to Distant on foot), a mounted soldier (mounted steps or ODM), ODM Gear not had, the retreat's forced moves (a reminder, since the choice among them is the soldier's). A move to a Fly-roll step opens the Fly roll and places the soldier by its result. The close rule is applied on every change (`two_focus_titans`, close_rule); an ODM move sets airborne and marks ODM use, a move on foot clears airborne; a carried soldier's Positions follow the carrier's. Letting go sets in-reach and posts a fall note. Leave and Return follow `positions.yaml`, leaving (no return during a retreat). The GM may also set any Position "by a rule" (a starting placement, a fall, a Fear Roll's forced step), which never marks ODM use.

The board's Position matrix shows the soldier by the Focus Titan (and corpse) grid with each cell a button opening a menu of Positions: reachable ones plain, others marked with the reason and enabled only for the GM ("by a rule"). The canvas draws a badge per Focus Titan above each soldier token: the Position icon and the Titan's letter, filled in the Titan's colour (A red, B blue), hollow at Distant, ringed when Grabbed by that Titan; Engaged pairs show a brass Foe badge per Foe in a Skirmish.

## 8. Views (the locked Ops Ledger)

- **HUD strip** (`Hud.svelte`, mounted once into `#interface`): positioned between the right edge of the scene navigation (`#ui-left-column-2`) and the left edge of the sidebar, measured on resize, sidebar collapse, and UI scale, `width: fit-content; max-width: 860px`, top 8 px; `#ui-top` gets matching top padding so notifications stay visible. Contents as the preview: round number, the five step pips, the primary action (Keep Wings, Deal cards, Begin play, Next card, Next check) for the GM or the step's hint for a player; the card chips in order (portrait, card number stamp, the "was" stamp after a swap, short name, a Position mini-letter per Focus Titan, status icons; the current one lifted with the red marker; a Wing chip linked after its player character; Titan and Foe cards as iron tabs); Titan chips (plate, label and name, its cards with done and now, Attention or hold); the Retreat clock; Board and Fold. Dense rows fold spent chips to numbered tabs and then scroll, keeping the acting chip in view. The swap cue and the round-end cue hang under the strip. Folded, it is the thin bar (round, steps, now and next, Retreat, Unfold, Board). The fold state is per viewer (client setting). Chips are buttons: in the swap step they pick; otherwise they open the soldier's sheet (owner) or pan to the token.
- **Engagement board** (`Board.svelte` in an ApplicationV2 window, 1000 by 700): the leather binder with the two file tabs (Titan Engagement, Skirmish: the tab of the running kind is active, the other is shown disabled), the two-page spread with the spine, and the round-end checklist footer across both pages. Left page: the engagement line (Anchor, Round, Step, Retreat, Tactics, Cloaks), the step bar with the actions, the Position matrix (card or Wing, soldier with portrait and Down, Grabbed, or Dead stamp, one cell per Focus Titan and corpse, Gas pips, Stress pips), the key and the log notes (swap made, the close rule, ODM used this round). Right page: a block per Focus Titan (plate, label, name, kind and Tempo, its cards; Attention holder with the ladder's rungs and the one met inked, the would-be holder if its card came up now, the Grab countdown; the sealed Next Behavior with the previous one (the GM may peek); the Body Part stamps with state and count; Openings as brass tokens with their creators and the flags; the Regeneration clock, its length hidden for an unread Abnormal), corpse rows, then the Background and Retreat clock boxes. Skirmish pages: the Engaged or Apart matrix per Foe, the Foe group block (Grit, dice, each Foe's Health boxes, the foe rule's pick and Act), no clocks. The footer: the stamped checklist with Undo, Apply, and "Begin round N".
- **Setup** (`Setup.svelte` in a dialog window): the start choices of section 3.
- Motion uses the shared tokens (`src/motion/`): chips deal in, the current chip lifts, clock segments settle, stamps drop, badges pop; Reduced keeps colour flashes; Off and `prefers-reduced-motion` keep it still. No three.js.

## 9. Tests (vitest, pure)

- **Deal:** unique cards 1 to 20; one per living player character and un-Winged Squadmate, Tempo per living Focus Titan (the Sprinting Abnormal's 2), none for a Wing, the dead, or a corpse; Down, Grabbed, and departed soldiers dealt; a Titan's cards sorted; more than 20 refused; seeded randomness covers many deals.
- **Turn order:** lowest first, never tied, a Wing right after its player character (also when that card was swapped), Titan cards interleaved, the Ambush order in a Skirmish.
- **Swaps:** each refusal (Down, Grabbed, already swapped, Wing, Titan card, more than one step apart under each Anchor Rating, one departed and one not, not in the swap step) and each allowed case (same Position, one step, both departed); the proposal and acceptance flow.
- **Positions:** steps per rating including Fly-roll steps; grounded and Open-rating permissions, a corpse; Down, Grabbed, Pinned, carried, mounted, no ODM Gear; the close rule; a Titan entering (Distant) and dying (corpse Positions, on-body and blind-spot read in-reach); leave and return (not in a retreat); the comparison Titan.
- **Attention:** the standard and Sprinting Abnormal ladders, struck-first, narrowing, Down candidates, the holder keeping a tie, the card tie-break with a Wing, nothing at the start, a Grabbed soldier held by another Titan left out; the choose step (Body Parts, requirement, fallback, Thrash, previous behavior).
- **Grab:** the hold (holding arm, grip Toughness, Attention, Position with the close rule), the countdown (lifted after the first counted turn, devoured after the second, freed mid-turn not counted), release (in-reach, a fall when lifted, the Titan dead).
- **Strikes:** Nape strike kill and short (Openings, Relentless, spent Openings, own Openings not spendable), Body Part strike (grip arm, Openings, just-hurt, freeing), Break Attention needs and success (decoy, decoys in a row, Openings, freeing).
- **Round end and Undo:** the plan per step (Gas list, Regeneration with a full clock, Background clocks entering with fewer than two Focus Titans and a retreat with two, retreat clock filling and stopping in a retreat), switched-off categories stopping the run, Undo cascading in reverse and skipping values changed since.
- **State machine:** each allowed and refused transition, Wings open and closed by events, the round advance clearing per-round state, the Skirmish variant (no wings or swap).
- **Skirmish:** the deal (one per soldier, Down included, one for the Foe group while any Foe is in), the foe rule's six steps, Guard and damage, killed or out cold, Grit and breaking, the ending tests.
- **Injury roll:** location and side, worsening, the Net Success rider, repeat rows, the non-lethal cap, type riders, against the live table.
- **Guard:** each request kind allowed and refused.

## 10. Deferred (named, not built in this milestone)

- Horses as tracked tokens (a dismounted horse's Position, Horse Whistle, the riderless horse's departure beyond a note).
- The falling Titan's Leap Clear rolls, Pinned by a fall, corpse heat, Heave, and cutting free are posted as reminders and recorded on the sheet by hand (the Pinned fields exist); the tracker does not roll them.
- Steam rolls (listed with who rolls), fall damage (listed with its band), and the witnesses' Fear Rolls (listed; each soldier rolls from the sheet).
- Turns spent in advance by a dodge and the failed-dodge rule of the countdown; Call It; the Read's revealed facts are set on the Titan sheet (milestone 2).
- The retreat's forced moves are shown as a reminder, not enforced; the stay limit is shown as a count.
- Pry Loose and Hook and Cut are declared from the board and rolled from the sheet; Hamstring Line and Clear the Hand are recorded as used.
- The engagement-end steps (`data/harm/engagement-end.yaml`) beyond the owed Gas Rolls and clearing the records.
- Parley, Size Up's reveal, and the Squad leaving a Skirmish are recorded by button, not rolled by the tracker.

## 11. Rules questions raised

Appended to `docs/rules-questions.md` (11 to 14): more than twenty card holders; which Focus Titan a swap compares Positions against, and a soldier who holds a Position only relative to a corpse; how long the foe rule's "last attacker" lasts; and which dodge cancels a Titan's second card in a round after a later Push.

## 12. Order of work

1. This plan and the rules questions.
2. Data: schemas, `CONFIG.WOF.engagement`, the Titan `openings_by` field; the pure rules and their tests.
3. Documents: `WofCombat`, `WofCombatant`, the models, derived statuses; the engine and the proxy requests with the guard and its tests.
4. Rolls: the Against line, requirements, strike results, the Titan card, attack effects, the injury roll, Foe attacks and Guard.
5. Views: HUD, board, setup, badges, styles, lang; the preferences switches.
6. Build, test, typecheck, svelte-check, the text guard; the Foundry check on the isolated server; fixes; this milestone's status in `core-plan.md`.
