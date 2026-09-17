/**
 * A Focus Titan's card, in the GM's hands (ADR-0019; data/engagement/behavior-procedure.yaml,
 * resolving_a_card). The tracker works the card out as the rules say — the Attention Ladder, the
 * choose step, the entry's targets — and then stops: it posts a GM-only card naming the behavior and
 * whom it is against, and waits. Nothing is rolled, and no 3D die is thrown, until the GM presses
 * Roll; the dialog that opens fills every value in and lets the GM override any of them, so a table
 * that wants to call it differently can.
 */
import { SYSTEM_ID } from '../config.ts';
import { FLAG, type BehaviorCard } from '../dice/card.ts';
import { clock, postCard } from '../dice/post.ts';
import { rollTitanAttack } from '../dice/reactions.ts';
import { askTitanRoll, type TitanEntryOption, type TitanRollChoice, type TitanRollView } from '../dice/titan-dialog.ts';
import { entryTargets } from '../rules/engagement/attention.ts';
import { grabbedIn } from '../rules/engagement/guard.ts';
import { entryView } from '../sheets/titan-view.ts';
import { postNote, tr } from './notes.ts';
import { partsOf, snapshot, titanActor } from './snapshot.ts';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));

const isGM = () => !!game.user?.isGM;
const gmUsers = (): string[] => game.users.filter((u: any) => u.isGM).map((u: any) => u.id);

/** The most Attack Dice the dialog's stepper offers; the entry's own count is the usual one. */
const DICE_CAP = 12;

/** What one Titan card is waiting on, kept as JSON on its row of the engagement. */
export interface Pending {
  entry: string;
  /** The attack card rolled for it, once the GM has rolled. */
  message: string;
  telegraph: boolean;
  /** The GM-only card that offers the roll. */
  behavior?: string;
}

export const readPending = (raw: string): Pending | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Pending;
  } catch {
    return null;
  }
};

const cardOf = (message: any): BehaviorCard | undefined => {
  const card = message?.getFlag?.(SYSTEM_ID, FLAG);
  return card?.kind === 'behavior' ? (card as BehaviorCard) : undefined;
};

const nameOf = (id: string) => game.actors.get(id)?.name ?? '?';
const uuidOf = (id: string) => game.actors.get(id)?.uuid ?? '';

/** A card's dodges against this Titan this round that still bear on the chosen targets. */
function reactionsFor(row: any, targets: readonly string[]): BehaviorCard['reactions'] {
  return (row?.dodges ?? [])
    .filter((d: any) => targets.includes(d.soldier))
    .map((d: any) => ({ actor: uuidOf(d.soldier), name: nameOf(d.soldier), successes: d.successes, message: d.message }))
    .filter((r: BehaviorCard['reactions'][number]) => !!r.actor);
}

const telegraphs = (entry: any): boolean => (entry?.effects ?? []).some((e: any) => e.type === 'telegraph');

export interface BehaviorPost {
  combat: any;
  key: string;
  label: string;
  round: number;
  /** The entry the choose step settled on. */
  entry: any;
  /** The Next Behavior as rolled, before the choose step. */
  rolled: any;
  holder: string;
  rung: string | null;
  targets: string[];
}

