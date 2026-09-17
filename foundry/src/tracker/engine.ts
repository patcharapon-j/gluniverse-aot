/**
 * The GM's side of the Engagement tracker (foundry/docs/tracker-plan.md, sections 3 to 7): setup, the
 * round's steps, Wings, the deal and swaps, card events, Positions, a Titan entering and dying, and the
 * round-end automation with Undo. Every rule decision is a pure function in src/rules/engagement/.
 */
import { SYSTEM_ID } from '../config.ts';
import { evaluateLadder, chooseEntry, entryTargets } from '../rules/engagement/attention.ts';
import { dealBlock, dealCards, skirmishHolders, tieCard, titanHolders } from '../rules/engagement/cards.ts';
import { countTurn, release } from '../rules/engagement/grab.ts';
import { coreOf, grabbedIn, swapCheck } from '../rules/engagement/guard.ts';
import { comparisonLabel, entering, focusLabels, holdsAPosition, isClose, leaveBlock, letGoBlock, moveOptions, nextLabel, returnBlock, returning, withPosition, type MoveKind } from '../rules/engagement/positions.ts';
import {
  autoChecks,
  checkCategory,
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
import { foeCandidates, groupBroken, skirmishEnding, rollFightWeapon } from '../rules/engagement/skirmish.ts';
import { emptyFlags, type Position, type Snapshot, type SoldierState } from '../rules/engagement/types.ts';
import { isGrounded, nextBehaviorFor, type BodyPart } from '../rules/titan.ts';
import { rollGas } from '../dice/tables.ts';
import { trackerApply } from '../settings.svelte.ts';
import { CARD, ENGAGEMENT, engagementTurns, isEngagement } from './combat.ts';
import { postNote, tr } from './notes.ts';
import { Recorder, revertOps } from './recorder.ts';
import { E, cardsOf, grabbedBy, partsOf, snapshot, soldierActors, soldierState, titanActor, titanToken, wingsOf } from './snapshot.ts';

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
  const next = nextBehaviorFor(s.behavior_table.entries, parts, '', d6());
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

const titanRowData = (key: string, label: string, round: number) => ({ key, label, status: 'focus', entered: round, grab: null, decoy: null, decoysInRow: 0, flags: emptyFlags(), dodges: [], pending: '', clearTheHand: false });

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
    const lines = [tr('note.startTitan', { anchor: E().ratings.find((r) => r.id === choice.anchor)?.name ?? choice.anchor, titan: focus?.name ?? '?' }), tr('note.startFear', { who })];
    if (focus?.system.abnormal) lines.push(tr('note.abnormalFear'));
    await postNote({ title: tr('note.startTitle'), lines, titan: true, round: 1 });
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
    await actor.toggleStatusEffect('dead', { active: true, overlay: true });
    await wingEvent(combat, { kind: 'death', soldier: soldierId });
    await postNote({ title: tr('note.devoured', { name: actor.name }), lines: [tr('note.witnessesDies', { who: witnesses(combat, soldierId).join(', ') || tr('none') })], titan: true, round: combat.round });
  } else {
    await rec.commit();
    await postNote({ title: tr('note.lifted', { name: actor?.name ?? '?' }), lines: [tr('note.liftedLine')], titan: true, round: combat.round });
  }
}

/** Witnesses of a comrade Grabbed or dying (engagement-flow.yaml, witnesses): alive, holding a Position, not Down (Down ones make no Fear Roll). */
export function witnesses(combat: any, except: string): string[] {
  const snap = snapshot(combat);
  return snap.soldiers.filter((s) => s.id !== except && s.alive && !s.down && holdsAPosition(s, snap.titans)).map((s) => s.name);
}

// ---------------------------------------------------------------- a Focus Titan's card

const entryOf = (actor: any, id: string) => (actor.system.toObject().behavior_table.entries as any[]).find((e) => e.id === id);

