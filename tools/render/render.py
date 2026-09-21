"""Renders the rulebook's tables from data/ YAML into Chapters 1 to 5 and 7 of docs/rules/ (ADR-0012).

Run from the repository root with PyYAML:
- `uv run --with pyyaml python tools/render/render.py write` replaces every rendered block in Chapters 1 to 5 and 7.
  `render.py write docs/rules/07-playtest-rules.md` (one or more chapter paths) rewrites only those chapters, so a
  drafter can render under one chapter's lock while other packages edit the rest.
- `uv run --with pyyaml python tools/render/render.py check` exits 1 if any rendered block differs from its YAML,
  names a source other than the file it renders, is unknown, is missing from its chapter, or appears twice.
- `uv run --with pyyaml python tools/render/render.py list` prints every block with its chapter and source.

A rendered block sits between `<!-- BEGIN RENDERED: name from data/....yaml -->` and
`<!-- END RENDERED: name -->`. The source named is the file whose rows the block renders; names of entries,
Talents, attributes, items, Positions, and Titans are looked up in their own files. Nothing between the markers
is written by hand.

Every renderer checks the keys of the rows it reads, so a value that YAML silently splits into extra keys (an
unquoted comma or colon in a flow mapping) fails the check instead of rendering half a rule.

Chapter 6's stat blocks, Behavior Tables, and probe figures stay on tools/probes/chapter-06/render.py, whose
blocks read titans.py's share enumeration and the collected probe results; check them with `render.py check`
in that folder.
"""
import os
import re
import sys

import yaml

sys.dont_write_bytecode = True
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CH1 = "docs/rules/01-core-rules.md"
CH2 = "docs/rules/02-character-creation.md"
CH3 = "docs/rules/03-harm-and-mind.md"
CH4 = "docs/rules/04-gear.md"
CH5 = "docs/rules/05-titan-engagement.md"
CH7 = "docs/rules/07-playtest-rules.md"
CHAPTERS = [CH1, CH2, CH3, CH4, CH5, CH7]

CIRC = "data/core/circumstances.yaml"
ATTR = "data/character/attributes.yaml"
ORIG = "data/character/origins.yaml"
ENL = "data/character/enlistment.yaml"
TY = "data/character/training-years.yaml"
CR = "data/character/class-rank.yaml"
EXAM = "data/character/graduation-exam.yaml"
SPEC = "data/character/specialties.yaml"
TAL = "data/character/talents.yaml"
CAT = "data/character/action-catalog.yaml"
SQ = "data/character/squadmates.yaml"
CI = "data/harm/critical-injuries.yaml"
EFF = "data/harm/effect-types.yaml"
SR = "data/mind/stress-responses.yaml"
FR = "data/mind/fear-rolls.yaml"
SC = "data/mind/scars.yaml"
FALL = "data/gear/falls.yaml"
ISSUE = "data/gear/standard-issue.yaml"
ITEMS = "data/gear/items.yaml"
SUP = "data/gear/squad-supply.yaml"
SETUP = "data/engagement/engagement-setup.yaml"
ANCH = "data/engagement/anchor-ratings.yaml"
SIZE = "data/engagement/size-classes.yaml"
POSN = "data/engagement/positions.yaml"
ZONES = "data/engagement/zones.yaml"
TIDX = "data/titans/index.yaml"
LEGS = "data/expedition/legs.yaml"
HAZ = "data/expedition/hazards.yaml"
ROUTE = "data/expedition/route.yaml"
DOWN = "data/campaign/downtime.yaml"
REQ = "data/campaign/requisition.yaml"
SKIR = "data/skirmish/skirmish.yaml"
FOES = "data/skirmish/foes.yaml"

_CACHE = {}


class RenderError(Exception):
    pass


def load(rel):
    if rel not in _CACHE:
        with open(os.path.join(ROOT, rel)) as fh:
            _CACHE[rel] = yaml.safe_load(fh)
    return _CACHE[rel]


# ------------------------------------------------------------------ formatting
def cell(v):
    if isinstance(v, bool):
        raise RenderError(f"a true/false value reached a table cell unformatted: {v}")
    if v is None:
        raise RenderError("an empty value reached a table cell")
    return " ".join(str(v).split()).replace("|", "\\|")


def table(headers, rows):
    out = ["| " + " | ".join(headers) + " |", "|" + "---|" * len(headers)]
    for r in rows:
        if len(r) != len(headers):
            raise RenderError(f"row has {len(r)} cells for {len(headers)} columns: {r}")
        out.append("| " + " | ".join(cell(c) for c in r) + " |")
    return "\n".join(out)


def expect_keys(row, allowed, where, required=()):
    extra = set(row) - set(allowed)
    if extra:
        raise RenderError(f"{where}: unexpected keys {sorted(map(str, extra))} (an unquoted comma or colon splits a value)")
    missing = [k for k in required if k not in row]
    if missing:
        raise RenderError(f"{where}: missing keys {missing}")


def yes_no(v):
    if not isinstance(v, bool):
        raise RenderError(f"expected true or false, got {v!r}")
    return "yes" if v else "no"


def runs(values):
    """Die results as ranges: [11, 12, 13] reads 11–13."""
    vals = sorted(values)
    parts, start, prev = [], vals[0], vals[0]
    for v in vals[1:]:
        if v == prev + 1:
            prev = v
            continue
        parts.append((start, prev))
        start = prev = v
    parts.append((start, prev))
    return ", ".join(str(a) if a == b else f"{a}–{b}" for a, b in parts)


def bounds(lo, hi):
    """A min and max where null is open-ended."""
    if lo is None and hi is None:
        return "any"
    if lo is None:
        return f"{hi} or less"
    if hi is None:
        return f"{lo} or more"
    return str(lo) if lo == hi else f"{lo}–{hi}"


def signed(n):
    return f"+{n}" if n > 0 else str(n)


def chapter(ref):
    m = re.match(r"^(\d\d)-", ref)
    if m:
        return f"Chapter {int(m.group(1))}"
    if ref == "rules-not-yet-written":
        return "not yet written"
    return ref


# ------------------------------------------------------------------ lookups
def attr_name(aid):
    names = {a["id"]: a["name"] for a in load(ATTR)["attributes"]}
    if aid not in names:
        raise RenderError(f"unknown attribute {aid}")
    return names[aid]


def specialty_name(sid):
    names = {s["id"]: s["name"] for s in load(SPEC)["specialties"]}
    if sid not in names:
        raise RenderError(f"unknown Specialty {sid}")
    return names[sid]


def catalog():
    return {e["id"]: e for e in load(CAT)["entries"]}


def entry_status(e):
    return "dormant" if e.get("dormant") else "reserved" if e.get("reserved") else None


def entry_name(eid, status=True):
    cat = catalog()
    if eid not in cat:
        raise RenderError(f"unknown Action Catalog entry {eid}")
    e = cat[eid]
    st = entry_status(e)
    return f"{e['name']} ({st})" if status and st else e["name"]


def talents():
    return {t["id"]: t for t in load(TAL)["talents"]}


def talent_name(tid, status=True):
    ts = talents()
    if tid not in ts:
        raise RenderError(f"unknown Talent {tid}")
    t = ts[tid]
    if status:
        flags = [entry_status(catalog()[e]) for e in t["names"]]
        if all(flags):
            return f"{t['name']} ({' or '.join(sorted(set(flags)))})"
    return t["name"]


def item_name(iid):
    names = {i["id"]: i["name"] for i in load(ITEMS)["items"]}
    if iid not in names:
        raise RenderError(f"unknown gear item {iid}")
    return names[iid]


def position_name(pid):
    names = {p["id"]: p["name"] for p in load(POSN)["positions"]}
    if pid not in names:
        raise RenderError(f"unknown Position {pid}")
    return names[pid]


def titan_name(tid):
    return load(f"data/titans/{tid}.yaml")["name"]


EFFECT_KEYS = {"type", "dice", "entries", "amount", "turns", "text", "toward", "applies_to", "applies_after"}
# decision batch 7, 7-8 (OQ-139): where a Fear Roll row's forced-move effect steps (data/harm/effect-types.yaml)
TOWARD = {"distant": "Distant", "nearest-comrade": "the nearest comrade"}


def effect(e):
    expect_keys(e, EFFECT_KEYS, f"effect {e.get('type')}", required=("type",))
    known = {t["id"] for t in load(EFF)["effect_types"]}
    t = e["type"]
    if t not in known:
        raise RenderError(f"effect type {t} is not in {EFF}")
    if t == "penalty":
        base = f"{e['dice']}-die penalty on " + ", ".join(entry_name(x, False) for x in e["entries"])
    elif t == "next-roll-penalty":
        base = f"{e['dice']}-die penalty on the next roll"
    elif t == "stress-gain":
        base = f"gain {e['amount']} Stress"
    elif t == "push-stress":
        base = f"{e['amount']} extra Stress on every Push"
    elif t == "lose-successes":
        base = f"lose {e['amount']} success" + ("" if e["amount"] == 1 else "es")
    elif t == "zero-successes":
        base = "the roll fails"
    elif t == "spend-next-turn":
        base = "next turn spent" if e["turns"] == 1 else f"next {e['turns']} turns spent"
    elif t == "spend-next-action":
        base = "next action spent"
    elif t == "no-reactions":
        base = "no Reactions"
    elif t == "fear-roll-total":
        base = f"Fear Roll total +{e['amount']}"
    elif t == "gain-scar":
        base = "gain a Scar"
    # decision batch 7, 7-8 (OQ-139): the six effect types a Fear Roll row may add
    elif t == "draw-attention":
        base = "the loudest flag on the event's Titan, never from Distant"
    elif t == "stress-gain-nearby":
        base = f"comrades within 1 Position step gain {e.get('amount', 1)} Stress"
    elif t == "forced-move":
        base = f"1 step toward {lookup(TOWARD, e.get('toward'), 'forced-move toward')} at the start of the next turn"
    elif t == "forced-action":
        base = "next action a strike on the event's Titan, Pushed if short"
    elif t == "drop-blade-set":
        base = "drop the Blade Set in the handles"
    elif t == "gas-roll":
        base = "a Gas Roll at once"
    elif t == "forbids-entries":
        base = "cannot take " + ", ".join(entry_name(x, False) for x in e["entries"])
    elif t == "other":
        base = e["text"]
    else:
        raise RenderError(f"effect type {t} has no rendering")
    if e.get("applies_to"):
        base += f" ({e['applies_to']})"
    if e.get("applies_after"):
        base += f", after {e['applies_after']}"
    return base


def effects(lst, empty):
    return "; ".join(effect(e) for e in lst) if lst else empty


# ------------------------------------------------------------------ Chapter 2
def b_attributes():
    rows = []
    for a in load(ATTR)["attributes"]:
        expect_keys(a, {"id", "name", "summary", "used_by", "key_attribute_of"}, f"{ATTR} {a.get('id')}")
        rows.append([a["name"], a["summary"], ", ".join(entry_name(x) for x in a["used_by"]),
                     ", ".join(specialty_name(s) for s in a["key_attribute_of"])])
    return table(["Attribute", "Covers", "Action Catalog entries that name it", "Key attribute of"], rows)


def b_origins():
    d = load(ORIG)
    rows = []
    for r in d["rows"]:
        expect_keys(r, {"id", "results", "name", "description", "attributes", "talent_choice", "haven_choice",
                        "canon_tie", "condition"}, f"{ORIG} {r.get('id')}")
        tie = f"{r['canon_tie']['character']}: {r['canon_tie']['link']}" if r["canon_tie"] else "none"
        if r["condition"] is None:
            cond = "no condition"
        else:
            parts = []
            for k, v in r["condition"].items():
                if k not in d["condition_fields"]:
                    raise RenderError(f"{ORIG} {r['id']}: condition {k} is not in condition_fields")
                if k == "campaign_year_min":
                    parts.append(f"Campaign Year {v} or later")
                else:
                    raise RenderError(f"{ORIG}: condition {k} has no rendering")
            cond = "; ".join(parts)
        rows.append([runs(r["results"]), r["name"], ", ".join(attr_name(a) for a in r["attributes"]),
                     " or ".join(talent_name(t) for t in r["talent_choice"]), "<br>".join(r["haven_choice"]),
                     tie, cond, r["description"]])
    return ("**Origin (D66)**\n\n" +
            table(["D66", "Origin", "+1 to each", "Talent level 1 in one of", "Haven, one of", "Canon Tie (optional)",
                   "Keep the row only with", "Description"], rows))


