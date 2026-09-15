"""Decision batch 3c, conformance review round 2 Major 1: flags under a hold of Tempo cards, on
tools/probes/chapter-06/fight6.py. As batch 3b wrote it, every card of a hold cleared the Titan's flags, so
against a Tempo 2 Titan a Nape striker who fell short before a non-last hold card was never turned on
(ADR-0010's struck-first rule). Under 3c-1 flags clear only on the card that evaluates the ladder (the hold's
last card). fight.py and fight6.py now carry that rule as the switch flags ("evaluating", the rule;
"every_card", as batch 3b wrote), so this script sets the switch per row and adds one counter: the
hooked-by-strike flags present when a non-last hold card comes up (cleared unread under "every_card", kept
under the rule).

The committed flags_b3c.out was re-run on fight6.py as it stands after Chapter 6's review round 2 fix pass
(the Sprinting Abnormal's round 2 ladder and table, and legal horse states for the screen). The decider's
first run predates that pass, so its Sprinting Abnormal rows differ: with flags cleared on every hold
card, its 4 player characters row read 82.8% by round 3 and 1.07 Critical Injuries, against 76.1% and
0.82 now. Its screen with Hook and Cut and Hamstring Line read 89.1% and 0.65 with flags kept and 88.7%
and 0.67 with flags cleared, against 85.5% and 0.43 and 85.3% and 0.43 now; the Small Titan's read 89.3%
and 0.49 against 88.8% and 0.52, against 88.7% and 0.51 and 88.4% and 0.52 now. The finding holds on
both models: keeping flags through a hold moves no row beyond sampling.

Run from the repository: uv run --with pyyaml python tools/probes/batch-3c/flags_b3c.py [fights]
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


class Fight3c(F6.Fight6):
    def __init__(self, rng, cfg):
        super().__init__(rng, cfg)
        self.stats["hooked_unread"] = 0

    def resolve_card(self):
        t = self.t
        # titan_card has already counted this card off the hold: hold_left > 0 means it is not the last
        if t.holder == "decoy" and not t.grab and not t.dead and t.hold_left > 0:
            self.stats["hooked_unread"] += sum(1 for s in self.alive() if s.flags["hooked"])
        super().resolve_card()


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [Fight3c(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(run_cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    res = [r for part in parts for r in part]
    out = F6.summarize(res)
    out["hooked_unread"] = round(sum(r["hooked_unread"] for r in res) / len(res), 3)
    return out


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 6000
    # fight.py and fight6.py now carry decision batch 4's rules as their defaults, and the Sprinting Abnormal's
    # ladder names current-holder and its Grab and Headlong Lunge are Severity 2 (decision batch 4, 4-4); pin the
    # nearest reading, the Squad-sheet tie-break, the ladder, and the Severities this probe ran with.
    rule = dict(ba_rule="holder_in_a_row", decoy_hold="tempo", screen_feints=True, nearest="holder_keeps",
                tie_break="sheet")
    cases = []
    for tid in ("standard-small", "sprinting-abnormal", "standard-medium"):
        base = dict(rule, titan_id=tid, policy="eager")
        if tid == "sprinting-abnormal":
            base["rungs"] = ["loudest-or-brightest", "hooked-into-its-body", "nearest"]
            base["entry_over"] = {"grab": {"severity": 3}, "headlong-lunge": {"severity": 3}}
        for keep in (False, True):
            tag = "flags kept through the hold (the rule)" if keep else "flags cleared on every hold card (batch 3b)"
            flags = "evaluating" if keep else "every_card"
            cases += [
                (f"{tid}: 4 PC, {tag}", dict(base, flags=flags)),
                (f"{tid}: 4 PC + 2 screen beside holder, {tag}", dict(base, squadmates=2, squadmate_role="screen2", flags=flags)),
                (f"{tid}: 4 PC + 2 screen, Hook and Cut + Hamstring Line + escapes, {tag}",
                 dict(base, squadmates=2, squadmate_role="screen2", tactics=["hook", "hamstring"], escapes=True, flags=flags)),
            ]
    keys = ["median", "by3", "by4", "nokill12", "cis", "deaths", "grabs", "devours", "cards_resolved_per_round",
            "decoy_cards_per_round", "decoys", "feints", "tactic_uses", "hooked_unread"]
    for i, (label, cfg) in enumerate(cases):
        r = run_many(cfg, n, 800 + i)
        print(label, {k: r.get(k) for k in keys}, flush=True)
