"""Rule values for the Wings of Freedom Phase 1 simulator, read from data/ YAML when the module loads.

Nothing here restates a table. Every number, row, and list comes from the YAML file named beside it
(ADR-0012). Where a value is written only in a YAML prose field, it is parsed from that field with a
pattern that raises if the wording changes, so a later YAML fix either flows through or stops the run.
Procedures (the order of steps, what a test means) live in engine.py; the values they use live here.
"""
import itertools
import os
import re

import yaml

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA = os.path.join(ROOT, "data")


def load(rel):
    with open(os.path.join(DATA, rel)) as fh:
        return yaml.safe_load(fh)


def covers(results, total):
    lo, hi = results.get("min"), results.get("max")
    return (lo is None or total >= lo) and (hi is None or total <= hi)


def walk(node):
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


def parse(pattern, text, what):
    m = re.search(pattern, " ".join(text.split()))
    if not m:
        raise ValueError(f"cannot read {what} from its YAML text: {text[:160]!r}")
    return m


def guard(pattern, text, what):
    """parse for a pattern that only guards the YAML wording and reads no value from it. Letter case is ignored, so
    a glossary term the text capitalises (Ambush, Night Camp, Lead, Depot, Shot, Net Successes) still reads. A
    pattern that reads a value stays parse, case-sensitive."""
    return parse("(?i)" + pattern, text, what)


def pos_name(pid):
    return pid.replace("-", " ").title()


WORDS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9,
         "ten": 10, "twelve": 12}


def count_of(word, what):
    """A count written as a digit or a word ("three"); raises on anything else."""
    w = str(word).strip().lower()
    if w.isdigit():
        return int(w)
    if w in WORDS:
        return WORDS[w]
    raise ValueError(f"cannot read a count for {what} from {word!r}")


def ids_of(node, what):
    """A closed list written as ids, as rows that carry an id, as {rows: [...]}, or as a mapping keyed by id; raises
    on anything else."""
    if isinstance(node, dict):
        node = node["rows"] if "rows" in node else list(node)
    if not isinstance(node, list) or not node:
        raise ValueError(f"cannot read the list of {what} from {node!r}")
    return [x if isinstance(x, str) else x["id"] for x in node]


def text_of(node):
    """Every string in a YAML node, joined with spaces, for a parse guard over a block whose wording is prose."""
    if isinstance(node, dict):
        return " ".join(text_of(v) for v in node.values())
    if isinstance(node, list):
        return " ".join(text_of(v) for v in node)
    return " ".join(str(node).split()) if node is not None else ""


def thousands(text, what):
    return int(parse(r"([\d,]+)", text, what).group(1).replace(",", ""))


FRACTIONS = {"half": 2, "third": 3, "quarter": 4, "fifth": 5, "sixth": 6}


def fraction_of(text, what):
    """A share written as words ("a third", "two thirds", "one half") or a percentage ("33%"), as a number from 0
    to 1; raises on anything else."""
    t = " ".join(str(text).strip().lower().split())
    m = re.fullmatch(r"([\d.]+)%", t)
    if m:
        return float(m.group(1)) / 100
    m = re.fullmatch(r"(a|an|one|two|three|four|five) (half|halves|thirds?|quarters?|fifths?|sixths?)", t)
    if m:
        num = 1 if m.group(1) in ("a", "an") else count_of(m.group(1), what)
        word = "half" if m.group(2) == "halves" else m.group(2).rstrip("s")
        return num / FRACTIONS[word]
    raise ValueError(f"cannot read a share for {what} from {text!r}")


def tolerance_of(value, what):
    """A target's tolerance as ADR-0014 (as amended in decision batch 5, OQ-127) and the tuning files write it:
    "exactly N" (a median, read exactly), "A% to B%" or "A to B" (both edges inside), "at most X", "at least X"
    (the edge inside), or "under X" (the edge outside). A bare whole number is "exactly". Raises on anything else.
    A band may be followed by a comma and the reading it names (decision batch 5, 5-19: "at most 0.05, deaths
    through the end of the Titan Engagement; ..."): the band is read before the first comma, and the reading is
    returned as written for the caller to check (targets.py).
    Returns dict(kind "exact" or "band", value, lo, hi, lo_in, hi_in, text, reading)."""
    if isinstance(value, int):
        return dict(kind="exact", value=value, lo=None, hi=None, lo_in=True, hi_in=True, text=f"exactly {value}",
                    reading=None)
    band, _, reading = " ".join(str(value).split()).partition(",")
    out = _band_of(band.strip(), value, what)
    out["reading"] = reading.strip() or None
    return out


def _band_of(t, value, what):
    m = re.fullmatch(r"(?:the median kill round is )?exactly (\d+)", t)
    if m:
        return dict(kind="exact", value=int(m.group(1)), lo=None, hi=None, lo_in=True, hi_in=True, text=t)
    m = re.fullmatch(r"([\d.]+)(%?) to ([\d.]+)(%?)", t)
    if m:
        return dict(kind="band", value=None, lo=float(m.group(1)), hi=float(m.group(3)), lo_in=True, hi_in=True, text=t)
    m = re.fullmatch(r"(at most|at least|under) ([\d.]+)(%?)", t)
    if m:
        x = float(m.group(2))
        if m.group(1) == "at least":
            return dict(kind="band", value=None, lo=x, hi=None, lo_in=True, hi_in=True, text=t)
        return dict(kind="band", value=None, lo=None, hi=x, lo_in=True, hi_in=m.group(1) == "at most", text=t)
    raise ValueError(f"cannot read a tolerance for {what} from {value!r}")


