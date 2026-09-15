"""Decision batch 4 (the Chapters 5 and 6 conformance review, round 1, Opus Critical 1 and Major 2): the
first-evaluation tie-break and the Sprinting Abnormal's current-holder rung, on tools/probes/chapter-06/fight6.py
(and tools/probes/chapter-05/fight.py for the Chapter 5 reference row), subclassed only in build_squad (the Squad
sheet order and the roles) and evaluate (two switches):

- tie_break "sheet": as committed, a tie the card step cannot break (the start of the fight, an end step) goes to
  the soldier listed first on the Squad sheet; "none": the rule (4-3), Attention is held by nothing until the
  Titan's next card, which evaluates the ladder with the cards dealt;
- quarry "anywhere": current-holder as committed, met by the holder wherever they stand; "in_reach": the rule
  (4-3), met by the holder only while they hold On Body, In Reach, or Blind Spot, not Distant, so a rider who
  gets away to Distant is dropped; "path": a rejected variant, met only while they hold In Reach or On Body, so
  a holder who flies to Blind Spot is dropped too;
- order "cutters_first" (the committed probe's sheet), "strikers_first", or "random" (shuffled per fight);
- roles: the player characters' roles in sheet order; the parked row lists a rider (mounted, stays at Distant,
  takes no action) first.

Usage, from this directory: uv run --with pyyaml python quarry_b4.py explore [fights]   (the finding, 24,000)
                            uv run --with pyyaml python quarry_b4.py bar [fights]       (the bar as decided, 120,000)
                            uv run --with pyyaml python quarry_b4.py bar 120000 grab_only   (quarry_b4_grab2_bar.out)
Every row pins the Sprinting Abnormal's Severities as they stood when it ran (AS_MEASURED, DECIDED, GRAB_ONLY),
so the script repeats its .out files with data/titans/sprinting-abnormal.yaml as decision batch 4 left it.
sweep_b4.py measures the value changes between the two.
Writes nothing in the project.
"""
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

f5 = F6.f5
NEAREST = f5.NEAREST
BASELINE = ["cutter", "cutter", "striker", "striker"]


def ordered(cfg, rng):
    roles = list(cfg.get("roles") or BASELINE)
    order = cfg.get("order", "cutters_first")
    if order == "strikers_first":
        roles = [r for r in roles if r == "striker"] + [r for r in roles if r != "striker"]
    elif order == "random":
        rng.shuffle(roles)
    return roles


def build(self):
    cfg = self.cfg
    st = cfg.get("stress", 1)
    for i, role in enumerate(ordered(cfg, self.rng)):
        self.add(f5.make("rookie", f"pc{i}", stress=st), role)
    for i in range(cfg.get("squadmates", 0)):
        self.add(f5.make("rookie", f"sm{i}", stress=st, pc=False), cfg.get("squadmate_role", "helper"))


def settle(self, tied, end_step):
    """The holder, card, and last steps of evaluation (attention.yaml, evaluation), with the tie_break switch."""
    t = self.t
    if len(tied) == 1:
        t.holder = tied[0]
    elif t.holder in tied:
        pass
    elif self.card and not end_step:
        t.holder = min(tied, key=lambda s: self.card.get(s.name, 99))
    elif self.cfg.get("tie_break", "sheet") == "sheet":
        t.holder = tied[0]
    else:
        t.holder = None


class FightQ(F6.Fight6):
    def build_squad(self):
        build(self)

    def evaluate(self, end_step=False):
        t = self.t
        cands = self.alive()
        if not cands:
            t.holder = None
            return
        most = max(len(c.cis) for c in cands)
        quarry = self.cfg.get("quarry", "anywhere")

        def meets(s, rung):
            if rung == "nearest":
                return True
            if s.down and not F6.DOWN_CAN_MEET[rung]:
                return False
            if rung == "most-harmed":
                return len(s.cis) == most
            if rung == "current-holder":
                if t.holder is not s:
                    return False
                if quarry == "in_reach":
                    return s.pos != "distant"
                if quarry == "path":
                    return s.pos in ("in-reach", "on-body")
                return True
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
        settle(self, tied, end_step)
        if getattr(self, "_starting", False):
            self._starting = False
            self.start_fear_rolls()