/** Posts the GM-only card that a Focus Titan's turn waits on. Returns the message, or null. */
export async function postBehaviorCard(p: BehaviorPost): Promise<any> {
  const titan = titanActor(p.combat, p.key);
  if (!titan) return null;
  const all = titan.system.toObject().behavior_table.entries as any[];
  const view = entryView(p.entry, all, partsOf(titan));
  const snap = snapshot(p.combat);
  const holder = snap.soldiers.find((s) => s.id === p.holder) ?? null;
  const card: BehaviorCard = {
    v: 1,
    kind: 'behavior',
    actor: titan.uuid,
    actorName: titan.name,
    img: titan.img,
    time: clock(),
    ops: [],
    combat: p.combat.id,
    key: p.key,
    label: p.label,
    entry: p.entry.id,
    name: p.entry.name,
    tier: p.entry.tier,
    rolledEntry: p.rolled?.id ?? '',
    rolledName: p.rolled?.name ?? '',
    holder: holder ? { actor: uuidOf(holder.id), name: holder.name } : null,
    rung: p.rung ? t(`WOF.Rung.${p.rung}`) : '',
    position: holder?.positions[p.label] ? t(`WOF.Position.${holder.positions[p.label]}`) : '',
    attackDice: p.entry.attack_dice ?? null,
    effects: view.effects,
    targets: p.targets.map((id) => ({ actor: uuidOf(id), name: nameOf(id) })),
    reactions: reactionsFor((p.combat.system.titans as any[]).find((r) => r.key === p.key), p.targets),
    rolled: null,
  };
  return postCard(titan, card, [], undefined, gmUsers());
}

/** Writes the card back to its own message (the GM owns it, so no proxy is needed). */
async function save(message: any, card: BehaviorCard): Promise<void> {
  await message.setFlag(SYSTEM_ID, FLAG, card);
}

/** Marks a card spent, so its buttons go: the Titan's turn has moved on. */
export async function closeBehaviorCard(messageId: string): Promise<void> {
  const message = game.messages.get(messageId);
  const card = cardOf(message);
  if (!isGM() || !card || card.rolled) return;
  await save(message, { ...card, rolled: 'none' });
}

/** The dialog's view: every entry of the table, the soldiers who could be targets, and the dice. */
function dialogView(card: BehaviorCard): TitanRollView | null {
  const combat = game.combats.get(card.combat);
  const titan = titanActor(combat, card.key);
  if (!combat || !titan) return null;
  const snap = snapshot(combat);
  const row = snap.titans.find((x) => x.key === card.key);
  const all = titan.system.toObject().behavior_table.entries as any[];
  const parts = partsOf(titan);
  const grabbed = grabbedIn(snap);
  const entries: TitanEntryOption[] = all.map((e) => {
    const view = entryView(e, all, parts);
    return {
      id: e.id,
      name: e.name,
      tier: e.tier,
      tierLabel: view.tierLabel,
      attackDice: e.attack_dice ?? null,
      canHappen: view.canHappen,
      rolled: e.id === card.rolledEntry,
      chosen: e.id === card.entry,
      positions: view.positions,
      targets: view.targets,
      effects: view.effects,
      text: e.text ?? '',
      suggested: row && card.holder ? entryTargets(e, holderId(card), row, snap.soldiers, grabbed) : [],
    };
  });
  const dodges = new Map<string, number>(((combat.system.titans as any[]).find((r) => r.key === card.key)?.dodges ?? []).map((d: any) => [d.soldier, d.successes]));
  const candidates = snap.soldiers
    .filter((s) => s.alive && !s.left)
    .map((s) => ({
      id: s.id,
      name: s.name,
      position: s.positions[card.label] ? t(`WOF.Position.${s.positions[card.label]}`) : tr('pos.none'),
      dodge: dodges.has(s.id) ? (dodges.get(s.id) as number) : null,
      suggested: card.targets.some((x) => x.actor === uuidOf(s.id)),
    }));
  const chosen = entries.find((e) => e.id === card.entry) ?? entries[0];
  return {
    title: t('WOF.Roll.behavior.title', { label: card.label, name: titan.name }),
    titanName: titan.name,
    img: titan.img,
    label: card.label,
    attention: card.holder ? t('WOF.Roll.behavior.holderLine', { name: card.holder.name, rung: card.rung || tr('none') }) : t('WOF.Roll.behavior.noHolder'),
    entries,
    entry: chosen?.id ?? '',
    candidates,
    targets: candidates.filter((c) => c.suggested).map((c) => c.id),
    dice: card.attackDice ?? 0,
    diceCap: DICE_CAP,
    successFaces: [...(CONFIG.WOF.titanDice.successFaces as number[])],
    showDice: false,
  };
}