async function rollNext(actor: any, previous: string, rec: Recorder, reveal: boolean): Promise<string> {
  const s = actor.system.toObject();
  const parts = rec.get(actor, 'system.body_parts') as BodyPart[];
  const next = nextBehaviorFor(s.behavior_table.entries, parts, previous, d6());
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
    await rollNext(actor, prevEntry, rec, false);
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
  const holder = snap.soldiers.find((s) => s.id === ev.holder)!;
  const s = actor.system.toObject();
  const entry = chooseEntry(s.behavior_table.entries, s.next_behavior.entry, s.previous_behavior, s.body_parts, holder.positions[label]);
  const targets = entryTargets(entry, holder.id, tRow, snap.soldiers, grabbedIn(snap));
  targets.sort((a, b) => (tieCard(a, snap.cards, snap.wings) ?? 99) - (tieCard(b, snap.cards, snap.wings) ?? 99));
  await rec.commit();
  const full = entryOf(actor, entry.id);
  const lines = [tr('note.attentionRung', { name: holder.name, rung: game.i18n.localize(`WOF.Rung.${ev.rung}`) }), entry.tier === 'thrash' ? tr('note.thrash', { name: full?.name ?? entry.id }) : tr('note.behavior', { name: full?.name ?? entry.id, tier: game.i18n.localize(`WOF.Tier.${entry.tier}`) })];
  let message: any = null;
  if (full?.attack_dice) {
    const { rollTitanAttack } = await import('../dice/reactions.ts');
    const reactions = (row.dodges as any[]).filter((d) => targets.includes(d.soldier)).map((d) => ({ actor: game.actors.get(d.soldier)?.uuid, name: nameOf(d.soldier), successes: d.successes, message: d.message }));
    message = await rollTitanAttack(actor, entry.id, {
      targets: targets.map((id) => ({ actor: game.actors.get(id).uuid, name: nameOf(id) })),
      titan: { combat: combat.id, key, label },
      reactions,
    });
  } else lines.push(tr('note.noDice'));
  const telegraph = (full?.effects ?? []).some((e: any) => e.type === 'telegraph');
  const titans = (plain(combat).titans as any[]).map((t) => (t.key === key ? { ...t, pending: JSON.stringify({ entry: entry.id, message: message?.id ?? '', telegraph }) } : t));
  await writeSystem(combat, { titans });
  await postNote({ title, lines, titan: true, round: combat.round });
}

async function titanCardEnd(combat: any, combatant: any): Promise<void> {
  const key = combatant.system.titan;
  const sys = plain(combat);
  const row = (sys.titans as any[]).find((t) => t.key === key);
  if (!row?.pending) return;
  const pending = JSON.parse(row.pending) as { entry: string; message: string; telegraph: boolean };
  const actor = titanActor(combat, key);
  if (pending.message) {
    const { resolveAttack } = await import('./results.ts');
    const message = game.messages.get(pending.message);
    if (message) await resolveAttack(message, { auto: true });
  }
  const after = plain(combat);
  const current = (after.titans as any[]).find((t) => t.key === key);
  if (!actor || current?.status !== 'focus') {
    await writeSystem(combat, { titans: (after.titans as any[]).map((t) => (t.key === key ? { ...t, pending: '' } : t)) });
    return;
  }
  // resolving_a_card, next: the previous behavior, decoys in a row 0, flags cleared, a new Next Behavior.
  const rec = new Recorder();
  rec.set(actor, 'system.previous_behavior', pending.entry);
  const next = await rollNext(actor, pending.entry, rec, pending.telegraph);
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
}

