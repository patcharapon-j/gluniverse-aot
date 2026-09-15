import sys, json
from simple import *

if __name__ == "__main__":

    T = int(sys.argv[2]) if len(sys.argv) > 2 else 60000
    what = sys.argv[1]
    if what == "jam":
        jobs, keys = [], []
        seed = 100
        for size in ["small", "medium", "large"]:
            for n in [1, 2]:
                for tiers in ["kill", "mix"]:
                    for h in [0, 1, 2, 3]:
                        for cover in [False, True]:
                            seed += 1
                            jobs.append((size, n, tiers, h, cover, T, seed, None))
                            keys.append((size, n, tiers, h, cover))
        res = run_parallel(jam_cell, jobs)
        for k, v in zip(keys, res):
            print(k, f"{v*100:.1f}")
    elif what == "solo":
        jobs, keys = [], []
        seed = 500
        for b in ["rookie", "veteran", "levi"]:
            for nd in [4, 5]:
                for s in [0, 1, 2, 3]:
                    seed += 1
                    jobs.append((b, s, nd, T, seed)); keys.append((b, nd, s))
        res = run_parallel(solo_cell, jobs)
        for k, v in zip(keys, res):
            print(k, f"{v*100:.1f}")
    elif what == "gas":
        print(run_parallel(gas_cell, [(2, T, 1), (3, T, 2)]))

    if what == "grab":
        cells = [(1, 0), (2, 0), (3, 0), (1, 1), (2, 1), (3, 1)]
        jobs, keys = [], []
        seed = 900
        def add(key, kw, n=T):
            global seed
            seed += 1
            jobs.append((kw, n, seed)); keys.append(key)
        for rule in ["d", "old"]:
            for vd in [True, False, "roll"]:
                add(("lone", rule, vd), dict(comrades=0, witness_stress=1, grief=0, victim_dodged=vd, rule=rule), 2 * T)
        add(("lone", "d", "no-grip-breaker"), dict(comrades=0, witness_stress=1, grief=0, victim_over={"talents": {}}), 2 * T)
        add(("lone", "d", "victim-stress-2"), dict(comrades=0, witness_stress=1, grief=0, victim_over={"stress": 2}), 2 * T)
        for label, kw in [("one", dict(comrades=1)), ("one-not-dodged", dict(comrades=1, victim_dodged=False)),
                          ("one-roll", dict(comrades=1, victim_dodged="roll")),
                          ("two", dict(comrades=2)), ("three", dict(comrades=3)),
                          ("one-template-no-talent", dict(comrades=1, rescuer_talent=0)),
                          ("one-old-not-dodged", dict(comrades=1, victim_dodged=False, rule="old"))]:
            for s, g in cells:
                k = dict(kw); k.update(witness_stress=s, grief=g)
                add((label, s, g), k)
        add(("one-wounded-arm", 2, 0), dict(comrades=1, witness_stress=2, grief=0, arm_wounded=True))
        for refund in [True, False]:
            for vd in [True, False, "roll"]:
                add(("lone-debt", "refund" if refund else "no-refund", vd),
                    dict(comrades=0, witness_stress=1, grief=0, victim_dodged=vd, debt=True, refund=refund), 2 * T)
                add(("one-debt-S2G0", "refund" if refund else "no-refund", vd),
                    dict(comrades=1, witness_stress=2, grief=0, victim_dodged=vd, debt=True, refund=refund))
        for h, prior in [(2, [("leg", "leg-twisted-ankle")]), (3, [("leg", "leg-twisted-ankle"), ("leg", "leg-gashed-thigh")]),
                         (4, [("leg", "leg-twisted-ankle"), ("leg", "leg-gashed-thigh")]),
                         (5, [("leg", "leg-twisted-ankle"), ("leg", "leg-gashed-thigh")]),
                         (6, [("leg", "leg-twisted-ankle"), ("leg", "leg-gashed-thigh")])]:
            for c in [0, 1]:
                add(("prior", h, c), dict(comrades=c, witness_stress=2, grief=0, prior=prior, victim_over={"health": h}))
            add(("fresh-health", h, 0), dict(comrades=0, witness_stress=2, grief=0, victim_over={"health": h}))
        res = run_parallel(grab_cell, jobs)
        for k, v in zip(keys, res):
            print(k, f"{v*100:.1f}")

    if what == "jamtable":
        jobs, keys = [], []
        seed = 3000
        for size in ["small", "medium", "large"]:
            for n in [1, 2]:
                for h in [0, 1, 2, 3]:
                    for cover in [False, True]:
                        seed += 1
                        jobs.append((size, n, "table", h, cover, T, seed, None))
                        keys.append((size, n, "table", h, cover))
        res = run_parallel(jam_cell, jobs)
        for k, v in zip(keys, res):
            print(k, f"{v*100:.1f}")
    if what in ("wait", "ba"):
        # Break Attention per attempt at needs 1 to 7, each build fresh at its fight-start Stress,
        # with ODM Gear, no Talent dice, Pushing when short (attention.yaml, break_attention, needs).
        import random as _r
        from core import make as _m, attr_roll as _a
        N = 100000
        rates = {}
        for b in ["rookie", "veteran", "levi"]:
            rng = _r.Random(5)
            rates[b] = []
            for need in [1, 2, 3, 4, 5, 6, 7]:
                ok = 0
                for _ in range(N):
                    s = _m(b)
                    ok += _a(rng, s, "break-attention", s.per, 0, 0, "odm", push_to=need)["succ"] >= need
                rates[b].append(ok / N)
            print("BA success by need 1-7", b, [f"{r*100:.1f}" for r in rates[b]])
        if what == "wait":
            ps = rates["rookie"]
            print("lone card-order wait:")
            res = run_parallel(solo_wait, [(ps, 200000, 9, False, True), (ps, 200000, 9, False, False),
                                           (ps, 200000, 9, True, False), (ps, 200000, 9, False, "reset")], 4)
            for label, r in zip(["batch 3's rule (decoys spent, never reset)", "no escalation (before batch 3)",
                                 "rejected decoy cap, no escalation", "the rule (decoys in a row, batch 3b)"], res):
                print(label, r)
