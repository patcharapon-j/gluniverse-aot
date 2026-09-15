"""Full-fight model for Chapter 6: Chapter 5's prepared-Squad model (tools/probes/chapter-05/fight.py),
imported unchanged, fighting a Titan read from data/titans/ instead of the reference Titan.

What this file replaces or adds in the Chapter 5 model (everything else is inherited as written):
- the Titan: Tempo, Nape Depth, Regeneration clock, each Body Part's Toughness, and the fall band come
  from the Titan's YAML stat block and its Size Class row;
- rolling the Next Behavior: the move-up rule over the YAML table, with body_parts_used of every kind;
- a Titan's card: the entry's own Position requirement, fallback (Thrash if the fallback repeats the
  previous behavior or fails either test), targets (holder or holder-and-position), Attack Dice (rolled
  as Titan Dice through tools/sim/dice.py, as the simulator reads them: the whiff, cancellation, the rider
  per net success beyond the first, the Grab landing on its net successes; decision batch 8), and
  effects in order (stress, critical-injury at its Injury Location, knock-loose, grab, telegraph); a
  target who dies receives no later effect of the card;
- the Attention Ladder: the Titan's own rungs, from data/engagement/attention.yaml's tests, including
  current-holder for an Abnormal ladder (decision batch 3e, 3e-6), met only by a holder not at Distant
  (decision batch 4, 4-3; the quarry switch, "anywhere" before batch 4), with fight.py's nearest and
  tie_break switches (a tie the cards cannot break leaves Attention held by nothing, decision batch 4);
- the start of a Titan Engagement (data/engagement/engagement-flow.yaml, starting): after the first
  ladder evaluation, every soldier makes one Fear Roll if a trigger applies (the abnormal trigger for
  an Abnormal, and first-titan-engagement for a case that names it; data/mind/fear-rolls.yaml), and
  its spent actions and turns land on round 1;
- a mounted start (cfg mounted_start): every soldier starts mounted (data/engagement/positions.yaml,
  placement) and dismounts as part of their first move (data/gear/horses.yaml, mounted,
  within_a_move); a mounted soldier dodges with the horse, is not affected by knock-loose, and falls
  low from the horse when it goes lame or when they become Down (data/gear/falls.yaml, lame-mounted,
  down-mounted).
- a legal horse state (Chapter 6 review round 2, Codex Minor 1): each soldier's horse is mounted, holds the
  Position where its soldier dismounted (data/gear/horses.yaml, mounted, dismount; forced_dismount), or has
  bolted. A riderless-horse decoy needs the horse not lame and the soldier mounted on it or at its Position
  (data/engagement/attention.yaml, break_attention, decoys, riderless-horse); on success the soldier is
  dismounted with no fall and the horse leaves. Every Break Attention rolled with the horse wears it
  (horse_after), so a Pushed roll can lame it. The beside-the-holder screen's Squadmates start mounted,
  ride to the holder's Position when it is distant or in-reach, and send the horse from the saddle.
  `python fight6.py selftest` checks these cases.
Break Attention, the decoy's hold, the decoys-in-a-row reset, the flag rule, and the nearest reading are
inherited from fight.py (titan_card wraps this file's resolve_card, which follows fight.py's), so the rule as
revised in decision batches 3b, 3c, and 3e applies to every Chapter 6 Titan at its own Tempo: a flag lasts
until the end of the Titan's next card that resolves a behavior, so a card under a hold, a holding card, or a
card with no one holding its Attention leaves it standing, and the nearest rung narrows to the closest
Position even when it is the highest rung met. The beside-the-holder screen, Squad Tactic, and escape cases
run on its tables.
Sensitivity roles added: a mounted rider Squadmate who stays at Distant until the retreat (Chapter 5's Grab
countdown still runs if it is Grabbed), and cutters who take Draw Attention while a striker holds Attention, only
from a Position other than Distant (data/engagement/attention.yaml, draw_attention; decision batch 5, OQ-113;
DRAW_FROM_DISTANT True restores the reading before it for decision batch 4b's record probes). The loud rider of
decision batch 4b is no longer a legal policy and is not a role here (tools/probes/batch-4b/loud_b4b.py keeps its
record). The retreat clock and the retreat are fight.py's: a mounted soldier makes a retreat step mounted where
the row allows it, and a mounted carrier who falls drops the comrade from a horse's height.
A telegraph effect is counted but changes no policy choice: the baseline policy uses no revealed
Next Behavior (ADR-0014, as amended in decision batch 3).
"""
import os
import random
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "chapter-05"))
sys.path.insert(0, HERE)

