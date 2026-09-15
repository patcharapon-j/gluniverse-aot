"""Full lone-fight model: the reference Rookie alone against one Focus Titan, Wooded, until the retreat clock fills.

The Fable review's model of the Chapters 1 to 5 conformance review round 1 (tools/probes/batch-3b/lone.py),
with decision batch 3b's switches built in (tools/probes/batch-3b/lone_b3b.py and lone_t2_b3b.py), on this
directory's dice core. With the defaults it plays the rule as revised in batch 3b against the reference
Medium Titan (data/engagement/tuning.yaml, simulation_reference_titan).

Rules (Chapters 1, 3, 4, and 5):
- cards face up, one for the soldier and Tempo for the Titan, in random order;
- the Behavior Table procedure: move-up with no back-to-back repeats, each entry's Position requirement
  and fallback (Thrash if the fallback repeats or fails), its Severity, and its effects in order (a
  target who dies or goes Down receives none of the card's later effects); the lone soldier breaks no
  Body Part, so no entry is ever blocked by one;
- the lone soldier always holds Attention, so Break Attention needs 1 (2 while Grabbed), plus the decoys
  in a row (attention.yaml, break_attention, needs_rule), plus 1 for a Feint;
- decoys: the horse (mounted, or at the soldier's Position; nothing spent on failure, bolts on success),
  2 flares (Funding 3 Squad Supply, spent when declared), 1 cloak (from Blind Spot, spent when declared),
  and the Feint (from In Reach or On Body with working ODM Gear, or mounted on a horse that is not lame;
  spends nothing, repeatable);
- a decoy holds for as many of the Titan's next cards as its Tempo; each of those cards resolves nothing
  and spends the Next Behavior;
- a Nape strike needs Blind Spot, not holding Attention, and working ODM Gear: Strength 4, Talent 1,
  Blade Set 1, and Stress Dice, needing the Nape Depth, Pushing when short, own Openings never spent;
- the dodge: Agility 3 with ODM Gear 2 (or the horse while mounted), needing the Severity, spending the
  earliest wholly unspent turn, one per Titan per round, its successes compared with later cards;
- Push: +1 Stress, Stress Responses, Gear Dice showing 1 on a Pushed roll wear the item, ODM Gear at 0
  Jams (a fall if airborne); the Gas Roll (2 dice, 3 after a Pushed ODM roll), running dry, 1 spare;
- Critical Injuries crossing Health 4 boxes, falls, turn-limit Death Rolls; Down ends the lone fight;
- the Grab: torso crush, the first counted turn's action spent, the lift, one Break Free at a 2-die
  penalty after the lift (needing 2), the devour at the end of the second counted turn, and a failed
  dodge's later turn given back;
- start_fear: the Titan's start calls for one Fear Roll (the abnormal Fear Roll), made before round 1;
- Change Canister and Field Repair (decision batch 3c, 3c-3): a dry soldier who carries a spare changes it as
  their action, and a Jammed soldier with gas left or a spare takes Field Repair as their action (Wits 2 alone,
  no tool kit, needing 1, Pushed when short, each success restoring 1 point of the current rating; retried on
  a later turn). Both count as a usable Feint at a round's end, because the soldier's own turn restores it.

Policy, the waiting line ("last"): stay at Distant until a round in which every card of the Titan has
already come up; then move to In Reach and Break Attention with the horse, then a flare, then the Feint;
if the decoy still holds when the soldier's next turn comes, fly to Blind Spot and cut. If the Titan's
card spends the decoy first, attempt again from In Reach on the next such round, and pull back to Distant
on a round in which the soldier's card comes first. The hurried line ("after_first") attempts once at
least one of the Titan's cards has come up; at Tempo 1 the two lines are the same. Dodge every harming
behavior ("harm") or only Grabs and lethal Critical Injuries ("kill").

A trial ends at the first usable Nape strike, or when the soldier is dead, Down, or has no decoy usable with
none holding (no_decoy_usable: out of horse and flares, no sound horse under them, and a harness that is dry
with no spare, or Jammed with no gas and no spare to repair toward; against a standing Titan that is also a
state in which no Nape strike is legal), or when the retreat clock is full (decision batch 5, 5-10: 8 segments, one
filled at the end of each round; under the retreat the forced move comes before the action, 5-1, so no Nape
strike is legal after it, and the escape itself is not modelled). retreat_clock None keeps the 12-round horizon
(max_rounds) the lone fight ran with before batch 5. The Titan is never grounded here, so the on-foot Feint
against a grounded Titan never arises.

Switches (cfg): esc "reset" (the rule: decoys in a row), "perm" (batch 3's rule: the count never resets),
"none"; feint (True); feint_extra (1); cap (the rejected decoy cap); hold "tempo" (the rule) or "card";
tempo (1); nd (4); entries (a Behavior Table in data/titans format; the reference table if absent);
policy "last" or "after_first"; stress (1); dodge "harm" or "kill"; retreat_clock (8; None: max_rounds, 12); flares (2);
cloak (True); mounted (True); cloak_line (False); start_fear (False); spare (True: a dry soldier with a spare
still has the Feint; False, batch 3b's check); repair (True: Field Repair for a Jammed soldier; False, batch
3b's model); wits (2).

Run from this directory: uv run --with pyyaml python lone.py [trials]
"""
import os
import random
import statistics
import sys
from multiprocessing import Pool

sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from core import make, attr_roll, gain_ci, fall_damage, fear_roll, d6, sim_dice  # noqa: E402

DEFAULT_RETREAT_CLOCK = 8   # data/engagement/engagement-setup.yaml, retreat_clock (decision batch 5, 5-10)

ALL = ["distant", "in-reach", "on-body", "blind-spot"]
CLOSE_REACH = ["in-reach", "on-body"]

# The reference Medium Titan's table (data/engagement/tuning.yaml, simulation_reference_titan), in the
# data/titans entry format. Thrash takes the control Severity.
REFERENCE_ENTRIES = [
    {"id": "roar", "results": [1], "position_requirement": ALL, "severity": 1,
     "effects": [{"type": "stress", "amount": 1}], "fallback": "thrash"},
    {"id": "lunge", "results": [2], "position_requirement": CLOSE_REACH, "severity": 1,
     "effects": [{"type": "stress", "amount": 1}], "fallback": "thrash"},
    {"id": "swat", "results": [3], "position_requirement": CLOSE_REACH, "severity": 2,
     "effects": [{"type": "critical-injury", "injury_location": "rolled", "cannot_be_lethal": True}], "fallback": "thrash"},
    {"id": "shake-off", "results": [4], "position_requirement": ["on-body", "blind-spot"], "severity": 2,
     "effects": [{"type": "knock-loose"}], "fallback": "thrash"},
    {"id": "grab", "results": [5], "position_requirement": CLOSE_REACH, "severity": 3,
     "effects": [{"type": "grab"}], "fallback": "thrash"},
    {"id": "bite", "results": [6], "position_requirement": CLOSE_REACH, "severity": 3,
     "effects": [{"type": "critical-injury", "injury_location": "rolled", "cannot_be_lethal": False}], "fallback": "thrash"},
    {"id": "thrash", "results": [], "position_requirement": ALL, "severity": 2,
     "effects": [{"type": "knock-loose"}], "fallback": "none"},
]


