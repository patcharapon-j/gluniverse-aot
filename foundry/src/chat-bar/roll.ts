/**
 * Rolls the chat bar's pool and posts it through the roll card pipeline: the four die kinds as
 * DiceTerms (so Dice So Nice shows each kind's own dice), a Stress Response on a Stress Die 1 for an
 * owned Soldier or Squadmate, and Push by the usual rules for an owned Soldier.
 */
import { responseDue, type Op } from '../rules/roll.ts';
import { actorPool } from '../dice/actor-pool.ts';
import { applyNew } from '../dice/apply.ts';
import { clock, postCard, rollResponse, t } from '../dice/post.ts';
import { WofRoll } from '../dice/terms.ts';
import { barCard, poolSize, type BarCounts, type BarRoller } from './pool.ts';

function speakerActor(): any | null {
  const Msg = foundry.utils.getDocumentClass('ChatMessage');
  return Msg.getSpeakerActor(Msg.getSpeaker()) ?? null;
}

export async function rollBarPool(counts: BarCounts): Promise<any> {
  if (!poolSize(counts)) {
    ui.notifications.warn(t('WOF.ChatBar.empty'));
    return null;
  }
  const actor = speakerActor();
  const roller: BarRoller | null = actor ? { uuid: actor.uuid, name: actor.name, img: actor.img, type: actor.type, owned: !!actor.isOwner } : null;
  const roll = await WofRoll().rollPool(counts);
  const card = barCard({
    counts,
    dice: roll.pool,
    titan: roll.facesOf('titan'),
    roller,
    fallback: { name: game.user.name, img: game.user.avatar },
    label: { name: t('WOF.ChatBar.cardName'), gear: t('WOF.Roll.die.gearDice'), why: roll.formula },
    time: clock(),
  });
  const rolls = [roll];
  const fresh: Op[] = [];
  if (card.actor && responseDue(card.dice, false, card.responses)) {
    const ap = actorPool(actor);
    const r = await rollResponse(ap, ap.stress);
    rolls.push(r.roll);
    card.response = r.response;
    fresh.push(...r.ops);
  }
  card.ops = await applyNew(fresh);
  return postCard(card.actor ? actor : null, card, rolls);
}
