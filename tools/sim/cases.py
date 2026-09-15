"""Every case the simulator runs: family, key, configuration, trials, and seed.

Seeds are fixed. A case with seed S runs its trials in CHUNKS pieces seeded S * 1000 + i, whatever the CPU
count, so a run repeats its figures exactly; all_cases checks that no two cases share a seed. Seed bases by
family: Chapter 5 fights 10000, Chapter 6 fights 20000, Chapter 6 cases the probes left unrun and the ADR-0014
full-fight reports 21000, the rules this simulator added 23000, bar cutters first 30000 and strikers first
40000, the Grab-alone bar variant 50000 and 55000, lone fights 60000, the fresh lone cut 70000, Grab cells
80000, the probes' Jam test 90000, the full-fight Jam test 91000, dodges 95000, sequences 97000, gas 99000. A
bar row re-run on a second seed (decision batch 4b, 4b-4) runs on its first seed plus SECOND_SEED_OFFSET, and a
re-check of a figure past 3 standard errors on its first seed plus RECHECK_SEED_OFFSET.

Every dimension a tuning file states is read from it through rules.R (the fresh cut's Stress columns and
attempts, the Grab cells and trials, the Health reports, the template victims, the Jam test's rounds and
columns, the gas dice, the retreat clock, the fights per case and per bar row). Chapter 6's full-fight cases and the
bar rows come from data/titans/probe-figures.yaml (fight, bar). Chapter 5's cases are the rows of
data/engagement/tuning.yaml (prepared_squad_kill) that the current rules produce; rows that measure a superseded
rule are history and are not re-run.
"""
import itertools

from rules import R, load, parse, WORDS

CHUNKS = 16
SCALE = 1.0
SECOND_SEED_OFFSET = 100000
RECHECK_SEED_OFFSET = 500000
RECHECK_FACTOR = 5
PROBE_SEED_OFFSET = 700000   # a Chapter 6 row re-run on the committed probe; clear of every simulator seed above
DODGE_TRIALS = 200000        # tuning.yaml states no trial count for the dodges it reports beside the targets
SEQUENCE_TRIALS = 12000      # nor for sequences, which no probe ran
# PROVISIONAL (OQ-116): no rule gives this cadence; batch 7 (7-14) gives the Expedition's, which the simulator does
# not model yet, so the sequence keeps the interim day (report section 6.11)
SEQUENCE = dict(sessions=2, fights_per_session=2)


def n_of(n):
    return max(CHUNKS, int(n * SCALE))


PF = load("titans/probe-figures.yaml")
TITANS = R.titan_ids()
ABNORMAL_IDS = {a["id"] for a in R.titan_index["abnormals"]}

# ---------------------------------------------------------------------- Chapter 5 full fights
REF = {"titan_id": "reference-medium"}
ESC = {"escapes": True}


