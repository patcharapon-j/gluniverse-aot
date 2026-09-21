"""Dice, soldiers, and the harm procedures of Chapters 1, 3, and 4, with every table read through rules.R.

- Pool (dice-pool.yaml): attribute + one dice Talent + Bonus Dice (capped) - penalties (base dice at least
  the minimum, applied after the cap) + Gear Dice (one item's current rating) + Stress Dice (current Stress).
- Push: only if no Stress Die shows 1 and the soldier may Push (a player character, not Down). +1 Stress and
  one new Stress Die (Covered: the Coverer takes the Stress, no die is added); push-stress results add
  their Stress either way. Base and Stress Dice not showing a success are re-rolled; Gear Dice never are.
- Finishing: at most one Stress Response (a Stress Die showing 1 after any Push), which may change the
  successes; Gear Dice showing 1 on a Pushed roll are wear.
- Critical Injuries (treated or not), Health boxes, Down, falls, Fear Rolls with their Scar totals, gaining a
  Scar on the D66 table (scars.yaml), and Death Rolls, as their YAML rows give them.
"""
from rules import R, covers, RIDER_PER_NET, GRAB_LANDS_ON

SF = R.success_face

# Round-time counter (data/engagement/round.yaml, round_time): every dice pool rolled, attribute rolls and
# Death Rolls. engine.Fight reads the difference over a fight.
COUNT = {"pools": 0}

# Scar rows whose trigger is a roll for these entries (scars.yaml, reckless-blade).
RECKLESS_ENTRIES = ("nape-strike", "body-part-strike")


class Roll:
    __slots__ = ("succ", "pushed", "gear_ones", "spend_turns", "covered")

    def __init__(self, succ, pushed, gear_ones, spend_turns, covered=None):
        self.succ, self.pushed, self.gear_ones, self.spend_turns = succ, pushed, gear_ones, spend_turns
        self.covered = covered


