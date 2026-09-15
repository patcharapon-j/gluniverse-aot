"""Chapter 6 Titan data: load each Titan from data/titans/, check it against Chapter 5's format and the
Chapter 6 constraints, and report the Behavior Table procedure's move-up shares for every state.

Run from this directory: `uv run --with pyyaml python titans.py`. It exits 1 if any check fails.

Sources read (never copied into this script):
- data/engagement/titan-format.yaml (entry_fields, tier_rules)
- data/engagement/size-classes.yaml (classes)
- data/engagement/attention.yaml (tests, ladders)
- data/engagement/behavior-procedure.yaml (the move-up rule it implements)
- data/titans/*.yaml
It also lints each entry's flavour text: a word that names one of the Titan's own Body Part kinds
(a hand, a leg, an eye) fails the check unless the entry lists that kind in body_parts_used, so a
Broken part never leaves an entry whose text still uses it. The text also may not show the Titan seeing a
holder its Position requirement allows at Blind Spot, or touching one it allows at Distant (POSITION_PHRASES),
and an entry that uses a leg lists both legs, because one Broken leg grounds the Titan (OQ-109). Every
ladder, the standard one included, must begin with hooked-into-its-body and end with nearest
(data/engagement/attention.yaml, abnormal_ladder_format, rules; decision batch 4b, 4b-1).
The constraints come from docs/rules/DECISIONS-2026-09-14.md, "Constraints on the undrafted Phase 1
chapters", Chapter 6.
"""
import itertools
import os
import re
import sys
from collections import Counter

import yaml

sys.dont_write_bytecode = True

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
POSITIONS = ["distant", "in-reach", "on-body", "blind-spot"]
TIER_OF_RESULT = {1: "terrorize", 2: "terrorize", 3: "control", 4: "control", 5: "kill", 6: "kill"}
HARMING = {"critical-injury", "grab"}
# Effects that make an entry roll Attack Dice; an entry whose only effect is telegraph rolls none
# (data/engagement/titan-format.yaml, entry_fields, attack_dice; decision batch 8, 8-1).
ROLLING = {"stress", "knock-loose", "critical-injury", "grab"}
# Decisions file, Chapter 6 constraints, "Abnormals": the Size Class rows' range.
ABNORMAL_RANGE = {"tempo": (1, 2), "nape_depth": (3, 5), "regeneration_clock": (2, 4),
                  "toughness": (1, 3), "attack_dice": (3, 12)}   # Attack Dice: decision batch 8, 8-1
STANDARD_PARTS = [("eyes", "eyes"), ("left-arm", "arm"), ("right-arm", "arm"),
                  ("left-leg", "leg"), ("right-leg", "leg")]
# Words that name a Titan's own Body Part of each kind in an entry's text. A word within two words
# after a human's possessive ("the soldier's legs") names that person's body, not the Titan's.
PART_WORDS = {
    "arm": {"arm", "arms", "hand", "hands", "finger", "fingers", "fist", "fists", "palm", "palms"},
    "leg": {"leg", "legs", "foot", "feet", "knee", "knees", "heel", "heels", "ankle", "ankles", "toe", "toes"},
    "eyes": {"eye", "eyes"},
}
HUMAN_OWNERS = {"soldier's", "soldiers'", "rider's", "person's"}
# Phrases that show the Titan seeing the soldier, or touching them. An entry whose Position requirement
# includes blind-spot (out of the Titan's sight, glossary) cannot show it seeing the soldier, and one whose
# requirement includes distant cannot show it touching them (Chapter 6 review round 2, Minor 9).
POSITION_PHRASES = {
    "blind-spot": ("sight", "stares", "looks at", "turns its head", "turns its whole head", "face fills",
                   "snaps round to"),
    "distant": ("touch", "close enough to", "so close"),
}


def load(*parts):
    with open(os.path.join(ROOT, *parts)) as fh:
        return yaml.safe_load(fh)


