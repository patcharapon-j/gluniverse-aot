"""Runs every simulator case, the bar's second seeds, and the re-checks; writes tools/sim/results/results.json;
and renders docs/reviews/simulator-report.md. One command, from the repository root:

    uv run --with pyyaml python tools/sim/run.py

Options:
    --scale 0.05   every case at 5% of its trials, into results/results-scale.json and results/report-scale.md
                   (a smoke run; results.json and the committed report are left alone)
    --report       re-render the report from results/results.json only; refuses when any file of the rules
                   snapshot or the engine differs from the one the results record
    --stale-ok     with --report, render anyway and list those files, and report.ENGINE_CHANGES_SINCE_RUN when the
                   engine differs, at the top of the report
    --commit-probe-figures
                   re-commit data/titans/probe-figures.yaml from results/results.json (decision batch 8, plan WP-S2),
                   keeping the figures it replaces in results.json, where the report's comparisons read them
    --accept-noted-changes
                   record, in results.json, the current hash of every file changed since the run that
                   report.SNAPSHOT_CHANGE_NOTES explains (review fix plan, section 5, (b)); refuses while any changed
                   file has no note. --report then renders with the notes and still refuses any later edit

Passes, all inside the one command:
1. every case (cases.all_cases);
2. second seeds: the bar's (decision batch 4b, 4b-4), each Abnormal row, in the bar or its Grab-alone variant,
   past a limit under either death reading in an order, re-run with its twins in that order; and the targets'
   (decision batch 5, 5-11; targets.py), each case with a judged figure past a band's edge by at most 2 standard
   errors. results.json keeps each case pooled over both seeds under pooled, by its first key;
3. re-checks (recheck.py): every case with a figure past 3 standard errors from its committed probe figure is
   re-run on new seeds, and a Chapter 6 full-fight row on the committed probe as well. --no-recheck skips this pass
   for the first run after a rule change, when the probe figures are stale and a flag is a change, not noise;
4. the move-up shares and the lone route search, which are exact enumerations.

The rules snapshot is the SHA-256 of every file under docs/rules/ and data/, and of the simulator's own source.
docs/rules/OPEN-QUESTIONS.md and docs/rules/PROGRESS.md are hashed and listed but left out of the staleness test:
no case reads them, and report.py only checks that the Open Question ids it cites exist.
"""
import sys

sys.dont_write_bytecode = True     # the re-checks import the committed probe; nothing is written under tools/

import argparse   # noqa: E402
import copy       # noqa: E402
import datetime   # noqa: E402
import hashlib    # noqa: E402
import json       # noqa: E402
import os         # noqa: E402
import time       # noqa: E402
from multiprocessing import Pool   # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import barcheck as B   # noqa: E402
import cases as C      # noqa: E402
import families as F   # noqa: E402
import recheck as RC   # noqa: E402
import targets as TG   # noqa: E402

SNAPSHOT_DIRS = ("docs/rules", "docs/adr", "data")     # report.py reads ADR-0014's target words
NOT_RULES = {"docs/rules/OPEN-QUESTIONS.md", "docs/rules/PROGRESS.md"}
ENGINE_FILES = ("rules.py", "dice.py", "engine.py", "policy.py", "families.py", "cases.py", "barcheck.py",
                "targets.py", "recheck.py", "run.py")
RENDER_FILES = ("report.py", "README.md")

# The probe re-check: a Chapter 6 full-fight row flagged against data/titans/probe-figures.yaml is re-run on
# tools/probes/chapter-06/fight6.py as well. Decision batch 8, 8-1: probe-figures.yaml was re-committed from the full
# rerun's figures (--commit-probe-figures, plan WP-S2), so rows are flagged against the simulator's Attack Dice
# figures. fight6.py still reads a fixed need of a third of each entry's Attack Dice, so its re-run of a flagged row
# is a second opinion under that older model, not a second measurement of the rules.
PROBE_RECHECK = True
PROBE_FIGURES = os.path.join("data", "titans", "probe-figures.yaml")
# Keys the committed file names differently from the simulator's summaries (families.summarize_fight, summarize_lone).
FIGURE_RENAMES = {"fight": {"decoy_cards_per_fight": "decoy_cards", "decoys_per_fight": "decoys",
                            "lethal_end": "lethal_at_end", "refunds": "grab_dodge_refunds"},
                  "lone": {"cards_against_per_fight": "cards_against", "cis_per_fight": "cis", "deaths": "dead",
                           "downs": "down"}}
