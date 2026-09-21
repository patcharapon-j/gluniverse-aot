"""Measurement families on the one engine. Each job function takes (config, trials, seed), runs its trials
with random.Random(seed) (and an auxiliary stream for the procedures outside the card sequence), and returns
accumulators, so a family of millions of trials merges cheaply.

- fight: engine.Fight with the Squad policy, through the end of the Titan Engagement (every full-fight row,
  the bar, the full-fight Jam test at the Jam test's rounds, the ADR-0014 reports on full fights).
- lone: engine.Fight with one lone soldier (policy.lone_turn), stopping at the first Nape strike.
- solo: the fresh lone cut (tuning.yaml, solo_nape, model).
- grab: the Grab cell on engine.Fight (tuning.yaml, grab, model), with the victim, rescuers, earlier injuries,
  Squad Tactics, escapes, and Pry Loose a case names.
- dodge: one dodge against a number of Attack Dice, or at a fixed need for the historical figures tuning.yaml reports
  beside the targets (decision batch 8, 8-1).
- jam: the Jam test as tuning.yaml (jam_test) and OQ-96 read it: the holder alone, Help and Covering given.
- gas: canisters until empty on each Gas Roll's dice.
- sequence: one Squad through Titan Engagements and sessions, with the care windows, the interim issue, and
  promotion.
- shares: the move-up shares, driven through Titan.roll_nb and Titan.choose (not a job: exact enumeration).
- route: the lone soldier's legal route to the Nape, checked over every soldier state by search.
"""
import itertools
import math
import random
from collections import deque

from dice import make_build, make_free_build, make_template, roll, titan_roll, give_talent, take_damage
from dice import attack_net, grab_net_lands, first_answered
from engine import Fight, Titan, FixedDie, STAT_KEYS, SAFETY_CAP
from rules import R, D, IR, OB, BS
import policy as P

SQ = ("cis", "pc_cis", "deaths", "deaths_all", "pc_deaths_all", "end_deaths", "grabs")


def aux_for(seed):
    return random.Random(f"aux-{seed}")


def new_acc():
    return {"n": 0, "sum": {}, "sq": {}, "hist": {}}


def add(acc, key, v, sq=False):
    acc["sum"][key] = acc["sum"].get(key, 0) + v
    if sq:
        acc["sq"][key] = acc["sq"].get(key, 0) + v * v


def merge(a, b):
    if a is None:
        return b
    a["n"] += b["n"]
    for part in ("sum", "sq"):
        for k, v in b[part].items():
            a[part][k] = a[part].get(k, 0) + v
    for k, h in b["hist"].items():
        dst = a["hist"].setdefault(k, {})
        for x, c in h.items():
            dst[x] = dst.get(x, 0) + c
    return a


def hist(acc, key, x):
    h = acc["hist"].setdefault(key, {})
    h[x] = h.get(x, 0) + 1


def se_mean(acc, key):
    n = acc["n"]
    m = acc["sum"].get(key, 0) / n
    var = max(0.0, acc["sq"].get(key, 0) / n - m * m) * n / max(1, n - 1)
    return math.sqrt(var / n)


def pse(p, n):
    """Standard error, in points, of a percentage p measured on n trials."""
    q = max(0.0, min(100.0, p)) / 100
    return 100 * math.sqrt(q * (1 - q) / n) if n else 0.0


def median_from(h, n, none_value=99):
    xs = sorted(((none_value if k in (None, "none") else int(k)), c) for k, c in h.items())
    target = n // 2
    run = 0
    for x, c in xs:
        run += c
        if run > target:
            return x
    return xs[-1][0]


