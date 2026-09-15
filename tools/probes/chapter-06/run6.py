"""Runs one Chapter 6 probe family and writes its figures to results/<family>.json.

Run from this directory with PyYAML, for example `uv run --with pyyaml python run6.py fight 12000`.
Families:
- check: titans.py's checks and move-up shares for every Titan (writes results/shares.json), that every
  harming effect names an Injury Type (decision batch 7, 7-5), and that every harming or terrorizing entry lists
  attack_dice, a telegraph-only entry none, the Abnormal inside Attack Dice 3 to 12, and Titan Dice succeed on
  5 or 6 (decision batch 8, 8-1).
- fight N: the full-fight cases in cases6.json, N fights per case.
- jam N: the Jam test for every Titan, one and two Titans, Help 0 to 3, Covered or not, N fights per cell,
  on the table (the acceptance reading), with every card at the kill pool (the upper bound), and for a
  holder who stays mounted at Distant (the share whose horse goes lame).
- solo N: the lone Nape strike for each build at Stress 0 to 3 against every Titan's Nape Depth.
- grab N: the Grab cells against every Titan's Grab, modelled as its fixed need (a third of its Attack Dice): alone, and one comrade in reach over the
  six witness cells.
- lone N: the lone fight (Chapter 5's lone.py under the rule as revised in decision batch 3b) against every
  Titan's Tempo, Nape Depth, and Behavior Table, on the waiting line, and at Tempo 2 also the hurried line and
  the one-card hold, N trials per line.
- fight N PREFIX: only the cases whose label starts with PREFIX (such as support or tactics), merged into
  results/fight.json with each case's own seed.
- bar N: every Sprinting Abnormal case in cases6.json with its standard Medium and Large twins (the row with
  the same support, or the reference row), N fights each with standard errors, for the Abnormal's bar read
  row against row (data/titans/tuning.yaml, targets, abnormals), in both Squad sheet orders: the player
  characters listed cutters first, and strikers first, each twin in the same order (decision batch 4, 4-4).
- bar N PREFIX: only the rows whose label starts with PREFIX, merged into results/bar.json with each row's
  own seeds (decision batch 3c re-ran the Sprinting Abnormal's support rows this way).
- check also runs fight6.py's horse-state selftest.
Seeds are fixed, so a command repeats its figures.
"""
import json
import os
import sys
from multiprocessing import Pool

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import titans  # noqa: E402

RESULTS = os.path.join(HERE, "results")


def save(name, data):
    os.makedirs(RESULTS, exist_ok=True)
    with open(os.path.join(RESULTS, f"{name}.json"), "w") as fh:
        json.dump(data, fh, indent=1, sort_keys=True)
    print(f"wrote results/{name}.json")


def family_check():
    out = {}
    bad = 0
    for tid in titans.titan_ids():
        t = titans.load_titan(tid)
        probs = titans.validate(t)
        bad += len(probs)
        out[tid] = {"problems": probs, **titans.share_report(t)}
        print(tid, "problems:", probs, "max kill share:", out[tid]["max_kill_share"])
    # The ladder format on every ladder, the standard one included (decision batch 4b, 4b-1).
    for lad in titans.LADDERS.values():
        probs = titans.ladder_format_problems(lad)
        bad += len(probs)
        print("ladder", lad["id"], "problems:", probs)
    probs = injury_type_problems()
    bad += len(probs)
    print("Injury Type problems:", probs)
    probs = titans.titan_dice_problems()
    bad += len(probs)
    print("Titan Dice problems:", probs)
    probs = heave_problems()
    bad += len(probs)
    print("Heave rating problems:", probs)
    save("shares", out)
    return bad


def heave_problems():
    """Every stat block has a Heave rating (decision batch 8, 8-9): a standard Titan takes its Size Class's
    (data/engagement/size-classes.yaml, heave) and lists none that differs; an Abnormal lists its own, a whole
    number of 1 or more."""
    out = []
    for tid in titans.titan_ids():
        t = titans.load_titan(tid)
        sc = titans.SIZES.get(t["size_class"], {})
        if not isinstance(sc.get("heave"), int) or sc["heave"] < 1:
            out.append(f"size-classes.yaml {t['size_class']}: no Heave rating")
        if t.get("abnormal"):
            if not isinstance(t.get("heave"), int) or t["heave"] < 1:
                out.append(f"{tid}: an Abnormal lists its own Heave rating, a whole number of 1 or more")
        elif "heave" in t and t["heave"] != sc.get("heave"):
            out.append(f"{tid}: Heave rating {t['heave']} differs from the {t['size_class']} row")
    return out


