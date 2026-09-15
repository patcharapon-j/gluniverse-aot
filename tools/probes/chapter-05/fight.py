"""Full-fight model: a prepared Squad against one Focus Titan in Wooded terrain.

Rules: Chapter 5 as amended by decision batches 3, 3b, 3c, 3e, and 4 (Break Attention's needs under OQ-81: 1
for the Attention holder, 2 for anyone else, plus the Titan's decoys in a row, which a card that resolves a
behavior resets; the repeatable Feint; a decoy's hold of as many cards as the Titan's Tempo, whose last
card alone evaluates the ladder; flags that last until the end of the Titan's next card that resolves a
behavior, so a card that resolves nothing leaves them standing; the nearest rung met by the candidates at
the closest Position, including when it is the highest rung met; a tie the initiative cards cannot break,
at the start of the fight or at an end step, leaving the Titan's Attention held by nothing until its next
card), with Chapters 1, 3, and 4. See tuning.yaml prepared_squad_kill.model for the policy statement.

Switches for sensitivity rows and for the earlier decision probes (the defaults are the rule): ba_rule (see
ba_need), decoy_hold ("tempo", the rule, or "card", one card whatever the Tempo), flags ("acting", the rule
of decision batch 3e; "evaluating", batches 3c and 3d as applied, where the card that evaluates the ladder
and a card that comes up while the Titan holds a Grabbed soldier clear them; "every_card", every card of a
hold clearing them as batch 3b wrote), nearest ("narrows", the rule of decision batch 3e, 3e-6;
"holder_keeps", the reading before it, where a highest rung of nearest tied every candidate), tie_break
("none", the rule of decision batch 4, 4-3: a tie the card step cannot break leaves Attention held by
nothing until the Titan's next card; "sheet", the reading before it, where the soldier listed first on the
Squad sheet took it), sheet_order (unset: the order build_squad lists the player characters in, cutters
first, or strikers first for the template Squad; "cutters_first" or "strikers_first" lists the player
characters by role in that order, Squadmates after them, for the bar read in both Squad sheet orders,
decision batch 4, 4-4), screen_feints (whether the beside-the-holder screen feints once its horse and cloak
are spent; on by default only under the rule), feint_extra (1), roles (unset: the baseline's two cutters and
two strikers; a list names the player characters' roles, such as four strikers for the four-striker row of
decision batch 4b, 4b-2).
The screen feints only with working ODM Gear: the on-foot Feint against a grounded Titan (decision batch
3c) is a sensitivity row in tools/probes/batch-3c/onfoot_b3c.py.

The retreat clock (decision batch 5, 5-10; data/engagement/background-titans.yaml, retreat_clock and retreat):
retreat_clock (DEFAULT_RETREAT_CLOCK, 8, the interim setup's length) fills 1 segment at the end of each round,
after the Regeneration step, and when it is full the fight becomes a retreat. Under the retreat a standing soldier
who is not Down, Grabbed, or carried makes the forced move before the action (5-1), except a stay-with-a-comrade
move after the action taken for a Grabbed comrade, and a move after a lift (the PROVISIONAL lift exception;
background-titans.yaml, retreat, order). The retreat policy: go for a Grabbed comrade (from elsewhere a step
toward the hand, then a strike on the holding arm or, in rows with the escapes, Break Attention; from the
victim's Position the action first, then no change); carry a lifted comrade toward Distant and out; lift the
nearest Down comrade (sharing their Position, lift and move; otherwise a step toward them and the lift on
arrival); otherwise a step toward Distant, then leaving. A soldier at On Body or Blind Spot who can make no step
lets go. Carrying follows data/gear/carrying.yaml: a carried Rookie with a Rookie's items leaves the carrier
Overloaded, so an ODM move also spends the action and cannot be made once it is spent, and the carrier's fall,
Grab, Down, or death ends the carrying as its rows say. No Treat Injury, Nape strike, Hook and Cut, or Draw
Attention is taken during a retreat. A soldier who has left still takes turns (turn-limit Death Rolls) but is no
candidate, target, helper, or witness. When no standing soldier holds a Position the fight ends, and every
soldier still holding one dies, left to the Titans (engagement-flow.yaml, left_behind). max_rounds is then a
safety cap (SAFETY_CAP, 60) that no fight should reach; stats["cap"] counts any that do. retreat_clock None keeps
the 12-round horizon the probes ran with before decision batch 5, which the batch probes pin to repeat their
records. The summary's nokill is the share of fights that end with the Titan alive; nokill12 is kept only for
those records.
"""
import random
import statistics
import sys
from multiprocessing import Pool
from core import make, attr_roll, gain_ci, fall_damage, fear_roll, d6, Soldier

DEFAULT_RETREAT_CLOCK = 8   # data/engagement/engagement-setup.yaml, retreat_clock (decision batch 5, 5-10)
SAFETY_CAP = 60             # a model check, not a rule: no fight under the retreat clock should reach it

STEPS = {
    frozenset(("distant", "in-reach")): {"foot", "mounted", "odm"},
    frozenset(("in-reach", "on-body")): {"odm"},
    frozenset(("on-body", "blind-spot")): {"odm"},
    frozenset(("in-reach", "blind-spot")): {"odm"},
}
CLOSE = {"in-reach", "on-body", "blind-spot"}
NEAREST = {"on-body": 0, "in-reach": 1, "blind-spot": 2, "distant": 3}

SIZES = {
    "small": dict(tempo=2, nd=3, regen=2, tough={"eyes": 1, "arm": 1, "leg": 1},
                  sev={"terrorize": 1, "control": 2, "kill": 2}, large=False),
    "medium": dict(tempo=1, nd=4, regen=3, tough={"eyes": 2, "arm": 2, "leg": 2},
                   sev={"terrorize": 1, "control": 2, "kill": 3}, large=False),
    "large": dict(tempo=1, nd=4, regen=4, tough={"eyes": 2, "arm": 3, "leg": 2},
                  sev={"terrorize": 2, "control": 3, "kill": 4}, large=True),
}
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
PARTS = ["eyes", "left-arm", "right-arm", "left-leg", "right-leg"]
KIND = {"eyes": "eyes", "left-arm": "arm", "right-arm": "arm", "left-leg": "leg", "right-leg": "leg"}


def steps_apart(a, b):
    if a == b:
        return 0
    return 1 if frozenset((a, b)) in STEPS else 2


def can_step(a, b, kind, grounded):
    kinds = STEPS.get(frozenset((a, b)))
    if not kinds:
        return False
    if kind in kinds:
        return True
    return grounded and kind == "foot" and a in CLOSE and b in CLOSE


