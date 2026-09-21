"""Every choice a player or Squadmate makes in the simulator, in one place.

These are the baseline and sensitivity policies Chapters 5 and 6 state (data/engagement/tuning.yaml,
prepared_squad_kill, model; solo_nape; lone_fight; grab; jam_test; data/titans/tuning.yaml, probes,
baseline_policy), ported from the committed probes and applied through engine.py's rules, and the policies
this simulator adds for the rules the probes left out. A choice the chapters leave open is marked POLICY
CHOICE with the reason. The rules engine never chooses; it calls these functions and checks what they return.

Squad (build_squad):
- 4 Rookie player characters at their fight-start Stress, starting at Distant: two cutters and two strikers,
  listed cutters first unless sheet_order says otherwise (the order chooses nothing under decision batch
  4). The template row uses the Slayer and Flier templates as strikers and the Brawler and Hunter as cutters.
  Helper Squadmates are the ADR-0014 Rookie build at fight-start Stress 1 (a reference choice: squadmates.yaml
  builds a Squadmate from a template), in the role the case names. A reader is the Tactician template (the
  simulator case names a Tactician) at Stress 1. health, kit, and pry_loose change every soldier's Health, give
  every soldier a medical kit, or give the player characters Pry Loose.
Baseline turns (take_turn):
- cutter: Distant or Blind Spot to In Reach; strike the more damaged unbroken leg, then arms, Helped by up to
  2 comrades (cut_order eyes first moves to On Body for the eyes). With Hook and Cut held, first take Break
  Attention with ODM Gear when a striker at Blind Spot with an unspent action holds Attention or has 2 Bonus
  Dice from others' Openings and grounding.
- striker: to Blind Spot (changing a canister when dry), then a Nape strike spending every Opening it did
  not create and Help up to the cap: eager strikes whenever it can; wait needs 2 such Bonus Dice or round 3.
  A striker with Jammed ODM Gear against a standing Titan becomes a cutter.
- helper: to In Reach, and Helps.
- dodge "harm": dodge every behavior with a Grab, a Critical Injury, or a knock-loose that would make the
  soldier fall; "lethal": only a Grab and a Critical Injury that can be lethal. dodge_help and dodge_cover
  add Help and Covering on the dodge (the full-fight Jam test).
- on a Grab: every soldier but a striker ready to cut with 2 Bonus Dice goes for the holding arm, without
  Help, Pushing toward the arm's next state; with escapes, Help on Break Free and a Break Attention rescue
  when the hand cannot be struck; with Pry Loose, a comrade at On Body pries instead when the arm needs more
  successes than Break Free. The Grabbed soldier always tries Break Free.
- decoyer, screen, screen2, rider, draw_attention: as in the Chapter 5 and 6 probes (see below). A cutter who
  would take Draw Attention from Distant, which the rule bars (attention.yaml, draw_attention), takes its turn
  without it and is counted in draws_barred.
- reader: stays at Distant and Reads every turn it has not already Called It on the Titan's Next Behavior;
  picks the attention-ladder fact first on an Abnormal whose ladder is hidden, then next-behavior and Call It.
- treat_in_fight: a cutter or helper whose Position holds a comrade who is Down or holds an untreated lethal
  turn-limit Critical Injury takes Treat Injury on them before its own action.
- carry: a cutter or helper whose Position holds a Down comrade lifts them, carries them to Distant, and sets
  them down there.
- Squad Tactics when held: Hook and Cut after any Break Attention success, by a ready comrade (strikers
  first); Hamstring Line on the first Helped leg strike; Clear the Hand by the first rescuer at In Reach once
  the victim is lifted; Fall Back at the wings step for soldiers at On Body or Blind Spot with no working
  ODM Gear against a standing Titan.
- Wings (wings): at each wings step the rules allow, each living Squadmate in sheet order goes on the Wing of
  the next living player character without one, taking those not Down or Grabbed first and otherwise sheet
  order, one Squadmate a Wing. Swaps (swaps): every cutter whose card comes after a striker's is paired with
  that striker; the engine makes each pair within one step whose soldiers are in no earlier swap, so the cut
  lands before the Nape strike.
- The end of a Titan Engagement: aftermath patients are taken Down patients first, then by the largest Death
  Roll penalty; each gets the soldier within one step, alive, not Down, and not yet treating, with the largest
  Treat Injury pool, and treats themself only when no comrade qualifies and they are not Down. In the care
  window every living soldier not Down makes one Treat Injury roll: the tasks, in order untreated lethal
  injuries, untreated Down rows, other untreated injuries, and reviving a Down soldier, go to the largest pools
  first; spare soldiers Help each lethal patient's roll up to the Help limit, with a medical unit on it, and a
  player character Covers a roll that Pushes. Then each soldier not Down makes one Field Repair on their own
  worn ODM Gear, or else the first comrade's.
- Promotion (promote, in the sequences): each player whose character died or retired chooses the living
  Squadmate in sheet order with the fewest untreated Critical Injuries; the contest's D6 settles a Squadmate
  two players choose (squadmates.yaml, promotion, contested).
- A Down soldier crawls from In Reach to Distant.
The retreat (retreat_turn; background-titans.yaml, retreat), the probes' policy (tools/probes/chapter-05/fight.py),
with each forced move before the action: a soldier at a Grabbed comrade's Position pries (with Pry Loose, as the
rescue does), strikes the holding arm, or with the escapes takes Break Attention, and stays (option 4); from
elsewhere they step toward the hand and then act. A soldier carrying a comrade heads out. Otherwise the nearest
Down comrade (fewest steps, then card): at the same Position, Treat Injury on a turn-limit lethal injury in the
treat_in_fight rows and stay, or lift them and head out; from elsewhere a step toward them and a lift on arrival.
Otherwise head out: a step toward Distant (In Reach first), leaving at Distant, and letting go from On Body or
Blind Spot when no step can be made. No Nape strike, Hook and Cut, Read, or Draw Attention is taken in a retreat.
Lone (lone_turn), Grab cell rescuers, and the Jam test holder are documented at their functions.
"""
import space
from dice import make_build, make_free_build, make_template, use_talent, give_talent
from rules import HEAVE_FROM
from rules import R, D, IR, OB, BS

TACTIC_IDS = {"hook": "hook-and-cut", "hamstring": "hamstring-line", "clear": "clear-the-hand",
              "fallback": "fall-back"}
LEG = "leg"
ARM = R.grab_kind
EYES = next(iter(R.flare_blocking_kinds))
READER_TEMPLATE = "tactician"
# READING (decision batch 7, 7-1): the roll each role makes for the prepared-Squad kill, which carries a Free Build
# soldier's Talent 2: a striker's Nape strike, a cutter's Body Part strike
FREE_BUILD_ROLLS = {"striker": "nape-strike", "cutter": "body-part-strike"}