class Soldier:
    def __init__(self, name, attributes, health, resolve_base, talents, stress, min_stress=0, scars=0,
                 odm=None, horse=None, blade=None, spares=None, blades=None, pc=True, grief=0, kit=None,
                 rule_talents=(), specialty=None, talent_gear=None):
        self.name = name
        self.attr = dict(attributes)
        self.health = health
        self.resolve_base = resolve_base
        self.scars = scars
        self.scar_rows = set()     # rows of the Scar table held; a build's Scars name none (see the report)
        self.grief = grief
        self.talents = dict(talents)
        # entry -> the gear item a roll on it must use for the Talent's dice to add (talents.yaml, condition)
        self.talent_gear = dict(talent_gear or {})
        self.left = False           # left the Titan Engagement (positions.yaml, leaving)
        self.rule_talents = set(rule_talents)
        self.specialty = specialty
        self.min_stress = max(min_stress, scars * R.min_stress_per_scar)
        self.stress = max(stress, self.min_stress)
        self.horse_gone = False     # a soldier who sits a fight out never passes through Fight.add
        self.odm_max = R.issue["odm_gear_rating"] if odm is None else odm
        self.odm = self.odm_max
        self.gas = R.full_gas
        self.spares = R.issue["spare_canisters"] if spares is None else spares
        self.blade = R.issue["blade_set_rating"] if blade is None else blade
        self.blades = R.issue["blade_sets"] if blades is None else blades
        self.handles = self.blades > 0
        self.horse_max = R.issue["horse_rating"] if horse is None else horse
        self.horse = self.horse_max
        self.kit_max = kit          # medical kit rating, or None when the soldier holds none
        self.kit = kit
        self.pc = pc
        self.lasting = set()
        self.next_pen = 0
        # a Fear row's pending forced move ("distant" or "comrade") and forced strike (decision batch 7, 7-8); both
        # end with the Titan Engagement (engine.Fight.add and end_engagement)
        self.forced_move = None
        self.forced_strike = False
        # Pinned under a falling Titan (decision batch 8, 8-9): dict(body, loc, side, since) or None
        self.pinned = None
        # Talents of the sensitivity rows (decision batch 7, 7-2): conditional dice Talents as (entry, level, reading),
        # rule Talents used this Titan Engagement, and the comrade a Got Your Back soldier first Covered
        self.cond_talents = []
        self.talent_used = set()
        self.covered_comrade = None
        # dicts: row, limit, gained (turn count when gained), treated, scar_due, days (healing time left), healed
        self.cis = []
        self.gained_perm = set()
        self.health_lost = 0
        self.down = False
        self.dead = False
        self.retiring = False
        self.carrying = None
        self.carried_by = None
        # the field (ADR-0029; decision batch 16): the zone (None off field) and the attachment (kind, body label) a
        # Titan Engagement gives the soldier (engine.Fight.add), and the Fight whose Focus Titan a Position is read
        # relative to. Outside a Fight a Position is stored as written.
        self.fight = None
        self.zone = None
        self.attach = ("ground", None)
        self.momentum = 0
        self._pos = None

    # ------------------------------------------------------------------ derived values
    @property
    def pos(self):
        """The soldier's Position relative to the Focus Titan, derived from zone and attachment (zones.yaml,
        derivation; decision batch 16, 16-9), never recorded. A write goes through engine.Fight.place_at, which sets the
        zone and attachment the Position means."""
        f = self.fight
        return self._pos if f is None else f.position(self)

    @pos.setter
    def pos(self, p):
        f = self.fight
        if f is None:
            self._pos = p
        else:
            f.place_at(self, p)

    @property
    def resolve(self):
        return self.resolve_base + self.scars - min(self.grief, R.grief_max)

    def a(self, attribute):
        return self.attr[attribute]

    def can_push(self):
        return self.pc and not self.down

    def penalty(self, entry):
        p = 0
        for c in self.cis:
            # healing.yaml, healing_time, heals: a healed injury's effects end; its permanent effects stay
            p += c["row"]["pen_perm" if c.get("healed") else "pen"].get(entry, 0)
        for rid in self.lasting:
            p += R.sr_by_id[rid]["pen"].get(entry, 0)
        for rid in self.scar_rows:
            p += R.scar_rows[rid]["pen"].get(entry, 0)
        return p

    def push_stress(self):
        return sum(R.sr_by_id[rid]["push_stress"] for rid in self.lasting)

    def odm_working(self):
        return self.odm > 0 and self.gas > 0

    def gear_dice(self, item):
        if item == "odm":
            return self.odm if self.odm_working() else 0
        if item == "blade":
            return self.blade if self.handles else 0
        if item == "horse":
            return self.horse
        if item == "kit":
            return self.kit or 0
        return 0

    def untreated(self):
        return [c for c in self.cis if not c["treated"] and not c.get("healed")]

    def held(self):
        """Critical Injuries still held: every one not healed (healing.yaml, healing_time, heals)."""
        return [c for c in self.cis if not c.get("healed")]

    def current_health(self):
        """health.yaml: each untreated Critical Injury crosses off a box, to at most Health; damage marks the rest."""
        crossed = min(len(self.untreated()), self.health)
        return max(0, self.health - crossed - self.health_lost)

    def check_down(self):
        if self.current_health() == 0 or any(c["row"]["down"] for c in self.untreated()):
            self.down = True

    def try_end_down(self):
        """down.yaml: Down ends once current Health is above 0 and no untreated down row holds the soldier."""
        if self.down and not self.dead and self.current_health() > 0 and not any(c["row"]["down"] for c in self.untreated()):
            self.down = False
            return True
        return False

    def has_scar(self, rid):
        return rid in self.scar_rows


# ---------------------------------------------------------------------- builds
BUILD_ALIASES = {"levi": "levi_grade"}


def use_talent(s, tid, consume=True):
    """A rule Talent the soldier holds that its limit still allows (talents.yaml, limit): a once_per_titan_engagement
    Talent is marked used for the rest of the Titan Engagement (engine.Fight.add clears the marks)."""
    if tid not in s.rule_talents:
        return False
    if R.talent_limits.get(tid) == "once_per_titan_engagement":
        if tid in s.talent_used:
            return False
        if consume:
            s.talent_used.add(tid)
    return True


