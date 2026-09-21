/**
 * The GM's side of the Engagement tracker (foundry/docs/tracker-plan.md, sections 3 to 7): setup, the
 * round's steps, Wings, the deal and swaps, card events, Positions, a Titan entering and dying, and the
 * round-end automation with Undo. Every rule decision is a pure function in src/rules/engagement/.
 */
import { SYSTEM_ID } from '../config.ts';
import { evaluateLadder, chooseEntry, enteringAttention, entryTargets, retargetForEntry } from '../rules/engagement/attention.ts';
import { behaviorResult, dealBlock, dealCards, frenzyAfterRound, frenzyRule, skirmishHolders, tieCard, titanHolders } from '../rules/engagement/cards.ts';
import { countTurn, holdingArm, release } from '../rules/engagement/grab.ts';
import { coreOf, grabbedIn, swapCheck } from '../rules/engagement/guard.ts';
import { flightEnds, flightPrefix, moveFlags, holdsAPosition, leaveBlock, letGoBlock, moveBlock, moveContext, moveOptionsFor, nextLabel, ratingRows, returnBlock, returnZones, routeOption, type MoveKind, type ZoneMoveOption } from '../rules/engagement/positions.ts';
import { capOf, flightResult, momentumCap, momentumEnd, spendBlock, spendCost, trimToCap } from '../rules/engagement/momentum.ts';
import { retreatBinds, retreatOptions } from '../rules/engagement/retreat.ts';
import { positionsAfterStride, strideFor, strideMoves } from '../rules/engagement/stride.ts';
import { strideMomentum, titanStands, zoneOpened, type FieldChange } from '../rules/engagement/field.ts';
import { detached, entryZone, generateField, momentumCapAt, setRating, wreckZone, zoneDistance, zoneRules, type Attachment, type FieldSize, type FieldState, type Placement, type ZoneId } from '../rules/engagement/zones.ts';
import {
  autoChecks,
  checkCategory,
  closingLog,
  endComplete,
  gasRollsDue,
  nextCheck,
  noteWingEvent,
  planBackground,
  planRegeneration,
  planRetreat,
  roundBlock,
  roundNext,
  startRetreat,
  undoOrder,
  wingBlock,
  type EndEntry,
  type RoundAction,
  type RoundCore,
  type TrackerCategory,
  type WingEvent,
} from '../rules/engagement/round.ts';
import { planTitanDeath } from '../rules/engagement/titan-death.ts';
import { engagementLimited, griefGains, keptResponses, relievedStress, retiring, turnLimitsToChange, type InjuryState } from '../rules/engagement/closing.ts';
import { steamRollers } from '../rules/engagement/harm-rolls.ts';
import { foeCandidates, groupBroken, skirmishEnding, rollFightWeapon } from '../rules/engagement/skirmish.ts';
import { emptyFlags, type Snapshot, type SoldierState } from '../rules/engagement/types.ts';
import { isGrounded, nextBehaviorFor, type BodyPart } from '../rules/titan.ts';
import { rollGas } from '../dice/tables.ts';
import { answerCardOf, postPrompt, promptOpsOf, PROMPT_OPS_FLAG, recordOpsOnMessage, registerPromptResolver, type PromptResolver } from '../dice/prompt.ts';
import { trackerApply } from '../settings.svelte.ts';
import { CARD, ENGAGEMENT, engagementTurns, isEngagement } from './combat.ts';
import { KeyedLock } from './busy.ts';
import { fearRolls, trackerDeaths } from './fear.ts';
import { rollFall, rollSteam } from './harm.ts';
import { postNote, tr } from './notes.ts';
import { Recorder, revertOps } from './recorder.ts';
import { E, cardsOf, ensureRules, rowZone, grabbedBy, partsOf, ratingOf, snapshot, soldierActors, soldierIn, soldierState, titanActor, titanRow, titanToken, wingsOf, type PlacementRow } from './snapshot.ts';

const rng = () => (CONFIG.Dice?.randomUniform ? CONFIG.Dice.randomUniform() : Math.random());
const d6 = () => Math.floor(rng() * 6) + 1;

export const isGM = () => !!game.user?.isGM;

/** Only the active GM runs automation, so two GM clients never apply a step twice. */
export const isActiveGM = () => !!game.user?.isActiveGM;

const plain = (combat: any) => combat.system.toObject();

async function writeSystem(combat: any, patch: Record<string, unknown>): Promise<void> {
  await combat.update(Object.fromEntries(Object.entries(patch).map(([k, v]) => [`system.${k}`, v])));
}

const nameOf = (id: string) => game.actors.get(id)?.name ?? '?';

// ---------------------------------------------------------------- zones and attachments on the engagement (decision batch 16)

/** The placement rows a Recorder will commit. */
const rowsOf = (rec: Recorder, combat: any): PlacementRow[] => (rec.get(combat, 'system.placements') as PlacementRow[]) ?? [];

const CLOSE_KINDS = ['on-body', 'blind-spot', 'grabbed'];

/**
 * Writes one soldier's zone and attachment (and their horse's zone when given) on the engagement. A
 * soldier who takes an attachment to a body gets the next arrival stamp (Snapshot, arrivals).
 */
export function recordPlacement(rec: Recorder, combat: any, soldierId: string, p: Partial<Placement> & { horseZone?: ZoneId | null }): void {
  const rows = rowsOf(rec, combat);
  const had = rows.find((r) => r.soldier === soldierId);
  const base: PlacementRow = had ?? { soldier: soldierId, zone: null, kind: 'ground', body: '', horseZone: null, since: 0 };
  const next: PlacementRow = { ...base };
  if ('zone' in p) next.zone = p.zone ?? null;
  if (p.attachment) {
    next.kind = p.attachment.kind;
    next.body = p.attachment.body ?? '';
  }
  if ('horseZone' in p) next.horseZone = p.horseZone ?? null;
  const arrived = CLOSE_KINDS.includes(next.kind) && (next.kind !== base.kind || next.body !== base.body || !had);
  if (arrived) next.since = Math.max(0, ...rows.map((r) => r.since ?? 0)) + 1;
  rec.set(combat, 'system.placements', had ? rows.map((r) => (r.soldier === soldierId ? next : r)) : [...rows, next]);
}

/** The board's event, in the same update as the change it shows (combat.system.boardEvent); never undone. */
export function boardEvent(rec: Recorder, combat: any, kind: 'stride' | 'flight' | 'wreck' | 'fall' | 'steam' | 'enter', data: Record<string, unknown>): void {
  // The seq is set when the recorder commits (recorder.ts, nextBoardSeq).
  rec.setUnrecorded(combat, 'system.boardEvent', { seq: 0, kind, data });
}

const zoneText = (zone: ZoneId | null) => (zone === null ? tr('zone.off') : tr('zone.n', { n: zone }));
const attachText = (a: Attachment) => (a.body ? tr(`attach.${a.kind}Of`, { label: a.body }) : tr(`attach.${a.kind}`));
const placeText = (p: Placement) => (p.zone === null ? tr('zone.off') : `${zoneText(p.zone)}, ${attachText(p.attachment)}`);

/** Writes a field change (field.ts): the placements, the airborne it clears, and a line for each. */
function applyFieldChange(rec: Recorder, combat: any, snap: Snapshot, ch: FieldChange): void {
  const name = (id: string) => snap.soldiers.find((x) => x.id === id)?.name ?? nameOf(id);
  for (const [id, p] of Object.entries(ch.placements)) recordPlacement(rec, combat, id, p);
  for (const id of ch.landed) {
    rec.set(game.actors.get(id), 'system.airborne', false);
    rec.line(tr('zone.openGround', { name: name(id) }));
  }
  for (const id of ch.onBody) rec.line(tr('zone.openOnBody', { name: name(id), label: ch.placements[id]?.attachment.body ?? '' }));
  for (const id of ch.freed) {
    rec.set(game.actors.get(id), 'system.pinned.active', false);
    rec.line(tr('zone.unpinned', { name: name(id) }));
  }
}

/** zone-becomes-open (16-21; OQ-205): every anchored soldier lands; the Blind Spot moves only under a standing Titan (field.ts, zoneOpened). */
function zoneBecomesOpen(rec: Recorder, combat: any, snap: Snapshot, zone: ZoneId): void {
  applyFieldChange(rec, combat, snap, zoneOpened(snap.soldiers, snap.titans, zone));
}

/** Momentum above the anchors of each soldier's zone is lost at once (anchor-ratings.yaml, momentum, cap). */
function trimMomentum(rec: Recorder, combat: any, field: FieldState | null): void {
  const snap = snapshot(combat);
  const placed = snap.soldiers.map((s) => {
    const row = rowsOf(rec, combat).find((r) => r.soldier === s.id);
    return { ...s, zone: row ? row.zone : s.zone, momentum: Number(rec.get(game.actors.get(s.id), 'system.momentum') ?? s.momentum) };
  });
  for (const [id, value] of Object.entries(trimToCap(placed, field))) {
    rec.set(game.actors.get(id), 'system.momentum', value);
    rec.line(tr('end.momentumTrim', { name: nameOf(id), n: value }));
  }
}

// ---------------------------------------------------------------- wing events

async function wingEvent(combat: any, event: WingEvent, rec?: Recorder): Promise<void> {
  const sys = plain(combat);
  if (sys.mode !== 'titan') return;
  const core = noteWingEvent(roundCore(combat), event, wingsOf(combat));
  if (rec) {
    rec.set(combat, 'system.wingsOpen', core.wingsOpen);
    rec.set(combat, 'system.reassign', core.reassign);
  } else await writeSystem(combat, { wingsOpen: core.wingsOpen, reassign: core.reassign });
}

export function roundCore(combat: any): RoundCore {
  const s = combat.system;
  return { mode: s.mode, step: s.step, round: combat.round, wingsSet: s.wingsSet, wingsOpen: s.wingsOpen, reassign: [...s.reassign], endLog: plain(combat).endLog as EndEntry[] };
}

// ---------------------------------------------------------------- setup

export interface SetupChoice {
  mode: 'titan' | 'skirmish';
  /** The field rating (engagement-setup.yaml, field-rating). */
  anchor: string;
  /** The field's size and any zone's rating the GM names as framing (16-6, 16-33); the rest is rolled. */
  field?: { size: FieldSize; zones: Record<number, string> };
  focus: string | null;
  background: { name: string; titan: string; actor: string; length: number }[];
  soldiers: string[];
  tactics: string[];
  skirmish?: { foes: string[]; night: boolean; ambush: 'none' | 'squad' | 'foes'; name: string; kind: string };
}

/** Resets a Titan's play values as it becomes a Focus Titan (engagement-flow.yaml, starting, titan-values) and rolls its Next Behavior. */
export function titanStartPatch(actor: any, label: string): Record<string, unknown> {
  const s = actor.system.toObject();
  const parts = (s.body_parts as BodyPart[]).map((p) => ({ ...p, state: 'intact' as const, progress: 0 }));
  // A Titan that has just become a Focus Titan is at Frenzy 0 (behavior-procedure.yaml, next_behavior,
  // frenzy_when), so its first Next Behavior is a plain D6 with no Frenzy to pass.
  const next = nextBehaviorFor(s.behavior_table.entries, parts, '', d6(), 0);
  return {
    'system.body_parts': parts,
    'system.openings': 0,
    'system.openings_by': [],
    'system.regeneration': 0,
    'system.previous_behavior': '',
    'system.next_behavior': { entry: next, revealed: false },
    'system.attention_holder': '',
    'system.focus_titan_label': label,
    'system.corpse': false,
    'system.heave_count': 0,
  };
}

const titanRowData = (key: string, label: string, round: number) => ({ key, label, status: 'focus', entered: round, grab: null, decoy: null, decoysInRow: 0, flags: emptyFlags(), dodges: [], pending: '', clearTheHand: false, frenzy: 0 });

/** A Focus Titan's Frenzy, which is added to its behavior roll (batch F2). */
export const frenzyOf = (combat: any, key: string): number => Number((plain(combat).titans as any[]).find((t) => t.key === key)?.frenzy ?? 0);

