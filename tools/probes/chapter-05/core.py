"""Dice core for the Wings of Freedom Chapter 5 fix-pass simulations.

Run every probe from this directory with PyYAML available, for example
`uv run --with pyyaml python run_simple.py solo 100000`. data/engagement/tuning.yaml (probes, commands)
lists the exact command behind each published table.

Rules modelled (Chapters 1, 3, 4 as written):
- Pool: base (attribute + Talent + Bonus Dice - penalties, min 1), Gear Dice (current rating),
  Stress Dice (= Stress). A 6 is a success.
- Push when short and no Stress Die shows 1: +1 Stress and a new Stress Die (Covered: no new die,
  no Stress for the roller), Hair Trigger +1 Stress; re-roll base and Stress Dice not showing 6.
- One Stress Response per roll if any Stress Die shows 1 (after the Push): D6 + Stress - Resolve.
- Gear Dice showing 1 on a Pushed roll wear the item.
"""
import random
import yaml

import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

SR_ROWS = ["steady", "racing", "narrowed", "shaking", "weak", "hair", "flinch", "locked", "botched"]
LASTING = {
    "racing": {"read", "treat-injury", "field-repair"},
    "narrowed": {"break-attention", "rally"},
    "shaking": {"nape-strike", "body-part-strike", "break-free"},
    "weak": {"fly", "ride", "dodge"},
    "hair": set(),
}


def load_ci_tables():
    data = yaml.safe_load(open(f"{ROOT}/data/harm/critical-injuries.yaml"))
    tables = {}
    for loc, t in data["tables"].items():
        rows = []
        for r in t["rows"]:
            row = {
                "id": r["id"],
                "min": r["results"]["min"],
                "max": r["results"]["max"],
                "instant_death": r.get("instant_death", False),
                "down": r.get("down") == "until_treated",
                "lethal": r.get("lethal", False),
                "limit": r.get("time_limit"),
                "dr_pen": r.get("death_roll_penalty", 0),
                "pen": {},
                "stress": 0,
                "perm": bool(r.get("permanent_effects")),
                "repeat": r.get("repeat_row"),
            }
            for eff in (r.get("effects") or []) + (r.get("permanent_effects") or []):
                if eff["type"] == "penalty":
                    for e in eff["entries"]:
                        row["pen"][e] = row["pen"].get(e, 0) + eff["dice"]
                elif eff["type"] == "stress-gain":
                    row["stress"] += eff["amount"]
            rows.append(row)
        tables[loc] = {"rows": rows, "cap": t["non_lethal_cap"], "by_id": {r["id"]: r for r in rows}}
    return tables


CI = load_ci_tables()


class Soldier:
    def __init__(self, name, strength=4, agility=3, perception=3, instinct=3, health=4, resolve=3,
                 talents=None, stress=1, min_stress=0, odm=2, blade=1, blades=3, spare_canisters=1,
                 horse=2, pc=True, grief=0):
        self.name = name
        self.str = strength
        self.agi = agility
        self.per = perception
        self.ins = instinct
        self.health = health
        self.resolve_base = resolve
        self.grief = grief
        self.scars = 0
        self.talents = talents or {}
        self.stress = stress
        self.min_stress = min_stress
        self.odm_max = odm
        self.odm = odm
        self.gas = 3
        self.spares = spare_canisters
        self.blade = blade
        self.blades = blades          # carried Blade Sets including the one in the handles
        self.handles = blades > 0
        self.horse = horse
        self.pc = pc                  # Squadmates never Push or Cover
        self.lasting = set()
        self.next_pen = 0
        self.cis = []                 # dicts: row, loc, limit (current), gained_turn_index
        self.health_lost = 0
        self.down = False
        self.dead = False
        self.no_react_until = -1      # turn index through which Reactions are forbidden

    @property
    def resolve(self):
        return self.resolve_base + self.scars - self.grief

    def can_push(self):
        return self.pc and not self.down

    def penalty(self, entry):
        p = 0
        for c in self.cis:
            p += c["row"]["pen"].get(entry, 0)
        for row in self.lasting:
            if entry in LASTING[row]:
                p += 1
        return p

    def odm_working(self):
        return self.odm > 0 and self.gas > 0

    def gear_dice(self, item):
        if item == "odm":
            return self.odm if self.odm_working() else 0
        if item == "blade":
            return self.blade if self.handles else 0
        if item == "horse":
            return self.horse
        return 0

    def untreated(self):
        return len(self.cis)

    def current_health(self):
        crossed = min(self.untreated(), self.health)
        return max(0, self.health - crossed - self.health_lost)

    def check_down(self):
        if self.current_health() == 0 or any(c["row"]["down"] for c in self.cis):
            self.down = True


