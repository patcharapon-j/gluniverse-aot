/**
 * Draws every roll card in the chat log from its message flags, for each viewer, and wires its
 * buttons (ADR-0026, ADR-0027). The message's own header is hidden: the card's one-line header
 * carries the name, the pool, the time, and the GM's delete.
 */
import { actorPool } from './actor-pool.ts';
import { answer, behaviorNoDice, behaviorRoll, cover, currentPushBlock, dodge, foeReact, gasFromFear, gallows, opsAction, push, pushBlockText, shrug } from './card-actions.ts';
import { renderCard, type Card, type CardViewer } from './card.ts';
import { armCard, CardMotion, cardSignature, playCard, whenShown } from './card-motion.ts';
import { cardOf, ownSoldiers, readyTalent, t } from './post.ts';

function actorSync(uuid: string): any {
  // An ad hoc pool from the chat bar may have no actor.
  return uuid ? foundry.utils.fromUuidSync(uuid, { strict: false }) : null;
}

function viewerFor(message: any, card: Card): CardViewer {
  const isGM = !!game.user.isGM;
  const actor = actorSync(card.actor);
  const owner = isGM || !!actor?.isOwner;
  const v: CardViewer = { isGM, owner, canCover: false, coveringMine: false, canDodge: false, gallows: false, drive: false, pushBlock: null, showBlock: false };
  if (card.kind === 'action') {
    const block = currentPushBlock(card, actor);
    v.pushBlock = pushBlockText(block);
    v.showBlock = block === 'stress-one' || block === 'down' || block === 'nothing';
    const mine = ownSoldiers([card.actor], true);
    v.canCover = !card.cover && mine.length > 0;
    v.coveringMine = !!card.cover && (mine.some((a) => a.uuid === card.cover!.actor) || !!message.isOwner);
  }
  if ((card.kind === 'action' || card.kind === 'table') && card.response && actor?.isOwner) {
    try {
      v.gallows = !!readyTalent(actorPool(actor), 'gallows-humour');
    } catch {
      v.gallows = false;
    }
  }
  if (card.kind === 'table' && actor?.type === 'soldier') v.drive = !actor.system.drive_used_this_session;
  if (card.kind === 'foe-attack') v.canDodge = !!card.target && !!actorSync(card.target.actor)?.isOwner;
  if (card.kind === 'attack') {
    const mine = ownSoldiers();
    const targeted = card.targets.map((x) => x.actor);
    v.canDodge = mine.some((a) => !targeted.length || targeted.includes(a.uuid));
  }
  return v;
}

const ACTIONS: Record<string, (m: any, button: HTMLButtonElement) => unknown> = {
  foeReact: (m, b) => foeReact(m, b.dataset.entry ?? 'dodge'),
  push,
  cover,
  undo: (m) => opsAction(m, 'undo'),
  redo: (m) => opsAction(m, 'redo'),
  apply: (m) => opsAction(m, 'apply'),
  gallows,
  shrug,
  dodge,
  answer,
  behaviorRoll,
  behaviorNoDice,
  gas: gasFromFear,
};

export function registerChat(): void {
  const motion = new CardMotion();
  Hooks.on('renderChatMessageHTML', (message: any, html: HTMLElement) => {
    const card = cardOf(message);
    if (!card || card.v !== 1 || !message.isContentVisible) return;
    const content = html.querySelector('.message-content');
    if (!content) return;
    html.classList.add('wof-card-msg');
    const deathRows = CONFIG.WOF.deathRoll.outcomes;
    content.innerHTML = renderCard(t, card, viewerFor(message, card), deathRows);
    // A redraw the viewer has seen before plays nothing; a new roll deals its dice in.
    const plan = motion.plan(message.id, cardSignature(card), Number(message.timestamp ?? 0), Date.now());
    if (plan !== 'none') {
      const drawn = content.querySelector<HTMLElement>('.wof-card');
      armCard(drawn, plan);
      whenShown(html, () => playCard(drawn, plan));
    }
    content.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-wof-act]');
      if (!button || button.disabled) return;
      event.preventDefault();
      event.stopPropagation();
      const fn = ACTIONS[button.dataset.wofAct ?? ''];
      if (!fn) return;
      button.disabled = true;
      Promise.resolve(fn(message, button)).finally(() => {
        if (button.isConnected) button.disabled = false;
      });
    });
  });

  // A card whose actor changed (Stress, Down, a Talent's use) redraws, so its buttons stay true.
  Hooks.on('updateActor', (actor: any) => {
    if (actor.type !== 'soldier' && actor.type !== 'squadmate') return;
    for (const m of [...(game.messages ?? [])].slice(-30)) {
      const card = cardOf(m);
      if (card && (card.kind === 'action' || card.kind === 'table') && card.actor === actor.uuid) ui.chat?.updateMessage?.(m);
    }
  });
}
