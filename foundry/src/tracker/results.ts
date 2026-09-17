/**
 * What a roll card does to the running engagement, worked out and applied by the active GM's client
 * (foundry/docs/tracker-plan.md, section 5): strikes, Break Attention, and Break Free on a Focus
 * Titan; a Titan attack's landed effects; a Skirmish's Guard, damage, and Foe attacks. Each result is
 * kept in the message's `result` flag with its ops, so Undo and a Push can take it back.
 */
import { SYSTEM_ID } from '../config.ts';
import { FLAG, successesOf, type ActionCard, type AttackCard, type Card, type FoeAttackCard } from '../dice/card.ts';
import { attackResult, titanSuccesses } from '../rules/roll.ts';
import { cardRefusal, resultDigest, resultTrust, strikeRefusal } from '../rules/engagement/card-trust.ts';
import { grabLands } from '../rules/engagement/grab.ts';
import { gainInjury, type Location } from '../rules/engagement/injury.ts';
import { focusLabels, isClose } from '../rules/engagement/positions.ts';
import { attackDamage, cancelAllowed, foeAttackDice, foeTurn, groupBroken, harmFoe, netSuccesses, type FoeState } from '../rules/engagement/skirmish.ts';
import { bodyPartStrikeResult, breakAttentionNeeds, breakAttentionResult, napeStrikeResult, spendOpenings, type DecoyId } from '../rules/engagement/strikes.ts';
import { planBackground, startRetreat } from '../rules/engagement/round.ts';
import type { Position } from '../rules/engagement/types.ts';
import { injuryData } from '../sheets/soldier-ops.ts';
import { trackerApply } from '../settings.svelte.ts';
import { showDice, WofRoll } from '../dice/terms.ts';
import { clock, postCard } from '../dice/post.ts';
import { enterTitan, isActiveGM, isGM, markOdm, recordRelease, skirmishFoes, titanDies, wingEvent } from './engine.ts';
import { fearRolls, trackerDeaths } from './fear.ts';
import { tr } from './notes.ts';
import { Recorder, revertOps } from './recorder.ts';
import { E, grabbedBy, partsOf, snapshot, soldierState, titanActor, titanRow } from './snapshot.ts';

export const RESULT_FLAG = 'result';

export interface Result {
  state: 'done' | 'undone' | 'pending';
  ops: import('../rules/engagement/round.ts').TrackerOp[];
  lines: string[];
  /** What the result was worked out from; a Push changes it. */
  sig: string;
  kind: 'strike' | 'attack' | 'guard' | 'foe';
}

const STRIKES = ['nape-strike', 'body-part-strike', 'break-attention', 'break-free'];
const RECORD_FLAG = 'results';
const cardOf = (m: any): Card | undefined => m?.getFlag?.(SYSTEM_ID, FLAG);

/** The engagement a card's result belongs to. */
function combatOf(card: Card | undefined): any {
  const id = card?.kind === 'action' ? card.target?.combat : card?.kind === 'attack' ? card.titan?.combat : card?.kind === 'foe-attack' ? card.combat : undefined;
  return id ? game.combats.get(id) : undefined;
}

/** The message's result, with whether it is the one the GM wrote (its digest is kept on the engagement). */
function resultState(m: any): { result: Result | undefined; trust: 'trusted' | 'none' | 'tampered' } {
  const raw = m?.getFlag?.(SYSTEM_ID, RESULT_FLAG) as Result | undefined;
  const recorded = combatOf(cardOf(m))?.getFlag?.(SYSTEM_ID, RECORD_FLAG)?.[m?.id] as string | undefined;
  const trust = resultTrust(raw, recorded);
  return { result: trust === 'trusted' ? raw : undefined, trust };
}
const resultOf = (m: any): Result | undefined => resultState(m).result;

/** Writes a result: its digest on the engagement first, so the message renders it as trusted. */
async function writeResult(message: any, result: Result): Promise<void> {
  const combat = combatOf(cardOf(message));
  if (!combat) return;
  await combat.setFlag(SYSTEM_ID, `${RECORD_FLAG}.${message.id}`, resultDigest(result));
  await message.setFlag(SYSTEM_ID, RESULT_FLAG, result);
}
const actorSync = (uuid: string) => foundry.utils.fromUuidSync(uuid, { strict: false });
const rows = (combat: any) => combat.system.toObject().titans as any[];
const rollD6 = async (n: number) => {
  const roll = await new foundry.dice.Roll(`${n}d6`).evaluate({ allowInteractive: false });
  return roll.dice.flatMap((d: any) => d.results.map((r: any) => r.result as number)) as number[];
};

// ---------------------------------------------------------------- the hooks

/** The card each message held when a GM last accepted it (GM memory only). */
const accepted = new Map<string, Card>();

