/**
 * The prompt card (batch C; ADR-0026 as amended, ADR-0028): one mechanism for every roll the rules
 * make *about* a soldier - the steam of a dying Titan, a fall, a Critical Injury's dice, the round's
 * Gas Rolls, and the Flight. The card says what is happening, why, and to whom, and carries a button
 * only that soldier's owner (and the GM) may press. It follows the Titan attack card
 * (src/dice/reactions.ts): the GM posts, each player answers from their own client.
 *
 * WHY THE PROMPT DOES NOT HOLD THE RECORDER OPEN
 * ----------------------------------------------
 * Steam, a fall and a Critical Injury used to resolve inside the recorder transaction of the step
 * that caused them, which is what made them silent. A prompt puts a player in the middle of that
 * transaction, and there are only two ways to carry it:
 *
 *   (a) the step's recorder stays open until every prompt is answered, or
 *   (b) the step commits at once and each prompt resolves into its own small transaction.
 *
 * We take (b), for two reasons the owner's direction asks for by name:
 *
 *   - **No deadlock.** With (a) the round-end checklist, `titanDies`, and every Behavior result
 *     would sit half-applied behind an absent player. A round could not end, and Undo would have
 *     nothing coherent to take back. With (b) the step that posts a prompt finishes immediately; an
 *     unanswered prompt is just a card in the log with its button still waiting.
 *   - **Undo stays meaningful.** The posting step records only the prompt's *message*
 *     (`Recorder#message`), and each answer records its own ops on that message
 *     (`PROMPT_OPS_FLAG`). Undoing the step reverts every answer that has landed and then deletes
 *     the card (src/tracker/recorder.ts, revertOps); undoing one answer takes back exactly the harm
 *     that answer caused and leaves the rest of the step alone. The two directions compose, and
 *     nothing is ever half-applied.
 *
 * Who does what: the asked player's client **rolls** (that is the whole point of the change), and
 * the active GM's client **applies**, through the guarded proxy (src/dice/proxy.ts, the `prompt`
 * extension). The GM's client works every consequence out from the rules and the card's own data;
 * the only thing it takes from a player's request is the faces their dice showed, exactly as it
 * already takes the dice of any roll card they post.
 */
import { SYSTEM_ID } from '../config.ts';
import type { TrackerOp } from '../rules/engagement/round.ts';
import { FLAG, type ActionCard, type Card, type PromptCard } from './card.ts';
import { clock, postCard, saveCard, t } from './post.ts';
import { extViaGM, registerProxyExtension } from './proxy.ts';
import {
  allAnswered,
  claimEntry,
  dueAt,
  newEntry,
  openEntries,
  pressRefusal,
  PROMPT_TIMEOUT_DEFAULT,
  releaseEntry,
  resolveEntry,
  timedOut,
  type PromptAsk,
  type PromptBy,
  type PromptEntry,
} from './prompt-state.ts';
import { showDice } from './terms.ts';

/** The ops one answer applied, kept on the prompt's own message so both Undo paths find them. */
export const PROMPT_OPS_FLAG = 'promptOps';

/**
 * The world setting the settings menu registers (see the package's report): the seconds after which
 * an unanswered prompt rolls itself, 0 for the default, which is to wait.
 */
export const PROMPT_TIMEOUT_SETTING = 'promptTimeout';

export { PROMPT_TIMEOUT_DEFAULT };

/** The timeout in force, or 0 while the setting is not registered yet (a world mid-upgrade). */
export function promptTimeout(): number {
  try {
    return Math.max(0, Number(game.settings.get(SYSTEM_ID, PROMPT_TIMEOUT_SETTING) ?? 0));
  } catch {
    return 0;
  }
}

export interface PromptRoll {
  /** A fixed prompt's dice, in the order the resolver reads them. */
  faces?: number[];
  /** An action prompt's answer: the roll card it posted. */
  message?: string;
}

export interface PromptContext {
  message: any;
  card: PromptCard;
  entry: PromptEntry;
  index: number;
  by: PromptBy;
}