def d6(rng):
    return rng.randint(1, 6)


def stress_response(rng, s):
    """Resolve one Stress Response. Returns (lose, zero, spend_turn)."""
    total = d6(rng) + s.stress - s.resolve
    idx = 0 if total <= 0 else min(total, 8)
    while SR_ROWS[idx] in LASTING and SR_ROWS[idx] in s.lasting:
        idx = min(idx + 1, 8)
    row = SR_ROWS[idx]
    if row in LASTING:
        s.lasting.add(row)
        return 0, False, False
    if row == "flinch":
        return 1, False, False
    if row == "locked":
        return 1, False, True
    if row == "botched":
        s.stress += 1
        return 0, True, False
    return 0, False, False


def attr_roll(rng, s, entry, attr, talent=0, bonus=0, gear="none", push_to=1, cover=False, extra_pen=0,
              allow_push=True):
    """Returns dict(succ, pushed, gear_ones, spend_turn)."""
    pen = s.penalty(entry) + extra_pen
    if s.next_pen:
        pen += s.next_pen
        s.next_pen = 0
    base = max(1, attr + talent + bonus - pen)
    g = s.gear_dice(gear)
    bd = [d6(rng) for _ in range(base)]
    gd = [d6(rng) for _ in range(g)]
    sd = [d6(rng) for _ in range(s.stress)]
    succ = bd.count(6) + gd.count(6) + sd.count(6)
    pushed = False
    sr = 1 in sd
    if allow_push and not sr and succ < push_to and s.can_push():
        pushed = True
        hair = "hair" in s.lasting
        if not cover:
            s.stress += 1
            sd.append(0)
        if hair:
            s.stress += 1
        bd = [x if x == 6 else d6(rng) for x in bd]
        sd = [x if x == 6 else d6(rng) for x in sd]
        succ = bd.count(6) + gd.count(6) + sd.count(6)
        sr = 1 in sd
    spend_turn = False
    if sr:
        lose, zero, spend_turn = stress_response(rng, s)
        succ = 0 if zero else max(0, succ - lose)
    ones = gd.count(1) if pushed else 0
    return {"succ": succ, "pushed": pushed, "gear_ones": ones, "spend_turn": spend_turn}


def gain_ci(rng, s, loc=None, cannot_be_lethal=False, rider=0):
    """Chapter 3 gaining procedure. Returns the row dict (or 'dead'). rider: added to the roll, a Titan attack's
    rider per net success beyond the first (decision batch 8, 8-2; sim_dice().ci_rider); 0 in every Chapter 5 model."""
    if loc is None:
        r = d6(rng)
        loc = "arm" if r <= 2 else "leg" if r <= 4 else "torso" if r == 5 else "head"
    table = CI[loc]
    held = sum(1 for c in s.cis if c["loc"] == loc) + getattr(s, "healed_perm", {}).get(loc, 0)
    total = d6(rng) + d6(rng) + 2 * held + rider
    row = None
    for rw in table["rows"]:
        lo = rw["min"] if rw["min"] is not None else -99
        hi = rw["max"] if rw["max"] is not None else 99
        if lo <= total <= hi:
            row = rw
            break
    gained = getattr(s, "gained_perm", set())
    if row["perm"] and row["id"] in gained:
        row = table["by_id"][row["repeat"]]
    if cannot_be_lethal and (row["lethal"] or row["instant_death"]):
        row = table["by_id"][table["cap"]]
    if row["instant_death"]:
        s.dead = True
        return "dead"
    if row["perm"]:
        gained.add(row["id"])
        s.gained_perm = gained
    # health box: crosses a clean box, else a damage-marked box
    crossed_before = min(len(s.cis), s.health)
    clean = s.health - crossed_before - s.health_lost
    s.cis.append({"row": row, "loc": loc, "limit": row["limit"]})
    if clean <= 0 and crossed_before < s.health and s.health_lost > 0:
        s.health_lost -= 1
    s.stress += row["stress"]
    s.check_down()
    return row


