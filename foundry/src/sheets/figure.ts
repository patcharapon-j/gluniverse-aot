/**
 * The body figures on Wounds & Mind and the Titan sheet (ADR-0027), ported from the owner's Titan World
 * body diagram: painted anime studies (static/assets/anatomy) cut into addressable regions with SVG
 * clip paths, and every Critical Injury painted where it struck from a wound atlas. Drawn front-on:
 * the body's right side is on the viewer's left. All three Gore treatments are in the markup and the
 * sheet's data-gore picks one per viewer: graphic shows the painted decals, standard the subdued
 * symbols, low region hatching. Pure string building, no Foundry globals.
 */
import { anatomyPath } from '../art.ts';

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

export interface SoldierFigureOptions {
  /** Limbs lost to a healed permanent injury (healed_permanent_injuries): drawn as healed stumps. */
  healedLost?: readonly { location: string; side: 'left' | 'right' | null }[];
  /** The soldier is dead (the core "dead" status). */
  dead?: boolean;
  /** The soldier is Down. */
  down?: boolean;
}

export const ANATOMY = {
  cadet: anatomyPath('body-cadet'),
  titan: anatomyPath('titan-ordinary'),
  wounds: anatomyPath('wound-atlas'),
  treatment: anatomyPath('treatment-atlas'),
} as const;

type Part = [cls: string, d: string, mirror?: boolean];
type Art = Record<Region, { cut?: [number, number, number]; upper: Part[]; lower?: Part[] }>;

/** Paint order: legs behind the torso, arms over its sides, the head over the collar. */
const ORDER: Region[] = ['rightLeg', 'leftLeg', 'chest', 'rightArm', 'leftArm', 'head'];
const LIMB = (k: Region) => k !== 'head' && k !== 'chest';
const mirror = (list: Part[]): Part[] => list.map(([c, d]) => [c, d, true]);

// Partitions of the 200 x 400 plate. All regions share one image, so their seams stay invisible
// until an injury removes or deforms a limb.
const HUMAN_R: Omit<Art, 'leftArm' | 'leftLeg'> = {
  head: { upper: [['surface', 'M0 0H200V72H0Z']] },
  chest: { upper: [['surface', 'M65 72H135L128 110 128 140 140 180 145 200H55L60 180 72 140 72 110Z']] },
  rightArm: { cut: [53, 141, 9], upper: [['surface', 'M0 72H65L72 110V141H0Z']], lower: [['surface', 'M0 141H72L60 180 55 200V236H0Z']] },
  rightLeg: { cut: [77, 278, 13], upper: [['surface', 'M55 200H100V278H55Z']], lower: [['surface', 'M50 278H100V400H50Z']] },
};
const HUMAN: Art = {
  ...HUMAN_R,
  leftArm: { cut: [147, 141, 9], upper: mirror(HUMAN_R.rightArm.upper), lower: mirror(HUMAN_R.rightArm.lower!) },
  leftLeg: { cut: [123, 278, 13], upper: mirror(HUMAN_R.rightLeg.upper), lower: mirror(HUMAN_R.rightLeg.lower!) },
};

const TITAN_R: Omit<Art, 'leftArm' | 'leftLeg'> = {
  head: { upper: [['surface', 'M0 0H200V57H0Z']] },
  chest: { upper: [['surface', 'M53 57H147L133 97 130 125 148 170 152 190H48L52 170 70 125 67 97Z']] },
  rightArm: { cut: [43, 130, 13], upper: [['surface', 'M0 57H53L67 97 70 130H0Z']], lower: [['surface', 'M0 130H70L52 170 48 190V236H0Z']] },
  rightLeg: { cut: [72, 260, 18], upper: [['surface', 'M48 190H100V260H35Z']], lower: [['surface', 'M20 260H100V400H20Z']] },
};
const TITAN: Art = {
  ...TITAN_R,
  leftArm: { cut: [157, 130, 13], upper: mirror(TITAN_R.rightArm.upper), lower: mirror(TITAN_R.rightArm.lower!) },
  leftLeg: { cut: [128, 260, 18], upper: mirror(TITAN_R.rightLeg.upper), lower: mirror(TITAN_R.rightLeg.lower!) },
};