def b_enlistment():
    rows = []
    for r in load(ENL)["rows"]:
        expect_keys(r, {"id", "results", "reason", "attribute", "drive"}, f"{ENL} {r.get('id')}")
        dv = r["drive"]
        expect_keys(dv, {"id", "name", "trigger", "test", "acts", "target", "needs_named_comrade", "notes"},
                    f"{ENL} {r['id']} drive")
        trigger = dv["trigger"] + (" " + dv["notes"] if dv.get("notes") else "")
        acts = ", ".join("Push" if a == "push" else entry_name(a, False) for a in dv.get("acts", [])) or "none"
        rows.append([runs(r["results"]), r["reason"], attr_name(r["attribute"]), dv["name"], trigger,
                     f"`{dv['test']}`", acts, f"`{dv['target']}`", yes_no(dv["needs_named_comrade"])])
    return ("**Why You Enlisted (D66)**\n\n" +
            table(["D66", "Why you enlisted", "+1", "Drive", "Trigger", "Test", "Acts", "Target",
                   "Needs a named comrade"], rows))


def b_training_years():
    rows = []
    for y in load(TY)["years"]:
        rows.append([y["name"], " and ".join(attr_name(a) for a in y["performance_attributes"]),
                     ", ".join(talent_name(t) for t in y["curriculum"])])
    return (table(["Training Year", "Performance attributes", "Curriculum"], rows) +
            "\n\nA Talent marked dormant or reserved names only dormant or reserved Action Catalog entries (section 2.8).")


def b_year(yid):
    years = {y["id"]: y for y in load(TY)["years"]}
    y = years[yid]
    rows = []
    for e in y["events"]:
        expect_keys(e, {"results", "name", "description", "attribute", "talent_choice", "merit_change"},
                    f"{TY} {yid} {e.get('name')}")
        rows.append([runs(e["results"]), e["name"], attr_name(e["attribute"]),
                     " or ".join(talent_name(t) for t in e["talent_choice"]), signed(e["merit_change"]), e["description"]])
    return (f"**{y['name']}: events (D66)**\n\n" +
            table(["D66", "Event", "+1", "Talent level in one of", "Merit", "Description"], rows))


def b_merit():
    rows = []
    for r in load(TY)["performance_roll"]["merit_from_successes"]:
        expect_keys(r, {"successes_min", "successes_max", "merit"}, f"{TY} merit_from_successes")
        rows.append([bounds(r["successes_min"], r["successes_max"]), r["merit"]])
    return table(["Performance roll successes", "Merit"], rows)


def b_class_rank():
    rows = []
    for r in load(CR)["rows"]:
        expect_keys(r, {"merit_min", "merit_max", "class_rank", "top_10"}, f"{CR} row")
        rows.append([bounds(r["merit_min"], r["merit_max"]), r["class_rank"], yes_no(r["top_10"])])
    return table(["Merit total", "Class Rank", "Top 10"], rows)


def merit_rule(rows):
    for r in rows:
        expect_keys(r, {"successes_min", "successes_max", "merit"}, f"{EXAM} merit")
    return "; ".join(f"{bounds(r['successes_min'], r['successes_max'])} successes: {r['merit']} Merit" for r in rows)


def b_exam():
    """The three Stages, in their order, with the Help and Merit each one runs on."""
    d = load(EXAM)
    stages = {st["id"]: st for st in d["stages"]}
    rows = []
    for i, sid in enumerate(d["order"], 1):
        st = stages.get(sid)
        if st is None:
            raise RenderError(f"{EXAM}: order names the missing Stage {sid}")
        help_ = "none" if st["help"] == "none" else "fixed by the Trial's roll order (see below)"
        rows.append([i, st["name"], st["needs"], yes_no(st["push"]), help_, merit_rule(st["merit"])])
    return table(["Order", "Stage", "Successes needed", "Can be Pushed", "Help", "Merit"], rows)


def b_exam_trials():
    """Each Stage's six Trials, named by the tens die of that Stage's D66."""
    d = load(EXAM)
    stages = {st["id"]: st for st in d["stages"]}
    out = []
    for sid in d["order"]:
        st = stages[sid]
        rows = []
        for t in sorted(st["trials"], key=lambda x: x["result"]):
            expect_keys(t, {"result", "id", "name", "description", "entry", "gear_item", "entry_choice"},
                        f"{EXAM} {t.get('id')}", required=("result", "id", "name", "description"))
            if "entry" in t:
                entry, gear = entry_name(t["entry"], False), t.get("gear_item") or "none"
            elif "entry_choice" in t:
                choices = []
                for c in t["entry_choice"]:
                    expect_keys(c, {"entry", "gear_item"}, f"{EXAM} entry_choice")
                    choices.append(f"{entry_name(c['entry'], False)} ({c['gear_item'] or 'no gear'})")
                entry, gear = "; ".join(choices), "listed with each roll"
            else:
                raise RenderError(f"{EXAM}: the Trial {t['id']} names no entry")
            rows.append([t["result"], t["name"], entry, gear, t["description"]])
        out.append(f"**{st['name']}: its Trials (the tens die)**\n\n" +
                   table(["D6", "Trial", "Action Catalog entry", "Gear item", "Description"], rows))
    return "\n\n".join(out)


def b_exam_conditions():
    """The condition the units die of a Stage's D66 names, which the whole class runs that Trial under."""
    d = load(EXAM)
    rows = []
    for r in sorted(d["conditions_table"]["rows"], key=lambda x: x["result"]):
        expect_keys(r, {"result", "id", "name", "description", "needs_change", "no_gear_dice", "bonus_dice", "extra_pushes"},
                    f"{EXAM} condition {r.get('id')}", required=("result", "id", "name", "description"))
        parts = []
        if r.get("needs_change"):
            n = abs(r["needs_change"])
            way = "more" if r["needs_change"] > 0 else "fewer"
            when = "later" if r["needs_change"] > 0 else "earlier"
            parts.append(f"The Trial needs {n} {way} success, and pays its Merit {n} success {when}.")
        if r.get("no_gear_dice"):
            parts.append("The exam issue gives no Gear Dice.")
        if r.get("bonus_dice"):
            n = r["bonus_dice"]
            parts.append(f"Every roll in the Trial takes {n} Bonus {'Die' if n == 1 else 'Dice'}.")
        if r.get("extra_pushes"):
            n = r["extra_pushes"]
            parts.append(f"The Trial can be Pushed {n} more {'time' if n == 1 else 'times'} than its Stage allows.")
        rows.append([r["result"], r["name"], " ".join(parts) or "Nothing changes.", r["description"]])
    return ("**Exam conditions (the units die)**\n\n" +
            table(["D6", "Condition", "What changes", "Description"], rows))


def b_exam_issue():
    rows = []
    for x in load(EXAM)["conditions"]["exam_issue"]:
        expect_keys(x, {"item", "counts_as", "gear_dice"}, f"{EXAM} exam_issue")
        rows.append([x["item"], x["counts_as"], x["gear_dice"]])
    return table(["Exam issue", "Counts as", "Gear Dice"], rows)


def b_specialties():
    rows = []
    for s in load(SPEC)["specialties"]:
        expect_keys(s, {"id", "name", "key_attribute", "summary", "talents", "squadmate_template"}, f"{SPEC} {s.get('id')}")
        rows.append([s["name"], attr_name(s["key_attribute"]), s["summary"], ", ".join(talent_name(t) for t in s["talents"])])
    general = load(SPEC).get("general")   # decision batch 7, 7-2: the general list of twelve
    if general:
        expect_keys(general, {"id", "name", "summary", "talents"}, f"{SPEC} general", required=("name", "summary", "talents"))
        rows.append([general["name"], "none", general["summary"], ", ".join(talent_name(t) for t in general["talents"])])
    return table(["Specialty", "Key attribute", "Summary", "Talent list"], rows)


def b_templates():
    attrs = [a["id"] for a in load(ATTR)["attributes"]]
    rows = []
    for t in load(SQ)["templates"]:
        expect_keys(t, {"id", "specialty", "attributes", "talent", "health", "resolve"}, f"{SQ} template {t.get('id')}")
        if set(t["attributes"]) != set(attrs):
            raise RenderError(f"{SQ} template {t['id']}: attributes {sorted(t['attributes'])}")
        rows.append([specialty_name(t["specialty"])] + [t["attributes"][a] for a in attrs] +
                    [f"{talent_name(t['talent']['id'], False)} {t['talent']['level']}", t["health"], t["resolve"]])
    return table(["Template"] + [attr_name(a) for a in attrs] + ["Talent", "Health", "Resolve"], rows)


def b_squadmate_rules():
    rows = []
    for r in load(SQ)["rules_applicability"]:
        expect_keys(r, {"rule", "applies", "source", "note"}, f"{SQ} rules_applicability", required=("rule", "applies"))
        applies = yes_no(r["applies"]) if isinstance(r["applies"], bool) else r["applies"]
        rows.append([r["rule"], applies, chapter(r["source"]) if r.get("source") else "none", r.get("note", "none")])
    return table(["Rule", "Applies to a Squadmate", "Chapter", "Note"], rows)


TALENT_KEYS = {"id", "name", "description", "type", "max_level", "names", "specialties", "decided", "trigger", "effect",
               "limit", "rules", "condition"}


# The limit terms a rule Talent may use (data/character/talents.yaml, talent_rules, limit_terms; ADR-0016,
# Talent guardrail 8). A limit id must appear both here and in limit_terms.
LIMIT_NAMES = {"once_per_titan_engagement": "once per Titan Engagement", "once_per_leg": "once per Leg",
               "once_per_night_camp": "once per Night Camp", "once_per_skirmish": "once per Skirmish",
               "once_per_downtime": "once per Downtime"}


DATA_REF = re.compile(r"\(data/[^)]*\)")


def id_names(text):
    """Player text names Action Catalog entries by name, not id (review round 1, R46). A reference to a data
    file, "(data/...)", keeps its keys as written."""
    cat = catalog()
    ids = re.compile(r"(?<![A-Za-z0-9_/.\-])(" + "|".join(re.escape(i) for i in sorted(cat, key=len, reverse=True)) +
                     r")(?![A-Za-z0-9_\-])")
    out, pos = [], 0
    for m in DATA_REF.finditer(text):
        out.append(ids.sub(lambda x: cat[x.group(1)]["name"], text[pos:m.start()]))
        out.append(m.group(0))
        pos = m.end()
    out.append(ids.sub(lambda x: cat[x.group(1)]["name"], text[pos:]))
    return "".join(out)


