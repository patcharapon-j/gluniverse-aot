"""The Titan Engagement engine: one Focus Titan against a Squad, round by round (Chapter 5, with Chapters 1, 3,
4, and 6). This file holds what the rules make happen; every choice a player or Squadmate makes is in
policy.py, which this file calls at the points a choice arises.

Rules as written, from data/ YAML through rules.R:
- the round (round.yaml, round_steps): the wings step (Wings assigned and standing, changed only after a
  death, Down, Grab, or a soldier leaving), the deal (cards 1 to 20, one per soldier not on a Wing and Tempo per
  Titan; a Squadmate on a Wing acts right after its player character), the swap step, cards lowest first, end
  steps Gas Rolls, Regeneration, then the background clocks, of which the retreat clock is the only one this model
  has; when a kill or no-soldier-standing ends the Titan Engagement partway through a round, that round's Gas Rolls
  are made at once, before the end steps of engagement-end.yaml, and a soldier who dies after using ODM Gear makes
  theirs at death (odm-gear.yaml, gas_roll, when and canister_removed);
- the retreat clock and the retreat (decision batch 5, 5-1 and 5-10; background-titans.yaml, retreat_clock, ticks,
  retreat): the clock fills 1 segment at the background-clocks end step, never during a retreat, and when it is
  full the Titan Engagement becomes a retreat. Under the retreat a soldier the retreat's moves bind makes the
  forced move before the action (the engine raises otherwise), except a stay-with-a-comrade move after the action
  taken for that comrade and a move after a lift; leaving, letting go, and no return. A soldier who has left
  still takes turns (turn-limit Death Rolls) and makes Gas Rolls, but is no candidate, target, helper, or witness.
  A Titan Engagement always ends (engagement-flow.yaml, ending, always_ends): by a kill, by no soldier standing
  (every soldier still holding a Position then dies, left behind), or through the retreat. SAFETY_CAP is a model
  check, not a rule: stats["cap"] counts a fight that reaches it, and none should;
- the start: Next Behavior, placement at Distant (mounted or not), the ladder evaluated, then the start's
  Fear Rolls (first-titan-engagement, abnormal), one per soldier;
- Positions and moves by the Anchor Rating's step rows, the grounded Titan's on-foot steps and Open step,
  Fly rolls, mounting and dismounting within a move, the Down soldier's crawl, carrying a comrade and being
  Overloaded;
- the Attention Ladder: the Titan's rungs from the closed tests list, struck-first, narrowing, nearest met
  at the closest Position, the holder step, the card step, and none; flags that last until the end of the
  Titan's next card that resolves a behavior;
- a Titan's card: dead, holding, decoy, attention, choose, reactions (one dodge per Titan per round, with
  Help, Covering, and Call It's Bonus Dice when a policy gives them), effects in card order skipping a dead
  target, next;
- Read and Call It (read.yaml); Draw Attention from a Position other than Distant (attention.yaml,
  draw_attention); Body Part strikes (eyes included), grounding, Openings, Nape strikes and the Nape kill's Stress
  relief, Regeneration; Break Attention with its four decoys; the Grab's landing in grab_lands' order (the hold
  before the crush), countdown, lift, devour, escapes (Break Free with Help, Pry Loose on its own row, the holding
  arm, Break Attention); Squad Tactics; Treat Injury in the fight;
- Push wear, Jams, running dry, Change Canister, Field Repair, Blade Sets, horses;
- Critical Injuries with a side and an Injury Type, the table's rider for that type applied (decision batch 7, 7-4
  and 7-5), Health boxes, Down and its end, falls (a carried comrade falls with the carrier; a fall is read
  relative to its reference Titan, which with one Focus Titan is always that Titan: falls.yaml, height),
  turn-limit Death Rolls, witnesses' Fear Rolls with every Scar row's trigger (scars.yaml), the left-behind
  ending;
- the end of a Titan Engagement (engagement-end.yaml, steps, in order): turns, Stress relief, lasting Stress
  Responses, turn limits, aftermath rolls, Death Rolls, the care window (Treat Injury with Help, Covering,
  and medical supplies; Field Repair), Scars from stabilized injuries, Grief, and retirement. The steps read each
  soldier's last Positions, the ones held when the Focus Titan died (engagement-end.yaml, positions_read), and
  soldiers who left count as holding the same Position as each other and no Position near anyone else;
- a day passing (healing.yaml, each_day, and day_passes, interim): the day care window, day-limit Death Rolls,
  Health lost to damage restored, and healing time.
- the field (ADR-0029; decision batch 16; space.py): a generated field of zones with the terrain mix, the Titan in the
  centre and the Squad in the start zone; each soldier's zone and attachment, their Positions derived and never
  stored (Soldier.pos); the Stride between the attention and choose steps, carrying on-body and grabbed soldiers and
  leaving the Blind Spot behind; moves over zones (on foot one step, mounted up to the mounted pace, a Flight rolled
  for fly with its first step free and each Carry paid in Momentum, never ending free in an Open zone); Momentum
  capped by the zone, spent on Carry, quiet, and bite, lost at the round's end without an ODM move; the crossing and
  no-successes flags; wrecks by zone with the Sparse grace and a zone made Open under a standing Titan; the Down
  soldier's crawl out of a body's zone; leaving from an edge zone; the retreat of 16-27; holder-and-position targets
  in the holder's zone; Help and every between-soldiers test read in zones.
Not modelled (report section 12 and the Open Questions it names): a second Focus Titan, Background Titans (so no
entry zone is ever used: space.entry_zone is tested, not run), leaving and returning outside a retreat, the mounted
charge (no policy charges), and brace and clean line (no policy spends them).
"""
import random

import space
from dice import roll, gain_ci, fall_damage, death_roll, gain_scar, take_damage, titan_roll, use_talent, COUNT
from dice import fear_result, apply_fear_result
from dice import attack_net, ci_rider, grab_net_lands
from rules import R, D, IR, OB, BS, ODM_STRIKE_POSITIONS, GRAB_CRUSH_LOCATION, GRAB_CRUSH_TYPE
from rules import FALL_PATH, STEAM_AT_KILL, STEAM_AT_REGEN, HEAVE_FROM
import policy as P

CLOSE = R.grounded_close
NEAREST = R.nearest_rank
END_STEP_IDS = ["turns", "stress-relief", "lasting-stress-responses", "turn-limits", "aftermath-rolls", "death-rolls",
                "care-window", "grief", "retirement-and-promotion"]
if R.end_steps != END_STEP_IDS:
    raise ValueError(f"engagement-end.yaml: the steps changed ({R.end_steps}); engine.Fight.end_engagement follows the old order")

STAT_KEYS = ("cis", "pc_cis", "deaths", "pc_deaths", "grabs", "devours", "grab_deaths", "jams", "dodges", "napes",
             "bodies", "resolved", "decoy_cards", "rounds", "lethal_at_end", "falls", "grab_dodge_refunds", "ba_rescues",
             "tactic_uses", "fall_backs", "decoys", "feints", "feint_rolls", "onfoot_feints", "telegraphs", "draws",
             "rider_harm", "grab_cards", "start_fear_rolls", "fear_rolls", "lame", "thrash", "left_behind", "canisters",
             "repairs", "repair_rolls", "flares", "cloaks", "horses_sent", "fly_rolls",
             # the end of the Titan Engagement
             "end_deaths", "pc_end_deaths", "aftermath_patients", "aftermath_rolls", "aftermath_saves", "aftermath_self",
             "aftermath_none", "end_death_rolls", "care_rolls", "care_saves", "care_helps", "care_supplies",
             "care_repairs", "care_covers", "untreated_after", "lethal_day_after", "scars_gained", "retiring",
             # round-time counters (round.yaml, round_time)
             "tracker_writes", "ladder_evals", "pools", "gas_rolls", "grab_rounds", "grab_round_writes",
             "grab_round_evals", "grab_round_pools", "grab_round_dodges", "grab_round_fears", "grab_round_gas",
             # rules this pass added
             "reads", "read_successes", "calls", "call_dodges", "dodge_helps", "covers", "jam_dodges", "lame_dodges",
             "swaps", "wing_changes", "wing_turns", "treats", "treat_saves", "pry_rolls", "pry_frees", "lifts",
             "carried_to_distant", "mounts", "eye_breaks", "overloaded_moves",
             # the Gas Rolls of a round a rule ends partway, and of a soldier who dies after using ODM Gear
             "gas_rolls_at_end", "gas_rolls_at_death",
             # the retreat clock and the retreat (decision batch 5, 5-10): fights in which it began, its rounds, soldiers
             # who left, comrades carried out, soldiers who let go, and fights reaching the safety cap (none should)
             "retreats", "retreat_rounds", "left", "carried_out", "lets_go", "cap",
             # Draw Attention a policy would have taken from Distant, which the rule bars (decision batch 5, 5-8)
             "draws_barred",
             # the Fear rows' effect types (decision batch 7, 7-8): loudest flags set, comrades given Stress, forced
             # steps made, Blade Sets dropped, and Gas Rolls forced (forced strikes are counted as the strikes they are)
             "fear_draws", "fear_contagion", "fear_moves", "fear_blade_drops", "fear_gas_rolls",
             # decision batch 8: Titan rolls, whiffs, soldiers a card landed on, Critical Injuries with a rider (8-1,
             # 8-2); steam rolls at the kill and at a Regeneration fill and the Critical Injuries steam made (8-7);
             # Leap Clear rolls and clears, pins, corpse-heat Critical Injuries and deaths, Heaves, soldiers freed, and
             # fights that ran on after the kill for a Pinned soldier (8-9)
             "titan_rolls", "whiffs", "lands", "rider_cis", "steam_kill", "steam_regen", "steam_cis", "leap_rolls",
             "leap_clears", "pins", "heat_cis", "heat_deaths", "heaves", "freed", "ran_on",
             # decision batch 13 (13-9, 13-10): cards whose behavior retargeted down the Attention Ladder, cards that
             # fell back or Thrashed because no soldier met the entry, and behavior rolls a Titan's Frenzy lifted
             "retargets", "retarget_misses", "frenzy_lifts", "nb_rolls",
             # soldiers freed by cutting the pinning Body Part, and grab effects that landed only their crush (8-17, 8-18)
             "cut_free", "pinned_crushes",
             # turns taken while Pinned, and Pinned soldiers who died left under the body at the end (8-21, 8-26)
             "pinned_turns", "pinned_left",
             # retreats in which the stay limit ended a stay beside a Pinned comrade, and the Pinned who then died (8-32)
             "stay_limit_ended", "stay_limit_pinned_died",
             # the Talent sensitivity rows (decision batch 7, 7-2): rule Talents that fired, Mid-Air Catch rolls
             "talent_fires", "catch_rolls",
             # a day passing (healing.yaml, each_day)
             "day_death_rolls", "day_deaths", "pc_day_deaths", "healed", "day_health_restored",
             # the field (decision batch 16, 16-38): cards that reached the stride step with a holder in another zone,
             # cards that strode, zones strode, and strides that brought the holder into the Titan's zone
             "stride_steps", "strides", "stride_zones", "stride_reach",
             # Flights: rolled, with a Carry, Carries, with no successes, rolled with no step taken, crossing a Focus
             # Titan's zone, loudest flags they set; Momentum gained, spent (on Carry, quiet, and bite), and lost to a
             # cap, a state, or the round's end; flags quiet stopped
             "flights", "flights_carry", "carries", "flights_no_successes", "flights_still", "crossings", "flight_flags",
             "momentum_gained", "momentum_spent", "momentum_carry", "momentum_quiet", "momentum_bite", "momentum_lost",
             "quiet_stops",
             # wrecks (16-20, 16-21): wreck effects and falling Titans, rating steps taken, Sparse graces, zones made
             # Open under a standing Titan, and fights in which the Titan's zone lost its Blind Spot while it stood
             "wrecks", "wreck_steps", "wreck_graces", "zones_opened", "bs_lost",
             # Down soldiers' crawls out of a body's zone, soldiers the Stride carried, and Blind Spots it left behind
             "crawls", "stride_carried", "stride_left",
             # Help on a Nape strike, and the part of it given from an adjacent zone (16-11)
             "nape_helps", "nape_helps_adjacent",
             # round 1 on its own (16-38): Critical Injuries, player characters' Critical Injuries, cards that landed
             "r1_cis", "r1_pc_cis", "r1_lands")

# A model check, not a rule: under the retreat clock every Titan Engagement ends (engagement-flow.yaml, ending,
# always_ends), so no fight should reach this many rounds. stats["cap"] counts one that does.
SAFETY_CAP = R.safety_cap   # data/engagement/tuning.yaml, prepared_squad_kill, model, retreat
GRAB_STEP_IDS = ["failed-dodge", "hold", "crush", "attention", "witnesses"]
if R.grab_steps != GRAB_STEP_IDS:
    raise ValueError(f"grab.yaml grab_lands steps changed ({R.grab_steps}); engine.Fight.grab_lands follows the old order")


class _Placed:
    """A placement (zone, kind, body) read as a soldier for space.derive_position."""
    __slots__ = ("zone", "attach", "left")

    def __init__(self, place):
        self.zone, self.attach, self.left = place[0], (place[1], place[2]), False