const userIsGM = (id: string | null) => !!(id && game.users.get(id)?.isGM);
const trustWorld = {
  isGM: userIsGM,
  owns: (id: string | null, uuid: string) => {
    const user = id ? game.users.get(id) : null;
    return !!user && !!actorSync(uuid)?.testUserPermission?.(user, 'OWNER');
  },
};
const authorOf = (message: any): string | null => message.author?.id ?? null;

/** Cards the tracker acts on. */
const tracked = (card: Card | undefined): card is Card =>
  !!card && (card.kind === 'foe-attack' || (card.kind === 'attack' && !!card.titan) || (card.kind === 'action' && !!(card.target || card.attack || card.pool?.gear?.itemId === 'odm-gear')));

function remember(message: any): void {
  const card = cardOf(message);
  if (card) accepted.set(message.id, foundry.utils.deepClone(card));
}

function ignore(message: any, why: string): void {
  console.warn(`wings-of-freedom | the tracker ignored card ${message.id}: ${why}`);
  if (isActiveGM()) ui.notifications.warn(tr('result.ignored', { name: message.author?.name ?? '?', why }));
}

export function registerResults(): void {
  Hooks.once('ready', () => {
    if (isGM()) for (const m of game.messages) remember(m);
  });
  Hooks.on('createChatMessage', (message: any) => {
    const card = cardOf(message);
    if (!tracked(card) || !isGM()) return;
    const why = cardRefusal(trustWorld, authorOf(message), card);
    if (why) return void ignore(message, why);
    remember(message);
    if (isActiveGM()) void onCard(message);
  });
  Hooks.on('updateChatMessage', (message: any, changed: any, _options: any, userId: string) => {
    if (!isGM() || !foundry.utils.hasProperty(changed, `flags.${SYSTEM_ID}.${FLAG}`)) return;
    const card = cardOf(message);
    if (!tracked(card)) return;
    // A player's edit is acted on only when it is a change the roller may make (a Push, a Cover).
    const why = cardRefusal(trustWorld, authorOf(message), card, { userId, previous: accepted.get(message.id) });
    if (why) return void ignore(message, why);
    remember(message);
    if (isActiveGM()) void onCard(message);
  });
}

async function onCard(message: any): Promise<void> {
  const card = cardOf(message);
  if (!card) return;
  try {
    if (card.kind === 'action') {
      const combat = card.target?.combat ? game.combats.get(card.target.combat) : game.combats?.active;
      if (combat?.type === 'engagement' && card.pool?.gear?.itemId === 'odm-gear' && combat.system.mode === 'titan' && combat.system.step === 'play') {
        const actor = actorSync(card.actor);
        if (actor && combat.system.soldiers.includes(actor.id)) await markOdm(combat, actor.id);
      }
      if (card.attack) await recordDodge(card, message);
      if (card.target?.titan && STRIKES.includes(card.entry)) await applyResult(message, 'strike');
      if (card.target?.foe && (card.entry === 'fight' || card.entry === 'shoot')) await applyResult(message, 'guard');
    }
    if (card.kind === 'foe-attack' && (!card.cancel || card.reactions.length)) await applyResult(message, 'foe');
    if (card.kind === 'attack' && card.titan && (resultOf(message) || card.reactions.length >= card.targets.length)) await applyResult(message, 'attack');
  } catch (err) {
    console.error('wings-of-freedom | the tracker could not apply a card', err);
  }
}

/** A dodge against a Titan's card also cancels against its later cards this round (rules question 14). */
async function recordDodge(card: ActionCard, message: any): Promise<void> {
  const attackMessage = game.messages.get(card.attack!.message);
  const attack = cardOf(attackMessage);
  if (attack?.kind !== 'attack' || !attack.titan || !userIsGM(authorOf(attackMessage))) return;
  if (!attack.targets.some((t) => t.actor === card.actor)) return;
  const combat = game.combats.get(attack.titan.combat);
  const soldier = actorSync(card.actor);
  if (!combat || !soldier) return;
  const list = rows(combat).map((r) => (r.key === attack.titan!.key ? { ...r, dodges: [...r.dodges.filter((d: any) => d.soldier !== soldier.id), { soldier: soldier.id, successes: successesOf(card), message: message.id }] } : r));
  await combat.update({ 'system.titans': list });
}

const sigOf = (card: Card): string => {
  if (card.kind === 'action') return `${successesOf(card)}:${card.pushes}`;
  if (card.kind === 'attack' || card.kind === 'foe-attack') return JSON.stringify(card.reactions.map((r) => [r.actor, r.successes]));
  return '';
};

const CATEGORY = { strike: 'strikes', attack: 'attacks', guard: 'skirmish', foe: 'skirmish' } as const;

