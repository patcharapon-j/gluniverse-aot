"""Renders the simulator report from the results run.py writes, the committed probe figures
(data/titans/probe-figures.yaml, data/titans/tuning.yaml, data/engagement/tuning.yaml), and ADR-0014's target words.

Every limit is read from those files: each target's and band's tolerance through rules.R and targets.py (ADR-0014
as amended in decision batch 5, OQ-127), with the second-seed rule, and the bar's constraints from
data/titans/tuning.yaml (targets). The regular expressions below raise when the wording they read changes, and the
coverage map raises when either simulator_cases list changes, so a stale reading is never rendered silently.

Hand-written here: the Open Question ids the report cites (checked against docs/rules/OPEN-QUESTIONS.md), the
coverage map, the chapter bugs, and the divergence notes. Every explanation of a figure past 3 standard errors
is generated from the re-check figures run.py records.
"""
import math
import os
import re

import cases as C
import barcheck as B
import dice
import engine as E
import families as F
import targets as TG
from rules import R, load, RIDER_PER_NET, text_of

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT_FULL = os.path.join(ROOT, "docs", "reviews", "simulator-report.md")
OUT_SCALE = os.path.join(HERE, "results", "report-scale.md")
OQ_FILE = os.path.join(ROOT, "docs", "rules", "OPEN-QUESTIONS.md")
ADR14 = os.path.join(ROOT, "docs", "adr", "0014-numbers-tuned-to-design-targets.md")
COMMAND = "uv run --with pyyaml python tools/sim/run.py"

PF = C.PF
T6 = load("titans/tuning.yaml")
T5 = load("engagement/tuning.yaml")
STANDARD = [t for t in C.TITANS if t not in C.ABNORMAL_IDS]
NUMBER_WORDS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6}
FRACTION_WORDS = {"one half": 0.5, "a third": 1 / 3}
SOLO_BUILDS = (("rookie", "rookie"), ("veteran", "veteran"), ("levi_grade", "levi"))
PCT = {"by3", "nokill", "usable_strike_share", "hit", "dead", "jammed", "rate"}

# Open Questions for what the simulator does not measure (each is a Simulator target entry).
OQ_NOT_MEASURED = {
    "two_titans": "OQ-115",      # two Focus Titans in one fight, Background Titans, leaving and returning outside a retreat
    "sequence": "OQ-116",        # the cadence of Titan Engagements, care windows, and the interim issue; the kit
    "veteran_scars": "OQ-117",   # the Veteran's two Scars name no rows
    "opus_model": "OQ-118",      # the gap to the Opus review 1 model
    "probe_gaps": "OQ-128",      # gaps to committed probe figures that re-checks on new seeds do not explain
    "eyes_arms": "OQ-133",       # eye strikes on the reference Titan at Small and Large, and arm Toughness changes
}
# Open Questions for results that miss: judged-figure id prefix (targets.specs) -> OQ id. Each must be an open
# Simulator target entry in docs/rules/OPEN-QUESTIONS.md (logged_oq checks it when the report renders), so a map the
# register has left raises.
MISSED_OQ = {
    # decision batch 8, 8-31 decided OQ-132 anew: the Medium deaths band reads at most 0.08 through the end (targets.py),
    # the owner's chosen lethality, so no missed result maps to it
    # round 3 retune, R7: the bar's Critical Injuries floor against the strongest support; logged, not retuned before
    # the playtest
    "bar/bar/full/support: sprinting-abnormal: 4 player characters and 2 Squadmates screening beside the holder, "
    "Hook and Cut and Hamstring Line, with the escapes/cutters_first/Critical Injuries floor": "OQ-199",
    "bar/bar/full/support: sprinting-abnormal: 4 player characters and 2 Squadmates screening beside the holder, "
    "Hook and Cut and Hamstring Line, with the escapes/strikers_first/Critical Injuries floor": "OQ-199",
}
# Files of the rules snapshot that changed while the run was going, each with the change as read from a diff of the
# file before and after the run. run.py --report accepts a file listed here while it still matches the snapshot
# taken after the run, and the report prints both snapshots with the note.
SNAPSHOT_CHANGE_NOTES = {
    "docs/rules/PROGRESS.md": "outside the rules hash and the staleness test; a status file no case reads, edited "
                              "by the orchestrator, no rule",
    "docs/rules/DECISIONS-2026-09-14.md": "decision 8-34 recorded while the run was going, and 8-35 to 8-42 after it "
                                          "(the final reviews); text only, which no case reads. 8-40's engine change "
                                          "is listed with the engine changes",
    # Written or recorded by run.py --commit-probe-figures after the run (results.json, post_run_commits); run.py
    # --report accepts each while it still matches the hash recorded then.
    "data/titans/probe-figures.yaml": "re-committed after the run from this run's figures (decision batch 8, plan "
                                      "WP-S2; `run.py --commit-probe-figures`). The comparisons with committed probe "
                                      "figures read the figures committed when the run started, which results.json "
                                      "keeps under `probe_figures_at_run`",
    "tools/sim/run.py": "edited after the run: the probe re-check pointed at the re-committed probe figures, "
                        "`--commit-probe-figures` and `--accept-noted-changes` added, and the staleness test taught to "
                        "accept what they record. No case, trial, or figure of this run changes",
    # The final reviews' fixes (docs/playtest/feedback/round-1/REVIEW-FIX-PLAN.md, packages A to E; decision batch 8,
    # 8-35 to 8-42) and the verdict drafter, recorded by run.py --accept-noted-changes. POST_RUN_CHECKS gives the
    # in-memory checks behind them.
    "data/campaign/downtime.yaml": "package D (R06 by 8-38, R16): Recruit under the playtest configuration, and the "
                                   "Infirmary's healing step copied from healing.yaml; no case runs Downtime",
    "data/character/action-catalog.yaml": "package C (R41): death-roll's `needs`, the Parley outside a Skirmish, and "
                                          "the spending default; no roll the engine makes reads them differently",
    "data/character/attributes.yaml": "package C (R38, R43): heave under Strength and leap-clear and shoot under "
                                      "Agility in `used_by`, and the Health 2 row's text; the Free Build rows' case "
                                      "definitions match the run's",
    "data/character/specialties.yaml": "package C (R40): a Specialty is chosen at Graduation or at a build's Specialty "
                                       "step; text only",
    "data/character/squadmates.yaml": "package C (R06 by 8-38, R35, R42): the playtest configuration row and "
                                      "`fewer_allowed` at session zero; no case reads either",
    "data/character/talents.yaml": "package C (R07 by 8-39, R34 by 8-42, R35, R46, R47, R48): limits counted per "
                                   "procedure, the default limit on Quick Refit, Rescue Ride, and Stay With the Column "
                                   "(none modelled), and wording and capitals; the rule Talents the engine applies read "
                                   "the same values and limits",
    "data/engagement/background-titans.yaml": "package B (R03 by 8-36, R04): the stay limit also counts per pin under a "
                                              "corpse in every retreat, and a Down comrade is compared as any other "
                                              "comparison. With one Focus Titan and no Background Titans a pin under a "
                                              "corpse exists only after that Titan dies, where the limit is 8-32's, so "
                                              "`engine.Fight.fallen_options_closed` already matches; `rules.py` guards "
                                              "both sentences",
    "data/engagement/engagement-flow.yaml": "package B (R02 by 8-34, R03 by 8-36, R15): past_the_stay_limit and "
                                            "always_ends cite 8-34 and 8-36, and the run-on sentence; lost limbs and "
                                            "Background Titans are not modelled, so no measured path changes",
    "data/engagement/positions.yaml": "package B (R04, R15, R29, R48): a Down comrade's comparison, a Focus Titan's "
                                      "death read through the ending tests, and placement by the Straggler and Overrun "
                                      "rows; with one Focus Titan no measured path changes",
    "data/engagement/round.yaml": "package B (R30; 8-36): the playtest configuration's timed rounds beside the default, "
                                  "and the tracker's retreat round; the round-time counters read no new value",
    "data/engagement/titan-format.yaml": "package B (R24, R27): `heave` among the stat block fields and what a standard "
                                         "Titan takes from its Size Class, and a mounted target unaffected by knock "
                                         "loose, as the engine already reads",
    "data/engagement/titan-harm.yaml": "package B (R21 by 8-41): a pinned limb lost to corpse heat stays pinned; the "
                                       "engine models no lost limbs and keeps a pinned soldier pinned",
    "data/engagement/tuning.yaml": "verdict sentences rewritten from the final rerun (R22, R23) by the verdict "
                                   "drafter; the targets and tolerances read the same",
    "data/titans/tuning.yaml": "round 3 retune, R7 and R6: `reported_rows` and the `missed` note under "
                               "`targets.abnormals`, and the `verdicts` paragraphs re-rendered from this run; no case "
                               "reads these words, and rules.py's parses of the block (`fights_per_row`, "
                               "`standard_errors`, the median bounds) are unchanged. Earlier: verdict sentences "
                               "rewritten from the final rerun (R22, R23) by the verdict drafter; the targets and "
                               "tolerances read the same, and the Grab-alone variant's pools read 6 and 9 as before",
    "data/expedition/hazards.yaml": "package D (R05 by 8-37, R52): the Night table's retreat and glossary capitals; no "
                                    "case runs an Expedition",
    "data/expedition/legs.yaml": "package D (R01 by 8-35, R05 by 8-37, R07 by 8-39, R52): Expedition rules; no case "
                                 "runs an Expedition",
    "data/gear/blade-sets.yaml": "package C (R39): the ratings of the set in the handles and of each carried set; text "
                                 "only",
    "data/gear/field-repair.yaml": "package C (R35, R48): pointers and glossary wording; no value the engine reads "
                                   "changes",
    "data/gear/horses.yaml": "package C (R17, R48): Leap Clear beside dodge and ride, and glossary wording; the engine "
                             "sets Leap Clear's Gear Dice from the mount and ODM state",
    "data/gear/odm-gear.yaml": "package C (R35, R48): pointers and glossary wording; no value the engine reads changes",
    "data/gear/items.yaml": "package C (R17): leap-clear in the ODM Gear's and the horse's `gear_dice_for` and the "
                            "horse's mounted test; the engine sets Leap Clear's Gear Dice from the mount and ODM state, "
                            "not from items.yaml",
    "data/harm/death-rolls.yaml": "package A (R11): the outside-a-Titan-Engagement clauses also name the Skirmish; "
                                  "`engine.death_rolls` already keeps a turn limit a turn limit during a fight",
    "data/harm/effect-types.yaml": "package A (R14 by 8-40): stress-gain-nearby lands with the event's other results "
                                   "and counts from the next event; the engine change is listed with the engine changes",
    "data/harm/health.yaml": "package A (R13, R33): a first step, damage of 0 inflicts no harm, which "
                             "`dice.take_damage` already reads; the day-passes pointer",
    "data/harm/treat-injury.yaml": "package A (R12): the outside-harm care window excludes a Skirmish; "
                                   "`families.skirmish_trial` holds no care window during the fight",
    "data/mind/fear-rolls.yaml": "package A (R14 by 8-40): one event's Fear Rolls read from a snapshot; the engine "
                                 "change is listed with the engine changes",
    "data/skirmish/foes.yaml": "package D (R53) and the verdict drafter: `final_rerun` records for the reported Skirmish "
                               "rows; the Foe values the Skirmish probe reads are unchanged",
    "data/skirmish/skirmish.yaml": "package D (R07 by 8-39, R52): limits counted per procedure, and glossary capitals "
                                   "such as Ambush, which the wording guards now read in either case",
    "data/titans/standard-small.yaml": "package B (R24): `heave` in the stat block, its Size Class's heave rating "
                                       "(run6.py check)",
    "data/titans/standard-medium.yaml": "package B (R24): `heave` in the stat block, its Size Class's heave rating "
                                        "(run6.py check)",
    "data/titans/standard-large.yaml": "package B (R24): `heave` in the stat block, its Size Class's heave rating "
                                       "(run6.py check)",
    "docs/adr/0009-expedition-legs-always-advance.md": "ADR-0009 amended for 8-35 and 8-37 (Expeditions); no case "
                                                       "reads it",
    "docs/adr/0014-numbers-tuned-to-design-targets.md": "ADR-0014 amended for 8-39 and 8-40; the target words the "
                                                        "report reads still render",
    "docs/rules/01-core-rules.md": "chapter text (packages A and E, R48); no case reads a chapter",
    "docs/rules/02-character-creation.md": "chapter text (packages C and E, and the verdict drafter); no case reads a "
                                           "chapter",
    "docs/rules/03-harm-and-mind.md": "chapter text (packages A and E, and the verdict drafter); no case reads a chapter",
    "docs/rules/04-gear.md": "chapter text (package C, R17, R22, R36); no case reads a chapter",
    "docs/rules/05-titan-engagement.md": "chapter text (packages B and E, and the verdict drafter); no case reads a "
                                         "chapter",
    "docs/rules/06-standard-titans.md": "chapter text and rendered figure tables (package B, and the verdict drafter's "
                                        "render.py write from the re-committed probe figures); no case reads a chapter",
    "docs/rules/07-playtest-rules.md": "chapter text (package D, and the verdict drafter; then \"interim setup table\" "
                                       "made \"setup table\" in 4 places, one through a tools/render/render.py "
                                       "re-render); no case reads a chapter",
    "tools/sim/cases.py": "the Grab-alone variant's guard reads the verdict's rewritten wording; every case definition "
                          "matches the run's",
    "tools/sim/dice.py": "the Titan attack's shared functions, and 8-40's Fear snapshot (`fear_result`, "
                         "`apply_fear_result`); listed with the engine changes",
    "tools/sim/engine.py": "the Titan attack's shared functions, and 8-40's Fear snapshot (`Fight.fear_event`); listed "
                           "with the engine changes",
    "tools/sim/families.py": "the Titan attack's shared functions; listed with the engine changes",
    "tools/sim/rules.py": "wording guards: every statement guard ignores letter case (package D's glossary capitals), and "
                          "the stay limit's guards read 8-36's wording; no value read changes",
}
# The in-memory checks behind the notes above (review fix plan, section 5, (b)), on the committed seeds and case sizes.
POST_RUN_CHECKS = (
    "the in-memory checks behind them ran on the committed seeds and case sizes (review fix plan, section 5, (b)). With "
    "the Fear order before 8-40, the Medium reference start and its two bar runs, the first-Titan-Engagement row, the "
    "six Grab cells, and one case of every other family reproduce the final run exactly, and all 935 case definitions "
    "match, so no change below moves a value the engine reads on a measured path. With 8-40's snapshot: deaths through "
    "the end at the Medium reference start 0.0705 against the run's 0.0754 (during the fight 0.0628 against 0.0663), "
    "and in the bar's runs of it 0.0706 and 0.0702 against 0.0687 and 0.0693, each inside the band of at most 0.08; "
    "the first-Titan-Engagement row 0.0957 against 0.0947 (during the fight 0.0872 against 0.0862); the six Grab cells "
    "unchanged, since each has at most one rolling witness; and the Abnormal's bar holds every limit in every row, in "
    "both orders and under both readings, as in the run. Of the bar's 260 figures, 10 moved past 2 standard errors and "
    "none past 3, and deaths through the end moved by -0.12 standard errors on average: every move is within sampling, "
    "so the figures in this report stand")
# The unexplained probe gaps OQ-128 lists, as revised by decision batch 5 (5-19): (case key, field).
PROBE_GAPS_LOGGED = {
    ("dodge/flier_template_dodge/needs_3/without_stress_responses", "rate"),
}
# Engine changes since the committed run, printed only while the engine hash at rendering differs from the run's
# (run.py --report --stale-ok). Empty this list once a full run records the current engine.
ENGINE_CHANGES_SINCE_RUN = [
    "`space.py` (new), `engine.py`, `policy.py`, `rules.py`, `dice.py`, `families.py`, `cases.py`, after the run: decision "
    "batch 16 (ADR-0029). The field of zones, derived Positions, the Stride, Flights rolled with Carry and Momentum "
    "(never modelled before: ODM moves were unrolled), wrecks by zone, the retreat over zones, Help and every "
    "between-soldiers test in zones, and the `zones/` sensitivity rows. A forced step now spends nothing, as "
    "`positions.yaml` (forced_step) says. Every figure of this report predates all of it.",
    "`run.py`, after the run: the probe re-check is on again, against `data/titans/probe-figures.yaml` as "
    "re-committed from this run (`--commit-probe-figures`, plan WP-S2), and the staleness test accepts that file. No "
    "case, trial, or figure of this run changes.",
    "`dice.py`, `engine.py`, `families.py`, after the run: the Titan attack's net successes, whiff, rider, Grab landing, "
    "and the Jam test's first answered card read through shared functions (`dice.attack_net`, `ci_rider`, "
    "`grab_net_lands`, `first_answered`) that the Chapter 6 probes now import; fixed-seed fight, Grab, Jam, and lone "
    "cases give bit-identical summaries before and after. `cases.py`: the Grab-alone variant's guard reads the "
    "verdict's rewritten wording. No case, trial, or figure of this run changes.",
    "`engine.py`, `dice.py`, after the run: decision batch 8, 8-40 (D6). One event's Fear Rolls are read from a "
    "snapshot (`Fight.fear_event`): every rolling soldier's total is found from their Stress and Resolve before any "
    "result of the event applies, so stress-gain-nearby and Survivor's Guilt count from the next event. The figures in "
    "this report are the run's, under the order before it; the in-memory checks under it are listed with the files "
    "changed after the run, and every move is within sampling.",
    "`rules.py`, after the run: the statement wording guards ignore letter case (package D's glossary capitals, such as "
    "Ambush), and the stay limit's guards read 8-36's wording. No value read changes.",
]

CHAPTER_BUGS = [
    "**Veteran fresh-cut cells below the Veteran's minimum Stress (Minor; already logged as OQ-114, item 7, which cites this report's section 10, this section's number when it was logged).** "
    "`docs/rules/05-titan-engagement.md` section *A lone soldier after Break Attention* (the design note's table, "
    "the Veteran row), `data/engagement/tuning.yaml` (`solo_nape`, `chosen_nape_depth_4` and "
    "`alternative_nape_depth_5`, `veteran`), and `data/titans/probe-figures.yaml` (`solo`, every Titan, `veteran`, "
    "`stress_0` and `stress_1`) give the Veteran's cut from Stress 0 and 1. The Veteran's two Scars set a minimum "
    "Stress of 2 and Stress never starts below the minimum, so those starts cannot happen. The simulator starts "
    "those cells at the minimum; section 11 shows the gaps this leaves.",
]


# ---------------------------------------------------------------------- helpers
def num(v):
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip()
    if s.endswith("%"):
        s = s[:-1]
    return float(s)


def parse_count(v):
    if isinstance(v, int):
        return v
    m = re.match(r"\s*([\d,]+)", str(v))
    if not m:
        raise ValueError(f"not a count: {v!r}")
    return int(m.group(1).replace(",", ""))


def pse(p, n):
    q = max(0.0, min(100.0, p)) / 100
    return 100 * math.sqrt(q * (1 - q) / n) if n else 0.0


def z(a, a_se, b, b_se):
    d = math.sqrt(a_se ** 2 + b_se ** 2)
    return (a - b) / d if d > 0 else 0.0


def f1(x):
    return "n/a" if x is None else f"{x:.1f}"


def f2(x):
    return "n/a" if x is None else f"{x:.2f}"


def f3(x):
    return "n/a" if x is None else f"{x:.3f}"


def f4(x):
    return "n/a" if x is None else f"{x:.4f}"


def zf(x):
    return "n/a" if x is None else f"{x:+.1f}"


def pct(x):
    return "n/a" if x is None else f"{x:.1f}%"


def table(head, rows):
    out = ["| " + " | ".join(head) + " |", "|" + "|".join(" --- " for _ in head) + "|"]
    out += ["| " + " | ".join(str(c) for c in r) + " |" for r in rows]
    return "\n".join(out)


def band(text):
    m = re.fullmatch(r"at most ([\d.]+)(%?)", text)
    if m:
        return None, float(m.group(1))
    m = re.fullmatch(r"([\d.]+)%? to ([\d.]+)%?", text)
    if m:
        return float(m.group(1)), float(m.group(2))
    raise ValueError(f"data/titans/tuning.yaml band wording changed: {text!r}")


def need(pattern, text, what):
    m = re.search(pattern, text)
    if not m:
        raise ValueError(f"{what}: the wording report.py reads has changed (pattern {pattern!r})")
    return m


def read_oq_titles():
    with open(OQ_FILE) as fh:
        return dict(re.findall(r"^### (OQ-\d+): (.+)$", fh.read(), flags=re.M))


