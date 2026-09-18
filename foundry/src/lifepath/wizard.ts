/**
 * The Lifepath wizard's controller (foundry/docs/lifepath-wizard-plan.md): reads and writes the state
 * flag, runs every roll through the system's WofRoll (posted to chat, so Dice So Nice shows it), and
 * hands Finish to commit.ts. Every action reads the stored state fresh and runs in order per actor.
 */
import { actionIcon, iconPath } from '../art.ts';
import { SYSTEM_ID } from '../config.ts';
import type { LifepathCard } from '../dice/card.ts';
import { clock, postCard, saveCard } from '../dice/post.ts';
import { showDice, WofRoll } from '../dice/terms.ts';
import { d66, sixes, type LpTables } from '../rules/lifepath.ts';
import {
  confirmStep,
  goToStep,
  normalizeState,
  previousStep,
  pushNeeds,
  recordD66,
  recordOrder,
  recordPerformance,
  recordPush,
  recordTrial,
  replay,
  setChoice,
  type LifepathState,
  type StepId,
} from '../rules/lifepath-state.ts';
import { allowedProcedures, recordCampaignYear, worldYear } from './campaign.ts';
import { commitLifepath } from './commit.ts';

export const LIFEPATH_FLAG = 'lifepath';

const t = (key: string, data?: Record<string, unknown>): string => (data ? game.i18n.format(key, data) : game.i18n.localize(key));
export const lpTables = (): LpTables => CONFIG.WOF.lifepath as LpTables;
export const replayOpts = () => ({ allowed: allowedProcedures(), worldYear: worldYear() });

export function readState(actor: any): LifepathState {
  return normalizeState(actor.getFlag(SYSTEM_ID, LIFEPATH_FLAG));
}

export async function saveState(actor: any, state: LifepathState): Promise<void> {
  await actor.setFlag(SYSTEM_ID, LIFEPATH_FLAG, state);
}

/** What the Soldier sheet offers: open the wizard on an empty file, resume an unfinished one, or nothing. */
export function lifepathOffer(actor: any): { kind: 'open' | 'resume'; step: number } | null {
  if (actor?.type !== 'soldier' || !actor.isOwner) return null;
  const raw = actor.getFlag(SYSTEM_ID, LIFEPATH_FLAG);
  const state = normalizeState(raw);
  if (state.finished) return null;
  const started = !!raw && (state.procedure !== null || state.confirmed.length > 0);
  if (started) {
    const r = replay(state, lpTables(), replayOpts());
    return { kind: 'resume', step: r.rail.indexOf(r.current) + 1 };
  }
  const empty = ![...actor.items].some((i: any) => ['origin', 'specialty', 'talent'].includes(i.type));
  return empty ? { kind: 'open', step: 1 } : null;
}

const queues = new WeakMap<object, Promise<unknown>>();

/** Runs one action after the actor's previous one, reading the stored state fresh. */
function run(actor: any, fn: (s: LifepathState) => Promise<LifepathState | void>): Promise<void> {
  const prev = queues.get(actor) ?? Promise.resolve();
  const next = prev
    .catch(() => undefined)
    .then(async () => {
      const before = readState(actor);
      const after = await fn(before);
      if (after && after !== before) await saveState(actor, after);
    })
    .catch((err) => {
      console.error('wings-of-freedom | Lifepath', err);
      ui.notifications.error(t('WOF.Lifepath.error', { message: err?.message ?? String(err) }));
    });
  queues.set(actor, next);
  return next;
}

// ---------------------------------------------------------------- cards

function card(actor: any, fields: Partial<LifepathCard> & Pick<LifepathCard, 'title' | 'big' | 'label'>): LifepathCard {
  return {
    v: 1,
    kind: 'lifepath',
    actor: actor.uuid,
    actorName: actor.name,
    img: actor.img,
    time: clock(),
    ops: [],
    glyph: iconPath('brand-emblem'),
    d66: null,
    plain: [],
    dice: null,
    fresh: -1,
    pushes: 0,
    text: '',
    lines: [],
    flags: [],
    struck: false,
    ...fields,
  };
}

const attrName = (id: string) => t(`WOF.Attribute.${id}`);
const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

