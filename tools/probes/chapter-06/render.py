"""Renders Chapter 6's tables from YAML into docs/rules/06-standard-titans.md, and collects probe results
into data/titans/probe-figures.yaml.

Run from this directory with PyYAML:
- `uv run --with pyyaml python render.py collect` writes data/titans/probe-figures.yaml from results/*.json.
- `uv run --with pyyaml python render.py write` replaces every rendered block in the chapter.
- `uv run --with pyyaml python render.py check` exits 1 if any rendered block differs from the YAML.

A rendered block sits between `<!-- BEGIN RENDERED: name -->` and `<!-- END RENDERED: name -->`. Nothing
between the markers is written by hand (ADR-0012).
"""
import json
import os
import re
import sys

import yaml

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import titans  # noqa: E402

ROOT = titans.ROOT
CHAPTER = os.path.join(ROOT, "docs", "rules", "06-standard-titans.md")
FIGURES = os.path.join(ROOT, "data", "titans", "probe-figures.yaml")
POS = {"distant": "Distant", "in-reach": "In Reach", "on-body": "On Body", "blind-spot": "Blind Spot"}
TIER = {"terrorize": "Terrorize", "control": "Control", "kill": "Kill", "thrash": "Thrash"}
KIND = {"eyes": "eyes", "arm": "arm", "leg": "leg"}


def positions(req):
    if req == titans.POSITIONS:
        return "Any"
    return ", ".join(POS[p] for p in req)


def injury_type_name(tid):
    """An Injury Type id -> its name (data/harm/critical-injuries.yaml, types; ADR-0017). KeyError on an unknown id."""
    return {t["id"]: t["name"] for t in titans.load("data", "harm", "critical-injuries.yaml")["types"]}[tid]


def effect_text(eff):
    """Every harming effect shows its Injury Type (ADR-0024, limit 11, as amended in decision batch 7, 7-5): a
    critical-injury effect its own, a Grab its crush's (grab.yaml), and a knock-loose its fall's (falls.yaml)."""
    typ = eff["type"]
    if typ == "stress":
        return f"Stress +{eff['amount']}"
    if typ == "telegraph":
        return "Telegraph"
    if typ == "knock-loose":
        return f"Knock loose (fall: {injury_type_name(titans.load('data', 'gear', 'falls.yaml')['injury_type'])})"
    if typ == "wreck":
        # decision batch 16, 16-20: the Titan's zone takes one rating step toward Open. It harms no soldier, so it
        # carries no Injury Type and never reaches the critical-injury fields below.
        return "Wreck (the Titan's zone takes one rating step toward Open)"
    if typ == "grab":
        crush = titans.load("data", "engagement", "grab.yaml")["grab_lands"]["crush_harm"]
        return f"Grab (crush: {injury_type_name(crush['injury_type'])})"
    sided = titans.load("data", "harm", "critical-injuries.yaml")["sides"]["sided_locations"]
    loc = eff["injury_location"]
    loc = "rolled location" if loc == "rolled" else f"{loc}, side rolled" if loc in sided else loc
    lethal = "cannot be lethal" if eff["cannot_be_lethal"] else "can be lethal"
    return f"{injury_type_name(eff['injury_type'])} Critical Injury ({loc}, {lethal})"


def parts_text(parts):
    """A kind listed once reads as the kind; a kind listed twice reads "both" (titan-format.yaml,
    entry_fields, body_parts_used: a kind listed twice needs two)."""
    if not parts:
        return "none"
    out = []
    for k in dict.fromkeys(parts):
        n = parts.count(k)
        out.append(KIND[k] if n == 1 else f"both {KIND[k]}s")
    return ", ".join(out)


def public_ids():
    """The Titans whose values players read: the standard Titans. An Abnormal's figures that show its
    hidden values are rendered only in its GM subsection (OQ-108)."""
    return [tid for tid in titans.titan_ids() if not titans.load_titan(tid)["abnormal"]]


def abnormal_ids():
    return [tid for tid in titans.titan_ids() if titans.load_titan(tid)["abnormal"]]


def entry_name(t, eid):
    if eid in ("thrash", "none"):
        return "Thrash" if eid == "thrash" else "none"
    return titans.by_id(t)[eid]["name"]


