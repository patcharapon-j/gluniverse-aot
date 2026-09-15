"""The Jam test (OQ-72, on OQ-96's reading) against a Chapter 6 Titan's own Behavior Table.

The model is Chapter 5's (tools/probes/chapter-05/simple.py, jam_fight) with the reference table
replaced by the Titan's YAML table. The reference Rookie (Agility 3, ODM Gear 2, no dodge Talent,
Stress 1) holds the Attention of every Titan in the cell for three rounds at In Reach. Each Titan is
dealt its Tempo in cards; each card's behavior comes from the Behavior Table procedure with no Broken
parts (move-up on the previous behavior, then the entry's Position requirement at In Reach, its
fallback, or Thrash). Each card rolls its Attack Dice as Titan Dice (tools/sim/dice.py). The Rookie makes
one dodge against each Titan each round, Pushing toward the successes of its first card that does not whiff
(none when every card whiffs), Help gives the same dice to every dodge, and Covered columns Cover every Push.
A fight counts as Jammed when the ODM Gear rating reaches 0.

The mounted reading is the same test for a holder who stays mounted at Distant: every card's behavior is
found for a holder at Distant, the dodge takes its Gear Dice from the horse (rated 2, as the reference
Rookie's), and a fight counts when the horse goes lame (data/gear/horses.yaml, lame).
"""
import os
import random
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "chapter-05"))
sys.path.insert(0, HERE)

from core import make, attr_roll, sim_dice   # noqa: E402
import titans                                  # noqa: E402

A = sim_dice()   # tools/sim/dice.py: the Titan attack as the simulator reads it (decision batch 8, 8-1)


def card(rng, t, prev, pos="in-reach"):
    ids = titans.by_id(t)
    res = titans.by_result(t)
    r = rng.randint(1, 6)
    nb = "thrash"
    for i in range(6):
        eid = res[(r - 1 + i) % 6 + 1]
        if eid != prev:
            nb = eid
            break
    if nb == "thrash":
        return "thrash"
    e = ids[nb]
    if pos in e["position_requirement"]:
        return nb
    fb = e["fallback"]
    if fb == "thrash" or fb == prev or pos not in ids[fb]["position_requirement"]:
        return "thrash"
    return fb


def jam_fight(rng, t, n_titans, helpers, cover, rounds=3, every_card_kill=False, mounted=False):
    ids = titans.by_id(t)
    # decision batch 8, 8-1, as tools/sim/families.py jam_job reads it: each card rolls its Attack Dice (every card at
    # the kill pool in the kill reading, the upper bound); the one dodge answers the first card with 1 or more
    # successes, and no dodge is rolled when every card whiffs
    kill_dice = max(e["attack_dice"] for e in titans.entries(t) if e["tier"] == "kill")
    s = make("rookie")
    pos, gear = ("distant", "horse") if mounted else ("in-reach", "odm")
    prev = [None] * n_titans
    for _ in range(rounds):
        for k in range(n_titans):
            rolls = []
            for _ in range(t["tempo"]):
                beh = card(rng, t, prev[k], pos)
                prev[k] = beh
                rolls.append(A.titan_roll(rng, kill_dice if every_card_kill else (ids[beh].get("attack_dice") or 0)))
            first = A.first_answered(rolls)
            if first is None:
                continue
            res = attr_roll(rng, s, "dodge", s.agi, 0, helpers, gear, push_to=first, cover=cover)
            if mounted:
                s.horse -= res["gear_ones"]
                if s.horse <= 0:
                    return 1
            else:
                s.odm -= res["gear_ones"]
                if s.odm <= 0:
                    return 1
    return 0


def jam_cell(args):
    tid, n_titans, helpers, cover, trials, seed, kill = args[:7]
    mounted = args[7] if len(args) > 7 else False
    t = titans.load_titan(tid)
    rng = random.Random(seed)
    return sum(jam_fight(rng, t, n_titans, helpers, cover, every_card_kill=kill, mounted=mounted)
               for _ in range(trials)) / trials