const SPOTS: Record<Region, [number, number][]> = {
  head: [[100, 28], [89, 46], [111, 46], [100, 57]],
  chest: [[86, 104], [114, 116], [100, 140], [90, 172]],
  rightArm: [[58, 98], [54, 124], [51, 160], [48, 176]],
  leftArm: [[142, 98], [146, 124], [149, 160], [152, 176]],
  rightLeg: [[84, 212], [86, 252], [87, 312], [86, 346]],
  leftLeg: [[116, 212], [114, 252], [113, 312], [114, 346]],
};
const TITAN_SPOTS: Record<Region, [number, number][]> = {
  ...SPOTS,
  head: [[100, 24], [89, 36], [111, 36], [100, 45]],
  rightArm: [[54, 88], [44, 119], [35, 157], [30, 183]],
  leftArm: [[146, 88], [156, 119], [165, 157], [170, 183]],
  rightLeg: [[75, 213], [71, 244], [66, 294], [58, 340]],
  leftLeg: [[125, 213], [129, 244], [134, 294], [142, 340]],
};

type Kind = 'blunt' | 'cutting' | 'piercing' | 'burn';
/** WoF injury types on the atlas: cut top-left, pierce and bite top-right, crush bottom-left, burn bottom-right. */
const TYPE: Record<FigureInjury['type'], Kind> = { crush: 'blunt', cut: 'cutting', pierce: 'piercing', bite: 'piercing', burn: 'burn' };

// The subdued symbol of each wound (standard Gore), drawn around 0,0 at the spot it landed.
const ART: Record<Kind, Record<Severity, (u: string, limb: boolean, region: Region) => string>> = {
  blunt: {
    minor: (u) => `<ellipse class="bruise" rx="9" ry="7" fill="url(#${u}-bruise)"/>`,
    major: (u, limb) =>
      `<ellipse class="bruise" rx="13" ry="10" fill="url(#${u}-bruise-deep)"/>` +
      (limb ? '<path class="bone" d="M-5 1q5-9 10 0q-5-3-10 0z"/><path class="crack" d="M-2-4l2 3 2-2 1 3"/>' : '<path class="crack" d="M-9-4l4 2 3-3 4 4 5-1M-8 4l5-1 4 3 6-2"/>'),
    crippling: (u, limb, region) =>
      limb
        ? `<ellipse class="bruise" rx="15" ry="13" fill="url(#${u}-bruise-deep)"/><path class="blood" d="M-8 2c3 5 12 5 16 0-2 7-14 8-16 0z"/><path class="torn" d="M-9-6l3 2 2-3 3 3 2-2 3 3"/>`
        : region === 'head'
          ? '<path class="cave" d="M-12-4c4-6 20-6 24 0-2 10-22 10-24 0z"/><path class="crack" d="M-12-4l-4-6M12-4l5-7M0-7v-6"/><path class="blood run" d="M-9 4c2 8 3 14 1 20M6 5c1 6 0 12 2 18"/>'
          : `<ellipse class="bruise" rx="18" ry="24" fill="url(#${u}-bruise-deep)"/><path class="crack" d="M0-30l3 8-4 7 4 8-3 8 4 9-3 9"/>`,
  },
  cutting: {
    minor: () => '<path class="torn" d="M-11-5L9 1"/><path class="cut" d="M-10-3L10 3"/><path class="blood thin" d="M-2 0q1 5 0 10M4 2q0 4 1 7"/>',
    major: () =>
      '<path class="gash" d="M-13-5Q0-9 13 5Q0 2-13-5z"/><path class="gash-in" d="M-9-3Q0-5 9 3Q0 1-9-3z"/><path class="blood run" d="M-4 1q2 11 0 22M3 3q-1 9 1 16M-8-2q-1 6 0 10"/>',
    crippling: (_u, _limb, region) =>
      region === 'head'
        ? '<path class="blood coat" d="M-20-20c10-8 30-8 40 0 4 14 2 30-6 38-8 4-20 4-28 0-8-8-10-24-6-38z"/><path class="gash" d="M-14-12L14 10L10 14L-16-8z"/>'
        : '<path class="gash" d="M-20-18Q-2 0 20 22L14 26Q-4 6-24-12z"/><path class="rib" d="M-12-10l6 2M-6-4l7 2M0 2l7 2M6 8l7 2"/><path class="blood run" d="M-8 6q2 14 0 30M6 14q-1 12 1 22"/>',
  },
  piercing: {
    minor: () => '<circle class="hole-ring" r="4.2"/><circle class="hole" r="2.2"/><path class="blood thin" d="M0 2q1 5-.5 9"/>',
    major: () => '<circle class="hole-ring" r="6"/><circle class="hole" r="3.2"/><path class="blood run" d="M-1 3q2 10 0 19"/>',
    crippling: () =>
      '<path class="hole" d="M-9-6l5-3 6 2 5 4-1 7-6 5-7-1-4-6z"/><path class="bone" d="M-3-2l3-3 2 3-3 2zM3 2l3-1 1 3-3 1z"/><path class="blood run" d="M-4 6q2 14 0 26M4 7q-1 10 1 20"/>',
  },
  burn: {
    minor: (u) =>
      `<path class="scorch" d="M-11-6c4-4 10-5 16-2 6 1 8 7 5 11-3 5-11 6-17 3-6-3-8-8-4-12z" fill="url(#${u}-scorch)"/><g class="blister"><circle cx="-3" cy="-1" r="1.4"/><circle cx="3" cy="2" r="1.1"/></g>`,
    major: (u) =>
      `<path class="scorch" d="M-13-8c6-5 16-5 22 0 6 5 6 13 0 17-7 5-18 4-23-2-4-5-4-11 1-15z" fill="url(#${u}-scorch)"/><path class="raw" d="M-8-4c4-3 10-3 13 0 4 3 3 8-1 10-5 2-11 1-13-2-2-3-2-6 1-8z"/>`,
    crippling: (u) =>
      `<path class="char" d="M-20-16c10-8 30-8 40 2 6 12 2 26-10 30-12 4-26 0-32-10-4-8-4-16 2-22z" fill="url(#${u}-char)"/><path class="ember" d="M-10-4l6 3 4-4 7 5M-6 8l5-2 6 3"/>`,
  },
};
/** A bite's symbol: the arc of the jaw, deeper with severity. */
const BITE = (severity: Severity) =>
  `<g class="bite s-${severity}"><path d="M-8 0a8 6 0 0 0 16 0"/><path class="fang" d="M-7 1v2.6M-3.5 3.4v2.8M0 4v2.8M3.5 3.4v2.8M7 1v2.6"/></g>`;