export async function startEngagement(choice: SetupChoice): Promise<any> {
  if (!isGM()) return null;
  const scene = game.scenes.viewed;
  if (!scene) return null;
  const Combat = foundry.utils.getDocumentClass('Combat');
  const mode = choice.mode;
  ensureRules();
  // engagement-setup.yaml, steps: the field's size, its rating, and the terrain mix (16-6).
  const field = mode === 'titan' ? generateField(choice.field?.size ?? zoneRules().defaultSize, choice.anchor, choice.field?.zones ?? {}, d6) : null;
  const hasHorse = (id: string) => [...(game.actors.get(id)?.items ?? [])].some((i: any) => i.type === 'gear' && i.system.subtype === 'horse');
  const system: Record<string, unknown> = {
    mode,
    step: mode === 'titan' ? 'wings' : 'deal',
    anchor: choice.anchor,
    soldiers: choice.soldiers,
    titans: [],
    background: choice.background.map((b) => ({ ...b, filled: 0, entered: 0 })),
    retreat: { length: E().setup.retreatClock, filled: 0, active: false, began: 0 },
    field,
    // Starting placement (positions.yaml, placement, 16-7): every soldier on the ground in the Squad's
    // start zone, a dismounted soldier's horse beside them.
    placements: field ? choice.soldiers.map((id) => ({ soldier: id, zone: field.squadStart, kind: 'ground', body: '', horseZone: hasHorse(id) ? field.squadStart : null, since: 0 })) : [],
    boardEvent: null,
    tactics: { held: choice.tactics, used: [] },
  };
  // Focus Titan A stands in the centre zone (16-7).
  if (mode === 'titan' && choice.focus) system.titans = [{ ...titanRowData(choice.focus, 'A', 1), zone: field?.centre ?? 0 }];
  if (mode === 'skirmish' && choice.skirmish) system.skirmish = { ...choice.skirmish, acted: [], engaged: [], holds: [], lastAttacker: [], gritRise: 0, parleyRise: 0, broken: false, left: [], sizedUp: false, parleyed: [], yielded: false };
  const combat = await Combat.create({ type: ENGAGEMENT, scene: scene.id, active: true, round: 1, turn: null, system });
  const tokenOf = (actorId: string) => scene.tokens.find((t: any) => t.actorId === actorId);
  const rows: Record<string, unknown>[] = choice.soldiers.map((id) => {
    const tok = tokenOf(id);
    return { type: CARD, actorId: id, tokenId: tok?.id ?? null, sceneId: scene.id, initiative: null, system: { kind: 'soldier' } };
  });
  if (mode === 'titan' && choice.focus) {
    const tok = scene.tokens.get(choice.focus);
    for (let i = 0; i < Math.max(1, tok.actor.system.tempo); i++) rows.push({ type: CARD, actorId: tok.actorId, tokenId: tok.id, sceneId: scene.id, initiative: null, system: { kind: 'titan', titan: tok.id, index: i } });
    await tok.actor.update(titanStartPatch(tok.actor, 'A'));
  }
  if (mode === 'skirmish' && choice.skirmish?.foes.length) {
    const first = scene.tokens.get(choice.skirmish.foes[0]);
    rows.push({ type: CARD, actorId: first.actorId, tokenId: first.id, sceneId: scene.id, name: choice.skirmish.name, initiative: null, system: { kind: 'foe-group' } });
    for (const id of choice.skirmish.foes) {
      const foe = scene.tokens.get(id)?.actor;
      if (!foe) continue;
      const fw = foe.system.fight_weapon;
      const weapon = fw.fixed || rollFightWeapon(fw.rows, d6(), fw.at_night?.replaces ? fw.at_night : null, choice.skirmish.night);
      await foe.update({ 'system.health_lost': 0, 'system.out': false, 'system.held': false, 'system.firearm_loaded': true, 'system.weapon': weapon });
    }
  }
  await combat.createEmbeddedDocuments('Combatant', rows);
  // Nobody starts airborne or holding Momentum; a Skirmish has no zones.
  for (const id of choice.soldiers) {
    const a = game.actors.get(id);
    if (!a) continue;
    await a.update({ 'system.positions.left': false, 'system.positions.entries': [], 'system.airborne': false, 'system.momentum': 0 });
  }
  await combat.activate();
  const who = choice.soldiers.map(nameOf).join(', ');
  if (mode === 'titan') {
    const focus = choice.focus ? scene.tokens.get(choice.focus)?.actor : null;
    const lines = [
      tr('note.startTitan', { anchor: E().ratings.find((r) => r.id === choice.anchor)?.name ?? choice.anchor, titan: focus?.name ?? '?' }),
      tr('note.startField', { size: tr(`field.${field?.size ?? 'standard'}`), zones: (field?.zones ?? []).map((z) => `${z.n} ${ratingOf(z.rating)?.name ?? z.rating}`).join(', ') }),
      tr('note.startWho', { who }),
    ];
    await postNote({ title: tr('note.startTitle'), lines, titan: true, round: 1 });
    // The Fear Rolls for a first Titan Engagement and an Abnormal (fear-rolls.yaml, triggers).
    await fearRolls(combat, { kind: 'start', abnormal: !!focus?.system.abnormal }, null);
  } else {
    await postNote({ title: tr('note.startSkirmish'), lines: [tr('note.startSkirmishLine', { name: choice.skirmish?.name ?? '' })], round: 1 });
  }
  return combat;
}

// ---------------------------------------------------------------- round steps

export async function roundAction(combat: any, action: RoundAction): Promise<void> {
  if (!isGM()) return;
  const block = roundBlock(roundCore(combat), action);
  if (block) {
    ui.notifications.warn(tr(`round.${block}`));
    return;
  }
  switch (action) {
    case 'keep-wings':
      return keepWings(combat);
    case 'deal':
      return deal(combat);
    case 'begin-play':
      return beginPlay(combat);
    case 'finish-play':
      return finishPlay(combat);
    case 'next-round':
      return nextRound(combat);
  }
}

async function keepWings(combat: any): Promise<void> {
  const next = roundNext(roundCore(combat), 'keep-wings');
  const wings = wingsOf(combat);
  const updates = [...combat.combatants]
    .filter((c: any) => c.system.kind === 'soldier' || c.system.kind === 'wing')
    .map((c: any) => ({ _id: c.id, initiative: null, 'system.kind': wings[c.actorId] ? 'wing' : 'soldier' }));
  await combat.updateEmbeddedDocuments('Combatant', updates);
  await writeSystem(combat, { step: next.step, wingsSet: true, wingsOpen: false, reassign: [] });
  const lines = Object.entries(wings).map(([m, p]) => tr('note.wingLine', { mate: nameOf(m), pc: nameOf(p) }));
  await postNote({ title: tr('note.wingsKept'), lines: lines.length ? lines : [tr('note.noWings')], round: combat.round });
}

export async function setWing(combat: any, mate: string, pc: string | null): Promise<boolean> {
  const snap = snapshot(combat);
  const m = snap.soldiers.find((s) => s.id === mate);
  const p = pc ? (snap.soldiers.find((s) => s.id === pc) ?? null) : null;
  if (!m) return false;
  const why = wingBlock({ core: coreOf(snap), mate: m, pc: p, wings: snap.wings });
  if (why) {
    ui.notifications.warn(tr(`wing.${why}`));
    return false;
  }
  const wings = (plain(combat).wings as { mate: string; pc: string }[]).filter((w) => w.mate !== mate);
  if (pc) wings.push({ mate, pc });
  await writeSystem(combat, { wings, reassign: combat.system.reassign.filter((x: string) => x !== mate) });
  return true;
}

async function deal(combat: any): Promise<void> {
  const snap = snapshot(combat);
  const sys = plain(combat);
  const foesIn = sys.mode === 'skirmish' ? skirmishFoes(combat).filter((f: any) => !f.actor?.system.out && !sys.skirmish.left.includes(f.id)).length : 0;
  const holders = sys.mode === 'skirmish' ? skirmishHolders(snap.soldiers, foesIn, 'foes') : titanHolders(snap.soldiers, snap.titans, snap.wings);
  const block = dealBlock(holders, E().cards);
  if (block) {
    ui.notifications.warn(block.startsWith('too-many') ? tr('deal.tooMany', { n: block.split(':')[1], max: E().cards }) : tr('deal.nobody'));
    return;
  }
  const dealt = dealCards(holders, rng, E().cards);
  // Tempo cards: one combatant per card for each Focus Titan.
  for (const t of snap.titans.filter((x) => x.status === 'focus')) {
    const mine = [...combat.combatants].filter((c: any) => c.system.kind === 'titan' && c.system.titan === t.key);
    const need = dealt[t.key]?.length ?? 0;
    if (mine.length < need) {
      const tok = titanToken(combat, t.key);
      const extra = Array.from({ length: need - mine.length }, (_, i) => ({ type: CARD, actorId: tok?.actorId, tokenId: t.key, sceneId: combat.scene?.id, initiative: null, system: { kind: 'titan', titan: t.key, index: mine.length + i } }));
      await combat.createEmbeddedDocuments('Combatant', extra);
    }
  }
  const updates: Record<string, unknown>[] = [];
  const titanSeen = new Map<string, number>();
  for (const c of combat.combatants) {
    const kind = c.system.kind;
    let card: number | null = null;
    if (kind === 'soldier') card = dealt[c.actorId]?.[0] ?? null;
    else if (kind === 'titan') {
      const i = titanSeen.get(c.system.titan) ?? 0;
      titanSeen.set(c.system.titan, i + 1);
      card = dealt[c.system.titan]?.[i] ?? null;
    } else if (kind === 'foe-group') card = dealt.foes?.[0] ?? null;
    updates.push({ _id: c.id, initiative: card, defeated: kind === 'soldier' ? !snap.soldiers.find((s) => s.id === c.actorId)?.alive : c.defeated });
  }
  await combat.updateEmbeddedDocuments('Combatant', updates);
  const next = roundNext(roundCore(combat), 'deal');
  await writeSystem(combat, { step: next.step, swaps: [], proposal: null });
  const lines = holders.map((h) => `${h.kind === 'titan' ? (snap.titans.find((t) => t.key === h.id)?.label ?? '?') : h.kind === 'foe-group' ? sys.skirmish.name || tr('foeGroup') : nameOf(h.id)} ${dealt[h.id].join(', ')}`);
  await postNote({ title: tr('note.dealt'), lines: [lines.join('; ')], round: combat.round });
  if (next.step === 'play') await startPlay(combat);
}

async function beginPlay(combat: any): Promise<void> {
  await writeSystem(combat, { step: 'play', proposal: null });
  await startPlay(combat);
}

async function startPlay(combat: any): Promise<void> {
  combat.setupTurns();
  if (!combat.turns.length) return;
  await combat.update({ turn: 0 }, { turnEvents: false });
  await cardStart(combat, combat.turns[0], false);
}

/** The next card: the GM advances; the acting soldier's owner may end their own turn. */
export async function nextCard(combat: any): Promise<any> {
  if (combat.system.step !== 'play') {
    ui.notifications.info(tr('round.notPlay'));
    return combat;
  }
  const turn = combat.turn ?? 0;
  const current = combat.turns[turn];
  const last = turn >= combat.turns.length - 1;
  if (!isGM()) {
    if (!current?.isOwner) return combat;
    if (!last) return combat.update({ turn: turn + 1 }, { direction: 1 });
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'end-turn', combat: combat.id });
    return combat;
  }
  if (!last) return combat.update({ turn: turn + 1 }, { direction: 1 });
  if (current) await cardEnd(combat, current, false);
  return finishPlay(combat);
}

async function finishPlay(combat: any): Promise<void> {
  const next = roundNext(roundCore(combat), 'finish-play');
  await combat.update({ turn: null, 'system.step': 'end', 'system.endLog': next.endLog }, { turnEvents: false });
  await postNote({ title: tr('note.allCards'), lines: [], round: combat.round });
  await runEnd(combat);
}

async function nextRound(combat: any): Promise<void> {
  const next = roundNext(roundCore(combat), 'next-round');
  const sys = plain(combat);
  const titans = (sys.titans as any[]).map((t) => ({ ...t, dodges: [], pending: '' }));
  await combat.updateEmbeddedDocuments('Combatant', [...combat.combatants].map((c: any) => ({ _id: c.id, initiative: null })));
  const skirmish = sys.mode === 'skirmish' ? { ...sys.skirmish } : sys.skirmish;
  await combat.update(
    {
      round: next.round,
      turn: null,
      'system.step': next.step,
      'system.endLog': [],
      'system.swaps': [],
      'system.proposal': null,
      'system.odmUsed': [],
      'system.movesSpent': [],
      'system.cleanLine': [],
      'system.quiet': [],
      'system.titans': titans,
      'system.skirmish': skirmish,
    },
    { turnEvents: false },
  );
  const lines: string[] = [];
  if (sys.retreat.active) lines.push(tr('note.retreatForced'));
  await postNote({ title: tr('note.roundBegins', { n: next.round }), lines, round: next.round });
}

/** The handler for Combat#nextRound: from the end step only. */
export async function nextRoundHandler(combat: any): Promise<any> {
  if (!isGM()) return combat;
  await roundAction(combat, 'next-round');
  return combat;
}

// ---------------------------------------------------------------- swaps

export async function swap(combat: any, a: string, b: string): Promise<boolean> {
  const snap = snapshot(combat);
  const why = swapCheck(snap, a, b);
  if (why) {
    ui.notifications.warn(tr(`swap.${why.key}`, { name: why.who ?? '' }));
    return false;
  }
  const ca = snap.cards[a]!;
  const cb = snap.cards[b]!;
  const combatantOf = (id: string) => [...combat.combatants].find((c: any) => c.actorId === id && c.system.kind === 'soldier');
  await combat.updateEmbeddedDocuments('Combatant', [
    { _id: combatantOf(a).id, initiative: cb },
    { _id: combatantOf(b).id, initiative: ca },
  ]);
  await writeSystem(combat, { swaps: [...plain(combat).swaps, { a, b, cardA: ca, cardB: cb }], proposal: null });
  await postNote({ title: tr('note.swapped'), lines: [tr('note.swapLine', { a: nameOf(a), ca, b: nameOf(b), cb })], round: combat.round });
  return true;
}

export async function propose(combat: any, a: string, b: string, by: string): Promise<boolean> {
  const why = swapCheck(snapshot(combat), a, b);
  if (why) return false;
  await writeSystem(combat, { proposal: { a, b, by } });
  return true;
}

// ---------------------------------------------------------------- card events

async function markActed(combat: any, combatant: any): Promise<void> {
  const sys = plain(combat);
  if (sys.mode !== 'skirmish') return;
  const id = combatant.system.kind === 'foe-group' ? 'foes' : combatant.actorId;
  if (!sys.skirmish.acted.includes(id)) await writeSystem(combat, { 'skirmish.acted': [...sys.skirmish.acted, id] });
}

export async function cardStart(combat: any, combatant: any, skipped: boolean): Promise<void> {
  if (!isActiveGM() || !combatant) return;
  await markActed(combat, combatant);
  if (combatant.system.kind === 'titan' && !skipped) await titanCardStart(combat, combatant);
  if (combatant.system.kind === 'soldier' || combatant.system.kind === 'wing') {
    const actor = combatant.actor;
    const s = actor ? soldierState(actor) : null;
    if (s?.pinned) {
      const row = plain(combat).titans.find((t: any) => t.label === s.pinned!.body);
      if (row?.status === 'corpse') await postNote({ title: tr('note.corpseHeat', { name: actor.name }), lines: [tr('note.corpseHeatLine')], round: combat.round }, { gmOnly: true });
    }
  }
}

