"""Full lone-fight model: the reference Rookie alone against the reference Medium Titan, Wooded.

Rules as written in Chapters 1, 3, 4, 5 and data/engagement after decision batch 3:
- cards face up, one each, random order; the Titan is Tempo 1, Nape Depth 4;
- the Behavior Table procedure (move-up, no repeats, fallbacks to Thrash, Position requirements);
- the lone soldier always holds Attention, so needs 1 + decoys spent (attention.yaml needs_rule);
- decoys: the horse (mounted or at the soldier's Position; no cost on failure, bolts on success),
  2 flares (Funding 3 Squad Supply, spent when declared), 1 cloak (from Blind Spot, spent when
  declared); a decoy holds until the Titan's next card, which then resolves nothing;
- a Nape strike needs Blind Spot, not holding Attention, working ODM Gear; Str 4 + Talent 1 +
  Blade Set 1 + Stress Dice, needs 4, Pushing when short; own Openings never spent;
- the dodge is Agility 3 with ODM Gear 2 (or the horse while mounted), needing Severity, and
  spends the soldier's earliest wholly unspent turn (Chapter 1, section 1.9); one per Titan per round;
- Push: +1 Stress, Stress Responses from data/mind/stress-responses.yaml, Gear Dice showing 1
  on a Pushed roll wear the item; ODM Gear at 0 Jams (fall if airborne); Gas Roll 2 dice (3 after a
  Pushed ODM roll), running dry stops ODM moves and strikes; 1 spare canister (Change Canister is an action);
- Critical Injuries from data/harm/critical-injuries.yaml crossing Health 4 boxes; falls from
  data/gear/falls.yaml (high band from On Body or Blind Spot); Down ends the lone fight;
- the Grab: torso crush, first counted turn's action spent, lift, one Break Free at -2 (need 2),
  devour at the end of the second counted turn; the holding Titan's cards resolve nothing.

Policy (the "lone line"): stay at Distant (only Roar reaches there) until a round in which the
Titan's card comes first; then move to In Reach and Break Attention with the horse (or a flare
once the horse is gone); if the decoy is still holding when the soldier's next turn comes (their
card is first that round), fly to Blind Spot and strike. If the Titan's card spends the decoy
first, attempt again from In Reach on the next Titan-first round (need +1), and on a soldier-first
round pull back to Distant. "cloak_line": once the horse is gone, fly to Blind Spot on a Titan-first
round and throw the flare or cloak from there, so a usable success needs no move; on a soldier-first
round at Blind Spot, hold the turn and dodge the knock-loose with it.
The trial ends at the first usable Nape strike, or when the soldier is dead, Down, or has no
decoy left with no decoy holding, or at the round horizon.
"""
import random
import statistics
import sys
from multiprocessing import Pool

sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
from core_local import make, attr_roll, gain_ci, fall_damage, d6  # noqa: E402

ALL = {"distant", "in-reach", "on-body", "blind-spot"}
TABLE = {
    "roar": dict(tier="terrorize", req=ALL, arms=0, eff="stress"),
    "lunge": dict(tier="terrorize", req={"in-reach", "on-body"}, arms=0, eff="stress"),
    "swat": dict(tier="control", req={"in-reach", "on-body"}, arms=1, eff="ci-nonlethal"),
    "shake": dict(tier="control", req={"on-body", "blind-spot"}, arms=0, eff="knock"),
    "grab": dict(tier="kill", req={"in-reach", "on-body"}, arms=1, eff="grab"),
    "bite": dict(tier="kill", req={"in-reach", "on-body"}, arms=0, eff="ci-lethal"),
    "thrash": dict(tier="control", req=ALL, arms=0, eff="knock"),
}
BY_RES = {1: "roar", 2: "lunge", 3: "swat", 4: "shake", 5: "grab", 6: "bite"}
SEV = {"terrorize": 1, "control": 2, "kill": 3}
ND = 4