def logged_oq(i):
    """A missed result's Open Question must be an open Simulator target entry (simulator review round 3, Major 1):
    raises when the entry is gone, is another type, or is no longer open."""
    with open(OQ_FILE) as fh:
        text = fh.read()
    m = re.search(rf"^### {re.escape(i)}: .+?(?=^### OQ-|\Z)", text, flags=re.M | re.S)
    if not m:
        raise ValueError(f"MISSED_OQ cites {i}, which has no entry in docs/rules/OPEN-QUESTIONS.md")
    body = m.group(0)
    if not re.search(r"^- \*\*Type:\*\* Simulator target", body, flags=re.M):
        raise ValueError(f"MISSED_OQ cites {i}, which is not a Simulator target entry")
    if not re.search(r"^- \*\*Status:\*\* Open", body, flags=re.M):
        raise ValueError(f"MISSED_OQ cites {i}, which is no longer open; update the map")
    return i


def med_txt(s):
    if s["median"] >= 99:
        return "none"
    return f"{s['median']}" + ("*" if s.get("median_on_boundary") else "")


def med_detail(s):
    m = s["median"]
    if m >= 99:
        return "no median kill: fewer than half the fights kill the Titan"
    txt = (f"{s['median_before']:.1f}% +/- {s['median_before_se']:.1f} killed by round {m - 1}, "
           f"{s['median_at']:.1f}% +/- {s['median_at_se']:.1f} by round {m}")
    return txt + ("; on the boundary (within 2 standard errors of 50%)" if s["median_on_boundary"] else "")


def trials_of(s, family):
    return s["fights"] if family in ("fight", "probe") else s["trials"]


def value_se(s, family, field):
    if family == "probe":
        if field == "by3":
            return s["by3"], pse(s["by3"], s["fights"])
        return s[field], s[field + "_se"]
    if family == "fight":
        return s[field], s[field + "_se"]
    if family == "lone":
        return s[field], pse(s[field], s["trials"])
    if family in ("solo", "grab", "jam", "dodge"):
        return s[field], s["se"]
    raise ValueError(family)


def veteran_rule(key):
    m = re.fullmatch(r"solo/nd\d+/veteran/stress(\d+)", key)
    vmin = R.builds[dice.BUILD_ALIASES.get("veteran", "veteran")]["min_stress"]
    if m and int(m.group(1)) < vmin:
        return (f"Not sampling: the Veteran's minimum Stress is {vmin}, so a start at Stress {m.group(1)} begins at "
                f"{vmin}; the committed cell started below the minimum (section 15).")
    return None


def ch5_committed(locator):
    sec, text = locator
    psk = T5["prepared_squad_kill"]
    node = psk
    for part in sec.split("."):
        node = node[part]
    if isinstance(node, dict):
        vals = [num(v) for v in node[text]]
        return dict(median=vals[0], by3=vals[1], cis=vals[2], cards_resolved_per_round=vals[3], onfoot_feints=vals[4])
    row = next(r for r in node if r["case"] == text)
    v = [num(x) for x in row["values"]]
    cols = psk["columns"]
    if isinstance(cols, list) and len(cols) != len(v):
        raise ValueError(f"prepared_squad_kill columns changed ({len(cols)} columns, {len(v)} values)")
    if isinstance(cols, list) and cols[3] != "no_kill":
        raise ValueError(f"prepared_squad_kill columns changed: {cols}")
    return dict(median=v[0], by3=v[1], by4=v[2], nokill=v[3], cis=v[4], deaths=v[5], jams=v[6], grabs=v[7],
                devours=v[8])


# ---------------------------------------------------------------------- every comparison with a committed figure
def committed_figures(res):
    """The probe figures committed when the run started. Once run.py --commit-probe-figures has re-committed
    data/titans/probe-figures.yaml from the run, results.json keeps the ones it replaced, and the report compares
    against those rather than against the run's own figures."""
    return res.get("probe_figures_at_run") or C.PF


def comparisons(res):
    global PF
    PF = committed_figures(res)
    by = {c["key"]: c for c in res["cases"]}
    out = []

    def add(key, source, figure, field, com, com_se, com_n, rule=None):
        if com is None or key not in by:
            return
        c = by[key]
        s = c["summary"]
        fam = c["family"]
        v, se = value_se(s, fam, field)
        if com_se is None:
            if com_n is None:
                com_se = 0.0
            elif field in PCT:
                com_se = pse(com, com_n)
            else:
                com_se = se * math.sqrt(trials_of(s, fam) / com_n)
        out.append(dict(key=key, source=source, figure=figure, field=field, family=fam, sim=v, sim_se=se, com=com,
                        com_se=com_se, com_n=com_n, z=z(v, se, com, com_se),
                        explained_by_rule=rule(key) if rule else None))

    def fight_cmp(key, source, com, com_n):
        add(key, source, "killed by round 3, %", "by3", com.get("by3"), None, com_n)
        add(key, source, "Critical Injuries", "cis", com.get("cis"), com.get("cis_se"), com_n)
        add(key, source, "deaths during the fight", "deaths", com.get("deaths"), com.get("deaths_se"), com_n)
        add(key, source, "no kill, %", "nokill", com.get("nokill"), com.get("nokill_se"), com_n)

    for label, v in PF["fight"].items():
        fight_cmp("ch6/" + label, "Chapter 6", v, v["fights"])
    bar_n = parse_count(PF["bar"]["fights"])
    for order, sec in (("cutters_first", "figures"), ("strikers_first", "strikers_first")):
        for label, v in PF["bar"][sec].items():
            fight_cmp(f"bar/{order}/{label}", "Chapter 6 bar", v, bar_n)
    ch5_n = parse_count(T5["prepared_squad_kill"]["fights_per_case"])
    for c in res["cases"]:
        if c["key"].startswith("ch5/"):
            fight_cmp(c["key"], "Chapter 5", ch5_committed(c["committed"]), ch5_n)
    for tid, v in PF["lone"].items():
        for line in ("waiting", "hurried", "one_card_hold"):
            if line in v:
                add(f"lone/{tid}/{line}", "Chapter 6", "usable strike, %", "usable_strike_share",
                    v[line]["usable_strike_share"], None, R.lone_trials)
    lf = T5["solo_nape"]["lone_fight"]
    for key, sec in (("lone/ch5/tempo1", "tempo_1_nape_depth_4"), ("lone/ch5/tempo2", "tempo_2")):
        add(key, "Chapter 5", "usable strike, %", "usable_strike_share", num(lf[sec][0]["values"][0]), None, R.lone_trials)
    for tid, v in PF["solo"].items():
        for build, bk in SOLO_BUILDS:
            for st in R.solo_stresses:
                add(f"solo/nd{v['nape_depth']}/{build}/stress{st}", f"Chapter 6 ({tid})", "fresh cut, %", "hit",
                    v[bk][f"stress_{st}"], None, R.solo_trials, veteran_rule)
    for sec in T5["solo_nape"]:
        if sec.startswith(("chosen_nape_depth_", "alternative_nape_depth_")):
            nd = int(sec.split("_")[-1])
            for build, _ in SOLO_BUILDS:
                vals = [num(x) for x in T5["solo_nape"][sec][build]]
                for st, val in zip(R.solo_stresses, vals):
                    add(f"solo/nd{nd}/{build}/stress{st}", "Chapter 5", "fresh cut, %", "hit", val, None, R.solo_trials,
                        veteran_rule)
    for tid, v in PF["grab"].items():
        for cell in ("alone_dodge_failed", "alone_no_dodge"):
            add(f"grab/{tid}/{cell}", "Chapter 6", "Grab death, %", "dead", v[cell], None, R.grab_alone_trials)
        for st, g in R.grab_cells:
            cell = C.cell_label(st, g)
            add(f"grab/{tid}/{cell}", "Chapter 6", "Grab death, %", "dead", v[cell], None, R.grab_cell_trials)
    g5 = T5["grab"]
    add("grab/reference-medium/alone_dodge_failed", "Chapter 5", "Grab death, %", "dead",
        num(g5["lone"]["rows"][0]["death"]), None, R.grab_alone_trials)
    add("grab/reference-medium/alone_no_dodge", "Chapter 5", "Grab death, %", "dead",
        num(g5["lone"]["rows"][1]["death"]), None, R.grab_alone_trials)
    cc = g5["comrades_close"]
    one = dict(zip(cc["cells"], cc["one_comrade"]))
    tmpl = dict(zip(cc["cells"], cc["one_template_comrade_with_no_strike_talent"]))
    tc = C.no_strike_template()
    for st, g in R.grab_cells:
        name = f"stress_{st}_grief_{g}"
        add(f"grab/reference-medium/{C.cell_label(st, g)}", "Chapter 5", "Grab death, %", "dead", num(one[name]), None,
            R.grab_cell_trials)
        add(f"grabx/template_comrade/{tc}/{C.cell_label(st, g)}", "Chapter 5 reports", "Grab death, %", "dead",
            num(tmpl[name]), None, R.grab_cell_trials)
    for h, (lone, comrade) in R.health_rows.items():
        add(f"grabx/health/{h}/lone", "Chapter 5 reports", "Grab death, %", "dead", num(lone), None, R.grab_alone_trials)
        add(f"grabx/health/{h}/one_comrade", "Chapter 5 reports", "Grab death, %", "dead", num(comrade), None,
            R.grab_cell_trials)
        add(f"grabx/health/{h}/fresh_lone", "Chapter 5 reports", "Grab death, %", "dead", num(R.health_fresh[h]), None,
            R.grab_alone_trials)
    for tid, p in R.grab_templates_alone:
        add(f"grabx/template_alone/{tid}", "Chapter 5 reports", "Grab death, %", "dead", num(p), None,
            R.grab_templates_trials)
    cols = [c for c, _, _ in R.jam_columns]
    for tid, v in PF["jam"].items():
        for reading in ("table", "kill", "mounted"):
            for nt in (1, 2):
                cells = v[reading][f"{nt}_titans"]
                for cell in cols:
                    add(f"jam/{tid}/{reading}/{nt}_titans/{cell}", "Chapter 6", "Jammed, %", "jammed", cells[cell], None,
                        R.jam_trials)
    for reading in ("table", "kill"):
        for sc in R.size_classes:
            for nt, nk in ((1, "one_titan"), (2, "two_titans")):
                vals = [num(x) for x in T5["jam_test"][reading][sc][nk]]
                if len(vals) != len(cols):
                    raise ValueError("jam_test columns changed")
                for cell, val in zip(cols, vals):
                    add(f"jam/ch5-{sc}/{reading}/{nt}_titans/{cell}", "Chapter 5", "Jammed, %", "jammed", val, None,
                        R.jam_trials)
    for key, spec in R.dodge_reports.items():
        for needs_n, p in spec["figures"]:
            add(f"dodge/{key}/needs_{needs_n}/" + ("with" if spec["responses"] else "without") + "_stress_responses",
                "Chapter 5 reports", f"dodge needing {needs_n} successes, %", "rate", p, None, None)
    return out


def explain(cmp, rc):
    """Returns (text, explained) for a figure past 3 standard errors, from the re-check figures alone."""
    if cmp["explained_by_rule"]:
        return cmp["explained_by_rule"], True
    if rc is None or "sim" not in rc:
        return "Not re-checked in this run.", False
    v, se = value_se(rc["sim"], cmp["family"], cmp["field"])
    n = trials_of(rc["sim"], cmp["family"])
    z_sim = z(v, se, cmp["com"], cmp["com_se"])
    fmt = f1 if cmp["field"] in PCT else f3
    probe = rc.get("probe") if cmp["family"] == "fight" else None
    ptxt = ""
    if probe is not None:
        pv, pse_ = value_se(probe, "probe", cmp["field"])
        z_probe, z_sp = z(pv, pse_, cmp["com"], cmp["com_se"]), z(v, se, pv, pse_)
        ptxt = (f" The committed probe on new seeds gives {fmt(pv)} ({zf(z_probe)} from the committed figure, "
                f"{zf(z_sp)} from the simulator's re-check).")
    if abs(z_sim) <= 2:
        return (f"Sampling: re-run on new seeds ({n:,} trials) the simulator gives {fmt(v)}, {zf(z_sim)} standard "
                f"errors from the committed {fmt(cmp['com'])}." + ptxt), True
    if probe is not None and abs(z_sp) <= 2 and abs(z_probe) > 2:
        return (f"The committed figure's own draw: on new seeds ({n:,} trials) the simulator gives {fmt(v)} "
                f"({zf(z_sim)} from the committed {fmt(cmp['com'])}), and the committed probe, re-run on new seeds, "
                f"sides with the simulator." + ptxt), True
    if probe is not None:
        return (f"Not sampling, and not explained: on new seeds ({n:,} trials) the simulator gives {fmt(v)} "
                f"({zf(z_sim)} from the committed {fmt(cmp['com'])}) and the two models differ." + ptxt), False
    if cmp["com_n"] is None:
        return (f"Not explained: on new seeds ({n:,} trials) the simulator gives {fmt(v)}, {zf(z_sim)} from the "
                f"committed {fmt(cmp['com'])}. The committed figure states no trial count, so its own sampling error "
                "is left out of z and the gap may be the committed figure's draw or rounding."), False
    return (f"Not sampling, and not explained: on new seeds ({n:,} trials) the simulator gives {fmt(v)}, {zf(z_sim)} "
            f"from the committed {fmt(cmp['com'])}; this family has no probe re-run."), False


# ---------------------------------------------------------------------- headline figures, for the next run to compare
def headlines(res):
    by = {c["key"]: c["summary"] for c in res["cases"]}
    out = []

    def put(name, key, field, se_field=None):
        s = by.get(key)
        if s is None or field not in s:
            out.append((name, None, None))
            return
        out.append((name, s[field], s.get(se_field) if se_field else None))

    med = "ch6/" + C.reference_label("standard-medium")
    put("Target 1: median kill round, standard Medium Titan", med, "median")
    put("Target 1: killed by round 3, standard Medium Titan, %", med, "by3", "by3_se")
    put("Target 1: median kill round, Chapter 5's reference Titan", "ch5/reference", "median")
    put("Target 1: killed by round 3, Chapter 5's reference Titan, %", "ch5/reference", "by3", "by3_se")
    nd = R.titan_blocks["standard-medium"]["nape_depth"]
    rs = R.builds["rookie"]["stress"]
    ls = R.builds[dice.BUILD_ALIASES.get("levi_grade", "levi_grade")]["stress"]
    put("Target 2: lone Rookie's fresh cut, %", f"solo/nd{nd}/rookie/stress{rs}", "hit", "se")
    put("Target 3: Levi-grade soldier's fresh cut, %", f"solo/nd{nd}/levi_grade/stress{ls}", "hit", "se")
    put("Target 4: Grab alone, standard Medium Titan, %", "grab/standard-medium/alone_dodge_failed", "dead", "se")
    put("Target 4: one comrade at Stress 2, Grief 0, %", f"grab/standard-medium/{C.cell_label(2, 0)}", "dead", "se")
    cells = [by.get(f"grab/standard-medium/{C.cell_label(st, g)}") for st, g in R.grab_cells]
    out.append(("Target 4: worst of the six cells, %", max(c["dead"] for c in cells) if all(cells) else None, None))
    for name, new, old in (("standard", "gas/standard", "gas/2_dice"), ("pushing", "gas/after_pushed_odm_roll", "gas/3_dice")):
        key = new if new in by else old
        put(f"Gas ({name}): median rounds", key, "median")
        put(f"Gas ({name}): mean rounds", key, "mean")
    put("Medium band: Critical Injuries", med, "cis", "cis_se")
    put("Medium band: deaths during the fight", med, "deaths", "deaths_se")
    put("Medium band: deaths through the end of the Titan Engagement", med, "deaths_all", "deaths_all_se")
    put("Medium band: Grabs", med, "grabs", "grabs_se")
    first = "ch6/standard-medium: a first Titan Engagement, with its Fear Roll"
    put("First Titan Engagement row: deaths during the fight", first, "deaths", "deaths_se")
    put("First Titan Engagement row: deaths through the end", first, "deaths_all", "deaths_all_se")
    put("Retreat: standard Medium Titan reference, share of fights", med, "retreats")
    small = "ch6/" + C.reference_label("standard-small")
    large = "ch6/" + C.reference_label("standard-large")
    put("Small band: median kill round", small, "median")
    put("Small band: Critical Injuries", small, "cis", "cis_se")
    put("Large band: median kill round", large, "median")
    put("Large band: no kill, %", large, "nokill", "nokill_se")
    put("Retreat: standard Large Titan reference, share of fights", large, "retreats")
    helpers = next(r for r in PF["bar"]["rows"] if r["abnormal"] == "sprinting-abnormal: 4 player characters and 2 helper Squadmates")
    for order, _, _ in C.ORDERS:
        put(f"Bar helpers ceiling ({order.replace('_', ' ')}): Abnormal deaths during the fight",
            f"bar/{order}/{helpers['abnormal']}", "deaths", "deaths_se")
        put(f"Bar helpers ceiling ({order.replace('_', ' ')}): Large twin deaths during the fight",
            f"bar/{order}/{helpers['large']}", "deaths", "deaths_se")
        put(f"Bar helpers ceiling ({order.replace('_', ' ')}): Abnormal deaths through the end",
            f"bar/{order}/{helpers['abnormal']}", "deaths_all", "deaths_all_se")
        put(f"Bar helpers ceiling ({order.replace('_', ' ')}): Large twin deaths through the end",
            f"bar/{order}/{helpers['large']}", "deaths_all", "deaths_all_se")
    return out


# ---------------------------------------------------------------------- coverage of the simulator_cases lists
COVERAGE = {
    "data/titans/tuning.yaml": [
        ("Each Chapter 6 table with every Squad Tactic alone and in pairs", "Measured",
         "Sections 6.4 and 9: every Squad Tactic alone and in pairs, the decoy screens, and helpers on every table.", []),
        ("The lone fight on each table at its Tempo", "Measured", "Sections 2.2 and 9: lone lines, fresh and in-fight cut, Stress at the cut.", []),
        ("Broken eyes in the full fight", "Measured",
         "Section 6.5: every table whose entries use eyes (only the standard Medium Titan's do).", []),
        ("The Sprinting Abnormal against the PC Critical Injury and PC death targets", "Partly measured",
         "Sections 6.6, 6.7, and 6.9: the setup mix per Titan Engagement with and without its Abnormal roll, the Read "
         "rows, and Draw Attention (never from Distant), alone and once a Read reveals the ladder. Not measured: the "
         "setup table's Background Titans. The PC targets are Expedition targets (Phase 2), so figures are per Titan "
         "Engagement.", ["two_titans"]),
        ("Two Focus Titans of different Size Classes in the Jam test", "Partly measured",
         "Section 4.2: the probes' Jam model with mixed pairs. Not measured: two Focus Titans inside one full fight.",
         ["two_titans"]),
        ("The four-striker Squad (4 eager strikers and no cutters) beside the baseline Squad on every table",
         "Measured", "Sections 2.1, 2.3, 3, and 6.8, with 3 strikers and 1 cutter beside it (OQ-112's case).", []),
        ("The start-of-fight Fear Rolls", "Measured", "Every case whose start calls for them; mounted starts (section 9).", []),
    ],
    "data/engagement/tuning.yaml": [
        ("Every Chapter 1 to 5 rule under published policies", "Partly measured",
         "The rules section 14 lists as modelled, under the policies in `tools/sim/policy.py`. Not measured: two "
         "Focus Titans in one fight, Background Titans, leaving and returning outside a retreat, and the Veteran's "
         "Scar rows. The simulator has not been audited rule by rule against Chapters 1 to 5, so this list may be "
         "incomplete.", ["two_titans", "veteran_scars"]),
        ("Read and Call It", "Measured",
         "Sections 4.3 (the full-fight Jam test with a Tactician) and 6.6. The PC Critical Injury target is an "
         "Expedition target, so figures are per Titan Engagement.", []),
        ("Wings under the standing cadence", "Measured", "Section 7: Wings, swaps, and both.", []),
        ("Every Squad Tactic alone and in pairs with the six Grab cells", "Measured",
         "Section 6.3, under the one tactic policy per Tactic in `policy.py`.", []),
        ("Pry Loose, Help on Break Free, and Break Attention rescues", "Measured",
         "Sections 6.3 and 7, under the rescue policies in `policy.py`, and in the retreat (section 6.12).", []),
        ("Decoy screens from distant and beside the Attention holder", "Measured",
         "Sections 9 and 10; the Expedition PC Critical Injury target is read per Titan Engagement.", []),
        ("Background Titans, the retreat clock, and the retreat", "Partly measured",
         "Section 6.12: the retreat clock and the retreat in every full fight, the safety cap counted, the committed "
         "rows re-run under the clock (sections 9 and 10), and a retreat policy that treats and pries. Not measured: "
         "Background Titans and their clock lengths.", ["two_titans"]),
        ("Treatment in the care windows between fights", "Partly measured",
         "Section 6.11: sequences with the care windows, Death Rolls, the interim day, and the interim issue, under a "
         "provisional cadence of sessions and fights, kept with the interim day until the simulator models the "
         "Expedition cadence of decision batch 7 (7-14). Death Rolls and the care window are in every full fight.",
         ["sequence"]),
        ("The targets as amended", "Measured",
         "Sections 1, 2.2, 2.3, 3, and 4.2: each target and band judged Met or Missed on its tolerance, with the "
         "second-seed rule.", []),
        ("Eyes and arm Toughness for every Size Class", "Partly measured",
         "Sections 6.5, 9, and 10: eyes on every table whose entries use them (only the standard Medium Titan's), "
         "each table at its own arm Toughness, and Chapter 5's Size Class and rejected-alternative rows. Not "
         "measured: eye strikes on Chapter 5's reference Titan at the Small and Large Size Classes, and any change "
         "to arm Toughness. The PC targets are read per Titan Engagement.", ["eyes_arms"]),
        ("The Jam test inside the full-fight model", "Partly measured",
         "Section 4.3 for one Focus Titan. Not measured: two Focus Titans.", ["two_titans"]),
        ("The reports ADR-0014 names", "Measured", "Sections 2.3, 2.4, 6.1, and 6.2.", []),
        ("Round-time counters", "Partly measured", "Section 6.10 for one Focus Titan. Not measured: two Focus Titans.",
         ["two_titans"]),
        ("Each Behavior Table's kill share", "Measured", "Section 4.1.", []),
        ("The gap between these probes and the Opus review 1 model", "Not measured",
         "That model is not committed.", ["opus_model"]),
        ("Every case Chapter 6 adds", "Partly measured", "As the data/titans/tuning.yaml rows above.", ["two_titans"]),
        ("The four-striker Squad (4 eager strikers and no cutters) beside the baseline Squad on the reference Titan",
         "Measured", "Sections 2.1, 3, and 6.8.", []),
        ("Horsemanship's dice on a dodge made with the horse only", "Partly measured",
         "Every case: Horsemanship's dice join a dodge only while mounted with the horse as its gear item "
         "(`dice.roll`, read from `data/character/talents.yaml`, `condition`); Draw Attention only from a Position "
         "other than Distant (section 6.7); the Grab's hold before its crush (`engine.Fight.grab_lands`). Not "
         "measured: the fall's reference Titan among two Focus Titans; with one Focus Titan it is always that Titan.",
         ["two_titans"]),
        ("Failed Nape strikes", "Not measured",
         "Round 3 review 1 (C6) added this case with ADR-0010's amendment and nothing measures it yet: the engine "
         "counts no failed-strike outcome, so neither the share of failed strikes whose striker takes the Titan's "
         "next resolved behavior nor the striker's second-strike rate is reported. It is read against the "
         "lone-strike band when the instrumentation lands.", []),
        ("The behavior roll under Frenzy", "Partly measured",
         "Section 6.15 reports, per case, the share of resolved cards that retargeted, the share whose rolled entry "
         "reached nobody, the Thrash share, and the share of behavior rolls Frenzy lifted off the die's face. Not "
         "measured: the kill share by previous behavior and Broken parts broken out by Frenzy, and the share of "
         "rolls resolving each table's result-1 entry by Frenzy, which section 4.1 still reports at Frenzy 0 only.",
         []),
        ("The Expedition targets, once the Expedition rules exist.", "Deferred", "No Expedition rules in Phase 1.", []),
    ],
}


