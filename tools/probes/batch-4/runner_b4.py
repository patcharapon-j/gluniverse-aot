"""Decision batch 4 (OQ-102): the Sprinting Abnormal's ladder alternatives on tools/probes/chapter-06/fight6.py,
at its reference start and in its bar rows, 12,000 fights a row, beside the standard Large Titan's twins from
tools/probes/chapter-06/results/bar.json.

- chosen: the ladder as committed, [loudest-or-brightest, hooked-into-its-body, current-holder, nearest] (OQ-102 (b));
- most_first: OQ-102 (f) as written, a new test "most-soldiers" (the Position holding the most candidates) above
  hooked-into-its-body: [loudest-or-brightest, most-soldiers, hooked-into-its-body, nearest];
- hooked_first: the same test below hooked-into-its-body: [loudest-or-brightest, hooked-into-its-body,
  most-soldiers, nearest];
- most_holder: [loudest-or-brightest, hooked-into-its-body, most-soldiers, current-holder, nearest].
Writes nothing in the project. Run from this directory: uv run --with pyyaml python runner_b4.py [fights]
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
LADDERS = {
    "chosen": ["loudest-or-brightest", "hooked-into-its-body", "current-holder", "nearest"],
    "most_first": ["loudest-or-brightest", "most-soldiers", "hooked-into-its-body", "nearest"],
    "hooked_first": ["loudest-or-brightest", "hooked-into-its-body", "most-soldiers", "nearest"],
    "most_holder": ["loudest-or-brightest", "hooked-into-its-body", "most-soldiers", "current-holder", "nearest"],
}


class FightRunner(F6.Fight6):
    def evaluate(self, end_step=False):
        t = self.t
        cands = self.alive()
        if not cands:
            t.holder = None
            return
        most = max(len(c.cis) for c in cands)
        counts = {}
        for c in cands:
            counts[c.pos] = counts.get(c.pos, 0) + 1
        crowd = max(counts.values())

        def meets(s, rung):
            if rung == "nearest":
                return True
            if rung == "most-soldiers":
                return counts[s.pos] == crowd
            if s.down and not F6.DOWN_CAN_MEET.get(rung, True):
                return False
            if rung == "most-harmed":
                return len(s.cis) == most
            if rung == "current-holder":
                return t.holder is s
            return F6.TEST_FN[rung](s)

        rungs = t.rungs
        top = next(i for i, r in enumerate(rungs) if any(meets(s, r) for s in cands))
        tied = [s for s in cands if meets(s, rungs[top])]
        if rungs[top] == "nearest":
            best = min(NEAREST[s.pos] for s in tied)
            tied = [s for s in tied if NEAREST[s.pos] == best]
        if rungs[top] == "hooked-into-its-body":
            struck = [s for s in tied if s.flags["hooked"]]
            if struck:
                tied = struck
        for r in rungs[top + 1:]:
            if r == "nearest":
                best = min(NEAREST[s.pos] for s in tied)
                tied = [s for s in tied if NEAREST[s.pos] == best]
            else:
                sub = [s for s in tied if meets(s, r)]
                if sub:
                    tied = sub
        if len(tied) == 1:
            t.holder = tied[0]
        elif t.holder in tied:
            pass
        elif self.card and not end_step:
            t.holder = min(tied, key=lambda s: self.card.get(s.name, 99))
        else:
            t.holder = tied[0]
        if getattr(self, "_starting", False):
            self._starting = False
            self.start_fear_rolls()


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [FightRunner(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F6.summarize(res)
    k = len(res)
    for key in ("deaths", "cis"):
        vals = [r[key] for r in res]
        mean = sum(vals) / k
        var = sum((v - mean) ** 2 for v in vals) / (k - 1)
        out[key + "_se"] = round((var / k) ** 0.5, 4)
    return out


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 12000
    # The standard Large Titan's twins as tools/probes/chapter-06/results/bar.json held them when this probe ran
    # (decision batch 3e's run). That file has since been re-run under decision batch 4's rules, so the figures
    # this probe read are written here and it repeats runner_b4.out.
    large = {
        "reference": {"deaths": 0.1635, "deaths_se": 0.0021},
        "helpers": {"deaths": 0.0196, "deaths_se": 0.0006},
        "screen": {"deaths": 0.0106, "deaths_se": 0.0004},
        "screen_pair": {"deaths": 0.0092, "deaths_se": 0.0004},
    }
    # The Sprinting Abnormal's Grab and Headlong Lunge at Severity 3, as they stood when this probe ran (the YAML
    # now holds Severity 2, decision batch 4, 4-4). This probe's evaluate keeps its own last tie-break (the Squad
    # sheet) and current-holder test (wherever the holder stands), the committed rules it measured under.
    ab = dict(titan_id="sprinting-abnormal", policy="eager", mounted_start=True,
              entry_over={"grab": {"severity": 3}, "headlong-lunge": {"severity": 3}})
    rows = {
        "reference": dict(ab),
        "helpers": dict(ab, squadmates=2),
        "screen": dict(ab, squadmates=2, squadmate_role="screen2"),
        "screen_pair": dict(ab, squadmates=2, squadmate_role="screen2", escapes=True, tactics=["hook", "hamstring"]),
    }
    keys = ("median", "by3", "by4", "nokill12", "cis", "deaths", "deaths_se", "grabs")
    seed = 4100
    for lname, rungs in LADDERS.items():
        for rname, cfg in rows.items():
            seed += 1
            r = run_many(dict(cfg, rungs=rungs), n, seed)
            lg = large[rname]
            gap = (r["deaths"] - lg["deaths"]) / ((r["deaths_se"] ** 2 + lg["deaths_se"] ** 2) ** 0.5)
            print(f"{lname} | {rname}", {k: r.get(k) for k in keys},
                  f"| Large twin deaths {lg['deaths']} +- {lg['deaths_se']}, {gap:.1f} SE", flush=True)
