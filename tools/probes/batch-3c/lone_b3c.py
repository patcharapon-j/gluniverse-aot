"""Decision batch 3c, conformance review round 2 Minor 3: the lone-fight model (tools/probes/chapter-05/lone.py)
with the route check corrected. A soldier whose canister is empty but who carries a spare still has the
Feint (Change Canister comes on their turn), and a Jammed harness is repaired in the fight by Field Repair
(Chapter 4 section 4.8; data/gear/field-repair.yaml: an action, Wits alone without a tool kit, needing 1,
each success restoring 1 point of the current rating; the Rookie's Wits is 2 under ADR-0014).

The decider staged these as a subclass of lone.py. The committed lone.py now carries both corrections as
switches (spare, repair; on by default, the rule), so this script runs the committed model with the
switches set per row, on the decider's seeds, and reproduces the staged figures.

Run from the repository: uv run --with pyyaml python tools/probes/batch-3c/lone_b3c.py [trials]
"""
import os
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "chapter-05"))
import lone as L  # noqa: E402
L.DEFAULT_RETREAT_CLOCK = None  # decision batch 5: this record ran under the 12-round horizon

CASES = [
    ("Tempo 1, the rule as committed before batch 3c (no spare counted, no Field Repair)", dict(spare=False, repair=False)),
    ("Tempo 1, spare canister counted", dict(repair=False)),
    ("Tempo 1, spare counted and Field Repair (the rule)", dict()),
    ("Tempo 2 waiting line, as committed before batch 3c", dict(tempo=2, spare=False, repair=False)),
    ("Tempo 2 waiting line, spare counted and Field Repair (the rule)", dict(tempo=2)),
    ("Tempo 1, spare and Field Repair, 24 rounds", dict(max_rounds=24)),
]

if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 100000
    keys = ["usable_strike_share", "by_round", "median_round_struck", "cards_before_strike", "cis_per_fight",
            "deaths", "downs", "ends", "stress_at_strike", "kill_given_strike", "kill_per_fight", "jams",
            "repairs", "repair_rolls", "rounds_played"]
    for i, (label, cfg) in enumerate(CASES):
        r = L.run_many(cfg, n, 700 + i)
        print(label, {k: r[k] for k in keys}, flush=True)