class Titan:
    def __init__(self, size, sev=None):
        c = SIZES[size]
        self.tempo, self.nd, self.regen_len, self.large = c["tempo"], c["nd"], c["regen"], c["large"]
        self.sev = dict(c["sev"])
        if sev:
            self.sev.update(sev)
        self.base_tough = c["tough"]
        self.parts = {p: {"state": 0, "count": 0} for p in PARTS}
        self.openings = []
        self.regen = 0
        self.prev = None
        self.nb = None
        self.holder = None
        self.grab = None
        self.dead = False
        self.decoyed = False      # its most recent card was spent by a decoy (the rejected decoy cap)
        self.decoys_spent = 0     # decoys in a row: decoys that have held its Attention since its last card that
                                  # resolved a behavior (round.yaml, gm_tracker); never reset under batch 3's rule
        self.hold_left = 0        # cards of the Titan the current decoy's hold has left (OQ-81, decision batch 3b)

    def tough(self, p):
        if self.grab and self.grab["arm"] == p:
            return 1
        return self.base_tough[KIND[p]]

    def unbroken(self, kind):
        return sum(1 for p in PARTS if KIND[p] == kind and self.parts[p]["state"] < 2)

    def grounded(self):
        return any(self.parts[p]["state"] == 2 for p in ("left-leg", "right-leg"))