SOLO_BUILDS = (("rookie", "rookie"), ("veteran", "veteran"), ("levi_grade", "levi"))
PROBE_FIGURES_HEADER = (
    "# Probe figures for Chapter 6, re-committed from the simulator's full rerun by tools/sim/run.py\n"
    "# --commit-probe-figures (decision batch 8, plan WP-S2): the run whose snapshot was taken {taken}, rules hash\n"
    "# {rules}. Each figure is the simulator case of the same label (ch6/, bar/, lone/, solo/, grab/, jam/), under\n"
    "# Attack Dice; each cfg, tempo, Nape Depth, the Grab's Attack Dice, and the bar's rows are kept. Do not edit by\n"
    "# hand. tools/probes/chapter-06/render.py collect would overwrite this file with the probes' figures, which still\n"
    "# read a fixed need (fight6.py). docs/rules/06-standard-titans.md renders its figure tables from this file\n"
    "# (ADR-0012).\n")

JOBS = {"fight": F.fight_job, "lone": F.lone_job, "solo": F.solo_job, "grab": F.grab_job, "jam": F.jam_job,
        "gas": F.gas_job, "dodge": F.dodge_job, "sequence": F.sequence_job, "skirmish": F.skirmish_job}
COST = {"fight": 6, "lone": 4, "grab": 3, "solo": 1, "jam": 1, "gas": 1, "dodge": 1, "sequence": 24, "skirmish": 3}


# ---------------------------------------------------------------------- the rules snapshot
def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        h.update(fh.read())
    return h.hexdigest()


def snapshot():
    files = {}
    for d in SNAPSHOT_DIRS:
        for dirpath, dirnames, names in os.walk(os.path.join(ROOT, d)):
            dirnames.sort()
            for name in sorted(names):
                if name.startswith("."):
                    continue
                p = os.path.join(dirpath, name)
                files[os.path.relpath(p, ROOT)] = sha(p)
    for name in ENGINE_FILES + RENDER_FILES:
        p = os.path.join(HERE, name)
        files[os.path.relpath(p, ROOT)] = sha(p)

    def combined(pred):
        h = hashlib.sha256()
        for p in sorted(files):
            if pred(p):
                h.update(f"{p}\0{files[p]}\n".encode())
        return h.hexdigest()
    sim = os.path.relpath(HERE, ROOT)
    return dict(files=files, taken_utc=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                rules_hash=combined(lambda p: not p.startswith(sim) and p not in NOT_RULES),
                docs_and_data_hash=combined(lambda p: not p.startswith(sim)),
                engine_hash=combined(lambda p: p.startswith(sim) and os.path.basename(p) in ENGINE_FILES),
                stale_test_excludes=sorted(NOT_RULES) + [os.path.join(sim, n) for n in RENDER_FILES])