const GLYPH: Record<Kind, string> = {
  blunt: '<rect x="-3.5" y="-3.5" width="7" height="7"/>',
  cutting: '<path d="M-4 4L4-4"/>',
  piercing: '<circle r="3.5"/>',
  burn: '<path d="M0-4l4 7H-4z"/>',
};

// The atlases are drawn in a 1254-unit space whatever their pixel size; each wound cell is 627 units.
const DECALS: Record<Kind, [number, number]> = { cutting: [0, 0], piercing: [1, 0], blunt: [0, 1], burn: [1, 1] };
const DECAL_SIZE: Record<Severity, number> = { minor: 17, major: 30, crippling: 44 };
function woundDecal(kind: Kind, severity: Severity, w = DECAL_SIZE[severity], h = w, dx = 0, dy = 0): string {
  const [cx, cy] = DECALS[kind];
  return `<svg class="wound-decal decal-${kind}" x="${dx - w / 2}" y="${dy - h / 2}" width="${w}" height="${h}" viewBox="${cx * 627} ${cy * 627} 627 627" preserveAspectRatio="none" overflow="hidden"><image href="${ANATOMY.wounds}" width="1254" height="1254"/></svg>`;
}
type Treatment = 'wrap' | 'splint' | 'stump' | 'scar';
const TREATMENT_CROPS: Record<Treatment, string> = { wrap: '0 0 700 640', splint: '760 0 494 650', stump: '0 700 680 554', scar: '730 700 524 554' };
function treatmentDecal(kind: Treatment, w: number, h: number): string {
  return `<svg class="wound-decal treatment-${kind}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" viewBox="${TREATMENT_CROPS[kind]}" preserveAspectRatio="none" overflow="hidden"><image href="${ANATOMY.treatment}" width="1254" height="1254"/></svg>`;
}