async function rollD66(): Promise<{ roll: any; tens: number; units: number }> {
  const R = WofRoll();
  const roll = new R(`1d6[${t('WOF.Lifepath.card.tens')}] + 1d6[${t('WOF.Lifepath.card.units')}]`);
  await roll.evaluate();
  const [tens, units] = roll.dice.map((d: any) => d.results[0].result as number);
  return { roll, tens, units };
}

// ---------------------------------------------------------------- actions

export function lifepathActions(actor: any) {
  const tb = lpTables;
  const o = replayOpts;
  return {
    choose: (key: string, value: unknown) => run(actor, async (s) => setChoice(s, key, value, tb(), o())),

    confirm: (step: StepId) =>
      run(actor, async (s) => {
        if (step === 'campaign') await recordCampaignYear(s.year);
        return confirmStep(s, step, tb(), o());
      }),

    goTo: (step: StepId) => run(actor, async (s) => goToStep(s, step, tb(), o())),

    back: () => run(actor, async (s) => goToStep(s, previousStep(s), tb(), o())),

    rollOrigin: () =>
      run(actor, async (s) => {
        const { roll, tens, units } = await rollD66();
        const next = recordD66(s, 'origin', { tens, units }, tb(), o());
        if (next === s) return s;
        const r = replay(next, tb(), o());
        const row = r.origin!.rolls[r.origin!.rolls.length - 1];
        await postCard(
          actor,
          card(actor, {
            title: t('WOF.Lifepath.step.origin'),
            d66: [tens, units],
            big: String(d66(tens, units)),
            label: row.row.name,
            text: row.kept ? row.row.attributes.map(attrName).join(', ') : t('WOF.Lifepath.card.rollAgain'),
            lines: row.kept ? [t('WOF.Lifepath.card.plusTwo', { a: attrName(row.row.attributes[0]), b: attrName(row.row.attributes[1]) })] : [row.row.condition ?? ''],
            struck: !row.kept,
            glyph: iconPath('brand-emblem'),
          }),
          [roll],
        );
        return next;
      }),

    rollEnlist: () =>
      run(actor, async (s) => {
        if (s.enlist.roll) return s;
        const { roll, tens, units } = await rollD66();
        const next = recordD66(s, 'enlist', { tens, units }, tb(), o());
        const row = replay(next, tb(), o()).enlist!.row!;
        await postCard(
          actor,
          card(actor, {
            title: t('WOF.Lifepath.step.enlist'),
            d66: [tens, units],
            big: String(d66(tens, units)),
            label: t('WOF.Lifepath.card.plusOne', { a: attrName(row.attribute) }),
            text: row.reason,
            lines: [t('WOF.Lifepath.card.drive', { name: row.drive.name })],
            glyph: iconPath('seal-wax'),
          }),
          [roll],
        );
        return next;
      }),

    rollEvent: (i: 0 | 1 | 2) =>
      run(actor, async (s) => {
        if (s.years[i].roll) return s;
        const { roll, tens, units } = await rollD66();
        const next = recordD66(s, i, { tens, units }, tb(), o());
        const d = replay(next, tb(), o()).years[i];
        const ev = d.event!;
        const year = tb().years[i];
        await postCard(
          actor,
          card(actor, {
            title: year.title,
            d66: [tens, units],
            big: String(d66(tens, units)),
            label: ev.name,
            text: ev.description,
            lines: [t('WOF.Lifepath.card.eventLine', { a: attrName(ev.attribute), merit: signed(ev.merit) })],
            glyph: actionIcon('performance-roll'),
          }),
          [roll],
        );
        return next;
      }),

    rollPerformance: (i: 0 | 1 | 2) =>
      run(actor, async (s) => {
        const r = replay(s, tb(), o());
        const perf = r.years[i]?.perf;
        if (!perf?.attribute || s.years[i].perf) return s;
        const roll = await WofRoll().rollPool({ base: perf.dice });
        const faces = roll.facesOf('base') as number[];
        const next = recordPerformance(s, i, faces, tb(), o());
        const d = replay(next, tb(), o()).years[i];
        await postCard(
          actor,
          card(actor, {
            title: t('WOF.Lifepath.card.performance', { year: tb().years[i].title }),
            dice: { base: faces, gear: [], stress: [] },
            big: String(sixes(faces)),
            label: t('WOF.Lifepath.card.merit', { merit: signed(d.perfMerit ?? 0) }),
            text: t('WOF.Lifepath.card.pool', { a: attrName(perf.attribute), n: perf.dice }),
            glyph: actionIcon('performance-roll'),
          }),
          [roll],
        );
        return next;
      }),

    rollOrder: (k: number) =>
      run(actor, async (s) => {
        const roll = await new (WofRoll())('1d6').evaluate();
        const d6 = roll.total as number;
        const next = recordOrder(s, k, d6, tb(), o());
        if (next === s) return s;
        await postCard(
          actor,
          card(actor, {
            title: t('WOF.Lifepath.card.order', { trial: tb().exam.trials[k].name }),
            plain: [d6],
            big: String(d6),
            label: t('WOF.Lifepath.card.orderLabel'),
            text: t('WOF.Lifepath.card.orderText'),
            glyph: actionIcon('squad-action'),
          }),
          [roll],
        );
        return next;
      }),

    rollTrial: (k: number) =>
      run(actor, async (s) => {
        const r = replay(s, tb(), o());
        const d = r.trials[k];
        if (!d?.pool || s.trials[k].dice) return s;
        const roll = await WofRoll().rollPool({ base: d.pool.base, gear: d.pool.gear, stress: d.pool.stress });
        const dice = roll.pool;
        let next = recordTrial(s, k, dice, tb(), o());
        if (next === s) return s;
        const msg = await postCard(actor, trialCard(actor, next, k), [roll]);
        next = { ...next, trials: next.trials.map((x, i) => (i === k ? { ...x, message: msg?.id ?? '' } : x)) };
        return next;
      }),

    push: (k: number, covered: boolean) =>
      run(actor, async (s) => {
        const need = pushNeeds(s, k, covered);
        const r = replay(s, tb(), o());
        if (!need || r.trials[k].push !== null) return s;
        const roll = await WofRoll().rollPool({ base: need.base, stress: need.stress, gear: need.gear });
        const next = recordPush(s, k, covered, { base: roll.facesOf('base'), stress: roll.facesOf('stress'), gear: roll.facesOf('gear') }, tb(), o());
        if (next === s) return s;
        const message = game.messages.get(s.trials[k].message);
        if (message) {
          await showDice(roll);
          await saveCard(message, trialCard(actor, next, k), [...message.rolls, roll]);
        } else {
          await postCard(actor, trialCard(actor, next, k), [roll]);
        }
        return next;
      }),

    finish: () => run(actor, async (s) => commitLifepath(actor, s)),

    closeFile: () =>
      run(actor, async (s) => {
        const next = confirmStep(s, 'squad', tb(), o());
        const comrade = next.finish.comrade.trim();
        if (comrade && comrade !== actor.system.drive_named_comrade) await actor.update({ 'system.drive_named_comrade': comrade });
        return next;
      }),

    reset: () =>
      run(actor, async () => {
        await actor.unsetFlag(SYSTEM_ID, LIFEPATH_FLAG);
      }),
  };
}