import fight as f5                                   # noqa: E402  (tools/probes/chapter-05/fight.py)
from core import attr_roll, gain_ci, fall_damage, sim_dice   # noqa: E402
import titans                                                 # noqa: E402

A = sim_dice()   # tools/sim/dice.py: the Titan attack as the simulator's engine reads it (decision batch 8, 8-1, 8-2)

DRAW_FROM_DISTANT = False   # attention.yaml, draw_attention: not from Distant (decision batch 5, OQ-113)

TEST_FN = {
    "hooked-into-its-body": lambda s: s.pos == "on-body" or s.flags["hooked"],
    "nearest-person-in-reach": lambda s: s.pos == "in-reach",
    "just-hurt-it": lambda s: s.flags["hurt"],
    "loudest-or-brightest": lambda s: s.flags["loud"],
    "mounted": lambda s: getattr(s, "mounted", False),
    "airborne": lambda s: s.airborne and not getattr(s, "mounted", False),
    "carrying-a-comrade": lambda s: getattr(s, "carrying", None) is not None,   # carrying arises only in a retreat
    "down": lambda s: s.down,
}
DOWN_CAN_MEET = {tid: t["down_can_meet"] for tid, t in titans.TESTS.items()}


_BLOCKS = {}


def block(tid):
    if tid not in _BLOCKS:
        _BLOCKS[tid] = titans.load_titan(tid)
    return _BLOCKS[tid]


class Titan6:
    def __init__(self, tid, entry_over=None):
        b = block(tid)
        sc = titans.SIZES[b["size_class"]]
        self.block = b
        self.id = tid
        self.tempo = b["tempo"]
        self.nd = b["nape_depth"]
        self.regen_len = b["regeneration_clock"]
        self.large = sc["raises_fall_band"]
        self.part_tough = {p["id"]: p["toughness"] for p in b["body_parts"]}
        self.part_kind = {p["id"]: p["kind"] for p in b["body_parts"]}
        self.parts = {p["id"]: {"state": 0, "count": 0} for p in b["body_parts"]}
        self.entries = titans.by_id(b)
        for eid, over in (entry_over or {}).items():   # sensitivity rows only
            e = dict(self.entries[eid])
            e.update(over)
            self.entries[eid] = e
        self.by_result = titans.by_result(b)
        self.rungs = titans.rungs(b)
        self.openings = []
        self.regen = 0
        self.prev = None
        self.nb = None
        self.holder = None
        self.grab = None
        self.dead = False
        self.decoyed = False
        self.decoys_spent = 0
        self.hold_left = 0

    def tough(self, p):
        if self.grab and self.grab["arm"] == p:
            return 1
        return self.part_tough[p]

    def unbroken(self, kind):
        return sum(1 for p, k in self.part_kind.items() if k == kind and self.parts[p]["state"] < 2)

    def unbroken_all(self):
        return {k: self.unbroken(k) for k in ("eyes", "arm", "leg")}

    def grounded(self):
        return any(self.parts[p]["state"] == 2 for p, k in self.part_kind.items() if k == "leg")

    def parts_ok(self, entry):
        return titans.parts_ok(entry, self.unbroken_all())