class FightQ5(f5.Fight):
    """Chapter 5's reference Titan with the tie_break switch (its ladder is the standard one)."""

    def build_squad(self):
        build(self)

    def evaluate(self, end_step=False):
        t = self.t
        cands = self.alive()
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
        if rungs[top] == "nearest":
            best = min(NEAREST[s.pos] for s in tied)
            tied = [s for s in tied if NEAREST[s.pos] == best]
        if rungs[top] == "hooked":
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
        settle(self, tied, end_step)


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    cls = FightQ5 if cfg.get("chapter5") else FightQ
    return [cls(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=12):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    if cfg.get("chapter5"):
        out = f5.summarize(res)
        out["deaths_se"] = round(F6.standard_error([r["deaths"] for r in res]), 4)
    else:
        out = F6.summarize(res)
    out["n"] = len(res)
    return out


KEYS = ("median", "by3", "by4", "nokill12", "cis", "deaths", "deaths_se", "grabs")


def show(label, r):
    print(label, {k: r.get(k) for k in KEYS}, flush=True)


def gap(a, b, key="deaths"):
    return (a[key] - b[key]) / ((a[key + "_se"] ** 2 + b[key + "_se"] ** 2) ** 0.5)


# The Sprinting Abnormal as it stood when this probe ran: its Grab and Headlong Lunge at Severity 3. The YAML now
# holds both at Severity 2 (decision batch 4, 4-4), so the rows labelled committed, the explore rows, and every
# variant pin the Severities they ran with and this script repeats its .out files.
AS_MEASURED = {"grab": {"severity": 3}, "headlong-lunge": {"severity": 3}}
AB = dict(titan_id="sprinting-abnormal", policy="eager", mounted_start=True, entry_over=AS_MEASURED)


def with_entries(base, over):
    """base's entry_over with over's entry changes merged in, entry by entry (so a variant that changes one
    field of an entry keeps the Severity base pins)."""
    merged = {eid: dict(v) for eid, v in base.get("entry_over", {}).items()}
    for eid, v in over.items():
        merged.setdefault(eid, {}).update(v)
    return merged


LG = dict(titan_id="standard-large", policy="eager")
MD = dict(titan_id="standard-medium", policy="eager")
ROWS = {
    "reference": {},
    "helpers": dict(squadmates=2),
    "screen": dict(squadmates=2, squadmate_role="screen2"),
    "screen_pair": dict(squadmates=2, squadmate_role="screen2", escapes=True, tactics=["hook", "hamstring"]),
}
RULES = {
    "committed": dict(tie_break="sheet", quarry="anywhere"),
    "no_holder": dict(tie_break="none", quarry="anywhere"),
    "rule": dict(tie_break="none", quarry="in_reach"),
    "path": dict(tie_break="none", quarry="path"),
}
DECIDED = dict(AB, entry_over={"grab": {"severity": 2}, "headlong-lunge": {"severity": 2}})   # 4-4: both kill entries at Severity 2
GRAB_ONLY = dict(AB, entry_over={"grab": {"severity": 2}, "headlong-lunge": {"severity": 3}})   # quarry_b4_grab2_bar.out
PARKED = ["rider", "cutter", "striker", "striker"]


def explore(n):
    seed = 4200
    for rname, rule in RULES.items():
        for order in ("cutters_first", "strikers_first", "random"):
            if rname != "committed" and order == "random":
                continue
            for row in ("reference", "helpers"):
                seed += 1
                r = run_many(dict(AB, **ROWS[row], **rule, order=order), n, seed)
                show(f"{rname} | {order} | {row}", r)
        for order in ("cutters_first", "strikers_first"):
            seed += 1
            r = run_many(dict(AB, **rule, roles=PARKED, order=order), n, seed)
            show(f"{rname} | parked rider {'first' if order == 'cutters_first' else 'last'}", r)
    seed += 1
    r = run_many(dict(MD, mounted_start=True, roles=PARKED, **RULES["rule"]), n, seed)
    show("rule | standard-medium, parked rider first, mounted start", r)
    print("--- the standard Titans under the tie-break (reference rows; twins the tables quote)")
    for tid in ("standard-small", "standard-medium", "standard-large"):
        for tb in ("sheet", "none"):
            seed += 1
            r = run_many(dict(titan_id=tid, policy="eager", tie_break=tb), n, seed)
            show(f"{tid} | tie_break {tb}", r)
    for tb in ("sheet", "none"):
        seed += 1
        r = run_many(dict(chapter5=True, policy="eager", tie_break=tb), n, seed)
        show(f"chapter-05 fight.py reference | tie_break {tb}", r)


def bar(n, decided=DECIDED):
    """The Abnormal's bar (data/titans/tuning.yaml, targets.abnormals) under the rule (4-3) with the Grab and
    Headlong Lunge at Severity 2 (4-4), row against row against the standard Medium and Large Titans' twins run
    under the same rule and sheet order, for both sheet orders (neither chooses anything under the rule).
    quarry_b4_grab2_bar.out is the same run with the Grab alone at Severity 2 (GRAB_ONLY, the command
    `bar 120000 grab_only`), which one seed fails."""
    DECIDED = decided
    seed = 4300
    rule = RULES["rule"]
    res = {}
    for order in ("cutters_first", "strikers_first"):
        for row, extra in ROWS.items():
            for tid, base in (("ab", DECIDED), ("lg", LG), ("md", MD)):
                seed += 1
                res[(order, row, tid)] = run_many(dict(base, **extra, **rule, order=order), n, seed)
                show(f"{order} | {row} | {tid}", res[(order, row, tid)])
    seed += 1
    res["parked_ab"] = run_many(dict(DECIDED, **rule, roles=PARKED), n, seed)
    seed += 1
    res["parked_md"] = run_many(dict(MD, mounted_start=True, **rule, roles=PARKED), n, seed)
    show("parked rider first | ab", res["parked_ab"])
    show("parked rider first | md", res["parked_md"])
    print("--- the bar, read row against row (a positive gap is on the failing side)")
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
    a, md = res["parked_ab"], res["parked_md"]
    print(f"parked rider first: cis vs Medium twin {gap(md, a, 'cis'):+.1f} SE; deaths vs Medium twin "
          f"{gap(md, a):+.1f} SE", flush=True)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "explore"
    n = int(sys.argv[2]) if len(sys.argv) > 2 else (24000 if mode == "explore" else 120000)
    if mode == "explore":
        explore(n)
    else:
        bar(n, GRAB_ONLY if sys.argv[3:4] == ["grab_only"] else DECIDED)
