"""Tests for tools/sim/space.py on a hand-built rules stub: every shared case of IMPLEMENTATION-PLAN-E.md, section
5.5 (which foundry's zones.test.ts also passes), and the rest of the spatial model's pure rules. A last group checks
that rules.R, read from data/, carries the same contract values the stub does, and runs one fight in process on a
fixed seed as a smoke test of the engine reading zones (no case of cases.py is run).

    uv run --with pyyaml --with pytest python -m pytest tools/sim/test_space.py
"""
import os
import random
import sys
from types import SimpleNamespace

import pytest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import space  # noqa: E402
from space import D, IR, OB, BS  # noqa: E402


# ---------------------------------------------------------------------- the stub
def _steps(*rows):
    out = {}
    for a, b, kinds in rows:
        out[frozenset((a, b))] = {"kinds": set(kinds)}
    return out


STANDARD = [(1, -2, 0), (2, -2, 1), (3, -2, 2), (4, -1, 0), (5, -1, 1), (6, 0, -1), (7, 0, 0), (8, 0, 1), (9, 1, -1),
            (10, 1, 0), (11, 2, -2), (12, 2, -1), (13, 2, 0)]
SKIRMISH = [(1, -1, 0), (2, -1, 1), (3, 0, -1), (4, 0, 0), (5, 0, 1), (6, 1, -1), (7, 1, 0)]
SET_PIECE = ([(1 + i, -2, r) for i, r in enumerate(range(0, 3))] + [(4 + i, -1, r) for i, r in enumerate(range(-1, 3))]
             + [(8 + i, 0, r) for i, r in enumerate(range(-2, 3))] + [(13 + i, 1, r) for i, r in enumerate(range(-2, 2))]
             + [(17 + i, 2, r) for i, r in enumerate(range(-2, 1))])


def stub():
    size = lambda rows, c, s: {"centre": c, "squad_start": s, "zones": [{"n": n, "q": q, "r": r} for n, q, r in rows]}   # noqa: E731
    branch = [(D, IR, "foot mounted odm".split()), (IR, OB, ["odm"]), (OB, BS, ["odm"]), (IR, BS, ["odm"])]
    return SimpleNamespace(
        zones={"neighbour_offsets": [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]],
               "sizes": {"skirmish": size(SKIRMISH, 4, 5), "standard": size(STANDARD, 7, 8),
                         "set-piece": size(SET_PIECE, 10, 11)}},
        ratings={
            "open": {"steps": _steps((D, IR, ["foot", "mounted"]), (IR, OB, ["odm"]))},
            "sparse": {"steps": _steps((D, IR, "foot mounted odm".split()), (IR, OB, ["odm"]), (OB, BS, ["odm"]))},
            "wooded": {"steps": _steps(*branch)},
            "urban": {"steps": _steps((D, IR, ["foot", "odm"]), *branch[1:])},
            "giant-forest": {"steps": _steps(*branch)}},
        anchors={"open": 0, "sparse": 1, "wooded": 2, "urban": 3, "giant-forest": 3},
        carry_cost={"open": 2, "sparse": 1, "wooded": 0, "urban": 0, "giant-forest": 0},
        sparser={"open": "open", "sparse": "open", "wooded": "sparse", "urban": "wooded", "giant-forest": "wooded"},
        denser={"open": "sparse", "sparse": "wooded", "wooded": "giant-forest", "urban": "urban",
                "giant-forest": "giant-forest"},
        carry_off=1, carry_attach=1, carry_limit=2, mounted_pace=2,
        zone_terrain=[([1], "sparser"), ([2, 3, 4, 5], "field"), ([6], "denser")],
        wreck_grace={"sparse"}, open_rating="open",
        grounded_close={IR, OB, BS}, grounded_extra_rating="open", grounded_extra_pair=frozenset((OB, BS)))


class Body:
    def __init__(self, label, zone, grounded=False, dead=False):
        self.label, self.zone, self._g, self.dead = label, zone, grounded, dead

    def grounded(self):
        return self._g or self.dead


def soldier(zone, kind="ground", body=None, left=False):
    return SimpleNamespace(zone=zone, attach=(kind, body), left=left)


