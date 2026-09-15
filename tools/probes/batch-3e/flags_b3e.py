"""Decision batch 3e, conformance review round 3 (Critical 1 and Major 2): one flag lifetime for the
hooked-by-strike, just-hurt, and loudest flags, on tools/probes/chapter-05/fight.py.

flag_life:
  "committed": the rule as applied after batches 3c and 3d (flags clear after a card that evaluates the
      ladder, including the inert card that ends a decoy's hold, and on a card that comes up while the
      Titan holds a Grabbed soldier);
  "acting": a flag lasts until the end of the Titan's next card that resolves a behavior; every card that
      resolves nothing (a decoy's hold, a holding card, no holder) leaves the flags standing;
  "acting_grab": as "acting", but a card that comes up while the Titan holds a Grabbed soldier clears them.

Reports, per fight: holds whose last card gave Attention to a flagged striker, and how often the Titan's next
resolved behavior then targeted that striker; the flags a holding card found standing.
Run from this directory: uv run --with pyyaml python flags_b3e.py [fights]
"""
import os
import random
import sys
from multiprocessing import Pool

HERE = os.path.dirname(os.path.abspath(__file__))
PROBES = os.path.join(HERE, "..", "chapter-05")
sys.path.insert(0, PROBES)
os.chdir(PROBES)
import fight as F  # noqa: E402
F.DEFAULT_RETREAT_CLOCK = None  # decision batch 5: this record ran under the 12-round horizon


class Fight3e(F.Fight):
    def __init__(self, rng, cfg):
        super().__init__(rng, cfg)
        for k in ("hold_strikers", "hold_striker_hit", "grab_card_flags"):
            self.stats[k] = 0
        self._suppress = False
        self._pending = None

    def clear_flags(self):
        if self._suppress:
            return
        super().clear_flags()

    def resolve_card(self):
        t = self.t
        mode = self.cfg.get("flag_life", "committed")
        if t.dead:
            return
        before = self.stats["resolved"]
        grab_card = bool(t.grab)
        hold_ending = t.holder == "decoy" and not self.hold_card_not_last()
        hooked_before = {s.name for s in self.alive() if s.flags["hooked"]}
        if grab_card:
            self.stats["grab_card_flags"] += sum(1 for s in self.alive() if any(s.flags.values()))
        if mode != "committed":
            self._suppress = True
        try:
            super().resolve_card()
        finally:
            self._suppress = False
        resolved = self.stats["resolved"] > before
        if mode == "acting" and resolved:
            super().clear_flags()
        elif mode == "acting_grab" and (resolved or grab_card):
            super().clear_flags()
        if resolved and self._pending is not None:
            self.stats["hold_strikers"] += 1
            if t.holder is self._pending:
                self.stats["hold_striker_hit"] += 1
            self._pending = None
        if hold_ending and t.holder not in (None, "decoy") and t.holder.name in hooked_before:
            self._pending = t.holder


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [Fight3e(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F.summarize(res)
    k = len(res)
    hs = sum(r["hold_strikers"] for r in res)
    out["hold_strikers_per_fight"] = round(hs / k, 3)
    out["next_behavior_on_striker"] = round(100 * sum(r["hold_striker_hit"] for r in res) / hs, 1) if hs else None
    out["grab_card_flags_per_fight"] = round(sum(r["grab_card_flags"] for r in res) / k, 3)
    return out


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 12000
    # fight.py now carries the batch 3e and batch 4 rules as its defaults; pin the rules it had when this probe
    # ran (the Squad-sheet tie-break included), so "committed" is still batches 3c and 3d as applied and this
    # script repeats flags_b3e.out.
    rule = dict(policy="eager", flags="evaluating", nearest="holder_keeps", tie_break="sheet")
    shapes = [
        ("Medium, 4 PC (the reference row)", dict(rule, size="medium")),
        ("Medium, 4 PC, Hook and Cut + Hamstring Line + escapes", dict(rule, size="medium", tactics=["hook", "hamstring"], escapes=True)),
        ("Medium, 4 PC + 2 helpers", dict(rule, size="medium", squadmates=2)),
        ("Medium, 4 PC + 2 screen beside holder", dict(rule, size="medium", squadmates=2, squadmate_role="screen2")),
        ("Medium, screen + Hook and Cut + Hamstring Line + escapes", dict(rule, size="medium", squadmates=2, squadmate_role="screen2", tactics=["hook", "hamstring"], escapes=True)),
        ("Small (Tempo 2), screen + Hook and Cut + Hamstring Line + escapes", dict(rule, size="small", squadmates=2, squadmate_role="screen2", tactics=["hook", "hamstring"], escapes=True)),
        ("Large, 4 PC", dict(rule, size="large")),
    ]
    keys = ["median", "by3", "by4", "cis", "deaths", "grabs", "devours", "cards_resolved_per_round",
            "hold_strikers_per_fight", "next_behavior_on_striker", "grab_card_flags_per_fight"]
    i = 0
    for label, cfg in shapes:
        for mode in ("committed", "acting", "acting_grab"):
            r = run_many(dict(cfg, flag_life=mode), n, 1000 + i)
            i += 1
            print(f"{label} | {mode}", {k: r.get(k) for k in keys}, flush=True)