def injury_type_problems():
    """ADR-0003 item 11, as amended in decision batch 7 (7-5, OQ-137): every harming effect names its Injury Type.
    A critical-injury effect names it in injury_type, a Bite entry's is bite and every other entry's crush; a grab
    effect's harm is the Grab's crush, whose type grab.yaml names; a knock-loose fall's type is the one falls.yaml
    names."""
    types = {t["id"] for t in titans.load("data", "harm", "critical-injuries.yaml")["types"]}
    probs = []
    for tid in titans.titan_ids():
        for e in titans.entries(titans.load_titan(tid)):
            for eff in e["effects"]:
                if eff["type"] != "critical-injury":
                    continue
                it = eff.get("injury_type")
                if it not in types:
                    probs.append(f"{tid}/{e['id']}: a critical-injury effect names no Injury Type ({it!r})")
                    continue
                want = "bite" if e["name"] == "Bite" else "crush"
                if it != want:
                    probs.append(f"{tid}/{e['id']}: Injury Type {it}, but decision batch 7, 7-5 gives {want}")
    crush = titans.load("data", "engagement", "grab.yaml")["grab_lands"].get("crush_harm") or {}
    if crush.get("injury_type") not in types:
        probs.append("grab.yaml: the Grab's crush (grab_lands, crush_harm) names no Injury Type")
    if titans.load("data", "gear", "falls.yaml").get("injury_type") not in types:
        probs.append("falls.yaml: a fall (injury_type) names no Injury Type")
    return probs


def family_fight(n, only=None):
    """only: run just the cases whose label starts with it, keeping each case's seed and merging into
    the existing results/fight.json."""
    import fight6
    with open(os.path.join(HERE, "cases6.json")) as fh:
        cases = json.load(fh)
    out = {}
    path = os.path.join(RESULTS, "fight.json")
    if only and os.path.exists(path):
        with open(path) as fh:
            out = json.load(fh)
    for i, (label, cfg) in enumerate(cases):
        if only and not label.startswith(only):
            continue
        res = fight6.run_many(cfg, n, 60 + i)
        out[label] = {"cfg": cfg, "fights": n, **res}
        print(label, res, flush=True)
    save("fight", out)


def support_key(cfg):
    """What a row adds to the 4 player characters that another Titan's row can share: Squadmates and their
    role, the template Squad, Squad Tactics, the Grab escapes, and the player characters' roles when a row
    names them (the four-striker row, decision batch 4b, 4b-2, is read against the standard Titans'
    four-striker rows)."""
    sm = cfg.get("squadmates", 0)
    return (sm, cfg.get("squadmate_role", "helper") if sm else None, bool(cfg.get("template")),
            tuple(sorted(cfg.get("tactics", []))), bool(cfg.get("escapes")), tuple(cfg.get("roles") or ()))


def sensitivity_only(cfg):
    """A row whose addition no standard Titan's row shares (Draw Attention, a rider Squadmate, another ladder)."""
    return bool(cfg.get("draw_attention") or cfg.get("rungs") or cfg.get("squadmate_role") == "rider")


def bar_rows(cases):
    """Each Abnormal row with its twins: the standard Medium and Large Titans' rows with the same support, or
    their reference rows where they have none (data/titans/tuning.yaml, targets, abnormals)."""
    abnormal = {a["id"] for a in titans.TITAN_INDEX["abnormals"]}
    std = titans.TITAN_INDEX["standard_titans"]
    plain = lambda c: not (c.get("mounted_start") or c.get("start_fear") or c.get("dodge") or c.get("policy") != "eager")

    def twin(tid, cfg):
        key = support_key(cfg) if not sensitivity_only(cfg) else support_key({})
        for label, c in cases:
            if c["titan_id"] == tid and plain(c) and not sensitivity_only(c) and support_key(c) == key \
                    and not label.startswith("tactics:"):
                return label
        raise KeyError(f"no {tid} row for {key}")

    rows = []
    for label, cfg in cases:
        if cfg["titan_id"] in abnormal:
            rows.append({"abnormal": label, "medium": twin(std["medium"], cfg), "large": twin(std["large"], cfg)})
    return rows


BAR_ORDERS = (("cutters_first", 800), ("strikers_first", 1800))
# Decision batch 4b, 4b-4: a row past the tolerance on its first seed is re-run on a second seed in the same
# order (cutters first on seeds 2800 onward, strikers first on 3800 onward), the Abnormal row and both twins,
# and it fails only if the figure pooled over the two runs is past the tolerance.
SECOND_SEED = {"cutters_first": 2800, "strikers_first": 3800}
POOLED_MEANS = ("cis", "deaths", "nokill", "by2", "by3", "by4", "grabs")
POOLED_SES = ("cis_se", "deaths_se", "nokill_se")


