# Playtest packet handoff

State on 2026-09-15: Phase 1 is complete (`docs/rules/PROGRESS.md`). **Owner feedback round 1 is applied and the packet is republished (Artifact Version 2).** The round's decisions are in `docs/playtest/feedback/round-1/` (`OWNER-DECISIONS.md`, `IMPLEMENTATION-PLAN.md`, `REVIEW-FIX-PLAN.md`) and decision batches 7 and 8 (8-1 to 8-42). The final review (Opus plus Codex gpt-6-astra) was fixed, and the simulator is verified (final rerun, plus targeted checks for 8-40). **On 2026-09-16 the owner made GM judgment valid** (research in `docs/research/gm-judgment/`, decisions batch 9, ADR-0024 superseding ADR-0003), and the change is applied, reviewed over three rounds (Opus with Codex gpt-6-astra for rounds 1 and 2, Opus with Fable for round 3, after the owner stopped the Codex reviews), and republished as Artifact **Version 3**. The next work is the owner's review of Version 3, then the first playtest (4 PCs, no Squadmates). Items deferred until after the playtest are listed in PROGRESS.md. Do not start Phase 2.

## Where things are

| What | Path |
|---|---|
| Packet (single HTML file) | `docs/playtest/wings-of-freedom-playtest-packet.html` |
| Published Artifact | https://claude.ai/artifact/WoUmYA8rYpDnoB9skQdsEq |
| Drafter brief: structure and voice | `docs/playtest/process/packet-brief.md` |
| Review brief: checks and severity | `docs/playtest/process/packet-review-brief.md` |
| Review task template (last used for round 3) | `docs/playtest/process/packet-review-task-template.md` |
| Codex review runner | `tools/codex/run-review.sh` |
| Packet reviews | `docs/reviews/playtest-packet-review-1.md` to `-3.md`, each with `-codex.md`; `-3-fable.md` |
| Progress, open questions, decisions | `docs/rules/PROGRESS.md`, `docs/rules/OPEN-QUESTIONS.md` (149 entries), `docs/rules/DECISIONS-2026-09-14.md` (through batch 8, item 8-14) |
| Simulator and report | `tools/sim/`, `docs/reviews/simulator-report.md` |

## Feedback loop

1. **Collect.** The owner leaves comments on the Artifact page or gives a list. Read Artifact comments with the Artifact tool (`action: "comments"` with the URL above).
2. **Triage each note.**
   - **Packet only** (wording, layout, order, examples, voice): wof-drafter edits the packet.
   - **Rule change:** a Fable decider records it as a new batch in DECISIONS, amends an ADR or `CONTEXT.md` if needed, and logs an OQ entry. wof-drafter then changes chapter prose and YAML together and runs the render checks. If the rule touches anything the simulator measures, rerun the simulator and regenerate its report. Update the packet last.
   - **Question the sources do not answer:** the Fable decider decides it first.
3. **Review.** wof-reviewer (pass `model: opus`) and a Codex review run in parallel. Copy the task template and update its round and prior-review lines. At most 3 rounds; after the last round's fixes, a narrow Fable check (`-fable.md`) confirms only those fixes.
4. **Republish.** Before publishing from a new session, read the Artifact (`action: "read"` with the URL), then publish the packet file with `url` set to keep the same link.
5. Keep `docs/rules/PROGRESS.md` current (the "Playtest packet" row).

## Orchestration rules

- **Round 1 feedback (owner, 2026-09-15):** research and owner decisions are in `docs/playtest/feedback/round-1/`; read `OWNER-DECISIONS.md` first. For these fixes, implementation runs on Opus, research on Opus or Fable as the task needs, and the final review on Fable. After that review, fix every issue it raises. A Fable decider decides as needed. This overrides the review models below for this work. **Later the same day (Fable quota low):** use Fable only when needed. Routine rulings go to an Opus decider. Fable is kept for rulings that reopen an ADR or tuning, and for disputed Critical or Major findings. The final review runs on Opus (wof-reviewer, `model: opus`) and, in parallel, a Codex CLI gpt-6-astra review (`tools/codex/run-review.sh <slug> <round> <task-file> gpt-6-astra astra`), with narrow Fable escalations only for disputed Critical or Major findings. **Later still (owner, 2026-09-16, the Fable quota reset):** Fable is available again. Reviews run on Opus (wof-reviewer) plus a Fable reviewer, and the Codex gpt-6-astra review is stopped; Fable also takes the rulings that reopen an ADR or a tuned number.