export async function cardEnd(combat: any, combatant: any, _skipped: boolean): Promise<void> {
  if (!isActiveGM() || !combatant) return;
  const kind = combatant.system.kind;
  if (kind === 'soldier' || kind === 'wing') await countGrabbedTurn(combat, combatant.actorId);
  if (kind === 'titan') await titanCardEnd(combat, combatant);
}

/** The Grab countdown (grab.yaml, countdown): lifted after the first counted turn, devoured after the second. */
async function countGrabbedTurn(combat: any, soldierId: string): Promise<void> {
  const sys = plain(combat);
  const row = (sys.titans as any[]).find((t) => t.status === 'focus' && t.grab?.soldier === soldierId);
  if (!row) return;
  const { grab, event } = countTurn(row.grab);
  const rec = new Recorder();
  const titans = (sys.titans as any[]).map((t) => (t.key === row.key ? { ...t, grab } : t));
  rec.set(combat, 'system.titans', titans);
  const actor = game.actors.get(soldierId);
  if (event === 'devoured') {
    const titan = titanActor(combat, row.key);
    rec.set(titan, 'system.attention_holder', '');
    const parts = partsOf(titan).map((p) => (p.id === row.grab.arm ? { ...p, progress: 0 } : p));
    rec.set(titan, 'system.body_parts', parts);
    await rec.commit();
    trackerDeaths.add(soldierId);
    await actor.toggleStatusEffect('dead', { active: true, overlay: true });
    await wingEvent(combat, { kind: 'death', soldier: soldierId });
    await fearRolls(combat, { kind: 'dies', soldier: soldierId }, rec);
    await postNote({ title: tr('note.devoured', { name: actor.name }), lines: rec.lines, titan: true, round: combat.round });
  } else {
    await rec.commit();
    await postNote({ title: tr('note.lifted', { name: actor?.name ?? '?' }), lines: [tr('note.liftedLine')], titan: true, round: combat.round });
  }
}

// ---------------------------------------------------------------- a Focus Titan's card

const entryOf = (actor: any, id: string) => (actor.system.toObject().behavior_table.entries as any[]).find((e) => e.id === id);

/**
 * The behavior roll (behavior-procedure.yaml, next_behavior.roll, as amended by batch F2): D6 plus
 * the Focus Titan's Frenzy, a result above the table's highest entry reading as the highest.
 */
async function rollNext(actor: any, previous: string, rec: Recorder, reveal: boolean, frenzy = 0): Promise<string> {
  const s = actor.system.toObject();
  const parts = rec.get(actor, 'system.body_parts') as BodyPart[];
  const result = behaviorResult(d6(), frenzy, s.behavior_table.entries);
  const next = nextBehaviorFor(s.behavior_table.entries, parts, previous, result, frenzy);
  rec.set(actor, 'system.next_behavior', { entry: next, revealed: reveal });
  return next;
}

async function titanCardStart(combat: any, combatant: any): Promise<void> {
  const key = combatant.system.titan;
  const sys = plain(combat);
  const row = (sys.titans as any[]).find((t) => t.key === key);
  const actor = titanActor(combat, key);
  if (!row || !actor) return;
  const label = row.label;
  const cardNo = combatant.initiative;
  const title = tr('note.titanCard', { label, card: cardNo });
  if (row.status !== 'focus') return;
  if (row.grab) {
    await postNote({ title, lines: [tr('note.holding', { name: nameOf(row.grab.soldier) })], titan: true, round: combat.round });
    return;
  }
  const rec = new Recorder();
  const snap = snapshot(combat);
  const tRow = snap.titans.find((t) => t.key === key)!;
  const ladder = () =>
    evaluateLadder({
      titan: tRow,
      soldiers: snap.soldiers,
      grabbedBy: (id) => grabbedBy(snap, id),
      downCanMeet: E().downCanMeet,
      cardOf: (id) => tieCard(id, snap.cards, snap.wings),
      useCards: true,
    });
  if (row.decoy) {
    const left = Math.max(0, row.decoy.left - 1);
    const prevEntry = actor.system.next_behavior.entry;
    rec.set(actor, 'system.previous_behavior', prevEntry);
    await rollNext(actor, prevEntry, rec, false, frenzyOf(combat, key));
    const lines = [tr('note.decoyCard', { decoy: row.decoy.name, left })];
    let decoy: any = { ...row.decoy, left };
    if (left === 0) {
      decoy = null;
      tRow.holder = '';
      const ev = ladder();
      rec.set(actor, 'system.attention_holder', ev.holder ?? '');
      lines.push(ev.holder ? tr('note.attention', { name: nameOf(ev.holder) }) : tr('note.noAttention'));
    }
    rec.set(combat, 'system.titans', (sys.titans as any[]).map((t) => (t.key === key ? { ...t, decoy } : t)));
    await rec.commit();
    await postNote({ title, lines, titan: true, round: combat.round });
    return;
  }
  const ev = ladder();
  rec.set(actor, 'system.attention_holder', ev.holder ?? '');
  if (!ev.holder) {
    await rec.commit();
    await postNote({ title, lines: [tr('note.noAttention'), tr('note.nextKept')], titan: true, round: combat.round });
    return;
  }
  let holder = snap.soldiers.find((s) => s.id === ev.holder)!;
  const s = actor.system.toObject();
  const retargetLines: string[] = [];
  // The stride step (behavior-procedure.yaml, resolving_a_card, stride; 16-16 to 16-19): toward the
  // holder's zone, up to its Stride, before choose. On-body and grabbed soldiers move with it; one at
  // its Blind Spot stays behind under the detach rule. Choose then reads the Positions it left.
  if (snap.field) {
    const route = strideFor(snap.field, tRow, holder);
    if (route.length) {
      const from = tRow.zone;
      const to = route[route.length - 1];
      const moves = strideMoves(snap.soldiers, label, to);
      rec.set(combat, 'system.titans', (rec.get(combat, 'system.titans') as any[]).map((t) => (t.key === key ? { ...t, zone: to } : t)));
      for (const [id, p] of Object.entries(moves.placements)) recordPlacement(rec, combat, id, p);
      // A soldier carried into another zone keeps no more Momentum than its anchors (16-4; field.ts, strideMomentum).
      for (const [id, n] of Object.entries(strideMomentum(snap.soldiers, moves, snap.field))) {
        rec.set(game.actors.get(id), 'system.momentum', n);
        retargetLines.push(tr('end.momentumTrim', { name: nameOf(id), n }));
      }
      boardEvent(rec, combat, 'stride', { key, from, route });
      const after = positionsAfterStride(snap.soldiers, snap.titans, key, to, moves);
      snap.soldiers.splice(0, snap.soldiers.length, ...after);
      tRow.zone = to;
      holder = snap.soldiers.find((x) => x.id === holder.id)!;
      retargetLines.push(tr('note.strode', { label, route: route.join(', ') }));
      if (moves.left.length) retargetLines.push(tr('note.strideLeft', { who: moves.left.map(nameOf).join(', ') }));
      if (moves.carried.length) retargetLines.push(tr('note.strideCarried', { who: moves.carried.map(nameOf).join(', ') }));
    }
  }
  const ladderCtx = { titan: tRow, soldiers: snap.soldiers, grabbedBy: (id: string) => grabbedBy(snap, id), downCanMeet: E().downCanMeet, cardOf: (id: string) => tieCard(id, snap.cards, snap.wings), useCards: true };
  // batch F1: a Titan that cannot reach its Attention holder takes the next candidate down the
  // Attention Ladder who does meet the rolled entry's requirement, and its Attention moves with it.
  const rolled = (s.behavior_table.entries as any[]).find((e) => e.id === s.next_behavior.entry);
  if (rolled) {
    const moved = retargetForEntry(ladderCtx, rolled, holder.id);
    const to = moved ? snap.soldiers.find((x) => x.id === moved) : null;
    if (to && to.id !== holder.id) {
      holder = to;
      tRow.holder = to.id;
      rec.set(actor, 'system.attention_holder', to.id);
      retargetLines.push(tr('note.retargeted', { name: to.name, entry: rolled.name ?? rolled.id }));
    }
  }
  // resolving_a_card, choose, completed after round 3 review 1, M1: a fallback entry the holder
  // cannot meet retargets the same way, over the candidates who meet the fallback's own
  // position_requirement, and the move is real: Attention (and the note) move with it.
  const entry = chooseEntry(s.behavior_table.entries, s.next_behavior.entry, s.previous_behavior, s.body_parts, holder.positions[label], (fallback: any) => {
    const moved = retargetForEntry(ladderCtx, fallback, holder.id);
    const to = moved ? snap.soldiers.find((x) => x.id === moved) : null;
    if (!to) return null;
    if (to.id !== holder.id) {
      holder = to;
      tRow.holder = to.id;
      rec.set(actor, 'system.attention_holder', to.id);
      retargetLines.push(tr('note.retargeted', { name: to.name, entry: fallback.name ?? fallback.id }));
    }
    return holder.positions[label];
  });
  const targets = entryTargets(entry, holder.id, tRow, snap.soldiers, grabbedIn(snap));
  targets.sort((a, b) => (tieCard(a, snap.cards, snap.wings) ?? 99) - (tieCard(b, snap.cards, snap.wings) ?? 99));
  await rec.commit();
  const full = entryOf(actor, entry.id);
  // Nothing is rolled here (ADR-0019, deferred roll): the GM gets a card naming the behavior and its
  // targets, and the dice wait for their button. The table hears only who holds the Attention.
  const { postBehaviorCard } = await import('./behavior.ts');
  const message = await postBehaviorCard({
    combat,
    key,
    label,
    round: combat.round,
    entry: full ?? entry,
    rolled: entryOf(actor, s.next_behavior.entry),
    holder: holder.id,
    rung: ev.rung,
    targets,
  });
  const telegraph = (full?.effects ?? []).some((e: any) => e.type === 'telegraph');
  const wrecksAnchor = (full?.effects ?? []).some((e: any) => e.type === 'wreck');
  const titans = (plain(combat).titans as any[]).map((t) => (t.key === key ? { ...t, pending: JSON.stringify({ entry: entry.id, message: '', telegraph, wreck: wrecksAnchor, behavior: message?.id ?? '' }) } : t));
  await writeSystem(combat, { titans });
  await postNote({ title, lines: [tr('note.attentionRung', { name: holder.name, rung: game.i18n.localize(`WOF.Rung.${ev.rung}`) }), ...retargetLines, tr('note.behaviorWaits')], titan: true, round: combat.round });
}

async function titanCardEnd(combat: any, combatant: any): Promise<void> {
  const key = combatant.system.titan;
  const sys = plain(combat);
  const row = (sys.titans as any[]).find((t) => t.key === key);
  if (!row?.pending) return;
  const { closeBehaviorCard, readPending } = await import('./behavior.ts');
  const pending = readPending(row.pending);
  if (!pending) return;
  const actor = titanActor(combat, key);
  if (pending.message) {
    const { resolveAttack } = await import('./results.ts');
    const message = game.messages.get(pending.message);
    if (message) await resolveAttack(message, { auto: true });
  }
  // The card is over: its GM card stops offering the roll, whether or not the GM took it.
  if (pending.behavior) await closeBehaviorCard(pending.behavior);
  const after = plain(combat);
  const current = (after.titans as any[]).find((t) => t.key === key);
  if (!actor || current?.status !== 'focus') {
    await writeSystem(combat, { titans: (after.titans as any[]).map((t) => (t.key === key ? { ...t, pending: '' } : t)) });
    return;
  }
  // resolving_a_card, next: the previous behavior, decoys in a row 0, flags cleared, a new Next Behavior.
  const rec = new Recorder();
  // A wreck effect applies whether the behavior landed or whiffed, as telegraph does
  // (titan-format.yaml, effect_types, wreck).
  if (pending.wreck) wreck(combat, rec, rowZone(current));
  rec.set(actor, 'system.previous_behavior', pending.entry);
  const next = await rollNext(actor, pending.entry, rec, pending.telegraph, frenzyOf(combat, key));
  rec.set(combat, 'system.titans', (after.titans as any[]).map((t) => (t.key === key ? { ...t, pending: '', decoysInRow: 0, flags: emptyFlags() } : t)));
  await rec.commit();
  if (pending.telegraph) {
    const e = entryOf(actor, next);
    await postNote({ title: tr('note.telegraph', { label: row.label }), lines: [tr('note.telegraphLine', { name: e?.name ?? next })], titan: true, round: combat.round });
  }
}

// ---------------------------------------------------------------- moves over the field (16-12 to 16-15, 16-26)

function warn(key: string, data: Record<string, unknown> = {}): false {
  ui.notifications.warn(tr(key, data));
  return false;
}

/** The move checked against the rules and the retreat, or the key of why it is refused. */
function checkedMove(snap: Snapshot, s: SoldierState, option: ZoneMoveOption): ZoneMoveOption | string {
  const ctx = moveContext(snap, s, ratingRows());
  if (!ctx) return 'move.noField';
  const why = moveBlock(s, ctx.grabbed);
  if (why) return `move.${why}`;
  if (snap.movesSpent.includes(s.id)) return 'move.spent';
  const o = routeOption(s, ctx, option.kind, option.steps, { mountAfter: option.mountAfter, dismountAfter: option.dismountAfter });
  if (!o) return 'move.notLegal';
  if (snap.retreat && retreatBinds(s, { clock: { length: 0, filled: 0, active: true, began: 0 }, grabbedBy: (id) => grabbedBy(snap, id) })) {
    const same = (a: Placement, b: Placement) => a.zone === b.zone && a.attachment.kind === b.attachment.kind && a.attachment.body === b.attachment.body;
    if (!retreatOptions(s, snap).some((r) => r.kind === o.kind && same(r.to, o.to) && r.steps.length === o.steps.length)) return 'move.retreat';
  }
  // The mounted charge is the rider's choice (review M5): at most the one Titan the request names,
  // and only one the ride may charge; none named, none flagged.
  return { ...o, chargeOn: option.chargeOn && o.charge.includes(option.chargeOn) ? option.chargeOn : undefined };
}