# ---------------------------------------------------------------------- the Titan
class Titan:
    def __init__(self, cfg):
        block = dict(R.titan_blocks[cfg["titan_id"]])
        entries = [dict(e) for e in block["behavior_table"]["entries"]]
        parts = [dict(p) for p in block["body_parts"]]
        if cfg.get("size_class") or cfg.get("dice"):
            # Chapter 5's reference table at a Size Class's values (tuning.yaml, simulation_reference_titan), its Attack
            # Dice by tier, Thrash at the control pool (decision batch 8, 8-1); a telegraph-only entry rolls none
            sc = R.size_classes[cfg.get("size_class") or block["size_class"]]
            block.update(size_class=sc["id"], tempo=sc["tempo"], nape_depth=sc["nape_depth"],
                         regeneration_clock=sc["regeneration_clock"])
            parts = [dict(p, toughness=sc["toughness"][p["kind"]]) for p in parts]
            dice = dict(sc["attack_dice"])
            dice.update(cfg.get("dice", {}))
            for e in entries:
                if e.get("attack_dice"):
                    e["attack_dice"] = dice["control"] if e["tier"] == "thrash" else dice[e["tier"]]
        for k, v in cfg.get("titan", {}).items():   # sensitivity rows only
            block[k] = v
        for eid, over in cfg.get("entry_over", {}).items():   # sensitivity rows only
            for e in entries:
                if e["id"] == eid:
                    e.update(over)
        sc = R.size_classes[block["size_class"]]
        self.id = block["id"]
        self.abnormal = bool(block.get("abnormal"))
        self.tempo = block["tempo"]
        self.nd = block["nape_depth"]
        self.regen_len = block["regeneration_clock"]
        # decision batch 8, 8-9: the body's Heave rating (an Abnormal's own, else its Size Class's) and heave count
        self.heave_rating = block.get("heave", sc["heave"])
        self.heave_count = 0
        self.raises_fall = bool(sc["raises_fall_band"])
        self.part_ids = [p["id"] for p in parts]
        self.kind = {p["id"]: p["kind"] for p in parts}
        self.tough0 = {p["id"]: p["toughness"] for p in parts}
        self.state = {p: 0 for p in self.part_ids}
        self.count = {p: 0 for p in self.part_ids}
        self.entries = {e["id"]: e for e in entries}
        self.by_result = {r: e["id"] for e in entries for r in e["results"]}
        self.thrash = next(e["id"] for e in entries if e["tier"] == "thrash")
        self.rungs = list(cfg.get("rungs") or R.ladders[block["attention_ladder"]])
        self.openings = []
        self.regen = 0
        self.prev = None
        self.nb = None
        self.nb_serial = 0          # which Next Behavior this is, for Call It's once-per-Next-Behavior rule
        self.nb_revealed = False
        self.ladder_revealed = not self.abnormal    # read.yaml: a standard Titan's ladder is public
        self.revealed = set()
        self.called = None          # {"serial", "reader"} while a Call It stands
        self.holder = None      # a Soldier, "decoy", or None
        self.grab = None
        self.dead = False
        self.decoys_in_a_row = 0
        self.hold_left = 0
        # decision batch 13, 13-10 (OQ-193): every Focus Titan starts at Frenzy 0 and rises at the frenzy end step
        self.frenzy = R.frenzy_start
        # the field (decision batch 16): its label (Focus Titan A), its zone (engine.Fight places it in the centre), and
        # its Stride, an Abnormal's own or its Size Class's (size-classes.yaml, stride; OQ-200's lever, 16-38); a case's
        # stride overrides it (the Stride sensitivity rows)
        self.label = "A"
        self.zone = None
        self.stride = R.stride[self.id] if self.abnormal and self.id in R.stride else R.stride[block["size_class"]]
        if cfg.get("stride") is not None:
            over = cfg["stride"]
            self.stride = over.get(block["size_class"], self.stride) if isinstance(over, dict) else int(over)

    def stride_now(self):
        """titan-harm.yaml, grounded (16-16): a grounded Titan's Stride is 0; a corpse never strides."""
        return 0 if self.grounded() else self.stride

    def tough(self, p):
        if self.grab and self.grab["arm"] == p:
            return R.grip_toughness
        return self.tough0[p]

    def unbroken(self, kind):
        return sum(1 for p in self.part_ids if self.kind[p] == kind and self.state[p] < R.broken)

    def grounded(self):
        # a corpse counts as a grounded Titan for Position steps (decision batch 8, 8-9; anchor-ratings.yaml)
        return getattr(self, "dead", False) or any(self.state[p] == R.broken for p in self.part_ids if self.kind[p] in R.grounding_kinds)

    def eyes_broken(self):
        return any(self.state[p] == R.broken for p in self.part_ids if self.kind[p] in R.flare_blocking_kinds)

    def parts_ok(self, entry):
        need = {}
        for k in entry["body_parts_used"]:
            need[k] = need.get(k, 0) + 1
        return all(self.unbroken(k) >= n for k, n in need.items())

    def roll_nb(self, rng, stats=None):
        """behavior-procedure.yaml, next_behavior, roll: D6 plus the Titan's Frenzy as it stands at this moment, a
        total above 6 reading as 6, then moving up past the previous behavior and entries whose Body Parts are
        Broken; Thrash when none can be rolled (decision batch 13, 13-10 and 13-11; OQ-193)."""
        self.nb_serial += 1
        self.nb_revealed = False
        self.called = None
        die = rng.randint(1, 6)
        r = min(die + self.frenzy, 6)    # titan-format.yaml, behavior_table, result_above_the_table
        if stats is not None:
            stats["nb_rolls"] += 1
            if r != die:
                stats["frenzy_lifts"] += 1
        for result in self.move_up_order(r):
            eid = self.by_result[result]
            if eid != self.prev and self.parts_ok(self.entries[eid]):
                return eid
        return self.thrash

    def move_up_order(self, r):
        """behavior-procedure.yaml, next_behavior, roll, move-up: the results tested, in order, from the total r.

        The roll climbs the table from r. What happens at the top depends on Frenzy (decision batch 13, as amended
        after round 3 review 1, C3). At Frenzy 0 it wraps, after 6 comes 1, as it always has. At Frenzy 1 or more it
        never wraps: from 6 it turns back down, to the result below the total and on to 1, because Frenzy piles up
        to four faces onto result 6 and a wrap would land every one of them on the table's weakest entry.
        """
        up = list(range(r, 7))
        down = list(range(r - 1, 0, -1))
        return up + (down[::-1] if self.frenzy == 0 else down)

    def choose(self, pos):
        """behavior-procedure.yaml, resolving_a_card, choose, without the retargeting step, which needs the Titan
        Engagement's soldiers and so lives on Fight.choose_behavior (decision batch 13, 13-9). This is the tail of
        that step: the fallback a Titan reaches when no soldier in the fight meets the entry."""
        if self.nb == self.thrash:
            return self.thrash
        e = self.entries[self.nb]
        if not self.parts_ok(e):
            return self.thrash
        if pos in e["position_requirement"]:
            return self.nb
        fb = e["fallback"]
        if fb in (self.thrash, "none") or fb == self.prev:
            return self.thrash
        fe = self.entries[fb]
        if not self.parts_ok(fe) or pos not in fe["position_requirement"]:
            return self.thrash
        return fb

    def break_parts(self, broken):
        """Sets the first N parts of each kind Broken (the move-up share states)."""
        for kind, n in broken.items():
            for p in [p for p in self.part_ids if self.kind[p] == kind][:n]:
                self.state[p] = R.broken


class FixedDie:
    """A stand-in for random.Random whose D6 always shows one face: the move-up shares drive Titan.roll_nb
    through every result."""
    def __init__(self, face):
        self.face = face

    def randint(self, a, b):
        return self.face


