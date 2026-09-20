/**
 * The GM's side of the Engagement tracker (foundry/docs/tracker-plan.md, sections 3 to 7): setup, the
 * round's steps, Wings, the deal and swaps, card events, Positions, a Titan entering and dying, and the
 * round-end automation with Undo. Every rule decision is a pure function in src/rules/engagement/.
 */
import { SYSTEM_ID } from '../config.ts';
import { evaluateLadder, chooseEntry, enteringAttention, entryTargets, retargetForEntry } from '../rules/engagement/attention.ts';
import { behaviorResult, dealBlock, dealCards, frenzyAfterRound, FRENZY_CAP, skirmishHolders, tieCard, titanHolders } from '../rules/engagement/cards.ts';
import { countTurn, holdingArm, release } from '../rules/engagement/grab.ts';
import { coreOf, grabbedIn, swapCheck } from '../rules/engagement/guard.ts';
import { comparisonLabel, entering, focusLabels, holdsAPosition, isClose, leaveBlock, letGoBlock, moveOptions, nextLabel, returnBlock, returning, withPosition, type MoveKind } from '../rules/engagement/positions.ts';
import { changeEffects, chargeBlock, chargeDoubleStep, flightResult, momentumCap, momentumEnd, startingAnchors, trimToCap, wreckAnchor } from '../rules/engagement/momentum.ts';
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
import { emptyFlags, type Position, type Snapshot, type SoldierState } from '../rules/engagement/types.ts';
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
import { E, cardsOf, forcedFor, grabbedBy, partsOf, ratingOf, snapshot, soldierActors, soldierState, titanActor, titanRow, titanToken, wingsOf } from './snapshot.ts';

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

// ---------------------------------------------------------------- Positions on the soldier

export function positionsPatch(positions: Record<string, Position>, left?: boolean): Record<string, unknown> {
  const entries = Object.entries(positions)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([titan, position]) => ({ titan, position }));
  const out: Record<string, unknown> = { 'system.positions.entries': entries };
  if (left !== undefined) out['system.positions.left'] = left;
  return out;
}

