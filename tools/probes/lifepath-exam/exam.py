"""
The Graduation Exam parity probe (docs/rules/02-character-creation.md, section 2.4 design note).

Rolls whole Lifepaths from data/character/*.yaml, then runs the Year 3 performance roll, the
old three-Trial Exam, and the expanded Exam, and reports each one's mean Merit and the share of
Cadets who reach a Top 10 Class Rank. The targets OQ-22 records: the Exam's mean Merit within
0.1 of the Year 3 performance roll it replaces, and the Top 10 share within 0.3 points of the
share without it, for 1 to 6 Cadets.

Run: python3 tools/probes/lifepath-exam/exam.py [trials]
"""
import random
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[3]
D = ROOT / "data" / "character"


def load(name):
    return yaml.safe_load((D / name).read_text())


ORIGINS = load("origins.yaml")
ENLIST = load("enlistment.yaml")
YEARS = load("training-years.yaml")
RANKS = load("class-rank.yaml")
TALENTS = load("talents.yaml")
CATALOG = load("action-catalog.yaml")

ATTRS = ["strength", "agility", "wits", "perception", "instinct", "empathy"]
CAP = 5
ENTRY_ATTR = {e["id"]: e.get("attribute") for e in CATALOG["entries"]}
TALENT = {x["id"]: x for x in TALENTS["talents"]}
DICE_TALENTS = {x["id"]: x for x in TALENTS["talents"] if x["type"] == "dice"}


def d6():
    return random.randint(1, 6)


def d66():
    return d6() * 10 + d6()


def row_for(rows, roll):
    for r in rows:
        if roll in r["results"]:
            return r
    raise KeyError(roll)


def sixes(n):
    return sum(1 for _ in range(n) if d6() == 6)


def roll_faces(n):
    return [d6() for _ in range(n)]


def push(faces):
    """A Push re-rolls every die showing neither 6 nor 1."""
    return [f if f in (1, 6) else d6() for f in faces]


# ---------------------------------------------------------------- the Lifepath


def add_point(attrs, attr):
    if attrs[attr] < CAP:
        attrs[attr] += 1
        return
    free = [a for a in ATTRS if a != attr and attrs[a] < CAP]
    if free:
        attrs[random.choice(free)] += 1


def best_talent(attrs, levels, options):
    """An aimed pick: raise a dice Talent the Cadet already holds, else take one that names an
    entry on their best attribute. A player builds toward one Specialty, so levels concentrate."""
    gainable = [x for x in options if levels.get(x, 0) < min(2, TALENT[x].get("max_level", 1))]
    if not gainable:
        return None
    scored = []
    for x in gainable:
        t = TALENT[x]
        if t["type"] != "dice":
            scored.append((0, x))
            continue
        best = max((attrs[ENTRY_ATTR[n]] for n in t["names"] if ENTRY_ATTR.get(n)), default=0)
        scored.append((best + 1 + (10 if levels.get(x, 0) else 0), x))
    top = max(s for s, _ in scored)
    return random.choice([x for s, x in scored if s == top])


def talent_options(event, year, levels, curriculum_open):
    options = list(event["talent_choice"])
    if curriculum_open:
        options += [x for x in year["curriculum"] if x not in options]
    if not any(levels.get(x, 0) < min(2, TALENT[x].get("max_level", 1)) for x in options):
        options = list(TALENT)
    return options


def lifepath(curriculum_open):
    """One Cadet through the Origin, Why You Enlisted, and the three Training Years."""
    attrs = {a: 2 for a in ATTRS}
    levels = {}
    merit = 0
    while True:
        origin = row_for(ORIGINS["rows"], d66())
        cond = origin.get("condition")
        if not cond or cond.get("campaign_year_min", 845) <= 845:
            break
    for a in origin["attributes"]:
        add_point(attrs, a)
    pick = best_talent(attrs, levels, origin["talent_choice"])
    if pick:
        levels[pick] = levels.get(pick, 0) + 1
    add_point(attrs, row_for(ENLIST["rows"], d66())["attribute"])
    perf_bands = YEARS["performance_roll"]["merit_from_successes"]
    for i, year in enumerate(YEARS["years"]):
        event = row_for(year["events"], d66())
        add_point(attrs, event["attribute"])
        merit += event["merit_change"]
        pick = best_talent(attrs, levels, talent_options(event, year, levels, curriculum_open))
        if pick:
            levels[pick] = levels.get(pick, 0) + 1
        if i < 2:
            merit += band(perf_bands, sixes(max(attrs[a] for a in year["performance_attributes"])))
    return attrs, levels, merit