FORMAT = load("data", "engagement", "titan-format.yaml")
SIZES = {c["id"]: c for c in load("data", "engagement", "size-classes.yaml")["classes"]}
ATTENTION = load("data", "engagement", "attention.yaml")
TESTS = {t["id"]: t for t in ATTENTION["tests"]}
TITAN_INDEX = load("data", "titans", "index.yaml")
LADDERS = {l["id"]: l for l in ATTENTION["ladders"]}
LADDERS.update({l["id"]: l for l in TITAN_INDEX["ladders"]})


def titan_ids():
    ids = list(TITAN_INDEX["standard_titans"].values())
    ids += [a["id"] for a in TITAN_INDEX["abnormals"]]
    return ids


def load_titan(tid):
    """A Titan from data/titans/, or, for the id reference-medium, Chapter 5's simulation reference
    Titan (data/engagement/tuning.yaml, simulation_reference_titan), used only to check that
    fight6.py reproduces Chapter 5's fight.py figures."""
    if tid == "reference-medium":
        return load("data", "engagement", "tuning.yaml")["simulation_reference_titan"]
    return load("data", "titans", f"{tid}.yaml")


def entries(t):
    return t["behavior_table"]["entries"]


def by_id(t):
    return {e["id"]: e for e in entries(t)}


def by_result(t):
    out = {}
    for e in entries(t):
        for r in e["results"]:
            out[r] = e["id"]
    return out


def rungs(t):
    return LADDERS[t["attention_ladder"]]["rungs"]


def ladder_format_problems(lad):
    """The ladder format (data/engagement/attention.yaml, abnormal_ladder_format, rules), checked on every
    ladder, the standard one included: each rung is on the closed tests list, the first rung is
    hooked-into-its-body, so a Nape striker who falls short draws the Titan's next behavior on every ladder
    (ADR-0010, as amended in decision batch 4b; decision batch 4b, 4b-1), and the last rung is nearest."""
    p = []
    rs = lad["rungs"]
    for r in rs:
        if r not in TESTS:
            p.append(f"ladder {lad['id']} rung {r} is not on the closed tests list")
    if not rs or rs[0] != "hooked-into-its-body":
        p.append(f"ladder {lad['id']} does not begin with hooked-into-its-body")
    if not rs or rs[-1] != "nearest":
        p.append(f"ladder {lad['id']} does not end with nearest")
    return p


def kind_counts(t):
    return Counter(p["kind"] for p in t["body_parts"])


def parts_ok(entry, unbroken):
    need = Counter(entry["body_parts_used"])
    return all(unbroken.get(k, 0) >= n for k, n in need.items())


def is_lethal(entry):
    return any(e["type"] == "critical-injury" and not e["cannot_be_lethal"] for e in entry["effects"])


def is_grab(entry):
    return any(e["type"] == "grab" for e in entry["effects"])


def text_part_kinds(entry):
    """The Body Part kinds of the Titan that an entry's text names (PART_WORDS)."""
    words = re.findall(r"[a-z']+", entry["text"].lower())
    found = set()
    for i, w in enumerate(words):
        for kind, vocab in PART_WORDS.items():
            if w in vocab and not HUMAN_OWNERS & set(words[max(0, i - 2):i]):
                found.add(kind)
    return found