const mirrorAttr = (m?: boolean) => (m ? ' transform="translate(200 0) scale(-1 1)"' : '');
const outlines = (list: Part[], cls = '') => list.map(([, d, m]) => `<path${cls ? ` class="${cls}"` : ''} d="${d}"${mirrorAttr(m)}/>`).join('');
const hash = (t: string) => [...t].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const drop = (x: number, y: number, i: number) =>
  `<g class="drip" transform="translate(${x} ${y})"><path class="drop" style="animation-delay:${((i * 0.73) % 2.2).toFixed(2)}s" d="M0 0q-1.8 2.8 0 4.6 1.8-1.8 0-4.6z"/></g>`;

function defs(u: string, art: Art, body: string, lost: Partial<Record<Region, boolean>>): string {
  const hatch = (s: string, c: string, g: number) =>
    `<pattern id="${u}-h-${s}" width="${g}" height="${g}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="${g}" height="${g}" fill="${c}" fill-opacity=".16"/><line x1="0" y1="0" x2="0" y2="${g}" stroke="${c}" stroke-width="1.5" stroke-opacity=".9"/></pattern>`;
  return (
    `<radialGradient id="${u}-bruise"><stop offset="0" stop-color="#4a1f3f" stop-opacity=".62"/><stop offset=".55" stop-color="#6b3d2a" stop-opacity=".34"/><stop offset="1" stop-color="#6b3d2a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${u}-bruise-deep"><stop offset="0" stop-color="#2d0c22" stop-opacity=".82"/><stop offset=".5" stop-color="#5a1f30" stop-opacity=".54"/><stop offset="1" stop-color="#5a1f30" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${u}-scorch"><stop offset="0" stop-color="#120a06" stop-opacity=".94"/><stop offset=".55" stop-color="#5a3314" stop-opacity=".62"/><stop offset="1" stop-color="#8a5a2a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${u}-stain"><stop offset="0" stop-color="#4a0404" stop-opacity=".62"/><stop offset=".6" stop-color="#6a0a0a" stop-opacity=".3"/><stop offset="1" stop-color="#6a0a0a" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="${u}-char" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#23160e"/><stop offset="1" stop-color="#080403"/></linearGradient>` +
    hatch('minor', '#3f6146', 6) +
    hatch('major', '#8e2323', 5) +
    hatch('crippling', '#241f1b', 4) +
    // Wounds stay on the painted body: clipped to their region and masked by the art's own alpha.
    `<mask id="${u}-body" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="400" style="mask-type:alpha"><image href="${body}" width="200" height="400"/></mask>` +
    ORDER.map((k) => `<clipPath id="${u}-clip-${k}">${outlines([...art[k].upper, ...(lost[k] ? [] : (art[k].lower ?? []))])}</clipPath>`).join('') +
    ORDER.map((k) => (['upper', 'lower'] as const).filter((p) => art[k][p]).map((p) => `<clipPath id="${u}-${k}-${p}">${outlines(art[k][p]!)}</clipPath>`).join('')).join('')
  );
}

const image = (u: string, k: Region, part: 'upper' | 'lower', body: string) =>
  `<image class="body-render" href="${body}" width="200" height="400" clip-path="url(#${u}-${k}-${part})"/>`;

/** Which drawn region a Critical Injury sits on: arms and legs by side, torso on the chest. */
export function regionOf(location: string, side: 'left' | 'right' | null): Region {
  if (location === 'torso') return 'chest';
  if (location === 'head') return 'head';
  const s = side === 'right' ? 'right' : 'left';
  return `${s}${location === 'arm' ? 'Arm' : 'Leg'}` as Region;
}

/** A row that takes the limb (critical-injuries.yaml: arm-lost-arm, leg-lost-leg). */
export const isLostLimbRow = (row: string) => /^(arm-lost-arm|leg-lost-leg)$/.test(row);

type Stump = 'bleeding' | 'dressed' | 'healed';