def b_talents(kind):
    limits = load(TAL)["talent_rules"]["limit_terms"]
    general = set((load(SPEC).get("general") or {}).get("talents", []))
    rows = []
    for t in load(TAL)["talents"]:
        expect_keys(t, TALENT_KEYS, f"{TAL} {t.get('id')}")
        if t["type"] != kind:
            continue
        cond = t.get("condition") or {}
        for x in cond:
            if x not in t["names"]:
                raise RenderError(f"{TAL} {t['id']}: condition names {x}, which the Talent does not name")
        names = ", ".join(entry_name(x) + (f" ({cond[x]})" if x in cond else "") for x in t["names"])
        if t["id"] in general and t["specialties"]:
            raise RenderError(f"{TAL} {t['id']}: on the general list and on a Specialty's list")
        specs = ", ".join(specialty_name(s) for s in t["specialties"]) or ("General" if t["id"] in general else "none")
        if kind == "dice":
            rows.append([t["name"], names, t["max_level"], specs, t["description"]])
        else:
            if t["limit"] == "none":
                limit = "none"
            elif t["limit"] in limits and t["limit"] in LIMIT_NAMES:
                limit = LIMIT_NAMES[t["limit"]]
            else:
                raise RenderError(f"{TAL} {t['id']}: limit {t['limit']} has no rendering")
            rows.append([t["name"], names, id_names(t["trigger"]), id_names(t["effect"]), limit, t["max_level"], specs,
                         t["description"]])
    if kind == "dice":
        return table(["Talent", "Names", "Max level", "Specialty lists", "Description"], rows)
    return table(["Talent", "Names", "Trigger", "Effect", "Limit", "Max level", "Specialty lists", "Description"], rows)


ENTRY_KEYS = {"id", "name", "kind", "rolled", "attribute", "gear", "requires_gear", "without_gear", "context",
              "requirements", "needs", "changes", "help_outside_titan_engagement", "rules", "decided", "adrs", "notes",
              "option_of", "reserved", "dormant"}
KIND = {"action": "action", "reaction": "Reaction", "roll": "roll", "option": "option", "fixed-roll": "fixed roll"}
ROLLED = {"when_taken": "when taken", "when_a_rule_calls": "when a rule calls for it",
          "when_called": "when a rule or the GM calls for it", "never": "never"}   # decision batch 9, 9-12
CONTEXT = {"titan-engagement": "in a Titan Engagement", "any": "anywhere", "lifepath": "in the Lifepath"}
WITHOUT = {"not_possible": "yes; without it the entry cannot be used", "attribute_alone": "yes; without it, attribute alone"}


def lookup(table_, key, where):
    if key not in table_:
        raise RenderError(f"{where}: {key!r} has no rendering")
    return table_[key]


def b_catalog():
    rows = []
    for e in load(CAT)["entries"]:
        expect_keys(e, ENTRY_KEYS, f"{CAT} {e.get('id')}")
        where = f"{CAT} {e['id']}"
        if e["attribute"] is None:
            attribute = "none"
        elif e["attribute"] == "from_performance_attributes":
            attribute = "the Training Year's performance attribute"
        else:
            attribute = attr_name(e["attribute"])
        gear = e.get("gear", [])
        if e.get("requires_gear") is True:
            needs_gear = lookup(WITHOUT, e["without_gear"], where)
        elif e.get("requires_gear") is False and gear:
            needs_gear = "no"
        else:
            needs_gear = "not applicable"
        rows.append([e["name"], f"`{e['id']}`", lookup(KIND, e["kind"], where), lookup(ROLLED, e["rolled"], where),
                     attribute, ", ".join(item_name(g) for g in gear) or "none", needs_gear,
                     lookup(CONTEXT, e["context"], where), entry_status(e) or "none"])
    return table(["Entry", "Id", "Kind", "Rolled", "Attribute", "Gear items", "Needs its gear", "Used", "Status"], rows)


def tracked_values():
    tvs = load(CAT)["tracked_values"]
    for tv in tvs:
        expect_keys(tv, {"id", "name", "rules", "changed_by"}, f"{CAT} tracked_values {tv.get('id')}")
    return {tv["id"]: tv for tv in tvs}


def b_catalog_requirements():
    tvs = tracked_values()
    rows = []
    for e in load(CAT)["entries"]:
        expect_keys(e, ENTRY_KEYS, f"{CAT} {e.get('id')}")
        req = e.get("requirements")
        if e.get("option_of"):
            req = f"Option of {e['option_of']}. " + (req or "")
        elif req is None:
            req = "none"
        changes = ", ".join(lookup({k: v["name"] for k, v in tvs.items()}, c, f"{CAT} {e['id']} changes")
                            for c in e.get("changes", [])) or "none"
        rows.append([e["name"], req.strip(), e.get("needs", "none"), changes, e.get("help_outside_titan_engagement", "none"),
                     e.get("notes", "none"), ", ".join(chapter(r) for r in e.get("rules", [])) or "none"])
    return table(["Entry", "Requirements", "Needs", "Changes", "Help outside a Titan Engagement", "Notes", "Rules in"], rows)


def b_tracked_values():
    entries = load(CAT)["entries"]
    rows = []
    for tid, tv in tracked_values().items():
        by = ", ".join(e["name"] for e in entries if tid in e.get("changes", [])) or "none"
        rows.append([f"`{tid}`", tv["name"], by, tv.get("changed_by", "none"), ", ".join(chapter(r) for r in tv["rules"])])
    return table(["Id", "Tracked value", "Entries that change it", "Otherwise changed by", "Rules in"], rows)


# ------------------------------------------------------------------ Chapter 3
def injury_types():
    """The Injury Types in their file order (ADR-0017), as {id: name}."""
    out = {}
    for t in load(CI)["types"]:
        expect_keys(t, {"id", "name", "named_by"}, f"{CI} types {t.get('id')}", required=("id", "name", "named_by"))
        out[t["id"]] = t["name"]
    return out


def b_injury_types():
    rows = [[t["name"], t["named_by"]] for t in load(CI)["types"] if t["id"] in injury_types()]
    return table(["Injury Type", "Named by"], rows)


def b_injury_location():
    d = load(CI)
    sides = d["sides"]
    rows = []
    for r in d["injury_location_table"]["rows"]:
        expect_keys(r, {"results", "injury_location", "side"}, f"{CI} injury_location_table",
                    required=("results", "injury_location", "side"))
        sided = r["injury_location"] in sides["sided_locations"]
        if sided != (r["side"] is not None) or (sided and r["side"] not in sides["values"]):
            raise RenderError(f"{CI} injury_location_table: {r['injury_location']} has side {r['side']!r}")
        where = f"{r['side']} {r['injury_location']}" if sided else r["injury_location"]
        rows.append([bounds(r["results"]["min"], r["results"]["max"]), where])
    roll = sides["side_roll"]
    expect_keys(roll, {"when", "roll", "odd", "even"}, f"{CI} sides side_roll")
    return (table(["D6", "Injury Location"], rows) +
            f"\n\n**Side, when a rule names {' or '.join(sides['sided_locations'])} without one ({roll['roll']}):** "
            f"odd, {roll['odd']}; even, {roll['even']}.")


CI_KEYS = {"id", "names", "results", "down", "lethal", "time_limit", "death_roll_penalty", "instant_death", "effects",
           "healing_days", "permanent_effects", "repeat_row"}
RIDER_KEYS = {"rows", "all_rows", "lethal_rows", "sets", "treat_injury"}
# decision batch 8, 8-8 and 8-15 (OQ-138, OQ-150): the fields a type rider sets, beside the Bite rider's time_limit
RIDER_FIELDS = {"time_limit": lambda v: f"a `{v}` limit",
                "healing_days_multiplier": lambda v: "healing days doubled" if v == 2 else f"healing days multiplied by {v}",
                "heals_untreated": lambda v: "no healing while untreated" if v is False else None}


def listed(parts):
    parts = list(parts)
    return " and ".join(parts) if len(parts) <= 2 else ", ".join(parts[:-1]) + ", and " + parts[-1]


def rider_clause(rd, row_ref, where):
    """One type rider as a clause: the rows it picks (rows, all_rows, or lethal_rows), then what it sets and what
    it asks of Treat Injury (data/harm/critical-injuries.yaml, table_fields, type_riders)."""
    expect_keys(rd, RIDER_KEYS, where)
    picks = [k for k in ("rows", "all_rows", "lethal_rows") if k in rd]
    if len(picks) != 1:
        raise RenderError(f"{where}: a rider picks its rows by exactly one of rows, all_rows, and lethal_rows")
    if picks[0] == "rows":
        subject, verb = listed(row_ref(x) for x in rd["rows"]), ("has" if len(rd["rows"]) == 1 else "have")
    elif rd[picks[0]] is not True:
        raise RenderError(f"{where}: {picks[0]} {rd[picks[0]]!r}")
    else:
        subject, verb = ("every row" if picks[0] == "all_rows" else "every lethal row"), "has"
    parts = []
    for field, value in (rd.get("sets") or {}).items():
        text = RIDER_FIELDS[field](value) if field in RIDER_FIELDS else None
        if text is None:
            raise RenderError(f"{where}: {field} {value!r} has no rendering")
        parts.append(text)
    ti = rd.get("treat_injury")
    if ti == "requires_kit_or_supplies":
        parts.append("Treat Injury only with a medical kit or medical supplies")
    elif isinstance(ti, dict) and set(ti) == {"penalty"} and isinstance(ti["penalty"], int):
        parts.append(f"a {ti['penalty']}-die penalty on Treat Injury")
    elif ti is not None:
        raise RenderError(f"{where}: treat_injury {ti!r} has no rendering")
    if not parts:
        raise RenderError(f"{where}: the rider sets nothing")
    return f"{subject} {verb} {listed(parts)}"


def row_names(r):
    types = injury_types()
    if set(r["names"]) != set(types):
        raise RenderError(f"{CI} {r['id']}: names {sorted(r['names'])} are not one per Injury Type {sorted(types)}")
    return "<br>".join(f"{name}: {r['names'][tid]}" for tid, name in types.items())


def b_critical_injuries(loc):
    d = load(CI)
    tab = d["tables"][loc]
    expect_keys(tab, {"injury_location", "non_lethal_cap", "type_riders", "rows"}, f"{CI} tables {loc}")
    by_id = {r["id"]: r for r in tab["rows"]}

    def row_ref(rid):
        r = by_id[rid]
        return f"the {bounds(r['results']['min'], r['results']['max'])} row"

    rows = []
    for r in tab["rows"]:
        expect_keys(r, CI_KEYS, f"{CI} {r.get('id')}")
        res = bounds(r["results"]["min"], r["results"]["max"])
        if r.get("instant_death"):
            na = "not applicable"
            rows.append([res, row_names(r), na, "instant death", na, na, na, na, na])
            continue
        if r["down"] == "until_treated":
            down = "until treated"
        elif r["down"] is False:
            down = "no"
        else:
            raise RenderError(f"{CI} {r['id']}: down {r['down']!r} has no rendering")
        lethal = f"yes, `{r['time_limit']}` limit" if r["lethal"] else "no"
        repeat = row_ref(r["repeat_row"]) if r.get("repeat_row") else "none"
        rows.append([res, row_names(r), down, lethal, r["death_roll_penalty"], effects(r["effects"], "none"),
                     r["healing_days"], effects(r.get("permanent_effects"), "none"), repeat])
    cap = row_ref(tab["non_lethal_cap"])
    per = d["worsening"]["per_held_injury"]
    if loc in d["sides"]["sided_locations"]:
        counted = f"each Critical Injury at that {loc}, on the same side, that counts toward worsening"
    else:
        counted = f"each {loc} Critical Injury that counts toward worsening"
    head = (f"**{loc.capitalize()}** (2D6 + {per} for {counted}; "
            f"a Critical Injury that cannot be lethal uses {cap} in place of a lethal or instant-death row)")
    riders = []
    types = injury_types()
    for typ, lst in (tab["type_riders"] or {}).items():
        if typ not in types:
            raise RenderError(f"{CI} tables {loc} type_riders: {typ} is not an Injury Type")
        clauses = [rider_clause(rd, row_ref, f"{CI} tables {loc} type_riders {typ}") for rd in (lst or [])]
        if clauses:
            riders.append(f"{types[typ]}: {'; '.join(clauses)}.")
    rider_text = ("**Type riders.** " + " ".join(riders)) if riders else "**Type riders.** None on this table."
    return (head + "\n\n" + table(["2D6 total", "Critical Injury, by Injury Type", "Down", "Lethal", "Death Roll penalty",
                                   "Effects while held", "Healing days", "Permanent effects", "If gained before at that side, use"],
                                  rows) + "\n\n" + rider_text)