- The main session orchestrates only. Drafting and fixing go to wof-drafter; reviewing goes to wof-reviewer with `model: opus` plus a Codex gpt-5.6-sol review.
- Narrow items that need the strongest judgment may go to a Fable reviewer, scoped precisely.
- The decider is a general agent run on Fable. It reads DECISIONS before deciding and may amend ADRs.
- A fix may edit earlier chapters.
- When agents run in parallel, gate edits to shared files (chapters, YAML, OPEN-QUESTIONS) with an empty lock file that the waiting agent loops on. Do not run the simulator while another agent edits YAML.

## Packet conventions

- Where chapter prose and YAML differ, the packet follows the YAML, and the chapter gets fixed.
- Voice: a published TRPG product. Players are "you" and the GM is "the GM". Triggers are bold and procedures are numbered. Game terms are capitalised as in `CONTEXT.md`.
- Banned words: YAML, probe, simulator, Monte Carlo, OQ, ADR, PROVISIONAL, flag, and simulation percentages. No em dashes.
- A provisional rule gets a small "Playtest rule" tag, not an explanation.
- Titan stat blocks and Behavior Tables are public. Hidden values sit in the "GM only" section.
- Artifact format:
  - The file starts with `<title>`, with no doctype, html, head, or body tags.
  - Colours are theme tokens on `:root`, with dark overrides under `prefers-color-scheme` and `[data-theme="dark"]`.
  - Every table sits in a scroll wrapper, and the only external resource is Google Fonts.
- Print stylesheet: page breaks before the GM section and each Titan. **Length is not limited (owner, 2026-09-15):** the packet, including the quick reference, may run as long as it needs to be concise and complete. Nothing is cut to fit a page. The voice and wording conventions below still apply.
- After every edit check that:
  - every in-page link resolves;
  - there are no em dashes;
  - banned words appear 0 times;
  - every d6 table is complete.

## Commands

```bash
uv run --with pyyaml python tools/render/render.py write
```

```bash
uv run --with pyyaml python tools/render/render.py check
```

```bash
uv run --with pyyaml python tools/probes/chapter-06/render.py check
```

```bash
uv run --with pyyaml python tools/probes/chapter-06/run6.py check
```

```bash
uv run --with pyyaml python -c "import yaml, glob; [yaml.safe_load(open(f)) for f in glob.glob('data/**/*.yaml', recursive=True)]"
```

Full simulator run, about 9 minutes, fixed seeds; it rewrites `tools/sim/results/results.json` and the report:

```bash
uv run --with pyyaml python tools/sim/run.py
```

Codex review. The model defaults to gpt-5.6-sol; pass `gpt-6-astra astra` for an Astra review. The task file's severity guide overrides the runner's chapter guide:

```bash
zsh tools/codex/run-review.sh playtest-packet 4 docs/playtest/process/packet-review-task-round-4.md
```

## Open items the owner may want to decide

- OQ-112 (Unresolved Major): four strikers beat the baseline Squad on every table.
- OQ-132 (Simulator target): the standard Medium Titan's deaths per fight read 0.055 to 0.057 against a limit of 0.05.
- OQ-114: open Minor findings from the Chapters 5 and 6 conformance review.
- OQ-115 to OQ-118, OQ-128, OQ-133: simulator cases not yet measured.
- Chapter 5's design note near line 545 still says "a sound horse"; the rule and glossary say "mounted on their own horse that is not lame".
