/**
 * The inked soldier silhouette on Wounds & Mind (ADR-0027; preview-v2-1-personnel-file.html),
 * adapted from the owner's Titan World body diagram. Drawn front-on: the body's right side is on
 * the viewer's left. All three Gore treatments are in the markup; the sheet's data-gore picks one
 * per viewer. Pure string building, no Foundry globals.
 */

export type Severity = 'minor' | 'major' | 'crippling';
export type Region = 'head' | 'chest' | 'rightArm' | 'leftArm' | 'rightLeg' | 'leftLeg';

export interface FigureInjury {
  id: string;
  row: string;
  label: string;
  location: string;
  side: 'left' | 'right' | null;
  type: 'crush' | 'bite' | 'burn' | 'cut' | 'pierce';
  severity: Severity;
  treated: boolean;
}

export interface FigurePin {
  id: string;
  n: number;
  left: string;
  top: string;
  treated: boolean;
  label: string;
}

type Art = Record<Region, { cut?: number[]; upper: [string, string][]; lower?: [string, string][] }>;

const ORDER: Region[] = ['rightLeg', 'leftLeg', 'chest', 'rightArm', 'leftArm', 'head'];

const HUMAN: Art = {
  head: {
    upper: [
      ['skin', 'M92 58h16v12l-8 4-8-4z'],
      ['skin', 'M80 31c-3-1-5 1-5 5s2 7 5 7z'],
      ['skin', 'M120 31c3-1 5 1 5 5s-2 7-5 7z'],
      ['skin', 'M100 14c-12 0-20 9-20 22c0 9 3 15 6 19c4 4 9 6 14 6s10-2 14-6c3-4 6-10 6-19c0-13-8-22-20-22z'],
      ['hair', 'M79 34c-1-14 8-24 21-24s23 9 21 24c-3-6-7-9-11-10-5 3-12 4-20 2-5 1-9 4-11 8z'],
      ['line', 'M89 38.5h6M105 38.5h6M88 33.5l7-1.2M105 32.3l7 1.2M100 40v7l-2 1M95.5 52.5q4.5 1.4 9 0'],
    ],
  },
  chest: {
    upper: [
      ['shirt', 'M66 76c6-6 22-10 34-10s28 4 34 10l2 40-4 38 2 32c-10 8-24 10-34 10s-24-2-34-10l2-32-4-38z'],
      ['jacket', 'M66 76c8-6 18-8 28-8l-4 24 2 56-24 4-4-36z'],
      ['jacket', 'M134 76c-8-6-18-8-28-8l4 24-2 56 24 4 4-36z'],
      ['strap', 'M70 78l4-2 50 78-4 3z'],
      ['strap', 'M130 78l-4-2-50 78 4 3z'],
      ['belt', 'M68 160h64v7H68z'],
      ['belt', 'M68 182h64v6H68z'],
      ['brass', 'M96 160h8v7h-8z'],
      ['patch', 'M111 96h10v9l-5 4-5-4z'],
      ['metal', 'M58 174h9v16h-9z'],
      ['metal', 'M133 174h9v16h-9z'],
      ['line', 'M94 68l-6 16 6 8M106 68l6 16-6 8M100 94v64M76 130q4 2 10 1M124 130q-4 2-10 1'],
    ],
  },
  rightArm: {
    cut: [55, 141, 7],
    upper: [['jacket', 'M66 78c-8 4-12 14-13 26l-4 36 12 2 6-34 3-22z']],
    lower: [
      ['jacket', 'M49 140l-4 44 11 2 5-44z'],
      ['shirt', 'M45 180l11 2-.4 5-11-2z'],
      ['skin', 'M45 186c-3 6-4 14-2 20 2 4 7 5 10 2 3-4 4-12 3-20z'],
    ],
  },
  leftArm: {
    cut: [145, 141, 7],
    upper: [['jacket', 'M134 78c8 4 12 14 13 26l4 36-12 2-6-34-3-22z']],
    lower: [
      ['jacket', 'M151 140l4 44-11 2-5-44z'],
      ['shirt', 'M155 180l-11 2 .4 5 11-2z'],
      ['skin', 'M155 186c3 6 4 14 2 20-2 4-7 5-10 2-3-4-4-12-3-20z'],
    ],
  },
  rightLeg: {
    cut: [86, 278, 11],
    upper: [
      ['trousers', 'M68 188c0 10 0 20 2 32l6 58h20l2-58 2-24c-10 0-22-2-32-8z'],
      ['strap', 'M69 207h31v3.5H69z'],
      ['strap', 'M72 240h26v3H72z'],
    ],
    lower: [
      ['trousers', 'M76 278h20v14H77z'],
      ['boot', 'M77 292h19l1 66 4 22c1 5-1 8-6 8H74c-4 0-6-3-5-7l7-23z'],
      ['strap', 'M76 292h21v5H76z'],
    ],
  },
  leftLeg: {
    cut: [114, 278, 11],
    upper: [
      ['trousers', 'M132 188c0 10 0 20-2 32l-6 58h-20l-2-58-2-24c10 0 22-2 32-8z'],
      ['strap', 'M100 207h31v3.5h-31z'],
      ['strap', 'M102 240h26v3h-26z'],
    ],
    lower: [
      ['trousers', 'M124 278h-20v14h19z'],
      ['boot', 'M123 292h-19l-1 66-4 22c-1 5 1 8 6 8h21c4 0 6-3 5-7l-7-23z'],
      ['strap', 'M103 292h21v5h-21z'],
    ],
  },
};