ATT = "data/engagement/attention.yaml"
MOVE_KINDS = {"on_foot": "moves on foot", "mounted": "mounted moves", "odm": "ODM moves"}
MOVE_VALUES = {"spends_action": "also spend the action", "forbidden": "cannot be made"}
# decision batch 8, 8-11 (OQ-137): what a grade does to Mount or Dismount
MOUNT_VALUES = {"with_help": "Mount or Dismount only with a comrade's help"}
GRADE_KEYS = ("id", "name", "row", "sides_lost", "penalties", "forbids_entries", "forbids_decoys", "no_gear_dice_from",
              "mount_or_dismount", "moves", "keeps")


def decoy_name(did):
    names = {x["id"]: x["name"] for x in load(ATT)["break_attention"]["decoys"]}
    if did not in names:
        raise RenderError(f"unknown Break Attention decoy {did}")
    return names[did]


def b_lost_limbs():
    d = load(CI)["lost_limb_riders"]
    rows = []
    for g in d["grades"]:
        where = f"{CI} lost_limb_riders {g.get('id')}"
        # mount_with_help: the both-arms grade's three readings of a helped mount (decision batch 8, 8-25)
        expect_keys(g, set(GRADE_KEYS) | {"mount_with_help"}, where, required=GRADE_KEYS)
        if (g["mount_or_dismount"] == "with_help") != ("mount_with_help" in g):
            raise RenderError(f"{where}: a helped mount states its mount_with_help, and only a helped mount does")
        found = [(loc, r) for loc, t in load(CI)["tables"].items() for r in t["rows"] if r["id"] == g["row"]]
        if len(found) != 1 or not found[0][1].get("permanent_effects"):
            raise RenderError(f"{where}: {g['row']} is not a row with permanent effects")
        loc, row = found[0]
        if g["sides_lost"] not in (1, 2):
            raise RenderError(f"{where}: sides_lost {g['sides_lost']!r}")
        sides = "one side" if g["sides_lost"] == 1 else "both sides"
        cannot = [entry_name(x, False) for x in g["forbids_entries"]] + [f"the {decoy_name(x)} decoy" for x in g["forbids_decoys"]]
        moves = []
        if set(g["moves"]) != set(MOVE_KINDS):
            raise RenderError(f"{where}: moves {sorted(g['moves'])}")
        for kind, label in MOVE_KINDS.items():
            v = g["moves"][kind]
            if v == "unchanged":
                continue
            if v not in MOVE_VALUES or v not in d["move_values"]:
                raise RenderError(f"{where}: move value {v!r} has no rendering")
            moves.append(f"{label} {MOVE_VALUES[v]}")
        if g["mount_or_dismount"] not in d["mount_values"]:
            raise RenderError(f"{where}: mount_or_dismount {g['mount_or_dismount']!r}")
        if g["mount_or_dismount"] != "unchanged":
            moves.append(lookup(MOUNT_VALUES, g["mount_or_dismount"], where))
        penalties = [effects(g["penalties"], "")] if g["penalties"] else []
        for ng in g["no_gear_dice_from"]:
            expect_keys(ng, {"item", "entries"}, f"{where} no_gear_dice_from", required=("item", "entries"))
            penalties.append(f"no Gear Dice from {item_name(ng['item'])} on " + ", ".join(entry_name(x, False) for x in ng["entries"]))
        rows.append([f"{g['name']}: the {loc} table's {bounds(row['results']['min'], row['results']['max'])} row, gained at {sides}",
                     "; ".join(penalties) or "none", ", ".join(cannot) or "nothing", "; ".join(moves) or "unchanged",
                     g["keeps"]])
    # decision batch 8, 8-10 (OQ-147): the prosthetic reading, printed under the grades
    pr = d["prosthetics"]
    where = f"{CI} lost_limb_riders prosthetics"
    expect_keys(pr, {"kinds", "fitted", "reading", "limit", "never_removes", "squadmates", "retirement", "decided"}, where,
                required=("kinds", "fitted", "reading", "limit", "never_removes"))
    if set(pr["kinds"]) != {"arm", "leg"}:
        raise RenderError(f"{where}: kinds {sorted(pr['kinds'])}")
    kinds = " and ".join(item_name(i) for i in pr["kinds"].values())
    return (table(["Grade", "Penalties it adds", "Cannot take", "Moves", "Keeps"], rows) + "\n\n" +
            f"**Prosthetics ({kinds}).** " + " ".join(folded(pr[k]) for k in ("fitted", "reading", "limit", "never_removes")))


def b_stress_responses():
    t = load(SR)["table"]
    rows = []
    for r in t["rows"]:
        expect_keys(r, {"id", "name", "results", "duration", "text", "effects"}, f"{SR} {r.get('id')}", required=("text",))
        rows.append([bounds(r["results"]["min"], r["results"]["max"]), r["name"], r["text"], r["duration"],
                     effects(r["effects"], "none")])
    return table(["D6 + Stress − Resolve", "Stress Response", "What happens", "Duration", "Effects"], rows)


FORBIDS = {"reaction": "Reactions", "push": "Pushing", "help": "Help", "cover": "Covering"}


def b_fear_rolls():
    t = load(FR)["table"]
    rows = []
    for r in t["rows"]:
        expect_keys(r, {"id", "name", "results", "text", "effects", "forbids"}, f"{FR} {r.get('id')}", required=("text",))
        forbids = ", ".join(lookup(FORBIDS, f, f"{FR} {r['id']} forbids") for f in r.get("forbids", [])) or "none"
        rows.append([bounds(r["results"]["min"], r["results"]["max"]), r["name"], r["text"], effects(r["effects"], "none"),
                     forbids])
    return table(["D6 + Stress − Resolve", "Result", "What happens", "Effects", "Forbids"], rows)


def b_scars():
    rows = []
    for r in load(SC)["table"]["rows"]:
        expect_keys(r, {"id", "name", "results", "trigger", "effects", "squadmate_rerolls"}, f"{SC} {r.get('id')}")
        rerolls = yes_no(r["squadmate_rerolls"]) if "squadmate_rerolls" in r else "no"
        rows.append([runs(r["results"]), r["name"], r["trigger"], effects(r["effects"], "none"), rerolls])
    return table(["D66", "Scar", "Trigger", "Effect", "A Squadmate rolls again"], rows)


# ------------------------------------------------------------------ Chapter 4
def b_fall_bands():
    rows = []
    for b in load(FALL)["height"]["bands"]:
        expect_keys(b, {"id", "adds"}, f"{FALL} bands")
        rows.append([b["id"].capitalize(), signed(b["adds"]) if b["adds"] else "+0"])
    return table(["Band", "Adds to the D6"], rows)


def b_fall_damage():
    rows = []
    for r in load(FALL)["damage_table"]["rows"]:
        expect_keys(r, {"id", "results", "damage"}, f"{FALL} damage_table")
        rows.append([bounds(r["results"]["min"], r["results"]["max"]), r["id"].replace("-", " ").capitalize(), r["damage"]])
    return table(["D6 + the band's value", "Landing", "Damage"], rows)


def funding_label(n):
    default = load(ISSUE)["funding"]["until_funding_rules"]
    return f"{n} (used until the Funding rules are written)" if n == default else n


def b_standard_issue():
    d = load(ISSUE)
    every = d["every_row"]
    expect_keys(every, {"fitted_canister", "blade_set_rating"}, f"{ISSUE} every_row")
    fitted = every["fitted_canister"].split(" (")[0]
    rows = []
    for r in d["by_funding"]:
        expect_keys(r, {"funding", "odm_gear_rating", "spare_canisters", "blade_sets", "horse_rating"}, f"{ISSUE} by_funding")
        rows.append([funding_label(r["funding"]), r["odm_gear_rating"], fitted, r["spare_canisters"], r["blade_sets"],
                     every["blade_set_rating"], r["horse_rating"]])
    out = ("**By Funding**\n\n" +
           table(["Funding", "ODM Gear rating", "Fitted canister", "Spare canisters",
                  "Blade Sets, counting the one in the handles", "Blade Set rating", "Horse rating"], rows))
    spec = []
    for r in d["by_specialty"]["rows"]:
        expect_keys(r, {"specialty", "item", "rating"}, f"{ISSUE} by_specialty")
        spec.append([specialty_name(r["specialty"]), item_name(r["item"]), r["rating"]])
    out += "\n\n**By Specialty**\n\n" + table(["Specialty", "Item", "Rating"], spec) + "\n\n" + d["by_specialty"]["others"]
    return out


def b_squad_supply():
    # Every kind is a column, rations included (decision batch 8, 8-12, item 7).
    d = load(SUP)
    kinds = d["kinds"]
    ids = [k["id"] for k in kinds]
    rows = []
    for r in d["stock"]["by_funding"]:
        expect_keys(r, {"funding"} | set(ids), f"{SUP} stock", required=ids)
        rows.append([funding_label(r["funding"])] + [r[k] for k in ids])
    return table(["Funding"] + [k["name"] for k in kinds], rows)


# ------------------------------------------------------------------ Chapter 5
def b_interim_setup():
    d = load(SETUP)
    anchors = {r["id"]: r["name"] for r in load(ANCH)["ratings"]}
    sizes = {c["id"]: c for c in load(SIZE)["classes"]}
    std = load(TIDX)["standard_titans"]
    t1 = []
    covered = []
    for r in d["anchor_rating"]["rows"]:
        expect_keys(r, {"results", "anchor_rating"}, f"{SETUP} anchor_rating")
        covered += r["results"]
        t1.append([runs(r["results"]), lookup(anchors, r["anchor_rating"], f"{SETUP} anchor_rating")])
    covers_d6(covered, f"{SETUP} anchor_rating")
    zt = d["zone_terrain"]
    expect_keys(zt, {"roll", "applies_to", "rows"}, f"{SETUP} zone_terrain", required=("roll", "applies_to", "rows"))
    terrain_words = {"sparser": "one rating sparser than the field rating",
                     "field": "the field rating",
                     "denser": "one rating denser than the field rating"}
    t0, covered = [], []
    for r in zt["rows"]:
        expect_keys(r, {"results", "rating"}, f"{SETUP} zone_terrain", required=("results", "rating"))
        covered += r["results"]
        t0.append([runs(r["results"]), lookup(terrain_words, r["rating"], f"{SETUP} zone_terrain")])
    covers_d6(covered, f"{SETUP} zone_terrain")
    ladder = []
    for rt in load(ANCH)["ratings"]:
        expect_keys(rt, RATING_KEYS, f"{ANCH} {rt['id']} rating", required=RATING_KEYS)
        ladder.append([rt["name"], lookup(anchors, rt["sparser"], f"{ANCH} {rt['id']} sparser"),
                       lookup(anchors, rt["denser"], f"{ANCH} {rt['id']} denser")])
    t2 = []
    for r in d["size_class"]["rows"]:
        expect_keys(r, {"results", "size_class"}, f"{SETUP} size_class")
        c = sizes[r["size_class"]]
        t2.append([runs(r["results"]), f"{c['name']} ({c['height']})", titan_name(std[r["size_class"]])])
    t3 = []
    for r in d["medium_abnormal"]["rows"]:
        expect_keys(r, {"results", "titan"}, f"{SETUP} medium_abnormal")
        t3.append([runs(r["results"]), titan_name(r["titan"])])
    t4 = []
    for r in d["background_titans"]["rows"]:
        expect_keys(r, {"results", "clocks"}, f"{SETUP} background_titans")
        t4.append([runs(r["results"]), len(r["clocks"]) or "none", ", ".join(str(c) for c in r["clocks"]) or "none"])
    return ("**Field rating (D6)**\n\n" + table(["D6", "Field rating"], t1) +
            f"\n\n**Zone terrain ({zt['roll']}), for {folded(zt['applies_to'])}**\n\n" +
            table([zt["roll"], "The zone's rating"], t0) +
            "\n\n**Sparser and denser, by rating**\n\n" + table(["Rating", "One sparser", "One denser"], ladder) +
            "\n\n**Size Class (D6), for the Focus Titan and for each Background Titan**\n\n" +
            table(["D6", "Size Class", "Standard Titan"], t2) +
            "\n\n**On Medium: `medium_abnormal` (D6)**\n\n" + table(["D6", "Focus Titan"], t3) +
            "\n\n**Background Titans (D6)**\n\n" + table(["D6", "Background Titans", "Clock lengths, in order"], t4) +
            f"\n\n**Retreat clock:** {d['retreat_clock']} segments, for every Titan Engagement this table sets up (no roll).")