@pytest.fixture
def R():
    return stub()


@pytest.fixture
def field(R):
    return space.uniform_field(R, "standard", "wooded")


# ---------------------------------------------------------------------- 5.5: distance, neighbours, edges
def test_distance(field):
    assert field.distance(7, 1) == 2
    assert field.distance(8, 11) == 3
    assert field.distance(1, 13) == 4


def test_neighbours_and_edges(field):
    assert field.neighbours(4) == [1, 2, 5, 6, 7]
    assert field.is_edge(7) is False
    assert field.is_edge(4) is True
    assert field.edge_zones() == [n for n in range(1, 14) if n != 7]
    assert field.ring(7) == 0 and field.ring(8) == 1 and field.ring(1) == 2


def test_other_fields(R):
    sk = space.layout(R, "skirmish")
    assert sk.centre == 4 and sk.squad_start == 5 and [n for n in sk.zones if not sk.is_edge(n)] == [4]
    sp = space.layout(R, "set-piece")
    assert sp.centre == 10 and sp.squad_start == 11
    assert len(sp.edge_zones()) == 12 and all(sp.ring(n) == 2 for n in sp.edge_zones())
    for f in (sk, sp, space.layout(R, "standard")):
        assert f.is_edge(f.squad_start) or f.size == "set-piece"     # 16-7: the start zone is an edge zone on 7 and 13


# ---------------------------------------------------------------------- 5.5: the Stride
def test_stride_route(field):
    assert space.stride_route(field, 7, 1, 2) == [4, 1]
    assert space.stride_route(field, 7, 2, 1) == [4]          # 4 and 5 tie; 4 is lower
    assert space.stride_route(field, 7, 2, 2) == [4, 2]
    assert space.stride_route(field, 8, 11, 3) == [7, 9, 11]  # 7 and 10 tie; 7 is lower
    assert space.stride_route(field, 7, 1, 0) == []
    assert space.stride_route(field, 7, 7, 3) == []
    assert space.stride_route(field, 7, 8, 2) == [8]          # stops on entering the holder's zone


# ---------------------------------------------------------------------- 5.5: the entry zone
def test_entry_zone(field):
    assert space.entry_zone(field, [8, 8, 8, 8]) == 1
    # every edge zone holds a soldier: the fewest, then the lowest-numbered
    zs = [n for n in field.edge_zones()] + [1, 2]
    assert space.entry_zone(field, zs) == 3


# ---------------------------------------------------------------------- 5.5: the Flight
def test_flight_into_titan_zone_then_blind_spot(R, field):
    a = Body("A", 7)
    start = (8, "ground", None)
    steps = [(7, "anchored", None), (7, "blind-spot", "A")]
    assert space.flight_cost(field, R, start, steps) == (1, 1)
    assert space.crossed(8, [s[0] for s in steps]) == []
    opts = space.flight_options(R, field, start, 1, [a])
    assert any(o[0][-1] == (7, "blind-spot", "A") and o[1] == 1 and o[2] == 1 for o in opts)
    # with no Momentum: into 7 and on through Wooded zones (Carry 0 each), not on to the Blind Spot (Carry 1)
    opts0 = space.flight_options(R, field, start, 0, [a])
    assert all(o[2] == 0 for o in opts0) and max(o[1] for o in opts0) == 2
    assert (7, "anchored", None) in [o[0][-1] for o in opts0]
    assert (7, "blind-spot", "A") not in [o[0][-1] for o in opts0]


def test_flight_crossing(R, field):
    steps = [(7, "anchored", None), (10, "anchored", None)]
    assert space.crossed(5, [s[0] for s in steps]) == [7]
    carries, momentum = space.flight_cost(field, R, (5, "ground", None), steps)
    assert carries == 1 and momentum == R.carry_cost[field.rating(10)]
    field.zones[10].rating = "open"
    field.zones[13].rating = "sparse"
    assert space.flight_cost(field, R, (5, "ground", None), steps) == (1, 2)
    assert space.carry_cost(field, R, 13) == 1
    assert space.carry_cost(field, R, space.OFF) == 1 and space.carry_cost(field, R, space.ATTACH) == 1


