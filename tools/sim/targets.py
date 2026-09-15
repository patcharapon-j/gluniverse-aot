"""The judged figures: every ADR-0014 target and every Chapter 6 band that carries a tolerance (ADR-0014 as amended
in decision batch 5, 5-11, OQ-127), with the second-seed rule.

Tolerances come from rules.R (data/engagement/tuning.yaml, each target's tolerance, cross-checked against
data/titans/tuning.yaml, adr_0014_targets_quoted, bands) and from data/titans/tuning.yaml, targets. A band's edges
read as written: "A% to B%" and "at most" hold their edges, "under" does not, and a median is read exactly.

The second-seed rule (data/titans/tuning.yaml, adr_0014_targets_quoted, bands, second_seed): a figure past an edge
by at most R.target_standard_errors standard errors on its first seed is re-run on a second seed (run.py) and
judged on the figure pooled over both runs; past that, or a median off its value, it is Missed. READING (the rule
names no margin for the pooled figure): the pooled figure is Met only inside the band. The bar's own rule
(barcheck.py) keeps its "within sampling" margin, which the bar's YAML states.

Judged here: Target 1's median on the standard Medium Titan's reference start; Targets 2 and 3 on the fresh cut
at the standard Medium Titan's Nape Depth; Target 4's Grab alone, its named cell, and every cell; Target 5's gas
medians; every per-table band at each table's reference start, and on the bar's runs of the same start in both
Squad sheet orders; and the Jam test's table reading on every standard table, for one and two Titans, every cell.
"""
import math

import cases as C
import dice
from rules import R, load, tolerance_of

T6 = load("titans/tuning.yaml")
BAND_FIELDS = {"median_kill_round": "median", "killed_by_round_3": "by3", "critical_injuries_per_fight": "cis",
               "deaths_per_fight": "deaths_all", "grabs_per_fight": "grabs", "no_kill": "nokill"}
STANDARD = [t for t in C.TITANS if t not in C.ABNORMAL_IDS]
JAM_LIMIT = dict(kind="band", value=None, lo=None, hi=None, lo_in=True, hi_in=False, text="under a third")


# A band may name the reading it is judged on after its limit (rules.tolerance_of). Decision batch 5, 5-19: every
# deaths figure a band names reads deaths through the end of the Titan Engagement, which is the field deaths_all.
READINGS = {"deaths through the end of the Titan Engagement": "deaths_all"}


def band_tolerance(size, k, v):
    """The tolerance of data/titans/tuning.yaml targets[size].at_the_reference_start[k], with its reading checked
    against the field targets.py judges. Raises when the figure, the band, or the reading changes."""
    if k not in BAND_FIELDS:
        raise ValueError(f"data/titans/tuning.yaml targets {size}: {k} is a figure targets.py does not read")
    tol = tolerance_of(v, f"targets, {size}, {k}")
    reading = tol.get("reading")
    if k == "deaths_per_fight":
        named = next((f for text, f in READINGS.items() if reading and reading.startswith(text)), None)
        if named != BAND_FIELDS[k]:
            raise ValueError(f"data/titans/tuning.yaml targets {size}: {k} names the reading {reading!r}; targets.py "
                             f"judges {BAND_FIELDS[k]} (decision batch 5, 5-19)")
        # decision batch 8, 8-31 (OQ-132, decided anew): the Medium band reads at most 0.08 through the end of the Titan
        # Engagement, the owner's chosen lethality (7-13's 0.06 and 5-19's 0.05 are history)
        if size == "medium" and (tol["hi"], tol["hi_in"]) != (0.08, True):
            raise ValueError(f"data/titans/tuning.yaml targets medium: {k} reads {tol['text']!r}; decision batch 8, "
                             "8-31 sets the band to at most 0.08 through the end of the Titan Engagement")
    elif reading:
        raise ValueError(f"data/titans/tuning.yaml targets {size}: {k} names a reading ({reading!r}) targets.py does not read")
    return tol


def check_bands():
    """Reads every per-table band once, when the module is imported, so that a wording change stops run.py before
    its case pass rather than after it."""
    for size, spec in T6["targets"].items():
        if isinstance(spec, dict) and "at_the_reference_start" in spec:
            for k, v in spec["at_the_reference_start"].items():
                band_tolerance(size, k, v)


check_bands()


def jam_limit():
    return dict(JAM_LIMIT, hi=100 * R.jam_limit_value)


def se_field(family, field):
    if family == "fight":
        return field + "_se"
    return "se"


def family_of(key):
    return {"ch6": "fight", "bar": "fight", "solo": "solo", "grab": "grab", "gas": "gas", "jam": "jam"}[key.split("/")[0]]