# ---------------------------------------------------------------------- the Squad
def build_squad(f):
    cfg = dict(f.cfg)
    tactics = [TACTIC_IDS.get(x, x) for x in cfg.get("tactics", [])]
    for tid in tactics:
        if tid not in R.tactics:
            raise ValueError(tid)
    cfg["tactics"] = tactics
    f.cfg = cfg
    st = cfg.get("stress")
    everyone = bool(cfg.get("mounted_start"))
    over = {}
    if cfg.get("health"):
        over["health"] = cfg["health"]
    if cfg.get("kit"):
        over["kit"] = cfg["kit"]
    if cfg.get("template"):
        specs = list(R.template_roles)     # data/engagement/tuning.yaml, prepared_squad_kill, model, squad
        pcs = [(make_template(tid, tid, stress=1 if st is None else st, **over), role) for tid, role in specs]
    elif cfg.get("free_build"):
        # decision batch 7, 7-1: the Free Build Squad in the reference start's roles, each soldier's Talent 2 on the
        # roll its role measures (FREE_BUILD_ROLLS)
        roles = list(R.baseline_roles)
        spec = R.free_build_h2 if cfg["free_build"] == "health_2" else R.free_build     # decision batch 8, 8-3
        if len(roles) != spec["soldiers"]:
            raise ValueError("attributes.yaml reported_squad: its soldiers do not fill the reference start's roles")
        pcs = [(make_free_build(f"fb{i}", FREE_BUILD_ROLLS[role], stress=st, spec=spec, **over), role)
               for i, role in enumerate(roles)]
    else:
        roles = cfg.get("roles") or list(R.baseline_roles)     # prepared_squad_kill, model, squad
        rt = ("pry-loose",) if cfg.get("pry_loose") else ()
        pcs = [(make_build(cfg.get("build", "rookie"), f"pc{i}", stress=st, rule_talents=rt, **over), role)
               for i, role in enumerate(roles)]
    order = cfg.get("sheet_order")
    if order:
        first = "cutter" if order == "cutters_first" else "striker"
        pcs = [x for x in pcs if x[1] == first] + [x for x in pcs if x[1] != first]
    for s, role in pcs:
        f.add(s, role, mounted=everyone)
    for i in range(cfg.get("squadmates", 0)):
        role = cfg.get("squadmate_role", "helper")
        s = make_build("rookie", f"sm{i}", pc=False, stress=st, **over)
        f.add(s, role, mounted=everyone or role in ("rider", "screen2"))
    for i in range(cfg.get("readers", 0)):
        s = make_template(READER_TEMPLATE, f"reader{i}", pc=False, stress=1 if st is None else st, **over)
        f.add(s, "reader", mounted=everyone)
    give_talent(f.sold, cfg.get("talent"), cfg.get("talent_level"))   # a Talent sensitivity row (cases._talent_rows)


# ---------------------------------------------------------------------- shared choices
def help_range(roller, h):
    """Chapter 1, section 1.8: Help from one Position step; talents.yaml, formation-drill: the Squadmate on the roller's
    Wing from the Talent's steps."""
    if h.wing_of is roller and use_talent(roller, "formation-drill"):
        return R.talent_values["formation-drill"]
    return 1


def helpers(f, roller, n):
    """Help: a comrade within one Position step, not Down or Grabbed, with an unspent action, who is not a
    decoyer or a rider, and whose card has come up, or who is a helper Squadmate, or a striker who began the
    round at Distant; those whose card has come up first."""
    n = min(n, R.help_max)
    if n <= 0:
        return []
    out = []
    for h in f.present():
        if (h is roller or h.down or h.grabbed or h.cur_action or h.carried_by is not None
                or h.forced_strike                     # a forced strike forbids Help until taken (decision batch 7, 7-8)
                or (h.pinned and h.pinned["body"])     # a body-pinned soldier has no action (decision batch 8, 8-9)
                or (f.bound(h) and not h.cur_move)     # under a retreat the forced move comes first
                or h.role in ("decoyer", "rider", "lone", "victim", "reader")):
            continue
        if f.zones_apart(h, roller) > help_range(roller, h):      # zones between them (16-11)
            continue
        if not (h.card_passed or h.role == "helper" or (h.role == "striker" and h.start_pos == D)):
            continue
        out.append(h)
    out.sort(key=lambda h: not h.card_passed)
    out = out[:n]
    for h in out:
        h.cur_action = True
    return out


def dodge_helpers(f, s):
    """Chapter 1, section 1.8: a comrade can Help a Reaction with an unspent action this round. POLICY CHOICE
    (dodge_help): every comrade within one step who is not Down, Grabbed, or carried and has an unspent action
    Helps, those whose card has come up first, up to the Help cap; no Help without dodge_help (the baseline)."""
    if not f.cfg.get("dodge_help"):
        return []
    out = [h for h in f.present() if h is not s and not h.down and not h.grabbed and h.carried_by is None
           and not h.cur_action and not h.forced_strike      # decision batch 7, 7-8: no Help until the strike
           and not (h.pinned and h.pinned["body"])           # decision batch 8, 8-9: no action while body-pinned
           and not (f.bound(h) and not h.cur_move) and h.role not in ("lone", "victim")
           and f.zones_apart(h, s) <= help_range(s, h)]
    out.sort(key=lambda h: not h.card_passed)
    out = out[:R.help_max]
    for h in out:
        h.cur_action = True
    return out


def dodge_coverer(f, s):
    """stress-changes.yaml, cover: a player character comrade, not Down (nor Grabbed, which forbids it), at the
    same Position or one step away. POLICY CHOICE (dodge_cover): the lowest-Stress such comrade Covers every
    dodge Push; no Covering without dodge_cover (the baseline)."""
    if not f.cfg.get("dodge_cover") or not s.can_push():
        return None
    out = [c for c in f.present() if c is not s and (c.pc or R.squadmate_covers) and not c.down and not c.grabbed
           and not c.forced_strike      # decision batch 7, 7-8: no Cover until the forced strike is taken
           and not c.pinned             # decision batch 8, 8-9: Cover is not on the Pinned list
           and (f.zones_apart(c, s) <= 1      # talents.yaml, got-your-back: any distance for the first comrade
                or (use_talent(c, "got-your-back") and c.covered_comrade in (None, s.name)))]
    return min(out, key=lambda c: c.stress) if out else None


def wants_dodge(f, s, effects, tsucc=1):
    """The reference dodge policy (ADR-0014 as amended in decision batch 8): dodge any card with 1 or more Titan
    successes whose effects harm, and Push when short (the dodge's push_to is the Titan's successes); "lethal" dodges
    only the Grab and a critical-injury effect that can be lethal."""
    if tsucc < 1:
        return False
    policy = f.cfg.get("dodge", "harm")
    for eff in effects:
        if eff["type"] == "grab":
            return True
        if eff["type"] == "critical-injury" and (policy == "harm" or not eff["cannot_be_lethal"]):
            return True
        if (policy == "harm" and eff["type"] == "knock-loose" and not s.mounted
                and (s.airborne or s.pos in R.fall_high)):
            return True
    return False


def wants_break_free(f, s):
    return True


def down_turn(f, s):
    f.crawl(s)