def test_flight_never_ends_free_in_open(R, field):
    field.zones[7].rating = "open"
    opts = space.flight_options(R, field, (8, "ground", None), 2, [])
    ends = [o[0][-1] for o in opts]
    assert all(e[0] != 7 for e in ends)
    through = [o for o in opts if 7 in [s[0] for s in o[0]]]
    assert through and all(o[0][-1][0] != 7 for o in through)
    # with a Titan in the Open zone, the Flight may end on its body there
    opts = space.flight_options(R, field, (8, "ground", None), 1, [Body("A", 7)])
    assert (7, "on-body", "A") in [o[0][-1] for o in opts]
    assert (7, "anchored", None) not in [o[0][-1] for o in opts]


def test_carry_limit(R, field):
    opts = space.flight_options(R, field, (8, "ground", None), 99, [], may_leave=True)
    assert max(o[1] for o in opts) == R.carry_limit
    far = {o[0][-1][0] for o in opts}
    assert all(field.distance(8, z) <= 1 + R.carry_limit for z in far if z is not None)
    assert (None, "anchored", None) in [o[0][-1] for o in opts]
    none_off = space.flight_options(R, field, (8, "ground", None), 99, [], may_leave=False)
    assert all(o[0][-1][0] is not None for o in none_off)


# ---------------------------------------------------------------------- 5.5: wrecks
def test_wreck(R, field):
    field.zones[3].rating = field.zones[3].start = "urban"
    assert space.wreck(field, R, 3) == ("urban", "wooded", False)
    assert "dust" in field.zones[3].effects
    field.zones[5].rating = field.zones[5].start = "sparse"
    assert space.wreck(field, R, 5) == ("sparse", "sparse", True)
    assert space.wreck(field, R, 5) == ("sparse", "open", False)
    assert space.wreck(field, R, 5) == ("open", "open", False)


def test_momentum_cap(R, field):
    field.zones[4].rating = "open"
    assert space.momentum_cap(field, R, 4) == 0
    assert space.momentum_cap(field, R, 7) == 2
    assert space.momentum_cap(field, R, None) == 0


# ---------------------------------------------------------------------- 5.5: the derivation
def test_derivation_two_titans_and_a_stride(field):
    a, b = Body("A", 7), Body("B", 7)
    s = soldier(7, "blind-spot", "A")
    assert space.derive_position(s, a) == BS
    assert space.derive_position(s, b) == IR
    # A strides to 4: the soldier at its Blind Spot stays in 7, anchored if airborne (the detach rule)
    a.zone = space.stride_route(field, 7, 4, 2)[-1]
    s.attach = ("anchored", None)
    assert a.zone == 4
    assert space.derive_position(s, a) == D
    assert space.derive_position(s, b) == IR


def test_derivation_rows():
    a = Body("A", 7)
    assert space.derive_position(soldier(7, "on-body", "A"), a) == OB
    assert space.derive_position(soldier(7, "grabbed", "A"), a) == OB
    assert space.derive_position(soldier(7, "pinned", "A"), a) == IR
    assert space.derive_position(soldier(7, "ground"), a) == IR
    assert space.derive_position(soldier(7, "anchored"), a) == IR
    assert space.derive_position(soldier(8, "ground"), a) == D
    assert space.derive_position(soldier(None), a) is None
    assert space.derive_position(soldier(8, left=True), a) is None


# ---------------------------------------------------------------------- moves beyond 5.5
def test_mounted_pace(R, field):
    moves = space.ground_options(R, field, (8, "ground", None), "mounted", [Body("A", 7)], may_leave=True)
    ends = {m[-1][0] for m in moves}
    assert field.distance(8, 1) == 3 and 1 not in ends           # two zone steps at most
    assert 4 in ends and None in ends
    # the move ends on entering 7, which holds a standing Focus Titan: nothing beyond 7 through it
    through7 = [m for m in moves if m[0][0] == 7]
    assert through7 == [[(7, "ground", None)]]
    # unless 7 is Open
    field.zones[7].rating = "open"
    moves = space.ground_options(R, field, (8, "ground", None), "mounted", [Body("A", 7)])
    assert any(m[0][0] == 7 and len(m) == 2 for m in moves)
    # mounted may not enter Urban
    field.zones[5].rating = "urban"
    moves = space.ground_options(R, field, (8, "ground", None), "mounted", [])
    assert all(5 not in [s[0] for s in m] for m in moves)