class Lone:
    def __init__(self, rng, cfg):
        self.rng = rng
        self.cfg = cfg
        entries = cfg.get("entries") or REFERENCE_ENTRIES
        self.entries = {e["id"]: e for e in entries}
        self.by_result = {r: e["id"] for e in entries for r in e["results"]}
        self.tempo = cfg.get("tempo", 1)
        self.nd = cfg.get("nd", 4)
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
        self.decoy_left = 0
        self.decoys_spent = 0
        self.last_card_decoyed = False
        self.grab = None
        self.rnd = 0
        self.t_first = False
        self.done = False
        self.st = dict(struck=False, kill=False, rounds=None, cards_against=0, cards_spent=0, harmful_landed=0,
                       cis=0, falls=0, grabs=0, dead=False, down=False, jam=False, dry=False, no_decoy_usable=False,
                       ba_attempts=0, ba_succ=0, feints=0, wasted=0, dodges=0, stress_at_strike=None, end="horizon",
                       cards_before_strike=None, cis_before_strike=None, repairs=0, repair_rolls=0)

    # ------------------------------------------------------------ helpers
    def roll_nb(self):
        r = d6(self.rng)
        for i in range(6):
            e = self.by_result[(r - 1 + i) % 6 + 1]
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

    def spend_action(self, s):
        if not s.cur_action:
            s.cur_action = True
            return
        r = self.rnd + 1
        while r in s.pre_turn or r in s.pre_action:
            r += 1
        s.pre_action.add(r)

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
    def need(self, decoy=None):
        esc = self.cfg.get("esc", "reset")
        extra = self.decoys_spent if esc in ("perm", "reset") else 0
        base = (2 if self.grab else 1) + extra
        if decoy == "feint":
            base += self.cfg.get("feint_extra", 1)
        return base

    def blocked(self):
        """The rejected decoy cap: no Break Attention on a Titan whose most recent card a decoy spent."""
        return self.cfg.get("cap", False) and self.last_card_decoyed

    def horse_usable(self, s):
        return s.horse_here and not s.horse_lame and (s.mounted or s.pos in ("distant", "in-reach"))

    def repairable(self, s):
        """A Jammed harness that Field Repair can bring back into use: gas left, or a spare to change to."""
        return self.cfg.get("repair", True) and s.odm == 0 and (s.gas > 0 or s.spares > 0)

    def feint_usable(self, s):
        """The Feint's requirement at In Reach or On Body: working ODM Gear, or mounted on a sound horse. With
        spare, a dry harness with a spare in hand counts (Change Canister comes on the soldier's turn); with
        repair, a Jammed harness Field Repair can restore counts."""
        if not self.cfg.get("feint", True):
            return False
        if s.odm_working() or (s.mounted and s.horse_here and not s.horse_lame):
            return True
        if self.cfg.get("spare", True) and s.odm > 0 and s.gas == 0 and s.spares > 0:
            return True
        return self.repairable(s)

    def choose(self, s):
        if self.horse_usable(s):
            return "horse"
        if s.flares > 0:
            return "flare"
        if self.feint_usable(s):
            return "feint"
        return None

    def any_decoy_left(self, s):
        return (self.horse_usable(s) or s.flares > 0 or (s.cloak and self.cfg.get("cloak_line", False))
                or self.feint_usable(s))

    def break_attention(self, s, decoy):
        need = self.need(decoy)
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
        elif self.horse_usable(s) or (s.mounted and s.horse_here and not s.horse_lame):
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
            if decoy == "feint":
                self.st["feints"] += 1
            self.decoy = True
            self.decoys_spent += 1
            self.decoy_left = self.tempo if self.cfg.get("hold", "tempo") == "tempo" else 1
            if decoy == "horse":
                s.mounted = False
                s.horse_here = False
            if self.grab:
                self.release()
            return True
        return False

    # ------------------------------------------------------------ the Titan's card
    def titan_card(self):
        if self.grab:
            return
        holding = self.decoy
        if holding:
            self.decoy_left -= 1
        before = self.st["cards_against"]
        self.resolve_card()
        if holding and self.decoy_left > 0 and not self.done:
            self.decoy = True
        if self.cfg.get("esc", "reset") == "reset" and self.st["cards_against"] > before:
            self.decoys_spent = 0

    def choose_entry(self, pos):
        e = self.entries[self.nb]
        if pos in e["position_requirement"]:
            return self.nb
        fb = e["fallback"]
        if fb in ("thrash", "none") or fb == self.prev:
            return "thrash"
        if pos in self.entries[fb]["position_requirement"]:
            return fb
        return "thrash"

    def harmful(self, s, effects):
        policy = self.cfg.get("dodge", "harm")
        for eff in effects:
            if eff["type"] == "grab":
                return True
            if eff["type"] == "critical-injury" and (policy == "harm" or not eff["cannot_be_lethal"]):
                return True
            if (policy == "harm" and eff["type"] == "knock-loose"
                    and (s.airborne or s.pos in ("on-body", "blind-spot"))):
                return True
        return False

    def resolve_card(self):
        s = self.s
        if self.decoy:
            self.decoy = False
            self.prev = self.nb
            self.nb = self.roll_nb()
            self.st["cards_spent"] += 1
            self.last_card_decoyed = True
            return
        self.last_card_decoyed = False
        self.st["cards_against"] += 1
        beh = self.choose_entry(s.pos)
        entry = self.entries[beh]
        # An entry with attack_dice (a Chapter 6 table; decision batch 8, 8-1 and 8-2) rolls them as Titan Dice and
        # resolves on net successes through sim_dice(), as the simulator does; an entry with a fixed severity is
        # Chapter 5's committed model, unchanged.
        A = sim_dice() if "attack_dice" in entry else None
        sev = A.titan_roll(self.rng, entry["attack_dice"]) if A else entry["severity"]
        effects = entry["effects"]
        avoided = False
        dodge_round = None
        if s.dodge_succ is not None:
            avoided = s.dodge_succ >= sev
        elif (not A or sev >= 1) and self.harmful(s, effects) and not s.down and not s.grabbed and s.ban == 0:
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
        net = A.attack_net(sev, s.dodge_succ) if A else None
        if A:
            avoided = net < 1
        if self.done:
            return
        if not avoided:
            for eff in effects:
                if self.done:
                    break
                typ = eff["type"]
                if typ == "stress":
                    s.stress += eff["amount"]
                elif typ == "critical-injury":
                    self.st["harmful_landed"] += 1
                    loc = None if eff["injury_location"] == "rolled" else eff["injury_location"]
                    row = gain_ci(self.rng, s, loc, cannot_be_lethal=eff["cannot_be_lethal"],
                                  rider=A.ci_rider(net) if A else 0)
                    self.st["cis"] += 1
                    self.after_harm(s, row)
                    if not self.done and s.airborne and s.down:
                        self.fall(s)
                elif typ == "knock-loose":
                    if s.airborne or s.pos in ("on-body", "blind-spot"):
                        self.st["harmful_landed"] += 1
                        self.fall(s)
                elif typ == "grab":
                    if A and not A.grab_net_lands(net):
                        continue
                    self.st["harmful_landed"] += 1
                    # the first counted turn is this round's if the soldier's card has not come yet
                    fc = self.rnd if not self.card_passed else self.rnd + 1
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
        res = attr_roll(self.rng, s, "nape-strike", s.str, s.talents.get("nape-strike", 0), 0, "blade", push_to=self.nd)
        self.st["struck"] = True
        self.st["rounds"] = self.rnd
        self.st["stress_at_strike"] = s.stress
        self.st["cards_before_strike"] = self.st["cards_against"]
        self.st["cis_before_strike"] = self.st["cis"]
        self.st["kill"] = res["succ"] >= self.nd
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
        if self.repairable(s) and not s.grabbed and not s.down and not s.cur_action and not self.decoy:
            # Field Repair on the soldier's own ODM Gear (data/gear/field-repair.yaml), before anything else
            self.st["repair_rolls"] += 1
            res = attr_roll(self.rng, s, "field-repair", self.cfg.get("wits", 2), 0, 0, "none", push_to=1)
            s.cur_action = True
            if res["spend_turn"]:
                self.spend_turn(s)
            if res["succ"] >= 1:
                s.odm = min(s.odm_max, res["succ"])
                self.st["repairs"] += 1
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
            # a usable moment: the decoy still holds on the soldier's turn
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
                d = self.choose(s)
                if d is None and not (cloak_line and s.cloak):
                    self.st["no_decoy_usable"] = True
                    self.end("no_decoy_usable")
                    return
                self.move(s, "in-reach", "mounted" if s.mounted else "foot")
                if d is not None:
                    self.break_attention(s, d)
        elif s.pos == "in-reach":
            if self.t_first and not s.cur_action and not self.decoy and not self.blocked():
                d = self.choose(s)
                if cloak_line and d != "horse" and not s.cur_move and s.odm_working() and (s.flares > 0 or s.cloak):
                    self.move(s, "blind-spot", "odm")
                    d = "flare" if s.flares > 0 else "cloak"
                    self.break_attention(s, d)
                elif d is not None:
                    self.break_attention(s, d)
                else:
                    self.st["no_decoy_usable"] = True
                    self.end("no_decoy_usable")
                    return
            elif not self.t_first and not s.cur_move and not self.decoy:
                self.move(s, "distant", "mounted" if s.mounted else "foot")
        elif s.pos == "blind-spot":
            if self.t_first and not s.cur_action and not self.decoy and not self.blocked():
                d = "flare" if s.flares > 0 else ("cloak" if s.cloak else None)
                if d is None:
                    self.st["no_decoy_usable"] = True
                    self.end("no_decoy_usable")
                    return
                self.break_attention(s, d)
            # soldier-first round: hold the whole turn and dodge the knock-loose with it
        self.death_rolls(s)
        self.end_turn(s, ban_started)

    def end_turn(self, s, ban_started):
        if ban_started and s.ban > 0:
            s.ban -= 1

    # ------------------------------------------------------------ the fight
    def start_fear(self):
        """engagement-flow.yaml, starting: the start's Fear Roll, with spent actions and turns landing on round 1."""
        s = self.s
        s.cur_move = s.cur_action = True
        e = fear_roll(self.rng, s)
        if e["spend_action"]:
            self.spend_action(s)
        for _ in range(e["spend_turns"]):
            self.spend_turn(s)
        if e["no_react"]:
            s.ban = max(s.ban, 2 if e["spend_turns"] == 2 else 1)
        s.cur_move = s.cur_action = False

    def run(self):
        s = self.s
        self.done = False
        clock = self.cfg.get("retreat_clock", DEFAULT_RETREAT_CLOCK)
        max_rounds = self.cfg.get("max_rounds", 12) if clock is None else clock
        if clock is not None:
            self.st["end"] = "retreat"   # the end if nothing ends the lone fight before the retreat clock is full
        tempo = self.tempo
        policy = self.cfg.get("policy", "last")
        if self.cfg.get("start_fear", False):
            self.start_fear()
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
            self.card_passed = False
            events = sorted([(sc, "s")] + [(c, "t") for c in tcs])
            for _, who in events:
                if who == "t":
                    self.titan_card()
                else:
                    self.soldier_turn()
                    self.card_passed = True
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
                self.st["no_decoy_usable"] = True
                self.end("no_decoy_usable")
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
    return dict(
        trials=n,
        usable_strike_share=round(100 * k / n, 1),
        by_round={b: round(100 * sum(1 for r in struck if r["rounds"] <= b) / n, 1) for b in (2, 3, 4, 6, 8, 12)},
        median_round_struck=statistics.median([r["rounds"] for r in struck]) if struck else None,
        mean_round_struck=round(statistics.mean([r["rounds"] for r in struck]), 2) if struck else None,
        cards_before_strike=round(statistics.mean([r["cards_before_strike"] for r in struck]), 2) if struck else None,
        cis_before_strike=round(statistics.mean([r["cis_before_strike"] for r in struck]), 3) if struck else None,
        stress_at_strike=round(statistics.mean([r["stress_at_strike"] for r in struck]), 2) if struck else None,
        kill_given_strike=round(100 * sum(1 for r in struck if r["kill"]) / k, 1) if struck else None,
        kill_per_fight=round(100 * sum(1 for r in struck if r["kill"]) / n, 1),
        ends={e: round(100 * sum(1 for r in res if r["end"] == e) / n, 1)
              for e in ("struck", "dead", "devoured", "down", "no_decoy_usable", "retreat", "horizon")},
        cards_against_per_fight=round(statistics.mean([r["cards_against"] for r in res]), 2),
        cards_spent_by_decoys=round(statistics.mean([r["cards_spent"] for r in res]), 2),
        cis_per_fight=round(statistics.mean([r["cis"] for r in res]), 3),
        falls=round(statistics.mean([r["falls"] for r in res]), 3),
        grabs=round(statistics.mean([r["grabs"] for r in res]), 3),
        dodges=round(statistics.mean([r["dodges"] for r in res]), 2),
        deaths=round(100 * sum(1 for r in res if r["dead"]) / n, 1),
        downs=round(100 * sum(1 for r in res if r["down"]) / n, 1),
        jams=round(100 * sum(1 for r in res if r["jam"]) / n, 1),
        dry=round(100 * sum(1 for r in res if r["dry"]) / n, 1),
        ba_attempts=round(statistics.mean([r["ba_attempts"] for r in res]), 2),
        ba_succ=round(statistics.mean([r["ba_succ"] for r in res]), 2),
        feints=round(statistics.mean([r["feints"] for r in res]), 2),
        rounds_played=round(statistics.mean([r["rounds_played"] for r in res]), 2),
        repairs=round(statistics.mean([r["repairs"] for r in res]), 3),
        repair_rolls=round(statistics.mean([r["repair_rolls"] for r in res]), 3),
    )