# ------------------------------------------------------------------ Titan blocks
def stat_block(tid):
    t = titans.load_titan(tid)
    sc = titans.SIZES[t["size_class"]]
    lad = titans.LADDERS[t["attention_ladder"]]
    parts = ", ".join(f"{p['id'].replace('-', ' ')} {p['toughness']}" for p in t["body_parts"])
    rows = [
        ("Source", f"`data/titans/{tid}.yaml`"),
        ("Size Class", f"{sc['name']} ({sc['height']})"),
        ("Abnormal", "yes" if t["abnormal"] else "no"),
        ("Tempo", t["tempo"]),
        ("Nape Depth", t["nape_depth"]),
        ("Regeneration clock", f"{t['regeneration_clock']} segments"),
        ("Body Parts and Toughness", parts),
        # decision batch 8, 8-9 (OQ-146): every stat block shows its Heave rating, an Abnormal's own or else its
        # Size Class's (data/engagement/size-classes.yaml, heave; run6.py check reads the same values).
        ("Heave rating", t["heave"] if "heave" in t else sc["heave"]),
        # decision batch 16, 16-16: every stat block shows its Stride, an Abnormal's own or else its Size Class's
        # (data/engagement/size-classes.yaml, stride; data/engagement/titan-format.yaml, stat_block, fields, stride).
        ("Stride", (lambda n: f"{n} zone" + ("" if n == 1 else "s"))(t["stride"] if "stride" in t else sc["stride"])),
        ("Attention Ladder", lad["name"]),
    ]
    if t["abnormal"]:
        rows.append(("Hidden until Read", "each Body Part's Toughness, Nape Depth, Regeneration clock length, Attention Ladder"))
    out = ["| Stat | Value |", "|---|---|"]
    out += [f"| {k} | {v} |" for k, v in rows]
    return "\n".join(out)


def behavior_table(tid):
    t = titans.load_titan(tid)
    out = ["| D6 | Behavior | Tier | Targets | Holder's Position | Body Parts used | Attack Dice | Effects | Fallback | Grab |",
           "|---|---|---|---|---|---|---|---|---|---|"]
    ents = sorted(titans.entries(t), key=lambda e: (e["results"] or [9])[0])
    for e in ents:
        res = ", ".join(str(r) for r in e["results"]) or "never rolled"
        tg = "holder" if e["targets"] == "holder" else "holder and everyone in their zone at their Position"  # titan-format.yaml, holder-and-position (decision batch 16, 16-18)
        eff = "; ".join(effect_text(x) for x in e["effects"])
        out.append(f"| {res} | {e['name']} | {TIER[e['tier']]} | {tg} | {positions(e['position_requirement'])} | "
                   f"{parts_text(e['body_parts_used'])} | {e.get('attack_dice', 'none')} | {eff} | {entry_name(t, e['fallback'])} | "
                   f"{'yes' if titans.is_grab(e) else 'no'} |")
    faces = " or ".join(str(f) for f in titans.FORMAT["titan_dice"]["success_faces"])
    out.append("")
    out.append(f"*Attack Dice are Titan Dice, rolled by the GM in the open when a card resolves the entry: each die that "
               f"shows {faces} is a success, and Titan Dice never Push and never take Bonus Dice, Help, Gear Dice, or "
               f"Stress Dice (Chapter 5, section 5.4).*")
    return "\n".join(out)


def behavior_text(tid):
    t = titans.load_titan(tid)
    ents = sorted(titans.entries(t), key=lambda e: (e["results"] or [9])[0])
    return "\n".join(f"- **{e['name']}.** {e['text']}" for e in ents)


def ladder(lid):
    lad = titans.LADDERS[lid]
    out = []
    for i, r in enumerate(lad["rungs"], 1):
        test = titans.TESTS[r]
        down = " A Down soldier can meet it." if test["down_can_meet"] else ""
        out.append(f"{i}. **{r}:** {' '.join(test['meaning'].split())}{down}")
    return "\n".join(out)


def shares_block():
    out = ["| Titan | Highest kill share, any state | Where | Fewest legal entries besides Thrash | Results a holder at In Reach meets |",
           "|---|---|---|---|---|"]
    for tid in titans.titan_ids():
        t = titans.load_titan(tid)
        rep = titans.share_report(t)
        ws = rep["worst_state"]
        broken = ", ".join(f"{v} {k}" for k, v in ws["broken"].items() if v) or "nothing Broken"
        prev = entry_name(t, ws["previous"]) if ws["previous"] else "no previous behavior"
        out.append(f"| {t['name']} | {rep['max_kill_share']:.2f} | previous {prev}; {broken} | "
                   f"{rep['min_legal_entries']} | {rep['in_reach_results']} of 6 |")
    return "\n".join(out)


