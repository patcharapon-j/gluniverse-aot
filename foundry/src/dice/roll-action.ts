/**
 * Rolling an Action Catalog entry. Step 2d replaces this stub with the roll dialog and chat card
 * (core-plan section 1); the sheet already calls it from every quick-roll row.
 */
export interface RollActionOptions {
  /** Bonus Dice the player set on the sheet for this roll. */
  bonus?: number;
}

export async function rollAction(actor: any, entryId: string, options: RollActionOptions = {}): Promise<null> {
  const entry = CONFIG.WOF.actionCatalogById[entryId];
  ui.notifications.info(game.i18n.format('WOF.Sheet.roll.stub', { name: entry?.name ?? entryId, actor: actor?.name ?? '' }));
  console.debug('wings-of-freedom | rollAction (step 2d)', { actor: actor?.uuid, entryId, options });
  return null;
}