class Fight6(f5.Fight):
    def __init__(self, rng, cfg):
        tid = cfg["titan_id"]
        cfg = dict(cfg)
        cfg["size"] = block(tid)["size_class"]
        super().__init__(rng, cfg)
        self.t = Titan6(tid, cfg.get("entry_over"))
        for k, v in cfg.get("titan", {}).items():
            setattr(self.t, k, v)
        if "rungs" in cfg:
            self.t.rungs = cfg["rungs"]
        for key in ("telegraphs", "draws", "draws_barred", "rider_harm", "grab_cards", "start_fear_rolls", "lame"):
            self.stats[key] = 0

    def add(self, s, role):
        super().add(s, role)
        s.mounted = role in ("rider", "screen2") or bool(self.cfg.get("mounted_start"))
        s.horse_pos = s.pos   # where the horse stands once its soldier dismounts (horses.yaml, mounted)

    def dismount(self, s):
        """horses.yaml, mounted, dismount: the horse stays at the Position the soldier holds."""
        s.mounted = False
        s.horse_pos = s.pos

    def horse_usable(self, s):
        """attention.yaml, break_attention, decoys, riderless-horse: the soldier's own horse has not bolted
        and is not lame, and the soldier is mounted on it or it holds the soldier's Position."""
        return s.horse_here and s.horse > 0 and (s.mounted or s.horse_pos == s.pos)

    def quarry_rule(self):
        """quarry "not_distant", the rule (decision batch 4, 4-3; attention.yaml, tests, current-holder): an
        Abnormal ladder's current-holder rung is met by the soldier holding the Titan's Attention only while
        they hold a Position other than Distant. "anywhere": the test before batch 4, met wherever they stand."""
        return self.cfg.get("quarry", "not_distant")

    # ---------------------------------------------------------------- the start of the Titan Engagement
    def run(self):
        self._starting = True
        return super().run()

    def start_triggers(self):
        if "start_fear" in self.cfg:
            return list(self.cfg["start_fear"])
        return ["abnormal"] if self.t.block["abnormal"] else []

    def start_fear_rolls(self):
        """engagement-flow.yaml, starting, step 6: one Fear Roll per soldier for the start, whichever
        triggers apply (fear-rolls.yaml, limits, one_per_event). Round 0 has no turn left to spend, so
        spent actions and turns land on round 1."""
        if not self.start_triggers():
            return
        for s in self.alive():
            s.cur_move = s.cur_action = True
            self.fear(s)
            s.cur_move = s.cur_action = False
            self.stats["start_fear_rolls"] += 1

    def move(self, s, to, kind):
        if getattr(s, "mounted", False) and kind != "mounted":
            self.dismount(s)   # the move includes a dismount before its change (horses.yaml, mounted, within_a_move)
        super().move(s, to, kind)

    def fall_from_horse(self, s):
        """falls.yaml, height: a fall from a horse is low, whatever the Titan's Size Class. The horse stays
        at the Position (horses.yaml, forced_dismount). A comrade the soldier carries falls from a horse too
        (falls.yaml, triggers, carried)."""
        self.drop_carried(s, fall=True, horse=True)
        self.dismount(s)
        self.stats["falls"] += 1
        row = fall_damage(self.rng, s, "low")
        if row is not None:
            self.stats["cis"] += 1
            self.after_harm(s, row)

    # ---------------------------------------------------------------- the Next Behavior
    def roll_nb(self):
        t = self.t
        r = f5.d6(self.rng)
        for i in range(6):
            eid = t.by_result[(r - 1 + i) % 6 + 1]
            if eid != t.prev and t.parts_ok(t.entries[eid]):
                return eid
        return "thrash"

    # ---------------------------------------------------------------- Attention
    def evaluate(self, end_step=False):
        t = self.t
        cands = self.present()
        if not cands:
            t.holder = None
            return
        most = max(len(c.cis) for c in cands)

        def meets(s, rung):
            if rung == "nearest":
                return True
            if s.down and not DOWN_CAN_MEET[rung]:
                return False
            if rung == "most-harmed":
                return len(s.cis) == most
            if rung == "current-holder":
                # attention.yaml, tests, current-holder: the holder meets it only while not at Distant
                # (decision batch 4, 4-3); quarry "anywhere" is the test before batch 4.
                return t.holder is s and (self.quarry_rule() == "anywhere" or s.pos != "distant")
            return TEST_FN[rung](s)

        rungs = t.rungs
        top = next(i for i, r in enumerate(rungs) if any(meets(s, r) for s in cands))
        tied = [s for s in cands if meets(s, rungs[top])]
        if rungs[top] == "nearest" and self.nearest_rule() == "narrows":
            # attention.yaml, tests, nearest: as the highest rung met, only the candidates at the closest
            # Position meet it (decision batch 3e, 3e-6).
            best = min(f5.NEAREST[s.pos] for s in tied)
            tied = [s for s in tied if f5.NEAREST[s.pos] == best]
        if rungs[top] == "hooked-into-its-body":
            struck = [s for s in tied if s.flags["hooked"]]
            if struck:
                tied = struck
        for r in rungs[top + 1:]:
            if r == "nearest":
                best = min(f5.NEAREST[s.pos] for s in tied)
                tied = [s for s in tied if f5.NEAREST[s.pos] == best]
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
        if getattr(self, "_starting", False):
            self._starting = False
            self.start_fear_rolls()

    # ---------------------------------------------------------------- a Titan's card
    def choose(self, h):
        t = self.t
        if t.nb == "thrash":
            return "thrash"
        e = t.entries[t.nb]
        if not t.parts_ok(e):
            return "thrash"
        if h.pos in e["position_requirement"] and not (getattr(h, "mounted", False) and False):
            return t.nb
        fb = e["fallback"]
        if fb == "thrash" or fb == t.prev:
            return "thrash"
        fe = t.entries[fb]
        if not t.parts_ok(fe) or h.pos not in fe["position_requirement"]:
            return "thrash"
        return fb

    def harmful(self, s, effects):
        policy = self.cfg.get("dodge", "harm")
        for eff in effects:
            if eff["type"] == "grab":
                return True
            if eff["type"] == "critical-injury":
                if policy == "harm" or not eff["cannot_be_lethal"]:
                    return True
            if (policy == "harm" and eff["type"] == "knock-loose" and not getattr(s, "mounted", False)
                    and (s.airborne or s.pos in ("on-body", "blind-spot"))):
                return True
        return False

    def horse_after(self, s, res):
        if res["gear_ones"]:
            s.horse = max(0, s.horse - res["gear_ones"])
            if s.horse == 0 and s.mounted:
                self.stats["lame"] += 1
                self.fall_from_horse(s)
        if res["spend_turn"]:
            self.spend_turn(s)

    def resolve_card(self):
        t = self.t
        if t.dead:
            return
        t.decoyed = False
        rule = self.flag_rule()
        if t.grab:
            # As fight.py: a holding card resolves nothing and leaves the flags standing (decision batch 3e).
            if rule != "acting":
                self.clear_flags()
            self.stats["grab_cards"] += 1
            return
        if t.holder == "decoy":
            not_last = self.hold_card_not_last()
            t.holder = None
            t.prev = t.nb
            t.nb = self.roll_nb()
            t.decoyed = True
            self.stats["decoy_cards"] += 1
            # As fight.py: only the hold's last card evaluates the ladder (decision batch 3c, 3c-4), and no
            # card of the hold clears the flags (decision batch 3e, 3e-1); on an earlier card this
            # evaluation is overwritten by titan_card.
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
        beh = self.choose(h)
        entry = t.entries[beh]
        effects = entry["effects"]
        if entry["targets"] == "holder":
            targets = [h]
        else:
            targets = [s for s in self.present() if s.pos == h.pos and not s.grabbed]
            targets.sort(key=lambda s: self.card.get(s.name, 99))
        # decision batch 8, 8-1 (ADR-0019), as tools/sim/engine.py reads it: the entry's Attack Dice are rolled once as
        # Titan Dice, and every target compares against the same successes (A.attack_net: the whiff, cancellation)
        tsucc = A.titan_roll(self.rng, entry.get("attack_dice") or 0)
        info = {}
        for s in targets:
            dodge_round = None
            first_counted = self.rnd if not s.card_passed else self.rnd + 1
            if (tsucc >= 1 and s.dodge_succ is None and self.harmful(s, effects) and not s.down and not s.grabbed
                    and s.ban == 0):
                dodge_round = self.spend_turn(s)
                gear = "horse" if s.mounted else "odm"
                res = attr_roll(self.rng, s, "dodge", s.agi, s.talents.get("dodge", 0), 0, gear, push_to=tsucc)
                self.stats["dodges"] += 1
                if gear == "odm":
                    self.odm_roll_after(s, res, s.odm_working() or res["gear_ones"] > 0)
                else:
                    self.horse_after(s, res)
                s.dodge_succ = res["succ"]
            info[s.name] = (A.attack_net(tsucc, s.dodge_succ), dodge_round, first_counted)
        for s in targets:
            net, dodge_round, first_counted = info[s.name]
            if net < 1 or s.dead:
                continue
            for eff in effects:
                if s.dead:
                    break
                typ = eff["type"]
                if typ == "stress":
                    s.stress += eff["amount"]
                elif typ == "critical-injury":
                    loc = None if eff["injury_location"] == "rolled" else eff["injury_location"]
                    row = gain_ci(self.rng, s, loc, cannot_be_lethal=eff["cannot_be_lethal"], rider=A.ci_rider(net))
                    self.stats["cis"] += 1
                    if s.mounted:
                        self.stats["rider_harm"] += 1
                    self.after_harm(s, row)
                    if not s.dead and s.down and s.airborne:
                        self.fall(s)
                    elif not s.dead and s.down and s.mounted:
                        self.fall_from_horse(s)   # horses.yaml, forced_dismount, down
                    self.carry_check(s)
                elif typ == "knock-loose":
                    if not s.mounted and (s.airborne or s.pos in ("on-body", "blind-spot")):
                        self.fall(s)
                elif typ == "grab":
                    if not A.grab_net_lands(net):
                        continue     # grab.yaml, grab_lands, lands_on
                    if (dodge_round is not None and dodge_round > first_counted
                            and self.cfg.get("grab_refund", True)):
                        s.pre_turn.discard(dodge_round)
                        if first_counted == self.rnd:
                            s.cur_move = s.cur_action = True
                        else:
                            s.pre_turn.add(first_counted)
                        self.stats["grab_dodge_refunds"] += 1
                    if s.mounted:
                        self.dismount(s)   # horses.yaml, forced_dismount, grabbed: no fall
                    self.grab_lands(s)
        if any(e["type"] == "telegraph" for e in effects):
            self.stats["telegraphs"] += 1
        t.prev = beh
        t.nb = self.roll_nb()
        self.stats["resolved"] += 1
        if rule == "acting":
            self.clear_flags()   # the Next step of a card that resolved a behavior (decision batch 3e, 3e-1)

    # ---------------------------------------------------------------- the horse as a decoy
    def break_attention(self, s, gear, need):
        """fight.py's Break Attention, except that a roll made with the horse wears it (horse_after), so a
        Pushed roll can lame it (data/gear/horses.yaml, wear)."""
        if gear != "horse":
            return super().break_attention(s, gear, need)
        s.cur_action = True
        res = attr_roll(self.rng, s, "break-attention", s.per, 0, 0, "horse", push_to=need)
        self.horse_after(s, res)
        return res["succ"]

    def decoy_success(self, s, succ, need, horse=False):
        super().decoy_success(s, succ, need, horse)
        if horse:
            s.mounted = False   # riderless-horse, on_success: dismounted with no fall; the horse leaves
            s.horse_pos = None

    def screen_horse_turn(self, s):
        """The beside-the-holder screen's horse phase with a legal horse state: a mounted Squadmate rides to
        the Attention holder's Position when it is distant or in-reach, then sends the horse, from the saddle
        or from beside it. Other steps of a turn are fight.py's."""
        t = self.t
        s.turns += 1
        ban_started = s.ban > 0
        if not s.handles and s.blades > 0:
            s.handles = True
        h = t.holder
        hpos = h.pos if h not in (None, "decoy") else None
        if (s.mounted and hpos in ("distant", "in-reach") and s.pos != hpos and not s.cur_move
                and f5.can_step(s.pos, hpos, "mounted", t.grounded())):
            self.move(s, hpos, "mounted")
        if not s.cur_action and self.can_decoy():
            need = self.ba_need(s)
            succ = self.break_attention(s, "horse", need)
            if succ >= need and not t.dead:
                self.decoy_success(s, succ, need, horse=True)
        self.death_rolls(s)
        self.end_turn(s, ban_started)

    # ---------------------------------------------------------------- soldiers
    def helpers(self, roller, n):
        if n <= 0:
            return []
        out = []
        for h in self.present():
            if h is roller or h.down or h.grabbed or h.cur_action or h.role in ("decoyer", "rider"):
                continue
            if f5.steps_apart(h.pos, roller.pos) > 1:
                continue
            if not (h.card_passed or h.role == "helper" or (h.role == "striker" and h.start_pos == "distant")):
                continue
            out.append(h)
        out.sort(key=lambda h: (not h.card_passed,))
        out = out[:n]
        for h in out:
            h.cur_action = True
        return out

    def soldier_turn(self, s):
        t = self.t
        if s.left or s.carried_by is not None or (self.retreat and not s.down and not s.grabbed):
            # A soldier who has left, a carried soldier, and every standing soldier's turn under the retreat are
            # fight.py's (decision batch 5, 5-1 and 5-10).
            return super().soldier_turn(s)
        if s.role == "rider" and not (s.grabbed and t.grab and t.grab["victim"] is s):
            s.turns += 1
            ban_started = s.ban > 0
            if s.down:
                s.cur_action = True
            self.death_rolls(s)
            self.end_turn(s, ban_started)
            return
        if (self.cfg.get("draw_attention") and s.role == "cutter" and not s.down and not s.grabbed
                and not t.grab and not t.dead and not s.cur_action):
            h = t.holder
            if h not in (None, "decoy") and h is not s and h.role == "striker":
                if s.pos != "distant" or DRAW_FROM_DISTANT:
                    # attention.yaml, draw_attention: a Position other than Distant (decision batch 5, OQ-113)
                    s.flags["loud"] = True
                    s.cur_action = True
                    self.stats["draws"] += 1
                else:
                    self.stats["draws_barred"] += 1
        if (s.role == "screen2" and self.horse_usable(s) and not s.down and not s.grabbed
                and not t.grab and not t.dead):
            self.screen_horse_turn(s)
            return
        # fight.py reads horse_here as "the horse can be sent from here"; a horse that is lame, or that
        # stands at another Position, cannot be, though it is still in the Titan Engagement.
        usable = self.horse_usable(s)
        kept = s.horse_here
        s.horse_here = kept and usable
        super().soldier_turn(s)
        if kept and not usable:
            s.horse_here = True