function stumpArt([x, y, w]: [number, number, number], state: Stump, k: Region): string {
  const leg = /Leg/.test(k);
  const side = k.startsWith('left') ? 1 : -1;
  if (state === 'bleeding') {
    const zig = Array.from({ length: 6 }, (_, i) => `l${((w * 2) / 6).toFixed(1)} ${i % 2 ? -2.4 : 2.4}`).join('');
    return (
      `<g class="stump bleeding" data-stump="${k}"><g class="wound-detail" transform="translate(${x} ${y})">${treatmentDecal('stump', w * 2.5, w * 0.9)}</g>` +
      `<g class="wound-symbol"><path class="torn" d="M${x - w} ${y - 1}${zig}"/><ellipse class="flesh" cx="${x}" cy="${y + 1}" rx="${w}" ry="${(w * 0.36).toFixed(1)}"/><circle class="bone" cx="${x}" cy="${y + 1}" r="${(w * 0.3).toFixed(1)}"/></g>` +
      `<path class="blood run" d="M${x - w * 0.5} ${y + 2}q1 ${leg ? 30 : 18} 0 ${leg ? 58 : 36}M${x + w * 0.3} ${y + 3}q-1 ${leg ? 20 : 12} 1 ${leg ? 42 : 26}"/>` +
      `<ellipse class="pool" cx="${x + side * (leg ? 6 : 16)}" cy="392" rx="${(w * 2.4).toFixed(1)}" ry="3.2"/></g>`
    );
  }
  if (state === 'dressed') return `<g class="stump dressed" data-stump="${k}" transform="translate(${x} ${y})">${treatmentDecal('wrap', w * 2.6, w * 0.8)}</g>`;
  return `<g class="stump healed" data-stump="${k}" transform="translate(${x} ${y})">${treatmentDecal('scar', w * 2.2, w * 0.65)}</g>`;
}

/** One wound's paint: treated ones dressed or splinted, open ones the atlas decal over their symbol. */
function woundBody(w: FigureInjury, k: Region, u: string): string {
  const limb = LIMB(k);
  const kind = TYPE[w.type];
  if (w.treated) {
    const splint = w.type === 'crush' && w.severity !== 'minor' && limb;
    return (
      '<g class="dressing-pad"><rect x="-12" y="-8" width="24" height="16" rx="2"/><path d="M-11-4H11M-11 0H11M-11 4H11M-7-7V7M0-7V7M7-7V7"/></g>' +
      (splint ? treatmentDecal('splint', 24, 42) : treatmentDecal('wrap', limb ? 30 : 34, limb ? 23 : 27))
    );
  }
  const decal =
    w.type === 'bite'
      ? woundDecal(kind, w.severity) + woundDecal(kind, w.severity === 'minor' ? 'minor' : 'major', DECAL_SIZE[w.severity] * 0.55, DECAL_SIZE[w.severity] * 0.55, DECAL_SIZE[w.severity] * 0.45, DECAL_SIZE[w.severity] * 0.2)
      : woundDecal(kind, w.severity);
  const symbol = w.type === 'bite' ? BITE(w.severity) : ART[kind][w.severity](u, limb, k);
  let body = `<g class="wound-detail">${decal}</g><g class="wound-symbol">${symbol}</g>`;
  // A diffuse rim and spatter around open cuts and punctures; bruises and burns stay dry.
  if ((kind === 'cutting' || kind === 'piercing') && w.severity !== 'minor') {
    let seed = hash(w.row + w.id) || 1;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    const spatter = Array.from({ length: 5 }, () => {
      const an = rnd() * Math.PI * 2;
      const r = 7 + rnd() * 8;
      return `<circle cx="${(Math.cos(an) * r).toFixed(1)}" cy="${(Math.sin(an) * r).toFixed(1)}" r="${(0.3 + rnd() * 0.7).toFixed(1)}"/>`;
    }).join('');
    body = `<ellipse class="stain" rx="14" ry="12" cy="2" fill="url(#${u}-stain)"/>${body}<g class="spatter">${spatter}</g>`;
  }
  return body;
}

/**
 * The soldier figure: each Critical Injury painted at its location and side, treated ones dressed,
 * untreated ones open, a lost limb cut away to its stump. `uid` keeps the SVG ids unique per open sheet.
 */
