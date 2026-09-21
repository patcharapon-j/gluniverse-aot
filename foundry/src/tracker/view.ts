/**
 * The plain view the HUD strip and the Engagement board render (the locked Ops Ledger,
 * foundry/design/tracker-preview-3-ops-ledger.html), rebuilt from the Combat and the actors on every
 * change.
 */
import { iconPath } from '../art.ts';
import { evaluateLadder } from '../rules/engagement/attention.ts';
import { FRENZY_CAP, tieCard } from '../rules/engagement/cards.ts';
import { grabbedIn, swapCheck } from '../rules/engagement/guard.ts';
import { isClose, leaveBlock, letGoBlock, returnBlock, returnZones } from '../rules/engagement/positions.ts';
import { capOf } from '../rules/engagement/momentum.ts';
import { zoneDistance, type Attachment } from '../rules/engagement/zones.ts';
import { checksOf, endComplete, isManual, nextCheck, stayLimitLeft, stepsOf, wingsEditable, type EndEntry } from '../rules/engagement/round.ts';
import { foeTurn } from '../rules/engagement/skirmish.ts';
import { drawAttentionBlock } from '../rules/engagement/attention.ts';
import type { Position, Snapshot, SoldierState, TitanRow } from '../rules/engagement/types.ts';
import { meetsBodyParts } from '../rules/titan.ts';
import { trackerApply } from '../settings.svelte.ts';
import { currentEngagement, engagementTurns } from './combat.ts';
import { checkCategoryOf, endLock, endingState, roundCore, skirmishFoes } from './engine.ts';
import { tr } from './notes.ts';
import { E, grabbedBy, partsOf, ratingOf, snapshot, titanActor, titanToken } from './snapshot.ts';

export const LETTER: Record<Position, string> = { distant: 'D', 'in-reach': 'I', 'on-body': 'O', 'blind-spot': 'B' };
export const POS_ICON: Record<Position, string> = { distant: iconPath('pos-distant'), 'in-reach': iconPath('pos-in-reach'), 'on-body': iconPath('pos-on-body'), 'blind-spot': iconPath('pos-blind-spot') };
const POSITIONS: Position[] = ['distant', 'in-reach', 'on-body', 'blind-spot'];
const PART_SHORT: Record<string, string> = { eyes: 'Eyes', 'left-arm': 'L arm', 'right-arm': 'R arm', 'left-leg': 'L leg', 'right-leg': 'R leg' };
const STATE_LETTER = ['I', 'W', 'B'];
const STATE_INDEX: Record<string, number> = { intact: 0, wounded: 1, broken: 2 };

export interface Letter {
  label: string;
  letter: string;
  cls: string;
  title: string;
}

export interface Chip {
  key: string;
  kind: 'soldier' | 'wing' | 'titan' | 'foe-group';
  id: string;
  card: number | null;
  name: string;
  short: string;
  img: string;
  done: boolean;
  now: boolean;
  dead: boolean;
  was: number | null;
  letters: Letter[];
  statuses: { icon: string; title: string }[];
  owner: boolean;
  of: string | null;
  label: string;
}

export interface PosOption {
  to: Position;
  label: string;
  icon: string;
  current: boolean;
  /** The Open rating's double step: a mounted rider charges and ends where they started. */
  charge: boolean;
  ways: { kind: string; label: string; steps: number; carry: number; charge: boolean; note: string | null }[];
  block: string | null;
}

/** One step of the Anchor Rating's Position map, drawn in the move menu (anchor-ratings.yaml, steps). */
export interface StepLine {
  from: Position;
  to: Position;
  fromLabel: string;
  toLabel: string;
  /** The kinds of move that can make it, already named ("On foot", "Mounted", "ODM"). */
  ways: string;
  /** The step the soldier stands on one end of. */
  here: boolean;
}

export interface Cell {
  key: string;
  label: string;
  corpse: boolean;
  position: Position | null;
  text: string;
  icon: string;
  close: boolean;
  grab: boolean;
  colour: string;
  options: PosOption[];
  letGo: string | null;
  loud: string | null;
  /** The striker carries this Titan's hooked-by-strike flag (attention.yaml, flags; batch A9). */
  hooked: boolean;
  /** The soldier holds this Titan's Attention. */
  attention: boolean;
  /** The soldier is this Titan's loudest, or has just hurt it. */
  flagLoud: boolean;
  flagHurt: boolean;
  /**
   * Every step the current terrain allows relative to this body, so the shape of the Position map is
   * visible where the choice is made (ASSESSMENT item 11, the fix, point 5).
   */
  steps: StepLine[];
}

export interface SoldierRow {
  id: string;
  name: string;
  sub: string;
  img: string;
  card: number | null;
  wing: string | null;
  was: number | null;
  now: boolean;
  down: boolean;
  dead: boolean;
  left: boolean;
  stamp: string | null;
  cells: Cell[];
  gas: number;
  gasMax: number;
  /** Momentum held, and the cap the anchors of their zone give (anchor-ratings.yaml, momentum; 16-4). */
  momentum: number;
  momentumCap: number;
  /** The field readout (16-35): their zone (null off field), attachment, mounted, and horse's zone. */
  zone: number | null;
  zoneText: string;
  attachKind: string;
  attachBody: string;
  attachText: string;
  mounted: boolean;
  horseText: string;
  /** The edge zones a departed soldier may return into (16-26). */
  returnZones: number[];
  stress: number;
  owner: boolean;
  swapBlock: string | null;
  leave: string | null;
  returnBack: string | null;
  odm: boolean;
  engaged: string[];
  holds: string | null;
  /** Read by the GM's Direct Control section (ADR-0028): what the direct setters would change. */
  pinned: boolean;
  airborne: boolean;
  /** The soldier's move is spent this round (blade-sets.yaml, swap). */
  spent: boolean;
}

