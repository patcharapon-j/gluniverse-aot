"""The Sprinting Abnormal's bar, read as data/titans/tuning.yaml (targets, abnormals) states it.

Each Abnormal row against its standard Medium and Large twins (data/titans/probe-figures.yaml, bar, rows):
- not trivial: median kill round the YAML's floor or later; Critical Injuries at least the Medium twin's; in
  the reference row, deaths more than the standard Medium Titan's reference row;
- winnable: median kill round the YAML's ceiling or sooner; no kill (the Focus Titan alive when the Titan
  Engagement ends under the retreat clock) at most the Large twin's;
- ceiling: deaths at most the Large twin's.
A limit holds on the permitted side of the twin, holds within sampling when past it by at most the YAML's
standard errors of the difference, and is past otherwise. Under decision batch 4b (4b-4) a row past on one seed
is re-run on a second seed in the same order, the Abnormal row and its twins, and fails only if the figure
pooled over the two runs is past. The median is read exactly on the first seed.

Every limit and the tolerance come from rules.R, which raises if the YAML wording they are read from changes.
Deaths are read two ways: deaths_all, every death the Titan Engagement causes through its end steps (the
rules' reading, and the verdict), and deaths, those during the fight and left behind (the probes' reading).
"""
import math

from rules import R

STANDARD_ERRORS = R.bar_standard_errors
MEDIAN_MIN = R.bar_median_min
MEDIAN_MAX = R.bar_median_max
READINGS = {"full": "deaths_all", "in_fight": "deaths"}


def limit(a, a_se, b, b_se, need_ge):
    """Returns (z past the limit, status): negative z is on the permitted side."""
    gap = (b - a) if need_ge else (a - b)
    d = math.sqrt(a_se ** 2 + b_se ** 2)
    zz = gap / d if d > 0 else 0.0
    return zz, ("holds" if gap <= 0 else ("within sampling" if zz <= STANDARD_ERRORS else "past"))


def check(A, M, L, Mref, is_reference, reading="full"):
    """A, M, L, Mref: fight summaries (the Abnormal row, its Medium and Large twins, the Medium reference row).
    Returns {limit name: (text of the figures, z, status)} with the median read exactly."""
    dk = READINGS[reading]
    out = {"median": (str(A["median"]), None, "holds" if MEDIAN_MIN <= A["median"] <= MEDIAN_MAX else "past")}
    zz, st = limit(A["cis"], A["cis_se"], M["cis"], M["cis_se"], True)
    out["Critical Injuries floor"] = (f"{A['cis']:.3f} vs {M['cis']:.3f}", zz, st)
    zz, st = limit(A["nokill"], A["nokill_se"], L["nokill"], L["nokill_se"], False)
    out["winnable"] = (f"{A['nokill']:.2f} vs {L['nokill']:.2f}", zz, st)
    zz, st = limit(A[dk], A[dk + "_se"], L[dk], L[dk + "_se"], False)
    out["ceiling"] = (f"{A[dk]:.4f} +/- {A[dk + '_se']:.4f} vs {L[dk]:.4f} +/- {L[dk + '_se']:.4f}", zz, st)
    if is_reference:
        zz, st = limit(A[dk], A[dk + "_se"], Mref[dk], Mref[dk + "_se"], True)
        out["reference deaths"] = (f"{A[dk]:.4f} vs {Mref[dk]:.4f}", zz, st)
    return out


def past_any(result):
    return [name for name, (_, _, st) in result.items() if st == "past" and name != "median"]
