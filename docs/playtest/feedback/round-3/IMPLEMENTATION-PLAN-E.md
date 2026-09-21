# Batch E implementation plan: zone combat, the Stride, and the engagement board

Written 2026-09-21. The rules are settled in decision batch 16 (`docs/rules/DECISIONS-2026-09-14.md`, 16-1 to 16-38) and ADR-0029; the design is `zone-combat-design.md`; the owner's record is `OWNER-DECISIONS.md`. This file splits the work into packages that parallel agents can run. **Packages are partitioned by file ownership, not by feature**: every file below is listed under exactly one package, and a package edits only its own files. A file no package lists is edited by nobody in batch E.

Where this plan and batch 16 disagree, batch 16 wins and the plan is corrected.

---

## 1. The packages at a glance

| Package | Covers | Agent | Runs |
|---|---|---|---|
| **P1** | Rules data and chapters (E1 to E5): `zones.yaml`, every YAML reader, Chapters 1, 3, 4, 5, 6, 7, the glossary, render checks | wof-drafter, Opus | Stage 1 (step 1 first), stage 2 |
| **P2a** | Simulator spatial model and the Stride (E8): code and unit tests only, **no runs** | Opus | Stage 1 and 2, beside everyone |
| **P2b** | The rerun (E7): one full run and the report | the P2a agent, or a fresh one | Stage 3, **alone** |
| **P3** | Foundry rules engine and tracker: `positions.ts` and every reader, the snapshot, the combat model, the setup field builder, the ledger's field readout | Opus for the engine, Sonnet for mechanical reader updates | Stage 1 and 2 |
| **P4** | Foundry engagement board: new `foundry/src/board/`, PIXI, `boardPath()` | Opus | Stage 1 and 2 |
| **P5** | Site: the Chapter 5 pages and a zone diagram | Sonnet, Fable-light review | Stage 2 (diagram), stage 3 (text) |
| **P6** | The packet, with the printable field | Opus | Stage 5, last |

## 2. Order

```
Stage 0  decisions (done): ADR-0029, batch 16, OQ-200 to OQ-202, this plan
Stage 1  P1 step 1 lands the contract YAML (section 5.1) as one commit
         P2a, P3, P4 start at once against section 5; they need not wait for step 1
Stage 2  P1 (rest)  |  P2a  |  P3  |  P4  |  P5 diagram only        all at once
Stage 3  P1 done and its render check green
         P2b rerun, alone: nobody edits data/, docs/rules/ or docs/adr/ while it runs
         P3 re-runs its data tests on the real YAML; P5 writes its text pages
Stage 4  a retune decider rules on the report (a batch 17, outside this plan);
         any value it moves is applied to data/ and the chapters by a P1 follow-up,
         and to Foundry by a P3 follow-up
Stage 5  P6 packet, last, from the rules as they then stand
```

**Which packages run at once.** P1, P2a, P3, P4, and P5's diagram run together in stage 2. P2b runs alone with respect to `data/`, `docs/rules/`, and `docs/adr/`: P3, P4, and P5 may keep working during it, because the simulator's rules snapshot does not hash `foundry/` or `site/`. P6 runs after everything.

**The simulator must not run while YAML is being edited.** It reads every rule from `data/` when it starts and hashes `data/`, `docs/rules/`, and `docs/adr/` at its start and end (`tools/sim/README.md`, "The rules snapshot"). A run that overlaps a P1 edit reads half a rule. So: P2a makes **no** full run and **no** `--scale` run; it tests on fixtures (section 5.4). P2b starts only when P1 has reported done, and every other package keeps out of those three folders until P2b reports its run finished.

## 3. File ownership

Every path is relative to the repository root. "New" marks a file the package creates.

### P1: rules data and chapters

