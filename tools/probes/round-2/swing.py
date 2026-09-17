"""Round 2 feedback probe: what a two-step "long swing" move would do to the approach.

Not the ADR-0014 simulator. A stand-in, in the manner of tools/probes/chapter-05, written to
answer one question for docs/playtest/feedback/round-2/odm-and-environment-design.md: if a
soldier may spend their move on two Position steps at the price of a Fly roll and a three-die
Gas Roll, how much faster does a striker reach Blind Spot, and what does it cost in gas?

It models only the approach: one striker, starting Distant, moving toward Blind Spot, and the
end-of-round Gas Roll. No Titan, no Attention, no harm. Values are read from the YAML.

    uv run --with pyyaml python tools/probes/round-2/swing.py 200000
"""
import random
import sys
from collections import defaultdict

import yaml

RATINGS = yaml.safe_load(open("data/engagement/anchor-ratings.yaml"))
ODM = yaml.safe_load(open("data/gear/odm-gear.yaml"))
FULL_GAS = ODM["gas"]["full_gas_rating"]

# Builds: base dice on a Fly roll (attribute + Stress Dice + ODM Gear Dice + Talent dice).
# Reference Rookie: Agility 3 (Slayer template), Stress 1, ODM Gear 2, no Talent dice on fly
# (OQ-91). Flier: Agility 4, Stress 1, ODM Gear 2, Wirework 1.
BUILDS = {"rookie": 6, "flier": 8}


def graph(rating_id):
    """{frozenset(pair): row} for one rating."""
    for r in RATINGS["ratings"]:
        if r["id"] == rating_id:
            return {frozenset(s["between"]): s for s in r["steps"]}
    raise KeyError(rating_id)


def chains(g, start, goal, limit=4):
    """Every simple chain of steps from start to goal, shortest first."""
    out = []
    stack = [(start, [start])]
    while stack:
        here, path = stack.pop()
        if len(path) > limit:
            continue
        if here == goal and len(path) > 1:
            out.append(path)
            continue
        for pair, _row in g.items():
            if here in pair:
                nxt = next(p for p in pair if p != here) if len(pair) == 2 else here
                if nxt not in path:
                    stack.append((nxt, path + [nxt]))
    return sorted(out, key=len)


def roll(n):
    return sum(1 for _ in range(n) if random.randint(1, 6) == 6)


def gas_roll(dice):
    return sum(1 for _ in range(dice) if random.randint(1, 6) == 1)


def approach(rating_id, pool, use_swing, rounds=4):
    """One striker's approach. Returns (round reached or None, gas left after `rounds`)."""
    g = graph(rating_id)
    routes = chains(g, "distant", "blind-spot")
    if not routes:
        return None, FULL_GAS
    route = routes[0]
    gas = FULL_GAS
    at = 0                      # index along the route
    reached = None
    for rnd in range(1, rounds + 1):
        odm_used = False
        swung = False
        if at < len(route) - 1:
            # how many steps of the route this move may take
            want = 2 if (use_swing and at + 2 < len(route) + 1 and at + 2 <= len(route) - 1) else 1
            if want == 2:
                swung = True
                odm_used = True
                if roll(pool) >= 1:
                    at += 2
                else:
                    at += 1     # a failed swing still makes the ordinary step
            else:
                pair = frozenset((route[at], route[at + 1]))
                row = g[pair]
                if row.get("fly_roll"):
                    odm_used = True
                    need = row["fly_roll"]["needs"]
                    if roll(pool) >= need:
                        at += 1
                    else:
                        at = route.index(row["fly_roll"]["failure_ends_at"]) \
                            if row["fly_roll"]["failure_ends_at"] in route else at
                elif row.get("odm") and not row.get("on_foot"):
                    odm_used = True
                    at += 1
                else:
                    at += 1     # on foot, free
            if at >= len(route) - 1 and reached is None:
                reached = rnd
        if odm_used:
            gas = max(0, gas - gas_roll(3 if swung else 2))
    return reached, gas


def main():
    trials = int(sys.argv[1]) if len(sys.argv) > 1 else 50000
    random.seed(20260917)
    print(f"trials per cell: {trials}\n")
    header = f"{'rating':14s} {'build':7s} {'policy':8s} {'reach r1':>9s} {'reach r2':>9s} " \
             f"{'mean round':>11s} {'gas left r4':>12s}"
    print(header)
    print("-" * len(header))
    for rating in ["sparse", "wooded", "urban", "giant-forest"]:
        for build, pool in BUILDS.items():
            for policy, use in [("today", False), ("swing", True)]:
                got = defaultdict(int)
                gas_total = 0
                reached_total = 0
                reached_n = 0
                for _ in range(trials):
                    r, gas = approach(rating, pool, use)
                    if r:
                        got[r] += 1
                        reached_total += r
                        reached_n += 1
                    gas_total += gas
                r1 = got[1] / trials
                r2 = (got[1] + got[2]) / trials
                mean = reached_total / reached_n if reached_n else float("nan")
                print(f"{rating:14s} {build:7s} {policy:8s} {r1:8.1%} {r2:8.1%} "
                      f"{mean:11.2f} {gas_total / trials:12.2f}")
        print()
    print("open: no step reaches Blind Spot while the Titan stands, so no row is shown.")


if __name__ == "__main__":
    main()
