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

function defs(u: string, art: Art = HUMAN): string {
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
    ORDER.map((k) => `<clipPath id="${u}-clip-${k}">${shape([...art[k].upper, ...(art[k].lower ?? [])])}</clipPath>`).join('')
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

// ------------------------------------------------------------------ the Titan

const TITAN: Art = {
  head: {
    upper: [
      ['tskin', 'M93 68h14l2 12H91z'],
      ['tskin', 'M100 6c-17 0-29 13-29 33 0 17 11 31 29 31s29-14 29-31c0-20-12-33-29-33z'],
      ['tskin', 'M71 34c-4-1-6 2-6 6s3 8 6 8zM129 34c4-1 6 2 6 6s-3 8-6 8z'],
      ['mouth', 'M80 48c6 10 34 10 40 0-3 12-37 12-40 0z'],
      ['teeth', 'M84 51v4M88 53v4M92 54v4M96 55v4M100 55v4M104 55v4M108 54v4M112 53v4M116 51v4'],
      ['eye', 'M84 33a6 5 0 1 0 12 0a6 5 0 1 0-12 0zM104 33a6 5 0 1 0 12 0a6 5 0 1 0-12 0z'],
      ['pupil', 'M89 33.5a1.6 1.6 0 1 0 2 0zM109 33.5a1.6 1.6 0 1 0 2 0z'],
      ['tline', 'M100 38v7M79 22q8-6 16-3M121 22q-8-6-16-3'],
    ],
  },
  chest: {
    upper: [
      ['tskin', 'M72 84c8-6 20-8 28-8s20 2 28 8l-2 30c-2 20-6 36-6 52l2 26c-8 6-16 8-22 8s-14-2-22-8l2-26c0-16-4-32-6-52z'],
      ['muscle', 'M76 88l-6 22M82 86l-4 26M124 88l6 22M118 86l4 26'],
      ['tline', 'M82 104q18 6 36 0M80 117q20 7 40 0M82 130q18 6 36 0M100 140v34M90 184q10 3 20 0'],
    ],
  },
  rightArm: {
    cut: [51, 176, 6],
    upper: [['tskin', 'M72 86c-10 6-16 18-18 34l-8 56 10 2 10-54 10-24z'], ['muscle', 'M62 100l-6 30']],
    lower: [['tskin', 'M46 176l-6 70 10 2 6-70z'], ['tskin', 'M40 246c-4 8-5 18-2 24 3 4 9 4 12 0 3-6 3-16 0-24z'], ['muscle', 'M48 190l-4 40']],
  },
  leftArm: {
    cut: [149, 176, 6],
    upper: [['tskin', 'M128 86c10 6 16 18 18 34l8 56-10 2-10-54-10-24z'], ['muscle', 'M138 100l6 30']],
    lower: [['tskin', 'M154 176l6 70-10 2-6-70z'], ['tskin', 'M160 246c4 8 5 18 2 24-3 4-9 4-12 0-3-6-3-16 0-24z'], ['muscle', 'M152 190l4 40']],
  },
  rightLeg: {
    cut: [85, 290, 11],
    upper: [['tskin', 'M78 208l-4 82h22l4-80z'], ['muscle', 'M84 222l-2 50']],
    lower: [['tskin', 'M74 290l-2 74c-1 10 2 16 10 16h8c6 0 8-6 7-12l-1-78z'], ['tline', 'M80 300q6 3 12 0']],
  },
  leftLeg: {
    cut: [115, 290, 11],
    upper: [['tskin', 'M122 208l4 82h-22l-4-80z'], ['muscle', 'M116 222l2 50']],
    lower: [['tskin', 'M126 290l2 74c1 10-2 16-10 16h-8c-6 0-8-6-7-12l1-78z'], ['tline', 'M120 300q-6 3-12 0']],
  },
};

const TSPOTS: Partial<Record<Region, [number, number][]>> = {
  rightArm: [[60, 120], [46, 210]],
  leftArm: [[140, 120], [154, 210]],
  rightLeg: [[86, 245], [84, 330]],
  leftLeg: [[114, 245], [116, 330]],
};

export type TitanPartState = 'intact' | 'wounded' | 'broken';

export interface FigurePart {
  /** The Body Part's index in the stat block. */
  index: number;
  kind: 'eyes' | 'arm' | 'leg';
  /** Which side the part is drawn on; null for the eyes. */
  side: 'left' | 'right' | null;
  state: TitanPartState;
}

/** Where a Titan Body Part is drawn: by kind, and by the side its id names (left first otherwise). */
export function titanRegions(parts: readonly { id: string; kind: 'eyes' | 'arm' | 'leg' }[]): ('left' | 'right' | null)[] {
  const seen: Record<string, number> = {};
  return parts.map((p) => {
    if (p.kind === 'eyes') return null;
    if (/(^|-)left(-|$)/.test(p.id)) return 'left';
    if (/(^|-)right(-|$)/.test(p.id)) return 'right';
    const n = (seen[p.kind] = (seen[p.kind] ?? 0) + 1);
    return n === 1 ? 'left' : 'right';
  });
}

const steam = (x: number, y: number, heavy: boolean, n = 2) =>
  Array.from({ length: n }, (_, i) => `<path class="steam${heavy ? ' heavy' : ''}" d="M${x - 4 + i * 5} ${y - 6}c-5-6 4-10-1-${heavy ? 20 : 14}"/>`).join('');

/** The point on the figure a part's steam rises from. */
export function titanPartSpot(part: Pick<FigurePart, 'kind' | 'side'>): [number, number] {
  if (part.kind === 'eyes') return [100, 30];
  const k = `${part.side ?? 'left'}${part.kind === 'arm' ? 'Arm' : 'Leg'}` as Region;
  const c = TITAN[k].cut!;
  return [c[0], c[1]];
}

/**
 * The inked Titan (ADR-0027; preview-v2-1-personnel-file.html): each Body Part intact, wounded (a cut
 * that steams), or broken (an arm hangs, a leg is severed and lies beside it, the eyes are put out;
 * heavy steam). The Gore setting picks the visceral or the clinical layer. Regions carry
 * data-part (the stat block index) for clicks.
 */
export function titanFigure(parts: readonly FigurePart[], uid: string, ariaLabel: string, napeLabel: string): string {
  const u = uid;
  let base = '';
  let vis = '';
  let clin = '';
  for (const k of ORDER) {
    const a = TITAN[k];
    const part = parts.find((p) => (k === 'head' ? p.kind === 'eyes' : `${p.side}${p.kind === 'arm' ? 'Arm' : 'Leg'}` === k)) ?? null;
    const st = part?.state ?? 'intact';
    const arm = /Arm/.test(k);
    const leg = /Leg/.test(k);
    const side = k.startsWith('left') ? 1 : -1;
    let lower = '';
    if (a.lower) {
      if (st === 'broken' && arm) {
        const [cx, cy] = a.cut!;
        lower = `<g class="hang" style="transform:rotate(${side * -24}deg);transform-origin:${cx}px ${cy}px">${paths(a.lower)}</g>`;
      } else if (st === 'broken' && leg) lower = `<g class="lost">${paths(a.lower)}</g>`;
      else lower = `<g>${paths(a.lower)}</g>`;
    }
    const attr = part ? ` data-part="${part.index}"` : '';
    base += `<g class="rg${part ? ' part' : ''}"${attr} data-region="${k}"><g>${paths(a.upper)}</g>${lower}</g>`;
    if (!part || st === 'intact') continue;
    const hs: Severity = st === 'wounded' ? 'major' : 'crippling';
    if (k === 'head') {
      clin += `<g class="hatch h-${hs}" fill="url(#${u}-h-${hs})"><path d="M80 26h40v14H80z"/></g><g class="glyph h-${hs}" transform="translate(100 20)">${GLYPH.cutting}</g>`;
      vis +=
        st === 'wounded'
          ? `<g class="wound"><path class="gash" d="M79 29Q100 24 121 36L120 39Q100 29 80 33z"/><path class="gash-in" d="M84 30Q100 27 116 35L116 36Q100 30 84 32z"/><path class="tblood" d="M92 33q1 6 0 10"/></g>${steam(100, 30, false)}`
          : `<g class="wound"><ellipse class="socket" cx="90" cy="33" rx="7" ry="6"/><ellipse class="socket" cx="110" cy="33" rx="7" ry="6"/><path class="tblood" d="M87 38q1 10-1 20M92 38q0 8 1 14M108 38q1 9-1 18M113 38q0 10 1 16"/><g class="g-only"><circle class="blood" cx="84" cy="60" r="1.4"/><circle class="blood" cx="115" cy="57" r="1.1"/></g></g>${steam(90, 30, true)}${steam(110, 30, true)}`;
      continue;
    }
    const [cx, cy, cw] = a.cut!;
    const [x, y] = TSPOTS[k]![st === 'wounded' ? 0 : 1];
    clin += `<g class="hatch h-${hs}" fill="url(#${u}-h-${hs})">${shape(a.upper)}${st === 'wounded' || arm ? shape(a.lower!) : ''}</g><g class="glyph h-${hs}" transform="translate(${cx} ${cy})">${GLYPH.cutting}</g>`;
    if (st === 'wounded') {
      vis += `<g class="wound" transform="translate(${x} ${y}) rotate(${side * 20}) scale(.8)">${ART.cutting.major(u, true)}</g>${steam(x, y, false)}`;
    } else if (arm) {
      vis += `<g class="wound"><ellipse class="flesh" cx="${cx}" cy="${cy}" rx="${cw + 1}" ry="3.2"/><path class="torn" d="M${cx - cw} ${cy - 2}l2 3 2-3 2 3 2-3 2 3"/><path class="bone" d="M${cx - 1.5} ${cy - 3}h3v6h-3z"/><path class="tblood" d="M${cx + side * -4} ${cy + 4}q2 14-1 26"/></g>${steam(cx, cy, true, 3)}`;
    } else {
      const lie = `<g class="lying" transform="translate(0 86) rotate(${side * -90} ${cx} ${cy})">${paths(a.lower!)}<ellipse class="flesh" cx="${cx}" cy="${cy + 1}" rx="${cw}" ry="3.6"/></g>`;
      vis += `${lie}<g class="wound"><ellipse class="flesh" cx="${cx}" cy="${cy + 1}" rx="${cw}" ry="4"/><circle class="bone" cx="${cx}" cy="${cy + 1}" r="3.2"/><path class="torn" d="M${cx - cw} ${cy - 1}l3 2.4 3-2.4 3 2.4 3-2.4 3 2.4 3-2.4"/><path class="tblood" d="M${cx - 3} ${cy + 4}q1 20-1 40"/><ellipse class="steam-bed" cx="${cx}" cy="${cy - 4}" rx="${cw + 4}" ry="5"/></g>${steam(cx, cy, true, 3)}`;
    }
  }
  const nape = `<g class="nape"><title>${escapeAttr(napeLabel)}</title><circle cx="100" cy="76" r="6.5"/><path d="M92 76h-5M108 76h5M100 69v-4"/></g>`;
  return (
    `<svg class="fig titan" viewBox="-30 0 260 400" role="img" aria-label="${escapeAttr(ariaLabel)}">` +
    `<defs>${defs(u, TITAN)}</defs><g filter="url(#${u}-ink)">${base}</g>${nape}<g class="fig-clinical">${clin}</g><g class="fig-visceral">${vis}</g><g class="puffs"></g></svg>`
  );
}