def prev_shares_block(tid):
    t = titans.load_titan(tid)
    rep = titans.share_report(t)
    ids = [e["id"] for e in sorted(titans.entries(t), key=lambda e: (e["results"] or [9])[0])]
    head = "| Previous behavior | " + " | ".join(entry_name(t, i) for i in ids) + " | Kill share |"
    out = [head, "|---" * (len(ids) + 2) + "|"]
    for prev in ["None"] + ids:
        row = rep["by_previous_behavior"][prev]
        cells = " | ".join(f"{6 * row['shares'].get(i, 0):.0f}" for i in ids)
        label = "none" if prev == "None" else entry_name(t, prev)
        out.append(f"| {label} | {cells} | {row['kill_share']:.2f} |")
    return "\n".join(out)


def broken_shares_block(tid):
    t = titans.load_titan(tid)
    rep = titans.share_report(t)
    ids = [e["id"] for e in sorted(titans.entries(t), key=lambda e: (e["results"] or [9])[0])]
    head = "| Broken (no previous behavior) | " + " | ".join(entry_name(t, i) for i in ids) + " | Kill share |"
    out = [head, "|---" * (len(ids) + 2) + "|"]
    for key, row in rep["by_broken_parts"].items():
        cells = " | ".join(f"{6 * row['shares'].get(i, 0):.0f}" for i in ids)
        out.append(f"| {key} | {cells} | {row['kill_share']:.2f} |")
    return "\n".join(out)


# ------------------------------------------------------------------ figures
def figures():
    with open(FIGURES) as fh:
        return yaml.safe_load(fh)


def pct(v):
    return f"{v:.1f}%"


def case_order():
    with open(os.path.join(HERE, "cases6.json")) as fh:
        return [label for label, _ in json.load(fh)]


def fight_block(prefix):
    fig = figures()["fight"]
    out = ["| Case | Median kill round | By round 3 | By round 4 | No kill | Critical Injuries per fight | Deaths per fight during the fight | Grabs per fight | Grabs that kill | Jams per fight | Titan cards resolved per round |",
           "|---|---|---|---|---|---|---|---|---|---|---|"]
    for label in case_order():
        if not label.startswith(prefix) or label not in fig:
            continue
        r = fig[label]
        name = label.split(": ", 1)[1] if ": " in label else label
        out.append(f"| {name} | {r['median']} | {pct(r['by3'])} | {pct(r['by4'])} | {pct(r['nokill'])} | "
                   f"{r['cis']:.2f} | {r['deaths']:.3f} | {r['grabs']:.3f} | {pct(r['devour_share'])} | "
                   f"{r['jams']:.3f} | {r['cards_resolved_per_round']:.3f} |")
    return "\n".join(out)


def jam_block():
    fig = figures()["jam"]
    out = ["| Titan | One Titan, worst cell | Two Titans, worst cell | Two Titans, every card at the kill pool (upper bound) | Mounted holder at Distant, horse lame: one Titan; two Titans |",
           "|---|---|---|---|---|"]
    for tid in titans.titan_ids():
        t = titans.load_titan(tid)
        j = fig[tid]
        one = j["table"]["1_titans"]["worst"]
        two = j["table"]["2_titans"]["worst"]
        kill = j["kill"]["2_titans"]["worst"]
        cell = lambda w: f"{pct(w['value'])} ({w['cell'].replace('_', ' ')})"
        m1 = j["mounted"]["1_titans"]["worst"]
        m2 = j["mounted"]["2_titans"]["worst"]
        out.append(f"| {t['name']} | {cell(one)} | {cell(two)} | {cell(kill)} | {cell(m1)}; {cell(m2)} |")
    return "\n".join(out)


def solo_block(ids):
    fig = figures()["solo"]
    out = ["| Titan | Nape Depth | Rookie from Stress 0 | Rookie from Stress 1 | Veteran from Stress 2 | Levi-grade from Stress 2 |",
           "|---|---|---|---|---|---|"]
    for tid in ids:
        t = titans.load_titan(tid)
        s = fig[tid]
        out.append(f"| {t['name']} | {s['nape_depth']} | {pct(s['rookie']['stress_0'])} | **{pct(s['rookie']['stress_1'])}** | "
                   f"**{pct(s['veteran']['stress_2'])}** | **{pct(s['levi']['stress_2'])}** |")
    return "\n".join(out)