def coverage_rows():
    rows = []
    for path, items in COVERAGE.items():
        texts = load(path.replace("data/", ""))["simulator_cases"]
        if len(texts) != len(items):
            raise ValueError(f"{path} simulator_cases has {len(texts)} items; report.py maps {len(items)}")
        for i, (text, (start, status, where, oqs)) in enumerate(zip(texts, items)):
            if not text.startswith(start):
                raise ValueError(f"{path} simulator_cases item {i} changed: {text[:60]!r}")
            rows.append((path, i, text, status, where, [OQ_NOT_MEASURED[o] for o in oqs]))
    return rows


# ---------------------------------------------------------------------- the report
def write(res, full=True, render=None, stale=()):
    global PF
    PF = committed_figures(res)
    by = {c["key"]: c for c in res["cases"]}
    S = lambda k: by[k]["summary"]   # noqa: E731
    has = lambda k: k in by          # noqa: E731
    cmps = comparisons(res)
    cidx = {(c["key"], c["field"], c["source"]): c for c in cmps}
    rechecks = res.get("rechecks", {})
    titles = read_oq_titles()
    cited = {}
    missed = []
    unjudged = []
    with open(ADR14) as fh:
        adr = fh.read()

    def oq(i):
        if i not in titles:
            raise ValueError(f"{i} is cited but has no heading in docs/rules/OPEN-QUESTIONS.md")
        cited[i] = titles[i]
        return i

    for o in OQ_NOT_MEASURED.values():
        oq(o)

    def result(name, ok, text):
        if ok:
            return "Met"
        o = next((v for p, v in MISSED_OQ.items() if name.startswith(p)), None)
        missed.append((name, text, o))
        return f"Missed ({oq(logged_oq(o))})" if o else "Missed (no Open Question logged)"

    def zc(key, field, source):
        c = cidx.get((key, field, source))
        return zf(c["z"]) if c else ""

    def vs(s, t, field):
        return z(s[field], s[field + "_se"], t[field], t[field + "_se"])

    L = []
    w = L.append
    main_cases = [c for c in res["cases"] if "first_key" not in c]
    total = sum(c["n"] for c in res["cases"])
    snap = res["snapshot"]
    changed_during = list(res.get("snapshot_changed_during_run", []))
    render = render or {}
    sim_dir = os.path.relpath(HERE, ROOT)
    rep_key = os.path.join(sim_dir, "report.py")
    engine_changed = bool(render) and render.get("engine_hash") != snap["engine_hash"]

    w("# Simulator report: Wings of Freedom Phase 1\n")
    w("Generated by `tools/sim/report.py` from `tools/sim/results/results.json`. Do not edit by hand. From the "
      f"repository root, `{COMMAND}` runs every case and regenerates this file; `{COMMAND} --report` re-renders "
      "it from the results and refuses if any file of the rules snapshot has changed since the run.\n")
    if res["scale"] != 1:
        w(f"**Smoke run at scale {res['scale']:g}: every case ran a fraction of its trials. No figure here is the "
          "report's.**\n")
    w(f"- **Run:** {len(main_cases)} cases and {len(res['cases']) - len(main_cases)} second-seed runs, {total:,} "
      f"trials, plus {len(rechecks)} re-checked cases; {res['runtime_seconds']:.0f} seconds on {res['cpus']} "
      f"processes.")
    after_snap = res.get("snapshot_after_run")
    rules_changed = [p for p in changed_during if not p.startswith(sim_dir + os.sep)]
    sim_changed = [p for p in changed_during if p.startswith(sim_dir + os.sep)]
    w(f"- **Rules snapshot:** rules hash `{snap['rules_hash'][:16]}` (every file under `docs/rules/`, `docs/adr/`, "
      f"and `data/`, except `docs/rules/OPEN-QUESTIONS.md` and `docs/rules/PROGRESS.md`); engine hash "
      f"`{snap['engine_hash'][:16]}`; taken {snap['taken_utc']}, when the run started. The file list and each file's "
      "hash are in section 13. The snapshots are taken when the run starts and when it ends, so an edit made and "
      "undone while it ran would not show in them."
      + ((" **Rules files changed while the run was going:** "
          + "; ".join(f"`{p}` ({SNAPSHOT_CHANGE_NOTES.get(p, 'change not explained')})" for p in rules_changed)
          + (f". The snapshot taken after the run gives rules hash `{after_snap['rules_hash'][:16]}`; section 13 lists "
             "both hashes of each changed file." if after_snap else "."))
         if rules_changed else " No rules file changed while the run was going.")
      + (" Report-rendering files edited while the run was going (not in the engine hash): "
         + ", ".join(f"`{p}`" for p in sim_changed) + "." if sim_changed else ""))
    commits = res.get("post_run_commits", {})
    if commits:
        w(f"- **Changed after the run ({len(commits)} files, each accepted at the hash shown by `run.py "
          f"--commit-probe-figures` or `--accept-noted-changes`):** {POST_RUN_CHECKS}")
        for p, h in sorted(commits.items()):
            w(f"  - `{p}` (now `{h[:12]}`): {SNAPSHOT_CHANGE_NOTES.get(p, 'not explained')}.")
    if render:
        w(f"- **Rendered:** {render['taken_utc']} by `{rep_key}` `{render['files'].get(rep_key, '')[:12]}` (the run's "
          f"snapshot recorded `{snap['files'].get(rep_key, 'none')[:12]}`); engine hash when rendered "
          f"`{render['engine_hash'][:16]}`" + (", the run's engine." if not engine_changed else
                                               ", not the run's engine."))
    if stale:
        w("- **Rendered from results whose snapshot is out of date** (`run.py --report --stale-ok`). These files "
          "differ from the run's snapshot: " + ", ".join(f"`{p}`" for p in stale) + ". Every figure comes from the "
          "run. The text, the verdicts, and sections 12 and 14 come from the files as they are now.")
    if engine_changed and ENGINE_CHANGES_SINCE_RUN:
        w("- **Engine changes the figures do not include yet.** The next full run replaces every figure with the "
          "current engine's:")
        for line in ENGINE_CHANGES_SINCE_RUN:
            w("  - " + line)
    w("- **Death readings:** *deaths through the end* counts every death the Titan Engagement causes, including "
      "the Death Rolls and aftermath of its end steps (`data/engagement/engagement-end.yaml`). This is the rules' "
      "reading, and every band and bar limit is judged on it. *Deaths during the fight* counts deaths during the "
      "fight and soldiers left behind, as the probes did, and is the reading compared with committed figures. "
      f"Every full fight runs under the retreat clock of {R.retreat_clock} segments, so every Titan Engagement ends "
      "by a kill or through the retreat (section 6.12).")
    w("- **Committed figures compared:** `data/titans/probe-figures.yaml` and `data/engagement/tuning.yaml`. "
      "Committed figures are in parentheses. z is the simulator's figure minus the committed one, over the "
      "standard error of the difference.\n")
    summary_at = len(L)

    # ================================================================== 1. targets
    w("## 1. ADR-0014 targets\n")
    w("Every target is judged Met or Missed on the tolerance ADR-0014 (as amended in decision batch 5, "
      f"{oq('OQ-127')}) and the tuning files write: `data/engagement/tuning.yaml` (each target's `tolerance`), "
      "cross-checked against `data/titans/tuning.yaml` (`targets`, `adr_0014_targets_quoted`, `bands`). A median is "
      f"read exactly. A figure past a band's edge by at most {R.target_standard_errors} standard errors on its first "
      "seed is re-run on a second seed and judged on the figure pooled over both runs (`tools/sim/targets.py`); past "
      "that it is Missed.\n")
    main_summ = {c["key"]: c["summary"] for c in main_cases}
    judged = TG.judge(main_summ, res.get("pooled", {}))
    JV = {}
    for row in judged:
        JV[row["id"]] = (row, result(row["id"], row["met"], judged_text(row)))

    def jres(i):
        return JV[i][1]

    def group_res(prefix):
        rows_ = [v for k, v in JV.items() if k.startswith(prefix)]
        bad = [t for r_, t in rows_ if not r_["met"]]
        return "Met" if not bad else bad[0] + (f" ({len(bad)} of {len(rows_)} figures)" if len(rows_) > 1 else "")
    quoted = T6["targets"]["adr_0014_targets_quoted"]
    T = R.tolerances
    ref_med = "ch6/" + C.reference_label("standard-medium")
    t1, t1c = S(ref_med), S("ch5/reference")
    nd = R.titan_blocks["standard-medium"]["nape_depth"]
    rs = R.builds["rookie"]["stress"]
    ls = R.builds[dice.BUILD_ALIASES.get("levi_grade", "levi_grade")]["stress"]
    rookie, levi = S(f"solo/nd{nd}/rookie/stress{rs}"), S(f"solo/nd{nd}/levi_grade/stress{ls}")
    nst, ngr = R.grab_named_cell
    cells = {(st, g): S(f"grab/standard-medium/{C.cell_label(st, g)}") for st, g in R.grab_cells}
    worst = max(c["dead"] for c in cells.values())
    cell_limit = T["grab_every_cell"]["hi"]
    gas_std, gas_push = S("gas/standard"), S("gas/after_pushed_odm_roll")
    r1, r2, r3 = jres("target-1"), jres("target-2"), jres("target-3")
    r4a, r4n, r4 = jres("target-4-alone"), jres("target-4-named"), group_res("target-4-cell-")
    r5 = group_res("target-5-")
    rows = [
        [1, "A prepared Squad of 4 kills a standard Medium Titan", "median kill round, the standard Medium Titan's reference start",
         f"round {t1['median']} ({med_detail(t1)})", T["median_kill_round"]["text"], r1],
        ["", "", "killed by round 3, reported", f"{t1['by3']:.1f}% +/- {t1['by3_se']:.1f}",
         f"ADR-0014's words: \"{quoted['prepared_squad']}\"", "Reported"],
        ["", "", "Chapter 5's reference Titan, reported", f"round {t1c['median']} ({med_detail(t1c)})", "reported", "Reported"],
        [2, "A lone Rookie's cut directly after Break Attention", f"Stress {rs}, Nape Depth {nd}",
         f"{judged_value(JV['target-2'][0])} of {rookie['cuts']:,} cuts ({rookie['cut_share']:.1f}% of "
         f"{rookie['trials']:,} trials reach the cut)", T["rookie_fresh_cut"]["text"], r2],
        [3, "A Levi-grade soldier pushing hard", f"Stress {ls}, Nape Depth {nd}",
         f"{judged_value(JV['target-3'][0])} of {levi['cuts']:,} cuts", T["levi_grade"]["text"], r3],
        [4, "A Grab kills", "alone, after a failed dodge", judged_value(JV["target-4-alone"][0]), T["grab_alone"]["text"], r4a],
        ["", "", f"one comrade, Stress {nst}, Grief {ngr}", judged_value(JV["target-4-named"][0]),
         T["grab_named_cell"]["text"], r4n],
        ["", "", "one comrade, each of the six cells",
         f"worst {worst:.1f}% (cells {min(c['dead'] for c in cells.values()):.1f}% to {worst:.1f}%)",
         f"every cell {T['grab_every_cell']['text']}", r4],
        [5, "A full gas canister", "median rounds, the standard Gas Roll", f"{gas_std['median']} (mean {gas_std['mean']:.2f})",
         T["gas_standard"]["text"], jres("target-5-standard")],
        ["", "", "median rounds, the Gas Roll after a Pushed ODM roll", f"{gas_push['median']} (mean {gas_push['mean']:.2f})",
         T["gas_pushed"]["text"], jres("target-5-pushed")],
        [6, "Expedition targets", "", "not run", "Phase 2 rules", "Deferred"],
    ]
    w(table(["#", "Target", "Part", "Simulator", "Tolerance", "Result"], rows))
    w("")
    w("Target 1 reads the Squad of 4 player characters the target names, under the baseline policy. ADR-0014's "
      "default Squad adds 2 helper Squadmates; that row is in section 2.1. Target 2 is read on the fresh cut "
      "(`data/engagement/tuning.yaml`, `solo_nape`, `measurement_point`). A trial whose Break Attention rolls all "
      "fail, or whose ODM Gear Jams first, reaches no cut; the band reads the cuts. A figure shown with *second seed, "
      "pooled* was past an edge by at most "
      f"{R.target_standard_errors} standard errors on its first seed and is judged on the pooled figure.\n")

    prev = res.get("previous_headlines")
    cur = headlines(res)
    moved = []
    w("### 1.1 Headline figures against the previous run\n")
    if prev:
        pmap = {n: (v, se) for n, v, se in prev}
        rows = []
        for name, v, se in cur:
            pv, pse_ = pmap.get(name, (None, None))
            if v is None or pv is None:
                rows.append([name, "n/a" if pv is None else f"{pv:.4g}", "n/a" if v is None else f"{v:.4g}", "",
                             "not in both runs"])
                continue
            zz = z(v, se, pv, pse_) if se and pse_ else None
            if zz is not None:
                mv, reading = abs(zz) > 2, ("moved" if abs(zz) > 2 else "unchanged within 2 standard errors")
            elif float(v).is_integer() and float(pv).is_integer():
                mv, reading = v != pv, ("moved" if v != pv else "unchanged")
            else:
                mv, reading = False, ("unchanged" if v == pv else "changed slightly; no standard error to judge it")
            if mv:
                moved.append(f"{name} {pv:.4g} to {v:.4g}")
            rows.append([name, f"{pv:.4g}", f"{v:.4g}", zf(zz) if zz is not None else "", reading])
        w(table(["Figure", "Previous run", "This run", "z", "Reading"], rows))
        w("\nA figure with a standard error has moved when z exceeds 2; a median has moved when it changes. Any "
          "engine change shifts the random draws that follow it, so a small change on the same seeds is sampling.\n")
    else:
        w("No previous results were on disk when this run started.\n")

    # ================================================================== 2. beside the targets
    w("## 2. Reported beside the targets\n")
    w("### 2.1 Beside Target 1: the Squads, Health, and sensitivity rows\n")
    w("Every row below is the standard Medium Titan in Wooded terrain, 4 player characters at the reference start, "
      "with the change named. z is against the reference start (first row). * marks a median on the boundary: the "
      "share killed by the round before, or by the median round, is within 2 standard errors of 50%.\n")
    lab = lambda tid, rest: f"ch6/{tid}: {rest}"   # noqa: E731
    t1rows = [("the reference start (Target 1)", ref_med),
              ("4 player characters and 2 helper Squadmates (ADR-0014's default Squad)", lab("standard-medium", "4 player characters and 2 helper Squadmates")),
              ("template Squad", lab("standard-medium", "template Squad")),
              ("Free Build Squad (decision batch 7, 7-1; no committed figure)", "freebuild/standard-medium"),
              ("4 eager strikers and no cutters", lab("standard-medium", "4 eager strikers and no cutters")),
              ("3 eager strikers and 1 cutter", "ch6x/strikers: standard-medium: 3 eager strikers and 1 cutter"),
              ("a first Titan Engagement, with its Fear Roll", lab("standard-medium", "a first Titan Engagement, with its Fear Roll"))]
    for h in sorted(set(R.health_rows) - {R.builds["rookie"]["health"]}):
        t1rows.append((f"helpers, every soldier at Health {h}",
                       f"ch6x/health: standard-medium: 4 player characters and 2 helper Squadmates, every soldier at Health {h}"))
    t1rows.append(("a Tactician Squadmate Reads and Calls It",
                   "ch6x/read: standard-medium: a Tactician Squadmate Reads from Distant every round and Calls It"))
    for c in res["cases"]:
        if c["key"].startswith("rules/") and "standard-medium" in c["key"]:
            t1rows.append((c["label"].replace("standard-medium: ", ""), c["key"]))
    head = ["Row", "Median", "By round 3, %, z", "No kill, %", "Critical Injuries, z", "PC Critical Injuries",
            "Deaths during the fight", "Deaths through the end, z", "Grabs"]

    def sens_rows(pairs, twin_key):
        t = S(twin_key)
        out = []
        for label, k in pairs:
            if not has(k):
                continue
            s = S(k)
            same = k == twin_key
            out.append([label, med_txt(s), f"{f1(s['by3'])} {'' if same else zf(vs(s, t, 'by3'))}", f1(s["nokill"]),
                        f"{f2(s['cis'])} {'' if same else zf(vs(s, t, 'cis'))}", f2(s["pc_cis"]), f3(s["deaths"]),
                        f"{f3(s['deaths_all'])} {'' if same else zf(vs(s, t, 'deaths_all'))}", f3(s["grabs"])])
        return out
    w(table(head, sens_rows(t1rows, ref_med)))
    w("")
    w("The same Squads on Chapter 5's reference Titan (z against its reference row):\n")
    four5 = "ch6/four strikers: reference Medium Titan, 4 eager strikers and no cutters (Chapter 5's reference Titan)"
    w(table(head, sens_rows([("the reference start", "ch5/reference"), ("4 player characters and 2 helper Squadmates", "ch5/helpers"),
                             ("template Squad", "ch5/template"), ("Free Build Squad", "freebuild/reference-medium"),
                             ("4 eager strikers and no cutters (Chapter 5 row)", "ch5/four strikers"),
                             ("4 eager strikers and no cutters (Chapter 6 row)", four5),
                             ("3 eager strikers and 1 cutter", "ch6x/strikers: reference-medium: 3 eager strikers and 1 cutter"),
                             ("a Tactician Squadmate Reads and Calls It",
                              "ch6x/read: reference-medium: a Tactician Squadmate Reads from Distant every round and Calls It")],
                            "ch5/reference")))
    w("")

    w("### 2.2 Beside Targets 2 and 3: every table's cut\n")
    w("Targets 2 and 3 do not depend on the Squad, so no Squad row sits beside them. Fresh cut: directly after "
      "Break Attention, at the build's fight-start Stress. In-fight cut: the lone fight's waiting line, after the "
      "cards the soldier took while waiting.\n")
    rows = []
    for tid in C.TITANS + ["reference-medium"]:
        tnd = R.titan_blocks[tid]["nape_depth"]
        ro, le = S(f"solo/nd{tnd}/rookie/stress{rs}"), S(f"solo/nd{tnd}/levi_grade/stress{ls}")
        lk = f"lone/{tid}/waiting" if tid != "reference-medium" else "lone/ch5/tempo1"
        lo_ = S(lk)
        rows.append([tid, tnd, f"{f1(ro['hit'])} +/- {f1(ro['se'])} ({f1(ro['cut_share'])}% reach the cut)",
                     f"{f1(le['hit'])} +/- {f1(le['se'])}", f1(lo_["kill_given_strike"]), f2(lo_["stress_at_strike"]),
                     f1(lo_["usable_strike_share"])])
    w(table(["Titan", "Nape Depth", "Rookie fresh cut, %", "Levi-grade fresh cut, %", "In-fight cut (waiting), %",
             "Stress at the in-fight cut", "Lone fights reaching a usable strike, %"], rows))
    w("")

    w("### 2.3 Beside Target 4: Grab death shares, Health, and templates\n")
    w("**The share of Grabs the victims die from, in full fights** (ADR-0014: reported beside the target, not "
      "tuned). *Devoured* is the probes' reading; the committed figure is in parentheses. *Any death* also counts "
      "a Grabbed soldier who dies of a card's harm or a fall while held.\n")
    rows = []
    for tid in C.TITANS:
        for rest in ("4 player characters, eager, dodge when harmed (the reference start)",
                     "4 player characters, mounted, with the abnormal Fear Roll, eager, dodge when harmed (its reference start)",
                     "4 player characters and 2 helper Squadmates", "template Squad", "4 eager strikers and no cutters"):
            k = lab(tid, rest)
            if has(k):
                s, com = S(k), PF["fight"][k[4:]]
                rows.append([tid, rest.split(" (")[0], f3(s["grabs"]), f"{f1(s['devour_share'])} ({f1(com.get('devour_share'))})",
                             f1(s["grab_death_share"])])
    for label, k in (("Chapter 5 reference", "ch5/reference"), ("Chapter 5 helpers", "ch5/helpers"),
                     ("Chapter 5 template Squad", "ch5/template"), ("Chapter 5 four strikers", "ch5/four strikers")):
        s = S(k)
        rows.append(["reference-medium", label, f3(s["grabs"]), f1(s["devour_share"]), f1(s["grab_death_share"])])
    for tid in C.TITANS + ["reference-medium"]:      # decision batch 7, 7-1: reported, no committed figure
        if has(f"freebuild/{tid}"):
            s = S(f"freebuild/{tid}")
            rows.append([tid, "Free Build Squad", f3(s["grabs"]), f1(s["devour_share"]), f1(s["grab_death_share"])])
    w(table(["Titan", "Squad", "Grabs a fight", "Devoured, % of Grabs", "Any death, % of Grabs"], rows))
    w("")
    er = F.earlier_injury_row()
    w(f"**Health reports** (`data/engagement/tuning.yaml`, `grab`, `health_reports`), on Chapter 5's reference Titan. "
      f"Earlier injuries: untreated `{er['id']}` rows from the leg table, "
      f"{', '.join(f'{v} at Health {h}' for h, v in sorted(R.health_earlier.items()))}; comrade at Stress "
      f"{R.health_comrade[0]}, Grief {R.health_comrade[1]}.\n")
    rows = []
    for h in sorted(R.health_rows):
        cells_ = []
        for col in ("lone", "one_comrade", "fresh_lone"):
            k = f"grabx/health/{h}/{col}"
            c = cidx.get((k, "dead", "Chapter 5 reports"))
            cells_.append(f"{f1(S(k)['dead'])} ({f1(c['com'])}) {zf(c['z'])}")
        rows.append([h] + cells_)
    w(table(["Health", "Alone, with earlier injuries, %, z", "One comrade, with earlier injuries, %, z", "Alone, fresh, %, z"], rows))
    w("")
    w("**Template victims alone, after a failed dodge**, and **the template comrade with no strike Talent** "
      f"(`{C.no_strike_template()}`), on Chapter 5's reference Titan:\n")
    rows = []
    for tid, _ in R.grab_templates_alone:
        k = f"grabx/template_alone/{tid}"
        c = cidx[(k, "dead", "Chapter 5 reports")]
        rows.append([f"{tid} alone", f"{f1(S(k)['dead'])} ({f1(c['com'])}) {zf(c['z'])}"])
    for st, g in R.grab_cells:
        k = f"grabx/template_comrade/{C.no_strike_template()}/{C.cell_label(st, g)}"
        c = cidx[(k, "dead", "Chapter 5 reports")]
        rows.append([f"template comrade, Stress {st}, Grief {g}", f"{f1(S(k)['dead'])} ({f1(c['com'])}) {zf(c['z'])}"])
    w(table(["Cell", "Grab death, %, z"], rows))
    if has("grabx/free_build_alone"):
        w("")
        w("**The Free Build soldier** (decision batch 7, 7-1; ADR-0014 as amended: reported beside the Talent-dependent "
          "targets, not tuned), with Talent 2 on the roll each row measures (Break Free for the victim alone, the Body "
          "Part strike for the comrade) and Talent 1 on the other three, on Chapter 5's reference Titan. No committed "
          "figure exists:\n")
        rows = [["Free Build victim alone", f"{f1(S('grabx/free_build_alone')['dead'])} +/- {f1(S('grabx/free_build_alone')['se'])}"]]
        for st, g in R.grab_cells:
            k = f"grabx/free_build_comrade/{C.cell_label(st, g)}"
            rows.append([f"Free Build comrade, Stress {st}, Grief {g}", f"{f1(S(k)['dead'])} +/- {f1(S(k)['se'])}"])
        w(table(["Cell", "Grab death, % +/- standard error"], rows))
    w("\nSquad Tactics and Pry Loose over the six cells: section 6.3.\n")

    w("### 2.4 The dodges reported beside the targets\n")
    w("`data/engagement/tuning.yaml`, `reported_beside_targets`: the historical figures at a fixed need, from before "
      "Attack Dice (decision batch 8, 8-1). It states no trial count, so z uses the simulator's standard error alone.\n")
    rows = []
    for key, spec in R.dodge_reports.items():
        for needs_n, _ in spec["figures"]:
            without = f"dodge/{key}/needs_{needs_n}/without_stress_responses"
            withk = f"dodge/{key}/needs_{needs_n}/with_stress_responses"
            c = cidx[(without, "rate", "Chapter 5 reports")]
            rows.append([key.replace("_", " "), needs_n, f"{f1(S(without)['rate'])} ({f1(c['com'])}) {zf(c['z'])}",
                         f1(S(withk)["rate"])])
    w(table(["Dodge", "Needs", "Without Stress Responses, %, z", "With Stress Responses, %"], rows))
    w("")
    rows = []
    for c_ in res["cases"]:
        k_ = c_["key"]
        if c_["family"] == "dodge" and "/dice_" in k_ and k_.endswith("/without_stress_responses"):
            rows.append([k_.split("/")[1].replace("_", " "), k_.split("/")[2].split("_")[1], f1(S(k_)["rate"]),
                         f1(S(k_.replace("/without_", "/with_"))["rate"])])
    if rows:
        w("Against Attack Dice (decision batch 8, 8-1; reported, no committed figure): the share of cards that do not "
          "land on the soldier, a whiff or a dodge that cancels every Titan success, Pushing when short.\n")
        w(table(["Dodge", "Attack Dice", "Not landed, without Stress Responses, %", "Not landed, with them, %"], rows))
        w("")

    # ================================================================== 3. Chapter 6 bands
    w("## 3. Chapter 6 targets per table\n")
    w("`data/titans/tuning.yaml`, `targets`, at each table's reference start, and on the bar's runs of that same "
      "start in both Squad sheet orders (section 5), each judged on its own. Each range or limit is its own band, "
      "read as written, and a median is read exactly (`adr_0014_targets_quoted`, `bands`, `per_table`). A figure "
      f"past an edge by at most {R.target_standard_errors} standard errors is judged on its second seed, pooled. "
      "Deaths are judged through the end of the Titan Engagement, with deaths during the fight printed beside them. "
      "No kill is the share of fights that end with the Focus Titan alive under the retreat clock. The four-striker "
      "row is beside each figure, reported and not judged.\n")
    rows = []
    band_missed = []
    for i, (row, res_txt) in JV.items():
        if not i.startswith("band/"):
            continue
        _, tid, k = row["group"].split("/")
        s = S(row["key"])
        f = row["field"]
        shown = f"{s['median']} ({med_detail(s)})" if f == "median" else judged_value(row)
        if f == "deaths_all":
            shown += f" (during the fight {s['deaths']:.4f})"
        if not row["met"]:
            band_missed.append(row["name"])
        fs = S(lab(tid, "4 eager strikers and no cutters"))
        where = ("reference start" if row["key"].startswith("ch6/")
                 else "bar run, " + row["key"].split("/")[1].replace("_", " "))
        rows.append([tid, k.replace("_", " "), where, shown, row["tol"]["text"], res_txt,
                     fs[f] if f == "median" else (f"{fs[f]:.1f}%" if f in PCT else f"{fs[f]:.3f}")])
    w(table(["Titan", "Figure", "Row", "Simulator", "Band", "Result", "Four strikers"], rows))
    w("")

    # ================================================================== 4. every standard table
    w("## 4. Every standard table\n")
    texts = T6["targets"]["every_standard_table"]
    jam_text = next(t for t in texts if "Jam test" in t)
    need(r"worst cell stays under a third", jam_text, "every_standard_table, the Jam test")
    share_text = next(t for t in texts if "kill share" in t)
    share_lim = FRACTION_WORDS[need(r"exceeds (one half)", share_text, "every_standard_table, kill share").group(1)]
    cnt = need(r"At most (\w+) result gives a grab effect and at most (\w+) a Critical Injury that can be lethal",
               next(t for t in texts if "grab effect" in t), "every_standard_table, counts")
    grab_lim, lethal_lim = NUMBER_WORDS[cnt.group(1)], NUMBER_WORDS[cnt.group(2)]
    ir = need(r"at least (\w+) results in (\w+)", next(t for t in texts if "In Reach" in t), "every_standard_table, In Reach")
    ir_lim = NUMBER_WORDS[ir.group(1)]
    w("### 4.1 Kill shares, Grab and lethal results, and In Reach\n")
    w("`families.share_report` drives `Titan.roll_nb` through each of the six results with a fixed die, for every "
      "previous behavior and every count of Broken eyes, arms, and legs. The move-up and the Thrash fallback are "
      "therefore the engine's own. Grab and lethal counts read each entry's effects. The In Reach count asks "
      "`Titan.choose` whether a holder at In Reach meets each entry's Position requirement. The last column "
      "compares every state with `data/titans/probe-figures.yaml` (`shares`).\n")
    rows = []
    share_fail = []
    for tid in C.TITANS:
        sh = res["shares"][tid]
        std = tid in STANDARD
        judge = (lambda name, ok, txt: result(name, ok, txt)) if std else (lambda name, ok, txt: "Reported (not a standard table)")
        r_share = judge(f"shares/{tid}/kill", sh["max_kill_share"] <= share_lim, f"{tid} kill share {sh['max_kill_share']}")
        r_grab = judge(f"shares/{tid}/grab", sh["grab_results"] <= grab_lim, f"{tid} {sh['grab_results']} Grab results")
        r_leth = judge(f"shares/{tid}/lethal", sh["lethal_results"] <= lethal_lim, f"{tid} {sh['lethal_results']} lethal results")
        r_ir = judge(f"shares/{tid}/in_reach", sh["in_reach_results"] >= ir_lim, f"{tid} {sh['in_reach_results']} In Reach results")
        for r_ in (r_share, r_grab, r_leth, r_ir):
            if r_.startswith("Missed"):
                share_fail.append(tid)
        com = PF["shares"].get(tid)
        if com:
            diff = 0
            for part in ("by_previous_behavior", "by_broken_parts"):
                keys = set(com[part]) | set(sh[part])
                diff += sum(1 for k in keys if com[part].get(k) != sh[part].get(k))
            match = "every state matches" if diff == 0 else f"{diff} states differ"
        else:
            match = "not committed"
        ws = sh["worst_state"]
        state = f"after {ws['previous']}, " + (", ".join(f"{k} {v}" for k, v in ws["broken"].items() if v) or "nothing Broken")
        rows.append([tid, sh["states"], f"{sh['max_kill_share']:.3f} ({state}); {r_share}",
                     f"{sh['grab_results']}; {r_grab}", f"{sh['lethal_results']}; {r_leth}",
                     f"{sh['in_reach_results']} of 6; {r_ir}", match])
    w(table(["Titan", "States", f"Highest kill share (at most {share_lim:g})", f"Grab results (at most {grab_lim})",
             f"Lethal results (at most {lethal_lim})", f"In Reach results (at least {ir_lim})", "Against committed shares"], rows))
    w("")

    w("### 4.2 The Jam test, as the probes model it\n")
    w("The holder alone for the Jam test's rounds, with Help and Covering given (`data/engagement/tuning.yaml`, "
      "`jam_test`; OQ-96). Each card rolls its Attack Dice, and the holder's one dodge against a Titan in a round "
      "answers its first card with a success (decision batch 8, 8-1). The table reading is the acceptance reading. "
      "Every card at the kill pool is an upper bound, and the mounted reading is Chapter 6's.\n")
    lim_pct = 100 * R.jam_limit_value
    rows = []
    jam_missed = []
    for tid in C.TITANS:
        for reading in ("table", "kill", "mounted"):
            for nt in (1, 2):
                pre = f"jam/{tid}/{reading}/{nt}_titans/"
                cellv = {k[len(pre):]: by[k]["summary"] for k in by if k.startswith(pre)}
                wc = max(cellv, key=lambda c: cellv[c]["jammed"])
                com = PF["jam"][tid][reading][f"{nt}_titans"]["worst"]
                v = cellv[wc]["jammed"]
                if reading == "table" and tid in STANDARD:
                    rr = group_res(f"jam/{tid}/{nt}/")     # every cell judged (targets.py), under a third
                    if rr != "Met":
                        jam_missed.append(f"{tid} ({nt} Titans)")
                else:
                    rr = "under a third" if v < lim_pct else "over a third"
                rows.append([tid, reading, nt, f"{v:.1f} +/- {cellv[wc]['se']:.1f} ({wc})", f"{com['value']} ({com['cell']})", rr])
    for k in sorted({k.rsplit("/", 1)[0] for k in by if k.startswith("jam/mixed")}):
        cellv = {kk.rsplit("/", 1)[1]: by[kk]["summary"]["jammed"] for kk in by if kk.startswith(k + "/")}
        wc = max(cellv, key=cellv.get)
        _, name, reading, _ = k.split("/")
        rows.append([name.replace("mixed ", ""), reading, 2, f"{cellv[wc]:.1f} ({wc})", "not run by the probes",
                     "under a third" if cellv[wc] < lim_pct else "over a third"])
    w(table(["Titans", "Reading", "Titans in the cell", "Simulator worst cell, %", "Committed worst cell, %", "Result"], rows))
    w("")

    w("### 4.3 The Jam test inside the full fight\n")
    w(f"Full fights stopped after {R.jam_rounds} rounds (`data/engagement/tuning.yaml`, `jam_test`), each Titan's "
      "reference start, one Focus Titan. Helpers' own cards, Positions, and unspent actions decide who can Help and "
      "Cover. The figure is the share of fights in which a dodge Jams some soldier's ODM Gear. That is an upper "
      "bound on the holder's Jam, since a later holder counts too. The limit of a third is set for a different "
      f"quantity: one holder dodging every round for three rounds on the worst legal support pattern ({oq('OQ-72')}, "
      f"{oq('OQ-96')}), which section 4.2 judges. A fight in which Attention moves stays far below that, so these "
      "figures are reported, not judged. **Not measured:** two Focus Titans in one full fight "
      f"({oq(OQ_NOT_MEASURED['two_titans'])}).\n")
    rows = []
    jamfight_worst = []
    for tid in C.TITANS + ["reference-medium"]:
        cells_ = []
        worst_ = None
        for name, _ in C.JAM_SUPPORT:
            s = S(f"jamfight/{tid}/{name}")
            cells_.append(f"{s['jam_dodge_fight']:.1f} ({s['jam_fight']:.1f})")
            if worst_ is None or s["jam_dodge_fight"] > worst_[1]["jam_dodge_fight"]:
                worst_ = (name, s)
        v = worst_[1]["jam_dodge_fight"]
        rr = "Reported"
        jamfight_worst.append(v)
        rows.append([tid] + cells_ + [f"{v:.1f} +/- {worst_[1]['jam_dodge_fight_se']:.1f} ({worst_[0]}); {rr}"])
    w(table(["Titan"] + [n for n, _ in C.JAM_SUPPORT] + ["Worst"], rows))
    w("\nEach cell: % of fights with a Jam on a dodge (with a Jam from any roll).\n")

    # ================================================================== 5. the bar
    w("## 5. The Sprinting Abnormal's bar\n")
    w(f"Every Abnormal row against its standard Medium and Large twins, {R.bar_fights:,} fights a row in each Squad "
      "sheet order, read as `data/titans/tuning.yaml` (`targets`, `abnormals`) states. A limit holds on the "
      f"permitted side of the twin, and holds within sampling when past it by at most {R.bar_standard_errors} "
      "standard errors of the difference. A row past that under either death reading is re-run on a second seed, "
      "in the same order and with its twins, and fails only if the figure pooled over both seeds is past. The "
      "median is read exactly, on the first seed. z is how far past the limit the Abnormal is; negative is on the "
      "permitted side. **The verdict reads deaths through the end of the Titan Engagement.** Deaths during the "
      "fight, the probes' reading, are the second table.\n")
    rows_def = PF["bar"]["rows"]
    ref_bar = rows_def[0]["medium"]
    pooled = res.get("pooled", {})
    LIMITS = ("Critical Injuries floor", "winnable", "ceiling", "reference deaths")

    def bar_table(prefix, reading, title, judged):
        out_rows, fails, reported_past = [], [], []
        for r in rows_def:
            # Round 3 retune, R7: a row that gives the Abnormal a ladder it does not have is run with its twins and
            # rendered with its z, but never judged, so a limit past on it is reported and is no Missed result.
            reported_row = r["abnormal"] in R.bar_reported_rows
            for order, _, _ in C.ORDERS:
                keys = [f"{prefix}/{order}/{r['abnormal']}", f"bar/{order}/{r['medium']}", f"bar/{order}/{r['large']}",
                        f"bar/{order}/{ref_bar}"]
                is_ref = PF["fight"][r["abnormal"]]["cfg"].get("reference")
                first = B.check(*[S(k) for k in keys], is_ref, reading)
                second = B.check(*[pooled[k] for k in keys], is_ref, reading) if all(k in pooled for k in keys) else None
                cells_ = []
                for name in LIMITS:
                    if name not in first:
                        cells_.append("")
                        continue
                    txt, zz, st = first[name]
                    cell = f"{txt}, {zf(zz)}, {st}"
                    failed = False
                    if st == "past":
                        if second is not None:
                            ptxt, pz, pst = second[name]
                            cell += f"; pooled over two seeds {ptxt}, {zf(pz)}, {pst}"
                            failed = pst == "past"
                        else:
                            cell += "; no second seed run"
                            failed = True
                    if failed:
                        if reported_row:
                            reported_past.append((r["abnormal"], order, name, second[name][1] if second else zz))
                            cell += "; past (reported: a ladder it does not have, R7)"
                        else:
                            fails.append((r["abnormal"], order, name))
                            if judged:
                                cell += "; " + result(f"bar/{prefix}/{reading}/{r['abnormal']}/{order}/{name}", False,
                                                      f"bar ({prefix}, {reading}): {r['abnormal']}, {order}, {name}")
                            else:
                                cell += "; past (reported)"
                    cells_.append(cell)
                if first["median"][2] == "past":
                    if reported_row:
                        reported_past.append((r["abnormal"], order, "median", None))
                    else:
                        fails.append((r["abnormal"], order, "median"))
                        if judged:
                            result(f"bar/{prefix}/{reading}/{r['abnormal']}/{order}/median", False,
                                   f"bar ({prefix}): {r['abnormal']}, {order}, median {first['median'][0]}")
                out_rows.append([r["abnormal"].replace("sprinting-abnormal: ", ""), order.replace("_", " "),
                                 first["median"][0]] + cells_)
        w(f"### {title}\n")
        w(table(["Abnormal row", "Order", "Median", "Critical Injuries vs Medium twin", "No kill, % vs Large twin",
                 "Deaths vs Large twin", "Reference deaths vs Medium reference"], out_rows))
        w("")
        return fails, reported_past

    def fails_txt(fl):
        return ("every row holds every limit in both orders" if not fl else
                "fails " + "; ".join(f"{a.replace('sprinting-abnormal: ', '')} ({o.replace('_', ' ')}, {n})" for a, o, n in fl))

    def reported_txt(rp):
        """Round 3 retune, R7: the ladder rows are run with their twins and reported beside the bar, never judged."""
        head = "Reported beside the bar, not judged (`tuning.yaml`, `reported_rows`): "
        if not rp:
            return head + "every limit of the two ladder rows holds in both orders"
        parts = []
        for a, o, n, zz in rp:
            pooled_note = f" (pooled over two seeds, {zf(zz)})" if zz is not None else ""
            parts.append(f"{a.replace('sprinting-abnormal: ', '')}, {o.replace('_', ' ')}, {n} past{pooled_note}")
        return head + "; ".join(parts) + "; every other limit of the two ladder rows holds in both orders"
    bar_full, bar_full_reported = bar_table("bar", "full", "5.1 The bar, deaths through the end of the Titan Engagement (the verdict)", True)
    w(f"**Verdict:** {fails_txt(bar_full)}.\n")
    w(f"{reported_txt(bar_full_reported)}.\n")
    bar_fight, _ = bar_table("bar", "in_fight", "5.2 The bar, deaths during the fight (the probes' reading)", False)
    w(f"**Under the probes' reading:** {fails_txt(bar_fight)}.\n")
    over, gsev, lsev = C.grab_alone_over()
    g_full, _ = bar_table("grab_alone", "full", f"5.3 Variant: the Grab alone at {gsev} Attack Dice, Headlong Lunge at "
                                              f"{over['headlong-lunge']['attack_dice']}, deaths through the end", False)
    w(f"**Variant, deaths through the end:** {fails_txt(g_full)}.\n")
    g_fight, _ = bar_table("grab_alone", "in_fight", "5.4 The same variant, deaths during the fight", False)
    w(f"**Variant, deaths during the fight:** {fails_txt(g_fight)}. Chapter 6's verdict "
      "(`data/titans/tuning.yaml`, `verdicts`, `sprinting_abnormal`) reports this variant on the drafter's "
      "seeds.\n")
    w("### 5.5 The end of the Titan Engagement in the bar's rows\n")
    w("What separates the two death readings, per fight, cutters first, for the Abnormal row / its Medium twin / "
      "its Large twin. *Lethal at the end*: soldiers alive at the fight's end with an untreated lethal Critical "
      "Injury. *Aftermath saves*: those an aftermath Treat Injury roll stabilizes before the Death Rolls. "
      "*Death Rolls* and *deaths at the end* follow.\n")
    rows = []
    for r in rows_def:
        trip = [S(f"bar/cutters_first/{r[k]}") for k in ("abnormal", "medium", "large")]
        rows.append([r["abnormal"].replace("sprinting-abnormal: ", "")] +
                    [" / ".join(f"{s[f]:.4f}" for s in trip) for f in ("lethal_at_end", "aftermath_saves", "end_death_rolls", "end_deaths")])
    w(table(["Abnormal row", "Lethal at the end", "Aftermath saves", "Death Rolls", "Deaths at the end"], rows))
    w("")

    # ================================================================== 6. ADR-0014 reports and Chapter 6 cases
    w("## 6. ADR-0014 reports and Chapter 6 cases\n")
    w("### 6.1 Health in the full fight\n")
    w("ADR-0014's Health report: the reference Squad with each soldier's Health set to 3, plus the Health 2, 5, "
      "and 6 builds, beside the Health-dependent targets. Those are the Expedition PC targets (Phase 2), so the "
      "figures are per Titan Engagement. Standard Medium Titan, 4 player characters and 2 helper Squadmates; z is "
      "against the same Squad at the Rookie's Health.\n")
    hel = lab("standard-medium", "4 player characters and 2 helper Squadmates")
    t = S(hel)
    rows = [[f"Health {R.builds['rookie']['health']} (the Rookie)", f2(t["cis"]), f2(t["pc_cis"]), f3(t["deaths_all"]),
             f3(t["pc_deaths_all"]), f1(t["by3"])]]
    for h in sorted(set(R.health_rows) - {R.builds["rookie"]["health"]}):
        s = S(f"ch6x/health: standard-medium: 4 player characters and 2 helper Squadmates, every soldier at Health {h}")
        rows.append([f"Health {h}", f"{f2(s['cis'])} {zf(vs(s, t, 'cis'))}", f"{f2(s['pc_cis'])} {zf(vs(s, t, 'pc_cis'))}",
                     f"{f3(s['deaths_all'])} {zf(vs(s, t, 'deaths_all'))}", f"{f3(s['pc_deaths_all'])} {zf(vs(s, t, 'pc_deaths_all'))}",
                     f1(s["by3"])])
    w(table(["Squad", "Critical Injuries, z", "PC Critical Injuries, z", "Deaths through the end, z",
             "PC deaths through the end, z", "By round 3, %"], rows))
    w("\nThe Grab on a victim carrying untreated Critical Injuries: section 2.3.\n")

    w("### 6.2 The template Squad on every table\n")
    rows = []
    for tid in C.TITANS:
        k = lab(tid, "template Squad")
        if has(k):
            rows.append([tid] + fight_cells(S(k)))
    rows.append(["reference-medium (Chapter 5)"] + fight_cells(S("ch5/template")))
    w(table(["Titan"] + FIGHT_CELLS, rows))
    w("")
    rows = [[tid + (" (Chapter 5)" if tid == "reference-medium" else "")] + fight_cells(S(f"freebuild/{tid}"))
            for tid in C.TITANS + ["reference-medium"] if has(f"freebuild/{tid}")]
    if rows:
        w("The Free Build Squad on the same tables (decision batch 7, 7-1; reported, not tuned; no committed figure):\n")
        w(table(["Titan"] + FIGHT_CELLS, rows))
        w("")

    w("### 6.3 Squad Tactics and Pry Loose over the six Grab cells\n")
    w("Chapter 5's reference Titan, one Rookie comrade at In Reach, the victim after a failed dodge, with the "
      "escapes. Each cell is Grab death, %. The last column is the Tactic's uses per trial.\n")
    cell_head = [f"S{st} G{g}" for st, g in R.grab_cells]
    rows = []
    tac_names = sorted({k.split("/")[2] for k in by if k.startswith("grabx/tactics/")}, key=lambda n: (n != "none", n.count("+"), n))
    for name in tac_names:
        ss = [S(f"grabx/tactics/{name}/{C.cell_label(st, g)}") for st, g in R.grab_cells]
        rows.append([name.replace("+", " and ")] + [f1(s["dead"]) for s in ss] +
                    [f"{max(s['dead'] for s in ss):.1f}", "yes" if max(s["dead"] for s in ss) < cell_limit else "no",
                     f2(sum(s["tactic_uses"] for s in ss) / len(ss))])
    ss = [S(f"grabx/pry_loose/{C.cell_label(st, g)}") for st, g in R.grab_cells]
    base = [S(f"grab/reference-medium/{C.cell_label(st, g)}") for st, g in R.grab_cells]
    rows.append(["Pry Loose (comrade with the Talent, prying first), no escapes"] +
                [f"{f1(s['dead'])} ({f1(b['dead'])})" for s, b in zip(ss, base)] +
                [f"{max(s['dead'] for s in ss):.1f}", "yes" if max(s["dead"] for s in ss) < cell_limit else "no",
                 f"{f2(sum(s['pry_rolls'] for s in ss) / 6)} rolls, {f2(sum(s['pry_frees'] for s in ss) / 6)} frees"])
    w(table(["Tactics"] + cell_head + ["Worst", f"Every cell under {cell_limit:g}%", "Uses a trial"], rows))
    unused = [r[0] for r in rows[:-1] if r[0] != "none" and r[-1] == "0.00"]
    w("\nIn the Pry Loose row, the same cells without Pry Loose are in parentheses. "
      + (f"Tactics with 0.00 uses ({', '.join(unused)}) never fire for one comrade freeing a Grabbed soldier, so "
         "those rows repeat the no-Tactic row within sampling.\n" if unused else "\n"))

    w("### 6.4 Squad Tactics on every table\n")
    rows = []
    for tid in C.TITANS:
        for c in res["cases"]:
            lbl = c.get("label", "")
            if c["key"].startswith(("ch6/tactics: ", "ch6x/tactics: ")) and lbl.startswith(f"tactics: {tid}: "):
                s = c["summary"]
                rows.append([tid, lbl.split(": ", 2)[2], med_txt(s), f1(s["by3"]), f2(s["cis"]), f3(s["deaths_all"]),
                             f3(s["grabs"]), f2(s["tactic_uses"])])
    w(table(["Titan", "Tactics", "Median", "By round 3, %", "Critical Injuries", "Deaths through the end", "Grabs",
             "Tactic uses"], rows))
    w("\nThe decoy screens and helpers on every table are the `support:` and helpers rows of section 9.\n")

    def group_rows(group, twin_of):
        out = []
        for c in res["cases"]:
            if c.get("group") == group:
                s = c["summary"]
                tk = twin_of(c)
                t_ = S(tk) if tk and has(tk) else None
                out.append((c["label"], s, t_))
        return out

    w("### 6.5 Broken eyes\n")
    w("Cutters strike the eyes first, then legs, then arms. z is against the table's reference start.\n")
    rows = []
    for label, s, t_ in group_rows("eyes", lambda c: "ch6/" + C.reference_label(c["cfg"]["titan_id"])):
        rows.append([label, f2(s["eye_breaks"]), f"{f1(s['by3'])} {zf(vs(s, t_, 'by3'))}", f"{f2(s['cis'])} {zf(vs(s, t_, 'cis'))}",
                     f"{f3(s['deaths_all'])} {zf(vs(s, t_, 'deaths_all'))}", f2(s["flares"])])
    w(table(["Row", "Eye breaks", "By round 3, %, z", "Critical Injuries, z", "Deaths through the end, z", "Flares"], rows))
    w("")

    w("### 6.6 Read and Call It\n")
    w("A Tactician Squadmate at Distant Reads every round and Calls It when it can. z is against the same start "
      "without the Tactician.\n")

    def read_twin(c):
        tid = c["cfg"]["titan_id"]
        return "ch5/reference" if tid == "reference-medium" else "ch6/" + C.reference_label(tid)
    rows = []
    for label, s, t_ in group_rows("read", read_twin):
        rows.append([label, f2(s["reads"]), f2(s["read_successes"]), f2(s["calls"]), f2(s["call_dodges"]), f2(s["draws"]),
                     f"{f1(s['by3'])} {zf(vs(s, t_, 'by3'))}", f"{f2(s['cis'])} {zf(vs(s, t_, 'cis'))}",
                     f"{f3(s['deaths_all'])} {zf(vs(s, t_, 'deaths_all'))}", f"{f1(s['jam_dodge_fight'])}"])
    w(table(["Row", "Reads", "Read successes", "Calls", "Dodges with the Call", "Draw Attention", "By round 3, %, z",
             "Critical Injuries, z", "Deaths through the end, z", "Fights with a Jam on a dodge, %"], rows))
    w("\nThe Tactician in the full-fight Jam test: section 4.3.\n")

    w("### 6.7 Draw Attention, never from Distant\n")
    w("`data/engagement/attention.yaml`, `draw_attention`: Draw Attention is taken from a Position other than Distant "
      f"(decision batch 5, {oq('OQ-113')}). In these rows cutters take Draw Attention while a striker holds Attention; "
      "a cutter at Distant takes its turn without it and is counted as *barred*. Committed figures, where a row has "
      "them, are in parentheses. z is against the same start without Draw Attention.\n")
    rows = []
    draw_rows = [("ch6/" + l_, v_) for l_, v_ in PF["fight"].items() if "Draw Attention" in l_]
    draw_rows += [(c["key"], None) for c in res["cases"] if c.get("group") == "read" and c["cfg"].get("draw_attention")]

    def with_com(com, field, fmt):
        return f" ({fmt(num(com.get(field)))})" if com is not None and com.get(field) is not None else ""
    for k, com in draw_rows:
        if not has(k):
            continue
        s = S(k)
        tid = by[k]["cfg"]["titan_id"]
        t_ = S("ch5/reference") if tid == "reference-medium" else S("ch6/" + C.reference_label(tid))
        rows.append([k.split("/", 1)[1], med_txt(s), f"{f1(s['by3'])} {zf(vs(s, t_, 'by3'))}", f1(s["nokill"]),
                     f"{f2(s['cis'])} {zf(vs(s, t_, 'cis'))}", f"{f3(s['deaths_all'])} {zf(vs(s, t_, 'deaths_all'))}",
                     f2(s["draws"]) + with_com(com, "draws", f2), f2(s["draws_barred"]) + with_com(com, "draws_barred", f2)])
    w(table(["Row", "Median", "By round 3, %, z", "No kill, %", "Critical Injuries, z", "Deaths through the end, z",
             "Draw Attention a fight", "Barred from Distant a fight"], rows))
    w("")

    w("### 6.8 Four strikers, three strikers and a cutter, and the baseline\n")
    w("OQ-112's simulator case, on every table.\n")
    rows = []
    for tid in C.TITANS + ["reference-medium"]:
        base_k = "ch5/reference" if tid == "reference-medium" else "ch6/" + C.reference_label(tid)
        four_k = four5 if tid == "reference-medium" else lab(tid, "4 eager strikers and no cutters")
        three_k = f"ch6x/strikers: {tid}: 3 eager strikers and 1 cutter"
        for name, k in (("baseline", base_k), ("3 strikers, 1 cutter", three_k), ("4 strikers", four_k)):
            s = S(k)
            rows.append([tid, name, med_txt(s), f1(s["by3"]), f2(s["cis"]), f3(s["deaths"]), f3(s["deaths_all"]),
                         f2(s["napes"]), f2(s["bodies"])])
    w(table(["Titan", "Squad", "Median", "By round 3, %", "Critical Injuries", "Deaths during the fight",
             "Deaths through the end", "Nape strikes", "Body Part strikes"], rows))
    w("")

    w("### 6.9 The setup mix\n")
    bg = "; ".join(f"{p:.0%} " + (("clocks " + " and ".join(map(str, cl))) if cl else "none") for p, cl in R.setup_background)
    w("`data/titans/tuning.yaml` (`targets`, `abnormals`, `report`): Critical Injuries and deaths per Titan "
      "Engagement that the interim setup table sets up, with and without its Abnormal roll (OQ-104). The figures "
      f"are the Focus Titan's fight alone. **Not measured:** the table's Background Titans ({bg}; "
      f"{oq(OQ_NOT_MEASURED['two_titans'])}).\n")
    w("**Chapter 6's reading** (`docs/rules/06-standard-titans.md` section 6.6, *The Abnormal roll in the setup "
      "table*; `data/titans/tuning.yaml`, `verdicts`, `setup_mix`): each Focus Titan's reference row, weighted by "
      "`data/engagement/engagement-setup.yaml`'s Size Class odds and the Medium Titan's Abnormal roll. Chapter 6 reads "
      "deaths during the fight. The committed figures are in parentheses. Their standard errors combine the committed "
      "reference rows' (`data/titans/probe-figures.yaml`), and z is against them.\n")
    sizes = {size: T6["targets"][size]["titan"] for size in R.setup_size}

    def focus_weights(with_abnormal):
        out = {}
        for size, ws in R.setup_size.items():
            if size == "medium" and with_abnormal:
                for tid, wt in R.setup_medium_abnormal.items():
                    out[tid] = out.get(tid, 0) + ws * wt
            else:
                out[sizes[size]] = out.get(sizes[size], 0) + ws
        return out
    # the verdict names its source and the reading (deaths during the fight), with through-the-end figures aside
    vc = need(r"deals (?:on the final full rerun under Attack Dice )?([\d.]+) Critical Injuries and ([\d.]+) deaths "
              r"(?:during the fight )?per Titan Engagement without the Abnormal roll(?: \([^)]*\))?, and ([\d.]+) and "
              r"([\d.]+) with it", " ".join(T6["verdicts"]["setup_mix"].split()),
              "data/titans/tuning.yaml, verdicts, setup_mix")
    committed_mix = {False: (vc.group(1), vc.group(2)), True: (vc.group(3), vc.group(4))}
    rows, rounding = [], 0.0
    for name, flag in (("without the Abnormal roll", False), ("with the Abnormal roll", True)):
        wts = focus_weights(flag)
        ab_share = sum(p for t_, p in wts.items() if t_ in C.ABNORMAL_IDS)
        cells_ = [name, f"1 in {round(1 / ab_share)}" if ab_share else "never"]
        for f, com_txt in (("cis", committed_mix[flag][0]), ("deaths", committed_mix[flag][1])):
            com = float(com_txt)
            v = sum(p * S("ch6/" + C.reference_label(t_))[f] for t_, p in wts.items())
            se = math.sqrt(sum((p * S("ch6/" + C.reference_label(t_))[f + "_se"]) ** 2 for t_, p in wts.items()))
            com_se = math.sqrt(sum((p * PF["fight"][C.reference_label(t_)][f + "_se"]) ** 2 for t_, p in wts.items()))
            decimals = len(com_txt.split(".")[1]) if "." in com_txt else 0
            rounding = max(rounding, 0.5 * 10 ** -decimals / math.sqrt(se ** 2 + com_se ** 2))
            cells_.append(f"{v:.3f} +/- {se:.3f} ({com_txt}) {zf(z(v, se, com, com_se))}")
        for f in ("deaths_all", "pc_deaths_all"):
            v = sum(p * S("ch6/" + C.reference_label(t_))[f] for t_, p in wts.items())
            se = math.sqrt(sum((p * S("ch6/" + C.reference_label(t_))[f + "_se"]) ** 2 for t_, p in wts.items()))
            cells_.append(f"{v:.3f} +/- {se:.3f}")
        rows.append(cells_)
    w(table(["Setup table", "Sprinting Abnormal as Focus Titan", "Critical Injuries, z", "Deaths during the fight, z",
             "Deaths through the end", "PC deaths through the end"], rows))
    w(f"\nThe committed figures are rounded, which alone can move z by up to {rounding:.1f}.\n")
    # simulator review round 3, Minor 6: the mix is a weighted sum of reference rows, so a row re-checked in section 11
    # is put in place of its first run, which names the source of any gap past 3 standard errors here
    mix_rows = sorted({"ch6/" + C.reference_label(t_) for flag in (False, True) for t_ in focus_weights(flag)})
    swapped = [k for k in mix_rows if rechecks.get(k, {}).get("sim")]
    if swapped:
        def mix_fig(t_, f):
            k = "ch6/" + C.reference_label(t_)
            src = rechecks.get(k, {}).get("sim") or S(k)
            return src[f], src[f + "_se"]
        parts = []
        for name, flag in (("without the Abnormal roll", False), ("with the Abnormal roll", True)):
            wts = focus_weights(flag)
            for f, label, com_txt in (("cis", "Critical Injuries", committed_mix[flag][0]),
                                      ("deaths", "deaths during the fight", committed_mix[flag][1])):
                com = float(com_txt)
                v = sum(p * mix_fig(t_, f)[0] for t_, p in wts.items())
                se = math.sqrt(sum((p * mix_fig(t_, f)[1]) ** 2 for t_, p in wts.items()))
                com_se = math.sqrt(sum((p * PF["fight"][C.reference_label(t_)][f + "_se"]) ** 2 for t_, p in wts.items()))
                parts.append(f"{name}, {label} {v:.3f} +/- {se:.3f} ({com_txt}) {zf(z(v, se, com, com_se))}")
        w("**With the re-checked rows.** The mix is a weighted sum of the reference rows, so a row that section 11 "
          "re-checked on new seeds carries its first run's draw into it. With the re-checks of "
          + ", ".join(f"`{k}`" for k in swapped) + " in place of their first runs: " + "; ".join(parts) + ".\n")

    def setup_key(tid, rating):
        if rating == C.reference_cfg(tid).get("terrain", "wooded"):
            return "ch6/" + C.reference_label(tid)
        return f"ch6x/setup: {tid}: its reference start at {rating}"
    MIX = ("by3", "cis", "pc_cis", "deaths", "deaths_all", "pc_deaths_all")

    def mix(with_abnormal, ratings):
        acc = {f: 0.0 for f in MIX}
        var = {f: 0.0 for f in MIX}
        for rating in ratings:
            wr = R.setup_anchor[rating] if len(ratings) > 1 else 1.0
            for tid, wt in focus_weights(with_abnormal).items():
                s = S(setup_key(tid, rating))
                for f in MIX:
                    acc[f] += wr * wt * s[f]
                    var[f] += (wr * wt * s[f + "_se"]) ** 2
        return {f: (acc[f], math.sqrt(var[f])) for f in MIX}
    w("**A second reading, over every Anchor Rating.** The same odds, with each Titan's reference start fought on "
      "each Anchor Rating and weighted by the table's Anchor Rating odds as well. It is a different quantity from "
      "Chapter 6's, which fights every Titan at its reference start in Wooded terrain, and it has no committed "
      "figure.\n")
    everything = list(R.setup_anchor)
    rows = []
    for name, flag in (("with the Abnormal roll", True), ("without it", False)):
        m = mix(flag, everything)
        rows.append([name, "every rating"] + [f"{m[f][0]:.3f} +/- {m[f][1]:.3f}" for f in MIX])
    total = mix(True, everything)["deaths_all"][0]
    shares = {}
    for rating, wr in R.setup_anchor.items():
        m = mix(True, [rating])
        shares[rating] = wr * m["deaths_all"][0] / total if total else 0.0
        rows.append([f"with the Abnormal roll, {rating} only ({wr:.0%} of setups)",
                     f"{100 * shares[rating]:.0f}% of the deaths through the end"]
                    + [f"{m[f][0]:.3f} +/- {m[f][1]:.3f}" for f in MIX])
    w(table(["Setup table", "Anchor Rating", "Killed by round 3, %", "Critical Injuries", "PC Critical Injuries",
             "Deaths during the fight", "Deaths through the end", "PC deaths through the end"], rows))
    w("\nEach Titan on each Anchor Rating (killed by round 3, %; Critical Injuries; deaths through the end):\n")
    rows = []
    for tid in C.TITANS:
        rows.append([tid] + [f"{f1(S(setup_key(tid, r))['by3'])}; {f2(S(setup_key(tid, r))['cis'])}; {f3(S(setup_key(tid, r))['deaths_all'])}"
                             for r in R.setup_anchor])
    w(table(["Titan"] + [f"{r} ({p:.0%})" for r, p in R.setup_anchor.items()], rows))
    op = R.grounded_extra_rating
    w(f"\nOn {op.capitalize()}, `data/engagement/anchor-ratings.yaml` gives no chain of steps to Blind Spot while the "
      "Titan stands. The strikers' POLICY CHOICE there (`policy.striker_turn`) is to cut as cutters until grounding "
      f"opens one. {op.capitalize()} is {R.setup_anchor[op]:.0%} of setups and {100 * shares[op]:.0f}% of the "
      "Anchor-weighted deaths through the end, so most of the gap between the two readings rests on that policy.\n")

    w("### 6.10 Round-time counters\n")
    w("`data/engagement/round.yaml` (`round_time`, `tracker_moments`). Per round; per round in which a Grab is "
      "held; per other round. Tracker writes are counted at the moments `tracker_moments` names. Pools counts "
      "every dice pool rolled, Death Rolls included. The timed paper test is a playtest item and has no committed "
      f"figures. **Not measured:** two Focus Titans ({oq(OQ_NOT_MEASURED['two_titans'])}).\n")
    rows = []
    rt_rows = [("Chapter 5 reference, 4 player characters", "ch5/reference")] + \
              [(f"{tid}, reference start", "ch6/" + C.reference_label(tid)) for tid in C.TITANS] + \
              [(f"{tid}, 4 player characters and 2 helper Squadmates", lab(tid, "4 player characters and 2 helper Squadmates")) for tid in C.TITANS]
    counters = ("tracker_writes", "ladder_evals", "pools", "dodges", "fear_rolls", "gas_rolls")
    for name, k in rt_rows:
        if not has(k):
            continue
        rt = S(k)["round_time"]
        rows.append([name, f2(S(k)["rounds_per_fight"])] +
                    [f"{rt[c]['per_round']:.2f} / {f2(rt[c]['grab_round'])} / {rt[c]['other_round']:.2f}" for c in counters])
    w(table(["Fight", "Rounds a fight", "Tracker writes", "Ladder evaluations", "Pools", "Dodges", "Fear Rolls", "Gas Rolls"], rows))
    w("")

    w("### 6.11 Treatment, the interim day, and the interim issue over a sequence\n")
    seq = C.SEQUENCE
    w(f"PROVISIONAL ({oq(OQ_NOT_MEASURED['sequence'])}): no Phase 1 rule gives how many Titan Engagements a session "
      f"holds. A sequence here is {seq['sessions']} sessions of {seq['fights_per_session']} Titan Engagements against "
      "the standard Medium Titan, each under the retreat clock. Every end step runs after each fight: Death Rolls, the "
      "care window's Treat and Field Repair rolls, Grief, and retirement and promotion. At the start of each later "
      "session one day passes (`data/harm/healing.yaml`, `day_passes`, `interim`; decision batch 5, "
      f"{oq('OQ-120')}, and 5b, {oq('OQ-130')}). It runs `each_day` in order: a care window over every soldier in the "
      "Squad with Field Repair; a Death Roll for each lethal injury whose day limit runs out; all Health lost to damage "
      "restored; and a day off each held injury's healing time. Promotion for the day's deaths follows, then the new "
      "characters join, then the interim issue.\n")
    w(f"Decision batch 7 (7-14) writes the Expedition cadence that replaces this one (the revision of "
      f"{oq(OQ_NOT_MEASURED['sequence'])}): two Legs and a night camp a day, the day passing at each night camp, no "
      "interim issue between days. The simulator models no Legs yet, so the sequence keeps the interim day between "
      "sessions, as that revision says, and stays a report rather than a measurement of the Expedition cadence.\n")
    w("Between fights the rules apply. Every living soldier in the Squad takes part in each Titan Engagement, Down or "
      "not (`data/engagement/positions.yaml`, `placement`, `who_takes_part`). At retirement and promotion "
      "(`data/harm/engagement-end.yaml`), retiring soldiers leave, and each player character who died or retired is "
      "replaced by promoting a living Squadmate through the contest (`data/character/squadmates.yaml`, `promotion`). "
      "No rule adds a Squadmate in the promoted one's place. A player with no Squadmate left makes a new character, "
      "who joins at the start of the next Titan Engagement, since no Expedition is under way (`promotion`, "
      "`no_squadmate`; decision batch 7, 7-11).\n")
    w(f"PROVISIONAL readings that no rule gives, beside the cadence {OQ_NOT_MEASURED['sequence']} names: the new "
      "character is the reference Rookie; a promotion's Lifepath rolls (Origin, Why You Enlisted, Training Years) are "
      "not made, so a promoted Squadmate gains no Talent levels; a Titan Engagement in which no player character takes "
      "part is not played; and the promoting player takes the Squadmate with the fewest untreated Critical Injuries "
      "(`policy.promotion_choice`). Per sequence:\n")

    def cell2(r, k):
        return f2(r[k]) if k in r else "n/a"
    for c in res["cases"]:
        if c["family"] == "sequence":
            rows = []
            day_rows = []
            for i, r in enumerate(c["summary"]["fights"], 1):
                rows.append([i, cell2(r, "fighters"), cell2(r, "pcs"), cell2(r, "down_start"), cell2(r, "untreated_start"),
                             cell2(r, "jammed_start"), cell2(r, "worn_start"), cell2(r, "lame_start"),
                             cell2(r, "stress_start"), f1(100 * r["not_played"]) if "not_played" in r else "n/a",
                             f1(100 * r["killed"]), f1(100 * r["retreats"]) if "retreats" in r else "n/a",
                             f2(r["cis"]), f2(r["pc_cis"]), f3(r["deaths_all"]), f3(r["pc_deaths_all"]),
                             cell2(r, "left_behind"), f2(r["care_saves"]), f2(r["care_repairs"]), cell2(r, "gone"),
                             cell2(r, "promoted"), cell2(r, "waiting"), cell2(r, "joined")])
                if i > 1 and (i - 1) % seq["fights_per_session"] == 0 and "day_death_rolls" in r:
                    day_rows.append([f"before fight {i}", f2(r["day_care_saves"]), f2(r["day_care_repairs"]),
                                     f3(r["day_death_rolls"]), f3(r["day_deaths"]), f3(r["pc_day_deaths"]),
                                     f2(r["day_healed"]), f2(r["day_health_restored"]), f3(r["day_gone"]),
                                     f3(r["day_promoted"]), f3(r["day_waiting"])])
            w(f"**{c['key'][len('sequence/'):]}** ({c['summary']['sequences']:,} sequences)\n")
            w(table(["Fight", "Taking part", "Player characters", "Down at start", "Untreated injuries at start",
                     "Jammed at start", "Worn ODM Gear at start", "Lame or no horse", "Mean Stress at start",
                     "Not played, %", "Killed, %", "Retreat, %", "Critical Injuries", "PC Critical Injuries",
                     "Deaths through the end", "PC deaths", "Left behind", "Care-window saves", "Care-window repairs",
                     "Player characters dead or retired", "Promoted", "Waiting for a new character",
                     "New characters joined"], rows))
            w("")
            w("The interim day, per sequence:\n")
            w(table(["Day", "Care-window saves", "Field Repairs", "Death Rolls", "Deaths", "PC deaths", "Injuries healed",
                     "Health restored", "Player characters dead", "Promoted", "Waiting for a new character"], day_rows))
            w("")

    w("### 6.12 The retreat clock and the retreat\n")
    w("`data/engagement/background-titans.yaml`, `retreat_clock` and `retreat` (decision batch 5, "
      f"{oq('OQ-119')}, {oq('OQ-126')}; 5b, {oq('OQ-129')}). Every full fight runs under a retreat clock of "
      f"{R.retreat_clock} segments, which fills 1 segment at the background-clocks end step and never during a "
      "retreat. When it is full the fight becomes a retreat: each standing soldier makes the forced move before the "
      "action, except staying with a Down or Grabbed comrade after acting for them and the move after a lift, and no "
      "Nape strike is made. The Titan Engagement ends when no standing soldier holds a Position, and every soldier "
      f"still holding one then dies, left behind. The safety cap of {E.SAFETY_CAP} rounds is a model check. Committed "
      "figures are in parentheses: Chapter 5's from `data/engagement/tuning.yaml` (`prepared_squad_kill`, `retreat`), "
      "Chapter 6's from `data/titans/probe-figures.yaml`.\n")
    ret5 = T5["prepared_squad_kill"]["retreat"]
    ret_cols = ("retreats", "lifts", "carried_out", "left_behind")
    if len(ret5["columns"]) != len(ret_cols):
        raise ValueError("data/engagement/tuning.yaml prepared_squad_kill retreat columns changed")
    rrows = [("Chapter 5 reference", "ch5/reference", dict(zip(ret_cols, ret5["reference"]))),
             ("Chapter 5 Large", "ch5/large", dict(zip(ret_cols, ret5["large"])))]
    for tid in C.TITANS:
        rrows.append((f"{tid}, reference start", "ch6/" + C.reference_label(tid), PF["fight"][C.reference_label(tid)]))
        hl = f"{tid}: 4 player characters and 2 helper Squadmates"
        if hl in PF["fight"]:
            rrows.append((f"{tid}, 4 player characters and 2 helper Squadmates", "ch6/" + hl, PF["fight"][hl]))
    rows = []
    for name, k, com in rrows:
        if not has(k):
            continue
        s = S(k)
        rows.append([name, f"{100 * s['retreats']:.1f}" + with_com(com, "retreats", f1), f2(s["retreat_rounds"]),
                     f"{s['lifts']:.3f}" + with_com(com, "lifts", f3), f"{s['carried_out']:.3f}" + with_com(com, "carried_out", f3),
                     f"{s['left_behind']:.3f}" + with_com(com, "left_behind", f3), f2(s["left"]),
                     f"{s['lets_go']:.4f}" + with_com(com, "lets_go", f4), f"{round(s['cap'] * s['fights'])}",
                     f1(s["nokill"])])
    w(table(["Row", "Fights with a retreat, %", "Retreat rounds a fight", "Down comrades lifted", "Carried out",
             "Left behind", "Soldiers who left", "Let go", "Fights at the safety cap", "No kill, %"], rows))
    fight_cases = [c for c in res["cases"] if c["family"] == "fight"]
    total_cap = sum(round(c["summary"]["cap"] * c["summary"]["fights"]) for c in fight_cases)
    w(f"\nFights that reached the safety cap, over all {len(fight_cases)} full-fight runs: {total_cap}. Soldiers who "
      "left a fight count once each; a comrade carried out counts as carried out and as a soldier who left.\n")

    # ================================================================== 7. rules added
    w("### 6.13 Titan rolls, steam, the falling Titan, and Pinned\n")
    w("Decision batch 8 (8-1, 8-7 to 8-9, 8-14), per fight: Titan rolls, the share that whiff, steam rolls and the "
      "Critical Injuries steam made, Leap Clear rolls, pins, corpse-heat Critical Injuries per pin, corpse-heat deaths, "
      "Heaves, and the share of fights that ran on after the kill for a Pinned soldier. The without-steam rows sit "
      "beside their twins in section 7.\n")
    rows = []
    b8keys = [("ch6/" + C.reference_label(tid_), f"{tid_}, reference start") for tid_ in C.TITANS]
    b8keys += [(c_["key"], c_["key"].split("/", 1)[1]) for c_ in res["cases"]
               if c_["key"].startswith(("rules/steam", "jamfight/"))]
    for k_, name_ in b8keys:
        if not has(k_):
            continue
        s_ = S(k_)
        pins_ = s_.get("pins", 0)
        rolls_ = s_.get("titan_rolls", 0)
        rows.append([name_, f2(rolls_), f1(100 * s_.get("whiffs", 0) / rolls_) if rolls_ else "n/a",
                     f2(s_.get("steam_kill", 0) + s_.get("steam_regen", 0)), f3(s_.get("steam_cis", 0)),
                     f3(s_.get("leap_rolls", 0)), f3(pins_), f2(s_.get("heat_cis", 0) / pins_) if pins_ else "n/a",
                     f3(s_.get("heat_deaths", 0)), f3(s_.get("heaves", 0)), f1(100 * s_.get("ran_on", 0))])
    w(table(["Row", "Titan rolls", "Whiffs, %", "Steam rolls", "Steam Critical Injuries", "Leap Clear rolls", "Pins",
             "Corpse-heat Critical Injuries per pin", "Corpse-heat deaths", "Heaves", "Ran on, %"], rows))
    w("")

    w("### 6.14 The Skirmish probe\n")
    w("Decision batch 7 (7-17) and batch 8 (8-4, 8-7, 8-15), reported and not tuned (`families.skirmish_trial`, whose "
      "docstring lists the rules as written and the POLICY CHOICES). Each case beside its row without the Cut and Pierce "
      "riders. Per Skirmish: the Squad's win share (every Foe out or gone), the share ending with every soldier Down or "
      "dead, rounds, deaths through the end steps, Critical Injuries by type, Death Rolls per lethal Cut, Pierce "
      "Critical Injuries left untreated after the end steps, and Foes killed and out cold.\n")
    reported_ = load("skirmish/foes.yaml").get("reported_figures")
    if reported_:
        # decision batch 8, 8-33: the probe's three reported figures, beside the rows and never judged
        def range_txt(v):
            lo, hi = v.get("min"), v.get("max")
            return f"{lo} to {hi}" if lo is not None and hi is not None else (f"at least {lo}" if lo is not None else f"at most {hi}")
        parts_ = []
        for row_ in reported_["rows"]:
            figs = "; ".join(f"{k.replace('_', ' ')} {range_txt(v)}" for k, v in row_.items()
                             if isinstance(v, dict) and k != "sweep" and ("min" in v or "max" in v))
            parts_.append(f"{row_['case'].rstrip('.')}: {figs}")
        w("Reported figures, not ADR-0014 targets and never judged (decision batch 8, 8-33; `data/skirmish/foes.yaml`, "
          "`reported_figures`): " + ". ".join(parts_) + ".\n")
    rows = []
    for c_ in res["cases"]:
        if c_["family"] != "skirmish":
            continue
        s_ = c_["summary"]
        per_cut = s_.get("cut_death_rolls_per_lethal_cut")
        rows.append([c_["key"][len("skirmish/"):], f1(s_["win"]), f1(s_["squad_down"]), f2(s_["rounds"]),
                     f3(s_["deaths_all"]), f2(s_["cis"]), f2(s_["cut_cis"]), f2(s_["pierce_cis"]), f2(s_["burn_cis"]),
                     f2(per_cut) if per_cut is not None else "n/a", f2(s_["pierce_untreated_end"]), f2(s_["foes_killed"]),
                     f2(s_["foes_out_cold"]), f1(s_["cap"])])
    if rows:
        w(table(["Case", "Win, %", "Squad Down, %", "Rounds", "Deaths through the end", "Critical Injuries", "Cut",
                 "Pierce", "Burn", "Death Rolls per lethal Cut", "Pierce untreated at the end", "Foes killed",
                 "Foes out cold", "Capped, %"], rows))
        w("")

    w("### 6.15 Retargeting and Frenzy, the two Titan rules of round 3\n")
    w("Decision batch 13 (13-9 and 13-10; OQ-192 and OQ-193), with the fallback retargeted as well (round 3 review "
      "1, M1). *Retargeted* is the share of resolved cards on which a retarget moved the Titan's Attention, for the "
      "rolled entry or for its fallback: the card resolves that entry against a soldier the Ladder, read again over "
      "the soldiers who could meet its Position requirement, turned the Titan onto. Every one of those cards was a "
      "fallback or a Thrash before the rule. *Rolled entry reached no one* is the share on which no soldier met the "
      "rolled entry, so the fallback ran; a card counted there may still appear under *Retargeted*, if the fallback "
      "then found someone, so the two shares are not exclusive. *Thrash* is the share of resolved cards that "
      "Thrashed, the figure the rule set out to cut. *Frenzy lifted* is the share of behavior rolls whose total was "
      "higher than the face the die showed.\n")
    rows = []
    for c in res["cases"]:
        if c["family"] != "fight" or "retarget_share" not in c["summary"]:
            continue
        s_ = c["summary"]
        rows.append([c.get("label") or c["key"], f1(s_["retarget_share"]), f1(s_["retarget_miss_share"]),
                     f1(s_["thrash_share"]),
                     f1(s_["frenzy_lift_share"]), f2(s_["rounds_per_fight"])])
    if rows:
        w(table(["Case", "Retargeted, % of cards", "Rolled entry reached no one, % of cards", "Thrash, % of cards",
                 "Frenzy lifted, % of rolls", "Rounds a fight"], rows))
        w("")

    w("## 7. Sensitivity rows for the rules this simulator adds\n")
    w("Each row against a twin with the same Squad and start without the rule. z is against the twin. The counters "
      "show that the rule fires.\n")
    rows = []
    for c in res["cases"]:
        if c["key"].startswith("rules/"):
            s, t_ = c["summary"], S(c["twin"])
            fired = ", ".join(f"{k.replace('_', ' ')} {s[k]:.2f}" for k in
                              ("swaps", "wing_turns", "wing_changes", "pry_rolls", "pry_frees", "treats", "treat_saves",
                               "lifts", "carried_to_distant", "overloaded_moves", "dodge_helps", "covers") if s[k])
            rows.append([c["label"], med_txt(s), f"{f1(s['by3'])} {zf(vs(s, t_, 'by3'))}", f"{f2(s['cis'])} {zf(vs(s, t_, 'cis'))}",
                         f"{f3(s['deaths_all'])} {zf(vs(s, t_, 'deaths_all'))}", fired or "none"])
    w(table(["Row", "Median", "By round 3, %, z", "Critical Injuries, z", "Deaths through the end, z", "Counters a fight"], rows))
    w("")
    w("### 7.1 Talent sensitivity rows\n")
    w("ADR-0014 as amended (decision batch 7, 7-2): each new Talent that names a measured entry or a fixed roll, where "
      "the engine expresses it, against its twin (`cases.TALENT_FIGHTS`, `TALENT_GRABS`). A dice Talent is held at the "
      "reference Rookie's level; \"fires\" counts a rule Talent's effect taken. Not measured: section 14.\n")
    rows = []
    for c in res["cases"]:
        if not c.get("talent") or not has(c["twin"]):
            continue
        s, t_ = c["summary"], S(c["twin"])
        if c["family"] == "fight":
            rows.append([c["label"], f"{f1(s['by3'])} {zf(vs(s, t_, 'by3'))}", f"{f2(s['cis'])} {zf(vs(s, t_, 'cis'))}",
                         f"{f3(s['deaths_all'])} {zf(vs(s, t_, 'deaths_all'))}",
                         f"fires {s.get('talent_fires', 0):.2f}, catches tried {s.get('catch_rolls', 0):.2f}"
                         + (f"; pins {s.get('pins', 0):.3f} (twin {t_.get('pins', 0):.3f}), freed by Heave {s.get('freed', 0):.3f} "
                            f"({t_.get('freed', 0):.3f}), turns Pinned {s.get('pinned_turns', 0):.3f} ({t_.get('pinned_turns', 0):.3f}), "
                            f"corpse-heat deaths {s.get('heat_deaths', 0):.3f} ({t_.get('heat_deaths', 0):.3f})"
                            if c.get("talent") == "grip-breaker" else "")])
        elif c["family"] == "grab":
            rows.append([c["key"][len("grabx/talent/"):], "", "", f"Grab death {f1(s['dead'])}% against {f1(t_['dead'])}%", ""])
        elif c["family"] == "lone":
            rows.append([c["key"][len("lonex/talent/"):], "", "", f"usable strike {f1(s['usable_strike_share'])}% against "
                         f"{f1(t_['usable_strike_share'])}%", ""])
        else:
            rows.append([c["key"][len("sequence/"):], "", "", "section 6.11 prints it beside its twin", ""])
    w(table(["Row", "By round 3, %, z", "Critical Injuries, z", "Deaths through the end, z", "Talent counters a fight"], rows))
    w("")

    # ================================================================== 8. lone route
    w("## 8. The lone soldier's legal route to the Nape\n")
    w("ADR-0010 as amended (decision batches 3c-2 and 3e-2): Break Attention is available in every state in which "
      "a Nape strike is legal, outside a retreat. `families.route_check` searches every lone soldier state "
      "reachable from a fight's start under the soldier's own acts and under harm. A gap is a state with a legal "
      "Nape strike from which none of the soldier's own acts reaches a legal Feint with a Nape strike still "
      "reachable after it.\n")
    rows = [[k.replace("_", ", "), v["reachable_states"], v["strike_legal_states"], v["gaps"],
             "; ".join(",".join(e) for e in v["examples"]) or "none"] for k, v in res["route"].items()]
    w(table(["Rating, Titan", "Reachable states", "States with a legal Nape strike", "Gaps", "Examples"], rows))
    w("")
    w("The same promise in play: lone fights against the standard Medium Titan from a grounded start. At the start "
      "of every lone turn, and at every lone fight's end, the soldier's state is checked with the same search. A "
      "failed check means a legal Nape strike with no route to a Feint from there. With no flare and no horse, the "
      "Feint (on foot against a grounded Titan, or with ODM Gear) is the only decoy.\n")
    rows = []
    for c in res["cases"]:
        if c["key"].startswith("lone/route/"):
            s = c["summary"]
            ends = s.get("end_positions")
            where = ", ".join(f"{k} {v:.1f}%" for k, v in ends.items() if v >= 0.05) if ends else "n/a"
            rows.append([c["key"][len("lone/route/"):], pct(s["usable_strike_share"]), f2(s["feints"]),
                         f2(s["onfoot_feints"]), pct(s["onfoot_feint_fight"]), f2(s["repairs"]), f2(s["canisters"]),
                         f2(s["leg_cuts"]) if "leg_cuts" in s else "n/a", pct(s["ends"]["no_decoy_usable"]),
                         pct(s["ends"]["down"]), pct(s["ends"]["retreat"]) if "retreat" in s["ends"] else "n/a",
                         pct(s["dead_on_body_titan_standing"]) if "dead_on_body_titan_standing" in s else "n/a",
                         f2(s["gap_checks"]), f2(s["gap_checks_failed"]), pct(s["gap_fight"]),
                         pct(s["gap_grounded_fight"]), where])
    w(table(["Start", "Usable strike", "Feints", "On-foot Feints", "Fights with an on-foot Feint", "Field Repairs",
             "Canisters changed", "Grounding-leg cuts", "No decoy usable", "Down", "Retreat began first",
             "Dead On Body beside a standing Titan, not devoured", "Gap checks a fight", "Failed checks a fight",
             "Fights with a failed check", "Failed while grounded", "Where the soldier stood at the end"], rows))
    w("")
    w("POLICY CHOICE (`policy.lone_turn`): the lone soldier never takes Break Attention while no Position has a step "
      "to Blind Spot they can make, as on Open against a standing Titan, or where only an ODM step reaches Blind Spot "
      "and their ODM Gear cannot be used. They pull back from On Body, even while a decoy holds. On the rounds their "
      "line moves in, they cut the grounding leg from In Reach, which opens a route; otherwise they wait at "
      "Distant.\n")
    w("Remounting: the waiting line with the soldier on foot beside the horse at the start, against the waiting "
      "line mounted.\n")
    rows = []
    for tid in C.TITANS:
        s, t_ = S(f"lone/remount/{tid}/waiting, on foot beside the horse"), S(f"lone/{tid}/waiting")
        rows.append([tid, f2(s["mounts"]), f"{pct(s['usable_strike_share'])} ({pct(t_['usable_strike_share'])})",
                     f"{f2(s['cards_before_strike'])} ({f2(t_['cards_before_strike'])})", f"{pct(s['dead'])} ({pct(t_['dead'])})"])
    w(table(["Titan", "Mounts a fight", "Usable strike (mounted start)", "Cards before the strike (mounted start)",
             "Dead (mounted start)"], rows))
    w("")

    # ================================================================== 9. Chapter 6 comparison
    w("## 9. Chapter 6 comparison\n")
    w("### Full fights\n")
    rows = [fight_cmp_row(label, "ch6/" + label, v, "Chapter 6", S, cidx) for label, v in PF["fight"].items()]
    w(table(FIGHT_CMP_HEAD, rows))
    w("\n* median on the boundary (section 2.1).\n")
    w("### Bar rows against the committed bar figures\n")
    rows = []
    for order, sec in (("cutters_first", "figures"), ("strikers_first", "strikers_first")):
        for label, com in PF["bar"][sec].items():
            k = f"bar/{order}/{label}"
            if has(k):
                rows.append(fight_cmp_row(f"{label} ({order.replace('_', ' ')})", k, com, "Chapter 6 bar", S, cidx))
    w(table(FIGHT_CMP_HEAD, rows))
    w("")
    w("### Lone fights\n")
    rows = []
    for tid, v in PF["lone"].items():
        for line in ("waiting", "hurried", "one_card_hold"):
            if line not in v:
                continue
            c, k = v[line], f"lone/{tid}/{line}"
            s = S(k)
            rows.append([tid, line.replace("_", " "), f"{f1(s['usable_strike_share'])} ({f1(c['usable_strike_share'])}) {zc(k, 'usable_strike_share', 'Chapter 6')}",
                         f"{s['median_round_struck']} ({c['median_round_struck']})", f"{f2(s['cards_before_strike'])} ({f2(c['cards_before_strike'])})",
                         f"{f2(s['cis'])} ({f2(c['cis_per_fight'])})", f"{f1(s['ends']['devoured'])} ({f1(c['ends']['devoured'])})",
                         f"{f1(s['ends']['down'])} ({f1(c['ends']['down'])})", f"{f1(s['ends']['no_decoy_usable'])} ({f1(c['ends']['no_decoy_usable'])})",
                         f"{f2(s['stress_at_strike'])} ({f2(c['stress_at_strike'])})", f"{f1(s['kill_given_strike'])} ({f1(c['kill_given_strike'])})"])
    w(table(["Titan", "Line", "Usable strike, %, z", "Median round", "Cards before", "Critical Injuries", "Devoured, %",
             "Down, %", "No decoy usable, %", "Stress at the cut", "Cut succeeds, %"], rows))
    w("")
    w("### The fresh lone cut\n")
    rows = []
    for tid, v in PF["solo"].items():
        tnd = v["nape_depth"]
        for build, bk in SOLO_BUILDS:
            cells_ = []
            for st in R.solo_stresses:
                k = f"solo/nd{tnd}/{build}/stress{st}"
                cells_.append(f"{f1(S(k)['hit'])} ({f1(v[bk][f'stress_{st}'])}) {zc(k, 'hit', f'Chapter 6 ({tid})')}")
            rows.append([tid, tnd, build.replace("_", "-")] + cells_)
    w(table(["Titan", "Nape Depth", "Build"] + [f"Stress {st}" for st in R.solo_stresses], rows))
    w("")
    w("### Grab cells\n")
    rows = []
    gcells = ["alone_dodge_failed", "alone_no_dodge"] + [C.cell_label(st, g) for st, g in R.grab_cells]
    for tid, v in PF["grab"].items():
        rows.append([tid, v.get("grab_attack_dice", v.get("grab_severity"))] +[f"{f1(S(f'grab/{tid}/{c}')['dead'])} ({f1(v[c])}) {zc(f'grab/{tid}/{c}', 'dead', 'Chapter 6')}"
                                                 for c in gcells])
    w(table(["Titan", "Grab Attack Dice", "Alone, dodge failed", "Alone, no dodge"] + cell_head, rows))
    w("")
    w("### Jam test cells\n")
    rows = []
    cols = [c for c, _, _ in R.jam_columns]
    for tid, v in PF["jam"].items():
        for reading in ("table", "kill", "mounted"):
            for nt in (1, 2):
                rows.append([tid, reading, nt] + [
                    f"{f1(S(f'jam/{tid}/{reading}/{nt}_titans/{c}')['jammed'])} ({f1(v[reading][f'{nt}_titans'][c])}) "
                    f"{zc(f'jam/{tid}/{reading}/{nt}_titans/{c}', 'jammed', 'Chapter 6')}" for c in cols])
    w(table(["Titan", "Reading", "Titans"] + [c.replace("_", " ") for c in cols], rows))
    w("")

    # ================================================================== 10. Chapter 5 comparison
    w("## 10. Chapter 5 comparison\n")
    w("### Full fights on the reference table\n")
    rows = [fight_cmp_row(c["key"][4:] + f" ({c['committed'][1]})", c["key"], ch5_committed(c["committed"]), "Chapter 5", S, cidx)
            for c in res["cases"] if c["key"].startswith("ch5/")]
    w(table(FIGHT_CMP_HEAD, rows))
    w("\nThe on-foot Feint rows commit no death or no-kill figure. Rows measuring superseded rules are history and "
      "are not re-run.\n")
    rows = []
    for key, sec in (("lone/ch5/tempo1", "tempo_1_nape_depth_4"), ("lone/ch5/tempo2", "tempo_2")):
        row = lf_row(sec)
        v = [num(x) for x in row["values"]]
        s = S(key)
        rows.append([row["case"] + (" (Tempo 2)" if sec == "tempo_2" else ""),
                     f"{f1(s['usable_strike_share'])} ({f1(v[0])}) {zc(key, 'usable_strike_share', 'Chapter 5')}",
                     f"{s['median_round_struck']} ({int(v[1])})", f"{f2(s['cards_before_strike'])} ({f2(v[3])})",
                     f"{f2(s['cis'])} ({f2(v[5])})", f"{f1(s['stress_at_strike'])} ({f2(v[10])})", f"{f1(s['kill_given_strike'])} ({f1(v[11])})"])
    w("### Lone fight on the reference table\n")
    w(table(["Row", "Usable strike, %, z", "Median round", "Cards before", "Critical Injuries", "Stress at the cut",
             "Cut succeeds, %"], rows))
    w("")
    rows = []
    for sec in T5["solo_nape"]:
        if sec.startswith(("chosen_nape_depth_", "alternative_nape_depth_")):
            snd = int(sec.split("_")[-1])
            for build, _ in SOLO_BUILDS:
                vals = [num(x) for x in T5["solo_nape"][sec][build]]
                rows.append([snd, build.replace("_", "-")] + [
                    f"{f1(S(f'solo/nd{snd}/{build}/stress{st}')['hit'])} ({f1(val)}) {zc(f'solo/nd{snd}/{build}/stress{st}', 'hit', 'Chapter 5')}"
                    for st, val in zip(R.solo_stresses, vals)])
    w("### The fresh lone cut\n")
    w(table(["Nape Depth", "Build"] + [f"Stress {st}" for st in R.solo_stresses], rows))
    w("")
    rows = []
    for cell in gcells:
        k = f"grab/reference-medium/{cell}"
        c = cidx.get((k, "dead", "Chapter 5"))
        rows.append([cell.replace("_", " "), f"{f1(S(k)['dead'])} ({f1(c['com'])}) {zf(c['z'])}"])
    w("### Grab cells on the reference Titan\n")
    w(table(["Cell", "Death, %, z"], rows))
    w("")
    rows = []
    for reading in ("table", "kill"):
        for sc in R.size_classes:
            for nt in (1, 2):
                rows.append([reading, sc, nt] + [
                    f"{f1(S(f'jam/ch5-{sc}/{reading}/{nt}_titans/{c}')['jammed'])} ({f1(cidx[(f'jam/ch5-{sc}/{reading}/{nt}_titans/{c}', 'jammed', 'Chapter 5')]['com'])}) "
                    f"{zc(f'jam/ch5-{sc}/{reading}/{nt}_titans/{c}', 'jammed', 'Chapter 5')}" for c in cols])
    w("### Jam test on the reference table\n")
    w(table(["Reading", "Size Class", "Titans"] + [c.replace("_", " ") for c in cols], rows))
    w("")

    # ================================================================== 11. probe comparison
    w("## 11. Probe comparison summary and re-checks\n")
    n = len(cmps)
    a2 = sum(1 for c in cmps if abs(c["z"]) <= 2)
    a3 = sum(1 for c in cmps if 2 < abs(c["z"]) <= 3)
    big = sorted([c for c in cmps if abs(c["z"]) > 3], key=lambda c: -abs(c["z"]))
    w(f"{n} figures compared: {a2} within 2 standard errors, {a3} between 2 and 3 (about {n * 0.0455:.0f} expected "
      f"beyond 2 by chance), and {len(big)} beyond 3 (about {n * 0.0027:.1f} expected by chance). Every case with a "
      f"figure beyond 3 is re-run by `run.py` on new seeds at {C.RECHECK_FACTOR} times its trials. The re-run on the "
      "committed probe (`tools/probes/chapter-06/fight6.py`) is off for this run, since every committed probe figure "
      "models a fixed Severity (decision batch 8, 8-1; `run.PROBE_RECHECK`), so a gap to a committed figure reads the "
      "change of attack shape until `data/titans/probe-figures.yaml` is re-committed. Each explanation below is "
      "generated from those figures. Dodge figures have no committed "
      "trial count, so their z uses the simulator's standard error alone.\n")
    groups = {}
    for c in cmps:
        gname = f"{c['source'].split(' (')[0]}: {c['family']}"
        g = groups.setdefault(gname, [0, 0, 0, 0])
        g[0] += 1
        g[1 if abs(c["z"]) <= 2 else (2 if abs(c["z"]) <= 3 else 3)] += 1
    w(table(["Source and family", "Figures", "Within 2 SE", "2 to 3 SE", "Beyond 3 SE"], [[k] + v for k, v in sorted(groups.items())]))
    w("")
    unexplained = []
    by_rule = 0
    if big:
        rows = []
        for c in big:
            text, ok = explain(c, rechecks.get(c["key"]))
            if c["explained_by_rule"]:
                by_rule += 1
            elif not ok:
                unexplained.append(c)
            rows.append([c["key"], c["source"], c["figure"], f"{fmt_v(c, c['sim'])} ({fmt_v(c, c['com'])})", zf(c["z"]), text])
        w(table(["Case", "Committed source", "Figure", "Simulator (committed)", "z", "Explanation"], rows))
        w("")
        if unexplained:
            if {(c["key"], c["field"]) for c in unexplained} == PROBE_GAPS_LOGGED:
                w(f"The {len(unexplained)} gaps not explained are logged as a Simulator target entry "
                  f"({oq(OQ_NOT_MEASURED['probe_gaps'])}), which lists these rows.\n")
            else:
                w(f"**The gaps not explained differ from those {oq(OQ_NOT_MEASURED['probe_gaps'])} lists**; that entry "
                  "needs the rows above.\n")

    # ================================================================== 12. coverage
    w("## 12. Coverage of the simulator_cases lists\n")
    cov = coverage_rows()
    counts = {}
    rows = []
    for path, i, text, status, where, oqs in cov:
        counts[status] = counts.get(status, 0) + 1
        rows.append([f"`{path}` {i + 1}", text[:110] + ("..." if len(text) > 110 else ""), status, where,
                     ", ".join(oq(o) for o in oqs) or ""])
    w(table(["Item", "Case", "Status", "Where, and what is not measured", "Open Question"], rows))
    w("")

    # ================================================================== 13. seeds, trials, snapshot
    w("## 13. Seeds, trial counts, and the rules snapshot\n")
    w(f"Each case is split into {res['chunks']} chunks; chunk i of a case with seed S runs on "
      "`random.Random(S * 1000 + i)`, whatever the CPU count. Death Rolls, the aftermath, the care window, and "
      "Scar rolls draw on a second stream seeded from the same chunk seed (`families.aux_for`), so adding those "
      f"steps leaves the fight's own draws unchanged. A second seed adds {C.SECOND_SEED_OFFSET:,}; a re-check adds "
      f"{C.RECHECK_SEED_OFFSET:,}; a probe re-check adds {C.PROBE_SEED_OFFSET:,}.\n")
    fams = {}
    for c in res["cases"]:
        fam = c["key"].split("/")[0]
        e = fams.setdefault(fam, [0, 0, None, None])
        e[0] += 1
        e[1] += c["n"]
        e[2] = c["seed"] if e[2] is None else min(e[2], c["seed"])
        e[3] = c["seed"] if e[3] is None else max(e[3], c["seed"])
    w(table(["Family", "Cases", "Trials", "Seeds"], [[f, v[0], f"{v[1]:,}", f"{v[2]} to {v[3]}"] for f, v in fams.items()]))
    solo = [c["summary"] for c in res["cases"] if c["family"] == "solo"]
    cuts, trials = sum(s["cuts"] for s in solo), sum(s["trials"] for s in solo)
    w(f"\nThe fresh lone cut counts every trial: {cuts:,} of {trials:,} trials ({100 * cuts / trials:.1f}%) reach "
      "the cut. The others fail every Break Attention roll or Jam first, and each cut figure reads the cuts.\n")
    w(f"Rules snapshot taken {snap['taken_utc']}, when the run started: rules hash `{snap['rules_hash']}`, docs and "
      f"data hash `{snap['docs_and_data_hash']}`, engine hash `{snap['engine_hash']}`. Left out of the staleness test: "
      f"{', '.join('`' + p + '`' for p in snap['stale_test_excludes'])}.\n")
    if after_snap:
        w(f"Snapshot taken {after_snap['taken_utc']}, after the run: rules hash `{after_snap['rules_hash']}`, engine "
          f"hash `{after_snap['engine_hash']}`. "
          + ("The rules hash is the same as at the start." if after_snap["rules_hash"] == snap["rules_hash"] else
             "The rules hash differs from the start's. The figures come from the rules as they stood when the run "
             "started; each file that changed, with both hashes and what changed:") + "\n")
        if changed_during:
            w(table(["File", "At the start (first 12)", "After the run (first 12)", "What changed"],
                    [[f"`{p}`", snap["files"].get(p, "none")[:12], after_snap["files"].get(p, "none")[:12],
                      SNAPSHOT_CHANGE_NOTES.get(p, "report-rendering file, not in the engine hash" if p in sim_changed
                                                else "not explained")] for p in changed_during]))
            w("")
    if render:
        w(f"Rendered {render['taken_utc']}, engine hash at rendering `{render['engine_hash']}`"
          + (" (the run's)" if not engine_changed else " (not the run's)") + ". The simulator's source when rendered, "
          "beside the run's snapshot:\n")
        w(table(["File", "When rendered (first 12)", "In the run's snapshot (first 12)"],
                [[f"`{p}`", h[:12], snap["files"].get(p, "none")[:12]] for p, h in sorted(render["files"].items())]))
        w("")
    rows = [[f"`{p}`", h[:12]] for p, h in sorted(snap["files"].items())]
    w("<details><summary>Every file in the snapshot</summary>\n")
    w(table(["File", "SHA-256 (first 12)"], rows))
    w("\n</details>\n")

    # ================================================================== 14. divergences
    w("## 14. What the simulator models, its readings, and where it differs from the probes\n")
    w("### Rules as written\n")
    for line in rules_notes():
        w("- " + line)
    w("")
    w("### Reference choices and policies (PROVISIONAL readings, not rules)\n")
    for line in choice_notes(oq):
        w("- " + line)
    w("")
    w("### Not modelled\n")
    for line in not_modelled(oq):
        w("- " + line)
    w("")
    w("### Differences from the probes\n")
    for line in DIVERGENCES:
        w("- " + line)
    w("")

    # ================================================================== 15-16
    w("## 15. Chapter bugs found\n")
    w("\n".join("- " + b for b in CHAPTER_BUGS) if CHAPTER_BUGS else "None found.")
    w("")
    w("## 16. Open Questions cited\n")
    for i in sorted(cited, key=lambda x: int(x.split("-")[1])):
        w(f"- {i}: {cited[i]}")
    if any(o is None for _, _, o in missed):
        w("\n**Missed with no Open Question logged:** " + "; ".join(t for _, t, o in missed if o is None) + ".")
    w("")

    # ================================================================== summary
    route_gaps = sum(v["gaps"] for v in res["route"].values())
    failed_checks = max((c["summary"]["gap_fight"] for c in res["cases"] if c["key"].startswith("lone/route/")), default=0)
    statuses = ", ".join(f"{counts.get(k, 0)} {k.lower()}" for k in ("Measured", "Partly measured", "Not measured", "Deferred"))
    sampling = len(big) - by_rule - len(unexplained)
    summary = [
        "## Summary\n",
        f"- **Coverage (partial):** of the {len(cov)} `simulator_cases` items in both tuning files, {statuses} "
        "(section 12). Not measured anywhere: two Focus Titans in one fight, Background Titans, and leaving and "
        f"returning outside a retreat ({OQ_NOT_MEASURED['two_titans']}); the gap to the Opus review 1 model "
        f"({OQ_NOT_MEASURED['opus_model']}). Run under PROVISIONAL readings: the sequence cadence "
        f"({OQ_NOT_MEASURED['sequence']}) and the Veteran's unnamed Scar rows ({OQ_NOT_MEASURED['veteran_scars']}). "
        "The simulator has not been audited rule by rule against Chapters 1 to 5 and does not claim to model every "
        "rule.",
        f"- **ADR-0014 targets:** Target 1, median kill round {t1['median']} ({T['median_kill_round']['text']}): {r1}. "
        f"Target 2, {judged_value(JV['target-2'][0])} ({T['rookie_fresh_cut']['text']}): {r2}. Target 3, "
        f"{judged_value(JV['target-3'][0])} ({T['levi_grade']['text']}): {r3}. Target 4: alone "
        f"{judged_value(JV['target-4-alone'][0])} ({T['grab_alone']['text']}): {r4a}; Stress {nst}, Grief {ngr} "
        f"{judged_value(JV['target-4-named'][0])} ({T['grab_named_cell']['text']}): {r4n}; worst cell {worst:.1f}% "
        f"(every cell {T['grab_every_cell']['text']}): {r4}. Gas medians {gas_std['median']} and "
        f"{gas_push['median']} ({T['gas_standard']['text']} and {T['gas_pushed']['text']}): {r5}. Target 6 "
        "(Expedition): deferred.",
        "- **Chapter 6 bands (deaths through the end):** " + (
            "every per-table band met, at each reference start and on the bar's runs in both sheet orders." if not band_missed
            else "missed: " + "; ".join(band_missed) + "."),
        "- **Every standard table:** kill shares, Grab and lethal counts, and In Reach "
        + ("met on every standard table" if not share_fail else "missed on " + ", ".join(sorted(set(share_fail))))
        + "; the Jam test's table reading in the probes' model "
        + ("under a third in every cell for one and two Titans" if not jam_missed else "missed: " + "; ".join(jam_missed))
        + f"; inside the full fight (one Focus Titan) the Jam figure is reported, not judged, at most "
        f"{max(jamfight_worst):.1f}% (section 4.3).",
        f"- **The Sprinting Abnormal's bar (verdict, deaths through the end):** {fails_txt(bar_full)}. Under the "
        f"probes' reading: {fails_txt(bar_fight)}. Grab-alone variant: {fails_txt(g_full)} (through the end), "
        f"{fails_txt(g_fight)} (during the fight).",
        f"- **The retreat:** {100 * S(ref_med)['retreats']:.1f}% of the standard Medium Titan's reference fights and "
        f"{100 * S('ch6/' + C.reference_label('standard-large'))['retreats']:.1f}% of the standard Large Titan's end in "
        f"a retreat; {total_cap} fights over every full-fight run reached the safety cap (section 6.12).",
        f"- **Lone legal route:** {route_gaps} gaps in the state search; in play, at most {failed_checks:.1f}% of "
        "the grounded-start lone fights have a failed gap check (section 8).",
        f"- **Probe comparison:** {n} figures; {len(big)} beyond 3 standard errors, of which {by_rule} follow from "
        f"a rule (the Veteran's minimum Stress), {sampling} are explained by re-checks on new seeds, and "
        f"{len(unexplained)} are not explained (section 11"
        + (f"; {OQ_NOT_MEASURED['probe_gaps']}" if unexplained else "") + ").",
        "- **Headline figures moved since the previous run:** " + ("; ".join(moved) + "." if moved else
                                                                  ("none." if prev else "no previous run to compare.")),
        f"- **Missed results:** {len(missed)}" + (" (" + "; ".join(t + (f", {o}" if o else ", no Open Question") for _, t, o in missed) + ")." if missed else "."),
        f"- **Chapter bugs:** {len(CHAPTER_BUGS)} (section 15). **Open Questions cited:** {len(cited)} (section 16).",
        "",
    ]
    L[summary_at:summary_at] = summary
    out = OUT_FULL if full else OUT_SCALE
    with open(out, "w") as fh:
        fh.write("\n".join(L))
    print("wrote", out)
    return dict(missed=missed, unexplained=[c["key"] for c in unexplained])