export interface PromptResolver {
  /** How many D6 the fixed roll throws. 0 (the default for an action prompt) rolls nothing here. */
  dice?: number;
  /** Rolls the prompt on the asked user's client. The default throws `dice` D6 in the open. */
  roll?(ctx: PromptContext): Promise<PromptRoll | null>;
  /** Applies the answer on the active GM's client: the line the card shows, and the ops Undo takes back. */
  apply(ctx: PromptContext, roll: PromptRoll): Promise<{ line: string; ops: TrackerOp[] } | null>;
}

const resolvers = new Map<PromptAsk, PromptResolver>();

/** The tracker registers how each kind of prompt is rolled and applied (src/tracker/requests.ts). */
export const registerPromptResolver = (ask: PromptAsk, resolver: PromptResolver) => resolvers.set(ask, resolver);

const cardOfMessage = (message: any): PromptCard | null => {
  const card = message?.getFlag?.(SYSTEM_ID, FLAG) as Card | undefined;
  return card?.kind === 'prompt' ? card : null;
};

const isGM = () => !!game.user?.isGM;
const now = () => Date.now();

// ---------------------------------------------------------------- posting

export interface PromptAsked {
  /** The soldier asked: its actor document. */
  actor: any;
  /** What is at stake for them, one line (their Health, the Position they fell from). */
  detail: string;
}

export interface PromptOptions {
  ask: PromptAsk;
  mode?: 'fixed' | 'action';
  combat: string;
  /** What is happening, and why, already in the reader's language. */
  title: string;
  cause: string;
  /** What each button throws ("a D6 on the steam table"). */
  rolls: string;
  asked: PromptAsked[];
  /** What the GM's client needs to work the answers out. */
  data?: Record<string, unknown>;
  /** Whose name and portrait the card carries (the dying Titan, the falling soldier). */
  speaker?: any;
}

/** Posts one prompt card, with a button for every soldier it asks. Returns the message, or null. */
export async function postPrompt(opts: PromptOptions): Promise<any> {
  const asked = opts.asked.filter((a) => a.actor);
  if (!asked.length) return null;
  const speaker = opts.speaker ?? asked[0].actor;
  const timeout = promptTimeout();
  const card: PromptCard = {
    v: 1,
    kind: 'prompt',
    actor: speaker?.uuid ?? '',
    actorName: speaker?.name ?? '',
    img: speaker?.img ?? '',
    time: clock(),
    ops: [],
    ask: opts.ask,
    mode: opts.mode ?? 'fixed',
    combat: opts.combat,
    title: opts.title,
    cause: opts.cause,
    rolls: opts.rolls,
    entries: asked.map((a) => newEntry({ actor: a.actor.uuid, actorId: a.actor.id, name: a.actor.name, detail: a.detail })),
    data: opts.data ?? {},
    due: dueAt(now(), timeout),
    closed: false,
  };
  const message = await postCard(speaker, card, [], 'public');
  armTimeout(message);
  return message;
}

// ---------------------------------------------------------------- the buttons

const ownsActor = (uuid: string, user: any = game.user): boolean => !!foundry.utils.fromUuidSync(uuid, { strict: false })?.testUserPermission?.(user, 'OWNER');

const asker = () => ({ userId: game.user.id, isGM: isGM(), owns: (uuid: string) => ownsActor(uuid) });

/** Does a player (not a GM) own this soldier? A GM's own roll on it is then a roll for them. */
function ownedByAPlayer(uuid: string): boolean {
  const actor = foundry.utils.fromUuidSync(uuid, { strict: false });
  return !!actor && [...(game.users ?? [])].some((u: any) => !u.isGM && actor.testUserPermission?.(u, 'OWNER'));
}

/** One press at a time per card row, so a double click never rolls twice on this client either. */
const pressing = new Set<string>();

/**
 * A button on a prompt card. `forThem` is the GM's "roll it for them": the GM rolls the player's
 * die on the GM's client and the answer is marked as theirs.
 */
export async function pressPrompt(message: any, index: number, forThem = false): Promise<void> {
  const key = `${message.id}:${index}`;
  if (pressing.has(key)) return;
  pressing.add(key);
  try {
    const card = cardOfMessage(message);
    if (!card) return;
    const why = pressRefusal(card.entries, index, asker(), now());
    if (why) {
      ui.notifications.warn(why);
      return;
    }
    // A GM rolling a soldier a player owns is always "for them", however they pressed it.
    const by: PromptBy = forThem || (isGM() && ownedByAPlayer(card.entries[index].actor)) ? 'gm' : 'owner';
    await answerPrompt(message, card, index, by);
  } finally {
    pressing.delete(key);
  }
}