def specs(has):
    """Every judged figure as dict(id, group, name, key, field, tol). has(key) says whether a case exists."""
    out = []

    def put(id_, group, name, key, field, tol):
        if not has(key):
            raise ValueError(f"targets.py: judged figure {id_} needs case {key}, which cases.py does not run")
        out.append(dict(id=id_, group=group, name=name, key=key, field=field, tol=tol))
    T = R.tolerances
    med = "ch6/" + C.reference_label("standard-medium")
    put("target-1", "target-1", "Target 1: median kill round, standard Medium Titan", med, "median", T["median_kill_round"])
    nd = R.titan_blocks["standard-medium"]["nape_depth"]
    rs = R.builds["rookie"]["stress"]
    ls = R.builds[dice.BUILD_ALIASES.get("levi_grade", "levi_grade")]["stress"]
    put("target-2", "target-2", "Target 2: the lone Rookie's fresh cut, %", f"solo/nd{nd}/rookie/stress{rs}", "hit",
        T["rookie_fresh_cut"])
    put("target-3", "target-3", "Target 3: the Levi-grade soldier's fresh cut, %", f"solo/nd{nd}/levi_grade/stress{ls}",
        "hit", T["levi_grade"])
    put("target-4-alone", "target-4", "Target 4: a Grab alone, after a failed dodge, %",
        "grab/standard-medium/alone_dodge_failed", "dead", T["grab_alone"])
    st, g = R.grab_named_cell
    put("target-4-named", "target-4", f"Target 4: one comrade at Stress {st}, Grief {g}, %",
        f"grab/standard-medium/{C.cell_label(st, g)}", "dead", T["grab_named_cell"])
    for st, g in R.grab_cells:
        put(f"target-4-cell-{st}-{g}", "target-4", f"Target 4: every cell, Stress {st}, Grief {g}, %",
            f"grab/standard-medium/{C.cell_label(st, g)}", "dead", T["grab_every_cell"])
    put("target-5-standard", "target-5", "Target 5: gas, median rounds", "gas/standard", "median", T["gas_standard"])
    put("target-5-pushed", "target-5", "Target 5: gas pushing every round, median rounds", "gas/after_pushed_odm_roll",
        "median", T["gas_pushed"])
    for size in ("medium", "small", "large"):
        tid = T6["targets"][size]["titan"]
        label = C.reference_label(tid)
        rows = [("ch6/" + label, "its reference start")]
        rows += [(f"bar/{order}/{label}", f"the bar's run of it, {order.replace('_', ' ')}") for order, _, _ in C.ORDERS
                 if has(f"bar/{order}/{label}")]
        for k, v in T6["targets"][size]["at_the_reference_start"].items():
            tol = band_tolerance(size, k, v)
            for key, where in rows:
                put(f"band/{tid}/{k}/{key}", f"band/{tid}/{k}", f"{tid} {k.replace('_', ' ')}, {where}", key,
                    BAND_FIELDS[k], tol)
    for tid in STANDARD:
        for nt in R.jam_titan_counts:
            for cell, _, _ in R.jam_columns:
                put(f"jam/{tid}/{nt}/{cell}", f"jam/{tid}/{nt}", f"{tid} Jam test, table reading, {nt} Titans, {cell}",
                    f"jam/{tid}/table/{nt}_titans/{cell}", "jammed", jam_limit())
    return out


def inside(v, tol):
    if tol["kind"] == "exact":
        return v == tol["value"]
    lo, hi = tol["lo"], tol["hi"]
    if lo is not None and (v < lo or (v == lo and not tol["lo_in"])):
        return False
    if hi is not None and (v > hi or (v == hi and not tol["hi_in"])):
        return False
    return True


def past_se(v, se, tol):
    """Standard errors past the edge v breaks; 0 inside; infinite for a median off its value or no standard error."""
    if inside(v, tol):
        return 0.0
    if tol["kind"] == "exact":
        return math.inf
    lo, hi = tol["lo"], tol["hi"]
    gap = (lo - v) if (lo is not None and v <= lo) else (v - hi)
    return gap / se if se else math.inf


def first_verdict(spec, summ):
    """(status, value, se): status inside, edge (past by at most the rule's standard errors), or out."""
    s = summ[spec["key"]]
    fam = family_of(spec["key"])
    v = s[spec["field"]]
    se = None if spec["tol"]["kind"] == "exact" else s.get(se_field(fam, spec["field"]))
    if inside(v, spec["tol"]):
        return "inside", v, se
    # a figure on an exclusive edge ("under 50%") is outside by 0 standard errors: an edge case, not inside
    p = past_se(v, se, spec["tol"])
    return ("edge" if p <= R.target_standard_errors else "out"), v, se


def edge_keys(summ):
    """The cases run.py re-runs on a second seed for the targets."""
    return sorted({sp["key"] for sp in specs(summ.__contains__) if first_verdict(sp, summ)[0] == "edge"})


def judge(summ, pooled):
    """Every judged figure with its verdict: dict(spec..., value, se, status, pooled_value, pooled_se, met)."""
    out = []
    for sp in specs(summ.__contains__):
        status, v, se = first_verdict(sp, summ)
        row = dict(sp, value=v, se=se, status=status, pooled_value=None, pooled_se=None)
        if status == "inside":
            row["met"] = True
        elif status == "out":
            row["met"] = False
        else:
            p = pooled.get(sp["key"])
            if p is None:
                row["met"] = False
                row["no_second_seed"] = True
            else:
                pv = p[sp["field"]]
                row["pooled_value"] = pv
                row["pooled_se"] = p.get(se_field(family_of(sp["key"]), sp["field"]))
                row["met"] = inside(pv, sp["tol"])
        out.append(row)
    return out