def _ch5():
    rows = [
        ("reference", {}, ("reference", "Medium, 4 Rookie player characters, eager strikers, dodge when harmed")),
        ("wait", {"policy": "wait"}, ("policies", "Medium, strikers wait")),
        ("lethal", {"dodge": "lethal"}, ("policies", "Medium, dodge only Grab and Bite")),
        ("stress0", {"stress": 0}, ("policies", "Medium, from Stress 0")),
        ("helpers", {"squadmates": 2}, ("squads", "Medium, 4 player characters and 2 helper Squadmates")),
        ("template", {"template": True}, ("squads", "Medium, template Squad (reported, not tuned)")),
        ("small", {"size_class": "small"}, ("size_classes", "Small, Tempo 2")),
        # the committed Large row's case text, whose last words name its pool (Severity before decision batch 8)
        ("large", {"size_class": "large"},
         ("size_classes", next(r["case"] for r in R.engagement_tuning["prepared_squad_kill"]["size_classes"]
                               if r["case"].startswith("Large, Tempo 1, Nape Depth 4, Regeneration 4, arm Toughness 3")))),
    ]
    # data/engagement/tuning.yaml, prepared_squad_kill, medium_attack_dice: the values come from each row's case text
    rows += [(key, over, (sec, text)) for sec, text, over, key in R.ch5_value_rows if sec == "medium_attack_dice"]
    rows += [
        ("decoyers", {"squadmates": 2, "squadmate_role": "decoyer"},
         ("decoys.rows", "Medium, 4 player characters and 2 Squadmates sending horses from distant that bolt (the rule)")),
        ("screen", {"squadmates": 2, "squadmate_role": "screen"},
         ("decoys.rows", "Medium, 4 player characters and 2 Squadmates screening from distant, horses then cloaks (the rule)")),
        ("screen2", {"squadmates": 2, "squadmate_role": "screen2"},
         ("decoys.rows", "Medium, 4 player characters and 2 Squadmates screening beside the Attention holder (the rule)")),
        ("screen2_no_feint", {"squadmates": 2, "squadmate_role": "screen2", "screen_feints": False},
         ("decoys.rows", "Medium, the same with decoys in a row and no Feint")),
    ]
    # data/engagement/tuning.yaml, prepared_squad_kill, alternatives_rejected: values from each row's case text
    rows += [(key, over, (sec, text)) for sec, text, over, key in R.ch5_value_rows if sec == "alternatives_rejected"]
    tactic_rows = [
        ([], "Medium, 4 player characters, no Squad Tactic"),
        (["hook"], "Hook and Cut"), (["hamstring"], "Hamstring Line"), (["clear"], "Clear the Hand"),
        (["fallback"], "Fall Back"), (["hook", "hamstring"], "Hook and Cut and Hamstring Line"),
        (["hook", "clear"], "Hook and Cut and Clear the Hand"), (["hook", "fallback"], "Hook and Cut and Fall Back"),
        (["hamstring", "clear"], "Hamstring Line and Clear the Hand"),
        (["hamstring", "fallback"], "Hamstring Line and Fall Back"),
        (["clear", "fallback"], "Clear the Hand and Fall Back"),
    ]
    for tac, text in tactic_rows:
        rows.append(("tactics " + ("+".join(tac) or "none"), dict(ESC, tactics=tac), ("squad_tactics.rows", text)))
    rows += [
        ("tactics helpers none", dict(ESC, squadmates=2),
         ("squad_tactics.rows", "4 player characters and 2 helper Squadmates, no Squad Tactic")),
        ("tactics helpers hook+hamstring", dict(ESC, squadmates=2, tactics=["hook", "hamstring"]),
         ("squad_tactics.rows", "4 player characters and 2 helper Squadmates, Hook and Cut and Hamstring Line")),
        ("tactics screen hook+hamstring", dict(ESC, squadmates=2, squadmate_role="screen", tactics=["hook", "hamstring"]),
         ("squad_tactics.rows", "4 player characters and 2 Squadmates screening from distant, Hook and Cut and Hamstring Line")),
        ("tactics screen2 hook+hamstring", dict(ESC, squadmates=2, squadmate_role="screen2", tactics=["hook", "hamstring"]),
         ("squad_tactics.rows", "4 player characters and 2 Squadmates screening beside the holder, Hook and Cut and Hamstring Line")),
        ("onfoot medium rule", {"squadmates": 2, "squadmate_role": "screen2"}, ("decoys.on_foot_feint", "medium_the_rule")),
        ("onfoot medium feint", {"squadmates": 2, "squadmate_role": "screen2", "onfoot_feint": True},
         ("decoys.on_foot_feint", "medium_with_the_on_foot_feint")),
        ("onfoot large rule", {"size_class": "large", "squadmates": 2, "squadmate_role": "screen2"},
         ("decoys.on_foot_feint", "large_the_rule")),
        ("onfoot large feint", {"size_class": "large", "squadmates": 2, "squadmate_role": "screen2", "onfoot_feint": True},
         ("decoys.on_foot_feint", "large_with_the_on_foot_feint")),
        ("four strikers", {"roles": ["striker"] * 4},
         ("squads", "Medium, 4 eager strikers and no cutters (four_strikers; reported, not tuned)")),
    ]
    out = []
    for i, (key, over, committed) in enumerate(rows):
        out.append(dict(family="fight", key="ch5/" + key, cfg=dict(REF, **over), n=n_of(R.fights_per_case), seed=10000 + i,
                        committed=committed))
    return out


# ---------------------------------------------------------------------- Chapter 6 full fights
def reference_label(tid):
    return next(l for l, v in PF["fight"].items() if v["cfg"].get("reference") and v["cfg"]["titan_id"] == tid)


def reference_cfg(tid):
    return dict(PF["fight"][reference_label(tid)]["cfg"])


def _ch6():
    return [dict(family="fight", key="ch6/" + label, cfg=dict(v["cfg"]), n=n_of(v["fights"]), seed=20000 + i, label=label)
            for i, (label, v) in enumerate(PF["fight"].items())]


def uses_kind(tid, kind):
    return any(kind in e["body_parts_used"] for e in R.titan_blocks[tid]["behavior_table"]["entries"])