def pooled(x, y):
    """Two runs of one case at the same number of fights: each mean figure averaged, and each standard error
    that of the mean over both runs. The median kill round is read exactly and stays the first run's."""
    out = dict(x)
    for key in POOLED_MEANS:
        if key in x and key in y:
            out[key] = round((x[key] + y[key]) / 2, 5)
    for key in POOLED_SES:
        out[key] = round((x[key] ** 2 + y[key] ** 2) ** 0.5 / 2, 5)
    out["seeds"] = 2
    return out


def second_seeds(out, rows, labels, cfgs, n, only=None):
    """Re-runs, on a second seed, every row whose bar reading fails a part read within sampling (everything
    but the median), and stores the runs and the pooled figures under second_seed (decision batch 4b, 4b-4)."""
    import fight6
    import render
    k = titans.load("data", "titans", "tuning.yaml")["targets"]["abnormals"]["sampling"]["standard_errors"]
    for order, _ in BAR_ORDERS:
        key = "figures" if order == "cutters_first" else order
        sec = out.setdefault("second_seed", {}).setdefault(key, {})
        for row in rows:
            labs = (row["abnormal"], row["medium"], row["large"])
            if any(lab not in out[key] for lab in labs):
                continue
            if only and not any(lab.startswith(only) for lab in labs):
                continue
            a, med, lg = (out[key][lab] for lab in labs)
            v = render.bar_verdict(a, med, lg, bool(a["cfg"].get("reference")), k)
            if not any(state == "fails" for part, state in v.items() if part != "median"):
                sec.pop(row["abnormal"], None)
                continue
            runs = {}
            for role, lab in zip(("abnormal", "medium", "large"), labs):
                runs[role] = fight6.run_many(dict(cfgs[lab], sheet_order=order), n, SECOND_SEED[order] + labels.index(lab))
            sec[row["abnormal"]] = {
                "runs": runs,
                "pooled": {role: pooled(out[key][lab], runs[role]) for role, lab in zip(("abnormal", "medium", "large"), labs)},
            }
            print(order, "| second seed |", row["abnormal"], {r: sec[row["abnormal"]]["pooled"][r]["deaths"] for r in runs}, flush=True)


def family_bar(n, only=None):
    """The Abnormal's bar, row against row (decision batch 3b; OQ-103): every Abnormal row and its standard
    Medium and Large twins at n fights each, with standard errors, in both Squad sheet orders (the player
    characters listed cutters first, then strikers first; decision batch 4, 4-4, which reads the bar under
    Chapter 5's last tie-break in both orders, with each twin run in the same order), written to
    results/bar.json under figures (cutters first, seeds 800 onward) and strikers_first (seeds 1800 onward).
    only: run just the rows whose label starts with it, keeping each row's seeds and merging into the
    existing results/bar.json when that file was run at the same n."""
    import fight6
    with open(os.path.join(HERE, "cases6.json")) as fh:
        cases = json.load(fh)
    rows = bar_rows(cases)
    labels = list(dict.fromkeys(l for r in rows for l in (r["abnormal"], r["medium"], r["large"])))
    cfgs = dict(cases)
    out = {"fights": n, "rows": rows, "figures": {}, "strikers_first": {}}
    path = os.path.join(RESULTS, "bar.json")
    if only and os.path.exists(path):
        with open(path) as fh:
            old = json.load(fh)
        if old.get("fights") == n:
            out["figures"] = old.get("figures", {})
            out["strikers_first"] = old.get("strikers_first", {})
            out["second_seed"] = old.get("second_seed", {})
    for order, base in BAR_ORDERS:
        key = "figures" if order == "cutters_first" else order
        for i, label in enumerate(labels):
            if only and not label.startswith(only):
                continue
            cfg = dict(cfgs[label], sheet_order=order)
            res = fight6.run_many(cfg, n, base + i)
            out[key][label] = {"cfg": cfg, **res}
            print(order, "|", label, {k: res[k] for k in ("median", "nokill", "nokill_se", "cis", "cis_se", "deaths", "deaths_se")}, flush=True)
    # A row past the tolerance on this seed is re-run on a second seed and read pooled (decision batch 4b, 4b-4).
    second_seeds(out, rows, labels, cfgs, n, only)
    save("bar", out)