def sim_dice():
    """tools/sim/dice.py, whose Titan attack functions (titan_roll, attack_net, ci_rider, grab_net_lands,
    first_answered; decision batch 8, 8-1 and 8-2) a Chapter 6 table's Attack Dice are read through, so the probes and
    the simulator share one reading. A Chapter 5 model with a fixed severity never calls it."""
    import os
    import sys
    p = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "sim"))
    if p not in sys.path:
        sys.path.append(p)
    import dice
    return dice


def fall_damage(rng, s, band):
    adds = {"low": 0, "high": 2, "extreme": 4}[band]
    t = d6(rng) + adds
    dmg = 0 if t <= 2 else 1 if t <= 4 else 2 if t <= 6 else 3 if t <= 8 else 4
    if dmg == 0:
        return None
    cur = s.current_health()
    if cur > 0:
        room = s.health - min(len(s.cis), s.health) - s.health_lost
        s.health_lost += min(dmg, room)
        if s.current_health() == 0:
            s.down = True
            return gain_ci(rng, s)
        return None
    return gain_ci(rng, s)


def fear_roll(rng, s):
    """Returns effects dict: stress, next_pen, spend_action, spend_turns, no_react, scar."""
    total = d6(rng) + s.stress - s.resolve
    e = {"spend_action": False, "spend_turns": 0, "no_react": False}
    if total <= 0:
        return e
    if total == 1:
        s.stress += 1
    elif total == 2:
        s.stress += 1
        s.next_pen += 1
    elif total == 3:
        e["spend_action"] = True
    elif total == 4:
        e["spend_action"] = True
        s.stress += 1
    elif total == 5:
        e["spend_turns"] = 1
    elif total == 6:
        e["spend_turns"] = 1
        e["no_react"] = True
    else:
        e["spend_turns"] = 2 if total >= 8 else 1
        e["no_react"] = True
        s.scars += 1
        s.min_stress += 1
        s.stress = max(s.stress, s.min_stress)
    return e


BUILDS = {
    "rookie": dict(strength=4, agility=3, perception=3, instinct=3, health=4, resolve=3,
                   talents={"nape-strike": 1, "body-part-strike": 1, "break-free": 1, "treat-injury": 1},
                   stress=1, odm=2, blade=1, blades=3, spare_canisters=1, horse=2),
    "veteran": dict(strength=5, agility=3, perception=3, instinct=3, health=4, resolve=5, min_stress=2,
                    talents={"nape-strike": 2, "body-part-strike": 2, "break-free": 2, "treat-injury": 2},
                    stress=2, odm=2, blade=2, blades=3, spare_canisters=1, horse=2),
    "levi": dict(strength=6, agility=4, perception=4, instinct=4, health=5, resolve=4,
                 talents={"nape-strike": 3, "body-part-strike": 3, "break-free": 3, "treat-injury": 3},
                 stress=2, odm=3, blade=3, blades=3, spare_canisters=1, horse=3),
}


def make(build, name="s", **over):
    kw = dict(BUILDS[build])
    kw.update(over)
    return Soldier(name, **kw)
