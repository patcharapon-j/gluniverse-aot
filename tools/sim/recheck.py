"""Re-checks of figures past 3 standard errors from a committed probe figure, run inside run.py.

Each flagged case is re-run on new seeds (its seed plus cases.RECHECK_SEED_OFFSET) with cases.RECHECK_FACTOR
times its trials. A flagged Chapter 6 full-fight row is also re-run on the committed Chapter 6 probe itself
(tools/probes/chapter-06/fight6.py, imported with bytecode writing off, so nothing is written under
tools/probes) at the same trial count. report.py reads the three figures (the first run, the re-check, and the
probe on new seeds) and writes each explanation from them; nothing here or there is hand-written.
"""
import os
import sys

sys.dont_write_bytecode = True

HERE = os.path.dirname(os.path.abspath(__file__))
PROBES = os.path.join(os.path.dirname(HERE), "probes")


def probe_path():
    for sub in ("chapter-05", "chapter-06"):
        p = os.path.join(PROBES, sub)
        if p not in sys.path:
            sys.path.insert(0, p)


def probe_job(args):
    """Runs fight6.run_cell on (cfg, n, seed) and returns its fights, which probe_summary reads."""
    probe_path()
    import fight6
    return fight6.run_cell(args)


def probe_summary(fights):
    probe_path()
    import fight6
    s = fight6.summarize(fights)
    s["fights"] = len(fights)
    return s
