/**
 * The campaign's own Lifepath values (foundry/docs/lifepath-wizard-plan.md, section 2): the procedures
 * the GM allows (data/character/lifepath.yaml, campaign_choice), the Campaign Year, and the Graduation
 * Exam's board, all world settings. A player's wizard records an unset Campaign Year or an unrolled
 * Stage of the board through the active GM, whose client only ever sets one that is still unset.
 * The board is shared because every Cadet takes the same Trial under the same condition
 * (data/character/graduation-exam.yaml, board).
 */
import { SYSTEM_ID } from '../config.ts';
import type { LpTables, Procedure } from '../rules/lifepath.ts';

const QUERY = `${SYSTEM_ID}.campaign`;

const tables = (): LpTables => CONFIG.WOF.lifepath as LpTables;

export function registerCampaignSettings(): void {
  const choices = tables().campaignChoices;
  game.settings.register(SYSTEM_ID, 'campaignChoice', {
    name: 'WOF.Settings.campaignChoice.name',
    hint: 'WOF.Settings.campaignChoice.hint',
    scope: 'world',
    config: false,
    restricted: true,
    type: String,
    choices: Object.fromEntries(choices.map((c, i) => [c.id, `WOF.Settings.campaignChoice.option${i}`])),
    default: choices[0].id,
  });
  // 0 means the campaign has not recorded a Campaign Year yet.
  game.settings.register(SYSTEM_ID, 'campaignYear', {
    name: 'WOF.Settings.campaignYear.name',
    hint: 'WOF.Settings.campaignYear.hint',
    scope: 'world',
    config: false,
    restricted: true,
    type: Number,
    default: 0,
  });
  // Three D66 results, one per Exam Stage; 0 means that Stage has not been rolled.
  game.settings.register(SYSTEM_ID, 'examBoard', {
    name: 'WOF.Settings.examBoard.name',
    hint: 'WOF.Settings.examBoard.hint',
    scope: 'world',
    config: false,
    restricted: true,
    type: Array,
    default: [0, 0, 0],
  });
  CONFIG.queries[QUERY] = async (req: { year?: unknown; stage?: unknown; board?: unknown }) => {
    if (!game.user.isGM) throw new Error('only a GM records the campaign\'s Lifepath values');
    if (req?.stage !== undefined) return recordBoardHere(Number(req.stage), Number(req.board));
    return recordYearHere(Number(req?.year));
  };
}

const boardOk = (n: unknown): boolean => {
  const v = Number(n);
  return Number.isInteger(v) && v >= 11 && v <= 66 && v % 10 >= 1 && v % 10 <= 6;
};

/** The campaign's exam board: one D66 per Stage, or null where that Stage has not been rolled. */
export function worldBoard(): (number | null)[] {
  const raw = game.settings.get(SYSTEM_ID, 'examBoard');
  const list = Array.isArray(raw) ? raw : [];
  return [0, 1, 2].map((k) => (boardOk(list[k]) ? Number(list[k]) : null));
}

async function recordBoardHere(stage: number, roll: number): Promise<boolean> {
  if (![0, 1, 2].includes(stage) || !boardOk(roll)) return false;
  const now = worldBoard();
  if (now[stage] !== null) return false;
  now[stage] = roll;
  await game.settings.set(SYSTEM_ID, 'examBoard', now.map((x) => x ?? 0));
  return true;
}

/** Records one Stage of the exam board for the world if it has none: directly for a GM, through the active GM otherwise. */
export async function recordExamBoard(stage: number, roll: number): Promise<boolean> {
  if (worldBoard()[stage] !== null) return false;
  if (game.user.isGM) return recordBoardHere(stage, roll);
  const gm = game.users.activeGM;
  if (!gm) return false;
  try {
    return (await gm.query(QUERY, { stage, board: roll }, { timeout: 10_000 })) === true;
  } catch (err) {
    console.warn('wings-of-freedom | the GM could not record the Exam board', err);
    return false;
  }
}

/** The GM clears the campaign's exam board, so the next Cadet rolls it again. */
export async function clearExamBoard(stage: number | null = null): Promise<void> {
  if (!game.user.isGM) return;
  const now = worldBoard().map((x) => x ?? 0);
  if (stage === null) await game.settings.set(SYSTEM_ID, 'examBoard', [0, 0, 0]);
  else {
    now[stage] = 0;
    await game.settings.set(SYSTEM_ID, 'examBoard', now);
  }
}

/** The GM sets one Stage of the campaign's exam board by hand. */
export async function setExamBoard(stage: number, roll: number): Promise<void> {
  if (!game.user.isGM || ![0, 1, 2].includes(stage) || !boardOk(roll)) return;
  const now = worldBoard().map((x) => x ?? 0);
  now[stage] = roll;
  await game.settings.set(SYSTEM_ID, 'examBoard', now);
}

/** The procedures the campaign allows. */
export function allowedProcedures(): Procedure[] {
  const id = game.settings.get(SYSTEM_ID, 'campaignChoice');
  return tables().campaignChoices.find((c) => c.id === id)?.procedures ?? ['lifepath'];
}

/** The campaign's Campaign Year, or null. */
export function worldYear(): number | null {
  const y = Number(game.settings.get(SYSTEM_ID, 'campaignYear'));
  const { min, max } = tables().campaignYears;
  return y >= min && y <= max ? y : null;
}

async function recordYearHere(year: number): Promise<boolean> {
  const { min, max } = tables().campaignYears;
  if (worldYear() !== null || !Number.isInteger(year) || year < min || year > max) return false;
  await game.settings.set(SYSTEM_ID, 'campaignYear', year);
  return true;
}

/** Records the Campaign Year for the world if it has none: directly for a GM, through the active GM otherwise. */
export async function recordCampaignYear(year: number | null): Promise<boolean> {
  if (year === null || worldYear() !== null) return false;
  if (game.user.isGM) return recordYearHere(year);
  const gm = game.users.activeGM;
  if (!gm) return false;
  try {
    return (await gm.query(QUERY, { year }, { timeout: 10_000 })) === true;
  } catch (err) {
    console.warn('wings-of-freedom | the GM could not record the Campaign Year', err);
    return false;
  }
}