const SPOTS: Record<Region, [number, number][]> = {
  head: [[100, 28]],
  chest: [[86, 104], [114, 116], [100, 140]],
  rightArm: [[58, 98], [54, 124], [50, 164], [48, 176]],
  leftArm: [[142, 98], [146, 124], [150, 164], [152, 176]],
  rightLeg: [[84, 212], [86, 252], [87, 312], [86, 350]],
  leftLeg: [[116, 212], [114, 252], [113, 312], [114, 350]],
};

type Kind = 'blunt' | 'cutting' | 'piercing' | 'burn';
const TYPE: Record<FigureInjury['type'], Kind> = { crush: 'blunt', cut: 'cutting', pierce: 'piercing', burn: 'burn', bite: 'cutting' };

const ART: Record<Kind, Record<Severity, (u: string, limb: boolean) => string>> = {
  blunt: {
    minor: (u) => `<ellipse class="bruise" rx="9" ry="7" fill="url(#${u}-bruise)"/>`,
    major: (u, limb) =>
      `<ellipse class="bruise" rx="13" ry="10" fill="url(#${u}-bruise-deep)"/>` +
      (limb ? '<path class="bone" d="M-5 1q5-9 10 0q-5-3-10 0z"/><path class="crack" d="M-2-4l2 3 2-2 1 3"/>' : '<path class="crack" d="M-9-4l4 2 3-3 4 4 5-1"/>'),
    crippling: (u) => `<ellipse class="bruise" rx="15" ry="13" fill="url(#${u}-bruise-deep)"/><path class="blood" d="M-8 2c3 5 12 5 16 0-2 7-14 8-16 0z"/>`,
  },
  cutting: {
    minor: () => '<path class="torn" d="M-11-5L9 1"/><path class="cut" d="M-10-3L10 3"/><path class="blood thin" d="M-2 0q1 5 0 10M4 2q0 4 1 7"/>',
    major: () => '<path class="gash" d="M-13-5Q0-9 13 5Q0 2-13-5z"/><path class="gash-in" d="M-9-3Q0-5 9 3Q0 1-9-3z"/><path class="blood run" d="M-4 1q2 11 0 22M3 3q-1 9 1 16"/>',
    crippling: () => '<path class="gash" d="M-16-8Q0-12 16 8L12 12Q0-2-18-4z"/><path class="blood run" d="M-8 6q2 14 0 30M6 14q-1 12 1 22"/>',
  },
  piercing: {
    minor: () => '<circle class="hole-ring" r="4.2"/><circle class="hole" r="2.2"/><path class="blood thin" d="M0 2q1 5-.5 9"/>',
    major: () => '<circle class="hole-ring" r="6"/><circle class="hole" r="3.2"/><path class="blood run" d="M-1 3q2 10 0 19"/>',
    crippling: () => '<path class="hole" d="M-9-6l5-3 6 2 5 4-1 7-6 5-7-1-4-6z"/><path class="bone" d="M-3-2l3-3 2 3-3 2z"/><path class="blood run" d="M-4 6q2 14 0 26"/>',
  },
  burn: {
    minor: (u) =>
      `<path class="scorch" d="M-11-6c4-4 10-5 16-2 6 1 8 7 5 11-3 5-11 6-17 3-6-3-8-8-4-12z" fill="url(#${u}-scorch)"/><g class="blister"><circle cx="-3" cy="-1" r="1.4"/><circle cx="3" cy="2" r="1.1"/></g>`,
    major: (u) =>
      `<path class="scorch" d="M-13-8c6-5 16-5 22 0 6 5 6 13 0 17-7 5-18 4-23-2-4-5-4-11 1-15z" fill="url(#${u}-scorch)"/><path class="raw" d="M-8-4c4-3 10-3 13 0 4 3 3 8-1 10-5 2-11 1-13-2-2-3-2-6 1-8z"/>`,
    crippling: (u, limb) => ART.burn.major(u, limb),
  },
};