def b_position_steps():
    """The step rows, and the anchors, Carry cost, and Terrain Trait each zone's rating gives (decision batch 10,
    OQ-182; decision batch 16, 16-4, 16-5, and 16-13)."""
    steps, field = [], []
    for rt in load(ANCH)["ratings"]:
        expect_keys(rt, RATING_KEYS, f"{ANCH} {rt['id']} rating", required=RATING_KEYS)
        for s in rt["steps"]:
            expect_keys(s, {"between", "on_foot", "mounted", "odm"}, f"{ANCH} {rt['id']} step")
            a, b = s["between"]
            kind = "zone step into it" if {a, b} == {"distant", "in-reach"} else "attachment step in it"
            steps.append([rt["name"], f"{position_name(a)} to {position_name(b)}", kind, yes_no(s["on_foot"]),
                          yes_no(s["mounted"]), yes_no(s["odm"])])
        trait = folded(rt["terrain_trait"])
        trait = re.sub(r"\s*\((?:data/[^()]*|[a-z][a-z0-9_-]*(?:, [a-z][a-z0-9_-]*)*)\)", "", trait)
        field.append([rt["name"], str(rt["anchors"]), str(whole0(rt["carry_cost"], f"{ANCH} {rt['id']} carry_cost")),
                      "none" if trait == "none" else trait])
    return (table(["Zone's rating", "Step (either way)", "Read as", "On foot", "Mounted", "ODM"], steps) +
            "\n\n**Anchors, Carry cost, and Terrain Traits, by zone**\n\n" +
            table(["Zone's rating", "Anchors (Momentum cap)", "Carry cost to enter", "Terrain Trait"], field))


RATING_KEYS = ("id", "name", "meaning", "anchors", "carry_cost", "sparser", "denser", "terrain_trait", "steps")


def whole0(v, where):
    if isinstance(v, bool) or not isinstance(v, int) or v < 0:
        raise RenderError(f"{where}: expected a whole number of 0 or more, got {v!r}")
    return v


# ------------------------------------------------------------------ the field (ADR-0029; decision batch 16)
AXIAL = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]


def field_cells(size, where):
    """One field's zones as {n: (q, r)}, checked against the numbering rule of 16-2."""
    expect_keys(size, {"id", "name", "use", "centre", "squad_start", "zones"}, where,
                required=("id", "name", "use", "centre", "squad_start", "zones"))
    cells = {}
    for z in size["zones"]:
        expect_keys(z, {"n", "q", "r"}, f"{where} zones", required=("n", "q", "r"))
        cells[z["n"]] = (z["q"], z["r"])
    if sorted(cells) != list(range(1, len(cells) + 1)):
        raise RenderError(f"{where}: zones are not numbered 1 to {len(cells)}")
    if sorted(cells, key=lambda n: cells[n]) != sorted(cells):
        raise RenderError(f"{where}: zones are not numbered column by column, top to bottom")
    if cells.get(size["centre"]) != (0, 0):
        raise RenderError(f"{where}: the centre zone is not at (0, 0)")
    if cells.get(size["squad_start"]) != (0, 1):
        raise RenderError(f"{where}: the Squad's start zone is not directly below the centre")
    return cells


def zone_distance(cells, a, b):
    dq, dr = cells[a][0] - cells[b][0], cells[a][1] - cells[b][1]
    return (abs(dq) + abs(dr) + abs(dq + dr)) // 2


def zone_neighbours(cells, n):
    at = {v: k for k, v in cells.items()}
    q, r = cells[n]
    return sorted(at[(q + dq, r + dr)] for dq, dr in AXIAL if (q + dq, r + dr) in at)


def field_diagram(cells, centre, start):
    """The field drawn flat-top: each column a column of text, each zone two text rows high, so a column's
    neighbours sit half a zone up and down. [n] marks the centre and (n) the Squad's start zone."""
    qs = sorted({q for q, _ in cells.values()})
    ys = {n: 2 * r + q for n, (q, r) in cells.items()}
    lo, hi = min(ys.values()), max(ys.values())
    lines = []
    for y in range(lo, hi + 1):
        row = []
        for q in qs:
            n = next((k for k, (qq, _) in cells.items() if qq == q and ys[k] == y), None)
            if n is None:
                row.append("      ")
            elif n == centre:
                row.append(f" [{n:>2}] ")
            elif n == start:
                row.append(f" ({n:>2}) ")
            else:
                row.append(f"  {n:>2}  ")
        lines.append("".join(row).rstrip())
    return lines


def b_zone_fields():
    """The three fields (decision batch 16, 16-2), drawn from their coordinates, with centre, start, and edges."""
    d = load(ZONES)
    co = d["coordinates"]
    if co["system"] != "axial-flat-top" or co["neighbour_offsets"] != AXIAL:
        raise RenderError(f"{ZONES} coordinates: not the axial flat-top offsets of 16-2")
    out = []
    sizes = d["fields"]["sizes"]
    if d["fields"]["default"] not in {s["id"] for s in sizes}:
        raise RenderError(f"{ZONES} fields: the default names no field")
    for s in sizes:
        where = f"{ZONES} fields {s.get('id')}"
        cells = field_cells(s, where)
        edges = [n for n in cells if len(zone_neighbours(cells, n)) < 6]
        default = " The default." if s["id"] == d["fields"]["default"] else ""
        out.append(f"**{s['name']}**, {len(cells)} zones.{default} Centre {s['centre']}, the Squad's start zone "
                   f"{s['squad_start']}. Edge zones: {runs(edges)}.\n\n```\n" +
                   "\n".join(field_diagram(cells, s["centre"], s["squad_start"])) + "\n```")
    return ("`[n]` is the centre zone, where Focus Titan A starts; `(n)` is the Squad's start zone. Two zones that "
            "touch are adjacent.\n\n" + "\n\n".join(out))


ATTACHMENT_IDS = ("ground", "anchored", "on-body", "blind-spot", "grabbed", "pinned")
ATTACHMENT_NAMES = {"ground": "Ground", "anchored": "Anchored", "on-body": "On Body", "blind-spot": "Blind Spot",
                    "grabbed": "Grabbed", "pinned": "Pinned"}


def b_attachments():
    rows = []
    d = load(ZONES)
    ids = []
    for a in d["attachments"]:
        where = f"{ZONES} attachments {a.get('id')}"
        keys = ("id", "names_body", "free", "derives", "text")
        expect_keys(a, set(keys), where, required=keys)
        ids.append(a["id"])
        if (a["derives"] is None) == a["names_body"]:
            raise RenderError(f"{where}: names_body and derives disagree")
        derives = ("names none: In Reach of every body in the zone" if a["derives"] is None
                   else position_name(a["derives"]))
        rows.append([ATTACHMENT_NAMES[a["id"]], yes_no(a["names_body"]), yes_no(a["free"]), derives,
                     folded(DATA_REF.sub("", a["text"])).replace(" .", ".")])
    if tuple(ids) != ATTACHMENT_IDS:
        raise RenderError(f"{ZONES} attachments: {ids} is not the closed list of 16-8")
    return table(["Attachment", "Names a body", "Free", "Position relative to that body", "Where the soldier is"], rows)


def b_position_derivation():
    d = load(ZONES)["derivation"]
    rows = []
    for i, r in enumerate(d["order"], 1):
        expect_keys(r, {"id", "when", "position"}, f"{ZONES} derivation", required=("id", "when", "position"))
        rows.append([str(i), folded(r["when"]), position_name(r["position"])])
    if [r["position"] for r in d["order"]][-1] != "distant":
        raise RenderError(f"{ZONES} derivation: the last row is not distant")
    return (table(["Order", "For one soldier and one body, if the soldier's", "Position"], rows) +
            f"\n\nThe first row that applies gives the Position. {folded(d['off_field'])}")


def b_carry_costs():
    d = load(ZONES)
    fl = d["flight"]
    keys = ("first_step_cost", "carry_cost_into_zone", "carry_cost_off_field", "carry_cost_attachment_step",
            "carry_limit", "ends_free_in_open", "ends_free_as", "momentum_gain_cap", "momentum_trim")
    expect_keys(fl, set(keys), f"{ZONES} flight", required=keys)
    rows = [["The first step, of any kind", str(whole0(fl["first_step_cost"], f"{ZONES} flight"))]]
    for rt in load(ANCH)["ratings"]:
        art = "an" if rt["name"][0] in "AEIOU" else "a"
        rows.append([f"A zone step into {art} {rt['name']} zone", str(whole0(rt["carry_cost"], f"{ANCH} {rt['id']}"))])
    rows.append(["A step off field, from an edge zone", str(whole0(fl["carry_cost_off_field"], f"{ZONES} flight"))])
    rows.append(["An attachment step", str(whole0(fl["carry_cost_attachment_step"], f"{ZONES} flight"))])
    if fl["ends_free_in_open"] is not False or fl["ends_free_as"] not in ATTACHMENT_IDS:
        raise RenderError(f"{ZONES} flight: the Open ending or the free attachment is not 16-13's")
    mo = d["moves"]
    expect_keys(mo["mounted"], {"zone_steps", "attachment_steps", "ends_on_entering_a_standing_focus_titans_zone_unless_open"},
                f"{ZONES} moves mounted", required=("zone_steps", "attachment_steps"))
    return (table(["A Flight's step", "Momentum it costs"], rows) +
            f"\n\n**Carry limit:** at most {whole(fl['carry_limit'], f'{ZONES} flight')} Carries on one Flight "
            f"(OQ-200, decided by the zone retune, Z4). A Flight never ends free in an Open zone, and one that ends free ends "
            f"{ATTACHMENT_NAMES[fl['ends_free_as']]}.\n\n"
            f"**Mounted pace:** up to {whole(mo['mounted']['zone_steps'], f'{ZONES} moves mounted')} zone steps and "
            f"{mo['mounted']['attachment_steps']} attachment steps (OQ-200, decided by the zone retune, Z4). **On foot:** "
            f"{whole(mo['on_foot']['steps'], f'{ZONES} moves on_foot')} step.")


def b_zone_effects():
    rows = []
    for e in load(ZONES)["effects"]:
        where = f"{ZONES} effects {e.get('id')}"
        expect_keys(e, {"id", "where", "harm", "art", "reserved"}, where, required=("id", "where", "harm", "art"))
        rows.append([e["id"].capitalize(), "reserved: no rule places it" if e.get("reserved") else folded(e["where"]),
                     e["harm"]])
    return table(["Effect", "Where it is", "Harm"], rows)


def b_stride():
    sizes = load(SIZE)
    if "stride" not in sizes["fields"]:
        raise RenderError(f"{SIZE} fields: no stride")
    rows = []
    for c in sizes["classes"]:
        rows.append([c["name"], str(whole(c["stride"], f"{SIZE} {c['id']} stride"))])
    for tid in load(TIDX)["abnormals"]:
        aid = tid["id"] if isinstance(tid, dict) else tid
        t = load(f"data/titans/{aid}.yaml")
        rows.append([t["name"] + " (an Abnormal lists its own)", str(whole(t["stride"], f"data/titans/{aid}.yaml stride"))])
    st = load(ZONES)["stride"]
    return (table(["Titan", "Stride (zones)"], rows) +
            f"\n\nA grounded Titan's Stride is {st['grounded']}. Ties between two zones go to the lower-numbered.")