function recordPositions(rec: Recorder, actor: any, positions: Record<string, Position>, left?: boolean): void {
  for (const [path, value] of Object.entries(positionsPatch(positions, left))) rec.set(actor, path, value);
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
  anchor: string;
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
  const system: Record<string, unknown> = {
    mode,
    step: mode === 'titan' ? 'wings' : 'deal',
    anchor: choice.anchor,
    soldiers: choice.soldiers,
    titans: [],
    background: choice.background.map((b) => ({ ...b, filled: 0, entered: 0 })),
    retreat: { length: E().setup.retreatClock, filled: 0, active: false, began: 0 },
    // engagement-setup.yaml, steps, anchors: the rating sets the pool and nothing is rolled.
    anchors: { left: startingAnchors(ratingOf(choice.anchor)).anchors, wrecks: 0 },
    tactics: { held: choice.tactics, used: [] },
  };
  if (mode === 'titan' && choice.focus) system.titans = [titanRowData(choice.focus, 'A', 1)];
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
  // Every soldier starts at Distant relative to A (positions.yaml, placement); a Skirmish has no Positions.
  for (const id of choice.soldiers) {
    const a = game.actors.get(id);
    if (!a) continue;
    await a.update({ ...positionsPatch(mode === 'titan' && choice.focus ? { A: 'distant' } : {}, false), 'system.airborne': false });
  }
  await combat.activate();
  const who = choice.soldiers.map(nameOf).join(', ');
  if (mode === 'titan') {
    const focus = choice.focus ? scene.tokens.get(choice.focus)?.actor : null;
    const lines = [tr('note.startTitan', { anchor: E().ratings.find((r) => r.id === choice.anchor)?.name ?? choice.anchor, titan: focus?.name ?? '?' }), tr('note.startWho', { who })];
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
    const s = soldierState(actor);
    recordPositions(rec, actor, Object.fromEntries(Object.entries(s.positions).filter(([k]) => k !== row.label)) as Record<string, Position>);
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
  if (pending.wreck) wreck(combat, rec);
  rec.set(actor, 'system.previous_behavior', pending.entry);
  const next = await rollNext(actor, pending.entry, rec, pending.telegraph, frenzyOf(combat, key));
  rec.set(combat, 'system.titans', (after.titans as any[]).map((t) => (t.key === key ? { ...t, pending: '', decoysInRow: 0, flags: emptyFlags() } : t)));
  await rec.commit();
  if (pending.telegraph) {
    const e = entryOf(actor, next);
    await postNote({ title: tr('note.telegraph', { label: row.label }), lines: [tr('note.telegraphLine', { name: e?.name ?? next })], titan: true, round: combat.round });
  }
}

// ---------------------------------------------------------------- Positions

export interface MoveRequest {
  actor: any;
  key: string;
  to: Position;
  /** The way the soldier's own move is made, or a change a rule names. */
  way: MoveKind | 'rule' | 'letGo';
  /** Momentum the move spends on Carry (anchor-ratings.yaml, momentum, spends, carry). */
  carry?: number;
  /** A mounted move that makes the distant to in-reach step sets the loudest flag (mounted_charge). */
  charge?: boolean;
  /**
   * With way 'rule', the kind of step a rule's forced change of Position makes (positions.yaml,
   * moves, forced_step). An ODM forced step is ODM use and leaves the soldier airborne, but it is
   * not the soldier's own move, so it is never a Flight: nothing is rolled, no Momentum is gained,
   * and no loudest flag is set.
   */
  kind?: MoveKind;
  /**
   * The GM's Direct Control (ADR-0028): the rules checks are skipped and the Position is written as
   * told. Only the permission check still applies, so a player's request can never carry it.
   */
  force?: boolean;
}

/** A change of Position (positions.yaml, moves). Returns false when the rules refuse it. */
export async function movePosition(combat: any, req: MoveRequest): Promise<boolean> {
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === req.actor.id);
  const t = snap.titans.find((x) => x.key === req.key);
  if (!s || !t || !snap.anchor) return false;
  const grabbed = grabbedIn(snap)(s.id);
  // ADR-0028: automation assists the GM and never blocks them. Under force the one-step check, the
  // anchor check and the Grabbed check are all skipped, and the move is written as a GM ruling.
  if (req.force) {
    if (!isGM()) return warn('move.forceGM');
    await applyPosition(combat, req.actor, s, t.label, req.to, 'rule', { kind: req.kind, ruling: true });
    return true;
  }
  if (req.way === 'rule') {
    if (!isGM()) return false;
    await applyPosition(combat, req.actor, s, t.label, req.to, 'rule', { kind: req.kind });
    return true;
  } else if (req.way === 'letGo') {
    const why = letGoBlock(s, t.label, grabbed);
    if (why) return warn(`move.${why}`);
    // Letting go is a fall (falls.yaml, triggers, rule-named): the GM's client rolls it.
    if (isGM()) return letGo(combat, req.actor, s, t.label);
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'let-go', combat: combat.id, soldier: s.id, titan: t.key });
    return true;
  } else if (req.charge && req.to === s.positions[t.label] && chargeDoubleStep(snap.anchor)) {
    // mounted_charge, open_double_step: at Open a mounted move may make the Distant to In Reach step
    // twice, so the rider comes in and gets out again. One move and one charge: the flag is set once.
    const why = chargeBlock(s, snap.anchor, s.positions[t.label], grabbed);
    if (why) return warn(`move.${why}`);
    await markMoveSpent(combat, req.actor.id);
    await markLoud(combat, t.label, req.actor.id);
    await postNote({ title: tr('note.moved', { name: req.actor.name }), lines: [tr('note.chargeDouble', { label: t.label })], round: combat.round });
    return true;
  } else {
    const opt = moveOptions(s, { rating: snap.anchor, titan: t, grabbed, retreat: snap.retreat, momentum: s.momentum, forced: forcedFor(combat, snap, s, t.label) }).find((o) => o.to === req.to);
    if (!opt || opt.block) return warn(`move.${opt?.block ?? 'notOneStep'}`);
    const way = opt.ways.find((w) => w.kind === req.way);
    if (!way) return warn('move.kind');
    if (way.carry > s.momentum) return warn('move.noMomentum');
    // Every ODM move is a Flight: rolled for fly, and its step happens whatever the roll gives.
    if (way.kind === 'odm') return flight(combat, { ...req, carry: way.carry }, s, t.label);
    if (req.charge && chargeBlock(s, snap.anchor, s.positions[t.label], grabbed)) return warn('move.chargeReach');
    await applyPosition(combat, req.actor, s, t.label, req.to, req.way, { carry: way.carry, charge: !!req.charge && way.charge });
    return true;
  }
}

