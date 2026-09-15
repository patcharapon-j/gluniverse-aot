"""Decision batch 4b (the Chapters 5 and 6 conformance review, round 2: Opus Critical 1, Codex Major 1): the
Sprinting Abnormal's top rung, on the committed tools/probes/chapter-06/fight6.py (batch 4's tie-break and
current-holder rule built in), subclassed only in build_squad (the roles in sheet order) and in one role:

- loudrider: a player character who stays mounted at Distant and takes Draw Attention on every turn (the loudest
  flag; data/engagement/attention.yaml, draw_attention: an unrolled action, any Position); the fight counts the
  Abnormal's cards that resolve against the rider and, among them, those on which a comrade held the
  hooked-by-strike flag and was passed over.

Ladders (cfg rungs): "committed", [loudest-or-brightest, hooked-into-its-body, current-holder, nearest];
"swapped", the rule (4b-1), [hooked-into-its-body, loudest-or-brightest, current-holder, nearest].

Usage, from this directory: uv run --with pyyaml python loud_b4b.py explore [fights]   (the stance, 60,000)
                            uv run --with pyyaml python loud_b4b.py bar [fights]       (the bar under 4b-1, 120,000)
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
F6.DRAW_FROM_DISTANT = True  # decision batch 5: this record ran with Draw Attention from any Position (OQ-113)

f5 = F6.f5
BASELINE = ["cutter", "cutter", "striker", "striker"]
LADDERS = {
    "committed": ["loudest-or-brightest", "hooked-into-its-body", "current-holder", "nearest"],
    "swapped": ["hooked-into-its-body", "loudest-or-brightest", "current-holder", "nearest"],
}


class FightL(F6.Fight6):
    def __init__(self, rng, cfg):
        super().__init__(rng, cfg)
        self.stats["rider_cards"] = 0
        self.stats["rider_cards_over_hooked"] = 0

    def build_squad(self):
        cfg = self.cfg
        st = cfg.get("stress", 1)
        roles = list(cfg.get("roles") or BASELINE)
        if cfg.get("order") == "strikers_first":
            roles = [r for r in roles if r == "striker"] + [r for r in roles if r != "striker"]
        for i, role in enumerate(roles):
            self.add(f5.make("rookie", f"pc{i}", stress=st), role)
        for i in range(cfg.get("squadmates", 0)):
            self.add(f5.make("rookie", f"sm{i}", stress=st, pc=False), cfg.get("squadmate_role", "helper"))

    def add(self, s, role):
        super().add(s, role)
        if role == "loudrider":
            s.mounted = True

    def soldier_turn(self, s):
        t = self.t
        if s.role == "loudrider" and not (s.grabbed and t.grab and t.grab["victim"] is s):
            s.turns += 1
            ban_started = s.ban > 0
            if not s.down and not s.grabbed and not t.dead and not s.cur_action:
                s.flags["loud"] = True   # Draw Attention: unrolled, from any Position (attention.yaml, draw_attention)
                s.cur_action = True
                self.stats["draws"] += 1
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        super().soldier_turn(s)

    def choose(self, h):
        if h.role == "loudrider":
            self.stats["rider_cards"] += 1
            if any(c is not h and c.flags["hooked"] and not c.dead for c in self.sold):
                self.stats["rider_cards_over_hooked"] += 1
        return super().choose(h)


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [FightL(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=12):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F6.summarize(res)
    k = len(res)
    out["rider_cards"] = round(sum(r["rider_cards"] for r in res) / k, 2)
    out["rider_cards_over_hooked"] = round(sum(r["rider_cards_over_hooked"] for r in res) / k, 2)
    out["n"] = k
    return out


KEYS = ("median", "by2", "by3", "nokill12", "cis", "cis_se", "deaths", "deaths_se", "grabs", "draws",
        "rider_cards", "rider_cards_over_hooked")


def show(label, r):
    print(label, {k: r.get(k) for k in KEYS}, flush=True)


def gap(a, b, key="deaths"):
    return (a[key] - b[key]) / ((a[key + "_se"] ** 2 + b[key + "_se"] ** 2) ** 0.5)


AB = dict(titan_id="sprinting-abnormal", policy="eager", mounted_start=True)
LG = dict(titan_id="standard-large", policy="eager")
MD = dict(titan_id="standard-medium", policy="eager")
LOUD = ["loudrider", "cutter", "striker", "striker"]
ROWS = {
    "reference": {},
    "helpers": dict(squadmates=2),
    "screen": dict(squadmates=2, squadmate_role="screen2"),
    "screen_pair": dict(squadmates=2, squadmate_role="screen2", escapes=True, tactics=["hook", "hamstring"]),
}


def explore(n):
    seed = 4700
    for lname, rungs in LADDERS.items():
        seed += 1
        show(f"{lname} | baseline reference", run_many(dict(AB, rungs=rungs), n, seed))
        seed += 1
        show(f"{lname} | loud rider first", run_many(dict(AB, rungs=rungs, roles=LOUD), n, seed))
        seed += 1
        show(f"{lname} | loud rider and 2 helpers", run_many(dict(AB, rungs=rungs, roles=LOUD, squadmates=2), n, seed))
        seed += 1
        show(f"{lname} | cutters Draw Attention while a striker holds (Chapter 6 row)",
             run_many(dict(AB, rungs=rungs, draw_attention=True), n, seed))
    seed += 1
    show("standard-medium | loud rider first, mounted start", run_many(dict(MD, mounted_start=True, roles=LOUD), n, seed))
    seed += 1
    show("standard-medium | baseline, mounted start", run_many(dict(MD, mounted_start=True), n, seed))


def bar(n):
    seed = 4800
    res = {}
    rungs = LADDERS["swapped"]
    for order in ("cutters_first", "strikers_first"):
        for row, extra in ROWS.items():
            for tid, base in (("ab", dict(AB, rungs=rungs)), ("lg", LG), ("md", MD)):
                seed += 1
                res[(order, row, tid)] = run_many(dict(base, **extra, order=order), n, seed)
                show(f"{order} | {row} | {tid}", res[(order, row, tid)])
    print("--- the bar under 4b-1, read row against row (a positive gap is on the failing side)")
    for order in ("cutters_first", "strikers_first"):
        ref_md = res[(order, "reference", "md")]
        for row in ROWS:
            a, lg, md = res[(order, row, "ab")], res[(order, row, "lg")], res[(order, row, "md")]
            parts = [
                f"median {a['median']} (2 to 4)",
                f"cis vs Medium twin {gap(md, a, 'cis'):+.1f} SE",
                f"deaths vs Medium reference {gap(ref_md, a):+.1f} SE" if row == "reference" else "",
                f"no kill vs Large twin {gap(a, lg, 'nokill12'):+.1f} SE",
                f"deaths vs Large twin {gap(a, lg):+.1f} SE",
            ]
            print(f"{order} | {row}:", "; ".join(p for p in parts if p), flush=True)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "explore"
    n = int(sys.argv[2]) if len(sys.argv) > 2 else (60000 if mode == "explore" else 120000)
    (explore if mode == "explore" else bar)(n)
