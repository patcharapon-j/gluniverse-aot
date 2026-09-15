"""Jam test, lone Nape strike, gas medians, and the Grab cells."""
import random
import sys
import statistics
from multiprocessing import Pool
from core import make, attr_roll, gain_ci, fear_roll, d6, CI, sim_dice

SIZE = {
    "small": dict(tempo=2, sev={"terrorize": 1, "control": 2, "kill": 2}),
    "medium": dict(tempo=1, sev={"terrorize": 1, "control": 2, "kill": 3}),
    "large": dict(tempo=1, sev={"terrorize": 2, "control": 3, "kill": 4}),
}


# ------------------------------------------------------------------ Jam test
def jam_fight(rng, size, n_titans, tiers, helpers, cover, sev_override=None, rounds=3, push_to="first"):
    s = make("rookie")
    sev = dict(SIZE[size]["sev"])
    if sev_override:
        sev.update(sev_override)
    tempo = SIZE[size]["tempo"]
    prev = [None] * n_titans
    for r in range(rounds):
        for t in range(n_titans):
            if tiers == "kill":
                cards = ["kill"] * tempo
            elif tiers == "table":
                cards = []
                for _ in range(tempo):
                    prev[t], tier = table_card(rng, prev[t])
                    cards.append(tier)
            else:
                cards = [rng.choice(["terrorize", "control", "kill"]) for _ in range(tempo)]
            need = sev[cards[0]] if push_to == "first" else max(sev[c] for c in cards)
            res = attr_roll(rng, s, "dodge", s.agi, 0, helpers, "odm", push_to=need, cover=cover)
            s.odm -= res["gear_ones"]
            if s.odm <= 0:
                return 1
    return 0


# Reference table tiers from the Behavior Table procedure (move-up, no repeats), the holder at
# In Reach: Shake Off (needs On Body or Blind Spot) resolves as its fallback, Thrash (control).
REF = {1: ("roar", "terrorize"), 2: ("lunge", "terrorize"), 3: ("swat", "control"),
       4: ("shake", "control"), 5: ("grab", "kill"), 6: ("bite", "kill")}


def table_card(rng, prev):
    r = rng.randint(1, 6)
    for i in range(6):
        name, tier = REF[(r - 1 + i) % 6 + 1]
        if name != prev:
            break
    if name == "shake":
        return "thrash", "control"
    return name, tier


def jam_cell(args):
    size, n, tiers, helpers, cover, trials, seed, sevo = args
    rng = random.Random(seed)
    return sum(jam_fight(rng, size, n, tiers, helpers, cover, sevo) for _ in range(trials)) / trials


# ------------------------------------------------------------------ lone Nape strike
def solo_trial(rng, build, start_stress, nape_depth=4, tries=3):
    # The lone soldier holds the Titan's Attention and no decoy has yet held it, so each Break
    # Attention before the first success needs 1 (attention.yaml, break_attention, needs; OQ-81).
    s = make(build, stress=start_stress)
    ok = False
    for _ in range(tries):
        res = attr_roll(rng, s, "break-attention", s.per, 0, 0, "odm", push_to=1)
        s.odm -= res["gear_ones"]
        if res["succ"] >= 1:
            ok = True
            break
        if s.odm <= 0:
            break
    if not ok:
        return None
    if not s.odm_working():
        return None   # Jammed: no Nape strike is made
    res = attr_roll(rng, s, "nape-strike", s.str, s.talents["nape-strike"], 0, "blade", push_to=nape_depth)
    return res["succ"] >= nape_depth


def solo_cell(args):
    build, st, nd, trials, seed = args
    rng = random.Random(seed)
    hits = n = 0
    for _ in range(trials):
        r = solo_trial(rng, build, st, nd)
        if r is None:
            continue
        n += 1
        hits += r
    return hits / n