/** Works a card's result out again and applies it; a result from an earlier Push is taken back first. */
export async function applyResult(message: any, kind: Result['kind'], opts: { force?: boolean; auto?: boolean } = {}): Promise<void> {
  if (!isGM()) return;
  const card = cardOf(message);
  if (!card) return;
  const refused = cardRefusal(trustWorld, authorOf(message), card);
  if (refused) return void ignore(message, refused);
  const { result: prev, trust } = resultState(message);
  if (trust === 'tampered') return void ignore(message, 'its result was changed by someone other than a GM');
  const sig = sigOf(card);
  if (prev && prev.sig === sig && !opts.force && prev.state !== 'pending') return;
  if (prev?.state === 'undone' && !opts.force) return;
  if (prev?.state === 'done') await revertOps(prev.ops);
  if (!opts.force && !trackerApply()[CATEGORY[kind]]) {
    await writeResult(message, { state: 'pending', ops: [], lines: [], sig, kind });
    return;
  }
  // The roll's requirements, checked again on the GM's client once any earlier result is taken back.
  const block = kind === 'strike' ? strikeBlock(card as ActionCard) : null;
  if (block) {
    await writeResult(message, { state: 'undone', ops: [], lines: [tr('result.refused', { why: tr(`block.${block}`) })], sig, kind });
    return;
  }
  const rec = new Recorder();
  if (kind === 'strike') await strike(card as ActionCard, rec);
  else if (kind === 'attack') await attackEffects(card as AttackCard, rec);
  else if (kind === 'guard') await guard(card as ActionCard, rec);
  else await foeHarm(card as FoeAttackCard, rec);
  await rec.commit();
  await writeResult(message, { state: 'done', ops: rec.ops, lines: rec.lines, sig, kind });
}

/** Why a strike card's roll may not be made now, by the engagement as the GM sees it. */
function strikeBlock(card: ActionCard): string | null {
  const target = card.target;
  const combat = target ? game.combats.get(target.combat) : null;
  const soldier = actorSync(card.actor);
  if (!target?.titan || combat?.type !== 'engagement' || !soldier) return 'noTitan';
  const titan = titanActor(combat, target.titan);
  if (!titan) return 'noTitan';
  const row = (combat.system.titans as any[]).find((r) => r.key === target.titan);
  const items = [...soldier.items];
  const horse = items.find((i: any) => i.type === 'gear' && i.system.subtype === 'horse');
  return strikeRefusal(snapshot(combat), soldier.id, card.entry, target, {
    parts: partsOf(titan),
    strikeFrom: Object.fromEntries((CONFIG.WOF.bodyPartKinds as { id: string; strikeFrom: string[] }[]).map((k) => [k.id, k.strikeFrom])),
    holdingReach: E().holdingArmReach,
    clearTheHand: !!row?.clearTheHand,
    openingsBy: titan.system.toObject().openings_by ?? [],
    decoys: E().breakAttention.decoys.map((d) => d.id),
    horseReady: !!horse && horse.system.current > 0,
    pryLoose: items.some((i: any) => i.type === 'talent' && i.system.talent_id === 'pry-loose' && i.system.level > 0),
  });
}

export async function undoResult(message: any): Promise<void> {
  const prev = resultOf(message);
  if (!isGM() || prev?.state !== 'done') return;
  const kept = await revertOps(prev.ops);
  if (kept.length) ui.notifications.warn(tr('end.kept', { list: kept.join(', ') }));
  await writeResult(message, { ...prev, state: 'undone', ops: [] });
}

/** Resolves a Titan attack card now (the GM's button, or the end of the Titan's card). */
export async function resolveAttack(message: any, opts: { auto?: boolean } = {}): Promise<void> {
  if (resultOf(message)?.state === 'done') return;
  await applyResult(message, 'attack', { force: !opts.auto });
}

// ---------------------------------------------------------------- strikes on a Titan