Owns:
- `data/engagement/zones.yaml` (new), `positions.yaml`, `anchor-ratings.yaml`, `size-classes.yaml`, `titan-format.yaml`, `titan-harm.yaml`, `attention.yaml`, `behavior-procedure.yaml`, `engagement-setup.yaml`, `engagement-flow.yaml`, `background-titans.yaml`, `grab.yaml`, `round.yaml`, `squad-tactics.yaml`, `read.yaml`
- `data/harm/engagement-end.yaml`, `effect-types.yaml`, `treat-injury.yaml`, `sheet-fields.yaml`
- `data/gear/falls.yaml`, `carrying.yaml`, `horses.yaml`, `odm-gear.yaml`, `sheet-fields.yaml`, `field-repair.yaml`
- `data/character/action-catalog.yaml`, `talents.yaml`, `enlistment.yaml`
- `data/core/bonus-dice-sources.yaml`, `stress-changes.yaml`, `circumstances.yaml`, `dice-pool.yaml`
- `data/mind/fear-rolls.yaml`, `stress-responses.yaml`
- `data/expedition/hazards.yaml`, `route.yaml`
- `data/skirmish/skirmish.yaml` (only its line on Talents that read a Position step, if it needs one)
- `data/titans/index.yaml`, `sprinting-abnormal.yaml`, `standard-small.yaml`, `standard-medium.yaml`, `standard-large.yaml`
- `docs/rules/01-core-rules.md`, `03-harm-and-mind.md`, `04-gear.md`, `05-titan-engagement.md`, `06-standard-titans.md`, `07-playtest-rules.md`, `PROGRESS.md`, `OPEN-QUESTIONS.md` (from stage 2 on; the decider wrote OQ-200 to OQ-202)
- `CONTEXT.md`
- `tools/render/render.py`

