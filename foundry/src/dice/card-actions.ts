/**
 * What the buttons on a roll card do (ADR-0004, ADR-0019, ADR-0026): Push, Cover, Undo, Redo,
 * Apply, a second Stress Response D6 (Gallows Humour), the Drive's shrug-off, Dodge, answering a
 * called roll, and the Gas Roll a Fear result calls for. Each reads the card from its message,
 * changes the documents, and saves the same message again.
 */
import { applyPush, pushBlock, pushRollCounts, pushStress, responseDue, wearOutcome, wearPoints, WEAR_TALENTS, type Op } from '../rules/roll.ts';
import { actorPool } from './actor-pool.ts';
import { applyNew, cardAction, dropOps, ops } from './apply.ts';
import type { ActionCard, AttackCard, CallCard, FoeAttackCard, TableCard } from './card.ts';
import { cardOf, ownSoldiers, pickSoldier, readyTalent, rollResponse, saveCard, stakesOps, t, usedTalentOp } from './post.ts';
import { pushViaGM, setCovering, type PushRunner } from './proxy.ts';
import { recordReaction } from './reactions.ts';
import { rollAction } from './roll-action.ts';
import { PUSHED_ODM_FLAG, rollGas } from './tables.ts';
import { showDice, WofRoll } from './terms.ts';

/** One card action at a time per message, so a double click never pushes twice. */
const busy = new Set<string>();

async function once<T>(message: any, fn: () => Promise<T>): Promise<T | undefined> {
  if (busy.has(message.id)) return undefined;
  busy.add(message.id);
  try {
    return await fn();
  } catch (err) {
    console.error('wings-of-freedom | card action failed', err);
    ui.notifications.error(t('WOF.Roll.actionFailed'));
    return undefined;
  } finally {
    busy.delete(message.id);
  }
}

const actorOf = async (card: { actor: string }): Promise<any> => (card.actor ? foundry.utils.fromUuid(card.actor) : null);

/** The reason text a card shows under a blocked Push. */
export function pushBlockText(block: string | null): string | null {
  return block ? t(`WOF.Roll.block.push.${block}`) : null;
}

export function currentPushBlock(card: ActionCard, actor: any | null) {
  const down = !!actor && !!(actor.system.down || actor.system.derived?.down_by_rule);
  return pushBlock({ dice: card.dice, pushes: card.pushes, maxPushes: card.maxPushes, pushAllowed: card.pushAllowed, down });
}

export function push(message: any) {
  return once(message, async () => {
    if (message.canUserModify(game.user, 'update')) return pushCard(message);
    // A card the GM posted for this user's soldier: the GM's client makes the Push (core-plan decision 19).
    const card = cardOf(message) as ActionCard;
    const actor = await actorOf(card);
    if (!actor?.isOwner) return;
    const block = currentPushBlock(card, actor);
    if (block) {
      ui.notifications.warn(pushBlockText(block));
      return;
    }
    // The GM's client warns of its own errors; a refused or dropped Push is reported here.
    if (!(await pushViaGM(message))) ui.notifications.warn(t('WOF.Roll.pushNotMade'));
  });
}

/** The GM's side of a Push a player asked for: the live Down check, and the Push itself. */
export const pushRunner: PushRunner = {
  async blocked(message) {
    const card = cardOf(message);
    const actor = card?.kind === 'action' ? await actorOf(card) : null;
    return actor ? currentPushBlock(card as ActionCard, actor) : 'the roller is gone';
  },
  run: async (message) => (await once(message, () => pushCard(message))) ?? null,
};

