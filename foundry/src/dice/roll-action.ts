/**
 * Rolling an Action Catalog entry (core-plan 2d; ADR-0026): check what the soldier can roll, ask
 * the roll dialog, roll the four die kinds, roll a Stress Response on a Stress Die 1, apply what the
 * dice cause, and post the card. Fixed rolls (Fear, Stress Response, Gas) go to their tables.
 */
import type { AttributeId } from '../rules/derived.ts';
import { buildRollPool, entryNeeds, responseDue, type Circumstance, type Op } from '../rules/roll.ts';
import { entryIcon } from '../art.ts';
import { actorPool, entryBlock, exceptionFor, isCustomEntry, poolInputs, type ActorPool } from './actor-pool.ts';
import { applyNew, ops } from './apply.ts';
import type { ActionCard, CallCard } from './card.ts';
import { cardOf, clock, postCard, readyTalent, rollResponse, saveCard, stakesOps, t } from './post.ts';
import { recordReaction } from './reactions.ts';
import { askRoll, type RollDialogView } from './roll-dialog.ts';
import { engagementContext, type EngagementPick } from './engagement-context.ts';
import { rollFear, rollGas, rollStressResponse } from './tables.ts';
import { WofRoll } from './terms.ts';

export interface RollActionOptions {
  /** Bonus Dice the player set on the sheet for this roll. */
  bonus?: number;
  /** A dodge against a Titan attack card. */
  attack?: { message: string; name: string; severity: number };
  /** Answering the GM's call card. */
  call?: { message: string; card: CallCard };
  /** A called roll made on an attribute alone (no entry). */
  attributeAlone?: AttributeId;
}

export { entryIcon };

/** The pseudo entry of a called roll made on an attribute alone (dice-pool.yaml, called_roll; action-catalog.yaml, rolls_called_by_attribute). */
export function attributeEntry(attribute: AttributeId) {
  return {
    id: `attribute-${attribute}`,
    name: t('WOF.Roll.call.attributeAlone', { attribute: t(`WOF.Attribute.${attribute}`) }),
    kind: 'roll',
    rolled: 'when_called',
    attribute,
    gear: [] as string[],
    requiresGear: false,
    withoutGear: null,
    context: 'any',
    needs: null,
    needsCount: CONFIG.WOF.calledRoll.needs as number,
  };
}

/** Rule Talents that let a roll use another attribute (Hunter's Eye, Loose the Horse). */
function attributeOptions(ap: ActorPool, entry: any): AttributeId[] {
  const out: AttributeId[] = [entry.attribute];
  if (entry.id === 'read' && ap.ruleTalents.has('hunters-eye')) out.push('perception');
  if (entry.id === 'break-attention' && ap.ruleTalents.has('loose-the-horse') && ap.gear.some((g) => g.itemId === 'horse' && g.dice > 0)) out.push('agility');
  return [...new Set(out)];
}

/** What a dice Talent is normally rolled for, so a custom roll's list says why each one is offered. */
function talentFor(names: readonly string[]): string | null {
  const cat = CONFIG.WOF.actionCatalogById as Record<string, { name: string }>;
  const list = names.map((id) => cat[id]?.name ?? id);
  return list.length ? t('WOF.Roll.dialog.talentFor', { entries: list.join(', ') }) : null;
}