export function soldierFigure(injuries: readonly FigureInjury[], uid: string, ariaLabel: string, opts: SoldierFigureOptions = {}): { svg: string; pins: FigurePin[] } {
  const u = uid;
  const body = ANATOMY.cadet;
  const pins: FigurePin[] = [];
  const byRegion = new Map<Region, { w: FigureInjury; i: number }[]>(ORDER.map((k) => [k, []]));
  injuries.forEach((w, i) => byRegion.get(regionOf(w.location, w.side))!.push({ w, i }));

  const lost: Partial<Record<Region, boolean>> = {};
  const stump: Partial<Record<Region, { state: Stump; by: FigureInjury | null }>> = {};
  for (const k of ORDER) {
    if (!LIMB(k)) continue;
    const by = byRegion.get(k)!.find(({ w }) => isLostLimbRow(w.row))?.w ?? null;
    const healed = (opts.healedLost ?? []).some((h) => regionOf(h.location, h.side) === k);
    if (by) stump[k] = { state: by.treated ? 'dressed' : 'bleeding', by };
    else if (healed) stump[k] = { state: 'healed', by: null };
    lost[k] = !!stump[k];
  }

  let base = '';
  let hatches = '';
  let clin = '';
  let vis = '';
  let drips = '';
  for (const k of ORDER) {
    const a = HUMAN[k];
    const list = byRegion.get(k)!;
    const open = list.filter(({ w }) => !w.treated);
    const limb = LIMB(k);
    const crippled = (type: FigureInjury['type']) => limb && !lost[k] && open.some(({ w }) => w.severity === 'crippling' && w.type === type);
    const crushed = crippled('crush');
    const charred = crippled('burn');
    base +=
      `<g class="rg" data-region="${k}"><g class="piece upper">${image(u, k, 'upper', body)}</g>` +
      (a.lower ? `<g class="piece lower${lost[k] ? ' lost' : ''}">${image(u, k, 'lower', body)}</g>` : '') +
      '</g>';

    let inside = '';
    if (crushed || charred) {
      const [cx, cy] = a.cut!;
      inside += crushed
        ? `<g class="crush-limb wound-detail" transform="translate(${cx} ${cy + 27})">${woundDecal('blunt', 'crippling', 30, 66)}</g><g class="wound-symbol">${outlines(a.lower!, 'crush-fill')}</g>`
        : `<g class="char-limb wound-detail" transform="translate(${cx} ${cy + 35})">${woundDecal('burn', 'crippling', 38, 86)}</g><g class="wound-symbol">${outlines(a.lower!, 'char-fill')}</g>`;
    }
    list.forEach(({ w, i }, n) => {
      const kind = TYPE[w.type];
      const isStump = stump[k]?.by === w;
      const [x, y] = isStump ? [a.cut![0], a.cut![1]] : SPOTS[k][n % SPOTS[k].length];
      const hs: Severity = w.treated ? 'minor' : w.severity === 'minor' ? 'major' : 'crippling';
      clin += `<g class="glyph h-${hs}" transform="translate(${x} ${y})">${GLYPH[kind]}</g>`;
      const nudge = x < 100 ? -12 : x > 100 ? 12 : 0;
      pins.push({
        id: w.id,
        n: i + 1,
        treated: w.treated,
        label: w.label,
        left: `${Math.min(97, Math.max(3, ((x + nudge - VIEW.x) / VIEW.w) * 100)).toFixed(1)}%`,
        top: `${((y / 400) * 100).toFixed(1)}%`,
      });
      if (isStump) return;
      const turn = (hash(w.row + w.id) % 32) - 16;
      inside += `<g class="wound t-${w.type} s-${w.severity}${w.treated ? ' treated' : ''}" data-wound-id="${escapeAttr(w.id)}" transform="translate(${x} ${y}) rotate(${turn}) scale(${limb ? 0.9 : 1})">${woundBody(w, k, u)}</g>`;
      // Only an open cut, puncture or bite keeps bleeding on the page.
      if (!w.treated && w.severity !== 'minor' && (kind === 'cutting' || kind === 'piercing')) {
        drips += drop(x, y + (limb ? 14 : 18), i);
        if (/Leg/.test(k)) vis += `<ellipse class="pool" cx="${x + 4}" cy="392" rx="${w.severity === 'major' ? 9 : 15}" ry="2.4"/>`;
      }
    });
    if (list.length || lost[k]) {
      const worst: Severity = open.some(({ w }) => w.severity === 'crippling') || (lost[k] && stump[k]!.state === 'bleeding')
        ? 'crippling'
        : open.length
          ? 'major'
          : 'minor';
      hatches += `<g class="hatch h-${worst}" fill="url(#${u}-h-${worst})">${outlines([...a.upper, ...(lost[k] ? [] : (a.lower ?? []))])}</g>`;
    }
    if (inside) vis += `<g class="wounds" data-wounds="${k}" clip-path="url(#${u}-clip-${k})" mask="url(#${u}-body)">${inside}</g>`;
    if (stump[k]) {
      vis += stumpArt(a.cut!, stump[k]!.state, k);
      if (stump[k]!.state === 'bleeding') drips += drop(a.cut![0], a.cut![1] + 5, 1);
    }
  }
  const cls = ['fig', 'human', opts.dead ? 'dead' : '', opts.down && !opts.dead ? 'down' : ''].filter(Boolean).join(' ');
  const svg =
    `<svg class="${cls}" viewBox="${VIEW.x} 0 ${VIEW.w} 400" role="img" aria-label="${escapeAttr(ariaLabel)}">` +
    `<defs>${defs(u, HUMAN, body, lost)}</defs><g class="fig-base">${base}</g>` +
    `<g class="fig-clinical" mask="url(#${u}-body)">${hatches}${clin}</g><g class="fig-visceral">${vis}${drips}</g></svg>`;
  return { svg, pins };
}
const VIEW = { x: 28, w: 144 };