def run_many(cfg, n, seed, procs=10):
    chunk = n // procs
    with Pool(procs) as p:
        parts = p.map(cell, [(cfg, chunk, seed * 1000 + i) for i in range(procs)])
    return summarize([r for part in parts for r in part])


# The rows data/engagement/tuning.yaml (solo_nape, lone_fight) quotes. Seeds are the decider's
# (tools/probes/batch-3b/lone_b3b.py and lone_t2_b3b.py; the cap row the Fable review's lone.py). Since decision
# batch 3c every row counts a spare canister and Field Repair; the two rows marked "batch 3b's route check"
# turn both off and repeat the figures decision batch 3b quotes.
CASES = [
    ("the rule: decoys in a row, the Feint, a hold of Tempo cards", dict(), 304, 100000),
    ("decoys in a row without the Feint", dict(feint=False), 302, 100000),
    ("no escalation, no Feint", dict(esc="none", feint=False), 301, 100000),
    ("no escalation, with the Feint", dict(esc="none"), 305, 100000),
    ("batch 3's rule: decoys spent never reset, no Feint", dict(esc="perm", feint=False), 300, 100000),
    ("the rejected decoy cap, no escalation, no Feint", dict(esc="none", feint=False, cap=True), 31, 200000),
    ("the rule, from fight-start Stress 0", dict(stress=0), 308, 100000),
    ("the rule, dodge only Grabs and lethal harm", dict(dodge="kill"), 307, 100000),
    ("the rule, a retreat clock of 12", dict(retreat_clock=12), 306, 100000),
    ("Tempo 2, the rule, waiting line", dict(tempo=2), 507, 100000),
    ("Tempo 2, the rule, hurried line", dict(tempo=2, policy="after_first"), 508, 100000),
    ("Tempo 2, the rule with a one-card hold", dict(tempo=2, hold="card"), 505, 100000),
    ("Tempo 2, batch 3's rule, one-card hold", dict(tempo=2, esc="perm", feint=False, hold="card"), 502, 100000),
    ("Tempo 2, Nape Depth 3, the rule, waiting line", dict(tempo=2, nd=3), 511, 100000),
    ("the rule, batch 3b's route check (no spare counted, no Field Repair)", dict(spare=False, repair=False), 304, 100000),
    ("Tempo 2, the rule, waiting line, batch 3b's route check", dict(tempo=2, spare=False, repair=False), 507, 100000),
]

if __name__ == "__main__":
    scale = int(sys.argv[1]) if len(sys.argv) > 1 else 100000
    keys = ["usable_strike_share", "by_round", "median_round_struck", "mean_round_struck", "cards_before_strike",
            "cards_against_per_fight", "cards_spent_by_decoys", "cis_per_fight", "deaths", "downs", "ends",
            "stress_at_strike", "kill_given_strike", "kill_per_fight", "ba_attempts", "ba_succ", "feints", "jams",
            "dry", "repairs", "rounds_played"]
    for label, cfg, seed, n in CASES:
        r = run_many(cfg, n * scale // 100000, seed)
        print(label, {k: r[k] for k in keys}, flush=True)