async function strike(card: ActionCard, rec: Recorder): Promise<void> {
  const target = card.target!;
  const combat = game.combats.get(target.combat);
  const soldier = actorSync(card.actor);
  const key = target.titan!;
  const titan = titanActor(combat, key);
  const row = rows(combat).find((r) => r.key === key);
  if (!combat || !soldier || !titan || !row) return;
  const n = successesOf(card);
  const label = row.label;
  const byNow = () => rec.get(titan, 'system.openings_by') as string[];
  const addOpenings = (count: number, who: string) => {
    if (count <= 0) return;
    const list = [...byNow(), ...Array.from({ length: count }, () => who)];
    rec.set(titan, 'system.openings_by', list);
    rec.set(titan, 'system.openings', list.length);
  };
  const setFlag = (flag: 'hooked' | 'hurt', id: string) => {
    const list = rec.get(combat, 'system.titans') as any[];
    rec.set(
      combat,
      'system.titans',
      list.map((r) => (r.key === key && !r.flags[flag].includes(id) ? { ...r, flags: { ...r.flags, [flag]: [...r.flags[flag], id] } } : r)),
    );
  };
  switch (card.entry) {
    case 'nape-strike': {
      const spent = Math.max(0, target.openings ?? 0);
      if (spent) {
        const list = spendOpenings(byNow(), soldier.id, spent);
        rec.set(titan, 'system.openings_by', list);
        rec.set(titan, 'system.openings', list.length);
        rec.line(tr('result.spent', { n: spent }));
      }
      const relentless = [...soldier.items].some((i: any) => i.type === 'talent' && i.system.talent_id === 'relentless' && i.system.level > 0);
      const r = napeStrikeResult(n, titan.system.nape_depth, relentless);
      setFlag('hooked', soldier.id);
      if (r.kill) {
        rec.line(tr('result.kill', { name: soldier.name, label }));
        await titanDies(combat, key, rec);
      } else {
        addOpenings(r.openings, soldier.id);
        rec.line(tr('result.short', { name: soldier.name, n: r.openings, label }));
      }
      return;
    }
    case 'body-part-strike': {
      const parts = rec.get(titan, 'system.body_parts');
      const r = bodyPartStrikeResult(parts, target.part ?? '', n, row.grab, E().gripToughness);
      rec.set(titan, 'system.body_parts', r.parts);
      const part = r.parts.find((p) => p.id === target.part);
      rec.line(tr('result.part', { name: game.i18n.localize(`WOF.BodyPart.${target.part}`), state: game.i18n.localize(`WOF.BodyPartState.${part?.state ?? 'intact'}`), count: part?.progress ?? 0 }));
      addOpenings(r.openings, soldier.id);
      if (r.openings) rec.line(tr('result.openings', { n: r.openings }));
      if (r.hurt) setFlag('hurt', soldier.id);
      if (r.freed) recordRelease(combat, key, rec);
      if (r.grounds) {
        const snap = snapshot(combat);
        const path = snap.soldiers.filter((s) => s.alive && !s.airborne && isClose(s.positions[label]) && grabbedBy(snap, s.id) === null).map((s) => s.name);
        rec.line(tr('result.grounded', { label }));
        if (path.length) rec.line(tr('death.fall', { who: path.join(', ') }));
      }
      return;
    }
    case 'break-attention': {
      const decoy = (target.decoy ?? 'flare') as DecoyId;
      const tRow = titanRow(combat, row);
      const need = breakAttentionNeeds(tRow, soldier.id, decoy, E().breakAttention.needs);
      const r = breakAttentionResult(n, need, tRow);
      const decoyName = E().breakAttention.decoys.find((d) => d.id === decoy)?.name ?? decoy;
      if (decoy === 'thrown-cloak') {
        const cloaks = rec.get(combat, 'system.cloaks') as string[];
        if (!cloaks.includes(soldier.id)) rec.set(combat, 'system.cloaks', [...cloaks, soldier.id]);
      }
      if (r.success) {
        if (r.freed) recordRelease(combat, key, rec);
        const list = rec.get(combat, 'system.titans') as any[];
        rec.set(combat, 'system.titans', list.map((x) => (x.key === key ? { ...x, decoy: { name: decoyName, left: r.hold }, decoysInRow: x.decoysInRow + 1 } : x)));
        rec.set(titan, 'system.attention_holder', 'decoy');
        addOpenings(r.openings, soldier.id);
        rec.line(tr('result.decoy', { decoy: decoyName, n: r.hold, need }));
        if (r.openings) rec.line(tr('result.openings', { n: r.openings }));
        if (decoy === 'riderless-horse') rec.line(tr('result.horseBolts'));
      } else rec.line(tr('result.decoyFails', { need }));
      if (decoy === 'flare') await flareTick(combat, rec);
      return;
    }
    case 'break-free': {
      const who = target.forSoldier ?? soldier.id;
      const held = rows(combat).find((x) => x.grab?.soldier === who && x.key === key);
      if (!held) return;
      if (n >= E().breakFree.needs) recordRelease(combat, key, rec);
      else rec.line(tr('result.stillHeld'));
      return;
    }
  }
}

