"""Batch 3b, OQ-81: the full lone-fight model (the Fable review's lone.py, patched) under the
escalation variants and with a repeatable Feint decoy.
Run from this directory: uv run --with pyyaml python lone_b3b.py [trials]
Committed in tools/probes/batch-3b/ with relative paths; the model is the decider's, unchanged. The
chapter's committed lone-fight model, with these switches built in, is tools/probes/chapter-05/lone.py.
"""
import os
import random
import sys
import types
from multiprocessing import Pool

SIM = os.path.dirname(os.path.abspath(__file__))   # tools/probes/batch-3b, holding the Fable review's lone.py
sys.path.insert(0, SIM)
os.chdir(SIM)

src = open(f"{SIM}/lone.py").read()
old = 'd = "horse" if self.horse_usable(s) else ("flare" if s.flares > 0 else None)'
assert src.count(old) == 2
src = src.replace(old, "d = self.choose(s)")
src = src.replace('if __name__ == "__main__":', 'if False:')
mod = types.ModuleType("lone_patched")
mod.__file__ = f"{SIM}/lone.py"
exec(compile(src, f"{SIM}/lone.py", "exec"), mod.__dict__)
Lone = mod.Lone
summarize = mod.summarize


class Lone3b(Lone):
    # esc: "perm" (per-Titan count, never resets), "reset" (count of decoys since the Titan's last
    # card that resolved a behavior), "none". feint: a repeatable decoy from In Reach or On Body with
    # working ODM Gear (or the horse while mounted), needing 1 more than the base, spending nothing.
    def need(self, decoy=None):
        esc = self.cfg.get("esc", "perm")
        extra = self.decoys_spent if esc in ("perm", "reset") else 0
        base = (2 if self.grab else 1) + extra
        if decoy == "feint":
            base += self.cfg.get("feint_extra", 1)
        return base

    def feint_usable(self, s):
        if not self.cfg.get("feint", False):
            return False
        return s.odm_working() or (s.mounted and s.horse_here and not s.horse_lame)

    def choose(self, s):
        if self.horse_usable(s):
            return "horse"
        if s.flares > 0:
            return "flare"
        if self.feint_usable(s):
            return "feint"
        return None

    def any_decoy_left(self, s):
        return super().any_decoy_left(s) or self.feint_usable(s)

    def titan_card(self):
        before = self.st["cards_against"]
        super().titan_card()
        if self.cfg.get("esc", "perm") == "reset" and self.st["cards_against"] > before:
            self.decoys_spent = 0

    def break_attention(self, s, decoy):
        need = self.need(decoy)
        s.cur_action = True
        self.st["ba_attempts"] += 1
        if decoy == "flare":
            s.flares -= 1
        elif decoy == "cloak":
            s.cloak = False
        if decoy == "horse":
            gear = "horse"
        elif s.odm_working():
            gear = "odm"
        elif self.horse_usable(s) or (s.mounted and s.horse_here and not s.horse_lame):
            gear = "horse"
        else:
            gear = "none"
        res = mod.attr_roll(self.rng, s, "break-attention", s.per, 0, 0, gear, push_to=need)
        if gear == "odm":
            self.odm_after(s, res)
        elif gear == "horse":
            self.horse_after(s, res)
        elif res["spend_turn"]:
            self.spend_turn(s)
        if res["succ"] >= need and not self.done:
            self.st["ba_succ"] += 1
            self.decoy = True
            self.decoys_spent += 1
            if decoy == "horse":
                s.mounted = False
                s.horse_here = False
            if self.grab:
                self.release()
            return True
        return False


def cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [Lone3b(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    return summarize([r for part in parts for r in part])


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 100000
    cases = [
        ("A: permanent escalation, no feint (batch 3 rule)", dict(esc="perm")),
        ("B: no escalation, no feint", dict(esc="none")),
        ("C: reset escalation, no feint", dict(esc="reset")),
        ("D: permanent escalation + feint", dict(esc="perm", feint=True)),
        ("E: reset escalation + feint", dict(esc="reset", feint=True)),
        ("F: no escalation + feint", dict(esc="none", feint=True)),
        ("E, 24-round horizon", dict(esc="reset", feint=True, max_rounds=24)),
        ("E, dodge only Grab and Bite", dict(esc="reset", feint=True, dodge="kill")),
        ("E, fight-start Stress 0", dict(esc="reset", feint=True, stress=0)),
    ]
    keys = ["usable_strike_share", "by_round", "median_round_struck", "mean_round_struck", "cards_before_strike",
            "cards_against_per_fight", "cards_spent_by_decoys", "cis_per_fight", "deaths", "downs", "ends",
            "stress_at_strike", "kill_given_strike", "kill_per_fight", "ba_attempts", "ba_succ", "jams"]
    for i, (label, cfg) in enumerate(cases):
        r = run_many(cfg, n, 300 + i)
        print(label, {k: r[k] for k in keys}, flush=True)
