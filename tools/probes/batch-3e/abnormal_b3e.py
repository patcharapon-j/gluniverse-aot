"""Applying decision batch 3e to Chapter 6 (3e-6's constraint on the Sprinting Abnormal), on
tools/probes/chapter-06/fight6.py with the batch 3e rules as its defaults.

Reports:
- ladder: the Sprinting Abnormal's ladder without current-holder ([loudest-or-brightest, hooked-into-its-body,
  nearest], the ladder before batch 3e, whose figures measured a Titan that kept its holder), in the rows whose
  ceiling the Chapter 6 round 3 review found failing, at 120,000 fights a row with standard errors, beside the
  standard Large Titan's twins from tools/probes/chapter-06/results/bar.json;
- nape_depth_4: the Sprinting Abnormal with its ladder as chosen and Nape Depth 4, at the reference start, with
  helpers, and with the template Squad, at 120,000 fights a row, beside the same twins (Chapter 6 round 3,
  Minor 3);
- thrash: the share of resolved cards that are Thrash on every table at its reference start, and how many of
  those came from an entry's Position requirement (Chapter 6 round 3, Minor 2), 12,000 fights a table;
- holder: at the Sprinting Abnormal's reference start, the evaluations in which its current-holder rung kept a
  holder who was not at the closest Position, and the cards resolved against a holder at Distant while a
  candidate stood closer, and against a Down holder, 60,000 fights.
Seeds are fixed. Run from the repository: uv run --with pyyaml python tools/probes/batch-3e/abnormal_b3e.py
"""
import json
import os
import random
import sys
from multiprocessing import Pool

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
CH6 = os.path.join(HERE, "..", "chapter-06")
sys.path.insert(0, CH6)
import fight6 as F6  # noqa: E402
F6.f5.DEFAULT_RETREAT_CLOCK = None  # decision batch 5: this record ran under the 12-round horizon

NEAREST = F6.f5.NEAREST
OLD_RUNGS = ["loudest-or-brightest", "hooked-into-its-body", "nearest"]