def render_snapshot():
    """The hashes of the simulator's source when the report is rendered, printed beside the run's snapshot: report.py
    holds the coverage map, the target statuses, and the explanations, so the renderer that wrote a report's text
    is named even when --report renders results an earlier renderer's run wrote."""
    files = {os.path.relpath(os.path.join(HERE, n), ROOT): sha(os.path.join(HERE, n)) for n in ENGINE_FILES + RENDER_FILES}
    h = hashlib.sha256()
    for p in sorted(files):
        if os.path.basename(p) in ENGINE_FILES:
            h.update(f"{p}\0{files[p]}\n".encode())
    return dict(files=files, engine_hash=h.hexdigest(),
                taken_utc=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"))


def stale_files(recorded, after=None, noted=(), committed=None):
    """Files that differ from the run's snapshot. A file that changed while the run was going is not stale when
    report.SNAPSHOT_CHANGE_NOTES explains the change and the file still matches the snapshot taken after the run:
    the report then prints both snapshots and the note. A file --commit-probe-figures wrote or recorded after the
    run (results.json, post_run_commits) is not stale when the notes explain it and it still matches that hash."""
    now = snapshot()["files"]
    old = recorded["files"]
    skip = set(recorded["stale_test_excludes"])
    out = []
    for p in sorted(set(now) | set(old)):
        if p in skip or now.get(p) == old.get(p):
            continue
        if after is not None and p in noted and now.get(p) == after["files"].get(p):
            continue
        if committed and p in noted and now.get(p) == committed.get(p):
            continue
        out.append(p)
    return out


# ---------------------------------------------------------------------- running cases
def work(args):
    fam, cfg, n, seed, idx = args
    if fam == "probe":
        return idx, RC.probe_job((cfg, n, seed))
    return idx, JOBS[fam]((cfg, n, seed))


def summarize(case, acc):
    fam = case["family"]
    n = acc["n"]
    if fam == "fight":
        return F.summarize_fight(acc)
    if fam == "lone":
        return F.summarize_lone(acc)
    if fam == "solo":
        return F.summarize_solo(acc)
    if fam == "grab":
        return F.summarize_grab(acc)
    if fam == "dodge":
        return F.summarize_rate(acc, "ok")
    if fam == "jam":
        out = F.summarize_rate(acc, "jammed")
        out["jammed"] = out["rate"]
        return out
    if fam == "gas":
        return dict(trials=n, median=F.median_from(acc["hist"]["rounds"], n), mean=acc["sum"]["rounds"] / n)
    if fam == "sequence":
        return F.summarize_sequence(acc)
    if fam == "skirmish":
        return F.summarize_skirmish(acc)
    raise ValueError(fam)


def run_cases(pool, cases, t0, label):
    jobs = []
    for ci, c in enumerate(cases):
        base, rem = divmod(c["n"], C.CHUNKS)
        for i in range(C.CHUNKS):
            jobs.append((c["family"], c["cfg"], base + (rem if i == 0 else 0), c["seed"] * 1000 + i, ci))
    jobs.sort(key=lambda j: -COST.get(j[0], 8) * j[2])
    accs = [None] * len(cases)
    for done, (ci, acc) in enumerate(pool.imap_unordered(work, jobs, chunksize=1), 1):
        if cases[ci]["family"] == "probe":
            accs[ci] = (accs[ci] or []) + acc
        else:
            accs[ci] = F.merge(accs[ci], acc)
        if done % 1000 == 0 or done == len(jobs):
            print(f"{label}: {done}/{len(jobs)} chunks, {time.time() - t0:.0f} s", flush=True)
    return accs


def second_seed_cases(cases, summ):
    """The rows 4b-4 re-runs, with every twin they are read against, in the same order, under either reading; and
    every case holding a judged figure past a band's edge by at most 2 standard errors (targets.edge_keys)."""
    rows_def = C.PF["bar"]["rows"]
    ref_med = rows_def[0]["medium"]
    by_key = {c["key"]: c for c in cases}
    need = set()
    for prefix in ("bar", "grab_alone"):
        for order, _, _ in C.ORDERS:
            for r in rows_def:
                k = f"{prefix}/{order}/{r['abnormal']}"
                twins = [f"bar/{order}/{r['medium']}", f"bar/{order}/{r['large']}", f"bar/{order}/{ref_med}"]
                for reading in B.READINGS:
                    res = B.check(summ[k], *[summ[t] for t in twins], C.PF["fight"][r["abnormal"]]["cfg"].get("reference"),
                                  reading)
                    if B.past_any(res):
                        need.update([k] + twins)
    need.update(TG.edge_keys(summ))
    out = []
    seeds = {c["seed"] for c in cases}
    for k in sorted(need):
        c = by_key[k]
        seed = c["seed"] + C.SECOND_SEED_OFFSET
        if seed in seeds:
            raise ValueError(f"second seed {seed} for {k} repeats a seed already used")
        seeds.add(seed)
        out.append(dict(c, key=k.replace("/", "2/", 1), seed=seed, first_key=k))
    return out


def recheck_cases(cases, res):
    """Every case with a figure past 3 standard errors from its committed probe figure, on new seeds."""
    import report
    by_key = {c["key"]: c for c in cases}
    flagged = {}
    for cmp in report.comparisons(res):
        if abs(cmp["z"]) > 3 and not cmp.get("explained_by_rule") and cmp["key"] in by_key:
            fields = flagged.setdefault(cmp["key"], [])
            if cmp["field"] not in fields:
                fields.append(cmp["field"])
    out = []
    for k in sorted(flagged):
        c = by_key[k]
        out.append(dict(c, key="recheck/" + k, first_key=k, n=c["n"] * C.RECHECK_FACTOR,
                        seed=c["seed"] + C.RECHECK_SEED_OFFSET, figures=flagged[k]))
        if k.startswith("ch6/") and PROBE_RECHECK:
            out.append(dict(family="probe", key="probe/" + k, first_key=k, cfg=c["cfg"], n=c["n"] * C.RECHECK_FACTOR,
                            seed=c["seed"] + C.PROBE_SEED_OFFSET, figures=flagged[k]))
    return out


# ---------------------------------------------------------------------- re-committing the probe figures
def rounded(v):
    if isinstance(v, float):
        return round(v, 4)
    if isinstance(v, dict):
        return {k: rounded(x) for k, x in v.items()}
    if isinstance(v, list):
        return [rounded(x) for x in v]
    return v


def probe_figures_from(res, old):
    """data/titans/probe-figures.yaml rebuilt from a full run: every key the committed file holds, read from the case
    of the same label; each cfg, tempo, Nape Depth, the Grab's Attack Dice, and the bar's rows kept."""
    if set(old) != {"bar", "fight", "grab", "jam", "lone", "shares", "solo"}:
        raise ValueError(f"probe-figures.yaml sections changed: {sorted(old)}")
    by = {c["key"]: c["summary"] for c in res["cases"]}
    new = copy.deepcopy(old)

    def fight(s, com):
        return {k: (v if k == "cfg" else rounded(s[FIGURE_RENAMES["fight"].get(k, k)])) for k, v in com.items()}
    for label, com in old["fight"].items():
        new["fight"][label] = fight(by["ch6/" + label], com)
    bar = new["bar"]
    for order, sec in (("cutters_first", "figures"), ("strikers_first", "strikers_first")):
        for label, com in old["bar"][sec].items():
            bar[sec][label] = fight(by[f"bar/{order}/{label}"], com)
            if by[f"bar/{order}/{label}"]["fights"] != bar["fights"]:
                raise ValueError(f"bar/{order}/{label} ran a different number of fights")
        # decision batch 4b, 4b-4: a row read on two seeds, as render.py's bar table reads it
        bar["second_seed"][sec] = {}
        for r in old["bar"]["rows"]:
            keys = {part: f"bar/{order}/{r[part]}" for part in ("abnormal", "medium", "large")}
            if all(k in res["pooled"] for k in keys.values()):
                bar["second_seed"][sec][r["abnormal"]] = {"pooled": {
                    part: fight(res["pooled"][k], old["bar"][sec][r[part]]) for part, k in keys.items()}}
    for tid, row in old["lone"].items():
        for line in ("waiting", "hurried", "one_card_hold"):
            if line in row:
                s = by[f"lone/{tid}/{line}"]
                new["lone"][tid][line] = {k: rounded(s[FIGURE_RENAMES["lone"].get(k, k)]) for k in row[line]}
    for tid, v in old["solo"].items():
        for build, bk in SOLO_BUILDS:
            for sk in v[bk]:
                new["solo"][tid][bk][sk] = rounded(by[f"solo/nd{v['nape_depth']}/{build}/stress{sk.split('_')[1]}"]["hit"])
    for tid, v in old["grab"].items():
        new["grab"][tid] = {k: rounded(by[f"grab/{tid}/{k}"]["dead"]) for k in v
                            if k not in ("grab_attack_dice", "modelled_needs")}
        new["grab"][tid]["grab_attack_dice"] = v["grab_attack_dice"]
    for tid, v in old["jam"].items():
        for reading, nts in v.items():
            for nt, cells in nts.items():
                out = {c: rounded(by[f"jam/{tid}/{reading}/{nt}/{c}"]["jammed"]) for c in cells if c != "worst"}
                worst = max(out, key=out.get)     # the probes' rule (run6.py family_jam): the first highest cell
                out["worst"] = {"cell": worst, "value": out[worst]}
                new["jam"][tid][reading][nt] = out
    for tid, v in old["shares"].items():
        new["shares"][tid] = {k: res["shares"][tid].get(k, x) for k, x in v.items()}
    return new


def commit_probe_figures(out_path):
    import yaml
    with open(out_path) as fh:
        res = json.load(fh)
    path = os.path.join(ROOT, PROBE_FIGURES)
    now = sha(path)
    commits = res.setdefault("post_run_commits", {})
    if PROBE_FIGURES in commits:
        if now != commits[PROBE_FIGURES]:
            raise SystemExit(f"{PROBE_FIGURES} changed since it was re-committed from this run")
        old = res["probe_figures_at_run"]
    else:
        if now != res["snapshot"]["files"][PROBE_FIGURES] or now != res["snapshot_after_run"]["files"][PROBE_FIGURES]:
            raise SystemExit(f"{PROBE_FIGURES} differs from the run's snapshot; it cannot be re-committed from this run")
        old = copy.deepcopy(C.PF)
        res["probe_figures_at_run"] = old
    new = probe_figures_from(res, old)
    with open(path, "w") as fh:
        fh.write(PROBE_FIGURES_HEADER.format(taken=res["snapshot"]["taken_utc"], rules=res["snapshot"]["rules_hash"][:16]))
        yaml.safe_dump(new, fh, sort_keys=True, width=110)
    commits[PROBE_FIGURES] = sha(path)
    commits[os.path.relpath(os.path.join(HERE, "run.py"), ROOT)] = sha(os.path.join(HERE, "run.py"))
    with open(out_path, "w") as fh:
        json.dump(res, fh, indent=1, sort_keys=True)
    print(f"wrote {PROBE_FIGURES}; results.json keeps the figures it replaced under probe_figures_at_run")


def accept_noted_changes(out_path):
    """Review fix plan, section 5, option (b): every file changed since the run that report.SNAPSHOT_CHANGE_NOTES
    explains is recorded at its current hash under post_run_commits, where stale_files accepts it while it matches.
    Refuses, recording nothing, while any changed file has no note."""
    import report
    with open(out_path) as fh:
        res = json.load(fh)
    commits = res.setdefault("post_run_commits", {})
    stale = stale_files(res["snapshot"], res.get("snapshot_after_run"), report.SNAPSHOT_CHANGE_NOTES, commits)
    missing = [p for p in stale if p not in report.SNAPSHOT_CHANGE_NOTES]
    if missing:
        raise SystemExit("no snapshot note (report.SNAPSHOT_CHANGE_NOTES) for: " + ", ".join(missing))
    now = snapshot()["files"]
    for p in stale:
        commits[p] = now[p]
    with open(out_path, "w") as fh:
        json.dump(res, fh, indent=1, sort_keys=True)
    print(f"recorded {len(stale)} noted changes; {len(commits)} files accepted after the run")


# ---------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--scale", type=float, default=1.0)
    ap.add_argument("--report", action="store_true")
    ap.add_argument("--stale-ok", action="store_true",
                    help="with --report: render even if files differ from the run's snapshot, and list them at the top")
    ap.add_argument("--commit-probe-figures", action="store_true",
                    help="re-commit data/titans/probe-figures.yaml from results/results.json (plan WP-S2)")
    ap.add_argument("--no-recheck", action="store_true",
                    help="skip pass 3; for the first run after a rule change, when every probe figure is stale and each "
                         "flag is a real change rather than noise. Re-commit the probe figures after it")
    ap.add_argument("--accept-noted-changes", action="store_true",
                    help="record the hash of every changed file report.SNAPSHOT_CHANGE_NOTES explains")
    args = ap.parse_args()
    full = args.scale >= 1
    out_path = os.path.join(HERE, "results", "results.json" if full else "results-scale.json")
    if args.commit_probe_figures:
        if not full:
            raise SystemExit("--commit-probe-figures reads a full run only")
        commit_probe_figures(out_path)
        return
    if args.accept_noted_changes:
        accept_noted_changes(out_path)
        return
    import report
    if args.report:
        with open(out_path) as fh:
            res = json.load(fh)
        stale = stale_files(res["snapshot"], res.get("snapshot_after_run"), report.SNAPSHOT_CHANGE_NOTES,
                            res.get("post_run_commits"))
        if stale and not args.stale_ok:
            print("refusing to render: these files differ from the snapshot the results record "
                  "(re-run `uv run --with pyyaml python tools/sim/run.py`, or add --stale-ok to render with them "
                  "listed at the top of the report):")
            for p in stale:
                print("  " + p)
            sys.exit(1)
        report.write(res, full=full, render=render_snapshot(), stale=stale)
        return

    previous = None
    if os.path.exists(out_path):
        with open(out_path) as fh:
            try:
                previous = report.headlines(json.load(fh))
            except (KeyError, ValueError, TypeError) as exc:
                print(f"previous results unreadable for headline figures: {exc!r}")
    snap = snapshot()
    C.SCALE = args.scale
    cases = C.all_cases()
    t0 = time.time()
    procs = os.cpu_count() or 1
    with Pool(procs) as p:
        accs = run_cases(p, cases, t0, "cases")
        summ = {c["key"]: summarize(c, a) for c, a in zip(cases, accs)}
        second = second_seed_cases(cases, summ)
        print(f"second seed: {len(second)} cases (the bar and the targets)", flush=True)
        accs2 = run_cases(p, second, t0, "second seeds") if second else []
        first_acc = {c["key"]: a for c, a in zip(cases, accs)}
        pooled = {}
        for c, a in zip(second, accs2):
            pooled[c["first_key"]] = summarize(c, F.merge(copy.deepcopy(first_acc[c["first_key"]]), a))
        rows = [dict(c, summary=summ[c["key"]]) for c in cases]
        rows += [dict(c, summary=summarize(c, a)) for c, a in zip(second, accs2)]
        res = dict(scale=args.scale, cpus=procs, chunks=C.CHUNKS, cases=rows, pooled=pooled)
        rc = [] if args.no_recheck else recheck_cases(cases, res)
        print(f"re-checks: {'skipped (--no-recheck)' if args.no_recheck else f'{len(rc)} runs'}", flush=True)
        accs3 = run_cases(p, rc, t0, "re-checks") if rc else []
    rechecks = {}
    for c, a in zip(rc, accs3):
        entry = rechecks.setdefault(c["first_key"], {"figures": c["figures"]})
        if c["family"] == "probe":
            entry["probe"] = RC.probe_summary(a)
            entry["probe_seeds"] = f"{c['seed'] * 1000} to {c['seed'] * 1000 + C.CHUNKS - 1}"
        else:
            entry["sim"] = summarize(c, a)
            entry["sim_seeds"] = f"{c['seed'] * 1000} to {c['seed'] * 1000 + C.CHUNKS - 1}"
    res["rechecks"] = rechecks
    res["rechecks_skipped"] = bool(args.no_recheck)
    res["shares"] = {tid: F.share_report(tid) for tid in C.TITANS + ["reference-medium"]}
    res["route"] = F.route_check()
    res["runtime_seconds"] = round(time.time() - t0, 1)
    res["snapshot"] = snap
    after = snapshot()
    res["snapshot_changed_during_run"] = sorted(p for p in set(after["files"]) | set(snap["files"])
                                                if after["files"].get(p) != snap["files"].get(p))
    res["snapshot_after_run"] = after     # the report prints both, so a hash never stands for files that changed
    res["previous_headlines"] = previous
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as fh:
        json.dump(res, fh, indent=1, sort_keys=True)
    print(f"{len(rows)} cases, {sum(c['n'] for c in rows):,} trials, {res['runtime_seconds']:.0f} s on {procs} "
          f"processes -> {out_path}")
    report.write(res, full=full, render=render_snapshot(), stale=[])


if __name__ == "__main__":
    main()