# ------------------------------------------------------------------ checks
def validate(t):
    """Returns a list of problems (empty when the Titan passes)."""
    p = []
    tid = t["id"]
    sc = SIZES.get(t["size_class"])
    if sc is None:
        return [f"{tid}: unknown size_class {t['size_class']}"]
    ents = entries(t)
    ids = by_id(t)
    # stat block fields
    for f in FORMAT["stat_block"]["fields"]:
        if f not in t:
            p.append(f"{tid}: stat block lacks {f}")
    if t["attention_ladder"] not in LADDERS:
        p.append(f"{tid}: unknown ladder {t['attention_ladder']}")
    # standard values
    if not t["abnormal"]:
        for key in ("tempo", "nape_depth", "regeneration_clock"):
            if t[key] != sc[key]:
                p.append(f"{tid}: {key} {t[key]} differs from the {sc['id']} row {sc[key]}")
        got = [(b["id"], b["kind"]) for b in t["body_parts"]]
        if got != STANDARD_PARTS:
            p.append(f"{tid}: body parts {got} are not the five standard parts in order")
        for b in t["body_parts"]:
            if b["toughness"] != sc["toughness"][b["kind"]]:
                p.append(f"{tid}: {b['id']} toughness {b['toughness']} differs from the Size Class row")
        if t["attention_ladder"] != "standard":
            p.append(f"{tid}: a standard Titan uses the standard ladder")
    else:
        for key in ("tempo", "nape_depth", "regeneration_clock"):
            lo, hi = ABNORMAL_RANGE[key]
            if not lo <= t[key] <= hi:
                p.append(f"{tid}: {key} {t[key]} outside {lo} to {hi}")
        for b in t["body_parts"]:
            lo, hi = ABNORMAL_RANGE["toughness"]
            if not lo <= b["toughness"] <= hi:
                p.append(f"{tid}: {b['id']} toughness outside {lo} to {hi}")
            if b["kind"] not in ("eyes", "arm", "leg"):
                p.append(f"{tid}: {b['id']} has unknown kind {b['kind']}")
    lad = LADDERS.get(t["attention_ladder"])
    if lad:
        p += [f"{tid}: {x}" for x in ladder_format_problems(lad)]
    # table shape
    seen = Counter(r for e in ents for r in e["results"])
    for r in range(1, 7):
        if seen[r] != 1:
            p.append(f"{tid}: result {r} belongs to {seen[r]} entries")
    thrashes = [e for e in ents if e["tier"] == "thrash"]
    if len(thrashes) != 1 or thrashes[0]["results"] != [] or thrashes[0]["id"] != "thrash":
        p.append(f"{tid}: needs exactly one Thrash entry, id thrash, with results []")
    field_names = set(FORMAT["entry_fields"]) | {"text"}
    for e in ents:
        eid = e["id"]
        for f in field_names:
            if f == "attack_dice" and not rolls(e):
                continue
            if f not in e:
                p.append(f"{tid}/{eid}: lacks field {f}")
        tier = e["tier"]
        for r in e["results"]:
            if TIER_OF_RESULT[r] != tier:
                p.append(f"{tid}/{eid}: result {r} is not a {tier} result")
        rules = FORMAT["tier_rules"][tier]
        for eff in e["effects"]:
            if eff["type"] not in rules["effects_allowed"]:
                p.append(f"{tid}/{eid}: effect {eff['type']} not allowed in tier {tier}")
            if eff["type"] == "critical-injury" and tier in ("control", "thrash") and not eff["cannot_be_lethal"]:
                p.append(f"{tid}/{eid}: a {tier} Critical Injury must have cannot_be_lethal true")
            if eff["type"] == "critical-injury" and eff["injury_location"] not in ("arm", "leg", "torso", "head", "rolled"):
                p.append(f"{tid}/{eid}: unknown Injury Location {eff['injury_location']}")
        if is_grab(e):
            if e["targets"] != "holder" or "arm" not in e["body_parts_used"]:
                p.append(f"{tid}/{eid}: a grab entry targets holder and uses arm")
            if any(x["type"] == "critical-injury" for x in e["effects"]):
                p.append(f"{tid}/{eid}: a grab entry has no other harming effect")
        if e["targets"] not in ("holder", "holder-and-position"):
            p.append(f"{tid}/{eid}: unknown targets {e['targets']}")
        if not set(e["position_requirement"]) <= set(POSITIONS) or not e["position_requirement"]:
            p.append(f"{tid}/{eid}: bad position_requirement")
        for k in e["body_parts_used"]:
            if k not in ("eyes", "arm", "leg"):
                p.append(f"{tid}/{eid}: unknown Body Part kind {k}")
        if "severity" in e:
            p.append(f"{tid}/{eid}: severity is replaced by attack_dice (decision batch 8, 8-1)")
        if rolls(e):
            ad = e.get("attack_dice")
            if not isinstance(ad, int) or isinstance(ad, bool) or ad < 1:
                p.append(f"{tid}/{eid}: a harming or terrorizing entry lists attack_dice, a whole number of 1 or more")
            else:
                pool_tier = "control" if tier == "thrash" else tier
                if not t["abnormal"] or tier == "thrash":
                    if ad != sc["attack_dice"][pool_tier]:
                        p.append(f"{tid}/{eid}: attack_dice {ad} differs from the Size Class {pool_tier} pool")
                else:
                    lo, hi = ABNORMAL_RANGE["attack_dice"]
                    if not lo <= ad <= hi:
                        p.append(f"{tid}/{eid}: attack_dice outside {lo} to {hi}")
        elif "attack_dice" in e:
            p.append(f"{tid}/{eid}: an entry whose only effect is telegraph lists no attack_dice")
        if tier == "thrash":
            if e["position_requirement"] != POSITIONS or e["body_parts_used"] or e["fallback"] != "none":
                p.append(f"{tid}/thrash: Thrash works anywhere, uses no Body Parts, and has fallback none")
        else:
            fb = e["fallback"]
            if fb != "thrash" and (fb not in ids or fb == eid):
                p.append(f"{tid}/{eid}: fallback {fb} is not another entry or thrash")
        # the flavour text uses no Body Part the entry does not list
        for kind in sorted(text_part_kinds(e) - set(e["body_parts_used"])):
            p.append(f"{tid}/{eid}: text names the Titan's {kind} but body_parts_used does not list it")
        # ... and shows nothing its Position requirement rules out
        low = " ".join(e["text"].lower().split())
        for pos, phrases in POSITION_PHRASES.items():
            if pos in e["position_requirement"]:
                for ph in phrases:
                    if ph in low:
                        p.append(f"{tid}/{eid}: text says '{ph}', which a holder at {pos} rules out")
        # one Broken leg grounds the Titan (data/engagement/titan-harm.yaml, grounded), and a grounded
        # Titan does not walk, run, or stride: an entry that uses a leg needs both (OQ-109)
        if kind_counts(t).get("leg", 0) == 2 and "leg" in e["body_parts_used"] and e["body_parts_used"].count("leg") != 2:
            p.append(f"{tid}/{eid}: an entry that uses a leg lists both legs, since one Broken leg grounds the Titan (OQ-109)")
        if "death" in str(e["effects"]):
            p.append(f"{tid}/{eid}: an entry never names death")
    # standard-only constraints
    if not t["abnormal"]:
        grab_results = sum(len(e["results"]) for e in ents if is_grab(e))
        lethal_results = sum(len(e["results"]) for e in ents if is_lethal(e))
        if grab_results > 1:
            p.append(f"{tid}: {grab_results} results give a grab effect (at most 1)")
        if lethal_results > 1:
            p.append(f"{tid}: {lethal_results} results give a lethal Critical Injury (at most 1)")
        if in_reach_results(t) < 4:
            p.append(f"{tid}: a holder at In Reach meets only {in_reach_results(t)} results in six (at least 4)")
    # move-up shares
    rep = share_report(t)
    if rep["max_kill_share"] > 0.5:
        p.append(f"{tid}: kill share {rep['max_kill_share']:.3f} exceeds one half at {rep['worst_state']}")
    if rep["min_legal_entries"] < 1:
        p.append(f"{tid}: a state leaves no entry but Thrash: {rep['no_legal_state']}")
    return p