/**
 * The soldier's own move (positions.yaml, moves; 16-12): the owner or the GM asks, the rules check the
 * route step by step, and a Flight posts its prompt to the soldier's owner (batch C), landing when the
 * card is answered. A player's request goes to the GM, who writes the engagement.
 */
export async function requestZoneMove(combat: any, soldierId: string, option: ZoneMoveOption): Promise<boolean> {
  const actor = game.actors.get(soldierId);
  if (!actor) return false;
  if (!isGM()) {
    if (!actor.isOwner) return warn('gm.onlyGM');
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'zone-move', combat: combat.id, soldier: soldierId, kind: option.kind, steps: option.steps, chargeOn: option.chargeOn, quiet: !!option.quiet, mount: !!option.mount, dismount: !!option.dismount, mountAfter: !!option.mountAfter, dismountAfter: !!option.dismountAfter });
    return true;
  }
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === soldierId);
  if (!s) return false;
  const checked = checkedMove(snap, s, option);
  if (typeof checked === 'string') return warn(checked);
  // Quiet is paid with the move; a move on foot or mounted needs the Momentum now (spends, quiet).
  if (option.quiet && !checked.fly && s.momentum < spendCost('quiet')) return warn('quietBlock.noMomentum');
  checked.quiet = !!option.quiet;
  if (checked.fly) return flight(combat, actor, s, checked);
  await applyMove(combat, actor, s, checked, {});
  return true;
}

/**
 * A Flight (positions.yaml, moves, flight): every ODM move rolls for fly with the soldier's own ODM
 * Gear, so the move posts an action prompt and the moving soldier's owner rolls it from their own
 * client. The steps, the Momentum, and the flags all land when the card is answered.
 */
async function flight(combat: any, actor: any, s: SoldierState, o: ZoneMoveOption): Promise<boolean> {
  const snap = snapshot(combat);
  const message = await postPrompt({
    ask: 'flight',
    mode: 'action',
    combat: combat.id,
    title: tr('prompt.flightTitle', { name: actor.name }),
    cause: tr('prompt.flightCause', { name: actor.name, from: placeText({ zone: s.zone, attachment: s.attachment }), to: placeText(o.to) }),
    rolls: tr('prompt.flightRolls'),
    asked: [{ actor, detail: tr('prompt.flightDetail', { n: s.momentum, cap: capOf(s, snap.field) }) }],
    data: { kind: o.kind, steps: o.steps, momentum: o.momentum, charge: [], quiet: !!o.quiet },
    speaker: actor,
  });
  if (!message) return false;
  // The move is spent when the Flight is asked, so a second one cannot be posted before the answer (review M6).
  await markMoveSpent(combat, actor.id);
  await postNote({ title: tr('note.flightAsked', { name: actor.name }), lines: [tr('note.flightAskedLine', { to: placeText(o.to), n: o.carries, m: o.momentum })], round: combat.round });
  return true;
}

/**
 * The answered Flight: each success is 1 Momentum up to the anchors of the zone it starts in, the
 * Carries are paid from what the soldier then holds (16-14), and the Flight goes as far along its
 * steps as that pays for and may end. No successes sets the loudest flag on every Focus Titan in the
 * zone it ends in, else the nearest (16-15).
 */
const flightResolver: PromptResolver = {
  async roll(ctx) {
    const { rollAction } = await import('../dice/roll-action.ts');
    const actor = await foundry.utils.fromUuid(ctx.entry.actor);
    if (!actor) return null;
    const message = await rollAction(actor, 'fly', {});
    // A cancelled dialog gives the button back; the GM can still roll it for them.
    return message ? { message: message.id } : null;
  },
  async apply(ctx, roll) {
    const combat = game.combats.get(ctx.card.combat);
    const actor = await foundry.utils.fromUuid(ctx.entry.actor);
    if (!combat || !actor) return null;
    const { successesOf } = await import('../dice/card.ts');
    const answer = answerCardOf(roll);
    const successes = answer ? successesOf(answer) : 0;
    const snap = snapshot(combat);
    const s = snap.soldiers.find((x) => x.id === actor.id);
    const data = ctx.card.data as { kind: MoveKind; steps: Placement[]; quiet?: boolean };
    if (!s || !snap.field || s.zone === null) return { line: tr('prompt.flightGone', { name: actor.name }), ops: [] };
    const quietBefore = (plain(combat).quiet as string[]).includes(s.id);
    const gained = flightResult(successes, s.momentum, capOf(s, snap.field), { quiet: quietBefore });
    // Quiet bought with the Flight is paid from what the soldier holds after the roll, before the Carries.
    const buys = !!data.quiet && !quietBefore && gained.momentum >= spendCost('quiet');
    const flown = { ...gained, momentum: gained.momentum - (buys ? spendCost('quiet') : 0), loud: gained.loud && !buys };
    const ctxm = moveContext(snap, s, ratingRows());
    const full = ctxm ? routeOption(s, { ...ctxm, momentum: Infinity }, 'odm', data.steps) : null;
    if (!full) return { line: tr('prompt.flightGone', { name: actor.name }), ops: [] };
    const paid = flightPrefix(full, snap.field, flown.momentum, (p) => flightEnds(p, snap.field!, (id) => ratingRows().find((r) => r.id === id) ?? null));
    let o = paid.steps.length && ctxm ? routeOption(s, { ...ctxm, momentum: Infinity }, 'odm', paid.steps) : null;
    // A retreat that began between the ask and the answer binds the Flight too (review m12).
    if (o && typeof checkedMove({ ...snap, movesSpent: [] }, s, { ...o, chargeOn: undefined }) === 'string') o = null;
    if (o) o.quiet = buys;
    await applyMove(combat, actor, s, o, { flight: { successes, ...flown }, short: paid.steps.length < full.steps.length, quietPaid: buys });
    return { line: tr('prompt.flightDone', { name: actor.name, n: successes, gained: flown.gained }), ops: [] };
  },
};

interface MoveExtras {
  /** A GM override: the note says so. */
  ruling?: boolean;
  flight?: { successes: number; momentum: number; gained: number; loud: boolean };
  /** The Flight was cut short where the Momentum ran out (16-14). */
  short?: boolean;
  /** Quiet was already paid out of the Flight's Momentum. */
  quietPaid?: boolean;
}

/** The Focus Titans a Flight with no successes flags: every one in the zone it ends in, else the nearest (16-15). */
function loudTargets(snap: Snapshot, zone: ZoneId | null): string[] {
  const focus = snap.titans.filter((t) => t.status === 'focus');
  if (zone === null || !snap.field || !focus.length) return [];
  const here = focus.filter((t) => t.zone === zone).map((t) => t.key);
  if (here.length) return here;
  const near = [...focus].sort((a, b) => zoneDistance(snap.field!, zone, a.zone) - zoneDistance(snap.field!, zone, b.zone) || a.label.localeCompare(b.label));
  return [near[0].key];
}

/**
 * Writes a move (or, with a null option, an answered Flight that could not move): the placement, the
 * horse, airborne, Momentum (gained up to the start zone's cap, Carry spent, trimmed to the end zone's
 * cap), the flags it sets, ODM use, the spent move, leaving, and the board's Flight event, in one update.
 */
async function applyMove(combat: any, actor: any, s: SoldierState, o: ZoneMoveOption | null, extra: MoveExtras): Promise<void> {
  const snap = snapshot(combat);
  const rec = new Recorder();
  const from: Placement = { zone: s.zone, attachment: { ...s.attachment } };
  const lines: string[] = [];
  if (extra.ruling) lines.push(tr('gm.ruling'));
  let held = extra.flight ? extra.flight.momentum : s.momentum;
  const loud = new Set<string>();
  // Quiet (anchor-ratings.yaml, momentum, spends, quiet): spent earlier this turn, or with this move,
  // it stops every flag the soldier would set, the crossing flag included (16-14, 16-15).
  const quietList = rec.get(combat, 'system.quiet') as string[];
  let quiet = quietList.includes(s.id);
  // Quiet paid out of a Flight that could not move is still bought (review m4).
  if ((o?.quiet || extra.quietPaid) && !quiet) {
    if (!extra.quietPaid) held = Math.max(0, held - spendCost('quiet'));
    rec.set(combat, 'system.quiet', [...quietList, s.id]);
    quiet = true;
    lines.push(tr('note.quiet'));
  }
  if (o) {
    const to = o.to;
    const leaving = to.zone === null;
    const horseZone = o.kind === 'mounted' ? to.zone : (o.kind === 'odm' || o.dismount) && s.mounted ? s.zone : s.horseZone;
    recordPlacement(rec, combat, s.id, { zone: to.zone, attachment: to.attachment, horseZone: leaving && o.kind === 'mounted' ? null : horseZone });
    if (s.carrying && leaving) recordPlacement(rec, combat, s.carrying, { zone: null, attachment: { kind: 'ground', body: null } });
    if (o.kind === 'odm') rec.set(actor, 'system.airborne', true);
    if (o.kind === 'onFoot' && s.airborne) rec.set(actor, 'system.airborne', false);
    // An ODM move, or a move on foot, by a mounted soldier dismounts them first; the horse stays in
    // the zone the move starts in. A mount comes before a mounted move's steps (horses.yaml,
    // within_a_move; review M7).
    const horse = [...(actor.items ?? [])].find((i: any) => i.type === 'gear' && i.system.subtype === 'horse');
    if ((o.kind === 'odm' || o.dismount) && s.mounted && horse) {
      rec.set(horse, 'system.mounted', false);
      lines.push(tr('note.dismounts'));
    }
    if ((o.mount || o.mountAfter) && horse) {
      rec.set(horse, 'system.mounted', true);
      if (s.airborne) rec.set(actor, 'system.airborne', false);
      lines.push(tr(o.mountAfter ? 'note.mountsAfter' : 'note.mounts'));
    }
    // A ride that ends with a dismount leaves the horse where it ended (horses.yaml, within_a_move; review 2 n4).
    if (o.dismountAfter && s.mounted && horse) {
      rec.set(horse, 'system.mounted', false);
      lines.push(tr('note.dismountsAfter'));
    }
    held = Math.max(0, held - o.momentum);
    for (const label of moveFlags(o, quiet)) {
      const t = snap.titans.find((x) => x.label === label);
      if (t) loud.add(t.key);
    }
    lines.push(tr('note.zoneMoved', { from: placeText(from), to: placeText(to), kind: extra.ruling ? tr('gm.byRuling') : tr(`move.way.${o.kind}`) }));
    if (o.momentum) lines.push(tr('note.carry', { n: o.momentum }));
    if (o.crosses.length) lines.push(tr('note.crossed', { labels: o.crosses.join(', ') }));
    if (o.chargeOn && !quiet) lines.push(tr('note.charge', { label: o.chargeOn }));
    if (extra.short) lines.push(tr('note.flightShort'));
    if (o.fly) boardEvent(rec, combat, 'flight', { soldier: s.id, from, steps: o.steps });
    if (leaving) lines.push(tr('note.leftField'));
  } else if (extra.flight) lines.push(tr('note.flightStays'));
  if (extra.flight) {
    lines.push(extra.flight.gained ? tr('note.flightMomentum', { n: extra.flight.gained, held }) : tr('note.flightNone'));
    if (extra.flight.loud && !quiet) for (const k of loudTargets(snap, o ? o.to.zone : s.zone)) loud.add(k);
  }
  // Momentum above the anchors of the zone the move ends in is lost (16-14); off field it is 0.
  const endZone = o ? o.to.zone : s.zone;
  const cap = snap.field && endZone !== null ? momentumCapAt(snap.field, endZone) : 0;
  const after = Math.max(0, Math.min(held, cap));
  if (after !== s.momentum) rec.set(actor, 'system.momentum', after);
  if (o?.kind === 'odm') {
    const used = rec.get(combat, 'system.odmUsed') as string[];
    if (!used.includes(s.id)) rec.set(combat, 'system.odmUsed', [...used, s.id]);
  }
  const spent = rec.get(combat, 'system.movesSpent') as string[];
  if (!extra.ruling && !spent.includes(s.id)) rec.set(combat, 'system.movesSpent', [...spent, s.id]);
  if (loud.size) {
    const rows = rec.get(combat, 'system.titans') as any[];
    rec.set(combat, 'system.titans', rows.map((r) => (loud.has(r.key) && r.status === 'focus' && !r.flags.loud.includes(s.id) ? { ...r, flags: { ...r.flags, loud: [...r.flags.loud, s.id] } } : r)));
    lines.push(tr('note.loudSet', { labels: snap.titans.filter((t) => loud.has(t.key)).map((t) => t.label).join(', ') }));
  }
  await rec.commit();
  if (o?.to.zone === null) await wingEvent(combat, { kind: 'left', soldier: s.id });
  const message = await postNote({ title: tr('note.moved', { name: actor.name }), lines: [...lines, ...rec.lines], round: combat.round });
  if (extra.ruling && message && rec.ops.length) await recordOpsOnMessage(message, rec.ops);
}

