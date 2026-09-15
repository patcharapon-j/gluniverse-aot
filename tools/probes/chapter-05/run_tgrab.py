import random
from multiprocessing import Pool
from simple import grab_trial
CASES = {
    "slayer (Str 4, no Break Free Talent)": dict(strength=4, talents={}),
    "brawler (Str 4, Grip Breaker 1)": dict(strength=4, talents={"break-free": 1}),
    "flier (Str 3, no Break Free Talent)": dict(strength=3, talents={}),
    "hunter (Str 3, Health 3, no Break Free Talent)": dict(strength=3, health=3, talents={}),
}
def work(a):
    name, seed, n = a
    rng = random.Random(seed)
    return name, sum(grab_trial(rng, 0, 1, 0, victim_dodged=True, victim_over=CASES[name]) for _ in range(n))
if __name__ == "__main__":
    N, P = 60000, 12
    with Pool(P) as pool:
        for name in CASES:
            res = pool.map(work, [(name, 1000 + i, N // P) for i in range(P)])
            print(name, round(100 * sum(r[1] for r in res) / N, 1), flush=True)