class Lone:
    def __init__(self, rng, cfg):
        self.rng = rng
        self.cfg = cfg
        s = make("rookie", stress=cfg.get("stress", 1))
        s.pos = "distant"
        s.mounted = cfg.get("mounted", True)
        s.airborne = False
        s.grabbed = False
        s.pre_turn, s.pre_action = set(), set()
        s.cur_move = s.cur_action = False
        s.turns = 0
        s.dodge_succ = None
        s.odm_used = s.odm_pushed = False
        s.ban = 0
        s.flares = cfg.get("flares", 2)
        s.cloak = cfg.get("cloak", True)
        s.horse_here = True
        s.horse_lame = False
        for c in s.cis:
            c["gained"] = -1
        self.s = s
        self.prev = None
        self.nb = self.roll_nb()
        self.decoy = False
        self.decoys_spent = 0
        self.last_card_decoyed = False
        self.grab = None
        self.rnd = 0
        self.t_first = False
        self.st = dict(struck=False, kill=False, rounds=None, cards_against=0, cards_spent=0, harmful_landed=0,
                       cis=0, falls=0, grabs=0, dead=False, down=False, jam=False, dry=False, exhausted=False,
                       ba_attempts=0, ba_succ=0, wasted=0, dodges=0, stress_at_strike=None, end="horizon",
                       cards_before_strike=None, cis_before_strike=None)

    # ------------------------------------------------------------ helpers
    def roll_nb(self):
        r = d6(self.rng)
        for i in range(6):
            e = BY_RES[(r - 1 + i) % 6 + 1]
            if e != self.prev:
                return e
        return "thrash"

    def spend_turn(self, s):
        if not s.cur_move and not s.cur_action:
            s.cur_move = s.cur_action = True
            return self.rnd
        r = self.rnd + 1
        while r in s.pre_turn or r in s.pre_action:
            r += 1
        s.pre_turn.add(r)
        return r

    def end(self, why):
        self.st["end"] = why
        self.done = True

    def fall(self, s, band=None):
        if band is None:
            band = "high" if s.pos in ("on-body", "blind-spot") else "low"
        high = s.pos in ("on-body", "blind-spot")
        s.airborne = False
        s.mounted = False
        self.st["falls"] += 1
        n = len(s.cis)
        row = fall_damage(self.rng, s, band)
        if row is not None:
            self.st["cis"] += 1
            self.after_harm(s, row)
        if high and not s.dead:
            s.pos = "in-reach"
        if s.down and not s.dead:
            self.st["down"] = True
            self.end("down")

    def after_harm(self, s, row):
        if row == "dead":
            s.dead = True
            self.st["dead"] = True
            self.end("dead")
            return
        for c in s.cis:
            if "gained" not in c:
                c["gained"] = s.turns
        if s.down:
            self.st["down"] = True
            self.end("down")

    def odm_after(self, s, res):
        s.odm_used = True
        if res["pushed"]:
            s.odm_pushed = True
        if res["gear_ones"]:
            was = s.odm
            s.odm = max(0, s.odm - res["gear_ones"])
            if s.odm == 0 and was > 0:
                self.st["jam"] = True
                if s.airborne:
                    self.fall(s)
        if res["spend_turn"]:
            self.spend_turn(s)

    def horse_after(self, s, res):
        if res["pushed"] and res["gear_ones"]:
            s.horse = max(0, s.horse - res["gear_ones"])
            if s.horse == 0:
                s.horse_lame = True
                if s.mounted:
                    s.mounted = False
                    self.fall(s, "low")
        if res["spend_turn"]:
            self.spend_turn(s)

    def death_rolls(self, s):
        for c in list(s.cis):
            if s.dead:
                return
            if c["limit"] == "turn" and c.get("gained", -1) < s.turns:
                n = max(1, s.str - c["row"]["dr_pen"])
                succ = sum(1 for _ in range(n) if d6(self.rng) == 6)
                if succ == 0:
                    s.dead = True
                    self.st["dead"] = True
                    self.end("dead")
                    return
                if succ >= 2:
                    c["limit"] = "engagement"

    # ------------------------------------------------------------ Break Attention
    def need(self):
        extra = self.decoys_spent if self.cfg.get("escalate", True) else 0
        return (2 if self.grab else 1) + extra

    def blocked(self):
        """The rejected decoy cap: no Break Attention on a Titan whose most recent card a decoy spent."""
        return self.cfg.get("cap", False) and self.last_card_decoyed

    def horse_usable(self, s):
        return s.horse_here and not s.horse_lame and (s.mounted or s.pos in ("distant", "in-reach"))

    def pick_decoy(self, s):
        if self.horse_usable(s):
            return "horse"
        if s.flares > 0:
            return "flare"
        if s.cloak and s.pos in ("on-body", "blind-spot"):
            return "cloak"
        return None

    def any_decoy_left(self, s):
        return self.horse_usable(s) or s.flares > 0 or (s.cloak and self.cfg.get("cloak_line", False))

    def break_attention(self, s, decoy):
        need = self.need()
        s.cur_action = True
        self.st["ba_attempts"] += 1
        if decoy == "flare":
            s.flares -= 1
        elif decoy == "cloak":
            s.cloak = False
        if decoy == "horse":
            gear = "horse"
        elif s.odm_working():
            gear = "odm"
        elif self.horse_usable(s):
            gear = "horse"
        else:
            gear = "none"
        res = attr_roll(self.rng, s, "break-attention", s.per, 0, 0, gear, push_to=need)
        if gear == "odm":
            self.odm_after(s, res)
        elif gear == "horse":
            self.horse_after(s, res)
        elif res["spend_turn"]:
            self.spend_turn(s)
        if res["succ"] >= need and not self.done:
            self.st["ba_succ"] += 1
            self.decoy = True
            self.decoys_spent += 1
            if decoy == "horse":
                s.mounted = False
                s.horse_here = False
            if self.grab:
                self.release()
            return True
        return False

    # ------------------------------------------------------------ the Titan's card
    def titan_card(self):
        s = self.s
        if self.grab:
            return
        if self.decoy:
            self.decoy = False
            self.prev = self.nb
            self.nb = self.roll_nb()
            self.st["cards_spent"] += 1
            self.last_card_decoyed = True
            return
        self.last_card_decoyed = False
        self.st["cards_against"] += 1
        e = self.nb
        beh = e if s.pos in TABLE[e]["req"] else "thrash"
        info = TABLE[beh]
        sev = SEV[info["tier"]]
        eff = info["eff"]
        policy = self.cfg.get("dodge", "harm")
        if policy == "harm":
            harmful = eff in ("ci-nonlethal", "ci-lethal", "grab") or (eff == "knock" and (s.airborne or s.pos in ("on-body", "blind-spot")))
        else:
            harmful = eff in ("ci-lethal", "grab")
        avoided = False
        dodge_round = None
        if s.dodge_succ is not None:
            avoided = s.dodge_succ >= sev
        elif harmful and not s.down and not s.grabbed and s.ban == 0:
            dodge_round = self.spend_turn(s)
            gear = "horse" if s.mounted and not s.horse_lame else "odm"
            res = attr_roll(self.rng, s, "dodge", s.agi, 0, 0, gear, push_to=sev)
            self.st["dodges"] += 1
            if gear == "odm":
                self.odm_after(s, res)
            else:
                self.horse_after(s, res)
            s.dodge_succ = res["succ"]
            avoided = res["succ"] >= sev
        if self.done:
            return
        if not avoided:
            if eff == "stress":
                s.stress += 1
            elif eff in ("ci-nonlethal", "ci-lethal"):
                self.st["harmful_landed"] += 1
                row = gain_ci(self.rng, s, None, cannot_be_lethal=(eff == "ci-nonlethal"))
                self.st["cis"] += 1
                self.after_harm(s, row)
                if not self.done and s.airborne and s.down:
                    self.fall(s)
            elif eff == "knock":
                if s.airborne or s.pos in ("on-body", "blind-spot"):
                    self.st["harmful_landed"] += 1
                    self.fall(s)
            elif eff == "grab":
                self.st["harmful_landed"] += 1
                # the soldier's first counted turn is this round's if their card has not come yet (Titan first)
                fc = self.rnd if self.t_first else self.rnd + 1
                if dodge_round is not None and dodge_round > fc:
                    s.pre_turn.discard(dodge_round)
                    if fc == self.rnd:
                        s.cur_move = s.cur_action = True
                    else:
                        s.pre_turn.add(fc)
                self.grab_lands(s)
        self.prev = beh
        self.nb = self.roll_nb()

    def grab_lands(self, s):
        row = gain_ci(self.rng, s, "torso", cannot_be_lethal=True)
        self.st["cis"] += 1
        self.st["grabs"] += 1
        self.after_harm(s, row)   # Down in the hand ends the lone fight (no one to free them)
        self.grab = {"counted": 0, "lifted": False}
        s.grabbed = True
        s.pos = "on-body"
        s.airborne = False
        s.mounted = False

    def release(self):
        s = self.s
        g = self.grab
        self.grab = None
        s.grabbed = False
        if g["lifted"]:
            s.pos = "on-body"
            self.fall(s)
        else:
            s.pos = "in-reach"

    # ------------------------------------------------------------ the soldier's turn
    def can_nape(self, s):
        return s.pos == "blind-spot" and not s.grabbed and s.handles and not s.cur_action and s.odm_working()

    def nape(self, s):
        s.cur_action = True
        res = attr_roll(self.rng, s, "nape-strike", s.str, s.talents.get("nape-strike", 0), 0, "blade", push_to=ND)
        self.st["struck"] = True
        self.st["rounds"] = self.rnd
        self.st["stress_at_strike"] = s.stress
        self.st["cards_before_strike"] = self.st["cards_against"]
        self.st["cis_before_strike"] = self.st["cis"]
        self.st["kill"] = res["succ"] >= ND
        self.end("struck")

    def move(self, s, to, kind):
        s.cur_move = True
        s.pos = to
        if kind == "odm":
            s.airborne = True
            s.odm_used = True
            s.mounted = False
        else:
            s.airborne = False
            if kind == "foot":
                s.mounted = False

    def soldier_turn(self):
        s = self.s
        s.turns += 1
        ban_started = s.ban > 0
        cloak_line = self.cfg.get("cloak_line", False)
        if s.grabbed:
            g = self.grab
            g["counted"] += 1
            if g["counted"] == 1:
                s.cur_action = True
            if not s.cur_action and not s.down:
                s.cur_action = True
                res = attr_roll(self.rng, s, "break-free", s.str, s.talents.get("break-free", 0), 0, "blade",
                                push_to=2, extra_pen=2 if g["lifted"] else 0)
                if res["pushed"] and res["gear_ones"]:
                    s.blades -= 1
                    s.handles = False
                if res["succ"] >= 2:
                    self.release()
            self.death_rolls(s)
            if self.done:
                return
            if self.grab:
                if g["counted"] == 1:
                    g["lifted"] = True
                else:
                    s.dead = True
                    self.st["dead"] = True
                    self.end("devoured")
            self.end_turn(s, ban_started)
            return
        if not s.handles and s.blades > 0:
            s.handles = True
        if self.decoy:
            # a usable moment: the Titan's card has not come yet this round
            if self.can_nape(s):
                self.nape(s)
                return
            if s.pos == "in-reach" and not s.cur_move and s.odm_working():
                self.move(s, "blind-spot", "odm")
                if self.can_nape(s):
                    self.nape(s)
                    return
            # cannot use it (turn spent, dry, Jammed, or too far): fall through to the default
        if s.gas == 0 and s.spares > 0 and not s.cur_action and not self.decoy:
            s.spares -= 1
            s.gas = 3
            s.cur_action = True
        if s.pos == "distant":
            if self.t_first and not s.cur_move and not s.cur_action and not self.decoy and not self.blocked():
                d = "horse" if self.horse_usable(s) else ("flare" if s.flares > 0 else None)
                if d is None and not (cloak_line and s.cloak):
                    self.st["exhausted"] = True
                    self.end("exhausted")
                    return
                self.move(s, "in-reach", "mounted" if s.mounted else "foot")
                if d is not None:
                    self.break_attention(s, d)
                # cloak only: fly to Blind Spot and throw it on the next Titan-first round
        elif s.pos == "in-reach":
            if self.t_first and not s.cur_action and not self.decoy and not self.blocked():
                d = "horse" if self.horse_usable(s) else ("flare" if s.flares > 0 else None)
                if cloak_line and d != "horse" and not s.cur_move and s.odm_working() and (s.flares > 0 or s.cloak):
                    self.move(s, "blind-spot", "odm")
                    d = "flare" if s.flares > 0 else "cloak"
                    self.break_attention(s, d)
                elif d is not None:
                    self.break_attention(s, d)
                else:
                    self.st["exhausted"] = True
                    self.end("exhausted")
                    return
            elif not self.t_first and not s.cur_move and not self.decoy:
                self.move(s, "distant", "mounted" if s.mounted else "foot")
        elif s.pos == "blind-spot":
            if self.t_first and not s.cur_action and not self.decoy and not self.blocked():
                d = "flare" if s.flares > 0 else ("cloak" if s.cloak else None)
                if d is None:
                    self.st["exhausted"] = True
                    self.end("exhausted")
                    return
                self.break_attention(s, d)
            # soldier-first round: hold the whole turn and dodge the knock-loose with it
        self.death_rolls(s)
        self.end_turn(s, ban_started)

    def end_turn(self, s, ban_started):
        if ban_started and s.ban > 0:
            s.ban -= 1

    # ------------------------------------------------------------ the fight
    def run(self):
        s = self.s
        self.done = False
        max_rounds = self.cfg.get("max_rounds", 12)
        for rnd in range(1, max_rounds + 1):
            self.rnd = rnd
            sc, tc = self.rng.sample(range(1, 21), 2)
            self.t_first = tc < sc
            s.cur_move = rnd in s.pre_turn
            s.cur_action = rnd in s.pre_turn or rnd in s.pre_action
            s.dodge_succ = None
            s.odm_used = s.odm_pushed = False
            for who in (("t", "s") if self.t_first else ("s", "t")):
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
    return [Lone(rng, cfg).run() for _ in range(n)]