/**
 * Quiet spent on its own this turn (anchor-ratings.yaml, momentum, spends, quiet): 1 Momentum, and the
 * soldier sets no flag for the rest of the round's turn. A flag already set is not cleared; the GM's
 * loudest-flag setter stays the override (ADR-0028).
 */
export async function spendQuiet(combat: any, soldierId: string): Promise<boolean> {
  const actor = game.actors.get(soldierId);
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === soldierId);
  if (!actor || !s) return false;
  const why = spendBlock(s, 'quiet', grabbedIn(snap)(s.id));
  if (why) return warn(`quietBlock.${why}`);
  if (!isGM()) {
    if (!actor.isOwner) return warn('gm.onlyGM');
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'quiet', combat: combat.id, soldier: soldierId });
    return true;
  }
  const list = plain(combat).quiet as string[];
  if (list.includes(soldierId)) return true;
  const rec = new Recorder();
  rec.set(actor, 'system.momentum', s.momentum - spendCost('quiet'));
  rec.set(combat, 'system.quiet', [...list, soldierId]);
  await rec.commit();
  await postNote({ title: tr('note.quietTitle', { name: actor.name }), lines: [tr('note.quiet')], round: combat.round });
  return true;
}

/** Letting go (positions.yaml, moves, letting_go): instead of a move, a fall, landing on the ground in the same zone. */
export async function letGo(combat: any, actor: any, s: SoldierState): Promise<boolean> {
  const snap = snapshot(combat);
  const why = letGoBlock(s, grabbedIn(snap)(s.id));
  if (why) return warn(`move.${why}`);
  if (!isGM()) {
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'let-go', combat: combat.id, soldier: s.id });
    return true;
  }
  const rec = new Recorder();
  recordPlacement(rec, combat, s.id, { attachment: { kind: 'ground', body: null } });
  rec.set(actor, 'system.airborne', false);
  await rollFall(combat, actor, { attachment: s.attachment, zone: s.zone, causing: null }, rec);
  boardEvent(rec, combat, 'fall', { key: s.id, zone: s.zone });
  await rec.commit();
  await postNote({ title: tr('note.moved', { name: actor.name }), lines: [tr('note.letGo', { from: attachText(s.attachment), zone: zoneText(s.zone) }), ...rec.lines], round: combat.round });
  return true;
}

/** Leaving by the soldier's own move (16-26): the first move option that steps off field. */
export async function leave(combat: any, actor: any): Promise<boolean> {
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === actor.id);
  if (!s) return false;
  const why = leaveBlock(s, snap.field, snap.titans, grabbedIn(snap)(s.id), snap.retreat);
  if (why) return warn(`move.${why}`);
  const o = moveOptionsFor(snap, s.id).find((x) => x.leaves && x.steps.length === 1 && !x.fly) ?? moveOptionsFor(snap, s.id).find((x) => x.leaves && x.steps.length === 1);
  if (!o) return warn('move.notEdge');
  return requestZoneMove(combat, actor.id, o);
}

/** Returning (leaving, returning): into an edge zone holding no Focus Titan and no corpse, on the ground. */
export async function returnTo(combat: any, actor: any, zone?: ZoneId): Promise<boolean> {
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === actor.id);
  if (!s || !snap.field) return false;
  const why = returnBlock(s, snap.retreat);
  if (why) return warn(`move.${why}`);
  const zones = returnZones(snap.field, snap.titans);
  const to = zone ?? zones[0];
  if (!zones.includes(to)) return warn('move.returnZone');
  if (!isGM()) {
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'return', combat: combat.id, soldier: s.id, zone: to });
    return true;
  }
  const rec = new Recorder();
  recordPlacement(rec, combat, s.id, { zone: to, attachment: { kind: 'ground', body: null }, horseZone: s.mounted ? to : s.horseZone });
  rec.set(actor, 'system.airborne', false);
  await rec.commit();
  await postNote({ title: tr('note.returned', { name: actor.name }), lines: [zoneText(to)], round: combat.round });
  return true;
}

/** A soldier's move this round is spent (blade-sets.yaml, swap; positions.yaml, moves). */
export async function markMoveSpent(combat: any, soldierId: string): Promise<void> {
  if (!isGM()) {
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'move-spent', combat: combat.id, soldier: soldierId });
    return;
  }
  const spent = plain(combat).movesSpent as string[];
  if (!spent.includes(soldierId)) await writeSystem(combat, { movesSpent: [...spent, soldierId] });
}

/**
 * A wreck (titan-format.yaml, effect_types, wreck; 16-20): the zone takes one rating step toward Open,
 * the first while Sparse graced. Every soldier over their new cap loses the excess, and a zone turned
 * Open applies zone-becomes-open (16-21; OQ-205).
 */
export function wreck(combat: any, rec: Recorder, zone: ZoneId, event = true): void {
  const snap = snapshot(combat);
  const field = (rec.get(combat, 'system.field') as FieldState | null) ?? snap.field;
  if (!field) return;
  const out = wreckZone(field, zone);
  rec.set(combat, 'system.field', { ...out.field, zones: out.field.zones.map((z) => ({ ...z, effects: z.effects.filter((e) => e !== 'dust' && e !== 'steam') })) });
  if (event) boardEvent(rec, combat, 'wreck', { zone, from: out.from, to: out.to });
  if (out.graced) {
    rec.line(tr('end.wreckIgnored', { zone }));
    return;
  }
  if (out.from === out.to) {
    rec.line(tr('end.wreckOpen', { zone }));
    return;
  }
  rec.line(tr('end.wrecked', { zone, from: ratingOf(out.from)?.name ?? out.from, to: ratingOf(out.to)?.name ?? out.to }));
  if (out.to === zoneRules().openRating) zoneBecomesOpen(rec, combat, snap, zone);
  trimMomentum(rec, combat, out.field);
}

export async function markOdm(combat: any, soldierId: string): Promise<void> {
  if (!isGM()) {
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'odm', combat: combat.id, soldier: soldierId });
    return;
  }
  const used = plain(combat).odmUsed as string[];
  if (!used.includes(soldierId)) await writeSystem(combat, { odmUsed: [...used, soldierId] });
}

// ---------------------------------------------------------------- Titans entering and dying

/** A Background Titan enters as a Focus Titan (background-titans.yaml, full_clock). */
export async function enterTitan(combat: any, bg: any, rec: Recorder): Promise<string | null> {
  const scene = combat.scene;
  let source = bg.actor ? await foundry.utils.fromUuid(bg.actor) : null;
  if (!source && bg.titan) {
    const pack = game.packs.get(`${SYSTEM_ID}.titans`);
    const id = CONFIG.WOF.packIds.titans?.[bg.titan];
    source = id ? await pack?.getDocument(id) : null;
  }
  if (!scene || !source) {
    rec.line(tr('note.enterNoActor', { name: bg.name }));
    return null;
  }
  let actor = source;
  if (source.pack) {
    await rec.commit();
    actor = await game.actors.importFromCompendium(game.packs.get(source.pack), source.id);
    rec.ops.push({ t: 'create', uuid: actor.uuid, parent: '', collection: 'Actor', data: actor.toObject() });
  }
  const rows = plain(combat).titans as any[];
  const label = nextLabel(rows.map((r) => r.label));
  const anchor = rows.map((r) => titanToken(combat, r.key)).find(Boolean);
  const grid = scene.grid?.size ?? 100;
  const x = (anchor?.x ?? scene.dimensions?.sceneX ?? 0) + grid * 4;
  const y = anchor?.y ?? scene.dimensions?.sceneY ?? 0;
  const tokenData = await actor.getTokenDocument({ x, y });
  const [token] = await rec.create(scene, 'Token', [tokenData.toObject()]);
  await token.actor.update(titanStartPatch(token.actor, label));
  const tempo = Math.max(1, token.actor.system.tempo);
  await rec.create(combat, 'Combatant', Array.from({ length: tempo }, (_, i) => ({ type: CARD, actorId: token.actorId, tokenId: token.id, sceneId: scene.id, initiative: null, system: { kind: 'titan', titan: token.id, index: i } })));
  // It enters at the edge zone no soldier stands in, farthest from the nearest soldier (16-29);
  // every Position relative to it is derived from there.
  const before = snapshot(combat);
  const soldierZones = before.soldiers.filter((x) => x.alive && !x.left && x.zone !== null).map((x) => x.zone as ZoneId);
  const zone = before.field ? entryZone(before.field, soldierZones) : 0;
  const newRow = { ...titanRowData(token.id, label, combat.round + 1), zone };
  rec.set(combat, 'system.titans', [...(rec.get(combat, 'system.titans') as any[]), newRow]);
  boardEvent(rec, combat, 'enter', { key: token.id, zone });
  await rec.commit();
  const snap = snapshot(combat);
  const focus = snap.titans.filter((t) => t.status === 'focus').length + 1;
  rec.line(tr('note.entered', { name: token.name, label }));
  rec.line(tr('note.enteredZone', { label, zone }));
  // It works out its Attention at once, with this round's cards only mid-round (full_clock).
  const ev = enteringAttention(snap, titanRow(combat, newRow), E().downCanMeet);
  rec.set(token.actor, 'system.attention_holder', ev.holder ?? '');
  rec.line(ev.holder ? tr('note.attention', { name: nameOf(ev.holder) }) : tr('note.noAttention'));
  await fearRolls(combat, { kind: 'enter', abnormal: !!token.actor.system.abnormal, focusCount: focus }, rec);
  return token.id;
}

/** A Focus Titan dies (titan-harm.yaml, titan_death). */
export async function titanDies(combat: any, key: string, rec: Recorder): Promise<void> {
  const rows = rec.get(combat, 'system.titans') as any[];
  const row = rows.find((r) => r.key === key);
  const actor = titanActor(combat, key);
  if (!row || !actor || row.status !== 'focus') return;
  const snap = snapshot(combat);
  const turns = combat.turns ?? [];
  const plan = planTitanDeath({
    soldiers: snap.soldiers,
    titans: snap.titans,
    key,
    cards: [...combat.combatants].filter((c: any) => c.system.kind === 'titan').map((c: any) => ({ id: c.id, titan: c.system.titan, order: turns.includes(c) ? turns.indexOf(c) : null })),
    turn: combat.turn ?? null,
    grounded: isGrounded(partsOf(actor)),
  });
  if (!plan) return;
  const names = (ids: string[]) => ids.map(nameOf).join(', ');
  rec.line(tr('death.relief', { who: names(plan.relief) }));
  if (plan.freed) {
    rec.line(tr(row.grab.lifted ? 'death.freedFalls' : 'death.freed', { name: nameOf(plan.freed) }));
    // A fall the release makes them take is resolved first, from On Body (titan_death, freed).
    if (row.grab.lifted) await rollFall(combat, game.actors.get(plan.freed), { attachment: { kind: 'on-body', body: row.label }, zone: row.zone ?? null, causing: row.label }, rec);
  }
  if (plan.steam.length) await rollSteam(combat, plan.steam, rec, { trigger: 'kill', label: row.label, key });
  // The falling body destroys 1 Anchor where it lands, whether or not anyone is in the path
  // (titan-harm.yaml, falling_titan, wrecks_an_anchor). A Titan already grounded does not fall.
  if (!isGrounded(partsOf(actor))) {
    wreck(combat, rec, rowZone(row), false);
    boardEvent(rec, combat, 'fall', { key, zone: rowZone(row) });
  } else boardEvent(rec, combat, 'steam', { key, zone: rowZone(row) });
  if (plan.fall.length) rec.line(tr('death.fall', { who: names(plan.fall) }));
  rec.set(actor, 'system.corpse', true);
  rec.set(actor, 'system.openings', 0);
  rec.set(actor, 'system.openings_by', []);
  rec.set(actor, 'system.regeneration', 0);
  rec.set(actor, 'system.attention_holder', '');
  rec.set(actor, 'system.next_behavior', { entry: '', revealed: false });
  rec.set(combat, 'system.titans', rows.map((r) => (r.key === key ? { ...r, status: 'corpse', grab: null, decoy: null, flags: emptyFlags(), pending: '' } : r)));
  // Every attachment naming it but pinned ends (16-24); Positions relative to the corpse are then derived.
  for (const [id, p] of Object.entries(plan.placements)) recordPlacement(rec, combat, id, p);
  // The remaining cards of this round are removed.
  for (const id of plan.clearCards) rec.set(combat.combatants.get(id), 'initiative', null);
  await wingEvent(combat, { kind: 'titan' }, rec);
  const after = rows.map((r) => (r.key === key ? { ...r, status: 'corpse' } : r));
  const anyFocus = after.some((r) => r.status === 'focus');
  const pinned = snap.soldiers.some((s) => s.pinned && s.alive);
  if (!anyFocus && !pinned) rec.line(tr('death.ends'));
}

// ---------------------------------------------------------------- round end (ADR-0026)

function enabledCategories(): Record<TrackerCategory, boolean> {
  return trackerApply();
}

/**
 * Round-end steps are run, applied, skipped, and undone by the active GM only, one at a time per
 * engagement, so neither a second click nor a second GM applies a step twice.
 */
export const endLock = new KeyedLock();

const withEndLock = async (combat: any, fn: () => Promise<void>): Promise<void> => {
  if (!isActiveGM()) return;
  await endLock.run(combat.id, fn);
};

export async function runEnd(combat: any): Promise<void> {
  await withEndLock(combat, () => runEndNow(combat));
}

async function runEndNow(combat: any): Promise<void> {
  for (;;) {
    const log = plain(combat).endLog as EndEntry[];
    const auto = autoChecks(log, enabledCategories());
    if (!auto.length) return;
    await applyCheckNow(combat, auto[0]);
  }
}

export async function applyCheck(combat: any, index: number): Promise<void> {
  await withEndLock(combat, () => applyCheckNow(combat, index));
}

