"""Decision batch 5 (simulator review 2, Critical 1): a Titan Engagement that goes long ends by a retreat.

Runs the committed simulator (tools/sim, imported unchanged) with one rule added on top of it: a retreat clock.
When the clock fills at the background-clocks end step of the round it names, the Titan Engagement becomes a
retreat (data/engagement/background-titans.yaml, retreat): every standing soldier's move is forced (toward
Distant, then leave; toward a Down or Grabbed comrade; stay with one after acting for them), a soldier who
lifts a Down comrade carries them out, no soldier returns, and when no standing soldier holds a Position the
Engagement ends at once and every soldier still holding one dies, left to the Titans (engagement-flow.yaml,
left_behind). The simulator's 12-round horizon is replaced by a far safety cap.

Approximations, stated: a rescuer of a Grabbed comrade follows the simulator's rescue policy (it moves toward
the victim and strikes the arm or pries, which is retreat option 3 or 4, but a rescuer who struck from In Reach
does not make the move the retreat still demands of them that turn); a soldier who has left takes no further
turns (no turn-limit Death Roll while outside, which the end steps then resolve); a Down soldier crawls as the
simulator has them crawl.

Usage, from the repository root:
  uv run --with pyyaml python tools/probes/batch-5/retreat_b5.py explore   # the standard Medium Titan's reference
                                                                            # row under the horizon and under retreat
                                                                            # clocks (30,000 fights a row)
  uv run --with pyyaml python tools/probes/batch-5/retreat_b5.py bar [clock] [fights]
                                                                            # every bar row and its twins, both sheet
                                                                            # orders, under the retreat clock
                                                                            # (default 12; 120,000 fights a row)
"""
import math
import os
import random
import sys
from multiprocessing import Pool

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "sim"))

import cases as C                # noqa: E402
import engine as E               # noqa: E402
import families as F             # noqa: E402
import policy as P               # noqa: E402
from rules import R, D, IR, OB, BS   # noqa: E402

HORIZON = R.horizon              # 12: the "no kill within 12 rounds" column keeps its meaning
SAFETY_CAP = 60


# ---------------------------------------------------------------------- the retreat, on top of the engine
class RetreatFight(E.Fight):
    def __init__(self, rng, cfg, **kw):
        super().__init__(rng, cfg, **kw)
        self.clock = cfg.get("retreat_clock")          # None: the committed horizon reading
        if self.clock is not None:
            self.max_rounds = SAFETY_CAP
        self.retreat = False
        self.extra = {"retreats": 0, "left": 0, "carried_out": 0, "cap": 0, "retreat_rounds": 0}

    def alive(self):
        return [s for s in self.sold if not s.dead and not getattr(s, "left", False)]

    def standing(self):
        return any(not s.dead and not s.down and not getattr(s, "left", False) for s in self.sold)

    def end_steps(self):
        super().end_steps()
        if self.clock is not None and not self.retreat and self.rnd >= self.clock:
            self.retreat = True
            self.extra["retreats"] += 1
        if self.retreat:
            self.extra["retreat_rounds"] += 1

    def run(self):
        st = super().run()
        if self.clock is not None and not self.t.dead and self.standing():
            self.extra["cap"] += 1
        return st


def leave(f, s):
    s.left = True
    s.cur_move = True
    f.extra["left"] += 1
    if s.carrying is not None:
        s.carrying.left = True
        f.extra["carried_out"] += 1
        f.extra["left"] += 1
    if f.t.holder is s:
        f.t.holder = None


def step_toward(f, s, target):
    kinds = ("mounted", "foot", "odm") if s.mounted else ("foot", "odm")
    to = f.route_step(s, target, assume_odm=True)
    if to is None:
        to = IR if s.pos in (OB, BS) else target
    return f.try_step(s, to, kinds)


def retreat_turn(f, s):
    t = f.t
    if t.grab and t.grab["victim"] is not s and not getattr(t.grab["victim"], "left", False):
        return P.rescue(f, s)            # options 3 and 4: toward the Grabbed comrade, act for them
    if s.carrying is not None:           # option 1 with a carried comrade
        if s.pos == D:
            return leave(f, s)
        step_toward(f, s, D)
        return
    fallen = [c for c in f.alive() if c is not s and c.down and not c.grabbed and c.carried_by is None]
    if fallen:
        c = min(fallen, key=lambda c: f.steps_apart(s.pos, c.pos))
        if c.pos == s.pos:
            if not s.cur_action and f.lift(s, c):
                step_toward(f, s, D)
                return
            # no action left for the comrade this turn: option 4 is closed, so the move is option 1
        else:
            step_toward(f, s, c.pos)     # option 3
            return
    if s.pos == D:
        return leave(f, s)               # option 2
    step_toward(f, s, D)                 # option 1


_take_turn = P.take_turn


def take_turn(f, s):
    if getattr(f, "retreat", False):
        return retreat_turn(f, s)
    return _take_turn(f, s)


P.take_turn = take_turn