/** A change of Position (positions.yaml, moves). Returns false when the rules refuse it. */
export async function movePosition(combat: any, req: MoveRequest): Promise<boolean> {
  const snap = snapshot(combat);
  const s = snap.soldiers.find((x) => x.id === req.actor.id);
  const t = snap.titans.find((x) => x.key === req.key);
  if (!s || !t || !snap.anchor) return false;
  const grabbed = grabbedIn(snap)(s.id);
  if (req.way === 'rule') {
    if (!isGM()) return false;
  } else if (req.way === 'letGo') {
    const why = letGoBlock(s, t.label, grabbed);
    if (why) return warn(`move.${why}`);
  } else {
    const opt = moveOptions(s, { rating: snap.anchor, titan: t, grabbed, retreat: snap.retreat }).find((o) => o.to === req.to);
    if (!opt || opt.block) return warn(`move.${opt?.block ?? 'notOneStep'}`);
    const way = opt.ways.find((w) => w.kind === req.way);
    if (!way) return warn('move.kind');
    if (way.fly) return flyMove(combat, req, s, t.label, way.fly);
  }
  const to = req.way === 'letGo' ? 'in-reach' : req.to;
  await applyPosition(combat, req.actor, s, t.label, to, req.way);
  return true;
}

function warn(key: string): false {
  ui.notifications.warn(tr(key));
  return false;
}

async function flyMove(combat: any, req: MoveRequest, s: SoldierState, label: string, fly: { needs: number; failure: Position }): Promise<boolean> {
  const { rollAction } = await import('../dice/roll-action.ts');
  const { successesOf } = await import('../dice/card.ts');
  const message = await rollAction(req.actor, 'fly', {});
  const card = message?.getFlag(SYSTEM_ID, 'card');
  if (!card) return false;
  const to = successesOf(card) >= fly.needs ? req.to : fly.failure;
  await applyPosition(combat, req.actor, s, label, to, 'odm');
  return true;
}