export type LifepathActions = ReturnType<typeof lifepathActions>;

function trialCard(actor: any, s: LifepathState, k: number): LifepathCard {
  const r = replay(s, lpTables(), replayOpts());
  const d = r.trials[k];
  const ts = s.trials[k];
  const flags: string[] = [];
  if (ts.covers.length) flags.push(t(ts.covers.length > 1 ? 'WOF.Roll.pushedTwice' : 'WOF.Roll.pushed'));
  if (ts.covers.some(Boolean)) flags.push(t('WOF.Lifepath.card.covered'));
  const entry = CONFIG.WOF.actionCatalogById[d.choice!.entry];
  const lines: string[] = [];
  if (ts.response) lines.push(t('WOF.Lifepath.exam.response'));
  if (d.pool?.talent) lines.push(t('WOF.Lifepath.card.talent', { name: d.pool.talent.name, n: d.pool.talent.dice }));
  return card(actor, {
    title: d.trial.name,
    dice: ts.dice,
    fresh: ts.fresh,
    pushes: ts.covers.length,
    big: String(d.successes ?? 0),
    label: t('WOF.Lifepath.card.needs', { entry: entry?.name ?? '', needs: d.trial.needs }),
    text: t('WOF.Lifepath.card.merit', { merit: signed(d.merit ?? 0) }),
    lines,
    flags,
    glyph: actionIcon(d.choice!.entry),
  });
}
