/**
 * Roll cards: the state a chat message keeps in its flags, and the HTML the chat log shows,
 * rebuilt from those flags on every render (ADR-0026, ADR-0027; the locked card in
 * foundry/design/preview-v2-1-personnel-file.html). A one-line header, the dice as icons grouped by
 * kind with successes lit and 1s marked, a big count, Stakes only when set, small Push and Cover,
 * the Stress Response line, and the "Applied" line with Undo.
 */
import { actionIcon, entryIcon, iconPath } from '../art.ts';
import { faceLabel, kindPreset } from './kinds.ts';
import type { PromptAsk, PromptEntry } from './prompt-state.ts';
import { attackResult, finalSuccesses, rawSuccesses, undoButton, type DiceFaces, type DieKind, type Op } from '../rules/roll.ts';

export const FLAG = 'card';

export interface CardPool {
  attribute: { id: string; dice: number } | null;
  talent: { name: string; dice: number } | null;
  bonus: number;
  /** Base dice removed by penalties and a minus step, from Bonus Dice, then Talent dice, then the attribute. */
  removed: { bonus: number; talent: number; attribute: number };
  base: number;
  gear: { id?: string; itemId: string; name: string; dice: number } | null;
  stress: number;
  /** One line of what built the pool, for the header tooltip. */
  why: string;
}

export interface ResponseRoll {
  d6: number;
  stress: number;
  resolve: number;
  /** Iron Nerve or Steady Heart: Resolve counts this much higher. */
  bonus: number;
  total: number;
  row: string;
  name: string;
  lasting: boolean;
  text: string;
  effects: { type: string; amount?: number; dice?: number }[];
  lines: string[];
  rerolled: boolean;
}

interface CardBase {
  v: 1;
  actor: string;
  actorName: string;
  img: string;
  time: string;
  ops: Op[];
}

export interface ActionCard extends CardBase {
  kind: 'action';
  entry: string;
  name: string;
  attribute: string | null;
  called: boolean;
  stakes: { id: string; text: string } | null;
  circumstances: { id: string; name: string } | null;
  needs: number | null;
  passive: boolean;
  pool: CardPool;
  dice: DiceFaces;
  /** Index of the Stress Die the last Push added, or -1. */
  fresh: number;
  pushes: number;
  maxPushes: number;
  pushAllowed: boolean;
  coverAllowed: boolean;
  responses: boolean;
  cover: { actor: string; name: string } | null;
  response: ResponseRoll | null;
  /** A dodge made against a Titan attack card. */
  attack: { message: string; name: string; severity: number } | null;
  /** A Death Roll: the injury rolled for. */
  injury: { name: string; penalty: number } | null;
  /** The GM's call card this roll answers. */
  call: string | null;
  /** What the roll is made against in the running engagement. */
  target?: RollTarget | null;
  /** Titan Dice in an ad hoc pool (the chat bar): kept as rolled, successes on 5 and 6. */
  titan?: number[];
}

export interface TableCard extends CardBase {
  kind: 'table';
  table: 'fear' | 'stress-response';
  trigger: string | null;
  response: ResponseRoll;
  /** A Fear result shrugged off by the Drive. */
  shrugged: boolean;
  gasRoll: boolean;
}

export interface GasCard extends CardBase {
  kind: 'gas';
  faces: number[];
  lost: number;
  from: number;
  to: number;
  lightTrigger: boolean;
}

/**
 * A Focus Titan's card, laid out for the GM before any dice (ADR-0019, deferred roll): what the
 * behavior is, whom it is against, and the Attack Dice waiting to be rolled. Whispered to the GMs,
 * so nothing is given away; the GM opens the roll dialog from it and may override any of it.
 */
export interface BehaviorCard extends CardBase {
  kind: 'behavior';
  combat: string;
  /** The Focus Titan's token key and its board label. */
  key: string;
  label: string;
  entry: string;
  name: string;
  tier: string;
  /** The Next Behavior as rolled, when the choose step or the GM took another entry. */
  rolledEntry: string;
  rolledName: string;
  holder: { actor: string; name: string } | null;
  rung: string;
  position: string;
  attackDice: number | null;
  effects: string[];
  targets: { actor: string; name: string }[];
  /** Dodges already made against this Titan this round, which cancel against this card too. */
  reactions: { actor: string; name: string; successes: number; message: string }[];
  /** The attack card this one rolled, 'none' when the GM resolved it without dice, or null. */
  rolled: string | null;
}

export interface AttackCard extends CardBase {
  kind: 'attack';
  entry: string;
  name: string;
  tier: string;
  faces: number[];
  severity: number;
  effects: string[];
  critical: boolean;
  targets: { actor: string; name: string }[];
  reactions: { actor: string; name: string; successes: number; message: string }[];
  /** The Focus Titan whose card rolled it, when the tracker rolled it. */
  titan?: { combat: string; key: string; label: string };
}

/** What a roll is made against in an engagement (foundry/docs/tracker-plan.md, section 5). */
export interface RollTarget {
  combat: string;
  /** The Focus Titan's token id. */
  titan?: string;
  part?: string;
  decoy?: string;
  /** Openings spent on a Nape strike. */
  openings?: number;
  /** A Foe's token id, and whether the Fight is a Grapple. */
  foe?: string;
  grapple?: boolean;
  /** Break Free made on a Grabbed comrade's behalf (Pry Loose). */
  forSoldier?: string;
}