class Rules:
    INJURY_TYPE_IDS = {"crush", "bite", "burn", "cut", "pierce"}     # ADR-0017

    def type_id(self, value, what):
        """An Injury Type as a rule names it (an id, or its name in any case) -> its id in critical-injuries.yaml."""
        found = [t for t in self.injury_types if t.lower() == str(value).strip().lower()]
        if len(found) != 1:
            raise ValueError(f"{what} names {value!r}, which is not an Injury Type (decision batch 7, 7-5)")
        return found[0]

    def named_type(self, node, text, what):
        """The Injury Type a rule names (decision batch 7, 7-5): its injury_type field when it has one, otherwise the
        one Injury Type its text names. Raises when it names none or several."""
        if isinstance(node, dict) and "injury_type" in node:
            return self.type_id(node["injury_type"], what)
        words = " ".join(str(text).split())
        # the capitalised term only, so that "the crush" (the Grab step's name) is not read as the type
        found = [t for t in self.injury_types if re.search(rf"\b{re.escape(t.capitalize())}\b", words)]
        if len(found) != 1:
            raise ValueError(f"cannot read the Injury Type of {what} from its YAML text: {words[:160]!r}")
        return found[0]

    def __init__(self):
        self._dice()
        self._mind()
        self._harm()
        self._gear()
        self._engagement()
        self._titans()
        self._zones()
        self._character()
        self._treatment()
        self._read()
        self._scars()
        self._carrying_and_horses()
        self._round_and_setup()
        self._case_dimensions()

    # ------------------------------------------------------------------ Chapter 1
    def _dice(self):
        dp = load("core/dice-pool.yaml")
        faces = {tuple(d["success_faces"]) for d in dp["die_types"]}
        if len(faces) != 1 or len(next(iter(faces))) != 1:
            raise ValueError("dice-pool.yaml: the simulator expects one success face shared by every die type")
        self.success_face = next(iter(faces))[0]
        comp = {c["id"]: c for c in dp["components"]}
        self.min_base_dice = comp["penalty"]["min_base_dice_after"]
        bd = load("core/bonus-dice-sources.yaml")
        self.bonus_cap = min(comp["bonus"]["max"], bd["cap_per_roll"])
        src = {s["id"]: s for s in bd["sources"]}
        self.grounded_bonus = src["grounded-titan"]["dice_per_unit"]
        self.help_max = src["help"]["max_units"]

    # ------------------------------------------------------------------ Chapter 3, mind
    def _mind(self):
        sr = load("mind/stress-responses.yaml")
        self.sr_rows = []
        for row in sr["table"]["rows"]:
            r = dict(id=row["id"], results=row["results"], lasting=row["duration"] == "lasting", pen={},
                     push_stress=0, lose=0, zero=False, spend_turns=0, stress=0)
            for e in row["effects"]:
                t = e["type"]
                if t == "penalty":
                    for en in e["entries"]:
                        r["pen"][en] = r["pen"].get(en, 0) + e["dice"]
                elif t == "push-stress":
                    r["push_stress"] += e["amount"]
                elif t == "lose-successes":
                    r["lose"] += e["amount"]
                elif t == "zero-successes":
                    r["zero"] = True
                elif t == "spend-next-turn":
                    r["spend_turns"] += e.get("turns", 1)
                elif t == "stress-gain":
                    r["stress"] += e["amount"]
                else:
                    raise ValueError(f"stress-responses.yaml: effect type {t} is not modelled")
            self.sr_rows.append(r)
        self.sr_by_id = {r["id"]: r for r in self.sr_rows}

        fr = load("mind/fear-rolls.yaml")
        self.fear_triggers = [t["id"] for t in fr["triggers"]]
        self.fear_rows = []
        for row in fr["table"]["rows"]:
            # the row's text field is flavour and never read (decision batch 7, 7-8)
            r = dict(id=row["id"], results=row["results"], stress=0, next_pen=0, spend_action=False,
                     spend_turns=0, no_react=False, scar=False, draw=False, nearby=0, forced_move=None,
                     forced_action=False, drop_blades=False, gas_roll=False)
            for e in row["effects"]:
                t = e["type"]
                # decision batch 7, 7-8 (OQ-139): the six effect types a Fear row may add (effect-types.yaml)
                if t == "draw-attention":
                    r["draw"] = True
                elif t == "stress-gain-nearby":
                    r["nearby"] += e.get("amount", 1)
                elif t == "forced-move":
                    toward = " ".join(str(e.get("toward", "")).split()).lower()
                    r["forced_move"] = ("distant" if re.search(r"\bdistant\b", toward, re.I)
                                        else "comrade" if re.search(r"\bcomrade\b", toward, re.I) else None)
                    if r["forced_move"] is None:
                        raise ValueError(f"fear-rolls.yaml {row['id']}: forced-move toward {e.get('toward')!r} is not modelled")
                elif t == "forced-action":
                    # decision batch 7, 7-8: a forced strike only on a row at total 7 or more
                    if row["results"]["min"] is None or row["results"]["min"] < 7:
                        raise ValueError(f"fear-rolls.yaml {row['id']}: forced-action below total 7 (decision batch 7, 7-8)")
                    r["forced_action"] = True
                elif t == "drop-blade-set":
                    r["drop_blades"] = True
                elif t == "gas-roll":
                    r["gas_roll"] = True
                elif t == "stress-gain":
                    r["stress"] += e["amount"]
                elif t == "next-roll-penalty":
                    r["next_pen"] += e["dice"]
                elif t == "spend-next-action":
                    r["spend_action"] = True
                elif t == "spend-next-turn":
                    r["spend_turns"] += e.get("turns", 1)
                elif t == "no-reactions":
                    r["no_react"] = True
                elif t == "gain-scar":
                    r["scar"] = True
                else:
                    raise ValueError(f"fear-rolls.yaml: effect type {t} is not modelled")
            # Chapter 1's forbids hook (OQ-18): reaction beside no-reactions; help and cover beside forced-action, which
            # forbids both until the forced strike is taken, whether or not the row lists them (decision batch 7, 7-8)
            forbids = set(row.get("forbids") or [])
            allowed = ({"reaction"} if r["no_react"] else set()) | ({"help", "cover"} if r["forced_action"] else set())
            if forbids - allowed:
                raise ValueError(f"fear-rolls.yaml {row['id']}: forbids {sorted(forbids - allowed)} is not modelled")
            self.fear_rows.append(r)

        gr = load("mind/grief.yaml")
        self.grief_max = gr["maximum"]
        # grief.yaml, amount: the deaths of one day passing give each soldier 1 Grief in total (healing.yaml, each_day)
        # decision batch 7, 7-17: the deaths of one Skirmish now come before those of a day in the same sentence
        guard(r"So do the deaths of one (?:Skirmish, and the deaths of one )?day passing",
              next(a["limit"] for a in gr["gaining"]["amount"] if "limit" in a),
              "Grief for the deaths of one day")
        guard(r"every other living soldier in the Squad", gr["gaining"]["who"]["other_death"],
              "who gains Grief for a death outside a Titan Engagement")

    def sr_index(self, total):
        for i, r in enumerate(self.sr_rows):
            if covers(r["results"], total):
                return i
        raise ValueError(total)

    def fear_row(self, total):
        for r in self.fear_rows:
            if covers(r["results"], total):
                return r
        raise ValueError(total)

    # ------------------------------------------------------------------ Chapter 3, harm
    def _harm(self):
        ci = load("harm/critical-injuries.yaml")
        # decision batch 7, 7-5 (ADR-0017, OQ-137): the five Injury Types. Every rule that inflicts a Critical Injury
        # names one; it picks the row's name and any rider the table carries for it (type_riders).
        self.injury_types = ids_of(ci["types"], "Injury Types")
        if {x.lower() for x in self.injury_types} != self.INJURY_TYPE_IDS:
            raise ValueError(f"critical-injuries.yaml types changed ({self.injury_types}); ADR-0017 names five")
        self.ci_per_held = ci["worsening"]["per_held_injury"]
        # decision batch 7, 7-4: 1 left arm, 2 right arm, 3 left leg, 4 right leg, 5 torso, 6 head; worsening counts
        # the Critical Injuries at the same Injury Location and side; a rule that names arm or leg rolls the side
        self.ci_location_rows = [(r["results"], r["injury_location"], r.get("side"))
                                 for r in ci["injury_location_table"]["rows"]]
        self.ci_sided = {loc for _, loc, side in self.ci_location_rows if side is not None}
        for loc in {loc for _, loc, _ in self.ci_location_rows}:
            sides = sorted(str(side) for _, l, side in self.ci_location_rows if l == loc)
            if sides != (["left", "right"] if loc in self.ci_sided else ["None"]):
                raise ValueError(f"critical-injuries.yaml injury_location_table: {loc} has sides {sides}")
        guard(r"Injury Location and side", ci["worsening"]["counts"], "worsening by Injury Location and side")
        sides = ci["sides"]
        if set(sides["sided_locations"]) != self.ci_sided:
            raise ValueError(f"critical-injuries.yaml: sides names {sides['sided_locations']}, the table {sorted(self.ci_sided)}")
        roll = sides["side_roll"]
        if roll["roll"] != "D6":
            raise ValueError(f"critical-injuries.yaml sides, side_roll: a {roll['roll']} is not modelled")
        self.side_by_parity = {1: roll["odd"], 0: roll["even"]}
        if set(self.side_by_parity.values()) != set(sides["values"]):
            raise ValueError(f"critical-injuries.yaml sides, side_roll: {roll} does not give both sides")
        rider_fields = {"time_limit": "limit", "death_roll_penalty": "dr_pen", "healing_days": "heal_days"}
        self.ci_tables = {}
        for loc, t in ci["tables"].items():
            rows = []
            for r in t["rows"]:
                row = dict(id=r["id"], results=r["results"], instant_death=bool(r.get("instant_death", False)),
                           down=r.get("down") == "until_treated", lethal=bool(r.get("lethal", False)),
                           limit=r.get("time_limit"), dr_pen=r.get("death_roll_penalty") or 0, pen={}, pen_perm={},
                           stress=0, perm=bool(r.get("permanent_effects")), repeat=r.get("repeat_row"), loc=loc,
                           heal_days=r.get("healing_days"))
                for perm, e in [(False, e) for e in (r.get("effects") or [])] + \
                               [(True, e) for e in (r.get("permanent_effects") or [])]:
                    if e["type"] == "penalty":
                        for en in e["entries"]:
                            row["pen"][en] = row["pen"].get(en, 0) + e["dice"]
                            if perm:     # healing.yaml, healing_time, heals: permanent effects stay after it heals
                                row["pen_perm"][en] = row["pen_perm"].get(en, 0) + e["dice"]
                    elif e["type"] == "stress-gain":
                        row["stress"] += e["amount"]
                    else:
                        raise ValueError(f"critical-injuries.yaml: effect type {e['type']} is not modelled")
                if not row["instant_death"] and row["heal_days"] is None:
                    raise ValueError(f"critical-injuries.yaml: {row['id']} has no healing_days")
                # decision batch 7, 7-5: one name per Injury Type on every row; the names change no field
                if set(r.get("names") or {}) != set(self.injury_types):
                    raise ValueError(f"critical-injuries.yaml: {row['id']} names {sorted(r.get('names') or {})}, not "
                                     "one name per Injury Type (decision batch 7, 7-5)")
                row["names"] = dict(r["names"])
                rows.append(row)
            # decision batch 7, 7-5: the rows each Injury Type reads, with the table's rider for that type applied
            # (the Bite rider: time_limit turn on the arm and leg tables' 12 and 13+ rows)
            riders = t.get("type_riders") or {}
            for typ in riders:
                if typ not in self.injury_types:
                    raise ValueError(f"critical-injuries.yaml {loc} type_riders: {typ} is not an Injury Type")
            by_type = {}
            for typ in self.injury_types:
                trows = [dict(rw, type=typ, name=rw["names"][typ]) for rw in rows]
                tby = {rw["id"]: rw for rw in trows}
                for rider in riders.get(typ) or []:
                    # A rider names its rows (rows; the Bite rider, decision batch 7, 7-5), every row (all_rows), or
                    # every lethal row (lethal_rows), and sets fields or the Treat Injury requirement (the Burn rider,
                    # decision batch 8, 8-8: healing doubled, lethal rows on a day limit, a medical kit or supplies)
                    what = f"critical-injuries.yaml {loc} type_riders {typ}"
                    picks = {"rows", "all_rows", "lethal_rows"} & set(rider)
                    if set(rider) - {"rows", "all_rows", "lethal_rows", "sets", "treat_injury"} or len(picks) != 1:
                        raise ValueError(f"{what}: {sorted(rider)} is not modelled")
                    ids = (list(rider["rows"]) if "rows" in rider
                           else [rw["id"] for rw in trows if rider.get("all_rows") or (rider.get("lethal_rows") and rw["lethal"])])
                    for rid in ids:
                        rw = tby[rid]
                        sets = dict(rider.get("sets") or {})
                        if "treat_injury" in rider:
                            sets["treat_injury"] = rider["treat_injury"]
                        for field, value in sets.items():
                            if field == "healing_days_multiplier":
                                if rw["heal_days"] is not None:
                                    rw["heal_days"] = rw["heal_days"] * value
                            elif field == "treat_injury":
                                # 8-8 Burn: no roll without a medical kit or supplies; 8-15 Pierce: a penalty on the roll
                                if value == "requires_kit_or_supplies":
                                    rw["treat_needs_kit"] = True
                                elif isinstance(value, dict) and set(value) == {"penalty"}:
                                    rw["treat_pen"] = int(value["penalty"])
                                else:
                                    raise ValueError(f"{what}: treat_injury {value!r} is not modelled")
                            elif field == "heals_untreated":
                                if value is not False:
                                    raise ValueError(f"{what}: heals_untreated {value!r} is not modelled")
                                rw["heals_untreated"] = False      # 8-15 Pierce: no healing until treated
                            elif field not in rider_fields:
                                raise ValueError(f"{what}: {field} is not modelled")
                            elif field == "time_limit" and not rw["lethal"]:
                                raise ValueError(f"{what}: a time_limit on {rid}, which is not lethal")
                            else:
                                rw[rider_fields[field]] = value
                by_type[typ] = dict(rows=trows, by_id=tby)
            self.ci_tables[loc] = dict(rows=rows, cap=t["non_lethal_cap"], by_id={r["id"]: r for r in rows},
                                       by_type=by_type)

        dr = load("harm/death-rolls.yaml")
        self.death_attribute = dr["death_roll"]["attribute"]
        self.death_needs = dr["death_roll"]["needs"]
        self.death_outcomes = [(o["successes"], o["id"]) for o in dr["outcomes"]]
        self.limit_slows = {tl["id"]: tl.get("slows_to") for tl in dr["time_limits"]}
        self.limit_ids = [tl["id"] for tl in dr["time_limits"]]
        for loc, tb in self.ci_tables.items():     # a type rider's time_limit is one death-rolls.yaml names
            for typ, tt in tb["by_type"].items():
                for rw in tt["rows"]:
                    if rw["lethal"] and rw["limit"] not in self.limit_ids:
                        raise ValueError(f"critical-injuries.yaml {loc} ({typ}): {rw['id']} has time limit {rw['limit']!r}")
        if self.limit_slows.get("day") != "stabilized":
            raise ValueError("death-rolls.yaml: a day limit no longer slows to stabilized")

        # healing.yaml: the interim day (decision batch 5, 5-2, OQ-120) and each day's steps, in order
        hl = load("harm/healing.yaml")
        guard(r"one day passes at the start of each session, before the interim issue", hl["day_passes"]["interim"],
              "the interim day")
        guard(r"each_day runs as written, and Stress and Grief do not change", hl["day_passes"]["interim"],
              "the interim day's Stress and Grief")
        steps = [" ".join(x.split()) for x in hl["each_day"]]
        keys = ("Hold a care window", "with a day limit runs out and causes a Death Roll",
                "gets back all Health lost to damage", "healing time drops by 1 day. One that reaches 0 heals")
        if len(steps) != len(keys) or any(k not in s for k, s in zip(keys, steps)):
            raise ValueError(f"healing.yaml each_day changed; engine.Fight.day_passes follows the old steps: {steps}")
        self.lethal_heal_floor = int(parse(r"It stays at (\d+) day until it is stabilized",
                                           hl["healing_time"]["lethal_injuries"], "a lethal injury's healing time").group(1))

    def death_outcome(self, successes):
        for res, oid in self.death_outcomes:
            if covers(res, successes):
                return oid
        raise ValueError(successes)

    # ------------------------------------------------------------------ Chapter 4
    def _gear(self):
        fl = load("gear/falls.yaml")
        # decision batch 7, 7-5: every fall is Crush, and so is the Critical Injury its damage inflicts
        self.fall_injury_type = self.named_type(fl, " ".join(str(x) for x in fl["procedure"]), "a fall")
        self.fall_bands = [b["id"] for b in fl["height"]["bands"]]
        self.fall_adds = {b["id"]: b["adds"] for b in fl["height"]["bands"]}
        self.fall_damage_rows = [(r["results"], r["damage"]) for r in fl["damage_table"]["rows"]]
        self._fall_height_text = " ".join(fl["height"]["steps"])

        od = load("gear/odm-gear.yaml")
        self.full_gas = od["gas"]["full_gas_rating"]
        self.gas_dice = od["gas_roll"]["dice"]

        fr = load("gear/field-repair.yaml")
        self.field_repair_attribute = fr["attribute"]
        self.field_repair_needs = fr["needs"]

        si = load("gear/standard-issue.yaml")
        self.funding = si["funding"]["until_funding_rules"]
        row = next(r for r in si["by_funding"] if r["funding"] == self.funding)
        self.issue = dict(row)
        self.issue["blade_set_rating"] = si["every_row"]["blade_set_rating"]
        ss = load("gear/squad-supply.yaml")
        self.supply = next(r for r in ss["stock"]["by_funding"] if r["funding"] == self.funding)

    def gas_roll_dice(self, pc, pushed_odm):
        if not pc:
            return self.gas_dice["squadmate"]
        return self.gas_dice["after_pushed_odm_roll"] if pushed_odm else self.gas_dice["standard"]

    def fall_damage(self, total):
        for res, dmg in self.fall_damage_rows:
            if covers(res, total):
                return dmg
        raise ValueError(total)

    # ------------------------------------------------------------------ Chapter 5
    def _engagement(self):
        ar = load("engagement/anchor-ratings.yaml")
        self.positions = list(ar["positions"])
        self.ratings = {}
        for r in ar["ratings"]:
            steps = {}
            for st in r["steps"]:
                kinds = {k for k, key in (("foot", "on_foot"), ("mounted", "mounted"), ("odm", "odm")) if st.get(key)}
                steps[frozenset(st["between"])] = dict(kinds=kinds, fly=st.get("fly_roll"))
            self.ratings[r["id"]] = dict(name=r["name"], steps=steps)
        g = ar["grounded_titan"]
        m = parse(r"joining two of ([a-z-]+), ([a-z-]+), and ([a-z-]+)", g["on_foot_steps"], "grounded on-foot Positions")
        self.grounded_close = set(m.groups())
        m = parse(r"step between ([a-z-]+) and ([a-z-]+) that a move on foot or an ODM move", g["open_rating"],
                  "the grounded Open step")
        self.grounded_extra_pair = frozenset(m.groups())
        # "in an Open zone" or "at an Open zone" (decision batch 16, 16-21)
        self.grounded_extra_rating = next(rid for rid, r in self.ratings.items()
                                          if re.search(rf"(?i)\b[ia][nt] an? {r['name']} zone", " ".join(g["open_rating"].split())))
        m = parse(r"holds ([a-z-]+) relative to it then holds ([a-z-]+) instead", g["ends"], "grounding's end")
        self.grounded_end_move = (m.group(1), m.group(2))
        self.fall_raise_ratings = {rid for rid, r in self.ratings.items() if r["name"] in self._fall_height_text}
        self.fall_high = set()
        for pid in self.positions:
            for part in re.findall(r"([A-Z][A-Za-z ]+?) or ([A-Z][A-Za-z ]+?) is (low|high)", self._fall_height_text):
                if pos_name(pid) in part[:2] and part[2] == "high":
                    self.fall_high.add(pid)
        if not self.fall_high:
            raise ValueError("falls.yaml: no Position reads as a high fall")
        # falls.yaml, height, steps: the fall's reference body (decision batch 16, 16-22): the body the soldier's
        # attachment named, else the Focus Titan whose card, Grab, or effect caused the fall, else the Focus Titan nearest
        # the soldier's zone. With one Focus Titan it is always that Titan.
        ht = " ".join(self._fall_height_text.split())
        guard(r"attachment named", ht, "the fall's reference body")
        guard(r"nearest the soldier's zone", ht, "the fall's reference body")
        pos = load("engagement/positions.yaml")
        # positions.yaml, falls_land (16-22): the soldier stays in their zone and their attachment becomes ground
        m = parse(r"stays in the zone they are in, which for an attached soldier is the body's zone, and their attachment "
                  r"becomes ([a-z-]+)\. They then hold ([a-z-]+) relative to that body", pos["falls_land"]["where"],
                  "where a fall lands")
        self.fall_lands_attach, self.fall_lands = m.group(1), m.group(2)
        # positions.yaml, moves, down_soldier (16-12): one on-foot zone step out of a zone holding a body into an
        # adjacent zone holding none (engine.Fight.crawl)
        guard(r"one on-foot zone step, out of a zone that holds a body into an adjacent zone that holds none",
              pos["moves"]["down_soldier"]["allowed"], "the Down soldier's move")

        at = load("engagement/attention.yaml")
        self.tests = {t["id"]: t for t in at["tests"]}
        m = parse(r"in the order ([a-z-]+), ([a-z-]+), ([a-z-]+), ([a-z-]+)\.", self.tests["nearest"]["meaning"],
                  "the nearest order")
        self.nearest_rank = {p: i for i, p in enumerate(m.groups())}
        self.ladders = {l["id"]: list(l["rungs"]) for l in at["ladders"]}
        self.flags = [f["id"] for f in at["flags"]]
        ba = at["break_attention"]
        self.ba_needs = dict(ba["needs"])
        self.decoys = {d["id"]: d for d in ba["decoys"]}
        m = parse(r"holds ([a-z-]+) or ([a-z-]+) relative to the Titan", self.decoys["feint"]["requirement"], "the Feint's Positions")
        self.feint_positions = set(m.groups())
        m = parse(r"holds ([a-z-]+) or ([a-z-]+) relative to the Titan", self.decoys["thrown-cloak"]["requirement"], "the cloak's Positions")
        self.cloak_positions = set(m.groups())
        # attention.yaml, draw_attention, requirements: not from Distant (decision batch 5, 5-8, OQ-113)
        m = parse(r"holds a Position other than ([a-z-]+) relative to that Titan", " ".join(at["draw_attention"]["requirements"]),
                  "Draw Attention's Position requirement")
        self.draw_barred_positions = {m.group(1)}

        th = load("engagement/titan-harm.yaml")
        self.part_kinds = {k["id"]: k for k in th["body_part_kinds"]}
        self.grounding_kinds = {k["id"] for k in th["body_part_kinds"] if "grounded" in k["when_broken"]}
        self.flare_blocking_kinds = {k["id"] for k in th["body_part_kinds"] if "Flare" in k["when_broken"]}
        self.part_states = list(th["states"]["order"])
        self.broken = len(self.part_states) - 1
        self.body_strike_needs = th["body_part_strikes"]["needs"]
        m = parse(r"struck from ([a-z-]+), ([a-z-]+), or ([a-z-]+)", " ".join(th["grounded"]["effects"]), "grounded reach")
        self.grounded_reach = set(m.groups())

        gb = load("engagement/grab.yaml")
        esc = {e["id"]: e for e in gb["escapes"]}
        self.break_free_needs = esc["break-free"]["needs"]
        self.break_free_lifted_penalty = esc["break-free"]["lifted_penalty"]
        self.pry_loose_needs = esc["pry-loose"]["needs"]
        self.pry_loose_lifted_penalty = esc["pry-loose"]["lifted_penalty"]
        arm = esc["strike-the-holding-arm"]
        self.grab_reach_before = set(arm["reach_before_lift"])
        self.grab_reach_after = set(arm["reach_after_lift"])
        self.grab_strike_penalty = arm["strike_penalty"]
        self.grip_toughness = gb["grab_lands"]["grip_toughness"]
        # grab.yaml, grab_lands, steps, in order: the hold before the crush (decision batch 5, 5-6, OQ-124)
        self.grab_steps = [s["id"] for s in gb["grab_lands"]["steps"]]
        guard(r"already Grabbed", next(s["text"] for s in gb["grab_lands"]["steps"] if s["id"] == "crush"),
              "the crush on a soldier already Grabbed")
        m = parse(r"holding arm is the first ([a-z]+) in the Titan's stat block",
                  next(s["text"] for s in gb["grab_lands"]["steps"] if s["id"] == "hold"), "the holding arm's kind")
        self.grab_kind = m.group(1)

        sc = load("engagement/size-classes.yaml")
        self.size_classes = {c["id"]: c for c in sc["classes"]}
        self._titan_dice_and_hazards(th)

        rd = load("engagement/round.yaml")
        m = parse(r"cards numbered (\d+) to (\d+)", rd["initiative_cards"]["set"], "the initiative cards")
        self.cards = (int(m.group(1)), int(m.group(2)))

        st = load("engagement/squad-tactics.yaml")
        self.tactics = {t["id"]: t for t in st["tactics"]}
        m = parse(r"gains (\d+) more success", self.tactics["hamstring-line"]["effect"], "Hamstring Line's successes")
        self.hamstring_extra = int(m.group(1))

        es = load("engagement/engagement-setup.yaml")
        self.setup = es

        self.engagement_tuning = load("engagement/tuning.yaml")

    # ------------------------------------------------------------------ the field (ADR-0029; decision batch 16)
    def _zones(self):
        """data/engagement/zones.yaml and the fields batch 16 added elsewhere (IMPLEMENTATION-PLAN-E.md, sections 5.1 and
        5.2). Raises if any key of that contract is missing, so a data edit that drops one stops the run here. The
        provisional values (OQ-200: the Carry limit and the mounted pace; OQ-202: the terrain mix) are read here and
        nowhere else."""
        def need(node, key, where):
            if not isinstance(node, dict) or key not in node:
                raise ValueError(f"{where}: no {key!r} (decision batch 16; IMPLEMENTATION-PLAN-E.md, section 5)")
            return node[key]

        zy = load("engagement/zones.yaml")
        co = need(zy, "coordinates", "zones.yaml")
        if need(co, "system", "zones.yaml coordinates") != "axial-flat-top":
            raise ValueError(f"zones.yaml coordinates: system {co['system']!r}; space.py reads axial-flat-top")
        fields = need(zy, "fields", "zones.yaml")
        sizes = {}
        for sz in need(fields, "sizes", "zones.yaml fields"):
            zs = need(sz, "zones", f"zones.yaml fields {sz.get('id')}")
            nums = [z["n"] for z in zs]
            if nums != list(range(1, len(zs) + 1)):
                raise ValueError(f"zones.yaml field {sz['id']}: zones not numbered 1 to {len(zs)} in order")
            # 16-2: numbered column by column from the left, top to bottom within a column
            if [(z["q"], z["r"]) for z in zs] != sorted((z["q"], z["r"]) for z in zs):
                raise ValueError(f"zones.yaml field {sz['id']}: numbering is not column by column, top to bottom")
            sizes[sz["id"]] = dict(centre=need(sz, "centre", sz["id"]), squad_start=need(sz, "squad_start", sz["id"]),
                                   zones=zs, name=sz.get("name"))
        self.zones = dict(neighbour_offsets=need(co, "neighbour_offsets", "zones.yaml coordinates"), sizes=sizes,
                          default=need(fields, "default", "zones.yaml fields"), file=zy)
        if self.zones["default"] not in sizes:
            raise ValueError(f"zones.yaml fields default {self.zones['default']!r} is no size")
        for key in ("edge_zone", "off_field", "occupancy", "attachments", "states_beside_the_attachment",
                    "detach_rule", "derivation", "between_soldiers", "moves", "flight", "crossing_flag", "stride",
                    "placement", "entry_zone", "effects", "effect_crossing", "elevation", "named_field_format", "gm"):
            need(zy, key, "zones.yaml")
        # the attachments and their derivation, which space.DERIVES and space.derive_position encode
        import space
        att = {a["id"]: a for a in zy["attachments"]}
        if sorted(att) != sorted(space.FREE + space.BODY_KINDS):
            raise ValueError(f"zones.yaml attachments changed: {sorted(att)}")
        for aid, a in att.items():
            if a["free"] != (aid in space.FREE) or a.get("derives") != space.DERIVES.get(aid):
                raise ValueError(f"zones.yaml attachment {aid}: free or derives changed; space.py encodes the old rows")
        rows = [(r["id"], r["position"]) for r in need(zy["derivation"], "order", "zones.yaml derivation")]
        if [p for _, p in rows] != [space.OB, space.BS, space.IR, space.IR, space.D]:
            raise ValueError(f"zones.yaml derivation order changed: {rows}; space.derive_position reads the old one")
        bs = zy["between_soldiers"]
        if (need(bs, "same_position", "between_soldiers"), need(bs, "position_steps", "between_soldiers")) != ("same-zone", "zones"):
            raise ValueError("zones.yaml between_soldiers changed; engine.Fight.zones_apart reads zones")
        # moves (16-12) and the Flight (16-13, 16-14)
        mv = zy["moves"]
        for key in ("zone_step", "attachment_step", "entered_zone_reads", "on_foot", "mounted", "down_soldier", "letting_go"):
            need(mv, key, "zones.yaml moves")
        if need(mv["on_foot"], "steps", "moves on_foot") != 1:
            raise ValueError("zones.yaml moves on_foot: not one step")
        mt = mv["mounted"]
        self.mounted_pace = int(need(mt, "zone_steps", "moves mounted"))                     # OQ-200
        if need(mt, "attachment_steps", "moves mounted") != 0 or \
                need(mt, "ends_on_entering_a_standing_focus_titans_zone_unless_open", "moves mounted") is not True:
            raise ValueError("zones.yaml moves mounted: space.ground_options encodes no attachment step and the stop")
        guard(r"out of a zone that holds a body into an adjacent zone that holds none, never off field", mv["down_soldier"],
              "the Down soldier's zone step")
        fl = zy["flight"]
        if need(fl, "first_step_cost", "flight") != 0 or need(fl, "ends_free_in_open", "flight") is not False \
                or need(fl, "ends_free_as", "flight") != "anchored":
            raise ValueError("zones.yaml flight: first_step_cost, ends_free_in_open, or ends_free_as changed")
        if (need(fl, "momentum_gain_cap", "flight"), need(fl, "momentum_trim", "flight")) != ("departure-zone", "arrival-zone"):
            raise ValueError("zones.yaml flight: the Momentum cap or trim moved; engine.Fight.flight reads the old zones")
        need(fl, "carry_cost_into_zone", "flight")
        self.carry_off = int(need(fl, "carry_cost_off_field", "flight"))
        self.carry_attach = int(need(fl, "carry_cost_attachment_step", "flight"))
        self.carry_limit = int(need(fl, "carry_limit", "flight"))                            # OQ-200
        guard(r"the zone it starts in and the zone it ends in are never crossed", zy["crossing_flag"], "the crossing flag")
        guard(r"unless they spend Momentum on quiet", zy["crossing_flag"], "quiet against the crossing flag")
        # the Stride (16-16 to 16-19)
        sd = zy["stride"]
        want = dict(toward="attention-holder", tie_break="lowest-numbered", stops_on_entering_holders_zone=True,
                    grounded=0, moves_with=["on-body", "grabbed"], leaves=["blind-spot"], harms=False, wrecks=False)
        for k, v in want.items():
            if need(sd, k, "zones.yaml stride") != v:
                raise ValueError(f"zones.yaml stride {k}: {sd[k]!r}; space.stride_route and engine.Fight.stride read {v!r}")
        bp = load("engagement/behavior-procedure.yaml")
        steps = [s_["id"] for s_ in bp["resolving_a_card"]["steps"]]
        if "stride" not in steps or not steps.index("attention") < steps.index("stride") < steps.index("choose"):
            raise ValueError(f"behavior-procedure.yaml resolving_a_card: no stride between attention and choose: {steps}")
        self.stride = {cid: int(need(c, "stride", f"size-classes.yaml {cid}")) for cid, c in self.size_classes.items()}
        for tid, blk in self.titan_blocks.items():
            if blk.get("abnormal"):
                self.stride[tid] = int(need(blk, "stride", f"titans/{tid}.yaml (an Abnormal lists its Stride)"))
        # placement (16-7) and the entry zone (16-29)
        pl = zy["placement"]
        if (need(pl, "focus_titan", "placement"), need(pl, "squad", "placement")) != ("centre", "squad_start"):
            raise ValueError("zones.yaml placement changed; engine.Fight places the Titan in the centre, the Squad at the start")
        ez = zy["entry_zone"]
        if (need(ez, "order", "entry_zone"), need(ez, "fallback", "entry_zone")) != (
                ["holds-no-soldier", "farthest-from-nearest-soldier", "lowest-numbered"], ["fewest-soldiers", "lowest-numbered"]):
            raise ValueError("zones.yaml entry_zone order changed; space.entry_zone reads the old one")
        # effects (16-30, OQ-201): none harms in this version, so no move takes an effect's harm
        self.zone_effects = {e["id"]: e for e in zy["effects"]}
        self.harming_effects = {e for e, row in self.zone_effects.items() if str(row.get("harm")) != "none"}
        if self.harming_effects:
            raise ValueError(f"zones.yaml effects {sorted(self.harming_effects)} harm; the simulator models no zone harm "
                             "(decision batch 16, 16-30; OQ-201)")
        # the ratings' zone values (anchor-ratings.yaml, ratings; 16-4, 16-13, 16-20)
        ar = load("engagement/anchor-ratings.yaml")
        self.anchors, self.carry_cost, self.sparser, self.denser = {}, {}, {}, {}
        for r in ar["ratings"]:
            rid = r["id"]
            self.anchors[rid] = int(need(r, "anchors", f"anchor-ratings.yaml {rid}"))
            self.carry_cost[rid] = int(need(r, "carry_cost", f"anchor-ratings.yaml {rid}"))
            self.sparser[rid] = need(r, "sparser", f"anchor-ratings.yaml {rid}")
            self.denser[rid] = need(r, "denser", f"anchor-ratings.yaml {rid}")
        for rid in list(self.sparser.values()) + list(self.denser.values()):
            if rid not in self.anchors:
                raise ValueError(f"anchor-ratings.yaml names {rid!r} as a sparser or denser rating; no such rating")
        bottom = [rid for rid, sp in self.sparser.items() if sp == rid]
        if len(bottom) != 1:
            raise ValueError(f"anchor-ratings.yaml: {bottom} are their own sparser; the ladder needs one bottom (Open)")
        self.open_rating = bottom[0]
        # the Sparse grace, once per zone (16-5, 16-20): the rating whose trait names the first wreck
        self.wreck_grace = {r["id"] for r in ar["ratings"]
                            if re.search(r"(?i)\bfirst (Anchor|wreck)\b", " ".join(str(r["terrain_trait"]).split()))}
        if len(self.wreck_grace) != 1:
            raise ValueError(f"anchor-ratings.yaml: the wreck grace reads on {sorted(self.wreck_grace)}; expected one rating")
        # field generation (16-6; OQ-202)
        es = load("engagement/engagement-setup.yaml")
        ids = [s_["id"] for s_ in es["steps"]]
        for sid in ("field-size", "field-rating", "zone-terrain"):
            if sid not in ids:
                raise ValueError(f"engagement-setup.yaml steps: no {sid} (decision batch 16, 16-6)")
        zt = need(es, "zone_terrain", "engagement-setup.yaml")
        if need(zt, "roll", "zone_terrain") != "D6":
            raise ValueError("engagement-setup.yaml zone_terrain: not a D6")
        self.zone_terrain = [(list(r["results"]), r["rating"]) for r in need(zt, "rows", "zone_terrain")]
        if sorted(x for res, _ in self.zone_terrain for x in res) != [1, 2, 3, 4, 5, 6] or \
                {k for _, k in self.zone_terrain} - {"sparser", "field", "denser"}:
            raise ValueError(f"engagement-setup.yaml zone_terrain rows: {self.zone_terrain}")
        guard(r"every zone but the centre and the Squad's start zone", zt["applies_to"], "which zones roll the mix")

    # ------------------------------------------------------------------ Chapter 6
    def _titans(self):
        idx = load("titans/index.yaml")
        self.titan_index = idx
        for l in idx["ladders"]:
            self.ladders[l["id"]] = list(l["rungs"])
        self.titan_blocks = {}
        for tid in list(idx["standard_titans"].values()) + [a["id"] for a in idx["abnormals"]]:
            self.titan_blocks[tid] = load(f"titans/{tid}.yaml")
        ref = self.engagement_tuning["simulation_reference_titan"]
        self.titan_blocks[ref["id"]] = ref
        self.titan_tuning = load("titans/tuning.yaml")
        # decision batch 7, 7-5: every critical-injury effect names its Injury Type (a Bite entry Bite, every other
        # harming entry Crush), the Chapter 5 reference table's included; engine.Fight passes it to dice.gain_ci
        for tid, blk in self.titan_blocks.items():
            for e in blk["behavior_table"]["entries"]:
                for eff in e["effects"]:
                    if eff["type"] == "critical-injury":
                        eff["injury_type"] = self.type_id(eff.get("injury_type"), f"{tid} {e['id']}'s critical-injury effect")
        self._entry_dice()
        self._skirmish()

    def _skirmish(self):
        """The Skirmish probe's rules (decision batch 7, 7-17; batch 8, 8-4, 8-7, 8-15): data/skirmish/skirmish.yaml and
        foes.yaml. Values are read from the YAML; the prose the probe follows is guarded by parse."""
        sk = load("skirmish/skirmish.yaml")
        fo = load("skirmish/foes.yaml")
        dm = sk["damage"]
        on_foe = dm["on_a_foe"]
        killed = {self.type_id(x, "killed_by") for x in on_foe["killed_by"]}
        out_cold = {self.type_id(x, "out_cold_by") for x in on_foe["out_cold_by"]}
        if killed & out_cold or killed | out_cold != set(self.injury_types) - {self.type_id("bite", "bite")}:
            raise ValueError(f"skirmish.yaml damage.on_a_foe: killed_by {killed} and out_cold_by {out_cold} do not split the human types")
        weapons = {}
        for w in sk["weapons"]["rows"]:
            if w["target"] not in ("engaged", "apart", "either") or w["used_with"] not in ("fight", "shoot"):
                raise ValueError(f"skirmish.yaml weapons {w['id']}: target {w['target']!r} or used_with {w['used_with']!r}")
            weapons[w["id"]] = dict(used_with=w["used_with"], type=self.type_id(w["injury_type"], w["id"]),
                                    damage=int(w["damage"]), target=w["target"])
        amb = {e["id"]: " ".join(e["text"].split()) for e in sk["ambush"]["effects"]}
        guard(r"every card of the side with the ambush comes up before every card of the other side", amb["order"], "the ambush's order")
        guard(r"every success of the attack is net", amb["no-cancelling-roll"], "the ambush's unanswered attack")
        reactions = {r["entry"]: set(r["against"]) for r in sk["reactions"]["entries"]}
        if reactions != {"block": {"fight"}, "dodge": {"fight", "shoot"}}:
            raise ValueError(f"skirmish.yaml reactions: {reactions} is not the Block and Dodge the probe applies")
        guard(r"at most one Reaction against each Foe per round", sk["reactions"]["per_foe_per_round"], "one Reaction per Foe")
        guard(r"reaches its Grit", sk["grit"]["breaks_when"], "a group's breaking")
        guard(r"each leaves at the end of the round", sk["grit"]["on_breaking"], "a broken group leaving")
        guard(r"Every Foe of the group is out of the Skirmish, has left, or has yielded",
              next(t["text"] for t in sk["ending"]["tests"] if t["id"] == "foes-gone"), "the foes-gone ending")
        guard(r"Every soldier taking part is Down or dead",
              next(t["text"] for t in sk["ending"]["tests"] if t["id"] == "no-soldier-standing"), "the no-soldier-standing ending")
        sneak = next(r for r in sk["rolls"] if r["id"] == "sneak-for-the-ambush")
        guard(r"Watch", sneak["needs"], "the ambush's Sneak need")
        steps = [s_["id"] for s_ in fo["foe_rule"]["steps"]]
        if steps != ["held", "engaged", "loaded", "empty", "close-in", "none"]:
            raise ValueError(f"foes.yaml foe_rule steps changed ({steps}); families.skirmish_trial follows the old order")
        guard(r"Take the first step whose test the Foe meets", fo["foe_rule"]["first_match"], "the foe rule's first match")
        guard(r"not Down", fo["foe_rule"]["candidates"], "the foe rule's candidates")
        if "first-human-kill" not in self.fear_triggers:
            raise ValueError("fear-rolls.yaml: no first-human-kill trigger (decision batch 7, 7-17)")
        bd = {s_["id"]: s_ for s_ in load("core/bonus-dice-sources.yaml")["sources"]}
        foes = {}
        for k in fo["foes"]:
            fw = k["fight_weapon"]
            table = None if isinstance(fw, str) else [(list(r["results"]), r["weapon"]) for r in fw["rows"]]
            night = None if isinstance(fw, str) else (fw.get("at_night") or {})
            for wid in ([fw] if isinstance(fw, str) else [w for _, w in table] + ([night["with"]] if night else [])) + \
                    ([k["shoot_weapon"]] if k.get("shoot_weapon") else []):
                if wid not in weapons:
                    raise ValueError(f"foes.yaml {k['id']}: weapon {wid} is not in skirmish.yaml weapons")
            foes[k["id"]] = dict(attack_dice=int(k["attack_dice"]), guard_dice=int(k["guard_dice"]), health=int(k["health"]),
                                 grit=int(k["grit"]), watch=int(k["watch"]), fight_weapon=fw if isinstance(fw, str) else None,
                                 fight_table=table, night=night, shoot_weapon=k.get("shoot_weapon"),
                                 group_size=(k.get("group_size") or {}).get("fixed"))
        self.skirmish = dict(
            lands_on=int(sk["attack"]["lands_on_net_successes"]),
            per_net=int(dm["amount"]["per_net_success_beyond_the_first"]),
            killed_by=killed, weapons=weapons, foes=foes,
            foe_face=int(parse(r"succeeding on (\d)", fo["row_fields"]["attack_dice"], "a Foe's Attack Dice face").group(1)),
            ambush_soldier_dice=int(bd["ambush"]["dice_per_unit"]),
            ambush_foe_dice=int(parse(r"rolls (\d+) more Attack Dice", amb["dice"], "a Foe's ambush dice").group(1)),
            riders_plain={self.type_id("cut", "cut"), self.type_id("pierce", "pierce")})

    # the rolls engine.py and families.py make, for reading a Talent's condition (_character)
    ENGINE_ROLLS = {"nape-strike", "body-part-strike", "break-free", "break-attention", "dodge", "fly", "treat-injury",
                    "field-repair", "read", "death-roll", "leap-clear", "heave"}
    # the effect types that make an entry harm or terrorize, and so carry Attack Dice (decision batch 8, 8-1)
    ATTACK_EFFECTS = {"stress", "knock-loose", "critical-injury", "grab"}

    def _titan_dice_and_hazards(self, th):
        """Decision batch 8. Attack Dice and Titan Dice (8-1, ADR-0019); the steam table (8-7); the falling Titan,
        Pinned, corpse heat, and Heave (8-9). Values are read from the YAML; the prose blocks are guarded by parse."""
        tf = load("engagement/titan-format.yaml")
        self.tiers = [k for k, v in tf["tier_rules"].items() if isinstance(v, dict) and "effects_allowed" in v and k != "thrash"]
        for cid, c in self.size_classes.items():
            if "severity" in c or set(c.get("attack_dice") or {}) != set(self.tiers):
                raise ValueError(f"size-classes.yaml {cid}: attack_dice by tier {self.tiers} in place of severity "
                                 "(decision batch 8, 8-1)")
            if not isinstance(c.get("heave"), int) or c["heave"] < 1:
                raise ValueError(f"size-classes.yaml {cid}: no Heave rating (decision batch 8, 8-9)")
        faces = sorted(tf["titan_dice"]["success_faces"])
        if not faces or faces != list(range(faces[0], 7)):
            raise ValueError(f"titan-format.yaml titan_dice: success_faces {faces} are not a face and every face above it")
        self.titan_face = faces[0]
        # 8-7: steam at the kill (On Body and Blind Spot) and at a Regeneration fill that recovers a Body Part (On Body)
        stm = th["steam"]
        rows = stm["table"]["rows"] if isinstance(stm.get("table"), dict) else stm["rows"]
        self.steam_rows = [(r["results"], r["damage"]) for r in rows]
        if any(not any(covers(res, f) for res, _ in self.steam_rows) for f in range(1, 7)):
            raise ValueError("titan-harm.yaml steam: the table does not cover 1 to 6")
        st_text = text_of(stm)
        self.steam_type = self.named_type(stm, st_text, "steam")
        for pat, what in ((r"[Oo]n[ -][Bb]ody", "steam On Body"), (r"[Bb]lind[ -][Ss]pot", "steam at Blind Spot"),
                          (r"[Rr]egeneration", "steam at a Regeneration fill")):
            parse(pat, st_text, what)
        # 8-9: the path (On Body and Blind Spot, not airborne), Leap Clear, the pin, corpse heat, and Heave
        ft = th["falling_titan"]
        ft_text = text_of(ft)
        self.leap_needs = int(parse(r"[Ll]eap[ -][Cc]lear[^.]*?needs (\d+)", ft_text, "Leap Clear's needs").group(1))
        for pat, what in ((r"airborne", "the airborne swing clear"), (r"\bCrush\b", "the pin's Crush Critical Injury"),
                          (r"\bBurn\b", "corpse heat's Burn"), (r"\btorso\b", "corpse heat at the torso for a body pin"),
                          (r"[Hh]eave rating", "the Heave rating")):
            parse(pat, ft_text, what)
        self.pin_type = self.type_id("crush", "the pin")
        self.heat_type = self.type_id("burn", "corpse heat")
        self.heave_heat = int(parse(r"(\d+) Burn damage", ft_text, "a Heave's Burn damage on a corpse").group(1))
        guard(r"\barm\b", ft_text, "a Heave's heat at an arm")
        self.heat_body_loc = "torso"      # 8-7: corpse heat lands at the torso for a body pin (guarded above)
        self.heave_heat_loc = "arm"       # 8-7: a Heave's heat at 0 Health lands at an arm, side rolled

        # ------------------------------------------------------ Frenzy (decision batch 13, 13-10 and 13-11; OQ-193)
        # A counter every Focus Titan carries: 0 when it becomes a Focus Titan, plus 1 at the frenzy end step to a
        # cap, added to the behavior roll and to nothing else. engine.Titan.roll_nb and engine.Fight.end_steps.
        fz = tf["frenzy"]
        self.frenzy_cap = int(fz["cap"])
        self.frenzy_start = int(fz["starts_at"])
        self.frenzy_rate = int(fz["rate"])
        if self.frenzy_start != 0 or self.frenzy_cap < 1 or self.frenzy_rate < 1:
            raise ValueError(f"titan-format.yaml frenzy: starts_at {self.frenzy_start} cap {self.frenzy_cap} "
                             "(decision batch 13, 13-10)")
        guard(r"By 1 at the frenzy end step of every even-numbered round of the Titan Engagement, the second, "
              r"the fourth, the sixth, and so on, for every living Focus Titan, never above the cap",
              fz["rises"], "when Frenzy rises")
        guard(r"The behavior roll, and nothing else", fz["used_by"], "what Frenzy is used by")
        guard(r"A total above the table's highest result reads as that highest result, which is 6",
              tf["behavior_table"]["result_above_the_table"], "a behavior roll above the table")
        bp = load("engagement/behavior-procedure.yaml")
        guard(r"Roll D6 and add the Titan's Frenzy as it stands now",
              next(r["text"] for r in bp["next_behavior"]["roll"] if r["id"] == "roll"), "the behavior roll")
        guard(r"the roll takes the Titan's Frenzy as it stands at the moment of the roll",
              bp["next_behavior"]["frenzy_when"], "when a behavior roll reads Frenzy")
        # ------------------------------------------------------ retargeting (decision batch 13, 13-9; OQ-192)
        # engine.Fight.choose_behavior re-evaluates the Attention Ladder over the candidates who meet the entry's
        # position_requirement before it considers the fallback, and Attention moves with it.
        ch = next(st for st in bp["resolving_a_card"]["steps"] if st["id"] == "choose")
        guard(r"if the Attention holder does not meet its position_requirement, re-evaluate the Attention Ladder over "
              r"only those of the Titan's candidates who do meet it", ch["text"], "retargeting before the fallback")
        guard(r"Only if no candidate meets the position_requirement is the behavior its fallback entry",
              ch["text"], "the fallback after retargeting")
        at = load("engagement/attention.yaml")
        rt = at["evaluation"]["retargeting"]
        guard(r"Exactly as any evaluation: the same rungs of the Titan's ladder, in order, and the same steps",
              rt["how"], "how a retargeting evaluation runs")
        guard(r"holds the Titan's Attention from that moment", rt["attention_moves"], "Attention moving on a retarget")
        guard(r"nothing is evaluated, Attention does not change", rt["none"], "a retarget with no candidate")

    def steam_damage(self, face):
        """titan-harm.yaml, steam: the damage a D6 face gives (decision batch 8, 8-7)."""
        return next(dmg for res, dmg in self.steam_rows if covers(res, face))

    def _entry_dice(self):
        """Decision batch 8, 8-1: an entry whose effects harm or terrorize carries attack_dice, a whole number of 1 or
        more; a telegraph-only entry rolls none; no entry keeps a severity. An Abnormal may list its own Heave rating."""
        for tid, blk in self.titan_blocks.items():
            if "heave" in blk and (not isinstance(blk["heave"], int) or blk["heave"] < 1):
                raise ValueError(f"{tid}: Heave rating {blk['heave']!r} (decision batch 8, 8-9)")
            # decision batch 8, 8-17: a limb pin names the Body Part of the same kind and side, by the stat block's ids
            by_kind = {}
            for p in blk["body_parts"]:
                by_kind.setdefault(p["kind"], []).append(p["id"])
            for kind in self.ci_sided:
                ids = by_kind.get(kind, [])
                if len(ids) == 2 and sorted(sd for i in ids for sd in ("left", "right") if sd in i.split("-")) != ["left", "right"]:
                    raise ValueError(f"{tid}: its {kind} Body Parts {ids} do not name a left and a right side (decision batch 8, 8-17)")
            for e in blk["behavior_table"]["entries"]:
                harms = any(eff["type"] in self.ATTACK_EFFECTS for eff in e["effects"])
                dice = e.get("attack_dice")
                if "severity" in e or (harms and not (isinstance(dice, int) and dice >= 1)) or (not harms and dice):
                    raise ValueError(f"{tid} {e['id']}: attack_dice {dice!r} for effects {[x['type'] for x in e['effects']]} "
                                     "(decision batch 8, 8-1)")

    def titan_ids(self):
        idx = self.titan_index
        return list(idx["standard_titans"].values()) + [a["id"] for a in idx["abnormals"]]

    # ------------------------------------------------------------------ Chapters 2 and 5 builds
    def _character(self):
        sq = load("character/squadmates.yaml")
        self.templates = {t["id"]: t for t in sq["templates"]}
        self.attribute_ids = list(next(iter(self.templates.values()))["attributes"].keys())
        self.talent_names = {}
        # A dice Talent's condition on an entry it names (talents.yaml, condition): the gear item the roll must use
        # for the Talent's dice to add, as Horsemanship's dodge only with the horse (decision batch 5, 5-3, OQ-121).
        self.talent_gear = {}
        # Every other condition (decision batch 7, 7-2, WP-B's list) is read into one of a closed set of readings,
        # talent_conditions[talent][entry]: grounded, comrade-died, mounted, and day-limit-death-roll on rolls the
        # engine makes; expedition, a condition the engine never meets (no Expedition is modelled); outside, a
        # condition on a roll the engine never makes (a Chapter 7 roll). A condition on an engine roll that matches no
        # reading stops the run. dice.make_template refuses a Talent whose condition no soldier applies yet.
        self.talent_conditions = {}
        readings = ((r"against a grounded Titan", "grounded"),
                    (r"after a comrade has died in this Titan Engagement", "comrade-died"),
                    (r"while mounted", "mounted"),
                    (r"when a lethal Critical Injury's day limit runs out", "day-limit-death-roll"),
                    (r"in the care window held when a day passes on an Expedition", "expedition"))
        for d in walk(load("character/talents.yaml")):
            if "id" in d and "names" in d and d.get("type") == "dice":
                self.talent_names[d["id"]] = list(d["names"])
                for entry, text in (d.get("condition") or {}).items():
                    if entry not in d["names"]:
                        raise ValueError(f"talents.yaml {d['id']}: condition on {entry}, which it does not name")
                    words = " ".join(str(text).split())
                    m = re.fullmatch(r"while mounted, with the (horse) as the ([a-z-]+)'s gear item", words)
                    if m and m.group(2) == entry:
                        self.talent_gear.setdefault(d["id"], {})[entry] = m.group(1)
                        continue
                    kind = next((k for pat, k in readings if re.fullmatch(pat, words)), None)
                    if kind is None and entry in self.ENGINE_ROLLS:
                        raise ValueError(f"talents.yaml {d['id']}: condition {text!r} on {entry} is not one the simulator reads")
                    self.talent_conditions.setdefault(d["id"], {})[entry] = kind or "outside"
        # decision batch 7, 7-2 (WP-B's handover): the rule Talents the engine applies, each value read from its trigger
        # or effect text, and every rule Talent's limit (dice.use_talent)
        rt = {d["id"]: d for d in walk(load("character/talents.yaml")) if d.get("type") == "rule" and "effect" in d}
        self.talent_limits = {tid: d.get("limit") for tid, d in rt.items()}

        def eff(tid, pat, what, key="effect"):
            return parse(pat, rt[tid][key], f"{tid}'s {what}")
        v = {"wrist-cut": int(eff("wrist-cut", r"gains (\d+) success", "extra success").group(1)),
             "shoulder-charge": int(eff("shoulder-charge", r"gains (\d+) Opening", "Opening").group(1)),
             "flare-discipline": int(eff("flare-discipline", r"for (\d+) more of its cards than its Tempo", "hold").group(1)),
             "mid-air-catch": int(eff("mid-air-catch", r"needing (\d+)", "Fly need").group(1)),
             "spare-parts": int(eff("spare-parts", r"rises by (\d+) more", "extra repair").group(1)),
             "triage": int(eff("triage", r"at least (\d+) successes", "successes", key="trigger").group(1)),
             "formation-drill": count_of(eff("formation-drill", r"up to (\w+) zones", "Help range").group(1),
                                         "formation-drill's steps"),
             "steady-heart": int(eff("steady-heart", r"Resolve counts as (\d+) higher", "Resolve").group(1))}
        for tid, pat, what in (("not-like-this", r"takes no lifted penalty", "lifted penalty"),
                               ("ready-blade", r"spends the action of your next turn", "spent action"),
                               ("close-pass", r"adds nothing to what the roll needs", "Feint need"),
                               ("mid-air-catch", r"the fall's band is low", "low band"),
                               ("tourniquet", r"from turn to engagement", "slowed limit"),
                               ("got-your-back", r"from any number of zones away", "Cover range"),
                               ("change-the-order", r"whatever zones they are in", "swap"),
                               ("gallows-humour", r"roll the D6 a second time\. Use the second total", "reroll")):
            eff(tid, pat, what)
        m = eff("steady-heart", r"for the ([a-z-]+) or ([a-z-]+) trigger", "triggers", key="trigger")
        self.steady_heart_triggers = set(m.groups())
        if self.steady_heart_triggers - set(self.fear_triggers):
            raise ValueError(f"talents.yaml steady-heart names triggers {self.steady_heart_triggers} fear-rolls.yaml lacks")
        for tid in list(v) + ["not-like-this", "ready-blade", "close-pass", "tourniquet", "got-your-back",
                              "change-the-order", "gallows-humour"]:
            if self.talent_limits[tid] not in ("none", "once_per_titan_engagement"):
                raise ValueError(f"talents.yaml {tid}: limit {self.talent_limits[tid]!r} is not one the simulator applies")
        self.talent_values = v
        self.entry_attribute = {}
        for d in walk(load("character/action-catalog.yaml")):
            if "id" in d and "attribute" in d and isinstance(d["attribute"], str):
                self.entry_attribute.setdefault(d["id"], d["attribute"])
        b = self.engagement_tuning["builds"]
        self.talent_dice_on = list(b["talent_dice_on"])
        self.builds = {}
        for bid in ("rookie", "veteran", "levi_grade"):
            spec = b[bid]
            attrs = {}
            for a in self.attribute_ids:
                attrs[a] = spec["attributes"].get(a, spec["attributes"].get("every_other_attribute"))
            items = spec["item_ratings"]
            def rating(key):
                return items.get(key, items.get("every_other_item", items.get("every_item")))
            self.builds[bid] = dict(attributes=attrs, health=spec["health"], resolve_total=spec["resolve"],
                                    scars=spec["scars"], min_stress=spec["minimum_stress"],
                                    stress=spec["stress_when_a_fight_begins"], odm=rating("odm_gear"),
                                    horse=rating("horse"), blade=rating("blade_set"),
                                    talent=spec["talent_level"])
        # decision batch 7, 7-1 (ADR-0014 as amended): the Free Build Squad, reported beside the Talent-dependent
        # targets and never tuned (attributes.yaml, creation, built, free_build, reported_squad)
        built = load("character/attributes.yaml")["creation"]["built"]
        def reported(key):
            fb = built["free_build"][key]
            shape = next(sh for sh in built["free_build"]["shapes"] if sh["id"] == fb["shape"])
            if set(fb["attributes"]) != set(self.attribute_ids) or \
                    sorted(fb["attributes"].values()) != sorted(shape["ratings"]):
                raise ValueError(f"attributes.yaml {key}: {fb['attributes']} is not the {fb['shape']} shape")
            if fb["specialty"] not in self.templates:
                raise ValueError(f"attributes.yaml {key}: {fb['specialty']} is not a Specialty with a template")
            lv = fb["talent_levels"]
            m = parse(r"the dice Talent that names the roll the soldier makes for the target: ([a-z-]+) \(([a-z-]+)\), "
                      r"([a-z-]+) \(([a-z-]+)\), ([a-z-]+) \(([a-z-]+)\), or ([a-z-]+) \(([a-z-]+)\)", lv["level_2"],
                      f"the {key} Talent 2")
            pairs = list(zip(m.groups()[0::2], m.groups()[1::2]))
            for entry, tid in pairs:
                if entry not in self.talent_names.get(tid, []):
                    raise ValueError(f"attributes.yaml {key}: {tid} is not the dice Talent that names {entry}")
            guard(r"the dice Talents that name the other three of those four entries", lv["level_1"], f"the {key} Talent 1")
            if len(pairs) != 4 or lv["total"] != 2 + (len(pairs) - 1) or fb["talent_dice_on_other_rolls"] != "none":
                raise ValueError(f"attributes.yaml {key}: the Talent levels changed ({lv}, "
                                 f"{fb['talent_dice_on_other_rolls']!r} on other rolls)")
            return dict(soldiers=fb["soldiers"], attributes=dict(fb["attributes"]), health=fb["health"],
                        resolve=fb["resolve"], specialty=fb["specialty"], talent_entries=[e for e, _ in pairs])
        self.free_build = reported("reported_squad")
        # decision batch 8, 8-3: the most fragile Free Build Squad (Strength 2 and Agility 2), beside the
        # Health-dependent targets, when attributes.yaml writes it; cases.py adds its row only then.
        # Renamed from reported_squad_health_2 in decision batch 13: Health is 2 + (Strength + Agility) / 2
        # rounded up, so the same array now reads Health 4 rather than 2.
        self.free_build_h2 = reported("reported_squad_fragile") if "reported_squad_fragile" in built["free_build"] else None
        if self.free_build_h2 is not None and self.free_build_h2["health"] != 4:
            raise ValueError("attributes.yaml reported_squad_fragile: its Health is not 4 (decision batch 13)")
        # decision batch 7, 7-11: outside an Expedition, a player with no Squadmate to promote gets a new character who
        # joins at the start of the next Titan Engagement (families.sequence_job)
        guard(r"the start of the next Titan Engagement while no Expedition is under way", sq["promotion"]["no_squadmate"]["joins"],
              "when a new character joins")

    # ------------------------------------------------------------------ Chapter 3, treatment and engagement end
    def _treatment(self):
        ti = load("harm/treat-injury.yaml")
        self.treat_entry = ti["entry"]
        self.treat_attribute = ti["attribute"]
        self.treat_needs = ti["needs"]
        self.treat_self_penalty = int(parse(r"penalty of (\d+) base dice", ti["patients"]["self"],
                                            "the self-treatment penalty").group(1))
        self.care_help_max = int(parse(r"At most (\d+) soldiers Help one roll", ti["care_windows"]["help"],
                                       "the care window's Help limit").group(1))
        cat = {d["id"]: d for d in walk(load("character/action-catalog.yaml")) if "id" in d and "kind" in d}
        if cat[self.treat_entry].get("without_gear") != "attribute_alone":
            raise ValueError("action-catalog.yaml: treat-injury without a medical kit is no longer attribute_alone")
        self.catalog = cat
        bd = {s["id"]: s for s in load("core/bonus-dice-sources.yaml")["sources"]}
        self.medical_supply_dice = bd["medical-supplies"]["dice_per_unit"]
        ss = load("gear/squad-supply.yaml")
        uses = {u["id"]: u for u in ss["medical_uses"]}
        self.care_bonus_units = int(parse(r"(\d+) medical unit", uses["care-bonus"]["spends"], "the care bonus").group(1))
        # The steps a Titan Engagement's end resolves, in order (engagement-end.yaml, steps). engine.finish
        # runs these ids in this order and stops if the list changes.
        self.end_steps = [s["id"] for s in load("harm/engagement-end.yaml")["steps"]]
        sc = load("core/stress-changes.yaml")
        red = {r["id"]: r for r in sc["reductions"]}
        gains = {g["id"]: g for g in sc["gains"]}
        self.relief_end = red["engagement-ends"]["amount"]
        self.relief_nape = red["nape-kill"]["amount"]
        self.cover_stress = gains["cover"]["amount"]
        self.min_stress_per_scar = sc["minimum"]["per_scar"]
        fr = load("gear/field-repair.yaml")
        self.care_field_repair = "one Field Repair roll" in " ".join(fr["outside_titan_engagement"]["rolls"].split())
        gr = load("mind/grief.yaml")
        amt = gr["gaining"]["amount"]
        self.grief_per_engagement = amt[0]["grief"]
        self.grief_numb = next(a["grief"] for a in amt if "Numb" in a["who"])
        dr = load("harm/death-rolls.yaml")
        m = parse(r"a (turn) or (engagement) limit that the soldier survived becomes (day)",
                  dr["outside_titan_engagement_restart"], "the limit after an outside Death Roll")
        self.limit_after_outside_roll = m.group(3)

    # ------------------------------------------------------------------ Chapter 5, Read and Call It
    def _read(self):
        rd = load("engagement/read.yaml")
        self.read_entry = rd["read"]["entry"]
        self.read_attribute = self.catalog[self.read_entry]["attribute"]
        self.read_needs = rd["read"]["needs"]
        src = parse(r"bonus-dice-sources\.yaml, ([a-z-]+)\)", rd["read"]["from_distant"], "the Read's Distant bonus").group(1)
        bd = {s["id"]: s for s in load("core/bonus-dice-sources.yaml")["sources"]}
        self.read_distant_dice = bd[src]["dice_per_unit"]
        self.read_facts = {f["id"]: list(f["for"]) for f in rd["facts"]}
        ci = rd["call_it"]
        self.call_it_successes = int(parse(r"(\d+) of the Read's successes", ci["successes_needed"], "Call It's successes").group(1))
        self.call_it_sharp = int(parse(r"With Sharp Call, (\d+)", ci["successes_needed"], "Sharp Call's successes").group(1))
        src = parse(r"bonus-dice-sources\.yaml, ([a-z-]+)\)", ci["effect"], "Call It's bonus").group(1)
        self.call_it_dice = bd[src]["dice_per_unit"]

    # ------------------------------------------------------------------ Chapter 3, Scars
    SCAR_IDS = {"the-closing-hand", "survivors-guilt", "unsteady-hands", "cannot-look-away", "numb", "reckless-blade",
                "nerves-on-edge", "fear-of-falling", "blood-on-the-blade", "carrying-their-weight", "second-guessing",
                "old-nightmare"}

    def _scars(self):
        sc = load("mind/scars.yaml")
        self.scar_max = sc["gaining"]["maximum"]
        rows = {}
        for r in sc["table"]["rows"]:
            row = dict(id=r["id"], results=list(r["results"]), pen={}, cond_pen={}, stress=0, fear_total=0,
                       fear_triggers=[], squadmate_rerolls=bool(r.get("squadmate_rerolls")))
            for e in r["effects"]:
                if e["type"] == "penalty":
                    target = row["cond_pen"] if e.get("applies_to") else row["pen"]
                    for en in e["entries"]:
                        target[en] = target.get(en, 0) + e["dice"]
                elif e["type"] == "stress-gain":
                    row["stress"] += e["amount"]
                elif e["type"] == "fear-roll-total":
                    row["fear_total"] += e["amount"]
                    m = parse(r"for the ([a-z-]+)(?: or ([a-z-]+))? trigger", r["trigger"], f"{r['id']}'s triggers")
                    row["fear_triggers"] = [x for x in m.groups() if x]
                elif e["type"] != "other":
                    raise ValueError(f"scars.yaml: effect type {e['type']} is not modelled")
            rows[r["id"]] = row
        if set(rows) != self.SCAR_IDS:
            raise ValueError(f"scars.yaml: the Scar rows changed; engine.py applies each row's trigger by id: {sorted(rows)}")
        self.scar_rows = rows
        self.scar_by_result = {res: rid for rid, r in rows.items() for res in r["results"]}

    # ------------------------------------------------------------------ Chapter 4, carrying and horses
    def _carrying_and_horses(self):
        ca = load("gear/carrying.yaml")
        self.carry_limit_add = int(parse(r"strength \+ (\d+)", ca["limit"]["formula"], "the carrying limit").group(1))
        items = {}
        for row in ca["items_counted"]:
            w = row["what"]
            key = ("spare" if "spare gas canister" in w else "blade_spare" if "Blade Set not in the handles" in w
                   else "medical_kit" if "medical kit" in w else "tool_kit" if "tool kit" in w
                   else "comrade" if "comrade" in w else None)
            if key:
                items[key] = row["items"]
        if set(items) != {"spare", "blade_spare", "medical_kit", "tool_kit", "comrade"}:
            raise ValueError(f"carrying.yaml: items_counted rows changed: {items}")
        self.carry_items = items
        self.overloaded_spends_action = "also spends their action" in " ".join(ca["overloaded"]["effect"].split())
        si = load("gear/standard-issue.yaml")
        self.specialty_items = {r["specialty"]: (r["item"], r["rating"]) for r in si["by_specialty"]["rows"]}
        self.issue_rows = {r["funding"]: r for r in si["by_funding"]}
        self.interim = si["interim_issue"]

    # ------------------------------------------------------------------ Chapter 5, round, Wings, swaps, setup
    def _round_and_setup(self):
        rd = load("engagement/round.yaml")
        self.round_steps = [s["id"] for s in rd["round_steps"]]
        # decision batch 13, 13-10: the frenzy end step, between regeneration and background-clocks
        self.round_end_steps = [s["id"] for s in rd["end_steps"]]
        for need in ("regeneration", "frenzy", "background-clocks"):
            if need not in self.round_end_steps:
                raise ValueError(f"round.yaml: end step {need} is gone")
        if not (self.round_end_steps.index("regeneration") < self.round_end_steps.index("frenzy")
                < self.round_end_steps.index("background-clocks")):
            raise ValueError("round.yaml end_steps: frenzy no longer sits between regeneration and background-clocks "
                             "(decision batch 13, 13-10); engine.Fight.end_steps follows the old order")
        guard(r"Raise every living Focus Titan's Frenzy by 1, never above its cap",
              next(s["text"] for s in rd["end_steps"] if s["id"] == "frenzy"), "the frenzy end step")
        for need in ("wings", "deal", "swap", "play", "end"):
            if need not in self.round_steps:
                raise ValueError(f"round.yaml: round step {need} is gone")
        sq = load("character/squadmates.yaml")
        self.wing_max = sq["wing"]["max_squadmates_per_wing"]
        self.squadmate_pushes = next(r for r in sq["rules_applicability"] if r["rule"] == "Push")["applies"]
        self.squadmate_covers = next(r for r in sq["rules_applicability"]
                                     if r["rule"].startswith("Cover (as the Covering"))["applies"]
        m = parse(r"since the previous wings step, a soldier died, left the Titan Engagement, became Down, or became "
                  r"Grabbed, or a Focus Titan entered or died", rd["wings"]["when"], "when Wings may change")
        self.tracker_moments = rd["gm_tracker"]["per_round_order"]
        es = self.setup

        def weights(table, key):
            out = {}
            for row in es[table]["rows"]:
                out[row[key]] = out.get(row[key], 0) + len(row["results"]) / 6
            return out
        self.setup_anchor = weights("anchor_rating", "anchor_rating")
        self.setup_size = weights("size_class", "size_class")
        self.setup_medium_abnormal = weights("medium_abnormal", "titan")
        self.setup_background = [(len(r["results"]) / 6, list(r["clocks"])) for r in es["background_titans"]["rows"]]
        for rid in self.setup_anchor:
            if rid not in self.ratings:
                raise ValueError(f"engagement-setup.yaml names Anchor Rating {rid}, which anchor-ratings.yaml lacks")

        # the retreat clock and the retreat (decision batch 5, 5-1 and 5-10; OQ-119, OQ-126)
        self.retreat_clock = int(es["retreat_clock"])
        bt = load("engagement/background-titans.yaml")
        ticks = {t["id"]: " ".join(t["text"].split()) for t in bt["ticks"]["rows"]}
        guard(r"after every Background Titan's clock has filled and every full clock has resolved \(full_clock\), fill "
              r"1 segment of the retreat clock", ticks["retreat-clock"], "when the retreat clock fills")
        guard(r"A flare never fills the retreat clock", ticks["flare"], "the flare and the retreat clock")
        # decision batch 6, 6-1 (OQ-134): a retreat stops the Background Titans' clocks and the retreat clock only;
        # engine.Fight.end_steps fills the Regeneration clock every round, retreat or not
        guard(r"During a retreat no Background Titan's clock fills and the retreat clock does not fill\. A Focus Titan's "
              r"Regeneration clock still fills at the regeneration end step", bt["ticks"]["stopped"],
              "which clocks a retreat stops")
        guard(r"A retreat does not stop it", load("engagement/titan-harm.yaml")["regeneration"]["tick"],
              "the Regeneration clock during a retreat")
        guard(r"or when the retreat clock is full", bt["retreat"]["starts"], "the retreat clock starting a retreat")
        eff = {e["id"]: " ".join(e["text"].split()) for e in bt["retreat"]["effects"]}
        for need in ("no-entries", "moves", "order", "no-return", "actions"):
            if need not in eff:
                raise ValueError(f"background-titans.yaml retreat effects: {need} is gone")
        guard(r"their move comes before their action", eff["order"], "the retreat's order")
        # decision batch 5b, 5-15: engine.Fight.can_nape and nape_strike refuse a Nape strike during a retreat
        guard(r"no Nape strike is made during a retreat, on a soldier's own turn or through Hook and Cut", eff["actions"],
              "no Nape strike in a retreat")
        guard(r"A stay-with-a-comrade move \(option 4\) comes after the action taken for that comrade", eff["order"],
              "the retreat's option 4 exception")
        guard(r"A move on a turn whose action is lift-comrade comes after the lift", eff["order"], "the retreat's lift exception")
        m = parse(r"one of these actions for that comrade: (treat-injury); or, for a Grabbed comrade, (break-free) on their "
                  r"behalf with Pry Loose, a (body-part-strike) against the holding arm, or (break-attention) against the "
                  r"holding Titan", eff["moves"], "the actions option 4 follows")
        self.retreat_stay_actions = set(m.groups())
        # decision batch 8, 8-21: option 4 also follows a Heave or a strike on the pinning Body Part for a Pinned comrade
        if re.search(r"\bpinned\b", eff["moves"], re.I) and re.search(r"\bheave\b", eff["moves"], re.I):
            self.retreat_stay_actions |= {"heave", "body-part-strike"}
        guard(r"Out: one step their move can make, the first of these that applies", eff["moves"], "retreat option 1")
        guard(r"whatever body stands in that zone", eff["moves"], "retreat option 2 from any edge zone (16-27)")
        guard(r"letting go if they cannot make one", eff["moves"], "the retreat's letting go")
        # decision batch 8, 8-32 and 8-36: engine.Fight.fallen_options_closed follows these sentences. It closes the
        # stays once the Focus Titan is dead, which covers both: with one Focus Titan and no Background Titans, a
        # corpse (and so a pin under one) exists only after that Titan dies, and no Nape strike is made in a retreat.
        guard(r"The stay limit: options 3 and 4 for a comrade the limit covers are open only on the retreat's first "
              r"rounds, as many as its retreat clock has segments, counted from the round after the one in which the "
              r"retreat began", eff["moves"], "the retreat's stay limit")
        guard(r"a comrade Pinned under a corpse, in every retreat, whether or not a Focus Titan is alive", eff["moves"],
              "the stay limit per pin under a corpse (8-36)")
        guard(r"every comrade, whether Pinned, Down, or Grabbed, while no Focus Titan is alive", eff["moves"],
              "the stay limit on every comrade (8-32)")
        fl = load("engagement/engagement-flow.yaml")["ending"]
        guard(r"A Titan Engagement always ends", fl["always_ends"], "the retreat clock ending every Titan Engagement")
        guard(r"every soldier who still holds a Position in it dies, left to the Titans", fl["left_behind"], "left behind")
        pos = load("engagement/positions.yaml")
        guard(r"free, in an edge zone that holds no Focus Titan and no corpse, and is not Down, Grabbed, Pinned, or carried\. "
              r"During a retreat the edge zone's condition does not apply", pos["leaving"]["who"], "who can leave (16-26)")
        guard(r"except during a retreat", pos["leaving"]["returning"], "no return during a retreat")
        guard(r"holds on-body or blind-spot relative to a Focus Titan and is not Grabbed or carried",
              pos["moves"]["letting_go"]["who"], "who can let go")
        ee = load("harm/engagement-end.yaml")
        guard(r"two soldiers who have both left the Titan Engagement count as holding the same Position. A soldier who has "
              r"left never counts as holding the same Position as, or one step from, a soldier who still holds a Position",
              ee["soldiers_who_left"]["same_position"], "the Position test for soldiers who left")
        guard(r"Where a step compares two soldiers, it reads their zones", ee["positions_read"], "the end steps' zones (16-24)")

    # ------------------------------------------------------------------ case dimensions stated in the tuning files
    def _case_dimensions(self):
        t5 = self.engagement_tuning
        t6 = self.titan_tuning
        # "No kill" is the share of fights that end with the Focus Titan alive, under the retreat clock (decision batch
        # 5, 5-10); no column or band names a round horizon any more.
        if "no_kill" not in t5["prepared_squad_kill"]["columns"] or "no_kill" not in t6["targets"]["large"]["at_the_reference_start"]:
            raise ValueError("tuning files: the no_kill column or the Large band is gone")
        for k in list(t5["prepared_squad_kill"]["columns"]) + list(t6["targets"]["large"]["at_the_reference_start"]):
            if re.search(r"no_kill_in_\d+_rounds", k):
                raise ValueError(f"tuning files: {k} names a round horizon, which decision batch 5 removed")
        # Every target's tolerance (ADR-0014, as amended in decision batch 5, 5-11, OQ-127), from the tuning files,
        # cross-checked against data/titans/tuning.yaml (adr_0014_targets_quoted, bands).
        tol5 = {"prepared_squad_kill": t5["prepared_squad_kill"]["tolerance"], "solo_nape": t5["solo_nape"]["tolerance"],
                "grab": t5["grab"]["tolerance"], "gas": t5["gas"]["tolerance"]}
        self.tolerances = {
            "median_kill_round": tolerance_of(tol5["prepared_squad_kill"]["median_kill_round"], "prepared_squad_kill"),
            "rookie_fresh_cut": tolerance_of(tol5["solo_nape"]["rookie_fresh_cut"], "solo_nape, rookie_fresh_cut"),
            "levi_grade": tolerance_of(tol5["solo_nape"]["levi_grade"], "solo_nape, levi_grade"),
            "grab_alone": tolerance_of(tol5["grab"]["alone"], "grab, alone"),
            "grab_every_cell": tolerance_of(tol5["grab"]["every_cell"], "grab, every_cell"),
            "gas_standard": tolerance_of(tol5["gas"]["median_rounds"], "gas, median_rounds"),
            "gas_pushed": tolerance_of(tol5["gas"]["median_rounds_pushing_every_round"], "gas, pushing every round"),
        }
        cell_keys = [k for k in tol5["grab"] if re.fullmatch(r"stress_\d+_grief_\d+", k)]
        if len(cell_keys) != 1:
            raise ValueError(f"tuning.yaml grab.tolerance: expected one named cell, got {cell_keys}")
        m = re.fullmatch(r"stress_(\d+)_grief_(\d+)", cell_keys[0])
        self.grab_named_cell = (int(m.group(1)), int(m.group(2)))
        self.tolerances["grab_named_cell"] = tolerance_of(tol5["grab"][cell_keys[0]], f"grab, {cell_keys[0]}")
        bands6 = t6["targets"]["adr_0014_targets_quoted"]["bands"]
        for key6, key5 in (("rookie_fresh_cut", "rookie_fresh_cut"), ("levi_grade", "levi_grade")):
            if tolerance_of(bands6["lone_strike"][key6], key6) != self.tolerances[key5]:
                raise ValueError(f"the tuning files disagree on the {key6} tolerance")
        for key6, key5 in (("alone", "grab_alone"), ("every_cell", "grab_every_cell"), (cell_keys[0], "grab_named_cell")):
            if tolerance_of(bands6["grab"][key6], key6) != self.tolerances[key5]:
                raise ValueError(f"the tuning files disagree on the Grab {key6} tolerance")
        if tolerance_of(bands6["prepared_squad"], "prepared_squad")["value"] != self.tolerances["median_kill_round"]["value"]:
            raise ValueError("the tuning files disagree on the prepared-Squad median")
        m = parse(r"past a band's edge by at most (\w+) standard errors is re-run on a second seed and judged on the figure "
                  r"pooled over both runs", bands6["second_seed"], "the second-seed rule for targets")
        self.target_standard_errors = count_of(m.group(1), "the second-seed rule's standard errors")
        guard(r"Each range or limit in targets is its own band, read exactly, and a median is read exactly", bands6["per_table"],
              "the per-table bands' reading")
        self.fights_per_case = thousands(t5["prepared_squad_kill"]["fights_per_case"], "fights per case")
        # simulator review round 3, Minor 7: the safety cap and the baseline and template roles, read from their text
        model = t5["prepared_squad_kill"]["model"]
        self.safety_cap = int(parse(r"max_rounds is a safety cap of (\d+) rounds", model["retreat"],
                                    "the safety cap").group(1))
        files_cap = int(parse(r"a safety cap of (\d+) that no fight should reach", " ".join(str(f) for f in
                              t5["probes"]["files"]) if isinstance(t5["probes"]["files"], list) else
                              str(t5["probes"]["files"]), "the probes' safety cap").group(1))
        if files_cap != self.safety_cap:
            raise ValueError("data/engagement/tuning.yaml: the probes and the retreat model name different safety caps")
        m = parse(r"starting at distant: (\w+) cutters and (\w+) strikers", model["squad"], "the baseline roles")
        self.baseline_roles = (["cutter"] * count_of(m.group(1), "cutters")
                               + ["striker"] * count_of(m.group(2), "strikers"))
        m = parse(r"uses the (\w+) and (\w+) templates as strikers and the (\w+) and (\w+) as cutters", model["squad"],
                  "the template roles")
        self.template_roles = [(m.group(1).lower(), "striker"), (m.group(2).lower(), "striker"),
                               (m.group(3).lower(), "cutter"), (m.group(4).lower(), "cutter")]
        # Chapter 5's rows that change one Titan value: prepared_squad_kill, medium_attack_dice (decision batch 8, 8-1,
        # in place of medium_severity) and alternatives_rejected. Each row's values are read from its case text, so a
        # relabelled row runs its new values or stops the run.
        tiers = list(self.size_classes["medium"]["attack_dice"])
        self.ch5_value_rows = []
        for row in t5["prepared_squad_kill"]["medium_attack_dice"]:
            vals = [int(x) for x in parse(r"^Attack Dice (\d+), (\d+), (\d+)$", row["case"], "a medium_attack_dice row").groups()]
            if len(vals) != len(tiers):
                raise ValueError(f"size-classes.yaml attack_dice tiers {tiers} and the row {row['case']!r} disagree")
            self.ch5_value_rows.append(("medium_attack_dice", row["case"], {"dice": dict(zip(tiers, vals))},
                                        "dice" + "-".join(map(str, vals))))
        ref_size = self.engagement_tuning["simulation_reference_titan"]["size_class"]
        for row in t5["prepared_squad_kill"]["alternatives_rejected"]:
            m = parse(r"^([A-Z][a-z]+), ([A-Z][A-Za-z ]+?) (\d+)(?: \([^)]*\))?$", row["case"], "an alternatives_rejected row")
            size = m.group(1).lower()
            if size not in self.size_classes:
                raise ValueError(f"alternatives_rejected row {row['case']!r}: {size} is not a Size Class")
            stem = m.group(2).lower().replace(" ", "_")
            fields = [k for k, v in self.size_classes[size].items() if k.startswith(stem) and isinstance(v, int)]
            if len(fields) != 1:
                raise ValueError(f"alternatives_rejected row {row['case']!r}: {m.group(2)} names no one Size Class value")
            over = {"titan": {fields[0]: int(m.group(3))}}
            short = {"regeneration_clock": "regen", "nape_depth": "nd"}.get(fields[0], fields[0])
            key = short + m.group(3)
            if size != ref_size:
                over["size_class"] = size
                key = f"{size}_{key}"
            self.ch5_value_rows.append(("alternatives_rejected", row["case"], over, key))
        ab = t6["targets"]["abnormals"]
        self.bar_fights = ab["sampling"]["fights_per_row"]
        self.bar_standard_errors = ab["sampling"]["standard_errors"]
        # Rows run with their twins and reported beside the bar, never judged by it (round 3 retune, R7).
        self.bar_reported_rows = tuple(ab.get("reported_rows", ()))
        bar_labels = {r["abnormal"] for r in load("titans/probe-figures.yaml")["bar"]["rows"]}
        for label in self.bar_reported_rows:
            if label not in bar_labels:
                raise ValueError(f"tuning.yaml abnormals reported_rows: {label!r} is no bar row of "
                                 "data/titans/probe-figures.yaml (bar, rows)")
        self.bar_median_min = int(parse(r"median kill round is (\d+) or later", " ".join(ab["not_trivial"]),
                                        "the bar's median floor").group(1))
        self.bar_median_max = int(parse(r"median kill round is (\d+) or sooner", " ".join(ab["winnable"]),
                                        "the bar's median ceiling").group(1))
        # the fresh lone cut
        sn = t5["solo_nape"]
        self.solo_stresses = [int(parse(r"start_stress_(\d+)$", c, "a fresh-cut column").group(1)) for c in sn["columns"]]
        self.solo_attempts = count_of(parse(r"up to (\w+) times until it succeeds", sn["model"], "Break Attention attempts").group(1),
                                      "Break Attention attempts")
        self.solo_trials = thousands(parse(r"([\d,]+) trials per cell", sn["model"], "fresh-cut trials").group(0), "fresh-cut trials")
        self.solo_band = tuple(float(x) for x in parse(r"between ([\d.]+)% and ([\d.]+)%", sn["target"], "the lone band").groups())
        if (self.tolerances["rookie_fresh_cut"]["lo"], self.tolerances["rookie_fresh_cut"]["hi"]) != self.solo_band:
            raise ValueError("tuning.yaml solo_nape: the target's band and its tolerance disagree")
        self.lone_trials = thousands(parse(r"([\d,]+) lone fights per row", sn["lone_fight"]["probe"], "lone trials").group(0), "lone trials")
        # the Grab
        g = t5["grab"]
        self.grab_cells = []
        for c in g["comrades_close"]["cells"]:
            m = parse(r"^stress_(\d+)_grief_(\d+)$", c, "a Grab cell")
            self.grab_cells.append((int(m.group(1)), int(m.group(2))))
        self.grab_alone_trials = thousands(parse(r"([\d,]+) per row", g["lone"]["trials"], "alone Grab trials").group(0), "alone Grab trials")
        self.grab_templates_trials = thousands(parse(r"\(([\d,]+) for templates_alone\)", g["lone"]["trials"], "template Grab trials").group(1), "template Grab trials")
        self.grab_cell_trials = thousands(g["comrades_close"]["trials"], "Grab cell trials")
        hr = g["health_reports"]
        m = parse(r"(\w+) at Health (\d) to (\d), and (\w+) at Health (\d)", hr["model"], "the Health reports' earlier injuries")
        self.health_earlier = {}
        for h in range(int(m.group(2)), int(m.group(3)) + 1):
            self.health_earlier[h] = count_of(m.group(1), "earlier injuries")
        self.health_earlier[int(m.group(5))] = count_of(m.group(4), "earlier injuries")
        m = parse(r"one comrade at Stress (\d) with Grief (\d)", hr["model"], "the Health reports' comrade")
        self.health_comrade = (int(m.group(1)), int(m.group(2)))
        self.health_rows = {int(parse(r"^health_(\d+)$", k, "a Health row").group(1)): v
                            for k, v in hr["with_earlier_injuries"].items()}
        self.health_fresh = {int(parse(r"^health_(\d+)$", k, "a Health row").group(1)): v
                             for k, v in hr["fresh_victim_lone"].items()}
        if set(self.health_rows) != set(self.health_earlier):
            raise ValueError("tuning.yaml grab.health_reports: the rows and the earlier-injury text disagree")
        self.grab_templates_alone = []
        for row in g["lone"]["templates_alone"]:
            tid = parse(r"^(\w+) \(", row["case"], "a template Grab row").group(1).lower()
            if tid not in self.templates:
                raise ValueError(f"tuning.yaml grab.templates_alone names {tid}, not a template")
            self.grab_templates_alone.append((tid, row["death"]))
        m = parse(r"Rescuers: Rookies with Strength (\d)", g["model"], "the rescuer's Strength")
        self.rescuer_strength = int(m.group(1))
        # the Jam test
        jt = t5["jam_test"]
        self.jam_rounds = count_of(parse(r"for (\w+) rounds", jt["model"], "the Jam test's rounds").group(1), "Jam rounds")
        self.jam_trials = thousands(parse(r"([\d,]+) fights per cell", jt["model"], "Jam trials").group(0), "Jam trials")
        self.jam_columns = []
        for c in jt["columns"]:
            m = parse(r"^help_(\d+)(_covered)?$", c, "a Jam column")
            self.jam_columns.append((c, int(m.group(1)), bool(m.group(2))))
        self.jam_tiers = [k for k in jt["tiers"] if k in jt]
        jam_target = next(x for x in t6["targets"]["every_standard_table"] if "Jam test" in x)
        m = parse(r"stays under ([a-z0-9. %]+?), for (\w+) and for (\w+) Titans", jam_target, "the Jam limit")
        self.jam_limit = m.group(1)
        self.jam_limit_value = fraction_of(m.group(1), "the Jam limit")
        self.jam_titan_counts = [count_of(m.group(2), "the Jam test's Titans"), count_of(m.group(3), "the Jam test's Titans")]
        # data/titans/tuning.yaml, simulator_cases: the mixed pairs of the Jam test
        mixed = next((x for x in t6["simulator_cases"] if "in the Jam test" in x), "")
        guard(r"Two Focus Titans of different Size Classes in the Jam test, and a standard Titan with the Abnormal", mixed,
              "the Jam test's mixed pairs")
        std = self.titan_index["standard_titans"]
        by_size = list(std.items())
        self.jam_mixed_pairs = [(a, b) for (sa, a), (sb, b) in itertools.combinations(by_size, 2) if sa != sb]
        self.jam_mixed_pairs += [(t, ab["id"]) for t in std.values() for ab in self.titan_index["abnormals"]]
        # gas
        gas = t5["gas"]
        self.gas_trials = thousands(parse(r"([\d,]+) canisters per case", gas["figures"], "gas trials").group(0), "gas trials")
        self.gas_target = [(int(a), float(b)) for a, b in re.findall(r"median (\d+), mean ([\d.]+)", gas["target"])]
        if len(self.gas_target) != 2:
            raise ValueError("tuning.yaml gas.target: expected two medians with means")
        if [self.tolerances["gas_standard"]["value"], self.tolerances["gas_pushed"]["value"]] != [m_ for m_, _ in self.gas_target]:
            raise ValueError("tuning.yaml gas: the target's medians and its tolerance disagree")
        # the dodges reported beside the targets
        rb = t5["reported_beside_targets"]
        self.dodge_reports = {}
        for key, tid in (("rookie_dodge", None), ("flier_template_dodge", "flier")):
            # decision batch 8, 8-1: the historical figures read "against a fixed need before Attack Dice: needing 3
            # successes 20.7%, needing 2 49.7%"; families.dodge_job measures them at that need, beside the dice rows
            guard(r"against a fixed need before Attack Dice", rb[key], f"{key}'s fixed-need reading")
            pairs = [(int(n), float(p)) for n, p in re.findall(r"needing (\d+)(?: successes)? ([\d.]+)%", rb[key])]
            st = int(parse(r"Stress (\d)", rb[key], f"{key}'s Stress").group(1))
            self.dodge_reports[key] = dict(template=tid, stress=st, figures=pairs,
                                           responses="without Stress Responses" not in rb[key])