/** Letting go (positions.yaml, moves, letting_go): the soldier falls and holds In Reach. */
export async function letGo(combat: any, actor: any, s: SoldierState, label: string): Promise<boolean> {
  const snap = snapshot(combat);
  const rec = new Recorder();
  recordPositions(rec, actor, withPosition(s.positions, label, 'in-reach', focusLabels(snap.titans)));
  rec.set(actor, 'system.airborne', false);
  await rollFall(combat, actor, { positions: s.positions, causing: label }, rec);
  await rec.commit();
  const moved = tr('note.movedLine', { label, from: tr(`pos.${s.positions[label] ?? 'none'}`), to: tr('pos.in-reach'), kind: tr('move.letGo') });
  await postNote({ title: tr('note.moved', { name: actor.name }), lines: [moved, ...rec.lines], round: combat.round });
  return true;
}

function warn(key: string): false {
  ui.notifications.warn(tr(key));
  return false;
}

/**
 * A Flight (positions.yaml, moves, flight): every ODM move rolls for fly with the soldier's own ODM
 * Gear, which means the soldier's own Circumstances, Stress Dice, Talents, Help, Push and Cover. It
 * is therefore never rolled by whichever client called for the move (the bug of item 6): the move
 * posts an action prompt and the moving soldier's owner rolls it from their own client. The step,
 * the Momentum and the loudest flag all land when the card is answered.
 */
async function flight(combat: any, req: MoveRequest, s: SoldierState, label: string): Promise<boolean> {
  const message = await postPrompt({
    ask: 'flight',
    mode: 'action',
    combat: combat.id,
    title: tr('prompt.flightTitle', { name: req.actor.name }),
    cause: tr('prompt.flightCause', { name: req.actor.name, label, from: tr(`pos.${s.positions[label] ?? 'none'}`), to: tr(`pos.${req.to}`) }),
    rolls: tr('prompt.flightRolls'),
    asked: [{ actor: req.actor, detail: tr('prompt.flightDetail', { n: s.momentum, cap: momentumCap(snapshot(combat).anchors) }) }],
    data: { key: req.key, label, to: req.to, carry: req.carry ?? 0, charge: !!req.charge },
    speaker: req.actor,
  });
  if (!message) return false;
  await postNote({ title: tr('note.flightAsked', { name: req.actor.name }), lines: [tr('note.flightAskedLine', { label, to: tr(`pos.${req.to}`) })], round: combat.round });
  return true;
}

/**
 * The answered Flight: the roll is the soldier's own card, and the active GM's client writes the
 * step. Every success is 1 Momentum to the cap, and no successes sets the loudest flag on the Focus
 * Titan the move named, from any Position.
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
    const data = ctx.card.data as { key: string; label: string; to: Position; carry: number; charge: boolean };
    const t = snap.titans.find((x) => x.key === data.key);
    if (!s || !t) return { line: tr('prompt.flightGone', { name: actor.name }), ops: [] };
    const flown = flightResult(successes, s.momentum, snap.anchors);
    await applyPosition(combat, actor, s, t.label, data.to, 'odm', { carry: data.carry ?? 0, flight: { successes, ...flown } });
    return { line: tr('prompt.flightDone', { name: actor.name, n: successes, gained: flown.gained }), ops: [] };
  },
};

interface MoveExtras {
  carry?: number;
  charge?: boolean;
  /** A GM override: the note says so, and the same line the rules path writes is kept. */
  ruling?: boolean;
  /** With way 'rule', the kind of step the rule's forced change makes (moves, forced_step). */
  kind?: MoveKind;
  flight?: { successes: number; momentum: number; gained: number; loud: boolean };
}