def solo_wait(args):
    """Card order only: rounds until a Break Attention success can be followed by the lone
    soldier's Nape strike before the Medium Titan's next card, and the Titan cards that resolved
    against the soldier meanwhile. ps[k] is the Break Attention success rate per attempt when k
    decoys have already held the Titan's Attention (needs 1 + k for the lone soldier, who holds
    Attention; OQ-81). escalate "reset", the rule as revised in decision batch 3b: k counts the decoys
    since the Titan's last card that resolved a behavior. escalate True, batch 3's rule: k never resets.
    escalate False uses ps[0] for every attempt, as before decision batch 3. The policy attempts on
    every turn with unlimited decoys, so it is the upper bound on wasted decoys, not the lone line a
    player plays (lone.py measures that).

    Returns a dict: the median and mean rounds, mean Titan cards against, and mean decoys placed,
    with a trial still waiting after 1,000 rounds stopped there; the share of trials with a usable
    strike by rounds 4, 6, and 12; and the mean Titan cards against before the strike or through
    round 12, whichever comes first."""
    ps, trials, seed = args[:3]
    cap = args[3] if len(args) > 3 else False   # rejected decoy cap: no Break Attention on a Titan whose last card a decoy spent
    escalate = args[4] if len(args) > 4 else True
    rng = random.Random(seed)
    rounds_list, cards_list, decoys_list = [], [], []
    by = {4: 0, 6: 0, 12: 0}
    cards12 = 0
    for _ in range(trials):
        rnd = 0
        decoy = False
        blocked = False
        cards_against = 0
        spent = 0
        c12 = None
        struck = False
        while rnd < 1000:
            rnd += 1
            order = ["s", "t"]
            rng.shuffle(order)
            for c in order:
                if c == "t":
                    if decoy:
                        decoy = False
                        blocked = cap
                    else:
                        cards_against += 1
                        blocked = False
                        if escalate == "reset":
                            spent = 0
                else:
                    if decoy:
                        struck = True
                        break
                    p = ps[min(spent, len(ps) - 1)] if escalate else ps[0]
                    if not blocked and rng.random() < p:
                        decoy = True
                        spent += 1
            if struck:
                break
            if rnd == 12:
                c12 = cards_against
        if c12 is None:
            c12 = cards_against
        cards12 += c12
        if struck:
            for k in by:
                if rnd <= k:
                    by[k] += 1
        rounds_list.append(rnd)
        cards_list.append(cards_against)
        decoys_list.append(spent)
    return dict(median_rounds=statistics.median(rounds_list), mean_rounds=round(statistics.mean(rounds_list), 2),
                mean_cards=round(statistics.mean(cards_list), 2), mean_decoys=round(statistics.mean(decoys_list), 2),
                usable_by_round={k: round(100 * v / trials, 1) for k, v in by.items()},
                mean_cards_through_round_12=round(cards12 / trials, 2))


# ------------------------------------------------------------------ gas medians
def gas_cell(args):
    dice, trials, seed = args
    rng = random.Random(seed)
    out = []
    for _ in range(trials):
        g, rounds = 3, 0
        while g > 0:
            rounds += 1
            g -= sum(1 for _ in range(dice) if rng.randint(1, 6) == 1)
        out.append(rounds)
    return statistics.median(out)