R = Rules()

# The four Position ids of data/engagement/anchor-ratings.yaml (positions), named for the procedures in
# engine.py and policy.py. A renamed or added Position stops the run here.
D, IR, OB, BS = "distant", "in-reach", "on-body", "blind-spot"
if set(R.positions) != {D, IR, OB, BS}:
    raise ValueError(f"anchor-ratings.yaml positions changed: {R.positions}")
# data/gear/odm-gear.yaml, strikes: a Nape strike, and a Body Part strike made from these Positions, need
# working ODM Gear unless the Titan is grounded.
m = parse(r"made from ([A-Z][a-z]+ [A-Z][a-z]+) or ([A-Z][a-z]+ [A-Z][a-z]+), need",
          load("gear/odm-gear.yaml")["strikes"]["rule"], "where strikes need ODM Gear")
ODM_STRIKE_POSITIONS = {p for p in R.positions if pos_name(p) in m.groups()}
_crush = next(s for s in load("engagement/grab.yaml")["grab_lands"]["steps"] if s["id"] == "crush")
m = parse(r"gains an? ([a-z]+)(?: [A-Z][a-z]+)? Critical Injury with cannot_be_lethal true", _crush["text"],
          "the Grab's crush")
GRAB_CRUSH_LOCATION = m.group(1)
# decision batch 7, 7-5 (ADR-0015 as amended): the crush is Crush
GRAB_CRUSH_TYPE = R.named_type(_crush, _crush["text"], "the Grab's crush")
# decision batch 8, 8-9: Leap Clear (Agility, not an action) and Heave (Strength, an action) are Catalog entries
for _eid, _attr in (("leap-clear", "agility"), ("heave", "strength")):
    if R.entry_attribute.get(_eid) != _attr:
        raise ValueError(f"action-catalog.yaml: {_eid} rolls {R.entry_attribute.get(_eid)!r}, not {_attr} (decision batch 8, 8-9)")