async function applyPosition(combat: any, actor: any, s: SoldierState, label: string, to: Position, way: MoveRequest['way'], extra: MoveExtras = {}): Promise<void> {
  const snap = snapshot(combat);
  const positions = withPosition(s.positions, label, to, focusLabels(snap.titans));
  const patch: Record<string, unknown> = positionsPatch(positions);
  // A forced step is a step of the kind the soldier's move makes, so it leaves them airborne as an
  // ODM move does, and is ODM use; it is never a Flight (positions.yaml, moves, forced_step).
  const kind: MoveKind | null = way === 'rule' ? (extra.kind ?? null) : way === 'letGo' ? null : way;
  const how = changeEffects(way === 'rule' ? 'rule' : way === 'letGo' ? 'rule' : 'move', kind);
  if (how.airborne) patch['system.airborne'] = true;
  if (kind === 'onFoot') patch['system.airborne'] = false;
  const spent = Math.max(0, extra.carry ?? 0);
  const held = extra.flight ? extra.flight.momentum : s.momentum;
  const after = Math.max(0, Math.min(held - spent, momentumCap(snap.anchors)));
  if (after !== s.momentum) patch['system.momentum'] = after;
  await actor.update(patch);
  // A carried comrade changes Position with their carrier (carrying.yaml).
  const carried = s.carrying ? game.actors.get(s.carrying) : null;
  if (carried && isGM()) await carried.update(positionsPatch(positions));
  if (how.odmUse) await markOdm(combat, actor.id);
  if (way !== 'rule' && way !== 'letGo') await markMoveSpent(combat, actor.id);
  if (extra.flight?.loud || extra.charge) await markLoud(combat, label, actor.id);
  const wayText = extra.ruling ? tr('gm.byRuling') : way === 'rule' ? tr('move.byRule') : tr(`move.way.${way}`);
  const lines = [tr('note.movedLine', { label, from: tr(`pos.${s.positions[label] ?? 'none'}`), to: tr(`pos.${to}`), kind: wayText })];
  if (extra.ruling) lines.unshift(tr('gm.ruling'));
  if (extra.flight) {
    lines.push(extra.flight.gained ? tr('note.flightMomentum', { n: extra.flight.gained, held: after }) : tr('note.flightNone'));
    if (extra.flight.loud) lines.push(tr('note.flightLoud', { label }));
  }
  if (spent) lines.push(tr('note.carry', { n: spent }));
  if (extra.charge) lines.push(tr('note.charge', { label }));
  await postNote({ title: tr('note.moved', { name: actor.name }), lines, round: combat.round });
}

/**
 * The loudest flag a Flight with no successes or a mounted charge sets (attention.yaml, flags,
 * loudest), by the Titan's label and from any Position, Distant included.
 */
export async function markLoud(combat: any, label: string, soldierId: string): Promise<void> {
  const row = (plain(combat).titans as any[]).find((t) => t.label === label);
  if (!row || row.status !== 'focus') return;
  if (!isGM()) {
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'loud-move', combat: combat.id, soldier: soldierId, titan: row.key });
    return;
  }
  await setLoud(combat, soldierId, row.key);
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
 * A wreck (anchor-ratings.yaml, anchors, wrecking): the Titan Engagement loses 1 Anchor, never below
 * 0, unless the Sparse Terrain Trait keeps the first one. Every soldier over the new cap loses the
 * excess at once.
 */
export function wreck(combat: any, rec: Recorder): void {
  const sys = plain(combat);
  const rating = ratingOf(sys.anchor);
  const before = { anchors: sys.anchors?.left ?? 0, wrecks: sys.anchors?.wrecks ?? 0 };
  const after = wreckAnchor(before, rating);
  rec.set(combat, 'system.anchors', { left: after.anchors, wrecks: after.wrecks });
  if (after.ignored) {
    rec.line(tr('end.wreckIgnored'));
    return;
  }
  rec.line(tr('end.wrecked', { n: after.anchors }));
  const snap = snapshot(combat);
  for (const [id, value] of Object.entries(trimToCap(snap.soldiers, after.anchors))) {
    rec.set(game.actors.get(id), 'system.momentum', value);
    rec.line(tr('end.momentumTrim', { name: nameOf(id), n: value }));
  }
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

export async function leave(combat: any, actor: any): Promise<boolean> {
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === actor.id);
  if (!s) return false;
  const why = leaveBlock(s, snap.titans, grabbedIn(snap)(s.id));
  if (why) return warn(`move.${why}`);
  await actor.update(positionsPatch({}, true));
  // A player character's departure opens the next wings step; a player asks the GM to record it.
  if (isGM()) await wingEvent(combat, { kind: 'left', soldier: actor.id });
  else {
    const { extViaGM } = await import('../dice/proxy.ts');
    await extViaGM('tracker', { act: 'left', combat: combat.id, soldier: actor.id });
  }
  await postNote({ title: tr('note.left', { name: actor.name }), lines: [], round: combat.round });
  return true;
}

