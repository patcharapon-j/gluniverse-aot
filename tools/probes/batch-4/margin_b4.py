"""Decision batch 4 (4-4): the Sprinting Abnormal's kill entries under the rule (quarry_b4.RULES["rule"]), at
120,000 fights a row in the bar's binding rows, read against the standard Large Titan's twins from
quarry_b4_bar.out (both sheet orders pooled, since neither chooses anything under the rule) and the Medium
twins for the floor. Run from this directory: uv run --with pyyaml python margin_b4.py [fights]
Writes nothing in the project.
"""
import sys

import quarry_b4 as Q

# quarry_b4.py bar 120000: the twins' deaths and standard errors, both orders pooled
LARGE = {"reference": (0.16045, 0.0015), "helpers": (0.02105, 0.0005), "screen": (0.01045, 0.0003),
         "screen_pair": (0.0084, 0.0002)}
MEDIUM_CIS = {"reference": 0.7023, "helpers": 0.6389, "screen": 0.4217, "screen_pair": 0.3864}
MEDIUM_REF_DEATHS = 0.03345

VARIANTS = {
    "Grab Severity 2 (quarry_b4 bar)": {},
    "Grab and Headlong Lunge Severity 2": dict(entry_over={"grab": {"severity": 2}, "headlong-lunge": {"severity": 2}}),
    "Grab Severity 2, Headlong Lunge cannot be lethal": dict(entry_over={"grab": {"severity": 2}, "headlong-lunge": {
        "effects": [{"type": "critical-injury", "injury_location": "rolled", "cannot_be_lethal": True}]}}),
}

if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 120000
    seed = 4600
    for vname, over in VARIANTS.items():
        if not over:
            continue
        for row in ("reference", "helpers", "screen", "screen_pair"):
            seed += 1
            # each variant changes the Severities as they stood when this probe ran (quarry_b4.AS_MEASURED), so an
            # entry it does not set keeps Severity 3 and this script repeats margin_b4.out
            cfg = dict(Q.DECIDED, **Q.ROWS[row], **Q.RULES["rule"])
            cfg["entry_over"] = Q.with_entries(Q.AB, over["entry_over"])
            r = Q.run_many(cfg, n, seed)
            d, se = LARGE[row]
            g = (r["deaths"] - d) / ((r["deaths_se"] ** 2 + se ** 2) ** 0.5)
            print(f"{vname} | {row}", {k: r.get(k) for k in Q.KEYS},
                  f"| deaths vs Large twin {d}: {g:+.1f} SE; cis vs Medium twin {MEDIUM_CIS[row]}"
                  + (f"; deaths vs Medium reference {MEDIUM_REF_DEATHS}" if row == "reference" else ""), flush=True)