def _ch6_extra():
    """Chapter 6's simulator_cases the probes left unrun, and the ADR-0014 reports on full fights."""
    rows = []
    med_tactics = [(l, v["cfg"]) for l, v in PF["fight"].items() if l.startswith("tactics: standard-medium: ")]
    for tid in TITANS:
        if tid == "standard-medium":
            continue
        start = {k: v for k, v in reference_cfg(tid).items() if k not in ("reference", "titan_id", "policy")}
        for label, cfg in med_tactics:
            rows.append((label.replace("standard-medium", tid), dict(cfg, titan_id=tid, **start), "tactics"))
    eyes = next(iter(R.flare_blocking_kinds))
    for tid in TITANS:
        if uses_kind(tid, eyes):
            rows.append((f"eyes: {tid}: cutters strike the eyes first, then legs and arms",
                         dict(reference_cfg(tid), cut_order=[eyes, "leg", R.grab_kind]), "eyes"))
    for tid in TITANS + ["reference-medium"]:
        base = reference_cfg(tid) if tid != "reference-medium" else dict(REF, policy="eager")
        rows.append((f"read: {tid}: a Tactician Squadmate Reads from Distant every round and Calls It",
                     dict(base, readers=1), "read"))
    for tid in sorted(ABNORMAL_IDS):
        rows.append((f"read: {tid}: cutters take Draw Attention once a Tactician's Read reveals its ladder",
                     dict(reference_cfg(tid), readers=1, draw_attention=True, draw_after_read=True), "read"))
    for tid in TITANS:
        for rating in R.setup_anchor:
            if rating != reference_cfg(tid).get("terrain", "wooded"):
                rows.append((f"setup: {tid}: its reference start at {rating}", dict(reference_cfg(tid), terrain=rating), "setup"))
    helpers = "standard-medium: 4 player characters and 2 helper Squadmates"
    for h in sorted(set(R.health_rows) - {R.builds["rookie"]["health"]}):
        rows.append((f"health: standard-medium: 4 player characters and 2 helper Squadmates, every soldier at Health {h}",
                     dict(PF["fight"][helpers]["cfg"], health=h), "health"))
    # OQ-112's simulator case: three strikers and one cutter beside four strikers and the baseline, on every table
    for tid in TITANS + ["reference-medium"]:
        four = (f"{tid}: 4 eager strikers and no cutters" if tid != "reference-medium" else
                "four strikers: reference Medium Titan, 4 eager strikers and no cutters (Chapter 5's reference Titan)")
        rows.append((f"strikers: {tid}: 3 eager strikers and 1 cutter",
                     dict(PF["fight"][four]["cfg"], roles=["cutter", "striker", "striker", "striker"]), "strikers"))
    return [dict(family="fight", key="ch6x/" + label, cfg=cfg, n=n_of(R.fights_per_case), seed=21000 + i, label=label,
                 group=group) for i, (label, cfg, group) in enumerate(rows)]


def _rules_added():
    """Sensitivity rows for the rules this simulator adds, each against a twin with the same Squad without it."""
    med = reference_cfg("standard-medium")
    helpers = PF["fight"]["standard-medium: 4 player characters and 2 helper Squadmates"]["cfg"]
    esc = PF["fight"]["tactics: standard-medium: no Squad Tactic, with the escapes"]["cfg"]
    rows = [
        ("wings: standard-medium: 4 player characters and 2 helper Squadmates on Wings", dict(helpers, wings=True),
         "standard-medium: 4 player characters and 2 helper Squadmates"),
        ("swaps: standard-medium: 4 player characters, cutters swap ahead of strikers", dict(med, swaps=True),
         reference_label("standard-medium")),
        ("wings and swaps: standard-medium: 4 player characters and 2 helper Squadmates", dict(helpers, wings=True, swaps=True),
         "standard-medium: 4 player characters and 2 helper Squadmates"),
        ("pry loose: standard-medium: 4 player characters with Pry Loose, with the escapes", dict(esc, pry_loose=True, pry="prefer"),
         "tactics: standard-medium: no Squad Tactic, with the escapes"),
        ("treat: standard-medium: 4 player characters, Treat Injury during the fight", dict(med, treat_in_fight=True),
         reference_label("standard-medium")),
        ("carry: standard-medium: 4 player characters, a Down comrade carried to Distant", dict(med, carry=True),
         reference_label("standard-medium")),
        ("kit: standard-medium: 4 player characters, every soldier with a medical kit rated 1", dict(med, kit=1),
         reference_label("standard-medium")),
        ("dodge support: standard-medium: 4 player characters, Help and Covering on dodges", dict(med, dodge_help=True, dodge_cover=True),
         reference_label("standard-medium")),
    ]
    # decision batch 8, 8-7 and 8-14: the Critical Injuries bands' "without steam" rows, beside the reference starts
    for tid in ("standard-medium", "standard-small"):
        rows.append((f"steam: {tid}: its reference start without steam", dict(reference_cfg(tid), steam=False),
                     reference_label(tid)))
    for tid in ("sprinting-abnormal", "standard-large"):
        label = f"{tid}: 4 player characters and 2 helper Squadmates"
        rows.append((f"kit: {label}, every soldier with a medical kit rated 1", dict(PF["fight"][label]["cfg"], kit=1), label))
    return [dict(family="fight", key="rules/" + label, cfg=cfg, n=n_of(R.fights_per_case), seed=23000 + i, label=label,
                 twin="ch6/" + twin) for i, (label, cfg, twin) in enumerate(rows)]