def band(bands, successes):
    for b in bands:
        lo = b["successes_min"]
        hi = b["successes_max"]
        if successes >= lo and (hi is None or successes <= hi):
            return b["merit"]
    return 0


def year3_performance(attrs):
    year = YEARS["years"][2]
    dice = max(attrs[a] for a in year["performance_attributes"])
    return band(YEARS["performance_roll"]["merit_from_successes"], sixes(dice))


def talent_dice(levels, entry):
    best = 0
    for tid, t in DICE_TALENTS.items():
        if entry in t["names"] and not (t.get("condition") or {}).get(entry):
            best = max(best, levels.get(tid, 0))
    return best


# ---------------------------------------------------------------- the Exams

# A Trial as the model reads it: entry choices (entry, gear dice), successes needed, Push, Help.
OLD_TRIALS = [
    dict(choices=[("fly", 1)], needs=2, push=False, help=False, bands=[(2, None, 1)]),
    dict(choices=[("nape-strike", 1)], needs=2, push=False, help=False, bands=[(2, None, 1)]),
    dict(
        choices=[("read", 0), ("break-attention", 1), ("body-part-strike", 1), ("treat-injury", 1), ("field-repair", 1), ("rally", 0)],
        needs=3,
        push=True,
        help=True,
        bands=[(3, None, 1)],
    ),
]


def merit_of(bands, successes):
    out = 0
    for lo, hi, m in bands:
        if successes >= lo and (hi is None or successes <= hi):
            out = m
    return out


# A Push is worth taking only when the roll is within PUSH_REACH successes of what it needs.
PUSH_REACH = 1


def run_trial(trial, attrs, levels, stress, covered, helped, cond):
    """One Cadet's Trial roll. Returns (merit, stress after)."""
    shift = cond.get("needs", 0)
    needs = trial["needs"] + shift
    gear_ok = not cond.get("no_gear")
    bands = [(lo + shift, None if hi is None else hi + shift, m) for lo, hi, m in trial["bands"]]
    pushes = (1 if trial["push"] else 0) + cond.get("push", 0)
    stress += cond.get("stress", 0)
    entry, gear = max(
        trial["choices"],
        key=lambda c: attrs[ENTRY_ATTR[c[0]]] + talent_dice(levels, c[0]) + (c[1] if gear_ok else 0),
    )
    base = attrs[ENTRY_ATTR[entry]] + talent_dice(levels, entry) + (1 if helped else 0) + cond.get("bonus", 0)
    faces = roll_faces(base)
    gear_faces = roll_faces(gear if gear_ok else 0)
    stress_faces = roll_faces(stress)
    response = 1 in stress_faces
    done = 0
    while True:
        hits = sum(1 for f in faces + gear_faces + stress_faces if f == 6)
        if hits >= needs or done >= pushes or response or hits < needs - PUSH_REACH:
            break
        faces = push(faces)
        gear_faces = [f if f in (1, 6) else d6() for f in gear_faces]
        stress_faces = push(stress_faces)
        if not covered:
            stress += 1
            stress_faces.append(d6())
        if 1 in stress_faces:
            response = True
        done += 1
    hits = sum(1 for f in faces + gear_faces + stress_faces if f == 6)
    return merit_of(bands, hits) - (1 if response else 0), stress + cond.get("stress_after", 0)


def run_exam(trials, cadets, n):
    """Every Cadet takes each Trial in a rolled order, with cycle Help and aimed Covering."""
    out = [0] * n
    stress = [0] * n
    for trial in trials:
        cond = trial.get("cond", {})
        order = list(range(n))
        random.shuffle(order)
        for pos, i in enumerate(order):
            attrs, levels = cadets[i]
            helped = trial["help"] and n > 1
            # Only a Cadet who has not yet rolled this Trial can Cover, so the last roller cannot be.
            covered = trial["push"] and n > 1 and pos < n - 1
            merit, stress[i] = run_trial(trial, attrs, levels, stress[i], covered, helped, cond)
            if covered:
                stress[order[pos + 1]] += 1
            out[i] += merit
    return out