/** A flare fills every Background clock by 1 once the Break Attention is resolved (background-titans.yaml, ticks, flare). */
async function flareTick(combat: any, rec: Recorder): Promise<void> {
  const sys = combat.system.toObject();
  if (sys.retreat.active || !sys.background.length) return;
  const focus = (rec.get(combat, 'system.titans') as any[]).filter((r) => r.status === 'focus').length;
  const plan = planBackground(rec.get(combat, 'system.background'), focus, E().focusLimit, false, combat.round - 1);
  rec.set(combat, 'system.background', plan.clocks.map((c) => (plan.enter.includes(plan.clocks.indexOf(c)) ? { ...c, entered: combat.round } : c)));
  rec.line(tr('result.flare'));
  if (plan.enter.length) {
    for (const i of plan.enter) {
      if (await enterTitan(combat, plan.clocks[i], rec)) await wingEvent(combat, { kind: 'titan' }, rec);
    }
  }
  if (plan.retreat) {
    rec.set(combat, 'system.retreat', startRetreat(sys.retreat, combat.round));
    rec.line(tr('end.retreatBegins'));
  }
}

// ---------------------------------------------------------------- a Titan attack's landed effects

async function attackEffects(card: AttackCard, rec: Recorder): Promise<void> {
  const combat = game.combats.get(card.titan!.combat);
  const key = card.titan!.key;
  const titan = titanActor(combat, key);
  if (!combat || !titan) return;
  const entry = (titan.system.toObject().behavior_table.entries as any[]).find((e) => e.id === card.entry);
  if (!entry) return;
  if (card.severity <= 0) {
    rec.line(tr('result.whiff'));
    return;
  }
  const label = card.titan!.label;
  for (const t of card.targets) {
    const actor = actorSync(t.actor);
    if (!actor) continue;
    const reaction = card.reactions.find((r) => r.actor === t.actor);
    const net = reaction ? attackResult(card.severity, reaction.successes).net : card.severity;
    if (net < 1) {
      rec.line(tr('result.misses', { name: actor.name }));
      continue;
    }
    rec.line(tr('result.lands', { name: actor.name, n: net }));
    for (const e of entry.effects) {
      if (actor.statuses.has('dead')) break;
      await effect(combat, key, label, actor, e, net, rec);
    }
  }
}

async function effect(combat: any, key: string, label: string, actor: any, e: any, net: number, rec: Recorder): Promise<void> {
  switch (e.type) {
    case 'stress': {
      const from = Math.max(actor.system.stress, actor.system.derived.minimum_stress);
      rec.set(actor, 'system.stress', from + e.amount);
      rec.line(tr('result.stress', { name: actor.name, n: e.amount }));
      return;
    }
    case 'critical-injury':
      await gainOn(combat, actor, { location: e.injury_location, type: e.injury_type, cannotBeLethal: e.cannot_be_lethal, net }, rec);
      return;
    case 'knock-loose': {
      const s = soldierState(actor);
      if (s.mounted) return void rec.line(tr('result.mountedStays', { name: actor.name }));
      if (!s.airborne && !isClose(s.positions[label])) return void rec.line(tr('result.notLoose', { name: actor.name }));
      const positions = { ...s.positions };
      if (isClose(positions[label])) positions[label] = 'in-reach';
      setPositions(rec, actor, positions);
      rec.set(actor, 'system.airborne', false);
      rec.line(tr('result.falls', { name: actor.name }));
      return;
    }
    case 'grab':
      await grab(combat, key, label, actor, rec);
      return;
  }
}

function setPositions(rec: Recorder, actor: any, positions: Record<string, Position>): void {
  rec.set(
    actor,
    'system.positions.entries',
    Object.entries(positions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([titan, position]) => ({ titan, position })),
  );
}

async function grab(combat: any, key: string, label: string, actor: any, rec: Recorder): Promise<void> {
  const titan = titanActor(combat, key);
  const snap = snapshot(combat);
  const tRow = snap.titans.find((t) => t.key === key)!;
  const s = soldierState(actor);
  const land = grabLands(s, tRow, rec.get(titan, 'system.body_parts'), focusLabels(snap.titans));
  if (!land) return void rec.line(tr('result.noArm'));
  if (!land.crushOnly) {
    const list = rec.get(combat, 'system.titans') as any[];
    rec.set(combat, 'system.titans', list.map((r) => (r.key === key ? { ...r, grab: land.grab } : r)));
    rec.set(titan, 'system.attention_holder', actor.id);
    rec.set(titan, 'system.body_parts', land.parts);
    setPositions(rec, actor, land.positions);
    if (land.clearAirborne) rec.set(actor, 'system.airborne', false);
    if (land.dismount) for (const h of actor.items.filter((i: any) => i.type === 'gear' && i.system.subtype === 'horse' && i.system.mounted)) rec.set(h, 'system.mounted', false);
    if (land.stopCarrying) {
      rec.set(actor, 'system.carrying', '');
      const other = game.actors.get(land.stopCarrying);
      if (other) rec.set(other, 'system.carried_by', '');
    }
    if (land.stopBeingCarried) {
      rec.set(actor, 'system.carried_by', '');
      const other = game.actors.get(land.stopBeingCarried);
      if (other) rec.set(other, 'system.carrying', '');
    }
    rec.line(tr('result.grabbed', { name: actor.name, label }));
    await wingEvent(combat, { kind: 'grabbed', soldier: actor.id }, rec);
  } else rec.line(tr('result.pinnedCrush', { name: actor.name }));
  const crush = E().crush;
  await gainOn(combat, actor, { location: crush.location as Location, type: crush.type, cannotBeLethal: crush.cannotBeLethal, net: 0 }, rec);
  if (!land.crushOnly && !actor.statuses.has('dead')) await fearRolls(combat, { kind: 'grabbed', soldier: actor.id }, rec);
}