# ---------------------------------------------------------------------- the fight
class Fight:
    def __init__(self, rng, cfg, squad=True, aux=None, supply=None):
        self.rng = rng
        # aux draws the rolls of procedures this pass added outside the card sequence (Scar D66, the end of the
        # Titan Engagement), so they do not move the draws of the fight itself.
        self.aux = aux if aux is not None else random.Random(0)
        self.cfg = cfg
        # the field (decision batch 16, 16-6): the case's terrain is the field rating; the centre zone and the Squad's
        # start zone take it and every other zone rolls the terrain mix (OQ-202), drawn from the fight's own stream
        # before anything else; a case's zones name ratings by zone number, and uniform_field reads one rating in every
        # zone (the sensitivity row nearest the figures measured before zones)
        self.rating = cfg.get("terrain", "wooded")
        size = cfg.get("field_size", R.zones["default"])
        if cfg.get("uniform_field"):
            self.field = space.uniform_field(R, size, self.rating)
            for n, rid in (cfg.get("zones") or {}).items():
                self.field.zones[n].rating = self.field.zones[n].start = rid
        else:
            # a case's zone_terrain replaces the terrain mix's rows (the OQ-202 sensitivity rows); carry_limit and
            # mounted_pace replace OQ-200's values (move_options). Every other case reads all three from data/.
            self.field = space.generate_field(rng, R, size, self.rating, cfg.get("zones"), cfg.get("zone_terrain"))
        self.t = Titan(cfg)
        self.t.zone = self.field.centre      # zones.yaml, placement: Focus Titan A in the centre zone (16-7)
        self.bs_lost = False
        self.sold = []
        self.stats = {k: 0 for k in STAT_KEYS}
        self.stats["kill_round"] = None
        self.stats["first_nape_round"] = None
        self.used_tactics = set()
        self.supply = supply if supply is not None else {"flares": R.supply["flares"], "medical": R.supply["medical"]}
        self.rnd = 0
        self.card = {}
        self.tcards = []
        self.stop = False
        # background-titans.yaml, retreat_clock: the interim setup's length unless a case names another (None: no
        # clock, for a measurement that never reaches it, such as a Grab cell)
        self.clock = cfg.get("retreat_clock", R.retreat_clock)
        self.retreat = False
        self.retreat_began = None        # the round the retreat began, as the tracker records it (decision batch 8, 8-32)
        self.stay_limit_fired = False
        # max_rounds in a case is a measurement cap (the full-fight Jam test): the fight is measured to it and no end
        # step runs. Otherwise SAFETY_CAP, which no fight should reach.
        self.measure_cap = "max_rounds" in cfg
        self.max_rounds = cfg["max_rounds"] if self.measure_cap else SAFETY_CAP
        self.capped = False
        self.lone = {}
        self.wing = {}
        self.wing_status = None
        self.grab_this_round = False
        self.pools0 = COUNT["pools"]
        if squad:
            P.build_squad(self)

    @property
    def flares(self):
        return self.supply["flares"]

    @flares.setter
    def flares(self, v):
        self.supply["flares"] = v

    # ------------------------------------------------------------------ setup
    def add(self, s, role, mounted=False):
        s.role = role
        # zones.yaml, placement (16-7): every soldier in the Squad's start zone, attachment ground, not airborne,
        # mounted or not as they were; a dismounted soldier's horse in that zone
        s.fight = self
        s.zone, s.attach = self.field.squad_start, ("ground", None)
        s.momentum = 0
        s.odm_moved = False
        s.quiet = False
        s.flight_zone = None
        s.airborne = False
        s.grabbed = False
        s.pre_turn, s.pre_action = set(), set()
        s.cur_move = s.cur_action = False
        s.acted_first, s.lifted_first = None, False     # the retreat's order guard (order_check, lift, move_check)
        s.card_passed = False
        s.turns = 0
        s.flags = {"hooked": False, "hurt": False, "loud": False}
        s.dodge_succ = None
        s.odm_used = s.odm_pushed = False
        s.gas_rolled = False     # this round's Gas Roll made (odm-gear.yaml, gas_roll)
        s.ban = 0
        s.mounted = mounted
        s.horse_zone = None if mounted else s.zone      # horses.yaml, horse_position (16-25)
        s.horse_gone = False
        s.cloak_thrown = False
        s.start_pos = D
        s.counted_dead = False
        s.nerves_done = False
        s.wing_of = None
        s.carrying = s.carried_by = None
        s.numb_deaths = 0
        s.left = False
        s.forced_move, s.forced_strike = None, False     # a pending Fear result ends with the Titan Engagement
        s.pinned = None
        s.talent_used, s.covered_comrade = set(), None     # once_per_titan_engagement marks (dice.use_talent)
        self.sold.append(s)
        return s

    def alive(self):
        """Every living soldier in the Titan Engagement, including those who have left (they still take turns)."""
        return [s for s in self.sold if not s.dead]

    def present(self):
        """Living soldiers who hold a Position: the candidates, targets, helpers, and witnesses (positions.yaml,
        leaving, after_leaving)."""
        return [s for s in self.sold if not s.dead and not s.left]

    def standing(self):
        """engagement-flow.yaml, ending, no-soldier-standing: a soldier who holds a Position, alive and not Down."""
        # a body-pinned soldier is not standing (decision batch 8, 8-9)
        return any(not s.dead and not s.down and not s.left and not (s.pinned and s.pinned["body"]) for s in self.sold)

    def apart(self, a, b):
        """The number of Position steps between two soldiers, for the rules that compare them outside a Position
        test of the Titan's (aftermath rolls, Help, Treat Injury): the zones between them (16-11); two soldiers who have
        both left count as holding the same Position, and one who has left is never within a step of one who holds a
        Position (engagement-end.yaml, soldiers_who_left, same_position). Zones are the last ones held."""
        if a.left or b.left:
            return 0 if (a.left and b.left) else 99
        return self.zones_apart(a, b)

    # ------------------------------------------------------------------ the retreat (decision batch 5, 5-1 and 5-10)
    def bound(self, s):
        """background-titans.yaml, retreat, moves: the soldiers whose move the retreat forces."""
        return (self.retreat and not s.dead and not s.left and not s.down and not s.grabbed and s.carried_by is None
                and not s.pinned)       # a Pinned soldier cannot move (decision batch 8, 8-9)

    def order_check(self, s, stay_for=None, action=None):
        """background-titans.yaml, retreat, order: a soldier the retreat binds makes the forced move before the action,
        except the action a stay-with-a-comrade move follows and a lift. stay_for is the Down or Grabbed comrade at the
        soldier's Position the action is taken for, and action its Catalog id, which must be one of the actions option
        4 names; the comrade is recorded, and the only move after it is the stay with them (stay, move_check). Raises
        when a policy acts first otherwise."""
        if self.bound(s) and not s.cur_move:
            if stay_for is None:
                raise ValueError(f"{s.name} acted before the forced move under a retreat (background-titans.yaml, retreat, order)")
            if self.fallen_options_closed():
                raise ValueError(f"{s.name} acted first for a comrade past the retreat's stay limit (decision batch 8, 8-32)")
            if action not in R.retreat_stay_actions:
                raise ValueError(f"{s.name} took {action} before the forced move; a stay with a comrade follows only "
                                 f"{sorted(R.retreat_stay_actions)} (background-titans.yaml, retreat, moves, option 4)")
            s.acted_first = (stay_for, action)

    def move_check(self, s):
        """background-titans.yaml, retreat, order (simulator review round 3, Minor 3): after an action taken first for
        a comrade, the only move is the stay with that comrade; after a lift, the move that carries them out."""
        if self.bound(s) and getattr(s, "acted_first", None) is not None and not getattr(s, "lifted_first", False):
            raise ValueError(f"{s.name} moved on after acting for {s.acted_first[0].name} before the move; option 4's "
                             "move is the stay (background-titans.yaml, retreat, order)")

    def fallen_options_closed(self):
        """background-titans.yaml, retreat, moves (decision batch 8, 8-32): while no Focus Titan is alive, options 3 and 4
        are open only on the retreat's first rounds, as many as the retreat clock has segments; from the next round no
        soldier steps toward or stays with a comrade."""
        return (self.retreat and self.t.dead and self.retreat_began is not None and self.clock is not None
                and self.rnd > self.retreat_began + self.clock)

    def fallen_here(self, s):
        """Down or Grabbed comrades, not carried, in the soldier's zone (option 4's comrades; 16-11)."""
        return [c for c in self.present() if c is not s and (c.down or c.grabbed) and c.carried_by is None and c.zone == s.zone]

    def retreat_step(self, s, place, toward_comrade=False):
        """One step to placement place, mounted where the soldier rides and the zone allows it, otherwise on foot, or by
        ODM Gear as a Flight of that one step (background-titans.yaml, retreat, moves: an ODM move under a retreat is a
        Flight like any other). toward_comrade: option 3, closed past the stay limit (8-32)."""
        if toward_comrade and self.fallen_options_closed():
            raise ValueError(f"{s.name} stepped toward a comrade past the retreat's stay limit (decision batch 8, 8-32)")
        if s.cur_move:
            return False
        self.move_check(s)
        same = lambda st: len(st) == 1 and st[0][0] == place[0] and (st[0][1] == place[1] or (   # noqa: E731
            st[0][1] in space.FREE and place[1] in space.FREE))
        for k in (("mounted", "foot", "odm") if s.mounted else ("foot", "odm")):
            if not self.can_move(s, k):
                continue
            if k == "odm":
                if any(same(o[0]) for o in self.move_options(s, "odm", 0)):
                    return self.flight(s, lambda opts: next((o for o in opts if same(o[0])), None))
                continue
            opt = next((o for o in self.move_options(s, k) if same(o[0])), None)
            if opt is not None:
                self.walk(s, opt, k)
                return True
        return False

    def retreat_out_zones(self, s):
        """background-titans.yaml, retreat, moves, option 1 (16-27): the zones a zone step out may enter from free in the
        soldier's zone, one ring further out, holding no body first, then farthest from the nearest living Focus Titan
        (or the nearest corpse when none is alive). A tie left over is the soldier's choice (policy.retreat_zone)."""
        f = self.field
        ring = f.ring(s.zone)
        out = [n for n in f.neighbours(s.zone) if f.ring(n) == ring + 1]
        live = [t for t in self.bodies() if not t.dead] or self.bodies()
        far = lambda n: min(f.distance(n, t.zone) for t in live)     # noqa: E731
        return sorted(out, key=lambda n: (self.holds_body(n), -far(n)))

    def leave(self, s, moving=False):
        """positions.yaml, leaving (16-26; retreat option 2): a zone step off field from an edge zone, free, not Down,
        Grabbed, Pinned, or carried; outside a retreat only from a zone holding no Focus Titan and no corpse, during one
        whatever body stands there. A comrade the soldier carries leaves with them, and a mounted soldier's horse; no
        one returns during a retreat. moving: the step ends a move already under way (walk, flight)."""
        if (s.zone is None or not self.field.is_edge(s.zone) or not self.is_free(s) or s.down or s.grabbed or s.pinned
                or s.carried_by is not None or s.left or (s.cur_move and not moving)
                or (self.holds_body(s.zone) and not self.retreat)):
            raise ValueError(f"{s.name} cannot leave (positions.yaml, leaving, who)")
        if not moving:
            self.move_check(s)
        s.cur_move = True
        s.left = True
        s.zone, s.attach = None, ("ground", None)
        s.airborne = False
        self.stats["left"] += 1
        c = s.carrying
        if c is not None:
            c.left = True
            c.zone, c.attach = None, ("ground", None)
            self.stats["carried_out"] += 1
        for x in (s, c):
            if x is not None and self.t.holder is x:
                self.t.holder = None      # attention.yaml, changes: the holder leaves
        self.trim_momentum(s)
        return True

    def let_go(self, s):
        """positions.yaml, moves, letting_go: the move of a soldier at On Body or Blind Spot, a fall a rule names."""
        if s.attach[0] not in ("on-body", "blind-spot") or s.grabbed or s.carried_by is not None or s.cur_move:
            raise ValueError(f"{s.name} cannot let go (positions.yaml, moves, letting_go, who)")
        self.move_check(s)
        s.cur_move = True
        self.stats["lets_go"] += 1
        self.fall(s)

    def stay(self, s, c):
        """Retreat option 4: a move that changes nothing, after the action taken this turn for comrade c, Down or
        Grabbed at the soldier's Position when the action was taken (the action may have freed or moved them)."""
        if s.cur_move or not s.cur_action or c is s or s.left:
            raise ValueError(f"{s.name} cannot stay with a comrade (background-titans.yaml, retreat, moves, option 4)")
        if self.fallen_options_closed():
            raise ValueError(f"{s.name} stayed with a comrade past the retreat's stay limit (decision batch 8, 8-32)")
        if getattr(s, "acted_first", None) is None or s.acted_first[0] is not c:
            raise ValueError(f"{s.name} stays with {c.name} without one of option 4's actions taken for them first "
                             "(background-titans.yaml, retreat, moves, option 4)")
        s.cur_move = True

    def draw_attention(self, s):
        """attention.yaml, draw_attention: an unrolled action from a Position other than Distant (decision batch 5,
        OQ-113), not Grabbed; the soldier holds the loudest flag."""
        if s.pos in R.draw_barred_positions or s.grabbed or s.left or s.cur_action or s.down:
            raise ValueError(f"{s.name} cannot take Draw Attention from {s.pos} (attention.yaml, draw_attention, requirements)")
        self.order_check(s)
        s.flags["loud"] = True
        s.cur_action = True
        self.stats["draws"] += 1

    # ------------------------------------------------------------------ Squad Tactics
    def holds_tactic(self, tid):
        return tid in self.cfg.get("tactics", []) and tid not in self.used_tactics

    def use_tactic(self, tid):
        self.used_tactics.add(tid)
        self.stats["tactic_uses"] += 1

    # ------------------------------------------------------------------ turns and actions spent in advance
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

    # ------------------------------------------------------------------ the field (ADR-0029; decision batch 16)
    def position(self, s):
        """zones.yaml, derivation (16-9): the soldier's Position relative to the Focus Titan or its corpse, from zone and
        attachment. None off field."""
        return space.derive_position(s, self.t)

    def pos_of(self, place):
        """The Position a placement (zone, kind, body) would give relative to the Focus Titan."""
        return space.derive_position(_Placed(place), self.t)

    def place(self, s):
        return (s.zone, s.attach[0], s.attach[1])

    def free_kind(self, s):
        """zones.yaml, detach_rule: anchored if airborne, ground if not."""
        return "anchored" if s.airborne else "ground"

    def is_free(self, s):
        return s.attach[0] in space.FREE

    def place_at(self, s, p):
        """A rule that names a Position relative to the Focus Titan (a fall's landing, a release, Leap Clear, a Heave,
        Fall Back, the stand-up at an Open zone, a cell's setup): the zone and attachment it means. A free soldier is
        anchored if airborne and on the ground if not (zones.yaml, detach_rule). Distant names no zone: only a soldier
        already in another zone may be written to it."""
        t = self.t
        if p in (OB, BS):
            s.zone, s.attach = t.zone, ("on-body" if p == OB else "blind-spot", t.label)
        elif p == IR:
            s.zone, s.attach = t.zone, (self.free_kind(s), None)
        elif p == D:
            if s.zone is None or s.zone == t.zone:
                raise ValueError(f"{s.name}: distant names no zone; a zone step moves a soldier out of the Titan's zone")
            if not self.is_free(s):
                s.attach = (self.free_kind(s), None)
        else:
            raise ValueError(f"{s.name}: no Position {p!r}")
        if s.carrying is not None:
            self.follow(s.carrying, s)

    def follow(self, c, s):
        """zones.yaml, detach_rule: a carried soldier's zone and attachment are their carrier's."""
        c.zone, c.attach = s.zone, s.attach

    def bodies(self):
        """The Focus Titan, living or a corpse: the one body this model has."""
        return [self.t]

    def holds_body(self, n):
        return n is not None and self.t.zone == n

    def t_rating(self):
        """The Anchor Rating of the Focus Titan's zone, which every Position step relative to it reads."""
        return self.field.rating(self.t.zone)

    def zones_apart(self, a, b):
        """zones.yaml, between_soldiers (16-11): the Position steps between two soldiers are the zones between them."""
        if a.zone is None or b.zone is None:
            return 99
        return self.field.distance(a.zone, b.zone)

    def trim_momentum(self, s):
        """anchor-ratings.yaml, momentum (16-4): Momentum above the anchors of the soldier's zone is lost at once; a soldier
        who has left, is Down, Grabbed, carried, or Pinned, or has died holds none."""
        if not s.momentum:
            return
        if s.dead or s.left or s.down or s.grabbed or s.carried_by is not None or s.pinned or s.zone is None:
            keep = 0
        else:
            keep = min(s.momentum, space.momentum_cap(self.field, R, s.zone))
        self.stats["momentum_lost"] += s.momentum - keep
        s.momentum = keep

    def momentum_sweep(self):
        for s in self.sold:
            self.trim_momentum(s)

    def set_flag(self, s, key):
        """A flag the soldier sets: none while they have spent Momentum on quiet this turn (anchor-ratings.yaml, momentum,
        spends, quiet)."""
        if s.quiet:
            self.stats["quiet_stops"] += 1
            return
        s.flags[key] = True

    # ------------------------------------------------------------------ Positions and moves
    def step_kinds(self, a, b):
        """The kinds of move that can make the Position step a to b relative to the Focus Titan, in its zone, read off
        that zone's rating (a distant to in-reach step is a zone step into it: zones.yaml, moves, entered_zone_reads)."""
        return space.step_kinds(R, self.t_rating(), a, b, self.t.grounded())

    def steps_apart(self, a, b):
        """Position steps between two Positions relative to the Focus Titan (not between two soldiers: zones_apart)."""
        if a == b:
            return 0
        return 1 if self.step_kinds(a, b) else 2

    def route_step(self, s, target, assume_odm=False):
        """The first step of a shortest chain of Position steps relative to the Focus Titan from the soldier's Position to
        target that they can make on foot or by ODM Gear (working, or assume_odm), under its zone's rating and grounding
        now; None if none."""
        if s.pos == target:
            return None
        frm = {s.pos: None}
        queue = [s.pos]
        while queue:
            a = queue.pop(0)
            for b in R.positions:
                if b in frm:
                    continue
                kinds = self.step_kinds(a, b)
                if "foot" in kinds or ("odm" in kinds and (assume_odm or s.odm_working())):
                    frm[b] = a
                    if b == target:
                        while frm[b] != s.pos:
                            b = frm[b]
                        return b
                    queue.append(b)
        return None

    def dismount(self, s):
        s.mounted = False
        s.horse_zone = s.zone          # horses.yaml, horse_position (16-25): the horse stays in that zone

    def horse_usable(self, s):
        """attention.yaml, riderless-horse: own horse not lame, and mounted on it or it is in the soldier's zone."""
        return not s.horse_gone and s.horse > 0 and (s.mounted or (s.horse_zone is not None and s.horse_zone == s.zone))

    def items(self, s):
        """carrying.yaml, items_counted."""
        ci = R.carry_items
        n = ci["spare"] * s.spares + ci["blade_spare"] * max(0, s.blades - (1 if s.handles else 0))
        if s.kit_max is not None:
            n += ci["medical_kit"]
        if s.carrying is not None:
            c = s.carrying
            n += (0 if "strong-back" in s.rule_talents else ci["comrade"]) + self.items(c)
        return n

    def overloaded(self, s):
        return self.items(s) > s.a("strength") + R.carry_limit_add

    def may_leave(self, s):
        """positions.yaml, leaving (16-26): a step off field from an edge zone, free, from a zone that holds no Focus Titan
        and no corpse, or whatever body stands there during a retreat. This model has no leaving outside a retreat (no
        returner, report section 12), so a policy's move leaves only under one."""
        return (self.retreat and s.zone is not None and self.field.is_edge(s.zone) and not s.down and not s.grabbed
                and s.carried_by is None and not s.pinned and not s.left)

    def can_move(self, s, kind):
        if s.cur_move or s.down or s.grabbed or s.carried_by is not None or s.pinned or s.left or s.zone is None:
            return False
        if kind == "odm":
            if s.carrying is not None and R.overloaded_spends_action and s.cur_action and self.overloaded(s):
                return False
            return s.odm_working()
        if kind == "mounted":
            return s.mounted
        return True

    def move_options(self, s, kind, momentum=None, may_leave=False):
        """Every move of this kind from the soldier's placement: [(steps, carries, Momentum)] (space.flight_options,
        space.ground_options). A move on foot by a mounted soldier dismounts them first (horses.yaml, within_a_move)."""
        start = self.place(s)
        if kind == "odm":
            m = s.momentum if momentum is None else momentum
            return space.flight_options(R, self.field, start, m, self.bodies(), may_leave=may_leave,
                                        carry_limit=self.cfg.get("carry_limit"))
        return [(st, 0, 0) for st in space.ground_options(R, self.field, start, kind, self.bodies(), may_leave=may_leave,
                                                          pace=self.cfg.get("mounted_pace"))]

    def crossing_titans(self, start_zone, steps):
        """zones.yaml, crossing_flag: the Focus Titans standing in a zone the Flight crosses (a corpse takes no flag)."""
        zs = space.crossed(start_zone, [p[0] for p in steps])
        return [t for t in self.bodies() if not t.dead and t.zone in zs]

    def go(self, s, target, kinds=("foot", "odm")):
        """One move toward target, a Position relative to the Focus Titan, of the first kind in kinds whose best move is
        best (policy.pick_move ranks them: reaching target first, then closing on the Titan's zone). A Flight is judged
        on the Momentum its roll could give at most, then rolled, and its route chosen on what it gave (READING: the
        route of a Flight is chosen after its roll). Returns True when a move was made."""
        best = None
        for k in kinds:
            if not self.can_move(s, k):
                continue
            m = max(s.momentum, space.momentum_cap(self.field, R, s.zone)) if k == "odm" else None
            pick = P.pick_move(self, s, target, self.move_options(s, k, m), k)
            if pick is not None and (best is None or pick[0] < best[0]):
                best = (pick[0], k, pick[1])
        if best is None:
            return False
        _, k, option = best
        if k == "odm":
            return self.flight(s, lambda opts: (P.pick_move(self, s, target, opts, k) or (None, None))[1])
        self.walk(s, option, k)
        return True

    def try_step(self, s, to, kinds=("foot", "odm")):
        """One move toward the Position `to` relative to the Focus Titan (go)."""
        return self.go(s, to, kinds)

    def walk(self, s, option, kind):
        """A move on foot or mounted along option's steps (zones.yaml, moves): not airborne after it."""
        steps = option[0]
        if s.mounted and kind != "mounted":
            self.dismount(s)       # horses.yaml, mounted, within_a_move
        s.cur_move = True
        was_d = s.pos == D
        end = steps[-1]
        if end[0] is None:
            return self.leave(s, moving=True)
        s.zone, s.attach = end[0], (end[1], end[2])
        s.airborne = False
        self.after_move(s, was_d)

    def after_move(self, s, was_d):
        if s.carrying is not None:
            self.follow(s.carrying, s)
            if s.pos == D and not was_d:
                self.stats["carried_to_distant"] += 1
        self.trim_momentum(s)

    def flight(self, s, choose):
        """positions.yaml, moves, flight, and zones.yaml, flight (16-13 to 16-15): the roll for fly with the soldier's ODM
        Gear, needing nothing and never Pushed (POLICY CHOICE: a Push buys only Momentum); each success 1 Momentum up to
        the anchors of the zone it starts in; then the route choose picks from the Flights that Momentum allows, its
        first step free and each Carry paid; the crossing flag and the no-successes flag, unless the soldier spends
        quiet (policy.wants_quiet); airborne after it; Momentum above the anchors of the zone it ends in lost."""
        st = self.stats
        if s.mounted:
            self.dismount(s)
        s.cur_move = True
        if s.carrying is not None and R.overloaded_spends_action and self.overloaded(s):
            s.cur_action = True     # carrying.yaml, overloaded: every ODM move also spends the action
            st["overloaded_moves"] += 1
        s.odm_used = s.odm_moved = True
        was_d = s.pos == D
        start = self.place(s)
        st["flights"] += 1
        st["fly_rolls"] += 1
        res = roll(self.rng, s, "fly", gear="odm", push_to=0)
        before = s.momentum
        s.momentum = max(s.momentum, min(space.momentum_cap(self.field, R, s.zone), s.momentum + res.succ))
        st["momentum_gained"] += s.momentum - before
        self.after_roll(s, res, "odm")
        if s.dead or s.zone is None or s.grabbed or s.pinned or s.carried_by is not None:
            return True
        opts = self.move_options(s, "odm", may_leave=self.may_leave(s))
        pick = choose(opts)
        if pick is None:
            st["flights_still"] += 1
            return True
        steps, carries, cost = pick
        s.momentum -= cost
        st["momentum_spent"] += cost
        st["momentum_carry"] += cost
        st["carries"] += carries
        st["flights_carry"] += 1 if carries else 0
        flagged = self.crossing_titans(start[0], steps)
        if flagged:
            st["crossings"] += 1
        end = steps[-1]
        if res.succ == 0 and not self.t.dead:
            flagged = flagged or [self.t]        # no successes: the Focus Titan in, or nearest, the zone it ends in
            st["flights_no_successes"] += 1
        if flagged and not s.quiet and s.momentum >= 1 and P.wants_quiet(self, s):
            s.momentum -= 1
            s.quiet = True
            st["momentum_spent"] += 1
            st["momentum_quiet"] += 1
        if flagged:
            self.set_flag(s, "loud")
            st["flight_flags"] += 0 if s.quiet else 1
        if end[0] is None:
            return self.leave(s, moving=True)
        s.zone, s.attach = end[0], (end[1], end[2])
        s.airborne = True           # positions.yaml, moves, flight, airborne
        s.flight_zone = end[0]
        self.after_move(s, was_d)
        return True

    def forced_step(self, s, place):
        """positions.yaml, moves, forced_step (16-28): one step to placement place, of the kind the soldier's move makes
        (mounted when mounted; ODM when airborne, else on foot, the other when that one cannot make it). Never a
        Flight: not rolled, no Carry, no Momentum, no flag. An ODM step is ODM use (the round's Gas Roll) and the
        soldier is airborne after it. It spends nothing (soldier_turn keeps the move as it was)."""
        if s.left or s.down or s.grabbed or s.carried_by is not None or s.pinned or s.zone is None:
            return False
        kinds = ("mounted",) if s.mounted else (("odm", "foot") if s.airborne else ("foot", "odm"))
        for k in kinds:
            if k == "odm" and not s.odm_working():
                continue
            for steps, _, _ in self.move_options(s, k, 0):
                to = steps[0]
                if len(steps) != 1 or to[0] != place[0] or not (to[1] == place[1] or (
                        to[1] in space.FREE and place[1] in space.FREE)):
                    continue
                was_d = s.pos == D
                s.zone, s.attach = to[0], (to[1], to[2])
                s.airborne = k == "odm"
                if k == "odm":
                    s.odm_used = True
                self.after_move(s, was_d)
                return True
        return False

    def one_move_places(self, s):
        """Every (placement, mounted) one move of the soldier's own could reach now, a Flight on the Momentum they hold:
        for the lone fight's route check (policy.route_gap). Makes no move."""
        out = []
        if s.zone is None:
            return out
        for kind in ("foot", "odm", "mounted"):
            if kind == "odm" and not s.odm_working() or kind == "mounted" and not s.mounted:
                continue
            for steps, _, _ in self.move_options(s, kind):
                out.append((steps[-1], kind == "mounted"))
        return out

    def can_mount(self, s):
        """horses.yaml, mounted, mount, requirements, in_titan_engagement (16-25): the horse in the soldier's zone and the
        soldier free."""
        return (not s.mounted and not s.horse_gone and s.horse > 0 and s.horse_zone is not None and s.horse_zone == s.zone
                and self.is_free(s) and not s.airborne and not s.down and not s.grabbed and s.carried_by is None)

    def mount(self, s, within_move=False):
        """A move can include one mount (horses.yaml, within_a_move): made with this turn's move, or as part of a
        move on foot or mounted the soldier has just made (within_move)."""
        if not self.can_mount(s) or (s.cur_move and not within_move):
            return False
        s.cur_move = True
        s.mounted = True
        s.horse_zone = None
        s.attach = ("ground", None)
        self.stats["mounts"] += 1
        return True

    def crawl(self, s):
        """zones.yaml, moves, down_soldier (16-12): one on-foot zone step out of a zone that holds a body into an adjacent
        zone that holds none, never off field (policy.crawl_zone picks it)."""
        if (s.down and not s.grabbed and s.carried_by is None and not s.cur_move and not s.pinned and s.zone is not None
                and self.is_free(s) and self.holds_body(s.zone)):
            to = [n for n in self.field.neighbours(s.zone) if not self.holds_body(n)]
            if to:
                s.cur_move = True
                s.zone, s.attach = P.crawl_zone(self, s, to), ("ground", None)
                s.airborne = False
                self.stats["crawls"] += 1

    # ------------------------------------------------------------------ carrying a comrade
    def lift(self, s, c):
        """carrying.yaml, lifting_a_comrade, in_titan_engagement. Under a retreat the move follows the lift
        (background-titans.yaml, retreat, order)."""
        if (s.cur_action or s.down or s.grabbed or s.carrying is not None or s.carried_by is not None or c.dead
                or not c.down or c.grabbed or c.carried_by is not None or c.zone != s.zone or c is s or s.left or c.left
                or c.pinned or s.pinned):     # a Pinned soldier cannot be moved (decision batch 8, 8-9)
            return False
        if self.bound(s) and not s.cur_move:
            s.lifted_first = True      # the move that follows carries them out (background-titans.yaml, retreat, order)
        s.cur_action = True
        s.carrying, c.carried_by = c, s
        c.airborne = c.mounted = False
        self.follow(c, s)
        self.stats["lifts"] += 1
        return True

    def set_down(self, s):
        c = s.carrying
        if c is not None:
            s.carrying = None
            c.carried_by = None
            # carrying.yaml (16-23): set down, or no longer carried, in the carrier's zone with attachment ground
            c.zone, c.attach = s.zone, ("ground", None)
        return c

    # ------------------------------------------------------------------ gear after a roll
    def after_roll(self, s, res, gear):
        if gear == "odm":
            s.odm_used = True
            if res.pushed:
                s.odm_pushed = True
            if res.gear_ones:
                was = s.odm
                s.odm = max(0, s.odm - res.gear_ones)
                if s.odm == 0 and was > 0:
                    self.stats["jams"] += 1
                    if s.airborne:
                        self.fall(s)
        elif gear == "horse":
            if res.gear_ones:
                s.horse = max(0, s.horse - res.gear_ones)
                if s.horse == 0:
                    self.stats["lame"] += 1
                    if s.mounted:
                        self.fall_from_horse(s)
        elif gear == "blade":
            if res.gear_ones:
                s.blades -= 1
                s.handles = False
        for _ in range(res.spend_turns):
            self.spend_turn(s)

    def change_canister(self, s):
        self.order_check(s)
        s.spares -= 1
        s.gas = R.full_gas
        s.cur_action = True
        self.stats["canisters"] += 1

    def field_repair(self, s, target=None, rng=None, in_fight=True):
        """field-repair.yaml: Wits alone with no tool kit, needing its needs, each success restoring 1 point."""
        target = target or s
        if in_fight:
            self.order_check(s)
            s.cur_action = True
            self.stats["repair_rolls"] += 1
        res = roll(rng or self.rng, s, "field-repair", attribute=R.field_repair_attribute, talent=0,
                   push_to=R.field_repair_needs)
        if in_fight:
            for _ in range(res.spend_turns):
                self.spend_turn(s)
        if res.succ >= R.field_repair_needs:
            extra = R.talent_values["spare-parts"] if in_fight and use_talent(s, "spare-parts") else 0   # talents.yaml
            self.stats["talent_fires"] += 1 if extra else 0
            target.odm = min(target.odm_max, target.odm + res.succ + extra)
            if in_fight:
                self.stats["repairs"] += 1
            return True
        return False

    # ------------------------------------------------------------------ Treat Injury
    def treat(self, s, patient, use, ci=None, bonus=0, helpers=(), cover=None, rng=None, in_fight=True, push=True,
              supplies=0, window=False):
        """treat-injury.yaml: Wits with a medical kit's Gear Dice and a Talent naming treat-injury, or Wits alone
        without a kit (action-catalog.yaml, gear_requirement, attribute_alone); the self penalty; needs 1. A
        success treats the named Critical Injury (stabilizing it if lethal, its box back) or revives (Health lost
        restored); either can end Down."""
        kit = s.kit is not None and s.kit > 0
        if ci is not None and ci["row"].get("treat_needs_kit") and not kit and not supplies:
            return False    # decision batch 8, 8-8: a Burn needs a medical kit or medical supplies; no roll is made
        pen = (R.treat_self_penalty if patient is s else 0) + \
            (ci["row"].get("treat_pen", 0) if ci is not None and use == "treat" else 0)    # 8-15: the Pierce rider
        if in_fight:
            self.order_check(s, stay_for=patient if (patient is not s and patient in self.fallen_here(s)) else None,
                             action=R.treat_entry)
            s.cur_action = True
            self.stats["treats"] += 1
        res = roll(rng or self.rng, s, R.treat_entry, bonus=bonus + len(helpers), gear="kit" if kit else None,
                   push_to=R.treat_needs, cover=cover, extra_pen=pen, attribute=R.treat_attribute,
                   talent=None if kit else 0, allow_push=push)
        if res.covered is not None and res.covered is not True:
            self.stats["covers" if in_fight else "care_covers"] += 1
        if kit and res.gear_ones:
            s.kit = max(0, s.kit - res.gear_ones)
        if in_fight:
            for _ in range(res.spend_turns):
                self.spend_turn(s)
        if res.succ < R.treat_needs:
            if (in_fight and use == "treat" and patient is not s and ci["row"]["lethal"] and ci["limit"] == "turn"
                    and use_talent(s, "tourniquet")):
                ci["limit"] = "engagement"     # talents.yaml, tourniquet: slowed one step, still untreated
                self.stats["talent_fires"] += 1
            return False
        if use == "revive":
            patient.health_lost -= min(res.succ, patient.health_lost)
        else:
            ci["treated"] = True
            if ci["row"]["lethal"] and ci["limit"] is not None:
                ci["limit"] = None
                ci["scar_due"] = True     # scars.yaml, survived-lethal-injury, given at the care-window step
            if window and res.succ >= R.talent_values["triage"] and use_talent(s, "triage"):
                # talents.yaml, triage: one more untreated injury the same roll could have named, the worst first
                rank = lambda c: 0 if c["row"]["lethal"] else (1 if c["row"]["down"] else 2)   # noqa: E731
                other = next((c for c in sorted(patient.untreated(), key=rank)
                              if not c["row"].get("treat_needs_kit") or kit or supplies), None)
                if other is not None:
                    other["treated"] = True
                    if other["row"]["lethal"] and other["limit"] is not None:
                        other["limit"] = None
                        other["scar_due"] = True
                    self.stats["talent_fires"] += 1
        patient.try_end_down()
        if in_fight:
            self.stats["treat_saves"] += 1
        return True

    # ------------------------------------------------------------------ harm
    def fear(self, s, triggers):
        """One soldier's Fear Roll for an event: an event with one rolling soldier."""
        self.fear_event([s], triggers)

    def fear_event(self, rollers, triggers):
        """data/mind/fear-rolls.yaml, decision batch 8, 8-40 (D6, the snapshot): for one event, every rolling soldier's
        total is read from their Stress and Resolve as they stood when the event resolved, and only then does every
        result apply. No result of the event changes another soldier's total for it, so stress-gain-nearby counts
        from the next event. The rule applies Drive decisions first; no simulator case enlists a Drive."""
        rolled = []
        for s in rollers:
            if s.dead or s.down:
                continue
            steady = (R.talent_values["steady-heart"] if set(triggers) & R.steady_heart_triggers
                      and use_talent(s, "steady-heart") else 0)       # talents.yaml, steady-heart
            self.stats["talent_fires"] += 1 if steady else 0
            rolled.append((s, fear_result(self.rng, s, triggers, extra_resolve=steady)))
        for s, row in rolled:
            self.apply_fear(s, row)

    def apply_fear(self, s, row):
        before = s.scars
        apply_fear_result(self.rng, s, row, self.aux)
        self.stats["fear_rolls"] += 1
        self.stats["scars_gained"] += s.scars - before
        if row["spend_action"]:
            self.spend_action(s)
        for _ in range(row["spend_turns"]):
            self.spend_turn(s)
        if row["no_react"]:
            s.ban = max(s.ban, max(1, row["spend_turns"]))
        # decision batch 7, 7-8 (OQ-139; effect-types.yaml): the six effect types a Fear row may add. With one Focus
        # Titan, the Titan that caused the event is always that Titan.
        if row["draw"] and not s.left and s.pos not in R.draw_barred_positions:   # the Titan in the soldier's zone (16-28)
            s.flags["loud"] = True          # draw-attention: the loudest flag, never from Distant (attention.yaml, loudest)
            self.stats["fear_draws"] += 1
        if row["nearby"]:
            for c in self.present():        # stress-gain-nearby: every comrade within one Position step, with no roll
                if c is not s and self.zones_apart(c, s) <= 1:     # the same zone or an adjacent one (16-11, 16-28)
                    c.stress += row["nearby"]
                    self.stats["fear_contagion"] += 1
        if row["forced_move"]:
            s.forced_move = row["forced_move"]      # made at the start of the soldier's next turn (soldier_turn)
        if row["forced_action"]:
            s.forced_strike = True                  # policy.forced_strike_turn; no Help or Cover until it is taken
        if row["drop_blades"] and s.handles:
            # drop-blade-set: the Blade Set in the handles is left at the soldier's Position; refitting is the swap.
            # READING: no policy picks a left Blade Set up again during the fight
            s.handles = False
            s.blades -= 1
            self.stats["fear_blade_drops"] += 1
        if row["gas_roll"] and s.gas > 0:
            # gas-roll: a Gas Roll on the current canister at once, besides the round's own (odm-gear.yaml, gas_roll)
            self.stats["fear_gas_rolls"] += 1
            s.gas = max(0, s.gas - sum(1 for _ in range(R.gas_roll_dice(s.pc, False)) if self.rng.randint(1, 6) == 1))

    def witnesses(self, victim, trigger):
        """engagement-flow.yaml, witnesses: living soldiers who hold a Position; not a soldier who has left."""
        rollers = []
        for s in self.present():
            if s is victim:
                continue
            if trigger == "comrade-dies" and s.has_scar("numb"):
                s.numb_deaths += 1           # scars.yaml, numb: no Fear Roll, 1 more Grief at the grief step
                continue
            rollers.append(s)
        self.fear_event(rollers, (trigger,))     # decision batch 8, 8-40: one event, one snapshot
        for s in rollers:
            if trigger == "comrade-dies" and s.has_scar("survivors-guilt"):
                s.stress += R.scar_rows["survivors-guilt"]["stress"]   # a result of the event, after every roll

    def kill(self, s, witnessed=True):
        if s.counted_dead:
            return
        band = self.fall_band(s, from_horse=s.mounted and not s.airborne) if (s.airborne or s.mounted) else None
        c = self.set_down(s) if s.carrying is not None else None
        if s.carried_by is not None:
            s.carried_by.carrying = None
            s.carried_by = None
        if s.odm_used and not s.gas_rolled:
            # odm-gear.yaml, gas_roll, canister_removed: a soldier who dies after using ODM Gear this round, before
            # its Gas Roll, makes it at once
            self.gas_roll(s, "gas_rolls_at_death")
        s.dead = True
        s.counted_dead = True
        s.airborne = s.mounted = False
        self.stats["deaths"] += 1
        if s.pc:
            self.stats["pc_deaths"] += 1
        t = self.t
        if t.grab and t.grab["victim"] is s:
            self.stats["grab_deaths"] += 1
        if t.holder is s:
            t.holder = None
        if t.grab and t.grab["victim"] is s:
            self.release(dead=True)
        if c is not None and band is not None and not c.dead:
            self.fall_carried(c, band)       # carrying.yaml, ends: a carrier airborne or mounted dies
        if witnessed:
            self.witnesses(s, "comrade-dies")

    def after_harm(self, s, row):
        if row == "dead":
            self.kill(s)
        elif s.down and s.carrying is not None and not s.airborne and not s.mounted:
            self.set_down(s)                 # carrying.yaml, ends: a carrier Down on foot sets the comrade down

    def fall_band(self, s, from_horse=False):
        if from_horse:
            return R.fall_bands[0]
        i = 1 if s.pos in R.fall_high else 0
        # falls.yaml, height (16-22): the Giant Forest raise reads the zone the soldier falls in
        if self.t.raises_fall or (s.zone is not None and self.field.rating(s.zone) in R.fall_raise_ratings):
            i += 1
        return R.fall_bands[min(i, len(R.fall_bands) - 1)]

    def fall(self, s):
        band = R.fall_bands[0] if self.mid_air_catch(s) else self.fall_band(s)
        high = s.pos in R.fall_high
        c = self.set_down(s) if s.carrying is not None else None
        s.airborne = False
        self.stats["falls"] += 1
        row = fall_damage(self.rng, s, band, gained=s.turns)
        if row is not None:
            self.count_ci(s)
            self.after_harm(s, row)
        if not s.dead and s.zone is not None:
            # positions.yaml, falls_land (16-22): the soldier stays in their zone, attachment ground
            s.attach = (R.fall_lands_attach, None)
        if c is not None and not c.dead:
            self.fall_carried(c, band, high)

    def fall_carried(self, c, band, high=False):
        if self.mid_air_catch(c):
            band = R.fall_bands[0]
        self.stats["falls"] += 1
        row = fall_damage(self.rng, c, band, gained=c.turns)
        if row is not None:
            self.count_ci(c)
            self.after_harm(c, row)
        if not c.dead and c.zone is not None:
            c.attach = (R.fall_lands_attach, None)

    def fall_from_horse(self, s):
        c = self.set_down(s) if s.carrying is not None else None
        self.dismount(s)
        self.stats["falls"] += 1
        band = self.fall_band(s, True)
        row = fall_damage(self.rng, s, band, gained=s.turns)
        if row is not None:
            self.count_ci(s)
            self.after_harm(s, row)
        if c is not None and not c.dead:
            self.fall_carried(c, band)

    def count_ci(self, s):
        self.stats["cis"] += 1
        if s.pc:
            self.stats["pc_cis"] += 1
        if self.rnd == 1:
            self.stats["r1_cis"] += 1
            self.stats["r1_pc_cis"] += 1 if s.pc else 0

    # ------------------------------------------------------------------ steam, the falling Titan, Pinned (decision batch 8)
    def pinned_present(self):
        return any(s.pinned for s in self.present())

    def talent_context(self):
        """The readings a conditional dice Talent's condition may need on a strike (rules.R.talent_conditions): the
        Titan is grounded; a comrade has died in this Titan Engagement. Mounted is read from the soldier (dice.roll)."""
        t = self.t
        return frozenset(k for k, met in (("grounded", t.grounded() and not t.dead),
                                          ("comrade-died", self.stats["deaths"] > 0)) if met)

    def mid_air_catch(self, s):
        """talents.yaml, mid-air-catch: before a falling soldier's damage is rolled, a comrade holding the same Position,
        airborne, not carried, and carrying no one rolls fly with their own ODM Gear, needing the Talent's need, Pushable,
        no Help, spending nothing, as ODM use; a success makes the fall's band low, and a Jam makes the catcher fall
        (after_roll). POLICY CHOICE: the first such comrade who holds the Talent tries. Returns True on a catch."""
        for c in self.present():
            if (c is s or not c.airborne or c.carried_by is not None or c.carrying is not None or c.zone != s.zone
                    or not c.odm_working() or not use_talent(c, "mid-air-catch", consume=False)):
                continue
            use_talent(c, "mid-air-catch")
            self.stats["catch_rolls"] += 1
            need = R.talent_values["mid-air-catch"]
            c.odm_used = True
            res = roll(self.rng, c, "fly", gear="odm", push_to=need)
            self.after_roll(c, res, "odm")
            if res.succ >= need:
                self.stats["talent_fires"] += 1
                return True
            return False
        return False

    def change_order(self, a, b, done):
        """talents.yaml, change-the-order: at the swap step a soldier who holds a card and is neither Down nor Grabbed
        names two comrades, who exchange cards whatever Positions they hold; the namer takes no part. Returns True when a
        namer who has named no pair this swap step holds the Talent."""
        for o in self.alive():
            if (o in (a, b) or o.name in done or o.name not in self.card or o.down or o.grabbed or o.left
                    or not use_talent(o, "change-the-order")):
                continue
            done.add(o.name)
            self.stats["talent_fires"] += 1
            return True
        return False

    def ended(self):
        """engagement-flow.yaml, ending, as decision batch 8 (8-9) reads it: no Focus Titan alive and no soldier Pinned,
        or no soldier standing (a body-pinned soldier is not standing)."""
        return (self.t.dead and not self.pinned_present()) or not self.standing()

    def steam(self, positions, counter):
        """titan-harm.yaml, steam (decision batch 8, 8-7): every soldier holding one of the Positions rolls D6 on the
        steam table and takes that damage, Injury Type Burn, with a Critical Injury at 0 Health at a rolled Injury
        Location (dice.take_damage); a Down soldier who is airborne or mounted then falls. A case with steam False is
        the "without steam" comparison row."""
        if not self.cfg.get("steam", True):
            return
        for s in [x for x in self.present() if x.pos in positions]:
            if s.dead:
                continue
            self.stats[counter] += 1
            row = take_damage(self.rng, s, R.steam_damage(self.rng.randint(1, 6)), R.steam_type, gained=s.turns)
            if row is not None:
                self.count_ci(s)
                self.stats["steam_cis"] += 1
                self.after_harm(s, row)
            if not s.dead and s.down and s.airborne:
                self.fall(s)
            elif not s.dead and s.down and s.mounted:
                self.fall_from_horse(s)

    def titan_falls(self):
        """titan-harm.yaml, falling_titan (decision batch 8, 8-9): every soldier holding On Body or Blind Spot relative to
        the Titan who is not airborne is in its path (FALL_PATH). One who is not Down and not carried rolls Leap Clear:
        Agility with the ODM Gear's or, mounted, the horse's Gear Dice, needs R.leap_needs, Help from the same Position
        (policy.leap_helpers), Push when short, spending nothing; a success holds In Reach and a failure is Pinned. A
        Down soldier in the path is Pinned with no roll, and a carried soldier follows the carrier, Pinned with them on a
        failure (8-18). A soldier in the falling Titan's hand at a grounding stays Grabbed and outside the path; one freed
        at its death holds On Body for it (nape_strike; 8-18)."""
        st = self.stats
        for s in [x for x in self.present() if x.pos in FALL_PATH and not x.airborne and not x.pinned and not x.grabbed
                  and x.carried_by is None]:
            if s.dead or s.pinned:
                continue
            if s.down:
                self.pin(s)
                continue
            c = s.carrying
            gear = "horse" if s.mounted else ("odm" if s.odm_working() else None)
            hs = P.leap_helpers(self, s)
            st["leap_rolls"] += 1
            res = roll(self.rng, s, "leap-clear", bonus=len(hs), gear=gear, push_to=R.leap_needs)
            self.after_roll(s, res, gear)
            if s.dead:
                continue
            if res.succ >= R.leap_needs:
                st["leap_clears"] += 1
                s.pos = IR
                if c is not None:
                    c.pos = IR
                continue
            if c is not None:
                self.set_down(s)
                if not c.dead:
                    self.pin(c)
            self.pin(s)
        # anchor-ratings.yaml, wrecking, by_a_falling_titan (16-20): one rating step off the zone the body lands in, its
        # own zone; the dust effect is there for the step of the fall (16-30, no harm)
        self.wreck_zone(self.t.zone)

    def pin(self, s):
        """falling_titan, pinned: one Crush Critical Injury at a rolled Injury Location that cannot be lethal and takes no
        rider; a limb result pins that limb and side, a torso or head result pins the body. The soldier holds In Reach
        relative to the body, is not airborne or mounted, and cannot move, be moved, or react (can_step, lift, bound,
        titan_card); a body-pinned soldier has no action and is not standing."""
        self.stats["pins"] += 1
        row = gain_ci(self.rng, s, None, True, gained=s.turns, injury_type=R.pin_type)
        self.count_ci(s)
        ci = s.cis[-1]
        limb = ci["row"]["loc"] in R.ci_sided
        s.pinned = {"body": not limb, "loc": ci["row"]["loc"] if limb else R.heat_body_loc,
                    "side": ci["side"] if limb else None, "since": s.turns,
                    "part": self.pinning_part(ci["row"]["loc"], ci["side"]) if limb else None}
        if s.mounted:
            self.dismount(s)
        s.airborne = False
        # titan-harm.yaml, pinned (16-23): attachment pinned naming the body, in its zone, in-reach relative to it
        s.zone, s.attach = self.t.zone, ("pinned", self.t.label)
        self.after_harm(s, row)

    def corpse_heat(self, s):
        """decision batch 8, 8-7: a soldier Pinned under a corpse gains one Burn Critical Injury at the start of each of
        their turns after the fall, at the pinned limb's Injury Location and side, or at the torso for a body pin; it can
        be lethal, takes worsening, and takes no rider."""
        self.stats["heat_cis"] += 1
        row = gain_ci(self.rng, s, s.pinned["loc"], False, gained=s.turns, injury_type=R.heat_type, side=s.pinned["side"])
        self.count_ci(s)
        if row == "dead":
            self.stats["heat_deaths"] += 1
        self.after_harm(s, row)

    def heave(self, s, helpers=(), stay_for=None):
        """falling_titan, heave (decision batch 8, 8-9): an action; Strength, no Gear Dice, Help from the same Position,
        from In Reach or On Body relative to the pinning body (HEAVE_FROM). Each success adds 1 to the body's heave
        count, which never resets, and at its Heave rating every soldier it pins is freed at In Reach. On a corpse the
        heaver takes R.heave_heat Burn damage after the roll, whatever its result, with a Critical Injury at 0 Health at
        an arm, side rolled (8-7)."""
        t = self.t
        if (s.cur_action or s.down or s.grabbed or s.left or s.pos not in HEAVE_FROM or (s.pinned and s.pinned["body"])
                or not self.pinned_present()):
            raise ValueError(f"{s.name} cannot Heave (titan-harm.yaml, falling_titan, heave)")
        # under a retreat, a Heave for a Pinned comrade at the soldier's Position is option 4's action (8-21)
        self.order_check(s, stay_for=stay_for, action="heave")
        s.cur_action = True
        self.stats["heaves"] += 1
        res = roll(self.rng, s, "heave", bonus=len(helpers), push_to=max(1, t.heave_rating - t.heave_count))
        self.after_roll(s, res, None)
        t.heave_count += res.succ
        if t.dead and not s.dead:
            row = take_damage(self.rng, s, R.heave_heat, R.heat_type, gained=s.turns, loc=R.heave_heat_loc)
            if row is not None:
                self.count_ci(s)
                self.after_harm(s, row)
        if res.succ >= 1 and t.heave_count >= t.heave_rating:
            self.free_pinned()      # decision batch 8, 8-22: a Heave with no success frees no one

    def pinning_part(self, loc, side):
        """falling_titan, pinned, pinning_body_part (decision batch 8, 8-17): the Titan's Body Part of the pinned limb's
        kind and side; if it is Broken, the other of that kind; if both are, none (only a Heave or the Titan standing
        frees the soldier)."""
        t = self.t
        kind = [p for p in t.part_ids if t.kind[p] == loc]
        same = [p for p in kind if side in p.split("-")]
        return next((p for p in same + [p for p in kind if p not in same] if t.state[p] < R.broken), None)

    def free_pinned(self, part=None):
        """Frees at In Reach every soldier the body pins (a Heave at the rating, a living Titan standing), or those one
        Body Part pins when it is Broken (cutting free, 8-17)."""
        for s in self.present():
            if s.pinned and (part is None or s.pinned.get("part") == part):
                s.pinned = None
                s.airborne = False
                s.pos = IR      # the detach rule: ground in the body's zone (16-8)
                self.stats["freed" if part is None else "cut_free"] += 1

    def crush_only(self, s):
        """grab.yaml, grab_lands, pinned_target (decision batch 8, 8-18): a grab effect that lands on a Pinned soldier
        takes no hold; the crush lands, a torso Crush Critical Injury that cannot be lethal, with no rider."""
        self.stats["pinned_crushes"] += 1
        row = gain_ci(self.rng, s, GRAB_CRUSH_LOCATION, True, gained=s.turns, injury_type=GRAB_CRUSH_TYPE)
        self.count_ci(s)
        self.after_harm(s, row)

    def titan_death_steps(self, grounded_before):
        """titan-harm.yaml, titan_death, after the nape-kill relief and the Grabbed soldier freed (decision batch 8):
        steam at the kill (8-7); the fall, unless the Titan was already grounded, whose Pinned stay Pinned (8-9); and
        the corpse's Positions, On Body and Blind Spot reading In Reach. While a soldier lies Pinned the Titan Engagement
        runs on (ended)."""
        for s in self.sold:
            s.forced_strike = False     # decision batch 8, 8-16: a forced strike ends when the event's Titan dies
        self.steam(STEAM_AT_KILL, "steam_kill")
        if not grounded_before:
            self.titan_falls()
        for s in self.present():
            if s.attach[1] == self.t.label and s.attach[0] != "pinned":
                s.pos = IR      # positions.yaml, corpse (16-24): every attachment naming it but pinned ends (detach rule)
        self.field.zones[self.t.zone].effects.add("steam")     # zones.yaml, effects, steam, in a corpse's zone (no harm)
        if self.pinned_present():
            self.stats["ran_on"] += 1

    def death_rolls(self, s):
        for c in list(s.cis):
            if s.dead:
                return
            if not c["treated"] and c["limit"] == "turn" and c["gained"] < s.turns:
                out = death_roll(self.rng, s, c)
                if out == "dies":
                    self.kill(s)
                    return
                if out == "fights-back":
                    c["limit"] = R.limit_slows["turn"]

    # ------------------------------------------------------------------ wrecks and the Stride (decision batch 16)
    def wreck_zone(self, n):
        """titan-format.yaml, effect_types, wreck, and a falling Titan (16-20): the zone takes one rating step toward Open
        (space.wreck). A zone that becomes Open while a standing Focus Titan is in it (16-21): every soldier at its Blind
        Spot holds on-body instead, not a fall, and every soldier anchored there becomes ground and stops being
        airborne, with no fall. Momentum above the zone's new anchors is lost at once (16-4)."""
        if n is None:
            return
        st = self.stats
        st["wrecks"] += 1
        frm, to, graced = space.wreck(self.field, R, n)
        st["wreck_graces"] += 1 if graced else 0
        if frm == to:
            return
        st["wreck_steps"] += 1
        t = self.t
        standing = not t.dead and not t.grounded() and t.zone == n
        if to == R.open_rating and standing:
            st["zones_opened"] += 1
            for s in self.present():
                if s.zone != n or s.pinned or s.carried_by is not None:
                    continue
                if s.attach == ("blind-spot", t.label):
                    s.attach = ("on-body", t.label)
                elif s.attach[0] == "anchored":
                    s.attach = ("ground", None)
                    s.airborne = False
        if standing and not self.bs_lost and not space.blind_spot_exists(R, self.field.rating(n), False):
            self.bs_lost = True
            st["bs_lost"] += 1
        for s in self.present():
            if s.zone == n:
                self.trim_momentum(s)

    def stride(self, h):
        """behavior-procedure.yaml, resolving_a_card, stride (16-16 to 16-19): if the holder is in another zone, the Titan
        moves toward the holder's zone one zone at a time, up to its Stride, stopping on entering it, the lower-numbered
        zone on a tie (space.stride_route). Every soldier on-body or grabbed naming it moves with it, with any comrade they
        carry; every soldier at its Blind Spot stays in the zone it leaves, anchored if airborne and on the ground if not.
        It harms nobody, sets and clears no flag, and wrecks nothing."""
        t = self.t
        if h.zone is None or h.zone == t.zone:
            return
        st = self.stats
        st["stride_steps"] += 1
        route = space.stride_route(self.field, t.zone, h.zone, t.stride_now())
        if not route:
            return
        st["strides"] += 1
        for z in route:
            for s in self.present():
                if s.carried_by is not None or s.attach[1] != t.label:
                    continue
                if s.attach[0] in ("on-body", "grabbed"):
                    s.zone = z
                    st["stride_carried"] += 1
                    if s.carrying is not None:
                        self.follow(s.carrying, s)
                elif s.attach[0] == "blind-spot":
                    s.attach = (self.free_kind(s), None)
                    st["stride_left"] += 1
            t.zone = z
            st["stride_zones"] += 1
        if h.zone == t.zone:
            st["stride_reach"] += 1
        for s in self.present():
            if s.attach[1] == t.label:
                self.trim_momentum(s)

    # ------------------------------------------------------------------ Attention
    def meets(self, s, rung, most):
        if rung == "nearest":
            return True
        if s.down and not R.tests[rung]["down_can_meet"]:
            return False
        if rung == "hooked-into-its-body":
            return s.pos == OB or s.flags["hooked"]
        if rung == "nearest-person-in-reach":
            return s.pos == IR
        if rung == "just-hurt-it":
            return s.flags["hurt"]
        if rung == "loudest-or-brightest":
            return s.flags["loud"]
        if rung == "current-holder":
            return self.t.holder is s and s.pos != D
        if rung == "mounted":
            return s.mounted
        if rung == "airborne":
            return s.airborne and not s.mounted
        if rung == "carrying-a-comrade":
            return s.carrying is not None
        if rung == "most-harmed":
            return len(s.cis) == most
        if rung == "down":
            return s.down
        raise ValueError(rung)

    def evaluate(self, end_step=False, only=None):
        """attention.yaml, evaluation. `only` narrows the candidates to a retargeting evaluation's set: the same
        rungs, the same steps, no new rule of selection (evaluation, retargeting; decision batch 13, 13-9)."""
        t = self.t
        self.stats["ladder_evals"] += 1
        cands = self.present() if only is None else list(only)
        if not cands:
            t.holder = None
            return
        most = max(len(c.cis) for c in cands)
        rungs = t.rungs
        top = next(i for i, r in enumerate(rungs) if any(self.meets(s, r, most) for s in cands))
        tied = [s for s in cands if self.meets(s, rungs[top], most)]
        if rungs[top] == "nearest":
            best = min(NEAREST[s.pos] for s in tied)
            tied = [s for s in tied if NEAREST[s.pos] == best]
        if rungs[top] == "hooked-into-its-body":
            struck = [s for s in tied if s.flags["hooked"]]
            if struck:
                tied = struck
        for r in rungs[top + 1:]:
            if r == "nearest":
                best = min(NEAREST[s.pos] for s in tied)
                tied = [s for s in tied if NEAREST[s.pos] == best]
            else:
                sub = [s for s in tied if self.meets(s, r, most)]
                if sub:
                    tied = sub
        if len(tied) == 1:
            t.holder = tied[0]
        elif t.holder in tied:
            pass
        elif self.card and not end_step:
            t.holder = min(tied, key=lambda s: self.card.get(s.name, 99))
        else:
            t.holder = None   # attention.yaml, evaluation, none (decision batch 4, 4-3)

    def clear_flags(self):
        for s in self.sold:
            s.flags = {"hooked": False, "hurt": False, "loud": False}

    # ------------------------------------------------------------------ the start
    def start_triggers(self):
        if "start_fear" in self.cfg:
            trig = list(self.cfg["start_fear"])
        else:
            trig = ["abnormal"] if self.t.abnormal else []
        for tr in trig:
            if tr not in R.fear_triggers:
                raise ValueError(tr)
        return trig

    def begin(self):
        t = self.t
        t.nb = t.roll_nb(self.rng, self.stats)   # a new Focus Titan is at Frenzy 0, so this is a plain D6
        self.evaluate(end_step=True)
        trig = self.start_triggers()
        if trig:
            rollers = self.present()
            for s in rollers:
                s.cur_move = s.cur_action = True     # round 0 has no turn: spent turns and actions land on round 1
            self.fear_event(rollers, trig)           # decision batch 8, 8-40: the start is one event
            for s in rollers:
                s.cur_move = s.cur_action = False
                self.stats["start_fear_rolls"] += 1

    # ------------------------------------------------------------------ Read and Call It
    def read(self, s):
        """read.yaml: an action from a Position, not Grabbed, needing 1, with the read-from-distant Bonus Dice at
        Distant; each success picks one fact the Titan's kind allows or pays toward Call It."""
        t = self.t
        if t.dead or s.grabbed or s.down or s.cur_action or s.left:
            return False
        self.order_check(s)
        s.cur_action = True
        bonus = R.read_distant_dice if s.pos == D else 0
        res = roll(self.rng, s, R.read_entry, bonus=bonus, push_to=R.read_needs, attribute=R.read_attribute)
        self.stats["reads"] += 1
        for _ in range(res.spend_turns):
            self.spend_turn(s)
        if res.succ < R.read_needs:
            return False
        self.stats["read_successes"] += 1
        kind = "abnormal" if t.abnormal else "standard"
        picks, call = P.read_picks(self, s, res.succ)
        need = R.call_it_sharp if "sharp-call" in s.rule_talents else R.call_it_successes
        spent = len(picks) + ((need - 1) if call else 0)
        if spent > res.succ or len(set(picks)) != len(picks) or any(kind not in R.read_facts[f] for f in picks):
            raise ValueError(f"policy.read_picks picked {picks} with Call It {call} on {res.succ} successes")
        for fact in picks:
            if fact == "next-behavior":
                t.nb_revealed = True
            elif fact == "attention-ladder":
                t.ladder_revealed = True
            else:
                t.revealed.add(fact)
        if call and "next-behavior" in picks and not (t.called and t.called["serial"] == t.nb_serial):
            t.called = {"serial": t.nb_serial, "reader": s}
            self.stats["calls"] += 1
            self.stats["tracker_writes"] += 1       # gm_tracker, focus_titan_row: Call It on the Next Behavior
        return True

    # ------------------------------------------------------------------ a Titan's card
    def choose_behavior(self):
        """behavior-procedure.yaml, resolving_a_card, choose, in full (decision batch 13, 13-9; OQ-192).

        The Attention holder who does not meet the rolled entry's position_requirement no longer drops the Titan to
        its fallback. The Attention Ladder is evaluated again over only the candidates who do meet it, and the
        soldier it returns holds the Titan's Attention from that moment, so the entry's targets are read from them
        (attention.yaml, evaluation, retargeting). Only when no candidate meets it does the fallback run, exactly as
        it did before, with Attention unchanged."""
        t = self.t
        h = t.holder
        if t.nb == t.thrash:
            return t.thrash, h
        e = t.entries[t.nb]
        if not t.parts_ok(e):
            return t.thrash, h
        if h.pos in e["position_requirement"]:
            return t.nb, h
        # the holder cannot meet it: narrow the candidates and read the Ladder again over them
        if self._retarget(e):
            self.stats["retargets"] += 1
            return t.nb, t.holder
        # attention.yaml, evaluation, retargeting, none: nothing is evaluated and Attention does not change
        self.stats["retarget_misses"] += 1
        # the fallback is tested the same way, retargeting in its turn (round 3 review 1, M1)
        fb = e["fallback"]
        if fb in (t.thrash, "none") or fb == t.prev:
            return t.thrash, h
        fe = t.entries[fb]
        if not t.parts_ok(fe):
            return t.thrash, h
        if h.pos in fe["position_requirement"]:
            return fb, h
        if self._retarget(fe):
            self.stats["retargets"] += 1
            return fb, t.holder
        return t.thrash, h

    def _retarget(self, entry):
        """attention.yaml, evaluation, retargeting: narrow the candidates to those who meet the entry's
        position_requirement and read the Ladder again over them. True when Attention moved."""
        narrowed = [c for c in self.present() if c.pos in entry["position_requirement"]]
        if not narrowed:
            return False
        self.evaluate(only=narrowed)
        return True

    def titan_card(self):
        t = self.t
        self.stats["tracker_writes"] += 1       # round.yaml, gm_tracker, per_round_order: after each Titan card
        if t.dead:
            return
        if t.grab:
            self.stats["grab_cards"] += 1
            return
        if t.holder == "decoy":
            t.hold_left -= 1
            t.prev = t.nb
            t.nb = t.roll_nb(self.rng, self.stats)   # a decoy's card spends the Next Behavior, and any Call It on it
            self.stats["decoy_cards"] += 1
            if t.hold_left > 0:
                return
            t.holder = None
            self.evaluate()
            return
        self.evaluate()
        h = t.holder
        if h is None:
            return
        self.stride(h)                      # the stride step, between attention and choose (16-16)
        called = t.called if (t.called and t.called["serial"] == t.nb_serial) else None
        beh, h = self.choose_behavior()     # the choose step may move Attention (decision batch 13, 13-9)
        entry = t.entries[beh]
        dice = entry.get("attack_dice") or 0
        effects = entry["effects"]
        grab_entry = any(e["type"] == "grab" for e in effects)
        if entry["targets"] == "holder":
            targets = [h]
        else:
            # titan-format.yaml, holder-and-position (16-18): every soldier in the holder's zone who holds the same
            # Position relative to the Titan, except a soldier who is Grabbed
            targets = sorted((s for s in self.present() if s.zone == h.zone and s.pos == h.pos and not s.grabbed),
                             key=lambda s: self.card.get(s.name, 99))
        # decision batch 8, 8-1 (ADR-0019): the entry's Attack Dice are rolled once, in the open, as Titan Dice, and every
        # target compares against the same successes; 0 successes whiff against every target
        tsucc = titan_roll(self.rng, dice)
        if dice:
            self.stats["titan_rolls"] += 1
            if tsucc == 0:
                self.stats["whiffs"] += 1
        info = []
        for s in targets:
            if not s.nerves_done:
                s.nerves_done = True
                if s.has_scar("nerves-on-edge"):
                    s.stress += R.scar_rows["nerves-on-edge"]["stress"]
            dodge_round = None
            first_counted = self.rnd if not s.card_passed else self.rnd + 1
            # dice.attack_net: a whiff rolls no dodge and keeps the Reaction for a later card; one Reaction per Titan
            # per round cancels against each later card (OQ-14); a soldier who cannot react cancels nothing
            if (tsucc >= 1 and s.dodge_succ is None and not s.down and not s.grabbed and not s.pinned and s.ban == 0
                    and not s.dead and P.wants_dodge(self, s, effects, tsucc)):
                dodge_round = self.spend_turn(s)
                gear = "horse" if s.mounted else ("odm" if s.odm_working() else None)
                bonus = 0
                if called is not None and called["reader"] is not s:
                    bonus += R.call_it_dice
                    self.stats["call_dodges"] += 1
                hs = P.dodge_helpers(self, s)
                bonus += len(hs)
                self.stats["dodge_helps"] += len(hs)
                cov = P.dodge_coverer(self, s)
                pen = R.scar_rows["the-closing-hand"]["cond_pen"]["dodge"] if grab_entry and s.has_scar("the-closing-hand") else 0
                was_odm, was_horse = s.odm, s.horse
                res = roll(self.rng, s, "dodge", bonus=bonus, gear=gear, push_to=tsucc, cover=cov, extra_pen=pen)
                if res.covered is not None:
                    self.stats["covers"] += 1
                    if res.covered is not True and res.covered.covered_comrade is None:
                        res.covered.covered_comrade = s.name      # Got Your Back's first Covered comrade
                self.stats["dodges"] += 1
                self.after_roll(s, res, gear)
                if gear == "odm" and was_odm > 0 and s.odm == 0:
                    self.stats["jam_dodges"] += 1
                if gear == "horse" and was_horse > 0 and s.horse == 0:
                    self.stats["lame_dodges"] += 1
                s.dodge_succ = res.succ
            info.append((s, attack_net(tsucc, s.dodge_succ), dodge_round, first_counted))
        for s, net, dodge_round, first_counted in info:
            if net < 1 or s.dead:
                continue
            self.stats["lands"] += 1
            self.stats["r1_lands"] += 1 if self.rnd == 1 else 0
            for eff in effects:
                if s.dead:
                    break    # decision batch 4, OQ-107
                typ = eff["type"]
                if typ == "stress":
                    s.stress += eff["amount"]
                elif typ == "critical-injury":
                    loc = None if eff["injury_location"] == "rolled" else eff["injury_location"]
                    # decision batch 8, 8-2: +1 per net success beyond the first; the cap and instant-death rows stand
                    row = gain_ci(self.rng, s, loc, eff["cannot_be_lethal"], gained=s.turns,
                                  injury_type=eff["injury_type"], rider=ci_rider(net))
                    if net > 1:
                        self.stats["rider_cis"] += 1
                    self.count_ci(s)
                    if s.mounted:
                        self.stats["rider_harm"] += 1
                    self.after_harm(s, row)
                    if not s.dead and s.down and s.airborne:
                        self.fall(s)
                    elif not s.dead and s.down and s.mounted:
                        self.fall_from_horse(s)
                elif typ == "knock-loose":
                    if not s.mounted and (s.airborne or s.pos in R.fall_high):
                        self.fall(s)
                elif typ == "grab":
                    # grab.yaml, grab_lands: lands_on net successes, no rider; on a Pinned soldier the crush only (8-18)
                    if not grab_net_lands(net):
                        continue
                    if s.pinned:
                        self.crush_only(s)
                    else:
                        self.grab_lands(s, dodge_round, first_counted)
        if any(e["type"] == "telegraph" for e in effects):
            self.stats["telegraphs"] += 1
        if any(e["type"] == "wreck" for e in effects) and not t.dead:
            self.wreck_zone(t.zone)          # whether the behavior landed or whiffed (16-20)
        if beh == t.thrash:
            self.stats["thrash"] += 1
        t.prev = beh
        t.decoys_in_a_row = 0
        self.clear_flags()
        t.nb = t.roll_nb(self.rng, self.stats)   # Call It ends when the card that resolves it is finished
        self.stats["resolved"] += 1

    # ------------------------------------------------------------------ the Grab
    def grab_lands(self, h, dodge_round=None, first_counted=None):
        """grab.yaml, grab_lands, steps in order (decision batch 5, 5-6, OQ-124): failed-dodge, hold, crush, attention,
        witnesses. The hold makes the target Grabbed before the crush, so a target the crush makes Down is Down in the
        Titan's hand and does not fall."""
        t = self.t
        # failed-dodge (grab.yaml, countdown, failed_dodge)
        if dodge_round is not None and first_counted is not None and dodge_round > first_counted:
            h.pre_turn.discard(dodge_round)
            if first_counted == self.rnd:
                h.cur_move = h.cur_action = True
            else:
                h.pre_turn.add(first_counted)
            self.stats["grab_dodge_refunds"] += 1
        # hold: airborne ends, a mounted target dismounts with no fall (horses.yaml, forced_dismount, grabbed), a carried
        # target stops being carried with no fall, and a comrade the target carried is set down, falling if the target
        # was airborne (carrying.yaml, carrying_a_comrade, ends; falls.yaml, triggers, carried)
        was_air = h.airborne
        if h.mounted:
            self.dismount(h)
        if h.carried_by is not None:
            h.carried_by.carrying = None
            h.carried_by = None
        c, band = None, None
        if h.carrying is not None:
            band = self.fall_band(h)
            c = self.set_down(h)
        arm = next(p for p in t.part_ids if t.kind[p] == R.grab_kind and t.state[p] < R.broken)
        t.count[arm] = 0
        t.grab = {"victim": h, "arm": arm, "counted": 0, "lifted": False, "clear": False}
        h.grabbed = True
        h.zone, h.attach = t.zone, ("grabbed", t.label)       # grab.yaml (16-23): grabbed naming it, on-body
        h.airborne = False
        if c is not None and was_air and not c.dead:
            self.fall_carried(c, band)
        # crush: a torso Crush Critical Injury that cannot be lethal, on a soldier already Grabbed
        row = gain_ci(self.rng, h, GRAB_CRUSH_LOCATION, True, gained=h.turns, injury_type=GRAB_CRUSH_TYPE)
        self.count_ci(h)
        self.after_harm(h, row)
        if h.dead:
            return
        # attention
        t.holder = h
        self.stats["grabs"] += 1
        self.grab_this_round = True
        # witnesses
        self.witnesses(h, "comrade-grabbed")

    def release(self, dead=False):
        t = self.t
        g = t.grab
        v = g["victim"]
        t.count[g["arm"]] = 0
        t.grab = None
        if t.holder is v:
            t.holder = None
        v.grabbed = False
        if dead or v.dead:
            return
        if g["lifted"]:
            v.attach = ("on-body", t.label)      # freed after a lift: a fall first, then ground (16-23)
            self.fall(v)
        else:
            v.pos = IR                           # freed and not lifted: ground in the holding Titan's zone

    def grabbed_turn(self, s):
        t = self.t
        g = t.grab
        g["counted"] += 1
        self.stats["tracker_writes"] += 1        # after each counted turn of a Grabbed soldier
        if g["counted"] == 1:
            s.cur_action = True     # grab.yaml, countdown, first_turn_action
        if not s.cur_action and not s.down and P.wants_break_free(self, s):
            s.cur_action = True
            hs = P.helpers(self, s, R.help_max) if self.cfg.get("escapes") else []
            lifted_pen = R.break_free_lifted_penalty if g["lifted"] else 0
            if lifted_pen and use_talent(s, "not-like-this"):
                lifted_pen = 0             # talents.yaml, not-like-this
                self.stats["talent_fires"] += 1
            res = roll(self.rng, s, "break-free", bonus=len(hs), gear="blade", push_to=R.break_free_needs,
                       extra_pen=lifted_pen)
            self.after_roll(s, res, "blade")
            if res.succ >= R.break_free_needs and t.grab is g and not s.dead:
                self.release()
                self.shoulder_charge(s)
        self.death_rolls(s)
        if not s.dead and t.grab is g:
            if g["counted"] == 1:
                g["lifted"] = True
            else:
                self.stats["devours"] += 1
                self.kill(s)

    def pry_loose(self, s):
        """talents.yaml, pry-loose; grab.yaml, escapes, pry-loose: a comrade at on-body, not Grabbed, takes
        break-free with their own pool on the Grabbed soldier's behalf."""
        t = self.t
        g = t.grab
        if (g is None or "pry-loose" not in s.rule_talents or s.grabbed or s.down or s.cur_action or s.pos != OB
                or g["victim"] is s or s.left):
            return False
        self.order_check(s, stay_for=g["victim"], action="break-free")   # at the victim's Position: option 4's action
        s.cur_action = True
        self.stats["pry_rolls"] += 1
        res = roll(self.rng, s, "break-free", gear="blade", push_to=R.pry_loose_needs,
                   extra_pen=R.pry_loose_lifted_penalty if g["lifted"] else 0)
        self.after_roll(s, res, "blade")
        if res.succ >= R.pry_loose_needs and t.grab is g and not g["victim"].dead:
            self.stats["pry_frees"] += 1
            self.release()
            self.shoulder_charge(s)
            return True
        return False

    def shoulder_charge(self, s):
        """talents.yaml, shoulder-charge: a break-free roll that frees a Grabbed soldier gives the Titan Openings created
        by the roller."""
        if not self.t.dead and use_talent(s, "shoulder-charge"):
            self.t.openings.extend([s.name] * R.talent_values["shoulder-charge"])
            self.stats["talent_fires"] += 1

    # ------------------------------------------------------------------ strikes
    def can_strike_part(self, s, part):
        t = self.t
        if s.grabbed or s.down or not s.handles or t.state[part] == R.broken:
            return False
        grounded = t.grounded()
        g = t.grab
        if g and g["arm"] == part:
            reach = set(R.grab_reach_after if g["lifted"] else R.grab_reach_before)
            if g["clear"]:
                reach.add(IR)
            if s.pos not in reach:
                return False
            return s.pos not in ODM_STRIKE_POSITIONS or g["clear"] or grounded or s.odm_working()
        reach = set(R.part_kinds[t.kind[part]]["strike_from"])
        if grounded:
            reach |= R.grounded_reach
        if s.pos not in reach:
            return False
        return s.pos not in ODM_STRIKE_POSITIONS or grounded or s.odm_working()

    def body_strike(self, s, part, helpers=(), hamstring=False, push_to=None, stay_for=None):
        t = self.t
        grounded_before = t.grounded()
        need = t.tough(part) - t.count[part]
        holding = bool(t.grab and t.grab["arm"] == part)
        # stay_for: a Pinned comrade whose pinning Body Part this is, under a retreat (8-21)
        self.order_check(s, stay_for=stay_for or (t.grab["victim"] if (holding and s.pos == t.grab["victim"].pos) else None),
                         action="body-part-strike")
        s.cur_action = True
        s.forced_strike = False       # a Body Part strike takes a Fear row's forced strike (decision batch 7, 7-8)
        bite = self.bite(s, R.bonus_cap - len(helpers))
        res = roll(self.rng, s, "body-part-strike", bonus=len(helpers) + bite, gear="blade",
                   push_to=need if push_to is None else push_to,
                   extra_pen=R.grab_strike_penalty if holding else 0, context=self.talent_context())
        self.stats["bodies"] += 1
        self.stats["tracker_writes"] += 1        # after each strike or Break Attention
        self.after_roll(s, res, "blade")
        succ = res.succ
        if holding and succ >= 1 and use_talent(s, "wrist-cut"):
            succ += R.talent_values["wrist-cut"]     # talents.yaml, wrist-cut
            self.stats["talent_fires"] += 1
        if hamstring and succ >= 1:
            succ += R.hamstring_extra
        if succ >= 1 and not t.dead:
            self.set_flag(s, "hurt")        # a corpse gives no flag and no Openings (decision batch 8, 8-17)
        for _ in range(succ):
            if t.state[part] == R.broken:
                if not t.dead:
                    t.openings.append(s.name)
                continue
            t.count[part] += 1
            if t.count[part] >= t.tough(part):
                t.state[part] += 1
                t.count[part] = 0
                if t.state[part] == R.broken:
                    if t.kind[part] in R.flare_blocking_kinds:
                        self.stats["eye_breaks"] += 1
                    if t.grab and t.grab["arm"] == part:
                        self.release()
                    self.free_pinned(part)      # cutting free: the Broken part frees those it pins (8-17)
        if not grounded_before and t.grounded() and not t.dead:
            self.titan_falls()      # decision batch 8, 8-9: the body comes down when it becomes grounded
        return succ

    def can_nape(self, s, spent_ok=False):
        t = self.t
        """squad-tactics.yaml and attention.yaml: a Nape strike from Blind Spot, never during a retreat, on a turn or
        through Hook and Cut (background-titans.yaml, retreat, effects, actions; decision batch 5b, 5-15)."""
        return (s.pos == BS and t.holder is not s and not s.grabbed and not s.down and s.handles and not s.left
                and (spent_ok or not s.cur_action) and (s.odm_working() or t.grounded()) and not self.retreat)

    def bite(self, s, room):
        """anchor-ratings.yaml, momentum, spends, bite (16-14): 1 Bonus Die for each Momentum spent on a strike this turn
        against a Focus Titan in the zone the Flight ended in, within the cap; declared before the roll. How much is
        policy.bite's choice."""
        n = min(max(0, room), s.momentum, P.bite(self, s)) if s.flight_zone is not None and s.flight_zone == self.t.zone \
            and s.flight_zone == s.zone and not self.t.dead else 0
        if n:
            s.momentum -= n
            self.stats["momentum_spent"] += n
            self.stats["momentum_bite"] += n
        return n

    def free_openings(self, s):
        return sum(1 for o in self.t.openings if o != s.name)

    def nape_bonus_without_help(self, s):
        g = R.grounded_bonus if self.t.grounded() else 0
        return min(R.bonus_cap, g + self.free_openings(s))

    def nape_strike(self, s, help_nape=True, ready_blade=False):
        t = self.t
        g = R.grounded_bonus if t.grounded() else 0
        free = [i for i, o in enumerate(t.openings) if o != s.name]
        use = min(len(free), max(0, R.bonus_cap - g))
        for i in sorted(free[:use], reverse=True):
            t.openings.pop(i)
        if self.retreat:
            raise ValueError(f"{s.name} made a Nape strike during a retreat (background-titans.yaml, retreat, effects, actions)")
        self.order_check(s)
        bite = self.bite(s, R.bonus_cap - g - use)
        hs = P.helpers(self, s, R.bonus_cap - g - use - bite) if help_nape else []
        self.stats["nape_helps"] += len(hs)
        self.stats["nape_helps_adjacent"] += sum(1 for h in hs if h.zone != s.zone)
        if self.stats.get("first_nape_round") is None:
            self.stats["first_nape_round"] = self.rnd
        if ready_blade:
            self.spend_action(s)      # talents.yaml, ready-blade: the Nape strike spends the action of the next turn
        s.cur_action = True
        s.forced_strike = False       # a Nape strike takes a Fear row's forced strike (decision batch 7, 7-8)
        res = roll(self.rng, s, "nape-strike", bonus=g + use + bite + len(hs), gear="blade", push_to=t.nd,
                   context=self.talent_context())
        self.stats["napes"] += 1
        self.stats["tracker_writes"] += 1
        self.after_roll(s, res, "blade")
        self.set_flag(s, "hooked")
        P.on_nape(self, s, res)
        if res.succ >= t.nd:
            grounded_before = t.grounded()
            t.dead = True
            t.called = None
            for c in self.alive():          # stress-changes.yaml, reductions, nape-kill
                c.stress = max(c.min_stress, c.stress - R.relief_nape)
            if s.has_scar("blood-on-the-blade") and not s.dead:
                s.stress += R.scar_rows["blood-on-the-blade"]["stress"]
            freed = t.grab["victim"] if t.grab else None
            if t.grab:
                self.release()
            if freed is not None and not freed.dead:
                # decision batch 8, 8-18: freed at the death, the victim holds On Body relative to the dying body and is not
                # airborne for the steam and the fall; a release that made them fall has resolved first
                freed.pos, freed.airborne = OB, False
            self.titan_death_steps(grounded_before)
            return True
        t.openings.extend([s.name] * res.succ)
        return False

    # ------------------------------------------------------------------ Break Attention
    def ba_need(self, s, decoy):
        t = self.t
        n = R.ba_needs
        if t.grab:
            base = n["titan_holds_a_grabbed_soldier"]
        else:
            base = n["holder"] if t.holder is s else n["anyone_else"]
        if decoy == "feint" and not use_talent(s, "close-pass", consume=False):
            base += n["feint_extra"]      # talents.yaml, close-pass: the Feint adds nothing (used in break_attention)
        return base + n["per_decoy_in_a_row"] * t.decoys_in_a_row

    def feint_gears(self, s):
        """attention.yaml, decoys, feint: its ways, in the order working ODM Gear, the horse, on foot."""
        out = []
        if s.pos not in R.feint_positions:
            return out
        if s.odm_working():
            out.append("odm")
        if s.mounted and s.horse > 0 and not s.horse_gone:
            out.append("horse")
        if not s.mounted and self.t.grounded():
            out.append(None)
        return out

    def decoy_legal(self, s, decoy):
        t = self.t
        if t.dead or t.holder == "decoy" or s.grabbed or s.down:
            return False
        if decoy == "flare":
            return self.flares > 0 and not t.eyes_broken()
        if decoy == "riderless-horse":
            return self.horse_usable(s)
        if decoy == "thrown-cloak":
            return s.pos in R.cloak_positions and not s.cloak_thrown and not t.eyes_broken()
        if decoy == "feint":
            return bool(self.feint_gears(s))
        raise ValueError(decoy)

    def ba_gear(self, s, decoy):
        """The gear a Break Attention rolls with: the horse for the riderless horse; a Feint's own way;
        otherwise ODM Gear if it counts as had, else a horse the soldier may use (horses.yaml, gear_dice)."""
        if decoy == "riderless-horse":
            return "horse"
        if decoy == "feint":
            return self.feint_gears(s)[0]
        if s.odm_working():
            return "odm"
        if self.horse_usable(s):
            return "horse"
        return None

    def break_attention(self, s, decoy, gear="auto"):
        t = self.t
        if gear == "auto":
            gear = self.ba_gear(s, decoy)
        need = self.ba_need(s, decoy)
        if decoy == "feint" and R.ba_needs["feint_extra"] and use_talent(s, "close-pass"):
            self.stats["talent_fires"] += 1
        self.order_check(s, stay_for=t.grab["victim"] if (t.grab and s.pos == t.grab["victim"].pos) else None,
                         action="break-attention")
        s.cur_action = True
        if decoy == "flare":
            self.flares -= 1
            self.stats["flares"] += 1
        elif decoy == "thrown-cloak":
            s.cloak_thrown = True
            self.stats["cloaks"] += 1
        elif decoy == "feint":
            self.stats["feint_rolls"] += 1
        res = roll(self.rng, s, "break-attention", gear=gear, push_to=need)
        self.stats["tracker_writes"] += 1
        self.after_roll(s, res, gear)
        if res.succ >= need and not t.dead and not s.dead and t.holder != "decoy":
            if decoy == "feint":
                self.stats["feints"] += 1
                if gear is None:
                    self.stats["onfoot_feints"] += 1
            self.decoy_success(s, res.succ, need, decoy)
            return True
        return False

    def decoy_success(self, s, succ, need, decoy):
        t = self.t
        if t.grab:
            self.stats["ba_rescues"] += 1
            self.release()
        t.holder = "decoy"
        t.decoys_in_a_row += 1
        t.hold_left = t.tempo if self.cfg.get("decoy_hold", "tempo") == "tempo" else 1
        if decoy == "flare" and use_talent(s, "flare-discipline"):
            t.hold_left += R.talent_values["flare-discipline"]     # talents.yaml, flare-discipline
            self.stats["talent_fires"] += 1
        self.stats["decoys"] += 1
        t.openings.extend([s.name] * (succ - need))
        if decoy == "riderless-horse":
            s.mounted = False
            s.horse_gone = True
            s.horse_zone = None
            self.stats["horses_sent"] += 1
        P.after_decoy(self, s)

    # ------------------------------------------------------------------ a soldier's turn
    def soldier_turn(self, s):
        t = self.t
        s.turns += 1
        s.quiet = False          # quiet and bite last the soldier's own turn (anchor-ratings.yaml, momentum, spends)
        s.flight_zone = None
        if s.wing_of is not None:
            self.stats["wing_turns"] += 1
        ban_started = s.ban > 0
        if s.down:
            s.cur_action = True
        if not s.handles and s.blades > 0 and not s.down:
            s.handles = True      # blade-sets.yaml, swap: free once per turn
        if s.forced_move is not None:
            # effect-types.yaml, forced-move (decision batch 7, 7-8): at the start of the next turn, before its action;
            # no move for a soldier Grabbed, Down, or carried. READING: the step is made even on a turn whose move a
            # result spent, since a row that spends the turn may also force the move
            toward, s.forced_move = s.forced_move, None
            if not (s.left or s.down or s.grabbed or s.carried_by is not None or s.pinned):
                # positions.yaml, moves, forced_step: it spends nothing (decision batch 16 rewrote the step for zones; the
                # engine before it spent the move with the step)
                if P.forced_move(self, s, toward):
                    self.stats["fear_moves"] += 1
        if s.pinned and t.dead and s.pinned["since"] < s.turns and not s.left:
            self.corpse_heat(s)     # decision batch 8, 8-7: at the start of each turn after the fall, under a corpse
        if s.dead:
            pass
        elif s.left:
            # positions.yaml, leaving, after_leaving: the turn happens and counts (a turn-limit Death Roll still comes),
            # but its move can only return, which no one may do during a retreat, and no action a policy takes is modelled
            s.cur_move = s.cur_action = True
            self.death_rolls(s)
        elif s.grabbed and t.grab and t.grab["victim"] is s:
            self.grabbed_turn(s)
        elif s.down or s.carried_by is not None:
            if s.carried_by is None:
                P.down_turn(self, s)
            self.death_rolls(s)
        elif s.pinned:
            self.stats["pinned_turns"] += 1
            P.pinned_turn(self, s)
            self.death_rolls(s)
        elif self.retreat:
            P.retreat_turn(self, s)
            self.death_rolls(s)
        elif t.dead:
            P.heave_turn(self, s)       # the rounds run on under a corpse while a comrade lies Pinned (8-9)
            self.death_rolls(s)
        else:
            P.take_turn(self, s)
            self.death_rolls(s)
        s.card_passed = True
        s.quiet = False
        s.flight_zone = None
        if ban_started and s.ban > 0:
            s.ban -= 1

    # ------------------------------------------------------------------ the wings step, the deal, the swap step
    def wings_step(self):
        P.wings_step(self)          # Fall Back is taken at the wings step (squad-tactics.yaml)
        if not self.cfg.get("wings"):
            return
        status = {s.name: (s.dead, s.down, s.grabbed, s.left) for s in self.sold}
        changed = self.wing_status is None or any(
            any(now and not was for now, was in zip(status[n], self.wing_status.get(n, (False, False, False, False))))
            for n in status)
        orphan = any(s.wing_of is not None and s.wing_of.dead for s in self.alive())
        self.wing_status = status
        if not (changed or orphan):
            return
        before = {s.name: s.wing_of for s in self.sold}
        for s in self.sold:
            s.wing_of = None
        self.wing = {}
        for sm, pc in P.assign_wings(self):
            on_wing = sum(1 for x in self.sold if x.wing_of is pc)
            if sm.pc or not pc.pc or sm.dead or pc.dead or sm.wing_of is not None or on_wing >= R.wing_max:
                raise ValueError("policy.assign_wings made an assignment round.yaml (wings) does not allow")
            sm.wing_of = pc
            self.wing[pc.name] = sm
        if any(before[s.name] is not s.wing_of for s in self.sold):
            self.stats["wing_changes"] += 1

    def events(self):
        ev = [(self.card[s.name], s) for s in self.alive() if s.name in self.card] + [(c, None) for c in self.tcards]
        ev.sort(key=lambda x: x[0])
        return ev

    def deal(self, rnd):
        t = self.t
        alive = self.alive()
        holders = [s for s in alive if s.wing_of is None or s.wing_of.dead]
        lo, hi = R.cards
        cards = self.rng.sample(range(lo, hi + 1), len(holders) + t.tempo)
        self.card = {s.name: cards[i] for i, s in enumerate(holders)}
        for s in alive:
            if s.name not in self.card:
                self.card[s.name] = self.card[s.wing_of.name] + 0.5   # round.yaml, wings, on_a_wing
        self.tcards = sorted(cards[len(holders):])
        for s in alive:
            s.cur_move = rnd in s.pre_turn
            s.cur_action = rnd in s.pre_turn or rnd in s.pre_action
            s.acted_first, s.lifted_first = None, False
            s.card_passed = False
            s.dodge_succ = None
            s.odm_used = s.odm_pushed = s.odm_moved = False
            s.gas_rolled = False
            s.start_pos = s.pos
        return self.events()

    def swap_step(self, events):
        """round.yaml, swapping: two card holders, neither Down nor Grabbed, in the same zone or adjacent ones (16-11),
        each in at most one swap a round; a Titan's card and a Squadmate on a Wing are never swapped."""
        if not self.cfg.get("swaps"):
            return events
        used, done, namers = set(), False, set()
        for a, b in P.swaps(self):
            if (a.name in used or b.name in used or a is b or a.dead or b.dead or a.left or b.left or a.down or b.down or a.grabbed
                    or b.grabbed or a.wing_of is not None or b.wing_of is not None
                    or (self.zones_apart(a, b) > 1 and not self.change_order(a, b, namers))):
                continue
            self.card[a.name], self.card[b.name] = self.card[b.name], self.card[a.name]
            used |= {a.name, b.name}
            self.stats["swaps"] += 1
            done = True
        if not done:
            return events
        for s in self.alive():
            if s.wing_of is not None and not s.wing_of.dead:
                self.card[s.name] = self.card[s.wing_of.name] + 0.5
        return self.events()

    # ------------------------------------------------------------------ the round
    def counters(self):
        st = self.stats
        return (st["tracker_writes"], st["ladder_evals"], COUNT["pools"], st["dodges"], st["fear_rolls"], st["gas_rolls"])

    def play_round(self, rnd, events=None, after=None):
        before = self.counters()
        self.grab_this_round = False
        go = self._play_round(rnd, events, after)
        if self.grab_this_round:
            now = self.counters()
            st = self.stats
            st["grab_rounds"] += 1
            for key, a, b in zip(("grab_round_writes", "grab_round_evals", "grab_round_pools", "grab_round_dodges",
                                  "grab_round_fears", "grab_round_gas"), now, before):
                st[key] += a - b
        return go

    def _play_round(self, rnd, events, after):
        t = self.t
        self.rnd = rnd
        self.stats["rounds"] = rnd
        if self.retreat:
            self.stats["retreat_rounds"] += 1
        if not self.stay_limit_fired and self.fallen_options_closed() and self.pinned_present():
            self.stay_limit_fired = True        # decision batch 8, 8-32: the limit ended a stay beside a Pinned comrade
            self.stats["stay_limit_ended"] += 1
        if events is None:
            self.wings_step()
            events = self.deal(rnd)
            self.stats["tracker_writes"] += 1       # after the deal
            events = self.swap_step(events)
            P.round_dealt(self)
        for c, who in events:
            if after is not None and c <= after:
                continue
            if who is None:
                self.titan_card()
            elif not who.dead:
                self.soldier_turn(who)
            self.momentum_sweep()
            P.after_event(self)
            if t.dead and self.stats["kill_round"] is None:
                self.stats["kill_round"] = rnd
            if self.ended() or self.stop:
                break
        if self.ended() and not self.stop:
            # round.yaml, end_steps, gas-rolls; odm-gear.yaml, gas_roll, when: a Titan Engagement that a rule ends
            # partway through a round makes that round's Gas Rolls at once, before engagement-end.yaml's steps. A
            # measurement that stops the fight (self.stop) is not the end of a Titan Engagement.
            self.gas_rolls("gas_rolls_at_end")
        if self.ended() or self.stop:
            return False
        self.end_steps()
        return not self.stop

    def gas_roll(self, s, counter=None):
        """odm-gear.yaml, gas_roll: two dice, three after a Pushed roll with ODM Gear, two for a Squadmate; each 1
        lowers the Gas Rating by 1. Once a round for each soldier who used ODM Gear."""
        dice = R.gas_roll_dice(s.pc, s.odm_pushed)
        self.stats["gas_rolls"] += 1
        if counter:
            self.stats[counter] += 1
        s.gas_rolled = True
        s.gas = max(0, s.gas - sum(1 for _ in range(dice) if self.rng.randint(1, 6) == 1))

    def gas_rolls(self, counter=None):
        for s in self.alive():
            if s.odm_used and not s.gas_rolled:
                self.gas_roll(s, counter)

    def end_steps(self):
        t = self.t
        self.gas_rolls()
        was_grounded = t.grounded()
        if not t.dead:          # a corpse has no clock (decision batch 8, 8-9)
            t.regen += 1
        if not t.dead and t.regen >= t.regen_len:
            t.openings = []
            for p in t.part_ids:
                t.count[p] = 0
            cand = [p for p in t.part_ids if t.state[p] == R.broken] or [p for p in t.part_ids if t.state[p] > 0]
            if cand:
                worst = max(t.state[p] for p in cand)
                p = next(p for p in cand if t.state[p] == worst)
                t.state[p] -= 1
                self.steam(STEAM_AT_REGEN, "steam_regen")     # decision batch 8, 8-7: a fill that recovers a Body Part
            t.regen = 0
        # round.yaml, end_steps, frenzy (decision batch 13, 13-10): every living Focus Titan's Frenzy rises by 1 to
        # its cap, during a retreat as well, and never touches a Next Behavior already rolled. It raises only a Titan
        # that is a Focus Titan when the step runs (round 3 review 1, C2), which this model cannot distinguish because
        # it has no Background Titans: the one Focus Titan is present from the start. It rises only at the end of a
        # round that is a multiple of the rate, every even-numbered round at rate 2 (round 3 retune, R1).
        if not t.dead and t.frenzy < R.frenzy_cap and self.rnd % R.frenzy_rate == 0:
            t.frenzy += 1
        if was_grounded and not t.grounded():
            self.free_pinned()      # decision batch 8, 8-9: a living Titan that stops being grounded frees its Pinned
            t.heave_count = 0       # decision batch 8, 8-22: and its heave count clears
        if was_grounded and not t.grounded() and self.t_rating() == R.grounded_extra_rating:
            a, b = R.grounded_end_move
            for s in self.present():
                if s.pos == a and not s.grabbed:
                    s.pos = b
        # background-clocks (round.yaml, end_steps; background-titans.yaml, ticks, retreat-clock): this model has no
        # Background Titans, so only the retreat clock fills, 1 segment a round; none fills during a retreat
        if self.clock is not None and not self.retreat and self.rnd >= self.clock:
            self.retreat = True
            self.retreat_began = self.rnd
            self.stats["retreats"] += 1
        # round-ends (anchor-ratings.yaml, momentum, lost): a soldier who made no ODM move this round loses all Momentum
        for s in self.sold:
            if s.momentum and not s.odm_moved:
                self.stats["momentum_lost"] += s.momentum
                s.momentum = 0
        self.stats["tracker_writes"] += 1       # at the end steps
        P.end_of_round(self)

    def run(self):
        self.begin()
        for rnd in range(1, self.max_rounds + 1):
            if not self.play_round(rnd):
                break
        else:
            self.capped = True
        return self.finish()

    # ------------------------------------------------------------------ the end of a Titan Engagement
    def finish(self):
        """How a fight ends (engagement-flow.yaml, ending).
        - A kill or no-soldier-standing ends the Titan Engagement; that round's Gas Rolls were made in _play_round.
          When no soldier stands (under a retreat, when no standing soldier holds a Position), every soldier who
          still holds a Position dies, left behind with no witnesses (left_behind); soldiers who have left live on.
          No soldier leaves outside a retreat in this model, so no returner ever exists and the test ends the Titan
          Engagement at once (no_soldier_standing, no-returner).
        - A measurement that stops the fight (self.stop: the lone cut, a Grab cell) or a case's max_rounds (the
          full-fight Jam test) is not the end of a Titan Engagement, and no end step runs.
        - SAFETY_CAP: a fight still going then is counted (stats["cap"]) and runs no end step. None should."""
        t = self.t
        self.stats["pools"] = COUNT["pools"] - self.pools0
        capped = self.capped and not self.stop
        if capped and not self.measure_cap:
            self.stats["cap"] += 1
        if not self.standing() and not self.stop:
            # decision batch 8, 8-21: every Pinned soldier dies, left under the body, whether or not a Focus Titan lives;
            # every other soldier who holds a Position dies only while one is alive
            for s in self.present():
                if s.pinned or not t.dead:
                    self.stats["left_behind"] += 1
                    self.stats["pinned_left"] += 1 if s.pinned else 0
                    self.stats["stay_limit_pinned_died"] += 1 if (s.pinned and self.stay_limit_fired) else 0
                    self.kill(s, witnessed=False)
        for s in self.alive():
            self.stats["lethal_at_end"] += sum(1 for c in s.untreated() if c["row"]["lethal"] and c["limit"] in ("turn", "engagement"))
        if self.stop or capped:
            return self.stats
        self.end_engagement()
        return self.stats

    def aftermath_cis(self, s):
        return [c for c in s.untreated() if c["row"]["lethal"] and c["limit"] == "engagement"]

    def end_engagement(self):
        st = self.stats
        rng = self.aux
        in_scope = list(self.sold)
        alive = [s for s in in_scope if not s.dead]
        # turns
        for s in in_scope:
            s.pre_turn.clear()
            s.pre_action.clear()
            s.ban = 0
            s.forced_move, s.forced_strike = None, False     # a pending Fear result ends here (decision batch 7, 7-8)
            s.pinned = None
        # stress-relief
        for s in alive:
            s.stress = max(s.min_stress, s.stress - R.relief_end)
        # lasting-stress-responses
        for s in alive:
            s.lasting.clear()
        # turn-limits
        for s in alive:
            for c in s.untreated():
                if c["row"]["lethal"] and c["limit"] == "turn":
                    c["limit"] = "engagement"
        # aftermath-rolls
        patients = [s for s in alive if self.aftermath_cis(s)]
        st["aftermath_patients"] += len(patients)
        treaters_used = set()
        for p, tr in P.aftermath_treaters(self, patients):
            if tr is None:
                st["aftermath_none"] += 1
                continue
            if (tr.name in treaters_used or tr.dead or tr.down
                    or (tr is not p and self.apart(tr, p) > 1)):
                raise ValueError("policy.aftermath_treaters chose a treater treat-injury.yaml (aftermath_rolls) does not allow")
            treaters_used.add(tr.name)
            ci = P.aftermath_ci(self, p)
            st["aftermath_rolls"] += 1
            if tr is p:
                st["aftermath_self"] += 1
            if self.treat(tr, p, "treat", ci, rng=rng, in_fight=False):
                st["aftermath_saves"] += 1
        # death-rolls: no Fear Roll at this step (fear-rolls.yaml, limits, after_engagement_end)
        died = 0
        for s in alive:
            for c in self.aftermath_cis(s):
                if s.dead:
                    break
                st["end_death_rolls"] += 1
                if death_roll(rng, s, c) == "dies":
                    s.dead = True
                    s.airborne = s.mounted = False
                    died += 1
                    st["end_deaths"] += 1
                    if s.pc:
                        st["pc_end_deaths"] += 1
                else:
                    c["limit"] = R.limit_after_outside_roll
        alive = [s for s in alive if not s.dead]
        for s in alive:
            if s.has_scar("survivors-guilt"):
                s.stress += died * R.scar_rows["survivors-guilt"]["stress"]
        # care-window
        P.care_window(self, alive)
        self.give_scars(alive)
        # grief: the deaths of one Titan Engagement give 1 Grief in total, Numb 1 more for each death
        deaths = st["deaths"] + st["end_deaths"]
        if deaths:
            for s in alive:
                gain = R.grief_per_engagement + (R.grief_numb * deaths if s.has_scar("numb") else 0)
                s.grief = min(R.grief_max, s.grief + gain)     # grief.yaml, maximum: Grief beyond it is lost
        # retirement-and-promotion: marked here; the sequence family replaces the soldiers
        st["retiring"] += sum(1 for s in alive if s.retiring)
        st["untreated_after"] += sum(len(s.untreated()) for s in alive)
        st["lethal_day_after"] += sum(1 for s in alive for c in s.untreated()
                                      if c["row"]["lethal"] and c["limit"] == R.limit_after_outside_roll)

    def give_scars(self, soldiers):
        """scars.yaml, gaining, survived-lethal-injury: a lethal Critical Injury stabilized while the soldier lives, by
        Treat Injury or by a Death Roll that slows a day limit, gives a Scar once."""
        for s in soldiers:
            for c in s.cis:
                if c["scar_due"] and not s.dead:
                    c["scar_due"] = False
                    if gain_scar(self.aux, s):
                        self.stats["scars_gained"] += 1

    def day_passes(self):
        """healing.yaml, each_day, in order, for every soldier in self.sold (the Squad), outside a Titan Engagement: the
        interim day of decision batch 5 (5-2, OQ-120; day_passes, interim). 1. A day care window
        (treat-injury.yaml, care_windows, day) over every soldier in the Squad, with Field Repair allowed, as on an
        Expedition day (decision batch 5b, 5-16; field-repair.yaml, outside_titan_engagement). 2. Every lethal Critical Injury with a day limit
        runs out and causes a Death Roll; one that fights back is stabilized (death-rolls.yaml, outcomes) and gives
        its Scar. 3. Every living soldier gets back all Health lost to damage. 4. Every held Critical Injury's
        healing time drops by 1 day and one at 0 heals; a lethal one not yet stabilized stays at 1 day. The day
        changes no Stress and no Grief of its own; the deaths of the day give Grief as grief.yaml states (1 in total
        to every other living soldier in the Squad, Numb 1 more for each death)."""
        st = self.stats
        rng = self.aux
        squad = [s for s in self.sold if not s.dead]
        P.care_window(self, squad)
        self.give_scars(squad)
        died = 0
        for s in squad:
            for c in [c for c in s.untreated() if c["row"]["lethal"] and c["limit"] == "day"]:
                if s.dead:
                    break
                st["day_death_rolls"] += 1
                out = death_roll(rng, s, c, context=("day-limit-death-roll",))    # Will to Live's reading
                if out == "dies":
                    s.dead = True
                    s.down = False
                    died += 1
                    st["day_deaths"] += 1
                    if s.pc:
                        st["pc_day_deaths"] += 1
                elif out == "fights-back":
                    c["limit"] = None            # death-rolls.yaml, time_limits, day, slows_to: stabilized
                    c["scar_due"] = True
        alive = [s for s in squad if not s.dead]
        self.give_scars(alive)
        for s in alive:
            st["day_health_restored"] += s.health_lost
            s.health_lost = 0
            s.try_end_down()
        for s in alive:
            for c in s.held():
                if c["days"] is None:
                    continue
                if not c["treated"] and c["row"].get("heals_untreated") is False:
                    continue        # decision batch 8, 8-15: an untreated Pierce does not heal
                if c["row"]["lethal"] and not c["treated"] and c["limit"] is not None:
                    c["days"] = max(R.lethal_heal_floor, c["days"] - 1)     # not stabilized: cannot heal
                    continue
                c["days"] -= 1
                if c["days"] <= 0:
                    c["healed"] = True
                    st["healed"] += 1
            s.try_end_down()
        if died:
            for s in alive:
                gain = R.grief_per_engagement + (R.grief_numb * died if s.has_scar("numb") else 0)
                s.grief = min(R.grief_max, s.grief + gain)
        return died

    def care_roll(self, roller, patient, use, ci, helpers=(), cover=None, units=0):
        """treat-injury.yaml, care_windows: one roll, Helped by soldiers who spend their window roll, Covered by any
        who qualify, with medical supplies' Bonus Dice (squad-supply.yaml, medical_uses, care-bonus)."""
        units = min(units, self.supply["medical"])
        if ci is not None and ci["row"].get("treat_needs_kit") and not (roller.kit and roller.kit > 0) and not units:
            return False    # decision batch 8, 8-8: no roll on a Burn without a medical kit or medical supplies
        self.supply["medical"] -= units
        st = self.stats
        st["care_rolls"] += 1
        st["care_helps"] += len(helpers)
        st["care_supplies"] += units
        ok = self.treat(roller, patient, use, ci, bonus=R.medical_supply_dice * units, helpers=helpers, cover=cover,
                        rng=self.aux, in_fight=False, supplies=units, window=True)
        if ok:
            st["care_saves"] += 1
        return ok

    def care_repair(self, roller, target):
        """field-repair.yaml, outside_titan_engagement: one Field Repair roll a soldier in the window."""
        if self.field_repair(roller, target, rng=self.aux, in_fight=False):
            self.stats["care_repairs"] += 1