def give_talent(soldiers, tid, level=None):
    """A sensitivity row's Talent (decision batch 7, 7-2), at the reference Rookie's Talent level for a dice Talent: an
    unconditional dice Talent adds to its entries, a conditional one adds only while its reading is met (roll,
    context), and a rule Talent joins rule_talents."""
    if not tid:
        return
    level = level or R.builds["rookie"]["talent"]
    for s in soldiers:
        if tid in R.talent_names:
            for e in R.talent_names[tid]:
                kind = R.talent_conditions.get(tid, {}).get(e)
                if kind:
                    s.cond_talents.append((e, level, kind))
                elif tid in R.talent_gear:
                    raise ValueError(f"give_talent: {tid} has a gear condition the rows do not give")
                else:
                    # the build's Talent on an entry is the Talent that names it, so the row's level replaces it
                    s.talents[e] = max(s.talents.get(e, 0), level)
        elif tid in R.talent_limits:
            s.rule_talents.add(tid)
        else:
            raise ValueError(f"give_talent: {tid} is not a Talent in talents.yaml")


def make_build(build, name, pc=True, stress=None, **over):
    """A reference build (data/engagement/tuning.yaml, builds): Talent dice at the build's level on each entry
    talent_dice_on names; items at the build's ratings, spares and Blade Sets from Standard Issue. A reference
    build holds the items Standard Issue gives it, so no medical kit unless a case gives one (kit=rating)."""
    b = R.builds[BUILD_ALIASES.get(build, build)]
    kw = dict(attributes=b["attributes"], health=b["health"], resolve_base=b["resolve_total"] - b["scars"],
              talents={e: b["talent"] for e in R.talent_dice_on}, stress=b["stress"] if stress is None else stress,
              min_stress=b["min_stress"], scars=b["scars"], odm=b["odm"], horse=b["horse"], blade=b["blade"], pc=pc)
    kw.update(over)
    return Soldier(name, **kw)


def make_free_build(name, measured, pc=True, stress=None, spec=None, **over):
    """A soldier of the Free Build Squad (decision batch 7, 7-1; data/character/attributes.yaml, creation, built,
    free_build, reported_squad): attributes, Health, and Resolve as written; Talent 2 on the entry the soldier's
    measured roll names and Talent 1 on the other three; no Talent dice on any other roll. READING: items, Stress
    when a fight begins, and Scars as the reference Rookie's (the Funding 3 Standard Issue; the Slayer's Specialty
    has no by_specialty item)."""
    fb = spec or R.free_build      # R.free_build_h2 for the Health 2 row (decision batch 8, 8-3)
    if measured not in fb["talent_entries"]:
        raise ValueError(f"make_free_build: {measured} is not one of the reported Squad's Talent entries")
    rk = R.builds["rookie"]
    item = R.specialty_items.get(fb["specialty"])     # standard-issue.yaml, by_specialty: a Medic's medical kit
    kw = dict(attributes=fb["attributes"], health=fb["health"], resolve_base=fb["resolve"],
              talents={e: 2 if e == measured else 1 for e in fb["talent_entries"]},
              stress=rk["stress"] if stress is None else stress, min_stress=rk["min_stress"], scars=rk["scars"],
              odm=rk["odm"], horse=rk["horse"], blade=rk["blade"], pc=pc, specialty=fb["specialty"],
              kit=item[1] if item and item[0] == "medical-kit" else None)
    kw.update(over)
    return Soldier(name, **kw)


def make_template(tid, name, pc=True, stress=1, **over):
    """A Squadmate template (data/character/squadmates.yaml) with Standard Issue, including its Specialty's item
    (standard-issue.yaml, by_specialty); its one dice Talent adds to the entries data/character/talents.yaml
    names for it."""
    t = R.templates[tid]
    if R.talent_conditions.get(t["talent"]["id"]):
        raise ValueError(f"make_template: {tid}'s Talent {t['talent']['id']} carries a condition "
                         f"({R.talent_conditions[t['talent']['id']]}) no soldier applies yet")
    tal = {e: t["talent"]["level"] for e in R.talent_names.get(t["talent"]["id"], [])}
    item = R.specialty_items.get(tid)
    kw = dict(attributes=t["attributes"], health=t["health"], resolve_base=t["resolve"], talents=tal,
              stress=stress, pc=pc, specialty=tid, kit=item[1] if item and item[0] == "medical-kit" else None,
              talent_gear=R.talent_gear.get(t["talent"]["id"], {}))
    kw.update(over)
    return Soldier(name, **kw)


