# Continuation handoff: round 3, and everything left to do

Written 2026-09-20 for a session picking this work up on the owner's own machine. It assumes none of
the conversation that produced it. Everything you need is in this repository; this file says which
parts and in what order.

Companion file: `ART-HANDOUT.md` in this folder is the art brief and is self-contained. This file
covers everything else and points at it where they meet.

---

## 1. What this project is, in a paragraph

Wings of Freedom is a private Attack on Titan tabletop RPG on the Year Zero Engine, shipped three
ways from one source of truth: the rulebook chapters in `docs/rules/`, a public website in `site/`
(Astro, on Vercel), and a Foundry VTT v14 system in `foundry/`. **Every table is YAML in `data/`
(ADR-0012)**, and the chapters, the site and the system all render from it rather than restating it.
The architecture decisions are in `docs/adr/`, the glossary and terms in `CONTEXT.md`, and the
process conventions in `docs/playtest/HANDOFF.md`. Read that last one before you touch the packet or
run a review; it is binding.

## 2. Where this session got to

Branch `claude/feedback-review-rule-changes-2485xv`, **pull request #19**, 17 commits, 116 files,
+6935/-543. Pushing to the branch updates the PR.

The owner ran the first session at the table and gave feedback. This session turned it into
**decision batch 13 (OQ-190 to OQ-194)** and applied it across all surfaces, using seven parallel
subagents partitioned by file ownership.

**The authoritative record is `OWNER-DECISIONS.md` in this folder.** It is what was settled and why.
`ASSESSMENT.md` holds the analysis behind each decision, `zone-combat-design.md` the design for the
work that has not started, and `OWNER-FEEDBACK.md` the owner's words verbatim. If this file and
those disagree, those win.

### What landed

- **Health** is `2 + (strength + agility) / 2` rounded up. An untreated Critical Injury still crosses
  off exactly one box and no damage value changed, so the entire rule change is one line.
- **Position clarity**, which changed no rule and stated several for the first time: a closed
  14-row list of what changes a Position, headed by "an action never changes a Position"; Blind Spot
  described everywhere as anchored to terrain *behind* the Titan and not on it; a sentence on the
  Nape strike; and three diagrams of the Position map, one per shape of Anchor Rating.
- **Retargeting**: a Titan whose Attention holder cannot meet a rolled entry's Position requirement
  re-runs the Attention Ladder over the soldiers who can, and its Attention moves, instead of
  falling to Thrash.
- **Frenzy**: each Focus Titan starts at 0, rises 1 at a new round-end step to a cap of 3, and adds
  it to its behavior roll, counted as of the moment the Next Behavior is rolled.
