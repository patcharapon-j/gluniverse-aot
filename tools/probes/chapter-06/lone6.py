"""The lone Nape strike, the lone fight, and the Grab cells, against the values and Behavior Table of a
Chapter 6 Titan read from data/titans/.

The lone fight (lone_cfg) is Chapter 5's committed lone-fight model (tools/probes/chapter-05/lone.py) under the
rule as revised in decision batch 3b, fought against the Titan's own Tempo, Nape Depth, and Behavior Table
(each entry's Position requirement, fallback, Attack Dice, and effects), with the abnormal Fear Roll at the
start for an Abnormal. The lone soldier starts mounted, as Chapter 5's model does. Lines: "waiting" (Break
Attention once every card of the Titan has come up in a round), "hurried" (once at least one has; the same
line at Tempo 1), and "one_card_hold" (the waiting line with a decoy holding one card, Chapter 5 before
batch 3b; the same as the rule at Tempo 1).

The other two models are Chapter 5's, imported from tools/probes/chapter-05/simple.py:
- solo_trial: a lone soldier takes Break Attention (needing 1, as the Attention holder with no decoy yet
  spent) up to three times, then strikes the Nape at the Titan's Nape Depth, Pushing when short, spending
  no Openings they created.
- grab_trial: one Grab with rule (e) of OQ-85, the victim's failed dodge, witnesses' Fear Rolls, and
  rescuers striking the Toughness 1 hand. The Titan's own Grab rolls its Attack Dice and the victim's dodge
  is Pushed toward its successes, both drawn again until the Grab lands (grab_trial's attack_dice; decision
  batch 8, 8-1). The Attack Dice of both models are read through tools/sim/dice.py, as the simulator reads
  them (tools/probes/chapter-05/core.py, sim_dice).
Neither model reads the Behavior Table, which is why the Chapter 6 constraints say these targets do not
depend on the table; this file re-runs them so the figures quoted for each stat block come from it.
"""
import os
import random
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "chapter-05"))
sys.path.insert(0, HERE)

import simple as s5   # noqa: E402  (tools/probes/chapter-05/simple.py)
import titans          # noqa: E402

FIGHT_START = {"rookie": 1, "veteran": 2, "levi": 2}
LINES = {"waiting": {}, "hurried": {"policy": "after_first"}, "one_card_hold": {"hold": "card"}}


def lone_entries(t):
    """The Titan's Behavior Table in the form lone.py reads (a telegraph changes no choice in the model)."""
    out = []
    for e in titans.entries(t):
        out.append({"id": e["id"], "results": list(e["results"]), "position_requirement": list(e["position_requirement"]),
                    "attack_dice": e.get("attack_dice") or 0, "effects": [dict(x) for x in e["effects"]],
                    "fallback": e["fallback"]})
    return out


def lone_cfg(tid, line):
    t = titans.load_titan(tid)
    cfg = {"tempo": t["tempo"], "nd": t["nape_depth"], "entries": lone_entries(t), "start_fear": bool(t["abnormal"])}
    cfg.update(LINES[line])
    return cfg


def lone_lines(tid):
    """The lines worth running: at Tempo 1 the hurried line and the one-card hold are the waiting line."""
    return ["waiting", "hurried", "one_card_hold"] if titans.load_titan(tid)["tempo"] > 1 else ["waiting"]


def grab_attack_dice(t):
    return max(e["attack_dice"] for e in titans.entries(t) if titans.is_grab(e))


def solo_cell(args):
    tid, build, stress, trials, seed = args
    t = titans.load_titan(tid)
    return s5.solo_cell((build, stress, t["nape_depth"], trials, seed))


def grab_cell(args):
    tid, kw, trials, seed = args
    t = titans.load_titan(tid)
    rng = random.Random(seed)
    kw = dict(kw, attack_dice=grab_attack_dice(t))
    return sum(s5.grab_trial(rng, **kw) for _ in range(trials)) / trials