# ---------------------------------------------------------------------- the Free Build Squad (decision batch 7, 7-1)
def _free_build():
    """ADR-0014 as amended in decision batch 7 (7-1): the Free Build Squad (rules.R.free_build), reported beside the
    Talent-dependent targets and not tuned, where the template Squad is: the prepared-Squad kill on Chapter 5's
    reference Titan and on every table with a template Squad row, the lone Grab after a failed dodge, and the six
    rescue cells with a Free Build soldier as the comrade. Talent 2 sits on each soldier's measured roll: the roles'
    rolls (policy.FREE_BUILD_ROLLS), Break Free for the victim alone, the Body Part strike for the comrade."""
    rows = [("reference-medium", dict(REF, free_build=True))]
    for tid in TITANS:
        label = f"{tid}: template Squad"
        if label in PF["fight"]:
            rows.append((tid, dict({k: v for k, v in PF["fight"][label]["cfg"].items() if k != "template"}, free_build=True)))
    out = [dict(family="fight", key=f"freebuild/{tid}", cfg=cfg, n=n_of(R.fights_per_case), seed=26000 + i,
                label=f"{tid}: Free Build Squad") for i, (tid, cfg) in enumerate(rows)]
    if R.free_build_h2 is not None:
        # decision batch 8, 8-3: the Free Build Squad at Health 2 beside the Health-dependent targets, next to the
        # Health 2 row (4 player characters and 2 helper Squadmates on the standard Medium Titan)
        helpers = "standard-medium: 4 player characters and 2 helper Squadmates"
        out.append(dict(family="fight", key="freebuild_h2/standard-medium", n=n_of(R.fights_per_case), seed=26100,
                        cfg=dict(PF["fight"][helpers]["cfg"], free_build="health_2"),
                        label="standard-medium: Free Build Squad at Health 2 and 2 helper Squadmates"))
    ref = "reference-medium"
    out.append(dict(family="grab", key="grabx/free_build_alone", n=n_of(R.grab_alone_trials), seed=27000,
                    cfg=dict(comrades=0, witness_stress=1, grief=0, victim_dodged=True, titan_id=ref,
                             victim={"free_build": "break-free"})))
    for j, (st, g) in enumerate(R.grab_cells):
        out.append(dict(family="grab", key=f"grabx/free_build_comrade/{cell_label(st, g)}", n=n_of(R.grab_cell_trials),
                        seed=27001 + j, cfg=dict(comrades=1, witness_stress=st, grief=g, victim_dodged=True, titan_id=ref,
                                                 comrade={"free_build": "body-part-strike"})))
    return out


# ---------------------------------------------------------------------- Talent sensitivity rows (decision batch 7, 7-2)
# The Talents WP-B names as naming a measured entry or a fixed roll, each with the twin its effect reads. A fight
# row gives the Talent to every soldier in the Squad; a Grab row to the soldier whose roll it names; a lone row to the
# lone soldier; a sequence row to every soldier in the Squad.
TALENT_FIGHTS = [
    ("ground-work", "ch6", None), ("every-last-one", "ch6", None), ("mid-air-catch", "ch6", None),
    ("steady-heart", "ch6", None), ("gallows-humour", "ch6", None),
    ("cavalry-cut", "ch6", "standard-medium: mounted start"),
    ("shoulder-charge", "ch6", "tactics: standard-medium: no Squad Tactic, with the escapes"),
    ("ready-blade", "ch6", "tactics: standard-medium: Hook and Cut"),
    ("flare-discipline", "ch6", "tactics: standard-medium: Hook and Cut"),
    ("close-pass", "ch6", "support: standard-medium: 4 player characters and 2 Squadmates screening beside the holder"),
    ("tourniquet", "rules", "treat: standard-medium: 4 player characters, Treat Injury during the fight"),
    ("triage", "rules", "kit: standard-medium: 4 player characters, every soldier with a medical kit rated 1"),
    ("got-your-back", "rules", "dodge support: standard-medium: 4 player characters, Help and Covering on dodges"),
    ("formation-drill", "rules", "wings and swaps: standard-medium: 4 player characters and 2 helper Squadmates"),
    ("change-the-order", "rules", "swaps: standard-medium: 4 player characters, cutters swap ahead of strikers"),
    # decision batch 8, 8-26: Grip Breaker names break-free and heave, at level 2, on the rows where pins occur
    ("grip-breaker", "ch6", "standard-medium: mounted start"),
    ("grip-breaker", "ch6", None),
]
TALENT_LEVELS = {"grip-breaker": 2}
TALENT_GRABS = [("wrist-cut", "comrade"), ("steady-heart", "comrade"), ("not-like-this", "victim")]


