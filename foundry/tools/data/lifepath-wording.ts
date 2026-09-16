/**
 * The Lifepath wizard's step text, read from the website's "Making Your Soldier" page (ADR-0020): the
 * numbered steps, bullets, and rule boxes the site shows, so the wizard words each step as the site
 * does. The page is MDX; this reads its Markdown lists and paragraphs and drops the components
 * around them (a glossary term keeps its word, a link its text). Bold stays as `**` for the wizard to
 * render. A section or box the wizard needs that the page no longer has fails the build.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPO_ROOT } from './load.ts';
import { blobSha } from './site-wording.ts';

export const LIFEPATH_PAGE = 'site/src/content/rules/making-your-soldier.mdx';

export interface WordItem {
  text: string;
  /** Indented bullets or lines under a list item. */
  sub: string[];
}
export interface WordBlock {
  kind: 'ol' | 'ul' | 'p';
  items: WordItem[];
}
export interface FlowStep {
  title: string;
  text: string;
  exit: string;
}
export interface LifepathWording {
  /** By the page's Subsection id. */
  sections: Record<string, WordBlock[]>;
  /** Rule boxes by title. */
  boxes: Record<string, WordBlock[]>;
  /** Step figures by id. */
  flows: Record<string, FlowStep[]>;
  sha: string;
}

/** The Subsections, boxes, and figures the wizard shows. */
export const NEEDED = {
  sections: ['before-the-lifepath', 'origin', 'why-you-enlisted', 'training-years', 'the-performance-roll', 'graduation', 'finishing', 'using-the-exam', 'how-the-exam-is-played', 'the-three-trials', 'the-build-steps', 'the-starting-squad', 'named-comrades'],
  boxes: ['Attribute cap', 'Talent cap', 'Talent limits', 'What only the Lifepath reaches'],
  flows: ['fig-lifepath', 'fig-graduation'],
} as const;

/** Inline MDX to plain text: glossary terms keep their word, links their text, other tags go. */
export function inline(s: string): string {
  return s
    .replace(/<GlossaryTerm\s+term="([^"]+)"(?:\s+[a-z]+="[^"]*")*\s*\/>/g, '$1')
    .replace(/<a\s[^>]*>([\s\S]*?)<\/a>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Markdown lists and paragraphs to blocks. */
export function blocks(md: string): WordBlock[] {
  const out: WordBlock[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push({ kind: 'p', items: [{ text: inline(para.join(' ')), sub: [] }] });
    para = [];
  };
  const last = () => out[out.length - 1];
  for (const raw of md.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim() || /^\s*<\/?[A-Z][^>]*>\s*$/.test(line) || /^\s*<[A-Z][\s\S]*\/>\s*$/.test(line)) {
      flush();
      continue;
    }
    const ol = /^(\d+)\.\s+(.*)$/.exec(line);
    const ul = /^-\s+(.*)$/.exec(line);
    const nested = /^\s+(?:-\s+|\d+\.\s+)?(.*)$/.exec(line);
    if (ol || ul) {
      flush();
      const kind = ol ? 'ol' : 'ul';
      const item = { text: inline((ol ? ol[2] : ul![1]) ?? ''), sub: [] };
      if (last()?.kind === kind) last().items.push(item);
      else out.push({ kind, items: [item] });
    } else if (nested && /^\s/.test(line) && last() && last().kind !== 'p' && !para.length) {
      last().items[last().items.length - 1].sub.push(inline(nested[1]));
    } else {
      para.push(line);
    }
  }
  flush();
  return out.filter((b) => b.items.every((i) => i.text));
}

function flowSteps(body: string): FlowStep[] {
  const steps: FlowStep[] = [];
  const re = /\{\s*title:\s*"([^"]*)",[\s\S]*?text:\s*"([^"]*)",\s*exit:\s*\{[^}]*?text:\s*"([^"]*)"\s*\}/g;
  for (const m of body.matchAll(re)) steps.push({ title: m[1].replace(/\.$/, ''), text: m[2], exit: m[3] });
  return steps;
}

export function parseLifepathPage(mdx: string): Omit<LifepathWording, 'sha'> {
  const body = mdx.replace(/^---[\s\S]*?---/, '').replace(/^import .*$/gm, '');
  const flows: Record<string, FlowStep[]> = {};
  for (const m of body.matchAll(/<StepFlow\s+id="([^"]+)"[\s\S]*?steps=\{\[([\s\S]*?)\]\}\s*\/>/g)) flows[m[1]] = flowSteps(m[2]);
  const noFlows = body.replace(/<StepFlow[\s\S]*?\]\}\s*\/>/g, '');
  const boxes: Record<string, WordBlock[]> = {};
  for (const m of noFlows.matchAll(/<RuleBox\b[^>]*\btitle="([^"]+)"[^>]*>([\s\S]*?)<\/RuleBox>/g)) boxes[m[1]] = blocks(m[2]);
  const noBoxes = noFlows.replace(/<RuleBox\b[\s\S]*?<\/RuleBox>/g, '');
  const sections: Record<string, WordBlock[]> = {};
  for (const m of noBoxes.matchAll(/<Subsection\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/Subsection>/g)) sections[m[1]] = blocks(m[2]);
  return { sections, boxes, flows };
}

export function loadLifepathWording(read: (p: string) => string = (p) => readFileSync(resolve(REPO_ROOT, p), 'utf8')): LifepathWording {
  const parsed = parseLifepathPage(read(LIFEPATH_PAGE));
  for (const id of NEEDED.sections) if (!parsed.sections[id]?.length) throw new Error(`${LIFEPATH_PAGE} has no "${id}" section with text. The Lifepath wizard shows it; update foundry/tools/data/lifepath-wording.ts.`);
  for (const id of NEEDED.boxes) if (!parsed.boxes[id]?.length) throw new Error(`${LIFEPATH_PAGE} has no "${id}" box. The Lifepath wizard shows it; update foundry/tools/data/lifepath-wording.ts.`);
  for (const id of NEEDED.flows) if (!parsed.flows[id]?.length) throw new Error(`${LIFEPATH_PAGE} has no "${id}" step figure. The Lifepath wizard shows it; update foundry/tools/data/lifepath-wording.ts.`);
  const pick = <T>(all: Record<string, T>, ids: readonly string[]) => Object.fromEntries(ids.map((id) => [id, all[id]]));
  return {
    sections: pick(parsed.sections, NEEDED.sections),
    boxes: pick(parsed.boxes, NEEDED.boxes),
    flows: pick(parsed.flows, NEEDED.flows),
    sha: blobSha(LIFEPATH_PAGE),
  };
}

/** Every sentence of the wording, for the text guard. */
export function wordingTexts(w: Pick<LifepathWording, 'sections' | 'boxes' | 'flows'>): [string, string][] {
  const out: [string, string][] = [];
  const add = (where: string, list: WordBlock[]) => list.forEach((b) => b.items.forEach((i) => [i.text, ...i.sub].forEach((x) => out.push([where, x.replace(/\*\*/g, '')]))));
  for (const [id, list] of Object.entries(w.sections)) add(`Making Your Soldier, "${id}"`, list);
  for (const [id, list] of Object.entries(w.boxes)) add(`Making Your Soldier, the "${id}" box`, list);
  for (const [id, list] of Object.entries(w.flows)) list.forEach((s) => [s.title, s.text, s.exit].forEach((x) => out.push([`Making Your Soldier, ${id}`, x])));
  return out;
}