def rolls(e):
    """Whether the entry rolls Attack Dice: any effect that harms or terrorizes (ROLLING)."""
    return any(x["type"] in ROLLING for x in e["effects"])


def titan_dice_problems():
    """Titan Dice succeed on 5 or 6 (data/engagement/titan-format.yaml, titan_dice; decision batch 8, 8-1)."""
    td = FORMAT.get("titan_dice") or {}
    return [] if td.get("success_faces") == [5, 6] else ["titan-format.yaml: titan_dice.success_faces is not [5, 6]"]


def in_reach_results(t):
    return sum(len(e["results"]) for e in entries(t) if e["tier"] != "thrash" and "in-reach" in e["position_requirement"])


# ------------------------------------------------------------------ move-up shares
def next_behavior_counts(t, prev, unbroken):
    """Counts, over the six results, which entry becomes the Next Behavior
    (data/engagement/behavior-procedure.yaml, next_behavior, roll)."""
    ids = by_id(t)
    res = by_result(t)
    out = Counter()
    for r in range(1, 7):
        got = "thrash"
        for i in range(6):
            eid = res[(r - 1 + i) % 6 + 1]
            if eid != prev and parts_ok(ids[eid], unbroken):
                got = eid
                break
        out[got] += 1
    return out


def states(t):
    kinds = kind_counts(t)
    prevs = [None, "thrash"] + [e["id"] for e in entries(t) if e["tier"] != "thrash"]
    ranges = [range(kinds.get(k, 0) + 1) for k in ("eyes", "arm", "leg")]
    for prev in prevs:
        for broken in itertools.product(*ranges):
            unbroken = {k: kinds.get(k, 0) - b for k, b in zip(("eyes", "arm", "leg"), broken)}
            yield prev, dict(zip(("eyes", "arm", "leg"), broken)), unbroken


