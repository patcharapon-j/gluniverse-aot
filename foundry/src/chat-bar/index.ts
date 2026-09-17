/**
 * A compact dice-pool bar above the chat input (the sidebar's chat form, or the popped-out chat):
 * steppers for Base, Gear, Stress, and Titan dice, Roll, and Reset. Foundry v14 moves its one chat
 * input between the chat form and the notification area and fires renderChatInput each time; the
 * bar follows the input into a chat form and stays out of the notification area.
 */
import { iconPath } from '../art.ts';
import { t } from '../dice/post.ts';
import type { DieKind } from '../rules/roll.ts';
import { BAR_KINDS, emptyCounts, MAX_PER_KIND, poolSize, stepCount, type BarCounts } from './pool.ts';
import { rollBarPool } from './roll.ts';

const ICONS: Record<DieKind, string> = { base: 'die-base', gear: 'die-gear', stress: 'die-stress', titan: 'die-titan-attack' };

let counts: BarCounts = emptyCounts();
let bar: HTMLElement | null = null;
let rolling = false;

const esc = (s: string) => foundry.utils.escapeHTML(s);
const kindName = (kind: DieKind) => t(`WOF.Roll.die.${kind}Dice`);

function build(): HTMLElement {
  const el = document.createElement('section');
  el.className = 'wof-chatbar';
  el.setAttribute('aria-label', t('WOF.ChatBar.label'));
  const kinds = BAR_KINDS.map((kind) => {
    const name = kindName(kind);
    return `<div class="cb-kind" data-kind="${kind}">
  <button type="button" class="cb-step" data-kind="${kind}" data-delta="-1" aria-label="${esc(t('WOF.ChatBar.remove', { kind: name }))}">−</button>
  <button type="button" class="cb-die" data-kind="${kind}" data-delta="1" aria-label="${esc(t('WOF.ChatBar.add', { kind: name }))}" data-tooltip="${esc(`${name}. ${t('WOF.ChatBar.hint')}`)}">
    <img src="${iconPath(ICONS[kind])}" alt=""><output class="cb-n" data-kind="${kind}">0</output>
  </button>
  <button type="button" class="cb-step" data-kind="${kind}" data-delta="1" aria-label="${esc(t('WOF.ChatBar.add', { kind: name }))}">+</button>
</div>`;
  }).join('');
  el.innerHTML = `<div class="cb-kinds">${kinds}</div>
<div class="cb-acts">
  <button type="button" class="cb-roll" data-act="roll">${esc(t('WOF.ChatBar.roll'))}</button>
  <button type="button" class="cb-reset" data-act="reset" aria-label="${esc(t('WOF.ChatBar.reset'))}" data-tooltip="${esc(t('WOF.ChatBar.reset'))}"><i class="fa-solid fa-rotate-left" inert></i></button>
</div>`;

  el.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!button || button.disabled) return;
    event.preventDefault();
    if (button.dataset.kind) step(button.dataset.kind as DieKind, Number(button.dataset.delta));
    else if (button.dataset.act === 'reset') set(emptyCounts());
    else if (button.dataset.act === 'roll') void roll();
  });
  // A right-click on a die takes one away.
  el.addEventListener('contextmenu', (event) => {
    const die = (event.target as HTMLElement).closest<HTMLButtonElement>('button.cb-die');
    if (!die) return;
    event.preventDefault();
    event.stopPropagation();
    step(die.dataset.kind as DieKind, -1);
  });
  sync(el);
  return el;
}

function step(kind: DieKind, delta: number) {
  set(stepCount(counts, kind, delta));
}

function set(next: BarCounts) {
  counts = next;
  if (bar) sync(bar);
}

function sync(el: HTMLElement) {
  const total = poolSize(counts);
  for (const kind of BAR_KINDS) {
    const n = counts[kind];
    const out = el.querySelector<HTMLOutputElement>(`output[data-kind="${kind}"]`);
    if (out) out.value = String(n);
    el.querySelector(`.cb-kind[data-kind="${kind}"]`)?.classList.toggle('set', n > 0);
    for (const b of el.querySelectorAll<HTMLButtonElement>(`button[data-kind="${kind}"]`)) {
      b.disabled = Number(b.dataset.delta) < 0 ? n <= 0 : n >= MAX_PER_KIND;
    }
  }
  const rollButton = el.querySelector<HTMLButtonElement>('.cb-roll');
  if (rollButton) {
    rollButton.disabled = rolling || total === 0;
    rollButton.textContent = total ? t('WOF.ChatBar.rollN', { n: total }) : t('WOF.ChatBar.roll');
  }
  const reset = el.querySelector<HTMLButtonElement>('.cb-reset');
  if (reset) reset.disabled = total === 0;
}

async function roll() {
  if (rolling) return;
  rolling = true;
  if (bar) sync(bar);
  try {
    await rollBarPool(counts);
  } catch (err) {
    console.error('wings-of-freedom | the chat bar roll failed', err);
    ui.notifications.error(t('WOF.Roll.actionFailed'));
  } finally {
    rolling = false;
    if (bar) sync(bar);
  }
}

/** Puts the bar just above the chat input while the input sits in a chat form; takes it away otherwise. */
function place(input: HTMLElement | null | undefined) {
  if (!input) return;
  bar ??= build();
  if (!input.closest('.chat-form')) {
    bar.remove();
    return;
  }
  if (input.previousElementSibling !== bar) input.before(bar);
}

export function registerChatBar(): void {
  Hooks.on('renderChatInput', (_app: unknown, elements: Record<string, HTMLElement>) => place(elements?.['#chat-message']));
}