# The Position map (decision batch 13, 13-6; OQ-191): left to right, the way a soldier closes on a Titan.
POSITION_LANE = ["distant", "in-reach", "on-body", "blind-spot"]


def _map_links(rating_id, where):
    """One ground's step rows as ordered Position pairs, read off the same rows the step table renders."""
    rating = next((r for r in load(ANCH)["ratings"] if r["id"] == rating_id), None)
    if rating is None:
        raise RenderError(f"{where}: names a ground {rating_id!r}, which anchor-ratings.yaml does not rate")
    links = []
    for st in rating["steps"]:
        a, b = st["between"]
        for pid in (a, b):
            if pid not in POSITION_LANE:
                raise RenderError(f"{where}: a step reaches {pid!r}, which the map has no place for")
        if POSITION_LANE.index(a) > POSITION_LANE.index(b):
            a, b = b, a
        if (a, b) not in links:
            links.append((a, b))
    return sorted(links, key=lambda ab: (POSITION_LANE.index(ab[0]), POSITION_LANE.index(ab[1])))


def _chain_diagram(names):
    return [" --- ".join(names)]


def _branch_diagram(names, links, joined):
    """Two arms off the last node of the stem, drawn to one width so the arms close in the same column.

    Distant --- In Reach -                  - (joined)
    is the stem; the arms carry the two Positions the fork reaches, and the closing dash appears only
    when a step joins those two to each other.
    """
    stem_ids = [pid for pid in POSITION_LANE if pid not in links["fork"]]
    stem = " --- ".join(names[pid] for pid in stem_ids)
    arms = [names[pid] for pid in links["fork"]]
    width = max(len(a) for a in arms) + 1
    body = ["--- " + a + " " + "-" * (width - len(a)) for a in arms]
    pad = " " * (len(stem) + 2)
    # The right-hand corners close onto one another when a step joins the two Positions the fork reaches, so the
    # join is drawn as a wire and never as a labelled node, which read as a further place to stand (round 3 review
    # 1, m2). When no step joins them the arms simply end.
    join = "|" if joined else " "
    return [pad + "/" + body[0] + ("\\" if joined else ""),
            (stem + " -" + " " * (len(body[0]) + 1) + join).rstrip(),
            pad + "\\" + body[1] + ("/" if joined else "")]


def b_position_maps():
    """The three Position maps (decision batch 13, 13-6; OQ-191). Every node and every line is derived from the
    Anchor Ratings' own step rows, so a map can never draw a route the rules do not have: the maps add no step and
    change no row, and a map that disagrees with its step rows raises here rather than drifting quietly."""
    out = []
    for m in load(ANCH)["position_maps"]["maps"]:
        where = f"{ANCH} position_maps {m.get('id')}"
        expect_keys(m, {"id", "name", "ratings", "anchors", "shape", "reaches_blind_spot", "says"}, where,
                    required=("id", "name", "ratings", "anchors", "shape", "reaches_blind_spot", "says"))
        links = _map_links(m["ratings"][0], where)
        for other in m["ratings"][1:]:
            if _map_links(other, where) != links:
                raise RenderError(f"{where}: draws one map for {m['ratings'][0]!r} and {other!r}, whose step rows differ")
        reached = [pid for pid in POSITION_LANE if any(pid in ab for ab in links)]
        if ("blind-spot" in reached) != bool(m["reaches_blind_spot"]):
            raise RenderError(f"{where}: reaches_blind_spot is {m['reaches_blind_spot']}, and its step rows say otherwise")
        names = {pid: position_name(pid) for pid in reached}
        if m["shape"] == "chain":
            for a, b in links:
                if POSITION_LANE.index(b) - POSITION_LANE.index(a) != 1:
                    raise RenderError(f"{where}: shape chain, and a step joins {a} to {b}, which is not the next stop")
            if len(links) != len(reached) - 1:
                raise RenderError(f"{where}: shape chain, and its step rows fork")
            lines = _chain_diagram([names[pid] for pid in reached])
        elif m["shape"] == "branch":
            fork = [pid for pid in ("on-body", "blind-spot") if pid in reached]
            if len(fork) != 2 or not any(ab == ("in-reach", "blind-spot") for ab in links):
                raise RenderError(f"{where}: shape branch, and its step rows do not fork at In Reach")
            joined = ("on-body", "blind-spot") in links
            lines = _branch_diagram(names, {"fork": fork}, joined)
        else:
            raise RenderError(f"{where}: shape {m['shape']!r} has no drawing")
        anchors = f"anchors {m['anchors']}"
        out.append(f"**{m['name']}** ({anchors}). {folded(m['says'])}\n\n```\n" + "\n".join(lines) + "\n```")
    return "\n\n".join(out)


# ------------------------------------------------------------------ Chapter 7
# The prosthetic items (decision batch 8, 8-10; data/gear/items.yaml), whose Requisition row is one row at Limited.
PROSTHETIC_ITEMS = {"prosthetic-arm", "prosthetic-leg"}


def folded(v):
    return " ".join(str(v).split())


def adds(n):
    return signed(n) if n else "+0"


def contiguous(rows, where):
    """A D6-plus-modifiers table covers every total once: open below on its first row, open above on its last."""
    spans = []
    for r in rows:
        expect_keys(r["results"], {"min", "max"}, f"{where} {r.get('id')} results", required=("min", "max"))
        spans.append((r["results"]["min"], r["results"]["max"]))
    if not spans or spans[0][0] is not None or spans[-1][1] is not None:
        raise RenderError(f"{where}: the first row must be open below and the last row open above")
    prev = spans[0][1]
    for i, (lo, hi) in enumerate(spans[1:], 1):
        if prev is None or lo != prev + 1:
            raise RenderError(f"{where}: row {rows[i].get('id')} starts at {lo}, which leaves a gap or an overlap")
        if hi is not None and hi < lo:
            raise RenderError(f"{where}: row {rows[i].get('id')} ends before it starts")
        prev = hi


def covers_d6(values, where):
    if sorted(values) != [1, 2, 3, 4, 5, 6]:
        raise RenderError(f"{where}: the D6 rows cover {sorted(values)}, not 1 to 6 once each")


def post_name(pid):
    names = {p["id"]: p["name"] for p in load(LEGS)["formation_posts"]}
    if pid not in names:
        raise RenderError(f"unknown Formation Post {pid}")
    return names[pid]


def b_interim_route():
    d = load(ROUTE)["interim_route"]
    steps = []
    for i, st in enumerate(d["steps"], 1):
        expect_keys(st, {"id", "text"}, f"{ROUTE} interim_route steps", required=("id", "text"))
        steps.append(f"{i}. {folded(st['text'])}")
    roll = d["formation_post_roll"]
    rows = []
    for r in roll["rows"]:
        expect_keys(r, {"results", "post"}, f"{ROUTE} formation_post_roll", required=("results", "post"))
        rows.append([runs(r["results"]), post_name(r["post"])])
    covers_d6([x for r in roll["rows"] for x in r["results"]], f"{ROUTE} formation_post_roll")
    return "\n".join(steps) + f"\n\n**Formation Post ({roll['roll']})**\n\n" + table(["D6", "Formation Post"], rows)


def b_waypoint_kinds():
    anchors = {r["id"]: r["name"] for r in load(ANCH)["ratings"]}
    rows, covered = [], []
    for w in load(ROUTE)["waypoint_kinds"]:
        where = f"{ROUTE} waypoint_kinds {w.get('id')}"
        keys = ("id", "name", "anchor_rating", "interim_roll")
        expect_keys(w, set(keys), where, required=keys)
        covered += w["interim_roll"]
        rating = lookup(anchors, w["anchor_rating"], where) if w["anchor_rating"] else "none; roll it on the setup table"
        roll = runs(w["interim_roll"]) if w["interim_roll"] else "never rolled; always the route's last Waypoint"
        rows.append([w["name"], rating, roll])
    covers_d6(covered, f"{ROUTE} waypoint_kinds")
    return table(["Waypoint kind", "Field rating", "Interim route (D6)"], rows)


def b_pace():
    rows = []
    for p in load(LEGS)["pace"]:
        where = f"{LEGS} pace {p.get('id')}"
        keys = ("id", "name", "when", "rations_multiplier", "hazard_modifier", "leg_roll_entry")
        expect_keys(p, set(keys), where, required=keys)
        entry = entry_name(p["leg_roll_entry"], False) if p["leg_roll_entry"] in catalog() else p["leg_roll_entry"]
        mult = p["rations_multiplier"]
        rations = "as the Leg roll gives" if mult == 1 else f"{mult} times what the Leg roll gives"
        rows.append([p["name"], p["when"], entry, rations, adds(p["hazard_modifier"])])
    return table(["Pace", "When", "Leg roll", "Rations", "Adds to the hazard roll"], rows)


def b_formation_posts():
    rows = []
    for p in load(LEGS)["formation_posts"]:
        where = f"{LEGS} formation_posts {p.get('id')}"
        keys = ("id", "name", "entry", "hazard_modifier", "special", "picture")
        expect_keys(p, set(keys), where, required=keys)
        rows.append([p["name"], entry_name(p["entry"], False), adds(p["hazard_modifier"]), p["special"], p["picture"]])
    return table(["Formation Post", "Leg roll on a Steady Leg", "Adds to the hazard roll", "Special", "The post"], rows)


def b_leg_hazard_modifiers():
    m = load(HAZ)["leg_hazards"]["modifiers"]
    keys = ("distance_band", "per_night_camp_made", "formation_post", "pace", "leg_roll", "signal_relay_flare")
    expect_keys(m, set(keys), f"{HAZ} leg_hazards modifiers", required=keys)
    bands = {b["id"]: b["name"] for b in load(ROUTE)["distance_bands"]}
    if set(m["distance_band"]) != set(bands):
        raise RenderError(f"{HAZ} modifiers distance_band: {sorted(m['distance_band'])} are not the Distance Bands")
    legs = load(LEGS)
    outcome = legs["leg_outcome"]
    rows = [
        ["The Leg's Distance Band", ", ".join(f"{bands[b]} {adds(v)}" for b, v in m["distance_band"].items())],
        ["Each night camp already made on this Expedition", adds(m["per_night_camp_made"])],
        ["The Formation Post", "as the Formation Posts table gives"],
        ["The Pace", ", ".join(f"{p['name']} {adds(p['hazard_modifier'])}" for p in legs["pace"])],
        ["The Leg roll failed", adds(outcome["failure"]["hazard_modifier"])],
        ["The Leg roll succeeded",
         f"{adds(outcome['success']['hazard_modifier_per_success_beyond_the_first'])} for each success beyond the first"],
        ["The Squad spent the Signal Relay's flare", adds(m["signal_relay_flare"])],
    ]
    return table(["The hazard roll adds", "Amount"], rows)


HAZ_ROW_KEYS = ("id", "name", "results", "text", "effects")


def hazard_table(key, head):
    d = load(HAZ)
    known = {e["id"] for e in d["effect_types"]}
    rows = d[key]["rows"]
    where = f"{HAZ} {key}"
    contiguous(rows, where)
    ids = {r["id"] for r in rows}
    foes = {f["id"] for f in load(FOES)["foes"]}
    out = []
    for r in rows:
        expect_keys(r, set(HAZ_ROW_KEYS), f"{where} {r.get('id')}", required=HAZ_ROW_KEYS)
        for e in r["effects"]:
            for t in [e] + [o for o in e.get("options", []) if "type" in o]:
                if t.get("type") not in known:
                    raise RenderError(f"{where} {r['id']}: effect type {t.get('type')} is not in effect_types")
                if t["type"] == "as-row" and t["row"] not in ids:
                    raise RenderError(f"{where} {r['id']}: as-row names {t['row']}, which is not a row")
                if t["type"] == "skirmish" and t["foes"]["kind"] not in foes:
                    raise RenderError(f"{where} {r['id']}: {t['foes']['kind']} is not a Foe")
        out.append([bounds(r["results"]["min"], r["results"]["max"]), r["name"], r["text"]])
    return table(["Total", head, "What happens"], out)