def summarize(res):
    n = len(res)
    struck = [r for r in res if r["struck"]]
    k = len(struck)
    out = dict(
        trials=n,
        usable_strike_share=round(100 * k / n, 1),
        by_round={b: round(100 * sum(1 for r in struck if r["rounds"] <= b) / n, 1) for b in (2, 3, 4, 6, 12)},
        median_round_struck=statistics.median([r["rounds"] for r in struck]) if struck else None,
        mean_round_struck=round(statistics.mean([r["rounds"] for r in struck]), 2) if struck else None,
        cards_before_strike=round(statistics.mean([r["cards_before_strike"] for r in struck]), 2) if struck else None,
        cis_before_strike=round(statistics.mean([r["cis_before_strike"] for r in struck]), 3) if struck else None,
        stress_at_strike=round(statistics.mean([r["stress_at_strike"] for r in struck]), 2) if struck else None,
        kill_given_strike=round(100 * sum(1 for r in struck if r["kill"]) / k, 1) if struck else None,
        kill_per_fight=round(100 * sum(1 for r in struck if r["kill"]) / n, 1),
        ends={e: round(100 * sum(1 for r in res if r["end"] == e) / n, 1) for e in ("struck", "dead", "devoured", "down", "exhausted", "horizon")},
        cards_against_per_fight=round(statistics.mean([r["cards_against"] for r in res]), 2),
        cards_spent_by_decoys=round(statistics.mean([r["cards_spent"] for r in res]), 2),
        cis_per_fight=round(statistics.mean([r["cis"] for r in res]), 3),
        falls=round(statistics.mean([r["falls"] for r in res]), 3),
        grabs=round(statistics.mean([r["grabs"] for r in res]), 3),
        dodges=round(statistics.mean([r["dodges"] for r in res]), 2),
        deaths=round(100 * sum(1 for r in res if r["dead"]) / n, 1),
        downs=round(100 * sum(1 for r in res if r["down"]) / n, 1),
        jams=round(100 * sum(1 for r in res if r["jam"]) / n, 1),
        ba_attempts=round(statistics.mean([r["ba_attempts"] for r in res]), 2),
        ba_succ=round(statistics.mean([r["ba_succ"] for r in res]), 2),
        rounds_played=round(statistics.mean([r["rounds_played"] for r in res]), 2),
    )
    return out


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    return summarize([r for part in parts for r in part])


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 200000
    cases = [
        ("In Reach line, NO escalation (rule before batch 3)", dict(escalate=False)),
        ("In Reach line, no escalation + rejected decoy cap", dict(escalate=False, cap=True)),
        ("In Reach line, escalation + rejected decoy cap", dict(cap=True)),
        ("Blind Spot line, no escalation", dict(cloak_line=True, escalate=False)),
    ]
    for i, (label, cfg) in enumerate(cases):
        print(label)
        print("   ", run_many(cfg, n, 30 + i), flush=True)
