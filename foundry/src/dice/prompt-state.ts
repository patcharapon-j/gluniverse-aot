/**
 * The prompt card's state machine (batch C), kept free of Foundry globals so it can be tested.
 *
 * A prompt card names what is happening, why, and to whom, and carries one button per soldier it
 * asks. Each button walks the same four steps:
 *
 *   posted -> claimed -> done, by the soldier's owner
 *   posted -> done, by the GM's "roll it for them"
 *   posted -> done, by the timeout, when the world switched one on
 *
 * A claim is what stops two clicks (or the timeout and a click) rolling the same die twice. It is
 * held by a user id and a time, and goes stale, so a client that drops out never holds a prompt
 * shut: after CLAIM_STALE the entry is open again and the GM (or the owner) can take it.
 */

export type PromptAsk = 'steam' | 'fall' | 'injury' | 'gas' | 'flight';

export type PromptEntryState = 'waiting' | 'claimed' | 'done';

/** How an entry was answered. */
export type PromptBy = 'owner' | 'gm' | 'timeout';

export interface PromptEntry {
  /** The soldier the roll is about: its uuid, and its actor id for the tracker. */
  actor: string;
  actorId: string;
  name: string;
  /** One line of what is at stake for them (their Health, the Position they fell from). */
  detail: string;
  state: PromptEntryState;
  by: PromptBy | null;
  /** The user holding the claim, and when they took it (epoch ms). */
  claimedBy: string;
  claimedAt: number;
  /** The faces the fixed roll gave. */
  faces: number[];
  /** What the answer did, as the card shows it. */
  line: string;
  /** The roll card an action prompt's answer posted. */
  message: string;
}

/** A claim older than this is abandoned: its client never came back. */
export const CLAIM_STALE = 20_000;

/** The default timeout the setting offers when a table switches one on (OWNER-DECISIONS, question 4). */
export const PROMPT_TIMEOUT_DEFAULT = 60;

export const newEntry = (x: { actor: string; actorId: string; name: string; detail: string }): PromptEntry => ({
  ...x,
  state: 'waiting',
  by: null,
  claimedBy: '',
  claimedAt: 0,
  faces: [],
  line: '',
  message: '',
});

/** Is this entry still waiting on someone (a stale claim counts as waiting)? */
export function entryOpen(entry: PromptEntry, now: number): boolean {
  if (entry.state === 'done') return false;
  if (entry.state === 'claimed') return now - entry.claimedAt >= CLAIM_STALE;
  return true;
}

export const openEntries = (entries: readonly PromptEntry[], now: number): number[] => entries.map((e, i) => (entryOpen(e, now) ? i : -1)).filter((i) => i >= 0);

export const allAnswered = (entries: readonly PromptEntry[]): boolean => entries.every((e) => e.state === 'done');

export interface PromptAsker {
  userId: string;
  isGM: boolean;
  /** Does this user own the actor at this uuid? */
  owns(uuid: string): boolean;
}

/**
 * Why this user may not roll this entry now, or null. The GM is never blocked: they may roll any
 * entry for the player it names, which is the card's escape hatch.
 */
export function pressRefusal(entries: readonly PromptEntry[], index: number, who: PromptAsker, now: number): string | null {
  const entry = entries[index];
  if (!entry) return 'no such prompt';
  if (entry.state === 'done') return 'the roll was already made';
  if (!who.isGM && !who.owns(entry.actor)) return 'only the soldier’s owner rolls this';
  if (!entryOpen(entry, now) && entry.claimedBy !== who.userId) return 'someone is rolling it';
  return null;
}

const put = (entries: readonly PromptEntry[], index: number, next: PromptEntry): PromptEntry[] => entries.map((e, i) => (i === index ? next : e));

/** Takes the entry, so a second click and the timeout leave it alone while the die is in the air. */
export function claimEntry(entries: readonly PromptEntry[], index: number, userId: string, now: number): PromptEntry[] {
  const entry = entries[index];
  if (!entry || entry.state === 'done') return [...entries];
  return put(entries, index, { ...entry, state: 'claimed', claimedBy: userId, claimedAt: now });
}

/** Gives a claim back (the roll dialog was cancelled, the request was refused). */
export function releaseEntry(entries: readonly PromptEntry[], index: number): PromptEntry[] {
  const entry = entries[index];
  if (!entry || entry.state !== 'claimed') return [...entries];
  return put(entries, index, { ...entry, state: 'waiting', claimedBy: '', claimedAt: 0 });
}

export function resolveEntry(entries: readonly PromptEntry[], index: number, x: { by: PromptBy; faces?: number[]; line: string; message?: string }): PromptEntry[] {
  const entry = entries[index];
  if (!entry) return [...entries];
  return put(entries, index, { ...entry, state: 'done', by: x.by, faces: x.faces ?? entry.faces, line: x.line, message: x.message ?? entry.message, claimedBy: '', claimedAt: 0 });
}

/** When the card's unanswered buttons roll themselves, or null when waiting is the default. */
export function dueAt(posted: number, timeoutSeconds: number): number | null {
  return timeoutSeconds > 0 ? posted + timeoutSeconds * 1000 : null;
}

/** The entries the timeout takes over, which is none until the due time has passed. */
export function timedOut(entries: readonly PromptEntry[], due: number | null, now: number): number[] {
  if (due === null || now < due) return [];
  return openEntries(entries, now);
}