export interface CallCard extends CardBase {
  kind: 'call';
  entry: string | null;
  attribute: string | null;
  label: string;
  circumstances: { id: string; name: string };
  stakes: { id: string; text: string };
  needs: number;
  rolled: string | null;
}

/** A Lifepath roll (the wizard): a D66, a performance roll, an Exam order roll, or a Trial. */
export interface LifepathCard extends CardBase {
  kind: 'lifepath';
  /** The step's title, as the header shows it. */
  title: string;
  glyph: string;
  /** A D66: tens, then units. */
  d66: [number, number] | null;
  /** Plain D6s (the Exam order). */
  plain: number[];
  /** Pool dice by kind (a performance roll or a Trial). */
  dice: DiceFaces | null;
  fresh: number;
  pushes: number;
  big: string;
  label: string;
  text: string;
  lines: string[];
  /** Short header flags (Pushed, Covered). */
  flags: string[];
  /** The roll's result is struck (an Origin rolled again). */
  struck: boolean;
}

/** A Foe's attack or Guard in a Skirmish (skirmish.yaml, attack). */
export interface FoeAttackCard extends CardBase {
  kind: 'foe-attack';
  combat: string;
  foe: string;
  weapon: string;
  usedWith: 'fight' | 'shoot';
  faces: number[];
  severity: number;
  target: { actor: string; name: string } | null;
  cancel: boolean;
  reactions: { actor: string; name: string; successes: number; message: string }[];
}

/**
 * A prompt card (ADR-0026 as amended, batch C): what is happening, why, and to whom, with a button
 * per soldier that only that soldier's owner (and the GM) may press. A fixed prompt's button rolls
 * its die where it is pressed; an action prompt's button opens the ordinary roll dialog. The GM's
 * "roll it for them" sits beside every unanswered button, so a prompt never blocks the table.
 */
export interface PromptCard extends CardBase {
  kind: 'prompt';
  ask: PromptAsk;
  /** A fixed roll takes no Push, Help or Stress Dice; an action roll opens the dialog. */
  mode: 'fixed' | 'action';
  /** The engagement the answer is applied to. */
  combat: string;
  /** The one line of what is happening, and the cause under it. */
  title: string;
  cause: string;
  /** What the button throws, named for the table it is read on. */
  rolls: string;
  entries: PromptEntry[];
  /** What the GM's client needs to work each answer out. Written by the card's author, never by an answer. */
  data: Record<string, unknown>;
  /** When unanswered buttons roll themselves (the optional timeout setting), or null: the default is to wait. */
  due: number | null;
  closed: boolean;
}

export type Card = ActionCard | TableCard | GasCard | AttackCard | BehaviorCard | CallCard | LifepathCard | FoeAttackCard | PromptCard;

/** What the viewer may do on this card, decided by the chat code from permissions. */
export interface CardViewer {
  isGM: boolean;
  /** Owns the rolling actor (or is the GM). */
  owner: boolean;
  /** Owns another soldier who could Cover. */
  canCover: boolean;
  /** The viewer's own soldier is the one Covering. */
  coveringMine: boolean;
  /** Owns a soldier the attack could be dodged by. */
  canDodge: boolean;
  /** Holds Gallows Humour, unused. */
  gallows: boolean;
  /** A Drive can still shrug the Fear result off. */
  drive: boolean;
  pushBlock: string | null;
  /** The reason text is informative (Stress 1, Down, all 6s) rather than a silent end. */
  showBlock: boolean;
  /** A prompt card: the actor uuids this viewer owns, so only their own buttons are live. */
  promptOwn?: string[];
}

type T = (key: string, data?: Record<string, unknown>) => string;

export const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const icon = iconPath;

// ---------------------------------------------------------------- dice icons (ported from the locked preview)

const PIPS: Record<number, [number, number][]> = {
  1: [[12, 12]],
  2: [[7, 7], [17, 17]],
  3: [[7, 7], [12, 12], [17, 17]],
  4: [[7, 7], [17, 7], [7, 17], [17, 17]],
  5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]],
  6: [[7, 6.5], [17, 6.5], [7, 12], [17, 12], [7, 17.5], [17, 17.5]],
};

/** The plain D6 (table and Lifepath rolls), drawn with pips as Dice So Nice's standard d6 is. */
const PLAIN = {
  shape: '<rect x="1" y="1" width="22" height="22" rx="3" fill="#f1e8d4" stroke="#4f463d" stroke-width="1.4"/><rect x="2.5" y="2.5" width="19" height="4" rx="1.5" fill="#fff" opacity=".5"/>',
  pip: '#241f1b',
};

/** Each kind's tile, in its Dice So Nice body colour (src/dice/kinds.ts), with a darker rim and a highlight. */
const TILE: Record<DieKind, string> = {
  base: `<rect x="1" y="1" width="22" height="22" rx="3" fill="${kindPreset('base').colorset.background}" stroke="#4f463d" stroke-width="1.4"/><rect x="2.5" y="2.5" width="19" height="3" rx="1.5" fill="#fff" opacity=".45"/>`,
  gear: `<path d="M6 1h12l5 5v12l-5 5H6l-5-5V6z" fill="${kindPreset('gear').colorset.background}" stroke="#1f2225" stroke-width="1.4"/><path d="M6.5 2.5h11l1.5 1.5h-14z" fill="#aeb6bd" opacity=".6"/>`,
  stress: `<rect x="1" y="1" width="22" height="22" rx="6" fill="${kindPreset('stress').colorset.background}" stroke="#4a0f0f" stroke-width="1.4"/><path d="M5 5q3-2.5 8-2.5" stroke="#d27a6a" stroke-width="1.4" fill="none" opacity=".7"/>`,
  titan: `<rect x="1" y="1" width="22" height="22" rx="8" fill="${kindPreset('titan').colorset.background}" stroke="#6b2a22" stroke-width="1.4"/><path d="M6 18q2 1.6 4 .8M15 4.6q2 0 3 1.8" stroke="#9c5a4a" stroke-width="1" fill="none" opacity=".7"/>`,
};