Does: step 1 first (section 5.1 exactly, one commit). Then every YAML reader of a Position, a step, the Anchors count, or a named Titan, per 16-2 to 16-33, then the chapters: Chapter 5 sections 5.1, 5.2 (the field, attachments, the derivation table, moves, the Flight, the revised closed list, the zone diagram drawn by hand as the Position maps were), 5.4 and 5.5 (the Stride step and `stride`), 5.6, 5.7, 5.10, 5.11, and 5.13 (every tuned figure marked stale until the rerun, as batch 13 marked them); smaller edits in Chapter 1 (1.1's list of what the GM applies as written gains the Stride; 1.5 and 1.8 read zones), 3, 4, 6 (each stat block gains Stride; Run Past and Heavy Tread gain the holder's-zone note), and 7 (the Waypoint's field rating; hazard placements). `render.py` gains a renderer for `zones.yaml` (the layouts, the attachments, the derivation, the Carry costs) and for `size-classes.yaml`'s `stride`, and `render.py check` passes.

Must not touch: `tools/sim/`, `tools/probes/`, both `tuning.yaml` files, `data/titans/probe-figures.yaml`, `docs/reviews/`, `foundry/`, `site/`, the packet, `docs/adr/`, and batch 16. Never runs the simulator.

### P2a and P2b: simulator

Owns:
- `tools/sim/**` (`engine.py`, `rules.py`, `policy.py`, `cases.py`, `families.py`, `targets.py`, `report.py`, `run.py`, `recheck.py`, `barcheck.py`, `dice.py`, `README.md`, `results/**`, and new `space.py` and `test_space.py`)
- `tools/probes/**`
- `data/engagement/tuning.yaml`, `data/titans/tuning.yaml`, `data/titans/probe-figures.yaml`
- `docs/reviews/simulator-report.md`

P2a does (E8): `space.py` (section 5.4), then the engine reads it: each soldier's `zone` and `attach`, each Titan's `zone`, derived Positions, the Stride step in `titan_card`, the Flight across zones with Carry costs and the limit, the crossing flag, the mounted pace, wrecks by zone, the Momentum cap by zone, leaving from edge zones, the retreat of 16-27, entry zones, and field generation with the terrain mix. The policy learns routes: the shortest-Momentum route to the Blind Spot, when to cross a Titan's zone, and when to spend Quiet. New `simulator_cases` rows for 16-38's figures go into `data/engagement/tuning.yaml`. Tests: `test_space.py` on the fixture cases of section 5.5 and on a hand-built `R` stub; no case run.

P2b does (E7): one full run after P1 is done, then `--report`. It reports every figure 16-38 lists and the OQ-200 and OQ-202 sensitivity rows. It amends nothing: ADR-0014, the bands, and any value the report argues for go to the retune decider.

Must not touch: every P1 file, `docs/adr/`, `foundry/`, `site/`, the packet. P2a never runs `run.py` in any mode.

### P3: Foundry rules engine and tracker

Owns:
- `foundry/src/rules/engagement/**`: `positions.ts` (rewritten around zones), `types.ts`, `momentum.ts`, `retreat.ts`, `attention.ts`, `cards.ts`, `strikes.ts`, `grab.ts`, `titan-death.ts`, `closing.ts`, `round.ts`, `guard.ts`, `fear.ts`, `harm-rolls.ts`, `injury.ts`, `card-trust.ts`, `skirmish.ts`, and new `zones.ts`, `stride.ts`, `field.ts`
- `foundry/src/rules/titan.ts`, `statuses.ts`, `derived.ts`
- `foundry/src/tracker/**`: every file, including `snapshot.ts`, `engine.ts`, `setup.ts`, `view.ts`, `badges.ts`, `hud.ts`, `board.ts` (the ledger window; its name stays), `components/Board.svelte` (the ledger, whose left page becomes the field readout, 16-35), `components/Hud.svelte`, `components/Setup.svelte` (the field builder: size, field rating, terrain mix, named zones), `components/Clock.svelte`
- `foundry/src/models/**`, `foundry/src/sheets/**` (the Titan sheet shows Stride; the soldier sheet shows zone and attachment)
- `foundry/tools/config-data.ts`, `check-data.ts`, `build-packs.ts`
- `foundry/static/lang/en.json`, `foundry/static/styles/tracker.css`
- `foundry/test/**` except `board.test.ts` and `art.test.ts`
- `foundry/docs/tracker-plan.md`, `foundry/wording/**`

Does: the zone model, derivation, moves, Flight, Stride, wrecks, retreat, entry zone, and field generation in the rules layer (pure functions, no documents), with tests on section 5.5's cases; the combat and actor model fields of section 5.3; the snapshot of section 5.3; the engine API and the board events of section 5.3; every reader of `positions`, `anchors`, `wrecks`, `comparisonLabel`, and `nearEachOther` moved to zones; Direct Control setters for zone, attachment, Titan zone, and zone rating (ADR-0028), each logged as a ruling and undoable; `setAnchorRating` replaced by `setZoneRating`.

Must not touch: `foundry/src/board/**`, `foundry/src/art.ts`, `foundry/src/index.ts`, `foundry/static/system.json`, `foundry/static/lang/en-board.json`, `foundry/static/styles/board.css`, `foundry/static/assets/**`, `data/`, `docs/`, `site/`, `tools/`.

### P4: Foundry engagement board

Owns:
- `foundry/src/board/**` (new): the PIXI application, layout and isometric projection, tiles, rims, figures, effects, the Attention line, the Flight arc and Stride animations, hover, drag and drop, Direct Control's look
- `foundry/src/art.ts` (adds `boardPath()` and its helpers, section 5.3)
- `foundry/src/index.ts` (one import and one register call)
- `foundry/static/system.json` (adds `styles/board.css` and a second `en` language entry, `lang/en-board.json`)
- `foundry/static/styles/board.css` (new), `foundry/static/lang/en-board.json` (new)
- `foundry/test/board.test.ts` (new), `foundry/test/art.test.ts`
- `foundry/design/asset-inventory.md` (the board's section)

Does: 16-34 and ADR-0027 as amended. The board is a renderer over `snapshot(combat)` and holds no rule state. It mounts full-bleed over the canvas area while a Titan Engagement has a field, hides the scene canvas, and tears everything down at the end, restoring the canvas. It reads Momentum and gas from the snapshot, motion from `motionMode()` (`foundry/src/settings.svelte.ts`), and Direct Control from `tracker.direct` (`foundry/src/tracker/state.svelte.ts`), all read-only. It acts only through the engine API of section 5.3. Every path goes through `boardPath()`. Check the language merge in Foundry v14 on the first live check: if a second `en` entry does not merge, move the board's strings into a `WOF.Board` block handed to P3 for `en.json`, and drop `en-board.json`.

Must not touch: every P3 file (including `snapshot.ts`, `engine.ts`, `state.svelte.ts`, `settings.svelte.ts`, `en.json`), `foundry/static/assets/**` (the art is shipped and locked), `foundry/tools/import-art.sh`, `data/`, `docs/`, `site/`, `tools/`.

### P5: site

Owns:
- `site/src/content/rules/fighting-titans.mdx`, `site/src/content/gm/running-a-titan-fight.mdx`, `site/src/content/gm/titans.mdx`, `site/src/content/gm/tuning-the-fight.mdx`
- `site/src/content/updates/` (one new entry for zone combat)
- `site/src/components/PositionsMap.astro`, `PositionShapes.astro`, `ZoneField.astro` (new, the zone diagram: the 13 layout numbered, a Titan in the centre, the Squad's start zone, the attachments drawn on the vertical axis, a Flight crossing a Titan's zone, a Stride)
- `site/src/lib/engagement-tables.ts`, `gm-tables.ts`, `gm-screen.ts`, `shared-data.ts`, and their tests
- `site/src/scripts/gm-screen/controller.ts`, `site/src/pages/gm/screen.astro`
- `site/scripts/check-sync.mjs` (only if `zones.yaml` must join its list)

Does: the Chapter 5 pages from P1's chapter and data, the diagram from `zones.yaml`'s layouts, the GM screen's Position lookup replaced by the derivation and the Carry costs. `pnpm build` passes, links included.

Must not touch: `data/`, `docs/`, `CONTEXT.md` (the glossary page reads it), `foundry/`, `tools/`, `site/design/`, `site/src/assets/`.

### P6: packet

Owns: `docs/playtest/wings-of-freedom-playtest-packet.html`.

Does: the Titan Engagement section, the quick reference, the map, and the printable field page of 16-36, from the rules as they stand after stage 4. Must not touch anything else.

### Not a package

`docs/playtest/feedback/round-3/ASSESSMENT.md`, `CONTINUATION-HANDOFF.md`, `docs/playtest/HANDOFF.md`, and this plan belong to the orchestrator, who records progress. `docs/adr/` and `DECISIONS-2026-09-14.md` belong to deciders; no package edits them.

## 4. What each package must hold constant

- No package reopens a settled value: fields 13, 7, 19; Stride 1, 2, 2, 3; Carry costs 2, 1, 0; wreck on the Titan's own zone only; derived Positions. The provisional values (OQ-200, OQ-202, and OQ-201's none) are read from the data, never hard-coded.
- The Foundry rules layer and the simulator implement the same procedure and must agree on every case in section 5.5.
- The board never decides a rule. If it needs a fact the snapshot lacks, P4 asks P3 for a snapshot field; it does not compute one.

## 5. Contracts

### 5.1 `data/engagement/zones.yaml` (P1 step 1)

Keys and value shapes exactly as below. Text values (`>-`) are P1's to word from batch 16; the keys, ids, numbers, and list shapes are fixed.

```yaml
id: zones
name: The Field, Zones, and Attachments
chapter: 05-titan-engagement
adrs: [ADR-0010, ADR-0024, ADR-0029]
decided: [OQ-200, OQ-201, OQ-202]

coordinates:
  system: axial-flat-top
  neighbour_offsets: [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]   # [dq, dr]
  distance: >-            # (|dq| + |dr| + |dq + dr|) / 2
  numbering: >-           # column by column from the left, top to bottom (r ascending) in a column
  ring: >-                # distance from the centre zone

fields:
  default: standard
  sizes:
    - id: skirmish
      name: Skirmish field
      use: >-
      centre: 4
      squad_start: 5
      zones:
        - {n: 1, q: -1, r: 0}
        - {n: 2, q: -1, r: 1}
        - {n: 3, q: 0, r: -1}
        - {n: 4, q: 0, r: 0}
        - {n: 5, q: 0, r: 1}
        - {n: 6, q: 1, r: -1}
        - {n: 7, q: 1, r: 0}
    - id: standard
      name: Standard field
      use: >-
      centre: 7
      squad_start: 8
      zones:
        - {n: 1, q: -2, r: 0}
        - {n: 2, q: -2, r: 1}
        - {n: 3, q: -2, r: 2}
        - {n: 4, q: -1, r: 0}
        - {n: 5, q: -1, r: 1}
        - {n: 6, q: 0, r: -1}
        - {n: 7, q: 0, r: 0}
        - {n: 8, q: 0, r: 1}
        - {n: 9, q: 1, r: -1}
        - {n: 10, q: 1, r: 0}
        - {n: 11, q: 2, r: -2}
        - {n: 12, q: 2, r: -1}
        - {n: 13, q: 2, r: 0}
    - id: set-piece
      name: Set piece
      use: >-
      centre: 10
      squad_start: 11
      zones:   # q -2: r 0..2 -> 1..3; q -1: r -1..2 -> 4..7; q 0: r -2..2 -> 8..12; q 1: r -2..1 -> 13..16; q 2: r -2..0 -> 17..19
        - {n: 1, q: -2, r: 0}
        # ... every one of the 19 listed in full
edge_zone: >-
off_field: >-
occupancy: >-

attachments:
  - {id: ground,     names_body: false, free: true,  derives: null,         text: >-}
  - {id: anchored,   names_body: false, free: true,  derives: null,         text: >-}
  - {id: on-body,    names_body: true,  free: false, derives: on-body,      text: >-}
  - {id: blind-spot, names_body: true,  free: false, derives: blind-spot,   text: >-}
  - {id: grabbed,    names_body: true,  free: false, derives: on-body,      text: >-}
  - {id: pinned,     names_body: true,  free: false, derives: in-reach,     text: >-}
states_beside_the_attachment: [airborne, mounted, carried]
detach_rule: >-

derivation:
  order:   # first row that applies, for one soldier and one body (a Focus Titan or corpse)
    - {id: attached-on-body, when: attachment on-body or grabbed names the body, position: on-body}
    - {id: attached-blind-spot, when: attachment blind-spot names the body, position: blind-spot}
    - {id: pinned-under, when: attachment pinned names the body, position: in-reach}
    - {id: same-zone, when: in the body's zone, position: in-reach}
    - {id: other-zone, when: in another zone, position: distant}
  off_field: >-            # no Position
between_soldiers:
  same_position: same-zone
  position_steps: zones    # one step = same or adjacent zone; n steps = within n zones

moves:
  zone_step: >-
  attachment_step: >-
  entered_zone_reads: >-   # the rating's distant to in-reach row: on_foot, mounted = may enter; odm = a Flight may end free in it
  on_foot: {steps: 1}
  mounted: {zone_steps: 2, attachment_steps: 0, ends_on_entering_a_standing_focus_titans_zone_unless_open: true}   # OQ-200
  down_soldier: >-
  letting_go: >-

flight:
  first_step_cost: 0
  carry_cost_into_zone: anchor-ratings.yaml ratings[].carry_cost
  carry_cost_off_field: 1
  carry_cost_attachment_step: 1
  carry_limit: 2           # OQ-200
  ends_free_in_open: false
  ends_free_as: anchored
  momentum_gain_cap: departure-zone
  momentum_trim: arrival-zone
crossing_flag: >-

stride:
  step: behavior-procedure.yaml resolving_a_card stride
  toward: attention-holder
  tie_break: lowest-numbered
  stops_on_entering_holders_zone: true
  grounded: 0
  moves_with: [on-body, grabbed]
  leaves: [blind-spot]
  harms: false
  wrecks: false

placement:
  focus_titan: centre
  squad: squad_start
  named: {in-reach: focus-titans-zone, distant: squad_start}

entry_zone:
  rule: >-
  order: [holds-no-soldier, farthest-from-nearest-soldier, lowest-numbered]
  fallback: [fewest-soldiers, lowest-numbered]

effects:
  - {id: steam, where: >-, harm: none, art: fx-steam}
  - {id: dust,  where: >-, harm: none, art: fx-dust}
  - {id: fire,  where: none, harm: none, art: fx-fire, reserved: true}   # OQ-201
effect_crossing: >-

elevation: >-
named_field_format: >-     # field: {size: <fields.sizes id>, rating: <rating id>, zones: {<n>: <rating id>}}
gm: >-
```

### 5.2 New and changed fields in other YAML (P1 step 1)

- `data/engagement/anchor-ratings.yaml`, each row of `ratings` gains:
  - `carry_cost`: open 2, sparse 1, wooded 0, urban 0, giant-forest 0
  - `sparser`: open open, sparse open, wooded sparse, urban wooded, giant-forest wooded
  - `denser`: open sparse, sparse wooded, wooded giant-forest, urban urban, giant-forest giant-forest
  - and `anchors` keeps its values, now read per zone.
  `momentum.spends.carry.giant_forest` and `mounted_charge.open_double_step` are deleted; the `anchors` block is reworded per 16-4 and 16-20 in stage 2, keeping the key.
- `data/engagement/size-classes.yaml`: `fields.stride`, and `stride` on each class: small 1, medium 2, large 2. `unmeasured` gains "stride for every class".
- `data/engagement/titan-format.yaml`: `stat_block.fields.stride`; `standard_titan` names stride among the Size Class values.
- `data/titans/sprinting-abnormal.yaml`: `stride: 3`, after `heave`.
- `data/engagement/engagement-setup.yaml`: steps `field-size`, `field-rating`, `zone-terrain`, `focus-titan`, `background-titans`, `retreat-clock` (the `anchors` step deleted); the table `anchor_rating` keeps its key and is the field rating's roll; new table:
  ```yaml
  zone_terrain:
    roll: D6
    applies_to: every zone but the centre and the Squad's start zone, in number order
    rows:
      - {results: [1], rating: sparser}
      - {results: [2, 3, 4, 5], rating: field}
      - {results: [6], rating: denser}
  ```
- `data/engagement/behavior-procedure.yaml`: `resolving_a_card.steps` gains `{id: stride}` between `attention` and `choose`.
- `data/gear/sheet-fields.yaml`: the `positions` field becomes `zone` and `attachment` (stage 2).

### 5.3 TypeScript (P3 provides, P4 and tests consume)

New `foundry/src/rules/engagement/zones.ts`:

```ts
export type ZoneId = number;
export type FieldSize = 'skirmish' | 'standard' | 'set-piece';
export type AttachmentKind = 'ground' | 'anchored' | 'on-body' | 'blind-spot' | 'grabbed' | 'pinned';
export interface Attachment { kind: AttachmentKind; body: string | null }   // body: a TitanRow label
export type ZoneEffectId = 'steam' | 'dust' | 'fire';
export interface ZoneCell { n: ZoneId; q: number; r: number }
export interface ZoneState extends ZoneCell { rating: string; start: string; graceUsed: boolean; effects: ZoneEffectId[] }
export interface FieldState { size: FieldSize; rating: string; centre: ZoneId; squadStart: ZoneId; zones: ZoneState[] }
export interface Placement { zone: ZoneId | null; attachment: Attachment }   // zone null: off field

export function layoutOf(size: FieldSize): { centre: ZoneId; squadStart: ZoneId; zones: ZoneCell[] };
export function zoneDistance(field: FieldState, a: ZoneId, b: ZoneId): number;
export function neighbours(field: FieldState, n: ZoneId): ZoneId[];   // ascending
export function isEdge(field: FieldState, n: ZoneId): boolean;
export function ringOf(field: FieldState, n: ZoneId): number;
export const isFree: (a: Attachment) => boolean;
export function derivePosition(s: Pick<SoldierState, 'zone' | 'attachment' | 'alive' | 'left'>, body: Pick<TitanRow, 'label' | 'zone'>): Position | undefined;
export function derivePositions(s: Pick<SoldierState, 'zone' | 'attachment' | 'alive' | 'left'>, bodies: readonly TitanRow[]): Record<string, Position>;
export function momentumCapAt(field: FieldState, n: ZoneId): number;
export function carryCostInto(field: FieldState, to: ZoneId | 'off' | 'attach'): number;
export function crossedZones(start: ZoneId, entered: readonly (ZoneId | null)[]): ZoneId[];
export function entryZone(field: FieldState, soldierZones: readonly ZoneId[]): ZoneId;
export function wreckZone(field: FieldState, n: ZoneId): { field: FieldState; from: string; to: string; graced: boolean };
export function generateField(size: FieldSize, rating: string, named: Readonly<Record<number, string>>, d6: () => number): FieldState;
```

New `stride.ts`: `export function strideOf(t: TitanRow): number;` (0 when grounded) and `export function strideRoute(field: FieldState, from: ZoneId, to: ZoneId, stride: number): ZoneId[];` (the zones entered, in order; empty when already there or stride 0).

`positions.ts`, rewritten: `export function moveOptions(s: SoldierState, ctx: MoveContext): ZoneMoveOption[];` and `export function moveOptionsFor(snap: Snapshot, soldierId: string): ZoneMoveOption[];` with

```ts
export interface ZoneMoveOption {
  to: Placement;
  kind: MoveKind;              // 'onFoot' | 'mounted' | 'odm'
  steps: Placement[];          // every step in order, the last equal to `to`
  carries: number;             // Carries on a Flight, 0 otherwise
  momentum: number;            // Momentum the Carries cost
  crosses: string[];           // Focus Titan labels the crossing flag would set
  charge: string[];            // Focus Titan labels a mounted charge could flag
  fly: boolean;                // the move is a Flight and will be rolled
  leaves: boolean;             // the last step is off field
}
```

`retreat.ts`: `export function retreatOptions(s: SoldierState, snap: Snapshot): ZoneMoveOption[];` replaces `forcedTargets`.

`types.ts`: `SoldierState` gains `zone: ZoneId | null`, `attachment: Attachment`, `horseZone: ZoneId | null`, and keeps `positions`, which `snapshot()` fills by `derivePositions` and nothing writes. `TitanRow` gains `zone: ZoneId` and `stride: number`. `Snapshot` gains `field: FieldState | null` and loses `anchors` and `wrecks`; `anchor` stays and is the field rating's row.

The combat model (`foundry/src/models/fields.ts`): `combat.system.field` holds a `FieldState`; each soldier's `zone`, `attachment`, and `horseZone`; each Titan row's `zone`; and `combat.system.boardEvent: { seq: number; kind: 'stride' | 'flight' | 'wreck' | 'fall' | 'steam' | 'enter'; data: Record<string, unknown> } | null`, written by the engine **in the same update** as the state change it describes, with `seq` rising by 1 each time. Payloads: `stride {key, from, route}`, `flight {soldier, from: Placement, steps: Placement[]}`, `wreck {zone, from, to}`, `fall {key, zone}`, `steam {key, zone}`, `enter {key, zone}`. Every client sees it through `updateCombat`, so the board animates on every client without a socket of its own.

Engine API in `foundry/src/tracker/engine.ts`, for the board:

```ts
export async function requestZoneMove(combat: any, soldierId: string, option: ZoneMoveOption): Promise<boolean>;  // owner or GM; a Flight prompts the soldier's owner (batch C)
export async function gmPlace(combat: any, soldierId: string, to: Placement): Promise<boolean>;                  // Direct Control, logged as a ruling, undoable
export async function gmPlaceTitan(combat: any, key: string, zone: ZoneId): Promise<boolean>;
export async function gmPlaceHorse(combat: any, soldierId: string, zone: ZoneId | null): Promise<boolean>;
export async function setZoneRating(combat: any, zone: ZoneId, ratingId: string): Promise<boolean>;             // replaces setAnchorRating
export async function letGo(combat: any, actor: any, s: SoldierState): Promise<boolean>;                          // no Titan label argument
export const isTitanEngagement: (combat: any) => boolean;                                                          // exists already
```

The board is active while `isTitanEngagement(combat) && combat.system.field` is set, and it reads state only through `snapshot(combat)` from `foundry/src/tracker/snapshot.ts`.

Art, in `foundry/src/art.ts` (P4):

```ts
export const boardPath = (name: string) => `${ASSETS}/board/${name}.webp`;
export const boardTile = (rating: string, variant: 1 | 2 | 3) => boardPath(`hex-${rating}-${variant}`);
export const boardRim = (rating: string) => boardPath(`rim-${rating}`);
export const boardTitan = (sizeClassOrAbnormalId: string) => boardPath(`titan-${sizeClassOrAbnormalId}`);   // small, medium, large, sprinting-abnormal
export const boardSoldier = (pose: 'standing' | 'hanging') => boardPath(`soldier-${pose}`);
export const boardFx = (effect: 'steam' | 'fire' | 'dust') => boardPath(`fx-${effect}`);
export const tileVariant = (n: number) => (((n - 1) % 3) + 1) as 1 | 2 | 3;
```

### 5.4 Python (P2a provides, the rest of `tools/sim` consumes)

New `tools/sim/space.py`:

```python
class Zone:            # n, q, r, rating, start, grace_used, effects
class Field:           # size, centre, squad_start, zones: dict[int, Zone]
    def distance(self, a: int, b: int) -> int
    def neighbours(self, n: int) -> list[int]      # ascending
    def is_edge(self, n: int) -> bool
    def ring(self, n: int) -> int
def layout(R, size: str) -> Field
def generate_field(rng, R, size: str, rating: str, named: dict[int, str] | None = None) -> Field
def derive_position(soldier, body) -> str | None   # reads soldier.zone, soldier.attach (kind, body label), body.zone
def stride_route(field: Field, start: int, goal: int, stride: int) -> list[int]
def carry_cost(field: Field, R, to) -> int         # to: a zone number, "off", or "attach"
def crossed(start: int, entered: list) -> list[int]
def entry_zone(field: Field, soldier_zones: list[int]) -> int
def wreck(field: Field, R, n: int) -> tuple[str, str, bool]   # (from, to, graced)
def momentum_cap(field: Field, R, n: int) -> int
```

`tools/sim/rules.py` loads, on the rules object `R`: `R.zones` (the parsed file), `R.stride` (by Size Class and by Abnormal id), `R.carry_cost`, `R.sparser`, `R.denser` (by rating id), `R.carry_limit`, `R.mounted_pace`, and `R.zone_terrain`. It raises if any key of section 5.1 or 5.2 is missing, so a P1 edit that drops one fails loudly on the rerun.

### 5.5 Shared cases (P2a's `test_space.py` and P3's `zones.test.ts` both pass them)

On the Standard field:
- `zoneDistance(7, 1) = 2`; `zoneDistance(8, 11) = 3`; `zoneDistance(1, 13) = 4`.
- `neighbours(4) = [1, 2, 5, 6, 7]`; `isEdge(7) = false`; `isEdge(4) = true`.
- `strideRoute(7 to 1, stride 2) = [4, 1]`; `strideRoute(7 to 2, stride 1) = [4]` (tie between 4 and 5 goes to 4); `strideRoute(7 to 2, stride 2) = [4, 2]`; `strideRoute(8 to 11, stride 3) = [7, 9, 11]` (tie between 7 and 10 goes to 7); stride 0 gives `[]`.
- `entryZone` with every soldier in zone 8 is 1 (1 and 11 are both 3 away; 1 is lower).
- A Flight from 8 (Wooded) into 7 (Wooded, a standing Focus Titan), then an attachment step to blind-spot: one Carry, costing 1 Momentum, crossing nothing.
- A Flight from 5 through 7 (a Focus Titan) to 10: crosses 7, sets the loudest flag on that Titan unless quiet is spent; Carry cost is 10's `carry_cost`.
- A Flight may not end free in an Open zone: from 8 into an Open 7 with no Titan, only options that go on out of 7 are legal.
- `wreckZone` on an Urban zone gives Wooded; on a zone whose start rating is Sparse, the first wreck is graced and the second gives Open.
- Derivation: a soldier in 7 with attachment `blind-spot` naming A, with Titan A in 7 and Titan B in 7, holds blind-spot relative to A and in-reach relative to B; after A strides to 4 they are anchored in 7 (if airborne) and hold distant relative to A.

## 6. Checks each package runs before it reports done

| Package | Checks |
|---|---|
| P1 | `uv run --with pyyaml python tools/render/render.py check`; every YAML file parses; a grep of `data/` and `docs/rules/` for `close_rule`, `comparison`, `the Focus Titan the move named`, `Anchors left`, and `first step a Flight Carries` finds only history. No simulator run |
| P2a | `uv run --with pyyaml python -m pytest tools/sim/test_space.py` (or the file run directly); no `run.py` |
| P2b | `uv run --with pyyaml python tools/sim/run.py`, then `--report`; the report lists every 16-38 figure |
| P3 | `pnpm typecheck`, `pnpm test`, `pnpm check:data`, `pnpm build` in `foundry/`; one live check at the end, not per step |
| P4 | `pnpm typecheck`, `pnpm test` (its own tests), `pnpm build`; one live check at the end with the board up for a whole engagement at Full, Reduced, and Off, and Direct Control on |
| P5 | `pnpm test` and `pnpm build` in `site/` |
| P6 | the packet opens, prints the field page at A4 landscape with hexes at least 45 mm across, and every number in it matches the data |