# ---------------------------------------------------------------------- routes over the field (decision batch 16)
def pick_move(f, s, target, opts, kind):
    """The route a soldier takes toward target, a Position relative to the Focus Titan, among one kind's moves
    [(steps, carries, Momentum)]: returns (rank, option) or None when no move helps. POLICY CHOICE, the routes a
    player learns on the field:
    - a move that reaches target is best; failing that, one that ends free in a zone nearer the Titan's zone, the
      nearer the better (a move never goes the long way round);
    - then a Flight that crosses no standing Focus Titan's zone (a crossing sets the loudest flag unless quiet is
      spent), then the least Momentum, then the fewest Carries, keeping the rest for bite and quiet;
    - toward distant, the zone farthest from the Titan's, holding no body, then the lowest-numbered; toward any other
      Position, the lowest-numbered zone.
    A move off field is never picked here: leaving is the retreat's (retreat_out)."""
    t = f.t
    fd = f.field
    best = None
    here = fd.distance(s.zone, t.zone) if s.zone is not None else 99
    for o in opts:
        steps, carries, cost = o
        end = steps[-1]
        if end[0] is None:
            continue
        pos = f.pos_of(end)
        if pos == target:
            rank = 0
        elif target != D and end[1] in space.FREE and fd.distance(end[0], t.zone) < here:
            rank = 1 + fd.distance(end[0], t.zone)
        else:
            continue
        cross = 1 if (kind == "odm" and f.crossing_titans(s.zone, steps)) else 0
        if target == D:
            pref = (-fd.distance(end[0], t.zone), f.holds_body(end[0]), end[0])
        else:
            pref = (end[0],)
        key = (rank, cross, cost, carries) + pref
        if best is None or key < best[0]:
            best = (key, o)
    return best


def wants_quiet(f, s):
    """anchor-ratings.yaml, momentum, spends, quiet: POLICY CHOICE, a soldier whose Flight would set the loudest flag
    (a crossing or no successes) spends 1 Momentum on quiet when they hold it after their Carries, unless their role
    is to hold the Titan's Attention (a decoyer or a screen) or the case turns quiet off (quiet False)."""
    return f.cfg.get("quiet", True) and s.role not in ("decoyer", "screen", "screen2", "rider")


def bite(f, s):
    """anchor-ratings.yaml, momentum, spends, bite: POLICY CHOICE, every Momentum the soldier holds is bitten into a
    strike this turn, within the Bonus Dice cap, unless the case turns bite off (bite False, the row that measures bite
    on its own, tuning.yaml's first thing to cut). Brace and clean line are never spent."""
    return s.momentum if f.cfg.get("bite", True) else 0


def crawl_zone(f, s, zones):
    """positions.yaml, moves, down_soldier: POLICY CHOICE, the adjacent zone holding no body that holds a standing
    comrade, else the one farthest out (the highest ring), else the lowest-numbered."""
    comrades = {c.zone for c in f.present() if c is not s and not c.down and c.carried_by is None}
    return min(zones, key=lambda n: (n not in comrades, -f.field.ring(n), n))


def retreat_zone(f, s, zones):
    """The soldier's choice among the zones retreat option 1 leaves tied (engine.Fight.retreat_out_zones sorts them):
    POLICY CHOICE, the first, which is the lowest-numbered of the tie."""
    return zones[0] if zones else None


# ---------------------------------------------------------------------- the falling Titan (decision batch 8, 8-9)
def leap_helpers(f, s):
    """Leap Clear's Help from a comrade at the same Position. POLICY CHOICE, as the dodge's: with dodge_help every such
    comrade not Down, Grabbed, Pinned, or carried, with an unspent action, Helps, up to the Help cap; none otherwise
    (the baseline)."""
    if not f.cfg.get("dodge_help"):
        return []
    out = [h for h in f.present() if h is not s and h.zone == s.zone and not h.down and not h.grabbed and not h.pinned
           and h.carried_by is None and not h.cur_action][:R.help_max]
    for h in out:
        h.cur_action = True
    return out


def pinned_turn(f, s):
    """A Pinned soldier's turn: a body-pinned soldier has no action; a limb-pinned soldier may take the entries the
    Pinned list allows. POLICY CHOICE: a limb-pinned soldier Heaves with an unspent action and takes nothing else (the
    Body Part strike against the pinning limb, Read, Call It, Rally, Draw Attention, Help, and Swap Initiative Card
    are not taken)."""
    if s.pinned["body"]:
        s.cur_action = True
        return
    part = s.pinned.get("part")
    if not s.cur_action and part is not None and s.handles and f.can_strike_part(s, part):
        f.body_strike(s, part, ())       # cutting free (decision batch 8, 8-17); it takes a pending forced strike (8-16)
        return
    if not s.cur_action and s.pos in HEAVE_FROM and not s.forced_strike:
        f.heave(s)


def heaver(f):
    """POLICY CHOICE: under a living grounded Titan, one comrade Heaves for the Pinned while the others fight on: the
    one fewest Position steps from In Reach who is not Down, Grabbed, Pinned, carried, or carrying and whose role acts,
    the earliest card first. Under a corpse every standing soldier Heaves (heave_turn from engine.soldier_turn)."""
    t = f.t
    if t.dead or not f.pinned_present():
        return None
    cand = [c for c in f.present() if not c.down and not c.grabbed and not c.pinned and c.carried_by is None
            and c.carrying is None and c.role not in ("lone", "victim", "rider")]
    return min(cand, key=lambda c: (f.zones_apart(c, f.t) if c.zone is not None else 99, f.steps_apart(c.pos, IR),
                                    f.card.get(c.name, 99))) if cand else None


def heave_turn(f, s):
    """A step to In Reach relative to the pinning body, then Heave, no Help given (each soldier heaves on their own
    turn). POLICY CHOICE."""
    if s.pos not in HEAVE_FROM and not s.cur_move:
        f.try_step(s, IR, ("foot", "odm"))
    if s.cur_action or s.down or not f.pinned_present():
        return
    # POLICY CHOICE: cut a pinning Body Part when one pins a comrade and it can be struck (8-17), else Heave
    part = next((x.pinned["part"] for x in f.present() if x.pinned and x.pinned.get("part") is not None), None)
    if part is not None and s.handles and f.can_strike_part(s, part):
        f.body_strike(s, part, ())
    elif s.pos in HEAVE_FROM:
        f.heave(s)


def wings_step(f):
    t = f.t
    if f.holds_tactic("fall-back"):
        stranded = [s for s in f.present() if not s.down and not s.grabbed and s.pos in (OB, BS)
                    and not s.odm_working() and not t.grounded()]
        if stranded:
            f.use_tactic("fall-back")
            for s in stranded:
                s.pos = IR          # the detach rule (zones.yaml): free in the Titan's zone; a carried comrade follows
                f.stats["fall_backs"] += 1


def assign_wings(f):
    """Returns (Squadmate, player character) pairs."""
    pcs = [s for s in f.sold if s.pc and not s.dead]
    pcs.sort(key=lambda s: (s.down or s.grabbed))
    out, free = [], list(pcs)
    for sm in [s for s in f.sold if not s.pc and not s.dead]:
        if not free:
            break
        out.append((sm, free.pop(0)))
    return out


def promotion_choice(free):
    """squadmates.yaml, promotion, who_chooses: the player whose character died or retired chooses. POLICY CHOICE:
    the living Squadmate with the fewest untreated Critical Injuries, then sheet order. Returns them in order of
    preference."""
    return sorted(free, key=lambda s: len(s.untreated()))