class Fight:
    def __init__(self, rng, cfg):
        self.rng = rng
        self.cfg = cfg
        self.t = Titan(cfg.get("size", "medium"), cfg.get("sev"))
        for k, v in cfg.get("titan", {}).items():
            setattr(self.t, k, v)
        self.sold = []
        self.stats = dict(kill_round=None, cis=0, deaths=0, grabs=0, devours=0, jams=0, dodges=0, napes=0,
                          bodies=0, resolved=0, decoy_cards=0, rounds=0, lethal_at_end=0, falls=0,
                          grab_dodge_refunds=0, ba_rescues=0, tactic_uses=0, fall_backs=0, decoys=0,
                          feints=0, feint_rolls=0, retreats=0, retreat_rounds=0, left=0, lifts=0, carried_out=0,
                          left_behind=0, lets_go=0, cap=0, clock=cfg.get("retreat_clock", DEFAULT_RETREAT_CLOCK))
        self.clock = self.stats["clock"]
        self.retreat = False
        self.used = set()
        self.build_squad()
        self.rnd = 0
        self.card = {}

    # ---------------------------------------------------------------- setup
    def add(self, s, role):
        s.role = role
        s.pos = "distant"
        s.airborne = False
        s.grabbed = False
        s.pre_turn, s.pre_action = set(), set()
        s.cur_move = s.cur_action = False
        s.card_passed = False
        s.turns = 0
        s.flags = {"hooked": False, "hurt": False, "loud": False}
        s.dodge_succ = None
        s.odm_used = s.odm_pushed = False
        s.ban = 0
        s.ban_started = False
        s.horse_here = True
        s.cloak_thrown = False
        s.start_pos = "distant"
        s.left = False
        s.carrying = None
        s.carried_by = None
        for c in s.cis:
            c["gained"] = -1
        self.sold.append(s)

    def build_squad(self):
        cfg = self.cfg
        st = cfg.get("stress", 1)
        if cfg.get("template"):
            specs = [
                ("slayer", "striker", dict(strength=4, agility=3, perception=3, health=4, resolve=3,
                                           talents={"nape-strike": 1})),
                ("flier", "striker", dict(strength=3, agility=4, perception=3, health=4, resolve=3,
                                          talents={"dodge": 1})),
                ("brawler", "cutter", dict(strength=4, agility=3, perception=3, health=4, resolve=3,
                                           talents={"break-free": 1})),
                ("hunter", "cutter", dict(strength=3, agility=3, perception=4, health=3, resolve=3,
                                          talents={"break-attention": 1})),
            ]
            for name, role, kw in self.sheet_order(specs):
                self.add(make("rookie", name, stress=st, **kw), role)
        else:
            # roles: the player characters' roles in the order build_squad lists them; unset, the baseline
            # Squad of two cutters and two strikers. ["striker"] * 4 is the four-striker row (decision batch
            # 4b, 4b-2); a role fight.py does not know is a sensitivity role a subclass handles.
            roles = cfg.get("roles") or ["cutter", "cutter", "striker", "striker"]
            for i, role in self.sheet_order(list(enumerate(roles))):
                self.add(make("rookie", f"pc{i}", stress=st), role)
        for i in range(cfg.get("squadmates", 0)):
            role = cfg.get("squadmate_role", "helper")
            self.add(make("rookie", f"sm{i}", stress=st, pc=False), role)

    # ---------------------------------------------------------------- helpers
    def alive(self):
        return [s for s in self.sold if not s.dead]

    def present(self):
        """Living soldiers who have not left: the candidates, targets, helpers, and witnesses (positions.yaml,
        leaving, after_leaving)."""
        return [s for s in self.sold if not s.dead and not s.left]

    # ---------------------------------------------------------------- Squad Tactics and decoys
    def tactic_ready(self, name):
        return name in self.cfg.get("tactics", []) and name not in self.used

    def use_tactic(self, name):
        self.used.add(name)
        self.stats["tactic_uses"] += 1

    def can_decoy(self):
        """Break Attention's requirements on the Titan: no decoy holds it. The decoy cap (a sensitivity
        option, rejected in review 2) also bars a Titan whose most recent card a decoy spent."""
        t = self.t
        if t.dead or t.holder == "decoy":
            return False
        return not (t.decoyed and self.cfg.get("decoy_cap", False))

    def ba_rule(self):
        if not self.cfg.get("decoy_tie", True):
            return "always_1"
        return self.cfg.get("ba_rule", "holder_in_a_row")

    def hold_rule(self):
        """decoy_hold "tempo", the rule (decision batch 3b): a decoy holds for as many of the Titan's next
        cards as its Tempo. "card": for its next card only, as before batch 3b."""
        return self.cfg.get("decoy_hold", "tempo")

    def flag_rule(self):
        """flags "acting", the rule (decision batch 3e, 3e-1): a flag lasts until the end of the Titan's next
        card that resolves a behavior, and clears at that card's Next step; a card that resolves nothing
        (under a decoy's hold, while the Titan holds a Grabbed soldier, or with no one holding its
        Attention) leaves every flag standing. "evaluating": batches 3c and 3d as applied, where the card
        that evaluates the ladder clears them, a hold's last card included, and so does a card that comes
        up while the Titan holds a Grabbed soldier. "every_card": every card of a hold clears them too, as
        decision batch 3b wrote."""
        return self.cfg.get("flags", "acting")

    def nearest_rule(self):
        """nearest "narrows", the rule (decision batch 3e, 3e-6): the nearest rung is met by the candidates at
        the closest Position, so when it is the highest rung met the tied set is those candidates.
        "holder_keeps": the reading before batch 3e, where a highest rung of nearest tied every candidate
        and the holder step kept the current holder wherever they stood."""
        return self.cfg.get("nearest", "narrows")

    def tie_break_rule(self):
        """tie_break "none", the rule (decision batch 4, 4-3; attention.yaml, evaluation, none): a tie the card
        step cannot break, which only the start of a Titan Engagement, an end step, and a tie among one player
        character's Wing Squadmates (none in Phase 1) reach (decision batch 4b, 4b-3), leaves the
        Titan's Attention held by nothing until its next card. "sheet": the reading before batch 4, where the
        tied soldier listed first on the Squad sheet took it."""
        return self.cfg.get("tie_break", "none")

    def sheet_order(self, roles):
        """sheet_order "cutters_first" or "strikers_first" lists the player characters by role in that order
        (a stable sort, so each role keeps build_squad's order); unset, the order build_squad gives."""
        order = self.cfg.get("sheet_order")
        if order is None:
            return roles
        first = "cutter" if order == "cutters_first" else "striker"
        return [x for x in roles if x[1] == first] + [x for x in roles if x[1] != first]

    def hold_card_not_last(self):
        """A card under a decoy's hold of Tempo cards that leaves the hold with cards left. titan_card has
        already counted this card off the hold."""
        t = self.t
        return t.holder == "decoy" and self.hold_rule() == "tempo" and t.hold_left > 0

    def screen_feints(self):
        return self.cfg.get("screen_feints", self.ba_rule() == "holder_in_a_row")

    def ba_need(self, s):
        """Successes a Break Attention needs (attention.yaml, break_attention, needs, needs_rule).

        ba_rule "holder_in_a_row", the rule (OQ-81, decision batch 3b): 1 for the soldier holding the
        Titan's Attention, 2 for anyone else, 2 against a Titan holding a Grabbed soldier, plus 1 for
        each decoy that has held that Titan's Attention since its last card that resolved a behavior
        (titan_card resets the count). "holder_escalating", batch 3's rule: the same, but the count
        never resets. "holder_only": the same with no escalation. "beside_holder", the review round 2 rule: 1 for the
        holder or a comrade at the holder's Position, otherwise 2, and 2 against a holding Titan.
        "beside_holder_escalating": that rule plus the escalation. "always_1" (or decoy_tie false):
        every Break Attention needs 1, and 2 against a holding Titan."""
        t = self.t
        rule = self.ba_rule()
        extra = t.decoys_spent if (rule.endswith("escalating") or rule == "holder_in_a_row") else 0
        if t.grab:
            return 2 + extra
        if rule == "always_1":
            return 1
        h = t.holder
        if h is s:
            return 1 + extra
        if rule.startswith("beside_holder") and h not in (None, "decoy") and h.pos == s.pos:
            return 1 + extra
        return 2 + extra

    def break_attention(self, s, gear, need):
        s.cur_action = True
        res = attr_roll(self.rng, s, "break-attention", s.per, 0, 0, gear, push_to=need)
        if gear == "odm":
            self.odm_roll_after(s, res, True)
        elif res["spend_turn"]:
            self.spend_turn(s)
        return res["succ"]

    def decoy_success(self, s, succ, need, horse=False):
        t = self.t
        if t.grab:
            self.stats["ba_rescues"] += 1
            self.release()
        t.holder = "decoy"
        t.decoys_spent += 1
        t.hold_left = t.tempo if self.hold_rule() == "tempo" else 1
        self.stats["decoys"] += 1
        t.openings.extend([s.name] * (succ - need))
        if horse:
            s.horse_here = False
        self.hook_and_cut(s)

    def hook_and_cut(self, s):
        if not self.tactic_ready("hook") or self.t.dead or self.retreat:
            return
        ready = [c for c in self.present() if c is not s and not c.down and self.can_nape(c)]
        if not ready:
            return
        ready.sort(key=lambda c: c.role != "striker")
        self.use_tactic("hook")
        self.nape_strike(ready[0])

    def spend_turn(self, s):
        """Spends the earliest wholly unspent turn and returns the round it belongs to."""
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

    def fear(self, s):
        if s.dead or s.down:
            return
        e = fear_roll(self.rng, s)
        if e["spend_action"]:
            self.spend_action(s)
        for _ in range(e["spend_turns"]):
            self.spend_turn(s)
        if e["no_react"]:
            s.ban = max(s.ban, 2 if e["spend_turns"] == 2 else 1)

    def witnesses(self, victim):
        for s in self.present():
            if s is not victim:
                self.fear(s)

    def kill(self, s):
        if s.dead is True and getattr(s, "counted_dead", False):
            return
        s.dead = True
        s.counted_dead = True
        self.stats["deaths"] += 1
        if s.carried_by is not None:   # carrying.yaml, ends: the carried comrade dies
            s.carried_by.carrying = None
            s.carried_by = None
        mounted = getattr(s, "mounted", False)
        self.drop_carried(s, fall=s.airborne or mounted, horse=mounted and not s.airborne)
        t = self.t
        if t.holder is s:
            t.holder = None
        if t.grab and t.grab["victim"] is s:
            self.release(dead=True)
        self.witnesses(s)

    def after_harm(self, s, row):
        if row is None:
            return
        if row == "dead":
            self.kill(s)
            return
        for c in s.cis:
            if "gained" not in c:
                c["gained"] = s.turns

    def fall(self, s):
        t = self.t
        pos0 = s.pos
        # falls.yaml, never_a_second_fall: a fall ends the carried and carrying states first, and a carried comrade
        # falls with the carrier from the same band (triggers, carried).
        if s.carried_by is not None:
            s.carried_by.carrying = None
            s.carried_by = None
        c = s.carrying
        if c is not None:
            s.carrying = None
            c.carried_by = None
        high = s.pos in ("on-body", "blind-spot")
        band = "high" if high else "low"
        if t.large:
            band = "extreme" if band == "high" else "high"
        s.airborne = False
        self.stats["falls"] += 1
        n_before = len(s.cis)
        row = fall_damage(self.rng, s, band)
        if row is not None:
            self.stats["cis"] += 1
            self.after_harm(s, row)
        if high and not s.dead:
            s.pos = "in-reach"
        if c is not None and not c.dead:
            c.pos = pos0
            self.fall(c)

    def drop_carried(self, s, fall=False, horse=False):
        """carrying.yaml, carrying_a_comrade, ends: the comrade is set down at the carrier's Position, and falls with
        them where a row says so, from a horse's height when the carrier was mounted."""
        c = s.carrying
        if c is None:
            return
        s.carrying = None
        c.carried_by = None
        c.pos = s.pos
        if not fall or c.dead:
            return
        if horse:
            self.stats["falls"] += 1
            row = fall_damage(self.rng, c, "low")
            if row is not None:
                self.stats["cis"] += 1
                self.after_harm(c, row)
        else:
            self.fall(c)

    def carry_check(self, s):
        """carrying.yaml, ends: a carrier made Down while neither airborne nor mounted sets the comrade down."""
        if s.carrying is not None and s.down and not s.dead:
            self.drop_carried(s)

    def odm_roll_after(self, s, res, used_odm):
        if used_odm:
            s.odm_used = True
            if res["pushed"]:
                s.odm_pushed = True
            if res["gear_ones"]:
                was = s.odm
                s.odm = max(0, s.odm - res["gear_ones"])
                if s.odm == 0 and was > 0:
                    self.stats["jams"] += 1
                    if s.airborne:
                        self.fall(s)
        if res["spend_turn"]:
            self.spend_turn(s)

    def blade_after(self, s, res):
        if res["pushed"] and res["gear_ones"]:
            s.blades -= 1
            s.handles = False
        if res["spend_turn"]:
            self.spend_turn(s)

    def roll_nb(self):
        t = self.t
        r = d6(self.rng)
        for i in range(6):
            e = BY_RES[(r - 1 + i) % 6 + 1]
            if e != t.prev and TABLE[e]["arms"] <= t.unbroken("arm"):
                return e
        return "thrash"

    # ---------------------------------------------------------------- Attention
    def evaluate(self, end_step=False):
        t = self.t
        cands = [s for s in self.present()]
        if not cands:
            t.holder = None
            return

        def meets(s, rung):
            low = s.down
            if rung == "hooked":
                return not low and (s.pos == "on-body" or s.flags["hooked"])
            if rung == "inreach":
                return not low and s.pos == "in-reach"
            if rung == "hurt":
                return not low and s.flags["hurt"]
            if rung == "loud":
                return not low and s.flags["loud"]
            return True

        rungs = ["hooked", "inreach", "hurt", "loud", "nearest"]
        top = next(i for i, r in enumerate(rungs) if any(meets(s, r) for s in cands))
        tied = [s for s in cands if meets(s, rungs[top])]
        if rungs[top] == "nearest" and self.nearest_rule() == "narrows":
            # attention.yaml, tests, nearest: as the highest rung met, only the candidates at the closest
            # Position meet it (decision batch 3e, 3e-6).
            best = min(NEAREST[s.pos] for s in tied)
            tied = [s for s in tied if NEAREST[s.pos] == best]
        if rungs[top] == "hooked":
            struck = [s for s in tied if s.flags["hooked"]]
            if struck:
                tied = struck
        for r in rungs[top + 1:]:
            if r == "nearest":
                best = min(NEAREST[s.pos] for s in tied)
                tied = [s for s in tied if NEAREST[s.pos] == best]
            else:
                sub = [s for s in tied if meets(s, r)]
                if sub:
                    tied = sub
        if len(tied) == 1:
            t.holder = tied[0]
        elif t.holder in tied:
            pass
        elif self.card and not end_step:
            t.holder = min(tied, key=lambda s: self.card.get(s.name, 99))
        elif self.tie_break_rule() == "sheet":
            t.holder = tied[0]
        else:
            # attention.yaml, evaluation, none: nothing holds its Attention until its next card (decision batch 4, 4-3).
            t.holder = None

    def clear_flags(self):
        for s in self.sold:
            s.flags = {"hooked": False, "hurt": False, "loud": False}

    # ---------------------------------------------------------------- Titan card
    def titan_card(self):
        """A Titan's card under the decoy's hold and the decoys-in-a-row reset (decision batch 3b), around
        resolve_card. A card under a hold of Tempo cards resolves nothing and spends the Next Behavior;
        until the last card of the hold, the decoy keeps the Titan's Attention."""
        t = self.t
        before = self.stats["resolved"]
        holding = t.holder == "decoy" and not t.grab and not t.dead and self.hold_rule() == "tempo"
        if holding:
            t.hold_left -= 1
        self.resolve_card()
        if holding and t.hold_left > 0 and not t.dead:
            t.holder = "decoy"
        if self.ba_rule() == "holder_in_a_row" and self.stats["resolved"] > before:
            t.decoys_spent = 0

    def resolve_card(self):
        t = self.t
        if t.dead:
            return
        t.decoyed = False
        rule = self.flag_rule()
        if t.grab:
            # behavior-procedure.yaml, resolving_a_card, holding: the card resolves nothing and leaves the
            # flags standing (decision batch 3e, 3e-1).
            if rule != "acting":
                self.clear_flags()
            return
        if t.holder == "decoy":
            not_last = self.hold_card_not_last()
            t.holder = None
            t.prev = t.nb
            t.nb = self.roll_nb()
            t.decoyed = True
            self.stats["decoy_cards"] += 1
            # Only the hold's last card evaluates the ladder (decision batch 3c, 3c-4). On a card that leaves
            # the hold with cards left, this evaluation is overwritten by titan_card, which restores the
            # decoy, so it has no effect; it draws no dice. No card of the hold resolves a behavior, so none
            # clears the flags (decision batch 3e, 3e-1): the hold's last card reads them, and the Titan's
            # next card that resolves a behavior reads them again and clears them.
            self.evaluate()
            if rule == "every_card" or (rule == "evaluating" and not not_last):
                self.clear_flags()
            return
        self.evaluate()
        if rule != "acting":
            self.clear_flags()
        h = t.holder
        if h is None:
            return
        e = t.nb
        if TABLE[e]["arms"] > t.unbroken("arm") or h.pos not in TABLE[e]["req"]:
            beh = "thrash"
        else:
            beh = e
        info = TABLE[beh]
        sev = t.sev[info["tier"]]
        eff = info["eff"]
        policy = self.cfg.get("dodge", "harm")
        if policy == "harm":
            harmful = eff in ("ci-nonlethal", "ci-lethal", "grab") or (
                eff == "knock" and (h.airborne or h.pos in ("on-body", "blind-spot")))
        else:
            harmful = eff in ("ci-lethal", "grab")
        avoided = False
        dodge_round = None
        first_counted = self.rnd if not h.card_passed else self.rnd + 1
        if h.dodge_succ is not None:
            avoided = h.dodge_succ >= sev
        elif harmful and not h.down and not h.grabbed and h.ban == 0:
            dodge_round = self.spend_turn(h)
            res = attr_roll(self.rng, h, "dodge", h.agi, h.talents.get("dodge", 0), 0, "odm", push_to=sev)
            used = h.gear_dice("odm") > 0 or True
            self.stats["dodges"] += 1
            self.odm_roll_after(h, res, h.odm_working() or res["gear_ones"] > 0)
            h.dodge_succ = res["succ"]
            avoided = res["succ"] >= sev
        if not avoided and not h.dead:
            if eff == "stress":
                h.stress += 1
            elif eff in ("ci-nonlethal", "ci-lethal"):
                was_air = h.airborne
                row = gain_ci(self.rng, h, None, cannot_be_lethal=(eff == "ci-nonlethal"))
                self.stats["cis"] += 1
                self.after_harm(h, row)
                if not h.dead and h.down and h.airborne:
                    self.fall(h)
                self.carry_check(h)
            elif eff == "knock":
                if h.airborne or h.pos in ("on-body", "blind-spot"):
                    self.fall(h)
            elif eff == "grab":
                if (dodge_round is not None and dodge_round > first_counted
                        and self.cfg.get("grab_refund", True)):
                    # grab.yaml countdown.failed_dodge: the later turn is unspent again, and the
                    # first counted turn counts as spent instead.
                    h.pre_turn.discard(dodge_round)
                    if first_counted == self.rnd:
                        h.cur_move = h.cur_action = True
                    else:
                        h.pre_turn.add(first_counted)
                    self.stats["grab_dodge_refunds"] += 1
                self.grab_lands(h)
        t.prev = beh
        t.nb = self.roll_nb()
        self.stats["resolved"] += 1
        if rule == "acting":
            # behavior-procedure.yaml, resolving_a_card, next: the card that resolved a behavior clears the
            # flags (decision batch 3e, 3e-1).
            self.clear_flags()

    def grab_lands(self, h):
        """grab.yaml, grab_lands, in the order of decision batch 5, 5-6: the hold, then the crush on a soldier already
        in the hand, then Attention and the witnesses. The hold draws no dice, so the order moves no figure."""
        t = self.t
        arm = next(p for p in ("left-arm", "right-arm") if t.parts[p]["state"] < 2)
        t.parts[arm]["count"] = 0
        was_air = h.airborne
        if h.carried_by is not None:   # a carried target stops being carried, with no fall
            h.carried_by.carrying = None
            h.carried_by = None
        c = h.carrying                 # a comrade the target carried is set down, and falls if the target was airborne
        if c is not None:
            h.carrying = None
            c.carried_by = None
            c.pos = h.pos
        t.grab = {"victim": h, "arm": arm, "counted": 0, "lifted": False}
        h.grabbed = True
        h.pos = "on-body"
        h.airborne = False
        if c is not None and was_air:
            self.fall(c)
        row = gain_ci(self.rng, h, "torso", cannot_be_lethal=True)
        self.stats["cis"] += 1
        self.after_harm(h, row)
        t.holder = h
        self.stats["grabs"] += 1
        self.witnesses(h)

    def release(self, dead=False):
        t = self.t
        g = t.grab
        v = g["victim"]
        t.parts[g["arm"]]["count"] = 0
        t.grab = None
        if t.holder is v:
            t.holder = None
        v.grabbed = False
        if dead or v.dead:
            return
        if g["lifted"]:
            v.pos = "on-body"
            self.fall(v)
        else:
            v.pos = "in-reach"

    # ---------------------------------------------------------------- strikes
    def helpers(self, roller, n):
        if n <= 0:
            return []
        out = []
        for h in self.present():
            if h is roller or h.down or h.grabbed or h.cur_action or h.role == "decoyer":
                continue
            if steps_apart(h.pos, roller.pos) > 1:
                continue
            if not (h.card_passed or h.role == "helper" or (h.role == "striker" and h.start_pos == "distant")):
                continue
            out.append(h)
        out.sort(key=lambda h: (not h.card_passed,))
        out = out[:n]
        for h in out:
            h.cur_action = True
        return out

    def body_strike(self, s, part, max_help=2):
        t = self.t
        P = t.parts[part]
        need_state = t.tough(part) - P["count"]
        hs = self.helpers(s, max_help)
        s.cur_action = True
        hamstring = KIND[part] == "leg" and hs and self.tactic_ready("hamstring")
        if hamstring:
            self.use_tactic("hamstring")
        res = attr_roll(self.rng, s, "body-part-strike", s.str, s.talents.get("body-part-strike", 0), len(hs),
                        "blade", push_to=need_state)
        self.stats["bodies"] += 1
        self.blade_after(s, res)
        succ = res["succ"]
        if hamstring and succ >= 1:
            succ += 1
        if succ >= 1:
            s.flags["hurt"] = True
        for _ in range(succ):
            if P["state"] == 2:
                t.openings.append(s.name)
                continue
            P["count"] += 1
            if P["count"] >= t.tough(part):
                P["state"] += 1
                P["count"] = 0
                if P["state"] == 2 and t.grab and t.grab["arm"] == part:
                    self.release()

    def nape_free_bonus(self, s):
        t = self.t
        g = 2 if t.grounded() else 0
        free = sum(1 for o in t.openings if o != s.name)
        return min(4, g + free)

    def can_nape(self, s):
        t = self.t
        return (s.pos == "blind-spot" and t.holder is not s and not s.grabbed and s.handles and not s.cur_action
                and (s.odm_working() or t.grounded()))

    def nape_strike(self, s):
        t = self.t
        g = 2 if t.grounded() else 0
        free = [i for i, o in enumerate(t.openings) if o != s.name]
        use = min(len(free), 4 - g)
        for i in sorted(free[:use], reverse=True):
            t.openings.pop(i)
        hs = self.helpers(s, 4 - g - use) if self.cfg.get("help_nape", True) else []
        bonus = g + use + len(hs)
        s.cur_action = True
        res = attr_roll(self.rng, s, "nape-strike", s.str, s.talents.get("nape-strike", 0), bonus, "blade",
                        push_to=t.nd)
        self.stats["napes"] += 1
        self.blade_after(s, res)
        s.flags["hooked"] = True
        if res["succ"] >= t.nd:
            t.dead = True
            if t.grab:
                self.release()
            return
        t.openings.extend([s.name] * res["succ"])

    def pick_part(self, s):
        t = self.t
        opts = [p for p in ("left-leg", "right-leg") if t.parts[p]["state"] < 2]
        if not opts:
            opts = [p for p in ("left-arm", "right-arm") if t.parts[p]["state"] < 2]
        if not opts:
            return None
        return max(opts, key=lambda p: (t.parts[p]["state"], t.parts[p]["count"]))

    # ---------------------------------------------------------------- a soldier's turn
    def move(self, s, to, kind):
        s.cur_move = True
        s.pos = to
        if s.carrying is not None:   # carrying.yaml, carrying_a_comrade, position
            s.carrying.pos = to
        if kind == "odm":
            s.airborne = True
            s.odm_used = True
        else:
            s.airborne = False

    def try_step(self, s, to):
        if s.cur_move:
            return False
        g = self.t.grounded()
        if can_step(s.pos, to, "foot", g):
            self.move(s, to, "foot")
            return True
        if can_step(s.pos, to, "odm", g) and s.odm_working():
            if self.overloaded(s):
                # carrying.yaml, overloaded: an ODM move also spends the action, and cannot be made once it is spent
                if s.cur_action:
                    return False
                s.cur_action = True
            self.move(s, to, "odm")
            return True
        return False

    def items(self, s):
        """carrying.yaml, items_counted: spare canisters and Blade Sets not in the handles."""
        return s.spares + max(0, s.blades - (1 if s.handles else 0))

    def overloaded(self, s):
        """carrying.yaml, limit and overloaded: a carried comrade counts 5 and their items. Only a carrier can be
        Overloaded in this model; a Rookie's own items are 3 against a limit of 8."""
        if s.carrying is None:
            return False
        return self.items(s) + 5 + self.items(s.carrying) > s.str + 4

    def death_rolls(self, s):
        for c in list(s.cis):
            if s.dead:
                return
            if c["limit"] == "turn" and c.get("gained", -1) < s.turns:
                n = max(1, s.str - c["row"]["dr_pen"])
                succ = sum(1 for _ in range(n) if d6(self.rng) == 6)
                if succ == 0:
                    self.kill(s)
                    return
                if succ >= 2:
                    c["limit"] = "engagement"

    def soldier_turn(self, s):
        t = self.t
        if s.left or s.carried_by is not None:
            # positions.yaml, after_leaving; carrying.yaml, carrying_a_comrade, turns: the turn still happens and a
            # turn-limit Death Roll still comes, but nothing it could do is modelled.
            s.turns += 1
            ban_started = s.ban > 0
            s.cur_move = s.cur_action = True
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        if self.retreat and not s.down and not s.grabbed:
            s.turns += 1
            ban_started = s.ban > 0
            if not s.handles and s.blades > 0:
                s.handles = True
            self.retreat_turn(s)
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        if (s.role == "screen2" and self.screen_feints() and not s.horse_here and s.cloak_thrown
                and not s.down and not s.grabbed and not t.grab and not t.dead):
            # Decision batch 3b: once its horse and cloak are spent, the beside-the-holder screen feints
            # (attention.yaml, break_attention, decoys, feint): from in-reach or on-body with working ODM
            # Gear, needing 1 more than its need, spending nothing.
            s.turns += 1
            ban_started = s.ban > 0
            if s.pos == "distant":
                self.try_step(s, "in-reach")
            elif s.pos == "blind-spot" and not s.cur_move:
                self.try_step(s, "in-reach")
            if s.pos in ("in-reach", "on-body") and not s.cur_action and s.odm_working() and self.can_decoy():
                need = self.ba_need(s) + self.cfg.get("feint_extra", 1)
                self.stats["feint_rolls"] += 1
                succ = self.break_attention(s, "odm", need)
                if succ >= need and not t.dead:
                    self.stats["feints"] += 1
                    self.decoy_success(s, succ, need)
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        s.turns += 1
        ban_started = s.ban > 0
        if s.down:
            s.cur_action = True
        if not s.handles and s.blades > 0 and not s.down:
            s.handles = True
        if s.grabbed and t.grab and t.grab["victim"] is s:
            g = t.grab
            g["counted"] += 1
            if g["counted"] == 1 and self.cfg.get("grab_rule", "d") == "d":
                s.cur_action = True
            if not s.cur_action and not s.down:
                s.cur_action = True
                hs = self.helpers(s, 3) if self.cfg.get("escapes") else []
                res = attr_roll(self.rng, s, "break-free", s.str, s.talents.get("break-free", 0), len(hs), "blade",
                                push_to=2, extra_pen=2 if g["lifted"] else 0)
                self.blade_after(s, res)
                if res["succ"] >= 2:
                    self.release()
            self.death_rolls(s)
            if not s.dead and t.grab and t.grab["victim"] is s:
                if g["counted"] == 1:
                    g["lifted"] = True
                else:
                    self.stats["devours"] += 1
                    self.kill(s)
            self.end_turn(s, ban_started)
            return
        if s.down:
            if s.pos == "in-reach" and not s.cur_move:
                s.cur_move = True
                s.pos = "distant"
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        if s.role == "striker" and s.odm == 0 and not t.grounded():
            s.role = "cutter"
        # rescue
        if t.grab and t.grab["victim"] is not s:
            g = t.grab
            if s.role == "striker" and self.can_nape(s) and self.nape_free_bonus(s) >= 2:
                self.nape_strike(s)
            else:
                clear = g.get("clear", False)
                narrow = g["lifted"] and not clear
                if (narrow and s.pos == "in-reach" and self.tactic_ready("clear") and not s.cur_action
                        and s.handles):
                    self.use_tactic("clear")
                    g["clear"] = clear = True
                    narrow = False
                reach = {"on-body", "blind-spot"} if narrow else {"in-reach", "on-body", "blind-spot"}
                if s.pos not in reach:
                    if s.pos == "distant":
                        self.try_step(s, "in-reach")
                    if s.pos not in reach and s.pos == "in-reach":
                        self.try_step(s, "on-body")
                if (s.pos in reach and not s.cur_action and s.handles and
                        (s.pos == "in-reach" or clear or s.odm_working() or t.grounded())):
                    self.body_strike(s, g["arm"], max_help=0)
                elif self.cfg.get("escapes") and not s.cur_action and not s.down and self.can_decoy():
                    gear = "odm" if s.odm_working() else ("horse" if s.horse_here and s.pos == "distant" else None)
                    if gear:
                        need = self.ba_need(s)
                        succ = self.break_attention(s, gear, need)
                        if succ >= need and t.grab is g:
                            self.decoy_success(s, succ, need, horse=(gear == "horse"))
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        if s.role == "decoyer":
            old = self.cfg.get("old_decoy")
            if not s.cur_action and not t.dead and (old or (s.horse_here and self.can_decoy())):
                need = 1 if old else self.ba_need(s)
                succ = self.break_attention(s, "horse", need)
                if succ >= need:
                    if old:
                        t.holder = "decoy"
                        t.decoys_spent += 1
                        self.stats["decoys"] += 1
                        t.openings.extend([s.name] * (succ - 1))
                    else:
                        self.decoy_success(s, succ, need, horse=True)
        elif s.role == "screen":
            # Review 2 (Opus finding 2): send the horse from distant, then fly to blind-spot and throw the cloak.
            if s.horse_here and s.pos == "distant":
                if not s.cur_action and self.can_decoy():
                    need = self.ba_need(s)
                    succ = self.break_attention(s, "horse", need)
                    if succ >= need:
                        self.decoy_success(s, succ, need, horse=True)
            elif not s.cloak_thrown:
                if s.pos == "distant":
                    self.try_step(s, "in-reach")
                elif s.pos == "in-reach":
                    self.try_step(s, "blind-spot")
                if (s.pos in ("on-body", "blind-spot") and not s.cur_action and s.odm_working()
                        and self.can_decoy() and t.parts["eyes"]["state"] < 2):
                    s.cloak_thrown = True
                    need = self.ba_need(s)
                    succ = self.break_attention(s, "odm", need)
                    if succ >= need and not t.dead:
                        self.decoy_success(s, succ, need)
            elif s.pos == "distant":
                self.try_step(s, "in-reach")
        elif s.role == "screen2":
            # Review round 3 (Opus Major 1): a screen that works beside the Attention holder. Horse
            # phase: ride to the holder's Position when it is distant or in-reach, then send the horse.
            # Cloak phase: fly to the holder's Position if it is on-body or blind-spot (otherwise
            # blind-spot) and throw the cloak. The screen sends and throws whatever Break Attention
            # needs under every rule (decision batch 3, OQ-81).
            h = t.holder
            hpos = h.pos if h not in (None, "decoy") else None
            if s.horse_here:
                if hpos in ("distant", "in-reach") and s.pos != hpos:
                    self.try_step(s, hpos)
                if not s.cur_action and self.can_decoy():
                    need = self.ba_need(s)
                    succ = self.break_attention(s, "horse", need)
                    if succ >= need:
                        self.decoy_success(s, succ, need, horse=True)
            elif not s.cloak_thrown:
                target = hpos if hpos in ("on-body", "blind-spot") else "blind-spot"
                if s.pos == "distant":
                    self.try_step(s, "in-reach")
                elif s.pos != target:
                    self.try_step(s, target)
                if (s.pos in ("on-body", "blind-spot") and not s.cur_action and s.odm_working()
                        and self.can_decoy() and t.parts["eyes"]["state"] < 2):
                    need = self.ba_need(s)
                    s.cloak_thrown = True
                    succ = self.break_attention(s, "odm", need)
                    if succ >= need and not t.dead:
                        self.decoy_success(s, succ, need)
            elif s.pos == "distant":
                self.try_step(s, "in-reach")
        elif s.role == "cutter":
            if s.pos == "distant":
                self.try_step(s, "in-reach")
            elif s.pos == "blind-spot":
                self.try_step(s, "in-reach")
            if (self.tactic_ready("hook") and s.pos in ("in-reach", "on-body") and not s.cur_action
                    and s.odm_working() and self.can_decoy() and not t.grab):
                ready = [c for c in self.alive() if c is not s and not c.down and not c.grabbed
                         and c.pos == "blind-spot" and not c.cur_action and c.handles
                         and (c.odm_working() or t.grounded())]
                if any(t.holder is c or self.nape_free_bonus(c) >= 2 for c in ready):
                    need = self.ba_need(s)
                    succ = self.break_attention(s, "odm", need)
                    if succ >= need and not t.dead:
                        self.decoy_success(s, succ, need)
            if s.pos in ("in-reach", "on-body") and not s.cur_action and s.handles:
                part = self.pick_part(s)
                if part and (s.pos == "in-reach" or s.odm_working() or t.grounded()):
                    self.body_strike(s, part)
        elif s.role == "striker":
            if s.pos != "blind-spot":
                if s.pos == "distant":
                    self.try_step(s, "in-reach")
                elif s.gas == 0 and s.spares > 0 and not t.grounded() and not s.cur_action:
                    s.spares -= 1
                    s.gas = 3
                    s.cur_action = True
                    self.try_step(s, "blind-spot")
                else:
                    self.try_step(s, "blind-spot")
            if self.can_nape(s):
                eager = self.cfg.get("policy", "eager") == "eager"
                if eager or self.nape_free_bonus(s) >= 2 or self.rnd >= 3:
                    self.nape_strike(s)
            elif s.pos == "blind-spot" and s.gas == 0 and s.spares > 0 and not s.cur_action and not t.grounded():
                s.spares -= 1
                s.gas = 3
                s.cur_action = True
        elif s.role == "helper":
            if s.pos == "distant":
                self.try_step(s, "in-reach")
        self.death_rolls(s)
        self.end_turn(s, ban_started)

    # ---------------------------------------------------------------- the retreat (decision batch 5, 5-1 and 5-10)
    def retreat_step(self, s, to):
        """One step to an adjacent Position: mounted where the soldier rides and the row allows it, otherwise on
        foot or by ODM as try_step makes it (background-titans.yaml, retreat, moves)."""
        if s.cur_move:
            return False
        if getattr(s, "mounted", False) and can_step(s.pos, to, "mounted", self.t.grounded()):
            self.move(s, to, "mounted")
            return True
        return self.try_step(s, to)

    def retreat_toward(self, s, target):
        """Option 3: one step that lowers the number of Position steps to target."""
        if s.cur_move:
            return False
        d = steps_apart(s.pos, target)
        for to in ("in-reach", "on-body", "blind-spot", "distant"):
            if to != s.pos and frozenset((s.pos, to)) in STEPS and steps_apart(to, target) < d:
                if self.retreat_step(s, to):
                    return True
        return False

    def leave(self, s):
        """Option 2 (positions.yaml, leaving): a comrade the soldier carries leaves with them."""
        t = self.t
        s.cur_move = True
        s.left = True
        s.airborne = False
        self.stats["left"] += 1
        c = s.carrying
        if c is not None:
            c.left = True
            self.stats["carried_out"] += 1
        for x in (s, c):
            if x is not None and t.holder is x:
                t.holder = None   # attention.yaml, changes: the holder leaves

    def retreat_out(self, s):
        """Options 1 and 2: a step toward Distant, then leaving. A soldier at On Body or Blind Spot who can make no
        step lets go (positions.yaml, moves, letting_go) and falls."""
        if s.cur_move:
            return
        if s.pos == "distant":
            self.leave(s)
            return
        if self.retreat_step(s, "distant" if s.pos == "in-reach" else "in-reach"):
            return
        if s.pos in ("on-body", "blind-spot"):
            s.cur_move = True
            self.stats["lets_go"] += 1
            self.fall(s)

    def lift(self, s, c):
        """carrying.yaml, lifting_a_comrade: a Down comrade at the soldier's Position, spending the action."""
        s.cur_action = True
        s.carrying = c
        c.carried_by = s
        self.stats["lifts"] += 1

    def retreat_rescue(self, s, g):
        """Options 3 and 4 for a Grabbed comrade. From the victim's Position the action taken for them comes first,
        and the move changes nothing after it; from elsewhere the move is a step toward the hand, and the action
        follows. Returns False when neither applies, so the move is option 1 or 2."""
        t = self.t
        v = g["victim"]
        clear = g.get("clear", False)
        reach = {"on-body", "blind-spot"} if (g["lifted"] and not clear) else {"in-reach", "on-body", "blind-spot"}

        def act():
            if s.cur_action:
                return False
            if (s.pos in reach and s.handles
                    and (s.pos == "in-reach" or clear or s.odm_working() or t.grounded())):
                self.body_strike(s, g["arm"], max_help=0)
                return True
            if self.cfg.get("escapes") and self.can_decoy() and s.odm_working():
                need = self.ba_need(s)
                succ = self.break_attention(s, "odm", need)
                if succ >= need and t.grab is g:
                    self.decoy_success(s, succ, need)
                return True
            return False

        if s.pos == v.pos:
            if act():
                s.cur_move = True   # option 4: no change, after the action taken for the comrade
                return True
            return False
        if self.retreat_toward(s, v.pos):
            act()
            return True
        return False

    def retreat_turn(self, s):
        """A standing soldier's turn under the retreat (background-titans.yaml, retreat): the forced move, then the
        action, except option 4 and the lift (retreat, order)."""
        t = self.t
        g = t.grab
        if g is not None and g["victim"] is not s and not g["victim"].dead:
            if self.retreat_rescue(s, g):
                return
        if s.carrying is not None:
            self.retreat_out(s)
            return
        fallen = [c for c in self.present() if c is not s and c.down and not c.grabbed and c.carried_by is None]
        if fallen:
            c = min(fallen, key=lambda c: (steps_apart(s.pos, c.pos), self.card.get(c.name, 99)))
            if c.pos == s.pos:
                if not s.cur_action:
                    self.lift(s, c)      # PROVISIONAL lift exception: the lift, then the move that carries them out
                    self.retreat_out(s)
                    return
            elif self.retreat_toward(s, c.pos):
                if c.pos == s.pos and not s.cur_action:
                    self.lift(s, c)      # option 3, then the action
                return
        self.retreat_out(s)

    def end_turn(self, s, ban_started):
        s.card_passed = True
        if ban_started and s.ban > 0:
            s.ban -= 1

    # ---------------------------------------------------------------- the fight
    def standing(self):
        return any(not s.dead and not s.down and not s.left for s in self.sold)

    def run(self):
        t = self.t
        t.nb = self.roll_nb()
        self.evaluate(end_step=True)
        max_rounds = self.cfg.get("max_rounds", 12 if self.clock is None else SAFETY_CAP)
        for rnd in range(1, max_rounds + 1):
            self.rnd = rnd
            self.stats["rounds"] = rnd
            if self.retreat:
                self.stats["retreat_rounds"] += 1
            if self.tactic_ready("fallback"):
                stranded = [s for s in self.present() if not s.down and not s.grabbed
                            and s.pos in ("on-body", "blind-spot") and not s.odm_working() and not t.grounded()]
                if stranded:
                    self.use_tactic("fallback")
                    for s in stranded:
                        s.pos = "in-reach"
                        self.stats["fall_backs"] += 1
            alive = self.alive()
            n = len(alive) + t.tempo
            cards = self.rng.sample(range(1, 21), n)
            self.card = {s.name: cards[i] for i, s in enumerate(alive)}
            tcards = cards[len(alive):]
            for s in alive:
                s.cur_move = rnd in s.pre_turn
                s.cur_action = rnd in s.pre_turn or rnd in s.pre_action
                s.card_passed = False
                s.dodge_succ = None
                s.odm_used = s.odm_pushed = False
                s.start_pos = s.pos
            events = sorted([(c, s) for s, c in ((s, self.card[s.name]) for s in alive)] +
                            [(c, None) for c in tcards], key=lambda x: x[0])
            for c, who in events:
                if who is None:
                    self.titan_card()
                else:
                    if who.dead:
                        continue
                    self.soldier_turn(who)
                if t.dead:
                    self.stats["kill_round"] = rnd
                    break
                if not self.standing():
                    break
            if t.dead or not self.standing():
                break
            for s in self.alive():
                if s.odm_used:
                    dice = 3 if (s.odm_pushed and s.pc) else 2
                    s.gas = max(0, s.gas - sum(1 for _ in range(dice) if d6(self.rng) == 1))
            t.regen += 1
            if t.regen >= t.regen_len:
                t.openings = []
                for p in PARTS:
                    t.parts[p]["count"] = 0
                cand = [p for p in PARTS if t.parts[p]["state"] == 2] or [p for p in PARTS if t.parts[p]["state"] == 1]
                if cand:
                    t.parts[cand[0]]["state"] -= 1
                t.regen = 0
            # background-titans.yaml, ticks, retreat-clock: after the Background clocks, of which this model has none
            if self.clock is not None and not self.retreat and rnd >= self.clock:
                self.retreat = True
                self.stats["retreats"] += 1
        if not t.dead and not self.standing():
            # engagement-flow.yaml, left_behind: every soldier who still holds a Position dies
            for s in self.present():
                self.stats["deaths"] += 1
                self.stats["left_behind"] += 1
                s.dead = True
                s.counted_dead = True
        elif not t.dead and self.clock is not None:
            self.stats["cap"] += 1
        for s in self.alive():
            self.stats["lethal_at_end"] += sum(1 for c in s.cis if c["row"]["lethal"] and c["limit"] in ("turn", "engagement"))
        return self.stats


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    out = [Fight(rng, cfg).run() for _ in range(n)]
    return out


