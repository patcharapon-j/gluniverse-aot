import random
from statistics import mean

random.seed(7)
N = 200_000

def roll(n):
    return [random.randint(1, 6) for _ in range(n)]

def push_lock(dice):
    """Coriolis-style push: re-roll dice showing neither 6 nor 1."""
    return [d if d in (1, 6) else random.randint(1, 6) for d in dice]

def p_atleast(pool, k, pushed):
    hits = 0
    for _ in range(N):
        d = roll(pool)
        if pushed and sum(x == 6 for x in d) < k:
            d = push_lock(d)
        hits += sum(x == 6 for x in d) >= k
    return hits / N

print("A. P(>= k sixes), unpushed / pushed (1s locked)")
for pool in (3, 4, 5, 6, 8, 10, 14, 21):
    row = []
    for k in (1, 2, 3, 5, 6):
        row.append(f"k{k}: {p_atleast(pool,k,False):.2f}/{p_atleast(pool,k,True):.2f}")
    print(f"  pool {pool:2d}: " + "  ".join(row))

print("\nB. Gas Roll: rounds until Gas Rating hits 0 (each 1 lowers rating by 1)")
def gas_rounds(start, rolls_per_round):
    out = []
    for _ in range(50_000):
        r, rounds = start, 0
        while r > 0:
            rounds += 1
            for _ in range(rolls_per_round):
                if r <= 0:
                    break
                r -= sum(x == 1 for x in roll(r))
        out.append(rounds)
    return mean(out)
for s in range(1, 7):
    print(f"  start {s}: {gas_rounds(s,1):5.1f} rounds unpushed, {gas_rounds(s,2):5.1f} rounds pushing every round")

print("\nC. Stress: base pool 5, Resolve R. P(response per roll), P(Mess Up | response), P(action succeeds and is not Messed Up)")
def stress_table(base, s, R):
    resp = 0; mess = 0; ok = 0
    for _ in range(N):
        d = roll(base + s)
        stress_dice = d[base:]
        r = any(x == 1 for x in stress_dice)
        m = False
        if r:
            resp += 1
            m = (random.randint(1, 6) + s - R) >= 7
            mess += m
        if any(x == 6 for x in d) and not m:
            ok += 1
    return resp / N, (mess / resp if resp else 0), ok / N
for R in (2, 3, 4):
    print(f"  Resolve {R}:")
    for s in (0, 1, 2, 3, 4, 5, 6, 8):
        pr, pm, pok = stress_table(5, s, R)
        print(f"    Stress {s}: P(resp)={pr:.2f}  P(MessUp|resp)={pm:.2f}  P(clean success)={pok:.2f}")

print("\nD. Nape pile-on: strikers at Blind Spot, each 5 dice pushed, cumulative sixes per round")
def exp_sixes(pool, pushed):
    tot = 0
    for _ in range(N):
        d = roll(pool)
        if pushed:
            d = push_lock(d)
        tot += sum(x == 6 for x in d)
    return tot / N
e5 = exp_sixes(5, True); e5u = exp_sixes(5, False)
print(f"  5 dice: {e5u:.2f} sixes unpushed, {e5:.2f} pushed. Two strikers pushing: {2*e5:.2f}/round; three: {3*e5:.2f}/round")

print("\nE. Titan attack with fixed dice vs dodge (each dodge six cancels one attack six)")
def hit_prob(atk, dodge, pushed_dodge):
    hits = 0
    for _ in range(N):
        a = sum(x == 6 for x in roll(atk))
        dd = roll(dodge)
        if pushed_dodge:
            dd = push_lock(dd)
        dv = sum(x == 6 for x in dd)
        hits += (a - dv) >= 1
    return hits / N
for atk in (6, 8, 10):
    print(f"  attack {atk} dice vs dodge 5: hit {hit_prob(atk,5,False):.2f} (dodge pushed {hit_prob(atk,5,True):.2f});  vs dodge 8 pushed {hit_prob(atk,8,True):.2f}")

print("\nF. Blade wear: pushed strike with 2 blade Gear Dice, P(at least one 1 among them after push)")
def blade_ruin():
    c = 0
    for _ in range(N):
        d = roll(2)
        d = push_lock(d)
        c += any(x == 1 for x in d)
    return c / N
print(f"  P(set ruined per pushed strike) = {blade_ruin():.2f}")