# ---------------------------------------------------------------------- rolls
def stress_response(rng, s):
    """Returns (lose, zero, spend_turns)."""
    total = rng.randint(1, 6) + s.stress - s.resolve
    i = R.sr_index(total)
    # talents.yaml, gallows-humour: roll the D6 again and use the second total. POLICY CHOICE: when the first total
    # finds a row in the upper half of the table
    if i >= len(R.sr_rows) // 2 and use_talent(s, "gallows-humour"):
        total = rng.randint(1, 6) + s.stress - s.resolve
        i = R.sr_index(total)
    rows = R.sr_rows
    while rows[i]["lasting"] and rows[i]["id"] in s.lasting and i < len(rows) - 1:
        i += 1
    row = rows[i]
    if row["lasting"]:
        s.lasting.add(row["id"])
        return 0, False, 0
    s.stress += row["stress"]
    return row["lose"], row["zero"], row["spend_turns"]


def roll(rng, s, entry, bonus=0, gear=None, push_to=1, cover=None, extra_pen=0, allow_push=True,
         attribute=None, talent=None, responses=True, context=()):
    """One attribute roll. attribute defaults to the Catalog entry's; talent to the soldier's dice Talent on
    the entry. cover: the Covering soldier, who takes the Push's Stress, or True for a Coverer the family does
    not track (the Jam test's Covered columns). responses False leaves out Stress Responses, for the figures
    tuning.yaml reports without them."""
    COUNT["pools"] += 1
    attr = s.a(attribute or R.entry_attribute[entry])
    tal = s.talents.get(entry, 0) if talent is None else talent
    if talent is None and tal and s.talent_gear.get(entry) not in (None, gear):
        tal = 0      # talents.yaml, condition: Horsemanship adds to a dodge only with the horse's Gear Dice (OQ-121)
    if talent is None and s.cond_talents:
        # a conditional dice Talent adds while its reading is met: context from the caller, mounted from the soldier
        met = set(context) | ({"mounted"} if s.mounted else set())
        tal += sum(lvl for e, lvl, kind in s.cond_talents if e == entry and kind in met)
    pen = s.penalty(entry) + extra_pen
    if s.next_pen:
        pen += s.next_pen
        s.next_pen = 0
    base = max(R.min_base_dice, attr + tal + min(bonus, R.bonus_cap) - pen)
    ri = rng.randint
    bd = [ri(1, 6) for _ in range(base)]
    gd = [ri(1, 6) for _ in range(s.gear_dice(gear))] if gear else []
    sd = [ri(1, 6) for _ in range(s.stress)]
    succ = bd.count(SF) + gd.count(SF) + sd.count(SF)
    pushed = False
    covered = None
    sr = responses and 1 in sd
    if entry in RECKLESS_ENTRIES and s.has_scar("reckless-blade"):
        allow_push = True      # scars.yaml, reckless-blade: must Push when short and allowed to
    if allow_push and not (1 in sd) and succ < push_to and s.can_push():
        pushed = True
        extra = s.push_stress()
        if cover:
            covered = cover
            if cover is not True:
                cover.stress += R.cover_stress
                if cover.has_scar("carrying-their-weight"):
                    cover.stress += R.scar_rows["carrying-their-weight"]["stress"]
        else:
            s.stress += 1
            sd.append(0)
        s.stress += extra
        bd = [x if x == SF else ri(1, 6) for x in bd]
        sd = [x if x == SF else ri(1, 6) for x in sd]
        # A Gear Die showing 2 to 5 is re-rolled; a 1 is locked and a 6 is kept
        # (data/core/dice-pool.yaml, die_types, gear; decision batch 11, OQ-187).
        gd = [x if x in (1, SF) else ri(1, 6) for x in gd]
        succ = bd.count(SF) + gd.count(SF) + sd.count(SF)
        sr = responses and 1 in sd
    spend = 0
    if sr:
        lose, zero, spend = stress_response(rng, s)
        succ = 0 if zero else max(0, succ - lose)
    # Wear is 1 point per Pushed roll, however many Gear Dice show 1
    # (data/gear/items.yaml, rating_rules, wear; decision batch 11, OQ-187).
    return Roll(succ, pushed, 1 if pushed and 1 in gd else 0, spend, covered)


# ---------------------------------------------------------------------- harm
def titan_roll(rng, dice):
    """ADR-0019 (decision batch 8, 8-1): a Titan's Attack Dice as Titan Dice, each succeeding on R.titan_face or
    higher; no Push, no other dice. Returns the successes, the card's Severity."""
    if not dice:
        return 0
    COUNT["pools"] += 1
    return sum(1 for _ in range(dice) if rng.randint(1, 6) >= R.titan_face)


