"""Decision batch 4 (4-3, 4-4): which change to the Sprinting Abnormal's values or table holds the bar's ceiling under
the rule-set tie-break, in the rows that bind (2 helper Squadmates; the screen beside the holder), against the
standard Large Titan's twins run under the same tie-break. Uses quarry_b4.FightQ (the tie_break and quarry
switches) with fight6's entry_over and titan overrides; the Squad sheet lists the cutters first, which no longer
chooses anything under the rule. Run from this directory: uv run --with pyyaml python sweep_b4.py [fights]
Writes nothing in the project.
"""
import sys

import quarry_b4 as Q

VARIANTS = {
    "as committed": {},
    "Headlong Lunge cannot be lethal": dict(entry_over={"headlong-lunge": {"effects": [
        {"type": "critical-injury", "injury_location": "rolled", "cannot_be_lethal": True}]}}),
    "Headlong Lunge Severity 2": dict(entry_over={"headlong-lunge": {"severity": 2}}),
    "Grab Severity 2": dict(entry_over={"grab": {"severity": 2}}),
    "Nape Depth 2": dict(titan={"nd": 2}),
    "leg Toughness 1": dict(titan={"part_tough": {"eyes": 2, "left-arm": 2, "right-arm": 2, "left-leg": 1, "right-leg": 1}}),
    "Regeneration 4": dict(titan={"regen_len": 4}),
    "Lunge and Grab Severity 2": dict(entry_over={"headlong-lunge": {"severity": 2}, "grab": {"severity": 2}}),
}

if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 24000
    seed = 4500
    twins = {}
    for row in ("helpers", "screen"):
        seed += 1
        twins[row] = Q.run_many(dict(Q.LG, **Q.ROWS[row], tie_break="none"), n, seed)
        Q.show(f"Large twin | {row}", twins[row])
    for quarry in ("in_reach", "path"):
        for vname, over in VARIANTS.items():
            for row in ("helpers", "screen"):
                seed += 1
                cfg = dict(Q.AB, **Q.ROWS[row], tie_break="none", quarry=quarry,
                           **{k: v for k, v in over.items() if k != "entry_over"})
                # each variant changes the Severities as they stood when this probe ran (quarry_b4.AS_MEASURED)
                cfg["entry_over"] = Q.with_entries(Q.AB, over.get("entry_over", {}))
                r = Q.run_many(cfg, n, seed)
                print(f"{quarry} | {vname} | {row}", {k: r.get(k) for k in Q.KEYS},
                      f"| Large twin {twins[row]['deaths']}, {Q.gap(r, twins[row]):+.1f} SE", flush=True)