/** Rolls the entry here and has it applied: by the GM's client itself, or through the proxy. */
async function answerPrompt(message: any, card: PromptCard, index: number, by: PromptBy): Promise<void> {
  const resolver = resolvers.get(card.ask);
  if (!resolver) {
    ui.notifications.error(t('WOF.Prompt.noResolver'));
    return;
  }
  if (!(await send(message, { op: 'claim', index }))) return;
  const entry = card.entries[index];
  let roll: PromptRoll | null = null;
  try {
    roll = resolver.roll ? await resolver.roll({ message, card, entry, index, by }) : { faces: await fixedDice(resolver.dice ?? 1) };
  } catch (err) {
    console.error('wings-of-freedom | a prompt could not be rolled', err);
  }
  if (!roll) {
    await send(message, { op: 'release', index });
    return;
  }
  const ok = await send(message, { op: 'answer', index, by, faces: roll.faces ?? [], answer: roll.message ?? '' });
  if (!ok) await send(message, { op: 'release', index });
}

/** The fixed roll: plain D6s, thrown in the open on the client that pressed the button. */
export async function fixedDice(n: number): Promise<number[]> {
  if (n <= 0) return [];
  const roll = await new foundry.dice.Roll(`${n}d6`).evaluate();
  await showDice(roll);
  return roll.dice.flatMap((d: any) => d.results.map((r: any) => r.result as number)) as number[];
}

// ---------------------------------------------------------------- the request, and the GM's side

type PromptRequest =
  | { op: 'claim'; index: number }
  | { op: 'release'; index: number }
  | { op: 'answer'; index: number; by: PromptBy; faces: number[]; answer: string };

const send = async (message: any, req: PromptRequest): Promise<boolean> => (isGM() ? performPrompt({ message: message.id, ...req }, game.user) : extViaGM('prompt', { message: message.id, ...req }));

const faceOk = (x: unknown) => Number.isInteger(x) && (x as number) >= 1 && (x as number) <= 6;

/** Why this user may not ask the GM for this change, or null (the GM's own client never asks). */
export function promptRefusal(data: any, user: any): string | null {
  const message = game.messages.get(data?.message);
  const card = message ? cardOfMessage(message) : null;
  if (!card) return 'the prompt is gone';
  if (card.closed) return 'the prompt is closed';
  // Only a Flight is ever posted by a player, and only about their own soldier; every other prompt
  // carries data the GM's client acts on, so only a GM may author one.
  const author = message.author?.id ? game.users.get(message.author.id) : null;
  if (!author?.isGM && card.ask !== 'flight') return 'only the GM posts this prompt';
  const index = Number(data.index);
  const entry = card.entries[index];
  if (!entry) return 'no such prompt';
  if (!ownsActor(entry.actor, user)) return 'only the soldier’s owner rolls this';
  const why = pressRefusal(card.entries, index, { userId: user.id, isGM: false, owns: (uuid) => ownsActor(uuid, user) }, now());
  if (why) return why;
  if (data.op === 'answer') {
    if (data.by !== 'owner') return 'only the GM rolls for another player';
    if (!Array.isArray(data.faces) || data.faces.some((f: unknown) => !faceOk(f))) return 'the dice are not D6 results';
    if (card.mode === 'action' || data.answer) {
      const answer = game.messages.get(data.answer);
      if (!answer || answer.author?.id !== user.id) return 'the answer is not this user’s own roll';
      const answered = answer.getFlag(SYSTEM_ID, FLAG) as Card | undefined;
      if (card.mode === 'action' && (answered?.kind !== 'action' || answered.actor !== entry.actor)) return 'the answer is not a roll for this soldier';
    }
  } else if (data.op !== 'claim' && data.op !== 'release') return 'unknown prompt request';
  return null;
}

