"""Decision batch 3e, Chapter 6 review round 3 Critical 1: the ladder's nearest rung when it is the highest
rung met. "written": every candidate ties and the holder step keeps the current holder wherever they stand
(fight.py as committed). "narrows": the tied set is the candidates at the closest Position, then the holder
step. Runs on flags_b3e.Fight3e with the batch 3e flag rule ("acting") so the rows are the rule as decided.
Run from this directory: uv run --with pyyaml python nearest_b3e.py [fights]
"""
import os
import random
import sys
from multiprocessing import Pool

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from flags_b3e import Fight3e, F  # noqa: E402


class FightNearest(Fight3e):
    def __init__(self, rng, cfg):
        super().__init__(rng, cfg)
        self.stats["top_nearest"] = 0
        self.stats["kept_not_closest"] = 0

    def evaluate(self, end_step=False):
        t = self.t
        if self.cfg.get("nearest", "written") != "narrows":
            return super().evaluate(end_step)
        cands = [s for s in self.alive()]
        if not cands:
            t.holder = None
            return

        def meets(s, rung):
            low = s.down
            if rung == "hooked":
                return not low and (s.pos == "on-body" or s.flags["hooked"])
            if rung == "inreach":
                return not low and s.pos == "in-reach"
            if rung == "hurt":
                return not low and s.flags["hurt"]
            if rung == "loud":
                return not low and s.flags["loud"]
            return True

        rungs = ["hooked", "inreach", "hurt", "loud", "nearest"]
        top = next(i for i, r in enumerate(rungs) if any(meets(s, r) for s in cands))
        tied = [s for s in cands if meets(s, rungs[top])]
        if rungs[top] == "hooked":
            struck = [s for s in tied if s.flags["hooked"]]
            if struck:
                tied = struck
        for r in rungs[top + 1:]:
            if r == "nearest":
                best = min(F.NEAREST[s.pos] for s in tied)
                tied = [s for s in tied if F.NEAREST[s.pos] == best]
            else:
                sub = [s for s in tied if meets(s, r)]
                if sub:
                    tied = sub
        if rungs[top] == "nearest":
            self.stats["top_nearest"] += 1
            best = min(F.NEAREST[s.pos] for s in tied)
            if t.holder in tied and F.NEAREST[t.holder.pos] != best:
                self.stats["kept_not_closest"] += 1
            tied = [s for s in tied if F.NEAREST[s.pos] == best]
        if len(tied) == 1:
            t.holder = tied[0]
        elif t.holder in tied:
            pass
        elif self.card and not end_step:
            t.holder = min(tied, key=lambda s: self.card.get(s.name, 99))
        else:
            t.holder = tied[0]


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [FightNearest(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F.summarize(res)
    k = len(res)
    out["top_nearest_per_fight"] = round(sum(r["top_nearest"] for r in res) / k, 3)
    out["kept_not_closest_per_fight"] = round(sum(r["kept_not_closest"] for r in res) / k, 3)
    return out


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 12000
    # fight.py now carries the batch 3e and batch 4 rules as its defaults; pin the rules it had when this probe
    # ran (the Squad-sheet tie-break included), so "written" is still the reading before batch 3e and this
    # script repeats nearest_b3e.out.
    rule = dict(policy="eager", flag_life="acting", flags="evaluating", nearest="holder_keeps", tie_break="sheet")
    shapes = [
        ("Medium, 4 PC (the reference row)", dict(rule, size="medium")),
        ("Medium, 4 PC + 2 helpers", dict(rule, size="medium", squadmates=2)),
        ("Medium, 4 PC + 2 screen beside holder", dict(rule, size="medium", squadmates=2, squadmate_role="screen2")),
        ("Medium, screen + Hook and Cut + Hamstring Line + escapes", dict(rule, size="medium", squadmates=2, squadmate_role="screen2", tactics=["hook", "hamstring"], escapes=True)),
        ("Medium, 4 PC, Hook and Cut + Hamstring Line + escapes", dict(rule, size="medium", tactics=["hook", "hamstring"], escapes=True)),
        ("Large, 4 PC", dict(rule, size="large")),
        ("Small (Tempo 2), screen + Hook and Cut + Hamstring Line + escapes", dict(rule, size="small", squadmates=2, squadmate_role="screen2", tactics=["hook", "hamstring"], escapes=True)),
    ]
    keys = ["median", "by3", "by4", "cis", "deaths", "grabs", "devours", "cards_resolved_per_round",
            "top_nearest_per_fight", "kept_not_closest_per_fight"]
    i = 0
    for label, cfg in shapes:
        for mode in ("written", "narrows"):
            r = run_many(dict(cfg, nearest=mode), n, 1100 + i)
            i += 1
            print(f"{label} | nearest {mode}", {k: r.get(k) for k in keys}, flush=True)