# ---------------------------------------------------------------------- pieces of the report
def fmt_field(field, x):
    if x is None:
        return "n/a"
    if field in PCT:
        return f"{x:.1f}%"
    if field == "median":
        return str(x)
    return f"{x:.4f}"


def judged_value(row):
    """A judged figure (targets.judge) with its standard error and, when it was re-run, the pooled figure."""
    txt = fmt_field(row["field"], row["value"])
    if row["se"] is not None:
        txt += f" +/- {row['se']:.1f}" if row["field"] in PCT else f" +/- {row['se']:.4f}"
    if row["status"] == "edge":
        if row.get("no_second_seed"):
            txt += "; past an edge within 2 standard errors, and no second seed was run"
        else:
            txt += f"; second seed, pooled {fmt_field(row['field'], row['pooled_value'])}"
    return txt


def judged_text(row):
    return f"{row['name']}: {judged_value(row)}, tolerance {row['tol']['text']}"


FIGHT_CELLS = ["Median", "By round 3, %", "No kill, %", "Critical Injuries", "PC Critical Injuries",
               "Deaths during the fight", "Deaths through the end", "Grabs"]


def fight_cells(s):
    return [med_txt(s), f1(s["by3"]), f1(s["nokill"]), f2(s["cis"]), f2(s["pc_cis"]), f3(s["deaths"]),
            f3(s["deaths_all"]), f3(s["grabs"])]