def b_leg_hazards():
    return "**Leg Hazard table (D6, plus every line above)**\n\n" + hazard_table("leg_hazards", "Hazard")


def b_night_hazards():
    n = load(HAZ)["night"]["modifiers"]
    expect_keys(n, {"distance_band", "camp_roll_failed"}, f"{HAZ} night modifiers", required=("distance_band", "camp_roll_failed"))
    return (f"**Night table (D6, plus the Distance Band of the day's last Leg, plus {n['camp_roll_failed']} "
            f"if the camp roll failed)**\n\n" + hazard_table("night", "Night"))


def b_downtime_actions():
    d = load(DOWN)

    def rows_of(lst, where, numbers):
        out = []
        for a in lst:
            keys = ("id", "name", "effect") + (("stress", "grief") if numbers else ())
            expect_keys(a, set(keys), f"{where} {a.get('id')}", required=keys)
            for k, word in (("stress", "Stress"), ("grief", "Grief")):
                if numbers and a[k] and f"{-a[k]} {word}" not in folded(a["effect"]):
                    raise RenderError(f"{where} {a['id']}: its effect text does not state {-a[k]} {word}")
            out.append([a["name"], a["effect"]])
        return out

    sq = d["squadmates"]
    return ("**Downtime Actions** (each player character takes one per Downtime)\n\n" +
            table(["Downtime Action", "Effect"], rows_of(d["downtime_actions"]["rows"], f"{DOWN} downtime_actions", True)) +
            f"\n\n**Squadmates** take no Downtime Action. {sq['relief']}\n\n" +
            "**Squad Actions** (the Squad takes one per Downtime)\n\n" +
            table(["Squad Action", "Effect"], rows_of(d["squad_actions"]["rows"], f"{DOWN} squad_actions", False)))


def b_requisition_gate():
    d = load(REQ)
    names, rows1 = {}, []
    for sc in d["scarcity"]:
        expect_keys(sc, {"id", "name", "needs"}, f"{REQ} scarcity", required=("id", "name", "needs"))
        names[sc["id"]] = sc["name"]
        rows1.append([sc["name"], sc["needs"]])
    rows2, covered = [], []
    for r in d["funding_gate"]["rows"]:
        expect_keys(r, {"funding", "tiers"}, f"{REQ} funding_gate", required=("funding", "tiers"))
        covered += r["funding"]
        rows2.append([runs(r["funding"]), ", ".join(lookup(names, t, f"{REQ} funding_gate") for t in r["tiers"])])
    covers_d6(covered, f"{REQ} funding_gate")
    return ("**Scarcity**\n\n" + table(["Scarcity", "Successes needed, plus the ledger"], rows1) +
            "\n\n**The Funding gate**\n\n" + table(["Funding", "Scarcity Command will consider"], rows2))


REQ_ROW_KEYS = ("id", "name", "items", "rating", "supply", "scarcity", "canon_label", "locked_until_discovery", "notes")


def b_requisition_list():
    d = load(REQ)
    names = {sc["id"]: sc["name"] for sc in d["scarcity"]}
    items = {i["id"] for i in load(ITEMS)["items"]}
    rows = d["list"]["rows"]
    if len(rows) != 15:
        raise RenderError(f"{REQ} list: {len(rows)} rows, not the 15 of decision batches 7 (7-16) and 8 (8-10)")
    out = []
    for r in rows:
        where = f"{REQ} list {r.get('id')}"
        expect_keys(r, set(REQ_ROW_KEYS), where, required=REQ_ROW_KEYS)
        for i in r["items"]:
            if i not in items:
                raise RenderError(f"{where}: {i} is not a gear item")
        if r["canon_label"] not in ("canon", "canon-adjacent", "invented"):
            raise RenderError(f"{where}: canon_label {r['canon_label']!r}")
        if r["locked_until_discovery"] is not None:
            raise RenderError(f"{where}: no playtest row is locked")
        out.append([r["name"], lookup(names, r["scarcity"], where), r["notes"]])
    prosthetic = [r for r in rows if set(r["items"]) & PROSTHETIC_ITEMS]
    if len(prosthetic) != 1 or prosthetic[0]["scarcity"] != "limited":
        raise RenderError(f"{REQ} list: the prosthetic must be one row at Limited (decision batch 8, 8-10)")
    return table(["Item", "Scarcity", "Notes"], out)


WEAPON_KEYS = ("id", "name", "used_with", "injury_type", "damage", "target", "gear_item", "spends", "wielded_by", "notes")
ATTACKS = {"fight": "Fight", "shoot": "Shoot"}
TARGETS = {"engaged": "Engaged only", "apart": "Apart only", "either": "Engaged or Apart"}
WIELDERS = {"soldier": "soldiers", "foe": "Foes"}


def whole(v, where):
    if isinstance(v, bool) or not isinstance(v, int) or v < 1:
        raise RenderError(f"{where}: expected a whole number of 1 or more, got {v!r}")
    return v


def skirmish_weapons():
    out = {}
    for w in load(SKIR)["weapons"]["rows"]:
        where = f"{SKIR} weapons {w.get('id')}"
        expect_keys(w, set(WEAPON_KEYS), where, required=WEAPON_KEYS)
        whole(w["damage"], f"{where} damage")
        lookup(injury_types(), w["injury_type"], f"{where} injury_type")
        out[w["id"]] = w
    return out


def b_skirmish_weapons():
    types = injury_types()
    rows = []
    for w in skirmish_weapons().values():
        where = f"{SKIR} weapons {w['id']}"
        rows.append([w["name"], lookup(ATTACKS, w["used_with"], where), types[w["injury_type"]], w["damage"],
                     lookup(TARGETS, w["target"], where), item_name(w["gear_item"]) if w["gear_item"] else "none",
                     w["spends"], " and ".join(lookup(WIELDERS, x, where) for x in w["wielded_by"]), w["notes"]])
    return table(["Weapon", "Attack", "Injury Type", "Damage", "Target", "Gear Dice from", "Spends", "Used by", "Notes"], rows)


FOE_KEYS = ("id", "name", "who", "attack_dice", "guard_dice", "health", "grit", "parley", "watch", "group_size",
            "fight_weapon", "shoot_weapon")


def b_foes():
    weapons = skirmish_weapons()

    def weapon(wid, used, where):
        w = lookup(weapons, wid, where)
        if w["used_with"] != used or "foe" not in w["wielded_by"]:
            raise RenderError(f"{where}: {wid} is not a Foe's {used} weapon")
        return w["name"]

    rows = []
    for f in load(FOES)["foes"]:
        where = f"{FOES} foes {f.get('id')}"
        expect_keys(f, set(FOE_KEYS), where, required=FOE_KEYS)
        for k in ("attack_dice", "guard_dice", "health", "grit", "parley", "watch"):   # parley: decision batch 9, 9-14
            whole(f[k], f"{where} {k}")
        gs = f["group_size"]
        if "fixed" in gs:
            expect_keys(gs, {"fixed"}, f"{where} group_size")
            size = str(whole(gs["fixed"], f"{where} group_size"))
        else:
            expect_keys(gs, {"roll", "min", "max"}, f"{where} group_size", required=("roll", "min", "max"))
            size = f"{gs['roll']} ({gs['min']} to {gs['max']})"
        fw = f["fight_weapon"]
        if isinstance(fw, str):
            fight = weapon(fw, "fight", where)
        else:
            expect_keys(fw, {"roll", "rows", "at_night"}, f"{where} fight_weapon", required=("roll", "rows"))
            covers_d6([x for r in fw["rows"] for x in r["results"]], f"{where} fight_weapon")
            fight = "; ".join(f"{runs(r['results'])}: {weapon(r['weapon'], 'fight', where)}" for r in fw["rows"])
            fight += f" ({folded(fw['roll'])})"
            if fw.get("at_night"):
                n = fw["at_night"]
                fight += (f"; at night, a {weapon(n['with'], 'fight', where).lower()} in place of a "
                          f"{weapon(n['replaces'], 'fight', where).lower()}")
        shoot = weapon(f["shoot_weapon"], "shoot", where) if f["shoot_weapon"] else "none"
        rows.append([f["name"], f["attack_dice"], f["guard_dice"], fight, shoot, f["health"], f["grit"], f["parley"],
                     f["watch"], size])
    return table(["Foe", "Attack Dice", "Guard", "Fight with", "Shoot with", "Health", "Grit", "Parley", "Watch", "Group"],
                 rows)


FOE_NEVER = {"push": "Push", "help": "Help", "cover": "Cover", "grapple": "Grapple", "break-free": "Break Free",
             "release": "Release", "parley": "Parley", "size-up": "Size Up", "reaction": "a Reaction"}
GUARD_NEVER = {"push": "Push", "help": "Help", "bonus-dice": "Bonus Dice", "stress-dice": "Stress Dice",
               "gear-dice": "Gear Dice"}


def b_foe_rule():
    d = load(FOES)
    fr, g, fa = d["foe_rule"], d["guard"], d["firearms"]
    keys = ("when", "candidates", "last_attacker", "lowest_card", "steps", "first_match", "never", "no_stress")
    expect_keys(fr, set(keys), f"{FOES} foe_rule", required=keys)
    expect_keys(g, {"what", "every_attack", "never", "spends", "ambush"}, f"{FOES} guard",
                required=("what", "every_attack", "never", "spends"))
    if "cancelling roll" not in folded(g["what"]):
        raise RenderError(f"{FOES} guard: it must name Guard as the Foe's cancelling roll (decision batch 8, 8-4)")
    steps = []
    for i, st in enumerate(fr["steps"], 1):
        expect_keys(st, {"id", "test", "does"}, f"{FOES} foe_rule steps", required=("id", "test", "does"))
        steps.append(f"{i}. **{folded(st['test'])}** {folded(st['does'])}")
    never = ", ".join(lookup(FOE_NEVER, x, f"{FOES} foe_rule never") for x in fr["never"])
    guard_never = ", ".join(lookup(GUARD_NEVER, x, f"{FOES} guard never") for x in g["never"])
    return (f"{folded(fr['when'])} {folded(fr['first_match'])}\n\n"
            f"- **Candidates:** {folded(fr['candidates'])}\n"
            f"- **Last attacker:** {folded(fr['last_attacker'])}\n"
            f"- **Lowest card:** {folded(fr['lowest_card'])}\n\n" + "\n".join(steps) +
            f"\n\nA Foe never takes any of these: {never}. {folded(fr['no_stress'])}\n\n"
            f"**Guard.** {folded(g['what'])} {folded(g['every_attack'])} None of these apply to it: {guard_never}. It "
            f"spends {folded(g['spends'])}.\n\n"
            f"**Firearms.** {folded(fa['start'])} {folded(fa['empty'])} {folded(fa['reload'])}")


def b_parley_asks():
    rows = []
    for a in load(SKIR)["parley"]["asks"]:
        keys = ("id", "name", "needs_add", "effect")
        expect_keys(a, set(keys), f"{SKIR} parley asks", required=keys)
        rows.append([a["name"], adds(a["needs_add"]), a["effect"]])
    return table(["Ask", "Adds to the needs", "On a success"], rows)


ROLL_KEYS = ("id", "name", "who", "entry", "needs", "help", "push", "retry")