def swaps(f):
    out = []
    for c in [s for s in f.present() if s.role == "cutter"]:
        for k in [s for s in f.present() if s.role == "striker"]:
            if f.card.get(c.name, 0) > f.card.get(k.name, 99):
                out.append((c, k))
    return out


def read_picks(f, s, succ):
    """Returns (facts, call_it). POLICY CHOICE: on an Abnormal whose ladder is hidden, the ladder first; then the
    Next Behavior and Call It when the successes pay for it; a Next Behavior already Called is not Read again."""
    t = f.t
    need = R.call_it_sharp if "sharp-call" in s.rule_talents else R.call_it_successes
    picks, left = [], succ
    kind = "abnormal" if t.abnormal else "standard"
    if not t.ladder_revealed and kind in R.read_facts["attention-ladder"] and left >= 1:
        picks.append("attention-ladder")
        left -= 1
    already = t.called is not None and t.called["serial"] == t.nb_serial
    if left >= need and not already:
        return picks + ["next-behavior"], True
    if left >= 1 and not t.nb_revealed:
        picks.append("next-behavior")
    return picks, False


def aftermath_treaters(f, patients):
    """treat-injury.yaml, aftermath_rolls: (patient, treater or None) pairs."""
    def pool(tr, p):
        kit = tr.kit is not None and tr.kit > 0
        return (tr.a(R.treat_attribute) + (tr.talents.get(R.treat_entry, 0) + tr.kit if kit else 0) + tr.stress
                - (R.treat_self_penalty if tr is p else 0))
    order = sorted(patients, key=lambda p: (not p.down, -max(c["row"]["dr_pen"] for c in f.aftermath_cis(p))))
    used, out = set(), []
    for p in order:
        cands = [tr for tr in f.sold if not tr.dead and not tr.down and tr is not p and tr.name not in used
                 and f.apart(tr, p) <= 1]
        if not cands and not p.down and p.name not in used:
            cands = [p]
        if not cands:
            out.append((p, None))
            continue
        tr = max(cands, key=lambda x: pool(x, p))
        used.add(tr.name)
        out.append((p, tr))
    return out


def aftermath_ci(f, p):
    return max(f.aftermath_cis(p), key=lambda c: c["row"]["dr_pen"])


def care_window(f, alive):
    """treat-injury.yaml, care_windows, engagement-end, and field-repair.yaml: every living soldier not Down makes
    one Treat Injury roll and one Field Repair roll. Tasks, in order: untreated lethal Critical Injuries, untreated
    Down rows, other untreated Critical Injuries, then reviving a Down soldier at 0 Health."""
    rollers = [s for s in alive if not s.down]
    tasks = []
    for p in alive:
        for c in p.untreated():
            rank = 0 if c["row"]["lethal"] else (1 if c["row"]["down"] else 2)
            tasks.append((rank, p, "treat", c))
    for p in alive:
        if p.down and p.current_health() == 0 and p.health_lost > 0 and not p.untreated():
            tasks.append((3, p, "revive", None))
    tasks.sort(key=lambda x: x[0])
    for s in rollers:               # squad-supply.yaml, restock-kit: a worn kit first
        if s.kit_max is not None and s.kit < s.kit_max and f.supply["medical"] > 0:
            f.supply["medical"] -= 1
            s.kit = s.kit_max
    free = sorted(rollers, key=lambda s: -(s.a(R.treat_attribute) + ((s.talents.get(R.treat_entry, 0) + s.kit)
                                                                     if s.kit else 0)))
    plan = []
    for rank, p, use, c in tasks:
        if not free:
            break
        r = free.pop(0)
        plan.append([rank, p, use, c, r, []])
    for step in plan:
        while free and len(step[5]) < R.care_help_max and step[0] == 0:
            step[5].append(free.pop(0))
    for rank, p, use, c, r, hs in plan:
        if use == "treat" and c["treated"]:
            continue
        cover = next((x for x in alive if x.pc and not x.down and x is not r), None) if r.can_push() else None
        f.care_roll(r, p, use, c, helpers=hs, cover=cover, units=R.care_bonus_units if rank == 0 else 0)
    if R.care_field_repair:
        worn = [s for s in alive if s.odm < s.odm_max]
        for s in [s for s in alive if not s.down]:
            target = s if s in worn else (worn[0] if worn else None)
            if target is None:
                break
            f.care_repair(s, target)
            if target.odm >= target.odm_max and target in worn:
                worn.remove(target)


def after_decoy(f, s):
    """Hook and Cut (squad-tactics.yaml): a ready comrade cuts at once, strikers first; never in a retreat, whose cut
    would be a Nape strike (decision batch 5b, 5-15), so the Tactic is not spent."""
    t = f.t
    if not f.holds_tactic("hook-and-cut") or t.dead or f.retreat:
        return
    ready = [c for c in f.present() if c is not s and f.can_nape(c)]
    # talents.yaml, ready-blade: a comrade whose action is spent may be the striking comrade, the strike spending their
    # next action. POLICY CHOICE: only when no comrade with an unspent action is ready.
    blade = [] if ready else [c for c in f.present() if c is not s and c.cur_action and f.can_nape(c, spent_ok=True)
                              and use_talent(c, "ready-blade", consume=False)]
    if not ready and not blade:
        return
    f.use_tactic("hook-and-cut")
    if ready:
        ready.sort(key=lambda c: c.role != "striker")
        f.nape_strike(ready[0])
        return
    blade.sort(key=lambda c: c.role != "striker")
    use_talent(blade[0], "ready-blade")
    f.stats["talent_fires"] += 1
    f.nape_strike(blade[0], ready_blade=True)


def on_nape(f, s, res):
    if s.role == "lone":
        L = f.lone
        L.update(struck=True, kill=res.succ >= f.t.nd, round=f.rnd, stress_at_strike=s.stress,
                 cards_before=f.stats["resolved"], cis_before=f.stats["cis"])
        if f.cfg.get("stop_at_first_nape", True):
            f.stop = True
            L["end"] = "struck"


def round_dealt(f):
    lone = [s for s in f.alive() if s.role == "lone"]
    if lone:
        sc = f.card[lone[0].name]
        passed = sum(1 for c in f.tcards if c < sc)
        line = f.cfg.get("line", "waiting")
        f.lone["t_first"] = passed == f.t.tempo if line in ("waiting", "one_card_hold") else passed >= 1


def after_event(f):
    if f.cfg.get("cell") and f.lone.get("grabbed") and f.t.grab is None:
        f.stop = True


def end_of_round(f):
    lone = [s for s in f.alive() if s.role == "lone"]
    if not lone:
        return
    if not f.stop and f.t.holder != "decoy" and not any_decoy_left(f, lone[0]):
        lone_end(f, "no_decoy_usable", lone[0])
    elif not f.stop and f.retreat:
        # the retreat clock filled: the lone fight's measurement (a usable strike) ends, since no Nape strike is made
        # in a retreat (decision batch 5b, 5-15)
        lone_end(f, "retreat", lone[0])
    else:
        count_gap(f, lone[0])