FIGHT_CMP_HEAD = ["Case", "Median", "By round 3, %, z", "No kill, %, z", "Critical Injuries, z",
                  "Deaths during the fight, z", "Deaths through the end", "Grabs"]


def fight_cmp_row(label, key, com, source, S, cidx):
    s = S(key)

    def zc(field):
        c = cidx.get((key, field, source))
        return zf(c["z"]) if c else ""
    cm = com.get("median")
    return [label, f"{med_txt(s)} ({'n/a' if cm is None else int(cm)})",
            f"{f1(s['by3'])} ({f1(com.get('by3'))}) {zc('by3')}",
            f"{f1(s['nokill'])} ({f1(num(com.get('nokill')))}) {zc('nokill')}",
            f"{f2(s['cis'])} ({f2(com.get('cis'))}) {zc('cis')}",
            f"{f3(s['deaths'])} ({f3(com.get('deaths'))}) {zc('deaths')}",
            f3(s["deaths_all"]), f"{f3(s['grabs'])} ({f3(com.get('grabs'))})"]


def fmt_v(c, v):
    return f1(v) if c["field"] in PCT else f3(v)


def lf_row(sec):
    return T5["solo_nape"]["lone_fight"][sec][0]


def rules_notes():
    return [
        f"Squadmates never Push and never Cover (`data/character/squadmates.yaml`, read as pushes {R.squadmate_pushes}, "
        f"covers {R.squadmate_covers}).",
        "Every table and value is read from `data/` YAML when the run starts (`tools/sim/rules.py`), including "
        "the Stress Response, Fear Roll, Critical Injury, fall, Scar, carrying, Anchor Rating, Attention Ladder, "
        "Break Attention, Standard Issue, retreat, healing, and engagement-end tables, and the values of Chapter 5's "
        "Attack Dice and rejected-alternative rows, read from their case text.",
        f"**Titan attacks** (decision batch 8, 8-1 and 8-2; ADR-0019). A card rolls its entry's Attack Dice once as Titan "
        f"Dice succeeding on {R.titan_face} or higher, and every target compares against the same successes; the dodge "
        "cancels one for one and the card lands on 1 or more net successes; 0 successes whiff against every target, a "
        "soldier who cannot react included. A landed critical-injury effect adds "
        f"{RIDER_PER_NET} to its roll per net success beyond the first; the Grab, knock loose, and Stress take none. The "
        "reference soldier dodges any card with 1 or more successes whose effects harm and Pushes when short; the Grab "
        "cell redraws the Titan's roll and the dodge until the Grab lands.",
        "**Burn, the falling Titan, and Pinned** (decision batch 8, 8-7 to 8-9). Steam at the kill (On Body and Blind "
        "Spot) and at a Regeneration fill that recovers a Body Part (On Body), as Burn damage; the fall at the kill and at "
        "grounding, with Leap Clear, the pin, corpse heat at the start of each turn under a corpse, and Heave toward the "
        "Heave rating, a Heave on a corpse taking Burn damage; the Titan Engagement runs on while a soldier lies Pinned. "
        "The Burn rider doubles healing, puts lethal rows on a day limit, and allows Treat Injury only with a medical kit "
        "or medical supplies.",
        f"**The retreat clock and the retreat** (`data/engagement/background-titans.yaml`; decision batch 5, 5-1 and "
        f"5-10; 5b, 5-15). The clock ({R.retreat_clock} segments) fills 1 segment at the background-clocks end step, "
        "after the Gas Rolls and Regeneration, and never during a retreat. Under the retreat each standing soldier's "
        "forced move comes before the action, and the engine raises when a policy acts first, with two exceptions. "
        "An action taken first for a Down or Grabbed comrade at the soldier's Position must be one of the actions "
        "option 4 names, and the only move after it is the stay with that comrade. A lift must be followed by the "
        "move that carries the comrade out. No Nape strike is made in "
        "a retreat, on a turn or through Hook and Cut, whose Tactic is then not spent. A soldier at Distant leaves, a "
        "carried comrade leaves with the carrier, a soldier at On Body or Blind Spot who can make no step lets go and "
        "falls, and no one returns. A soldier who has left still takes turns (turn-limit Death Rolls) and makes Gas "
        "Rolls, and is no candidate, target, helper, or witness. The Titan Engagement ends by a kill or when no "
        "standing soldier holds a Position, and every soldier still holding one then dies, left behind with no "
        "witnesses (`data/engagement/engagement-flow.yaml`).",
        "The end of the Titan Engagement runs every step of `data/harm/engagement-end.yaml` in its order: "
        "Stress relief, lasting Stress Responses, turn limits reaching the engagement, aftermath Treat Injury "
        "rolls, Death Rolls, the care window (one Treat and one Field Repair roll for each soldier who is able, "
        "with Help and Covering), Grief (stopping at the maximum), and retirement and promotion. The steps read each "
        "soldier's last Positions, those held when the Focus Titan died; soldiers who have left count as holding the "
        "same Position as each other and never one step from a soldier who holds one. Scars are gained from "
        "stabilized lethal injuries, and the Scar table's rows apply by id. A left-behind soldier's items leave play "
        "(decision batch 5b, 5-18): no step shares them out.",
        "**A day passing** (`data/harm/healing.yaml`, `each_day`), in a sequence at the start of each later session: "
        "the day care window over every soldier in the Squad, with Field Repair (decision batch 5b, 5-16); a Death "
        "Roll for each lethal injury whose day limit runs out, where fighting back stabilizes it and gives its Scar; "
        "all Health lost to damage restored; and a day off each held injury's healing time, with a lethal injury not "
        "yet stabilized held at 1 day. A healed injury keeps only its permanent effects' penalties. The deaths of the "
        "day give Grief as `data/mind/grief.yaml` states.",
        "Horsemanship's dice join a dodge only while mounted, with the horse as the dodge's gear item "
        "(`data/character/talents.yaml`, `condition`). Draw Attention is taken only from a Position other than "
        "Distant. A Grab lands in `data/engagement/grab.yaml`'s order: the failed dodge, the hold, the crush on a "
        "soldier already Grabbed (so a target the crush makes Down is Down in the hand and does not fall), Attention, "
        "and witnesses. A fall is read relative to its reference Titan, which with one Focus Titan is always that Titan.",
        "When a kill or no-soldier-standing ends a Titan Engagement partway through a round, that round's Gas Rolls "
        "are made at once, before the end steps. A soldier who dies after using ODM Gear makes theirs when they die "
        "(`data/gear/odm-gear.yaml`, `gas_roll`).",
        "Read and Call It, Wings and the Wings step, initiative swaps, Pry Loose (on its own row's needs and lifted "
        "penalty), Help on Break Free, carrying a comrade, overloaded ODM moves, mounting within a move, Treat Injury "
        "during and after the fight, eye strikes, and Scar-row penalties, triggers, and Stress gains are in the "
        "engine and fire only in the rows whose Squad uses them (sections 6 and 7).",
        "In a sequence, every living soldier takes part in each Titan Engagement, and a player character who died or "
        "retired is replaced by promotion (section 6.11).",
        "Round-time counters count at `data/engagement/round.yaml`'s `tracker_moments`, every dice pool, every "
        "ladder evaluation, dodge, Fear Roll, and Gas Roll.",
    ]