def _talent_rows():
    out = []
    rules_rows = {c["label"]: c for c in _rules_added()}
    for i, (tid, src, label) in enumerate(TALENT_FIGHTS):
        label = label or reference_label("sprinting-abnormal" if tid == "grip-breaker" else "standard-medium")
        base = rules_rows[label] if src == "rules" else dict(cfg=PF["fight"][label]["cfg"], key="ch6/" + label)
        out.append(dict(family="fight", key=f"talent/{tid}: {label}", n=n_of(R.fights_per_case),
                        cfg=dict(base["cfg"], talent=tid, talent_level=TALENT_LEVELS.get(tid)),
                        seed=24000 + i, label=f"{tid}: {label}", twin=base["key"], talent=tid))
    ref = "reference-medium"
    j = 0
    for tid, who in TALENT_GRABS:
        cells = [("alone_dodge_failed", dict(comrades=0, witness_stress=1, grief=0))] if who == "victim" else []
        cells += [(cell_label(st, g), dict(comrades=1, witness_stress=st, grief=g)) for st, g in R.grab_cells]
        for cell, cfg in cells:
            out.append(dict(family="grab", key=f"grabx/talent/{tid}/{cell}", n=n_of(R.grab_cell_trials), seed=85000 + j,
                            cfg=dict(cfg, victim_dodged=True, titan_id=ref, **{who: {"talent": tid}}),
                            twin=f"grab/{ref}/{cell}", talent=tid))
            j += 1
    out.append(dict(family="lone", key="lonex/talent/spare-parts/standard-medium/waiting", n=n_of(R.lone_trials), seed=65000,
                    cfg={"titan_id": "standard-medium", "line": "waiting", "talent": "spare-parts"},
                    twin="lone/standard-medium/waiting", talent="spare-parts"))
    seq = _sequence()[0]
    out.append(dict(seq, key=seq["key"] + ", every soldier with Will to Live", seed=97100,
                    cfg=dict(seq["cfg"], talent="will-to-live"), twin=seq["key"], talent="will-to-live"))
    return out


# ---------------------------------------------------------------------- the Skirmish probe (decision batch 7, 7-17; 8-4, 8-15)
SKIRMISH_TRIALS = 20000


def _skirmish_cases():
    """The Skirmish probe the plan names, reported and not tuned: one Rookie against one Military Police trooper; the
    reference Squad against three troopers; the reference Squad against three Bandits with the Foes' ambush at night,
    so with firebrands (skirmish.yaml, ambush; foes.yaml, bandit, at_night). Each beside a row without the Cut and Pierce
    riders (8-15). A start that gives no ambush lets the Squad try the Sneak (skirmish.yaml, ambush, squad_attempt).
    Decision batch 8, 8-33: the troopers' main row is the kind's fixed group size (foes.yaml, group_size, fixed)."""
    patrol = R.skirmish["foes"]["military-police-trooper"]["group_size"]
    if not patrol:
        raise ValueError("foes.yaml military-police-trooper: group_size names no fixed patrol (decision batch 8, 8-33)")
    patrol_word = {v: k for k, v in WORDS.items()}[patrol]
    rows = [("one Rookie against one Military Police trooper",
             dict(squad="one", foe="military-police-trooper", number=1, ambush="attempt", night=False)),
            # decision batch 8, 8-33: the main row is the reference Squad against a patrol, the kind's fixed group size
            (f"the reference Squad against {patrol_word} Military Police troopers",
             dict(squad="reference", foe="military-police-trooper", number=patrol, ambush="attempt", night=False)),
            ("the reference Squad against three Bandits with their ambush at night, with firebrands",
             dict(squad="reference", foe="bandit", number=3, ambush="foes", night=True))]
    out = []
    for i, (label, cfg) in enumerate(rows):
        for j, riders in enumerate((True, False)):
            out.append(dict(family="skirmish", key="skirmish/" + label + ("" if riders else ", without the Cut and Pierce riders"),
                            cfg=dict(cfg, riders=riders), n=n_of(SKIRMISH_TRIALS), seed=98000 + 10 * i + j, label=label,
                            riders=riders))
    return out


# ---------------------------------------------------------------------- the Jam test in the full fight
JAM_SUPPORT = [
    ("no Help or Covering", {}),
    ("Help", {"dodge_help": True}),
    ("Covering", {"dodge_cover": True}),
    ("Help and Covering", {"dodge_help": True, "dodge_cover": True}),
    ("Help and Covering, 2 helper Squadmates", {"dodge_help": True, "dodge_cover": True, "squadmates": 2}),
    ("Help and Covering, a Tactician Reading and Calling It", {"dodge_help": True, "dodge_cover": True, "readers": 1}),
]


def _jam_fight():
    out = []
    i = 0
    for tid in TITANS + ["reference-medium"]:
        base = reference_cfg(tid) if tid != "reference-medium" else dict(REF, policy="eager")
        for name, over in JAM_SUPPORT:
            out.append(dict(family="fight", key=f"jamfight/{tid}/{name}", cfg=dict(base, max_rounds=R.jam_rounds, **over),
                            n=n_of(R.jam_trials), seed=91000 + i, titan=tid, support=name))
            i += 1
    return out


