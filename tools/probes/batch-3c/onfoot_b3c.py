"""Decision batch 3c, conformance review round 2 Major 2 and the Codex Critical: a Feint on foot against a
grounded Titan (from In Reach or On Body, Perception alone, the same need). Two reports on
tools/probes/chapter-05: the Rookie's Break Attention rate by need with ODM Gear, with the horse, and on
foot; and the Medium screen rows (screen_b3b.py, case E) with the beside-the-holder screen allowed to feint
on foot while the Titan is grounded and its ODM Gear is not working.
The committed fight.py's screen feints only with working ODM Gear, so these rows are the on-foot Feint's
sensitivity rows (data/engagement/tuning.yaml, prepared_squad_kill, decoys).
Run from the repository: uv run --with pyyaml python tools/probes/batch-3c/onfoot_b3c.py [fights]
"""
import os
import random
import sys
from multiprocessing import Pool

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "chapter-05"))
import fight as F  # noqa: E402
F.DEFAULT_RETREAT_CLOCK = None  # decision batch 5: this record ran under the 12-round horizon
from core import attr_roll, make  # noqa: E402


def ba_rates(gear, n=100000, seed=5, stress=1):
    rng = random.Random(seed)
    out = {}
    for need in range(1, 5):
        ok = 0
        for _ in range(n):
            s = make("rookie", stress=stress)
            ok += attr_roll(rng, s, "break-attention", s.per, 0, 0, gear, push_to=need)["succ"] >= need
        out[need] = round(100 * ok / n, 1)
    return out


class FightOnFoot(F.Fight):
    def __init__(self, rng, cfg):
        super().__init__(rng, cfg)
        self.stats["foot_feints"] = 0

    def soldier_turn(self, s):
        t = self.t
        if (self.cfg.get("onfoot", False) and s.role == "screen2" and self.screen_feints() and not s.horse_here
                and s.cloak_thrown and not s.down and not s.grabbed and not t.grab and not t.dead
                and not s.odm_working() and t.grounded()):
            s.turns += 1
            ban_started = s.ban > 0
            if s.pos == "distant":
                self.try_step(s, "in-reach")
            elif s.pos == "blind-spot" and not s.cur_move:
                self.try_step(s, "in-reach")
            if s.pos in ("in-reach", "on-body") and not s.cur_action and self.can_decoy():
                need = self.ba_need(s) + self.cfg.get("feint_extra", 1)
                self.stats["feint_rolls"] += 1
                succ = self.break_attention(s, "none", need)
                if succ >= need and not t.dead:
                    self.stats["feints"] += 1
                    self.stats["foot_feints"] += 1
                    self.decoy_success(s, succ, need)
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        super().soldier_turn(s)


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [FightOnFoot(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F.summarize(res)
    out["foot_feints"] = round(sum(r["foot_feints"] for r in res) / len(res), 3)
    return out


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 12000
    for gear in ("odm", "horse", "none"):
        print(f"Rookie Break Attention by need 1..4, gear {gear}, Stress 1:", ba_rates(gear), flush=True)
    print("Rookie Break Attention by need 1..4, on foot, Stress 3:", ba_rates("none", stress=3), flush=True)
    base = dict(size="medium", policy="eager", squadmates=2, squadmate_role="screen2",
                ba_rule="holder_in_a_row", decoy_hold="tempo", screen_feints=True, tie_break="sheet")
    # fight.py now carries decision batch 4's rules as its defaults; every row pins the Squad-sheet tie-break it
    # ran with. With no second argument this script also pins batch 3c's flag rule and nearest reading and
    # repeats onfoot_b3c.out; with "3e" it runs the fight rows under batch 3e's rules (onfoot_b3e.out;
    # data/engagement/tuning.yaml, decoys, on_foot_feint).
    if sys.argv[2:3] != ["3e"]:
        base.update(flags="evaluating", nearest="holder_keeps")
    cases = [
        ("Medium screen beside holder, the rule (screen_b3b E)", dict(base)),
        ("Medium screen beside holder, the rule + on-foot Feint against a grounded Titan", dict(base, onfoot=True)),
        ("Large screen beside holder, the rule", dict(base, size="large")),
        ("Large screen beside holder, the rule + on-foot Feint against a grounded Titan", dict(base, size="large", onfoot=True)),
    ]
    keys = ["median", "by3", "by4", "cis", "deaths", "grabs", "cards_resolved_per_round", "decoy_cards_per_round",
            "decoys", "feints", "feint_rolls", "foot_feints"]
    for i, (label, cfg) in enumerate(cases):
        r = run_many(cfg, n, 900 + i)
        print(label, {k: r.get(k) for k in keys}, flush=True)