# ------------------------------------------------------------------ Grab cells
def grab_trial(rng, comrades, witness_stress, grief, victim_dodged=True, rule="d",
               victim_build="rookie", victim_over=None, rescuer_talent=1, rescuer_strength=4, prior=None,
               arm_wounded=False, lift_penalty=2, bf_need=2, strike_penalty=0, debt=False, refund=True,
               dodge_severity=3, attack_dice=None):
    """One Grab on a Medium Titan (Tempo 1). Returns True if the victim dies.

    rule "d": the victim's first counted turn begins with its action spent (the fix).
    rule "old": only a turn the dodge spent is lost.
    debt: the victim's card comes after the Titan's and their turn this round was spent in advance.
    refund: a failed dodge that spent a turn after the first counted turn gives that turn back, and
    the first counted turn counts as spent instead (grab.yaml, countdown, failed_dodge).
    dodge_severity: the Grab's Severity, which the victim's dodge is Pushed toward and must meet
    (3, the Medium kill Severity, for every Chapter 5 figure).
    attack_dice: a Chapter 6 Grab's Attack Dice (decision batch 8, 8-1), in place of dodge_severity: the Titan's
    roll and the dodge are read through sim_dice(), and a failed dodge is drawn again, roll and dodge, until the Grab
    lands, as tools/sim/families.py grab_trial reads the cell.
    """
    vo = dict(victim_over or {})
    v = make(victim_build, "v", **vo)
    for loc, rid in (prior or []):
        row = CI[loc]["by_id"][rid]
        v.cis.append({"row": row, "loc": loc, "limit": row["limit"]})
    v.check_down()
    rs = {f"c{i}": make("rookie", f"c{i}", strength=rescuer_strength, stress=witness_stress, grief=grief,
                        talents={"body-part-strike": rescuer_talent}) for i in range(comrades)}
    names = ["v"] + list(rs)
    spent = {n: {} for n in names}

    def st(n, r):
        return spent[n].setdefault(r, {"move": False, "action": False})

    def spend_turn(n, r):
        while True:
            x = st(n, r)
            if not x["move"] and not x["action"]:
                x["move"] = x["action"] = True
                return r
            r += 1

    def spend_action(n, r):
        while True:
            x = st(n, r)
            if not x["action"]:
                x["action"] = True
                return
            r += 1

    def deal():
        cs = rng.sample(range(1, 21), len(names) + 1)
        return dict(zip(names, cs[1:])), cs[0]

    card, tcard = deal()
    while debt and card["v"] < tcard:
        card, tcard = deal()
    for n in names:
        if card[n] < tcard:
            st(n, 0)["move"] = st(n, 0)["action"] = True   # took their turn before the Titan's card
    if debt:
        st("v", 0)["move"] = st("v", 0)["action"] = True   # spent in advance by an earlier Reaction
    first_counted = 0 if card["v"] > tcard else 1
    dodge_round = None
    A = sim_dice() if attack_dice is not None else None
    if victim_dodged == "roll":
        if A:
            tsucc = A.titan_roll(rng, attack_dice)
            if tsucc < 1:
                return False     # a whiff: no dodge is rolled, and the Grab does not land
            res = attr_roll(rng, v, "dodge", v.agi, 0, 0, "odm", push_to=tsucc)
            if not A.grab_net_lands(A.attack_net(tsucc, res["succ"])):
                return False
        else:
            res = attr_roll(rng, v, "dodge", v.agi, 0, 0, "odm", push_to=dodge_severity)
            if res["succ"] >= dodge_severity:
                return False
        dodge_round = spend_turn("v", 0)
    elif victim_dodged:
        while True:
            trial = make(victim_build, "v", **vo)
            trial.cis = list(v.cis)
            if A:
                tsucc = A.titan_roll(rng, attack_dice)
                if tsucc < 1:
                    continue
                res = attr_roll(rng, trial, "dodge", trial.agi, 0, 0, "odm", push_to=tsucc)
                if A.grab_net_lands(A.attack_net(tsucc, res["succ"])):
                    break
                continue
            res = attr_roll(rng, trial, "dodge", trial.agi, 0, 0, "odm", push_to=dodge_severity)
            if res["succ"] < dodge_severity:
                break
        v.stress, v.lasting = trial.stress, trial.lasting
        dodge_round = spend_turn("v", 0)
    if refund and rule == "d" and dodge_round is not None and dodge_round > first_counted:
        st("v", dodge_round)["move"] = st("v", dodge_round)["action"] = False
        st("v", first_counted)["move"] = st("v", first_counted)["action"] = True
    gain_ci(rng, v, "torso", cannot_be_lethal=True)
    arm = 1 if arm_wounded else 0          # Toughness 1: 0 Intact, 1 Wounded, 2 Broken
    for r in rs.values():
        if r.down:
            continue
        e = fear_roll(rng, r)
        if e["spend_action"]:
            spend_action(r.name, 0)
        for _ in range(e["spend_turns"]):
            spend_turn(r.name, 0)
    pos = {n: "in-reach" for n in rs}
    counted = 0
    lifted = False
    rnd = 0
    while True:
        if rnd > 0:
            card, tcard = deal()
        for c, n in sorted((card[n], n) for n in names):
            if rnd == 0 and c < tcard:
                continue
            x = st(n, rnd)
            if n == "v":
                counted += 1
                if counted == 1 and rule == "d":
                    x["action"] = True
                if not x["action"] and not v.down:
                    x["action"] = True
                    res = attr_roll(rng, v, "break-free", v.str, v.talents.get("break-free", 0), 0,
                                    "blade", push_to=bf_need, extra_pen=lift_penalty if lifted else 0)
                    if res["succ"] >= bf_need:
                        return False
                if counted == 1:
                    lifted = True
                else:
                    return True
            else:
                r = rs[n]
                if r.down or x["action"]:
                    continue
                if lifted and pos[n] == "in-reach":
                    if x["move"]:
                        continue
                    x["move"] = True
                    pos[n] = "on-body"
                x["action"] = True
                need = 2 - arm
                res = attr_roll(rng, r, "body-part-strike", r.str, r.talents.get("body-part-strike", 0), 0,
                                "blade", push_to=need, extra_pen=strike_penalty)
                if res["spend_turn"]:
                    spend_turn(n, rnd + 1)
                arm += min(res["succ"], need)
                if arm >= 2:
                    return False
        rnd += 1


def grab_cell(args):
    kw, trials, seed = args
    rng = random.Random(seed)
    return sum(grab_trial(rng, **kw) for _ in range(trials)) / trials


def run_parallel(fn, jobs, procs=10):
    with Pool(procs) as p:
        return p.map(fn, jobs)


if __name__ == "__main__":
    what = sys.argv[1]
    if what == "gas":
        print("gas medians 2 dice, 3 dice:", run_parallel(gas_cell, [(2, 200000, 1), (3, 200000, 2)]))