def run_cell(args):
    cfg, n, seed = args
    rng = random.Random(seed)
    return [Fight6(rng, cfg).run() for _ in range(n)]


def standard_error(values):
    n = len(values)
    mean = sum(values) / n
    return (sum((v - mean) ** 2 for v in values) / (n - 1) / n) ** 0.5


def summarize(results):
    out = f5.summarize(results)
    n = len(results)
    # fight.py rounds these more coarsely than their standard errors; the tables format their own digits
    out["cis"] = round(sum(r["cis"] for r in results) / n, 4)
    out["deaths"] = round(sum(r["deaths"] for r in results) / n, 4)
    p = sum(1 for r in results if r["kill_round"] is None) / n
    out["nokill"] = round(100 * p, 2)
    out["nokill_se"] = round(100 * (p * (1 - p) / n) ** 0.5, 3)
    out["cis_se"] = round(standard_error([r["cis"] for r in results]), 4)
    out["deaths_se"] = round(standard_error([r["deaths"] for r in results]), 4)
    if results[0].get("clock") is None:
        # the 12-round horizon, for the batch probes that pin it to repeat their records
        out["nokill12"], out["nokill12_se"] = out["nokill"], out["nokill_se"]
    for key in ("telegraphs", "draws", "draws_barred", "rider_harm", "start_fear_rolls", "lame"):
        out[key] = round(sum(r[key] for r in results) / n, 3)
    out["decoys_per_fight"] = round(sum(r["decoys"] for r in results) / n, 2)
    out["by2"] = round(100 * sum(1 for r in results if r["kill_round"] is not None and r["kill_round"] <= 2) / n, 1)
    return out


