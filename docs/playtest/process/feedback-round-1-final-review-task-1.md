Review the whole playtest packet feedback round 1 change to Wings of Freedom: the rulebook Chapters 1 to 7, their YAML, and the updated playtest packet. This is the round's one final review (owner, 2026-09-15). Two reviewers run in parallel: wof-reviewer on Opus and Codex CLI gpt-6-astra. Each writes only its own file.

## What changed in this round
- **Decision batches 7 and 8** in `docs/rules/DECISIONS-2026-09-14.md` (7-1 to 7-18, 8-1 to 8-33).
- **ADR-0016 to ADR-0019,** and the amendments to ADR-0001, 0003, 0005, 0014, 0015, 0017, and 0018.
- **`CONTEXT.md`.**
- **`docs/rules/OPEN-QUESTIONS.md`,** OQ-135 to OQ-164.
- **The packages** are listed in `docs/playtest/feedback/round-1/IMPLEMENTATION-PLAN.md`:
  - WP-0, WP-A, WP-B, WP-C, WP-C2, WP-D, WP-F, WP-R, WP-T;
  - the simulator parts WP-S1 and WP-S2;
  - the packet, WP-P.
- **The owner's answers,** which govern intent: `docs/playtest/feedback/round-1/OWNER-DECISIONS.md`.

## Sources of truth
- `data/` YAML first, then the chapters in `docs/rules/01` to `07`, `CONTEXT.md`, the ADRs, and the decisions.
- Where a chapter and its YAML differ, the chapter is wrong.
- The packet (`docs/playtest/wings-of-freedom-playtest-packet.html`) must not change a rule. It follows `docs/playtest/process/packet-brief.md` and the packet conventions in `docs/playtest/HANDOFF.md`.
- You may read `docs/reviews/simulator-report.md`, but only to check that the verdict sentences in `data/engagement/tuning.yaml`, `data/titans/tuning.yaml`, Chapter 5 section 5.13, and Chapter 6 section 6.6 match it.
- Do not run `tools/sim/run.py`.

## The packet's format
The packet is published as a Claude Artifact. It intentionally has no doctype, html, head, or body tags. It starts with `<title>`, uses Google Fonts, defines light and dark theme tokens, and wraps tables in scrolling containers. None of these are findings.

## Check, most important first
1. **Rule fidelity and consistency.** Every rule, number, and table row agrees across the YAML, the chapters, the decisions, and the packet. Walk these end to end:
   - a Titan card under Attack Dice: the open roll on 5 or 6, cancellation, net successes, the whiff against anyone, the +1 rider per net success beyond the first, the Grab landing on net 1 with no rider, and one Reaction per Titan per round;
   - a Critical Injury: sides, Injury Type, and the Bite, Burn, Cut, and Pierce riders;
   - a Titan's death: steam, the falling Titan, Leap Clear, Pinned, Heave, corpse heat, the run-on and its 8-round close (8-32), and a retreat with a Pinned comrade;
   - the re-cut Fear table and the Stress Responses;
   - a Skirmish: cancellation, damage, Guard, the ambush, the musket at 4, troopers at Attack Dice 7, Grit 4, and a patrol of 4;
   - an Expedition Leg and a night camp, Downtime, and Requisition, including prosthetics;
   - character creation by Lifepath, Template Build, and Free Build (Health 2 to 4);
   - Squadmates.
2. **ADR and glossary conformance.**
   - No rule rests on GM discretion (ADR-0003).
   - Every Burn source and the falling Titan are data-shaped, with no GM choice.
   - No pool is called Severity anywhere; Severity is only the number a roll scored.
   - Every harming or terrorizing Titan entry lists Attack Dice.
   - Every Chapter 6 stat block shows a Heave rating.
   - New terms match `CONTEXT.md` and avoid its Avoid words. That includes the three older Talent names a count script flagged: Hard to Kill, Wide Awareness, and Pry Loose.
3. **The Talent list** (83 Talents):
   - ADR-0016's nine guardrails and batch 7's 7-2 and 7-3 list rules hold;
   - no Talent adds dice to Leap Clear, or names Attack Dice or the rider;
   - every `names` id exists in the Action Catalog;
   - the Talents that cite Chapter 7 match its terms.
4. **Completeness for a first playtest.** A group with only the packet can:
   - make soldiers by each allowed method;
   - run an Expedition with Legs, a camp, and Downtime;
   - run a Titan Engagement against each Titan, including steam, the fall, the retreat, and the aftermath;
   - run a Skirmish;
   - requisition gear.

   The packet states the playtest configuration: 4 PCs and no Squadmates.
5. **Edge cases and ordering** likely in normal play. Endings must always be reachable, which `engagement-flow.yaml` `always_ends` requires.
6. **Packet language and format:**
   - it reads as a published TRPG product;
   - banned words appear 0 times (YAML, probe, simulator, Monte Carlo, OQ, ADR, PROVISIONAL, flag, and simulation percentages);
   - no em dashes anywhere in chapters, rendered tables, or the packet (some older rendered cells were flagged);
   - every in-page link resolves;
   - every d6 table is complete;
   - the quick reference fits one page on Letter and A4;
   - it is readable at phone width.

## Known issues already logged
The drafters logged about 40 known mismatches and questions in `docs/playtest/feedback/round-1/DECIDER-QUEUE.md`, in the sections "For the final review" and the items marked open. Read them first.
- Confirm each one or dismiss it, and give it a severity.
- Don't spend your time re-finding them.
- Spend your effort on everything they don't cover.

The simulator report was rendered at the end of the final run, and `data/` and some engine files changed afterwards. The verdict sentences, the probe code refactor, and the probe-figures re-commit are known. A `--stale-ok` notice is not a finding.

## Severity for this review
This overrides any other guide.
- **Critical:** contradicts an ADR, the glossary, or an owner decision without being logged as an open question; rests on GM discretion; a rules bug that breaks play, including an ending that cannot be reached; or a missing rule or table that stops a first playtest.
- **Major:** an undefined edge case or ordering problem likely in normal play; a chapter, YAML, or packet mismatch likely to matter at the table; a Talent that breaks a guardrail; or a structure requirement unmet.
- **Minor:** wording, a single term, or a small layout problem.

## Output
Give the counts, then findings grouped by file with exact locations, then a short prioritised fix list.
