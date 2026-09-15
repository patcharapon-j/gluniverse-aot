"""Card-order model of the lone Rookie's Break Attention line against a Tempo 1 Titan.

Reproduces the drafter's solo_wait (naive policy: attempt every turn, unlimited decoys) and the
decider's figures (the same with no escalation), then adds the two things a player at the table
has that the probe lacks: the cards are face up, so the soldier can attempt only when the
Titan's card has already come this round (informed policy), and the lone Rookie has a finite
decoy inventory: one horse (retried on failure, gone on success), 2 flares and 1 cloak (each
one attempt, spent when declared).
"""
import random
import statistics
import sys
from multiprocessing import Pool

sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
from core_local import make, attr_roll  # noqa: E402


def ba_rates(build, n=200000, seed=5):
    rng = random.Random(seed)
    out = []
    for need in range(1, 8):
        ok = 0
        for _ in range(n):
            s = make(build)
            ok += attr_roll(rng, s, "break-attention", s.per, 0, 0, "odm", push_to=need)["succ"] >= need
        out.append(ok / n)
    return out


def trial(rng, ps, escalate, cap, informed, inventory, max_rounds):
    rnd = 0
    decoy = False
    blocked = False
    cards_against = 0
    spent = 0
    c12 = None
    struck = False
    horse = True
    oneshots = 3 if inventory else 10**9
    exhausted = False
    wasted = 0
    while rnd < max_rounds:
        rnd += 1
        t_first = rng.random() < 0.5
        order = ["t", "s"] if t_first else ["s", "t"]
        for c in order:
            if c == "t":
                if decoy:
                    decoy = False
                    blocked = cap
                    wasted += 1
                else:
                    cards_against += 1
                    blocked = False
            else:
                if decoy:
                    struck = True
                    break
                if informed and not t_first:
                    continue
                need_idx = min(spent, len(ps) - 1) if escalate else 0
                p = ps[need_idx]
                if blocked:
                    continue
                if inventory:
                    if horse:
                        pass
                    elif oneshots > 0:
                        oneshots -= 1
                    else:
                        exhausted = True
                        continue   # no decoy left: the soldier keeps taking cards
                if rng.random() < p:
                    decoy = True
                    spent += 1
                    if inventory and horse:
                        horse = False
        if struck:
            break
        if rnd == 12:
            c12 = cards_against
    if c12 is None:
        c12 = cards_against
    return struck, rnd, cards_against, c12, spent, wasted


def run(args):
    ps, trials, seed, escalate, cap, informed, inventory, max_rounds = args
    rng = random.Random(seed)
    rounds_struck, cards_struck, rounds_all, cards12, decoys, wasted = [], [], [], [], [], []
    by = {4: 0, 6: 0, 12: 0}
    n_struck = 0
    for _ in range(trials):
        struck, rnd, cards, c12, spent, w = trial(rng, ps, escalate, cap, informed, inventory, max_rounds)
        rounds_all.append(rnd)
        cards12.append(c12)
        decoys.append(spent)
        wasted.append(w)
        if struck:
            n_struck += 1
            rounds_struck.append(rnd)
            cards_struck.append(cards)
            for k in by:
                if rnd <= k:
                    by[k] += 1
    return dict(
        struck_share=round(100 * n_struck / trials, 1),
        usable_by={k: round(100 * v / trials, 1) for k, v in by.items()},
        median_rounds_all=statistics.median(rounds_all),
        mean_rounds_all=round(statistics.mean(rounds_all), 2),
        median_rounds_struck=statistics.median(rounds_struck) if rounds_struck else None,
        mean_rounds_struck=round(statistics.mean(rounds_struck), 2) if rounds_struck else None,
        mean_cards_before_strike=round(statistics.mean(cards_struck), 2) if cards_struck else None,
        mean_cards_through_12=round(statistics.mean(cards12), 2),
        mean_decoys=round(statistics.mean(decoys), 2),
        mean_wasted=round(statistics.mean(wasted), 2),
    )


if __name__ == "__main__":
    T = int(sys.argv[1]) if len(sys.argv) > 1 else 200000
    ps = ba_rates("rookie")
    print("Rookie Break Attention per attempt, needs 1..7:", [f"{p*100:.1f}" for p in ps])
    cases = [
        ("naive, escalation (the rule; drafter's row), 1000-round horizon", (ps, T, 11, True, False, False, False, 1000)),
        ("naive, no escalation (decider's figure), 1000-round horizon", (ps, T, 12, False, False, False, False, 1000)),
        ("naive, no escalation + rejected cap (decider's 3.72), 1000-round horizon", (ps, T, 13, False, True, False, False, 1000)),
        ("naive, escalation + rejected cap, 1000-round horizon", (ps, T, 14, True, True, False, False, 1000)),
        ("naive, escalation, 12-round horizon", (ps, T, 15, True, False, False, False, 12)),
        ("informed (attempt only after the Titan's card), escalation, unlimited decoys, 12 rounds", (ps, T, 16, True, False, True, False, 12)),
        ("informed, no escalation, unlimited decoys, 12 rounds", (ps, T, 17, False, False, True, False, 12)),
        ("informed, escalation, inventory horse+2 flares+cloak, 12 rounds", (ps, T, 18, True, False, True, True, 12)),
        ("informed, no escalation, inventory, 12 rounds", (ps, T, 19, False, False, True, True, 12)),
        ("informed, no escalation + rejected cap, inventory, 12 rounds", (ps, T, 20, False, True, True, True, 12)),
        ("naive, escalation, inventory, 12 rounds", (ps, T, 21, True, False, False, True, 12)),
        ("informed, escalation, inventory, 24 rounds", (ps, T, 22, True, False, True, True, 24)),
    ]
    with Pool(len(cases)) as p:
        res = p.map(run, [c[1] for c in cases])
    for (label, _), r in zip(cases, res):
        print(label)
        print("   ", r)