const DRESS = {
  wrap: (limb: boolean) =>
    limb
      ? '<rect class="dressing" x="-9" y="-6" width="18" height="12" rx="1.5"/><path class="dressing-line" d="M-9-2h18M-9 2h18"/><ellipse class="seep" rx="3.4" ry="2.2" cy="-1"/>'
      : '<rect class="dressing" x="-12" y="-8" width="24" height="16" rx="1.5"/><path class="dressing-line" d="M-12-2h24M-12 3h24"/><ellipse class="seep" rx="5" ry="3"/>',
  splint: () =>
    '<rect class="splint" x="-9" y="-16" width="3" height="32" rx=".8"/><rect class="splint" x="6" y="-16" width="3" height="32" rx=".8"/><rect class="dressing" x="-7" y="-6" width="14" height="12"/><path class="tie" d="M-10-9h20M-10 9h20"/>',
};

const GLYPH: Record<Kind, string> = {
  blunt: '<rect x="-3.5" y="-3.5" width="7" height="7"/>',
  cutting: '<path d="M-4 4L4-4"/>',
  piercing: '<circle r="3.5"/>',
  burn: '<path d="M0-4l4 7H-4z"/>',
};

const paths = (list: [string, string][]) => list.map(([c, d]) => `<path class="${c}" d="${d}"/>`).join('');
const shape = (list: [string, string][]) =>
  list
    .filter(([c]) => !/line|teeth|pupil|muscle/.test(c))
    .map(([, d]) => `<path d="${d}"/>`)
    .join('');
const hash = (t: string) => [...t].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const drop = (x: number, y: number, i: number) =>
  `<g transform="translate(${x} ${y})"><path class="drop" style="animation-delay:${((i * 0.73) % 2.2).toFixed(2)}s" d="M0 0q-1.8 2.8 0 4.6 1.8-1.8 0-4.6z"/></g>`;

function defs(u: string): string {
  const hatch = (s: string, c: string, g: number) =>
    `<pattern id="${u}-h-${s}" width="${g}" height="${g}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="${g}" height="${g}" fill="${c}" fill-opacity=".16"/><line x1="0" y1="0" x2="0" y2="${g}" stroke="${c}" stroke-width="1.5" stroke-opacity=".9"/></pattern>`;
  return (
    `<radialGradient id="${u}-bruise"><stop offset="0" stop-color="#4a1f3f" stop-opacity=".62"/><stop offset=".55" stop-color="#6b3d2a" stop-opacity=".34"/><stop offset="1" stop-color="#6b3d2a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${u}-bruise-deep"><stop offset="0" stop-color="#2d0c22" stop-opacity=".82"/><stop offset="1" stop-color="#5a1f30" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${u}-scorch"><stop offset="0" stop-color="#120a06" stop-opacity=".94"/><stop offset="1" stop-color="#8a5a2a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${u}-stain"><stop offset="0" stop-color="#4a0404" stop-opacity=".62"/><stop offset=".6" stop-color="#6a0a0a" stop-opacity=".3"/><stop offset="1" stop-color="#6a0a0a" stop-opacity="0"/></radialGradient>` +
    hatch('minor', '#3f6146', 6) +
    hatch('major', '#8e2323', 5) +
    hatch('crippling', '#241f1b', 4) +
    `<filter id="${u}-ink" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.1" xChannelSelector="R" yChannelSelector="G"/></filter>` +
    ORDER.map((k) => `<clipPath id="${u}-clip-${k}">${shape([...HUMAN[k].upper, ...(HUMAN[k].lower ?? [])])}</clipPath>`).join('')
  );
}

/** Which drawn region a Critical Injury sits on: arms and legs by side, torso on the chest. */
export function regionOf(location: string, side: 'left' | 'right' | null): Region {
  if (location === 'torso') return 'chest';
  if (location === 'head') return 'head';
  const s = side === 'right' ? 'right' : 'left';
  return `${s}${location === 'arm' ? 'Arm' : 'Leg'}` as Region;
}