# ---------------------------------------------------------------------- jobs
def job(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    aux = F.aux_for(seed)
    acc = F.new_acc()
    extra = {}
    for _ in range(n):
        f = RetreatFight(rng, cfg, aux=aux)
        st = f.run()
        acc["n"] += 1
        for k in E.STAT_KEYS:
            F.add(acc, k, st[k], k in F.SQ)
        F.add(acc, "deaths_all", st["deaths"] + st["end_deaths"], True)
        F.add(acc, "pc_deaths_all", st["pc_deaths"] + st["pc_end_deaths"], True)
        kr = st["kill_round"]
        F.hist(acc, "kill_round", kr if kr is not None else "none")
        F.add(acc, "nokill12", 1 if (kr is None or kr > HORIZON) else 0, True)
        for k, v in f.extra.items():
            extra[k] = extra.get(k, 0) + v
    acc["extra"] = extra
    return acc


def run(pool, cfg, n, seed, chunks=16):
    per = [n // chunks + (1 if i < n % chunks else 0) for i in range(chunks)]
    accs = pool.map(job, [(cfg, m, seed * 1000 + i) for i, m in enumerate(per) if m])
    acc = accs[0]
    extra = dict(acc.pop("extra"))
    for a in accs[1:]:
        e = a.pop("extra")
        for k, v in e.items():
            extra[k] = extra.get(k, 0) + v
        F.merge(acc, a)
    out = F.summarize_fight(acc)
    out["nokill12"] = 100 * acc["sum"]["nokill12"] / acc["n"]
    out["nokill12_se"] = 100 * F.se_mean(acc, "nokill12")
    for k, v in extra.items():
        out["x_" + k] = v / acc["n"]
    return out


def line(label, o):
    return (f"{label:<58} med {o['median']:>2}  by3 {o['by3']:5.1f}%  nokill12 {o['nokill12']:5.2f}±{o['nokill12_se']:.2f}%  "
            f"CI {o['cis']:.3f}±{o['cis_se']:.4f}  deaths {o['deaths']:.4f}±{o['deaths_se']:.4f}  "
            f"all {o['deaths_all']:.4f}±{o['deaths_all_se']:.4f}  grabs {o['grabs']:.3f}  leftbehind {o['left_behind']:.4f}  "
            f"retreats {o.get('x_retreats', 0) * 100:.2f}%  out {o.get('x_left', 0):.3f}  carried {o.get('x_carried_out', 0):.4f}  "
            f"rounds {o['rounds_per_fight']:.2f}  cap {o.get('x_cap', 0):.5f}")


# ---------------------------------------------------------------------- explore: the Medium reference row
def explore(pool, n=30000):
    plan = [("standard-medium", 30500, (None, 6, 8, 9, 10, 12)), ("standard-large", 30700, (None, 8, 10, 12)),
            ("sprinting-abnormal", 30600, (None, 8, 12)), ("standard-small", 30800, (None, 8, 12))]
    print(f"each standard Titan at its reference start, {n} fights a row; the horizon reading, then retreat clocks")
    for tid, seed, clocks in plan:
        cfg = C.reference_cfg(tid)
        for clock in clocks:
            label = f"{tid}: horizon 12 (the committed reading)" if clock is None else f"{tid}: retreat clock {clock}"
            print(line(label, run(pool, cfg if clock is None else dict(cfg, retreat_clock=clock), n, seed)), flush=True)


# ---------------------------------------------------------------------- the bar under the retreat
def z(a, ase, b, bse):
    return (a - b) / math.sqrt(ase ** 2 + bse ** 2 + 1e-18)


def bar(pool, clock=12, n=120000):
    rows = C.PF["bar"]["rows"]
    fails = 0
    for order, base, _ in C.ORDERS:
        print(f"\n== {order}, retreat clock {clock}, {n} fights a row")
        cache = {}
        labels = C.bar_labels()
        for i, label in enumerate(labels):
            cfg = dict(C.PF["fight"][label]["cfg"], sheet_order=order, retreat_clock=clock)
            cache[label] = run(pool, cfg, n, base + i)
            print(line(label[:58], cache[label]), flush=True)
        print("\n-- limits (z past the twin; a limit holds within 2)")
        ref_label = rows[0]["abnormal"]
        for r in rows:
            a, m, l = cache[r["abnormal"]], cache[r["medium"]], cache[r["large"]]
            checks = {
                "median 2..4": 2 <= a["median"] <= 4,
                "CI>=Med": z(a["cis"], a["cis_se"], m["cis"], m["cis_se"]) >= -2,
                "nokill<=Large": z(a["nokill12"], a["nokill12_se"], l["nokill12"], l["nokill12_se"]) <= 2,
                "deaths<=Large": z(a["deaths"], a["deaths_se"], l["deaths"], l["deaths_se"]) <= 2,
                "all<=Large": z(a["deaths_all"], a["deaths_all_se"], l["deaths_all"], l["deaths_all_se"]) <= 2,
            }
            if r["abnormal"] == ref_label:
                checks["deaths>Med"] = z(a["deaths"], a["deaths_se"], m["deaths"], m["deaths_se"]) >= -2
            zs = (f"CI {z(a['cis'], a['cis_se'], m['cis'], m['cis_se']):+.1f}  "
                  f"nokill {z(a['nokill12'], a['nokill12_se'], l['nokill12'], l['nokill12_se']):+.1f}  "
                  f"deaths {z(a['deaths'], a['deaths_se'], l['deaths'], l['deaths_se']):+.1f}  "
                  f"all {z(a['deaths_all'], a['deaths_all_se'], l['deaths_all'], l['deaths_all_se']):+.1f}")
            bad = [k for k, v in checks.items() if not v]
            fails += len(bad)
            print(f"{r['abnormal'][:58]:<58} {zs}  {'HOLDS' if not bad else 'FAILS ' + ', '.join(bad)}")
    print(f"\nfailed limits: {fails}")


if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "explore"
    with Pool(os.cpu_count() or 1) as pool:
        if what == "explore":
            explore(pool, int(sys.argv[2]) if len(sys.argv) > 2 else 30000)
        elif what == "bar":
            bar(pool, int(sys.argv[2]) if len(sys.argv) > 2 else 12, int(sys.argv[3]) if len(sys.argv) > 3 else 120000)
        else:
            raise SystemExit(__doc__)
