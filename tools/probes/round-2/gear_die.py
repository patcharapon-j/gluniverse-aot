"""Round 2 feedback probe: what re-rolling Gear Dice on a Push would do.

Owner proposal: "blade set cannot run out, let make it that gear dice is also rerolled on push".
Today a Gear Die is never re-rolled (data/core/dice-pool.yaml, die_types, gear): its faces stay,
a 1 is locked, and each 1 showing when a Pushed roll is final wears the gear by 1.

Exact binomial arithmetic, no sampling. Two readings of the proposal:
  A  re-roll 2 to 5, keep 6, lock 1   (the Stress Die's pattern, die_types, stress)
  B  re-roll everything but 6         (1s are not locked, so a 1 can escape)

    uv run --with pyyaml python tools/probes/round-2/gear_die.py
"""
from math import comb

import yaml

DICE = yaml.safe_load(open("data/core/dice-pool.yaml"))
ISSUE = yaml.safe_load(open("data/gear/standard-issue.yaml"))

# The Jam test's model (data/engagement/tuning.yaml, jam_test): the reference Rookie holds
# Attention for three rounds and Pushes a dodge each round, so three Pushed rolls, each with the
# ODM Gear's Gear Dice. Its accepted bar is "no more than a third of fights" and the worst
# measured cell today is 28.3% (docs/reviews/simulator-report.md, section 4.2).
JAM_ROUNDS = 3
JAM_BAR = 1 / 3
MEASURED_TODAY = 0.283


def at_least(n, k, p):
    return sum(comb(n, i) * p ** i * (1 - p) ** (n - i) for i in range(k, n + 1))


RULES = {
    "today, never re-rolled": (1 / 6, 1 / 6),
    "A re-roll 2-5, keep 6, lock 1": (1 / 6 + (4 / 6) * (1 / 6), 1 / 6 + (4 / 6) * (1 / 6)),
    "B re-roll all but 6": ((5 / 6) * (1 / 6), 1 / 6 + (5 / 6) * (1 / 6)),
}


def main():
    print("Gear Die faces when a Pushed roll is final\n")
    print(f"{'rule':32s} {'P(shows 1, wears)':>18s} {'P(shows 6, success)':>20s}")
    for name, (p1, p6) in RULES.items():
        print(f"{name:32s} {p1:18.1%} {p6:20.1%}")

    print("\nBlade Set ruined by one Pushed strike (issued rating 1, so one point ruins it)\n")
    print(f"{'rule':32s} {'per Pushed strike':>18s} {'Pushed strikes per ruin':>24s}")
    for name, (p1, _) in RULES.items():
        print(f"{name:32s} {p1:18.1%} {1 / p1:24.2f}")

    print(f"\nJam test proxy: {JAM_ROUNDS} Pushed dodges, ODM Gear Dice each time.")
    print(f"Bar is no more than {JAM_BAR:.1%}; the worst cell measured today is {MEASURED_TODAY:.1%}.\n")
    print(f"{'rule':32s} {'ODM Gear 2':>12s} {'ODM Gear 3':>12s}")
    for name, (p1, _) in RULES.items():
        row = f"{name:32s}"
        for rating in (2, 3):
            n = JAM_ROUNDS * rating          # one Gear Die per point of rating, per Pushed roll
            p = at_least(n, rating, p1)      # the rating's worth of wear Jams it
            row += f" {p:11.1%}{'!' if p > JAM_BAR else ' '}"
        print(row)

    print("\nGear Dice added to a Pushed roll's successes (ODM Gear 2)\n")
    print(f"{'rule':32s} {'E[successes from gear]':>24s}")
    for name, (_, p6) in RULES.items():
        print(f"{name:32s} {2 * p6:24.3f}")

    print("\nIssued ODM Gear rating by Funding (data/gear/standard-issue.yaml):",
          [r["odm_gear_rating"] for r in ISSUE["by_funding"]])
    print("Gear Die today:", DICE["die_types"][1]["push_re_rolls_faces"], "re-rolled on a Push.")


if __name__ == "__main__":
    main()
