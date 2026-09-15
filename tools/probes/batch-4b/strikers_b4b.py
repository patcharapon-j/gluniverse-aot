"""Decision batch 4b (the Chapters 5 and 6 conformance review, round 2: Opus Major 2): four strikers against the
baseline Squad (two cutters, two strikers) on Chapter 5's reference Titan (tools/probes/chapter-05/fight.py) and
on every Chapter 6 table (tools/probes/chapter-06/fight6.py), under the committed rules and under two candidate
changes, each subclassed only where the change lives:

- "turned": a soldier who holds the Titan's Attention at Blind Spot counts as In Reach for an entry's Position
  requirement (the Titan has turned to face them), so the entries that fall back to Thrash against a Blind Spot
  holder land instead; in fight.py the reference table's in-reach requirements gain blind-spot in each worker;
- "grounded3": the grounded-titan Bonus Dice are 3 instead of 2 (data/core/bonus-dice-sources.yaml).

Usage, from this directory: uv run --with pyyaml python strikers_b4b.py [fights]   (60,000)
Writes nothing in the project.
"""
import os
import random
import sys
from multiprocessing import Pool

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "chapter-06"))
import fight6 as F6  # noqa: E402
F6.f5.DEFAULT_RETREAT_CLOCK = None  # decision batch 5: this record ran under the 12-round horizon

f5 = F6.f5
BASELINE = ["cutter", "cutter", "striker", "striker"]
STRIKERS = ["striker"] * 4


def build(self):
    cfg = self.cfg
    st = cfg.get("stress", 1)
    for i, role in enumerate(cfg.get("roles") or BASELINE):
        self.add(f5.make("rookie", f"pc{i}", stress=st), role)
    for i in range(cfg.get("squadmates", 0)):
        self.add(f5.make("rookie", f"sm{i}", stress=st, pc=False), cfg.get("squadmate_role", "helper"))


class Grounded3:
    """The grounded-titan Bonus Dice at 3 (variant "grounded3"); otherwise the inherited methods."""

    def nape_free_bonus(self, s):
        if self.cfg.get("variant") != "grounded3":
            return super().nape_free_bonus(s)
        t = self.t
        g = 3 if t.grounded() else 0
        return min(4, g + sum(1 for o in t.openings if o != s.name))

    def nape_strike(self, s):
        if self.cfg.get("variant") != "grounded3" or not self.t.grounded():
            return super().nape_strike(s)
        # As fight.py's nape_strike with the grounded dice at 3.
        t = self.t
        g = 3
        free = [i for i, o in enumerate(t.openings) if o != s.name]
        use = min(len(free), 4 - g)
        for i in sorted(free[:use], reverse=True):
            t.openings.pop(i)
        hs = self.helpers(s, 4 - g - use)
        bonus = g + use + len(hs)
        s.cur_action = True
        res = f5.attr_roll(self.rng, s, "nape-strike", s.str, s.talents.get("nape-strike", 0), bonus, "blade",
                           push_to=t.nd)
        self.stats["napes"] += 1
        self.blade_after(s, res)
        s.flags["hooked"] = True
        if res["succ"] >= t.nd:
            t.dead = True
            if t.grab:
                self.release()
            return
        t.openings.extend([s.name] * res["succ"])


class Fight5S(Grounded3, f5.Fight):
    def build_squad(self):
        build(self)


class Fight6S(Grounded3, F6.Fight6):
    def build_squad(self):
        build(self)

    def choose(self, h):
        if self.cfg.get("variant") == "turned" and h.pos == "blind-spot":
            h.pos = "in-reach"
            try:
                return super().choose(h)
            finally:
                h.pos = "blind-spot"
        return super().choose(h)


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    if cfg.get("chapter5"):
        if cfg.get("variant") == "turned":
            for e in f5.TABLE.values():
                if "in-reach" in e["req"] and "blind-spot" not in e["req"]:
                    e["req"] = list(e["req"]) + ["blind-spot"]
        return [Fight5S(rng, cfg).run() for _ in range(n)]
    return [Fight6S(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=12):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F6.summarize(res) if not cfg.get("chapter5") else f5.summarize(res)
    if cfg.get("chapter5"):
        out["cis_se"] = round(F6.standard_error([r["cis"] for r in res]), 4)
        out["deaths_se"] = round(F6.standard_error([r["deaths"] for r in res]), 4)
    return out


KEYS = ("median", "by3", "nokill12", "cis", "deaths", "deaths_se", "grabs", "napes", "bodies")
TABLES = [("chapter-05 reference", dict(chapter5=True, policy="eager")),
          ("standard-small", dict(titan_id="standard-small", policy="eager")),
          ("standard-medium", dict(titan_id="standard-medium", policy="eager")),
          ("standard-large", dict(titan_id="standard-large", policy="eager")),
          ("sprinting-abnormal", dict(titan_id="sprinting-abnormal", policy="eager", mounted_start=True))]

if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 60000
    seed = 4900
    for variant in ("committed", "turned", "grounded3"):
        for tname, base in TABLES:
            if variant != "committed" and tname not in ("chapter-05 reference", "standard-medium"):
                continue
            for sname, roles in (("baseline", BASELINE), ("4 strikers", STRIKERS)):
                seed += 1
                r = run_many(dict(base, roles=roles, variant=variant), n, seed)
                print(f"{variant} | {tname} | {sname}", {k: r.get(k) for k in KEYS}, flush=True)