export interface TitanView {
  key: string;
  label: string;
  /** The zone it stands in (16-35). */
  zone: number;
  colour: string;
  name: string;
  kind: string;
  tempo: number;
  img: string;
  corpse: boolean;
  cards: { n: number; done: boolean; now: boolean }[];
  holder: string;
  holderNone: boolean;
  att: string;
  rungs: { id: string; label: string; met: boolean }[];
  hint: string;
  next: { sealed: boolean; name: string; revealed: boolean; entryId: string };
  prev: string;
  /** The Behavior Table, for the GM's override of the Next Behavior; empty for a player. */
  entries: { id: string; name: string; canHappen: boolean }[];
  parts: { id: string; short: string; icon: string; state: number; letter: string; count: number; title: string }[];
  openings: { initial: string; name: string }[];
  openingsBy: string;
  /**
   * Frenzy (round 3, decision 12): it starts at 0, rises 1 at the end of every even-numbered round to FRENZY_CAP, and is
   * added to the behavior roll, so the longer the fight runs the worse the Titan gets. Public: it is
   * the clock that tells the Squad to finish it.
   */
  frenzy: number;
  frenzyCap: number;
  frenzyTitle: string;
  flags: string;
  regen: { length: number; filled: number; hidden: boolean };
  heave: string;
  grab: string | null;
  now: boolean;
  canPeek: boolean;
}

export interface CheckView {
  index: number;
  label: string;
  detail: string;
  lines: string[];
  state: string;
  next: boolean;
  off: boolean;
  /** This client may apply or skip the check now (the active GM, with no step under way). */
  canRun: boolean;
  canUndo: boolean;
  /** The table resolves it; the GM stamps it. */
  manual: boolean;
  /**
   * The step is under way and waiting on someone (batch C: a prompt card out to a player's client).
   * A waiting row says so rather than looking stalled or done.
   */
  waiting: boolean;
}

export interface FoeView {
  id: string;
  label: number;
  name: string;
  img: string;
  health: number;
  lost: number;
  out: boolean;
  held: boolean;
  weapon: string;
  pick: string;
  canAct: boolean;
}

export interface ZoneView {
  n: number;
  rating: string;
  name: string;
  /** Its start rating's name when a wreck or a ruling has moved it (the tile keeps the start, 16-34). */
  startName: string | null;
  trait: string;
  titans: string[];
  soldiers: string[];
}

export interface FieldView {
  size: string;
  sizeText: string;
  rating: string;
  zones: ZoneView[];
}

export interface TrackerView {
  combat: string;
  isGM: boolean;
  mode: 'titan' | 'skirmish';
  step: string;
  round: number;
  title: string;
  anchor: string;
  /** The rating's own id, and every rating the GM's Direct Control can set it to mid-fight. */
  anchorId: string;
  ratings: { id: string; name: string; anchors: number }[];
  steps: { id: string; label: string; short: string; state: string }[];
  primary: { action: string; label: string } | null;
  hint: string;
  chips: Chip[];
  titans: TitanView[];
  rows: SoldierRow[];
  swaps: string[];
  proposal: { text: string; canAccept: boolean; canCancel: boolean } | null;
  cue: { warn: boolean; text: string } | null;
  checks: CheckView[];
  allStamped: boolean;
  retreat: { length: number; filled: number; active: boolean; text: string };
  /** The field readout (16-35): its size, the field rating, and each zone's rating and occupants. */
  field: FieldView | null;
  background: { name: string; length: number; filled: number; entered: boolean }[];
  tactics: string;
  cloaks: string;
  odm: string;
  ending: { met: boolean; text: string };
  wingsEditable: boolean;
  wingOptions: { mate: string; mateName: string; pc: string; choices: { id: string; name: string }[]; canEdit: boolean }[];
  fallBack: { soldier: string; key: string; text: string }[];
  now: string;
  next: string;
  foes: FoeView[];
  foeName: string;
  grit: string;
  foeDice: string;
  ambush: string;
  canEnd: boolean;
  /** The engagement has ended and its end steps run (engagement-end.yaml). */
  closing: boolean;
}

const nm = (snap: Snapshot, id: string) => snap.soldiers.find((s) => s.id === id)?.name ?? '?';
const short = (name: string) => name.split(/\s+/)[0];
const colourOf = (i: number) => ['A', 'B', 'C', 'D'][i] ?? 'A';