async function applyPosition(combat: any, actor: any, s: SoldierState, label: string, to: Position, way: MoveRequest['way']): Promise<void> {
  const snap = snapshot(combat);
  const positions = withPosition(s.positions, label, to, focusLabels(snap.titans));
  const patch: Record<string, unknown> = positionsPatch(positions);
  if (way === 'odm') patch['system.airborne'] = true;
  if (way === 'onFoot' || way === 'letGo') patch['system.airborne'] = false;
  await actor.update(patch);
  // A carried comrade changes Position with their carrier (carrying.yaml).
  const carried = s.carrying ? game.actors.get(s.carrying) : null;
  if (carried && isGM()) await carried.update(positionsPatch(positions));
  if (way === 'odm') await markOdm(combat, actor.id);
  const kind = way === 'rule' ? tr('move.byRule') : way === 'letGo' ? tr('move.letGo') : tr(`move.way.${way}`);
  await postNote({ title: tr('note.moved', { name: actor.name }), lines: [tr('note.movedLine', { label, from: tr(`pos.${s.positions[label] ?? 'none'}`), to: tr(`pos.${to}`), kind })], round: combat.round });
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
  rec.set(combat, 'system.titans', [...(rec.get(combat, 'system.titans') as any[]), titanRowData(token.id, label, combat.round + 1)]);
  // Everyone who holds a Position holds Distant relative to it (positions.yaml, two_focus_titans, entering).
  const snap = snapshot(combat);
  for (const s of snap.soldiers) {
    const a = game.actors.get(s.id);
    recordPositions(rec, a, entering(s, label, holdsAPosition(s, snap.titans)));
  }
  const focus = snap.titans.filter((t) => t.status === 'focus').length + 1;
  rec.line(tr('note.entered', { name: token.name, label }));
  if (focus >= 2) rec.line(tr('note.secondFocusFear'));
  if (token.actor.system.abnormal) rec.line(tr('note.abnormalFear'));
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
  if (plan.freed) rec.line(tr(row.grab.lifted ? 'death.freedFalls' : 'death.freed', { name: nameOf(plan.freed) }));
  if (plan.steam.length) rec.line(tr('death.steam', { who: names(plan.steam) }));
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

export async function runEnd(combat: any): Promise<void> {
  if (!isActiveGM()) return;
  for (;;) {
    const log = plain(combat).endLog as EndEntry[];
    const auto = autoChecks(log, enabledCategories());
    if (!auto.length) return;
    await applyCheck(combat, auto[0]);
  }
}

export async function applyCheck(combat: any, index: number): Promise<void> {
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
  const log = plain(combat).endLog as EndEntry[];
  if (nextCheck(log) !== index) return;
  log[index] = { ...log[index], state: 'skipped', ops: [], lines: [tr('end.skipped')] };
  await writeSystem(combat, { endLog: log });
  await runEnd(combat);
}

export async function undoCheck(combat: any, index: number): Promise<void> {
  const log = plain(combat).endLog as EndEntry[];
  for (const i of undoOrder(log, index)) {
    const kept = await revertOps(log[i].ops);
    if (kept.length) ui.notifications.warn(tr('end.kept', { list: kept.join(', ') }));
    const now = plain(combat).endLog as EndEntry[];
    now[i] = { ...now[i], state: 'undone', ops: [], lines: [] };
    for (let j = i + 1; j < now.length; j++) if (now[j].state === 'skipped') now[j] = { ...now[j], state: 'undone', lines: [] };
    await writeSystem(combat, { endLog: now });
  }
}

async function runCheck(combat: any, check: EndEntry['check'], rec: Recorder): Promise<void> {
  const sys = plain(combat);
  const snap = snapshot(combat);
  switch (check) {
    case 'gas-rolls': {
      const due = gasRollsDue(sys.odmUsed, (id) => !!snap.soldiers.find((s) => s.id === id)?.alive);
      for (const id of due) {
        const actor = game.actors.get(id);
        const message = actor ? await rollGas(actor, { silent: true }) : null;
        if (message) rec.message(message.id);
      }
      rec.line(due.length ? tr('end.gasFor', { who: due.map(nameOf).join(', ') }) : tr('end.gasNone'));
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
          const onBody = snap.soldiers.filter((s) => s.alive && s.positions[label] === 'on-body').map((s) => s.name);
          if (onBody.length) rec.line(tr('end.steam', { who: onBody.join(', ') }));
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

/** Ends the engagement when a test is met: the owed Gas Rolls, then every record cleared (engagement-flow.yaml, ending, then). */
export async function endEngagement(combat: any): Promise<void> {
  if (!isGM()) return;
  const sys = plain(combat);
  if (sys.mode === 'titan') {
    const snap = snapshot(combat);
    const test = endingState(snap);
    if (!test.noFocusTitan && !test.noSoldierStanding) {
      ui.notifications.warn(tr('ending.notMet'));
      return;
    }
    if (sys.step !== 'end') for (const id of gasRollsDue(sys.odmUsed, (x) => !!snap.soldiers.find((s) => s.id === x)?.alive)) await rollGas(game.actors.get(id), { silent: true });
    for (const a of soldierActors(combat)) await a.update({ ...positionsPatch({}, false), 'system.airborne': false });
    await postNote({ title: tr('ending.title'), lines: [tr(test.noFocusTitan ? 'ending.byNoFocus' : 'ending.byNoStanding'), tr('ending.steps')], round: combat.round });
  } else {
    await postNote({ title: tr('ending.skirmishTitle'), lines: [tr('ending.skirmishSteps')], round: combat.round });
  }
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
      return setLoud(combat, req.soldier, req.titan);
    case 'fall-back':
      return fallBack(combat, req.soldier, req.titan);
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
export function recordRelease(combat: any, key: string, rec: Recorder): void {
  const rows = rec.get(combat, 'system.titans') as any[];
  const row = rows.find((r) => r.key === key);
  if (!row?.grab) return;
  const out = release(row.grab, row.status === 'focus');
  const actor = game.actors.get(row.grab.soldier);
  const titan = titanActor(combat, key);
  if (actor) {
    const s = soldierState(actor);
    const positions = { ...(rec.get(actor, 'system.positions.entries') as { titan: string; position: Position }[]).reduce((m, e) => ({ ...m, [e.titan]: e.position }), {} as Record<string, Position>) };
    if (out.position) positions[row.label] = out.position;
    else delete positions[row.label];
    recordPositions(rec, actor, positions);
    rec.line(tr(out.falls ? 'grab.freedFalls' : 'grab.freed', { name: s.name }));
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