def choice_notes(oq):
    return [
        f"The reference Squadmate is a Rookie build at the Rookie's fight-start Stress ({R.builds['rookie']['stress']}), "
        "as ADR-0014's default Squad names \"all Rookies\"; the template Squad rows use the templates. This is a "
        "reading of the reference Squad, not a Squadmate rule.",
        "**The retreat policy** (`policy.retreat_turn`) is the probes' (`tools/probes/chapter-05/fight.py`), with the "
        "two additions `data/engagement/tuning.yaml` (`simulator_cases`) names. A soldier at a Grabbed comrade's "
        "Position pries with Pry Loose as the rescue chooses it, strikes the holding arm, or with the escapes takes "
        "Break Attention, then stays; from elsewhere they step toward the hand, then act. A soldier carrying a comrade "
        "heads out. Otherwise the nearest Down comrade is lifted and carried out, or, in the Treat Injury rows, a "
        "turn-limit lethal injury on them is treated first and the soldier stays. Otherwise a step toward Distant, "
        "leaving there, and letting go from On Body or Blind Spot when no step can be made. **A soldier who has left "
        "takes no action** (POLICY CHOICE): `data/engagement/positions.yaml` (`leaving`, `after_leaving`) allows any "
        "action that needs no Position relative to a Titan, so no row measures Treat Injury by soldiers who have left, "
        f"on each other or on a comrade one of them carried out ({oq('OQ-132')}, option (b)).",
        "**The pooled judgement** (`tools/sim/targets.py`). The second-seed rule names no margin for the pooled "
        "figure, so a target or band figure re-run on a second seed is Met only when the pooled figure is inside the "
        "band. The bar keeps the within-sampling margin `data/titans/tuning.yaml` states for it (section 5). "
        f"Logged as a provisional reading in {oq('OQ-127')}.",
        "**Every run of a reference start is judged** (`tools/sim/targets.py`). A per-table band is read at the "
        "table's reference start, which the simulator runs as its Chapter 6 row and as the bar's twin row in each "
        "Squad sheet order. The order chooses nothing, so each run measures the same band, and each is judged on its "
        f"own: a band is met only when every run meets it (section 3). Logged as a provisional reading in {oq('OQ-127')}.",
        "The reference Rookie holds no medical kit: Standard Issue gives one only to the Medic. Without a kit, "
        "Treat Injury rolls the attribute alone. The kit rows (section 7) give every soldier a kit rated 1.",
        f"The treatment sequence's cadence ({oq(OQ_NOT_MEASURED['sequence'])}), the readings section 6.11 lists beside "
        f"it, and the Veteran's Scar rows ({oq(OQ_NOT_MEASURED['veteran_scars'])}) are provisional readings.",
        "The Health reports' earlier injury is the first leg Critical Injury row that is not lethal, not Down, not "
        "permanent, and gives no Break Free penalty (`families.earlier_injury_row`).",
        "Policies (`tools/sim/policy.py`, whose docstring states each): the baseline roles and dodging of "
        "`data/engagement/tuning.yaml`. Strikers cut as cutters where no chain of steps reaches Blind Spot. A comrade "
        "with Pry Loose pries when the holding arm needs more successes than Pry Loose needs or cannot be struck, and "
        "pries first in the Pry Loose rows. Swaps pair every cutter whose card comes after a striker's with that "
        "striker, and the engine makes each pair within one step whose soldiers are in no earlier swap. Wings: each "
        "living Squadmate, in sheet order, goes on the Wing of the next living player character without one, those "
        "not Down or Grabbed first, one Squadmate a Wing. The Tactician stays at Distant and Reads on each of its "
        "turns while no decoy holds, unless it has already Called It on the current Next Behavior and the ladder is "
        "known; it takes the ladder first on an Abnormal whose ladder is hidden, then Calls It whenever the "
        "successes left pay for it. Aftermath: patients Down first, then by the largest Death Roll penalty, each "
        "treated by the soldier within one step, not Down and not yet treating, with the largest Treat Injury pool, "
        "or by themself when no comrade qualifies and they are not Down. Care window: each soldier not Down makes one "
        "Treat Injury roll, the largest pools taking untreated lethal injuries, then Down rows, then other injuries, "
        "then reviving; spare soldiers Help each lethal patient's roll, with a medical unit on it; then each makes one "
        "Field Repair, on their own worn ODM Gear or else the first worn comrade's. The lone soldier: section 8; its "
        "measurement ends when the retreat clock fills, since no Nape strike is made in a retreat.",
    ]