export async function returnTo(combat: any, actor: any): Promise<boolean> {
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === actor.id);
  if (!s) return false;
  const why = returnBlock(s, snap.retreat);
  if (why) return warn(`move.${why}`);
  await actor.update(positionsPatch(returning(snap.titans), false));
  await postNote({ title: tr('note.returned', { name: actor.name }), lines: [], round: combat.round });
  return true;
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
  const newRow = titanRowData(token.id, label, combat.round + 1);
  rec.set(combat, 'system.titans', [...(rec.get(combat, 'system.titans') as any[]), newRow]);
  // Everyone who holds a Position holds Distant relative to it (positions.yaml, two_focus_titans, entering).
  const snap = snapshot(combat);
  for (const s of snap.soldiers) {
    const a = game.actors.get(s.id);
    recordPositions(rec, a, entering(s, label, holdsAPosition(s, snap.titans)));
  }
  const focus = snap.titans.filter((t) => t.status === 'focus').length + 1;
  rec.line(tr('note.entered', { name: token.name, label }));
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
    if (row.grab.lifted) await rollFall(combat, game.actors.get(plan.freed), { positions: { ...snap.soldiers.find((x) => x.id === plan.freed)?.positions, [row.label]: 'on-body' }, causing: row.label }, rec);
  }
  if (plan.steam.length) await rollSteam(combat, plan.steam, rec, { trigger: 'kill', label: row.label, key });
  // The falling body destroys 1 Anchor where it lands, whether or not anyone is in the path
  // (titan-harm.yaml, falling_titan, wrecks_an_anchor). A Titan already grounded does not fall.
  if (!isGrounded(partsOf(actor))) wreck(combat, rec);
  if (plan.fall.length) rec.line(tr('death.fall', { who: names(plan.fall) }));
  rec.set(actor, 'system.corpse', true);
  rec.set(actor, 'system.openings', 0);
  rec.set(actor, 'system.openings_by', []);
  rec.set(actor, 'system.regeneration', 0);
  rec.set(actor, 'system.attention_holder', '');
  rec.set(actor, 'system.next_behavior', { entry: '', revealed: false });
  rec.set(combat, 'system.titans', rows.map((r) => (r.key === key ? { ...r, status: 'corpse', grab: null, decoy: null, flags: emptyFlags(), pending: '' } : r)));
  for (const [id, positions] of Object.entries(plan.positions)) recordPositions(rec, game.actors.get(id), positions);
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
 * rises by 1, never above FRENZY_CAP. A corpse has none, and a Next Behavior already rolled is not
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
  const next = rows.map((r) => (r.status === 'focus' ? { ...r, frenzy: frenzyAfterRound(Number(r.frenzy ?? 0)) } : r));
  rec.set(combat, 'system.titans', next);
  for (const r of next.filter((x) => x.status === 'focus')) rec.line(tr('end.frenzy', { label: r.label, n: r.frenzy, cap: FRENZY_CAP }));
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
        }
        if (p.result.stands) {
          rec.set(a, 'system.heave_count', 0);
          const pinned = snap.soldiers.filter((s) => s.pinned?.body === label);
          for (const s of pinned) rec.set(game.actors.get(s.id), 'system.pinned.active', false);
          rec.line(tr('end.stands', { label }));
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
      if (held.length) rec.line(tr('end.momentumKept', { who: held.map((x) => `${x.name} ${x.momentum}`).join(', '), cap: momentumCap(snap.anchors) }));
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
  const snap = snapshot(combat);
  const s = soldierState(actor);
  const arm = titan ? holdingArm(rec.get(titan, 'system.body_parts') as BodyPart[]) : null;
  // A Titan with no arm left still holds by ruling: the row names no part, and nothing is counted off it.
  setTitans(rec, combat, rows.map((r) => (r.key === key ? { ...r, grab: { soldier: soldierId, counted: 0, lifted: false, arm: arm?.id ?? '' } } : r)));
  if (titan) {
    rec.set(titan, 'system.attention_holder', soldierId);
    if (arm) rec.set(titan, 'system.body_parts', (rec.get(titan, 'system.body_parts') as BodyPart[]).map((p) => (p.id === arm.id ? { ...p, progress: 0 } : p)));
  }
  recordPositions(rec, actor, withPosition(s.positions, row.label, 'on-body', focusLabels(snap.titans)));
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
  return ruling(combat, tr(pin ? 'gm.pinned' : 'gm.pinCleared', { name: actor.name, label: pin?.label ?? '' }), [], rec);
}