export function buildView(): TrackerView | null {
  const combat = currentEngagement();
  if (!combat) return null;
  const snap = snapshot(combat);
  const sys = combat.system;
  const isGM = !!game.user.isGM;
  const turns = engagementTurns(combat);
  const inPlay = sys.step === 'play';
  const turnIndex = inPlay ? (combat.turn ?? 0) : -1;
  const doneAll = sys.step === 'end';
  const current = inPlay ? turns[turnIndex] : null;
  const grabbed = grabbedIn(snap);
  const focus = snap.titans.filter((t) => t.status === 'focus');
  const labelColour = new Map(snap.titans.map((t, i) => [t.label, colourOf(i)]));
  const swapped = new Map<string, number>();
  for (const sw of sys.swaps) {
    swapped.set(sw.a, sw.cardA);
    swapped.set(sw.b, sw.cardB);
  }
  const actorOf = (id: string) => game.actors.get(id);

  // ---- chips
  const letters = (s: SoldierState): Letter[] =>
    snap.mode === 'skirmish'
      ? (sys.skirmish.engaged as any[]).filter((e) => e.soldier === s.id).map((e) => ({ label: 'F', letter: String((sys.skirmish.foes as string[]).indexOf(e.foe) + 1), cls: 'F', title: tr('engagedWith', { n: (sys.skirmish.foes as string[]).indexOf(e.foe) + 1 }) }))
      : snap.titans.map((t) => {
          if (!s.alive) return { label: t.label, letter: '×', cls: 'x', title: tr('dead') };
          const p = s.positions[t.label];
          const g = grabbedBy(snap, s.id) === t.label;
          return { label: t.label, letter: p ? LETTER[p] : '–', cls: `${labelColour.get(t.label)} ${p === 'distant' ? 'd' : ''} ${g ? 'g' : ''} ${t.status === 'corpse' ? 'c' : ''}`, title: `${t.label}: ${p ? tr(`pos.${p}`) : tr('pos.none')}${g ? `, ${tr('grabbed')}` : ''}` };
        });
  const statusIcons = (s: SoldierState) => {
    const out: { icon: string; title: string }[] = [];
    if (!s.alive) return out;
    if (s.down) out.push({ icon: iconPath('status-down'), title: game.i18n.localize('WOF.Status.down') });
    if (grabbed(s.id)) out.push({ icon: iconPath('status-grabbed'), title: game.i18n.localize('WOF.Status.grabbed') });
    if (s.mounted) out.push({ icon: iconPath('status-mounted'), title: game.i18n.localize('WOF.Status.mounted') });
    if (s.airborne) out.push({ icon: iconPath('status-airborne'), title: game.i18n.localize('WOF.Status.airborne') });
    if (s.pinned) out.push({ icon: iconPath('status-pinned'), title: game.i18n.localize('WOF.Status.pinned') });
    return out;
  };
  const chips: Chip[] = turns.map((c: any, i: number) => {
    const kind = c.system.kind;
    const done = doneAll || (inPlay && i < turnIndex);
    const now = inPlay && i === turnIndex;
    if (kind === 'titan') {
      const t = snap.titans.find((x) => x.key === c.system.titan);
      return { key: c.id, kind, id: c.system.titan, card: c.initiative, name: t?.label ?? '?', short: t?.label ?? '?', img: '', done, now, dead: t?.status === 'corpse', was: null, letters: [], statuses: [], owner: false, of: null, label: labelColour.get(t?.label ?? '') ?? 'A' };
    }
    if (kind === 'foe-group') return { key: c.id, kind, id: 'foes', card: c.initiative, name: sys.skirmish.name || tr('foeGroup'), short: 'F', img: '', done, now, dead: false, was: null, letters: [], statuses: [], owner: false, of: null, label: 'F' };
    const s = snap.soldiers.find((x) => x.id === c.actorId)!;
    const actor = actorOf(c.actorId);
    return {
      key: c.id,
      kind,
      id: c.actorId,
      card: kind === 'wing' ? null : c.initiative,
      name: s?.name ?? c.name,
      short: short(s?.name ?? c.name),
      img: actor?.img ?? '',
      done,
      now,
      dead: !s?.alive,
      was: swapped.get(c.actorId) ?? null,
      letters: s ? letters(s) : [],
      statuses: s ? statusIcons(s) : [],
      owner: !!actor?.isOwner,
      of: kind === 'wing' ? (snap.wings[c.actorId] ?? null) : null,
      label: '',
    };
  });
  // Before the deal, show the soldiers without cards so the swap and wings steps have chips to show.
  if (!turns.length) {
    for (const s of snap.soldiers) {
      const actor = actorOf(s.id);
      chips.push({ key: s.id, kind: snap.wings[s.id] && snap.mode === 'titan' ? 'wing' : 'soldier', id: s.id, card: null, name: s.name, short: short(s.name), img: actor?.img ?? '', done: false, now: false, dead: !s.alive, was: null, letters: letters(s), statuses: statusIcons(s), owner: !!actor?.isOwner, of: snap.wings[s.id] ?? null, label: '' });
    }
  }

  // ---- Titans
  const titans: TitanView[] = snap.titans.map((t, i) => titanView(combat, snap, t, turns, turnIndex, doneAll, current, colourOf(i)));

  // ---- the matrix
  const order: string[] = [];
  for (const c of chips) if ((c.kind === 'soldier' || c.kind === 'wing') && !order.includes(c.id)) order.push(c.id);
  for (const s of snap.soldiers) if (!order.includes(s.id)) order.push(s.id);
  const rating = snap.anchor;
  const rows: SoldierRow[] = order.map((id) => {
    const s = snap.soldiers.find((x) => x.id === id)!;
    const actor = actorOf(id);
    const src = actor.system;
    const g = grabbedBy(snap, id);
    const owner = !!actor?.isOwner;
    const cells: Cell[] = snap.mode === 'titan' ? snap.titans.map((t) => cellView(s, t, snap, g === t.label, labelColour.get(t.label) ?? 'A', isGM, owner)) : [];
    const stamp = !s.alive ? tr('stamp.dead') : s.left ? tr('stamp.left') : s.down ? tr('stamp.down') : g ? tr('stamp.grabbed') : s.pinned ? tr('stamp.pinned') : null;
    const specialty = [...actor.items].find((x: any) => x.type === 'specialty')?.name ?? '';
    return {
      id,
      name: s.name,
      sub: [specialty, s.pc ? '' : tr('squadmate')].filter(Boolean).join(', '),
      img: actor.img,
      card: snap.cards[id] ?? null,
      wing: snap.mode === 'titan' && snap.wings[id] ? nm(snap, snap.wings[id]) : null,
      was: swapped.get(id) ?? null,
      now: !!current && (current.system.kind === 'soldier' || current.system.kind === 'wing') && current.actorId === id,
      down: s.down,
      dead: !s.alive,
      left: s.left,
      stamp,
      cells,
      gas: src.gas_rating ?? 0,
      gasMax: CONFIG.WOF.gas.full,
      momentum: s.momentum,
      momentumCap: capOf(s, snap.field),
      zone: s.zone,
      zoneText: s.left ? tr('zone.off') : s.zone === null ? '–' : tr('zone.n', { n: s.zone }),
      attachKind: s.attachment.kind,
      attachBody: s.attachment.body ?? '',
      attachText: s.zone === null ? '' : attachText(s.attachment),
      mounted: s.mounted,
      horseText: s.horseZone === null ? '' : tr('zone.horse', { n: s.horseZone }),
      returnZones: snap.field && s.left ? returnZones(snap.field, snap.titans) : [],
      stress: src.derived?.stress_effective ?? src.stress ?? 0,
      owner,
      swapBlock: snap.step === 'swap' ? swapBlockText(snap, id) : null,
      leave: snap.mode === 'titan' ? blockText(leaveBlock(s, snap.field, snap.titans, !!g, snap.retreat)) : null,
      returnBack: snap.mode === 'titan' ? blockText(returnBlock(s, snap.retreat)) : null,
      odm: sys.odmUsed.includes(id),
      engaged: (sys.skirmish.engaged as any[]).filter((e) => e.soldier === id).map((e) => e.foe),
      holds: (sys.skirmish.holds as any[]).find((h) => h.soldier === id)?.foe ?? null,
      pinned: !!s.pinned,
      airborne: s.airborne,
      spent: (sys.movesSpent as string[]).includes(id),
    };
  });

  // ---- steps and the primary action
  const order5 = ['wings', 'deal', 'swap', 'play', 'end'];
  const mine = stepsOf(snap.mode) as string[];
  const closing = sys.step === 'closing';
  const checking = sys.step === 'end' || closing;
  const cur = closing ? order5.length : order5.indexOf(sys.step);
  const steps = order5.map((id, i) => ({ id, label: tr(`step.${id}`), short: tr(`step.${id}Short`), state: !mine.includes(id) ? 'off' : i < cur ? 'done' : i === cur ? 'on' : '' }));
  const log = combat.system.toObject().endLog as EndEntry[];
  const nc = nextCheck(log);
  const endFree = checking && !!game.user.isActiveGM && !endLock.held(combat.id);
  const enabled = trackerApply();
  const checks: CheckView[] = (log.length ? log : checksOf(snap.mode).map((check) => ({ check, state: 'waiting', ops: [], lines: [] }) as EndEntry)).map((e, index) => {
    const cat = checkCategoryOf(e.check);
    return {
      index,
      label: tr(`check.${e.check}`),
      detail: checkDetail(combat, snap, e.check),
      lines: e.lines ?? [],
      state: checking ? e.state : 'waiting',
      next: checking && index === nc,
      off: !!cat && !enabled[cat],
      manual: isManual(e.check),
      canRun: endFree && index === nc,
      canUndo: endFree && e.state === 'done',
      // A step under way is waiting on someone: a prompt card out to a player's client, or the roll
      // the GM has yet to make. The row says so rather than looking stalled or done (batch C).
      waiting: checking && index === nc && endLock.held(combat.id),
    };
  });
  const allStamped = checking && endComplete(roundCore(combat));
  let primary: TrackerView['primary'] = null;
  if (isGM) {
    if (sys.step === 'wings') primary = { action: 'keep-wings', label: tr('act.keepWings') };
    else if (sys.step === 'deal') primary = { action: 'deal', label: tr('act.deal') };
    else if (sys.step === 'swap') primary = { action: 'begin-play', label: tr('act.beginPlay') };
    else if (sys.step === 'play') primary = { action: 'next-card', label: tr('act.nextCard') };
    else if (sys.step === 'end') primary = allStamped ? { action: 'next-round', label: tr('act.nextRound', { n: combat.round + 1 }) } : nc >= 0 && endFree ? { action: 'apply-check', label: tr('act.applyCheck') } : null;
    else if (closing) primary = allStamped ? { action: 'close', label: tr('act.close') } : nc >= 0 && endFree ? { action: 'apply-check', label: tr('act.applyCheck') } : null;
  } else if (sys.step === 'play' && current?.isOwner && current.system.kind !== 'titan') primary = { action: 'next-card', label: tr('act.endTurn') };
  const hint = tr(`hint.${sys.step}`);

  // ---- cue
  let cue: TrackerView['cue'] = null;
  if (sys.step === 'swap') cue = { warn: false, text: tr('cue.swap') };
  else if (sys.step === 'wings') cue = { warn: false, text: wingsEditable(roundCore(combat)) ? tr('cue.wingsOpen') : tr('cue.wingsKept') };
  else if (sys.step === 'end' && !allStamped) cue = { warn: true, text: tr('cue.end') };
  else if (closing) cue = { warn: !allStamped, text: tr(allStamped ? 'cue.closed' : 'cue.closing') };
  else if (sys.step === 'play' && sys.swaps.length) cue = { warn: false, text: tr('cue.swapMade', { list: swapLines(snap, sys.swaps).join('; ') }) };
  const proposal = sys.proposal
    ? {
        text: tr('cue.proposal', { a: nm(snap, sys.proposal.a), b: nm(snap, sys.proposal.b) }),
        canAccept: isGM || !!actorOf(sys.proposal.b)?.isOwner,
        canCancel: isGM || !!actorOf(sys.proposal.a)?.isOwner || !!actorOf(sys.proposal.b)?.isOwner,
      }
    : null;

  // ---- engagement line
  const retreat = sys.retreat;
  const stay = stayLimitLeft(retreat, combat.round);
  const retreatText = retreat.active ? tr('line.retreatActive', { round: retreat.began, stay: stay ?? 0 }) : `${retreat.filled} ${tr('of')} ${retreat.length}`;
  const tacticName = (id: string) => E().tactics.find((x) => x.id === id)?.name ?? id;
  const tactics = (sys.tactics.held as string[]).map((id) => `${tacticName(id)}${sys.tactics.used.includes(id) ? ` (${tr('used')})` : ''}`).join(', ') || tr('none');
  const ending = endingState(snap);
  const endingMet = snap.mode === 'titan' && (ending.noFocusTitan || ending.noSoldierStanding);

  // ---- Wings
  const pcs = snap.soldiers.filter((s) => s.pc && s.alive && !s.left);
  const taken = new Set(Object.values(snap.wings));
  const wingOptions = snap.mode !== 'titan' ? [] : snap.soldiers
    .filter((s) => !s.pc && s.alive)
    .map((m) => {
      const pc = snap.wings[m.id] ?? '';
      const canEdit = wingsEditable(roundCore(combat), m.id) && (isGM || !!actorOf(m.id)?.isOwner || pcs.some((p) => actorOf(p.id)?.isOwner));
      return { mate: m.id, mateName: m.name, pc, choices: pcs.filter((p) => !taken.has(p.id) || p.id === pc).map((p) => ({ id: p.id, name: p.name })), canEdit };
    });
  const fallBack: TrackerView['fallBack'] = [];
  if (snap.step === 'wings' && snap.tactics.held.includes('fall-back') && !snap.tactics.used.includes('fall-back')) {
    for (const s of snap.soldiers) for (const t of focus) if (isClose(s.positions[t.label]) && !s.down && !s.carriedBy && !grabbed(s.id) && (isGM || actorOf(s.id)?.isOwner)) fallBack.push({ soldier: s.id, key: t.key, text: tr('act.fallBack', { name: s.name, label: t.label }) });
  }

  // ---- thin bar text
  let now = tr(`step.${sys.step}`);
  let next = '';
  if (inPlay && current) {
    const chip = chips[turnIndex];
    now = chip.kind === 'titan' ? tr('now.titan', { card: chip.card, label: chip.name }) : chip.kind === 'foe-group' ? tr('now.foes', { card: chip.card }) : chip.kind === 'wing' ? tr('now.wing', { name: chip.name, of: nm(snap, chip.of ?? '') }) : tr('now.soldier', { card: chip.card, name: chip.name });
    const nx = chips.slice(turnIndex + 1).find((c) => c.kind !== 'wing');
    if (nx) next = tr('now.next', { card: nx.card, name: nx.kind === 'titan' ? `${tr('titan')} ${nx.name}` : nx.short });
  }

  // ---- Skirmish
  const foes: FoeView[] = [];
  let foeName = '';
  let grit = '';
  let foeDice = '';
  if (snap.mode === 'skirmish') {
    const list = skirmishFoes(combat);
    const outs = list.filter((f: any) => f.actor?.system.out).length;
    const first = list[0]?.actor?.system;
    foeName = sys.skirmish.name || list[0]?.name || tr('foeGroup');
    grit = tr('sk.grit', { grit: (first?.grit ?? 1) + sys.skirmish.gritRise, out: outs });
    foeDice = first ? tr('sk.dice', { attack: first.attack_dice, guard: first.guard_dice, watch: first.watch, parley: first.parley + sys.skirmish.parleyRise }) : '';
    const groupNow = current?.system.kind === 'foe-group';
    list.forEach((tok: any, i: number) => {
      const a = tok.actor.system;
      const out = !!a.out || sys.skirmish.left.includes(tok.id);
      const turn = foeTurn({
        foe: { id: tok.id, label: i + 1, health: a.health, lost: a.health_lost, out, heldBy: (sys.skirmish.holds as any[]).find((h) => h.foe === tok.id)?.soldier ?? null, fightWeapon: a.weapon || a.fight_weapon.fixed, shootWeapon: a.shoot_weapon || null, loaded: a.firearm_loaded },
        soldiers: snap.soldiers,
        engaged: (id) => (sys.skirmish.engaged as any[]).some((e) => e.soldier === id && e.foe === tok.id),
        lastAttacker: (sys.skirmish.lastAttacker as any[]).find((x) => x.foe === tok.id)?.soldier ?? null,
        cardOf: (id) => snap.cards[id] ?? null,
        broken: sys.skirmish.broken,
      });
      const weapon = (CONFIG.WOF.weapons as any[]).find((w) => w.id === turn.weapon)?.name ?? '';
      foes.push({
        id: tok.id,
        label: i + 1,
        name: tok.name,
        img: tok.texture?.src ?? tok.actor.img,
        health: a.health,
        lost: a.health_lost,
        out,
        held: !!a.held,
        weapon: (CONFIG.WOF.weapons as any[]).find((w) => w.id === (a.weapon || a.fight_weapon.fixed))?.name ?? '',
        pick: tr(`foe.pick.${turn.step}`, { target: turn.target ? nm(snap, turn.target) : '', weapon }),
        canAct: isGM && groupNow && !out,
      });
    });
  }

  return {
    combat: combat.id,
    isGM,
    mode: snap.mode,
    step: sys.step,
    round: combat.round,
    title: snap.mode === 'titan' ? tr('board.titleTitan', { n: combat.round }) : tr('board.titleSkirmish', { n: combat.round }),
    anchor: rating?.name ?? '',
    anchorId: rating?.id ?? '',
    ratings: E().ratings.map((r: any) => ({ id: r.id, name: r.name, anchors: r.anchors })),
    steps,
    primary,
    hint,
    chips,
    titans,
    rows,
    swaps: swapLines(snap, sys.swaps),
    proposal,
    cue,
    checks,
    allStamped,
    retreat: { length: retreat.length, filled: retreat.filled, active: retreat.active, text: retreatText },
    field: snap.field
      ? {
          size: snap.field.size,
          sizeText: tr(`field.${snap.field.size}`),
          rating: snap.anchor?.name ?? '',
          zones: snap.field.zones.map((z) => {
            const r = ratingOf(z.rating);
            return {
              n: z.n,
              rating: z.rating,
              name: r?.name ?? z.rating,
              startName: z.start !== z.rating ? (ratingOf(z.start)?.name ?? z.start) : null,
              trait: r ? game.i18n.localize(CONFIG.WOF.labels.terrainTraits[r.trait] ?? '') : '',
              titans: snap.titans.filter((t) => t.zone === z.n).map((t) => (t.status === 'corpse' ? `${t.label} (${tr('corpse')})` : t.label)),
              soldiers: snap.soldiers.filter((x) => x.zone === z.n && x.alive && !x.left).map((x) => short(x.name)),
            };
          }),
        }
      : null,
    background: (sys.background as any[]).map((b) => ({ name: b.name, length: b.length, filled: b.filled, entered: !!b.entered })),
    tactics,
    cloaks: (sys.cloaks as string[]).map((id) => nm(snap, id)).join(', ') || tr('none'),
    odm: (sys.odmUsed as string[]).map((id) => nm(snap, id)).join(', '),
    ending: { met: endingMet, text: endingMet ? tr(ending.noFocusTitan ? 'ending.byNoFocus' : 'ending.byNoStanding') : '' },
    wingsEditable: wingsEditable(roundCore(combat)),
    wingOptions,
    fallBack,
    now,
    next,
    foes,
    foeName,
    grit,
    foeDice,
    ambush: tr(`sk.ambush.${sys.skirmish.ambush}`),
    canEnd: isGM && !closing && (snap.mode === 'skirmish' || endingMet),
    closing,
  };
}