async function applyCheckNow(combat: any, index: number): Promise<void> {
  const log = plain(combat).endLog as EndEntry[];
  const entry = log[index];
  if (!entry || entry.state === 'done' || nextCheck(log) !== index) return;
  const rec = new Recorder();
  await runCheck(combat, entry.check, rec);
  await rec.commit();
  const fresh = plain(combat).endLog as EndEntry[];
  fresh[index] = { ...fresh[index], state: 'done', ops: rec.ops, lines: rec.lines };
  await writeSystem(combat, { endLog: fresh });
}

export async function skipCheck(combat: any, index: number): Promise<void> {
  await withEndLock(combat, async () => {
    const log = plain(combat).endLog as EndEntry[];
    if (nextCheck(log) !== index) return;
    log[index] = { ...log[index], state: 'skipped', ops: [], lines: [tr('end.skipped')] };
    await writeSystem(combat, { endLog: log });
    await runEndNow(combat);
  });
}

export async function undoCheck(combat: any, index: number): Promise<void> {
  await withEndLock(combat, async () => {
    const log = plain(combat).endLog as EndEntry[];
    for (const i of undoOrder(log, index)) {
      const kept = await revertOps(log[i].ops);
      if (kept.length) ui.notifications.warn(tr('end.kept', { list: kept.join(', ') }));
      const now = plain(combat).endLog as EndEntry[];
      now[i] = { ...now[i], state: 'undone', ops: [], lines: [] };
      for (let j = i + 1; j < now.length; j++) if (now[j].state === 'skipped') now[j] = { ...now[j], state: 'undone', lines: [] };
      await writeSystem(combat, { endLog: now });
    }
  });
}

/**
 * The frenzy end step (round.yaml, end_steps, frenzy; batch F2): every living Focus Titan's Frenzy
 * rises by 1 at the end of every third round, never above the cap; at the end of any other
 * round it is held. A corpse has none, and a Next Behavior already rolled is not
 * touched: a behavior roll takes the Frenzy that stood when it was rolled (behavior-procedure.yaml,
 * next_behavior, frenzy_when).
 */
function raiseFrenzy(combat: any, rec: Recorder): void {
  const rows = rec.get(combat, 'system.titans') as any[];
  const focus = rows.filter((r) => r.status === 'focus');
  if (!focus.length) {
    rec.line(tr('end.noFocus'));
    return;
  }
  const next = rows.map((r) => (r.status === 'focus' ? { ...r, frenzy: frenzyAfterRound(Number(r.frenzy ?? 0), combat.round) } : r));
  rec.set(combat, 'system.titans', next);
  if (combat.round % frenzyRule().rate === 0) {
    for (const r of next.filter((x) => x.status === 'focus')) rec.line(tr('end.frenzy', { label: r.label, n: r.frenzy, cap: frenzyRule().cap }));
  } else {
    for (const r of next.filter((x) => x.status === 'focus')) rec.line(tr('end.frenzyHeld', { label: r.label }));
  }
}

async function runCheck(combat: any, check: EndEntry['check'], rec: Recorder): Promise<void> {
  const sys = plain(combat);
  const snap = snapshot(combat);
  switch (check) {
    case 'frenzy':
      raiseFrenzy(combat, rec);
      return;
    case 'gas-rolls': {
      const due = gasRollsDue(sys.odmUsed, (id) => !!snap.soldiers.find((s) => s.id === id)?.alive, sys.cleanLine ?? []);
      const message = await askGasRolls(combat, due);
      if (message) rec.message(message.id);
      rec.line(due.length ? tr('end.gasAsked', { who: due.map(nameOf).join(', ') }) : tr('end.gasNone'));
      return;
    }
    case 'regeneration': {
      const living = snap.titans.filter((t) => t.status === 'focus');
      const plans = planRegeneration(
        living.map((t) => {
          const a = titanActor(combat, t.key);
          return { key: t.key, filled: a.system.regeneration, clock: a.system.regeneration_clock, parts: partsOf(a), openingsBy: [...(a.system.toObject().openings_by ?? [])] };
        }),
      );
      for (const p of plans) {
        const a = titanActor(combat, p.key);
        const label = living.find((t) => t.key === p.key)!.label;
        rec.set(a, 'system.regeneration', p.filled);
        rec.set(a, 'system.body_parts', p.parts);
        rec.set(a, 'system.openings', p.openingsBy.length);
        rec.set(a, 'system.openings_by', p.openingsBy);
        if (!p.result) {
          rec.line(tr('end.regenFill', { label, n: p.filled }));
          continue;
        }
        rec.line(tr('end.regenFull', { label }));
        if (p.result.healed) {
          rec.line(tr('end.regenHealed', { label, part: game.i18n.localize(`WOF.BodyPart.${p.result.healed.id}`) }));
          await rollSteam(combat, steamRollers('regeneration-fill', snap.soldiers, label), rec, { trigger: 'regeneration-fill', label, key: p.key });
          boardEvent(rec, combat, 'steam', { key: p.key, zone: rowZone(living.find((t) => t.key === p.key) ?? {}) });
        }
        if (p.result.stands) {
          rec.set(a, 'system.heave_count', 0);
          rec.line(tr('end.stands', { label }));
          // Its Pinned are freed to the ground, and in an Open zone its Blind Spot becomes On Body
          // (grounded_titan, ends; 16-21, 16-23; field.ts, titanStands).
          const t = living.find((x) => x.key === p.key)!;
          const zoneRating = snap.field?.zones.find((z) => z.n === t.zone)?.rating ?? '';
          applyFieldChange(rec, combat, snap, titanStands(snap.soldiers, t, zoneRating));
        }
      }
      if (!plans.length) rec.line(tr('end.noFocus'));
      return;
    }
    case 'background-clocks': {
      if (sys.retreat.active) {
        rec.line(tr('end.stopped'));
        return;
      }
      const focus = snap.titans.filter((t) => t.status === 'focus').length;
      const plan = planBackground(sys.background, focus, E().focusLimit, false, combat.round);
      rec.set(combat, 'system.background', plan.clocks);
      for (const c of plan.clocks) if (!c.entered || plan.enter.includes(plan.clocks.indexOf(c))) rec.line(tr('end.bgLine', { name: c.name, filled: c.filled, length: c.length }));
      for (const i of plan.enter) {
        const key = await enterTitan(combat, plan.clocks[i], rec);
        if (key) await wingEvent(combat, { kind: 'titan' }, rec);
      }
      if (plan.retreat) {
        rec.set(combat, 'system.retreat', startRetreat(sys.retreat, combat.round));
        rec.line(tr('end.retreatBegins'));
      }
      return;
    }
    case 'retreat-clock': {
      const retreat = rec.get(combat, 'system.retreat');
      if (retreat.active) {
        rec.line(tr('end.stopped'));
        return;
      }
      const next = planRetreat(retreat, combat.round);
      rec.set(combat, 'system.retreat', next);
      rec.line(next.active ? tr('end.retreatBegins') : tr('end.retreatLine', { filled: next.filled, length: next.length }));
      return;
    }
    // momentum (round.yaml, end_steps, momentum): everyone who made no ODM move loses all of it.
    case 'momentum': {
      const lost = momentumEnd(snap.soldiers, sys.odmUsed ?? [], (id) => grabbedBy(snap, id) !== null);
      const held = snap.soldiers.filter((x) => x.momentum > 0 && !(x.id in lost));
      for (const id of Object.keys(lost)) rec.set(game.actors.get(id), 'system.momentum', 0);
      rec.line(Object.keys(lost).length ? tr('end.momentumLost', { who: Object.keys(lost).map(nameOf).join(', ') }) : tr('end.momentumNone'));
      if (held.length) rec.line(tr('end.momentumKept', { who: held.map((x) => `${x.name} ${x.momentum}/${capOf(x, snap.field)}`).join(', ') }));
      return;
    }
    case 'round-ends':
      rec.line(tr('end.roundEnds'));
      return;
    case 'broken-leave': {
      const foes = skirmishFoes(combat);
      const grit = (foes[0]?.actor?.system.grit ?? 1) + sys.skirmish.gritRise;
      const broken = sys.skirmish.broken || groupBroken(foes.map((f: any) => ({ out: !!f.actor?.system.out })), grit);
      if (!broken) {
        rec.line(tr('end.notBroken', { out: foes.filter((f: any) => f.actor?.system.out).length, grit }));
        return;
      }
      const held = new Set((sys.skirmish.holds as any[]).map((h) => h.foe));
      const leaving = foes.filter((f: any) => !f.actor?.system.out && !held.has(f.id)).map((f: any) => f.id);
      rec.set(combat, 'system.skirmish.broken', true);
      rec.set(combat, 'system.skirmish.left', [...new Set([...sys.skirmish.left, ...leaving])]);
      rec.set(combat, 'system.skirmish.engaged', (sys.skirmish.engaged as any[]).filter((e) => !leaving.includes(e.foe)));
      rec.line(tr('end.brokenLeave', { n: leaving.length }));
      return;
    }
    case 'turns':
    case 'stress-relief':
    case 'lasting-stress-responses':
    case 'turn-limits':
    case 'aftermath-rolls':
    case 'death-rolls':
    case 'care-window':
    case 'grief':
    case 'retirement-and-promotion':
      return closingCheck(combat, check, rec);
    case 'ending': {
      const foes = skirmishFoes(combat).map((f: any) => ({ id: f.id, label: 0, health: 0, lost: 0, out: !!f.actor?.system.out || sys.skirmish.left.includes(f.id), heldBy: null, fightWeapon: '', shootWeapon: null, loaded: false }));
      const engaged = (id: string) => (sys.skirmish.engaged as any[]).some((e) => e.soldier === id);
      const holds = (id: string) => (sys.skirmish.holds as any[]).some((h) => h.soldier === id);
      const end = skirmishEnding(foes, snap.soldiers, engaged, holds);
      rec.line(end.foesGone ? tr('end.foesGone') : end.noSoldierStanding ? tr('end.noneStanding') : end.squadMayLeave ? tr('end.mayLeave') : tr('end.goesOn'));
      return;
    }
  }
}

// ---------------------------------------------------------------- the Gas Rolls (odm-gear.yaml, gas_roll)

/**
 * The round's owed Gas Rolls: one card listing everyone who used their ODM Gear, each rolling their
 * own from their own client (batch C, item 5). Returns the card's message, or null when none is due.
 */
export async function askGasRolls(combat: any, due: readonly string[]): Promise<any> {
  const asked = [...due].map((id) => game.actors.get(id)).filter(Boolean);
  if (!asked.length) return null;
  return postPrompt({
    ask: 'gas',
    combat: combat.id,
    title: tr('prompt.gasTitle'),
    cause: tr('prompt.gasCause'),
    rolls: tr('prompt.gasRolls'),
    asked: asked.map((actor: any) => ({ actor, detail: tr('prompt.gasRating', { n: actor.system.gas_rating ?? 0 }) })),
  });
}

const gasResolver: PromptResolver = {
  // The Gas Roll is its own card, with its own dice, its own ops and its own Undo (dice/tables.ts).
  async roll(ctx) {
    const actor = await foundry.utils.fromUuid(ctx.entry.actor);
    if (!actor) return null;
    const message = await rollGas(actor, { silent: ctx.by !== 'owner' });
    return message ? { message: message.id } : null;
  },
  async apply(ctx, roll) {
    const actor = await foundry.utils.fromUuid(ctx.entry.actor);
    const card = roll.message ? game.messages.get(roll.message)?.getFlag(SYSTEM_ID, 'card') : null;
    const line = card?.kind === 'gas' ? tr('prompt.gasDone', { name: actor?.name ?? '', from: card.from, to: card.to }) : tr('prompt.gasNone', { name: actor?.name ?? '' });
    // The Gas card is the answer: the step's Undo takes it back with everything it applied.
    return { line, ops: roll.message ? [{ t: 'message', id: roll.message }] : [] };
  },
};

/** Registered with the rest of the tracker's prompts (requests.ts). */
export function registerEnginePrompts(): void {
  registerPromptResolver('flight', flightResolver);
  registerPromptResolver('gas', gasResolver);
}

// ---------------------------------------------------------------- the engagement-end steps (engagement-end.yaml)

const injuriesOf = (actor: any): (InjuryState & { name: string })[] =>
  [...actor.items]
    .filter((i: any) => i.type === 'critical-injury')
    .map((i: any) => ({ id: i.id, name: i.name, lethal: !!i.system.row_data.lethal, treated: !!i.system.treated, limit: i.system.time_limit ?? null }));