/** Gains a Critical Injury (critical-injuries.yaml, gaining) and records it on the soldier. */
export async function gainOn(combat: any, actor: any, x: { location: Location | 'rolled'; type: string; cannotBeLethal: boolean; net: number }, rec: Recorder): Promise<void> {
  const [loc] = await rollD6(1);
  const dice = (await rollD6(2)) as [number, number];
  const held = [...actor.items].filter((i: any) => i.type === 'critical-injury').map((i: any) => ({ row: i.system.row, location: i.system.location, side: i.system.side ?? null }));
  const healed = (actor.system.toObject().healed_permanent_injuries ?? []) as { row: string; side: 'left' | 'right' | null }[];
  const g = gainInjury(E().injury as never, { location: x.location, cannotBeLethal: x.cannotBeLethal, net: x.net, held, healedPermanent: healed }, { location: loc, dice });
  const where = game.i18n.localize(`WOF.InjuryLocation.${g.location}`) + (g.side ? ` (${game.i18n.localize(`WOF.Side.${g.side}`)})` : '');
  const pack = game.packs.get(`${SYSTEM_ID}.critical-injuries`);
  const id = CONFIG.WOF.packIds.criticalInjuries?.[g.row];
  const item = id ? await pack?.getDocument(id) : null;
  if (!item) return void rec.line(tr('result.injuryMissing', { row: g.row }));
  const data = injuryData(item, { type: x.type as never, side: g.side });
  rec.line(tr('result.injury', { name: actor.name, where, total: g.total, injury: data.name }));
  if (g.instant) {
    await rec.commit();
    trackerDeaths.add(actor.id);
    const effect = await actor.toggleStatusEffect('dead', { active: true, overlay: true });
    if (effect?.uuid) rec.ops.push({ t: 'create', uuid: effect.uuid, parent: actor.uuid, collection: 'ActiveEffect', data: effect.toObject() });
    rec.line(tr('result.dies', { name: actor.name }));
    await wingEvent(combat, { kind: 'death', soldier: actor.id }, rec);
    await fearRolls(combat, { kind: 'dies', soldier: actor.id }, rec);
    return;
  }
  await rec.create(actor, 'Item', [data]);
  if (actor.system.derived?.down_by_rule && !actor.system.down) {
    rec.set(actor, 'system.down', true);
    rec.line(tr('result.down', { name: actor.name }));
    await wingEvent(combat, { kind: 'down', soldier: actor.id }, rec);
  }
}

// ---------------------------------------------------------------- a Skirmish

function foeState(tok: any, combat: any, label: number): FoeState {
  const s = tok.actor.system;
  const holds = combat.system.skirmish.holds as { soldier: string; foe: string }[];
  return { id: tok.id, label, health: s.health, lost: s.health_lost, out: !!s.out || combat.system.skirmish.left.includes(tok.id), heldBy: holds.find((h) => h.foe === tok.id)?.soldier ?? null, fightWeapon: s.weapon || s.fight_weapon.fixed || 'bare-hands', shootWeapon: s.shoot_weapon || null, loaded: !!s.firearm_loaded };
}

const weaponRow = (id: string) => (CONFIG.WOF.weapons as { id: string; name: string; usedWith: 'fight' | 'shoot'; injuryType: string; damage: number }[]).find((w) => w.id === id);