def not_modelled(oq):
    return [
        f"Two Focus Titans in one Titan Engagement, Background Titans and their clocks, and leaving and returning "
        f"outside a retreat ({oq(OQ_NOT_MEASURED['two_titans'])}).",
        f"The Opus review 1 model; that code is not committed ({oq(OQ_NOT_MEASURED['opus_model'])}).",
        "Expedition rules (Phase 2).",
        "Lost limbs and prosthetics (decision batch 8, 8-13): the graded `lost_limb_riders` of "
        "`data/harm/critical-injuries.yaml` and the prosthetic that lowers a grade; a soldier who loses a limb carries "
        "only the row's own effects. The Straggler and the Bite rider are the rules that reach them. So are their Leap "
        "Clear and Heave readings (decision batch 8, 8-23: both arms lost, no ODM Gear Dice on Leap Clear and no Heave; "
        "the 13+ rows' penalties on heave and leap-clear), and the no-soldier-standing test's past_the_stay_limit "
        "reading, which counts a soldier the both-legs grade leaves unable to move as not standing from the first round "
        "past the stay limit (engagement-flow.yaml, ending; decision batch 8, 8-34).",
        "The Pinned list's entries beyond cutting free and Heave (Read, Call It, Rally, Draw Attention, Help, and Swap "
        "Initiative Card): a limb-pinned soldier strikes the pinning Body Part when one pins them and it can be struck, "
        "and otherwise Heaves (decision batch 8, 8-9 and 8-17; `policy.pinned_turn`).",
        "Talents on rolls the simulator never makes or under a condition it never meets (decision batch 7, 7-2): "
        + ", ".join(sorted(t for t, conds in R.talent_conditions.items() if set(conds.values()) <= {"outside", "expedition"}))
        + "; and every rule Talent not in `cases.TALENT_FIGHTS` or `TALENT_GRABS`, nor Spare Parts and Will to Live.",
        "POLICY CHOICES the batch 8 rules leave to the players: Leap Clear takes Help only in rows with dodge_help; under a "
        "living grounded Titan one comrade frees the Pinned, cutting the pinning Body Part first, and the others fight on "
        "(`policy.heaver`); under a retreat a soldier carrying no one goes to the nearest Pinned comrade, cuts the pinning "
        "Body Part or Heaves, and stays (decision batch 8, 8-21; `policy.retreat_turn`), before lifting a Down comrade.",
    ]