const holderId = (card: BehaviorCard): string => {
  const uuid = card.holder?.actor ?? '';
  return [...(game.actors ?? [])].find((a: any) => a.uuid === uuid)?.id ?? '';
};

/** The GM's Roll button: ask the dialog, then roll and announce what it settled on. */
export async function openBehaviorRoll(message: any): Promise<void> {
  const card = cardOf(message);
  if (!isGM() || !card || card.rolled) return;
  const view = dialogView(card);
  if (!view) {
    ui.notifications.warn(t('WOF.Roll.behavior.gone'));
    return;
  }
  const choice = await askTitanRoll(view);
  if (!choice) return;
  await resolveBehavior(message, card, choice);
}

/** The GM's "no dice" button: the behavior resolves, announced, with nothing thrown. */
export async function resolveBehaviorWithoutDice(message: any): Promise<void> {
  const card = cardOf(message);
  if (!isGM() || !card || card.rolled) return;
  await resolveBehavior(message, card, {
    entry: card.entry,
    targets: card.targets.map((x) => [...(game.actors ?? [])].find((a: any) => a.uuid === x.actor)?.id ?? '').filter(Boolean),
    dice: 0,
    show: false,
  });
}

async function resolveBehavior(message: any, card: BehaviorCard, choice: TitanRollChoice): Promise<void> {
  const combat = game.combats.get(card.combat);
  const titan = titanActor(combat, card.key);
  if (!combat || !titan) {
    ui.notifications.warn(t('WOF.Roll.behavior.gone'));
    return;
  }
  const all = titan.system.toObject().behavior_table.entries as any[];
  const entry = all.find((e) => e.id === choice.entry) ?? all.find((e) => e.id === card.entry);
  if (!entry) return;
  const ids = choice.targets.filter((id) => !!game.actors.get(id));
  const targets = ids.map((id) => ({ actor: uuidOf(id), name: nameOf(id) }));
  const row = (combat.system.titans as any[]).find((r) => r.key === card.key);
  const tierLabel = t(`WOF.Tier.${entry.tier}`);

  let attack: any = null;
  if (choice.dice > 0) {
    attack = await rollTitanAttack(titan, entry.id, {
      targets,
      titan: { combat: combat.id, key: card.key, label: card.label },
      reactions: reactionsFor(row, ids),
      dice: choice.dice,
      show: choice.show,
    });
  }
  // The behavior is announced to every soldier either way (resolving_a_card, roll-and-announce).
  if (!attack) {
    await postNote({
      title: tr('note.titanBehavior', { label: card.label }),
      lines: [
        entry.tier === 'thrash' ? tr('note.thrash', { name: entry.name }) : tr('note.behavior', { name: entry.name, tier: tierLabel }),
        targets.length ? tr('note.behaviorTargets', { names: targets.map((x) => x.name).join(', ') }) : tr('note.noAttention'),
        tr('note.noDice'),
      ],
      titan: true,
      round: combat.round,
    });
  }

  // What the Titan's card ends on: the entry it resolved, and the attack card to work out, if any.
  const pending: Pending = { entry: entry.id, message: attack?.id ?? '', telegraph: telegraphs(entry), behavior: message.id };
  await combat.update({
    'system.titans': (combat.system.toObject().titans as any[]).map((r) => (r.key === card.key ? { ...r, pending: JSON.stringify(pending) } : r)),
  });
  await save(message, {
    ...card,
    entry: entry.id,
    name: entry.name,
    tier: entry.tier,
    attackDice: choice.dice || null,
    effects: entryView(entry, all, partsOf(titan)).effects,
    targets,
    reactions: reactionsFor(row, ids),
    rolled: attack?.id ?? 'none',
  });
}