/** How heavy a row reads on the figure: lethal rows cripple, Down or long healing is major. */
export function severityOf(row: { lethal: boolean; instant_death?: boolean; down: string | boolean; healing_days: number; penaltyDice: number }): Severity {
  if (row.lethal || row.instant_death) return 'crippling';
  if (row.down || row.healing_days >= 14 || row.penaltyDice >= 2) return 'major';
  return 'minor';
}

// ------------------------------------------------------------------ the Titan

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

/** The Titan's eyes on the painted face. */
const EYES: [number, number][] = [[94, 23], [106, 23]];

/** The point on the figure a part's steam rises from. */
export function titanPartSpot(part: Pick<FigurePart, 'kind' | 'side'>): [number, number] {
  if (part.kind === 'eyes') return [100, 23];
  const k = `${part.side ?? 'left'}${part.kind === 'arm' ? 'Arm' : 'Leg'}` as Region;
  const c = TITAN[k].cut!;
  return [c[0], c[1]];
}

/**
 * The painted Titan (ADR-0027): each Body Part intact, wounded (a cut that steams), or broken (an arm
 * hangs from its wound, a leg is severed and lies beside it, the eyes are put out; heavy steam). The Gore
 * setting picks the decals, the symbols, or the hatching. Regions carry data-part (the stat block
 * index) for clicks. It draws only what the Body Part states already show.
 */
