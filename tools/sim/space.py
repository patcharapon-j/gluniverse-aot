"""The field of a Titan Engagement: zones, attachments, derived Positions, moves over zones, the Flight's Carry, the
Stride, wrecks, the entry zone, and field generation (ADR-0029; decision batch 16, 16-2 to 16-30;
data/engagement/zones.yaml).

Pure functions over a Field and the rules object. Every value comes from `R` (rules.R, or a stub with the same
attributes in test_space.py); this module imports nothing from rules.py, so it can be tested on a hand-built stub.
The attributes it reads:

- R.zones: data/engagement/zones.yaml, parsed (fields, sizes, centre, squad_start, zones)
- R.anchors, R.carry_cost, R.sparser, R.denser: by rating id (anchor-ratings.yaml, ratings)
- R.carry_off, R.carry_attach, R.carry_limit: zones.yaml, flight (OQ-200)
- R.mounted_pace: zones.yaml, moves, mounted, zone_steps (OQ-200)
- R.zone_terrain: engagement-setup.yaml, zone_terrain, as [(results, "sparser" | "field" | "denser")] (OQ-202)
- R.wreck_grace: the ratings whose first wreck in a zone does nothing (anchor-ratings.yaml, Sparse's trait)
- R.open_rating: the rating that is its own sparser (the bottom of the ladder)
- R.ratings[rid]["steps"]: the Position step rows, {frozenset(pair): {"kinds": {...}}}
- R.grounded_close, R.grounded_extra_rating, R.grounded_extra_pair: anchor-ratings.yaml, grounded_titan

A soldier here is any object with `zone` (a zone number, or None off field) and `attach`, a pair (kind, body label)
with body None for ground and anchored. A body is any object with `label` and `zone`, and `grounded()` where a move
reads it. A Placement is the triple (zone, kind, body).
"""
D, IR, OB, BS = "distant", "in-reach", "on-body", "blind-spot"
FREE = ("ground", "anchored")
BODY_KINDS = ("on-body", "blind-spot", "grabbed", "pinned")
# zones.yaml, attachments, derives, for an attachment that names the body (rules.py checks the file agrees)
DERIVES = {"on-body": OB, "grabbed": OB, "blind-spot": BS, "pinned": IR}
# the attachment a Position within a zone reads as, for an attachment step (zones.yaml, moves, attachment_step:
# in-reach read as free)
AS_POSITION = {"ground": IR, "anchored": IR, "on-body": OB, "blind-spot": BS}
OFF = "off"
ATTACH = "attach"


# ---------------------------------------------------------------------- the field (16-2)
class Zone:
    __slots__ = ("n", "q", "r", "rating", "start", "grace_used", "effects")

    def __init__(self, n, q, r, rating=None):
        self.n, self.q, self.r = n, q, r
        self.rating = rating
        self.start = rating
        self.grace_used = False
        self.effects = set()

    def __repr__(self):
        return f"Zone({self.n}, {self.rating})"


class Field:
    def __init__(self, size, centre, squad_start, zones, offsets):
        self.size = size
        self.centre = centre
        self.squad_start = squad_start
        self.zones = zones                      # {n: Zone}
        self.offsets = [tuple(o) for o in offsets]
        self._by_qr = {(z.q, z.r): z.n for z in zones.values()}
        self._nb = {n: sorted(self._by_qr[(z.q + dq, z.r + dr)] for dq, dr in self.offsets
                              if (z.q + dq, z.r + dr) in self._by_qr) for n, z in zones.items()}

    def distance(self, a, b):
        za, zb = self.zones[a], self.zones[b]
        dq, dr = zb.q - za.q, zb.r - za.r
        return (abs(dq) + abs(dr) + abs(dq + dr)) // 2

    def neighbours(self, n):
        return list(self._nb[n])

    def is_edge(self, n):
        return len(self._nb[n]) < len(self.offsets)

    def ring(self, n):
        return self.distance(self.centre, n)

    def rating(self, n):
        return self.zones[n].rating

    def edge_zones(self):
        return [n for n in sorted(self.zones) if self.is_edge(n)]

    def copy(self):
        f = Field(self.size, self.centre, self.squad_start, {}, self.offsets)
        for n, z in self.zones.items():
            c = Zone(z.n, z.q, z.r, z.rating)
            c.start, c.grace_used, c.effects = z.start, z.grace_used, set(z.effects)
            f.zones[n] = c
        f._by_qr, f._nb = self._by_qr, self._nb
        return f