const blockText = (key: string | null) => (key ? tr(`move.${key}`) : null);

function swapLines(snap: Snapshot, swaps: any[]): string[] {
  return swaps.map((s) => tr('note.swapLine', { a: nm(snap, s.a), ca: s.cardA, b: nm(snap, s.b), cb: s.cardB }));
}

function swapBlockText(snap: Snapshot, id: string): string | null {
  const s = snap.soldiers.find((x) => x.id === id)!;
  const key = !s.alive ? 'dead' : snap.cards[id] === null || snap.cards[id] === undefined ? (snap.wings[id] ? 'wing' : 'noCard') : s.down ? 'down' : grabbedIn(snap)(id) ? 'grabbed' : snap.swapped.includes(id) ? 'already' : null;
  return key ? tr(`swap.${key}`, { name: s.name }) : null;
}

/** Why two soldiers cannot swap (for the pick in the HUD and the board), or null. */
export function swapReason(a: string, b: string): string | null {
  const combat = currentEngagement();
  if (!combat) return tr('swap.unknown');
  const snap = snapshot(combat);
  const why = swapCheck(snap, a, b);
  if (!why) return null;
  if (why.key === 'far' && snap.field) {
    const sa = snap.soldiers.find((x) => x.id === a)!;
    const sb = snap.soldiers.find((x) => x.id === b)!;
    const n = sa.zone !== null && sb.zone !== null ? zoneDistance(snap.field, sa.zone, sb.zone) : Infinity;
    return tr('swap.farDetail', { a: sa.name, b: sb.name, n: Number.isFinite(n) ? n : '∞' });
  }
  return tr(`swap.${why.key}`, { name: why.who ?? '' });
}