/**
 * The soldier figure: each Critical Injury drawn at its location and side, treated ones dressed,
 * untreated ones open. `uid` keeps the SVG ids unique per open sheet.
 */
export function soldierFigure(injuries: readonly FigureInjury[], uid: string, ariaLabel: string): { svg: string; pins: FigurePin[] } {
  const u = uid;
  let base = '';
  let vis = '';
  let clin = '';
  let drips = '';
  const pins: FigurePin[] = [];
  const used: Partial<Record<Region, number>> = {};
  for (const k of ORDER) {
    const a = HUMAN[k];
    base += `<g class="rg" data-region="${k}"><g>${paths(a.upper)}</g>${a.lower ? `<g>${paths(a.lower)}</g>` : ''}</g>`;
  }
  injuries.forEach((w, i) => {
    const k = regionOf(w.location, w.side);
    const limb = /Arm|Leg/.test(k);
    const t = TYPE[w.type];
    const spots = SPOTS[k];
    const n = used[k] ?? 0;
    used[k] = n + 1;
    const [x, y] = spots[(hash(w.row) + n) % spots.length];
    const turn = (hash(w.row) % 24) - 12;
    let body: string;
    if (w.treated) body = w.type === 'crush' && w.severity !== 'minor' && limb ? DRESS.splint() : DRESS.wrap(limb);
    else {
      body = ART[t][w.severity](u, limb) + (t === 'cutting' ? '<path class="blood run" d="M-1 2q1 8 0 16M3 3q-1 6 1 11"/>' : '');
      if (t !== 'blunt' && t !== 'burn') {
        let seed = hash(w.row) || 1;
        const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
        const spatter = Array.from({ length: 6 }, () => {
          const an = rnd() * Math.PI * 2;
          const r = 8 + rnd() * 10;
          return `<circle cx="${(Math.cos(an) * r).toFixed(1)}" cy="${(Math.sin(an) * r).toFixed(1)}" r="${(0.5 + rnd() * 1.3).toFixed(1)}"/>`;
        }).join('');
        body = `<ellipse class="stain" rx="${limb ? 10 : 15}" ry="${limb ? 13 : 19}" cy="5" fill="url(#${u}-stain)"/>${body}<g class="spatter">${spatter}</g><path class="gloss" d="M-8-4.6Q0-7.4 7.5 1.5"/>`;
        drips += drop(x, y + (limb ? 10 : 16), i) + (w.severity !== 'minor' ? drop(x + 3, y + 14, i + 1) : '');
        if (limb && /Leg/.test(k)) vis += `<ellipse class="pool" cx="${x + 4}" cy="392" rx="${w.severity === 'minor' ? 8 : 16}" ry="2.4"/>`;
      }
    }
    vis += `<g class="wound ${w.treated ? 'treated' : 'open'}" clip-path="url(#${u}-clip-${k})"><g transform="translate(${x} ${y}) rotate(${turn}) scale(${limb ? 1.25 : 1.1})">${body}</g></g>`;
    const hs: Severity = w.treated ? 'minor' : w.severity === 'minor' ? 'major' : 'crippling';
    const part = HUMAN[k];
    clin += `<g class="hatch h-${hs}" fill="url(#${u}-h-${hs})">${shape([...part.upper, ...(part.lower ?? [])])}</g><g class="glyph h-${hs}" transform="translate(${x} ${y})">${GLYPH[t]}</g>`;
    pins.push({
      id: w.id,
      n: i + 1,
      treated: w.treated,
      label: w.label,
      left: `${(((x - 30 + (x < 100 ? -16 : 16)) / 140) * 100).toFixed(1)}%`,
      top: `${((y / 400) * 100).toFixed(1)}%`,
    });
  });
  const svg =
    `<svg class="fig human" viewBox="30 0 140 400" role="img" aria-label="${escapeAttr(ariaLabel)}">` +
    `<defs>${defs(u)}</defs><g filter="url(#${u}-ink)">${base}</g><g class="fig-clinical">${clin}</g><g class="fig-visceral">${vis}${drips}</g></svg>`;
  return { svg, pins };
}

/** How heavy a row reads on the figure: lethal rows cripple, Down or long healing is major. */
export function severityOf(row: { lethal: boolean; instant_death?: boolean; down: string | boolean; healing_days: number; penaltyDice: number }): Severity {
  if (row.lethal || row.instant_death) return 'crippling';
  if (row.down || row.healing_days >= 14 || row.penaltyDice >= 2) return 'major';
  return 'minor';
}