function dialogView(ap: ActorPool, entry: any, opts: RollActionOptions, pick: EngagementPick | null = null): RollDialogView {
  const W = CONFIG.WOF;
  const isGM = !!game.user.isGM;
  const ex = exceptionFor(entry.id);
  const excluded = new Set(ex?.excluded ?? []);
  const inputs = poolInputs(ap, entry, { bonus: opts.bonus });
  const call = opts.call?.card;
  const conditional = ap.penalties.filter((p) => p.conditional && (p.entries === 'all' || p.entries.includes(entry.id)));
  const injuries =
    entry.id === 'death-roll'
      ? [...ap.actor.items]
          .filter((i: any) => i.type === 'critical-injury' && i.system.row_data.lethal && !i.system.treated)
          .map((i: any) => ({ id: i.id as string, name: (i.system.shown_name || i.name) as string, penalty: (i.system.row_data.death_roll_penalty ?? 0) as number }))
      : [];
  // A custom roll names no entry, so the roller brings any dice Talent and any gear that has Gear Dice.
  const custom = isCustomEntry(entry);
  const notes: string[] = [];
  if (custom) notes.push(t('WOF.Roll.dialog.customNote'));
  if (opts.attack) notes.push(t('WOF.Roll.dialog.against', { name: opts.attack.name, severity: opts.attack.severity }));
  if (entry.id === 'death-roll') notes.push(t('WOF.Roll.dialog.deathNote'));
  if (entry.id === 'treat-injury' && ap.ruleTalents.has('sure-hands')) notes.push(t('WOF.Roll.dialog.secondPush', { name: ap.ruleTalents.get('sure-hands')!.name }));
  return {
    title: t('WOF.Roll.dialog.title', { name: entry.name }),
    actorName: ap.actor.name,
    img: ap.actor.img,
    entryName: entry.name,
    icon: entryIcon(entry),
    inputs,
    attributes: attributeOptions(ap, entry).map((id) => ({ id, label: t(`WOF.Attribute.${id}`) })),
    talents: excluded.has('talent')
      ? []
      : ap.talents
          .filter((x) => x.type === 'dice' && x.level > 0 && (custom || x.names.includes(entry.id)))
          .map((x) => ({ id: x.id, name: x.name, dice: x.level, condition: x.condition[entry.id] ?? null, hint: custom ? talentFor(x.names) : null })),
    gear: excluded.has('gear') ? [] : ap.gear.filter((g) => (custom || entry.gear.includes(g.itemId)) && g.dice > 0).map((g) => ({ id: g.id!, name: g.name, dice: g.dice })),
    gearAllowed: (custom || entry.gear.length > 0) && !excluded.has('gear'),
    conditionals: conditional.map((p) => ({ source: p.source, dice: p.dice, condition: p.conditional! })),
    showBonus: !excluded.has('bonus') && entry.id !== 'death-roll',
    bonus: opts.bonus ?? 0,
    bonusCap: W.bonusDiceCap,
    showCircumstances: ex?.circumstances !== false,
    circumstances: W.circumstances as Circumstance[],
    circumstance: call?.circumstances.id ?? 'standard',
    lockCircumstances: !!call,
    showStakes: !!call || (isGM && entry.rolled === 'when_called' && !opts.attack),
    stakesMenu: (W.calledRoll.failureMenu as { id: string }[]).map((m) => ({ id: m.id, label: t(`WOF.Roll.stakeMenu.${m.id}`) })),
    stakes: call?.stakes ?? null,
    lockStakes: !!call,
    needs: call ? call.needs : opts.attack ? null : (entry.needsCount ?? entryNeeds(entry.needs)),
    passiveOption: isGM && !call && ['spot', 'size-up'].includes(entry.id),
    injuries,
    notes,
    engagement: pick,
  };
}