/** An attachment named for the ledger: On Body A, Blind Spot A, on the ground, and so on. */
export const attachText = (a: Attachment) => (a.body ? tr(`attach.${a.kind}Of`, { label: a.body }) : tr(`attach.${a.kind}`));

function cellView(s: SoldierState, t: TitanRow, snap: Snapshot, grab: boolean, colour: string, isGM: boolean, owner: boolean): Cell {
  const p = s.positions[t.label] ?? null;
  const corpse = t.status === 'corpse';
  return {
    key: t.key,
    label: t.label,
    corpse,
    position: p,
    text: p ? tr(`pos.${p}`) : s.alive ? tr('pos.none') : tr('pos.noneDead'),
    icon: p ? POS_ICON[p] : '',
    close: isClose(p ?? undefined),
    grab,
    colour,
    // Moves are made on the engagement board (src/board/); the ledger shows the derived Position (16-35).
    options: [],
    hooked: t.flags.hooked.includes(s.id),
    attention: t.holder === s.id,
    flagLoud: t.flags.loud.includes(s.id),
    flagHurt: t.flags.hurt.includes(s.id),
    steps: [],
    letGo: s.attachment.body === t.label ? blockText(letGoBlock(s, grabbedIn(snap)(s.id))) : tr('move.notClose'),
    loud: corpse ? null : (() => {
      const why = drawAttentionBlock(s, t, grabbedIn(snap)(s.id));
      return why ? tr(`block.${why}`) : null;
    })(),
  };
}

