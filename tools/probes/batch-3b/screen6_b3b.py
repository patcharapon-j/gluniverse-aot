"""Batch 3b addendum (Chapter 6 Major 6): decoy screens beside the holder, Squad Tactics, and helpers for
every Chapter 6 table on the drafter's fight6.py, under the rule as revised (esc "reset", the Feint) and
under batch 3's rule (esc "perm"), with the decoy holding for one card ("card", Chapter 5 as written) or
for Tempo cards ("tempo"). Squadmates never Push. Writes nothing in the project.
Run from this directory: uv run --with pyyaml python screen6_b3b.py [fights]
Committed in tools/probes/batch-3b/ with relative paths. screen6_b3b.out is a historical snapshot of the
decision-era run and is not reproduced by this script (decision batch 4, 4-12). The script imports the live
tools/probes/chapter-06/fight6.py, which reads the current Titan YAML and whose flag, nearest, tie-break,
table, ladder, start, and harm rules have changed since batch 3b (Chapter 6's review rounds and decision
batches 3c, 3e, and 4), and its BASE_PIN pins only the Break Attention switches (ba_rule, decoy_hold,
screen_feints). The rows that govern are data/titans/tuning.yaml and Chapter 6, section 6.6 (Support rows).
"""
import os
import random
import sys
from multiprocessing import Pool

PROBES6 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "chapter-06")
BASE_PIN = {"ba_rule": "holder_escalating", "decoy_hold": "card", "screen_feints": False}
sys.path.insert(0, PROBES6)
os.chdir(PROBES6)
import fight6 as F6  # noqa: E402
F6.f5.DEFAULT_RETREAT_CLOCK = None  # decision batch 5: this record ran under the 12-round horizon


class Fight6b(F6.Fight6):
    def __init__(self, rng, cfg):
        super().__init__(rng, cfg)
        self.stats["feints"] = 0
        self.stats["feint_rolls"] = 0
        self.t.decoy_left = 0

    def ba_need(self, s):
        t = self.t
        esc = self.cfg.get("esc", "perm")
        extra = t.decoys_spent if esc in ("perm", "reset") else 0
        if t.grab:
            return 2 + extra
        return (1 if t.holder is s else 2) + extra

    def decoy_success(self, s, succ, need, horse=False):
        super().decoy_success(s, succ, need, horse)
        t = self.t
        t.decoy_left = t.tempo if self.cfg.get("hold", "card") == "tempo" else 1

    def titan_card(self):
        t = self.t
        before = self.stats["resolved"]
        holding = t.holder == "decoy" and not t.grab and not t.dead
        if holding:
            t.decoy_left -= 1
        super().titan_card()
        if holding and t.decoy_left > 0 and not t.dead:
            t.holder = "decoy"
        if self.cfg.get("esc", "perm") == "reset" and self.stats["resolved"] > before:
            t.decoys_spent = 0

    def soldier_turn(self, s):
        t = self.t
        if (s.role == "screen2" and self.cfg.get("feint", False) and not s.horse_here and s.cloak_thrown
                and not s.down and not s.grabbed and not t.grab and not t.dead):
            s.turns += 1
            ban_started = s.ban > 0
            if s.pos == "distant":
                self.try_step(s, "in-reach")
            elif s.pos == "blind-spot" and not s.cur_move:
                self.try_step(s, "in-reach")
            if s.pos in ("in-reach", "on-body") and not s.cur_action and s.odm_working() and self.can_decoy():
                need = self.ba_need(s) + self.cfg.get("feint_extra", 1)
                self.stats["feint_rolls"] += 1
                succ = self.break_attention(s, "odm", need)
                if succ >= need and not t.dead:
                    self.stats["feints"] += 1
                    self.decoy_success(s, succ, need)
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        super().soldier_turn(s)


def run_cell(args):
    cfg, n, seed = args
    cfg = dict(BASE_PIN, **cfg)
    rng = random.Random(seed)
    return [Fight6b(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F6.summarize(res)
    out["decoys_per_fight"] = round(sum(r["decoys"] for r in res) / len(res), 2)
    out["feints_per_fight"] = round(sum(r["feints"] for r in res) / len(res), 2)
    out["sm_cis"] = round(sum(r.get("squadmate_cis", 0) for r in res) / len(res), 2) if "squadmate_cis" in res[0] else None
    return out


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 6000
    E = dict(esc="reset", feint=True)
    cases = []
    for tid in ("standard-medium", "standard-small", "standard-large", "sprinting-abnormal"):
        base = {"titan_id": tid, "policy": "eager"}
        cases += [
            (f"{tid}: 4 PC", dict(base)),
            (f"{tid}: 4 PC + 2 helpers", dict(base, squadmates=2)),
            (f"{tid}: 4 PC + 2 screen beside holder, batch 3 rule (perm), hold card", dict(base, squadmates=2, squadmate_role="screen2", esc="perm")),
            (f"{tid}: 4 PC + 2 screen beside holder, E (reset + feint), hold card", dict(base, squadmates=2, squadmate_role="screen2", **E)),
            (f"{tid}: 4 PC + 2 screen beside holder, E, hold tempo", dict(base, squadmates=2, squadmate_role="screen2", hold="tempo", **E)),
            (f"{tid}: 4 PC, E, Hook and Cut + Hamstring Line + escapes", dict(base, tactics=["hook", "hamstring"], escapes=True, **E)),
            (f"{tid}: 4 PC + 2 screen beside holder, E, hold tempo, Hook and Cut + Hamstring Line + escapes", dict(base, squadmates=2, squadmate_role="screen2", hold="tempo", tactics=["hook", "hamstring"], escapes=True, **E)),
        ]
    keys = ["median", "by3", "by4", "nokill12", "cis", "deaths", "grabs", "devours", "cards_resolved_per_round",
            "decoy_cards_per_round", "decoys_per_fight", "feints_per_fight", "tactic_uses"]
    for i, (label, cfg) in enumerate(cases):
        r = run_many(cfg, n, 600 + i)
        print(label, {k: r.get(k) for k in keys}, flush=True)