/** Pushes the card: rolls its non-6 base and Stress dice, applies what the Push causes, and saves it. Returns the saved card. */
async function pushCard(message: any): Promise<ActionCard | null> {
  const card = structuredClone(cardOf(message)) as ActionCard;
  const actor = await actorOf(card);
  if (!actor?.isOwner) return null;
  const block = currentPushBlock(card, actor);
  if (block) {
    ui.notifications.warn(pushBlockText(block));
    return null;
  }
  const ap = actorPool(actor);
  const second = card.pushes === 1;
  const fresh: Op[] = [];

  // Stress: the pusher's, or the Covering comrade's (stress-changes.yaml, push and cover).
  const covered = !!card.cover;
  if (covered) {
    const coverer = await foundry.utils.fromUuid(card.cover!.actor);
    if (coverer) fresh.push(ops.stress(coverer, 1, t('WOF.Roll.op.cover', { name: coverer.name })));
  } else {
    const n = pushStress(false, ap.heldEffects);
    fresh.push(ops.stress(actor, n, t('WOF.Roll.op.push', { n })));
  }
  if (second) {
    // The second Push a Talent allows (Sure Hands; Stay with the Column, once per Leg).
    const used = card.entry === 'endure' ? usedTalentOp(ap, 'stay-with-the-column', 'stress') : null;
    if (used) fresh.push(used);
  }

  // Roll only the dice the Push picks up, so Dice So Nice shows just those. The GM's client shows
  // them for a proxied Push too; saveCard marks the rolls as shown, so Dice So Nice's own update
  // hook does not show them (or the whole card) a second time.
  const roll = await WofRoll().rollPool(pushRollCounts(card.dice, covered));
  await showDice(roll, message.whisper?.length ? message.whisper : null, message.blind);
  const pushed = applyPush(card.dice, { base: roll.facesOf('base'), stress: roll.facesOf('stress') }, !covered);
  card.dice = pushed.dice;
  card.fresh = pushed.fresh;
  card.pushes += 1;
  card.pool.stress = pushed.dice.stress.length;

  // The outcome is worked out again from the pushed dice.
  card.ops = await dropOps(card.ops, (o) => !!o.outcome, message.id);
  const rolls = [...message.rolls, roll];

  // A Stress Die 1 after the Push: one Stress Response, with the Stress after the Push.
  if (responseDue(card.dice, !!card.response, card.responses)) {
    const stressNow = actor.system.derived.stress_effective + (covered ? 0 : pushStress(false, ap.heldEffects));
    const r = await rollResponse(ap, stressNow);
    rolls.push(r.roll);
    card.response = r.response;
    fresh.push(...r.ops);
  }

  // Wear: each Gear Die showing 1 once the roll is Pushed, once (data/gear/items.yaml, wear).
  const gear = card.pool.gear;
  if (!second && gear?.id) {
    const points = wearPoints(card.dice.gear, true);
    const item = actor.items.get(gear.id);
    if (points && item) {
      const talentId = WEAR_TALENTS[gear.itemId];
      const talent = talentId ? readyTalent(ap, talentId) : null;
      const w = wearOutcome(gear.itemId, item.system.current, points, talent ? 1 : 0);
      // Every wear-ignoring Talent is limited, so its use is recorded (and given back by Undo).
      const used = w.ignored && talentId ? usedTalentOp(ap, talentId, 'wear') : null;
      if (used) fresh.push({ ...used, label: t('WOF.Roll.op.wearIgnored', { name: talent!.name }) });
      if (w.ruined) fresh.push(ops.remove('wear', actor, item, t('WOF.Roll.op.ruined', { name: item.name })));
      else if (w.left) {
        const state = item.system.current - w.left <= 0 ? (item.system.subtype === 'odm' ? t('WOF.Derived.jammed') : item.system.subtype === 'horse' ? t('WOF.Derived.lame') : '') : '';
        fresh.push(ops.num('wear', actor, item, 'system.current', item.system.current, w.after, t('WOF.Roll.op.wear', { name: item.name, n: w.left, state: state ? ` (${state})` : '' }), 0, item.system.rating));
      }
    }
    // A Pushed roll on ODM Gear makes this round's Gas Roll three dice (odm-gear.yaml, gas_roll.dice).
    if (gear.itemId === 'odm-gear') fresh.push(ops.set('gas', actor, null, PUSHED_ODM_FLAG, !!foundry.utils.getProperty(actor, PUSHED_ODM_FLAG), true, t('WOF.Roll.op.pushedOdm', { n: CONFIG.WOF.gas.rollDicePushed })));
  }

  const applied = await applyNew(fresh, message.id);
  const outcome = await applyNew(stakesOps(card, actor), message.id);
  card.ops = [...card.ops, ...applied, ...outcome];
  if (!(await saveCard(message, card, rolls))) return null;
  if (card.attack) await recordReaction(card.attack.message, card, message.id);
  return card;
}

export function cover(message: any) {
  return once(message, async () => {
    const card = structuredClone(cardOf(message)) as ActionCard;
    // A Squadmate never Covers (data/character/squadmates.yaml); Down forbids it (data/harm/down.yaml).
    const mine = ownSoldiers([card.actor], true).filter((a) => !(a.system.down || a.system.derived?.down_by_rule));
    if (card.cover && (mine.some((a) => a.uuid === card.cover!.actor) || message.isOwner)) {
      const was = await foundry.utils.fromUuid(card.cover.actor);
      card.cover = null;
      if (was?.isOwner) await setCovering(was, message.id, false);
    } else {
      const who = await pickSoldier(mine, t('WOF.Roll.cover'));
      if (!who) return;
      card.cover = { actor: who.uuid, name: who.name };
      // The comrade's own record that they agreed, which the GM checks before moving their Stress.
      await setCovering(who, message.id, true);
    }
    await saveCard(message, card);
  });
}