# ---------------------------------------------------------------------- a soldier's turn
def take_turn(f, s):
    t = f.t
    cfg = f.cfg
    role = s.role
    if role == "lone":
        if s.forced_strike:
            raise ValueError(f"{s.name}: policy.lone_turn does not read a Fear row's forced strike (decision batch 7, 7-8)")
        return lone_turn(f, s)
    if role in ("rider", "victim"):
        return
    if s.forced_strike:
        return forced_strike_turn(f, s)
    if role == "reader":
        if not t.dead and t.holder != "decoy" and not s.cur_action:
            already = t.called is not None and t.called["serial"] == t.nb_serial
            if not already or not t.ladder_revealed:
                f.read(s)
        return
    if cfg.get("treat_in_fight") and role in ("cutter", "helper") and not s.cur_action and not t.dead:
        pat = next((p for p in f.present() if p is not s and p.zone == s.zone and not p.grabbed and
                    (p.down or any(c["row"]["lethal"] and c["limit"] == "turn" for c in p.untreated()))), None)
        if pat is not None:
            lethal = [c for c in pat.untreated() if c["row"]["lethal"] and c["limit"] == "turn"]
            downs = [c for c in pat.untreated() if c["row"]["down"]]
            if lethal or downs or pat.untreated():
                f.treat(s, pat, "treat", (lethal or downs or pat.untreated())[0])
            elif pat.health_lost > 0:
                f.treat(s, pat, "revive")
    if cfg.get("carry") and role in ("cutter", "helper") and not t.dead:
        if s.carrying is not None:
            if s.pos == D:
                f.set_down(s)
            else:
                f.try_step(s, IR if s.pos in (OB, BS) else D, ("foot", "odm"))
                if s.pos == D:
                    f.set_down(s)
                return
        elif not s.cur_action and not t.grab:
            c = next((p for p in f.present() if p is not s and p.zone == s.zone and p.down and not p.grabbed
                      and p.carried_by is None and p.pos != D and not p.pinned), None)
            if c is not None and f.lift(s, c):
                f.try_step(s, IR if s.pos in (OB, BS) else D, ("foot", "odm"))
                return
    if (cfg.get("draw_attention") and role == "cutter" and not t.grab and not t.dead and not s.cur_action
            and (t.ladder_revealed or not cfg.get("draw_after_read"))):
        h = t.holder
        if h not in (None, "decoy") and h is not s and h.role == "striker":
            if s.pos in R.draw_barred_positions:
                # attention.yaml, draw_attention: not from Distant (decision batch 5, OQ-113); the turn goes on without it
                f.stats["draws_barred"] += 1
            else:
                f.draw_attention(s)
    if role == "screen2" and not t.grab and not t.dead:
        if f.horse_usable(s):
            return screen_horse(f, s)
        if cfg.get("screen_feints", True) and s.cloak_thrown:
            return screen_feint(f, s)
    if role == "striker" and s.odm == 0 and not t.grounded():
        s.role = role = "cutter"
    if t.grab and t.grab["victim"] is not s:
        return rescue(f, s)
    if heaver(f) is s:
        return heave_turn(f, s)
    if role == "decoyer":
        if not s.cur_action and f.decoy_legal(s, "riderless-horse"):
            f.break_attention(s, "riderless-horse")
    elif role == "screen":
        if f.horse_usable(s) and s.pos == D:
            if not s.cur_action and f.decoy_legal(s, "riderless-horse"):
                f.break_attention(s, "riderless-horse")
        elif not s.cloak_thrown:
            if s.pos == D:
                f.try_step(s, IR)
            elif s.pos == IR:
                f.try_step(s, BS)
            if s.pos in (OB, BS) and not s.cur_action and s.odm_working() and f.decoy_legal(s, "thrown-cloak"):
                f.break_attention(s, "thrown-cloak", "odm")
        elif s.pos == D:
            f.try_step(s, IR)
    elif role == "screen2":
        h = t.holder
        hpos = h.pos if h not in (None, "decoy") else None
        if not s.cloak_thrown:
            target = hpos if hpos in (OB, BS) else BS
            if s.pos == D:
                f.try_step(s, IR)
            elif s.pos != target:
                f.try_step(s, target)
            if s.pos in (OB, BS) and not s.cur_action and s.odm_working() and f.decoy_legal(s, "thrown-cloak"):
                f.break_attention(s, "thrown-cloak", "odm")
        elif s.pos == D:
            f.try_step(s, IR)
    elif role == "cutter":
        cutter_turn(f, s)
    elif role == "striker":
        striker_turn(f, s)
    elif role == "helper":
        if s.pos == D:
            f.try_step(s, IR)


def screen_horse(f, s):
    t = f.t
    h = t.holder
    hpos = h.pos if h not in (None, "decoy") else None
    if s.mounted and hpos in (D, IR) and s.pos != hpos:
        f.try_step(s, hpos, ("mounted",))
    if not s.cur_action and f.decoy_legal(s, "riderless-horse"):
        f.break_attention(s, "riderless-horse")


def screen_feint(f, s):
    if s.pos == D:
        f.try_step(s, IR)
    elif s.pos == BS:
        f.try_step(s, IR)
    if s.pos in R.feint_positions and not s.cur_action and f.decoy_legal(s, "feint"):
        gears = f.feint_gears(s)
        if "odm" in gears:
            f.break_attention(s, "feint", "odm")
        elif None in gears and f.cfg.get("onfoot_feint"):
            f.break_attention(s, "feint", None)


def pick_part(f, s):
    t = f.t
    for kind in f.cfg.get("cut_order") or (LEG, ARM):
        opts = [p for p in t.part_ids if t.kind[p] == kind and t.state[p] < R.broken]
        if opts:
            return max(opts, key=lambda p: (t.state[p], t.count[p]))
    return None


def cutter_turn(f, s):
    t = f.t
    part = pick_part(f, s)
    eyes_first = part is not None and t.kind[part] == EYES
    if eyes_first:
        # cut_order eyes first: the eyes are struck from on-body or blind-spot (titan-harm.yaml, body_part_kinds)
        if s.pos in (D, BS):
            f.try_step(s, IR)
        if s.pos == IR and not f.can_strike_part(s, part):
            f.try_step(s, OB)
    elif s.pos in (D, BS) or (s.pos == OB and f.cfg.get("cut_order")):
        f.try_step(s, IR)
    if (f.holds_tactic("hook-and-cut") and s.pos in (IR, OB) and not s.cur_action and s.odm_working()
            and not t.grab and not t.dead and t.holder != "decoy"):
        ready = [c for c in f.present() if c is not s and not c.down and not c.grabbed and c.pos == BS
                 and (not c.cur_action or use_talent(c, "ready-blade", consume=False))     # talents.yaml, ready-blade
                 and c.handles and (c.odm_working() or t.grounded())]
        if any(t.holder is c or f.nape_bonus_without_help(c) >= 2 for c in ready):
            # POLICY CHOICE: a flare while the Squad Supply holds one (need 2), else a Feint (need 3); the
            # probe named no decoy and never ran out.
            d = "flare" if f.decoy_legal(s, "flare") else ("feint" if f.decoy_legal(s, "feint") else None)
            if d:
                f.break_attention(s, d, "odm")
    if s.pos in (IR, OB) and not s.cur_action and s.handles:
        part = pick_part(f, s)
        if part and f.can_strike_part(s, part):
            hs = helpers(f, s, 2)
            ham = bool(hs) and t.kind[part] == LEG and f.holds_tactic("hamstring-line")
            if ham:
                f.use_tactic("hamstring-line")
            f.body_strike(s, part, hs, ham)