def b_rolls(src):
    """Every roll a Chapter 7 file calls for states its Help and whether it is tried again (Chapter 1, 1.1 and 1.8)."""
    rows = []
    for r in load(src)["rolls"]:
        where = f"{src} rolls {r.get('id')}"
        # decision batch 9, 9-41, item 6: circumstances is an optional marker key, read by the
        # exclusion audit (data/core/circumstances.yaml, never) and never rendered into a table.
        expect_keys(r, set(ROLL_KEYS) | {"changes", "notes", "circumstances"}, where, required=ROLL_KEYS)
        for k in ROLL_KEYS:
            if not folded(r[k]):
                raise RenderError(f"{where}: {k} is empty")
        for c in r.get("changes", []):
            lookup(tracked_values(), c, f"{where} changes")
        rows.append([r["name"], r["who"], r["entry"], r["needs"], r["help"], r["push"], r["retry"], r.get("notes", "none")])
    return table(["Roll", "Who rolls", "Entry", "Needs", "Help", "Push", "Tried again", "Notes"], rows)


# decision batch 8, 8-9 (OQ-146): the Pinned state's closed lists (data/harm/effect-types.yaml, pinned). Help, Covering,
# and Reactions are the state's forbids rows (Chapter 1, section 1.9), and the moves are the state's own rule.
HOOK_ENTRIES = {"help", "cover", "dodge", "block"}
MOVE_ENTRIES = {"fly", "ride", "mount-or-dismount"}


def b_pinned_entries():
    d = load(EFF)["pinned"]
    cat = catalog()
    chosen = {eid for eid, e in cat.items() if e["kind"] in ("action", "option", "reaction")} | {"fly", "ride"}
    rows = []
    for key, label in (("limb_pin", "Limb pin"), ("body_pin", "Body pin")):
        where = f"{EFF} pinned {key}"
        p = d[key]
        expect_keys(p, {"allowed_entries", "forbids_entries", "body_part_strike"}, where,
                    required=("allowed_entries", "forbids_entries"))
        allowed, forbids = list(p["allowed_entries"]), list(p["forbids_entries"])
        for eid in allowed + forbids:
            if eid not in cat:
                raise RenderError(f"{where}: {eid} is not an Action Catalog entry")
        if set(allowed) & set(forbids):
            raise RenderError(f"{where}: {sorted(set(allowed) & set(forbids))} are on both lists")
        if set(allowed) & MOVE_ENTRIES:
            raise RenderError(f"{where}: {sorted(set(allowed) & MOVE_ENTRIES)} need a move")
        missing = chosen - set(allowed) - set(forbids) - HOOK_ENTRIES
        if missing:
            raise RenderError(f"{where}: {sorted(missing)} are on neither list")
        may = [entry_name(x, False) + (" (only against the Body Part that pins the soldier)"
                                        if x == "body-part-strike" and p.get("body_part_strike") else "") for x in allowed]
        rows.append([label, ", ".join(may) or "nothing", ", ".join(entry_name(x, False) for x in forbids)])
    return table(["Pin", "May take", "Cannot take"], rows)


def b_circumstances():
    """The Circumstances ladder (decision batch 9, 9-2; ADR-0024, limit 16).

    The effect column is read from each step's dice and kind, so the chapter never states a step's dice by hand.
    """
    rows = []
    for s in load(CIRC)["steps"]:
        keys = ("id", "name", "dice", "kind")
        where = f"{CIRC} steps {s.get('id')}"
        expect_keys(s, set(keys), where, required=keys)
        n, kind = s["dice"], s["kind"]
        if not isinstance(n, int) or isinstance(n, bool):
            raise RenderError(f"{where}: dice is not a whole number: {n!r}")
        if kind == "bonus":
            if n < 1:
                raise RenderError(f"{where}: a bonus step adds {n} dice")
            effect_ = f"+{n} Bonus {'Die' if n == 1 else 'Dice'}"
        elif kind == "none":
            if n != 0:
                raise RenderError(f"{where}: a step of kind none moves {n} dice")
            effect_ = "nothing"
        elif kind == "penalty":
            if n > -1:
                raise RenderError(f"{where}: a penalty step removes {n} dice")
            effect_ = f"a {-n}-die penalty"
        else:
            raise RenderError(f"{where}: unknown kind {kind!r}")
        rows.append([s["name"], effect_])
    return table(["Circumstances", "Effect on the pool"], rows)


# ------------------------------------------------------------------ registry
BLOCKS = {}


def block(name, chapter_, source, fn):
    if name in BLOCKS:
        raise RenderError(f"block {name} registered twice")
    BLOCKS[name] = dict(chapter=chapter_, source=source, fn=fn)


block("circumstances", CH1, CIRC, b_circumstances)
block("attributes", CH2, ATTR, b_attributes)
block("origins", CH2, ORIG, b_origins)
block("why-you-enlisted", CH2, ENL, b_enlistment)
block("training-years", CH2, TY, b_training_years)
for _y in ("year-1", "year-2", "year-3"):
    block(f"training-year-events {_y}", CH2, TY, lambda y=_y: b_year(y))
block("performance-merit", CH2, TY, b_merit)
block("class-rank", CH2, CR, b_class_rank)
block("graduation-exam-stages", CH2, EXAM, b_exam)
block("graduation-exam-trials", CH2, EXAM, b_exam_trials)
block("graduation-exam-conditions", CH2, EXAM, b_exam_conditions)
block("graduation-exam-issue", CH2, EXAM, b_exam_issue)
block("specialties", CH2, SPEC, b_specialties)
block("squadmate-templates", CH2, SQ, b_templates)
block("squadmate-rules", CH2, SQ, b_squadmate_rules)
block("talents-dice", CH2, TAL, lambda: b_talents("dice"))
block("talents-rule", CH2, TAL, lambda: b_talents("rule"))
block("action-catalog", CH2, CAT, b_catalog)
block("action-catalog-requirements", CH2, CAT, b_catalog_requirements)
block("tracked-values", CH2, CAT, b_tracked_values)
block("injury-types", CH3, CI, b_injury_types)
block("injury-location", CH3, CI, b_injury_location)
for _loc in ("arm", "leg", "torso", "head"):
    block(f"critical-injuries {_loc}", CH3, CI, lambda loc=_loc: b_critical_injuries(loc))
block("lost-limbs", CH3, CI, b_lost_limbs)
block("stress-responses", CH3, SR, b_stress_responses)
block("fear-rolls", CH3, FR, b_fear_rolls)
block("scars", CH3, SC, b_scars)
block("fall-bands", CH4, FALL, b_fall_bands)
block("fall-damage", CH4, FALL, b_fall_damage)
block("standard-issue", CH4, ISSUE, b_standard_issue)
block("squad-supply", CH4, SUP, b_squad_supply)
block("interim-setup", CH5, SETUP, b_interim_setup)
block("zone-fields", CH5, ZONES, b_zone_fields)
block("attachments", CH5, ZONES, b_attachments)
block("position-derivation", CH5, ZONES, b_position_derivation)
block("carry-costs", CH5, ZONES, b_carry_costs)
block("zone-effects", CH5, ZONES, b_zone_effects)
block("stride", CH5, SIZE, b_stride)
block("position-steps", CH5, ANCH, b_position_steps)
block("position-maps", CH5, ANCH, b_position_maps)
block("pinned-entries", CH5, EFF, b_pinned_entries)
block("interim-route", CH7, ROUTE, b_interim_route)
block("waypoint-kinds", CH7, ROUTE, b_waypoint_kinds)
block("pace", CH7, LEGS, b_pace)
block("formation-posts", CH7, LEGS, b_formation_posts)
block("leg-hazard-modifiers", CH7, HAZ, b_leg_hazard_modifiers)
block("leg-hazards", CH7, HAZ, b_leg_hazards)
block("night-hazards", CH7, HAZ, b_night_hazards)
block("rolls expedition", CH7, LEGS, lambda: b_rolls(LEGS))
block("rolls hazards", CH7, HAZ, lambda: b_rolls(HAZ))
block("downtime-actions", CH7, DOWN, b_downtime_actions)
block("rolls downtime", CH7, DOWN, lambda: b_rolls(DOWN))
block("requisition-gate", CH7, REQ, b_requisition_gate)
block("requisition-list", CH7, REQ, b_requisition_list)
block("rolls requisition", CH7, REQ, lambda: b_rolls(REQ))
block("skirmish-weapons", CH7, SKIR, b_skirmish_weapons)
block("foes", CH7, FOES, b_foes)
block("foe-rule", CH7, FOES, b_foe_rule)
block("parley-asks", CH7, SKIR, b_parley_asks)
block("rolls skirmish", CH7, SKIR, lambda: b_rolls(SKIR))


def marker(name):
    b = BLOCKS[name]
    return f"<!-- BEGIN RENDERED: {name} from {b['source']} -->\n<!-- END RENDERED: {name} -->"


PATTERN = re.compile(r"<!-- BEGIN RENDERED: (?P<name>.+?) from (?P<src>\S+) -->\n(?P<body>.*?)<!-- END RENDERED: (?P=name) -->",
                     re.S)


def render_chapter(rel):
    with open(os.path.join(ROOT, rel)) as fh:
        text = fh.read()
    problems, changed, seen = [], [], []

    def sub(m):
        name = m.group("name")
        b = BLOCKS.get(name)
        if b is None:
            problems.append(f"{rel}: unknown block {name!r}")
            return m.group(0)
        if b["chapter"] != rel:
            problems.append(f"{rel}: block {name!r} belongs in {b['chapter']}")
            return m.group(0)
        seen.append(name)
        try:
            body = b["fn"]()
        except (RenderError, KeyError, TypeError, ValueError, FileNotFoundError) as exc:
            problems.append(f"{rel}: block {name!r} cannot render: {type(exc).__name__}: {exc}")
            return m.group(0)
        new = f"<!-- BEGIN RENDERED: {name} from {b['source']} -->\n{body}\n<!-- END RENDERED: {name} -->"
        if new != m.group(0):
            changed.append(name if m.group("src") == b["source"] else f"{name} (marker names {m.group('src')})")
        return new

    new_text = PATTERN.sub(sub, text)
    if text.count("<!-- BEGIN RENDERED:") != len(PATTERN.findall(text)):
        problems.append(f"{rel}: a BEGIN RENDERED marker has no matching END RENDERED marker")
    for name in sorted(set(n for n in seen if seen.count(n) > 1)):
        problems.append(f"{rel}: block {name!r} appears more than once")
    for name, b in BLOCKS.items():
        if b["chapter"] == rel and name not in seen:
            problems.append(f"{rel}: block {name!r} is missing")
    return text, new_text, problems, changed


def main(argv):
    if len(argv) < 2 or argv[1] not in ("write", "check", "list") or (argv[1] != "write" and len(argv) != 2):
        print(__doc__)
        return 2
    cmd = argv[1]
    if cmd == "list":
        for name, b in BLOCKS.items():
            print(f"{b['chapter']}\t{name}\t{b['source']}")
        return 0
    chapters = argv[2:] or CHAPTERS
    unknown = [c for c in chapters if c not in CHAPTERS]
    if unknown:
        print(f"not a rendered chapter: {', '.join(unknown)}")
        return 2
    failed, total = False, 0
    for rel in chapters:
        text, new_text, problems, changed = render_chapter(rel)
        total += len(PATTERN.findall(new_text))
        for p in problems:
            print(p)
        failed |= bool(problems)
        if cmd == "write":
            if new_text != text:
                with open(os.path.join(ROOT, rel), "w") as fh:
                    fh.write(new_text)
                print(f"{rel}: rewrote {len(changed)} blocks")
        elif changed:
            print(f"{rel}: rendered blocks differ from the YAML: {', '.join(changed)}; run render.py write")
            failed = True
    if cmd == "check" and not failed:
        print(f"every rendered block matches the YAML ({total} blocks in {len(chapters)} chapters)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