- **Foundry**: the prompt card (steam, falls, Critical Injuries, Gas Rolls and the Flight now roll on
  the affected player's client), GM Direct Control with ten logged setters, Momentum pips, Openings
  and Body Part chips on Titan tokens, the hooked-in badge, terrain-aware move menus, an eight-box
  Health row, Frenzy as a rising track.
- **Site**: rules and GM guides updated, and a player-facing changelog at `/updates/`.
- **Packet**: all of the above, plus the three Position-map diagrams.

### The state of the tree

Green as of the last commit: Foundry typecheck clean, **407 of 407** tests, packs build, `check:data`
passes, every rendered block matches its data, and the site's build, links, tests and sync check all
pass. PR #19 is mergeable and its one check (Vercel Preview Comments) is green.

---

## 3. What is left, in the order to do it

### 3.1 A review round (do this first, it is cheap and it gates the rest)

`docs/playtest/HANDOFF.md` "Feedback loop" step 3 says a rule change gets a `wof-reviewer` round, up
to three, and this change has had none. It is large and includes two genuinely new Titan rules, which
is exactly what an adversarial reviewer is for.

Run `wof-reviewer` with `model: opus` over the round 3 change. Copy
`docs/playtest/process/packet-review-task-template.md` and update its round and prior-review lines.
Findings go in a `REVIEW-FIX-PLAN` in this folder and are applied by package, as round 1 did.

Do this **before** the retune: if the reviewer finds something structural in retargeting or Frenzy,
you would rather know before building a simulator model of the wrong rules.

### 3.2 The retune (the largest remaining package)

This is a build, not just a run. **`tools/sim` has no concept of Frenzy or retargeting**, so it
cannot measure either yet. Work:

1. Teach `tools/sim/engine.py` (and whatever in `rules.py` reads behavior resolution) the two rules:
   the behavior roll is D6 plus the Titan's Frenzy clamped to the table's highest claimed result, and
   a holder who fails the Position requirement causes the Ladder to be re-run over the qualifying
   soldiers rather than a fall to Thrash.
2. Run `uv run --with pyyaml python tools/sim/run.py`. About 9 minutes, fixed seeds. It rewrites
   `tools/sim/results/results.json` and the report. **Do not run it while anything is editing the
   YAML.**
3. Regenerate and read `docs/reviews/simulator-report.md`.

**What the numbers are for.** Two opposite forces landed together and nobody has measured the net:
Health +2 pulls lethality down hard (two extra Critical Injuries survived by every build), and
retargeting plus Frenzy push it back up by converting wasted Thrash cards into Bites and Grabs. Read
the Medium death band first; it sat at 0.058 against a cap of 0.06 before any of this.

**The decision the report drives**, already settled in `OWNER-DECISIONS.md` and not to be reopened:
lethality goes back on the Titans through behavior, not on Health, and **Attack Dice, Nape Depth and
Tempo are held in reserve** behind the report. Only if batch F fell short do they move. Likewise the
Skirmish: the Coriolis rider already exists (`data/skirmish/skirmish.yaml`,
`damage.amount.per_net_success_beyond_the_first: 1`), so a musket still Downs a Health 6 Rookie at 3
Net Successes; if the report says firearms stopped frightening anyone, the preferred lever is that
rider from 1 to 2, ahead of the musket's base damage.

Every figure in `docs/reviews/simulator-report.md`, `data/engagement/tuning.yaml`,
`data/titans/tuning.yaml` and `data/titans/probe-figures.yaml` is marked stale until this runs.

### 3.3 A renderer for the Position maps

`data/engagement/anchor-ratings.yaml` gained a `position_maps` block, but `tools/render/render.py`
has no renderer for it, so **Chapter 5 draws the three diagrams by hand**. That bends ADR-0012, which
wants the chapter rendered from the data, and hand-drawn diagrams drift silently. The site already
does this correctly: `site/src/components/PositionShapes.astro` derives its figure from the Anchor
Rating step rows, so copy that approach. Verify with
`uv run --with pyyaml python tools/render/render.py check`.

### 3.4 Batch 1 art

Four assets, on the machine with the Codex CLI. `ART-HANDOUT.md` section 0 has the exact message to
paste and is self-contained. Three of the four unblock interface work that has already shipped and is
currently drawing state with no icon.

### 3.5 Print verification for the packet

The packet's three new diagrams and its eight-box Health row were verified by rule inspection and
arithmetic, because **no browser was available in the session that made them**. Open
`docs/playtest/wings-of-freedom-playtest-packet.html`, print-preview it, and check the diagrams and
the Health row survive the page breaks. The packet is republished as an Artifact by the owner, not by
an agent; read it first with the Artifact tool and publish with `url` set so the link is kept.

### 3.6 Batch E: zone combat

**Done on 2026-09-21** (PR #20), after the owner played batches A and F. ADR-0029, decision batches 16 and 17,
`IMPLEMENTATION-PLAN-E.md`, `docs/reviews/zone-retune-decisions.md`, and two review rounds
(`docs/reviews/zone-combat-review-1.md`, `-1-impl.md`, `-2.md`). The confirming run has 0 missed results and
closed OQ-199. Open: OQ-203 to OQ-207 (provisional), a live Foundry check of the board, and republishing the
packet Artifact. The text below is the plan as it stood before the work.


The whole package, designed and settled but deliberately not started: ADR-0029, a new
`data/engagement/zones.yaml`, the rewrite of `positions.yaml` around zones with the four Position
names derived from zone plus attachment, the Stride, the canvas board, and its own retune.

**It is gated on batches A and F being played**, not on anything technical. Zones change the tempo of
every fight, so its numbers have to build on A and F's measured ones. The art is the only part that
starts early, for lead time. The full design, including the Stride and the board, is in
`zone-combat-design.md`; sections 3 and 7 are the two that matter most.

---

## 4. Things this session learned that are written nowhere else

These cost real time to find. They are the reason this file exists.

**The Foundry badge layer inverts its icons.** `foundry/src/tracker/badges.ts` applies a PIXI
`ColorMatrixFilter.negative()`. So any new badge icon must be flat ink on transparent, like the
existing `pos-*` family, and never the dark-disc `status-*` style, and it must be proofed at 20px
rather than 32. This is in `ART-HANDOUT.md` too.

**The loader pins rule text as exact string literals.** `foundry/tools/data/schemas.ts` holds the
Health formula and the round's end-step order as `z.literal(...)`. Change either rule in the data and
**every** `loadTables` call throws until the schema is updated. It is a deliberate tripwire, but it
looks like a mysterious total failure the first time.

**A plate's `art` prop is only a slot name.** In the site, `art` sets `data-art-slot` so an art pass
can find every frame; the actual image arrives through a separate optional `image` prop. A page with
no image renders an empty figure with its aria-label and **the build still passes**. So a missing
plate is invisible to CI. The Updates page is in exactly that state until batch 1 art lands.

**An unquoted colon in YAML silently becomes a map.** A sentence like `It does not move you: you are
still at Blind Spot` inside a plain scalar in a list parses as a key/value pair, not a string. It
does not throw; the loader just gets the wrong type. This bit the Compendium wording once this
session. Quote the scalar or reword.

**The site's sync check only warns.** `site/scripts/check-sync.mjs` compares each page's recorded
git blob shas against the files now and prints a "needs resync" list, but never fails the build.
After changing `data/**` or `docs/**`, refresh the shas with `git hash-object` and re-run it.

**Chapter 6's Behavior Tables were silently short for three batches.** The probe renderer
`tools/probes/chapter-06/render.py` had no `effect_text` branch for the `wreck` effect added in batch
10, so it raised instead of rendering, its `render.py check` had been failing, and six table rows
never showed the effect. Fixed this session. The lesson is that a failing check in `tools/` hides
content bugs, not just tooling ones.

**Agent reports need verifying.** Three separate claims from subagents this session were worth
checking and two were wrong or incomplete: one said `checkTrackerPermission` "never appeared" when it
is at `guard.ts:65`; one flagged a rules contradiction that was real; one flagged a third item that
was a non-issue, resolved by `data/harm/effect-types.yaml` line 331. Check before acting.

---

## 5. How to run everything

```bash
# data and chapters, from the repository root
uv run --with pyyaml python -c "import yaml, glob; [yaml.safe_load(open(f)) for f in glob.glob('data/**/*.yaml', recursive=True)]"
uv run --with pyyaml python tools/render/render.py check      # 'write' to regenerate
uv run --with pyyaml python tools/probes/chapter-06/render.py check
uv run --with pyyaml python tools/probes/chapter-06/run6.py check

# the simulator: about 9 minutes, fixed seeds, never while YAML is being edited
uv run --with pyyaml python tools/sim/run.py

# the Foundry system
cd foundry && pnpm typecheck && pnpm test && pnpm run check:data && pnpm run build

# the site
cd site && pnpm install --frozen-lockfile && pnpm run sync-check && pnpm run build && pnpm test
```

## 6. If you run parallel agents again

The split this session used worked: **typecheck came out clean on the first run** across four agents
editing one Foundry tree concurrently. What made it work:

- **Partition by file, not by feature**, and give every agent an explicit list of what it owns and
  the names of the agents owning the rest. Features overlap; files do not.
- **Pin the cross-boundary API in every brief** before anyone writes code. Two agents independently
  produced matching call sites for ten setters because the names were fixed up front.
- **Route a shared file to one owner.** Language strings would have collided, so one agent wrote its
  new keys to a side file and the owner merged them.
- **Forbid repo-wide typecheck and the simulator while agents run.** An agent running typecheck sees
  the others' half-finished work and starts fixing things it does not own. Verify centrally at the
  end instead.
- **Leave gaps to the coordinator.** Files no agent owned (`tools/`, `schemas.ts`, `snapshot.ts`)
  became the coordinator's, which is fine as long as somebody notices they are unowned.