function poolWhy(pool: ReturnType<typeof buildRollPool>, attribute: string): string {
  return [
    `${t(`WOF.Attribute.${attribute}`)} ${pool.attribute?.dice ?? 0}`,
    pool.talent && `${pool.talent.name} +${pool.talent.dice}`,
    pool.bonus && `${t('WOF.Sheet.roll.bonus')} +${pool.bonus}`,
    ...pool.penalties.map((p) => `${p.source} −${p.dice}`),
    pool.gear ? `${pool.gear.name} ${pool.gear.dice}` : null,
    pool.stress ? `${t('WOF.Derived.stress')} ${pool.stress}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export async function rollAction(actor: any, entryId: string, options: RollActionOptions = {}): Promise<any> {
  const W = CONFIG.WOF;
  if (!actor?.isOwner) {
    ui.notifications.warn(t('WOF.Roll.notOwner'));
    return null;
  }
  if (entryId === 'fear-roll') return rollFear(actor);
  if (entryId === 'stress-response-roll') return rollStressResponse(actor);
  if (entryId === 'gas-roll') return rollGas(actor);

  const entry = options.attributeAlone ? attributeEntry(options.attributeAlone) : W.actionCatalogById[entryId];
  if (!entry) return null;
  const ap = actorPool(actor);
  const block = entryBlock(ap, entry);
  if (block) {
    ui.notifications.warn(`${entry.name}: ${block}`);
    return null;
  }

  const context = options.attributeAlone ? { pick: null, block: null } : engagementContext(actor, entry);
  if (context.block) {
    ui.notifications.warn(`${entry.name}: ${context.block}`);
    return null;
  }
  const view = dialogView(ap, entry, options, context.pick);
  const choice = await askRoll(view);
  if (!choice) return null;

  const ex = exceptionFor(entry.id, choice.passive);
  const step = view.showCircumstances ? (view.circumstances.find((c) => c.id === choice.circumstance) ?? null) : null;
  const injury = view.injuries.find((i) => i.id === choice.injury) ?? null;
  const base = poolInputs(ap, entry, { bonus: Math.min(W.bonusDiceCap, choice.bonus + choice.targetBonus), passive: choice.passive });
  if (choice.targetPenalty) base.penalties = [...base.penalties, { source: t('WOF.Tracker.liftedPenalty'), dice: choice.targetPenalty, entries: 'all' as const }];
  const pool = buildRollPool(
    {
      ...base,
      attribute: choice.attribute,
      talentChoice: choice.talent,
      gearChoice: choice.gear,
      conditionsMet: choice.conditionsMet,
      penalties: injury?.penalty ? [...base.penalties, { source: injury.name, dice: injury.penalty, entries: 'all' as const }] : base.penalties,
    },
    step,
  );
  if (pool.blocked) {
    ui.notifications.warn(t('WOF.Roll.dialog.blocked'));
    return null;
  }

  const roll = await WofRoll().rollPool({ base: pool.base, gear: pool.gear?.dice ?? 0, stress: pool.stress });
  const dice = roll.pool;
  const sureHands = entry.id === 'treat-injury' && ap.ruleTalents.has('sure-hands');
  const column = entry.id === 'endure' && !!readyTalent(ap, 'stay-with-the-column');
  const card: ActionCard = {
    v: 1,
    kind: 'action',
    actor: actor.uuid,
    actorName: actor.name,
    img: actor.img,
    time: clock(),
    ops: [],
    entry: entry.id,
    name: entry.name,
    attribute: choice.attribute,
    called: !!choice.stakes,
    stakes: choice.stakes,
    circumstances: step ? { id: step.id, name: step.name } : null,
    // A called roll needs 1 success (dice-pool.yaml, called_roll.needs) unless the dialog set another.
    needs: choice.needs ?? (choice.stakes ? (W.calledRoll.needs as number) : null),
    passive: choice.passive,
    pool: {
      attribute: pool.attribute,
      talent: pool.talent ? { name: pool.talent.name, dice: pool.talent.dice } : null,
      bonus: pool.bonus,
      removed: pool.removed,
      base: pool.base,
      gear: pool.gear,
      stress: pool.stress,
      why: poolWhy(pool, choice.attribute),
    },
    dice,
    fresh: -1,
    pushes: 0,
    maxPushes: sureHands || column ? 2 : 1,
    // A Squadmate never Pushes, so there is no Push to Cover (data/character/squadmates.yaml, action_list.never).
    pushAllowed: !ap.squadmate && (ex ? ex.pushAllowed : true),
    coverAllowed: !ap.squadmate && (ex ? ex.coverAllowed : true),
    responses: ex ? ex.stressResponse : true,
    cover: null,
    response: null,
    attack: options.attack ?? null,
    injury: injury ? { name: injury.name, penalty: injury.penalty } : null,
    call: options.call?.message ?? null,
    target: choice.target,
  };

  const rolls = [roll];
  const fresh: Op[] = [];
  if (responseDue(dice, false, card.responses)) {
    const r = await rollResponse(ap, ap.stress);
    rolls.push(r.roll);
    card.response = r.response;
    fresh.push(...r.ops);
  }
  // A next-roll penalty lasts until used (data/mind/fear-rolls.yaml, result.duration).
  const penaltyLabel = t('WOF.Actor.Base.FIELDS.next_roll_penalty.label');
  if (ap.nextRollPenalty > 0 && pool.penalties.some((p) => p.source === penaltyLabel)) {
    fresh.push(ops.num('fear', actor, null, 'system.next_roll_penalty', ap.nextRollPenalty, 0, t('WOF.Roll.op.penaltyUsed', { n: ap.nextRollPenalty })));
  }
  fresh.push(...stakesOps(card, actor));
  card.ops = await applyNew(fresh);

  const message = await postCard(actor, card, rolls, choice.passive ? 'blind' : undefined);
  if (options.call) {
    const callMessage = game.messages.get(options.call.message);
    const call = cardOf(callMessage) as CallCard | undefined;
    if (call) await saveCard(callMessage, { ...call, rolled: message.id });
  }
  if (options.attack) await recordReaction(options.attack.message, card, message.id);
  return message;
}