def layout(R, size):
    """zones.yaml, fields, sizes: the field of that size with no rating set."""
    spec = R.zones["sizes"][size]
    zones = {z["n"]: Zone(z["n"], z["q"], z["r"]) for z in spec["zones"]}
    return Field(size, spec["centre"], spec["squad_start"], zones, R.zones["neighbour_offsets"])


def generate_field(rng, R, size, rating, named=None, mix=None):
    """engagement-setup.yaml, steps field-size to zone-terrain (16-6): the centre zone and the Squad's start zone take
    the field rating; every other zone, in number order, takes the rating a starting rule names for it, or rolls D6 on
    zone_terrain (the field rating's sparser, the field rating, or its denser). A named zone is not rolled, so it
    draws no die. Each zone's start rating is the rating it takes here. mix, when given, replaces R.zone_terrain's rows
    (a sensitivity row of OQ-202)."""
    f = layout(R, size)
    named = dict(named or {})
    for n in sorted(f.zones):
        z = f.zones[n]
        if n in named:
            z.rating = named[n]
        elif n in (f.centre, f.squad_start):
            z.rating = rating
        else:
            die = rng.randint(1, 6)
            row = next(k for results, k in (mix or R.zone_terrain) if die in results)
            z.rating = {"sparser": R.sparser[rating], "field": rating, "denser": R.denser[rating]}[row]
        if z.rating not in R.carry_cost:
            raise ValueError(f"zone {n}: no Anchor Rating {z.rating!r}")
        z.start = z.rating
    return f


def uniform_field(R, size, rating):
    """Every zone at one rating: the field a case names when it reads one Anchor Rating everywhere (a sensitivity row,
    and the reading of every figure measured before zones)."""
    f = layout(R, size)
    for z in f.zones.values():
        z.rating = z.start = rating
    return f


# ---------------------------------------------------------------------- Positions (16-9, 16-11)
def derive_position(soldier, body):
    """zones.yaml, derivation, order: the Position the soldier holds relative to the body, or None off field."""
    zone = soldier.zone
    if zone is None or getattr(soldier, "left", False):
        return None
    kind, named = soldier.attach
    if named is not None and named == body.label and kind in DERIVES:
        return DERIVES[kind]
    return IR if zone == body.zone else D


def zones_apart(field, a, b):
    """zones.yaml, between_soldiers: the number of Position steps between two soldiers is the number of zones between
    them (0: the same Position)."""
    return field.distance(a.zone, b.zone)


# ---------------------------------------------------------------------- steps inside one zone (16-12)
def step_kinds(R, rating, a, b, grounded):
    """The kinds of move that can make the Position step a to b relative to one body in a zone of this rating
    (anchor-ratings.yaml, ratings, steps, with the grounded_titan permissions for a grounded Titan or a corpse)."""
    pair = frozenset((a, b))
    row = R.ratings[rating]["steps"].get(pair)
    kinds = set(row["kinds"]) if row else set()
    if a != b and grounded and a in R.grounded_close and b in R.grounded_close:
        if row:
            kinds.add("foot")
            kinds.discard("mounted")
        elif rating == R.grounded_extra_rating and pair == R.grounded_extra_pair:
            kinds |= {"foot", "odm"}
    return kinds


def enter_kinds(R, rating):
    """zones.yaml, moves, entered_zone_reads: the kinds a zone step into a zone of this rating reads, from its distant
    to in-reach row: foot and mounted may enter; odm always enters, and the row's odm says whether a Flight may end
    free there."""
    row = R.ratings[rating]["steps"].get(frozenset((D, IR)))
    kinds = set(row["kinds"]) if row else set()
    return {"foot": "foot" in kinds, "mounted": "mounted" in kinds, "odm_ends_free": "odm" in kinds}


def blind_spot_exists(R, rating, grounded):
    """positions.yaml, blind-spot (16-10): a zone whose rating has a step reaching blind-spot, or a grounded body."""
    return grounded or any(BS in pair for pair in R.ratings[rating]["steps"])