# ---------------------------------------------------------------------- the Abnormal's bar
ORDERS = (("cutters_first", 30000, 50000), ("strikers_first", 40000, 55000))


def bar_labels():
    return list(dict.fromkeys(l for r in PF["bar"]["rows"] for l in (r["abnormal"], r["medium"], r["large"])))


def grab_alone_over():
    """The bar variant the Chapter 6 verdict reports: the Grab alone at its Attack Dice, Headlong Lunge one step
    higher (data/titans/tuning.yaml, verdicts, sprinting_abnormal; decision batch 8, 8-1)."""
    blk = R.titan_blocks["sprinting-abnormal"]
    grab = next(e for e in blk["behavior_table"]["entries"] if any(x["type"] == "grab" for x in e["effects"]))
    lunge = next(e for e in blk["behavior_table"]["entries"] if e["id"] == "headlong-lunge")
    # simulator review round 3, Minor 7: the variant's pools are read from the verdict that reports it
    m = parse(r"The Grab alone at (\d+) Attack Dice, with Headlong Lunge at (\d+)(?: Attack Dice)?\b",
              R.titan_tuning["verdicts"]["sprinting_abnormal"], "the Grab-alone variant")
    if int(m.group(1)) != grab["attack_dice"]:
        raise ValueError("data/titans/tuning.yaml verdicts, sprinting_abnormal: the Grab-alone variant's Grab Attack Dice "
                         "are not the stat block's")
    return {"headlong-lunge": {"attack_dice": int(m.group(2))}}, grab["attack_dice"], lunge["attack_dice"]


def _bar():
    out = []
    labels = bar_labels()
    over, _, _ = grab_alone_over()
    for order, base, gbase in ORDERS:
        for i, label in enumerate(labels):
            cfg = dict(PF["fight"][label]["cfg"], sheet_order=order)
            out.append(dict(family="fight", key=f"bar/{order}/{label}", cfg=cfg, n=n_of(R.bar_fights), seed=base + i,
                            label=label, order=order))
            if cfg["titan_id"] in ABNORMAL_IDS:
                out.append(dict(family="fight", key=f"grab_alone/{order}/{label}", cfg=dict(cfg, entry_over=over),
                                n=n_of(R.bar_fights), seed=gbase + i, label=label, order=order))
    return out


# ---------------------------------------------------------------------- lone fights
def _lone():
    rows = []
    # simulator review round 3, Minor 7: the three lines are the ones data/engagement/tuning.yaml (solo_nape,
    # lone_fight) names, with the lines the same at Tempo 1; a change to that wording stops the run
    lf = R.engagement_tuning["solo_nape"]["lone_fight"]
    for pat, what in ((r"The waiting line: stay at distant", "the waiting line"),
                      (r"The hurried line takes Break Attention", "the hurried line"),
                      (r"at Tempo 1 the lines are the same", "the lines at Tempo 1")):
        parse(pat, lf["model"], what)
    if "one-card hold" not in " ".join(str(lf).split()):
        raise ValueError("data/engagement/tuning.yaml solo_nape, lone_fight: the one-card hold line is gone")
    for tid in TITANS:
        lines = ["waiting", "hurried", "one_card_hold"] if R.titan_blocks[tid]["tempo"] > 1 else ["waiting"]
        for line in lines:
            rows.append((f"{tid}/{line}", {"titan_id": tid, "line": line}))
    rows += [
        ("ch5/tempo1", {"titan_id": "reference-medium", "line": "waiting"}),
        ("ch5/tempo2", {"titan_id": "reference-medium", "line": "waiting", "titan": {"tempo": 2}}),
        ("route/open grounded", {"titan_id": "standard-medium", "terrain": "open", "start": {"grounded": True}}),
        ("route/wooded grounded", {"titan_id": "standard-medium", "terrain": "wooded", "start": {"grounded": True}}),
        ("route/open grounded, Jammed, dry, no spare, no horse",
         {"titan_id": "standard-medium", "terrain": "open", "mounted": False,
          "start": {"grounded": True, "odm": 0, "gas": 0, "spares": 0, "horse_gone": True}}),
        ("route/wooded grounded, Jammed, dry, no spare, no horse",
         {"titan_id": "standard-medium", "terrain": "wooded", "mounted": False,
          "start": {"grounded": True, "odm": 0, "gas": 0, "spares": 0, "horse_gone": True}}),
        ("route/wooded standing, Jammed, spare, no horse",
         {"titan_id": "standard-medium", "terrain": "wooded", "mounted": False,
          "start": {"odm": 0, "gas": 0, "spares": 1, "horse_gone": True}}),
    ]
    # Opus review 1, finding 6: the same starts with no flare and no horse, so the Feint is the only decoy
    for rating in ("open", "wooded"):
        rows.append((f"route/{rating} grounded, no flare, no horse",
                     {"titan_id": "standard-medium", "terrain": rating, "mounted": False,
                      "start": {"grounded": True, "flares": 0, "horse_gone": True}}))
        rows.append((f"route/{rating} grounded, Jammed, dry, no spare, no horse, no flare",
                     {"titan_id": "standard-medium", "terrain": rating, "mounted": False,
                      "start": {"grounded": True, "odm": 0, "gas": 0, "spares": 0, "horse_gone": True, "flares": 0}}))
    for tid in TITANS:
        rows.append((f"remount/{tid}/waiting, on foot beside the horse",
                     {"titan_id": tid, "line": "waiting", "remount": True, "mounted": False}))
    out = []
    for i, (key, cfg) in enumerate(rows):
        if cfg.get("line") == "one_card_hold":
            cfg = dict(cfg, decoy_hold="card")
        out.append(dict(family="lone", key="lone/" + key, cfg=cfg, n=n_of(R.lone_trials), seed=60000 + i))
    return out


