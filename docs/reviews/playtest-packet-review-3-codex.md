# Wings of Freedom Phase 1 playtest packet: review, round 3 (Codex)

## Verdict

| Severity | Count |
|---|---:|
| Critical | 1 |
| Major | 2 |
| Minor | 1 |

The packet contains everything a group needs for the first playtest. A group can make soldiers, run the interim day and issue, fight each of the four Titans, retreat, resolve the aftermath, and record feedback without opening the chapters. The public Titan material and the Sprinting Abnormal's hidden values are now labelled correctly.

It is not ready to publish unchanged. Two summaries state incomplete rules that can change choices in play, the print stylesheet expressly disables the required break before the first Titan, and one round 2 correction was made only in the packet rather than in its YAML source.

## Scope and checks

I reviewed `docs/playtest/wings-of-freedom-playtest-packet.html` against Chapters 1 to 6, their rendered tables and YAML, `CONTEXT.md`, every ADR, and `docs/rules/DECISIONS-2026-09-14.md` through item 5-19. I also checked the owner's Structure and Voice requirements and all findings in both round 2 reviews. I did not read the parallel round 3 review or any simulator review or report.

- I checked the quick reference line by line against the rules it summarizes. The Jam and dry, fall, and retreat-trigger corrections from round 2 are accurate. The turn-order and Feint lines still drop governing conditions.
- I walked soldier creation, the interim day and issue, the complete round, Attention evaluation, Break Attention, a Feint, Body Part and Nape strikes, a Grab, Critical Injuries and Down, falls, retreat, leaving, the ending tests, aftermath rolls, and the care window.
- I compared the packet's rules tables with the rendered chapter tables and YAML. All four Behavior Tables match row for row. Titan Size Classes, stat blocks, public fields, hidden fields, fall tables, harm tables, Lifepath tables, Talents, setup tables, and procedure tables agree apart from Minor 1.
- The document has 101 in-page links, all resolved, and 106 unique ids. All 70 tables are inside scrolling containers. The 480 px rule collapses stat blocks to one column, and no unwrapped rules table can widen the body.
- Player material comes first, followed by the quick reference and the GM material. The glossary, sheets, and feedback page follow. No GM-only hidden value appears in the player section.
- The text contains no em dash, missing-rule marker, or developer vocabulary prohibited by the brief. It addresses players as "you" and the GM as the GM. The in-world openers are original, and the capitalised game terms follow `CONTEXT.md`.

No open finding depends on probability, so I did not run a dice simulation.

## Round 2 findings

| Round 2 finding | Status | Round 3 evidence |
|---|---|---|
| Opus Major 1. Jam and Dry omit the Body Part restriction and grounded exception | Resolved | Quick reference line 2194 now gives both the close Body Part restriction and the grounded exception. |
| Opus Minor 1. Fall-band raise applies to horse falls | Resolved | Line 2202 now makes a horse fall always low and applies the raise only to other falls. |
| Opus Minor 2. GM band bars players from public Titan material | Resolved | Lines 2238 to 2243 identify only Hidden values as GM only. Each Titan page is labelled public. |
| Opus Minor 3. Distant implies only running Titans can reach it | Resolved | Line 1754 now says any Behavior Table entry naming Distant reaches it. |
| Opus Minor 4. Medium tracker example has two cards | Still open | Packet line 2307 now has one card, which is correct for Tempo 1, but `data/engagement/round.yaml` line 158 still has cards 4 and 15. See Minor 1. |
| Opus Minor 5. Riderless-horse Position comparison is incomplete | Resolved | Lines 848, 1280, and 1936 now use the Focus Titan recorded with the horse's Position. |
| Codex Critical 1. Strike summaries contradict the grounded exception | Resolved | Lines 2147, 2149, and 2194 now state one consistent rule. |
| Codex Critical 2. Fall summary can raise a horse fall | Resolved | Line 2202 now makes the low horse band unconditional. |
| Codex Major 1. Retreat summary omits the Background-clock trigger | Resolved | Line 2204 now gives both retreat triggers. |
| Codex Minor 1. Hand-to-Hand changes blades to Blade Sets | Resolved | Line 664 again says "blades or bare hands," matching the Talent table. |

The nine resolved fixes introduce no new rule error at their locations. The tracker correction leaves its source out of sync, so that finding remains open.

## Findings, most severe first

### Critical 1. The turn summaries make every retreat move happen before the action

**Location.** Player round summary, line 1831, and quick reference, line 2132. The detailed retreat rule is at lines 2072 to 2084. Sources are Chapter 5, section 5.10, lines 772 to 783, and `data/engagement/background-titans.yaml`, lines 112 to 120.