export function titanFigure(parts: readonly FigurePart[], uid: string, ariaLabel: string, napeLabel: string, opts: { dead?: boolean } = {}): string {
  const u = uid;
  const body = ANATOMY.titan;
  const partOf = (k: Region) => parts.find((p) => (k === 'head' ? p.kind === 'eyes' : `${p.side}${p.kind === 'arm' ? 'Arm' : 'Leg'}` === k)) ?? null;
  const lost: Partial<Record<Region, boolean>> = {};
  for (const k of ORDER) if (partOf(k)?.state === 'broken' && LIMB(k)) lost[k] = true;
  let base = '';
  let vis = '';
  let clin = '';
  for (const k of ORDER) {
    const a = TITAN[k];
    const part = partOf(k);
    const st = part?.state ?? 'intact';
    const arm = /Arm/.test(k);
    const side = k.startsWith('left') ? 1 : -1;
    let lower = '';
    if (a.lower) {
      const [cx, cy] = a.cut!;
      if (st === 'broken' && arm) {
        // The lower arm hangs from the break, pivoting where it was cut.
        lower = `<g class="piece lower hang" transform="rotate(${side * -24} ${cx} ${cy})">${image(u, k, 'lower', body)}</g>`;
      } else if (st === 'broken') {
        lower = `<g class="piece lower lost">${image(u, k, 'lower', body)}</g>`;
        const lie = `translate(${cx} 384) rotate(${side * -90}) scale(.62) translate(${-cx} ${-cy})`;
        vis += `<g class="lying" transform="${lie}">${image(u, k, 'lower', body)}<ellipse class="flesh" cx="${cx}" cy="${cy + 1}" rx="${a.cut![2]}" ry="4"/></g>`;
      } else lower = `<g class="piece lower">${image(u, k, 'lower', body)}</g>`;
    }
    const attr = part ? ` data-part="${part.index}"` : '';
    base += `<g class="rg${part ? ' part' : ''}"${attr} data-region="${k}"><g class="piece upper">${image(u, k, 'upper', body)}</g>${lower}</g>`;
    if (!part || st === 'intact') continue;
    const hs: Severity = st === 'wounded' ? 'major' : 'crippling';
    if (k === 'head') {
      clin += `<g class="hatch h-${hs}" fill="url(#${u}-h-${hs})"><path d="M82 12h36v18H82z"/></g><g class="glyph h-${hs}" transform="translate(100 6)">${GLYPH.cutting}</g>`;
      vis +=
        st === 'wounded'
          ? `<g class="wound" transform="translate(100 14) rotate(8)"><g class="wound-detail">${woundDecal('cutting', 'major', 24, 12)}</g><g class="wound-symbol"><path class="gash" d="M-18-2Q0-6 18 4L17 6Q0-2-17 1z"/><path class="tblood" d="M-8 2q1 6 0 10"/></g></g>${steam(100, 14, false)}`
          : EYES.map(([x, y]) => `<g class="wound" transform="translate(${x} ${y})"><g class="wound-detail">${woundDecal('piercing', 'major', 9, 9)}</g><g class="wound-symbol"><ellipse class="socket" rx="3.4" ry="2.6"/></g><path class="tblood g-only" d="M-1 3q1 9-1 16"/></g>`).join('') +
            steam(EYES[0][0], EYES[0][1], true) +
            steam(EYES[1][0], EYES[1][1], true);
      continue;
    }
    const [cx, cy, cw] = a.cut!;
    const spots = TITAN_SPOTS[k];
    clin += `<g class="hatch h-${hs}" fill="url(#${u}-h-${hs})">${outlines([...a.upper, ...(lost[k] ? [] : a.lower!)])}</g><g class="glyph h-${hs}" transform="translate(${cx} ${cy})">${GLYPH.cutting}</g>`;
    if (st === 'wounded') {
      const [x, y] = spots[1];
      vis += `<g class="wounds" clip-path="url(#${u}-clip-${k})" mask="url(#${u}-body)"><g class="wound" transform="translate(${x} ${y}) rotate(${side * 20})">${woundBody({ id: k, row: k, label: '', location: '', side: null, type: 'cut', severity: 'major', treated: false }, k, u)}</g></g>${steam(x, y, false)}`;
    } else if (arm) {
      vis += `<g class="wound"><g class="wound-detail" transform="translate(${cx} ${cy})">${treatmentDecal('stump', cw * 2.2, cw * 0.8)}</g><g class="wound-symbol"><ellipse class="flesh" cx="${cx}" cy="${cy}" rx="${cw}" ry="3.2"/><path class="bone" d="M${cx - 1.5} ${cy - 3}h3v6h-3z"/></g><path class="tblood" d="M${cx + side * -4} ${cy + 4}q2 14-1 26"/></g>${steam(cx, cy, true, 3)}`;
    } else {
      vis += `<g class="wound"><g class="wound-detail" transform="translate(${cx} ${cy})">${treatmentDecal('stump', cw * 2.5, cw * 0.9)}</g><g class="wound-symbol"><ellipse class="flesh" cx="${cx}" cy="${cy + 1}" rx="${cw}" ry="4"/><circle class="bone" cx="${cx}" cy="${cy + 1}" r="3.2"/></g><path class="tblood" d="M${cx - 3} ${cy + 4}q1 20-1 40"/><ellipse class="steam-bed" cx="${cx}" cy="${cy - 4}" rx="${cw + 4}" ry="5"/></g>${steam(cx, cy, true, 3)}`;
    }
  }
  const nape = `<g class="nape"><title>${escapeAttr(napeLabel)}</title><circle cx="100" cy="52" r="6.5"/><path d="M92 52h-5M108 52h5M100 45v-4"/></g>`;
  return (
    `<svg class="fig titan${opts.dead ? ' dead' : ''}" viewBox="-30 0 260 400" role="img" aria-label="${escapeAttr(ariaLabel)}">` +
    `<defs>${defs(u, TITAN, body, lost)}</defs><g class="fig-base">${base}</g>${nape}<g class="fig-clinical" mask="url(#${u}-body)">${clin}</g><g class="fig-visceral">${vis}</g><g class="puffs"></g></svg>`
  );
}