def striker_turn(f, s):
    t = f.t
    if s.pos != BS and f.route_step(s, BS, assume_odm=True) is None:
        # POLICY CHOICE: on an Anchor Rating with no chain of steps to Blind Spot (Open, while the Titan stands)
        # the striker cuts as a cutter until grounding opens one. On Wooded a chain always exists.
        return cutter_turn(f, s)
    if s.pos != BS:
        # POLICY CHOICE (the route, decision batch 16): a Flight straight to the Blind Spot when Momentum can pay its
        # Carries, else the nearest step of the chain (policy.pick_move ranks them)
        if s.gas == 0 and s.spares > 0 and not t.grounded() and not s.cur_action and s.pos != D:
            f.change_canister(s)
        if not f.go(s, BS) and s.pos != D:
            f.try_step(s, f.route_step(s, BS) or BS)
    if f.can_nape(s):
        if f.cfg.get("policy", "eager") == "eager" or f.nape_bonus_without_help(s) >= 2 or f.rnd >= 3:
            f.nape_strike(s)
    elif s.pos == BS and s.gas == 0 and s.spares > 0 and not s.cur_action and not t.grounded():
        f.change_canister(s)


def rescue(f, s):
    t = f.t
    g = t.grab
    if s.role == "striker" and f.can_nape(s) and f.nape_bonus_without_help(s) >= 2:
        f.nape_strike(s)
        return
    narrow = g["lifted"] and not g["clear"]
    if narrow and s.pos == IR and f.holds_tactic("clear-the-hand") and not s.cur_action and s.handles:
        f.use_tactic("clear-the-hand")
        g["clear"] = True
        narrow = False
    arm = g["arm"]
    to_free = (R.broken - t.state[arm]) * t.tough(arm) - t.count[arm]
    if "pry-loose" in s.rule_talents and (f.cfg.get("pry") == "prefer" or to_free > R.pry_loose_needs or not s.handles):
        # POLICY CHOICE: Pry Loose (grab.yaml, escapes, pry-loose, needs) when the arm needs more successes than that or cannot be
        # struck; pry "prefer" (the Pry Loose rows) pries whenever the rescuer can reach On Body
        if s.pos == D:
            f.try_step(s, IR)
        if s.pos in (IR, BS):
            f.try_step(s, OB)
        if f.pry_loose(s):
            return
        if s.cur_action:
            return
    reach = set(R.grab_reach_after if g["lifted"] else R.grab_reach_before)
    if g["clear"]:
        reach.add(IR)
    if s.pos not in reach:
        if s.pos == D:
            f.try_step(s, IR)
        if s.pos not in reach and s.pos == IR:
            f.try_step(s, OB)
    if not s.cur_action and f.can_strike_part(s, arm):
        push = None
        if f.cfg.get("rescue_push") == "free":
            # the Grab cells' rescuer (tuning.yaml, grab, model): Push toward the successes that free the victim
            push = to_free
        f.body_strike(s, arm, (), push_to=push)
    elif f.cfg.get("escapes") and not s.cur_action and not s.down and not t.dead and t.holder != "decoy":
        # POLICY CHOICE: the probe rolled with ODM Gear, or the horse from Distant, naming no decoy. The
        # simulator names the cloak, then a flare, then a Feint with ODM Gear, or the riderless horse at Distant.
        if s.odm_working():
            for d in ("thrown-cloak", "flare", "feint"):
                if f.decoy_legal(s, d):
                    f.break_attention(s, d, "odm")
                    return
        if s.pos == D and f.decoy_legal(s, "riderless-horse"):
            f.break_attention(s, "riderless-horse")


# ---------------------------------------------------------------------- the retreat (decision batch 5, 5-1 and 5-10)
def retreat_toward(f, s, target):
    """Retreat option 3 (background-titans.yaml, retreat, moves; 16-27): one step that lowers the number of zones between
    the soldier and target, a comrade. In the comrade's zone, a Position step toward the comrade's Position relative to
    the Focus Titan (a Grabbed comrade's hand). POLICY CHOICE: the lowest-numbered such zone."""
    if s.cur_move or s.zone is None or target.zone is None:
        return False
    fd = f.field
    if s.zone == target.zone:
        d = f.steps_apart(s.pos, target.pos)
        for to in (IR, OB, BS):
            if to != s.pos and f.step_kinds(s.pos, to) and f.steps_apart(to, target.pos) < d:
                place = (s.zone, "ground", None) if to == IR else (s.zone, "on-body" if to == OB else "blind-spot", f.t.label)
                if f.retreat_step(s, place, toward_comrade=True):
                    return True
        return False
    if not f.is_free(s):
        return False
    d = fd.distance(s.zone, target.zone)
    for n in f.field.neighbours(s.zone):
        if fd.distance(n, target.zone) < d and f.retreat_step(s, (n, "ground", None), toward_comrade=True):
            return True
    return False


def retreat_out(f, s):
    """Options 1 and 2 (background-titans.yaml, retreat, moves; 16-27): from on-body or blind-spot, an attachment step to
    free, or letting go when none can be made; from free in an edge zone, leave, whatever body stands there; from free
    elsewhere, a zone step one ring further out (engine.Fight.retreat_out_zones)."""
    if s.cur_move or s.zone is None:
        return
    if not f.is_free(s):
        if not f.retreat_step(s, (s.zone, "ground", None)):
            f.let_go(s)
        return
    if f.field.is_edge(s.zone):
        f.leave(s)
        return
    for n in f.retreat_out_zones(s):
        if f.retreat_step(s, (n, "ground", None)):
            return


def forced_move(f, s, toward):
    """effect-types.yaml, forced-move (decision batch 7, 7-8; 16-28): one step at the start of the soldier's next turn.
    Toward distant is one step by the retreat's option 1; toward the nearest comrade is one step that lowers the zones
    to them. It is not the soldier's own move and never a Flight (positions.yaml, moves, forced_step): not rolled, no
    Carry, no Momentum, no flag; an ODM step is ODM use, and airborne after it. READING: a forced step never leaves the
    Titan Engagement (leaving is a soldier's own move, 16-26), so from free in an edge zone toward distant it is no step.
    POLICY CHOICE: the nearest comrade is the fewest zones away, the earliest card first among ties; the step is
    mounted, on foot, or ODM, the first the soldier can make. Returns True when a step was made."""
    if s.zone is None:
        return False
    if toward == "distant":
        if not f.is_free(s):
            to = [(s.zone, "ground", None)]
        elif f.field.is_edge(s.zone):
            return False
        else:
            to = [(n, "ground", None) for n in f.retreat_out_zones(s)]
    else:
        others = [c for c in f.present() if c is not s and c.zone is not None]
        if not others or not f.is_free(s):
            return False
        c = min(others, key=lambda c: (f.zones_apart(s, c), f.card.get(c.name, 99)))
        d = f.zones_apart(s, c)
        to = [(n, "ground", None) for n in f.field.neighbours(s.zone) if f.field.distance(n, c.zone) < d]
    for place in to:
        if f.forced_step(s, place):
            return True
    return False


