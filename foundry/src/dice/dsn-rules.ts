/**
 * When Dice So Nice's own chat hooks may animate a roll card (pure). The system shows the dice a
 * card gains after posting (a Push, Gallows Humour, a Trial) itself, with just those dice, and
 * records how many of the message's rolls it showed; Dice So Nice's update hook would show them a
 * second time. Dice marked hidden (the Stress Response D6) are never shown.
 */

/** The flag (under the system's scope) holding how many of a message's rolls the system showed itself. */
export const SHOWN_ROLLS_FLAG = 'shownRolls';

export interface RollView {
  dice: { results: { hidden?: boolean }[] }[];
}

export function dsnHookAnimates(rolls: readonly RollView[], shownRolls: number): boolean {
  if (shownRolls > 0 && shownRolls >= rolls.length) return false;
  return rolls.slice(shownRolls).some((r) => r.dice.some((d) => d.results.some((x) => !x.hidden)));
}