DIVERGENCES = [
    "**One engine, not per-chapter probes.** Chapter 5's reference Titan, Chapter 6's four Titans, lone fights, "
    "Grab cells, and the full-fight Jam test all run through `engine.Fight`. The simulator's Grab cell is a full "
    "fight started at the moment the Grab lands, with the holding Titan's Tempo, Regeneration, and flags, and no "
    "retreat clock.",
    "**Break Attention names its decoy.** The flare spends Squad Supply, the thrown cloak is once a fight, the "
    "riderless horse bolts, and the Feint is made with ODM Gear, a sound horse, or on foot against a grounded "
    "Titan (`data/engagement/attention.yaml`, `decoys`).",
    "**A dismounted soldier's horse stands where they dismounted** (`data/engagement/positions.yaml`, placement).",
    "**The end steps are rolled.** The probes stopped at the fight's end. The in-fight death reading is kept for "
    "every comparison with committed figures.",
    "**No Nape strike in a retreat** (decision batch 5b, 5-15). The batch 5 probe let a striker at Blind Spot with "
    "two free Openings cut while a Grab was held at the retreat's start, an event under one fight in a hundred; the "
    "simulator makes none, and a Hook and Cut in a retreat is not taken.",
    "**The retreat policy treats and pries** in the rows that give those actions, where the probe's retreat did "
    "neither.",
    "**Chapter 5 rows for superseded rules are not re-run**, nor is the Jam test's mix reading.",
]