def forced_strike_turn(f, s):
    """effect-types.yaml, forced-action (decision batch 7, 7-8): the soldier's next action is a Nape strike or a Body
    Part strike against the Titan, Pushed when it falls short (each strike's roll Pushes up to its need); until it is
    taken they cannot Help or Cover (helpers, dodge_helpers, dodge_coverer), and engine.Fight clears it when a strike
    is made. POLICY CHOICE: under a retreat the forced move comes first (retreat_out) and the strike is a Body Part
    strike, since no Nape strike is made during a retreat; during a Grab the holding arm when it is in reach; otherwise
    a step as the role moves (a striker toward Blind Spot, anyone else from Distant to In Reach), then a Nape strike
    when one is legal, else the Body Part pick_part names. A soldier who cannot strike this turn takes no other action
    and keeps the strike pending."""
    t = f.t
    if f.retreat:
        retreat_out(f, s)
        if s.left or not s.cur_move:
            return
    g = t.grab
    if g is not None and g["victim"] is not s and not s.cur_action and s.handles and f.can_strike_part(s, g["arm"]):
        f.body_strike(s, g["arm"], ())
        return
    if not s.cur_move and not f.retreat:
        if s.pos == D:
            f.try_step(s, IR)
        elif s.role == "striker" and s.pos != BS:
            f.try_step(s, f.route_step(s, BS) or BS)
    if s.cur_action or t.dead:
        return
    if f.can_nape(s):
        f.nape_strike(s)
        return
    part = pick_part(f, s)
    if part is not None and s.handles and f.can_strike_part(s, part):
        f.body_strike(s, part, ())


def free_pinned_act(f, s, c, stay):
    """The action taken for Pinned comrade c in a retreat (8-21): a strike on the pinning Body Part when it can be
    struck, else a Heave. stay: the action comes before the stay move (option 4). Returns True when an action was
    taken."""
    if s.cur_action or s.down or f.t.grab and f.t.grab["victim"] is s:
        return False
    part = c.pinned.get("part")
    if part is not None and s.handles and f.can_strike_part(s, part):
        f.body_strike(s, part, (), stay_for=c if stay else None)
        return True
    if s.pos in HEAVE_FROM:
        f.heave(s, stay_for=c if stay else None)
        return True
    return False


def retreat_act(f, s, g):
    """The action taken for a Grabbed comrade in a retreat: Pry Loose (as rescue chooses it), a strike on the holding
    arm, or with the escapes Break Attention with ODM Gear. Returns True when an action was taken."""
    t = f.t
    if s.cur_action or t.dead or t.grab is not g:
        return False
    arm = g["arm"]
    to_free = (R.broken - t.state[arm]) * t.tough(arm) - t.count[arm]
    if ("pry-loose" in s.rule_talents and s.pos == OB
            and (f.cfg.get("pry") == "prefer" or to_free > R.pry_loose_needs or not s.handles)):
        f.pry_loose(s)
        if s.cur_action:
            return True
    if f.can_strike_part(s, arm):
        f.body_strike(s, arm, (), push_to=to_free if f.cfg.get("rescue_push") == "free" else None)
        return True
    if f.cfg.get("escapes") and t.holder != "decoy" and s.odm_working():
        for d in ("thrown-cloak", "flare", "feint"):
            if f.decoy_legal(s, d):
                f.break_attention(s, d, "odm")
                return True
    return False


def retreat_turn(f, s):
    """A standing soldier's turn under the retreat (background-titans.yaml, retreat): the forced move, then the action,
    except option 4 (the action for the comrade, then the stay) and the lift (then the move that carries them out)."""
    t = f.t
    if f.fallen_options_closed():
        # decision batch 8, 8-32: past the stay limit, options 1 and 2 only. POLICY CHOICE: no action for a comrade on
        # the way out
        retreat_out(f, s)
        return
    if s.forced_strike:
        return forced_strike_turn(f, s)
    g = t.grab
    if g is not None and g["victim"] is not s and not g["victim"].dead:
        v = g["victim"]
        if s.zone == v.zone and s.pos == v.pos:
            moved = s.cur_move       # a Fear row's forced move may have made the move already (8-13): no stay then
            if retreat_act(f, s, g):
                if not moved:
                    f.stay(s, v)
                return
        elif retreat_toward(f, s, v):
            retreat_act(f, s, g)
            return
    # decision batch 8, 8-21: options 3 and 4 for a Pinned comrade. POLICY CHOICE: a soldier carrying no one goes to
    # the nearest Pinned comrade (fewest steps, earliest card), cuts the pinning Body Part when one pins them and it can be
    # struck, else Heaves, and stays; from elsewhere they step toward the comrade, then act.
    pinned = [c for c in f.present() if c is not s and c.pinned]
    if pinned and s.carrying is None and "heave" in R.retreat_stay_actions:
        c = min(pinned, key=lambda c: (f.zones_apart(s, c), f.card.get(c.name, 99)))
        if s.zone == c.zone and s.pos in HEAVE_FROM:
            moved = s.cur_move       # a Fear row's forced move may have made the move already (8-13): no stay then
            if free_pinned_act(f, s, c, stay=not moved):
                if not moved:
                    f.stay(s, c)
                return
        elif retreat_toward(f, s, c):
            free_pinned_act(f, s, c, stay=False)
            return
    if s.carrying is not None:
        retreat_out(f, s)
        return
    fallen = [c for c in f.present() if c is not s and c.down and not c.grabbed and c.carried_by is None and not c.pinned]
    if fallen:
        c = min(fallen, key=lambda c: (f.zones_apart(s, c), f.card.get(c.name, 99)))
        if c.zone == s.zone:
            if not s.cur_action:
                lethal = [x for x in c.untreated() if x["row"]["lethal"] and x["limit"] == "turn"]
                if f.cfg.get("treat_in_fight") and lethal:
                    moved = s.cur_move
                    f.treat(s, c, "treat", lethal[0])
                    if not moved:
                        f.stay(s, c)
                    return
                if f.lift(s, c):
                    retreat_out(f, s)
                    return
        elif retreat_toward(f, s, c):
            if c.zone == s.zone and not s.cur_action:
                f.lift(s, c)
            return
    retreat_out(f, s)


# ---------------------------------------------------------------------- the lone soldier
def repairable(f, s):
    return f.cfg.get("repair", True) and s.odm == 0 and (s.gas > 0 or s.spares > 0)


def feint_usable(f, s):
    """lone.py's check of the Feint at In Reach or On Body, with the grounded way on foot added: working ODM
    Gear, a sound horse under the soldier, not mounted against a grounded Titan, a dry harness with a spare,
    or a Jammed harness Field Repair can restore."""
    if not f.cfg.get("feint", True):
        return False
    if s.odm_working() or (s.mounted and s.horse > 0 and not s.horse_gone):
        return True
    if not s.mounted and f.t.grounded():
        return True
    if s.odm > 0 and s.gas == 0 and s.spares > 0:
        return True
    return repairable(f, s)