/** Momentum, set by ruling (anchor-ratings.yaml, momentum): the soldier's `system.momentum`, never above the field's cap. */
export async function setMomentum(combat: any, soldierId: string, n: number): Promise<boolean> {
  if (!gmOnly()) return false;
  const actor = game.actors.get(soldierId);
  if (!actor) return false;
  const cap = momentumCap(snapshot(combat).anchors);
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
 * The anchor rating, changed mid-fight by ruling (anchor-ratings.yaml): the engagement's
 * `system.anchor`, its Anchor pool reset to the new rating's, and every soldier trimmed to the new cap.
 */
export async function setAnchorRating(combat: any, ratingId: string): Promise<boolean> {
  if (!gmOnly()) return false;
  const rating = ratingOf(ratingId);
  if (!rating) return false;
  const rec = new Recorder();
  const anchors = { left: startingAnchors(rating).anchors, wrecks: 0 };
  rec.set(combat, 'system.anchor', ratingId);
  rec.set(combat, 'system.anchors', anchors);
  for (const [id, value] of Object.entries(trimToCap(snapshot(combat).soldiers, anchors.left))) {
    rec.set(game.actors.get(id), 'system.momentum', value);
    rec.line(tr('end.momentumTrim', { name: nameOf(id), n: value }));
  }
  return ruling(combat, tr('gm.anchor', { name: rating.name ?? ratingId, n: anchors.left }), [], rec);
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
    recordPositions(rec, actor, combat.system.mode === 'titan' ? returning(snap.titans) : {}, false);
    await rec.commit();
    if (![...combat.combatants].some((c: any) => c.actorId === soldierId && c.system.kind !== 'titan')) {
      const token = combat.scene?.tokens.find((t: any) => t.actorId === soldierId);
      await rec.create(combat, 'Combatant', [{ type: CARD, actorId: soldierId, tokenId: token?.id ?? null, sceneId: combat.scene?.id, initiative: null, system: { kind: 'soldier' } }]);
    }
  } else {
    rec.set(combat, 'system.soldiers', held.filter((x) => x !== soldierId));
    recordPositions(rec, actor, {}, true);
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
  if (combat.system.mode === 'titan') for (const a of soldierActors(combat)) await a.update({ ...positionsPatch({}, false), 'system.airborne': false, 'system.momentum': 0 });
  await postNote({ title: tr('ending.closed'), lines: [], round: combat.round });
  await writeSystem(combat, { ended: true });
  await combat.delete();
}

export function candidatesForFoes(snap: Snapshot) {
  return foeCandidates(snap.soldiers);
}

export { cardsOf, isEngagement, engagementTurns, comparisonLabel };

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
      const snap = snapshot(combat);
      const s = snap.soldiers.find((x) => x.id === req.soldier);
      const t = snap.titans.find((x) => x.key === req.titan);
      return !!actor && !!s && !!t && letGo(combat, actor, s, t.label);
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
  await actor.update(positionsPatch(withPosition(s.positions, t.label, 'in-reach', focusLabels(snap.titans))));
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
    const s = soldierState(actor);
    const positions = { ...(rec.get(actor, 'system.positions.entries') as { titan: string; position: Position }[]).reduce((m, e) => ({ ...m, [e.titan]: e.position }), {} as Record<string, Position>) };
    const before = { ...positions, [row.label]: 'on-body' as Position };
    if (out.position) positions[row.label] = out.position;
    else delete positions[row.label];
    recordPositions(rec, actor, positions);
    rec.line(tr(out.falls ? 'grab.freedFalls' : 'grab.freed', { name: s.name }));
    // A release from a lift is a fall (grab.yaml, release, lifted), from On Body relative to the holding Titan.
    if (out.falls && out.position) await rollFall(combat, actor, { positions: before, causing: row.label }, rec);
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