# ---------------------------------------------------------------------- the fresh lone cut
def _solo():
    depths = sorted({R.titan_blocks[t]["nape_depth"] for t in TITANS} |
                    {int(k.split("_")[-1]) for k in R.engagement_tuning["solo_nape"] if k.startswith(("chosen_nape_depth_", "alternative_nape_depth_"))})
    out = []
    i = 0
    for nd in depths:
        for build in ("rookie", "veteran", "levi_grade"):
            for st in R.solo_stresses:
                out.append(dict(family="solo", key=f"solo/nd{nd}/{build}/stress{st}",
                                cfg={"build": build, "stress": st, "nape_depth": nd}, n=n_of(R.solo_trials), seed=70000 + i))
                i += 1
    return out


# ---------------------------------------------------------------------- Grab cells
def cell_label(st, g):
    return f"one_comrade_stress_{st}_grief_{g}"


def no_strike_template():
    """grab.comrades_close, one_template_comrade_with_no_strike_talent: the template with the rescuer's Strength
    whose one Talent names no strike."""
    for tid, t in R.templates.items():
        names = R.talent_names.get(t["talent"]["id"], [])
        if t["attributes"]["strength"] == R.rescuer_strength and not any(n.endswith("-strike") for n in names):
            return tid
    raise ValueError("squadmates.yaml: no template fits the template comrade row")


def _grab():
    out = []
    i = 0
    alone = dict(comrades=0, witness_stress=1, grief=0)

    def push(key, cfg, n):
        nonlocal i
        out.append(dict(family="grab", key=key, cfg=cfg, n=n_of(n), seed=80000 + i))
        i += 1
    for tid in ["reference-medium"] + TITANS:
        push(f"grab/{tid}/alone_dodge_failed", dict(alone, victim_dodged=True, titan_id=tid), R.grab_alone_trials)
        push(f"grab/{tid}/alone_no_dodge", dict(alone, victim_dodged=False, titan_id=tid), R.grab_alone_trials)
        for st, g in R.grab_cells:
            push(f"grab/{tid}/{cell_label(st, g)}", dict(comrades=1, witness_stress=st, grief=g, victim_dodged=True,
                                                        titan_id=tid), R.grab_cell_trials)
    ref = "reference-medium"
    cst, cg = R.health_comrade
    for h in sorted(R.health_rows):
        e = R.health_earlier[h]
        push(f"grabx/health/{h}/lone", dict(alone, victim_dodged=True, titan_id=ref, victim={"health": h}, earlier=e),
             R.grab_alone_trials)
        push(f"grabx/health/{h}/one_comrade", dict(comrades=1, witness_stress=cst, grief=cg, victim_dodged=True, titan_id=ref,
                                                   victim={"health": h}, earlier=e), R.grab_cell_trials)
        push(f"grabx/health/{h}/fresh_lone", dict(alone, victim_dodged=True, titan_id=ref, victim={"health": h}),
             R.grab_alone_trials)
    for tid, _ in R.grab_templates_alone:
        push(f"grabx/template_alone/{tid}", dict(alone, victim_dodged=True, titan_id=ref, victim={"template": tid}),
             R.grab_templates_trials)
    tc = no_strike_template()
    for st, g in R.grab_cells:
        push(f"grabx/template_comrade/{tc}/{cell_label(st, g)}",
             dict(comrades=1, witness_stress=st, grief=g, victim_dodged=True, titan_id=ref, comrade={"template": tc}),
             R.grab_cell_trials)
    tactic_sets = [[t] for t in ("hook", "hamstring", "clear", "fallback")] + \
                  [list(p) for p in itertools.combinations(("hook", "hamstring", "clear", "fallback"), 2)]
    for tac in [[]] + tactic_sets:
        name = "+".join(tac) or "none"
        for st, g in R.grab_cells:
            push(f"grabx/tactics/{name}/{cell_label(st, g)}",
                 dict(comrades=1, witness_stress=st, grief=g, victim_dodged=True, titan_id=ref, tactics=tac, escapes=True),
                 R.grab_cell_trials)
    for st, g in R.grab_cells:
        push(f"grabx/pry_loose/{cell_label(st, g)}",
             dict(comrades=1, witness_stress=st, grief=g, victim_dodged=True, titan_id=ref, comrade={"pry_loose": True},
                  pry="prefer"),
             R.grab_cell_trials)
    return out