def grab_block():
    fig = figures()["grab"]
    out = ["| Titan | Grab Attack Dice | Alone, dodge failed | Alone, no dodge | One comrade S1 G0 | S2 G0 | S3 G0 | S1 G1 | S2 G1 | S3 G1 |",
           "|---|---|---|---|---|---|---|---|---|---|"]
    for tid in titans.titan_ids():
        t = titans.load_titan(tid)
        g = fig[tid]
        cells = " | ".join(pct(g[f"one_comrade_stress_{s}_grief_{gr}"]) for gr in (0, 1) for s in (1, 2, 3))
        grab_dice = max(e['attack_dice'] for e in titans.entries(t) if titans.is_grab(e))
        out.append(f"| {t['name']} | {grab_dice} | {pct(g['alone_dodge_failed'])} | {pct(g['alone_no_dodge'])} | {cells} |")
    return "\n".join(out)


LONE_LINE = {"waiting": "waiting", "hurried": "hurried", "one_card_hold": "waiting, one-card hold (before batch 3b)"}


def lone_block(ids):
    fig = figures()["lone"]
    out = ["| Titan | Tempo | Nape Depth | Line | Usable strike before the retreat | Round of the strike, median (mean) | Titan cards against the soldier before it | Titan cards against the soldier per fight | Critical Injuries per fight | Dead | Down | No decoy usable first | Still waiting when the retreat begins | Stress at the cut | Cut succeeds | Lone fights that kill |",
           "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for tid in ids:
        t = titans.load_titan(tid)
        row = fig[tid]
        for line, name in LONE_LINE.items():
            if line not in row:
                continue
            r = row[line]
            med = r["median_round_struck"]
            med = int(med) if float(med).is_integer() else med
            out.append(f"| {t['name']} | {row['tempo']} | {row['nape_depth']} | {name} | {pct(r['usable_strike_share'])} | "
                       f"{med} ({r['mean_round_struck']:.2f}) | {r['cards_before_strike']:.2f} | {r['cards_against_per_fight']:.2f} | "
                       f"{r['cis_per_fight']:.2f} | {pct(r['deaths'])} | {pct(r['downs'])} | {pct(r['ends']['no_decoy_usable'])} | "
                       f"{pct(r['ends']['retreat'])} | {r['stress_at_strike']:.2f} | {pct(r['kill_given_strike'])} | {pct(r['kill_per_fight'])} |")
    return "\n".join(out)


PAIR = "Hook and Cut and Hamstring Line, with the escapes"


def support_labels(tid):
    """The support rows ADR-0014 reports beside every table (decision batch 3b, 3b-8)."""
    ref = next(label for label in case_order() if label.startswith(tid + ":") and "(the reference start)" in label
               or label.startswith(tid + ":") and "(its reference start)" in label)
    return [
        ("none (the reference start)", ref),
        ("2 helper Squadmates", f"{tid}: 4 player characters and 2 helper Squadmates"),
        ("2 Squadmates screening beside the holder", f"support: {tid}: 4 player characters and 2 Squadmates screening beside the holder"),
        (PAIR, f"support: {tid}: 4 player characters, {PAIR}"),
        (f"2 Squadmates screening beside the holder, {PAIR}", f"support: {tid}: 4 player characters and 2 Squadmates screening beside the holder, {PAIR}"),
    ]


SUPPORT_HEAD = ("| Median kill round | By round 3 | No kill | Critical Injuries per fight | Deaths per fight during the fight | "
                "Grabs per fight | Titan cards resolved per round | Titan cards a decoy spent per round | Squad Tactic uses per fight |")


def support_cells(r):
    return (f"{r['median']} | {pct(r['by3'])} | {pct(r['nokill'])} | {r['cis']:.2f} | {r['deaths']:.3f} | {r['grabs']:.3f} | "
            f"{r['cards_resolved_per_round']:.3f} | {r['decoy_cards_per_round']:.3f} | {r['tactic_uses']:.2f} |")


def support_block():
    fig = figures()["fight"]
    out = ["| Titan | Support (4 Rookie player characters and) " + SUPPORT_HEAD, "|---" * 11 + "|"]
    for tid in titans.titan_ids():
        t = titans.load_titan(tid)
        for name, label in support_labels(tid):
            out.append(f"| {t['name']} | {name} | " + support_cells(fig[label]))
    return "\n".join(out)


TACTIC_ROWS = [
    ("none", "tactics: standard-medium: no Squad Tactic, with the escapes"),
    ("Hook and Cut", "tactics: standard-medium: Hook and Cut"),
    ("Hamstring Line", "tactics: standard-medium: Hamstring Line"),
    ("Clear the Hand", "tactics: standard-medium: Clear the Hand"),
    ("Fall Back", "tactics: standard-medium: Fall Back"),
    ("Hook and Cut and Hamstring Line", f"support: standard-medium: 4 player characters, {PAIR}"),
    ("Hook and Cut and Clear the Hand", "tactics: standard-medium: Hook and Cut and Clear the Hand"),
    ("Hook and Cut and Fall Back", "tactics: standard-medium: Hook and Cut and Fall Back"),
    ("Hamstring Line and Clear the Hand", "tactics: standard-medium: Hamstring Line and Clear the Hand"),
    ("Hamstring Line and Fall Back", "tactics: standard-medium: Hamstring Line and Fall Back"),
    ("Clear the Hand and Fall Back", "tactics: standard-medium: Clear the Hand and Fall Back"),
]


def tactics_block():
    fig = figures()["fight"]
    out = ["| Squad Tactics held (4 player characters, with the escapes) " + SUPPORT_HEAD, "|---" * 10 + "|"]
    for name, label in TACTIC_ROWS:
        out.append(f"| {name} | " + support_cells(fig[label]))
    return "\n".join(out)


BAR_PARTS = ("median", "floor", "deaths_floor", "winnable", "ceiling")


def bar_verdict(a, med, lg, reference, k):
    """The Abnormal's bar (data/titans/tuning.yaml, targets, abnormals), read row against row with a sampling
    tolerance of k standard errors of the difference. Returns {part: "holds" | "within sampling" | "fails"}."""
    def side(diff, se):
        if diff <= 0:
            return "holds"
        return "within sampling" if diff <= k * se else "fails"

    def se2(x, y, key):
        return (x[key + "_se"] ** 2 + y[key + "_se"] ** 2) ** 0.5

    out = {"median": "holds" if 2 <= a["median"] <= 4 else "fails",
           "floor": side(med["cis"] - a["cis"], se2(a, med, "cis")),
           "winnable": side(a["nokill"] - lg["nokill"], se2(a, lg, "nokill")),
           "ceiling": side(a["deaths"] - lg["deaths"], se2(a, lg, "deaths"))}
    if reference:
        out["deaths_floor"] = side(med["deaths"] - a["deaths"], se2(a, med, "deaths"))
    return out


BAR_ORDERS = (("figures", "cutters first"), ("strikers_first", "strikers first"))


def bar_block(tid):
    """The bar in both Squad sheet orders (decision batch 4, 4-4): each Abnormal row and its twins run with the
    player characters listed cutters first, and again strikers first."""
    bar = figures()["bar"]
    ab = titans.load("data", "titans", "tuning.yaml")["targets"]["abnormals"]
    rule = ab["sampling"]
    k = rule["standard_errors"]
    # Round 3 retune, R7: a row that gives the Abnormal a ladder it does not have is run with its twins and
    # reported beside the bar, never judged by it, so its Bar column reads "reported:" and carries no verdict.
    reported_rows = set(ab.get("reported_rows", ()))
    out = [f"| Row ({bar['fights']:,} fights each) | Squad sheet order | Median kill round | Critical Injuries per fight: it; standard Medium Titan's row | "
           "Deaths per fight during the fight: it; standard Medium Titan's row (reference only) | No kill: it; standard Large Titan's row | "
           "Deaths per fight during the fight: it; standard Large Titan's row | Bar |",
           "|---|---|---|---|---|---|---|---|"]
    for row in bar["rows"]:
        if not row["abnormal"].startswith(tid + ":") and not row["abnormal"].startswith(f"support: {tid}:"):
            continue
        name = row["abnormal"].split(f"{tid}: ", 1)[1]
        for key, order in BAR_ORDERS:
            fig = bar[key]
            a, med, lg = fig[row["abnormal"]], fig[row["medium"]], fig[row["large"]]
            # decision batch 4b, 4b-4: a row past the tolerance on its first seed is re-run on a second seed in
            # the same order, and read on the figures pooled over the two runs (run6.py bar, second_seed).
            second = bar.get("second_seed", {}).get(key, {}).get(row["abnormal"])
            pooled_note = ""
            if second:
                a, med, lg = second["pooled"]["abnormal"], second["pooled"]["medium"], second["pooled"]["large"]
                pooled_note = ", pooled over two seeds"
            ref = bool(a["cfg"].get("reference"))
            v = bar_verdict(a, med, lg, ref, k)
            fails = [p for p in BAR_PARTS if v.get(p) == "fails"]
            near = [p for p in BAR_PARTS if v.get(p) == "within sampling"]
            if fails:
                verdict = "fails: " + ", ".join(fails) + (f" ({pooled_note[2:]})" if pooled_note else "")
            elif near:
                verdict = "holds (" + ", ".join(near) + " within sampling" + pooled_note + ")"
            else:
                verdict = "holds" + (f" ({pooled_note[2:]})" if pooled_note else "")
            if row["abnormal"] in reported_rows:
                verdict = "reported: " + verdict
            dfloor = f"{a['deaths']:.3f}; {med['deaths']:.3f}" if ref else "not read"
            out.append(f"| {name} | {order} | {a['median']} | {a['cis']:.2f}; {med['cis']:.2f} | {dfloor} | "
                       f"{pct(a['nokill'])}; {pct(lg['nokill'])} | {a['deaths']:.3f}; {lg['deaths']:.3f} | {verdict} |")
    return "\n".join(out)


def reference_row(tid):
    fig = figures()["fight"]
    for label in case_order():
        r = fig.get(label)
        if r and r["cfg"]["titan_id"] == tid and r["cfg"].get("reference"):
            return r
    raise KeyError(tid)


def setup_mix_block():
    """Each Titan's reference row, weighted by how often the interim setup table makes it the Focus
    Titan (data/engagement/engagement-setup.yaml), with and without the medium_abnormal roll."""
    setup = titans.load("data", "engagement", "engagement-setup.yaml")
    size = {}
    for row in setup["size_class"]["rows"]:
        size[row["size_class"]] = size.get(row["size_class"], 0) + len(row["results"]) / 6
    ab = {}
    for row in setup["medium_abnormal"]["rows"]:
        ab[row["titan"]] = ab.get(row["titan"], 0) + len(row["results"]) / 6
    std = titans.TITAN_INDEX["standard_titans"]
    without = {std[c]: p for c, p in size.items()}
    with_roll = {std["small"]: size["small"], std["large"]: size["large"]}
    for tid, p in ab.items():
        with_roll[tid] = with_roll.get(tid, 0) + size["medium"] * p
    out = ["| Interim setup table | Sprinting Abnormal as Focus Titan | Critical Injuries per Titan Engagement | Deaths per Titan Engagement |",
           "|---|---|---|---|"]
    for name, mix in (("without the medium_abnormal roll", without), ("with the medium_abnormal roll", with_roll)):
        cis = sum(p * reference_row(tid)["cis"] for tid, p in mix.items())
        deaths = sum(p * reference_row(tid)["deaths"] for tid, p in mix.items())
        share = mix.get("sprinting-abnormal", 0)
        share_txt = f"1 in {round(1 / share)}" if share else "never"
        out.append(f"| {name} | {share_txt} | {cis:.2f} | {deaths:.3f} |")
    return "\n".join(out)


FOUR_STRIKERS = "4 eager strikers and no cutters"


def four_strikers_block():
    """Decision batch 4b, 4b-2: the baseline Squad (two cutters, two strikers) beside four eager strikers and no
    cutters, on Chapter 5's reference Titan and every Chapter 6 table. Reported beside the prepared-Squad target,
    not tuned; the target is read under the baseline (ADR-0014, as amended in decision batch 4b; OQ-112)."""
    fig = figures()["fight"]
    order = case_order()
    port = next(label for label in order if label.startswith("port check"))
    port4 = next(label for label in order if label.startswith("four strikers:"))
    pairs = [("Chapter 5's reference Medium Titan", fig[port], fig[port4])]
    for tid in titans.titan_ids():
        pairs.append((titans.load_titan(tid)["name"], reference_row(tid), fig[f"{tid}: {FOUR_STRIKERS}"]))
    out = ["| Titan | Squad | Median kill round | By round 3 | No kill | Critical Injuries per fight | "
           "Deaths per fight during the fight | Grabs per fight | Nape strikes per fight | Body Part strikes per fight |",
           "|---|---|---|---|---|---|---|---|---|---|"]
    for name, base, four in pairs:
        for squad, r in (("baseline: 2 cutters, 2 strikers", base), ("4 strikers, no cutters", four)):
            out.append(f"| {name} | {squad} | {r['median']} | {pct(r['by3'])} | {pct(r['nokill'])} | {r['cis']:.2f} | "
                       f"{r['deaths']:.3f} | {r['grabs']:.3f} | {r['napes']:.2f} | {r['bodies']:.2f} |")
    return "\n".join(out)


def blocks():
    b = {}
    for tid in titans.titan_ids():
        b[f"stat-block {tid}"] = lambda tid=tid: stat_block(tid)
        b[f"behavior-table {tid}"] = lambda tid=tid: behavior_table(tid)
        b[f"behavior-text {tid}"] = lambda tid=tid: behavior_text(tid)
        b[f"previous-shares {tid}"] = lambda tid=tid: prev_shares_block(tid)
        b[f"broken-shares {tid}"] = lambda tid=tid: broken_shares_block(tid)
    for lad in titans.TITAN_INDEX["ladders"]:
        b[f"ladder {lad['id']}"] = lambda lid=lad["id"]: ladder(lid)
    b["shares"] = shares_block
    for tid in titans.titan_ids():
        b[f"fight {tid}"] = lambda tid=tid: fight_block(tid + ":")
    b["fight port-check"] = lambda: fight_block("port check")
    b["jam"] = jam_block
    b["solo"] = lambda: solo_block(public_ids())
    b["lone-fight"] = lambda: lone_block(public_ids())
    for tid in abnormal_ids():
        b[f"solo {tid}"] = lambda tid=tid: solo_block([tid])
        b[f"lone-fight {tid}"] = lambda tid=tid: lone_block([tid])
        b[f"bar {tid}"] = lambda tid=tid: bar_block(tid)
    b["support"] = support_block
    b["four-strikers"] = four_strikers_block
    b["tactics standard-medium"] = tactics_block
    b["grab"] = grab_block
    b["setup-mix"] = setup_mix_block
    return b


PATTERN = re.compile(r"(<!-- BEGIN RENDERED: (?P<name>[^>]+?) -->\n)(?P<body>.*?)(<!-- END RENDERED: (?P=name) -->)", re.S)


def render_chapter(text):
    b = blocks()
    missing = []

    def sub(m):
        name = m.group("name")
        if name not in b:
            missing.append(name)
            return m.group(0)
        try:
            body = b[name]()
        except (KeyError, FileNotFoundError, TypeError, ZeroDivisionError):
            missing.append(f"{name} (figures not collected)")
            return m.group(0)
        return m.group(1) + body + "\n" + m.group(4)

    return PATTERN.sub(sub, text), missing


def collect():
    out = {}
    for fam in ("shares", "fight", "jam", "solo", "grab", "lone", "bar"):
        path = os.path.join(HERE, "results", f"{fam}.json")
        if os.path.exists(path):
            with open(path) as fh:
                out[fam] = json.load(fh)
    header = ("# Probe figures for Chapter 6, generated by tools/probes/chapter-06/render.py collect from\n"
              "# tools/probes/chapter-06/results/*.json. Do not edit by hand: re-run the probes\n"
              "# (data/titans/tuning.yaml, commands) and collect again. docs/rules/06-standard-titans.md\n"
              "# renders its figure tables from this file (ADR-0012).\n")
    with open(FIGURES, "w") as fh:
        fh.write(header)
        yaml.safe_dump(out, fh, sort_keys=True, width=110)
    print("wrote data/titans/probe-figures.yaml")


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "collect":
        collect()
        sys.exit(0)
    with open(CHAPTER) as fh:
        text = fh.read()
    new, missing = render_chapter(text)
    if missing:
        print("unknown or uncollected blocks:", missing)
        if cmd == "check":
            sys.exit(1)
    if cmd == "write":
        with open(CHAPTER, "w") as fh:
            fh.write(new)
        print("rendered", len(PATTERN.findall(new)), "blocks")
    elif cmd == "check":
        if new != text:
            print("rendered blocks differ from the YAML; run render.py write")
            sys.exit(1)
        print("every rendered block matches the YAML")