# ---------------------------------------------------------------------- fights
def fight_job(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    aux = aux_for(seed)
    acc = new_acc()
    for _ in range(n):
        st = Fight(rng, cfg, aux=aux).run()
        acc["n"] += 1
        for k in STAT_KEYS:
            add(acc, k, st[k], k in SQ)
        add(acc, "deaths_all", st["deaths"] + st["end_deaths"], True)
        add(acc, "pc_deaths_all", st["pc_deaths"] + st["pc_end_deaths"], True)
        add(acc, "jam_dodge_fight", 1 if st["jam_dodges"] else 0)
        add(acc, "lame_dodge_fight", 1 if st["lame_dodges"] else 0)
        add(acc, "jam_fight", 1 if st["jams"] else 0)
        hist(acc, "kill_round", st["kill_round"] if st["kill_round"] is not None else "none")
        # decision batch 16, 16-38: rounds to the first Nape strike, beside rounds to the kill
        hist(acc, "first_nape_round", st["first_nape_round"] if st["first_nape_round"] is not None else "none")
    return acc


def summarize_fight(acc):
    n = acc["n"]
    s = acc["sum"]
    h = acc["hist"]["kill_round"]
    killed_by = lambda r: 100 * sum(c for k, c in h.items() if k != "none" and int(k) <= r) / n
    # no kill: the Titan Engagement ends with the Focus Titan alive (decision batch 5, 5-10)
    p = h.get("none", 0) / n
    med = median_from(h, n)
    out = dict(fights=n, median=med, by2=killed_by(2), by3=killed_by(3), by4=killed_by(4),
               nokill=100 * p, nokill_se=100 * math.sqrt(p * (1 - p) / n),
               by3_se=pse(killed_by(3), n), grabs_se=se_mean(acc, "grabs"),
               cis_se=se_mean(acc, "cis"), pc_cis_se=se_mean(acc, "pc_cis"), deaths_se=se_mean(acc, "deaths"),
               deaths_all_se=se_mean(acc, "deaths_all"), pc_deaths_all_se=se_mean(acc, "pc_deaths_all"))
    # Minor 10: the shares that decide the median, with their standard errors
    if med < 99:
        before, at = killed_by(med - 1), killed_by(med)
        out.update(median_before=before, median_before_se=pse(before, n), median_at=at, median_at_se=pse(at, n),
                   median_on_boundary=abs(before - 50) <= 2 * pse(before, n) or abs(at - 50) <= 2 * pse(at, n))
    for k in STAT_KEYS + ("deaths_all", "pc_deaths_all"):
        out[k] = s.get(k, 0) / n
    for k in ("jam_dodge_fight", "lame_dodge_fight", "jam_fight"):
        out[k] = 100 * s.get(k, 0) / n
        out[k + "_se"] = pse(out[k], n)
    rounds = s.get("rounds", 0) or 1
    gr = s.get("grab_rounds", 0)
    out["cards_resolved_per_round"] = s.get("resolved", 0) / rounds
    out["decoy_cards_per_round"] = s.get("decoy_cards", 0) / rounds
    out["devour_share"] = 100 * s.get("devours", 0) / max(1, s.get("grabs", 0))
    out["grab_death_share"] = 100 * s.get("grab_deaths", 0) / max(1, s.get("grabs", 0))
    out["thrash_share"] = 100 * s.get("thrash", 0) / max(1, s.get("resolved", 0))
    # decision batch 13 (13-9, 13-10): the share of resolved cards whose entry retargeted down the Attention Ladder,
    # the share that found no soldier who met it and so fell back or Thrashed, and the share of behavior rolls the
    # Titan's Frenzy lifted off the face the die showed
    out["retarget_share"] = 100 * s.get("retargets", 0) / max(1, s.get("resolved", 0))
    out["retarget_miss_share"] = 100 * s.get("retarget_misses", 0) / max(1, s.get("resolved", 0))
    out["frenzy_lift_share"] = 100 * s.get("frenzy_lifts", 0) / max(1, s.get("nb_rolls", 0))
    # round-time counters, per round, and per round with a Grab and without one
    per = {"tracker_writes": "grab_round_writes", "ladder_evals": "grab_round_evals", "dodges": "grab_round_dodges",
           "fear_rolls": "grab_round_fears", "gas_rolls": "grab_round_gas"}
    rt = {}
    for k, gk in per.items():
        rt[k] = dict(per_round=s.get(k, 0) / rounds, grab_round=s.get(gk, 0) / gr if gr else None,
                     other_round=(s.get(k, 0) - s.get(gk, 0)) / max(1, rounds - gr))
    rt["pools"] = dict(per_round=s.get("pools", 0) / rounds, grab_round=s.get("grab_round_pools", 0) / gr if gr else None,
                       other_round=(s.get("pools", 0) - s.get("grab_round_pools", 0)) / max(1, rounds - gr))
    out["round_time"] = rt
    out["rounds_per_fight"] = s.get("rounds", 0) / n
    # decision batch 16, 16-38: the field's figures, as shares
    fn = acc["hist"].get("first_nape_round", {})
    out["median_first_nape_round"] = median_from(fn, n) if fn else None
    out["stride_reach_share"] = 100 * s.get("stride_reach", 0) / max(1, s.get("resolved", 0))
    out["flights_carry_share"] = 100 * s.get("flights_carry", 0) / max(1, s.get("flights", 0))
    out["bs_lost_share"] = 100 * s.get("bs_lost", 0) / n
    out["nape_help_adjacent_share"] = 100 * s.get("nape_helps_adjacent", 0) / max(1, s.get("nape_helps", 0))
    return out


# ---------------------------------------------------------------------- the lone fight
def setup_lone(f, cfg):
    s = make_build(cfg.get("build", "rookie"), "lone", stress=cfg.get("stress"))
    f.add(s, "lone", mounted=cfg.get("mounted", True))
    start = cfg.get("start", {})
    t = f.t
    if start.get("grounded"):
        leg = next(p for p in t.part_ids if t.kind[p] in R.grounding_kinds)
        t.state[leg] = R.broken
    for k in ("odm", "gas", "spares"):
        if k in start:
            setattr(s, k, start[k])
    if start.get("horse_gone"):
        s.horse_gone = True
        s.horse_zone = None
        s.mounted = False
    if "flares" in start:
        f.flares = start["flares"]
    return s


def lone_job(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    aux = aux_for(seed)
    acc = new_acc()
    for _ in range(n):
        f = Fight(rng, dict(cfg, stop_at_first_nape=True), squad=False, aux=aux)
        s = setup_lone(f, cfg)
        give_talent([s], cfg.get("talent"))   # a Talent sensitivity row (cases._talent_rows)
        st = f.run()
        L = f.lone
        acc["n"] += 1
        if L.get("struck"):
            end = "struck"
        elif L.get("end") == "no_decoy_usable":
            end = "no_decoy_usable"
        elif st["devours"]:
            end = "devoured"
        elif s.dead and not st["left_behind"]:
            end = "dead"
        elif st["left_behind"] or s.down:
            end = "down"
        elif L.get("end") == "retreat":
            end = "retreat"
        else:
            end = "other"
        hist(acc, "end", end)
        # where the soldier stood when the lone fight ended (Opus review 2, Minor 5)
        # (a devoured soldier is held On Body, so a Grab death is counted apart)
        hist(acc, "end_pos", "devoured" if end == "devoured" else ("dead at " if s.dead else "") + s.pos)
        add(acc, "dead_on_body_titan_standing", 1 if (s.dead and end != "devoured" and s.pos == OB and not f.t.dead) else 0)
        add(acc, "cards_against", st["resolved"])
        add(acc, "cards_spent", st["decoy_cards"])
        add(acc, "cis", st["cis"])
        add(acc, "dead", 1 if end in ("dead", "devoured") else 0)
        add(acc, "down", 1 if end == "down" else 0)
        add(acc, "jam", 1 if st["jams"] else 0)
        add(acc, "dry", 1 if (s.gas == 0 and s.spares == 0) else 0)
        for k in ("feints", "onfoot_feints", "repairs", "canisters", "decoys", "mounts", "flares"):
            add(acc, k, st[k])
        add(acc, "leg_cuts", L.get("leg_cuts", 0))
        add(acc, "gap_checks", L.get("gap_checks", 0))
        add(acc, "gap_checks_failed", L.get("gap_checks_failed", 0))
        add(acc, "gap_fight", 1 if L.get("gap_checks_failed") else 0)
        add(acc, "gap_grounded_fight", 1 if L.get("gap_grounded") else 0)
        add(acc, "onfoot_feint_fight", 1 if st["onfoot_feints"] else 0)
        if L.get("struck"):
            add(acc, "struck", 1)
            add(acc, "kill", 1 if L["kill"] else 0)
            add(acc, "stress_at_strike", L["stress_at_strike"])
            add(acc, "cards_before", L["cards_before"])
            add(acc, "cis_before", L["cis_before"])
            add(acc, "round_struck", L["round"])
            hist(acc, "round_struck", L["round"])
    return acc


def summarize_lone(acc):
    n = acc["n"]
    s = acc["sum"]
    k = s.get("struck", 0)
    h = acc["hist"].get("round_struck", {})
    out = dict(trials=n, usable_strike_share=100 * k / n,
               by_round={b: 100 * sum(c for r, c in h.items() if int(r) <= b) / n for b in (2, 3, 4, 6, 12)},
               median_round_struck=median_from(h, k) if k else None,
               mean_round_struck=s.get("round_struck", 0) / k if k else None,
               cards_before_strike=s.get("cards_before", 0) / k if k else None,
               stress_at_strike=s.get("stress_at_strike", 0) / k if k else None,
               kill_given_strike=100 * s.get("kill", 0) / k if k else None,
               kill_per_fight=100 * s.get("kill", 0) / n,
               ends={e: 100 * acc["hist"]["end"].get(e, 0) / n
                     for e in ("struck", "dead", "devoured", "down", "no_decoy_usable", "retreat", "other")})
    for key in ("cards_against", "cards_spent", "cis", "feints", "onfoot_feints", "repairs", "canisters", "decoys",
                "mounts", "flares", "gap_checks", "gap_checks_failed"):
        out[key] = s.get(key, 0) / n
    for key in ("dead", "down", "jam", "dry", "gap_fight", "gap_grounded_fight", "onfoot_feint_fight",
                "dead_on_body_titan_standing"):
        out[key] = 100 * s.get(key, 0) / n
    out["leg_cuts"] = s.get("leg_cuts", 0) / n
    out["end_positions"] = {k: 100 * c / n for k, c in sorted(acc["hist"].get("end_pos", {}).items())}
    return out


# ---------------------------------------------------------------------- the fresh lone cut
def solo_job(args):
    """tuning.yaml, solo_nape, model. Every trial is counted; a trial whose Break Attention rolls all fail, or whose
    ODM Gear Jams first, reaches no cut (Minor 12)."""
    cfg, n, seed = args
    rng = random.Random(seed)
    acc = new_acc()
    need = R.ba_needs["holder"]
    nd = cfg["nape_depth"]
    for _ in range(n):
        s = make_build(cfg["build"], "s", stress=cfg["stress"])
        acc["n"] += 1
        ok = False
        for _ in range(R.solo_attempts):
            res = roll(rng, s, "break-attention", gear="odm", push_to=need)
            s.odm = max(0, s.odm - res.gear_ones)
            if res.succ >= need:
                ok = True
                break
            if s.odm <= 0:
                break
        if not ok or not s.odm_working():
            continue
        add(acc, "cut", 1)
        res = roll(rng, s, "nape-strike", gear="blade", push_to=nd)
        add(acc, "hit", 1 if res.succ >= nd else 0)
    return acc


def summarize_solo(acc):
    n = acc["n"]
    cuts = acc["sum"].get("cut", 0)
    hit = 100 * acc["sum"].get("hit", 0) / max(1, cuts)
    return dict(trials=n, cuts=cuts, cut_share=100 * cuts / n, hit=hit, se=pse(hit, cuts))


# ---------------------------------------------------------------------- the Grab cell
def earlier_injury_row():
    """grab.health_reports, model: an untreated leg Critical Injury that gives no Break Free penalty. The first such
    row of the leg table (critical-injuries.yaml) that is not lethal, not Down, and not permanent."""
    for r in R.ci_tables["leg"]["rows"]:
        if not r["lethal"] and not r["down"] and not r["instant_death"] and not r["perm"] and "break-free" not in r["pen"]:
            return r
    raise ValueError("critical-injuries.yaml: no leg row fits the Health reports' earlier injury")


def cell_soldier(spec, name, **over):
    if spec.get("template"):
        s = make_template(spec["template"], name, **over)
    elif spec.get("free_build"):
        s = make_free_build(name, spec["free_build"], **over)     # decision batch 7, 7-1: Talent 2 on the roll named
    else:
        s = make_build(spec.get("build", "rookie"), name, **over)
    if spec.get("health"):
        s.health = spec["health"]
    if spec.get("pry_loose"):
        s.rule_talents.add("pry-loose")
    give_talent([s], spec.get("talent"))      # a Talent sensitivity row (cases._talent_rows)
    return s


def grab_trial(rng, aux, cfg):
    tactics = [P.TACTIC_IDS.get(x, x) for x in cfg.get("tactics", [])]
    # the Grab cell measures the Grab to its end, with no retreat clock (tuning.yaml, grab, model)
    f = Fight(rng, {"titan_id": cfg["titan_id"], "cell": True, "rescue_push": "free", "tactics": tactics,
                    "escapes": cfg.get("escapes", False), "pry": cfg.get("pry"), "retreat_clock": None},
              squad=False, aux=aux)
    t = f.t
    vspec = cfg.get("victim", {})
    v = f.add(cell_soldier(vspec, "v", **({"stress": vspec["stress"]} if "stress" in vspec else {})), "victim")
    v.pos = IR
    row = earlier_injury_row()
    for _ in range(cfg.get("earlier", 0)):
        # READING: a Crush leg injury on the left; its side and type change nothing, since the Grab's crush is torso
        v.cis.append({"row": row, "limit": row["limit"], "gained": 0, "treated": False, "scar_due": False,
                      "side": R.side_by_parity[1], "type": R.type_id("crush", "the Health reports' earlier injury")})
    v.check_down()
    cspec = cfg.get("comrade", {})
    for i in range(cfg["comrades"]):
        c = f.add(cell_soldier(cspec, f"c{i}", stress=cfg["witness_stress"], grief=cfg["grief"]), "cutter")
        c.pos = IR
    grab_id = next(eid for eid, e in t.entries.items() if any(x["type"] == "grab" for x in e["effects"]))
    dice = t.entries[grab_id]["attack_dice"]
    t.nb = grab_id
    f.rnd = 1
    events = f.deal(1)
    tc = f.tcards[0]
    for c, who in events:
        if who is not None and c < tc:
            who.turns += 1
            who.cur_move = who.cur_action = True
            who.card_passed = True
    t.holder = v
    first_counted = 1 if not v.card_passed else 2
    dodge_round = None
    if cfg["victim_dodged"] and not v.down:
        dodge_round = f.spend_turn(v)
        snap = (v.stress, set(v.lasting), v.odm, v.next_pen)
        # decision batch 8, 8-1: the cell reads a Grab that landed through a failed dodge, so the Titan's roll and the
        # dodge are drawn again until 1 or more net successes remain (grab.yaml, grab_lands, lands_on)
        while True:
            v.stress, v.lasting, v.odm, v.next_pen = snap[0], set(snap[1]), snap[2], snap[3]
            tsucc = titan_roll(rng, dice)
            if tsucc == 0:
                continue
            res = roll(rng, v, "dodge", gear="odm", push_to=tsucc)
            if grab_net_lands(attack_net(tsucc, res.succ)):
                break
        f.after_roll(v, res, "odm")
        v.dodge_succ = res.succ
    f.grab_lands(v, dodge_round, first_counted)
    f.lone["grabbed"] = True
    t.prev = grab_id
    t.decoys_in_a_row = 0
    f.clear_flags()
    t.nb = t.roll_nb(rng)
    rnd, ok = 1, (t.grab is not None and f.play_round(1, events=events, after=tc))
    while ok and rnd < SAFETY_CAP:
        rnd += 1
        ok = f.play_round(rnd)
    return v.dead or (t.grab is not None and not f.standing()), f.stats


def grab_job(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    aux = aux_for(seed)
    acc = new_acc()
    for _ in range(n):
        dead, st = grab_trial(rng, aux, cfg)
        acc["n"] += 1
        add(acc, "dead", 1 if dead else 0)
        for k in ("pry_rolls", "pry_frees", "ba_rescues", "tactic_uses"):
            add(acc, k, st[k])
    return acc


def summarize_grab(acc):
    n = acc["n"]
    p = 100 * acc["sum"].get("dead", 0) / n
    out = dict(trials=n, dead=p, se=pse(p, n))
    for k in ("pry_rolls", "pry_frees", "ba_rescues", "tactic_uses"):
        out[k] = acc["sum"].get(k, 0) / n
    return out


# ---------------------------------------------------------------------- the Skirmish probe
SKIRMISH_CAP = 40      # a model check, not a rule: rounds a Skirmish may run before it is counted and stopped
SKIRMISH_PUSH_TO = 2   # POLICY CHOICE: a soldier Pushes a Fight roll short of 2 successes, before the Guard is rolled


def skirmish_trial(rng, aux, cfg):
    """One Skirmish (data/skirmish/skirmish.yaml, foes.yaml; decision batch 7, 7-17; batch 8, 8-4, 8-7, 8-15), reported
    and not tuned. engine.Fight gives the harm, Death Rolls, Fear Rolls, Treat Injury, and the end steps; no Titan
    takes part. Rules as written: initiative cards for each soldier and one for the Foe group, the ambush's order,
    dice, and unanswered attacks; a Foe's Attack Dice on 6 against the soldier's Block (Fight only) or Dodge, one per
    Foe per round, cancelling one for one; a soldier's Fight against the Foe's Guard; damage the weapon's plus 1 per
    net success beyond the first, a Foe out at 0 (killed by Cut or Pierce, out cold otherwise), a soldier's damage
    through dice.take_damage with the weapon's type and its rider (plain rows for the "without the riders" cases);
    Grit and breaking; the foe rule's steps in order; the endings; a turn-limit Death Roll at the end of each of a
    soldier's turns, Down turns included; the first-human-kill Fear Roll. POLICY CHOICES: a Squad with no ambush
    given tries the Sneak with its first soldier; a soldier Treats the first comrade holding an untreated lethal
    Critical Injury on a turn limit, one treater a patient a round; otherwise closes in with the Foe with the lowest
    label still in and Fights it with the Blade Set, Pushing short of SKIRMISH_PUSH_TO; every attack with a success is
    answered by Block or Dodge, whichever pool is larger (Dodge against a Shoot); no Grapple, Parley, Size Up, or
    leaving."""
    SK = R.skirmish
    kind = SK["foes"][cfg["foe"]]
    plain = set() if cfg["riders"] else SK["riders_plain"]
    f = Fight(rng, {"titan_id": "reference-medium", "retreat_clock": None}, squad=False, aux=aux)
    count = 1 if cfg["squad"] == "one" else len(R.baseline_roles)
    for i in range(count):
        s = f.add(make_build("rookie", f"pc{i}"), "skirmisher")
        s.sk_acted, s.react, s.killed_person = False, {}, False
    st = dict(rounds=0, win=0, squad_down=0, cap=0, cis=0, cut_cis=0, pierce_cis=0, burn_cis=0, lethal_cuts=0,
              cut_death_rolls=0, foes_killed=0, foes_out_cold=0, foes_left=0, attacks=0, foe_attacks=0, landed_on_soldiers=0,
              reactions=0, treats=0, ambush_squad=0, ambush_foes=0)
    foes = []
    for i in range(cfg["number"]):
        if kind["fight_weapon"]:
            weapon = kind["fight_weapon"]
        else:
            r = rng.randint(1, 6)
            weapon = next(w for res, w in kind["fight_table"] if r in res)
            if cfg["night"] and kind["night"] and weapon == kind["night"]["replaces"]:
                weapon = kind["night"]["with"]
        foes.append(dict(label=i + 1, health=kind["health"], weapon=weapon, shoot=kind["shoot_weapon"],
                         loaded=bool(kind["shoot_weapon"]), out=None, left=False, engaged=set(), last=None, acted=False,
                         broken=False))
    side = None
    if cfg["ambush"] == "foes":
        side = "foes"
    elif cfg["ambush"] == "attempt":
        res = roll(rng, f.sold[0], "sneak", push_to=kind["watch"])
        side = "squad" if res.succ >= kind["watch"] else None
    st["ambush_squad" if side == "squad" else "ambush_foes"] += 1 if side else 0

    def in_play(fo):
        return fo["out"] is None and not fo["left"]

    def ended():
        return all(not in_play(fo) for fo in foes) or all(s.dead or s.down for s in f.sold)

    def break_check():
        if sum(1 for fo in foes if fo["out"]) >= kind["grit"]:
            for fo in foes:
                if in_play(fo) and not fo["broken"]:
                    fo["broken"] = True
                    fo["engaged"].clear()

    def harm_soldier(s, fo, w, net):
        st["landed_on_soldiers"] += 1
        wp = SK["weapons"][w]
        before = len(s.cis)
        row = take_damage(rng, s, wp["damage"] + SK["per_net"] * (net - 1), wp["type"], gained=s.turns,
                          plain=wp["type"] in plain)
        if row is not None:
            f.count_ci(s)
            if len(s.cis) > before:
                c = s.cis[-1]
                key = {"cut": "cut_cis", "pierce": "pierce_cis", "burn": "burn_cis"}.get(c["type"])
                if key:
                    st[key] += 1
                if c["type"] == "cut" and c["row"]["lethal"]:
                    st["lethal_cuts"] += 1
            f.after_harm(s, row)

    def foe_attack(fo, s, w):
        st["foe_attacks"] += 1
        wp = SK["weapons"][w]
        unanswered = side == "foes" and not s.sk_acted
        dice = kind["attack_dice"] + (SK["ambush_foe_dice"] if unanswered else 0)
        succ = sum(1 for _ in range(dice) if rng.randint(1, 6) >= SK["foe_face"])
        if succ == 0:
            return
        net = succ
        if not unanswered and not s.down and not s.dead and s.ban == 0:
            if fo["label"] in s.react:
                net = succ - s.react[fo["label"]]
            else:
                block_pool = s.a(R.entry_attribute["block"]) + s.gear_dice("blade")
                dodge_pool = s.a(R.entry_attribute["dodge"]) + s.gear_dice("odm")
                entry, gear = (("block", "blade") if wp["used_with"] == "fight" and block_pool >= dodge_pool
                               else ("dodge", "odm" if s.odm_working() else None))
                f.spend_turn(s)
                res = roll(rng, s, entry, gear=gear, push_to=succ)
                f.after_roll(s, res, gear)
                st["reactions"] += 1
                s.react[fo["label"]] = res.succ
                net = succ - res.succ
        if net >= SK["lands_on"]:
            harm_soldier(s, fo, w, net)

    def soldier_attack(s, fo):
        st["attacks"] += 1
        wp = SK["weapons"]["blade-set"]
        unanswered = side == "squad" and not fo["acted"]
        res = roll(rng, s, "fight", bonus=SK["ambush_soldier_dice"] if unanswered else 0, gear="blade",
                   push_to=SKIRMISH_PUSH_TO)
        f.after_roll(s, res, "blade")
        fo["last"] = s.name
        guard = 0 if unanswered else sum(1 for _ in range(kind["guard_dice"]) if rng.randint(1, 6) == R.success_face)
        net = res.succ - guard
        if net < SK["lands_on"]:
            return
        fo["health"] = max(0, fo["health"] - (wp["damage"] + SK["per_net"] * (net - 1)))
        if fo["health"] == 0:
            fo["out"] = "killed" if wp["type"] in SK["killed_by"] else "out-cold"
            fo["engaged"].clear()
            st["foes_killed" if fo["out"] == "killed" else "foes_out_cold"] += 1
            if fo["out"] == "killed" and not s.killed_person:
                s.killed_person = True
                f.fear(s, ("first-human-kill",))
            break_check()

    def soldier_turn(s, treated):
        s.turns += 1
        ban_started = s.ban > 0
        if not s.handles and s.blades > 0 and not s.down:
            s.handles = True
        if not s.down and not s.cur_action:
            patient = next(((p, c) for p in f.sold if p is not s and not p.dead and p.name not in treated
                            for c in p.untreated() if c["row"]["lethal"] and c["limit"] == "turn"), None)
            targets = sorted((fo for fo in foes if in_play(fo) and not fo["broken"]), key=lambda fo: fo["label"])
            if patient is not None:
                treated.add(patient[0].name)
                st["treats"] += 1
                f.treat(s, patient[0], "treat", patient[1])
            elif targets and s.handles:
                fo = next((x for x in targets if s.name in x["engaged"]), targets[0])
                fo["engaged"].add(s.name)
                s.cur_action = True
                soldier_attack(s, fo)
        st["cut_death_rolls"] += sum(1 for c in s.cis if not c["treated"] and c["limit"] == "turn" and c["gained"] < s.turns
                                     and c["type"] == "cut")
        f.death_rolls(s)
        s.sk_acted = True
        if ban_started and s.ban > 0:
            s.ban -= 1

    def foe_card():
        for fo in [x for x in foes if in_play(x) and not x["broken"]]:
            cands = [s for s in f.sold if not s.dead and not s.down]
            if not cands:
                break
            low = lambda xs: min(xs, key=lambda s: f.card.get(s.name, 99))    # noqa: E731
            last = next((s for s in cands if s.name == fo["last"]), None)
            engaged = [s for s in cands if s.name in fo["engaged"]]
            if engaged:
                foe_attack(fo, last if last in engaged else low(engaged), fo["weapon"])
                continue
            if fo["shoot"] and fo["loaded"]:
                tgt = SK["weapons"][fo["shoot"]]["target"]
                ok = [s for s in cands if tgt in ("either", "apart")]
                if ok:
                    fo["loaded"] = False
                    foe_attack(fo, last if last in ok else low(ok), fo["shoot"])
                    continue
            if fo["shoot"] and not fo["loaded"]:
                fo["loaded"] = True
                continue
            s = low(cands)
            fo["engaged"].add(s.name)
            foe_attack(fo, s, fo["weapon"])

    lo, hi = R.cards
    rnd = 0
    while not ended():
        rnd += 1
        if rnd > SKIRMISH_CAP:
            st["cap"] = 1
            break
        f.rnd = rnd
        alive = [s for s in f.sold if not s.dead]
        cards = rng.sample(range(lo, hi + 1), len(alive) + 1)
        events = [(cards[i], s) for i, s in enumerate(alive)] + [(cards[-1], None)]
        rank = (lambda e: (0 if (e[1] is None) == (side == "foes") else 1, e[0])) if rnd == 1 and side else (lambda e: e[0])
        events.sort(key=rank)
        f.card = {s.name: c for c, s in events if s is not None}
        for s in alive:
            s.cur_move = rnd in s.pre_turn
            s.cur_action = rnd in s.pre_turn or rnd in s.pre_action
            s.react = {}
        treated = set()
        for _, who in events:
            if who is None:
                foe_card()
                for fo in foes:
                    fo["acted"] = True
            elif not who.dead:
                soldier_turn(who, treated)
            if ended():
                break
        for fo in foes:
            if fo["broken"] and in_play(fo):
                fo["left"] = True
                st["foes_left"] += 1
    st["rounds"] = rnd
    st["win"] = 1 if all(not in_play(fo) for fo in foes) else 0
    st["squad_down"] = 1 if all(s.dead or s.down for s in f.sold) else 0
    deaths = f.stats["deaths"]
    if not st["cap"]:
        f.end_engagement()     # engagement-end.yaml, procedures, skirmish, read through the Titan Engagement steps
    st.update(deaths=deaths, deaths_all=deaths + f.stats["end_deaths"],
              pierce_untreated_end=sum(1 for s in f.sold if not s.dead for c in s.untreated() if c["type"] == "pierce"),
              cis=f.stats["cis"])
    return st


def skirmish_job(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    aux = aux_for(seed)
    acc = new_acc()
    for _ in range(n):
        st = skirmish_trial(rng, aux, cfg)
        acc["n"] += 1
        for k, v in st.items():
            add(acc, k, v, k in ("deaths_all", "cis"))
    return acc


def summarize_skirmish(acc):
    n = acc["n"]
    s = acc["sum"]
    out = {k: s.get(k, 0) / n for k in s}
    for k in ("win", "squad_down", "cap", "ambush_squad", "ambush_foes"):
        out[k] = 100 * out.get(k, 0)
    out["trials"] = n
    out["deaths_all_se"] = se_mean(acc, "deaths_all")
    out["cut_death_rolls_per_lethal_cut"] = s.get("cut_death_rolls", 0) / s["lethal_cuts"] if s.get("lethal_cuts") else None
    return out


# ---------------------------------------------------------------------- one dodge
def dodge_job(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    acc = new_acc()
    for _ in range(n):
        s = make_template(cfg["template"], "d", stress=cfg["stress"]) if cfg.get("template") else \
            make_build(cfg.get("build", "rookie"), "d", stress=cfg["stress"])
        acc["n"] += 1
        if "needs" in cfg:
            # the historical fixed-need figure tuning.yaml keeps beside the targets
            res = roll(rng, s, "dodge", gear="odm", push_to=cfg["needs"], responses=cfg["responses"])
            add(acc, "ok", 1 if res.succ >= cfg["needs"] else 0)
            continue
        # decision batch 8, 8-1: a card of cfg dice Attack Dice; ok is a card that does not land (a whiff, or a dodge
        # that cancels every success), whiff the share with no Titan success
        tsucc = titan_roll(rng, cfg["dice"])
        if tsucc == 0:
            add(acc, "ok", 1)
            add(acc, "whiff", 1)
            continue
        res = roll(rng, s, "dodge", gear="odm", push_to=tsucc, responses=cfg["responses"])
        add(acc, "ok", 1 if res.succ >= tsucc else 0)
    return acc


def summarize_rate(acc, key):
    n = acc["n"]
    p = 100 * acc["sum"].get(key, 0) / n
    return dict(trials=n, rate=p, se=pse(p, n))


# ---------------------------------------------------------------------- the Jam test, as the probes read it
def jam_job(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    acc = new_acc()
    reading = cfg["reading"]
    mounted = reading == "mounted"
    tcfgs = cfg["titan_cfgs"]
    for _ in range(n):
        titans = [Titan(dict(c)) for c in tcfgs]
        s = make_build("rookie", "holder")
        pos, gear = (D, "horse") if mounted else (IR, "odm")
        jammed = 0
        for _ in range(R.jam_rounds):
            for t in titans:
                # decision batch 8, 8-1: each card rolls its Attack Dice (every card at the kill pool in the kill
                # reading, the upper bound); the holder's one dodge against this Titan this round answers the first
                # card with 1 or more successes, and no dodge is rolled when every card whiffs
                rolls = []
                for _ in range(t.tempo):
                    t.nb = t.roll_nb(rng)
                    beh = t.choose(pos)
                    t.prev = beh
                    kill_dice = max(e["attack_dice"] for e in t.entries.values() if e["tier"] == "kill")
                    rolls.append(titan_roll(rng, kill_dice if reading == "kill" else (t.entries[beh].get("attack_dice") or 0)))
                first = first_answered(rolls)
                if first is None:
                    continue
                res = roll(rng, s, "dodge", bonus=cfg["help"], gear=gear, push_to=first, cover=cfg["cover"] or None)
                if mounted:
                    s.horse -= res.gear_ones
                    if s.horse <= 0:
                        jammed = 1
                else:
                    s.odm -= res.gear_ones
                    if s.odm <= 0:
                        jammed = 1
                if jammed:
                    break
            if jammed:
                break
            # round.yaml, end_steps, frenzy (decision batch 13, 13-10): the Jam test's rounds are rounds, so every
            # living Focus Titan's Frenzy rises here and the next round's behavior rolls read it
            for t in titans:
                if t.frenzy < R.frenzy_cap:
                    t.frenzy += 1
        acc["n"] += 1
        add(acc, "jammed", jammed)
    return acc


# ---------------------------------------------------------------------- gas
def gas_job(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    acc = new_acc()
    for _ in range(n):
        g, rounds = R.full_gas, 0
        while g > 0:
            rounds += 1
            g -= sum(1 for _ in range(cfg["dice"]) if rng.randint(1, 6) == 1)
        acc["n"] += 1
        add(acc, "rounds", rounds)
        hist(acc, "rounds", rounds)
    return acc


# ---------------------------------------------------------------------- treatment and the interim issue over a sequence
def interim_issue(s, supply):
    """standard-issue.yaml, receiving, steps, with interim_issue's differences, and squad-supply.yaml, stock: ODM
    Gear replaced only when its rating is below the row's (worn or Jammed Gear is kept); canisters refilled and
    spares to the row; Blade Sets to the row; a lame, worn, or lower-rated horse replaced; Squad Supply restocked."""
    row = R.issue
    if s.odm_max < row["odm_gear_rating"]:
        s.odm_max = s.odm = row["odm_gear_rating"]
    s.gas = R.full_gas
    s.spares = max(s.spares, row["spare_canisters"])
    s.blades = max(s.blades, row["blade_sets"])
    s.handles = s.blades > 0
    if s.horse_gone or s.horse == 0 or s.horse < s.horse_max or s.horse_max < row["horse_rating"]:
        s.horse_max = s.horse = max(s.horse_max, row["horse_rating"])
    s.horse_gone = False
    for kind in ("flares", "medical"):
        supply[kind] = max(supply[kind], R.supply[kind])


def promote(players, pool, rng):
    """squadmates.yaml, promotion, contested: every affected player chooses a living Squadmate at the same time
    (policy.promotion_choice); two or more on the same one each roll a D6, the highest takes it, ties roll again;
    the players who lose choose again from the Squadmates no player has taken. Returns, for each player in order,
    the Squadmate taken or None (no_squadmate)."""
    taken = {}
    left = list(range(players))
    while left:
        free = [s for s in pool if all(s is not t for t in taken.values())]
        if not free:
            break
        choices = {p: P.promotion_choice(free)[0] for p in left}
        for sm in dict.fromkeys(choices.values()):
            want = [p for p in left if choices[p] is sm]
            while len(want) > 1:
                rolls = {p: rng.randint(1, 6) for p in want}
                top = max(rolls.values())
                want = [p for p in want if rolls[p] == top]
            taken[want[0]] = sm
        left = [p for p in left if p not in taken]
    return [taken.get(p) for p in range(players)]


def sequence_job(args):
    """PROVISIONAL (OQ-116): no Phase 1 rule says how many Titan Engagements a session holds. A sequence is cfg
    sessions of cfg fights_per_session Titan Engagements. At the start of each session after the first, one day
    passes (healing.yaml, day_passes, interim; decision batch 5, 5-2, and 5b, 5-16: engine.Fight.day_passes, with
    its care window over every soldier in the Squad and Field Repair), then promotion replaces a player character
    the day killed, and the interim issue follows.

    Rules as written between the fights: every living soldier in the Squad takes part in each Titan Engagement,
    Down or not (positions.yaml, placement, who_takes_part). At retirement-and-promotion (engagement-end.yaml)
    retiring soldiers leave, and every player character who died or retired is replaced, as one batch, by
    promoting a living Squadmate through the contest (squadmates.yaml, promotion); the promoted soldier keeps its
    state and follows every player character rule, and no rule adds a Squadmate in its place. A player with no
    Squadmate left creates a new character, who joins at the start of the next Titan Engagement, since no Expedition
    is under way (promotion, no_squadmate; decision batch 7, 7-11). Readings no rule gives (report section 6.11): the
    new character is the reference Rookie; the promotion's Lifepath rolls (Origin, Why You Enlisted, Training Years)
    are not made, so a promoted Squadmate gains no Talent levels; and a Titan Engagement in which no player
    character takes part is not played."""
    cfg, n, seed = args
    rng = random.Random(seed)
    aux = aux_for(seed)
    acc = new_acc()
    fcfg = dict(cfg["fight"])
    roles = list(R.baseline_roles)     # data/engagement/tuning.yaml, prepared_squad_kill, model, squad
    kit = fcfg.get("kit")

    def replace(prefix, squad, waiting):
        """retirement-and-promotion (engagement-end.yaml) and a day's promotion (squadmates.yaml, promotion): every
        player character who died or retired is replaced, as one batch, by a living Squadmate or a waiting player."""
        gone = [role for s, role in squad if s.pc and (s.dead or s.retiring)]
        squad = [(s, role) for s, role in squad if not s.dead and not s.retiring]
        got = promote(len(gone), [s for s, _ in squad if not s.pc], aux)
        add(acc, f"{prefix}_gone", len(gone))
        for role, sm in zip(gone, got):
            if sm is None:
                waiting.append(role)
                add(acc, f"{prefix}_waiting", 1)
                continue
            sm.pc = True
            squad = [(s, role if s is sm else r) for s, r in squad]
            add(acc, f"{prefix}_promoted", 1)
        return squad

    for trial in range(n):
        squad = [(make_build("rookie", f"pc{i}", kit=kit), role) for i, role in enumerate(roles)]
        squad += [(make_build("rookie", f"sm{i}", pc=False, kit=kit), "helper") for i in range(fcfg.get("squadmates", 0))]
        give_talent([s for s, _ in squad], cfg.get("talent"))    # a Talent sensitivity row (cases._talent_rows)
        supply = {"flares": R.supply["flares"], "medical": R.supply["medical"]}
        waiting = []          # the roles of players whose new character joins at the next Titan Engagement's start
        k = 0
        acc["n"] += 1
        for sess in range(cfg["sessions"]):
            if sess:
                # the interim day, before the interim issue (healing.yaml, day_passes, interim)
                day = Fight(aux, dict(fcfg, squadmates=0, retreat_clock=None), squad=False, aux=aux, supply=supply)
                for s, role in squad:
                    day.add(s, role)
                day.day_passes()
                dst = day.stats
                for key, name in (("day_death_rolls", "day_death_rolls"), ("day_deaths", "day_deaths"),
                                  ("pc_day_deaths", "pc_day_deaths"), ("healed", "day_healed"),
                                  ("day_health_restored", "day_health_restored"), ("care_saves", "day_care_saves"),
                                  ("care_repairs", "day_care_repairs")):
                    add(acc, f"f{k + 1}_{name}", dst[key])
                squad = replace(f"f{k + 1}_day", squad, waiting)
                for s, _ in squad:
                    interim_issue(s, supply)
            for _ in range(cfg["fights_per_session"]):
                k += 1
                # squadmates.yaml, promotion, no_squadmate (decision batch 7, 7-11): with no Expedition under way the
                # new character joins, with Standard Issue, at the start of the next Titan Engagement
                for j, role in enumerate(waiting):
                    squad.append((make_build("rookie", f"new{k}-{j}", kit=kit), role))
                add(acc, f"f{k}_joined", len(waiting))
                waiting = []
                part = list(squad)
                add(acc, f"f{k}_fighters", len(part))
                add(acc, f"f{k}_pcs", sum(1 for s, _ in part if s.pc))
                add(acc, f"f{k}_untreated_start", sum(len(s.untreated()) for s, _ in part))
                add(acc, f"f{k}_jammed_start", sum(1 for s, _ in part if s.odm == 0))
                add(acc, f"f{k}_worn_start", sum(1 for s, _ in part if s.odm < s.odm_max))
                add(acc, f"f{k}_lame_start", sum(1 for s, _ in part if s.horse == 0 or getattr(s, "horse_gone", False)))
                add(acc, f"f{k}_down_start", sum(1 for s, _ in part if s.down))
                add(acc, f"f{k}_stress_start", sum(s.stress for s, _ in part) / max(1, len(part)))
                if not any(s.pc for s, _ in part):
                    add(acc, f"f{k}_not_played", 1)
                    continue
                f = Fight(rng, dict(fcfg, squadmates=0), squad=False, aux=aux, supply=supply)
                for s, role in part:
                    s.role = role
                    f.add(s, role, mounted=bool(fcfg.get("mounted_start")))
                st = f.run()
                add(acc, f"f{k}_pc_cis", st["pc_cis"])
                add(acc, f"f{k}_cis", st["cis"])
                add(acc, f"f{k}_deaths_all", st["deaths"] + st["end_deaths"])
                add(acc, f"f{k}_pc_deaths_all", st["pc_deaths"] + st["pc_end_deaths"])
                add(acc, f"f{k}_killed", 1 if st["kill_round"] is not None else 0)
                add(acc, f"f{k}_care_saves", st["care_saves"])
                add(acc, f"f{k}_care_repairs", st["care_repairs"])
                add(acc, f"f{k}_retreats", st["retreats"])
                add(acc, f"f{k}_left_behind", st["left_behind"])
                squad = replace(f"f{k}", squad, waiting)
    acc["meta"] = {"fights": cfg["sessions"] * cfg["fights_per_session"]}
    return acc


def summarize_sequence(acc):
    n = acc["n"]
    s = acc["sum"]
    fights = max(int(k.split("_")[0][1:]) for k in s if k.startswith("f"))
    rows = []
    for k in range(1, fights + 1):
        rows.append({key: s.get(f"f{k}_{key}", 0) / n for key in
                     ("fighters", "pcs", "untreated_start", "jammed_start", "worn_start", "lame_start", "down_start",
                      "stress_start", "not_played", "pc_cis", "cis", "deaths_all", "pc_deaths_all", "killed",
                      "care_saves", "care_repairs", "gone", "promoted", "waiting", "joined", "retreats", "left_behind",
                      "day_death_rolls", "day_deaths", "pc_day_deaths", "day_healed", "day_health_restored",
                      "day_care_saves", "day_care_repairs", "day_gone", "day_promoted", "day_waiting")})
    return dict(sequences=n, fights=rows)


# ---------------------------------------------------------------------- move-up shares
def share_report(titan_id):
    """data/engagement/behavior-procedure.yaml, next_behavior, move_up_shares; data/titans/tuning.yaml, targets,
    every_standard_table. Every previous behavior with every count of Broken eyes, arms, and legs: Titan.roll_nb
    is driven through each of the six results (FixedDie), so the move-up and the Thrash fallback are the
    engine's own. The Grab and lethal counts read each entry's effects; the In Reach count asks Titan.choose
    whether a holder at In Reach meets the entry's Position requirement."""
    base = Titan({"titan_id": titan_id})
    kinds = {}
    for p in base.part_ids:
        kinds[base.kind[p]] = kinds.get(base.kind[p], 0) + 1
    order = [k for k in ("eyes", "arm", "leg")]
    for k in kinds:
        if k not in order:
            raise ValueError(f"{titan_id}: Body Part kind {k} is not one the share states name")
    entries = [e for e in base.entries.values() if e["tier"] != "thrash"]
    prevs = [None, base.thrash] + [e["id"] for e in entries]
    worst, worst_state, min_legal, no_legal = -1.0, None, 99, None
    by_prev, by_broken, states = {}, {}, 0
    for prev in prevs:
        for counts in itertools.product(*[range(kinds.get(k, 0) + 1) for k in order]):
            broken = dict(zip(order, counts))
            t = Titan({"titan_id": titan_id})
            t.break_parts(broken)
            t.prev = prev
            got = {}
            for face in range(1, 7):
                eid = t.roll_nb(FixedDie(face))
                got[eid] = got.get(eid, 0) + 1
            kill = sum(c for eid, c in got.items() if eid != t.thrash and t.entries[eid]["tier"] == "kill") / 6
            legal = sum(1 for e in entries if e["id"] != prev and t.parts_ok(e))
            states += 1
            if kill > worst:
                worst, worst_state = kill, {"previous": prev, "broken": broken}
            if legal < min_legal:
                min_legal, no_legal = legal, {"previous": prev, "broken": broken}
            shares = {eid: round(c / 6, 3) for eid, c in sorted(got.items())}
            if not any(counts):
                by_prev[str(prev)] = {"shares": shares, "kill_share": round(kill, 3)}
            if prev is None:
                key = ", ".join(f"{k} {v}" for k, v in broken.items() if v) or "none"
                by_broken[key] = {"shares": shares, "kill_share": round(kill, 3)}
    grab = sum(len(e["results"]) for e in entries if any(x["type"] == "grab" for x in e["effects"]))
    lethal = sum(len(e["results"]) for e in entries
                 if any(x["type"] == "critical-injury" and not x["cannot_be_lethal"] for x in e["effects"]))
    in_reach = 0
    for e in entries:
        t = Titan({"titan_id": titan_id})
        t.nb = e["id"]
        if t.choose(IR) == e["id"]:
            in_reach += len(e["results"])
    return dict(max_kill_share=round(worst, 3), worst_state=worst_state, min_legal_entries=min_legal,
                no_legal_state=no_legal, by_previous_behavior=by_prev, by_broken_parts=by_broken, states=states,
                grab_results=grab, lethal_results=lethal, in_reach_results=in_reach, abnormal=base.abnormal)


# ---------------------------------------------------------------------- the lone route
def route_check(ratings=("open", "wooded")):
    """ADR-0010 as amended (decision batches 3c-2 and 3e-2): Break Attention is available in every state in
    which a Nape strike is legal, outside a retreat.

    A lone soldier's state is (grounded, Position, ODM Gear not Jammed, gas left, spare canister, mounted,
    where the dismounted soldier's horse stands or "gone"). The states checked are those reachable from a
    fight's start (Distant, full kit, mounted or on foot beside the horse) under the soldier's own acts
    (every step anchor-ratings.yaml allows by the kind the soldier can make, mounting a horse at their
    Position, Change Canister, Field Repair) and under harm (a Jam, running dry, losing or leaving the horse,
    a fall from On Body or Blind Spot to where falls.yaml lands it, and the Titan becoming grounded or
    standing again, with grounding's end at Open moving Blind Spot to On Body). The Titan is Medium-sized;
    no Titan card and no retreat act. A state is a gap when a Nape strike is legal in it (Blind Spot, not
    mounted, working ODM Gear or a grounded Titan) but no sequence of the soldier's own acts, with the
    Titan unchanged, reaches a state where a Feint can be named (attention.yaml, decoys, feint: In Reach or
    On Body, with working ODM Gear, mounted on a sound horse, or on foot against a grounded Titan) from
    which a Nape strike is still reachable."""
    horses = ("gone", D, IR)
    out = {}
    for rating in ratings:
        fights = {}
        for grounded in (False, True):
            f = Fight(random.Random(0), {"titan_id": "standard-medium", "terrain": rating}, squad=False)
            if grounded:
                leg = next(p for p in f.t.part_ids if f.t.kind[p] in R.grounding_kinds)
                f.t.state[leg] = R.broken
            fights[grounded] = f

        def acts(st):
            g, pos, odm, gas, spare, mounted, horse = st
            f = fights[g]
            nxt = []
            for to in R.positions:
                if to == pos:
                    continue
                kinds = f.step_kinds(pos, to)
                if mounted and "mounted" in kinds:
                    nxt.append((g, to, odm, gas, spare, True, "gone"))
                left = pos if mounted else horse
                if left not in horses:
                    left = "gone"
                if "foot" in kinds:
                    nxt.append((g, to, odm, gas, spare, False, left))
                if "odm" in kinds and odm and gas:
                    nxt.append((g, to, odm, gas, spare, False, left))
            if not mounted and horse == pos:
                nxt.append((g, pos, odm, gas, spare, True, "gone"))
            if spare and not gas:
                nxt.append((g, pos, odm, 1, 0, mounted, horse))
            if not odm:
                nxt.append((g, pos, 1, gas, spare, mounted, horse))
            return nxt

        def harms(st):
            g, pos, odm, gas, spare, mounted, horse = st
            nxt = [(g, pos, 0, gas, spare, mounted, horse), (g, pos, odm, 0, spare, mounted, horse)]
            if mounted:
                nxt.append((g, pos, odm, gas, spare, False, "gone"))
                nxt.append((g, pos, odm, gas, spare, False, pos if pos in horses else "gone"))
            elif horse != "gone":
                nxt.append((g, pos, odm, gas, spare, False, "gone"))
            if pos in R.fall_high and not mounted:
                nxt.append((g, R.fall_lands, odm, gas, spare, False, horse))
            if g:
                a, b = R.grounded_end_move
                to = b if (rating == R.grounded_extra_rating and pos == a) else pos
                nxt.append((False, to, odm, gas, spare, mounted, horse))
            elif not mounted:
                nxt.append((True, pos, odm, gas, spare, mounted, horse))
            return nxt

        def closure(start, *steps):
            seen = set(start)
            q = deque(start)
            while q:
                x = q.popleft()
                for fn in steps:
                    for y in fn(x):
                        if y not in seen:
                            seen.add(y)
                            q.append(y)
            return seen

        def strike(st):
            g, pos, odm, gas, spare, mounted, horse = st
            return pos == BS and not mounted and bool((odm and gas) or g)

        def feint(st):
            g, pos, odm, gas, spare, mounted, horse = st
            return pos in R.feint_positions and bool((odm and gas) or mounted or g)

        starts = [(False, D, 1, 1, 1, True, "gone"), (False, D, 1, 1, 1, False, D)]
        reachable = closure(starts, acts, harms)
        for g in (False, True):
            legal = [st for st in reachable if st[0] == g and strike(st)]
            gaps = []
            for st in legal:
                own = closure([st], acts)
                if not any(feint(y) and any(strike(z) for z in closure([y], acts)) for y in own):
                    gaps.append(st)
            out[f"{rating}_{'grounded' if g else 'standing'}"] = dict(
                reachable_states=sum(1 for st in reachable if st[0] == g), strike_legal_states=len(legal),
                gaps=len(gaps), examples=[[str(x) for x in st] for st in gaps[:5]])
    return out