class Counted(F6.Fight6):
    def __init__(self, rng, cfg):
        super().__init__(rng, cfg)
        for k in ("thrash", "thrash_fallback", "resolved_counted", "kept_not_closest", "vs_distant_closer",
                  "vs_down"):
            self.stats[k] = 0

    def evaluate(self, end_step=False):
        t = self.t
        before = t.holder
        super().evaluate(end_step)
        if "current-holder" in t.rungs and before not in (None, "decoy") and t.holder is before:
            cands = self.alive()
            if cands and NEAREST[before.pos] > min(NEAREST[s.pos] for s in cands):
                self.stats["kept_not_closest"] += 1

    def choose(self, h):
        beh = super().choose(h)
        self.stats["resolved_counted"] += 1
        if beh == "thrash":
            self.stats["thrash"] += 1
            if self.t.nb != "thrash" and self.t.parts_ok(self.t.entries[self.t.nb]):
                self.stats["thrash_fallback"] += 1
        cands = self.alive()
        if h.pos == "distant" and any(NEAREST[s.pos] < NEAREST["distant"] for s in cands):
            self.stats["vs_distant_closer"] += 1
        if h.down:
            self.stats["vs_down"] += 1
        return beh


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [Counted(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=None):
    procs = procs or os.cpu_count() or 4
    chunk = max(1, n // procs)
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F6.summarize(res)
    k = len(res)
    for key in ("thrash", "thrash_fallback", "resolved_counted", "kept_not_closest", "vs_distant_closer", "vs_down"):
        out[key] = round(sum(r[key] for r in res) / k, 3)
    return out


def se_gap(a, b, key):
    se = (a[key + "_se"] ** 2 + b[key + "_se"] ** 2) ** 0.5
    return (a[key] - b[key]) / se if se else 0.0


if __name__ == "__main__":
    # The standard Large Titan's twins as tools/probes/chapter-06/results/bar.json held them in decision batch 3e's
    # run. That file has since been re-run under decision batch 4's rules, so the figures this probe read are
    # written here, and every row pins batch 3e's rules (the Squad-sheet tie-break, current-holder met wherever the
    # holder stands) and the Sprinting Abnormal's Grab and Headlong Lunge at Severity 3, as they stood; so this
    # script repeats abnormal_b3e.out. Its figures are decision batch 3e's record; tools/probes/batch-4/abnormal_b4.py
    # reports the Sprinting Abnormal under decision batch 4.
    large = {
        "reference": {"deaths": 0.1635, "deaths_se": 0.0021, "nokill12": 13.03, "nokill12_se": 0.097},
        "helpers": {"deaths": 0.0196, "deaths_se": 0.0006, "nokill12": 9.29, "nokill12_se": 0.084},
        "template": {"deaths": 0.2777, "deaths_se": 0.0027, "nokill12": 19.96, "nokill12_se": 0.115},
        "screen": {"deaths": 0.0106, "deaths_se": 0.0004},
        "screen_pair": {"deaths": 0.0092, "deaths_se": 0.0004},
    }
    batch_3e = dict(tie_break="sheet", quarry="anywhere")
    ab = dict(titan_id="sprinting-abnormal", policy="eager", mounted_start=True, **batch_3e,
              entry_over={"grab": {"severity": 3}, "headlong-lunge": {"severity": 3}})
    rows = {
        "reference": dict(ab),
        "helpers": dict(ab, squadmates=2),
        "template": dict(ab, template=True),
        "screen": dict(ab, squadmates=2, squadmate_role="screen2"),
        "screen_pair": dict(ab, squadmates=2, squadmate_role="screen2", escapes=True, tactics=["hook", "hamstring"]),
    }
    keys = ("median", "by3", "nokill12", "nokill12_se", "cis", "cis_se", "deaths", "deaths_se")
    seed = 3900
    for name in ("helpers", "screen", "screen_pair"):
        seed += 1
        r = run_many(dict(rows[name], rungs=OLD_RUNGS), 120000, seed)
        lg = large[name]
        print(f"ladder without current-holder | {name}", {k: r[k] for k in keys},
              f"| Large twin deaths {lg['deaths']} +- {lg['deaths_se']}, {se_gap(r, lg, 'deaths'):.1f} SE past", flush=True)
    for name in ("reference", "helpers", "template"):
        seed += 1
        r = run_many(dict(rows[name], titan={"nd": 4}), 120000, seed)
        lg = large[name]
        print(f"nape depth 4 | {name}", {k: r[k] for k in keys},
              f"| Large twin deaths {lg['deaths']} +- {lg['deaths_se']} ({se_gap(r, lg, 'deaths'):.1f} SE), "
              f"no kill {lg['nokill12']} +- {lg['nokill12_se']} ({se_gap(r, lg, 'nokill12'):.1f} SE)", flush=True)
    starts = [
        ("standard-small", dict(titan_id="standard-small", policy="eager", **batch_3e)),
        ("standard-medium", dict(titan_id="standard-medium", policy="eager", **batch_3e)),
        ("standard-large", dict(titan_id="standard-large", policy="eager", **batch_3e)),
        ("sprinting-abnormal", dict(ab)),
    ]
    for tid, cfg in starts:
        seed += 1
        r = run_many(cfg, 12000, seed)
        share = 100 * r["thrash"] / r["resolved_counted"]
        print(f"thrash | {tid}", {"resolved_per_fight": r["resolved_counted"], "thrash_per_fight": r["thrash"],
                                  "thrash_share": round(share, 1), "thrash_by_position_per_fight": r["thrash_fallback"]},
              flush=True)
    seed += 1
    r = run_many(dict(ab), 60000, seed)
    print("holder | sprinting-abnormal reference start",
          {k: r[k] for k in ("kept_not_closest", "vs_distant_closer", "vs_down", "resolved_counted", "by3", "cis", "deaths")},
          flush=True)