function titanView(combat: any, snap: Snapshot, t: TitanRow, turns: any[], turnIndex: number, doneAll: boolean, current: any, colour: string): TitanView {
  const actor = titanActor(combat, t.key);
  const token = titanToken(combat, t.key);
  const sys = actor?.system;
  const src = sys?.toObject?.() ?? {};
  const isGM = !!game.user.isGM;
  const cards = turns
    .map((c: any, i: number) => ({ c, i }))
    .filter(({ c }) => c.system.kind === 'titan' && c.system.titan === t.key)
    .map(({ c, i }) => ({ n: c.initiative, done: doneAll || (turnIndex >= 0 && i < turnIndex), now: i === turnIndex }));
  const name = (id: string) => nm(snap, id);
  const row = combat.system.titans.find((r: any) => r.key === t.key);
  let holder = tr('att.nothing');
  if (t.grab) holder = tr('att.holdsGrab', { name: name(t.grab.soldier) });
  else if (t.decoy) holder = tr('att.decoy', { decoy: t.decoy.name, n: t.decoy.left });
  else if (t.holder) holder = name(t.holder);
  const ev =
    !t.grab && !t.decoy && t.status === 'focus'
      ? evaluateLadder({ titan: t, soldiers: snap.soldiers, grabbedBy: (id) => grabbedBy(snap, id), downCanMeet: E().downCanMeet, cardOf: (id) => tieCard(id, snap.cards, snap.wings), useCards: Object.values(snap.cards).some((c) => c !== null) })
      : null;
  const hiddenLadder = !!sys?.abnormal && !src.hidden_until_read?.attention_ladder && !isGM;
  const rungs = hiddenLadder ? [] : t.ladder.map((id) => ({ id, label: game.i18n.localize(`WOF.Rung.${id}`), met: ev?.rung === id }));
  const hint = t.grab ? tr('att.countdown', { n: t.grab.counted, lifted: t.grab.lifted ? tr('lifted') : tr('notLifted') }) : ev && ev.holder && ev.holder !== t.holder ? tr('att.wouldBe', { name: name(ev.holder) }) : '';
  const entries = (src.behavior_table?.entries ?? []) as any[];
  const nextId = src.next_behavior?.entry ?? '';
  const revealed = !!src.next_behavior?.revealed;
  const prevName = entries.find((e) => e.id === src.previous_behavior)?.name ?? tr('none');
  const hiddenTough = !!sys?.abnormal && !src.hidden_until_read?.toughness && !isGM;
  const bodyParts = partsOf(actor);
  const parts = bodyParts.map((p) => ({
    id: p.id,
    short: PART_SHORT[p.id] ?? p.id,
    icon: iconPath(`body-${p.kind}`),
    state: STATE_INDEX[p.state] ?? 0,
    letter: STATE_LETTER[STATE_INDEX[p.state] ?? 0],
    count: p.progress,
    title: `${game.i18n.localize(`WOF.BodyPart.${p.id}`)}: ${game.i18n.localize(`WOF.BodyPartState.${p.state}`)}, ${p.progress}${hiddenTough ? '' : ` ${tr('of')} ${t.grab?.arm === p.id ? E().gripToughness : p.toughness}`}`,
  }));
  const by = (src.openings_by ?? []) as string[];
  const openings = Array.from({ length: Math.max(src.openings ?? 0, by.length) }, (_, i) => {
    const who = by[i] ? name(by[i]) : '';
    return { initial: who ? who[0] : '•', name: who || tr('byHand') };
  });
  const flags = [...t.flags.hurt.map((id) => tr('flag.hurt', { name: name(id) })), ...t.flags.loud.map((id) => tr('flag.loud', { name: name(id) })), ...t.flags.hooked.map((id) => tr('flag.hooked', { name: name(id) }))].join('; ');
  const hiddenClock = !!sys?.abnormal && !src.hidden_until_read?.regeneration_clock && !isGM;
  const kind = sys ? `${sys.abnormal ? `${tr('abnormal')}, ` : ''}${game.i18n.localize(`WOF.SizeClass.${sys.size_class}`)}` : '';
  // Frenzy is held by the Focus Titan's row of the engagement, not by its actor, so a corpse keeps none.
  const frenzy = t.status === 'focus' ? Math.max(0, Math.min(Number(row?.frenzy ?? (t as any).frenzy ?? 0), FRENZY_CAP)) : 0;
  return {
    key: t.key,
    label: t.label,
    zone: t.zone,
    colour,
    name: token?.name ?? actor?.name ?? '?',
    kind,
    tempo: t.tempo,
    img: actor?.img ?? '',
    corpse: t.status === 'corpse',
    cards,
    holder,
    holderNone: !t.grab && !t.decoy && !t.holder,
    att: t.grab ? tr('att.chipHolds', { name: short(name(t.grab.soldier)), lifted: t.grab.lifted ? `, ${tr('lifted')}` : '' }) : t.decoy ? tr('att.chipDecoy', { decoy: t.decoy.name }) : t.holder ? tr('att.chip', { name: short(name(t.holder)) }) : tr('att.chipNothing'),
    rungs,
    hint,
    next: { sealed: !revealed && !isGM, name: entries.find((e) => e.id === nextId)?.name ?? '', revealed, entryId: nextId },
    prev: prevName,
    entries: isGM ? entries.map((e) => ({ id: e.id, name: e.name, canHappen: meetsBodyParts(e, bodyParts) })) : [],
    parts,
    openings,
    openingsBy: [...new Set(by.filter(Boolean).map(name))].join(', '),
    frenzy,
    frenzyCap: FRENZY_CAP,
    frenzyTitle: tr('frenzyTitle', { n: frenzy, cap: FRENZY_CAP }),
    flags,
    regen: { length: sys?.regeneration_clock ?? 1, filled: sys?.regeneration ?? 0, hidden: hiddenClock },
    heave: sys ? `${sys.heave_count} ${tr('of')} ${sys.heave}` : '',
    grab: t.grab ? name(t.grab.soldier) : null,
    now: current?.system.kind === 'titan' && current.system.titan === t.key,
    canPeek: isGM,
    ...(row ? {} : {}),
  };
}

