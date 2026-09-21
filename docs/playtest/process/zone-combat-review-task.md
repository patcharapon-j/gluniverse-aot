# Review task: batch E, zone combat, review round 1

Review batch E of "Wings of Freedom", a private Attack on Titan tabletop RPG on the Year Zero Engine:
zone combat, the Stride, and the engagement board. This is a **rule change review** across every
surface, not a chapter review. Run `git diff d6db8ae..HEAD` to see the change.

## What changed

1. **Zones.** A Titan Engagement is fought over a field of flat-top hex zones (13 by default, 7 or
   19). Each zone has its own Anchor Rating; the fight has a field rating it is generated from.
2. **Positions are derived** from a soldier's zone plus one attachment (ground, anchored, airborne,
   on a body, in a blind spot, mounted, grabbed, pinned). The close rule and the comparison block are
   retired; "the same Position or one step" became "the same zone or an adjacent zone".
3. **Moves** are zone steps, Flights across zones with Carry costs by the rating entered and a Carry
   limit, the crossing mark on a Titan whose zone a Flight crosses (Quiet stops it), and a mounted
   pace of 2 zones.
4. **The Stride.** Before its card, a Focus Titan moves toward its Attention holder up to its Stride
   (Small 1, Medium 2, Large 2, Sprinting Abnormal 3), carrying soldiers on its body or in its hand and
   leaving Blind Spot soldiers behind; grounded Titans do not stride.
5. **Wrecks** take one rating step off the Titan's own zone.
6. **The retune (batch 17):** Frenzy rises every third round; Pitch Headlong no longer wrecks.
7. **Foundry:** the rules engine on zones and a PIXI engagement board; **simulator:** a spatial model.

## Sources of truth, in this order

- Decision batches 16 and 17 at the end of `docs/rules/DECISIONS-2026-09-14.md`, ADR-0029,
  `docs/playtest/feedback/round-3/OWNER-DECISIONS.md` and `docs/reviews/zone-retune-decisions.md` are
  settled. **Do not reopen a settled decision.** A decision applied incorrectly, incompletely, or
  inconsistently across surfaces is a finding.
- `CONTEXT.md`, the ADRs, the chapters in `docs/rules/`, and the YAML in `data/` (ADR-0012: the YAML
  is the source; where prose and YAML differ, the prose is wrong).

## Check, most important first

1. **The new rules at the table.** Walk the Stride, the Flight across zones, the crossing mark, the
   derivation, attachments, falls, Grab, Pinned, corpses, horses, the retreat and leaving. Does every
   procedure terminate and leave no GM choice ADR-0024 keeps closed? Are ties defined?
2. **Every reader of a Position.** Grep `data/` and `docs/rules/` for Position steps, "Anchors" as a
   whole-fight count, a single Anchor Rating for the fight, and "Distant" as one place. Each leftover is
   a finding (Chapter 5 section 5.11's end is already suspected).
3. **Cross-surface agreement:** chapters, YAML, the site (`site/src/content`), the packet
   (`docs/playtest/wings-of-freedom-playtest-packet.html`), and Foundry's user-visible strings.
4. **Terms** used exactly as `CONTEXT.md` defines them; no em dashes.

## Severity

Critical: a rule that cannot be played, loops, contradicts itself, or opens a closed GM choice.
Major: surfaces disagree on a rule, or a reader still reads the old model. Minor: wording, terms,
presentation.

## Output

Write the findings file you are told to write, each finding with severity, file and line, the
problem, and the fix. Report only counts per severity in your final reply.
