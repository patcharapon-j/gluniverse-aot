/**
 * Titan attack cards (ADR-0019): the GM rolls a Behavior Table entry's Attack Dice in the open, the
 * successes are the card's Severity, and each target's dodge cancels them one for one. The dodge
 * card records itself on the attack card, so the attack shows who it lands on.
 */
import { titanSuccesses } from '../rules/roll.ts';
import { entryView } from '../sheets/titan-view.ts';
import type { ActionCard, AttackCard, FoeAttackCard } from './card.ts';
import { successesOf } from './card.ts';
import { cardOf, clock, postCard, saveCard, t } from './post.ts';
import { hideDice, WofRoll } from './terms.ts';

/** Writes (or rewrites, after a Push) a dodge's successes on the attack card. */
export async function recordReaction(attackMessageId: string, dodge: ActionCard, dodgeMessageId: string): Promise<void> {
  const message = game.messages.get(attackMessageId);
  const card = cardOf(message) as AttackCard | FoeAttackCard | undefined;
  if (!card || (card.kind !== 'attack' && card.kind !== 'foe-attack')) return;
  const reactions = card.reactions.filter((r) => r.message !== dodgeMessageId);
  reactions.push({ actor: dodge.actor, name: dodge.actorName, successes: successesOf(dodge), message: dodgeMessageId });
  await saveCard(message, { ...card, reactions });
}

/** The GM rolls a Titan's Behavior Table entry (Titan Dice on 5 and 6, never Pushed). */
export interface TitanAttackOptions {
  targets?: { actor: string; name: string }[];
  titan?: { combat: string; key: string; label: string };
  /** Dodges already made against this Titan this round, which cancel against this card too. */
  reactions?: AttackCard['reactions'];
  /** Attack Dice the GM set for this card, in place of the entry's own. */
  dice?: number;
  /** Throw the dice with Dice So Nice. Off by default: a Titan's turn never rains dice on the table. */
  show?: boolean;
}

export async function rollTitanAttack(titan: any, entryId: string, opts: TitanAttackOptions = {}): Promise<any> {
  if (!game.user.isGM) return null;
  const all = titan.system.toObject().behavior_table.entries as any[];
  const entry = all.find((e) => e.id === entryId);
  const dice = Math.max(0, Math.round(opts.dice ?? entry?.attack_dice ?? 0));
  if (!entry || !dice) {
    ui.notifications.warn(t('WOF.Roll.attack.noDice'));
    return null;
  }
  const roll = await WofRoll().rollPool({ titan: dice });
  // The Behavior roll shows no 3D dice unless the GM asks for them (they are the GM's own dice).
  if (!opts.show) hideDice(roll);
  const faces = roll.facesOf('titan');
  const view = entryView(entry, all, titan.system.toObject().body_parts ?? []);
  const targets =
    opts.targets ??
    [...(game.user.targets ?? [])]
      .map((tok: any) => tok.actor)
      .filter((a: any) => a && (a.type === 'soldier' || a.type === 'squadmate'))
      .map((a: any) => ({ actor: a.uuid, name: a.name }));
  const card: AttackCard = {
    v: 1,
    kind: 'attack',
    actor: titan.uuid,
    actorName: titan.name,
    img: titan.img,
    time: clock(),
    ops: [],
    entry: entry.id,
    name: entry.name,
    tier: entry.tier,
    faces,
    severity: titanSuccesses(faces, CONFIG.WOF.titanDice.successFaces),
    effects: view.effects,
    critical: (entry.effects as any[]).some((e) => e.type === 'critical-injury'),
    targets,
    reactions: (opts.reactions ?? []).filter((r) => r.actor),
    ...(opts.titan ? { titan: opts.titan } : {}),
  };
  return postCard(titan, card, [roll], 'public');
}