async function closingCheck(combat: any, check: EndEntry['check'], rec: Recorder): Promise<void> {
  const actors = soldierActors(combat);
  const living = actors.filter((a) => !a.statuses?.has?.('dead'));
  const list = (ids: string[]) => ids.map(nameOf).join(', ') || tr('none');
  switch (check) {
    case 'turns': {
      const cleared = living.filter((a) => (a.system.toObject().pending_fear_results ?? []).length);
      for (const a of cleared) rec.set(a, 'system.pending_fear_results', []);
      rec.line(tr('close.turns', { who: list(cleared.map((a) => a.id)) }));
      return;
    }
    case 'stress-relief': {
      const amount = E().closing.relief[combat.system.mode === 'skirmish' ? 'skirmish' : 'titan'];
      for (const a of living) {
        const d = a.system.derived;
        rec.set(a, 'system.stress', relievedStress(d.stress_effective, d.minimum_stress, amount));
      }
      rec.line(tr('close.relief', { n: amount, who: list(living.map((a) => a.id)) }));
      return;
    }
    case 'lasting-stress-responses': {
      const ended: string[] = [];
      for (const a of living) {
        const all = a.system.toObject().lasting_stress_responses as { row: string; ends: string }[];
        const kept = keptResponses(all);
        if (kept.length === all.length) continue;
        rec.set(a, 'system.lasting_stress_responses', kept);
        ended.push(a.id);
      }
      rec.line(tr('close.responses', { who: list(ended) }));
      return;
    }
    case 'turn-limits': {
      const changed: string[] = [];
      for (const a of living) {
        for (const id of turnLimitsToChange(injuriesOf(a))) {
          rec.set(a.items.get(id), 'system.time_limit', 'engagement');
          changed.push(`${a.name}: ${a.items.get(id).name}`);
        }
      }
      rec.line(tr('close.limits', { list: changed.join('; ') || tr('none') }));
      return;
    }
    case 'aftermath-rolls':
    case 'death-rolls': {
      const due = living.flatMap((a) => {
        const inj = injuriesOf(a);
        return engagementLimited(inj).map((id) => `${a.name}: ${inj.find((i) => i.id === id)!.name}`);
      });
      rec.line(tr(check === 'death-rolls' ? 'close.deathRolls' : 'close.aftermath', { list: due.join('; ') || tr('none') }));
      return;
    }
    case 'care-window':
      rec.line(tr('close.care'));
      return;
    case 'grief': {
      const gains = griefGains(
        actors.map((a) => ({
          id: a.id,
          alive: !a.statuses?.has?.('dead'),
          grief: a.system.grief ?? 0,
          driveNamed: a.system.drive_named_comrade ?? '',
          numb: (a.system.scars ?? []).some((x: any) => x.row === 'numb'),
        })),
        E().closing.griefMax,
      );
      for (const [id, grief] of Object.entries(gains)) rec.set(game.actors.get(id), 'system.grief', grief);
      rec.line(tr('close.grief', { who: list(Object.keys(gains)) }));
      return;
    }
    case 'retirement-and-promotion': {
      const out = retiring(actors.map((a) => ({ id: a.id, alive: !a.statuses?.has?.('dead'), scars: (a.system.scars ?? []).length, retiring: !!a.system.retiring })));
      for (const id of out) rec.set(game.actors.get(id), 'system.retiring', true);
      rec.line(tr('close.retire', { who: list(out) }));
      rec.line(tr('close.promotion'));
      return;
    }
  }
}

export function checkCategoryOf(check: EndEntry['check']): TrackerCategory | null {
  return checkCategory(check);
}

// ---------------------------------------------------------------- Skirmish helpers

export function skirmishFoes(combat: any): any[] {
  const scene = combat.scene ?? game.scenes.viewed;
  return (combat.system.skirmish.foes as string[]).map((id) => scene?.tokens.get(id)).filter(Boolean);
}

export async function toggleEngaged(combat: any, soldier: string, foe: string): Promise<void> {
  const list = plain(combat).skirmish.engaged as { soldier: string; foe: string }[];
  const has = list.some((e) => e.soldier === soldier && e.foe === foe);
  const next = has ? list.filter((e) => !(e.soldier === soldier && e.foe === foe)) : [...list, { soldier, foe }];
  await writeSystem(combat, { 'skirmish.engaged': next });
}

// ---------------------------------------------------------------- the GM's direct setters (ADR-0028)

/**
 * Automation assists the GM and never blocks them. These setters write the state the rules would
 * otherwise write for themselves, because the GM ruled that it is so: "this creature is Grabbed
 * because of what just happened in the fiction". Each one is GM only, runs through a `Recorder` so
 * it is one transaction, writes the same note the rules path writes marked as a GM ruling, and
 * keeps its ops on that note (`undoRuling`) so Undo still works. None of them is reachable from a
 * player's request: they are called from the tracker's override menu on the GM's own client.
 */
function gmOnly(): boolean {
  if (isGM()) return true;
  ui.notifications.warn(tr('gm.onlyGM'));
  return false;
}

/** Commits the ruling, posts its note, and keeps the ops on that note for Undo. */
async function ruling(combat: any, title: string, lines: string[], rec: Recorder): Promise<boolean> {
  await rec.commit();
  const message = await postNote({ title, lines: [tr('gm.ruling'), ...lines, ...rec.lines], round: combat.round });
  if (message && rec.ops.length) await recordOpsOnMessage(message, rec.ops);
  return true;
}

/** Takes one GM ruling back: the ops kept on its note, in reverse (the tracker's Undo control). */
export async function undoRuling(combat: any, message: any): Promise<boolean> {
  if (!gmOnly() || !message) return false;
  const ops = promptOpsOf(message);
  if (!ops.length) return false;
  const kept = await revertOps(ops);
  if (kept.length) ui.notifications.warn(tr('end.kept', { list: kept.join(', ') }));
  await message.unsetFlag(SYSTEM_ID, PROMPT_OPS_FLAG);
  await postNote({ title: tr('gm.undone'), lines: [], round: combat?.round });
  return true;
}

const titansOf = (rec: Recorder, combat: any) => rec.get(combat, 'system.titans') as any[];
const setTitans = (rec: Recorder, combat: any, rows: any[]) => rec.set(combat, 'system.titans', rows);

/**
 * Grabbed, set or cleared by ruling (grab.yaml). Setting it writes the Focus Titan's `grab` row (a
 * free arm where the Titan has one), moves the soldier On Body relative to it, takes their airborne
 * away, and gives the Titan its Attention. Clearing it runs the rules' own release, so a lifted
 * soldier still falls.
 */
export async function setGrabbed(combat: any, soldierId: string, key: string, on: boolean): Promise<boolean> {
  if (!gmOnly()) return false;
  const rec = new Recorder();
  const rows = titansOf(rec, combat);
  const row = rows.find((r) => r.key === key);
  const actor = game.actors.get(soldierId);
  const titan = titanActor(combat, key);
  if (!row || !actor) return false;
  if (!on) {
    if (row.grab?.soldier !== soldierId) return false;
    await recordRelease(combat, key, rec);
    return ruling(combat, tr('gm.grabCleared', { name: actor.name, label: row.label }), [], rec);
  }
  const s = soldierIn(combat, soldierId) ?? soldierState(actor);
  const arm = titan ? holdingArm(rec.get(titan, 'system.body_parts') as BodyPart[]) : null;
  // A Titan with no arm left still holds by ruling: the row names no part, and nothing is counted off it.
  setTitans(rec, combat, rows.map((r) => (r.key === key ? { ...r, grab: { soldier: soldierId, counted: 0, lifted: false, arm: arm?.id ?? '' } } : r)));
  if (titan) {
    rec.set(titan, 'system.attention_holder', soldierId);
    if (arm) rec.set(titan, 'system.body_parts', (rec.get(titan, 'system.body_parts') as BodyPart[]).map((p) => (p.id === arm.id ? { ...p, progress: 0 } : p)));
  }
  recordPlacement(rec, combat, soldierId, { zone: row.zone ?? s.zone, attachment: { kind: 'grabbed', body: row.label } });
  rec.set(actor, 'system.airborne', false);
  await wingEvent(combat, { kind: 'grabbed', soldier: soldierId }, rec);
  return ruling(combat, tr('gm.grabbed', { name: actor.name, label: row.label }), [], rec);
}

/**
 * Pinned, set or cleared by ruling (titan-harm.yaml, a fallen body): writes the soldier's
 * `system.pinned` (active, the Focus Titan label that pins them, the limb, and whether it is a corpse).
 */
export async function setPinned(combat: any, soldierId: string, pin: { label: string; limb: 'arm' | 'leg' | 'body'; corpse?: boolean } | null): Promise<boolean> {
  if (!gmOnly()) return false;
  const actor = game.actors.get(soldierId);
  if (!actor) return false;
  const rec = new Recorder();
  rec.set(actor, 'system.pinned.active', !!pin);
  rec.set(actor, 'system.pinned.body', pin?.label ?? '');
  rec.set(actor, 'system.pinned.limb', pin?.limb ?? null);
  rec.set(actor, 'system.pinned.corpse', !!pin?.corpse);
  // Pinned is an attachment naming the body, in its zone (titan-harm.yaml, pinned; 16-23); cleared, the soldier is on the ground.
  const body = pin ? (plain(combat).titans as any[]).find((r) => r.label === pin.label) : null;
  if (pin) recordPlacement(rec, combat, soldierId, { zone: body?.zone ?? soldierIn(combat, soldierId)?.zone ?? null, attachment: { kind: 'pinned', body: pin.label } });
  else if (soldierIn(combat, soldierId)?.attachment.kind === 'pinned') recordPlacement(rec, combat, soldierId, { attachment: { kind: 'ground', body: null } });
  return ruling(combat, tr(pin ? 'gm.pinned' : 'gm.pinCleared', { name: actor.name, label: pin?.label ?? '' }), [], rec);
}

/** Momentum, set by ruling (anchor-ratings.yaml, momentum): the soldier's `system.momentum`, never above the cap of their zone. */
export async function setMomentum(combat: any, soldierId: string, n: number): Promise<boolean> {
  if (!gmOnly()) return false;
  const actor = game.actors.get(soldierId);
  if (!actor) return false;
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === soldierId);
  const cap = s ? capOf(s, snap.field) : 0;
  const value = Math.max(0, Math.min(Math.round(n), cap));
  const rec = new Recorder();
  rec.set(actor, 'system.momentum', value);
  return ruling(combat, tr('gm.momentum', { name: actor.name, n: value, cap }), [], rec);
}

/** Airborne, set or cleared by ruling (positions.yaml, conditions): the soldier's `system.airborne`. */
export async function setAirborne(combat: any, soldierId: string, on: boolean): Promise<boolean> {
  if (!gmOnly()) return false;
  const actor = game.actors.get(soldierId);
  if (!actor) return false;
  const rec = new Recorder();
  rec.set(actor, 'system.airborne', on);
  return ruling(combat, tr(on ? 'gm.airborne' : 'gm.grounded', { name: actor.name }), [], rec);
}

/**
 * A zone's rating, set by ruling (ADR-0028; 16-33): the field keeps the zone's start rating, every
 * soldier over their new cap is trimmed, and a zone turned Open under a standing Titan applies
 * zone-becomes-open (16-21). Replaces the single Anchor Rating setter.
 */
export async function setZoneRating(combat: any, zone: ZoneId, ratingId: string): Promise<boolean> {
  if (!gmOnly()) return false;
  const rating = ratingOf(ratingId);
  const snap = snapshot(combat);
  if (!rating || !snap.field || !snap.field.zones.some((z) => z.n === zone)) return false;
  const rec = new Recorder();
  const field = setRating(snap.field, zone, ratingId);
  rec.set(combat, 'system.field', { ...field, zones: field.zones.map((z) => ({ ...z, effects: z.effects.filter((e) => e !== 'dust' && e !== 'steam') })) });
  if (ratingId === zoneRules().openRating) zoneBecomesOpen(rec, combat, snap, zone);
  trimMomentum(rec, combat, field);
  return ruling(combat, tr('gm.zoneRating', { zone, name: rating.name ?? ratingId }), [], rec);
}

/**
 * A soldier placed by the GM's Direct Control (ADR-0028; 16-33): any zone (or off field) with any
 * attachment, written as a ruling and undoable. No rule is checked and nothing is rolled; an anchored
 * soldier is airborne and one on the ground is not, and Momentum is trimmed to the new zone's cap.
 */
export async function gmPlace(combat: any, soldierId: string, to: Placement): Promise<boolean> {
  if (!gmOnly()) return false;
  const actor = game.actors.get(soldierId);
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === soldierId);
  if (!actor || !s) return false;
  const rec = new Recorder();
  recordPlacement(rec, combat, soldierId, { zone: to.zone, attachment: to.attachment, horseZone: s.mounted ? to.zone : s.horseZone });
  if (to.attachment.kind === 'anchored') rec.set(actor, 'system.airborne', true);
  if (to.attachment.kind === 'ground') rec.set(actor, 'system.airborne', false);
  trimMomentum(rec, combat, snap.field);
  if (to.zone === null && !s.left) await wingEvent(combat, { kind: 'left', soldier: soldierId }, rec);
  return ruling(combat, tr('gm.placed', { name: actor.name, to: placeText(to) }), [], rec);
}

/**
 * A Focus Titan or corpse placed by the GM's Direct Control (ADR-0028): it stands in the zone, taking
 * its on-body and grabbed soldiers with it and leaving its Blind Spot behind, as a Stride would, but
 * with no Stride event and no rule read.
 */
export async function gmPlaceTitan(combat: any, key: string, zone: ZoneId): Promise<boolean> {
  if (!gmOnly()) return false;
  const snap = snapshot(combat);
  const row = snap.titans.find((t) => t.key === key);
  if (!row || !snap.field?.zones.some((z) => z.n === zone)) return false;
  const rec = new Recorder();
  setTitans(rec, combat, titansOf(rec, combat).map((r) => (r.key === key ? { ...r, zone } : r)));
  const moves = strideMoves(snap.soldiers, row.label, zone);
  for (const [id, p] of Object.entries(moves.placements)) recordPlacement(rec, combat, id, p);
  trimMomentum(rec, combat, snap.field);
  return ruling(combat, tr('gm.titanPlaced', { label: row.label, zone }), [], rec);
}

/** A soldier's horse placed by the GM's Direct Control (ADR-0028): a zone, or null for off the field. */
export async function gmPlaceHorse(combat: any, soldierId: string, zone: ZoneId | null): Promise<boolean> {
  if (!gmOnly()) return false;
  const actor = game.actors.get(soldierId);
  if (!actor) return false;
  const rec = new Recorder();
  recordPlacement(rec, combat, soldierId, { horseZone: zone });
  return ruling(combat, tr('gm.horsePlaced', { name: actor.name, zone: zoneText(zone) }), [], rec);
}