/** The GM's client: claims, releases, and applies an answer, writing the card itself. */
export async function performPrompt(data: any, user: any): Promise<boolean> {
  const message = game.messages.get(data?.message);
  const card = message ? cardOfMessage(message) : null;
  if (!card || !message) return false;
  const index = Number(data.index);
  if (!card.entries[index]) return false;
  if (data.op === 'claim') {
    await writePrompt(message, { ...card, entries: claimEntry(card.entries, index, user?.id ?? game.user.id, now()) });
    return true;
  }
  if (data.op === 'release') {
    await writePrompt(message, { ...card, entries: releaseEntry(card.entries, index) });
    return true;
  }
  if (data.op !== 'answer') return false;
  const resolver = resolvers.get(card.ask);
  if (!resolver) return false;
  const by = (data.by === 'gm' || data.by === 'timeout' ? data.by : 'owner') as PromptBy;
  const roll: PromptRoll = { faces: (data.faces ?? []) as number[], message: String(data.answer ?? '') };
  const out = await resolver.apply({ message, card, entry: card.entries[index], index, by }, roll);
  const fresh = cardOfMessage(message) ?? card;
  const entries = resolveEntry(fresh.entries, index, { by, faces: roll.faces, line: out?.line ?? t('WOF.Prompt.nothing'), message: roll.message });
  await writePrompt(message, { ...fresh, entries, closed: allAnswered(entries) });
  if (out?.ops?.length) await recordOpsOnMessage(message, out.ops);
  return true;
}

async function writePrompt(message: any, card: PromptCard): Promise<void> {
  await saveCard(message, card);
}

/**
 * Keeps ops with the message that caused them, so both Undo paths (the card's and the step's) find
 * them. A GM ruling (src/tracker/engine.ts) writes its ops on its own note the same way.
 */
export async function recordOpsOnMessage(message: any, ops: TrackerOp[]): Promise<void> {
  const held = (message.getFlag(SYSTEM_ID, PROMPT_OPS_FLAG) as TrackerOp[] | undefined) ?? [];
  await message.setFlag(SYSTEM_ID, PROMPT_OPS_FLAG, [...held, ...ops]);
}

/** The ops a prompt's answers applied, newest last (src/tracker/recorder.ts reads them for Undo). */
export const promptOpsOf = (message: any): TrackerOp[] => (message?.getFlag?.(SYSTEM_ID, PROMPT_OPS_FLAG) as TrackerOp[] | undefined) ?? [];

// ---------------------------------------------------------------- the optional timeout

const armed = new Set<string>();

/**
 * Waiting is the default (OWNER-DECISIONS, question 4). Only when the world switched a timeout on
 * does the active GM's client take the unanswered buttons over, and even then the GM's "roll it for
 * them" is the escape hatch the table is told about.
 */
export function armTimeout(message: any): void {
  const card = cardOfMessage(message);
  if (!card || card.closed || card.due === null || armed.has(message.id) || !game.user?.isActiveGM) return;
  armed.add(message.id);
  const wait = Math.max(0, card.due - now());
  setTimeout(() => void fireTimeout(message.id), wait + 250);
}

async function fireTimeout(id: string): Promise<void> {
  armed.delete(id);
  const message = game.messages.get(id);
  const card = message ? cardOfMessage(message) : null;
  if (!card || card.closed || !game.user?.isActiveGM) return;
  for (const index of timedOut(card.entries, card.due, now())) {
    const fresh = cardOfMessage(message);
    if (!fresh || !openEntries(fresh.entries, now()).includes(index)) continue;
    await answerPrompt(message, fresh, index, 'timeout');
  }
}

/** Registered by the tracker with the rest of the proxy extensions (src/tracker/requests.ts). */
export function registerPrompts(): void {
  registerProxyExtension('prompt', {
    refusal: (data, user) => promptRefusal(data, user),
    perform: (data, user) => performPrompt(data, user),
  });
  Hooks.on('createChatMessage', (message: any) => armTimeout(message));
  Hooks.once('ready', () => {
    for (const m of [...(game.messages ?? [])].slice(-40)) armTimeout(m);
  });
}

/** The entry an action prompt's roll answers for, so a resolver can read the card it posted. */
export const answerCardOf = (roll: PromptRoll): ActionCard | null => {
  const message = roll.message ? game.messages.get(roll.message) : null;
  const card = message?.getFlag(SYSTEM_ID, FLAG) as Card | undefined;
  return card?.kind === 'action' ? card : null;
};
