"""Applying decision batch 4 to Chapter 6: the Sprinting Abnormal's reports that run6.py does not write, on
tools/probes/chapter-06/fight6.py with its committed defaults (the last tie-break leaves Attention held by
nothing; current-holder is met only by a holder not at Distant; decision batch 4, 4-3) and the committed
data/titans/sprinting-abnormal.yaml (the Grab and Headlong Lunge at Severity 2; 4-4).

Reports:
- thrash: the share of resolved cards that are Thrash on every table at its reference start, and how many of
  those came from an entry's Position requirement, 12,000 fights a table (OQ-101; verdicts, thrash_share);
- holder: at the Sprinting Abnormal's reference start, the evaluations in which its current-holder rung kept
  a holder who was not at the closest Position, the cards resolved against a holder at Distant while a
  candidate stood closer, and the cards resolved against a Down holder, 60,000 fights;
- grab_only: the Grab alone at Severity 2 (Headlong Lunge pinned at Severity 3), every bar row in both Squad
  sheet orders on the seeds run6.py bar gives that row, read against the twins in results/bar.json (the
  question batch 4 left: quarry_b4_grab2_bar.out fails one seed in the screen with the pair by 2.1 standard
  errors);
- no_current_holder: the ladder without current-holder ([loudest-or-brightest, hooked-into-its-body,
  nearest]) in the helper, screen, and screen-with-pair rows, both orders, on the bar seeds, against the
  same twins (section 6.5, *Why current-holder*);
- parked: the parked rider (tools/probes/batch-4/quarry_b4.py's roles, the rider listed first, mounted and
  never leaving Distant) under the rule, the Abnormal against the standard Medium Titan with the same Squad,
  120,000 fights each, reading the committed YAML.
Run after run6.py bar, from the repository: uv run --with pyyaml python tools/probes/batch-4/abnormal_b4.py
Writes nothing in the project; its output is abnormal_b4.out beside it.
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
sys.path.insert(0, HERE)
import fight6 as F6  # noqa: E402
F6.f5.DEFAULT_RETREAT_CLOCK = None  # decision batch 5: this record ran under the 12-round horizon
import run6  # noqa: E402

NEAREST = F6.f5.NEAREST
OLD_RUNGS = ["loudest-or-brightest", "hooked-into-its-body", "nearest"]
AB = dict(titan_id="sprinting-abnormal", policy="eager", mounted_start=True)


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


def run_counted(cfg, n, seed, procs=None):
    procs = procs or os.cpu_count() or 4
    chunk = max(1, n // procs)
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F6.summarize(res)
    for key in ("thrash", "thrash_fallback", "resolved_counted", "kept_not_closest", "vs_distant_closer", "vs_down"):
        out[key] = round(sum(r[key] for r in res) / len(res), 3)
    return out


def gap(a, b, key):
    se = (a[key + "_se"] ** 2 + b[key + "_se"] ** 2) ** 0.5
    return (a[key] - b[key]) / se if se else 0.0


KEYS = ("median", "by3", "nokill12", "nokill12_se", "cis", "cis_se", "deaths", "deaths_se", "grabs")


def read_bar():
    with open(os.path.join(CH6, "results", "bar.json")) as fh:
        bar = json.load(fh)
    with open(os.path.join(CH6, "cases6.json")) as fh:
        cases = json.load(fh)
    rows = run6.bar_rows(cases)
    labels = list(dict.fromkeys(l for r in rows for l in (r["abnormal"], r["medium"], r["large"])))
    return bar, dict(cases), rows, labels


def bar_line(tag, a, med, lg, med_ref, reference):
    parts = [f"median {a['median']}",
             f"cis {a['cis']} vs Medium twin {med['cis']} ({gap(med, a, 'cis'):+.1f} SE)",
             f"no kill {a['nokill12']} vs Large twin {lg['nokill12']} ({gap(a, lg, 'nokill12'):+.1f} SE)",
             f"deaths {a['deaths']} +- {a['deaths_se']} vs Large twin {lg['deaths']} +- {lg['deaths_se']} "
             f"({gap(a, lg, 'deaths'):+.1f} SE)"]
    if reference:
        parts.append(f"deaths vs Medium reference {med_ref['deaths']} ({gap(med_ref, a, 'deaths'):+.1f} SE)")
    print(tag, "|", "; ".join(parts), "| a positive gap is on the failing side", flush=True)


def bar_variant(name, n, over, only=None):
    bar, cfgs, rows, labels = read_bar()
    if bar.get("fights") != n:
        print(f"results/bar.json was run at {bar.get('fights')} fights, not {n}; run run6.py bar {n} first")
        return
    ref_row = next(r for r in rows if cfgs[r["abnormal"]].get("reference"))
    for order, base in run6.BAR_ORDERS:
        key = "figures" if order == "cutters_first" else order
        for r in rows:
            label = r["abnormal"]
            if only and not any(label.endswith(o) for o in only):
                continue
            i = labels.index(label)
            cfg = dict(cfgs[label], sheet_order=order, **over)
            a = F6.run_many(cfg, n, base + i)
            med, lg = bar[key][r["medium"]], bar[key][r["large"]]
            med_ref = bar[key][ref_row["medium"]]
            bar_line(f"{name} | {order} | {label}", a, med, lg, med_ref, r is ref_row)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    std = ("standard-small", "standard-medium", "standard-large")
    seed = 4900
    if mode in ("all", "thrash"):
        for tid in std + ("sprinting-abnormal",):
            seed += 1
            cfg = dict(AB) if tid == "sprinting-abnormal" else dict(titan_id=tid, policy="eager")
            r = run_counted(cfg, 12000, seed)
            share = 100 * r["thrash"] / r["resolved_counted"]
            print(f"thrash | {tid}", {"resolved_per_fight": r["resolved_counted"], "thrash_per_fight": r["thrash"],
                                      "thrash_share": round(share, 1),
                                      "thrash_by_position_per_fight": r["thrash_fallback"]}, flush=True)
    seed = 4910
    if mode in ("all", "holder"):
        r = run_counted(dict(AB), 60000, seed)
        print("holder | sprinting-abnormal reference start",
              {k: r[k] for k in ("kept_not_closest", "vs_distant_closer", "vs_down", "resolved_counted", "by3", "cis",
                                 "deaths")}, flush=True)
    if mode in ("all", "grab_only"):
        bar_variant("grab alone at Severity 2", 120000, dict(entry_over={"headlong-lunge": {"severity": 3}}))
    if mode in ("all", "no_current_holder"):
        bar_variant("ladder without current-holder", 120000, dict(rungs=OLD_RUNGS),
                    only=("4 player characters and 2 helper Squadmates",
                          "4 player characters and 2 Squadmates screening beside the holder",
                          "Squadmates screening beside the holder, Hook and Cut and Hamstring Line, with the escapes"))
    if mode in ("all", "parked"):
        import quarry_b4 as Q
        seed = 4920
        ab = dict(AB, **Q.RULES["rule"], roles=Q.PARKED)
        md = dict(Q.MD, mounted_start=True, **Q.RULES["rule"], roles=Q.PARKED)
        a = Q.run_many(ab, 120000, seed + 1)
        m = Q.run_many(md, 120000, seed + 2)
        Q.show("parked rider first | sprinting-abnormal (committed YAML)", a)
        Q.show("parked rider first | standard-medium", m)
        print(f"parked rider first: cis {a['cis']} vs Medium {m['cis']}; deaths {a['deaths']} vs Medium {m['deaths']} "
              f"({(a['deaths'] - m['deaths']) / ((a['deaths_se'] ** 2 + m['deaths_se'] ** 2) ** 0.5):+.1f} SE above)",
              flush=True)