/** The loudest flag, set or cleared by ruling (attention.yaml, flags): the Focus Titan row's `flags.loud`. */
export async function setLoudest(combat: any, soldierId: string, key: string, on: boolean): Promise<boolean> {
  if (!gmOnly()) return false;
  const rec = new Recorder();
  const rows = titansOf(rec, combat);
  const row = rows.find((r) => r.key === key);
  if (!row) return false;
  const loud = on ? [...new Set([...row.flags.loud, soldierId])] : row.flags.loud.filter((x: string) => x !== soldierId);
  setTitans(rec, combat, rows.map((r) => (r.key === key ? { ...r, flags: { ...r.flags, loud } } : r)));
  return ruling(combat, tr(on ? 'gm.loud' : 'gm.loudCleared', { name: nameOf(soldierId), label: row.label }), [], rec);
}

/**
 * An Opening, set or cleared by ruling (strikes.yaml, openings): the Titan's `system.openings` and
 * the `openings_by` list it is counted from, so a Nape strike may spend it.
 */
export async function setOpening(combat: any, key: string, on: boolean, byId = ''): Promise<boolean> {
  if (!gmOnly()) return false;
  const titan = titanActor(combat, key);
  const row = (plain(combat).titans as any[]).find((r) => r.key === key);
  if (!titan || !row) return false;
  const rec = new Recorder();
  const held = [...((rec.get(titan, 'system.openings_by') as string[]) ?? [])];
  const next = on ? [...held, byId] : held.slice(0, -1);
  rec.set(titan, 'system.openings_by', next);
  rec.set(titan, 'system.openings', next.length);
  return ruling(combat, tr(on ? 'gm.opening' : 'gm.openingCleared', { label: row.label, n: next.length }), [], rec);
}

/** Attention, set or cleared by ruling (attention.yaml): the Titan's `system.attention_holder`. */
export async function setAttention(combat: any, key: string, soldierId: string | null): Promise<boolean> {
  if (!gmOnly()) return false;
  const titan = titanActor(combat, key);
  const row = (plain(combat).titans as any[]).find((r) => r.key === key);
  if (!titan || !row) return false;
  const rec = new Recorder();
  rec.set(titan, 'system.attention_holder', soldierId ?? '');
  return ruling(combat, tr(soldierId ? 'gm.attention' : 'gm.attentionCleared', { label: row.label, name: soldierId ? nameOf(soldierId) : '' }), [], rec);
}

/** A soldier's move this round, marked spent or given back by ruling: the engagement's `system.movesSpent`. */
export async function setTurnSpent(combat: any, soldierId: string, spent: boolean): Promise<boolean> {
  if (!gmOnly()) return false;
  const rec = new Recorder();
  const held = (rec.get(combat, 'system.movesSpent') as string[]) ?? [];
  rec.set(combat, 'system.movesSpent', spent ? [...new Set([...held, soldierId])] : held.filter((x) => x !== soldierId));
  return ruling(combat, tr(spent ? 'gm.spent' : 'gm.unspent', { name: nameOf(soldierId) }), [], rec);
}

/**
 * A soldier put into or out of the engagement by ruling (engagement-flow.yaml, taking part): the
 * engagement's `system.soldiers`, the soldier's Positions (Distant relative to every Focus Titan, or
 * cleared), and their card combatant.
 */
export async function setInEngagement(combat: any, soldierId: string, taking: boolean): Promise<boolean> {
  if (!gmOnly()) return false;
  const actor = game.actors.get(soldierId);
  if (!actor) return false;
  const rec = new Recorder();
  const held = (rec.get(combat, 'system.soldiers') as string[]) ?? [];
  const snap = snapshot(combat);
  if (taking) {
    if (!held.includes(soldierId)) rec.set(combat, 'system.soldiers', [...held, soldierId]);
    // A soldier put in joins the Squad's start zone on the ground (16-7).
    if (snap.field) recordPlacement(rec, combat, soldierId, { zone: snap.field.squadStart, attachment: { kind: 'ground', body: null } });
    await rec.commit();
    if (![...combat.combatants].some((c: any) => c.actorId === soldierId && c.system.kind !== 'titan')) {
      const token = combat.scene?.tokens.find((t: any) => t.actorId === soldierId);
      await rec.create(combat, 'Combatant', [{ type: CARD, actorId: soldierId, tokenId: token?.id ?? null, sceneId: combat.scene?.id, initiative: null, system: { kind: 'soldier' } }]);
    }
  } else {
    rec.set(combat, 'system.soldiers', held.filter((x) => x !== soldierId));
    if (snap.field) recordPlacement(rec, combat, soldierId, { zone: null });
    await wingEvent(combat, { kind: 'left', soldier: soldierId }, rec);
  }
  return ruling(combat, tr(taking ? 'gm.joins' : 'gm.leaves', { name: actor.name }), [], rec);
}

// ---------------------------------------------------------------- the ending

export interface EndingState {
  noFocusTitan: boolean;
  noSoldierStanding: boolean;
}

export function endingState(snap: Snapshot): EndingState {
  const anyFocus = snap.titans.some((t) => t.status === 'focus');
  const pinned = snap.soldiers.some((s) => s.alive && !!s.pinned);
  const standing = snap.soldiers.some((s) => s.alive && !s.down && !s.left && !(s.pinned?.bodyPin) && holdsAPosition(s, snap.titans));
  return { noFocusTitan: !anyFocus && !pinned, noSoldierStanding: !standing };
}

/**
 * Ends the engagement when a test is met (engagement-flow.yaml, ending): the owed Gas Rolls, then the
 * engagement-end steps as a stamped checklist (engagement-end.yaml). Positions stay recorded until the
 * last step (positions_read); closeEngagement then clears them and removes the engagement.
 */
export async function endEngagement(combat: any): Promise<void> {
  if (!isGM()) return;
  const sys = plain(combat);
  if (sys.step === 'closing') return closeEngagement(combat);
  if (sys.mode === 'titan') {
    const snap = snapshot(combat);
    const test = endingState(snap);
    if (!test.noFocusTitan && !test.noSoldierStanding) {
      ui.notifications.warn(tr('ending.notMet'));
      return;
    }
    if (sys.step !== 'end') await askGasRolls(combat, gasRollsDue(sys.odmUsed, (x) => !!snap.soldiers.find((s) => s.id === x)?.alive));
    await postNote({ title: tr('ending.title'), lines: [tr(test.noFocusTitan ? 'ending.byNoFocus' : 'ending.byNoStanding'), tr('ending.steps')], round: combat.round });
  } else {
    await postNote({ title: tr('ending.skirmishTitle'), lines: [tr('ending.steps')], round: combat.round });
  }
  await combat.update({ turn: null, 'system.step': 'closing', 'system.endLog': closingLog() }, { turnEvents: false });
  await runEnd(combat);
}

/** After the last engagement-end step: every Position record cleared, and the engagement removed. */
export async function closeEngagement(combat: any): Promise<void> {
  if (!isGM() || combat.system.step !== 'closing') return;
  if (!endComplete(roundCore(combat))) {
    ui.notifications.warn(tr('ending.stepsOpen'));
    return;
  }
  // Momentum is 0 outside a Titan Engagement and is cleared when one ends (sheet-fields.yaml, momentum).
  if (combat.system.mode === 'titan') for (const a of soldierActors(combat)) await a.update({ 'system.positions.left': false, 'system.positions.entries': [], 'system.airborne': false, 'system.momentum': 0 });
  await postNote({ title: tr('ending.closed'), lines: [], round: combat.round });
  await writeSystem(combat, { ended: true });
  await combat.delete();
}

export function candidatesForFoes(snap: Snapshot) {
  return foeCandidates(snap.soldiers);
}

export { cardsOf, isEngagement, engagementTurns };

/** Tracker writes a player may not make go through the GM; this is the list the GM's client performs. */
export async function performRequest(combat: any, req: any, user: any): Promise<boolean> {
  switch (req.act) {
    case 'wing':
      return setWing(combat, req.mate, req.pc);
    case 'swap-propose':
      return propose(combat, req.a, req.b, user.id);
    case 'swap-accept': {
      const p = combat.system.proposal;
      return p ? swap(combat, p.a, p.b) : false;
    }
    case 'swap-cancel':
      await writeSystem(combat, { proposal: null });
      return true;
    case 'odm':
      await markOdm(combat, req.soldier);
      return true;
    case 'left':
      await wingEvent(combat, { kind: 'left', soldier: req.soldier });
      return true;
    case 'loud':
    case 'loud-move':
      return setLoud(combat, req.soldier, req.titan);
    case 'move-spent':
      await markMoveSpent(combat, req.soldier);
      return true;
    case 'fall-back':
      return fallBack(combat, req.soldier, req.titan);
    case 'let-go': {
      const actor = game.actors.get(req.soldier);
      const s = soldierIn(combat, req.soldier);
      return !!actor && !!s && letGo(combat, actor, s);
    }
    case 'zone-move': {
      const s = soldierIn(combat, req.soldier);
      if (!s) return false;
      const snap = snapshot(combat);
      const ctx = moveContext(snap, s, ratingRows());
      const o = ctx ? routeOption(s, ctx, req.kind, req.steps, { mountAfter: !!req.mountAfter, dismountAfter: !!req.dismountAfter }) : null;
      if (!o) return false;
      return requestZoneMove(combat, req.soldier, { ...o, chargeOn: typeof req.chargeOn === 'string' ? req.chargeOn : undefined, quiet: !!req.quiet });
    }
    case 'quiet':
      return spendQuiet(combat, req.soldier);
    case 'return': {
      const actor = game.actors.get(req.soldier);
      return !!actor && returnTo(combat, actor, req.zone);
    }
    case 'engage': {
      const list = plain(combat).skirmish.engaged as { soldier: string; foe: string }[];
      const has = list.some((e) => e.soldier === req.soldier && e.foe === req.foe);
      const next = has ? list.filter((e) => e.soldier !== req.soldier) : [...list, { soldier: req.soldier, foe: req.foe }];
      await writeSystem(combat, { 'skirmish.engaged': next });
      await postNote({ title: tr(has ? 'note.breakAway' : 'note.closeIn', { name: nameOf(req.soldier), foe: combat.scene?.tokens.get(req.foe)?.name ?? '' }), lines: [], round: combat.round });
      return true;
    }
    case 'end-turn': {
      const current = combat.combatant;
      if (!current?.testUserPermission?.(user, 'OWNER')) return false;
      await nextCard(combat);
      return true;
    }
  }
  return false;
}

export async function setLoud(combat: any, soldier: string, key: string): Promise<boolean> {
  const rows = plain(combat).titans as any[];
  const next = rows.map((r) => (r.key === key && !r.flags.loud.includes(soldier) ? { ...r, flags: { ...r.flags, loud: [...r.flags.loud, soldier] } } : r));
  await writeSystem(combat, { titans: next });
  const label = rows.find((r) => r.key === key)?.label ?? '?';
  await postNote({ title: tr('note.loud', { name: nameOf(soldier), label }), lines: [], round: combat.round });
  return true;
}

export async function fallBack(combat: any, soldier: string, key: string): Promise<boolean> {
  const snap = snapshot(combat);
  const t = snap.titans.find((x) => x.key === key);
  const s = snap.soldiers.find((x) => x.id === soldier);
  if (!t || !s) return false;
  const actor = game.actors.get(soldier);
  // Fall Back: from the body to free in the same zone, not a fall (squad-tactics.yaml; the detach rule, 16-8).
  const rec = new Recorder();
  recordPlacement(rec, combat, soldier, { attachment: detached(s.airborne) });
  await rec.commit();
  const used = plain(combat).tactics.used as string[];
  const mark = `fall-back@${combat.round}`;
  await writeSystem(combat, { 'tactics.used': [...new Set([...used, 'fall-back', mark])] });
  await postNote({ title: tr('note.fallBack', { name: actor.name, label: t.label }), lines: [], round: combat.round });
  return true;
}

/** The release of a Grabbed soldier (grab.yaml, release), recorded on a Recorder. */
export async function recordRelease(combat: any, key: string, rec: Recorder): Promise<void> {
  const rows = rec.get(combat, 'system.titans') as any[];
  const row = rows.find((r) => r.key === key);
  if (!row?.grab) return;
  const out = release(row.grab, row.status === 'focus');
  const actor = game.actors.get(row.grab.soldier);
  const titan = titanActor(combat, key);
  if (actor) {
    // Freed: on the ground in the holding Titan's zone, after a fall if lifted (grab.yaml, release; 16-23).
    recordPlacement(rec, combat, actor.id, { zone: row.zone ?? null, attachment: { kind: 'ground', body: null } });
    rec.line(tr(out.falls ? 'grab.freedFalls' : 'grab.freed', { name: actor.name }));
    // A release from a lift is a fall (grab.yaml, release, lifted), from On Body relative to the holding Titan.
    if (out.falls && out.position) await rollFall(combat, actor, { attachment: { kind: 'grabbed', body: row.label }, zone: row.zone ?? null, causing: row.label }, rec);
  }
  if (titan) {
    rec.set(titan, 'system.attention_holder', '');
    rec.set(titan, 'system.body_parts', (rec.get(titan, 'system.body_parts') as BodyPart[]).map((p) => (p.id === row.grab.arm ? { ...p, progress: 0 } : p)));
  }
  rec.set(combat, 'system.titans', rows.map((r) => (r.key === key ? { ...r, grab: null, clearTheHand: false } : r)));
}

export { wingEvent };
export const currentCards = (combat: any) => cardsOf(combat);
export const turnsOf = (combat: any) => engagementTurns(combat);
export const isTitanEngagement = (combat: any) => isEngagement(combat) && combat.system.mode === 'titan';