/** A face as the 3D die shows it: its label art, or, on a blank face, the number small in the kind's ink. */
function faceArt(kind: DieKind, face: number): string {
  const label = faceLabel(kind, face);
  if (label) return `<image href="${esc(label)}" x="2" y="2" width="20" height="20" preserveAspectRatio="xMidYMid meet"/>`;
  const ink = kindPreset(kind).colorset.foreground;
  return `<text x="12" y="12.5" text-anchor="middle" dominant-baseline="central" fill="${ink}" opacity=".78" style="font:700 10px var(--fd, Georgia, serif)">${face}</text>`;
}

/**
 * One die as an inline SVG icon. A kind's die wears the same face art as its Dice So Nice die, on a
 * tile in its body colour, with the face value in its label and tooltip; a plain D6 shows pips.
 * Success is lit, a Stress 1 ringed, a pushed Gear 1 locked.
 */
export function dieIcon(t: T, kind: DieKind, face: number, flags: { locked?: boolean; fresh?: boolean; plain?: boolean; quiet?: boolean } = {}): string {
  const hit = !flags.plain && (kind === 'titan' ? face >= 5 : face === 6);
  // A passive roll's Stress Die 1 does nothing (dice-pool.yaml, passive-roll), so it is not marked.
  const s1 = !flags.plain && !flags.quiet && face === 1 && kind === 'stress';
  const art = flags.plain
    ? PLAIN.shape + (PIPS[face] ?? []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${face === 1 ? 2.8 : 2.1}" fill="${PLAIN.pip}"/>`).join('')
    : TILE[kind] + faceArt(kind, face);
  const bits = [flags.plain ? 'D6' : t(`WOF.Roll.die.${kind}`), t('WOF.Roll.aria.face', { face })];
  if (hit) bits.push(t('WOF.Roll.aria.success'));
  if (s1) bits.push(t('WOF.Roll.aria.stressOne'));
  if (flags.locked) bits.push(t('WOF.Roll.aria.locked'));
  if (flags.fresh) bits.push(t('WOF.Roll.aria.fresh'));
  const label = esc(bits.join(', '));
  const one = !flags.plain && face === 1 && !flags.quiet && (kind === 'gear' || kind === 'stress');
  const cls = ['die', flags.plain ? 'plain' : kind, hit ? 'hit' : 'miss', one ? 'one' : '', flags.locked ? 'locked' : '', flags.fresh ? 'fresh' : ''].filter(Boolean).join(' ');
  return `<span class="${cls}" role="img" aria-label="${label}" data-tooltip="${label}"><svg viewBox="0 0 24 24" aria-hidden="true">${art}</svg></span>`;
}

function dots(groups: [string, number][], label: string, why = ''): string {
  const inner = groups
    .filter(([, n]) => n > 0)
    .map(([cls, n]) => `<span class="grp">${Array.from({ length: n }, () => `<i class="${cls}"></i>`).join('')}</span>`)
    .join('');
  return `<span class="dots sm" role="img" aria-label="${esc(label)}"${why ? ` data-tooltip="${esc(why)}"` : ''}>${inner}</span>`;
}

function header(t: T, c: { img: string; name: string; time: string; who: string; glyph?: string }, extra: string, isGM: boolean, flag = ''): string {
  const glyph = c.glyph ? `<img class="act" src="${esc(c.glyph)}" alt="">` : '';
  const del = isGM ? `<a class="del" data-action="deleteMessage" aria-label="${esc(t('COMMON.Delete'))}"><i class="fa-solid fa-trash" inert></i></a>` : '';
  return `<header class="rc-h"><img class="av" src="${esc(c.img)}" alt="${esc(c.who)}" data-tooltip="${esc(c.who)}">${glyph}<strong data-tooltip="${esc(c.name)}">${esc(c.name)}</strong>${extra}${flag}<time>${esc(c.time)}</time>${del}</header>`;
}

function drow(kind: string, iconName: string, label: string, faces: string): string {
  return `<div class="drow" data-k="${kind}"><img src="${icon(iconName)}" alt="${esc(label)}" data-tooltip="${esc(label)}"><div class="dset">${faces}</div></div>`;
}

function appliedLine(t: T, ops: readonly Op[], v: CardViewer): string {
  if (!ops.length) return '';
  const done = ops.filter((o) => o.state !== 'pending');
  const pending = ops.filter((o) => o.state === 'pending');
  const which = undoButton(ops);
  const undone = done.length > 0 && done.every((o) => o.state === 'undone');
  let out = '';
  if (done.length) {
    const btn = v.owner && which ? `<button class="mini" type="button" data-wof-act="${which}">${esc(t(which === 'undo' ? 'WOF.Roll.undo' : 'WOF.Roll.redo'))}</button>` : '';
    out += `<div class="applied${undone ? ' undone' : ''}"><p><b>${esc(t('WOF.Roll.applied'))}</b>${done.map((o) => esc(o.label)).join('; ')}</p>${btn}</div>`;
  }
  if (pending.length) {
    const btn = v.owner ? `<button class="mini" type="button" data-wof-act="apply">${esc(t('WOF.Roll.apply'))}</button>` : '';
    out += `<div class="applied pending"><p><b>${esc(t('WOF.Roll.notApplied'))}</b>${pending.map((o) => esc(o.label)).join('; ')}</p>${btn}</div>`;
  }
  return out;
}

function responseLine(t: T, r: ResponseRoll | null, v: CardViewer): string {
  if (!r) return '';
  const title = t('WOF.Roll.responseMath', { d6: r.d6, stress: r.stress, resolve: r.resolve + r.bonus, total: r.total });
  const again = v.gallows && !r.rerolled ? `<button class="mini" type="button" data-wof-act="gallows">${esc(t('WOF.Roll.gallows'))}</button>` : '';
  return `<div class="sresp" data-tooltip="${esc(title)}"><img src="${icon('roll-stress')}" alt="${esc(t('WOF.Roll.response'))}"><strong>${esc(r.name)}</strong>${
    r.lasting ? `<span class="tag warn">${esc(t('WOF.Roll.lasting'))}</span>` : ''
  }<span class="fx">${esc(r.lines.join(' ') || r.text)}</span>${again}</div>`;
}

export function successesOf(c: ActionCard): number {
  const titan = (c.titan ?? []).filter((f) => f >= 5).length;
  return finalSuccesses(rawSuccesses(c.dice) + titan, c.response?.effects ?? []);
}

/** The result line beside the big count. */
export function outcomeText(t: T, c: ActionCard, s: number, deathRows?: { id: string; min: number | null; max: number | null }[]): { label: string; text: string; failed: boolean | null } {
  if (c.attack) {
    const r = attackResult(c.attack.severity, s);
    return {
      label: t('WOF.Roll.vsSeverity', { severity: c.attack.severity }),
      text: r.lands ? t('WOF.Roll.attackLands', { name: c.attack.name, net: r.net }) : t('WOF.Roll.attackMisses', { name: c.attack.name }),
      failed: r.lands,
    };
  }
  if (c.entry === 'death-roll' && deathRows) {
    const row = deathRows.find((x) => (x.min === null || s >= x.min) && (x.max === null || s <= x.max));
    return { label: t('WOF.Roll.ofNeeds', { needs: c.needs ?? 1 }), text: row ? t(`WOF.Roll.death.${row.id}`) : '', failed: s < (c.needs ?? 1) };
  }
  if (c.needs !== null) {
    const ok = s >= c.needs;
    return { label: t('WOF.Roll.ofNeeds', { needs: c.needs }), text: t(ok ? 'WOF.Roll.success' : 'WOF.Roll.fails'), failed: !ok };
  }
  return { label: t('WOF.Roll.successesLabel'), text: '', failed: null };
}

function actionCard(t: T, c: ActionCard, v: CardViewer, deathRows: { id: string; min: number | null; max: number | null }[]): string {
  const s = successesOf(c);
  const p = c.pool;
  const newStress = c.fresh >= 0 ? 1 : 0;
  const glyphs = dots(
    [
      ['da', (p.attribute?.dice ?? 0) - p.removed.attribute],
      ['dt', (p.talent?.dice ?? 0) - p.removed.talent],
      ['db', p.bonus - p.removed.bonus],
      ['dx', p.removed.bonus + p.removed.talent + p.removed.attribute],
      ['dg', c.dice.gear.length],
      ['ds', c.dice.stress.length],
      ['dtn', c.titan?.length ?? 0],
    ],
    t('WOF.Sheet.aria.pool', { base: c.dice.base.length, gear: c.dice.gear.length, stress: c.dice.stress.length }),
    p.why,
  );
  const flags = [
    c.pushes ? `<span class="flag">${esc(t(c.pushes > 1 ? 'WOF.Roll.pushedTwice' : 'WOF.Roll.pushed'))}</span>` : '',
    c.passive ? `<span class="flag">${esc(t('WOF.Roll.passive'))}</span>` : '',
    c.called ? `<span class="flag">${esc(t('WOF.Roll.called'))}</span>` : '',
  ].join('');
  const rows = [
    c.dice.base.length ? drow('base', 'die-base', t('WOF.Roll.die.baseDice'), c.dice.base.map((f) => dieIcon(t, 'base', f)).join('')) : '',
    c.dice.gear.length ? drow('gear', 'die-gear', `${t('WOF.Roll.die.gearDice')}: ${p.gear?.name ?? ''}`, c.dice.gear.map((f) => dieIcon(t, 'gear', f, { locked: f === 1 && c.pushes > 0 })).join('')) : '',
    c.dice.stress.length ? drow('stress', 'die-stress', t('WOF.Roll.die.stressDice'), c.dice.stress.map((f, i) => dieIcon(t, 'stress', f, { fresh: i === c.fresh, quiet: !c.responses })).join('')) : '',
    c.titan?.length ? drow('titan', 'die-titan-attack', t('WOF.Roll.die.titanDice'), c.titan.map((f) => dieIcon(t, 'titan', f)).join('')) : '',
  ].join('');
  const out = outcomeText(t, c, s, deathRows);
  const stakes = c.stakes ? `<p class="stakes"><b>${esc(t('WOF.Roll.stakes'))}</b>${esc(c.stakes.text)}</p>` : '';
  const circ = c.circumstances && c.circumstances.id !== 'standard' ? `<p class="stakes"><b>${esc(t('WOF.Roll.circumstances'))}</b>${esc(c.circumstances.name)}</p>` : '';
  const injury = c.injury ? `<p class="stakes"><b>${esc(t('WOF.Roll.injury'))}</b>${esc(c.injury.name)}${c.injury.penalty ? ` (−${c.injury.penalty})` : ''}</p>` : '';

  let acts = '';
  const moreAllowed = c.pushAllowed && c.pushes < c.maxPushes;
  if (moreAllowed && (v.owner || v.canCover || c.cover)) {
    const blocked = !!v.pushBlock;
    const push = v.owner
      ? `<button class="mini red" type="button" data-wof-act="push" ${blocked ? 'disabled' : ''}><img src="${icon('roll-push')}" alt="">${esc(t('WOF.Roll.push'))}</button>`
      : '';
    const coverLabel = c.cover ? t('WOF.Roll.coveredBy', { name: c.cover.name }) : t('WOF.Roll.cover');
    const coverOn = c.coverAllowed && (v.canCover || v.coveringMine) && !blocked;
    const cover = c.coverAllowed
      ? `<button class="mini${c.cover ? ' on' : ''}" type="button" data-wof-act="cover" aria-pressed="${!!c.cover}" ${coverOn ? '' : 'disabled'}>${esc(coverLabel)}</button>`
      : '';
    const note = blocked
      ? v.showBlock
        ? `<p class="block-why">${esc(v.pushBlock)}</p>`
        : ''
      : `<p class="block-why quiet">${esc(c.cover ? t('WOF.Roll.coverNote', { name: c.cover.name }) : t('WOF.Roll.pushNote'))}</p>`;
    if (push || cover) acts = `<div class="rc-a">${push}${cover}${note}</div>`;
  }
  const newGlyph = newStress ? ` data-fresh="1"` : '';
  const glyph = c.entry ? entryIcon({ id: c.entry, attribute: c.attribute }) : icon('die-base');
  return `${header(t, { img: c.img, name: c.name, time: c.time, who: c.actorName, glyph }, glyphs, v.isGM, flags)}
<div class="rc-b"${newGlyph}>
  <div class="dice">${rows}</div>
  <div class="result"><span class="big${out.failed ? ' none' : ''}">${s}</span><span class="rt"><b>${esc(out.label)}</b>${esc(out.text)}</span></div>
  ${stakes}${circ}${injury}${responseLine(t, c.response, v)}${appliedLine(t, c.ops, v)}${acts}
</div>`;
}

function tableCard(t: T, c: TableCard, v: CardViewer): string {
  const r = c.response;
  const title = c.table === 'fear' ? t('WOF.Roll.fear.title') : t('WOF.Roll.response');
  const math = `<span class="flag">${esc(t('WOF.Roll.tableMath', { stress: r.stress, resolve: r.resolve + r.bonus }))}</span>`;
  const iconName = c.table === 'fear' ? 'harm-fear' : 'roll-stress';
  const lines = r.lines.length ? `<p class="eff-line">${esc(r.lines.join(' '))}</p>` : '';
  const trigger = c.trigger ? `<p class="stakes"><b>${esc(t('WOF.Roll.fear.trigger'))}</b>${esc(c.trigger)}</p>` : '';
  const shrug = c.shrugged ? `<p class="stakes"><b>${esc(t('WOF.Roll.fear.drive'))}</b>${esc(t('WOF.Roll.fear.shrugged'))}</p>` : '';
  const buttons = [
    c.gasRoll && v.owner && !c.shrugged ? `<button class="mini" type="button" data-wof-act="gas"><img src="${icon('gear-gas-canister')}" alt="">${esc(t('WOF.Roll.gas.title'))}</button>` : '',
    v.drive && v.owner && !c.shrugged && c.table === 'fear' && r.effects.length ? `<button class="mini" type="button" data-wof-act="shrug">${esc(t('WOF.Roll.fear.shrug'))}</button>` : '',
    v.gallows && v.owner && !r.rerolled && c.table === 'stress-response' ? `<button class="mini" type="button" data-wof-act="gallows">${esc(t('WOF.Roll.gallows'))}</button>` : '',
  ].join('');
  const glyph = actionIcon(c.table === 'fear' ? 'fear-roll' : 'stress-response-roll');
  return `${header(t, { img: c.img, name: title, time: c.time, who: c.actorName, glyph }, math, v.isGM)}
<div class="rc-b">
  <div class="dice">${drow('d6', iconName, 'D6', dieIcon(t, 'base', r.d6, { plain: true }))}</div>
  <div class="result"><span class="big">${r.total}</span><span class="rt"><b>${esc(c.table === 'fear' ? t('WOF.Roll.fear.label') : t('WOF.Roll.response'))}</b>${esc(r.name)}${
    r.lasting ? ` <span class="tag warn">${esc(t('WOF.Roll.lasting'))}</span>` : ''
  }</span></div>
  <p class="eff-line fiction">${esc(r.text)}</p>${lines}${trigger}${shrug}
  ${appliedLine(t, c.ops, v)}${buttons ? `<div class="rc-a">${buttons}</div>` : ''}
</div>`;
}

function gasCard(t: T, c: GasCard, v: CardViewer): string {
  const math = `<span class="flag">${esc(t('WOF.Roll.gas.dice', { n: c.faces.length }))}</span>`;
  return `${header(t, { img: c.img, name: t('WOF.Roll.gas.title'), time: c.time, who: c.actorName, glyph: actionIcon('gas-roll') }, math, v.isGM)}
<div class="rc-b">
  <div class="dice">${drow('d6', 'gear-gas-canister', 'D6', c.faces.map((f) => dieIcon(t, 'base', f, { plain: true })).join(''))}</div>
  <div class="result"><span class="big${c.lost ? ' none' : ''}">${c.lost}</span><span class="rt"><b>${esc(t('WOF.Roll.gas.lostLabel'))}</b>${esc(t('WOF.Roll.gas.rating', { from: c.from, to: c.to }))}</span></div>
  ${c.lightTrigger ? `<p class="stakes"><b>${esc(t('WOF.Roll.talent'))}</b>${esc(t('WOF.Roll.gas.lightTrigger'))}</p>` : ''}
  ${appliedLine(t, c.ops, v)}
</div>`;
}

function attackCard(t: T, c: AttackCard, v: CardViewer): string {
  const glyph = dots([['dtn', c.faces.length]], t('WOF.Card.Titan.attackDice', { dice: c.faces.length }));
  const tier = c.tier !== 'thrash' ? `<img class="tier-ic" src="${icon(`tier-${c.tier}`)}" alt="${esc(t(`WOF.Tier.${c.tier}`))}">` : '';
  const whiff = c.severity <= 0;
  const targets = c.targets.length ? t('WOF.Roll.attack.vs', { names: c.targets.map((x) => x.name).join(', ') }) : t('WOF.Roll.attack.severity');
  const reactions = c.reactions
    .map((r) => {
      const res = attackResult(c.severity, r.successes);
      const tail = res.lands ? t('WOF.Roll.attack.landsNet', { net: res.net }) + (c.critical && res.rider ? ` ${t('WOF.Roll.attack.rider', { n: res.rider })}` : '') : t('WOF.Roll.attack.misses');
      return `<li>${esc(t('WOF.Roll.attack.dodged', { name: r.name, n: r.successes }))}: <b>${esc(tail)}</b></li>`;
    })
    .join('');
  const dodge = !whiff && v.canDodge ? `<div class="rc-a"><button class="mini" type="button" data-wof-act="dodge"><img src="${icon('action-dodge')}" alt="">${esc(t('WOF.Roll.attack.dodge'))}</button></div>` : '';
  return `${header(t, { img: c.img, name: c.name, time: c.time, who: c.actorName }, tier + glyph, v.isGM)}
<div class="rc-b">
  <div class="dice">${drow('titan', 'die-titan-attack', t('WOF.Roll.die.titanDice'), c.faces.map((f) => dieIcon(t, 'titan', f)).join(''))}</div>
  <div class="result"><span class="big red">${c.severity}</span><span class="rt"><b>${esc(targets)}</b>${esc(whiff ? t('WOF.Roll.attack.whiff') : t('WOF.Roll.attack.landsOn'))}</span></div>
  ${c.effects.length ? `<p class="eff-line">${esc(t('WOF.Roll.attack.effects', { effects: c.effects.join(' ') }))}</p>` : ''}
  ${reactions ? `<ul class="reacts">${reactions}</ul>` : ''}
  ${dodge}
</div>`;
}

/**
 * The GM's card for a Focus Titan's turn: the behavior, the Attention it answers, the targets, and
 * the dice it will throw. Nothing is rolled until the GM presses Roll, and every line can be
 * overridden in the dialog that opens.
 */
function behaviorCard(t: T, c: BehaviorCard, v: CardViewer): string {
  if (!v.isGM) return '';
  const tier = c.tier !== 'thrash' ? `<img class="tier-ic" src="${icon(`tier-${c.tier}`)}" alt="${esc(t(`WOF.Tier.${c.tier}`))}">` : '';
  const dice = c.attackDice ? dots([['dtn', c.attackDice]], t('WOF.Card.Titan.attackDice', { dice: c.attackDice })) : '';
  const flag = `<span class="flag">${esc(t('WOF.Roll.behavior.gmOnly'))}</span>`;
  const line = (label: string, value: string) => `<p class="stakes"><b>${esc(label)}</b>${esc(value)}</p>`;
  const rows = [
    line(t('WOF.Roll.behavior.titan'), `${c.label} · ${c.actorName}`),
    line(t('WOF.Roll.behavior.attention'), c.holder ? `${c.holder.name}${c.rung ? ` (${c.rung})` : ''}${c.position ? ` · ${c.position}` : ''}` : t('WOF.Roll.behavior.noHolder')),
    line(t('WOF.Roll.behavior.targets'), c.targets.length ? c.targets.map((x) => x.name).join(', ') : t('WOF.Sheet.none')),
    c.rolledEntry && c.rolledEntry !== c.entry ? line(t('WOF.Roll.behavior.rolledWas'), c.rolledName) : '',
    c.effects.length ? line(t('WOF.Roll.behavior.effects'), c.effects.join(' ')) : '',
  ].join('');
  const acts = c.rolled
    ? `<p class="block-why quiet">${esc(c.rolled === 'none' ? t('WOF.Roll.behavior.resolved') : t('WOF.Roll.behavior.rolledAlready'))}</p>`
    : `<div class="rc-a">
  <button class="mini red" type="button" data-wof-act="behaviorRoll"><img src="${icon('roll-push')}" alt="">${esc(t(c.attackDice ? 'WOF.Roll.behavior.roll' : 'WOF.Roll.behavior.open'))}</button>
  <button class="mini" type="button" data-wof-act="behaviorNoDice">${esc(t('WOF.Roll.behavior.noDice'))}</button>
  <p class="block-why quiet">${esc(t(c.attackDice ? 'WOF.Roll.behavior.hint' : 'WOF.Roll.behavior.hintNoDice'))}</p>
</div>`;
  return `${header(t, { img: c.img, name: c.name, time: c.time, who: c.actorName }, tier + dice, v.isGM, flag)}
<div class="rc-b">
  <div class="result"><span class="big red">${c.attackDice ?? '—'}</span><span class="rt"><b>${esc(t('WOF.Roll.die.titanDice'))}</b>${esc(t(`WOF.Tier.${c.tier}`))}</span></div>
  ${rows}${acts}
</div>`;
}

function foeAttackCard(t: T, c: FoeAttackCard, v: CardViewer): string {
  const whiff = c.severity <= 0;
  const target = c.target ? t('WOF.Roll.attack.vs', { names: c.target.name }) : t('WOF.Roll.attack.severity');
  const reactions = c.reactions
    .map((r) => {
      const res = attackResult(c.severity, r.successes);
      return `<li>${esc(t('WOF.Roll.attack.dodged', { name: r.name, n: r.successes }))}: <b>${esc(res.lands ? t('WOF.Roll.attack.landsNet', { net: res.net }) : t('WOF.Roll.attack.misses'))}</b></li>`;
    })
    .join('');
  const entries = c.usedWith === 'fight' ? ['block', 'dodge'] : ['dodge'];
  const buttons =
    !whiff && c.cancel && v.canDodge && !c.reactions.length
      ? `<div class="rc-a">${entries.map((e) => `<button class="mini" type="button" data-wof-act="foeReact" data-entry="${e}"><img src="${icon(`action-${e}`)}" alt="">${esc(t(`WOF.Roll.attack.${e}`))}</button>`).join('')}</div>`
      : '';
  const note = c.cancel ? '' : `<p class="block-why quiet">${esc(t('WOF.Roll.attack.noReaction'))}</p>`;
  return `${header(t, { img: c.img, name: c.weapon, time: c.time, who: c.actorName, glyph: actionIcon(c.usedWith) }, '', v.isGM)}
<div class="rc-b">
  <div class="dice">${drow('base', 'die-base', t('WOF.Roll.die.baseDice'), c.faces.map((f) => dieIcon(t, 'base', f)).join(''))}</div>
  <div class="result"><span class="big red">${c.severity}</span><span class="rt"><b>${esc(target)}</b>${esc(whiff ? t('WOF.Roll.attack.whiff') : t('WOF.Roll.attack.landsOn'))}</span></div>
  ${reactions ? `<ul class="reacts">${reactions}</ul>` : ''}${note}
  ${buttons}
</div>`;
}

function callCard(t: T, c: CallCard, v: CardViewer): string {
  const flag = `<span class="flag">${esc(t('WOF.Roll.called'))}</span>`;
  const roll =
    !c.rolled && v.owner
      ? `<div class="rc-a"><button class="mini red" type="button" data-wof-act="answer"><img src="${icon('roll-push')}" alt="">${esc(t('WOF.Roll.call.roll'))}</button></div>`
      : c.rolled
        ? `<p class="block-why quiet">${esc(t('WOF.Roll.call.rolled'))}</p>`
        : '';
  return `${header(t, { img: c.img, name: c.label, time: c.time, who: c.actorName }, flag, v.isGM)}
<div class="rc-b">
  <p class="stakes"><b>${esc(t('WOF.Roll.call.for'))}</b>${esc(c.actorName)}</p>
  <p class="stakes"><b>${esc(t('WOF.Roll.circumstances'))}</b>${esc(c.circumstances.name)}</p>
  <p class="stakes"><b>${esc(t('WOF.Roll.stakes'))}</b>${esc(c.stakes.text)}</p>
  <p class="stakes"><b>${esc(t('WOF.Roll.needs'))}</b>${c.needs}</p>
  ${roll}
</div>`;
}

function lifepathCard(t: T, c: LifepathCard, v: CardViewer): string {
  const flags = c.flags.map((f) => `<span class="flag">${esc(f)}</span>`).join('');
  const rows: string[] = [];
  if (c.d66) rows.push(drow('d66', 'die-base', t('WOF.Lifepath.card.d66'), c.d66.map((f) => dieIcon(t, 'base', f, { plain: true })).join('<span class="d66-sep" aria-hidden="true"></span>')));
  if (c.plain.length) rows.push(drow('d6', 'die-base', 'D6', c.plain.map((f) => dieIcon(t, 'base', f, { plain: true })).join('')));
  if (c.dice) {
    if (c.dice.base.length) rows.push(drow('base', 'die-base', t('WOF.Roll.die.baseDice'), c.dice.base.map((f) => dieIcon(t, 'base', f)).join('')));
    if (c.dice.gear.length) rows.push(drow('gear', 'die-gear', t('WOF.Roll.die.gearDice'), c.dice.gear.map((f) => dieIcon(t, 'gear', f, { locked: f === 1 && c.pushes > 0 })).join('')));
    if (c.dice.stress.length) rows.push(drow('stress', 'die-stress', t('WOF.Roll.die.stressDice'), c.dice.stress.map((f, i) => dieIcon(t, 'stress', f, { fresh: i === c.fresh })).join('')));
  }
  const lines = c.lines.map((l) => `<p class="eff-line">${esc(l)}</p>`).join('');
  return `${header(t, { img: c.img, name: c.title, time: c.time, who: c.actorName, glyph: c.glyph }, flags, v.isGM)}
<div class="rc-b">
  <div class="dice">${rows.join('')}</div>
  <div class="result${c.struck ? ' struck' : ''}"><span class="big">${esc(c.big)}</span><span class="rt"><b>${esc(c.label)}</b>${esc(c.text)}</span></div>
  ${lines}
</div>`;
}

/**
 * The prompt card: the header says what is happening, the cause says why, and each row names one
 * soldier, what is at stake for them, and their button. A row already answered shows what it gave.
 */
function promptCard(t: T, c: PromptCard, v: CardViewer): string {
  const own = new Set(v.promptOwn ?? []);
  const waiting = c.entries.filter((e) => e.state !== 'done').length;
  const rows = c.entries
    .map((e, i) => {
      const faces = e.faces.map((f) => dieIcon(t, 'base', f, { plain: true })).join('');
      if (e.state === 'done') {
        const by = e.by && e.by !== 'owner' ? `<span class="flag">${esc(t(`WOF.Prompt.by.${e.by}`))}</span>` : '';
        return `<li class="done"><b>${esc(e.name)}</b><span class="fx">${faces}${esc(e.line)}</span>${by}</li>`;
      }
      const mine = own.has(e.actor);
      const label = c.mode === 'action' ? t('WOF.Prompt.roll') : t('WOF.Prompt.rollFixed', { rolls: c.rolls });
      const own_ = mine && !c.closed ? `<button class="mini red" type="button" data-wof-act="promptRoll" data-i="${i}">${esc(label)}</button>` : '';
      const gm = v.isGM && !c.closed ? `<button class="mini" type="button" data-wof-act="promptForThem" data-i="${i}">${esc(t('WOF.Prompt.forThem'))}</button>` : '';
      const waitingFor = own_ || gm ? '' : `<span class="fx">${esc(t(e.state === 'claimed' ? 'WOF.Prompt.rolling' : 'WOF.Prompt.waitingFor', { name: e.name }))}</span>`;
      return `<li><b>${esc(e.name)}</b><span class="fx">${esc(e.detail)}</span>${waitingFor}${own_}${gm}</li>`;
    })
    .join('');
  const note = c.closed
    ? `<p class="block-why quiet">${esc(t('WOF.Prompt.closed'))}</p>`
    : waiting
      ? `<p class="block-why quiet">${esc(c.due ? t('WOF.Prompt.dueNote', { n: waiting }) : t('WOF.Prompt.waitNote', { n: waiting }))}</p>`
      : '';
  const flag = `<span class="flag">${esc(t(`WOF.Prompt.ask.${c.ask}`))}</span>`;
  return `${header(t, { img: c.img, name: c.title, time: c.time, who: c.actorName }, '', v.isGM, flag)}
<div class="rc-b">
  <p class="stakes"><b>${esc(t('WOF.Prompt.cause'))}</b>${esc(c.cause)}</p>
  <ul class="prompt-rows">${rows}</ul>
  ${note}
</div>`;
}

export function renderCard(t: T, c: Card, v: CardViewer, deathRows: { id: string; min: number | null; max: number | null }[] = []): string {
  const body =
    c.kind === 'lifepath'
      ? lifepathCard(t, c, v)
      : c.kind === 'action'
      ? actionCard(t, c, v, deathRows)
      : c.kind === 'table'
        ? tableCard(t, c, v)
        : c.kind === 'gas'
          ? gasCard(t, c, v)
          : c.kind === 'attack'
            ? attackCard(t, c, v)
            : c.kind === 'behavior'
              ? behaviorCard(t, c, v)
              : c.kind === 'foe-attack'
                ? foeAttackCard(t, c, v)
                : c.kind === 'prompt'
                  ? promptCard(t, c, v)
                  : callCard(t, c, v);
  const titanic = c.kind === 'attack' || c.kind === 'foe-attack' || c.kind === 'behavior' || (c.kind === 'prompt' && c.ask !== 'flight');
  return `<article class="wof-card rc${titanic ? ' titanic' : ''}${c.kind === 'behavior' ? ' gm-only' : ''}" data-kind="${c.kind}">${body}</article>`;
}

/** A plain summary kept in the message content, for places that do not run the system (exports, the chat log search). */
export function plainSummary(c: Card): string {
  switch (c.kind) {
    case 'action':
      return `${c.actorName}: ${c.name}, ${successesOf(c)}`;
    case 'table':
      return `${c.actorName}: ${c.response.total} ${c.response.name}`;
    case 'gas':
      return `${c.actorName}: Gas ${c.from} to ${c.to}`;
    case 'attack':
      return `${c.actorName}: ${c.name}, ${c.severity}`;
    case 'behavior':
      return `${c.actorName}: ${c.name}`;
    case 'call':
      return `${c.actorName}: ${c.label}`;
    case 'lifepath':
      return `${c.actorName}: ${c.title}, ${c.big} ${c.text}`;
    case 'foe-attack':
      return `${c.actorName}: ${c.weapon}, ${c.severity}`;
    case 'prompt':
      return `${c.title}: ${c.entries.map((e) => `${e.name}${e.line ? ` ${e.line}` : ''}`).join(', ')}`;
  }
}