def summarize(results):
    n = len(results)
    kills = [r["kill_round"] for r in results]
    rounds_sorted = sorted(k if k is not None else 99 for k in kills)
    median = rounds_sorted[n // 2]
    by3 = sum(1 for k in kills if k is not None and k <= 3) / n
    by4 = sum(1 for k in kills if k is not None and k <= 4) / n
    nokill = sum(1 for k in kills if k is None) / n
    avg = lambda key: sum(r[key] for r in results) / n
    total_rounds = sum(r["rounds"] for r in results)
    nokill12 = sum(1 for k in kills if k is None or k > 12) / n
    out = dict(median=median, by3=round(by3 * 100, 1), by4=round(by4 * 100, 1), nokill=round(nokill * 100, 1),
                nokill12=round(nokill12 * 100, 1), retreats=round(100 * sum(r["retreats"] for r in results) / n, 1),
                left_behind=round(sum(r["left_behind"] for r in results) / n, 4),
                carried_out=round(sum(r["carried_out"] for r in results) / n, 4),
                lifts=round(sum(r["lifts"] for r in results) / n, 4), lets_go=round(sum(r["lets_go"] for r in results) / n, 4),
                cap=sum(r["cap"] for r in results), rounds_per_fight=round(total_rounds / n, 2),
                cis=round(avg("cis"), 2), deaths=round(avg("deaths"), 3), grabs=round(avg("grabs"), 3),
                devours=round(avg("devours"), 3), jams=round(avg("jams"), 3), dodges=round(avg("dodges"), 2),
                napes=round(avg("napes"), 2), bodies=round(avg("bodies"), 2), lethal_end=round(avg("lethal_at_end"), 3),
                refunds=round(avg("grab_dodge_refunds"), 4), ba_rescues=round(avg("ba_rescues"), 4),
                tactic_uses=round(avg("tactic_uses"), 2), fall_backs=round(avg("fall_backs"), 4),
                decoys=round(avg("decoys"), 2), feints=round(avg("feints"), 3), feint_rolls=round(avg("feint_rolls"), 2),
                devour_share=round(sum(r["devours"] for r in results) / max(1, sum(r["grabs"] for r in results)) * 100, 1),
                cards_resolved_per_round=round(sum(r["resolved"] for r in results) / total_rounds, 3),
                decoy_cards_per_round=round(sum(r["decoy_cards"] for r in results) / total_rounds, 3),
                decoy_cards_per_fight=round(avg("decoy_cards"), 2))
    if results[0].get("clock") is not None:
        del out["nokill12"]   # no horizon under the retreat clock (decision batch 5, 5-10)
    return out


def run_many(cfg, n, seed, procs=12):
    chunk = n // procs
    jobs = [(cfg, chunk, seed * 1000 + i) for i in range(procs)]
    with Pool(procs) as p:
        parts = p.map(run_cell, jobs)
    res = [r for part in parts for r in part]
    return summarize(res)


if __name__ == "__main__":
    import json
    cases = json.loads(sys.argv[1])
    n = int(sys.argv[2])
    for i, (label, cfg) in enumerate(cases):
        print(label, run_many(cfg, n, 7 + i), flush=True)
