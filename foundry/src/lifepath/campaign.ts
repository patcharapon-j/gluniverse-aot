/**
 * The campaign's own Lifepath values (foundry/docs/lifepath-wizard-plan.md, section 2): the procedures
 * the GM allows (data/character/lifepath.yaml, campaign_choice) and the Campaign Year, both world
 * settings. A player's wizard records an unset Campaign Year through the active GM, whose client only
 * ever sets an unset year to a year in range.
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
  CONFIG.queries[QUERY] = async (req: { year?: unknown }) => {
    if (!game.user.isGM) throw new Error('only a GM records the Campaign Year');
    return recordYearHere(Number(req?.year));
  };
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
