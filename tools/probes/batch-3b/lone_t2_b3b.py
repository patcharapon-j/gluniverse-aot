"""Batch 3b addendum (Chapter 6 Major 3): the full lone-fight model against a Tempo 2 Titan, under the
escalation variants, the Feint, and two decoy-hold readings ("card": a decoy holds for the Titan's next
card, as Chapter 5 says; "tempo": it holds for as many of the Titan's next cards as its Tempo).
Policy "last": Break Attention only once every Titan card of the round has come; "after_first": once at
least one has. Nape Depth is cfg "nd" (4 Medium, 3 Small). Writes nothing in the project.
Run from this directory: uv run --with pyyaml python lone_t2_b3b.py [trials]
Committed in tools/probes/batch-3b/ with relative paths; the model is the decider's, unchanged.
"""
import os
import random
import sys
from multiprocessing import Pool

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lone_b3b import Lone3b, mod, summarize  # noqa: E402

d6 = mod.d6


class LoneT(Lone3b):
    def __init__(self, rng, cfg):
        super().__init__(rng, cfg)
        self.decoy_left = 0

    def nape(self, s):
        nd = self.cfg.get("nd", 4)
        s.cur_action = True
        res = mod.attr_roll(self.rng, s, "nape-strike", s.str, s.talents.get("nape-strike", 0), 0, "blade", push_to=nd)
        self.st["struck"] = True
        self.st["rounds"] = self.rnd
        self.st["stress_at_strike"] = s.stress
        self.st["cards_before_strike"] = self.st["cards_against"]
        self.st["cis_before_strike"] = self.st["cis"]
        self.st["kill"] = res["succ"] >= nd
        self.end("struck")

    def break_attention(self, s, decoy):
        ok = super().break_attention(s, decoy)
        if ok:
            self.decoy_left = self.cfg.get("tempo", 1) if self.cfg.get("hold", "card") == "tempo" else 1
        return ok

    def titan_card(self):
        if self.grab:
            return
        holding = self.decoy
        if holding:
            self.decoy_left -= 1
        super().titan_card()
        if holding and self.decoy_left > 0 and not self.done:
            self.decoy = True

    def run(self):
        s = self.s
        self.done = False
        max_rounds = self.cfg.get("max_rounds", 12)
        tempo = self.cfg.get("tempo", 1)
        policy = self.cfg.get("policy", "last")
        for rnd in range(1, max_rounds + 1):
            self.rnd = rnd
            cards = self.rng.sample(range(1, 21), 1 + tempo)
            sc, tcs = cards[0], sorted(cards[1:])
            passed = sum(1 for c in tcs if c < sc)
            self.t_first = passed == tempo if policy == "last" else passed >= 1
            s.cur_move = rnd in s.pre_turn
            s.cur_action = rnd in s.pre_turn or rnd in s.pre_action
            s.dodge_succ = None
            s.odm_used = s.odm_pushed = False
            events = sorted([(sc, "s")] + [(c, "t") for c in tcs])
            for _, who in events:
                if who == "t":
                    self.titan_card()
                else:
                    self.soldier_turn()
                if self.done:
                    break
            if self.done:
                break
            if s.odm_used:
                dice = 3 if s.odm_pushed else 2
                s.gas = max(0, s.gas - sum(1 for _ in range(dice) if d6(self.rng) == 1))
                if s.gas == 0 and s.spares == 0:
                    self.st["dry"] = True
            if not self.any_decoy_left(s) and not self.decoy:
                self.st["exhausted"] = True
                self.end("exhausted")
                break
        self.st["rounds_played"] = self.rnd
        return self.st


def cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [LoneT(rng, cfg).run() for _ in range(n)]


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    return summarize([r for part in parts for r in part])


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 100000
    E = dict(esc="reset", feint=True)
    cases = [
        ("sanity: Tempo 1, E, hold card (lone_b3b E)", dict(E, tempo=1)),
        ("sanity: Tempo 1, E, hold tempo (must equal hold card)", dict(E, tempo=1, hold="tempo")),
        ("T2 A: permanent escalation, no feint (batch 3 rule), hold card", dict(esc="perm", tempo=2)),
        ("T2 B: no escalation, no feint, hold card", dict(esc="none", tempo=2)),
        ("T2 C: reset, no feint, hold card", dict(esc="reset", tempo=2)),
        ("T2 E: reset + feint, hold card", dict(E, tempo=2)),
        ("T2 F: none + feint, hold card", dict(esc="none", feint=True, tempo=2)),
        ("T2 E, hold tempo, policy last", dict(E, tempo=2, hold="tempo")),
        ("T2 E, hold tempo, policy after_first", dict(E, tempo=2, hold="tempo", policy="after_first")),
        ("T2 A (batch 3 rule), hold tempo, policy last", dict(esc="perm", tempo=2, hold="tempo")),
        ("T2 E, hold card, Nape Depth 3 (Small)", dict(E, tempo=2, nd=3)),
        ("T2 E, hold tempo, policy last, Nape Depth 3 (Small)", dict(E, tempo=2, hold="tempo", nd=3)),
        ("T2 E, hold tempo, after_first, Nape Depth 3 (Small)", dict(E, tempo=2, hold="tempo", policy="after_first", nd=3)),
        ("T2 E, hold card, 24 rounds", dict(E, tempo=2, max_rounds=24)),
        ("T2 E, hold tempo, policy last, 24 rounds", dict(E, tempo=2, hold="tempo", max_rounds=24)),
    ]
    keys = ["usable_strike_share", "by_round", "median_round_struck", "mean_round_struck", "cards_before_strike",
            "cards_against_per_fight", "cards_spent_by_decoys", "cis_per_fight", "deaths", "downs", "ends",
            "stress_at_strike", "kill_given_strike", "kill_per_fight", "ba_attempts", "ba_succ", "jams", "rounds_played"]
    for i, (label, cfg) in enumerate(cases):
        r = run_many(cfg, n, 500 + i)
        print(label, {k: r[k] for k in keys}, flush=True)