def share_report(t):
    ids = by_id(t)
    worst, worst_state, min_legal, no_legal = -1.0, None, 99, None
    by_prev, by_broken = {}, {}
    for prev, broken, unbroken in states(t):
        c = next_behavior_counts(t, prev, unbroken)
        kill = sum(n for eid, n in c.items() if eid != "thrash" and ids[eid]["tier"] == "kill") / 6
        legal = sum(1 for e in entries(t) if e["tier"] != "thrash" and e["id"] != prev and parts_ok(e, unbroken))
        if kill > worst:
            worst, worst_state = kill, {"previous": prev, "broken": broken}
        if legal < min_legal:
            min_legal, no_legal = legal, {"previous": prev, "broken": broken}
        shares = {eid: round(n / 6, 3) for eid, n in sorted(c.items())}
        if all(v == 0 for v in broken.values()):
            by_prev[str(prev)] = {"shares": shares, "kill_share": round(kill, 3)}
        if prev is None:
            key = ", ".join(f"{k} {v}" for k, v in broken.items() if v) or "none"
            by_broken[key] = {"shares": shares, "kill_share": round(kill, 3)}
    return {"max_kill_share": round(worst, 3), "worst_state": worst_state, "min_legal_entries": min_legal,
            "no_legal_state": no_legal, "by_previous_behavior": by_prev, "by_broken_parts": by_broken,
            "in_reach_results": in_reach_results(t)}


def main():
    bad = 0
    for tid in titan_ids():
        t = load_titan(tid)
        probs = validate(t)
        rep = share_report(t)
        print(f"{tid}: {len(probs)} problems; max kill share {rep['max_kill_share']} at {rep['worst_state']}; "
              f"fewest legal non-Thrash entries {rep['min_legal_entries']}; In Reach meets {rep['in_reach_results']} of 6")
        for x in probs:
            print("   ", x)
        bad += len(probs)
    for lad in LADDERS.values():   # every ladder, used or not (decision batch 4b, 4b-1)
        for x in ladder_format_problems(lad):
            print("   ", x)
            bad += 1
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
