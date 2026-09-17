/**
 * Tracker notes in the chat log: a one-line header and a few plain lines (the round's events, what the
 * table still rolls by hand). Kept in message flags and drawn in the Personnel File card style.
 */
import { SYSTEM_ID } from '../config.ts';

export const NOTE_FLAG = 'note';

export interface Note {
  title: string;
  lines: string[];
  /** A Titan's event (the red header). */
  titan?: boolean;
  round?: number;
}

const esc = (s: unknown) => foundry.utils.escapeHTML(String(s ?? ''));

export const tr = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(`WOF.Tracker.${key}`, data) : game.i18n.localize(`WOF.Tracker.${key}`));

export async function postNote(note: Note, opts: { gmOnly?: boolean } = {}): Promise<any> {
  const Msg = foundry.utils.getDocumentClass('ChatMessage');
  const data: Record<string, any> = {
    author: game.user.id,
    speaker: { alias: tr('title') },
    content: `<p class="wof-summary">${esc(note.title)}${note.lines.length ? `: ${esc(note.lines.join(' '))}` : ''}</p>`,
    flags: { [SYSTEM_ID]: { [NOTE_FLAG]: note } },
  };
  if (opts.gmOnly) data.whisper = game.users.filter((u: any) => u.isGM).map((u: any) => u.id);
  return Msg.create(data);
}

export function registerNotes(): void {
  Hooks.on('renderChatMessageHTML', (message: any, html: HTMLElement) => {
    const note = message.getFlag?.(SYSTEM_ID, NOTE_FLAG) as Note | undefined;
    if (!note) return;
    const content = html.querySelector('.message-content');
    if (!content) return;
    html.classList.add('wof-card-msg', 'wof-note-msg');
    content.innerHTML = `<article class="wof-note${note.titan ? ' titanic' : ''}"><header><strong>${esc(note.title)}</strong>${note.round ? `<time>${esc(tr('roundShort', { n: note.round }))}</time>` : ''}</header>${
      note.lines.length ? `<div class="body">${note.lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>` : ''
    }</article>`;
  });
}