# The Titan attack's reading (ADR-0019), shared by engine.py, families.py, and the Chapter 6 probes
# (tools/probes/chapter-05/core.py, sim_dice), so the probes and the simulator cannot read it differently.
def attack_net(tsucc, dodge_succ=None):
    """Decision batch 8, 8-1: the net successes a Titan's roll lands on one target. 0 successes whiff, and no dodge
    is rolled against them; otherwise each dodge success cancels one (this card's dodge, or the target's one Reaction
    against this Titan this round, OQ-14), and a target with no dodge cancels nothing. The attack lands on 1 or more."""
    if tsucc < 1:
        return 0
    return tsucc - (dodge_succ or 0)


def ci_rider(net):
    """Decision batch 8, 8-2: a landed attack's critical-injury effect adds RIDER_PER_NET to the Critical Injury roll
    per net success beyond the first."""
    return RIDER_PER_NET * (net - 1)


def grab_net_lands(net):
    """grab.yaml, grab_lands, lands_on: the Grab lands on this many net successes, with no rider."""
    return net >= GRAB_LANDS_ON


def first_answered(rolls):
    """The Jam test's reading (decision batch 8, 8-1): the holder's one dodge against a Titan in a round answers its
    first card with 1 or more successes; None when every card whiffs."""
    return next((x for x in rolls if x >= 1), None)


def gain_ci(rng, s, loc=None, cannot_be_lethal=False, gained=0, *, injury_type, side=None, rider=0, plain=False):
    """data/harm/critical-injuries.yaml, gaining, with decision batch 7, 7-4 and 7-5 (ADR-0017). injury_type is the
    Injury Type the inflicting rule names; it picks the rows that type reads, its table's rider applied (the Bite
    rider). A rolled Injury Location carries its side; an arm or leg a rule names without a side takes one from a D6,
    odd left and even right. Returns the row, or "dead"."""
    if injury_type not in R.injury_types:
        raise ValueError(f"gain_ci: {injury_type!r} is not an Injury Type (decision batch 7, 7-5)")
    if loc is None:
        r = rng.randint(1, 6)
        loc, side = next((l, sd) for res, l, sd in R.ci_location_rows if covers(res, r))
    elif loc in R.ci_sided:
        if side is None:
            side = R.side_by_parity[rng.randint(1, 6) % 2]
    elif side is not None:
        raise ValueError(f"gain_ci: a {loc} Critical Injury has no side (critical-injuries.yaml, injury_location_table)")
    # plain: the table's rows without any type rider, for a "without the riders" comparison row (decision batch 8, 8-15)
    table = R.ci_tables[loc] if plain else R.ci_tables[loc]["by_type"][injury_type]
    # critical-injuries.yaml, worsening: held injuries at the location and side, and healed ones with permanent effects
    held = sum(1 for c in s.cis if c["row"]["loc"] == loc and c["side"] == side
               and (not c.get("healed") or c["row"]["perm"]))
    # rider: decision batch 8, 8-2, +1 per net success beyond the first on a landed Titan attack's critical-injury
    # effect; the cannot_be_lethal cap and the instant-death rows below still apply
    total = rng.randint(1, 6) + rng.randint(1, 6) + R.ci_per_held * held + rider
    row = next(rw for rw in table["rows"] if covers(rw["results"], total))
    # held_injuries, sides: a row with permanent effects is gained at most once per side; a repeat uses its repeat_row
    if row["perm"] and (row["id"], side) in s.gained_perm:
        row = table["by_id"][row["repeat"]]
    if cannot_be_lethal and (row["lethal"] or row["instant_death"]):
        row = table["by_id"][R.ci_tables[loc]["cap"]]
    if row["instant_death"]:
        s.dead = True
        return "dead"
    if row["perm"]:
        s.gained_perm.add((row["id"], side))
    untreated = len(s.untreated())
    crossed_before = min(untreated, s.health)
    clean = s.health - crossed_before - s.health_lost
    s.cis.append({"row": row, "limit": row["limit"], "gained": gained, "treated": False, "scar_due": False,
                  "days": row["heal_days"], "healed": False, "side": side, "type": injury_type})
    if clean <= 0 and crossed_before < s.health and s.health_lost > 0:
        s.health_lost -= 1
    s.stress += row["stress"]
    s.check_down()
    return row