/** A soldier's Fight or Shoot against a Foe: the Foe's Guard, then damage or a hold (skirmish.yaml, attack, damage, grapple). */
async function guard(card: ActionCard, rec: Recorder): Promise<void> {
  const combat = game.combats.get(card.target!.combat);
  const soldier = actorSync(card.actor);
  const tok = combat?.scene?.tokens.get(card.target!.foe);
  if (!combat || !soldier || !tok?.actor) return;
  const sys = combat.system.toObject();
  const foe = tok.actor;
  const squadAmbush = sys.skirmish.ambush === 'squad' && combat.round === 1;
  const cancel = cancelAllowed(squadAmbush, sys.skirmish.acted.includes('foes'));
  let guardHits = 0;
  if (cancel && foe.system.guard_dice > 0) {
    const roll = await WofRoll().rollPool({ base: foe.system.guard_dice, gear: 0, stress: 0 });
    await showDice(roll);
    const faces = roll.facesOf('base') as number[];
    guardHits = faces.filter((f) => f === 6).length;
    rec.line(tr('result.guard', { name: tok.name, faces: faces.join(' '), n: guardHits }));
  } else rec.line(tr('result.noGuard'));
  const net = netSuccesses(successesOf(card), guardHits);
  rec.set(combat, 'system.skirmish.lastAttacker', [...(sys.skirmish.lastAttacker as any[]).filter((x) => x.foe !== tok.id), { foe: tok.id, soldier: soldier.id }]);
  if (net < 1) return void rec.line(tr('result.guarded'));
  if (card.target!.grapple) {
    rec.set(foe, 'system.held', true);
    rec.set(combat, 'system.skirmish.holds', [...(sys.skirmish.holds as any[]).filter((h) => h.foe !== tok.id), { soldier: soldier.id, foe: tok.id }]);
    return void rec.line(tr('result.grapple', { name: tok.name }));
  }
  const gearId = card.pool.gear?.itemId ?? '';
  const weaponId = card.entry === 'fight' ? (gearId === 'blade-set' ? 'blade-set' : 'bare-hands') : gearId || 'fired-flare';
  const weapon = weaponRow(weaponId) ?? weaponRow('bare-hands')!;
  const damage = attackDamage(weapon.damage, net, E().skirmish.perNetBeyond);
  const harm = harmFoe({ health: foe.system.health, lost: foe.system.health_lost }, damage, weapon.injuryType, E().skirmish.killedBy);
  rec.set(foe, 'system.health_lost', harm.lost);
  rec.line(tr('result.foeDamage', { name: tok.name, n: damage, weapon: weapon.name }));
  if (card.entry === 'shoot' && gearId && gearId !== 'fired-flare') {
    const gun = soldier.items.find((i: any) => i.type === 'gear' && i.system.item_id === gearId);
    if (gun) rec.set(gun, 'system.loaded', false);
  }
  if (harm.out) {
    rec.set(foe, 'system.out', true);
    rec.set(combat, 'system.skirmish.engaged', (sys.skirmish.engaged as any[]).filter((e) => e.foe !== tok.id));
    rec.set(combat, 'system.skirmish.holds', (sys.skirmish.holds as any[]).filter((h) => h.foe !== tok.id));
    rec.line(tr(harm.killed ? 'result.foeKilled' : 'result.foeOutCold', { name: tok.name }));
    if (harm.killed && soldier.type === 'soldier' && !soldier.system.killed_a_person) {
      rec.set(soldier, 'system.killed_a_person', true);
      rec.line(tr('result.firstKill', { name: soldier.name }));
    }
    const foes = skirmishFoes(combat);
    const outs = foes.map((f: any) => ({ out: f.id === tok.id ? true : !!f.actor?.system.out }));
    if (groupBroken(outs, foe.system.grit + sys.skirmish.gritRise)) rec.line(tr('result.groupBreaks'));
  }
}

/** The Foe's turn on its group's card (foes.yaml, foe_rule): the GM's Act button. */
export async function foeAct(combat: any, foeTokenId: string): Promise<void> {
  if (!isGM()) return;
  const foes = skirmishFoes(combat);
  const index = foes.findIndex((f: any) => f.id === foeTokenId);
  const tok = foes[index];
  if (!tok?.actor) return;
  const sys = combat.system.toObject();
  const snap = snapshot(combat);
  const f = foeState(tok, combat, index + 1);
  const cards = snap.cards;
  const turn = foeTurn({
    foe: f,
    soldiers: snap.soldiers,
    engaged: (id) => (sys.skirmish.engaged as any[]).some((e) => e.soldier === id && e.foe === tok.id),
    lastAttacker: (sys.skirmish.lastAttacker as any[]).find((x) => x.foe === tok.id)?.soldier ?? null,
    cardOf: (id) => cards[id] ?? null,
    broken: sys.skirmish.broken,
  });
  const { postNote } = await import('./notes.ts');
  if (turn.step === 'out' || turn.step === 'none') return void postNote({ title: tr(`foe.${turn.step}`, { name: tok.name }), lines: [], round: combat.round });
  if (turn.step === 'empty') {
    await tok.actor.update({ 'system.firearm_loaded': true });
    return void postNote({ title: tr('foe.reload', { name: tok.name }), lines: [], round: combat.round });
  }
  if (turn.closes) await combat.update({ 'system.skirmish.engaged': [...sys.skirmish.engaged, { soldier: turn.target!, foe: tok.id }] });
  const weapon = weaponRow(turn.weapon!) ?? weaponRow('bare-hands')!;
  const targetActor = game.actors.get(turn.target!);
  const foesAmbush = sys.skirmish.ambush === 'foes' && combat.round === 1;
  const acted = sys.skirmish.acted.includes(turn.target!);
  const dice = foeAttackDice(tok.actor.system.attack_dice, foesAmbush, acted, E().bonus.ambush);
  const roll = await WofRoll().rollPool({ base: dice, gear: 0, stress: 0 });
  const faces = roll.facesOf('base') as number[];
  if (weapon.usedWith === 'shoot') await tok.actor.update({ 'system.firearm_loaded': false });
  const card: FoeAttackCard = {
    v: 1,
    kind: 'foe-attack',
    actor: tok.actor.uuid,
    actorName: tok.name,
    img: tok.texture?.src ?? tok.actor.img,
    time: clock(),
    ops: [],
    combat: combat.id,
    foe: tok.id,
    weapon: weapon.name,
    usedWith: weapon.usedWith,
    faces,
    severity: titanSuccesses(faces, [6]),
    target: targetActor ? { actor: targetActor.uuid, name: targetActor.name } : null,
    cancel: cancelAllowed(foesAmbush, acted) && !soldierState(targetActor).down,
    reactions: [],
  };
  await postCard(tok.actor, card, [roll], 'public');
}