# ---------------------------------------------------------------------- the Flight (16-13 to 16-15)
def carry_cost(field, R, to):
    """The Momentum one Carry costs: into a zone, its rating's carry_cost; off field, carry_cost_off_field; an
    attachment step, carry_cost_attachment_step."""
    if to == OFF:
        return R.carry_off
    if to == ATTACH:
        return R.carry_attach
    return R.carry_cost[field.zones[to].rating]


def step_target(prev, nxt):
    """What a step from placement prev to placement nxt enters: a zone number, OFF, or ATTACH."""
    if nxt[0] is None:
        return OFF
    if nxt[0] != prev[0]:
        return nxt[0]
    return ATTACH


def flight_cost(field, R, start, steps):
    """(carries, momentum) of a Flight from placement start through steps: the first step costs nothing, each further
    step is one Carry at the cost of what it enters."""
    carries, momentum, prev = 0, 0, start
    for i, nxt in enumerate(steps):
        if i:
            carries += 1
            momentum += carry_cost(field, R, step_target(prev, nxt))
        prev = nxt
    return carries, momentum


def crossed(start, entered):
    """The zones a Flight crosses: each zone it enters and leaves again in the same move, never the zone it starts in or
    the zone it ends in, in order. entered is the zone of each step's placement (None off field); an attachment step
    repeats its zone."""
    end = entered[-1] if entered else start
    out = []
    for i, z in enumerate(entered[:-1]):
        if z is None or z in (start, end) or z in out:
            continue
        if entered[i + 1] != z:
            out.append(z)
    return out


def momentum_cap(field, R, n):
    """anchor-ratings.yaml, momentum, cap (16-4): the anchors of the zone; none off field."""
    if n is None:
        return 0
    return R.anchors[field.zones[n].rating]


# ---------------------------------------------------------------------- moves (16-12, 16-13, 16-26)
def _attach_moves(R, field, place, bodies, kind):
    """One attachment step from place with this kind of move: the placements it can reach in the same zone."""
    zone, akind, named = place
    rating = field.zones[zone].rating
    here = [b for b in bodies if b.zone == zone]
    out = []
    if akind in FREE:
        for b in here:
            g = b.grounded()
            for to_kind in ("on-body", "blind-spot"):
                if kind in step_kinds(R, rating, IR, AS_POSITION[to_kind], g):
                    out.append((zone, to_kind, b.label))
    elif akind in ("on-body", "blind-spot"):
        b = next((x for x in here if x.label == named), None)
        if b is not None:
            g = b.grounded()
            frm = AS_POSITION[akind]
            for to_kind in ("on-body", "blind-spot"):
                if to_kind != akind and kind in step_kinds(R, rating, frm, AS_POSITION[to_kind], g):
                    out.append((zone, to_kind, b.label))
            if kind in step_kinds(R, rating, frm, IR, g):
                out.append((zone, "anchored" if kind == "odm" else "ground", None))
    return out


def _zone_moves(R, field, place, kind, may_leave):
    """One zone step from free in a zone: every adjacent zone the kind may enter, and off field from an edge zone."""
    zone, akind, _ = place
    if akind not in FREE:
        return []
    free_as = "anchored" if kind == "odm" else "ground"
    out = []
    for n in field.neighbours(zone):
        ek = enter_kinds(R, field.zones[n].rating)
        if kind == "odm" or ek.get(kind):
            out.append((n, free_as, None))
    if may_leave and field.is_edge(zone):
        out.append((None, free_as, None))
    return out


def standing_in(bodies, zone):
    return [b for b in bodies if b.zone == zone and not getattr(b, "dead", False)]