def fall_damage(rng, s, band, gained=0):
    """data/gear/falls.yaml, procedure, with data/harm/health.yaml, harm_kinds, damage. Returns a Critical
    Injury row, "dead", or None."""
    dmg = R.fall_damage(rng.randint(1, 6) + R.fall_adds[band])
    return take_damage(rng, s, dmg, R.fall_injury_type, gained=gained)


def take_damage(rng, s, dmg, injury_type, gained=0, loc=None, plain=False):
    """data/harm/health.yaml, harm_kinds, damage: Health lost up to the boxes left; at 0 the soldier is Down and gains
    a Critical Injury of the damage's Injury Type, at loc or a rolled Injury Location. Falls, steam, a Heave's heat, and
    a Foe's attack use it (decision batch 8, 8-4, 8-7). Returns a Critical Injury row, "dead", or None."""
    if dmg <= 0:
        return None
    if s.current_health() > 0:
        room = s.health - min(len(s.untreated()), s.health) - s.health_lost
        s.health_lost += min(dmg, room)
        if s.current_health() == 0:
            s.down = True
            return gain_ci(rng, s, loc, gained=gained, injury_type=injury_type, plain=plain)
        return None
    return gain_ci(rng, s, loc, gained=gained, injury_type=injury_type, plain=plain)


def gain_scar(rng, s):
    """scars.yaml, gaining, steps: D66, rolling again on a row held (and, for a Squadmate, on a row it rerolls);
    minimum Stress and Resolve rise; five Scars mark the soldier retiring. Returns the row id or None."""
    if s.scars >= R.scar_max:
        return None
    while True:
        rid = R.scar_by_result[10 * rng.randint(1, 6) + rng.randint(1, 6)]
        if rid in s.scar_rows or (not s.pc and R.scar_rows[rid]["squadmate_rerolls"]):
            continue
        break
    s.scar_rows.add(rid)
    s.scars += 1
    s.min_stress += R.min_stress_per_scar
    s.stress = max(s.stress, s.min_stress)
    if s.scars >= R.scar_max:
        s.retiring = True
    return rid


def fear_result(rng, s, triggers=(), extra_resolve=0):
    """data/mind/fear-rolls.yaml: the roll and its row, from the soldier's Stress and Resolve as they stand now, with a
    Scar row's Fear Roll total for its triggers (scars.yaml). Nothing is applied: decision batch 8, 8-40 (D6) reads
    every roll of one event this way before any result of it applies (engine.Fight.fear_event)."""
    extra = sum(R.scar_rows[rid]["fear_total"] for rid in s.scar_rows
                if set(R.scar_rows[rid]["fear_triggers"]) & set(triggers))
    return R.fear_row(rng.randint(1, 6) + s.stress - s.resolve - extra_resolve + extra)


def apply_fear_result(rng, s, row, scar_rng=None):
    """A Fear row's Stress, next-roll penalty, and Scar (its D66 on scar_rng); the caller spends turns and actions and
    sets the ban on Reactions."""
    s.stress += row["stress"]
    s.next_pen += row["next_pen"]
    if row["scar"]:
        gain_scar(scar_rng or rng, s)


def fear_roll(rng, s, triggers=(), scar_rng=None, extra_resolve=0):
    """One soldier's Fear Roll for an event no one else rolls for: fear_result, then apply_fear_result. Returns the
    row."""
    row = fear_result(rng, s, triggers, extra_resolve)
    apply_fear_result(rng, s, row, scar_rng)
    return row


def death_roll(rng, s, ci, context=()):
    """data/harm/death-rolls.yaml: the attribute plus a Talent naming death-roll (a conditional one while its reading
    is in context, as Will to Live's day-limit-death-roll), minus the injury's penalty; no Stress Dice, Help, Gear
    Dice, or Push. Returns the outcome id."""
    COUNT["pools"] += 1
    cond = sum(lvl for e, lvl, kind in s.cond_talents if e == "death-roll" and kind in context)
    n = max(R.min_base_dice, s.a(R.death_attribute) + s.talents.get("death-roll", 0) + cond - ci["row"]["dr_pen"])
    succ = sum(1 for _ in range(n) if rng.randint(1, 6) == SF)
    return R.death_outcome(succ)