/** A Foe attack lands: the weapon's damage on the soldier (skirmish.yaml, damage, on_a_soldier). */
async function foeHarm(card: FoeAttackCard, rec: Recorder): Promise<void> {
  const combat = game.combats.get(card.combat);
  const actor = card.target ? actorSync(card.target.actor) : null;
  const tok = combat?.scene?.tokens.get(card.foe);
  if (!combat || !actor) return;
  const reaction = card.reactions[0];
  const net = netSuccesses(card.severity, card.cancel && reaction ? reaction.successes : 0);
  if (net < 1) return void rec.line(tr('result.misses', { name: actor.name }));
  const weapon = (CONFIG.WOF.weapons as any[]).find((w) => w.name === card.weapon) ?? weaponRow('bare-hands');
  const damage = attackDamage(weapon.damage, net, E().skirmish.perNetBeyond);
  const current = actor.system.derived.current_health as number;
  rec.set(actor, 'system.health_lost', actor.system.health_lost + Math.min(damage, current));
  rec.line(tr('result.soldierDamage', { name: actor.name, n: damage, weapon: card.weapon, by: tok?.name ?? '' }));
  if (damage >= current) await gainOn(combat, actor, { location: 'rolled', type: weapon.injuryType, cannotBeLethal: false, net: 0 }, rec);
}

// ---------------------------------------------------------------- on the card

export function registerResultView(): void {
  Hooks.on('renderChatMessageHTML', (message: any, html: HTMLElement) => {
    const card = cardOf(message);
    const result = resultOf(message);
    const content = html.querySelector('.message-content article.wof-card .rc-b');
    if (!card || !content) return;
    const esc = (s: string) => foundry.utils.escapeHTML(s);
    const gm = !!game.user.isGM;
    let out = '';
    if (result) {
      const lines = result.lines.map((l) => `<li>${esc(l)}</li>`).join('');
      const label = result.state === 'done' ? tr('result.applied') : result.state === 'undone' ? tr('result.undone') : tr('result.notApplied');
      const buttons = gm
        ? result.state === 'done'
          ? `<button class="mini" type="button" data-wof-result="undo">${esc(tr('result.undo'))}</button>`
          : `<button class="mini" type="button" data-wof-result="apply">${esc(result.state === 'undone' ? tr('result.redo') : tr('result.apply'))}</button>`
        : '';
      out = `<div class="wof-result ${result.state}"><p class="res-h"><b>${esc(label)}</b>${buttons}</p>${lines ? `<ul>${lines}</ul>` : ''}</div>`;
    } else if (gm && ((card.kind === 'attack' && card.titan) || (card.kind === 'foe-attack' && card.cancel))) {
      out = `<div class="wof-result pending"><p class="res-h"><b>${esc(tr('result.waiting'))}</b><button class="mini red" type="button" data-wof-result="resolve">${esc(tr('result.resolve'))}</button></p></div>`;
    }
    if (!out) return;
    content.insertAdjacentHTML('beforeend', out);
    content.querySelectorAll<HTMLButtonElement>('button[data-wof-result]').forEach((b) =>
      b.addEventListener('click', async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        b.disabled = true;
        const kind = result?.kind ?? (card.kind === 'attack' ? 'attack' : 'foe');
        try {
          if (b.dataset.wofResult === 'undo') await undoResult(message);
          else await applyResult(message, kind, { force: true });
        } finally {
          if (b.isConnected) b.disabled = false;
        }
      }),
    );
  });
}

export const partsForView = partsOf;