def test_on_foot_and_attachment_steps(R, field):
    a = Body("A", 7)
    moves = space.ground_options(R, field, (7, "ground", None), "foot", [a])
    assert all(len(m) == 1 for m in moves)
    assert {m[0][0] for m in moves} == set(field.neighbours(7))   # no on-foot step onto a standing body
    moves = space.ground_options(R, field, (7, "ground", None), "foot", [Body("A", 7, grounded=True)])
    assert (7, "on-body", "A") in [m[0] for m in moves] and (7, "blind-spot", "A") in [m[0] for m in moves]


def test_generate_field(R):
    rng = random.Random(3)
    f = space.generate_field(rng, R, "standard", "wooded", named={3: "open"})
    assert f.rating(7) == "wooded" and f.rating(8) == "wooded" and f.rating(3) == "open"
    assert all(z.rating in ("sparse", "wooded", "giant-forest", "open") for z in f.zones.values())
    assert all(z.start == z.rating for z in f.zones.values())
    # 11 zones roll (13 less the centre and the start), one named: 10 dice
    rng2 = random.Random(3)
    f2 = space.generate_field(rng2, R, "standard", "wooded", named={3: "open"})
    assert [z.rating for z in f.zones.values()] == [z.rating for z in f2.zones.values()]

    class Six:
        def randint(self, a, b):
            return 6
    f6 = space.generate_field(Six(), R, "standard", "urban")
    assert {f6.rating(n) for n in f6.zones} == {"urban"}          # Urban's denser is Urban


# ---------------------------------------------------------------------- rules.R from data/ agrees with the contract
def _real():
    try:
        import rules
    except Exception as exc:        # P1's data may be mid-edit; the stub tests above do not need it
        pytest.skip(f"rules.py does not load from data/ now: {exc}")
    return rules.R


def test_rules_contract():
    R = _real()
    assert sorted(R.zones["sizes"]) == ["set-piece", "skirmish", "standard"]
    assert R.carry_cost == {"open": 2, "sparse": 1, "wooded": 0, "urban": 0, "giant-forest": 0}
    assert R.sparser["urban"] == "wooded" and R.denser["wooded"] == "giant-forest"
    assert R.stride["small"] == 1 and R.stride["medium"] == 2 and R.stride["large"] == 2
    assert R.stride["sprinting-abnormal"] == 3
    assert R.open_rating == "open" and R.wreck_grace == {"sparse"}
    f = space.layout(R, "standard")
    assert f.neighbours(4) == [1, 2, 5, 6, 7] and f.centre == 7 and f.squad_start == 8
    s = stub()
    assert (R.carry_limit, R.mounted_pace, R.carry_off, R.carry_attach) == (s.carry_limit, s.mounted_pace, 1, 1)


def test_engine_smoke():
    """One fight on a fixed seed through the engine, in process: every soldier starts in the start zone, the Titan in
    the centre, and the fight ends."""
    _real()
    import engine
    cfg = {"titan_id": "reference-medium", "size_class": "medium", "terrain": "wooded"}
    for seed in range(4):
        f = engine.Fight(random.Random(seed), cfg, aux=random.Random(seed + 100))
        assert f.t.zone == f.field.centre
        assert all(s.zone == f.field.squad_start and s.pos == D for s in f.sold)
        st = f.run()
        assert st["cap"] == 0
        assert st["flights"] == st["fly_rolls"]
    # a Titan whose holder waits two zones out strides to them before its card resolves
    f = engine.Fight(random.Random(1), cfg, aux=random.Random(2))
    f.begin()
    s = f.sold[0]
    s.zone = 1
    f.t.holder = s
    f.stride(s)
    assert f.t.zone == 1 and f.stats["stride_reach"] == 1 and s.pos == IR