def flight_options(R, field, start, momentum, bodies, may_leave=False, carry_limit=None):
    """Every Flight from placement start that the rules allow with this much Momentum: its steps (the first free, at most
    the Carry limit more, each Carry paid at its cost), never ending free in a zone whose rating gives ODM no distant to
    in-reach row (Open), and ending free as anchored. Returns [(steps, carries, momentum)] with the shortest way to each
    ending first; a start already legal as an ending is not included (a move may change nothing, and that is no
    Flight)."""
    limit = R.carry_limit if carry_limit is None else carry_limit
    out, seen = [], {start: 0}
    frontier = [(start, [], 0)]
    for depth in range(limit + 1):
        nxt = []
        for place, steps, cost in frontier:
            if place[0] is None:
                continue
            for to in _zone_moves(R, field, place, "odm", may_leave) + _attach_moves(R, field, place, bodies, "odm"):
                c = cost + (carry_cost(field, R, step_target(place, to)) if steps else 0)
                if c > momentum:
                    continue
                if to in seen and seen[to] <= c:
                    continue
                seen[to] = c
                nxt.append((to, steps + [to], c))
        for to, steps, c in nxt:
            if to[0] is None or to[1] not in FREE or enter_kinds(R, field.zones[to[0]].rating)["odm_ends_free"]:
                out.append((steps, len(steps) - 1, c))
        frontier = nxt
    best = {}
    for steps, carries, c in out:
        end = steps[-1]
        if end == start:
            continue
        if end not in best or (c, carries) < (best[end][2], best[end][1]):
            best[end] = (steps, carries, c)
    return sorted(best.values(), key=lambda x: (x[2], x[1]))


def ground_options(R, field, start, kind, bodies, may_leave=False, pace=None):
    """Every move on foot ("foot": one step, a zone step or an attachment step) or mounted ("mounted": up to the mounted
    pace in zone steps and no attachment step, ending on entering a zone that holds a standing Focus Titan unless that
    zone is Open, and off field as its last step). Returns [steps] with the shortest way to each ending first."""
    if kind == "foot":
        return [[to] for to in _zone_moves(R, field, start, "foot", may_leave) + _attach_moves(R, field, start, bodies, "foot")]
    pace = R.mounted_pace if pace is None else pace
    out, seen, frontier = [], {start}, [(start, [])]
    for _ in range(pace):
        nxt = []
        for place, steps in frontier:
            if place[0] is None:
                continue
            if steps and standing_in(bodies, place[0]) and field.zones[place[0]].rating != R.open_rating:
                continue
            for to in _zone_moves(R, field, place, "mounted", may_leave):
                if to in seen:
                    continue
                seen.add(to)
                nxt.append((to, steps + [to]))
        out += [s for _, s in nxt]
        frontier = nxt
    return out


# ---------------------------------------------------------------------- the Stride (16-16 to 16-19)
def stride_route(field, start, goal, stride):
    """The zones a Titan enters, in order, striding from start toward goal: each an adjacent zone one closer to goal,
    the lower-numbered on a tie, stopping on entering goal, at most stride of them; empty when already there or when
    stride is 0. Never off field (goal is a zone on the field)."""
    route, at = [], start
    while len(route) < stride and at != goal:
        d = field.distance(at, goal)
        at = min(n for n in field.neighbours(at) if field.distance(n, goal) == d - 1)
        route.append(at)
    return route


# ---------------------------------------------------------------------- the entry zone (16-29)
def entry_zone(field, soldier_zones):
    """zones.yaml, entry_zone: the edge zone that holds no soldier and is farthest from the nearest soldier, the
    lowest-numbered on a tie; if every edge zone holds a soldier, the edge zone holding the fewest, then the
    lowest-numbered."""
    zs = [z for z in soldier_zones if z is not None]
    edges = field.edge_zones()
    empty = [n for n in edges if n not in zs]
    if empty:
        if not zs:
            return empty[0]
        far = lambda n: min(field.distance(n, z) for z in zs)     # noqa: E731
        return min(empty, key=lambda n: (-far(n), n))
    return min(edges, key=lambda n: (zs.count(n), n))


# ---------------------------------------------------------------------- wrecks (16-20, 16-21)
def wreck(field, R, n):
    """titan-format.yaml, effect_types, wreck (16-20): the zone takes one rating step toward Open, to its rating's
    sparser; the first wreck a zone takes while its rating has the Sparse grace does nothing, once per zone; an Open
    zone takes no further step. Changes the field; returns (from, to, graced)."""
    z = field.zones[n]
    frm = z.rating
    if frm in R.wreck_grace and not z.grace_used:
        z.grace_used = True
        return frm, frm, True
    z.rating = R.sparser[frm]
    if R.anchors[z.rating] < R.anchors[z.start]:
        z.effects.add("dust")          # zones.yaml, effects, dust: a zone below its start rating
    return frm, z.rating, False