# ---------------------------------------------------------------------- the Jam test, as the probes read it
def _jam():
    groups = []
    # the Titan counts ("for one and for two Titans") and the mixed pairs ("Two Focus Titans of different Size
    # Classes ... and a standard Titan with the Abnormal") are read from data/titans/tuning.yaml through rules.R
    for tid in TITANS:
        for reading in ("table", "kill", "mounted"):
            for nt in R.jam_titan_counts:
                groups.append((f"{tid}/{reading}/{nt}_titans", reading, [{"titan_id": tid}] * nt))
    for sc in R.size_classes:
        for reading in ("table", "kill"):
            for nt in R.jam_titan_counts:
                groups.append((f"ch5-{sc}/{reading}/{nt}_titans", reading,
                               [{"titan_id": "reference-medium", "size_class": sc}] * nt))
    for a, b in R.jam_mixed_pairs:
        for reading in ("table", "mounted"):
            groups.append((f"mixed {a}+{b}/{reading}/2_titans", reading, [{"titan_id": a}, {"titan_id": b}]))
    out = []
    i = 0
    for key, reading, tcfgs in groups:
        for cell, h, cover in R.jam_columns:
            out.append(dict(family="jam", key=f"jam/{key}/{cell}",
                            cfg={"reading": reading, "titan_cfgs": tcfgs, "help": h, "cover": cover},
                            n=n_of(R.jam_trials), seed=90000 + i))
            i += 1
    return out


# ---------------------------------------------------------------------- dodges reported beside the targets
def _dodge():
    out = []
    i = 0
    # decision batch 8, 8-1: a dodge against every Attack Dice count a stat block uses, and at each fixed need the
    # tuning file's historical figures name
    pools = sorted({e["attack_dice"] for tid in TITANS for e in R.titan_blocks[tid]["behavior_table"]["entries"]
                    if e.get("attack_dice")})
    for key, spec in R.dodge_reports.items():
        cells = [("dice", k) for k in pools] + [("needs", n) for n, _ in spec["figures"]]
        for kind, k in cells:
            for responses in (False, True):
                cfg = {"stress": spec["stress"], kind: k, "responses": responses}
                if spec["template"]:
                    cfg["template"] = spec["template"]
                out.append(dict(family="dodge", key=f"dodge/{key}/{kind}_{k}/" + ("with" if responses else "without")
                                + "_stress_responses", cfg=cfg, n=n_of(DODGE_TRIALS), seed=95000 + i))
                i += 1
    return out


# ---------------------------------------------------------------------- sequences
def _sequence():
    helpers = PF["fight"]["standard-medium: 4 player characters and 2 helper Squadmates"]["cfg"]
    rows = [("standard-medium, 4 player characters and 2 helper Squadmates", dict(helpers)),
            ("standard-medium, 4 player characters and 2 helper Squadmates, every soldier with a medical kit rated 1",
             dict(helpers, kit=1))]
    return [dict(family="sequence", key="sequence/" + label, cfg=dict(SEQUENCE, fight=cfg), n=n_of(SEQUENCE_TRIALS),
                 seed=97000 + i) for i, (label, cfg) in enumerate(rows)]


# ---------------------------------------------------------------------- gas
def _gas():
    return [dict(family="gas", key=f"gas/{name}", cfg={"dice": R.gas_dice[name]}, n=n_of(R.gas_trials), seed=99000 + i)
            for i, name in enumerate(("standard", "after_pushed_odm_roll"))]


def all_cases():
    out = (_ch5() + _ch6() + _ch6_extra() + _rules_added() + _free_build() + _talent_rows() + _jam_fight() + _bar() + _lone()
           + _solo() + _grab() + _skirmish_cases()
           + _jam() + _dodge() + _sequence() + _gas())
    seeds, keys = {}, set()
    for c in out:
        if c["seed"] in seeds:
            raise ValueError(f"seed {c['seed']} is shared by {seeds[c['seed']]} and {c['key']}")
        if c["key"] in keys:
            raise ValueError(f"case key {c['key']} repeats")
        seeds[c["seed"]] = c["key"]
        keys.add(c["key"])
    return out
