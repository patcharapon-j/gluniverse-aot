/**
 * Placeholder die faces as inline SVG strings, shared by server-rendered
 * diagrams now and the Dice Tray later. Kinds differ in fill and pip ink as
 * well as colour; success rings and flags carry meaning without colour alone.
 */
export type DieKind = 'base' | 'gear' | 'stress' | 'titan';

export interface DieFace {
  /** 1 to 6, "?" for a die about to be rolled, "+" for a newly added die. */
  value: string;
  /** k: kept on a Push, l: locked Gear Die, n: new Stress Die, x: shows a 1 that matters. */
  flags: string;
}

export interface DieGroup {
  kind: DieKind;
  dice: DieFace[];
}

export const KIND: Record<DieKind, { name: string; plural: string; fill: string; stroke: string; pip: string }> = {
  base: { name: 'Base die', plural: 'Base', fill: '#EDE6D2', stroke: '#29241D', pip: '#29241D' },
  gear: { name: 'Gear Die', plural: 'Gear', fill: '#56605F', stroke: '#1F2524', pip: '#EFE8D6' },
  stress: { name: 'Stress Die', plural: 'Stress', fill: '#8B2A21', stroke: '#4A140F', pip: '#F3E7D6' },
  titan: { name: 'Titan Attack Die', plural: 'Titan', fill: '#B38467', stroke: '#5A3C2B', pip: '#29241D' },
};

const PIPS: Record<number, [number, number][]> = {
  1: [[20, 20]],
  2: [[12, 12], [28, 28]],
  3: [[12, 12], [20, 20], [28, 28]],
  4: [[12, 12], [28, 12], [12, 28], [28, 28]],
  5: [[12, 12], [28, 12], [20, 20], [12, 28], [28, 28]],
  6: [[12, 11], [28, 11], [12, 20], [28, 20], [12, 29], [28, 29]],
};

export function isSuccess(kind: DieKind, n: number): boolean {
  return n === 6 || (kind === 'titan' && n === 5);
}

export function dieSvg(kind: DieKind, value: string, flags = '', className = 'die'): string {
  const k = KIND[kind];
  const n = Number.parseInt(value, 10);
  const known = !Number.isNaN(n);
  const ok = known && isSuccess(kind, n);
  const state = known ? ` showing ${n}` : value === '+' ? ', newly added' : ', to be rolled';
  const label = `${k.name}${state}${ok ? ', a success' : ''}`;
  let s = `<svg class="${className}" viewBox="-5 -5 50 56" role="img" aria-label="${label}">`;
  if (ok) s += '<rect x="-3.5" y="-3.5" width="47" height="47" rx="9" fill="none" style="stroke:var(--ring,#2F4B3C)" stroke-width="2.4"/>';
  if (flags.includes('x'))
    s += '<rect x="-3.5" y="-3.5" width="47" height="47" rx="9" fill="none" style="stroke:var(--warn,#8B2A21)" stroke-width="2.4" stroke-dasharray="4 3"/>';
  if (value === '+') {
    s += `<rect x="1" y="1" width="38" height="38" rx="6" fill="none" stroke="${k.fill}" stroke-width="2" stroke-dasharray="4 3"/><path d="M20 12v16M12 20h16" stroke="${k.fill}" stroke-width="3"/>`;
  } else {
    s += `<rect x="1" y="1" width="38" height="38" rx="6" fill="${k.fill}" stroke="${k.stroke}" stroke-width="1.5"/><rect x="3.5" y="3.5" width="33" height="33" rx="4" fill="none" stroke="#fff" stroke-opacity=".14"/>`;
    if (!known) {
      s += `<text x="20" y="26" text-anchor="middle" font-family="Courier Prime, monospace" font-weight="700" font-size="17" fill="${k.pip}">?</text>`;
    } else {
      for (const [cx, cy] of PIPS[n] ?? []) s += `<circle cx="${cx}" cy="${cy}" r="3.6" fill="${k.pip}"/>`;
    }
  }
  if (flags.includes('k')) s += '<path d="M8 47h24" style="stroke:var(--ring,#2F4B3C)" stroke-width="2.5"/>';
  if (flags.includes('l'))
    s += '<g style="fill:var(--mark,#5C5343)"><rect x="15" y="45" width="10" height="6" rx="1"/><path d="M17 45v-2a3 3 0 0 1 6 0v2" fill="none" style="stroke:var(--mark,#5C5343)" stroke-width="1.6"/></g>';
  if (flags.includes('n')) s += '<circle cx="20" cy="48" r="2.6" style="fill:var(--warn,#8B2A21)"/>';
  return `${s}</svg>`;
}

/** Parses the compact notation "base:6,3k|gear:1l|stress:+" into groups. */
export function parsePool(notation: string): DieGroup[] {
  return notation.split('|').map((group) => {
    const [kind, values = ''] = group.split(':');
    if (!(kind in KIND)) throw new Error(`Unknown die kind "${kind}" in "${notation}"`);
    return {
      kind: kind as DieKind,
      dice: values.split(',').map((t) => ({ value: t.charAt(0), flags: t.slice(1) })),
    };
  });
}

export function facesHtml(notation: string, className = 'die'): string {
  return parsePool(notation)
    .map((g) => g.dice.map((d) => dieSvg(g.kind, d.value, d.flags, className)).join(''))
    .join('');
}

export function poolHtml(notation: string): string {
  return parsePool(notation)
    .map(
      (g) =>
        `<div class="grp"><div class="dice">${g.dice.map((d) => dieSvg(g.kind, d.value, d.flags)).join('')}</div><span class="lbl">${KIND[g.kind].plural} ×${g.dice.length}</span></div>`,
    )
    .join('');
}

/** A dice pool as a Try this roll button sends it. */
export interface TryRollPool {
  base: number;
  gear?: number;
  stress?: number;
  titan?: number;
}

export function describePool(pool: TryRollPool): string {
  const parts: string[] = [];
  const add = (n: number | undefined, one: string, many: string) => {
    if (n && n > 0) parts.push(`${n} ${n === 1 ? one : many}`);
  };
  add(pool.base, 'base die', 'base dice');
  add(pool.gear, 'Gear Die', 'Gear Dice');
  add(pool.stress, 'Stress Die', 'Stress Dice');
  add(pool.titan, 'Titan Attack Die', 'Titan Attack Dice');
  return new Intl.ListFormat('en', { type: 'conjunction' }).format(parts);
}