function checkDetail(combat: any, snap: Snapshot, check: string): string {
  const sys = combat.system;
  switch (check) {
    case 'gas-rolls': {
      const due = (sys.odmUsed as string[]).filter((id) => snap.soldiers.find((s) => s.id === id)?.alive).map((id) => nm(snap, id));
      return due.length ? tr('check.due', { who: due.join(', ') }) : tr('check.noGas');
    }
    case 'regeneration':
      return snap.titans
        .filter((t) => t.status === 'focus')
        .map((t) => {
          const a = titanActor(combat, t.key);
          return `${t.label} ${a?.system.regeneration ?? 0} ${tr('of')} ${a?.system.abnormal && !a?.system.hidden_until_read?.regeneration_clock && !game.user.isGM ? '?' : (a?.system.regeneration_clock ?? '?')}`;
        })
        .join(', ');
    case 'background-clocks':
      return sys.retreat.active ? tr('check.stopped') : (sys.background as any[]).filter((b) => !b.entered).map((b) => `${b.name} ${b.filled} ${tr('of')} ${b.length}`).join(', ') || tr('none');
    case 'retreat-clock':
      return sys.retreat.active ? tr('check.stopped') : `${sys.retreat.filled} ${tr('of')} ${sys.retreat.length}`;
    case 'momentum': {
      // Everyone who made no ODM move this round loses all their Momentum (round.yaml, end_steps).
      const losing = snap.soldiers.filter((x) => x.momentum > 0 && !(sys.odmUsed as string[]).includes(x.id)).map((x) => x.name);
      return losing.length ? tr('check.momentumDue', { who: losing.join(', ') }) : tr('check.detail.momentum');
    }
    case 'round-ends':
      return tr('check.lost');
    case 'broken-leave':
      return tr('check.brokenDetail');
    case 'ending':
      return tr('check.endingDetail');
    default:
      return tr(`check.detail.${check}`);
  }
  return '';
}