export function opsAction(message: any, action: 'undo' | 'redo' | 'apply') {
  return once(message, async () => {
    const card = structuredClone(cardOf(message))!;
    card.ops = await cardAction(card.ops, action, message.id);
    await saveCard(message, card);
  });
}

/** Gallows Humour: roll the Stress Response's D6 again and use the second total. */
export function gallows(message: any) {
  return once(message, async () => {
    const card = structuredClone(cardOf(message)) as ActionCard | TableCard;
    if (!card.response || card.response.rerolled) return;
    const actor = await actorOf(card);
    if (!actor?.isOwner) return;
    const ap = actorPool(actor);
    if (!readyTalent(ap, 'gallows-humour')) return;
    card.ops = await dropOps(card.ops, (o) => !!o.response, message.id);
    // The held list no longer has the first result, so the table is read as it stood before it.
    const again = await rollResponse(actorPool(actor), card.response.stress);
    const used = usedTalentOp(ap, 'gallows-humour', 'stressResponse');
    card.response = { ...again.response, rerolled: true };
    card.ops = [...card.ops, ...(await applyNew([...again.ops, ...(used ? [used] : [])], message.id))];
    await saveCard(message, card, [...message.rolls, again.roll]);
  });
}

/** A Drive shrugs off the whole Fear result (data/mind/fear-rolls.yaml, result.drive). */
export function shrug(message: any) {
  return once(message, async () => {
    const card = structuredClone(cardOf(message)) as TableCard;
    const actor = await actorOf(card);
    if (!actor?.isOwner || actor.type !== 'soldier' || actor.system.drive_used_this_session) return;
    const undone = await cardAction(card.ops, 'undo', message.id);
    card.ops = [
      ...undone.filter((o) => o.state !== 'pending'),
      ...(await applyNew([ops.set('fear', actor, null, 'system.drive_used_this_session', false, true, t('WOF.Roll.op.drive'))], message.id)),
    ];
    card.shrugged = true;
    await saveCard(message, card);
  });
}

export async function dodge(message: any) {
  const card = cardOf(message) as AttackCard;
  const targeted = card.targets.map((x) => x.actor);
  const mine = ownSoldiers();
  const pool = targeted.length ? mine.filter((a) => targeted.includes(a.uuid)) : mine;
  const who = await pickSoldier(pool.length ? pool : mine, t('WOF.Roll.attack.dodge'));
  if (!who) return;
  await rollAction(who, 'dodge', { attack: { message: message.id, name: card.name, severity: card.severity } });
}

/** A Block or Dodge against a Foe's attack (skirmish.yaml, reactions). */
export async function foeReact(message: any, entry: string) {
  const card = cardOf(message) as FoeAttackCard;
  if (!card.target) return;
  const who = await foundry.utils.fromUuid(card.target.actor);
  if (!who?.isOwner) return;
  await rollAction(who, entry === 'block' ? 'block' : 'dodge', { attack: { message: message.id, name: card.weapon, severity: card.severity } });
}

export async function answer(message: any) {
  const card = cardOf(message) as CallCard;
  const actor = await actorOf(card);
  if (!actor) return;
  await rollAction(actor, card.entry ?? '', { call: { message: message.id, card }, attributeAlone: card.entry ? undefined : (card.attribute as any) });
}

/** A Focus Titan's card: the GM's Roll button opens the Titan roll dialog (tracker/behavior.ts). */
export async function behaviorRoll(message: any) {
  if (!game.user.isGM) return;
  const { openBehaviorRoll } = await import('../tracker/behavior.ts');
  await openBehaviorRoll(message);
}

/** The same card's "no dice" button: the behavior resolves, announced, with nothing thrown. */
export async function behaviorNoDice(message: any) {
  if (!game.user.isGM) return;
  const { resolveBehaviorWithoutDice } = await import('../tracker/behavior.ts');
  await resolveBehaviorWithoutDice(message);
}

export async function gasFromFear(message: any) {
  const card = cardOf(message) as TableCard;
  const actor = await actorOf(card);
  if (actor) await rollGas(actor);
}