def family_jam(n):
    import jam6
    jobs, keys = [], []
    seed = 6000
    for tid in titans.titan_ids():
        for reading in ("table", "kill"):
            for nt in (1, 2):
                for h in (0, 1, 2, 3):
                    for cover in (False, True):
                        seed += 1
                        jobs.append((tid, nt, h, cover, n, seed, reading == "kill"))
                        keys.append((tid, reading, nt, h, cover))
    # The mounted reading gets its own seeds after every table and kill cell, so those keep theirs.
    for tid in titans.titan_ids():
        for nt in (1, 2):
            for h in (0, 1, 2, 3):
                for cover in (False, True):
                    seed += 1
                    jobs.append((tid, nt, h, cover, n, seed, False, True))
                    keys.append((tid, "mounted", nt, h, cover))
    with Pool(os.cpu_count()) as p:
        vals = p.map(jam6.jam_cell, jobs)
    out = {}
    for (tid, reading, nt, h, cover), v in zip(keys, vals):
        cell = out.setdefault(tid, {}).setdefault(reading, {}).setdefault(f"{nt}_titans", {})
        cell[f"help_{h}{'_covered' if cover else ''}"] = round(100 * v, 1)
    for tid in out:
        for reading in out[tid]:
            for nt in out[tid][reading]:
                cells = out[tid][reading][nt]
                worst = max(cells, key=cells.get)
                cells["worst"] = {"cell": worst, "value": cells[worst]}
        print(tid, {r: {k: v["worst"] for k, v in out[tid][r].items()} for r in out[tid]})
    save("jam", out)


def family_solo(n):
    import lone6
    jobs, keys = [], []
    seed = 6500
    for tid in titans.titan_ids():
        for b in ("rookie", "veteran", "levi"):
            for st in (0, 1, 2, 3):
                seed += 1
                jobs.append((tid, b, st, n, seed))
                keys.append((tid, b, st))
    with Pool(os.cpu_count()) as p:
        vals = p.map(lone6.solo_cell, jobs)
    out = {}
    for (tid, b, st), v in zip(keys, vals):
        out.setdefault(tid, {"nape_depth": titans.load_titan(tid)["nape_depth"]}).setdefault(b, {})[f"stress_{st}"] = round(100 * v, 1)
    for tid in out:
        print(tid, {b: out[tid][b] for b in ("rookie", "veteran", "levi")})
    save("solo", out)


def family_grab(n):
    import lone6
    cells = [(1, 0), (2, 0), (3, 0), (1, 1), (2, 1), (3, 1)]
    jobs, keys = [], []
    seed = 6900
    for tid in titans.titan_ids():
        for label, kw in (("alone_dodge_failed", dict(comrades=0, witness_stress=1, grief=0, victim_dodged=True)),
                          ("alone_no_dodge", dict(comrades=0, witness_stress=1, grief=0, victim_dodged=False))):
            seed += 1
            jobs.append((tid, kw, 2 * n, seed))
            keys.append((tid, label))
        for st, g in cells:
            seed += 1
            jobs.append((tid, dict(comrades=1, witness_stress=st, grief=g, victim_dodged=True), n, seed))
            keys.append((tid, f"one_comrade_stress_{st}_grief_{g}"))
    with Pool(os.cpu_count()) as p:
        vals = p.map(lone6.grab_cell, jobs)
    out = {}
    for (tid, label), v in zip(keys, vals):
        t = titans.load_titan(tid)
        row = out.setdefault(tid, {"grab_attack_dice": lone6.grab_attack_dice(t)})
        row[label] = round(100 * v, 1)
    for tid in out:
        print(tid, out[tid])
    save("grab", out)


def family_lone(n):
    import lone6
    sys.path.insert(0, os.path.join(HERE, "..", "chapter-05"))
    import lone as lone5
    seed = 6600
    out = {}
    for tid in titans.titan_ids():
        t = titans.load_titan(tid)
        row = out.setdefault(tid, {"tempo": t["tempo"], "nape_depth": t["nape_depth"]})
        for line in lone6.LINES:
            seed += 1   # every Titan and line keeps its seed whether or not the line runs
            if line not in lone6.lone_lines(tid):
                continue
            r = lone5.run_many(lone6.lone_cfg(tid, line), n, seed)
            row[line] = {k: r[k] for k in ("usable_strike_share", "by_round", "median_round_struck", "mean_round_struck",
                                           "cards_before_strike", "cards_against_per_fight", "cis_per_fight", "deaths",
                                           "downs", "ends", "stress_at_strike", "kill_given_strike", "kill_per_fight",
                                           "feints", "dry")}
            print(tid, line, row[line], flush=True)
    save("lone", out)


if __name__ == "__main__":
    fam = sys.argv[1]
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    if fam == "check":
        bad = family_check()
        import fight6
        failures = fight6.selftest()
        print("horse-state selftest:", failures or "passed")
        sys.exit(1 if bad or failures else 0)
    if fam == "fight":
        family_fight(n, sys.argv[3] if len(sys.argv) > 3 else None)
    else:
        if fam == "bar":
            family_bar(n, sys.argv[3] if len(sys.argv) > 3 else None)
        else:
            {"jam": family_jam, "solo": family_solo, "grab": family_grab, "lone": family_lone}[fam](n)