def run_many(cfg, n, seed, procs=None):
    from multiprocessing import Pool
    procs = procs or os.cpu_count() or 4
    chunk = max(1, n // procs)
    jobs = [(cfg, chunk, seed * 1000 + i) for i in range(procs)]
    with Pool(procs) as p:
        parts = p.map(run_cell, jobs)
    return summarize([r for part in parts for r in part])


def selftest():
    """Deterministic checks of the horse state (Chapter 6 review round 2, Codex Minor 1). Returns a list of
    failures."""
    bad = []
    cfg = {"titan_id": "standard-medium", "policy": "eager", "squadmates": 2, "squadmate_role": "screen2"}
    fg = Fight6(random.Random(1), cfg)
    s = next(x for x in fg.sold if x.role == "screen2")
    if not s.mounted or not fg.horse_usable(s):
        bad.append("a screen Squadmate starts mounted with a usable horse")
    fg.decoy_success(s, 1, 1, horse=True)
    if s.mounted or fg.horse_usable(s):
        bad.append("a sent horse leaves its soldier dismounted and cannot be used again")
    fg.t.holder = s
    s.dodge_succ = None
    gear = "horse" if s.mounted else "odm"
    if gear != "odm":
        bad.append("a soldier whose horse has bolted dodges with ODM Gear, not the horse")
    p = next(x for x in fg.sold if x.role == "cutter")
    p.mounted = True
    p.horse_pos = p.pos
    fg.move(p, "in-reach", "foot")
    if p.mounted or p.horse_pos != "distant" or fg.horse_usable(p):
        bad.append("a dismounted horse stays where its soldier dismounted and does not follow a move")
    q = next(x for x in fg.sold if x.role == "screen2" and x is not s)
    q.horse = 1
    fg.horse_after(q, {"gear_ones": 1, "spend_turn": False})
    if q.horse != 0 or q.mounted or fg.horse_usable(q):
        bad.append("a horse roll whose Gear Die shows 1 can lame the horse, and its mounted soldier falls")
    return bad


if __name__ == "__main__":
    if sys.argv[1:] == ["selftest"]:
        failures = selftest()
        print("horse-state selftest:", failures or "passed")
        sys.exit(1 if failures else 0)