def lone_choice(f, s):
    if f.horse_usable(s):
        return "riderless-horse"
    if f.flares > 0 and not f.t.eyes_broken():
        return "flare"
    if feint_usable(f, s):
        return "feint"
    return None


def any_decoy_left(f, s):
    return f.horse_usable(s) or (f.flares > 0 and not f.t.eyes_broken()) or feint_usable(f, s)


def lone_stage(f, s):
    """The Position the lone soldier Breaks Attention from: one that has a step to Blind Spot this soldier can
    make now (In Reach on Wooded; On Body against a grounded Titan at Open)."""
    for p in (IR, OB):
        kinds = f.step_kinds(p, BS)
        if ("odm" in kinds and s.odm_working()) or ("foot" in kinds):
            return p
    return None


def route_gap(f, s):
    """ADR-0010's promise checked in play, at every lone turn and every lone ending: a gap is a state in which a
    Nape strike is legal now or after one move the soldier can make, while no decoy is legal where the soldier is or
    anywhere one such move reaches (engine.Fight.one_move_places). A decoy already holding is not a gap."""
    t = f.t
    if t.dead or s.dead or s.down or s.grabbed or t.holder == "decoy" or s.zone is None:
        return False
    reach = [(f.place(s), s.mounted)] + f.one_move_places(s)
    reach = [(p, m) for p, m in reach if p[0] is not None]
    if not any(f.pos_of(p) == BS and not m and s.handles and (s.odm_working() or t.grounded()) for p, m in reach):
        return False
    saved = (s.zone, s.attach, s.mounted, s.cur_action)
    try:
        s.cur_action = False
        for p, m in reach:
            s.zone, s.attach, s.mounted = p[0], (p[1], p[2]), m
            if any(f.decoy_legal(s, d) for d in ("feint", "flare", "thrown-cloak", "riderless-horse")):
                return False
    finally:
        s.zone, s.attach, s.mounted, s.cur_action = saved
    return True


def count_gap(f, s):
    if route_gap(f, s):
        f.lone["gap_checks_failed"] = f.lone.get("gap_checks_failed", 0) + 1
        f.lone["gap_grounded"] = f.lone.get("gap_grounded", False) or f.t.grounded()
    f.lone["gap_checks"] = f.lone.get("gap_checks", 0) + 1


def lone_ba(f, s, d):
    if d and f.decoy_legal(s, d):
        f.break_attention(s, d)
        return True
    return False


def lone_end(f, why, s=None):
    if s is not None:
        count_gap(f, s)
    f.lone["end"] = why
    f.stop = True


def lone_no_route(f, s, tf):
    """lone_turn when no Position has a step to Blind Spot this soldier can make: no Break Attention. Pull back
    from On Body; on a round in which the line would move in, go to In Reach on foot and cut the grounding leg;
    otherwise wait at Distant."""
    t = f.t
    if s.pos == OB:
        f.try_step(s, IR, ("foot", "odm"))
    elif s.pos == D and tf and not s.cur_move and not s.cur_action:
        f.try_step(s, IR, ("foot", "odm"))
    elif s.pos == IR and not tf and not s.cur_move:
        f.try_step(s, D, ("mounted", "foot") if s.mounted else ("foot",))
    if s.pos == IR and tf and not s.cur_action and s.handles and not t.dead and not t.grounded():
        leg = next((p for p in t.part_ids if t.kind[p] in R.grounding_kinds and f.can_strike_part(s, p)), None)
        if leg is not None:
            f.body_strike(s, leg, push_to=t.tough(leg) - t.count[leg])
            f.lone["leg_cuts"] = f.lone.get("leg_cuts", 0) + 1


def lone_turn(f, s):
    """The lone fight (tuning.yaml, solo_nape, lone_fight), lone.py's policy: Field Repair a Jammed harness
    first; if a decoy holds, step to Blind Spot and cut; change a dry canister; otherwise wait at Distant
    until a round in which every card of the Titan has come up (the waiting line; the hurried line once one
    has), then move in and Break Attention with the horse, a flare, then the Feint, pulling back to Distant on
    a round in which the soldier's card comes first. At Blind Spot with no decoy holding, a flare or the cloak.
    A lone fight ends at the first Nape strike or when no decoy is usable.

    POLICY CHOICE (Opus review 2, Minor 5): Break Attention is never taken while no Position has a step to Blind
    Spot this soldier can make (lone_stage None: a standing Titan on Open, or ODM Gear that cannot be used where
    only an ODM step reaches Blind Spot), since a decoy then buys no strike. Instead the soldier pulls back from
    On Body to In Reach, even while a decoy holds, and on a round in which every card of the Titan has come up
    (the line's timing) cuts the grounding leg from In Reach, on foot, which opens a route; on other rounds they
    wait at Distant. remount: a soldier at Distant beside their own horse mounts it."""
    t = f.t
    L = f.lone
    count_gap(f, s)
    decoy = t.holder == "decoy"
    if repairable(f, s) and not s.cur_action and not decoy:
        f.field_repair(s)
    if decoy:
        if not f.can_nape(s) and s.pos != BS:
            f.try_step(s, BS)
        if f.can_nape(s):
            f.nape_strike(s, help_nape=False)
            return
    if s.gas == 0 and s.spares > 0 and not s.cur_action and not decoy:
        f.change_canister(s)
    tf = L.get("t_first", False)
    stage = lone_stage(f, s)
    if f.cfg.get("remount") and s.pos == D and f.can_mount(s) and not s.cur_move:
        f.mount(s)
    ride = ("mounted", "foot") if s.mounted else ("foot",)
    if stage is None and s.pos != BS:
        return lone_no_route(f, s, tf)
    if s.pos == D:
        if tf and not s.cur_move and not s.cur_action and not decoy:
            d = lone_choice(f, s)
            if d is None:
                return lone_end(f, "no_decoy_usable", s)
            f.try_step(s, IR, ride)
            if stage != OB:
                lone_ba(f, s, d)
    elif s.pos == IR:
        if stage == OB:
            f.try_step(s, OB, ("foot", "odm"))
            if s.pos == OB and tf and not s.cur_action and not decoy:
                lone_ba(f, s, lone_choice(f, s))
        elif tf and not s.cur_action and not decoy:
            d = lone_choice(f, s)
            if d is None:
                return lone_end(f, "no_decoy_usable", s)
            lone_ba(f, s, d)
        elif not tf and not s.cur_move and not decoy:
            f.try_step(s, D, ride)
            if f.cfg.get("remount") and s.pos == D:
                f.mount(s, within_move=True)
    elif s.pos == OB:
        if stage == OB and tf and not s.cur_action and not decoy:
            d = lone_choice(f, s)
            if d is None:
                return lone_end(f, "no_decoy_usable", s)
            lone_ba(f, s, d)
    elif s.pos == BS:
        if tf and not s.cur_action and not decoy:
            d = "flare" if f.decoy_legal(s, "flare") else ("thrown-cloak" if f.decoy_legal(s, "thrown-cloak") else None)
            if d is None:
                return lone_end(f, "no_decoy_usable", s)
            f.break_attention(s, d)