**Problem.** Both summary lines state without exception that the forced move comes first in a retreat. The governing retreat rule has two exceptions. A soldier may act first and then stay with a Down or Grabbed comrade under forced-move option 4. A soldier using Lift Comrade lifts first and then moves, so they can carry the comrade out that turn. The detailed packet rule states both exceptions, leaving two contradictory instructions in the same player section and on the page meant for use during play. Chapter 5 section 5.3 and `round.yaml` repeat the shorthand, but both defer to the detailed retreat order. The detailed rule and `background-titans.yaml` settle the conflict.

**Concrete play scenario.** Hanne begins her retreat turn at Distant beside a Down comrade. The quick reference says she must make the forced move first, and the only outward move is leaving, so she abandons the comrade. The detailed rule lets her take Lift Comrade first, then leave while carrying them. In a second common case, a soldier beside a Grabbed comrade must make Pry Loose before choosing to stay, but the summary orders the move before the action that makes staying legal.

**Fix options.**

1. Change both packet summaries to: "In a retreat the forced move comes first, except that an action for a comrade comes before staying with them, and Lift Comrade comes before the move."
2. Keep the short summary, but say "follow the two action-first exceptions under Retreats" and link directly to the order paragraph. Apply the same correction to Chapter 5 section 5.3 and `data/engagement/round.yaml` so the source no longer contains the conflicting shorthand.

### Major 1. The quick-reference Feint permits an unmounted horse

**Location.** Quick reference, line 2172. The complete packet rule is at line 1938. Sources are Chapter 5, section 5.6, lines 526 to 530, and `data/engagement/attention.yaml`, lines 309 to 325.

**Problem.** The quick reference lists a "sound horse" as one of the three ways to qualify for a Feint. The rule requires the soldier to be mounted on their own horse and for that horse not to be lame. A nearby or riderless sound horse does not qualify and cannot supply Gear Dice. The summary drops both ownership and mounted state at the point where it presents the Feint's complete alternatives.

**Concrete play scenario.** Ilse stands In Reach on foot. Her own horse is at Distant, and another soldier's sound horse is at In Reach. The quick reference says the sound horse qualifies, so Ilse rolls Perception with its Gear Dice. The rule permits neither the Feint nor those Gear Dice. She needs working ODM Gear, must be mounted on her own sound horse, or must be on foot against a grounded Titan.

**Fix options.**

1. Replace "sound horse" with "mounted on your own sound horse."
2. Shorten the whole parenthesis to "working ODM Gear; mounted on your own sound horse; or on foot against a grounded Titan."

### Major 2. The print stylesheet disables the required page break before the first Titan

**Location.** Print CSS, lines 94 to 96, and the first Titan at lines 2395 to 2397.

**Problem.** The owner requires a print page break before the GM section and each Titan. The general `.titan` rule supplies that break, but `#titan-small{break-before:auto}` expressly removes it from the standard Small Titan. The Titans introduction and the first stat block can therefore share a page. The other three Titans receive the required break.

**Concrete play scenario.** The GM prints the packet and separates the four public Titan references for the table. Medium, Large, and Sprinting Abnormal each begin on a fresh sheet. The Small Titan begins partway down the Titans introduction sheet, so its reference page cannot be handed out or laid beside the others as a complete page.

**Fix options.**

1. Remove the `#titan-small{break-before:auto}` override.
2. Put the introduction inside the standard Small Titan's page and keep a single break immediately before that combined section, while making the page's public Titan-reference purpose explicit.

### Minor 1. The corrected Medium tracker example no longer matches its YAML source

**Location.** Packet tracker example, line 2307. Source: `data/engagement/round.yaml`, line 158.

**Problem.** The packet now gives the standard Medium Titan one initiative card, matching its Tempo 1 stat block. The YAML tracker example still says `cards 4, 15`, and its Regeneration clock identifies the Titan as the standard Medium rather than the Tempo 2 Sprinting Abnormal. The packet's correction is mechanically right, but the source and packet remain out of sync under ADR-0012.

**Concrete play scenario.** A later packet regeneration copies the YAML example and restores the two-card error that round 2 found. If a GM reads the YAML-backed chapter aid beside the packet, the two references disagree about how the tracker should look.

**Fix options.**

1. Change `data/engagement/round.yaml` line 158 to `cards 4` and render any chapter aid generated from it.
2. If the example must show two cards, identify it as the Sprinting Abnormal and replace every value that currently identifies the standard Medium Titan.

## Remaining edits

1. Add the two retreat action-first exceptions to both turn summaries and synchronize the Chapter 5 and `round.yaml` shorthand.
2. Restore "mounted on your own" to the quick-reference Feint.
3. Reinstate the print break before the standard Small Titan.
4. Synchronize the Medium tracker example in `round.yaml` with the packet's correct one-card example.