def top10(merit):
    for r in RANKS["rows"]:
        lo, hi = r["merit_min"], r["merit_max"]
        if (lo is None or merit >= lo) and (hi is None or merit <= hi):
            return r["top_10"]
    return False


def measure(n, runs, build_exam, curriculum_open):
    base_merit, exam_merit, base_top, exam_top, paid = 0, 0, 0, 0, 0
    groups = max(1, runs // n)
    for _ in range(groups):
        cadets, merits = [], []
        for _ in range(n):
            attrs, levels, merit = lifepath(curriculum_open)
            cadets.append((attrs, levels))
            merits.append(merit)
        exam = run_exam(build_exam(), cadets, n)
        for i in range(n):
            perf = year3_performance(cadets[i][0])
            base_merit += perf
            exam_merit += exam[i]
            paid += 1
            base_top += top10(merits[i] + perf)
            exam_top += top10(merits[i] + exam[i])
    return dict(
        base=base_merit / paid,
        exam=exam_merit / paid,
        base_top=100 * base_top / paid,
        exam_top=100 * exam_top / paid,
    )


def report(title, build_exam, runs, curriculum_open=False):
    print(f"\n{title}")
    print("  Cadets |  Year 3 Merit | Exam Merit | delta |  Top 10 without | with | delta")
    for n in (1, 2, 4, 6):
        r = measure(n, runs, build_exam, curriculum_open)
        print(
            f"  {n:6d} | {r['base']:13.3f} | {r['exam']:10.3f} | {r['exam'] - r['base']:+5.3f} |"
            f" {r['base_top']:14.2f}% | {r['exam_top']:4.2f}% | {r['exam_top'] - r['base_top']:+5.2f}"
        )




# ---------------------------------------------------------------- the expanded Exam

EXAM = load("graduation-exam.yaml")
EXAM_DICE = {i["item"]: i["gear_dice"] for i in EXAM["conditions"]["exam_issue"]}


def stage_model(stage):
    """One Stage of data/character/graduation-exam.yaml as the model reads it."""
    trials = []
    for tr in sorted(stage["trials"], key=lambda x: x["result"]):
        if "entry" in tr:
            choices = [(tr["entry"], EXAM_DICE.get(tr.get("gear_item"), 0))]
        else:
            choices = [(c["entry"], EXAM_DICE.get(c["gear_item"], 0)) for c in tr["entry_choice"]]
        trials.append(choices)
    return dict(
        needs=stage["needs"],
        push=stage["push"],
        help=stage["help"] != "none",
        bands=[(b["successes_min"], b["successes_max"], b["merit"]) for b in stage["merit"] if b["merit"]],
        trials=trials,
    )


STAGES = [stage_model(next(x for x in EXAM["stages"] if x["id"] == sid)) for sid in EXAM["order"]]

# The exam conditions table (conditions_table), as the model reads it: a condition applies to every
# Cadet taking that Stage's Trial.
CONDITIONS = [
    {
        "needs": r.get("needs_change", 0),
        "no_gear": bool(r.get("no_gear_dice")),
        "bonus": r.get("bonus_dice", 0),
        "push": r.get("extra_pushes", 0),
    }
    for r in sorted(EXAM["conditions_table"]["rows"], key=lambda x: x["result"])
]


def new_exam():
    """One Exam board: each Stage rolls D66 for its Trial (tens) and its condition (units)."""
    out = []
    for stage in STAGES:
        roll = d66()
        out.append(
            dict(
                choices=stage["trials"][roll // 10 - 1],
                needs=stage["needs"],
                push=stage["push"],
                help=stage["help"],
                bands=stage["bands"],
                cond=CONDITIONS[roll % 10 - 1],
            )
        )
    return out


if __name__ == "__main__":
    runs = int(sys.argv[1]) if len(sys.argv) > 1 else 60_000
    random.seed(23)
    report("The Exam as it stood: three fixed Trials", lambda: OLD_TRIALS, runs, curriculum_open=True)
    random.seed(23)
    report("The expanded Exam: three Stages, one D66 each", new_exam, runs, curriculum_open=True)