# decision batch 8, 8-2: the net-success rider, a gaining step of critical-injuries.yaml (dice.gain_ci, rider), on
# critical-injury effects only; the Grab lands on its lands_on net successes and takes no rider (grab.yaml, grab_lands)
_gaining = load("harm/critical-injuries.yaml")["gaining"]
if "net-success-rider" not in [s_["id"] for s_ in _gaining["steps"]]:
    raise ValueError("critical-injuries.yaml gaining: no net-success-rider step (decision batch 8, 8-2)")
RIDER_PER_NET = int(_gaining["net_success_rider"]["add_per_net_success_beyond_first"])
_lands = load("engagement/grab.yaml")["grab_lands"]
if str(_lands.get("rider")) != "none":
    raise ValueError(f"grab.yaml grab_lands: rider {_lands.get('rider')!r}; the Grab takes none (decision batch 8, 8-2)")
GRAB_LANDS_ON = int(_lands["lands_on"])
# decision batch 8: the falling Titan's path (8-9), steam at the kill and at a Regeneration fill (8-7), and the
# Positions a Heave is made from (8-9). Rules.R._titan_dice_and_hazards guards the blocks that name them.
FALL_PATH = (OB, BS)
STEAM_AT_KILL = (OB, BS)
STEAM_AT_REGEN = (OB,)
HEAVE_FROM = (IR, OB)
